import*as h from"three";import{PP as I,CLOUDS as re,NINE_LAW as Z,BOAT_R as Se,BOAT_H as B,SEA as Re,layRoad as be}from"./pelican-peloton-plan.js";import{SKY as ze,BANK as T,FOOT as ce,GLIDE as F,DIVE as x,ROOST as ee,WATCH as te,PENNANT as Q,clearLanes as Ee,seaBank as le,bankFoot as ue,bedGoes as $e,gliderLines as Le,courseLength as ke,roostPlaces as Pe,keepDivers as Ce,diverKeeps as Te,linePlaces as _e,cloudSide as Ie,NINE_SEA as W,watchers as Oe,pennantPoles as De}from"./pelican-peloton-plan-sea.js";import{makeDiscs as Ne,PP_GLSL as fe,lineOf as pe,flatMaterial as G,makeBuilder as j,ball as O,tube as k,stroke as X,plate as se,finish as he,appendHulls as xe,setInstances as Fe}from"./pelican-peloton.js";const M=Math.PI/180,e=t=>Number(t).toFixed(5),q=t=>t._seaRoad||(t._seaRoad=be()),_=t=>new h.Vector3(t[0],t[1],t[2]),de={LOW:5,LINE_PT:I.LINE_PT[0]},Me=`
  varying vec3 vDir;
  void main(){
    vDir = position;
    vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.);
    if (abs(p.w) < 1e-4) p.w = 1e-4;
    gl_Position = p.xyww;
  }`,We=`
  uniform vec3 uSky, uLow, uSun, uHalo, uSeaFar, uInk, uSunDir;
  uniform vec4 uAng;                 // radians: the pale band's top, the sun's radius, the halo's radius; w 1 with the sun on the dome, 0 without
  uniform float uResY, uLinePt;
  varying vec3 vDir;
  float over(float x, float x0, float px){ return clamp((x - x0) / px + 0.5, 0., 1.); }   // 1 where x is over x0, one pixel of edge
  void main(){
    vec3 d = vDir / max(length(vDir), 1e-4);
    float px = clamp(max(length(dFdx(d)), length(dFdy(d))), 1e-5, 0.05);   // the angle one pixel covers, taken once
    float el = atan(d.y, max(length(d.xz), 1e-5));                         // elevation over the horizon
    float lc = length(cross(d, uSunDir)), dc = dot(d, uSunDir);
    float ang = atan(lc, dc + (lc + abs(dc) < 1e-6 ? 1e-6 : 0.));           // the angle to the sun's middle
    vec3 col = mix(uLow, uSky, over(el, uAng.x, px));
    col = mix(col, uHalo, uAng.w * (1. - over(ang, uAng.z, px)));
    col = mix(col, uSun, uAng.w * (1. - over(ang, uAng.y, px)));
    col = mix(uSeaFar, col, over(el, 0., px));
    // the horizon's dark line stands wholly over the horizon, so the sea fan's far rim never lies on it
    float hw = 0.5 * uLinePt * max(uResY / 450., 1.);
    col = mix(col, uInk, clamp(hw + 0.5 - abs(el / px - hw), 0., 1.));
    gl_FragColor = vec4(col, 1.);
  }`;function lt(t,o,a={}){const i=a.domeSun!==!1,s=t.U||{},n=(o&&o.isVector3?o.clone():_(o||[.6486,.1392,.7483])).normalize(),p=new h.ShaderMaterial({uniforms:{uSky:{value:_(t.col("sky"))},uLow:{value:_(t.col("skyLowBand"))},uSun:{value:_(t.col("sun"))},uHalo:{value:_(t.col("halo"))},uSeaFar:{value:_(t.col("seaFar"))},uInk:{value:_(t.col("ink"))},uSunDir:{value:n},uAng:{value:new h.Vector4(de.LOW*M,I.SUN_R*M,I.HALO_R*M,i?1:0)},uResY:s.uResY||{value:450},uLinePt:{value:de.LINE_PT}},vertexShader:Me,fragmentShader:We,side:h.BackSide,depthTest:!0,depthWrite:!1}),r=new h.Mesh(new h.BoxGeometry(2,2,2),p);return r.name="pp-sky",r.renderOrder=-10,r.frustumCulled=!1,{mesh:r,update:(u,f)=>{f&&r.position.copy(f)},domeSun:i}}const z={RINGS:[6,20,60,160,420,1100,2600,4800],SEGS:48,FAR:900,SLIDE:1.5,TRAVEL:-130,W:.22,PT:[2,4],KEEP:.55,BEND:[.045,.085],ROAD:[6,8],ROAD_AT:[3,4.5],LAT:[[5,5,2.5,4,-18.5,0,1],[11,15,5,7.5,18.5,0,1],[22,45,10,15,-7,0,1],[45,135,20,30,11,300,1],[90,405,40,60,0,300,.7],[130,1100,60,90,5,300,.4],[280,3e3,120,190,-4,300,.25]],SHOAL:"#1C6B94"},Y=[Math.sin(z.TRAVEL*M),Math.cos(z.TRAVEL*M)],ne=[Y[1],-Y[0]],Ge=`
  varying vec3 vW;
  void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,qe=`
  // set once in main: the crests' frame's metres one pixel covers across (gCa) and down (gCb) the picture, the metres
  // a pixel covers along a crest and across it, the points' size in pixels, the slide so far
  vec2 gCa, gCb, gSlide; float gFx, gFy, gPt;
  vec4 ppHash(vec2 p){
    vec4 q = fract(vec4(p.xyxy) * vec4(.1031, .1030, .0973, .1099));
    q += dot(q, q.wzxy + 33.33);
    return fract((q.xxyz + q.yzzw) * q.zywx);
  }
  // 0..1: a place of the water lies under the sun as the eye sees it (the sun a direction, or a place of the world)
  float ppRoad(vec2 at){
    vec2 b = uSunAt.w > 0.5 ? uSunAt.xz - uCam.xz : uSunAt.xz, v = at - uCam.xz;
    return smoothstep(uRoad.y, uRoad.x, dot(v / max(length(v), 1e-4), b / max(length(b), 1e-4)));
  }
  // ONE CELL'S STROKE. f: the pixel in the crests' frame, metres about the cell's middle (x along the crest, y the way
  // the strokes slide); id: the cell; len: the least and greatest length; L: the cell; road: the cell's share of the
  // sun's road; fade: the lattice's size by the footprint. A stroke grows from nothing and draws in to nothing by its
  // SIZE (never by going pale): by its own life on the world's time, by the footprint, and in the sun's road.
  float ppStroke(vec2 f, vec2 id, vec2 len, vec2 L, float road, float fade, float keep){
    vec4 h = ppHash(id);
    float ph = uTime / (5. + 4. * h.z) + 7. * h.x, cyc = floor(ph); ph -= cyc;
    vec4 g = ppHash(id + 37. * cyc + 11.);                               // each life of a stroke in a new place of its cell
    float size = smoothstep(0., 0.22, ph) * (1. - smoothstep(0.72, 1., ph)) * (h.w < uDense * keep ? 1. : road) * fade;
    float hl = 0.5 * mix(len.x, len.y, g.z) * size, hs = max(hl, 1e-3), bend = mix(${e(z.BEND[0])}, ${e(z.BEND[1])}, g.w);
    vec2 p = f - vec2((g.x - 0.5) * 0.6 * L.x, (g.y - 0.5) * 0.4 * L.y);
    float F = p.y - bend * (hs - p.x * p.x / hs);                        // the bowed line, in metres across it
    vec2 gr = vec2(2. * bend * p.x / hs, 1.);
    float G = max(length(vec2(dot(gr, gCa), dot(gr, gCb))), 1e-6);       // F a pixel
    // half the width in pixels: held between the two points, and never over a third of the half length (a stroke that
    // is drawing in keeps a dash's shape: it grows small, it does not grow stubby)
    float hw = min(0.5 * clamp(${e(z.W)} * length(gr) / G, ${e(z.PT[0])} * gPt, ${e(z.PT[1])} * gPt), hl / (3. * gFx));
    float d2 = (abs(p.x) - hl) / gFx;                                    // pixels beyond the stroke's end
    return clamp(hw + 0.5 - length(vec2(abs(F) / G, max(d2, 0.))), 0., 1.) * clamp(2. * hw, 0., 1.);
  }
  // ONE LATTICE. ws: the pixel's place less the slide; a1: the lattice's own row axis in the world; tr: its turn against
  // the crests (cos, sin); L: the cell; len: the strokes' lengths; gone: see SEA.LAT. Rows are staggered; the pixel's own
  // cell and its nearer neighbour along the row are read (a stroke reaches no further). road: the stroke's share of the sun's road
  float ppLattice(vec2 ws, vec2 a1, vec2 tr, vec2 L, vec2 len, float salt, float gone, float keep, out float road){
    vec2 a2 = vec2(-a1.y, a1.x), q = vec2(dot(ws, a1), dot(ws, a2));
    float row = floor(q.y / L.y), stag = L.x * fract(row * 0.6180340 + salt);
    vec2 id = vec2(floor((q.x + stag) / L.x), row), mid = (id + 0.5) * L - vec2(stag, 0.), f = q - mid;
    float side = f.x < 0. ? -1. : 1.;
    vec2 midW = mid.x * a1 + mid.y * a2 + gSlide;
    float r1 = ppRoad(midW), r2 = ppRoad(midW + side * L.x * a1);
    float rows = L.y / gFy, lpx = len.x / gFx;                           // pixels from row to row; pixels a short stroke is long
    float fade = smoothstep(4., 9., rows) * smoothstep(4., 9., lpx) * (1. - step(0.5, gone) * smoothstep(gone, 2.5 * max(gone, 1.), rows));
    vec2 fc = vec2(tr.x * f.x - tr.y * f.y, tr.y * f.x + tr.x * f.y);    // into the crests' frame
    float c1 = ppStroke(fc, id + 91. * salt, len, L, r1, fade, keep), c2 = ppStroke(fc - side * L.x * tr, id + vec2(side, 0.) + 91. * salt, len, L, r2, fade, keep);
    road = smoothstep(0.3, 0.7, c1 > c2 ? r1 : r2);
    return max(c1, c2);
  }`,Ue=z.LAT.map(([t,o,a,i,s,n,p],r)=>{const c=s*M,u=Math.cos(c),f=Math.sin(c),w=[u*ne[0]+f*Y[0],u*ne[1]+f*Y[1]];return`c = ppLattice(ws, vec2(${e(w[0])}, ${e(w[1])}), vec2(${e(u)}, ${e(f)}), vec2(${e(t)}, ${e(o)}), vec2(${e(a)}, ${e(i)}), ${e(.13+.17*r)}, ${e(n)}, ${e(p)}, rd); col = mix(col, mix(uStroke, uSun, rd), c);`}).join(`
    `),He=`
  uniform vec3 uSea, uSeaFar, uStroke, uSun, uShoalCol, uCam;
  uniform vec4 uSunAt, uShoal;       // the sun: xyz and w 1 a place of the world, w 0 a direction; the shoal: x, z, radius, 1 when it is there
  uniform vec2 uRoad;                // the cosines of the sun's road's two angles (whole within, gone at)
  uniform float uTime, uResY, uDense;
  varying vec3 vW;
  ${qe}
  void main(){
    vec2 w = vW.xz;
    vec2 Jx = clamp(dFdx(w), -1e4, 1e4), Jy = clamp(dFdy(w), -1e4, 1e4);   // the pixel's footprint on the water: taken once, first
    vec2 e1 = vec2(${e(ne[0])}, ${e(ne[1])}), e2 = vec2(${e(Y[0])}, ${e(Y[1])});
    gPt = max(uResY / 450., 1.);
    gCa = vec2(dot(Jx, e1), dot(Jx, e2)); gCb = vec2(dot(Jy, e1), dot(Jy, e2));
    gFx = max(length(vec2(gCa.x, gCb.x)), 1e-6); gFy = max(length(vec2(gCa.y, gCb.y)), 1e-6);
    gSlide = e2 * (${e(z.SLIDE)} * uTime);
    vec2 ws = w - gSlide;
    vec2 v = w - uCam.xz; float r = length(v); vec2 vn = v / max(r, 1e-4);
    float Gr = max(length(vec2(dot(vn, Jx), dot(vn, Jy))), 1e-4);          // metres of distance a pixel covers
    vec3 col = mix(uSea, uSeaFar, clamp((r - ${e(z.FAR)}) / Gr + 0.5, 0., 1.));
    // the shoal: a dark round patch whose rim sways a little on the world's time
    vec2 sv = w - uShoal.xy; float sr = length(sv); vec2 sn = sv / max(sr, 1e-4);
    float sway = 1. + 0.04 * sin(sv.x * 0.21 + uTime * 0.5) + 0.04 * sin(sv.y * 0.17 - uTime * 0.37);
    float Gs = max(length(vec2(dot(sn, Jx), dot(sn, Jy))), 1e-4);
    col = mix(col, uShoalCol, uShoal.w * (1. - clamp((sr - uShoal.z * sway) / Gs + 0.5, 0., 1.)));
    float rd = 0., c = 0.;
    ${Ue}
    gl_FragColor = vec4(col, 1.);
  }`;function ut(t,o,a={}){const i=t.U||{},s=(o&&o.isVector3?o.clone():_(o||[.6486,.1392,.7483])).normalize(),n=a.sunAt||null,p=n?new h.Vector4(n.x??n[0],n.y??n[1],n.z??n[2],1):new h.Vector4(s.x,s.y,s.z,0),r=Math.min(1,Math.max(.6,(a.strokes??2400)/2400)),c=a.shoal,u=new h.Color(z.SHOAL),f={value:0},w={value:new h.Vector3(0,I.ROAD_Y0+I.LENS_H,0)},m=new h.ShaderMaterial({uniforms:{uSea:{value:_(t.col("sea"))},uSeaFar:{value:_(t.col("seaFar"))},uStroke:{value:_(t.col("stroke"))},uSun:{value:_(t.col("sun"))},uShoalCol:{value:new h.Vector3(u.r,u.g,u.b)},uSunAt:{value:p},uShoal:{value:c?new h.Vector4(c.x,c.z,c.r,1):new h.Vector4(0,0,1,0)},uCam:w,uTime:f,uResY:i.uResY||{value:450},uDense:{value:z.KEEP*r},uRoad:{value:new h.Vector2(Math.cos((n?z.ROAD_AT:z.ROAD)[0]*M),Math.cos((n?z.ROAD_AT:z.ROAD)[1]*M))}},vertexShader:Ge,fragmentShader:He,side:h.FrontSide}),A=[0,0,0],g=[],v=z.SEGS,$=z.RINGS;for(let S=0;S<$.length;S++)for(let R=0;R<v;R++){const C=R/v*2*Math.PI;A.push(Math.cos(C)*$[S],0,Math.sin(C)*$[S])}for(let S=0;S<v;S++)g.push(0,1+(S+1)%v,1+S);for(let S=0;S+1<$.length;S++)for(let R=0;R<v;R++){const C=1+S*v+R,P=1+S*v+(R+1)%v,H=C+v,ae=P+v;g.push(C,P,H,P,ae,H)}const N=new h.BufferGeometry;N.setAttribute("position",new h.BufferAttribute(new Float32Array(A),3)),N.setIndex(g);const L=new h.Mesh(N,m);L.name="pp-sea",L.frustumCulled=!1,L.renderOrder=-5,L.position.set(0,I.SEA_Y,0);const d=new h.Group;return d.name="pp-sea-group",d.add(L),{group:d,update:(S,R)=>{f.value=S,R&&(w.value.copy(R),L.position.set(R.x,I.SEA_Y,R.z))},sunAt:p}}const D={LINE:pe(40),BACK:25,BACK_SHARE:.12,BACK_DRIFT:80,COL:{A:"stroke",B:"stroke",C:"stroke",D:"pelicanShade",E:"stroke",fog:"stroke",far:"stroke",high:"stroke",shade:"pelicanShade"},UNDER:{D:14}},ve=`
  if (iO.z < 0.5) {                                                    // a drifting cloud's circle: along its window, about the cloud's middle
    float w = max(iL.z, 1.);
    c.xz += iL.xy * (w * (0.5 - 0.5 * cos(uTime * ${e(2*ze.SPEED)} / w + 6.2831853 * iL.w)) + iO.x); c.y += iO.y;
  } else {                                                             // a circle of the standing bank: it swells and settles
    float o2 = fract(iO.w * 7.3 + 0.19), sw = 1. - iO.x;               // (iO.x: the share of the swell a circle of THE BED leaves out; the old rows 0)
    c.y += ${e(T.SW_Y)} * sw * r * sin(uTime * 6.2831853 / mix(${e(T.PER_Y[0])}, ${e(T.PER_Y[1])}, o2) + 6.2831853 * o2);
    r *= 1. + ${e(T.SW_R)} * sw * sin(uTime * 6.2831853 / mix(${e(T.PER_R[0])}, ${e(T.PER_R[1])}, iO.w) + 6.2831853 * iO.w);
    if (iL.w > 0.) {                                                   // a shaded row: held iL.w m further off at the same size on the picture (as the line is), so white lies over it whole
      vec3 tc = c - cameraPosition; float l0 = max(length(tc), 1e-4); c += tc / l0 * iL.w; r *= (l0 + iL.w) / l0;
    }
  }`;function Be(t,o){const a=o.length,i=new Float32Array(a*4),s=new Float32Array(a*4),n=new Float32Array(a*4),p=new Float32Array(a*4),r=new h.InstancedBufferGeometry;o.forEach((m,A)=>{const g=t.col(D.COL[m.row]||"stroke"),v=D.UNDER[m.row]||0;i.set([m.x,m.y,m.z,m.r],A*4),s.set([g[0],g[1],g[2],ce.LIFT[v>0?1:2]],A*4),n.set([0,0,1,v],A*4),p.set([1-(m.sw??1),0,1,m.own],A*4)}),r.setAttribute("position",new h.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),r.setIndex([0,1,2,0,2,3]);for(const[m,A]of[["iP",i],["iC",s],["iL",n],["iO",p]])r.setAttribute(m,new h.InstancedBufferAttribute(A,4));r.instanceCount=a;const c=m=>new h.ShaderMaterial({uniforms:{...t.U,uRing:{value:m}},side:h.DoubleSide,vertexShader:`
      attribute vec4 iP, iC, iL, iO;
      ${fe}
      uniform float uRing;
      varying vec2 vUv; varying vec3 vCol;
      void main(){
        vec3 c = iP.xyz; float r = iP.w;
        ${ve}
        float h = c.y - ${e(I.SEA_Y)}, w = sqrt(max(r * r - h * h, 0.));          // the ball's own cut with the water
        vec3 f = vec3(c.x, ${e(I.SEA_Y)} + iC.w, c.z), te = f - cameraPosition;
        float hl = length(te.xz);
        vec2 u = hl > 1e-4 ? te.xz / hl : vec2(1., 0.), rad = vec2(w);              // the plan's unit away from the eye
        vCol = iC.rgb;
        if (uRing > 0. && w > 0.) {
          vec2 l = ppLine(uRing, ppPixel(projectionMatrix * viewMatrix * vec4(f, 1.)));
          // the rim's nearest point to the eye (the lobe's own outline on the picture): the line is held by the pixel THERE
          vec3 nr = f - vec3(u.x, 0., u.y) * min(w, 0.8 * hl), tn = nr - cameraPosition;
          vec2 ln = ppLine(uRing, ppPixel(projectionMatrix * viewMatrix * vec4(nr, 1.)));
          float k = 0.75 / max(uLine.x, 0.75), se = clamp(abs(tn.y) / max(length(tn), 1e-4), 0.12, 1.);
          rad = vec2(w + ln.x * mix(k, 1., ln.y) / se, w + l.x * mix(k, 1., l.y));
          vCol = mix(iC.rgb, uInk, l.y); f.y = ${e(I.SEA_Y+ce.LIFT[0])};
        }
        vUv = position.xy;
        vec2 q = u * (position.x * rad.x) + vec2(-u.y, u.x) * (position.y * rad.y);
        gl_Position = projectionMatrix * viewMatrix * vec4(f.x + q.x, f.y, f.z + q.y, 1.);
      }`,fragmentShader:`
      varying vec2 vUv; varying vec3 vCol;
      void main(){ float d = dot(vUv, vUv); gl_FragColor = vec4(vCol, 1.); if (d > 1.) discard; }`}),u=new h.Group;u.name="pp-bank-foot";const f=new h.Mesh(r,c(D.LINE));f.frustumCulled=!1,f.name="pp-bank-foot-line",f.renderOrder=-1,u.add(f);const w=new h.Mesh(r,c(0));return w.frustumCulled=!1,w.name="pp-bank-foot-fill",u.add(w),u}function*ft(t){const o=q(t);yield*$e(o),yield,le(o),ue(o)}function pt(t,o,a={}){const i=q(t),s=a.detail??1,n=new h.Group;let p=0,r=0;const c=(d,E,S,R,C,P=0)=>{d.length&&(n.add(Ne(d,t,{ring:D.LINE,back:R,backShare:P,name:C,vertexPre:"attribute vec4 iL, iO;",vertexMove:ve,attributes:{iL:{array:E,size:4},iO:{array:S,size:4}}})),p+=d.length,r+=2)},u=Ee(o&&o.lanes||[],i),f=[],w=[],m=[];for(const d of u.lanes){const E=(d.b[0]-d.a[0])/re.LEN,S=(d.b[2]-d.a[2])/re.LEN;d.circles.forEach((R,C)=>{const P=Ie(d,C);f.push({p:[d.a[0]+E*d.t0+S*P,d.y,d.a[2]+S*d.t0-E*P],r:R.r,col:"stroke"}),w.push(E,S,d.t1-d.t0,d.phase),m.push(R.along,R.up,0,0)})}c(f,w,m,D.BACK_DRIFT,"pp-clouds");const A=le(i).filter(d=>s>=1||!(d.row==="fog"||d.row==="far")||d.own<.4+.6*s),g=[],v=[],$=[];for(const d of A)g.push({p:[d.x,d.y,d.z],r:d.r,col:D.COL[d.row]||"stroke"}),v.push(0,0,1,D.UNDER[d.row]||0),$.push(1-(d.sw??1),0,1,d.own);c(g,v,$,D.BACK,"pp-bank",D.BACK_SHARE);const N=new Set(ue(i)),L=A.filter(d=>N.has(d));return L.length&&(n.add(Be(t,L)),p+=L.length,r+=2),n.name="pp-sky-clouds",{group:n,update(){},counts:{lanes:u.lanes.length,leftOut:u.leftOut+(o&&o.leftOut||0),circles:p,bank:A.length,feet:L.length,triangles:p*4,calls:r}}}const b={W:.065,SH:[.36,.14,.25],WR:[1.45,.2],TIP:2.8,SWEEP:.7,LEGS:ee.LEGS};b.FOLD=(Z.FOLDED-b.SH[0])/(b.TIP-b.SH[0]);const l=(t,o,a)=>new h.Vector3(t,o,a),V=l(1,0,0),U=l(0,0,1);function ge(t,o,a){const i=c=>o.col(c),s=b.W,n=b.SH,p=b.WR,r={part:20};O(t,l(0,0,0),[.42,.98,.36],{...r,axis:U,side:V,nseg:a?5:7,nring:a?3:4,col:i("brownBack"),line:s}),a?k(t,[l(0,.1,.64),l(0,.34,1.16)],[.24,.21],{...r,nseg:4,col:i("brownHead"),line:s}):k(t,[l(0,.08,.6),l(0,.28,.98),l(0,.36,1.2)],[.25,.19,.21],{...r,nseg:5,col:i("brownHead"),line:s}),k(t,[l(0,.3,1.3),l(0,.12,2.3)],[.1,.05],{...r,nseg:a?3:4,col:i("straw"),line:a?0:s,cap0:!1}),a||(k(t,[l(0,.3,.62),l(0,.45,.98)],[.12,.1],{...r,nseg:3,flat:.6,col:i("brownNape"),line:0}),O(t,l(0,.5,1.2),[.14,.07,.16],{...r,nseg:4,nring:2,col:i("brownCrown"),line:0}),k(t,[l(0,.16,1.32),l(0,0,1.75),l(0,.05,2.15)],[.08,.12,.03],{...r,nseg:4,flat:.6,col:i("brownPouch"),line:0,cap0:!1})),k(t,[l(0,.02,-.8),l(0,0,-1.3)],[.26,.36],{...r,nseg:a?3:4,flat:.14,col:i("brownBack"),line:a?0:s,cap0:!1});for(const c of[1,-1]){const u={nseg:4,flat:.1,side:U,line:s,cap0:!1};k(t,[l(c*n[0],n[1],n[2]),l(c*p[0],p[1],.32)],[.5,.45],{...u,part:21,col:i("brownBack"),cap1:!1}),k(t,[l(c*p[0],p[1],.32),l(c*2.72,.14,.05)],[.45,.2],{...u,part:22,col:i("wingTip"),round:.4})}}function Ye(t,o){const a=n=>o.col(n),i=b.W,s={part:20};O(t,l(0,.4,0),[.5,.95,.46],{...s,axis:U,side:V,nseg:6,nring:4,col:a("brownBack"),line:i});for(const n of[1,-1])O(t,l(n*.44,.52,-.12),[.1,.82,.34],{...s,axis:U,side:V,nseg:4,nring:2,col:a("brownBack"),line:i});k(t,[l(0,.62,.62),l(0,1.25,.8),l(0,1.72,.66)],[.24,.16,.21],{...s,nseg:5,col:a("brownHead"),line:i}),k(t,[l(0,.8,.46),l(0,1.62,.5)],[.12,.1],{...s,nseg:3,col:a("brownNape"),line:0,cap0:!1,cap1:!1}),O(t,l(0,1.9,.66),[.15,.07,.17],{...s,nseg:4,nring:2,col:a("brownCrown"),line:0}),k(t,[l(0,1.66,.82),l(0,.8,1.22)],[.1,.045],{...s,nseg:4,col:a("straw"),line:i,cap0:!1}),k(t,[l(0,1.5,.8),l(0,.92,1.06)],[.12,.04],{...s,nseg:4,flat:.6,col:a("brownPouch"),line:0,cap0:!1}),k(t,[l(0,.42,-.85),l(0,.46,-1.25)],[.24,.3],{...s,nseg:4,flat:.16,col:a("wingTip"),line:0,cap0:!1});for(const n of[1,-1])X(t,[l(n*.2,.1,-.05),l(n*.2,-b.LEGS,-.05)],.05,{...s})}async function ht(t,o,a={}){const i=j();a.folded?Ye(i,t):ge(i,t,!1);const s=await he(i,o);if(!a.folded){const n=j();ge(n,t,!0),s.userData.lo=await he(n,o)}return s.userData.folded=!!a.folded,s}function K(t,o,a,i,s){const n=new h.InstancedBufferGeometry;n.setIndex(t.index);for(const r of Object.keys(t.attributes))n.setAttribute(r,t.attributes[r]);Fe(n,o);for(const[r,c]of Object.entries(s||{}))n.setAttribute(r,new h.InstancedBufferAttribute(new Float32Array(c),4));const p=new h.Mesh(n,a);return p.frustumCulled=!1,p.name=i,p.userData.triangles=(t.userData.triangles||0)*o.length,p}const ie=`
  void sbWing(inout vec3 p, inout vec3 n, float part, float a, float b, float f){
    if (part > 20.5) {
      float sx = p.x < 0. ? -1. : 1.; vec3 q = vec3(abs(p.x), p.y, p.z), m = vec3(n.x * sx, n.y, n.z);
      vec2 wr = vec2(${e(b.WR[0])}, ${e(b.WR[1])}), sh = vec2(${e(b.SH[0])}, ${e(b.SH[1])});
      if (part > 21.5) { q.xy = ppRot2(q.xy - wr, b) + wr; m.xy = ppRot2(m.xy, b); }
      q.xy = ppRot2(q.xy - sh, a) + sh; m.xy = ppRot2(m.xy, a);
      float k = q.x - sh.x; q.x = sh.x + k * mix(1., ${e(b.FOLD)}, f); q.z -= f * k * ${e(b.SWEEP)};
      p = vec3(q.x * sx, q.y, q.z); n = vec3(m.x * sx, m.y, m.z);
    }
  }
  void sbPlace(inout vec3 p, inout vec3 n, vec3 P, vec3 F, vec3 U, float roll){
    vec3 X = cross(U, F); X = X / max(length(X), 1e-4); vec3 Y = cross(F, X);
    float c = cos(roll), s = sin(roll); vec3 X2 = X * c + Y * s, Y2 = Y * c - X * s;
    p = P + X2 * p.x + Y2 * p.y + F * p.z; n = X2 * n.x + Y2 * n.y + F * n.z;
  }
  vec2 sbBeat(float ph){
    float w = ph / ${e(F.BEAT_SHARE)}, env = smoothstep(0., 0.12, w) * (1. - smoothstep(0.88, 1., w)), a = 6.2831853 * ${e(F.BEATS)} * w;
    return vec2(${e(F.DIHEDRAL)} + ${e(F.FLAP)} * sin(a) * env, ${e(F.TIP)} * sin(a - 1.1) * env);
  }
