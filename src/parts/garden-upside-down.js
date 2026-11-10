import*as s from"three";import{makeRng as ce,hashSeed as fe,clamp as X,lerp as I,smoothstep as le}from"../kit/core.js";const F=Math.PI*2,de=Math.PI/180,pe={off:13,low:17},$=7/5,z={R:250,RIM_Y:18,RIM_R:249.4,SUN:[Math.sin(pe.off*de)*Math.cos(pe.low*de),-Math.sin(pe.low*de),-Math.cos(pe.off*de)*Math.cos(pe.low*de)],KNOLL:{x:-58,z:-32,deep:44,s2:4050},ELM:{x:30,y:111,z:-66,trunk:83,crownR:30,crownZ:42.5,crownDz:-8,crownTop:28,crownLow:-27},GRAIN:{x:-20,y:-40,z:-205-14*$,body:14*$,spine:4*$,mouthR:5*$,rimR:7.6*$,keep:32,k:$,tube:9}},K={waves:3,half:[2.4,4.6],length:[150,260],hills:8,ring:[105,190],deep:[14,26],wide:[26,40],gate:34,keepElm:95,keepKnoll:115},J=(()=>{const o=ce(fe("garden-upside-down:the roll")),t=[],e=[],a=z.ELM,v=z.KNOLL;for(let m=0;m<K.waves;m++){const f=o.range(K.half[0],K.half[1]),c=F/o.range(K.length[0],K.length[1]),g=o()*F;t.push([f,Math.cos(g)*c,Math.sin(g)*c,o()*F])}const w=o()*F;for(let m=0;m<K.hills;m++){const f=w+(m+o.range(-.3,.3))/K.hills*F,c=o.range(K.ring[0],K.ring[1]),g=o.range(K.deep[0],K.deep[1]),y=o.range(K.wide[0],K.wide[1]),d=Math.cos(f)*c,u=Math.sin(f)*c;Math.hypot(d-a.x,u-a.z)<K.keepElm||Math.hypot(d-v.x,u-v.z)<K.keepKnoll||e.push([d,u,g,y])}return{waves:t,hills:e,gate:K.gate}})(),Ee=(o,t)=>{const e=z.ELM,a=(o*o+t*t)/(z.RIM_R*z.RIM_R);let v=0;for(const[w,m,f,c]of J.waves)v+=w*Math.sin(o*m+t*f+c);for(const[w,m,f,c]of J.hills)v-=f*Math.exp(-((o-w)**2+(t-m)**2)/(c*c));return v*Math.max(0,1-a*a)*(1-Math.exp(-((o-e.x)**2+(t-e.z)**2)/(J.gate*J.gate)))},Be=(o,t)=>{const e=z.KNOLL,a=(o*o+t*t)/(z.RIM_R*z.RIM_R);return z.RIM_Y+102*Math.sqrt(Math.max(0,1-a))-e.deep*Math.exp(-((o-e.x)**2+(t-e.z)**2)/e.s2)+Ee(o,t)},Ye=o=>{const t=new s.Color(o);return[t.r,t.g,t.b]};async function ze(o,t){const e=new Uint8Array(t*t*4),a=23.4,v=.005,w=t/2;for(let m=0;m<w;m++)for(let f=0;f<w;f++){const c=f/w*F-250,g=m/w*F-250;let y=c,d=g,u=1;for(let l=0;l<5;l++){const p=a*(1-3.5/(l+1)),n=c+Math.cos(p-y)+Math.sin(p+d),r=g+Math.sin(p-d)+Math.cos(p+y);y=n,d=r,u+=1/Math.hypot(c/(Math.sin(y+p)/v),g/(Math.cos(d+p)/v))}u=1.17-Math.pow(u/5,1.4);const i=Math.round(X(Math.pow(Math.abs(u),8),0,1)*255);for(let l=0;l<4;l++){const p=((m+(l>>1)*w)*t+f+(l&1)*w)*4;e[p]=e[p+1]=e[p+2]=i,e[p+3]=255}f%64===63&&await o.yield()}return Ae(e,t)}function Ae(o,t){const e=new s.DataTexture(o,t,t,s.RGBAFormat,s.UnsignedByteType);return e.wrapS=e.wrapT=s.RepeatWrapping,e.magFilter=s.LinearFilter,e.minFilter=s.LinearMipmapLinearFilter,e.generateMipmaps=!0,e.needsUpdate=!0,e}async function Re(o,t){const e=ce(fe("garden-upside-down:noise")),a=u=>{const i=new Float32Array(u*u);for(let l=0;l<i.length;l++)i[l]=e();return i},v=[[a(8),8],[a(16),16],[a(32),32],[a(64),64]],w=[[a(4),4],[a(8),8],[a(16),16],[a(32),32]],m=[a(128),128],f=(u,i,l,p)=>{const n=l*i,r=p*i,h=Math.floor(n),x=Math.floor(r),M=n-h,k=r-x,S=M*M*(3-2*M),b=k*k*(3-2*k),T=h%i,R=(h+1)%i,N=x%i*i,V=(x+1)%i*i;return I(I(u[N+T],u[N+R],S),I(u[V+T],u[V+R],S),b)},c=(u,i,l)=>{let p=0,n=0,r=1;for(const[h,x]of u)p+=r*f(h,x,i,l),n+=r,r*=.5;return p/n},g=12,y=[];for(let u=0;u<g*g;u++)y.push([e(),e()]);await o.yield();const d=new Uint8Array(t*t*4);for(let u=0;u<t;u++)for(let i=0;i<t;i++){const l=i/t,p=u/t,n=(u*t+i)*4;d[n]=Math.round(255*c(v,l,p)),d[n+1]=Math.round(255*c(w,l,p)),d[n+2]=Math.round(255*(.6*f(m[0],m[1],l,p)+.4*f(v[3][0],64,l,p)));const r=Math.floor(l*g),h=Math.floor(p*g);let x=9;for(let M=-1;M<=1;M++)for(let k=-1;k<=1;k++){const S=y[(h+M+g)%g*g+(r+k+g)%g],b=r+k+S[0]-l*g,T=h+M+S[1]-p*g;x=Math.min(x,b*b+T*T)}d[n+3]=Math.round(255*X(1-Math.sqrt(x)*1.1,0,1)),i%64===63&&await o.yield()}return Ae(d,t)}const Ie=`
uniform float uTime; uniform vec4 uShud;
varying vec3 vWp;
vec2 gSway(vec2 root, float ph) {
  float tr = sin(uTime * 1.1 - (root.x * .8 + root.y * .6) * .0917 + ph) * .65 + sin(uTime * .63 + root.y * .05 + ph * 1.7) * .35;
  float tl = mod(uTime + uShud.x, 14.) - (250. - root.x) * .01;
  float env = smoothstep(0., 1., tl) * (1. - smoothstep(1.4, 4.6, tl));
  return vec2(tr, env * sin(tl * 2.3));
}
`;function Ze(o,t,e,a,v){const w=Math.sin(a*1.1-(o*.8+t*.6)*.0917+e)*.65+Math.sin(a*.63+t*.05+e*1.7)*.35,m=((a+v)%14+14)%14-(250-o)*.01,f=le(0,1,m)*(1-le(1.4,4.6,m));return[w,f*Math.sin(m*2.3)]}const ue={from:226,low:10,full:24},P=o=>Number.isInteger(o)?o+".":String(o),De=`
uniform float uTime, uFogK, uFogKLand; uniform vec3 uSun, uSunCol, uFill, uDusk, uThru, uFogLo, uFogHi, uFogSun, uFarLand, uNa, uNb, uElmR; uniform vec4 uElm;
uniform sampler2D uNet, uNoise;
uniform vec4 uPool[10], uPoolSw[10]; uniform vec3 uPoolDir;
varying vec3 vWp;
// THE POOLS OF LIGHT: a place stands in a shaft's light where it lies inside that shaft's round, measured square to
// the sun's direction from the shaft's own axis, which sways about its foot on the world clock as the shaft is
// drawn. uPool: foot and half width; uPoolSw: the sweep (radians), its period, its phase, the strength.
float gPool(vec3 p) {
  float s = 0.;
  for (int i = 0; i < 10; i++) {
    vec3 v = p - uPool[i].xyz; float along = -dot(v, uSun);
    vec3 off = v + uSun * along - uPoolDir * (along * uPoolSw[i].x * sin(uTime * 6.2831853 / uPoolSw[i].y + uPoolSw[i].z));
    s += uPoolSw[i].w * (1. - smoothstep(uPool[i].w * .4, uPool[i].w * 1.05, length(off)));
  }
  return min(s, 1.);
}
// the roll of the meadow (RELIEF's own numbers), metres; under nought the turf hangs lower there (a brow)
float gRoll(vec2 p) {
  float q = dot(p, p) / 62200.36; vec2 e = p - vec2(${P(z.ELM.x)}, ${P(z.ELM.z)}), h;
  float s = ${J.waves.map(([o,t,e,a])=>`${P(o)} * sin(dot(p, vec2(${P(t)}, ${P(e)})) + ${P(a)})`).join(" + ")};
${J.hills.map(([o,t,e,a])=>`  h = p - vec2(${P(o)}, ${P(t)}); s -= ${P(e)} * exp(-dot(h, h) / ${P(a*a)});`).join(`
`)}
  return s * max(1. - q * q, 0.) * (1. - exp(-dot(e, e) / ${P(J.gate*J.gate)}));
}
float gYg(vec2 p) {
  vec2 k = p + vec2(58., 32.);
  return 18. + 102. * sqrt(max(1. - dot(p, p) / 62200.36, 0.)) - 44. * exp(-dot(k, k) / 4050.) + gRoll(p);
}
// two layers of bright cells, 6 to 9 m across, projected along the sun's direction, crawling on the world clock
float gNet(vec3 p) {
  vec2 q = vec2(dot(p, uNa), dot(p, uNb));
  float a = texture2D(uNet, q * .033 + uTime * vec2(.013, .008)).r;
  float b = texture2D(uNet, q.yx * .027 + vec2(.37, .11) - uTime * vec2(.007, .011)).r;
  return clamp(a + b * .8, 0., 1.4);
}
// how deep in the green dusk a place lies: 1 at the turf and in the heart of the crown, 0 in the open
float gDusk(vec3 p) {
  float turf = gYg(p.xz) - p.y;
  vec3 e = (p - uElm.xyz) / uElmR;
  return max(1. - smoothstep(0., 12., turf), 1. - smoothstep(.55, 1.05, length(e)));
}
// THE LONG SHADE OF THE ELM: paint on a face, by where the face stands. The crown (its own round, uElm and uElmR)
// stands between some places and the low sun: a place is in its shade where the straight line from it toward the sun
// passes through that round. The crown's own leaves are not asked (they have their own law of openness): the shade
// begins a third of the crown's width behind it. 1 in the sun, less in the shade.
float gSunlit(vec3 p) {
  vec3 q = (uElm.xyz - p) / uElmR, d = uSun / uElmR;
  float t = max(dot(q, d) / dot(d, d), 0.), m = length(q - d * t);
  return 1. - .8 * (1. - smoothstep(.62, 1.1, m)) * smoothstep(1.05, 1.45, length(q));
}
// alb: the thing's own colour; N: its face toward the eye (so light THROUGH a thing is seen only from its shade side); thin: how much light comes through it; ao: 0 hidden to 1 open;
// netK: how much of the nets it takes
vec3 gShade(vec3 alb, vec3 N, float thin, float ao, float netK) {
  float nl = dot(N, uSun), down = .5 - .5 * N.y, dusk = gDusk(vWp);
  float turf = gYg(vWp.xz) - vWp.y;
  // THE LOW SUN REACHES IN UNDER THE TURF ONLY SO FAR: its light comes in from the side through all that hangs,
  // so a place takes less of it the nearer it is to the turf (full from 30 m under the turf, three tenths at it).
  // THE ROLL OF THE MEADOW: what hangs from a brow (the turf lower than the vault's even round) stands out into the
  // low light and takes more of it; what hangs in a hollow takes less and lies in the blue-green shade. By the
  // face's own place; only within 70 m of the turf (the elm's crown and the grain are not asked).
  float brow = clamp(-gRoll(vWp.xz) / 8., -1., 1.) * (1. - smoothstep(30., 70., turf));
  // WHERE A SHAFT STANDS the low sun reaches right up to the turf, and stronger: a pool of gold light
  float pool = gPool(vWp);
  float sun = mix(gSunlit(vWp) * mix(.3, 1., smoothstep(2., 30., turf)) * (1. + .5 * brow), 2.1, pool);
  float net = gNet(vWp) * mix(.15, .55, smoothstep(-.25, .35, nl)) * netK * smoothstep(0., 4., turf);
  // the fill: pale sky from below, green dusk from above; the side of a thing that is turned from the sun takes less
  // of the sky's fill, so that its shade is plainly darker and green-blue
  vec3 fill = mix(uDusk * (1. + .55 * dusk), uFill * (1. - .45 * dusk), down) * mix(.62, 1., smoothstep(-.6, .5, nl)) * (1. + .22 * brow);
  vec3 c = alb * (uSunCol * max(nl, 0.) * ao * sun * (1. + 1.4 * net) + fill * (.4 + .6 * ao) + uSunCol * net * .12 * ao * sun);
  // light THROUGH a thin thing whose far side faces the sun: it glows young yellow-green, up to 1.6 times its lit colour
  c += uThru * (alb.g * 1.4) * thin * max(-nl, 0.) * ao * sun * (1. + .9 * net) * (uSunCol.g * .58);
  // in a pool the light is scattered among all that hangs: every face takes some of it, gold-green
  c += alb * vec3(1.3, 1., .38) * (pool * (.5 + .4 * ao));
  // a lit thing is never a lamp: the sum bends over softly near white (the glows named are added after this law)
  float top = max(c.r, max(c.g, c.b));
  return c / (1. + max(top - .8, 0.) * .75);
}
// the haze of the water, warm BY PLACE: pale gold where the sight line runs toward the sun, blue away from it
vec3 gHaze(vec3 dir, float y) {
  float tow = clamp(dot(dir, uSun), 0., 1.);
  return mix(mix(uFogLo, uFogHi, smoothstep(0., 20., y)), uFogSun, tow * tow * tow * tow * tow * tow * .5);
}
// THE LAND STANDS BACK IN ITS OWN HAZE (round five), by where a thing stands: what hangs from the vault (over the
// rim's level) fades with its distance in a thicker haze than the open sky under it, so the far meadow, its
// hillocks and its far trees are paler and bluer plane behind plane; and AT THE RIM STANDS A MIST: within
// ${P(z.RIM_R-ue.from)} m of the rim's circle everything of the land goes into the pale mist the sky has at the level, wholly at the
// rim itself. The mist is a place of the world (the round of the rim, over the level): nothing asks where the eye is.
float gMist(vec3 p) { return smoothstep(${P(ue.from)}, ${P(z.RIM_R)}, length(p.xz)) * smoothstep(${P(ue.low)}, ${P(ue.full)}, p.y); }
vec3 gFog(vec3 c) {
  vec3 v = vWp - cameraPosition; float d = length(v), land = smoothstep(${P(ue.low)}, ${P(ue.full+12)}, vWp.y), k = mix(uFogK, uFogKLand, land);
  float f = 1. - exp(-pow(d * k, 2.)), m = gMist(vWp);
  // THE FAR MEADOW HAS ITS OWN SOFT FAR COLOUR (round six): what hangs from the vault fades, with its distance and
  // in the rim's mist, into a blue green (uFarLand: the meadow's own green gone into the air), never into the pale
  // of the sky: the land's edge meets the sky as land
  vec3 far = mix(gHaze(v / max(d, 1e-3), vWp.y), uFarLand, land * .78);
  return mix(c, far, 1. - (1. - f) * (1. - m * m * .9));
}
`;async function ke(o,t={}){const e=new s.Vector3().fromArray(z.SUN),a=new s.Vector3().crossVectors(e,new s.Vector3(1,0,0)).normalize(),v=new s.Vector3().crossVectors(e,a).normalize(),w=await ze(o,256);await o.yield();const m=await Re(o,256);await o.yield();const f=z.ELM,c=(y,d=1)=>new s.Color(y).multiplyScalar(d);return{U:{uTime:{value:0},uShud:{value:new s.Vector4(t.shudPhase??0,t.shudBlade??.07,t.shudElm??.017,0)},uSun:{value:e},uSunCol:{value:c(t.sun??"#FFE6A8",t.sunK??1.9)},uFill:{value:c("#BFDDF6",.6)},uDusk:{value:c("#1F5A46",.33)},uThru:{value:c("#B9EE7C",1)},uFogLo:{value:c(t.haze??"#7DB6F0",.74)},uFogHi:{value:c("#A8CCEA",.78)},uFogSun:{value:c(t.hazeSun??"#FFE9B4",.95)},uFarLand:{value:c("#7FB3A6",.75)},uFogK:{value:.0016},uFogKLand:{value:.002},uNa:{value:a},uNb:{value:v},uNet:{value:w},uNoise:{value:m},uElm:{value:new s.Vector4(f.x,(f.crownTop+f.crownLow)/2,f.z+f.crownDz,f.crownR)},uElmR:{value:new s.Vector3(f.crownR,(f.crownTop-f.crownLow)/2+1,f.crownZ)},uPool:{value:Array.from({length:10},()=>new s.Vector4(0,0,0,1))},uPoolSw:{value:Array.from({length:10},()=>new s.Vector4(0,1,0,0))},uPoolDir:{value:new s.Vector3().crossVectors(new s.Vector3().crossVectors(e,new s.Vector3(0,1,0)).normalize(),e).negate()}},GV:Ie,GF:De,sun:e,net:w,noise:m,dispose(){w.dispose(),m.dispose()}}}function Ve(o,t,e={}){const a=new s.InstancedBufferGeometry;a.setAttribute("position",new s.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),a.setIndex([0,1,2,0,2,3]);const v=t.length,w=new Float32Array(v*4),m=new Float32Array(v*4);let f=[1e9,1e9,1e9],c=[-1e9,-1e9,-1e9];t.forEach((u,i)=>{w.set([u[0],u[1],u[2],u[3]],i*4),m.set([u[4],u[5],u[6],u[7]],i*4);for(let l=0;l<3;l++)f[l]=Math.min(f[l],u[l]),c[l]=Math.max(c[l],u[l]+(l===1?u[6]:0))}),a.setAttribute("iA",new s.InstancedBufferAttribute(w,4)),a.setAttribute("iB",new s.InstancedBufferAttribute(m,4)),a.instanceCount=v;const g=new s.Vector3((f[0]+c[0])/2,(f[1]+c[1])/2,(f[2]+c[2])/2);a.boundingSphere=new s.Sphere(g,Math.hypot(c[0]-f[0],c[1]-f[1],c[2]-f[2])/2+4);const y=new s.ShaderMaterial({uniforms:{...o.U,uGold:{value:new s.Color(e.color??"#F2B63A").multiplyScalar(e.glow??1.6)},uLeaf:{value:e.leaf?1:0},uBody:{value:e.body?1:0}},transparent:!0,depthWrite:!1,vertexShader:`
      uniform float uTime, uLeaf, uBody; attribute vec4 iA, iB; varying vec2 vQ; varying vec3 vWp; varying float vFade, vKind, vSpin;
      void main() {
        vSpin = iB.x * 37. + uTime * (.5 + iB.x) * uLeaf;
        float k = fract(iB.x + uTime * iA.w / max(iB.z, 1.));
        vec3 p = iA.xyz + vec3(sin(uTime * .7 + iB.x * 40.) * .4, k * iB.z, cos(uTime * .5 + iB.x * 23.) * .4);
        vec4 wp = modelMatrix * vec4(p, 1.);
        vec4 mv = viewMatrix * wp;
        float d = length(mv.xyz);
        mv.xy += position.xy * iB.y;
        vQ = position.xy; vWp = wp.xyz; vKind = iB.w;
        vFade = mix(smoothstep(.6, 2.5, d), 1., max(step(.5, iB.w), uBody)) * smoothstep(0., .08, k) * (1. - smoothstep(.92, 1., k));
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uGold, uFogLo; uniform float uFogK, uLeaf; varying vec2 vQ; varying vec3 vWp; varying float vFade, vKind, vSpin;
      void main() {
        float r = length(vQ), cs = cos(vSpin), sn = sin(vSpin);
        // a leaf: a pointed oval seen flat or edge on as it turns
        vec2 lq = vec2(vQ.x * cs - vQ.y * sn, (vQ.x * sn + vQ.y * cs) * (1.6 + 1.2 * sin(vSpin * .7)));
        float leaf = 1. - smoothstep(.7, 1., length(lq) + abs(lq.x) * .25);
        // a round mote; a seed is a soft tuft of down with a pale heart
        float tuft = (1. - smoothstep(0., 1., r)) * .55 + (1. - smoothstep(0., .3, r)) * .4;
        float a = mix(mix(1. - smoothstep(.35, 1., r), tuft, vKind), leaf, uLeaf) * vFade;
        if (a < .01) discard;
        vec3 c = mix(uGold, vec3(1.25, 1.22, 1.1), vKind);
        float f = 1. - exp(-pow(distance(vWp, cameraPosition) * uFogK, 2.));
        gl_FragColor = vec4(mix(c, uFogLo, f), a);
      }`}),d=new s.Mesh(a,y);return d.renderOrder=6,d}const Fe="garden-upside-down:the grain",we=(o,t)=>[Math.sin(o)*Math.cos(t),Math.sin(o)*Math.sin(t),Math.cos(o)];async function Se(o,t,e,a,v,w,m=[]){const f=[],c=Math.cos(a);for(let g=0;f.length<e&&g<e*60;g++){g%12===11&&await o.yield();const y=I(Math.cos(w),Math.cos(v),t()),d=t()*F,u=Math.sqrt(Math.max(0,1-y*y)),i=[u*Math.cos(d),u*Math.sin(d),y];let l=!0;for(const p of f)if(p[0]*i[0]+p[1]*i[1]+p[2]*i[2]>c){l=!1;break}if(l){for(const p of m)if(p.d[0]*i[0]+p.d[1]*i[1]+p.d[2]*i[2]>Math.cos(p.keep)){l=!1;break}}l&&f.push(i)}return f}async function Ge(o,t,e,a){const m=[],f=[],c=[],g=[];for(let u=0;u<9;u++)g.push([a.range(1.5,4),a()*F,a.range(1.5,4),a()*F]);const y=(u,i)=>{let l=0;for(const p of g)l+=Math.sin(u*p[0]+p[1])*Math.sin(i*Math.round(p[2])+p[3]);return t*(1+.006*l*le(e,e+.5,u))};for(let u=0;u<=46;u++){const i=I(e,Math.PI,u/46);for(let l=0;l<=64;l++){const p=l/64*F,n=we(i,p),r=y(i,p);m.push(n[0]*r,n[1]*r,n[2]*r),f.push(n[0],n[1],n[2])}u%4===3&&await o.yield()}for(let u=0;u<46;u++)for(let i=0;i<64;i++){const l=u*65+i,p=l+64+1;c.push(l,p,l+1,l+1,p,p+1)}await o.yield();const d=new s.BufferGeometry;return d.setAttribute("position",new s.Float32BufferAttribute(m,3)),d.setAttribute("normal",new s.Float32BufferAttribute(f,3)),d.setIndex(c),d}function Ue(o,t){const e=i=>Math.sqrt(t*t-i*i),a=z.GRAIN.k,v=[[5.02,3.4],[5.02,.22],[5.07,.07],[5.2,0],[6.75,0],[7.2,.12],[7.5,.45],[7.6,.95],[7.56,1.5]].map(([i,l])=>[i*a,o-l*a]);v.push([7.42*a,e(7.42*a)+.1*a],[7.25*a,e(7.25*a)-.35*a]);const w=72,m=[],f=[],c=v.length;for(let i=0;i<c;i++)for(let l=0;l<=w;l++){const p=l/w*F;m.push(v[i][0]*Math.cos(p),v[i][0]*Math.sin(p),v[i][1])}for(let i=0;i<c-1;i++)for(let l=0;l<w;l++){const p=i*(w+1)+l,n=p+w+1;f.push(p,n,p+1,p+1,n,n+1)}const g=new s.BufferGeometry;g.setAttribute("position",new s.Float32BufferAttribute(m,3)),g.setIndex(f);const y=g.toNonIndexed();y.computeVertexNormals();const d=y.attributes.position,u=y.attributes.normal;for(let i=0;i<d.count;i+=3)for(let l=0;l<3;l++){const p=d.getX(i+l),n=d.getY(i+l),r=Math.hypot(p,n)||1,h=u.getX(i+l),x=u.getY(i+l),M=Math.hypot(h,x),k=h*p+x*n>=0?1:-1;u.setXYZ(i+l,k*M*p/r,k*M*n/r,u.getZ(i+l))}return y}function Pe(){const e=[],a=[],v=[],w=[];for(let f=0;f<=4;f++){const c=f/4,g=.5*Math.pow(1-c,.8)*(1+.5*Math.exp(-c*9))+.015,y=.09*c*c;for(let d=0;d<=7;d++){const u=d/7*F;e.push(Math.cos(u)*g+y,c,Math.sin(u)*g),a.push(Math.cos(u),.14,Math.sin(u)),v.push(c)}}for(let f=0;f<4;f++)for(let c=0;c<7;c++){const g=f*8+c,y=g+7+1;w.push(g,y,g+1,g+1,y,y+1)}const m=new s.BufferGeometry;return m.setAttribute("position",new s.Float32BufferAttribute(e,3)),m.setAttribute("normal",new s.Float32BufferAttribute(a,3)),m.setAttribute("aTip",new s.Float32BufferAttribute(v,1)),m.setIndex(w),m}function Oe(){const o=new s.SphereGeometry(1,6,2,0,F,0,Math.PI/2);return o.deleteAttribute("uv"),o}function Ne(o,t,e=new s.Quaternion){return e.setFromUnitVectors(new s.Vector3(0,1,0),new s.Vector3(o[0],o[1],o[2])),e.multiply(new s.Quaternion().setFromAxisAngle(new s.Vector3(0,1,0),t))}const We=`
attribute float aTip; uniform float uFlex; uniform vec3 uPh;
varying vec3 vLp, vN; varying float vTip, vSpark;
void main() {
  vec4 lp = vec4(position, 1.); vec3 n = normal; vTip = aTip; vSpark = 0.;
  #ifdef USE_INSTANCING
    // THE TIPS SPARKLE IN TURN: each spine has a beat of its own on the world clock (its foot's place gives the beat
    // and the moment); for a short while in every beat its tip flashes
    float beat = fract(sin(dot(instanceMatrix[3].xyz, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
    vSpark = pow(max(sin(uTime * (.55 + .5 * beat) + beat * 61.), 0.), 28.);
    // spine tips flex a little on the world clock (0.1 m at most); bodies, rim and warts have uFlex 0
    lp.xz += uFlex * aTip * aTip * vec2(sin(uTime * 1.7 + uPh.y + instanceMatrix[3].x), cos(uTime * 1.3 + uPh.z + instanceMatrix[3].y)) / max(length(instanceMatrix[0].xyz), .2);
    lp = instanceMatrix * lp; n = mat3(instanceMatrix) * n;
  #endif
  vLp = lp.xyz; vN = normalize(mat3(modelMatrix) * n);
  vec4 wp = modelMatrix * lp; vWp = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Ce=`
