import*as t from"three";import{mergeGeometries as he}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as Oe,lerp as E,smoothstep as we}from"../kit/core.js";const J=Math.PI*2,ct=["#F3E9E2","#E8B7C4","#9FD8C6","#FFE6A3","#3F8F6A","#5B4A78","#0A0C1E"],se=60,W=[210,1010,2210],be=[45,95,210],ee=[90,180,260],Ve=[338,676,1e3],ue=25,re=3710,ye=620,He=(s,u)=>W[s]-ee[s]*Math.min(1,(u/Ve[s])**2);function ht(s,u){const c=[];for(let x=0;x<=u;x++){const w=x/u;let F,d;if(s===0){const y=E(.02,1,w)*Math.PI*.5;if(w<.6){const h=E(.03,1,w/.6)*Math.PI*.5;F=20-440*Math.cos(h),d=225*Math.pow(Math.sin(h),.5)}else{const h=(w-.6)/.4;F=E(20,190,h),d=225-59*h*Math.sqrt(h)}}else if(s===1){const y=w*(985-(W[0]-ee[0]))/(968-(W[0]-ee[0]));F=E(W[0]-ee[0],968,y),d=360*(.94+.06*Math.sin(Math.PI*Math.min(1,y*1.15)))}else if(s===2){const y=w*(2115-(W[1]-ee[1]))/(2142-(W[1]-ee[1]));F=E(W[1]-ee[1],2142,y),d=720*(.94+.06*Math.sin(Math.PI*Math.min(1,y*1.15)))}else if(w<.5){const y=w*2;F=E(W[2]-ee[2],2900,y),d=E(1e3,1450,Math.sin(y*Math.PI*.5))}else{const y=(w-.5)*2,h=y*Math.PI*.5;F=2900+(re-2900)*Math.sin(h),d=ye+(1450-ye)*Math.pow(Math.cos(h),.85)}c.push([F,d])}return c}function Se(s,u,c=!0){const x=s.length,w=new Float32Array(x*(u+1)*3),F=new Float32Array(x*(u+1)*3),d=new Float32Array(x*(u+1)*2);let y=0,h=0;const p=new(x*(u+1)>65535?Uint32Array:Uint16Array)((x-1)*u*6),R=new Float64Array(u+1),o=new Float64Array(u+1);for(let m=0;m<=u;m++){const z=m/u*J;R[m]=Math.sin(z),o[m]=-Math.cos(z)}for(let m=0;m<x;m++){const[z,f]=s[m];m>0&&(y+=Math.hypot(z-s[m-1][0],f-s[m-1][1]));const V=s[Math.max(0,m-1)],M=s[Math.min(x-1,m+1)];let i=M[0]-V[0],T=M[1]-V[1];const l=Math.hypot(i,T)||1;i/=l,T/=l;const g=c?T:-T,b=c?-i:i;for(let L=0;L<=u;L++){const B=R[L],$=o[L],Z=m*(u+1)+L;w[Z*3]=f*B,w[Z*3+1]=f*$,w[Z*3+2]=z,F[Z*3]=b*B,F[Z*3+1]=b*$,F[Z*3+2]=g,d[Z*2]=L/u,d[Z*2+1]=y}}for(let m=0;m<x-1;m++)for(let z=0;z<u;z++){const f=m*(u+1)+z,V=f+1,M=f+u+1,i=M+1;c?(p[h++]=f,p[h++]=M,p[h++]=V,p[h++]=V,p[h++]=M,p[h++]=i):(p[h++]=f,p[h++]=V,p[h++]=M,p[h++]=V,p[h++]=i,p[h++]=M)}const P=new t.BufferGeometry;return P.setAttribute("position",new t.BufferAttribute(w,3)),P.setAttribute("normal",new t.BufferAttribute(F,3)),P.setAttribute("uv",new t.BufferAttribute(d,2)),P.setIndex(new t.BufferAttribute(p,1)),P.userData.length=y,P}async function ut(s,u){const x=new Uint8Array(262144),w=[];for(let o=0;o<4;o++){const P=[];for(const m of[8,16,32,64]){const z=new Float32Array(m*m);for(let f=0;f<z.length;f++)z[f]=u();P.push([m,z])}w.push(P),await s.yield()}const F=[.5,.27,.15,.08],d=[8,16,32,64],y=[],h=[],p=[];for(const o of d){const P=new Int32Array(256),m=new Int32Array(256),z=new Float64Array(256);for(let f=0;f<256;f++){const V=f/256*o,M=Math.floor(V);let i=V-M;i=i*i*(3-2*i),P[f]=M,m[f]=(M+1)%o,z[f]=i}y.push(P),h.push(m),p.push(z)}for(let o=0;o<256;o++){o%6===0&&await s.yield();for(let P=0;P<256;P++)for(let m=0;m<4;m++){let z=0;for(let f=0;f<4;f++){const V=d[f],M=w[m][f][1],i=y[f][P],T=h[f][P],l=p[f][P],g=y[f][o]*V,b=h[f][o]*V;z+=F[f]*E(E(M[g+i],M[g+T],l),E(M[b+i],M[b+T],l),p[f][o])}x[(o*256+P)*4+m]=Oe(Math.round((.5+(z-.5)*1.7)*255),0,255)}}const R=new t.DataTexture(x,256,256,t.RGBAFormat,t.UnsignedByteType);return R.wrapS=R.wrapT=t.RepeatWrapping,R.magFilter=t.LinearFilter,R.minFilter=t.LinearMipmapLinearFilter,R.generateMipmaps=!0,R.needsUpdate=!0,R}const me=`
varying vec2 vUv; varying vec3 vP; varying vec3 vN;
#include <fog_pars_vertex>
void main(){
  vUv = uv; vP = position; vN = normal;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Pe=`