`,Ve=`
  {
    float cn = iA.y, cu = fract(uTime * iA.w + iA.z) * cn, ci = floor(cu), t = cu - ci, t2 = t * t, t3 = t2 * t;
    vec3 c0 = uCourse[int(iA.x + mod(ci, cn) + 0.5)], c1 = uCourse[int(iA.x + mod(ci + 1., cn) + 0.5)];
    vec3 c2 = uCourse[int(iA.x + mod(ci + 2., cn) + 0.5)], c3 = uCourse[int(iA.x + mod(ci + 3., cn) + 0.5)];
    vec3 P = ((1. - 3. * t + 3. * t2 - t3) * c0 + (4. - 6. * t2 + 3. * t3) * c1 + (1. + 3. * t + 3. * t2 - 3. * t3) * c2 + t3 * c3) / 6.;
    vec3 T = 0.5 * (-(1. - t) * (1. - t) * c0 + (3. * t2 - 4. * t) * c1 + (-3. * t2 + 2. * t + 1.) * c2 + t2 * c3);
    vec3 A = (1. - t) * c0 + (3. * t - 2.) * c1 + (1. - 3. * t) * c2 + t * c3;
    float tl = max(length(T), 1e-4), bend = (T.z * A.x - T.x * A.z) / (tl * tl * tl);
    vec2 bt = sbBeat(fract(uTime / ${e(F.FLAP_T)} + iB.x));
    sbWing(p, n, part, bt.x, bt.y, 0.);
    sbPlace(p, n, P, T / tl, vec3(0., 1., 0.), -clamp(atan(iB.y * iB.y * bend / 9.81), -0.9, 0.9));
  }`;function xt(t,o,a){if(!o)return null;const i=q(t),s=a&&a.length?a:Le(i),n=[],p=[];s.forEach((c,u)=>{const f=n.length,w=c.len||ke(c),m=c.speed||F.SPEED,A=c.n||8,g=c.gap||F.GAP/w;for(const v of c.pts)n.push(new h.Vector3(v[0],v[1],v[2]));for(let v=0;v<A;v++)p.push([f,c.pts.length,(c.at||0)-v*g,m/w,u*.23+v*.09,m,0,0])}),_e(i);const r=G(t.U,{},{vertexPre:`uniform vec3 uCourse[${n.length}];
