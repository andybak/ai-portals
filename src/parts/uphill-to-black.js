import*as e from"three";import{mergeGeometries as Z}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as L,lerp as W,smoothstep as j}from"../kit/core.js";const E=Math.PI*2,Ce=["#1F7FD6","#2FC4B8","#F3F1EA","#E9DDB8","#0F3D30","#03040A","#FF9A2E"],h=1.85,be=47,H=57,re=70,Te=[0,55.9,2.45];function N(t,s,a={}){const l=a.phi0??0,n=a.phiLen??E,v=!!a.flip,r=t.length,o=new Float32Array(r),c=new Float32Array(r),m=(u,x)=>{const F=t[x][0]-t[u][0],k=t[x][1]-t[u][1],_=Math.hypot(F,k);return _>1e-6?[k/_,-F/_]:null};for(let u=0;u<r;u++){const x=u>0?m(u-1,u):null,F=u<r-1?m(u,u+1):null;let k=(x?x[0]:0)+(F?F[0]:0),_=(x?x[1]:0)+(F?F[1]:0);const p=Math.hypot(k,_)||1;o[u]=k/p,c[u]=_/p}const i=s+1,b=[],f=[],y=[],w=[],C=[];for(let u=0;u<r;u++){const x=t[u],F=x[2];for(let k=0;k<i;k++){const _=l+k/s*n,p=Math.sin(_),z=Math.cos(_),R=v?-1:1;b.push(x[0]*p,x[1],x[0]*z),f.push(o[u]*p*R,c[u]*R,o[u]*z*R),y.push(F[0],F[1],F[2]),w.push(x[3]||0,x[4]||0,x[5]||0)}}for(let u=0;u<r-1;u++)if(!(Math.hypot(t[u+1][0]-t[u][0],t[u+1][1]-t[u][1])<1e-6))for(let x=0;x<s;x++){const F=u*i+x,k=F+1,_=F+i,p=_+1;v?C.push(F,_,k,k,_,p):C.push(F,k,_,k,p,_)}const G=new e.BufferGeometry;G.setAttribute("position",new e.Float32BufferAttribute(b,3)),G.setAttribute("normal",new e.Float32BufferAttribute(f,3)),G.setAttribute("color",new e.Float32BufferAttribute(y,3)),G.setAttribute("aSurf",new e.Float32BufferAttribute(w,3)),G.setIndex(C);const M=G.toNonIndexed();return G.dispose(),a.flat&&M.computeVertexNormals(),M}function Y(t,s,a,l=0,n=0,v=0){let r=t.index?t.toNonIndexed():t;r!==t&&t.dispose(),r.attributes.uv&&r.deleteAttribute("uv"),a&&r.applyMatrix4(a);const o=r.attributes.position.count,c=new Float32Array(o*3),m=new Float32Array(o*3);for(let i=0;i<o;i++)c[i*3]=s[0],c[i*3+1]=s[1],c[i*3+2]=s[2],m[i*3]=l,m[i*3+1]=n,m[i*3+2]=v;return r.setAttribute("color",new e.BufferAttribute(c,3)),r.setAttribute("aSurf",new e.BufferAttribute(m,3)),r}function P(t,s,a,l,n,v,r=0,o=0,c=0){const m=Math.SQRT2,i=Math.min(.45,l/(Math.min(t,a)*.5))*m,b=[0,0,0],f=N([[0,-s/2,b],[m-i,-s/2,b],[m,-s/2+l,b],[m,s/2-l,b],[m-i,s/2,b],[0,s/2,b]],4,{phi0:Math.PI/4,flat:!0});return f.applyMatrix4(new e.Matrix4().makeScale(t/2,1,a/2)),f.computeVertexNormals(),Y(f,n,v,r,o,c)}const te=()=>new e.Matrix4,Ge=new e.Euler,ze=new e.Quaternion,Ve=new e.Vector3(1,1,1),ke=new e.Vector3;function d(t,s,a,l=0,n=0,v=0,r=1,o=r,c=r){return te().compose(ke.set(t,s,a),ze.setFromEuler(Ge.set(l,n,v,"YXZ")),Ve.set(r,o,c))}const T=(t,s)=>te().makeRotationY(t).multiply(s),ue=(t,s=1)=>{const a=new e.Color(t);return[a.r*s,a.g*s,a.b*s]},A=(t,s)=>[t[0]*s,t[1]*s,t[2]*s],oe=(t,s,a)=>[W(t[0],s[0],a),W(t[1],s[1],a),W(t[2],s[2],a)],ae=`
float h31(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fb3(vec3 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++) { s += a * vn3(p); p = p * 2.03 + 7.1; a *= .5; } return s * 1.07; }
`,Be=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fogF = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    float fogF = smoothstep(fogNear, fogFar, vFogDepth);
  #endif
  gl_FragColor.rgb *= 1. - clamp(fogF, 0., 1.);
