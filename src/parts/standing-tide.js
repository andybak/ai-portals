import*as a from"three";const ie=["#F1EBDD","#9FB4CC","#2FB7B0","#0F5F9A","#7FD0F2","#FFFFFF","#F28C3B"],O=1200,j=1580,se=-2.6,X=1400,ce=2*430*430;function G(o){const e=Math.min(1,Math.max(0,(o-1250)/250));return 250*Math.exp(-o*o/ce)+30*Math.exp(-o/45)+20*Math.exp(-o/9)-3.4*e*e*(3-2*e)}function le(o){return j-Math.sqrt(Math.max(0,O*O-o*o))}const ee=`
uniform float uTime;
uniform vec3 uSun;      // unit vector toward the sun, hero-local
uniform vec3 uQuiv;     // xy: lateral quiver of the peak (m), z: height of the peak term (about 50)
uniform vec3 cIvory, cSlate, cTurq, cDeep, cAqua, cWhite, cOrange;
const vec3 MOONC = vec3(0., 1580., 0.);
const float BEDY = -2.6;
uniform float uWind;  // 0 glassy calm .. 1 trade wind: whitecaps running uphill, the fleet heeled hard
uniform float uSailW; // 1 = white sails with one sailcloth-coloured panel
uniform vec3 SUNC;   // sun colour (default warm white 1, .95, .86); the world tints it per hour
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ return vn(p) * .5 + vn(p * 2.03 + 7.1) * .3 + vn(p * 4.1 + 3.7) * .2; }
float tideH(vec2 p){
  float r2 = dot(p, p), r = sqrt(r2);
  float lq = length(p - uQuiv.xy);
  return 250. * exp(-r2 / 369800.) + uQuiv.z * (.6 * exp(-lq / 45.) + .4 * exp(-lq / 9.)) - 3.4 * smoothstep(1250., 1500., r);
}
vec2 tideG(vec2 p){
  float r2 = dot(p, p);
  vec2 q = p - uQuiv.xy; float lq = length(q);
  return -250. * exp(-r2 / 369800.) * p / 184900. - uQuiv.z * (.6 / 45. * exp(-lq / 45.) + .4 / 9. * exp(-lq / 9.)) * q / max(lq, .6);
}
vec3 tideN(vec2 p){ vec2 g = tideG(p); return normalize(vec3(-g.x, 1., -g.y)); }
// long swell rings that climb the hill (phase runs inward), metres
float swellPh(vec2 p){ return length(p) * .09 + uTime * .85 + 2.5 * vn(p * .004); }
float swellK(float r){ return smoothstep(1385., 1150., r) * smoothstep(30., 150., r); }
float swellH(vec2 p){ return .5 * sin(swellPh(p)) * swellK(length(p)); }
float surfY(vec2 p){ return tideH(p) + swellH(p); }
float ropeTop(){ return tideH(uQuiv.xy) + 7.; }
// 1 in sunlight, 0 inside the moon's shadow (soft edge): one ray-sphere test.
float moonShade(vec3 p){
  vec3 d = MOONC - p; float t = dot(d, uSun);
  float m = length(d - uSun * t);
  return mix(1., smoothstep(730., 910., m), step(0., t));   // radius cheated (800, not 1200) so the summit stays sunlit
}
// A crawling caustic net, 0..~1.6, no textures.
float caustic(vec2 p, float t){
  vec2 w = vec2(vn(p * .7 + vec2(t * .21, -t * .13)), vn(p * .7 + vec2(-t * .17, t * .19) + 9.3));
  float a = 1. - abs(2. * vn(p + w * 1.3 + t * .05) - 1.);
  float b = 1. - abs(2. * vn(p * 1.6 - w * 1.1 - t * .04 + 4.7) - 1.);
  float c = a * b; c = c * c; return c * c * 1.6 + c * .25;
}
vec3 skyCol(vec3 d){
  vec3 s = mix(cIvory * .93, cAqua * .96, smoothstep(0., .62, d.y));
  vec3 sea = mix(cTurq * .5, cIvory * .8, smoothstep(-.3, 0., d.y));
  return mix(sea, s, smoothstep(-.02, .02, d.y));
}
// What the moon looks like along a ray from p in direction d: rgb, a = 1 when hit.
vec4 moonRay(vec3 p, vec3 d){
  vec3 oc = p - MOONC; float b = dot(oc, d), c = dot(oc, oc) - 1440000.;
  float disc = b * b - c;
  if (disc < 0. || -b < 0.) return vec4(0.);
  float t = -b - sqrt(disc);
  vec3 n = (oc + d * t) / 1200.;
  float nl = max(dot(n, uSun), 0.);
  vec3 col = cIvory * .7 * SUNC * nl + cSlate * .36 + cTurq * .2 * max(-n.y, 0.);
  col *= .7 + .6 * fbm(n.xz * 11.);
  return vec4(col, smoothstep(0., 260000., disc));
}
// Fade an under-water colour toward the hill's blue heart; adds the caustic net. V = unit vector to camera.
vec3 underwater(vec3 col, vec3 p, vec3 V){
  float d = surfY(p.xz) - p.y;
  if (d <= 0.) return col;
  float s = d * mix(2.1, 1., abs(V.y));
  vec3 T = exp(-s * vec3(1. / 22., 1. / 44., 1. / 58.));
  float sh = .55 + .45 * moonShade(p);
  col *= 1. + caustic(p.xz * .11, uTime) * exp(-d / 16.) * .9 * sh;
  return mix(cDeep * (.5 + .42 * sh), col, T);
}
vec3 lit(vec3 alb, vec3 n, vec3 p){
  float nl = max(dot(n, uSun), 0.) * moonShade(p);
  vec3 amb = mix(cSlate * .42, cAqua * .5, n.y * .5 + .5) + cTurq * .14 * max(-n.y, 0.);
  return alb * (SUNC * nl + amb);
}
`,ve=`
#include <fog_pars_vertex>
varying vec3 vLp; varying vec3 vCam;
vec3 camLocal(){ return (cameraPosition - modelMatrix[3].xyz) * mat3(modelMatrix); }
`,E=`
  vLp = lp; vCam = camLocal();
  vec4 mvPosition = modelViewMatrix * vec4(lp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
`,he=`
#include <fog_pars_fragment>
varying vec3 vLp; varying vec3 vCam;
float fogF(){
#ifdef USE_FOG
  #ifdef FOG_EXP2
  return 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
  return smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#else
  return 0.;
#endif
}
vec3 fogMix(vec3 c){
#ifdef USE_FOG
  return mix(c, fogColor, fogF());
#else
  return c;
#endif
}
// premultiplied (a) or additive (a = 0) colours
vec3 fogMixP(vec3 c, float a){
#ifdef USE_FOG
  return mix(c, fogColor * a, fogF());
#else
  return c;
#endif
}
`;function K(o,e){const t=o.length,p=new Float32Array(t*e*3),c=new Float32Array(t*e);for(let n=0;n<t;n++)for(let f=0;f<e;f++){const g=f/e*Math.PI*2,v=n*e+f;p[v*3]=Math.sin(g)*o[n],p[v*3+1]=0,p[v*3+2]=Math.cos(g)*o[n],c[v]=n}const d=new Uint32Array((t-1)*e*6);let i=0;for(let n=0;n<t-1;n++)for(let f=0;f<e;f++){const g=n*e+f,v=n*e+(f+1)%e,l=g+e,m=v+e;d[i++]=g,d[i++]=l,d[i++]=v,d[i++]=v,d[i++]=l,d[i++]=m}const s=new a.BufferGeometry;return s.setAttribute("position",new a.BufferAttribute(p,3)),s.setIndex(new a.BufferAttribute(d,1)),{g:s,ring:c}}async function ue(o,e){const t=o.attributes.position.array,p=o.index.array,c=new Float32Array(t.length),d=new a.BufferAttribute(c,3);o.setAttribute("normal",d);for(let i=0,s=p.length;i<s;i+=3){i%9e3===8997&&await e();const n=p[i]*3,f=p[i+1]*3,g=p[i+2]*3,v=t[g]-t[f],l=t[g+1]-t[f+1],m=t[g+2]-t[f+2],b=t[n]-t[f],w=t[n+1]-t[f+1],y=t[n+2]-t[f+2],r=l*y-m*w,q=m*b-v*y,C=v*w-l*b,F=c[n]+r,R=c[n+1]+q,V=c[n+2]+C,S=c[f]+r,B=c[f+1]+q,M=c[f+2]+C,D=c[g]+r,U=c[g+1]+q,H=c[g+2]+C;c[n]=F,c[n+1]=R,c[n+2]=V,c[f]=S,c[f+1]=B,c[f+2]=M,c[g]=D,c[g+1]=U,c[g+2]=H}await e();for(let i=0,s=c.length;i<s;i+=3){const n=c[i],f=c[i+1],g=c[i+2],v=1/(Math.sqrt(n*n+f*f+g*g)||1);c[i]=n*v,c[i+1]=f*v,c[i+2]=g*v}d.needsUpdate=!0}class fe{constructor(){this.p=[],this.c=[],this.k=[],this.u=[],this.i=[]}v(e,t,p,c,d=0,i=0,s=0){return this.p.push(e,t,p),this.c.push(c.r,c.g,c.b),this.k.push(d),this.u.push(i,s),this.p.length/3-1}quad(e,t,p,c){this.i.push(e,t,p,e,p,c)}tri(e,t,p){this.i.push(e,t,p)}beam(e,t,p,c,d,i,s,n,f,g=0){const v=new a.Vector3(c-e,d-t,i-p),l=Math.abs(v.clone().normalize().y)>.9?new a.Vector3(1,0,0):new a.Vector3(0,1,0),m=new a.Vector3().crossVectors(v,l).normalize().multiplyScalar(s*.5),b=new a.Vector3().crossVectors(m,v).normalize().multiplyScalar(n*.5),w=[];for(let y=0;y<2;y++)for(const[r,q]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const C=y?.8:1;w.push(this.v((y?c:e)+(m.x*r+b.x*q)*C,(y?d:t)+(m.y*r+b.y*q)*C,(y?i:p)+(m.z*r+b.z*q)*C,f,g))}for(let y=0;y<4;y++){const r=(y+1)%4;this.quad(w[y],w[r],w[4+r],w[4+y])}this.quad(w[3],w[2],w[1],w[0]),this.quad(w[4],w[5],w[6],w[7])}geometry(){const e=new a.BufferGeometry;e.setAttribute("position",new a.Float32BufferAttribute(this.p,3)),e.setAttribute("color",new a.Float32BufferAttribute(this.c,3)),e.setAttribute("aPart",new a.Float32BufferAttribute(this.k,1)),e.setAttribute("uv",new a.Float32BufferAttribute(this.u,2)),e.setIndex(this.i);const t=e.toNonIndexed();return t.computeVertexNormals(),e.dispose(),t}}function me(o){const{g:e}=K([0,400,800,1200,1390,1410,1700,2600,5200],72),t=o.mk(`
    varying vec2 vWp;
    void main(){ vec3 lp = position; lp.y = BEDY; vWp = (modelMatrix * vec4(lp, 1.)).xz; ${E} }`,`
    varying vec2 vWp;
    void main(){
      vec3 toC = vCam - vLp; float dist = length(toC); vec3 V = toC / max(dist, 1e-3);
      vec2 w = vWp; float r = length(vLp.xz);
      float big = fbm(w * .012), far = 1. / (1. + dist / 500.);
      float rip = sin((w.x * .9 + w.y * .35) * 2.4 + fbm(w * .07) * 9.) * .5 + .5;
      vec3 sand = cIvory * (.50 + .12 * big + .06 * rip * far);
      float ch = smoothstep(.56, .7, fbm(w * .0055 + 3.1));                      // channels
      sand = mix(sand, cTurq * .32 + cIvory * .16, ch * .7);
      vec2 cg = w / 13., ci = floor(cg), cf = fract(cg) - .5; float hh = h21(ci);   // coral heads
      float cd = length(cf - (vec2(h21(ci + 3.3), h21(ci + 7.7)) - .5) * .6);
      float head = smoothstep(.2 * hh + .05, .03, cd) * step(.42, hh);
      vec3 coralC = mix(cSlate * .55, mix(cIvory * .62, cTurq * .5, h21(ci + 1.7)), .65);
      sand = mix(sand, coralC * (.55 + .6 * clamp(1. - cd * 4., 0., 1.)), head);
      float grass = smoothstep(.5, .68, fbm(w * .021 + 11.)) * (1. - head);        // seagrass, combed
      sand = mix(sand, vec3(.09, .22, .15) + cTurq * .1, grass * .7 * (.55 + .45 * vn(w * vec2(.9, 3.2))));
      vec3 n = vec3(0., 1., 0.);
      float depth = tideH(vLp.xz) - BEDY;
      float wet = smoothstep(1900., 1400., r);
      vec3 col = lit(sand * mix(1., .7, wet), n, vLp);
      if (r < 1400. && depth > .0) {
        col = underwater(col, vLp, V);
      } else {
        vec2 rs = (vec2(vn(w * .9 + uTime * .3), vn(w * .9 - uTime * .25 + 5.)) - .5) * .05;
        vec3 R = normalize(vec3(-V.x + rs.x, abs(V.y) + .02, -V.z + rs.y));
        float fres = .04 + .96 * pow(1. - clamp(V.y, 0., 1.), 5.);
        vec4 mr = moonRay(vLp, R);
        vec3 refl = mix(skyCol(R), mr.rgb, mr.a);
        float pool = smoothstep(.53, .57, fbm(w * .03 + 5.) + ch * .2) * (1. - head);
        // rivulets draining toward the hill
        vec2 dirn = vLp.xz / max(r, 1.);
        float rv = vn(vec2(dot(w, vec2(-dirn.y, dirn.x)) * .5, dot(w, dirn) * .03 + uTime * .5));
        float riv = smoothstep(.78, .9, rv) * wet * (1. - pool);
        col = mix(col, refl, max(pool * (.45 + .55 * fres), wet * fres * .75));
        col += refl * riv * .25;
        float sp = pow(max(dot(R, uSun), 0.), 300.) * moonShade(vLp);
        col += SUNC * sp * 5. * max(pool, wet * .4);
      }
      gl_FragColor = vec4(fogMix(col), 1.);
    }`),p=new a.Mesh(e,t);return p.frustumCulled=!1,p.renderOrder=-.5,p}function pe(o){const e=[];for(let d=0;d<=44;d++)e.push(790*Math.pow(d/44,1.15));const{g:t}=K(e,96),p=o.mk(`
    varying vec3 vN;
    // 55 m inside at the foot, 24 m under the shoulders and summit: seen from the slope its skyline then sits just
    // under the water's own, so the hill never shows sky through its upper shell
    float coreH(vec2 p){ float r = length(p); return 250. * exp(-dot(p, p) / 369800.) + 20. * exp(-r / 60.) - mix(24., 55., smoothstep(260., 800., r)); }
    void main(){
      vec3 lp = position;
      float h = coreH(lp.xz), e = 2.;
      vN = normalize(vec3(h - coreH(lp.xz + vec2(e, 0.)), e, h - coreH(lp.xz + vec2(0., e))));
      lp.y = max(h, BEDY - 1.5);
      ${E} }`,`
    varying vec3 vN; uniform vec3 uShA, uShB;
    void main(){
      vec3 V = normalize(vCam - vLp);
      float hgt = clamp(vLp.y / 210., 0., 1.), sh = moonShade(vLp);
      float nl = max(dot(vN, uSun), 0.);
      vec3 col = mix(cDeep * .6, cDeep * .95, hgt) * (.62 + .55 * nl * sh) * mix(1., .6, smoothstep(140., 520., length(vCam - vLp)));
      // slow broad shafts: bands across the sun direction, so they stretch along it
      vec2 sp = vec2(dot(vLp, uShA), dot(vLp, uShB));
      float s1 = smoothstep(.42, .8, vn(sp * vec2(.035, .011) + vec2(uTime * .035, 0.)));
      float s2 = smoothstep(.5, .85, vn(sp * vec2(.09, .02) - vec2(uTime * .05, 3.)));
      col += (cTurq * .36 + cAqua * .12) * (s1 + .5 * s2) * (.35 + .65 * nl) * sh;
      col += cTurq * .05 * caustic(vLp.xz * .03, uTime * .6) * hgt;
      col = mix(col, cDeep * .5, .35 * (1. - abs(dot(vN, V))));
      gl_FragColor = vec4(fogMix(col), 1.);
    }`,{},{uShA:o.SH.uShA,uShB:o.SH.uShB}),c=new a.Mesh(t,p);return c.frustumCulled=!1,c}function de(o){const e=[0];let t=.35;for(;t<60;)e.push(t),t*=1.19;const p=e.length,c=Math.round(96*(.75+.25*o.detail));for(let l=0;l<=c;l++)e.push(60+1320*Math.pow(l/c,1.08));e.push(1390,1395,1397.6,1399,1399.7,X);const d=160,{g:i,ring:s}=K(e,d),n=new Float32Array(s.length),f=e.length-1;for(let l=0;l<s.length;l++){const m=f-s[l];n[l]=m===0?1:m===1?.55:m===2?.2:m===3?.05:0}i.setAttribute("aLip",new a.BufferAttribute(n,1));const g=o.mk(`
    attribute float aLip; varying float vLip;
    void main(){
      vec3 lp = position; vLip = aLip;
      lp.y = mix(surfY(lp.xz), BEDY - .05, aLip);
      ${E} }`,`
    varying float vLip; uniform vec4 uHit[9]; uniform vec3 uShA, uShB;
    float ripH(vec2 p, float fine){
      float t = uTime;
      return vn(p * vec2(.5, .34) + vec2(t * .55, t * .3)) * .2 * fine
           + vn(p * .12 - vec2(t * .17, -t * .11)) * .85
           + vn(p * .027 + vec2(-t * .05, t * .04)) * 2.3;
    }
    // top of what is solid to the eye under the water: the core (same formula as makeCore), else the bed
    float coreY(vec2 q){ float rq = length(q); return max(250. * exp(-dot(q, q) / 369800.) + 20. * exp(-rq / 60.) - mix(24., 55., smoothstep(260., 800., rq)), BEDY); }
    void main(){
      vec3 toC = vCam - vLp; float dist = length(toC); vec3 V = toC / max(dist, 1e-3);
      vec2 p = vLp.xz; float r = length(p); vec2 rh = p / max(r, .5);
      float fine = 1. / (1. + dist / 260.), e = .4;
      float h0 = ripH(p, fine);
      vec2 sL = vec2(ripH(p + vec2(e, 0.), fine) - h0, ripH(p + vec2(0., e), fine) - h0) / e;   // long slow undulations
      float ph = swellPh(p), sk = swellK(r);
      sL += rh * (.045 * cos(ph) * sk + .022 * cos(r * .37 + uTime * 1.5) * sk * fine);
      float nearK = 1. / (1. + dist / 28.), nearM = 1. / (1. + dist / 95.);   // close to the lens: wind ripples and cat's-paws
      vec2 t2 = vec2(uTime * .8, -uTime * .6);
      vec2 sF = (vec2(vn(p * 1.7 + t2), vn(p * 1.7 - t2 + 5.3)) - .5) * (.36 + .3 * uWind) * nearK;
      sL += (vec2(vn(p * .21 + t2 * .5), vn(p * .21 - t2 * .4 + 8.1)) - .5) * .22 * uWind;
      sF += (vec2(vn(p * 4.3 - t2 * 1.6), vn(p * 4.3 + t2 * 1.4 + 2.1)) - .5) * .22 * nearK * nearK;
      sF += (vec2(vn(p * .66 + t2 * .55), vn(p * .66 - t2 * .45 + 3.3)) - .5) * .26 * nearM;
      vec2 s = sL + sF;
      vec2 g = tideG(p);
      vec3 Nm = normalize(vec3(-g.x, 1., -g.y));
      vec3 N = normalize(vec3(-g.x - s.x, 1., -g.y - s.y));
      // the mirror image is taken with the long undulations calmed near the lens: close up they smeared the moon's
      // reflection into blotches a quarter of the frame wide; far away they are what breaks it up
      vec2 sR = sL * mix(.14, .75, smoothstep(70., 420., dist)) + sF * .6;
      vec3 Nr = normalize(vec3(-g.x - sR.x, 1., -g.y - sR.y));
      float NV = max(dot(Nr, V), .02), NVm = max(dot(Nm, V), 0.);
      float F = .02 + mix(.44, .28, smoothstep(30., 380., dist)) * pow(max(1. - NV, 0.), 5.);   // far off, the grazing mirror of the moon's lit limb whitened the whole flank
      float farK = smoothstep(30., 380., dist);                         // 0 beside the lens .. 1 across the hill
      vec3 R = reflect(-V, Nr);
      // facets tipped away from the eye mirrored the milk-pale horizon (or the sea below it) as flat slabs: near the
      // lens every facet mirrors sky from a little above the horizon instead
      R = normalize(vec3(R.x, mix(max(abs(R.y), .2), R.y, smoothstep(40., 220., dist)), R.z) + vec3(0., 1e-4, 0.));
      vec4 mr = moonRay(vLp, R);
      vec3 refl = mix(skyCol(R), mix(mr.rgb, cAqua * .72, .28), mr.a * mix(.5, .9, farK));
      float shade = moonShade(vLp);
      float cl = smoothstep(.52, .74, fbm(p * .0017 + vec2(uTime * .004, 0.)));   // cloud shadows
      float sunK = shade * (1. - .3 * cl);
      float rs = max(dot(R, uSun), 0.);
      float spk = smoothstep(.8, 1., vn(p * 9. + vec2(uTime * 1.9, -uTime * 1.3)) * vn(p * 17. - vec2(uTime * 1.6, uTime * 1.1)) * 2.6);
      vec3 glit = SUNC * vec3(1., .93, .8) * (pow(rs, 900.) * 2.5 + pow(rs, 160.) * spk * 4.5 + pow(rs, 120.) * .2) * sunK;
      // small glints on the ripple faces that tilt toward the sun (the true mirror point is far off to port)
      vec2 sunH = uSun.xz / max(length(uSun.xz), 1e-3);
      float facet = dot(sF, -sunH);
      glit += SUNC * vec3(1., .95, .85) * smoothstep(.085, .15, facet) * smoothstep(.55, .9, spk + vn(p * 5.1 + t2 * 2.) * .9) * 1.7 * sunK * smoothstep(3., 9., dist);
      float low = 1. - smoothstep(.2, .5, uSun.y);                       // 1 at golden hour and dawn
      float sideS = dot(rh, sunH) * smoothstep(20., 300., r);
      // ---- THE HILL AS A BODY OF CLEAR WATER ----
      // March the view ray into the hill (12 steps, no textures): dCore = metres of water before the eye meets the
      // core or the bed, chord = metres of hill the ray would cross in all (to the far skin or the bed). Opacity grows
      // with the first, the colour deepens with the second: thin water (foot, skyline, peak) is pale and lit through,
      // the long chords through the middle are the dark heart. Nothing switches, so no straight colour boundary.
      float thick = max(tideH(p) - BEDY, 0.);
      vec3 Dm = -V;
      float dCore = 2000., chord = 2000., tP = 0., cP = max(vLp.y - coreY(p), .02), sP = .5;
      for (int i = 0; i < 12; i++) {
        float tm = 6. * pow(1.68, float(i));
        vec3 Pm = vLp + Dm * tm; float rq = length(Pm.xz);
        float gq = 250. * exp(-rq * rq / 369800.);
        float cy = max(gq + 20. * exp(-rq / 60.) - mix(24., 55., smoothstep(260., 800., rq)), BEDY);
        float sy = gq + uQuiv.z * (.6 * exp(-rq / 45.) + .4 * exp(-rq / 9.)) - 3.4 * smoothstep(1250., 1500., rq);
        float cc = Pm.y - cy, ss = min(sy + 1.2 - Pm.y, Pm.y - BEDY + .5);   // 1.2 m: the swell and ripples ride above tideH
        if (dCore > 1999. && cc < 0.) dCore = mix(tP, tm, cP / max(cP - cc, 1e-3));
        if (chord > 1999. && ss < 0.) chord = mix(tP, tm, sP / max(sP - ss, 1e-3));
        tP = tm; cP = max(cc, .02); sP = max(ss, .02);
      }
      float dW = min(dCore, chord);
      float exitK = smoothstep(0., 60., dCore - chord);                 // the ray leaves through the far skin: the rim
      float farS = smoothstep(140., 520., dist);
      float heart = 1. - exp(-chord / mix(120., 190., farS));
      heart *= heart;
      vec3 pale = (cAqua * .5 + cTurq * .6) * (.66 + .5 * sunK);      // thin water, lit through
      pale = mix(cAqua * .9 * (.6 + .45 * sunK), pale, smoothstep(.4, 9., thick));
      vec3 deepC = (cDeep * mix(.95, .5, farS) + cTurq * .015) * (.6 + .4 * sunK);         // the tone map shows linear cDeep as a mid blue: the heart is written at .4 of it    // the heart
      // a low sun lights the hill through: green-amber on the sun's flank, deep teal on the far one
      vec3 thru = mix(cDeep * .46 + cTurq * .06, cTurq * .8 + SUNC * vec3(.42, .36, .04), smoothstep(-.4, .75, sideS));
      pale = mix(pale, thru * (.72 + .4 * sunK), low * .8);
      deepC = mix(deepC, deepC * (.5 + .9 * smoothstep(-.6, .8, sideS)) + SUNC * cTurq * .1 * max(sideS, 0.), low * .7);
      vec3 body = mix(pale, deepC, heart);
      body *= .78 + .3 * max(dot(Nm, uSun), 0.) * sunK;
      float rim = 1. - NVm; rim *= rim;
      body += cAqua * .2 * rim * rim * (1. - .6 * heart);               // thin, lit-through silhouette
      body *= .95 + .07 * sin(ph) * sk;
      body += cAqua * .09 * smoothstep(.55, 1., sin(ph)) * sk * (1. - farK);   // swell crests under the lens, closing on the peak
      // broad sun shafts inside the heart: beams fixed in the hill on two upright planes (one nearer the eye, one
      // beyond the axis), so they slant down from the sun's side and slide against each other and the skin as the eye moves
      float dz = min(Dm.z, -.05);
      vec3 Pa = vLp + Dm * clamp((170. - vLp.z) / dz, 0., chord), Pb = vLp + Dm * clamp((-210. - vLp.z) / dz, 0., chord);
      float ca = dot(Pa, uShB), cb = dot(Pb, uShB);
      float ba = smoothstep(.52, .93, .5 + .5 * sin(ca * .021 + 2.2 * vn(vec2(ca * .004, uTime * .02)) + uTime * .03));
      float bb = smoothstep(.6, .95, .5 + .5 * sin(cb * .037 + 2.6 * vn(vec2(cb * .006 + 9., uTime * .025)) - uTime * .04 + 1.7));
      float shF = ba * .8 * smoothstep(-25., 120., Pa.y) + bb * .5 * smoothstep(-25., 150., Pb.y);
      body += (cAqua * .42 + cTurq * .5) * shF * heart * (.25 + .75 * sunK) * mix(.1, .7, farS);
      // shoals far inside: silver smudges at true positions in the hill, so they shift against the heart as the eye moves
      float shoalS = 0.;
      for (int i = 0; i < 4; i++) {
        float fi = float(i);
        vec2 cq = (i == 0 ? vec2(-270., 310.) : i == 1 ? vec2(200., 430.) : i == 2 ? vec2(-60., 540.) : vec2(340., 190.)) + vec2(sin(uTime * .05 + fi * 2.1), cos(uTime * .04 + fi)) * 35.;
        vec3 Cq = vec3(cq.x, tideH(cq) - 34. - 12. * fi, cq.y);
        float tc = clamp(dot(Cq - vLp, Dm), 0., chord);
        vec3 off = Cq - (vLp + Dm * tc); off.y *= 2.2;
        float mS = exp(-dot(off, off) / (800. + 320. * fi)); mS = mS * (.6 + .8 * mS);
        float fl = smoothstep(.3, .75, vn(off.xz * .07 + off.yy * .09 + vec2(uTime * .5, fi * 5.)));
        shoalS += mS * (.35 + .65 * fl) * smoothstep(170., 420., length(vCam - Cq)) * exp(-tc / 1300.);
      }
      body = mix(body, cIvory * .8 + cWhite * .25, clamp(shoalS * 1.2, 0., 1.) * .7 * (.6 + .4 * sunK));
      float aB = 1. - exp(-dW / mix(400., 165., smoothstep(8., 60., thick)));   // the thin foot is clearer still: kelp and reef show through it                                  // beside the lens the skin is thin: you look in
      aB = max(aB, exitK * .88);
      aB = max(aB, .05);
      // the peak is a thin column of clear water: pale, luminous, a lens showing the sky upside down
      float lq = length(p - uQuiv.xy), tipK = exp(-lq / 26.), tipL = smoothstep(52., 15., lq);
      // the peak is a column of clear water, a lens: sky below, the pale horizon across it, the sea on top (all
      // upside down), a darker heart and a bright thin rim where it turns away from the eye
      float cx = clamp(dot(normalize(Nm.xz + vec2(1e-4)), normalize(V.xz + vec2(1e-4))), 0., 1.), edgeL = 1. - cx;
      float hh = clamp((vLp.y - 257.) / 44., 0., 1.);
      float dyL = (.46 - hh) * 1.25 + (sL.x - sL.y) * .7 + edgeL * edgeL * .5 + .09 * sin(hh * 23. - uTime * 2.2 + cx * 3.);
      vec3 lens = skyCol(normalize(vec3(.3, dyL * (dyL > 0. ? 2.6 : 1.), 1.)));        // a thin milk horizon, not a pale half
      lens = mix(lens, cTurq * .62 + cDeep * .25, smoothstep(-.02, -.3, dyL) * .75);
      lens *= mix(.6, 1.05, smoothstep(.15, .85, edgeL)) * (.74 + .34 * sunK);
      lens += cWhite * .55 * edgeL * edgeL * edgeL * edgeL * (.45 + .55 * sunK) + cAqua * .25 * smoothstep(.75, 1., edgeL);
      body = mix(body, lens, tipL * .96); aB = mix(aB, .95, tipL);
      // crest lines of the climbing swell
      refl += cIvory * .14 * smoothstep(.75, 1., sin(ph)) * sk;
      // seen across the hill: eight or so broad bright swell rings wrapped round it like contours, climbing; and the
      // moon's slate underside mirrored on the upper slope
      float ring2 = smoothstep(.72, 1., sin(r * .043 + uTime * .4 + 2.5 * vn(p * .004))) * sk * farS * smoothstep(.04, .2, NVm);
      body += (cIvory * .2 + cAqua * .1) * ring2 * (.5 + .5 * sunK);
      // across the hill a true grazing mirror would paint the whole flank with sky: where the eye looks into the heart
      // the mirror is turned well down, so the water reads as clear and deep
      F = max(F, mr.a * .16 * farS) * (1. - .86 * heart * farS) * (1. - .45 * low * heart);   // a low sun's cream horizon would whiten the near water
      vec3 Rf = refract(-V, N, .75);
      float cosr = max(dot(-Rf, Nm), .25), deepK = smoothstep(6., 40., thick) * (1. - tipK);
      vec3 P1 = vLp + Rf * (7. / cosr), P2 = vLp + Rf * (22. / cosr);
      vec2 q1 = vec2(dot(P1, uShA) * .1 + uTime * .05, dot(P1, uShB) * .024), q2 = vec2(dot(P2, uShA) * .045 - uTime * .03, dot(P2, uShB) * .011 + 3.);
      float v1 = smoothstep(.45, .85, vn(q1) * .7 + vn(q1 * 2.3 + 1.7) * .3);
      float v2 = smoothstep(.42, .8, vn(q2) * .7 + vn(q2 * 2.1 + 5.1) * .3);
      vec3 shaftC = (cAqua * .5 + cTurq * .4) * (v1 * .2 + v2 * .26) * deepK * sunK / (1. + dist / 650.) * mix(2.6, 1., farK);
      vec3 col = refl * F + glit + (body * aB + shaftC) * (1. - F);
      float A = 1. - (1. - F) * (1. - aB);
      // foam: streaks drawn up the slope, lace at the lip, rain where the sheets land
      float foam = 0.;
      float ln = 1. - abs(2. * vn(rh * 130. + vn(p * .02) * 1.5) - 1.);          // thin streaks drawn up the slope
      float gate = smoothstep(.5, .72, vn(rh * 9. + vec2(r * .011 - uTime * .12)));
      float dash = smoothstep(.35, .7, vn(vec2(r * .09 - uTime * .5, dot(rh, vec2(23., 41.))))) * vn(p * .9 + uTime * .3);
      foam += smoothstep(.86, .99, ln) * gate * dash * dash * smoothstep(1250., 950., r) * smoothstep(10., 60., r) * (1. + 1.6 * smoothstep(280., 70., r)) * (.5 + .4 * (1. - farK)) / (1. + dist / 500.) * smoothstep(4., 16., dist);
      float lace = vn(p * .6 + uTime * .7) * vn(p * 1.9 - uTime * .9);                    // the lip: a glassy face with a foam foot and lace behind it
      foam += smoothstep(1384., 1398., r) * smoothstep(.12, .42, lace) * .8 + vLip * (.3 + .7 * smoothstep(.2, .5, vn(p * 2.3 + uTime * 1.6))) + smoothstep(.5, 1., vLip);
      float rain = 0.;
      for (int i = 0; i < 9; i++) {
        vec4 hI = uHit[i]; float d = length(p - hI.xy);
        float m = smoothstep(hI.z * 1.3, hI.z * .3, d) * hI.w;
        rain += m * (.3 + .7 * vn(p * 1.7 + vec2(float(i) * 7., uTime * 3.)));
      }
      foam += rain * .62;
      // trade wind: whitecaps that run up the slope
      // many small crisp crests, long across the slope and short up it, in gusty patches, thinning with distance
      float th = atan(p.x, abs(p.y) + 1e-3);
      vec2 c1 = vec2(th * (150. + 270. * smoothstep(120., 900., r)), r * 1.35 - uTime * 2.4), c2 = vec2(th * (50. + 100. * smoothstep(120., 900., r)), r * .5 - uTime * 1.5);
      float gust = smoothstep(.3, .62, vn(p * .03 + vec2(uTime * .06, 0.)));
      float cr1 = smoothstep(.7, .78, vn(c1) * .8 + vn(c1 * vec2(2.3, 1.7) + 5.) * .2) / (1. + dist / 80.);
      float cr2 = smoothstep(.69 + .08 * smoothstep(120., 900., dist), .8, vn(c2) * .8 + vn(c2 * vec2(2.1, 1.9) + 9.) * .2) * smoothstep(30., 130., dist) / (1. + dist / 420.);
      foam += uWind * (cr1 + cr2 * .85) * gust * (.55 + .45 * vn(p * 2.1 + uTime)) * smoothstep(1390., 1200., r) * smoothstep(20., 90., r);
      foam = clamp(foam, 0., 1.);
      vec3 foamC = cWhite * .74 * (.42 + .58 * sunK * max(dot(Nm, uSun), .35)) + cSlate * .08;
      col = mix(col, foamC, foam); A = mix(A, 1., foam);
      col = fogMixP(col, A);
      gl_FragColor = vec4(col, A);
    }`,{transparent:!0,premultipliedAlpha:!0,depthWrite:!0},{uHit:o.SH.uHit,uShA:o.SH.uShA,uShB:o.SH.uShB}),v=new a.Mesh(i,g);return v.frustumCulled=!1,v.renderOrder=2,v}const te=(o,e,t=new a.Vector3)=>{const p=o/O;return t.set(Math.sin(p)*Math.sin(e),-Math.cos(p),Math.sin(p)*Math.cos(e))};function xe(o){const e=[],t=(d,i,s,n={})=>e.push({dir:te(d,i),d,phi:i,rc:s,depth:n.depth??s*o.range(.16,.24),rim:n.rim??s*o.range(.06,.1),lake:!!n.lake,peak:!!n.peak});t(0,0,80,{depth:15,rim:6.5,lake:!0}),t(Math.hypot(72,178),Math.atan2(-72,178),o.range(38,46),{lake:!0});const p=(d,i,s,n,f)=>{const g=te(i,s);return e.every(v=>v.dir.distanceTo(g)*O>(v.rc+n)*f)};for(let d=0,i=0;d<30&&i<600;i++){const s=o.range(105,640),n=o.range(0,Math.PI*2),f=o.range(14,30)+(o.chance(.35)?o.range(10,34):0);p(0,s,n,f,1.02)&&(t(s,n,f,{lake:f>20&&o.chance(.5),peak:f>34&&o.chance(.6)}),d++)}for(let d=0,i=0;d<34&&i<600;i++){const s=o.range(680,2350),n=o.range(0,Math.PI*2),f=o.range(55,150)+(o.chance(.3)?o.range(30,90):0);p(0,s,n,f,.85)&&(t(s,n,f,{peak:o.chance(.5),depth:f*o.range(.12,.2)}),d++)}const c=o.fork("big");for(const[d,i,s]of[[400,.75,130],[440,-.72,118],[470,2.35,150],[390,-2.5,112],[575,3.25,140]]){const n=s*c.range(.9,1.1);t(d+c.range(-20,20),i+c.range(-.12,.12),n,{depth:n*.2,rim:n*.13,peak:c.chance(.5)})}return e}function ne(o,e,t){let p=0,c=0,d=0,i=0;for(let s=0;s<o.length;s++){const n=o[s],f=e.x-n.dir.x,g=e.y-n.dir.y,v=e.z-n.dir.z,l=Math.sqrt(f*f+g*g+v*v)*O/n.rc;if(l>2.8)continue;let m=0;if(l<1){m=-n.depth*(1-Math.pow(l,2.6)),n.peak&&(m+=n.depth*.42*Math.exp(-(l*l)/.03));const y=-n.depth*.5;n.lake&&m<y&&(c=Math.max(c,Math.min(1,(y-m)/(n.depth*.06))),m=y),i=Math.max(i,1-l*l)}const b=l<1?.13:.34,w=(l-1)/b;m+=n.rim*Math.exp(-w*w),l>1&&(m+=n.rim*.25*Math.exp(-(l-1)*2.2)),p+=m,n.lake&&(d=Math.max(d,1-Math.min(1,Math.abs(l-.95)/.75)))}return t&&(t[0]=c,t[1]=d,t[2]=i),p}async function ge(o,e){const t=[];for(let l=0;l<=62;l++)t.push(.5*Math.pow(l/62,1.25));for(let l=1;l<=24;l++)t.push(.5+1.5*Math.pow(l/24,1.3));const p=192,{g:c}=K(t,p),d=c.attributes.position.array,i=new Float32Array(t.length*p*3),s=new a.Vector3,n=[0,0,0],f=o.noise;await o.yield();for(let l=0;l<t.length;l++){await o.yield();for(let m=0;m<p;m++){const b=l*p+m,w=-(m/p)*Math.PI*2;te(t[l]*O,w,s);let y=ne(e,s,n);n[0]<.5&&(y+=5*f.fbm3(s.x*5,s.y*5,s.z*5,3)+1.6*f.n3(s.x*24,s.y*24,s.z*24)*(1-n[0]));const r=O+y;d[b*3]=s.x*r,d[b*3+1]=s.y*r,d[b*3+2]=s.z*r,i[b*3]=n[0],i[b*3+1]=n[1],i[b*3+2]=n[2]}}await o.yield(),c.setAttribute("aTone",new a.BufferAttribute(i,3)),await ue(c,o.yield),await o.yield();const g=o.mk(`
    attribute vec3 aTone; uniform mat3 uRot;
    varying vec3 vN; varying vec3 vTone; varying vec3 vRest;
    void main(){
      vec3 lp = uRot * position + MOONC; vN = uRot * normal; vTone = aTone; vRest = position;
      ${E} }`,`
    varying vec3 vN; varying vec3 vTone; varying vec3 vRest;
    vec3 pit(vec2 q, float thr){
      vec2 ci = floor(q), cf = fract(q) - .5; float hh = h21(ci);
      vec2 c = cf - (vec2(h21(ci + 2.1), h21(ci + 5.3)) - .5) * .5; float lc = length(c);
      float pd = lc / (.08 + .2 * h21(ci + 9.7)), pin = smoothstep(1.15, .85, pd) * step(thr, hh);
      return vec3(c / max(lc, 1e-3) * pin * smoothstep(0., .8, pd) * .5, pin);
    }
    void main(){
      vec3 toC = vCam - vLp; float dist = length(toC); vec3 V = toC / max(dist, 1e-3);
      vec3 n = normalize(vN);
      vec2 q = vRest.xz * .05 + vRest.yy * vec2(.023, -.017);
      // small pits to 3 m: lit crescents and a darker floor
      vec3 p1 = pit(q * .7, .82), p2 = pit(q * 2.6 + 7.3, .6) * (1. / (1. + dist / 500.)) * smoothstep(.38, .62, fbm(q * .13 + 4.));   // pits come in fields, not evenly
      vec2 bump = p1.xy + p2.xy; float pin = max(p1.z, p2.z);
      n = normalize(n + vec3(bump.x, 0., bump.y));
      float mott = fbm(q * .6) * .6 + fbm(q * 4.) * .4;
      float down = max(-n.y, 0.), dAx = length(vLp.xz);
      float wetZone = max(vTone.y, .75 * exp(-dAx * dAx / 250000.) * down);
      float streak = smoothstep(.4, .8, fbm(q * vec2(.5, 3.4) + 3.)) ;
      float wet = clamp(wetZone * (.45 + .75 * streak), 0., 1.);
      vec3 alb = cIvory * (.6 + .22 * mott) * (1. - .2 * pin) * (1. - .34 * vTone.z);
      alb *= mix(1., .55, wet);
      alb *= 1. - .3 * smoothstep(.5, .8, fbm(q * vec2(.22, 1.9) + 17.)) * (.4 + .6 * wetZone);   // tide stains
      // dark stains drawn from the crater lips toward the low point: radial streaks in the stone's own frame
      float dR = length(vRest.xz); vec2 un = vRest.xz / max(dR, 1.);          // a function of direction only: radial, and no seam
      float stn = smoothstep(.55, .8, vn(un * 15. + 3.) * .65 + vn(un * 5.7 + vec2(dR * .004, 5.)) * .35);
      alb *= 1. - .22 * stn * smoothstep(60., 220., dR) * smoothstep(.3, .62, vTone.z * .5 + fbm(q * .16 + 9.));   // in runs below the lips, never an even grain
      // the key is lowered for the stone so the port flank reads ivory well down toward the belly
      vec3 sm = normalize(vec3(uSun.x, uSun.y * .35 - .22, uSun.z));
      float nl = max(dot(n, sm) * .8 + .2, 0.); nl *= nl;
      float prox = exp(-dAx * dAx / 640000.);
      vec3 col = alb * SUNC * nl;
      vec3 Lb = normalize(vec3(uSun.x * .9, -.55, uSun.z * .9));                               // light off the sunlit sea, from below to port
      float nb = dot(n, Lb) * .5 + .5;
      col += alb * (cSlate * (.44 + 1.0 * nb * nb) + cTurq * (.08 + .3 * nb * nb) * down * prox);  // slate floor + sea bounce; the bounce models the relief
      col += (cAqua * .3 + cTurq * .12) * caustic(vLp.xz * .017, uTime * .36) * down * (.06 + 1.35 * exp(-dAx * dAx / 42000.)) * (1. - .5 * vTone.x);   // soft, slow, strong only over the peak
      float fres = 1. - max(dot(n, V), 0.); fres = fres * fres * fres;
      col += (cAqua * .5 + cIvory * .25) * fres * wet * .55;                                 // wet gloss
      // crater lakes clinging to the ceiling
      float shiver = caustic(vRest.xz * .09, uTime * 1.3);
      vec3 lakeC = cTurq * (.42 + .4 * shiver) + cAqua * (.12 + .5 * fres) + cDeep * .12;
      lakeC += cWhite * .9 * smoothstep(1.1, 1.5, shiver) * prox;
      col = mix(col, lakeC, vTone.x);
      // air between the eye and the stone: the far limb goes a tone paler and bluer and sinks into the haze
      float hz = 1. - exp(-dist / 3800.);
      col = mix(col, cAqua * .5 + cIvory * .42, hz * .56);
      gl_FragColor = vec4(fogMix(col), 1.);
    }`,{},{uRot:o.SH.uRot}),v=new a.Mesh(c,g);return v.frustumCulled=!1,v}function ye(o,e){const t=o.rng.fork("sheets"),p=Math.round(5+4*Math.min(1,Math.max(0,(o.detail-.6)/.4))),c=new a.Vector3,d=new a.Vector3,i=new a.Vector3(0,0,1),s=new a.Vector3,n=(M,D,U)=>(c.crossVectors(M.dir,i).normalize(),d.crossVectors(M.dir,c),s.copy(M.dir).addScaledVector(c,Math.cos(D)*M.rc*.98/O).addScaledVector(d,Math.sin(D)*M.rc*.98/O).normalize(),U.copy(s).multiplyScalar(O+ne(e,s)+.4)),f=new a.Vector3,g=[],v=(M,D,U)=>{let H=0,Y=-1e9;for(let I=0;I<96;I++){const h=I/96*Math.PI*2;n(M,h,f);const u=M.dir.x*O,k=M.dir.z*O,x=(f.x-u)*D+(f.z-k)*U;x>Y&&(Y=x,H=h)}return H};g.push({c:e[0],psi:v(e[0],-.59,-.81),arc:36}),g.push({c:e[0],psi:v(e[0],.59,-.81),arc:36}),g.push({c:e[1],psi:v(e[1],1,.15),arc:52});const l=t.shuffle(e.filter((M,D)=>D>1&&M.d>100&&M.d<340&&M.rc>=20));for(const M of l){if(g.length>=p)break;const D=t.range(0,Math.PI*2),U=Math.min(90,M.rc*t.range(1.3,2.1));let H=!0;for(let Y=0;Y<=6;Y++)n(M,D+(Y/6-.5)*U/M.rc,f),f.z>-40&&Math.abs(f.x)<26&&(H=!1);H&&g.push({c:M,psi:D,arc:U})}const m=14,b=16,w=[],y=[],r=[],q=[],C=[],F=[],R=new a.Vector3;g.forEach((M,D)=>{n(M.c,M.psi,R),M.mid=R.clone(),M.seed=t();const U=w.length/3,H=M.c.dir.x*O,Y=M.c.dir.z*O;for(let I=0;I<=m;I++){n(M.c,M.psi+(I/m-.5)*M.arc/M.c.rc,f);const h=f.x-H,u=f.z-Y,k=Math.hypot(h,u)||1;for(let x=0;x<=b;x++)w.push(f.x,f.y,f.z),y.push(R.x,R.y,R.z),r.push(I/m,x/b),q.push(M.seed,M.arc),C.push(h/k,u/k)}for(let I=0;I<m;I++)for(let h=0;h<b;h++){const u=U+I*(b+1)+h,k=u+b+1;F.push(u,k,u+1,k,k+1,u+1)}});const V=new a.BufferGeometry;V.setAttribute("position",new a.Float32BufferAttribute(w,3)),V.setAttribute("aMid",new a.Float32BufferAttribute(y,3)),V.setAttribute("uv",new a.Float32BufferAttribute(r,2)),V.setAttribute("aSeed",new a.Float32BufferAttribute(q,2)),V.setAttribute("aOut",new a.Float32BufferAttribute(C,2)),V.setIndex(F);const S=o.mk(`
    attribute vec3 aMid; attribute vec2 aSeed; attribute vec2 aOut; uniform mat3 uRot;
    varying vec2 vUv; varying vec3 vS;
    void main(){
      vec3 tp = uRot * position + MOONC, md = uRot * aMid + MOONC;
      float v = uv.y;
      vec2 xz = mix(tp.xz, md.xz, .5 * v * sqrt(v));
      float foot = surfY(xz) + .3;
      xz += aOut * (sin(v * 8. - uTime * 2.1 + aSeed.x * 40.) * 1.8 + sin(v * 21. - uTime * 3.4 + uv.x * 5.) * .55) * v;
      vec3 lp = vec3(xz.x, mix(tp.y, foot, v), xz.y);
      vUv = uv; vS = vec3(aSeed, tp.y - foot);
      ${E} }`,`
    varying vec2 vUv; varying vec3 vS;
    void main(){
      float u = vUv.x, v = vUv.y, wM = vS.y, len = max(vS.z, 1.);
      float c = sqrt(v) * len * .11 - uTime * 1.05;                       // faster and more stretched lower down
      float a1 = vn(vec2(u * wM * .75 + vS.x * 90., c * 1.6));
      float a2 = vn(vec2(u * wM * 2.6 + vS.x * 31., c * 4.2 + 3.));
      float a3 = vn(vec2(u * wM * .22 + vS.x * 57., uTime * .25));          // where along the lip the water lets go
      float body = smoothstep(.2 + .22 * v, .7 + .12 * v, a1 * .62 + a2 * .38 + (1. - v) * .42);
      float ue = abs(u * 2. - 1.);
      float edge = smoothstep(1., .62, ue * (1. + .35 * v) + .2 * a1 + .16 * (1. - a3));
      float topR = smoothstep(0., .05, v - (.01 + .2 * (1. - a3) * (1. - a3) + .07 * a2));   // no straight top edge
      float mist = smoothstep(.45, 1., v) * (1. - ue * ue) * (.1 + .16 * a1);
      float a = max(body * edge * (.92 - .42 * v) * topR, mist * smoothstep(1., .93, v));
      float sh = moonShade(vLp);
      vec3 col = mix(cAqua * .62 + cSlate * .1, cWhite * .74, a1 * .7 + .3 * a2) * (.5 + .52 * sh);
      col += cWhite * .45 * a2 * a2 * a2 * sh * (1. - v * .5);
      gl_FragColor = vec4(fogMix(col), a);
    }`,{transparent:!0,depthWrite:!1,side:a.DoubleSide},{uRot:o.SH.uRot}),B=new a.Mesh(V,S);return B.frustumCulled=!1,B.renderOrder=4,{mesh:B,specs:g}}const Z=`
vec3 waterBall(vec3 n, vec3 V, vec3 p){
  float nv = max(dot(n, V), 0.), k = 1. - nv, F = .03 + .97 * k * k * k * k;
  vec3 R = reflect(-V, n); vec4 mr = moonRay(p, R); vec3 refl = mix(skyCol(R), mr.rgb, mr.a);
  vec3 T = normalize(-V - 1.6 * (n - nv * V));                           // the world seen upside down through a lens
  vec4 mt = moonRay(p, T); vec3 tr = mix(skyCol(T), mt.rgb, mt.a);
  tr = mix(tr, cTurq * .8, smoothstep(0., -.35, T.y) * .6);
  float sp = pow(max(dot(R, uSun), 0.), 180.) * moonShade(p);
  return tr * (1. - F) * .9 + refl * F * 1.1 + SUNC * sp * 6.;
}
`;function we(o){const e=new a.CylinderGeometry(1,1,1,10,28,!0);e.translate(0,.5,0);const t=o.mk(Z+`
    varying vec3 vN;
    void main(){
      float v = position.y;
      float bz = smoothstep(.5, .72, v), bs = max(sin(v * 30. - uTime * 5.2), 0.);
      float rad = mix(2.3, .4, sqrt(v)) * mix(1. + .3 * sin(v * 17. - uTime * 3.), .1 + 2.5 * bs * sqrt(bs), bz) * (.1 + .9 * smoothstep(1., .94, v));
      vec2 sw = uQuiv.xy + vec2(sin(uTime * 2.5 + v * 4.), cos(uTime * 2.1 + v * 5.)) * .6 * v * v;
      vec3 lp = vec3(sw.x + position.x * rad, ropeTop() - 13. * (1. - v), sw.y + position.z * rad);
      vN = normalize(vec3(position.x, .25 + .45 * cos(v * 30. - uTime * 5.2) * bz, position.z));
      ${E} }`,Z+`
    varying vec3 vN;
    void main(){ vec3 V = normalize(vCam - vLp); gl_FragColor = vec4(fogMix(waterBall(normalize(vN), V, vLp)), 1.); }`),p=new a.Mesh(e,t);return p.frustumCulled=!1,p}const re=`
  attribute vec4 aB; attribute vec2 aB2;
  vec3 beadCentre(out float sc){
    float tau = fract(aB.x + uTime / 9.);
    if (aB2.x < 0.) {                                                    // course beads: aB = phase, x, z, radius
      sc = aB.w * smoothstep(0., .14, tau) * (1. - smoothstep(.9, 1., tau));
      float y0 = max(320. - .3788 * aB.z - 21., surfY(vec2(aB.y, aB.z)) + 1.5);
      vec2 wb = vec2(sin(uTime * .7 + aB2.y), cos(uTime * .6 + aB2.y * 1.7)) * .35 * tau;
      return vec3(aB.y + wb.x, y0 - aB2.x * tau * sqrt(tau), aB.z + wb.y);
    }
    sc = aB.w * smoothstep(0., .05, tau) * (1. - smoothstep(.94, 1., tau));
    vec2 lat = vec2(sin(aB.z), cos(aB.z)) * aB.y * smoothstep(0., .3, tau) + uQuiv.xy * (1. - tau);
    lat += vec2(sin(uTime * .7 + aB2.y), cos(uTime * .6 + aB2.y * 1.7)) * .5 * tau;
    return vec3(lat.x, ropeTop() + aB2.x * tau * tau, lat.y);
  }
`;function be(o){const e=o.rng.fork("beads"),t=60,p=t+96,c=new a.IcosahedronGeometry(1,2),d=new a.InstancedBufferGeometry;d.index=c.index,d.setAttribute("position",c.attributes.position);const i=new Float32Array(p*4),s=new Float32Array(p*2);for(let r=0;r<t;r++)i[r*4]=(r+e())/t,i[r*4+1]=2.4+11*Math.pow(e(),.8),i[r*4+2]=e()*Math.PI*2,i[r*4+3]=.14+.6*Math.pow(e(),1.5),s[r*2]=e.range(74,88),s[r*2+1]=e()*40;for(let r=t;r<p;r++){const q=r-t;i[r*4]=(q*.618034+e()*.1)%1,i[r*4+1]=(q%2?1:-1)*e.range(2.7,6.2),i[r*4+2]=4+150*((q+e())/96),i[r*4+3]=.34+.86*Math.pow(e(),1.5),s[r*2]=-e.range(50,64),s[r*2+1]=e()*40}d.setAttribute("aB",new a.InstancedBufferAttribute(i,4)),d.setAttribute("aB2",new a.InstancedBufferAttribute(s,2)),d.instanceCount=p;const n=o.mk(Z+re+`
    varying vec3 vN;
    void main(){
      float sc; vec3 ctr = beadCentre(sc);
      float wob = sin(uTime * 5. + aB2.y) * .17;
      vec3 st = vec3(1. - wob * .5, 1. + wob, 1. - wob * .5);
      vec3 lp = ctr + position * st * sc; vN = normalize(position / st);
      ${E} }`,Z+`
    varying vec3 vN;
    void main(){ vec3 V = normalize(vCam - vLp); gl_FragColor = vec4(fogMix(waterBall(normalize(vN), V, vLp)), 1.); }`),f=new a.Mesh(d,n);f.frustumCulled=!1;const g=Math.round(1e3*o.detail),v=new a.InstancedBufferGeometry,l=new a.PlaneGeometry(2,2);v.index=l.index,v.setAttribute("position",l.attributes.position);const m=new Float32Array(g*4),b=new Float32Array(g*2);for(let r=0;r<g;r++)m[r*4]=e(),m[r*4+1]=.25+10*Math.pow(e(),1.8),m[r*4+2]=e()*Math.PI*2,m[r*4+3]=.06+.4*Math.pow(e(),3),b[r*2]=e.range(70,90),b[r*2+1]=e()*40;v.setAttribute("aB",new a.InstancedBufferAttribute(m,4)),v.setAttribute("aB2",new a.InstancedBufferAttribute(b,2)),v.instanceCount=g;const w=o.mk(re+`
    varying vec2 vQ;
    void main(){
      float sc; vec3 lp = beadCentre(sc); vQ = position.xy;
      vLp = lp; vCam = camLocal();
      vec4 mvPosition = modelViewMatrix * vec4(lp, 1.);
      float px = max(sc, -mvPosition.z * .0011);                         // never thinner than about a pixel and a half
      mvPosition.xy += position.xy * px;
      gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
    }`,`
    varying vec2 vQ;
    void main(){
      float r2 = dot(vQ, vQ); if (r2 > 1.) discard;
      float rim = r2 * r2, sh = moonShade(vLp);
      vec3 col = mix(cAqua * .98, cTurq * .78, smoothstep(-.5, .8, vQ.y));  // sky below, sea above: inverted
      col += cWhite * .85 * rim * rim;
      vec2 gd = vQ - vec2(-.38, .42); col += SUNC * 5. * smoothstep(.07, 0., dot(gd, gd)) * sh;
      gl_FragColor = vec4(fogMix(col), 1.);
    }`),y=new a.Mesh(v,w);return y.frustumCulled=!1,[f,y]}function ze(o){const e=o.rng.fork("shafts"),t=90,p=[],c=[],d=[],i=[];for(let g=0;g<t;g++){const v=e.range(170,820),l=e.chance(.6)?e.range(-1.4,1.4):e.range(0,Math.PI*2),m=e.range(7,20),b=e.range(38,70),w=e()*100,y=g*4;for(const[r,q]of[[-1,0],[1,0],[1,1],[-1,1]])p.push(Math.sin(l)*v,0,Math.cos(l)*v),c.push(r,q),d.push(m,b,w);i.push(y,y+1,y+2,y,y+2,y+3)}const s=new a.BufferGeometry;s.setAttribute("position",new a.Float32BufferAttribute(p,3)),s.setAttribute("uv",new a.Float32BufferAttribute(c,2)),s.setAttribute("aS",new a.Float32BufferAttribute(d,3)),s.setIndex(i);const n=o.mk(`
    attribute vec3 aS; uniform vec3 uShDir; varying vec2 vUv; varying float vK;
    void main(){
      vec2 xz = position.xz + vec2(sin(uTime * .13 + aS.z), cos(uTime * .11 + aS.z * 1.3)) * 6.;
      float thick = tideH(xz) - BEDY;
      vec3 top = vec3(xz.x, tideH(xz) - 1.5, xz.y);
      vec3 ctr = top + uShDir * uv.y * aS.y * clamp(thick / 70., .15, 1.);
      vec3 cl = camLocal(), sd = cross(uShDir, cl - ctr);
      sd /= max(length(sd), 1e-3);
      vec3 lp = ctr + sd * uv.x * aS.x * (.55 + .6 * uv.y);
      // seen edge-on through the clear skin from far off, dozens of them stacked into a white haze: they belong to the near water
      vUv = uv; vK = (.55 + .45 * sin(uTime * .35 + aS.z * 7.)) * smoothstep(8., 30., thick) * smoothstep(300., 110., length(cl - ctr));
      ${E} }`,`
    varying vec2 vUv; varying float vK;
    void main(){
      float e = 1. - abs(vUv.x); e *= e;
      float a = e * smoothstep(0., .12, vUv.y) * (1. - vUv.y) * vK * moonShade(vLp);
      vec3 col = (cAqua * .5 + cTurq * .35 + cIvory * .1) * a * .8;
      gl_FragColor = vec4(fogMixP(col, 0.), 1.);
    }`,{transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide},{uShDir:o.SH.uShDir}),f=new a.Mesh(s,n);return f.frustumCulled=!1,f.renderOrder=1,f}function Se(o,e){const t=new fe,p=(h,u=1)=>h.clone().multiplyScalar(u),c=p(o[0],.74),d=p(o[1],.62),i=new a.Color(.07,.15,.17),s=new a.Color(.3,.22,.15),n=new a.Color(.48,.4,.29),f=new a.Color(.55,.45,.27),g=new a.Color(.5,.47,.4),v=12,l=[];for(let h=0;h<=v;h++){const u=-1+2*h/v,k=Math.abs(u),x=u*5.25+Math.sign(u)*.35*Math.pow(k,6),z=.96*Math.pow(Math.max(0,1-Math.pow(k,2.3)),.75)+.015,A=-.55*(1-Math.pow(k,3)),L=.56+.85*Math.pow(k,2.4),T=[[A,0,i],[A*.55,z*.68,i],[.06,z*.95,c],[L-.14,z,c],[L,z,d],[L-.05,Math.max(0,z-.1),d],[-.08,z*.5,n]],P=[];for(let N=0;N<T.length;N++)P.push(t.v(x,T[N][0],T[N][1],T[N][2]));P.push(t.v(x,-.12,0,n));for(let N=T.length-1;N>=1;N--)P.push(t.v(x,T[N][0],-T[N][1],T[N][2]));l.push(P)}for(let h=0;h<v;h++){const u=l[h],k=l[h+1],x=u.length;for(let z=0;z<x;z++){const A=(z+1)%x;t.quad(u[z],u[A],k[A],k[z])}}for(const h of[-1,1])t.beam(h*5.55,1.3,0,h*5.75,2.05,0,.12,.2,d);for(const h of[-2.6,-.6,2.2])t.beam(h,.5,-.82,h,.5,.82,.22,.06,s);const m=-3.3,b=[];for(let h=0;h<=6;h++){const u=-1+2*h/6,k=.2*Math.pow(Math.max(0,1-Math.pow(Math.abs(u),2.2)),.6)+.02,x=[];for(let z=0;z<6;z++){const A=z/6*Math.PI*2;x.push(t.v(u*3.3,.08+Math.cos(A)*k+.25*u*u,m+Math.sin(A)*k,z<3?n:c))}b.push(x)}for(let h=0;h<6;h++)for(let u=0;u<6;u++){const k=(u+1)%6;t.quad(b[h][u],b[h][k],b[h+1][k],b[h+1][u])}for(const h of[-1.6,1.7])t.beam(h,.72,.8,h,1,-1.6,.1,.1,s),t.beam(h,1,-1.6,h*.9,.2,m,.1,.1,s);const w=.7,y=[3,1.55],r=[-3.5,1.35],q=[-3.1,11.5],C=[2.1,9];t.beam(w,0,0,w,11.9,0,.2,.2,s),t.beam(C[0]+.35,C[1]-.15,.12,q[0]-.4,q[1]+.2,.12,.11,.11,s),t.beam(y[0]+.2,y[1],.12,r[0]-.3,r[1],.12,.1,.1,s);const F=6,R=9,V=[],S=o[6],B=new Set;for(;B.size<3;)B.add(e.int(0,F-1)+"_"+e.int(1,R-2));const M=(h,u)=>{const k=y[0]+(r[0]-y[0])*h,x=y[1]+(r[1]-y[1])*h,z=C[0]+(q[0]-C[0])*h,A=C[1]+(q[1]-C[1])*h;return[k+(z-k)*u-.25*Math.sin(Math.PI*u)*(h-.3),x+(A-x)*u,.16+.95*Math.sin(Math.PI*h)*Math.pow(Math.sin(Math.PI*u),.7)]};for(let h=0;h<F;h++)for(let u=0;u<R;u++){const k=B.has(h+"_"+u)?e.range(1.12,1.3):e.range(.9,1.04),x=p(S,k*(.86+.14*u/R));B.has(h+"_"+u)&&x.lerp(o[0],.22);const z=[[h,u],[h+1,u],[h+1,u+1],[h,u+1]].map(([A,L])=>{const T=M(A/F,L/R);return t.v(T[0],T[1],T[2],x,1,A/F,L/R)});t.quad(z[0],z[1],z[2],z[3])}t.beam(w,11.8,0,5.6,1.9,0,.06,.06,g),t.beam(w,11.8,0,-5.6,1.9,0,.06,.06,g),t.beam(w,11.6,0,.4,.3,m,.06,.06,g),t.beam(-4.3,1.5,.35,-6,.1,.8,.09,.09,s),t.beam(-6,.1,.8,-6.9,-.65,1,.07,.42,n);const D=-3.3,U=-1,H=.78,Y=2.05;for(const h of[D,U])for(const u of[-H,H])t.beam(h,.6,u*.95,h,Y,u,.07,.07,s);for(let h=0;h<3;h++)for(let u=0;u<2;u++){const k=p(o[0],.62+.06*((h+u)%2)),x=[[h,u],[h+1,u],[h+1,u+1],[h,u+1]].map(([z,A])=>t.v(D+(U-D)*z/3,Y+.18*Math.sin(Math.PI*A/2)-.07*Math.sin(Math.PI*z/3),-H+2*H*A/2,k,3,z/3,A/2));t.quad(x[0],x[1],x[2],x[3])}const I=(h,u,k,x,z,A,L,T,P)=>{const N=[],_=[];for(let W=0;W<L;W++){const J=W/L*Math.PI*2;N.push(t.v(h+Math.cos(J)*x,u,k+Math.sin(J)*x,T)),_.push(t.v(h+Math.cos(J)*z,u+A,k+Math.sin(J)*z,T))}const $=t.v(h,u+A+P,k,p(T,.7));for(let W=0;W<L;W++){const J=(W+1)%L;t.quad(N[W],N[J],_[J],_[W]),t.tri(_[W],_[J],$)}};I(3.3,.1,.25,.24,.34,.45,6,f,-.12),I(2.75,.05,-.3,.28,.38,.5,6,p(f,.85),-.14),I(3.75,.2,-.15,.2,.28,.4,6,f,-.1),I(1.35,0,.1,.72,.4,.3,7,new a.Color(.1,.2,.2),.22);for(let h=0;h<5;h++){const u=[[h,0],[h+1,0],[h+1,1],[h,1]].map(([k,x])=>t.v(w-.1-k*.36,11.95+(x?.36*(1-k/6):0),0,p(o[5],.74),2,k/5,x));t.quad(u[0],u[1],u[2],u[3])}return t.geometry()}const oe=`
attribute vec4 aI;   // azimuth of its lane, start radius, climbing speed, tack phase
attribute vec4 aJ;   // scale, tack amplitude (m), lane offset (m), seed
uniform vec3 uB0;    // the world keys one lane boat to the flight: x = hero-local radius (< 0 = free), y = lateral x
float gPh; float gTack; vec2 gHd;
// where this boat is (xz) at time t, its velocity, and 0..1 visibility (it sinks out at r 300 and re-enters at r 1000).
// Also sets gTack (-1..1, which tack) and gHd (the way the bow points: close-hauled, 36 degrees off the fall line).
vec2 boatAt(float t, out vec2 vel, out float vis){
  float rr = 300. + mod(aI.y - 300. - aI.z * t, 700.);
  vis = smoothstep(300., 335., rr) * smoothstep(1000., 965., rr);
  float w = .045 + .03 * fract(aJ.w * 7.31); gPh = w * t + aI.w;
  float xl = aJ.z + aJ.y * sin(gPh);
  vec2 vl = vec2(aJ.y * w * cos(gPh), -aI.z);
  gTack = clamp(cos(gPh) * 1.7, -1., 1.);
  if (abs(aJ.z) > 1.) gTack = sign(aJ.z);                              // lane boats hold one tack, bows turned away from the course
  if (aJ.w > 1.5 && uB0.x > 0.) { float back = uTime - t; rr = uB0.x + aI.z * back; xl = uB0.y - 1.1 * back; vis = 1.; vl = vec2(1.1, -aI.z); gTack = 1.; }
  float zl = sqrt(max(rr * rr - xl * xl, 1.));
  float ya = .64 * gTack; vec2 hd = vec2(sin(ya), -cos(ya));
  float c = cos(aI.x), s = sin(aI.x);
  gHd = vec2(c * hd.x + s * hd.y, -s * hd.x + c * hd.y);
  vel = vec2(c * vl.x + s * vl.y, -s * vl.x + c * vl.y);
  return vec2(c * xl + s * zl, -s * xl + c * zl);
}
`;function ke(o,e){const t=o.rng.fork("fleet"),p=o.boats,c=new Float32Array(p*4),d=new Float32Array(p*4);for(let S=0;S<p;S++){const B=S<7,M=S%2?1:-1;c[S*4]=B?0:t.chance(.62)?t.range(.14,1.25)*t.sign():t.range(1.25,Math.PI*2-1.25),c[S*4+1]=300+(S*.618034+t()*.05)%1*700,c[S*4+2]=t.range(2,3.2),c[S*4+3]=t()*6.28,d[S*4]=S===1?1.12:t.range(.86,1.14),d[S*4+1]=B?t.range(1.2,2.2):t.range(13,24),d[S*4+2]=B?M*t.range(11.5,15)*(M>0&&S>1?1.6:1):0,d[S*4+3]=t()+(S===1?2:0)}const i=new a.InstancedBufferAttribute(c,4),s=new a.InstancedBufferAttribute(d,4),n=new a.InstancedBufferGeometry;for(const S of["position","normal","color","aPart","uv"])n.setAttribute(S,e.attributes[S]);n.setAttribute("aI",i),n.setAttribute("aJ",s),n.instanceCount=p;const f=o.mk(oe+`
    attribute float aPart; attribute vec3 color;
    varying vec3 vN; varying vec3 vCol; varying vec3 vPu;
    void main(){
      vec2 vel; float vis; vec2 xz = boatAt(uTime, vel, vis);
      float sT = gTack, sd = aJ.w * 40.;
      vec3 N = tideN(xz), f0 = normalize(vec3(gHd.x, 0., gHd.y));
      vec3 r0 = normalize(cross(f0, N));
      vec3 up = normalize(N + r0 * ((.13 + .3 * uWind + .1 * step(1.5, aJ.w)) * sT + .035 * sin(uTime * .9 + sd)));
      vec3 fwd = normalize(f0 - up * dot(f0, up)), right = cross(fwd, up);
      vec3 q = position, nn = normal;
      if (aPart > .5 && aPart < 1.5) {                                   // sail: fills to leeward, leech flutters
        q.z = q.z * sT + sin(uv.y * 9. - uTime * 6. + sd) * .07 * uv.x;
        nn = vec3(normal.xy * sT, normal.z + 1e-3);
      } else if (aPart > 1.5 && aPart < 2.5) {                           // pennant: streams aft and lifts toward the moon
        q.z += sin(uv.x * 5. - uTime * 9. + sd) * .3 * uv.x; q.y += uv.x * (.5 + .15 * sin(uTime * 4. + sd));
      } else if (aPart > 2.5) { q.y += sin(uTime * 3. + q.x * 2. + sd) * .04; }
      vec3 base = vec3(xz.x, surfY(xz) + .1 + .07 * sin(uTime * 1.3 + sd), xz.y);
      vec3 lp = base + (fwd * q.x + up * q.y + right * q.z) * aJ.x * vis;
      vN = fwd * nn.x + up * nn.y + right * nn.z; vCol = color; vPu = vec3(aPart, uv);
      ${E} }`,`
    varying vec3 vN; varying vec3 vCol; varying vec3 vPu;
    void main(){
      vec3 V = normalize(vCam - vLp), n = normalize(vN);
      if (dot(n, V) < 0.) n = -n;
      vec3 alb = vCol;
      if (vPu.x > .5 && vPu.x < 1.5) {
        alb = mix(alb, cWhite * .7, uSailW * (1. - step(2., vPu.z * 6.) * step(vPu.z * 6., 3.)));
        float bt = abs(fract(vPu.z * 6. + .5) - .5); alb *= mix(.5, 1., smoothstep(.015, .045, bt));            // battens
        float seam = abs(fract(vPu.y * 6. + .5) - .5); alb *= mix(.8, 1., smoothstep(.008, .03, seam));         // cloth seams
        float rp = smoothstep(.014, .004, abs(vPu.z - .27)) * step(.55, fract(vPu.y * 16.)); alb *= 1. - .5 * rp;   // reef points
        alb *= .9 + .2 * vn(vPu.yz * vec2(26., 44.));
      }
      vec3 col = lit(alb, n, vLp);
      if (vPu.x > .5) col += alb * SUNC * .55 * max(dot(-n, uSun), 0.) * moonShade(vLp);                       // cloth lit through
      col = underwater(col, vLp, V);
      gl_FragColor = vec4(fogMix(col), 1.);
    }`,{side:a.DoubleSide},{uB0:o.SH.uB0}),g=new a.Mesh(n,f);g.frustumCulled=!1;const v=14,l=[],m=[];for(let S=0;S<=v;S++)if(l.push(-1,S/v,0,1,S/v,0),S<v){const B=S*2;m.push(B,B+1,B+2,B+1,B+3,B+2)}const b=new a.InstancedBufferGeometry;b.setAttribute("position",new a.Float32BufferAttribute(l,3)),b.setIndex(m),b.setAttribute("aI",i),b.setAttribute("aJ",s),b.instanceCount=p;const w=o.mk(oe+`
    varying vec2 vUv; varying float vA;
    void main(){
      float k = position.y, tk = uTime - 1.5 - k * 17.;
      vec2 vel; float vis; vec2 xz = boatAt(tk, vel, vis);
      float w0 = floor((aI.y - 300. - aI.z * uTime) / 700.), w1 = floor((aI.y - 300. - aI.z * tk) / 700.);
      vA = vis * step(abs(w0 - w1), .5);
      if (aJ.w > 1.5 && uB0.x > 0.) vA = 1.;
      vec2 sd = normalize(vec2(vel.y, -vel.x));
      xz += sd * position.x * (.7 + 4.4 * sqrt(k)) * aJ.x;
      vec3 lp = vec3(xz.x, surfY(xz) + .16, xz.y);
      vUv = vec2(position.x, k);
      ${E} }`,`
    varying vec2 vUv; varying float vA;
    void main(){
      float u = abs(vUv.x), k = vUv.y;
      float nz = vn(vec2(vUv.x * 3., k * 46. + uTime * .4)) * .6 + vn(vec2(vUv.x * 9., k * 140.)) * .4;
      float edge = smoothstep(.5, .86, u) * smoothstep(1., .9, u);
      float lace = smoothstep(.36, .7, nz);                             // foam, not a pale sheet
      float a = (1. - k) * (1. - k) * (edge * (.25 + .5 * lace) + (1. - u) * smoothstep(.3, 0., k) * lace * .9 + .14 * lace) * smoothstep(0., .03, k) * vA;
      vec3 col = cWhite * .74 * (.5 + .5 * moonShade(vLp)) + cSlate * .06;
      gl_FragColor = vec4(fogMix(col), clamp(a, 0., 1.));
    }`,{transparent:!0,depthWrite:!1,side:a.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-6},{uB0:o.SH.uB0}),y=new a.Mesh(b,w);y.frustumCulled=!1,y.renderOrder=3;const r=10,q=[],C=[];for(let S=0;S<=r;S++)if(q.push(-1,S/r,0,1,S/r,0),S<r){const B=S*2;C.push(B,B+1,B+2,B+1,B+3,B+2)}const F=new a.InstancedBufferGeometry;F.setAttribute("position",new a.Float32BufferAttribute(q,3)),F.setIndex(C),F.setAttribute("aI",i),F.setAttribute("aJ",s),F.instanceCount=p;const R=o.mk(oe+`
    varying vec2 vUv; varying float vA;
    void main(){
      vec2 vel; float vis; vec2 xz = boatAt(uTime, vel, vis);
      float hl = max(length(uSun.xz), 1e-3), k = position.y;
      vec2 sh = -uSun.xz / hl, ac = vec2(sh.y, -sh.x);
      float L = 12.5 * aJ.x * clamp(hl / max(uSun.y, .1), .7, 5.);
      float wS = 2.4 + 5. * abs(dot(gHd, ac));                          // the sail's breadth as the sun sees it
      xz += sh * (k * L - .8) + ac * position.x * wS * .5 * (1. - .5 * k);
      vec3 lp = vec3(xz.x, surfY(xz) + .13, xz.y);
      vUv = vec2(position.x, k); vA = vis;
      ${E} }`,`
    varying vec2 vUv; varying float vA;
    void main(){
      float u = vUv.x, k = vUv.y;
      float a = (1. - u * u) * (1. - u * u) * smoothstep(0., .06, k) * (1. - k * k) * .78 * vA * moonShade(vLp);
      gl_FragColor = vec4(fogMix(cDeep * .13), a);
    }`,{transparent:!0,depthWrite:!1,side:a.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-5},{uB0:o.SH.uB0}),V=new a.Mesh(F,R);return V.frustumCulled=!1,V.renderOrder=3,[g,V,y]}function Me(o){const e=o.rng.fork("fish"),t=Math.round(330*o.detail),p=8,c=t*p,d=new a.InstancedBufferGeometry;d.setAttribute("position",new a.Float32BufferAttribute([.5,0,0,.08,.15,0,-.32,0,0,.5,0,0,-.32,0,0,.08,-.13,0,-.28,0,0,-.52,.16,0,-.44,0,0,-.28,0,0,-.44,0,0,-.52,-.16,0],3));const i=new Float32Array(c*4),s=new Float32Array(c*4),n=[];for(let v=0;v<p;v++){const l=v<2,m=l?0:v<5?e.range(.1,.9)*(v%2?1:-1):e.range(-2.6,2.6),b=l?520:e.range(270,880),w=l?7.5:e.range(5.5,11),y=l?10:e.range(8,20),r=l?v?-1:1:e.sign();n.push({th:m,r:b,dep:y,rad:w});for(let q=0;q<t;q++){const C=(v*t+q)*4,F=Math.pow(e(),.45);i[C]=m,i[C+1]=b,i[C+2]=y,i[C+3]=w,s[C]=e()*6.283,s[C+1]=Math.asin(e.range(-1,1)),s[C+2]=F,s[C+3]=r*e.range(.55,.85)/(.35+F)}}d.setAttribute("aSh",new a.InstancedBufferAttribute(i,4)),d.setAttribute("aFo",new a.InstancedBufferAttribute(s,4)),d.instanceCount=c;const f=o.mk(`
    attribute vec4 aSh; attribute vec4 aFo; varying vec3 vN; varying float vY; uniform float uBall;
    void main(){
      float t = uTime, sr = aSh.y;
      if (abs(aSh.y - 520.) < .01 && uBall > 0.) sr = uBall;            // the world keys the shoal under the path to the flight
      vec2 cxz = vec2(sin(aSh.x), cos(aSh.x)) * sr + vec2(sin(t * .11 + aSh.x * 9.), cos(t * .09 + aSh.x * 5.)) * 6.;
      vec3 C = vec3(cxz.x, surfY(cxz) - aSh.z, cxz.y);
      float ang = aFo.x + t * aFo.w * .5, cr = aSh.w * aFo.z, ct = cos(aFo.y);
      vec3 off = vec3(cos(ang) * ct, sin(aFo.y) * .75 + .1 * sin(ang * 2. + aFo.x), sin(ang) * ct) * cr;
      vec3 fw = normalize(vec3(-sin(ang), .12 * cos(ang * 2. + aFo.x), cos(ang))) * sign(aFo.w);
      vec3 rt = normalize(cross(fw, vec3(0., 1., 0.))), up = cross(rt, fw);
      float len = 1.25 * (.8 + .5 * fract(aFo.x * 3.7));
      vec3 q = position * len;
      float wv = sin(t * 9. + aFo.x * 20. - position.x * 7.) * .11 * (.55 - position.x) * len;
      vec3 lp = C + off + fw * q.x + up * q.y + rt * wv;
      vN = normalize(rt + fw * cos(t * 9. + aFo.x * 20. - position.x * 7.) * .3); vY = position.y;
      ${E} }`,`
    varying vec3 vN; varying float vY;
    void main(){
      vec3 V = normalize(vCam - vLp), n = normalize(vN); if (dot(n, V) < 0.) n = -n;
      vec3 base = mix(cIvory * .78, cSlate * .34, smoothstep(-.06, .08, vY));
      float fl = abs(dot(n, normalize(uSun + V + vec3(0., 1e-3, 0.)))); fl *= fl; fl *= fl; fl *= fl;
      vec3 col = base * (.8 + .6 * max(dot(n, uSun), 0.)) + cWhite * 1.5 * fl * moonShade(vLp);
      vec3 pu = vec3(vLp.x, mix(vLp.y, surfY(vLp.xz), .5), vLp.z);        // silver carries: fog them as if at half their depth
      gl_FragColor = vec4(fogMix(underwater(col, pu, V)), 1.);
    }`,{side:a.DoubleSide},{uBall:o.SH.uBall}),g=new a.Mesh(d,f);return g.frustumCulled=!1,{mesh:g,list:n}}function Ae(o){const e=o.rng.fork("rays"),t=[],p=[],c=8,d=3;for(let m=0;m<=c;m++){const b=-1+2*m/c,w=Math.abs(b),y=2.1*Math.pow(1-w,.75)+.06;for(let r=0;r<=d;r++){const q=r/d;t.push(y*(.58-q*1.05)-w*.75,.3*(1-w*w)*Math.sin(Math.PI*Math.min(1,q*1.2)),b*3)}}for(let m=0;m<c;m++)for(let b=0;b<d;b++){const w=m*(d+1)+b,y=w+d+1;p.push(w,y,w+1,y,y+1,w+1)}const i=t.length/3;t.push(-.9,.05,.09,-.9,.05,-.09,-3.4,0,.04,-3.4,0,-.04,-6.2,0,0),p.push(i,i+1,i+2,i+1,i+3,i+2,i+2,i+3,i+4);const s=new a.InstancedBufferGeometry;s.setAttribute("position",new a.Float32BufferAttribute(t,3)),s.setIndex(p);const n=5,f=new Float32Array(n*4),g=new Float32Array(n*4);for(let m=0;m<n;m++)f[m*4]=m===0?0:e.range(.12,.8)*(m%2?1:-1),f[m*4+1]=m===0?470:e.range(340,900),f[m*4+2]=e.range(3.2,4.2),f[m*4+3]=e()*6.28,g[m*4]=m===0?1.7:e.range(1.2,1.5),g[m*4+1]=m===0?2:e.range(6,14),g[m*4+2]=m===0?2.5:0,g[m*4+3]=m===0?3.2:e.range(5,10);s.setAttribute("aI",new a.InstancedBufferAttribute(f,4)),s.setAttribute("aJ",new a.InstancedBufferAttribute(g,4)),s.instanceCount=n;const v=o.mk(`
    attribute vec4 aI; attribute vec4 aJ; varying vec3 vN; varying vec3 vQ; uniform float uRay0;
    void main(){
      float t = uTime, rr = 320. + mod(aI.y - 320. - aI.z * t, 620.);
      if (aJ.z > 1. && uRay0 > 0.) rr = uRay0;                          // the world keys the lane ray to the flight
      float vis = ((aJ.z > 1. && uRay0 > 0.) ? smoothstep(110., 140., rr) : smoothstep(320., 350., rr)) * smoothstep(940., 910., rr), ph = .05 * t + aI.w;
      float xl = aJ.z + aJ.y * sin(ph), zl = sqrt(max(rr * rr - xl * xl, 1.));
      vec2 vl = vec2(aJ.y * .05 * cos(ph), -aI.z); float c = cos(aI.x), s = sin(aI.x);
      vec2 vel = vec2(c * vl.x + s * vl.y, -s * vl.x + c * vl.y), xz = vec2(c * xl + s * zl, -s * xl + c * zl);
      vec3 N = tideN(xz), f0 = normalize(vec3(vel.x, 0., vel.y));
      vec3 fwd = normalize(f0 - N * dot(f0, N)), right = cross(fwd, N);
      vec3 q = position; float az = abs(q.z) / 3.;
      float fp = t * 1.5 + aI.w * 3. - az * 1.6;
      float lift = sin(fp) * 1.0 * az * sqrt(az);
      q.y += lift + sin(t * 2. + q.x * .9) * .12 * smoothstep(-1., -6., q.x);
      vec3 base = vec3(xz.x, surfY(xz) - aJ.w, xz.y);
      vec3 lp = base + (fwd * q.x + N * q.y + right * q.z) * aJ.x * vis;
      vec3 nl = normalize(vec3(.12, 1., -sign(position.z) * cos(fp) * .5 * az));
      vN = fwd * nl.x + N * nl.y + right * nl.z; vQ = position;
      ${E} }`,`
    varying vec3 vN; varying vec3 vQ;
    void main(){
      vec3 V = normalize(vCam - vLp), n = normalize(vN);
      float top = step(0., dot(n, V)); if (top < .5) n = -n;
      float spots = smoothstep(.55, .7, vn(vQ.xz * 2.3 + 4.));
      vec3 alb = mix(cWhite * .8, cIvory * .95 * (1. - .3 * spots) + cWhite * .1, top);
      alb *= .7 + .3 * smoothstep(.0, .5, abs(vQ.z) / 3. + .25 * sin(vQ.x * 3.));          // darker spine, pale wing tips
      alb *= .8 + .2 * smoothstep(3., 1.5, abs(vQ.z));
      vec3 pu = vec3(vLp.x, mix(vLp.y, surfY(vLp.xz), .55), vLp.z);
      gl_FragColor = vec4(fogMix(underwater(lit(alb, n, vLp) * 1.25, pu, V)), 1.);
    }`,{side:a.DoubleSide},{uRay0:o.SH.uRay0}),l=new a.Mesh(s,v);return l.frustumCulled=!1,l}function qe(o){const e=o.rng.fork("kelp"),t=Math.round(380*o.detail),p=8,c=[],d=[];for(let v=0;v<=p;v++)if(c.push(-.5,v/p,0,.5,v/p,0),v<p){const l=v*2;d.push(l,l+1,l+2,l+1,l+3,l+2)}const i=new a.InstancedBufferGeometry;i.setAttribute("position",new a.Float32BufferAttribute(c,3)),i.setIndex(d);const s=new Float32Array(t*4);let n=0;for(;n<t;){const v=e.chance(.36),l=v?e.range(.012,.075)*e.sign():e.chance(.7)?e.range(-1.3,1.3):e.range(0,6.283),m=e.range(v?640:730,1140),b=e.int(6,16),w=Math.sin(l)*m,y=Math.cos(l)*m;for(let r=0;r<b&&n<t;r++,n++)s[n*4]=w+e.gauss()*7,s[n*4+1]=y+e.gauss()*7,s[n*4+2]=e.range(14,24),s[n*4+3]=e()*50}i.setAttribute("aK",new a.InstancedBufferAttribute(s,4)),i.instanceCount=t;const f=o.mk(`
    attribute vec4 aK; varying vec2 vUv;
    void main(){
      vec2 xz = aK.xy; float v = position.y, r = length(xz);
      float H = min(aK.z, tideH(xz) - BEDY - 1.5); H = max(H, 0.);
      vec3 uph = vec3(-xz.x, 0., -xz.y) / max(r, 1.);
      vec3 sidev = vec3(uph.z, 0., -uph.x);
      vec3 p = vec3(xz.x, BEDY + v * H, xz.y) + uph * (v * v * H * .32 + sin(uTime * .6 + aK.w * 2. + v * 2.) * .7 * v)
             + sidev * sin(uTime * .8 + aK.w + v * 3.) * .8 * v;
      vec3 cl = camLocal(), ax = normalize(vec3(0., 1., 0.) + uph * .5 * v);
      vec3 sd = cross(ax, cl - p); sd /= max(length(sd), 1e-3);
      float wdt = (.9 + 1.5 * abs(sin(v * 11. + aK.w))) * (1. - .55 * v) * (.25 + .75 * smoothstep(0., .12, v)) * step(1., H) * max(1., length(cl - p) / 240.);   // stays a ribbon, not a hair, across the hill
      vec3 lp = p + sd * position.x * wdt;
      vUv = vec2(position.x, v);
      ${E} }`,`
    varying vec2 vUv;
    void main(){
      vec3 V = normalize(vCam - vLp);
      vec3 alb = mix(vec3(.012, .05, .022), vec3(.05, .1, .02), vUv.y);        // dark standing ribbons, never a pale overlay
      alb *= .55 + .45 * smoothstep(.06, .0, abs(vUv.x)) + .5 * smoothstep(.2, .5, abs(vUv.x));   // a midrib and bright frilled edges
      vec3 col = alb * (SUNC * (.5 + .5 * moonShade(vLp)) + cAqua * .35);
      vec3 pu = vec3(vLp.x, mix(vLp.y, surfY(vLp.xz), .6), vLp.z);
      gl_FragColor = vec4(fogMix(underwater(col, pu, V)), 1.);
    }`,{side:a.DoubleSide}),g=new a.Mesh(i,f);return g.frustumCulled=!1,g}async function Te(o,e={}){const t=o.rng,c=(e.palette&&e.palette.length>=7?e.palette:ie).slice(0,7).map(x=>new a.Color(x)),d=Math.min(1,Math.max(.6,e.detail??o.quality?.detail??1)),i=new a.Group;i.name="standing-tide-hero";const s={uTime:{value:0},uSun:{value:new a.Vector3},uQuiv:{value:new a.Vector3(0,0,50)},SUNC:{value:new a.Vector3(1,.95,.86)},uSailW:{value:0},uWind:{value:0},uRay0:{value:-1},uBall:{value:-1},uB0:{value:new a.Vector3(-1,12,0)},cIvory:{value:c[0]},cSlate:{value:c[1]},cTurq:{value:c[2]},cDeep:{value:c[3]},cAqua:{value:c[4]},cWhite:{value:c[5]},cOrange:{value:c[6]},uRot:{value:new a.Matrix3},uHit:{value:Array.from({length:9},()=>new a.Vector4(0,0,1,0))},uShDir:{value:new a.Vector3},uShA:{value:new a.Vector3},uShB:{value:new a.Vector3}},n=["uTime","uSun","uQuiv","SUNC","uSailW","uWind","cIvory","cSlate","cTurq","cDeep","cAqua","cWhite","cOrange"],f=(x,z,A={},L={})=>{const T=a.UniformsUtils.clone(a.UniformsLib.fog);for(const P of n)T[P]=s[P];return Object.assign(T,L),new a.ShaderMaterial({uniforms:T,vertexShader:ee+ve+x,fragmentShader:ee+he+z,fog:!0,...A})},g=x=>{const z=s.uSun.value.copy(x).normalize(),A=Math.hypot(z.x,z.z),L=.75,T=s.uShDir.value.set(-z.x*L,-Math.sqrt(Math.max(.05,1-L*L*A*A)),-z.z*L).normalize(),P=s.uShA.value.set(-T.z,0,T.x);P.lengthSq()<1e-6&&P.set(1,0,0),P.normalize(),s.uShB.value.crossVectors(T,P).normalize()};g(e.sun?new a.Vector3().copy(e.sun):new a.Vector3(-.776,.616,-.137));const v={mk:f,SH:s,rng:t,detail:d,P:c,noise:o.noise,yield:()=>o.yield?.(),boats:Math.max(24,Math.min(48,Math.round(e.boats??40)))},l=x=>(i.add(x),x);e.bed!==!1&&l(me(v)),l(pe(v)),await o.yield?.();const m=xe(t.fork("craters"));await o.yield?.(),l(await ge(v,m)),await o.yield?.();const b=ye(v,m);l(b.mesh),await o.yield?.(),l(we(v)),await o.yield?.();for(const x of be(v))l(x);await o.yield?.(),l(ze(v)),await o.yield?.();const w=Se(c,t.fork("boat"));await o.yield?.();for(const x of ke(v,w))l(x);await o.yield?.();const y=Me(v);l(y.mesh),await o.yield?.(),l(Ae(v)),await o.yield?.(),e.kelp!==!1&&l(qe(v)),await o.yield?.(),l(de(v)),await o.yield?.();const r=(x,z,A)=>new a.Vector3(x,z,A),q=Math.PI/180,C=r(0,320,0),F=Math.cos(20*q),R=Math.sin(20*q),V=[r(0,4.5,1900),r(0,4.5,1650),r(0,4.5,1470)];for(let x=1380;x>430;x-=68)V.push(r(0,Math.max(4.5,G(x)+5.5),x));const S=r(0,G(430)+5.5,430),B=r(0,C.y-60*R,60*F);for(let x=0;x<8;x++){const z=x/8,A=S.z+(B.z-S.z)*z;V.push(r(0,Math.max(S.y+(B.y-S.y)*z,G(A)+6.5),A))}V.push(B,C.clone());const M=new a.Quaternion,D=r(1,0,0),U=r(0,0,0),H=b.specs.map(x=>({top:x.mid.clone().add(r(0,j,0)),foot:r(x.mid.x,G(Math.hypot(x.mid.x,x.mid.z)),x.mid.z),width:x.arc})),Y={portalSeat:{position:C,facing:r(0,-R,F),tiltDeg:20,radius:7},flyThrough:V,viewpoints:{entry:{position:r(0,4.5,1830),lookAt:r(0,150,0)},slope:{position:r(0,G(560)+5.5,560),lookAt:r(40,230,150)},summit:{position:r(0,262,150),lookAt:r(0,318,0)},outside:{position:r(-900,120,1300),lookAt:r(0,220,0)}},tip:r(0,300,0),ropeTop:r(0,307,0),lowestCrater:{lake:r(0,j-O+7.5,0),rimRadius:80,rimY:j-O-6.5},veils:H.slice(0,2),portSheet:H[2],sheets:H,shoalBall:r(0,G(520)-10,520),shoals:y.list.map(x=>r(Math.sin(x.th)*x.r,G(x.r)-x.dep,Math.cos(x.th)*x.r)),moonCentre:r(0,j,0),moonRadius:O,waterEdgeRadius:X,bedY:se,coreRadius:750,sun:s.uSun.value};let I=e.progress??null,h=0;const u={object:i,radius:450,height:300,center:r(0,170,0),extent:X,top:400,anchors:Y,ground:!1,groundY:se,uniforms:s,glsl:ee,tideHeight:G,moonHeight:le,boatGeometry:w,craters:m,setProgress(x){I=x==null?null:Math.min(1,Math.max(0,x))},setSun:g,get roll(){return h},update(x,z){const A=z||0;s.uTime.value=A;const L=Math.PI*2*.4;s.uQuiv.value.set(1.5*Math.sin(L*A),1.5*Math.cos(L*.83*A+1.1),50+1.3*Math.sin(L*1.31*A)),h=I==null?.045+.045*Math.sin(A*.05):.12*(1-I);const T=Math.cos(h),P=Math.sin(h);s.uRot.value.set(1,0,0,0,T,-P,0,P,T),M.setFromAxisAngle(D,h);const N=s.uHit.value;for(let _=0;_<9;_++){const $=b.specs[_];if(!$){N[_].set(0,0,1,0);continue}U.copy($.mid).applyQuaternion(M),N[_].set(U.x,U.z,$.arc*.5,1)}},dispose(){w.dispose()}},k=e.view||null;if(k==="peak"&&(u.radius=34,u.height=50,u.center=r(0,316,0)),k==="belly"&&(u.radius=110,u.height=150,u.center=r(0,330,0)),k==="shoal"&&(u.radius=7,u.height=34,u.center=r(0,G(520)+1,520)),k==="foot"&&(u.radius=40,u.height=50,u.center=r(0,3,1395)),k==="slope"&&(u.radius=60,u.height=150,u.center=r(0,G(600),600)),k==="boat"){const x=i.children.find(Q=>Q.geometry?.attributes?.aPart).geometry.attributes,z=x.aI.array,A=x.aJ.array,L=12;let T=0,P=1e9;const N=Q=>300+((z[Q*4+1]-300-z[Q*4+2]*L)%700+700)%700;for(let Q=0;Q<7;Q++){const ae=Math.abs(N(Q)-600);ae<P&&(P=ae,T=Q)}const _=N(T),$=.045+.03*(A[T*4+3]*7.31%1),W=A[T*4+2]+A[T*4+1]*Math.sin($*L+z[T*4+3]),J=Math.sqrt(Math.max(_*_-W*W,1));u.radius=6,u.height=22,u.center=r(W,G(_)+4,J)}return u.update(0,0,null),u}export{ee as TIDE_GLSL,Te as buildHero,le as moonHeight,G as tideHeight,ue as vertexNormalsInSlices};
