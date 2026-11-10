import*as y from"three";import{makePath as K}from"../kit/core.js";const F={x:60,y:170,z:-520},G=220,C=90,B=60,D=150,q=150,V=h=>D-q*Math.min(1,Math.max(0,h)),I=-40*Math.PI/180,T=[Math.sin(I),-Math.cos(I)],J=[Math.SQRT1_2,Math.SQRT1_2],_=[20,3],$=-Math.PI/4,tt=[62,54],et=22,ot=(h,t)=>{const r=h-_[0],s=t-_[1];return[(r+s)*Math.SQRT1_2,(-r+s)*Math.SQRT1_2]},rt=(h,t)=>[_[0]+(h-t)*Math.SQRT1_2,_[1]+(h+t)*Math.SQRT1_2],O=(h,t,r)=>Math.min(r,Math.max(t,h)),j=(h,t,r)=>{const s=O((r-h)/(t-h),0,1);return s*s*(3-2*s)};function st(h){const t=o=>{const n=O(o/G,0,1);return 30+30*Math.pow(1-n*n,.8)},r=(o,n)=>C-t(Math.hypot(o,n)),s=(o,n,p)=>n+.11*o-.07*p,i=(o,n)=>6.5*h.fbm2(o*.011+3.1,n*.011-1.7,3)+2.6*h.n2(o*.045+9,n*.045)+1.1*h.n2(o*.13,n*.13+5);return{thick:t,smoothUnder:r,under:(o,n)=>{const p=Math.hypot(o,n),c=j(G-2,G-26,p);let e=C-t(p)+i(o,n)*(.35+.65*c);const a=s(o,e,n)/7,l=a-Math.floor(a),d=l<.72?l*.25/.72:.25+(l-.72)*.75/.28;return e+=(d-l)*7*.8*c,Math.min(e,B+6*(1-c))},wallR:(o,n)=>G+2.6*h.n2(Math.cos(o)*9+20,Math.sin(o)*9+n*.07)+1.1*h.n2(Math.cos(o)*31,Math.sin(o)*31+n*.2+8)-1.6*j(C-9,C-2,n),bed:s}}function at(){const h=(s,i,f)=>new y.Vector3(s,i,f),t=s=>new y.Color(s);return{uniforms:{uTime:{value:0},uSunDir:{value:h(T[0],.14,T[1]).normalize()},uSunCol:{value:t("#F0B08A").multiplyScalar(.5)},uHemiSky:{value:t("#5A6480").multiplyScalar(3.4)},uHemiGnd:{value:t("#2a2633").multiplyScalar(2.6)},uFogCol:{value:t("#2A3042")},uFogGlow:{value:t("#8C5A6E")},uFogDen:{value:9e-4},uGlowAz:{value:new y.Vector2(T[0],T[1])},uBand:{value:t("#E99A5E").multiplyScalar(1.5)},uRose:{value:t("#8C5A6E").multiplyScalar(.7)},uSkyHi:{value:t("#0C0F17")},uSkyLo:{value:t("#262C3C")},uGold:{value:t("#FFC56B")},uLandY:{value:D},uWet:{value:0},uSnow:{value:0}}}}const Q=(h,t={})=>Object.assign({},h.uniforms,t),U=`
uniform float uTime, uFogDen, uLandY, uWet, uSnow;
uniform vec3 uSunDir, uSunCol, uHemiSky, uHemiGnd, uFogCol, uFogGlow, uBand, uRose, uSkyHi, uSkyLo, uGold;
uniform vec2 uGlowAz;
float cH(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y)*p3.z); }
float cH3(vec3 p3){ p3 = fract(p3*.1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y)*p3.z); }
float cN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(cH(i), cH(i + vec2(1., 0.)), f.x), mix(cH(i + vec2(0., 1.)), cH(i + vec2(1., 1.)), f.x), f.y); }
float cN3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(mix(cH3(i), cH3(i + vec3(1., 0., 0.)), f.x), mix(cH3(i + vec3(0., 1., 0.)), cH3(i + vec3(1., 1., 0.)), f.x), f.y),
             mix(mix(cH3(i + vec3(0., 0., 1.)), cH3(i + vec3(1., 0., 1.)), f.x), mix(cH3(i + vec3(0., 1., 1.)), cH3(i + vec3(1., 1., 1.)), f.x), f.y), f.z); }
float cF(vec2 p){ return .55*cN(p) + .29*cN(p*2.03 + 17.3) + .16*cN(p*4.1 + 31.7); }
float cF3(vec3 p){ return .57*cN3(p) + .28*cN3(p*2.07 + 11.3) + .15*cN3(p*4.3 + 23.1); }
// the sky as a mirror sees it: night blue above, slate lower, the apricot band low toward the afterglow, rose above it
vec3 ctlSky(vec3 d){
  float e = clamp(d.y, -1., 1.);
  vec2 h = d.xz / max(length(d.xz), 1e-4);
  float az = clamp(dot(h, uGlowAz)*.5 + .5, 0., 1.), lobe = az*az*az;
  vec3 c = mix(uSkyLo, uSkyHi, smoothstep(0., .6, e));
  float up = max(e, 0.);
  c += uRose*lobe*exp(-up*up/(.26*.26));
  c += uBand*lobe*lobe*exp(-up*up/(.1*.1));
  return c*smoothstep(-.12, .0, e) + uHemiGnd*.4*(1. - smoothstep(-.12, 0., e));
}
// fog of the dusk air: slate, rose toward the afterglow
vec3 ctlFog(vec3 col, vec3 toPoint){
  float d = length(toPoint), f = 1. - exp(-uFogDen*uFogDen*d*d);
  vec2 h = toPoint.xz / max(length(toPoint.xz), 1e-4);
  float az = clamp(dot(h, uGlowAz), 0., 1.);
  return mix(col, mix(uFogCol, uFogGlow, az*az*az*.8), f);
}
float ctlFogF(vec3 toPoint){ float d = length(toPoint); return 1. - exp(-uFogDen*uFogDen*d*d); }
// diffuse light on a surface of ours: the hemisphere and the afterglow key (wrapped a little)
vec3 ctlLight(vec3 n){
  vec3 hemi = mix(uHemiGnd, uHemiSky, n.y*.5 + .5);
  float k = clamp((dot(n, uSunDir) + .25)/1.25, 0., 1.);
  return hemi + uSunCol*k*k;
}
`,lt=`
varying vec3 vWorld; varying vec3 vLocal;
`;class nt{constructor(){this.P=[],this.N=[],this.C=[],this.E=[],this.m=null}set(t){return this.m=t,this}_p(t){if(!this.m)return t;const r=this.m.elements,s=t[0],i=t[1],f=t[2];return[r[0]*s+r[4]*i+r[8]*f+r[12],r[1]*s+r[5]*i+r[9]*f+r[13],r[2]*s+r[6]*i+r[10]*f+r[14]]}tri(t,r,s,i,f=0,m=f,o=f){t=this._p(t),r=this._p(r),s=this._p(s);const n=r[0]-t[0],p=r[1]-t[1],c=r[2]-t[2],e=s[0]-t[0],a=s[1]-t[1],l=s[2]-t[2];let d=p*l-c*a,u=c*e-n*l,x=n*a-p*e;const v=Math.hypot(d,u,x)||1;d/=v,u/=v,x/=v,this.P.push(t[0],t[1],t[2],r[0],r[1],r[2],s[0],s[1],s[2]),this.N.push(d,u,x,d,u,x,d,u,x);for(let g=0;g<3;g++)this.C.push(i[0],i[1],i[2]);return this.E.push(f,m,o),this}quad(t,r,s,i,f,m=0,o=m){return this.tri(t,r,s,f,m,m,o),this.tri(t,s,i,f,m,o,o),this}box(t,r,s,i,f,m,o,n=0,p=""){const c=t-i/2,e=t+i/2,a=r-f/2,l=r+f/2,d=s-m/2,u=s+m/2;return p.includes("Z")||this.quad([c,a,u],[e,a,u],[e,l,u],[c,l,u],o,n),p.includes("z")||this.quad([e,a,d],[c,a,d],[c,l,d],[e,l,d],o,n),p.includes("X")||this.quad([e,a,u],[e,a,d],[e,l,d],[e,l,u],o,n),p.includes("x")||this.quad([c,a,d],[c,a,u],[c,l,u],[c,l,d],o,n),p.includes("Y")||this.quad([c,l,u],[e,l,u],[e,l,d],[c,l,d],o,n),p.includes("y")||this.quad([c,a,d],[e,a,d],[e,a,u],[c,a,u],o,n),this}cyl(t,r,s,i,f,m,o=0,n=1,p=m){const c=r[0]-t[0],e=r[1]-t[1],a=r[2]-t[2],l=Math.hypot(c,e,a)||1,d=c/l,u=e/l,x=a/l;let v=Math.abs(u)>.9?1:0,g=Math.abs(u)>.9?0:1,w=0;const k=v*d+g*u+w*x;v-=k*d,g-=k*u,w-=k*x;const S=Math.hypot(v,g,w)||1;v/=S,g/=S,w/=S;const P=u*w-x*g,R=x*v-d*w,A=d*g-u*v,z=(b,M,E)=>{const N=E/f*Math.PI*2,H=Math.cos(N)*M,L=Math.sin(N)*M;return[b[0]+v*H+P*L,b[1]+g*H+R*L,b[2]+w*H+A*L]};for(let b=0;b<f;b++){const M=z(t,s,b),E=z(t,s,b+1),N=z(r,i,b+1),H=z(r,i,b);this.tri(M,E,H,m,o),this.tri(E,N,H,p,o),n>=1&&this.tri(H,N,r,p,o),n>=2&&this.tri(E,M,t,m,o)}return this}get triangles(){return this.P.length/9}build(){const t=new y.BufferGeometry;return t.setAttribute("position",new y.Float32BufferAttribute(this.P,3)),t.setAttribute("normal",new y.Float32BufferAttribute(this.N,3)),t.setAttribute("color",new y.Float32BufferAttribute(this.C,3)),t.setAttribute("emit",new y.Float32BufferAttribute(this.E,1)),t.computeBoundingSphere(),t}}function it(h,t={}){return new y.ShaderMaterial({uniforms:Q(h,{uFlick:{value:t.flicker??0},uGain:{value:t.gain??1}}),side:t.side??y.FrontSide,vertexShader:`
      attribute vec3 color; attribute float emit;
      varying vec3 vWorld, vN, vCol; varying float vEmit;
      void main(){
        vec4 p = vec4(position, 1.); vec3 n = normal;
        #ifdef USE_INSTANCING
          p = instanceMatrix*p; n = mat3(instanceMatrix)*n;
        #endif
        vec4 wp = modelMatrix*p; vWorld = wp.xyz; vN = mat3(modelMatrix)*n; vCol = color; vEmit = emit;
        gl_Position = projectionMatrix*viewMatrix*wp;
      }`,fragmentShader:U+`
      uniform float uFlick, uGain;
      varying vec3 vWorld, vN, vCol; varying float vEmit;
      void main(){
        vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
        if (!gl_FrontFacing) n = -n;
        vec3 col = vCol*ctlLight(n)*uGain;
        float fl = 1. + uFlick*(.5*sin(uTime*9.1 + vWorld.x*.7) + .5*sin(uTime*13.7 + vWorld.z*.9))*.12;
        float e = max(vEmit, 0.), er = max(-vEmit, 0.);
        col += uGold*e*fl + vec3(1., .13, .06)*er;
        gl_FragColor = vec4(ctlFog(col, vWorld - cameraPosition), 1.);
      }`})}const W=[[0,174,0],[0,173,-40],[-10,162,-110],[-30,147,-220],[-50,150,-329],[-88,175,-440],[-160,205,-520],[-182,214,-553],[-187,230,-589],[-178,252,-624],[-156,272,-654],[-126,287,-672],[-96,296,-679],[-61,300,-658],[-26,302,-623],[16,308,-580],[52,326,-545],[94,350,-503],[133,370,-464],[179,378,-418]],Y=20,ct=(h,t=0)=>{const r=(i,f)=>{let m=1e9;for(let o=-12;o<=12;o+=4)for(let n=-12;n<=12;n+=4)o*o+n*n<=144&&Math.hypot(i+o,f+n)<=G-3&&(m=Math.min(m,h.under(i+o,f+n)));return m},s=[];return W.forEach((i,f)=>{if(f<4||f>6){s.push(i);return}const m=W[Math.min(f+1,6)];for(let o=0;o<(f<6?3:1);o++){const n=i[0]+(m[0]-i[0])*o/3,p=i[2]+(m[2]-i[2])*o/3;Math.hypot(n-F.x,p-F.z)<=G&&s.push([n,F.y+r(n-F.x,p-F.z)-Y-t,p])}}),s},ft=8,ut={x:128,z:110,crown:118};function ht(h,t,r){const s=Math.PI*2,i=2048,f=new Float32Array(i+1),m=(c,e,a)=>{let l=Math.abs(c-e)%s;return l>Math.PI&&(l=s-l),1-j(a*.6,a,l)};let o=0;for(let c=0;c<=i;c++){const e=c/i*s;let a=t;for(const l of r)a+=l[2]*m(e,l[0],l[1]);c>0&&(f[c]=f[c-1]+(a+o)*.5),o=a}const n=new Float32Array(h+1);let p=0;for(let c=0;c<=h;c++){const e=f[i]*c/h;for(;p<i-1&&f[p+1]<e;)p++;n[c]=(p+(e-f[p])/Math.max(1e-9,f[p+1]-f[p]))/i*s}return n[h]=s,n}const pt=`
// bedded rock: grey beds that dip gently, thin dark shale, black coal seams, pale fresh breaks, a crisp line under every
// bed and two sets of upright joints. p: metres, in the frame the beds were laid in (the keel's own, and the hole's
// shifted by the lift, so the two halves match). dist: metres from the eye (lines widen and fade with it instead of
// shimmering). flatK: 1 on faces that lie along the beds (the belly, the hole's floor): there the same beds show as
// broad bands, the joints and the blocks' own tones all but gone. Out: wetK, facet (a small tilt for the block the point is in),
// bedF (how far up its bed the point is, 0..1: the lowest part of a slab is its broken edge).
vec3 ctlRock(vec3 p, float dist, float flatK, out float wetK, out vec3 facet, out float bedF){
  float fk = 0., soft = clamp(flatK, 0., 1.);
  // the joints wander (bent by the rock's own grain over tens of metres), so the blocks are never a regular grid
  float u1 = (p.x*.83 + p.z*.56)/6.3 + .22*cN3(p*.04) + 2.6*cN3(p*.011 + 3.), u2 = (-p.x*.42 + p.z*.9)/9.1 + .18*cN3(p*.031 + 9.) + 2.2*cN3(p*.013 + 17.);
  float blockOff = (cH(vec2(floor(u1 + .5), floor(u2 + .5))) - .5)*1.3*fk;
  float s = p.y + .11*p.x - .07*p.z + 2.6*cN3(p*.025) + .35*cN3(p*.17)*(1. - fk) + blockOff;
  float b = s/7., id = floor(b), f = fract(b), h = cH(vec2(id, 7.3)), h2 = cH(vec2(id, 91.7));
  float nsub = floor(mix(2., 5.99, h2)), fs = f*nsub, sub = floor(fs)*(1. - fk), fm = fract(fs), hs = cH(vec2(id*3.1 + sub, 4.4));
  vec3 col = mix(vec3(.07, .066, .064), vec3(.17, .158, .145), h*.55 + hs*.45);
  col = mix(col, vec3(.118, .11, .102), soft*.4);
  float lam = cN(vec2(s*2.3, 3.7 + id));
  col *= .86 + .28*lam*(1. - fk);
  float seam = step(h2, .16)*smoothstep(.74, .8, f)*(1. - smoothstep(.93, .98, f))*(1. - fk);
  col = mix(col, vec3(.012, .011, .012), seam);
  float shale = step(.6, h2)*smoothstep(.0, .05, f)*(1. - smoothstep(.12, .2, f))*(1. - fk);
  col = mix(col, col*.5, shale);
  float fresh = smoothstep(.5, .75, cF3(p*.045 + 11.));
  col = mix(col, vec3(.23, .21, .19)*(.85 + .3*lam), fresh*.45*(1. - seam));
  float w = .011 + dist*.0004, kw = clamp(.02/w, 0., 1.);
  float ln = 1. - smoothstep(0., w, min(f, 1. - f)), ln2 = (1. - smoothstep(0., w*nsub*.7, min(fm, 1. - fm)))*(1. - fk);
  col *= 1. - (.62*ln + .3*ln2)*kw*(1. - .45*soft);
  float j1 = u1 + (h*9. + sub*3.7)*(1. - fk), j2 = u2 + (h2*5. + sub*1.3)*(1. - fk);
  float c1 = floor(j1), wj = .007 + dist*.0003, open1 = step(.3, cH(vec2(c1, id + sub)));
  float jl = min(abs(fract(j1) - .5)*open1 + (1. - open1), abs(fract(j2) - .5)*1.4);
  float joint = (1. - smoothstep(0., wj, jl))*clamp(.014/wj, 0., 1.);
  col *= 1. - .55*joint*(1. - .8*soft);
  float c1b = floor(j1 + .5), c2b = floor(j2 + .5);
  facet = vec3(cH(vec2(c1b, id + sub*.37)), cH(vec2(c2b + 3., id + sub*.61)), cH(vec2(c1b + c2b*7., id + 5.))) - .5;
  facet *= 1. - .75*soft;
  col *= mix(.88 + .3*cH(vec2(c1b*3. + c2b, id + sub)), 1.03, soft*.85);
  col *= .9 + .2*cN3(p*.9);
  // close to, a broken bed is not smooth: pits and ribs a metre or two across, easing out with distance
  float nearK = 1. - smoothstep(30., 140., dist);
  float g0 = cF3(p*.6 + 5.), gx = cF3(p*.6 + vec3(.2, 0., 0.) + 5.), gz = cF3(p*.6 + vec3(0., 0., .2) + 5.);
  col *= 1. + (g0 - .5)*.8*nearK;
  facet += vec3(gx - g0, 0., gz - g0)*6.*nearK;
  wetK = smoothstep(.42, .7, cF3(p*vec3(.06, .02, .06) + 31.)) + .5*seam + .3*joint;
  bedF = f;
  return col;
}
`;function dt(h=3,t=W){const r=K(t),s=Math.ceil(r.length/h),i=new Float32Array((s+1)*3),f=new Float32Array(s+1),m=new y.Vector3;for(let e=0;e<=s;e++)r.posAtDist(r.length*e/s,m),i[e*3]=m.x,i[e*3+1]=m.y,i[e*3+2]=m.z,f[e]=V(e/s);const o=24,n=new Map;for(let e=0;e<=s;e++){const a=Math.floor(i[e*3]/o)+","+Math.floor(i[e*3+2]/o);let l=n.get(a);l||n.set(a,l=[]),l.push(e)}const p=(e,a,l,d,u)=>{const x=u*u,v=Math.floor((e-u)/o),g=Math.floor((e+u)/o),w=Math.floor((l-u)/o),k=Math.floor((l+u)/o);for(let S=v;S<=g;S++)for(let P=w;P<=k;P++){const R=n.get(S+","+P);if(R)for(const A of R){const z=i[A*3]-e,b=i[A*3+1]-a-(d?f[A]:0),M=i[A*3+2]-l;if(z*z+b*b+M*M<x)return!1}}return!0},c={route:r,samples:s+1,step:r.length/s,world:(e,a)=>p(e[0],e[1],e[2],!1,a),hero:(e,a)=>p(e[0]+F.x,e[1]+F.y,e[2]+F.z,!1,a),land:(e,a)=>p(e[0],e[1],e[2],!0,a),line:(e,a,l,d)=>{const u=Math.max(1,Math.ceil(Math.hypot(l[0]-a[0],l[1]-a[1],l[2]-a[2])/5));for(let x=0;x<=u;x++){const v=x/u;if(!c[e]([a[0]+(l[0]-a[0])*v,a[1]+(l[1]-a[1])*v,a[2]+(l[2]-a[2])*v],d))return!1}return!0},fall:(e,a,l,d,u,x,v=.9)=>{const g=Math.max(2,Math.ceil(u*v/5));for(let w=0;w<=g;w++){const k=Math.sqrt(w/g)*v;if(!c[e]([a[0]+l[0]*d*k,a[1]-u*k*k,a[2]+l[1]*d*k],x))return!1}return!0}};return c}const Z=["visit","clock","city","tower","mill","lots","tram0","tram1","tramStart","townTrees","townTreeGeo","townScatter","roofThings","subwayLines","bellyMouths","lining","caissons","piles","stubs","trains","rimPiers","ladders","stubPipes","pipes","cables","treeRoots","riverFall","mains","drips","smoke","steam","flags","towerFlags","poplars","hedgeOaks","willows","orchardRows","poplarGeo","oakGeo","willowGeo","orchardGeo","landScatter","pylonCables","cutWires","holeLining","galleries","sagging","landFall","sky","skyCities","rimPeople","roofPeople","belvedere","kerbs","fencePeople","roadPeople","stones","geese","swifts","swifts1","swifts2","roofFlock","crownFlock","paceFlock","crows","cows","dust","motes"];function mt(h){const t={};for(const r of Z)t[r]=h.core.makeRng(h.core.hashSeed(r+":"+h.seed));return t}export{J as AVE,_ as AVE0,nt as Acc,Z as FORKS,I as GLOW_AZ,T as GLOW_DIR,U as GLSL_COMMON,pt as GLSL_ROCK,lt as GLSL_VARY_VERT,$ as GRID_ANGLE,F as HERO,Y as KEEL_UNDER,D as LAND0,q as LIFT,B as LIP,ft as PATH_ABOVE_RIM,W as PATH_PTS,tt as PITCH,G as RIM,C as STREET,et as STREET_W,ut as TOWER,rt as fromGrid,V as landY,mt as makeForks,st as makeKeelShape,it as makePropMaterial,dt as makeRouteProbe,at as makeShared,ct as routePoints,ht as sectorAngles,Q as sharedU,ot as toGrid};