uniform vec3 uGold, uAmber, uPale, uPh; uniform float uKind, uGlint; uniform vec4 uFur[12];
varying vec3 vLp, vN; varying float vTip, vSpark;
float rindH(vec3 p, vec3 n, float s) {
  vec3 w = n * n;
  vec4 a = texture2D(uNoise, p.yz * s), b = texture2D(uNoise, p.zx * s), c = texture2D(uNoise, p.xy * s);
  vec4 m = a * w.x + b * w.y + c * w.z;
  return m.a * .65 + m.b * .35;
}
vec3 bump(vec3 N, float h, float k) {
  vec3 dpx = dFdx(vWp), dpy = dFdy(vWp); float hx = dFdx(h), hy = dFdy(h);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
  vec3 g = sign(det) * (hx * r1 + hy * r2);
  return normalize(abs(det) * N - k * g);
}
void main() {
  vec3 N = normalize(vN), V = normalize(cameraPosition - vWp);
  if (!gl_FrontFacing) N = -N;
  vec3 ln = normalize(vLp);
  // the pebbled rind: grains of a tenth to a third of a metre, and a slower mottle
  float h = rindH(vLp, abs(ln), .24), mott = rindH(vLp, abs(ln), .05);
  // the fine grain fades by ITS OWN WIDTH AS DRAWN (how many metres of the rind one drawn point spans), never
  // by how far the eye is; the slow mottle is always felt
  float span = fwidth(vLp.x) + fwidth(vLp.y) + fwidth(vLp.z);
  vec3 Nb = bump(N, h, (uKind > 1.5 ? .012 : .04) * (1. - smoothstep(.08, .32, span)));
  Nb = bump(Nb, mott, uKind > 1.5 ? .05 : .32);
  // furrows: a few shallow grooves from the back toward the mouth, each on a wandering meridian of its own
  float th = acos(clamp(ln.z, -1., 1.)), ph = atan(ln.y, ln.x + 1e-5), rs = 14. * sin(th), fur = 0.;
  for (int i = 0; i < 12; i++) {
    vec4 f = uFur[i];
    float dd = abs(mod(ph - f.x - f.y * sin(th * f.z + f.w) + 3.14159265, 6.2831853) - 3.14159265) * rs;
    fur = max(fur, (1. - smoothstep(.07, .3, dd)) * step(.5, f.y + 1.));
  }
  fur *= smoothstep(.72, .98, th) * (1. - smoothstep(2.72, 2.95, th)) * step(uKind, .5);
  vec3 alb = uGold * mix(.74, 1.12, h) * mix(.86, 1.08, mott);
  alb = mix(alb, alb * vec3(.5, .36, .22), fur * .85);
  float ao = 1. - .45 * fur;
  if (uKind > .5 && uKind < 1.5) ao *= mix(.55, 1., smoothstep(0., .22, length(vLp) - ${(14*$).toFixed(2)}));
  // spines: pale gold, half clear toward the tip
  float tip = uKind > 1.5 ? vTip : 0.;
  alb = mix(alb, uPale, tip * .8 * mix(.35, 1., smoothstep(-.2, .5, dot(N, uSun))));
  // the lip of the mouth is round like the lip of a jar: its face turns outward from its crown line (a fifth of the mouth's radius outside the opening)
  if (uKind > 2.5) { float rr = length(vLp.xy); Nb = normalize(Nb + vec3(vLp.xy / max(rr, .01), 0.) * clamp((rr - ${(5.95*$).toFixed(2)}) / ${(.9*$).toFixed(2)}, -1., 1.) * .9); }
  // LIT FROM ONE SIDE by the low sun: the side toward it is bright gold, the side away from it a deep amber (the
  // sky's fill hardly tells there; the light that soaks into the wall is the grain's own amber on every side)
  float nl = dot(Nb, uSun), lit = smoothstep(-.2, .5, nl);
  vec3 c = gShade(alb, Nb, 0., ao, 1.) * mix(.24, .74, lit);
  c += uAmber * mix(.75, 1.1, h) * mix(.5, .3, lit) * ao;
  c += uSunCol * pow(max(dot(Nb, normalize(uSun + V)), 0.), 22.) * .35 * ao * step(0., nl);
  // spine tips: clear gold that catches the light, and a glint that runs over the ball in a slow wave
  float rim = pow(max(1. - abs(dot(N, V)), 0.), 2.);
  float wave = pow(.5 + .5 * sin(uTime * 1.25 + uPh.x - dot(ln, vec3(.6, .5, .62)) * 5.5), 6.);
  c += uPale * tip * tip * (.6 + 1.2 * rim + uGlint * wave * smoothstep(.55, 1., tip)) * mix(.16, 1., lit);
  c += vec3(1., .86, .5) * vSpark * smoothstep(.6, 1., tip) * (1.2 + 2.6 * lit);
  // THE LOW SUN STANDS BEYOND THE GRAIN: seen against it (the sight from this place of the rind running toward the
  // sun) the outline burns gold, the spines most of all, for they are half clear and the light comes through them
  float against = pow(max(dot(-V, uSun), 0.), 3.);
  c += vec3(1., .74, .26) * against * (rim * rim * (.5 + 2.2 * tip) + tip * tip * .9) * ao;
  // the lip of the mouth takes the light: a ring of pale gold round the dark opening (its own lit face, no card);
  // THE INNER LIP IS A LIT DOORWAY: the lip is thin, and on the arc where the sun stands behind its wall (the sun's
  // side and under) the light comes through it, gold, strongest at the throat
  if (uKind > 2.5) {
    float rr = length(vLp.xy), arc = dot(vLp.xy / max(rr, .01), normalize(uSun.xy + 1e-4));
    c += uPale * (.2 + .45 * rim) + vec3(1., .7, .22) * smoothstep(-.25, .75, arc) * (1. - smoothstep(${(5.2*$).toFixed(2)}, ${(6.6*$).toFixed(2)}, rr)) * 1.25;
  }
  gl_FragColor = vec4(gFog(c), 1.);
}`;async function Xe(o,t={}){const e=z.GRAIN,a=e.body,v=!t.shared,w=t.shared||await ke(o,t),m=ce(fe(Fe)),f=m.fork("body"),c=m.fork("spines"),g=m.fork("warts"),y=m.fork("furrows"),d=m.fork("dust");await o.yield();const u=new s.Group;u.name="the grain";const i=a,l=e.k,p=Math.asin(7.3*l/a),n=ce(fe(Fe+":clock")),r=new s.Vector3(n()*F,n()*F,n()*F),h=[],x=11;for(let A=0;A<12;A++)h.push(A<x?new s.Vector4((A+y.range(-.32,.32))/x*F,y.range(.05,.16),y.range(1.5,3.5),y()*F):new s.Vector4(0,-2,0,0));const M=(A,E={})=>new s.ShaderMaterial({uniforms:{...w.U,uGold:{value:new s.Color("#E9B32A")},uAmber:{value:new s.Color("#8A5A14").multiplyScalar(.9)},uPale:{value:new s.Color("#FFE9A6")},uKind:{value:A},uGlint:{value:A===2?2.2:0},uFlex:{value:A===2?.1:0},uFur:{value:h},uPh:{value:r}},vertexShader:w.GV+We,fragmentShader:w.GF+Ce,...E});await o.yield();const k=new s.Mesh(await Ge(o,a,p,f),M(0));k.name="grain body",u.add(k),await o.yield();const S=Ue(i,a);await o.yield();const b=new s.Mesh(S,M(3,{side:s.DoubleSide}));b.name="grain rim",u.add(b),await o.yield();const T=e.keep*Math.PI/180,R=[],N=15;for(let A=0;A<N;A++){const E=(A+c.range(-.3,.3))/N*F,B=T+c.range(.035,.1),G=c.range(.2,.34);R.push({d:we(B,E),ax:we(B+G,E),keep:.2})}for(const A of await Se(o,c,138,.235,T+.2,Math.PI,R))R.push({d:A,ax:null,keep:.2});await o.yield();const V=new s.InstancedMesh(Pe(),M(2),R.length);V.name="grain spines",await o.yield();const _=new s.Matrix4,L=new s.Quaternion,H=new s.Vector3,Z=new s.Vector3;let te=1e9;R.forEach((A,E)=>{const B=A.ax||[A.d[0]+c.range(-.12,.12),A.d[1]+c.range(-.12,.12),A.d[2]+c.range(-.12,.12)],G=Math.hypot(B[0],B[1],B[2]),C=[B[0]/G,B[1]/G,B[2]/G],O=c.range(3.3*l,e.spine),q=c.range(1.1,1.4)*l;Ne(C,c()*F,L),H.set(A.d[0],A.d[1],A.d[2]).multiplyScalar(a-.2),Z.set(q,O,q),V.setMatrixAt(E,_.compose(H,L,Z)),A.tip=[H.x+C[0]*O,H.y+C[1]*O,H.z+C[2]*O],A.len=O,A.tip[2]>0&&(te=Math.min(te,Math.hypot(A.tip[0],A.tip[1])))}),u.add(V),await o.yield();const D=await Se(o,g,300,.076,T+.07,Math.PI-.03,R.map(A=>({d:A.d,keep:.085})));await o.yield();const j=new s.InstancedMesh(Oe(),M(1),D.length);j.name="grain warts",await o.yield(),D.forEach((A,E)=>{const B=g.range(.25,.55)*l,G=g.range(.8,1.25);Ne(A,g()*F,L),H.set(A[0],A[1],A[2]).multiplyScalar(a-.03),Z.set(B*G,g.range(.2,.27)*l,B/G),j.setMatrixAt(E,_.compose(H,L,Z))}),u.add(j),await o.yield();const re=[],ie=e.tube+1.5;for(let A=0;re.length<240&&A<4e3;A++){A%16===15&&await o.yield();const E=d()*F,B=d.range(a+e.spine+1.5,a+22*l),G=Math.cos(E)*B,C=Math.sin(E)*B;if(Math.abs(G)<ie&&C>0)continue;const O=d.range(14,30),q=d.range(-24,20-O*.4),me=d.range(.5,1.6),he=d(),be=d.range(.09,.22);t.onSight&&t.onSight(G,q,q+O,C,be)||re.push([G,q,C,me,he,be,O,0])}await o.yield();const oe=Ve(w,re,{glow:1.6});oe.name="grain dust",u.add(oe),await o.yield();const ae=m.fork("halo"),se=[];for(let A=0;se.length<120&&A<2400;A++){A%8===7&&await o.yield();const E=we(Math.acos(ae.range(-1,1)),ae()*F),B=ae.range(2.4,5),G=a+e.spine*.5+B*.5+ae.range(0,7),C=E[0]*G,O=E[1]*G,q=E[2]*G;q+B>0&&Math.hypot(C,O)<ie+B||t.onSight&&t.onSight(C,O-B,O+B,q,B)||se.push(C,O,q,B,ae()*F,.12+.88*le(-.4,.7,E[0]*w.sun.x+E[1]*w.sun.y+E[2]*w.sun.z),0,0)}await o.yield();const Q=new s.InstancedBufferGeometry,W=new s.InstancedInterleavedBuffer(new Float32Array(se),8);Q.setAttribute("position",new s.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),Q.setIndex([0,1,2,0,2,3]),Q.setAttribute("iA",new s.InterleavedBufferAttribute(W,4,0)),Q.setAttribute("iB",new s.InterleavedBufferAttribute(W,4,4)),Q.instanceCount=se.length/8,Q.boundingSphere=new s.Sphere(new s.Vector3(0,0,0),a+e.spine+26);const U=new s.Mesh(Q,new s.ShaderMaterial({uniforms:{...w.U,uGold:{value:new s.Color("#FFB93A")}},transparent:!0,depthWrite:!1,blending:s.AdditiveBlending,vertexShader:w.GV+`
      attribute vec4 iA, iB; varying vec2 vQ; varying float vB;
      void main() {
        vec4 wp = modelMatrix * vec4(iA.xyz, 1.), mv = viewMatrix * wp; mv.xy += position.xy * iA.w * (1. + .1 * sin(uTime * .35 + iB.x));
        vQ = position.xy; vB = iB.y * (.8 + .2 * sin(uTime * .5 + iB.x * 3.)); vWp = wp.xyz; gl_Position = projectionMatrix * mv;
      }`,fragmentShader:w.GF+`
      uniform vec3 uGold; varying vec2 vQ; varying float vB;
      void main() { float e = 1. - dot(vQ, vQ); if (e < 0.) discard; gl_FragColor = vec4(uGold * (.5 + .5 * vB), e * e * .16 * vB); }`}));return U.name="grain halo",U.renderOrder=3,u.add(U),{object:u,radius:a+e.spine,height:2*(a+e.spine),center:new s.Vector3(0,0,0),ground:!1,anchors:{portalCentre:new s.Vector3(0,0,i),exitDir:new s.Vector3(0,0,-1),rimInner:e.mouthR,rimOuter:e.rimR,spineTipNear:te,dustTube:ie},spines:R,update(A,E){v&&(w.U.uTime.value=E)},dispose(){v&&w.dispose()}}}const Ke="garden-upside-down:the elm",ne={trunk:z.ELM.trunk,low:z.ELM.y-z.ELM.crownLow,rx:z.ELM.crownR,rz:z.ELM.crownZ,dz:z.ELM.crownDz,rootR:15.5,trunkR:[4.5,3],roots:7},ee=[{y0:-84,y1:-99,f:.74,n:30},{y0:-104,y1:-122,f:1,n:52},{y0:-127,y1:-138,f:.62,n:18}],ye={room:6,from:.5,share:.7},Y={rx:[2.7,8.2],few:2,round:[.72,.96],apart:.8,leaves:.5,count:[60,400]},xe=(o,t)=>Math.hypot(o/ne.rx,(t-ne.dz)/ne.rz),Je=(o,t)=>{const e=xe(o,t);for(let a=ee.length-1;a>=0;a--)if(e<=ee[a].f)return ee[a].y1;return 0};function ve(o,t,e,a,v=0){const w=t.length,m=new s.Vector3,f=new s.Vector3,c=new s.Vector3,g=new s.Vector3,y=new s.Quaternion,d=o.pos.length/3;let u=0;for(let i=0;i<w;i++){const l=t[Math.max(0,i-1)],p=t[Math.min(w-1,i+1)];m.set(p[0]-l[0],p[1]-l[1],p[2]-l[2]).normalize(),i===0?(f.set(1,0,0),Math.abs(m.x)>.9&&f.set(0,0,1),f.addScaledVector(m,-f.dot(m)).normalize()):(y.setFromUnitVectors(g,m),f.applyQuaternion(y).addScaledVector(m,-f.dot(m)).normalize(),u+=Math.hypot(t[i][0]-t[i-1][0],t[i][1]-t[i-1][1],t[i][2]-t[i-1][2])),g.copy(m),c.crossVectors(m,f);for(let n=0;n<=a;n++){const r=n/a*F+v,h=Math.cos(r),x=Math.sin(r),M=typeof e=="function"?e(i,r):e[i],k=f.x*h+c.x*x,S=f.y*h+c.y*x,b=f.z*h+c.z*x;o.pos.push(t[i][0]+k*M,t[i][1]+S*M,t[i][2]+b*M),o.nor.push(k,S,b),o.uv.push(n/a*F*(typeof e=="function"?2.6:e[i]),u)}}for(let i=0;i<w-1;i++)for(let l=0;l<a;l++){const p=d+i*(a+1)+l,n=p+a+1;o.idx.push(p,p+1,n,p+1,n+1,n)}}function ge(o,t,e,a,v,w=0){const m=[],f=Math.hypot(e[0]-o[0],e[1]-o[1],e[2]-o[2]),c=[o[0]+t[0]*f*.4,o[1]+t[1]*f*.4,o[2]+t[2]*f*.4],g=[e[0],e[1]+f*v,e[2]];for(let y=0;y<=a;y++){const d=y/a,u=(1-d)**3,i=3*(1-d)**2*d,l=3*(1-d)*d*d,p=d**3,n=w*Math.sin(Math.PI*d),r=n*Math.sin(y*2.3+e[0]*.7),h=n*.5*Math.sin(y*1.7+e[2]*.9),x=n*Math.sin(y*2.9+e[1]*.3);m.push([u*o[0]+i*c[0]+l*g[0]+p*e[0]+r,u*o[1]+i*c[1]+l*g[1]+p*e[1]+h,u*o[2]+i*c[2]+l*g[2]+p*e[2]+x])}return m}async function He(o){const t=ce(fe(Ke+":tiers")),e=ne,a=[],v=[],w=[],m=(n,r,h)=>[Math.cos(r)*n*e.rx,h,e.dz+Math.sin(r)*n*e.rz],f=n=>{const r=Math.hypot(n[0],n[1],n[2])||1;return[n[0]/r,n[1]/r,n[2]/r]},c=(n,r,h)=>{const x=[];for(let M=0;M<=n;M++)x.push(I(r,h,Math.pow(M/n,.8)));return x},g=[0,-e.trunk,0];v.push({c:[0,-e.low+4.2,0],rx:4.4,ry:4.2,tier:2});for(let n=0;n<ee.length;n++){const r=ee[n];for(let h=0;h<r.n;h++)for(let x=0;x<200;x++){x%24===0&&await o.yield();const M=I(Y.rx[0],Y.rx[1],Math.pow(t(),Y.few)),k=Math.min(M*t.range(Y.round[0],Y.round[1]),(r.y0-r.y1)/2),S=t()*F,b=Math.min(Math.sqrt(t.range(n===2?.02:.1,1))*r.f,r.f-M/Math.hypot(Math.cos(S)*e.rx,Math.sin(S)*e.rz)),T=m(b,S,X(I(r.y0-k,r.y1+ye.room+k,X(Math.pow(b/r.f,1.6)*t.range(.7,1.15),0,1)),r.y1+k,r.y0-k));let R=!0;for(const N of v)if(Math.hypot(T[0]-N.c[0],(T[1]-N.c[1])*1.3,T[2]-N.c[2])<(M+N.rx)*Y.apart){R=!1;break}if(R){if(v.push({c:T,rx:M,ry:k,tier:n}),b/r.f>ye.from&&t()<ye.share){const N=t.range(2,3),V=Math.min(t.range(3.4,5.2),(T[1]-k*.4-r.y1)/2),_=S+t.range(-.8,.8),L=[T[0]+Math.cos(_)*M*.5,T[1]-k*.4-V,T[2]+Math.sin(_)*M*.5];V>2&&xe(L[0],L[2])+N/Math.min(e.rx,e.rz)<=r.f&&v.push({c:L,rx:N,ry:V,tier:n,droop:!0})}break}}}await o.yield();const y=(n,r,h,x,M,k=6,S=6)=>{const b=m(h,r,x),T=f([b[0]-n[0],-.35*Math.hypot(b[0]-n[0],b[2]-n[2]),b[2]-n[2]]);a.push({pts:ge(n,T,b,k,.22,.5),rad:c(k,M,M*.42),sides:S})},d=ee[1],u=ee[0],i=ee[2];[[-F/4,-43],[F*.09,-53],[F*.43,-63]].forEach(([n,r])=>{const h=f([Math.cos(n),-.42,Math.sin(n)]),x=I(e.trunkR[0],e.trunkR[1],-r/e.trunk),M=ge([h[0]*x*.6,r,h[2]*x*.6],h,m(.62,n,d.y0-2),13,.3,1.3);a.push({pts:M,rad:c(13,2.6,1.1),sides:10,great:!0}),y(M[11],n+t.range(-.1,.1),.93,I(d.y0,d.y1,.6),1,7),y(M[10],n-t.range(.42,.6),.86,I(d.y0,d.y1,.5),.9),y(M[10],n+t.range(.42,.6),.86,I(d.y0,d.y1,.5),.9),y(M[6],n+t.range(-.3,.3),u.f*.9,I(u.y0,u.y1,.6),.75)}),await o.yield();for(let n=0;n<5;n++){const r=(n+.5+t.range(-.2,.2))/5*F,h=f([Math.cos(r),-.5,Math.sin(r)]),x=ge([h[0]*1.4,g[1]+1.5,h[2]*1.4],h,m(u.f*.5,r,u.y0-4),8,.25,.7);a.push({pts:x,rad:c(8,1.6,.7),sides:8}),y(x[6],r-t.range(.25,.45),u.f*.88,I(u.y0,u.y1,.65),.55),y(x[6],r+t.range(.25,.45),u.f*.88,I(u.y0,u.y1,.65),.55)}await o.yield();const l=[[0,g[1]+2,0],[.8,-96,e.dz*.25],[-.6,-108,e.dz*.5],[.4,-120,e.dz*.75],[0,-129,e.dz*.9]];a.push({pts:l,rad:c(4,1.5,.6),sides:8});for(let n=0;n<4;n++)y(l[2],(n+t.range(-.2,.2))/4*F+.6,.4,I(d.y0,d.y1,.35),.6),y(l[3],(n+.5+t.range(-.2,.2))/4*F,i.f*.7,I(i.y0,i.y1,.5),.5);await o.yield();const p=[];for(const n of a)n.pts.forEach((r,h)=>{h>1&&p.push(r)});for(let n=0;n<v.length;n++){n%8===7&&await o.yield();const r=v[n],h=[r.c[0],r.c[1]+r.ry*.3,r.c[2]];let x=null,M=1e9;for(const S of p){const b=Math.hypot(S[0]-h[0],(S[1]-h[1])*1.4+4,S[2]-h[2]);b<M&&(M=b,x=S)}const k=f([h[0]-x[0],-.4*Math.hypot(h[0]-x[0],h[2]-x[2]),h[2]-x[2]]);a.push({pts:ge(x,k,h,5,.3),rad:c(5,.4,.13),sides:5})}return{limbs:a,masses:v,perches:w,rng:t}}async function _e(o,t){const e=ne,a=z.ELM,v={pos:[],nor:[],uv:[],idx:[]},w=o.rng.fork("wood"),m=[];for(let r=0;r<4;r++)m.push([w.range(.02,.07),w()*F]);const f=[],c=[];for(let r=0;r<=30;r++)c.push(6-(e.trunk+6)*Math.pow(r/30,1.3));c.push(-e.trunk-1.6,-e.trunk-2.8,-e.trunk-3.3);for(const r of c)f.push([.6*Math.sin(r*m[0][0]+m[0][1]),r,.6*Math.sin(r*m[1][0]+m[1][1])]);const g=w()*F,y=[];for(let r=0;r<e.roots;r++)y.push(w.range(.86,1.1));const d=r=>Math.floor(((r+g/e.roots)/F%1+1)%1*e.roots+.5)%e.roots,u=(r,h)=>{const x=c[r],M=X(-x/e.trunk,0,1),k=X((-x-e.trunk)/3.3,0,1),S=Math.pow(.5+.5*Math.cos(e.roots*h+g),3),b=(e.rootR-e.trunkR[0])*y[d(h)]*Math.exp(Math.min(x,1.5)/7)*(.2+.8*S)+.5*Math.exp(x/22)*S;return(I(e.trunkR[0],e.trunkR[1],M)+b)*Math.sqrt(Math.max(1-k*k,4e-4))};await t.yield(),ve(v,f,u,42),await t.yield();const i=(r,h)=>Be(a.x+r,a.z+h)-a.y;for(let r=0;r<e.roots;r++){const h=(r*F-g)/e.roots,x=w.range(21,28),M=w.range(-.3,.3),k=[],S=[];for(let b=0;b<=7;b++){const T=I(e.rootR*.62,x,b/7),R=h+M*(b/7)**2+.06*Math.sin(b*1.9+r),N=Math.cos(R)*T,V=Math.sin(R)*T;k.push([N,i(N,V)-I(1.5,.5,b/7)+(b===7?1.4:0),V]),S.push(I(1.5,.3,Math.pow(b/7,.7)))}ve(v,k,S,7,w()*F),await t.yield()}await t.yield();for(let r=0;r<o.limbs.length;r++){const h=o.limbs[r];ve(v,h.pts,h.rad,h.sides,w()*F),r%6===5&&await t.yield()}await t.yield();const l=o.masses.filter(r=>{const h=Math.hypot(r.c[0],r.c[2]);return r.tier>0&&h>6&&h<27}),p=l.length/12;for(let r=0;r<12&&l.length;r++){const h=l[Math.floor(r*p)%l.length],x=w()*F,M=[Math.cos(x),0,Math.sin(x)],k=h.c[1]-h.ry-.9,S=[h.c[0]-M[0]*h.rx*.5,h.c[1]-h.ry*.5,h.c[2]-M[2]*h.rx*.5],b=[h.c[0],k,h.c[2]],T=[h.c[0]+M[0]*2.6,k+.15,h.c[2]+M[2]*2.6];ve(v,[S,[I(S[0],b[0],.6),k+.8,I(S[2],b[2],.6)],b,T],[.22,.18,.14,.06],5),o.perches.push({p:[h.c[0]+M[0]*.9,k-.14,h.c[2]+M[2]*.9],dir:M})}await t.yield();const n=new s.BufferGeometry;return n.setAttribute("position",new s.Float32BufferAttribute(v.pos,3)),n.setAttribute("normal",new s.Float32BufferAttribute(v.nor,3)),n.setAttribute("uv",new s.Float32BufferAttribute(v.uv,2)),n.setIndex(v.idx),n}function Le(o,t,e){const a=ne,v=X(.5+.62*(t[0]*e[0]+t[1]*e[1]+t[2]*e[2]),0,1),w=Math.hypot(e[0],e[2])||1,m=(o[0]/a.rx*e[0]+(o[2]-a.dz)/a.rz*e[2])/w,f=le(.55,.95,xe(o[0],o[2]))*.8;return v*Math.max(le(-.5,.6,m),f,.26)}const qe=[[0,0],[1,0],[0,1],[1,1],[0,-1],[1,-1]];async function $e(o,t,e){const a=t.rng.fork("leaves"),v=new s.IcosahedronGeometry(1,1),w=v.attributes.position,m=h=>4*Math.PI*Math.pow((2*Math.pow(h.rx*h.ry,1.6)+Math.pow(h.rx*h.rx,1.6))/3,1/1.6),f=t.masses.map(h=>Math.round(X(m(h)*Y.leaves,Y.count[0],Y.count[1]))),c=f.reduce((h,x)=>h+x,0),g=t.masses.length*w.count,y={pos:new Float32Array(g*3),nor:new Float32Array(g*3),open:new Float32Array(g)},d={pos:new Float32Array(c*18),nor:new Float32Array(c*18),uv:new Float32Array(c*12),piv:new Float32Array(c*18),leaf:new Float32Array(c*18)},u=new Uint32Array(c*12);let i=0,l=0,p=0;await o.yield();for(const h of t.masses){const x=a()*9,M=a()*9;for(let S=0;S<w.count;S++){const b=w.getX(S),T=w.getY(S),R=w.getZ(S),N=.8*(1+.13*Math.sin(b*4+x)*Math.sin(T*3.3+M)+.08*Math.sin(R*5+x*2)),V=[h.c[0]+b*h.rx*N,h.c[1]+T*h.ry*N,h.c[2]+R*h.rx*N];y.pos.set(V,l*3),y.nor.set([b,T,R],l*3),y.open[l++]=Le(V,[b,T,R],e)}const k=f[p++];for(let S=0;S<k;S++){S%12===0&&await o.yield();const b=a.range(-1,1),T=a()*F,R=Math.sqrt(1-b*b),N=[R*Math.cos(T),b,R*Math.sin(T)],V=a.range(.87,1.1),_=[h.c[0]+N[0]*h.rx*V,h.c[1]+N[1]*h.ry*V,h.c[2]+N[2]*h.rx*V];let L=[N[0]*.6+a.range(-.35,.35),-a.range(.55,1.1),N[2]*.6+a.range(-.35,.35)],H=Math.hypot(L[0],L[1],L[2]);L=[L[0]/H,L[1]/H,L[2]/H];const Z=a.range(-.7,.7);let te=N[0]*L[0]+N[1]*L[1]+N[2]*L[2],D=[N[0]-L[0]*te+Z*(L[1]*N[2]-L[2]*N[1]),N[1]-L[1]*te+Z*(L[2]*N[0]-L[0]*N[2]),N[2]-L[2]*te+Z*(L[0]*N[1]-L[1]*N[0])];H=Math.hypot(D[0],D[1],D[2])||1,D=[D[0]/H,D[1]/H,D[2]/H];const j=[L[1]*D[2]-L[2]*D[1],L[2]*D[0]-L[0]*D[2],L[0]*D[1]-L[1]*D[0]],re=a.range(1.6,2.2)*1.3,ie=re*a.range(.27,.34),oe=a.range(.15,.4),ae=Le(_,N,e),se=a()*F,Q=a(),W=i*6;let U=W;for(const[A,E]of qe){const B=(A-.5)*re,G=E*ie,C=Math.abs(E)*ie*oe;d.pos[U*3]=_[0]+L[0]*B+j[0]*G+D[0]*C,d.pos[U*3+1]=_[1]+L[1]*B+j[1]*G+D[1]*C,d.pos[U*3+2]=_[2]+L[2]*B+j[2]*G+D[2]*C;const O=D[0]*.55+N[0]*.45-j[0]*E*oe*.6,q=D[1]*.55+N[1]*.45-j[1]*E*oe*.6,me=D[2]*.55+N[2]*.45-j[2]*E*oe*.6,he=Math.hypot(O,q,me)||1;d.nor[U*3]=O/he,d.nor[U*3+1]=q/he,d.nor[U*3+2]=me/he,d.uv[U*2]=A,d.uv[U*2+1]=E,d.piv[U*3]=_[0],d.piv[U*3+1]=_[1],d.piv[U*3+2]=_[2],d.leaf[U*3]=se,d.leaf[U*3+1]=ae,d.leaf[U*3+2]=Q,U++}u.set([W,W+1,W+3,W,W+3,W+2,W,W+4,W+5,W,W+5,W+1],i*12),i++}await o.yield()}await o.yield();const n=new s.BufferGeometry;n.setAttribute("position",new s.BufferAttribute(y.pos,3)),n.setAttribute("normal",new s.BufferAttribute(y.nor,3)),n.setAttribute("aOpen",new s.BufferAttribute(y.open,1));const r=new s.BufferGeometry;return r.setAttribute("position",new s.BufferAttribute(d.pos,3)),r.setAttribute("normal",new s.BufferAttribute(d.nor,3)),r.setAttribute("uv",new s.BufferAttribute(d.uv,2)),r.setAttribute("aPivot",new s.BufferAttribute(d.piv,3)),r.setAttribute("aLeaf",new s.BufferAttribute(d.leaf,3)),r.setIndex(new s.BufferAttribute(u,1)),v.dispose(),{bodies:n,leaves:r,nLeaf:i}}const Me=`
