import*as u from"three";import{mergeGeometries as Mt}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as L,lerp as j,smoothstep as k,makeNoise as ot}from"../kit/core.js";const zt=["#020308","#17130F","#8FA6C4","#FFE9B0","#FFF8E6","#EAD9B0","#3FA8FF"],P=300,S=500,$=136,D=236,ze=30,I=`
uniform float uS, uTime, uLineQ, uRc, uPen, uElevMax, uSunI, uSpeed, uIce;
uniform vec2 uAway;
uniform vec3 uSunCol, uFrostCol, uIonCol;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm3(vec2 p){ return vn(p) * .5 + vn(p * 2.03 + 7.1) * .27 + vn(p * 4.1 + 3.3) * .15 + vn(p * 8.3 + 1.7) * .08; }
float tanElev(vec2 xz){ return clamp((uLineQ - dot(xz, uAway)) / uRc, -0.4, uElevMax); }
vec3 sunL(float te){ return normalize(vec3(-uAway.x, max(te, 0.04), -uAway.y)); }
`,Je=`
// alb: albedo, N: local normal, P: local position, hor: tan of the horizon angle toward the sun,
// frostM: frost mask, dip: how much earlier this point lights (height above its base), dist: to eye
vec3 crustShade(vec3 alb, vec3 N, vec3 P, float hor, float frostM, float dip, float dist, float shade){
  float te = tanElev(P.xz);
  float d = te - hor + dip;
  float lit = smoothstep(-uPen, uPen, d) * shade;
  vec3 L = sunL(te);
  float ndl = max(dot(N, L), 0.);
  float since = max(d, 0.) * uRc / uSpeed;
  float frost = frostM * (1. - smoothstep(0.15, 2.2, since));
  vec3 a = mix(alb, mix(uFrostCol, uSunCol, 0.4) * 0.11, frost * 0.85 * (1. - smoothstep(0.015, 0.06, te)));
  vec3 col = a * uSunCol * uSunI * ndl * lit;
  col += a * uSunCol * uSunI * 0.8 * exp(-since / 1.5) * lit * (0.35 + 0.65 * max(N.y, 0.));     // the ruled line: the crust burns for a second where the light has just arrived
  // from the air the same burn is drawn ruled, without the terrain's own shadows: one line of light across the plain
  float tb = te + 0.035;
  col += a * uSunCol * uSunI * 0.9 * smoothstep(-uPen, uPen, tb) * exp(-max(tb, 0.) * uRc / uSpeed / 1.5) * smoothstep(220., 800., dist) * (0.35 + 0.65 * max(N.y, 0.));
  col += a * uSunCol * uSunI * 0.018 * smoothstep(0.0, 0.08, te) * (0.4 + 0.6 * max(N.y, 0.));   // bounce in the day shadows
  col += a * (uIonCol * 0.05 * max(N.y, 0.) + vec3(0.004, 0.005, 0.007));                        // night: ion-tail breath
  float up = max(N.y, 0.);
  col += mix(uIonCol, uFrostCol, 0.5) * 0.028 * up * up * (1. - 0.9 * smoothstep(-0.02, 0.05, te));   // the same breath, seen: upward faces hold a little blue before dawn
  float nearK = 1. - smoothstep(60., 220., dist);
  col += uFrostCol * frost * (0.075 + 0.05 * nearK) * (0.4 + 0.6 * max(N.y, 0.));               // frost in starlight
  // (polish) the night ground reads: the fountains already burning sunward and the coma light the frost, and every scarp and
  // boulder carries a cold lit edge on the side toward them
  float nightK = 1. - smoothstep(-0.03, 0.04, d);
  vec3 Vn = normalize(cameraPosition - P + vec3(0., 1e-4, 0.));
  vec3 Lg = normalize(vec3(-uAway.x, 0.3, -uAway.y));
  float wrapG = max(dot(N, Lg) * 0.7 + 0.3, 0.);
  float specG = pow(max(dot(N, normalize(Lg + Vn + vec3(0., 1e-3, 0.))), 0.), 22.);
  vec3 glowC = mix(uFrostCol, vec3(0.9, 0.95, 1.), 0.35);
  col += glowC * nightK * (0.03 * wrapG * wrapG * (0.3 + 0.7 * frost) + 0.2 * specG * (0.2 + 0.8 * frost));
  float fresG = 1. - max(dot(N, Vn), 0.); fresG *= fresG; fresG *= fresG;
  col += mix(uIonCol, uFrostCol, 0.4) * nightK * 0.04 * fresG * (0.5 + 0.5 * N.y);
  vec2 gp = P.xz * 1.6, c = floor(gp); float hh = h21(c);
  float tw = 0.5 + 0.5 * sin(uTime * (2. + hh * 5.) + hh * 50.);
  float gr = clamp(dist * 0.0032, 0.07, 0.42);
  float gd = length(gp - c - 0.5 - (vec2(h21(c + 3.7), h21(c + 9.1)) - 0.5) * (0.9 - 2. * gr));
  col += uFrostCol * frost * step(0.94 + 0.045 * smoothstep(40., 350., dist), hh) * (1. - smoothstep(gr * 0.4, gr, gd)) * tw * tw * (3.2 + 3.6 * nearK) * min(1., 0.16 / gr);   // glitter, thickest round the path
  return col;
}
`,Q="#include <fog_pars_vertex>",X=`
#include <fog_pars_fragment>
float fogAmount(){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      return smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #else
    return 0.;
  #endif
}`;function At(){return u.UniformsUtils.clone(u.UniformsLib.fog)}async function kt(g,N={}){const n=g.rng.fork("perihelion-hero"),z=ot(n.int(1,1e9)),Ae=N.detail??g.quality?.detail??1,Z=(N.palette&&N.palette.length>=7?N.palette:zt).map(e=>new u.Color(e)),at=N.duration??40,Ge=N.arriveTime??10.5,nt=N.arriveZ??-21,Y=N.lineSpeed??30,Pe=N.cliffTime??13.6,W=N.vigor??n.pick([.78,1,1,1.32]),Se=N.crust??(n.chance(.25)?"rust":"charcoal"),rt=L(Math.round(N.vents??n.int(26,30)),20,ze-2)&-2,st=L(Math.round(N.farVents??40),0,60),Ce=2200,it=.0065,qe=Math.tan(16*Math.PI/180),Be=15*Math.PI/180,b=new u.Vector2(Math.sin(Be),Math.cos(Be)),ke=(e,t)=>e*b.x+t*b.y,Te=ke(0,nt),ee=2,je=12.5,Ne=e=>{const t=e-Ge;return Te+(t<=ee?Y*t:Y*ee+je*(t-ee))},lt=e=>e<=Y*ee?e/Y:ee+(e-Y*ee)/je,te=(e,t,o=0)=>Ge+lt(ke(e,t)+o*Ce-Te),ct=[n.range(0,50),n.range(0,50)],Fe=(e,t)=>{let o=42+13*z.n2(t/170+ct[e>0?1:0],3.1*e)+3*z.n2(t/23,9.7*e);return e>0&&(o=j(o,47,k(-130,-175,t)*k(-345,-300,t))),e*o},d={x0:62,x1:140,z0:-298,z1:-172,top:n.range(54,62)},he=[],pe=[];for(let e=0,t=0;e<9&&t<200;t++){const o=n.range(-240,240),a=n.range(-420,420),r=n.range(17,26);Math.abs(o)<75||o>30&&a<-140&&a>-330||he.some(i=>Math.hypot(i.x-o,i.z-a)<90)||(he.push({x:o,z:a,r,depth:n.range(7,12)}),e++)}for(let e=0,t=0;e<9&&t<300;t++){const o=n.range(-230,230),a=n.range(-400,400),r=n.range(26,52);Math.abs(o)<20+r*.4||o>20&&a<-130&&a>-340||he.some(i=>Math.hypot(i.x-o,i.z-a)<i.r+r+15)||pe.some(i=>Math.hypot(i.x-o,i.z-a)<i.r+r+20)||(pe.push({x:o,z:a,r,level:0}),e++)}const F=[],_e=rt/2,ft=-330,ut=285;for(let e=-1;e<=1;e+=2)for(let t=0;t<_e;t++){const o=j(ft,ut,(t+.5+n.range(-.28,.28)+(e>0?.25:-.25))/_e);F.push({x:Fe(e,o),z:o,side:e,H:(170+n.range(0,150))*W,near:!0})}const Re={x:49,z:-236,side:1,H:150*W,near:!0,cliff:!0};for(let e=F.length-1;e>=0;e--)F[e].side>0&&Math.abs(F[e].z-Re.z)<26&&F.splice(e,1);F.push(Re);const E=[];for(let e=0,t=0;e<st&&t<600;t++){const o=n.range(-270,270),a=n.range(-470,430);Math.abs(o)<105||Math.hypot(o/P,a/S)>.93||o>40&&o<170&&a<-140&&a>-330||E.some(r=>Math.hypot(r.x-o,r.z-a)<45)||(E.push({x:o,z:a,H:(150+n.range(0,380))*W,near:!1}),e++)}const $e=n.range(0,100),vt=n.range(0,100),mt=n.range(6.5,9);function De(e,t){let o=z.fbm2(e/260+$e,t/260,3)*7;const a=z.fbm2(e/210+vt,t/210+$e,3)*2.6+z.n2(e/37,t/37)*.06,r=Math.floor(a),i=a-r;return o+=(r+k(.36,.64,i)+i*.12)*mt,o+=z.fbm2(e/46,t/46+20,4)*1.7+z.n2(e/9,t/9)*.35,o}const dt=pe.map(e=>(e.level=De(e.x,e.z)-1.2,e)),Ke={pond:0};function ht(e,t){let o=De(e,t),a=0;for(const f of dt){const l=e-f.x,c=t-f.z;if(Math.abs(l)>f.r*1.4||Math.abs(c)>f.r*1.4)continue;const s=Math.hypot(l,c)/(f.r*(1+.22*z.n2(e/31+f.x,t/31))),m=1-k(.72,1,s);o=j(o,f.level+.25*Math.sin(s*9),m),a=Math.max(a,m)}for(const f of he){const l=e-f.x,c=t-f.z;if(Math.abs(l)>f.r*1.8||Math.abs(c)>f.r*1.8)continue;const s=Math.hypot(l,c)/(f.r*(1+.12*z.n2(e/17,t/17+f.z)));o-=f.depth*(1-k(.5,1,s))-2.4*Math.exp(-(((s-1.08)/.2)**2))}const r=1-k(9,36,Math.abs(e));o=j(o,L(o,-3.5,3.5)*.55,r*.9);for(let f=-1;f<=1;f+=2){const l=Math.abs(e-Fe(f,t));l<22&&(o+=-3.6*Math.exp(-((l/3.2)**2))+1.3*Math.exp(-(((l-7)/3)**2)))}{const f=k(d.x0-1,d.x0+9,e)*(1-k(d.x1,d.x1+70,e)),l=k(d.z0-45,d.z0+4,t)*(1-k(d.z1-4,d.z1+45,t)),c=f*l;c>0&&(o=j(o,d.top-3+z.fbm2(e/30,t/30,3)*3-(e-d.x0)*.06,c))}for(const f of F){const l=e-f.x,c=t-f.z;if(Math.abs(l)>20||Math.abs(c)>20)continue;const s=Math.hypot(l,c);o+=3.2*Math.exp(-((s/7.5)**2))-4.6*Math.exp(-((s/2.8)**2))}for(const f of E){const l=e-f.x,c=t-f.z;if(Math.abs(l)>26||Math.abs(c)>26)continue;const s=Math.hypot(l,c);o+=5*Math.exp(-((s/10)**2))-6*Math.exp(-((s/3.6)**2))}{const f=Math.hypot(e-15,t-175)/9;f<2&&(o-=2.6*(1-k(.4,1.2,f)))}const i=Math.hypot(e/P,t/S),v=Math.max(0,i-.58)/.42;return o-=v*v*32+Math.max(0,i-1)*260,Ke.pond=a,o}await g.yield();const w=$+1,ge=D+1,oe=w*ge,J=new Float32Array(oe),ce=new Float32Array(oe);for(let e=0;e<ge;e++){const t=-S+2*S*e/D;for(let o=0;o<w;o++){const a=-P+2*P*o/$;J[e*w+o]=ht(a,t),ce[e*w+o]=Ke.pond}e&1&&await g.yield()}const ae=2*P/$,ne=2*S/D;function fe(e,t,o){const a=L((t+P)/ae,0,$-.001),r=L((o+S)/ne,0,D-.001),i=Math.floor(a),v=Math.floor(r),f=a-i,l=r-v,c=v*w+i;return j(j(e[c],e[c+1],f),j(e[c+w],e[c+w+1],f),l)}const _=(e,t)=>fe(J,e,t);for(const e of F)e.y=_(e.x,e.z)+.5;for(const e of E)e.y=_(e.x,e.z)+.5;const ue=new Float32Array(oe);{const e=-b.x,t=-b.y,o=[];for(let a=3.5;a<520;a*=1.13)o.push(a);for(let a=0;a<ge;a++){const r=-S+a*ne;for(let i=0;i<w;i++){const v=-P+i*ae,f=J[a*w+i];let l=-.035;for(let c=0;c<o.length;c++){const s=o[c],m=v+e*s,h=r+t*s;if(m<-P||m>P||h<-S||h>S)break;const y=(fe(J,m,h)-f)/s;y>l&&(l=y)}ue[a*w+i]=Math.min(l,.8)}a&1&&await g.yield()}}await g.yield();const Ue=ue.slice(),Ve=(e,t)=>fe(Ue,e,t),re=[],ve=new u.Quaternion,Oe=new u.Euler,se=(e,t,o=8)=>e>d.x0-22-o&&e<d.x1+40&&t>d.z0-40&&t<d.z1+40,ye=(e,t,o)=>F.some(a=>Math.hypot(a.x-e,a.z-t)<o);function R(e,t,o,a={}){const r=a.squat??n.range(.55,1),i=(a.y??_(e,t))-o*r*(a.sink??n.range(.12,.35));Oe.set(n.range(-.3,.3),n.range(0,6.283),n.range(-.3,.3)),ve.setFromEuler(Oe);const v={x:e,y:i,z:t,r:o,sx:o*n.range(.8,1.25),sy:o*r,sz:o*n.range(.8,1.25),q:[ve.x,ve.y,ve.z,ve.w],move:a.move||[0,0,0],t0:a.t0??0,tau:a.tau??1,spin:a.spin??0,kind:a.kind??0,hor:a.hor??Math.max(Ve(e,t),-.02),tone:n.range(0,1)};return re.push(v),v}const me=R(-14.5,232,6.2,{squat:.9,sink:.2});for(let e=0,t=0;e<34&&t<900;t++){const o=n.range(-250,250),a=n.range(-430,430),r=n.range(4,9.5);Math.abs(o)<16+r||se(o,a)||ye(o,a,r+9)||Math.hypot(o/P,a/S)>.9||fe(ce,o,a)>.2&&n.chance(.7)||(R(o,a,r),e++)}for(let e=0,t=0;e<110&&t<2e3;t++){const o=n.gauss()*95,a=n.range(-440,420),r=n.range(1.2,3.6);Math.abs(o)<14.5+r||Math.abs(o)>270||se(o,a,0)||ye(o,a,r+5)||(R(o,a,r),e++)}for(let e=0;e<5;e++){let t=0,o=0;for(let a=0;a<40&&(t=n.sign()*n.range(20,120),o=n.range(-380,300),!!se(t,o,20));a++);for(let a=0;a<24;a++){const r=n.range(0,6.283),i=Math.sqrt(n())*30,v=t+Math.cos(r)*i,f=o+Math.sin(r)*i*1.5;Math.abs(v)<15.5||ye(v,f,7)||se(v,f,0)||R(v,f,n.range(1.6,2.6),{squat:1,sink:.4})}}for(let e=0;e<30;e++){const t=n.range(-13,13),o=n.range(-20,320);R(t,o,n.range(1,1.9),{squat:1.1,sink:.4})}for(let e=0;e<26;e++){const t=n.range(d.z0-10,d.z1+10),o=n.range(36,55);ye(o,t,7)||R(o,t,n.range(1.2,3.4))}const pt=re.length;await g.yield();const gt=Math.round(200*Math.max(.6,Ae));for(let e=0,t=0;e<gt&&t<4e3;t++){const o=n.chance(.75)?n.pick(F):n.pick(E.length?E:F),a=n.range(0,6.283),r=n.range(7,o.near?42:70),i=o.x+Math.cos(a)*r,v=o.z+Math.sin(a)*r*1.4,f=n.range(.7,2.6)*(n.chance(.08)?1.8:1);if(Math.abs(i)<15+f||se(i,v,-4)||Math.abs(i)>P*.9||Math.abs(v)>S*.9)continue;const l=n.range(10,95)*(.6+.4*W),c=n.range(4,30);let s=b.x*c+n.range(-6,6),m=b.y*c+n.range(-6,6);Math.abs(i+s)<15+f&&(s=0),R(i,v,f,{kind:1,sink:.3,move:[s,l,m],t0:te(i,v,L(Ve(i,v),0,.03))+n.range(.8,6),tau:n.range(5,13),spin:n.range(.08,.5)*n.sign()}),e++,(e&63)===0&&await g.yield()}const yt=110;for(let e=0;e<yt;e++){const t=n.range(d.z0+4,d.z1-4),o=n.range(4,d.top-2),a=d.x0-n.range(1,6),r=L(Math.floor((t-d.z0)/(d.z1-d.z0)*5),0,4);R(a,t,n.range(.6,2.4),{kind:2,y:o,sink:0,hor:-.05,move:[-n.range(6,30),n.range(-.5,.9)*40-o*.25,n.range(-18,18)],t0:Pe+Qe(r)+n.range(.2,3.5),tau:n.range(3.5,8),spin:n.range(.15,.8)*n.sign()})}function Qe(e){return[1.1,0,.5,1.7,2.4][e]}await g.yield();for(let e=0;e<pt;e++){(e&15)===15&&await g.yield();const t=re[e];if(t.r<1.4)continue;const o=t.y+t.sy*.92,a=Math.max(t.sx,t.sz)*.95,r=Math.min(380,t.sy*2/.045),i=t.x+b.x*r,v=t.z+b.y*r,f=Math.max(0,Math.floor((Math.min(t.x,i)-a*2+P)/ae)),l=Math.min($,Math.ceil((Math.max(t.x,i)+a*2+P)/ae)),c=Math.max(0,Math.floor((Math.min(t.z,v)-a*2+S)/ne)),s=Math.min(D,Math.ceil((Math.max(t.z,v)+a*2+S)/ne));for(let m=c;m<=s;m++)for(let h=f;h<=l;h++){const y=-P+h*ae-t.x,p=-S+m*ne-t.z,x=y*b.x+p*b.y,M=Math.abs(y*b.y-p*b.x);if(x<a*.3||M>a*1.5)continue;const C=1-k(a*.55,a*1.5,M),V=m*w+h,B=(o-J[V])/x*C;B>ue[V]&&(ue[V]=Math.min(B,.8))}}const G=Z[1].clone();{const e=.2126*G.r+.7152*G.g+.0722*G.b;G.multiplyScalar(.043/Math.max(e,1e-4)),G.lerp(new u.Color(.085,.043,.024),.55)}Se==="rust"&&G.lerp(new u.Color(.2,.075,.032),.75),G.offsetHSL(n.range(-.012,.012),0,0);const xt=Z[5].clone().multiplyScalar(.075).lerp(G.clone().multiplyScalar(1.5),.5),K={uS:{value:0},uTime:{value:0},uLineQ:{value:Ne(0)},uRc:{value:Ce},uPen:{value:it},uElevMax:{value:qe},uSunI:{value:5.2},uSpeed:{value:Y},uIce:{value:Se==="rust"?1:0},uAway:{value:b},uSunCol:{value:Z[3].clone()},uFrostCol:{value:Z[2].clone()},uIonCol:{value:Z[6].clone()},uCrust:{value:G},uDust:{value:xt},uGrain:{value:Z[4].clone()},uCliffT:{value:Pe},uRes:{value:new u.Vector2(800,450)},uVigor:{value:W}},U=(e={})=>Object.assign(At(),K,e),q=new u.Group;q.name="perihelion-hero";const Ie=[];for(let e=0;e<ze;e++)Ie.push(new u.Vector4(0,0,1e6,1));{const e=new Float32Array(oe*3),t=new Float32Array(oe),o=new Float32Array(oe*3);for(let l=0;l<ge;l++){l&1&&await g.yield();for(let c=0;c<w;c++){const s=l*w+c,m=-P+c*ae,h=-S+l*ne,y=J[s];e[s*3]=m,e[s*3+1]=y,e[s*3+2]=h,t[s]=ue[s];const p=Math.max(c-3,0),x=Math.min(c+3,$),M=Math.max(l-3,0),C=Math.min(l+3,D),V=(J[l*w+p]+J[l*w+x]+J[M*w+c]+J[C*w+c])*.25-y,B=L(.3+V*.45+Ue[s]*2.5+z.fbm2(m/55,h/55+40,3)*.7+ce[s]*.25,0,1);o[s*3]=ce[s],o[s*3+1]=B,o[s*3+2]=.5+.5*z.fbm2(m/120+9,h/120,3)}}await g.yield();const a=new Uint32Array($*D*6);let r=0;for(let l=0;l<D;l++)for(let c=0;c<$;c++){const s=l*w+c,m=s+1,h=s+w,y=h+1;c+l&1?(a[r++]=s,a[r++]=h,a[r++]=m,a[r++]=m,a[r++]=h,a[r++]=y):(a[r++]=s,a[r++]=h,a[r++]=y,a[r++]=s,a[r++]=y,a[r++]=m)}const i=new u.BufferGeometry;i.setAttribute("position",new u.BufferAttribute(e,3)),i.setAttribute("aHor",new u.BufferAttribute(t,1)),i.setAttribute("aMat",new u.BufferAttribute(o,3)),i.setIndex(new u.BufferAttribute(a,1)),await g.yield(),i.computeVertexNormals(),await g.yield(),i.computeBoundingSphere(),await g.yield();const v=new u.ShaderMaterial({fog:!0,uniforms:U({uJets:{value:Ie}}),defines:{MAXJ:ze},vertexShader:`
        attribute float aHor; attribute vec3 aMat;
        varying vec3 vP, vN, vMat, vEye; varying float vHor;
        ${Q}
        void main(){
          vP = position; vN = normal; vMat = aMat; vHor = aHor;
          vEye = (inverse(modelMatrix) * vec4(cameraPosition, 1.)).xyz - position;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        ${I}
        uniform vec3 uCrust, uDust; uniform vec4 uJets[MAXJ];
        varying vec3 vP, vN, vMat, vEye; varying float vHor;
        ${Je}
        ${X}
        float uKnob;
        // (polish) from the air: bowls with raised rims at two sizes, so the crown carries the same crisp marks as the body under it
        float crat(vec2 p){
          vec2 i = floor(p), f = fract(p);
          float h = h21(i + 7.3);
          vec2 c = 0.5 + (vec2(h21(i + 1.7), h21(i + 9.2)) - 0.5) * 0.36;
          float r = 0.1 + 0.16 * h21(i + 4.4);
          float d = length(f - c) / r, dm = d - 1.;
          return step(0.66, h) * r * (-0.7 * max(1. - d * d, 0.) + 0.3 * exp(-dm * dm / 0.045));
        }
        float reliefC(vec2 q, float w2, float w3){ return 62. * crat(q / 62. + 5.3) * w2 + 21. * crat(q / 21. + 11.7) * w3; }
        float bumpH(vec2 p, float pond){
          float b = fbm3(p * 0.29) * 0.9 + fbm3(p * 1.25 + 11.) * 0.3;
          float kn = vn(p * 0.5 + 3.); kn = kn * kn * kn * 2.4 * smoothstep(0.5, 0.68, fbm3(p * 0.021 + 8.)) * uKnob;
          b += fbm3(p * 4.3 + 2.) * 0.085;
          float rip = sin(dot(p, vec2(0.8, 0.45)) * 1.5 + fbm3(p * 0.07) * 9.) * 0.07 + fbm3(p * 0.6) * 0.08;
          return mix(b + kn, rip, pond);
        }
        void main(){
          vec2 p = vP.xz; float dist = length(vEye);
          float pond = smoothstep(0.35, 0.8, vMat.x);
          float e = 0.22 + dist * 0.004;
          uKnob = 1. - smoothstep(120., 320., dist);
          float b0 = bumpH(p, pond), bx = bumpH(p + vec2(e, 0.), pond), bz = bumpH(p + vec2(0., e), pond);
          float amp = 1.0 / (1. + dist * 0.0022);
          vec3 Ng = normalize(vN);
          float farD = smoothstep(120., 420., dist);
          float cw2 = farD * (1. - smoothstep(900., 1900., dist)) * (1. - pond), cw3 = farD * (1. - smoothstep(260., 520., dist)) * (1. - pond);
          float cmask = smoothstep(0.4, 0.62, fbm3(p * 0.0035 + 13.)); cw2 *= cmask; cw3 *= cmask;
          float ce = clamp(dist * 0.004, 0.6, 6.), cr0 = reliefC(p, cw2, cw3);
          vec3 gcr = vec3(cr0 - reliefC(p + vec2(ce, 0.), cw2, cw3), 0., cr0 - reliefC(p + vec2(0., ce), cw2, cw3)) / ce;
          vec3 N = normalize(Ng + vec3(-(bx - b0), 0., -(bz - b0)) / e * amp + gcr * 1.1);
          float steep = smoothstep(0.07, 0.38, 1. - Ng.y);
          float strata = vn(vec2(vP.y * 0.8 + fbm3(p * 0.03) * 3., 0.5));
          float strata2 = vn(vec2(vP.y * 3.1 + fbm3(p * 0.05) * 2., 7.5));
          float farK = smoothstep(220., 800., dist), rimK = smoothstep(0.72, 0.98, length(p / vec2(${P}., ${S}.)));
          float grainK = (1. - 0.85 * farK) * (1. - rimK);              // strata and pebble shadows are a close-up texture: from the air they read as wood grain
          vec3 alb = uCrust * (0.55 + 0.9 * vMat.z) * mix(1., (0.4 + 0.9 * strata) * (0.55 + 0.6 * smoothstep(0.4, 0.6, strata2)), steep * grainK);
          alb *= 0.7 + 0.6 * fbm3(p * 0.8 + 3.);
          float soot = smoothstep(0.42, 0.62, fbm3(p * 0.035 + 17.));
          alb *= mix(1., mix(0.36, 0.64, farK), soot * (1. - steep));                  // charcoal lag patches on the flats (softer from the air: no camouflage)
          alb = mix(alb, alb.ggg * vec3(1.05, 1., 0.95) * 0.95, steep * 0.35 * grainK);   // greyer scarp faces
          alb = mix(alb, uDust * (0.85 + 0.3 * fbm3(p * 0.11)), pond * 0.85);
          alb = mix(alb, vec3(dot(alb, vec3(0.3, 0.5, 0.2))) * vec3(1.08, 0.96, 0.84), 0.3 * farK) * (1. - 0.18 * farK);   // from the air: burnt toast, not orange
          float ice = uIce * smoothstep(0.6, 0.66, fbm3(p * 0.014 + 5.) + b0 * 0.03);
          alb = mix(alb, vec3(0.15, 0.17, 0.19) * (0.6 + 0.8 * fbm3(p * 0.5 + 1.)), ice * 0.85);
          // fountain shadows: long stripes down-sun of every lit vent
          float te = max(tanElev(p), 0.05), sh = 0.;
          vec2 perp = vec2(uAway.y, -uAway.x);
          for (int i = 0; i < MAXJ; i++) {
            vec4 J = uJets[i]; vec2 r = p - J.xy;
            float al = dot(r, uAway), pe = abs(dot(r, perp));
            float env = smoothstep(0., 2.5, uS - J.z), len = J.w * env / te, w = 3. + al * 0.05 + 3.5 * farK;
            sh += env * smoothstep(2., 9., al) * (1. - smoothstep(w * 0.45, w * 1.2, pe)) * (1. - smoothstep(len * 0.5, len, al)) * 0.66;
          }
          float frostM = clamp(vMat.y * (0.6 + 0.8 * fbm3(p * 0.21 + 2.)) + (0.5 - b0 * 0.4) * 0.3, 0., 1.);
          // every pebble throws a shadow twenty times its height: noise stretched down-sun, longer when the sun is lower
          vec2 sp = vec2(dot(p, perp), dot(p, uAway));
          float stretch = mix(0.05, 0.16, smoothstep(0.03, 0.28, te));
          float peb = smoothstep(0.56, 0.7, fbm3(vec2(sp.x * 0.75, sp.y * stretch) + 3.3)) * 0.6
                    + smoothstep(0.6, 0.72, fbm3(vec2(sp.x * 2.6, sp.y * stretch * 3.) + 8.1)) * 0.45 / (1. + dist * 0.01);
          float shade = (1. - min(sh, 0.78)) * (1. - min(peb, 0.8) * (1. - pond) * (1. - steep) * grainK);
          // (polish) from the air: boulder fields with their shadows thrown down-sun, hairline cracks, and shadow edges broken up
          // by the ground's own grain instead of the soft blobs a 4 m grid gives
          vec2 bq = p / 11., bi = floor(bq), bf = fract(bq) - 0.5 - (vec2(h21(bi + 2.1), h21(bi + 6.6)) - 0.5) * 0.5;
          float brr = 0.08 + 0.1 * h21(bi + 3.3), bon = step(0.6, h21(bi + 9.9)) * smoothstep(0.42, 0.6, fbm3(p * 0.007 + 2.)) * farD * (1. - smoothstep(500., 1000., dist)) * (1. - pond);
          float bould = bon * (1. - smoothstep(brr * 0.7, brr, length(bf)));
          vec2 bs = bf - uAway * brr * 2.4;
          float bshad = bon * (1. - smoothstep(brr * 0.8, brr * 2.8, length(bs - uAway * dot(bs, uAway) * 0.55)));
          float ck = abs(fbm3(p * 0.023 + 5.) - 0.5), ckw = 0.006 + dist * 0.000012;
          float crack = (1. - smoothstep(ckw * 0.4, ckw, ck)) * farD * (1. - smoothstep(900., 2200., dist)) * (1. - pond);
          alb *= (1. + 0.9 * bould) * (1. - 0.5 * crack);
          shade *= (1. - 0.75 * bshad * (1. - bould)) * (1. - 0.5 * crack);
          float horB = vHor + (fbm3(p * 0.11 + 4.) - 0.47) * 0.05 * farD;
          vec3 col = crustShade(alb, N, vP, horB, frostM, 0., dist, shade);
          #ifdef USE_FOG
            col = mix(col, fogColor, fogAmount());
          #endif
          gl_FragColor = vec4(col, 1.);
        }`}),f=new u.Mesh(i,v);f.name="crust",f.frustumCulled=!1,q.add(f)}await g.yield();{const e=new u.IcosahedronGeometry(1,1),t=e.attributes.position,o=ot(n.int(1,1e9));for(let p=0;p<t.count;p++){let x=t.getX(p),M=t.getY(p),C=t.getZ(p);const V=1+.28*o.n3(x*1.1,M*1.1,C*1.1)+.14*o.n3(x*2.7+5,M*2.7,C*2.7);x*=V,M*=V,C*=V;const B=x*.62+M*.5+C*.6;if(B>.72){const T=B-.72;x-=.62*T,M-=.5*T,C-=.6*T}const we=-x*.8+M*.3-C*.52;if(we>.66){const T=we-.66;x+=.8*T,M-=.3*T,C+=.52*T}t.setXYZ(p,x,M,C)}e.computeVertexNormals();const a=new u.InstancedBufferGeometry;a.setAttribute("position",t),a.setAttribute("normal",e.attributes.normal);const r=re.length;a.instanceCount=r;const i=new Float32Array(r*3),v=new Float32Array(r*3),f=new Float32Array(r*3),l=new Float32Array(r*4),c=new Float32Array(r*4),s=new Float32Array(r*2);re.forEach((p,x)=>{i.set([p.x,p.y,p.z],x*3),v.set([p.sx,p.sy,p.sz],x*3),f.set(p.move,x*3),l.set(p.q,x*4),c.set([p.t0,p.tau,p.spin,p.kind],x*4),s.set([p.hor,p.tone],x*2)});const m=(p,x)=>new u.InstancedBufferAttribute(p,x);a.setAttribute("aPos",m(i,3)),a.setAttribute("aScl",m(v,3)),a.setAttribute("aMove",m(f,3)),a.setAttribute("aQuat",m(l,4)),a.setAttribute("aAnim",m(c,4)),a.setAttribute("aTone",m(s,2));const h=new u.ShaderMaterial({fog:!0,uniforms:U(),vertexShader:`
        ${I}
        attribute vec3 aPos, aScl, aMove; attribute vec4 aQuat, aAnim; attribute vec2 aTone;
        varying vec3 vP, vN, vL, vEye; varying vec3 vInfo; varying float vFl;
        ${Q}
        vec3 qrot(vec4 q, vec3 v){ return v + 2. * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
        vec3 axrot(vec3 v, vec3 k, float a){ float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1. - c); }
        void main(){
          float kind = aAnim.w, t = uS - aAnim.x, tt = max(t, 0.);
          float fl = min(kind, 1.);
          float e = fl * (1. - exp(-tt / aAnim.y));
          vec3 lp = position * aScl, n = normalize(mix(normal, normalize(position), 0.5) / aScl);
          lp = qrot(aQuat, lp); n = qrot(aQuat, n);
          vec3 k = normalize(vec3(0.31, 0.2, 0.12) + abs(aMove.zxy) * 0.02 + aQuat.xyz);
          float ang = fl * aAnim.z * tt * smoothstep(0., 3., tt);
          lp = axrot(lp, k, ang); n = axrot(n, k, ang);
          if (kind > 1.5) lp *= smoothstep(0., 0.3, t);
          vec3 mv = aMove * e; mv.y += fl * sin(uTime * 0.35 + aAnim.x * 7.) * 0.7 * e;
          vec3 P = aPos + lp + mv;
          vL = position; vP = P; vN = n;
          vInfo = vec3(aTone.x, aTone.y, (lp.y + mv.y) * 0.0035 + (kind > 1.5 ? 0.2 : 0.)); vFl = fl;
          if (kind > 0.5) vInfo.x = mix(aTone.x, -0.1, smoothstep(0., 0.15, e));
          vEye = (inverse(modelMatrix) * vec4(cameraPosition, 1.)).xyz - P;
          vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        ${I}
        uniform vec3 uCrust;
        varying vec3 vP, vN, vL, vEye; varying vec3 vInfo; varying float vFl;
        ${Je}
        ${X}
        void main(){
          vec3 N = normalize(vN);
          vec2 q = vL.xz * 2.3 + vL.y * 1.9;
          float n1 = fbm3(q * 1.3 + vInfo.y * 30.), n2 = fbm3(q * 4. + 9.);
          N = normalize(N + (vec3(n1, n2, fbm3(q * 2.1 + 4.)) - 0.5) * 0.9);
          float band = vn(vec2(vL.y * 4. + n1 * 2., vInfo.y * 9.));
          vec3 alb = uCrust * (0.35 + 0.5 * vInfo.y) * (0.45 + 0.7 * n1 + 0.5 * band * n2);
          alb = mix(alb, alb.ggg * 1.2, 0.3 * band);
          float frostM = clamp(0.25 + 0.7 * dot(N, vec3(uAway.x, 0.5, uAway.y)), 0., 1.) * (0.5 + 0.8 * n2) * (1. - vFl);
          vec3 col = crustShade(alb, N, vP, vInfo.x, frostM, vInfo.z, length(vEye), 1.);
          #ifdef USE_FOG
            col = mix(col, fogColor, fogAmount());
          #endif
          gl_FragColor = vec4(col, 1.);
        }`}),y=new u.Mesh(a,h);y.name="rocks",y.frustumCulled=!1,q.add(y),e.dispose()}await g.yield();const Xe=[];{await g.yield();const e=[],t=17,o=[0,.17,.41,.58,.82,1].map((v,f)=>f>0&&f<5?v+n.range(-.035,.035):v);for(let v=0;v<5;v++){const f=(o[v+1]-o[v])*(d.z1-d.z0),l=d.z0+(o[v]+o[v+1])*.5*(d.z1-d.z0),c=f*1.03,s=_(d.x0-9,l)-3,m=d.top-s+n.range(-7,4),h=d.x0+n.range(-3,2.5),y=new u.BoxGeometry(t,m,c,3,13,6),p=y.attributes.position,x=n.range(0,100);for(let H=0;H<p.count;H++){let ie=p.getX(H),le=p.getY(H)+m/2,O=p.getZ(H);const Me=le/m,de=L(-ie/(t/2),0,1),tt=O/(c/2);ie-=de*(j(-2.5,6.5,k(.05,.62,Me))-3.5*k(.86,1,Me)),ie-=de*(Math.round(z.n2(le/6.5+x,O/40)*2.2)*.9+z.fbm2(le/9+x,O/9,3)*1.6),ie+=de*(tt*tt*.9+z.fbm2((O+l)/26,le/40+x,3)*3.2),O*=1-.05*de-.04*Me,Me>.97&&(le+=z.fbm2(ie/8+x,O/8,2)*2.5-de*1.5),p.setXYZ(H,ie,le,O)}y.computeVertexNormals();const M=p.count,C=new Float32Array(M*4),V=new Float32Array(M*3),B=n.range(.3,.5),we=n.range(11,20),T=n.range(-.12,.12);for(let H=0;H<M;H++)C.set([h-t*.3,s,l,Qe(v)],H*4),V.set([B,we,T],H*3);y.setAttribute("aSlab",new u.BufferAttribute(C,4)),y.setAttribute("aRnd",new u.BufferAttribute(V,3)),y.translate(t*.3,0,0),e.push(y),Xe.push([h-t*.5,s+3,l]),await g.yield()}const a=Mt(e);e.forEach(v=>v.dispose());const r=new u.ShaderMaterial({fog:!0,uniforms:U(),vertexShader:`
        ${I}
        uniform float uCliffT;
        attribute vec4 aSlab; attribute vec3 aRnd;
        varying vec3 vP, vN, vL, vEye; varying float vK;
        ${Q}
        void main(){
          float t = uS - (uCliffT + aSlab.w);
          float k = pow(smoothstep(0., 6.5, t), 1.4);
          float a = k * aRnd.x, c = cos(a), s = sin(a);
          float ya = k * aRnd.z, cy = cos(ya), sy = sin(ya);
          vec3 lp = position, n = normal;
          lp = vec3(lp.x * c - lp.y * s, lp.x * s + lp.y * c, lp.z); n = vec3(n.x * c - n.y * s, n.x * s + n.y * c, n.z);
          lp = vec3(lp.x * cy + lp.z * sy, lp.y, -lp.x * sy + lp.z * cy); n = vec3(n.x * cy + n.z * sy, n.y, -n.x * sy + n.z * cy);
          vec3 P = aSlab.xyz + lp + vec3(-6. * k, -aRnd.y * k, 0.);
          P.x += sin(t * 9. + aSlab.z) * 0.12 * smoothstep(-0.8, 0., t) * (1. - smoothstep(0., 2.5, t)) * position.y * 0.03;   // the shudder before it goes
          vL = position + aSlab.zzz; vP = P; vN = n; vK = k;
          vEye = (inverse(modelMatrix) * vec4(cameraPosition, 1.)).xyz - P;
          vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        ${I}
        uniform vec3 uCrust;
        varying vec3 vP, vN, vL, vEye; varying float vK;
        ${Je}
        ${X}
        void main(){
          vec3 N = normalize(vN);
          vec2 q = vec2(vL.z * 0.35 + vL.x * 0.3, vL.y * 0.9);
          float n1 = fbm3(q * 0.6), n2 = fbm3(q * 2.4 + 5.);
          float band = vn(vec2(vL.y * 0.55 + n1 * 1.5, 3.5)), fine = vn(vec2(vL.y * 2.6 + n2 * 1.2, 8.5));
          float e = 0.25;
          float bx = fbm3((q + vec2(e, 0.)) * 2.4 + 5.), by = fbm3((q + vec2(0., e)) * 2.4 + 5.);
          float led = vn(vec2(vL.y * 0.55 + 0.12 + n1 * 1.5, 3.5)) - band;                      // slope of the layering: ledges
          N = normalize(N + vec3(0.25 * (bx - n2) / e, led * 7. + (by - n2) / e * 0.3, 0.25 * (bx - n2) / e) * 0.4);
          float lay = smoothstep(0.35, 0.65, band);
          vec3 alb = uCrust * mix(0.38, 1.25, lay) * (0.75 + 0.5 * fine) * (0.7 + 0.6 * n1);
          alb = mix(alb, alb.ggg * 1.1, 0.35 * (1. - lay));
          float frostM = clamp(0.2 + 0.6 * n2 + 0.5 * (1. - band), 0., 1.) * 0.8;
          vec3 col = crustShade(alb, N, vP, -0.03, frostM, vP.y * 0.003, length(vEye), 1.);
          #ifdef USE_FOG
            col = mix(col, fogColor, fogAmount());
          #endif
          gl_FragColor = vec4(col, 1.);
        }`}),i=new u.Mesh(a,r);i.name="cliff",i.frustumCulled=!1,q.add(i)}await g.yield();const A=F.slice().sort((e,t)=>e.z-t.z);for(const e of A)e.ignite=e.cliff?Pe+1.4:te(e.x,e.z,0)+n.range(.4,1.2);A.sort((e,t)=>e.ignite-t.ignite);for(let e=1;e<A.length;e++)!A[e].cliff&&A[e].ignite-A[e-1].ignite<.36&&(A[e].ignite=A[e-1].ignite+.36);for(const e of E)e.ignite=te(e.x,e.z,0)+n.range(.5,3);{const e=new Set;for(const[t,o]of[[215,-1],[150,1],[85,-1],[20,1]]){let a=null,r=1e9;for(const i of A){if(i.cliff||i.side!==o||e.has(i))continue;const v=Math.abs(i.z-t);v<r&&(r=v,a=i)}a&&(e.add(a),a.ignite=-6)}A.sort((t,o)=>t.ignite-o.ignite)}A.forEach((e,t)=>{e.tau=n.range(1.35,1.9),e.seed=n(),t<ze&&Ie[t].set(e.x,e.z,e.ignite,e.H)}),E.forEach(e=>{e.tau=n.range(1.8,3.2),e.seed=n()});const xe=A.concat(E),Ze=`
    vec3 jetAxis(float seed){ float a = seed * 43.; return normalize(vec3(cos(a) * 0.1, 1., sin(a) * 0.1)); }
  `;{const e=Math.round(400*Ae),t=A.length*e,o=new u.InstancedBufferGeometry;o.setAttribute("position",new u.BufferAttribute(new Float32Array([-.5,0,0,.5,0,0,-.5,1,0,.5,1,0]),3)),o.setIndex([0,1,2,2,1,3]),o.instanceCount=t;const a=new Float32Array(t*3),r=new Float32Array(t*4),i=new Float32Array(t*4);let v=0;for(const c of A){for(let s=0;s<e;s++,v++)a.set([c.x,c.y,c.z],v*3),r.set([c.ignite,c.H,c.tau,c.seed],v*4),i.set([n(),n(),n(),n()],v*4);await g.yield()}o.setAttribute("aVent",new u.InstancedBufferAttribute(a,3)),o.setAttribute("aJ",new u.InstancedBufferAttribute(r,4)),o.setAttribute("aR",new u.InstancedBufferAttribute(i,4));const f=new u.ShaderMaterial({fog:!0,uniforms:U(),transparent:!0,depthWrite:!1,blending:u.AdditiveBlending,side:u.DoubleSide,vertexShader:`
        ${I}
        ${Ze}
        uniform vec2 uRes; uniform vec3 uGrain;
        attribute vec3 aVent; attribute vec4 aJ, aR;
        varying vec2 vUv; varying vec3 vCol;
        ${Q}
        vec3 grainPos(float age, vec3 axis, vec3 s1, vec3 s2, float rr){
          float H = aJ.y * (0.45 + 0.55 * aR.z), tau = aJ.z * (0.8 + 0.4 * aR.x);
          float hN = 1. - exp(-age / tau), h = H * hN, ang = aR.w * 6.2832;
          float spread = 0.8 + h * 0.03 + H * 0.3 * hN * hN * hN * hN * hN;
          vec3 P = aVent + axis * h + (s1 * cos(ang) + s2 * sin(ang)) * spread * rr;
          P.xz += uAway * (1.25 * age * age) * (0.5 + 0.9 * aR.x);
          P.y -= 0.22 * age * age;
          return P;
        }
        void main(){
          float tj = uS - aJ.x;
          float T = 7. + 3.5 * aR.x, ph = fract(uTime / T + aR.y), age = ph * T;
          float rr = sqrt(fract(aR.x * 17.31 + aR.w * 5.7));
          vec3 axis = jetAxis(aJ.w), s1 = normalize(cross(axis, vec3(0., 0., 1.))), s2 = cross(axis, s1);
          vec3 P0 = grainPos(age, axis, s1, s2, rr), P1 = grainPos(max(age - 0.055, 0.), axis, s1, s2, rr);
          vec4 c0 = projectionMatrix * modelViewMatrix * vec4(P0, 1.), c1 = projectionMatrix * modelViewMatrix * vec4(P1, 1.);
          vec4 mvPosition = modelViewMatrix * vec4(P0, 1.);
          float alive = smoothstep(0., 0.35, tj - age) * smoothstep(0., 0.8, tj) * smoothstep(0., 0.02, ph) * (1. - smoothstep(0.55, 1., ph));
          vec2 d = (c1.xy / max(c1.w, 0.01) - c0.xy / max(c0.w, 0.01)) * uRes;
          float dl = length(d); d = dl > 0.01 ? d / dl : vec2(0., 1.);
          float pxPerM = uRes.y * 0.5 * projectionMatrix[1][1] / max(c0.w, 0.01);
          float truePx = (0.16 + 0.2 * aR.z) * pxPerM, px = clamp(truePx, 1.7, 9.);
          vec4 c = mix(c0, c1, position.y);
          vec2 off = (vec2(-d.y, d.x) * position.x * px + d * (position.y - 0.5) * px) / uRes * 2.;
          c.xy += off * c.w;
          if (c0.w < 0.2 || c1.w < 0.2 || alive < 0.003) c = vec4(2., 2., 2., 1.);
          gl_Position = c;
          vec3 cam = (inverse(modelMatrix) * vec4(cameraPosition, 1.)).xyz;
          vec3 V = normalize(P0 - cam), L = sunL(tanElev(P0.xz) + 0.05);
          float fs = pow(max(dot(V, L), 0.), 5.);
          float core = mix(0.3, 1., rr) * (0.15 + 0.85 * smoothstep(0., 0.14, 1. - exp(-age / (aJ.z * (0.8 + 0.4 * aR.x)))));   // (polish) grains pile up in the throat: seen from above that sum is a white-hot pixel the glow turns into a square
          float I = (2.5 + 4. * fs + 2.6 * smoothstep(0.15, 0.6, -V.y)) * core * (0.5 + 0.9 * aR.y) * alive * clamp(truePx / 1.7, 0.14, 1.) * min(1., 9. / max(truePx, 9.));
          vCol = mix(uGrain, uSunCol, 0.3) * I;
          vUv = position.xy + vec2(0.5, 0.);
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec2 vUv; varying vec3 vCol;
        ${X}
        void main(){
          float x = vUv.x * 2. - 1., y = vUv.y * 2. - 1.;
          float a = max(1. - x * x, 0.) * max(1. - y * y, 0.) * 1.2;         // (polish) round at both ends: a grain seen end-on is a soft dot, never a square
          gl_FragColor = vec4(vCol * (1. - fogAmount()), a);
        }`}),l=new u.Mesh(o,f);l.name="grains",l.frustumCulled=!1,l.renderOrder=3,q.add(l)}await g.yield();{const t=[],o=[];for(let s=0;s<2;s++)for(let m=0;m<=8;m++)for(let h=0;h<2;h++)t.push(h*2-1,m/8,s);for(let s=0;s<2;s++)for(let m=0;m<8;m++){const h=s*9*2+m*2;o.push(h,h+1,h+2,h+2,h+1,h+3)}const a=new u.InstancedBufferGeometry;a.setAttribute("position",new u.BufferAttribute(new Float32Array(t),3)),a.setIndex(o);const r=xe.length;a.instanceCount=r;const i=new Float32Array(r*3),v=new Float32Array(r*4),f=new Float32Array(r);xe.forEach((s,m)=>{i.set([s.x,s.y-1.5,s.z],m*3),v.set([s.ignite,s.H,s.tau,s.seed],m*4),f[m]=s.near?1:0}),a.setAttribute("aVent",new u.InstancedBufferAttribute(i,3)),a.setAttribute("aJ",new u.InstancedBufferAttribute(v,4)),a.setAttribute("aK",new u.InstancedBufferAttribute(f,1));const l=new u.ShaderMaterial({fog:!0,uniforms:U(),transparent:!0,depthWrite:!1,blending:u.AdditiveBlending,side:u.DoubleSide,vertexShader:`
        ${I}
        ${Ze}
        attribute vec3 aVent; attribute vec4 aJ; attribute float aK;
        varying vec3 vC; varying vec4 vJ; varying float vFace, vScat, vDown, vNear;
        ${Q}
        void main(){
          float yN = position.y, side = position.x, H = aJ.y, tau = aJ.z;
          float ca = position.z * 1.5708 + aJ.w * 6.2832;
          vec3 sd = vec3(cos(ca), 0., sin(ca)), axis = jetAxis(aJ.w);
          float wid = (aK > 0.5 ? 1.5 : 3.) + H * 0.035 * yN + H * (aK > 0.5 ? 0.27 : 0.15) * yN * yN * yN * yN;
          vec3 P = aVent + axis * (H * 0.95 * yN) + sd * side * wid;
          float age = -tau * log(1. - yN * 0.93);
          P.xz += uAway * (1.25 * age * age);
          vec3 cam = (inverse(modelMatrix) * vec4(cameraPosition, 1.)).xyz;
          vec3 V = P - cam; float vl = max(length(V.xz), 0.001);
          vFace = abs(dot(vec2(-sd.z, sd.x), V.xz / vl));
          vec3 L = sunL(tanElev(P.xz) + 0.05);
          vScat = pow(max(dot(normalize(V), L), 0.), 4.);
          vDown = smoothstep(0.15, 0.6, -normalize(V).y);
          vNear = smoothstep(16., 75., length(V));                                // (polish) a card at the lens is a pane of glass: let it go, the grains carry the fountain there
          vC = vec3(side, yN, aK); vJ = aJ;
          vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        ${I}
        uniform vec3 uGrain;
        varying vec3 vC; varying vec4 vJ; varying float vFace, vScat, vDown, vNear;
        ${X}
        void main(){
          float side = vC.x, yN = vC.y, tj = uS - vJ.x, H = vJ.y;
          float front = (1. - exp(-max(tj, 0.) / vJ.z)) / 0.93;
          float head = 1. - smoothstep(front - 0.26, front, yN);                        // a feathered crown, never a flat-topped bar
          float s2 = side * side;
          float prof = (1. - s2) * (1. - s2);
          float limb = prof * mix(0.22 + 2.6 * s2, 1., smoothstep(0.35, 0.9, yN));     // dark core low down, filled where it fans
          float st = vn(vec2(side * 6. + vJ.w * 31., yN * H * 0.0045 - uTime * 0.16));
          float st2 = vn(vec2(side * 17. + vJ.w * 11., yN * H * 0.013 - uTime * 0.5));
          vec2 gc = vec2(side * (10. + H * 0.05 * yN), yN * H * 0.55 - uTime * 26. * (1. - 0.6 * yN));
          float spk = step(0.86, h21(floor(gc) + vJ.w * 17.)) * (1. - smoothstep(0.1, 0.5, length(fract(gc) - 0.5)));
          float body = limb * (0.16 + 0.5 * st * st + 0.4 * st2 * st2 * st2) + prof * spk * 1.5 * mix(0.5, 1., vC.z);
          float fadeY = (1. - smoothstep(0.5, 1., yN)) * (0.35 + 0.65 * exp(-yN * 3.5)) * smoothstep(0., 0.012, yN);
          float I = body * fadeY * head * smoothstep(0., 0.8, tj) * mix(smoothstep(0.08, 0.55, vFace), 1., 0.6 * vDown);
          I *= (0.5 + 1.7 * vScat + 1.6 * vDown) * mix(0.75, 1.1, vC.z) * vNear * mix(1., 0.25 + 0.75 * smoothstep(0.02, 0.22, yN), vDown);
          I = min(I * 1.5, 7.);            // (polish) bounded: single sparkle pixels used to reach the hundreds, and the glow pass turned each into a white square
          // dim warm white on black reads as olive: the faint outskirts stay cool, the body white-gold
          vec3 col = mix(vec3(0.8, 0.88, 1.0), mix(uGrain, uSunCol, 0.35), smoothstep(0.02, 0.4, I)) * I * (1. - fogAmount());
          gl_FragColor = vec4(col, 1.);
        }`}),c=new u.Mesh(a,l);c.name="jet-cards",c.frustumCulled=!1,c.renderOrder=2,q.add(c)}await g.yield();{const e=new u.InstancedBufferGeometry;e.setAttribute("position",new u.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,-1,1,0,1,1,0]),3)),e.setIndex([0,1,2,2,1,3]);const t=xe.length;e.instanceCount=t;const o=new Float32Array(t*3),a=new Float32Array(t*4);xe.forEach((v,f)=>{o.set([v.x,v.y,v.z],f*3),a.set([v.ignite,v.H,v.tau,v.seed],f*4)}),e.setAttribute("aVent",new u.InstancedBufferAttribute(o,3)),e.setAttribute("aJ",new u.InstancedBufferAttribute(a,4));const r=new u.ShaderMaterial({fog:!0,uniforms:U(),transparent:!0,depthWrite:!1,blending:u.AdditiveBlending,side:u.DoubleSide,vertexShader:`
        ${I}
        uniform float uVigor;
        attribute vec3 aVent; attribute vec4 aJ;
        varying vec2 vUv; varying float vI;
        ${Q}
        void main(){
          float tj = uS - aJ.x, H = aJ.y;
          float grow = 1. - exp(-max(tj, 0.) / max(aJ.z, 0.1));
          vec3 C = aVent + vec3(0., H * 0.36 * grow, 0.);
          C.xz += uAway * H * 0.1 * grow;
          vec4 mvPosition = modelViewMatrix * vec4(C, 1.);
          float dist = length(mvPosition.xyz);
          mvPosition.xy += position.xy * vec2(H * 0.42, H * 0.6) * (0.25 + 0.75 * grow);
          gl_Position = projectionMatrix * mvPosition;
          vec3 cam = (inverse(modelMatrix) * vec4(cameraPosition, 1.)).xyz;
          vec3 V = normalize(C - cam + vec3(0., 1e-4, 0.));
          float fs = max(dot(V, sunL(tanElev(C.xz) + 0.05)), 0.); fs *= fs; fs *= fs;
          float pulse = 0.85 + 0.15 * sin(uTime * (0.7 + aJ.w) + aJ.w * 40.);
          vI = smoothstep(0., 1.2, tj) * grow * (0.55 + 1.1 * fs) * smoothstep(50., 240., dist) * pulse;
          vUv = position.xy;
          #include <fog_vertex>
        }`,fragmentShader:`
        ${I}
        uniform vec3 uGrain;
        varying vec2 vUv; varying float vI;
        ${X}
        void main(){
          float r2 = dot(vUv, vUv);
          float a = exp(-r2 * 3.2) * max(1. - r2, 0.);
          float low = exp(-(vUv.y + 0.55) * (vUv.y + 0.55) * 6. - vUv.x * vUv.x * 9.);          // hotter round the throat
          vec3 col = mix(vec3(0.82, 0.9, 1.0), mix(uGrain, uSunCol, 0.35), 0.6) * (0.03 * a + 0.04 * low * max(1. - r2, 0.)) * vI * (1. - fogAmount());
          gl_FragColor = vec4(col, 1.);
        }`}),i=new u.Mesh(e,r);i.name="jet-halos",i.frustumCulled=!1,i.renderOrder=1,q.add(i)}await g.yield();{const e=[],t=Math.round(520*Ae);for(let l=0,c=0;l<t&&c<6e3;c++){const s=n.gauss()*110,m=n.range(-440,430);if(Math.abs(s)>270||se(s,m,-6))continue;const h=Ve(s,m),y=fe(ce,s,m);h>.2||h<.015&&y<.3&&n.chance(.75)||(e.push({x:s,y:_(s,m)+.5,z:m,t0:te(s,m,Math.max(h,0))+n.range(.1,1.3),size:n.range(4,11),kind:0}),l++,(l&127)===0&&await g.yield())}await g.yield();for(const l of pe)for(let c=0;c<4;c++){const s=n.range(0,6.283),m=n.range(0,l.r*.35),h=l.x+Math.cos(s)*m,y=l.z+Math.sin(s)*m;e.push({x:h,y:l.level+.6,z:y,t0:te(l.x,l.z)+.8+c*1.7+n.range(0,.8),size:l.r*n.range(.75,1.05),kind:1})}const o=e.length,a=new u.InstancedBufferGeometry;a.setAttribute("position",new u.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,-1,1,0,1,1,0]),3)),a.setIndex([0,1,2,2,1,3]),a.instanceCount=o;const r=new Float32Array(o*3),i=new Float32Array(o*4);e.forEach((l,c)=>{r.set([l.x,l.y,l.z],c*3),i.set([l.t0,l.size,l.kind,n()],c*4)}),a.setAttribute("aP",new u.InstancedBufferAttribute(r,3)),a.setAttribute("aV",new u.InstancedBufferAttribute(i,4));const v=new u.ShaderMaterial({fog:!0,uniforms:U(),transparent:!0,depthWrite:!1,side:u.DoubleSide,blending:u.AdditiveBlending,vertexShader:`
        ${I}
        attribute vec3 aP; attribute vec4 aV;
        varying vec2 vUv; varying vec4 vI;
        ${Q}
        void main(){
          float t = uS - aV.x, kind = aV.z, life = kind > 0.5 ? 16. : 3.4;
          float k = clamp(t / life, 0., 1.);
          vec3 C = aP; vec4 mvPosition; float a;
          if (kind > 0.5) {
            C.y += 1. + 46. * pow(k, 0.8); C.xz += uAway * 30. * k * k;
            float rot = aV.w * 6.28 + k * 0.6, cr = cos(rot), sr = sin(rot);
            vec2 q = vec2(position.x * cr - position.y * sr, position.x * sr + position.y * cr) * aV.y * (1. + 0.5 * k);
            C += vec3(q.x, sin(q.x * 0.11 + uTime * 0.4 + aV.w * 9.) * 2.5 * k + (position.x * position.y) * 6. * k, q.y);
            mvPosition = modelViewMatrix * vec4(C, 1.);
            a = smoothstep(0., 0.08, k) * (1. - k) * 0.5;
          } else {
            C.y += 1.5 + 17. * pow(k, 0.7); C.xz += uAway * 7. * k + vec2(sin(aV.w * 40.), cos(aV.w * 33.)) * 3. * k;
            mvPosition = modelViewMatrix * vec4(C, 1.);
            mvPosition.xy += position.xy * aV.y * (0.35 + 1.1 * k) * vec2(0.8, 1.7);
            a = smoothstep(0., 0.12, k) * pow(1. - k, 1.4) * 0.5;
          }
          if (t < 0. || t > life) mvPosition = vec4(0., 0., 1e6, 1.);
          gl_Position = projectionMatrix * mvPosition;
          vec3 cam = (inverse(modelMatrix) * vec4(cameraPosition, 1.)).xyz;
          float fs = pow(max(dot(normalize(C - cam), sunL(tanElev(C.xz) + 0.05)), 0.), 3.);
          vUv = position.xy; vI = vec4(a, kind, aV.w, 0.5 + 1.6 * fs);
          #include <fog_vertex>
        }`,fragmentShader:`
        ${I}
        uniform vec3 uDust;
        varying vec2 vUv; varying vec4 vI;
        ${X}
        void main(){
          float r = length(vUv);
          vec2 q = vUv * (vI.y > 0.5 ? vec2(2.6) : vec2(2.4, 0.8)) + vI.z * 23. + vec2(0., -uTime * (vI.y > 0.5 ? 0.02 : 0.1));
          float n = fbm3(q) + 0.5 * fbm3(q * 2.7 + 4.);
          float a = vI.x * (1. - smoothstep(0.3, 1., r)) * smoothstep(0.62, 1.1, n + (vI.y > 0.5 ? 0.1 : 0.12));
          vec3 tint = vI.y > 0.5 ? uDust * 6. : mix(uFrostCol, vec3(1.), 0.6) * 0.8;
          vec3 col = tint * uSunCol * 0.5 * vI.w * a * (1. - fogAmount());
          gl_FragColor = vec4(col, 1.);
        }`}),f=new u.Mesh(a,v);f.name="veils",f.frustumCulled=!1,f.renderOrder=1,q.add(f)}await g.yield();const Ye=e=>{const t=[];for(let o=320;o>=-340;o-=30){const a=Fe(e,o);t.push([a,_(a,o),o])}return t},Ee=[d.x0,d.top*.5,(d.z0+d.z1)/2],bt=_(15,175),He=5*Math.PI/180,wt={entry:{position:[0,14,325],heading:[0,0,-1]},flyThrough:[[0,14,325],[0,14,150],[0,14,-25],[0,21,-110],[0,37,-200],[0,52,-280],[0,60,-325]],exitHeading:[b.x*Math.cos(He),Math.sin(He),b.y*Math.cos(He)],sunAzimuth:[-b.x,0,-b.y],awayFromSun:[b.x,0,b.y],landerSeat:{position:[15,bt,175],normal:[0,1,0]},nearBoulder:{position:[me.x,me.y+me.sy,me.z],radius:me.r},cliff:{center:Ee,top:[d.x0+6,d.top,Ee[2]],foot:Xe,poi:[d.x0-6,d.top*.45,Ee[2]]},fractures:{left:Ye(-1),right:Ye(1)},vents:A.map(e=>({position:[e.x,e.y,e.z],ignite:e.ignite,height:e.H})),farVents:E.map(e=>({position:[e.x,e.y,e.z],ignite:e.ignite,height:e.H})),viewpoints:{entry:[0,14,325],avenue:[0,22,-100],cliff:[4,44,-215],above:[-270,420,-90]}};let Le=!1,We=0;const be=e=>{We=e,K.uS.value=e,K.uLineQ.value=Ne(e)};be(0);const et=new u.Vector2;return{object:q,radius:200,height:230,center:new u.Vector3(0,45,-60),anchors:wt,ground:!1,groundY:0,uniforms:K,heightAt:_,terminatorQ:Ne,lineTime:te,info:{vigor:W,crust:Se,vents:A.length,farVents:E.length,rocks:re.length},setProgress(e){Le=!0,be(L(e,0,1)*at)},setScriptTime(e){Le=!0,be(e)},get scriptTime(){return We},sunDirAt(e,t=new u.Vector3){const o=L((K.uLineQ.value-ke(e.x,e.z))/Ce,-.4,qe);return t.set(-b.x,o,-b.y).normalize()},update(e,t,o){K.uTime.value=t,Le||be(t%40),g.renderer&&(g.renderer.getDrawingBufferSize(et),K.uRes.value.copy(et))},dispose(){}}}export{kt as buildHero};
