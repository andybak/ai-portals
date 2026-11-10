import*as e from"three";import{mergeGeometries as He}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as be,lerp as $,smoothstep as se}from"../kit/core.js";const St=["#3A2A20","#4A2F45","#2B333D","#EDE8DC","#2F7FD6","#1FA39A","#D9772E"],_e=new e.Vector3(125,72,-60),Ne=12,De=16,We=5,Ge=8,Ee=24,ke=8,kt=s=>new e.Color(s),Xe=s=>new e.Vector3(s.r,s.g,s.b),ft=s=>new e.Matrix3().fromArray(s).invert().elements.map(u=>u.toFixed(6)).join(","),qt=ft([.59719,.076,.0284,.35458,.90834,.13383,.04823,.01566,.83777]),At=ft([1.60475,-.10208,-.00327,-.53108,1.10813,-.07276,-.07367,-.00605,1.07602]),zt=`
  uniform float uExpK;
  vec3 toScene(vec3 D){
    vec3 y = clamp(mat3(${At})*clamp(D, 0., 0.82), 0.0003, 0.965);
    vec3 A = 0.983729*y - 1., B = 0.432951*y - 0.0245786, C = 0.238081*y + 0.000090537;
    vec3 v = (-B - sqrt(max(B*B - 4.*A*C, 0.)))/(2.*A);     // A is always below zero here (y <= 0.965)
    return max(mat3(${qt})*v, 0.)*uExpK;
  }`;function Qt(s,u=1){const t=s.isColor?s:new e.Color(s),h=new e.Matrix3().fromArray([1.60475,-.10208,-.00327,-.53108,1.10813,-.07276,-.07367,-.00605,1.07602]).invert(),d=new e.Matrix3().fromArray([.59719,.076,.0284,.35458,.90834,.13383,.04823,.01566,.83777]).invert(),o=new e.Vector3(Math.min(t.r,.82),Math.min(t.g,.82),Math.min(t.b,.82)).applyMatrix3(h),x=V=>{V=be(V,3e-4,.965);const O=.983729*V-1,G=.432951*V-.0245786,W=.238081*V+90537e-9;return(-G-Math.sqrt(Math.max(G*G-4*O*W,0)))/(2*O)},L=new e.Vector3(x(o.x),x(o.y),x(o.z)).applyMatrix3(d).multiplyScalar(.6/u);return new e.Color(Math.max(L.x,0),Math.max(L.y,0),Math.max(L.z,0))}function Pt(){const s=(u,t)=>Array.from({length:u},t);return{uExpK:{value:.6},uTime:{value:0},uHole:{value:_e.clone()},uSky:{value:new e.Vector3},uSea:{value:new e.Vector3},uSailA:{value:new e.Vector3},uSailB:{value:new e.Vector3},uPale:{value:new e.Vector3(1,1,1)},uGain:{value:1},uCool:{value:0},uNight:{value:0},uNear:{value:0},uSoft:{value:.34},uWind:{value:new e.Vector4(.035,.012,1,1/45)},tCloud:{value:null},tTown:{value:null},uLug:{value:s(Ne,()=>new e.Vector4)},uLugN:{value:Ne},uGull:{value:s(De,()=>new e.Vector4)},uGullN:{value:De},uMast:{value:s(We,()=>new e.Vector4)},uSteam:{value:new e.Vector4(.9,-.012,1,0)},uLane:{value:new e.Vector4(1/27,0,6,0)},uBoxA:{value:s(Ge,()=>new e.Vector3(0,-900,0))},uBoxB:{value:s(Ge,()=>new e.Vector3(0,-899,0))},uCapA:{value:s(Ee,()=>new e.Vector4(0,-900,0,.01))},uCapB:{value:s(Ee,()=>new e.Vector3(0,-899,0))},uEllC:{value:s(ke,()=>new e.Vector3(0,-900,0))},uEllR:{value:s(ke,()=>new e.Vector3(1,1,1))},uMothF:{value:new e.Vector3(-1,0,0)},uMothN:{value:new e.Vector3(0,1,0)},uFold:{value:new e.Vector4(0,0,0,1)},uBed:{value:new e.Vector4(-86,20,-50,20)},uLens:{value:new e.Vector4(-47,49.7,-91,4.5)},uSlosh:{value:new e.Vector2},uVar:{value:new e.Vector4(0,0,0,0)}}}const Bt=`
  uniform float uTime, uGain, uCool, uNear, uNight, uSoft, uLugN, uGullN;
  uniform vec3 uHole, uSky, uSea, uSailA, uSailB, uPale;
  uniform vec4 uWind, uSteam, uVar, uLane;
  uniform sampler2D tCloud, tTown;
  uniform vec4 uLug[${Ne}], uGull[${De}], uMast[${We}];
  float edgeD(vec2 p, vec2 a, vec2 b){ vec2 e = b - a; return dot(p - a, vec2(e.y, -e.x))/max(length(e), 1e-4); }
  float quadD(vec2 p, vec2 a, vec2 b, vec2 c, vec2 d){ return max(max(edgeD(p, a, b), edgeD(p, b, c)), max(edgeD(p, c, d), edgeD(p, d, a))); }
  float segD(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba)/max(dot(ba, ba), 1e-6), 0., 1.); return length(pa - ba*h); }
  float lineK(float d, float th, float w){ float t2 = max(th, w*0.75); return (1. - smoothstep(t2 - w, t2 + w, d))*min(1., th/t2); }
  // an edge that bellies outward by 'bulge' at its middle (0 at both corners), and a four-cornered sail whose foot
  // (a -> b) and leech (b -> c) belly while head and luff stay straight
  float edgeB(vec2 p, vec2 a, vec2 b, float bulge){ vec2 e = b - a; float l2 = max(dot(e, e), 1e-6), tt = clamp(dot(p - a, e)/l2, 0., 1.); return dot(p - a, vec2(e.y, -e.x))/sqrt(l2) - bulge*4.*tt*(1. - tt); }
  float sailD(vec2 p, vec2 a, vec2 b, vec2 c, vec2 d, float bl, float bf){ return max(max(edgeB(p, a, b, bf), edgeB(p, b, c, bl)), max(edgeD(p, c, d), edgeD(p, d, a))); }
  // a lugger's three sails: signed distance (negative inside); which = 0 main, 1 mizzen, 2 jib; su = 0 at the luff .. 1 at the leech
  float lugSails(vec2 q, out float which, out float su){
    float dMain = sailD(q, vec2(-0.38, 0.15), vec2(0.10, 0.165), vec2(0.20, 1.0), vec2(-0.25, 0.72), 0.05, 0.03);
    float dMiz = sailD(q, vec2(0.17, 0.15), vec2(0.45, 0.165), vec2(0.50, 0.70), vec2(0.24, 0.54), 0.032, 0.02);
    float dJib = sailD(q, vec2(-0.76, 0.13), vec2(-0.41, 0.15), vec2(-0.35, 0.68), vec2(-0.385, 0.66), 0.03, 0.028);
    which = 0.; su = clamp(-edgeD(q, vec2(-0.25, 0.72), vec2(-0.38, 0.15))/0.47, 0., 1.);
    float d = dMain;
    if (dMiz < d){ d = dMiz; which = 1.; su = clamp(-edgeD(q, vec2(0.24, 0.54), vec2(0.17, 0.15))/0.27, 0., 1.); }
    if (dJib < d){ d = dJib; which = 2.; su = clamp(-edgeD(q, vec2(-0.385, 0.66), vec2(-0.76, 0.13))/0.2, 0., 1.); }
    return d;
  }
  vec3 harbour(vec3 o, float aw){
    float t = uTime;
    float a = atan(o.z, max(o.x, 1e-4)), e = atan(o.y, max(length(o.xz), 1e-4));
    aw = clamp(aw, 0.0005, 0.09);
    vec2 ae = vec2(a, e);
    // ---- sky: cobalt overhead, paler toward the horizon; cumulus on a level sheet, so on the floor it is undistorted
    float up = max(o.y, 0.);
    vec3 col = mix(mix(uSky, uPale, 0.24), uSky, smoothstep(0.0, 0.3, up));
    float sy = max(o.y, 0.035);
    vec2 cuv = o.zx/sy*0.46 + uWind.xy*t;
    float clod = clamp(log2(aw*0.46/(sy*sy)*256.), 0., 6.5);
    float cn = textureLod(tCloud, cuv, clod).r, cn2 = textureLod(tCloud, cuv + vec2(0.016, 0.011), clod).r;
    float cs = 0.02 + 0.012*min(clod, 3.5);
    float cov = smoothstep(0.6 - cs, 0.66 + cs, cn)*smoothstep(0.06, 0.2, e)*(1. - 0.8*smoothstep(4., 6.5, clod));
    col = mix(col, mix(uPale*1.5, mix(uSky, uPale, 0.6)*1.02, clamp((cn - cn2)*9. + 0.35, 0., 1.)*0.75), cov);
    // ---- sea: green, swell marching in, breaking white along the quay
    if (e < 0.){
      float dn = max(-o.y, 0.02); vec2 suv = o.zx/dn;
      float fp = aw/(dn*dn);                                  // footprint on the water sheet
      float nz = textureLod(tCloud, suv*0.045 + vec2(0., t*0.004), clamp(log2(fp*0.045*256.), 0., 6.)).g;
      float keep = 1. - smoothstep(0.12, 0.5, fp*2.4);
      float sw = sin(suv.y*2.4 + 2.2*sin(suv.x*0.33 + nz*5.) + t*uWind.z*1.1);
      float sw2 = sin(suv.y*7.3 - suv.x*1.9 + nz*9. + t*uWind.z*1.9);
      vec3 sea = uSea*(0.74 + (0.26*sw + 0.1*sw2)*keep);
      sea = mix(sea, uPale*1.35, smoothstep(0.8, 0.97, sw*0.75 + sw2*0.25 + (nz - 0.5)*0.6)*keep*0.8);
      float lgd = log(dn);
      float bn = textureLod(tCloud, vec2(a*0.9 + 0.2, lgd*0.21 - t*0.004), 1.).r, bn2 = textureLod(tCloud, vec2(a*2.6 - t*0.006, lgd*0.5 + 0.4), 1.).g;
      float bph = 14.*lgd - t*uWind.z*0.9 + 1.4*sin(a*2.3 + 0.3*t) + 7.*(bn - 0.5);
      float bk = (1. - smoothstep(0.5, 1.6, 14.*aw/dn))*smoothstep(0.02, 0.045, dn), bs = sin(bph);
      sea *= 1. + 0.2*bs*bk;
      sea = mix(sea, mix(uSea, uPale, 0.55)*1.1, smoothstep(0.7, 0.98, bs)*smoothstep(0.42, 0.62, bn2)*bk*0.5);
      sea = mix(sea, mix(uSea, uPale, 0.35)*0.95, smoothstep(-0.05, 0., e)*0.5);
      // the near quay (a level strip next to the casement) and the surf along it
      float qy = suv.y - 1.15 - 0.05*sin(suv.x*0.6);
      float surf = (1. - smoothstep(0.0, 0.42, qy))*(0.55 + 0.45*sin(suv.x*5. + nz*14. + t*1.6))*(0.6 + 0.4*sin(t*0.7 + suv.x*0.4));
      sea = mix(sea, uPale*1.4, clamp(surf, 0., 1.)*step(0., qy));
      vec2 bl = vec2(suv.x*1.3 + step(0.5, fract(suv.y*2.2))*0.5, suv.y*4.4), bf = abs(fract(bl) - 0.5);
      float jw = fp*4.4 + 0.02, joint = (1. - smoothstep(0.5 - 0.05 - jw, 0.5 - 0.05 + jw, max(bf.x, bf.y)))*(1. - smoothstep(0.1, 0.35, jw));
      vec3 quay = mix(uPale, uSailA, 0.2)*(0.62 + 0.1*nz)*(1. - 0.45*(1. - joint)*(1. - smoothstep(0.1, 0.35, jw)));
      float boll = length(vec2((fract(suv.x*0.55) - 0.5)/0.55, suv.y - 1.02));
      quay = mix(quay, uSailB*0.08, 1. - smoothstep(0.07, 0.07 + fp*1.5 + 0.01, boll));
      quay = mix(quay, uSea*0.45, (1. - smoothstep(0., 0.12, -qy))*0.7);        // weed on the steps
      sea = mix(sea, quay, 1. - smoothstep(-fp - 0.004, fp + 0.004, qy));
      // ---- the anchorage below the casement (all of it lands on the ceiling and the tops of the walls)
      // under each mast bar its boat, seen from above: a pointed deck of pale planks inside a dark gunwale, a hatch, a
      // thwart, lying off the quay and swinging with her mast
      for (int i = 0; i < ${We}; i++){
        vec4 M = uMast[i]; if (M.x > 5.) continue;
        float rr = max(1.7 + 0.6*(1. - smoothstep(0.3, 0.9, abs(M.x))), 1.5/max(cos(M.x), 0.2));
        float am = M.x + (0.022*sin(t*0.55 + M.w) + 0.008*sin(t*1.3 + M.w*2.))*(0.9 - atan(1./rr));
        vec2 dq = suv - rr*vec2(sin(am), cos(am)); float dy = 0.3*sin(M.w*3.) + 0.05*sin(t*0.21 + M.w);
        dq = vec2(dq.x*cos(dy) + dq.y*sin(dy), dq.y*cos(dy) - dq.x*sin(dy))/0.7;
        if (abs(dq.x) > 0.5 || abs(dq.y) > 0.2) continue;
        float fw = fp*1.7 + 0.004, dd = abs(dq.y) - 0.115*(1. - dq.x*dq.x*5.2);
        float seam = smoothstep(0.4 - fw*20., 0.4 + fw*20., abs(fract(dq.y*40.) - 0.5))*(1. - smoothstep(0.004, 0.012, fw));
        vec3 dk = mix(uPale, uSailA, 0.45)*(0.78 - 0.2*seam + 0.1*nz);
        dk = mix(dk, uSailB*0.1, smoothstep(-0.03 - fw, -0.022, dd));
        dk = mix(dk, uSailB*0.14, 1. - smoothstep(-fw, fw, max(abs(dq.x + 0.15) - 0.075, abs(dq.y) - 0.036)));
        dk = mix(dk, uSailB*0.2, (1. - smoothstep(0.008, 0.008 + fw, abs(dq.x - 0.17)))*step(dd, -0.03));
        sea = mix(sea, dk, 1. - smoothstep(-fw, fw, dd));
      }
      // a cormorant on a mooring post out in the anchorage, wings held out to dry and shifting (on the ceiling by the
      // bed-head cornice, its head toward the wall)
      vec2 cq = vec2(a + 0.46, e + 0.4);
      if (abs(cq.x) < 0.06 && abs(cq.y) < 0.12){
        float cw = aw*1.2 + 0.0008, sh1 = 0.006*sin(t*0.7), sh2 = 0.005*sin(t*0.53 + 1.3);
        float dB = (length((cq - vec2(0.002, 0.))/vec2(0.011, 0.031)) - 1.)*0.011;
        dB = min(dB, segD(cq, vec2(0.004, 0.026), vec2(-0.003, 0.05)) - 0.0036);
        dB = min(dB, segD(cq, vec2(-0.003, 0.051), vec2(-0.019, 0.056)) - 0.0026*(0.3 + 0.7*smoothstep(-0.019, -0.008, cq.x)));
        dB = min(dB, quadD(cq, vec2(0.006, 0.02), vec2(0.008, -0.008), vec2(0.034, -0.022 + sh1), vec2(0.04, 0.012 + sh1)));
        vec2 cm = vec2(-cq.x, cq.y);
        dB = min(dB, quadD(cm, vec2(0.003, 0.02), vec2(0.005, -0.008), vec2(0.031, -0.02 + sh2), vec2(0.037, 0.014 + sh2)));
        dB = min(dB, quadD(cq, vec2(-0.004, -0.044), vec2(0.009, -0.044), vec2(0.006, -0.025), vec2(-0.006, -0.025)));
        float post = max(abs(cq.x - 0.002) - 0.0058, abs(cq.y + 0.079) - 0.041);
        sea = mix(sea, mix(uSailB, uPale, 0.18)*0.3*(0.8 + 0.4*step(-0.05, cq.y)), 1. - smoothstep(-cw, cw, post));
        sea = mix(sea, uPale*1.3, (1. - smoothstep(0.004, 0.004 + cw, abs(cq.y + 0.122)))*(1. - smoothstep(0.012, 0.03, abs(cq.x - 0.002)))*0.7);
        sea = mix(sea, uSailB*0.06, 1. - smoothstep(-cw, cw, dB));
      }
      // moon glitter (the night edition): a road of silver glints lying on the swell bands, broad under the casement
      // and narrowing to the horizon, each glint winking as its band marches in
      if (uNight > 0.5){
        float road = 1. - smoothstep(0.3, 1., abs(a + 0.3 + 0.02*sin(lgd*3.))/(0.035 + 0.45*dn));
        float wink = smoothstep(0.4, 0.75, textureLod(tCloud, vec2(a*9. + t*0.013, lgd*1.9 - t*0.03), 0.5).g);
        sea = mix(sea, uPale*1.75, road*(smoothstep(0.45, 0.9, bs)*wink*bk*0.9 + 0.3*(1. - bk)*smoothstep(0.0, 0.03, dn)));
      }
      col = mix(col, sea, smoothstep(-aw, aw, -e));
    }
    // ---- the far shore: headland, pines, town, breakwater (a strip texture; channels are white, roof, ochre)
    float tv = (e + 0.012)/0.125;
    if (tv > 0. && tv < 1.){
      float tl = log2(aw*1280.); vec2 tuv = vec2(a/3.2 + 0.5, tv);
      vec4 tx = textureLod(tTown, tuv, clamp(tl, 0.8, 8.));
      // magnified (a wall at arm's length): every edge is cut again from the smooth field, so eaves and gables stay
      // straight and no texel shows; the windows are drawn here, not stored, as small soft dots on the wall's inside
      float mag = 1. - smoothstep(-1.2, 0.8, tl), kk = 0.5*clamp(aw*1280.*0.9, 0.1, 1.);
      tx = mix(tx, smoothstep(vec4(0.5 - kk), vec4(0.5 + kk), tx), mag);
      vec4 tb = textureLod(tTown, tuv, max(tl, 2.6));
      float inner = smoothstep(0.8, 0.97, max(tb.r, tb.b))*(1. - smoothstep(0.02, 0.2, tb.g));
      vec2 wg = vec2(a/0.00625, e/0.0044); wg.y += 0.37*floor(wg.x*0.25);
      vec2 wf = (fract(wg) - 0.5)*vec2(0.00625, 0.0044);
      float wa = aw/0.0011, wdot = 1. - smoothstep(1. - min(wa, 0.9), 1. + wa, length(wf/vec2(0.0009, 0.0013)));
      float win = mix(wdot, 0.13, smoothstep(0.35, 1.1, wa))*inner;
      vec3 land = uSea*0.2*(1. - uCool*0.3);
      land = mix(land, uPale*1.22, tx.r); land = mix(land, uSailB*1.15, tx.g); land = mix(land, mix(uPale, uSailA, 0.5)*1.05, tx.b);
      land = mix(land, uSailB*0.1, win*0.85);
      col = mix(col, land, tx.a);
    }
    // ---- the paddle steamer and its long smoke, far out
    for (int k = 0; k < 3; k++){
      float fk = float(k);
      if (uSteam.z < 0.5 || fk >= uSteam.w) break;
      float sd = (uSteam.y < 0. ? -1. : 1.)*(k == 1 ? -1. : 1.), ssz = 0.085*(1. + 0.45*fk);
      float sc0 = mod(uSteam.x + fk*1.37 + sd*abs(uSteam.y)*(1. + 0.3*fk)*t + 1.7, 3.4) - 1.7;
      vec2 q = vec2((a - sc0)*sd, e + 0.006 + 0.012*fk)/ssz; float w = aw/ssz;
      float sx = max(-q.x - 0.05, 0.);                         // distance astern
      float sm = (1. - smoothstep(0.0, 1., abs(q.y - 0.62 - 0.42*sqrt(sx))/(0.1 + 0.16*sx + w)))*smoothstep(0., 0.25, sx)*(1. - smoothstep(4.5, 8., sx));
      sm *= 0.45 + 0.8*textureLod(tCloud, vec2(sx*0.09 - t*0.012, q.y*0.2), 1.).g;
      col = mix(col, mix(uSailB, uPale, 0.3)*0.2, clamp(sm, 0., 1.)*0.85);
      float dh = quadD(q, vec2(-0.62, 0.), vec2(0.56, 0.), vec2(0.7, 0.13), vec2(-0.66, 0.12));
      dh = min(dh, quadD(q, vec2(-0.1, 0.1), vec2(0.03, 0.1), vec2(0.02, 0.56), vec2(-0.09, 0.56)));
      dh = min(dh, length(q - vec2(0.1, 0.09)) - 0.15);
      col = mix(col, uSailB*0.05, 1. - smoothstep(-w, w, dh));
    }
    // ---- the fleet: luggers standing out to sea, close under the casement, so their sails stand above the horizon.
    //      Boat 0 lies moored on the entry axis (uLug[0].y < 0), sails set and drying, only bobbing.
    for (int i = 0; i < ${Ne}; i++){
      if (float(i) >= uLugN) break;
      vec4 L = uLug[i]; float fi = float(i), dir = L.z < 0. ? -1. : 1., moor = L.y < 0. ? 1. : 0.;
      float ph = fract(L.y + t*uWind.w);                       // 0 under the casement .. 1 hull down, far out
      float ent = 1. - smoothstep(0., 0.16, ph);                // she comes in alongside the quay, then stands out to sea
      float s = 0.2/(1. + 2.2*ph), ac = L.x + L.z*ph - dir*ent*ent*1.5;      // never a giant: on a wall at arm's length she is a boat, not a panel (the moored one and the near lane are the big sails)
      float show = smoothstep(0., 0.015, ph)*(1. - smoothstep(0.92, 1., ph));
      if (moor > 0.5){ s = 0.21; ac = L.x; show = 1.; }
      float turnB = L.y < -1.5 ? 1. : 0.;
      if (turnB > 0.5){ s = L.y < -2.5 ? 0.1 : 0.118; ac = L.x + 0.04*sin(t*0.06 + 1. + fi); show = 1.; }
      vec2 q = vec2(-(a - ac)*dir, e + 0.02 + 0.25*(s - 0.1))/s;      // bow toward -x, and she sails bow first
      if (abs(q.x) > 1.05 || q.y < -0.95 || q.y > 1.2) continue;
      float w = aw/s, way = max(1. - moor, turnB);
      q.y -= 0.014*sin(t*0.9 + fi*2.1); q.x += q.y*0.035*sin(t*0.62 + fi*1.7);      // bob and roll
      if (uVar.x > 1.5 && moor < 0.5 && turnB < 0.5 && (i == 3 || i == 5)){
        // the third cast: this slot is a steam tug: a short black hull, a wheelhouse with lit windows, a raked funnel
        // with a band in the fleet's colour, coal smoke blowing astern, white water under her bow and a wake
        vec2 g = q*2.1 + vec2(0., 0.02); float gw = w*2.1, sx = max(g.x - 0.06, 0.);
        float smk = (1. - smoothstep(0., 1., abs(g.y - 0.68 - 0.36*sqrt(sx))/(0.07 + 0.2*sx + gw)))*smoothstep(0., 0.2, sx)*(1. - smoothstep(1.3, 2.1, sx));
        smk *= 0.5 + 0.8*textureLod(tCloud, vec2(sx*0.13 - t*0.02 + fi, g.y*0.2), 1.).g;
        col = mix(col, mix(uSailB, uPale, 0.25)*0.18, clamp(smk, 0., 1.)*0.85*show);
        float dT = quadD(g, vec2(-0.5, 0.), vec2(0.46, 0.), vec2(0.5, 0.15), vec2(-0.6, 0.19));
        dT = min(dT, quadD(g, vec2(-0.26, 0.15), vec2(0.04, 0.15), vec2(0.04, 0.33), vec2(-0.26, 0.33)));
        float dF = quadD(g, vec2(0.08, 0.15), vec2(0.2, 0.15), vec2(0.25, 0.64), vec2(0.14, 0.64));
        col = mix(col, uSailB*0.05, (1. - smoothstep(-gw, gw, min(dT, dF)))*show);
        col = mix(col, uSailA*1.25, (1. - smoothstep(-gw, gw, max(dF, abs(g.y - 0.5) - 0.045)))*show);
        col = mix(col, uPale*1.1, (1. - smoothstep(-gw, gw, max(abs(g.x + 0.11) - 0.1, abs(g.y - 0.265) - 0.03)))*show*0.8);
        float bowW = 1. - smoothstep(0.4, 1., length((g - vec2(-0.52, 0.005))/vec2(0.12 + gw, 0.04 + gw)));
        float wkT = (1. - smoothstep(0.3, 1., abs(g.y + 0.012)/(0.014 + 0.03*max(g.x - 0.45, 0.) + gw)))*smoothstep(-0.5, -0.4, g.x)*(1. - smoothstep(1.0, 1.9, g.x));
        col = mix(col, uPale*1.4, clamp(max(bowW, wkT*0.8), 0., 1.)*show*(0.75 + 0.25*sin(g.x*17. - t*4. + fi)));
        continue;
      }
      // below the waterline the same sails are looked up mirrored and rippled: the broken reflection
      float under = q.y < 0.06 ? 1. : 0.;
      float brk = 0.5 + 0.5*sin(q.y*70. + 2.5*sin(q.x*11. + t*1.3 + fi) - t*2.);
      brk = mix(0.55, smoothstep(0.25, 0.6, brk), 1. - smoothstep(0.5, 1.6, 70.*w));
      vec2 qs = under > 0.5 ? vec2(q.x + 0.022*sin(q.y*46. + t*2.2 + fi), -q.y*1.12 + 0.02) : q;
      float which, su; float dS = lugSails(qs, which, su);
      float seamW = w*14.;
      float seam = (1. - smoothstep(0.035, 0.035 + seamW, abs(fract(qs.x*14. + qs.y*1.5 + 0.5*sin(qs.y*3.)) - 0.5)))*(1. - smoothstep(0.12, 0.33, seamW));
      float fineK = 1. - smoothstep(0.014, 0.04, w);          // cloth detail comes up as a sail is magnified, and is gone before it could shimmer
      float reef = (1. - smoothstep(max(0.006, w*0.8), max(0.006, w*0.8) + w, min(abs(qs.y - 0.38 - qs.x*0.08 + 0.05*su*(1. - su)), abs(qs.y - 0.515 - qs.x*0.1 + 0.05*su*(1. - su)))))*fineK;
      float pcoord = qs.x*14. + qs.y*1.5 + 0.5*sin(qs.y*3.), pid = floor(pcoord + 0.5);
      // sailcloth: cloths alternately a tone lighter and darker, weather stains, a few patches, a darker tabling
      // round the edges, and the shadow of mast and yard lying across it
      float cloth = 0.76 + 0.17*mod(pid, 2.) + 0.2*fract(sin(pid*12.9898 + fi*4.1 + which*7.)*43758.5453);
      float stn = textureLod(tCloud, qs*vec2(0.55, 0.4) + vec2(fi*0.37, which*0.21), 1.5).g, stn2 = textureLod(tCloud, qs*vec2(2.1, 0.5) + fi*0.13, 2.).r;
      cloth *= 0.7 + 0.6*stn - 0.22*smoothstep(0.62, 0.8, stn2)*fineK;
      vec2 pg = vec2(pcoord + 0.5, qs.y*5. + pid*0.37), pcl = floor(pg), pf = abs(fract(pg) - 0.5);
      float pat = step(0.93, fract(sin(dot(pcl, vec2(12.9898, 78.233)) + fi*3.3)*43758.5453))*(1. - smoothstep(0.3, 0.3 + seamW, pf.x))*(1. - smoothstep(0.22, 0.22 + w*5., pf.y))*fineK;
      cloth *= 1. + 0.12*pat*(fract(pcl.x*0.618 + pcl.y*0.31) < 0.5 ? 1. : -0.8);
      cloth *= 1. - 0.3*smoothstep(-0.03 - w, -0.012, dS)*fineK;
      float msh = (1. - smoothstep(0.012, 0.016 + w*2., min(segD(qs, vec2(-0.075, 0.16), vec2(-0.045, 1.0)), segD(qs, vec2(0.365, 0.16), vec2(0.38, 0.72)))))*0.24;
      msh = max(msh, (1. - smoothstep(0.014, 0.02 + w*2., min(segD(qs, vec2(-0.27, 0.655), vec2(0.21, 0.975)), segD(qs, vec2(0.22, 0.49), vec2(0.5, 0.675)))))*0.2);
      cloth *= 1. - msh*(1. - smoothstep(0.012, 0.03, w));
      float rrow = min(abs(qs.y - 0.35 - qs.x*0.08 + 0.05*su*(1. - su)), abs(qs.y - 0.485 - qs.x*0.1 + 0.05*su*(1. - su)));     // just under each reef band: the points hang there
      float rid = floor(pcoord*2.), rh = fract(sin(rid*91.7 + fi*5.3)*43758.5453), rdx = (fract(pcoord*2.) - 0.5)/28.;
      float ry1 = qs.y - 0.38 - qs.x*0.08 + 0.05*su*(1. - su), ry2 = qs.y - 0.515 - qs.x*0.1 + 0.05*su*(1. - su);
      float rlen = 0.026 + 0.022*rh, rsl = (rh - 0.5)*0.012;
      float tieD = min(segD(vec2(rdx, ry1), vec2(0., -0.004), vec2(rsl, -rlen)), segD(vec2(rdx, ry2), vec2(0., -0.004), vec2(-rsl, -rlen*0.85)));
      float rpt = lineK(tieD, 0.0028, w)*fineK*step(which, 1.5)*0.62 + 0.*rrow;
      vec3 sc = mix(uSailA, uSailB, which > 1.5 ? clamp(L.w + 0.35, 0., 1.) : L.w)*1.3*cloth*(1. - 0.45*rpt);
      if (uVar.x > 0.5 && uVar.x < 1.5){                        // regatta: white yachts with a coloured head panel, a coloured mizzen, striped spinnakers
        vec3 hue = mix(uSailA, mix(uSea, uSailB, step(0.66, fract(fi*0.618))), step(0.33, fract(fi*0.618)))*1.3;
        float bw = w*5., band = mix(0.5, smoothstep(0.5 - bw, 0.5 + bw, abs(fract(qs.y*5. + fi*0.37) - 0.5)*2.), 1. - smoothstep(0.15, 0.4, bw));
        sc = (which > 1.5 ? mix(hue, uPale*1.3, band) : which > 0.5 ? hue : mix(uPale*1.3, hue, smoothstep(0.64 - w, 0.64 + w, qs.y - 0.2*su)))*cloth*(1. - 0.45*rpt);
      } else if (uVar.x > 1.5) sc *= 0.5;                       // working boats among the steamers: dark tanned sails
      // bellied: light at the luff, dark in the belly, the leech catching the light again
      sc *= (mix(1.22, 0.62, smoothstep(0., 0.55, su)) + 0.34*smoothstep(0.62, 1., su))*(0.8 + 0.3*qs.y)*(1. - 0.26*seam - 0.22*reef);
      float sm = (1. - smoothstep(-w, w, dS))*show;
      col = mix(col, mix(sc, mix(col, sc, 0.62)*0.92, under), sm*mix(1., brk*(1. - smoothstep(0.1, 0.95, -q.y)), under));
      // spars, hull with a sheer and a pale strake, rudder, two figures on deck
      float spars = min(segD(q, vec2(-0.13, 0.08), vec2(-0.10, 1.05)), segD(q, vec2(0.31, 0.08), vec2(0.33, 0.76)));
      spars = min(spars, min(segD(q, vec2(-0.3, 0.69), vec2(0.23, 1.03)), segD(q, vec2(0.21, 0.52), vec2(0.52, 0.72))));
      spars = min(spars, segD(q, vec2(-0.78, 0.125), vec2(-0.4, 0.14)));
      float ytop = 0.09 + 0.3*q.x*q.x;
      float dHull = max(max(q.y - ytop, -q.y), max(q.x - 0.47 - 0.5*q.y, -0.46 - 0.8*q.y - q.x));
      dHull = min(dHull, quadD(q, vec2(0.47, -0.01), vec2(0.53, -0.01), vec2(0.575, 0.1), vec2(0.515, 0.1)));     // the rudder
      float fig = min(segD(q, vec2(0.395, ytop), vec2(0.4, ytop + 0.085)), segD(q, vec2(-0.03, ytop), vec2(-0.02, ytop + 0.08)));
      float hullK = 1. - smoothstep(-w, w, dHull);
      float dark = max(max(lineK(spars, 0.008, w), lineK(fig, 0.013, w)), hullK);
      col = mix(col, uSailB*0.055, dark*show);
      float strake = (1. - smoothstep(0.007, 0.007 + w, abs(q.y - ytop + 0.032)))*hullK*(1. - smoothstep(0.012, 0.03, w));
      col = mix(col, uPale*0.8, strake*show*0.85);
      // her dark side lying on the water under her, a white bow wave, the waterline and a wake astern
      float hx = 1. - smoothstep(0.42, 0.5, abs(q.x - 0.02));
      col = mix(col, uSailB*0.07, under*hx*(1. - smoothstep(0., 0.13, -q.y))*brk*0.7*show*step(q.y, 0.));
      float foam = (1. - smoothstep(0.4, 1., length((q - vec2(-0.47, 0.004))/vec2(0.1 + w, 0.035 + w))))*way;
      float wl = (1. - smoothstep(0.006, 0.008 + w, abs(q.y + 0.004)))*hx*(0.3 + 0.5*way);
      float wk = (1. - smoothstep(0.3, 1., abs(q.y + 0.014)/(0.012 + 0.035*max(q.x - 0.45, 0.) + w)))*smoothstep(0.46, 0.56, q.x)*(1. - smoothstep(0.62, 1.02, q.x))*way;
      col = mix(col, uPale*1.4, clamp(max(foam, max(wl, wk*0.8)), 0., 1.)*show*(0.75 + 0.25*sin(q.x*31. - t*4. + fi)));
    }
    // ---- the near lane: boats leaving close under the casement with a topsail set above the lug. Their hulls and
    //      lugsails hang on the bed-head wall; the topsail is high enough above the horizon to fall whole on the
    //      counterpane (a ten-degree beam stretches it sixfold along the bed, masthead toward the hole), and as she
    //      stands out to sea it slides from ridge to ridge toward the pillows.
    for (int j = 0; j < 7; j++){
      float fj = float(j);
      if (fj >= uLane.z) break;
      float p = fract(fj/max(uLane.z, 1.) + uLane.y + t*uLane.x + 0.02*sin(fj*2.4));
      float ac = mix(-0.64, 0.12, p), k = (0.137 - (ac + 0.03)*0.115)/0.16;      // five of them 0.15 rad apart: the bed (azimuth -0.45 to -0.03) always holds two or three
      vec2 q = vec2(a - ac, e)/k;
      if (abs(q.x) > 0.17 || q.y > 0.36 || q.y < -0.05) continue;
      float w = aw/k, show = smoothstep(0., 0.05, p)*(1. - smoothstep(0.93, 1., p));
      q.y -= 0.0025*sin(t*0.8 + fj*2.3); q.x += q.y*0.03*sin(t*0.55 + fj*1.9);
      float hsh = fract(sin(fj*12.9898 + uLane.w*78.233)*43758.5453);
      vec3 base = dot(uSailA, vec3(0.333)) < 0.12 ? uPale*vec3(0.62, 0.3, 0.1)*0.9 : mix(uSailA, uSailB, hsh < 0.5 ? 0.1 + 0.4*hsh : 0.3 + 0.7*hsh);
      // the lug, in the boat's own angle space (it hangs on the bed-head wall and the pillows)
      float dL = sailD(q, vec2(-0.062, 0.014), vec2(0.050, 0.017), vec2(0.052, 0.139), vec2(-0.040, 0.100), 0.008, 0.004);
      float su = clamp((q.x + 0.062)/0.114, 0., 1.);
      float pc = q.x*62. + q.y*9., seamW = w*62.;
      float seam = (1. - smoothstep(0.04, 0.04 + seamW, abs(fract(pc) - 0.5)))*(1. - smoothstep(0.12, 0.33, seamW));
      float cloth = 0.88 + 0.24*fract(sin(floor(pc + 0.5)*12.9898 + fj*4.1)*43758.5453);
      float reef = (1. - smoothstep(0.0006, 0.0006 + w, abs(q.y - 0.05 - q.x*0.03)))*(1. - smoothstep(0.0006, 0.002, w));
      vec3 hue1 = uSailA*1.5, hue2 = uSea*1.7, sc = base*1.5*cloth;
      float rg = (uVar.x > 0.5 && uVar.x < 1.5) ? 1. : 0.;
      if (rg > 0.5) sc = mix(uPale*1.5, hue1, smoothstep(0.05 - w, 0.05 + w, q.y - 0.3*q.x))*cloth;      // regatta: a white foot under a sail of one solid colour
      else if (uVar.x > 1.5) sc *= 0.72;
      sc *= (mix(1.16, 0.74, smoothstep(0., 0.5, su)) + 0.22*smoothstep(0.62, 1., su))*(1. - 0.22*seam - 0.16*reef);
      col = mix(col, sc, (1. - smoothstep(-w, w, dL))*show);
      // the topsail is the sail that falls on the counterpane, so it is cut for the counterpane: drawn in metres on the
      // level of the linen (27 m under the hole), where the ten-degree beam lays it down whole. sp = (across, up the
      // mast toward the hole). A jib-headed topsail: straight luff on the mast, pointed head, bellied leech and foot,
      // five cloths running up the sail, a reef band with its points, a darker tabling round the edge. Alternate
      // boats carry theirs 28 m nearer the hole, so two lie side by side on the bed with sky between.
      float Dm = 27.*length(o.xz)/max(o.y, 0.03);
      float D0 = min(27./tan(clamp(0.143*k, 0.05, 0.4)) + 6. - 16.*mod(fj, 2.), 182.);      // sliding toward the pillows, and stopping short of them
      vec2 sp = vec2((a - ac)*Dm, D0 - Dm);
      sp.x += 0.035*sp.y*sin(t*0.55 + fj*1.9) + 0.25*sin(t*0.8 + fj*2.3);
      if (abs(sp.x) < 13. && sp.y > -5. && sp.y < 25.){
        float wl = max(aw*Dm, 0.03);
        float dT = sailD(sp, vec2(-7., 0.), vec2(9., 0.8), vec2(-5.8, 19.5), vec2(-6.5, 19.2), 1.3, 0.6);
        float suT = clamp((sp.x + 7. - 0.06*sp.y)/max(16. - 0.8*sp.y, 0.5), 0., 1.);
        float pcT = (sp.x + 0.1*sp.y)/3.2, swT = wl/3.2;      // cloths run up the sail, along the beam: the ribs' small steps slide them without breaking them into checks
        float seamT = (1. - smoothstep(0.03, 0.03 + swT, abs(fract(pcT) - 0.5)))*(1. - smoothstep(0.15, 0.4, swT));
        float clothT = 0.84 + 0.3*fract(sin(floor(pcT + 0.5)*12.9898 + fj*7.3)*43758.5453);
        float ry = sp.y - 5.2 - 0.05*sp.x, lk = 1. - smoothstep(0.2, 0.6, wl);
        float reefT = (1. - smoothstep(0.16, 0.16 + wl, abs(ry)))*lk;
        float ptx = abs(fract(pcT*3.) - 0.5)*3.2/3.;
        float ptsT = (1. - smoothstep(0.1, 0.1 + wl, ptx))*(1. - smoothstep(0.9, 0.9 + wl, abs(ry + 0.9)))*lk;
        float hem = smoothstep(-0.75 - wl, -0.35, dT)*lk;
        vec3 st = base*1.3;
        if (rg > 0.5){                                          // regatta: stripes of two full colours and one cream band
          float bb = sp.y/3.7 - 0.5, bi = floor(bb), ew = clamp(wl/3.7, 0.01, 0.5);
          vec3 c0 = abs(bi - 2.) < 0.5 ? uPale*1.5 : (mod(bi, 2.) < 0.5 ? hue2 : hue1), c1 = abs(bi - 1.) < 0.5 ? uPale*1.5 : (mod(bi, 2.) < 0.5 ? hue1 : hue2);
          st = mix(c0, c1, smoothstep(0.5 - ew, 0.5 + ew, fract(bb)));
        } else if (uVar.x > 1.5) st *= 0.72;
        st *= clothT*(mix(1.2, 0.74, smoothstep(0., 0.55, suT)) + 0.26*smoothstep(0.66, 1., suT))*(1. - 0.34*seamT)*(1. - 0.3*reefT)*(1. - 0.5*ptsT)*(1. - 0.3*hem);
        col = mix(col, st, (1. - smoothstep(-wl, wl, dT))*show);
        float sparT = min(segD(sp, vec2(-7.7, -3.), vec2(-6.3, 22.5)), segD(sp, vec2(-8.2, -0.6), vec2(10.2, 0.6)));
        col = mix(col, uSailB*0.055, lineK(sparT, 0.36, wl)*show);
      }
      // mast, yards, hull with a pale strake, a line of foam
      float spars = min(segD(q, vec2(0.002, 0.004), vec2(0.006, 0.146)), segD(q, vec2(-0.043, 0.099), vec2(0.055, 0.141)));
      float ytop = 0.012 + 2.4*q.x*q.x;
      float dHull = max(max(q.y - ytop, -q.y), max(q.x - 0.078 - 0.5*q.y, -0.074 - 0.8*q.y - q.x));
      float hullK = 1. - smoothstep(-w, w, dHull);
      col = mix(col, uSailB*0.055, max(lineK(spars, 0.0013, w), hullK)*show);
      col = mix(col, uPale*0.8, (1. - smoothstep(0.001, 0.001 + w, abs(q.y - ytop + 0.0045)))*hullK*(1. - smoothstep(0.002, 0.005, w))*show*0.85);
      col = mix(col, uPale*1.4, (1. - smoothstep(0.001, 0.0015 + w, abs(q.y + 0.001)))*(1. - smoothstep(0.07, 0.085, abs(q.x)))*show*0.7);
    }
    // ---- gulls wheeling (they cross the room on their backs)
    for (int i = 0; i < ${De}; i++){
      if (float(i) >= uGullN) break;
      vec4 G = uGull[i]; float th = t*(0.22 + 0.2*fract(G.w*3.7)) + G.w;
      float gs = 0.013 + 0.012*fract(G.w*7.31);
      vec2 q = (ae - G.xy - G.z*vec2(cos(th), 0.42*sin(th*1.0 + 0.6)))/gs;
      if (dot(q, q) > 1.5) continue;
      float w = aw/gs, f = 0.25 + 0.55*sin(t*5.2 + G.w*9.);
      q.x *= sin(th) < 0. ? -1. : 1.; q.y -= 0.12*q.x;                 // banked into her turn
      float x = min(abs(q.x), 1.), yw = (0.35 + 1.1*f)*x*(1. - 0.8*x) - 0.25*f*x*x;        // the wing's curve: up to the wrist, drooping to the tip
      float slope = (0.35 + 1.1*f)*(1. - 1.6*x) - 0.5*f*x;
      float dw = max(abs(q.y - yw)/sqrt(1. + slope*slope), abs(q.x) - 1.);
      float thk = 0.02 + 0.105*(1. - x)*(1. - 0.5*x);
      float wing = (1. - smoothstep(thk - w, thk + w, dw))*min(1., thk/max(w*0.75, 1e-3));
      float body = 1. - smoothstep(1. - w*5., 1. + w*5., length((q - vec2(0.04, -0.02))/vec2(0.2, 0.115)));
      vec3 gc = mix(uPale*1.5, uSailB*0.1, smoothstep(0.74, 0.9, x));
      col = mix(col, gc, clamp(max(wing, body), 0., 1.));
    }
    // ---- the moored masts by the casement: black bars across everything, swaying together
    float bar = 0.;
    for (int i = 0; i < ${We}; i++){
      vec4 M = uMast[i]; float sway = 0.022*sin(t*0.55 + M.w) + 0.008*sin(t*1.3 + M.w*2.);
      float x = a - M.x - sway*(e + 0.9);
      if (abs(x) > 0.3 || e > M.y + 0.05) continue;
      float taper = 1. - 0.5*smoothstep(-0.9, M.y, e);
      float m = lineK(abs(x), M.z*taper, aw)*(1. - smoothstep(M.y - aw, M.y + aw, e));
      float ey = M.y*0.6;                                                   // the yard with its furled sail
      m = max(m, lineK(segD(vec2(x, e), vec2(-0.15, ey - 0.02), vec2(0.15, ey + 0.02)), M.z*0.75, aw));
      bar = max(bar, m);
    }
    col *= 1. - 0.93*bar;
    // ---- the rare near sail: for three seconds the whole room is sail, seams and reef points sweeping every surface
    if (uNear > 0.001){
      // one enormous sail passing right under the window: narrow dark seams a tenth of the frame apart, each cloth its
      // own tone, one reef band with a row of short hanging ties, and a curved leech with its bolt rope that sweeps in
      // from the right and out to the left, the harbour still showing beyond it
      float sw3 = a*16. + e*2.8;
      float sw = max(aw*16., 0.006);
      float seam = (1. - smoothstep(0.03, 0.03 + sw, abs(fract(sw3) - 0.5)))*(1. - smoothstep(0.2, 0.45, sw));
      float pid3 = floor(sw3 + 0.5), hp = fract(sin(pid3*12.9898)*43758.5453);
      float panel = 0.74 + 0.16*mod(pid3, 2.) + 0.24*hp;
      float stn3 = textureLod(tCloud, vec2(a*0.35, e*0.3) + 0.4, 2.).g;
      float ry3 = e - 0.1 - 0.05*a + 0.03*sin(a*2.);
      float band3 = (1. - smoothstep(0.007, 0.007 + aw, abs(ry3)))*(1. - smoothstep(0.006, 0.016, aw));
      float tie = segD(vec2((fract(sw3*2.) - 0.5)/32., ry3), vec2(0., -0.006), vec2(0.002, -0.06));
      float ties = lineK(tie, 0.003, aw)*(1. - smoothstep(0.004, 0.012, aw));
      vec3 ns = (dot(uSailA, vec3(0.333)) < 0.12 ? uPale*vec3(0.62, 0.3, 0.1) : uSailA)*1.1*panel*(0.72 + 0.5*stn3)*(0.86 + 0.4*e)*(0.8 + 0.3*sin(a*1.7 + 0.6))*(1. - 0.62*seam)*(1. - 0.45*band3)*(1. - 0.65*ties);
      // the leech: az of the edge at this height, bellied; it crosses the whole picture as uNear goes 0 -> 1 -> 0
      float edge = mix(1.75, -1.75, uNear) + 0.5*e*e - 0.18*e + 0.05*sin(e*5. + t*0.7);
      float cover = smoothstep(-aw, aw, a - edge);
      float rope = lineK(abs(a - edge - 0.012), 0.008, aw);
      ns *= 0.75 + 0.25*smoothstep(0.02, 0.1, a - edge);          // the tabling inside the rope
      col = mix(col, ns, cover);
      col = mix(col, uSailB*0.06, rope);
    }
    // ---- a squall: curtains of rain crossing the bay one after another (half a radian apart), so they cross the room
    //      strip by strip. In the picture each is a slanting band (azimuth against height) 0.12 rad wide, coming in from
    //      the sea: on the floor it goes board by board toward the shutter, on the linen (where it is some 16 m wide, a
    //      quarter of the bed, lying aslant across the ridges) from ridge to ridge in about 12 s, on the walls it climbs
    //      slowly. Inside it the picture is a stop darker and a little slate, never grey: a sail in the rain is still tan.
    //      The rain itself is pale streaks a metre apart falling down the band, drawn only where they are wider than a
    //      pixel or so. Its leading edge is the sharper one.
    if (uVar.y > 0.5){
      float sq = mod(a + 4.*(e - 0.18) - t*0.026 - (uVar.y - 1.)*2. + 0.25, 0.5) - 0.25;
      float cur = smoothstep(-0.1, -0.045, sq)*(1. - smoothstep(0.04, 0.062, sq));
      float sid = (a + 0.22*e)*170., shh = fract(sin(floor(sid)*12.9898)*43758.5453), sfw = aw*170.;
      float line = (1. - smoothstep(0.13, 0.13 + max(sfw, 0.04), abs(fract(sid) - 0.5)))*step(fract(e*(26. + 14.*shh) + t*(0.45 + 0.4*shh) + shh*7.), 0.62);
      line *= (1. - smoothstep(0.22, 0.55, sfw))*step(0.2, shh);
      col *= mix(vec3(1.), vec3(0.4, 0.46, 0.56)*(1. + line), cur);
    }
    // ---- sea fog burning off: the picture milky, then in full colour (the world eases uVar.z from u)
    col = mix(col, mix(vec3(dot(col, vec3(0.25, 0.6, 0.15))), uPale, 0.45)*0.9, uVar.z*0.72);
    // ---- a cloud over the harbour's sun: dimmer and cooler, eased by the caller
    col = mix(col, dot(col, vec3(0.25, 0.6, 0.15))*mix(uSky, vec3(1.), 0.55)*1.1, uCool*0.4);
    return col*uGain;
  }
  // filter width for picture(): call this in main(), never inside a loop (fragment shaders only: a material
  // whose VERTEX shader includes STYLE_GLSL sets defines: { NO_DERIV: 1 })
  #ifndef NO_DERIV
  float picFoot(vec3 P){ vec3 o = uHole - P; o /= max(length(o), 1e-3); return length(fwidth(o))*0.7; }
  #endif
  // the cosine-to-axis falloff: brightest straight opposite the hole, a third as bright at the edges
  float picFall(vec3 P){ vec3 o = uHole - P; float c = max(o.x, 0.)/max(length(o), 1e-3); return 0.3 + 0.7*c*sqrt(c); }
  vec3 picture(vec3 P, float aw){
    vec3 o = uHole - P; float dist = length(o); o /= max(dist, 1e-3);
    if (o.x < 0.01) return vec3(0.);
    return harbour(o, max(aw, uSoft/max(dist, 6.)))*smoothstep(0.015, 0.2, o.x)*smoothstep(2.6, 12., uHole.x - P.x);
  }`,Ct=`
  uniform vec3 uBoxA[${Ge}], uBoxB[${Ge}], uCapB[${Ee}], uEllC[${ke}], uEllR[${ke}];
  uniform vec4 uCapA[${Ee}], uFold, uBed, uLens;
  uniform vec3 uMothF, uMothN;
  // the moth as the hole sees it laid flat: one rounded wing either side of a short body (q in the moth's own units:
  // x across the span, y toward the nose; the wings reach 2.45 from the middle, as the moth's own do)
  float mothSil(vec2 q){
    q.x = abs(q.x);
    vec2 p = q - vec2(1.22, -0.12);
    p = vec2(p.x*0.94 - p.y*0.34, p.x*0.34 + p.y*0.94)/vec2(1.32, 0.98);       // one rounded wing a side, swept back a little
    vec2 pa = q - vec2(0., 0.95), ba = vec2(0., -2.);
    return min((length(p) - 1.)*0.98, length(pa - ba*clamp(dot(pa, ba)/4., 0., 1.)) - 0.27);
  }
  // the counterpane: soft ridges running across the beam (along Z), wandering, with small wrinkles on top
  float foldH(vec2 p){
    float u = p.x + 3.5*sin(p.y*0.047 + uFold.x) + 1.8*sin(p.y*0.118 + p.x*0.021 + uFold.y);
    float r = 0.5 + 0.5*sin(u*0.5 + 0.5*sin(u*0.083 + uFold.z));
    float amp = 0.88 + 0.12*sin(p.y*0.06 + p.x*0.033 + uFold.x*1.7);
    float h = 2.1*r*r*sqrt(r)*amp + 0.03*sin(u*1.3 + p.y*0.31 + uFold.y*2.) + 0.02*sin(p.y*0.6 - u*0.5 + uFold.z*3.);
    float edge = min(min(p.x - uBed.x, uBed.y - p.x), min(p.y - uBed.z, uBed.w - p.y));
    return 43.4 + uFold.w*h*(0.3 + 0.7*smoothstep(0., 7., edge));
  }
  float shadowBC(vec3 P, vec3 N, float pw){
    vec3 ro = P + N*0.08, rd = uHole - ro; float tm = length(rd); rd /= max(tm, 1e-3);
    vec3 ird = vec3(rd.x < 0. ? -1. : 1., rd.y < 0. ? -1. : 1., rd.z < 0. ? -1. : 1.)/max(abs(rd), 1e-5);
    float lit = 1., e0 = pw*1.2 + 0.015;
    for (int i = 0; i < ${Ge}; i++){
      vec3 t0 = (uBoxA[i] - ro)*ird, t1 = (uBoxB[i] - ro)*ird, mn = min(t0, t1), mx = max(t0, t1);
      float tn = max(max(mn.x, mn.y), max(mn.z, 0.)), tf = min(min(mx.x, mx.y), min(mx.z, tm));
      lit *= 1. - smoothstep(0., e0*4., tf - tn);
    }
    vec3 d1 = rd*tm; float aa = tm*tm;
    for (int i = 0; i < ${Ee}; i++){
      vec3 A = uCapA[i].xyz, d2 = uCapB[i] - A, r = ro - A;
      float ee = max(dot(d2, d2), 1e-4), f = dot(d2, r), c = dot(d1, r), b = dot(d1, d2), den = aa*ee - b*b;
      float s = den > 1e-5 ? clamp((b*f - c*ee)/den, 0., 1.) : 0.;
      float tt = clamp((b*s + f)/ee, 0., 1.);
      s = clamp((b*tt - c)/max(aa, 1e-4), 0., 1.);
      float d = length(r + d1*s - d2*tt);
      lit *= smoothstep(uCapA[i].w - e0, uCapA[i].w + e0, d);
    }
    return lit;
  }
  float shadowAt(vec3 P, vec3 N, float pw){
    vec3 ro = P + N*0.08, rd = uHole - ro; float tm = length(rd); rd /= max(tm, 1e-3);
    float lit = shadowBC(P, N, pw), e0 = pw*1.2 + 0.015;
    for (int i = 0; i < ${ke}; i++){
      vec3 R = max(uEllR[i], vec3(1e-3)), o2 = (ro - uEllC[i])/R, dd = rd/R;
      float A = max(dot(dd, dd), 1e-6), B = dot(o2, dd), tc = -B/A;
      float dn = sqrt(max(dot(o2, o2) - B*B/A, 0.));
      float wn = e0/mix(min(R.x, min(R.y, R.z)), max(R.x, max(R.y, R.z)), 0.4);
      if (i == ${ke-1}){
        // the last slot is the moth's: not an egg but the moth itself, a flat outline of two wing lobes either side of a
        // short body lying in a plane through uEllC (normal uMothN, nose along uMothF, uEllR.x its scale). Low over the
        // linen the plane is level, so the shadow on the linen is the moth's own outline at its own size, slid down the
        // beam; in the air the plane faces the hole, so on a wall it is the moth magnified. Its edge is as hard as a lake's.
        float den = dot(rd, uMothN); den = abs(den) < 1e-3 ? (den < 0. ? -1e-3 : 1e-3) : den;
        float tp = dot(uEllC[i] - ro, uMothN)/den, sc = max(uEllR[i].x, 1e-3);
        vec3 hm = ro + rd*tp - uEllC[i];
        float dmo = mothSil(vec2(dot(hm, cross(uMothF, uMothN)), dot(hm, uMothF))/sc)*sc;
        lit *= (tp > 0. && tp < tm) ? smoothstep(-e0, e0, dmo) : 1.;
        continue;
      }
      lit *= (tc > 0. && tc < tm) ? smoothstep(1. - wn, 1. + wn, dn) : 1.;
    }
    return lit;
  }
  // the counterpane's own folds, marched toward the hole (P on or near the linen top)
  float foldShadow(vec3 P, float pw){
    vec3 rd = uHole - P; rd /= max(length(rd), 1e-3);
    float m = 1e3, st = 0.7;
    for (int i = 0; i < 10; i++){
      vec3 p = P + rd*st;
      float inb = step(uBed.x, p.x)*step(p.x, uBed.y)*step(uBed.z, p.z)*step(p.z, uBed.w);
      m = min(m, mix(1e3, (p.y - foldH(p.xz))/st, inb));
      st = st*1.42 + 0.35;
    }
    return smoothstep(-0.004 - pw*0.03, 0.012 + pw*0.03, m);
  }`,Rt=`
  uniform vec4 uTint;      // x: how much a matte tints the picture, y: reflectance floor of a dark matte, z: ambient (0.03), w: glass gain
  uniform vec2 uSlosh;
  vec3 caustic(vec3 P, float aw, float pw){
    vec3 rd = uHole - P; float tm = length(rd); rd /= max(tm, 1e-3);
    vec3 Lc = uLens.xyz - P; float tc = dot(Lc, rd);
    if (tc < 1. || tc > tm) return vec3(0.);
    vec3 c = Lc - rd*tc; float k = length(c)/max(uLens.w, 1e-3);
    if (k > 0.6) return vec3(0.);
    vec2 sd = vec2(-rd.z, rd.x); sd /= max(length(sd), 1e-3);
    float az = -dot(c.xz, sd)/uLens.w*2.3 + uSlosh.x, el = -c.y/uLens.w*0.8 + 0.09 + uSlosh.y;
    vec3 o = vec3(cos(el)*cos(az), sin(el), cos(el)*sin(az));
    return harbour(o, max(pw*3.*2.3/max(uLens.w, 1e-3), 0.012))*(1. - smoothstep(0.4, 0.52, k))*1.6;
  }
  vec3 roomLight(vec3 P, vec3 N, float aw, float pw){
    vec3 o = uHole - P; o /= max(length(o), 1e-3);
    float ndl = dot(N, o), face = smoothstep(-0.02, 0.03, ndl);
    float lam = 0.35 + 0.65*smoothstep(0., 0.55, ndl);
    vec3 L = picture(P, aw)*(picFall(P)*lam*face*shadowAt(P, N, pw));
    return L + caustic(P, aw, pw)*face;
  }
  vec3 matteTint(vec3 m){
    float mx = max(m.r, max(m.g, m.b)), lum = dot(m, vec3(0.2126, 0.7152, 0.0722));
    return mix(vec3(1.), m/max(mx, 1e-3), uTint.x)*(uTint.y + (1. - uTint.y)*smoothstep(0., 0.7, lum));
  }
  vec3 roomDark(vec3 N){ return mix(uSky*0.9, uSea*0.6, 0.5 + 0.5*N.y)*uTint.z*uGain; }`,Oe=zt+Bt+Ct+Rt,mt=`
  attribute vec3 aCol; attribute float aKind, aSway;
  uniform float uTime;
  varying vec3 vWP, vN, vCol; varying float vKind, vSway;
  void main(){
    vec3 p = position; vSway = aSway;
    // aSway > 0: hung cloth (drape, towel) breathing in the draught, more toward its free hem
    p.x += aSway*(0.5*sin(uTime*0.7 + p.z*0.21 + p.y*0.12) + 0.22*sin(uTime*1.6 + p.z*0.6));
    p.z += aSway*0.3*sin(uTime*0.9 + p.x*0.3 + p.y*0.2);
    vec4 w = modelMatrix*vec4(p, 1.);
    vWP = w.xyz; vN = normalize(mat3(modelMatrix)*normal + vec3(0., 1e-6, 0.)); vCol = aCol; vKind = aKind;
    gl_Position = projectionMatrix*viewMatrix*w;
  }`,pt={sprig:[.9,.53]},wt=s=>s.toFixed(4),Ft=`
  ${Oe}
  varying vec3 vWP, vN, vCol; varying float vKind;
  const float SPRIG_GROUND = ${wt(pt.sprig[0])}, SPRIG_FIGURE = ${wt(pt.sprig[1])};
  float h1(float n){ return fract(sin(n*127.1)*43758.5453); }
  float tl(float pw, float s){ return clamp(log2(max(pw*s*256., 1e-3)), 0., 7.); }
  void main(){
    vec3 P = vWP, N = normalize(vN + vec3(0., 1e-5, 0.));
    if (!gl_FrontFacing) N = -N;
    float aw = picFoot(P), pw = length(fwidth(P));
    vec3 oi = uHole - P; oi /= max(length(oi), 1e-3);
    float ndi = dot(N, oi), ew = clamp(fwidth(ndi), 0.012, 0.3);       // (derivative taken here, outside every branch)
    vec3 m = vCol; float k = 1.;
    if (vKind > 0.5 && vKind < 1.5){               // floorboards
      float bx = P.x/7., id = floor(bx), fx = abs(fract(bx) - 0.5)*7.;       // metres from the board's centre line
      float gw = max(pw*0.8, 0.03), gap = smoothstep(3.5 - 0.16 - gw, 3.5 - 0.16 + gw, fx)*min(1., 0.16/max(pw, 0.16));
      float jz = P.z/34. + h1(id)*7.; float jd = abs(fract(jz) - 0.5)*34.;
      gap = max(gap, (1. - smoothstep(0.07, 0.07 + gw, jd))*min(1., 0.14/max(pw, 0.14)));
      float grain = textureLod(tCloud, vec2(P.x*0.11 + h1(id)*3., P.z*0.006 + h1(id + 9.)), tl(pw, 0.11)).g;
      float fine = textureLod(tCloud, vec2(P.x*0.9, P.z*0.03 + h1(id)*5.), tl(pw, 0.9)).r;
      k = (0.93 + 0.08*h1(id + 3.))*(0.9 + 0.2*grain)*(0.93 + 0.14*fine*(1. - smoothstep(0.05, 0.3, pw)));
      k *= 1. - 0.6*gap;
    } else if (vKind > 1.5 && vKind < 2.5){        // wallpaper: a sprig of three leaves on a half-drop repeat
      vec2 uv = vec2(abs(N.x) > 0.5 ? P.z : P.x, P.y);
      vec2 g = uv/vec2(9., 12.); float col = floor(g.x); g.y += 0.5*mod(col, 2.);
      vec2 q = (fract(g) - 0.5)*vec2(9., 12.); q.x *= mod(floor(g.y) + col, 2.) < 0.5 ? 1. : -1.;
      float w = max(pw, 0.02);
      float d = segD(q, vec2(-0.6, -3.2), vec2(0.5, 2.4)) - 0.11;
      vec2 l1 = q - vec2(1.5, 1.6), l2 = q - vec2(-1.5, 0.2), l3 = q - vec2(0.9, 3.4);
      d = min(d, length(vec2(l1.x*0.8 - l1.y*0.6, (l1.x*0.6 + l1.y*0.8)*2.3)) - 1.35);
      d = min(d, length(vec2(l2.x*0.8 + l2.y*0.6, (-l2.x*0.6 + l2.y*0.8)*2.3)) - 1.25);
      d = min(d, length(vec2(l3.x*0.3 - l3.y*0.95, (l3.x*0.95 + l3.y*0.3)*2.4)) - 1.1);
      float sprig = (1. - smoothstep(-w, w, d))*(1. - smoothstep(1.5, 4., pw));
      float stripe = 0.5 + 0.5*sin(uv.x*6.2832/1.5); stripe *= 1. - smoothstep(0.2, 0.5, pw);
      float nzp = textureLod(tCloud, uv*0.013, tl(pw, 0.013)).r - 0.5;
      k = SPRIG_GROUND + (SPRIG_FIGURE - SPRIG_GROUND)*sprig + 0.06*nzp + 0.*stripe;
      if (uVar.w > 0.5 && uVar.w < 1.5){            // sage stripe: broad and narrow bands, matte on matte
        float sx = abs(fract(uv.x/9.) - 0.5)*9., sw = max(pw, 0.03);
        float broad = smoothstep(1.4 - sw, 1.4 + sw, sx)*(1. - smoothstep(3.1 - sw, 3.1 + sw, sx));
        float pin = (1. - smoothstep(0.12, 0.12 + sw, abs(sx - 0.7)))*(1. - smoothstep(0.3, 0.9, pw));
        k = 0.92 + 0.07*broad + 0.04*pin + 0.05*nzp;
      } else if (uVar.w > 1.5){                     // bare whitewash: brush strokes and a little damp
        float br = textureLod(tCloud, vec2(uv.x*0.21, uv.y*0.012), tl(pw, 0.21)).g;
        k = 0.9 + 0.12*(br - 0.5)*(1. - smoothstep(0.3, 1.2, pw)) + 0.16*nzp;
      }
    } else if (vKind > 2.5 && vKind < 3.5){        // marble
      float n1 = textureLod(tCloud, P.xz*0.021 + P.y*0.013, tl(pw, 0.021)).r, n2 = textureLod(tCloud, P.zx*0.05 + 0.3 + P.y*0.02, tl(pw, 0.05)).g;
      float vein = 1. - smoothstep(0.012, 0.05 + pw*0.02, abs(n1 + 0.25*n2 - 0.62));
      k = 0.9 + 0.16*n2 - 0.33*vein;
    } else if (vKind > 3.5 && vKind < 5.5){        // turned iron and wood: breakup along the length
      k = (0.85 + 0.3*textureLod(tCloud, vec2(P.y*0.05 + P.x*0.03, P.z*0.04), tl(pw, 0.05)).g)*(vKind > 4.5 ? mix(0.5, 1., smoothstep(0.015, 0.021, dot(vCol, vec3(0.2126, 0.7152, 0.0722)))) : 0.56);      // (a wood given a matte darker than the room's umber is dark-stained: half as bright, like the world's bentwood chair; every wood of the part itself is umber or lighter and is unchanged)
    }
    vec3 RL = roomLight(P, N, aw, pw);
    if (vKind > 5.5){
      // glazed white china (ewer, basin): the picture lies on it calm and filtered (no stripe of a stretched sail), a
      // thin rim of it runs round every edge turned from the hole, the hole itself glints on the shoulder, and the dark
      // side holds the room's own blue-black instead of nothing
      vec3 Vv = cameraPosition - P; Vv /= max(length(Vv), 1e-3);
      vec3 o = uHole - P; o /= max(length(o), 1e-3);
      float ndl = dot(N, o), sh = shadowBC(P, N, pw), fr = 1. - abs(dot(N, Vv)); fr *= fr*fr;
      vec3 pic = picture(P, max(aw, 0.05))*picFall(P);
      RL = pic*((0.35 + 0.65*smoothstep(0., 0.55, ndl))*smoothstep(-0.02, 0.03, ndl)*sh);
      RL += pic*sh*(1.1*fr*smoothstep(-0.75, 0.1, ndl) + 0.3*smoothstep(-0.3, 0.02, ndl)*(1. - smoothstep(0.02, 0.3, ndl)));
      RL += uPale*(0.9*smoothstep(0.988, 0.998, dot(reflect(-Vv, N), o))*sh*uGain);
      RL += mix(uSky, uSea, 0.5 + 0.5*N.y)*(uGain*(0.05 + 0.07*fr));
    }
    // what the lit room throws back (the picture again, at second hand): the bed-head wall is the screen and the
    // brightest thing in the room, the sky lies on the floor, the sea on the far wall. It gives furniture its form on
    // the side turned from the hole (iron, wood and marble take the most), and iron a small glint of the hole itself
    float furn = step(2.5, vKind)*step(vKind, 5.5), nearWall = smoothstep(118., 123., P.x);
    vec3 back = (mix(uSea, uPale, 0.3)*(max(-N.x, 0.)*1.3) + mix(uSky, uSea, 0.45)*(max(N.z, 0.)*1.1) + uSky*(max(-N.y, 0.)*1.0) + mix(uSky, uSea, 0.5)*(0.3 + 0.3*max(N.x, 0.)))*(uTint.z*uGain);
    RL += back*mix(0.35, mix(2.6, 1.1, nearWall), furn)*(vKind > 3.5 && vKind < 4.5 ? 0.55 : 1.);      // iron stays near black on the side turned from the hole
    if (vKind > 3.5 && vKind < 4.5){
      // black iron is polished where hands have turned it: the side that faces the hole carries a hard-edged cap of the
      // picture, bent over the turning (a strip of sky, sea line and sail on a knob, one crisp line of colour down a rail
      // or a spindle), and the rest is black but for a thin rim of what the room throws back
      vec3 Vi = cameraPosition - P; Vi /= max(length(Vi), 1e-3);
      float fr = 1. - abs(dot(N, Vi));
      float cap = smoothstep(0.5 - ew, 0.5 + ew, ndi)*(1. - smoothstep(0.5, 1.4, ew*3.));
      vec3 bent = picture(P + N*13., max(aw, 0.012))*(picFall(P)*shadowAt(P, N, pw));
      float gl = max(dot(reflect(-Vi, N), oi), 0.); gl *= gl; gl *= gl; gl *= gl; gl *= gl; gl *= gl; gl *= gl;
      RL = RL*(1. - 0.6*cap) + (bent*(1.7*cap) + uPale*(1.2*gl*step(0., ndi)*uGain) + back*(1.6*fr*fr))/max(k, 0.2);
    }
    vec3 D = matteTint(m)*k*(RL + roomDark(N));
    gl_FragColor = vec4(toScene(D), 1.);
  }`;function Lt(s,u={}){return new e.ShaderMaterial({uniforms:s.uniforms,vertexShader:mt,fragmentShader:Ft,side:u.side??e.FrontSide,fog:!1})}const Tt=`
  ${Oe}
  varying vec3 vWP, vN, vCol; varying float vKind, vSway;
  void main(){
    vec3 P = vWP, N = normalize(vN + vec3(0., 1e-5, 0.));
    if (!gl_FrontFacing) N = -N;
    float aw = picFoot(P), pw = length(fwidth(P));
    vec3 Pq = P; float fs = 1., rib = 0., weave = 1., fthn = fwidth(vCol.x);
    if (vKind > 0.5 && vKind < 1.5){
      const float E = 0.2;
      float h0 = foldH(P.xz), hx = foldH(P.xz + vec2(E, 0.)), hz = foldH(P.xz + vec2(0., E));
      N = normalize(vec3(h0 - hx, E, h0 - hz));
      // ribs 1.3 m apart running along Z; each rib shows the picture of its own crest, so sails move in steps
      const float RW = 1.3;
      float keep = 1. - smoothstep(0.22, 0.45, pw/RW);
      float rx = P.x/RW, rf = fract(rx) - 0.5;
      Pq.x = mix(P.x, (floor(rx) + 0.5)*RW, 0.55*keep);
      rib = cos(rf*6.2832)*keep;
      fs = foldShadow(vec3(P.x, h0 + 0.03, P.z), pw);
    } else {
      // plain cloth: a faint thread so it does not read as plaster
      weave = 0.96 + 0.04*sin(P.y*9.)*(1. - smoothstep(0.08, 0.25, pw));
      // ribs 1.3 m apart, as on the counterpane's top; never on hung cloth (the drape, the towel: aSway > 0), where a level
      // band crossed with the pleats makes bricks: muslin hangs in long unbroken strips, torn only by its folds
      float hung = step(0.004, vSway);
      weave = mix(weave, 1., hung*smoothstep(0.03, 0.12, pw));         // (and its thread is seen only within a few metres)
      weave *= mix(0.86 + 0.14*cos(P.y*4.833)*(1. - smoothstep(0.25, 0.6, pw)), 0.93, hung);
    }
    vec3 o = uHole - P; o /= max(length(o), 1e-3);
    float ndl = dot(N, o);
    if (vKind > 1.5) ndl = abs(ndl)*0.6 + 0.4;       // thin paper (seed pods, moth wings): takes the picture on both faces
    // (the law of the light holds for hung cloth too: a pleat of the drape or a face of the towel that is turned from the
    // hole is unlit, and keeps only the cool fill the lit room throws back)
    float face = smoothstep(-0.015, 0.035, ndl), lam = 0.3 + 0.7*smoothstep(0., 0.4, ndl);
    // muslin is a scrim: what falls on it is a little soft, and one pleat is only a little dimmer than the next, so a hull's
    // hard bands crossing the slanting pleats are a rippled picture and never a staircase of black and white blocks
    if (vKind < 0.5 && vSway > 0.004){ aw = max(aw, 0.016); lam = 0.7 + 0.3*lam; }
    if (vKind > 0.5 && vKind < 1.5) lam = 0.5 + 0.5*smoothstep(0.02, 0.36, ndl);      // the counterpane lies nearly edge-on to the beam: its level ground is still a white country
    vec3 L = picture(Pq, aw)*(picFall(P)*lam*face*fs*shadowAt(P, N, pw)*(1. + 0.1*rib - 0.07*rib*rib)*weave);
    // white cloth turned from the hole still takes what the lit room throws back: the far wall (the screen), the sky
    // on the floor, the sea on the bed-head wall; so a hang in shadow shows its folds, ribs and hem, faintly
    vec3 back = (mix(uSky, uSea, 0.45)*(max(N.z, 0.)*1.5) + uSky*(max(-N.y, 0.)*0.9) + mix(uSea, uPale, 0.3)*(max(-N.x, 0.)*1.1) + mix(uSky, uSea, 0.5)*(max(N.x, 0.)*0.25))*(uTint.z*uGain*weave*4.5);
    if (vKind > 1.5) back = picture(P, 0.06)*0.1 + roomDark(N)*2.;                    // a seed pod is translucent: it never goes quite out
    else if (vKind > 0.5) back *= 0.1;                                                // the counterpane's top: a hollow behind a ridge is a shadow, and a shadow is black (a hard black lake, no fill)
    vec3 tint = matteTint(vCol);
    if (vKind > 2.5){
      // the moth. vCol = (angle across the wing's fan 0..1, root 0 .. rim 1, part). Pale and translucent: the colour of
      // its ray glows through it, taken wide so that a mast's bar or a hull never puts a wing out
      float thn = vCol.x, rr = vCol.y, part = vCol.z, ghost = step(3.5, part); part -= 4.*ghost;
      vec3 cream = vec3(0.97, 0.93, 0.84); float cov = 1.;
      vec3 Vv = cameraPosition - P; Vv /= max(length(Vv), 1e-3);
      if (part < 1.5){
        float nv = part < 0.5 ? 9. : 7., fv = fthn*nv;
        float vein = (1. - smoothstep(0.07, 0.07 + fv, abs(fract(thn*nv) - 0.5)))*smoothstep(0.1, 0.3, rr)*(1. - smoothstep(0.2, 0.5, fv));
        float margin = smoothstep(0.78, 0.92, rr), bar = smoothstep(0.5, 0.56, rr)*(1. - smoothstep(0.62, 0.7, rr));
        tint = cream*(1. - 0.45*vein)*(1. - 0.34*margin)*(1. - 0.14*bar)*(1. - 0.3*(1. - smoothstep(0.02, 0.06, thn)))*(part > 0.5 ? 0.9 : 1.)*(0.62 + 0.38*smoothstep(0., 0.35, rr));
        float comb = abs(fract(thn*(ghost > 0.5 ? 13. : 30.)) - 0.5)*2.;          // 0 on a streak's centre line .. 1 between streaks
        // the lagging copies are the blur of the beat: a short uneven fringe at the rim (each feather its own length, a sixth
        // of the wing at most, one in five missing), never a row of spikes standing past the wing
        float fid = floor(thn*13.) + part*17., fh1 = fract(sin(fid*12.9898 + 4.1)*43758.5453), fh2 = fract(sin(fid*78.233 + 1.7)*43758.5453);
        cov = ghost > 0.5 ? step(comb, 0.45 + 0.3*fh2)*step(0.84 + 0.13*fh1, rr)*step(fh2, 0.8) : step(comb, 1.6 - 1.3*smoothstep(0.9, 1., rr));
      } else {
        float fr = 1. - abs(dot(N, Vv));
        float fur = textureLod(tCloud, vec2(thn*0.9, atan(N.y, abs(N.x) + 1e-3)*0.6), 1.).g;
        tint = cream*vec3(0.78, 0.72, 0.64)*(0.7 + 0.5*fur)*(1. + 0.7*fr*fr);
      }
      if (cov < 0.5) discard;
      tint *= 1. - 0.2*ghost;
      // thin paper in the beam: the wing takes the colour of its own ray (sail-tan while a sail's ray is on it, cobalt when
      // the sail has slid off, sea green above the axis) at the gain of cloud and sail, taken a little wide so that a mast's
      // bar never puts a wing out; so it is a step paler than a wall or a sheet lit by the same ray, by gain and not by white
      vec3 glow = picture(P, 0.045)*picFall(P);
      L = glow*1.55;
      back = mix(uSky, uPale, 0.5)*(0.09*uGain) + roomDark(N)*2.;
    }
    vec3 D = tint*(L + roomDark(N) + back);
    gl_FragColor = vec4(toScene(D), 1.);
  }`;function Vt(s,u={}){return new e.ShaderMaterial({uniforms:s.uniforms,vertexShader:mt,fragmentShader:Tt,side:u.side??e.DoubleSide,fog:!1})}const Nt=`
  attribute float aKind;
  varying vec3 vWP, vN; varying float vKind;
  void main(){
    vec4 w = modelMatrix*vec4(position, 1.);
    vWP = w.xyz; vN = normalize(mat3(modelMatrix)*normal + vec3(0., 1e-6, 0.)); vKind = aKind;
    gl_Position = projectionMatrix*viewMatrix*w;
  }`,Dt=`
  ${Oe}
  varying vec3 vWP, vN; varying float vKind;
  void main(){
    vec3 P = vWP, N = normalize(vN + vec3(0., 1e-5, 0.));
    vec3 V = cameraPosition - P; float vd = length(V); V /= max(vd, 1e-3);
    if (dot(N, V) < 0.) N = -N;
    float aw = picFoot(P)*3., gw = clamp(length(fwidth(N))*0.9, 0.006, 0.05);
    vec3 nv = N - V*dot(N, V);                       // what of the normal lies across the view: 0 at the centre, 1 at the rim
    vec2 rt = vec2(V.z, -V.x); rt /= max(length(rt), 1e-3);     // screen right, level
    float kx = dot(nv.xz, rt), ky = nv.y, k = length(nv);
    float hv = max(length(V.xz), 1e-3);
    float turn = 0.5*(V.z/hv*(-0.8569) - V.x/hv*0.5155);                 // the small bay turns as we go round it: 0.5*sin(bearing - 2.6), so the fleet is in the ball at the close pass
    // level horizon across the middle; the town and the sails just above it; the top of the ball looks high into the clouds
    float kp = max(ky, 0.);
    float az = kx*0.95 + turn - 0.3 + uSlosh.x + uSlosh.y*ky*2., el = 0.03 + ky*0.3 + 0.6*kp*kp + uSlosh.y*kx*1.2;
    vec3 o = vec3(cos(el)*cos(az), sin(el), cos(el)*sin(az));
    vec3 lit = picture(P, aw)*picFall(P);            // the ray that reaches this glass, for the rim
    float f = 1. - abs(dot(N, V));
    float rim = smoothstep(0.72, 0.9, f);
    if (vKind > 0.5){
      vec3 img = harbour(o, gw)*(1. - smoothstep(0.86, 0.985, k));
      vec3 c = toScene(min(img*0.6, vec3(0.8)))*uTint.w + toScene(lit*0.6)*rim*1.5;
      gl_FragColor = vec4(c, 1.);
    } else {
      float line = smoothstep(0.55, 0.92, f);
      gl_FragColor = vec4(toScene(lit*0.75)*(0.45 + 1.5*line), 0.24 + 0.7*line);
    }
  }`;function Gt(s){return new e.ShaderMaterial({uniforms:s.uniforms,vertexShader:Nt,fragmentShader:Dt,transparent:!0,depthWrite:!0,side:e.DoubleSide,fog:!1})}async function Et(s,u={}){const t=s.rng,h=(u.palette||St).map(kt),d={umber:h[0],plum:h[1],slate:h[2],linen:h[3],cobalt:h[4],sea:h[5],tan:h[6]},o=Pt();o.uTint={value:new e.Vector4(.34,.8,.03,1.7)};const x=u.hour||(t()<.64?"morning":t.pick(["dawn","evening","night"])),L=d.tan.clone().lerp(new e.Color("#7A2E12"),.55),V={morning:{sky:d.cobalt,sea:d.sea,a:d.tan,b:L,pale:new e.Color(1,1,1),gain:1},dawn:{sky:new e.Color("#C9808C"),sea:new e.Color("#6F8088"),a:new e.Color("#3A2A2A"),b:new e.Color("#1E1618"),pale:new e.Color("#FFE3D2"),gain:.9},evening:{sky:new e.Color("#E3A24A"),sea:new e.Color("#5A4690"),a:new e.Color("#A8431A"),b:new e.Color("#6A2410"),pale:new e.Color("#FFE9C8"),gain:.95},night:{sky:new e.Color("#27407A"),sea:new e.Color("#2C5A6A"),a:new e.Color("#566A8A"),b:new e.Color("#2A3550"),pale:new e.Color("#C6D6F0"),gain:.6}}[x];o.uSky.value.copy(Xe(V.sky)),o.uSea.value.copy(Xe(V.sea)),o.uSailA.value.copy(Xe(V.a)),o.uSailB.value.copy(Xe(V.b)),o.uPale.value.copy(Xe(V.pale)),o.uNight.value=x==="night"?1:0;const O=t.range(.2,.45)*(t()<.5?-1:1),G=Ne;for(let g=0;g<G;g++)o.uLug.value[g].set(g%3===2?t.range(-1.3,1):t.range(-.8,.1),(g+t.range(-.3,.3))/G,O*t.range(.6,1.3),t()<.6?t.range(0,.35):t.range(.6,1));o.uLug.value[0].set(.5,-1,1,.08),o.uLug.value[1].set(-.5,-2,1,.72),o.uLug.value[2].set(-.85,-3,1,.3),o.uLane.value.set(1/27,o.uLug.value[3].y*7.3%1,6,o.uLug.value[3].y*7.3%1),o.uLugN.value=Math.max(6,Math.round(Ne*(u.density??1)));for(let g=0;g<De;g++)o.uGull.value[g].set(t.range(-1.2,.9),t.range(-.12,.42),t.range(.08,.3),t.range(0,60));o.uGullN.value=Math.max(8,Math.round(De*(u.density??1)));const W=[-1.15,-.18,9,.86,9];for(let g=0;g<We;g++)o.uMast.value[g].set(W[g]+t.range(-.12,.12)*(g===2?.5:1)*(g===1||g===3?.4:1),t.range(.5,1),t.range(.011,.018)*.42,t.range(0,6.28));o.uSteam.value.set(t.range(-.6,1.2),t.range(.006,.011)*(t()<.5?-1:1),1,1),o.uFold.value.set(t.range(0,6.28),t.range(0,6.28),t.range(0,6.28),t.range(.85,1.1)),o.uWind.value.set(-3/72*.46*t.range(.85,1.15),t.range(-.006,.006),t.range(.8,1.2),1/t.range(40,50));const I=t.range(21,29),P=t.range(6,12);await s.yield();const D=256,Z=new Uint8Array(D*D*4);for(let g=0;g<2;g++){const R=new Float32Array(D*D);let T=.5,U=0;for(let Y=0,N=g?6:4;Y<5;Y++,N*=2,T*=.52){const E=new Float32Array(N*N);for(let Q=0;Q<E.length;Q++)E[Q]=t();const oe=N/D;U+=T;for(let Q=0;Q<D;Q++){const we=Q*oe,ve=Math.floor(we),Be=we-ve,re=Be*Be*(3-2*Be),ce=ve%N*N,he=(ve+1)%N*N;for(let ee=0;ee<D;ee++){const ue=ee*oe,ne=Math.floor(ue),me=ue-ne,Ae=me*me*(3-2*me),Ce=ne%N,Re=(ne+1)%N;R[Q*D+ee]+=T*$($(E[ce+Ce],E[ce+Re],Ae),$(E[he+Ce],E[he+Re],Ae),re)}}await s.yield()}for(let Y=0;Y<D*D;Y++)Z[Y*4+g]=be(((R[Y]/U-.5)*1.9+.5)*255,0,255)}const f=new e.DataTexture(Z,D,D,e.RGBAFormat,e.UnsignedByteType);f.wrapS=f.wrapT=e.RepeatWrapping,f.minFilter=e.LinearMipmapLinearFilter,f.magFilter=e.LinearFilter,f.generateMipmaps=!0,f.needsUpdate=!0,o.tCloud.value=f,await s.yield(),o.tTown.value=await Kt(s),await s.yield();const r={box:0,cap:0,ell:0},C={uniforms:o,pal:d,hour:x,setExposure(g){o.uExpK.value=.6/Math.max(g,.05)},setNearSail(g){o.uNear.value=be(g,0,1)},addBox(g,R){return r.box>=Ge?!1:(o.uBoxA.value[r.box].copy(g),o.uBoxB.value[r.box++].copy(R),!0)},addCapsule(g,R,T){return r.cap>=Ee?!1:(o.uCapA.value[r.cap].set(g.x,g.y,g.z,T),o.uCapB.value[r.cap++].copy(R),!0)},addEllipsoid(g,R){return r.ell>=ke?!1:(o.uEllC.value[r.ell].copy(g),o.uEllR.value[r.ell++].copy(R),!0)},update(g,R){o.uTime.value=R;const T=((R+P)%I+I)%I,U=se(0,2.2,T)*(1-se(5.5,7.7,T));o.uGain.value=V.gain*(1-.3*U),o.uCool.value=U*.6,o.uSlosh.value.set(.07*Math.sin(R*1.25)+.03*Math.sin(R*2.1+1),.035*Math.sin(R*1.25+1.3))},dispose(){f.dispose(),o.tTown.value.dispose()}};return C.setExposure(u.exposure??1),C}async function Kt(s){const u=s.rng,t=2,h=2048*t,d=128*t,o=12*t,x=new Uint8Array(h*d*4),L=[u.range(0,6.28),u.range(0,6.28),u.range(0,6.28),u.range(0,6.28)],V=new Float32Array(h),O=f=>Math.abs((f%2+2)%2-1);for(let f=0;f<h;f++){const r=(f/h-.5)*3.2,C=f/t,g=se(-.75,-.2,r)*(1-se(.45,.9,r)),R=1-se(-.9,-.35,r);let T=30+16*Math.sin(r*2.1+L[0])+9*Math.sin(r*5.3+L[1])+4*Math.sin(r*13+L[2]);T=T*(.55+.5*R)+62*g*(.75+.25*Math.sin(r*3.1+L[3])),T*=1-se(.7,.95,r)*.94,r>.95&&(T=r<1.36&&Math.abs(r-1.12)>.03?6:0);const U=O(C*.19+Math.sin(C*.05)*2),Y=O(C*.071+.4),N=O(C*.43+Math.sin(C*.11)),E=R*(1-g)*(U*U*10+Y*(.4+.6*Y)*6+N*2.5);V[f]=Math.min(d-o-2*t,Math.max(0,(T+E)*t));for(let oe=o;oe<o+V[f];oe++){const Q=(oe*h+f)*4;x[Q+3]=255,r>.95&&(x[Q]=120)}f%512===511&&await s.yield()}await s.yield();const G=(f,r,C,g,R,T,U)=>{for(let Y=Math.max(0,r);Y<Math.min(d,r+g);Y++)for(let N=Math.max(0,f);N<Math.min(h,f+C);N++){const E=(Y*h+N)*4;x[E]=R,x[E+1]=T,x[E+2]=U,x[E+3]=255}},W=(f,r,C)=>{if(!(C<0||C>=d))for(let g=Math.max(0,Math.floor(f));g<Math.min(h,Math.ceil(r));g++){const R=be(Math.min(g+1,r)-Math.max(g,f),0,1),T=(C*h+g)*4;x[T]=x[T]*(1-R),x[T+1]=Math.max(x[T+1],235*R),x[T+2]=x[T+2]*(1-R),x[T+3]=Math.max(x[T+3],255*R)}},I=[];for(let f=0;f<190;f++){const r=u.range(-.62,.78),C=Math.round((r/3.2+.5)*h),g=V[be(C,0,h-1)]/t,R=u()**1.4;I.push({x:C,y:o+t+Math.round(R*Math.max(0,g-22)*t),w:u.int(11,26)*t,h:u.int(7,15)*t,ochre:u()<.32,tall:u()<.04})}I.sort((f,r)=>r.y-f.y);let P=0;for(const f of I){const r=f.tall?f.h+16*t:f.h,C=f.tall?8*t:f.w,g=215+f.x*7%40;G(f.x,f.y,C,r,f.ochre?40:g,0,f.ochre?235:0);const R=f.tall?9*t:(3+(f.w>>4))*t;for(let T=0;T<R;T++){const U=f.tall?T*.45:Math.min(T*1.5,(C+4)/2-.75);W(f.x-2+U,f.x+C+2-U,f.y+r+T)}f.tall||G(f.x+(C>>1)-2,f.y,4,6,20,60,0),++P%40===0&&await s.yield()}G(Math.round((-.62/3.2+.5)*h),o,Math.round(1.4/3.2*h),3*t,150,0,60);const D=Math.round((1.36/3.2+.5)*h);G(D,o+6*t,7*t,24*t,250,0,0),G(D-t,o+30*t,9*t,4*t,0,240,0),await s.yield();const Z=new e.DataTexture(x,h,d,e.RGBAFormat,e.UnsignedByteType);return Z.wrapS=Z.wrapT=e.ClampToEdgeWrapping,Z.minFilter=e.LinearMipmapLinearFilter,Z.magFilter=e.LinearFilter,Z.generateMipmaps=!0,Z.needsUpdate=!0,Z}function It(s,u,t){const h=s.uniforms.uFold.value,d=s.uniforms.uBed.value,o=u+3.5*Math.sin(t*.047+h.x)+1.8*Math.sin(t*.118+u*.021+h.y),x=.5+.5*Math.sin(o*.5+.5*Math.sin(o*.083+h.z)),L=.88+.12*Math.sin(t*.06+u*.033+h.x*1.7),V=2.1*x*x*Math.sqrt(x)*L+.03*Math.sin(o*1.3+t*.31+h.y*2)+.02*Math.sin(t*.6-o*.5+h.z*3),O=Math.min(Math.min(u-d.x,d.y-u),Math.min(t-d.z,d.w-t));return 43.4+h.w*V*(.3+.7*se(0,7,O))}function F(s,u,t=0,h=0){let d=s.index?s.toNonIndexed():s;d.attributes.normal||d.computeVertexNormals();const o=d.attributes.position.count,x=d.attributes.position,L=new Float32Array(o*3),V=new Float32Array(o),O=new Float32Array(o);for(let G=0;G<o;G++)L[G*3]=u.r,L[G*3+1]=u.g,L[G*3+2]=u.b,V[G]=t,O[G]=typeof h=="function"?h(x.getX(G),x.getY(G),x.getZ(G)):h;d.setAttribute("aCol",new e.BufferAttribute(L,3)),d.setAttribute("aKind",new e.BufferAttribute(V,1)),d.setAttribute("aSway",new e.BufferAttribute(O,1));for(const G of Object.keys(d.attributes))["position","normal","aCol","aKind","aSway"].includes(G)||d.deleteAttribute(G);return d}const _=(s,u,t,h)=>s.translate(u,t,h),qe=(s,u=14)=>new e.LatheGeometry(s.map(([t,h])=>new e.Vector2(Math.max(t,.001),h)),u);function Me(s,u,t,h=8){const d=new e.Vector3().subVectors(u,s),o=d.length(),x=new e.CylinderGeometry(t,t,o,h,1,!1);return x.applyQuaternion(new e.Quaternion().setFromUnitVectors(new e.Vector3(0,1,0),d.normalize())),x.translate((s.x+u.x)/2,(s.y+u.y)/2,(s.z+u.z)/2)}const n=(s,u,t)=>new e.Vector3(s,u,t);async function Jt(s,u={}){const t=s.rng,h=be(u.detail??s.quality?.detail??1,.6,1),d=u.style||await Et(s,u),o=d.pal,x=d.uniforms,L=new e.Group;L.name="room-is-a-camera-hero";const V=Vt(d),O=Lt(d),G=Gt(d),W=-86,I=20,P=-50,D=20;x.uBed.value.set(W,I,P,D);const Z=(a,l)=>It(d,a,l),f=[],r=[],C=[];{const a=Math.round(208*h),l=Math.round(132*h),c=(a+1)*(l+1),y=new Float32Array(c*3),A=new Float32Array(c*3),M=new Float32Array(c*3),z=new Float32Array(c).fill(1),k=new Float32Array(c);for(let w=0,p=0;w<=l;w++){const S=$(P,D,w/l);for(let b=0;b<=a;b++,p++){const B=$(W,I,b/a);y[p*3]=B,y[p*3+1]=Z(B,S),y[p*3+2]=S,A[p*3+1]=1,M[p*3]=o.linen.r,M[p*3+1]=o.linen.g,M[p*3+2]=o.linen.b}w%10===0&&await s.yield()}await s.yield();const i=new Uint32Array(a*l*6);for(let w=0,p=0;w<l;w++)for(let S=0;S<a;S++){const b=w*(a+1)+S,B=b+1,H=b+a+1,X=H+1;i[p++]=b,i[p++]=H,i[p++]=B,i[p++]=B,i[p++]=H,i[p++]=X}const m=new e.BufferGeometry;m.setAttribute("position",new e.BufferAttribute(y,3)),m.setAttribute("normal",new e.BufferAttribute(A,3)),m.setAttribute("aCol",new e.BufferAttribute(M,3)),m.setAttribute("aKind",new e.BufferAttribute(z,1)),m.setAttribute("aSway",new e.BufferAttribute(k,1)),m.setIndex(new e.BufferAttribute(i,1));const q=new e.Mesh(m,V);q.name="counterpane",L.add(q)}await s.yield();{const a=[],l=.62/h,c=2;for(let v=W;v<I-c;v+=l)a.push([v,D,0,1,25]);for(let v=0;v<=7;v++){const K=(1-v/7)*Math.PI/2;a.push([I-c+Math.cos(K)*c,D-c+Math.sin(K)*c,Math.cos(K),Math.sin(K),$(25,10,se(0,1,v/7))])}for(let v=D-c-l;v>P+c;v-=l)a.push([I,v,1,0,10]);for(let v=0;v<=7;v++){const K=-(v/7)*Math.PI/2;a.push([I-c+Math.cos(K)*c,P+c+Math.sin(K)*c,Math.cos(K),Math.sin(K),$(10,25,se(0,1,v/7))])}for(let v=I-c-l;v>=W;v-=l)a.push([v,P,0,-1,25]);const y=[0,.1,.2,.3,.4,.5,.6,.7,.8,.9,.955,1],A=y.length-1,M=a.length,z=new Float32Array(M*(A+1)*3),k=new Float32Array(M*(A+1)),i=t.range(0,6.28),m=t.range(0,6.28);let q=0;for(let v=0;v<M;v++){const[K,te,J,ie,fe]=a[v];v&&(q+=Math.hypot(K-a[v-1][0],te-a[v-1][1]));const pe=Math.sin(q*.47+2.1*Math.sin(q*.11+i))*.75+Math.sin(q*1.21+m)*.25,Ve=Z(K-J*.5,te-ie*.5)-.12,Ze=fe+.7*Math.sin(q*.29+m)+.4*pe;for(let ze=0;ze<=A;ze++){const Pe=y[ze],dt=(ze===A-1?.12:0)-.5+1.5*(1-(1-Pe)**4)+Pe*(.5+.6*pe)*se(.05,.5,Pe),$e=(v*(A+1)+ze)*3;z[$e]=K+J*dt,z[$e+1]=Ve-(Ve-Ze)*Pe**1.55,z[$e+2]=te+ie*dt,k[$e/3]=Pe}}await s.yield();const w=[];for(let v=0;v<M-1;v++)for(let K=0;K<A;K++){const te=v*(A+1)+K,J=te+1,ie=te+A+1,fe=ie+1;w.push(te,J,ie,J,fe,ie)}const p=new e.BufferGeometry;p.setAttribute("position",new e.BufferAttribute(z,3)),p.setAttribute("aT",new e.BufferAttribute(k,1)),p.setIndex(w),p.computeVertexNormals(),await s.yield();const S=p.toNonIndexed(),b=S.attributes.aT;await s.yield();const B=F(S,o.linen,0,0),H=B.attributes.aCol,X=o.linen.clone().multiplyScalar(.66);await s.yield();for(let v=0;v<b.count;v+=3)if(Math.min(b.getX(v),b.getX(v+1),b.getX(v+2))>.95)for(let K=0;K<3;K++)H.setXYZ(v+K,X.r,X.g,X.b);await s.yield(),f.push(B)}await s.yield();const g=[[-75.5,50.6,-31.5,.07],[-76.2,51,3.5,-.05]];for(const[a,l,c,y]of g){const A=new e.SphereGeometry(1,30,20),M=A.attributes.position,z=-.5+t.range(-.05,.05),k=t.range(0,6.28),i=9.6,m=4.4,q=15.5*t.range(.95,1.04),w=Math.cos(z),p=Math.sin(z),S=Math.cos(y),b=Math.sin(y);for(let B=0;B<M.count;B++){let H=M.getX(B),X=M.getY(B),v=M.getZ(B);const K=Math.sign(H)*Math.abs(H)**.5,te=Math.sign(v)*Math.abs(v)**.5,J=Math.max(Math.abs(K),Math.abs(te))**5,ie=1+.1*(Math.abs(K)*Math.abs(te))**3,fe=(1-.62*J)*(1+.1*Math.sin(te*5.5+k)*Math.sin(K*4+k*1.7));H=K*i*ie,v=te*q*ie,X=Math.sign(X)*Math.abs(X)**.85*m*fe+.5*(1-J)*Math.sin(te*2.2+k);const pe=H*w-X*p,Ve=H*p+X*w;M.setXYZ(B,a+pe*S+v*b,l+Ve,c-pe*b+v*S)}A.computeVertexNormals(),f.push(F(A,o.linen,0,0)),d.addEllipsoid(n(a,l,c),n(7.6,4.6,12.6))}await s.yield();const R=o.slate.clone().multiplyScalar(.6),T=o.umber,U=o.tan.clone().lerp(o.umber,.35),Y=a=>[[1.7,0],[1.7,1],[1,2.2],[.95,27.5],[1.35,28.3],[1.35,33.2],[.95,34],[.9,a-8],[1.3,a-7.5],[1.3,a-6.6],[.85,a-6],[.75,a-4.8],[1.5,a-4],[2.05,a-2.6],[1.7,a-1.1],[.6,a-.15],[0,a]],N=23.6,E=-88.4,oe=P-3,Q=D+3,we=62.5,ve=77;for(const[a,l]of[[N,we+7.5],[E,ve+7.5]])for(const c of[oe,Q])r.push(F(_(qe(Y(l),12),a,0,c),R,4)),d.addCapsule(n(a,2,c),n(a,l-2.4,c),.55);r.push(F(Me(n(N,we,oe),n(N,we,Q),.62,10),R,4),F(Me(n(N,30.8,oe),n(N,30.8,Q),.62,10),R,4)),r.push(F(Me(n(E,ve,oe),n(E,ve,Q),.62,10),R,4),F(Me(n(E,30.8,oe),n(E,30.8,Q),.62,10),R,4),F(Me(n(E,62,oe),n(E,62,Q),.5,8),R,4)),d.addCapsule(n(N,we,oe),n(N,we,Q),.45),d.addCapsule(n(E,ve,oe),n(E,ve,Q),.6),await s.yield();const Be=6;for(let a=0;a<Be;a++){const l=$(oe,Q,(a+1)/(Be+1))+t.range(-.4,.4);r.push(F(_(qe([[.42,30.8],[.42,44],[.8,45],[.95,46.2],[.8,47.4],[.42,48.4],[.42,we]],8),N,0,l),R,4)),d.addCapsule(n(N,30.8,l),n(N,we,l),.3)}for(let a=0;a<9;a++){const l=$(oe,Q,(a+1)/10);r.push(F(Me(n(E,30.8,l),n(E,ve,l),.4,6),R,4))}await s.yield();for(const a of[P+1.6,D-1.6])r.push(F(_(new e.BoxGeometry(N-E,2.6,1),(N+E)/2,29.6,a),R,4));for(let a=0;a<17;a++)r.push(F(_(new e.BoxGeometry(3.6,.7,D-P-2),$(W+4,I-4,a/16),30.9,(P+D)/2),T,5));r.push(F(_(new e.BoxGeometry(I-W-1,.6,D-P-1),(W+I)/2,31.9,(P+D)/2),o.linen.clone().multiplyScalar(.5),0)),d.addBox(n(W+.5,25.6,P+.5),n(I-.5,42.9,D-.5)),d.addBox(n(I-.6,10.8,P+.6),n(I+.3,42.9,D-.6)),await s.yield();const re=-75,ce=-20,he=-110,ee=-77,ue=45;{const a=new e.Shape,l=1.2,c=ce-re,y=ee-he;a.moveTo(l,0),a.lineTo(c-l,0),a.quadraticCurveTo(c,0,c,l),a.lineTo(c,y),a.lineTo(0,y),a.lineTo(0,l),a.quadraticCurveTo(0,0,l,0);const A=new e.ExtrudeGeometry(a,{depth:1.5,bevelEnabled:!0,bevelThickness:.45,bevelSize:.45,bevelSegments:3,curveSegments:5});A.rotateX(-Math.PI/2),A.translate(re,ue-1.95,ee-.45),r.push(F(A,new e.Color("#9a9da2"),3)),r.push(F(_(new e.BoxGeometry(ce-re,9,1.4),(re+ce)/2,ue+4.5,he+.7),new e.Color("#9a9da2"),3)),r.push(F(_(new e.BoxGeometry(ce-re-3,9.4,ee-he-3),(re+ce)/2,37.9,(he+ee)/2),T,5));const M=T.clone().multiplyScalar(1.25),z=ee-1.15,k=o.slate.clone().multiplyScalar(.3);for(const m of[-59.5,-35.5]){r.push(F(_(new e.BoxGeometry(21,6,.5),m,37.9,ee-1.4),M,5));for(const B of[-2.55,2.55])r.push(F(_(new e.BoxGeometry(21,.9,.45),m,37.9+B,z+.2),M,5));for(const B of[-9.95,9.95])r.push(F(_(new e.BoxGeometry(1.1,4.2,.45),m+B,37.9,z+.2),M,5));const q=z+.3,w=T.clone().multiplyScalar(1.7),p=8.7,S=1.7;for(const[B,H,X,v]of[[-p,-S,p,-S],[-p,S,p,S],[-p,-S,-p,S],[p,-S,p,S]])r.push(F(Me(n(m+B,37.9+H,q),n(m+X,37.9+v,q),.17,6),w,5));r.push(F(_(new e.BoxGeometry(15.6,2.4,.3),m,37.9,z+.12),M,5)),r.push(F(_(qe([[.35,0],[.35,.5],[.9,.9],[1,1.4],[.6,1.9],[0,2]],14).rotateX(Math.PI/2),m,37.5,z+.25),U,0));const b=new e.CylinderGeometry(.62,.62,.12,18).rotateX(Math.PI/2);b.scale(.75,1.25,1),r.push(F(_(b,m,39.95,z+.47),U,0)),r.push(F(_(new e.CylinderGeometry(.2,.2,.1,10).rotateX(Math.PI/2),m,40.12,z+.56),k,4),F(_(new e.BoxGeometry(.2,.5,.1),m,39.78,z+.56),k,4))}const i=[[1.4,0],[2,.9],[1.3,2.2],[1.7,6],[2.3,8.6],[1.5,11.5],[1.25,20],[1.9,24],[2.3,26.5],[1.6,28],[2.4,29],[2.4,33.4]];for(const m of[re+3.4,ce-3.4])for(const q of[he+3.6,ee-3.6])r.push(F(_(qe(i,12),m,0,q),T,5));r.push(F(_(new e.BoxGeometry(ce-re-6,1.3,ee-he-6),(re+ce)/2,9.6,(he+ee)/2),T,5)),d.addBox(n(re+.1,42.6,he+.2),n(ce-.1,ue-.15,ee-.02)),d.addBox(n(re+1.8,33.4,he+.2),n(ce-1.8,42.6,ee-1.8))}const ne=42.2,me=ee+1.7,Ae=-43,Ce=-22.5;r.push(F(Me(n(Ae,ne,me),n(Ce,ne,me),.42,10),U,0));for(const a of[Ae+.8,Ce-.8])r.push(F(Me(n(a,ne,me),n(a,ne-.6,ee-1.5),.3,8),U,0));for(const a of[Ae,Ce])r.push(F(_(new e.SphereGeometry(.75,10,8),a,ne,me),U,0));{const c=[],y=[],z=t.range(0,6.28);for(let m=0;m<=44;m++){const q=m/44,w=be((q-.36)/.1,0,1),p=w*Math.PI,S=q<.36?$(31,ne,q/.36):q>.46?$(ne,24.5,(q-.46)/.54):ne+.62*Math.sin(p),b=me+(q<.36?-.62:q>.46?.62:-.62*Math.cos(p));for(let B=0;B<=14;B++){const H=B/14,X=Math.max(0,ne-S)/15;c.push($(-39.5,-28.5,H)+.25*X*Math.sin(H*5+z),S+(q>.46?.5*X*Math.sin(H*3.1+z):0),b+(q>.46?1:-1)*X*(.25+.45*(.5+.5*Math.sin(H*9.4+z))))}}for(let m=0;m<44;m++)for(let q=0;q<14;q++){const w=m*15+q,p=w+1,S=w+14+1,b=S+1;y.push(w,S,p,p,S,b)}const k=new e.BufferGeometry;k.setAttribute("position",new e.Float32BufferAttribute(c,3)),k.setIndex(y),k.computeVertexNormals();const i=F(k,o.linen,0,(m,q)=>.22*be((ne-1-q)/14,0,1));{const m=i.attributes.position,q=i.attributes.aCol,w=o.slate.clone().multiplyScalar(.7);for(let p=0;p<m.count;p++){const S=m.getY(p),b=m.getZ(p)>me,B=b?S-24.5:S-31;(B>1&&B<1.75||B>2.2&&B<2.5||b&&B>3.3&&B<3.5)&&q.setXYZ(p,w.r,w.g,w.b)}}f.push(i),await s.yield();{const m=[];for(const[p,S]of[[44,1],[0,-1]])for(let b=0;b<46;b++){const B=b/46,H=(b+.62)/46,X=(b+.31)/46,v=p*15*3,K=c[v+1]+.05,te=c[v+2+Math.round(X*14)*3];m.push($(-39.5,-28.5,B),K,te,$(-39.5,-28.5,H),K,te,$(-39.5,-28.5,X)+.05*Math.sin(b*2.1),K-.72-.08*Math.sin(b*1.7),te+S*.12)}const w=new e.BufferGeometry;w.setAttribute("position",new e.Float32BufferAttribute(m,3)),w.computeVertexNormals(),f.push(F(w,o.linen,0,(p,S)=>.22*be((ne-1-S)/14,0,1)))}}await s.yield();const Re=o.linen,ae=n(-63,ue,-94),st=(a,l,c,y)=>{const A=new e.SplineCurve(a.map(([z,k])=>new e.Vector2(z,k))).getPoints(c).map(z=>new e.Vector2(Math.max(z.x,.001),z.y)),M=new e.LatheGeometry(A,l);if(y){const z=M.attributes.position;for(let k=0;k<z.count;k++)y(z,k)}return M};await s.yield(),r.push(F(_(st([[.01,.3],[3,.3],[3.5,0],[4.1,0],[4.4,.6],[7.5,3.1],[9.4,4.5],[10.1,4.85],[10.35,5.25],[10.1,5.6],[9.6,5.45],[9.1,4.95],[7.2,3.7],[4,1.3],[.01,1.05]],56,60),ae.x,ae.y,ae.z),Re,6)),await s.yield();{const a=st([[.01,0],[2.6,0],[3.05,.4],[2.7,1.2],[4.2,3.5],[5.2,6.5],[5,9.5],[3.6,12],[2.6,13.6],[2.5,14.6],[3.3,16],[3.85,17],[3.6,17.15],[2.95,16.2],[2.2,14.8],[.01,14.6]],56,72,(c,y)=>{const A=c.getX(y),M=c.getY(y),z=c.getZ(y),k=Math.hypot(A,z);if(M>14.2&&k>.3){const i=.5+.5*A/k,m=se(14.2,17.1,M)*i*i*i*i;c.setX(y,A+2.6*m),c.setY(y,M+1.1*m)}});r.push(F(_(a,ae.x,ae.y+1,ae.z),Re,6));const l=new e.TorusGeometry(3.4,.48,12,36,Math.PI*1.1);l.rotateZ(Math.PI*.42),l.scale(.8,1.2,1),r.push(F(_(l,ae.x-4.6,ae.y+10.5,ae.z),Re,6)),d.addEllipsoid(n(ae.x,ae.y+8,ae.z),n(4.6,8,4.6)),d.addEllipsoid(n(ae.x,ae.y+2.6,ae.z),n(9,2.4,9))}await s.yield();const j=n(-36,ue,-84),de=1.3,Fe=4.5*de,Ke=4.7*de;x.uLens.value.set(j.x,j.y+Ke,j.z,Fe);const Ie=(a,l)=>{const c=a.attributes.position.count;return a.setAttribute("aKind",new e.BufferAttribute(new Float32Array(c).fill(l),1)),a.deleteAttribute("uv"),a.index?a.toNonIndexed():a};{const a=[[.01,.02],[2.6,.02]],l=[];for(let c=0;c<=28;c++){const y=$(-.95,.98,c/28);a.push([Fe*Math.cos(y),Ke+Fe*Math.sin(y)])}l.push(a[a.length-1],...[[1.6,9.3],[1.3,10.6],[1.22,13.4],[1.5,14.5],[1.75,14.9],[1.55,15],[1.3,14.4]].map(([c,y])=>[c*de,y*de])),C.push(Ie(_(qe(a,56),j.x,j.y,j.z),1),Ie(_(qe(l,32),j.x,j.y,j.z),0)),C.push(Ie(_(qe([[2.45,10],[2.55,10.2],[2.4,16.4],[2,17.5],[.01,17.75]].map(([c,y])=>[c*de,y*de]),32),j.x,j.y,j.z),0)),d.addEllipsoid(n(j.x,j.y+Ke,j.z),n(Fe*.96,Fe*.96,Fe*.96)),d.addCapsule(n(j.x,j.y+10.5*de,j.z),n(j.x,j.y+16*de,j.z),2.2*de)}await s.yield();const nt=[];for(let a=0;a<11;a++){const l=$(-69,-26,(a+t.range(-.3,.3))/10),c=t.range(.6,1.25),y=ee-.9-c-t.range(0,1.1),A=new e.SphereGeometry(c,16,8,0,Math.PI*2,0,Math.PI/2);A.scale(1,.62,1+t.range(0,.25)),C.push(Ie(_(A,l,ue,y),1)),nt.push(n(l,ue+c*.3,y))}await s.yield();const xe=n(-48,ue,-97);C.push(Ie(_(qe([[.01,.05],[1.7,.05],[1.9,.5],[1.9,3.6],[1.35,4.5],[1.5,5.1]],18),xe.x,xe.y,xe.z),0));for(let a=0;a<3;a++){const l=t.range(0,6.28),c=t.range(2.5,5.5),y=t.range(15,20),A=[];for(let k=0;k<=5;k++){const i=k/5;A.push(n(xe.x+Math.cos(l)*c*i*i,xe.y+.4+y*i,xe.z+Math.sin(l)*c*i*i+.6*Math.sin(i*5+a)))}const M=new e.CatmullRomCurve3(A);r.push(F(new e.TubeGeometry(M,12,.13,5,!1),o.linen.clone().lerp(o.umber,.55),0));const z=Math.round(8*h);for(let k=0;k<z;k++){const i=.42+.58*(k+t())/z,m=M.getPoint(i),q=t.range(0,6.28),w=t.range(1.3,2.1),p=t.range(.85,1.3),S=n(m.x+Math.cos(q)*w,m.y+t.range(.2,1.1),m.z+Math.sin(q)*w),b=t.range(0,3.14),B=t.range(-.5,.5),H=.07+.05*t(),X=new e.CircleGeometry(p*.9,16);X.scale(1,1.25,1),X.rotateY(b),X.rotateX(B),f.push(F(_(X,S.x,S.y,S.z),o.linen,2,H));const v=new e.RingGeometry(p*.9,p,16);v.scale(1,1.25,1),v.rotateY(b),v.rotateX(B),f.push(F(_(v,S.x,S.y,S.z),o.linen.clone().lerp(o.tan,.35).multiplyScalar(.45),2,H)),r.push(F(Me(m,S,.07,4),o.linen.clone().lerp(o.umber,.55),0))}await s.yield()}if(await s.yield(),u.stage!==!1){const M=new e.PlaneGeometry(215,235,1,1);M.rotateX(-Math.PI/2),r.push(F(_(M,35/2,0,15/2),o.umber,1));const z=new e.PlaneGeometry(215,145);r.push(F(_(z,35/2,145/2,-110),o.plum,2));const k=new e.PlaneGeometry(235,145);k.rotateY(Math.PI/2),r.push(F(_(k,-90,145/2,15/2),o.plum,2));const i=o.linen.clone().multiplyScalar(.7);for(const[m,q,w]of[[2.5,5,.9],[5.3,.6,1.3],[112,1.6,.9]])r.push(F(_(new e.BoxGeometry(215,q,w),35/2,m,-110+w/2),i,0)),r.push(F(_(new e.BoxGeometry(w,q,235),-90+w/2,m,15/2),i,0))}await s.yield();const lt=new e.Mesh(He(f,!1),V);lt.name="linen",L.add(lt),await s.yield();const it=new e.Mesh(He(r,!1),O);it.name="matte",L.add(it),await s.yield();const Ue=new e.Mesh(He(C,!1),G);Ue.name="glass",Ue.renderOrder=2,L.add(Ue);for(const a of[...f,...r,...C])a.dispose();const Ye=new e.SphereGeometry(.8,16,12);Ye.setAttribute("aKind",new e.BufferAttribute(new Float32Array(Ye.attributes.position.count).fill(1),1));const Le=new e.Mesh(Ye,G);Le.renderOrder=2,L.add(Le);const Te=n(Ae+3.2,ne-.5,me);await s.yield();const Se=new e.Group,Qe=new e.Group,Je=new e.Group,et=[],tt=[];Se.rotation.order="YXZ";{const a=(i,m,q,w,p,S,b)=>{const B=[],H=[],X=[],v=[];for(let J=0;J<=p;J++){const ie=J/p,fe=$(m,q,ie),pe=w(ie);v.push([i[0]+Math.cos(fe)*pe,i[1]+Math.sin(fe)*pe])}for(let J=0;J<p;J++){const ie=J/p,fe=(J+1)/p,pe=(ie+fe)/2,Ve=b>0?[[i,pe,0],[v[J+1],fe,1],[v[J],ie,1]]:[[i,pe,0],[v[J],ie,1],[v[J+1],fe,1]];for(const[Ze,ze,Pe]of Ve)B.push(Ze[0]*b,.02*S,-Ze[1]),H.push(0,1,0),X.push(ze,Pe,S)}const K=new e.BufferGeometry,te=B.length/3;return K.setAttribute("position",new e.Float32BufferAttribute(B,3)),K.setAttribute("normal",new e.Float32BufferAttribute(H,3)),K.setAttribute("aCol",new e.Float32BufferAttribute(X,3)),K.setAttribute("aKind",new e.Float32BufferAttribute(new Float32Array(te).fill(3),1)),K.setAttribute("aSway",new e.Float32BufferAttribute(new Float32Array(te),1)),K},l=i=>(2.45-1.2*Math.pow(i,1.25))*(.9+.1*se(0,.07,i))*(1+.03*Math.cos(i*44)*se(.08,.2,i)),c=i=>(1.6-.3*i+.16*Math.sin(i*Math.PI))*(1+.04*Math.cos(i*31)*se(.05,.2,i)),y=(i,m)=>He([a([.16,.14],.3,-1.02,l,40,m,i),a([.14,-.22],-.5,-1.72,c,32,m+1,i)],!1);await s.yield();for(const[i,m,q]of[[Qe,-1,et],[Je,1,tt]]){i.add(new e.Mesh(y(m,0),V));for(let w=0;w<2;w++){const p=new e.Mesh(y(m,4),V);q.push(p),Se.add(p)}}const A=[new e.SphereGeometry(1,12,9).scale(.3,.27,.55).translate(0,0,-.35),new e.SphereGeometry(1,12,9).scale(.24,.22,.85).translate(0,-.03,.75),new e.SphereGeometry(.19,10,8).translate(0,.02,-.98)];for(const i of[-1,1])A.push(new e.TubeGeometry(new e.CatmullRomCurve3([n(.08*i,.08,-1.05),n(.35*i,.3,-1.7),n(.8*i,.42,-2.3),n(1.15*i,.36,-2.75)]),10,.055,5,!1));const M=He(A.map(i=>i.toNonIndexed()),!1),z=M.attributes.position.count,k=new Float32Array(z*3);for(let i=0;i<z;i++)k[i*3]=M.attributes.position.getZ(i),k[i*3+1]=.5,k[i*3+2]=2;for(const i of Object.keys(M.attributes))i!=="position"&&i!=="normal"&&M.deleteAttribute(i);M.setAttribute("aCol",new e.BufferAttribute(k,3)),M.setAttribute("aKind",new e.BufferAttribute(new Float32Array(z).fill(3),1)),M.setAttribute("aSway",new e.BufferAttribute(new Float32Array(z),1)),Se.add(Qe,Je,new e.Mesh(M,V)),Se.scale.setScalar(2.1),L.add(Se)}await s.yield();const at=_t(d,t,{count:Math.round(5200*h),min:n(-90,30,-110),max:n(125,100,40)});L.add(at);const je=[];for(let a=0;a<Math.round(44*h);a++){const l=t();if(l<.5){const c=t.range(W+3,I-3),y=t.range(P+3,D-3);je.push(n(c,Z(c,y)+1.5,y))}else l<.72?je.push(n(-89.5,t.range(48,100),t.range(-105,20))):l<.88?je.push(n(t.range(-70,-22),t.range(46,95),-109.5)):je.push(n(t.range(30,100),.5,t.range(-100,60)))}const rt=Ot(d,t,je);L.add(rt),await s.yield();const ct=ke-1;let ot=-1;const[xt,gt]=u.mothLift??[.462,.49],yt=()=>({carafe:n(j.x,j.y+Ke,j.z),neckTop:n(j.x,j.y+15*de,j.z),tumblerR:2.55*de,honesty:xe.clone(),honestyR:9.5,honestyTop:ue+23.1}),bt=()=>{let a=-32;{let c=-1e9;for(let y=-36;y<=-27;y+=.5){const A=Z(y-.6,-32)-Z(y+.6,-32);A>c&&(c=A,a=y)}}const l=n(a,Z(a,-32)+.5,-32);return[[.3,l.x,l.y,l.z],[.462,l.x,l.y,l.z],[.485,l.x-.5,l.y+2.4,l.z-2],[.5,-35,49.5,-37],[.52,-37.5,52.5,-44],[.545,-40,55.5,-54],[.57,-39.5,58.3,-62],[.6,-38.5,58.3,-69],[.63,-30.4,58.3,-75.7],[.66,-16,59.5,-81],[.7,-6,66,-90],[.76,10,84,-80],[.84,40,106,-62],[.92,60,122,-50],[1.2,70,130,-40]]},ge=u.mothKeys?u.mothKeys(yt()):bt(),ht=(a,l)=>{let c=1;for(;c<ge.length-2&&a>ge[c+1][0];)c++;const y=ge[c],A=ge[c+1],M=ge[c-1],z=ge[Math.min(c+2,ge.length-1)],k=be((a-y[0])/(A[0]-y[0]),0,1),i=k*k,m=i*k,q=w=>.5*(2*y[w]+(-M[w]+A[w])*k+(2*M[w]-5*y[w]+4*A[w]-z[w])*i+(-M[w]+3*y[w]-3*A[w]+z[w])*m);return l.set(q(1),q(2),q(3))},Mt={hole:_e.clone(),portalSeat:{position:_e.clone(),facing:n(-1,0,0),radius:7},flyThrough:[n(0,15,0),n(0,21,62),n(-24,37,98),n(-47,55,22),n(-43,55,-66),n(-36,56,-83),n(0,60,-69),n(58,72,-60),n(125,72,-60)],viewpoints:{overLinen:{from:n(-45,55,12),to:n(-47,50,-91)},carafe:{from:n(-37,56,-79),to:n(-47,50,-91)},underBed:{from:n(0,15,0),to:n(0,20,60)}},carafe:n(j.x,j.y+Ke,j.z),carafeTop:n(j.x,j.y+17.75*de,j.z),drops:nt,ewer:n(ae.x,ae.y+9,ae.z),honesty:n(xe.x,xe.y+12,xe.z),bed:{min:n(W,25,P),max:n(I,47.6,D),pillowTop:60,footRailX:N,headRailX:E},washstand:{min:n(re,0,he),max:n(ce,ue,ee)},mothRest:n(ge[0][1],ge[0][2],ge[0][3]),carafeShadow:n(-60,45.2,-87.5)},le=new e.Vector3,ye=new e.Vector3;function ut(a,l,c){d.update(a,l),at.userData.setSize(s.renderer);const y=(l%9+9)%9;if(y<6.5){const b=se(0,6.5,y);Le.position.set(Te.x,Te.y-.3*b,Te.z),Le.scale.set(.25+.75*b,(.25+.75*b)*(1+.25*b),.25+.75*b)}else{const b=Math.min(1,(y-6.5)/1.7),B=$(Te.y-.3,.5,b*b);Le.position.set(Te.x,B,Te.z);const H=b<.97?1:.001;Le.scale.set(H*.9,H*1.25,H*.9)}const A=ot<0?.44+.5*((l/22%1+1)%1):ot;ht(A,le),ht(A+.004,ye);const M=se(xt,gt,A);ye.sub(le),Se.position.set(le.x+M*.9*Math.sin(l*2.3),le.y+M*.7*Math.sin(l*3.1),le.z+M*.9*Math.sin(l*1.7+1));const z=ye.lengthSq()>1e-8?Math.atan2(-ye.x,-ye.z):Math.PI/2,k=$(Math.PI/2,z,M)+.2*Math.sin(l*.9)*M;Se.rotation.set(M*(.55+.12*Math.sin(l*2.9)),k,.12*M*Math.sin(l*1.9));const i=b=>M>.01?$(.1,.42+.62*Math.sin(l*34-b),M):.1+.04*Math.sin(l*1.3);Qe.rotation.z=-i(0),Je.rotation.z=i(0);for(let b=0;b<2;b++){const B=i(.55*(b+1));et[b].rotation.z=-B,tt[b].rotation.z=B;const H=M>.01?1:.001;et[b].scale.setScalar(H),tt[b].scale.setScalar(H)}Se.getWorldPosition(le),L.worldToLocal(le),ye.copy(le).sub(_e).normalize();const m=x.uBed.value,q=le.x>m.x&&le.x<m.y&&le.z>m.z&&le.z<m.w,w=q?se(2,9,le.y-Z(le.x,le.z)):1,p=x.uMothN.value.set(-ye.x*w,1-w-ye.y*w,-ye.z*w).normalize(),S=x.uMothF.value.set(-Math.sin(k)*(1-.85*w),.85*w,-Math.cos(k)*(1-.85*w));S.addScaledVector(p,-S.dot(p)),S.lengthSq()<1e-6&&S.set(0,0,1).addScaledVector(p,-p.z),S.normalize(),x.uEllC.value[ct].copy(le).addScaledVector(ye,.4),x.uEllR.value[ct].set(Se.scale.x,1,1)}return ut(0,0,null),{object:L,radius:60,height:62,center:n(-38,44,-44),anchors:Mt,style:d,shafts:rt,motes:at,update:ut,setProgress(a){ot=a},dispose(){u.style||d.dispose()},ground:!1,groundY:0}}const vt=`
  vec2 streakOff(vec4 clipA, vec4 clipB, vec2 pos, float px, vec2 res, out float sl){
    vec2 sd = (clipB.xy/max(clipB.w, 0.05) - clipA.xy/max(clipA.w, 0.05))*res*0.5;
    sl = length(sd); vec2 sn = sl > 0.5 ? sd/max(sl, 1e-3) : vec2(1., 0.);
    sl = min(sl, 0.16*res.y)*step(0.05, clipB.w)*step(0.05, clipA.w);
    return sn*(pos.x*(px + 0.5*sl) + 0.5*sl) + vec2(-sn.y, sn.x)*(pos.y*px);
  }`,jt=`
  ${Oe}
  ${vt}
  uniform vec3 uVel;
  attribute vec4 aSeed; attribute vec3 aHome;
  uniform vec3 uBoxMin, uBoxMax, uDrift; uniform vec2 uRes; uniform float uMote;
  varying vec3 vC; varying vec2 vQ;
  void main(){
    float ph = aSeed.x*6.2832, t = uTime;
    vec3 c = aHome + vec3(sin(t*0.11 + ph)*4. + sin(t*0.31 + ph*3.)*1.2, sin(t*0.07 + ph*2.)*3. - mod(t*0.12*aSeed.y, 3.), cos(t*0.09 + ph*1.7)*4. + sin(t*0.27 + ph*5.)*1.2);
    c = uBoxMin + mod(c + uDrift*t - uBoxMin, max(uBoxMax - uBoxMin, vec3(1.)));
    vec3 o = uHole - c; float dist = length(o); o /= max(dist, 1e-3);
    float lit = o.x > 0.02 ? shadowAt(c, o, 0.3) : 0.;
    float inbed = step(uBed.x, c.x)*step(c.x, uBed.y)*step(uBed.z, c.z)*step(c.z, uBed.w);
    lit *= mix(1., step(foldH(c.xz), c.y), inbed);
    float tw = 0.55 + 0.45*sin(t*(0.6 + aSeed.z*1.5) + ph*7.);            // the mote turns: a flat fleck catches the ray and loses it
    vC = lit > 0.01 ? harbour(o, 0.03)*picFall(c)*lit*tw : vec3(0.);
    vec4 mv = viewMatrix*vec4(c, 1.);
    float size = (0.05 + 0.12*aSeed.w*aSeed.w)*uMote;
    vec4 clip = projectionMatrix*mv;
    float px = max(size*projectionMatrix[1][1]/max(-mv.z, 0.2)*uRes.y*0.5, 0.9);    // radius in pixels, never under a pixel
    vQ = position.xy;
    float sl; if (length(uVel) > 1e-4) px = min(px, 1.8 + 0.003*uRes.y);            // in the beam a near mote is a dash, never a disc
    vec2 off = streakOff(clip, projectionMatrix*viewMatrix*vec4(c + uVel, 1.), position.xy, px, uRes, sl);
    vC *= (1. + 0.9*smoothstep(2., 14., sl))/sqrt(1. + 0.25*sl/max(px, 0.5));      // a streak is thinner light, but a near one flares
    clip.xy += off*2./uRes*clip.w;
    if (lit < 0.01) clip = vec4(2., 2., 2., 1.);                                   // unlit motes are black: not drawn
    gl_Position = clip;
  }`,Ht=`
  uniform float uExpK;
  varying vec3 vC; varying vec2 vQ;
  void main(){
    float a = 1. - smoothstep(0.35, 1., length(vQ));
    gl_FragColor = vec4(vC*a*1.35*uExpK/0.6, 1.);
  }`;function _t(s,u,t={}){const h=t.count??6e3,d=t.min??new e.Vector3(-90,0,-110),o=t.max??new e.Vector3(125,130,125),x=new e.InstancedBufferGeometry;x.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),x.setIndex([0,1,2,0,2,3]);const L=new Float32Array(h*4),V=new Float32Array(h*3);for(let P=0;P<h;P++){for(let D=0;D<4;D++)L[P*4+D]=u();V[P*3]=$(d.x,o.x,u()),V[P*3+1]=$(d.y,o.y,u()),V[P*3+2]=$(d.z,o.z,u())}x.setAttribute("aSeed",new e.InstancedBufferAttribute(L,4)),x.setAttribute("aHome",new e.InstancedBufferAttribute(V,3)),x.instanceCount=h;const O=Object.assign({uBoxMin:{value:d.clone()},uBoxMax:{value:o.clone()},uRes:{value:new e.Vector2(1280,720)},uMote:{value:t.size??1},uVel:{value:new e.Vector3},uDrift:{value:(t.drift??new e.Vector3).clone()}},s.uniforms),G=new e.ShaderMaterial({uniforms:O,vertexShader:jt,fragmentShader:Ht,defines:{NO_DERIV:1},transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,fog:!1}),W=new e.Mesh(x,G);W.frustumCulled=!1,W.renderOrder=4,W.name="motes";const I=new e.Vector2;return W.userData.setSize=P=>{P&&(P.getDrawingBufferSize(I),O.uRes.value.copy(I))},W}const Wt=`
  ${Oe}
  attribute vec3 aEnd; attribute vec4 aRay;          // aRay: t along 0..1, side -1..1, width at the far end, seed
  attribute float aGain;
  uniform float uWide, uDustK;
  varying float vCap, vTan; varying vec3 vSd, vAx;     // (vTan, vSd, vAx are the same at every vertex of a ray)
  attribute float aTint;                             // 0 = the harbour along the ray, 1 sky, 2 sea, 3 sail (a shaft that must read as one colour)
  varying vec3 vC, vSP; varying vec4 vR; varying float vLen;
  void main(){
    vec3 dir = aEnd - uHole; float len = length(dir);
    vec3 P = uHole + dir*aRay.x;
    vec3 sd = cross(dir, P - cameraPosition); sd /= max(length(sd), 1e-3);
    // a cone from the hole, and never wider on screen than about a tenth of the frame (no veil when the eye is in the beam)
    vec3 o = -dir/max(len, 1e-3);
    vTan = aRay.z/max(len, 1e-3); vCap = 1.;
    float cap = uWide*length(P - cameraPosition);
    float hw = min(mix(min(1.2, aRay.z*0.25), aRay.z, aRay.x), cap);
    if (uDustK > 0.5){
      // a cone of dust is the straight wedge of its own geometry: its half width is linear in the distance from the hole,
      // so both edges are straight lines that meet at the hole. Like every ribbon it is capped by the line above, vertex
      // by vertex; vCap is the share of the wedge's own half width that is left at this vertex (for the edge's fade).
      float own = vTan*aRay.x*len;
      hw = min(own, cap);
      vCap = own > 1e-4 ? hw/own : 1.;
    }
    P += sd*aRay.y*hw; vSd = sd; vAx = -o;
    vC = o.x > 0.02 ? harbour(o, 0.035)*picFall(aEnd) : vec3(0.);
    if (aTint > 0.5) vC = (aTint < 1.5 ? uSky : aTint < 2.5 ? uSea*1.15 : uSailA*1.4)*(picFall(aEnd)*uGain*step(0.02, o.x));
    vC *= aGain;
    vR = aRay; vLen = len; vSP = P;
    gl_Position = projectionMatrix*viewMatrix*vec4(P, 1.);
  }`,Xt=`
  uniform float uExpK, uTime, uShaft, uDustK; uniform sampler2D tCloud;
  uniform vec3 uHole;
  varying vec3 vC, vSP; varying vec4 vR; varying float vLen, vCap, vTan; varying vec3 vSd, vAx;
  void main(){
    float d = vR.x*vLen, side = 1. - vR.y*vR.y;
    // where this pixel lies in its wedge, from its place in the room (a ribbon's own coordinate, interpolated over the two
    // triangles of each tapering piece, zigzags): yq = -1..1 across, the same all the way down any straight line from the hole
    vec3 q = vSP - uHole; float tq = max(dot(q, vAx), 1e-3);
    float yq = clamp(dot(q, vSd)/max(vTan*tq, 1e-3), -1., 1.);
    float lodF = clamp(log2(max(fwidth(yq)*1.9*256., 1e-3)), 0., 6.);       // filaments finer than a few pixels go to their average
    float dust = textureLod(tCloud, vec2(d*0.011 - uTime*0.045 + vR.w*7., vR.y*0.12 + vR.w*3.), 1.).r;
    float a = side*side*smoothstep(0., 0.06, vR.x)*(1. - smoothstep(0.82, 1., vR.x))*(0.2 + 2.1*dust*dust)*mix(0.05, 1., smoothstep(3., 60., d));
    if (uDustK > 0.001){
      // light travels straight: the filaments are looked up across the wedge's own width only (the same all the way down
      // a ray, so a ruler laid from the hole along any streak stays on it). Only the dust moves: clumps and grit sliding
      // outward along the rays, looked up by the distance from the hole. Where the ribbon is drawn narrower than the
      // wedge (vCap < 1) the soft edge is at the ribbon's real edge.
      float fil = textureLod(tCloud, vec2(vR.w*11. + 0.37, yq*1.9 + vR.w*5.), lodF).g;
      float fil2 = textureLod(tCloud, vec2(vR.w*3. + 0.71, yq*5.3 + vR.w*9.), min(lodF + 1.5, 6.)).r;
      float n1 = textureLod(tCloud, vec2(tq*0.019 - uTime*0.075 + vR.w*7., vR.w*3.), 0.).r;                     // clumps sliding outward
      float n3 = textureLod(tCloud, vec2(tq*0.07 - uTime*0.26 + vR.w*17., yq*3.7 + vR.w*9.), 0.).r;           // grit
      float edge = (1. - smoothstep(0.7, 1., min(abs(yq)/max(vCap, 1e-3), 1.)))*(0.4 + 0.6*(1. - yq*yq));
      float f = smoothstep(0.3, 0.72, fil)*(0.45 + 0.9*fil2);
      float dusty = edge*(0.07 + f*(0.5 + 2.2*smoothstep(0.4, 0.78, n1))*(0.45 + 1.1*n3*n3));
      a = mix(a, dusty*smoothstep(0., 0.04, vR.x)*(1. - smoothstep(0.82, 1., vR.x))*mix(0.05, 1., smoothstep(3., 40., d)), uDustK);
    }
    a *= smoothstep(1.5, 7., distance(vSP, cameraPosition));        // nothing within a few metres of the eye: the mote is in the beam, not in a fog
    vec3 c = mix(vec3(1.), vC, smoothstep(2., 9., d));              // white only in the last few metres by the hole (the next world shows there)
    gl_FragColor = vec4(c*a*uShaft*uExpK/0.6, 1.);
  }`;function Ot(s,u,t,h={}){const d=t.length,o=h.seg??6,x=[],L=[],V=[],O=[],G=[],W=[];for(let f=0;f<d;f++){const r=h.rngOf?h.rngOf(f):u,C=t[f],g=typeof h.width=="function"?h.width(f):h.width??2+5*r(),R=r(),T=x.length/3,U=h.tint?h.tint(f):0,Y=h.gain?h.gain(f):1;for(let N=0;N<=o;N++)for(const E of[-1,1])x.push(0,0,0),L.push(C.x,C.y,C.z),V.push(N/o,E,g,R),G.push(U),W.push(Y);for(let N=0;N<o;N++){const E=T+N*2;O.push(E,E+1,E+2,E+1,E+3,E+2)}}const I=new e.BufferGeometry;I.setAttribute("position",new e.Float32BufferAttribute(x,3)),I.setAttribute("aEnd",new e.Float32BufferAttribute(L,3)),I.setAttribute("aRay",new e.Float32BufferAttribute(V,4)),I.setAttribute("aTint",new e.Float32BufferAttribute(G,1)),I.setAttribute("aGain",new e.Float32BufferAttribute(W,1)),I.setIndex(O);const P=Object.assign({uShaft:{value:h.strength??.12},uDustK:{value:h.dust??0},uWide:{value:h.wide??.045}},s.uniforms),D=new e.ShaderMaterial({uniforms:P,vertexShader:Wt,fragmentShader:Xt,defines:{NO_DERIV:1},transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,fog:!1}),Z=new e.Mesh(I,D);return Z.frustumCulled=!1,Z.renderOrder=3,Z.name="shafts",Z}const Zt=`
  ${vt}
  attribute vec4 aCone, aFl; attribute vec2 aTG;      // aCone: axis (unit, from the hole), tan;  aFl: d0, radial fraction, angle, seed;  aTG: tint, gain
  uniform vec3 uHole, uSky, uSea, uSailA, uVel; uniform vec2 uRes; uniform float uTime, uGain, uFleck, uReach, uOut, uDustA;
  varying vec3 vC; varying vec2 vQ;
  void main(){
    vec3 ax = aCone.xyz, b1 = cross(ax, vec3(0., 1., 0.)); b1 /= max(length(b1), 1e-3); vec3 b2 = cross(ax, b1);
    float d = 3. + mod(aFl.x + uTime*uOut*(0.7 + 0.6*aFl.w), uReach);
    float ang = aFl.z + 0.05*uTime*(aFl.w - 0.5), rr = d*aCone.w*aFl.y;
    vec3 c = uHole + ax*d + (b1*cos(ang) + b2*sin(ang))*rr + vec3(0., 0.35*sin(uTime*0.6 + aFl.w*40.), 0.3*sin(uTime*0.45 + aFl.w*23.));
    float tw = 0.35 + 0.65*abs(sin(uTime*(0.5 + 1.6*aFl.w) + aFl.w*61.));               // a flat fleck turning in its ray
    vec3 tint = aTG.x < 1.5 ? uSky : aTG.x < 2.5 ? uSea*1.15 : uSailA*1.4;
    float core = 1. - 0.6*aFl.y;
    vC = mix(vec3(1.), tint, smoothstep(2., 9., d))*(aTG.y*uGain*tw*core*uDustA*smoothstep(3., 9., d)*(1. - smoothstep(uReach*0.8, uReach, d)));
    vec4 mv = viewMatrix*vec4(c, 1.), clip = projectionMatrix*mv;
    float px = max((0.02 + 0.05*aFl.w*aFl.w)*uFleck*projectionMatrix[1][1]/max(-mv.z, 0.2)*uRes.y*0.5, 0.75);
    float sl; vec2 off = streakOff(clip, projectionMatrix*viewMatrix*vec4(c + uVel, 1.), position.xy, px, uRes, sl);
    px = min(px, 1.5 + 0.002*uRes.y);
    off = streakOff(clip, projectionMatrix*viewMatrix*vec4(c + uVel, 1.), position.xy, px, uRes, sl);
    vC *= (1. + 1.6*smoothstep(2., 14., sl))/sqrt(1. + 0.2*sl/max(px, 0.5));
    vQ = position.xy;
    clip.xy += off*2./uRes*clip.w;
    if (uDustA < 0.004) clip = vec4(2., 2., 2., 1.);
    gl_Position = clip;
  }`,$t=`
  uniform float uExpK;
  varying vec3 vC; varying vec2 vQ;
  void main(){
    float a = 1. - smoothstep(0.3, 1., length(vQ));
    gl_FragColor = vec4(vC*a*1.35*uExpK/0.6, 1.);
  }`;function ea(s,u,t,h={}){const d=h.count??8e3,o=h.reach??130,x=s.uniforms,L=new e.InstancedBufferGeometry;L.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),L.setIndex([0,1,2,0,2,3]);const V=new Float32Array(d*4),O=new Float32Array(d*4),G=new Float32Array(d*2);let W=0;for(const C of t)W+=C.gain*(.4+C.tan);const I=t.map(()=>Array.from({length:24},()=>u()**2.2));let P=0;for(let C=0;C<t.length&&P<d;C++){const g=t[C],R=new e.Vector3().subVectors(g.end,_e).normalize(),T=C===t.length-1?d-P:Math.min(d-P,Math.round(d*g.gain*(.4+g.tan)/W));for(let U=0;U<T;U++,P++){let Y=0;for(let N=0;N<6&&(Y=u()*o,!(u()<.12+.88*I[C][Math.floor(Y/o*24)%24]));N++);V[P*4]=R.x,V[P*4+1]=R.y,V[P*4+2]=R.z,V[P*4+3]=g.tan,O[P*4]=Y,O[P*4+1]=Math.abs(u()+u()+u()-1.5)/1.5*(.75+.5*u()),O[P*4+2]=u()*6.2832,O[P*4+3]=u(),G[P*2]=g.tint,G[P*2+1]=g.gain}}L.setAttribute("aCone",new e.InstancedBufferAttribute(V,4)),L.setAttribute("aFl",new e.InstancedBufferAttribute(O,4)),L.setAttribute("aTG",new e.InstancedBufferAttribute(G,2)),L.instanceCount=d;const D={uHole:x.uHole,uSky:x.uSky,uSea:x.uSea,uSailA:x.uSailA,uTime:x.uTime,uGain:x.uGain,uExpK:x.uExpK,uVel:{value:new e.Vector3},uRes:{value:new e.Vector2(1280,720)},uFleck:{value:h.size??1},uReach:{value:o},uOut:{value:h.speed??4},uDustA:{value:1}},Z=new e.ShaderMaterial({uniforms:D,vertexShader:Zt,fragmentShader:$t,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,fog:!1}),f=new e.Mesh(L,Z);f.frustumCulled=!1,f.renderOrder=4,f.name="shaft-dust";const r=new e.Vector2;return f.userData.setSize=C=>{C&&(C.getDrawingBufferSize(r),D.uRes.value.copy(r))},f}export{St as DEFAULT_PALETTE,_e as HOLE,Ge as N_BOX,Ee as N_CAP,ke as N_ELL,De as N_GULL,Ne as N_LUG,We as N_MAST,Bt as PICTURE_GLSL,Ct as SHADOW_GLSL,Oe as STYLE_GLSL,mt as STYLE_VS,Rt as SURFACE_GLSL,zt as TONE_GLSL,Jt as buildHero,F as dress,It as foldHeight,Gt as glassMaterial,Vt as linenMaterial,_t as makeMotes,ea as makeShaftDust,Ot as makeShafts,Et as makeStyle,Lt as matteMaterial,Qt as toScene};
