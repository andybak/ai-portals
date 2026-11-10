import*as e from"three";import{clamp as ce,lerp as ke,smoothstep as de}from"../kit/core.js";const lt=["#ECE8DF","#8E9AA8","#B5673A","#C8791C","#9DB24C","#3A2A22","#2F8F8C"],Be=6,pe=9.8,we=11,Se=.9,Ve=2.45,ye=Se+Ve,Te=9.6,ct=.354,Oe=.12,He=.45,je=new e.Vector3(14,18.14,-50),Ie=new e.Vector3(-2,0,-15),ut=16,et=53,xe=new e.Vector3(0,1,0);function Ge(a,i){const u=a.length,c=[],T=new Array(u).fill(0);for(let f=0;f<u-1;f++)c.push((i[f+1]-i[f])/(a[f+1]-a[f]));for(let f=1;f<u-1;f++)T[f]=c[f-1]*c[f]<=0?0:2*c[f-1]*c[f]/(c[f-1]+c[f]);return f=>{if(f<=a[0])return i[0];if(f>=a[u-1])return i[u-1];let l=0;for(;f>a[l+1];)l++;const R=a[l+1]-a[l],d=(f-a[l])/R,M=d*d,r=M*d;return(2*r-3*M+1)*i[l]+(r-2*M+d)*R*T[l]+(-2*r+3*M)*i[l+1]+(r-M)*R*T[l+1]}}const vt=Ge([0,.008,.05,.12,.285,.3,.32,.34,.36,.38,.395,1],[we,we,Te,6.4,ye,2.9,2.58,2.15,1.45,.55,0,0]);function Ne(a,i){let u=vt(a);return i&&(u+=.58*de(.326,.3415,a)*(1-de(.3415,.368,a))),ce(u,0,we)}function ft(a,i=et){const u=a.range(2.3,3)*(a.chance(.5)?1:-1),c=[new e.Vector2(Ie.x,Ie.z),new e.Vector2(-12+a.range(-1.5,1.5),10+a.range(-3,3)),new e.Vector2(-14+a.range(-2,1),i),new e.Vector2(ut,i)],T=(z,s)=>{const v=1-z;return s.set(v*v*v*c[0].x+3*v*v*z*c[1].x+3*v*z*z*c[2].x+z*z*z*c[3].x,v*v*v*c[0].y+3*v*v*z*c[1].y+3*v*z*z*c[2].y+z*z*z*c[3].y)},f=96,l=new Float32Array(f+1),R=new e.Vector2,d=new e.Vector2;T(0,R);for(let z=1;z<=f;z++)T(z/f,d),l[z]=l[z-1]+R.distanceTo(d),R.copy(d);const M=l[f],r=z=>{z=ce(z,0,M);let s=0;for(;s<f-1&&l[s+1]<z;)s++;return(s+(z-l[s])/Math.max(l[s+1]-l[s],1e-6))/f},n=new e.Vector3(c[1].x-c[0].x,0,c[1].y-c[0].y).normalize(),w=new e.Vector3().crossVectors(n,xe),b=new e.Vector3(Ie.x,0,Ie.z).addScaledVector(xe,Be*Math.cos(Oe)).addScaledVector(w,-Be*Math.sin(Oe)),x=new e.Vector3(b.x-je.x,0,b.z-je.z).multiplyScalar(1/(Ve+Se*.5)),A=x.clone().multiplyScalar(Se*.5),V=je.clone().add(A),p=(b.y-V.y+.5*pe*Ve*Ve)/Ve,F=.5*u*Se,S=F+u*Ve,k=new e.Vector3,N=new e.Vector3,h=new e.Vector3,g=new e.Vector3,m=new e.Vector3,O=new e.Matrix4,B=new e.Quaternion,P=new e.Vector2,W=new e.Vector2;function $(z,s,v){let G,I;if(z<=Se){const t=Math.max(z,0)/Se;k.copy(n),G=Math.PI/2,I=.5*u*Se*t*t,s.copy(je).addScaledVector(A,t*t)}else if(z<=ye){const t=z-Se,q=t/Ve;k.copy(n),I=F+u*t,G=Math.PI/2-(Math.PI/2-Oe)*q*q*(1.4-.4*q),s.copy(V).addScaledVector(x,t),s.y+=p*t-.5*pe*t*t}else{const t=ce((z-ye)/(Te-ye),0,1),q=M*(1-Math.pow(1-t,1.6)),X=r(q),oe=Math.min(X,.985);T(oe,P),T(oe+.012,W),k.set(W.x-P.x,0,W.y-P.y).normalize(),T(X,P),I=S-q/Be,G=Oe*Math.pow(1-t,8)+(.03+.24*t*t*t)*Math.sin(Math.PI*(2+12*t*t))*(1-Math.pow(1-t,8));let H=0;const Q=(z-ye)/.5,J=(z-ye-.5)/.32;if(Q>0&&Q<1?H=1.7*Math.sin(Math.PI*Q):J>0&&J<1&&(H=.55*Math.sin(Math.PI*J)),z>Te){const re=z-Te;G=ct*(1-Math.exp(-3.6*re)*Math.abs(Math.cos(4.6*re)))}N.crossVectors(k,xe),s.set(P.x,H,P.y).addScaledVector(xe,Be*Math.cos(G)).addScaledVector(N,-Be*Math.sin(G)),s.z+=3*de(13.5,8,s.x)*de(-4,2.5,s.x)*de(i-22,i-10,s.z)}if(N.crossVectors(k,xe),h.copy(k),g.copy(N).multiplyScalar(Math.cos(G)).addScaledVector(xe,Math.sin(G)),m.crossVectors(h,g),O.makeBasis(h,g,m),v.setFromRotationMatrix(O),B.setFromAxisAngle(xe,I),v.multiply(B),z>ye&&z<Te){const t=(z-ye)/(Te-ye),q=ce(t/.14,0,1),X=ce((t-.5)/.3,0,1);B.setFromAxisAngle(xe,(.4+.06*Math.sin(z*2.3))*q*q*(3-2*q)*(1-X*X*(3-2*X))),v.premultiply(B)}return s}return{pose:$,trackLen:M,hL:n,vh:x,spinRate:u}}const Le=`
uniform float uT;
uniform mat4 uTray;
varying vec3 vLocal; varying vec3 vN; varying vec3 vView;
const float SLIDE_K = ${He.toFixed(2)};
vec3 qrot(vec4 q, vec3 v) { return v + 2. * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
vec3 rod(vec3 w, float t, vec3 v) {
  float r = length(w); vec3 k = w / max(r, 1e-5); float a = r * t, c = cos(a), s = sin(a);
  return v * c + cross(k, v) * s + k * dot(k, v) * (1. - c);
}
`,Ee=`
  vLocal = P; vN = mat3(modelMatrix) * N;
  vec4 wp = modelMatrix * vec4(P, 1.); vView = cameraPosition - wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
`,ze=`
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSkyCol; uniform vec3 uBounceCol;
uniform vec4 uWin[5]; uniform vec3 uWall; uniform vec4 uFill;        // uFill: rgb = soft light from the window wall, a = how bright the windows are in reflections
float beamMask(vec3 p) {
  float sx = min(uSunDir.x, -.05);
  vec3 h = p + uSunDir * max((uWall.x - p.x) / sx, 0.);
  float m = 0.;
  for (int i = 0; i < 5; i++) {
    vec4 w = uWin[i];
    m += smoothstep(w.x - .7, w.x + .7, h.z) * (1. - smoothstep(w.y - .7, w.y + .7, h.z)) * smoothstep(w.z - .7, w.z + .7, h.y) * (1. - smoothstep(w.w - .7, w.w + .7, h.y));
  }
  float dap = .76 + .24 * sin(h.z * .21 + uWall.z * .8) * sin(h.y * .27 - uWall.z * .6 + h.z * .08);
  return mix(1., clamp(m, 0., 1.) * dap, uWall.y);
}
// shade: sky from above, warm floor bounce from below, and the cool soft light of the window wall from the left
vec3 ambient(vec3 N) { return mix(uBounceCol, uSkyCol, N.y * .5 + .5) + uFill.rgb * max(.4 - .6 * N.x, 0.); }
// what a shiny thing sees: the sunlit or shaded marble below, the dark vault above, and to the left the tall bright
// windows with their glazing bars
vec3 envLight(vec3 R, float beam) {
  vec3 L = normalize(uSunDir);
  vec3 e = mix(uBounceCol * 1.4 + uSunCol * beam * vec3(.2, .17, .13), uSkyCol * .6, smoothstep(-.12, .3, R.y));
  float wx = max(-R.x, 0.);
  float win = smoothstep(.1, .45, wx) * (1. - smoothstep(.3, .7, abs(R.y - .2)));
  vec2 q = vec2(R.z, R.y) / max(wx, .15);
  float bars = smoothstep(.03, .1, abs(fract(q.x * .8) - .5)) * smoothstep(.04, .14, abs(fract(q.y * 1.5 + .2) - .5));
  float pier = 1. - smoothstep(.3, .36, abs(fract(q.x * .4 + .3) - .5));                 // the piers between the windows stay dark
  e += uSkyCol * uFill.a * win * (.08 + .92 * pier) * (.35 + .65 * bars);
  return e + uSunCol * beam * 2.5 * smoothstep(.93, .995, dot(R, L));
}
float hash21(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y); }
float veins(vec2 p) {                                 // 0..1 darkening: long irregular veins, finer ones, soft clouds
  float w = vnoise(p * .11) * 2.;
  float a = 1. - smoothstep(0., .05, abs(vnoise(p * .3 + w * 1.7) - .5)), b = 1. - smoothstep(0., .035, abs(vnoise(p * .85 + 5. + w) - .5));
  return .28 * a * (.4 + .6 * vnoise(p * .5 + 3.)) + .1 * b + .07 * (vnoise(p * .21 + 9.) - .5);
}
`,tt={light:ze,solid:"",tea:""},De=`
${ze}
varying vec3 vLocal; varying vec3 vN; varying vec3 vView; varying vec3 vColor; varying vec3 vSurf; varying vec3 vObj;
#include <fog_pars_fragment>
vec3 cell(vec2 p) {                                   // hammer dimples: distance to the nearest facet centre, and its offset
  vec2 ip = floor(p), fp = fract(p); float best = 9.; vec2 off = vec2(0.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)); vec2 o = g + vec2(hash21(ip + g), hash21(ip + g + 17.3)) - fp; float d = dot(o, o);
    if (d < best) { best = d; off = o; }
  }
  return vec3(sqrt(best), off);
}
void main() {
  vec3 V = normalize(vView + vec3(1e-5));
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (dot(N, V) < 0.) N = -N;
  vec3 alb = vColor; float metal = vSurf.x, gloss = vSurf.y, pat = vSurf.z;
  if (pat > .5 && pat < 1.5) {                        // hammered, engraved copper (object space, so it turns with the tray)
    float r = length(vObj.xz);
    vec3 c = cell(vObj.xz * 6.5 + vObj.y * 6.);
    vec3 t1 = normalize(cross(N, vec3(.31, .2, .93)) + vec3(1e-4)); vec3 t2 = cross(N, t1);
    vec2 hq = vObj.xz * 6.5 + vObj.y * 6.; float hf = clamp(1.3 - 1.6 * length(fwidth(hq)), 0., 1.);
    N = normalize(N + (t1 * c.y + t2 * c.z) * .14 * hf * smoothstep(.0, .5, c.x));
    float ring = (1. - smoothstep(.0, .035, abs(fract(r * .62 + .5) - .5))) * step(r, 5.6);
    float petals = (1. - smoothstep(.0, .1, abs(sin(atan(vObj.z, vObj.x + (abs(vObj.x) < 1e-4 ? 2e-4 : 0.)) * 8.) * .5 - fract(r * .31) + .25))) * step(r, 1.9) * step(.45, r);
    alb *= 1. - .34 * max(ring, petals);
    alb *= .93 + .12 * vnoise(vObj.xz * 3.3 + 3.) + .12 * (vnoise(vObj.xz * .7) - .5);
    gloss *= 1. - .6 * max(ring, petals);
  } else if (pat > 1.5 && pat < 2.5) {                // marble: grey veins
    alb *= 1. - veins(vObj.xz + vObj.y * vec2(.7, .4)) - .04 * hash21(floor(vObj.xz * 9.));
  } else if (pat > 2.5 && pat < 3.5) {                // walnut: long grain
    float g = vnoise(vec2((vObj.x + vObj.z) * .3, vObj.y * 5.)) + .5 * vnoise(vec2((vObj.x - vObj.z) * .9, vObj.y * 17.));
    alb *= 2.1 * (.8 + .2 * g + .04 * sin(vObj.y * 43. + vObj.z * 3.));
  } else if (pat > 3.5) {                             // floor: 6 m marble slabs, grey veins, brass joint strips
    vec2 g = vObj.xz / 6., f = abs(fract(g) - .5); float joint = step(.4875, max(f.x, f.y));
    float hs = hash21(floor(g)); vec2 q = (hs > .5 ? vObj.xz : vObj.zx) + hs * 40.;
    alb *= (.92 + .08 * hash21(floor(g) + 7.)) * (1. - veins(q));
    alb = mix(alb, vec3(.6, .4, .16), joint); metal = joint; gloss = mix(gloss, .6, joint);
  }
  float beam = beamMask(vLocal);
  vec3 L = normalize(uSunDir), H = normalize(L + V + vec3(1e-5));
  float nlr = dot(N, L), nl = max(nlr, 0.), nh = max(dot(N, H), 0.);
  vec3 R = reflect(-V, N), env = envLight(R, beam);
  float nv = max(dot(N, V), 0.), f1 = 1. - nv, fres = f1 * f1 * f1;
  float sp = pow(nh, mix(10., 120., gloss)) * (.4 + 3.2 * gloss);
  // not metal: lit colour, a little of the room in the glaze
  vec3 col = alb * (uSunCol * nl * beam + ambient(N)) + vec3(.045) * (env * .12 * gloss + uSunCol * sp * beam * nl) + fres * gloss * .25 * env;
  // metal: a dark tinted mirror of the room (windows, vault, floor), a satin sheen where the sun is on it, a hot
  // highlight; the underside of the tray looks down into its own shadow
  float under = pat > .5 && pat < 1.5 ? 1. - smoothstep(-.12, .0, vObj.y) : 0.;
  vec3 F0 = min(alb * 1.25, vec3(1.)), F = F0 + (1. - F0) * fres * f1;
  float wrap = max(nlr * .4 + .6, 0.); wrap *= wrap;
  vec3 met = F * (env / (1. + env * 1.6)) * mix(1., .3, under) + alb * ambient(N) * mix(.08, .05, under)
    + F0 * uSunCol * beam * (wrap * mix(.11, .04, under) * (pat > .5 ? 1. : .6) + .12 * nh * nh * nh * nh + .35 * sp * nl + 5. * pow(nh, 240.) * nl);
  met += F0 * (uBounceCol * 1.4 + uSunCol * beam * vec3(.4, .34, .26)) * (1. - under) * .5 * clamp(1. - N.y, 0., 1.) * clamp(1. - N.y, 0., 1.);     // a face turned from the sky takes the glow of the sunlit marble
  col = mix(col, met, metal);
  if (dot(vView, vView) < 4.) discard;
  gl_FragColor = vec4(clamp(col, 0., 24.), 1.);
  #include <fog_fragment>
}`;tt.solid=De;const ot=`
${Le}
uniform mat4 uObj;
attribute vec3 color; attribute vec3 aSurf;
varying vec3 vColor; varying vec3 vSurf; varying vec3 vObj;
#include <fog_pars_vertex>
void main() {
  vec3 nb = normal;                                    // the tray's flat faces are very slightly dished, so the room's reflection sweeps across them
  if (aSurf.z > .5 && aSurf.z < 1.5 && abs(normal.y) > .9) nb = normalize(nb + vec3(position.x, 0., position.z) * (.05 * sign(normal.y)));
  vec3 P = (uObj * vec4(position, 1.)).xyz, N = mat3(uObj) * nb;
  vColor = color; vSurf = aSurf; vObj = position;
  ${Ee}
  #include <fog_vertex>
}`,at=`
attribute vec4 iSlot; attribute vec3 iP0; attribute vec4 iV0; attribute vec4 iW; attribute vec4 iQ; attribute vec4 iSl;
void flyer(in vec3 l0, in vec3 n0, out vec3 P, out vec3 N) {
  float yc = cos(iSl.z * 6.2832), ys = sin(iSl.z * 6.2832);
  vec3 l = vec3(l0.x * yc + l0.z * ys, l0.y, l0.z * yc - l0.x * ys), n = vec3(n0.x * yc + n0.z * ys, n0.y, n0.z * yc - n0.x * ys);
  if (uT <= iSlot.w) { P = (uTray * vec4(iSlot.xyz + l, 1.)).xyz; N = mat3(uTray) * n; return; }
  float dt = min(uT, iV0.w) - iSlot.w, ds = max(uT - iV0.w, 0.);
  vec3 C = iP0 + iV0.xyz * dt + vec3(0., -4.9, 0.) * dt * dt;
  vec3 v = rod(iW.xyz, dt, qrot(iQ, l)); N = rod(iW.xyz, dt, qrot(iQ, n));
  vec3 a = rod(iW.xyz, dt, qrot(iQ, vec3(0., 1., 0.)));
  vec3 tgt = vec3(0., a.y < 0. ? -1. : 1., 0.);
  vec3 kx = cross(a, tgt); float kl = length(kx);
  float s = 1. - exp(-3.2 * ds) * abs(cos(7.5 * ds + iSl.z * 6.));
  if (kl > 1e-3 && ds > 0.) { vec3 w = kx / kl * asin(clamp(kl, 0., 1.)) * s; v = rod(w, 1., v); N = rod(w, 1., N); }
  C.xz += iSl.xy * (1. - exp(-SLIDE_K * ds));
  C.y = mix(C.y, iW.w, ds > 0. ? s : 0.);
  P = C + v;
}`,mt=`
${Le}
${at}
attribute vec3 color; attribute vec3 aSurf;
varying vec3 vColor; varying vec3 vSurf; varying vec3 vObj;
#include <fog_pars_vertex>
void main() {
  vec3 P, N; flyer(position, normal, P, N);
  vColor = color; vSurf = aSurf; vObj = position;
  ${Ee}
  #include <fog_vertex>
}`,ht=`
${Le}
attribute vec4 aSlot; attribute vec3 aP0; attribute vec4 aV0; attribute vec4 aW; attribute vec4 aQ;
attribute vec3 aPc; attribute vec4 aPv; attribute vec4 aPw; attribute vec2 aInfo;
varying vec3 vInfo;
#include <fog_pars_vertex>
void main() {
  vec3 P, N;
  if (uT <= aSlot.w) { P = (uTray * vec4(aSlot.xyz + position, 1.)).xyz; N = mat3(uTray) * normal; }
  else {
    float tB = aV0.w, dt = min(uT, tB) - aSlot.w;
    vec3 G = aP0 + aV0.xyz * dt + vec3(0., -4.9, 0.) * dt * dt;
    vec3 a = rod(aW.xyz, dt, qrot(aQ, position));
    N = rod(aW.xyz, dt, qrot(aQ, normal));
    if (uT <= tB) P = G + a;
    else {
      vec3 pc = rod(aW.xyz, dt, qrot(aQ, aPc));
      float d2 = min(uT, aW.w) - tB, ds = max(uT - aW.w, 0.);
      vec3 C = G + pc + aPv.xyz * d2 + vec3(0., -4.9, 0.) * d2 * d2;
      C.xz += vec2(aPv.w, aPw.w) * (1. - exp(-SLIDE_K * ds));
      float ang = d2 + (1. - exp(-3. * ds)) * .12;
      P = C + rod(aPw.xyz, ang, a - pc); N = rod(aPw.xyz, ang, N);
    }
  }
  vInfo = vec3(aInfo, 0.);
  ${Ee}
  #include <fog_vertex>
}`,dt=`
${Le}
attribute vec4 iB; attribute vec4 iV; attribute vec4 iS; attribute vec3 iL;
varying vec3 vInfo;
#include <fog_pars_vertex>
void main() {
  float d = clamp(uT - iB.w, 0., iV.w - iB.w), ds = max(uT - iV.w, 0.);
  float show = smoothstep(0., .08, uT - iB.w);
  vec3 C = iB.xyz + iV.xyz * d + vec3(0., -4.9, 0.) * d * d;
  C.xz += iL.xy * (1. - exp(-SLIDE_K * ds));
  float ang = d + (1. - exp(-3. * ds)) * .1;
  vec3 P = C + rod(iS.xyz, ang, position * iS.w * show), N = rod(iS.xyz, ang, normal);
  vInfo = vec3(.3, iL.z, step(.5, fract(iL.z * 7.13)));
  ${Ee}
  #include <fog_vertex>
}`,nt=`
${ze}
uniform vec3 uTint; uniform vec3 uGold; uniform vec3 uGem; uniform vec4 uGlassP;   // opaque 0|1, rim band start, gem share, waist line
uniform float uT;
varying vec3 vLocal; varying vec3 vN; varying vec3 vView; varying vec3 vInfo;
#include <fog_pars_fragment>
void main() {
  vec3 V = normalize(vView + vec3(1e-5)), N = normalize(vN + vec3(0., 1e-5, 0.));
  float inside = dot(N, V) < 0. ? 1. : 0.; if (inside > .5) N = -N;
  float nv = max(dot(N, V), 0.), fres = (1. - nv) * (1. - nv);
  float beam = beamMask(vLocal);
  vec3 L = normalize(uSunDir), H = normalize(L + V + vec3(1e-5)), R = reflect(-V, N);
  float nl = max(dot(N, L), 0.);
  float laid = 1. - smoothstep(0., 1.2, uT);                                                               // the load at rest on its tray
  float sp = pow(max(dot(N, H), 0.), mix(70., 230., laid)) * beam;
  float glint = pow(max(dot(R, L), 0.), 10.) * beam * (.55 + .45 * sin(uWall.z * .9 + vInfo.y * 61.));     // one slow glint per shard
  glint *= mix(1., .2, laid);                                                           // the laid load is calm: with the sun behind the viewer the tea shows amber, not a white flare on every glass
  float back = .5 + .5 * max(dot(-V, L), 0.);                                                            // lit through from behind
  vec3 env = envLight(R, beam);
  vec3 col = env * (.10 + .9 * fres) + uSunCol * (sp * 2. + glint * .5 + fres * beam * back * .45) + uTint * (uSunCol * beam * .3 * back + ambient(N) * .7);
  float wl = pow(max(dot(N, normalize(vec3(-.85, .4, -.15) + V)), 0.), 60.);                               // the windows: one sharp line down the glass
  col += uSkyCol * uFill.a * .45 * wl * (1. - .45 * laid);
  float a = .16 + .7 * fres + sp + glint * .5 + .12 * beam + wl * .6 * (1. - .45 * laid);
  float gold = max(smoothstep(uGlassP.y, uGlassP.y + .015, vInfo.x), 1. - smoothstep(.004, .012, abs(vInfo.x - uGlassP.w)));
  vec3 gcol = uGold * (uSunCol * nl * beam * .4 + ambient(N) * .6) + uGold * env * .8 + uSunCol * sp * 1.6 + uGold * uSunCol * beam * (.28 + .9 * pow(max(dot(R, L), 0.), 4.));
  col = mix(col, gcol, gold); a = mix(a, 1., gold);
  float gem = vInfo.z * uGlassP.z;                                                                       // pomegranate seeds among the splinters
  col = mix(col, uGem * (uSunCol * beam * (.3 + .6 * back) + ambient(N) * 1.2 + vec3(.2)) + uSunCol * sp * 1.2, gem); a = mix(a, 1., gem);
  // an opaque shell (eggs): a sunlit side that keeps its cream, a terminator, and a shadow side in the blue of the shade of the
  // room, warmed from below by the floor and the copper
  vec3 shell = uTint * (uSunCol * (nl * .86 + .05) * beam + ambient(N) * mix(1.32, .98, beam) + uBounceCol * 1.1 * max(-N.y, 0.) * beam) * mix(1., .74, inside) + uSunCol * sp * .45
    + uSkyCol * uFill.a * .16 * pow(max(dot(R, normalize(vec3(-.9, .3, -.12))), 0.), 9.) + env * (.05 + fres * .22);
  col = mix(col, shell, uGlassP.x); a = mix(clamp(a, 0., 1.), 1., uGlassP.x);
  float dcam = length(vView); if (dcam < 2.2) discard; a *= mix(smoothstep(2.2, 4.5, dcam), 1., uGlassP.x);
  gl_FragColor = vec4(clamp(col, 0., 24.), a);
  #include <fog_fragment>
}`,pt=`
${Le}
${at}
attribute float aLv;
varying float vClip; varying vec2 vTopR;
#include <fog_pars_vertex>
void main() {
  vec3 P, N; flyer(position, normal, P, N);
  vTopR = vec2(normal.y, length(position.xz));
  float fill = 1. - smoothstep(iSlot.w + .03, iSlot.w + iSl.w, uT);
  vClip = aLv - fill * 1.001;
  ${Ee}
  #include <fog_vertex>
}`,Ke=`
uniform vec3 uTea; uniform vec3 uTeaP;       // x: milkiness (0 clear, 1 opaque white), y: ribbon width, z: glow of its own
// A clear liquid with the light coming through it: a dark stained edge, a glowing core thrown to the side away from the
// sun (as a lens throws it), one hard highlight line from the sun and a long cool one from the windows. core: 0 at the
// silhouette, 1 through the middle. Milk is a glossy white solid with the same two highlights.
vec3 teaShadeK(vec3 N, vec3 V, vec3 p, float core, float specPow) {      // specPow: how tight the sun's highlight is (a ribbon 90, the tea in a glass 220)
  float beam = beamMask(p); vec3 L = normalize(uSunDir), H = normalize(L + V + vec3(1e-5));
  float nv = max(dot(N, V), 0.);
  vec3 Lp = L - V * dot(L, V); Lp = Lp / max(length(Lp), 1e-3);
  float lens = (1. - smoothstep(-.5, .3, dot(N, Lp))) * smoothstep(.08, .5, core), front = max(dot(V, L), 0.);    // front: the sun behind the viewer lights the body of the tea
  // a red with no green in it (sherbet) keeps its depth: the lift toward white that suits amber would turn it candy pink
  float warmK = smoothstep(.03, .2, uTea.g / max(uTea.r, 1e-3));
  vec3 edge = uTea * mix(.34, .5, warmK), glowC = mix(uTea * vec3(1.9, 1.1, 1.3), mix(uTea, sqrt(max(uTea, vec3(0.))), .5) * vec3(1., .82, .6) + .05, warmK);
  vec3 soft = ambient(-V) * .9 + uFill.rgb * 1.6 + vec3(uTeaP.z * .55);
  vec3 clear = edge * (soft + uSunCol * beam * .28) * (.55 + .45 * core) + glowC * (uSunCol * beam * (.42 * lens + .13 * core) + soft * (.3 + .7 * lens) * core * 1.1)
    + uTea * uSunCol * beam * (.55 * front * core);
  vec3 milk = uTea * (ambient(N) * 1.3 + uSunCol * beam * (.25 + .75 * max(dot(N, L), 0.)) + vec3(uTeaP.z * .5)) * mix(vec3(.42, .5, .66), vec3(1.), smoothstep(0., .75, core));   // a white rope needs its shaded edge to read on white marble
  vec3 Hw = normalize(vec3(-.85, .4, -.15) + V);
  vec3 col = mix(clear, milk, uTeaP.x) + uSunCol * beam * pow(max(dot(N, H), 0.), specPow) * (1.6 + uTeaP.x)
    + uSkyCol * uFill.a * (.32 + .3 * uTeaP.x) * pow(max(dot(N, Hw), 0.), 48.)
    + envLight(reflect(-V, N), beam) * (1. - nv) * (1. - nv) * .16;
  return max(col, 0.);
}
vec3 teaShade(vec3 N, vec3 V, vec3 p, float core) { return teaShadeK(N, V, p, core, 90.); }`;tt.tea=Ke;const wt=`
${ze}
${Ke}
uniform float uPlugR;
varying vec3 vLocal; varying vec3 vN; varying vec3 vView; varying float vClip; varying vec2 vTopR;
#include <fog_pars_fragment>
void main() {
  if (vClip > 0.) discard;
  vec3 V = normalize(vView + vec3(1e-5)), N = normalize(vN + vec3(0., 1e-5, 0.)); if (dot(N, V) < 0.) N = -N;
  float nv = max(dot(N, V), 0.), top = step(.5, vTopR.x), r = vTopR.y / max(uPlugR, 1e-3);
  // the surface of the tea, seen from above: deep in the middle, a bright meniscus under the glass
  float core = mix(nv, .35 + .65 * smoothstep(.55, .98, r), top);
  vec3 col = teaShadeK(N, V, vLocal, core, 220.);
  col = mix(col, col * .8 + uTea * uSkyCol * 1.2, top * (1. - smoothstep(.3, .9, r)) * (1. - uTeaP.x));
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,yt=`
${Le}
uniform vec3 uTeaP; uniform vec4 uTeaQ;      // uTeaQ: height of the rim above the vessel's centre, -, -, -
attribute vec4 aE; attribute vec4 aEv; attribute vec4 aEn; attribute vec4 aEvn; attribute vec4 aPool; attribute vec3 aSide;
varying vec3 vS; varying vec3 vF; varying vec2 vX;
#include <fog_pars_vertex>
vec3 arc(vec3 R, float s) { return vec3(mix(R.x, aPool.x, s), R.y - (R.y - .06) * s * s, mix(R.z, aPool.y, s)); }
void main() {
  float dt = clamp(uT, aE.w, aEv.w) - aE.w;
  vec3 R = aE.xyz + aEv.xyz * dt + vec3(0., -4.9, 0.) * dt * dt + rod(aEn.xyz, dt, qrot(aEvn, vec3(0., uTeaQ.x, 0.)));
  float head = clamp((uT - aPool.z) / aEn.w, 0., 1.), tail = clamp((uT - aPool.w) / aEn.w, 0., 1.);
  float s0 = mix(tail, head, aSide.y);
  vec3 P0 = arc(R, s0), P1 = arc(R, s0 + .02);
  vec4 wp = modelMatrix * vec4(P0, 1.);
  vec3 t = mat3(modelMatrix) * (P1 - P0), toCam = cameraPosition - wp.xyz;
  vec3 s = cross(t, toCam); s = s / max(length(s), 1e-4);
  vec3 f = cross(s, t); f = f / max(length(f), 1e-4);
  float len = head - tail, f1 = aSide.y;
  float prof = mix(1.2, .5, f1) + .4 * exp(-36. * (1. - f1) * (1. - f1)) * step(head, .999);     // thick at the rim, a thread toward the floor, a bead at its head
  prof *= 1. + .22 * sin(f1 * 19. + aSide.z * 40. + uT * 5.);
  float w = .16 * uTeaP.y * prof * smoothstep(0., .03, len) * mix(1., smoothstep(0., .08, f1), step(.001, tail));   // the upper end tapers once it has left the rim
  w = max(w, length(toCam) * .0011 * step(.02, len));                                               // never under a pixel and a half
  wp.xyz += s * aSide.x * w;
  vLocal = P0; vView = toCam; vS = s; vF = f; vX = vec2(aSide.x, f1); vN = f;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,xt=`
${ze}
${Ke}
varying vec3 vLocal; varying vec3 vN; varying vec3 vView; varying vec3 vS; varying vec3 vF; varying vec2 vX;
#include <fog_pars_fragment>
void main() {
  float x = clamp(vX.x, -1., 1.), core = sqrt(max(1. - x * x, 0.));
  vec3 N = normalize(vS * x + vF * core + vec3(0., 1e-5, 0.));
  float near = smoothstep(2.5, 7., length(vView));
  gl_FragColor = vec4(teaShade(N, normalize(vView + vec3(1e-5)), vLocal, core), mix(mix(.92, .74, core), 1., uTeaP.x) * near);
  #include <fog_fragment>
}`,gt=`
uniform float uT;
attribute vec4 iPud; attribute float iSeed;
varying vec3 vLocal; varying vec3 vView; varying vec2 vUv2; varying vec2 vGrow;
#include <fog_pars_vertex>
void main() {
  float dt = max(uT - iPud.z, 0.);
  vGrow = vec2(.62 * (1. - exp(-2.4 * dt)) + .38 * (1. - exp(-.28 * dt)), iSeed);
  vUv2 = position.xz * 1.25;
  vec3 P = vec3(iPud.x + vUv2.x * iPud.w, .035, iPud.y + vUv2.y * iPud.w);
  vLocal = P; vec4 wp = modelMatrix * vec4(P, 1.); vView = cameraPosition - wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,bt=`
${ze}
uniform vec3 uTea; uniform vec3 uTeaP;
varying vec3 vLocal; varying vec3 vView; varying vec2 vUv2; varying vec2 vGrow;
#include <fog_pars_fragment>
void main() {
  float r = length(vUv2), ang = atan(vUv2.y, vUv2.x + (abs(vUv2.x) < 1e-4 ? 2e-4 : 0.)), sd = vGrow.y * 6.283;
  float edge = vGrow.x * (.74 + .15 * sin(ang * 3. + sd * 3.) + .08 * sin(ang * 7. - sd * 5.) + .045 * sin(ang * 13. + sd * 9.));
  float a = 1. - smoothstep(edge - .05, edge, r);
  vec2 cellp = vUv2 * 5. + sd; vec2 cf = fract(cellp) - .5; float hs = hash21(floor(cellp));        // flung drops round the pool
  a = max(a, step(.72, hs) * (1. - smoothstep(.03, .07 + .1 * hs, length(cf))) * step(r, edge + .28) * step(.02, vGrow.x));
  if (a < .02) discard;
  float depth = clamp((edge - r) / max(edge, 1e-3), 0., 1.), beam = beamMask(vLocal);
  vec3 V = normalize(vView + vec3(1e-5)), L = normalize(uSunDir), up = vec3(0., 1., 0.);
  vec3 body = mix(sqrt(uTea) * 1.05, uTea * .8, smoothstep(0., .5, depth));
  body = mix(body, uTea, uTeaP.x);
  vec3 col = body * (ambient(up) * 1.3 + uSunCol * beam * mix(.36, .3, uTeaP.x) + vec3(uTeaP.z * .6));
  float fres = .04 + .96 * pow(1. - max(V.y, 0.), 4.);
  col += envLight(reflect(-V, up), beam) * fres * .6;
  col += uSkyCol * .45 * (1. - smoothstep(.0, .1, abs(depth - .06)));                                        // meniscus
  gl_FragColor = vec4(max(col, 0.), a * mix(.86, .97, uTeaP.x));
  #include <fog_fragment>
}`,St=`
uniform float uT;
attribute vec4 iTr; attribute vec3 iTr2;
varying vec3 vLocal; varying vec3 vSoft;
#include <fog_pars_vertex>
void main() {
  float ds = max(uT - iTr2.x, 0.), f = 1. - exp(-${He.toFixed(2)} * ds);
  vec2 sl = iTr.zw; float len = length(sl); vec2 dir = sl / max(len, 1e-4), perp = vec2(-dir.y, dir.x);
  vec2 xz = iTr.xy + dir * (len * f * position.x + .25 * (position.x - .5) * 2. * step(.001, f)) + perp * position.z * iTr2.y;
  vec3 P = vec3(xz.x, .02, xz.y);
  vSoft = vec3(position.x, position.z * 2., smoothstep(0., .4, ds) * (.55 + .45 * exp(-.25 * ds)));
  vLocal = P; vec4 mvPosition = modelViewMatrix * vec4(P, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,zt=`
uniform mat4 uObj; uniform float uFade;
varying vec3 vLocal; varying vec3 vSoft;
#include <fog_pars_vertex>
void main() {
  vec3 P = (uObj * vec4(position, 1.)).xyz;
  vSoft = vec3(.5, position.z * 2., uFade * (1. - 4. * (position.x - .5) * (position.x - .5)));
  vLocal = P; vec4 mvPosition = modelViewMatrix * vec4(P, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Xe=`
${ze}
uniform vec4 uSoftCol; uniform float uSoftBeam;
varying vec3 vLocal; varying vec3 vSoft;
#include <fog_pars_fragment>
void main() {
  float across = clamp(1. - vSoft.y * vSoft.y, 0., 1.);
  float a = uSoftCol.a * across * across * vSoft.z * smoothstep(0., .12, vSoft.x) * (1. - smoothstep(.9, 1., vSoft.x));
  float beam = beamMask(vLocal);
  a *= mix(1., .25 + .75 * beam, uSoftBeam);
  gl_FragColor = vec4(uSoftCol.rgb * (ambient(vec3(0., 1., 0.)) + uSunCol * beam * .3), a);
  #include <fog_fragment>
}`,Mt=`
uniform float uT; uniform vec3 uSunDir;
attribute vec4 iA; attribute vec4 iBv; attribute vec3 iC;
varying vec3 vLocal; varying vec3 vSoft;
#include <fog_pars_vertex>
void main() {
  float d2 = clamp(uT - iA.w, 0., iBv.w - iA.w), ds = max(uT - iBv.w, 0.);
  vec3 C = iA.xyz + iBv.xyz * d2 + vec3(0., -4.9, 0.) * d2 * d2;
  C.xz += iC.xy * (1. - exp(-${He.toFixed(2)} * ds));
  float h = max(C.y, 0.), sz = iC.z * (1. + h * .3);
  vec2 off = -uSunDir.xz / max(uSunDir.y, .05) * (h + .1);
  vec3 P = vec3(C.x + off.x + (position.x - .7) * sz * 2.2, .025, C.z + off.y + position.z * sz);
  float along = 1. - 4. * (position.x - .5) * (position.x - .5);
  vSoft = vec3(.5, position.z * 2., step(iA.w, uT) * (1. - smoothstep(0., 3., h)) * along);
  vLocal = P; vec4 mvPosition = modelViewMatrix * vec4(P, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Pt=`
uniform float uT; uniform mat4 uTray; uniform float uTime;
attribute vec4 iSt; attribute vec2 iSt2;
varying vec3 vLocal; varying vec3 vSoft;
#include <fog_pars_vertex>
void main() {
  float ph = fract(iSt2.x - uTime * iSt2.y);
  vec3 c = iSt.xyz + vec3(sin(iSt2.x * 40. + ph * 5.) * .35 * ph, .15 + 2.6 * ph * ph, cos(iSt2.x * 27. + ph * 4.) * .35 * ph);
  vec3 P = (uTray * vec4(c, 1.)).xyz;
  float size = (.3 + 1.1 * ph) * step(uT, iSt.w);
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.); mvPosition.xy += position.xy * size;
  vSoft = vec3(position.xy * 2., sin(3.1416 * ph) * (1. - smoothstep(iSt.w - .25, iSt.w, uT)));
  vLocal = P; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Vt=`
${ze}
varying vec3 vLocal; varying vec3 vSoft;
#include <fog_pars_fragment>
void main() {
  float r2 = dot(vSoft.xy, vSoft.xy), a = clamp(1. - r2, 0., 1.); a = a * a * vSoft.z * .2;
  float beam = beamMask(vLocal);
  gl_FragColor = vec4(vec3(.82, .85, .9) * (ambient(vec3(0., 1., 0.)) * 1.6 + uSunCol * beam * .45), a);
  #include <fog_fragment>
}`;function qe(){const a=[],i=[],u=[],c=[],T=(l,R,d,M,r,n,w,b)=>{a.push(l,R,d),i.push(M,r,n),u.push(w[0],w[1],w[2]),c.push(b[0],b[1],b[2])},f={lathe(l,R,d={}){const M=l.length,r=d.sign??1,n=d.m||null,w=d.color,b=d.surf||[0,.5,0],x=d.rmod||null,A=new e.Vector3,V=new e.Vector3,p=[];for(let S=0;S<M;S++){const k=l[Math.max(S-1,0)],N=l[Math.min(S+1,M-1)];let h=N[0]-k[0],g=N[1]-k[1];const m=Math.hypot(h,g)||1;h/=m,g/=m;const O=[];for(let B=0;B<=R;B++){const P=B%R/R*Math.PI*2,W=Math.cos(P),$=Math.sin(P),z=l[S][0]*(x?x(P,S,l[S][0]):1);A.set(z*W,l[S][1],z*$),V.set(-g*W*r,h*r,-g*$*r),n&&(A.applyMatrix4(n),V.transformDirection(n)),O.push([A.x,A.y,A.z,V.x,V.y,V.z,typeof w=="function"?w(S,P,l[S][0]):w])}p.push(O)}const F=(S,k,N)=>{for(const h of[S,k,N])T(h[0],h[1],h[2],h[3],h[4],h[5],h[6],b)};for(let S=0;S<M-1;S++)for(let k=0;k<R;k++){const N=p[S][k],h=p[S][k+1],g=p[S+1][k+1],m=p[S+1][k];l[S][0]>1e-6&&F(N,h,g),l[S+1][0]>1e-6&&F(N,g,m)}return f},tube(l,R,d,M,r,n=1){const w=l.length,b=[],x=new e.Vector3,A=new e.Vector3,V=new e.Vector3,p=new e.Vector3;for(let F=0;F<w;F++){x.subVectors(l[Math.min(F+1,w-1)],l[Math.max(F-1,0)]).normalize(),p.set(0,1,0),Math.abs(x.y)>.9&&p.set(1,0,0),A.crossVectors(p,x).normalize(),V.crossVectors(x,A);const S=R(F/(w-1)),k=[];for(let N=0;N<=d;N++){const h=N%d/d*Math.PI*2,g=Math.cos(h),m=Math.sin(h)*n,O=A.x*g+V.x*m,B=A.y*g+V.y*m,P=A.z*g+V.z*m,W=Math.hypot(O,B,P)||1;k.push([l[F].x+O*S,l[F].y+B*S,l[F].z+P*S,O/W,B/W,P/W])}b.push(k)}for(let F=0;F<w-1;F++)for(let S=0;S<d;S++){const k=b[F][S],N=b[F][S+1],h=b[F+1][S+1],g=b[F+1][S];for(const m of[k,N,h,k,h,g])T(m[0],m[1],m[2],m[3],m[4],m[5],M,r)}return f},slab(l,R,d,M,r,n,w,b,x){const A=M/2,V=r/2,p=n/2,F=w,S=[[A-F,p-F,-V],[A,p,-V+F],[A,p,V-F],[A-F,p-F,V]],k=g=>[[-g[0],g[2],-g[1]],[g[0],g[2],-g[1]],[g[0],g[2],g[1]],[-g[0],g[2],g[1]]],N=(g,m,O,B)=>{const P=[m[0]-g[0],m[1]-g[1],m[2]-g[2]],W=[B[0]-g[0],B[1]-g[1],B[2]-g[2]];let $=P[1]*W[2]-P[2]*W[1],z=P[2]*W[0]-P[0]*W[2],s=P[0]*W[1]-P[1]*W[0];const v=Math.hypot($,z,s)||1;$/=v,z/=v,s/=v;for(const G of[g,m,O,g,O,B])T(l+G[0],R+G[1],d+G[2],$,z,s,typeof b=="function"?b(l+G[0],R+G[1],d+G[2]):b,x)},h=S.map(k);for(let g=0;g<3;g++)for(let m=0;m<4;m++)N(h[g][m],h[g+1][m],h[g+1][(m+1)%4],h[g][(m+1)%4]);return N(h[3][0],h[3][3],h[3][2],h[3][1]),N(h[0][0],h[0][1],h[0][2],h[0][3]),f},put:T,get triangles(){return a.length/9},build(){const l=new e.BufferGeometry;return l.setAttribute("position",new e.Float32BufferAttribute(a,3)),l.setAttribute("normal",new e.Float32BufferAttribute(i,3)),l.setAttribute("color",new e.Float32BufferAttribute(u,3)),l.setAttribute("aSurf",new e.Float32BufferAttribute(c,3)),l}};return f}const ae=a=>{const i=new e.Color(a);return[i.r,i.g,i.b]},Me=(a,i,u)=>[ke(a[0],i[0],u),ke(a[1],i[1],u),ke(a[2],i[2],u)],ue=(a,i)=>[a[0]*i,a[1]*i,a[2]*i];async function At(a,i,u){const c=qe(),T=Me(ue(ae(u[2]),1.4),ae("#D99A6C"),.35),f=Me(ae(u[3]),ae(u[0]),.35),l=i.pick([14,16,18]),R=[[0,.1],[.5,.1],[.62,.04],[1.9,.02],[2,.06],[2.1,.02],[3.6,.02],[5.3,.02],[5.45,.06],[5.62,.34],[5.85,.47],[6,.45],[6.08,.36],[6,.05],[5.8,-.1],[5.2,-.14],[4.6,-.14],[4.5,-.21],[4.3,-.21],[4.2,-.14],[2,-.14],[0,-.14]];c.lathe(R,128,{sign:1,surf:[1,.55,1],rmod:(r,n,w)=>w>5.4?1+.03*Math.pow(Math.abs(Math.sin(r*l*.5)),.6)-.012:1,color:(r,n,w)=>r<=1?Me(T,f,.6):r>=9&&r<=12?Me(T,ae(u[0]),.22):r>=14?ue(T,.55):ue(T,.92+.12*Math.sin(n*3+w))}),await a.yield();const d=new e.Vector3(0,7.1,0);for(let r=0;r<3;r++){const n=r/3*Math.PI*2+.5,w=new e.Vector3(Math.cos(n)*5.55,.4,Math.sin(n)*5.55),b=[];for(let x=0;x<=30;x++){const A=x/30,V=Math.pow(A,.62);b.push(new e.Vector3(w.x*(1-V)*(1+.1*Math.sin(A*Math.PI)),ke(w.y,d.y,Math.pow(A,1.25)),w.z*(1-V)*(1+.1*Math.sin(A*Math.PI))))}c.tube(b,x=>.06+.055*Math.pow(Math.abs(Math.sin(x*34)),.7),5,f,[1,.75,0]),c.lathe([[0,.3],[.2,.22],[.26,.08],[.2,-.04],[0,-.06]],8,{sign:1,color:f,surf:[1,.75,0],m:new e.Matrix4().makeTranslation(w.x,w.y,w.z)})}c.lathe([[0,.45],[.3,.3],[.38,0],[.24,-.3],[.1,-.5],[0,-.52]],10,{sign:1,color:f,surf:[1,.75,0],m:new e.Matrix4().makeTranslation(0,7.1,0)});const M=[];for(let r=0;r<=20;r++){const n=r/20*Math.PI*2;M.push(new e.Vector3(Math.cos(n)*.62,8.1+Math.sin(n)*.62,0))}return c.tube(M,()=>.1,6,f,[1,.8,0]),c}function Ct(a,i,u){const c=qe(),T=ue(ae(a[0]),.9),f=ae(u||(i==="milk"?a[1]:"#A3342A")),l=Me(ae(a[3]),ae(a[0]),.3),R=[[0,.05],[.34,.05],[.38,.075],[.4,.08],[.58,.135],[.6,.14],[.69,.18],[.72,.19],[.73,.165],[.5,.04],[.3,0],[0,0]];return c.lathe(R,16,{sign:1,surf:[0,.85,0],m:new e.Matrix4().makeScale(.94,.94,.94),color:(d,M)=>d===3||d===4?Math.sin(M*8)>.2||d===3?f:Me(f,T,.75):d===7||d===8?l:T}),c}function Tt(a){const i=qe(),u=Me(ae(a[3]),ae(a[0]),.45),c=[];for(let T=0;T<=10;T++){const f=T/10;c.push(new e.Vector3(.3+.62*f,.2+.1*f-.05*Math.sin(Math.min(f/.3,1)*Math.PI),0))}return i.tube(c,T=>T<.3?.012+.11*Math.sin(Math.PI*Math.min(T/.3,1)*.95):.028+.03*de(.6,1,T),6,u,[1,.8,0],.35),i}const rt={tea:{h:1.5,vs:[0,.07,.2,.36,.5,.62,.78,.92,1],rs:[.3,.365,.39,.34,.27,.275,.35,.425,.47],closed:!1,rim:.93,waist:.56,fillTop:.86},milk:{h:1.3,vs:[0,.04,.14,.3,.48,.66,.82,.93,1],rs:[0,.19,.345,.45,.48,.43,.32,.19,0],closed:!0,rim:2,waist:-1,fillTop:.6},sherbet:{h:1.9,vs:[0,.04,.2,.42,.56,.68,.82,.94,1],rs:[.3,.36,.37,.36,.31,.16,.125,.135,.19],closed:!1,rim:.955,waist:.6,fillTop:.6}};function Fe(a,i,u){const c=Math.max(i*i+2*pe*(a-u),0);return Math.max((i+Math.sqrt(c))/pe,.02)}function Lt(a,i,u,c){const T=[[1.6,7],[3.2,13],[4.72,20]],f=[],l=new e.Vector3,R=new e.Quaternion,d=new e.Vector3,M=new e.Vector3,r=new e.Quaternion,n=new e.Vector3,w=.1,b=.995,x=(m,O,B)=>(i.pose(m,l,R),B.copy(O).applyQuaternion(R).add(l)),A=(m,O,B)=>{const P=x(m,O,new e.Vector3),W=R.clone();x(m+.02,O,d),x(m-.02,O,M);const $=d.clone().sub(M).multiplyScalar(25).add(B);return{p0:P,v0:$,q0:W}},V=()=>{const m=a.range(-1,1),O=a.range(0,Math.PI*2),B=Math.sqrt(1-m*m);return new e.Vector3(B*Math.cos(O),m,B*Math.sin(O))},p=(m,O,B,P,W)=>(i.pose(O,l,r),new e.Vector3(m.x,0,m.z).normalize().applyQuaternion(r).multiplyScalar(B).addScaledVector(new e.Vector3(0,1,0).applyQuaternion(r),P).add(new e.Vector3(a.range(-.8,.8),0,W))),F=m=>{let O=1,B=-9;for(let P=1;P<=2.9;P+=.04){x(P+.02,m,d),x(P-.02,m,M),d.sub(M),x(P+.02,n,M),d.sub(M),x(P-.02,n,M),d.add(M);const W=(d.x*w+d.z*b)/(Math.hypot(d.x,d.z)||1)-.1*(P-1);W>B&&(B=W,O=P)}return O},S=m=>{let O=1e9;if(!c)return O;for(const B of c){if(B.T<m.tL||B.T>m.tB)continue;const P=B.T-m.tL;O=Math.min(O,Math.hypot(m.p0.x+m.v0.x*P-B.p.x,m.p0.y+m.v0.y*P-.5*pe*P*P-B.p.y,m.p0.z+m.v0.z*P-B.p.z))}return O},k=u.closed?a.int(33,37):a.int(22,27),N=a.shuffle([...Array(40).keys()]),h=new Set(N.slice(0,k));let g=0;for(let m=0;m<T.length;m++){const[O,B]=T[m],P=a.range(0,6.28);for(let W=0;W<B;W++,g++){const $=P+W/B*Math.PI*2,z=Math.cos($)*O,s=Math.sin($)*O,v=new e.Vector3(z,.02,s),G=new e.Vector3(z,.07+u.h*.5,s),I=F(G);let t=null,q=-1;for(let ve=0;ve<10&&q<7.5;ve++){const le=ce(I+a.range(-.14,.14),.98,2.95),Y={i:g,slotS:v,slotG:G,tL:le,yaw:$/(Math.PI*2),...A(le,G,p(G,le,a.range(.2,1.4),a.range(.9,2.7)+.5*ve*(ve&1),a.range(0,3)))};Y.v0.x=Math.min(Y.v0.x,-2.5),Y.w=V().multiplyScalar(a.range(1.2,3));const se=Fe(Y.p0.y,Y.v0.y,.8);Y.v0.x=Math.min(Y.v0.x,-(Y.p0.x-2.5)/(se*.8)),Y.air=h.has(g);const K=Y.v0.x<-.5?(Y.p0.x-2.5)/-Y.v0.x:9;Y.tB=Y.tL+(Y.air?u.closed?Math.min(Math.max(se*a.range(.1,.3),.3),se):Math.min(Math.max(se*a.range(.3,.72),.7,K),se):se);const fe=S(Y);fe>q&&(q=fe,t=Y)}t.pour=Math.min(a.range(.7,1.05),t.tB-t.tL-.04);const X=t.tB-t.tL;t.G=t.p0.clone().addScaledVector(t.v0,X),t.G.y-=.5*pe*X*X,t.vB=t.v0.clone(),t.vB.y-=pe*X,t.qB=new e.Quaternion().setFromAxisAngle(t.w.clone().normalize(),t.w.length()*X).multiply(t.q0);const oe=t.tL,H=(ve,le,Y,se)=>{const K={slot:ve,tL:le,...A(le,ve,p(ve,le,a.range(.2,1.6),a.range(.2,1.3),a.range(0,3)))};K.w=V().multiplyScalar(a.range(2,5));const fe=Fe(K.p0.y,K.v0.y,.45);K.tLand=le+fe,K.v0.x=Math.min(K.v0.x,-2.5,-(K.p0.x-2.5)/(fe*.8));const Re=new e.Vector3(0,1,0).applyQuaternion(new e.Quaternion().setFromAxisAngle(K.w.clone().normalize(),K.w.length()*fe).multiply(K.q0));K.rest=Re.y<0?se:Y;const _e=a.range(.1,.25);return K.slide=[K.v0.x*_e,K.v0.z*_e],K.seed=a(),K};t.saucer=H(v,oe+a.range(.06,.22),0,.19),t.spoon=H(v,oe+a.range(.02,.16),-.17,.3),t.spoon.seed=Math.round(t.spoon.seed*3)+1-$/(Math.PI*2)+a.range(-.06,.06);const Q=u.closed?t.tB+.01:t.tL+.05,J=u.closed?t.tB+.5:t.tL+t.pour,re=Math.min(Q+.35*(J-Q),t.tB)-t.tL,he=t.p0.y+t.v0.y*re-.5*pe*re*re,Ae=u.closed?Math.max(.8*Math.sqrt(2*Math.max(he,.5)/pe),.3):a.range(.5,.8),ge=a.range(-3,3),Ce=u.closed?a.range(-3.5,3.5):0;t.tS=Q,t.tE=J,t.tau=Ae,t.pool=[ce(t.p0.x+t.v0.x*(re+.5*Fe(he,0,.05))+ge,-25,3.2),t.p0.z+t.v0.z*re+Ce],t.puddle={x:t.pool[0],z:t.pool[1],t:Q+Ae,r:a.range(2,3.9),seed:a()},f.push(t)}}return{glasses:f,randDir:V}}async function Ft(a,i,u,c){const l=c.closed?6:24,R=Ge(c.vs,c.rs),d=440+(c.closed?0:20),M=u.glasses.length*d*3,r={position:new Float32Array(M*3),normal:new Float32Array(M*3),aSlot:new Float32Array(M*4),aP0:new Float32Array(M*3),aV0:new Float32Array(M*4),aW:new Float32Array(M*4),aQ:new Float32Array(M*4),aPc:new Float32Array(M*3),aPv:new Float32Array(M*4),aPw:new Float32Array(M*4),aInfo:new Float32Array(M*2)};let n=0;const w=new e.Vector3,b=new e.Vector3,x=new e.Vector3;for(const p of u.glasses){const F=[],S=[],k=[],N=[];for(let s=0;s<=11;s++)for(let v=0;v<20;v++){const G=s===0||s===11,I=ce((s+(G?0:i.range(-.32,.32)))/11,0,1),t=(v+(G?0:i.range(-.32,.32)))/20*Math.PI*2,q=Math.max(R(I),0),X=R(Math.min(I+.01,1))-R(Math.max(I-.01,0)),oe=c.h*(Math.min(I+.01,1)-Math.max(I-.01,0)),H=Math.hypot(X,oe)||1;F.push([q*Math.cos(t),(I-.5)*c.h,q*Math.sin(t)]),S.push([oe/H*Math.cos(t),-X/H,oe/H*Math.sin(t)]),k.push(I),N.push(t)}const h=[];for(let s=0;s<11;s++)for(let v=0;v<20;v++){const G=s*20+v,I=s*20+(v+1)%20,t=(s+1)*20+(v+1)%20,q=(s+1)*20+v;v+s&1?h.push([G,I,t],[G,t,q]):h.push([G,I,q],[I,t,q])}if(!c.closed){F.push([0,-.5*c.h+.03,0]),S.push([0,-1,0]),k.push(0),N.push(0);const s=F.length-1;for(let v=0;v<20;v++)h.push([v,(v+1)%20,s])}const g=[];if(!c.closed)for(let s=0;s<4;s++)for(let v=0;v<6;v++)g.push([(v+i.range(.1,.9)+s*.5)/6*Math.PI*2,(s+i.range(.15,.85))/4]);const m=i.range(0,6.28),O=i.range(.42,.58),B=s=>O+.05*Math.sin(3*s+m)+.035*Math.sin(8*s-2*m),P=[];if(c.closed)for(let s=0;s<4;s++){const v=m+(s+i.range(-.25,.25))*Math.PI/2;P.push([v,B(v)+i.range(-.03,.03),i.range(.14,.2)])}const W=new Uint8Array(h.length),$=[],z=new Float32Array(l);for(let s=0;s<l;s++)$.push([0,0,0]);for(let s=0;s<h.length;s++){const v=h[s];let G=0,I=0,t=0,q=0;for(const Q of v)G+=F[Q][0],I+=F[Q][1],t+=F[Q][2],q+=k[Q];G/=3,I/=3,t/=3,q/=3;const X=Math.atan2(t,G+1e-9);let oe=1e9,H=0;if(c.closed){H=q>B(X)?1:0;for(let Q=0;Q<4;Q++){let J=Math.abs(X-P[Q][0])%(Math.PI*2);J>Math.PI&&(J=Math.PI*2-J),Math.hypot(J*.45,(q-P[Q][1])*c.h)<P[Q][2]&&(H=2+Q)}}else for(let Q=0;Q<l;Q++){let J=Math.abs(X-g[Q][0])%(Math.PI*2);J>Math.PI&&(J=Math.PI*2-J);const re=(q-g[Q][1])*c.h,he=J*J*.12+re*re;he<oe&&(oe=he,H=Q)}W[s]=H,$[H][0]+=G,$[H][1]+=I,$[H][2]+=t,z[H]++}await a.yield(),p.pieces=[];for(let s=0;s<l;s++){const v=Math.max(z[s],1),G=[$[s][0]/v,$[s][1]/v,$[s][2]/v];x.set(G[0],G[1],G[2]).applyQuaternion(p.qB);const I=p.G.clone().add(x);x.normalize();const t=p.vB.clone(),q=c.closed&&s<2,X=q?.42:1;p.air?t.addScaledVector(x,i.range(1.5,6)*X).addScaledVector(u.randDir(),i.range(0,2.5)*X):(t.x*=.6,t.z*=.6,t.y=i.range(1,5.5),x.y=0,t.addScaledVector(x,i.range(3,11)*X).addScaledVector(u.randDir(),1.5),t.y=Math.max(t.y,1));let oe=p.tB+Fe(I.y,t.y,Math.min(q?.3:.14,I.y));const H=i.range(.22,.6),Q=u.randDir().multiplyScalar(q?i.range(.8,2.6):i.range(2,7));I.x+t.x*(oe-p.tB)*(1+H)>4.6&&(t.x=-Math.abs(t.x)*.6-Math.max(I.x-4,0)/Math.max(oe-p.tB,.2));const J=oe-p.tB;p.pieces.push({cB:[I.x,I.y,I.z],tB:p.tB,pc:G,pv:t,pw:Q,tLand:oe,slide:[t.x*H,t.z*H],seed:i(),land:[I.x+t.x*J,I.z+t.z*J]})}for(let s=0;s<h.length;s++){const v=p.pieces[W[s]];for(const G of h[s])r.position.set(F[G],n*3),r.normal.set(S[G],n*3),r.aSlot[n*4]=p.slotG.x,r.aSlot[n*4+1]=p.slotG.y,r.aSlot[n*4+2]=p.slotG.z,r.aSlot[n*4+3]=p.tL,r.aP0[n*3]=p.p0.x,r.aP0[n*3+1]=p.p0.y,r.aP0[n*3+2]=p.p0.z,r.aV0[n*4]=p.v0.x,r.aV0[n*4+1]=p.v0.y,r.aV0[n*4+2]=p.v0.z,r.aV0[n*4+3]=p.tB,r.aW[n*4]=p.w.x,r.aW[n*4+1]=p.w.y,r.aW[n*4+2]=p.w.z,r.aW[n*4+3]=v.tLand,r.aQ[n*4]=p.q0.x,r.aQ[n*4+1]=p.q0.y,r.aQ[n*4+2]=p.q0.z,r.aQ[n*4+3]=p.q0.w,r.aPc.set(v.pc,n*3),r.aPv[n*4]=v.pv.x,r.aPv[n*4+1]=v.pv.y,r.aPv[n*4+2]=v.pv.z,r.aPv[n*4+3]=v.slide[0],r.aPw[n*4]=v.pw.x,r.aPw[n*4+1]=v.pw.y,r.aPw[n*4+2]=v.pw.z,r.aPw[n*4+3]=v.slide[1],r.aInfo[n*2]=k[G],r.aInfo[n*2+1]=v.seed,n++}await a.yield()}const A=new e.BufferGeometry,V={position:3,normal:3,aSlot:4,aP0:3,aV0:4,aW:4,aQ:4,aPc:3,aPv:4,aPw:4,aInfo:2};for(const p in r)A.setAttribute(p,new e.BufferAttribute(r[p],V[p]));return{geo:A,triangles:M/3}}function _t(a,i){const u=Ge(a.vs,a.rs),c=[],T=[],f=[],l=12,R=7,d=[],M=i==="milk";for(let w=0;w<=R;w++){const b=w/R,x=[];for(let A=0;A<=l;A++){const V=A%l/l*Math.PI*2,p=Math.cos(V),F=Math.sin(V);if(M){const S=b*Math.PI,k=.4*Math.sin(S),N=-.06-.36*Math.cos(S);x.push([k*p,N,k*F,Math.sin(S)*p,-Math.cos(S),Math.sin(S)*F,5e-4])}else{const S=.03+(a.fillTop-.03)*b,k=u(S)*.9;x.push([k*p,(S-.5)*a.h,k*F,p,0,F,Math.max(b,5e-4)])}}d.push(x)}const r=w=>{c.push(w[0],w[1],w[2]),T.push(w[3],w[4],w[5]),f.push(w[6])};for(let w=0;w<R;w++)for(let b=0;b<l;b++)for(const x of[d[w][b],d[w][b+1],d[w+1][b+1],d[w][b],d[w+1][b+1],d[w+1][b]])r(x);if(!M)for(let w=0;w<l;w++){const b=d[R][w],x=d[R][w+1],A=d[0][w],V=d[0][w+1];r([b[0],b[1],b[2],0,1,0,1]),r([x[0],x[1],x[2],0,1,0,1]),r([0,b[1],0,0,1,0,1]),r([A[0],A[1],A[2],0,-1,0,5e-4]),r([V[0],V[1],V[2],0,-1,0,5e-4]),r([0,A[1],0,0,-1,0,5e-4])}const n=new e.BufferGeometry;return n.setAttribute("position",new e.Float32BufferAttribute(c,3)),n.setAttribute("normal",new e.Float32BufferAttribute(T,3)),n.setAttribute("aLv",new e.Float32BufferAttribute(f,1)),n}const kt={tea:{tea:"#C8791C",teaGain:1,milk:0,tint:"#DCE8EE",tintGain:.22,opaque:0,gem:0,gemCol:"#B5673A",ribbon:.85,glow:.42},milk:{tea:"#F2EEE6",teaGain:.95,milk:1,tint:"#F3EEE4",tintGain:.95,opaque:1,gem:0,gemCol:"#E8A21C",ribbon:1.6,glow:.3},sherbet:{tea:"#B4142A",teaGain:1,milk:0,tint:"#F0C8C0",tintGain:.3,opaque:0,gem:1,gemCol:"#A3122A",ribbon:.85,glow:.5}};async function Gt(a,i={}){const u=a.rng.fork?a.rng.fork("unspilling-hero"):a.rng,c=i.palette&&i.palette.length>=7?i.palette:lt,T=rt[i.load]?i.load:"tea",f=rt[T],l=kt[T],R=a.quality?.detail??1,d=new e.Group;d.name="the-unspilling-hero";const M=ft(u,i.restZ??et);await a.yield();const r=i.windows||{wallX:-30,y0:8,y1:38,z:[[5,75],[-95,-25],[-195,-125],[-295,-225]]},n={uT:{value:we},uTime:{value:0},uTray:{value:new e.Matrix4},uSunDir:{value:new e.Vector3(-.89,.34,-.3).normalize()},uSunCol:{value:new e.Color(1.5,1.36,1.14)},uSkyCol:{value:new e.Color(c[1]).multiplyScalar(.62)},uBounceCol:{value:new e.Color(c[0]).lerp(new e.Color(c[3]),.12).multiplyScalar(.42)},uWin:{value:r.z.slice(0,5).map(o=>new e.Vector4(Math.min(o[0],o[1]),Math.max(o[0],o[1]),r.y0,r.y1))},uWall:{value:new e.Vector3(r.wallX,i.beams??1,0)},uFill:{value:new e.Vector4(.1,.12,.15,9)}};for(;n.uWin.value.length<5;)n.uWin.value.push(new e.Vector4(0,0,0,0));const w=(o={})=>{if(o.sunDir&&(n.uSunDir.value.set(o.sunDir.x??o.sunDir[0],o.sunDir.y??o.sunDir[1],o.sunDir.z??o.sunDir[2]).normalize(),n.uSunDir.value.y<.05&&(n.uSunDir.value.y=.05,n.uSunDir.value.normalize())),o.sunColor&&n.uSunCol.value.set(o.sunColor),o.skyColor&&n.uSkyCol.value.set(o.skyColor),o.bounceColor&&n.uBounceCol.value.set(o.bounceColor),o.sunGain!=null&&n.uSunCol.value.multiplyScalar(o.sunGain),o.beams!=null&&(n.uWall.value.y=o.beams),o.fillColor){const y=new e.Color(o.fillColor);n.uFill.value.set(y.r,y.g,y.b,n.uFill.value.w)}o.windowGain!=null&&(n.uFill.value.w=o.windowGain)};w(i);const b=(o,y,_={},C={})=>new e.ShaderMaterial({uniforms:{...e.UniformsUtils.merge([e.UniformsLib.fog]),...n,..._},vertexShader:o,fragmentShader:y,fog:!0,side:e.DoubleSide,...C}),x=(o,y,_=0)=>{const C=new e.Mesh(o,y);return C.frustumCulled=!1,C.renderOrder=_,C.matrixAutoUpdate=!1,d.add(C),C},A=(o,y,_)=>{const C=new e.InstancedBufferGeometry;C.index=o.index;for(const j in o.attributes)C.setAttribute(j,o.attributes[j]);for(const j in _)C.setAttribute(j,new e.InstancedBufferAttribute(_[j][0],_[j][1]));return C.instanceCount=y,C};let V=0;await a.yield();const p=await At(a,u,c);V+=p.triangles,await a.yield();const F=b(ot,De,{uObj:n.uTray});x(p.build(),F),await a.yield();let S=null;if(i.camAt){S=[];for(let o=.2;o<=.4;o+=.003)S.push({T:Ne(o,!1),p:i.camAt(o,new e.Vector3)});if(i.rare)for(let o=.32;o<=.372;o+=.003)S.push({T:Ne(o,!0),p:i.camAt(o,new e.Vector3)})}const k=Lt(u,M,f,S),N=k.glasses,h=N.length;await a.yield();const g=await Ft(a,u,k,f);V+=g.triangles;const m=new e.Color(l.tint),O=new e.Color(c[3]).lerp(new e.Color("#F4D27A"),.45),B=new e.Color(l.gemCol),P={uTint:{value:m.clone().multiplyScalar(l.tintGain)},uGold:{value:O},uGem:{value:B},uGlassP:{value:new e.Vector4(l.opaque,f.rim,l.gem,f.waist)}},W=b(ht,nt,P,l.opaque?{}:{transparent:!0,depthWrite:!1,forceSinglePass:!0});x(g.geo,W,6),await a.yield();const $=o=>{const y=o.length,_=new Float32Array(y*4),C=new Float32Array(y*3),j=new Float32Array(y*4),Z=new Float32Array(y*4),ee=new Float32Array(y*4),E=new Float32Array(y*4);return o.forEach((L,U)=>{_.set([L.slot.x,L.slot.y,L.slot.z,L.tL],U*4),C.set([L.p0.x,L.p0.y,L.p0.z],U*3),j.set([L.v0.x,L.v0.y,L.v0.z,L.tLand],U*4),Z.set([L.w.x,L.w.y,L.w.z,L.rest],U*4),ee.set([L.q0.x,L.q0.y,L.q0.z,L.q0.w],U*4),E.set([L.slide[0],L.slide[1],L.seed,L.extra??0],U*4)}),{iSlot:[_,4],iP0:[C,3],iV0:[j,4],iW:[Z,4],iQ:[ee,4],iSl:[E,4]}},z=b(mt,De),s=Ct(c,T,i.saucerColor),v=Tt(c);x(A(s.build(),h,$(N.map(o=>o.saucer))),z),V+=s.triangles*h,x(A(v.build(),h,$(N.map(o=>o.spoon))),z),V+=v.triangles*h;const G=new e.Color(l.tea).multiplyScalar(l.teaGain),I={uTea:{value:G},uTeaP:{value:new e.Vector3(l.milk,l.ribbon,l.glow)}},t=_t(f,T),q=T==="milk",X={value:q?9:Ge(f.vs,f.rs)(f.fillTop)*.9},oe=b(pt,wt,q?{uTea:{value:new e.Color(1.25,.62,.02)},uTeaP:{value:new e.Vector3(.8,1,.9)},uPlugR:X}:{...I,uPlugR:X}),H=T==="milk";x(A(t,h,$(N.map(o=>({slot:o.slotG,tL:o.tL,p0:o.p0,v0:o.v0,tLand:H?o.tL+Fe(o.p0.y,o.v0.y,.4):1e6,w:o.w,rest:H?.42:0,q0:o.q0,slide:H?[o.v0.x*.1,o.v0.z*.1]:[0,0],seed:0,extra:H?1e5:o.pour})))),oe,2),V+=t.attributes.position.count/3*h,await a.yield();{const o=f.closed?Math.max(14,Math.round(40*R)):Math.max(30,Math.round(125*R)),y=h*o,_=new Float32Array(y*4),C=new Float32Array(y*4),j=new Float32Array(y*4),Z=new Float32Array(y*3),ee=new e.Vector3,E=new e.Vector3;let L=0;for(const D of N)for(let be=0;be<o;be++,L++){E.copy(k.randDir());const ie=ee.copy(E).multiplyScalar(u.range(.05,.4)).add(D.G);ie.y=Math.max(ie.y,.12);const me=u.range(1.5,5)+u.range(0,1)*u.range(0,4);let ne=D.vB.x*(D.air?1:.5)+E.x*me,Ye=D.air?D.vB.y+E.y*me:Math.abs(E.y)*me*.8+u.range(.5,3),Ze=D.vB.z*(D.air?1:.5)+E.z*me;const Qe=Fe(ie.y,Ye,.06),Ue=u.range(.2,.7),$e=k.randDir().multiplyScalar(u.range(3,12));ie.x+ne*Qe*(1+Ue)>4.6&&(ne=-Math.abs(ne)*.6-Math.max(ie.x-4,0)/Math.max(Qe,.2)),_.set([ie.x,ie.y,ie.z,D.tB],L*4),C.set([ne,Ye,Ze,D.tB+Qe],L*4),j.set([$e.x,$e.y,$e.z,u.range(.14,.5)],L*4),Z.set([ne*Ue,Ze*Ue,u()],L*3)}const U=new e.BufferGeometry;U.setAttribute("position",new e.Float32BufferAttribute([-.5,0,0,0,.07,.13,.62,0,0,-.5,0,0,.62,0,0,.05,-.05,-.1],3)),U.setAttribute("normal",new e.Float32BufferAttribute([0,.88,-.47,0,.88,-.47,0,.88,-.47,0,.89,.45,0,.89,.45,0,.89,.45],3));const te=b(dt,nt,P,{transparent:!0,depthWrite:!1,forceSinglePass:!0});x(A(U,y,{iB:[_,4],iV:[C,4],iS:[j,4],iL:[Z,3]}),te,5),V+=y*2}await a.yield();{const y=h*28*2,_=new Float32Array(y*4),C=new Float32Array(y*4),j=new Float32Array(y*4),Z=new Float32Array(y*4),ee=new Float32Array(y*4),E=new Float32Array(y*3),L=[];let U=0;for(const D of N){const be=U,ie=u();for(let me=0;me<28;me++){for(let ne=-1;ne<=1;ne+=2,U++)_.set([D.p0.x,D.p0.y,D.p0.z,D.tL],U*4),C.set([D.v0.x,D.v0.y,D.v0.z,D.tB],U*4),j.set([D.w.x,D.w.y,D.w.z,D.tau],U*4),Z.set([D.q0.x,D.q0.y,D.q0.z,D.q0.w],U*4),ee.set([D.pool[0],D.pool[1],D.tS,D.tE],U*4),E.set([ne,me/27,ie],U*3);if(me<27){const ne=be+me*2;L.push(ne,ne+1,ne+2,ne+1,ne+3,ne+2)}}}const te=new e.BufferGeometry;te.setAttribute("position",new e.BufferAttribute(new Float32Array(y*3),3)),te.setAttribute("aE",new e.BufferAttribute(_,4)),te.setAttribute("aEv",new e.BufferAttribute(C,4)),te.setAttribute("aEn",new e.BufferAttribute(j,4)),te.setAttribute("aEvn",new e.BufferAttribute(Z,4)),te.setAttribute("aPool",new e.BufferAttribute(ee,4)),te.setAttribute("aSide",new e.BufferAttribute(E,3)),te.setIndex(L),x(te,b(yt,xt,{...I,uTeaQ:{value:new e.Vector4(f.closed?0:f.h*.42,0,0,0)}},{transparent:!0,depthWrite:!1,forceSinglePass:!0}),3),V+=L.length/3}const Q=new e.BufferGeometry;Q.setAttribute("position",new e.Float32BufferAttribute([-1,0,-1,1,0,-1,1,0,1,-1,0,-1,1,0,1,-1,0,1],3));{const o=new Float32Array(h*4),y=new Float32Array(h);N.forEach((C,j)=>{o.set([C.puddle.x,C.puddle.z,C.puddle.t,C.puddle.r*(T==="milk"?1.25:1)],j*4),y[j]=C.puddle.seed});const _=b(gt,bt,I,{transparent:!0,depthWrite:!1,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2});x(A(Q,h,{iPud:[o,4],iSeed:[y,1]}),_,1),V+=h*2}const J=new e.BufferGeometry;J.setAttribute("position",new e.Float32BufferAttribute([0,0,-.5,1,0,-.5,1,0,.5,0,0,-.5,1,0,.5,0,0,.5],3));const re=G.clone().multiplyScalar(.55);{const y=h*9,_=new Float32Array(y*4),C=new Float32Array(y*3);let j=0;for(const ee of N)for(let E=0;E<9;E++,j++){const L=ee.pieces[(E*5+ee.i)%ee.pieces.length];_.set([L.land[0],L.land[1],L.slide[0],L.slide[1]],j*4),C.set([L.tLand,u.range(.18,.5),u()],j*3)}const Z=b(St,Xe,{uSoftCol:{value:new e.Vector4(re.r,re.g,re.b,T==="milk"?.5:.34)},uSoftBeam:{value:0}},{transparent:!0,depthWrite:!1,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1});x(A(J,y,{iTr:[_,4],iTr2:[C,3]}),Z,0),V+=y*2}{const o=h*N[0].pieces.length,y=new Float32Array(o*4),_=new Float32Array(o*4),C=new Float32Array(o*3);let j=0;for(const ee of N)for(const E of ee.pieces)y.set([E.cB[0],E.cB[1],E.cB[2],E.tB],j*4),_.set([E.pv.x,E.pv.y,E.pv.z,E.tLand],j*4),C.set([E.slide[0],E.slide[1],u.range(.45,.7)],j*3),j++;const Z=b(Mt,Xe,{uSoftCol:{value:new e.Vector4(.035,.06,.13,.55)},uSoftBeam:{value:1}},{transparent:!0,depthWrite:!1,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1});x(A(J,o,{iA:[y,4],iBv:[_,4],iC:[C,3]}),Z,0),V+=o*2}const he={uObj:{value:new e.Matrix4},uFade:{value:0},uSoftCol:{value:new e.Vector4(.03,.045,.085,.62)},uSoftBeam:{value:1}};x(J,b(zt,Xe,he,{transparent:!0,depthWrite:!1,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),0),V+=2;{const y=h*3,_=new Float32Array(y*4),C=new Float32Array(y*2);let j=0;for(const ee of N)for(let E=0;E<3;E++,j++)_.set([ee.slotG.x,ee.slotG.y+f.h*.45,ee.slotG.z,ee.tL],j*4),C.set([u(),u.range(.22,.4)],j*2);const Z=new e.BufferGeometry;Z.setAttribute("position",new e.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,-.5,0,.5,.5,0,-.5,.5,0],3)),x(A(Z,y,{iSt:[_,4],iSt2:[C,2]}),b(Pt,Vt,{},{transparent:!0,depthWrite:!1,forceSinglePass:!0}),8),V+=y*2}if(await a.yield(),i.stage!==!1){const o=qe(),y=ue(ae(c[0]),.82),_=ae(c[5]),C=Me(ae(c[3]),ae(c[0]),.3),j=(E,L,U)=>ue(_,.85+.3*(Math.sin(E*1.7+U*2.3)*.5+.5)),Z=(E,L)=>{const U=(E+L)/2,te=Math.abs(L-E);o.slab(18,.4,U,24.4,.8,te+.4,.1,ue(_,.6),[0,.3,3]),o.slab(18,5.2,U,24,8.8,te,.12,j,[0,.35,3]),o.slab(18,9.75,U,24.3,.3,te+.3,.08,ue(_,1.25),[0,.4,3]),o.slab(18,10.35,U,25,.9,te+1,.16,y,[0,.7,2]);for(let D=0;D<4;D++){const be=9+D*6,ie=Math.max(E,L);o.slab(be,4,ie+.06,5,5.4,.3,.12,ue(_,1.12+.1*(D&1)),[0,.45,3]),o.slab(be,8.2,ie+.06,5,1.9,.3,.1,ue(_,1.2),[0,.45,3]),o.lathe([[0,.34],[.2,.3],[.26,.2],[.14,.1],[.12,0],[0,0]],8,{sign:1,color:C,surf:[1,.7,0],m:new e.Matrix4().makeRotationX(Math.PI/2).setPosition(be,8.2,ie+.2)})}};Z(49,36),Z(-32,-68);{const E=ue(ae(c[0]),.86),L=[0,.5,4],U=[[-30,0,-84],[48,0,-84],[48,0,150],[-30,0,150]];for(const te of[0,2,1,0,3,2])o.put(U[te][0],U[te][1],U[te][2],0,1,0,E,L)}o.slab(21,17.6,-50,18,.8,36,.14,y,[0,.7,2]);const ee=[[0,0],[.5,0],[.5,.3],[.3,.5],[.22,.9],[.3,1.2],[.2,1.5],[.2,4.6],[.3,4.9],[.22,5.2],[.3,5.5],[.48,5.75],[.48,5.9],[0,5.9]];for(const E of[-66,-50,-34])o.lathe(ee,10,{sign:-1,color:C,surf:[1,.7,0],m:new e.Matrix4().makeScale(1,6.4/5.9,1).setPosition(12.8,10.8,E)});x(o.build(),b(ot,De,{uObj:{value:new e.Matrix4}})),V+=o.triangles}await a.yield();const Ae=new e.Vector3(4,9,-22),ge=new e.Vector3,Ce=new e.Quaternion,ve=new e.Vector3(1,1,1),le=new e.Vector3,Y=new e.Vector3,se=new e.Vector3,K=new e.Vector3,fe=new e.Vector3,Re=new e.Vector3,_e=new e.Vector3;let We=!1,Pe=we;const it=!!i.rare,st=i.breath??.03;function Je(o,y){n.uT.value=o,n.uTime.value=y,n.uWall.value.z=y,M.pose(o,ge,Ce),n.uTray.value.compose(ge,Ce,ve);const _=n.uSunDir.value,C=ge.y/Math.max(_.y,.05);se.set(0,1,0).applyQuaternion(Ce),K.set(_.x,0,_.z);const j=K.length();j>1e-4?K.multiplyScalar(1/j):K.set(1,0,0);const Z=Math.abs(se.y),ee=Math.min(12*Z+12/Math.max(_.y/Math.max(j,.05),.2)*(1-Z),40),E=12*Math.max(Z,Math.abs(se.x*K.x+se.z*K.z),.14);fe.copy(K).multiplyScalar(-ee),Re.set(-K.z,0,K.x).multiplyScalar(E),_e.set(ge.x-_.x*C,.03,ge.z-_.z*C).addScaledVector(fe,-.5+.5*(1-Z)*.7),he.uObj.value.makeBasis(fe,xe,Re).setPosition(_e),he.uFade.value=1-de(7,19,ge.y)}return Je(Pe,0),{object:d,radius:38,height:27,center:Ae,ground:i.stage===!1,groundY:0,triangles:V,uniforms:n,anchors:{trayShelf:new e.Vector3(14,18,-50),trayFloor:new e.Vector3(-2,0,-15),trayLean:new e.Vector3(16,5.6,51),wreck:new e.Vector3(-3,0,-5),closePass:{position:new e.Vector3(1,23,-53),lookAt:new e.Vector3(14,19,-50)},flyThrough:[new e.Vector3(16,7,145),new e.Vector3(16,7,85),new e.Vector3(-3,7.5,45),new e.Vector3(-6,8,5),new e.Vector3(-2,15,-25),new e.Vector3(1,23,-53),new e.Vector3(-4,15,-110)],viewpoints:{entry:{position:new e.Vector3(16,7,145),lookAt:new e.Vector3(16,5.6,51)},rise:{position:new e.Vector3(-5,9,12),lookAt:new e.Vector3(5,15,-36)},laid:{position:new e.Vector3(1,23,-53),lookAt:new e.Vector3(14,19,-50)}},portalSeat:{position:new e.Vector3(0,19.5,-353),facing:new e.Vector3(0,0,1)}},clockAt:Ne,trayPose:(o,y,_)=>M.pose(o,y,_||Ce),plan:N,setLight:w,setProgress(o,y){We=!0,Pe=Ne(o,y??it)},setClock(o){We=!0,Pe=ce(o,0,we)},update(o,y,_){if(!We&&_){_.getWorldPosition(le),d.getWorldPosition(Y);let C=Math.atan2(le.x-Y.x-Ae.x,le.z-Y.z-Ae.z);C<-.6&&(C+=Math.PI*2),Pe=ce(Ne(ke(.03,.45,ce((C+.3)/(Math.PI*1.5),0,1)),!1)+.3*Math.sin(y*.6),0,we)}Je(ce(Pe+st*Math.sin(y*1.3)*de(0,.3,Pe)*de(0,.3,we-Pe),0,we),y)},dispose(){}}}export{tt as HERO_GLSL,Gt as buildHero,Ge as makePchip};
