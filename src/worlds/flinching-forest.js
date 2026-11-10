import*as i from"three";import{makePath as sa,clamp as W,lerp as G,smoothstep as y}from"../kit/core.js";import{buildHero as ra,heroKit as _}from"../parts/flinching-forest.js";const le=Math.PI*2,la=1676,I=11,Re=24,T=new i.Vector3(-40,0,1060),Be=Math.PI,ca=[{key:"crimson",pal:["#E4DCCB","#D8283A","#E66E58","#F6C453","#7FD1C2","#17414A","#DDF3EE"],zenith:"#4FB5A4",mid:"#7FD1C2",horizon:"#DDF3EE",fill:"#8FD6C8",sun:"#FFF4DA",sand:"#D6CCB6",pool:"#3FA890",cloudTop:"#FFF6E2",cloudBase:"#7FA69C",glowA:[.95,.3,.09],glowB:[.85,.07,.04]},{key:"saffron",pal:["#E9E1CF","#C4237C","#F0A030","#FFE08A","#B7A8E6","#3A2A5E","#EDE6FA"],wine:"#6A1048",zenith:"#8F7FD6",mid:"#B9ABE8",horizon:"#EFE7FA",fill:"#B4A6E8",sun:"#FFF0D2",sand:"#DCD0BC",pool:"#7C6CC8",cloudTop:"#FFF4E6",cloudBase:"#8C82B4",glowA:[1,.55,.1],glowB:[.9,.1,.35]},{key:"indigo",pal:["#E8C6C0","#6258DC","#F4D9EF","#FFD27A","#F0CC8E","#5A2E48","#FBF1DC"],wine:"#6C68C4",zenith:"#DFAA60",mid:"#EFCB8C",horizon:"#FBEFD4",fill:"#DCC2D0",sun:"#FFF6E6",core:.55,sand:"#E6D2BE",pool:"#6E78B8",cloudTop:"#FFF8EA",cloudBase:"#94708C",glowA:[.95,.85,.8],glowB:[.5,.42,1]}],te=`
  uniform vec4 uClA[${I}];      // centre x, centre z, half-length along the wind, half-width across it
  uniform vec4 uClB[${I}];      // seed, speed m/s, heal time s, strength 0-1
  uniform vec4 uDisc[${Re}];   // skysail shadow: x, z, heading x, heading z (speed 14 m/s, radius 4 m)
  uniform vec4 uLat;              // mackerel lattice: cell length, cell width, offset along the wind, strength
  uniform vec2 uWindDir;
  uniform float uVeil;            // rare event: the whole plateau half-closes in one breath
  uniform vec4 uTr;               // the hollow's own train of small cloud shadows: cell length, cell width, offset along the wind (from the clock), strength
  uniform vec4 uTrSeg;            // the hollow's axis (a.xz, b.xz); the train lives within uTrRad of it
  uniform vec3 uTrRad;            // inner radius, outer radius, speed m/s
  float healF(float t) { t = clamp(t, 0., 1.); return clamp(t * t * (3. - 2. * t) + 0.09 * sin(9. * t) * (1. - t), 0., 1.); }
  // q: position in the source's frame (x downwind, y across). Returns (S mask, R).
  vec3 shadeSrc(vec2 q, float a, float b, float speed, float healT, float seed, float delay, float tclose, float soft, float lin) {
    float y = q.y / max(b, 1.);
    if (abs(y) >= 1.) return vec3(0.);
    float wob = 1. + 0.16 * sin(q.y * 0.031 + seed * 17.) + 0.08 * sin(q.y * 0.083 + seed * 5.);   // crosswind only: a rigid outline
    float e = sqrt(max(0., 1. - y * y)) * wob;
    float x = q.x / max(a, 1.);
    float k = a / max(speed, 1.);
    float tin = max(0., (e - x) * k - delay);
    float tout = max(0., (-e - x) * k - delay);
    float rc = clamp(tin / max(tclose, 0.05), 0., 1.);
    float R = mix(rc * rc * (3. - 2. * rc), rc, lin) * (1. - healF(tout / max(healT, 0.1))) * smoothstep(0., 0.3, e);
    float S = smoothstep(-soft, soft, min((e - abs(x)) * a, (1. - abs(y)) * b - soft));
    float px = (tin - tclose) / 1.5;
    return vec3(S, R, smoothstep(0., 0.25, px) * (1. - smoothstep(0.45, 1., px)) * smoothstep(0., 0.3, e));
  }
  vec3 shade(vec2 p, float seed) {
    float S = 0., R = 0., Pf = 0.;
    float delay = 0.15 * fract(seed * 7.31);
    vec2 wp = vec2(-uWindDir.y, uWindDir.x);
    for (int i = 0; i < ${I}; i++) {
      vec4 A = uClA[i], B = uClB[i];
      if (B.w <= 0.) continue;
      vec2 d = p - A.xy;
      vec3 r = shadeSrc(vec2(dot(d, uWindDir), dot(d, wp)), A.z, A.w, B.y, B.z, B.x, delay, 0.8, 4., 0.);
      S = max(S, r.x * B.w); R = max(R, r.y * B.w); Pf = max(Pf, r.z * B.w);
    }
    if (uLat.w > 0.) {
      vec2 q = vec2(dot(p, uWindDir) - uLat.z, dot(p, wp));
      float row = floor(q.y / uLat.y + 0.5);
      float qx = q.x + fract(row * 0.37) * uLat.x;
      float c0 = floor(qx / uLat.x + 0.5);
      for (int j = 0; j < 2; j++) {
        float c = c0 + float(j);
        float h = fract(sin(c * 12.9898 + row * 78.233) * 43758.5453);
        if (h < 0.22) continue;
        vec2 l = vec2(qx - (c + (h - 0.6) * 0.3) * uLat.x, q.y - (row + (fract(h * 9.7) - 0.5) * 0.25) * uLat.y);
        vec3 r = shadeSrc(l, uLat.x * (0.2 + 0.14 * fract(h * 5.3)), uLat.y * (0.3 + 0.12 * fract(h * 3.1)), 50., 3., h * 9., delay, 0.8, 5., 0.);
        S = max(S, r.x * uLat.w); R = max(R, r.y); Pf = max(Pf, r.z);
      }
    }
    if (uTr.w > 0.) {
      vec2 sd = uTrSeg.zw - uTrSeg.xy;
      float st = clamp(dot(p - uTrSeg.xy, sd) / max(dot(sd, sd), 1.), 0., 1.);
      if (length(p - uTrSeg.xy - sd * st) < uTrRad.y + 90.) {
        vec2 q = vec2(dot(p, uWindDir) - uTr.z, dot(p, wp));
        float row = floor(q.y / uTr.y + 0.5);
        float qx = q.x + fract(row * 0.37) * uTr.x;
        float c0 = floor(qx / uTr.x + 0.5);
        for (int j = 0; j < 2; j++) {
          float c = c0 + float(j);
          float h = fract(c * 0.618034 + row * 0.754878 + 0.31);      // exact in single precision, so every machine draws the same train
          vec2 cen = vec2((c + (h - 0.5) * 0.2) * uTr.x, (row + (fract(h * 9.7) - 0.5) * 0.2) * uTr.y);
          vec2 l = vec2(qx - cen.x, q.y - cen.y);
          // the cloud thins away as it drifts out of the hollow
          vec2 cw = uWindDir * (cen.x - fract(row * 0.37) * uTr.x + uTr.z) + wp * cen.y;
          float ct = clamp(dot(cw - uTrSeg.xy, sd) / max(dot(sd, sd), 1.), 0., 1.);
          float kk = (1. - smoothstep(uTrRad.x, uTrRad.x + 22., length(cw - uTrSeg.xy - sd * ct))) * uTr.w;
          if (kk <= 0.) continue;
          vec3 r = shadeSrc(l, uTr.x * (0.26 + 0.05 * fract(h * 5.3)), uTr.y * (0.38 + 0.07 * fract(h * 3.1)), uTrRad.z, 6.5, h * 9., delay * 13., 6., 1.1, 1.);
          S = max(S, r.x * kk); R = max(R, r.y * kk); Pf = max(Pf, r.z * kk);
        }
      }
    }
    for (int i = 0; i < ${Re}; i++) {
      vec4 D = uDisc[i];
      vec2 d = p - D.xy;
      if (dot(d, d) > 6400.) continue;
      vec3 r = shadeSrc(vec2(dot(d, D.zw), dot(d, vec2(-D.w, D.z))), 4.5, 4.5, 14., 4., 0.3, delay, 0.8, 4., 0.);
      S = max(S, r.x * 0.8); R = max(R, r.y); Pf = max(Pf, r.z * 0.6);
    }
    R = max(R, 0.45 * uVeil); S = max(S, 0.6 * uVeil);
    return vec3(0.85 * S, R, Pf);
  }
`,ua=l=>(l=W(l,0,1),W(l*l*(3-2*l)+.09*Math.sin(9*l)*(1-l),0,1)),Ao=(l,w,O)=>{const Y=l/w;return Math.abs(Y)>=1?0:Math.sqrt(Math.max(0,1-Y*Y))*(1+.16*Math.sin(l*.031+O*17)+.08*Math.sin(l*.083+O*5))};function Mt(l,w,O,Y,ce,Z,We,b){b.S=0,b.R=0;const Ke=w/Y;if(Math.abs(Ke)>=1)return b;const N=Ao(w,Y,We),p=l/O,oe=O/ce,L=Math.max(0,(N-p)*oe),Ve=Math.max(0,(-N-p)*oe);return b.R=y(0,.8,L)*(1-ua(Ve/Z))*y(0,.3,N),b.S=y(-4,4,Math.min((N-Math.abs(p))*O,(1-Math.abs(Ke))*Y-4)),b}const Me=(l,w)=>2.6*Math.sin(l*.011+1.3)*Math.sin(w*.009+.4)+1.6*Math.sin((l+w)*.023+2)-1.5,da=(l,w)=>Math.sin(l*.043+2.2*Math.sin(w*.019+.7))*Math.sin(w*.037+1.7+1.8*Math.sin(l*.015)),va=(l,w)=>Math.sin(l*.0105+2.1*Math.sin(w*.0061+1.3))*Math.sin(w*.0092+1.7*Math.sin(l*.0057+.4)),fa=(l,w)=>Math.min(Math.abs(Math.sin(l*.009+1.9*Math.sin(w*.0052+.8)+.7*Math.sin(w*.013)))/.07,Math.abs(Math.sin(w*.0075+1.6*Math.sin(l*.0048+2)+.5))/.055),Ct=`
  float gladeF(vec2 p) { return sin(p.x * 0.0105 + 2.1 * sin(p.y * 0.0061 + 1.3)) * sin(p.y * 0.0092 + 1.7 * sin(p.x * 0.0057 + 0.4)); }
  float laneF(vec2 p) { return min(abs(sin(p.x * 0.009 + 1.9 * sin(p.y * 0.0052 + 0.8) + 0.7 * sin(p.y * 0.013))) / 0.07, abs(sin(p.y * 0.0075 + 1.6 * sin(p.x * 0.0048 + 2.0) + 0.5)) / 0.055); }
  float groundY(vec2 p) { return 2.6 * sin(p.x * 0.011 + 1.3) * sin(p.y * 0.009 + 0.4) + 1.6 * sin((p.x + p.y) * 0.023 + 2.0) - 1.5; }
  float poolF(vec2 p) { return sin(p.x * 0.043 + 2.2 * sin(p.y * 0.019 + 0.7)) * sin(p.y * 0.037 + 1.7 + 1.8 * sin(p.x * 0.015)); }
`;var ga={id:"flinching-forest",name:"The Flinching Forest",category:"alien",weirdness:.55,media:["air","open"],async build(l){const{rng:w,noise:O,renderer:Y}=l,ce=l.vary||{},Z=W(l.quality?.detail??1,.5,1),We=W(ce.density??1,.7,1.3),b=new i.Scene,Ke=[],N=w.fork("clearing"),p=ca[N.int(0,2)],oe=N.pick(["cumulus","cumulus","mackerel","three"]);let L=N.chance(.3);(ce.hour==="golden"||ce.hour==="dawn")&&(L=!0),ce.hour==="day"&&(L=!1);const Ve=N.chance(.3),_e=N.pick([3,6,6,9]),Do=!!ce.rare,M=p.pal.map(e=>new i.Color(e)),A=e=>new i.Color(e),Je=(L?24:56)*Math.PI/180,ae=new i.Vector3(.985*Math.cos(Je),Math.sin(Je),.17*Math.cos(Je)).normalize(),et=A(p.sun).multiplyScalar(L?1.12:1.15);L&&et.multiply(new i.Color(1,.86,.66));const zt=A(p.fill).lerp(A("#ffffff"),.14).multiplyScalar(L?.62:.7),Le=A(p.horizon).lerp(A(p.mid),.42);b.fog=new i.FogExp2(Le,7e-4),b.background=Le.clone();const K=new i.Vector2(-.8,.6),me=new i.Vector2(-K.y,K.x),Tt=e=>e.clone().applyAxisAngle(new i.Vector3(0,1,0),Be).add(T),ie=w.range(.8,1.15)*w.sign(),ko=[[0,104,0],[0,103,70],[1,95,140],[3,74,200],[5,45,258],[3*ie,25,310],[-7*ie,21,356],[6*ie,20.5,404],[-6*ie,20.5,452],[3*ie,21.5,498],[6,45,546],[3,60,596],[-2,76,650],[-10,88,712],[-24,84,768],[-34,74,815],[-39,67,858],[-40,75,898],[-40,104,940],[-40,128,975],[-40,144,1002],[-40,150,1030],[-40,150,1060]];await l.yield();const k=sa(ko);await l.yield();const At=la/k.length,V=46/At,E=e=>e*At,x=e=>1-e/k.length,Q=(e,t)=>k.pointAt(e,t||new i.Vector3),U=new i.Vector4;{const e=Q(E(.252)),t=Q(E(.284));U.set(e.x+11*Math.sign(ie),e.z,t.x-12*Math.sign(ie),t.z)}const tt=(e,t)=>{const s=e-U.x,o=t-U.y,a=e-U.z,n=t-U.w;return Math.max(da(e,t),.95*Math.max(Math.exp(-(s*s+o*o)/1500),Math.exp(-(a*a+n*n)/1100)))};await l.yield();const P=await ra(l,{palette:p.pal,detail:Z,wine:p.wine,glowA:p.glowA,glowB:p.glowB,core:p.core,sunDir:ae.clone()});P.object.position.copy(T),P.object.position.y=Me(T.x,T.z)-.6,P.object.rotation.y=Be,P.uniforms.uSunCol.value.copy(et),P.uniforms.uFill.value.copy(zt),P.uniforms.uWind.value.set(K.x,0,K.y).applyAxisAngle(new i.Vector3(0,1,0),-Be),P.setFlinch(0,0,0,0,0),b.add(P.object),await l.yield(),await l.yield();const ue=(e,t)=>e*K.x+t*K.y,pe=(e,t)=>e*me.x+t*me.y,R=[],S=w.fork("clouds");{const e=S(),t=130,s=110,o=x(280)*V;R.push({a:s,b:t,cy:pe(T.x,T.z)+S.range(-30,30)*.4,seed:e,speed:50,heal:4,k:1,cx0:ue(T.x,T.z)-Ao(0,t,e)*s-50*o})}const ot={S:0,R:0},Fo=(e,t,s,o,a=-1)=>{let n=0,u=0;const v=ue(e,t),d=pe(e,t);for(let c=0;c<R.length;c++){if(c===a)continue;const r=R[c];Mt(v-(r.cx0+r.speed*s),d-r.cy,r.a,r.b,r.speed,r.heal,r.seed,ot),n=Math.max(n,ot.S*r.k),u=Math.max(u,ot.R)}return o.S=n*.85,o.R=u,o};{const e=.08*V,t=L?-70:0,s=300,o=22;R.push({a:85,b:100,cy:pe(t,s),cx0:ue(t,s)-o*e,seed:S(),speed:o,heal:4,k:1,alt:L?90:124,entry:1})}{const e=oe==="cumulus"?5:oe==="three"?1:0,t=[],s=new i.Vector3;for(let a=0;a<=1;a+=.012)Q(a,s),t.push([s.x,s.z,a*V]);for(let a=.3;a<=1;a+=.02)t.push([T.x,T.z,a*V]);for(let a=.2;a<=.5;a+=.012)Q(a,s),t.push([s.x+75,s.z,a*V],[s.x-75,s.z,a*V]);const o={S:0,R:0};for(let a=0,n=0;a<3&&n<240;n++){const u=S.range(470,900),v=S.sign()*S.range(.16,.5)*u+(L?-60:0),d=S.range(12,20),c={a:S.range(58,92),b:S.range(70,112),seed:S(),speed:d,heal:4,k:1,cy:pe(v,u),cx0:ue(v,u)-d*.05*V,alt:L?S.range(110,150):S.range(140,210)};let r=!0;const h=c.alt/Math.max(ae.y,.2);for(let f=.1;f<=1.001&&r;f+=.03){Q(f,s);const m=c.cx0+d*f*V,C=K.x*m+me.x*c.cy+ae.x*h,z=K.y*m+me.y*c.cy+ae.z*h,D=T.x-s.x,X=T.z-s.z,ee=W(((C-s.x)*D+(z-s.z)*X)/Math.max(D*D+X*X,1),0,1.3);Math.hypot(C-s.x-D*ee,z-s.z-X*ee)<c.b+(f<.4?50:110)&&(r=!1),Math.hypot(C-s.x,z-s.z)<c.b+190&&(r=!1)}for(const f of R){if(!f.alt)continue;const m=f.cx0+f.speed*.05*V;if(Math.hypot(m-ue(v,u),f.cy-c.cy)<330){r=!1;break}}if(r){for(const[f,m,C]of t)if(Mt(ue(f,m)-(c.cx0+d*C),pe(f,m)-c.cy,c.a+30,c.b+30,d,4,c.seed,o),o.S>.01||o.R>.01){r=!1;break}}r&&(R.push(c),a++),(n&7)===7&&await l.yield()}await l.yield();for(let a=0,n=0;a<e&&n<300;n++){const u=oe==="three",v={a:u?S.range(150,190):S.range(60,110),b:u?S.range(280,340):S.range(70,120),seed:S(),speed:50,heal:4,k:1,cy:S.range(-750,750),cx0:S.range(-500,1300)-50*S.range(0,V)};R.push(v);let d=!0;const c=R.length-1;for(const[r,h,f]of t)if(Mt(ue(r,h)-(v.cx0+50*f),pe(r,h)-v.cy,v.a+30,v.b+30,50,4,v.seed,o),o.S>.01||o.R>.01){d=!1;break}d?a++:R.pop(),(n&7)===7&&await l.yield()}}await l.yield();const Dt=new i.Vector4(330,250,0,oe==="mackerel"?1:0),kt=4.5,Ft=3276,Pt=new i.Vector4(100,130,Ft,1),g={uClA:{value:Array.from({length:I},()=>new i.Vector4(0,0,1,1))},uClB:{value:Array.from({length:I},()=>new i.Vector4(0,50,4,0))},uDisc:{value:Array.from({length:Re},()=>new i.Vector4(1e5,1e5,1,0))},uLat:{value:Dt},uWindDir:{value:K},uVeil:{value:0},uTr:{value:Pt},uTrSeg:{value:new i.Vector4(3,225,0,440)},uTrRad:{value:new i.Vector3(105,165,kt)},uCamP:{value:new i.Vector3(0,58,0)},uCamT:{value:new i.Vector3(0,0,1)},uCamSpeed:{value:31},uTime:{value:0},uSunDir:{value:ae},uSunCol:{value:et},uFill:{value:zt},uTeal:{value:M[5]},uShade:{value:0},uRes:{value:new i.Vector2(800,450)},uStand:{value:new i.Vector4(0,0,0,1)},uStandW:{value:K},uGold:{value:M[3]}};{const e=l.core.makeRng(l.core.hashSeed("stands:"+l.seed)),t=e.range(0,le),s=e.range(0,le),o=e.range(0,le);g.uStand.value.set(t,s,o,1)}R.forEach((e,t)=>{t<I&&g.uClB.value[t].set(e.seed,e.speed,e.heal,e.k)});const J=()=>i.UniformsUtils.clone(i.UniformsLib.fog),Rt=(e,t,s)=>{const o=e.cx0+e.speed*t;return s.set(K.x*o+me.x*e.cy,0,K.y*o+me.y*e.cy)},Po=new i.Vector3,Bt=e=>{const t=Po;for(let s=0;s<Math.min(I,R.length);s++){const o=R[s];Rt(o,e,t),g.uClA.value[s].set(t.x,t.z,o.a,o.b)}Dt.z=50*e},Ro=e=>{Pt.z=Ft+kt*e};Bt(0);const q=w.fork("layout"),Wt=(e,t,s,o,a,n)=>{const u=a-s,v=n-o,d=W(((e-s)*u+(t-o)*v)/(u*u+v*v),0,1);return Math.hypot(e-s-u*d,t-o-v*d)},Bo=(e,t)=>Math.min(Wt(e,t,0,0,-4,690),Wt(e,t,-4,690,T.x,T.z),Math.max(0,Math.hypot(e-T.x,t-T.z)-110)),at=11.5/Math.sqrt(W(We,.85,1.1)),Wo=at*.866,j=[-35,530],Ne=1180,xe=[],Ce=[];let Kt=0;for(let e=j[1]-Ne;e<=j[1]+Ne;e+=Wo,Kt++){const t=Math.sqrt(Math.max(0,Ne*Ne-(e-j[1])*(e-j[1])));for(let s=j[0]-t+(Kt&1)*at*.5;s<=j[0]+t;s+=at){const o=s+q.range(-2.4,2.4),a=e+q.range(-2.4,2.4),n=Bo(o,a),u=n<170?1:n<520?G(1,.26,(n-170)/350):G(.26,.1,W((n-520)/300,0,1)),v=q();if(n>860||v>u*(n<60?1:.55+.45*Z))continue;{const ee=(o-T.x)/74,To=(a-T.z)/32;if(ee*ee+To*To<1)continue}if(tt(o,a)>.84||n>55&&(va(o,a)>.86||fa(o,a)<1))continue;let d=n,c=0,r=400;if(n<215){const ee=k.nearestXZ(o,a);d=ee.dist,c=ee.u,r=ee.y}const h=O.fbm2(o*.0042+7,a*.0042,3);let f=38+G(4,22,y(50,320,d))*h+q.range(-1.2,1.2);if(d<9.5){if(r-12<16)continue;f=Math.min(f,r-12)}else d<30&&c>.47&&c<x(250)&&(f=Math.min(f,r-9+(d-9.5)*.55));const m=n<215?y(.19,.24,c)*(1-y(E(.3),E(.336),c))*(1-y(115,205,d)):0,C=f;m>0&&(f=G(f,8+11.5*(.5+.5*O.n2(o*.08,a*.08))+7*y(55,180,d),m));const z=W(C*.34,4,25)*q.range(.86,1.1)*(1-.25*m),D=1/Math.sqrt(u),X={x:o,z:a,y:Me(o,a),H:Math.max(2.5,f-.7*z),R:W(C*.028,.6,1.5)*q.range(.85,1.2)*(1-.15*m),Hp:z,Rp:W(z*q.range(.42,.52),2.5,7.4)*D,hand:q.sign(),seed:q(),hue:W(.3*q()*q()+.7*(.5+.9*O.fbm2(o*.0065+31,a*.0065+5,2)),0,1),d,pu:c,grow:D};d<56?xe.push(X):Ce.push(X)}await l.yield()}await l.yield(),await l.yield(),xe.sort((e,t)=>e.d-t.d),await l.yield();const H=Math.min(xe.length,Math.round(725*(.7+.3*Z)));for(let e=H;e<xe.length;e++)Ce.push(xe[e]);const ze=xe.slice(0,H),it=[];{const e=Math.sign(ie),t=new i.Vector3,s=new i.Vector3;for(const[o,a,n]of[[.34,31,e],[.34,47,-e],[.43,31,-e],[.43,47,e],[.4,30,e],[.3,34,-e]]){Q(o,t),Q(o+22/k.length,s);let u=s.x-t.x,v=s.z-t.z;const d=Math.hypot(u,v)||1;u/=d,v/=d;let c=a*.14,r=0,h=0,f=null;for(let z=0;z<14&&(r=t.x+u*a+n*c*v,h=t.z+v*a-n*c*u,f=k.nearestXZ(r,h),!(f.dist>=7.6));z++)c+=1.2;let m=null,C=1e9;for(const z of ze){if(z.perch)continue;const D=Math.hypot(z.x-r,z.z-h);D<C&&(C=D,m=z)}m&&(m.perch=1,m.x=r,m.z=h,m.y=Me(r,h),m.pu=f.u-30/k.length,m.d=f.dist,m.H=W(f.y-6.5-1.5*(it.length%2),7,18),m.Hp=.6,m.Rp=.4,m.R=1.25,it.push(m))}}const Vt=ze.map((e,t)=>({t:e,i:t})).filter(e=>e.t.d<22).sort((e,t)=>e.t.pu-t.t.pu);await l.yield(),await l.yield();const nt=p.wine?A(p.wine):M[1].clone().multiplyScalar(.34).lerp(A("#7A1426"),.6),st=e=>e.replace("uniform float uShade, uTime;","uniform float uTime; varying float uShade;"),Ko=`
      vec3 sr = shade(rootW.xz, seed);
      uShade = sr.x;
      float R = sr.y;
      vec3 cc = rootW + vec3(0., Hp * 0.5, 0.) - uCamP;
      float al = dot(cc, uCamT);
      float perp = length(cc - al * uCamT);
      float Rc = (1. - smoothstep(8., 11.5, perp)) * (1. - smoothstep(15., 30., al)) * (1. - healF(max(0., -al - 5.) / max(uCamSpeed, 1.) * 0.25));
      R = max(R, Rc);
      R = R * sqrt(max(R, 0.));      // the plume is about half its size when the retraction is half done: every stage is seen
    `,Ee=_.PLUME_VERT,Vo=(Ee.slice(0,Ee.indexOf("//<retraction>"))+Ko+Ee.slice(Ee.indexOf("//</retraction>"))).replace("varying vec3 vW;",te+`
  uniform vec3 uCamP, uCamT; uniform float uCamSpeed;
  varying float uShade;
  varying vec3 vW;`).replace("#include <fog_vertex>",`if (iOrder.x > 0.5) gl_Position = vec4(0., 0., 2., 1.);
    #include <fog_vertex>`),_o=st(_.PLUME_FRAG),_t=()=>new i.ShaderMaterial({uniforms:{...J(),...g,uCoral:{value:M[2]},uCrimson:{value:M[1]},uWine:{value:nt},uGold:{value:M[3]},uGlowA:{value:new i.Vector3(...p.glowA)},uGlowB:{value:new i.Vector3(...p.glowB)},uTurns:{value:3.5},uGreat:{value:0},uLow:{value:.42},uSlopeLo:{value:.1},uRoot0:{value:.05},uSlopeHi:{value:.8},uFil:{value:90},uPin:{value:26},uSpin:{value:1},uFogK:{value:1},uCore:{value:p.core??.2},uFlinchT:{value:0},uFlinchG:{value:new i.Vector2},uCamFlinch:{value:0}},vertexShader:Vo,fragmentShader:_o,side:i.DoubleSide,fog:!0}),Lt=(e,t,s,o,a)=>{s[t*3]=e.x,s[t*3+1]=e.y+e.H-.4,s[t*3+2]=e.z,o[t*4]=e.Hp,o[t*4+1]=e.Rp,o[t*4+2]=e.hand,o[t*4+3]=e.seed,a[t*2]=0,a[t*2+1]=e.hue},B=(e,t,s,o,a)=>{const n=new i.InstancedBufferAttribute(s,o);return a&&n.setUsage(i.DynamicDrawUsage),e.setAttribute(t,n),n};await l.yield();const ne=_.plumeGeometry(8,1,3.5,1),Nt=new Float32Array(H*3),Et=new Float32Array(H*4),qe=new Float32Array(H*2);ze.forEach((e,t)=>Lt(e,t,Nt,Et,qe)),B(ne,"iRoot",Nt,3),B(ne,"iSize",Et,4);const qt=B(ne,"iOrder",qe,2,!0);ne.instanceCount=H;const Ht=new i.Mesh(ne,_t());Ht.frustumCulled=!1,b.add(Ht),await l.yield();const de=32,ge=_.plumeGeometry(28,4,3.5,4),Gt=new Float32Array(de*3),It=new Float32Array(de*4),Ot=new Float32Array(de*2),rt=[B(ge,"iRoot",Gt,3,!0),B(ge,"iSize",It,4,!0),B(ge,"iOrder",Ot,2,!0)];ge.instanceCount=0;const Qt=new i.Mesh(ge,_t());Qt.frustumCulled=!1,b.add(Qt),await l.yield();const Te=30,Ut=_.makeTubeMaterial({},M),Lo=st(Ut.fragmentShader).replace("uniform float uOpen;","varying float uOpen;");Ut.dispose();const No=`
      attribute vec3 aDat; attribute vec4 iT; attribute vec4 iT2; attribute vec2 iOrder;
      ${te}
      varying vec3 vW, vN; varying vec2 vUv; varying vec3 vDat; varying float uShade, uOpen;
      #include <fog_pars_vertex>
      void main() {
        float H = iT.w, R = iT2.x;
        float y = position.y < ${Te-5}. ? position.y * (H - 5.) / ${Te-5}. : H - (${Te}. - position.y);
        y = position.y < 0.5 ? position.y : y;
        vec3 p = vec3(position.x * R, y, position.z * R) + iT.xyz;
        if (iOrder.x > 0.5) p = vec3(0.);
        vUv = vec2(uv.x, y); vDat = vec3(iT2.y, H, aDat.z);
        vec3 sr = shade(iT.xz, iT2.y); uShade = sr.x; uOpen = 1. - sr.y;
        vW = p; vN = normal;
        vec4 mvPosition = viewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,jt=()=>new i.ShaderMaterial({uniforms:{...J(),...g,uIvory:{value:M[0]},uGold:{value:M[3]},uCoral:{value:M[2]}},vertexShader:No,fragmentShader:Lo,fog:!0}),Eo=w.fork("tubes"),$t=(e,t,s)=>{const o=_.makeSink();_.lathe(o,s,e,()=>[0,0],0,Te,t);const a=_.sinkToGeometry(o),n=new i.InstancedBufferGeometry;return n.setAttribute("position",a.getAttribute("position")),n.setAttribute("normal",a.getAttribute("normal")),n.setAttribute("uv",a.getAttribute("uv")),n.setAttribute("aDat",a.getAttribute("aDat")),n.setIndex(a.getIndex()),n},Xt=(e,t,s,o)=>{s[t*4]=e.x,s[t*4+1]=e.y,s[t*4+2]=e.z,s[t*4+3]=e.H,o[t*4]=e.R,o[t*4+1]=e.seed,o[t*4+2]=0,o[t*4+3]=0},ve=$t(6,3,[[-1.5,1.4],[.3,1.32],[2.4,.98],[27.6,1.04],[29.3,1.25,.07],[30.15,1.1,.18],[29.4,.84,.05],[27.6,.83],[27.59,.001]]),Yt=new Float32Array(H*4),Zt=new Float32Array(H*4);for(let e=0;e<ze.length;e++)Xt(ze[e],e,Yt,Zt),e%1e3===999&&await l.yield();B(ve,"iT",Yt,4),B(ve,"iT2",Zt,4),ve.setAttribute("iOrder",qt),ve.instanceCount=H;const Jt=new i.Mesh(ve,jt());Jt.frustumCulled=!1,b.add(Jt),await l.yield();const ye=$t(18,6,_.tubeProfile(Eo,Te,1,!1)),eo=new Float32Array(de*4),to=new Float32Array(de*4);rt.push(B(ye,"iT",eo,4,!0),B(ye,"iT2",to,4,!0)),ye.setAttribute("iOrder",rt[2]),ye.instanceCount=0;const oo=new i.Mesh(ye,jt());oo.frustumCulled=!1,b.add(oo);let ao="",io=[];const $=[],no=e=>{const t=e-25/k.length,s=e+115/k.length;$.length=0;for(let a=0;a<Vt.length;a++){const n=Vt[a];if(!(n.t.pu<t)){if(n.t.pu>s)break;$.push(n)}}$.length>de&&($.sort((a,n)=>a.t.d-n.t.d),$.length=de);let o="";for(const a of $)o+=a.i+",";if(o!==ao){ao=o;for(const a of io)qe[a.i*2]=0;$.forEach((a,n)=>{qe[a.i*2]=1,Lt(a.t,n,Gt,It,Ot),Xt(a.t,n,eo,to)}),io=$.slice(),qt.needsUpdate=!0;for(const a of rt)a.needsUpdate=!0;ge.instanceCount=$.length,ye.instanceCount=$.length}};no(0),await l.yield();{const e=w.fork("young"),t=Math.round(3e3*Z*We),s=new i.Vector3;for(let o=0;o<t;o++){Q(E(e.range(.13,.42)),s);const a=(2.5+70*Math.pow(e(),1.6))*e.sign();let n=s.x+a,u=s.z+e.range(-8,8);if(o%3===0){const d=o/3&1,c=(o/3|0)%7*.9+e.gauss()*.16,r=(d?14.2:16.4)+Math.abs(e.gauss())*2.4;n=(d?U.z:U.x)+Math.cos(c)*r,u=(d?U.w:U.y)+Math.sin(c)*r}if(tt(n,u)>.84)continue;const v=e.range(.6,2.6);Ce.push({x:n,z:u,y:Me(n,u),H:v*e.range(.3,.6),Hp:v,Rp:v*e.range(.4,.5),hand:e.sign(),seed:e(),hue:.6+.4*e()}),o%120===119&&await l.yield()}}await l.yield();const we=st(_.GLSL_COMMON),be=()=>{const e=new i.InstancedBufferGeometry;return e.setAttribute("position",new i.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),e.setIndex([0,1,2,0,2,3]),e},He=Ce.length,Ge=be(),Ae=new Float32Array(He*4),De=new Float32Array(He*4);for(let e=0;e<He;e++){const t=Ce[e];Ae[e*4]=t.x,Ae[e*4+1]=t.y,Ae[e*4+2]=t.z,Ae[e*4+3]=t.H,De[e*4]=t.Hp,De[e*4+1]=t.Rp,De[e*4+2]=t.seed+(t.hand>0?2:0),De[e*4+3]=t.hue,e%4e3===3999&&await l.yield()}B(Ge,"iC",Ae,4),B(Ge,"iC2",De,4),Ge.instanceCount=He,await l.yield();const qo=new i.ShaderMaterial({uniforms:{...J(),...g,uIvory:{value:M[0]},uCoral:{value:M[2]},uCrimson:{value:M[1]},uWine:{value:nt},uGlowA:{value:new i.Vector3(...p.glowA)},uGlowB:{value:new i.Vector3(...p.glowB)},uCore:{value:p.core??.2}},fog:!0,vertexShader:`
        attribute vec4 iC, iC2;
        ${te}
        ${_.STANDS}
        varying float vStand;
        varying vec2 vQ; varying vec4 vA, vB; varying vec3 vW, vRight; varying float uShade;
        #include <fog_pars_vertex>
        void main() {
          vec3 root = iC.xyz;
          float hand = step(1.5, iC2.z) * 2. - 1., seed = fract(iC2.z);
          vec3 sr = shade(root.xz, seed);
          vStand = standOf(root.xz);
          vec3 toC = cameraPosition - root; toC.y = 0.;
          toC /= max(length(toC), 1e-3);
          vec3 right = vec3(toC.z, 0., -toC.x);
          float W = iC2.y * 1.06, Ht = iC.w + iC2.x;
          vec3 top = root + vec3(0., iC.w + iC2.x * 0.72, 0.) - cameraPosition;
          float sinE = clamp(-top.y / max(length(top), 1.), 0., 1.);
          Ht += iC2.y * sinE;
          vQ = vec2(position.x * W, position.y * (Ht + 1.5) - 1.5);
          vec3 p = root + right * vQ.x + vec3(0., vQ.y, 0.);
          vA = vec4(iC.w, iC2.x, iC2.y, seed); vB = vec4(sr.y * sqrt(max(sr.y, 0.)), iC2.w, hand, sinE);
          uShade = sr.x; vW = p; vRight = right;
          vec4 mvPosition = viewMatrix * vec4(p, 1.);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        ${we}
        uniform vec3 uIvory, uCoral, uCrimson, uWine, uGlowA, uGlowB; uniform float uCore;
        ${_.STANDS}
        uniform vec3 uGold; varying float vStand;
        varying vec2 vQ; varying vec4 vA, vB; varying vec3 vW, vRight;
        #include <fog_pars_fragment>
        void main() {
          float H = vA.x, Hp = vA.y, Rp = vA.z, seed = vA.w, R = vB.x, hand = vB.z;
          float X = vQ.x, Y = vQ.y, sunK = 1. - uShade;
          vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.));
          vec3 fwd = vec3(-vRight.z, 0., vRight.x);
          vec3 col;
          float Rt = max((H + Hp < 6. ? 0.07 : clamp((H + Hp) * 0.028, 0.6, 1.6) * (1. + 0.3 * (1. - smoothstep(0., 2.5, Y)))), fwidth(X) * 0.9);
          float k = 1. - R;
          float xn = abs(X) / max(Rp * k, 0.05), yn = (Y - H + 3. * R) / max(Hp * k * k, 0.05);
          float ac = (yn - 0.05 - 0.28 * xn) / 0.62, a = clamp(ac, 0., 1.);
          float rad = mix(0.42, 1., a * (2. - a));
          float L = ac * 7. + step(0., X) * 0.5 + seed * 3. + hand * uTime * 0.14, lf = fract(L), lid = floor(L);
          float sn = xn / rad;
          float len = 0.78 + 0.22 * hash11(lid * 1.37 + seed * 91.) - 0.1 * hash11(floor(Y * 2.5) + lid * 7. + seed * 13.);
          bool plume = R < 0.97 && ac > 0. && ac < 1. && sn < len && lf < mix(1.05, 0.6, smoothstep(0.4, 0.95, sn));
          // seen from above, the funnel opens into a rosette
          float sinE = vB.w;
          vec2 e = vec2(X / max(Rp * k, 0.05), (Y - H + 3. * R - Hp * 0.72 * k * k) / max(Rp * k * sinE, 0.05));
          float er = length(e), ang = atan(e.y, abs(e.x) < 1e-5 ? 1e-5 : e.x) / 6.2831853;
          float lr = fract(ang * hand + er * 1.6 + seed + uTime * 0.025);
          bool ros = R < 0.97 && sinE > 0.06 && er < 0.82 + 0.18 * hash11(floor(ang * 40.) + seed * 31.);
          if (ros) { sn = er; a = 0.85; lf = 1. - smoothstep(0., 0.4, lr); lid = floor(ang * 40.); plume = true; }
          bool stalk = R < 0.97 && yn > -0.3 && yn < 0.7 && abs(X) < max(Rp * 0.05, fwidth(X) * 0.6);
          if (abs(X) < Rt && Y < H) {
            float nx = X / Rt;
            vec3 N = normalize(vRight * nx + fwd * sqrt(max(0., 1. - nx * nx)) + vec3(1e-4, 0.05, 1e-4));
            float ao = 0.62 + 0.38 * smoothstep(0.2, 0.98, Y / max(H, 1.));
            vec3 alb = uIvory * (0.86 + 0.1 * hash11(seed * 13.1)) * (0.94 + 0.06 * sin(Y * 1.9 + seed * 20.));
            vec3 lit = uSunCol * pipeKey(N) * sunK * mix(0.7, 1., ao) + pipeFill(N, uShade, smoothstep(0., 0.75, Y / max(H, 1.)), uCoral);
            lit += uCoral * 0.22 * k * smoothstep(H - 9., H, Y);
            float rimK = abs(nx); rimK *= rimK * rimK;
            lit += (uFill * 0.55 + uSunCol * 0.3 * max(dot(N.xz, uSunDir.xz / max(length(uSunDir.xz), 1e-4)), 0.)) * rimK * uShade * (0.45 + 0.55 * smoothstep(0., 0.75, Y / max(H, 1.)));
            float young = step(H + Hp, 6.);
            col = mix(alb, mix(uIvory, uCoral, 0.45) * 0.8, young) * lit * mix(1., 0.4, young * uShade / 0.85);
          } else if (plume || stalk) {
            vec3 alb = mix(uCoral * vec3(1., 1.3, 1.1), mix(uCrimson, uCoral, 0.18), smoothstep(uCore, 0.95, sn));
            alb = mix(alb, uWine * 1.6, smoothstep(0.78, 1., sn) * 0.75);
            alb *= 0.8 + 0.4 * hash11(lid * 0.77 + seed * 5.);
            alb = mix(alb * 1.1, alb * vec3(0.8, 0.6, 0.58), vB.y);
            alb = mix(alb, uGold * 0.8, step(0.5, -vStand) * (1. - smoothstep(0.35, 0.5, sn)));   // a spawning street: gold-hearted to mid-length
            vec3 N = normalize(vRight * (X / max(Rp, 0.1)) * 0.9 + fwd * 0.45 + vec3(1e-4, 0.75 - 0.9 * lf + (ros ? 1.2 : 0.), 1e-4));
            float ndl = dot(N, uSunDir), front = max(ndl, 0.), back = max(-ndl, 0.);
            float ao = mix(0.25, 1., smoothstep(0.03, 0.7, sn)) * mix(0.6, 1., a) * mix(1., 0.62, lf * lf);
            ao = mix(ao, mix(0.6, 1., a) * mix(1., 0.62, lf * lf), step(0.5, -vStand));          // and its heart is not occluded
            float vdl = max(dot(-V, uSunDir), 0.);
            vec3 glow = mix(uGlowA, uGlowB, smoothstep(0.15, 0.95, sn)) * (0.75 + 0.5 * hash11(lid * 0.77 + seed * 5.));
            vec3 trans = glow * (0.62 * back + 0.5 * vdl * vdl * vdl);
            float sunX = clamp(X / max(Rp * k, 0.05), -1., 1.) * dot(vRight.xz, uSunDir.xz / max(length(uSunDir.xz), 1e-4));     // +1 on the side turned to the sun
            float sideK = mix(0.5, 1.15, smoothstep(-0.7, 0.5, sunX));
            vec3 lit = uSunCol * sunK * (alb * (0.16 + 0.55 * front) * ao + trans * mix(0.5, 1., ao)) * sideK + alb * fillLight(N.y) * ao * 0.6 * mix(0.8, 1., sideK);
            col = mix(lit, uWine * (0.4 + 0.3 * sunK), clamp((1. - ao) * 0.6 + 0.3 * (1. - smoothstep(-0.9, -0.2, sunX)), 0., 1.));
            col = standTint(col, uCoral, uCrimson, uWine, step(0.5, vStand) * clamp(1. - 2. * uShade / 0.85, 0., 1.));   // an old street deepens what is drawn above toward wine, and has let go of it by half of a cloud's shade
            col.r = min(col.r, 0.9);
          } else discard;
          col = shadeMist(col, vW, uShade);
          gl_FragColor = vec4(min(col, vec3(0.9)), 1.);
          #include <fog_fragment>
        }`}),so=new i.Mesh(Ge,qo);so.frustumCulled=!1,b.add(so),await l.yield();const lt=new i.PlaneGeometry(2700,2700,120,120);await l.yield(),lt.rotateX(-Math.PI/2),await l.yield();{const e=lt.attributes.position;for(let t=0;t<e.count;t++){const s=e.getX(t)+j[0],o=e.getZ(t)+j[1];e.setXYZ(t,s,Me(s,o),o),t%800===799&&await l.yield()}}await l.yield();const Ho=new i.ShaderMaterial({uniforms:{...J(),...g,uSand:{value:A(p.sand)},uCoral:{value:M[2]},uCrimson:{value:M[1]},uWine:{value:nt},uIvory:{value:M[0]},uPool:{value:A(p.pool)},uZen:{value:A(p.zenith)},uHor:{value:A(p.horizon)},uSpire:{value:new i.Vector2(T.x,T.z)},uCentre:{value:new i.Vector2(j[0],j[1])},uPoolC:{value:U}},fog:!0,vertexShader:`
        varying vec3 vW;
        #include <fog_pars_vertex>
        void main() { vW = position; vec4 mvPosition = viewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        ${_.GLSL_COMMON.replace("uniform float uShade, uTime;","uniform float uTime; float uShade;")}
        ${te}
        ${Ct}
        ${_.STANDS}
        uniform vec3 uGold;
        uniform vec3 uSand, uCoral, uCrimson, uWine, uIvory, uPool, uZen, uHor; uniform vec2 uSpire, uCentre; uniform vec4 uPoolC;
        varying vec3 vW;
        #include <fog_pars_fragment>
        float segD(vec2 p, vec2 a, vec2 b) { vec2 d = b - a; float t = clamp(dot(p - a, d) / max(dot(d, d), 1.), 0., 1.); return length(p - a - d * t); }
        void main() {
          vec2 p = vW.xz;
          if (length(p - uCentre) > 1235.) discard;
          vec3 sr = shade(p, 0.37);
          float S = sr.x, R = sr.y, sunK = 1. - S;
          uShade = S;
          float dist = length(cameraPosition - vW);
          float near = 1. - smoothstep(14., 40., dist), near2 = 1. - smoothstep(5., 24., dist);
          // sand: fine grain and short broken wind ripples under the bow; larger pale and tawny shapes beyond. It is the quiet
          // ground of the picture: a tone darker than the sunlit side of the pipes that stand on it
          float w1 = vnoise(p * 0.06), w2 = vnoise(p * 0.31 + 7.), w3 = vnoise(p * 0.021 + 3.);
          vec2 pw = vec2(dot(p, uWindDir), dot(p, vec2(-uWindDir.y, uWindDir.x)));
          float grain = (vnoise(p * 7.) * 0.6 + vnoise(p * 17. + 3.) * 0.4 - 0.5) * near2;
          float rip = sin(pw.x * 5.6 + w1 * 9. + w2 * 2.5 + 1.5 * vnoise(vec2(pw.x * 0.8, pw.y * 0.25))) * near * smoothstep(0.3, 0.55, vnoise(vec2(pw.x * 0.22, pw.y * 0.09) + 20.));
          float speck = smoothstep(0.74, 0.82, vnoise(p * 19. + 5.)) * near2;                 // broken filament ends and shell grit
          vec3 alb = uSand * (0.45 + 0.06 * w2 + 0.1 * (w3 - 0.5) + 0.09 * rip + 0.2 * grain) * (1. - 0.3 * speck);
          // windrows of fallen filaments: drifts drawn out along the wind with a crisp scalloped edge and a strand texture combed
          // downwind; bleached rose to straw, two steps paler than the living plumes, only the freshest strands in their colour
          float lit0 = vnoise(vec2(pw.x * 0.045, pw.y * 0.15) + 3.) * 0.58 + vnoise(vec2(pw.x * 0.13, pw.y * 0.4)) * 0.3 + vnoise(p * 0.9) * 0.12;
          float scal = (vnoise(vec2(pw.x * 0.55, pw.y * 1.9)) - 0.5) * 0.09 * (1. - smoothstep(30., 110., dist));
          float litter = smoothstep(0.575, 0.592, lit0 + scal);
          float bankEdge = smoothstep(0.535, 0.575, lit0 + scal) * (1. - litter);                 // the drift's shaded lee edge
          float sfw = fwidth(pw.y * 11.);
          float strand = mix(0.5, vnoise(vec2(pw.x * 0.5, pw.y * 11.)) * 0.65 + vnoise(vec2(pw.x * 1.3 + 9., pw.y * 27.)) * 0.35 * near, 1. - smoothstep(0.35, 1.1, sfw));
          float age = vnoise(p * 0.21 + 11.);
          vec3 lcol = mix(mix(uCoral, uSand, 0.6) * vec3(1., 0.9, 0.94), uSand * vec3(1.06, 0.98, 0.8), smoothstep(0.3, 0.75, age)) * (0.5 + 0.4 * strand);
          lcol = mix(lcol, mix(uCrimson, uCoral, 0.4) * 0.8, smoothstep(0.7, 0.8, strand) * (1. - smoothstep(0.2, 0.5, age)) * 0.7);
          alb = mix(alb, lcol, litter * 0.9) * (1. - 0.28 * bankEdge);
          vec3 N = normalize(vec3(uWindDir.x * 0.3 * rip * (1. - litter) + 0.25 * grain, 1., uWindDir.y * 0.3 * rip * (1. - litter)));
          vec3 col = alb * (uSunCol * sunK * max(dot(N, uSunDir), 0.) + fillLight(1.) * 0.95);
          // in a cloud's shadow the floor goes deep and cool, so that the pale lips of the pipes stand out of it; the drifts keep
          // a little of their red, and the tone is taken in large soft shapes, never ruled
          vec3 tn = mix(uTeal / max(max(uTeal.r, uTeal.g), max(uTeal.b, 1e-3)), vec3(0.5, 0.52, 1.), 0.42);
          float deep = 0.31 * min(1., 0.5 / max(dot(tn, vec3(0.2126, 0.7152, 0.0722)), 0.05));      // a green-heavy tone is taken deeper, so every look's floor is as dark
          col *= mix(vec3(1.), mix(vec3(1.), tn, 0.6 - 0.25 * litter) * deep * (0.92 + 0.22 * w3 + 0.3 * litter + 0.15 * rip), S / 0.85);
          // pools a hand deep with an uneven shore: wet sand, a rose algal mat, then water that is dark looked down into and
          // mirrors the sky and its clouds at a glancing angle
          vec2 pa = p - uPoolC.xy, pb = p - uPoolC.zw;
          float pf = max(poolF(p), 0.95 * max(exp(-dot(pa, pa) / 1500.), exp(-dot(pb, pb) / 1100.))) + 0.07 * (vnoise(p * 0.085 + 13.) - 0.5) + 0.02 * (w2 - 0.5);
          col *= 1. - 0.3 * smoothstep(0.76, 0.85, pf);
          float mat = smoothstep(0.72, 0.8, pf) * (1. - smoothstep(0.84, 0.865, pf));
          col = mix(col, mix(uCoral, uSand, 0.35) * vec3(1., 0.78, 0.86) * (uSunCol * sunK * 0.6 + fillLight(1.) * 0.75) * (0.75 + 0.4 * w2), mat * 0.75 * (0.35 + 0.65 * smoothstep(0.3, 0.6, vnoise(p * 0.4 + 31.))));
          float pool = smoothstep(0.85, 0.862, pf);
          if (pool > 0.) {
            vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.));
            vec2 q = p * 1.1 + vec2(uTime * 0.5, uTime * 0.31);
            vec2 cc = (floor(p / 8.) + 0.5) * 8. + 2.5 * (vec2(hash21(floor(p / 8.)), hash21(floor(p / 8.) + 7.3)) - 0.5);
            float rd = length(p - cc);
            float ring = sin(rd * 5. - uTime * 3.2 + hash21(floor(p / 8.) + 2.1) * 6.28) * exp(-rd * 0.45) * (1. - smoothstep(2.6, 3.4, rd));
            vec2 rdir = (p - cc) / max(rd, 1e-3);
            vec3 Nw = normalize(vec3((vnoise(q) - 0.5) * 0.14 + rdir.x * ring * 0.2, 1., (vnoise(q.yx + 9.) - 0.5) * 0.14 + rdir.y * ring * 0.2));
            vec3 Rf = reflect(-V, Nw);
            float fc = 1. - max(dot(V, Nw), 0.);
            float fr = 0.2 + 0.8 * fc * fc * fc;
            vec3 sky = mix(uHor, uZen, smoothstep(0., 0.7, Rf.y));
            vec2 sp = Rf.xz / max(Rf.y, 0.1) * 0.9 + p * 0.006 + uWindDir * uTime * 0.012;
            float cl = smoothstep(0.5, 0.7, vnoise(sp * 1.2) * 0.62 + vnoise(sp * 3.3 + 5.) * 0.38);
            sky = mix(sky, vec3(1., 0.985, 0.95) * (0.8 + 0.2 * sunK), cl * 0.9);
            vec2 vr = normalize(V.xz + vec2(1e-4)); float acr = dot(p, vec2(-vr.y, vr.x));
            float stem = smoothstep(0.52, 0.62, vnoise(vec2(acr * 0.42, 3.7))) * (1. - smoothstep(0.2, 0.5, Rf.y));
            vec3 wall = mix(mix(uCrimson, uWine, 0.5) * 0.42, uIvory * 0.5, stem) * (0.5 + 0.5 * sunK);
            sky = mix(sky, wall, (1. - smoothstep(0.24, 0.5, Rf.y + 0.08 * vnoise(vec2(acr * 0.3, 9.)))) * 0.85);
            float gl = pow(max(dot(Rf, uSunDir), 0.), 220.) * sunK;
            vec3 body = mix(uPool * 0.5, uPool * 0.2, smoothstep(0.86, 0.96, pf)) * (0.5 + 0.5 * sunK);
            vec3 wcol = mix(body, sky, fr) + uSunCol * gl * 5.;
            wcol = mix(wcol, vec3(0.95, 0.93, 0.88) * (0.5 + 0.5 * sunK), (1. - smoothstep(0.862, 0.872, pf)) * 0.7);           // a pale lapping edge
            col = mix(col, wcol, pool);
          }
          // shade under the open canopy is teal, never grey; in the hollow, where the pipes are short and stand apart, it is
          // only a dapple, so the sun lies on the floor between the plumes and the cloud shadows are drawn on it
          vec2 hs = uTrSeg.zw - uTrSeg.xy;
          float hk = 1. - smoothstep(70., 170., length(p - uTrSeg.xy - hs * clamp(dot(p - uTrSeg.xy, hs) / max(dot(hs, hs), 1.), 0., 1.)));
          float dap = smoothstep(0.42, 0.62, vnoise(p * 0.11 + 40.) * 0.7 + 0.3 * vnoise(p * 0.3 + 9.));
          float dP = min(min(segD(p, vec2(0.), vec2(-4., 690.)), segD(p, vec2(-4., 690.), uSpire)), max(0., length(p - uSpire) - 110.));
          float openK = max(smoothstep(0.83, 0.87, gladeF(p)), 1. - smoothstep(0.75, 1.2, laneF(p))) * smoothstep(48., 62., dP);
          float canopy = (1. - R) * (1. - pool * 0.6) * (1. - openK);
          col = mix(col, uTeal * 1.5 * (0.6 + 0.8 * sunK) + col * 0.22, canopy * 0.8 * (1. - hk));
          col *= mix(vec3(1.), mix(vec3(1.), tn, 0.3) * 0.8, canopy * hk * dap * sunK * smoothstep(40., 90., dist));
          // far off the plateau is painted with its own canopy: red, or ivory where a shadow has shut it
          float paint = smoothstep(150., 480., dP);
          float cell = vnoise(p * 0.19) * 0.6 + vnoise(p * 0.07 + 5.) * 0.4;
          vec3 red = mix(uCrimson, uCoral, 0.25 + 0.5 * cell) * (uSunCol * sunK * (0.42 + 0.3 * cell) + fillLight(1.) * 0.5);
          // the streets in the far paint, by the ground point: an old street lays the plumes' own tint on the paint (let go in a cloud's shade,
          // as theirs is); a spawning street's gold heart is a quarter of the crown
          float stS = standF(p) + 0.12 * (cell - 0.5); vec3 stLive = max(mix(uCrimson, uCoral, 0.25 + 0.5 * cell), vec3(1e-3));
          red = standTint(red, uCoral, uCrimson, uWine, smoothstep(0.75, 0.77, stS) * uStand.w * clamp(1. - 2. * S / 0.85, 0., 1.));
          red *= mix(vec3(1.), mix(stLive, uGold * 0.8, 0.25) / stLive, smoothstep(0.75, 0.77, -stS) * uStand.w);
          red = mix(uWine * (0.5 + 0.5 * sunK), red, 0.35 + 0.65 * smoothstep(380., 800., dP));
          vec3 bare = mix(uIvory, uSand, 0.4) * (uSunCol * sunK * 0.7 + fillLight(1.) * 0.9) * (0.8 + 0.2 * cell);
          vec3 glade = uSand * 0.62 * (uSunCol * sunK * 0.8 + fillLight(1.) * 0.9) * (0.9 + 0.2 * cell);
          col = mix(col, mix(mix(red, bare, R), glade, openK), paint);
          col = shadeMist(col, vW, S * (1. - paint) * 0.4);
          gl_FragColor = vec4(min(col, vec3(4.)), 1.);
          #include <fog_fragment>
        }`}),ro=new i.Mesh(lt,Ho);ro.frustumCulled=!1,b.add(ro),await l.yield();{const e=t=>new i.ShaderMaterial({uniforms:{...J(),...g,uKind:{value:t},uSand:{value:A(p.sand)},uCoral:{value:M[2]},uCrimson:{value:M[1]}},fog:!0,side:i.DoubleSide,depthWrite:t===0,transparent:t===1,blending:t===1?i.MultiplyBlending:i.NormalBlending,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:`
          attribute vec4 iT, iT2, iSize;
          ${te}
          ${Ct}
          uniform float uKind; uniform vec3 uSunDir;
          varying vec2 vQ; varying vec4 vD; varying vec2 vP; varying float uShade;
          #include <fog_pars_vertex>
          void main() {
            vec2 q = vec2(position.x, position.y * 2. - 1.);
            vec3 sr = shade(iT.xz, iT2.y);
            vec2 c, ax, ay; float lift, kOpen = 1. - sr.y * sqrt(max(sr.y, 0.));
            if (uKind < 0.5) {
              float sz = iT2.x * (2.7 + 1.5 * fract(iT2.y * 31.)) + 0.6;
              c = iT.xz - uWindDir * iT2.x * 0.8; ay = uWindDir * sz; ax = vec2(-uWindDir.y, uWindDir.x) * sz; lift = 0.14;
              vD = vec4(iT2.y, iT2.x / sz, sz, 1.);
              if (iT.w + iSize.x < 6.) ax *= 0.;                 // the young have no drift
            } else {
              vec2 sxz = uSunDir.xz / max(uSunDir.y, 0.25);
              float hC = iT.w + iSize.x * 0.6 * kOpen * kOpen, rr = iSize.y * (0.2 + 0.8 * kOpen) * 1.1;
              vec2 sd = sxz / max(length(sxz), 1e-3);
              c = iT.xz - sxz * hC; ay = sd * rr * 1.25; ax = vec2(-sd.y, sd.x) * rr; lift = 0.08;
              vD = vec4(iT2.y, smoothstep(0.03, 0.3, kOpen), iSize.z, 1. - shade(c, 0.37).x / 0.85);
            }
            vec2 pxz = c + ax * q.x + ay * q.y;
            vec3 w = vec3(pxz.x, groundY(pxz) + lift, pxz.y);
            vQ = q; vP = pxz; uShade = shade(pxz, 0.37).x;
            vec4 mvPosition = viewMatrix * vec4(w, 1.);
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          ${we}
          uniform float uKind; uniform vec3 uSand, uCoral, uCrimson; uniform vec2 uWindDir;
          varying vec2 vQ; varying vec4 vD; varying vec2 vP;
          #include <fog_pars_fragment>
          void main() {
            vec3 tn = mix(uTeal / max(max(uTeal.r, uTeal.g), max(uTeal.b, 1e-3)), vec3(0.5, 0.52, 1.), 0.42);
            vec3 col;
            if (uKind < 0.5) {
              float seed = vD.x, y0 = vD.y * 0.8;
              float n = vnoise(vP * 1.7 + seed * 9.) - 0.5, r0 = length(vQ * vec2(1., 1.15) + vec2(0., 0.12));
              float horn = length(vQ - vec2(0., y0 + 0.62)) - 0.6;                       // the lee of the pipe is swept bare
              float m = min(0.86 + 0.24 * n - r0, horn + 0.12 * n);
              if (m < 0.) discard;
              float bank = 1. - smoothstep(0.0, 0.75, length(vQ - vec2(0., y0)));            // heaped highest against the foot
              vec2 pw = vec2(dot(vP, uWindDir), dot(vP, vec2(-uWindDir.y, uWindDir.x)));
              float strand = vnoise(vec2(pw.x * 0.6, pw.y * 12.)) * 0.6 + vnoise(vec2(pw.x * 1.5 + 5., pw.y * 30.)) * 0.4;
              strand = mix(0.5, strand, 1. - smoothstep(0.35, 1.1, fwidth(pw.y * 12.)));
              float age = vnoise(vP * 0.3 + seed * 20.);
              vec3 alb = mix(mix(uCoral, uSand, 0.5) * vec3(1., 0.88, 0.93), uSand * vec3(1.06, 0.98, 0.8), smoothstep(0.35, 0.8, age + 0.3 * (1. - bank))) * (0.5 + 0.4 * strand);
              alb = mix(alb, mix(uCrimson, uCoral, 0.35) * 0.85, smoothstep(0.62, 0.74, strand) * bank * 0.75);
              alb *= 1. - 0.35 * (1. - smoothstep(0., 0.07, m));                                  // a crisp shaded edge
              float S = uShade;
              col = alb * (uSunCol * (1. - S) * (0.62 + 0.3 * bank) + fillLight(1.) * 0.95);
              float deep = 0.31 * min(1., 0.5 / max(dot(tn, vec3(0.2126, 0.7152, 0.0722)), 0.05));
              col *= mix(vec3(1.), mix(vec3(1.), tn, 0.4) * deep * 1.35, S / 0.85);
              #ifdef USE_FOG
                col = mix(col, fogColor, 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth));
              #endif
            } else {
              float r = length(vQ), ang = atan(vQ.y, abs(vQ.x) < 1e-5 ? 1e-5 : vQ.x);
              float arm = 0.5 + 0.5 * sin(ang * vD.z * 2. + r * 9. + vD.x * 20. + uTime * 0.157 * vD.z);      // the spiral, turning
              float a = (1. - smoothstep(0.5, 0.96, r + 0.16 * arm)) * vD.y * vD.w * (0.72 + 0.28 * arm);
              col = mix(vec3(1.), mix(vec3(1.), tn, 0.45) * 0.42, a * (1. - uShade / 0.85));
            }
            gl_FragColor = vec4(col, 1.);
          }`});for(const t of[1,0]){const s=be();s.setAttribute("iT",ve.getAttribute("iT")),s.setAttribute("iT2",ve.getAttribute("iT2")),s.setAttribute("iSize",ne.getAttribute("iSize")),s.instanceCount=H;const o=new i.Mesh(s,e(t));o.frustumCulled=!1,o.renderOrder=t?1:0,b.add(o)}}await l.yield();{const e=w.fork("fallen"),t=Math.round(90*Z),s=new i.Vector3,o=new i.CylinderGeometry(1,1,1,14,1,!0),a=new i.ShaderMaterial({uniforms:{...J(),...g,uIvory:{value:M[0]}},side:i.DoubleSide,fog:!0,vertexShader:`
          ${te}
          varying vec3 vN, vW; varying vec2 vUv; varying float uShade, vLen;
          #include <fog_pars_vertex>
          void main() {
            vec4 w = instanceMatrix * vec4(position, 1.);
            vN = normalize(mat3(instanceMatrix) * normal + vec3(0., 1e-5, 0.)); vW = w.xyz; vUv = uv;
            vLen = length(instanceMatrix[1].xyz);
            uShade = shade(w.xz, 0.5).x;
            vec4 mvPosition = viewMatrix * w;
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          ${we}
          uniform vec3 uIvory; varying vec3 vN, vW; varying vec2 vUv; varying float vLen;
          #include <fog_pars_fragment>
          void main() {
            vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
            float inside = gl_FrontFacing ? 0. : 1.;
            N = mix(N, -N, inside);
            float rp = vUv.y * vLen / 0.4, rf = fract(rp);
            float rib = smoothstep(0., 0.18, rf) * (1. - smoothstep(0.18, 0.5, rf)) * (1. - smoothstep(0.3, 0.8, fwidth(rp)));
            vec3 alb = uIvory * (0.82 + 0.12 * rib + 0.08 * vnoise(vec2(vUv.x * 14., rp * 0.3)));
            alb = mix(alb, vec3(0.3, 0.52, 0.44), 0.35 * smoothstep(0.4, 0.9, vnoise(vec2(vUv.x * 9. + 3., rp * 0.2))) * (1. - smoothstep(-0.6, 0.2, N.y)));
            vec3 lit = uSunCol * (1. - uShade) * max(dot(N, uSunDir), 0.) * mix(1., 0.25, inside) + fillLight(N.y) * mix(1., 0.55, inside);
            vec3 col = mix(alb * lit, uTeal * (0.7 + 0.8 * fillLight(1.)), inside * 0.5);
            col = shadeMist(col, vW, uShade);
            gl_FragColor = vec4(min(col, vec3(0.95)), 1.);
            #include <fog_fragment>
          }`}),n=new i.InstancedMesh(o,a,t);n.frustumCulled=!1;const u=new i.Matrix4,v=new i.Quaternion,d=new i.Euler,c=new i.Vector3,r=new i.Vector3;for(let h=0;h<t;h++){Q(E(e.range(.12,.43)),s);const f=s.x+(5+42*Math.pow(e(),1.4))*e.sign(),m=s.z+e.range(-10,10),C=e.range(.55,1.45),z=e.chance(.28),D=z?e.range(.6,2.2):e.range(3,9.5);z?d.set(e.range(-.12,.12),e.range(0,le),e.range(-.12,.12)):d.set(Math.PI/2+e.range(-.07,.07),0,e.range(0,le),"ZXY"),v.setFromEuler(d),c.set(C,D,C),r.set(f,Me(f,m)+(z?D*.4:C*.8),m),tt(f,m)>.8&&(r.y=-60),n.setMatrixAt(h,u.compose(r,v,c))}b.add(n)}await l.yield();const Go=new i.ShaderMaterial({uniforms:{uZen:{value:A(p.zenith)},uMid:{value:A(p.mid)},uHor:{value:A(p.horizon)},uHaze:{value:Le},uSunDir:g.uSunDir,uSunCol:g.uSunCol,uTime:g.uTime,uWindDir:g.uWindDir,uMack:{value:oe==="mackerel"?1:0},uVeil:g.uVeil,uCream:{value:A(p.cloudTop)},uBase:{value:A(p.cloudBase)},uBankSeed:{value:N.range(1,40)},uHead:{value:new i.Vector2(Math.sin(Be+Math.PI),Math.cos(Be+Math.PI))}},side:i.BackSide,depthWrite:!1,depthTest:!1,fog:!1,vertexShader:"varying vec3 vD; void main() { vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
        uniform vec3 uZen, uMid, uHor, uHaze, uSunDir, uSunCol, uCream, uBase; uniform float uTime, uMack, uVeil, uBankSeed; uniform vec2 uWindDir, uHead;
        varying vec3 vD;
        float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
          return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
        void main() {
          vec3 d = normalize(vD + vec3(0., 1e-4, 0.));
          float e = d.y;
          vec3 col = mix(mix(uHor, uMid, 0.3), uMid, smoothstep(0.0, 0.24, e));
          col = mix(col, uZen, smoothstep(0.03, 0.42, e));
          col = mix(col, uZen * uZen * 1.05, 0.38 * smoothstep(0.3, 0.8, e));
          col = mix(col, uHaze, 1. - smoothstep(-0.12, 0.03, e));
          float sd = max(dot(d, uSunDir), 0.);
          // high cloud lives on a plane far above
          vec2 uvp = d.xz / max(e + 0.12, 0.05);
          vec2 q = vec2(dot(uvp, uWindDir), dot(uvp, vec2(-uWindDir.y, uWindDir.x)));
          float up = smoothstep(0.02, 0.3, e);
          vec2 qw = q + 0.35 * vec2(vn(q * 0.9), vn(q * 0.9 + 7.));
          float cir = vn(vec2(qw.x * 0.7 - uTime * 0.012, qw.y * 4.)) * vn(vec2(qw.x * 1.9 - uTime * 0.02, qw.y * 9. + 4.));
          cir = smoothstep(0.22, 0.7, cir) * vn(q * 0.7 + 3.) * 0.42 * (1. - smoothstep(2.5, 6., length(q)) * 0.7);
          vec2 m = q * 5.5 - vec2(uTime * 0.05, 0.);
          float mack = smoothstep(0.42, 0.8, vn(m) * 0.6 + 0.4 * vn(m * 2.3 + 9.)) * smoothstep(0.3, 0.6, vn(q * 1.1 + 20.)) * uMack;
          float hi = clamp(cir * (1. - uMack * 0.6) + mack * 0.8 + uVeil * 0.5 * (0.5 + 0.5 * vn(q * 2. + uTime * 0.03)), 0., 1.) * up;
          col = mix(col, uCream * (0.82 + 0.25 * sd * sd), hi);
          // a far bank of cumulus beyond the plateau's rim, where the last leg is heading: a calm jade-grey ground for the ring
          vec2 hz = d.xz / max(length(d.xz), 1e-4);
          float hd = dot(hz, uHead), lat = dot(hz, vec2(-uHead.y, uHead.x));
          float win = smoothstep(0.2, 0.8, hd);
          float sunSide = sign(dot(uSunDir.xz, vec2(-uHead.y, uHead.x)) + 1e-5);
          // heads: three sizes of rounded billow, each lobe with its own height; lit from the sun's side, dark-based
          float topE = -0.03, topL = -0.055;
          for (int i = 0; i < 3; i++) {
            float F = i == 0 ? 4.3 : i == 1 ? 10.1 : 23.9, A = i == 0 ? 0.15 : i == 1 ? 0.066 : 0.028;
            float xl = (lat + 0.11 * (vn(vec2(lat * 4.7 + uBankSeed, 9.5)) - 0.5)) * F + uBankSeed * (1. + float(i) * 1.7) + uTime * 0.0012 * float(i + 1), id = floor(xl), x = fract(xl) * 2. - 1.;
            float hh = 0.22 + 0.78 * h21(vec2(id, float(i) * 7. + floor(uBankSeed)));
            // each size is two interleaved rows of domes, so the heads overlap and there are no slots between them
            float x2 = fract(xl + 0.5) * 2. - 1., hh2 = 0.22 + 0.78 * h21(vec2(floor(xl + 0.5) + 31., float(i) * 7. + floor(uBankSeed)));
            float c1 = sqrt(max(0., 1. - x * x)) * hh, c2 = sqrt(max(0., 1. - x2 * x2)) * hh2 * 0.92;
            topE += win * A * max(c1, c2);
            if (i > 0) topL += win * A * 0.95 * max(c1, c2);
          }
          topE += win * (0.012 * (vn(vec2(lat * 70. + uBankSeed, 2.5)) - 0.5) + 0.02 * (vn(vec2(lat * 31. + uBankSeed, 7.5)) - 0.5));
          float bank = (1. - smoothstep(topE - 0.006, topE, e)) * smoothstep(0.0, 0.12, win);
          // the bank is cumulus: billows inside the silhouette, each lit on the shoulder turned to the sun and melting
          // into a flat darker base; the light is read from a billow field in bearing and elevation, so there is no vertical seam
          vec2 bp = vec2(lat * 6.5 + uBankSeed + uTime * 0.004, e * 27.);
          vec2 bs = bp + vec2(sunSide * 0.3, 0.26);
          float bil = vn(bp) * 0.56 + vn(bp * 2.3 + 5.) * 0.32 + vn(bp * 5.1 + 1.) * 0.12;
          float bil2 = vn(bs) * 0.56 + vn(bs * 2.3 + 5.) * 0.32 + vn(bs * 5.1 + 1.) * 0.12;
          float slope = clamp((bil - bil2) * 3.2 + 0.42, 0., 1.);
          float hK = clamp((e + 0.03) / max(topE + 0.03, 0.02), 0., 1.);                 // 0 at the foot, 1 at the head
          float rimL = smoothstep(topE - 0.03, topE - 0.004, e);                          // the crown of each head catches the sun
          float litK = clamp(smoothstep(0.3, 1., hK) * (0.3 + 0.75 * slope) + 0.25 * rimL * (0.4 + 0.6 * slope) + 0.22 * (slope - 0.5), 0., 1.);
          vec3 bcol = mix(uBase * mix(0.4, 0.6, hK) * (0.86 + 0.28 * bil), uCream * 0.7, litK);
          // a nearer, lower rank of smaller heads stands in front of the bank's dark base, and its foot runs down into the far canopy
          float hL = clamp((e + 0.1) / max(topL + 0.1, 0.02), 0., 1.);
          float litL = clamp(smoothstep(0.45, 1., hL) * (0.25 + 0.6 * slope) + 0.18 * (slope - 0.5), 0., 1.);
          vec3 lcol = mix(uBase * mix(0.5, 0.66, hL) * (0.88 + 0.24 * bil), uCream * 0.6, litL);
          bcol = mix(bcol, lcol, 1. - smoothstep(topL - 0.005, topL, e));
          bcol = mix(bcol, uHaze, 0.06 + 0.16 * (1. - smoothstep(-0.16, -0.03, e)));
          col = mix(col, bcol, bank);
          col += uSunCol * (0.16 * pow(sd, 24.) + 0.5 * pow(sd, 400.)) * (1. - 0.55 * uVeil);
          col += uSunCol * 26. * smoothstep(0.99965, 0.99985, sd) * (1. - 0.75 * uVeil);
          gl_FragColor = vec4(col, 1.);
        }`}),Ie=new i.Mesh(new i.SphereGeometry(4200,32,20),Go);Ie.renderOrder=-10,Ie.frustumCulled=!1,b.add(Ie),await l.yield();const ct=[];R.forEach((e,t)=>{if(t>=I)return;const s=Math.round(W(e.a*e.b/2600,9,56));for(let o=0;o<s;o++){const a=S()*le,n=Math.sqrt(S())*.82,u=W(Math.min(e.a,e.b)*S.range(.5,.9),45,150)*(1-.4*n);ct.push(t,Math.cos(a)*n*e.a,Math.sin(a)*n*e.b,S.range(0,1)*u*.5*(1-n),u,S())}});const Oe=be(),lo=new Float32Array(ct);Oe.setAttribute("iP",new i.InstancedBufferAttribute(lo.filter((e,t)=>t%6<3),3)),Oe.setAttribute("iP2",new i.InstancedBufferAttribute(lo.filter((e,t)=>t%6>=3),3)),Oe.instanceCount=ct.length/6;const Io=new i.ShaderMaterial({uniforms:{uClA:g.uClA,uWindDir:g.uWindDir,uSunDir:g.uSunDir,uSunCol:g.uSunCol,uTime:g.uTime,uTop:{value:A(p.cloudTop)},uBase:{value:A(p.cloudBase)},uHaze:{value:Le},uAltC:{value:Array.from({length:I},(e,t)=>R[t]?.alt??500)}},transparent:!0,depthWrite:!1,fog:!1,vertexShader:`
        attribute vec3 iP, iP2;
        uniform vec4 uClA[${I}]; uniform vec2 uWindDir; uniform vec3 uSunDir; uniform float uAltC[${I}], uTime;
        varying vec2 vQ, vL; varying vec3 vK;
        void main() {
          vec4 A = uClA[int(iP.x + 0.5)]; float uAlt = uAltC[int(iP.x + 0.5)];
          vec2 c = A.xy + uWindDir * iP.y + vec2(-uWindDir.y, uWindDir.x) * iP.z;
          vec3 w = vec3(c.x, 0., c.y) + uSunDir * (uAlt / max(uSunDir.y, 0.2)) + vec3(0., iP2.x, 0.);
          vec4 mv = viewMatrix * vec4(w, 1.);
          vec2 q = vec2(position.x, position.y * 2. - 1.);
          mv.xy += q * iP2.y * vec2(1., 0.72);
          vQ = q; vK = vec3(iP2.z, iP2.x / max(iP2.y, 1.), length(mv.xyz));
          vL = vec2((iP2.x + q.y * iP2.y * 0.72) / max(0.5 * min(A.z, A.w), 20.), dot(c - A.xy, uSunDir.xz) / max(max(A.z, A.w), 20.));
          gl_Position = projectionMatrix * mv;
        }`,fragmentShader:`
        uniform vec3 uTop, uBase, uHaze, uSunCol, uSunDir; uniform float uTime;
        varying vec2 vQ, vL; varying vec3 vK;
        float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
          return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
        void main() {
          vec2 s = vQ + vK.x * 31.;
          float n = vn(s * 1.6 + uTime * 0.02) * 0.6 + vn(s * 4.1 - uTime * 0.03) * 0.4;
          float d = length(vQ * vec2(1., 1.1 + 1.3 * step(vQ.y, 0.)));
          float a = 1. - smoothstep(0.52, 0.86, d + (n - 0.5) * 0.7);
          // one cloud, not a pile of puffs: its base is flat and in its own shade, its top and its sunward side are lit
          a *= smoothstep(-0.2, 0.02, vL.x + (n - 0.5) * 0.12);
          if (a < 0.01) discard;
          float bil = smoothstep(0.25, 0.8, n + 0.5 * vQ.y);
          float lift = clamp(smoothstep(0.02, 0.62, vL.x + 0.42 * vQ.y + (n - 0.5) * 0.4) * (0.5 + 0.5 * bil) + 0.35 * vL.y, 0., 1.);
          // under a low sun the base is lit warm from the side, never a dark smudge
          vec3 col = mix(mix(uBase * 0.62, mix(uBase, uTop * uSunCol, 0.3) * 0.76, 1. - smoothstep(0.35, 0.7, uSunDir.y)), uTop * uSunCol * 0.9, lift);
          float f = 1. - exp(-vK.z * vK.z * 2.4e-7);
          col = mix(col, uHaze, f * 0.7);
          gl_FragColor = vec4(col, a * (1. - f * 0.4));
        }`}),ut=new i.Mesh(Oe,Io);ut.frustumCulled=!1,ut.renderOrder=-5,b.add(ut),await l.yield();const dt=Math.round((Ve?1100:620)*Z),vt=be(),co=new Float32Array(dt*4),uo=w.fork("motes");for(let e=0;e<dt*4;e++)co[e]=uo();B(vt,"iM",co,4),vt.instanceCount=dt;const vo=new i.ShaderMaterial({uniforms:{uTime:g.uTime,uRes:g.uRes,uWindDir:g.uWindDir,uGold:{value:M[3]},uK:{value:1}},transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,fog:!1,vertexShader:`
        attribute vec4 iM; uniform float uTime, uK; uniform vec2 uRes, uWindDir;
        varying vec2 vQ; varying float vA;
        void main() {
          vec3 B = vec3(120., 56., 120.);
          vec3 b = iM.xyz * B + vec3(uWindDir.x, 0.05, uWindDir.y) * uTime * (5. + 3. * iM.w);
          b += vec3(sin(uTime * 0.7 + iM.w * 40.), sin(uTime * 0.9 + iM.w * 17.) * 0.7, cos(uTime * 0.6 + iM.w * 29.)) * 1.3;
          vec3 p = mod(b - cameraPosition + 0.5 * B, B) - 0.5 * B + cameraPosition;
          vec4 mv = viewMatrix * vec4(p, 1.);
          float dist = max(-mv.z, 0.1);
          float minW = dist * 3.2 / max(uRes.y * projectionMatrix[1][1], 1.);
          float size = max(0.09 + 0.07 * iM.w, minW);
          vQ = vec2(position.x, position.y * 2. - 1.);
          mv.xy += vQ * size;
          float tw = 0.5 + 0.5 * sin(uTime * (1.5 + 2.5 * iM.w) + iM.w * 60.);
          vA = uK * (0.35 + 0.65 * tw) * smoothstep(2., 7., dist) * (1. - smoothstep(42., 58., dist)) * min(1., (0.09 + 0.07 * iM.w) / size + 0.3);
          gl_Position = projectionMatrix * mv;
        }`,fragmentShader:`
        uniform vec3 uGold; varying vec2 vQ; varying float vA;
        void main() { float d = dot(vQ, vQ); float a = (1. - smoothstep(0.05, 1., d)) * vA; gl_FragColor = vec4(uGold * 3.4 * a, 1.); }`}),ft=new i.Mesh(vt,vo);ft.frustumCulled=!1,ft.renderOrder=6,b.add(ft),await l.yield();const ht=Math.round(240*Z),mt=be(),fo=new Float32Array(ht*4);for(let e=0;e<ht*4;e++)fo[e]=uo();B(mt,"iM",fo,4),mt.instanceCount=ht;const Oo=new i.ShaderMaterial({uniforms:{...J(),...g,uCrimson:{value:M[1]},uCoral:{value:M[2]},uSand:{value:A(p.sand)}},side:i.DoubleSide,fog:!0,vertexShader:`
        attribute vec4 iM;
        ${te}
        ${Ct}
        uniform float uTime; uniform vec2 uRes; uniform vec3 uCrimson, uCoral, uSand;
        varying vec3 vC; varying float uShade;
        #include <fog_pars_vertex>
        void main() {
          vec2 B = vec2(110., 110.);
          float sp = 2.5 + 5. * iM.w, gust = 0.6 + 0.4 * sin(uTime * 0.5 + iM.z * 20.);
          vec2 b = iM.xy * B + uWindDir * (uTime * sp * gust + 4. * sin(uTime * 0.37 + iM.w * 30.));
          vec2 pxz = mod(b - cameraPosition.xz + 0.5 * B, B) - 0.5 * B + cameraPosition.xz;
          float hop = abs(sin(uTime * (1.3 + iM.z) + iM.w * 50.));
          vec3 c = vec3(pxz.x, groundY(pxz) + 0.12 + hop * hop * (0.3 + 1.6 * iM.z * iM.z), pxz.y);
          float ang = iM.w * 6.28 + uTime * (1.5 + 2. * iM.z) * (iM.z > 0.5 ? 1. : -1.);
          vec4 mvPosition = viewMatrix * vec4(c, 1.);
          float dist = max(-mvPosition.z, 0.1);
          float px = dist * 2. / max(uRes.y * projectionMatrix[1][1], 1.);
          vec2 q = vec2(position.x * (0.3 + 0.5 * iM.z), (position.y - 0.5) * max(0.05, 1.7 * px));
          mvPosition.xy += mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * q * (1. - smoothstep(60., 75., dist));
          vC = mix(uCrimson, mix(uCoral, uSand, 0.5), iM.w * iM.w);
          uShade = shade(pxz, iM.w).x;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        ${we}
        varying vec3 vC;
        #include <fog_pars_fragment>
        void main() {
          gl_FragColor = vec4(min(vC * (uSunCol * (1. - uShade) * 0.75 + fillLight(1.) * 0.8), vec3(0.9)), 1.);
          #include <fog_fragment>
        }`}),ho=new i.Mesh(mt,Oo);ho.frustumCulled=!1,b.add(ho),await l.yield();const Qe=be();Qe.setAttribute("iRoot",ne.getAttribute("iRoot")),Qe.setAttribute("iSize",ne.getAttribute("iSize")),Qe.instanceCount=H;const Qo=new i.ShaderMaterial({uniforms:{...J(),...g,uMint:{value:M[6]}},transparent:!0,depthWrite:!1,fog:!0,vertexShader:`
        attribute vec3 iRoot; attribute vec4 iSize;
        ${te}
        uniform vec3 uCamP, uCamT; uniform float uCamSpeed, uTime;
        varying vec2 vQ; varying vec3 vA; varying float uShade;
        #include <fog_pars_vertex>
        void main() {
          float seed = iSize.w;
          vec3 sr = shade(iRoot.xz, seed);
          vec3 cc = iRoot + vec3(0., iSize.x * 0.5, 0.) - uCamP;
          float al = dot(cc, uCamT), perp = length(cc - al * uCamT);
          float tc = ((18. - al) / max(uCamSpeed, 1.) - 0.5) / 1.5;
          float puff = max(sr.z, (1. - smoothstep(8., 11.5, perp)) * smoothstep(0., 0.25, tc) * (1. - smoothstep(0.45, 1., tc)));
          float age = fract(uTime * 0.45 + seed * 7.);
          vec3 c = iRoot + vec3(0., 0.8 + age * 6.5, 0.) + vec3(uWindDir.x, 0., uWindDir.y) * age * age * 5.;
          float size = (0.9 + age * 2.3) * (0.8 + 0.5 * fract(seed * 13.));
          vQ = vec2(position.x, position.y * 2. - 1.);
          vec4 mvPosition = viewMatrix * vec4(c, 1.);
          mvPosition.xy += vQ * size * step(0.004, puff);
          // one small bright breath from a mouth whose plume has just gone down; never a veil in front of the lens
          vA = vec3(puff * sin(3.14159 * age) * smoothstep(9., 22., length(mvPosition.xyz)), seed, age); uShade = sr.x;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        ${we}
        uniform vec3 uMint; varying vec2 vQ; varying vec3 vA;
        #include <fog_pars_fragment>
        void main() {
          float d = length(vQ);
          float n = vnoise(vQ * 2.2 + vA.y * 30. + vec2(0., -uTime * 0.3)) * 0.6 + vnoise(vQ * 5. + vA.y * 11.) * 0.4;
          float a = (1. - smoothstep(0.35, 0.95, d + (n - 0.5) * 0.5)) * vA.x * 0.62;
          if (a < 0.004) discard;
          vec3 col = uMint * (uSunCol * (1. - uShade) * (0.75 + 0.4 * n) + fillLight(0.6) * 1.35);
          gl_FragColor = vec4(col, a);
          #include <fog_fragment>
        }`}),pt=new i.Mesh(Qe,Qo);pt.frustumCulled=!1,pt.renderOrder=4,b.add(pt),await l.yield();const Ue=_e*2+12,xt=[],mo=[],ke=[],po=[],fe=(e,t,s,o,a,n,u=0,v=1,d=0)=>(xt.push(e,t,s),mo.push(o,a,n),po.push(u,v,d),xt.length/3-1);{const e=[[-2.3,.03],[-1.75,.27],[-1,.47],[-.2,.61],[.5,.65],[1.1,.53],[1.6,.35],[2,.41],[2.35,.45],[2.7,.31],[2.95,.03]],t=8,s=a=>{for(let n=1;n<e.length;n++)if(a<=e[n][0]){const u=e[n-1],v=e[n];return G(u[1],v[1],(a-u[0])/(v[0]-u[0]))}return .03};e.forEach(([a,n],u)=>{const v=e[Math.max(0,u-1)],d=e[Math.min(e.length-1,u+1)],c=(d[1]-v[1])/(d[0]-v[0]);for(let r=0;r<=t;r++){const h=r/t*le,f=Math.cos(h),m=Math.sin(h),C=Math.hypot(f/1.2,m/.85,c)||1;fe(f*n*1.2,m*n*.85-.04,a,0,u/(e.length-1),r/t,f/1.2/C,m/.85/C,-c/C)}});for(let a=0;a<e.length-1;a++)for(let n=0;n<t;n++){const u=a*(t+1)+n,v=u+t+1;ke.push(u,v,u+1,u+1,v,v+1)}{let a=null;for(let n=0;n<=6;n++){const u=n/6,v=G(1.25,-1.7,u),d=-.85*s(v)+.06,c=.95*Math.sin(Math.PI*Math.pow(u,.8))*(1-.3*u),r=fe(0,d,v,4,u,0,1,0,0),h=fe(0,d-c,v-.35*c,4,u,1,1,0,0);a&&ke.push(a[0],a[1],r,r,a[1],h),a=[r,h]}}const o=(a,n,u,v,d,c)=>{let r=null;for(let h=0;h<=8;h++){const f=h/8,m=a*(.3+f*v),C=u+d*f,z=c*Math.pow(1-f,.8)+.05,D=fe(m,.05,C+z*.36,n,f,0),X=fe(m,.05,C-z*.64,n,f,1);r&&ke.push(r[0],r[1],D,D,r[1],X),r=[D,X]}};for(const a of[-1,1])o(a,1,.75,3,.55,2.1),o(a,2,-.8,2.2,-1.15,1.55);for(const a of[-1,1]){let n=null;for(let u=0;u<=10;u++){const v=u/10,d=a*(.1+.75*v*v),c=-1.9-v*6,r=.3*(1-.65*v)+.05,h=fe(d-r,0,c,3,v,0),f=fe(d+r,0,c,3,v,1);n&&ke.push(n[0],n[1],h,h,n[1],f),n=[h,f]}}}const se=new i.InstancedBufferGeometry;se.setAttribute("position",new i.Float32BufferAttribute(xt,3)),se.setAttribute("aK",new i.Float32BufferAttribute(mo,3)),se.setAttribute("aN",new i.Float32BufferAttribute(po,3)),se.setIndex(ke);const xo=new Float32Array(Ue*16),Fe=new Float32Array(Ue*4),gt=new i.InstancedInterleavedBuffer(xo,16);gt.setUsage(i.DynamicDrawUsage);for(let e=0;e<4;e++)se.setAttribute("iM"+e,new i.InterleavedBufferAttribute(gt,4,e*4));const Uo=B(se,"iX",Fe,4,!0);se.instanceCount=Ue;const jo=new i.ShaderMaterial({uniforms:{...J(),...g,uWhite:{value:M[6]}},side:i.DoubleSide,fog:!0,vertexShader:`
        attribute vec3 aK, aN; attribute vec4 iM0, iM1, iM2, iM3, iX;
        ${te}
        uniform float uTime;
        varying vec3 vK, vW, vN; varying float uShade; varying vec3 vUp;
        #include <fog_pars_vertex>
        void main() {
          mat4 M = mat4(iM0, iM1, iM2, iM3);
          float part = aK.x, t = aK.y, seed = iX.x, fold = iX.z;
          vec3 p = position;
          float ph = uTime * (2.1 + seed) + seed * 40.;
          if (part > 0.5 && part < 2.5) {
            float lag = part > 1.5 ? 1.1 : 0.;
            float flap = iX.y * sin(ph - lag - t * 1.4) * (0.25 + 0.75 * t) * t * (part > 1.5 ? 0.75 : 1.);
            float lift = 0.32 * t + 0.5 * t * t + flap;                                   // held in a shallow V: a light side and a shaded side at once
            p.y += mix(lift, (part > 1.5 ? 0.3 : 1.9) * t, fold) * abs(p.x) * 0.42;      // perched: the fore pair raised, the hind pair spread
            p.x *= mix(1. - 0.1 * flap * flap, 0.42, fold);
          } else if (part > 2.5 && part < 3.5) {
            p.y += t * (0.5 * sin(ph * 2.3 - t * 7.) * (0.3 + t) - 2.2 * t * fold);
            p.x += t * 0.35 * sin(ph * 1.7 - t * 5. + seed * 9.);
            p.z = mix(p.z, -1.9 - t * 2.5, fold);
          } else if (part < 0.5) {
            p.y += 0.05 * sin(ph - 0.6) * iX.y;                                           // the body rides the wing beat
          }
          vec4 w = M * vec4(p, 1.);
          vK = aK; vW = w.xyz; vUp = normalize(M[1].xyz + vec3(0., 1e-4, 0.));
          vN = mat3(M) * aN;
          uShade = shade(w.xz, seed).x;
          vec4 mvPosition = viewMatrix * w;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        ${we}
        uniform vec3 uWhite; varying vec3 vK, vW, vUp, vN;
        #include <fog_pars_fragment>
        void main() {
          vec3 dx = dFdx(vW), dy = dFdy(vW);
          vec3 Ng = cross(dx, dy); Ng = Ng / max(length(Ng), 1e-9);
          vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.));
          float part = vK.x, t = vK.y, v = vK.z;
          float bodyK = 1. - step(0.5, part), wingK = step(0.5, part) * step(part, 2.5), tailK = step(2.5, part) * step(part, 3.5), keelK = step(3.5, part);
          // N faces the eye; topK says whether the eye sees the animal's upper side (near-white) or its underside (the shade colour)
          vec3 N; float topK;
          if (bodyK > 0.5) {
            N = normalize(vN + vec3(0., 1e-5, 0.)); topK = smoothstep(-0.3, 0.25, dot(N, vUp));
          } else {
            vec3 Nt = dot(Ng, vUp) < 0. ? -Ng : Ng;
            float see = dot(Nt, V); topK = step(0., see); N = see < 0. ? -Nt : Nt;
          }
          vec3 tn = uTeal / max(max(uTeal.r, uTeal.g), max(uTeal.b, 1e-3));
          vec3 under = mix(tn, uWhite, 0.74) * 0.78;
          // wings: six battens across each, a darker leading spar, dark tips
          float rc = t * 6.4 + 0.5 * v, rw = fwidth(rc);
          float rib = wingK * (1. - smoothstep(0.05, 0.05 + max(rw, 0.04), abs(fract(rc) - 0.5))) * (1. - smoothstep(0.35, 0.9, rw));
          float spar = wingK * (1. - smoothstep(0.0, 0.12, v));
          float tipK = wingK * smoothstep(0.66, 0.9, t + 0.12 * (v - 0.5));
          // body: a dark stripe down the back, a dark cap on the head, a pale throat
          float back = 1. - smoothstep(0.035, 0.085, abs(v - 0.25));
          float cap = smoothstep(0.76, 0.82, t) * smoothstep(-0.1, 0.35, dot(N, vUp));
          vec3 top = uWhite * 0.92;
          vec3 alb = mix(under, top, topK);
          alb = mix(alb, under * 0.62, wingK * max(tipK, max(spar * 0.6, rib * mix(0.75, 0.3, topK))));
          alb = mix(alb, under * 0.55, bodyK * max(back * 0.85 * step(t, 0.78), cap * 0.8));
          alb = mix(alb, under * 0.8, keelK);
          alb = mix(alb, mix(under * 0.9, top, 0.5 + 0.5 * sin(t * 19.)), tailK * 0.85);            // the ribbon tail is banded light and dark
          float sunK = 1. - 0.6 * uShade;        // they ride high: the shadow only half takes them
          float ndl = dot(N, uSunDir), front = max(ndl, 0.), backL = max(-ndl, 0.);
          vec3 lit = uSunCol * sunK * mix(0.1 + 0.9 * front, 0.4 + 0.6 * front, topK) * mix(1., 0.8, bodyK) + fillLightS(N.y, 0.) * mix(1.1, 0.9, topK) + uSunCol * 0.12 * (1. - topK);
          vec3 col = alb * lit;
          // the sun through the membrane: a warm glow on the side turned from it, the battens dark against it
          col += uSunCol * vec3(1., 0.8, 0.56) * sunK * backL * 0.5 * (wingK + 0.6 * tailK) * (1. - rib) * (1. - tipK) * mix(1., 0.55, topK);
          gl_FragColor = vec4(min(col * 1.08, vec3(1.1)), 1.);
          #include <fog_fragment>
        }`}),go=new i.Mesh(se,jo);go.frustumCulled=!1,b.add(go),await l.yield(),await l.yield();const je=new i.Vector3(0,1,0),yo=new i.Matrix4,re=new i.Vector3,yt=new i.Vector3,Pe=new i.Vector3,F=new i.Vector3,he=new i.Vector3,$o=new i.Vector3,$e=new i.Vector3,ha=new i.Vector3,Xo=w.fork("birds"),wt=Array.from({length:Ue},()=>Xo()),Xe=(e,t,s,o,a,n,u)=>{Pe.copy(s).normalize(),re.crossVectors(je,Pe),re.lengthSq()<1e-6&&re.set(1,0,0),re.normalize(),yt.crossVectors(Pe,re).multiplyScalar(Math.cos(o)).addScaledVector(re,Math.sin(o)).normalize(),re.crossVectors(yt,Pe),yo.makeBasis(re,yt,Pe).scale($e.set(a,a,a)).setPosition(t),yo.toArray(xo,e*16),Fe[e*4]=wt[e],Fe[e*4+1]=n,Fe[e*4+2]=u,Fe[e*4+3]=0},wo=new i.Vector3(-.75,0,.66).normalize(),Yo=new i.Vector3(-.9,0,.44).normalize(),bt=Q(.646),Zo=.61*V,Jo=38,St=new i.Vector3,bo=(e,t)=>{const s=St.x-e.x,o=St.z-e.z,a=Math.hypot(s,o)*Math.hypot(t.x,t.z);return a>.001?(t.z*s-t.x*o)/a:0},So=(e,t)=>{const s=e*V;let o=0,a=0;k.pointAt(e,St);for(let d=0;d<2;d++){const c=d?Yo:wo;for(let r=0;r<_e;r++,a++){const h=wt[a];d===0?F.set(34,64,262).addScaledVector(c,14*s-9*r):F.set(bt.x,bt.y-15,bt.z+6).addScaledVector(c,14*(s-Zo)+9-Math.min(10,58/(_e-1))*(r-(_e-1)*.5));const f=d?(r&1?7:-7)+(h-.5)*3:(h-.5)*5;if(F.x+=c.z*f,F.z-=c.x*f,F.y+=Math.sin(t*.7+h*20)*.8+(d?(r%3-1)*3.4:(h-.5)*3),Xe(a,F,c,.12*Math.sin(t*.5+h*30)+(d?.5*bo(F,c):0),d?1.6:1.15,.55,0),o<Re){const m=(F.y-Jo)/ae.y;g.uDisc.value[o++].set(F.x-ae.x*m,F.z-ae.z*m,c.x,c.z)}}}for(;o<Re;o++)g.uDisc.value[o].set(1e5,1e5,1,0);for(let d=0;d<6;d++,a++){const c=it[d];if(!c){Xe(a,F.set(0,-500,0),wo,0,.001,0,1);continue}const r=y(c.pu-.006,c.pu+.06,e),h=wt[a];he.set(K.x,0,K.y).applyAxisAngle(je,(h-.5)*1.6),F.set(c.x,c.y+c.H+2.1,c.z).addScaledVector(he,75*r*r).addScaledVector(je,46*r*(2-r)),Xe(a,F,$o.copy(he).addScaledVector(je,.5*r*(1-r)),0,2,.25+1.05*y(0,.2,r),.55*(1-y(0,.12,r)))}const n=y(x(230),x(140),e),u=y(x(40),x(6),e),v=P.object.position.y+150;for(let d=0;d<6;d++,a++){const c=d&1?1:-1,r=d>>1,h=c*(t*.5+r*le/3)+d*.4,f=46*(1-n)*(1-n)+34*u*u;he.set(T.x+c*(22+(r===1?6:0)+f),v+8.5*(1-r)-1+40*(1-n)*(1-n)+14*u,T.z-9+5*r),F.set(he.x+Math.cos(h)*2.8,he.y+1.2*Math.sin(h*.5+d),he.z+Math.sin(h)*6.5),$e.set(-Math.sin(h)*c*2.8,.3*Math.cos(h*.5+d)*c,Math.cos(h)*c*6.5),Xe(a,F,$e,.35*c*(d&2?1:-1)+.25*bo(F,$e),n>.001?1.8:.001,.22,0)}gt.needsUpdate=!0,Uo.needsUpdate=!0};So(0,0),await l.yield();const ma=Tt(new i.Vector3(0,198,0)),Ye=Tt(new i.Vector3(0,150,0)),ea=new i.Vector3,ta=new i.Vector3,oa=new i.Vector3,Se=new i.Vector3,aa=new i.Vector3,ia=R.find(e=>e.entry),Mo=new i.Vector2,Co={S:0,R:0},Ze=new i.Vector3,zo=new i.Vector3,na=Math.round(k.length/28);return{scene:b,path:k,duration:na,pace:e=>1-.26*y(.27,.34,e)*(1-y(.44,.52,e)),title:p.key==="crimson"?"The Flinching Forest":p.key==="saffron"?"The Flinching Forest, Saffron Day":"The Flinching Forest, White Bloom",camera:{fov:62,near:.3,far:5e3,lookAhead:22,sway:.6,bank:.55},pois:[{at:(e,t)=>(Rt(ia,Math.min(t,.1)*V,Se),Se.x=Se.x*.5+6,Se.z+=25,Se.y=0,Se),from:.032,to:.17,weight:.6,fade:.27},{at:(e,t)=>aa.copy(Ye).setY(105),from:.115,to:.33,weight:.5,fade:.3},{at:(e,t)=>k.pointAt(Math.min(1,t+70/k.length),oa).setY(-8),from:.28,to:.6,weight:.3,fade:.2},{at:(e,t)=>ta.copy(Ye).setY(G(150,158,y(x(340),x(210),t))),from:E(.4),to:x(170),weight:.55},{at:(e,t)=>ea.copy(Ye).setY(G(G(150,127,y(x(255),x(165),t)),Ye.y+1,y(x(160),x(60),t))),from:x(300),to:.975,weight:.8,fade:.14}],portal:{shape:"circle",radius:7,color:p.pal[6],glow:1},post:{exposure:.93,bloom:{strength:.32,radius:.6,threshold:.96},grade:{saturation:1.08,contrast:1.1,tint:"#ffffff",shadowTint:"#06181a",vignette:.3,grain:.02,aberration:0}},ride:"none",style:"none",update(e,t,s,o){const a=o*V;Bt(a),Ro(t),g.uTime.value=t,Y.getDrawingBufferSize(Mo),g.uRes.value.copy(Mo),k.pointAt(o,Ze),k.tangentAt(o,zo),g.uCamP.value.copy(Ze),g.uCamT.value.copy(zo);const n=Do?y(E(.425),E(.455),o)*(1-y(E(.475),E(.515),o)):0;g.uVeil.value=n,no(o),So(o,t);const u=1-.3*y(.975,1,o);P.setFlinch(y(x(262),x(168),o),.8*y(x(180),x(108),o),.8*y(x(172),x(100),o),y(x(122),x(92),o)*u,y(x(114),x(84),o)*u),P.uniforms.uShade.value=n>.01?.51*n:.78*(1-y(x(116),x(84),o)),P.uniforms.uShadeY.value=n>.01?400:o<x(165)?G(-30,138,y(x(283),x(165),o)):G(138,300,y(x(140),x(98),o)),P.uniforms.uRingGlow.value=y(x(420),x(300),o)*(1-y(x(170),x(128),o)),P.update(e,t,s),Fo(Ze.x,Ze.z,a,Co),vo.uniforms.uK.value=(Ve?1.25:1)*(1-.45*Math.max(Co.S,.6*n)),s.getWorldPosition(Ie.position)},dispose(){P.dispose();for(const e of Ke)e.dispose()}}}};export{ga as default};
