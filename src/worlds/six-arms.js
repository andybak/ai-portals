import*as o from"three";import{makePath as j0,clamp as Ue,lerp as ie,smoothstep as A}from"../kit/core.js";import{buildHero as R0,makeCrystal as d0,makeIceMaterial as $0,makeSegmentGeometryAsync as Q0,SIX_ARMS_ENV_GLSL as Y0,SIX_ARMS_FOG_GLSL as X0}from"../parts/six-arms.js";const h0={golden:{mid:"#C4D6EC",hi:"#EFF8FF",lo:"#2F4A73",hollow:"#6F97CC",key:"#EFF8FF",sun:"#F0B35A",band:"#F0B35A",ceil:"#27405F",sea:"#0A1420",air:"#A9896C",elev:6,lamp:.35,fog:[.9,.8],seaMix:[3,.45,.015],sheen:.1},dawn:{mid:"#D0C6EA",hi:"#F6F0FF",lo:"#3B3A72",hollow:"#8582CC",key:"#F4ECFF",sun:"#FF9DAA",band:"#F2A0A8",ceil:"#39335E",sea:"#0C1226",air:"#B08398",elev:5,lamp:.5,fog:[.9,.8],seaMix:[3,.4,.015],sheen:.1},day:{mid:"#D2E1F2",hi:"#F2F8FF",lo:"#3C5F8E",hollow:"#6FA4DA",key:"#FFFFFF",sun:"#EEF3F8",band:"#C4D7E8",ceil:"#566F8E",sea:"#14304A",air:"#AFC4D6",elev:12,lamp:.15,fog:[.82,.74],seaMix:[1.7,.12,0],sheen:.1},night:{mid:"#52639C",hi:"#8194CC",lo:"#0E1433",hollow:"#2B3A78",key:"#C9D6FF",sun:"#DCE6FF",band:"#3D4E7C",ceil:"#141B36",sea:"#03060C",air:"#2A375C",elev:11,lamp:1,fog:[.9,.8],seaMix:[6,.6,.02],sheen:.3}},Z0="#17120E";function Z(i){const P=i.length,_=new Float64Array(P);for(let S=0;S<P;S++){const q=S>0?(i[S][1]-i[S-1][1])/(i[S][0]-i[S-1][0]):0,E=S<P-1?(i[S+1][1]-i[S][1])/(i[S+1][0]-i[S][0]):0;_[S]=S===0?E:S===P-1?q:q*E<=0?0:2*q*E/(q+E)}return S=>{if(S<=i[0][0])return i[0][1];if(S>=i[P-1][0])return i[P-1][1];let q=1;for(;i[q][0]<S;)q++;const E=i[q][0]-i[q-1][0],se=(S-i[q-1][0])/E,W=se*se,I=W*se;return(2*I-3*W+1)*i[q-1][1]+(I-2*W+se)*E*_[q-1]+(-2*I+3*W)*i[q][1]+(I-W)*E*_[q]}}const J0=`
float h21(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.y); }
float h31(vec3 p){ p = fract(p*0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y)*p.z); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(mix(h31(i), h31(i + vec3(1.0, 0.0, 0.0)), f.x), mix(h31(i + vec3(0.0, 1.0, 0.0)), h31(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
             mix(mix(h31(i + vec3(0.0, 0.0, 1.0)), h31(i + vec3(1.0, 0.0, 1.0)), f.x), mix(h31(i + vec3(0.0, 1.0, 1.0)), h31(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z); }
// 1 inside the ragged tear in the cloud base
float tearAt(vec2 pb){
  float rg = (vn2(pb*0.045) - 0.5)*uSaAtm.w*0.5;
  return (1.0 - smoothstep(uSaAtm.w*0.70, uSaAtm.w*1.05 + 0.01, length(pb - uSaHub.xz) + rg))*step(0.01, uSaAtm.w);
}
`,L=Y0+X0+`uniform float uT, uSec, uSeaY, uTipR, uLane, uSheen, uThread;
uniform vec2 uRes;
uniform vec3 uGlP, uSunDir, uSunCol, uBand, uHollow, uSaCobalt, uSaPale, uSaMid, uSeaMix;
uniform vec4 uLamp, uWx, uGl, uLaneP, uHo[3];
`+J0,v0=`
varying vec3 vW;
void main(){ vec4 w = modelMatrix*vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }
`,et=`
varying vec3 vW;
${L}
vec3 cloudBg(vec3 d){
  vec3 c = saCloudCol(d);
  // slow billows drifting upward in three sizes, the darker ones a little bluer, and the hidden sun's glow up to the left
  float b0 = vn3(d*1.1 + vec3(5.0, -uT*0.11, 2.0));
  float b = vn3(d*2.3 + vec3(0.0, -uT*0.2, 0.0))*0.6 + vn3(d*5.1 + vec3(3.0, -uT*0.36, 1.0))*0.4;
  float kd = max(dot(d, uSaKeyDir), 0.0), k4 = kd*kd*kd*kd;
  c *= 0.60 + 0.80*b + 0.34*(b0 - 0.5);
  c = mix(vec3(dot(c, vec3(0.3333))), c, 1.3);
  c = mix(c*vec3(0.82, 0.93, 1.10), c, smoothstep(0.36, 0.66, b*0.6 + b0*0.4));
  c += uSaKeyCol*(0.17*k4 + 0.05*kd*kd)*(0.5 + b);
  // (in the opening the plate stands on edge, face-on to the entry, so its clearing is round: uLane 1)
  vec3 sc = vec3(1.0, mix(2.0, 1.1, uLane), 1.0);
  vec3 oc = (cameraPosition - uSaHub.xyz)*sc, dd = d*sc; dd /= max(length(dd), 1e-4);
  // a ragged clearing, not an oval: the billows push its rim in and out
  float b9 = vn3(d*9.0 + vec3(1.0, -uT*0.5, 4.0));
  float R = uSaHub.w*1.1*(0.72 + 0.28*b0 + 0.26*b + 0.16*b9), bq = dot(oc, dd), h = bq*bq - (dot(oc, oc) - R*R), sq = sqrt(max(h, 0.0));
  float chord = max(-bq + sq, 0.0) - max(-bq - sq, 0.0);
  float cr = chord/R, hol = (1.0 - exp(-cr*cr*0.9))*smoothstep(0.0, 0.5, h/(R*R));
  hol = max(hol, (1.0 - smoothstep(0.7, 1.05, length(oc)/R))*(1.0 - smoothstep(-0.25, 0.08, d.y)));   // from inside, the hollow deepens downward
  float b2 = b*0.7 + 0.3*b9;
  vec3 hcol = uHollow*(0.62 + 0.8*b2)*mix(0.5, 1.0, smoothstep(-0.6, 0.0, d.y));
  vec3 inC = mix(c, hcol, hol*0.92);
  // every staged companion has eaten a small clearing of its own: a soft patch of the hollow's blue behind it
  for (int i = 0; i < 3; i++) {
    vec3 o2 = cameraPosition - uHo[i].xyz; float r2 = uHo[i].w*(0.75 + 0.5*b), q2 = dot(o2, d), h2 = q2*q2 - (dot(o2, o2) - r2*r2);
    // (THE PLATE'S, the first, is a ball of clear air about the plate's own place, and its blue goes by the length of
    // clear air the eye's ray crosses AHEAD of the eye: true distances from the plate and nothing else. Seen from
    // outside that is the chord through the ball, as it always was; from inside it is the way on to the ball's far
    // side, long toward the plate and short away from it, so the blue thins smoothly all round the eye as it leaves
    // and no plane through the eye cuts it. The other two keep the whole chord where the ball's middle is ahead)
    float s2 = sqrt(max(h2, 0.0)), c2 = (i == 0 ? s2 - clamp(q2, -s2, s2) : 2.0*s2*step(q2, 0.0))/max(r2, 0.1);
    inC = mix(inC, uHollow*(0.95 + 0.5*b2) + uSaMid*0.05, (1.0 - exp(-c2*c2*0.8))*0.86*step(0.5, uHo[i].w)*(1.0 - smoothstep(18.0, 45.0, length(o2))));
  }
  // Seen from outside (the opening) the clearing is a WELL in the cloud, a break with depth and no outline. Three
  // tones, each feathering into the next over a wide band whose edge the billows push in and out (two different
  // edges, so they never run parallel): the lit cloud; the cloud curling into the well, shaded blue-grey (darker
  // between its billows, and where it is the underside above the pit; the tops of the billows below it take the
  // light); the clear deep-blue air in the middle, where the far wall's billows drift a tone lighter. Wisps reach
  // across the inner edge. (rn: how far across the clearing the eye's ray passes, 0 through its middle, 1 at its rim)
  float rn = sqrt(max(dot(oc, oc) - bq*bq, 0.0))/max(uSaHub.w*1.177, 1.0) + 2.0*smoothstep(-0.30, 0.25, bq/max(length(oc), 1e-3));
  float bm = vn3(d*3.3 + vec3(7.0, -uT*0.16, 2.5));
  float r1 = rn - 0.24*(b - 0.5) - 0.10*(bm - 0.5), r2 = rn + 0.22*(bm - 0.5) + 0.12*(b - 0.5) + 0.05*(b9 - 0.5);
  float shade = 1.0 - smoothstep(0.95, 1.80, r1), deep = 1.0 - smoothstep(0.70, 1.36, r2);
  float bandK = 4.0*deep*(1.0 - deep), bandS = 4.0*shade*(1.0 - shade);
  vec3 hc = uSaHub.xyz - cameraPosition; hc /= max(length(hc), 1.0);
  vec3 e = d - hc*dot(d, hc);
  float under = clamp(0.5 - 0.9*e.y/max(length(e), 1e-4), 0.0, 1.0);
  vec3 cs = mix(c, c*vec3(0.58, 0.70, 0.93), shade*(1.0 - 0.5*under));
  cs *= mix(1.0, 0.74 + 0.52*b, 0.8*max(bandS, bandK));
  cs += uSaKeyCol*0.06*bandK*under*(0.4 + b);
  float wsp = smoothstep(0.45, 0.85, vn3(d*vec3(6.0, 11.0, 6.0) + vec3(uT*0.05, -uT*0.12, 3.0)))*bandK;
  vec3 outC = mix(cs, uHollow*(0.28 + 0.20*b2*b2) + uSaMid*0.04, deep*(1.0 - 0.45*wsp));
  return mix(inC, outC, uLane);
}
vec3 skyBelow(vec3 d){
  vec2 dh = normalize(d.xz + vec2(1e-5, 0.0)), sh = normalize(uSunDir.xz);
  float front = dot(dh, sh), sd = max(front, 0.0);
  vec3 band = uBand*(0.5 + 0.95*sd*sd);
  float t = (max(uSaAtm.z - cameraPosition.y, 0.0) + 60.0)/max(d.y, 1e-3);   // the ceiling lifts away as we drop out
  vec2 p = cameraPosition.xz + d.xz*t, ps = p + sh*45.0;
  float n = vn2(p*0.006)*0.6 + vn2(p*0.017 + 3.0)*0.4, n2 = vn2(ps*0.006)*0.6 + vn2(ps*0.017 + 3.0)*0.4;
  vec3 c = uSaCeil*(0.55 + 0.9*n) + uSunCol*0.6*clamp((n - n2)*3.5, 0.0, 1.0);
  c = mix(c, band, max(1.0 - exp(-t*0.0011), 0.92*exp(-d.y*12.0)));
  float az = atan(d.x, d.z + 1e-5);
  float v = smoothstep(0.5, 0.8, vn2(vec2(az*3.0 + sin(uT*0.2 + d.y*6.0)*0.06, 1.7)))*smoothstep(0.015, 0.1, d.y)*(1.0 - smoothstep(0.12, 0.45, d.y))*uWx.x;
  v *= 0.7 + 0.3*vn2(vec2(az*40.0, d.y*3.0 - uT*0.1));
  c = mix(c, uSaCeil*0.9 + band*0.12, v*0.6);
  float sdot = max(dot(d, uSunDir), 0.0), s8 = sdot*sdot; s8 *= s8; s8 *= s8;
  c += uSunCol*(4.0*smoothstep(0.9993, 0.9997, sdot) + 0.5*pow(sdot, 60.0) + 0.16*s8);
  float ang = acos(clamp(sdot, -1.0, 1.0)), hq = (ang - 0.384)*24.0, halo = exp(-hq*hq), dy = d.y - uSunDir.y, side = dh.x*sh.y - dh.y*sh.x;
  c += uSunCol*uWx.z*(0.25*halo + 1.3*halo*exp(-dy*dy*700.0) + 0.6*exp(-side*side*500.0)*step(0.0, front)*smoothstep(0.0, 0.04, dy)*exp(-max(dy, 0.0)*7.0));
  return c;
}
vec3 seaCol(vec3 d){
  float t = max(cameraPosition.y - uSeaY, 1.0)/max(-d.y, 1e-3);
  vec2 p = cameraPosition.xz + d.xz*t, sh = normalize(uSunDir.xz);
  float foot = t*(1.35/max(uRes.y, 240.0))/max(-d.y, 0.05), aa = clamp(11.0/foot, 0.0, 1.0);   // metres of sea under one pixel, along the view
  // three wave trains (60, 38 and 23 m) crossing at an angle: where they add up the sea stands in short lens-shaped
  // crests, never long ribbons; each train fades out before its wavelength nears the size of a pixel (gone by two
  // pixels a wave, so the far sea is smooth tone and nothing is left to weave), and the sea runs higher where the gusts are
  vec2 w1 = vec2(0.82, 0.57), w2 = vec2(0.30, 0.954), w3 = vec2(0.97, -0.24);
  float wa = vn2(p*0.0040)*5.0 + vn2(p*0.017 + 3.0)*1.6, wb = vn2(p*0.0062 + 9.0)*5.0 + vn2(p*0.021 + 13.0)*1.6;
  // (no train is everywhere: each comes and goes in patches, so the crossing never settles into a weave)
  float e1 = 0.25 + 0.75*smoothstep(0.2, 0.8, vn2(p*0.0085 + 21.0)), e2 = 0.12 + 0.88*smoothstep(0.3, 0.85, vn2(p*0.011 + 37.0)), e3 = 0.12 + 0.88*smoothstep(0.3, 0.85, vn2(p*0.014 + 53.0));
  float ph1 = dot(p, w1)*0.105 + wa - uT*0.55, ph2 = dot(p, w2)*0.165 + wb - uT*0.70, ph3 = dot(p, w3)*0.27 + wa*0.7 + wb*0.6 - uT*0.9;
  float gust = 0.5 + 0.5*smoothstep(0.25, 0.75, vn2(p*0.0025 + 5.0));
  float a1 = 0.58*clamp(10.0/foot, 0.0, 1.0)*smoothstep(2.0, 4.5, 59.8/foot)*e1, a2 = 0.36*clamp(6.3/foot, 0.0, 1.0)*smoothstep(2.0, 4.5, 38.1/foot)*e2*gust, a3 = 0.26*clamp(3.9/foot, 0.0, 1.0)*smoothstep(2.0, 4.5, 23.3/foot)*e3*gust;
  float hgt = a1*sin(ph1) + a2*sin(ph2) + a3*sin(ph3);
  vec2 g = (a1*cos(ph1)*w1*0.105 + a2*cos(ph2)*w2*0.165 + a3*cos(ph3)*w3*0.27)*2.5;
  vec3 n = normalize(vec3(-g.x, 1.0, -g.y));
  // wind chop: a fine grain in the normal (the glitter) and in the brightness
  vec2 pr = vec2(p.x*0.8 - p.y*0.6, p.x*0.6 + p.y*0.8);
  vec2 ch = vec2(vn2(pr*0.083 + uT*0.3)*0.6 + vn2(p*0.21 + 7.0)*0.4, vn2(pr.yx*0.107 + 5.0 - uT*0.27)*0.6 + vn2(pr*0.19 + 2.0)*0.4) - 0.5;
  float fch = clamp(5.0/foot, 0.0, 1.0);
  vec3 ng = normalize(n + vec3(ch.x, 0.0, ch.y)*0.55*clamp(22.0/foot, 0.0, 1.0));
  vec3 r = reflect(d, n);
  float fres = 0.03 + 0.97*pow(clamp(1.0 - dot(-d, n), 0.0, 1.0), 5.0);
  float rs = max(dot(normalize(r.xz + vec2(1e-5, 0.0)), sh), 0.0);
  vec3 skyr = mix(uBand*(0.4 + 0.8*rs*rs), uSaCeil*0.7, smoothstep(0.05, 0.5, r.y));
  vec3 c = (uSaSea*uSeaMix.x + uSaCeil*uSeaMix.y + uBand*uSeaMix.z)*(0.86 + 0.30*hgt)*(0.6 + 0.8*vn2(p*0.0016 + 2.0));
  c *= 1.0 + 0.30*ch.x*fch;
  c = mix(c, skyr, fres*0.9);
  // the slopes turned to the low sun take a little of its colour, and each crest where the trains meet carries a short glint
  c += uBand*(0.06*clamp(-dot(g, sh)*3.0, 0.0, 1.0) + 0.12*smoothstep(0.42, 0.9, hgt))*aa;
  float sp = pow(max(dot(reflect(d, ng), uSunDir), 0.0), 110.0), sp2 = max(dot(r, uSunDir), 0.0); sp2 *= sp2; sp2 *= sp2; sp2 *= sp2*sp2;
  c += uSunCol*(sp*(0.4 + 1.2*vn2(p*0.3 + uT*1.3))*4.0 + uSheen*sp2);
  // whitecaps where a crest breaks, and a scatter of small foam flecks lying along the wind
  float wc = smoothstep(0.62, 0.92, hgt + 0.35*(vn2(p*0.05 + vec2(uT*0.05, 0.0)) - 0.5))*smoothstep(0.3, 0.6, vn2(p*0.013 + 4.0));
  c = mix(c, uBand*0.2 + uSaCeil*0.5 + 0.1, wc*aa*uWx.y*0.6);
  // the skerry's surf: one thin unbroken white ring, breathing in and out, and the lighthouse beam as a faint wide wedge
  vec2 lp = p - uLamp.xz; float lr = length(lp), la = atan(lp.x, lp.y + 1e-4);
  float sr = abs(lr - 19.0 - 2.5*sin(uT*0.7 + la*3.0) - 1.5*sin(la*7.0 + 1.0));
  float surf = (1.0 - smoothstep(1.0, 5.0, sr))*smoothstep(0.25, 0.45, 0.35 + vn2(lp*0.16 + vec2(uT*0.1, 0.0))*0.6 + vn2(lp*0.45 - uT*0.2)*0.4);
  c = mix(c, vec3(0.34, 0.38, 0.42) + uBand*0.15, surf*0.8);
  float ba = la - uLamp.w; ba = atan(sin(ba), cos(ba));
  c += vec3(0.75, 0.82, 0.9)*exp(-ba*ba*14.0)*smoothstep(14.0, 50.0, lr)*(1.0 - smoothstep(110.0, 270.0, lr))*(0.04 + 0.13*uWx.w);
  float sd = max(dot(normalize(d.xz + vec2(1e-5, 0.0)), sh), 0.0);
  return mix(c, uBand*(0.35 + 0.75*sd*sd), 1.0 - exp(-t*t*5.0e-9));
}
vec3 belowBg(vec3 d){
  vec3 c = mix(seaCol(vec3(d.x, min(d.y, -1e-3), d.z)), skyBelow(vec3(d.x, max(d.y, 1e-3), d.z)), step(0.0, d.y));
  vec3 ld = uLamp.xyz - cameraPosition; float ll = length(ld); ld /= max(ll, 1.0);
  float toUs = atan(-ld.x, -ld.z) - uLamp.w; toUs = 0.5 + 0.5*cos(toUs); toUs *= toUs; toUs *= toUs; toUs *= toUs; toUs *= toUs;
  c += vec3(1.0, 0.93, 0.8)*exp(-(1.0 - max(dot(d, ld), 0.0))*5.0e4)*(1.2 + 5.0*toUs)*(0.5 + uWx.w);
  return c;
}
void main(){
  vec3 d = normalize(vW - cameraPosition);
  float cy = cameraPosition.y - uSaAtm.z;
  vec3 below = belowBg(d), cloud = cloudBg(d);
  // (while the tear is still small the sea through it is clean blue depth, not a speckled patch; as it widens the
  // rippled sea itself comes through)
  below = mix(below, uHollow*0.85 + uSaSea*1.5, 0.42*smoothstep(0.0, 8.0, cy)*(1.0 - smoothstep(30.0, 70.0, uSaAtm.w)));
  float hole = step(cy, 0.0);
  if (cy > 0.0 && d.y < -0.002) hole = tearAt(cameraPosition.xz + d.xz*(cy/(-d.y)));
  gl_FragColor = vec4(mix(cloud, below, hole), 1.0);
}
`,tt=`
varying vec3 vW;
${L}
void main(){   // the mask lies under the rags of the base; its hole is the dome's tear, projected along the view ray
  float cy = cameraPosition.y - uSaAtm.z;
  vec3 d = normalize(vW - cameraPosition);
  if (cy <= 0.0 || d.y > -0.002) discard;
  if (tearAt(cameraPosition.xz + d.xz*(cy/(-d.y))) > 0.5) discard;
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`,at=`
attribute vec3 aC; attribute float aK;
uniform vec3 uTips[12];
varying vec2 vUv; varying vec3 vCen; varying float vPx, vA;
${L}
void main(){
  float box = aK < 0.5 ? 120.0 : (aK < 1.5 ? 26.0 : 9.0), nearK = min(aK, 1.0);   // far field, near field, at the lens
  vec3 p = position*box;
  p.y += uT*2.5; p.x += sin(uT*0.7 + position.z*40.0)*0.5; p.z += cos(uT*0.6 + position.x*37.0)*0.5;
  p = cameraPosition + mod(p - cameraPosition + box*0.5, box) - box*0.5;
  float dc = distance(p, cameraPosition);
  float s = smoothstep(0.8, 1.7, dc)*(1.0 - smoothstep(box*0.40, box*0.49, dc));
  for (int i = 0; i < 12; i++) s *= smoothstep(1.0, 4.0, distance(p, uTips[i]));
  vec2 hq = p.xz - uSaHub.xz; float hy = p.y - uSaHub.y, hr = length(hq);
  s *= 1.0 - (1.0 - smoothstep(uTipR*0.8, uTipR*1.05 + 1.5, hr))*(1.0 - smoothstep(mix(3.2, 1.0, nearK), mix(5.5, 2.2, nearK), abs(hy)));
  s *= 1.0 - (1.0 - smoothstep(28.0, 38.0, hr))*step(0.0, hy)*(1.0 - smoothstep(4.0, 10.0, p.y))*(1.0 - nearK);
  s *= smoothstep(uSaAtm.z - 1.0, uSaAtm.z + 7.0, p.y + sin(p.x*0.13)*3.0);
  // the opening: a clear lane from the eye to the plate, widening with distance, so no globe sits in front of it
  // (and again on the rise off the tip, to the broken plate: uLaneP = where, how much)
  vec3 la = uLaneP.xyz - cameraPosition; float ll = max(length(la), 1.0); la /= ll;
  float al = clamp(dot(p - cameraPosition, la), 0.0, ll + 14.0);
  s *= mix(1.0, smoothstep(0.15*al + 0.3, 0.26*al + 0.75, length(p - cameraPosition - la*al)), uLaneP.w);
  float rad = mix(0.15, 0.30, aC.z)*s;
  vec4 mv = viewMatrix*vec4(p, 1.0);
  float px = rad*projectionMatrix[1][1]/max(-mv.z, 0.1)*uRes.y*0.5;
  float grow = clamp(1.3/max(px, 1e-3), 1.0, 5.0);
  mv.xy += aC.xy*rad*grow;
  vUv = aC.xy; vCen = p; vPx = px*grow; vA = step(0.02, s)/(grow*grow);
  gl_Position = projectionMatrix*mv;
}
`,ot=`
varying vec2 vUv; varying vec3 vCen; varying float vPx, vA;
${L}
void main(){
  float r2 = dot(vUv, vUv); if (r2 > 1.0) discard;
  float z = sqrt(max(1.0 - r2, 0.0));
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]), back = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
  vec3 N = normalize(right*vUv.x + up*vUv.y + back*z);
  vec3 V = normalize(cameraPosition - vCen);
  vec3 D = refract(-V, N, 0.75); if (dot(D, D) < 0.01) D = -V;
  vec3 N2 = normalize(N + D*(-2.0*dot(D, N)) + vec3(0.0, 1e-5, 0.0));
  vec3 Do = refract(D, -N2, 1.333); if (dot(Do, Do) < 0.01) Do = reflect(D, -N2);
  vec3 env = saCloudCol(Do);
  float tt = (uSaHub.y - vCen.y)/(abs(Do.y) > 1e-3 ? Do.y : 1e-3);
  vec2 q = vCen.xz + Do.xz*tt - uSaHub.xz; float rr = length(q);
  float a6 = abs(fract(atan(q.x, q.y + 1e-5)/1.0471976 + 0.5) - 0.5)*1.0471976;
  float seen = step(0.0, tt);
  env = mix(env, uHollow, (1.0 - smoothstep(uSaHub.w*0.6, uSaHub.w*1.2, rr))*seen*0.6);
  float arm = (1.0 - smoothstep(0.9, 2.4, rr*sin(a6)))*(1.0 - smoothstep(uTipR*0.9, uTipR + 0.2, rr))*seen;
  env = mix(env, uSaCobalt*0.6 + uSaPale*0.3, arm*0.8);
  float rim = 1.0 - z;
  vec3 col = mix(env*0.94, uSaCobalt*0.36, smoothstep(0.08, 0.62, rim)*0.92);   // (a broad dark rim: a globe reads against the brightest cloud)
  vec3 R = reflect(-V, N);
  col += saCloudCol(R)*(0.04 + 0.45*rim*rim*rim*rim);
  col += uSaKeyCol*2.4*smoothstep(0.984, 0.997, dot(R, uSaKeyDir));
  float a = clamp((1.0 - sqrt(r2))*vPx/1.5, 0.0, 1.0)*vA;
  vec4 f = saFogCA(vCen);
  col = mix(col, f.rgb, f.a);
  a *= 1.0 - 0.9*f.a*f.a;
  gl_FragColor = vec4(col*a, a);
}
`,st=`
attribute vec3 aC; attribute float aK;
varying vec2 vUv; varying vec3 vP; varying float vA, vS, vWy;
${L}
void main(){
  vec3 p; float size, a;
  if (aK < 0.5) {
    vec3 box = vec3(150.0, 90.0, 150.0); p = position*box; p.y += uT*4.5*(0.6 + aC.z);
    p = cameraPosition + mod(p - cameraPosition + box*0.5, box) - box*0.5; size = mix(9.0, 22.0, aC.z);
    float dc = distance(p, cameraPosition);
    a = 0.55*smoothstep(3.0, 14.0, dc)*(1.0 - smoothstep(55.0, 72.0, dc))*smoothstep(uSaAtm.z - 13.0, uSaAtm.z - 3.0, p.y);
    a *= 1.0 - 0.7*(1.0 - smoothstep(uSaHub.w*0.6, uSaHub.w*1.1, length(p.xz - uSaHub.xz)))*(1.0 - smoothstep(6.0, 16.0, abs(p.y - uSaHub.y)));
    vec3 sq = vec3(1.0, mix(2.0, 1.1, uLane), 1.0), ld = (p - cameraPosition)*sq, hc = (uSaHub.xyz - cameraPosition)*sq; float ll = max(length(ld), 1e-3); ld /= ll;
    float th = dot(hc, ld);
    a *= 1.0 - 0.95*(1.0 - smoothstep(uSaHub.w*0.72 + size*0.6, uSaHub.w*1.05 + size*0.9, length(hc - ld*th)))*step(0.0, th);   // (clear of the star itself; wisps may cross the feathered rim of the well)
    vec3 l2 = (p - cameraPosition)/max(dc, 1e-3);
    for (int i = 0; i < 3; i++) {   // (and of each staged companion's own small clearing)
      vec3 h2 = uHo[i].xyz - cameraPosition; float t2 = dot(h2, l2);
      a *= 1.0 - 0.94*(1.0 - smoothstep(uHo[i].w*0.7 + size*0.5, uHo[i].w*1.2 + size, length(h2 - l2*t2)))*step(0.0, t2)*step(0.5, uHo[i].w)*(1.0 - smoothstep(18.0, 45.0, length(h2)));
    }
  } else {
    vec2 bx = vec2(260.0); p.xz = position.xz*bx; p.xz = cameraPosition.xz + mod(p.xz - cameraPosition.xz + bx*0.5, bx) - bx*0.5;
    p.y = uSaAtm.z + (position.y - 0.5)*14.0 + sin(uT*0.2 + position.x*30.0)*1.5; size = mix(14.0, 34.0, aC.z);
    float dc = distance(p, cameraPosition);
    a = 0.5*smoothstep(2.0, 12.0, dc)*(1.0 - smoothstep(100.0, 128.0, dc));
    a *= smoothstep(34.0, 50.0, length(p.xz - uSaHub.xz));
    // in the opening no rag of the far base may stand behind the plate: the hollow stays a dark shape
    vec3 sq = vec3(1.0, mix(2.0, 1.1, uLane), 1.0), ld = (p - cameraPosition)*sq, hc = (uSaHub.xyz - cameraPosition)*sq; ld /= max(length(ld), 1e-3);
    float th = dot(hc, ld);
    a *= 1.0 - (1.0 - smoothstep(uSaHub.w*0.6 + size*0.5, uSaHub.w*1.15 + size, length(hc - ld*th)))*step(0.0, th)*(1.0 - smoothstep(5.0, 9.0, uSec));
  }
  vec4 mv = viewMatrix*vec4(p, 1.0);
  vec2 off = aC.xy*size*vec2(1.0, aK > 0.5 ? 0.45 : 0.8);
  mv.xy += off;
  vWy = p.y + viewMatrix[1][0]*off.x + viewMatrix[1][1]*off.y;
  vUv = aC.xy; vP = p; vA = a; vS = aC.z + aK;
  gl_Position = projectionMatrix*mv;
}
`,nt=`
varying vec2 vUv; varying vec3 vP; varying float vA, vS, vWy;
${L}
void main(){
  float r = length(vUv);
  float n = vn2(vUv*2.2 + vS*17.0 + vec2(0.0, -uT*0.05))*0.6 + vn2(vUv*5.0 + vS*5.0)*0.4;
  float a = smoothstep(0.0, 0.55, (1.0 - r) - n*0.55)*(1.0 - smoothstep(0.6, 1.0, max(abs(vUv.x), abs(vUv.y))))*vA;
  // seen from above, every wisp dissolves before it meets the depth floor under the base: no line in the cloud
  a *= mix(smoothstep(uSaAtm.z - 12.5, uSaAtm.z - 5.0, vWy), 1.0, 1.0 - smoothstep(uSaAtm.z - 1.0, uSaAtm.z + 2.0, cameraPosition.y));
  if (a < 0.003) discard;
  vec3 d = normalize(vP - cameraPosition);
  float seed = fract(vS*7.31);
  float kd = max(dot(d, uSaKeyDir), 0.0);
  vec3 c = saCloudCol(d)*(0.74 + 0.52*seed)*(1.0 + 0.5*kd*kd);
  float below = 1.0 - smoothstep(uSaAtm.z - 4.0, uSaAtm.z + 4.0, cameraPosition.y);
  vec2 sh = normalize(uSunDir.xz);
  vec3 cb = uSaCeil*(0.8 + 0.5*n) + uSunCol*0.45*smoothstep(0.2, 0.9, r)*max(dot(vUv, vec2(0.0, -1.0)), 0.0) + uSunCol*0.12*max(dot(normalize(d.xz + vec2(1e-5, 0.0)), sh), 0.0);
  c = mix(c, cb, below);
  gl_FragColor = vec4(c*a, a);
}
`,it=`
attribute vec3 aC; attribute float aK;
uniform vec3 uTips[12];
uniform vec4 uCo[6];
varying vec2 vUv; varying float vI; varying vec3 vP;
${L}
void main(){
  vec3 p = uGlP; float size = 2.6, I = uGl.x, far = 0.03;
  if (aK > 12.5) {
    vec4 co = uCo[int(aK - 12.5)];
    p = co.xyz; size = 1.0; I = co.w; far = 0.05;
  } else if (aK > 0.5) {
    p = uTips[int(aK - 0.5)];
    float spine = step(aK, 6.5), tw = 0.7 + 0.3*sin(uT*2.3 + aK*1.7);
    size = mix(0.75, 1.25, spine); I = (uGl.y*tw + uGl.z)*mix(0.55, 1.0, spine)*uGl.w; far = 0.035;
  }
  vec4 mv = viewMatrix*vec4(p, 1.0);
  mv.xyz *= 1.0 - 0.6/max(length(mv.xyz), 1.2);   // a hand's width toward the eye, clear of the facet it sits on
  size *= max(1.0, -mv.z*far);                 // never under a few pixels far off
  mv.xy += aC.xy*size;
  vUv = aC.xy; vI = I; vP = p;
  gl_Position = projectionMatrix*mv;
}
`,rt=`
varying vec2 vUv; varying float vI; varying vec3 vP;
${L}
void main(){
  float r = length(vUv); vec2 q = abs(vUv);
  float v = 3.0*exp(-r*r*70.0) + 0.9*(exp(-q.x*42.0 - q.y*5.5) + exp(-q.y*42.0 - q.x*5.5)) + 0.02*exp(-r*r*7.0);
  v *= (1.0 - smoothstep(0.65, 1.0, r))*vI;
  if (v < 0.004) discard;
  vec4 f = saFogCA(vP);
  gl_FragColor = vec4(mix(uSaKeyCol, uSunCol*1.2, uSaBelow)*v*(1.0 - 0.7*f.a), 0.0);
}
`,lt=`
attribute vec3 aC; attribute float aK;
uniform vec3 uTips[12];
varying vec2 vUv; varying vec3 vP; varying float vA;
${L}
vec3 thAt(vec3 tip, vec3 dir, vec3 side, float len, float f){ float q = 1.0 - f; return tip + dir*(0.35 + len*q) + side*(len*0.30*sin(f*3.1416)) + vec3(0.0, 0.5*q*q, 0.0); }
void main(){
  float seed = aC.z, piece = floor(aK/16.0 + 0.01), w = (piece + (aC.x > 0.0 ? 1.0 : 0.0))/3.0;   // 0 at the wisp's tail, 1 at its head
  vec3 tip = uTips[int(clamp(aK - piece*16.0, 0.0, 11.0))];
  vec3 dir = normalize(position*2.0 - 1.0 + vec3(0.0, 0.25, 1e-3));
  vec3 side = cross(dir, vec3(0.0, 1.0, 0.0)) + vec3(1e-3, 0.0, 0.0); side /= max(length(side), 1e-4);
  float len = mix(2.6, 4.6, seed), cyc = uT*mix(0.22, 0.34, fract(seed*13.0)) + seed*7.0, f = fract(cyc);
  float fa = clamp(f - (1.0 - w)*mix(0.14, 0.22, fract(seed*29.0)), 0.0, 1.0);
  vec3 p = thAt(tip, dir, side, len, fa), p2 = thAt(tip, dir, side, len, fa + 0.03);
  vec4 mv = viewMatrix*vec4(p, 1.0), mv2 = viewMatrix*vec4(p2, 1.0);
  vec3 pe = cross(mv2.xyz - mv.xyz, mv.xyz); pe /= max(length(pe), 1e-5);
  float px = max(-mv.z, 0.1)/(projectionMatrix[1][1]*max(uRes.y, 1.0)*0.5);   // metres under a pixel here
  mv.xyz += pe*aC.y*max(0.08, 1.6*px);   // never under three pixels across: it thins by fading, not by narrowing
  vUv = vec2(w, aC.y); vP = p;
  vA = 0.26*smoothstep(0.0, 0.25, f)*(1.0 - smoothstep(0.78, 1.0, f))*uThread*(1.0 - uSaBelow)*smoothstep(4.0, 9.0, -mv.z)*(1.0 - smoothstep(15.0, 24.0, -mv.z))*min(1.0, 0.05/px)
    *step(0.4, fract(seed*37.0 + floor(cyc)*0.37));   // (never at the lens; on each pass some rest while others stream)
  gl_Position = projectionMatrix*mv;
}
`,ct=`
varying vec2 vUv; varying vec3 vP; varying float vA;
${L}
void main(){
  float e = 1.0 - abs(vUv.y);
  float a = vA*e*e*smoothstep(0.0, 0.6, vUv.x)*(1.0 - smoothstep(0.8, 1.0, vUv.x));
  if (a < 0.003) discard;
  vec4 f = saFogCA(vP);
  a *= 1.0 - 0.8*f.a;
  vec3 d = normalize(vP - cameraPosition);
  vec3 fc = saCloudCol(d);   // (a little of the key on top, in proportion to the fog's own brightness: never white needles at night)
  gl_FragColor = vec4(mix(fc*1.1 + uSaKeyCol*0.30*clamp(dot(fc, vec3(0.5)), 0.2, 1.0), f.rgb, f.a)*a, a);
}
`,ut=`
attribute vec3 aC; attribute float aK;
varying vec2 vUv; varying vec3 vP; varying float vS, vBig;
${L}
void main(){
  vec3 p = position; float big = step(9.0, aK), seed = aC.z;
  p.y += sin(uT*0.3 + seed*40.0)*1.5;
  vec4 mv;
  if (big > 0.5) {
    float an = uT*0.12*(seed - 0.5)*4.0 + seed*6.283, c = cos(an), s = sin(an);
    vec2 q = vec2(aC.x*c - aC.y*s, aC.x*s + aC.y*c)*aK;
    p += vec3(q.x, sin(uT*0.5 + seed*31.0)*0.04*q.x, q.y);
    mv = viewMatrix*vec4(p, 1.0);
  } else {
    mv = viewMatrix*vec4(p, 1.0);
    float px = aK*projectionMatrix[1][1]/max(-mv.z, 0.1)*uRes.y*0.5;
    mv.xy += aC.xy*aK*max(1.0, 1.6/max(px, 1e-3));
  }
  vUv = aC.xy; vP = p; vS = seed; vBig = big;
  gl_Position = projectionMatrix*mv;
}
`,dt=`
varying vec2 vUv; varying vec3 vP; varying float vS, vBig;
${L}
void main(){
  float r = length(vUv), an = atan(vUv.x, vUv.y + 1e-5);
  float a6 = abs(fract(an/1.0471976 + 0.5) - 0.5)*1.0471976;
  float along = r*cos(a6), across = r*sin(a6);
  float fw = fwidth(r)*1.5 + 1e-4;
  float kind = fract(vS*13.7);
  float spine = 1.0 - smoothstep(0.012 + 0.016*kind, 0.012 + 0.016*kind + fw, across);
  float k = mix(5.0, 9.0, fract(vS*5.3)), cell = fract(along*k) - 0.5;
  float br = 1.0 - smoothstep(0.013, 0.013 + fw, abs(across - (0.5 - abs(cell))*0.9/k*mix(1.0, 2.6, kind)));
  br *= step(0.12, along)*(1.0 - smoothstep(0.1, max(0.34*(1.15 - along), 0.11), across));
  float sector = 1.0 - smoothstep(0.16*kind + 0.02, 0.16*kind + 0.02 + fw, across - along*0.18*kind);
  float plate = 1.0 - smoothstep(0.3 + 0.3*kind, 0.3 + 0.3*kind + fw, along);
  float web = (1.0 - smoothstep(0.03, 0.16, across - (0.93 - along)*0.5))*step(0.25, kind);   // the thin glass between the ribs
  float edge = (1.0 - smoothstep(0.012, 0.012 + fw, abs(along - 0.3 - 0.3*kind)))*step(across, 0.5);
  spine = max(spine, edge*0.8);
  float m = max(max(max(spine, br), web), max(plate, sector*step(0.55, kind)))*(1.0 - smoothstep(0.93, 0.93 + fw, along*mix(1.0, 1.12, a6)));
  // (far glitter: a small six-rayed star, never a round disc)
  float sm = max(1.0 - smoothstep(0.16, 0.34, r), 0.85*(1.0 - smoothstep(0.05, 0.13 + fw*1.2, across))*(1.0 - smoothstep(0.55, 1.0, r)));
  m = mix(sm, m, vBig);
  if (m < 0.01) discard;
  // thin glass: a dark, see-through body with pale ribs, flaring as the plate turns through the sun's mirror angle
  vec3 V = normalize(cameraPosition - vP);
  vec3 N = normalize(vec3(sin(uT*0.7 + vS*40.0)*0.45, 1.0, cos(uT*0.6 + vS*31.0)*0.45));
  if (dot(N, V) < 0.0) N = -N;
  float gl = max(dot(reflect(-V, N), uSunDir), 0.0); gl *= gl; gl *= gl; gl *= gl;
  float rib = max(spine, br)*vBig;
  vec3 col = mix(uSaCobalt*0.3 + uSaMid*0.08 + uBand*0.05, uSaPale*0.5 + uSunCol*0.14, rib*0.85);
  // (a big plate flashes along its ribs only, a thin six-rayed line drawing in the sun's colour, never a filled blob)
  // (and a plate too far off for its ribs to be a pixel wide hardly flashes at all: it would be a white speckle)
  col += uSunCol*min(2.4*gl*gl + 0.5*gl, mix(2.9, 1.2, vBig))*(mix(0.35, 0.03, vBig) + mix(0.65, 0.97, vBig)*rib + 0.4*(1.0 - vBig))*mix(1.0, clamp(0.016/fw, 0.12, 1.0), vBig);
  // (the far glitter is cool and pale until a flake turns through the sun: then one short flash of its colour)
  col += (1.0 - vBig)*(uSaPale*0.34 + uSaMid*0.10 + uSunCol*1.5*smoothstep(0.75, 1.0, sin(uT*1.7 + vS*90.0)));
  vec4 f = saFogCA(vP);
  col = mix(col, f.rgb, f.a);
  float a = m*mix(0.85, clamp(0.42 + 0.4*rib, 0.0, 0.95), vBig)*(1.0 - 0.6*f.a);
  a *= 1.0 - 0.92*smoothstep(uSaAtm.z + 1.0, uSaAtm.z + 9.0, cameraPosition.y)*(1.0 - smoothstep(30.0, 70.0, uSaAtm.w));   // from inside the cloud a small tear shows clean sea, not specks
  gl_FragColor = vec4(col*a, a);
}
`,K=new o.Vector3(0,1,0),Ee=new o.Vector3(0,0,1),Ae=-10;var pt={id:"six-arms",name:"Six Arms",category:"sky",weirdness:.35,media:["air","tiny"],async build(i){const P=i.rng,_=i.quality?.detail??1,S=i.vary||{},q=P.pick(["golden","golden","dawn","day","night","golden","dawn"]),E=P.pick(["fern","fern","sector","plate"]),se=P.chance(.5),W=P.chance(.55),I=P.chance(.5),v=h0[h0[S.hour]?S.hour:q],p0=!!S.rare,Le=Ue(S.density??1,.7,1.3),F=(e,t=1)=>new o.Color(e).multiplyScalar(t),D=new o.Scene;D.background=F(v.mid,.8),D.fog=new o.FogExp2(F(v.mid),.018);const m0=F(v.mid),f0=F(v.air),M=await R0(i,{palette:[v.mid,v.hollow,v.lo,v.key,Z0,v.sun,v.sea],habit:E,rime:se?"heavy":"clean"});D.add(M.object),await i.yield();const Me=v.elev*Math.PI/180,Ke=new o.Vector3(-.087*Math.cos(Me),Math.sin(Me),.996*Math.cos(Me)).normalize(),w0=new o.Vector3(.35,.77,-.55).normalize();M.setEnv({fogHi:F(v.hi,v.fog[1]),fogLo:F(v.lo,.8),keyDir:w0,keyCol:F(v.key),goldDir:Ke,goldCol:F(v.sun),sea:F(v.sea),ceil:F(v.ceil)}),M.uniforms.uSaAir.value.set(v.air),M.uniforms.uSaFogMid.value.set(v.mid).multiplyScalar(v.fog[0]),M.uniforms.uSaHollow.value.set(v.hollow).multiplyScalar(.42);const Ie=-105,g0=.08,y0=.3,x0=[[34,0],[35,.05],[38.4,.78],[39.7,1.05],[40.6,1.14],[43,1.06],[46,Math.PI/3]],Ce=[[27,-52,60,-14],[36,-50,12.5,-12],[40,-46,-10.5,-10],[42.47,-31,-24.5,-3],[44.66,-26,-41,0],[46.42,-34,-52,5],[48.17,-45,-62,8],[50.5,-58,-76,11],[58.1,-85,-118,18]],Ge=new o.Quaternion().setFromAxisAngle(Ee,Math.PI/6).multiply(new o.Quaternion().setFromAxisAngle(K,Math.PI/3)),b0=M.anchors.notch.position.clone().applyQuaternion(Ge).add(new o.Vector3(0,Ie,0)),re=M.anchors.notch.normal.clone().applyQuaternion(Ge).negate(),$=e=>b0.clone().addScaledVector(re,36-e).toArray(),le=[[-63.5,5,3,0],[-34,5,5.5,4],[-17.5,9,10.5,6.3],[-8,13.5,16,7.6],[3,17.5,22,9.4],[16,17,17,11.2],[23,14.5,5.5,13.1],[23.5,11,-7,15],[16,8,-15.5,16.8],[8.5,6.8,-19.5,18.4],[3,6.2,-19.5,19.4],[-.5,5,-15.5,20.4],[0,4.2,-8.5,21.45],[0,2.9,-3,22.35],[0,2.75,0,22.9],[0,2.7,6,24.4],[0,2.55,14,26.4],[0,2.4,22,28.3],[0,2.35,29,30.15],[.5,2.8,33.5,31.25],[4,3.7,37.2,32.5],[10,5.6,38.6,33.8],[16.5,10.5,35.5,35.1],[20.5,19.5,24.5,36.6],[20,24.5,11.5,38],[26.1,5,-4.6,40.2],[16.7,-12,-19.9,42.35],[-.9,-23,-24.5,44.4],[-15.1,-31.5,-16.7,46.2],[-18.5,-36.5,-6.5,47.37],[-14.5,-40,-1.2,48.1],[-9,-44,0,48.75],[...$(76),50.5],[...$(60),52.1],[...$(36),54.5],[...$(0),58.1]];await i.yield();const N=j0(le.map(e=>[e[0],e[1],e[2]]));await i.yield();const ce=[];{const t=new o.Vector3;let s=0;for(const a of le){await i.yield();let n=1e9,u=s;for(let r=s;r<=2400;r++){N.pointAt(r/2400,t);const l=(t.x-a[0])**2+(t.y-a[1])**2+(t.z-a[2])**2;if(l<n)n=l,u=r;else if(l>n+900)break}ce.push(u/2400+ce.length*1e-7),s=u}}ce[ce.length-1]=1,await i.yield(),await i.yield();const ue=le[le.length-1][3],S0=Z(ce.map((e,t)=>[e,le[t][3]])),Q=e=>S0(Ue(e,0,1)),z0=e=>{const t=Math.max(0,e-.004),s=Math.min(1,e+.004);return Ue((s-t)*ue/Math.max(Q(s)-Q(t),1e-4),.35,2.5)},T=e=>{let t=0,s=1;for(let a=0;a<30;a++){const n=(t+s)/2;Q(n)<e?t=n:s=n}return(t+s)/2},de=Z([[34,0],[37.7,-4],[40.2,-17],[42.35,-31],[44.4,-46],[46.2,-61],[48.75,-86],[50.5,-102],[51.8,Ie]]),A0=Z(x0),Pe=Z([[0,2.9],[.25,3.4],[.6,3.9],[1,8],[1.17,8.45],[2,8.9],[2.3,9.3],[3.5,10.6],[4.7,11.95],[7.4,13.2],[9.85,13.9],[13,14.6],[15.7,15.6],[19,17.2],[22.9,20.4],[30.15,29.85],[31.5,31.5],[ue,ue]]),Fe=[1.4,3.4,...M.burstTimes].map(e=>{let t=0,s=ue;for(let a=0;a<26;a++){const n=(t+s)/2;Pe(n)<e?t=n:s=n}return s}),M0=Z(Ce.map(e=>[e[0],e[1]])),C0=Z(Ce.map(e=>[e[0],e[2]])),P0=Z(Ce.map(e=>[e[0],e[3]]));await i.yield();const F0=Z([[36.2,0],[37.3,28],[38.4,56],[40.5,82],[42,150],[43,500],[44,4e3]]),we=$(0)[1]-520,J=new o.Vector3(560,we+40,-250),ke=[];for(let e=0;e<12;e++)ke.push(new o.Vector3(0,0,3));const Ve=[];for(let e=0;e<6;e++)Ve.push(new o.Vector4(0,0,0,0));const y={...M.uniforms,uT:{value:0},uSec:{value:0},uSeaY:{value:we},uTipR:{value:3},uRes:{value:new o.Vector2(800,450)},uLane:{value:1},uThread:{value:0},uHo:{value:[new o.Vector4(0,0,0,0),new o.Vector4(0,0,0,0),new o.Vector4(0,0,0,0)]},uLaneP:{value:new o.Vector4(0,0,0,1)},uSheen:{value:v.sheen},uGlP:{value:new o.Vector3},uCo:{value:Ve},uSunDir:{value:Ke},uSunCol:{value:F(v.sun)},uBand:{value:F(v.band)},uHollow:{value:F(v.hollow,.42)},uLamp:{value:new o.Vector4(J.x,J.y,J.z,0)},uWx:{value:new o.Vector4(W?1:.25,W?1:.2,p0?1:0,v.lamp)},uTips:{value:ke},uSeaMix:{value:new o.Vector3(...v.seaMix)},uGl:{value:new o.Vector4(0,0,0,0)}},he=(e,t,s)=>new o.ShaderMaterial({uniforms:y,vertexShader:e,fragmentShader:t,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:o.DoubleSide}),ve=async(e,t)=>{const s=new Float32Array(e*12),a=new Float32Array(e*12),n=new Float32Array(e*4),u=new Uint32Array(e*6),r=[0,0,0,0,0];for(let h=0;h<e;h++){h%500===499&&await i.yield(),t(h,r);for(let x=0;x<4;x++){const m=h*4+x;s[m*3]=r[0],s[m*3+1]=r[1],s[m*3+2]=r[2],a[m*3]=x&1?1:-1,a[m*3+1]=x&2?1:-1,a[m*3+2]=r[3],n[m]=r[4]}const c=h*4,d=h*6;u[d]=c,u[d+1]=c+1,u[d+2]=c+2,u[d+3]=c+2,u[d+4]=c+1,u[d+5]=c+3}const l=new o.BufferGeometry;return l.setAttribute("position",new o.BufferAttribute(s,3)),l.setAttribute("aC",new o.BufferAttribute(a,3)),l.setAttribute("aK",new o.BufferAttribute(n,1)),l.setIndex(new o.BufferAttribute(u,1)),l.boundingSphere=new o.Sphere(new o.Vector3,1/0),l},pe=(e,t,s)=>{const a=new o.Mesh(e,t);return a.frustumCulled=!1,a.renderOrder=s,D.add(a),a},ge=new o.Mesh(new o.SphereGeometry(3e3,32,20),new o.ShaderMaterial({uniforms:y,vertexShader:v0,fragmentShader:et,side:o.BackSide,depthWrite:!1,depthTest:!1}));ge.renderOrder=-10,ge.frustumCulled=!1,D.add(ge);const ye=new o.Mesh(new o.CircleGeometry(3600,48).rotateX(-Math.PI/2),new o.ShaderMaterial({uniforms:y,vertexShader:v0,fragmentShader:tt,side:o.DoubleSide,colorWrite:!1}));ye.position.y=Ae-13,ye.renderOrder=-9,ye.frustumCulled=!1,D.add(ye),await i.yield();const xe=P.fork("drops"),_e=100,We=Math.round(700*_)+_e,k0=Math.round(5e3*_*Le)+We;pe(await ve(k0,(e,t)=>{t[0]=xe(),t[1]=xe(),t[2]=xe(),t[3]=xe(),t[4]=e<_e?2:e<We?1:0}),he(at,ot),3),await i.yield(),pe(await ve(19,(e,t)=>{t[0]=0,t[1]=0,t[2]=0,t[3]=0,t[4]=e}),he(it,rt),4);const be=P.fork("wisps"),Ne=Math.round(380*_),V0=Ne+(W?150:80);pe(await ve(V0,(e,t)=>{t[0]=be(),t[1]=be(),t[2]=be(),t[3]=be(),t[4]=e<Ne?0:1}),he(st,nt),2),await i.yield();const C=P.fork("company"),q0=$0({...M.uniforms,uSaHubS:{value:1},uSaRod:{value:1},uSaOpen:{value:0}});await i.yield();const ne=(e,t,s,a,n,u,r,l)=>({ox:e,oz:t,dx:s,dz:a,rings:n,tip:u,profile:r,birth:-100,dur:1,seed:C(),level:l}),Oe=()=>{const e=[],t=[],s=[],a=[],n=[],u=[];let r=0;return{quad(l,h,c,d,x,m,z,p,k,U){[l,h,c,d].forEach((f,w)=>{e.push(f[0],f[1],f[2]),t.push(0,0,-100,1),s.push(0,1,U,k),a.push(x[w],m[w],z,p),n.push(0,0,1)}),u.push(r,r+1,r+2,r,r+2,r+3),r+=4},geo(){const l=new o.BufferGeometry,h=(c,d)=>new o.BufferAttribute(new Float32Array(c),d);return l.setAttribute("position",h(e,3)),l.setAttribute("aOrg",h(t,4)),l.setAttribute("aAx",h(s,4)),l.setAttribute("aSeg",h(a,4)),l.setAttribute("aPl",h(n,3)),l.setIndex(u),l}}},Se=[0,1,2,3,4,5,6].map(e=>[Math.cos(e*Math.PI/3),Math.sin(e*Math.PI/3)]),G=[0,0,0,0],je=()=>{const e=Oe(),t=.42;for(let s=0;s<7;s++){const a=s?1:0,n=s*Math.PI/3+.3,u=2*t*C.range(1.05,1.5),r=a*Math.cos(n)*u,l=a*Math.sin(n)*u*.9,h=a*Math.cos(n)*C.range(.02,.11),c=a*Math.sin(n)*C.range(.02,.11),d=s?C.range(4,9):10,x=s?C.range(-2,2):0,m=C(),z=t*C.range(.8,1.05),p=x-d/2,k=x+d/2,U=z*.87,f=(w,V,H)=>[r+h*(V-x)+Se[w][0]*z*H,l+c*(V-x)+Se[w][1]*z*H,V];for(let w=0;w<6;w++){e.quad(f(w,p,1),f(w+1,p,1),f(w+1,k,1),f(w,k,1),[0,0,d,d],[-1,1,1,-1],U,.3,1,m);for(const[V,H]of[[k,-1],[p,1]]){const b=V+H*.9;e.quad(f(w,V,1),f(w+1,V,1),f(w+1,V,.6),f(w,V,.6),G,[.1,.1,.7,.7],U,.3,1,m),e.quad(f(w,V,.6),f(w+1,V,.6),f(w+1,b,.6),f(w,b,.6),[0,0,.9,.9],[.8,.8,1,1],U,.3,1,m),e.quad(f(w,b,.6),f(w+1,b,.6),f(0,b,0),f(0,b,0),G,[1,1,1,1],U,.3,1,m)}}}return e.geo()},Re=(e=4.6,t=1.5,s=.42,a=.34)=>{const n=Oe(),u=C(),r=(c,d,x)=>[Se[c][1]*x,d,Se[c][0]*x];for(const c of[1,-1]){const d=c*e/2,x=d-c*.07,m=d-c*a,z=C();for(let p=0;p<6;p++)n.quad(r(p,d,t*.93),r(p+1,d,t*.93),[0,d,0],[0,d,0],G,G,a/2,t,3,z),n.quad(r(p,d,t*.93),r(p+1,d,t*.93),r(p+1,x,t),r(p,x,t),G,G,a/2,t,3,z),n.quad(r(p,x,t),r(p+1,x,t),r(p+1,m,t),r(p,m,t),G,G,a/2,t,3,z),n.quad(r(p,m,t),r(p+1,m,t),[0,m,0],[0,m,0],G,G,a/2,t,3,z)}const l=-e/2+a,h=e/2-a;for(let c=0;c<6;c++)n.quad(r(c,l,s),r(c+1,l,s),r(c+1,h,s),r(c,h,s),[0,0,h-l,h-l],[-1,1,1,-1],s,.4,1,u);return n.geo()},ee=async(e,t,s)=>{const a=[],n=Math.max(.07,e*.024),u=e*(t===1?.22:.14);a.push(ne(0,-u,0,1,[{a:0,w:.02,h:n*1.15},{a:u*.5,w:u*.866,h:n*1.15},{a:u*1.5,w:u*.866,h:n*1.15}],u*2,1,1));for(let l=0;l<6;l++){const h=l*Math.PI/3,c=Math.sin(h),d=Math.cos(h),x=e*(s&&l===2?.45:s&&l===4?.72:1),m=u*.7,z=x-m;if(t===1){if(a.push(ne(c*m,d*m,c,d,[{a:0,w:e*.08,h:n},{a:z*.32,w:e*.19,h:n},{a:z*.6,w:e*.19,h:n*.9},{a:z*.74,w:e*.11,h:n*.8}],z,1,0)),x>e*.8)for(const k of[-1,1]){const U=h+k*Math.PI/3,f=.62,w=e*.15;a.push(ne(c*e*f+d*k*w,d*e*f-c*k*w,Math.sin(U),Math.cos(U),[{a:0,w:e*.035,h:n*.7},{a:e*.09,w:e*.03,h:n*.65}],e*.17,2,1))}continue}const p=e*(t===2?.05:.036);a.push(ne(c*m,d*m,c,d,[{a:0,w:p,h:n},{a:z*.84,w:p*.8,h:n*.9},{a:z*.9,w:p*1.35,h:n*.85}],z,1,0));for(const k of t===2?[.4,.64]:[.2,.31,.42,.53,.64,.75,.86])if(x>e*(k+.1))for(const U of[-1,1]){const f=h+U*Math.PI/3,w=Math.sin(f),V=Math.cos(f),H=e*Math.min(.85*k,.62*(1.02-k))*(t===2?.8:1),b=c*e*k,g=d*e*k;if(a.push(ne(b,g,w,V,[{a:0,w:p*.62,h:n*.8},{a:H*.78,w:p*.5,h:n*.7},{a:H*.86,w:p*.82,h:n*.7}],H,2,1)),t===0&&H>e*.19)for(const fe of[.42,.7]){const u0=Math.min(H*.36,e*.085);a.push(ne(b+w*H*fe,g+V*H*fe,c,d,[{a:0,w:p*.42,h:n*.6},{a:u0*.7,w:p*.36,h:n*.55}],u0,2,2))}}}await i.yield();const r=await Q0(i,a);return await i.yield(),r},me=[11,10,-10.5],O=[11,4.6,48.5],j=[10.5,7.8,30.5],$e=[14.5,.6,32.5],qe=[],B=new o.Vector3,Qe=new o.Vector3,Te=new o.Vector3,He=new o.Vector3,Ye=(e,t,s,a,n,u)=>{const r=T(e),l=N.pointAt(r,new o.Vector3);N.tangentAt(r,B),Qe.set(0,de(e),0).sub(l).normalize(),Te.copy(B).multiplyScalar(1-n).addScaledVector(Qe,n).normalize(),He.crossVectors(Te,K).normalize(),l.addScaledVector(Te,t).addScaledVector(He,s).addScaledVector(K,a);for(let h=0;h<14&&N.distanceTo(l.x,l.y,l.z)<u;h++)l.addScaledVector(He,Math.sign(s||1)*1.2).addScaledVector(K,.5);return l},Xe=(e,t)=>N.pointAt(T(t),new o.Vector3).sub(B.set(...e)).normalize().toArray(),te=(e,t,s,a,n,u,r,l,h)=>{const c=new o.Mesh(e,q0);return c.position.copy(t),c.rotation.set(s,a,n),c.userData.tag=h,D.add(c),qe.push({m:c,y:t.y,spin:u,ph:C.range(0,6.28),gl:new o.Vector3(...r),q:l?new o.Quaternion().setFromUnitVectors(K,new o.Vector3(...l).normalize()):null}),c},Ze=[0,.42,1.2],Je=[0,2.34,1.3],ae=e=>[0,e*.04,e*.5];te(I?await ee(2.2,2,!1):je(),Ye(4,3,-14,5,0,7),.35,1.9,1.1,.11,I?ae(2.2):Ze,null,"needles"),await i.yield(),te(I?await ee(2.8,0,!0):Re(),new o.Vector3(...me),.5,.4,.9,.22,I?ae(2.8):Je,null,"column"),await i.yield(),te(await ee(3.5,1,!0),new o.Vector3(...j),0,0,0,.5,ae(3.5),Xe(j,32.4),"plate"),await i.yield(),te(await ee(3.5,0,!1),new o.Vector3(...O),0,0,0,.1,ae(3.5),Xe(O,31),"fern30"),await i.yield(),te(await ee(3.5,0,!1),new o.Vector3(...$e),.9,.3,.4,.14,ae(3.5),[-.85,.5,.1],"fern31"),await i.yield(),te(await ee(2.2,0,!1),Ye(27.5,12,6,4.5,0,6.5),.7,.5,.5,.16,ae(2.2),null,"skimstar"),await i.yield();for(let e=0;e<6;e++){const t=C.range(0,6.28),s=C.range(24,46),a=new o.Vector3(Math.sin(t)*s,C.range(6,26),Math.cos(t)*s);for(let u=0;u<10&&(N.distanceTo(a.x,a.y,a.z)<8||a.distanceTo(B.set(...j))<9||a.distanceTo(B.set(...$e))<10||a.distanceTo(B.set(...O))<10||a.distanceTo(B.set(...me))<8);u++)a.y+=2.5;const n=C.range(1.6,2.8);te(e%3===0?Re(3.4,1.1,.32,.26):e%3===1?je():await ee(n,e===5?1:2,e===5),a,C.range(-.8,.8),C.range(0,6.28),C.range(-.8,.8),C.range(.08,.3),e%3===0?Je:e%3===1?Ze:ae(n),null,"rnd"+e),await i.yield()}y.uHo.value[0].set(j[0],j[1],j[2],9),I||y.uHo.value[1].set(me[0],me[1],me[2],6.5),y.uHo.value[2].set(O[0]+1,O[1]-8,O[2]+4,7.5);const ze=C;pe(await ve(Math.round(80*_)*3,(e,t)=>{const s=e%3,a=(e-s)/3;s===0&&(t[0]=ze(),t[1]=ze(),t[2]=ze(),t[3]=ze()),t[4]=(a%3===2?6+a%6:a%6)+16*s}),he(lt,ct),3),await i.yield();const Y=P.fork("flakes"),e0=60,T0=e0+Math.round(2600*_*Le),H0=new o.Vector3().fromArray($(76));pe(await ve(T0,(e,t)=>{const s=e<e0;for(let a=0;a<12;a++){const n=Y.range(0,6.283),u=s?Y.range(70,520):40+900*Math.sqrt(Y());if(t[0]=Math.sin(n)*u,t[2]=Math.cos(n)*u,t[1]=s?Y.range(-45,-380):Y.range(-28,-560),B.set(t[0],t[1],t[2]).sub(H0),!(B.dot(re)>0&&B.angleTo(re)<.5)&&(!s||N.distanceTo(t[0],t[1],t[2])>60))break}t[3]=Y(),t[4]=s?Y.range(9,25):Y.range(.8,2.4)}),he(ut,dt),1),await i.yield();const t0=E==="sector"?"plate":"sector",R=await d0(i,P.fork("nbr"),t0,M.uniforms);R.name="nbr",R.userData.tag="nbr",R.scale.setScalar(.6),R.visible=!1,D.add(R);const D0=new o.Quaternion().setFromAxisAngle(new o.Vector3(-.7071,0,-.7071),.13);await i.yield();const X=await d0(i,P.fork("nbr2"),["fern","sector","plate"].find(e=>e!==E&&e!==t0),M.uniforms);X.userData.tag="nbr2",X.scale.setScalar(.6),X.visible=!1,D.add(X);const De=new o.Vector3().crossVectors(re,K).normalize(),B0=new o.Vector3().crossVectors(De,re).normalize(),U0=new o.Vector3().fromArray($(21.5)).addScaledVector(De,30).addScaledVector(B0,14),E0=new o.Quaternion().setFromAxisAngle(new o.Vector3(.6,0,.8),.1);await i.yield();const a0=new o.Mesh(new o.CylinderGeometry(2.4,4.2,36,10),new o.MeshBasicMaterial({color:F(v.band).lerp(F("#9aa0aa"),.7).multiplyScalar(.9),fog:!1}));a0.position.set(J.x,we+22,J.z),D.add(a0);const o0=new o.Mesh(new o.ConeGeometry(13,7,7),new o.MeshBasicMaterial({color:F(v.sea,1.5).lerp(F(v.ceil),.25),fog:!1}));o0.position.set(J.x,we+3.5,J.z),D.add(o0),await i.yield();const s0=new o.Vector3(0,.75,0),L0=new o.Vector3(0,.4,20),Be=new o.Vector3,oe=new o.Quaternion,n0=new o.Quaternion,i0=[],K0=new o.Vector3(.5,0,.8660254),r0=new o.Vector3(1,0,0),I0=new o.Vector3,G0=new o.Vector3().fromArray($(0)),_0=F(v.hollow),W0=new o.Vector3(22,.5,13),l0=(e,t)=>s0.set(0,de(Q(t))+.75,0),N0=(e,t)=>{const s=Q(t);return s0.set(0,de(s)+.75,0).lerp(G0,g0*A(36.6,38,s)*(1-A(39.8,41.2,s)))},O0=[{at:l0,from:0,to:T(22.85),weight:.82,fade:.04},{at:(e,t)=>L0.set(0,.4,M.tipRadius(Pe(Q(t)))+6),from:T(22.9),to:T(30.15)+.012,weight:.5,fade:.25},{at:()=>W0,from:T(30.2),to:T(34.4),weight:.42,fade:.25},{at:N0,from:T(31.2),to:T(41.8),weight:.78,fade:.2},{at:(e,t)=>I0.set(-6,de(Q(t))+6,75),from:T(40.4),to:T(46.3),weight:.8,fade:.3},{at:()=>R.position,from:T(43.6),to:T(46.6),weight:y0,fade:.4},{at:l0,from:T(45.2),to:T(50.5),weight:.7,fade:.3}],c0=(e,t,s)=>{const a=Q(t),n=Pe(a),u=de(a),r=M.object;M.setSeconds(n);const l=1-A(2,6,a),h=ie(1,1.8,l),c=ie(1,2.35,1-A(2,9,a));M.setHubBoost(c),r.scale.set(h,ie(1,1.5,l),h),r.position.set(0,u,0),r.quaternion.setFromAxisAngle(Ee,Math.PI/6*A(43.5,51,a)).multiply(oe.setFromAxisAngle(K,A0(a))),r.quaternion.multiply(oe.setFromAxisAngle(K0,.02*Math.sin(e*.8)*A(46,51,a)));const d=1-A(2.5,7,a),x=e*Math.PI/2;d>0&&r.quaternion.multiply(oe.setFromAxisAngle(Ee,d*(Math.PI/2+.7*Math.sin(x)))).multiply(n0.setFromAxisAngle(r0,d*.3*Math.sin(e*.9+1))).multiply(oe.setFromAxisAngle(K,d*.9*Math.sin(e*.7+.5))),r.updateMatrixWorld(!0);const m=A(39.5,43.5,a);M.setBelow(m);const z=M.hubRadius(n)*c,p=Math.max(M.tipRadius(n),z)*h;y.uT.value=e,y.uSec.value=a,y.uTipR.value=p,y.uSaClock.value=e,y.uSaHub.value.set(0,u,0,Math.max(ie(32,26,A(0,7,a)),1.4*p)),y.uSaAtm.value.set(.018,.0012,Ae,F0(a)),y.uSaOpen.value=1-A(4,8.5,a),y.uLane.value=1-A(4.5,6.5,a);const k=A(29.6,30.2,a)*(1-A(31.2,31.6,a)),U=A(31.6,32.2,a)*(1-A(34.4,35.2,a));U>0?y.uLaneP.value.set(j[0],j[1],j[2],U):k>0?y.uLaneP.value.set(O[0],O[1],O[2],k):y.uLaneP.value.set(0,u,0,y.uLane.value),y.uHollow.value.copy(_0).multiplyScalar(ie(.34,.42,A(3,8,a))),y.uSaHollow.value.copy(y.uHollow.value),M.getTips(n,i0);for(let b=0;b<12;b++){const g=i0[b],fe=b%6;Math.hypot(g.x,g.z)<z&&g.set(Math.sin(fe*Math.PI/3)*z,0,Math.cos(fe*Math.PI/3)*z),ke[b].copy(g).applyMatrix4(r.matrixWorld)}const f=Math.cos(x),w=f*f*f*f;let V=9;if(n<30.6)for(let b=0;b<Fe.length&&Fe[b]<=a;b++)V=a-Fe[b];y.uGl.value.set((1-A(4.4,6.2,a))*(.8+1.5*w*w),.5-.2*m,1.5*Math.exp(-V*2.6)*A(0,.1,V),1),y.uGlP.value.set(0,.9,z*.8).applyMatrix4(r.matrixWorld),y.uThread.value=A(8.8,9.6,n)*(1-A(29.3,30,n))*A(4,7,a),R.visible=a>27&&a<51.5,X.visible=a>36,X.position.copy(U0).addScaledVector(De,16*(1-A(47.5,52.4,a))),X.position.y+=(52.2-a)*1.2,X.quaternion.copy(E0).multiply(oe.setFromAxisAngle(K,.9+a*.03)),R.position.set(M0(a),C0(a),P0(a)),R.quaternion.copy(D0).multiply(oe.setFromAxisAngle(K,.4+a*.05)),y.uLamp.value.w=e*(Math.PI*2/6),ge.position.copy(s);const H=1-A(Ae-6,Ae+6,s.y);D.fog.density=ie(.018,.0012,H),D.fog.color.copy(m0).lerp(f0,H);for(let b=0;b<qe.length;b++){const g=qe[b];g.q?g.m.quaternion.copy(g.q).multiply(oe.setFromAxisAngle(K,g.ph+e*g.spin)).multiply(n0.setFromAxisAngle(r0,.14*Math.sin(e*.5+g.ph))):g.m.rotation.y=g.ph+e*g.spin,g.m.position.y=g.y+Math.sin(e*.4+g.ph)*.5,g.m.userData.tag==="plate"&&y.uHo.value[0].set(g.m.position.x,g.m.position.y,g.m.position.z,9),b<6&&(g.m.updateMatrixWorld(!0),B.copy(g.gl).applyMatrix4(g.m.matrixWorld),Ve[b].set(B.x,B.y,B.z,(.75+.35*Math.sin(e*1.7+g.ph*3))*(1-m)))}};return await i.yield(),c0(0,0,N.pointAt(0,Be)),await i.yield(),{scene:D,path:N,duration:ue,pace:z0,camera:{fov:75,near:.2,far:4500,lookAhead:12,sway:.6,bank:.4},pois:O0,portal:{shape:"circle",radius:7,color:"#CFEFFF",glow:1,tilt:!0,revealDistance:330},post:{exposure:1,bloom:{strength:.35,radius:.6,threshold:1},grade:{saturation:1.08,contrast:1.05,tint:"#ffffff",shadowTint:"#0a1226",vignette:.3,grain:.02,aberration:0}},ride:"none",update(e,t,s,a){s.getWorldPosition(Be),i.renderer&&i.renderer.getDrawingBufferSize&&i.renderer.getDrawingBufferSize(y.uRes.value),c0(t,a,Be)},dispose(){M.dispose&&M.dispose()}}}};export{pt as default};
