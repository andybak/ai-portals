import*as e from"three";import{mergeGeometries as ne}from"three/addons/utils/BufferGeometryUtils.js";const re=["#2757B8","#F7F3E8","#F4C21C","#77B93A","#2F7044","#5A4C9C","#D8362B"],Q=`
uniform float uTime;    // smooth seconds: camera, sky, cloud (the painted layer)
uniform float uTq;      // time on twos, floor(t*12)/12: every cel pose
uniform float uBoil;    // floor(t*4): outline boil
uniform vec4 uShadow;   // zA, zB = near and far edge of the cloud shadow (world z); zw = the same one drawing late
uniform vec3 uSun;      // toward the sun, world
uniform float uPx;      // world units covered by one pixel at 1 m
uniform float uRain;    // rain density 0..1
uniform float uSide;    // +1: screen-left is +X (true for a +Z course); the wind blows from the cloud side
uniform vec4 uRoof;     // the cloud base overhead: zA, zB (world z of its two edges), its height above the eye, unused
uniform vec4 uHat;      // the hat's own cast shadow: x, z, radius, and the height below which it falls
float h11(float n){ return fract(sin(n*12.9898)*43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
// scalloped edge offsets (metres, 0..12), "like the cloud that casts it": cusped arcs of three sizes
float scalA(float x){ return 6.5*abs(sin(x*0.031+0.6)) + 3.6*abs(sin(x*0.074+2.1)) + 1.9*abs(sin(x*0.163+4.0)); }
float scalB(float x){ return 6.5*abs(sin(x*0.027+3.3)) + 3.6*abs(sin(x*0.081+0.4)) + 1.9*abs(sin(x*0.149+1.2)); }
// signed depth into the shadow in metres (>0 inside). e = (zA, zB)
// gaps of sunlight inside the shadow: three scalloped ellipses (x, z, half-size across, half-size along), metres inside (>0)
uniform vec4 uGap0, uGap1, uGap2;
float gapOne(vec2 xz, vec4 g){ vec2 q = (xz - g.xy) / max(g.zw, vec2(1e-3)); float r = length(q) * (1. + 0.10*sin(q.x*5.1 + g.x*0.01) + 0.08*sin(q.y*6.3 + 1.7)); return (1. - r) * min(g.z, g.w); }
float gapDepth(vec2 xz){ return max(gapOne(xz, uGap0), max(gapOne(xz, uGap1), gapOne(xz, uGap2))); }
// one more cast shadow, for a cloud that stands by itself in the plain: one flat shape with a cut edge lying where the sun
// throws it, the cloud's own outline: a union of discs, one for each of its rounds (uTowL = x, z, radius of each; uTow =
// x, z, radius of a circle that holds them all; metres inside, >0; far outside it is simply "outside", so take no
// derivative of it)
uniform vec4 uTow; uniform vec3 uTowL[14];
float towDepth(vec2 xz){
  vec2 d0 = xz - uTow.xy; if (dot(d0, d0) > uTow.z*uTow.z) return -1e4;
  float m = -1e4; for (int i = 0; i < 14; i++) m = max(m, uTowL[i].z - length(xz - uTowL[i].xy));
  return m;
}
// the short cast shadows of built things on the land: boxes standing on it, each swept down the sun line as far as its
// height throws it (uBox = x, z of its middle, half-size in x, half-size in z; uBoxT = metres thrown, spacing along z
// when it is one of a row (0: single), first and last z of the row). >0 inside (metres along the sun line). Each
// shadow has its box's own width in metres at every distance.
uniform vec4 uBox[4], uBoxT[4];
float builtDepth(vec3 w){
  vec2 al = normalize(-uSun.xz); float m = -1e4;
  for (int i = 0; i < 4; i++) {
    vec2 q = w.xz - uBox[i].xy, h = uBox[i].zw;
    if (uBoxT[i].y > 0.) q.y -= uBoxT[i].y * floor((clamp(w.z, uBoxT[i].z, uBoxT[i].w) - uBox[i].y) / uBoxT[i].y + 0.5);
    vec2 a = (q - h) / al, b = (q + h) / al, lo = min(a, b), hi = max(a, b);
    m = max(m, min(min(hi.x, hi.y), uBoxT[i].x) - max(max(lo.x, lo.y), 0.));
  }
  return m;
}
float shadowDepth(vec2 xz, vec2 e){ return min(min(xz.y - (e.x - scalA(xz.x)), (e.y + scalB(xz.x)) - xz.y), -gapDepth(xz)); }
float inShadow(vec2 xz){ return step(0., max(shadowDepth(xz, uShadow.xy), towDepth(xz))); }
float inShadowLate(vec2 xz){ return step(0., max(shadowDepth(xz, uShadow.zw), towDepth(xz))); }
// metres inside the hat's shadow (>0 inside), a flat ellipse laid along the sun line; only below the hat
float hatDepth(vec3 w){ vec2 q = (w.xz - uHat.xy) * vec2(1., 0.8); return (uHat.z - length(q)) - 1e3*step(uHat.w, w.y); }
float inShadow3(vec3 w){ return step(0., max(max(shadowDepth(w.xz, uShadow.xy), towDepth(w.xz)), hatDepth(w))); }
float inShadowLate3(vec3 w){ return step(0., max(max(shadowDepth(w.xz, uShadow.zw), towDepth(w.xz)), hatDepth(w))); }
// the gust that runs 30 m ahead of the near edge (and a weaker one behind the far edge): 0..1, in three held poses
float bowRaw(vec2 xz){
  float d = (uShadow.x - scalA(xz.x)) - xz.y;                 // metres ahead of the edge
  float a = sin(3.14159*clamp(d/30., 0., 1.));
  float d2 = xz.y - (uShadow.y + scalB(xz.x));
  return max(a, 0.6*sin(3.14159*clamp(d2/22., 0., 1.)));
}
float bow(vec2 xz){ return floor(bowRaw(xz)*3. + 0.5)/3.; }
// drawn wind: dry-brush bands 6 m wide, 50-120 m long, travelling on twos. returns 0..1 (paint coverage)
// a = metres along the wind (the mark travels as a falls), c = metres across it, sp = lane spacing, p0 + p1 = the gap between marks,
// bw = the width of one bristle in metres (0.29 near; the ground widens it with distance so that a bristle is never under
// two pixels: far off, a band is three or four broad streaks with ragged ends, never a hatching of single pixels)
float brushLane(float a, float c, float k, float sp, float p0, float p1, float bw){
  float lane = floor(c/sp), cl = c - lane*sp - 0.5*sp;
  float per = p0 + p1*h11(lane + 7.3*k);
  float al = a + per*h11(lane*1.7 + k);
  float seg = floor(al/per); al -= seg*per;
  float len = 50. + 70.*h11(seg*3.1 + lane + k);
  cl += 6.*(h11(seg + lane*5.) - 0.5) + 1.5*sin(al*0.05 + lane);
  float w = 1. - abs(cl)/3.;                                   // 6 m wide
  float bristle = h11(floor(cl/bw) + lane*9. + seg);           // dry-brush: bristles run out at different lengths
  float ends = min(al/(8. + 22.*bristle), (len - al)/(6. + 26.*bristle));
  // the brush runs dry at its sides too: the outer bristles skip, leaving dashes of paint, so the mark has no ruled edge
  float wc = clamp(w, 0., 1.), skip = step(fract(al/((4. + 7.*bristle)*bw*3.5) + bristle*5.3), 0.25 + 1.1*wc + 0.3*bristle);
  return step(0.22*bristle*bristle, w)*step(0.35 + 0.5*bristle*(1. - wc), clamp(ends, 0., 1.))*skip*step(0.3, fract(bristle*7.7 + 0.13));   // and some bristles carry no paint at all: streaks, never a pane
}
float windLane(vec2 xz, float k, float bw){
  float ang = 0.5 + 0.07*k;
  vec2 dir = vec2(-uSide*sin(ang), -cos(ang));                 // on the plain it blows from the cloud toward the viewer
  return brushLane(dot(xz, dir) - uTq*(26. + 5.*k) + 131.*k, dot(xz, vec2(dir.y, -dir.x)) + 57.*k, k, 38., 400., 90., bw);
}
// on the hill (uHillAt) the wind that took the hat comes from behind: bands run +Z down the slope, faster than the flight
uniform vec4 uHillAt;     // x, z, radius, 1 (0: no hill)
float onHill(vec2 xz){ return uHillAt.w * step(length(xz - uHillAt.xy), uHillAt.z); }
float hillLane(vec2 xz, float k, float bw){
  vec2 dir = normalize(vec2(uSide*(0.16*k - 0.05), 1.));
  return brushLane(dot(xz, dir) - uTq*(30. + 5.*k) + 43. + 97.*k, dot(xz, vec2(dir.y, -dir.x)) + 11. + 15.*k, k + 4., 30., 150., 60., bw);
}
float windBandW(vec2 xz, float bw){
  float h = onHill(xz);
  return mix(max(windLane(xz, 0., bw), max(windLane(xz, 1., bw), windLane(xz, 2., bw))), max(hillLane(xz, 0., bw), hillLane(xz, 1., bw)), h);
}
float windBand(vec2 xz){ return windBandW(xz, 0.2857); }
// the second colour table: what a paint becomes inside the cast shadow
vec3 bluer(vec3 c){ return vec3(0.60*c.r + 0.05*c.b, 0.50*c.g + 0.20*c.b, 0.90*c.b + 0.40*c.g + 0.027); }   // #2F7044 -> #24566A
`,se=`
uniform float uInkCap;   // widest the line may get in metres (keeps small things from drowning in ink at distance)
float inkPush(vec3 wpos, vec3 wn, float weight){
  float dist = length(wpos - cameraPosition);
  float px = mix(2.5, 1.5, smoothstep(15., 260., dist)) * (1. - smoothstep(500., 700., dist));
  float thick = mix(1.45, 0.62, smoothstep(-0.3, 0.5, dot(wn, uSun)));            // thin on the lit side, thick in shade
  float boil = 0.82 + 0.36*h11(dot(floor(wpos*1.7), vec3(1., 17., 43.)) + uBoil*7.13); // thick-and-thin, restepped 4x a second
  return min(px * uPx * dist, uInkCap) * smoothstep(0.3, 0.7, uInkCap / max(uPx * dist, 1e-5)) * thick * boil * weight;
}
`;function le(o,b={}){const A=b.palette||re,n=t=>new e.Color(t),r=b.side===-1?-1:1,s={cobalt:n(A[0]),skyMid:n("#4A7BCB"),skyLow:n("#8FB6E6"),white:n(A[1]),cream:n("#F2DDB0"),blueGrey:n("#9FB0D0"),violet:n(A[5]),petal:n(A[2]),ochre:n("#B98A2E"),disc:n("#6B4426"),discShade:n("#463247"),green:n(A[3]),greenHi:n("#A6D24E"),greenShade:n(A[4]),greenDeep:n("#24566A"),red:n(A[6]),wine:n("#7E2440"),straw:n("#E2BE6A"),strawShade:n("#B08B4E"),ink:n("#2A1F3D"),ringInk:n("#17121F"),farGreen:n("#5FA08A"),farBlue:n("#7FA6CF"),river:n("#CFE3EE"),shadowFar:n("#6A66B4"),shadowNear:n("#5A4C9C")},K=new e.Vector3(-.55*r,.72,-.42).normalize(),x={uTime:{value:0},uTq:{value:0},uBoil:{value:0},uShadow:{value:new e.Vector4(1e6,1000300,1e6,1000300)},uSun:{value:K},uPx:{value:.0027},uSide:{value:r},uRes:{value:new e.Vector2(800,450)},uInk:{value:s.ink},uRain:{value:0},uGap0:{value:new e.Vector4(0,-1e6,1,1)},uGap1:{value:new e.Vector4(0,-1e6,1,1)},uGap2:{value:new e.Vector4(0,-1e6,1,1)},uHillAt:{value:new e.Vector4(0,-1e6,1,0)},uTow:{value:new e.Vector4(0,-1e7,0,0)},uTowL:{value:Array.from({length:14},()=>new e.Vector3(0,-1e7,0))},uBox:{value:[0,1,2,3].map(()=>new e.Vector4(0,-1e7,0,0))},uBoxT:{value:[0,1,2,3].map(()=>new e.Vector4(0,0,0,0))},uRoof:{value:new e.Vector4(1e6,1000300,0,0)},uHat:{value:new e.Vector4(0,-1e6,.001,-1e6)},uCum:{value:[0,1,2,3,4,5,6].map(()=>new e.Vector4(0,-1e7,1,1))},uDrift:{value:new e.Vector2(-1.7*r,-3)}},R=(t={})=>Object.assign({},x,t),M=(t={})=>new e.ShaderMaterial({uniforms:R({uHiPaint:{value:t.hiPaint||s.white},uLean:{value:t.lean??0},uInkCap:{value:t.inkCap??.08},uCastTop:{value:t.cast??-1e6},uCastPaint:{value:s.shadowNear}}),defines:t.cast!==void 0?{CAST:1}:{},side:e.DoubleSide,vertexColors:!0,vertexShader:Q+se+`
      attribute vec3 aShade; attribute float aHi; attribute float aInk;
      uniform float uLean; uniform vec2 uRes;
      varying vec3 vLit, vShade, vN, vW; varying float vHi, vInk;
      void main(){
        #ifdef USE_INSTANCING
          mat4 mm = modelMatrix * instanceMatrix;
        #else
          mat4 mm = modelMatrix;
        #endif
        vec4 wp = mm * vec4(position, 1.);
        vec3 wn = normalize(mat3(mm) * normal + vec3(0., 1e-5, 0.));
        vec3 root = mm[3].xyz;
        float keep = 1.;
        ${t.root||""}
        float hgt = wp.y - root.y;
        float wb = 0.4*step(0.5, windBand(root.xz)), hl = onHill(root.xz);
        float lean = uLean * (0.95*bow(root.xz) + wb*(1. - hl)), leanD = uLean * 1.6 * wb * hl;   // held poses, not a simulation; on the hill the band flattens the grass down the slope
        wp.xz += (vec2(-0.25*uSide, -1.) * lean + vec2(0.12*uSide, 1.) * leanD) * hgt * 0.75; wp.y -= (lean*lean + leanD*leanD)*hgt*0.42;
        ${t.vertex||""}
        wp.xyz = mix(root, wp.xyz, keep);
        if (aInk > 0.5) wp.xyz += wn * inkPush(wp.xyz, wn, 1.) * min(1., keep*4.);   // a plant that is left out leaves no speck of line behind
        if (aInk > 1.5) { vec3 vr = wp.xyz - cameraPosition; wp.xyz += vr / max(length(vr), 1e-3) * 0.05; }   // a card's line lies behind its paint
        vLit = color; vShade = aShade; vN = wn; vW = wp.xyz; vHi = aHi; vInk = aInk;
        gl_Position = projectionMatrix * viewMatrix * wp;
        if (aInk > 0.5) gl_Position.x -= 1.2/uRes.x * gl_Position.w;       // the line sits a hair left of the paint
        if (aInk > 1.5) gl_Position.z += 0.00015 * gl_Position.w;
      }`,fragmentShader:Q+`
      uniform vec3 uInk, uHiPaint, uCastPaint; uniform float uCastTop;
      varying vec3 vLit, vShade, vN, vW; varying float vHi, vInk;
      void main(){
        if (vInk > 0.5) { if (vInk < 1.5 && gl_FrontFacing) discard; gl_FragColor = vec4(uInk, 1.); return; }
        float d = dot(normalize(vN + vec3(0., 1e-5, 0.)), uSun) - 0.26;
        float lit = smoothstep(-1., 1., d / (fwidth(d) + 1e-4));              // hard edge, 15 degrees past the sun line
        float sh = inShadow3(vW);
        vec3 col = mix(mix(vShade, vLit, lit), mix(bluer(vShade), vShade, lit), sh);   // two paints, two colour tables
        float hm = smoothstep(-1., 1., (vHi - 0.5) / (fwidth(vHi) + 1e-4)) * lit;
        col = mix(col, mix(vLit, uHiPaint, 0.55), hm * (1. - inShadowLate3(vW)));   // the highlight is a drawing late
        #ifdef CAST
          float mC = max(fwidth(vW.x), fwidth(vW.z)) + 1e-4; col = mix(col, uCastPaint, max(step(0., towDepth(vW.xz)), smoothstep(-mC, mC, builtDepth(vW))) * step(vW.y, uCastTop) * (1. - step(0., shadowDepth(vW.xz, uShadow.xy))));   // land-like cels: a cast shadow lying on them is one flat violet shape, its edge cut by the metres a pixel covers as on the land (where the sun reaches: none under the tall cloud)
        #endif
        gl_FragColor = vec4(col, 1.);
      }`}),T=(t,l,v,p=0)=>{const w=t.attributes.position.count,C=t.attributes.position,H=new Float32Array(w*3),g=new Float32Array(w*3),u=new Float32Array(w),c=new Float32Array(w);for(let z=0;z<w;z++)H[z*3]=l.r,H[z*3+1]=l.g,H[z*3+2]=l.b,g[z*3]=v.r,g[z*3+1]=v.g,g[z*3+2]=v.b,u[z]=typeof p=="function"?p(C.getX(z),C.getY(z),C.getZ(z),z):p;return t.setAttribute("color",new e.BufferAttribute(H,3)),t.setAttribute("aShade",new e.BufferAttribute(g,3)),t.setAttribute("aHi",new e.BufferAttribute(u,1)),t.setAttribute("aInk",new e.BufferAttribute(c,1)),t.attributes.normal||t.computeVertexNormals(),t.deleteAttribute("uv"),t},B=(t,l={})=>{const v=t.clone(),p=v.attributes.position,w=v.attributes.normal,C=p.count,H=v.attributes.aInk;if(l.card){const g=new e.Vector3;for(let u=0;u<C;u++)g.add(new e.Vector3().fromBufferAttribute(p,u));g.multiplyScalar(1/C);for(let u=0;u<C;u++){const c=new e.Vector3().fromBufferAttribute(p,u).sub(g);c.lengthSq()<1e-8&&c.set(0,1,0),c.normalize(),w.setXYZ(u,c.x,c.y,c.z),H.setX(u,2)}}else{const g=new Map,u=c=>Math.round(p.getX(c)*500)+","+Math.round(p.getY(c)*500)+","+Math.round(p.getZ(c)*500);for(let c=0;c<C;c++){const z=u(c);let I=g.get(z);I||g.set(z,I=new e.Vector3),I.x+=w.getX(c),I.y+=w.getY(c),I.z+=w.getZ(c)}for(let c=0;c<C;c++){const z=g.get(u(c)).clone();z.lengthSq()<1e-8&&z.set(0,1,0),z.normalize(),w.setXYZ(c,z.x,z.y,z.z),H.setX(c,1)}}return v},q=b.cloudFoot||new e.Vector4(7500*r,14100,7600,3300),E=(t={})=>new e.ShaderMaterial({uniforms:R({uPetal:{value:s.petal},uOchre:{value:s.ochre},uGreen:{value:s.green},uGreenHi:{value:s.greenHi},uGreenShade:{value:s.greenShade},uGreenDeep:{value:s.greenDeep},uFarGreen:{value:s.farGreen},uFarBlue:{value:s.farBlue},uRiver:{value:s.river},uDisc:{value:s.disc},uDiscSh:{value:s.discShade},uShFar:{value:s.shadowFar},uShNear:{value:s.shadowNear},uRule:{value:s.green},uFieldSh:{value:0},uEye:{value:.16},uLine:{value:0},uFoot:{value:q},uRow:{value:new e.Vector2(t.rowSpacing||1.5,t.rowNear??0)}}),vertexShader:`
      attribute float aField; varying vec3 vW; varying float vField;
      void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz;
        #ifdef HAS_FIELD
          vField = aField;
        #else
          vField = 1.;
        #endif
        gl_Position = projectionMatrix * viewMatrix * wp; gl_Position.z = min(gl_Position.z, gl_Position.w * 0.99995); }`,defines:t.field?{HAS_FIELD:1}:{},fragmentShader:Q+`
      uniform vec3 uPetal, uOchre, uGreen, uGreenHi, uGreenShade, uGreenDeep, uFarGreen, uFarBlue, uRiver, uShFar; uniform vec3 uDisc, uDiscSh, uShNear, uRule; uniform float uEye, uLine, uFieldSh; uniform vec4 uFoot; uniform vec2 uRow; uniform vec4 uCum[7]; uniform vec2 uDrift;
      varying vec3 vW; varying float vField;
      void main(){
        vec2 xz = vW.xz; float dist = length(vW - cameraPosition);
        float far = smoothstep(560., 760., dist);
        // shadow: cut edge on the cel layer, soft on the painted layer
        float sdH = hatDepth(vW), sdC = shadowDepth(xz, uShadow.xy), sd = max(sdC, sdH);
        float sh = smoothstep(-1., 1., sd / (fwidth(sd) + 1e-3 + far*14.));
        float inHat = smoothstep(-1., 1., sdH / (fwidth(sdH) + 1e-3));               // the hat's own ellipse: flat violet on any ground
        float mT = max(fwidth(xz.x), fwidth(xz.y)) + 1e-4, inCast = smoothstep(-mT, mT, max(towDepth(xz), builtDepth(vW))) * (1. - step(0., sdC));   // and so are the standing cloud's and the built things' cast shapes (cut by the metres a pixel covers; none under the tall cloud, where no sun reaches)
        sh = max(sh, inCast); inHat = max(inHat, inCast);
        vec2 fq = (xz - uFoot.xy) / uFoot.zw; fq.x += 0.10*sin(xz.y*0.0021) + 0.05*sin(xz.y*0.0067); fq.y += 0.14*abs(sin(xz.x*0.0013 + 1.)) + 0.07*abs(sin(xz.x*0.0041));
        sh = max(sh, 1. - smoothstep(0.94, 1.0, length(fq)));
        // the shadows of the seven small cumulus: one flat violet shape each, scalloped, lying where the sun throws it and
        // drifting with its cloud (uCum = x, z, half-size across, half-size along)
        float cd = -1e4;
        for (int i = 0; i < 7; i++) { vec2 cq = (xz - uCum[i].xy - uDrift*uTime) / uCum[i].zw; float cr = length(cq) * (1. + 0.09*sin(cq.x*5.1 + uCum[i].x*0.01) + 0.07*sin(cq.y*6.3 + 1.7)); cd = max(cd, (1. - cr) * uCum[i].w); }
        float cs = smoothstep(-1., 1., cd / (fwidth(cd) + 1e-3 + far*5.));
        sh = max(sh, cs);
        // rows. Near: hard-edged dabs (a head of petal paint, its eye), each either painted or not, never half there.
        // Then ruled rows of the same two paints; as the rows close up the ruling is redrawn coarser (every 4th, 16th,
        // 64th furrow) so the far plain stays petal paint ruled with thin lines of the same green: never a third colour.
        float rx = xz.x / uRow.x, fw = fwidth(rx) + 1e-4, tri = abs(fract(rx) - 0.5);
        float gust = bow(xz), band = windBandW(xz, max(0.2857, 2.*uPx*dist)) * (1. - smoothstep(480., 700., dist));   // the drawn wind is a mark of the cel layer: it reaches as far as the line does
        float row = floor(rx), rz = xz.y/1.05 + 7.*h11(row), mpp = max(fwidth(xz.x), fwidth(xz.y)) + 1e-4;       // metres per pixel
        vec2 cell = vec2(row, floor(rz)); float hc = h21(cell + 5.3);
        vec2 dc = vec2((fract(rx) - 0.5)*uRow.x, (fract(rz) - 0.5)*1.05) + 0.16*(vec2(h21(cell), h21(cell.yx)) - 0.5);
        float ds = smoothstep(0.11, 0.2, uPx*dist);                                 // a flat dab is never drawn large: under the standing cels it shrinks away (a head lying on the ground with no line would break the cel rule)
        float dl = length(dc), hr = 0.5*(1. - 0.5*gust)*mix(1., 0.8, band)*ds;
        float dk = 1. - smoothstep(0.07, 0.3, mpp);                                  // how many heads are still drawn singly
        float under = smoothstep(uRow.y*0.55, uRow.y*1.25 + 1., dist);               // none beneath the true cels
        float present = step(hc, dk*0.999) * step(fract(hc*7.31), under) * step(0.5, vField);
        float aaD = min(mpp, 0.05);
        float disc = (1. - smoothstep(hr - aaD, hr + aaD, dl)) * present;
        float eye = (1. - smoothstep(uEye*ds - aaD, uEye*ds + aaD, dl)) * present * step(0.5, ds) * step(fract(hc*13.7), 1. - smoothstep(uEye*0.6, uEye*1.5, mpp));   // an eye too small to draw is left out, not blurred
        float duty = 0.27 * (1. - 0.62*gust) * mix(1., 0.86, band) * (1. - dk);      // the stripe widens as the dabs thin out
        float y0 = (1. - smoothstep(duty - fw, duty + fw, tri)) * step(0.004, duty);
        float a1 = smoothstep(0.22, 0.5, fw), a2 = smoothstep(0.22, 0.5, fw/4.), a3 = smoothstep(0.22, 0.5, fw/16.), a4 = smoothstep(0.22, 0.5, fw/64.);
        float t1 = abs(fract(rx/4. + 0.5) - 0.5), t2 = abs(fract(rx/16. + 0.5) - 0.5), t3 = abs(fract(rx/64. + 0.5) - 0.5);
        float g1 = 1. - smoothstep(0.11 - fw/4., 0.11 + fw/4., t1), g2 = 1. - smoothstep(0.085 - fw/16., 0.085 + fw/16., t2), g3 = 1. - smoothstep(0.06 - fw/64., 0.06 + fw/64., t3);
        float coarse = a1*(1. - a2)*g1 + a2*(1. - a3)*g2 + a3*(1. - a4)*g3 + a4*0.1;   // green ruling of the merged plain
        float head = max(disc, (1. - a1)*y0 + a1) * vField; coarse *= vField;
        float headSh = max(disc, (1. - a1)*y0) * vField;                              // in shadow only the near heads keep their ochre
        vec3 leafSun = uGreen, leafSh = mix(uShNear, uGreenShade, vField * uFieldSh * (1. - inHat));                      // a cast shadow is one flat violet shape
        vec3 sunCol = mix(mix(mix(leafSun, uPetal, head), uRule, coarse), uDisc, eye), shCol = mix(mix(mix(leafSh, uGreenDeep, coarse), uOchre, headSh), uDiscSh, eye);
        float line0 = (1. - smoothstep(0.1 - fw, 0.1 + fw, tri)) * (1. - a1) * (1. - dk) * uLine * vField;   // wheat colourways: each row's flowers as one thin line of their paint
        sunCol = mix(sunCol, uDisc, line0); shCol = mix(shCol, uDiscSh, line0);
        sunCol = mix(sunCol, uGreenHi, 0.8*band); shCol = mix(shCol, uShFar, 0.8*band);   // the dry-brush mark itself
        // painted layer: flats in steps, bluer with distance; fields, river
        float dw = dist * (1. + 0.07*sin(xz.x*0.0011 + xz.y*0.0007) + 0.04*sin(xz.x*0.0037 - xz.y*0.0023));
        vec2 pc = floor(xz / vec2(520., 1150.) + vec2(0., 0.31*floor(xz.x/520.)));
        float ptc = h21(pc);
        vec3 f1 = mix(mix(uPetal, uGreen, 0.1), mix(uGreen, uFarGreen, 0.5), step(0.62, ptc));
        f1 = mix(f1, mix(uPetal, uFarGreen, 0.35), step(0.82, ptc));
        vec3 f2 = mix(uFarGreen, mix(uFarGreen, uGreenHi, 0.35), step(0.6, ptc)), f3 = mix(uFarGreen, uFarBlue, 0.6);
        vec3 farSun = mix(f1, f2, smoothstep(1500., 1650., dw)); farSun = mix(farSun, f3, smoothstep(3300., 3600., dw)); farSun = mix(farSun, uFarBlue, smoothstep(6200., 6800., dw));
        float rv = abs(xz.y - (2900. + 520.*sin(xz.x*0.00075 + 0.8) + 0.12*xz.x*uSide)) - (50. + 30.*sin(xz.x*0.002));
        farSun = mix(uRiver, farSun, clamp(smoothstep(-8., 14., rv) + (1. - smoothstep(600., 900., dist)), 0., 1.));
        farSun = clamp(farSun, 0., 1.);
        vec3 farSh = mix(uShFar, uFarBlue, 0.55*smoothstep(3300., 6800., dw));
        float farS = (smoothstep(560., 574., dw) + smoothstep(652., 666., dw) + smoothstep(746., 760., dw)) / 3.;   // seen from the height of the climb a smooth merge is a gradient: three flat steps
        vec3 col = mix(mix(sunCol, farSun, farS), mix(shCol, farSh, (smoothstep(230., 250., dw) + smoothstep(380., 410., dw) + smoothstep(540., 580., dw)) / 3.), sh);   // the far merge in three flat bands, not a gradient
        gl_FragColor = vec4(col, 1.);
      }`}),L=()=>new e.ShaderMaterial({uniforms:R({uA:{value:s.cobalt},uB:{value:s.skyMid},uC:{value:s.skyLow},uHill:{value:s.farBlue}}),side:e.BackSide,depthWrite:!1,vertexShader:`varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.);
      if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fragmentShader:Q+`
      uniform vec3 uA, uB, uC, uHill; varying vec3 vD;
      void main(){
        vec3 d = normalize(vD + vec3(0., 1e-5, 0.)); float az = atan(d.z, abs(d.x) < 1e-5 ? 1e-5 : d.x);
        float h = d.y + 0.008*sin(az*5. + 1.) + 0.004*sin(az*17.) + 0.003*sin(az*41. + d.y*30.);   // the brush wanders
        vec3 col = mix(uC, uB, smoothstep(0.10, 0.15, h)); col = mix(col, uA, smoothstep(0.29, 0.36, h));
        col = mix(col, mix(uC, vec3(1.), 0.22), 1. - smoothstep(0.022, 0.034, h));                 // palest wash at the horizon
        float hill = 0.012 + 0.006*sin(az*7. + 2.) + 0.004*sin(az*19.) + 0.0025*sin(az*43.);
        col = mix(col, mix(uHill, uC, 0.35), 1. - smoothstep(hill - 0.0015, hill + 0.0015, d.y));
        gl_FragColor = vec4(col, 1.);
      }`}),W=()=>new e.ShaderMaterial({uniforms:R({uW:{value:s.white},uCr:{value:s.cream},uBg:{value:s.blueGrey},uVi:{value:s.violet},uHz:{value:s.skyLow}}),transparent:!0,depthWrite:!1,vertexShader:`
      uniform float uTime; uniform vec2 uDrift;
      attribute vec3 iPos; attribute vec4 iRad; attribute vec4 iAux; attribute vec3 iBase; attribute float iDrift;
      varying vec2 vQ; varying float vY; varying vec4 vAux; varying vec3 vBase; varying float vRoll;
      void main(){
        float br = sin(uTime*1.05 + iRad.z), br2 = sin(uTime*0.61 + iRad.z*1.7);
        float sw = 1. + iRad.w*(0.075*br + 0.05*br2);
        vec3 ip = iPos; ip.xz += iDrift * uDrift * uTime;                               // the small cumulus drift (smooth time)
        vec2 d = ip.xz - cameraPosition.xz; d += vec2(1e-3, 0.);
        vec2 r2 = normalize(vec2(-d.y, d.x));
        vec2 q = position.xy * 1.18;
        vec2 off = q * iRad.xy * sw + iAux.xy * iRad.x * iRad.w * (0.13*br + 0.07*br2 + 0.2);
        vec3 wp = ip + vec3(r2.x, 0., r2.y)*off.x + vec3(0., off.y, 0.);
        vQ = q; vY = wp.y; vAux = iAux; vBase = iBase; vRoll = uTime*0.22*iRad.w + 0.5*br2*iRad.w;
        vec4 p = projectionMatrix * viewMatrix * vec4(wp, 1.);
        if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww;
      }`,fragmentShader:`
      uniform vec3 uW, uCr, uBg, uVi, uHz;
      varying vec2 vQ; varying float vY; varying vec4 vAux; varying vec3 vBase; varying float vRoll;
      void main(){
        vec2 q = vQ; float s = vAux.w;
        float ang = atan(q.y, abs(q.x) < 1e-5 ? 1e-5 : q.x);
        float wob = 1. + 0.07*sin(ang*3. + s*6.3 + vRoll) + 0.05*sin(ang*5. - s*11. - vRoll*1.6) + 0.025*sin(ang*9. + s*29.);
        vec2 qn = q / wob; float r = length(qn);
        float a = 1. - smoothstep(0.93, 1.0, r);                                       // soft 3 percent edge
        a *= smoothstep(-0.5, 0.5, (vY - vBase.x) / max(vBase.z*0.06, 1.));            // the flat base
        if (a < 0.004) discard;
        vec3 n = vec3(qn, sqrt(max(0., 1. - r*r*0.92)));
        float t = 0.8*dot(n, vec3(0.56, 0.62, 0.55)) + vAux.z + 0.05*sin(q.x*7. + s*9.)*sin(q.y*6. + s*4.);
        t = max(t, -0.24);                                                             // a lobe's own shade stops at blue-grey
        t -= 1.5 * (1. - smoothstep(0., 1., (vY - vBase.x) / max(vBase.z, 1.)));       // violet under the shelf
        vec3 col = mix(uVi, uBg, smoothstep(-0.36, -0.30, t));
        col = mix(col, uCr, smoothstep(0.13, 0.19, t)); col = mix(col, uW, smoothstep(0.31, 0.37, t));
        gl_FragColor = vec4(mix(col, uHz, vBase.y), a);
      }`}),_=()=>new e.ShaderMaterial({uniforms:R({uVi:{value:s.violet},uBg:{value:s.blueGrey}}),side:e.BackSide,depthWrite:!1,transparent:!0,vertexShader:`varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.);
      if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fragmentShader:Q+`
      uniform vec3 uVi, uBg; varying vec3 vD;
      // a rank of pouches: 1 at the cusp between two, down to 0 at the round belly of the deepest; every pouch hangs to its own depth
      float arc(float x, float k){ float i = floor(x), t = 2.*(x - i) - 1.; return 1. - (0.5 + 0.5*h11(i*7.3 + k)) * sqrt(max(0., 1. - t*t)); }
      float st(float x, float w){ return smoothstep(-w, w, x); }
      void main(){
        vec3 d = normalize(vD + vec3(0., 1e-5, 0.));
        float fz = max(d.z, 0.05);
        float q = d.y / fz, sx = clamp(d.x / fz, -6., 6.) * uSide;
        float fw = fwidth(q) + 1e-4, e = 1.5*fw;
        float D = uRoof.y - cameraPosition.z, DA = uRoof.x - cameraPosition.z;
        if (d.y < 0.012 || uRoof.z < 0.5 || D < 1.) discard;
        float q0 = uRoof.z / max(D, 1.);                                                   // the slope the rim hangs at
        float dr = uTime*0.006, sw = sx + 0.07*sin(sx*4.3 + 1.7) + 0.03*sin(sx*9.1 + 0.4);   // the hand's uneven spacing; a slow drift
        float s2 = sx + 0.11*sin(sx*2.6 + 4.1) + 0.04*sin(sx*7.7 + 2.9), s3 = sx + 0.16*sin(sx*1.9 + 0.3);   // each rank spaced by a different hand
        float b0 = q0 - 0.016 + 0.072*arc(sw/0.34 + 0.20 + dr, 1.) + 0.012*arc(sw/0.125 + 0.6 + dr*2., 2.);
        float b1 = q0 + 0.090 + 0.092*arc(s2/0.47 + 0.63 + dr*0.8, 3.) + 0.012*sin(sx*1.7 + 0.8);
        float b2 = q0 + 0.235 + 0.125*arc(s3/0.74 + 0.31 + dr*0.6, 4.) + 0.016*sin(sx*1.3 + 2.4);
        float b3 = q0 + 0.440 + 0.170*arc(sw/1.17 + 0.77 + dr*0.5, 5.);
        float a = st(q - b0, fw);
        if (DA > 1.) a *= 1. - st(q - uRoof.z / max(DA, 1.), 2.*fw);
        if (a < 0.004) discard;
        vec3 mid = mix(uVi, uBg, 0.5), deep = uVi*vec3(0.84, 0.82, 0.9);
        // rank 0 (the rim): a blue-grey lower edge, a middle belly, a violet tuck under the rank behind
        vec3 col = mix(uBg, mid, st(q - b0 - (0.015 + 0.007*sin(sx*9. + 2.)), e));
        col = mix(col, uVi, st(q - mix(b0, b1, 0.62 + 0.12*sin(sx*6.1 + 1.)), e));
        // rank 1: middle belly, violet, deep tuck
        vec3 c1 = mix(mid, uVi, st(q - mix(b1, b2, 0.36 + 0.10*sin(sx*4.7 + 3.)), e));
        c1 = mix(c1, deep, st(q - mix(b1, b2, 0.80 + 0.08*sin(sx*3.3 + 0.5)), e));
        col = mix(col, c1, st(q - b1, e));
        // rank 2: violet belly, deep tuck;  rank 3 (overhead): a thin violet belly, then deep
        vec3 c2 = mix(uVi, deep, st(q - mix(b2, b3, 0.48 + 0.12*sin(sx*2.9 + 2.2)), e));
        col = mix(col, c2, st(q - b2, e));
        vec3 c3 = mix(uVi, deep, st(q - b3 - (0.07 + 0.03*sin(sx*2.1 + 1.3)), e));
        col = mix(col, c3, st(q - b3, e));
        gl_FragColor = vec4(col, a);
      }`}),Y=()=>{const t=new e.Mesh(new e.IcosahedronGeometry(1,3),_());return t.frustumCulled=!1,t.renderOrder=-.85,t},m=()=>new e.ShaderMaterial({uniforms:R({uW:{value:s.white},uCr:{value:s.cream},uBg:{value:s.blueGrey},uVi:{value:s.violet},uNearK:{value:1},uLid:{value:0},uRimK:{value:0},uCells:{value:1}}),transparent:!0,depthWrite:!1,vertexShader:`
      uniform float uTime, uNearK, uLid; uniform vec4 uRoof; uniform vec3 uSun;
      attribute vec3 iPos; attribute vec4 iRad; attribute vec4 iAux; attribute float iFlat;
      varying vec2 vQ; varying vec4 vAux; varying float vRoll, vDark, vRad, vFlat; varying vec3 vSunV;
      void main(){
        // uLid 1 (the underside's pouches): a pouch hangs from the painted lid and is never seen apart from it. While the
        // lid's rim (slope uRoof.z over the distance to it) stands above a pouch's place, the pouch rides up inside the
        // lid, whole and at full size, and comes down with the rim as the base closes over; it leaves the same way.
        vec3 ip = iPos;
        { float dz = max(ip.z - cameraPosition.z, 0.), q0 = uRoof.z / max(uRoof.y - cameraPosition.z, 1.);
          ip.y += uLid * max(0., (q0 + 0.035) * dz - (ip.y - 0.95*iRad.x - cameraPosition.y)); }
        float br = sin(uTime*1.05 + iRad.z), br2 = sin(uTime*0.61 + iRad.z*1.7);
        float sw = 1. + iRad.w*(0.06*br + 0.04*br2);
        vec3 toC = cameraPosition - ip; float dist = max(length(toC), 1e-3); toC /= dist;
        vec3 rt = normalize(cross(vec3(0., 1., 0.), toC) + vec3(1e-4, 0., 0.)); vec3 upv = cross(toC, rt);
        vec2 q = position.xy * 1.12;
        float k = uNearK * smoothstep(iRad.x*1.02, iRad.x*1.3, dist);                    // a lobe never stands across the lens
        vec2 off = (q*sw + iAux.xy*iRad.w*(0.11*br + 0.06*br2)) * iRad.x * k; off.y *= iFlat;   // iFlat < 1: a shelf or an anvil plate, wide and flat
        // the sun as the eye sees it (turned into the lobe's own frame): fly round a turret and its lit flank and its
        // shade flank change places; looking toward the sun a lobe keeps only a lit rim
        vSunV = normalize(vec3(dot(uSun, rt), dot(uSun, upv)*0.86, dot(uSun, toC)) + vec3(0., 1e-4, 0.));
        vec3 wp = ip + rt*off.x + upv*off.y;
        vQ = q; vAux = iAux; vDark = iRad.y; vRad = iRad.x; vFlat = iFlat; vRoll = uTime*0.2*iRad.w + 0.5*br2*iRad.w;
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
      }`,fragmentShader:`
      uniform vec3 uW, uCr, uBg, uVi; uniform float uRimK, uCells;
      varying vec2 vQ; varying vec4 vAux; varying float vRoll, vDark, vRad, vFlat; varying vec3 vSunV;
      float st(float x, float w){ return smoothstep(-w, w, x); }
      vec2 h22(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))))*43758.5453); }
      // rounds laid like a painter lays them, the lower over the upper: each keeps the clean arc of its top, and the round
      // behind tucks into shade just above that arc. Returns (the round's tone under the light, 0..1 how deep in a tuck).
      vec2 rounds(vec2 p, float bias, vec3 sunP){
        vec2 ci = floor(p), cf = p - ci, nb = vec2(0.); float key = 9., nz = 0., occ = 1.;
        for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
          vec2 o = vec2(float(i), float(j)), hh = h22(ci + o), d = o + 0.12 + 0.76*hh - cf;
          float rr = 0.56 + 0.44*hh.y, dd = dot(d, d), k2 = d.y + 0.3*hh.x;
          if (dd < rr*rr) { if (k2 < key) { key = k2; nb = -d / rr; nz = sqrt(max(0., 1. - dd / (rr*rr))); } }
          else if (d.y < 0.) occ = min(occ, sqrt(dd) - rr);
        }
        return vec2(key < 8. ? 0.8*dot(vec3(nb, nz), sunP) + bias : bias - 0.3, 1. - smoothstep(0.0, 0.2, occ));
      }
      void main(){
        vec2 q = vQ; float s = vAux.w;
        float ang = atan(q.y, abs(q.x) < 1e-5 ? 1e-5 : q.x);
        float wob = 1. + 0.06*sin(ang*3. + s*6.3 + vRoll) + 0.045*sin(ang*5. - s*11. - vRoll*1.6) + 0.03*sin(ang*8. + s*29.) + 0.02*sin(ang*13. - s*17.);
        vec2 qn = q / wob; float r = length(qn);
        float ew = clamp(fwidth(r)*1.5, 0.003, 0.05);
        float a = 1. - smoothstep(1. - ew, 1., r);
        if (a < 0.004) discard;
        vec3 n = vec3(qn, sqrt(max(0., 1. - r*r*0.92)));
        // the brush builds each lobe out of smaller rounds: scallops inside the big shape
        float bump = 0.16*sin(qn.x*9. + s*20. + 2.*sin(qn.y*5. + s*9.)) * sin(qn.y*8. + s*7. + 1.5*sin(qn.x*4. - s*3.)) + 0.05*sin(qn.x*17. - s*13.)*sin(qn.y*15. + s*31.);
        // the painter's light: the world's one sun, on the side of the picture where it stands, but laid across the form
        // (never flat on to it), so that every round turns through all of the cloud's values: white on its sunward side,
        // cream, blue-grey underneath, violet in the tucks
        vec3 sunP = normalize(vec3(vSunV.xy, clamp(vSunV.z, -0.4, 0.24)));
        float tl = 0.8*dot(n, mix(vSunV, sunP, uCells)) + vAux.z + bump;
        float td = 0.8*dot(n, vec3(0.10, -0.80, 0.30)) + vAux.z + bump - 0.14;
        // a lit lobe is a pile of rounds, each lit on its sunward side, turning to the shade paints, with the darkest in
        // the tucks between rounds. Close to, the rounds are small (about 8 m); further off the same lobe is drawn with
        // larger rounds (about 20 m), so that a round is never under about twelve pixels and a tuck is never a hairline;
        // beyond that the lobe is its own flat shapes.
        float cells = clamp(vRad / 8.5, 2.3, 8.5) * (0.72 + 0.6*fract(s*7.31));
        vec2 q2 = qn*vec2(1., vFlat);                                              // (a shelf's rounds are as round on screen as a turret's)
        vec2 pF = q2*cells + vec2(s*37., s*91.); pF += 0.35*sin(pF.yx*1.3 + s*5.);   // the hand's uneven spacing
        vec2 pC = q2*cells*0.42 + vec2(s*53., s*17.); pC += 0.35*sin(pC.yx*1.3 + s*8.);
        float rpx = 2. / (fwidth(vQ.x) + fwidth(vQ.y) + 1e-5);                     // the lobe's radius on the frame, in pixels
        float fwF = fwidth(pF.x) + fwidth(pF.y), wOn = uCells * (1. - vDark) * max(smoothstep(9., 16., vRad), smoothstep(80., 140., rpx));   // a small lobe is one shape, until it stands large in the frame: then it too is a pile of rounds
        float wF = wOn * (1. - smoothstep(0.09, 0.17, fwF)), wC = wOn * (1. - smoothstep(0.09, 0.17, fwF*0.42)) * smoothstep(0.07, 0.15, fwF);
        vec2 rF = wF > 0.002 ? rounds(pF, vAux.z, sunP) : vec2(0.), rC = wC > 0.002 ? rounds(pC, vAux.z, sunP) : vec2(0.);
        float tb = max(tl, -0.24);
        float kr = 0.6 + 0.13*smoothstep(0.05, -0.35, tl - bump);                // on the lobe's shade side a round still turns from a paler cap to its tuck (a shape, never only a line between rounds)
        float kc = 0.07 + 0.29*smoothstep(-0.3, 0.1, tl - bump);                 // the tuck between two rounds is a drawn shape in the light; in the lobe's shade it is left out (never a net of dark lines)
        tb = mix(tb, mix(tl - bump, rC.x, kr) + 0.36*bump - kc*rC.y, wC);        // the big form's own lit side and shade side lead; the rounds are drawn inside them
        tb = mix(tb, mix(tl - bump, rF.x, kr) + 0.36*bump - kc*rF.y, wF);
        float t = mix(tb, td, vDark), e = min(fwidth(t)*1.2 + 0.004, 0.03);   // flat paints at every size: a lobe small on screen keeps four values, never a ramp
        // uRimK: the edge of a lit lobe that faces the sun is drawn as one crescent of the cloud's own cream (the second of
        // its four values, under the world's one sun), so a turret's lit flank reads against the white behind it
        float rimv = dot(qn, vSunV.xy) / max(length(vSunV.xy), 0.2) + 0.06*sin(ang*7. + s*40.) - 0.70;
        float rim = st(rimv, fwidth(rimv)*1.2 + 0.004) * uRimK * (1. - vDark) * st(t - 0.16, e);   // only where the lobe is in its lit paints
        vec3 mid = mix(uVi, uBg, 0.5), deep = uVi*vec3(0.84, 0.82, 0.9);
        vec3 lit = mix(uVi, uBg, st(t + 0.33, e)); lit = mix(lit, uCr, st(t - 0.16, e)); lit = mix(lit, uW, st(t - 0.39, e));
        vec3 dk = mix(deep, uVi, st(t + 0.02, e)); dk = mix(dk, mid, st(t - 0.30, e)); dk = mix(dk, uBg, st(t - 0.52, e));
        lit = mix(lit, uCr, rim);
        gl_FragColor = vec4(mix(lit, dk, vDark), a);
      }`}),a=t=>{const l=t.length,v=h(),p=new Float32Array(l*3),w=new Float32Array(l*4),C=new Float32Array(l*4),H=new Float32Array(l),g=t.map((V,G)=>G),u=new Float32Array(l),c=()=>{for(let V=0;V<l;V++){const G=t[g[V]];p[V*3]=G.x,p[V*3+1]=G.y,p[V*3+2]=G.z,w[V*4]=G.r,w[V*4+1]=G.dark?1:0,w[V*4+2]=G.phase??0,w[V*4+3]=G.grow??.5,C[V*4]=G.gx??0,C[V*4+1]=G.gy??1,C[V*4+2]=G.bias??0,C[V*4+3]=G.seed??0,H[V]=G.flat??1}};c();const z=new e.InstancedBufferAttribute(p,3),I=new e.InstancedBufferAttribute(w,4),te=new e.InstancedBufferAttribute(C,4),ae=new e.InstancedBufferAttribute(H,1);v.setAttribute("iFlat",ae),v.setAttribute("iPos",z),v.setAttribute("iRad",I),v.setAttribute("iAux",te),v.instanceCount=l;const $=new e.Mesh(v,m());return $.frustumCulled=!1,$.renderOrder=-.8,$.userData.lobes=t,$.userData.sort=(V,G=!1)=>{for(let U=0;U<l;U++){const ee=t[U],oe=ee.x-V.x,Z=ee.y-V.y,ie=ee.z-V.z;u[U]=oe*oe+Z*Z+ie*ie}let J=!1;for(let U=1;U<l;U++){const ee=g[U],oe=u[ee];let Z=U-1;for(;Z>=0&&u[g[Z]]<oe;)g[Z+1]=g[Z],Z--,J=!0;g[Z+1]=ee}(J||G)&&(c(),z.needsUpdate=!0,I.needsUpdate=!0,te.needsUpdate=!0,ae.needsUpdate=!0)},$},i=()=>new e.ShaderMaterial({uniforms:R({uBg:{value:s.blueGrey},uVi:{value:s.violet},uPale:{value:n("#C9C8E8")}}),side:e.DoubleSide,transparent:!0,depthWrite:!1,vertexShader:`uniform float uSide; varying vec2 vUv; varying vec3 vK; void main(){ vUv = position.xy; vec4 wp = modelMatrix * vec4(position.x, position.y, 0., 1.);
      wp.x -= (1. - position.y) * 0.15 * modelMatrix[1].y * uSide;                         // slanting with the gust (the wind blows from the cloud's side)
      vK = vec3(floor(fract(modelMatrix[3].x*0.0137 + modelMatrix[0].x*0.071)*61.), max(6., floor(length(modelMatrix[0].xyz) / 1.5)), 1. - length(modelMatrix[2].xyz));   // seed (a whole number), lanes (about 3 m each), lift
      gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:Q+`
      uniform vec3 uBg, uVi, uPale; varying vec2 vUv; varying vec3 vK;
      void main(){
        float y = vUv.y, x = vUv.x, sd = floor(vK.x + 0.5), L = floor(vK.y + 0.5), lift = clamp(vK.z, 0., 1.);
        float xs = (x + 1.) * 0.5 * L; xs += 0.3*sin(xs*1.9 + sd) + 0.22*sin(y*5.3 + sd*1.7) + 0.09*sin(y*12.1 + x*3. + sd*0.9);   // the hand's uneven spacing, and no stroke falls dead straight
        float lane = floor(xs), lx = fract(xs) - 0.5;
        float b = h11(lane*1.31 + sd*7.13), b2 = h11(lane*1.7 + 3. + sd*3.77), b3 = h11(lane*2.3 + 11. + sd*5.21);
        float xc = abs((lane + 0.5) / L * 2. - 1.);                                          // how far out this stroke hangs (0 the middle, 1 the side)
        float foot = lift + 0.02 + 0.2*b*b + 0.5*smoothstep(0.55, 1., xc)*(0.6 + 0.8*b) + 0.02*sin(uTime*0.5 + lane*2.1);   // each stroke runs dry at its own height, the outer ones soonest
        float up = y - foot, cx = lx - 0.14*(b2 - 0.5) - 0.03*sin(y*6. + b*20.), aa = fwidth(xs)*1.3 + 1e-4;
        // the wash: one flat paint (the cloud's blue-grey, the paint of the base's own rim). Each stroke of it lifts to a
        // point at its foot and broadens upward until it lies against its neighbours, so the shaft is a whole shape where
        // it leaves the base and a ragged fringe of brush ends below
        float hb = (0.2 + 0.4*b3) * smoothstep(0., 0.12, up) + 0.5*smoothstep(0.06, 0.3, up);
        float a = smoothstep(0., aa, hb - abs(cx)) * step(0., up);                           // flat and opaque: only the rim is softened
        if (a < 0.004) discard;
        // the streaks laid into it: about half the strokes carry a narrower one, darker (the underside's middle value) or
        // paler (the rain's own paint), which pinches where the brush ran dry; the pinch slides down
        float brk = abs(fract(y*1.1 + b3*5. + uTime*0.16) - 0.5);
        float hs = (0.1 + 0.22*b) * smoothstep(0., 0.2, up) * (1. - 0.8*smoothstep(0.42, 0.48, brk));
        float st = smoothstep(0., aa, hs - abs(cx + 0.12*(b3 - 0.5))) * (1. - step(0.36, b2)*step(b2, 0.64));
        // deeper toward the base: above its own ragged height each stroke of the wash is laid a step deeper (a quarter of
        // the way to the underside's violet: still the pale paint's family, lighter than the dark streaks), so a shaft is
        // deepest where it leaves the base and palest at its fringe
        vec3 wash = mix(uBg, uVi, 0.25 * step(0.56 + 0.26*b + 0.05*sin(lane*3.3 + sd), y));
        vec3 col = mix(wash, b2 < 0.36 ? mix(uVi, uBg, 0.5) : uPale, st);
        gl_FragColor = vec4(col, a);
      }`}),f=(t={})=>new e.ShaderMaterial({uniforms:R({uPale:{value:n("#C9C8E8")},uRBox:{value:new e.Vector3(...t.box||[46,30,60])},uRFall:{value:new e.Vector2(...t.fall||[7,7.5])},uRLen:{value:new e.Vector3(...t.len||[.9,1.1],t.near??4.5)}}),side:e.DoubleSide,vertexShader:Q+`
      attribute vec4 iSeed; uniform vec3 uRBox, uRLen; uniform vec2 uRFall;
      void main(){
        float fr = floor(uTq*12. + 0.5) + floor(iSeed.w*97.);
        float pose = mod(fr, 3.), cyc = floor(fr/3.);
        vec3 box = uRBox;
        vec3 sp = fract(iSeed.xyz + vec3(h11(cyc + iSeed.x*31.), 0., h11(cyc*1.3 + iSeed.z*17.))) * box;
        vec3 c = mod(sp - cameraPosition, box) - 0.5*box; c.y = (iSeed.y - 0.5)*box.y + uRFall.x - pose*uRFall.y;   // three held drawings, falling
        c += cameraPosition;
        vec3 ax = normalize(vec3(-0.10*uSide, -1., -0.24));                              // slanting with the gust
        float len = uRLen.x + uRLen.y*h11(iSeed.w*13. + pose);
        vec3 toC = cameraPosition - c; vec3 sd = cross(ax, toC); sd = sd / max(length(sd), 1e-4);
        float dist = length(toC);
        float w = max(0.02, 1.5*uPx*dist) * (0.7 + 0.6*h11(fr + iSeed.x*5.));
        vec3 wp = c + ax*position.y*len + sd*position.x*w;
        wp.x += 0.06*sin(position.y*9. + pose*2.)*step(0.5, pose);                       // the hand wobbles the second drawing
        float on = step(iSeed.w, uRain) * step(uRLen.z, dist);
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.) * on;
      }`,fragmentShader:"uniform vec3 uPale; void main(){ gl_FragColor = vec4(uPale, 1.); }"}),d=()=>new e.ShaderMaterial({uniforms:R({uPale:{value:s.white},uSz:{value:1},uMinH:{value:0}}),side:e.DoubleSide,vertexShader:Q+`
      attribute vec4 iSeed; varying float vK; uniform float uSz, uMinH; uniform vec2 uRes;
      void main(){
        float fr = floor(uTq*12. + 0.5) + floor(iSeed.w*53.);
        float f = mod(fr, 11.);                                                         // drawings 0..3 show, then it waits
        float on = step(f, 3.5) * step(fract(iSeed.w*7.31 + floor(fr/11.)*0.37), uRain) * step(0.5, inShadow((modelMatrix * vec4(iSeed.xyz, 1.)).xz) + step(0.99, uRain));
        float sc = (0.45 + 0.22*f) * (0.7 + 0.6*h11(iSeed.w*3.)) * uSz;
        vec3 c = (modelMatrix * vec4(iSeed.xyz, 1.)).xyz; vec2 d = c.xz - cameraPosition.xz + vec2(1e-3, 0.); vec2 r2 = normalize(vec2(-d.y, d.x));
        // a crown is drawn large enough to be read as a drawing: never under uMinH of the frame's height (up to three times
        // its true size), and the ones too far to read are left out rather than drawn as specks
        float dist = length(c - cameraPosition);
        sc *= clamp(uMinH * uPx * uRes.y * dist / max(0.5 * (0.7 + 0.6*h11(iSeed.w*3.)) * uSz, 1e-3), 1., 3.);   // (the four drawings keep their growth)
        on *= 1. - step(85. + 45.*h11(iSeed.w*11.), dist) * step(0.001, uMinH);
        vec2 p = position.xy * sc * vec2(1. + 0.25*f, 1. - 0.12*f); p.y += 0.02;
        vec3 wp = c + vec3(r2.x, 0., r2.y)*p.x + vec3(0., p.y, 0.);
        vK = position.z;
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.) * on;
      }`,fragmentShader:"uniform vec3 uInk, uPale; varying float vK; void main(){ gl_FragColor = vec4(mix(uInk, uPale, step(0.5, vK)), 1.); }"}),h=()=>{const t=new e.InstancedBufferGeometry;return t.setAttribute("position",new e.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),t.setIndex([0,1,2,0,2,3]),t},k=t=>{const l=t.length,v=h(),p=new Float32Array(l*3),w=new Float32Array(l*4),C=new Float32Array(l*4),H=new Float32Array(l*3);t.forEach((u,c)=>{p.set([u.x,u.y,u.z],c*3),w.set([u.rx,u.ry??u.rx,u.phase??0,u.grow??.5],c*4),C.set([u.gx??0,u.gy??1,u.bias??0,u.seed??0],c*4),H.set([u.base??0,u.haze??0,u.shelf??400],c*3)}),v.setAttribute("iPos",new e.InstancedBufferAttribute(p,3)),v.setAttribute("iRad",new e.InstancedBufferAttribute(w,4)),v.setAttribute("iAux",new e.InstancedBufferAttribute(C,4)),v.setAttribute("iBase",new e.InstancedBufferAttribute(H,3)),v.setAttribute("iDrift",new e.InstancedBufferAttribute(new Float32Array(t.map(u=>u.drift??0)),1)),v.instanceCount=l;const g=new e.Mesh(v,W());return g.frustumCulled=!1,g.renderOrder=-.9,g},F=()=>{const t=new e.Mesh(new e.IcosahedronGeometry(1,4),L());return t.frustumCulled=!1,t.renderOrder=-.95,t},S=(t=600,l=o.rng,v)=>{const p=new e.InstancedBufferGeometry;p.setAttribute("position",new e.BufferAttribute(new Float32Array([0,0,0,-.5,.5,0,.5,.5,0,-1,.86,0,1,.86,0,0,1,0]),3)),p.setIndex([0,1,2,1,3,2,2,3,4,3,5,4]);const w=new Float32Array(t*4);for(let H=0;H<t*4;H++)w[H]=l();p.setAttribute("iSeed",new e.InstancedBufferAttribute(w,4)),p.instanceCount=t;const C=new e.Mesh(p,f(v));return C.frustumCulled=!1,C},X=(t,l=o.rng,v=1,p=0)=>{const w=new e.InstancedBufferGeometry,C=[],H=[],g=(I,te,ae,$,V,G,J)=>{const U=C.length/3;C.push(I,te,J,ae,$,J,V,G,J),H.push(U,U+1,U+2)};g(-.4,0,.4,0,0,.17,1),g(-.4,0,0,-.09,.4,0,1),g(-.22,.02,0,.07,-.42,.47,0),g(.22,.02,0,.07,.42,.47,0),g(-.34,0,-.14,.04,-.62,.23,0),g(.34,0,.14,.04,.62,.23,0),g(-.1,.58,.1,.58,0,.8,1),g(-.1,.58,0,.43,.1,.58,1),w.setAttribute("position",new e.BufferAttribute(new Float32Array(C),3)),w.setIndex(H);const u=t.length/3,c=new Float32Array(u*4);for(let I=0;I<u;I++)c[I*4]=t[I*3],c[I*4+1]=t[I*3+1],c[I*4+2]=t[I*3+2],c[I*4+3]=l();w.setAttribute("iSeed",new e.InstancedBufferAttribute(c,4)),w.instanceCount=u;const z=new e.Mesh(w,d());return z.material.uniforms.uSz.value=v,z.material.uniforms.uMinH.value=p,z.frustumCulled=!1,z},D=new e.Vector2(1e6,1000300),N=D.clone(),y=new e.Vector2;let P=-1;return{palette:s,uniforms:x,sun:K,side:r,cloudFoot:q,glsl:{COMMON:Q,INK_VERT:se},cel:M,ground:E,sky:L,cloudMat:W,rainMat:f,splashMat:d,paint:T,inkOf:B,makeCloud:k,makeNearCloud:a,curtainMat:i,makeSky:F,makeRoof:Y,makeRain:S,makeSplashes:X,setShadow:(t,l=t+300)=>{D.set(t,l)},setRoof:(t,l,v)=>{x.uRoof.value.set(t,l,v,0)},setRain:t=>{x.uRain.value=t},update:(t,l,v)=>{const p=Math.floor(l*12)/12;if(x.uTime.value=l,x.uTq.value=p,x.uBoil.value=Math.floor(l*4)%64,(Math.abs(D.x-N.x)>60||Math.abs(D.y-N.y)>60)&&N.copy(D),p!==P&&(x.uShadow.value.z=N.x,x.uShadow.value.w=N.y,N.copy(D),P=p),x.uShadow.value.x=D.x,x.uShadow.value.y=D.y,v){o.renderer.getDrawingBufferSize(y);const w=Math.abs(v.projectionMatrix.elements[5])||1.6;x.uPx.value=2/(w*Math.max(y.y,1)),x.uRes.value.copy(y)}}}}async function ue(o,b,A){const n=[],s=b.distance,K=[s*1.32,s,s*.7],x=Math.cos(b.azimuth),R=Math.sin(b.azimuth)*b.side,M=[-x,R],T=(a,i,f,d,h,k,F,S=.4,X=1)=>{const D=K[a],N=D/s*1e3*b.scale;n.push({layer:a,key:a*100-f+(F>.8?-.6:0),x:R*D+M[0]*i*N,y:f*N,z:x*D+M[1]*i*N,rx:d*N,ry:(h||d)*N,phase:o()*6.283,grow:F,gx:S,gy:X,bias:k,seed:o(),base:.9*N,haze:a===0?.06:0,shelf:1*N})},B=o.range(-.25,.35),q=9+o.range(-.3,.4),E=-8.5-o.range(0,2),L=10.5+o.range(0,3),W=15;for(let a=0;a<W;a++){const i=a/(W-1),f=E+(L-E)*i+o.range(-.3,.3)+B*4,d=Math.min(i,1-i)*2,h=(.45+.75*Math.sqrt(d))*o.range(.9,1.1);T(0,f,q-.25*(1-d)+o.range(-.12,.12),o.range(1.9,2.7),h,.06+.1*i,.35,i>.5?1:-1,.1)}for(let a=0;a<4;a++)T(0,L+B*4+1.5+a*1.6+o.range(-.4,.4),q-.3+o.range(-.15,.15),1.5-a*.22,.3-a*.04,.12,.3,1,0);for(let a=0;a<12;a++){const i=5.6+a/11*2.6;T(0,o.range(-2.6,2.8)+B*(i-1)*.45,i,o.range(1.5,2.1),0,o.range(-.12,.1),.5)}await A.yield();const _=a=>-5.6+3*Math.min(1,Math.max(0,(a-2.2)/4.5)),Y=a=>4.8-2.2*Math.min(1,Math.max(0,(a-2.2)/4.5));for(let a=1.5;a<7.4;a+=.8){const i=_(a),f=Y(a),d=Math.round((f-i)/1.5);for(let h=0;h<=d;h++){const k=h/d,F=i+(f-i)*k+o.range(-.3,.3)+B*(a-1)*.45,S=(h===0||h===d?o.range(.75,1.1):o.range(1.25,1.95))*(1-.03*a);T(1,F,a+o.range(-.25,.25),S,0,-.38+.62*k+o.range(-.08,.08),h===0||h===d?.9:.5,k>.5?.8:-.8,.6)}}for(let a=0;a<6;a++){const i=2.4+a*.95;n.push({...n[n.length-1]});const f=n[n.length-1],d=1e3*b.scale,h=o.range(-1.3,1.1)+B*(i-1)*.45;Object.assign(f,{key:50-i,x:R*s+M[0]*h*d,y:i*d,z:x*s+M[1]*h*d,rx:(3.3-.22*a)*d,ry:(2.3-.1*a)*d,grow:.25,bias:.16,phase:o()*6.283,seed:o()})}await A.yield();const m=[[-7.2,3,1.35],[-3.9,4.6,1.5],[.9,5.3,1.6],[4.3,3.9,1.45],[7.6,2.7,1.2],[10.2,1.9,.9]];for(const[a,i,f]of m){const d=a+o.range(-.7,.7),h=i*o.range(.85,1.15),k=o.range(.05,.3);let F=1.3,S=f*o.range(.95,1.15),X=0;for(;F<h;){const D=(X%2?1:-1)*S*.55;T(2,d+D+k*(F-1),F,S,0,o.range(-.1,.08)+(a<-2?-.12:.04),.6,k,1),X%2&&T(2,d-D*1.5+k*(F-1),F-S*.3,S*.72,0,-.18,.7,-.7,.5),F+=S*.62,S*=.9,X++}T(2,d+k*(h-1),h+S*.2,S*.95,0,.1,1,k,1),T(2,d+k*(h-1)+S*.75,h-S*.35,S*.6,0,.12,1,.9,.5),T(2,d+k*(h-1)-S*.7,h-S*.45,S*.55,0,-.1,1,-.9,.5)}await A.yield();for(let a=0;a<26;a++){const i=o.range(2.2,7.6),f=a%2;T(1,(f?Y(i)+.7:_(i)-.7)+B*(i-1)*.45,i,o.range(.42,.75),0,f?.12:-.3,1,f?1:-1,.5)}return n.sort((a,i)=>a.key-i.key),n}const de=[[520,2050,350],[150,2950,440],[1200,3150,470],[780,4500,580],[2200,4900,620],[260,7e3,780],[2050,7500,840]];function he(o,b,A,n){const r=[],s=[];for(const[R,M,T]of de){const B=T*o.range(.94,1.06),q=-R*b.side,E=M,L=Math.hypot(q,E),W=Math.min(.3,L/3e4),_=Math.hypot(q,E-500),Y=-(E-500)/_,m=q/_;for(let i=0;i<7;i++){const f=i/6-.5,d=f*B*.9+o.range(-.07,.07)*B,h=1-3.4*f*f,k=B*(.15+.19*h)*o.range(.85,1.15);r.push({key:-L+i*.01+h,x:q+Y*d,y:285+k*.3+h*.21*B*o.range(.5,1.2),z:E+m*d,rx:k*1.15,ry:k,phase:o()*6.283,grow:.7,gx:o.range(-.5,.5),gy:1,bias:.06+.2*f,seed:o(),base:285,haze:W,shelf:.085*B,drift:1})}const a=285+.2*B;s.push([q-n.x/n.y*a,E-n.z/n.y*a,.56*B,.38*B])}r.sort((R,M)=>R.key-M.key);for(const R of r)A.push(R);return s}function ce(o,b){const A=o.palette,n=[],r=new e.Object3D,s=m=>{const a=new e.BufferGeometry;return a.setAttribute("position",new e.BufferAttribute(new Float32Array(m),3)),a.computeVertexNormals(),a},K=(m,a)=>{n.push(m,o.inkOf(m,{card:a}))},x=new e.CylinderGeometry(.045,.07,2.7,5,1,!0).toNonIndexed();x.translate(0,1.35,0),K(o.paint(x,A.green,A.greenShade),!1),[[.8,.4,1],[1.25,2.3,.92],[1.7,3.9,.82],[2.12,5.5,.7]].forEach(([m,a,i],f)=>{const d=i*.3,h=s([0,0,0,i*.42,.1*i,d,i,-.05*i,0,0,0,0,i,-.05*i,0,i*.42,.1*i,-d]);r.position.set(0,m,0),r.rotation.set(0,a,-.72,"YXZ"),r.scale.setScalar(1),r.updateMatrix(),h.applyMatrix4(r.matrix),h.computeVertexNormals();const k=h.attributes.normal;for(let F=0;F<k.count;F++){const S=k.getY(F)<0?-.7:.7;k.setXYZ(F,S*k.getX(F),S*k.getY(F)+.45,S*k.getZ(F))}K(o.paint(h,f%2?A.greenHi:A.green,A.greenShade,f===3?(F,S,X,D)=>D===2||D===4?1:0:0),!0)});const M=[],T=[],B=14,q=.17,E=.6;for(let m=0;m<B;m++){const a=(m-.42)/B*6.2832,i=(m+.42)/B*6.2832,f=m/B*6.2832,d=E*(.9+.2*b());M.push(Math.cos(a)*q*.9,Math.sin(a)*q*.9,0,Math.cos(i)*q*.9,Math.sin(i)*q*.9,0,Math.cos(f)*d,Math.sin(f)*d,0)}{const m=[0,1,2,3,4,5].map(a=>[Math.cos(a*1.0472+.3)*E*.7,Math.sin(a*1.0472+.3)*E*.7,.012]);for(const[a,i,f]of[[0,1,2],[0,2,3],[0,3,4],[0,4,5]])M.push(...m[a],...m[i],...m[f])}for(let m=0;m<6;m++){const a=m/6*6.2832,i=(m+1)/6*6.2832;T.push(0,0,.03,Math.cos(a)*q,Math.sin(a)*q,.03,Math.cos(i)*q,Math.sin(i)*q,.03)}const L=new e.Vector3(-.42*o.side,.34,-.84).normalize();r.position.set(0,2.74,-.05),r.scale.setScalar(1),r.quaternion.setFromUnitVectors(new e.Vector3(0,0,1),L),r.updateMatrix();const W=s(M),_=s(T);W.applyMatrix4(r.matrix),_.applyMatrix4(r.matrix);for(const m of[W,_]){const a=m.attributes.normal;for(let i=0;i<a.count;i++)a.setXYZ(i,L.x,L.y,L.z)}K(o.paint(W,A.petal,A.ochre),!0),K(o.paint(_,A.disc,A.discShade),!0);const Y=ne(n,!1);return n.forEach(m=>m.dispose()),Y}async function ve(o,b={}){const A=o.rng,n=b.detail??o.quality?.detail??1,r=b.style||le(o,b),s=r.side,K=r.palette,x=new e.Group;x.name="the-tall-cloud";const R=b.stage!==!1,M={distance:b.distance||14500,azimuth:(b.azimuth??28)*Math.PI/180,side:s,scale:b.cloudScale||1};r.cloudFoot.set(Math.sin(M.azimuth)*s*M.distance*1.03,Math.cos(M.azimuth)*M.distance*1.03,7200*M.scale,3100*M.scale),await o.yield();let T=null;b.sky!==!1&&(T=r.makeSky(),x.add(T)),await o.yield();const B=await ue(A.fork("cloud"),M,o);await o.yield(),b.cumulus!==!1&&he(A.fork("cumulus"),M,B,r.sun).forEach((y,P)=>r.uniforms.uCum.value[P].set(y[0],y[1],y[2],y[3])),await o.yield();const q=r.makeCloud(B);x.add(q),await o.yield();const E=r.makeRoof();x.add(E),await o.yield();const L=new e.Vector3(0,24,230);let W=null,_=null;if(R){const y=new e.CircleGeometry(3e4,96);y.rotateX(-Math.PI/2),W=new e.Mesh(y,r.ground({rowNear:0})),W.frustumCulled=!1,x.add(W),await o.yield();const P=A.fork("plants"),O=ce(r,P),j=24,t=Math.round(40*n),l=new e.Object3D;_=new e.InstancedMesh(O,r.cel({lean:1,inkCap:.03}),j*t),_.frustumCulled=!1;for(let v=0,p=0;v<j;v++){for(let w=0;w<t;w++,p++){l.position.set((v-j/2+.5)*1.5+P.range(-.12,.12),0,L.z-22+(w+P())*44/t),l.rotation.set(0,P.range(-.3,.3),0);const C=P.range(.85,1.12);l.scale.set(C,C*P.range(.92,1.1),C),l.updateMatrix(),_.setMatrixAt(p,l.matrix)}v%6===5&&await o.yield()}x.add(_)}await o.yield();let Y=null,m=null;if(b.rain!==!1){const y=A.fork("rain");if(Y=r.makeRain(Math.round(1100*n),y),x.add(Y),R){const P=Math.round(200*n),O=new Float32Array(P*3);for(let j=0;j<P;j++){const t=j%3===0;O[j*3]=L.x+y.range(-34,34),O[j*3+1]=t?y.range(1.2,2.9):.04,O[j*3+2]=L.z+y.range(-40,40)}m=r.makeSplashes(O,y),x.add(m)}}await o.yield();const a=new e.Vector3(-16*s,28,575),i=10*Math.PI/180;let f=null;b.ring!==!1&&(f=new e.Mesh(new e.RingGeometry(7,12.2,96,1),new e.ShaderMaterial({uniforms:{uInk:{value:K.ringInk}},side:e.DoubleSide,vertexShader:"varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`uniform vec3 uInk; varying vec2 vP;
        float h(float n){ return fract(sin(n*12.9898)*43758.5453); }
        void main(){ float r = length(vP), a = atan(vP.y, abs(vP.x) < 1e-5 ? 1e-5 : vP.x);
          float br = h(floor(a*46.)), sweep = fract(a/6.2832 + 0.37);
          float edge = 10.3 + 0.5*sin(a*3. + 1.) + 1.3*br*smoothstep(0.55, 1., sweep) + 0.25*h(floor(a*120.));   // the stroke runs dry toward its end
          if (r > edge || (r > 9.6 && h(floor(a*150.) + floor(r*3.)*7.) < 0.5*smoothstep(0.6, 1., sweep)*smoothstep(9.6, 10.8, r))) discard;
          gl_FragColor = vec4(uInk, 1.); }`})),f.position.copy(a),f.rotation.set(i,0,0),x.add(f));const d=b.crossA||[17,230],h=b.crossB||[25.5,349],k=b.edgeSpeed||20;let F=!1;const S=y=>{F=!0,r.setShadow(d[1]+(d[0]-y)*k,h[1]+(h[0]-y)*k);const P=(t,l)=>Math.min(1,Math.max(0,(y-t)/(l-t))),O=P(d[0]+.8,d[0]+4),j=1-P(h[0]-1.5,h[0]+2);r.setRain(b.weather==="dry"?0:O*O*(3-2*O)*j)},X=y=>{S((y+5)%40),F=!1};X(12);const D=new e.Vector3(Math.sin(M.azimuth)*s*M.distance,3200*M.scale,Math.cos(M.azimuth)*M.distance),N={portalSeat:{position:a.clone(),facing:new e.Vector3(0,-Math.sin(i),-Math.cos(i)),radius:7,tilt:i},flyThrough:[[0,38,0],[0,38,60],[0,9,140],[0,9,330],[-16*s,9,470],[-16*s,28,575]].map(y=>new e.Vector3(...y)),cloudPoi:D,cloudFoot:new e.Vector3(D.x,0,D.z),sun:r.sun.clone(),right:new e.Vector3(-s,0,0),edgeCross:new e.Vector3(0,9,d[1]),edgeLeave:new e.Vector3(0,9,h[1]),viewpoints:{entry:new e.Vector3(0,38,0),overFlowers:new e.Vector3(0,9,200),stage:L.clone()}};return{object:x,radius:12,height:90,center:L,anchors:N,style:r,ground:!R,groundY:0,parts:{sky:T,cloud:q,roof:E,groundMesh:W,plants:_,rain:Y,splashes:m,ring:f},setClock:S,setProgress:y=>S(y*40),setShadow:(y,P)=>{F=!0,r.setShadow(y,P)},setRain:r.setRain,update(y,P,O){F||X(P),b.style||r.update(y,P,O)},dispose(){}}}export{ve as buildHero,le as makeStyle,ce as makeSunflower};
