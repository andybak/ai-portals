import*as P from"three";import{clamp as n0,lerp as B,smoothstep as I0}from"../kit/core.js";const F0=["#D9A55B","#8A5A2B","#1F2347","#4B5673","#E3B21A","#3F7A4E","#FFE3A1"],L=65,V=65,K=13,N=5,s0=3,C=38,D=14,x0=2.1,J=t=>L-s0*t,_0=[[7,0,0],[3,0,14],[0,1,-18],[7,1,3]];function i0(){const t=[],l=[],i=[],u={c:[1,1,1],m:0,ox:0,oy:0,oz:0,cs:1,sn:0,sx:1,at(r,e,o,n=0,s=1){return u.ox=r,u.oy=e,u.oz=o,u.cs=Math.cos(n),u.sn=Math.sin(n),u.sx=s,u},home(){return u.at(0,0,0,0,1)},tint(r,e,o){return u.c=[r,e,o],u},v(r,e,o){r*=u.sx,t.push(u.ox+r*u.cs+o*u.sn,u.oy+e,u.oz-r*u.sn+o*u.cs),l.push(u.c[0],u.c[1],u.c[2]),i.push(u.m)},tri(r,e,o){u.v(r[0],r[1],r[2]),u.v(e[0],e[1],e[2]),u.v(o[0],o[1],o[2])},quad(r,e,o,n){u.tri(r,e,o),u.tri(r,o,n)},box(r,e,o,n,s,c,a=0,h=!0){const v=[r,e,o],p=[n,e,o],d=[n,e,c],y=[r,e,c],f=[r+a,s,o+a],m=[n-a,s,o+a],g=[n-a,s,c-a],S=[r+a,s,c-a];u.quad(v,p,m,f),u.quad(p,d,g,m),u.quad(d,y,S,g),u.quad(y,v,f,S),u.quad(f,m,g,S),h||u.quad(v,y,d,p)},lathe(r,e,o,n=8,s=0,c=!0,a=1){for(let p=0;p<o.length-1;p++){const[d,y]=o[p],[f,m]=o[p+1];for(let g=0;g<n;g++){const S=s+g/n*Math.PI*2,q=s+(g+1)/n*Math.PI*2,x=Math.cos(S),M=Math.sin(S)*a,z=Math.cos(q),I=Math.sin(q)*a,F=[r+x*d,y,e+M*d],j=[r+z*d,y,e+I*d],E=[r+z*f,m,e+I*f],X=[r+x*f,m,e+M*f];d<.001?u.tri(F,E,X):f<.001?u.tri(F,j,E):u.quad(F,j,E,X)}}const[h,v]=o[o.length-1];if(c&&h>.001)for(let p=1;p<n-1;p++){const d=s,y=s+p/n*Math.PI*2,f=s+(p+1)/n*Math.PI*2;u.tri([r+Math.cos(d)*h,v,e+Math.sin(d)*h*a],[r+Math.cos(y)*h,v,e+Math.sin(y)*h*a],[r+Math.cos(f)*h,v,e+Math.sin(f)*h*a])}},count(){return t.length/9},geometry(){const r=new P.BufferGeometry;return r.setAttribute("position",new P.BufferAttribute(new Float32Array(t),3)),r.setAttribute("aC",new P.BufferAttribute(new Float32Array(l),3)),r.setAttribute("aM",new P.BufferAttribute(new Float32Array(i),1)),r}};return u}const L0=0,Q=1,T=2,H=3,R0=4,r0=5,b=6,U=9,Y=`
uniform float uU, uTime, uPoolY, uSunI;
uniform vec3 uSunDir, uSunCol, uFill, uBounce, uSkyE, uSkyW, uCam;
uniform vec4 uShaft;                           // (x, z at the rim plane, radius, amount): confines the sun to one shaft through torn cloud
uniform vec4 uCloud;                           // (edge x, softness, 0, amount): a patch of cloud shadow lying east of the edge
float h11(float n){ return fract(sin(n*127.1)*43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float vn(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1.,0.)), f.x), mix(h21(i+vec2(0.,1.)), h21(i+vec2(1.,1.)), f.x), f.y);
}
// depth of the cascade front: tier k (1..13) is running when uU = 0.44 + 0.03 k
float frontY(){ return -(uU-0.44)/0.03*5.; }
// analytic shadow of the rim: walk toward the sun to the edge of the pit and see if we are above ground
float sunVis(vec3 p){
  vec3 L = uSunDir;
  float tx = L.x < 0. ? (-65.-p.x)/min(L.x,-1e-3) : (65.-p.x)/max(L.x,1e-3);
  float tz = L.z < 0. ? (-65.-p.z)/min(L.z,-1e-3) : (38.-p.z)/max(L.z,1e-3);
  float t = max(min(tx,tz), 0.);
  float rim = (tz < tx && L.z > 0.) ? 4. : 0.;
  float ye = p.y + t*L.y, w = 0.4 + 0.012*t;
  float v = smoothstep(rim-w, rim+w, ye);
  if (uShaft.w > 0.) {
    vec2 q = p.xz + L.xz * (max(-p.y, 0.) / max(L.y, 0.05));
    float m = 1. - smoothstep(uShaft.z - 14., uShaft.z + 6., length(q - uShaft.xy) + (vn(q*0.05) - 0.5)*14.);
    v *= mix(1., m, uShaft.w);
  }
  if (uCloud.w > 0.) v *= 1. - uCloud.w*smoothstep(uCloud.x - uCloud.y, uCloud.x + uCloud.y, p.x + (vn(vec2(p.z*0.045 + 3., 1.7)) - 0.5)*22.);
  return v;
}
vec3 skyRefl(vec3 r){ return mix(uSkyW, uSkyE, smoothstep(-0.6, 0.6, r.x)) * (0.55 + 0.45*clamp(r.y, 0., 1.)); }
`,N0=`
attribute vec3 aC; attribute float aM;
#ifdef USE_INSTANCING
attribute vec3 aTint;
#endif
uniform float uTime;
varying vec3 vP; varying vec3 vC; varying float vM;
#include <fog_pars_vertex>
void main(){
  vec4 lp = vec4(position, 1.); vC = aC;
  #ifdef USE_INSTANCING
  lp = instanceMatrix*lp; vC = aC*aTint;
  #endif
  if (aM > 6.5 && aM < 7.9) { float w = (aM-7.)*2.5; lp.z += sin(uTime*6.3 + lp.x*1.7 + lp.y)*w*0.55; lp.y += cos(uTime*5.1 + lp.x*2.3)*w*0.2; }
  vP = lp.xyz; vM = aM;
  vec4 mvPosition = modelViewMatrix*lp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,B0=`
