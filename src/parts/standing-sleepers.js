import*as t from"three";import{clamp as ee,lerp as re,smoothstep as H}from"../kit/core.js";const gt=["#F4B860","#DDE8EC","#1E6FA8","#0A3458","#03121F","#3B4046","#E9E4D8"],j=.42,ke=.085,Ce=.295,et=2.02,ge=`
float ssH(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.y); }
vec2 ssH2(vec2 p){ vec3 q = fract(vec3(p.xyx)*vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz)*q.zy); }
float ssN(vec2 x){
  vec2 i = floor(x), f = fract(x); f = f*f*(3.0 - 2.0*f);
  return mix(mix(ssH(i), ssH(i + vec2(1.0, 0.0)), f.x), mix(ssH(i + vec2(0.0, 1.0)), ssH(i + vec2(1.0, 1.0)), f.x), f.y);
}
float ssF(vec2 p){
  float v = ssN(p)*0.55; p = mat2(0.8, -0.6, 0.6, 0.8)*p*2.07 + 3.1;
  v += ssN(p)*0.28; p = mat2(0.8, -0.6, 0.6, 0.8)*p*2.11 + 5.3;
  return v + ssN(p)*0.17;
}
// long forking furrows: q = (arc metres round the girth, metres along the body). 1 on a groove line.
float ssFurrow(vec2 q, float sd){
  float w = ssN(q*vec2(0.9, 0.8) + sd*7.3) + 0.35*ssN(q*vec2(2.3, 2.9) + sd);
  float n1 = ssN(vec2(q.x*7.5 + w*3.0, q.y*0.42) + sd*3.1);
  return 1.0 - abs(2.0*n1 - 1.0);
}
// broad folds the mesh can carry: 1 in the valley
float ssFold(vec2 q, float sd){
  float w = ssN(q*vec2(0.5, 0.55) + sd*2.9);
  float n = ssN(vec2(q.x*2.4 + w*2.4, q.y*0.33) + sd*5.7);
  return smoothstep(0.5, 0.95, 1.0 - abs(2.0*n - 1.0));
}
float ssFlank(float a, float phi, float part){
  return smoothstep(0.30, 0.40, a)*(1.0 - smoothstep(0.86, 0.97, a))*(1.0 - step(0.5, part))*(1.0 - smoothstep(2.65, 3.05, abs(phi)));
}
`,yt=`
attribute vec4 aBody;    // a (0 nose..1 tail), phi (0 dorsal, +-pi ventral), part (0 body 1 jaw 2 flipper 3 fluke 4 teeth), mask
attribute vec4 aInst;    // length m, seed, fluke flex (rad), swim amplitude (rad)
attribute vec4 aInst2;   // jaw open (rad), furrow amount, paleness, depth of the body's top (m, for the gold cap)
uniform float uTime, uDisp;
varying vec3 vWp; varying vec3 vN; varying vec4 vBody; varying vec4 vI; varying vec4 vI2; varying vec2 vQ;
#include <common>
#include <fog_pars_vertex>
${ge}
void main(){
  float a = aBody.x, L = aInst.x;
  vec3 p = position; vec3 n = normal;
  vQ = vec2(aBody.y*${ke.toFixed(3)}*L, a*L);
  vBody = aBody; vI = aInst; vI2 = aInst2;
  if (uDisp > 0.0) {
    float g = ssFold(vQ, aInst.y);
    p -= n*(uDisp*g*ssFlank(a, aBody.y, aBody.z)*aInst2.y*(1.0 - 0.75*smoothstep(0.58, 0.88, a))/L);
  }
  // the jaw hangs open about its hinge
  if (aBody.z > 0.5 && aBody.z < 1.5 || aBody.z > 3.5) {
    float ja = aInst2.x*(1.0 - smoothstep(0.22, 0.30, a));
    vec2 h = vec2(${(j-.285).toFixed(3)}, -0.062);
    float c = cos(ja), s = sin(ja); vec2 d = p.yz - h;
    p.yz = h + vec2(c*d.x + s*d.y, -s*d.x + c*d.y);
    vec2 nn = n.yz; n.yz = vec2(c*nn.x + s*nn.y, -s*nn.x + c*nn.y);
  }
  // fluke flex and (calf) swimming: a dorso-ventral bend of the tail stock about station 0.62
  float t = clamp((a - 0.62)/0.38, 0.0, 1.0);
  float ang = (aInst.z + aInst.w*sin(uTime*4.4 - a*4.0 + aInst.y*6.0))*t*(0.4 + 0.6*t);
  if (abs(ang) > 0.0001) {
    vec2 h = vec2(${(j-.62).toFixed(3)}, 0.0);
    float c = cos(ang), s = sin(ang); vec2 d = p.yz - h;
    p.yz = h + vec2(c*d.x + s*d.y, -s*d.x + c*d.y);
    vec2 nn = n.yz; n.yz = vec2(c*nn.x + s*nn.y, -s*nn.x + c*nn.y);
  }
  vec4 wp = modelMatrix*instanceMatrix*vec4(p, 1.0);
  vWp = wp.xyz;
  vN = normalize(mat3(modelMatrix)*mat3(instanceMatrix)*n);
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}
`,ze=`
uniform float uTime, uSurfaceY, uKey, uCaustic, uRim, uFade, uDeep, uRake;
uniform vec3 uSunDir, uSunCol, uFill, uDeepFill, uShade;
float ssTop = -1.0;       // depth (m) of the top of this body; set by the whale shader so the gold can sit on it as a cap
float ssShadeK = 1.0;     // how much of the slate shadow floor this surface takes (the eyeball takes little: it stays dark)
float ssCaustic(vec3 wp){
  vec3 s = uSunDir;
  vec3 t1 = normalize(cross(s, vec3(0.0, 0.0, 1.0)) + vec3(1e-4, 0.0, 0.0)); vec3 t2 = cross(s, t1);
  vec2 p = vec2(dot(wp, t1), dot(wp, t2));
  float tt = uTime*0.5;
  float w = ssN(p*0.45 + vec2(tt*0.6, -tt*0.4));
  float a = ssN(p*1.7 + vec2(w*2.2 + tt, w*1.5 - tt*0.7));
  float b = ssN(p*3.3 - vec2(w*1.4 + tt*1.3, tt*0.9) + 7.7);
  float l1 = 1.0 - abs(2.0*a - 1.0), l2 = 1.0 - abs(2.0*b - 1.0);
  float c = l1*l1*l1*l1*1.25 + l2*l2*l2*l2*l2*l2*0.75;
  return c*(0.75 + 0.25*sin(uTime*2.3 + p.x*1.7));
}
// returns linear colour of a surface with this albedo; N unit, V unit toward the eye
vec3 ssLight(vec3 alb, vec3 N, vec3 V, vec3 wp, float cav){
  float depth = max(uSurfaceY - wp.y, 0.0);
  float kf = exp(-depth/uFade);
  // seen from the deep (uDeep 1) the gold has drained off the bodies: it stays only as a cap on the top 1-2 m
  float cap = ssTop < 0.0 ? 0.0 : exp(-max(depth - ssTop, 0.0)/1.5);
  kf = mix(kf, 0.5*cap, uDeep);
  float ndl = dot(N, uSunDir);
  float wrap = clamp(ndl*0.8 + 0.2, 0.0, 1.0);
  float ca = ssCaustic(wp);
  vec3 key = uSunCol*(uKey*kf*wrap*(0.55 + uCaustic*ca));
  float up = clamp(N.y*0.5 + 0.5, 0.0, 1.0);
  vec3 amb = mix(uDeepFill*(1.0 - 0.6*uDeep), uFill*((0.35 + 0.65*exp(-depth/22.0))*(1.0 - 0.45*uDeep)), up*up);
  float fr = 1.0 - clamp(dot(N, V), 0.0, 1.0);
  vec3 rim = uSunCol*(uRim*kf*fr*fr*fr*smoothstep(-0.25, 0.55, ndl)*(0.5 + ca));
  vec3 sheen = uFill*(0.05*fr*fr*up);
  vec3 gild = uSunCol*(uDeep*cap*cap*uRim*(0.1*wrap + 0.22*fr*fr*smoothstep(-0.4, 0.5, ndl)));
  vec3 slate = vec3(0.0075, 0.03, 0.064)*(uDeep*(0.75 + 0.5*up));        // from the deep a body is a slate silhouette, never black
  vec3 lit = alb*(key + amb)*cav;
  // SHADOW SIDES ARE SLATE, NEVER BLACK. alb*amb alone is 0.01-0.03 scene-linear, which the tone map's toe crushes to
  // navy, so the water's own scattered light is a floor under the lit term: uShade is the scene-linear colour that
  // reaches the screen as the mood's slate (#16324A in the golden hour). Skin detail rides on it (m: 1 on mean
  // charcoal skin, about 0.3 in a furrow, 2-6 on scars, slough and the lid rosette), modelled by a soft fill from the
  // water on the far side from the sun. The red part barely varies with m because red is the channel the toe eats first.
  // A smooth maximum with the lit term, so sunlit skin keeps its gold and nothing is added there.
  float rel = dot(alb, vec3(0.3, 0.5, 0.2))*19.5;
  float det = rel*1.2/(1.0 + 0.2*rel);
  vec3 Fd = normalize(vec3(-uSunDir.x, 0.45, -uSunDir.z));
  float model = 0.3 + 0.75*clamp(dot(N, Fd)*0.5 + 0.5, 0.0, 1.0) + 0.15*up;
  float m = det*model*cav*cav; m = clamp(m*m, 0.3, 7.0);
  vec3 shade = uShade*(vec3(0.98, 0.66, 0.60) + vec3(0.08, 0.34, 0.38)*m);
  float xl = dot(lit, vec3(0.3, 0.5, 0.2))/max(dot(shade, vec3(0.3, 0.5, 0.2)), 1e-4);
  lit += shade*((pow(1.0 + xl*xl*xl, 0.3333) - xl)*(1.0 - uDeep)*ssShadeK);
  // uRake (the henge seen from below): the sun still rakes the pod from one side, so every body keeps a warm flank and a
  // thin gold edge toward the sun over its slate, and reads as a lit, round thing, not as a paper silhouette
  float rk = uRake*exp(-depth/60.0);
  vec3 rake = uSunCol*(rk*(wrap*wrap*(0.5 + 0.55*ca)*(0.06 + 1.5*dot(alb, vec3(0.3, 0.5, 0.2)))*cav + 0.2*fr*fr*smoothstep(-0.1, 0.6, ndl)));
  return lit + rim*(0.4 + 6.0*alb.g) + sheen + gild + slate + rake;
}
`,xt=`
uniform vec3 uChar, uBone, uSlate;
uniform float uBump;
varying vec3 vWp; varying vec3 vN; varying vec4 vBody; varying vec4 vI; varying vec4 vI2; varying vec2 vQ;
#include <common>
#include <fog_pars_fragment>
${ge}
${ze}
// relief of the skin in metres at skin coordinate q: broad folds, forking furrows and fine wrinkles on the flank,
// slow dimples on the head. g returns (fold, groove, fine) for the colour.
float ssRelief(vec2 q, float sd, float flank, float cFade, float fFade, out vec3 g){
  float groove = smoothstep(0.45, 0.96, ssFurrow(q, sd)); groove *= groove;
  float n2 = ssN(vec2(q.x*11.0 + 2.0*ssN(q*vec2(1.7, 0.4)), q.y*0.6) + sd*1.9);
  float fine = smoothstep(0.35, 0.95, 1.0 - abs(2.0*n2 - 1.0));
  float dimple = ssN(q*2.3 + sd*4.0)*0.5 + ssN(q*6.1 + sd)*0.25;
  float fold = ssFold(q, sd);
  g = vec3(fold, groove, fine);
  return -(fold*0.02 + groove*cFade*0.034 + fine*fFade*0.009)*flank + dimple*0.012*(1.0 - flank)*cFade;
}
// a set of 3-5 parallel tooth rakes per hashed cell, never thinner than 1.5 px
float ssRakes(vec2 q, float cell, float sd, float px){
  vec2 g = q/cell + sd*13.7; vec2 id = floor(g); vec2 f = fract(g) - 0.5;
  vec2 h = ssH2(id + 3.3);
  float on = step(0.6, ssH(id*1.7 + 9.1));
  float ang = (h.x - 0.5)*2.6;
  vec2 d = vec2(cos(ang), sin(ang));
  vec2 p = (f - (h - 0.5)*0.2)*cell;
  float u = dot(p, d), v = dot(p, vec2(-d.y, d.x));
  float n = 3.0 + floor(h.y*2.99);
  float sp = 0.045 + 0.03*h.x;
  float len = cell*(0.15 + 0.13*h.y);
  v += (h.x - 0.5)*0.5*u*u/len + ((mod(n, 2.0) < 0.5) ? 0.5*sp : 0.0) + 0.012*sin(u*17.0 + h.y*40.0);
  float hw = 0.0045; float w = max(hw, 0.75*px);
  float li = floor(v/sp + 0.5);
  float vv = abs(fract(v/sp + 0.5) - 0.5)*sp;
  float line = 1.0 - smoothstep(w, w + px + 0.0005, vv);
  line *= min(1.0, hw/w*1.6)*(1.0 - smoothstep(0.3*sp, 0.5*sp, w));
  float ll = len*(0.3 + 0.7*ssH(id + li*7.13));
  float uo = u - (ssH(id*3.1 + li) - 0.5)*len*0.9;
  float env = (1.0 - step(n*sp*0.5, abs(v)))*(1.0 - smoothstep(ll*0.2, ll, abs(uo)));     // each rake its own length, tapering out
  return line*env*on*(0.55 + 0.45*ssH(id*5.3 + li*1.9));
}
// chains of sucker rings
float ssRings(vec2 q, float sd, float px){
  float cell = 0.2; vec2 g = q/cell + sd*5.1; vec2 id = floor(g); vec2 f = (fract(g) - 0.5)*cell;
  vec2 h = ssH2(id + 1.7);
  float r = 0.02 + 0.028*h.x*h.x;
  vec2 fc = f - (ssH2(id*1.9 + 4.4) - 0.5)*0.09;
  float d = abs(length(fc) - r) + 0.012*smoothstep(0.35, 0.8, ssN(fc*40.0 + id));
  float hw = 0.006; float w = max(hw, 0.75*px);
  float ring = (1.0 - smoothstep(w, w + px + 0.0005, d))*min(1.0, hw/w*1.6)*(1.0 - smoothstep(0.02, 0.045, px));
  float chain = 1.0 - smoothstep(0.07, 0.12, abs(ssN(q*vec2(0.8, 0.45) + sd*9.0) - 0.5));
  return ring*chain*step(0.4, h.y);
}
void main(){
  float a = vBody.x, phi = vBody.y, part = vBody.z, sd = vI.y;
  vec2 q = vQ;
  vec2 fw = fwidth(q);
  float px = clamp(max(fw.x, fw.y), 0.0, 4.0);
  float pxg = clamp(max(fw.x, 0.3*fw.y), 0.0, 4.0);
  float isBody = 1.0 - step(0.5, part);
  float flank = ssFlank(a, phi, part)*vI2.y;
  float pale = vI2.z;

  // ---- relief: furrows (two scales) on the flank, slow dimples on the head
  // the fine wrinkles fade before they are thinner than a pixel, the furrows a little later (no moire, no blocks)
  float cFade = 1.0 - smoothstep(0.014, 0.05, pxg), fFade = 1.0 - smoothstep(0.007, 0.02, pxg);
  vec3 rg0, rg1;
  float H = ssRelief(q, sd, flank, cFade, fFade, rg0);
  float fold = rg0.x, groove = rg0.y, fine = rg0.z;
  // slope of the relief by finite differences in skin space (a screen-space dFdx of H steps in 2 x 2 pixel blocks)
  vec2 e = max(fw*1.25, vec2(0.004));
  vec2 gH = vec2(ssRelief(q + vec2(e.x, 0.0), sd, flank, cFade, fFade, rg1) - H, ssRelief(q + vec2(0.0, e.y), sd, flank, cFade, fFade, rg1) - H)/e;
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 dpx = dFdx(vWp), dpy = dFdy(vWp);
  vec2 dqx = dFdx(q), dqy = dFdy(q);
  float hx = dot(gH, dqx), hy = dot(gH, dqy);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx);
  float det = dot(dpx, r1);
  vec3 grad = (hx*r1 + hy*r2)*sign(det);
  N = normalize(abs(det)*N - uBump*grad + 1e-6*N);

  // ---- colour: charcoal with cloud, sloughing patches, belly blotches, bone jaw, scars
  float cloud = ssF(q*0.6 + sd*11.0);
  vec3 alb = uChar*(0.62 + 0.75*cloud);
  alb = mix(alb, uChar*1.55 + uBone*0.05, pale);
  float sl = ssF(q*vec2(1.5, 1.0) + sd*5.0)*0.8 + ssF(q*vec2(6.5, 5.0) + sd*8.0)*0.2;
  float th = 0.60 - 0.04*pale;
  float aaS = 0.012 + px*1.5;
  float inside = smoothstep(th, th + aaS, sl);
  float edge = smoothstep(th - 0.035 - aaS, th, sl)*(1.0 - smoothstep(th, th + 0.02 + aaS, sl));
  float isSkin = 1.0 - step(2.5, part)*0.6;
  alb = mix(alb, alb*1.35 + uBone*0.03, inside*(0.5 + 0.25*flank)*isSkin);
  alb *= 1.0 - 0.42*edge*isSkin*cFade;
  // belly
  float ventral = smoothstep(2.15, 2.85, abs(phi))*isBody;
  float bl = smoothstep(0.54, 0.58 + px, ssF(q*vec2(1.4, 0.75) + sd*2.3));
  alb = mix(alb, uBone*0.36, bl*ventral*smoothstep(0.34, 0.44, a)*(1.0 - smoothstep(0.66, 0.8, a))*0.75);
  // furrow cavities, a paler crest between them
  alb *= 1.0 - flank*(0.2*fold + 0.46*groove*cFade + 0.22*fine*fFade);
  alb *= 1.0 + flank*0.18*(1.0 - groove)*cFade;
  // scars: pale rakes everywhere (denser on the head), sucker rings low on the head
  float headM = 1.0 - smoothstep(0.30, 0.42, a);
  float rk = ssRakes(q, 1.3, sd, px)*(0.35 + 0.65*headM) + ssRakes(q.yx*vec2(1.0, -1.0) + 3.7, 0.8, sd + 0.37, px)*headM;
  float rg = ssRings(q, sd, px)*headM*smoothstep(1.2, 1.9, abs(phi));
  float scar = clamp(rk*(0.55 + 0.45*headM) + rg, 0.0, 1.0)*step(part, 2.5)*(1.0 - pale*0.7);
  alb = mix(alb, alb*1.35 + uBone*0.06, scar*0.55);
  // jaw: bone white rim, mouth line on the head, pegs
  float jaw = step(0.5, part)*(1.0 - step(1.5, part));
  alb = mix(alb, uBone*(0.2 + 0.1*ssF(q*7.0)), jaw*vBody.w);
  float lip = isBody*(1.0 - smoothstep(0.02, 0.05 + px, abs(abs(phi) - 2.72)))*smoothstep(0.03, 0.06, a)*(1.0 - smoothstep(0.26, 0.29, a));
  alb = mix(alb, uBone*0.3, lip*0.22);
  alb = mix(alb, uBone*0.4, step(3.5, part));
  // flukes and flippers: pale nicked trailing edge
  float fin = step(1.5, part)*(1.0 - step(3.5, part));
  alb = mix(alb, uBone*0.36, fin*smoothstep(0.82, 1.0, vBody.w)*(0.4 + 0.6*ssN(q*14.0 + sd)));
  // the plain eye every whale has: a dark almond in a ring of lid wrinkles
  vec2 ev = (vec2(abs(phi), a) - vec2(${et.toFixed(3)}, ${Ce.toFixed(3)}))*vec2(${ke.toFixed(3)}*vI.x, vI.x);
  float er = length(ev*vec2(1.25, 0.8));
  float lid = (1.0 - smoothstep(0.1, 0.24, er))*isBody;
  alb = mix(alb, alb*1.7 + uBone*0.05, (1.0 - smoothstep(0.3, 0.8, er))*isBody*0.85);            // paler, thinner skin round the eye
  alb *= 1.0 - lid*0.35*(0.5 + 0.5*sin(er*150.0))*(1.0 - smoothstep(0.004, 0.02, px));
  alb = mix(alb, vec3(0.006, 0.005, 0.005), (1.0 - smoothstep(0.03, 0.045 + px, er))*isBody);
  // blowhole: a dark S-slit on the front left corner of the brow
  vec2 bv = (vec2(phi, a) - vec2(-0.62, 0.012))*vec2(${ke.toFixed(3)}*vI.x, vI.x);
  float bs = abs(bv.x - 0.05*sin(bv.y*22.0));
  alb *= 1.0 - 0.85*(1.0 - smoothstep(0.012, 0.03 + px, bs))*(1.0 - smoothstep(0.1, 0.14, abs(bv.y)))*isBody;

  float cav = 1.0 - flank*0.35*groove*cFade;
  vec3 V = normalize(cameraPosition - vWp);
  ssTop = vI2.w;
  vec3 col = ssLight(alb, N, V, vWp, cav);
  // wet sheen toward the sun on the skin crests
  vec3 Hh = normalize(uSunDir + V + vec3(0.0, 1e-4, 0.0));
  float sp = dot(N, Hh); sp = clamp(sp, 0.0, 1.0); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  col += uSunCol*(sp*0.35*uKey*exp(-max(uSurfaceY - vWp.y, 0.0)/uFade)*(1.0 - uDeep)*(1.0 - 0.7*groove*flank));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}
`,le=[[0,.078,.06,.056,0,3.6],[.1,.086,.064,.063,0,3.3],[.25,.092,.072,.07,0,2.8],[.33,.092,.082,.074,0,2.5],[.42,.092,.09,.076,0,2.25],[.55,.08,.08,.066,.004,2.1],[.66,.06,.062,.046,.008,2],[.78,.039,.044,.025,.008,2],[.88,.025,.03,.013,.004,2],[.95,.015,.017,.01,0,2],[1,.007,.007,.01,0,2]],tt=[0,0,0,0,0];function at(n){n=ee(n,0,1);let r=0;for(;r<le.length-2&&n>le[r+1][0];)r++;const a=le[Math.max(0,r-1)],w=le[r],l=le[r+1],b=le[Math.min(le.length-1,r+2)],M=l[0]-w[0],S=(n-w[0])/M,c=S*S,u=c*S;for(let k=1;k<=5;k++){const x=(l[k]-a[k])/Math.max(1e-6,l[0]-a[0])*M,y=(b[k]-w[k])/Math.max(1e-6,b[0]-w[0])*M;tt[k-1]=(2*u-3*c+1)*w[k]+(u-2*c+S)*x+(-2*u+3*c)*l[k]+(u-c)*y}return tt}const Z=(n,r,a)=>Math.exp(-((n-r)/a)*((n-r)/a));function wt(n){let r=.024*(n<.635?Z(n,.635,.05):Z(n,.635,.028));for(let a=0;a<5;a++)r+=.0085*(1-a*.16)*Z(n,.705+a*.043,.011);return r+.004*Z(n,.335,.03)-.004*Z(n,.3,.03)}function Fe(n,r,a,w=1){const l=at(n),b=Math.sin(r),M=Math.cos(r),S=2/l[4],c=Math.max(0,-M),u=Math.max(0,M),k=1-H(.26,.4,n);let x=l[2]*Math.sign(b)*Math.pow(Math.abs(b),S);x*=1-.4*k*Math.pow(c,1.5);let y=(M>=0?l[0]:l[1])*Math.sign(M)*Math.pow(Math.abs(M),S);y+=Math.pow(u,6)*wt(n)-Math.pow(c,8)*.013*Z(n,.85,.06);const I=1+.07*Z(r,-.62,.3)*Z(n,.012,.03);x*=w*I,y=y*w*I+l[3];const P=n+.03*c*c*(1-H(0,.17,n))-.009*(1-w*w);return a[0]=x,a[1]=j-P,a[2]=y,a}const X=[0,0,0],Be=[0,0,0],Ne=[0,0,0];function ot(n,r){Fe(n,r,X),Fe(n+.004,r,Be),Fe(n,r+.02,Ne);const a=new t.Vector3(X[0],X[1],X[2]),w=new t.Vector3(Be[0]-X[0],Be[1]-X[1],Be[2]-X[2]),l=new t.Vector3(Ne[0]-X[0],Ne[1]-X[1],Ne[2]-X[2]),b=new t.Vector3().crossVectors(l,w).normalize();return b.x*a.x+b.z*a.z<0&&b.negate(),{p:a,n:b,along:w.normalize(),around:l.normalize()}}function nt(){const n=[],r=[],a=[],w=[],l=[0,0,0];async function b(c,u,k,x,y){const I=n.length/3,P=u+1,v=new Float32Array(c*P*3),B=new Float32Array(c*3);for(let o=0;o<c;o++){y&&o%4===3&&await y();for(let s=0;s<=u;s++){k(o,s%u/u,l);const h=(o*P+s)*3;v[h]=l[0],v[h+1]=l[1],v[h+2]=l[2],s<u&&(B[o*3]+=l[0]/u,B[o*3+1]+=l[1]/u,B[o*3+2]+=l[2]/u)}}let Y=1,ae=-1;const z=[0,0,0],O=(o,s)=>{const h=(s+1)%u,d=(s-1+u)%u,F=Math.min(c-1,o+1),f=Math.max(0,o-1),R=(o*P+h)*3,_=(o*P+d)*3,C=(F*P+s)*3,V=(f*P+s)*3,q=v[R]-v[_],oe=v[R+1]-v[_+1],W=v[R+2]-v[_+2],U=v[C]-v[V],J=v[C+1]-v[V+1],de=v[C+2]-v[V+2];return z[0]=oe*de-W*J,z[1]=W*U-q*de,z[2]=q*J-oe*U,Math.hypot(z[0],z[1],z[2])};for(let o=1;o<c-1;o++){const s=o*P*3,h=Math.hypot(v[s]-B[o*3],v[s+1]-B[o*3+1],v[s+2]-B[o*3+2]);h>ae&&(ae=h,O(o,0),Y=z[0]*(v[s]-B[o*3])+z[1]*(v[s+1]-B[o*3+1])+z[2]*(v[s+2]-B[o*3+2])>=0?1:-1)}for(let o=0;o<c;o++){y&&o%6===5&&await y();for(let s=0;s<=u;s++){const h=s%u,d=(o*P+h)*3;let F=O(o,h),f=z[0]*Y,R=z[1]*Y,_=z[2]*Y;if(F<1e-12){const V=o===0?1:c-2,q=o===0?2:c-3;f=B[o*3]-B[V*3],R=B[o*3+1]-B[V*3+1],_=B[o*3+2]-B[V*3+2],F=Math.hypot(f,R,_),F<1e-9&&(f=B[V*3]-B[q*3],R=B[V*3+1]-B[q*3+1],_=B[V*3+2]-B[q*3+2],F=Math.hypot(f,R,_)||1)}n.push(v[d],v[d+1],v[d+2]),r.push(f/F,R/F,_/F),l[0]=v[d],l[1]=v[d+1],l[2]=v[d+2];const C=x(o,s/u,l);a.push(C[0],C[1],C[2],C[3])}}for(let o=0;o<c-1;o++){y&&o%24===23&&await y();for(let s=0;s<u;s++){const h=I+o*P+s,d=h+1,F=h+P,f=F+1;Y>0?w.push(h,d,F,d,f,F):w.push(h,F,d,d,F,f)}}}async function M(c){const u=new t.BufferGeometry;return u.setAttribute("position",new t.Float32BufferAttribute(n,3)),c&&await c(),u.setAttribute("normal",new t.Float32BufferAttribute(r,3)),c&&await c(),u.setAttribute("aBody",new t.Float32BufferAttribute(a,4)),c&&await c(),u.setIndex(w),u}function S(){const c=new t.BufferGeometry;return c.setAttribute("position",new t.Float32BufferAttribute(n,3)),c.setAttribute("normal",new t.Float32BufferAttribute(r,3)),c.setAttribute("aBody",new t.Float32BufferAttribute(a,4)),c.setIndex(w),c}return{tube:b,build:M,buildNow:S,tris:()=>w.length/3}}async function bt(n){const r=nt(),a=n.rng,w=n.sides,l=[0,0,0,0],b=w>=48,M=[],S=Math.max(5,Math.round(n.rings*.09));for(let o=0;o<=S;o++){const s=Math.pow(Math.sin(o/S*Math.PI/2),.8);M.push([.045*(1-Math.pow(1-Math.pow(s,4),.25)),s])}for(let o=1;o<=n.rings;o++)M.push([.045+.955*(o/n.rings),1]);M.push([1.004,.02]),await r.tube(M.length,w,(o,s,h)=>Fe(M[o][0],-Math.PI+s*2*Math.PI,h,M[o][1]),(o,s)=>(l[0]=M[o][0],l[1]=-Math.PI+s*2*Math.PI,l[2]=0,l[3]=0,l),n.yield),n.yield&&await n.yield();const c=[];for(let o=0;o<7;o++)c.push([a.range(-.95,.95),a.range(.015,.05),a.range(.004,.013)]);const u=.145,k=b?31:19,x=b?14:8,y=o=>.9+.11*Math.pow(Math.abs(o),1.15),I=o=>{const s=Math.abs(o);let h=1.01+.034*Math.sin(Math.PI*Math.pow(s,.72))*(1-s*s*s)-.032*Z(o,0,.075);for(const d of c)h-=d[2]*Z(o,d[0],d[1]);return Math.max(h,y(o)+5e-4)},P=o=>{const s=-1+2*o/(k-1);return Math.sign(s)*(1-Math.pow(1-Math.abs(s),1.6))};n.yield&&await n.yield(),r.tube(k,x,(o,s,h)=>{const d=P(o),F=s*2*Math.PI,f=.5-.5*Math.cos(F),R=.0105*(1-Math.pow(Math.abs(d),1.5))+.0012;return h[0]=d*u,h[1]=j-re(y(d),I(d),f),h[2]=R*Math.sin(F)*(1.25-.6*f)+.014*d*d,h},(o,s,h)=>(l[0]=j-h[1],l[1]=h[0]/ke,l[2]=3,l[3]=.5-.5*Math.cos(s*2*Math.PI),l));const v=b?11:7,B=b?10:6;for(const o of[-1,1]){const s=ot(.365,o*2.12),h=new t.Vector3(o*.74,-.52,-.42).normalize(),d=new t.Vector3(0,1,0).addScaledVector(h,-h.y).normalize(),F=new t.Vector3().crossVectors(h,d).normalize(),f=s.p.clone().addScaledVector(s.n,-.012);r.tube(v,B,(R,_,C)=>{const V=R/(v-1),q=_*2*Math.PI,oe=.026*Math.pow(Math.sin(Math.PI*(.06+.94*Math.pow(V,.7))*.985),.6)*(.55+.6*V)+4e-4,W=Math.cos(q)*oe-.02*V*V,U=Math.sin(q)*oe*.2,J=V*.098;return C[0]=f.x+h.x*J+d.x*W+F.x*U,C[1]=f.y+h.y*J+d.y*W+F.y*U,C[2]=f.z+h.z*J+d.z*W+F.z*U,C},(R,_,C)=>{const V=R/(v-1);return l[0]=j-C[1],l[1]=o*(2.12+V*1.1),l[2]=2,l[3]=(.5-.5*Math.cos(_*2*Math.PI))*V,l})}n.yield&&await n.yield();const Y=b?22:10,ae=b?10:6,z=o=>{const s=re(.062,.3,o),h=re(.0085,.025,Math.pow(o,1.6)),d=re(.008,.017,o),F=Math.pow(Math.sin(Math.min(1,o*9)*Math.PI/2),.6)*(1-.9*H(.9,1,o))+.001;return[s,h*F,d*F,-at(s)[1]+d*.25]};if(r.tube(Y,ae,(o,s,h)=>{const d=z(o/(Y-1)),F=s*2*Math.PI,f=Math.cos(F),R=Math.sin(F);return h[0]=d[1]*Math.sign(f)*Math.pow(Math.abs(f),.6),h[1]=j-d[0],h[2]=d[3]+d[2]*Math.sign(R)*Math.pow(Math.abs(R),.6),h},(o,s,h)=>{const d=s*2*Math.PI;return l[0]=j-h[1],l[1]=(h[0]>=0?1:-1)*3,l[2]=1,l[3]=.25+.75*Math.pow(Math.abs(Math.cos(d)),.7)*(Math.sin(d)>-.6?1:.5),l}),n.yield&&await n.yield(),n.teeth){const o=[.0042,.0036,.002,1e-4],s=[0,.4,.8,1];for(let h=0;h<18;h++)for(const d of[-1,1]){const F=.05+h/17*.62,f=z(F).slice(),R=.011*(.8+.4*a());r.tube(4,5,(_,C,V)=>{const q=C*2*Math.PI;return V[0]=d*f[1]*.62+Math.cos(q)*o[_],V[1]=j-f[0]+Math.sin(q)*o[_],V[2]=f[3]+f[2]*.8+s[_]*R,V},(_,C,V)=>(l[0]=j-V[1],l[1]=d*3,l[2]=4,l[3]=1,l))}}n.yield&&await n.yield();const O=await r.build(n.yield);return n.yield&&await n.yield(),O.boundingSphere=new t.Sphere(new t.Vector3(0,-.08,0),.75),O.boundingBox=new t.Box3(new t.Vector3(-.2,-.62,-.2),new t.Vector3(.2,.45,.2)),O}const Mt=`
attribute vec3 aEye;     // rho 0 (lid edge) .. 1 (rosette rim), psi, kind (0 lid, 1 eyeball)
uniform float uOpen;
varying vec3 vWp; varying vec3 vN; varying vec3 vE; varying float vFold;
#include <common>
#include <fog_pars_vertex>
float eyeFold(float rho, float psi){
  float rr = pow(rho, 0.8 + 0.45*uOpen);
  float ph = rr*(30.0 + 5.0*sin(psi*2.0 + 0.6)) + 1.6*sin(psi*3.0 + rr*4.0) + 0.9*sin(psi*7.0 + 1.3) + 0.5*sin(psi*13.0 - rr*9.0);
  float lidw = 0.3 + 0.7*abs(sin(psi))*(0.65 + 0.35*sin(psi*4.0 + rr*6.0 + 0.8));
  return sin(ph)*max(1.0 - rho, 0.0)*(0.35 + 0.65*smoothstep(0.0, 0.12, rho))*lidw;
}
vec3 eyeP(float rho, float psi){
  float ax = 0.092, bx = 0.004 + 0.064*uOpen;
  float c = cos(psi), s = sin(psi);
  float rin = ax*bx/sqrt(bx*bx*c*c + ax*ax*s*s);
  float r = mix(rin, 0.32*(1.0 + 0.06*sin(psi*3.0 + 0.7))*(0.86 + 0.2*c*c), pow(rho, 0.85));
  float z = 0.034*pow(max(1.0 - rho, 0.0), 1.6) - 0.022*uOpen*(1.0 - smoothstep(0.0, 0.07, rho));
  z += eyeFold(rho, psi)*0.0105*(0.55 + 0.75*uOpen)*smoothstep(0.0, 0.1, rho);
  vec3 p = vec3(r*s, r*c, z);
  p.z -= p.x*p.x*0.42 + 0.036*smoothstep(0.84, 1.0, rho);
  return p;
}
void main(){
  vec3 p = position; vec3 n = normal; vFold = 0.0;
  if (aEye.z < 0.5) {
    float rho = aEye.x, psi = aEye.y;
    p = eyeP(rho, psi);
    vec3 pr = eyeP(rho + 0.012, psi), pp = eyeP(rho, psi + 0.03);
    n = normalize(cross(pp - p, pr - p) + vec3(0.0, 0.0, 1e-7));
    if (n.z < 0.0) n = -n;
    vFold = eyeFold(rho, psi);
  }
  vE = vec3(aEye.x, aEye.y, aEye.z);
  vec4 wp = modelMatrix*vec4(p, 1.0);
  vWp = wp.xyz; vN = normalize(mat3(modelMatrix)*n);
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}
`,St=`
uniform vec3 uChar, uBone, uGaze; uniform float uOpen, uCatch;
varying vec3 vWp; varying vec3 vN; varying vec3 vE; varying float vFold;
#include <common>
#include <fog_pars_fragment>
${ge}
${ze}
void main(){
  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vWp);
  vec3 col;
  if (vE.z < 0.5) {
    float rho = vE.x;
    vec2 q = vec2(rho*0.32*sin(vE.y), rho*0.32*cos(vE.y));
    vec3 alb = uChar*(2.0 + 0.7*ssN(q*9.0 + 4.0)) + uBone*0.05;
    alb *= 0.5 + 0.5*smoothstep(-0.8, -0.3, vFold);            // fold creases
    alb = mix(alb, uBone*0.58, smoothstep(0.1, 0.65, vFold)*0.75*(1.0 - rho*0.5));   // pale fold crests: the ring that reads
    alb *= 0.4 + 0.6*smoothstep(0.0, 0.06, rho);               // dark wet lid edge
    alb = mix(alb, uChar*(0.95 + 1.1*ssN(q*0.55)) + uBone*0.03, smoothstep(0.72, 1.0, rho));
    col = ssLight(alb, N, V, vWp, 1.0);
  } else {
    float c = dot(N, normalize(uGaze));
    float iris = smoothstep(0.52, 0.62, c), pupil = smoothstep(0.88, 0.93, c);
    vec3 brown = vec3(0.075, 0.032, 0.012)*(0.6 + 0.8*ssN(N.xy*40.0 + N.z*17.0));
    vec3 alb = mix(vec3(0.42, 0.44, 0.42), brown, iris);
    alb = mix(alb, vec3(0.004, 0.003, 0.003), pupil);
    ssShadeK = 0.3;
    col = ssLight(alb, N, V, vWp, 1.0);
    vec3 Hf = normalize(V + 0.5*uSunDir + vec3(0.0, 0.28, 0.0));
    float sp = clamp(dot(N, Hf), 0.0, 1.0);
    float s2 = sp*sp; s2 *= s2; s2 *= s2; s2 *= s2;                           // ^16: a spark four or five pixels wide at the pass
    float hot = smoothstep(0.3, 0.8, s2);
    col += uSunCol*(uCatch*hot*smoothstep(0.15, 0.6, uOpen)*(1.0 - 0.5*uDeep)) + uFill*(0.16*s2);
  }
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}
`;function kt(){const a=[],w=[],l=[],b=[];for(let x=0;x<=20;x++)for(let y=0;y<=72;y++){const I=Math.pow(x/20,1.15),P=y/72*Math.PI*2;a.push(qe*I*Math.sin(P),qe*I*Math.cos(P),0),w.push(0,0,1),l.push(I,P,0)}for(let x=0;x<20;x++)for(let y=0;y<72;y++){const I=x*73+y,P=I+1,v=I+72+1,B=v+1;b.push(I,v,P,P,v,B)}const M=a.length/3,S=12,c=20,u=.074;for(let x=0;x<=S;x++)for(let y=0;y<=c;y++){const I=x/S*Math.PI*.6,P=y/c*Math.PI*2,v=Math.sin(I)*Math.cos(P),B=Math.sin(I)*Math.sin(P),Y=Math.cos(I);a.push(v*u,B*u*1.25,Y*u-.056),w.push(v,B,Y),l.push(0,0,1)}for(let x=0;x<S;x++)for(let y=0;y<c;y++){const I=M+x*(c+1)+y,P=I+1,v=I+c+1,B=v+1;b.push(I,v,P,P,v,B)}const k=new t.BufferGeometry;return k.setAttribute("position",new t.Float32BufferAttribute(a,3)),k.setAttribute("normal",new t.Float32BufferAttribute(w,3)),k.setAttribute("aEye",new t.Float32BufferAttribute(l,3)),k.setIndex(b),k.boundingSphere=new t.Sphere(new t.Vector3,.42),k}const zt=`
attribute vec4 aSheet;   // length m, width m, phase, curl
uniform float uTime, uInvL;
varying vec3 vWp; varying vec3 vN; varying vec2 vUv2; varying float vPh;
#include <common>
#include <fog_pars_vertex>
void main(){
  float u = position.y, v = position.x;
  float k = aSheet.w*(1.0 + 0.28*sin(uTime*1.3 + aSheet.z) + 0.12*sin(uTime*3.1 + aSheet.z*2.3 + u*3.0))*(0.35 + 0.65*u) + 0.05;
  float ku = k*u;
  float tw = 0.5*sin(uTime*0.9 + aSheet.z*1.7)*u*v;
  vec3 p = vec3(v*aSheet.y*(1.0 - 0.35*u*u), sin(ku)/k*aSheet.x, (1.0 - cos(ku))/k*aSheet.x + 0.004 + tw*aSheet.y);
  vec3 n = vec3(0.0, -sin(ku), cos(ku));
  vUv2 = vec2(v, u); vPh = aSheet.z;
  vec4 wp = modelMatrix*instanceMatrix*vec4(p*uInvL, 1.0);
  vWp = wp.xyz; vN = normalize(mat3(modelMatrix)*mat3(instanceMatrix)*n);
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}
`,Ft=`
uniform vec3 uBone;
varying vec3 vWp; varying vec3 vN; varying vec2 vUv2; varying float vPh;
#include <common>
#include <fog_pars_fragment>
${ge}
${ze}
void main(){
  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vWp);
  if (dot(N, V) < 0.0) N = -N;
  vec2 c = vec2(vUv2.x*2.0, max(0.0, vUv2.y*1.2 - 0.2));
  float rag = ssN(c*2.6 + vPh*7.0)*0.6 + ssN(c*6.3 + vPh*3.0)*0.4;
  float r = length(c) + (rag - 0.4)*0.75;
  float a = 1.0 - smoothstep(0.55, 0.72, r);
  float thin = smoothstep(0.2, 0.7, r);
  vec3 alb = uBone*(0.1 + 0.1*ssN(vUv2*vec2(7.0, 11.0) + vPh) + 0.12*thin);
  vec3 col = ssLight(alb, N, V, vWp, 1.0);
  float depth = max(uSurfaceY - vWp.y, 0.0);
  col += uSunCol*(0.09*uKey*exp(-depth/uFade)*(0.4 + ssCaustic(vWp)));     // light through the sheet
  gl_FragColor = vec4(col*(0.7 + 0.6*thin), a*(0.62 - 0.2*thin));
  #include <fog_fragment>
}
`,Bt=`
attribute vec4 aBody;    // t (0 head .. 1 tail), side, fin, 0
attribute vec3 aRem;     // phase, wriggle, tone
uniform float uTime;
varying vec3 vWp; varying vec3 vN; varying vec4 vBody; varying float vTone;
#include <common>
#include <fog_pars_vertex>
void main(){
  vec3 p = position; float t = aBody.x;
  p.x += aRem.y*t*t*sin(uTime*(2.2 + aRem.x*0.4) + aRem.x*6.0 - t*4.5);
  vBody = aBody; vTone = aRem.z;
  vec4 wp = modelMatrix*instanceMatrix*vec4(p, 1.0);
  vWp = wp.xyz; vN = normalize(mat3(modelMatrix)*mat3(instanceMatrix)*normal);
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}
`,Nt=`
uniform vec3 uChar, uBone;
varying vec3 vWp; varying vec3 vN; varying vec4 vBody; varying float vTone;
#include <common>
#include <fog_pars_fragment>
${ge}
${ze}
void main(){
  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vWp);
  if (dot(N, V) < 0.0) N = -N;
  float stripe = 1.0 - smoothstep(0.1, 0.3, abs(vBody.y));
  float edge = smoothstep(0.3, 0.42, abs(vBody.y))*(1.0 - smoothstep(0.5, 0.7, abs(vBody.y)));
  vec3 alb = mix(uBone*(0.2 + 0.08*vTone), uChar*0.3, stripe) + uBone*0.2*edge;
  alb = mix(alb, uChar*0.5 + uBone*0.12*vBody.w, vBody.z);
  gl_FragColor = vec4(ssLight(alb, N, V, vWp, 1.0), 1.0);
  #include <fog_fragment>
}
`;function At(){const n=nt(),r=[0,0,0,0],a=11;n.tube(a,7,(b,M,S)=>{const c=b/(a-1),u=M*2*Math.PI,k=.07*Math.pow(Math.sin(Math.PI*Math.min(1,.04+.96*Math.pow(c,.62))*.97),.75)*(1-.72*H(.35,.82,c))+.001,x=H(.8,1,c),y=k*(1-.85*x),I=k*.62*(1-x)+x*(.03+.085*(c-.8)/.2);return S[0]=Math.cos(u)*y,S[1]=.5-c-x*.035*(1-Math.abs(Math.sin(u))),S[2]=Math.sin(u)*I+k*.25*(1-x)-.01*H(.3,0,c),S},(b,M)=>{const S=b/(a-1);return r[0]=S,r[1]=Math.sin(M*2*Math.PI),r[2]=H(.8,.9,S),r[3]=Math.abs(Math.sin(M*2*Math.PI)),r});for(const b of[-1,1])n.tube(6,4,(M,S,c)=>{const u=M/5,k=S*2*Math.PI,x=.035*Math.sin(Math.PI*Math.pow(u,.6))+.001;return c[0]=Math.cos(k)*.003,c[1]=0-u*.32,c[2]=b*(.03*(1-u*.6)+x*(.5+.5*Math.sin(k)))+.012,c},(M,S)=>(r[0]=.5+M/5*.32,r[1]=1,r[2]=1,r[3]=.5+.5*Math.sin(S*2*Math.PI),r));const l=n.buildNow();return l.boundingSphere=new t.Sphere(new t.Vector3,.7),l}const Ae=[[52,-5,16],[38,-5.2,16],[24,-6,16.3],[8,-7,17],[-6,-7.6,17.6],[-13.7,-8.6,18.3],[-17.1,-10.6,20.5],[-19.1,-12.6,22.4],[-21.4,-15.5,24.5],[-22.7,-19,28.2],[-22.4,-23.5,32.8],[-17.5,-30.5,41],[-11,-37.5,43],[-5,-42.3,40.5],[-1.2,-45.1,35.5],[0,-46.3,32.1],[0,-46.1,27.3],[0,-43.3,23.6],[0,-32.5,15.7],[0,-21.8,7.9],[0,-11,0]],ie=Ae.map(n=>n.slice());ie[3]=[8,-7,18.3],ie[4]=[-6,-7.7,19.6],ie[5]=[-12.4,-8.9,20.4],ie[6]=[-16.2,-10.7,21.6],ie[7]=[-18.9,-12.6,23.6],ie[8]=[-20.6,-15.5,25.6];const qe=.32,$=Math.PI*2,te=Math.PI/180,Le=n=>n-Math.floor(n),st=n=>Le(Math.sin(n*127.1+311.7)*43758.5453);function Pt(n,r,a,w){let l=1e9;for(let b=0;b<Ae.length-1;b++){const M=Ae[b],S=Ae[b+1];for(let c=0;c<=8;c++){const u=c/8,k=re(M[0],S[0],u),x=re(M[1],S[1],u),y=re(M[2],S[2],u),I=Math.max(0,a-3+x,-x-w-3);l=Math.min(l,Math.hypot(k-n,y-r,I))}}return l}async function Vt(n,r={}){const a=n.rng.fork?n.rng.fork("standing-sleepers"):n.rng,w=n.quality?.detail??1,b=(r.palette&&r.palette.length>=7?r.palette:gt).map(e=>new t.Color(e)),[M,S,,,,c,u]=b,k=(r.sunDir?r.sunDir.clone():new t.Vector3(-.641,.731,.232)).normalize(),x=Math.round(ee(r.count??14,10,16)),y=Math.round(ee(r.headDown??2,0,3)),I=r.flexAt??.11,P=r.eyeAt??[.39,.44],v=r.rollAt??[.39,.47],B=r.calfAt??[.42,.5],Y=r.rollSign??1,ae=new t.Color("#16324A"),z={uTime:{value:0},uSurfaceY:{value:r.surfaceY??0},uKey:{value:3.6},uCaustic:{value:1.5},uRim:{value:1.7},uFade:{value:10},uDeep:{value:0},uRake:{value:0},uSunDir:{value:k},uSunCol:{value:M.clone()},uFill:{value:S.clone().multiplyScalar(1.15)},uDeepFill:{value:ae.clone().multiplyScalar(9).add(new t.Color(.1,.11,.12))},uShade:{value:new t.Color(.0457,.0684,.1054)}},O=()=>t.UniformsUtils.clone(t.UniformsLib.fog),o=e=>new t.ShaderMaterial({uniforms:Object.assign(O(),z,{uDisp:{value:e},uBump:{value:1.6},uChar:{value:c},uBone:{value:u},uSlate:{value:ae}}),vertexShader:yt,fragmentShader:xt,fog:!0}),s=[],h=e=>{const i=Object.assign({headDown:!1,girth:a.range(.95,1.07),seed:a.range(1,90),bobT:a.range(18,26),bobPh:a.range(0,$),turnAmp:a.range(.16,.3),turnPh:a.range(0,$),leanA:a.range(.03,.07),leanW:a.range(.07,.12),leanPh:a.range(0,$),flex:0,jaw:0,pale:0,furrow:1,swim:0,lod:2,role:"sleeper",matrix:new t.Matrix4},e);return i.turnW=a.range(.0087,.0175)/i.turnAmp,i.pivotY=-(i.top+(i.headDown?1-j:j)*i.L),s.push(i),i},d=h({x:29,z:9,L:12,headDown:y>=1,top:y>=1?6:7.5,yaw:-Math.PI/2+a.range(-.2,.2),role:"gateA",lod:1,turnAmp:.06}),F=h({x:21.5,z:23,L:12.5,top:8,yaw:a.range(-.25,.25),role:"gateB",lod:1,jaw:.14,turnAmp:.06}),f=h({x:-16,z:27,L:16,top:8,yaw:Math.atan2(.83,-.56)-28*te,role:"matriarch",lod:0,turnAmp:.035,leanA:.025,girth:1.03});h({x:-3,z:30,L:a.range(11.5,12.5),top:a.range(8.6,9.4),yaw:a.range(0,$),role:"neighbour"});const R=x-4,_=Math.min(R,Math.floor(R*48.7/305.4+.2)),C=R-_,V=[];{const e=a.shuffle([...Array(C).keys()].filter(i=>i>0&&i<C-1));for(let i=0;i<y-1;i++)V.push(e[i])}for(let e=0;e<R;e++){const i=e<_,m=i?47+(e+1)/(_+1)*48.7:120.6+(e-_+1)/(C+1)*256.7,A=!i&&V.includes(e-_),D=a.range(11,13),E=A?a.range(5.5,7):a.range(6.5,9.5);let g=0,p=0,N=a.range(27,33);for(let L=0;L<14;L++){const G=(m+a.range(-3.5,3.5))*te;if(g=Math.cos(G)*N,p=Math.sin(G)*N,Pt(g,p,E,E+D)>9)break;N=Math.min(36,N+.8)}h({x:g,z:p,L:D,top:E,headDown:A,yaw:a.range(0,$)})}for(const e of[331.5,208.5]){let i=null,m=1e9;for(let A=4;A<s.length;A++){const D=s[A];if(D.guard)continue;let E=Math.abs((Math.atan2(D.z,D.x)/te-e+540)%360-180);E<m&&(m=E,i=D)}!i||m>26||(i.guard=!0,i.x=Math.cos(e*te)*25.6,i.z=Math.sin(e*te)*25.6,i.headDown||(i.top=6.5),i.pivotY=-(i.top+(i.headDown?1-j:j)*i.L))}const q=[],oe=Math.round(ee(r.calves??1,1,2));for(let e=0;e<oe;e++)q.push({L:e===0?4:3.4,seed:a.range(1,90),girth:1.08,pale:1,furrow:.22,flex:0,jaw:0,swim:.1,lod:1,role:"calf",matrix:new t.Matrix4,calf:!0,headDown:!1});const W=new t.Group;W.name="standing-sleepers";const U=[{sides:w<1?88:104,rings:w<1?128:150,teeth:!0,disp:.055},{sides:56,rings:84,teeth:!0,disp:.05},{sides:w<1?28:32,rings:w<1?44:52,teeth:!1,disp:0}],J=[],de=s.concat(q);for(let e=0;e<3;e++){const i=de.filter(g=>g.lod===e),m=await bt({sides:U[e].sides,rings:U[e].rings,teeth:U[e].teeth,rng:a.fork("geo"+e),yield:n.yield?()=>n.yield():null}),A=new t.InstancedBufferAttribute(new Float32Array(i.length*4),4),D=new t.InstancedBufferAttribute(new Float32Array(i.length*4),4);A.setUsage(t.DynamicDrawUsage),i.forEach((g,p)=>{g.mesh=e,g.index=p,A.setXYZW(p,g.L,g.seed,0,g.swim),D.setXYZW(p,g.jaw,g.furrow,g.pale,g.calf?-1:g.top)}),m.setAttribute("aInst",A),m.setAttribute("aInst2",D);const E=new t.InstancedMesh(m,o(U[e].disp),i.length);E.frustumCulled=!1,E.name="sleepers-lod"+e,W.add(E),J.push({mesh:E,aInst:A,list:i}),await n.yield?.()}const rt=new t.Quaternion,ye=new t.Euler,Pe=new t.Vector3,ne=new t.Vector3,ve=new t.Vector3,T=new t.Vector3,K=new t.Vector3,Q=new t.Matrix4,lt=new t.Matrix4,We=new t.Vector3(0,1,0);function it(e,i,m,A){const D=.3*Math.sin(i*$/e.bobT+e.bobPh),E=e.yaw+e.turnAmp*Math.sin(i*e.turnW+e.turnPh)+m,g=e.leanA*Math.sin(i*e.leanW+e.leanPh),p=e.leanA*Math.cos(i*e.leanW*.83+e.leanPh*1.7);return ye.set(g+(e.headDown?Math.PI:0),E,p,"YXZ"),A.compose(ne.set(e.x,e.pivotY+D,e.z),rt.setFromEuler(ye),Pe.set(e.L*e.girth,e.L,e.L*e.girth))}const ct=e=>(ye.set(e.headDown?Math.PI:0,e.yaw,0,"YXZ"),new t.Matrix4().compose(new t.Vector3(e.x,e.pivotY,e.z),new t.Quaternion().setFromEuler(ye),new t.Vector3(e.L*e.girth,e.L,e.L*e.girth)));function Ie(e,i,m,A,D,E,g){const p=ot(e,i);return K.copy(p.n),T.copy(p.along).multiplyScalar(D?1:-1),E&&T.applyAxisAngle(K,E),ve.crossVectors(T,K).normalize(),T.crossVectors(K,ve).normalize(),g.makeBasis(ve,T,K).scale(Pe.set(m,m,m)).setPosition(p.p.addScaledVector(p.n,A)),p}const ce=new t.Group;ce.matrixAutoUpdate=!1,W.add(ce);const xe=Object.assign(O(),z,{uOpen:{value:0},uCatch:{value:5},uGaze:{value:new t.Vector3(0,0,1)},uChar:{value:c},uBone:{value:u}}),we=new t.Mesh(kt(),new t.ShaderMaterial({uniforms:xe,vertexShader:Mt,fragmentShader:St,fog:!0,side:t.DoubleSide})),Te=Ie(Ce,et,1/f.L,.006/f.L,!1,0,we.matrix);we.matrixAutoUpdate=!1,we.frustumCulled=!1,ce.add(we);const He=Te.p.clone(),je=Te.n.clone();if(r.sheets!==!1){const e=Math.round(40*w),i=new t.PlaneGeometry(1,1,3,7);i.translate(0,.5,0);const m=new t.InstancedBufferAttribute(new Float32Array(e*4),4);i.setAttribute("aSheet",m);const A=new t.InstancedMesh(i,new t.ShaderMaterial({uniforms:Object.assign(O(),z,{uInvL:{value:1/f.L},uBone:{value:u}}),vertexShader:zt,fragmentShader:Ft,fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide}),e);for(let D=0;D<e;D++){const E=a.range(.36,.84),g=(a.chance(.78)?1:-1)*a.range(.35,2.75);Ie(E,g,1,.002/f.L,a.chance(.75),a.range(-.7,.7),Q),A.setMatrixAt(D,Q);const p=.1+.2*Math.pow(a(),1.6);m.setXYZW(D,p,p*a.range(.55,1),a.range(0,$),a.range(1.6,3.8))}A.frustumCulled=!1,A.renderOrder=2,ce.add(A)}await n.yield?.();const he=[];let se=null;if(r.remoras!==!1){for(const m of s){const A=w<1?a.int(2,4):a.int(3,5);for(let D=0;D<A;D++){const E=a(),g=a.sign();let p=a.range(.14,.8),N=g*a.range(1.1,2);E>.45&&(N=g*a.range(2.3,2.95)),E>.8&&(p=a.range(.1,.25),N=g*a.range(2.35,2.75)),m===f&&Math.abs(p-Ce)<.09&&N>1.2&&(p+=.18);const L=a.range(.4,.7),G=a.chance(.2),Je=new t.Matrix4,mt=Ie(p,N,L/m.L,.012/m.L,G,a.range(-.3,.3),Je);he.push({w:m,A:Je,slide:mt.along.clone().multiplyScalar((G?1:-1)*L/m.L),period:a.range(16,34),ph:a(),phase:a.range(0,$),wr:a.range(.09,.16),tone:a()})}}const e=At(),i=new t.InstancedBufferAttribute(new Float32Array(he.length*3),3);he.forEach((m,A)=>i.setXYZ(A,m.phase,m.wr,m.tone)),e.setAttribute("aRem",i),se=new t.InstancedMesh(e,new t.ShaderMaterial({uniforms:Object.assign(O(),z,{uChar:{value:c},uBone:{value:u}}),vertexShader:Bt,fragmentShader:Nt,fog:!0}),he.length),se.frustumCulled=!1,se.instanceMatrix.setUsage(t.DynamicDrawUsage),W.add(se)}const ht=(e,i,m)=>new t.Vector3(f.x+Math.cos(e*te)*i,-m,f.z+Math.sin(e*te)*i),Ye=new t.Vector3(f.x-1.25,-19.98,f.z+1.43),ft=new t.Vector3(.12,.64,-.76).normalize(),ut=()=>[ht(88,4.2,19),new t.Vector3(f.x-1.6,-19.9,f.z+6.5),new t.Vector3(f.x-3,-20.9,f.z+5.5),new t.Vector3(f.x-2.1,-21.45,f.z+4),Ye.clone().addScaledVector(ft,-1.6),Ye.clone()],be=r.calfRoute?r.calfRoute.map(e=>new t.Vector3(e[0],e[1],e[2])):ut(),Ge=new t.CatmullRomCurve3(be,!1,"centripetal"),Oe=s[3];function pt(e,i,m,A,D){let E=.08;if(i===0){const g=H(B[0],B[1],A),p=4*g*(1-g);Ge.getPointAt(Math.min(.999,g),ne),Ge.getTangentAt(Math.min(.999,g),T);const N=1-H(0,.1,g),L=H(.8,1,g);ne.y+=N*.3*Math.sin(m*.37)+L*.3*Math.sin(m*$/f.bobT+f.bobPh),ne.addScaledVector(T,N*.4*Math.sin(m*.5)+L*(.07*Math.sin(m*1.1)-.05)),K.copy(We).addScaledVector(T,-T.y).normalize(),K.applyAxisAngle(T,L*.3*Math.sin(m*.31)),E=.08+.2*p}else{const g=m*.11+2,p=4.6+.6*Math.sin(m*.23);ne.set(Oe.x+Math.cos(g)*p,-(15+1.5*Math.sin(m*.17)),Oe.z+Math.sin(g)*p),T.set(-Math.sin(g),.1*Math.cos(m*.17),Math.cos(g)).normalize(),K.copy(We).addScaledVector(T,-T.y).normalize(),E=.17}return ve.crossVectors(T,K).normalize(),D.makeBasis(ve,T,K).scale(Pe.set(e.L*e.girth,e.L,e.L*e.girth)).setPosition(ne),E}let Me=null,Ve=null;const Ue=a.range(0,100),De=new t.Vector3,Ee=new t.Vector3,Re=new t.Vector3;function $e(e,i,m){z.uTime.value=i;const A=Me??Le(i/50+.3);for(const p of de)p.flex=0;const D=(A-(I-.03))/.08;if(D>0&&D<1)d.flex=.55*Math.sin($*D)*Math.sin(Math.PI*D);else if(Math.abs(A-I)>.09||Me==null){const N=Math.floor(i/30),L=(i-N*30-(8+st(N*3.1+Ue)*10))/6;if(L>0&&L<1){const G=s[Math.floor(st(N*7.7+Ue*1.3)*s.length)%s.length];G!==f&&(G.flex=.5*Math.sin($*L)*Math.sin(Math.PI*L))}}const E=H(v[0],v[1],A);for(const p of s)it(p,i,p===f?Y*8*te*E:0,p.matrix);q.forEach((p,N)=>{p.swim=pt(p,N,i,A,p.matrix)});for(const p of J){for(const N of p.list)p.mesh.setMatrixAt(N.index,N.matrix),p.aInst.setZ(N.index,N.flex),p.aInst.setW(N.index,N.swim);p.mesh.instanceMatrix.needsUpdate=!0,p.aInst.needsUpdate=!0}if(ce.matrix.copy(f.matrix),ce.matrixWorldNeedsUpdate=!0,se){for(let p=0;p<he.length;p++){const N=he[p],L=Le(i/N.period+N.ph),G=H(0,.07,L)-H(.5,.57,L);Q.copy(N.A),Q.elements[12]+=N.slide.x*G,Q.elements[13]+=N.slide.y*G,Q.elements[14]+=N.slide.z*G,se.setMatrixAt(p,lt.multiplyMatrices(N.w.matrix,Q))}se.instanceMatrix.needsUpdate=!0}const g=Ve??H(P[0],P[1],A);xe.uOpen.value=g,W.updateMatrixWorld(),Q.multiplyMatrices(W.matrixWorld,f.matrix),Ee.copy(He).applyMatrix4(Q),Re.copy(je).transformDirection(Q),m?De.copy(m.getWorldPosition(ne)).sub(Ee).normalize().multiplyScalar(.75*g).add(Re).normalize():De.copy(Re),xe.uGaze.value.copy(De)}const dt=e=>new t.Vector3(e[0],e[1],e[2]),_e=ct(f),Ke=He.clone().applyMatrix4(_e),Qe=je.clone().transformDirection(_e),vt=new t.Vector3(0,0,-1).transformDirection(_e),Se=e=>new t.Vector3(e.x,-e.top,e.z),Ze=e=>new t.Vector3(e.x,-(e.top+e.L*1.03),e.z),Xe={portalSeat:{position:new t.Vector3(0,-11,0),normal:new t.Vector3(0,-10.8,7.9).normalize(),radius:7},flyThrough:ie.map(dt),eye:{position:Ke,normal:Qe,radius:qe},gate:{a:Se(d),b:Se(F),mid:new t.Vector3((d.x+F.x)/2,-6,(d.z+F.z)/2)},matriarch:{nose:Se(f),flukes:Ze(f),axis:new t.Vector2(f.x,f.z),bellyDir:vt,eyeDir:Qe},calfRoute:be.map(e=>e.clone()),whales:s.map(e=>({position:new t.Vector3(e.x,e.pivotY,e.z),length:e.L,headDown:e.headDown,yaw:e.yaw,top:Se(e),bottom:Ze(e),role:e.role})),viewpoints:{entry:new t.Vector3(52,-5,16),gate:new t.Vector3(25,-6,16.2),eyePass:new t.Vector3(-18.9,-12.6,23.6),henge:new t.Vector3(0,-44,34)}},me=r.focus??"ring";let fe=new t.Vector3(0,-13,0),ue=24,pe=14;return me==="matriarch"?(fe=new t.Vector3(f.x,-17,f.z),ue=4,pe=14):me==="eye"?(fe=Ke.clone(),ue=.4,pe=2):me==="gate"?(fe=Xe.gate.mid.clone().setY(-10),ue=7,pe=12):me==="henge"?(fe=new t.Vector3(0,-12,0),ue=14,pe=-70):me==="calf"&&(fe=be[be.length-1].clone(),ue=1.5,pe=4),$e(0,0,null),{object:W,radius:ue,height:pe,center:fe,anchors:Xe,update:$e,dispose(){},ground:!1,groundY:-60,setProgress(e){Me=e==null?null:ee(e,0,1)},setEyeOpen(e){Ve=e==null?null:ee(e,0,1)},setLight(e={}){e.sunDir&&z.uSunDir.value.copy(e.sunDir).normalize(),e.sunColor&&z.uSunCol.value.set(e.sunColor),e.fill&&z.uFill.value.set(e.fill),e.deepFill&&z.uDeepFill.value.set(e.deepFill),e.shade&&z.uShade.value.set(e.shade),e.key!=null&&(z.uKey.value=e.key),e.rim!=null&&(z.uRim.value=e.rim),e.caustics!=null&&(z.uCaustic.value=e.caustics),e.fadeDepth!=null&&(z.uFade.value=Math.max(.5,e.fadeDepth)),e.surfaceY!=null&&(z.uSurfaceY.value=e.surfaceY),e.catchlight!=null&&(xe.uCatch.value=e.catchlight),e.deep!=null&&(z.uDeep.value=ee(e.deep,0,1)),e.rake!=null&&(z.uRake.value=ee(e.rake,0,2))},eyeWorld(e=new t.Vector3){return e.copy(Ee)},calfWorld(e=new t.Vector3){return e.setFromMatrixPosition(q[0].matrix).applyMatrix4(W.matrixWorld)},uniforms:z,extent:{radius:36,top:-5.5,bottom:-26.5},sleepers:s,calves:q}}export{Vt as buildHero};
