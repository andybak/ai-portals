import*as e from"three";const q=(c,w,m)=>{const d=Math.min(1,Math.max(0,(m-c)/(w-c)));return d*d*(3-2*d)},ce=Math.PI/180,ue=.403,ie=.561,pe=.28,ye=1.25,me=`
uniform vec3 uSunW;      // direction TO the afterglow, world space
uniform vec3 uKeyCol; uniform vec3 uSkyCol; uniform vec3 uGndCol; uniform vec3 uFogCol; uniform float uFogK;
vec3 swLight(vec3 alb, vec3 n) {
  float nl = max(dot(n, uSunW), 0.);
  vec3 hemi = mix(uGndCol, uSkyCol, n.y * .5 + .5);
  return alb * (uKeyCol * nl * 1.9 + hemi * .74 + uSkyCol * .25);      // a decided key: what faces the afterglow is peach, the rest slate
}
vec3 swFog(vec3 c, float d) { return mix(uFogCol, c, exp(-uFogK * max(d, 0.))); }
`;function Ae(c={}){const w=c.mirror?-1:1,m=-60,d=660,u=.5,i=Math.round((d-m)/u),f={x:0,z:-8},y=40*ce,l=new Float32Array(i+1),C=new Float32Array(i+1),B=new Float32Array(i+1),P=new Float32Array(i+1),R=new Float32Array(i+1);let T=26.7*ce;const V=t=>{const s=Math.round(-m/u);for(let b=0;b<=i;b++){const $=m+b*u;B[b]=-y*q(150,210,$)+t*q(250,300,$)}l[s]=0,C[s]=0;for(let b=s+1;b<=i;b++){const $=(B[b]+B[b-1])*.5;l[b]=l[b-1]+Math.sin($)*u,C[b]=C[b-1]+Math.cos($)*u}for(let b=s-1;b>=0;b--)l[b]=0,C[b]=C[b+1]-u;const h=Math.round((300-m)/u),v=t-y;return(f.x-l[h])*Math.cos(v)-(f.z-C[h])*Math.sin(v)};let a=8*ce,o=45*ce,X=V(a);for(let t=0;t<24;t++){T=(a+o)*.5;const s=V(T);s>0==X>0?(a=T,X=s):o=T}V(T);const x=T-y,U=Math.sin(x),N=Math.cos(x),L=(t,s)=>(t-f.x)*U+(s-f.z)*N,F=(t,s)=>(t-f.x)*N-(s-f.z)*U,W=t=>Math.round((t-m)/u),p=L(l[W(210)],C[W(210)]),M=L(l[W(300)],C[W(300)]),O=M+70,H=M+213,_=M+335,E=-300,Y=1500,j=new Float32Array(Y+1),ne=t=>q(p,p+36,t)-q(O-13,O+3,t),Q=t=>-.05*(q(O-5,O+13,t)-q(O+86,O+110,t));let ee=.18;for(let t=0;t<4;t++){let s=0,h=0,v=0,b=0,$=0;for(let he=1;he<=Y;he++){const de=E+he-.5;s+=ne(de),h+=Q(de),ee*s+h>v&&(v=ee*s+h,b=s,$=h)}ee=(22-$)/Math.max(b,1)}j[0]=0;for(let t=1;t<=Y;t++){const s=E+t-.5;j[t]=j[t-1]+ee*ne(s)+Q(s)}for(let t=0;t<=Y;t++)j[t]-=1.05*q(H+6,_,E+t);const se=t=>{const s=Math.min(Y-.001,Math.max(0,t-E)),h=s|0,v=s-h;return j[h]*(1-v)+j[h+1]*v};for(let t=0;t<=i;t++)P[t]=se(L(l[t],C[t]));for(let t=0;t<=i;t++){const s=Math.max(0,t-16),h=Math.min(i,t+16);R[t]=(P[h]-P[s])/((h-s)*u)}for(let t=0;t<2;t++){let s=R[0];for(let h=1;h<i;h++){const v=R[h];R[h]=(s+2*v+R[h+1])/4,s=v}}const re=(t,s={})=>{const h=Math.min(i-.001,Math.max(0,(t-m)/u)),v=h|0,b=h-v;return s.x=l[v]+(l[v+1]-l[v])*b,s.z=C[v]+(C[v+1]-C[v])*b,s.y=P[v]+(P[v+1]-P[v])*b,s.h=B[v]+(B[v+1]-B[v])*b,s.grade=R[v]+(R[v+1]-R[v])*b,s},te={},ve=(t,s,h=0,v=new e.Vector3)=>(re(t,te),v.set(te.x+Math.cos(te.h)*s,te.y+h,te.z-Math.sin(te.h)*s)),le=[0,3,8,13,22,1e3],ae=[.6,1.2,2.2,6,20.2,20.2],n=t=>{let s=0;for(let h=0;h<5;h++){const v=le[h],b=Math.min(t,le[h+1]);if(b<=v)break;const $=(ae[h+1]-ae[h])/(le[h+1]-v);s+=(b-v)*(ae[h]+.5*$*(b-v))}return s},r=n(ue/.0115),S=20.2/.0115,k=278,G=ie-ue,g=t=>{if(t<=ue)return n(Math.max(0,t)/.0115);if(t>=ie)return 513+278*(t-ie);const s=(t-ue)/G,h=s*s,v=h*s;return(2*v-3*h+1)*r+(v-2*h+s)*S*G+(-2*v+3*h)*513+(v-h)*k*G},A=t=>(g(t+1e-4)-g(t-1e-4))/2e-4,z=[];for(let t=0;t>=-112;t-=14)z.push([0,0,t]);for(let t=1;t<12;t++){const s=t/12*Math.PI;z.push([(-14+14*Math.cos(s))*w,0,-112-14*Math.sin(s)])}for(let t=-112;t<=10.01;t+=12.2)z.push([-28*w,0,t]);const K=new e.Matrix4,D=new e.Vector3,I={};return{mirror:w,gate:f,beta:T,hf:x,aOf:L,bOf:F,hillAt:se,road:re,place:ve,S:g,speed:A,setW:(t,s,h)=>{const v=Math.min(Math.max(s,0),ie);re(g(v),I),h.pointAt(v,D),D.x*=w;const b=v>=ie?0:(.8-pe*q(258,312,g(v)))*Math.atan(I.grade);return t.matrix.makeTranslation(D.x,D.y,D.z),t.matrix.multiply(K.makeRotationX(b)).multiply(K.makeRotationY(-I.h)).multiply(K.makeTranslation(-I.x,-(I.y+ye),-I.z)),w<0&&t.matrix.premultiply(K.makeScale(-1,1,1)),t.matrixWorldNeedsUpdate=!0,I},pace:t=>.39+(2.5-.39)*q(ue,ie,t),railPoints:z,a210:p,a300:M,ac:O,a513:H,G:ee}}const we=`
uniform float uTime; uniform float uHand; uniform float uWave; uniform vec3 uCamW;
attribute vec4 aB; attribute vec3 aLit; attribute vec3 aShd;
varying vec3 vLit; varying vec3 vShd; varying vec3 vN; varying float vDist; varying float vGlow;
const float W = 9.42478;                       // 2 pi x 1.5: three swings every two seconds
vec2 rot(vec2 p, float a) { float c = cos(a), s = sin(a); return vec2(c * p.x - s * p.y, s * p.x + c * p.y); }
float tired() { float c = fract(uTime / 4.); return c < .8333 ? c / .8333 : 1. - smoothstep(.8333, 1., c); }
// the chain of one arm: angles from hanging, positive = out to its own side and up over the head
void arm(float side, out vec2 S, out vec2 E, out vec2 Wr, out vec3 ang) {
  float up = side < 0. ? 1. - smoothstep(.5, 1., uHand) : smoothstep(0., .5, uHand);
  up *= uWave;
  float bump = 4. * uHand * (1. - uHand), tr = tired(), amp = 1. - .4 * tr, t = W * uTime + 1.2;
  float a1 = mix(.10, 2.45 - .25 * tr + .30 * amp * sin(t) + .42 * bump, up);
  float a2 = a1 + mix(.18, .5 + .35 * amp * sin(t - .6) + .25 * bump, up);
  float a3 = a2 + .32 * amp * sin(t - 1.1) * up;
  S = vec2(side * .185, 1.37);
  E = S + rot(vec2(0., -.30), side * a1);
  Wr = E + rot(vec2(0., -.27), side * a2);
  ang = vec3(a1, a2, a3) * side;
}
void main() {
  vec3 p = position, n = normal;
  float bone = aB.x, glow = 0.;
  if (bone > .5 && bone < 3.5) {
    vec2 S, E, Wr; vec3 ang; arm(aB.y, S, E, Wr, ang);
    vec2 q = p.xy - vec2(aB.y * .185, 1.37);
    if (bone < 1.5) { p.xy = S + rot(q, ang.x); n.xy = rot(n.xy, ang.x); }
    else if (bone < 2.5) { p.xy = E + rot(q + vec2(0., .30), ang.y); n.xy = rot(n.xy, ang.y); }
    else { p.xy = Wr + rot(q + vec2(0., .57), ang.z); n.xy = rot(n.xy, ang.z); }
    p.z += .04 * smoothstep(0., 2., abs(ang.x));
  } else if (bone > 3.5) {
    vec2 S, E, Wr; vec3 angL, angR; vec2 WrL, WrR;
    arm(-1., S, E, WrL, angL); arm(1., S, E, WrR, angR);
    float k = smoothstep(.45, .55, uHand), sgn = mix(-1., 1., k);
    float a3 = mix(angL.z, angR.z, k);
    vec2 grip = mix(WrL + rot(vec2(0., -.09), angL.z), WrR + rot(vec2(0., -.09), angR.z), k);
    float tr = tired(), amp = (1. - .4 * tr) * uWave, t = W * uTime + 1.2, d = aB.z, v = aB.w;
    // A TEA TOWEL held by one corner. Its centre line is whipped from the fist: each part of it points where the hand
    // was a moment before, so it streams to one side, crosses over the head and streams to the other, and the free end
    // snaps late. The line is walked in eight steps; the sheet's width turns about it (the free end curls).
    float L = .80, th = 0.; vec2 c = grip;
    for (int i = 0; i < 8; i++) {
      float sI = (float(i) + .5) / 8. * d;
      th = mix(3.0 * sgn, sgn * .22 + 1.12 * amp * sin(t - 1.45 - 1.7 * sI) + .40 * amp * sI * sin(2. * t - 3.4 * sI + .8), uWave);
      c += vec2(sin(th), cos(th)) * (L * d / 8.);
    }
    th = mix(3.0 * sgn, sgn * .22 + 1.12 * amp * sin(t - 1.45 - 1.7 * d) + .40 * amp * d * sin(2. * t - 3.4 * d + .8), uWave);
    vec2 T = vec2(sin(th), cos(th)), Pp = vec2(T.y, -T.x);
    float tw = (.25 + 1.15 * d) * sin(.5 * t + 1.3 - 2.2 * d) * uWave;                 // the curl, a different one each swing
    float wd = .44 * smoothstep(0., .20, d) * (1. - .12 * d);
    vec3 across = vec3(Pp * cos(tw), sin(tw));
    float rp = 9. * d - 2. * t + 3. * v, rip = .045 * d * sin(rp);                     // a fine ripple, for the light to catch
    p = vec3(c, .07) + across * ((v - .12) * wd) + vec3(0., 0., rip);
    n = normalize(cross(across, vec3(T, .40 * d * cos(rp))) + vec3(0., 0., 1e-4));
    glow = 1. + v;                                                                     // 1..2: the cloth, and where across it
  }
  p.x += .02 * sin(uTime * .9) * smoothstep(0., 1.4, p.y) - .025 * smoothstep(.4, 1.0, p.y) * (1. - smoothstep(1.0, 1.5, p.y));
  vec4 wp = modelMatrix * vec4(p, 1.);
  vN = normalize(mat3(modelMatrix) * n);
  vLit = aLit; vShd = aShd; vGlow = glow; vDist = distance(wp.xyz, uCamW);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,xe=`