uniform vec3 uDry, uWet, uGarland;
uniform float uMoss, uLamp, uCool;
varying vec3 vP; varying vec3 vC; varying float vM;
#include <fog_pars_fragment>
${Y}
void main(){
  vec3 dx = dFdx(vP), dy = dFdy(vP);
  vec3 cr = cross(dx, dy);
  vec3 N = cr / max(length(cr), 1e-9);
  vec3 Vv = uCam - vP; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-4);
  if (dot(N, V) < 0.) N = -N;
  float up = N.y;
  float isTop = smoothstep(0.55, 0.8, up);
  float s = abs(N.x) > abs(N.z) ? vP.z : vP.x;                 // horizontal coordinate in a vertical face
  bool flight = vM < 0.5, wall = vM > 0.5 && vM < 1.5, carved = vM > 1.5 && vM < 2.5;
  bool dark = vM > 2.5 && vM < 3.5, earth = vM > 3.5 && vM < 4.5, jali = vM > 4.5 && vM < 5.5, plaster = vM > 5.5 && vM < 8.5, glowM = vM > 8.5;
  float tierF = -vP.y/5.; float tier = floor(tierF); float yy = fract(tierF);      // yy: 0 top of tier, 1 foot
  float lod = smoothstep(160., 40., dist);

  // ---- albedo: ashlar courses every 0.35 m, staggered joints, per-block tone ----
  float course = vP.y/0.35; float row = floor(course), cf = fract(course);
  float bs = s/0.95 + h11(row)*7.3;
  float blk = h21(vec2(floor(bs), row));
  float joint = max(smoothstep(0.86, 0.97, cf), smoothstep(0.92, 0.985, fract(bs))) * (1.-isTop) * lod;
  float blotch = vn(vec2(s*0.06 + vP.y*0.03, vP.y*0.09 + s*0.02)) * 0.6 + vn(vP.xz*0.21 + vP.y*0.5)*0.4;
  vec3 alb = uDry * vC * (0.80 + 0.26*blk*lod + 0.06) * (0.78 + 0.42*blotch);
  alb *= 1. - 0.42*joint;
  if (isTop > 0.5 && (flight || wall)) {                      // worn treads and ledges: paler, slab joints
    vec2 sl = vP.xz/vec2(1.3, 1.3); float e = max(smoothstep(0.93,0.99,fract(sl.x)), smoothstep(0.93,0.99,fract(sl.y)));
    alb *= (1.08 + 0.1*vn(vP.xz*1.7)) * (1. - 0.3*e*lod);
  }
  if (carved) {                                               // carved bands and fluting
    float band = smoothstep(0.35, 0.5, abs(fract(vP.y*0.77)-0.5));
    float flute = 0.5 + 0.5*sin(s*21.);
    alb *= 0.86 + 0.12*band + 0.07*flute*lod*(1.-isTop);
  }
  if (plaster) alb = vC * (0.8 + 0.2*blotch) * (1. - 0.25*vn(vec2(s*3., vP.y*0.4)));
  if (earth) {
    float g = vn(vP.xz*0.9)*0.5 + vn(vP.xz*0.13)*0.5;
    alb = vC * (0.72 + 0.4*g); alb = mix(alb, alb*vec3(0.8,0.95,0.6), smoothstep(0.62,0.8,vn(vP.xz*0.31+9.))*0.5);
  }
  if (jali) {                                                 // pierced screen: lattice of dark holes
    vec2 q = fract(vec2(s, vP.y)*2.6) - 0.5;
    float hole = smoothstep(0.34, 0.26, abs(q.x)+abs(q.y)) * lod;
    alb = mix(alb, vec3(0.012,0.01,0.014), hole);
  }
  if (dark) alb = uDry * vC * 0.34 * (0.7 + 0.5*blotch);
  // black algae under every ledge, streaking down; stronger low in the well
  if ((flight || wall || carved) && isTop < 0.5) {
    float st = vn(vec2(s*1.1, tier*3.1)) * 0.65 + vn(vec2(s*4.3, vP.y*0.25))*0.35;
    float al = smoothstep(0.55, 0.0, yy) * smoothstep(0.32, 0.7, st) * (wall || carved ? 1. : 0.6);
    al = max(al, smoothstep(0.75, 1., yy) * 0.25 * (wall ? 1. : 0.));
    alb = mix(alb, alb*vec3(0.22,0.25,0.2), al * (0.55 + 0.4*smoothstep(0., -65., vP.y)));
  }
  // a dark arched niche in the wall triangles of every third diamond
  float nm = 0., lampG = 0.;
  if (wall && isTop < 0.5 && vP.y < 0. && vP.z < 37.9) {
    float odd = mod(tier, 2.);
    float along = abs(N.z) > abs(N.x) ? vP.x/14. + 0.5 : (38.-vP.z)/14.;
    along += odd*0.5 + 0.5;
    float d = (fract(along)-0.5)*14.; float cell = floor(along);
    float hgt = 5.*(1.-yy);
    float pick = step(mod(cell + tier*2. + floor(N.x*1.5 + 0.5)*1., 3.), 0.5);
    float inside = step(abs(d), 0.95) * step(1.7, hgt) * step(hgt, 3.4 + sqrt(max(0.9 - d*d, 0.))*1.05);
    float rimN = step(abs(d), 1.2) * step(1.45, hgt) * step(hgt, 3.6 + sqrt(max(1.44 - d*d, 0.))*1.05);
    alb = mix(alb, alb*1.18, (rimN-inside)*pick);
    alb = mix(alb, vec3(0.02,0.016,0.02)*(1.+hgt*0.2), inside*pick);
    nm = inside*pick;
    lampG = pick * exp(-(d*d*0.55 + (hgt - 2.3)*(hgt - 2.3))/3.4);        // the pool of light a niche lamp throws on the wall round it
  }

  // moss on the low tiers in the second week of the monsoon
  if (uMoss > 0. && (flight || wall || carved)) {
    float mz = smoothstep(-28., -50., vP.y + (vn(vec2(s*0.12, vP.y*0.2))-0.5)*14.) * smoothstep(0.25, 0.7, vn(vec2(s*0.9, vP.y*0.7)) + 0.35*isTop);
    alb = mix(alb, vec3(0.105, 0.2, 0.06)*(0.7 + 0.6*blotch), mz*uMoss*0.8);
  }
  // ---- wetness: drop spots, then the rain curtain from the east, then the cascade front ----
  vec2 suv = isTop > 0.5 ? vP.xz : vec2(s, vP.y);
  float spotAmt = smoothstep(0.26, 0.42, uU);
  vec2 sc = suv*2.2; vec2 ci = floor(sc); vec2 cp = fract(sc) - 0.5 - (vec2(h21(ci), h21(ci+3.7))-0.5)*0.5;
  float sr = 0.34*clamp((spotAmt*1.25 - h21(ci+11.))*3., 0., 1.);
  float srr = max(sr, 1e-3);
  float spot = (1. - smoothstep(srr*0.6, srr, length(cp))) * step(0.001, sr) * (0.3 + 0.7*isTop);
  spot = mix(spotAmt*0.35*(0.3+0.7*isTop), spot, lod);
  float rainX = mix(85., -95., clamp((uU-0.38)/0.08, 0., 1.));
  float rained = smoothstep(0., 14., vP.x - rainX + (vn(vP.zy*0.2)-0.5)*10.);
  float wet = max(rained, spot);
  if (dark) wet *= 0.3;
  float fy = frontY() + (vn(vec2(s*0.3, tier))-0.5)*3.0 + (vn(vec2(s*1.9, 7.))-0.5)*0.9;
  float run = smoothstep(fy-0.2, fy+0.2, vP.y) * step(vP.y, -0.02) * ((flight || wall) && vP.z < 37.9 ? 1. : 0.);
  float age = clamp((vP.y - fy)/12., 0., 1.);
  if (carved || plaster || jali) {                            // eaves and sills dribble once it rains hard
    float dr = smoothstep(0.52, 0.66, vn(vec2(s*5., vP.y*0.3 + uTime*1.6)) * vn(vec2(s*1.3, 2.)) * 1.6);
    run = dr * smoothstep(0.5, 0.6, uU) * (1.-isTop) * 0.5 * lod;
  }

  // ---- light ----
  float nl = max(dot(N, uSunDir), 0.);
  float vis = sunVis(vP + N*0.25);
  if (dark) vis *= 0.25;
  vis *= mix(1., smoothstep(41.2, 38.7, vP.z), step(vP.y, -0.3));        // the buried hall and galleries are roofed; the roof terrace and kiosks are not
  float ao = mix(0.66, 1., smoothstep(-72., 4., vP.y));
  float litK = nl * vis;
  alb = mix(alb, alb*(uWet/max(uDry, vec3(0.05)))*1.15, wet*mix(0.3, 0.5, litK));   // wet stone darkens; in shade a little less, so the low tiers keep their courses
  vec3 hemi = mix(uBounce, uFill, clamp(up*0.35 + 0.65, 0., 1.)) * ao * (1. - 0.55*litK) * (1. + 0.2*wet*(1. - litK));
  vec3 sun = uSunCol * uSunI * litK;
  vec3 albS = mix(alb, vec3(dot(alb, vec3(0.3, 0.5, 0.2))), 0.8*uCool*(1. - litK));   // honey stone in blue skylight reads slate, not brown; in the sun it stays gold
  vec3 col = alb * sun + albS * hemi;
  if (vM > 6.9) col += alb * 0.32;                              // garlands and pennants keep their colour in shade
  bool gal = dark && vP.z > 38.5 && (abs(vP.x) > 8.5 || vP.y > -38.9);       // the shaded rooms behind the pavilion's arches (not the hall)
  float galH = fract((vP.y + 65.)/13.)*13.;                                  // height above that storey's floor
  if (gal) col += albS * (uFill*0.5 + uBounce*0.6) * smoothstep(11., 0., galH);   // light thrown up off the gallery floor

  // wet sheen: sky in the film, a sun glint on wet treads
  vec3 R = reflect(-V, N);
  float nv = clamp(dot(N, V), 0., 1.); float fr = 1.-nv; fr = 0.09 + 0.6*fr*fr*fr;
  col += wet * fr * skyRefl(R) * ao * (dark ? 0.2 : 1.) * (1. - nm);
  float rl = max(dot(R, uSunDir), 0.); float sp = rl*rl; sp *= sp; sp *= sp; sp *= sp;
  col += uSunCol * uSunI * sp * sp * vis * wet * 0.5;

  // oil lamps: a flame low in every niche, a warm wash on the gallery back walls
  if (uLamp > 0.) {
    float fl = 0.8 + 0.2*sin(uTime*9. + vP.x*3.1 + vP.y*1.7) * sin(uTime*13.7 + vP.z*2.3);
    float yn = 5.*(1.-yy);
    col += nm * uLamp * fl * vec3(2.6, 1.15, 0.3) * smoothstep(3.6, 1.7, yn) * (1. + 3.*smoothstep(2.25, 1.75, yn));
    col += alb * uLamp * fl * vec3(1.5, 0.66, 0.2) * lampG * (1. - nm) * 1.1;
    if (dark && vP.z > 38.5) {                               // one oil lamp to a bay, and not in every bay: pools of light, dark rooms between
      float ax = abs(vP.x), sg = vP.x < 0. ? -1. : 1.;
      float bi = ax < 2.5 ? -2. : (ax < 7.5 ? -1. : floor((ax - 7.5)/4.625));
      float bc = ax < 2.5 ? 0. : (ax < 7.5 ? 5. : 7.5 + 4.625*(bi + 0.5));
      float id = (bi + 3.)*(ax < 2.5 ? 1. : sg), stF = floor((vP.y + 65.)/13.);
      float k = mod(id*7. + stF*13. + id*stF*3. + 120., 5.);     // small exact integers: the world places its lamp glows by the same rule
      float lit = k < 0.5 ? 1. : ((k > 1.5 && k < 2.5) ? 0.45 : 0.);
      if (abs(abs(id) - 3.) < 0.5 && abs(stF - 1.) < 0.5) lit = 1.;        // and always the pair that flanks the great arch
      vec3 lv = vP - vec3(sg*bc, stF*13. - 65. + 2.0, 41.5);          // the lamp stands at the back wall
      float fl2 = 0.82 + 0.18*sin(uTime*8.3 + id*2.7 + stF*1.9)*sin(uTime*12.1 + id*4.3 + stF);
      float pool = gal ? lit*fl2*(exp(-dot(lv, lv)/2.2)*1.5 + exp(-dot(lv, lv)/14.)*0.14) : 0.;      // a tight pool with its falloff inside the bay and a faint spill: a lamp, not a lit panel
      col += uLamp * vec3(1.5, 0.62, 0.16) * alb * 2.6 * (0.03*(0.7 + 0.5*vn(vec2(s*0.35, vP.y*0.3)))*smoothstep(9., 1., galH) + pool);
    }
  }
  // ---- falling water ----
  float t = uTime;
  float wv, far;
  vec3 outN = (-vP.z > abs(vP.x)) ? vec3(0.,0.,1.) : vec3(-sign(vP.x), 0., 0.);
  float facing = abs(dot(N, outN));                            // 1 on faces looking into the well, 0 on risers
  if (isTop > 0.5) {                                          // film racing over treads and ledges
    float a = vn(vP.xz*vec2(5.,5.) + t*vec2(1.7,-1.1)), b2 = vn(vP.xz*2.1 - t*vec2(0.9,1.3));
    wv = smoothstep(0.35, 0.8, a*0.6 + b2*0.6) * 0.5 + (flight ? 0.14 : 0.0); far = flight ? 0.4 : 0.2;
  } else {                                                    // streaks at fall speed with dark gaps
    float a = vn(vec2(s*2.4, vP.y*0.2 + t*1.5)), b2 = vn(vec2(s*7., vP.y*0.6 + t*3.8));       // longer than they are wide, at fall speed
    float colm = vn(vec2(s*0.55, tier*5.))*0.6 + vn(vec2(s*1.6, tier*5. + 3.))*0.4;
    float st = a*0.62 + b2*0.38 + (colm-0.5)*0.9;
    if (flight && facing < 0.5) { wv = 0.62 + 0.38*smoothstep(0.25, 0.6, st); far = 0.86; }        // every step a white fall
    else if (flight) { wv = smoothstep(0.45, 0.8, st) * 0.62; far = 0.24; }                            // sheets off the tread ends
    else { float fine = vn(vec2(s*11., vP.y*0.3 + t*4.4));
      wv = smoothstep(0.56, 0.9, st) * (0.62 - 0.3*yy) * (0.25 + 0.25*fine + fine*fine) * (1. + 0.6*smoothstep(0.13, 0., yy)) + 0.4*smoothstep(0.07, 0.01, yy)
         + 0.5*smoothstep(0.84, 1., yy) * smoothstep(0.3, 0.7, vn(vec2(s*1.4 + t*0.7, tier*3. + t*1.1))) * smoothstep(0.3, 0.7, st + 0.2);   // and boiling white where they land on the ledge
      far = 0.07; }   // threads down the wall, rooted in a bright line under each ledge
  }
  float glint = smoothstep(0.8, 0.98, vn(vec2(s*17. + vP.y*0.6, vP.y*0.7 + t*6.3) + (isTop > 0.5 ? vP.xz*3. : vec2(0.)))) * lod;   // bright beads riding the falls
  wv = mix(far, wv, lod*0.8 + 0.2) * run * (0.6 + 0.4*age) * (1. - 0.85*nm);
  float edge = smoothstep(0.8, 0., abs(vP.y - fy)) * run;      // the bright lip of the front
  wv = clamp(wv + edge*0.5, 0., 1.);
  vec3 wfill = mix(uBounce, uFill, 0.8); wfill = mix(wfill, vec3(dot(wfill, vec3(0.333))), 0.45);       // shaded water is silver, not blue
  vec3 wlight = uSunCol*uSunI*vis*(0.62 + 0.38*nl) * 0.62 + wfill*ao*mix(1.15, 0.8, vis);
  vec3 wtint = mix(vec3(0.88,0.92,1.0), mix(vec3(1.0,0.9,0.7), uSunCol, 0.5), vis);   // silver in shade, a gold sheet where lit
  col = mix(col, wtint*wlight*0.92, wv);
  col += wtint*wlight * glint * wv * 0.75 + vec3(1.5, 0.66, 0.2) * uLamp * lampG * wv * 0.8;
  // foam where the pool meets the stone
  float pl = smoothstep(0.55, 0., abs(vP.y - uPoolY - 0.12)) * smoothstep(0.47, 0.55, uU) * (0.5+0.5*vn(vec2(s*2.+t*0.6, t*0.8)));
  col = mix(col, vec3(0.8,0.85,0.8)*wlight, pl*0.7);

  if (glowM) col = mix(col, vC * (0.8 + 0.2*sin(uTime*9.3 + vP.x*3.1 + vP.z*2.3)*sin(uTime*13.1 + vP.y*1.7)), 0.6 + 0.4*uLamp);   // a flame, or the ceiling it lights
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,W=t=>Object.assign(P.UniformsUtils.clone(P.UniformsLib.fog),t);function V0(t){const l=i0();l.m=L0;const i=.36,u=(D/2-i)/20,r=x0;for(const e of[1,-1]){const o=s=>e*(i+s*u),n=s=>N-.25*s;for(let s=0;s<20;s++){const c=.9+.12*t();if(l.tint(.86*c,.84*c,.82*c),l.quad([o(s),n(s),0],[o(s),n(s),r],[o(s),n(s+1),r],[o(s),n(s+1),0]),s<19){const a=1+.12*t(),h=-.03*t();l.tint(1.04*a,1.03*a,1*a),l.quad([o(s),n(s+1),0],[o(s+1),n(s+1)+h*.3,0],[o(s+1),n(s+1)+h,r],[o(s),n(s+1),r]),l.tint(.97,.96,.95),l.tri([o(s),n(s+1),r],[o(s+1),n(s+1)+h,r],[o(s+1),n(s+2),r])}}l.tint(.97,.96,.95),l.quad([0,0,r],[o(19),0,r],[o(0),n(1),r],[0,n(1),r]),l.quad([0,n(1),r],[o(0),n(1),r],[o(0),N,r],[0,N,r])}return l.tint(1.08,1.07,1.04),l.quad([-i,N,0],[i,N,0],[i,N,r],[-i,N,r]),l.geometry()}function c0(t,l){const i=J(t),u=t%2,r=[];if(l===0)for(let e=-6;e<=6;e++){const o=e*D+u*D/2;Math.abs(o)+D/2<=i-3.2&&r.push(o)}else for(let e=0;e<9;e++){const o=C-D/2-e*D-u*D/2;o-D/2>=-i+3.2&&r.push(o)}return r}function G(t,l,i,u,r,e=new P.Vector3){const o=J(t);return l===0?e.set(i,r,-o+u):e.set(l===1?o-u:-o+u,r,i)}function D0(t,l,i){t.home(),t.m=Q;for(let c=0;c<K;c++){const a=J(c),h=-N*c,v=-N*(c+1),p=a-s0,d=.93+.1*l();t.tint(d,d*.985,d*.96),t.quad([-a,h,-a],[a,h,-a],[a,v,-a],[-a,v,-a]),t.quad([a,h,-a],[a,h,C],[a,v,C],[a,v,-a]),t.quad([-a,h,-a],[-a,h,C],[-a,v,C],[-a,v,-a]),t.tint(d*1.08,d*1.06,d*1.02);const y=.2,f=h-.4;t.quad([-a,h,-a+y],[a,h,-a+y],[a,f,-a+y],[-a,f,-a+y]),t.quad([-a,f,-a+y],[a,f,-a+y],[a,f-.12,-a],[-a,f-.12,-a]);for(const m of[1,-1])t.quad([m*(a-y),h,-a],[m*(a-y),h,C],[m*(a-y),f,C],[m*(a-y),f,-a]),t.quad([m*(a-y),f,-a],[m*(a-y),f,C],[m*a,f-.12,C],[m*a,f-.12,-a]);t.tint(d*1.03,d*1.02,d),t.quad([-a,v,-a],[a,v,-a],[a,v,-p],[-a,v,-p]),t.quad([p,v,-p],[a,v,-p],[a,v,C],[p,v,C]),t.quad([-p,v,-p],[-a,v,-p],[-a,v,C],[-p,v,C])}const u=J(K)+3,r=14,e=16;for(let c=0;c<r;c++)for(let a=0;a<e;a++){const h=-u+2*u*c/r,v=-u+2*u*(c+1)/r,p=-u+(C+u)*a/e,d=-u+(C+u)*(a+1)/e,y=.7+.12*l();t.tint(y,y*.99,y*.96),t.quad([h,o0(h,p),p],[v,o0(v,p),p],[v,o0(v,d),d],[h,o0(h,d),d])}const o=[],n=[];for(let c=0;c<K;c++)for(let a=0;a<3;a++)for(const h of c0(c,a)){if(c>0&&l()<i){n.push({k:c,wall:a,c:h});continue}o.push({k:c,wall:a,c:h,tint:.92+.14*l(),warm:(l()-.5)*.06})}const s=new P.Vector3;for(const c of n){const a=-N*(c.k+1);for(let h=0;h<16;h++){const v=c.c+(l()-.5)*12,p=.3+l()*2.3,d=.35+l()*.75,y=d*(.5+l()*.6);G(c.k,c.wall,v,p,a,s);const f=.8+.25*l();t.tint(f,f*.98,f*.94),t.at(s.x,s.y+Math.max(0,1.6-Math.abs(v-c.c)*.3)*l(),s.z,l()*3.1),t.box(-d,0,-d*.7,d,y,d*.7,.06)}t.home()}return{inst:o,rubble:n}}function E0(t,l,i){const u=new P.InstancedMesh(t,i,l.length),r=new P.Matrix4,e=new P.Quaternion,o=new P.Vector3(1,1,1),n=new P.Vector3,s=new P.Vector3(0,1,0),c=new Float32Array(l.length*3);return l.forEach((a,h)=>{G(a.k,a.wall,a.c,0,-N*(a.k+1),n),e.setFromAxisAngle(s,a.wall===0?0:a.wall===1?-Math.PI/2:Math.PI/2),u.setMatrixAt(h,r.compose(n,e,o)),c[h*3]=a.tint+a.warm,c[h*3+1]=a.tint,c[h*3+2]=a.tint-a.warm}),t.setAttribute("aTint",new P.InstancedBufferAttribute(c,3)),u.instanceMatrix.needsUpdate=!0,u.frustumCulled=!1,u}function k(t,l,i=1,u=.1,r=.03){const e=i*(1-u/2+u*l()),o=(l()-.5)*r;return t.tint(e*1.02+o,e*.97,e*.92-o)}function w0(t,l,i,u,r,e,o=.5){t.m=T,k(t,l,.98),t.at(i,u,r),t.box(-o*1.35,0,-o*1.35,o*1.35,.7,o*1.35,.08);const n=e*.52;t.lathe(0,0,[[o*1.2,.7],[o*1.2,1.05],[o,1.2],[o*.92,n],[o*1.18,n+.14],[o*1.18,n+.5],[o*.9,n+.66],[o*.84,e-1.3],[o*1.25,e-1.1],[o*1.25,e-.82],[o*.9,e-.68],[o*1.55,e-.12],[o*1.55,e]],8,Math.PI/8,!1),k(t,l,1.05);for(const s of[1,-1])t.quad([s*o,e-.9,-.22],[s*(o+.95),e-.12,-.22],[s*(o+.95),e,-.22],[s*o,e,-.22]),t.quad([s*o,e-.9,.22],[s*(o+.95),e-.12,.22],[s*(o+.95),e,.22],[s*o,e,.22]),t.quad([s*o,e-.9,-.22],[s*(o+.95),e-.12,-.22],[s*(o+.95),e-.12,.22],[s*o,e-.9,.22]);t.home()}function g0(t,l,i,u,r,e,o,n,s=.5,c=5,a=10){t.m=T,k(t,l,1.02);const h=u-i,v=p=>{const d=Math.abs(p*2-1),y=Math.pow(Math.max(0,1-Math.pow(d,2.3)),.62),f=Math.abs(Math.sin(p*Math.PI*c));return r+e*y-e*.085*(1-f)*Math.min(1,y*2.5)};for(let p=0;p<a;p++){const d=p/a,y=(p+1)/a,f=i+h*d,m=i+h*y,g=v(d),S=v(y);t.quad([f,g,n],[m,S,n],[m,o,n],[f,o,n]),t.quad([f,g,n],[m,S,n],[m,S,n+s],[f,g,n+s])}}function P0(t,l,i,u,r,e=1,o=!1,n=0){t.at(i-.5*e*Math.sin(n),u,r-.5*e*Math.cos(n),n),t.m=T,k(t,l,1),t.lathe(0,0,[[.25*e,-2.2*e],[.7*e,-1.6*e],[.85*e,-1.45*e],[1.25*e,-.8*e],[1.4*e,-.62*e],[1.85*e,-.12*e],[1.85*e,.1*e]],8,Math.PI/8,!0),t.m=r0,k(t,l,1.08),t.lathe(0,0,[[1.72*e,.1*e],[1.72*e,1*e],[1.8*e,1.08*e]],8,Math.PI/8,!1),t.m=T;for(let a=0;a<5;a++){const h=Math.PI+Math.PI*(a+0)/4+0,v=Math.cos(h)*1.55*e,p=Math.sin(h)*1.55*e;k(t,l,.98),t.lathe(v,p,[[.17*e,.1*e],[.13*e,1.4*e],[.17*e,1.5*e],[.12*e,2.7*e],[.24*e,2.95*e]],6,0,!1)}k(t,l,.94),t.lathe(0,0,[[1.8*e,2.95*e],[2.45*e,2.85*e],[2.5*e,2.98*e],[1.75*e,3.35*e],[1.7*e,3.6*e]],8,Math.PI/8,!1),t.m=b,t.tint(.74,.5,.24);const s=o?[[1.75,3.6],[1.7,4],[1.35,4.5],[.7,4.85],[.2,4.95]]:[[1.6,3.6],[1.66,3.95],[1.45,4.5],[1,4.95],[.45,5.2],[.14,5.28]];t.lathe(0,0,s.map(([a,h])=>[a*e,h*e]),10,0,!1),t.m=T,k(t,l,1.1);const c=s[s.length-1][1]*e;t.lathe(0,0,[[.14*e,c],[.3*e,c+.2*e],[.1*e,c+.42*e],[.2*e,c+.6*e],[0,c+1.1*e]],6,0,!1),t.home()}function M0(t,l,i,u,r,e,o){t.at(i,u,r),t.m=T,k(t,l,1),t.box(-1.9*e,0,-1.9*e,1.9*e,.5*e,1.9*e,.1);for(const[n,s]of[[1,1],[1,-1],[-1,1],[-1,-1]])k(t,l,.97),t.lathe(n*1.4*e,s*1.4*e,[[.26*e,.5*e],[.2*e,.9*e],[.18*e,2.6*e],[.3*e,2.8*e],[.2*e,2.95*e],[.36*e,3.3*e]],6,0,!1);if(k(t,l,.92),t.lathe(0,0,[[1.95*e,3.3*e],[2.65*e,3.18*e],[2.7*e,3.3*e],[1.9*e,3.7*e],[1.8*e,4*e]],4,Math.PI/4,!1),t.m=b,t.tint(.76,.52,.25),t.lathe(0,0,[[1.7,4],[1.78,4.4],[1.6,5],[1.15,5.55],[.55,5.9],[.16,6]].map(([n,s])=>[n*e,s*e]),10,0,!1),t.m=T,k(t,l,1.1),t.lathe(0,0,[[.16*e,6*e],[.34*e,6.25*e],[.1*e,6.5*e],[.22*e,6.72*e],[.03,7.5*e]],6,0,!1),o){t.box(-.04,7.4*e,-.04,.04,9.6*e,.04,0),t.tint(o[0],o[1],o[2]);const n=8.3*e,s=9.5*e,c=5,a=2.6;for(let h=0;h<c;h++){const v=h/c,p=(h+1)/c;t.m=7+v*.39,t.v(v*a,B(n,(n+s)/2,v),0),t.v(v*a,B(s,(n+s)/2,v),0),t.m=7+p*.39,t.v(p*a,B(n,(n+s)/2,p),0),t.m=7+v*.39,t.v(v*a,B(s,(n+s)/2,v),0),t.m=7+p*.39,t.v(p*a,B(s,(n+s)/2,p),0),t.v(p*a,B(n,(n+s)/2,p),0)}}t.home()}function O(t,l,i,u,r,e,o,n=.3,s=10){t.tint(o[0],o[1],o[2]);for(let c=0;c<s;c++){const a=c/s,h=(c+1)/s,v=f=>u-e*4*f*(1-f),p=f=>7.05+.3*4*f*(1-f),d=B(l,i,a),y=B(l,i,h);t.m=p(a),t.v(d,v(a),r),t.v(d,v(a)-n,r),t.m=p(h),t.v(y,v(h)-n,r),t.m=p(a),t.v(d,v(a),r),t.m=p(h),t.v(y,v(h)-n,r),t.v(y,v(h),r)}}function t0(t,l,i,u,r,e,o=.28,n=9){for(let s=0;s<n;s++){const c=s/n,a=(s+1)/n,h=B(i,u,c),v=B(i,u,a),p=s%2?.82:1.08,d=o*(s%2?.5:.36),y=o*(s%2?.36:.5);t.tint(e[0]*p,e[1]*p,e[2]*p),t.m=7.04+c*.26,t.v(l-d,h,r),t.v(l+d,h,r),t.m=7.04+a*.26,t.v(l+y,v,r),t.m=7.04+c*.26,t.v(l-d,h,r),t.m=7.04+a*.26,t.v(l+y,v,r),t.v(l-y,v,r)}}async function Q0(t,l,i,u){const r=[7.5,12.125,16.75,21.375,26],e=C,o=C+.6,n=C+4,s=26.6,c=8.9;t.home();for(const f of[1,-1]){t.m=Q,t.tint(.95,.94,.92),t.quad([f*s,0,e],[f*66,0,e],[f*66,-V,e],[f*s,-V,e]),t.m=T;for(let m=1;m<=5;m++){const g=-V+13*m;k(t,l,1.06,.05),t.quad([f*s,g,e-.28],[f*66,g,e-.28],[f*66,g-.45,e-.28],[f*s,g-.45,e-.28]),t.quad([f*s,g,e-.28],[f*66,g,e-.28],[f*66,g,e],[f*s,g,e]),t.quad([f*s,g-.45,e-.28],[f*66,g-.45,e-.28],[f*66,g-.65,e],[f*s,g-.65,e])}}for(let f=0;f<5;f++){const m=-V+13*f,g=f<2,S=g?[[-s,-c],[c,s]]:[[-s,s]];for(const[x,M]of S){t.m=Q,t.tint(.9,.89,.86),f>0&&t.quad([x,m+.02,e],[M,m+.02,e],[M,m+.02,n],[x,m+.02,n]),t.m=H,t.tint(1.5,1.3,1.1),t.quad([x,m,n],[M,m,n],[M,m+2.2,n],[x,m+2.2,n]),t.tint(.8,.75,.75),t.quad([x,m+2.2,n],[M,m+2.2,n],[M,m+11,n],[x,m+11,n]),t.quad([x,m+10.6,e+1],[M,m+10.6,e+1],[M,m+10.6,n],[x,m+10.6,n]);for(const F of[x,M])t.quad([F,m,e],[F,m,n],[F,m+13,n],[F,m+13,e]);t.m=T,k(t,l,1,.06),t.box(x,m+10,e+.05,M,m+11.3,e+1.1,0,!1),k(t,l,.95,.06),t.quad([x,m+11.3,e],[M,m+11.3,e],[M,m+13,e],[x,m+13,e]),k(t,l,1.08,.05);const z=[e+.05,m+11.45],I=[e-1.75,m+10.85];t.quad([x-.3,z[1],z[0]],[M+.3,z[1],z[0]],[M+.3,I[1],I[0]],[x-.3,I[1],I[0]]),t.quad([x-.3,I[1],I[0]],[M+.3,I[1],I[0]],[M+.3,I[1]-.24,I[0]],[x-.3,I[1]-.24,I[0]]),t.tint(.7,.66,.62),t.quad([x-.3,z[1]-.3,z[0]],[M+.3,z[1]-.3,z[0]],[M+.3,I[1]-.24,I[0]],[x-.3,I[1]-.24,I[0]])}const q=[];for(const x of[1,-1])for(let M=g?1:0;M<5;M++)q.push(x*r[M]);g?q.push(c+.1,-c-.1):q.push(2.5,-2.5),q.sort((x,M)=>x-M);for(const x of q)g&&Math.abs(x)<c+.2||w0(t,l,x,m,o,10,.5),t.m=T,k(t,l,1.04),t.quad([x-.2,m+10.05,e],[x+.2,m+10.05,e],[x+.2,m+10.85,e-1.5],[x-.2,m+10.85,e-1.5]),t.quad([x-.2,m+10.05,e],[x-.2,m+10.85,e-1.5],[x-.2,m+10.95,e],[x-.2,m+10.95,e]),t.quad([x+.2,m+10.05,e],[x+.2,m+10.85,e-1.5],[x+.2,m+10.95,e],[x+.2,m+10.95,e]);for(let x=0;x<q.length-1;x++){const M=q[x],z=q[x+1];g&&M<0&&z>0||(g0(t,l,M,z,m+7,2.5,m+10,e+.25,.55,(z-M>4.8,5),10),t.m=r0,k(t,l,1.1,.08),t.quad([M+.5,m+.05,e+.3],[z-.5,m+.05,e+.3],[z-.5,m+1.35,e+.3],[M+.5,m+1.35,e+.3]),t.m=T,t.box(M+.4,m+1.35,e+.16,z-.4,m+1.55,e+.46,0,!0),i.festival&&l()<.3&&f>0&&O(t,M+.4,z-.4,m+9.2,e+.1,1.1,i.garland,.22,8))}await u()}const a=-58,h=-41,v=-39;for(const f of[1,-1])t.at(f*(7.5+.7),0,e+.4),t.m=T,k(t,l,1,.05),t.box(-.95,a,-1.2,.95,a+1.4,1.2,.12),t.box(-.78,a+1.4,-1,.78,-48.2,1,.03),k(t,l,1.08,.05),t.box(-1,-48.2,-1.25,1,-47.3,1.25,-.1),t.box(-.78,-47.3,-1,.78,v,1,0),t.home();if(g0(t,l,-7.5,7.5,-47.2,h+47.2,v+.01,e-.5,1.6,7,28),t.m=T,k(t,l,1.06,.04),t.box(-c,v-.9,e-.75,c,v,e-.5,0,!1),i.festival)for(const f of[1,-1])O(t,f*.4,f*8.6,-39.08,e-.86,.8,i.garland,.32,10),O(t,f*1.6,f*7.4,-39.15,e-.9,1.15,i.garland2,.24,10),t0(t,f*8.75,-40,-46.6,e-.95,i.garland,.3),t0(t,f*8.2,-40,-45.2,e-.97,i.garland2,.24),t0(t,f*7.72,-40,-43.9,e-.95,i.garland,.26);t.m=Q,t.tint(.85,.84,.82),t.quad([-c,a,e-.6],[c,a,e-.6],[c,a,e+16],[-c,a,e+16]),t.m=H,t.tint(.42,.38,.4);for(const f of[1,-1])t.quad([f*8.3,a,e+.9],[f*8.3,a,e+16],[f*8.3,v,e+16],[f*8.3,v,e+.9]);t.quad([-8.3,a,e+16],[8.3,a,e+16],[8.3,v,e+16],[-8.3,v,e+16]),t.quad([-8.3,h+.6,e+1],[8.3,h+.6,e+1],[8.3,h+.6,e+16],[-8.3,h+.6,e+16]);for(const f of[1,-1])for(const m of[3.2,13.6])w0(t,l,f*7.6,a,e+m,h+.6-a,.62);{const f=(S,q,x)=>{const M=.02+.52*Math.exp(-((x-e-8)*(x-e-8))/34)*Math.exp(-((q+48)*(q+48))/70);t.tint(M,.74*M,.36*M),t.v(S,q,x)},m=[e+.95,e+2.6,e+4.3,e+6.1,e+7.9],g=[a+.05,-54.5,-51,-47.5,-44,h+.55];t.m=U;for(const S of[1,-1]){const q=S*8.24;for(let x=0;x<m.length-1;x++)for(let M=0;M<g.length-1;M++)f(q,g[M],m[x]),f(q,g[M],m[x+1]),f(q,g[M+1],m[x+1]),f(q,g[M],m[x]),f(q,g[M+1],m[x+1]),f(q,g[M+1],m[x]);t.tint(.1,.074,.036),t.quad([S*7.39,a+1.45,e-.55],[S*7.39,a+1.45,e+1.35],[S*7.39,-48.25,e+1.35],[S*7.39,-48.25,e-.55])}}t.m=Q;for(let f=0;f<14;f++){const m=a-.5*f,g=m-.5,S=e-.6-.62*f,q=S-.62,x=13+f*.25,M=.9+.12*l();t.tint(M*1.04,M*1.02,M),t.quad([-x,m,S+.62],[x,m,S+.62],[x,m,S],[-x,m,S]),t.tint(M*.88,M*.86,M*.84),t.quad([-x,m,S],[x,m,S],[x,g,S],[-x,g,S]);for(const z of[1,-1])t.quad([z*x,m,S+.62],[z*x,m,S],[z*x,-V,S],[z*x,-V,S+.62])}for(const f of[1,-1]){t.at(f*i.spoutX,i.spoutY,e),t.m=T,k(t,l,1.02),t.box(-.75,-.9,-1.2,.75,.55,.3,.1),t.quad([-.5,-.6,-1.2],[.5,-.6,-1.2],[.36,-.42,-3.3],[-.36,-.42,-3.3]),t.quad([-.5,.25,-1.2],[.5,.25,-1.2],[.36,.3,-3.3],[-.36,.3,-3.3]);for(const m of[1,-1])t.quad([m*.5,-.6,-1.2],[m*.5,.25,-1.2],[m*.36,.3,-3.3],[m*.36,-.42,-3.3]);t.lathe(0,-3.5,[[.42,-.5],[.62,-.2],[.6,.25],[.35,.55]],6,0,!0),t.m=H,t.tint(.2,.2,.2),t.quad([-.3,-.36,-3.32],[.3,-.36,-3.32],[.3,.12,-3.32],[-.3,.12,-3.32]),t.home()}await u();const p=[[1,30.6],[2,31],[3,31],[3,39.5],[4,31],[4,39.8],[4,48.6]];for(const f of[1,-1])for(const[m,g]of p){const S=-V+13*m+4.2,q=1+.12*l();t.m=H,t.tint(.25,.22,.2),t.quad([f*g-.85,S,e-.04],[f*g+.85,S,e-.04],[f*g+.85,S+2.7,e-.04],[f*g-.85,S+2.7,e-.04]),P0(t,l,f*g,S,e,q,i.bangla)}await u(),t.m=Q;for(let f=0;f<6;f++)for(let m=0;m<2;m++){const g=-30+f*10,S=e+.6+m*8.2,q=.9+.1*l();t.tint(q*1.02,q,q*.96),t.quad([g,.04,S],[g+10,.04,S],[g+10,.04,S+8.2],[g,.04,S+8.2])}t.m=T,k(t,l,1,.04),t.box(-s,0,e,s,1.25,e+.6,.04);for(let f=-s+.7;f<s-.5;f+=1.7)k(t,l,1,.14),t.at(f,1.25,e+.3),t.lathe(0,0,[[.62,0],[.62,.45],[.3,.95],[0,1.15]],4,0,!1,.42);t.home();const d=i.kiosks,y=21.5;for(let f=0;f<d;f++){const m=d===1?0:-y+2*y*f/(d-1),g=f===(d-1)/2;M0(t,l,m,0,e+3.4,g?1.55:1+.08*l(),i.festival&&(g||l()<.5)?i.flag:null)}}function U0(t){let l=t>>>0||1;return()=>(l=Math.imul(l,1664525)+1013904223>>>0,l/4294967296)}function f0(t,l,i,u,r=1){t.m=T,t.tint(.8,.74,.66),t.lathe(l,u,[[.16*r,i],[.1*r,i+.12*r],[.24*r,i+.3*r],[.2*r,i+.36*r]],6,0,!0),t.m=U,t.tint(3.4,1.55,.4),t.lathe(l,u,[[0,i+.36*r],[.14*r,i+.5*r],[.09*r,i+.72*r],[0,i+.98*r]],5,0,!1)}function S0(t,l,i,u,r,e,o,n){t.m=T,t.tint(.5,.42,.34),t.box(l-.05,u-1.7,i-.05,l+.05,e,i+.05,0),t.tint(n[0],n[1],n[2]);const s=6,c=(u+r)/2;for(let a=0;a<s;a++){const h=a/s,v=(a+1)/s,p=7+h*.39,d=7+v*.39;t.m=p,t.v(l-h*o,B(u,c,h),i),t.v(l-h*o,B(r,c,h),i),t.m=d,t.v(l-v*o,B(u,c,v),i),t.m=p,t.v(l-h*o,B(r,c,h),i),t.m=d,t.v(l-v*o,B(r,c,v),i),t.v(l-v*o,B(u,c,v),i)}}function e0(t,l,i,u,r,e,o,n,s){t.at(i,u,r,e),t.m=T,k(t,l,1),t.box(-1.9*o,0,-1.9*o,1.9*o,.5*o,1.9*o,.1);for(const[v,p]of[[1,1],[1,-1],[-1,1],[-1,-1]])k(t,l,.97),t.lathe(v*1.4*o,p*1.4*o,[[.26*o,.5*o],[.2*o,.9*o],[.18*o,2.6*o],[.3*o,2.8*o],[.2*o,2.95*o],[.36*o,3.3*o]],6,0,!1);k(t,l,.92),t.lathe(0,0,[[1.95*o,3.3*o],[2.65*o,3.18*o],[2.7*o,3.3*o],[1.9*o,3.7*o],[1.8*o,4*o]],4,Math.PI/4,!1),t.m=b,t.tint(.78,.53,.25),t.lathe(0,0,[[1.7,4],[1.78,4.4],[1.6,5],[1.15,5.55],[.55,5.9],[.16,6]].map(([v,p])=>[v*o,p*o]),10,0,!1),t.m=T,k(t,l,1.1),t.lathe(0,0,[[.16*o,6*o],[.34*o,6.25*o],[.1*o,6.5*o],[.22*o,6.72*o],[.03,7.5*o]],6,0,!1),k(t,l,.9),t.box(-1.55*o,.5*o,-1.8*o,1.55*o,3.3*o,-1.5*o,0),t.m=U,t.tint(.8,.36,.1),t.quad([-1.2*o,.75*o,-1.48*o],[1.2*o,.75*o,-1.48*o],[1.2*o,3*o,-1.48*o],[-1.2*o,3*o,-1.48*o]),t.tint(.62,.27,.08),t.quad([-1.7*o,3.28*o,-1.45*o],[1.7*o,3.28*o,-1.45*o],[1.7*o,3.28*o,1.7*o],[-1.7*o,3.28*o,1.7*o]),t.m=T,k(t,l,1.05),t.lathe(0,0,[[.6*o,.5*o],[.66*o,.72*o],[.38*o,.86*o],[.56*o,1.1*o],[.5*o,1.2*o]],8,0,!0),f0(t,0,1.2*o,0,1.25*o);const c=Math.cos(e),a=Math.sin(e),h=2.85-1.9*o;for(const[v,p]of[[1,1],[-1,1],[1,-1],[-1,-1]]){const d=v*1.75*o,y=p*1.75*o;f0(t,d,3.4*o,y,.85*o),p>0&&s.push([i+d*c+y*a,u+4*o,r-d*a+y*c])}if(h<1.9*o){t.m=T,k(t,l,.9);const v=1.9*o,p=1.9*o;t.quad([-v,0,p],[v,0,p],[v*.8,-1.7,h],[-v*.8,-1.7,h]);for(const d of[1,-1])t.tri([d*v,0,p],[d*v*.8,-1.7,h],[d*v,0,h])}O(t,-1.4*o,1.4*o,3.12*o,1.5*o,.75*o,n.garland,.26,8),O(t,-1.4*o,1.4*o,3.16*o,1.56*o,1.15*o,n.garland2,.18,8);for(const v of[1,-1])t0(t,v*1.4*o,3.1*o,1.3*o,1.68*o,n.garland,.26);S0(t,0,0,8.3*o,9.5*o,9.7*o,2.8,n.flag),s.push([i,u+1.95*o,r]),t.home()}function Y0(t,l,i,u){const s=Math.PI/8;t.at(59,0,-59),t.m=T,k(t,l,.98,.05),t.lathe(0,0,[[3.6,-15],[3.6,-15+.9],[3.25,-15+1.1],[3.15,-5.4],[3.4,-5.2],[3.4,-4.7],[3.15,-4.5],[3.05,.2],[3.3,.4],[3.3,.9],[3.05,1.1],[3,4.4],[3.3,4.7],[4.5,6],[4.5,6.4]],8,s,!0),t.m=r0,k(t,l,1.08,.05),t.lathe(0,0,[[4.42,6.4],[4.42,6.4+1],[4.28,6.4+1]],8,s,!1),t.m=T;for(let c=0;c<8;c++){const a=s+c*Math.PI/4;k(t,l,.97),t.lathe(Math.cos(a)*3.45,Math.sin(a)*3.45,[[.44,6.4],[.44,6.4+.5],[.3,6.4+.7],[.27,6.4+3.6],[.44,6.4+3.85],[.3,6.4+4.05],[.52,6.4+4.6]],6,0,!1)}k(t,l,.92),t.lathe(0,0,[[3.8,6.4+4.6],[5.3,6.4+4.3],[5.4,6.4+4.5],[3.8,6.4+5.2],[3.5,6.4+5.7]],8,s,!1),t.m=U,t.tint(.72,.32,.09),t.lathe(0,0,[[0,6.4+4.56],[3.75,6.4+4.56]],8,s,!1),t.m=b,t.tint(.8,.54,.25),t.lathe(0,0,[[3.3,6.4+5.7],[3.45,6.4+6.5],[3.15,6.4+7.7],[2.3,6.4+8.9],[1.15,6.4+9.7],[.32,6.4+9.95]],12,0,!1),t.m=T,k(t,l,1.1),t.lathe(0,0,[[.32,6.4+9.95],[.66,6.4+10.45],[.2,6.4+10.95],[.44,6.4+11.4],[.05,6.4+12.9]],6,0,!1),S0(t,0,0,6.4+14.3,6.4+16.2,6.4+16.5,4.6,i.flag),f0(t,0,6.4,0,2.1),u.push([59,6.4+1.5,-59]);for(const[c,a]of[[-1,0],[-Math.SQRT1_2,Math.SQRT1_2],[0,1]]){const h=-a,v=c,p=3.02*Math.cos(s)+.05,d=c*p,y=a*p;t.m=U,t.tint(.85,.38,.11),t.quad([d-h*.42,1.7,y-v*.42],[d+h*.42,1.7,y+v*.42],[d+h*.42,3.3,y+v*.42],[d-h*.42,3.3,y-v*.42]),t.tri([d-h*.42,3.3,y-v*.42],[d+h*.42,3.3,y+v*.42],[d,3.85,y])}{const c=Math.SQRT1_2,a=3.2*Math.cos(s)+.06,h=-c*a,v=c*a;t.m=U,t.tint(.95,.42,.12),t.quad([h-c*.8,-9.4,v-c*.8],[h+c*.8,-9.4,v+c*.8],[h+c*.8,-6.7,v+c*.8],[h-c*.8,-6.7,v-c*.8]),t.home(),P0(t,l,59-c*2.96,-9.5,-59+c*2.96,1.3,i.bangla,3*Math.PI/4),u.push([59-c*3.9,-8.2,-59+c*3.9])}t.home()}function G0(t,l,i){if(t.m=T,k(t,l,1.05,.1),i===0)t.lathe(0,0,[[.34,0],[.4,.25],[.27,.6],[.36,.95],[.42,1.2],[.3,1.38],[.13,1.45],[.11,1.56]],7,l()*6,!0,.7),t.box(.3,.95,-.12,.62,1.28,.12,.05);else if(i===1)t.lathe(0,0,[[0,0],[.5,.06],[.8,.3],[.86,.8],[.8,1.3],[.5,1.54],[0,1.6]],12,0,!1,.16),t.lathe(0,-.1,[[0,.5],[.3,.6],[.3,1],[0,1.1]],8,0,!1,.2);else{t.box(-.95,.5,-.36,.85,1.22,.36,.1),t.lathe(.42,0,[[.34,1.15],[.3,1.4],[0,1.56]],6,0,!1),t.box(.8,.8,-.24,1.12,1.2,.24,.07);for(const[u,r]of[[-.72,-.24],[-.72,.24],[.6,-.24],[.6,.24]])t.box(u-.12,0,r-.11,u+.12,.55,r+.11,.02)}}async function j0(t,l,i,u){const r=[[.9,.03],[.9,.5],[.62,.72],[.56,3.5],[.76,3.72],[.76,4.1],[.6,4.28],[.98,4.95],[.98,5.2]],e=[{at:[0,0,-L],rot:0,a:-71,c:71,gap:null},{at:[L,0,0],rot:-Math.PI/2,a:-71,c:C,gap:null},{at:[-L,0,0],rot:Math.PI/2,a:-C,c:71,gap:[-i.gapZ-9,-i.gapZ+9]}],o=(n,s,c=0)=>n.gap&&s>n.gap[0]-c&&s<n.gap[1]+c;for(const n of e){const s=()=>t.at(n.at[0],n.at[1],n.at[2],n.rot);s(),t.m=Q,t.tint(.9,.89,.86),t.quad([n.a,.08,0],[n.c,.08,0],[n.c,.08,-7.4],[n.a,.08,-7.4]);const c=n.gap?[[n.a+6,n.gap[0]+1.5],[n.gap[1]-1.5,n.c]]:[[n.a+6,n.c-(n.rot===0?6:0)]];for(const[a,h]of c)for(let v=a;v<h-.1;v+=6.5){const p=Math.min(v+6.5,h),d=l()<.12?.35+.3*l():.95;s(),t.m=T,k(t,l,1,.1),t.box(v+.03,0,-.5,p-.03,d,-.05,.03),d>.9&&(k(t,l,1.08,.06),t.box(v,d,-.58,p,d+.16,.02,.02))}for(let a=n.a+2.8;a<n.c-1;a+=5.6){const h=o(n,a,.5),v=h&&(!o(n,a-5.6,.5)||!o(n,a+5.6,.5));for(const p of[-1.9,-5.9])if(s(),t.at(t.ox+(a*t.cs+p*t.sn),0,t.oz+(-a*t.sn+p*t.cs),l()*.8),t.m=T,k(t,l,.98,.12),!h)t.lathe(0,0,r,8,Math.PI/8,!1);else if(v){const d=3+l()*1.1;t.lathe(0,0,[[.9,.03],[.9,.5],[.62,.72],[.57,d-.6],[.6,d-.25],[.42,d],[.16,d+.35]],8,0,!0)}else if(l()<.75){const d=.7+l()*1.5;t.lathe(0,0,[[.9,.03],[.9,.5],[.62,.72],[.58,d],[.3,d+.15]],8,0,!0)}}await u();for(let a=n.a+.2;a<n.c-1;a+=11.2){const h=Math.min(a+11.2,n.c+.4);if(o(n,a+2,0)||o(n,h-2,0))continue;s(),t.m=T,k(t,l,.96,.1);const v=l()<.2?-.12-.15*l():0;t.box(a+.04,5.2+v,-7,h-.04,5.75+v,-.8,0,!1),k(t,l,1.06,.06),t.box(a,5.75+v,-7.25,h,6+v,-.55,.05,!1)}await u();for(let a=n.a+5.6*2;a<n.c-8;a+=5.6*(2+l.int(0,2)))o(n,a,3)||(s(),t.at(t.ox+(a*t.cs-3.9*t.sn),.03,t.oz+(-a*t.sn-3.9*t.cs),n.rot+(l()-.5)*.5),t.m=T,k(t,l,.95,.1),t.box(-.8,0,-.6,.8,.9,.6,.06),t.oy+=.9,G0(t,l,l.int(0,2)));if(n.gap){const a=(n.gap[0]+n.gap[1])/2;for(let h=0;h<26;h++){const v=a+(l()-.5)*17,p=-.6-l()*8.5,d=l()<.3;if(s(),t.at(t.ox+(v*t.cs+p*t.sn),.03,t.oz+(-v*t.sn+p*t.cs),l()*6.3),t.m=T,k(t,l,.95,.16),d){const y=1.5+l()*2.2;t.box(-y,0,-.9,y,.35+l()*.3,.9,.05)}else if(l()<.5)t.lathe(0,0,[[.6,0],[.62,.5+l()*.7]],8,0,!0);else{const y=.3+l()*.5;t.box(-y,0,-y*.7,y,y*.9,y*.7,.05)}}for(const h of[-7.4,7.4])s(),t.at(t.ox+((a+h)*t.cs-2.4*t.sn),.03,t.oz+(-(a+h)*t.sn-2.4*t.cs),n.rot+Math.PI+(l()-.5)*.4),t.m=T,k(t,l,.98,.06),t.box(-.9,0,-.7,.9,1.1,.7,.08),t.oy+=1.1,t.lathe(0,0,[[.48,0],[.56,.35],[.38,.85],[.5,1.35],[.6,1.7],[.42,1.95],[.18,2.05],[.15,2.2]],7,0,!0,.7)}await u()}for(const n of[1,-1])M0(n>0?i0():t,l,n*(L+3.9),6,-L-3.9,1.35,null);if(t.home(),await u(),Y0(t,i.xr,i,i.lamps),e0(t,i.xr,0,-40,-44+.15+1.9*1.3,0,1.3,i,i.lamps),e0(t,i.xr,14,-20,-56+.15+1.9*1.3,0,1.3,i,i.lamps),e0(t,i.xr,65-.15-1.9*1.3,-5,-18,-Math.PI/2,1.3,i,i.lamps),e0(t,i.xr,44-.15-1.9*1.3,-40,3,-Math.PI/2,1.3,i,i.lamps),await u(),i.apron>L+8){const n=i.apron,s=i.earth;t.m=R0,t.tint(s[0],s[1],s[2]);const c=0;t.quad([-n,c,-n],[n,c,-n],[n,c,-L],[-n,c,-L]),t.quad([-n,c,C+.6],[n,c,C+.6],[n,c,n],[-n,c,n]),t.quad([-n,c,-L],[-L,c,-L],[-L,c,C+.6],[-n,c,C+.6]),t.quad([L,c,-L],[n,c,-L],[n,c,C+.6],[L,c,C+.6])}}const u0=`
vec3 waterLight(vec3 p){
  float ao = mix(0.55, 1., smoothstep(-72., 4., p.y));
  return uSunCol*uSunI*sunVis(p)*0.5 + uFill*ao*1.05;
}`;function K0(t,l){const i=new P.InstancedBufferGeometry,u=6,r=[],e=[];for(let a=0;a<=u;a++)r.push(-.5,-a/u,0,.5,-a/u,0);for(let a=0;a<u;a++){const h=a*2;e.push(h,h+1,h+3,h,h+3,h+2)}i.setAttribute("position",new P.Float32BufferAttribute(r,3)),i.setIndex(e);const o=new Float32Array(l.length*4),n=new Float32Array(l.length*4);l.forEach((a,h)=>{o.set([a.x,a.y,a.z,a.rot],h*4),n.set([a.w,a.h,a.kind,a.seed],h*4)}),i.setAttribute("iA",new P.InstancedBufferAttribute(o,4)),i.setAttribute("iB",new P.InstancedBufferAttribute(n,4)),i.instanceCount=l.length;const s=new P.ShaderMaterial({uniforms:W(t),fog:!0,transparent:!0,depthWrite:!1,side:P.DoubleSide,vertexShader:`
      attribute vec4 iA, iB; uniform float uTime;
      varying vec3 vP; varying vec4 vQ;
      #include <fog_pars_vertex>
      void main(){
        float t = -position.y, kind = iB.z;
        float sway = sin(uTime*1.7 + iB.w*40. + t*2.)*0.12*t;
        vec3 l = vec3(position.x*iB.x, -t*iB.y, (0.28 + 1.05*t*t)*(kind < 0.5 ? 1. : 0.5) + sway);
        float c = cos(iA.w), s = sin(iA.w);
        vP = iA.xyz + vec3(l.x*c + l.z*s, l.y, -l.x*s + l.z*c);
        vQ = vec4(position.x, t, kind, iB.w);
        vec4 mvPosition = modelViewMatrix*vec4(vP, 1.);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vP; varying vec4 vQ;
      #include <fog_pars_fragment>
      ${Y}
      ${u0}
      void main(){
        float kind = vQ.z, s = vQ.x * (kind < 0.5 ? 12. : 50.) + vQ.w*31.;
        float a, on, bright = 1.;
        if (kind < 0.5) {
          float st = vn(vec2(s*2.6, vP.y*0.5 + uTime*3.9))*0.6 + vn(vec2(s*8., vP.y*1.6 + uTime*6.5))*0.4 + (vn(vec2(s*0.7, vQ.w*9.))-0.5)*0.35;
          // each ledge sheds a few separate falls with dark stone between them, not one pale sheet
          float strm = smoothstep(0.4, 0.6, vn(vec2(s*0.8, vQ.w*9.))*0.75 + vn(vec2(s*2.7, vQ.w*5. + vP.y*0.12 + uTime*0.5))*0.25 + 0.06);
          float thr = vn(vec2(s*7., vP.y*0.3 + uTime*5.2)), thr2 = vn(vec2(s*19., vP.y*0.45 + uTime*8.3));
          a = smoothstep(0.42, 0.95, st) * strm * (0.07 + 0.55*thr*thr + 0.22*thr2*thr2);      // falling threads, not a sheet
          float dC = length(uCam - vP);
          float beads = smoothstep(0.74, 0.98, vn(vec2(s*15., vP.y*0.18 + uTime*7.))) * strm;
          a += 0.34*beads * (1. - smoothstep(34., 70., dC));                      // bright beads racing down (too fine to draw far off)
          float foam = smoothstep(0.55, 0.95, vQ.y) * strm * smoothstep(0.3, 0.75, vn(vec2(s*2.1, uTime*2.3 + vQ.w*5.))*0.6 + vn(vec2(s*6.3, vP.y*2. + uTime*4.))*0.4);
          a += 0.3*foam;                                                          // where a fall lands it boils white
          bright = 0.72 + 0.5*thr2 + 0.85*beads + 0.45*foam;
          float fy = frontY() + (vn(vec2(s*0.6, 3.))-0.5)*1.5;
          on = smoothstep(fy-0.3, fy+0.5, vP.y);
          float sideN = abs(vQ.x) + (vn(vec2(vP.y*0.8 + uTime*2.6, vQ.w*23.)) - 0.5)*0.2 + (vn(vec2(vP.y*3.1 + uTime*5., vQ.w*7.)) - 0.5)*0.07;
          float footN = vQ.y + (vn(vec2(s*1.1, uTime*1.3 + vQ.w*5.)) - 0.5)*0.5 + (vn(vec2(s*4.7, uTime*3.1)) - 0.5)*0.16;
          a *= smoothstep(0.5, 0.3, sideN) * smoothstep(0., 0.06, vQ.y) * (1. - 0.35*vQ.y) * smoothstep(1.08, 0.74, footN);
          a *= smoothstep(6., 15., dC);             // up close a sheet of quads reads as a pane of glass: the wall's own threads carry it there
          on *= smoothstep(-0.25, 0.75, (vP.y - fy)/4.7 - vQ.y*0.6 + 0.35);   // a new curtain lets down from its ledge, it does not switch on whole
        } else {                                                 // eave beads: thin broken threads
          float th = vn(vec2(s*7.5, 1.7)); float bead = vn(vec2(s*7.5, vP.y*1.1 + uTime*7.));
          a = smoothstep(0.66, 0.8, th) * smoothstep(0.35, 0.7, bead) * 0.42 * (1.-vQ.y) * (1.-vQ.y);
          on = smoothstep(0.5, 0.62, uU);
        }
        a *= on * smoothstep(uPoolY, uPoolY + 0.6, vP.y);
        if (a < 0.01) discard;
        gl_FragColor = vec4(vec3(0.9,0.93,0.95)*waterLight(vP)*bright, min(a, 0.9));
        #include <fog_fragment>
      }`}),c=new P.Mesh(i,s);return c.frustumCulled=!1,c.renderOrder=3,c}function W0(t,l){const i=new P.InstancedBufferGeometry;i.setAttribute("position",new P.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),i.setIndex([0,1,2,0,2,3]);const u=new Float32Array(l.length*4),r=new Float32Array(l.length*4);l.forEach((n,s)=>{u.set([n.x,n.y,n.z,n.size],s*4),r.set([n.seed,n.kind,n.y,0],s*4)}),i.setAttribute("iA",new P.InstancedBufferAttribute(u,4)),i.setAttribute("iB",new P.InstancedBufferAttribute(r,4)),i.instanceCount=l.length;const e=new P.ShaderMaterial({uniforms:W(t),fog:!0,transparent:!0,depthWrite:!1,vertexShader:`
      attribute vec4 iA, iB;
      varying vec2 vUv; varying vec3 vC; varying vec2 vA;
      #include <fog_pars_vertex>
      ${Y}
      void main(){
        float seed = iB.x, kind = iB.y;
        float ph = fract(uTime*(0.22 + 0.16*seed) + seed*7.);
        vec3 c = iA.xyz;
        float on = kind < 0.5 ? smoothstep(0.5, 3., c.y - frontY()) * step(uPoolY + 0.2, c.y + 1.5)
                              : smoothstep(0.53, 0.6, uU);
        if (kind > 0.5) c.y = max(c.y, uPoolY) + 0.6;
        c.y += ph*iA.w*0.55; c.x += sin(seed*40. + uTime*0.6)*0.6;
        float sz = iA.w*(0.55 + 0.75*ph);
        vec4 mvPosition = modelViewMatrix*vec4(c, 1.);
        mvPosition.xy += position.xy*sz;
        vUv = position.xy; vC = c; vA = vec2(sin(ph*3.14159)*on, seed);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vUv; varying vec3 vC; varying vec2 vA;
      #include <fog_pars_fragment>
      ${Y}
      ${u0}
      void main(){
        float d = length(vUv);
        float n = vn(vUv*2.2 + vA.y*17. + uTime*0.35);
        float a = smoothstep(1., 0.0, d + (n-0.5)*0.55); a = a*a * vA.x * 0.26;
        if (a < 0.008) discard;
        gl_FragColor = vec4(vec3(0.88,0.91,0.94)*waterLight(vC), a);
        #include <fog_fragment>
      }`}),o=new P.Mesh(i,e);return o.frustumCulled=!1,o.renderOrder=5,o}function O0(t,l,i){const r=Math.sqrt((l[0].y+V)/4.9),e=[],o=[],n=[],s=[];let c=0;for(const p of l)for(const d of[0,1]){for(let y=0;y<=28;y++){const f=y/28*r,m=[p.x,p.y-4.9*f*f,p.z-i*f],g=[0,-9.8*f,-i];for(const S of[-1,1])e.push(m[0],m[1],m[2]),o.push(g[0],g[1],g[2]),n.push(S,f/r,d,p.seed)}for(let y=0;y<28;y++){const f=c+y*2;s.push(f,f+1,f+3,f,f+3,f+2)}c+=58}const a=new P.BufferGeometry;a.setAttribute("position",new P.Float32BufferAttribute(e,3)),a.setAttribute("aT",new P.Float32BufferAttribute(o,3)),a.setAttribute("aP",new P.Float32BufferAttribute(n,4)),a.setIndex(s);const h=new P.ShaderMaterial({uniforms:W(t),fog:!0,transparent:!0,depthWrite:!1,side:P.DoubleSide,vertexShader:`
      attribute vec3 aT; attribute vec4 aP; uniform vec3 uCam;
      varying vec3 vP; varying vec4 vQ;
      #include <fog_pars_vertex>
      void main(){
        vec3 tg = normalize(aT), toC = uCam - position;
        vec3 sd = cross(tg, toC); sd = sd / max(length(sd), 1e-4);
        float w = mix(0.38, 1.7, aP.y) * (aP.z < 0.5 ? 1. : 2.8);
        vP = position + sd*aP.x*w; vQ = aP;
        vec4 mvPosition = modelViewMatrix*vec4(vP, 1.);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vP; varying vec4 vQ;
      #include <fog_pars_fragment>
      ${Y}
      ${u0}
      void main(){
        float along = vQ.y*26., x = vQ.x;
        float st = vn(vec2(x*3.5 + vQ.w*9., along*0.6 - uTime*3.4))*0.55 + vn(vec2(x*9., along*1.5 - uTime*6.))*0.45;
        float core = smoothstep(1., 0.25, abs(x));
        float a = vQ.z < 0.5 ? core*smoothstep(0.3, 0.7, st + 0.3*(1.-vQ.y)*(1.-vQ.y))*0.92
                             : core*core*smoothstep(0.45, 0.9, st)*0.3*smoothstep(0.05, 0.4, vQ.y);
        float head = clamp((uU-0.50)/0.045, 0., 1.)*1.05;
        a *= smoothstep(head, head-0.05, vQ.y) * step(0.501, uU) * smoothstep(uPoolY-0.3, uPoolY+0.8, vP.y);
        if (a < 0.01) discard;
        gl_FragColor = vec4(vec3(0.92,0.95,0.97)*waterLight(vP)*1.1, a);
        #include <fog_fragment>
      }`}),v=new P.Mesh(a,h);return v.frustumCulled=!1,v.renderOrder=4,v}const o0=(t,l)=>-65.4+1.9*I0(7,27,Math.max(Math.abs(t),Math.abs(l-6)*.82));function X0(t){const l=new P.BufferGeometry,i=36,u=-36,r=C-.4,e=C+16;l.setAttribute("position",new P.Float32BufferAttribute([-i,0,u,i,0,u,i,0,r,-i,0,r,-8.3,0,r,8.3,0,r,8.3,0,e,-8.3,0,e],3)),l.setIndex([0,2,1,0,3,2,4,6,5,4,7,6]);const o=new P.ShaderMaterial({uniforms:W(t),fog:!0,side:P.DoubleSide,vertexShader:`
      uniform float uPoolY; varying vec3 vP;
      #include <fog_pars_vertex>
      void main(){
        vP = vec3(position.x, uPoolY, position.z);
        vec4 mvPosition = modelViewMatrix*vec4(vP, 1.);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uDry, uPool, uGarland, uPortalCol, uImp; uniform float uPortalI, uFest, uSeed, uLamp, uDiya, uCool;
      varying vec3 vP;
      #include <fog_pars_fragment>
      ${Y}
      float dishY(vec2 p){ return -65.4 + 1.9*smoothstep(7., 27., max(abs(p.x), abs(p.y-6.)*0.82)); }
      float hgt(vec2 p, float churn){
        float t = uTime;
        return (vn(p*0.45 + t*vec2(0.25,0.17))*0.6 + vn(p*1.6 - t*vec2(0.5,0.35))*0.3 + vn(p*4.3 + t*1.1)*0.1) * (0.1 + 0.9*churn);
      }
      float swell(vec2 p){ return vn(p*0.2 + uTime*vec2(0.1, 0.07))*0.7 + vn(p*0.62 - uTime*vec2(0.27, 0.2))*0.3; }
      // what the water mirrors, traced: a ray off the surface meets one of the three stair walls (stepping in 3 m a tier, so a plane at
      // 59 degrees), the pavilion's face, or leaves by the well's mouth. The wall is redrawn there by the stone shader's own rules: tier
      // ledges, the diamond net of flights, the niches and their lamps, the cascades above the front, the pavilion's bays and the portal
      vec3 mirrored(vec3 o, vec3 R){
        float hw0 = 26. + 0.6*(o.y + 65.);
        float dW = R.x + 0.6*R.y, dE = R.x - 0.6*R.y, dN = R.z + 0.6*R.y;
        float tW = dW < -1e-3 ? -(hw0 + o.x)/dW : 1e5;
        float tE = dE > 1e-3 ? (hw0 - o.x)/dE : 1e5;
        float tN = dN < -1e-3 ? -(hw0 + o.z)/dN : 1e5;
        float tS = R.z > 1e-3 ? (38. - o.z)/R.z : 1e5;
        float t = max(min(min(tW, tE), min(tN, tS)), 0.);
        vec3 h = o + R*t;
        float above = smoothstep(-0.8, 0.8, h.y);
        h.y = min(h.y, -0.05);
        float ao = mix(0.66, 1., smoothstep(-72., 4., h.y));
        float wetK = smoothstep(0.38, 0.47, uU);
        vec3 wfill = mix(uBounce, uFill, 0.8); wfill = mix(wfill, vec3(dot(wfill, vec3(0.333))), 0.45);
        vec3 col;
        if (tS <= t) {
          float ax = abs(h.x), sy = h.y + 65., stF = floor(sy/13.), gh = sy - stF*13.;
          vec3 alb = uDry*0.7*(0.85 + 0.3*vn(vec2(h.x*0.3, h.y*0.3))) * mix(1., 0.78, wetK);
          float litK = max(-uSunDir.z, 0.)*sunVis(h - vec3(0., 0., 0.4));
          float open = 0., lampP = 0.;
          if (ax < 26.6) {
            float bi = ax < 2.5 ? -2. : (ax < 7.5 ? -1. : floor((ax - 7.5)/4.625));
            float bc = ax < 2.5 ? 0. : (ax < 7.5 ? 5. : 7.5 + 4.625*(bi + 0.5));
            float q = (ax - bc)/(ax < 7.5 ? 2.5 : 2.3125);
            open = step(abs(q), 0.8)*step(1.5, gh)*step(gh, 7.2 + 2.6*sqrt(max(1. - q*q, 0.)));
            if (ax < 8.9 && stF < 1.5) open = 0.;
            float id = (bi + 3.)*(ax < 2.5 ? 1. : (h.x < 0. ? -1. : 1.));
            float k = mod(id*7. + stF*13. + id*stF*3. + 120., 5.);
            float lit = k < 0.5 ? 1. : ((k > 1.5 && k < 2.5) ? 0.45 : 0.);
            if (abs(abs(id) - 3.) < 0.5 && abs(stF - 1.) < 0.5) lit = 1.;
            lampP = lit*exp(-((ax - bc)*(ax - bc) + (gh - 2.6)*(gh - 2.6))/3.2);
            alb *= 1. - 0.45*smoothstep(10.1, 10.7, gh)*(1. - smoothstep(11.5, 12., gh));
          }
          float archTop = -47.2 + 6.2*sqrt(max(1. - ax*ax/56.25, 0.));
          float arch = step(ax, 7.5)*step(-58., h.y)*step(h.y, archTop);
          vec3 hemi = mix(uBounce, uFill, 0.65)*ao*(1. - 0.55*litK);
          vec3 albS = mix(alb, vec3(dot(alb, vec3(0.3, 0.5, 0.2))), 0.8*uCool*(1. - litK));
          col = alb*uSunCol*uSunI*litK + albS*hemi;
          col = mix(col, vec3(0.012, 0.01, 0.014), max(open, arch));
          col += uLamp*vec3(1.5, 0.62, 0.16)*open*lampP*0.7;
          vec2 pd = vec2(h.x, h.y + 48.);
          col += uPortalCol*uPortalI*arch*(exp(-dot(pd, pd)/26.)*1.5 + 0.1);
        } else {
          bool north = tN <= t, east = tE <= t;
          vec3 wn = north ? vec3(0., 0., 1.) : vec3(east ? -1. : 1., 0., 0.);
          float s = north ? h.x : h.z;
          float tierF = -h.y/5., tier = floor(tierF), yy = fract(tierF), hl = 5.*(1. - yy), odd = mod(tier, 2.);
          float along = (north ? h.x/14. + 0.5 : (38. - h.z)/14.) + odd*0.5 + 0.5;
          float d = (fract(along) - 0.5)*14., cell = floor(along);
          float pick = step(mod(cell + tier*2. + (north ? 0. : (east ? -1. : 2.)), 3.), 0.5);
          float edgeH = abs(d)*0.7143;                                   // a flight pair below this height, the wall and its niche above
          float fl = smoothstep(-0.15, 0.15, edgeH - hl);
          float line = smoothstep(0.5, 0., abs(edgeH - hl)) + 0.7*smoothstep(0.35, 0., hl) + 0.5*smoothstep(4.6, 5., hl);
          float inside = step(abs(d), 0.95)*step(1.7, hl)*step(hl, 3.4 + sqrt(max(0.9 - d*d, 0.))*1.05)*pick;
          vec3 alb = uDry*(0.6 + 0.2*fl)*(0.85 + 0.3*vn(vec2(s*0.3, h.y*0.3)));
          alb *= (1. + 0.4*line) * mix(1., 0.75, wetK);
          alb = mix(alb, vec3(0.02, 0.016, 0.02), inside);
          float vis = sunVis(h + wn*0.4), litK = max(dot(wn, uSunDir), 0.)*vis;
          vec3 hemi = mix(uBounce, uFill, 0.65)*ao*(1. - 0.55*litK);
          vec3 albS = mix(alb, vec3(dot(alb, vec3(0.3, 0.5, 0.2))), 0.8*uCool*(1. - litK));
          col = alb*uSunCol*uSunI*litK + albS*hemi;
          float lampG = pick*exp(-(d*d*0.55 + (hl - 2.3)*(hl - 2.3))/3.4);
          col += uLamp*(alb*vec3(1.5, 0.66, 0.2)*lampG*1.1 + vec3(2.6, 1.15, 0.3)*1.7*pick*exp(-(d*d/0.55 + (hl - 2.2)*(hl - 2.2)/3.2)));   // (the flame is drawn out upright, as ripples draw a light toward the eye)
          float fy = frontY();
          float run = smoothstep(-0.3, 0.3, h.y - fy);
          float st = vn(vec2(s*0.5, h.y*0.15 + uTime*1.2));
          float wv = mix(0.08 + 0.34*smoothstep(0.45, 0.8, st), 0.5 + 0.3*st, fl)*run + 0.4*run*smoothstep(0.8, 0., abs(h.y - fy));
          vec3 wlight = uSunCol*uSunI*vis*0.5 + wfill*ao;
          vec3 wtint = mix(vec3(0.88, 0.92, 1.0), mix(vec3(1.0, 0.9, 0.7), uSunCol, 0.5), vis);
          col = mix(col, wtint*wlight*0.92, clamp(wv, 0., 1.));
        }
        return mix(col, skyRefl(R), above);
      }
      void main(){
        vec2 p = vP.xz; float t = uTime;
        float depth = uPoolY - dishY(p);
        float churn = smoothstep(0.46, 0.64, uU), rainAmt = smoothstep(0.36, 0.5, uU);
        float e = 0.35, h0 = hgt(p, churn);
        vec3 N = normalize(vec3(-(hgt(p+vec2(e,0.), churn)-h0)/e*1.1, 1., -(hgt(p+vec2(0.,e), churn)-h0)/e*1.1));
        // rain rings
        vec2 rc = p/2.1; vec2 ri = floor(rc); vec2 rf = fract(rc) - 0.5 - (vec2(h21(ri), h21(ri+5.))-0.5)*0.45;
        float rph = fract(t*(0.7 + 0.5*h21(ri+9.)) + h21(ri+2.)), rd = length(rf);
        float ring = smoothstep(0.075, 0., abs(rd - rph*0.46)) * (1.-rph) * rainAmt * step(0.45, h21(ri+floor(t*0.35+h21(ri))*1.3));
        N.xz += ring * rf / max(rd, 1e-3) * 0.55; N = normalize(N);
        vec3 Vv = uCam - vP; vec3 V = Vv / max(length(Vv), 1e-4);
        if (V.y < 0.) V.y = -V.y;
        vec3 R = reflect(-V, N); R.y = abs(R.y);
        float nv = clamp(dot(N, V), 0., 1.), f = 1.-nv, f2 = f*f, fres = 0.03 + 0.97*f2*f2*f;

        // body: still green -> churned jade, shallows show the floor, silt fans creep in from the wall feet
        float turb = vn(p*0.3 + t*0.11 + uSeed);
        vec3 body = mix(uPool*0.75, mix(uPool, vec3(0.2,0.44,0.36), 0.5)*0.82, churn*(0.35 + 0.65*turb));   // churned jade, deep enough to mirror what stands over it
        float hwP = uPoolY < -60. ? 29. : 32.;
        float dE = min(hwP - abs(p.x), p.y + hwP);
        float silt = smoothstep(11., 0., dE + (vn(p*0.33 - t*0.04)-0.5)*12.) * churn;
        float calm = 1. - smoothstep(0.42, 0.6, uU);                       // the still green coin before the rain churns it
        body *= 1. + 0.7*calm;
        silt = max(silt, smoothstep(0.9, 0.1, depth)*0.7*(1. - 0.8*calm));  // (the shallows stay dark wet amber until the cascades bring silt)
        body = mix(body, uDry*vec3(0.6,0.55,0.5), silt*0.8);
        body = mix(uDry*(0.32 + 0.06*calm), body, smoothstep(-0.05, 0.6, depth));
        // duckweed mat, torn apart as the rain hits
        float tear = smoothstep(0.38, 0.66, uU);
        float dwn = vn(p*0.21 + 3. + uSeed)*0.62 + vn(p*0.95 + uSeed)*0.38;
        float dw = smoothstep(0.36 + tear*0.5, 0.52 + tear*0.5, dwn + (vn(p*4.5 + t*0.15*tear)-0.5)*(0.1 + 0.5*tear));
        dw *= smoothstep(0.15, 0.5, depth);
        // foam: wall feet, under the plumes
        float imp = min(length(p - uImp.xy), length(p - vec2(-uImp.x, uImp.y)));
        float plOn = smoothstep(0.54, 0.6, uU);
        float foam = smoothstep(3.5, 0., dE) * churn * smoothstep(0.35, 0.75, vn(p*1.4 + t*vec2(0.5,0.3)));
        foam += smoothstep(7.5, 0.5, imp) * plOn * (0.55 + 0.45*sin(imp*2.6 - t*5.)) * smoothstep(0.25, 0.7, vn(p*1.1 - t*0.8) + 0.3);
        foam = clamp(foam, 0., 1.);

        vec3 wp = vec3(p.x, uPoolY, p.y);
        float vis = sunVis(wp), ao = mix(0.55, 1., smoothstep(-72., 4., uPoolY));
        vec3 Ld = uSunCol*uSunI*vis*max(dot(N, uSunDir), 0.) + uFill*ao*1.15;
        vec3 Lp = mix(Ld, vec3(dot(Ld, vec3(0.3, 0.5, 0.2))), 0.55*calm);   // still water keeps its own green under the blue skylight
        vec3 col = mix(body, mix(vec3(0.13,0.25,0.07), vec3(0.14,0.30,0.10), calm), dw) * Lp;
        col += skyRefl(vec3(R.x, abs(R.y), R.z)) * 0.12 * calm * (1. - dw) * smoothstep(0.1, 0.6, depth);
        // what the surface mirrors: the walls themselves, traced (their tiers, flights, lamps and cascades), the pavilion and the portal in
        // its arch, the sky by the well's mouth. The ripples are flattened for the mirror ray, so the picture wavers and does not shatter
        float cas = smoothstep(0.47, 0.83, uU);
        float mk = 0.075*(0.3 + 0.7*churn), me = 0.8, m0 = swell(p);
        vec3 Nr = normalize(vec3(-(swell(p + vec2(me, 0.)) - m0)/me*mk, 1., -(swell(p + vec2(0., me)) - m0)/me*mk));   // the long swell only: the chop and the rain rings would shatter the picture
        vec3 Rr = reflect(-V, Nr); Rr.y = max(abs(Rr.y), 0.02);
        vec3 refl = mirrored(vP, normalize(Rr));
        float mir = mix(0.42, 0.04, calm);
        col = mix(col, refl, (mir + (1. - mir)*f2*f)*(1. - dw*0.85)*(1. - silt*0.45));
        float rl = max(dot(R, uSunDir), 0.); float sp = rl*rl; sp *= sp; sp *= sp; sp *= sp; sp *= sp;
        col += uSunCol*uSunI*sp*sp*vis*3.;
        col += ring * skyRefl(R) * 0.35;
        col = mix(col, vec3(0.85,0.9,0.86)*(uSunCol*uSunI*vis*0.5 + uFill*ao*1.3), foam*0.8);
        // the portal's light lying on the water from the arch, wavering
        float sx = p.x + (vn(vec2(p.y*0.25, t*0.5))-0.5)*3.0 + N.x*6.;
        float w = 3.2 + (38.-p.y)*0.07;
        float streak = exp(-sx*sx/(w*w)) * smoothstep(-40., 28., p.y) * (0.55 + 0.45*vn(vec2(p.y*1.1 - t*1.4, 2.)));
        col += uPortalCol*uPortalI*streak*(1.-dw*0.6)*0.6*(1. - 0.45*calm);
        // marigold garlands and leaf cups circling in the eddy at the arch
        vec2 q = p - uImp.z*vec2(0., 1.); float r = length(q);
        float ang = atan(q.y, q.x + 1e-4) + t*0.45/(0.5 + r*0.22);
        vec2 gc = vec2(r/1.5, ang/6.2832*6.); vec2 gi = floor(gc); vec2 gf = (fract(gc)-0.5)*vec2(1.5, max(r, 0.5)*6.2832/6.);
        float pick = step(0.45, h21(gi + uSeed)) * step(1., gi.x) * step(gi.x, 5.) * uFest;
        float gd = length(gf);
        float gar = smoothstep(0.13, 0.04, abs(gd - 0.38)) * pick;
        col = mix(col, uGarland*(Ld*0.9 + 0.15), gar*smoothstep(0.2, 0.6, depth));
        // leaf-cup lamps set afloat, and marigold heads with them: a loose raft on the still coin that the rain scatters; some go out
        vec2 dp = p - vec2(0., 6.) - vec2(sin(t*0.11), cos(t*0.09))*0.8*(1. + 2.*churn);
        dp = vec2(dp.x*0.825 - dp.y*0.565, dp.x*0.565 + dp.y*0.825);        // (the scatter's grain lies askew to the pool's edges)
        float spreadK = 1. + 0.55*churn, cellD = 2.0*spreadK;
        vec2 dc = dp/cellD; vec2 di = floor(dc);
        float dh = h21(di + uSeed + 17.), dh2 = h21(di + 31.7);
        vec2 dj = (vec2(h21(di + 3.3), h21(di + 9.1)) - 0.5)*0.4 + 0.04*vec2(sin(t*0.7 + dh*40.), cos(t*0.6 + dh2*40.));
        vec2 df = (fract(dc) - 0.5 - dj)*cellD; float dd = length(df);
        float inRaft = 1. - smoothstep(8., 14., length(di)*2.0 + dh2*4.);
        float clump = 0.14 + 0.5*vn(di*0.45 + uSeed);                           // they drift in knots, with open water between
        float isLamp = step(dh, clump*(0.6 + 0.4*uDiya)) * inRaft * step(dh2*0.9, 1.05 - 0.5*cas);     // (cas: some are swamped as the cascades arrive)
        float isBloom = step(0.62, dh) * inRaft * (0.4 + 0.6*uFest);
        float deep = smoothstep(0.1, 0.45, depth);
        float cup = (1. - smoothstep(0.17, 0.25, dd)) * isLamp * deep;
        col = mix(col, vec3(0.05, 0.075, 0.03)*(Ld + 0.1), cup);
        float petal = (1. - smoothstep(0.26, 0.36, dd + 0.07*sin(atan(df.y, df.x + 1e-4)*7. + dh*30.))) * isBloom * deep;
        col = mix(col, uGarland*(Ld*0.95 + 0.2), petal);
        float flk = 0.8 + 0.2*sin(t*9. + dh*50.)*sin(t*13.7 + dh2*50.);
        vec3 flame = vec3(3.2, 1.4, 0.34) * flk * isLamp * deep * (0.6 + 0.4*uLamp);
        col += flame * ((1. - smoothstep(0.04, 0.11, dd))*2.2 + exp(-dd*dd/0.13)*0.7*(1. - smoothstep(0.4, 0.6, dd)));
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),n=new P.Mesh(l,o);return n.frustumCulled=!1,n}async function Z0(t,l={}){const i=t.rng,u=(l.palette&&l.palette.length>=7?l.palette:F0).map(w=>new P.Color(w)),r=new P.Color(1,1,1),e=i.range(-1,1),o=u[0].clone().lerp(new P.Color(e>0?"#E09A62":"#D8B26A"),Math.abs(e)*.35),n=l.festival??i.chance(.65),s={festival:n,bangla:i.chance(.4),kiosks:i.pick([5,7,7,9]),gapZ:4,spoutX:12.5,spoutY:-24.5,apron:l.apron??100,garland:u[4].clone().lerp(new P.Color("#FF7A10"),.55).toArray(),garland2:i.chance(.5)?[.75,.06,.05]:u[4].clone().toArray(),flag:i.pick([[.9,.3,.03],[.75,.05,.06],[.95,.55,.05]]),earth:u[0].clone().lerp(u[1],.45).multiplyScalar(.8).toArray()};{let w=7;for(const A of String(t.seed??1))w=Math.imul(w,31)+A.charCodeAt(0)>>>0;s.xr=U0(w),s.lamps=[]}const c=l.damage??i.range(.015,.05),a=new P.Vector3(...l.sunDir||[-.882,.407,-.236]).normalize(),h=new P.Color(l.sunColor||"#FFD08A").lerp(r,.22),v=(l.fillColor?new P.Color(l.fillColor):u[3].clone()).lerp(r,.18).multiplyScalar(2.2),p=C-3.5-4.8*Math.sqrt((s.spoutY+60)/4.9),d={uU:{value:l.progress??.72},uTime:{value:0},uPoolY:{value:-60},uSunI:{value:l.sunIntensity??1.75},uSunDir:{value:a},uSunCol:{value:h},uFill:{value:v},uBounce:{value:o.clone().multiplyScalar(.18).add(new P.Color(.05,.05,.07))},uSkyE:{value:u[2].clone().lerp(u[3],.25).multiplyScalar(2.6)},uSkyW:{value:u[6].clone().multiplyScalar(.85)},uCam:{value:new P.Vector3(0,-20,0)},uShaft:{value:new P.Vector4(0,0,40,0)},uCloud:{value:new P.Vector4(40,14,0,0)},uDry:{value:o},uWet:{value:u[1].clone().lerp(new P.Color("#a07840"),.4)},uGarland:{value:new P.Color().fromArray(s.garland)},uPool:{value:u[5].clone().offsetHSL(i.range(-.03,.03),0,0)},uPortalCol:{value:u[6].clone().lerp(r,.3)},uPortalI:{value:l.portalGlow??1},uMoss:{value:l.moss??0},uLamp:{value:0},uCool:{value:l.cool??1},uImp:{value:new P.Vector3(s.spoutX,p,C-8)},uFest:{value:n?1:0},uSeed:{value:i.range(0,50)},uDiya:{value:n?1:.45}},y=new P.Group;y.name="first-rain-stepwell-hero";const f=new P.ShaderMaterial({uniforms:W(d),vertexShader:N0,fragmentShader:B0,fog:!0,side:P.DoubleSide}),m=i0(),g=()=>t.yield?.(),{inst:S,rubble:q}=D0(m,i,c);await g(),await Q0(m,i,s,g),await g(),await j0(m,i,s,g),await t.yield?.();const x=new P.Mesh(m.geometry(),f);x.frustumCulled=!1,y.add(x),await t.yield?.();const M=E0(V0(i),S,f);y.add(M),await t.yield?.();const z=[],I=[],F=new P.Vector3,j=[0,-Math.PI/2,Math.PI/2];for(let w=0;w<K;w++)for(let A=0;A<3;A++){const R=c0(w,A),$=new Set;for(const d0 of R)for(const Z of[d0-D/2,d0+D/2]){const p0=Math.round(Z*10);if($.has(p0))continue;$.add(p0);const q0=_0.some(l0=>l0[0]===w&&l0[1]===A&&Math.abs(l0[2]-Z)<.5);G(w,A,Z,0,-N*w-.3,F);const z0={x:F.x,y:F.y,z:F.z,rot:j[A],w:12.6,h:N-.3,kind:0,seed:i()};G(w,A,Z,1.5,-N*(w+1)+.6,F);const T0={x:F.x,y:F.y,z:F.z,size:i.range(3.2,5.6),seed:i(),kind:0},y0=i()<.4?{x:F.x,y:F.y+.5,z:F.z,size:i.range(2.5,4),seed:i(),kind:0}:null;q0||(z.push(z0),I.push(T0),y0&&I.push(y0))}}for(const w of q)G(w.k,w.wall,w.c,0,-N*w.k-.3,F),z.push({x:F.x,y:F.y,z:F.z,rot:j[w.wall],w:13.5,h:N-.3,kind:0,seed:i()});for(let w=0;w<5;w++){const A=-V+13*w+10.6;if(w<2)for(const R of[1,-1])z.push({x:R*17.75,y:A,z:C-1.75,rot:Math.PI,w:17.7,h:7,kind:1,seed:i()});else z.push({x:0,y:A,z:C-1.75,rot:Math.PI,w:53.8,h:7,kind:1,seed:i()})}const E=[1,-1].map(w=>({x:w*s.spoutX,y:s.spoutY-.15,z:C-3.5,seed:i()}));for(const w of E)for(let A=0;A<8;A++)I.push({x:w.x+i.range(-3,3),y:-V,z:p+i.range(-3.5,3),size:i.range(5,9.5),seed:i(),kind:1});await t.yield?.(),y.add(X0(d),K0(d,z),O0(d,E,4.8),W0(d,I));const X=l.poolStart??-64.2,h0=w=>B(X,-55.5,n0((w-.47)/.5,0,1)),k0=w=>n0(-((w-.44)/.03)*5,-V,0);let a0=d.uU.value;const _=(w,A,R)=>new P.Vector3(w,A,R),v0=new P.Vector3,C0={portalSeat:{position:_(0,-48,46),facing:_(0,0,-1),radius:7},flyThrough:[[-94,11,19],[-63,12,4],[-30,8,-22],[4,3,-42],[36,-3,-43],[50,-8,-22],[48,-12,4],[40,-16,22],[18,-20,28],[-10,-24,28],[-29,-28,17],[-34,-32,-2],[-33,-35,-18],[-27,-38,-29],[-16,-41,-31],[-5,-45,-28],[0,-47.6,-16],[0,-48,4],[0,-48,24],[0,-48,46]].map(w=>_(...w)),gap:{position:_(-L,0,s.gapZ),width:18,facing:_(1,0,0)},arch:{center:_(0,-49.5,C),width:15,sill:-58,crown:-41},spouts:E.map(w=>_(w.x,w.y,w.z)),plumeImpacts:E.map(w=>_(w.x,-60,p)),poolCenter:_(0,-64.2,6),eddy:_(0,-60,C-8),lamps:s.lamps.map(w=>_(w[0],w[1],w[2])),tower:_(59,8,-59),viewpoints:{tip:{position:_(-63,12,4),target:_(8,-50,0)},eastWall:{position:_(49,-12,4),target:_(10,-40,36)},pavilionPass:{position:_(4,-22,28),target:_(-14,-24,38)},image:{position:_(-31,-36,-22),target:_(6,-44,-40)},finalRun:{position:_(0,-48,4),target:_(0,-48,46)}},ledges:(w,A)=>c0(w,A).map(R=>G(w,A,R+D/2,2.5,-N*(w+1))),walls:{rim:L,stepIn:s0,tierHeight:N,tiers:K,pavilionZ:C,flightDepth:x0}},A0=m.count()+S.length*204+z.length*12+I.length*2+224+4,m0={object:y,radius:9,height:40,center:_(0,-36,2),anchors:C0,extent:{half:Math.max(s.apron,L+8),rim:L,depth:V,top:13},ground:!1,groundY:0,triangles:A0,setProgress(w){a0=n0(w,0,1)},poolLevel:h0,frontY:k0,setSun(w,A,R){w&&d.uSunDir.value.copy(w).normalize(),A&&d.uSunCol.value.set(A),R!==void 0&&(d.uSunI.value=R)},setSky(w,A,R){w&&d.uSkyE.value.set(w),A&&d.uSkyW.value.set(A),R&&d.uFill.value.set(R)},setLamps(w){d.uLamp.value=w},setShaft(w,A,R,$){d.uShaft.value.set(w,A,R,$)},setCloud(w,A,R=14){d.uCloud.value.set(w,R,0,A)},setPortalGlow(w,A){w&&d.uPortalCol.value.set(w),A!==void 0&&(d.uPortalI.value=A)},uniforms:d,update(w,A,R){d.uTime.value=A,d.uU.value=a0,d.uPoolY.value=h0(a0),R&&(y.updateWorldMatrix(!0,!1),R.getWorldPosition(v0),d.uCam.value.copy(y.worldToLocal(v0)))},dispose(){}};return m0.update(0,0,null),m0}export{Z0 as buildHero};
