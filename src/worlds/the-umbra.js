import*as a from"three";import{makePath as Ot,makeRng as Ve,clamp as _,lerp as F,smoothstep as Z}from"../kit/core.js";import"../kit/fx.js";import{buildHero as Pe,UMBRA_GLSL as le,UMBRA_CHUNKS as Te}from"../parts/the-umbra.js";const at=Math.PI*2,Fe=Math.PI/180,yt=new a.Vector3(395,-300,-1370),ct={x:-1150,z:-2500},wt={x:1500,z:-2300},Ie=37e-5,ce=.39,{NOISE_GLSL:Ft,SKY_GLSL:De,CLOUD_GLSL:Re,FOG_APPLY:qt}=Te,Nt=le+Ft+De+Re,Be=`
attribute float aPart; attribute vec2 aCtl;
uniform vec4 uCtl;      // left aileron, right aileron, spoilers (radians), wing flex (m at the tip)
uniform float uSpan;
varying vec3 vObj, vW, vN; varying float vPart;
#include <fog_pars_vertex>
void main(){
  vec3 p = position; vec3 n = normal;
  float d = aCtl.y < 0.5 ? 0. : aCtl.y < 1.5 ? uCtl.x : aCtl.y < 2.5 ? uCtl.y : -abs(uCtl.z);
  p.y -= max(p.z - aCtl.x, 0.) * d;                       // control surfaces hinge about a spanwise line
  float sx = abs(p.x) / max(uSpan, 1.);
  p.y += uCtl.w * sx * sx;                                // the long wings flex
  vObj = position;
  vec4 wp = modelMatrix * vec4(p, 1.);
  vW = wp.xyz; vN = mat3(modelMatrix) * n; vPart = aPart;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,_e=`
