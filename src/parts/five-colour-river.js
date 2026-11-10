import*as h from"three";import{clamp as j,lerp as ye,smoothstep as $}from"../kit/core.js";const Xt=["#C4122F","#F04E7C","#EBC65A","#4C8C3B","#17161A","#1668B0","#8FCBEF"],fe=90,he=-90,ke=15,ce=7,Ye=1.7,Y=-195,Ae=-232,_e=116,Me=-32,Je=32,we=160,We=768,At=.22,ae=t=>(t=j(t,0,1),t*t*(3-2*t)),mt=t=>(t=1-t*t,t>0?t*t:0),ut=.6,Ce=.44,vt=.5,rt=(t,v)=>{const b=t+.45*Math.sin(v*.6+1.7*Math.sin(t*.35))+.2*Math.sin(v*1.7+t);return .5+.3*Math.sin(b*.95+v*.06+1.3*Math.sin(v*.21+b*.3))+.2*Math.sin(b*2.3-v*.09+2)-.26*Math.max(Math.sin(v*.42+2.1*Math.sin(t*.8)+t*.3)-.3,0)},Qt=(t,v)=>5.3+.8*Math.sin(t*.7+v*.13)+.35*Math.sin(t*1.9+1.7),Jt=t=>.88-(.88-Ce)*t*t*Math.sqrt(t),Tt=(t,v,b)=>{const p=Math.floor((-90-b)/15),z=-90-15*p-b,y=Qt(t,v);return z<.9?0:z<y+.3?rt(t,v+z)>vt?1:3:rt(t,v)>Jt(j((z-y)/(15-y),0,1))-.04?2:3},Et=`
float fcrLane(vec2 p){ float x = p.x + .45*sin(p.y*.6 + 1.7*sin(p.x*.35)) + .2*sin(p.y*1.7 + p.x);
  return .5 + .3*sin(x*.95 + p.y*.06 + 1.3*sin(p.y*.21 + x*.3)) + .2*sin(x*2.3 - p.y*.09 + 2.) - .26*max(sin(p.y*.42 + 2.1*sin(p.x*.8) + p.x*.3) - .3, 0.); }
float fcrBasinEnd(vec2 p){ return 5.3 + .8*sin(p.x*.7 + p.y*.13) + .35*sin(p.x*1.9 + 1.7); }
float fcrLaneThr(float sT){ return .88 - ${(.88-Ce).toFixed(2)}*sT*sT*sqrt(sT); }
float fcrEdge(vec2 p){ return vn(p*vec2(7., 2.2) + 3.) + vn(p*vec2(2.3, .9) + 17.) - 1.; }     // -1..1: tears every edge of a tread
float fcrSpout(vec2 p, float b){ return smoothstep(-.06, .1, fcrLane(vec2(p.x, p.y + b)) - ${vt.toFixed(2)}); }   // 1 where a spout pours over the lip b metres upstream
float fcrCord(vec2 p, float b){ return smoothstep(-.07, .09, fcrLane(vec2(p.x, p.y + b)) - ${Ce.toFixed(2)}); }    // 1 where the lip b metres upstream runs white
`,wt=.35+ut+6.5/3,Ft=.35+1+11/2,Rt=`
float fcrFallsOwn(float b, float spt, float bEnd, float eN, float big){
  float E = mix(mix(${wt.toFixed(3)}, max(bEnd - .5*eN + .42, ${wt.toFixed(3)}), smoothstep(0., .12, spt)), ${Ft.toFixed(3)}, big);
  return smoothstep(-.2, 0., b)*(1. - smoothstep(E, E + .24, b)); }
uniform sampler2D uLip;
float fcrLip(float x, float k){ return smoothstep(0., .03, texture2D(uLip, vec2((x - uMaskRect.x)*uMaskRect.z, (k + .5)/${ce+1}.)).r); }
float fcrLipW(float x, float k){ return smoothstep(.02, .16, texture2D(uLip, vec2((x - uMaskRect.x)*uMaskRect.z, (k + .5)/${ce+1}.)).r); }   // (round 27) the white thins out toward the ends of a lip's water: a hand and a half of depth
`,Ct=`
vec2 fcrGr(vec2 i){ float a = 6.2832*h21(i); return vec2(cos(a), sin(a)); }
float gn(vec2 p){ vec2 i = floor(p), f = p - i, u = f*f*f*(f*(f*6. - 15.) + 10.);
  return .5 + .7*mix(mix(dot(fcrGr(i), f), dot(fcrGr(i + vec2(1., 0.)), f - vec2(1., 0.)), u.x),
    mix(dot(fcrGr(i + vec2(0., 1.)), f - vec2(0., 1.)), dot(fcrGr(i + vec2(1., 1.)), f - vec2(1., 1.)), u.x), u.y); }
float fcrCream(vec2 q, vec2 fq){
  float k2 = 1. - smoothstep(.2, .6, max(fq.x*4.2, fq.y*.55)), k3 = 1. - smoothstep(.2, .6, max(fq.x*11., fq.y*1.4));
  return .5 + (gn(mat2(.878, .479, -.479, .878)*(q*vec2(1.5, .2))) - .5)*.5 + (gn(mat2(.454, .891, -.891, .454)*(q*vec2(4.2, .55)) + 7.) - .5)*.32*k2
    + (gn(mat2(-.416, .909, -.909, -.416)*(q*vec2(11., 1.4)) + 3.) - .5)*.18*k3; }
// the grain of a foam: inside the white, streaks a hand wide and a stride long, finer ones of two fingers on them, and a froth of
// bubbles a thumb across, each let go by the pixel's footprint as the field's counts are; where the streaks stand out comes and goes
float fcrGrain(vec2 q, vec2 fq){
  float k1 = 1. - smoothstep(.2, .6, max(fq.x*7., fq.y*.9)), k2 = 1. - smoothstep(.2, .6, max(fq.x*17., fq.y*2.6)), k3 = 1. - smoothstep(.2, .6, max(fq.x*31., fq.y*11.));
  float a = gn(mat2(.454, .891, -.891, .454)*(q*vec2(7., .9)) + 5.), b = gn(mat2(.878, .479, -.479, .878)*(q*vec2(17., 2.6)) + 1.), c = gn(q*vec2(31., 11.) + 8.);
  return .5 + ((a - .5)*.5*k1*(.4 + 1.2*gn(q*vec2(.9, .3) + 13.)) + (b - .5)*.3*k2 + (c - .5)*.34*k3); }
float fcrCreamD(float P, float S){ return (P - .5)*2.2 + S*2. - 1.; }                          // under 0 water, over 0 foam; soft either way
float fcrCreamW(float P, float S){ return smoothstep(-.5, .5, fcrCreamD(P, S))*smoothstep(0., .1, S); }
`;function eo(t,v){const b=t.rng.fork("fcr-layout"),p=t.noise,z=v.season||"september",y=v.weather||"clouds",n=(y==="cloudburst"?.2:0)+(z==="july"?.1:0)-(z==="november"?.1:0),u=b.range(0,500),q=b.range(0,500),k=[{z:fe,a:b.range(1.2,2.2),k:b.range(0,99)}];for(let i=0;i<ce;i++)k.push({z:he-ke*i,a:i===0?b.range(2.4,3.4):b.range(1.4,2.8),k:b.range(0,99)});k.push({z:Y,a:b.range(1.2,2),k:b.range(0,99)}),k.forEach((i,g)=>{i.s=g>0&&g<=ce?.75:0,i.f=.85+.004*i.k});const E=(i,g)=>{let M=0;for(let C=0;C<k.length;C++){const Q=k[C],O=(g-Q.z)/7.5;O>-1&&O<1&&(M+=mt(O)*(Q.a*(p.n2(i*.06+Q.k,Q.k*1.7)+.35*p.n2(i*.21+Q.k,3.3))+Q.s*Math.sin(i*Q.f+Q.k)*(.45+.55*Math.sin(i*Q.f*.31+Q.k*1.7))))}return M},T=(i,g)=>g-E(i,g),P=(i,g)=>{let M=g;for(let C=0;C<5;C++)M=g+E(i,M);return M},c=i=>{let g=6*ae((i-fe)/1);for(let M=0;M<ce;M++)g-=Ye*ae((he-ke*M-i)/ut);return g-=6*ae((Y-i)/1),g},f=i=>6*ae((i-fe)/1)-Ye*ce*j((he+4-i)/(ke*ce-8),0,1)-6*ae((Y-i)/1),e=i=>{let g=mt((i-fe-.5)/1.1);for(let M=0;M<ce;M++)g=Math.max(g,mt((i-(he-ke*M)+.3)/.9));return Math.max(g,mt((i-Y+.5)/1.3))},l=i=>{let g=0;const M=(C,Q)=>{const O=(C-i)/Q;O>0&&O<1&&(g=Math.max(g,(1-O)*(1-O)*ae(O*8)))};M(fe-.6,9);for(let C=0;C<ce;C++)M(he-ke*C-.9,6.5);return M(Y-1.2,11),g},s=i=>{let g=3;const M=(C,Q)=>{const O=(C-i)/Q;O>-.02&&O<g&&(g=Math.max(O,0))};M(fe-.3,9);for(let C=0;C<ce;C++)M(he-ke*C-.9,6.5);return M(Y-1.2,11),g},o=i=>c(i+.35)+At+n,m=i=>i>-80?22.5:i>Y?ye(22.5,11.5,ae((-80-i)/110)):ye(11.5,19,ae((Y-i)/16)),x=i=>-(m(i)+2.2*p.n2(i*.045+u,3.1)+.8*p.n2(i*.17,5.5+u)),W=i=>m(i)+2.2*p.n2(i*.045+q,9.7)+.8*p.n2(i*.17,1.5+q),a=b.range(5.5,8),d=Math.PI*2/b.range(95,130),A=b.range(0,6.28),w=b.range(1.8,3),F=Math.PI*2/b.range(40,55),H=b.range(0,6.28),V=b.range(-1,3),R=i=>{const g=V+a*Math.sin(i*d+A)+w*Math.sin(i*F+H),M=ae((i-70)/20),C=ae((-52-i)/34);return ye(ye(g,2,M),6.5-1.5*ae((-100-i)/90),C)},G=i=>1.75+.3*p.n2(i*.08,17.3+u),U=i=>ye(R(i)-5.3,0,ae((-60-i)/28)),K=(i,g,M=R(g))=>{if(g>84||g<-86)return 0;const C=p.fbm2(i*.045+u,g*.032+q,3);return C<.42?0:$(.42,.62,C)*$(0,5,Math.abs(i-M)-4)},D=[],N=b.range(v.periZ?v.periZ[0]:-56,v.periZ?v.periZ[1]:-49);D.push({x:R(N)-10.2,z:N,r:2.7,depth:3.2,sandy:0,peri:!0});const B=[[84,0],[63,11],[40,-8.8],[18,-1.2],[4,0]],ue=i=>{if(i>=B[0][0]||i<=B[4][0])return 0;for(let g=1;g<5;g++)if(i>=B[g][0]){const M=B[g-1],C=B[g];return ye(M[1],C[1],ae((M[0]-i)/(M[0]-C[0])))}return 0},de=i=>U(i)+ue(i),se=t.core.makeRng("fcr-zones:"+t.seed),ee=()=>se.range(-.7,.7),Qe={x:((i,g)=>j(i,-(22.5-g),22.5-g))(U(38)-8.6,7.5),z:38,r:4.1,depth:1.7,sandy:.7,peri:!1,show:!0};D.push(Qe);const Be=[{t:2,x:U(11)+1.5,z:11+ee(),rx:9.5,rz:3.4},{t:2,x:U(-25)-1,z:-25+ee(),rx:8,rz:3.6}];Be.forEach((i,g)=>{i.k=(g?5:2)*7.3+se.range(0,5)});const Se=[0,0,0,0],X=(i,g)=>{Se[1]=0,Se[2]=0,Se[3]=0;for(let M=0;M<Be.length;M++){const C=Be[M],Q=(i-C.x)/C.rx,O=(g-C.z)/C.rz,J=Q*Q+O*O;if(J>1.7)continue;const me=1-$(.62,.95,J+.3*p.n2(i*.5+C.k,g*.5)+.12*p.n2(i*1.7,g*1.7+C.k));me>Se[C.t]&&(Se[C.t]=me)}return Se},Ke=j(Math.round(v.potholes??40),8,48)-(D.length-1),Re=[];for(let i=0;i<Ke-1;i++)Re.push(1+3*Math.pow(b(),1.9));Re.sort((i,g)=>g-i);for(const i of Re)for(let g=0;g<60;g++){const M=b.range(-83+i,83-i),C=m(M)-i-2.6,Q=b.range(-C,C);let O=!0;for(let me=-1;me<=1&&O;me++)Math.abs(Q-R(M+me*i))<i+3.1&&(O=!1);for(let me=0;me<D.length&&O;me++){const xe=D[me];Math.hypot(Q-xe.x,M-xe.z)<i+xe.r+1.5&&(O=!1)}if(O&&K(Q,M)>.02&&(O=!1),!O)continue;const J=b.chance(.42)?1:0;D.push({x:Q,z:M,r:i,depth:J?b.range(1.7,2.4):b.range(2.6,5),sandy:J,peri:!1});break}const I=(i,g,M)=>$(-.16,.3,p.fbm2(i*.16+q+40,g*.085+u,2)+.25*p.n2(i*.5+7,g*.3))*ae((Y-5.5-M)/6),oe=(i,g)=>{let M=9;for(let C=0;C<D.length;C++){const Q=D[C],O=Math.hypot(i-Q.x,g-Q.z)-Q.r;O<M&&(M=O)}return M},_={h:0,wl:0,dEdge:0,zn:0,chan:0,isl:0};let re=NaN,be=0,te=0,ge=0,ve=0;const Ne=(i,g)=>{g!==re&&(re=g,be=x(g),te=W(g),ge=R(g),ve=G(g));const M=T(i,g),C=c(M),Q=be,O=te,J=Math.min(i-Q,O-i);if(_.zn=M,_.wl=o(M),_.dEdge=J,_.chan=0,_.isl=0,J>-1.5){const me=M<fe&&M>he;let xe=C+.07*p.fbm2(i*.09+q,g*.09,2)+.025*p.n2(i*.45,g*.45);const Oe=K(i,g,ge);_.isl=Oe,xe+=Oe*(.3+n*.5+.12*p.n2(i*.3,g*.3+40));const tt=Math.abs(i-ge),yt=ve,Ze=1-ae((tt-yt+.5)/1),lt=M>fe?.25:me?1.25*ae((fe-1-M)/6)+.1:M>Y?.5:0;if(_.chan=Ze,xe-=Ze*lt,xe-=l(M)*(M<Y?1.5:M>he?.5:.16),M<Y-1&&(xe-=(.56-.38*I(i,g,M))*ae((Y-1-M)/6)),xe+=.34*ae((1.6-J)/1.6),J>0)return _.h=xe,_;const $e=Ie(i,g,M,C,-J);return _.h=ye(xe,$e,ae(-J/1.5)),_}return _.h=Ie(i,g,M,C,-J),_},Ie=(i,g,M,C,Q)=>{const O=ye(C,f(M),ae((Q-1.5)/9));let J=.42+n+.45*ae(Q/2.2)+.75*ae((Q-3)/16);const xe=(p.fbm2(i*.035+u,g*.035+q,3)*.5+.5)*3.2,Oe=Math.floor(xe),tt=xe-Oe;return J+=(Oe+ae((tt-.8)/.2))*.26*ae(Q/4)-.3*ae(Q/4),O+J+.03*p.n2(i*.5,g*.5)};return{noise:p,flowYaw:(i,g)=>{const M=Math.exp(-Math.pow((i-R(g))/7,2));return Math.atan((R(g-1.5)-R(g+1.5))/3)*M+.22*p.n2(i*.045+u,g*.045)},rng:b,season:z,weather:y,flood:n,wz:E,znOf:T,zOf:P,core:c,ramp:f,fallAmt:e,footAmt:l,waterY:o,halfW:m,edgeL:x,edgeR:W,chanX:R,chanHalf:G,islandAt:K,wells:D,wellSdf:oe,bed:Ne,heightAt:(i,g)=>Ne(i,g).h,zPeri:N,footT:s,flyX:U,swingX:ue,camX:de,zones:Be,zonesAt:X,showWell:Qe,poolShoal:I}}const Ve=`
float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
float fb(vec2 p){ return vn(p)*.55 + vn(p*2.13+3.7)*.3 + vn(p*4.3+9.1)*.15; }
`,Xe=`
uniform float uCloudT, uCloudAmt, uCloudCov;
// 1 in sun .. ~0.38 under a cloud; w = WORLD xz. Shadows ~150 m wide drift toward +X at 25 m/s.
float fcrCloud(vec2 w){ vec2 p=(w - vec2(25.,7.)*uCloudT)/300.; float n=vn(p*1.3)*.62+vn(p*2.9+7.3)*.38;
  return 1. - uCloudAmt*.62*smoothstep(.5 - uCloudCov,.68 - uCloudCov,n); }
`,et=`
uniform float uTime;
// surface-ripple slope (toward -Z with the current); used to make everything under water swim
vec2 fcrRip(vec2 p){ float t=uTime; p.y += t*1.4;
  return vec2(sin(p.x*2.9 + t*1.9 + 1.6*sin(p.y*1.3 - t*.8)), sin(p.y*2.3 + t*1.3 + 1.6*sin(p.x*1.9 + t*.6))); }
float fcrCaus(vec2 p){ float t=uTime; vec2 q=p*1.5; q.y += t*.8;
  q += .4*vec2(vn(q*.6+vec2(t*.21,0.)), vn(q*.6+vec2(5.3,-t*.19)));
  float a=vn(q+vec2(t*.33,0.)), b=vn(q*1.41+vec2(-t*.27,t*.22)+11.3);
  float c=(1.-abs(a*2.-1.))*(1.-abs(b*2.-1.)); return c*c*c*2.4; }
// the same light drawn fine, for the near bed only: the net the sun throws through a rippled surface, bright threads closing
// round dim cells a forearm wide, every knot of it wandering, the whole sliding downstream (the borders of jittered cells, warped:
// no texture, no derivative, and no straight line anywhere in it)
float fcrNet(vec2 p){ float t = uTime; vec2 q = vec2(p.x*2.7, p.y*1.8); q.y += t*.9;           // (cells drawn out along the current)
  q += .3*vec2(sin(q.y*1.7 + t*1.3) + 1.6*vn(q*.6 + vec2(t*.3, 0.)), sin(q.x*1.9 - t*1.1) + 1.6*vn(q*.6 + vec2(7., -t*.25)));
  q += 1.5*(vec2(vn(q*.31 + 13.), vn(q*.31 + 29.)) - .5) + .9*(vec2(vn(q*1.1 + 3.), vn(q*1.1 + 41.)) - .5);   // (no two cells alike)
  q += .17*vec2(sin(q.y*6.1 + q.x*2.3 + t*.7), sin(q.x*5.7 - q.y*1.9 - t*.6));                   // (and no thread straight: each one wavers along its length)
  vec2 ci = floor(q), f = q - ci; float d1 = 8., d2 = 8., d3 = 8.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j)), c = ci + o;
    vec2 r = o + .5 + .47*sin(t*.9 + 6.283*vec2(h21(c + 1.7), h21(c*1.3 + 5.1))) - f;
    float d = dot(r, r);
    if (d < d1) { d3 = d2; d2 = d1; d1 = d; } else if (d < d2) { d3 = d2; d2 = d; } else if (d < d3) { d3 = d; }
  }
  // bright knots where three cells meet, the threads between them fading along their length, whole patches of the bed left dim
  float s1 = sqrt(d1), e = clamp((sqrt(d2) - s1)*4.2, 0., 1.), k = 1. - e, knot = 1. - smoothstep(.04, .5, sqrt(d3) - s1);
  return k*k*k*(.2 + 1.3*knot)*(.25 + 1.5*smoothstep(.25, .8, vn(q*1.3 + 4.)))*smoothstep(.2, .62, vn(q*.37 + 9.)); }
// THE NEAR BED IS MADE OF PLANTS: weed drawn tuft by tuft, for the bed within twenty metres of the eye. Each cell of a 0.4 m grid
// roots one tuft at a jittered holdfast; it lies downstream (-y of p) as a fan of three fingers and sways. Returns (cover, 0 at the
// root .. 1 at the tip, tone of this plant).
vec3 fcrTuft(vec2 p){
  vec2 g = p*2.5 + .35*vec2(vn(p*.9 + 2.), vn(p*.9 + 6.)), ci = floor(g); vec3 best = vec3(0.);
  for (int j = 0; j <= 2; j++) for (int i = -1; i <= 1; i++) {
    vec2 c = ci + vec2(float(i), float(j));
    float h = h21(c + 3.1), h2 = h21(c*1.7 + 9.2), h3 = fract(h*17.3 + h2*5.1);
    vec2 d = g - (c + vec2(.08 + .84*h2, .08 + .84*h));
    float len = .5 + 1.2*h3*h3, t = -d.y/len;
    d.x += (.16*sin(uTime*1.6 + h*40.) + .5*(h3 - .5))*t*len;
    float w = (.3 + .2*h)*(sqrt(clamp(t, 0., 1.)) + .08)*(1.12 - .5*clamp(t, 0., 1.)), ax = abs(d.x)/w;
    float cov = step(0., t)*smoothstep(1., .82, t)*smoothstep(1., .8, ax)*mix(1., smoothstep(-.5, .3, cos(ax*(6.3 + 6.3*h2))), smoothstep(.2, .55, t))*step(.3, fract(h*7.7 + h2*3.3));
    if (cov > best.x) best = vec3(cov, t, h2);
  }
  return best; }
`,It=`
// fcrSandR: the same with cont 0..1 = ripple ridges whole along their length (a wet bar under a film of water: every ridge runs on,
// curving, a lit stoss and a shaded lee), not broken into the dashes of a deeper, stirred bed
vec3 fcrSandR(vec2 p, float dist, vec3 base, vec2 sun, float cont){
  float l1 = smoothstep(60., 10., dist), l2 = smoothstep(11. + 7.*cont, 2.5, dist), l3 = smoothstep(26., 6., dist);
  vec2 w = vec2(vn(p*.45), vn(p*.45 + 7.3));
  float s1 = fract((p.y*.86 + p.x*.5)*1.45 + 2.3*w.x + .7*vn(p*1.3 + 4.)), s2 = fract((p.y*.93 - p.x*.37)*6.9 + 3.4*w.y + 1.5*vn(p*1.9) + .8*vn(p*4.3 + 2.));
  float lee1 = smoothstep(.62, .7, s1)*(1. - smoothstep(.88, 1., s1))*mix(smoothstep(.22, .55, vn(p*.7 + 11.)), 1., cont), lee2 = smoothstep(.56, .68, s2)*(1. - smoothstep(.86, 1., s2))*mix(smoothstep(.2, .6, vn(p*1.6 + 15.)), 1., cont*.85);
  vec3 c = base*(.8 + .32*fb(p*.21 + 20.))*(.9 + .2*vn(p*3.1));
  c *= 1. + l1*(.1*smoothstep(.3, .62, s1) - .3*lee1) + l2*(mix(.07, .24, cont)*smoothstep(.12, .56, s2) - mix(.22, .34, cont)*lee2);
  float gr = h21(floor(p*70.));
  c *= 1. + l2*(.16*(gr - .5) + .12*(vn(p*31.) - .5));
  c = mix(c, c*vec3(.55, .5, .42), l2*step(.93, gr)*.6);
  float drift = smoothstep(.3, .62, vn(p*.21 + 31.));
  vec2 cp = p*3.3, ci = floor(cp), cf = fract(cp); float h = h21(ci + 17.3), h2 = h21(ci*1.7 + 3.1), h3 = h21(ci*2.3 + 41.);
  vec2 cc = vec2(.3) + .4*vec2(h2, h3), cv = (cf - cc)*vec2(1., .8 + .4*h2); float cr = .08 + .2*h3*h3, on = step(.9 - .45*drift, h)*l3;
  c *= 1. - .45*smoothstep(cr + .1, cr - .02, length(cv + sun*.09))*on;
  vec3 pc = mix(vec3(.12, .11, .1), vec3(.52, .47, .38), h2*h2); pc = mix(pc, vec3(.3, .17, .09), step(.62, h3)*.7); pc = mix(pc, vec3(.75, .74, .7), step(.9, h2));
  c = mix(c, pc*clamp(.8 + dot(cv, sun)/cr*.5, .4, 1.5), smoothstep(cr, cr - .035, length(cv))*on);
  vec2 dp = p*1.15 + 3.7, di = floor(dp), df = fract(dp); float k1 = h21(di + 7.9), k2 = h21(di*1.9 + 13.), k3 = h21(di*2.7 + 5.);
  vec2 dc2 = vec2(.3) + .4*vec2(k2, k3), dv = (df - dc2)*vec2(1., .75 + .5*k2); float dr = .13 + .16*k3, don = step(.93 - .3*drift, k1)*l1;
  c *= 1. - .5*smoothstep(dr + .12, dr - .02, length(dv + sun*.1))*don;
  vec3 dcol = mix(vec3(.1, .095, .09), vec3(.42, .39, .33), k2)*(.8 + .4*vn(p*9.));
  c = mix(c, dcol*clamp(.8 + dot(dv, sun)/dr*.55, .35, 1.5), smoothstep(dr, dr - .03, length(dv))*don);
  vec2 lp = p*1.7 + 9.3, li = floor(lp), lf = fract(lp) - .5; float g = h21(li + 5.7), g2 = h21(li*1.3 + 23.), a = g2*6.283;
  vec2 lr = vec2(lf.x*cos(a) + lf.y*sin(a), lf.y*cos(a) - lf.x*sin(a));
  float lv = .05*(1. - lr.x*lr.x/.0169) - abs(lr.y), leaf = smoothstep(0., .008, lv)*step(.78, g)*l3;
  vec3 lc = mix(vec3(.15, .08, .03), vec3(.34, .24, .05), g2)*(.7 + .5*smoothstep(.0, .03, abs(lr.y)));
  return mix(c, lc, leaf);
}
vec3 fcrSand(vec2 p, float dist, vec3 base, vec2 sun){ return fcrSandR(p, dist, base, sun, 0.); }
`,Lt=`
vec4 fcrPave(vec2 p, float lod, out vec3 aux){
  vec2 w = 1.25*vec2(vn(p*.17), vn(p*.17 + 9.));
  vec2 jp = vec2(p.x*.41 + p.y*.12 + w.x, p.y*.27 - p.x*.08 + w.y);
  vec2 id = floor(jp), f = abs(fract(jp) - .5);
  float h = h21(id + 3.7), h2 = h21(id*1.7 + 11.3);
  float d = .5 - max(f.x, f.y);
  vec2 g = abs(fract(jp*2. + .5*vec2(vn(p*.5 + 4.), vn(p*.5 + 13.))) - .5);
  float d2 = (.5 - max(g.x, g.y))*.5 + step(h, .45);                     // a finer set splits about half the blocks
  float crack = max(smoothstep(.03, .004, d), smoothstep(.016, .002, d2)*.7)*lod;
  float rn = fb(p*1.7), fine = vn(p*8.);
  vec3 a = vec3(.076, .073, .085)*(.5 + mix(.5, h, lod))*(.65 + .7*rn);  // near black, block to block
  a = mix(a, a*vec3(1.55, 1.2, .9), smoothstep(.55, .8, vn(p*.33 + 60.))*.5);      // rusty weathering rind
  float li = smoothstep(.54, .68, fb(p*.5 + 40. + h*2.))*smoothstep(.3, .55, fine*.6 + rn*.5)*lod;
  a = mix(a, vec3(.27, .28, .22)*(.7 + .5*fine), li*.8);                  // pale lichen plates
  a *= 1. - .85*crack;
  aux = vec3((vec2(h, h2) - .5)*.34*lod, smoothstep(.1, .0, d)*lod);
  return vec4(a, crack);
}
`,qt="varying vec3 vL; varying vec3 vW; varying vec3 vN;";async function to(t,v){const b=v.noise,p=new Uint8Array(we*We*4),z=(_e-Ae)/We,y=(Je-Me)/we,n=t.season==="july"?.95:t.season==="november"?.08:.22,u=t.season==="november"?.5:t.season==="july"?.56:.62,q=[];for(let E=0;E<We;E++){const T=Ae+(E+.5)*z;await v.yield(),q.length=0;for(const f of t.wells)Math.abs(T-f.z)<f.r+4.2&&q.push(f);const P=t.edgeL(T)-2,c=t.edgeR(T)+2;for(let f=0;f<we;f++){const e=Me+(f+.5)*y,l=(E*we+f)*4;if(f===we>>1&&await v.yield(),e<P||e>c){p[l]=150,p[l+1]=127,p[l+2]=255,p[l+3]=0;continue}const s=t.bed(e,T),o=s.zn;let m=4,x=null;for(let V=0;V<q.length;V++){const R=q[V],G=Math.hypot(e-R.x,T-R.z)-R.r;G<m&&(m=G,x=R)}const W=t.fallAmt(o),a=t.footAmt(o);let d=s.wl-s.h;W>.05&&(d=Math.min(d,.22));const A=s.dEdge>0;let w=0,F=0,H=0;if(A&&d>.015){const V=b.fbm2(e*.11+31,T*.08+12,2)*.5+.5;if(w=$(.02,.07,d)*(1-$(.7,1,d))*$(.42,.9,m)*(1-.9*$(u,u+.16,V)),o>fe)w*=$(.34,.6,V+.34*ae((fe+30-o)/30))*.9;else if(o<he+2){const K=Tt(e,T,o);w*=K===3?1:K===2?o<he?1:.35:0}else w*=1-.8*Math.min(1,a*1.5);const R=o<Y-1?t.poolShoal(e,T,o):0;o<Y&&(w=o<Y-6?$(.02,.07,d)*(1-$(.62,.9,d))*$(.5,.8,R)*(1-.85*$(u-.1,u+.1,V)):0);const G=b.fbm2(e*.05+50,T*.035+9,2);let U=$(.5,.66,G)*(1-s.isl)*.9;if(o<fe&&(U*=$(5,11,Math.abs(e-t.camX(T)))*ae((o-(he+3))/12)),F=Math.max(s.chan*ae((d-.65)/.4)*$(.1,.4,G+.1),U),o>fe+1&&(F=Math.max(F,$(.02,.3,G+(o-fe-22)*.022))),o<Y-3&&(F=Math.max(F*.4,(1-a*2)*(1-$(.3,.56,R)))),F=j(F,0,1),w*=1-F,H=Math.max(ae((5-s.dEdge)/4.5)*(e<0?1:.55),ae((d-.45)/.45)*.8,$(.3,.6,b.fbm2(e*.06+77,T*.05+3,2))*n,a*.9,.14),o<Y-3&&(H=Math.min(H,.12+.5*a)),o<fe-4&&o>he+4){const K=t.zonesAt(e,T),D=(1-s.chan)*$(-.1,.5,m),N=K[1]*D,B=K[3]*D;F=Math.max(F,N)*(1-B),w*=(1-N)*(1-B),H*=1-B,w*=1-.38*K[2]}}else H=.5+.5*b.n2(e*.1,T*.1);m<0&&(d+=ae(-m/.3)*2.4,w=0,F=x?x.sandy:0),p[l]=j(H,0,1)*255,p[l+1]=j(.5+.5*w-.5*F,0,1)*255,p[l+2]=j((m+2)/6,0,1)*255,p[l+3]=j(d/2.55,0,1)*255}}const k=new h.DataTexture(p,we,We,h.RGBAFormat);return k.minFilter=k.magFilter=h.LinearFilter,k.wrapS=k.wrapT=h.ClampToEdgeWrapping,k.needsUpdate=!0,k}async function oo(t,v){const b=[];for(let e=-24;e<=24;e+=1)b.push(e);for(const e of[25.5,27.5,30,34,40,50,66,88,115])b.push(e),b.unshift(-e);const p=[],z=(e,l)=>{p.push(e+.3*l,e,e-l/3,e-2*l/3,e-l,e-l-.45)};for(let e=_e;e>fe+1;e-=3.2)p.push(e);z(fe+1,1);for(let e=fe-1.6;e>he+.6;e-=1.25)p.push(e);for(let e=0;e<ce;e++){const l=he-ke*e;z(l,ut);for(let s=1;s<=7;s++)p.push(l-1.05-s*(ke-1.4)/8)}z(Y,1);for(let e=Y-3;e>=Ae;e-=2.6)p.push(e);const y=b.length,n=p.length,u=new Float32Array(y*n*3),q=new Float32Array(y*n),k=new Float32Array(y*n);for(let e=0;e<n;e++){(e&3)===3&&await v.yield();for(let l=0;l<y;l++){const s=b[l],o=t.zOf(s,p[e]),m=t.bed(s,o),x=e*y+l;u[x*3]=s,u[x*3+1]=m.h,u[x*3+2]=o,k[x]=m.zn,q[x]=m.dEdge<-1.5?Math.min(m.wl,m.h-.4):t.fallAmt(m.zn)>.05?Math.min(m.wl,m.h+.22):m.wl}}await v.yield();const E=new Uint32Array((y-1)*(n-1)*6);let T=0;for(let e=0;e<n-1;e++)for(let l=0;l<y-1;l++){const s=e*y+l,o=s+1,m=s+y,x=m+1;E[T++]=s,E[T++]=o,E[T++]=m,E[T++]=o,E[T++]=x,E[T++]=m}const P=new h.BufferGeometry;P.setAttribute("position",new h.BufferAttribute(u,3)),P.setAttribute("aWl",new h.BufferAttribute(q,1)),P.setAttribute("aZn",new h.BufferAttribute(k,1)),P.setIndex(new h.BufferAttribute(E,1)),await v.yield();const c=new Float32Array(y*n*3),f=(e,l,s)=>{const o=e*3,m=l*3,x=s*3,W=u[m],a=u[m+1],d=u[m+2],A=u[x]-W,w=u[x+1]-a,F=u[x+2]-d,H=u[o]-W,V=u[o+1]-a,R=u[o+2]-d,G=w*R-F*V,U=F*H-A*R,K=A*V-w*H;c[o]+=G,c[o+1]+=U,c[o+2]+=K,c[m]+=G,c[m+1]+=U,c[m+2]+=K,c[x]+=G,c[x+1]+=U,c[x+2]+=K};for(let e=0;e<n-1;e++){(e&31)===31&&await v.yield();for(let l=0;l<y-1;l++){const s=e*y+l;f(s,s+1,s+y),f(s+1,s+y+1,s+y)}}await v.yield();for(let e=0;e<c.length;e+=3){const l=Math.hypot(c[e],c[e+1],c[e+2])||1;c[e]/=l,c[e+1]/=l,c[e+2]/=l}return P.setAttribute("normal",new h.BufferAttribute(c,3)),P.computeBoundingSphere(),P}const ao=`
${qt} attribute float aWl, aZn; varying float vWl; varying float vZn;
#include <fog_pars_vertex>
void main(){
  vL = position; vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; vN = normalize(mat3(modelMatrix)*normal); vWl = aWl; vZn = aZn;
  vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ht=`