#endif
`;function ce(t,s={}){const a=new e.MeshStandardMaterial({vertexColors:!0,roughness:s.roughness??.36,metalness:0,side:s.side??e.FrontSide}),l={uGlow:{value:0},uGlowCol:{value:new e.Color().setRGB(...s.glowCol||[6,5,3.2])},uRoll:{value:new e.Vector2(...s.roll||[-10,-9])},uFair:{value:s.fair?1:0},uAccent:{value:new e.Color().setRGB(...s.accent||[.1,.4,.5])}};return a.userData.u=l,a.onBeforeCompile=n=>{Object.assign(n.uniforms,l,{uFrost:t.uFrost,uTime:t.uTime,uFrostCol:t.uFrostCol,uSeed:t.uSeed,uDownV:t.uDownV,uSunVw:t.uSunVw}),n.vertexShader=n.vertexShader.replace("#include <common>",`attribute vec3 aSurf;
varying vec3 vObj;
varying vec3 vSurf;
#include <common>`).replace("#include <begin_vertex>",`#include <begin_vertex>
vObj = position; vSurf = aSurf;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`uniform float uFrost, uGlow, uTime, uSeed, uFair; uniform vec3 uGlowCol, uFrostCol, uAccent; uniform vec2 uRoll; uniform vec4 uDownV, uSunVw;
varying vec3 vObj; varying vec3 vSurf;
${ae}
#include <common>`).replace("#include <color_fragment>",`#include <color_fragment>
float hFrost = 0., seamAll = 0.;
{
  float rr = length(vObj.xz);
  float ang = atan(vObj.x, vObj.z + step(rr, 1e-4) * 1e-3);
  float aaY = fwidth(vObj.y);
  if (vSurf.z > 0.5) {
    float py = vObj.y / 1.9, row = floor(py), fy = fract(py);
    float dR = min(fy, 1. - fy) * 1.9;
    float ring = (1. - smoothstep(0.007, 0.009 + aaY * 1.2, dR)) * clamp(0.03 / (0.03 + aaY), 0., 1.);
    float pa = ang / 6.2832 * 8. + mod(row, 2.) * .5, fa = fract(pa);
    float cell = 0.7854 * max(rr, 0.01);
    float aaA = min(fwidth(pa), 0.2) * cell;
    float vert = (1. - smoothstep(0.005, 0.007 + aaA * 1.2, min(fa, 1. - fa) * cell)) * clamp(0.03 / (0.03 + aaA), 0., 1.);
    float arc = ang * rr;
    float rd = length(vec2(abs(dR - 0.06), (abs(fract(arc / 0.11) - .5)) * 0.11));
    float riv = (1. - smoothstep(0.011, 0.016, rd)) * (1. - smoothstep(0.008, 0.035, aaY));
    float dV = min(fa, 1. - fa) * cell;
    float rd2 = length(vec2(abs(dV - 0.06), (abs(fract(vObj.y / 0.11) - .5)) * 0.11));
    riv = max(riv, (1. - smoothstep(0.011, 0.016, rd2)) * (1. - smoothstep(0.008, 0.035, aaY)));
    float ps = ang / 6.2832 * 64., fs = fract(ps), aaS = min(fwidth(ps), 0.5);
    float str = (1. - smoothstep(0.02, 0.035 + aaS, min(fs, 1. - fs))) * clamp(0.1 / (0.1 + aaS), 0., 1.);
    float hid = h31(vec3(row, floor(pa), 11. + uSeed)), sten = 0.;
    if (hid > 0.45) {
      vec2 sq = (vec2(fa, fy) - vec2(0.2 + 0.3 * fract(hid * 7.), 0.25 + 0.4 * fract(hid * 13.))) * vec2(cell, 1.9) / vec2(0.46, 0.17);
      if (sq.x > 0. && sq.x < 1. && sq.y > 0. && sq.y < 1.)
        sten = step(0.3, fract(sq.y * 3.)) * step(0.34, h31(vec3(floor(sq.x * 16.), floor(sq.y * 3.), floor(hid * 50.)))) * (1. - smoothstep(0.002, 0.012, aaY));
    }
    float tint = (h31(vec3(row, floor(pa), 3. + uSeed)) - .5) * 0.08;
    float streak = vn3(vec3(vObj.x * 7., vObj.y * 0.16 + uSeed, vObj.z * 7.));
    float seamv = max(ring, vert);
    seamAll = seamv;
    float lum = dot(diffuseColor.rgb, vec3(.3333));
    if (lum < 0.08) {
      diffuseColor.rgb += 0.045 * seamv + 0.03 * riv + 0.012 * str + 0.02 * (streak - .5);
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.42), sten * 0.8);
    } else {
      diffuseColor.rgb *= (1. + tint) * (0.9 + 0.12 * streak);
      diffuseColor.rgb *= 1. - 0.55 * seamv - 0.45 * riv - 0.07 * str;
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.07), sten * 0.8);
    }
    if (vObj.y > uRoll.x && vObj.y < uRoll.y) {
      float q = step(0., sin(ang * 2. + 0.6));
      float hlf = step((uRoll.x + uRoll.y) * .5, vObj.y);
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.025) + 0.03 * seamv, abs(q - hlf) * 0.97);
    }
  }
  // THE FAIRING'S OWN SURFACE (what fills the lens through the pan): a dark separation band with bolt heads at the base,
  // ring seams with double rivet rows, a band of chevrons and an accent line round the flare, the split rail up each seam
  // with its latches, sixteen gores, quartered roll marks under the nose. Paint only: no lettering.
  if (uFair > .5 && vSurf.z > .9 && vObj.y > 57.01) {
    float y = vObj.y, arc = ang * rr, eY = aaY + 1e-5, eA = fwidth(arc) + 1e-5;
    float fine = 1. - smoothstep(.006, .03, eY);
    vec3 dk = vec3(.035, .037, .042), base = diffuseColor.rgb;
    // gores: every 1/16 turn, a seam and a rivet row either side
    float gq = abs(fract(ang / 6.2832 * 16. + .5) - .5) * .3927 * rr;
    float gs = (1. - smoothstep(.006, .006 + eA * 1.2, gq)) * clamp(.03 / (.03 + eA), 0., 1.);
    float gr = (1. - smoothstep(.011, .017, length(vec2(gq - .055, (abs(fract(y / .09) - .5)) * .09)))) * fine;
    // ring seams of the flare and the barrel
    float dq = min(min(abs(y - 57.62), abs(y - 58.42)), min(abs(y - 59.12), abs(y - 59.75)));
    float rs = (1. - smoothstep(.007, .007 + eY * 1.2, dq)) * clamp(.03 / (.03 + eY), 0., 1.);
    float rv = (1. - smoothstep(.011, .017, length(vec2(abs(dq - .05), (abs(fract(arc / .09) - .5)) * .09)))) * fine;
    float gp = h31(vec3(floor(ang / 6.2832 * 16. + .5), floor((y - 57.) / .8), 5. + uSeed));
    base *= (.93 + .12 * gp) * (1. - .5 * max(gs, rs) - .42 * max(gr, rv));
    // chevrons round the flare, between two pinstripes
    float cv = (y - 57.74) / .56;
    if (cv > 0. && cv < 1.) {
      float cx = arc / .62 + abs(cv - .5) * .95, tri = abs(fract(cx) - .5) * 2., ce = fwidth(cx) * 2. + 1e-4;
      base = mix(base, dk + .03 * gp, smoothstep(.5 - ce, .5 + ce, tri) * .95 * clamp(.5 / (.5 + ce), 0., 1.));
    }
    float pin = max(1. - smoothstep(.012, .012 + eY, abs(y - 57.7)), 1. - smoothstep(.012, .012 + eY, abs(y - 58.34)));
    base = mix(base, dk, pin * .9);
    base = mix(base, uAccent, (1. - smoothstep(.06, .06 + eY, abs(y - 58.62))) * .95);
    // separation band: dark, with bright bolt heads and index ticks
    float sb = 1. - smoothstep(57.4, 57.4 + eY * 1.5 + .004, y);
    float bolt = (1. - smoothstep(.022, .03, length(vec2(y - 57.24, (abs(fract(arc / .16) - .5)) * .16)))) * fine;
    float tick = step(abs(fract(ang / 6.2832 * 32.) - .5), .06) * step(57.31, y) * step(y, 57.39) * fine;
    base = mix(base, dk * 1.6 + vec3(.5, .5, .52) * bolt + vec3(.45) * tick, sb);
    // the split rail up each seam: a dark strip with latches
    float sq = min(abs(arc), (3.14159 - abs(ang)) * rr);
    float rail = 1. - smoothstep(.075, .075 + eA * 1.5, sq);
    float latch = step(abs(fract(y / .62) - .5), .13) * step(.02, sq) * (1. - smoothstep(.05, .055 + eA, sq));
    base = mix(base, dk * 2.2 + vec3(.36, .37, .4) * latch * fine + vec3(.2) * (1. - smoothstep(.004, .004 + eA, sq)), rail * .96);
    // quartered roll marks under the nose
    if (y > 66.3 && y < 67.7) base = mix(base, dk, abs(step(0., sin(ang * 4. + .4)) - step(67., y)) * .95);
    diffuseColor.rgb = base;
  }
  // the collar of the upper stage under the fairing (the skin ahead of the lens once the view has turned forward): index
  // marks round the stack, an accent line, the dark separation ring with its bolt heads
  if (uFair < .5 && vSurf.z > .9 && vObj.y > 55.97 && vObj.y < 57.001 && rr > 1.8) {
    float y = vObj.y, arc = ang * rr, eY = aaY + 1e-5, eA = fwidth(arc) + 1e-5, fine = 1. - smoothstep(.006, .03, eY);
    vec3 dk = vec3(.035, .037, .042), base = diffuseColor.rgb;
    float tk = abs(fract(ang / 6.2832 * 48. + .5) - .5) * .1309 * rr;
    float y0 = mix(56.34, 56.14, step(abs(fract(ang / 6.2832 * 12. + .5) - .5), .12));
    float mark = (1. - smoothstep(.02, .02 + eA * 1.5, tk)) * smoothstep(y0 - eY, y0 + eY, y) * (1. - smoothstep(56.5 - eY, 56.5 + eY, y)) * clamp(.06 / (.06 + eA), 0., 1.);
    base = mix(base, dk, mark * .92);
    base = mix(base, uAccent, (1. - smoothstep(.035, .035 + eY, abs(y - 56.66))) * .95);
    float sb = smoothstep(56.84 - eY, 56.84 + eY, y);
    float bolt = (1. - smoothstep(.02, .028, length(vec2(y - 56.92, (abs(fract(arc / .16) - .5)) * .16)))) * fine;
    base = mix(base, dk * 1.6 + vec3(.5, .5, .52) * bolt, sb);
    diffuseColor.rgb = base;
  }
  // the side turned from the true sun falls into shade: the terminator slides round the hull as the stack leans and rolls
  diffuseColor.rgb *= 1. - uSunVw.w * .5 * (1. - smoothstep(-.3, .4, dot(normalize(vNormal + vec3(0., 0., 1e-6)), uSunVw.xyz)));
  float cover = uFrost * vSurf.x;
  if (cover > 0.001) {
    float n = fb3(vec3(vObj.x * 1.5, vObj.y * 0.42, vObj.z * 1.5) + uSeed);
    n += 0.1 * (vn3(vObj * vec3(9., 2.5, 9.)) - .5);
    float th = 1.0 - cover * 0.6;
    float am = smoothstep(th, th + 0.05, n);
    float grain = vn3(vObj * 46.), crack = 1. - smoothstep(0., 0.03, abs(vn3(vObj * vec3(5.5, 3., 5.5) + 3. + uSeed) - .5));
    float rimF = am * (1. - am) * 4.;
    vec3 fc = uFrostCol * (0.84 + 0.16 * grain) * (1. - 0.3 * crack) * (1. - 0.35 * rimF) * (1. - 0.22 * seamAll);
    diffuseColor.rgb = mix(diffuseColor.rgb, fc, am * 0.95);
    hFrost = am;
  }
}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.96, hFrost);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += uGlowCol * (vSurf.y * uGlow) * (0.86 + 0.14 * sin(uTime * 37. + vObj.x * 9. + vObj.z * 7.));
{ // above the weather: earthlight, blue, on whatever faces the Earth; the true sun as a hard edge and a glint that slides as the stack turns
  vec3 vdr = normalize(vViewPosition + vec3(0., 0., 1e-6));
  float fres = 1. - clamp(dot(normal, vdr), 0., 1.), ne = clamp(dot(normal, uDownV.xyz), 0., 1.);
  totalEmissiveRadiance += diffuseColor.rgb * vec3(.2, .42, 1.) * (ne * sqrt(ne) * (.5 + .9 * fres)) * uDownV.w;
  float ns = dot(normal, uSunVw.xyz), nh = clamp(dot(normal, normalize(uSunVw.xyz + vdr + vec3(0., 0., 1e-5))), 0., 1.);
  float nh2 = nh * nh, nh8 = nh2 * nh2 * nh2 * nh2, f2 = fres * fres;
  totalEmissiveRadiance += vec3(1., .93, .8) * (f2 * f2 * f2 * smoothstep(-.15, .45, ns) * .5 + nh8 * nh8 * nh8 * step(0., ns) * (.2 + .8 * diffuseColor.g) * .3) * uSunVw.w * (1. - .6 * hFrost);
}`)},a}async function _e(t,s,a,l){const n=[],{tank:v,soot:r,black:o,metal:c}=s,m=[[0,1.95,c],[1.5,1.95,c],[1.99,2.05,c],[2.03,2.3,r,0,0,1],[2.03,3.3,r,0,0,1],[h,4.1,oe(r,v,.3),.2,0,1]];for(let u=5;u<40.9;u+=.9){const x=.3+.7*j(4,11,u),F=u<21?.62:1,k=Math.abs(u-21.2)<.46||Math.abs(u-40.1)<.46?.035:0;m.push([h+k,u,oe(r,v,x),F,0,1])}m.push([h,41,v,1,0,1],[h,41,o,0,0,1],[h+.035,41.06,o,0,0,1],[h+.035,41.3,o,0,0,1],[h,41.36,o,0,0,1]);const i=A(s.white,.9);for(let u=42;u<46.8;u+=.8)m.push([h,u,o,0,0,1]),Math.abs(u-44.4)<.1&&m.push([h,44.6,o,0,0,1],[h,44.6,i,0,0,1],[h,44.72,i,0,0,1],[h,44.72,o,0,0,1],[h,44.82,o,0,0,1],[h,44.82,i,0,0,1],[h,44.86,i,0,0,1],[h,44.86,o,0,0,1]);const b=A(c,.55);m.push([h,46.9,o,0,0,1],[h-.03,47,o],[h-.12,47,c],[h-.12,46.9,b],[h-.12,43,b],[1.2,43.25,b],[0,43.5,b]),n.push(N(m,64)),await l();const f=A(c,.8),y=[.05,.045,.04],w=Z([N([[.47,0,f],[.475,.04,f],[.44,.36,f],[.36,.8,f],[.25,1.25,f],[.17,1.58,f],[.2,1.74,c],[.3,1.8,c],[.3,2,c]],20),N([[0,1.56,y,0,1],[.12,1.58,y,0,1],[.21,1.2,y,0,.8],[.32,.76,y,0,.55],[.4,.34,y,0,.36],[.445,.02,y,0,.24],[.47,0,f,0,.1]],20)]);for(let u=0;u<9;u++){const x=u/8*E+E/16,F=w.clone();F.applyMatrix4(u<8?d(Math.sin(x)*1.36,0,Math.cos(x)*1.36):d(0,-.05,0)),n.push(F)}w.dispose(),await l();for(let u=0;u<4;u++){const x=u*E/4+E/8;n.push(P(.55,.8,.3,.08,c,T(x,d(0,2.75,2.1))));const F=u*E/4;n.push(P(.62,6.4,.3,.14,oe(r,v,.75),T(F,d(0,6.6,h+.08,-.012)),.4)),n.push(P(.66,1.1,.34,.14,o,T(F,d(0,3.6,h+.11,-.012)))),n.push(P(.34,.5,.2,.06,c,T(F,d(0,10,h+.03))))}await l();const C=a.raceway;n.push(P(.32,37,.13,.04,A(v,.94),T(C,d(0,22.5,h+.04)),.45)),n.push(P(.32,5.5,.13,.04,o,T(C,d(0,43.9,h+.04))));for(let u=5;u<46;u+=2.35)n.push(P(.42,.13,.18,.03,u>41?A(c,.5):A(c,2.2),T(C,d(0,u,h+.05))));await l();const G=[.5,.51,.53];n.push(Y(new e.CylinderGeometry(.075,.075,35,10,12),G,T(C+2.6,d(0,22.5,h+.085)),1));for(let u=6;u<40;u+=4.2)n.push(P(.3,.16,.2,.03,A(c,2),T(C+2.6,d(0,u,h+.06))));for(const u of[Math.PI/2,-Math.PI/2]){n.push(P(.7,.62,.3,.1,A(c,.7),T(u,d(0,46.1,h+.1))));for(const x of[-.2,.2])n.push(Y(new e.CylinderGeometry(.05,.1,.16,10,1,!0),A(c,2.4),T(u,d(x,46.1,h+.3,Math.PI/2))))}for(let u=0;u<6;u++)n.push(P(.3,.12,.05,.02,A(c,.6),T(C+.7+u*.9+t.range(-.2,.2),d(0,t.pick([41.9,42.6,45.4]),h+.01))));await l();const M=Z(n);return n.forEach(u=>u.dispose()),M}function Oe(t){const s=t.finW,a=t.finH,l=.17,n=-a/2-.28,v=[.43,.44,.46],r=[];for(const m of[-1,1])r.push(P(.1,a+.1,l,.03,v,d(m*s/2,n,0)));for(const m of[-1,1])r.push(P(s+.1,.1,l,.03,v,d(0,n+m*a/2,0)));const o=A(v,.8);for(const m of[-1,1])for(let i=-(s+a)/2+.17;i<(s+a)/2;i+=.34){const b=Math.max(-(s/2+i)*Math.SQRT2,-a/Math.SQRT2),f=Math.min((s/2-i)*Math.SQRT2,a/Math.SQRT2);if(f-b<.12)continue;const y=(b+f)/2;r.push(Y(new e.BoxGeometry(.035,f-b,l*.82),o,d(i+y/Math.SQRT2,n+m*y/Math.SQRT2,0,0,0,-m*Math.PI/4)))}r.push(P(.56,.34,.24,.06,A(v,.7),d(0,-.06,-.02)),P(.2,.3,.14,.04,v,d(0,-.3,0)));const c=Z(r);return r.forEach(m=>m.dispose()),c}function Ie(t,s,a){const l=[],{white:n,black:v,metal:r}=s,o=[.085,.075,.075];l.push(N([[1.22,43.55,o,0,.16],[1.235,43.6,o,0,.16],[1.1,44.25,o,0,.22],[.85,45.1,o,0,.36],[.55,45.9,o,0,.6],[.3,46.5,o,0,.85],[.22,46.75,o,0,.5],[.4,46.95,r],[.4,47.02,r]],48)),l.push(N([[0,46.6,o,0,1],[.16,46.64,o,0,1],[.27,46.4,o,0,.9],[.52,45.85,o,0,.66],[.82,45.1,o,0,.42],[1.07,44.25,o,0,.27],[1.2,43.56,o,0,.2],[1.22,43.55,o,0,.16]],48));for(let i=0;i<6;i++)l.push(Y(new e.CylinderGeometry(.035,.035,.75,6),A(r,1.6),T(i*E/6,d(0,46.72,.72,.95))));const c=[[.4,47.02,r],[1.4,47.02,r],[1.74,47.04,r],[h,47.14,v,0,0,1],[h,48.1,v,0,0,1],[h,48.1,n,0,0,1]];for(let i=48.6;i<56.9;i+=.52)c.push([h,i,n,i>50.2&&i<56.6?1:.2,0,1]);c.push([h,H,n,0,0,1],[h,H,v],[1.62,57.02,v],[1.2,57.9,v],[1.05,58.15,v],[.9,58.2,v],[0,58.2,v]),l.push(N(c,96)),l.push(P(.46,.3,.24,.05,A(r,.8),T(0,d(0,55.9,h+.1)))),l.push(P(.2,.2,.1,.03,A(r,2),T(0,d(0,55.9,h+.24))));const m=a.raceway2;l.push(P(.26,8.6,.11,.035,A(n,.95),T(m,d(0,52.55,h+.035)),.4));for(let i=48.7;i<56.8;i+=1.9)l.push(P(.34,.11,.15,.03,A(r,2.2),T(m,d(0,i,h+.04))));for(const i of[Math.PI/2+.3,-Math.PI/2+.3]){l.push(P(.52,.52,.22,.08,A(r,.8),T(i,d(0,48.9,h+.07))));for(const[b,f,y]of[[-.3,0,Math.PI/2],[.3,0,-Math.PI/2],[0,-.3,Math.PI]])l.push(Y(new e.CylinderGeometry(.04,.085,.14,10,1,!0),A(r,2.6),T(i,d(b,48.9+f,h+.16,0,0,y))))}for(const i of[2.2,-2.5])l.push(P(.05,.55,.3,.02,n,T(i,d(0,54.2,h+.12,.25))));l.push(N([[h,51,A(n,.9)],[h+.03,51.03,A(n,.9)],[h+.03,51.13,A(n,.9)],[h,51.16,A(n,.9)]],96)),l.push(P(.3,.3,.03,.012,A(r,.9),T(-a.raceway2*.75,d(0,54.35,h+.012)))),l.push(P(.2,.34,.035,.012,A(r,2.6),T(-a.raceway2*.55,d(0,53.2,h+.014)))),l.push(P(.42,.26,.025,.01,A(n,.8),T(a.raceway2*.3,d(0,52.6,h+.01)),.3));for(let i=0;i<4;i++)l.push(Y(new e.CylinderGeometry(.018,.018,.02,6),A(r,1.5),T(a.raceway2*.3,d((i&1?1:-1)*.17,52.6+(i&2?1:-1)*.09,h+.03,Math.PI/2))));return l}function je(t,s){const{white:a,black:l}=t,n=3.1,v=s.fairCyl,r=s.fairPow,o=[],c=[],m=[.2,.2,.185],i=[[h+.015,H],[h+.03,57.25]];for(let p=1;p<=7;p++){const z=p/7;i.push([W(h+.03,n,j(0,1,z)),W(57.25,59.1,z)])}const b=s.stripeY,f=[b,b+.5,b+.72,b+.9];for(let p=59.75;p<v-.3;p+=.65)f.push(p);f.sort((p,z)=>p-z).forEach(p=>i.push([n,p]));for(let p=0;p<=12;p++){const z=Math.sin(p/12*Math.PI/2);i.push([n*Math.pow(Math.max(0,1-Math.pow(z,r)),1/r)+(p===12?0:.001),W(v,re,z)])}const y=s.stripeY,w=A(a,.55),C=p=>p>y&&p<y+.5?t.accent:p>y+.72&&p<y+.9?l:p>68.9?w:a,G=p=>C((i[p][1]+i[Math.min(i.length-1,p+1)][1])/2);for(let p=0;p<i.length;p++){const[z,R]=i[p],Q=R<59.2?.5:0,D=G(Math.max(0,p-1)),U=G(p);o.push([z,R,D,Q,0,1]),U!==D&&o.push([z,R,U,Q,0,1]),c.push([Math.max(0,z-.075),R-(p>i.length-4?.07:0),m,0,0,.75])}const M=[N(o,40,{phiLen:Math.PI}),N(c,40,{phiLen:Math.PI,flip:!0})],u=[],x=A(a,.6);for(let p=0;p<i.length-1;p++)for(const z of[1,-1]){const R=[0,i[p][1],z*i[p][0]],Q=[0,i[p+1][1],z*i[p+1][0]],D=[0,i[p][1],z*Math.max(0,i[p][0]-.075)],U=[0,i[p+1][1],z*Math.max(0,i[p+1][0]-.075)];u.push(...R,...Q,...D,...Q,...U,...D,...R,...D,...Q,...Q,...D,...U)}const F=new e.BufferGeometry;F.setAttribute("position",new e.Float32BufferAttribute(u,3));const k=new Float32Array(u.length);for(let p=0;p<k.length;p+=3)k[p]=-1;F.setAttribute("normal",new e.BufferAttribute(k,3)),M.push(Y(F,x,null,0,.6)),M.push(Y(new e.RingGeometry(h-.06,h+.015,40,1,0,Math.PI),x,d(0,H,0,Math.PI/2,Math.PI/2),0,1));for(let p=1;p<6;p++)M.push(P(.1,v-59.4,.09,.03,A(m,1.5),T(p*Math.PI/6,d(0,(v+59.4)/2,n-.13))));const _=Z(M);return M.forEach(p=>p.dispose()),_}function Ee(t,s,a,l){const n=[],{white:v,black:r,metal:o}=a,c=[.012,.022,.085],m=(f,y)=>{const w=f.attributes.position;for(let G=0;G<w.count;G++){const M=w.getX(G),u=w.getY(G),x=w.getZ(G);w.setXYZ(G,M+s.n3(M*5.3+9,u*5.3,x*5.3)*y,u+s.n3(M*5.3,u*5.3+17,x*5.3)*y,x+s.n3(M*5.3,u*5.3,x*5.3+31)*y)}const C=f.toNonIndexed();return f.dispose(),C.deleteAttribute("uv"),C.computeVertexNormals(),C},i=[];if(l.payload==="panels"){for(let f=0;f<15;f++)n.push(P(2.05,.1,1.5,.03,f%5===4?A(o,2):c,d(0,58.42+f*.185,0,0,f%2?.02:-.02)));for(const f of[-1,1])n.push(P(.1,3,.1,.02,A(o,1.6),d(f*.8,59.8,.82)),P(.1,3,.1,.02,A(o,1.6),d(f*.8,59.8,-.82)));i.push(m(new e.BoxGeometry(.7,.9,.7,4,5,4).translate(0,61.75,0),.03)),i.push(m(new e.BoxGeometry(2.1,.12,1.56,9,1,7).translate(0,61.27,0),.02))}else if(l.payload==="capsule"){const f=[.035,.03,.03],y=A(v,.95);n.push(N([[0,58.75,f],[1.2,58.82,f],[1.44,59,f],[1.47,59.12,f],[1.47,59.12,y],[1.44,59.3,y],[.95,60.7,y],[.62,61.55,y],[.62,61.55,A(o,1.5)],[.5,61.9,A(o,1.5)],[0,61.95,A(o,1.5)]],40));for(const w of[.35,-.35,2.4])n.push(P(.3,.26,.05,.04,[.015,.03,.05],T(w,d(0,60.15,1.13,-.34))));for(let w=0;w<4;w++)n.push(P(.24,.3,.14,.04,o,T(w*E/4+.8,d(0,59.35,1.4,-.2))));i.push(m(new e.CylinderGeometry(1.25,1.1,.55,28,3,!0).translate(0,58.47,0),.035))}else{i.push(m(new e.BoxGeometry(1.5,2.7,1.5,10,18,10).translate(0,59.65,0),.035)),i.push(m(new e.CylinderGeometry(.42,.42,.5,14,2).translate(0,61.2,-.2),.03));for(const w of[-1,1]){for(let C=0;C<3;C++)n.push(P(.045,2.35,1.34,.015,C===2?c:A(c,.7),d(w*(.86+C*.07),59.65,0)));n.push(P(.2,.2,.3,.04,A(o,2),d(w*.8,60.3,0)),P(.2,.2,.3,.04,A(o,2),d(w*.8,59,0)))}const f=A(v,.95),y=d(.1,61.55,.2,.38,.5);n.push(Y(N([[0,0,f],[.25,.02,f],[.5,.09,f],[.72,.2,f],[.75,.22,f],[.72,.17,A(f,.6)],[.5,.05,A(f,.6)],[0,-.04,A(f,.6)]],28),f,null)),n[n.length-1].applyMatrix4(y);for(let w=0;w<3;w++)n.push(Y(new e.CylinderGeometry(.014,.014,.72,5),o,y.clone().multiply(d(Math.sin(w*E/3)*.3,.38,Math.cos(w*E/3)*.3,0,w*E/3,0).multiply(te().makeRotationX(-.42)))));n.push(Y(new e.CylinderGeometry(.07,.05,.14,10),o,y.clone().multiply(d(0,.7,0)))),n.push(Y(new e.CylinderGeometry(.02,.02,1.3,6),A(o,2),d(-.55,61.6,-.5,.2,0,.3)),Y(new e.SphereGeometry(.07,8,6),v,d(-.75,62.2,-.37)));for(const[w,C]of[[.5,.78],[-.45,.78]])n.push(Y(new e.CylinderGeometry(.09,.11,.3,10),r,d(w,60.5,C,Math.PI/2-.5)));for(let w=0;w<4;w++)n.push(Y(new e.CylinderGeometry(.03,.07,.14,8,1,!0),A(o,2.2),d((w&1?1:-1)*.66,58.36,(w&2?1:-1)*.66,Math.PI)))}const b=Z(i);return i.forEach(f=>f.dispose()),{hull:n,foil:b}}function Re(t,s){const n=[],v=[];for(let i=0;i<3;i++){const b=n.length/3;for(let f=0;f<=44;f++)for(let y=0;y<=40;y++)n.push(Math.pow(f/44,1.35),y/40*E,i);for(let f=0;f<44;f++)for(let y=0;y<40;y++){const w=b+f*41+y,C=w+1,G=w+40+1,M=G+1;v.push(w,C,G,C,M,G)}}const r=new e.BufferGeometry;r.setAttribute("position",new e.Float32BufferAttribute(new Float32Array(n.length),3)),r.setAttribute("aP",new e.Float32BufferAttribute(n,3)),r.setIndex(v);const o=new e.Color(s[6]),c=new e.ShaderMaterial({transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,fog:!0,uniforms:e.UniformsUtils.merge([e.UniformsLib.fog,{uFire:{value:o}}]),vertexShader:`
      uniform float uTime, uPress, uThrottle, uCloud, uSeed;
      attribute vec3 aP;
      varying vec3 vP; varying float vFace, vAxial, vLen, vEx;
      float gAx;
      #include <fog_pars_vertex>
      vec3 shape(float t, float ph, float ly, float ex, float len) {
        float r0 = mix(1.05, 1.9, ly * .5);
        float lance = r0 * (1. + (.35 + ly * .42) * sin(t * 3.1416)) * pow(max(1. - t, 1e-4), .5);
        float feather = r0 + (70. + 105. * ly) * (.3 * t + .7 * pow(max(t, 1e-5), 1.7));
        float r = mix(lance, feather, ex) * (1. + uCloud * (.5 + .9 * t) * ly);
        float phase = t * len / 5.6 * 3.1416 - uTime * 2.4;
        r *= 1. - (1. - gAx) * (1. - ex) * step(ly, .5) * .28 * (.5 + .5 * cos(2. * phase));
        r *= 1. + (1. - .9 * gAx) * (.05 + .05 * ly) * sin(uTime * 29. + t * 11. + ph * 3. + uSeed) * (.25 + t);
        vec2 off = vec2(sin(uTime * 6.3 + t * 8. + uSeed), cos(uTime * 4.9 + t * 6.3)) * t * t * (1.2 + 9. * ex);
        return vec3(r * sin(ph) + off.x, -.25 - len * t, r * cos(ph) + off.y);
      }
      void main() {
        float t = aP.x, ph = aP.y, ly = aP.z;
        float ex = pow(clamp(1. - uPress, 0., 1.), 1.5);
        float len = mix(94., 620., ex) * mix(.6, 1., ly * .5) * (.12 + .88 * uThrottle);
        vec3 axv = normalize(normalMatrix * vec3(0., 1., 0.));
        vec3 ov = (modelViewMatrix * vec4(0., -.5 * len, 0., 1.)).xyz;
        gAx = smoothstep(.5, .95, abs(dot(axv, normalize(-ov + vec3(0., 0., 1e-5)))));
        vec3 p = shape(t, ph, ly, ex, len);
        float dt = t < .5 ? .012 : -.012;
        vec3 n = normalize(cross(shape(t, ph + .06, ly, ex, len) - p, (shape(t + dt, ph, ly, ex, len) - p) / dt) + vec3(1e-6, 0., 0.));
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        vec3 vd = normalize(-mvPosition.xyz + vec3(0., 0., 1e-5));
        vFace = abs(dot(normalize(normalMatrix * n), vd));
        vAxial = abs(dot(axv, vd));
        vP = aP; vLen = len; vEx = ex;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime, uThrottle, uCloud, uSeed; uniform vec3 uFire;
      varying vec3 vP; varying float vFace, vAxial, vLen, vEx;
      #include <fog_pars_fragment>
      ${ae}
      void main() {
        float t = vP.x, ph = vP.y, ly = vP.z;
        float k = 1.6 + ly;
        vec3 q = vec3(cos(ph) * k, sin(ph) * k, t * vLen * mix(.2, .035, vEx) - uTime * mix(9., 2.2, vEx) + uSeed);
        float n = vn3(q) * .65 + vn3(q * 2.3 + 5.) * .35;
        float rays = vn3(vec3(cos(ph) * 5., sin(ph) * 5., t * 3. - uTime * .35 + uSeed)) * .6 + vn3(vec3(cos(ph) * 13., sin(ph) * 13., t * 5. - uTime * .5)) * .4;
        n = mix(n, rays * (.45 + .9 * n), vEx * .75);
        float axw = smoothstep(.5, .95, vAxial);
        // seen end-on the shells are discs: radial streaks that crawl outwards instead of rings
        float sa = ph + .5 * sin(t * 2.3 + uSeed + ly);
        float str = vn3(vec3(cos(sa) * 3.2, sin(sa) * 3.2, t * 1.5 - uTime * 1.6 + uSeed + ly * 3.)) * .55 + vn3(vec3(cos(sa) * 8.5, sin(sa) * 8.5, t * 3.2 - uTime * 2.9 + ly)) * .45;
        n = mix(n, .12 + 1.05 * str, axw);
        float edge = mix(smoothstep(0., .5, vFace), .3 + .3 * smoothstep(0., .3, vFace), axw);
        float head = smoothstep(0., .012, t), tail = pow(max(1. - t, 0.), mix(1.1, mix(2.4, 1.45, vEx), ly * .5));
        vec3 gold = vec3(1., .84, .56), hot = mix(uFire, vec3(1., .78, .45), .2);
        vec3 sea = ly < .5 ? mix(gold * 1.5, hot * .8, smoothstep(0., .7, t))
                 : ly < 1.5 ? mix(hot * .45, uFire * .3, smoothstep(0., .8, t))
                 : mix(uFire * .22, uFire * vec3(.9, .5, .35) * .12, smoothstep(0., .9, t));
        vec3 vac = vec3(.6, .58, .86) * (ly < .5 ? .8 : ly < 1.5 ? .3 : .15) * mix(1.6, .6, smoothstep(0., .5, t));
        // the fire stays orange through the weather and only pales to violet in thin air
        vec3 col = mix(sea * (1. + .55 * axw * smoothstep(.05, .5, vEx)), vac, smoothstep(.62, .97, vEx));
        float phase = t * vLen / 5.6 * 3.1416 - uTime * 2.4;
        float dia = pow(max(0., sin(phase)), 5.) * step(ly, 1.5) * (ly < .5 ? 1. : .3) * (1. - vEx) * (1. - smoothstep(.1, .8, t)) * (1. - axw);
        col += gold * 3.6 * dia;
        col = mix(col, uFire * (.5 + ly * .2), uCloud * .6 * min(ly, 1.));
        float a = edge * head * tail * (.3 + 1.15 * n) * smoothstep(0., .08, uThrottle);
        gl_FragColor = vec4(col * a, 1.);
        ${Be}
      }`});Object.assign(c.uniforms,{uTime:t.uTime,uPress:t.uPress,uThrottle:t.uThrottle,uCloud:t.uCloud,uSeed:t.uSeed});const m=new e.Mesh(r,c);return m.frustumCulled=!1,m.renderOrder=4,m}function Ye(t,s){const a=new e.ShaderMaterial({transparent:!0,depthWrite:!1,premultipliedAlpha:!0,fog:!1,uniforms:{uFire:{value:new e.Color(s[6])},uTime:t.uTime,uPress:t.uPress,uThrottle:t.uThrottle,uCloud:t.uCloud,uSeed:t.uSeed,uGlowAmt:t.uGlowAmt},vertexShader:`
      uniform float uPress, uThrottle, uCloud; varying vec2 vQ; varying float vEx;
      void main() {
        vEx = pow(clamp(1. - uPress, 0., 1.), 1.5);
        float rad = mix(10.5, 19., vEx) * (.5 + .5 * uThrottle) * (1. + .45 * uCloud) * length(modelMatrix[1].xyz);
        vec4 mv = modelViewMatrix * vec4(0., 0., 0., 1.);
        mv.xy += position.xy * rad * 2.6;
        vQ = position.xy * 2.6;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform float uTime, uThrottle, uCloud, uSeed, uGlowAmt; uniform vec3 uFire; varying vec2 vQ; varying float vEx;
      ${ae}
      void main() {
        float d = length(vQ);
        float ang = atan(vQ.y, vQ.x + step(abs(vQ.x) + abs(vQ.y), 1e-5) * 1e-4);
        float fl = .82 + .18 * sin(uTime * 37. + uSeed) * sin(uTime * 23.1 + 1.);
        float rays = vn3(vec3(cos(ang) * 3.5, sin(ang) * 3.5, uTime * 3.1 - d * 2. + uSeed)) * .6 + vn3(vec3(cos(ang) * 10., sin(ang) * 10., uTime * 5.3 - d * 4.)) * .4;
        float core = exp(-d * d * 9.);
        float brush = exp(-d * d * mix(1.15, 1.7, vEx)) * (.5 + 1.1 * rays * smoothstep(.1, .7, d));
        float halo = exp(-d * 1.9) * .32;
        vec3 warm = vec3(3.4, 2.3, 1.) * core + uFire * 2. * brush + uFire * .6 * halo;
        vec3 cold = vec3(1.3, 1.3, 1.8) * core + vec3(.6, .58, .9) * (.5 * brush + .12 * halo);
        float kc = smoothstep(.72, .98, vEx);
        vec3 col = mix(warm, cold, kc);
        float cover = mix(clamp(1.25 * brush + core + .3 * halo, 0., 1.), .2 * clamp(brush, 0., 1.), kc);
        col = mix(col, uFire * 3.2 * (brush + halo + core), uCloud * .55);
        float a = fl * smoothstep(0., .08, uThrottle) * (1. - smoothstep(2.1, 2.6, d)) * uGlowAmt;
        gl_FragColor = vec4(col * a, cover * min(a, 1.));
      }`});return{make:(n=1)=>{const v=new e.Mesh(new e.PlaneGeometry(2,2),a);return v.scale.setScalar(n),v.position.set(0,-1.2,0),v.frustumCulled=!1,v.renderOrder=5,v},mat:a}}function Ne(t){const s=[],a=[1,1,1];for(let r=0;r<=10;r++){const o=r/10;s.push([W(h+.5,6.4,Math.pow(o,.75)),W(47.6,38.5,o),a])}const l=N(s,48);l.deleteAttribute("aSurf"),l.deleteAttribute("color");const n=new e.ShaderMaterial({transparent:!0,depthWrite:!1,side:e.DoubleSide,fog:!0,uniforms:e.UniformsUtils.merge([e.UniformsLib.fog,{}]),vertexShader:`
      varying vec3 vO; varying float vFace;
      #include <fog_pars_vertex>
      void main() { vO = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
        vFace = abs(dot(normalize(normalMatrix * normal), normalize(-mvPosition.xyz + vec3(0., 0., 1e-5))));
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime, uVapour; varying vec3 vO; varying float vFace;
      #include <fog_pars_fragment>
      ${ae}
      void main() {
        float t = clamp((47.6 - vO.y) / 9.1, 0., 1.);
        float n = fb3(vec3(vO.x * 1.3, vO.y * .22 + uTime * 9., vO.z * 1.3));
        float fl = .65 + .35 * sin(uTime * 23.) * sin(uTime * 7.1 + 1.);
        float a = uVapour * fl * smoothstep(0., .3, t) * (1. - smoothstep(.4, 1., t)) * smoothstep(.35, .7, n) * smoothstep(0., .4, vFace);
        gl_FragColor = vec4(vec3(.85, .88, .92), clamp(a, 0., 1.) * .5);
        #include <fog_fragment>
      }`});Object.assign(n.uniforms,{uTime:t.uTime,uVapour:t.uVapour});const v=new e.Mesh(l,n);return v.frustumCulled=!1,v.renderOrder=3,v.visible=!1,v}function De(t){const s=new e.PlaneGeometry(2,2),a=new e.ShaderMaterial({transparent:!0,depthWrite:!1,depthTest:!1,blending:e.AdditiveBlending,fog:!1,uniforms:{uFlash:t.uFlash},vertexShader:`uniform float uFlash; varying vec2 vUv;
      void main() { vUv = position.xy; vec4 mv = modelViewMatrix * vec4(0., 0., 0., 1.); mv.xy += position.xy * (14. + 30. * uFlash); gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform float uFlash; varying vec2 vUv;
      void main() { float d = length(vUv); float a = exp(-d * d * 7.) + .25 * exp(-d * 2.2) * (1. - smoothstep(.7, 1., d));
        gl_FragColor = vec4(vec3(.96, .98, 1.) * 8. * uFlash * a, 1.); }`}),l=new e.Mesh(s,a);return l.position.set(0,be-2,0),l.frustumCulled=!1,l.renderOrder=6,l.visible=!1,l}function qe(t,s,a){const l=new Float32Array(a*3),n=new Float32Array(a*4);for(let c=0;c<a;c++){const m=t()*E,i=t.range(-1,1),b=Math.sqrt(1-i*i),f=Math.pow(t(),.6);l.set([Math.cos(m)*b*f,i*f,Math.sin(m)*b*f],c*3),n.set([t(),t(),t(),t()],c*4)}const v=new e.BufferGeometry;v.setAttribute("position",new e.BufferAttribute(l,3)),v.setAttribute("aSeed",new e.BufferAttribute(n,4));const r=new e.ShaderMaterial({transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,uniforms:{uTime:s.uTime,uStage:s.uStage,uPx:s.uPx,uDrift:s.uDrift},vertexShader:`
      uniform float uTime, uStage, uPx; uniform vec3 uDrift; attribute vec4 aSeed; varying float vA;
      void main() {
        float s = uStage, grow = 1. - exp(-s * 9.);
        vec3 p = position * (2.5 + 46. * grow + 240. * s) * (.35 + aSeed.x) + vec3(0., 44., 0.) + uDrift * (.15 + .8 * aSeed.y);
        p += vec3(sin(uTime * .7 + aSeed.z * 40.), cos(uTime * .6 + aSeed.w * 40.), sin(uTime * .5 + aSeed.x * 40.)) * .6;
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        float tw = pow(.5 + .5 * sin(uTime * (3. + 9. * aSeed.w) + aSeed.z * 60.), 6.);
        vA = (.12 + 2.4 * tw) * smoothstep(0., .02, s) * (1. - smoothstep(.75, 1., s));
        gl_PointSize = clamp(uPx * (.05 + .1 * aSeed.y) / max(-mv.z, .5), 1.6, uPx * .03);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`varying float vA;
      void main() { vec2 c = gl_PointCoord - .5; float d = dot(c, c) * 4.; float a = (1. - smoothstep(.0, 1., d)); gl_FragColor = vec4(vec3(.85, .93, 1.) * 3. * vA * a * a, 1.); }`}),o=new e.Points(v,r);return o.frustumCulled=!1,o.renderOrder=5,o.visible=!1,o}function Le(t,s,a){const l=new e.InstancedBufferGeometry;l.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),l.setIndex([0,1,2,0,2,3]);const n=new Float32Array(a*4),v=new Float32Array(a*4);for(let c=0;c<a;c++)n.set([t(),t(),t(),t()],c*4),v.set([t(),t(),t(),c/a],c*4);l.setAttribute("aSeed",new e.InstancedBufferAttribute(n,4)),l.setAttribute("aSeed2",new e.InstancedBufferAttribute(v,4)),l.instanceCount=a;const r=new e.ShaderMaterial({transparent:!0,depthWrite:!1,side:e.DoubleSide,fog:!0,uniforms:e.UniformsUtils.merge([e.UniformsLib.fog,{uTint:{value:new e.Color(.95,.98,1)}}]),vertexShader:`
      uniform float uTime, uFall, uShed, uStreak; attribute vec4 aSeed, aSeed2; varying float vA, vSd, vGl; varying vec2 vQ;
      #include <fog_pars_vertex>
      void main() {
        float y = mod(aSeed.y * 62. - uFall * (.55 + .9 * aSeed.w), 62.);
        float age = 1. - y / 62.;
        float ang = aSeed.x * 6.2832 + age * (aSeed2.x - .5) * 1.4;
        float rad = 1.93 + aSeed.z * aSeed.z * 2.6 + age * (.4 + 2.2 * aSeed2.y);
        vec3 c = vec3(sin(ang) * rad, y - 1., cos(ang) * rad);
        float tw = uTime * (2. + 7. * aSeed2.z) + aSeed.w * 30.;
        float sz = mix(.018, .075, aSeed2.x * aSeed2.x) * (aSeed2.y > .9 ? 2.6 : 1.);
        // never bigger than about a thirtieth of the frame, however close it passes the lens
        float sc = max(length(modelMatrix[1].xyz), 1e-4);
        float dist = max(-(modelViewMatrix * vec4(c, 1.)).z / sc, .05);
        sz = min(sz, .034 * dist);
        vec3 ax = normalize(vec3(sin(aSeed.x * 40.), cos(aSeed.z * 40.), sin(aSeed.w * 40.)) + vec3(0., 0., 1e-3));
        vec3 u1 = normalize(cross(ax, vec3(.31, .9, .29))), u2 = cross(ax, u1);
        vec3 e1 = u1 * cos(tw) + u2 * sin(tw), e2 = cross(ax, e1) * (.55 + .45 * aSeed2.z);
        // drawn out along the slipstream
        vec3 p = c + (e1 * position.x + e2 * position.y) * sz + vec3(0., position.y * min(uStreak * (.55 + .9 * aSeed.w), min(9. * sz + .25, 2.5 * sz + .014 * dist)), 0.);
        vQ = position.xy; vSd = aSeed.x * 7. + aSeed2.z * 3.;
        float fl = abs(sin(tw * 1.7));
        vGl = fl * fl * fl * fl * fl * fl;
        vA = step(aSeed2.w, uShed) * smoothstep(0., .04, age) * (1. - smoothstep(.85, 1., age)) * (.5 + .5 * fl);
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uTint; varying float vA, vSd, vGl; varying vec2 vQ;
      #include <fog_pars_fragment>
      void main() {
        float r = length(vQ);
        float a0 = atan(vQ.y, vQ.x + step(abs(vQ.x) + abs(vQ.y), 1e-5) * 1e-4);
        float re = .66 + .2 * sin(a0 * 3. + vSd * 40.) + .12 * sin(a0 * 7. + vSd * 90.);
        float a = vA * (1. - smoothstep(re * .25, re, r));
        if (a < .01) discard;
        gl_FragColor = vec4(uTint * (.62 + .4 * vA + 1.3 * vGl), a * .9);
        #include <fog_fragment>
      }`});Object.assign(r.uniforms,{uTime:s.uTime,uFall:s.uFall,uShed:s.uShed,uStreak:s.uStreak});const o=new e.Mesh(l,r);return o.frustumCulled=!1,o.renderOrder=2,o}function Qe(t){const s=[],a=[],l=[],v=new e.Vector3,r=new e.Vector3;let o=0;for(const i of[Math.PI/2+.3,-Math.PI/2+.3])for(const[b,f,y]of[[-.3,0,[-1,0,.25]],[.3,0,[1,0,.25]],[0,-.3,[0,-1,.3]]]){v.set(b*1.25,48.9+f*1.25,h+.2).applyMatrix4(te().makeRotationY(i)),r.set(y[0],y[1],y[2]).normalize().applyMatrix4(te().makeRotationY(i));for(let w=0;w<7;w++)s.push(v.x,v.y,v.z),a.push(r.x,r.y,r.z),l.push(w/7,(o*.377+.13)%1);o++}const c=new e.InstancedBufferGeometry;c.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),c.setIndex([0,1,2,0,2,3]),c.setAttribute("aO",new e.InstancedBufferAttribute(new Float32Array(s),3)),c.setAttribute("aDir",new e.InstancedBufferAttribute(new Float32Array(a),3)),c.setAttribute("aSeed",new e.InstancedBufferAttribute(new Float32Array(l),2)),c.instanceCount=l.length/2;const m=new e.Mesh(c,new e.ShaderMaterial({transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,fog:!1,uniforms:{uTime:t.uTime,uRcs:t.uRcs},vertexShader:`attribute vec3 aO, aDir; attribute vec2 aSeed; uniform float uTime, uRcs; varying vec2 vQ; varying float vA;
      void main(){
        float age = fract(uTime * 2.1 + aSeed.x), born = uTime - age / 2.1;
        float on = step(fract(born / 2.7 + aSeed.y), .24);             // a burst of about 0.65 s every 2.7 s, each jet in its own time
        vec3 c = aO + aDir * (.06 + 3.4 * age * (1. - .35 * age));
        vec4 mv = modelViewMatrix * vec4(c, 1.);
        mv.xy += position.xy * (.05 + .62 * age) * length(modelMatrix[1].xyz);
        vQ = position.xy; vA = uRcs * on * (1. - age) * (1. - age) * smoothstep(0., .06, age);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`varying vec2 vQ; varying float vA;
      void main(){ float a = exp(-dot(vQ, vQ) * 3.2) * (1. - smoothstep(.8, 1., length(vQ))) * vA; if (a < .003) discard; gl_FragColor = vec4(vec3(.8, .9, 1.) * 1.5 * a, 1.); }`}));return m.frustumCulled=!1,m.renderOrder=5,m}function Ke(t,s){const a=new e.MeshStandardMaterial({color:new e.Color().setRGB(...s),roughness:.3,metalness:0});return a.onBeforeCompile=l=>{l.uniforms.uTime=t.uTime,l.vertexShader=l.vertexShader.replace("#include <common>",`uniform float uTime;
varying vec3 vObj;
#include <common>`).replace("#include <begin_vertex>",`#include <begin_vertex>
vObj = position;
transformed += .016 * vec3(sin(position.y * 9. + uTime * 2.3), sin(position.z * 8. + uTime * 1.9 + 1.), sin(position.x * 10. + uTime * 2.1 + 2.));`),l.fragmentShader=l.fragmentShader.replace("#include <common>",`uniform float uTime; varying vec3 vObj;
${ae}
#include <common>`).replace("#include <normal_fragment_begin>",`#include <normal_fragment_begin>
{ vec3 q = vObj * 13.; float w = uTime * 1.1;
  vec3 dn = vec3(vn3(q + vec3(w, 0., 0.)), vn3(q + vec3(7., w, 3.)), vn3(q + vec3(13., 5., w))) - .5;
  normal = normalize(normal + dn * .7); }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
{ vec3 vdir = normalize(vViewPosition);
  vec3 rd = reflect(-vdir, normal);
  float env = vn3(rd * 2.4 + 4.) * .7 + vn3(rd * 6. + 9.) * .3;
  float fr = 1. - abs(dot(normal, vdir));
  diffuseColor.rgb *= mix(.22, 1.3, smoothstep(.25, .75, env));
  totalEmissiveRadiance += vec3(1., .74, .3) * (pow(env, 5.) * 1.1 + .1 * fr * fr); }`)},a}const $=[[0,0],[2,0],[5,.08],[8,.9],[9,1.2],[12.5,6],[15,11],[18,30],[22,80],[40,150]];function We(t){for(let s=1;s<$.length;s++)if(t<=$[s][0])return W($[s-1][1],$[s][1],(t-$[s-1][0])/($[s][0]-$[s-1][0]));return $[$.length-1][1]}async function Ze(t,s={}){const a=t.rng,l=t.noise,n=(s.palette&&s.palette.length>=7?s.palette:Ce).slice(),v=t.quality?.detail??1,r=a.sign(),o={livery:s.livery||(a.chance(.6)?"white":a.chance(.5)?"steel":"foam"),payload:s.payload||(a.chance(.55)?"satellite":a.chance(.55)?"panels":"capsule"),raceway:r*a.range(.34,.52),raceway2:-r*a.range(.3,.44),finW:a.range(1.35,1.6),finH:a.range(1.7,2.05),fairCyl:a.range(62.6,64.6),fairPow:a.range(1.9,2.5),stripeY:a.range(60,61.8),rollB:a.range(33.5,36.5),rollU:a.range(52.75,53.05),tumble:a.sign(),seed:a.range(0,40)},c=ue(n[2],.68),m=[.028,.03,.036],i=[.11,.115,.125],b=[.44,.46,.49],f=oe(ue(n[6],.62),[.3,.12,.04],.45),y=o.livery==="steel"?b:o.livery==="foam"?f:c,w=ue(a.pick([n[1],n[0],n[1]]),.8),C={white:o.livery==="steel"?b:c,tank:y,black:m,metal:i,soot:oe(y,[.05,.045,.04],.78),accent:w},G={...C,white:c},M={uTime:{value:0},uSeed:{value:o.seed},uFrost:{value:1},uFrostCol:{value:new e.Color(.84,.91,1)},uPress:{value:1},uThrottle:{value:0},uCloud:{value:0},uVapour:{value:0},uFlash:{value:0},uStage:{value:0},uPx:{value:900},uDrift:{value:new e.Vector3},uFall:{value:0},uShed:{value:0},uStreak:{value:0},uGlowAmt:{value:1},uDownV:{value:new e.Vector4(0,-1,0,0)},uSunVw:{value:new e.Vector4(0,1,0,0)},uRcs:{value:0}},u=new e.Group;u.name="uphill-to-black-hero";const x=new e.Group;x.position.set(0,20,0);const F=new e.Group;F.position.set(0,-20,0),x.add(F),u.add(x);const k=ce(M,{roll:[o.rollB,o.rollB+3.6],glowCol:[6.5,5.2,3.2],roughness:o.livery==="foam"?.85:.36}),_=async()=>{await t.yield?.()},p=await _e(a,C,o,_);await _(),F.add(new e.Mesh(p,k));const z=new e.InstancedMesh(Oe(o),new e.MeshStandardMaterial({vertexColors:!0,roughness:.62,metalness:0}),4);z.frustumCulled=!1,F.add(z);const R=Re(M,n);F.add(R);const Q=Ye(M,n),D=Q.make(1);F.add(D);const U=Ne(M);F.add(U),await t.yield?.();const ee=new e.Group;u.add(ee);const fe=ce(M,{roll:[o.rollU,o.rollU+1.7],glowCol:[1.5,.2,.045],accent:w}),ve=Ie(a,C,o);await t.yield?.();const se=Ee(a,l,C,o);await t.yield?.();const Se=Z([...ve,...se.hull]);ve.forEach(g=>g.dispose()),se.hull.forEach(g=>g.dispose()),ee.add(new e.Mesh(Se,fe));const de=new e.Mesh(se.foil,Ke(M,[.8,.46,.07]));ee.add(de),await t.yield?.();const Me=je(G,o);await t.yield?.();const me=ce(M,{glowCol:[1.5,1.6,1.9],fair:!0,accent:w}),he=[0,1].map(g=>{const S=new e.Group;S.rotation.y=g*Math.PI;const V=new e.Group;V.position.set(h,H,0);const B=new e.Mesh(Me,me);return B.position.set(-h,-H,0),B.frustumCulled=!1,V.add(B),S.add(V),u.add(S),V});await t.yield?.();const pe=De(M),ne=qe(a,M,Math.round(400*v)),ie=Le(a,M,Math.round(560*v)),Ae=Qe(M);ee.add(Ae),u.add(pe,ne,ie),await t.yield?.();const O={progress:s.progress??0,throttle:0,pressure:1,cloud:0,frost:1,shed:0,vapour:0,staging:0,bell:0,fairing:0,fallSpeed:10,altitude:0};let q=!1;const Fe=new e.Matrix4,ge=g=>{for(let S=0;S<4;S++)z.setMatrixAt(S,Fe.copy(T(S*E/4+E/8,d(0,45.8,h+.125,-g*Math.PI/2))));z.instanceMatrix.needsUpdate=!0};ge(0);const I={object:u,radius:26,height:re,center:new e.Vector3(0,34,0),ground:!1,groundY:0,state:O,uniforms:M,variant:o,flash:0,parts:{booster:x,upper:ee,fairing:he,plume:R,flakes:ie,glitter:ne,foil:de,glow:D},makeNozzleGlow:g=>Q.make(g),setThrottle(g){q=!0,O.throttle=M.uThrottle.value=L(g,0,1),k.userData.u.uGlow.value=O.throttle,R.visible=D.visible=O.throttle>.002&&x.visible},setPressure(g){q=!0,O.pressure=M.uPress.value=L(g,0,1)},setAltitude(g){O.altitude=g,I.setPressure(Math.exp(-g/7.2))},setCloudGlow(g){q=!0,O.cloud=M.uCloud.value=L(g,0,1)},setFrost(g){q=!0,O.frost=M.uFrost.value=L(g,0,1)},setShed(g,S){q=!0,O.shed=M.uShed.value=L(g,0,1),S!=null&&(O.fallSpeed=S),ie.visible=O.shed>.004},setVapour(g){q=!0,O.vapour=M.uVapour.value=L(g,0,1),U.visible=g>.004&&x.visible},setBellGlow(g){q=!0,O.bell=fe.userData.u.uGlow.value=L(g,0,1)},setFlash(g){I.flash=M.uFlash.value=L(g,0,1),pe.visible=g>.004},setStaging(g){q=!0,g=O.staging=L(g,0,1),M.uStage.value=g;const S=22*g+1500*Math.pow(g,1.6),V=j(5,70,S);x.position.set(o.tumble*.14*S*V,20-S,.44*S*V);const B=Math.pow(Math.max(0,g-.012),1.15)*15;x.rotation.set(-B,.5*B*.13*o.tumble,o.tumble*B*.21),M.uDrift.value.set(x.position.x,x.position.y-20,x.position.z),ge(j(.035,.2,g)),x.visible=g<.999,ne.visible=g>0&&g<.999,x.visible||(R.visible=!1,D.visible=!1,U.visible=!1)},setFairing(g){q=!0,g=O.fairing=L(g,0,1);const S=j(0,.3,g),V=L((g-.3)/.7,0,1);for(let B=0;B<2;B++){const X=he[B],J=B?-1:1;X.position.set(h+.9*S*S+5.2*Math.pow(V,.8),H+.5*S-150*V*V,J*1.2*V),X.rotation.set(J*1.1*V,J*.5*V,-(.74*S+3.4*V*(B?.8:1))),X.visible=g<.999}},setProgress(g){g=O.progress=L(g,0,1);const S=g*40;I.setThrottle(j(.15,2,S)*(1-j(21.85,22.2,S))),I.setAltitude(We(S));const V=(J,xe)=>Math.exp(-((S-J)/xe)*((S-J)/xe));I.setCloudGlow(Math.min(1,V(9.1,.5)+V(12.6,.5)+V(15.1,.45))),I.setFrost(1-.22*j(.2,3,S)-.66*j(4,21,S));const B=S<22.2;I.setShed(B?(.25+.75*j(.3,1.6,S))*W(1,.55,j(3,10,S)):.12+.4*(1-j(22.6,29,S)),B?9+55*j(2,15,S):.7),I.setVapour(j(12.9,13.3,S)*(1-j(14.6,15.1,S)));const X=S-22.6;I.setFlash(X<0?0:X<.1?j(0,.1,X):1-j(.1,.4,X)),I.setStaging(X/7),I.setBellGlow(j(22.7,23.6,S)*(.85+.15*Math.sin(S*3))),I.setFairing((S-27.2)/4.2),M.uRcs.value=j(23,23.6,S)}},K=new e.Vector3(...Te),we=new e.Vector3(0,-Math.cos(12*Math.PI/180),Math.sin(12*Math.PI/180)),ye=K.clone().add(new e.Vector3(0,190,0));I.anchors={pod:K,podNormal:new e.Vector3(0,0,1),aftView:we,forwardView:new e.Vector3(0,1,0),portalSeat:{position:ye,facing:new e.Vector3(0,-1,0)},flyThrough:[K.clone(),K.clone().setY(62),K.clone().setY(re+6),K.clone().setY(120),ye.clone()],stageBreak:new e.Vector3(0,be,0),nozzles:new e.Vector3(0,0,0),payload:new e.Vector3(0,59.9,0),fairingTip:new e.Vector3(0,re,0),hinges:[new e.Vector3(h,H,0),new e.Vector3(-h,H,0)],towerSide:new e.Vector3(-1,0,0),viewpoints:{aft:{position:K.clone(),target:K.clone().addScaledVector(we,20),up:new e.Vector3(0,0,1)},forward:{position:K.clone(),target:K.clone().setY(80),up:new e.Vector3(0,0,1)},threeQuarter:{position:new e.Vector3(12,60,15),target:new e.Vector3(0,58.5,0),up:new e.Vector3(0,1,0)},mid:{position:new e.Vector3(7.5,49,9.5),target:new e.Vector3(0,45,0),up:new e.Vector3(0,1,0)},base:{position:new e.Vector3(9,-6,12),target:new e.Vector3(0,2.5,0),up:new e.Vector3(0,1,0)},skin:{position:new e.Vector3(1.5,53.6,7.2),target:new e.Vector3(0,53.2,0),up:new e.Vector3(0,1,0)},far:{position:new e.Vector3(150,10,330),target:new e.Vector3(0,-90,0),up:new e.Vector3(0,1,0)}}};const Pe=new e.Vector2;let le=0;return I.setRimGlint=g=>{me.userData.u.uGlow.value=g},I.setSpaceLight=(g,S,V,B)=>{M.uDownV.value.set(g.x,g.y,g.z,S),M.uSunVw.value.set(V.x,V.y,V.z,B)},I.setProgress(O.progress),q=!1,I.update=(g,S,V)=>{M.uTime.value=S,q||(I.setProgress((.06+S*.02)%.82),q=!1);const B=O.fallSpeed>5?9:.7;le=(le+(O.fallSpeed-B)*Math.min(g,.1))%6200,M.uFall.value=(S*B+le)%6200,M.uStreak.value=O.fallSpeed*.009,t.renderer&&(M.uPx.value=t.renderer.getDrawingBufferSize(Pe).y)},I.dispose=()=>{},I}function Ue(t){const s=[],a=(r,o,c,m=1,i=1)=>{c&&r.applyMatrix4(c);const b=r.attributes.position.count,f=new Float32Array(b).fill(o),y=r.attributes.uv;for(let w=0;w<b;w++)y.setXY(w,y.getX(w)*m,y.getY(w)*i);r.setAttribute("aK",new e.BufferAttribute(f,1)),s.push(r.index?r.toNonIndexed():r)},l=(r,o,c,m,i,b,f=r)=>a(new e.CylinderGeometry(f,r,o,20,1,!1).rotateX(Math.PI/2),c,m,i,b);a(new e.BoxGeometry(104,1.9,1.9),2,null,52,1);for(const r of[-52,-38,-24,24,38,52])a(new e.BoxGeometry(1.2,3.4,3.4),0,d(r,0,0),1,1);a(new e.BoxGeometry(5,2.6,4),4,d(-9,2.2,0),2,1),a(new e.BoxGeometry(4,2.2,3.4),0,d(11,2,0),2,1),a(new e.CylinderGeometry(.12,.12,9,6),2,d(16,5.4,0)),a(new e.SphereGeometry(1.5,12,6,0,E,0,1.1),0,d(16,9.2,0,Math.PI),2,2),a(new e.CylinderGeometry(.1,.1,7,6),2,d(-19,-4.4,0));let n=-27;for(const r of[9.5,11,8,12,9])l(2.25,r,0,d(0,-3.3,n+r/2),10,Math.round(r/2)),l(2.4,.5,2,d(0,-3.3,n+r+.25),4,1),n+=r+.5;l(2,10,0,d(-7.6,-3.3,6,0,Math.PI/2),10,4),l(2,9,0,d(7.2,-3.3,6,0,Math.PI/2),10,4),l(1.9,7,4,d(0,-8.4,-6,Math.PI/2),8,3),l(1.5,1.4,5,d(0,-6.4,15,Math.PI/2),6,1,.9),l(1.7,6.4,0,d(0,-3.3,-30.6),8,3,.7),l(1.8,7.2,4,d(0,-3.3,27.4),8,3,1);for(const r of[-1,1])a(new e.BoxGeometry(7.5,.08,2.4),1,d(r*5.6,-3.3,-31),6,2),a(new e.BoxGeometry(7.5,.08,2.4),1,d(r*5.6,-3.3,28),6,2);for(const r of[-46,-31,31,46])for(const o of[-1,1]){const c=.5+.12*Math.sin(r),m=new e.Matrix4().makeRotationZ(c).setPosition(r,0,0);a(new e.CylinderGeometry(.16,.16,37,6).rotateX(Math.PI/2),2,m.clone().multiply(d(0,0,o*21.5)));for(const i of[-1,1])a(new e.BoxGeometry(5.3,.06,34),1,m.clone().multiply(d(i*2.95,0,o*22)),4,26);a(new e.BoxGeometry(11.4,.3,.5),2,m.clone().multiply(d(0,0,o*4.7)))}for(const r of[-15,15])for(let o=0;o<3;o++)a(new e.BoxGeometry(3.3,13,.1),3,d(r+(o-1)*3.6,-8.4,.9,0,.25*(o-1)),1,8);const v=Z(s);return s.forEach(r=>r.dispose()),v}async function Je(t,s={}){const a=s.rng||t.rng.fork("orbit"),l=t.quality?.detail??1,n={uTime:s.uTime||{value:0},uSunL:{value:new e.Vector3(0,1,0)},uEarthL:{value:new e.Vector3(0,-1,0)},uCamL:{value:new e.Vector3},uSunCol:{value:new e.Color(1,.86,.66)},uShine:{value:new e.Color(.34,.5,.85)}},v=Ue(a);await t.yield?.();const r=new e.Mesh(v,new e.ShaderMaterial({uniforms:n,fog:!1,vertexShader:`attribute float aK; varying vec3 vN, vP; varying vec2 vUv; varying float vK;
      void main(){ vN = normal; vP = position; vUv = uv; vK = aK; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,fragmentShader:`uniform vec3 uSunL, uEarthL, uCamL, uSunCol, uShine; uniform float uTime; varying vec3 vN, vP; varying vec2 vUv; varying float vK;
      float h21(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
      void main(){
        vec3 N = normalize(vN + vec3(0., 1e-5, 0.)), V = normalize(uCamL - vP + vec3(0., 0., 1e-5));
        if (dot(N, V) < 0.) N = -N;
        vec2 f = fract(vUv), cell = floor(vUv); float ln = min(min(f.x, 1. - f.x), min(f.y, 1. - f.y)), hc = h21(cell + floor(vK) * 7.);
        vec3 base = vec3(.6, .6, .58) * (.82 + .26 * hc); float spec = .25, gloss = 30., trans = 0., em = 0.;
        if (vK > .5 && vK < 1.5) {            // solar cells: deep blue faces ruled in silver, amber where the sun shines through
          base = mix(vec3(.012, .03, .11), vec3(.05, .09, .2), hc) * step(.07, ln) + vec3(.3, .3, .32) * (1. - step(.07, ln)); spec = 1.6; gloss = 90.; trans = 1.;
        } else if (vK > 1.5 && vK < 2.5) {    // truss: open lattice drawn as crossed members on dark
          float d1 = abs(f.x - f.y), d2 = abs(f.x + f.y - 1.); base = mix(vec3(.05, .05, .06), vec3(.42, .43, .46), 1. - smoothstep(.06, .16, min(min(d1, d2), ln * 1.6)));
        } else if (vK > 2.5 && vK < 3.5) { base = vec3(.72, .73, .74) * (.9 + .1 * step(.1, ln)); spec = .5; }
        else if (vK > 3.5 && vK < 4.5) { base = vec3(.62, .4, .09) * (.6 + .7 * hc); spec = 1.2; gloss = 16.; }
        else if (vK > 4.5) { base = vec3(.02, .03, .05); spec = 2.; gloss = 120.; }
        else {                                  // hull panels with seams, handrails and a few lit ports
          base *= .7 + .3 * step(.05, ln);
          em = step(.93, hc) * (1. - smoothstep(.1, .22, length(f - .5))) * (.7 + .3 * sin(uTime * 1.7 + hc * 40.));
        }
        float nl = dot(N, uSunL), ne = dot(N, uEarthL) * .5 + .5;
        vec3 col = base * (uSunCol * max(nl, 0.) * 2.4 + uShine * (.25 + ne * ne * 1.6) + vec3(.012, .014, .02));
        col += trans * vec3(.9, .42, .08) * uSunCol * max(-nl, 0.) * .5 * (.5 + .5 * step(.07, ln));
        float sp = max(dot(reflect(-V, N), uSunL), 0.); col += uSunCol * spec * pow(sp, gloss) * step(0., nl) * 1.4;
        float se = max(dot(reflect(-V, N), uEarthL), 0.); col += uShine * spec * .5 * se * se * se;
        col += vec3(1., .8, .5) * em * 2.2;
        gl_FragColor = vec4(col, 1.);
      }`}));r.frustumCulled=!1,r.matrixAutoUpdate=!1;const o=new e.BufferGeometry;o.setAttribute("position",new e.Float32BufferAttribute([-52.6,0,0,52.6,0,0,0,-3.3,-34,16,10.6,0],3)),o.setAttribute("aSeed",new e.Float32BufferAttribute([.1,.6,.35,.8],1));const c={uTime:n.uTime,uPx:s.uPx||{value:900}},m=new e.Points(o,new e.ShaderMaterial({uniforms:c,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,fog:!1,vertexShader:`attribute float aSeed; uniform float uTime, uPx; varying vec3 vC;
      void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); float s = .5 + .5 * sin(uTime * 1.6 + aSeed * 6.2832);
        vC = mix(vec3(1., .12, .08), vec3(.2, 1., .3), step(.5, aSeed)) * (.35 + 2.2 * s * s);
        gl_PointSize = clamp(uPx * 1.6 / max(-mv.z, 1.), 2., uPx * .03); gl_Position = projectionMatrix * mv; }`,fragmentShader:"varying vec3 vC; void main(){ vec2 c = gl_PointCoord - .5; float a = 1. - smoothstep(0., 1., dot(c, c) * 4.); gl_FragColor = vec4(vC * a * a, 1.); }"}));return m.frustumCulled=!1,r.add(m),await t.yield?.(),{station:r,SU:n,...Xe(a,s,l)}}function Xe(t,s,a){const l=s.iceR0??9.6,n=s.iceR1??26,v=Math.round(1500*a),r=new Float32Array(v*3),o=new Float32Array(v*4);for(let b=0;b<v;b++){const f=Math.pow(t(),2.2),y=l+(n-l)*f;r.set([y,t()*E,(t()-.5)*(3+16*f)],b*3),o.set([t(),t(),t(),t()],b*4)}const c=new e.BufferGeometry;c.setAttribute("position",new e.BufferAttribute(r,3)),c.setAttribute("aSeed",new e.BufferAttribute(o,4));const m={uTime:s.uTime||{value:0},uPx:s.uPx||{value:900},uAmt:{value:0},uTint:{value:new e.Color(1,.9,.78)}},i=new e.Points(c,new e.ShaderMaterial({uniforms:m,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,fog:!1,vertexShader:`attribute vec4 aSeed; uniform float uTime, uPx, uAmt; varying float vA, vBig; varying vec3 vC;
      void main(){
        float ang = position.y + uTime * (.05 + .07 * aSeed.x) * (1. - .5 * step(.5, aSeed.w)), r = position.x * (1. + .03 * sin(uTime * .4 + aSeed.y * 30.));
        vec3 p = vec3(cos(ang) * r, sin(ang) * r, position.z + sin(uTime * .3 + aSeed.z * 20.) * .8);
        vec4 mv = modelViewMatrix * vec4(p, 1.); float dist = max(-mv.z, .3);
        float s = sin(uTime * (1.2 + 5. * aSeed.w) + aSeed.z * 60.) * .5 + .5, tw = s * s * s * s;
        vBig = step(.9, aSeed.y);
        vA = uAmt * (.3 + 2.8 * tw + vBig * 1.2) * smoothstep(1.2, 4., dist) * clamp(uPx * .09 / dist, .22, 1.);
        vC = mix(vec3(.8, .9, 1.), vec3(1., .86, .66), aSeed.x * aSeed.x);
        gl_PointSize = clamp(uPx * (.1 + .16 * aSeed.z + .5 * vBig) / dist, 1.8 + 1.4 * vBig, uPx * .035);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`varying float vA, vBig; varying vec3 vC;
      void main(){ vec2 c = (gl_PointCoord - .5) * 2.; float d = dot(c, c), a = 1. - smoothstep(0., 1., d);
        float ray = (1. - smoothstep(0., .12, abs(c.x))) * (1. - abs(c.y)) + (1. - smoothstep(0., .12, abs(c.y))) * (1. - abs(c.x));
        gl_FragColor = vec4(vC * vA * (a * a * a * 2.4 + vBig * ray * a * .9), 1.); }`}));return i.frustumCulled=!1,i.renderOrder=6,{ice:i,IU:m}}export{Ze as buildHero,Je as buildOrbit};
