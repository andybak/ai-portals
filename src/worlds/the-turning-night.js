import*as g from"three";import{mergeGeometries as Bt}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as oe}from"../kit/core.js";import{buildHero as se}from"../parts/the-turning-night.js";const K=Math.PI*2,P=-78,ge=Math.tan(14*Math.PI/180),I=(k,t,V)=>{const R=Math.min(1,Math.max(0,(V-k)/(t-k)));return R*R*(3-2*R)},N=(k,t,V)=>k+(t-k)*V,Gt={ultra:"#0B1A4A",cobalt:"#2348A8",cer:"#7FB2E5",yel:"#F6D54A",vir:"#1E4E5A",cyp:"#14261E",org:"#F08A24"},Et=`
float tnHash1(float n){ return fract(sin(n*12.9898)*43758.5453); }
float tnProf(float a, float id){ float a2 = a*a; return (1.0-a2*a2)*0.55 + 0.22*cos(a*9.0+id*37.0) + 0.23*smoothstep(0.5,0.9,abs(a)); }
float tnSlope(float a, float id){ return (tnProf(a+0.1,id)-tnProf(a-0.1,id))*5.0; }
vec3 tnGallery(vec3 alb, vec3 emis, vec3 nv, float mask){
  vec3 L = normalize(vec3(-0.6,0.6,0.5));
  float d = clamp(dot(nv,L), 0.0, 1.0);
  float shade = 0.62 + 0.75*d;
  float spec = pow(max(dot(nv, normalize(L+vec3(0.0,0.0,1.0))), 0.0), 40.0)*mask;
  return alb*shade + spec*vec3(0.30,0.36,0.50) + emis*(0.75+0.45*d);
}
// canvas tooth: a weave fixed to the screen (k radians per pixel), so it never swims
float tnWeave(float k){ return 0.93 + 0.07*sin(gl_FragCoord.x*k)*sin(gl_FragCoord.y*k); }`,re=`
attribute vec4 aP, aD, aC, aX; attribute vec2 aH;
uniform float uTime, uSwitch, uDrain, uRain, uRare, uFlame, uMinW;
uniform vec4 uWind; uniform vec2 uFade;
varying vec2 vUv; varying vec4 vCol; varying float vId; varying vec3 vSideV, vAxisV;
#include <fog_pars_vertex>
vec3 flameP(float t, float H, float R, float a0, float hs, vec3 base){
  float r = R*pow(max(1.0-t, 0.0), 0.8)*(0.5+0.5*smoothstep(0.0,0.16,t))*aX.y;
  float an = a0 + aX.z*1.5*t + 0.22*sin(t*9.0 + uTime*1.4 + hs*6.0);
  vec3 p = base + vec3(cos(an)*r, t*H, sin(an)*r);
  float t2 = t*t;
  p.xz += uWind.xy*(0.03 + uWind.w*0.16)*H*t2;
  p.x += sin(uTime*1.7 + t*5.0 + base.x)*0.03*H*t2*t;
  p.z += cos(uTime*1.3 + t*4.0 + base.z)*0.03*H*t2*t;
  return p;
}
vec3 smokeP(float t, float R, float hs, vec3 base){
  vec3 p = base + vec3(0.0, t*R, 0.0);
  p.xz += uWind.xy*t*t*R*(0.35 + 0.9*uWind.z);
  p.x += sin(t*7.0 + hs*6.0 + uTime*0.5)*t*3.5;
  p.z += cos(t*6.0 + hs*9.0 + uTime*0.4)*t*3.5;
  p += uDrain*t*t*vec3(-base.x*0.12, 16.0, -55.0);
  return p;
}
void main(){
  float kind = aP.w, l = position.x, hw = aD.w, hs = aH.x, par = aH.y, sc = 1.0, flatS = 0.0;
  vec3 C = (modelMatrix*vec4(aP.xyz,1.0)).xyz, P, ax, fside = vec3(1.0,0.0,0.0);
  if (kind < 0.5){
    vec3 d = mat3(modelMatrix)*aD.xyz; float hl = max(length(d), 1e-4); ax = d/hl;
    C += ax*sin(uTime*(0.5+hs) + hs*40.0)*par;
    P = C + ax*l*hl;
  } else if (kind < 1.5){
    float w = sin(dot(C.xz, uWind.xy)*0.157 - uTime*1.7 + hs*1.2)*0.5+0.5;
    float g = sin(uTime*2.3 + hs*30.0)*0.07;
    vec2 lean = uWind.xy*(uWind.w*1.6 + uWind.z*(0.15+0.85*w)) + vec2(g,-g);
    vec2 dc = C.xz - cameraPosition.xz; float dd = length(dc);
    lean += dc/max(dd,0.5)*1.3*smoothstep(15.0,3.0,dd)*step(abs(cameraPosition.y-C.y), 14.0);
    float L = max(length(aD.xyz), 1e-3);
    vec3 tip = normalize(aD.xyz + vec3(lean.x,0.0,lean.y)*L)*L;
    ax = tip/L; P = C + tip*(l*0.5+0.5);
  } else if (kind < 2.5){
    float H = aD.z, t = fract(aD.y + uTime*uFlame/H*(0.7+0.6*hs));
    float tt = clamp(t + l*aX.x/H, 0.0, 0.995);
    P = flameP(tt, H, par, aD.x, hs, C);
    ax = normalize(flameP(tt+0.012, H, par, aD.x, hs, C) - P + vec3(0.0,1e-4,0.0));
    sc = smoothstep(0.0,0.05,t)*(1.0-smoothstep(0.88,0.99,t));
  } else if (kind < 3.5){
    vec3 n = normalize(aX.xyz + vec3(1e-4,0.0,0.0));
    vec3 e1 = normalize(cross(n, vec3(0.31,0.87,0.38)) + vec3(0.0,0.0,1e-4)), e2 = cross(n, e1);
    float an = aD.x + uTime*par + l*aD.z, r = aD.y*(1.0 + 0.1*sin(uTime*2.6 + hs*50.0));
    P = C + (e1*cos(an) + e2*sin(an))*r + n*sin(uTime*1.9 + hs*33.0)*r*0.08;
    ax = normalize(e2*cos(an) - e1*sin(an));
  } else if (kind < 4.5){
    float R = aD.z, t = fract(aD.x + uTime*0.055*(0.8+0.4*aD.y)), tt = clamp(t + l*0.045, 0.0, 1.05);
    P = smokeP(tt, R, aD.y, C);
    ax = normalize(smokeP(tt+0.02, R, aD.y, C) - P + vec3(0.0,1e-4,0.0));
    sc = smoothstep(0.0,0.08,t)*(1.0-smoothstep(0.75,1.0,t));
    hw *= 0.6 + 1.0*t;
  } else if (kind < 5.5){
    vec2 dc = cameraPosition.xz - C.xz; float D = max(length(dc), 1.0); vec2 d2 = dc/D;
    float hc = max(cameraPosition.y - C.y, 1.0), s0 = D*aD.z/(aD.z + hc);
    float span = min(par, 0.22*D + 3.0);
    float s = s0 + (aD.x - 0.35)*2.0*span;
    float shv = sin(uTime*(2.0+3.0*hs) + aD.x*23.0);
    P = C + vec3(d2.x,0.0,d2.y)*s;
    ax = vec3(-d2.y, 0.0, d2.x);
    float nearK = clamp((D - s)/45.0, 0.3, 1.0);          // keep the dashes nearest the lens from flooding the frame
    P += ax*(shv*0.25 + l*aD.y*(0.7+0.3*shv)*nearK);
    fside = vec3(d2.x,0.0,d2.y); flatS = 1.0; hw *= (0.55 + 0.03*span)*nearK;
    sc = step(1.0, s)*smoothstep(700.0, 400.0, D);
  } else if (kind < 6.5){
    vec3 box = vec3(140.0, 90.0, 140.0);
    vec3 p = aP.xyz; p.y -= uTime*aD.x; p.xz += uWind.xy*uTime*aD.x*aD.z;
    P = cameraPosition + mod(p - cameraPosition + box*0.5, box) - box*0.5;
    ax = normalize(vec3(uWind.x*aD.z, -1.0, uWind.y*aD.z));
    P += ax*l*aD.y;
    sc = (par < 0.5 ? uRain : uRare)*smoothstep(2.0, 6.0, length(P - cameraPosition));
  } else {
    float t = fract(aD.y + uTime*0.45), r = 0.3 + t*aD.z, an = aD.x;
    vec3 rad = vec3(cos(an), 0.0, sin(an));
    ax = vec3(-rad.z, 0.0, rad.x);
    P = C + rad*r + ax*l*r*0.19;
    fside = rad; flatS = 1.0; sc = uRare*(1.0-t*t)*smoothstep(0.0,0.08,t);
  }
  vec3 toC = cameraPosition - P; float dist = max(length(toC), 1e-3);
  vec3 side = flatS > 0.5 ? fside : normalize(cross(ax, toC/dist) + vec3(1e-5,0.0,0.0));
  hw = max(hw, dist*uMinW);
  sc *= 1.0 - smoothstep(uFade.x, uFade.y, dist);
  P += side*position.y*hw*sc;
  vec4 mvPosition = viewMatrix*vec4(P,1.0);
  gl_Position = sc < 0.01 ? vec4(2.0,2.0,2.0,1.0) : projectionMatrix*mvPosition;
  float sw = aX.w, on = sw > 0.0 ? smoothstep(sw-0.004, sw+0.004, uSwitch) : (sw < 0.0 ? 1.0 - smoothstep(-sw-0.004, -sw+0.004, uSwitch) : 1.0);
  float em = aC.a*on*(0.8 + 0.2*sin(uTime*(3.0+7.0*hs) + hs*90.0));
  vec3 c = aC.rgb*(aC.a > 0.05 ? 0.25 + 0.75*on : 1.0);
  vUv = position.xy; vCol = vec4(c, em); vId = hs;
  vSideV = mat3(viewMatrix)*side; vAxisV = mat3(viewMatrix)*ax;
  #include <fog_vertex>
}`,ie=`
varying vec2 vUv; varying vec4 vCol; varying float vId; varying vec3 vSideV, vAxisV;
uniform float uGain, uWeave;
#include <fog_pars_fragment>
${Et}
void main(){
  float a = vUv.y, al = abs(vUv.x);
  float en = 1.0 - 0.28*tnHash1(floor(a*4.0+4.0) + vId*71.0);
  float q = al/en;
  if (al > en || abs(a) > 1.0 - 0.45*q*q*q*q*q) discard;
  vec3 sv = normalize(vSideV + vec3(1e-5,0.0,0.0)), nf = normalize(cross(sv, normalize(vAxisV + vec3(0.0,1e-5,0.0))) + vec3(0.0,0.0,1e-5));
  if (nf.z < 0.0) nf = -nf;
  nf = normalize(mix(nf, vec3(0.0,0.0,1.0), 0.5));
  vec3 nv = normalize(nf - sv*tnSlope(a, vId)*0.9);
  float pr = tnProf(a, vId);
  vec3 emis = vCol.rgb*vCol.a*(0.6+0.5*pr);
  gl_FragColor = vec4(tnGallery(vCol.rgb, emis, nv, 1.0)*uGain*tnWeave(uWeave), 1.0);
  #include <fog_fragment>
}`,ce=`
attribute vec3 color;
varying vec3 vW, vN, vC;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix*vec4(position,1.0); vW = wp.xyz;
  vN = normalize(mat3(modelMatrix)*normal + vec3(0.0,1e-5,0.0)); vC = color;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,le=`