${qt}
uniform sampler2D uMask; uniform vec4 uMaskRect;
uniform vec3 uSunDir, uSun, uSky, cWeed, cTip, cSand, cGreen, cRock, cDeep, cHaze; uniform float uGloss, uWeedSat;
${Ve}${Xe}${et}${Lt}${Et}${It}
#include <fog_pars_fragment>
`;function no(t){return new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...t},fog:!0,vertexShader:ao,fragmentShader:Ht+`
varying float vWl; varying float vZn; uniform float uMirror;
uniform vec4 uHol[6];
void main(){
  float depth = vWl - vL.y, uw = smoothstep(0., .05, depth), dc = clamp(depth, 0., 1.5), dCam = distance(cameraPosition, vW);
  float lodB = smoothstep(120., 26., dCam);                               // the finest weed grain is for the near bed only
  vec4 M0 = texture2D(uMask, (vL.xz - uMaskRect.xy)*uMaskRect.zw);
  if (M0.b*6. - 2. < .05) discard;                                   // pothole: the well mesh takes over
  vec2 rp = vL.xz + fcrRip(vL.xz)*(.015 + .07*dc)*uw;                // refraction: the bed swims under the ripples
  vec4 M = texture2D(uMask, (rp - uMaskRect.xy)*uMaskRect.zw);
  float weed = clamp(M.g*2. - 1., 0., 1.)*uw, sand = clamp(1. - M.g*2., 0., 1.)*uw, green = M.r;
  // (the mask is 0.4 m to a texel: near the eye its soft edges are cut to a torn line a hand wide, so sand, weed and rock meet as things)
  float tear = (vn(rp*3.7 + 11.) - .5)*.44 + (vn(rp*9.3) - .5)*.22, crispK = smoothstep(46., 14., dCam);
  weed = mix(weed, smoothstep(.36, .64, weed + tear), crispK); sand = mix(sand, smoothstep(.36, .64, sand + tear), crispK);
  // THE TREADS: on the staircase the weed is not read from the 0.4 m mask (blotches at the closest pass) but drawn from the tread's
  // own sums, every edge torn by noise: face | basin of bare rock | red weed, pressed flat and wine-dark along the runnels, and a
  // hand of bare wet sill at the lip between the spouts
  float onS = smoothstep(-90.2, -90.5, vZn)*step(-195., vZn);
  float kS = floor((-90. - vZn)/15.), bS = -90. - 15.*kS - vZn, bEnd = fcrBasinEnd(rp), eN = fcrEdge(rp);
  float sT = clamp((bS - bEnd)/(15. - bEnd), 0., 1.), faceS = step(bS, .9), dM = M.a*2.55;
  float laneD = fcrLane(rp) - mix(fcrLaneThr(sT), ${Ce.toFixed(2)}, faceS) + eN*.05;
  float laneB = smoothstep(-.05, .04, laneD)*mix(smoothstep(bEnd - .2, bEnd + 1.2, bS), 1., faceS)*onS;
  float sillS = smoothstep(14.3, 14.72, bS + eN*.22)*laneB*(1. - faceS)*onS;      // (bare wet sill only where water pours over: in a ribbon the weed bends over the edge itself)
  float basW = 1. - smoothstep(-.12, .12, bS - bEnd + eN*.5), pockS = basW*fcrSpout(rp, bS)*(1. - faceS);   // the plunge pocket: bare and blue only under a white cord
  float weedS = (1. - .9*sillS)*mix((1. - pockS)*(1. - .82*laneB), 1. - .8*laneB, faceS)*smoothstep(.02, .07, dM)*smoothstep(.62, .45, dM)*uw;   // (a runnel is a thread of clear blue water over scoured rock, the weed parted to either side of it)
  weed = mix(weed, weedS, onS); green *= 1. - .6*onS;
  float ribS = sillS, scourS = max(pockS, laneB*(1. - faceS))*onS;
  vec3 N = normalize(vN);
  float steep = 1. - smoothstep(.5, .85, N.y);
  float along = mix(rp.y, vL.y*1.6, steep);
  // THE RISERS OF THE STAIRCASE AND OF THE LAST FALL (the bed's own slope within two metres below a lip): wet black rock under the
  // falling sheet. The weed hangs over the lip in tongues and lets go a forearm or two down; below it the face is bare, darker
  // than the treads, and mossed: in pads everywhere, thickly toward the river's two sides where the sheet runs thin (the mask's depth).
  float rise = steep*smoothstep(-90.2, -90.5, vZn)*smoothstep(2.6, 1.6, bS)*step(-200., vZn);
  weed *= 1. - rise*(1. - smoothstep(.35, .8, vn(vec2(rp.x*1.7, kS*3.1 + 2.)) + .3*(vn(vec2(rp.x*6.1, vL.y*2.)) - .5))*smoothstep(.5, .1, bS + .3*vn(vec2(rp.x*3.3, kS))));
  // black quartzite: joints, pitting; dry pavement is greyer with pale lichen; a moss line at the water
  float rn = fb(rp*1.7), big = fb(rp*.21 + 20.);
  vec2 jp = vec2(rp.x*.37 + along*.11 + 1.1*vn(rp*.17), along*.23 - rp.x*.07 + 1.1*vn(rp*.17 + 9.));
  float crack = smoothstep(.02, 0., min(abs(fract(jp.x) - .5), abs(fract(jp.y) - .5)))*.8;
  float dry = smoothstep(.03, .4, -depth);
  vec3 rock = cRock*(.55 + 1.5*rn)*(1. - crack*.75);
  // (seen through a hand of clear water the bare slab is plainly rock: rusty rind, veins of white quartz, pits)
  float nearR = smoothstep(46., 7., dCam);
  rock = mix(rock, cRock*vec3(3.6, 2.5, 1.7), smoothstep(.5, .78, vn(rp*.31 + 60.))*.5*uw);
  rock += vec3(.07, .07, .078)*smoothstep(.016, .0, abs(vn(rp*vec2(.9, .5) + 3.*vn(rp*.23)) - .5))*smoothstep(.4, .68, vn(rp*.37 + 11.))*(1. - crack)*uw;
  rock *= 1. - .5*smoothstep(.035, 0., min(abs(fract(jp.x*3. + .3*vn(rp*.5)) - .5), abs(fract(jp.y*3.) - .5)))*nearR*uw;
  vec2 hp = rp*1.6, hi = floor(hp), hf = fract(hp) - .5 - (vec2(h21(hi + 31.), h21(hi + 57.)) - .5)*.4;
  float hon = step(.5, h21(hi + 9.1))*nearR*uw, hr = .12 + .2*h21(hi*1.3 + 4.), hd = length(hf);
  rock = mix(rock, cRock*.22, smoothstep(hr, hr - .05, hd)*hon*.85);
  rock += vec3(.045, .05, .06)*smoothstep(.05, .0, abs(hd - hr - .02))*hon*clamp(.5 - .5*dot(hf, uSunDir.xz)/max(hd, .05), 0., 1.);
  rock *= 1. - .55*smoothstep(.7, .84, vn(rp*5.3))*nearR*uw;
  float alg = fb(rp*.8 + 7.) + .15*green, algA = mix(.85*smoothstep(.1, .45, alg), smoothstep(.3, .62, alg)*.7, smoothstep(-96., -86., vL.z));
  float cmbA = mix(.5, vn(vec2(rp.x*38. + 2.*vn(rp*vec2(2., .7)), along*1.3 + 9.)), smoothstep(30., 8., dCam));
  algA = mix(algA, smoothstep(.34, .56, alg)*(.2 + .6*smoothstep(.35, .7, cmbA)), onS);          // (on the treads: thinner, darker, combed by the current into streaks)
  algA *= smoothstep(.03, .11, green + onS)*(1. - .85*ribS);                    // (mask green 0 = a pavement kept bare and black; the ribs of a slide are scoured)
  rock = mix(rock, cGreen*vec3(.45,.9,.5)*(.22 + .5*rn)*(1. - .5*onS)*(.7 + .6*vn(rp*vec2(9., 6.))*nearR), uw*algA*(1. - .8*scourS));
  rock = mix(rock, vec3(.07, .085, .1)*(.6 + .9*rn)*(1. - .5*crack), scourS*.75);   // scoured pale where the water runs hardest
  vec3 aux; vec4 pv = fcrPave(vec2(rp.x, along), 1., aux);              // the dry pavement: jointed black blocks, lichen plates
  pv.rgb *= mix(.5, 1., smoothstep(.02, .5, -depth));                     // dark and wet beside the water
  rock = mix(rock, pv.rgb, dry*(1. - rise));                             // (a riser beside the water is the same bedded rock as under it, not paving stood on end)
  // (round 14) THE WET HOLLOWS of the banks (uHol: x, z, half-width across the bank, half-length along it): a seep in the pavement
  // at the water's edge. Inside its torn outline the rock is dark and wet, green with algae and moss in pads, and the low places
  // hold a little standing water that mirrors the sky (below)
  float hol = 0.;
  for (int i = 0; i < 6; i++) { vec4 hq = uHol[i]; vec2 hd = (vL.xz - hq.xy)/max(hq.zw, vec2(.5));
    hol = max(hol, step(.25, hq.z)*(1. - smoothstep(.62, 1., length(hd) + (vn(vL.xz*.45 + hq.xy) - .5)*.6 + (vn(vL.xz*1.9) - .5)*.16))); }
  float holB = hol*dry*(1. - steep), holP = holB*smoothstep(.5, .56, vn(rp*.55 + 17.)*.7 + vn(rp*1.7 + 3.)*.3)*smoothstep(.3, .8, hol);
  rock *= 1. - .62*holB;
  rock = mix(rock, cGreen*vec3(.5, .9, .42)*(.16 + .5*rn), holB*smoothstep(.38, .5, vn(rp*1.1 + 23.)*.6 + vn(rp*4.3)*.4)*.85*(1. - holP));
  rock *= 1. + steep*(.9*vn(vec2(rp.x*.25, vL.y*5.)) - .3);           // bedding on the scarps
  float moss = smoothstep(.05, 0., abs(depth + .01) - .03*rn)*smoothstep(.4, .75, rn + green*.25);
  moss = max(moss, steep*(1. - uw)*smoothstep(.45, .7, rn));
  rock *= 1. - .45*rise*smoothstep(mix(1., 2.6, step(6.5, kS)), mix(.6, 1.6, step(6.5, kS)), bS);                       // (wet and dark under the sheet; at its foot, where the boil washes it, as the tread is)
  moss = max(moss, rise*smoothstep(.4, .7, vn(vec2(rp.x*1.1 + 9., vL.y*1.7)) + .25*rn + .45*smoothstep(.45, .08, dM))*(1. - .7*laneB));
  moss = max(moss, dry*aux.z*smoothstep(.2, .45, vn(rp*.31 + 5.) + .2*big)*(1. - steep));   // moss in the joints
  rock = mix(rock, cGreen*vec3(.6,.85,.42)*(.2 + .5*rn), moss*.85);
  N = normalize(N + vec3(aux.x, 0., aux.y)*dry*(1. - steep));            // every block tips its own way
  // weed: tufts streaming toward -Z, combed and swaying
  vec2 wp = vec2(rp.x + .07*sin(along*1.9 + uTime*2.4 + 5.*vn(rp*.35)), along);
  float st = vn(vec2(wp.x*6.5 + 2.2*vn(wp*vec2(2.3,.8) + 3.), wp.y*2. + uTime*.3))*.65 + mix(.5, vn(vec2(wp.x*15. + 5., wp.y*4.6 + uTime*.4)), lodB)*.35, st2 = vn(vec2(wp.x*2.4 + 4., wp.y*.7 - 2.));
  float tuft = vn(wp*vec2(1.5,.6) + 13.);
  float lodN = smoothstep(mix(16., 26., onS), 3., dCam);                  // under the eye the paint is combed into ribbons: dark between, bright along each frond
  float dens = weed*smoothstep(.12, .5, tuft*.55 + st2*.45 + weed*.3 + (st - .5)*.55*lodN);
  float ros = vn(vec2(wp.x*1.9 + 1.3*vn(wp*.6), wp.y*1.05 + 4.));           // plant by plant: the rock shows dark at each holdfast
  dens *= 1. - .5*smoothstep(.56, .76, ros)*smoothstep(90., 24., dCam)*(1. - .6*onS);
  vec3 wc = mix(cWeed*mix(.5, .4, lodN), cWeed*mix(1., 1.15, lodN), smoothstep(.15, .8, st));
  wc *= mix(1., .66 + .68*vn(vec2(wp.x*41. + 3.*vn(wp*vec2(3., 1.)), wp.y*5.5 + uTime*.6)), lodN);
  wc = mix(wc, cTip, smoothstep(.6, .95, st*.55 + tuft*.55)*.7);
  vec3 gc = mix(cGreen*.3, cGreen*.9, st);
  wc *= (.72 + .5*big)*(.74 + .5*vn(rp*vec2(2.1, 1.7) + 31.));        // wine-dark and brighter reaches, tuft by tuft
  wc = mix(wc, gc, smoothstep(.3, .8, green + (tuft - .5)*.5));
  wc *= mix(1., .8 + .4*vn(vec2(wp.x*30., wp.y*10. + uTime*.5)), lodB);
  wc *= (1. - .3*lodN)*(1. - .42*laneB*(1. - faceS))*(1. - .3*basW*(1. - pockS)*onS*(1. - faceS));               // (wine-dark under the real fronds near the eye, darker still where a runnel presses it flat)
  // UNDER THE EYE the weed is plants, not paint: a wine-dark mat, and on it tuft after tuft from a dark root to a lit rose tip,
  // every one leaning with the current and of its own tone, bare rock showing dark in the gaps
  // FROM PLANTS TO CARPET WITHOUT A LINE (below the ledge; the shelf above it keeps its law of metres from the eye). Two things
  // change between the plants under the eye and the carpet far off, and each is given its own even law:
  // THE TONE (the wine-dark mat between the plants) is seen where the eye looks down between them and is hidden where it looks
  // along them: it goes by the sine of the angle at which the bed is seen from where the eye IS (lodM: whole from 27 degrees
  // down, none at 2), which from any height is an even ramp up the picture, never a step that goes before the eye.
  // THE PLANTS THEMSELVES go by the pixel's footprint: a tuft is a hand to a forearm across, drawn whole where a pixel covers
  // under two centimetres of the bed (the root of its area there) and let go evenly into the mat's own mean as that grows eleven
  // times over (lodF: the lens, as a level of detail reads it).
  vec2 fpx = dFdx(vL.xz), fpy = dFdy(vL.xz); float shelfK = smoothstep(88., 90.5, vZn), lodO = smoothstep(23., 9., dCam);
  float lodF = 1. - smoothstep(0., 1., (log2(max(sqrt(abs(fpx.x*fpy.y - fpx.y*fpy.x)), 1e-4)) + 5.64)/3.46);
  float lodM = clamp(((cameraPosition.y - vW.y)/max(dCam, 1e-3) - .035)/.42, 0., 1.);
  float lodT = (shelfK >= 1. ? lodO : mix(lodM, lodO, shelfK))*(1. - steep), lodD = shelfK >= 1. ? 1. : mix(lodF, 1., shelfK); vec3 tf = fcrTuft(vec2(rp.x, along));
  vec3 tcol = mix(cWeed*.3, cWeed*1.12, smoothstep(0., .6, tf.y))*(.78 + .46*tf.z); tcol = mix(tcol, cTip*(.85 + .3*tf.z), smoothstep(.5, 1., tf.y)*.62);
  tcol = mix(tcol, mix(cGreen*.3, cGreen*1.05, tf.y)*(.8 + .4*tf.z), smoothstep(.3, .8, green + (tuft - .5)*.5));
  vec3 det = mix(wc*.4, tcol, tf.x);
  if (shelfK >= 1.) wc = mix(wc, det, lodT); else wc = mix(wc, mix(wc*.62, det, lodD), lodT);
  dens *= 1. - lodT*lodD*.5*(1. - tf.x)*smoothstep(.52, .7, vn(rp*2.7 + 5.));
  vec3 alb = mix(rock, wc, dens);
  vec3 sc = fcrSand(rp, dCam, cSand, uSunDir.xz);
  alb = mix(alb, sc, sand*(1. - steep));
  // light
  float cl = fcrCloud(vW.xz), nl = max(dot(N, uSunDir), 0.);
  float caus = (fcrCaus(rp) + 1.3*fcrNet(rp)*smoothstep(30., 7., dCam)*(1. - .95*smoothstep(.12, .5, weed)))*uw*exp(-dc*.5);   // (the fine net is for sand and rock: on weed it would marble the paint)
  nl = mix(nl, max(nl, .62), dens);                                        // (weed stands up into the light: a low sun does not leave the carpet black)
  vec3 col = alb*(uSun*cl*nl*(.78 + 1.0*caus) + uSky*(.55 + .45*N.y));
  vec3 V = normalize(cameraPosition - vW);
  float wet = (1. - uw)*max(1. - dry*(1. - uGloss), moss*.5);
  wet = max(wet, holB*.9);
  col += uSun*cl*wet*.35*pow(max(dot(reflect(-V, N), uSunDir), 0.), 30.);
  float gz = 1. - max(dot(V, N), 0.); gz *= gz;
  col += uSky*gz*gz*(.05 + .22*wet)*(1. - uw);                           // polished rock takes the sky at a glancing angle
  // (round 14) the standing water of a hollow: the sky lying in it, a dark wet rim round each pool, a breath of wind on it
  col = mix(col, (cHaze*.34 + uSky*.5)*(.5 + .5*gz)*(.9 + .2*vn(rp*5. + uTime*.4)), holP*.86);
  col *= 1. - .5*holB*(1. - holP)*smoothstep(.44, .5, vn(rp*.55 + 17.)*.7 + vn(rp*1.7 + 3.)*.3);
  float bedl = smoothstep(.3, .62, vn(vec2(rp.x*.2 + 3., along*1.5 + 1.6*vn(rp*.27))));
  float bareR = mix(clamp(1. - abs(M.g*2. - 1.)*2.2, 0., 1.), 1. - weed, onS)*smoothstep(.5, .2, -depth);
  col *= 1. - .3*min(uMirror*2., 1.)*(1. - uw)*smoothstep(.5, .2, -depth);
  col *= 1. - .45*min(uMirror*2., 1.)*bareR*uw;
  float bedg = smoothstep(.05, .0, abs(vn(vec2(rp.x*.2 + 3., along*1.5 + 1.6*vn(rp*.27))) - .52))*(.4 + .6*vn(rp*vec2(1.3, 4.)));
  col += cHaze*vec3(1.1, .7, .78)*uMirror*bareR*(.012 + .1*bedl*bedl + .5*bedg)*(1. - .6*crack);   // (its bedding catching the rose of the sky)   // a low sun: bare rock in the river lies dark and wet, never a pale pad
  // (wet rock at a low sun: black, block by block, a few of the blocks holding a film of the rose sky, and a glint wandering along
  // some of the joints: never a ruled grid)
  vec2 jq = jp*2.2 + 1.5*vec2(vn(rp*.37 + 2.), vn(rp*.37 + 7.)) + .35*vec2(vn(rp*1.3 + 4.), vn(rp*1.3 + 9.)), jc = floor(jq), jd = abs(fract(jq) - .5);
  float jh = h21(jc + 5.3), jf = .5 - max(jd.x, jd.y), lowK = uMirror*bareR*uw*nearR;
  col += cHaze*vec3(1.2, .66, .74)*lowK*(smoothstep(.02, .045, jf)*smoothstep(.12, .055, jf)*smoothstep(.3, .62, vn(rp*.55 + 13. + jh*3.))*.34 + step(.72, jh)*smoothstep(.03, .12, jf)*.07*(.5 + vn(rp*3.1)));
  col *= 1. - .5*smoothstep(.03, .0, jf)*min(uMirror*2.4, 1.)*bareR*uw*nearR;
  col += cHaze*vec3(1.15, .72, .8)*uMirror*dry*((.03 + .09*bedl + .1*gz*(.4 + 3.*abs(aux.x + aux.y)))*(1. - .85*pv.a) + .5*aux.z*(1. - pv.a)*(.35 + .65*vn(rp*2.3 + 7.)));   // ... and the dry pavement stays black, block by block, its joints edged with the sky's own rose
  float ab = 1. - exp(-max(mix(depth, M.a*2.55, uw) - .3, 0.)*1.3);
  col = mix(col, cDeep*(uSun*cl*.8 + uSky*.8), ab*.9);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`})}function so(t,v){const p=[[1,.5,-.07,0],[1,.34,.07,0],[1,.1,.09,0],[1,0,.03,0],[.985,0,-.1,-.04],[1.05,0,0,-.45],[1,0,0,-.85],[.7,0,0,-.985]],z=p.length,y=[],n=[],u=[],q=[];for(let e=0;e<z;e++){const l=p[Math.max(0,e-1)],s=p[Math.min(z-1,e+1)],o=s[0]*2+s[1]-(l[0]*2+l[1]),m=s[2]+s[3]*3-(l[2]+l[3]*3),x=Math.hypot(o,m)||1;for(let W=0;W<36;W++){const a=W/36*Math.PI*2;y.push(Math.cos(a),0,Math.sin(a)),n.push(...p[e]),u.push(m/x,-o/x)}}y.push(0,0,0),n.push(0,0,0,-1),u.push(0,1);for(let e=0;e<z-1;e++)for(let l=0;l<36;l++){const s=e*36+l,o=e*36+(l+1)%36,m=s+36,x=o+36;q.push(s,m,o,o,m,x)}for(let e=0;e<36;e++)q.push((z-1)*36+e,z*36,(z-1)*36+(e+1)%36);const k=new h.InstancedBufferGeometry;k.setAttribute("position",new h.Float32BufferAttribute(y,3)),k.setAttribute("aProf",new h.Float32BufferAttribute(n,4)),k.setAttribute("aNrm",new h.Float32BufferAttribute(u,2)),k.setIndex(q);const E=t.wells.length,T=new Float32Array(E*4),P=new Float32Array(E*4);t.wells.forEach((e,l)=>{const s=t.bed(e.x,e.z);e.y=s.h,e.wl=s.wl,T.set([e.x,s.h,e.z,e.r],l*4),P.set([e.depth,e.sandy,t.rng(),s.wl],l*4)}),k.setAttribute("iA",new h.InstancedBufferAttribute(T,4)),k.setAttribute("iB",new h.InstancedBufferAttribute(P,4)),k.instanceCount=E,k.boundingSphere=new h.Sphere(new h.Vector3(0,-2,0),100);const c=new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...v},fog:!0,vertexShader:`
${qt} attribute vec4 aProf, iA, iB; attribute vec2 aNrm; varying vec4 vI; varying vec3 vC; varying float vRel; varying float vRnd;
#include <fog_pars_vertex>
void main(){
  float ang = atan(position.z, position.x + 1e-5), wob = 1. + .018*sin(ang*3. + iB.z*6.28) + .012*sin(ang*7. + iB.z*17.);
  float rr = (iA.w*aProf.x + aProf.y)*wob;
  vec3 p = vec3(iA.x + position.x*rr, iA.y + aProf.z + aProf.w*iB.x, iA.z + position.z*rr);
  vL = p; vC = vec3(iA.x, iA.y + .09, iA.z); vI = vec4(iA.w, iB.x, iB.y, iB.w); vRel = -aProf.w; vRnd = iB.z;
  vec3 n = vec3(position.x*aNrm.x, aNrm.y, position.z*aNrm.x);
  // SEEN THROUGH WATER: a ray from the eye bends down as it enters, so the wall and the floor of a well stand higher in the picture
  // than they are (a third of their depth from a low eye, three quarters from straight above): the well is drawn that much
  // shallower below its lip, and shaded with its true depth (vL)
  vec3 camLoc = cameraPosition - modelMatrix[3].xyz;
  float y0 = iA.y - .1, dv = max(y0 - p.y, 0.), el = max(camLoc.y - iB.w, .05), ln = length(vec3(camLoc.xz - p.xz, el));
  float sa = el/max(ln, .05), sb = sqrt(1. - (1. - sa*sa)/1.7689);
  p.y = y0 - dv*clamp(sa/(1.33*sb), .2, .76);
  vec4 w = modelMatrix*vec4(p,1.); vW = w.xyz; vN = normalize(mat3(modelMatrix)*n);
  vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:Ht+`
varying vec4 vI; varying vec3 vC; varying float vRel; varying float vRnd; uniform vec3 uSunL; uniform float uMirror;
void main(){
  vec3 N = normalize(vN); float below = vC.y - vL.y, dw = max(vI.w - vL.y, 0.);
  vec3 Vv = cameraPosition - vW; float dist = length(Vv); vec3 V = Vv/max(dist, 1e-3);
  float lod = smoothstep(110., 24., dist), nearW = smoothstep(34., 8., dist);
  vec2 rp = vL.xz + fcrRip(vL.xz)*(.02 + .05*min(dw, 2.)), rc = vL.xz - vC.xz;
  float rn = fb(rp*1.9 + vL.y*1.3), floorM = smoothstep(.8, .97, vRel), lipM = 1. - smoothstep(.02, .16, below);
  // THE WALL of a pothole: beds of quartzite a hand thick, every ledge of them catching the light and shading the bed under it,
  // scallops ground into it by the stones that drilled the well, paler than the black lip where the water has scoured it
  float ang = atan(rc.y, rc.x + 1e-5), arc = ang*vI.x;
  float bq = below*2.6 + .55*vn(vec2(arc*.8, below*.7) + vRnd*9.), bl = fract(bq);
  float ledge = smoothstep(0., .14, bl)*smoothstep(.55, .14, bl), under = smoothstep(.72, 1., bl);
  vec3 alb = mix(vec3(.07, .07, .075), vec3(.36, .33, .27), .25 + .75*rn);
  alb *= (.75 + .8*ledge*lod)*(1. - .6*under*lod)*(.78 + .44*vn(vec2(arc*2.3, below*1.7) + 3.));
  float algae = smoothstep(.1, .35, below)*smoothstep(1.7, .35, below)*smoothstep(.3, .65, rn + .2*ledge);
  alb = mix(alb, cGreen*vec3(.5, 1., .45)*(.4 + rn), algae*.25);
  // the lip itself: by day a rim of scoured quartzite, pale and lit, pitted, a ring that says where the hole begins; at a low sun bare black rock, wet
  alb = mix(alb, mix(vec3(.43, .4, .34)*(.6 + .8*rn)*(1. - .45*smoothstep(.6, .8, vn(rp*4.7 + 3.))), cRock*(.5 + 1.4*rn), min(uMirror*2.4, 1.)), lipM);
  // the floor: yellow sand in ripples, or the dark bed strewn with the pale stones that ground the hole
  float dF = dist*.6, rpl = sin((rp.x*.6 + rp.y + 1.5*vn(rp*.5))*7.);
  vec3 fl = mix(fcrSand(rp*1.5 + 31., dF, vec3(.085, .092, .1), uSunDir.xz), fcrSand(rp*2.5, dF, cSand*(.82 + .06*rpl), uSunDir.xz), vI.z);
  // small silver fish holding over the floor, each on its own slow round, its shadow beside it
  float fish = 0., fsh = 0., fsz = mix(1., 1.6, smoothstep(2.4, 4., vI.x)); vec2 so = -uSunL.xz*.16;   // (a wide well holds bigger fish: a forearm and more long, seen from the line as fish)
  for (int i = 0; i < 5; i++) {
    float fi = float(i), dir = mod(fi, 2.) < .5 ? 1. : -1., r0 = (.2 + .13*fi + .1*sin(uTime*.31 + fi*2.7))*min(vI.x*.82, 2.6);
    float a = dir*uTime*(.34 + .07*fi)/max(r0, .3) + fi*1.9 + vRnd*40.;
    vec2 c = vec2(cos(a), sin(a))*r0, t = vec2(-sin(a), cos(a))*dir, d = rc - c, d2 = d - so;
    float al = dot(d, t), ac = dot(d, vec2(t.y, -t.x)) + .012*sin(al*38. - uTime*9. + fi), tap = 1. - .6*smoothstep(.0, -.13, al);
    fish = max(fish, smoothstep(1., .72, length(vec2(al/(.13*fsz), ac/(.026*tap*fsz)))));
    float al2 = dot(d2, t), ac2 = dot(d2, vec2(t.y, -t.x));
    fsh = max(fsh, smoothstep(1.3, .5, length(vec2(al2/(.13*fsz), ac2/(.03*fsz)))));
  }
  float fK = floorM*nearW*step(.9, vI.x);
  fl *= 1. - .4*fsh*fK; fl = mix(fl, vec3(.05, .06, .055) + vec3(.25, .27, .26)*smoothstep(.6, 1., fish)*.6, fish*fK*.9);
  alb = mix(alb, fl, floorM);
  // sunlight comes down the shaft: lit where the (refracted) ray back toward the sun clears the rim; the net of light crawls over
  // the lit wall and the floor
  vec2 q = rc + uSunL.xz/max(uSunL.y, .2)*.62*max(below, 0.);
  float shaft = smoothstep(vI.x*1.02, vI.x*.86, length(q)); shaft = mix(shaft, max(shaft, .42), vI.z);   // (a sandy well is lit to its floor, the rim's shadow lying across it on the sun's side: a hole, not a pan)
  float cl = fcrCloud(vW.xz), nl = max(dot(N, uSunDir), 0.)*.8 + .2*floorM;
  vec2 cq = mix(vec2(arc, below*1.4), rp, floorM);
  float caus = (fcrCaus(cq*.6) + 1.2*fcrNet(cq*.75 + 3.)*nearW)*exp(-dw*.22);
  vec3 col = alb*(uSun*cl*nl*shaft*(.8 + 1.25*caus) + uSky*(.32 + .68*smoothstep(1.3, 0., below) + .36*vI.z*floorM + 1.4*uMirror*smoothstep(.12, .6, below)));   // (the sky's light thins down the shaft: the wall goes dark under the rim)
  col *= 1. - .6*min(uMirror*2., 1.)*smoothstep(.3, .02, below);            // a low sun: the lip is a ring of dark wet rock round the mirror
  float gz = 1. - max(dot(V, N), 0.);
  col += uSun*cl*.3*smoothstep(.25, 0., below)*pow(max(dot(reflect(-V, N), uSunDir), 0.), 24.);
  col += cHaze*lipM*(.05 + .32*gz*gz*gz)*(1. - .6*min(uMirror*2., 1.));       // the wet lip takes a glint of sky
  // THE WATER IN IT: clear, losing its red first and then its green with every metre the light travels down and back to the eye
  // (a shallow sandy well stays gold-green to its floor, a deep one goes through turquoise to blue)
  float sa = clamp(V.y, .06, 1.), sb = sqrt(1. - (1. - sa*sa)/1.7689), pw = dw/sb + dw*.6;
  vec3 T = exp(-pw*mix(vec3(.42, .13, .045), vec3(.19, .06, .034), vI.z));
  vec3 body = mix(cDeep*.8 + vec3(0., .02, .02), vec3(.1, .09, .46), uMirror)*(uSun*cl*(.55 + .35*shaft) + uSky*(.7 + 2.2*uMirror));
  col = mix(col*T, body, 1. - exp(-pw*mix(.13, .075, vI.z)));               // (depth is read by colour: gold at a sandy well's wall, green and turquoise over its floor; a deep one blue to black-blue)
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`}),f=new h.Mesh(k,c);return f.frustumCulled=!1,f.name="fcr-wells",f}const Ot=`
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float ff = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
      float ff = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    col = mix(col, fogColor*a, ff);
  #endif
`;async function ro(t,v,b){const z=new Float32Array(256*(ce+1));{const s=v.uMask.value.image.data,o=(a,d)=>s[(d*we+a)*4+3],m=new Uint16Array(z.length),x=(a,d)=>{const A=j((a-Me)/(Je-Me)*we-.5,0,we-1.001),w=j((d-Ae)/(_e-Ae)*We-.5,0,We-1.001),F=Math.floor(A),H=Math.floor(w);return ye(ye(o(F,H),o(F+1,H),A-F),ye(o(F,H+1),o(F+1,H+1),A-F),w-H)*.01};for(let a=0;a<=ce;a++){const d=a===ce?Y:he-ke*a;for(let A=0;A<256;A++){const w=Me+(A+.5)*(Je-Me)/256,F=Math.min(x(w,t.zOf(w,d+.3)),x(w,t.zOf(w,d+.65)),x(w,t.zOf(w,d+1)));z[a*256+A]=F,m[a*256+A]=h.DataUtils.toHalfFloat(F)}}const W=new h.DataTexture(m,256,ce+1,h.RedFormat,h.HalfFloatType);W.minFilter=W.magFilter=h.LinearFilter,W.wrapS=W.wrapT=h.ClampToEdgeWrapping,W.needsUpdate=!0,v.uLip={value:W}}const y=[-27.5,-25.5];for(let s=-24;s<=24;s+=1)y.push(s);y.push(25.5,27.5);const n=[116,108,100,95,92.5],u=(s,o,m)=>{for(const x of[.3,0,-.25,-.5,-.75,-1])n.push(s+x*o);for(const x of m)n.push(s-o-x)};u(fe+.65,1,[.8,2.2,4.5,7.5]);for(let s=78;s>-80;s-=6)n.push(s);n.push(-82.5,-85,-87.5,-89.3);for(let s=0;s<ce;s++)u(he-ke*s-.35,ut,[.5,1.6,3.2,5.4,8,10.6,12.6,13.7]);u(Y-.35,1,[1,2.5,5,9,14,20,28,36]);const q=y.length,k=n.length,E=new Float32Array(q*k*3),T=new Float32Array(q*k),P=(s,o)=>{let m=(1-$(-194,-187.5,o))*$(-196.1,-195.3,o),x=9,W=1;for(let a=0;a<ce&&m<=0;a++){const d=he-ke*a;o<d+5&&o>d-.9&&(m=(1-$(d+.6,d+5,o))*$(d-.8,d-.3,o)*$(3,8,Math.abs(s)),x=a,W=.6)}return m>0?m*W*(.6*Math.max(0,t.noise.n2(s*.55+31+x*13.7,2.7+x))+.25*Math.max(0,t.noise.n2(s*1.7+3+x*5.1,9.1))):0};for(let s=0;s<k;s++){(s&31)===31&&await b.yield();for(let o=0;o<q;o++){const m=y[o],x=t.zOf(m,n[s]),W=s*q+o,a=t.znOf(m,x);E[W*3]=m,E[W*3+1]=t.waterY(a)+P(m,a),E[W*3+2]=x,T[W]=a}}const c=[];for(let s=0;s<k-1;s++)for(let o=0;o<q-1;o++){const m=s*q+o,x=m+1,W=m+q,a=W+1;c.push(m,x,W,x,a,W)}const f=new h.BufferGeometry;f.setAttribute("position",new h.BufferAttribute(E,3)),f.setAttribute("aZn",new h.BufferAttribute(T,1)),f.setIndex(c),f.computeBoundingSphere();const e=new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...v},fog:!0,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,vertexShader:`
varying vec3 vL; varying vec3 vW; attribute float aZn; varying float vZn;
#include <fog_pars_vertex>
void main(){ vL = position; vZn = aZn; vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz;
  vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
varying vec3 vL; varying vec3 vW; varying float vZn;
uniform sampler2D uMask; uniform vec4 uMaskRect;
uniform vec3 uSunDir, uSun, uSky, cDeep, cHaze, cZen; uniform float uReflCap, uGlint, uWhite, uMirror; uniform vec4 uStack, uPeri;
${Ve}${Xe}${et}${Et}
${Rt}${Ct}
#include <fog_pars_fragment>
void main(){
  vec4 M = texture2D(uMask, (vL.xz - uMaskRect.xy)*uMaskRect.zw);
  float depth = M.a*2.55, weed = clamp(M.g*2. - 1., 0., 1.);
  vec2 p = vL.xz; float flow = uTime*2.2, cl = fcrCloud(vW.xz);
  vec3 Vv = cameraPosition - vW; float dist = length(Vv); vec3 V = Vv/max(dist, 1e-3);
  float farF = smoothstep(14., 42., dist), nearE = smoothstep(17., 6., dist), nearC = smoothstep(30., 9., dist);   // fine foam detail is for the near water: far off it would only be pixel noise
  // WHERE ON THE STAIRCASE, per pixel. Lips stand at zn = 90 (the ledge, 6 m), -90 - 15k for k = 0..6 (1.7 m) and -195 (the last
  // fall, 6 m). The coordinate is roughened first, so no lip, sheet or foam edge follows a polygon.
  float rag = vn(vec2(p.x*2.1, p.y*1.3 + flow*.6))*.6 + vn(vec2(p.x*5.3 + 4., p.y*2.9 + flow))*.4;
  float rag2 = vn(vec2(p.x*.83 + 7., p.y*.4 + 3.));
  float zc = vZn + ((rag - .5)*.55 + (rag2 - .5)*.8)*(1. + 1.3*smoothstep(-186., -192., vZn));   // (the last fall tears widest)
  float si = clamp(floor((-90. - zc)/15.), -1., 7.);                     // the lip last passed: -1 the ledge, 0..6 the steps, 7 the last fall
  float lipUp = si < -.5 ? 91. : -90. - 15.*si, lipDn = si > 6.5 ? -999. : -90. - 15.*(si + 1.);   // (the ledge's sheet starts a metre early)
  float bigU = (si < -.5 || si > 6.5) ? 1. : 0.;
  if (zc > 91.) { lipUp = 999.; lipDn = 91.; bigU = 0.; }
  float below = lipUp - zc, ahead = zc - lipDn, onSteps = smoothstep(-86., -91., vZn);
  float faceW = mix(.6, 1., bigU), tf = (below - .35 - faceW*.5)/(faceW*.5 + .42);
  float fall = max(1. - tf*tf, 0.); fall *= fall;                         // the falling sheet
  fall *= smoothstep(.1, .3, lipUp - vZn);                                // (it starts where the surface itself goes over: the roughened lip may tear it lower, never paint it on the flat tread above)
  float footLen = bigU > .5 ? (si < -.5 ? 9. : 11.) : 6.5;
  float ft = below > .35 + faceW ? (below - .35 - faceW)/footLen : 3.;    // 0 at the foot of the fall, 1 a boil-band further on
  float crest = max(smoothstep(2.1, .1, ahead)*step(-900., lipDn), smoothstep(.55, .0, below))*mix(.55, 1., onSteps);   // the water whitens as it gathers speed for the edge
  float nearT = onSteps*smoothstep(30., 9., dist);
  float lineK = mix(1., .82 + .18*smoothstep(1.5, 6., abs(p.x)), onSteps);
  float ftb = ft*mix(1.5, 1., bigU);                                      // (a 1.7 m step boils for two metres, a 6 m fall for five)
  // THE TREADS (the same sums as the bed and the frond planting): b metres below the lip above, the basin's ragged end, the runnels
  float inS = step(vZn, -90.)*step(-195., vZn), kS = floor((-90. - vZn)/15.), bS = -90. - 15.*kS - vZn;
  float bEnd = fcrBasinEnd(p), eN = fcrEdge(p), laneS = fcrLane(p), sT = clamp((bS - bEnd)/(15. - bEnd), 0., 1.);
  float boil = smoothstep(0., .07, ftb)*smoothstep(.5, .1, ftb);         // broken white at the foot of each fall ...
  float lace = smoothstep(.04, .3, ft)*smoothstep(mix(1.45, 1.35, bigU), .3, ft)*mix(.6, 1., bigU);   // ... trailing down the tread in torn flecks, for metres below a pour
  float spt = fcrSpout(p, bS), crd = fcrCord(p, bS);                       // a spout (the heart of a white cord) pours over the lip above this point
  lace *= mix(1., smoothstep(bEnd + 4.6, bEnd - .6, bS)*(.1 + .9*crd), inS);   // (on a step: below the white stretches of its lip, drifting on past the pocket and thinning)
  float laneD = laneS - fcrLaneThr(sT) + eN*.05 + uWhite*.08;
  float runl = inS*step(.9, bS)*smoothstep(-.07, .05, laneD)*smoothstep(bEnd - .2, bEnd + 1.6, bS);   // a runnel: a thread of clear water between the red ribbons, widening to the next lip
  float foot = max(boil, lace*.4);
  float basin = smoothstep(.0, .1, ft)*smoothstep(1.05, .3, ft)*(1. - bigU);            // the plunge basin under every step ...
  basin = mix(basin, smoothstep(.85, 1.25, bS)*(1. - smoothstep(-.12, .12, bS - bEnd + eN*.5))*spt, inS);   // ... a short pool with a torn edge, clear to its floor
  float riffle = smoothstep(.12, .04, depth)*smoothstep(0., .03, depth)*(1. - .85*nearT)*(1. - crest);
  vec2 g = fcrRip(p)*.045 + .1*vec2(vn(vec2(p.x*2.6, p.y*1.7 + uTime*1.6)) - .5, vn(vec2(p.x*1.3 + 9., p.y*1.1 + uTime*2.1)) - .5);
  g += .14*vec2(vn(p*5. + vec2(0., flow*2.)) - .5, vn(p*5.3 + vec2(7., flow*2.3)) - .5)*(riffle + foot*2. + crest + uWhite)*(1. - .75*farF);
  g *= (1. + 1.0*smoothstep(.4, 1., depth))/(1. + dist*.01);
  vec3 N = normalize(vec3(-g.x, 1., -g.y));
  float nv = max(dot(N, V), 0.), f1 = 1. - nv, fres = min(.02 + .98*f1*f1*f1*f1*f1, uReflCap)*(1. - .75*fall);
  float still = smoothstep(.55, 1.5, depth)*(1. - fall)*(1. - foot);
  float slick = clamp(1. - abs(M.g*2. - 1.)*2.2, 0., 1.)*smoothstep(.015, .09, depth)*(1. - fall)*(1. - foot)*(1. - .55*onSteps);
  float sdfW = M.b*6. - 2.; slick *= smoothstep(.55, 1.1, sdfW);           // (never the lip of a well: it stays a ring of dark rock)
  vec2 tc = Vv.xz/max(length(Vv.xz), 1e-3);
  float sdfN = texture2D(uMask, (vL.xz + tc*.8 - uMaskRect.xy)*uMaskRect.zw).b*6. - 2.;
  // a well mirrors the sky from a hand inside its rim (the lip stays a ring of dark rock), and only on its far side: on the side
  // nearest the eye we look down into it, blue-violet. (sdfN - sdfW = how the rim distance changes toward the eye: +1 near side, -1 far)
  float inW = step(sdfW, .0), nearSide = smoothstep(-.95, .45, (sdfN - sdfW)/.8), rimIn = smoothstep(-.06, -.38, sdfW);
  float lowRock = slick*min(uMirror*2.4, 1.);                              // bare rock under a film at a low sun: seen crisp through the water, joints and all, never a veil of sky
  fres *= 1. - .7*lowRock;
  fres = max(fres, uMirror*max(mix(still, rimIn*mix(1.8, .16, nearSide), inW), .06*slick*(.55 + .9*f1)));   // low sun: the wells, the channel and the bare wet rock lie as mirrors of the sky
  fres = max(fres, max(min(uMirror*2.2, .75), .3*inS)*basin*(1. - .7*boil)*(1. - fall));   // ... and so does the basin under every step of the staircase (by day a clear glass with the sky in it)
  fres *= 1. - .5*inW*(1. - min(uMirror*2.4, 1.));                          // (by day a well is looked INTO: half the sky's veil is taken off it)
  fres = max(fres, .3*inW*rimIn*smoothstep(.75, .1, nearSide)*(1. - min(uMirror*2.4, 1.)));   // (... and on its far side, from a hand inside the rim, the sky lies on it: a pale crescent across the hole from the eye)
  vec3 R = reflect(-V, N); R.y = abs(R.y);
  vec3 sky = mix(cHaze, cZen, smoothstep(0., .4, R.y));
  sky = mix(sky, cHaze*1.08, uMirror*smoothstep(.3, .75, vn(R.xz*2.6 + p*.03 + uTime*.01))*.8);   // cloud in the mirror
  sky *= mix(vec3(1.), vec3(1.16, .84, .88), min(uMirror*2., 1.));           // (a low sky lies rose in still water)
  sky = mix(sky, cHaze*mix(vec3(1.51, .76, .55), vec3(1.5, .96, .4), smoothstep(.4, .3, uMirror)), min(uMirror*3.2, .9)*basin*(.42 + .58*smoothstep(.25, .7, vn(p*.3 + uTime*.03))));   // (the basins hold the lit cloud of a low sky: gold at the golden hour, rose-gold at dawn)
  float lowB = min(uMirror*3., 1.)*basin;                                    // (a low sky in a pocket: deepening to violet toward the lip above, the tread's dark reflection along its far edge)
  sky *= mix(vec3(1.), vec3(.6, .5, .74), lowB*smoothstep(bEnd*.8, 1.2, bS))*(1. - .55*lowB*smoothstep(bEnd - 1.3, bEnd - .1, bS + eN*.5));
  sky = mix(sky, cHaze*vec3(1.2, .5, .6), inW*smoothstep(1., .35, nearSide)*min(uMirror*2., 1.));   // the far edge of a well holds the low rose sky itself
  // the sun's road: a broad lobe broken into small travelling sparkles, never a sheet of white
  float sd = max(dot(R, uSunDir), 0.), road = pow(sd, 36.);
  float spk = smoothstep(.8, .96, vn(p*24. + uTime*vec2(1.3, 3.1)))*smoothstep(.4, .85, vn(p*6. - uTime*vec2(.5, 1.7)));
  float glint = (road*spk*1.6 + pow(sd, 700.)*.6)*uGlint*cl;
  float deepA = (1. - exp(-max(depth - .35, 0.)*.9))*.6;
  deepA *= mix(1., .2, inW*smoothstep(190., 80., dist)*(1. - min(uMirror*2.4, 1.)));   // (by day we look down into a well: its lit wall, its floor, its fish, from the ledge on; at a low sun it keeps its own blue-violet)
  deepA *= 1. - .64*inW*clamp(1. - M.g*2., 0., 1.)*(1. - min(uMirror*2.4, 1.));       // (a sandy well is glass down to its yellow floor from any distance; the deep ones stay blue)
  deepA = max(deepA, max(basin*.5, runl*.4*(1. - fall)));                    // a blue plunge pocket under every spout, a blue thread down every runnel
  // foam: long streamlines riding the current, sparkle on the riffles, cords over the lips and down the falls, boil at their feet
  // FOAM LINES: thin soft threads of foam drawn out along the streamlines, wandering, braiding, broken along their length, racing
  // down with the current (the same noise as before, stretched ten to one along the flow)
  vec2 fp = vec2(p.x, p.y + flow*1.5);
  float raft = smoothstep(.5, .8, vn(fp*vec2(.5, .1) + 3.));
  float flw = .03 + dist*.006;
  float fleck = smoothstep(flw, 0., abs(vn(vec2(fp.x*3.1 + 1.3*vn(fp*vec2(.8, .2) + 7.), fp.y*.5)) - .5))*smoothstep(.34, .64, vn(fp*vec2(2.1, 1.4) + 5.));
  float lines = raft*(fleck*smoothstep(30., 8., dist) + .08*smoothstep(10., 26., dist)*smoothstep(110., 50., dist));
  float foam = lines*.38*(1. - .5*nearT)*(1. - .7*basin)*(1. - .6*smoothstep(8., 2., dist)) + riffle*smoothstep(.68, .9, vn(vec2(p.x*6., (p.y + flow*1.4)*3.2)))*.5*(1. - .85*farF);
  // which stretches of a lip run white: cords a metre or two wide with ribbons of red between them, different on every lip
  float lk = si + (ahead < below ? 1. : 0.);                              // the nearest lip
  float cx = vn(vec2(p.x*.85 + lk*7.31, lk*3.7 + 5.))*.6 + vn(vec2(p.x*2.6 + lk*3.1, 9.))*.4;
  float cord = smoothstep(.4, .58, cx + (.5 - weed)*.16 + uWhite*.4);
  cord = mix(cord, smoothstep(-.1, .08, laneS - ${Ce.toFixed(2)} + eN*.06 + uWhite*.1), smoothstep(-86., -88., vZn)*smoothstep(-198., -195.5, zc));   // (down the staircase a lip runs white where the tread's runnels reach it)
  float sy = vW.y*1.4 + uTime*6., sxw = p.x + .13*sin(sy*.8 + 3.*vn(vec2(p.x*1.3, sy*.2)));   // (the streaks of a falling sheet waver and braid: never a comb of ruled lines)
  float streak = vn(vec2(sxw*4.2, sy*.45))*.5 + vn(vec2(sxw*9.5 + 3., sy*.9))*.3 + mix(vn(vec2(sxw*21., sy*1.7)), .5, farF)*.2;
  // (passing under the eye a fall is glass with threads of white in it, and its lip a torn lace: never a white facet of the mesh)
  streak = mix(streak, vn(vec2(sxw*13., sy*.7))*.5 + vn(vec2(sxw*29. + 3., sy*1.3))*.5, smoothstep(10., 3.5, dist)*.8);   // (threads a finger wide there)
  foam += fall*mix(.1, 1., cord)*smoothstep(.3 + .1*nearE, .68 + .12*nearE, streak*.6 + cord*.5);     // white cords, the red bed between them
  float cs = vn(vec2(p.x*6.5, (p.y + flow*2.6)*2.2))*.55 + mix(vn(vec2(p.x*15., (p.y + flow*3.4)*5.)), .5, farF)*.45;
  foam += crest*cord*smoothstep(.62 - .5*crest + .22*nearC, .95 - .45*crest + .18*nearC, cs + .25*crest)*(1. - fall);  // the cords begin on the tread, torn at first
  float nb = vn(p*1.3 + vec2(0., flow*1.2))*.6 + vn(p*3.1 + vec2(3., flow*1.7))*.4;
  foam += boil*lineK*mix(1., .15 + .85*crd, inS)*smoothstep(.52 - boil*.14 + .1*inS, .84 - boil*.1 + .1*inS, nb + cord*mix(.12, .36, inS))*.9;   // (on the steps: thick under a spout, a thin lace between)
  float ls = vn(vec2(p.x*2.8 + .8*vn(p*.7), (p.y + flow*1.6)*1.1))*.55 + mix(vn(vec2(p.x*7.5, (p.y + flow*2.)*2.6)), .5, farF)*.45;
  foam += lace*(1. - .4*nearT)*(1. - .6*farF)*(1. - min(uMirror*2.6, .7)*basin)*smoothstep(.56 - lace*.1, .8, ls + cord*.1)
    *(.45 + .5*mix(vn(p*vec2(17., 3.5) + vec2(0., flow*4.)), .5, farF))*mix(.7, 1., bigU);   // streaks drawn out down the current, strongest below the cords, broken into flecks only near the eye
  foam += smoothstep(.035, .0, depth)*smoothstep(.3, .7, vn(p*3. + uTime*.4))*.35;      // lace at the shore and round rocks
  // on a step the white of the foot trails out across the basin in streaks drawn along the current, thick under a spout, and the
  // lip itself is a torn edge of white: seen from upstream, over the lip, these two are the fall
  float apr = inS*crd*smoothstep(.9, 1.5, bS)*(1. - smoothstep(bEnd - .6, bEnd + .9, bS + eN*.6));
  float aps = vn(vec2(p.x*2.6 + 1.2*vn(p*.6 + 5.), (p.y + flow*1.3)*.5))*.55 + mix(vn(vec2(p.x*6.5 + 2. + 1.5*vn(p*1.3 + 8.), (p.y + flow*1.7)*1.2)), .5, farF)*.45;
  float apt = mix(.42, .76, smoothstep(1., bEnd, bS)) - .3*cord;
  foam += apr*smoothstep(apt, apt + .32, aps)*.9;
  foam += inS*(.06 + .94*cord)*smoothstep(1.1, .05, 15. - bS + eN*.3)*smoothstep(.48 - .3*cord, .84 - .28*cord, cs)*.8*(1. - fall);   // (white at the lip where a cord goes over, a broken line: never a white strip along the whole edge)
  // THE PLUNGE POOL: clear water. Where the last fall lands the froth breaks into RAFTS, soft bodies of foam a metre or two across
  // with clear water between them; they drift out from the fall, fan apart and thin away, so that half
  // way to the ring the pool is glass with the bed under it. (round 27: a soft lace of threads lies round them: pnet, below.)
  float pool = step(6.5, si)*smoothstep(1.6, 6., below);
  vec2 lp = p + vec2(0., uTime*.42), lq = lp + 1.4*vec2(vn(lp*.21 + 3.), vn(lp*.21 + 9.));
  float thinP = smoothstep(4., 27., below);                                                 // fewer and smaller with every metre from the fall
  // (round 27) the rafts are the falls' own cream (GL_CREAM: bodies a stride across, as round as long, no edge to them) and
  // round them the same lace as at a step's foot: threads closing round cells of clear water, soft, wandering, thinning away
  vec2 qp = vec2(lq.x*.5, lq.y*2.), fqp = fwidth(qp);
  float Pp = fcrCream(qp, fqp), Sp = (.56 - .5*thinP)*smoothstep(34., 20., below);
  float raftP = fcrCreamW(Pp, Sp)*(.8 + .2*gn(lq*4.3 + 2.));
  vec2 qn = lq*vec2(1.5, 1.1) + .4*vec2(gn(lq*.7 + 3.), gn(lq*.7 + 8.));
  float pn1 = gn(qn + 11.), pn2 = gn(qn*2.1 + 4.), pf1 = fwidth(pn1)*1.3, pf2 = fwidth(pn2)*1.3;
  float pnet = max((1. - smoothstep(0., .075 + pf1, abs(pn1 - .5)))*.075/(.075 + pf1), .8*(1. - smoothstep(0., .1 + pf2, abs(pn2 - .5)))*.1/(.1 + pf2));
  foam += pool*max(raftP, pnet*.8*smoothstep(.02, .3, Sp + (Pp - .5)*.3)*mix(smoothstep(.42, .66, gn(lq*.3 + 20.)), 1., smoothstep(.36, .56, Sp)))*.9;   // (the lace lies round the fall and, further out, in drifting patches: half way to the ring the pool is glass)
  // the island in the pool (uStack: x, z, half-length across the river, half-width along it): the outflow piles a white pillow
  // against its up-river face, lace gathers round its foot and rings run out from it
  vec2 sq = (p - uStack.xy)/max(uStack.zw, vec2(.2)); float sdk = (length(sq) - 1.)*min(uStack.z, uStack.w), sOn = step(.25, uStack.z);
  float ring = smoothstep(.24, .02, abs(fract(sdk*.62 - uTime*.33) - .5))*smoothstep(5., .6, sdk)*smoothstep(-.4, .2, sdk);
  float upF = smoothstep(-.3, .8, sq.y/max(length(sq), .05));                                // 1 on the face the current meets
  foam += sOn*(ring*.32*(.45 + .55*vn(p*1.9 + uTime*.3)) + smoothstep(.75 + .9*upF, .0, abs(sdk - .1))*(.5 + .45*upF)*smoothstep(.25 - .2*upF, .7, vn(p*2.6 + uTime*vec2(.5, .9))));
  foam = clamp(foam, 0., 1.);
  // right under the eye foam is lace with the bed showing through it, never a flat white sheet
  vec2 pe = vec2(p.x, p.y - vL.y*1.3);                                       // (height counts too: down a fall's face the pattern must not stretch)
  float thinA = vn(pe*vec2(9., 5.) + vec2(0., flow*3.))*.6 + vn(pe*vec2(21., 11.) + vec2(4., flow*5.))*.4;
  float nr2 = smoothstep(8., 3., dist);                                         // (on the steps: threads a hand wide, running with the water; a finger wide right under the eye)
  float thinB = vn(vec2(pe.x*6.5 + 1.5*vn(pe*vec2(1.2, .5)), pe.y*1.2 + flow*3.))*(.6 - .3*nr2) + vn(vec2(pe.x*15. + 2.*vn(pe*vec2(2.3, .9) + 3.), pe.y*2.4 + flow*5.))*.4
    + vn(vec2(pe.x*33. + 2.5*vn(pe*vec2(5., 1.7) + 6.), pe.y*4.5 + flow*7.))*.3*nr2;
  foam *= 1. - smoothstep(15., 5., dist)*(.26 + .62*smoothstep(.64, .3, mix(thinA, thinB, onSteps)));
  // THE THREADS: where a tread's runnels gather, threads of white water race toward the lip: a few, a hand wide and broken, high on
  // the tread; braiding and thickening as the runnel opens (fcrLaneThr); a spout at the lip. Soft-edged, wavering, never ruled;
  // drawn after the thinning above so they stay crisp under the eye.
  float tcord = runl*(1. - fall)*smoothstep(.62, .45, depth);
  vec2 cq = vec2(p.x + .2*sin(p.y*1.3 + 2.4*vn(p*.7 + 3.)), p.y + flow*2.4);
  float fil = vn(vec2(cq.x*5.5 + 1.7*vn(cq*vec2(1.1, .45)), cq.y*.6))*.6 + mix(vn(vec2(cq.x*13. + 2.6*vn(cq*vec2(2.1, .8) + 4.), cq.y*1.4 + 5.)), .5, farF)*.4;
  tcord *= mix(.25 + .75*smoothstep(.36, .58, vn(vec2(p.x*.9 + 3., (p.y + flow*.3)*.3))), 1., smoothstep(.7, 1., sT));   // (broken along its length, whole only where it nears the lip)
  float wK = tcord*(.45 + .55*smoothstep(.25, 1., sT));                       // the white gathers toward the lip
  // (right under the eye a spout is a sheaf of finger-wide threads with the bed between them, never a clot of white)
  fil = mix(fil, fil*.5 + .5*vn(vec2(cq.x*24. + 2.2*vn(cq*vec2(4., 1.4) + 2.), cq.y*2.6 + 1.)), nr2);
  // (round 27) the threads are the cream of the falls (GL_CREAM): long soft streaks on the runnel's water, gathering to a
  // veil at the lip; the old field (fil) keeps a tenth of a say in where they lie
  vec2 cqs = cq*vec2(2.2, 1.), fcq = fwidth(cqs);
  float Pt = fcrCream(cqs, fcq) + (fil - .5)*.1 + (fcrGrain(cqs*vec2(1.6, 1.), fcq*vec2(1.6, 1.)) - .5)*.24, St = wK*.46 + .06*clamp(laneD*4., 0., 1.)*tcord;
  foam = max(foam, tcord*fcrCreamW(Pt, St)*(.55 + .45*smoothstep(.2, .9, sT)));
  // (round 19) on the run up to each lip of the staircase, live's crest (the last 2.1 m), the white is the strands of the falls' own
  // mesh, which run on over the lip and down the fall: the sheet's own foam hands over to them there (not at the shore's lace)
  foam *= 1. - smoothstep(2.1, 1.3, 15. - bS)*step(vZn, -87.9)*step(-195., vZn)*smoothstep(.035, .1, depth)*fcrLip(p.x, kS + 1.);
  float lipSh = inS*max(smoothstep(1.2, .15, 15. - bS), smoothstep(.5, .0, bS))*(.35 + .65*vn(vec2(p.x*1.7 + kS*5., 2.)))*(1. - foam);   // the water bends over the lip: a band of sky in the glass
  float shore = smoothstep(0., .03, depth);
  vec3 lit = uSun*cl + uSky;
  float lane = .78 + .42*vn(vec2(p.x*1.5 + 1.5*vn(p*.6), (p.y + flow)*.8));
  vec3 col = sky*fres + cDeep*lit*.6*lane*deepA*(1. + .8*max(basin, runl*.8))*(1. - fres);
  float a = 1. - (1. - fres)*(1. - deepA);
  // THE SURFACE ITSELF: wavelets tip the sky toward the eye in travelling slivers of light, so the weed is seen THROUGH water.
  // None straight down under the eye; far off they merge into an even sheen.
  vec2 rq = vec2(p.x*.8 + .6*vn(p*.35 + 2.), (p.y + flow*.55)*2.4);
  float rw = vn(rq)*.6 + vn(rq*2.3 + 7.)*.4;
  float ripS = mix(smoothstep(.6, .78, rw), .2, smoothstep(13., 38., dist))*f1*f1*smoothstep(1.6, 5., dist)*(1. - .6*inS)*(1. - fall)*(1. - .7*inW)*(1. - .85*lowRock);
  col += sky*ripS*.5*(1. - fres); a = min(a + ripS*.45, 1.);
  // rings run out over the well where the pair came up (uPeri: x, z, radius, how far they are out)
  float pd = length(p - uPeri.xy), prs = uPeri.w*smoothstep(uPeri.z*1.04, uPeri.z*.8, pd)*smoothstep(.3, .9, pd)*smoothstep(.5, .95, sin(pd*6.5 - uTime*4.6)*.5 + .5)*(.55 + .45*vn(p*2.3 + uTime*.3));
  col += sky*prs*.6*(1. - fres); a = min(a + prs*.5, 1.);
  // every well laps: faint rings run in from its rim, the sky tipped toward the eye on each
  float wring = inW*smoothstep(.5, .93, sin(sdfW*8.5 + uTime*2.3)*.5 + .5)*smoothstep(-1.5, -.15, sdfW)*(.35 + .65*vn(p*1.7 + uTime*.2))*smoothstep(60., 14., dist);
  col += sky*wring*.2*(1. - fres); a = min(a + wring*.22, 1.);
  float bnet = min(fcrCaus(p*.62 + 3.) + 1.1*fcrNet(p*.8 + 2.)*smoothstep(16., 5., dist), 1.7)*max(basin, runl*.6)*smoothstep(46., 5., dist)*(1. - fres);       // a basin is clear blue water with the light's net in it, not a dark blot
  bnet *= 1. - min(uMirror*3., 1.);                                          // (not when the basin is a mirror of the low sky)
  col += vec3(.3, .58, .9)*lit*.26*bnet; a = min(a + bnet*.2, 1.);
  col += sky*lipSh*.24; a = min(a + lipSh*.22, 1.);
  float aer = apr*smoothstep(bEnd + .3, 1.2, bS)*(.55 + .45*cord)*(1. - min(uMirror*2.6, .8));
  col = mix(col, vec3(.3, .7, .76)*lit*.46, aer*.6); a = mix(a, 1., aer*.55);      // under a fall the basin is aerated, pale turquoise, clearing to blue
  float aerP = pool*smoothstep(15., 3., below)*(.45 + .55*smoothstep(.3, .7, vn(lq*.5 + 7.)))*(1. - min(uMirror*2.6, .7));
  col = mix(col, vec3(.3, .72, .78)*lit*.5, aerP*.55); a = mix(a, 1., aerP*.5);     // ... and so is the pool where the last fall lands: milk-turquoise, clearing to glass
  // white water has a body: on the staircase it is modelled by the sun at three scales, GENTLY (round 27: the side toward the sun a
  // little brighter, the lee a tint of the sky; no clot has two colours), and thin foam is pale turquoise
  vec2 so = normalize(uSunDir.xz + vec2(1e-4, 0.))*.38, q1 = pe*vec2(1.6, 1.1) + vec2(0., flow*1.1), q2 = pe*vec2(4.3, 3.) + vec2(5., flow*2.), q3 = pe*vec2(11., 7.5) + vec2(9., flow*3.4);
  float relief = (vn(q1) - vn(q1 + so))*.5 + (vn(q2) - vn(q2 + so))*.3 + mix(vn(q3) - vn(q3 + so), 0., farF)*.2;
  float onB = onSteps*smoothstep(90., 30., dist), body = clamp(1. + 1.2*relief, .6, 1.2);
  vec3 fc = mix(vec3(.86, .9, .93), vec3(.9, .925, .93), onSteps)*lit*mix(.82, .68 + .16*body, onB);
  fc = mix(fc, vec3(.62, .76, .9)*(uSky*2.2 + uSun*cl*.3), onB*smoothstep(1., .6, body)*.2);
  fc = mix(vec3(.4, .7, .78)*lit*.5, fc, mix(1., smoothstep(.12, .6, foam), onSteps));
  col = mix(col, fc, foam); a = mix(a, 1., foam*.92);
  col += uSun*glint*4.5; a = min(a + glint, 1.);
  col *= shore; a *= shore;
  // (round 19) the seven falls of the staircase and the last fall, lip to foot, are drawn by the falls' own mesh (fcr-falls): on
  // their ground this sheet draws nothing (its painted sheet on the face, its foot and its pocket there are replaced, not retuned)
  { float fo = max(fcrFallsOwn(bS, spt, bEnd, eN, step(vZn, -195.))*step(vZn, -90.)*step(-210., vZn), smoothstep(14.8, 15., bS)*step(vZn, -89.)*step(-195., vZn))*fcrLip(p.x, kS + step(10., bS)); col *= 1. - fo; a *= 1. - fo; }   // (round 22: where the lip above, or the lip just ahead, is given water at this x)
  // (a riser to whose lip no water comes at this x is dry rock: the sheet paints no fall on it, though the mask marks the tread
  // below it wet right up to its foot. The sheet takes up again, softly, where the face reaches the level below)
  { float fw = mix(.6, 1., step(vZn, -195.)), dF = step(vZn, -90.)*step(-200., vZn)*(1. - fcrLip(p.x, kS))*smoothstep(.1, .3, bS)*(1. - smoothstep(fw + .4, fw + .8, bS)); col *= 1. - dF; a *= 1. - dF; }
  ${Ot}
  gl_FragColor = vec4(col, a);
}`}),l=new h.Mesh(f,e);return l.renderOrder=3,l.name="fcr-water",await b.yield(),l.add(await io(t,v,P,y,z,256,b)),await b.yield(),l}async function io(t,v,b,p,z,y,n){const k=Math.sqrt(9.81*(At+t.flood)),E=2.1,T=8*Math.PI/180,P=1,c=.1,f=(d,A)=>{let w=0;for(;w<p.length-2&&p[w+1]<=d;)w++;const F=j((d-p[w])/(p[w+1]-p[w]),0,1);return ye(b(p[w],A),b(p[w+1],A),F)},e=[],l=[],s=[],o=[];for(let d=0;d<=ce;d++){const A=d===ce,w=A?Y:he-ke*d,F=t.waterY(w+1),H=t.waterY(w-5),V=(A?Ft:wt)+.3,R=[5.5,7.65];let G=1/0,U=-1/0;for(let I=0;I<y;I++)if(z[d*y+I]>0){const oe=Me+(I+.5)*(Je-Me)/y;G=Math.min(G,oe-.5),U=Math.max(U,oe+.5)}if(!(U>G))continue;const K=I=>t.zOf(I,w-.35),D=[G];let N=K(G),B=null,ue=0,de=0;for(let I=G+c;I<U-c*.5;I+=c){const oe=K(I),_=Math.atan2(oe-N,c);B!==null&&(ue+=Math.abs(_-B)),B=_,de+=Math.hypot(c,oe-N),N=oe,(ue>=T||de>=P)&&(D.push(I),ue=0,de=0)}D.length%2===1&&D.push((D[D.length-1]+U)/2),D.push(U);const se=A?[30,60,76]:[30,60],ee=se.length,Te=ee+6,Qe=e.length/3,Be=D.length,Se=(I,oe,_,re,be,te,ge)=>{const ve=t.zOf(I,w-_);if(ge)l.push(0,1,0);else{const Ne=(t.zOf(I+.1,w-_)-t.zOf(I-.1,w-_))/.2,Ie=Math.hypot(Ne*re,1,re);l.push(Ne*re/Ie,1/Ie,-re/Ie)}e.push(I,oe,ve),s.push(_,be,te,d)};for(let I=0;I<Be;I++){const oe=D[I],_=F+f(oe,w-.35),re=Math.sqrt(2*(_-H)/9.81),be=.35+k*re;Se(oe,F+f(oe,w+E),-E,0,-(E+.35)/k,0,!0);for(const te of se){const ge=Math.tan(te*Math.PI/180),ve=Math.min(k*ge/9.81,re*.9);Se(oe,_-.5*9.81*ve*ve,.35+k*ve,9.81*ve/k,ve,0,!1)}Se(oe,H,be,9.81*re/k,re,0,!1),Se(oe,H,be,0,re,0,!0),Se(oe,H,V,0,re,V-be,!0);for(const te of R)Se(oe,H,te,0,re,te-be,!0)}await n.yield();const X=(I,oe)=>Qe+I*Te+oe,Ke=[],Re=[];o.push([Ke,Re]);for(let I=0;I<Be-2;I+=2){const oe=I+1,_=I+2;Re.push(X(I,0),X(_,0),X(oe,1),X(I,0),X(oe,1),X(I,1),X(_,0),X(_,1),X(oe,1)),Ke.push(X(I,1),X(oe,1),X(I,2),X(oe,1),X(_,2),X(I,2),X(oe,1),X(_,1),X(_,2));const re=te=>Ke.push(X(I,te),X(_,te),X(I,te+1),X(_,te),X(_,te+1),X(I,te+1));for(let te=2;te<=ee;te++)re(te);if(re(ee+2),A)continue;let be=!1;for(let te=D[I]-.3;te<=D[_]+.3&&!be;te+=.15)for(const ge of[1,3,5,7])if(rt(te,t.zOf(te,w-ge)+ge)>vt-.3){be=!0;break}be&&(re(ee+3),re(ee+4))}await n.yield()}const m=new h.BufferGeometry;m.setAttribute("position",new h.Float32BufferAttribute(e,3)),m.setAttribute("normal",new h.Float32BufferAttribute(l,3)),m.setAttribute("aF",new h.Float32BufferAttribute(s,4));const x=[];for(let d=o.length-1;d>=0;d--)for(const A of o[d])for(let w=0;w<A.length;w++)x.push(A[w]);m.setIndex(x),m.computeBoundingSphere();const W=new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...v},fog:!0,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,vertexShader:`
attribute vec4 aF; varying vec3 vL; varying vec3 vW; varying vec3 vN; varying vec4 vF;
#include <fog_pars_vertex>
void main(){ vL = position; vF = aF; vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; vN = normalize(mat3(modelMatrix)*normal);
  vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
varying vec3 vL; varying vec3 vW; varying vec3 vN; varying vec4 vF;
uniform sampler2D uMask; uniform vec4 uMaskRect;
uniform vec3 uSunDir, uSun, uSky, cDeep, cHaze, cZen; uniform float uWhite, uMirror;
${Ve}${Xe}${et}${Et}${Rt}${Ct}
#include <fog_pars_fragment>
// THE BODY OF A FOAM: heaps of 0.8 m, 0.3 m and 0.14 m, as round as long (q in metres)
float fcrHeap(vec2 q){ return gn(q*1.3 + 2.)*.55 + gn(q*3.1 + 7.)*.3 + gn(q*7.3)*.15; }
void main(){
  vec2 p = vL.xz; float b = vF.x, tF = vF.y, sF = vF.z, big = step(6.5, vF.w), flow = uTime*2.2, cl = fcrCloud(vW.xz);   // (flow: live's own current, 2.2 m/s)
  // (round 22) level water (the run up, the foot) is where the mask is wet; the falling sheet is not cut by what lies under it; all of it only where its lip is given water at this x
  // (round 27: from a forearm short of the rock's lip the hand-over to "not cut" is made, not at the take-off: past the rock's lip the
  // mask's texels are the face's and the foot's, and cut the tongue in squares)
  float shore = mix(smoothstep(0., .03, texture2D(uMask, (p - uMaskRect.xy)*uMaskRect.zw).a*2.55), 1., smoothstep(-.35, -.1, b)*(1. - smoothstep(0., .15, sF)))*fcrLip(p.x, vF.w);
  float bEnd = fcrBasinEnd(p), eN = fcrEdge(p), spt = fcrSpout(p, b)*(1. - big);
  float own = fcrFallsOwn(b, spt, bEnd, eN, big)*shore, laneL = fcrLane(vec2(p.x, p.y + b));
  float ft = smoothstep(0., .15, sF);                                      // 0 on the falling sheet, 1 on the foot
  // (the pocket's water does not end at a ruled line: it runs out under the weed either side over a forearm or two, raggedly, the
  // fronds standing in it; the lane sum from TP - .2 to TP + .08)
  float pk = smoothstep(-.2, .08, laneL - ${vt.toFixed(2)} + .1*(vn(p*vec2(2.1, .9) + 3.) - .5))*(1. - smoothstep(-.12, .12, b - bEnd + eN*.5))*ft*(1. - big);
  float apr = (1. - smoothstep(-.2, 0., b))*shore;                          // the run up to the lip: there only the white is the falls' (the glass is the sheet's)
  if (max(max(own, pk*shore), apr) < .003) discard;
  // WHERE THE WHITE IS (live's sums). Below a lip: where the lip runs white (fcrCord's sum at the lip; uWhite as in live's cords).
  // On the run up to it: where the tread's runnel is (the lane sum over fcrLaneThr, which is TS at the lip itself; above the
  // brink, where no runnel is drawn, the brink's own sum), whitening over live's crest, the last 2.1 m.
  float sT = clamp((15. + b - bEnd)/(15. - bEnd), 0., 1.);
  float crdL = mix(laneL - ${Ce.toFixed(2)}, fcrLane(p) - mix(fcrLaneThr(sT), ${Ce.toFixed(2)}, step(vF.w, .5)), step(b, 0.)) + uWhite*.1, crd = smoothstep(-.07, .09, crdL);
  float ramp = smoothstep(-2.1, -.1, b);
  vec3 N = normalize(vN);
  vec2 so = normalize(uSunDir.xz + vec2(1e-4, 0.));
  vec3 lit = uSun*cl + uSky, litW = uSun*cl*max(uSunDir.y, 0.) + uSky;     // (level water takes the sun by its height in the sky)
  vec3 skyC = mix(cHaze, cZen, .6)*mix(vec3(1.), vec3(1.16, .84, .88), min(uMirror*2., 1.));   // the sky that lies in glass (live's rose at a low sun)
  // THE SHEET. It thins as it gains speed (the same water through a faster section: h v0 / v). fine is the share of its body it
  // has given up: none at the lip, three quarters at the foot of a step (5.96 m/s), seven eighths at the last fall's (10.9 m/s).
  float gv = ${9.81.toFixed(2)}*max(tF, 0.), thin = ${k.toFixed(3)}/sqrt(${(k*k).toFixed(3)} + gv*gv), fine = 1. - thin;
  float tau = uTime - tF;                                                  // the moment this water leaves the lip: it keeps it up the tread and down the fall
  // THE WHITE OF A CORD IS FOAM THE WATER CARRIES. It is laid out on the water itself: across the lip in metres (x) and along the
  // run in the metres the water has made at the lip's own speed (mF = v0 tau), so it goes up the tread and down the fall with
  // the water and at the water's speed, and is drawn out as the water gains speed: on the tread long streaks, down the fall
  // veils. (round 27) The field is fcrCream (GL_CREAM): soft bodies, a rim that thins, nothing cut.
  // The streaks swing a hand to either side over a stride or two of their run (0.19 m over 1.4 m and 0.6 m), so they close on
  // one another and part again: braided. (No line here is ruled along the lip or down the fall: every edge is the field's.)
  float mF = tau*${k.toFixed(3)};
  // A VEIL FRAYS AS IT FALLS. At the lip a cord's two sides are where the lane sum puts them; from there down they wander with the
  // water (a field the fall carries: a stride and a forearm across, drawn out down the fall) and the sill between white and glass
  // widens, a hand at the lip to a forearm and more at the foot. Seen face on, no white of a fall has a ruled side.
  { float fray = smoothstep(.02, .5, tF)*step(0., b);
    crd = smoothstep(-.07 - .1*fray, .09 + .16*fray, crdL + ((gn(vec2(p.x*1.9 + 3., mF*.55)) - .5)*.34 + (gn(vec2(p.x*5.3, mF*1.3 + 7.)) - .5)*.16)*fray); }
  vec2 q = vec2(p.x + .25*(vn(vec2(p.x*1.3, mF*.7)) + .5*vn(vec2(p.x*2.9 + 5., mF*1.6)) - .75), mF), fq = fwidth(q);
  float grN = fcrGrain(q, fq), P = fcrCream(q, fq) + (grN - .5)*.2, Ps = fcrCream(q + so*.12, fq) + (grN - .5)*.2;   // (Ps: the same field a hand toward the sun; the grain parts a body into streaks)
  // HOW MUCH OF THE SHEET IS WHITE. In a cord: none where live's crest begins, 2.1 m up the tread, growing to three parts in five at the
  // edge, and falls as veils with as much glass between them (brk). Between cords the
  // water goes over as A TONGUE OF GLASS (below) and the sheet whitens only low down, to a quarter.
  float brk = smoothstep(0., .4, tF);
  // (over the lip itself the cord's water is a tongue: for the last metre of the run and over the bend the white opens into
  // streaks with glass between them, and closes again into the falling veil)
  float lipW = fcrLipW(p.x, vF.w), S = (crd*ramp*mix(.6, .55, brk)*(1. - .4*smoothstep(-1.3, -.2, b)*(1. - smoothstep(0., .35, b))) + (1. - crd)*.25*brk*fine)*lipW;
  float wN = fcrCreamW(P, S);
  // (a body of foam is thin at its rim and thick at its middle: the rim is a veil the water shows through)
  float thk = smoothstep(-.3, .7, fcrCreamD(P, S));
  // WHERE THE SHEET LANDS the boil stands up round its foot: heaps to a sixth of the fall's height (0.3 m of a step's 1.7 m,
  // 1.06 m of the last fall's 6 m; each as wide as it is high and its own height), so the line where the sheet meets the tread
  // is never seen (hA: metres above the landing, by the fall's own law). The heaps' tops are soft over their own height.
  float TL = mix(${Math.sqrt(2*Ye/9.81).toFixed(3)}, ${Math.sqrt(12/9.81).toFixed(3)}, big), hA = ${(9.81/2).toFixed(3)}*max(TL*TL - tF*tF, 0.);
  // (between the white stretches of a lip the sheet is thin glass, but it lands all the same: a low churn runs the whole length
  // of a fall's foot, three parts in five of a cord's, so the dark rock at the riser's base never shows as a line under the sheet)
  float hH = mix(.3, 1.06, big), up = (1. - smoothstep(-.1*hH, .6*hH, hA - hH*fcrHeap(vec2(p.x*mix(2.2, .62, big), uTime*.9))))*mix(max(.15 + .85*crd, .6), 1., big)*smoothstep(.0, .05, tF)*lipW*(.62 + .76*(P - .25));
  wN = max(wN, up); thk = max(thk, up);
  // glass: clear (the weed and the rock show through it); only as it stands steep does a little sky lie in it (water seen
  // square-on gives back a fiftieth of the light, a sixth at a slant): a band of it where the tongue bends over, and soft
  // glints a hand wide that run down with the water
  float sheen = (.1*smoothstep(0., .35, 1. - N.y) + .14*smoothstep(.45, .8, gn(mat2(.454, .891, -.891, .454)*(q*vec2(9., 2.2)) + 9.))*(1. - N.y))*smoothstep(-.05, .05, tF);
  // (round 27) THE TONGUE HAS A BODY. The film over the last metre of a tread is looked through at a slant: the eye's ray goes on
  // past the rock's lip (b = 0) and, in a clear pane, shows the foot of the fall below with the rock's ruled edge cut across it.
  // Water gathering for an edge is not a pane: over the last 0.2 m before the lip (where the falls' own ground begins: mine, below,
  // cuts gB's longer ramp off there) and on over the bend it deepens to the river's own blue-green (paler,
  // aerated, where a cord runs), and the sky lies on it where it bends over (Fresnel, by the direction to the eye, as on every
  // water here; the bend's normal is the mesh's own, taken up over the last half metre). It thins away again over the bend, by
  // the 30 degree row: the mesh's own edge against what lies below is then never a line of the picture, and lower down the
  // sheet is the clear glass with veils of white that it was.
  vec3 Nt = normalize(mix(vec3(0., 1., 0.), N, smoothstep(-.2, .48, b)));
  vec3 Vv = normalize(cameraPosition - vW); float f1 = 1. - max(dot(Nt, Vv), 0.), fr = .03 + .97*f1*f1*f1*f1*f1;
  float gB = smoothstep(-1.1, -.3, b)*(1. - smoothstep(.05, .47, b))*fcrLipW(p.x, vF.w);
  // (NO DARK LINE ALONG A LIP: where a cord goes over, and all along the last fall, the tongue's water is full of air, pale as
  // the foam either side of it; and the sky a tongue gives back to a low eye is the pale sky of the horizon, not the zenith's blue)
  vec3 tong = mix(mix(cDeep*.62, vec3(.3, .7, .76)*.46, crd*.6), vec3(.62, .8, .84)*.66, max(crd*.8, big*.62))*litW;
  vec3 skyT = mix(skyC, cHaze*mix(vec3(1.), vec3(1.16, .84, .88), min(uMirror*2., 1.)), smoothstep(.35, .9, f1));
  vec3 col = mix(skyC*sheen, tong*(1. - fr) + skyT*(fr + sheen*.5), gB); float a = mix(sheen, mix(.78, 1., fr), gB);
  // THE FOOT. Foam lies thickest where the sheet lands and thins to nothing at live's own reach (u: 0 at the landing, 1 there):
  // thick under a white stretch of the lip, a lace between (live's .15 + .85 crd); all along the last fall.
  // THE POCKET under a spout (live's own ground: fcrSpout, to fcrBasinEnd, torn as the bed's paint is): flecks of foam drift on
  // down it and thin away to its end; the water under the boil is aerated, pale turquoise (live's colour), clearing to the
  // river's own blue, the light's net and travelling wavelets on it.
  float bL = b - sF, Eb = mix(${wt.toFixed(3)}, ${Ft.toFixed(3)}, big), u = clamp(sF/max(Eb - bL, .5), 0., 1.);
  float tl = clamp((b - Eb)/max(bEnd - Eb, .5), 0., 1.);
  // THE BOIL IS THE SAME FOAM, LANDED: the cords' own field, its bodies a fifth as long (the water has lost the fall's speed and
  // churns), drifting on down the tread. It is nearly whole where the sheet lands for the first third of the reach and thins
  // to nothing over the rest; it lies in heaps (hp), thick in clumps and open between. Bits of it drift on down the pocket to
  // its end; between the white stretches of a lip only a few (live's lace, .15 + .85 crd). (round 27) Where it thins it OPENS
  // INTO LACE: threads of foam round cells of the basin's water a forearm across (lnet, lace), so the white goes out into the green-blue
  // through a net and never at a line.
  // (the pocket is 0.38 m deep where the tread's film is 0.22: the same water goes through it at 0.58 of the current's speed)
  vec2 qf = vec2(p.x, p.y + flow*.58); qf += .3*vec2(vn(qf*.9 + uTime*.15), vn(qf*.9 + vec2(9., -uTime*.13)));
  float hp = fcrHeap(qf);
  // (a cord's sides are straight down the fall; landed, the boil spreads from under it by its own heaps: the lane sum's edge is
  // moved by a quarter of the sum's whole swing either way and is itself a forearm and more wide, so the boil has no ruled side)
  float crdF = smoothstep(-.16, .2, laneL - ${Ce.toFixed(2)} + uWhite*.1 + (hp - .5)*.6 + (gn(qf*2.3 + 5.) - .5)*.3);
  // (the churn of the landing, all along the foot: whole for a hand, gone by its own heaps within a forearm to a stride)
  float wash = (1. - smoothstep(.1, .3 + .6*hp, sF))*.7;
  float dn = (1. - smoothstep(.3, 1., u))*mix(max(.15 + .85*crdF, wash), 1., big)*ft, thick = dn*1.7 + hp - .85;
  vec2 qw = vec2(qf.x, qf.y*5.), fw = fwidth(qw);
  float Pb = fcrCream(qw, fw) + (hp - .5)*.35, PbS = fcrCream(qw + so*vec2(.12, .6), fw) + (hp - .5)*.35;
  float df = max(pk*crdF*.6*(1. - tl), .55*(1. - u)*mix(.15 + .85*crdF, 1., big))*ft;
  float Sl = max(.9*dn, .3*df)*lipW, Sb = Sl*(.35 + .65*Sl), dB = fcrCreamD(Pb, Sb);   // (Sl: how much foam of any kind; Sb: how much of it is still a whole body)
  float wB = fcrCreamW(Pb, Sb);
  // the lace: threads of foam closing round cells of clear water a forearm across, drawn out a little along the current,
  // wandering (the level lines of two smooth fields: no thread straight, none ends at a point), a finger wide and soft,
  // widened by the pixel's footprint and paler for it; strong round the bodies, thinning to single threads and gone at the reach
  vec2 ql = qf*vec2(2.3, 1.25) + .4*vec2(gn(qf*1.1 + 3.), gn(qf*1.1 + 8.));
  float n1 = gn(ql + 11.), n2 = gn(ql*2.1 + 4.), f1l = fwidth(n1)*1.3, f2l = fwidth(n2)*1.3;
  float lnet = max((1. - smoothstep(.0, .075 + f1l, abs(n1 - .5)))*.075/(.075 + f1l), .8*(1. - smoothstep(.0, .1 + f2l, abs(n2 - .5)))*.1/(.1 + f2l));
  float lace = lnet*smoothstep(.02, .32, Sl + (Pb - .5)*.3)*(.55 + .45*smoothstep(.3, .6, gn(qf*.8 + 17.)));
  wB = max(wB, lace*.85);
  vec2 rq = vec2(p.x*.8 + .6*vn(p*.35 + 2.), (p.y + flow*.55)*2.4);
  float rip = smoothstep(.5, .85, gn(rq)*.6 + gn(rq*2.3 + 7.)*.4);
  float net = fcrCaus(p*.62 + 3.)*(1. - min(uMirror*3., 1.));
  // the water under the foam: aerated round the boil (soft: it is bubbles under the surface), the river's blue beyond
  float aer = smoothstep(-.4, .5, thick)*smoothstep(.1, .7, dn);
  vec3 wat = mix(cDeep*1.08, vec3(.3, .7, .76)*.46, aer)*litW;
  float aP = mix(.65, .9, aer), pkA = max(pk, aer*ft);
  vec3 colF = skyC*(.04 + .1*rip), colP = skyC*(.14 + .3*rip)*(1. - .6*aer) + wat*.86*aP + vec3(.3, .58, .9)*lit*.26*net*(1. - aer);
  col = mix(col, mix(colF, colP, pkA), ft); a = mix(a, mix(.04 + .08*rip, 1. - .86*(1. - aP), pkA), ft);
  float mine = max(own, pk*shore);                                       // (on the falls' own ground, and where a pocket's water runs out under the weed beside it)
  col *= mine; a *= mine;
  // WHITE WATER HAS A BODY, GENTLY (round 27): thick foam is cream and thin foam the pale turquoise of the water seen through it;
  // the side toward the sun is a little brighter and the lee takes a tint of the sky. A tint, not a cut: no clot has two colours.
  // (the white on the tongue thins away over the bend with the tongue's body WHERE THE BEND IS THE EDGE OF WHAT THE EYE SEES OF
  // THE SHEET: sil, 1 where the facet below the 30 degree row is turned from the eye, by the mesh's own normal there. Seen from
  // a side from which the fall's face shows, the white runs on down it unbroken. So no fall ends in a ruled white edge.)
  float sil = 1. - smoothstep(.2, .45, dot(N, Vv));
  // (and where the fall's face does show, its veils thin away toward the edge of what is seen of it, the sheet turning from the
  // eye: a veil has no outline)
  // (sil and fz are the falling sheet's: the level foot, known by its own normal, is not a sheet turned from the eye, and the
  // white is whole from the sheet's last hand on to the boil: no line of clear water where the sheet lands)
  float shF = (1. - ft)*(1. - step(.99, N.y));
  float fz = mix(1., smoothstep(.04, .42, abs(dot(N, Vv))), smoothstep(.0, .1, tF)*shF);
  float w = max(wN*(1. - smoothstep(.1, .4, sF))*(1. - sil*smoothstep(.05, .47, b)*shF)*fz, wB)*max(mine, apr);   // (the sheet's white runs a forearm on into the boil: no gap between them)
  float tk = mix(thk, smoothstep(-.3, .7, dB), ft);
  // (gS: how the field rises over a hand toward the sun: a rise is a lee. The boil's rim is heaped foam, not the sheet: level)
  float gS = mix(Ps - P, PbS - Pb, ft), nlS = dot(normalize(mix(N, vec3(0., 1., 0.), max(up, ft))), uSunDir);
  float sun = clamp(.6 + .2*nlS - 2.2*gS, 0., 1.);
  float gr = mix(grN, fcrGrain(qw, fw), ft);                    // (streaks inside the white: it is water running, not paint)
  vec3 fc = vec3(.9, .925, .93)*lit*(.68 + .14*tk + .14*sun)*(.84 + .32*gr);
  fc = mix(fc, vec3(.62, .76, .9)*(uSky*2.2 + uSun*cl*.3), (1. - sun)*.22 + .14*smoothstep(.56, .38, hp)*ft);
  fc = mix(vec3(.42, .72, .78)*lit*.52, fc, .25 + .75*smoothstep(.08, .7, w));
  float wa = w*mix(.6, 1., tk)*mix(.72 + .56*gr, 1., tk);                                          // (a thin rim is a veil, half of it hiding the water)
  col = mix(col, fc, wa); a = mix(a, 1., wa*.95);
  ${Ot}
  gl_FragColor = vec4(col, a);
}`}),a=new h.Mesh(m,W);return a.renderOrder=4,a.name="fcr-falls",a}async function lo(t,v,b,p,z){const y=t.rng.fork("fronds"),n=t.noise,u=[],q=[];for(let a=0;a<2;a++){const d=u.length/3,A=[[0,.7],[.45,1],[.8,.7]];for(const[w,F]of A)u.push(-F,w,a,F,w,a);u.push(0,1,a),q.push(d,d+1,d+2,d+1,d+3,d+2,d+2,d+3,d+4,d+3,d+5,d+4,d+4,d+5,d+6)}const k=_e-.6,E=10,T=(k-(Y+1))/E,P=Array.from({length:E},()=>[]),c=(_e-Ae)/We,f=(Je-Me)/we;let e=0,l=0;const s=(a,d,A,w,F,H,V,R,G)=>{P[j(Math.floor((k-A)/T),0,E-1)].push(a,d,A,w,F,H,V,R%1*.998+Math.floor(j(G,0,.999)*8)),l++};for(let a=0;a<p*12&&e<p;a++){(a&255)===255&&await z.yield();const d=y.range(Y+1,k),A=y.range(-25,25),w=j(Math.floor((A-Me)/f),0,we-1),F=j(Math.floor((d-Ae)/c),0,We-1),H=(F*we+w)*4,V=b[H+1]/127.5-1;if(V<.25)continue;const R=Math.abs(A-t.camX(d)),G=.07+.93*Math.exp(-(R*R)/64);if(y()>V*G)continue;const U=t.bed(A,d),K=U.wl-U.h;if(K<.03||b[H+2]/255*6-2<.45)continue;const D=U.zn,N=t.flowYaw(A,d)+y.range(-.12,.12),B=y.range(.5,1),ue=y(),de=y(),se=D<-90.6&&D>-195;e++,!(d<20&&R>14&&e%5>=2)&&(se&&(Tt(A,d,D)!==3||-90-15*Math.floor((-90-D)/15)-D>14.85)||s(A,U.h-.01,d,N,B,Math.min(K,.6),t.zonesAt(A,d)[2]>.45?2:b[H]/255*(se?.5:1),ue,.25+.75*de*(.6+.4*n.n2(A*.3,d*.3))))}await z.yield();{const a=y.fork("treads"),d=.5+.5*j(p/7400,0,1),A=.5;for(let w=0;w<180;w++){(w&7)===7&&await z.yield();for(let F=0;F<40;F++){const H=a(),V=a(),R=a(),G=a(),U=a(),K=a(),D=-10+(F+H)*A,N=-105.2-(w+V)*A;if(R>(Math.abs(D)<6?N<-150?.9:.74:.46)*d)continue;const B=t.znOf(D,N),ue=-90-15*Math.floor((-90-B)/15)-B;if(B>-105||B<-194.7||Tt(D,N,B)!==3||ue>14.85)continue;const de=t.bed(D,N),se=de.wl-de.h;if(se<.03||se>.5||de.dEdge<.4)continue;const ee=j(Math.floor((D-Me)/f),0,we-1),Te=j(Math.floor((N-Ae)/c),0,We-1);s(D,de.h-.01,N,t.flowYaw(D,N)+(G-.5)*.3,(.55+.45*U)*(1+.45*$(12.6,14.6,ue)),Math.min(se,.6),b[(Te*we+ee)*4]/255*.4,K,.2+.8*a())}}}await z.yield();{const a=y.fork("run"),d=.5+.5*j(p/7400,0,1),A=.7;for(let w=0;w<86;w++){(w&7)===7&&await z.yield();for(let F=0;F<16;F++){const H=a(),V=a(),R=a(),G=a(),U=a(),K=a(),D=a();if(R>.62*d)continue;const N=8-(w+V)*A,B=t.camX(N)-5.6+(F+H)*A,ue=j(Math.floor((B-Me)/f),0,we-1),de=j(Math.floor((N-Ae)/c),0,We-1),se=(de*we+ue)*4;if(b[se+1]/127.5-1<.3||b[se+2]/255*6-2<.45)continue;const ee=t.bed(B,N),Te=ee.wl-ee.h;Te<.03||s(B,ee.h-.01,N,t.flowYaw(B,N)+(G-.5)*.26,.5+.5*U,Math.min(Te,.6),t.zonesAt(B,N)[2]>.45?2:b[se]/255,K,.25+.75*D)}}}await z.yield();{const a=y.fork("shelf"),d=.5+.5*j(p/7400,0,1),A=.45;for(let w=0;w<53;w++){(w&7)===7&&await z.yield();for(let F=0;F<40;F++){const H=a(),V=a(),R=a(),G=a(),U=a(),K=a(),D=a(),N=115-(w+V)*A,B=t.flyX(N)-9+(F+H)*A;if(R>(.34+.4*w/53)*d)continue;const ue=j(Math.floor((B-Me)/f),0,we-1),de=j(Math.floor((N-Ae)/c),0,We-1),se=(de*we+ue)*4;if(b[se+1]/127.5-1<.02||b[se+2]/255*6-2<.45)continue;const ee=t.bed(B,N),Te=ee.wl-ee.h;Te<.03||s(B,ee.h-.01,N,t.flowYaw(B,N)+(G-.5)*.26,.5+.5*U,Math.min(Te,.6),b[se]/255,K,.25+.75*D)}}}await z.yield();{const a=z.core.makeRng("fcr-pool-weed:"+z.seed),d=.55;for(let A=0;A<42;A++){(A&7)===7&&await z.yield();for(let w=0;w<48;w++){const F=a(),H=a(),V=a(),R=a(),G=a(),U=a(),K=a();if(V>.62)continue;const D=-13.2+(w+F)*d,N=Y-7-(A+H)*d,B=j(Math.floor((D-Me)/f),0,we-1),ue=j(Math.floor((N-Ae)/c),0,We-1),de=(ue*we+B)*4;if(b[de+1]/127.5-1<.3)continue;const se=t.bed(D,N),ee=se.wl-se.h;ee<.05||s(D,se.h-.01,N,(R-.5)*.5,.55+.45*G,Math.min(ee,.6),.15*(b[de]/255),U,.25+.75*K)}}}await z.yield();const o=new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...v},fog:!0,side:h.DoubleSide,vertexShader:`
attribute vec4 iA, iB; varying vec3 vL; varying vec3 vW; varying vec3 vK; varying vec2 vT;
uniform float uFrondFar; ${Ve}${et}
#include <fog_pars_vertex>
void main(){
  float side = position.x, t = position.y, rib = position.z, tone = floor(iB.w)/8., ph = fract(iB.w)*6.283;
  vec4 wr = modelMatrix*vec4(iA.xyz, 1.);
  float len = iB.x*(1. - .25*rib)*smoothstep(uFrondFar, uFrondFar*.7, distance(wr.xyz, cameraPosition));
  float yaw = iA.w + (rib - .5)*.74 + .2*sin(uTime*.8 + ph);
  vec2 d = vec2(sin(yaw), -cos(yaw)), pr = vec2(-d.y, d.x);
  float wave = sin(t*3.6 - uTime*3.1 + ph + rib*2.);
  float roll = (rib*2. - 1.)*.75, hw = side*.2*len;
  float top = min(iB.y*.8 - .012, len*.4);
  float lift = top*(1. - (1. - t)*(1. - t)) + .025*sin(t*5. - uTime*3.7 + ph*1.7)*t;
  vec3 p = iA.xyz;
  p.xz += d*(t*len*1.1) + pr*(hw*cos(roll) + wave*.12*t*len);
  p.y += lift + hw*sin(roll)*(.25 + .75*t);
  float wl = iA.y + iB.y;
  p.y = min(p.y, wl + (iB.y < .13 ? .035 : -.008));                 // tips break the surface only in the riffles
  p.xz += fcrRip(p.xz)*(.015 + .07*max(wl - p.y, 0.));
  vL = p; vK = vec3(t, iB.z, side); vT = vec2(tone, max(wl - p.y, 0.));
  vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz;
  vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
varying vec3 vL; varying vec3 vW; varying vec3 vK; varying vec2 vT;
uniform vec3 uSunDir, uSun, uSky, cWeed, cTip, cGreen, cDeep;
${Ve}${Xe}${et}
#include <fog_pars_fragment>
void main(){
  // (round 27) under the eye a frond is a FAN OF FILAMENTS, each of its own length, not a card of three spikes: seven of them, or
  // five a little further off. The split is chosen by the pixel's footprint (a level of detail read from where the eye is: a
  // filament must have five pixels to itself to be cut out), so a frond further off keeps its three tapering fingers and
  // the carpet stays soft.
  float t = vK.x, fw = fwidth(vK.z), nf = fw < .06 ? 3.5 : fw < .1 ? 2.5 : 1.5, fz = vK.z*nf + .5, sd = abs(fract(fz) - .5);
  float tipL = nf < 2. ? 1.01 : .56 + .44*fract(sin(floor(fz)*12.9898 + vT.x*78.233 + 1.7)*43758.5453);
  if (sd > (nf < 2. ? .5 - .37*smoothstep(.2, 1., t) : (.5 - .29*smoothstep(0., .6, t/tipL))*(1. - smoothstep(.72, 1., t/tipL))) || t > tipL) discard;
  vec3 Vv = cameraPosition - vW; float dist = length(Vv), nearF = smoothstep(15., 4., dist); vec3 V = Vv/max(dist, 1e-3);
  float rib = (1. - .8*sd)*(1. - .4*nearF*smoothstep(.06, .0, sd)*smoothstep(.1, .4, t));      // a dark midrib down each finger
  rib *= 1. - .2*nearF*step(.55, fract(t*13. + sd*4.));                // and the pinnae along it
  float tone = .8 + .42*vT.x;                                          // every frond its own tone: wine to fresh crimson
  vec3 base = mix(cWeed*.5, cWeed*1.2, smoothstep(0., .5, t))*tone; base = mix(base, cTip*(.85 + .3*vT.x), smoothstep(.5, 1., t)*.65);
  float rose = step(1.5, vK.y), grn = vK.y*(1. - rose);                 // (green 2 = a frond of the thin rose beds)
  vec3 gc = mix(cGreen*.3, cGreen, t)*tone; base = mix(base, gc, smoothstep(.3, .8, grn));
  base = mix(base, mix(cWeed*.75, cTip*1.05, smoothstep(.1, .8, t))*tone, rose*.75);
  float cl = fcrCloud(vW.xz), caus = fcrCaus(vL.xz) + 1.2*fcrNet(vL.xz)*smoothstep(24., 6., dist);
  float back = max(dot(-V, uSunDir), 0.); back *= back;
  vec3 lit = uSun*cl, col = base*rib*(lit*(.72 + .9*caus + 1.1*back*t) + uSky*.8);
  float dw = vT.y;                                                     // the water over it: bright in the shallows, a little dimmer and bluer in the deeps
  col *= mix(1., .72, smoothstep(.1, .5, dw));
  col = mix(col, cDeep*(lit*.5 + uSky*.7), smoothstep(.25, .8, dw)*.25);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`}),m=new h.Group;m.name="fcr-fronds";const x=[],W=a=>{const d=new h.InstancedBufferGeometry;d.setAttribute("position",new h.Float32BufferAttribute(u,3)),d.setIndex(q);const A=new h.InstancedInterleavedBuffer(new Float32Array(a),8);d.setAttribute("iA",new h.InterleavedBufferAttribute(A,4,0)),d.setAttribute("iB",new h.InterleavedBufferAttribute(A,4,4)),d.instanceCount=a.length/8;const w=new h.Mesh(d,o);return w.frustumCulled=!1,w.renderOrder=1,w};return P.forEach((a,d)=>{const A=a.length/8;if(!A)return;const w=k-(d+.5)*T,F=W(a);m.add(F);let H=1e9,V=-1e9,R=1e9,G=-1e9,U=1e9,K=-1e9,D=0;for(let B=0;B<a.length;B+=8)H=Math.min(H,a[B]),V=Math.max(V,a[B]),R=Math.min(R,a[B+1]),G=Math.max(G,a[B+1]),U=Math.min(U,a[B+2]),K=Math.max(K,a[B+2]);const N=new h.Vector3((H+V)/2,(R+G)/2,(U+K)/2);for(let B=0;B<a.length;B+=8)D=Math.max(D,Math.hypot(a[B]-N.x,a[B+1]-N.y,a[B+2]-N.z));F.geometry.boundingSphere=new h.Sphere(N,D+2.5),F.frustumCulled=!0,x.push({mesh:F,center:new h.Vector3(0,t.core(w),w),radius:Math.hypot(26,T/2),n:A})}),{group:m,chunks:x,placed:l,make:W}}function ho(){const t=[[.86,.022,.018,-.004],[.84,.05,.034,-.002],[.8,.068,.044,0],[.755,.078,.05,.006],[.71,.098,.056,.012],[.66,.106,.06,.014],[.61,.098,.06,.01],[.555,.074,.058,.002],[.49,.07,.062,-.004],[.42,.084,.076,-.004],[.3,.106,.094,0],[.12,.118,.104,0],[-.06,.12,.106,0],[-.2,.11,.098,-.002],[-.3,.092,.074,-.008],[-.38,.082,.044,-.016],[-.47,.088,.024,-.022],[-.58,.092,.016,-.024],[-.69,.08,.013,-.024],[-.79,.054,.011,-.024],[-.86,.014,.008,-.024]],v=12,b=[],p=[],z=[],y=[.06,.035,.021],n=[.074,.046,.029],u=[.62,.5,.31],q=[.36,.28,.17],k=[.02,.014,.012];t.forEach(([T,P,c,f],e)=>{for(let l=0;l<v;l++){const s=l/v*Math.PI*2,o=Math.sin(s),m=Math.cos(s);b.push(1.5*P*m*(1-.12*Math.abs(o)),1.15*(f+1.32*c*o*(o<0?.86:1)),1.15*T);let x=o<-.35?n:y;const W=Math.sin(T*41+l*2.1)*Math.sin(l*1.7+1);T>.46&&T<.74&&o<(T<.54?-.78:-.55)+.15*W&&(x=u),T>=.74&&T<.85&&o<-.15&&(x=q),e===0&&(x=k);const a=.82+.18*Math.sin(T*9+s*2);p.push(x[0]*a,x[1]*a,x[2]*a)}});for(let T=0;T<t.length-1;T++)for(let P=0;P<v;P++){const c=T*v+P,f=T*v+(P+1)%v,e=c+v,l=f+v;z.push(c,e,f,f,e,l)}for(const T of[-1,1]){const P=b.length/3,c=T*.09,f=.084,e=.725;b.push(c+T*.012,f-.014,e+.03,c+T*.012,f-.014,e-.032,c-T*.03,f+.006,e,c+T*.034,f+.04,e-.012);for(let l=0;l<4;l++)p.push(.045,.027,.017);z.push(P,P+1,P+3,P+3,P+1,P,P+1,P+2,P+3,P+3,P+2,P+1,P+2,P,P+3,P+3,P,P+2)}for(const[T,P]of[[.3,.09],[.3,-.09],[-.2,.095],[-.2,-.095]]){const c=b.length/3,f=[[0,.02,.018],[-.05,.034,.02],[-.11,.045,.012],[-.16,.012,.006]];f.forEach(([e,l,s])=>{for(let o=0;o<6;o++){const m=o/6*Math.PI*2;b.push(1.4*(P+Math.sign(P)*(.012-e*.12)+l*Math.cos(m)),1.4*(-.075+e*.1+s*Math.sin(m)),1.15*(T+e)),p.push(.04,.028,.02)}});for(let e=0;e<f.length-1;e++)for(let l=0;l<6;l++){const s=c+e*6+l,o=c+e*6+(l+1)%6;z.push(s,s+6,o,o,s+6,o+6)}}const E=new h.InstancedBufferGeometry;return E.setAttribute("position",new h.Float32BufferAttribute(b,3)),E.setAttribute("color",new h.Float32BufferAttribute(p,3)),E.setIndex(z),E.computeVertexNormals(),E}function co(t,v,b=[]){const p=ho(),z=new h.InstancedBufferAttribute(new Float32Array(v*4),4),y=new h.InstancedBufferAttribute(new Float32Array(v*4),4);z.setUsage(h.DynamicDrawUsage),y.setUsage(h.DynamicDrawUsage),p.setAttribute("iP",z),p.setAttribute("iQ",y),p.instanceCount=v;const n=new Float32Array(v);for(let k=0;k<v;k++)n[k]=b[k]??.88;p.setAttribute("iS",new h.InstancedBufferAttribute(n,1));const u=new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...t},fog:!0,vertexShader:`
attribute vec4 iP, iQ; attribute float iS; attribute vec3 color; varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vWl; uniform float uTime;
#include <fog_pars_vertex>
void main(){
  // iP = x, y, z, yaw     iQ = pitch, bend (rad/m), water level (<-900 hides), swim phase
  float s = position.z, hide = step(-900., iQ.z), land = step(iQ.z, -400.);  // the two on the exit ledge sit on dry rock
  float tail = smoothstep(.25, -.9, s), scull = sin(s*4.5 - iQ.w)*tail;       // tail and hips scull up and down
  float th = iQ.x + iQ.y*s, thc = iQ.x + iQ.y*s*.5;
  vec2 sp = vec2(s*cos(thc), s*sin(thc));                                  // swimming: one circular arc
  if (iQ.y > 5.) {                                                         // posed (iQ.y = 10 + lift of the chest): hips, upright chest, head held level
    float B = iQ.y - 10., ds = s/10.; sp = vec2(0.);
    for (int i = 0; i < 10; i++) { float sm = ds*(float(i) + .5), a = iQ.x + B*smoothstep(-.35, .25, sm) - 1.1*smoothstep(.52, .8, sm); sp += vec2(cos(a), sin(a))*ds; }
    th = iQ.x + B*smoothstep(-.35, .25, s) - 1.1*smoothstep(.52, .8, s);
  }
  th += .1*scull;
  float ct = cos(th), sn = sin(th);
  vec3 q = vec3(position.x, sp.y + position.y*ct + .05*scull*(1. - land), sp.x - position.y*sn)*iS;
  vec3 n = vec3(normal.x, normal.y*ct + normal.z*sn, normal.z*ct - normal.y*sn);
  float cy = cos(iP.w), sy = sin(iP.w);
  vec3 p = vec3(q.x*cy + q.z*sy, q.y, -q.x*sy + q.z*cy)*hide + iP.xyz;
  n = vec3(n.x*cy + n.z*sy, n.y, -n.x*sy + n.z*cy);
  vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix)*n); vC = color;
  vWl = (modelMatrix*vec4(0., iQ.z, 0., 1.)).y;
  vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vWl;
uniform vec3 uSunDir, uSun, uSky, cDeep;
${Ve}${Xe}
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
  float cl = fcrCloud(vW.xz), nl = max(dot(N, uSunDir), 0.), nv = max(dot(N, V), 0.);
  vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.));
  float nh = max(dot(N, H), 0.), under = smoothstep(.02, -.25, vW.y - vWl);
  vec3 col = vC*(uSun*cl*(nl*1.35 + .12) + uSky*(.55 + .45*N.y));           // chocolate, never pewter
  float f1 = 1. - nv; f1 *= f1;
  col += uSun*cl*(.6*pow(nh, 140.) + .025*pow(nh, 18.))*(1. - under);          // one thin wet highlight
  col += (uSky*.28 + uSun*cl*.1*max(dot(N, uSunDir) + .4, 0.))*f1*f1*.4;       // a faint rim against the red
  col = mix(col, cDeep*(uSun*cl*.5 + uSky*.6)*.12 + col*.6, under);          // seen through the water
  col = mix(col, cDeep*(uSun*cl*.8 + uSky*.8), 1. - exp(-clamp(vWl - vW.y - .12, 0., 3.)*2.4));   // one that has dived is lost in the lane's own blue within a metre
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`}),q=new h.Mesh(p,u);return q.frustumCulled=!1,q.renderOrder=2,q.name="fcr-otters",{mesh:q,iP:z,iQ:y}}function fo(t){return new h.ShaderMaterial({uniforms:{...h.UniformsUtils.clone(h.UniformsLib.fog),...t},fog:!0,transparent:!0,depthWrite:!1,vertexShader:`
attribute vec4 iP0, iV, iK; varying vec2 vUv; varying vec3 vK; varying vec3 vW; uniform float uTime;
#include <fog_pars_vertex>
void main(){
  // iP0 = xyz, size   iV = velocity, life (0: age comes from iK.y)   iK = kind, phase|age, alpha, seed
  // kinds: 0 spray fleck | 1 mist wisp (rises, swells, fades) | 2 splash ring | 3 V wake | 4 the plume standing over a fall (breathes, never gone)
  // 5 a wisp of dawn mist | 6 the curtain of spray thrown up behind a white stretch of a lip (bursts, falls back, bursts again)
  float life = iV.w, age = life > 0. ? fract(uTime/max(life, .01) + iK.y) : iK.y, tt = age*life, kind = iK.x;
  vec3 c = iP0.xyz + iV.xyz*tt; float size = iP0.w, al = iK.z;
  if (kind < .5) { c.y -= 4.9*tt*tt; size *= .55 + .9*age; al *= (1. - age)*smoothstep(0., .12, age); }
  else if (kind < 1.5) { size *= .5 + 1.5*age; al *= sin(3.14159*age); c.x += sin(uTime*.5 + iK.w*20.)*.4*age; }
  else if (kind < 2.5) { size *= .25 + 1.25*age; al *= (1. - age)*(1. - age); }
  else if (kind > 5.5) { size *= .78 + .4*age; al *= sin(3.14159*age); }
  else if (kind > 4.5) { al *= .8 + .2*sin(6.2832*age + iK.w*9.); }
  else if (kind > 3.5) { float b = 6.2832*age; al *= .78 + .22*sin(b + iK.w*9.); c.x += .55*sin(b); c.y += .22*sin(b*2. + iK.w*5.); c.z += .3*cos(b); }
  vec4 w = modelMatrix*vec4(c, 1.);
  if (kind > 4.5 && kind < 5.5) { float hh = position.y*.5 + .5; w.xyz += mat3(modelMatrix)*vec3(.8, 0., .3)*(size*.42*hh*hh + .1*size*hh*sin(uTime*.7 + iK.w*20.)); }   // a wisp leans downwind as it climbs
  if (kind > 1.5 && kind < 3.5) {                                                    // flat on the water, turned by the yaw in iV.x
    float cy = cos(iV.x), sy = sin(iV.x); vec2 l = vec2(position.x, -position.y)*size;
    w.xyz += mat3(modelMatrix)*vec3(l.x*cy + l.y*sy, 0., -l.x*sy + l.y*cy);
  }
  vec4 mvPosition = viewMatrix*w;
  if (kind < 1.5) { mvPosition.xy += position.xy*size; al *= smoothstep(size*.5, size*2.2 + .5, -mvPosition.z); }   // never a white sheet on the lens
  else if (kind > 5.5) { mvPosition.xy += vec2(position.x*size*1.5, (position.y + .8)*size*.6); al *= smoothstep(3.5, 10., -mvPosition.z); }   // low and wide, standing behind its lip
  else if (kind > 4.5) { mvPosition.xy += vec2(position.x*size*.34, (position.y + 1.)*size*.5); al *= smoothstep(1.5, 5., -mvPosition.z); }   // tall and narrow, standing on its foot
  else if (kind > 3.5) { mvPosition.xy += position.xy*size*vec2(1., 1.2); al *= smoothstep(size*2.2 + 5., size*4. + 13., -mvPosition.z); }   // (a plume is for the lips ahead: passed over, it thins to nothing, never a pale sheet behind a lip)
  vUv = position.xy; vK = vec3(kind, al, iK.w + ((life > 0. && (kind < 3.5 || kind > 5.5)) ? floor(uTime/life + iK.y)*.37 : 0.));
  vW = w.xyz; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
varying vec2 vUv; varying vec3 vK; varying vec3 vW;
uniform vec3 uSunDir, uSun, uSky; uniform float uTime;
${Ve}${Xe}
#include <fog_pars_fragment>
void main(){
  float r = length(vUv), a;
  if (vK.x < .5) { a = smoothstep(1., 0., r)*(.35 + .65*vn(vUv*2.6 + vK.z*31.)); a *= a*1.6; }
  else if (vK.x < 1.5) { a = smoothstep(1., .1, r)*(.55 + .45*vn(vUv*1.6 + vK.z*17. + uTime*.15)); a *= a; }
  else if (vK.x < 2.5) { float n = vn(vUv*5. + vK.z*13.); a = smoothstep(.2, 0., abs(r - .78) - .06*n)*(.5 + .5*n) + smoothstep(.6, 0., r)*smoothstep(.45, .8, n)*.5; }
  else if (vK.x < 3.5) {                                              // the V wake behind a swimming head: apex at uv.y = -.85
    float y = vUv.y + .85, ax = abs(vUv.x), n = vn(vUv*vec2(7., 3.) + vec2(vK.z*9., uTime*2.2));
    float arm = smoothstep(.11, 0., abs(ax - y*.4) - .05*n)*smoothstep(0., .22, y);
    float wash = smoothstep(y*.4 + .02, 0., ax)*smoothstep(.7, .1, y)*smoothstep(.4, .8, n)*.5;
    a = (arm*(.3 + .7*n) + wash*.35)*smoothstep(1.85, .7, y)*smoothstep(1., .8, ax);
  } else if (vK.x < 4.5) {                                            // a standing plume: billows climbing through a soft body, no foot
    float n = vn(vUv*vec2(1.7, 1.2) + vec2(vK.z*17., -uTime*.3)), n2 = vn(vUv*3.4 + vec2(vK.z*5. + 3., -uTime*.55));
    a = smoothstep(1., .12, r)*(.36 + .64*n)*(.68 + .32*n2); a *= a*1.3*smoothstep(-.92, -.2, vUv.y);
  } else if (vK.x > 5.5) {                                            // spray thrown up behind a lip: a soft body with a torn crest, droplets climbing through it
    float h = vUv.y*.5 + .5, ax = abs(vUv.x);
    float n = vn(vec2(vUv.x*2.6 + vK.z*23., h*1.8 - uTime*1.9)), n2 = vn(vec2(vUv.x*7. + vK.z*11., h*4.5 - uTime*3.3));
    float top = .35 + .6*n;
    a = smoothstep(1., .3, ax)*smoothstep(top, top*.35, h)*smoothstep(0., .12, h)*(.55 + .45*n2);
  } else {                                                            // a curl of mist off still water: one thin thread that wavers as it climbs and frays out
    float h = vUv.y*.5 + .5, cx = (.5*sin(h*5. + vK.z*40. - uTime*.8) + .25*sin(h*11. - uTime*1.3 + vK.z*9.))*h;
    float wd = mix(.34, .95, h), n = vn(vec2(vUv.x*2.2 + vK.z*13., h*5. - uTime*.5));
    a = smoothstep(wd, .0, abs(vUv.x - cx))*(.4 + .6*n)*smoothstep(0., .1, h)*(1. - h)*(1. - h*.4)*1.9;
  }
  a *= vK.y; if (a < .004) discard;
  vec3 V = normalize(cameraPosition - vW);
  float fwd = max(dot(-V, uSunDir), 0.); fwd *= fwd*fwd;
  vec3 col = vec3(.84, .88, .92)*(uSun*fcrCloud(vW.xz)*(.62 + .7*fwd) + uSky*.9);
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`})}function jt(t,v,b){const p=new h.InstancedBufferGeometry;p.setAttribute("position",new h.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),p.setIndex([0,1,2,0,2,3]);const z=new h.InstancedInterleavedBuffer(v,12);b&&z.setUsage(h.DynamicDrawUsage),p.setAttribute("iP0",new h.InterleavedBufferAttribute(z,4,0)),p.setAttribute("iV",new h.InterleavedBufferAttribute(z,4,4)),p.setAttribute("iK",new h.InterleavedBufferAttribute(z,4,8)),p.instanceCount=v.length/12;const y=new h.Mesh(p,t);return y.frustumCulled=!1,y.renderOrder=5,{mesh:y,buffer:z}}function po(t,v,b,p,z,y){const n=t.rng.fork("spray"),u=[],q=(c,f,e,l,s,o,m,x,W,a,d=n)=>u.push(c,f,e,l,s,o,m,x,W,d(),a,d()),k=(c,f,e)=>{for(let l=0;l<f;l++){const s=c,o=n.range(-1,1),m=t.edgeL(s)+1,x=t.edgeR(s)-1,W=ye(m,x,o*.5+.5);e(W,t.zOf(W,s))}},E=c=>Math.max(2,Math.round(c*b)),T=(c,f,e,l,s,o,m,x)=>{for(let W=0;W<s+o;W++){let a=W<s?((W+n())/s*2-1)*10.5:n.range(10,21)*(W%2?1:-1),d=1;m&&Math.abs(a)<4.5&&(W%3?a=(a<0?-1:1)*n.range(4.8,9.5):d=.45),a=j(a,t.edgeL(c)+1.5,t.edgeR(c)-1.5);const A=e*n.range(.8,1.22)*(W<s?1:.85);q(a,f+n.range(.35,1.25)-x*n(),t.zOf(a,c-n.range(1.3,3.2)-x*.4),A,0,0,0,n.range(6,10),4,l*z*d*n.range(.75,1.1)*(W<s?1:.7))}};for(let c=0;c<ce;c++){const f=he-ke*c,e=t.waterY(f-3),l=[];for(let o=t.edgeL(f)+1.5;o<t.edgeR(f)-1.5;o+=.5)rt(o,t.zOf(o,f+.3))>.7&&l.push(o);l.length||l.push(5.5);const s=()=>l[Math.floor(n()*l.length)%l.length]+n.range(-.35,.35);for(let o=0,m=E(46);o<m;o++){const x=o%3?s():ye(t.edgeL(f)+1,t.edgeR(f)-1,n());q(x,e+.05,t.zOf(x,f-1),n.range(.22,.5),n.range(-.5,.5),n.range(1.6,3.4),-n.range(.8,2.6),n.range(.6,1.1),0,n.range(.5,.9))}k(f-1.4,E(6),(o,m)=>q(o,e+n.range(1.3,2.6),m-n.range(0,2.2),n.range(2.3,3.8),n.range(.2,.7),n.range(.2,.5),-n.range(.4,1),n.range(3.2,5),1,n.range(.2,.3))),T(f,t.waterY(f+2),1.6+.32*c,.66-.03*c,E(10),E(5),c>=4,c?0:.5);for(let o=t.edgeL(f)+1.2;o<t.edgeR(f)-1.2;o+=.95){const m=rt(o,t.zOf(o,f+.3)),x=n(),W=n.range(-.3,.3),a=n.range(.9,1.7),d=n.range(.85,1.2),A=n.range(1.3,2.2),w=n.range(.5,.72);m<Ce+.02||x>.5+.3*b||q(o+W,t.waterY(f+2)-.3,t.zOf(o,f-a),(.75+.9*j((m-Ce)/.4,0,1))*d,0,0,0,A,6,w*z)}if(c)for(let o=0,m=E(14);o<m;o++){const x=(o%2?1:-1)*n.range(.7,4.4);q(x,t.waterY(f+2)+.1,t.zOf(x,f-.3),n.range(.1,.2),n.range(-.4,.4),n.range(5.2,6.6),-n.range(2,4),n.range(.9,1.3),0,n.range(.55,.9))}for(let o=0,m=E(8);o<m;o++){const x=s();q(x,t.waterY(f+2)+n.range(-.15,.3),t.zOf(x,f-n.range(.1,.8)),n.range(.4,.75),0,0,0,n.range(2.2,4),4,n.range(.4,.7))}}for(const[c,f,e]of[[fe+.4,t.waterY(fe+3),1],[Y-.6,t.waterY(Y+3),1.4]]){const l=f-6;k(c-1,E(46*e),(s,o)=>q(s,l+.1,o,n.range(.35,.8),n.range(-.8,.8),n.range(2.5,5),-n.range(1,3.5),n.range(.8,1.3),0,n.range(.5,.9))),k(c-2.2,E(15*e),(s,o)=>q(s,l+1.2,o,n.range(3,5.5)*(e>1?1.25:1),n.range(.3,.9),n.range(.5,1.1),-n.range(1,2.4)*e,n.range(3.5,6),1,n.range(.1,.19))),k(c+.2,E(22),(s,o)=>q(s,f-.1,o,n.range(.3,.6),0,-.3,-n.range(1.2,2),1.08,0,.8))}T(Y,t.waterY(Y+2)-1.2,4.6,.36,E(10),E(6),!0,2.2);for(let c=ce;c<=ce;c++){const f=c<ce?he-ke*c:Y,e=c===ce?1:0;for(let l=0,s=E(e?24:9);l<s;l++){const o=j(((l+n())/s*2-1)*11,t.edgeL(f)+1,t.edgeR(f)-1);q(o,t.waterY(f+2)+n.range(0,.45),t.zOf(o,f-n.range(.1,.9)),n.range(.45,.9)*(1+.55*e),0,0,0,n.range(2.2,4),4,n.range(.4,.8))}}const P=t.waterY(Y-12);for(let c=0,f=E(9);c<f;c++)q(n.range(-6.5,6.5),P+n.range(.7,1.7),n.range(-219.5,-212),n.range(2,3.1),n.range(-.25,.25),n.range(.15,.35),-n.range(1.3,1.9),n.range(4,5.5),1,n.range(.24,.34));{const c=y.core.makeRng("fcr-ring-mist:"+y.seed);for(let f=0,e=E(12);f<e;f++)q(c.range(-7.5,7.5),P+c.range(.4,1.3),c.range(-223.5,-214.5),c.range(2.2,3.4),c.range(-.3,.3),c.range(.1,.3),-c.range(1,1.7),c.range(4.5,6.5),1,c.range(.3,.42),c)}if(p>.01)for(const c of t.wells)for(let f=0,e=c.r>2.2?2:1;f<e;f++){const l=-1.25+(f?-.95:0)+n.range(-.25,.25),s=c.r*n.range(.78,.95),o=j(1.25+.3*c.r,1.4,2.4)*n.range(.85,1.15)*(f?.75:1);q(c.x+Math.cos(l)*s,c.wl+.02,c.z+Math.sin(l)*s,o,0,0,0,n.range(5,8),5,(.48+.2*p)*n.range(.85,1.1))}return jt(v,new Float32Array(u),!1)}const Ut={morning:{el:55,side:-1,sun:[1,.95,.86],sunI:1,sky:[.2,.28,.42],weed:1,tip:1,zen:"#2463B8"},golden:{el:20,side:1,sun:[1,.6,.3],sunI:1.05,sky:[.16,.19,.3],weed:.84,tip:1.3,zen:"#3560A8"},dawn:{el:11,side:-1,sun:[1,.52,.46],sunI:.8,sky:[.17,.17,.27],weed:.75,tip:1.2,zen:"#4A5E9C"}},gt=(t,v)=>{if(v<=t[0][0])return t[0][1];for(let b=1;b<t.length;b++)if(v<=t[b][0]){const p=t[b-1],z=t[b];let y=(v-p[0])/(z[0]-p[0]);return z[2]&&(y=1-(1-y)*(1-y)),ye(p[1],z[1],y)}return t[t.length-1][1]},bt={A:[[0,78],[.3,50],[.55,-13],[.62,-25],[.64,-29],[.69,-49],[.75,-65],[.86,-97],[1,-150]],B:[[0,60],[.3,30],[.55,-38],[.64,-58],[.73,-79],[.76,-90],[.86,-134],[1,-185]]};function mo(t,v){const p=e=>16-6*$(.46,.55,e)+6*$(.73,.8,e),z=e=>(1-6.5/p((e+.5)/400))*(t/400),y=new Float32Array(401),n=new Float32Array(401),u=Math.round(.55*400),q=Math.round(.64*400),k=Math.round(.73*400),E=Math.round(.86*400),T=v+2,P=q+Math.round(20/t*400);y[u]=v+16;for(let e=u-1;e>=0;e--)y[e]=y[e+1]+z(e);for(let e=u+1;e<=400;e++){const l=y[e-1]-z(e-1);y[e]=e<=P?Math.max(l,T):l}n[k]=14;for(let e=k-1;e>=0;e--)n[e]=n[e+1]+z(e);for(let e=k+1;e<=400;e++)n[e]=n[e-1]-14/(E-k);const c=e=>{const l=Float32Array.from(e),s=Math.max(1,Math.round(4/t*400));for(let o=0;o<=400;o++){let m=0,x=0;for(let W=-s;W<=s;W++){const a=o+W;a>=0&&a<=400&&(m+=l[a],x++)}e[o]=m/x}return e};c(y),c(n);const f={A:y,B:n};return(e,l)=>{const s=j(l,0,1)*400,o=Math.min(399,Math.floor(s));return ye(f[e][o],f[e][o+1],s-o)}}async function vo(t,v={}){const p=(Array.isArray(v.palette)&&v.palette.length>=7?v.palette:Xt).map(r=>new h.Color(r)),z=t.quality?.detail??1,y=v.hour==="night"?"dawn":Ut[v.hour]?v.hour:"morning",n=Ut[y],u=eo(t,v),q=u.rng.fork("hero"),k=new h.Group;k.name="five-colour-river-hero";const E=(r,S=1)=>new h.Vector3(r.r*S,r.g*S,r.b*S),T=p[0].clone(),P=p[1].clone(),c=p[3].clone();T.lerp(p[1],q.range(0,.14)),u.season==="july"?T.lerp(p[1],.5):u.season==="november"&&(T.lerp(new h.Color(.26,0,.13),.5),P.lerp(new h.Color(.45,.04,.4),.6));const f=u.weather==="overcast",e=u.weather==="cloudburst",l=v.sunAzimuth??q.range(-.25,.25),s=n.el*Math.PI/180,o=v.sunDir?new h.Vector3(...v.sunDir).normalize():new h.Vector3(n.side*Math.cos(s)*Math.cos(l),Math.sin(s),Math.cos(s)*Math.sin(l)),m=n.sunI*(f?.5:1),x=f?1.9:1;await t.yield();const W=await to(u,t),a={uTime:{value:0},uCloudT:{value:0},uCloudAmt:{value:v.cloudShadows??(f?0:1)},uCloudCov:{value:0},uSunDir:{value:o.clone()},uSunL:{value:o.clone()},uSun:{value:new h.Vector3(...n.sun).multiplyScalar(m)},uSky:{value:new h.Vector3(...n.sky).multiplyScalar(x)},uMask:{value:W},uMaskRect:{value:new h.Vector4(Me,Ae,1/(Je-Me),1/(_e-Ae))},cWeed:{value:E(T,n.weed*(f?1.1:1))},cTip:{value:E(P,n.tip)},cSand:{value:E(p[2],.92)},cGreen:{value:E(c)},cRock:{value:E(p[4],2.2).addScalar(.004)},cDeep:{value:E(p[5])},cHaze:{value:E(p[6])},cZen:{value:E(new h.Color(n.zen))},uGloss:{value:e?1:.25},uWeedSat:{value:1},uReflCap:{value:v.reflection??(f?.2:.24)},uGlint:{value:f?0:1},uWhite:{value:e?.35:u.season==="july"?.15:0},uFrondFar:{value:72},uMirror:{value:v.mirror??(y==="dawn"?.42:y==="golden"?.27:0)},uStack:{value:new h.Vector4(0,0,0,0)},uPeri:{value:new h.Vector4(0,0,1,0)},uHol:{value:Array.from({length:6},()=>new h.Vector4(0,0,0,0))}};await t.yield();const d=new h.Mesh(await oo(u,t),no(a));d.name="fcr-bed",k.add(d),await t.yield();const A=so(u,a);k.add(A),await t.yield();const w=await ro(u,a,t);k.add(w),await t.yield();const F=await lo(u,a,W.image.data,Math.round(j(v.fronds??7400,500,8e3)*(.5+.5*z)),t);k.add(F.group),await t.yield();const H=j(Math.round(v.otters??7),3,9),V=Math.min(4,H-1),R=V+Math.max(3,H-V),G=R+4,U=[];for(let r=0;r<G;r++)U.push(r===0?.96:.86+.07*q());const K=co(a,G,U);k.add(K.mesh),await t.yield();const D=[];for(let r=0;r<R;r++){const S=r<V,Z=S?r:r-V,ne=S?V:R-V;D.push({g:S?"A":"B",dz:(Z-(ne-1)/2)*(S?1.75:2.6)+q.range(-.2,.2),lat:q.range(-.5,.5),ph:Z/ne+q.range(-.04,.04)})}const N=u.wells[0],B=[null,null],ue=fo(a),de=po(u,ue,z,v.wellMist??(y==="dawn"?1:0),y==="golden"?.6:1,t);de.mesh.name="fcr-spray",k.add(de.mesh);const se=R*4+2,ee=new Float32Array(se*12),Te=jt(ue,ee,!0);Te.mesh.name="fcr-otter-fx",k.add(Te.mesh);for(let r=0;r<se;r++)ee[r*12+11]=q();const Qe=13,Be=6,Se=10.5,X=.56,Ke=.4,Re=r=>r<X?0+Ke*Math.sin(Math.PI*r/X):0-.03*Math.sin(Math.PI*(r-X)/(1-X)),I=r=>r-Math.floor(r),oe=r=>Math.atan((Re(I(r+.01))-Re(I(r-.01+1)))/(.02*Be)),_=(r,S)=>u.waterY(u.znOf(r,S));let re=-1,be=!1;const te=[],ge=(r,S,Z,ne,qe,je)=>{const Ue=S*4;r[Ue]=Z,r[Ue+1]=ne,r[Ue+2]=qe,r[Ue+3]=je},ve=(r,S,Z,ne,qe,je,Ue,L,le=0)=>{const ie=r*12;ee[ie]=S,ee[ie+1]=Z,ee[ie+2]=ne,ee[ie+3]=qe,ee[ie+4]=le,ee[ie+8]=je,ee[ie+9]=Ue,ee[ie+10]=L},Ne=new h.Vector3,Ie=new h.Quaternion,it={A:-1e9,B:-1e9};for(const r of D)it[r.g]=Math.max(it[r.g],r.dz);const xt={A:0,B:0};let i=null,g=null;const M=(r,S)=>g(S)-i(r,S),C=[];{const r=t.core.makeRng("fcr-otter-pots:"+t.seed);for(let S=fe-16-r.range(0,10);S>he+14;S-=r.range(24,36))C.push(S)}for(let r=0;r<R;r++){const S=t.core.makeRng("fcr-otter-dives:"+r+":"+t.seed);D[r].dives=C.map(Z=>({z:Z+S.range(-1.5,1.5),on:S()<.42,len:S.range(3.4,4.8),deep:S.range(.3,.4)}))}function Q(r,S){const Z=K.iP.array,ne=K.iQ.array,qe=i!==null&&re>=0;for(const L of["A","B"])xt[L]=qe?M(L,S):gt(bt[L],S);const je=qe?g(S):Ne.z,Ue=qe?u.flyX(je):Ne.x;for(let L=0;L<R;L++){const le=D[L],ie=xt[le.g],pe=j(ie+le.dz,Y+3,fe-6),Ee=u.chanX(pe)+le.lat*$(-95,-85,pe)+(pe<he?le.lat*.4:0),nt=_(Ee,pe-.9),st=_(Ee,pe+.9),ze=(nt+_(Ee,pe)+st)/3;let Le=0,Pe=-1,Wt=0,ct=0,Nt=1;for(let He=0;He<le.dives.length;He++){const De=le.dives[He];if(!De.on)continue;const Ge=(De.z-pe)/De.len;Ge>0&&Ge<1.5&&(Pe=Ge,ct=De.z,Nt=De.len,Wt=De.deep,Le=$(0,.24,Ge)*(1-$(.76,1,Ge)))}const Fe=I((100-ie)/Qe+r*.12+le.ph),Pt=Re(Fe)*(1-Le)-Wt*Le,St=$(0,.06,Fe)*(1-$(X-.06,X,Fe)),Kt=j((oe(Fe+.03)-oe(Fe-.03+1))/(.06*Be),-.6,.6),Zt=Pe>0&&Pe<1?-.62*Math.sin(6.2832*Pe):0,$t=(oe(Fe)+(1-St)*.17)*(1-Le)+Math.atan((nt-st)/1.8)*.8+Zt,Yt=ye(.14,Kt,St*(1-Le)),ft=Math.atan2((u.chanX(pe-1)-u.chanX(pe+1))/2,-1),Mt=Math.sin(ft),zt=Math.cos(ft);ge(Z,L,Ee,ze+Pt,pe,ft),ge(ne,L,$t,Yt,ze,Fe*12.57+r*5),(te[L]||(te[L]=new h.Vector3)).set(Ee,ze+Pt,pe);const Dt=I(Fe-X+1),dt=pe+Dt*Se,pt=pe+Fe*Se,Bt=$(-97,-90,dt);if(Pe>0){const He=ct-Nt,De=(Pe-.8)/.7;ve(L*4,u.chanX(ct),ze+.03,ct,1.45,2,j(Pe/.9,0,1),Pe<.9?.95:0),ve(L*4+1,u.chanX(He),ze+.03,He,1.3,2,j(De,0,1),De>0?.9:0),ve(L*4+2,Ee-Mt*.25,ze+.1,pe-zt*.25,.5,1,I(r*1.7+le.ph*5),.85*Le),ve(L*4+3,Ee-Mt*.6,ze+.035,pe-zt*.6,1.7,3,0,0)}else{ve(L*4,u.chanX(dt)+le.lat*Bt,ze+.03,dt,1.3,2,Dt,.9*Bt+.25),ve(L*4+1,u.chanX(pt)+le.lat*$(-97,-90,pt),ze+.03,pt,1,2,Fe,.7);const He=Fe>=X,De=He?(Fe-X)/.24:Fe/.2,Ge=He?dt:pt;ve(L*4+2,u.chanX(Ge)+le.lat,ze+.2,Ge,.62,1,j(De,0,1),.7),ve(L*4+3,Ee-Mt*.6,ze+.035,pe-zt*.6,1.7,3,0,.6*(1-St),ft)}}for(let L=0;L<2;L++){const le=R+L,ie=N.x+(L?.62:-.55),pe=N.z+(L?-.6:.5),Ee=N.wl,nt=je-N.z,st=I(r/11+L*.08),ze=qe?$(be?62:38,be?46:24,nt)*(1-$(-4,-9,nt)):$(.1,.25,st)*(1-$(.7,.82,st));let Le=Math.atan2(Ue-ie,je-pe)+.25*Math.sin(r*.7+L*2);if(be){const Pe=ye(j(je,N.z-6,N.z+30),N.z-7,.5+.5*Math.sin(r*.9+L*2.6));Le=Math.atan2(u.flyX(Pe)-ie,Pe-pe)}ge(Z,le,ie,Ee+.05-(1-ze)*1.25+.025*Math.sin(r*2.1+L),pe,Le),L||a.uPeri.value.set(N.x,N.z,N.r,ze),ge(ne,le,1.5+.07*Math.sin(r*.9+L*1.7),10,Ee,r*1.5),(te[le]||(te[le]=new h.Vector3)).set(ie,Ee+.4,pe),ve(R*4+L,ie,Ee+.03,pe,.8,2,I(r*.45+L*.5),.6*ze)}for(let L=0;L<2;L++){const le=R+2+L,ie=B[L];if(!ie){ne[le*4+2]=-999;continue}ie.lie?(ge(Z,le,ie.x,ie.y+.13*U[le],ie.z,ie.yaw+.05*Math.sin(r*.4+L*3)),ge(ne,le,.02,10.72+.05*Math.sin(r*.6+L),-500,0)):(ge(Z,le,ie.x,ie.y+.25*U[le],ie.z,ie.yaw+.16*Math.sin(r*.5+L*3)),ge(ne,le,.08,11.35+.06*Math.sin(r*.8+L),-500,0))}K.iP.needsUpdate=!0,K.iQ.needsUpdate=!0,Te.buffer.needsUpdate=!0}const O=u.flyX,J=At+u.flood,me=r=>1.8+J-Ye*((he-r)/ke),xe=[[O(112),6+J+3,112],[O(93),6+J+3,93],[O(84),8.2+J,84],[O(62),5.2,62],[O(42),2.4,42],[O(24),J+1.2,24]];for(let r=8;r>=-72;r-=16)xe.push([O(r),J+1.2,r]);xe.push([0,J+2.5,he+1],[0,me(-108),-108],[0,me(-150),-150],[0,me(Y),Y],[0,me(-225),-225]);const Oe=[];for(let r=88;r>=Y+2;r-=8)Oe.push([u.chanX(r),_(u.chanX(r),r),r]);const tt=new h.Vector3(0,Ye,ke).normalize(),yt={portalSeat:{position:[0,me(-225),-225],facing:tt.toArray(),radius:7,tiltDeg:6.46,poolY:-17.9+J},flyThrough:xe,channel:Oe,viewpoints:{reveal:{position:[O(86),8.2+J,86],lookAt:[u.chanX(45),0,45]},otterRun:{position:[O(-29),J+1.2,-29],lookAt:[u.chanX(-33),.4,-33]},periscope:{position:[O(u.zPeri+6),J+1.2,u.zPeri+6],lookAt:[N.x,J+.4,N.z]},brink:{position:[0,J+2.5,he+1],lookAt:[0,-8,-160]},cascade:{position:[0,me(-150),-150],lookAt:[0,me(-225),-225]}},periscopeWell:{position:[N.x,N.wl,N.z],radius:N.r},wells:u.wells.map(r=>({x:r.x,z:r.z,bedY:r.y,waterY:r.wl,radius:r.r,depth:r.depth,sandy:!!r.sandy})),ledge:{z:fe,topWaterY:6+J,drop:6},brink:{z:he},steps:{count:ce,rise:Ye,tread:ke,firstZ:he},lastFall:{z:Y,topY:-Ye*ce+J,drop:6},pool:{center:[0,-17.9+J,-212],halfWidth:17},chuteX:5.5,slabWaterY:J,sunDir:o.toArray(),bounds:{min:[-115,-21,Ae],max:[115,9,_e],river:{halfWidth:22.5,z0:_e,z1:Ae}},otterSchedule:{z:bt,at:gt}},Ze=v.view||"",lt=parseFloat(v.debugU);isFinite(lt)&&(re=lt);let $e=new h.Vector3(0,14,-5),ot=30,at=26;if(Ze==="run"){const r=gt(bt.A,re>=0?re:.64);$e=new h.Vector3(u.chanX(r)-1.5,1.9,r),ot=3,at=6}else Ze==="peri"?($e=new h.Vector3(N.x+1,1.9,N.z),ot=2.5,at=6):Ze==="cascade"?($e=new h.Vector3(2,6,-140),ot=30,at=24):Ze==="reveal"&&($e=new h.Vector3(u.chanX(40),5,40),ot=12,at=14);const Gt=d.geometry.index.count/3+A.geometry.index.count/3*u.wells.length+w.geometry.index.count/3+F.placed*10+K.mesh.geometry.index.count/3*G+(de.mesh.geometry.instanceCount+se)*2;let kt=!!v.sunDir||v.adoptLight===!1;const _t=({sunDir:r,sunColor:S,skyColor:Z}={})=>{r&&a.uSunDir.value.set(r.x??r[0],r.y??r[1],r.z??r[2]).normalize(),S&&a.uSun.value.set(S.r??S[0],S.g??S[1],S.b??S[2]),Z&&a.uSky.value.set(Z.r??Z[0],Z.g??Z[1],Z.b??Z[2]),kt=!0},ht=new h.Vector3;function Vt(){kt=!0;let r=k;for(;r.parent;)r=r.parent;let S=null,Z=null;r.traverse(ne=>{ne.isDirectionalLight&&(!S||ne.intensity>S.intensity)&&(S=ne),ne.isHemisphereLight&&!Z&&(Z=ne)}),S&&(ht.copy(S.position).sub(S.target.position),ht.lengthSq()>1e-6&&a.uSunDir.value.copy(ht.normalize()),a.uSun.value.set(S.color.r,S.color.g,S.color.b).multiplyScalar(S.intensity/Math.PI*(f?.5:1))),Z&&a.uSky.value.set(Z.color.r,Z.color.g,Z.color.b).multiplyScalar(Z.intensity/Math.PI*1.5*x).max(ht.set(.06,.08,.12))}return{object:k,radius:ot,height:at,center:$e,anchors:yt,ground:!1,groundY:0,uniforms:a,layout:u,otterPositions:te,shared:{noiseGLSL:Ve,cloudShadowGLSL:Xe,waterGLSL:et,paveGLSL:Lt,sandGLSL:It},stats:{triangles:Math.round(Gt),drawCalls:6+F.chunks.length,fronds:F.placed,wells:u.wells.length,otters:R+2},heightAt:(r,S)=>u.bed(r,S).h,waterLevelAt:(r,S)=>u.waterY(u.znOf(r,S)),setProgress(r){re=j(r,0,1)},setFlight({length:r,zAt:S}){i=mo(r,it.A),g=S},fileZ:(r,S)=>i?M(r,S):gt(bt[r],S),setLight:_t,makeFronds:r=>F.make(r),setStack(r,S,Z,ne=Z){a.uStack.value.set(r,S,Z,ne)},setWatch(r){be=!!r},setHollows(r){a.uHol.value.forEach((S,Z)=>{const ne=r[Z];ne?S.set(ne[0],ne[1],ne[2],ne[3]):S.set(0,0,0,0)})},placeOtter(r,S,Z=0,ne={}){B[r&1]=S?{x:S.x??S[0],y:S.y??S[1],z:S.z??S[2],yaw:Z||0,lie:!!ne.lie}:null},update(r,S,Z){a.uTime.value=S,a.uCloudT.value=S,kt||Vt(),k.getWorldQuaternion(Ie).invert(),a.uSunL.value.copy(a.uSunDir.value).applyQuaternion(Ie),Z?k.worldToLocal(Ne.setFromMatrixPosition(Z.matrixWorld)):Ne.set(0,8,120);const ne=a.uFrondFar.value;for(const qe of F.chunks)qe.mesh.visible=Ne.distanceTo(qe.center)<qe.radius+ne;Q(S,re>=0?re:.52+.4*I(S/22))},dispose(){W.dispose()}}}export{vo as buildHero};