`+ie,vertexMove:Ve,uniforms:{uCourse:{value:n}}});return K(o,p,r,"pp-gliders")}const y=Z,Ke=`
  uniform vec4 uRing, uG01;
  attribute vec4 iC;
  vec4 nineAt(float q, vec4 gt, vec4 sc, float tipY){
    vec3 P; float f = 0.;
    if (q < ${e(y.Q_GLIDE)}) {
      float a = 1.5707963 + (q - ${e(y.Q_GLIDE)}) / ${e(y.RING_RUN)}, co = cos(a) * ${e(y.RING_R)}, si = sin(a) * ${e(y.RING_R*y.RING_HAND)};
      P = vec3(uRing.x + co * uRing.z + si * uRing.w, ${e(y.RING_Y)}, uRing.y + co * uRing.w - si * uRing.z);
    } else if (q < ${e(y.Q_TIP)}) {
      float e = (q - ${e(y.Q_GLIDE)}) / ${e(y.Q_TIP-y.Q_GLIDE)}, m = 1. - e;
      vec2 g = m * m * m * uG01.xy + 3. * m * m * e * uG01.zw + 3. * m * e * e * gt.xy + e * e * e * gt.zw;
      P = vec3(g.x, mix(${e(y.RING_Y)}, tipY, e * e * (3. - 2. * e)), g.y);
    } else if (q < 0.) {
      float t = (q - ${e(y.Q_TIP)}) / ${e(-y.Q_TIP)}, run = max(length(sc.xy - gt.zw), 1e-6);
      float a = clamp(${e(3*y.ARM/(y.Q_TIP-y.Q_GLIDE)*-y.Q_TIP)} / run, 0., 1.), g = a * t + (1. - a) * t * t;
      vec2 xz = mix(gt.zw, sc.xy, g); P = vec3(xz.x, tipY * (1. - t * t), xz.y); f = clamp(t * 2., 0., 1.);
    } else if (q < ${e(y.Q_UP)}) {
      float t = q / ${e(y.Q_UP)}, g = t * t * (3. - 2. * t); vec2 xz = mix(sc.xy, sc.zw, g);
      P = vec3(xz.x, ${e(-y.DEEP)} * smoothstep(0., 3., q) * (1. - smoothstep(${e(y.Q_UP-6)}, ${e(y.Q_UP)}, q)), xz.y); f = 1.;
    } else {
      float u = q - ${e(y.Q_UP)};
      P = vec3(sc.z, 0.3 + 0.9 * exp(-u / 6.) * sin(u / 2.2) - 0.3 * exp(-u / 4.), sc.w); f = 1.;
    }
    P.y += ${e(W.LIFT)} * clamp(min((q - ${e(W.Q[0])}) / ${e(W.Q[1]-W.Q[0])}, (${e(W.Q[2])} - q) / ${e(W.Q[2]-W.Q[1])}), 0., 1.);   // plan-sea's nineLift
    return vec4(P, f);
  }