uniform vec3 uSkin, uTrim;
uniform vec4 uLiv;      // x gloss 0..1, y panel-line strength, z frost, w fuselage axis height (object y)
uniform vec4 uGrid;     // x rib spacing, y frame spacing, z gores (balloon), w cheat-line half height
varying vec3 vObj, vW, vN; varying float vPart;
#include <fog_pars_fragment>
${Nt}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) N = -N;
  vec3 Vv = cameraPosition - vW;
  vec3 V = Vv / max(length(Vv), 1e-3);
  float px = max(length(dFdx(vW)), length(dFdy(vW)));
  vec2 um = umbra2(vW);
  float lit = clamp(um.x * (1. + (umbraBands(vW, px) - 1.) * 2.6), 0., 1.2);
  // ---- surface
  vec3 alb = uSkin; float gloss = uLiv.x;
  vec2 g = vec2(vObj.x / uGrid.x + 0.5, vObj.z / uGrid.y);
  vec2 gw = fwidth(g) + 1e-4;
  vec2 gd = abs(fract(g - 0.5) - 0.5);
  float lines = max(1. - smoothstep(0.006, 0.006 + gw.x * 1.5, gd.x), 1. - smoothstep(0.005, 0.005 + gw.y * 1.5, gd.y));
  lines *= (1. - smoothstep(0.15, 0.5, max(gw.x, gw.y))) * uLiv.y;
  float fr0 = vn3(vObj * 0.8) * 0.6 + vn3(vObj * 2.7 + 4.) * 0.4;
  float frost = smoothstep(0.35, 0.8, fr0) * uLiv.z * smoothstep(0.1, 0.7, N.y);
  float isSkin = step(vPart, 0.5) + step(3.5, vPart) * step(vPart, 4.5);
  float ga = atan(vObj.z, vObj.x + 1e-5) * uGrid.z / 6.28318;
  float gaw = min(fwidth(ga), 0.5);
  float cw = fwidth(vObj.y) + 1e-4;
  if (vPart > 0.5 && vPart < 1.5) { alb = vec3(0.035, 0.04, 0.05); gloss = 0.15; }
  else if (vPart > 1.5 && vPart < 2.5) { alb = vec3(0.012, 0.016, 0.024); gloss = 1.; }
  else if (vPart > 2.5 && vPart < 3.5) { alb = vec3(0.56, 0.58, 0.62); gloss = 0.85; }
  else if (vPart > 4.5 && vPart < 5.5) { alb = uTrim; }
  else if (vPart > 5.5) {
    float gdd = abs(fract(ga) - 0.5);
    float gl2 = smoothstep(0.5 - gaw * 1.5 - 0.03, 0.5, gdd) * (1. - smoothstep(0.2, 0.45, gaw));
    float puff = 0.5 + 0.5 * cos(fract(ga) * 6.28318);
    alb = vec3(0.80, 0.79, 0.76) * (0.82 + 0.18 * puff) * (1. - 0.3 * gl2); gloss = 0.5;
  }
  if (vPart > 3.5 && vPart < 4.5) {
    float cy = abs(abs(vObj.y - uLiv.w) - uGrid.w * 3.3);
    alb = mix(alb, uTrim, (1. - smoothstep(uGrid.w - cw, uGrid.w + cw, cy)) * step(uLiv.w, vObj.y));
  }
  alb = mix(alb, alb * 0.55, lines * isSkin);
  alb = mix(alb, vec3(0.78, 0.83, 0.9), frost * isSkin * 0.22);
  gloss *= 1. - 0.5 * frost * isSkin;
  // ---- sunlit: one hard silver key from ahead, cobalt shade, the sky in the gloss
  vec3 key = mix(uKey, uGold, um.y) * sunOcc(vW);
  float ndl = max(dot(N, uSunDir), 0.);
  float up = N.y * 0.5 + 0.5;
  vec3 H = normalize(V + uSunDir + vec3(0., 1e-4, 0.));
  float ndh = max(dot(N, H), 0.);
  float fres = 1. - max(dot(N, V), 0.); float fr2 = fres * fres; float fr4 = fr2 * fr2;
  vec3 R = reflect(-V, N);
  float rel = degrees(asin(clamp(R.y, -1., 1.)));
  float rsz = dot(normalize(R.xz + vec2(1e-5, 0.)), normalize(uSunDir.xz));
  vec3 amb = mix(uShade * 0.75, uSkyA[2] * 0.62 + uSkyA[1] * 0.25, up);
  vec3 cl = alb * (key * 1.5 * ndl + amb * 1.15);
  cl += key * (pow(ndh, mix(14., 120., gloss)) * (0.2 + 1.3 * gloss) + 0.12 * fr4 * max(dot(-V, uSunDir), 0.));
  cl += skyLitC(rel, rsz) * (0.04 + 0.5 * fr4) * (0.25 + 0.75 * gloss);
  cl += vec3(0.9, 0.95, 1.) * frost * isSkin * pow(ndh, 30.) * 0.5;
  float film = step(5.5, vPart);                             // the balloon's film glows where the sun stands behind it
  float back = max(dot(-V, uSunDir), 0.);
  cl += film * key * vec3(1., 0.97, 0.9) * (0.2 + 0.55 * back * back) * (0.55 + 0.45 * fres);
  // ---- in the umbra: a slate silhouette, copper along every edge that faces the ring, a pearl glint from the corona
  float hor = 1. - abs(N.y);
  vec3 cd = (alb * 0.75 + 0.03) * mix(uWarm * 0.8, uCool * 0.85, up) * 0.9;
  cd += (alb * 0.6 + 0.08) * uSkyB[3] * (0.55 * hor * hor * hor + 0.9 * fr4);
  cd += uPearl * (pow(ndh, mix(20., 90., gloss)) * (0.25 + 0.7 * gloss) + 0.06 * ndl);
  cd += skyTotal(max(rel, 0.), rsz) * fr4 * 0.35 * gloss;
  cd *= mix(0.5, 1., uUmbra.w);
  cd = mix((alb * 0.8 + 0.02) * uSkyA[3] * 1.5 * (0.45 + 0.6 * up), cd, uCam.x);
  vec3 col = mix(cd, cl, lit);
  vec3 hz = hazeAt(vW, -Vv, um.x);
  ${qt}
  gl_FragColor = vec4(col, 1.);
}`,Ue=`
attribute vec3 aTan; attribute vec3 aInfo;   // x side -1..1, y track distance, z jet index + seed fraction
uniform float uHead[4]; uniform float uTime;
varying vec3 vW; varying vec3 vT;            // vT: x across, y age (m), z seed
#include <fog_pars_vertex>
void main(){
  int k = int(floor(aInfo.z + 0.01));
  float head = k == 0 ? uHead[0] : k == 1 ? uHead[1] : k == 2 ? uHead[2] : uHead[3];
  float age = head - aInfo.y;
  float sd = fract(aInfo.z) * 10.;
  vec3 c = position;
  float curl = smoothstep(20., 500., age);
  c.x += curl * (3.2 * sin(aInfo.y * 0.021 + sd * 9. + uTime * 0.25) + 1.4 * sin(aInfo.y * 0.057 + sd * 4.));
  c.y += curl * (1.6 * sin(aInfo.y * 0.033 + sd * 5. + uTime * 0.2)) - age * 0.004;
  vec3 toC = cameraPosition - c;
  float dist = max(length(toC), 1e-3);
  vec3 sideV = cross(aTan, toC / dist);
  sideV = sideV / max(length(sideV), 1e-3);
  float w = 0.4 + 0.034 * pow(max(age, 0.), 0.75);
  w = max(min(w, 9.), dist * 0.0016) * step(0., age);
  vec3 wp = c + sideV * aInfo.x * w;
  vW = wp; vT = vec3(aInfo.x, age, sd);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Le=`
varying vec3 vW; varying vec3 vT;
#include <fog_pars_fragment>
${Nt}
void main(){
  if (vT.y < 0.) discard;
  vec3 Vv = cameraPosition - vW; float dist = length(Vv);
  float prof = 1. - vT.x * vT.x; prof *= prof;
  float n = vn3(vec3(vW.x * 0.11, vW.z * 0.045, vT.z * 7.) + vec3(0., 0., uTime * 0.05));
  float n2 = vn3(vec3(vW.x * 0.4, vW.z * 0.19, vT.z * 3.));
  float a = prof * (0.25 + 0.9 * n) * (0.7 + 0.45 * n2) * 0.8;
  a *= smoothstep(2., 14., vT.y) * (1. - smoothstep(700., 1900., vT.y)) * mix(1., 0.6, smoothstep(40., 500., vT.y));
  a *= smoothstep(5., 30., dist);
  vec2 um = umbra2(vW);
  vec3 key = mix(uKey, uGold, um.y);
  float toSun = max(dot(-Vv / max(dist, 1e-3), uSunDir), 0.);
  vec3 cl = key * (0.6 + 0.5 * toSun * toSun) + uShade * 0.35;
  vec3 cd = mix(uSkyA[3] * 1.7, mix(uCool * 0.7, uSkyB[3] * 0.75, 0.45 + 0.4 * (1. - prof)) * mix(0.5, 1., uUmbra.w), uCam.x);
  vec3 col = mix(cd, cl, um.x);
  vec3 hz = hazeAt(vW, -Vv, um.x);
  ${qt}
  gl_FragColor = vec4(col, clamp(a, 0., 0.78));
}`,je=`
varying vec3 vW;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.);
  vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,We=`
uniform vec4 uDeck;   // x coverage 0..1, y street angle, z gravity-wave strength, w extra haze
varying vec3 vW;
#include <fog_pars_fragment>
${Nt}
float dfbm(vec3 p){ return vn3(p) * 0.5 + vn3(p * 2.03 + 7.1) * 0.27 + vn3(p * 4.1 + 3.3) * 0.15 + vn3(p * 8.3 + 1.7) * 0.08; }
void main(){
  vec3 Vv = cameraPosition - vW; float dist = length(Vv);
  vec3 V = Vv / max(dist, 1e-3);
  float ca = cos(uDeck.y), sa = sin(uDeck.y);
  vec2 q = vec2(ca * vW.x + sa * vW.z, -sa * vW.x + ca * vW.z) + vec2(uTime * 9., uTime * 2.);
  float streets = 0.5 + 0.5 * sin(q.y / 95. + 2.2 * vn3(vec3(q / 520., 3.)) + 1.3 * vn3(vec3(q / 190., 9.)));
  float body = dfbm(vec3(q.x / 640., q.y / 300., uTime * 0.01));
  float big = vn3(vec3(q / 1900., 5.));
  float dens = body * 0.75 + streets * 0.3 + (big - 0.5) * 0.9 + (uDeck.x - 0.5) * 1.1;
  float waves = sin(q.x / 60. + 3. * vn3(vec3(q / 800., 1.))) * uDeck.z;
  float cov = smoothstep(0.42, 0.62, dens + waves * 0.06);
  float relief = dfbm(vec3(q.x / 150., q.y / 120., 4.)) + waves * 0.35;
  vec2 um = umbra2(vW);
  vec3 key = mix(uKey, uGold, um.y);
  float toSun = max(dot(-V, uSunDir), 0.);
  // sea: steel dark with a wide soft glitter path under the sun
  vec3 R = reflect(-V, normalize(vec3((vn3(vec3(q / 9., uTime * 0.3)) - 0.5) * 0.25, 1., (vn3(vec3(q / 11., 4. + uTime * 0.3)) - 0.5) * 0.25)));
  float gl = pow(max(dot(R, uSunDir), 0.), 26.);
  vec3 seaL = vec3(0.022, 0.045, 0.08) + key * gl * 0.55;
  vec3 seaD = mix(uSkyA[3] * 4.3 + uSkyB[1] * 0.36, uSkyB[1] * 0.42, uCam.x) + uSkyB[3] * 0.05 * uCam.x;
  vec3 cldL = (uShade * 0.9 + key * 0.5) * (0.45 + 0.75 * relief) * (0.6 + 0.4 * smoothstep(0.5, 0.9, dens)) + key * 0.25 * toSun * toSun * relief;
  vec3 cldD = mix(uSkyA[3] * 4.1 + uSkyA[2] * 0.036, mix(uWarm * 0.75, uCool * 0.6, relief) * mix(0.5, 1., uUmbra.w), uCam.x) * (0.5 + 0.7 * relief);
  vec3 col = mix(mix(seaD, seaL, um.x), mix(cldD, cldL, um.x), cov);
  vec3 hz = hazeAt(vW, -Vv, um.x);
  col = mix(col, hz, max(uDeck.w, (1. - um.x) * (1. - uCam.x) * 0.5 * (1. - exp(-dist / 1400.))));
  ${qt}
  gl_FragColor = vec4(col, 1.);
}`,Ge=`
attribute vec3 aPos; attribute vec4 aCol; attribute vec3 aBlink;   // aCol.w size (m); aBlink: period, phase, sharpness (0 = steady)
uniform float uTime, uGain;
varying vec2 vUv; varying vec3 vC;
void main(){
  float b = 1.;
  if (aBlink.x > 0.) { float s = 0.5 + 0.5 * sin((uTime / aBlink.x + aBlink.y) * 6.28318); b = pow(s, aBlink.z); }
  vec4 mv = modelViewMatrix * vec4(aPos, 1.);
  float sz = max(aCol.w, -mv.z * 0.004);
  mv.xy += position.xy * sz;
  mv.z += aCol.w * 0.4;
  vUv = position.xy; vC = aCol.rgb * (0.12 + 0.88 * b) * uGain;
  gl_Position = projectionMatrix * mv;
}`,Ee=`
varying vec2 vUv; varying vec3 vC;
uniform float uCore;
void main(){
  float d = dot(vUv, vUv);
  float g = exp(-d * mix(3.6, 5.5, uCore)) * 0.55 + exp(-d * 40.) * 1.6 * uCore;
  g *= 1. - smoothstep(0.7, 1., d);
  gl_FragColor = vec4(vC * g, 1.);
}`,Oe=`
attribute float aK;
uniform vec4 uSpA, uSpB;   // xyz base centre (world), w level
uniform vec2 uSpSize;
varying vec2 vUv; varying float vL, vK;
void main(){
  vec4 s = aK < 0.5 ? uSpA : uSpB;
  vec3 toC = cameraPosition - s.xyz; toC.y = 0.;
  vec3 fw = toC / max(length(toC), 1e-3);
  vec3 rt = vec3(fw.z, 0., -fw.x);
  vec3 wp = s.xyz + rt * position.x * uSpSize.x + vec3(0., 1., 0.) * (position.y * 0.5 + 0.5) * uSpSize.y;
  vUv = position.xy; vL = s.w; vK = aK;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
}`,qe=`
uniform vec3 uRose; uniform float uTime;
varying vec2 vUv; varying float vL, vK;
${Ft}
void main(){
  if (vL < 0.003) discard;
  float x = vUv.x, y = vUv.y * 0.5 + 0.5;          // y 0 at the tendril tips, 1 above the crown
  float sd = vK * 7.3 + 1.;
  // a cluster of "carrots": each a bright head, a diffuse plume above it and two tendrils forking below
  float body = 0., low = 0., high = 0.;
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    float xi = (h31(vec3(fi, sd, 1.)) - 0.5) * 1.05 + (fi - 3.) * 0.06;
    float hi = (0.62 + 0.38 * h31(vec3(fi, sd, 2.))) * (1. - 0.45 * abs(xi));
    float amp = 0.45 + 0.55 * h31(vec3(fi, sd, 3.));
    float yy = y / max(hi, 0.2);
    float dx = x - xi - 0.02 * sin(y * 13. + fi * 2.1);
    float fork = max(0.52 - yy, 0.) * 0.2;
    float dt = abs(dx) - fork;
    float wd = mix(0.008, 0.05, smoothstep(0.3, 0.66, yy)) * (1. + 2.2 * smoothstep(0.68, 1., yy));
    float core = exp(-dt * dt / (wd * wd));
    float headP = exp(-(yy - 0.64) * (yy - 0.64) / 0.012);
    float prof = smoothstep(0.02, 0.3, yy) * (1. - smoothstep(0.7, 1.02, yy));
    body += core * amp * (0.9 * headP + 0.22 * prof);
    low += core * amp * prof * (1. - smoothstep(0.3, 0.6, yy)) * 0.75;
    high += exp(-dx * dx / 0.03) * amp * smoothstep(0.55, 0.8, yy) * (1. - smoothstep(0.8, 1.05, yy)) * 0.16;
  }
  float beads = 0.7 + 0.5 * vn3(vec3(x * 40., y * 22., sd));
  float haze = exp(-x * x * 2.6) * smoothstep(0.15, 0.6, y) * (1. - smoothstep(0.6, 0.97, y)) * 0.1;
  float edge = (1. - smoothstep(0.82, 1., abs(x))) * (1. - smoothstep(0.93, 1., y)) * smoothstep(0., 0.04, y);
  vec3 colHot = mix(uRose, vec3(1., 0.74, 0.66), 0.4);
  vec3 colLow = mix(uRose, vec3(0.5, 0.25, 0.95), 0.55);
  vec3 col = colHot * body * beads * 1.5 + colLow * low * beads * 1.3 + mix(uRose, vec3(1., 0.2, 0.25), 0.4) * (high + haze);
  gl_FragColor = vec4(col * vL * edge, 1.);
}`,Ne=`
varying vec2 vUv; varying vec3 vW;
void main(){
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.);
  vW = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Ke=`
uniform float uVap; uniform vec3 uVapCol;
varying vec2 vUv; varying vec3 vW;
${le}${Ft}
void main(){
  if (uVap < 0.004) discard;
  float n = vn3(vec3(vUv.x * 5., vUv.y * 2.2 - uTime * 3.4, uTime * 0.7)) * 0.6 + vn3(vec3(vUv.x * 13., vUv.y * 5. - uTime * 6., 2.)) * 0.4;
  float env = smoothstep(0., 0.2, vUv.x) * (1. - smoothstep(0.75, 1., vUv.x)) * smoothstep(0., 0.12, vUv.y) * (1. - smoothstep(0.25, 1., vUv.y));
  float a = env * smoothstep(0.35, 0.8, n + uVap * 0.3) * uVap * 0.62;
  gl_FragColor = vec4(uVapCol * a, a);
}`;function Kt(){const o=[],u=[],p=[],t=[],s={pos:o,part:u,ctl:p,idx:t,loft(r,e,c={}){const l=r[0].length,i=o.length/3;for(const y of r)for(const d of y)o.push(d[0],d[1],d[2]),u.push(d[3]??e),p.push(d[4]??0,d[5]??0);for(let y=0;y<r.length-1;y++)for(let d=0;d<l;d++){const g=i+y*l+d,M=i+y*l+(d+1)%l,V=g+l,C=M+l;c.flip?t.push(g,M,V,M,C,V):t.push(g,V,M,M,V,C)}for(const[y,d]of[[c.capA,0],[c.capB,r.length-1]]){if(!y)continue;const g=r[d],M=o.length/3;let V=0,C=0,z=0;for(const f of g)V+=f[0]/l,C+=f[1]/l,z+=f[2]/l;o.push(V,C,z),u.push(e),p.push(0,0);for(let f=0;f<l;f++){const m=i+d*l+f,v=i+d*l+(f+1)%l;d===0!=!!c.flip?t.push(M,m,v):t.push(M,v,m)}}},tube(r,e,c,l,i,y,d,g=[1,1]){const M=[];for(let V=0;V<=c;V++){const C=V/c,z=i(C),f=y(C),m=[];for(let v=0;v<l;v++){const S=v/l*at;m.push([f[0]+Math.cos(S)*z*g[0],f[1]+Math.sin(S)*z*g[1],F(r,e,C),typeof d=="function"?d(C,S):d])}M.push(m)}s.loft(M,0,{capA:!0,capB:!0,flip:e>r})},wing(r,e,c,l,i=!1){const y=[];r.forEach((g,M)=>{const V=[],C=l?l(M,g):null;for(let z=0;z<e;z++){const f=z/e*at,m=.5-.5*Math.cos(f),v=g.thick*g.chord*.5*Math.sin(f)*Math.pow(Math.max(1-m,0),.42)*1.9*Math.sqrt(Math.max(m,0)+.02),S=g.zle+m*g.chord,k=i?[g.y+v,g.x,S]:[g.x,g.y+v,S];let T=typeof c=="function"?c(M,m):c;C&&m>=C[0]?k.push(T,g.zle+C[0]*g.chord,C[1]):k.push(T,0,0),V.push(k)}y.push(V)});const d=i?r[r.length-1].x<r[0].x:r[r.length-1].x>r[0].x;s.loft(y,0,{capA:!0,capB:!0,flip:d})},geometry(){const r=new a.BufferGeometry;return r.setAttribute("position",new a.BufferAttribute(new Float32Array(o),3)),r.setAttribute("aPart",new a.BufferAttribute(new Float32Array(u),1)),r.setAttribute("aCtl",new a.BufferAttribute(new Float32Array(p),2)),r.setIndex(t),r.computeVertexNormals(),r}};return s}async function He(o){const u=Kt(),p=-5.3,t=e=>{const c=Math.pow(_(e/.2,0,1),.62),l=1-.62*Math.pow(_((e-.6)/.4,0,1),1.5);return Math.max(.03,.74*c*l)};u.tube(-18.6,1.9,56,26,t,e=>[0,p+.25*Math.pow(_((e-.55)/.45,0,1),2)],(e,c)=>e<.028||e>.028&&e<.1&&Math.sin(c)>.8?1:4,[1,1.08]),await o.yield(),u.tube(-16.75,-14.2,14,14,e=>.5*Math.pow(Math.sin(Math.PI*_(e,.02,.98)),.55),e=>[0,p+.47+.1*Math.sin(Math.PI*e)],e=>e>.45&&e<.52?4:2,[.82,.9]),u.tube(-14.3,-6.5,14,10,e=>.3*Math.pow(1-e,.5)+.02,e=>[0,p+.58],4,[1,.8]);for(const e of[-1,1])u.tube(-13.9,-10.2,12,12,c=>.33*Math.pow(Math.sin(Math.PI*_(c*.9+.1,0,1)),.5),c=>[e*.78,p+.02],c=>c<.08?1:4,[.75,1.05]);await o.yield();for(const e of[-1,1]){const c=[];for(let i=0;i<=30;i++){const y=i/30,d=F(.45,15.5,y);c.push({x:e*d,y:p+.2+.012*d,zle:-13.35+.085*d,chord:F(3.05,1.05,Math.pow(y,.9))*(y>.985?.6:1),thick:F(.12,.085,y)})}await o.yield(),u.wing(c,16,(i,y)=>y<.035?3:i>=29?5:0,i=>i>=19&&i<=28?[.74,e<0?1:2]:i>=9&&i<=15?[.6,3]:null),await o.yield(),u.tube(-15.9,-10.4,20,14,i=>.4*Math.pow(Math.sin(Math.PI*_(i*.93+.035,0,1)),.45),i=>[e*5,p+.2],i=>i<.07?1:i>.3&&i<.36?5:0),u.tube(-12.3,-10.6,6,8,i=>.13*Math.sin(Math.PI*_(i,.05,.95)),i=>[e*15.5,p+.3],3);const l=[];for(let i=0;i<=6;i++){const y=i/6;l.push({x:e*F(.2,3.3,y),y:-4.25,zle:-.9+.8*y,chord:F(1.9,1,y),thick:.09})}u.wing(l,10,0,null)}await o.yield();const s=[];for(let e=0;e<=8;e++){const c=e/8;s.push({x:F(-4.7,-.55,c),y:0,zle:-2.6+2.3*c,chord:F(3.6,1.3,c),thick:.08})}u.wing(s,12,e=>e>=5&&e<=6?5:0,null,!0),u.tube(-.5,.45,6,8,e=>.1*Math.sin(Math.PI*_(e,.1,.9))+.02,()=>[0,-.32],1);for(const[e,c]of[[-11.6,.42],[-8.9,.36],[-5.2,.3]]){const l=[{x:p+.6,y:0,zle:e,chord:.42,thick:.14},{x:p+.6+c,y:0,zle:e+.16,chord:.2,thick:.12}];u.wing(l,6,1,null,!0)}u.tube(-7.9,-7,6,10,e=>.3*Math.sin(Math.PI*_(e,.04,.96)),()=>[0,p+.62],3,[1,.7]),await o.yield();const r=u.geometry();return await o.yield(),{geometry:r,axis:p}}function ue(o){const u=Kt(),p=o.length,t=o.span/2,s=o.radius;u.tube(-p*.52,p*.48,22,14,e=>Math.max(.03,s*Math.pow(_(e/.16,0,1),.6)*(1-.7*Math.pow(_((e-.62)/.38,0,1),1.4))),e=>[0,.3*s*Math.pow(_((e-.6)/.4,0,1),2)],(e,c)=>e>.05&&e<.13&&Math.sin(c)>.72?2:4);for(const e of[-1,1]){const c=[];for(let i=0;i<=10;i++){const y=i/10,d=F(s*.5,t,y);c.push({x:e*d,y:-.15*s+(o.dihedral??.03)*d,zle:-o.chord*.42+o.sweep*d,chord:F(o.chord,o.chord*o.taper,y),thick:.11})}u.wing(c,10,(i,y)=>y<.04?3:0,null);for(const i of o.engines){const y=e*i*t,d=-o.chord*.3+o.sweep*i*t;u.tube(d-o.nacelle*.62,d+o.nacelle*.38,10,10,g=>o.nacR*Math.pow(Math.sin(Math.PI*_(g*.8+.14,0,1)),.4),()=>[y,-.15*s+(o.dihedral??.03)*i*t-(o.nacDrop??0)],g=>g<.07||g>.93?1:3)}const l=[];for(let i=0;i<=4;i++){const y=i/4;l.push({x:e*F(.2,t*.36,y),y:o.tailY??.5*s,zle:p*.36+o.sweep*1.6*t*.36*y,chord:F(o.chord*.55,o.chord*.3,y),thick:.09})}u.wing(l,8,0,null)}const r=[];for(let e=0;e<=5;e++){const c=e/5;r.push({x:F(.4*s,.4*s+o.fin,c),y:0,zle:p*.3+o.fin*.5*c,chord:F(o.chord*.75,o.chord*.36,c),thick:.09})}return u.wing(r,8,e=>e>=3?5:0,null,!0),u.geometry()}function Xe(){const o=Kt(),u=[];for(let s=0;s<=40;s++){const r=s/40,e=Math.max(.05,40*Math.pow(Math.sin(Math.PI*Math.pow(r,1.55)),.72)),c=F(-62,58,r)-6*Math.pow(r,6),l=[];for(let i=0;i<48;i++){const y=i/48*at,d=1+.035*Math.cos(y*24)*Math.sin(Math.PI*r);l.push([Math.cos(y)*e*d,c,Math.sin(y)*e*d,6])}u.push(l)}o.loft(u,6,{capA:!0,capB:!0});const p=[];for(let s=0;s<=6;s++){const r=F(-61,-118,s/6),e=[];for(let c=0;c<6;c++){const l=c/6*at;e.push([Math.cos(l)*.4,r,Math.sin(l)*.4,1])}p.push(e)}o.loft(p,1,{});const t=[];for(let s=0;s<=6;s++){const r=s/6,e=2.6*Math.pow(Math.sin(Math.PI*_(r,.06,.94)),.3),c=[];for(let l=0;l<8;l++){const i=l/8*at+.39;c.push([Math.cos(i)*e,-118-5*r,Math.sin(i)*e,r>.3&&r<.7?5:3])}t.push(c)}return o.loft(t,3,{capA:!0,capB:!0}),o.geometry()}const gt=o=>Math.sqrt(o*o+.012)-.11,fe=o=>(o.ni+1)*o.nj;function de(o,u,p,t){for(let s=0;s<p;s++)for(let r=0;r<t;r++){const e=u+s*t+r,c=u+s*t+(r+1)%t,l=e+t,i=c+t;o.idx[o.ni++]=e,o.idx[o.ni++]=l,o.idx[o.ni++]=c,o.idx[o.ni++]=c,o.idx[o.ni++]=l,o.idx[o.ni++]=i}}function he(o,u,p,t){const s=o.pos,r=o.nor;for(let e=0;e<=p;e++){const c=Math.max(e-1,0),l=Math.min(e+1,p);for(let i=0;i<t;i++){const y=(u+e*t+(i+t-1)%t)*3,d=(u+e*t+(i+1)%t)*3,g=(u+c*t+i)*3,M=(u+l*t+i)*3,V=s[d]-s[y],C=s[d+1]-s[y+1],z=s[d+2]-s[y+2],f=s[M]-s[g],m=s[M+1]-s[g+1],v=s[M+2]-s[g+2];let S=m*z-v*C,k=v*V-f*z,T=f*C-m*V;const n=Math.hypot(S,k,T),x=(u+e*t+i)*3;n<1e-6?(S=0,k=1,T=0):(S/=n,k/=n,T/=n),r[x]=S,r[x+1]=k,r[x+2]=T}}}function $e(o){const t=Math.ceil(20.0625),s=new a.Vector3,r=new Float32Array(321),e=new Float32Array(321),c=new Float32Array(321),l=new Float32Array(t),i=new Float32Array(t),y=new Float32Array(t),d=new Float32Array(t);for(let M=0;M<=320;M++)o.curve.getPointAt(M/320,s),r[M]=s.x,e[M]=s.y,c[M]=s.z;for(let M=0;M<t;M++){const V=M*16,C=Math.min(V+16,321);let z=0,f=0,m=0;for(let v=V;v<C;v++)z+=r[v],f+=c[v];z/=C-V,f/=C-V;for(let v=V;v<C;v++)m=Math.max(m,Math.hypot(r[v]-z,c[v]-f));l[M]=z,i[M]=f,y[M]=m+.01}const g={dist:0,u:0,y:0};return(M,V)=>{let C=0,z=1/0;for(let v=0;v<t;v++){const S=Math.max(Math.hypot(l[v]-M,i[v]-V)-y[v],0);d[v]=S*S,S<z&&(z=S,C=v)}let f=1/0,m=0;for(let v=C*16,S=Math.min(v+16,321);v<S;v++){const k=r[v]-M,T=c[v]-V,n=k*k+T*T;n<f&&(f=n,m=v)}for(let v=0;v<t;v++)if(!(v===C||d[v]>f))for(let S=v*16,k=Math.min(S+16,321);S<k;S++){const T=r[S]-M,n=c[S]-V,x=T*T+n*n;(x<f||x===f&&S<m)&&(f=x,m=S)}return g.dist=Math.sqrt(f),g.u=m/320,g.y=e[m],g}}async function Ze(o,u,p,t,s){const{ni:r,nj:e}=t,c=u.nv,l=1/t.R,i=t.lobes||[],y=at*t.R/e,d=s?2:2.9,g=s?4.4:6.6,M=s?Z(2,3.4,t.R/d/y):1,V=s?Z(2,3.4,t.R/g/y):1;if(s&&!t.keep){const z=t.crown-t.R*t.dome;let f=-1e9;for(let v=Math.ceil(.42*r);v<=r;v+=3){(v&3)===3&&await o.yield();const S=(v/r-.42)/.58*Math.PI/2,k=t.R*Math.cos(S),T=z+(t.crown-z)*Math.sin(S);for(let n=0;n<e;n+=3){const x=n/e*at,b=Math.cos(x),A=Math.sin(x),D=1+.15*p.n3(b*1.3+t.off,A*1.3,t.off*.7);let B=t.x+k*b*D+(t.lean||0)*(T-t.base),G=t.z+k*A*D,L=k*b,R=T-z,I=k*A;const E=Math.hypot(L,R,I)||1;L/=E,R/=E,I/=E;let O=t.R*(.3*gt(p.n3(B*l*1.15+t.off,T*l*1.6,G*l*1.15))+.2*M*gt(p.n3(B*l*d,T*l*d*1.35+t.off,G*l*d)));for(let nt=0;nt<i.length;nt++){const $=i[nt],J=B-$.x,U=(T-$.y)*1.2,N=G-$.z,tt=(J*J+U*U+N*N)/($.r*$.r);tt<1&&(O+=$.r*.6*Math.sqrt(1-tt))}B+=L*O,G+=I*O;const X=s.nearestXZ(B,G),Y=X.y-t.clear+X.dist*X.dist/(X.dist*.6+110);f=Math.max(f,T+.6*Math.max(R*O*.85,0)-(Y-20))}}const m=_(f+12,0,t.R*.4);if(m>0){t.crown-=m;for(const v of i)v.y-=m}}const C=t.crown-t.R*t.dome;for(let z=0;z<=r;z++){s&&(z&1)===1&&await o.yield();const f=z/r;for(let m=0;m<e;m++){const v=m/e*at,S=Math.cos(v),k=Math.sin(v);let T,n,x;if(f<.42){const U=f/.42;n=F(t.base,C,Math.pow(U,.8)),T=t.R*(1+.95*Math.pow(1-U,1.4)),x=n}else{const U=(f-.42)/.58*Math.PI/2;T=t.R*Math.cos(U),n=C+(t.crown-C)*Math.sin(U),x=C}const b=1+.15*p.n3(S*1.3+t.off,k*1.3,t.off*.7);let A=t.x+T*S*b+(t.lean||0)*(n-t.base),D=t.z+T*k*b,B=T*S,G=n-x,L=T*k;const R=Math.hypot(B,G,L)||1;B/=R,G/=R,L/=R;const I=gt(p.n3(A*l*1.15+t.off,n*l*1.6,D*l*1.15)),E=M*gt(p.n3(A*l*d,n*l*d*1.35+t.off,D*l*d)),O=V*gt(p.n3(A*l*g,n*l*g*1.25,D*l*g+t.off)),X=.4+.6*Z(.12,.5,f);let Y=t.R*(.3*I+.2*E+.09*O)*X,nt=I*.95+E*.62+O*.4+.1;for(let U=0;U<i.length;U++){const N=i[U],tt=A-N.x,ut=(n-N.y)*1.2,Q=D-N.z,ft=(tt*tt+ut*ut+Q*Q)/(N.r*N.r);if(ft<1){const xt=Math.sqrt(1-ft);Y+=N.r*.6*xt,nt+=.28*xt}}A+=B*Y,D+=L*Y;let $=G*Y*.85;if(s){const U=s.nearestXZ(A,D),N=U.y-t.clear+U.dist*U.dist/(U.dist*.6+110),tt=20,ut=18,Q=(N-tt-n)/ut;Q<30&&(n=N-tt-ut*Math.log(1+Math.exp(Q)));const ft=Math.max(N-n,1);$>0&&($=ft*(1-Math.exp(-$/ft)))}n+=$;const J=u.nv++;u.pos[J*3]=A,u.pos[J*3+1]=n,u.pos[J*3+2]=D,u.ao[J]=.3+.7*Math.pow(_(nt,0,1),.75)*(.72+.28*Z(.1,.6,f)),u.boil[J]=(.12+.3*Z(.35,.9,f))*_(t.R/120,.3,1)}}de(u,c,r,e),he(u,c,r,e)}async function Ye(o,u,p,t){const{ni:s,nj:r}=t,e=u.nv;for(let c=0;c<=s;c++){(c&7)===7&&await o.yield();const l=c/s;for(let i=0;i<r;i++){const y=i/r*at,d=Math.cos(y),g=Math.sin(y),M=Math.max(d,0),V=(360+t.reach*Math.pow(M,1.3))*(1+.13*p.n3(d*1.7+t.off,g*1.7,t.off))+50*p.n3(d*5,g*5,t.off+9),C=Math.min(190,V-t.rs-30),z=t.under-150;let f,m,v,S=.3,k=d,T=0,n=g;if(l<.5){const I=l/.5;m=F(t.base,z,I),f=t.rs*(1+.38*Math.exp(-(m-t.base)/170))*(1+.08*p.n3(d*1.2+t.off,m/200,g*1.2)),v=1,S=.3+.5*I}else if(l<.62){const I=(l-.5)/.12*Math.PI/2;f=t.rs+C*(1-Math.cos(I)),m=z+150*Math.sin(I),v=F(1,.35,(l-.5)/.12),T=-.4}else if(l<.72){const I=(l-.62)/.1;f=F(t.rs+C,V-46,I),m=t.under+30*I,v=.5,k=0,n=0,T=-1}else if(l<.82){const I=-Math.PI/2+(l-.72)/.1*Math.PI;f=V-46+46*Math.cos(I),m=t.under+76+46*Math.sin(I),v=.6,T=Math.sin(I)*.8}else{const I=(l-.82)/.18;f=(V-46)*(1-I),m=t.under+122+44*(1-f/V*(f/V))+t.over*Math.exp(-(f*f)/36100),v=.85,k=0,n=0,T=1}const x=t.shear*Math.pow(_((m-t.base)/(t.under-t.base),0,1.2),1.6);let b=t.x+x+f*d,A=t.z+f*g;const D=gt(p.n3(b/190+t.off,m/120,A/190)),B=gt(p.n3(b/70,m/48+t.off,A/70)),G=(D*52+B*20)*v,L=Math.hypot(k,T,n)||1;b+=k/L*G,m+=T/L*G,A+=n/L*G;const R=u.nv++;u.pos[R*3]=b,u.pos[R*3+1]=m,u.pos[R*3+2]=A,u.ao[R]=Math.pow(_(D*.95+B*.7+.15,0,1),.75),u.boil[R]=S}}de(u,e,s,r),he(u,e,s,r)}async function Je(o,u,p){const t=u.rng,s=o.noise,r=u.density,e=[],c=Ve("umbra-lobes:"+o.seed),l=-560,i=Math.sqrt(_(o.quality?.detail??1,.5,1)),y=(n,x)=>{const b=p.nearestXZ(n,x).dist,A=b<150?[28,40]:b<330?[19,28]:b<520?[12,18]:b<800?[10,15]:b<1500?[7,10]:[6,9];return[Math.round(A[0]*i),Math.round(A[1]*i)]},d=(n,x,b)=>{let A=1e9;const D=p.nearestXZ(n,x);D.dist<b*1.5+45&&(A=Math.min(A,D.y-44-b*.3-Math.max(0,40-D.dist*.3)));for(const B of u.keepOut)Math.hypot(n-B.x,x-B.z)<b*1.45+B.r&&(A=Math.min(A,B.top));return A},g=(n,x,b)=>Math.hypot(n-yt.x-30,x-yt.z)<235+b*.4||Math.hypot(n-ct.x,x-ct.z)<250||Math.hypot(n-wt.x,x-wt.z)<250||n>250&&n<740&&Math.abs(x+1705)<115+b||Math.hypot(n-512,x+1948)<150+b*.6,M=(n,x,b,A,D={})=>{const B=d(n,x,b);if(A>B){if(B<-335)return null;A=B}const[G,L]=D.res||y(n,x),R={kind:"dome",x:n,z:x,R:b,crown:A,base:l,dome:D.dome??t.range(.75,1),off:t.range(0,60),ni:G,nj:L,lean:D.lean??t.range(-.02,.07),lobes:[],clear:44,near:p.nearestXZ(n,x).dist<b*2.1+90},I=G>=13?t.int(2,5):0;for(let E=0;E<I;E++){const O=t.range(0,at),X=t.range(.25,.85);R.lobes.push({x:n+Math.cos(O)*b*(1-X*.5),y:A-b*R.dome*(1-X),z:x+Math.sin(O)*b*(1-X*.5),r:b*t.range(.34,.55)})}if(R.near&&G>=18)for(let E=0;E<4;E++){const O=c.range(0,at),X=c.range(.35,.95);R.lobes.push({x:n+Math.cos(O)*b*(1-X*.6),y:A-b*R.dome*(1-X),z:x+Math.sin(O)*b*(1-X*.6),r:b*c.range(.3,.46)})}return e.push(R),R},V=212,C=u.cloudscape==="deck",z=C?.04:_(.4-(r-1)*.35,.22,.5);for(let n=-8;n<8;n++)for(let x=-14;x<3;x++){(x&3)===3&&await o.yield();const b=(n+.5)*V+t.range(-70,70),A=(x+.5)*V+t.range(-70,70),D=s.n2(b/760+11,A/760)*.5+.5,B=t(),G=t(),L=t(),R=t();if(B*.6+(1-D)*.4<z*.92)continue;const I=Math.pow(_(s.n2(b/520,A/520+7)*.6+.5+(G-.5)*.5,0,1),C?3.2:1.6),E=Z(650,1300,p.nearestXZ(b,A).dist),O=C?F(105,150,L):F(52,118,I*.7+L*.3),X=C?F(-335,-270,R)+150*I:F(-325,-150,I)+120*E*I;if(g(b,A,O))continue;const Y=M(b,A,O,X,C?{dome:F(.3,.5,L)+.4*I}:{});if(!Y)continue;const nt=C?I>.5?1:0:R<.15?0:R<.5?1:R<.85?2:3;for(let $=0;$<nt;$++){const J=t.range(0,at),U=Y.R*t.range(.52,.8),N=b+Math.cos(J)*Y.R*.9,tt=A+Math.sin(J)*Y.R*.9;g(N,tt,U)||M(N,tt,U,Y.crown-Y.R*t.range(.3,.75))}}await o.yield();const f=p.pointAt(.345),m={kind:"dome",x:f.x+78,z:f.z-6,R:84,crown:f.y-58,base:l,dome:.95,off:t.range(0,60),ni:60,nj:84,lean:.03,lobes:[],clear:34,near:!0,keep:!0};for(let n=0;n<14;n++){const x=t.range(0,at),b=t.range(.3,.98);m.lobes.push({x:m.x+Math.cos(x)*74*(1-b*.7),y:m.crown-80*(1-b),z:m.z+Math.sin(x)*74*(1-b*.7),r:n<5?t.range(28,42):t.range(14,26)})}for(let n=e.length-1;n>=0;n--)Math.hypot(e[n].x-m.x,e[n].z-m.z)<150&&e.splice(n,1);e.push(m),M(m.x+96,m.z-70,58,m.crown-62,{res:[16,24]}),M(m.x+40,m.z+105,50,m.crown-85,{res:[16,24]});for(const[n,x,b,A]of[[845,-1640,105,-18],[905,-1800,118,-8],[770,-1905,96,-30],[1010,-1690,100,-40]])M(n,x,b,A+t.range(-12,12),{res:[13,20]});if(u.cloudscape==="squall")for(let n=0;n<7;n++){const x=(n+.9)/7.6,b=F(yt.x+330,wt.x,x)+t.range(-50,50),A=F(yt.z-110,wt.z,x)+t.range(-60,60);if(g(b,A,150))continue;const D=t.range(150,205),B=M(b,A,D,t.range(40,240),{res:[16,24],dome:1.1});B&&(M(b+t.range(-150,150),A+t.range(60,190),D*.6,B.crown-D*t.range(.7,1.1),{res:[11,16]}),M(b+t.range(-120,120),A-t.range(60,170),D*.55,B.crown-D*t.range(.6,1),{res:[11,16]}))}const v=[{kind:"anvil",x:ct.x,z:ct.z,base:l,under:196,rs:235,reach:u.lowSun?170:420,shear:105,over:62,off:t.range(0,60),ni:56,nj:72},{kind:"anvil",x:wt.x,z:wt.z,base:l,under:226,rs:255,reach:470,shear:120,over:70,off:t.range(0,60),ni:56,nj:72}];for(let n=e.length-1;n>=0;n--)e[n]!==m&&e[n].z-e[n].R*2>70&&e.splice(n,1);e.sort((n,x)=>x.z-n.z);let S=0,k=0;for(const n of[...e,...v])S+=fe(n),k+=n.ni*n.nj*2;return{B:{pos:new Float32Array(S*3),nor:new Float32Array(S*3),ao:new Float32Array(S),boil:new Float32Array(S),idx:new Uint32Array(k*3),nv:0,ni:0},bodies:e,anv:v,skim:m,tris:k}}const Qe=`
attribute vec4 aR;      // xyz place in the box 0..1, w seed
uniform vec3 uBox, uDir, uWind; uniform vec4 uShape;   // half width, length, min angular half width, near fade
uniform float uTime;
varying vec2 vUv; varying vec4 vI;   // x alpha, y seed, z toward-sun glitter, w distance
uniform vec3 uSunDir;
void main(){
  vec3 loc = mod(aR.xyz * uBox + uWind * uTime - cameraPosition + uBox * 0.5, uBox) - uBox * 0.5;
  vec3 c = cameraPosition + loc;
  float dist = max(length(loc), 1e-3);
  vec3 toC = -loc / dist;
  vec3 sideV = cross(uDir, toC); sideV = sideV / max(length(sideV), 1e-3);
  float w0 = uShape.x * (0.6 + 0.8 * aR.w), w = max(w0, dist * uShape.z);
  vec3 wp = c + sideV * position.x * w + uDir * position.y * uShape.y * (0.6 + 0.8 * fract(aR.w * 7.3)) * 0.5;
  vec3 e = abs(loc) / (uBox * 0.5);
  float fade = (1. - smoothstep(0.8, 1., e.x)) * (1. - smoothstep(0.8, 1., e.y)) * (1. - smoothstep(0.8, 1., e.z));
  fade *= smoothstep(uShape.w * 0.3, uShape.w, dist) * (w0 / w);
  vUv = position.xy;
  vI = vec4(fade, aR.w, max(dot(-toC, uSunDir), 0.), dist);
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
}`,t0=`
uniform vec3 uTint; uniform float uTime, uSoft;
varying vec2 vUv; varying vec4 vI;
${Ft}
void main(){
  float ax = 1. - vUv.x * vUv.x, ay = 1. - vUv.y * vUv.y;
  float a = ax * ax * ay * vI.x;
  if (uSoft > 0.5) {
    float n = vn3(vec3(vUv.x * 2.5 + vI.y * 9., vUv.y * 5. + vI.y * 31., vI.y * 5.)) * 0.6 + vn3(vec3(vUv.x * 7., vUv.y * 13., vI.y * 3.)) * 0.4;
    a *= smoothstep(0.3, 0.85, n);
    gl_FragColor = vec4(uTint * a * (0.6 + 0.9 * vI.z * vI.z), 0.);
  } else {
    float tw = 0.55 + 0.45 * sin(uTime * (7. + vI.y * 9.) + vI.y * 80.);
    float g = vI.z * vI.z; g *= g;
    gl_FragColor = vec4(uTint * a * tw * (0.55 + 2.6 * g), 0.);
  }
}`;function ve(o,u,p){const t=new a.InstancedBufferGeometry;t.setAttribute("position",new a.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),t.setIndex([0,1,2,0,2,3]);const s=new Float32Array(u*4);for(let c=0;c<u*4;c++)s[c]=o();t.setAttribute("aR",new a.InstancedBufferAttribute(s,4)),t.instanceCount=u;const r={uBox:{value:new a.Vector3(...p.box)},uDir:{value:new a.Vector3(0,0,-1)},uWind:{value:new a.Vector3(...p.wind)},uShape:{value:new a.Vector4(...p.shape)},uTime:p.time,uSunDir:p.sunDir,uTint:{value:new a.Color(1,1,1)},uSoft:{value:p.soft?1:0}},e=new a.Mesh(t,new a.ShaderMaterial({vertexShader:Qe,fragmentShader:t0,uniforms:r,transparent:!0,depthWrite:!1,side:a.DoubleSide,blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.OneFactor,blendDst:a.OneFactor}));return e.frustumCulled=!1,e.renderOrder=p.order??6,{object:e,uniforms:r}}function It(o,u,p=1,t=!0){const s=new a.InstancedBufferGeometry;s.setAttribute("position",new a.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),s.setIndex([0,1,2,0,2,3]);const r=o.length,e=new Float32Array(r*3),c=new Float32Array(r*4),l=new Float32Array(r*3);o.forEach((g,M)=>{e.set(g.p,M*3),c.set([g.c[0],g.c[1],g.c[2],g.size],M*4),l.set(g.blink||[0,0,1],M*3)});const i=new a.InstancedBufferAttribute(c,4);s.setAttribute("aPos",new a.InstancedBufferAttribute(e,3)),s.setAttribute("aCol",i),s.setAttribute("aBlink",new a.InstancedBufferAttribute(l,3)),s.instanceCount=r;const y={uTime:u,uGain:{value:1},uCore:{value:p}},d=new a.Mesh(s,new a.ShaderMaterial({vertexShader:Ge,fragmentShader:Ee,uniforms:y,transparent:!0,depthWrite:!1,depthTest:t,blending:a.AdditiveBlending}));return d.frustumCulled=!1,d.renderOrder=t?5:2,{object:d,uniforms:y,aCol:i}}var n0={id:"the-umbra",name:"The Umbra",category:"sky",weirdness:.1,media:["air"],async build(o){const u=o.rng,p=o.quality?.detail??1,t=o.vary||{},s=new a.Scene,r=u.fork("umbra-look"),e=r.pick(["deck","squall","field"]),c=r.pick(["minimum","maximum","skewed"]),l=r.pick(["white","metal","black"]),i=r.int(2,5),y=e==="field"?"chase":e==="deck"?"airliner":"balloon",d=t.hour||"any",g=d==="day"?34:d==="golden"||d==="dawn"||d==="night"?13:26,M=_(t.density??1,.7,1.3),V=t.mood??.5,z=await Pe(o,{palette:["#1B4FA8","#EEF1F6","#1A1B3A","#4A4668","#F2EEE4",e==="squall"?"#E2733A":e==="deck"?"#EE9244":"#E8823A","#FF5C8A"],sunElev:g,sunAz:8,corona:c,prominences:i,seatGlow:0});z.object.position.copy(yt),s.add(z.object);const f=z.uniforms,m=z.anchors.sunDir.clone(),v=1/Math.tan(g*Fe);f.uGold.value.setRGB(1.08,.76,.4),f.uWarm.value.multiplyScalar(.8),f.uCool.value.multiplyScalar(.8),s.fog=new a.FogExp2(10335446,Ie*F(.9,1.08,V)),await o.yield();const S=z.anchors.flyThrough.map(h=>h.clone().add(yt)),k=Ot([[0,0,0],[1,0,-80],[3,0,-170],[5,-1,-260],[9,-12,-350],[15,-40,-480],[23,-74,-640],...S]),T=k.length;await o.yield();const n=new a.Vector3,x=new a.Vector3,b=new a.Vector3;k.pointAt(ce,n).sub(yt);const A=n.z+v*n.y,D=h=>A+7700*(h-ce)+720*(1-Z(0,.24,h)),B=2800,G=k.end.clone(),L=[],R=[],I=(h,w,j)=>(h.tangentAtDist(w,j),j.set(-j.z,0,j.x).normalize());if(y==="chase"){const h=S[2];for(const[w,j,K]of[[-17,96,[[-43,-10,-200],[-143,20,-400],[-363,75,-540],[-673,135,-590],[-1033,195,-570],[-1533,255,-490]]],[21,152,[[17,-15,-200],[7,-5,-440],[-13,15,-740],[-33,45,-1140],[-53,75,-1640]]]]){const H=[];for(let q=-520;q<=1260;q+=110)k.posAtDist(q,n),I(k,q,x),H.push([n.x+x.x*w,n.y-15,n.z+x.z*w]);H.push([h.x+w,h.y-15,h.z]);for(const q of K)H.push([h.x+q[0],h.y+q[1],h.z+q[2]]);L.push({path:Ot(H),lead:j+520,speed:1,engines:[-5.6,5.6],kind:"chase"}),await o.yield()}}else y==="airliner"&&L.push({path:Ot([[-420,-118,500],[-330,-118,-400],[-230,-118,-1300],[-130,-118,-2200],[-40,-118,-3100]]),lead:1100,speed:.55,engines:[-17,-9,9,17],kind:"airliner"});for(const h of L)for(let w=0;w<=h.path.length;w+=120)h.path.posAtDist(w,n),R.push({x:n.x,z:n.z,r:45,top:n.y-42});const E=new a.Vector3(k.pointAt(.245,n).x-96,n.y+42,n.z);y==="balloon"&&R.push({x:E.x,z:E.z,r:60,top:E.y-175}),await o.yield();const O=await Je(o,{rng:u.fork("clouds"),density:M,cloudscape:e,keepOut:R,lowSun:g<20},k);{const{B:h,bodies:w,anv:j}=O;let K=0;const H={nearestXZ:$e(k)};for(const et of w)await Ze(o,h,o.noise,et,et.near?H:null),K+=fe(et)*(et.near?6:1),K>3500&&(K=0,await o.yield());for(const et of j)await Ye(o,h,o.noise,et),await o.yield();const q=new a.BufferGeometry;q.setAttribute("position",new a.BufferAttribute(h.pos,3)),q.setAttribute("normal",new a.BufferAttribute(h.nor,3)),q.setAttribute("aO",new a.BufferAttribute(h.ao,1)),q.setAttribute("aBoil",new a.BufferAttribute(h.boil,1)),q.setIndex(new a.BufferAttribute(h.idx,1)),await o.yield();const vt=new a.Vector4(-420,1/640,-545,1),st=new a.Mesh(q,z.makeCloudMaterial({hgt:vt,lobe3:!0,soft:.1}));st.frustumCulled=!1,s.add(st)}await o.yield();const X=e==="deck"?-600:-780,Y={...z.cloudUniforms(),uDeck:{value:new a.Vector4(e==="deck"?.92:F(.42,.6,r()),r.range(.3,1.2),e==="deck"?1:.25,e==="deck"?.12:.3)}},nt=new a.Mesh(new a.PlaneGeometry(26e3,26e3,1,1).rotateX(-Math.PI/2),new a.ShaderMaterial({vertexShader:je,fragmentShader:We,uniforms:Y,fog:!0}));nt.position.set(0,X,-1100),nt.frustumCulled=!1,s.add(nt);const $={white:{skin:[.76,.77,.79],trim:"#1B4FA8",gloss:.55,frost:1},metal:{skin:[.5,.52,.56],trim:"#1B4FA8",gloss:.95,frost:.7},black:{skin:[.03,.032,.04],trim:"#B9BECC",gloss:.85,frost:.5}},J=(h,w,j,K)=>new a.ShaderMaterial({vertexShader:Be,fragmentShader:_e,fog:!0,side:a.DoubleSide,uniforms:{...z.cloudUniforms(),uCtl:{value:new a.Vector4(0,0,0,0)},uSpan:{value:w},uSkin:{value:new a.Color(...h.skin)},uTrim:{value:new a.Color(h.trim)},uLiv:{value:new a.Vector4(h.gloss,.85,h.frost,j)},uGrid:{value:new a.Vector4(K[0],K[1],48,K[2])}}}),U=new a.Group;U.name="research-jet",await o.yield();const N=await He(o),tt=J($[l],15.5,N.axis,[1.12,1.36,.035]),ut=new a.Mesh(N.geometry,tt);ut.frustumCulled=!1,U.add(ut);const Q=N.axis,ft=It([{p:[0,Q+1,-9.6],c:[3.4,.9,1.6],size:.62,blink:[1.2,0,14]},{p:[-15.6,Q+.52,-11.5],c:[3.2,.35,.25],size:.3},{p:[15.6,Q+.52,-11.5],c:[.25,3,1],size:.3},{p:[-5,Q+.68,-12.6],c:[1.6,1.7,2],size:.2,blink:[2.4,.3,30]},{p:[5,Q+.68,-12.6],c:[1.6,1.7,2],size:.2,blink:[2.4,.8,30]}],f.uTime);U.add(ft.object);const xt={uVap:{value:0},uVapCol:{value:new a.Color(1,1,1)},uUmbra:f.uUmbra,uSunDir:f.uSunDir,uTime:f.uTime,uOrg:f.uOrg},kt=new a.BufferGeometry,Dt=[],Ht=[],Xt=[];for(const h of[-1,1]){const w=Dt.length/3;Dt.push(h*1.4,Q+.75,-13.1,h*13,Q+.95,-12.2,h*13,Q+3,-6.2,h*1.4,Q+2.7,-7),Ht.push(0,0,1,0,1,1,0,1),Xt.push(w,w+1,w+2,w,w+2,w+3)}kt.setAttribute("position",new a.BufferAttribute(new Float32Array(Dt),3)),kt.setAttribute("uv",new a.BufferAttribute(new Float32Array(Ht),2)),kt.setIndex(Xt);const Rt=new a.Mesh(kt,new a.ShaderMaterial({vertexShader:Ne,fragmentShader:Ke,uniforms:xt,transparent:!0,depthWrite:!1,side:a.DoubleSide,blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.OneFactor,blendDst:a.OneMinusSrcAlphaFactor}));Rt.frustumCulled=!1,Rt.renderOrder=7,U.add(Rt),s.add(U),await o.yield();const $t=[],Zt={value:[0,0,0,0]},pe=new a.Vector3(0,1,0);if(L.length){const h=L[0].kind==="chase",w=ue(h?{length:21,span:37,radius:1.05,chord:5.4,taper:.5,sweep:.04,engines:[.3],nacelle:6.5,nacR:.95,fin:4.2,dihedral:.02}:{length:64,span:60,radius:3,chord:11,taper:.3,sweep:.5,engines:[.3,.57],nacelle:6,nacR:1.35,nacDrop:2.4,fin:9.5,dihedral:.09,tailY:1});await o.yield();const j=J(h?$.white:$.metal,h?18.5:30,0,h?[1.7,1.9,.05]:[3.1,2.6,.16]),K=[],H=[],q=[],vt=[];L.forEach((rt,ht)=>{const pt=new a.Group,bt=new a.Mesh(w,j);bt.frustumCulled=!1,pt.add(bt);const mt=h?1:2.2,zt=It([{p:[0,1.6*mt,2],c:[3.2,.5,.4],size:.5*mt,blink:[1.1,.37*ht,16]},{p:[-18.5*(h?1:1.62),.5,1],c:[3,.3,.25],size:.3*mt},{p:[18.5*(h?1:1.62),.5,1],c:[.25,2.8,.9],size:.3*mt}],f.uTime);pt.add(zt.object),s.add(pt),$t.push({g:pt,t:rt,k:ht,lamps:zt}),rt.engines.forEach((Pt,At)=>{const St=K.length/3,Tt=Math.floor(rt.path.length/14);for(let P=0;P<=Tt;P++){const W=P*14;rt.path.posAtDist(W,n),rt.path.tangentAtDist(W,x),b.set(-x.z,0,x.x).normalize();for(const ot of[-1,1])K.push(n.x+b.x*Pt,n.y-.5,n.z+b.z*Pt),H.push(x.x,x.y,x.z),q.push(ot,W,ht+.11*(At+1)+.03*ht);if(P<Tt){const ot=St+P*2;vt.push(ot,ot+1,ot+2,ot+1,ot+3,ot+2)}}})}),await o.yield();const st=new a.BufferGeometry;st.setAttribute("position",new a.BufferAttribute(new Float32Array(K),3)),st.setAttribute("aTan",new a.BufferAttribute(new Float32Array(H),3)),st.setAttribute("aInfo",new a.BufferAttribute(new Float32Array(q),3)),st.setIndex(vt);const et=new a.Mesh(st,new a.ShaderMaterial({vertexShader:Ue,fragmentShader:Le,uniforms:{...z.cloudUniforms(),uHead:Zt},fog:!0,transparent:!0,depthWrite:!1,side:a.DoubleSide}));et.frustumCulled=!1,et.renderOrder=1,s.add(et)}let lt=null;if(y==="balloon"){await o.yield(),lt=new a.Mesh(Xe(),J({skin:[.8,.79,.76],trim:"#FF5C8A",gloss:.5,frost:0},1e4,0,[1e4,1e4,.1])),lt.material.uniforms.uLiv.value.y=0,lt.position.copy(E),lt.frustumCulled=!1;const h=It([{p:[0,-121,0],c:[3.2,.8,1.5],size:1.6,blink:[1.6,0,12]}],f.uTime);lt.add(h.object),s.add(lt)}await o.yield();const Bt=ve(u.fork("ice"),Math.round(520*p*M),{box:[40,26,90],wind:[2.5,-.6,5],shape:[.011,1.3,.0023,5.5],time:f.uTime,sunDir:f.uSunDir}),_t=ve(u.fork("wisp"),Math.round(44*p*M),{box:[460,120,900],wind:[3,0,9],shape:[10,170,0,45],time:f.uTime,sunDir:f.uSunDir,soft:!0,order:3});s.add(Bt.object,_t.object);const Yt=[],Jt=new a.Vector3(33,-60,-1e3);for(const h of[ct,wt]){const w=Jt.x-h.x,j=Jt.z-h.z,K=Math.hypot(w,j);Yt.push({p:[h.x+w/K*250+40,70,h.z+j/K*250],c:[0,0,0],size:150},{p:[h.x+w/K*340+90,150,h.z+j/K*340],c:[0,0,0],size:175})}const Ut=It(Yt,f.uTime,0);s.add(Ut.object);const me=u.int(1,1e9),Ct=h=>{let w=Math.imul(h^me,2654435761);return w^=w>>>15,w=Math.imul(w,2246822519),w^=w>>>13,(w>>>0)/4294967296};let Mt=null;const Lt={uSpA:{value:new a.Vector4(ct.x+150,455,ct.z+60,0)},uSpB:{value:new a.Vector4(ct.x-150,440,ct.z+150,0)},uSpSize:{value:new a.Vector2(480,1e3)},uRose:f.uRose,uTime:f.uTime};if(t.rare){const h=new a.BufferGeometry;h.setAttribute("position",new a.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),h.setAttribute("aK",new a.BufferAttribute(new Float32Array([0,0,0,0,1,1,1,1]),1)),h.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]),Mt=new a.Mesh(h,new a.ShaderMaterial({vertexShader:Oe,fragmentShader:qe,uniforms:Lt,transparent:!0,depthWrite:!1,side:a.DoubleSide,blending:a.AdditiveBlending})),Mt.frustumCulled=!1,Mt.renderOrder=2,s.add(Mt)}const ye=new a.Vector3,we=new a.Vector3(O.skim.x-20,O.skim.crown,O.skim.z-40),Qt=(h,w)=>k.pointAt(_(w,0,1),ye).addScaledVector(m,3e3),ge=[{at:we,from:.25,to:.39,weight:.3},{at:Qt,from:.34,to:.7,weight:.6},{at:Qt,from:.58,to:.78,weight:.8,fade:.45},{at:G,from:.74,to:1,weight:.5}],it=new a.Vector3,dt=new a.Vector3,te=new a.Vector3,ee=new a.Vector3,oe=new a.Vector3,jt=new a.Vector3,ae=new a.Vector3,Wt=new a.Vector3,ne=new a.Vector3,se=new a.Matrix4,Gt=new a.Matrix4,re=new a.Vector3,Vt=[null,null,null],xe=new a.Color(.36,.42,.52),be=new a.Color(.13,.11,.13),Me=new a.Color(.085,.095,.12),ze=new a.Color(.03,.022,.026),Ae=new a.Color(.8,.84,.92),Se=new a.Color(.2,.16,.2),Et=new a.Color("#C9C4FF"),ie=(h,w,j)=>{jt.crossVectors(w,pe).normalize(),ae.crossVectors(jt,w),Wt.copy(jt).multiplyScalar(Math.cos(j)).addScaledVector(ae,Math.sin(j)),ne.crossVectors(Wt,w),dt.copy(w).negate(),se.makeBasis(Wt,ne,dt),h.quaternion.setFromRotationMatrix(se)},ke=h=>h<=0||h>=.42?0:h<.1?Z(0,.1,h):1-Z(.1,.4,h);function Ce(h,w,j,K){const H=_(K??0,0,1),q=H*T,vt=D(H);z.setFront(vt,vt-B),z.seatGlow=F(1.1*Z(.6,.7,H),.2,Z(.74,.82,H));const st=Z(.6,.67,H);if(st>0){const P=.5+.5*Math.sin(w*2.3),W=.5+.5*Math.sin(w*1.7+2),ot=1-Z(.745,.8,H);Vt[0]=st*ot*(.25+.75*P*P),Vt[1]=null,Vt[2]=st*(.12+.4*W*W)*(.3+.25*ot),z.boltOverride=Vt}else z.boltOverride=null;z.update(h,w,j),f.uOccA.value.w*=1.55,s.fog.color.copy(z.haze);const et=z.state,rt=_(et.light,0,1),ht=et.open;k.tangentAt(H,it),k.tangentAtDist(q+60,dt);const pt=it.z*dt.x-it.x*dt.z,bt=Math.abs(pt);re.setFromMatrixPosition(j.matrixWorld),Gt.extractRotation(j.matrixWorld),te.set(0,0,-1).applyMatrix4(Gt),ee.set(1,0,0).applyMatrix4(Gt),oe.copy(it).multiplyScalar(.7).addScaledVector(te,.3).normalize(),ie(U,oe,Math.asin(_(ee.y,-1,1))*1.3+.01*Math.sin(w*.9)),U.position.copy(re);const mt=_(-pt*.5,-.14,.14)+.02*Math.sin(w*3.1)+.012*Math.sin(w*7.3);tt.uniforms.uCtl.value.set(mt,-mt,bt*.5+.03*Math.max(0,Math.sin(w*2.7)),.3+bt*2.2+.2*Math.sin(w*2.1)+.12*Math.sin(w*3.7+1)),ft.uniforms.uGain.value=F(1.5,.7,rt),xt.uVap.value=Z(.07,.15,bt)*(.7+.3*Math.sin(w*5.1)),xt.uVapCol.value.copy(Se).multiplyScalar(.5+.5*ht).lerp(Ae,rt);for(const P of $t){const W=Math.min(P.t.lead+q*P.t.speed,P.t.path.length-2);P.t.path.posAtDist(W,P.g.position),P.t.path.tangentAtDist(W,it),P.t.path.tangentAtDist(W+50,dt);const ot=it.z*dt.x-it.x*dt.z;P.g.position.y+=.8*Math.sin(w*.6+P.k*2.1),ie(P.g,it,_(ot*5,-1,1)+.06*Math.sin(w*.8+P.k*2.4)),Zt.value[P.k]=W-(P.t.kind==="chase"?6:14),P.lamps.uniforms.uGain.value=F(1.6,.8,rt)}lt&&(lt.position.set(E.x+1.5*Math.sin(w*.2),E.y+.8*Math.sin(w*.31),E.z),lt.rotation.set(.02*Math.sin(w*.4),w*.03,.02*Math.sin(w*.33+1))),k.tangentAt(H,it),Bt.uniforms.uDir.value.copy(it),_t.uniforms.uDir.value.copy(it),Bt.uniforms.uTint.value.copy(be).multiplyScalar(.45+.55*ht).lerp(xe,rt),_t.uniforms.uTint.value.copy(ze).multiplyScalar(.4+.6*ht).lerp(Me,rt);const zt=Math.floor(w),Pt=.55;let At=0,St=0;for(let P=zt-1;P<=zt;P++){if(Ct(P)>.7)continue;const W=ke(w-(P+.15+.5*Ct(P*13+5)))*(.55+.45*Ct(P*3+1));Ct(P*7+3)<.5?At=Math.max(At,W):St=Math.max(St,W)}const Tt=Pt*F(1.5,.6,rt);for(let P=0;P<4;P++){const W=(P<2?At:St)*Tt*(P%2?.8:1);Ut.aCol.setXYZ(P,Et.r*W,Et.g*W,Et.b*W)}if(Ut.aCol.needsUpdate=!0,Mt){const P=W=>Z(W,W+.004,H)*(1-Z(W+.011,W+.026,H));Lt.uSpA.value.w=P(.542)*1.15,Lt.uSpB.value.w=P(.565)}}return{scene:s,path:k,duration:44,camera:{fov:70,near:.3,far:6e3,lookAhead:60,sway:.6,bank:4.5},pois:ge,portal:{shape:"circle",radius:10,color:"#DCE6FF",glow:1,revealDistance:700,tilt:!0},post:{exposure:1,bloom:{strength:.3,radius:.6,threshold:1.2},grade:{saturation:1.06,contrast:1.05,tint:"#ffffff",shadowTint:"#000000",vignette:.3,grain:.02,aberration:0}},ride:"none",style:"none",update:Ce,dispose(){z.dispose()}}}};export{n0 as default};