attribute vec3 aPivot, aLeaf; attribute float aOpen; uniform float uLeafy;
varying vec3 vN, vLp; varying vec2 vUv; varying vec3 vLeaf;
void main() {
  vec3 p = position; vUv = uv; vLeaf = uLeafy > .5 ? aLeaf : vec3(0., aOpen, 0.);
  // every leaf flutters about its own middle; the boughs breathe a third of a metre
  if (uLeafy > .5) p += normal * sin(uTime * (3.1 + aLeaf.z * 2.4) + aLeaf.x + uv.x * 2.) * .15 * (uv.x + .3 * abs(uv.y));
  vec3 q = uLeafy > .5 ? aPivot : position;
  p.y += .3 * sin(uTime * .45 + q.x * .13 + q.z * .17) * smoothstep(3., 24., length(q.xz)) * step(q.y, -80.);
  vLp = p; vN = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(p, 1.); vWp = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,je=`
uniform vec3 uBarkA, uBarkB, uMoss; uniform vec2 uMossDir;
varying vec3 vN, vLp; varying vec2 vUv;
void main() {
  vec3 N = normalize(vN);
  // furrowed bark: long ridges down the limb, a finer crackle across them
  float ridge = texture2D(uNoise, vec2(vUv.x * .085, vUv.y * .011)).r, fine = texture2D(uNoise, vec2(vUv.x * .31, vUv.y * .07)).g;
  float h = ridge * .68 + fine * .32, plate = smoothstep(.36, .6, h);
  vec3 dpx = dFdx(vWp), dpy = dFdy(vWp); float hx = dFdx(h), hy = dFdy(h);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
  N = normalize(abs(det) * N - .55 * sign(det) * (hx * r1 + hy * r2));
  vec3 alb = mix(uBarkA, uBarkB, plate) * mix(.8, 1.1, fine);
  // moss on the side toward the brook
  float m = smoothstep(.05, .7, dot(normalize(vN.xz + 1e-4), uMossDir)) * smoothstep(.38, .6, texture2D(uNoise, vUv * .034).g + .25 * plate);
  alb = mix(alb, uMoss * mix(.7, 1.15, fine), m * .85);
  // a limb seen against the light is no dark hose: the low sun comes round its edge (a warm rim, strongest where the
  // sight runs toward the sun), and the sky under it lends the bark a little of its own colour everywhere
  vec3 V = normalize(cameraPosition - vWp), sunT = uSunCol / max(uSunCol.r, 1e-3);
  float rim = pow(1. - max(dot(normalize(vN), V), 0.), 2.6) * (.15 + .85 * max(dot(-V, uSun), 0.));
  gl_FragColor = vec4(gFog(gShade(alb, N, 0., mix(.55, 1., plate), .8) + alb * uFill * .22 + sunT * vec3(1., .82, .55) * rim * .6 * gSunlit(vWp)), 1.);
}`,Te=`
uniform vec3 uLeafA, uLeafB, uLeafDeep; uniform float uLeafy;
varying vec3 vN, vLp; varying vec2 vUv; varying vec3 vLeaf;
void main() {
  vec3 N = normalize(vN);
  if (uLeafy > .5) {
    // A SPRAY cut from the card: a twig down its middle, six toothed elm leaves to each side by turns and one at the
    // tip, each leaf-sized (a third of the card long), pointed, leaning toward the spray's tip
    float u = clamp(vUv.x, 0., 1.), v = abs(vUv.y), side = step(0., vUv.y);
    float cu = u * 6.6 + side * .5 - v * .55, k = floor(cu), a = fract(cu) - .5;
    float b = clamp(v / (.92 - .22 * step(4.5, k)), 0., 1.2);
    float wl = .4 * pow(max(sin(3.14159 * pow(clamp(b, 0., 1.), .78)), 0.), .8) * (1. + .12 * abs(fract(b * 7.) * 2. - 1.));
    float leaf = step(abs(a), wl) * step(b, 1.) * step(k, 5.5) * step(-.5, k);
    // the leaf at the tip lies along the twig
    float tu = (u - .8) / .2, tw = .3 * pow(max(sin(3.14159 * pow(clamp(tu, 0., 1.), .8)), 0.), .8) * (1. + .12 * abs(fract(tu * 7.) * 2. - 1.));
    float tip = step(0., tu) * step(v, tw), twig = step(v, .035) * step(u, .82);
    if (leaf + tip + twig < .5) discard;
    if (!gl_FrontFacing) N = -N;
    float rib = mix(abs(a) / max(wl, .02), v / max(tw, .02), tip * (1. - leaf)), across = mix(b, tu, tip * (1. - leaf));
    float vein = smoothstep(.16, .0, rib) + .5 * smoothstep(.14, .0, abs(fract(across * 6. - rib * .9) - .5)) * step(.12, rib);
    vec3 alb = mix(uLeafA, uLeafB, clamp(vLeaf.z + .25 * (fract(k * .37 + vLeaf.x) - .5), 0., 1.)) * (1. - .2 * vein);
    alb = mix(alb, uLeafDeep * .8, twig * (1. - leaf) * (1. - tip));
    alb = mix(uLeafDeep, alb, .35 + .65 * vLeaf.y);
    gl_FragColor = vec4(gFog(gShade(alb, N, .95, .18 + .82 * vLeaf.y, 1.)), 1.);
  } else {
    // the dark inner body of a leaf mass: deep green, mottled like leaves in shade
    vec3 w = abs(N); w /= (w.x + w.y + w.z);
    float mott = texture2D(uNoise, vLp.yz * .21).g * w.x + texture2D(uNoise, vLp.zx * .21).g * w.y + texture2D(uNoise, vLp.xy * .21).g * w.z;
    vec3 alb = mix(uLeafDeep, mix(uLeafDeep, uLeafA, .6), smoothstep(.3, .7, mott));
    gl_FragColor = vec4(gFog(gShade(alb, N, .3, (.5 + .5 * vLeaf.y) * mix(.7, 1., mott), .8)), 1.);
  }
}`;async function et(o,t={}){const e=!t.shared,a=t.shared||await ke(o,t),v=ne,w=new s.Group;w.name="the elm";const m=await He(o);await o.yield();const f=await _e(m,o);await o.yield();const c=await $e(o,m,z.SUN);await o.yield();const g=(n,r=1)=>({value:new s.Color(n).multiplyScalar(r)}),y=new s.Vector2(t.mossDir?t.mossDir[0]:-1,t.mossDir?t.mossDir[1]:-.12).normalize(),d=new s.Mesh(f,new s.ShaderMaterial({uniforms:{...a.U,uLeafy:{value:0},uBarkA:g("#65574A"),uBarkB:g("#A08E78"),uMoss:g("#7C9C4C"),uMossDir:{value:y}},vertexShader:a.GV+Me,fragmentShader:a.GF+je}));d.name="elm wood",w.add(d),await o.yield();const u=n=>({...a.U,uLeafy:{value:n},uLeafA:g("#3FA64A"),uLeafB:g("#63B43C"),uLeafDeep:g("#1E5A3A")}),i=new s.Mesh(c.bodies,new s.ShaderMaterial({uniforms:u(0),vertexShader:a.GV+Me,fragmentShader:a.GF+Te}));i.name="elm leaf bodies",w.add(i),await o.yield();const l=new s.Mesh(c.leaves,new s.ShaderMaterial({uniforms:u(1),vertexShader:a.GV+Me,fragmentShader:a.GF+Te,side:s.DoubleSide}));l.name="elm leaves",w.add(l);for(const n of[d,i,l])n.geometry.boundingSphere=new s.Sphere(new s.Vector3(0,-v.low/2,v.dz/2),v.low/2+16);const p=n=>new s.Vector3(n[0],n[1],n[2]);return{object:w,radius:v.rz,height:v.low,center:new s.Vector3(0,-(v.trunk+v.low)/2,v.dz),ground:!1,anchors:{root:p([0,0,0]),fork:p([0,-v.trunk,0]),lowest:p([0,-v.low,0]),crownCentre:p([0,-(v.trunk+v.low)/2,v.dz]),crownRadius:v.rz,perches:m.perches.map(n=>({at:p(n.p),dir:p(n.dir)}))},masses:m.masses,leafCount:c.nLeaf,swing(n){w.rotation.z=n},update(n,r){e&&(a.U.uTime.value=r)},dispose(){e&&a.dispose()}}}export{z as GARDEN,J as RELIEF,Xe as buildGrain,et as buildHero,Je as elmLowAt,xe as elmPlanAt,ke as gardenShared,Ye as lin,Ve as moteMesh,Ee as roll,Ze as swayAt,Be as yg};