${me}
uniform float uNear; uniform float uGlow;
varying vec3 vLit; varying vec3 vShd; varying vec3 vN; varying float vDist; varying float vGlow;
void main() {
  vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) n = -n;
  float nl = dot(n, uSunW) * (vGlow > .5 ? (gl_FrontFacing ? 1. : -1.) : 1.);
  vec3 c = mix(vShd * vec3(.80, .90, 1.08), vLit * vec3(1.22, 1.06, .98), smoothstep(-.04, .04, nl + .12));     // two flat tones: peach side, slate side
  if (vGlow > .5) {                                              // the cloth: its lit folds near white, its shade a cool grey, so it flaps
    float f = smoothstep(-.30, .30, nl + .05);
    c = mix(vShd * vec3(.56, .62, .72), vLit * vec3(1.04, .97, .90) * uGlow, f);
    float hem = vGlow - 1.;                                      // a blue stripe along one hem, and a thin one inside it
    float stripe = smoothstep(.80, .825, hem) * (1. - smoothstep(.90, .925, hem)) + smoothstep(.70, .715, hem) * (1. - smoothstep(.735, .75, hem));
    c = mix(c, vec3(.16, .30, .52) * (.55 + .65 * f), stripe * .85);
  }
  gl_FragColor = vec4(swFog(c, vDist), uNear);
}`;function ge(c={}){const w=m=>new e.Color(m);return{uTime:{value:0},uCamW:{value:new e.Vector3},uSunW:{value:new e.Vector3(-.8,.21,.56)},uKeyCol:{value:w(c.key||"#F0B59B")},uSkyCol:{value:w(c.fillSky||"#8FA6B8")},uGndCol:{value:w(c.fillGround||"#3C4A44")},uFogCol:{value:w(c.fog||"#7F96A6")},uFogK:{value:.0012}}}function fe(){const c=[],w=[],m=[],d=[],u=[],i=new e.Vector3,f=new e.Vector3,y=new e.Matrix3;return{add(l,C,B,P,R,T,V){const a=l.index?l.toNonIndexed():l,o=a.attributes.position,X=a.attributes.normal,x=a.attributes.uv;y.getNormalMatrix(C);const U=new e.Color(R),N=new e.Color(T);for(let L=0;L<o.count;L++){if(i.fromBufferAttribute(o,L).applyMatrix4(C),f.fromBufferAttribute(X,L).applyMatrix3(y).normalize(),c.push(i.x,i.y,i.z),w.push(f.x,f.y,f.z),V){const F=V(x.getX(L),x.getY(L));m.push(B,P,F[0],F[1])}else m.push(B,P,0,0);d.push(U.r,U.g,U.b),u.push(N.r,N.g,N.b)}a!==l&&a.dispose(),l.dispose()},build(){const l=new e.BufferGeometry;return l.setAttribute("position",new e.Float32BufferAttribute(c,3)),l.setAttribute("normal",new e.Float32BufferAttribute(w,3)),l.setAttribute("aB",new e.Float32BufferAttribute(m,4)),l.setAttribute("aLit",new e.Float32BufferAttribute(d,3)),l.setAttribute("aShd",new e.Float32BufferAttribute(u,3)),l}}}async function be(c,w,m={}){const d=fe(),u=new e.Matrix4,i=(a,o,X,x=1,U=1,N=1)=>new e.Matrix4().makeTranslation(a,o,X).multiply(u.makeScale(x,U,N)),f=m.dress||["#A8584C","#5C3A40"],y=["#D9A98C","#8A6A66"],l=["#2B2622","#1E1B1C"],C=["#F4EFE2","#B9C2CC"],B=[[.02,.4],[.31,.4],[.29,.52],[.22,.8],[.15,.98],[.165,1.1],[.185,1.26],[.19,1.34],[.15,1.41],[.062,1.455],[.05,1.5]].map(a=>new e.Vector2(a[0],a[1]));d.add(new e.LatheGeometry(B,40),i(0,0,0,1,1,.7),0,0,f[0],f[1]),await c.yield(),d.add(new e.CylinderGeometry(.05,.047,.1,16,1,!0),i(0,1.5,0),0,0,y[0],y[1]),d.add(new e.SphereGeometry(.105,32,20),i(0,1.61,.012,.9,1.1,.96),0,0,y[0],y[1]),d.add(new e.SphereGeometry(.112,32,16,0,Math.PI*2,0,Math.PI*.52),i(0,1.622,-.006,.93,1.1,1),0,0,l[0],l[1]),await c.yield(),d.add(new e.SphereGeometry(.108,24,14),i(0,1.6,-.03,.9,1,.86),0,0,l[0],l[1]),d.add(new e.SphereGeometry(.055,16,10),i(0,1.7,-.085),0,0,l[0],l[1]),await c.yield();for(const a of[-1,1]){d.add(new e.CylinderGeometry(.052,.04,.42,14,1,!0),i(a*.085,.24,0),0,0,y[0],y[1]),d.add(new e.SphereGeometry(.06,14,8),i(a*.085,.04,.035,.85,.62,1.7),0,0,"#3A3230","#252022");const o=a*.185;await c.yield(),d.add(new e.SphereGeometry(.062,14,10),i(o,1.37,0),1,a,f[0],f[1]),d.add(new e.CylinderGeometry(.058,.043,.3,14,3,!0),i(o,1.37-.15,0),1,a,f[0],f[1]),d.add(new e.SphereGeometry(.043,12,8),i(o,1.37-.3,0),2,a,y[0],y[1]),d.add(new e.CylinderGeometry(.041,.031,.27,12,3,!0),i(o,1.37-.435,0),2,a,y[0],y[1]),d.add(new e.SphereGeometry(.043,12,8),i(o,1.37-.64,0,.75,1.55,.5),3,a,y[0],y[1])}m.cloth!==!1&&d.add(new e.PlaneGeometry(1,1,16,22),i(0,2,0),4,0,C[0],C[1],(a,o)=>[o,a]),await c.yield();const P=d.build(),R={...w,uHand:{value:0},uWave:{value:1},uNear:{value:1},uGlow:{value:1.08}},T=new e.ShaderMaterial({uniforms:R,vertexShader:we,fragmentShader:xe,side:e.DoubleSide,transparent:!0}),V=new e.Mesh(P,T);return V.frustumCulled=!1,V.renderOrder=3,m.scale&&V.scale.setScalar(m.scale),{mesh:V,uniforms:R,triangles:P.attributes.position.count/3}}const oe=6;function ke(c){const w=[],m=[],d=[],u=[];for(let C=0;C<oe;C++){const B=C*4;for(const P of[[-1,-1],[1,-1],[1,1],[-1,1]])w.push(0,0,0),m.push(P[0],P[1]),d.push(C);u.push(B,B+1,B+2,B,B+2,B+3)}const i=new e.BufferGeometry;i.setAttribute("position",new e.Float32BufferAttribute(w,3)),i.setAttribute("uv",new e.Float32BufferAttribute(m,2)),i.setAttribute("aK",new e.Float32BufferAttribute(d,1)),i.setIndex(u);const f={...c,uP:{value:Array.from({length:oe},()=>new e.Vector3)},uC:{value:Array.from({length:oe},()=>new e.Vector4(0,0,0,0))},uSz:{value:Array.from({length:oe},()=>new e.Vector3(1,1,0))},uView:{value:new e.Vector2(800,450)}},y=new e.ShaderMaterial({uniforms:f,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:e.DoubleSide,vertexShader:`
      uniform vec3 uP[${oe}]; uniform vec4 uC[${oe}]; uniform vec3 uSz[${oe}]; uniform vec2 uView; uniform vec3 uCamW;
      attribute float aK;
      varying vec2 vUv; varying vec4 vC; varying float vBody; varying float vDist;
      void main() {
        int k = int(aK + .5);
        vec4 wp = modelMatrix * vec4(uP[k], 1.);
        vec4 cp = projectionMatrix * viewMatrix * wp;
        vec3 sz = uSz[k];
        float pxPerM = projectionMatrix[1][1] * uView.y * .5 / max(cp.w, .1);
        vec2 px = max(sz.xy * pxPerM, vec2(sz.z * uView.y / 450.));          // true size, but never under the floor
        cp.xy += uv * px / uView * cp.w;
        if (uC[k].a < .003 || cp.w < .2) cp = vec4(2., 2., 2., 1.);
        vUv = uv; vC = uC[k]; vBody = (k == 1 || k == 4) ? 1. : 0.; vDist = distance(wp.xyz, uCamW);
        gl_Position = cp;
      }`,fragmentShader:`
      ${me}
      varying vec2 vUv; varying vec4 vC; varying float vBody; varying float vDist;
      void main() {
        float a; vec3 c = vC.rgb;
        if (vBody > .5) {                                   // a two tone figure: lit toward the afterglow, dark hair on top
          float w = mix(.95, .42, smoothstep(-1., .5, vUv.y));
          a = (1. - smoothstep(w - .25, w, abs(vUv.x))) * (1. - smoothstep(.85, 1., abs(vUv.y)));
          c = mix(c * .5, c, smoothstep(.1, -.1, vUv.x));
          c = mix(c, vec3(.03, .025, .025), smoothstep(.62, .72, vUv.y));
        } else {
          float r = length(vUv);
          a = 1. - smoothstep(.45, 1., r);
        }
        float f = exp(-uFogK * vDist);
        a *= vC.a;
        gl_FragColor = vec4(mix(uFogCol, c, mix(1., f, vBody)) * a, a);       // lights keep their hue through the haze
      }`}),l=new e.Mesh(i,y);return l.frustumCulled=!1,l.renderOrder=4,{mesh:l,uniforms:f}}function ze(c={}){const w=new e.BufferGeometry;w.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));const m={uRes:{value:new e.Vector2(800,450)},uRot:{value:new e.Matrix3},uTan:{value:new e.Vector2(.72,.404)},uOut:{value:1},uAlpha:{value:0},uBreath:{value:0},uTime:{value:0},uBeads:{value:c.beads?1:0},uBreathGain:{value:c.breathGain||1},uFrame:{value:new e.Color(c.frame||"#5C6C7E")},uSheen:{value:new e.Color("#8FA6B8")},uWire:{value:new e.Color("#6B4A2E")},uMist:{value:new e.Color(c.mist||"#AEB9C0")},uSeat:{value:new e.Color(c.seat||"#9A7C62")},uKeyG:{value:new e.Color(c.key||"#F0B59B")},uSide:{value:c.side||1}},d=new e.ShaderMaterial({uniforms:m,transparent:!0,depthTest:!1,depthWrite:!1,premultipliedAlpha:!0,vertexShader:"void main() { gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`
      uniform vec2 uRes; uniform mat3 uRot; uniform vec2 uTan; uniform float uOut; uniform float uAlpha; uniform float uBreath; uniform float uTime;
      uniform float uBeads; uniform float uBreathGain; uniform vec3 uFrame; uniform vec3 uSheen; uniform vec3 uWire; uniform vec3 uMist;
      uniform vec3 uSeat; uniform vec3 uKeyG; uniform float uSide;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y); }
      void main() {
        float asp = uRes.x / max(uRes.y, 1.), px = 2. / max(uRes.y, 1.);
        // the window is a rectangle in the car, one unit behind the lens: find where this pixel's ray meets it
        vec2 ndc = gl_FragCoord.xy / max(uRes, vec2(1.)) * 2. - 1.;
        vec3 ray = uRot * vec3(ndc * uTan, -1.);
        vec2 p = ray.z < -.05 ? ray.xy / (-ray.z) / max(uTan.y, 1e-3) : vec2(99.);
        vec2 b = vec2(asp - .08, .92);                         // inset 4 percent of the short side
        float r = .18;                                         // corner radius 9 percent
        vec2 q = abs(p) - b + r;
        float d = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r;
        vec3 col = vec3(0.); float a = 0.;
        float inside = 1. - smoothstep(-px, px, d);
        // eleven heater hairs
        float f = p.y / b.y * 6.2, fl = abs(fract(f + .5) - .5) * (b.y / 6.2);
        float hair = (1. - smoothstep(.75 * px, 1.75 * px, fl)) * step(abs(f), 5.4) * smoothstep(0., .1, -d - .04);
        float ah = .10 * hair * inside; col = col * (1. - ah) + uWire * ah; a = a + ah * (1. - a);
        // breath: comes and goes at the bottom centre, never into the middle third
        float cyc = .5 - .5 * cos(6.2832 * uTime / 3.6); cyc = cyc * cyc * (3. - 2. * cyc);
        // an even bloom of fog on the pane: only its size and strength breathe, its outline holds still; it swells from
        // the middle and shrinks back from its edges inward
        float amt = cyc * (.25 + .75 * uBreath), grow = mix(.55, 1., smoothstep(0., .8, amt));
        vec2 e = (p - vec2(0., -b.y + .125)) / (vec2(.235 * asp, .15) * (1. + .12 * uBreath) * grow);
        float edge = length(e) + (vnoise(p * 4. + 3.) - .5) * .16;       // a still, slightly uneven outline
        float core = 1. - smoothstep(.30, 1.0, edge); core = core * core * (3. - 2. * core);
        float ab = core * mix(.02, .30, amt) * uBreathGain * inside;
        ab *= .93 + .14 * vnoise(p * 150.);                              // the fog is fine droplets
        ab = min(ab, .34);
        vec3 mist = uMist * (.97 + .06 * core);
        col = col * (1. - ab) + mist * ab; a = a + ab * (1. - a);
        // rain beads trembling along the edges (variation C)
        if (uBeads > .5) {
          vec2 gc = p * 19., ci = floor(gc), cf = fract(gc) - .5;
          float h = hash(ci), near = smoothstep(-.15, -.03, d) * step(h, .22);
          vec2 o = (vec2(hash(ci + 7.), hash(ci + 13.)) - .5) * .5 + .04 * vec2(sin(uTime * 9. + h * 40.), cos(uTime * 7. + h * 31.));
          float bead = (1. - smoothstep(.13, .21, length(cf - o))) * near * inside;
          float hl = (1. - smoothstep(.03, .08, length(cf - o - vec2(-.05, .06))));
          vec3 bc = mix(uMist * .55, vec3(1.25, 1.05, .9), hl);
          float abd = bead * .55; col = col * (1. - abd) + bc * abd; a = a + abd * (1. - a);
        }
        // rim sheen, two pixels
        float rim = (1. - smoothstep(px, 3. * px, abs(d))) * .25;
        col = col * (1. - rim) + uSheen * rim; a = a + rim * (1. - a);
        // the dark surround; the car's real body takes over as the head turns
        float ao = smoothstep(-px, px, d) * uOut;
        // not a flat border: the car's own rear panel, lit by its window and falling darker toward the corners, a black
        // rubber seal round the glass with a thin light on it, a peach edge on the afterglow side, and along the bottom the
        // pleated top of the seat we kneel on
        float dd = max(d, 0.), sunS = smoothstep(.55, -.55, p.x * uSide / max(asp, .1));
        vec3 pan = uFrame * (.30 + .78 * exp(-dd / .085)) * (.93 + .14 * vnoise(p * 70.));
        pan += (uKeyG * mix(.05, .30, sunS) + uSheen * .06) * exp(-dd / .030);
        float seal = 1. - smoothstep(.016, .016 + 2. * px, dd);
        pan = mix(pan, vec3(.012, .015, .019) + uSheen * .10 * (1. - smoothstep(0., .008, abs(dd - .006))), seal);
        float sy = -(p.y + b.y) - .034 - .05 * (p.x / max(asp, .1)) * (p.x / max(asp, .1));       // below the seat's top line
        float seatK = smoothstep(0., 2. * px, sy);
        float pc = p.x / .105, pl = abs(fract(pc) - .5) * 2.;
        vec3 seat = uSeat * (.50 + .42 * smoothstep(0., .35, 1. - pl)) * (.80 + .45 * exp(-max(sy, 0.) / .03));
        seat += uKeyG * .16 * exp(-max(sy, 0.) / .010) * (.4 + .6 * sunS);                           // the piping takes the light
        pan = mix(pan, seat, seatK);
        col = col * (1. - ao) + pan * ao; a = a + ao * (1. - a);
        gl_FragColor = vec4(col, a) * uAlpha;
      }`}),u=new e.Mesh(w,d);u.frustumCulled=!1,u.renderOrder=1e3;const i=new e.Vector3,f=new e.Vector3,y=new e.Vector3,l=new e.Vector2;return{mesh:u,uniforms:m,update:(B,P,R,T,V,a)=>{const o=B.matrixWorld.elements;f.set(o[0],o[1],o[2]).normalize(),y.set(o[4],o[5],o[6]).normalize(),i.set(-o[8],-o[9],-o[10]).normalize();const X=R.dot(i),x=Math.acos(Math.min(1,Math.max(-1,X))),U=B.projectionMatrix.elements,N=1/Math.max(U[0],.001),L=1/Math.max(U[5],.001),F=X>.2;return P.getDrawingBufferSize(l),m.uRes.value.copy(l),m.uRot.value.setFromMatrix4(B.matrixWorld),m.uTan.value.set(N,L),m.uOut.value=1-q(.15,.6,x),m.uAlpha.value=F?q(0,.012,T)*(1-q(1.05,1.3,x)):0,m.uBreath.value=a,m.uTime.value=V,u.visible=F&&T>0,x}}}const Se=`