uniform vec3 uCam; uniform float uExpo, uTime, uHazeLen; uniform sampler2D uNoise;
uniform vec3 uPearl, uRose, uSea, uGold, uForest, uViolet, uHaze;
uniform vec4 uHb, uTw; uniform mat3 uHbM;      // the harbour of the last room: centre of its water (w: the angle of its spire); the spire's foot and tip in the harbour's frame; the harbour's axes (its up points at the axis of the shell)
varying vec2 vUv; varying vec3 vP; varying vec3 vN;
#include <fog_pars_fragment>
float doorVis(vec3 p, float zd, float rd){
  float k = max(p.z - zd, 0.) / zd, rho = length(p.xy);
  return 1. - smoothstep(rd + (rd - 60.) * k - 2., rd + (rd + 60.) * k + 2., rho);
}
// how much of the sun a point in chamber ch (0..3) sees
float sunVis(vec3 p, float ch){
  float v = 1.;
  if (ch > 0.5) v *= doorVis(p, 210., 45.);
  if (ch > 1.5) v *= doorVis(p, 1010., 95.);
  if (ch > 2.5) v *= doorVis(p, 2210., 210.);
  return v;
}
// The first room, one rule for every nacre: beside the sun the light itself carries the pearl toward white-gold. The
// share is set by nearness to the sun and by how squarely the surface faces it, the same on ivory, honey and black
// nacre; what lies in a groove or turns from the sun keeps the nacre's own colour, as does all from door 1 outward.
const vec3 WHITE_GOLD = vec3(.80, .73, .56);
float sunShare(vec3 p, vec3 n){
  return .82 * (1. - smoothstep(240., 400., length(p))) * clamp(dot(n, normalize(-p + vec3(0., 0., 1e-3))) * 1.25 + .15, 0., 1.);
}
vec3 keyColor(float ch){
  vec3 c = vec3(1., .79, .36) * 1.0;                                  // #FFE6A3
  c = mix(c, vec3(1., .87, .60) * .7, clamp(ch - 1., 0., 1.));        // #FFF0CC
  c = mix(c, vec3(.85, .89, 1.) * .45, clamp(ch - 2., 0., 1.));       // #EEF2FF
  return c;
}
// centre of the door on the sunward side of chamber ch
vec3 innerDoor(float ch){ return vec3(0., 0., ch < 0.5 ? 0. : ch < 1.5 ? 210. : ch < 2.5 ? 1010. : 2210.); }
vec3 shellLight(vec3 p, vec3 n, float ch, float relief, float shadow){
  vec3 toSun = normalize(-p + vec3(0., 0., 1e-3));
  vec3 toDoor = normalize(innerDoor(ch) - p + vec3(0., 0., 1e-3));
  float ndl = clamp(dot(n, toSun) * 2.2 + .25, 0., 1.);
  float key = sunVis(p, ch) * (.4 + .6 * ndl) * relief * shadow;
  if (ch < .5) key *= clamp(pow(150. / max(length(p), 40.), 1.6), .6, 1.8);
  float wrap = clamp(dot(n, toDoor) * .5 + .5, 0., 1.);
  vec3 l = keyColor(ch) * key * 1.1;
  if (ch < .5) l += vec3(1., .88, .64) * .42;                         // the sun's own room: its lit walls light each other, so nothing in it stands dark
  vec3 toAxis = normalize(vec3(-p.xy, length(p.xy) * .7 + 1.));
  float ax = clamp(dot(n, toAxis) * .5 + .5, 0., 1.);
  if (ch > .5 && ch < 2.5) {
    // the lit dome at the far end of the room is a lamp: a pool of warm full light on the land within about a dome
    // radius of its rim, and the rest of the room a step darker and bluer
    float zr = ch < 1.5 ? 965. : 2090., rr = ch < 1.5 ? 300. : 560.;
    float lampD = exp(-max(zr - p.z, 0.) / rr);
    vec3 toDome = normalize(vec3(0., 0., zr + 60.) - p + vec3(0., 1e-3, 0.));                 // |p.xy| is never under 100 on a wall; in the air p.z differs
    float nd = clamp(dot(n, toDome) * .75 + .5, 0., 1.);
    l += vec3(1., .80, .50) * lampD * nd * .78 * relief * (.6 + .4 * shadow);
    l += mix(uPearl, uGold, .35) * .24 * wrap * relief;                 // the inner dome as an area light
    l += vec3(.86, .92, 1.) * .22 * (.6 + .4 * shadow) * (.35 + .9 * ax * ax);   // cloud-river scatter
    l += mix(uViolet, vec3(.74, .82, 1.), .5) * .15;                    // floor
    return l;
  }
  l += mix(uPearl, uGold, .35) * .35 * wrap * relief;     // the inner dome as an area light
  l += vec3(.93, .95, 1.) * .25 * (.75 + .25 * shadow) * (.35 + .9 * ax * ax);   // cloud-river scatter
  l += mix(uViolet, vec3(.8, .85, 1.), .45) * .18;                    // floor
  return l;
}
vec3 hazed(vec3 c, vec3 p){
  float d = length(p - uCam);
  float far4 = smoothstep(2150., 2500., p.z);                        // the last room is the widest: its far land goes almost pure blue,
  float g = d / (uHazeLen * .56);                                    // pale and not dim, while what is near (the harbour) keeps its colours
  float f = 1. - exp(-mix(d / (uHazeLen * 1.9), g * g * g / (.6 + g * g), far4));
  return mix(c, uHaze * mix(vec3(.56, .66, .80), vec3(.80, .90, 1.0), far4), f * .92);
}
// two-hue pearl sheen, 12 percent at most
vec3 sheen(float ndv, float phase, float nz){
  float t = sin(7. * ndv + 4. * phase + 2. * nz + uTime * .35);
  float e = 1. - ndv;
  return mix(uRose, uSea, .5 + .5 * t) * .12 * e * e;
}
`,mt=Pe+`
uniform float uCh, uCirc, uN1, uSeason;
vec2 hash2(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
float tileOf(float approx){ return uCirc / floor(uCirc / approx + .5); }
void main(){
  vec2 L = vec2(vUv.x * uCirc, vUv.y);                    // metres round the wall, metres along it
  float fw = max(max(fwidth(L.x), fwidth(L.y)), 1e-3);    // metres per pixel
  float T = uCirc / uN1;
  vec2 q = vec2(vUv.x * uN1, L.y / T);
  vec2 q3 = q * 3. + vec2(.37, .11);
  float h = .68 * texture2D(uNoise, q).r + .32 * texture2D(uNoise, q3).g;
  float hs = .68 * texture2D(uNoise, q + vec2(0., 14. / T)).r + .32 * texture2D(uNoise, q3 + vec2(0., 42. / T)).g;
  float micro = texture2D(uNoise, L / tileOf(90.)).b;
  // the lake of chamber 2 and its terraces (fixed, so the real lake can sit on the painted one)
  float phis = (vUv.x > .5 ? vUv.x - 1. : vUv.x) * 6.2831853;
  float isC2 = 1. - step(.5, abs(uCh - 1.));
  vec2 lb = abs(vec2(phis * 345. - 69., vP.z - 650.)) - vec2(160., 130.) + 60.;
  float lakeD = length(max(lb, 0.)) + min(max(lb.x, lb.y), 0.) - 60. + (texture2D(uNoise, q * 4.).a - .5) * 46.;
  float lake = isC2 * (1. - smoothstep(-4., 4., lakeD));
  h = mix(h, .2, isC2 * (1. - smoothstep(0., 60., lakeD)));
  hs = mix(hs, h, isC2 * (1. - smoothstep(0., 60., lakeD)));
  float slope = (hs - h) * 30.;
  // ---- fields: Voronoi cells with hedgerows and furrows
  float cnt = floor(uCirc / 96. + .5), cs = uCirc / cnt;
  vec2 g = L / cs, gi = floor(g), gf = g - gi;
  float d1 = 9., d2 = 9.; vec2 cid = vec2(0.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j)), id = gi + o; id.x = mod(id.x, cnt);
    vec2 r = o + .14 + .72 * hash2(id) - gf; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; cid = id; } else if (d < d2) { d2 = d; }
  }
  float edge = (sqrt(max(d2, 1e-8)) - sqrt(max(d1, 1e-8))) * cs;                 // metres from the nearest hedge
  vec2 hc = hash2(cid + 7.3);
  vec3 cGreen = mix(uForest, uGold, .40) * vec3(.52, .86, .36);
  vec3 cDeep = mix(uForest, uGold, .16) * vec3(.80, .92, .62);
  vec3 cMust = uGold * vec3(.70, .57, .22), cStraw = mix(uGold, uSea, .35) * vec3(.62, .66, .40), cRose = uRose * vec3(.78, .58, .60);
  vec3 cB = mix(cMust, cRose, uSeason), cC = mix(cRose, vec3(.80, .78, .76), uSeason);
  vec3 field = hc.x < .34 ? cGreen : hc.x < .56 ? cDeep : hc.x < .72 ? cB : hc.x < .80 ? cC : cStraw;
  field *= .78 + .36 * hc.y;
  float fa = hc.y * 3.1416; vec2 fdir = vec2(cos(fa), sin(fa));
  float furrow = sin(dot(L, fdir) * 1.5708) * (1. - smoothstep(.7, 2.2, fw));
  // wind over the crops: bright bands sweeping down-shell
  float gust = smoothstep(.42, .8, texture2D(uNoise, vec2(vUv.x * uN1 * 2. + .2, (L.y - uTime * 26.) / (T * .09))).r);
  gust *= .75 + .25 * sin(L.y * .11 + L.x * .05 - uTime * 3.);
  field *= 1. + .13 * furrow + .10 * (micro - .5) + .26 * gust;
  float hw = max(2.2, fw * 1.3);
  float hedge = (1. - smoothstep(hw * .5, hw, edge)) * (1. - .6 * smoothstep(20., 60., fw));
  vec3 col = mix(field, uForest * .5, hedge * .85);
  // ---- terraces: contour bands on the high ground, and the fixed flight above the lake
  float tfn = (texture2D(uNoise, q * 4. + .31).a - .5) * 44.;                           // the terraces meet the lake along an uneven shore
  float terFix = isC2 * (1. - smoothstep(0., 26., abs(phis * 345. - 301.) - 72. + tfn)) * (1. - smoothstep(0., 30., abs(vP.z - 650.) - 135. + tfn));
  float tb = mix(h * 60., phis * 345. / 10.5, terFix);
  float ter = max(smoothstep(.70, .712, h) * (1. - smoothstep(.79, .80, h)), terFix);
  float tf = fract(tb), ti = floor(tb);
  vec2 th = hash2(vec2(ti, floor(L.y / 70.)));
  vec3 tcol = th.x < .6 ? mix(cGreen, uSea * .6, .3) * 1.1 : th.x < .9 ? mix(cMust, cGreen, .55) : mix(cRose, cGreen, .3);
  float twid = max(fwidth(tb), 1e-4);
  float lip = (1. - smoothstep(.0, .12 + twid, tf)) * (1. - smoothstep(.5, 1.5, twid));
  tcol = mix(tcol * (.8 + .3 * tf), uPearl * .5, lip);
  col = mix(col, tcol, ter);
  // ---- forest: dark, mottled, crowns seen from above
  float fo = texture2D(uNoise, q * 2. + vec2(.6, .2)).a + .3 * (h - .5);
  float forest = smoothstep(.54, .59, fo + .06 * (micro - .5)) * (1. - ter) ;
  float crown = 0.;
  for (int k = 0; k < 2; k++) {
    vec2 cg = L / (k == 0 ? 12.5 : 8.3) + float(k) * 3.7, cgi = floor(cg), cgf = cg - cgi; vec2 ch2 = hash2(cgi + float(k) * 17.);
    vec2 dc = cgf - .28 - .44 * ch2; float rr = length(dc) / (.34 + .22 * ch2.y);
    float star = .82 + .18 * cos(8. * atan(dc.y, dc.x + 1e-4) + ch2.x * 6.);
    crown = max(crown, (1. - smoothstep(.25, 1., rr / star)) * (.75 + .25 * ch2.x));
  }
  float nearF = 1. - smoothstep(1.5, 6., fw);
  vec3 fcol = uForest * vec3(.8, .9, .85) * (.5 + .5 * micro) * mix(1., .5 + .95 * crown, nearF);
  fcol = mix(fcol, mix(uGold, uForest, .55) * .9, nearF * smoothstep(.75, 1., crown) * .6);   // pale fiddlehead centres
  fcol = fcol * (1. + .34 * gust) + uSea * .035 * gust;
  col = mix(col, fcol, forest);
  // ---- towns: white specks with rose roofs and a window glint
  float tn = texture2D(uNoise, q * 5. + vec2(.5, .3)).g;
  float town = smoothstep(.79, .83, tn) * (1. - forest) * step(.36, h) * (1. - lake);
  vec2 hg = L / 9., hgi = floor(hg), hgf = hg - hgi; vec2 hh = hash2(hgi + 3.1);
  float nearT = 1. - smoothstep(2.5, 7., fw);
  vec2 hb = abs(hgf - .5) - .29;
  float house = step(.42, hh.x) * (1. - smoothstep(-.03, .03, max(hb.x, hb.y)));
  house *= 1. - isC2 * step(-470., phis * 345.) * step(phis * 345., 640.) * step(300., vP.z) * step(vP.z, 960.);   // real houses stand here (the world builds them)
  float roof = step(.0, hgf.y - .5 + (hh.y - .5) * .2);
  vec3 hcol = mix(vec3(.80, .78, .74), mix(uRose, vec3(.75, .36, .30), .55), roof * .8);
  vec3 tmean = mix(col, vec3(.80, .74, .70), .62);
  vec3 tnear = mix(mix(col, uPearl * .62, .5), hcol, house);
  col = mix(col, mix(tmean, tnear, nearT), town);
  float glint = town * step(.42, hh.x) * pow(max(.5 + .5 * sin(uTime * 1.1 + hh.y * 60.), 1e-3), 24.) * step(.7, hh.y);
  // ---- water: lakes below the water line, rivers as bright threads
  float rv = texture2D(uNoise, q + vec2(.13, .71)).b + .08 * texture2D(uNoise, q * 6.).a;
  float rw = max(mix(.0045, .0028, step(2.5, uCh)), mix(1.6, 1.3, step(2.5, uCh)) * fwidth(rv));   // threads, finer in the blue room
  float river = (1. - smoothstep(rw * .55, rw, abs(rv - .5))) * (1. - .5 * ter);
  float wl = .30;
  float shore = 1. - smoothstep(wl, wl + .012 + fwidth(h), h);
  float water = max(max(shore, lake), river);
  vec3 sand = mix(uPearl, uGold, .3) * .7;
  col = mix(col, sand, (1. - smoothstep(wl + .01, wl + .03, h)) * (1. - forest * .5));
  vec3 n = normalize(vN + vec3(0., 1e-6, 0.));
  vec3 V = normalize(uCam - vP + vec3(1e-3, 0., 0.));
  vec2 rp = L / tileOf(60.);
  float rip = texture2D(uNoise, rp + vec2(uTime * .011, uTime * .004)).r - texture2D(uNoise, rp * 1.7 - vec2(uTime * .008, 0.)).g;
  vec3 toDoor = normalize(innerDoor(uCh) - vP + vec3(0., 0., 1e-3));
  vec3 Hh = normalize(V + toDoor + vec3(0., 1e-3, 0.));
  float ndh = clamp(dot(n, Hh), 0., 1.);
  float gl = texture2D(uNoise, L / tileOf(7.) + vec2(uTime * .05, -uTime * .033)).a * texture2D(uNoise, L / tileOf(11.) - vec2(uTime * .04, 0.)).b;
  float lobe = pow(max(ndh, 1e-3), 48.);
  float spec = pow(max(ndh, 1e-3), 14.) * .22 + lobe * (.5 + smoothstep(.36, .5, gl) * (.6 + .4 * sin(uTime * 2. + gl * 60.)) * 2.3 * (1. - .7 * smoothstep(2., 10., fw)));
  // the lit dome ahead lies on the water as a warm band with moving sparkle in it
  vec3 toDome = normalize(vec3(0., 0., uCh < 1.5 ? 1010. : 2210.) - vP + vec3(0., 0., 1e-3));
  float nd2 = clamp(dot(n, normalize(V + toDome + vec3(0., 1e-3, 0.))), 0., 1.);
  float p4 = nd2 * nd2; p4 *= p4; float p16 = p4 * p4; p16 *= p16; float p20 = p16 * p4;
  float spark = smoothstep(.33, .5, gl) * (.55 + .45 * sin(uTime * 2.3 + gl * 70.)) * (1. - .75 * smoothstep(1.5, 9., fw));
  float fleck = smoothstep(.34, .8, p20 * p20 * (.3 + 2.3 * gl) + .2 * p20 * p20) * (.4 + .6 * spark);        // a path of gold flecks, solid only in its core
  float domeGl = (fleck * .30 + p20 * p20 * p20 * spark * 1.1) * (1. - step(2.5, uCh)) * (1. - smoothstep(150., 340., length(uCam - vP)));   // a near thing: from across the chamber the lake keeps its colour
  float fres = 1. - clamp(dot(n, V), 0., 1.); fres = fres * fres;
  vec3 wcol = mix(uSea * vec3(.36, .62, .68), uHaze * .9, fres * .7) * (1. + .16 * rip * nearF);
  // near water: wavelets, sparkle on their crests and fish rings (all gone by a metre per pixel)
  float nearW = 1. - smoothstep(.22, 1.1, fw);
  float wave = texture2D(uNoise, L / tileOf(26.) + vec2(uTime * .021, uTime * .013)).r + texture2D(uNoise, L / tileOf(15.) - vec2(uTime * .017, uTime * .024)).g - 1.;
  float wave2 = texture2D(uNoise, L / tileOf(6.) + vec2(-uTime * .05, uTime * .04)).b - .5;
  vec2 rg = L / 19., rgi = floor(rg); vec2 rh = hash2(rgi + 11.7);
  float rph = fract(uTime * .19 + rh.x * 7.), rr2 = length(rg - rgi - .25 - .5 * rh) * 19.;
  float ring = step(.45, rh.y) * (1. - rph) * (1. - smoothstep(0., .35, abs(rr2 - rph * 5.5))) * smoothstep(.02, .12, rph);
  ring += step(.45, rh.y) * (1. - rph) * .6 * (1. - smoothstep(0., .3, abs(rr2 - rph * 3.2))) * smoothstep(.1, .25, rph);
  float fineW = texture2D(uNoise, L / tileOf(2.6) + vec2(uTime * .07, -uTime * .05)).a + texture2D(uNoise, L / tileOf(4.1) - vec2(uTime * .06, uTime * .03)).r - 1.;
  float wv = wave + .5 * wave2 + .55 * fineW;
  wcol *= 1. + nearW * (.10 * wave + .14 * wave2 + .16 * fineW);
  wcol += nearW * (smoothstep(-.1, .9, wv) * .07 + ring * .22) * mix(uPearl, keyColor(uCh), .5);          // light on the backs of the ripples
  wcol *= 1. - nearW * .15 * (1. - smoothstep(-.9, .1, wv));                                               // and darker troughs
  // the banks stand in the water: a soft violet-green reflection along every shore
  float bank = smoothstep(wl - .055, wl - .002, h) * max(shore, lake) * (.72 + .28 * sin(L.x * 1.9 + wave2 * 9. + uTime * 1.3) * nearW);
  wcol = mix(wcol, mix(uForest * .55, uViolet, .55) * .5, bank * .62);
  // flooded terraces: each step a mirror, pale and brightening toward its lip
  float terS = isC2 * (1. - smoothstep(-80., 50., abs(phis * 345. - 301.) - 72. + tfn)) * (1. - smoothstep(-80., 50., abs(vP.z - 650.) - 135. + tfn));
  float padd = terS * max(shore, lake);
  float tfw = fract(phis * 345. / 10.5 + (texture2D(uNoise, L / tileOf(120.)).r + .5 * texture2D(uNoise, L / tileOf(41.)).g - .75) * 2.4);   // under water the steps wander
  vec3 mirror = mix(uSea, vec3(.84, .96, 1.), .5) * (.94 + .16 * texture2D(uNoise, L / tileOf(150.) + .4).b) * (1. + .14 * wave * nearW) + vec3(1., .84, .56) * .3 * smoothstep(.8, .97, tfw);   // pale aqua, a warm line where the lamp lies on it
  mirror *= 1. - .3 * (1. - smoothstep(.0, .16, tfw));                                   // the lip's shadow in the still water
  wcol = mix(wcol, mirror, padd * .42 * (1. - .6 * bank));
  wcol = mix(wcol, wcol * 1.5 + .12, river * (1. - max(shore, lake)) * smoothstep(1., 8., fw));
  wcol += river * (1. - max(shore, lake)) * (.3 + .5 * step(2.5, uCh)) * smoothstep(.2, 1., sin(L.y * .19 + L.x * .16 - uTime * 2.4)) * mix(keyColor(uCh), uGold, step(2.5, uCh));      // glints running along the rivers; across the last room they are its bright threads
  col = mix(col, wcol, water);
  // ---- the last room: window glints seen across the room. Daylight on glass, never a lamp: near, one to a house; far, one
  // to a 36 m block held a pixel and a half across. Each flashes hard gold as the view turns past its own angle, so the
  // flashes run along a town as we fly.
  float glT = smoothstep(.60, .76, tn) * (1. - .7 * forest) * step(.33, h) * (1. - max(shore, lake));
  float dl1 = length(hgf - .5 - (hh - .5) * .5) * 9.;
  float glN = step(.45, hh.y) * (1. - smoothstep(.5, max(1.6, fw * 1.5), dl1));
  vec2 bg = L / 36., bgi = floor(bg); vec2 bh = hash2(bgi + 5.7);
  float rad2 = max(3., fw * 1.6) * (.8 + .9 * bh.y * bh.y), dl2 = length(bg - bgi - .25 - .5 * bh) * 36.;
  float glF = step(.2, bh.x) * (1. - smoothstep(rad2 * .4, rad2, dl2)) * min(1., 50. / (rad2 * rad2));
  float turn = dot(V, vec3(.62, .31, .72)) * 46. + dot(L, vec2(.021, .013)) + uTime * .8;
  float flashN = smoothstep(.55, .95, sin(turn + hh.x * 6.2831853)), flashF = smoothstep(.45, .95, sin(turn + bh.x * 6.2831853));
  vec2 fg = L / 150., fgi = floor(fg); vec2 fh = hash2(fgi + 9.1);
  float rad3 = max(3.5, fw * 1.6), dl3 = length(fg - fgi - .2 - .6 * fh) * 150.;
  float farm = step(.72, fh.x) * (1. - forest) * (1. - water) * (1. - smoothstep(rad3 * .4, rad3, dl3)) * min(1., 30. / (rad3 * rad3));
  float glints = step(2.5, uCh) * (glT * mix(glN * flashN, glF * flashF, smoothstep(1.2, 3.5, fw)) * 2.4 + farm * smoothstep(.5, .95, sin(turn + fh.y * 6.2831853)) * 1.3);
  // lakes with a glint: hard gold flecks on the water where it mirrors the lit door toward the eye
  float lobe6 = ndh * ndh; lobe6 *= lobe6 * lobe6;
  glints += step(2.5, uCh) * max(shore, lake) * step(.4, bh.y) * (1. - smoothstep(rad2 * .4, rad2, dl2)) * min(1., 50. / (rad2 * rad2)) * smoothstep(.2, .9, sin(turn * 1.3 + bh.x * 6.2831853)) * smoothstep(.12, .5, lobe6) * 1.8;
  // ---- light
  vec2 cq = vec2(vUv.x * uN1, (L.y - uTime * 14.) / T);
  float cloud = smoothstep(.50, .66, texture2D(uNoise, cq * vec2(2., 1.5) + .21).g);      // a whole number of tiles round the wall: no cut at the seam under the lake
  float shadow = 1. - .5 * cloud;
  float relief = clamp(1. + slope * 2.4, .5, 1.6) * (.78 + .44 * h);
  relief = mix(relief, 1., water);
  vec3 lit = shellLight(vP, n, uCh, relief, shadow);
  col = mix(vec3(dot(col, vec3(.3, .55, .15))), col, 1.08);
  vec3 c = max(col, 0.) * .92 * lit;
  c = mix(c, c * mix(vec3(1.), uViolet * 1.9, .4) * .8, .5 * cloud);          // soft violet cloud shadows crossing the fields
  float vis = sunVis(vP, uCh);
  c += (spec * water * keyColor(uCh) * mix(vec3(1.), vec3(1.08, .80, .46), isC2) * (.25 + .75 * vis) + glint * vec3(3., 2.7, 2.2) * (.3 + .7 * vis)) * shadow;
  c += domeGl * water * vec3(1.1, .60, .17) * (.6 + .4 * shadow);
  vec3 cz = hazed(c, vP);
  if (uCh > 2.5) {
    // The last room is pale blue with distance, and the land is still drawn in it: fields a patchwork of blues netted
    // with hedges, forest a second, deeper blue, rivers and lake shores brighter than the land, towns pale flecks.
    // Value inside the one hue, nothing dark; near land keeps its own colours.
    float dd = length(uCam - vP), g4 = dd / (uHazeLen * .56), f4 = (1. - exp(-g4 * g4 * g4 / (.6 + g4 * g4))) * .92;
    float m = .94 + .34 * (hc.y - .5) + (hc.x < .34 ? -.03 : hc.x < .56 ? -.11 : hc.x < .72 ? .07 : .03);
    m *= 1. - .34 * hedge;
    m = mix(m, .80 + .22 * step(.5, tf), ter);
    m = mix(m, .58 + .18 * micro, forest);
    m = mix(m, 1.25, town * .85);
    m = mix(m, 1.08, max(shore, lake));
    m = mix(m, 1.34, river * (1. - max(shore, lake)));
    m *= 1. - .14 * cloud;
    vec3 K = uHaze * vec3(.80, .90, 1.0);
    vec3 blue = mix(mix(K * vec3(.54, .69, .90), K, clamp((m - .55) / .45, 0., 1.)), vec3(.95, .98, 1.), clamp((m - 1.) / .5, 0., 1.) * .9);
    cz = mix(c, blue, f4);
    // the pearl lip: where the wall curls in to the mouth it is bare nacre, ribbed every 12 degrees, with growth
    // ridges 3 m apart and its sheen, lit pale gold from behind us: the rim of the disc of stars
    float rho = length(vP.xy), lipT = (1. - smoothstep(715., 790., rho)) * step(2900., vP.z);
    float ribL = .5 + .5 * cos(phis * 30.), ridL = mix(.5, .5 + .5 * sin(rho * 2.0944), 1. - smoothstep(.6, 2.4, fw));
    vec3 albL = uPearl * clamp(.50 / max(dot(uPearl, vec3(.3, .55, .15)), .05), 0., 1.7) * (.70 + .30 * smoothstep(.1, .9, ribL)) * (.92 + .08 * ridL);
    albL = mix(albL, mix(uPearl, uViolet, .55) * .6, (1. - smoothstep(.0, .22, ribL)) * .5);
    float wrapL = clamp(dot(n, normalize(vec3(0., 0., 2210.) - vP + vec3(0., 1e-3, 0.))) * .6 + .5, 0., 1.);
    vec3 cl = albL * (vec3(1., .80, .46) * (.46 + .50 * wrapL) + vec3(.80, .86, 1.) * .14) + sheen(clamp(dot(n, V), 0., 1.), phis * 3. + rho * .01, ribL);
    cz = mix(cz, mix(cl, K, f4 * .3), lipT);
    glints *= 1. - lipT;
  }
  c = mix(cz, uGold * .95, clamp(glints * exp(-length(uCam - vP) / 5200.), 0., 1.));      // hard gold over the blue, not a glow added to it
  c *= uExpo;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,tt=`
vec3 bumped(vec3 n, vec3 p, float hgt){
  vec3 dpx = dFdx(p), dpy = dFdy(p); float dhx = dFdx(hgt), dhy = dFdy(hgt);
  vec3 r1 = cross(dpy, n), r2 = cross(n, dpx); float det = dot(dpx, r1);
  vec3 grad = sign(det) * (dhx * r1 + dhy * r2);
  return normalize(abs(det) * n - grad + n * 1e-7);
}`,Ie=Pe+tt+`
uniform float uCh, uRibs, uMoss, uRidge, uMist, uAmp, uTrans, uGild, uFill; uniform vec4 uSeat;
void main(){
  float ph = vUv.y / uRidge;
  float fade = 1. - smoothstep(.1, .34, fwidth(ph));
  float ridge = sin(ph * 6.2831853) * fade;
  float rib = (cos(vUv.x * 6.2831853 * uRibs) * .8 + .2 * cos(vUv.x * 6.2831853 * uRibs / 3. + 1.)) * step(.5, uRibs);
  float ribF = 1. - smoothstep(.15, .5, fwidth(vUv.x * uRibs));
  // (the cradle is flown along its length: its grain is as fine along it as across, so nothing on it is drawn out into streaks)
  float nz = texture2D(uNoise, vec2(vUv.x * 6., vUv.y / mix(170., 9., uSeat.w))).r;
  float fine = texture2D(uNoise, vec2(vUv.x * 40., vUv.y / mix(23., 1.4, uSeat.w))).b;
  float ch0 = 1. - step(.5, uCh);                                     // chamber 1: clean ribbed pearl, no cloud to dapple it
  float isBead = uSeat.w * step(abs(vUv.y - 2.25), .002) * step(vUv.x, .002);
  float cross = sin(vUv.y * 2.618) * uSeat.w * (1. - isBead) * (1. - smoothstep(.1, .34, fwidth(vUv.y / 2.4)));      // the cradle: a rib across it every 2.4 m, like the rings of a horn
  float hgt = .09 * uAmp * ridge + rib * ribF * 2.0 * uAmp + (fine - .5) * .2 * fade + (nz - .5) * 1.5 * uAmp * (1. - .7 * ch0) + .2 * cross;
  vec3 n0 = normalize(vN + vec3(0., 1e-6, 0.));
  vec3 n = bumped(n0, vP, hgt);
  vec3 V = normalize(uCam - vP + vec3(1e-3, 0., 0.));
  float ndv = clamp(dot(n, V), 0., 1.);
  float groove = (1. - smoothstep(-.85, .1, rib)) * step(.5, uRibs) + (1. - step(.5, uRibs)) * (1. - smoothstep(-.8, .2, ridge)) * .6;
  vec3 alb = uPearl * .76 * (.94 + .06 * ridge) * (.9 + .2 * nz * (1. - .6 * ch0));
  alb *= mix(1., clamp(.45 / max(dot(uPearl, vec3(.3, .55, .15)), .05), .0, 1.7), uSeat.w);      // the cradle: pale pearl against the stars, whatever the nacre
  alb = mix(alb, mix(uPearl, uViolet, .55) * .6, groove * .62);                 // shadowed pearl goes lilac
  float hollow = (1. - smoothstep(-1., .5, rib)) * ribF * step(.5, uRibs) * ch0;       // chamber 1: each rib stands out of a hollow of thin violet shade
  alb = mix(alb, mix(alb, uViolet, .55) * .74, hollow * .62);
  float mossN = texture2D(uNoise, vec2(vUv.x * 21., vUv.y / mix(37., 2.6, uSeat.w))).g;
  float moss = groove * groove * smoothstep(.5, .66, mossN + .3 * (fine - .5)) * uMoss;
  moss = mix(moss, groove * groove * groove * groove * (.5 + .5 * smoothstep(.3, .6, mossN)) * uMoss * 1.3, ch0);      // chamber 1: a thread of gold moss down each groove, nowhere else
  alb = mix(alb, uGold * vec3(.50, .42, .09) * (.6 + .8 * fine), moss * .9);
  // the cradle: growth rings every 18 m that read from across the room, a fringe of moss hanging from its flanks, and its pearls
  alb *= 1. - .1 * uSeat.w * (1. - smoothstep(-.6, .2, cross));                 // the seam between two ribs, a little darker
  float grow2 = uSeat.w * (1. - isBead) * smoothstep(.43, .47, abs(fract(vUv.y / 18.) - .5));
  alb = mix(alb, mix(uPearl, uViolet, .55) * .62, grow2 * .6);
  float fz = texture2D(uNoise, vec2(vUv.y / 29., .37)).r, fa = -.62 + .6 * fz;
  float fringe = uSeat.w * (1. - isBead) * (1. - smoothstep(fa - .1, fa, n0.y)) * smoothstep(-.99, -.86, n0.y) * (.7 + .3 * fine);
  alb = mix(alb, mix(uForest, uGold, .45) * vec3(.42, .50, .16) * (.6 + .8 * fine), fringe * .9);
  alb = mix(alb, alb * 1.14 + .03, isBead);
  float dap = mix(.6 + .85 * smoothstep(.22, .78, texture2D(uNoise, vec2(vUv.x * 2. + uTime * .02, vUv.y / 210. - uTime * .085)).g), 1., ch0);
  vec3 lit = shellLight(vP, n, uCh, 1., dap) * uFill;
  lit /= 1. + uSeat.w * .25 * max(max(lit.r, lit.g), lit.b);                  // the cradle stands in the shaft from door 3: its light is eased so pale nacre does not burn out
  vec3 c = alb * lit;
  c = mix(c, WHITE_GOLD * lit, ch0 * sunShare(vP, n) * (1. - .85 * groove) * (1. - .5 * hollow));      // the first room's rule: lit white-gold beside the sun, whatever the nacre
  float away = ch0 * (1. - smoothstep(-.15, .5, dot(n, normalize(-vP + vec3(0., 0., 1e-3)))));      // chamber 1: what turns from the sun stands in its own shade, violet, never black
  c = mix(c, c * vec3(.56, .49, .70), away * .8);
  c += alb * vec3(1., .74, .38) * uGild * dap * sunVis(vP, uCh) * clamp(dot(n, normalize(-vP + vec3(0., 0., 1e-3))) * 1.6 + .3, 0., 1.);
  float lum = dot(lit, vec3(.33));
  float back = clamp(-dot(n, normalize(-vP + vec3(0., 0., 1e-3))), 0., 1.);
  c += mix(uGold, uRose, .45) * vec3(1., .7, .5) * back * uTrans * sunVis(vP, uCh) * clamp(pow(118. / max(length(vP), 40.), 1.7), .28, 1.8);
  c += sheen(ndv, ph + rib, nz) * (.5 + lum) * (1. - moss);
  c += pow(clamp(dot(n, normalize(V + normalize(-vP + vec3(0., 0., 1e-3)) + vec3(0., 1e-3, 0.))), 1e-3, 1.), 40.) * keyColor(uCh) * .35 * sunVis(vP, uCh) * (1. - moss);
  // mist running in the grooves
  float mist = groove * uMist * smoothstep(.35, .75, texture2D(uNoise, vec2(vUv.x * 9., vUv.y / 120. - uTime * .035)).a);
  c = mix(c, vec3(1., .93, .8) * (.4 + .5 * lum), mist * .4);
  // the ring's own cool light on the horns that hold it
  vec3 toRing = uSeat.xyz - vP; float dr = length(toRing);
  c += alb * vec3(.70, .86, 1.) * uSeat.w * exp(-dr / 75.) * 1.3 * (.3 + .7 * clamp(dot(n, toRing / max(dr, 1.)), 0., 1.));
  float rimE = 1. - ndv; rimE *= rimE;
  c += alb * uGold * uSeat.w * sunVis(vP, uCh) * rimE * .5;                                 // the shaft from behind us catches its edges pale gold
  float hb = clamp(dot(n, normalize(V + normalize(-vP + vec3(0., 0., 1e-3)) + vec3(0., 1e-3, 0.))), 0., 1.), hb4 = hb * hb * hb * hb;
  c += isBead * vec3(1., .95, .82) * hb4 * hb4 * hb4 * hb4 * .9;                            // each pearl carries a highlight of the sun behind us
  c += alb * vec3(1., .80, .46) * .5 * uSeat.w * (1. - sunVis(vP, uCh)) * clamp(dot(n, normalize(-vP + vec3(0., 0., 1e-3))) * .6 + .45, 0., 1.);
  c = mix(c, c * vec3(1.22, 1.03, .70), uSeat.w * max(sunVis(vP, uCh), .6) * .85);         // and washes the whole cradle pale gold, from behind us (the rolled lip too, outside the shaft)
  c = mix(c, hazed(c, vP), 1. - .55 * uSeat.w) * uExpo;                                    // the cradle stands in the mouth: it keeps its pearl and gold through the blue air
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,dt=`
varying vec3 vP;
void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,ft=`
uniform vec4 uSeat; uniform float uR, uExpo, uTime; varying vec3 vP;
void main(){
  float r = length(vP - uSeat.xyz), t = clamp((r - uR - .2) / 3.4, 0., 1.);
  float b = sin(3.14159265 * t); b = b * b * (.9 + .1 * sin(uTime * 1.3 + (vP.x + vP.y) * .45));
  gl_FragColor = vec4(vec3(.74, .90, 1.) * 2.6 * b * uExpo, 1.);
}`,vt=`
uniform vec4 uSeat; uniform float uR; varying vec2 vQ;
void main(){
  vQ = position.xy * uR * 7.;
  vec4 mv = modelViewMatrix * vec4(uSeat.xyz, 1.);
  mv.xy += vQ;
  gl_Position = projectionMatrix * mv;
}`,pt=`
uniform float uR, uExpo, uTime; varying vec2 vQ;
void main(){
  float d = length(vQ), o = max(d - uR, 0.);
  float g = exp(-o / (uR * .8)) * .30 + exp(-o / (uR * 2.6)) * .10;
  g *= mix(.12, 1., smoothstep(uR * .8, uR * 1.05, d)) * (1. - smoothstep(uR * 5.5, uR * 7., d));     // the opening itself stays clear
  g *= .92 + .08 * sin(uTime * .9);
  gl_FragColor = vec4(vec3(.62, .82, 1.) * g * uExpo, 1.);
}`,ot=`
attribute float aFace;
varying vec2 vUv; varying vec3 vP; varying vec3 vN; varying float vFace;
#include <fog_pars_vertex>
void main(){
  vUv = uv; vP = position; vN = normal; vFace = aFace;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,gt=Pe+tt+`