varying vec3 vW, vN, vC;
uniform float uTime, uGain, uCreep, uWeave;
uniform vec4 uWind;
#include <fog_pars_fragment>
${Et}
// one layer of brick-laid dashes, sx m scale along and sy across: returns (pigment hash, across, along)
vec3 tnDash(vec2 uv, float sx, float sy, out float h2){
  vec2 q = uv/vec2(2.6*sx, 0.6*sy);
  float row = floor(q.y), sd = sx + sy*3.0;
  q.x += tnHash1(row*1.37 + sd)*9.0 + uTime*uCreep*(tnHash1(row*0.71)-0.3)/sx;
  float cell = floor(q.x);
  float h = tnHash1(cell*7.31 + row*3.17 + sd*5.0);
  h2 = tnHash1(cell*1.93 + row*9.41 + sd);
  return vec3(h, fract(q.y)*2.0-1.0, fract(q.x)*2.0-1.0);
}
vec3 tnTone(vec3 base, vec3 d, float h2){
  vec3 c = base*(0.72 + 0.56*d.x);
  c *= mix(vec3(1.0), vec3(0.72,0.95,1.4), step(h2, 0.18));
  c *= mix(vec3(1.0), vec3(1.3,1.15,0.7), step(0.86, h2));
  float en = 1.0 - 0.3*tnHash1(floor(d.y*3.0+3.0) + d.x*71.0);
  if (abs(d.z) > en || abs(d.y) > 0.9) c = base*0.5;
  return c;
}
// dashes at length scale sx whose rows are r times that scale (r from the footprint, cross-faded by octave)
vec3 tnRows(vec2 uv, float sx, float r0, float g, vec3 base, out float slope){
  float h; vec3 d = tnDash(uv, sx, sx*r0, h);
  vec3 col = tnTone(base, d, h); slope = tnSlope(d.y, d.x);
  if (g > 0.0){
    vec3 e = tnDash(uv, sx, sx*r0*2.0, h);
    col = mix(col, tnTone(base, e, h), g); slope = mix(slope, tnSlope(e.y, e.x), g);
  }
  return col;
}
// a coat of dashes laid along uv.x. fp = pixel footprint (along the dash, across the rows) in metres.
// Length and row height are scaled separately, so that on screen a dash is never under ~10 pixels long
// nor a row under ~5 pixels high: at grazing angles the paint stays in strokes instead of hairline stripes.
vec3 tnCoat(vec2 uv, vec2 fp, float dist, vec3 base, out float slope){
  float b0 = max(dist/28.0, 1.0), wx = max(b0, 3.8*fp.x), wy = max(b0, 8.0*fp.y);
  float lx = log2(wx), sx = exp2(floor(lx)), f = smoothstep(0.55, 1.0, fract(lx));
  float lr = log2(wy/wx), r0 = exp2(floor(lr)), g = smoothstep(0.55, 1.0, fract(lr));
  float sa, sb; vec3 col = mix(tnRows(uv, sx, r0, g, base, sa), tnRows(uv, sx*2.0, r0, g, base, sb), f);
  slope = mix(sa, sb, f);
  float rr = fp.y/(0.6*sx*r0), k = smoothstep(0.3, 0.7, rr);  // what is still too fine goes to the mean tone,
  col = mix(col, base*0.9, k);
  slope *= 1.0 - smoothstep(0.06, 0.2, rr);                     // and bristle ridges only show where a row is 5+ pixels high
  return col;
}
void main(){
  vec3 n = normalize(vN);
  if (!gl_FrontFacing) n = -n;
  float hl = length(n.xz), dist = length(vW - cameraPosition);
  vec3 dWx = dFdx(vW), dWy = dFdy(vW);
  bool wall = abs(n.y) < 0.5;
  // sloping ground and walls: dashes follow the contour (16 directions)
  float ang = atan(n.x, -n.z + 1e-6);
  ang = floor(ang/0.3927 + 0.5)*0.3927;
  vec2 t2 = vec2(cos(ang), sin(ang)), p2 = vec2(-t2.y, t2.x);
  vec2 uv = vec2(dot(vW.xz, t2), wall ? vW.y : dot(vW.xz, p2));
  vec2 fa = abs(vec2(dot(dWx.xz, t2), dot(dWy.xz, t2)));
  vec2 fb = wall ? abs(vec2(dWx.y, dWy.y)) : abs(vec2(dot(dWx.xz, p2), dot(dWy.xz, p2)));
  float slope; vec3 col = tnCoat(uv, vec2(max(fa.x, fa.y), max(fb.x, fb.y)), dist, vC, slope);
  vec3 tW = vec3(t2.x, 0.0, t2.y);
  // flat ground: one continuous, gently curving field laid with the wind (no cells, no seams)
  float flatK = 1.0 - smoothstep(0.07, 0.2, hl);
  if (flatK > 0.0){
    vec2 w2 = normalize(uWind.xy + vec2(1e-4, 0.0)), q2 = vec2(-w2.y, w2.x);
    vec2 pw = vW.xz + 18.0*vec2(sin(vW.z*0.019 + 1.3), sin(vW.x*0.016));
    vec2 ga = abs(vec2(dot(dWx.xz, w2), dot(dWy.xz, w2))), gb = abs(vec2(dot(dWx.xz, q2), dot(dWy.xz, q2)));
    float sl2; vec3 c2 = tnCoat(vec2(dot(pw, w2), dot(pw, q2)), vec2(max(ga.x, ga.y), max(gb.x, gb.y))*1.3, dist, vC, sl2);
    col = mix(col, c2, flatK); slope = mix(slope, sl2, flatK);
    tW = normalize(mix(tW, vec3(w2.x, 0.0, w2.y), flatK) + vec3(1e-4, 0.0, 0.0));
  }
  vec3 bW = normalize(cross(n, tW) + vec3(0.0,1e-4,0.0));
  vec3 nv = mat3(viewMatrix)*n; nv = normalize(mix(nv, vec3(0.0,0.0,1.0), 0.55));
  nv = normalize(nv - (mat3(viewMatrix)*bW)*slope*0.55);
  gl_FragColor = vec4(tnGallery(col, vec3(0.0), nv, 0.22)*uGain*tnWeave(uWeave), 1.0);
  #include <fog_fragment>
}`;function m0(){const k=[],t=[],V=[],R=[],H=[],X={count:0,add(D,i0,p0,c0,Y,d0,v0,f0,J,C0,O,$0=0,t0=0,Q0=1,gt=0,e0=0,o0=1){k.push(i0,p0,c0,D),t.push(Y,d0,v0,f0),V.push(J.r*o0,J.g*o0,J.b*o0,C0),R.push(t0,Q0,gt,e0),H.push(O,$0),X.count++},mesh(D,i0,p0){const c0=new g.PlaneGeometry(2,2,i0,1),Y=new g.InstancedBufferGeometry;Y.index=c0.index,Y.setAttribute("position",c0.getAttribute("position"));const d0=(f0,J)=>{const C0=new g.InstancedBufferAttribute(new Float32Array(f0),J);return p0&&C0.setUsage(g.DynamicDrawUsage),C0};Y.setAttribute("aP",d0(k,4)),Y.setAttribute("aD",d0(t,4)),Y.setAttribute("aC",d0(V,4)),Y.setAttribute("aX",d0(R,4)),Y.setAttribute("aH",d0(H,2)),Y.instanceCount=X.count;const v0=new g.Mesh(Y,D);return v0.frustumCulled=!1,v0}};return X}function Q(k,t,V){const R=k.index?k.toNonIndexed():k;V&&R.applyMatrix4(V);const H=R.getAttribute("position").count,X=new Float32Array(H*3);for(let D=0;D<H;D++)X[D*3]=t.r,X[D*3+1]=t.g,X[D*3+2]=t.b;return R.setAttribute("color",new g.BufferAttribute(X,3)),R.deleteAttribute("uv"),R}function he(k,t,V,R,H,X){const D=H-V,i0=X-R,p0=Math.min(1,Math.max(0,((k-V)*D+(t-R)*i0)/(D*D+i0*i0)));return Math.hypot(k-V-D*p0,t-R-i0*p0)}var me={id:"the-turning-night",name:"The Turning Night",category:"sky",weirdness:.45,media:["air"],async build(k){const{rng:t,noise:V}=k,R=k.vary||{},H=k.quality&&k.quality.detail||1,X=Math.min(1.3,Math.max(.7,R.density||1))*H,D=R.hour==="night"?"night":R.hour==="dawn"?"dawn":R.hour==="golden"?"dusk":t.pick(["night","night","dusk","dawn"]),i0=t.pick(["clear","clear","mistral","rain"]),p0=t.pick(["summer","summer","spring","winter"]),c0=t.chance(.35),Y=t.chance(.4),d0=D!=="dawn"&&t.chance(.4),v0=!!R.rare,f0=i0==="mistral",J=i0==="rain",C0=t.range(-.5,.5)+(t.chance(.5)?0:Math.PI),O=new g.Vector4(Math.cos(C0),Math.sin(C0)*.6,f0?1:.38,f0?.55:0);{const e=Math.hypot(O.x,O.y);O.x/=e,O.y/=e}const $0=f0?2:1,t0=new g.Scene,Q0=new g.Color(D==="dawn"?"#1C3A7A":D==="dusk"?"#1A2A70":"#142C78");t0.background=new g.Color("#0B1A4A"),t0.fog=new g.FogExp2(Q0,J?.0012:85e-5);const e0=await se(k,{palette:D==="dawn"?["#10225A","#2C56B0","#8FC2EA","#F2E060","#6E9A3C","#14261E","#F09A3A"]:D==="dusk"?["#161A54","#2A48A8","#86B0E0","#F6D04A","#2A4E5A","#14261E","#F08A24"]:["#0B1A4A","#2348A8","#7FB2E5","#F6D54A","#1E4E5A","#14261E","#F08A24"],mirror:!1,gateGlow:.62});t0.add(e0.object),e0.uniforms.uGain.value=D==="dawn"?1.02:1.15;const o0=e0.anchors;await k.yield();const a={};for(const e in Gt)a[e]=new g.Color(Gt[e]);const mt=t.range(-.015,.015),v=(e,n,r,i=1)=>e.clone().lerp(n,r).multiplyScalar(i),j=new g.Color(.78,.82,.74),$=new g.Color("#B8892A").offsetHSL(mt,0,0),J0=new g.Color("#F6C84A"),y0=new g.Color("#B8CCE8"),x0=p0==="winter",pt=p0==="spring",D0=e=>[0,13-Math.sin(14*Math.PI/180)*e,Math.cos(14*Math.PI/180)*e],vt=t.range(-1,1),w0=oe([[5,-45.5,1186],[3.2,-44.2,1167],[1.6,-38,1155],[0,-28,1146.5],[1,-17.5,1128],[1,-9.5,1088],[0,-6.5,1022],[0,-6,950],[0,-38,884],[-2+vt*3,-65,824],[-8+vt*4,-69.5,762],[-33,-59.5,690],[-15,-67,612],[0,-74.6,536],[0,-74.8,446],[0,-75,376],D0(330),D0(270),D0(200),D0(130),D0(60),D0(0)]),q0=42,Ht=w0.length,M0=new Float32Array(245).fill(1e9);{const e=new g.Vector3;for(let n=0;n<=900;n++){w0.pointAt(n/900,e);const r=Math.round(e.z/5);r>=0&&r<245&&(M0[r]=e.x)}for(let n=1;n<245;n++)M0[n]>1e8&&(M0[n]=M0[n-1]>1e8?0:M0[n-1]);M0[0]>1e8&&(M0[0]=0)}const tt=e=>M0[Math.min(244,Math.max(0,Math.round(e/5)))],P0={uTime:{value:0},uSwitch:{value:0},uDrain:{value:0},uRain:{value:J?1:0},uRare:{value:0},uFlame:{value:f0?3.4:2},uMinW:{value:.0021},uWind:{value:O},uGain:{value:1.15},uCreep:{value:f0?.5:.25},uWeave:e0.uniforms.uWeave},yt=new g.Vector2,Xt=[],et=(e,n=!0)=>{const r=new g.ShaderMaterial({uniforms:Object.assign(g.UniformsUtils.clone(g.UniformsLib.fog),P0,{uFade:{value:new g.Vector2(e[0],e[1])}}),vertexShader:re,fragmentShader:ie,side:g.DoubleSide,fog:n});return Xt.push(r),r},at=new g.ShaderMaterial({uniforms:Object.assign(g.UniformsUtils.clone(g.UniformsLib.fog),P0),vertexShader:ce,fragmentShader:le,fog:!0,side:g.DoubleSide}),xt=et([620,820]),S0=et([1500,2e3]),wt=et([5e3,6e3],!1);wt.depthWrite=!1;const V0=[[720,1420],[430,1010],[170,800],[30,715],[0,650],[0,372],[-25,332],[-130,300],[-330,255],[-520,120],[-640,-150],[-700,-600],[-720,-1300]],b0=(e,n)=>{let r=1e9;for(let i=0;i<V0.length-1;i++)r=Math.min(r,he(e,n,V0[i][0],V0[i][1],V0[i+1][0],V0[i+1][1]));return r},W0=t.range(0,500),Mt={x:-12,z:1135};function _(e,n,r=!0){const i=Math.abs(e);let o=P+2.6+I(700,1100,n)*6.5+V.fbm2(e*.008+W0,n*.008,3)*1.6;o+=18*Math.exp(-((e-Mt.x)**2+(n-Mt.z)**2)/2900);const c=.5+.5*V.fbm2(e*.0016+W0,n*.0016-W0,4),u=V.ridged2(e*.0021-W0,n*.0021,3),x=I(400,950,i),l=300*x*(.5+.3*c+.25*u)+26*I(160,420,i)*c,m=125*I(-560,-1250,n)*(.55+.5*c),p=230*I(1330,1750,n)*(.6+.4*c);o+=l+(1-x)*(m+p);const y=Math.hypot(e*.62,n)/330;y<1.25&&(o=Math.max(o,P+78*(1-y)-4*(1-I(0,.16,y))+V.fbm2(e*.02,n*.02+W0,2)*1.2*I(0,.2,y)));const f=b0(e,n),h=n>340&&n<705&&i<130,s=1-I(60,320,f)*1;if(f<320&&o>P+4&&y>1&&(o=N(o,P+4+(o-P-4)*(1-s*.85),1)),o=N(P-2.6,o,h?I(44,46.5,f):I(40,64,f)),r&&i<70){const d=w0.nearestXZ(e,n);d.dist<26&&(o=Math.min(o,N(d.y-8,o,I(12,26,d.dist))))}return o}{const o=new Float32Array(107361),c=new Float32Array(35787*3),u=[],x=x0?v(y0,a.cobalt,.35,.42):new g.Color("#6A5416").offsetHSL(mt,0,0),l=v(a.vir,a.cyp,.3,1.5),m=v(a.cyp,a.vir,.45,1.9),p=v(a.ultra,a.vir,.3,.8),y=new g.Color("#27325A"),f=v(a.ultra,a.cobalt,.45,1.25),h=v(a.cobalt,a.cer,.3,.8),s=new g.Color;let d=0;for(let b=0;b<=236;b++){const z=N(-1900,2e3,b/236);for(let S=0;S<=150;S++){const T=S/150*2-1,C=1750*(.24*T+.76*T*T*T),F=_(C,z),W=b0(C,z),L=Math.abs(C);o[d]=C,o[d+1]=F,o[d+2]=z;const U=Math.hypot(C*.62,z)/330,h0=z>722&&z<1095&&L<190&&W>52;F<P?s.copy(p):z>340&&z<705&&L<130&&W<80?s.copy(y):U<1.05&&F>P+3?s.copy(m).lerp(l,.5+.5*V.n2(C*.03,z*.03)):h0?s.copy(x):s.copy(l).lerp(f,I(P+8,P+60,F)).lerp(h,I(P+90,P+330,F)),x0&&F>P+3&&s.lerp(y0,.22*(.5+.5*V.n2(C*.02,z*.02))),c[d]=s.r,c[d+1]=s.g,c[d+2]=s.b,d+=3}b%4===3&&await k.yield()}for(let b=0;b<236;b++)for(let z=0;z<150;z++){const S=b*151+z,T=S+1,C=S+150+1,F=C+1;u.push(S,C,T,T,C,F)}await k.yield();const w=new g.BufferGeometry;w.setAttribute("position",new g.BufferAttribute(o,3)),w.setAttribute("color",new g.BufferAttribute(c,3)),w.setIndex(u),w.computeVertexNormals();const M=new g.Mesh(w,at);M.frustumCulled=!1,M.name="valley",t0.add(M)}await k.yield();{const e=new g.PlaneGeometry(1700,3400);e.rotateX(-Math.PI/2);const n=new g.Mesh(e,e0.makeMirrorMaterial({dim:J?.5:.6,rowHeight:.011}));n.position.set(-100,P,300),n.name="river-mirror",t0.add(n)}const Z=[],E=new g.Matrix4,L0=new g.Matrix4,A=new g.Vector3,z0=new g.Vector3,q=()=>t.range(.82,1.18),a0=(e,n,r,i,o,c,u,x,l,m,p=0,y=0,f=0)=>{A.set(r,i,o).applyMatrix4(n),z0.set(r+c,i+u,o+x).applyMatrix4(n).sub(A),e.add(0,A.x,A.y,A.z,z0.x,z0.y,z0.z,l,m,p,t(),f,0,1,0,y,p>0?1:q())},bt=m0(),B0=[v(a.vir,a.cer,.04,.72),v(a.vir,a.cyp,.5,.85),v(a.cyp,a.ultra,.15,.75),v(a.vir,a.cobalt,.3,.55),$.clone().multiplyScalar(.42)],_t=v(a.cyp,a.vir,.15,.7);function U0(e,n,r,i,o,c){const u=_(e,n)-.6,x=t.sign(),l=new g.ConeGeometry(i*.78,r*.96,10,8),m=l.getAttribute("position"),p=(.03+O.w*.16)*r;for(let y=0;y<m.count;y++){const f=m.getY(y)/r+.5;m.setX(y,m.getX(y)+O.x*p*f*f),m.setZ(y,m.getZ(y)+O.y*p*f*f)}l.computeVertexNormals(),Z.push(Q(l,_t,E.makeTranslation(e,u+r*.48,n)));for(let y=0;y<o;y++){const f=t(),h=f<.2?B0[0]:f<.52?B0[1]:f<.83?B0[2]:f<.94?B0[3]:B0[4];bt.add(2,e,u,n,t.range(0,K),t(),r,c*t.range(.2,.36),h,0,t(),i,c*t.range(.7,1.5),t.range(.82,1.08),x,0,q())}}U0(-5,1150,35,5.2,Math.round(5200*H),1),U0(-16,1126,28,4.3,Math.round(2400*H),.95),U0(-9.5,1101,22,3.4,Math.round(1700*H),.9),await k.yield();const G0=m0();{const e=Math.round(3e4*X),n=x0?[v(y0,a.cer,.3,.7),v(y0,a.cobalt,.4,.55),j.clone().multiplyScalar(.8),v(a.cobalt,a.vir,.5,.8)]:[a.yel.clone().multiplyScalar(.62),$.clone().multiplyScalar(.85),$.clone().multiplyScalar(.5),v(a.yel,j,.4,.7)],r=v(a.cobalt,a.vir,.4,.5);let i=0;for(let c=0;c<e*3&&i<e;c++){c%500===499&&await k.yield();const u=t.range(724,1094),l=t.chance(.75)?tt(u)+t.gauss()*26:t.range(-190,190);if(Math.abs(l)>190||b0(l,u)<54)continue;const m=_(l,u)-.25,p=x0?t.range(.4,.8):t.range(.9,1.6),y=t(),f=y<.45?n[0]:y<.75?n[1]:y<.9?n[2]:n[3];if(x0&&c%5!==0){const h=t.range(.8,1.7),s=t.range(-.12,.12);G0.add(0,l,m+.55,u,(O.x-O.y*s)*h,t.range(-.04,.04)*h,(O.y+O.x*s)*h,t.range(.2,.36),y>.86?r:f,0,t(),.3,0,1,0,0,q()),i++;continue}G0.add(1,l,m,u,t.range(-.15,.15)*p,p,t.range(-.15,.15)*p,t.range(.08,.135),f,0,t(),0,0,1,0,0,q()),i++}const o=Math.round((pt?1100:520)*X);for(let c=0;c<o;c++){const u=t.range(730,1090),x=tt(u)+t.gauss()*40;Math.abs(x)>180||b0(x,u)<54||G0.add(1,x,_(x,u)+.35,u,0,t.range(.45,.7),0,t.range(.14,.2),a.org,.15,t(),0,0,1,0,0,q())}}await k.yield();const n0=m0(),zt=m0(),Z0=[v(a.ultra,a.cyp,.3,1.9),a.cobalt.clone().multiplyScalar(.5),v(a.vir,a.ultra,.4,1.3),v(a.ultra,a.cobalt,.3,1.5)],kt=x0?[y0.clone().multiplyScalar(.75),v(y0,a.cer,.4,.6),j.clone().multiplyScalar(.7)]:[a.cobalt.clone().multiplyScalar(.95),v(a.cobalt,a.cer,.35,.7),v(a.ultra,a.cobalt,.5,1.7)],K0=v(a.ultra,a.cyp,.3,1.25),nt=x0?v(y0,a.cobalt,.4,.45):a.cobalt.clone().multiplyScalar(.55),qt=v(a.cer,a.cobalt,.35,.5),Lt=D==="dusk"?.5:D==="dawn"?.32:.72;let Ct=5,Pt=0;const St=(e,n,r)=>{const i=new g.BoxGeometry(e,n,r),o=i.getAttribute("position");for(let c=0;c<o.count;c++)o.getY(c)>0&&o.setX(c,o.getX(c)*.03);return i.computeVertexNormals(),i};function ot(e,n,r,i,o,c,u=0){for(let x=0;x<o;x++){const l=t.int(0,3),m=t.range(.6,1.3),p=u+t.range(m*.6,Math.max(m,r-m*.6)),y=t.pick(c),f=t.range(-.25,.25)*m;l<2?a0(n0,e,(l?1:-1)*(n/2+.12),p,t.range(-i/2,i/2),0,m,f,t.range(.24,.38),y):a0(n0,e,t.range(-n/2,n/2),p,(l===2?1:-1)*(i/2+.12),f,m,0,t.range(.24,.38),y)}}function Ut(e,n,r){const i=_(e,n)-.4,o=t.range(6,8.5),c=t.range(6,9.5);let u=t.range(4,7),x=t.range(2.4,4);const l=w0.nearestXZ(e,n);if(l.dist<18&&(u=Math.min(u,l.y-7.5-i-x)),u<2.5)return;const m=new g.Matrix4().makeTranslation(e,i,n).multiply(E.makeRotationY(t.range(-.16,.16)+(t.chance(.3)?Math.PI/2:0))).multiply(L0.makeShear(0,0,t.range(-.09,.09),t.range(-.07,.07),0,0));Z.push(Q(new g.BoxGeometry(o,u,c),K0,E.copy(m).multiply(L0.makeTranslation(0,u/2,0)))),Z.push(Q(St(o*1.12,x,c*1.06),nt,E.copy(m).multiply(L0.makeTranslation(0,u+x/2,0)))),ot(m,o,u,c,22,Z0);for(let y=0;y<18;y++){const f=t.sign(),h=t.range(.12,.8),s=t.range(.7,1.2),d=Math.hypot(o*.56,x),w=-f*o*.56/d,M=x/d;a0(n0,m,f*o*.56*(1-h)+f*.1,u+x*h+.14,t.range(-c/2,c/2),w*s,M*s,t.range(-.2,.2),t.range(.26,.4),t.pick(kt))}const p=t.int(2,3);for(let y=0;y<p;y++){const f=t.chance(Lt);let h=0;Ct>0&&t.chance(.09)&&(h=(f?-1:1)*t.range(.3,.8),Ct--);const s=f||h>0?t.range(2,3.4):0,d=s>0?a.org:Z0[1],w=t.chance(.6)?0:t.int(1,2),M=t.range(1.6,Math.max(1.7,u-1.2));w===0?a0(n0,m,-r*(o/2+.22),M,t.range(-c/2+1,c/2-1),0,.5,0,.3,d,s,h):a0(n0,m,t.range(-o/2+1,o/2-1),M,(w===1?1:-1)*(c/2+.22),0,.5,0,.3,d,s,h)}if(Pt<25&&t.chance(.5)){Pt++;const y=t.range(-o*.3,o*.3),f=t.range(-c*.3,c*.3),h=u+x+.8;Z.push(Q(new g.BoxGeometry(.9,2.4,.9),K0,E.copy(m).multiply(L0.makeTranslation(y,h-1.2,f)))),A.set(y,h,f).applyMatrix4(m);const s=t.range(26,40),d=t();for(let w=0;w<12;w++)zt.add(4,A.x,A.y,A.z,d+w/12,t(),s,t.range(.2,.34),qt,0,t(),0,0,1,0,0,q())}}const B={x:-64,z:640};for(let e=0;e<20;e++){const n=692-e*16.6+t.range(-2,2);for(const[r,i]of[[-t.range(52,57),-1],[-t.range(70,82),-1],[t.range(52,57),1]])Math.hypot(r-B.x,n-B.z)<19||Ut(r,n,i);e%7===6&&await k.yield()}{const e=_(B.x,B.z)-.4,n=new g.Matrix4().makeTranslation(B.x,e,B.z);Z.push(Q(new g.BoxGeometry(11,9,22),K0,E.makeTranslation(B.x,e+4.5,B.z+6))),Z.push(Q(St(12,5.5,23),nt,E.makeTranslation(B.x,e+11.7,B.z+6))),Z.push(Q(new g.BoxGeometry(7,17,7),K0,E.makeTranslation(B.x,e+8.5,B.z-8))),Z.push(Q(new g.ConeGeometry(4.3,29,4,1).rotateY(Math.PI/4),nt,E.makeTranslation(B.x,e+31.5,B.z-8))),ot(E.makeTranslation(B.x,e,B.z+6),11,9,22,70,Z0),ot(E.makeTranslation(B.x,e,B.z-8),7,17,7,70,Z0);for(let r=0;r<110;r++){const i=t.range(.02,.9),o=t.int(0,3)*Math.PI/2+t.range(-.6,.6),c=3.3*(1-i)+.15;a0(n0,n,Math.cos(o)*c,17+29*i,-8+Math.sin(o)*c,-Math.cos(o)*.12,t.range(.8,1.5),-Math.sin(o)*.12,t.range(.22,.36),t.pick(kt))}for(let r=0;r<5;r++)a0(n0,n,5.75,t.range(3,6.5),-1+r*4,0,1.1,0,.36,a.org,D==="dawn"&&r>1?0:2.4);a0(n0,n,3.75,13,-8,0,.8,0,.4,a.yel,2.6);for(let r=0;r<7;r++){const i=t.range(0,K),o=t.range(17,30),c=r<5?B.x+Math.cos(i)*o-8:t.range(60,80),u=r<5?B.z+Math.sin(i)*o:t.range(400,660);w0.nearestXZ(c,u).dist>14&&b0(c,u)>52&&U0(c,u,t.range(12,19),t.range(1.7,2.3),Math.round(260*H),1.15)}}await k.yield();const E0=m0(),Zt=v(a.ultra,a.cyp,.5,1.6),Kt=v(j,a.yel,.3,.9);function At(e,n,r,i,o,c=4.2){const u=n+c;E0.add(0,e,n+c/2,r,0,c/2,0,.11,Zt,0,t(),0,0,1,0,0,1),E0.add(0,e,u+.3,r,0,.36,0,.3,J0,5.2,t(),0,0,1,0,o,1);const x=J?14:t.int(8,12);for(let l=0;l<x;l++)E0.add(5,i,P+.07,r,(l+t.range(-.3,.3))/x,t.range(.45,1.15),u-P,t.range(.28,.4),J0,J?t.range(.9,1.5):t.range(1.1,2),t(),J?18:12.5,0,1,0,o,1);for(let l=0;l<6;l++)A.set(t.gauss(),t.gauss(),t.gauss()).normalize(),E0.add(3,e,u+.3,r,t.range(0,K),t.range(.5,.95),.22,.06,Kt,.9,t(),t.sign()*t.range(3,6),A.x,A.y,A.z,o,1)}for(let e=0;e<11;e++)for(const n of[-1,1]){const r=690-e*30,i=n*48.2;let o=0;D==="dawn"?o=-t.range(.18,.9):d0&&n<0&&(o=.3+.5*(e+.5)/11),At(i,_(i,r)-.2,r,n*45.2,o)}const l0=353,Y0=P+17,O0=e=>Y0-7+6.5*(1-e/68*(e/68));{const e=new g.Shape;e.moveTo(-68,P-3),e.lineTo(68,P-3),e.lineTo(68,Y0-6.1),e.quadraticCurveTo(0,Y0+6.9,-68,Y0-6.1),e.closePath();const n=(m,p)=>{const y=new g.Path;return y.moveTo(m-p,P-2.5),y.lineTo(m-p,P+1),y.absarc(m,P+1,p,Math.PI,0,!0),y.lineTo(m+p,P-2.5),y.closePath(),y},r=[[0,13],[-30.5,9.5],[30.5,9.5]];for(const[m,p]of r)e.holes.push(n(m,p));const i=new g.ExtrudeGeometry(e,{depth:7,bevelEnabled:!1,curveSegments:12}),o=new g.Color("#2C3760"),c=new g.Color("#222A4C");Z.push(Q(i,o,E.makeTranslation(0,0,l0-3.5)));for(const m of[-42.5,-17,17,42.5])for(const p of[-1,1]){const y=new g.CylinderGeometry(.9,2.7,13,4,1);y.rotateY(Math.PI/4),Z.push(Q(y,c,E.makeTranslation(m,P+3.5,l0+p*3.6)));for(let f=0;f<16;f++){const h=t(),s=N(2.7,.9,(3.3+9*h)/13),d=s*t.range(-.8,.8);n0.add(0,m+d,P+.3+h*9,l0+p*(3.72+s-Math.abs(d)),t.range(-.1,.1),t.range(.6,1.1),0,t.range(.3,.45),t.chance(.3)?v(a.cobalt,a.cer,.3,.75):v(a.ultra,a.cobalt,.4,1.3),0,t(),0,0,1,0,0,q())}}const u=[a.cobalt.clone().multiplyScalar(.55),v(a.ultra,a.cer,.15,1.9),v(a.cer,a.vir,.4,.36),$.clone().multiplyScalar(.3),v(a.ultra,a.cobalt,.5,1.4),v(a.cobalt,a.vir,.4,.7)],x=[v(a.cobalt,a.cer,.45,.85),v(a.cobalt,a.cer,.2,.8),v(a.cer,j,.2,.6),$.clone().multiplyScalar(.45)],l=(m,p)=>Math.hypot(m,p-P-1)<14.6||Math.hypot(Math.abs(m)-30.5,p-P-1)<11.1||(Math.abs(m)<13.6||Math.abs(Math.abs(m)-30.5)<10.1)&&p<P+1;for(let m=0;m<2300;m++){const p=t.range(-66,66),y=N(P,O0(p)+.7,Math.sqrt(t())),f=t.sign();if(l(p,y))continue;const h=Math.abs(p)<21?0:Math.sign(p)*30.5,s=p-h,d=Math.max(.5,y-P-1),w=Math.hypot(s,d),M=t.range(.7,1.4),b=O0(p)-y<1.6,z=!b&&w<20;n0.add(0,p,y,l0+f*3.62,z?d/w*M:M,z?-s/w*M:b?-p*.0028*M:t.range(-.1,.1),0,t.range(.35,.55),b?t.pick(x):t.pick(u),0,t(),0,0,1,0,0,q())}for(const[m,p]of r){const y=Math.round(60*p/13);for(const h of[-1,1])for(let s=0;s<y;s++){const d=(s+t.range(.2,.8))/y*Math.PI,w=Math.cos(d),M=Math.sin(d),b=p+.75;n0.add(0,m+w*b,P+1+M*b,l0+h*3.68,w*.72,M*.72,0,t.range(.3,.42),t.pick(x),0,t(),0,0,1,0,0,q())}const f=Math.round(95*p/13);for(let h=0;h<f;h++){const s=t.range(.12,Math.PI-.12),d=Math.cos(s),w=Math.sin(s),M=p-.14,b=t.chance(.5),z=t.range(.7,1.2);n0.add(0,m+d*M,P+1+w*M,l0+t.range(-2.6,2.6),b?0:-w*z,b?0:d*z,b?z:0,t.range(.34,.5),t.chance(.25)?t.pick(x):t.pick(u),0,t(),0,0,1,0,0,q())}}for(const m of[-52,-22,22,52])for(const p of[-1,1])(m>0==p>0||Math.abs(m)<30)&&At(m,O0(m)+.7,l0+p*3.2,m,0,2.6)}await k.yield();const A0=new g.Group;A0.name="fleet",t0.add(A0);{const e=m0(),n=[],r=v(a.ultra,a.cyp,.5,1.5),i=[v(a.ultra,a.cyp,.4,2.2),$.clone().multiplyScalar(.32),a.cobalt.clone().multiplyScalar(.45),v(a.vir,a.cyp,.5,1.8)],o=[$.clone().multiplyScalar(.9),$.clone().multiplyScalar(.6),v($,j,.4,.7)],c=Y?[[-11,487,.6],[12,468,.55],[-19,430,.55],[15,520,.5],[-12,398,.55],[22,590,.55]]:[[-12,487,1],[13,463,1]];for(const[u,x,l]of c){const m=new g.BoxGeometry(5.2*l,2.3*l,22*l,1,1,6),p=m.getAttribute("position");for(let s=0;s<p.count;s++){const d=Math.abs(p.getZ(s))/(11*l);p.setX(s,p.getX(s)*(1-.8*d*d*d)*(p.getY(s)<0?.7:1)),p.setY(s,p.getY(s)+d*d*.9*l)}m.computeVertexNormals();const y=t.range(-.08,.08),f=new g.Matrix4().makeTranslation(u,P+.75*l,x).multiply(E.makeRotationY(y));n.push(Q(m,r,f));for(let s=0;s<70;s++){const d=t.sign(),w=t.range(-9,9)*l,M=Math.abs(w)/(11*l);a0(e,f,d*(2.68*l*(1-.8*M*M*M)),t.range(-.6,1.1)*l+M*M*.9*l,w,0,t.range(-.1,.1),t.range(.7,1.4)*l,t.range(.2,.32)*Math.max(.7,l),t.pick(i))}for(let s=0;s<24;s++)a0(e,f,t.range(-1.8,1.8)*l,1.22*l,t.range(-8,8)*l,0,0,t.range(.8,1.4)*l,.3*l,t.pick(i));a0(e,f,0,6.5*l,2*l,0,5.4*l,0,.15,i[0]);for(let s=0;s<40;s++){const d=t.range(-1,1);a0(e,f,t.range(-.45,.45),(8+d*1.5+t.range(-.7,.7))*l,(2+d*5.8)*l,0,.25*l,t.range(.8,1.4)*l,t.range(.32,.5)*Math.max(.75,l),t.pick(o))}const h=Y?[[0,2.6,6]]:[[0,3,10],[0,11.6,2],[.5,2.8,-9.5]];for(const[s,d,w]of h){a0(e,f,s,d*l,w*l,0,.34,0,.3,a.org,6,0,.12),A.set(s,0,w*l).applyMatrix4(f);for(let M=0;M<8;M++)e.add(5,A.x,P+.07,A.z,(M+t.range(-.3,.3))/8,t.range(.35,.8),d*l+.8,.3,a.org,t.range(1.4,2.4),t(),7,0,1,0,0,1)}}A0.add(new g.Mesh(Bt(n),at)),A0.add(e.mesh(S0,1));for(const u of A0.children)u.frustumCulled=!1}const F0=m0();{const e=pt?[new g.Color("#F2D6DC").multiplyScalar(.85),j.clone(),new g.Color("#E8A8B8").multiplyScalar(.8),v(a.vir,j,.3,.8)]:[v(a.vir,j,.35,.95),v(a.cyp,a.vir,.4,3),v(a.vir,a.cer,.3,1.3),v(a.vir,a.yel,.2,1.1)],n=v(a.cyp,a.vir,.3,1),r=v(a.cyp,a.ultra,.3,1.6),i=Math.round(70*Math.min(1.2,X/H)),o=[];for(let h=0;h<17;h++)for(const s of[-1,1])o.push([s*t.range(13,19),296-h*17.5+t.range(-5,5)]);for(let h=0;h<900&&o.length<i+40;h++)o.push([t.gauss()*32,t.range(-30,300)]);let c=0;for(const[h,s]of o){if(c>=i)break;if(Math.abs(h)<11.5||Math.abs(h)>150||Math.hypot(h*.62,s)/330>.93||b0(h,s)<60)continue;let d=!1;for(let C=0;C<c;C++)if(Math.hypot(o[C][2]-h,o[C][3]-s)<6.5){d=!0;break}if(d)continue;o[c][2]=h,o[c][3]=s;const w=_(h,s),M=t.range(2.6,3.6),b=w+M+1.1,z=t.sign()*t.range(.5,.9);Z.push(Q(new g.IcosahedronGeometry(M*.6,1),n,E.makeTranslation(h,b,s))),F0.add(0,h+.2,w+1.1,s,t.range(-.3,.3),1.4,0,.26,r,0,t(),0,0,1,0,0,1),z0.set(t.range(-.35,.35),t.range(.2,.6),1).normalize();const S=Math.round(66*H),T=h>0?-1:1;for(let C=0;C<S;C++){const F=M*t.range(.12,1),W=M*.6*t.range(.8,1.3),L=C%3?z0.x:T*.86,U=C%3?z0.y:.36,h0=C%3?z0.z:.36;F0.add(3,h+L*W,b+U*W,s+h0*W,t.range(0,K),F,Math.min(.9,t.range(.4,.75)/F),t.range(.18,.3),t.pick(e),0,t(),z/(.6+F*.5),L,U,h0,0,q())}c++}await k.yield();const u=[v(a.vir,a.cer,.1,1.7),v(a.cyp,a.vir,.3,2.4),v(a.cyp,a.vir,.6,2),v(a.vir,a.yel,.12,1.2),v(a.vir,a.cobalt,.4,1),x0?y0.clone().multiplyScalar(.6):v(a.vir,a.ultra,.5,1.6)],x=[$.clone().multiplyScalar(.62),v(a.cer,a.cobalt,.25,.75),v(a.vir,a.yel,.35,1),x0?y0.clone().multiplyScalar(.75):$.clone().multiplyScalar(.45)],l=Math.round(7e3*X),m=Math.round(1600*X);for(let h=0;h<l+m;h++){const s=h<l,d=s?t.range(-50,325):t.range(700,1190),w=t.gauss()*(s?58:45)+(s?0:(t.chance(.5)?-150:150)*(d<1090?1:0));if(b0(w,d)<50)continue;const M=_(w,d),b=_(w+2,d)-M,z=_(w,d+2)-M;let S=-z,T=b;const C=Math.hypot(S,T);if(C<.05){const W=t.range(0,K);S=Math.cos(W),T=Math.sin(W)}else S/=C,T/=C;if(s){const W=.75*V.n2(w*.021+W0,d*.021)+.35*Math.sin(w*.07+d*.045),L=Math.cos(W),U=Math.sin(W),h0=S*L-T*U;T=S*U+T*L,S=h0}const F=s?t.range(1.4,2.6):t.range(.9,1.9);F0.add(0,w,M+.45,d,S*F,(S*b+T*z)/2*F,T*F,s?t.range(.28,.46):t.range(.22,.38),t.chance(s?.16:.05)?t.pick(x):t.pick(u),0,t(),.5,0,1,0,0,q()),h%1200===1199&&await k.yield()}const p=[v(a.ultra,a.cyp,.4,1.5),v(a.ultra,a.cobalt,.3,1.2),v(a.cyp,a.vir,.3,1.3)],y=[v(a.cer,a.vir,.45,.62),v(a.cobalt,a.cer,.4,.7),$.clone().multiplyScalar(.5)];let f=0;for(const h of[13,25,37,48,58,67]){const s=1-h/78,d=330*s,w=d/.62,M=1.9/Math.max(60,w);for(let b=.12+t()*M;b<Math.PI-.12;b+=M*t.range(.85,1.15)){const z=1+.035*Math.sin(b*9+h),S=Math.cos(b)*w*z,T=Math.sin(b)*d*z;if(Math.abs(S)>230||b0(S,T)<58)continue;if(t.chance(.12)){b+=M*t.range(1,4);continue}const C=_(S,T),F=-Math.sin(b)*w,W=Math.cos(b)*d,L=Math.hypot(F,W),U=F/L,h0=W/L,Vt=_(S+U*2,T+h0*2),R0=t.range(.85,1.2);F0.add(0,S,C+.75,T,U*R0,(Vt-C)/2*R0,h0*R0,t.range(.55,.75),t.pick(p),0,t(),0,0,1,0,0,q()),t.chance(.7)&&F0.add(0,S+U*.3,C+1.5,T+h0*.3+.12,U*R0*.8,(Vt-C)/2*R0*.8,h0*R0*.8,t.range(.2,.3),t.pick(y),0,t(),0,0,1,0,0,q()),++f%500===499&&await k.yield()}}}await k.yield();const j0=new g.Group;j0.name="sky-strokes",t0.add(j0);const I0=m0(),N0=4500,st=(e,n,r)=>{const i=e*Math.PI/180,o=n*Math.PI/180;return r.set(Math.sin(i)*Math.cos(o),Math.sin(o),-Math.cos(i)*Math.cos(o))};if(D==="dusk"){const e=t.sign()>0?95:-110,n=new g.Color("#E0604A");for(let r=0;r<380;r++){const i=e+t.gauss()*26,o=Math.pow(t(),1.6),c=7+o*15,u=i*Math.PI/180,x=t.range(90,230)*(1-.4*o);st(i,c,A).multiplyScalar(N0);const l=t.chance(.6)?a.org:t.chance(.5)?a.yel:n;I0.add(0,A.x,A.y,A.z,Math.cos(u)*x,t.range(-.12,.12)*x,Math.sin(u)*x,t.range(16,30),l,(1.5-o)*t.range(.7,1.2),t(),6,0,1,0,0,1)}}if(D==="dawn"){const e=v(a.yel,new g.Color("#9CCB4A"),.55);for(let o=0;o<320;o++){const c=t.gauss()*55,u=Math.pow(t(),1.5),x=1.5+u*9.5,l=c*Math.PI/180,m=t.range(90,220);st(c,x,A).multiplyScalar(N0),I0.add(0,A.x,A.y,A.z,Math.cos(l)*m,t.range(-.1,.1)*m,Math.sin(l)*m,t.range(15,28),t.chance(.7)?e:a.yel,(1.25-u)*t.range(.4,.65),t(),6,0,1,0,0,1)}st(t.sign()*t.range(26,36),t.range(27,33),A);const n=A.x*N0,r=A.y*N0,i=A.z*N0;for(let o=0;o<4;o++){const c=12+6*o,u=N0*(1.7+1.5*o)*Math.PI/180,x=(o%2?-1:1)*.42/(1+.3*o);for(let l=0;l<c;l++)I0.add(3,n,r,i,l/c*K+t.range(-.1,.1),u*t.range(.94,1.06),.55*Math.PI/c,t.range(20,30),(o+l)%3?a.yel:j,2.8-.5*o,t(),x,-A.x,-A.y,-A.z,0,1)}for(let o=0;o<6;o++){const c=o/6*Math.PI;I0.add(0,n,r,i,Math.cos(c)*75,Math.sin(c)*75,0,34,o%2?j:a.yel,5,t(),0,0,1,0,0,1)}}if(I0.count){const e=I0.mesh(wt,1);e.renderOrder=-.5,j0.add(e)}const H0=m0();if(J){const e=v(a.cer,j,.5,.5);for(let n=0;n<Math.round(1500*H);n++)H0.add(6,t.range(0,140),t.range(0,90),t.range(0,140),t.range(26,38),t.range(1.2,2.3),.4,.035,e,0,t(),0,0,1,0,0,q())}if(v0){for(let e=0;e<620;e++)H0.add(6,t.range(0,140),t.range(0,90),t.range(0,140),t.range(8,14),t.range(.5,.9),.15,.3,a.yel,3.4,t(),1,0,1,0,0,1);for(let e=0;e<64;e++){const n=t.range(372,624),r=tt(n)+t.range(-25,25),i=t(),o=t.range(5,9),c=t.range(0,K);for(let u=0;u<12;u++)H0.add(7,r,P+.12,n,c+u/12*K,i,o,.35,u%4===3?j:a.yel,3,t(),0,0,1,0,0,1)}}const u0=m0(),rt=90,Yt=v(a.ultra,a.cyp,.5,c0?.2:.12),Ot=v(a.cer,a.cobalt,.35,c0?.5:.42),jt=v(a.ultra,a.cyp,.5,1.3);for(let e=0;e<rt;e++){for(let n=0;n<2;n++)u0.add(0,0,-500,0,0,.1,0,c0?.13:.2,Yt,0,t(),0,0,1,0,0,1);u0.add(0,0,-500,0,0,.1,0,.08,Ot,0,t(),0,0,1,0,0,1)}const $t=new g.Color(.6,.64,.62),it=u0.count;for(let e=0;e<4;e++)u0.add(0,0,-500,0,0,.1,0,e===0?.24:e===3?.13:.4,$t,.22,t(),0,0,1,0,0,1);const k0=u0.count;for(let e=0;e<3;e++)u0.add(0,0,-500,0,0,.1,0,e===2?.4:.9,jt,0,t(),0,0,1,0,0,1);u0.add(0,0,-500,0,0,.3,0,.36,J0,7,.5,0,0,1,0,0,1);const Qt=u0.count;for(let e=0;e<4;e++)u0.add(0,0,-500,0,0,1,0,1.5,v(j,$,.4,.6),0,t(),0,0,1,0,0,1);const ct=u0.mesh(S0,1,!0),Tt=ct.geometry.getAttribute("aP"),Dt=ct.geometry.getAttribute("aD"),G=(e,n,r,i,o,c,u,x)=>{const l=Tt.array,m=Dt.array,p=e*4;l[p]=n,l[p+1]=r,l[p+2]=i,m[p]=o,m[p+1]=c,m[p+2]=u,x!==void 0&&(m[p+3]=x)},Wt=.3,Ft=.028;let X0=o0.stars.filter(e=>e.dir[1]>.2&&e.dir[1]<.75&&e.dir[2]<-.25);X0.length<2&&(X0=o0.stars.filter(e=>e.dir[1]>.22&&e.dir[2]<.35)),X0.length<2&&(X0=o0.stars);const Jt=X0.map(e=>{const n=new g.Vector3(...e.dir),r=new g.Vector3(0,1,0).cross(n).normalize(),i=n.clone().cross(r);return{s:e,d:n,e1:r,e2:i}}),It=[];for(let e=0;e<rt;e++){const n=t.range(Ft,.075),r=w0.pointAt(Wt+n,A),i=r.x+t.sign()*(2.4+Math.abs(t.gauss())*6.5),o=r.z;It.push({u0:Wt+n-Ft,hx:i,hy:_(i,o)+.4,hz:o,f:t.pick(Jt),r:t.range(7,44),a0:t.range(0,K),w:t.range(.7,1.3),f0:t(),ph:t.range(0,K),sx:t.gauss()*4,lift:t.range(2.5,11),dur:t.range(4,7),run:t.range(17,27)})}const lt=new g.Vector3(...o0.portalSeat.position),ht=new g.Vector3(...o0.portalSeat.normal),Nt=new g.Vector3(0,Math.cos(14*Math.PI/180),Math.sin(14*Math.PI/180));function Rt(e,n,r,i,o,c){const u=e.f,x=u.s,l=e.a0+x.spin*n*K/x.period*e.w*1.5,m=Math.cos(l)*e.r,p=Math.sin(l)*e.r;let y=o.x*.92+u.d.x*120+u.e1.x*m+u.e2.x*p,f=o.y+Math.max(20,u.d.y*120)+u.e1.y*m+u.e2.y*p,h=o.z*.92-10+u.d.z*120+u.e1.z*m+u.e2.z*p;if(i>0){const M=((e.f0-n*.03)%1+1)%1,b=30+430*M,z=12+30*M,S=e.a0+n*.8+M*9,T=I(.1,.9,i),C=lt.x+ht.x*b+Math.cos(S)*z,F=lt.y+ht.y*b+Nt.y*Math.sin(S)*z,W=lt.z+ht.z*b+Nt.z*Math.sin(S)*z;y=N(y,C,T),f=N(f,F,T),h=N(h,W,T)}const s=I(.9,e.dur,r),d=I(0,.8,r)*(1-s),w=e.run*r*(1-s);return c.set(N(e.hx-w*.12,y,s)+e.sx*d*Math.min(1,r*.6),N(e.hy,f,s)+e.lift*d+Math.sin(r*5+e.ph)*.5*d,N(e.hz-w,h,s))}const s0={x:565,z:640};s0.y=_(s0.x,s0.z),Z.push(Q(new g.CylinderGeometry(2.6,4.4,18,8),v(a.cobalt,a.cer,.35,.6),E.makeTranslation(s0.x,s0.y+9,s0.z))),Z.push(Q(new g.ConeGeometry(3.4,4.5,8),v(a.ultra,a.cobalt,.4,1.4),E.makeTranslation(s0.x,s0.y+20.2,s0.z)));const _0={x:-24,z:556,y:P};{const e=[v(a.vir,a.yel,.25,1.1),$.clone().multiplyScalar(.55),v(a.cyp,a.vir,.5,1.6),v(a.vir,a.cer,.2,1.2)];for(let n=0;n<90;n++){const r=t.range(0,K),i=1.2+Math.abs(t.gauss())*2.6,o=t.range(1,2.3);G0.add(1,_0.x+Math.cos(r)*i*1.5,P-.1,_0.z+Math.sin(r)*i,t.range(-.2,.2)*o,o,t.range(-.2,.2)*o,t.range(.07,.11),t.pick(e),0,t(),0,0,1,0,0,q())}}const dt=new g.Mesh(Bt(Z),at);dt.frustumCulled=!1,dt.name="painted-bases",t0.add(dt);for(const e of Z)e.dispose();await k.yield(),t0.add(bt.mesh(S0,4),G0.mesh(xt,1),n0.mesh(S0,1),zt.mesh(S0,4),E0.mesh(S0,1),F0.mesh(S0,1),ct),H0.count&&t0.add(H0.mesh(xt,1)),await k.yield();const te=new g.Vector3(o0.wheelDir[0],o0.wheelDir[1]*.5,o0.wheelDir[2]).normalize(),ee=new g.Vector3,ft=new g.Vector3,T0=new g.Vector3,r0=new g.Vector3,g0=new g.Vector3,ae=[{at:(e,n)=>(w0.pointAt(n,ft),ft.set(-5,ft.y+3,1150)),from:.01,to:.046,weight:.8},{at:(e,n)=>w0.pointAt(n,ee).addScaledVector(te,600),from:.06,to:.28,weight:.85},{at:[-30,-66,520],from:.32,to:.47,weight:.3}],ne=(e,n,r,i)=>I(n,n+i,e)*(1-I(r-i,r,e)),ut=(e,n,r)=>Math.min(r,Math.max(n,e));return{scene:t0,path:w0,duration:q0,pace:e=>.42+.72*I(.02,.1,e)-.14*I(.72,.9,e),title:D==="dawn"?"The Turning Night, before dawn":D==="dusk"?"The Turning Night, last of dusk":"The Turning Night",ride:"none",style:"none",camera:{fov:62,near:.5,far:6500,lookAhead:28,sway:.6,bank:.8},pois:ae,portal:{shape:"circle",radius:7,color:"#F6D54A",glow:1,tilt:!0,revealDistance:320},post:{exposure:D==="dawn"?1:1.12,bloom:{strength:.4,radius:.55,threshold:.95},grade:{saturation:1.1,contrast:1.05,tint:"#fff3dc",shadowTint:"#050a24",vignette:.36,grain:.035,aberration:0}},update(e,n,r,i){T0.setFromMatrixPosition(r.matrixWorld),T0.lengthSq()===0&&T0.copy(r.position);const o=(1-i)*Ht,c=I(.7,.93,i),u=v0?ne(i,.46,.72,.05):0,x=ut((i-.7)/.23,0,1),l=(.23*(x*x*x-.5*x*x*x*x)+Math.max(0,i-.93))*q0;e0.setDrain(c,l),e0.setArrive(I(175,18,o)),v0&&(e0.setSync(u),e0.uniforms.uBump.value=.85+.5*u),e0.update(e,n*$0+(v0?9*I(.46,.72,i):0),r),k.renderer.getDrawingBufferSize(yt),P0.uWeave.value=1.5708*Math.min(1,1080/Math.max(1,yt.y)),P0.uTime.value=n,P0.uDrain.value=c,P0.uSwitch.value=i,P0.uRare.value=u,j0.position.copy(T0),A0.position.set(0,Math.sin(n*.7)*.1,-30+60*i),A0.rotation.z=Math.sin(n*.45)*.008;const m=c0?5:3,p=c0?.75:.9,y=c0?.13:.2;for(let f=0;f<rt;f++){const h=It[f],s=(i-h.u0)*q0,d=f*3;if(s<=0){G(d,0,-500,0,0,.1,0),G(d+1,0,-500,0,0,.1,0),G(d+2,0,-500,0,0,.1,0);continue}Rt(h,n,s,c,T0,r0),Rt(h,n+.08,s+.08,c,T0,g0),g0.sub(r0);const w=Math.hypot(g0.x,g0.z)||1,M=-g0.z/w,b=g0.x/w,z=g0.length()||1,S=r0.distanceTo(T0),T=Math.max(p,S*.02),C=Math.max(y,S*.004),F=Math.sin(n*K*m+h.ph)*.9,W=Math.cos(F)*T,L=Math.sin(F)*T;G(d,r0.x+M*W*.5,r0.y+L*.5,r0.z+b*W*.5,M*W*.5,L*.5,b*W*.5,C),G(d+1,r0.x-M*W*.5,r0.y+L*.5,r0.z-b*W*.5,-M*W*.5,L*.5,-b*W*.5,C);const U=T*.42/z;G(d+2,r0.x,r0.y+C*.35,r0.z,g0.x*U,g0.y*U,g0.z*U,C*.5)}{const f=Math.max(0,(i-.44)*q0),h=f*f/(f+1.5),s=I(0,1.2,f),d=_0.x+h*2.2,w=_0.y+1+h*1.6,M=_0.z-h*12;G(it,d,w+.3,M,N(.1,.15,s),N(.8,.1,s),N(0,-.8,s)),G(it+3,d+N(.15,.2,s),w+N(1.35,.45,s),M-N(.1,1.15,s),N(.1,.05,s),N(.45,.08,s),N(-.15,-.45,s));const b=Math.sin(n*K*1.3)*.75*s,z=N(.1,3.2,s);for(const S of[-1,1])G(it+(S>0?1:2),d+S*Math.cos(b)*z*.5*s,w+.35+Math.sin(b)*z*.5,M,S*Math.cos(b)*z*.5+(1-s)*.02,Math.sin(b)*z*.5+(1-s)*.3,0)}if(d0){const f=N(690,390,ut((i-.3)/.5,0,1)),h=-46.9,s=_(h,f,!1)+1.2,d=Math.abs(Math.sin(n*5))*.1;G(k0,h,s+d,f,0,1.15,.12,.42),G(k0+1,0,-500,0,0,.1,0,.4),G(k0+2,h,s+3,f-.6,0,2.1,-.6,.14),G(k0+3,h,s+5.3+d,f-1.25,0,.36,0,.34)}else{const f=ut((i-.67)*110,-60,60),h=O0(f)+.9,s=Math.sin(n*6)*.1,d=Math.sin(n*2.2);G(k0,f+4.7,h+2.3+s,l0,2.3,.27,0,.9),G(k0+1,f-2.9,h+2,l0,2.9,0,0,.9),G(k0+2,f+7.4,h+4+s,l0,.63,1.1,0,.4),G(k0+3,f+.7,h+5.1+d*.15,l0+d*.4,0,.42,0,.36)}for(let f=0;f<4;f++){const h=n*K/8*(f0?1.6:1)+f*Math.PI/2,s=Math.cos(h),d=Math.sin(h);G(Qt+f,s0.x-4.6,s0.y+17+s*8,s0.z+d*8,0,s*7.5,d*7.5)}Tt.needsUpdate=!0,Dt.needsUpdate=!0},dispose(){e0.dispose()}}}};export{me as default};