attribute vec3 color; attribute float aKind;
varying vec3 vCol; varying vec3 vN; varying vec3 vLp; varying vec3 vV; varying float vKind;
varying float vMir;      // -1 when the car is laid out mirrored (one deal gives its group a negative x scale), else 1: the same value at every vertex
void main() {
  vCol = color; vKind = aKind; vLp = position; vMir = modelMatrix[0][0] < 0. ? -1. : 1.;
  vec4 wp = modelMatrix * vec4(position, 1.);
  vN = mat3(modelMatrix) * normal; vV = cameraPosition - wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Me=`
uniform vec3 uSunW; uniform vec3 uKeyCol; uniform vec3 uSkyA; uniform vec3 uSkyB; uniform vec3 uSeatBounce;
uniform float uRing; uniform float uFwd; uniform vec3 uRingCol;      // the exit ring's light (0..1), and 1 once we face forward at dusk
uniform vec4 uGeo;       // WX (half width of the cabin), and the rear opening: half width, half height, corner radius
uniform float uPadY;     // the height of the middle of the head rests' pads, in the car's metres
float sdBox(vec2 p, vec2 c, vec2 h, float r) { vec2 q = abs(p - c) - h + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
varying vec3 vCol; varying vec3 vN; varying vec3 vLp; varying vec3 vV; varying float vKind; varying float vMir;
float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
void main() {
  vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(vV + vec3(0., 0., 1e-5));
  vec3 alb = vCol; float gloss = .25, spec = .06;
  if (vKind < .5) {                                        // paint: a faint orange peel
    alb *= .96 + .08 * vn(vLp.xy * 60. + vLp.z * 47.);
  } else if (vKind < 1.5) {                                // vinyl: pleats 6 cm wide with a stitched valley, a fine grain
    float pc = (vLp.x + vLp.z) / .062, pl = abs(fract(pc) - .5) * 2.;
    float pleat = smoothstep(.0, .22, 1. - pl);
    alb *= mix(.62, 1., pleat) * (.94 + .12 * vn(vLp.xy * 140. + vLp.z * 90.));
    n = normalize(n + vec3((fract(pc) - .5) * .9 * (1. - pleat) * abs(n.z), 0., (fract(pc) - .5) * .9 * (1. - pleat) * abs(n.x)));
    gloss = .5; spec = .16;
  } else if (vKind < 2.5) {                                // dash: matt grain
    alb *= .9 + .2 * (vn(vLp.xy * 190.) * .5 + vn(vLp.zy * 170. + 3.) * .5);
    gloss = .2; spec = .10;
    float st = (1. - smoothstep(.003, .006, abs(vLp.z - 1.655))) * step(.42, fract(vLp.x * 38.)) * step(.5, n.y);   // a stitched seam along the padded roll
    alb = mix(alb, vec3(.62, .56, .46), st * .8);
  } else if (vKind < 3.5) {                                // bright metal: it shows the windows
    gloss = 1.; spec = .55; alb *= .30;
  } else if (vKind > 5.5 && vKind < 6.5) {                 // a head rest's pad: three stuffed rolls 5 cm tall, a stitched seam between each
    float ry = (vLp.y - uPadY) / .05;                      // the seams lie 2.5 cm above and below the pad's middle
    float dy = abs(ry) - .5, sd = abs(dy) * .05;           // metres from the nearer seam
    float puff = smoothstep(0., .009, sd);                 // each roll swells out of its seam over 9 mm
    alb *= (.66 + .34 * puff) * (.94 + .12 * vn(vLp.xy * 140. + vLp.z * 90.));
    float th = step(.45, fract((vLp.x + vLp.z) / .009)) * (1. - smoothstep(.0010, .0022, abs(sd - .0045)));      // the thread: a stitch every 9 mm, 4.5 mm from the valley
    alb = mix(alb, vCol * 1.35, th * .8);
    n = normalize(n + vec3(0., -sign(dy) * sign(ry) * (1. - puff) * .45, 0.));      // the roll's flank faces its seam
    gloss = .5; spec = .16;
  } else if (vKind > 4.5) {                                // seat-belt webbing: a ribbed weave, almost black
    alb *= .80 + .40 * vn(vec2(vLp.z * 300., vLp.y * 45.)); gloss = .35; spec = .10;
  } else {                                                 // head lining: perforated cloth
    vec2 c = fract(vLp.xz * 55.) - .5; float fw = fwidth(vLp.x) * 55.;
    alb *= 1. - .22 * (1. - smoothstep(.12, .22, length(c))) * (1. - smoothstep(.15, .5, fw));
  }
  // light comes in by the glass: sky from above and the sides, the afterglow from its own side, a warm bounce off the seats
  float up = n.y * .5 + .5;
  vec3 amb = mix(uSeatBounce * .6, uSkyA, smoothstep(.15, .95, up)) * .85 + uSkyB * .25 * (1. - up);
  vec3 side = uSkyA * max(abs(n.x) * .7 + abs(n.z) * .5 - .2, 0.) * .50;
  float nl = max(dot(n, uSunW), 0.);
  vec3 c = alb * (amb + side + uKeyCol * nl * .85);
  if (vKind > 5.5 && vKind < 6.5) {                         // a pad stands between its door's pane and the cabin: the side toward the door
    float door = n.x * vMir * sign(vLp.x);                 // (vMir turns the world normal's x back into the car's own, so the mirrored deal lights the same side) takes the pane's light, the side toward the middle of the car is in shade
    c *= mix(.50, 1., smoothstep(-.7, .2, door));
    c += alb * mix(uSkyA, uKeyCol * 1.25, 1. - smoothstep(-.55, .25, vLp.x)) * (.55 * smoothstep(.15, .9, door));
  }
  vec3 r = reflect(-v, n);
  vec3 env = mix(uSkyB, uSkyA, smoothstep(-.2, .6, r.y)) * (.55 + .45 * smoothstep(.0, .5, abs(r.z) + abs(r.x) * .6));
  env += uKeyCol * 1.4 * smoothstep(.75, .98, dot(r, uSunW));
  float fr = 1. - max(dot(n, v), 0.); fr = fr * fr;
  c += env * spec * (gloss + (1. - gloss) * fr);
  // the light is at the glass: every panel is brightest round its window and falls away toward the floor, and the
  // edge of each opening catches the sky (peach on the afterglow side, the car's right)
  c *= mix(.66, 1.10, smoothstep(-.95, .40, vLp.y));
  float dW = 9.;
  if (abs(abs(vLp.x) - uGeo.x) < .03) dW = min(sdBox(vLp.zy, vec2(-.185, .02), vec2(.565, .28), .08), sdBox(vLp.zy, vec2(1.24, .02), vec2(.74, .28), .08));
  else if (abs(vLp.z + .8) < .02) dW = sdBox(vLp.xy, vec2(0.), uGeo.yz, uGeo.w);
  else if (abs(vLp.z - 2.1) < .02) dW = sdBox(vLp.xy, vec2(0., .02), vec2(uGeo.x - .10, .35), .10);
  dW = max(dW, 0.);
  float sunSide = 1. - smoothstep(-.55, .25, vLp.x);
  vec3 edge = mix(uSkyA, uKeyCol * 1.25, sunSide);
  c += alb * edge * (.34 * exp(-dW / .20));
  if (vKind < .5 || (vKind > 3.5 && vKind < 4.5)) c *= vec3(.40, .43, .47);      // paint and lining sit in the cabin's own shade: the light is outside
  c += edge * (.24 * exp(-dW / .007)) * step(dW, 8.);                              // only the lip of each opening takes the sky
  c *= mix(1., .66, uFwd);
  c += mix(uSkyA, uSkyB, .3) * (.013 + .020 * smoothstep(-.6, .4, vLp.y)) * uFwd;      // shade in the cabin is slate, never black                                                   // dusk in the cabin once we face forward
  if (vKind > 1.5 && vKind < 2.5 && n.y > .55 && vLp.z > 1.4) {             // the dash top: dark, holding the sky as a soft gradient
    float tow = smoothstep(1.64, 2.06, vLp.z);
    c += mix(uSkyB, uSkyA, .45) * (.015 + .15 * tow * tow * tow) * (.70 + .30 * vn(vLp.xz * vec2(2.2, 7.)));
    // the windscreen lies on it as a pale shape: follow the mirrored ray back to the opening
    float tz = (2.1 - vLp.z) / max(r.z, .05);
    vec2 hit = vLp.xy + r.xy * tz;
    float inW = (1. - smoothstep(-.06, .10, sdBox(hit, vec2(0., .02), vec2(uGeo.x - .10, .35), .10))) * step(.05, r.z);
    c += mix(uSkyB, uSkyA, smoothstep(-.2, .37, hit.y)) * inW * (.02 + .20 * fr) * (.35 + .65 * tow);
    c += uKeyCol * .24 * (1. - smoothstep(-uGeo.x, -.05, vLp.x)) * (.30 + .70 * tow);
    c += uKeyCol * .55 * (1. - smoothstep(.0, .05, abs(vLp.x + uGeo.x - .045) - .006)) * (.4 + .6 * tow);     // a peach line along the afterglow edge
    // the ring ahead lays its light down the middle of the dash
    c += uRingCol * uRing * (exp(-vLp.x * vLp.x / .014) * (.08 + .50 * tow * tow) + .04 * tow);
  }
  // and lifts every edge that faces it: pillars, the mirror, the binnacle, the wheel rim, the rim of the screen
  float nearScr = smoothstep(1.2, 1.9, vLp.z);
  c += uRingCol * uRing * nearScr * (.50 * fr * fr * (1. - smoothstep(.3, .7, n.y)) + (.30 * exp(-dW / .025) + .08 * exp(-dW / .15)) * step(dW, 8.));
  gl_FragColor = vec4(c, 1.);
}`;function J(c,w,m,d=.5,u=18){const i=new e.SphereGeometry(1,u,Math.max(8,Math.round(u*.7))),f=i.attributes.position;for(let y=0;y<f.count;y++){const l=f.getX(y),C=f.getY(y),B=f.getZ(y);f.setXYZ(y,Math.sign(l)*Math.pow(Math.abs(l),d)*c/2,Math.sign(C)*Math.pow(Math.abs(C),d)*w/2,Math.sign(B)*Math.pow(Math.abs(B),d)*m/2)}return i.computeVertexNormals(),i}async function Be(c={}){const w=c.yield||(async()=>{}),m=c.aspect||16/9,d=Math.tan((c.fov||44)*ce/2),u=.8,i=(m-.08)*d*u,f=.92*d*u,y=.18*d*u,l=[],C=[],B=[],P=[],R=new e.Color,T=new e.Vector3,V=new e.Vector3,a=(n,r,S,k=1,G=0)=>{const g=n.index?n.toNonIndexed():n,A=g.attributes.position,z=g.attributes.normal;R.set(S).multiplyScalar(k);for(let K=0;K<A.count;K++){T.fromBufferAttribute(A,K).applyMatrix4(r),l.push(T.x,T.y,T.z),V.fromBufferAttribute(z,K).transformDirection(r),C.push(V.x,V.y,V.z);const D=.7+.36*q(-1,.44,T.y)-.08*q(.4,2.1,T.z);B.push(R.r*D,R.g*D,R.b*D),P.push(G)}g!==n&&g.dispose(),n.dispose()},o=(n,r,S,k=0,G=0)=>new e.Matrix4().makeTranslation(n,r,S).multiply(new e.Matrix4().makeRotationY(k)).multiply(new e.Matrix4().makeRotationX(G)),X=n=>new e.Matrix4().makeRotationZ(n),x=(n,r,S,k,G,g,A,z=1,K=0)=>a(new e.BoxGeometry(k,G,g),o(n,r,S),A,z,K),U=(n,r,S,k,G)=>{const g=new e.Shape;g.moveTo(n,S),g.lineTo(r,S),g.lineTo(r,k),g.lineTo(n,k),g.closePath();for(const[A,z,K,D,I]of G){const Z=new e.Path;Z.moveTo(A+I,K),Z.lineTo(z-I,K),Z.quadraticCurveTo(z,K,z,K+I),Z.lineTo(z,D-I),Z.quadraticCurveTo(z,D,z-I,D),Z.lineTo(A+I,D),Z.quadraticCurveTo(A,D,A,D-I),Z.lineTo(A,K+I),Z.quadraticCurveTo(A,K,A+I,K),g.holes.push(Z)}return new e.ShapeGeometry(g,8)},N="#66788C",L=c.seat||"#9A7C62",F="#4C5A6C",W="#C9D2D8",p=Math.max(.65,i+.1),M=2.1,O=.44,H=-.26,_=H-.07,E=.41,Y=.15,j=[[-u+.05,.38,H,.3,.08],[.5,1.98,H,.3,.08]];a(U(-p,p,-1,O,[[-i,i,-f,f,y]]),o(0,0,-u,Math.PI),N,.62),a(J(2*p-.06,.2,.56,.45,20),o(0,-f-.11,-u+.29),L,.95,1);for(const n of[-1,1]){a(U(-u,M,-1,O,j),o(n*p,0,0,-Math.PI/2),N,.78);for(const r of j){const S=(r[0]+r[1])/2,k=(r[2]+r[3])/2,G=r[1]-r[0],g=r[3]-r[2],A=n*(p-.008);x(A,r[3]+.012,S,.016,.024,G+.04,F,.7,2),x(A,r[2]-.012,S,.016,.024,G+.04,F,.7,2),x(A,k,r[0]-.012,.016,g,.024,F,.7,2),x(A,k,r[1]+.012,.016,g,.024,F,.7,2)}x(n*(p-.012),H-.045,(M-u)/2,.012,.007,M+u-.3,W,1,3),a(new e.BoxGeometry(.02,.7,M+u-.5),o(n*(p-.014),H-.07-.37,(M-u)/2),L,.72,1),a(J(.09,.07,.5,.5,12),o(n*(p-.05),H-.27,1.05),F,1.1,2),a(new e.CylinderGeometry(.024,.024,.045,12),o(n*(p-.035),H-.16,.74).multiply(X(Math.PI/2)),W,1,3),x(n*(p-.058),H-.19,.775,.014,.016,.09,W,1,3),a(new e.SphereGeometry(.016,8,6),o(n*(p-.066),H-.205,.815),F,1,2),a(new e.CylinderGeometry(.012,.012,.05,8),o(n*(p-.03),H-.02,-.1),W,1,3),await w(),a(J(.44,.86,.17,.42,22),o(n*E,-.61-Y,.93,0,-.06),L,.86,1),a(J(.46,.06,.19,.5,14),o(n*E,-.19-Y,.955),L,1.12,2),a(J(.2,.15,.105,.34,18),o(n*E,.025-Y,.955),L,.95,6);{const G=[];for(let g=0;g<4;g++)for(let A=0;A<4;A++){const z=(g+A/3)*Math.PI/2,K=(g===0||g===3?1:-1)*(.084-.028),D=(g<2?1:-1)*(.059-.028);G.push(new e.Vector3(K+.028*Math.cos(z),D+.028*Math.sin(z),0))}a(new e.TubeGeometry(new e.CatmullRomCurve3(G,!0,"catmullrom",.2),40,.0045,5,!0),o(n*E,.025-Y,.955-.92*.105/2),L,1.25,2)}for(const r of[-.055,.055])a(new e.CylinderGeometry(.008,.008,.16,8),o(n*E+r,-.1-Y,.955),W,1,3);a(J(.45,.16,.52,.45,16),o(n*E,-.9,1.22),L,.8,1);for(let r=0;r<8;r++){const S=.31-1.28*r/8,k=.31-1.28*(r+1)/8,G=z=>.44+.015*Math.sin(Math.PI*(.31-z)/1.28),g=(G(S)+G(k))/2,A=Math.atan2(G(k)-G(S),k-S);a(new e.BoxGeometry(.006,S-k+.004,.036),o(n*(p-.014),(S+k)/2,g,0,A),"#55616E",.9,7)}a(new e.TorusGeometry(.021,.0045,6,16),o(n*(p-.016),.325,.44,Math.PI/2),W,1,3),x(n*(p-.012),.352,.44,.008,.034,.03,F,.8,2),x(n*(p-.024),-.4,.452,.006,.06,.03,W,1,3),x(n*(p-.028),-.415,.452,.004,.018,.014,F,.8,2);for(const r of j){const S=(r[0]+r[1])/2,k=(r[2]+r[3])/2,G=r[1]-r[0],g=r[3]-r[2],A=n*(p-.006),z=.006;x(A,r[3]-z/2,S,.003,z,G-.1,W,.6,3),x(A,r[2]+z/2,S,.003,z,G-.1,W,.6,3),x(A,k,r[0]+z/2,.003,g-.1,z,W,.6,3),x(A,k,r[1]-z/2,.003,g-.1,z,W,.6,3)}await w(),a(J(.36,.1,.025,.4,12),o(n*.4,.385,M-.2,0,-.5),N,.92,4)}await w(),a(new e.PlaneGeometry(2*p,M+u),o(0,O,(M-u)/2,0,Math.PI/2),N,.9,4),x(0,O-.012,.55,.11,.02,.07,"#E9E2CF",.9,2),a(new e.PlaneGeometry(2*p,M+u),o(0,-1,(M-u)/2,0,-Math.PI/2),F,.8,2),a(U(-p,p,-1,O,[[-p+.1,p-.1,_,.37,.1]]),o(0,0,M),N,.66),x(0,.385,M-.012,2*p-.18,.02,.02,F,.7,2),x(0,_+.006,M-.012,2*p-.18,.02,.02,F,.7,2),await w(),a(J(2*p-.02,.13,.44,.42,20),o(0,_-.07,M-.21),F,.6,2),a(J(2*p-.02,.085,.11,.5,14),o(0,_-.045,M-.445),F,.82,2),x(0,_-.22,M-.4,2*p,.3,.04,F,.55,2),x(0,_-.145,M-.425,2*p-.1,.012,.012,W,1,3),x(0,_-.27,M-.425,2*p,.05,.012,L,.9,1),a(J(.4,.15,.24,.5,14),o(-E,_+.005,M-.36),F,.66,2);for(const n of[-.085,.085])a(new e.CircleGeometry(.058,24),o(-E+n,_-.03,M-.485,Math.PI),"#D9DED6",.42,0),a(new e.TorusGeometry(.06,.006,6,24),o(-E+n,_-.03,M-.487),W,1,3),x(-E+n+.012,_-.018,M-.49,.045,.006,.004,"#B5412E",1,0);for(const n of[.3])for(let r=0;r<5;r++)x(n+r*.022,_-.004,M-.13,.012,.004,.09,"#1A2028",1,2);x(E,_-.22,M-.425,.3,.15,.008,F,.8,2),a(new e.SphereGeometry(.012,8,6),o(E,_-.17,M-.435),W,1,3),await w();const ne=o(-E,_-.06,M-.47,0,-.42);a(new e.TorusGeometry(.185,.013,10,40),ne,"#262E38",1,2);for(const n of[.52,2.62,4.71])a(new e.BoxGeometry(.185,.02,.01),ne.clone().multiply(X(n)).multiply(new e.Matrix4().makeTranslation(.092,0,0)),W,.8,3);a(new e.CylinderGeometry(.035,.04,.03,16),ne.clone().multiply(new e.Matrix4().makeRotationX(Math.PI/2)),"#262E38",1.2,2),a(new e.CylinderGeometry(.009,.012,.42,8),o(0,-.8,1.52,0,.35),W,.9,3),a(new e.SphereGeometry(.03,12,8),o(0,-.6,1.595),"#1F2730",1.4,2),await w();const Q=new e.BufferGeometry;Q.setAttribute("position",new e.Float32BufferAttribute(l,3)),Q.setAttribute("normal",new e.Float32BufferAttribute(C,3)),Q.setAttribute("color",new e.Float32BufferAttribute(B,3)),Q.setAttribute("aKind",new e.Float32BufferAttribute(P,1));const ee=c.shared||{},se={uRing:{value:0},uFwd:{value:0},uRingCol:{value:new e.Color(c.ring||"#CFE3F2")}},re=new e.Mesh(Q,new e.ShaderMaterial({uniforms:{...se,uSunW:ee.uSunW||{value:new e.Vector3(-.8,.2,.56)},uKeyCol:ee.uKeyCol||{value:new e.Color("#F0B59B")},uSkyA:{value:new e.Color(c.paneTop||"#9FB4C6")},uSkyB:{value:new e.Color(c.paneLow||"#F0C4A8")},uSeatBounce:{value:new e.Color(L)},uGeo:{value:new e.Vector4(p,i,f,y)},uPadY:{value:.025-Y}},vertexShader:Se,fragmentShader:Me,side:e.DoubleSide})),te=new e.PlaneGeometry(1,1),ve=n=>new e.ShaderMaterial({uniforms:{uA:{value:new e.Color(c.paneTop||"#9FB4C6")},uB:{value:new e.Color(c.paneLow||"#F0C4A8")},uTime:c.time||{value:0},uSize:{value:new e.Vector2(n[1]-n[0]+.04,n[3]-n[2]+.04)}},vertexShader:`varying vec2 vUv; varying float vPar;
      void main() { vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.);
        vec3 vd = cameraPosition - wp.xyz; vPar = dot(vd, normalize(mat3(modelMatrix) * vec3(1., 0., 0.))) / max(length(vd), 1e-3);
        gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`uniform vec3 uA; uniform vec3 uB; uniform float uTime; uniform vec2 uSize; varying vec2 vUv; varying float vPar;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y); }
      void main() {
        vec2 m = (vUv - .5) * uSize;                                             // metres from the middle of the pane
        vec2 q = abs(m) - uSize * .5 + .10; float d = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - .10;      // metres outside its rounded edge (inside: below zero)
        vec3 c = mix(mix(uB, vec3(.40, .48, .52), .8), uA, smoothstep(.1, .9, vUv.y)) * .9; float a = .035 + .05 * smoothstep(.5, 0., vUv.y);
        float sh = sin(vUv.x * 5. + vUv.y * 2.2 - uTime * 2.1) * .5 + .5;        // the sky sliding across the pane
        sh = sh * sh * (3. - 2. * sh); c *= .86 + .28 * sh; a += .035 * sh;
        // the far windows' sky in the glass: two bars on a slant of one in two, the second thinner; they move with the eye
        float sl = m.x + m.y * .5 + vPar * .35;
        float bar = (1. - smoothstep(.05, .12, abs(sl - .10))) + .6 * (1. - smoothstep(.015, .045, abs(sl + .09)));
        bar *= (1. - smoothstep(-.10, -.02, d)) * (.75 + .25 * vnoise(m * 9.));      // full 10 cm inside the pane's edge, none within 2 cm of it
        vec3 cr = mix(uB, uA, smoothstep(-.2, .25, m.y)) * 1.05;
        float ar = .085 * bar;
        // the glass's edge: a line of sky about 5 mm wide, 26 mm inside the pane's own edge. The pane's edge lies 20 mm under
        // the rubber and the bead is 6 mm wide, so the line runs along the bead's inner edge, where glass meets its trim
        float bev = (1. - smoothstep(.002, .005, abs(d + .026))) * .30;
        vec3 col = c * a; float al = a;
        col = col * (1. - ar) + cr * ar; al = al + ar * (1. - al);
        col = col * (1. - bev) + uA * bev; al = al + bev * (1. - al);
        gl_FragColor = vec4(col, al); }`,side:e.DoubleSide,transparent:!0,depthWrite:!1,premultipliedAlpha:!0}),le=[ve(j[0]),ve(j[1])],ae=new e.Group;ae.add(re);for(const n of[-1,1])for(let r=0;r<2;r++){const S=j[r],k=new e.Mesh(te,le[r]);k.scale.set(S[1]-S[0]+.04,S[3]-S[2]+.04,1),k.position.set(n*(p+.012),(S[2]+S[3])/2,(S[0]+S[1])/2),k.rotation.y=Math.PI/2,k.renderOrder=900,ae.add(k)}return re.frustumCulled=!1,{group:ae,uniforms:se,triangles:l.length/9,hw:i,hh:f,D:u}}async function Ge(c,w={}){const m=ge(w.palette),d=await be(c,m,w),u=new e.Group;return u.add(d.mesh),{object:u,radius:1.4,height:2.8,center:new e.Vector3(0,1.5,0),anchors:{},update(i,f,y){m.uTime.value=f,y&&y.getWorldPosition(m.uCamW.value);const l=f%16/16;d.uniforms.uHand.value=q(.4,.46,l)-q(.9,.96,l)},dispose(){},ground:!0,groundY:0}}function Fe(c){return new e.ShaderMaterial({uniforms:{...c},vertexShader:`uniform vec3 uCamW; attribute vec3 aLit; attribute vec3 aShd; varying vec3 vLit; varying vec3 vShd; varying vec3 vN; varying float vDist;
      void main() { vec4 wp = modelMatrix * vec4(position, 1.); vN = mat3(modelMatrix) * normal; vLit = aLit; vShd = aShd; vDist = distance(wp.xyz, uCamW);
        gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`${me}
      varying vec3 vLit; varying vec3 vShd; varying vec3 vN; varying float vDist;
      void main() { vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); vec3 c = mix(vShd, vLit, smoothstep(-.04, .04, dot(n, uSunW) + .1)); gl_FragColor = vec4(swFog(c, vDist), 1.); }`})}export{ye as EYE,oe as FAR_K,me as LIGHT_GLSL,ie as U_FREE,ue as U_TURN,Be as buildCar,ke as buildFarForms,be as buildFigure,ze as buildGlass,Ge as buildHero,fe as makeAcc,Ae as makeFiction,ge as makeShared,Fe as makeToonMaterial};