uniform float uCh, uRout, uRd, uRprev; uniform vec3 uLamp;      // uLamp = (lamp core, lamp skirt, sheen)
varying float vFace;      // 0 sunward face, 1 lip, 2 mouthward face
void main(){
  float r = vUv.y, phi = vUv.x * 6.2831853;
  float ribA = smoothstep(uRd + 6., uRd + uRout * .12, r) * r * .011;
  float rib = cos(phi * 30.);
  float rib2 = cos(phi * 60. + 1.3) * smoothstep(.45, .8, r / uRout);         // ribs fork toward the rim
  float ph = r / 3.;
  float fade = 1. - smoothstep(.2, .55, fwidth(ph));
  float ridge = sin(ph * 6.2831853) * fade;
  float nz = texture2D(uNoise, vec2(vUv.x * 7., r / 260.)).r;
  float fine = texture2D(uNoise, vec2(vUv.x * 60., r / 31.)).b;
  float lipness = 1. - abs(vFace - 1.);  lipness = clamp(lipness, 0., 1.);
  float back = clamp(vFace - 1., 0., 1.), front = clamp(1. - vFace, 0., 1.);
  float hgt = (rib * 1.6 + rib2 * .7) * ribA + .22 * ridge + (fine - .5) * .2 * fade;
  hgt *= 1. - lipness;
  vec3 n0 = normalize(vN + vec3(0., 1e-6, 0.));
  vec3 n = bumped(n0, vP, hgt);
  vec3 V = normalize(uCam - vP + vec3(1e-3, 0., 0.));
  float ndv = clamp(dot(n, V), 0., 1.), ndv0 = clamp(dot(n0, V), 0., 1.);
  float vein = clamp(.5 + .5 * (rib * .75 + rib2 * .35), 0., 1.) * smoothstep(uRd + 6., uRd + uRout * .12, r);       // 1 on a rib crest
  vein = max(vein * vein, .35 * (.5 + .5 * ridge));
  float ribOn = smoothstep(uRd + 6., uRd + uRout * .12, r);
  // comarginal growth lines, scalloped between the ribs like a real shell
  float gb = r / (.055 * uRout) + .10 * rib * ribOn + texture2D(uNoise, vec2(vUv.x * 3., r / 400.)).a * .7;
  float gline = smoothstep(.80, .97, fract(gb)) * (1. - smoothstep(.97, 1., fract(gb)));
  float band = .5 + .5 * sin(floor(gb) * 2.4);
  vec3 alb = uPearl * .76 * (.93 + .07 * ridge) * (.88 + .2 * nz) * (.92 + .1 * band) * (1. - .22 * gline * (1. - lipness));
  float d = max(r - uRd, 0.);
  float glow = exp(-d / (.35 * uRout));
  // the lamp: one door radius of near-white gold round the door, then a long soft skirt
  float lampL = uRd * mix(1.5, .6, clamp(uCh, 0., 1.));
  float lamp = exp(-d / lampL), lampW = exp(-d / (lampL * 2.8));
  // 0 at the door, 1 at 1.35 door radii out or at the edge of the face we can see, whichever comes first
  float rimT = clamp(d / max(min(mix(uRprev, uRout, back) - uRd, uRd * 1.35), 1.), 0., 1.);
  float dusk = smoothstep(.08, .95, rimT) * clamp(uCh + .4, 0., 1.);
  alb *= mix(vec3(1.), vec3(.84, .83, .97), smoothstep(.25, 1., r / uRout));
  alb = mix(alb, mix(uPearl, uViolet, .5) * .66, (1. - smoothstep(-.7, .35, rib + rib2 * .4)) * ribOn * .78 * (1. - lamp));
  // surface light: the sunward face gets the shaft's disc, the mouthward face only the fills
  float chF = uCh, chB = uCh + 1.;
  vec3 litF = shellLight(vP, n, chF, 1., 1.);
  vec3 litB = shellLight(vP, n, chB, 1., 0.);
  float dap = .76 + .5 * texture2D(uNoise, vec2(vUv.x * 3. + uTime * .03, r / (uRout * .9) - uTime * .07)).g;
  // away from the door the stone falls to dusky lilac pearl
  vec3 surfF = alb * litF * .74 * dap * mix(1., .5, dusk);
  surfF = mix(surfF, WHITE_GOLD * litF * .74 * dap, (1. - step(.5, uCh)) * front * sunShare(vP, n) * (1. - .8 * (1. - smoothstep(-.7, .35, rib + rib2 * .4)) * ribOn));      // the first room's rule on the first dome's sunward face
  vec3 lilac = mix(uPearl, uViolet, .7) * 1.04;                       // pearl gone toward violet #5B4A78: no blue of its own
  surfF = mix(surfF, lilac * dot(surfF, vec3(.3, .55, .15)) * 3.1, .8 * dusk);
  surfF += mix(uPearl, uViolet, .8) * .28 * dusk * (.8 + .4 * vein);                                  // and is never left black: the far skirt keeps a dusky lilac of its own
  vec3 c = mix(surfF, alb * litB * mix(1., .3, step(1.5, uCh)), back);
  // lamp behind stone: glow falling off from the door rim, cut under the ribs and growth lines (dark veins)
  float disc = sunVis(vec3(vP.xy, min(vP.z, innerDoor(chB).z)), chF) * (1. - smoothstep(uRprev - 30., uRprev + 6., r));
  vec3 amber = mix(uGold, uRose, .38) * vec3(1.05, .80, .58);
  float cut = (1.08 - .72 * vein) * (1. - .45 * gline) * (.75 + .5 * nz);
  vec3 lampC = mix(mix(amber, mix(uPearl, uViolet, .62) * 1.2, smoothstep(.3, 1., rimT)), vec3(1., .88, .62), lamp);   // gold at the door, dusky lilac far out
  vec3 sssF = lampC * (lamp * uLamp.x + lampW * uLamp.y + .05) * mix(cut, 1., lamp * .3);
  vec3 sssB = amber * (glow * glow * 1.6 + glow * 1.5 + .12) * cut + amber * vec3(1.1, .9, .7) * disc * cut * 1.1;
  float gN = exp(-d / (.75 * uRd)), gS = exp(-d / (2.6 * uRd));      // dome 3's mouthward face (the flight never turns to look at it): a ring of gold round the door, dusky lilac beyond
  sssB = mix(sssB, mix(amber, mix(uPearl, uViolet, .6) * 1.1, smoothstep(.2, 1., rimT)) * (gN * gN * 2.4 + gN * 1.5 + gS * .15 + .012) * cut, step(1.5, uCh));
  vec3 lampKey = keyColor(min(chF, 1.)) * mix(1., .9, clamp(chF - 1., 0., 1.));
  lampKey = mix(lampKey, vec3(.57, .48, .78), .6 * smoothstep(.35, 1., rimT) * clamp(uCh, 0., 1.));       // the far skirt of the glow is violet
  c += mix(sssF * lampKey * .62, sssB * keyColor(chF) * 1.05, back) * dap;
  // the orient of the nacre: two hues that slide over the stone as the view turns
  float nzs = texture2D(uNoise, vec2(vUv.x * 2., r / 900.)).a;
  float ir = sin(9. * ndv0 + 2.2 * nzs + .5 * (ndv - ndv0) + uTime * .2);            // broad bands from the smooth face, a little grain from the ribs
  vec3 irid = mix(uRose, uSea, smoothstep(-.6, .6, ir));
  float irA = (1. - lipness) * (1. - .85 * lamp) * smoothstep(.1, .7, abs(ir)) * uLamp.z * (1. - .7 * dusk);      // on the far skirt the sheen is a trace over the lilac, 12 percent at most
  c = mix(c, c * irid * 1.9, .4 * irA) + irid * .05 * irA;
  // cut section of the lip: laminated, emissive
  float lam = .78 + .22 * sin(vP.z * 2.1);
  lam *= (.62 + .38 * sin(r * 1.7 + 1.3 * sin(phi * 45.))) * (.34 + .5 * ndv0) * (.8 + .4 * nz);      // growth lines round the roll, darker where it turns away
  vec3 lipC = mix(uGold, uRose, .3) * vec3(1.1, .85, .66) * 1.6 * lam * keyColor(chF);
  c = mix(c, lipC + alb * .3, lipness * .85);
  c += sheen(ndv, ph + rib, nz) * (.6 + dot(litF, vec3(.2))) ;
  c = hazed(c, vP) * uExpo;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`;function xt(s,u){const c=Ve[s],x=be[s],w=ue*.5+4+s*2,F=[],d=15,y=10;for(let l=0;l<=d;l++){const g=l/d,b=E(c,x+w*.9,1-(1-g)*(1-g));F.push([He(s,b),b,0,1])}for(let l=1;l<y;l++){const g=Math.PI*(l/y),b=He(s,x)+ue*.5;F.push([b-Math.cos(g)*w,x+w*.9-Math.sin(g)*w*.9,1,0])}for(let l=0;l<=d;l++){const g=l/d,b=E(x+w*.9,c,g*g);F.push([He(s,b)+ue*(1+1.2*g),b,2,1])}const h=F.length,p=u+1,R=new Float32Array(h*p*3),o=new Float32Array(h*p*3),P=new Float32Array(h*p*2),m=new Float32Array(h*p),z=[],f=new Float64Array(p),V=new Float64Array(p),M=new Float64Array(p),i=new Float64Array(p);for(let l=0;l<=u;l++){const g=l/u*J;f[l]=Math.sin(g),V[l]=-Math.cos(g),M[l]=Math.cos(g*30)*1.6,i[l]=Math.cos(g*60+1.3)*.7}for(let l=0;l<h;l++){const[g,b,L,B]=F[l],$=F[Math.max(0,l-1)],Z=F[Math.min(h-1,l+1)];let fe=Z[0]-$[0],ve=Z[1]-$[1];const ie=Math.hypot(fe,ve)||1;fe/=ie,ve/=ie;const H=ve,Q=-fe,ae=B*we(x+6,x+c*.12,b)*b*.011,te=we(.45,.8,b/c);for(let D=0;D<=u;D++){const X=f[D],I=V[D],Y=l*p+D,le=(M[D]+i[D]*te)*ae,pe=b+Q*le,ze=g+H*le;R[Y*3]=pe*X,R[Y*3+1]=pe*I,R[Y*3+2]=ze,o[Y*3]=Q*X,o[Y*3+1]=Q*I,o[Y*3+2]=H,P[Y*2]=D/u,P[Y*2+1]=b,m[Y]=L}}for(let l=0;l<h-1;l++)for(let g=0;g<u;g++){const b=l*p+g,L=b+1,B=b+p,$=B+1;z.push(b,L,B,L,$,B)}const T=new t.BufferGeometry;return T.setAttribute("position",new t.BufferAttribute(R,3)),T.setAttribute("normal",new t.BufferAttribute(o,3)),T.setAttribute("uv",new t.BufferAttribute(P,2)),T.setAttribute("aFace",new t.BufferAttribute(m,1)),T.setIndex(z),T}const wt=`
uniform vec3 uCam, uSeed; uniform float uExpo, uTime;
varying vec3 vP;
#include <fog_pars_fragment>
vec3 hash3(vec3 p){
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
  return fract(sin(p) * 43758.5453);
}
// animated cell noise: x = distance to the nearest cell centre, y = gap to the second
vec2 cells(vec3 p, float t){
  vec3 pi = floor(p), pf = p - pi; float d1 = 9., d2 = 9.;
  for (int k = -1; k <= 1; k++) for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec3 o = vec3(float(i), float(j), float(k)); vec3 h = hash3(pi + o);
    vec3 r = o + .5 + .38 * sin(t * (.6 + .8 * h.yzx) + 6.2831853 * h) - pf;
    float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
  }
  d1 = max(d1, 1e-8); d2 = max(d2, 1e-8);
  return vec2(sqrt(max(d1, 1e-8)), sqrt(max(d2, 1e-8)) - sqrt(max(d1, 1e-8)));
}
void main(){
  vec3 n = normalize(vP + vec3(0., 0., 1e-4));                                   // |vP| = 60, never zero
  vec3 V = normalize(uCam - vP + vec3(1e-3, 0., 0.));
  float mu = clamp(dot(n, V), 0., 1.);
  float t = uTime * 1.0472;                                 // granules turn over in 6 s
  vec3 drift = vec3(0., uTime * .05, uTime * .02);
  vec3 w = vP + 1.5 * sin(vP.yzx * .31 + t * .25) + .8 * sin(vP.zxy * .83 - t * .4);
  vec2 c1 = cells(w / 5.2 + drift + uSeed, t);
  vec2 c2 = cells(vP / 16. - drift * .6, t * .4);
  float lane = 1. - smoothstep(.0, .12, c1.y);                                   // thin dark lanes between cells
  float dome = clamp(1.15 - 1.5 * c1.x * c1.x, 0., 1.);                          // each granule wells up bright in the middle
  float sup = .62 + .38 * smoothstep(.0, .45, c2.y);                             // slow supergranule network
  float fine = .5 + .5 * sin(w.x * 2.3 + sin(w.y * 1.9 + t)) * sin(w.z * 2.1 - t * .7);
  float hot = dome * (1. - lane) * sup * (.86 + .14 * fine);
  vec3 laneC = vec3(.89, .35, .07) * 1.6, centre = vec3(1., .66, .21) * 3.5;
  vec3 c = mix(laneC, centre, hot * sqrt(max(hot, 1e-6)));
  c *= .9 + .2 * (1. - c2.x);
  vec3 limb = vec3(.81, .25, .042) * 1.5;
  float ld = sqrt(max(mu, 1e-6));
  c = mix(limb * (.6 + .4 * hot), c, ld * (1.1 - .1 * ld));
  c.b = min(c.b, c.r * .35);
  gl_FragColor = vec4(c * uExpo, 1.);
  #include <fog_fragment>
}`,bt=`
varying vec3 vP;
#include <fog_pars_vertex>
void main(){
  vP = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,yt=`
attribute vec3 aUp; attribute float aPhase;
uniform float uTime;
varying vec2 vUv; varying vec3 vN; varying vec3 vP; varying float vLife;
void main(){
  float life = .62 + .38 * sin(uTime * .31416 + aPhase);              // 20 s
  vec3 p = position - aUp * (1. - life);
  p += normalize(aUp + vec3(0., 1e-4, 0.)) * sin(uTime * .7 + aPhase * 3. + uv.y * 9.) * 1.2 * uv.y * (1. - uv.y);
  vUv = uv; vN = normal; vP = p; vLife = life;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}`,Pt=`
uniform vec3 uCam; uniform float uExpo, uTime; uniform sampler2D uNoise;
varying vec2 vUv; varying vec3 vN; varying vec3 vP; varying float vLife;
void main(){
  vec3 V = normalize(uCam - vP + vec3(1e-3, 0., 0.));
  float ndv = abs(dot(normalize(vN + vec3(0., 1e-5, 0.)), V));
  float core = ndv * ndv;
  float s1 = texture2D(uNoise, vec2(vUv.x * 2., vUv.y * 1.6 - uTime * .035)).r;
  float s2 = texture2D(uNoise, vec2(vUv.x * 5., vUv.y * 4. + uTime * .05)).g;
  float streak = smoothstep(.25, .8, s1 * .7 + s2 * .5);
  float ends = smoothstep(0., .06, vUv.y) * (1. - smoothstep(.94, 1., vUv.y));
  float e = abs(cos(vUv.x * 6.2831853)); e = e * e * (3. - 2. * e);                // soft ribbon edges
  float fil = smoothstep(.35, .75, texture2D(uNoise, vec2(vUv.x * 9., vUv.y * .7 - uTime * .02)).a);
  float a = min(core * e * (.2 + .7 * streak + .5 * fil * streak) * ends * (.5 + .5 * vLife), .6);
  vec3 c = mix(vec3(1., .22, .035), vec3(1., .5, .12), streak * e) * 3.4;
  gl_FragColor = vec4(c * a * uExpo, 1.);
}`,zt=`
varying vec2 vQ;
void main(){
  vQ = position.xy;
  vec4 mv = modelViewMatrix * vec4(0., 0., 0., 1.);
  mv.xy += position.xy;
  gl_Position = projectionMatrix * mv;
}`,Mt=`
uniform float uExpo, uTime; varying vec2 vQ;
void main(){
  float d = length(vQ);
  float g = exp(-max(d - 58., 0.) / 26.) * .55 + exp(-max(d - 58., 0.) / 90.) * .16;
  g *= 1. - smoothstep(250., 330., d);
  float ang = atan(vQ.y, vQ.x + 1e-4);
  g *= .9 + .1 * sin(ang * 9. + uTime * .2) * sin(ang * 4. - uTime * .13);
  gl_FragColor = vec4(vec3(1., .62, .22) * g * uExpo, 1.);
}`;function de(s,u,c,x,w,F=!0){const d=[],y=[];for(let i=0;i<=c;i++)d.push(s(i/c));for(let i=0;i<=c;i++)y.push(d[Math.min(c,i+1)].clone().sub(d[Math.max(0,i-1)]).normalize());const h=[],p=[],R=[],o=[];let P=w.clone().addScaledVector(y[0],-w.dot(y[0])).normalize(),m=0;const z=new t.Vector3,f=new t.Vector3,V=new t.Vector3;for(let i=0;i<=c;i++){i>0&&(m+=d[i].distanceTo(d[i-1]),P.addScaledVector(y[i],-P.dot(y[i])).normalize()),z.crossVectors(y[i],P);const[T,l]=u(i/c);for(let g=0;g<=x;g++){const b=g/x*J,L=Math.cos(b),B=Math.sin(b);f.copy(d[i]).addScaledVector(P,L*l).addScaledVector(z,B*T),V.set(0,0,0).addScaledVector(P,L*T).addScaledVector(z,B*l).normalize(),h.push(f.x,f.y,f.z),p.push(V.x,V.y,V.z),R.push(g/x,m)}}for(let i=0;i<c;i++)for(let T=0;T<x;T++){const l=i*(x+1)+T,g=l+1,b=l+x+1,L=b+1;o.push(l,b,g,g,b,L)}if(F){const[i]=u(1),T=h.length/3,l=d[c].clone().addScaledVector(y[c],i*.8);h.push(l.x,l.y,l.z),p.push(y[c].x,y[c].y,y[c].z),R.push(.5,m+i);for(let g=0;g<x;g++){const b=c*(x+1)+g;o.push(b,T,b+1)}}const M=new t.BufferGeometry;return M.setAttribute("position",new t.Float32BufferAttribute(h,3)),M.setAttribute("normal",new t.Float32BufferAttribute(p,3)),M.setAttribute("uv",new t.Float32BufferAttribute(R,2)),M.setIndex(o),M}function Ne(s,u){const c=new t.SphereGeometry(u,8,6);c.translate(s.x,s.y,s.z);const x=c.attributes.uv;for(let w=0;w<x.count;w++)x.setXY(w,0,.75*3);return c}const kt=`
uniform vec3 uCam; uniform float uExpo, uTime, uCh, uZ0, uZ1, uGain, uSoft; uniform sampler2D uNoise;
varying vec2 vUv; varying vec3 vP; varying vec3 vN;
vec3 keyColor(float ch){
  vec3 c = vec3(1., .79, .36);
  c = mix(c, vec3(1., .87, .60) * .7, clamp(ch - 1., 0., 1.));
  c = mix(c, vec3(.85, .89, 1.) * .45, clamp(ch - 2., 0., 1.));
  return c;
}
void main(){
  // nested cones of streaked light (uv.x carries a per-shell offset): seen from outside as a pale cone,
  // from inside as rays fanning out from the door behind us onto the next dome
  vec3 V = normalize(uCam - vP + vec3(1e-3, 0., 0.));
  float ndv = abs(dot(normalize(vN + vec3(0., 1e-6, 0.)), V));
  float t = clamp((vP.z - uZ0) / max(uZ1 - uZ0, 1.), 0., 1.);
  float s1 = texture2D(uNoise, vec2(vUv.x * 3. + uTime * .004, t * .35 - uTime * .006)).r;
  float s2 = texture2D(uNoise, vec2(vUv.x * 11. - uTime * .003, .3 + t * .04)).g;
  float s3 = texture2D(uNoise, vec2(vUv.x * 29. + uTime * .002, .7)).b;
  float streak = smoothstep(.28, .78, s2 * .7 + s3 * .3) * (.45 + 1.1 * s1) + .12;
  // the last shaft is seen from outside, across the widest room: broad soft bands, no hard rays
  streak = mix(streak, (.4 + .6 * smoothstep(.2, .8, texture2D(uNoise, vec2(vUv.x * 2. + uTime * .003, t * .22 - uTime * .004)).g)) * (.7 + .5 * s1), uSoft);
  float near = smoothstep(10., 110., length(uCam - vP));
  float a = uGain * (.3 + .7 * ndv) * streak * smoothstep(0., .05, t) * (1. - .45 * t) * (1. - smoothstep(.9, 1., t)) * near;
  // from outside, a cone of light has no edge: each shell thins away toward its silhouette
  float slope = length(vP.xy) / max(vP.z, 1.);
  float outside = smoothstep(1., 1.25, length(uCam.xy) / max(slope * uCam.z, 1.));
  a *= mix(1., smoothstep(0., .6, ndv), outside);
  a *= mix(1., mix(.3, 1., outside) * (1. - .85 * smoothstep(.75, .97, abs(V.z))), uSoft);      // from inside it, or looked at end-on, the last shaft is only a faint brightness: the stars in the mouth stay hard
  gl_FragColor = vec4(keyColor(uCh) * a * uExpo, 1.);
}`;async function Tt(s,u={}){const c=s.rng,x=Oe(u.detail??s.quality?.detail??1,.6,1),w=(u.palette&&u.palette.length>=7?u.palette:ct).map(e=>new t.Color(e)),F=u.season==="blossom"?1:u.season==="summer"?0:c()<.3?1:0,d=new t.Group;d.name="chambered-sun";const y=await ut(s,c);await s.yield();const h={uCam:{value:new t.Vector3(95,0,-70)},uExpo:{value:1},uTime:{value:0},uHazeLen:{value:2100},uNoise:{value:y},uPearl:{value:w[0]},uRose:{value:w[1]},uSea:{value:w[2]},uGold:{value:w[3]},uForest:{value:w[4]},uViolet:{value:w[5]},uHaze:{value:new t.Color("#7FA3C8")},uHb:{value:new t.Vector4(0,-1e5,0,0)},uTw:{value:new t.Vector4(0,-1e5,0,0)},uHbM:{value:new t.Matrix3}},p=(e,a,r,v={})=>new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...h,...r},vertexShader:e,fragmentShader:a,fog:!0,side:t.DoubleSide,...v}),R=(e,a,r)=>new t.ShaderMaterial({uniforms:{...h,...r},vertexShader:e,fragmentShader:a,fog:!1,side:t.DoubleSide,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending}),o=e=>({value:e}),P=[],m=[],z=[J*170,J*360,J*720,J*1150],f=[1,1,2,3];for(let e=0;e<4;e++){const a=ht(e,e===0?40:e===3?56:40);m.push(a);const r=Se(a,x<.75?96:e===0?108:120,!0);await s.yield();const v=e===0?p(me,Ie,{uCh:o(0),uRibs:o(36),uMoss:o(.5),uRidge:o(3),uMist:o(.45),uAmp:o(1),uTrans:o(0),uGild:o(.3),uFill:o(1.12),uSeat:o(new t.Vector4(0,0,0,0))}):p(me,mt,{uCh:o(e),uCirc:o(z[e]),uN1:o(f[e]),uSeason:o(F)}),n=new t.Mesh(r,v);n.name="chamber"+(e+1),n.frustumCulled=!1,d.add(n),P.push(n),await s.yield()}const V=[],M=[165,338,677];for(let e=0;e<3;e++){const a=xt(e,x<.75?120:180);await s.yield();const r=new t.Mesh(a,p(ot,gt,{uCh:o(e),uRout:o(Ve[e]),uRd:o(be[e]),uRprev:o(M[e]),uLamp:o(new t.Vector3(e===0?1.5:1.8,e===0?1.1:.22,e===0?.3:1))}));r.name="dome"+(e+1),r.frustumCulled=!1,d.add(r),V.push(r)}await s.yield();const i=new t.Group;i.name="sun",d.add(i);const T=new t.Mesh(new t.SphereGeometry(se,72,44),p(bt,wt,{uSeed:o(new t.Vector3(c()*40,c()*40,c()*40))},{side:t.FrontSide}));i.add(T),await s.yield();const l=new t.Mesh(new t.PlaneGeometry(680,680),R(zt,Mt,{}));l.frustumCulled=!1,l.renderOrder=2,i.add(l);const g=[];for(let e=0;e<5;e++){const a=e/5*J+c.range(-.35,.35),r=c.range(-.55,.75),v=new t.Vector3(Math.cos(a)*Math.cos(r),Math.sin(r),Math.sin(a)*Math.cos(r)).normalize(),n=new t.Vector3(c.range(-1,1),c.range(-1,1),c.range(-1,1));n.addScaledVector(v,-n.dot(v)).normalize();const C=new t.Vector3().crossVectors(v,n).normalize(),_=c.range(.42,.7),U=c.range(30,50),S=c()*J,q=c.range(-.25,.25),N=G=>v.clone().applyAxisAngle(C,(G-.5)*_).applyAxisAngle(n,q*Math.sin(Math.PI*G)),O=G=>U*Math.pow(Math.sin(Math.PI*G),.75),K=de(G=>N(G).multiplyScalar(se-3+O(G)),G=>[5.5*(.55+.45*Math.sin(Math.PI*G)),1.7],40,8,C,!1),A=K.attributes.position.count,j=new Float32Array(A*3),Re=new Float32Array(A),ce=K.attributes.uv;let Te=ce.getY(A-1)||1;for(let G=0;G<A;G++){const et=Math.floor(G/9)/40,Be=N(et).multiplyScalar(O(et));j[G*3]=Be.x,j[G*3+1]=Be.y,j[G*3+2]=Be.z,Re[G]=S,ce.setY(G,ce.getY(G)/Te)}K.setAttribute("aUp",new t.BufferAttribute(j,3)),K.setAttribute("aPhase",new t.BufferAttribute(Re,1)),g.push(K),await s.yield()}await s.yield();const b=new t.Mesh(he(g),R(yt,Pt,{}));b.frustumCulled=!1,b.renderOrder=3,i.add(b),await s.yield();const L=(e,a)=>{for(let r=1;r<e.length;r++)if(e[r][0]>=a){const v=e[r-1],n=e[r];return E(v[1],n[1],(a-v[0])/Math.max(.001,n[0]-v[0]))}return e[e.length-1][1]},B=[],$=[],Z=[{z0:28,th:1.52},{z0:128,th:.92},{z0:-92,th:2.2}],fe=c.range(.3,.36),ve=(60+c.range(-2,2))*Math.PI/180;for(let e=0;e<9;e++){const a=Z[e%3],r=a.z0+c.range(-10,10),v=a.th+c.range(-.06,.06),n=L(m[0],r)+3,C=ve+e*J/9,_=(se+20)*Math.cos(v),U=(se+20)*Math.sin(v),S=E(r,_,.12)+(r-_)*.18,q=E(n,U,.62),N=A=>{const j=1-A,Re=j*j*r+2*j*A*S+A*A*_,ce=j*j*n+2*j*A*q+A*A*U,Te=C+fe*A*A*(3-2*A);return new t.Vector3(ce*Math.sin(Te),-ce*Math.cos(Te),Re)},O=A=>{const j=2.5+7.5*Math.pow(1-A,4)+.9*Math.sin(Math.PI*A)+1.6*Math.exp(-((A-1)*(A-1))/.004);return[j*1.55,j*.72]};B.push(de(N,O,44,10,new t.Vector3(0,0,1),!0)),await s.yield();const K=N(1);$.push(K),B.push(Ne(K.clone().multiplyScalar((se+17.5)/(se+20)),3.4))}await s.yield();const ie=new t.Mesh(he(B),p(me,Ie,{uCh:o(0),uRibs:o(3),uMoss:o(.12),uRidge:o(4.5),uMist:o(1),uAmp:o(.3),uTrans:o(1.15),uGild:o(0),uFill:o(1.5),uSeat:o(new t.Vector4(0,0,0,0))}));ie.name="ribs",d.add(ie),await s.yield();const H=new t.Vector3(0,0,re+250),Q=new t.Vector3(0,0,1),ae=new t.Vector3().crossVectors(new t.Vector3(0,1,0),Q).normalize(),te=new t.Vector3(0,1,0),D=(e,a,r)=>H.clone().addScaledVector(ae,e).addScaledVector(te,a).addScaledVector(Q,r),X=8,I=[],Y=[];for(let e=0;e<=12;e++){const a=e/12*J;Y.push([re+4+30*Math.cos(a),ye-4+30*Math.sin(a)])}I.push(Se(Y,96,!0));const le=(e,a,r,v,n)=>{const C=1-n;return C*C*C*e+3*C*C*n*a+3*C*n*n*r+n*n*n*v},pe=(e,a,r,v,n)=>new t.Vector3(le(e.x,a.x,r.x,v.x,n),le(e.y,a.y,r.y,v.y,n),le(e.z,a.z,r.z,v.z,n)),ze=c.range(-1,1)*40,Ae=new t.Vector3(0,-(ye-30),re-6),Me=-19.2,ke=D(0,Me,-590),qe=D(0,Me,-12),at=Ae.clone().add(new t.Vector3(ze*1.6,250,-420)),st=ke.clone().add(new t.Vector3(ze*.6,-6,-250)),oe=.62,Le=e=>e<oe?pe(Ae,at,st,ke,e/oe):ke.clone().lerp(qe,(e-oe)/(1-oe)),Ue=e=>{const a=8.6+27*Math.pow(Math.max(0,1-e/oe),1.5)+2.2*Math.exp(-((e-1)*(e-1))/.0012);return[a*(e<oe?1.15:.92),a]};I.push(de(Le,Ue,96,14,new t.Vector3(0,0,-1),!0));let De=1/0;for(let e=0;e<=62;e++){const a=oe*e/62;De=Math.min(De,Le(a).z-Ue(a)[0])}await s.yield();for(let e=0;e<82;e++){const a=oe+(1-oe)*(.012+.975*e/81),r=Le(a),v=Ue(a)[1];I.push(Ne(r.add(new t.Vector3(0,v+.6,0)),1)),e%10===9&&await s.yield()}const je=[];for(const e of[-1,1]){const a=D(e*4,Me+1,-385),r=D(e*88,-44,-250),v=D(e*62,40,-14),n=D(e*13,50,0),C=N=>pe(a,r,v,n,N),_=N=>{const O=8.2*Math.pow(1-N,.8)+1.3;return[O,O*.85]};I.push(de(C,_,56,12,te.clone(),!0)),await s.yield(),je.push(C(1)),I.push(Ne(C(1).add(new t.Vector3(0,2,0)),1.6));const U=te.clone().multiplyScalar(.78).addScaledVector(ae,-e*.45).addScaledVector(Q,-.42).normalize();for(let N=0;N<44;N++){const O=.05+N*.021,K=C(O),A=_(O)[0];I.push(Ne(K.addScaledVector(U,A+.55),1)),N%15===14&&await s.yield()}const S=C(.9),q=D(e*(X+2.2),0,0);I.push(de(N=>S.clone().lerp(q,N).addScaledVector(te,-3*Math.sin(Math.PI*N)),()=>[.7,.7],6,6,te,!1)),await s.yield()}{const e=new t.TorusGeometry(X+1.9,1.5,10,64),a=e.attributes.uv;for(let n=0;n<a.count;n++)a.setXY(n,a.getY(n),a.getX(n)*50);e.applyMatrix4(new t.Matrix4().makeBasis(ae,te,Q).setPosition(H)),I.push(e);const r=D(0,Me+4,-9),v=D(0,-X-2.4,0);I.push(de(n=>r.clone().lerp(v,n).addScaledVector(Q,3*Math.sin(Math.PI*n)),n=>[3.2-1.6*n,2.6-1.2*n],10,8,ae,!1))}await s.yield();const We=[];for(let e=0;e<I.length;e+=16)We.push(he(I.slice(e,e+16))),await s.yield();const rt=he(We);await s.yield();const Ge=o(new t.Vector4(H.x,H.y,H.z,1)),Ce=new t.Mesh(rt,p(me,Ie,{uCh:o(3),uRibs:o(4),uMoss:o(.6),uRidge:o(3),uMist:o(0),uAmp:o(.5),uTrans:o(.5),uGild:o(.6),uFill:o(1.7),uSeat:Ge}));Ce.name="cradle",Ce.frustumCulled=!1,d.add(Ce),await s.yield();const ne=new t.Mesh(new t.RingGeometry(X+.2,X+3.6,72,1),R(dt,ft,{uSeat:Ge,uR:o(X)}));ne.geometry.applyMatrix4(new t.Matrix4().makeBasis(ae,te,Q).setPosition(H)),ne.name="ringGlow",ne.frustumCulled=!1,ne.renderOrder=6,d.add(ne);const ge=new t.Mesh(new t.PlaneGeometry(2,2),R(vt,pt,{uSeat:Ge,uR:o(X)}));ge.name="ringHalo",ge.frustumCulled=!1,ge.renderOrder=6,d.add(ge),await s.yield();const Ze=[],Qe=[1003,2204,3800],Ye=[.97,.74,.5,.27];for(let e=0;e<3;e++){const a=[];for(let v=0;v<Ye.length;v++){const n=[];for(let U=0;U<=6;U++){const S=E(W[e]+18,Qe[e]-v*6,U/6);n.push([S,be[e]*Ye[v]*S/W[e]])}const C=Se(n,48,!1),_=C.attributes.uv;for(let U=0;U<_.count;U++)_.setX(U,_.getX(U)+v*.37);a.push(C),await s.yield()}const r=new t.Mesh(he(a),R(me,kt,{uCh:o(e+1),uZ0:o(W[e]),uZ1:o(Qe[e]),uGain:o([.05,.06,.06][e]),uSoft:o(e===2?1:0)}));r.name="shaft"+(e+1),r.frustumCulled=!1,r.renderOrder=4,d.add(r),Ze.push(r),await s.yield()}await s.yield();const Ke=[];for(let e=0;e<3;e++){const a=be[e],r=W[e]+ue*.5,v=18,n=[];for(let S=0;S<=v;S++){const q=S/v,N=r+a*(-1.6+4.6*q),O=.4+.16*Math.pow(Math.abs(q-.35)/.35,1.5)*(q<.35?1:0),K=q>.35?2.3*Math.pow((q-.35)/.65,1.9):0;n.push([N,a*(O+K)])}const C=Se(n,48,!1),_=C.attributes.position.count,U=new Float32Array(_);for(let S=0;S<_;S++)U[S]=e*2+Math.floor(S/49)/v;C.setAttribute("aFace",new t.BufferAttribute(U,1)),Ke.push(C)}const xe=new t.Mesh(he(Ke),new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...h},vertexShader:ot,fragmentShader:Ct,fog:!0,side:t.DoubleSide,transparent:!0,depthWrite:!1}));xe.name="cloudBells",xe.frustumCulled=!1,xe.renderOrder=3,d.add(xe),await s.yield();const k=(e,a,r)=>new t.Vector3(e,a,r),_e=(e,a,r,v=0)=>{const n=m[Oe(e-1,0,3)],C=L(n,a),_=(L(n,a+2)-L(n,a-2))/4,U=1/Math.hypot(1,_),S=-U,q=_*U,N=Math.sin(r),O=-Math.cos(r);return{position:k((C+S*v)*N,(C+S*v)*O,a+q*v),up:k(S*N,S*O,q)}},it={sun:k(0,0,0),sunRadius:se,doors:W.map((e,a)=>({center:k(0,0,e+ue*.5),radius:be[a],z0:e-5,z1:e+ue+5,facing:k(0,0,1)})),domes:W.map((e,a)=>({doorZ:e,rimZ:e-ee[a],outerRadius:Ve[a],bulge:ee[a]})),chambers:[{z0:-170,z1:194,radius:170},{z0:120,z1:968,radius:360},{z0:830,z1:2115,radius:720},{z0:1950,z1:re,radius:1450}],wall:_e,lake:{chamber:2,z0:520,z1:780,phi0:-15*Math.PI/180,phi1:38*Math.PI/180,terracePhi1:62*Math.PI/180,radius:345},mouth:{center:k(0,0,re),radius:ye-34},spur:{root:Ae.clone(),top:ke.clone(),base:qe.clone(),neckReach:De},hornTips:je,portalSeat:{position:H.clone(),facing:Q.clone().negate(),forward:Q.clone(),radius:X},flyThrough:[k(170,6,-232),k(142,3,-112),k(98,0,22),k(20,0,165),k(0,0,218),k(0,0,330),k(0,0,1020),k(0,0,2222),k(0,0,3300),H.clone()],viewpoints:{entry:{position:k(170,6,-232),lookAt:k(40,0,100)},firstCountry:{position:k(0,0,300),lookAt:k(0,0,1010)},lakeRamp:{position:_e(2,560,.05,22).position,lookAt:_e(2,720,.6,10).position},shaft2:{position:k(40,60,760),lookAt:k(0,0,1010)},cradle:{position:D(0,0,-160),lookAt:H.clone()}},ribTips:$,bounds:{radius:1480,zMin:-420,zMax:re+320},parts:{chambers:P,domes:V,sun:i,ribs:ie,cradle:Ce,shafts:Ze,cloud:xe,ringGlow:ne,ringHalo:ge}};let Fe=u.view;if(!Fe)try{Fe=new URLSearchParams(globalThis.location?.search||"").get("view")}catch{Fe=null}const Xe={country:{c:k(0,0,640),r:100,h:110},sun:{c:k(0,0,0),r:55,h:44},door:{c:k(0,20,150),r:38,h:30},room3:{c:k(0,0,1600),r:235,h:300},room4:{c:k(0,0,2960),r:240,h:420},mouth:{c:k(H.x,H.y,2790),r:60,h:60},lake:{c:k(60,-318,650),r:11,h:20}},Ee=Xe[Fe]||Xe.country;let Je=null;const lt=new t.Matrix4,$e=new t.Vector3,nt=e=>.6+.3*we(120,420,e)+.1*we(1e3,1500,e)+.15*we(2200,2900,e);return{object:d,radius:Ee.r,height:Ee.h,center:Ee.c,anchors:it,ground:!1,groundY:0,setExposure(e){Je=e},setHaze(e){h.uHazeLen.value=e},uniforms:h,update(e,a,r){h.uTime.value=a,r&&(d.updateWorldMatrix(!0,!1),$e.setFromMatrixPosition(r.matrixWorld).applyMatrix4(lt.copy(d.matrixWorld).invert()),h.uCam.value.copy($e)),h.uExpo.value=Je??nt(h.uCam.value.z)},dispose(){}}}const Ct=Pe+`
varying float vFace;      // door index * 2 + t along the bell (0 upstream .. 1 the flared rim)
void main(){
  float k = floor(vFace * .5 + 1e-3), t = clamp(vFace - k * 2., 0., 1.);
  vec3 V = normalize(uCam - vP + vec3(1e-3, 0., 0.));
  float ndv = abs(dot(normalize(vN + vec3(0., 1e-6, 0.)), V));
  float flow = uTime * .022;
  float n1 = texture2D(uNoise, vec2(vUv.x * 3., t * 1.1 - flow)).r;
  float n2 = texture2D(uNoise, vec2(vUv.x * 7. + .3, t * 2.7 - flow * 1.7)).g;
  float n3 = texture2D(uNoise, vec2(vUv.x * 19. + .7, t * 6. - flow * 2.6)).b;
  float dens = smoothstep(.34, .78, n1 * .6 + n2 * .38 + n3 * .16 + .22 * (1. - t));
  float veil = smoothstep(.55, 1., t);                                   // the rim breaks into sinking veils
  dens *= mix(1., smoothstep(.45, .7, n2 + n3 * .4), veil);
  float a = .5 * dens * smoothstep(0., .14, t) * (1. - smoothstep(.72, 1., t)) * (.35 + .65 * ndv);
  float dc = length(uCam - vP);
  a *= smoothstep(25., 70., dc);
  // the great third bell: from inside it we look through streamers, not a wall of milk; it hangs heavier below
  float low = 1. - smoothstep(-.55, .45, vP.y / max(length(vP.xy), 1.));
  a *= mix(1., smoothstep(160., 820., dc) * (.22 + .78 * low), step(1.5, k));
  a *= 1. - .55 * step(1.5, k) * step(.34, t);      // its flare beyond the door is a thin veil, for every eye: the last room and the stars of the mouth show through it
  a *= mix(.3, 1., step(.5, k));
  a *= mix(1., smoothstep(.06, .5, ndv) * (.35 + .65 * smoothstep(60., 380., dc)), step(.5, k) * (1. - step(1.5, k)));
  a *= mix(1., smoothstep(.03, .32, ndv), step(1.5, k));      // the third bell: seen edge-on from close inside it, it thins to nothing
  float ch = k + 1.;
  float vis = sunVis(vP, ch) * step(.34, t) + (1. - step(.34, t)) * sunVis(vP, k);
  vec3 lit = keyColor(mix(k, ch, step(.34, t))) * vis * (.75 + .5 * n2) + mix(uViolet, vec3(.85, .9, 1.), .62) * .62;
  vec3 c = hazed(vec3(.93) * lit, vP) * uExpo;
  gl_FragColor = vec4(c, a);
  #include <fog_fragment>
}`;export{Pe as SHELL_LIGHT,me as SHELL_VERT,Tt as buildHero};