`,me=`
    vec3 d1 = b.xyz - a.xyz, d2 = c.xyz - b.xyz, hs3 = vec3(hs.x, 0., hs.y);
    vec3 F = (c.xyz - a.xyz) * (1. - sit) + hs3 * (sit * 4. + 1e-3); F = F / max(length(F), 1e-5);
    float l1 = max(length(d1), 1e-3), bend = (d1.z * d2.x - d1.x * d2.z) / (l1 * l1 * max(length(d2), 1e-3));   // the course's bend, 1 / m
    vec2 bt = sbBeat(beat) * (1. - b.w);
    sbWing(p, n, part, bt.x, bt.y, b.w);
    p *= step(-1.2, b.y);                                              // under the surface nothing of it is drawn
    sbPlace(p, n, b.xyz, F, vec3(0., 1., 0.) + 2. * st * (1. - sit) * hs3, -clamp(atan(bend * 20.), -0.8, 0.8) * (1. - st));`,Qe=`
  {
    float q = uD - iC.x;
    vec4 a = nineAt(q - 2., iA, iB, iC.y), b = nineAt(q, iA, iB, iC.y), c = nineAt(q + 2., iA, iB, iC.y);
    vec2 hs = iB.xy - iA.zw; hs = hs / max(length(hs), 1e-4);
    float st = smoothstep(${e(y.Q_TIP-4)}, ${e(y.Q_TIP+6)}, q), sit = smoothstep(4., 10., q), beat = fract(q / 70. + iC.z);
    ${me}
  }`;function dt(t,o,a){if(!o||!a||!a.length)return null;const i=[],s=[],n=a[0];a.forEach((c,u)=>{i.push([c.glide[2][0],c.glide[2][1],c.tip[0],c.tip[1],c.strike[0],c.strike[1],c.cork[0],c.cork[1]]),s.push(c.di-y.AHEAD,c.tipY,u*.37%1,0)});const p={uRing:{value:new h.Vector4(n.ring.x,n.ring.z,n.ring.tx,n.ring.tz)},uG01:{value:new h.Vector4(n.glide[0][0],n.glide[0][1],n.glide[1][0],n.glide[1][1])}},r=G(t.U,{},{vertexPre:Ke+ie,vertexMove:Qe,uniforms:p});return K(o,i,r,"pp-nine",{iC:s})}const je=`
  attribute vec4 iC;
  vec4 diverAt(float u, vec4 sk, vec4 rg, float hand){
    float R = rg.z, H = rg.w, a1 = atan(sk.y - rg.y, sk.x - rg.x), a0 = a1 - hand * ${e(x.TURN)}; vec3 P; float f = 0.;
    u = fract(u);
    if (u < ${e(x.CIRCLE)}) {
      float a = a0 + hand * ${e(x.TURN)} * (u / ${e(x.CIRCLE)}); P = vec3(rg.x + R * cos(a), H, rg.y + R * sin(a));
    } else if (u < ${e(x.STRIKE)}) {
      float t = (u - ${e(x.CIRCLE)}) / ${e(x.STRIKE-x.CIRCLE)}, g = 0.35 * t + 0.65 * t * t;
      vec2 xz = mix(rg.xy + R * vec2(cos(a1), sin(a1)), sk.xy, g); P = vec3(xz.x, H * (1. - t * t), xz.y); f = clamp(t * 2., 0., 1.);
    } else if (u < ${e(x.UP)}) {
      float t = (u - ${e(x.STRIKE)}) / ${e(x.UP-x.STRIKE)}, g = t * t * (3. - 2. * t); vec2 xz = mix(sk.xy, sk.zw, g);
      P = vec3(xz.x, ${e(-x.DEEP)} * smoothstep(0., 0.15, t) * (1. - smoothstep(0.85, 1., t)), xz.y); f = 1.;
    } else if (u < ${e(x.SIT)}) {
      float t = (u - ${e(x.UP)}) / ${e(x.SIT-x.UP)}; P = vec3(sk.z, 0.3 + 0.6 * sin(3.14159265 * t) * (1. - t), sk.w); f = 1.;
    } else {
      float t = (u - ${e(x.SIT)}) / ${e(1-x.SIT)}; vec2 xz = mix(sk.zw, rg.xy + R * vec2(cos(a0), sin(a0)), t);
      P = vec3(xz.x, mix(0.3, H, t * t * (3. - 2. * t)), xz.y); f = 1. - clamp(t * 4., 0., 1.);
    }
    return vec4(P, f);
  }
`,Xe=`
  {
    float u = fract(uTime / iC.x + iC.y), du = 0.22 / iC.x;
    vec4 a = diverAt(u - du, iA, iB, iC.z), b = diverAt(u, iA, iB, iC.z), c = diverAt(u + du, iA, iB, iC.z);
    // the stoop's bearing in plan, and the bearing of the run it takes off on (from the cork to its ring's first place)
    float a1 = atan(iA.y - iB.y, iA.x - iB.x), a0 = a1 - iC.z * ${e(x.TURN)};
    vec2 run = iB.xy + iB.z * vec2(cos(a0), sin(a0)) - iA.zw; run = run / max(length(run), 1e-4);
    float under = step(${e(x.STRIKE+.02)}, u) * step(u, ${e(x.SIT)});
    float st = smoothstep(${e(x.CIRCLE)}, ${e(x.CIRCLE+.05)}, u) * step(u, ${e(x.STRIKE+.02)}), sit = under, beat = fract(uTime / 2.6 + iC.w);
    vec2 hs = mix(vec2(cos(a1), sin(a1)), run, under);
    ${me}
  }`;function we(t,o,a){const i=q(t),s=Ce(o,i),n=[];return s.rows.forEach((p,r)=>{(!a||!a.length||Te(p,i,a))&&n.push([p,r])}),n.leftOut=s.leftOut+s.rows.length-n.length,n}function vt(t,o,a,i={}){if(!o||!a||!a.length)return null;const s=o.userData.lo||o,n=[],p=[],r=we(t,a,i.boats);for(const[f,w]of r)n.push([f.strike[0],f.strike[1],f.cork[0],f.cork[1],f.ring[0],f.ring[1],f.ringR,f.ringY]),p.push(f.per,f.phase,f.hand,w*.6180339%1);const c=G(t.U,{},{vertexPre:je+ie,vertexMove:Xe});if(!n.length)return null;const u=K(s,n,c,"pp-divers",{iC:p});return u.userData.leftOut=r.leftOut,u}const ye=(t,o,a,i,s,n)=>`
  attribute vec4 iP, iL;
  ${fe}
  uniform vec3 uSurf;
  varying vec2 vUv; varying vec3 vInk; varying vec2 vK;
  void main(){
    float tau = ${t?`(uD - iL.x) / ${e(x.NINE_Q)}`:`(fract(uTime / iL.x + iL.y) - ${e(x.STRIKE)}) * iL.x / ${e(x.SPLASH_T)}`};
    float on = step(0., tau) * step(tau, 1.), k = iL.z, own = iL.w; tau = clamp(tau, 0., 1.);
    vec3 c = vec3(iP.x, ${e(I.SEA_Y)}, iP.y), ax = vec3(0., 1., 0.), sd = vec3(1., 0., 0.); float hw = 0., hh = 0., kind = 0., lineOn = 1.;
    if (k < ${e(x.CROWN-.5)}) {                                 // a tongue of the crown
      float a = 6.2831853 * (own + k / ${e(x.CROWN)}), j = fract(k * 0.618 + own * 3.7), t6 = pow(max(tau, 1e-4), 0.55);
      vec2 d2 = vec2(cos(a), sin(a));
      hh = ${e(.5*x.CROWN_TALL*s)} * (0.6 + 0.4 * j) * sin(3.14159265 * t6) * on;
      hw = ${e(.5*x.CROWN_W*s)} * (0.7 + 0.3 * j) * smoothstep(0., 0.25, sin(3.14159265 * t6)) * on;
      ax = normalize(vec3(d2.x * ${e(x.LEAN)}, 1., d2.y * ${e(x.LEAN)}));
      c.xz += d2 * ${e(s)} * mix(${e(x.CROWN_R[0])}, ${e(x.CROWN_R[1])}, t6); c += ax * hh;
      vec3 te = cameraPosition - c; sd = cross(ax, te); sd = sd / max(length(sd), 1e-4);
    } else if (k < ${e(x.CROWN+o-.5)}) {                   // a drop: up and out, and gone before the water; a tear, its point trailing
      float kd = k - ${e(x.CROWN)}, a = 6.2831853 * (own + (kd + 0.5) / ${e(o)}), mo = ${e(i)} * (0.55 + 0.45 * fract(kd * 0.618 + own)), mt = ${e(a)} * (0.6 + 0.4 * fract(kd * 0.37 + own));
      vec2 d2 = vec2(cos(a), sin(a)); float tq = max(tau, 0.02);
      c.xz += mo * pow(tq, 0.7) * d2; c.y += mt * 4. * tau * (1. - tau);
      vec3 vel = vec3(d2.x * mo * 0.7 * pow(tq, -0.3), mt * 4. * (1. - 2. * tau), d2.y * mo * 0.7 * pow(tq, -0.3));
      ax = -vel / max(length(vel), 1e-4);
      hw = ${e(x.DROP[0]*s+x.DROP[1])} * smoothstep(0., 0.08, tau) * (1. - smoothstep(0.6, 0.9, tau)) * on; hh = ${e(x.DROP[2])} * hw; kind = 1.;
      vec3 te = cameraPosition - c; sd = cross(ax, te); sd = sd / max(length(sd), 1e-4);
    } else {                                                           // a dash of the foam's broken ring
      float kf = k - ${e(x.CROWN+o)}, j = fract(kf * 0.618 + own * 5.1), a = 6.2831853 * (own * 1.7 + (kf + 0.4 * j) / ${e(x.FOAM)});
      float rr = ${e(x.FOAM_R*n)} * sqrt(tau);
      c.xz += rr * vec2(cos(a), sin(a)); c.y += 0.12;
      sd = vec3(-sin(a), 0., cos(a)); ax = vec3(cos(a), 0., sin(a));
      hw = rr * ${e(Math.PI/x.FOAM)} * mix(${e(x.DASH[0])}, ${e(x.DASH[1])}, j) * on;
      hh = ${e(.5*(.3*s+.18))} * (1. - tau) * smoothstep(0., 0.12, tau) * on; kind = 2.; lineOn = 0.;
    }
    vec2 l = ppLine(${e(b.W)}, ppPixel(projectionMatrix * viewMatrix * vec4(c, 1.)));
    float lw = min(l.x * mix(0.75 / max(uLine.x, 0.75), 1., l.y), 0.6 * hw) * lineOn;   // (a part drawn in to nothing takes its line with it)
    vInk = mix(uSurf, uInk, l.y); vK = vec2(kind, lw / max(hw + lw, 1e-5)); vUv = position.xy;
    gl_Position = projectionMatrix * viewMatrix * vec4(c + sd * (position.x * (hw + lw)) + ax * (position.y * (hh + lw * step(0.5, kind) * step(kind, 1.5))), 1.);
  }`,Je=`
  uniform vec3 uSurf;
  varying vec2 vUv; varying vec3 vInk; varying vec2 vK;
  void main(){
    float x = abs(vUv.x), t = 0.5 * vUv.y + 0.5, d = 0., edge = 1.;
    if (vK.x < 0.5) { edge = 1.6 * (1. - t) * (0.55 + 0.9 * t); d = x; }                  // a tongue: a leaf, wide low down, pointed
    else if (vK.x < 1.5) { edge = 2.55 * sqrt(max(t, 0.)) * (1. - t); d = x; }             // a drop: a tear, round ahead, pointed behind (no root of a number under 0 where a sample lies past the quad's foot)
    else d = sqrt(x * x * x * x + vUv.y * vUv.y);                                        // a dash: a bar with round ends
    vec3 col = d > edge - vK.y ? mix(uSurf, vInk, step(0.5, 1.5 - vK.x)) : uSurf;
    gl_FragColor = vec4(col, 1.);
    if (d > edge) discard;
  }`;function gt(t,o,a={}){if(!o||!o.length)return null;const i=!!a.byD,s=x,n=i?s.NINE_DROPS:s.DROPS,p=s.CROWN+n+s.FOAM,r=[],c=[],u=i?o.map((g,v)=>[g,v]):we(t,o,a.boats);for(const[g,v]of u)for(let $=0;$<p;$++)r.push(g.strike[0],g.strike[1],0,0),i?c.push(g.di-Z.AHEAD,0,$,v*.6180339%1):c.push(g.per,g.phase,$,v*.6180339%1);const f=new h.InstancedBufferGeometry,w=u.length*p;f.setAttribute("position",new h.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),f.setIndex([0,1,2,0,2,3]),f.setAttribute("iP",new h.InstancedBufferAttribute(new Float32Array(r),4)),f.setAttribute("iL",new h.InstancedBufferAttribute(new Float32Array(c),4)),f.instanceCount=w;const m=i?ye(!0,n,s.NINE_TALL,s.NINE_OUT,s.NINE_PLUME,Z.SPLASH_R):ye(!1,n,s.TALL,s.OUT,s.PLUME,Re.SPLASH_R),A=new h.Mesh(f,new h.ShaderMaterial({uniforms:{...t.U,uSurf:{value:new h.Vector3(...t.col("surf"))}},vertexShader:m,fragmentShader:Je,side:h.DoubleSide}));return A.frustumCulled=!1,A.name=i?"pp-splash-nine":"pp-splash",A.userData.triangles=w*2,A}const Ze=`
  {
    float ph = 6.2831853 * iB.x, rock = 0.07 * iB.z * sin(uTime * 1.1 + ph + 1.3), cs = cos(iA.w), sn = sin(iA.w);
    p.xy = ppRot2(p.xy, rock); n.xy = ppRot2(n.xy, rock);
    p = vec3(p.x * cs + p.z * sn, p.y + iB.y * sin(uTime * 1.1 + ph), -p.x * sn + p.z * cs) + iA.xyz;
    n = vec3(n.x * cs + n.z * sn, n.y, -n.x * sn + n.z * cs);
  }`;function mt(t,o,a,i,s){if(!o)return null;const n=[],p=i&&i.length?i:Pe(q(t));return(a||[]).forEach(r=>n.push([r.x,-.12,r.z,r.turn,r.phase,.12,1,0])),p.forEach((r,c)=>{const u=c>=p.length-ee.N[ee.N.length-1],f=u?0:ee.OUT;n.push([r[0]+Math.sin(r[3])*f,r[1]+b.LEGS,r[2]+Math.cos(r[3])*f,r[3]+(c%2?1.25:-1.25)+(u?c:0),c*.37%1,0,.3,0])}),(s||[]).forEach((r,c)=>n.push([r[0],r[1],r[2],r[3],(.21+c*.47)%1,0,.3,0])),n.length?K(o,n,G(t.U,{},{vertexMove:Ze}),"pp-sitters"):null}const oe=[.44,.8],et=`
  {
    float ph = 6.2831853 * iB.x, sz = iA.w, o2 = fract(iC.z * 7.3 + 0.19);
    float cy = iC.x + ${e(T.SW_Y)} * iC.w * iC.y * sin(uTime * 6.2831853 / mix(${e(T.PER_Y[0])}, ${e(T.PER_Y[1])}, o2) + 6.2831853 * o2);
    float cr = iC.y * (1. + ${e(T.SW_R)} * iC.w * sin(uTime * 6.2831853 / mix(${e(T.PER_R[0])}, ${e(T.PER_R[1])}, iC.z) + 6.2831853 * iC.z));
    float feet = cy + sqrt(max(cr * cr - iB.z * iB.z, 0.)) - ${e(te.SINK)} * sz;
    float gate = smoothstep(0.2, 0.6, sin(uTime * ${e(te.GATE_W)} + ph * 3.)), hop = iB.y * gate * max(0., sin(uTime * ${e(te.HOP_W)} + ph));
    if (part > 20.5) {                                                 // a wing: out from the shoulder while the bird hops
      float sx = p.x < 0. ? -1. : 1., a = 1.2 * gate * (0.55 + 0.45 * sin(uTime * ${e(2*te.HOP_W)} + ph));
      vec2 q = ppRot2(vec2(abs(p.x), p.y) - vec2(${e(oe[0])}, ${e(oe[1])}), a) + vec2(${e(oe[0])}, ${e(oe[1])}), m = ppRot2(vec2(n.x * sx, n.y), a);
      p.xy = vec2(q.x * sx, q.y); n.xy = vec2(m.x * sx, m.y);
    }
    float rock = 0.09 * sin(uTime * 1.3 + ph * 1.7), cs = cos(iA.z), sn = sin(iA.z);
    p.xy = ppRot2(p.xy, rock); n.xy = ppRot2(n.xy, rock);
    p = p * sz + vec3(0., iB.w * sz + feet + hop, 0.);
    p = vec3(p.x * cs + p.z * sn + iA.x, p.y, -p.x * sn + p.z * cs + iA.y);
    n = vec3(n.x * cs + n.z * sn, n.y, -n.x * sn + n.z * cs);
  }`;function tt(t,o){const a=n=>o.col(n),i=b.W,s={part:20};O(t,l(0,.4,0),[.5,.95,.46],{...s,axis:U,side:V,nseg:5,nring:3,col:a("brownBack"),line:i}),k(t,[l(0,.62,.62),l(0,1.25,.8),l(0,1.74,.66)],[.24,.16,.22],{...s,nseg:4,col:a("brownHead"),line:i}),k(t,[l(0,1.66,.82),l(0,.8,1.22)],[.11,.045],{...s,nseg:3,col:a("straw"),line:0,cap0:!1});for(const n of[1,-1])O(t,l(n*.46,.46,-.12),[.09,.8,.34],{part:21,axis:U,side:V,nseg:4,nring:2,col:a("wingTip"),line:0}),X(t,[l(n*.2,.1,-.05),l(n*.2,-b.LEGS,-.05)],.05,{...s})}function Ae(t){xe(t);const o=new h.BufferGeometry;for(const[a,i,s]of[["position",t.pos,3],["normal",t.nor,3],["aCol",t.col,3],["aK",t.k,4],["aRig",t.rig,4]])o.setAttribute(a,new h.Float32BufferAttribute(i,s));return o.setIndex(t.idx),o.userData.triangles=t.idx.length/3,o}function wt(t,o){const a=Oe(q(t)),i=new h.Group,s=G(t.U,{},{vertexPre:"attribute vec4 iC;",vertexMove:et}),n=j();tt(n,t);let p=0;for(const[r,c,u]of[[!1,Ae(n),"pp-watchers"],[!0,o,"pp-watchers-big"]]){const f=a.filter(g=>!!g.big===r);if(!c||!f.length)continue;const w=f.map(g=>[g.x,g.z,g.turn,g.size,g.phase,g.hop,g.off,b.LEGS]),m=[];for(const g of f)m.push(g.lobe.y,g.lobe.r,g.lobe.own,g.lobe.sw??1);const A=K(c,w,s,u,{iC:m});i.add(A),p+=A.userData.triangles}return i.name="pp-watchers-all",i.userData.triangles=p,i}const nt=["bikeRed","bikeYellow","bikeTeal","stroke"],ot=`
  if (part > 20.5) {
    float w = aRig.y * (${e(Q.WAVE[0])} * sin(uTime * ${e(Q.WAVE[1])} + 6.2831853 * aRig.x) + ${e(.4*Q.WAVE[0])} * sin(uTime * ${e(1.83*Q.WAVE[1])} + 15.7 * aRig.x));
    p.xz += aRig.zw * w; p.y += 0.3 * abs(w) * aRig.y;
  }`;function yt(t){const o=Q,a=j(),i=De(q(t)),s=nt.map(r=>t.col(r));let n=0;for(const r of i)for(let c=0;c<r.length;c++){const u=r[c],f=r[c+1];if(X(a,[l(u.x,u.y-u.foot,u.z),l(u.x,u.y+.12,u.z)],.07,{}),O(a,l(u.x,u.y+.2,u.z),[.15,.15,.15],{nseg:4,nring:2,col:s[1],line:0}),!f)continue;const w=v=>l(u.x+(f.x-u.x)*v,u.y+(f.y-u.y)*v-o.SAG*4*v*(1-v),u.z+(f.z-u.z)*v);X(a,[0,.25,.5,.75,1].map(w),.03,{});const m=Math.hypot(f.x-u.x,f.z-u.z),A=(f.z-u.z)/m,g=-(f.x-u.x)/m;for(let v=0;v<o.N;v++,n++){const $=(v+.5)/o.N,N=o.W/2/Math.hypot(f.x-u.x,f.y-u.y,f.z-u.z),L=w($-N),d=w($+N),E=w($),S=a.pos.length/3;se(a,L,d,l(E.x+(d.x-E.x)*.12,E.y-o.DROP,E.z+(d.z-E.z)*.12),l(E.x+(L.x-E.x)*.12,E.y-o.DROP,E.z+(L.z-E.z)*.12),{col:s[n%4],line:.05,two:!1});const R=n*.6180339%1,C=[R,0,A,g];for(let P=S;P<a.pos.length/3;P++){const H=P-S,ae=H<4?H:H-4>>1;a.k[P*4+1]=21,C[1]=ae>=2?1:0;for(let J=0;J<4;J++)a.rig[P*4+J]=C[J]}}}const p=new h.Mesh(Ae(a),G(t.U,{},{vertexMove:ot,side:h.DoubleSide}));return p.frustumCulled=!1,p.name="pp-pennants",p.userData.triangles=p.geometry.userData.triangles,p.userData.pennants=n,p}const at=`
  {
    float ph = 6.2831853 * iA.w, roll = 0.09 * sin(uTime * 0.9 + ph), pitch = 0.035 * sin(uTime * 1.27 + ph * 1.7), cs = cos(iA.z), sn = sin(iA.z);
    p.xy = ppRot2(p.xy, roll); n.xy = ppRot2(n.xy, roll); p.yz = ppRot2(p.yz, pitch); n.yz = ppRot2(n.yz, pitch);
    p = vec3(p.x * cs + p.z * sn + iA.x, p.y + 0.12 * sin(uTime * 0.7 + ph * 2.3), -p.x * sn + p.z * cs + iA.y);
    n = vec3(n.x * cs + n.z * sn, n.y, -n.x * sn + n.z * cs);
  }`;function st(t){const o=j(),a=pe(B),i={part:20};O(o,l(0,.25,0),[1.2,Se,.85],{...i,axis:U,side:V,nseg:8,nring:5,col:t.col("lighthouseWhite"),line:a}),X(o,[l(0,.6,.4),l(0,B-.1,.4)],.09,{...i}),se(o,l(0,1.5,.2),l(1.15,1.7,-3.1),l(.02,B-.7,.05),l(0,B-.5,.2),{...i,tint:1,line:a*.5}),se(o,l(0,1.3,3.3),l(.45,1.5,.7),l(.02,B-1.8,.55),l(0,B-1.6,.6),{...i,tint:1,line:a*.5}),xe(o);const s=new h.BufferGeometry;for(const[n,p,r]of[["position",o.pos,3],["normal",o.nor,3],["aCol",o.col,3],["aK",o.k,4],["aRig",o.rig,4]])s.setAttribute(n,new h.Float32BufferAttribute(p,r));return s.setIndex(o.idx),s.userData.triangles=o.idx.length/3,s}function At(t,o,a){if(!o||!o.length)return null;const i=t.col("sail"),s=t.col("surf"),n=o.map((r,c)=>{const u=a&&a[c]||{},f=u.red?i:s;return[r[0],r[1],u.turn||0,u.phase||0,f[0],f[1],f[2],0]});return K(st(t),n,G(t.U,{},{vertexMove:at}),"pp-boats")}export{ft as bankSteps,At as makeBoats,pt as makeClouds,vt as makeDivers,xt as makeGliders,dt as makeNine,yt as makePennants,ut as makeSea,mt as makeSitters,lt as makeSky,gt as makeSplashes,wt as makeWatchers,ht as seaPelicanGeometry};
