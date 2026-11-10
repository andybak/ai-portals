import*as n from"three";import{clamp as Ae,lerp as ne,smoothstep as Y,makeRng as ut}from"../kit/core.js";const Mt=["#0B3C9C","#8DF3D6","#17B093","#F6FCF8","#D9AF98","#0C5078","#FF7B2E"],pt=30,Ge=`
uniform float uTime;
uniform vec3 uSunDir, uSunColor, uSkyLight, uDeepLight;
uniform vec3 uHazeCol, uHazeDeep, uCamLocal;
uniform float uHaze, uSurfaceY;
uniform float uFootK;   // 0..1: how far the foot of the reef is tied to a tone below the water's own (the high-sun looks)
// crawling caustic net: bright thin lines where three warped sine fields cancel
float swCaustic(vec2 p, float t){
  float w = sin(p.x * 1.1 + sin(p.y * 0.9 + t) * 1.3 + t * 0.7)
          + sin(p.y * 1.3 - sin(p.x * 0.8 - t * 0.8) * 1.2 + t * 0.5)
          + sin((p.x + p.y) * 0.8 + sin((p.x - p.y) * 0.7 + t * 0.6));
  float c = 1.0 - min(abs(w) * 0.42, 1.0);
  c = c * c; c = c * c;
  return c * c;
}
float swCaustics(vec3 lp, float t){
  // projected along the (steep) sun direction so the net slides coherently over bodies
  vec2 p = lp.xz - uSunDir.xz * (lp.y / max(uSunDir.y, 0.2));
  float c = swCaustic(p * 0.85, t * 1.3) + 0.6 * swCaustic(p * 1.9 + 7.3, t * 1.7 + 2.0);
  // strongest near the surface, gone 18 m down
  return c * smoothstep(uSurfaceY - 22.0, uSurfaceY - 6.0, lp.y);
}
// sun shafts as they land: slow pools of light some fifteen metres across, wandering down-sun, 0 between shafts .. 1 inside one
// (the sharks, the sand and the reef all read the same field, so a shaft rakes across backs and floor together)
float swShaft(vec3 lp, float t){
  vec2 p = lp.xz - uSunDir.xz * (lp.y / max(uSunDir.y, 0.2));
  float a = sin(p.x * 0.23 + 1.7 * sin(p.y * 0.11 + t * 0.13) + t * 0.21) * sin(p.y * 0.19 - 1.3 * sin(p.x * 0.09 - t * 0.11) + t * 0.17);
  return smoothstep(0.08, 0.7, a);
}
// colour of open water in a direction (the dome shows it, the haze fades to it)
vec3 swWater(vec3 dir){
  float h = dir.y;
  vec3 col = mix(uHazeCol, uHazeDeep, (1.0 - smoothstep(-0.75, 0.08, h)));
  col = mix(col, uHazeCol * 1.55 + uSkyLight * 0.10, smoothstep(0.05, 0.8, h));
  return col;
}
vec3 swHaze(vec3 col, vec3 lp){
  vec3 d = lp - uCamLocal;
  float dist = length(d);
  float f = 1.0 - exp(-uHaze * uHaze * dist * dist);
  return mix(col, swWater(d / max(dist, 1e-3)), f);
}
// daylight thins with depth: 1 at the surface, ~0.43 on the floor 30 m down
float swDepth(float y){ return exp(-max(uSurfaceY - y, 0.0) * 0.028); }
float swHash(vec3 p){ p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float swNoise(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(swHash(i), swHash(i + vec3(1,0,0)), f.x), mix(swHash(i + vec3(0,1,0)), swHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(swHash(i + vec3(0,0,1)), swHash(i + vec3(1,0,1)), f.x), mix(swHash(i + vec3(0,1,1)), swHash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
`,he=[[.487,.011,-.007,.02],[.462,.025,-.015,.039],[.425,.04,-.026,.053],[.365,.055,-.043,.064],[.29,.067,-.057,.07],[.205,.076,-.066,.072],[.11,.08,-.07,.07],[.01,.076,-.066,.062],[-.09,.066,-.056,.05],[-.19,.052,-.043,.036],[-.275,.038,-.029,.024],[-.34,.027,-.018,.016],[-.388,.021,-.013,.01]],je=h=>{let i=0;for(;i<he.length-2&&he[i+1][0]>h;)i++;const o=he[i],y=he[i+1],l=Ae((o[0]-h)/(o[0]-y[0]),0,1);return[ne(o[1],y[1],l),ne(o[2],y[2],l),ne(o[3],y[3],l)]},Ct=h=>{let i=0;for(;i<he.length-2&&he[i+1][0]>h;)i++;const o=he[Math.max(0,i-1)],y=he[i],l=he[i+1],N=he[Math.min(he.length-1,i+2)],m=Ae((y[0]-h)/(y[0]-l[0]),0,1),b=A=>{const k=o[A],T=y[A],q=l[A],V=N[A];return .5*(2*T+(q-k)*m+(2*k-5*T+4*q-V)*m*m+(3*T-3*q+V-k)*m*m*m)};return[b(1),b(2),Math.max(.004,b(3))]};function ft(h){const i=h!==1,o=h===2,y=o?12:i?10:6,l=o?he.flatMap((t,r)=>r<8?[t[0],(t[0]+he[r+1][0])*.5]:[t[0]]):i?he.map(t=>t[0]):[.47,.4,.29,.13,-.06,-.24,-.388],N=[],m=[],b=[],A=(t,r,v,z=0,P=0,F=0)=>(N.push(t,r,v),m.push(z,P,F),N.length/3-1),k=[];for(const t of l){const[r,v,z]=o?Ct(t):je(t),P=ne(v,r,.42),F=[];for(let _=0;_<y;_++){const w=_/y*Math.PI*2,le=Math.cos(w),H=Math.sin(w),W=z*Math.sign(H)*Math.pow(Math.abs(H),.82),se=le>0?P+(r-P)*Math.pow(le,.9):P-(P-v)*Math.pow(-le,.72);F.push(A(W,se,t))}k.push(F)}const T=A(0,.001,.5),q=k.length,V=l[q-1],[M,O]=je(V),ae=A(0,(M+O)*.5,V-.012);for(let t=0;t<y;t++){const r=(t+1)%y;b.push(k[0][t],k[0][r],T,k[q-1][r],k[q-1][t],ae)}for(let t=0;t<q-1;t++)for(let r=0;r<y;r++){const v=(r+1)%y,z=k[t][r],P=k[t][v],F=k[t+1][v],_=k[t+1][r];b.push(z,_,F,z,F,P)}const X=(t,r,v,z=!1)=>{const P=t.length,F=[],_=[];for(let w=0;w<P;w++){const le=w/(P-1);F.push(A(t[w][0],t[w][1],t[w][2],v,0,le)),_.push(A(r[w][0],r[w][1],r[w][2],v,1,le))}for(let w=0;w<P-1;w++)z?b.push(F[w],F[w+1],_[w+1],F[w],_[w+1],_[w]):b.push(F[w],_[w+1],F[w+1],F[w],_[w],_[w+1])},$=t=>i?t:[t[0],t[t.length>>1],t[t.length-1]],D=t=>je(t)[0],R=t=>je(t)[1],te=[[.15,D(.15)-.006],[.118,D(.12)+.04],[.09,D(.09)+.072],[.064,D(.06)+.094],[.04,D(.04)+.103]],j=[[.012,D(.01)+.004],[.036,D(.04)+.028],[.04,D(.04)+.058],[.036,D(.04)+.086],[.03,D(.03)+.1]];for(const t of i?[-1,1]:[0]){const r=[.0075,.006,.0045,.003,8e-4];X($(te.map((v,z)=>[t*r[z],v[1],v[0]])),$(j.map(v=>[0,v[1],v[0]])),1,t<0)}X([[0,D(-.215)-.004,-.205],[0,D(-.24)+.026,-.243]],[[0,D(-.262)-.002,-.262],[0,D(-.27)+.008,-.278]],4),X([[0,R(-.22)+.004,-.215],[0,R(-.25)-.026,-.252]],[[0,R(-.268)+.002,-.268],[0,R(-.28)-.007,-.284]],4,!0);const ve=[[-.372,.022],[-.412,.062],[-.448,.102],[-.476,.134],[-.498,.158]],ye=[[-.418,.006],[-.44,.044],[-.462,.086],[-.486,.116],[-.5,.14]];X($(ve.map(t=>[0,t[1],t[0]])),$(ye.map(t=>[0,t[1],t[0]])),2);const ge=[[-.372,-.013],[-.402,-.046],[-.432,-.08]],be=[[-.418,.006],[-.428,-.032],[-.444,-.074]];X(ge.map(t=>[0,t[1],t[0]]),be.map(t=>[0,t[1],t[0]]),2,!0);for(const t of[-1,1]){const r=[[.058,-.04,.24],[.098,-.058,.205],[.138,-.074,.162],[.17,-.086,.118],[.19,-.094,.078]],v=[[.06,-.044,.172],[.092,-.057,.15],[.128,-.071,.122],[.162,-.084,.096],[.186,-.093,.072]];X($(r.map(z=>[t*z[0],z[1],z[2]])),$(v.map(z=>[t*z[0],z[1],z[2]])),3,t>0),X([[t*.03,R(-.1)+.01,-.098],[t*.058,R(-.12)-.014,-.138]],[[t*.026,R(-.15)+.008,-.15],[t*.05,R(-.15)-.012,-.158]],4,t>0)}const g=new n.BufferGeometry;g.setAttribute("position",new n.Float32BufferAttribute(N,3)),g.setAttribute("aInfo",new n.Float32BufferAttribute(m,3)),g.setIndex(b),g.computeVertexNormals();const d=g.attributes.normal;let I=0;for(const t of k)for(const r of t)I+=d.getX(r)*N[r*3]+d.getY(r)*N[r*3+1];if(I<0){const t=y*6+(q-1)*y*6;for(let r=0;r<t;r+=3){const v=b[r+1];b[r+1]=b[r+2],b[r+2]=v}g.setIndex(b),g.computeVertexNormals()}return g}const Le=14,St=`
attribute vec3 aInfo;
attribute vec3 iPos;
attribute vec4 iA;   // length (m), phase, tail beat Hz, variant
attribute vec4 iB;   // yaw jitter, pitch jitter, slip period, slip phase
uniform vec3 uCamDir;
uniform vec2 uHead;   // sin, cos of the heading
uniform vec4 uSway;   // amplitude, wavenumber, omega, yaw gain
uniform float uPart;
uniform vec3 uCamFwd, uCamRt, uCamUp;   // the lens' gaze, right and up (local space)
uniform vec4 uGate;   // tan of half the horizontal / vertical field of view; the clear cone's far end: fully open at .z m, untouched beyond .w m
uniform vec4 uPacA[${Le}], uPacB[${Le}];   // the pacers (see addPacer): centre xyz + the radius the ranks keep clear of its axis (0: none); heading xyz + half length
varying vec3 vModel, vN, vLocal, vInfo;
varying vec4 vInst;
#include <fog_pars_vertex>
${Ge}
vec3 swRotY(vec3 v, float s, float c){ return vec3(v.x * c + v.z * s, v.y, -v.x * s + v.z * c); }
void main(){
  // (a quiet cheat: animals far down the corridor are drawn a third larger, so the wall reads as sharks from the bend)
  float len = iA.x * (1.0 + 0.35 * smoothstep(38.0, 100.0, length(iPos - uCamLocal))), ph = iA.y;
  vec3 fwd = vec3(uHead.x, 0.0, uHead.y), lat = vec3(uHead.y, 0.0, -uHead.x);
  // ---- where this animal hangs: shared sway, slow wander, the slip-and-recover
  float along = dot(iPos, fwd);
  float swPh = uSway.y * along + uSway.z * uTime + dot(iPos, lat) * 0.035 + iPos.y * 0.06;
  float sway = uSway.x * sin(swPh), swayYaw = uSway.w * cos(swPh);
  float sp = fract(uTime / max(iB.z, 1.0) + iB.w) * 4.0;
  float slip = smoothstep(0.0, 0.62, sp) * (1.0 - smoothstep(0.66, 1.0, sp));
  float kick = smoothstep(0.56, 0.72, sp) * (1.0 - smoothstep(0.9, 1.05, sp));
  vec3 drift = vec3(sin(uTime * 0.23 + ph * 11.0), 0.6 * sin(uTime * 0.17 + ph * 17.0), sin(uTime * 0.19 + ph * 23.0)) * 0.3;
  // a few animals (the fraction of iA.w marks them) peel off: a slow banked turn out of the rank, up and aside, and back
  // into station, the body curved into the turn; each on its own clock, so at any moment a handful are turned
  float turner = step(0.2, fract(iA.w)), tcy = fract(uTime / (17.0 + 15.0 * fract(ph * 3.7)) + fract(ph * 23.1));
  float tOn = smoothstep(0.0, 0.22, tcy) * (1.0 - smoothstep(0.50, 0.80, tcy)) * turner;
  float tOut = smoothstep(0.08, 0.5, tcy) * (1.0 - smoothstep(0.62, 1.0, tcy)) * turner;
  // (no animal within seven metres of the lens is turned: a turner straightens out and holds station as we come)
  float tFar = smoothstep(7.0, 11.0, length(iPos - uCamLocal));
  tOn *= tFar; tOut *= tFar;
  float tSg = fract(ph * 37.0) < 0.5 ? -1.0 : 1.0, tUp = fract(ph * 53.0) < 0.6 ? 1.0 : -0.7;   // (most peel up and aside, some down)
  vec3 C = iPos + lat * sway - fwd * (slip * len * 1.05) + drift + (lat * (tSg * 3.4) + vec3(0.0, 1.5 * tUp, 0.0) - fwd * 1.6) * tOut;
  // ---- the parting: a tunnel opens along the lens' line of travel and closes behind it
  vec3 rel = C - uCamLocal;
  float s = dot(rel, uCamDir);
  vec3 perp = rel - s * uCamDir;
  float d = length(perp);
  vec3 pdir = mix(lat, perp / max(d, 1e-3), step(0.05, d));
  float wAx = smoothstep(-9.0, -2.5, s) * (1.0 - smoothstep(7.0, 17.0, s)) * uPart;
  float inside = max(0.0, 1.0 - d / 2.4);
  C += pdir * (wAx * 1.6 * inside * inside);
  // the ranks give way to a pacer (a large animal holding station among them, see addPacer): whoever hangs within its
  // radius is eased off its axis, never nearer than three quarters of that radius, and settles back when it has gone
  // (a rule in space: the offset is measured from the pacer's own axis, all round it, wherever the lens is)
  for (int i = 0; i < ${Le}; i++) {
    vec3 q = C - uPacA[i].xyz; float tq = clamp(dot(q, uPacB[i].xyz), -uPacB[i].w, uPacB[i].w);
    vec3 qd = q - uPacB[i].xyz * tq; float ql = length(qd), qk = max(0.0, 1.0 - ql / max(uPacA[i].w, 1e-3));
    C += qd / max(ql, 1e-3) * (uPacA[i].w * qk * qk);
  }
  // never through the lens, whatever the heading
  float dc = length(C - uCamLocal);
  C += (C - uCamLocal) / max(dc, 1e-3) * max(0.0, 1.35 - dc) * uPart;
  // ---- the lens' clear cone: within uGate.z metres ahead no animal stands inside the picture. The frame at s metres is an
  // rounded rectangle of half axes tan * s (plus the animal's own half length and girth); whoever would be inside it swims out of
  // the frame, up or down, as the lens comes within uGate.w metres: an eased shove that covers four metres of travel, the
  // nose pitched the way it goes, a surge along its own heading and a hard tail stroke. It leaves as a shark, at its
  // full size (nothing is ever drawn small), crosses the frame's edge moving fast, holds outside while we pass and
  // settles back behind us.
  vec3 rl = C - uCamLocal;
  float gs = dot(rl, uCamFwd), gx = dot(rl, uCamRt), gy = dot(rl, uCamUp);
  float gT = clamp((uGate.w - gs) / max(uGate.w - uGate.z, 0.1), 0.0, 1.0);
  // (sixth polish pass) the shove is eased in over 4 m of the lens' approach (uGate.w 6 m, it was 2.4 m of approach: an animal covered
  // three metres in a fifth of a second and was gone in a frame or two), and what it must clear is the frame at uGate.z,
  // never the wider frame at its own range: an animal eases a metre or two off the lens' line while it is still ahead,
  // and nobody further out is moved at all
  float gate = gT * gT * (3.0 - 2.0 * gT) * smoothstep(-3.5, -0.8, gs) * uPart;
  float gsc = clamp(gs, 0.0, uGate.z);
  float gax = uGate.x * gsc + 0.55 * len + 0.35, gay = uGate.y * gsc + 0.32 * len + 0.6;
  float gSg = dot(iPos - uCamLocal, uCamUp) + 0.4 * (fract(ph * 9.7) - 0.5) >= 0.0 ? 1.0 : -1.0;
  // (the profile across the frame has a bounded slope: full from side to side of the picture, then eased to nothing over
  // the 1.5 m beyond each side edge. So an animal the frame sweeps toward as the lens turns is already on its way while
  // it is still outside the picture and is clear of it, above or below, by the time the edge reaches it. The old rounded
  // rectangle was vertical at its ends: an animal its edge swept over stood in the picture and was thrown a full frame
  // height in one twenty-fifth of a second)
  float gNeed = max(0.0, gay * (1.0 - smoothstep(gax, gax + 1.5, abs(gx))) - gSg * gy), gPush = gNeed * gate;
  C += uCamUp * (gSg * gPush);
  float gShear = min(1.0, gPush * 0.8);
  C += fwd * (0.9 * gShear);
  float side = sign(dot(pdir, lat) + 1e-4);
  float shear = max(wAx * min(1.0, inside * 2.2), gShear);
  float flick = min(1.5, shear + kick);
  // ---- the body: a travelling wave that grows to the tail
  vec3 p = position;
  float t01 = 0.5 - p.z;
  float amp = (0.010 + 0.082 * t01 * t01) * (1.0 + 1.3 * flick);
  float dAmp = 0.164 * t01 * (1.0 + 1.3 * flick);
  float beat = uTime * 6.2832 * iA.z * (1.0 + 0.9 * flick) + ph * 6.2832 - t01 * 4.2;
  p.xy *= 1.0 + 0.85 * smoothstep(26.0, 110.0, length(rel));
  p.x += amp * sin(beat) + tSg * tOn * 0.42 * (p.z * p.z - 0.05);
  float slope = -dAmp * sin(beat) + 4.2 * amp * cos(beat);
  vec3 n = normalize(vec3(normal.x, normal.y, normal.z - slope * normal.x));
  // fins trail the stroke a little
  p.x += aInfo.z * step(0.5, aInfo.x) * 0.012 * sin(beat - 0.9);
  // roll (belly toward the lens while shearing aside), pitch, yaw
  // (each animal also hangs at a small bank of its own, so no two near ones share a pose)
  float ro = -side * 0.36 * shear + 0.05 * sin(uTime * 0.31 + ph * 31.0) - tSg * 0.62 * tOn + 0.30 * (fract(ph * 13.7) - 0.5) * step(0.45, fract(ph * 5.3));
  float cr = cos(ro), sr = sin(ro);
  p.xy = vec2(p.x * cr - p.y * sr, p.x * sr + p.y * cr); n.xy = vec2(n.x * cr - n.y * sr, n.x * sr + n.y * cr);
  float pi = iB.y + 0.03 * sin(uTime * 0.21 + ph * 13.0) - gSg * 0.30 * gShear - 0.30 * tUp * tOn, cp = cos(pi), spi = sin(pi);
  p.yz = vec2(p.y * cp - p.z * spi, p.y * spi + p.z * cp); n.yz = vec2(n.y * cp - n.z * spi, n.y * spi + n.z * cp);
  float yaw = iB.x + swayYaw + side * 0.24 * shear - 0.10 * kick * sin(ph * 40.0) + tSg * 1.15 * tOn;
  // no animal within a dozen metres is seen end-on: where the line of sight comes within 53 degrees of its heading (the
  // near animals on the camera's left) it swings broadside as the lens comes, up to 53 degrees, and swings back behind us
  vec2 gr = C.xz - uCamLocal.xz; gr /= max(length(gr), 1e-3);
  float hx0 = sin(yaw) * uHead.y + cos(yaw) * uHead.x, hz0 = cos(yaw) * uHead.y - sin(yaw) * uHead.x;
  float gc = hx0 * gr.x + hz0 * gr.y, gsn = hx0 * gr.y - hz0 * gr.x;
  yaw += (gsn >= 0.0 ? 1.0 : -1.0) * (gc >= 0.0 ? 1.0 : -1.0) * (1.0 - smoothstep(7.0, 12.0, length(C - uCamLocal))) * max(0.0, abs(gc) - 0.6) * 2.3;
  float cy = cos(yaw), sy = sin(yaw);
  p = swRotY(swRotY(p, sy, cy), uHead.x, uHead.y);
  n = swRotY(swRotY(n, sy, cy), uHead.x, uHead.y);
  // far ranks are drawn a little stouter so the wall still reads as animals, not specks, from the bend
  float far = smoothstep(26.0, 110.0, length(C - uCamLocal));
  vec3 local = C + p * (len * (1.0 + 0.4 * far));
  vModel = position; vN = n; vLocal = local; vInfo = aInfo; vInst = vec4(iA.w, ph, shear, len);
  vec4 mvPosition = modelViewMatrix * vec4(local, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,At=`
attribute vec3 aInfo;
uniform mat4 uPM;     // the animal's own frame in the hero's local space (rotation and position, no scale)
uniform vec4 uPA;     // length (m), phase / tone, variant, tail-beat phase (radians, run on by the world)
uniform vec3 uPB;     // stroke gain (0 cruising .. 1.5 a hard flick), body bend (a C toward its own +x), unused
varying vec3 vModel, vN, vLocal, vInfo;
varying vec4 vInst;
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  float t01 = 0.5 - p.z, fl = uPB.x;
  float amp = (0.010 + 0.082 * t01 * t01) * (1.0 + 1.3 * fl), dAmp = 0.164 * t01 * (1.0 + 1.3 * fl);
  float beat = uPA.w - t01 * 4.2;
  p.x += amp * sin(beat) + uPB.y * (p.z * p.z - 0.05);
  float slope = -dAmp * sin(beat) + 4.2 * amp * cos(beat) + 2.0 * uPB.y * p.z;
  vec3 n = normalize(vec3(normal.x, normal.y, normal.z - slope * normal.x));
  p.x += aInfo.z * step(0.5, aInfo.x) * 0.012 * sin(beat - 0.9);
  vec3 local = (uPM * vec4(p * uPA.x, 1.0)).xyz;
  vModel = position; vN = normalize(mat3(uPM) * n); vLocal = local; vInfo = aInfo; vInst = vec4(uPA.z, uPA.y, fl, uPA.x);
  vec4 mvPosition = modelViewMatrix * vec4(local, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,mt=`
uniform vec3 uBack, uBelly, uBronze, uBounce;
varying vec3 vModel, vN, vLocal, vInfo;
varying vec4 vInst;
#include <fog_pars_fragment>
${Ge}
void main(){
  vec3 m = vModel;
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(uCamLocal - vLocal);
  float part = vInfo.x, isFin = step(0.5, part), variant = vInst.x;
  float px = fwidth(m.z) + fwidth(m.y) + 1e-5;
  float mott = swNoise(m * vec3(60.0, 60.0, 34.0) + vInst.y * 50.0);
  // ---- countershading: bronze-grey back, paler flank, white belly with a wavering edge
  // (each animal a tone of its own, from dark slate to bronze; a dark saddle along the back, a flank one step paler, and
  // the white belly meeting it on a crisp wavering line about the widest part of the body)
  float line = mix(0.002, -0.020, smoothstep(-0.38, 0.25, m.z)) + 0.006 * sin(m.z * 21.0 + vInst.y * 9.0);
  float belly = (1.0 - smoothstep(line - 0.010, line + 0.010, m.y + (mott - 0.5) * 0.010));
  float dorsal = smoothstep(0.010, 0.066, m.y);
  vec3 back = mix(uBack * 0.92, uBronze, 0.10 + 0.62 * fract(vInst.y * 7.31)) * (0.64 + 0.56 * fract(vInst.y * 3.17 + 0.37)) * (0.86 + 0.28 * mott);
  vec3 alb = mix(back * 1.16 + 0.014, back * 0.60, dorsal);
  alb = mix(alb, uBelly, belly * (1.0 - isFin));
  // blacktip: a pale wedge along the flank
  alb = mix(alb, uBelly * 0.8, step(0.5, variant) * step(variant, 1.5) * (1.0 - isFin) * (1.0 - smoothstep(0.0, 0.022, abs(m.y - 0.004 + m.z * 0.05))) * (1.0 - smoothstep(-0.05, 0.2, m.z)) * smoothstep(-0.36, -0.2, m.z) * 0.6);
  // ---- fins
  float under = (1.0 - smoothstep(-0.3, 0.1, N.y));
  vec3 fin = back * (1.0 - 0.35 * vInfo.z);
  fin = mix(fin, uBelly * 0.92, under * step(2.5, part) * (1.0 - 0.5 * vInfo.z));        // pale undersides of the paired fins
  float margin = smoothstep(0.50, 0.80, vInfo.y);
  float isCaudal = step(1.5, part) * step(part, 2.5);
  fin = mix(fin, vec3(0.012), margin * isCaudal * step(variant, 1.5));                    // the black trailing margin of the tail
  float tipMark = smoothstep(0.62, 0.86, vInfo.z);
  fin = mix(fin, vec3(0.012), tipMark * step(0.5, variant) * step(variant, 1.5));         // blacktip
  fin = mix(fin, uBelly, max(tipMark, smoothstep(0.72, 0.92, vInfo.y)) * step(1.5, variant)); // silvertip
  alb = mix(alb, fin, isFin);
  // ---- eye, gill slits, mouth (only on the hull; filtered away with distance)
  float body = 1.0 - isFin, detail = clamp(1.6 - px * 90.0, 0.0, 1.0);
  // the eye: a shadowed socket, a dark gold-grey iris darker still at its rim, a slit pupil and a glint (never a plain dot)
  vec2 ev = vec2(m.z - 0.432, (m.y - 0.010) * 1.05);
  float e = length(ev), eR = 0.0118;
  float eyeSide = smoothstep(0.016, 0.026, abs(m.x)) * body;
  float eye = (1.0 - smoothstep(eR, eR + px, e)) * eyeSide;
  float socket = (1.0 - smoothstep(eR * 0.9, eR * 2.0, e)) * eyeSide;
  float pupil = 1.0 - smoothstep(0.0, px, length(vec2(ev.x * 2.6, ev.y)) - 0.0076);
  vec3 eyeCol = mix(vec3(0.20, 0.185, 0.13), vec3(0.035, 0.035, 0.035), smoothstep(eR * 0.62, eR * 0.98, e));
  eyeCol = mix(eyeCol, vec3(0.006), pupil);
  float glint = (1.0 - smoothstep(0.0015, 0.0015 + px, length(ev - vec2(0.0036, 0.0042)))) * eye * detail;
  alb *= 1.0 - 0.32 * socket * detail;
  alb = mix(alb, eyeCol, eye * detail);
  // five gill slits: thin, bowed, the forward ones longer, each with the pale edge of its flap behind it
  float gy = m.y + 0.004, gz = (m.z - 0.226 - m.y * 0.22 + 14.0 * gy * gy) / 0.0135, gi = clamp(floor(gz), 0.0, 4.0);
  float gTop = 0.011 + 0.0022 * gi, gBot = -0.023 - 0.0016 * gi;
  float gMask = step(0.0, gz) * step(gz, 5.0) * smoothstep(gBot, gBot + 0.007, m.y) * (1.0 - smoothstep(gTop - 0.007, gTop, m.y)) * body;
  float gW = fwidth(m.z) / 0.0135 + 1e-4, gf = fract(gz) - 0.5;
  float gill = (1.0 - smoothstep(0.050, 0.050 + gW, abs(gf))) * gMask * clamp(1.6 - gW * 2.2, 0.0, 1.0);
  alb *= 1.0 - 0.60 * gill;
  alb *= 1.0 + 0.10 * (1.0 - smoothstep(0.0, 0.14, abs(gf + 0.17))) * gMask * detail * (1.0 - belly);
  float ring = abs(length(vec2(m.x, (m.z - 0.366) * 0.95)) - 0.041);
  float mouth = (1.0 - smoothstep(0.0022, 0.0022 + px, ring)) * step(0.372, m.z) * (1.0 - smoothstep(-0.016, -0.006, m.y)) * body;
  alb *= 1.0 - 0.38 * mouth * detail;
  // lateral line and nostril-fine speckle on the back
  alb *= 1.0 - 0.10 * detail * body * (1.0 - smoothstep(0.0015, 0.0015 + px, abs(m.y - 0.018 - m.z * 0.02))) * (1.0 - belly);
  // ---- light: high key with caustics on the back, sky light above, deep light below
  float ndl = clamp((dot(N, uSunDir) + 0.22) / 1.22, 0.0, 1.0);
  // (the caustic net reaches the whole sheet, on upward faces only: light ripples along every back, the flanks stay calm)
  vec2 cq = vLocal.xz - uSunDir.xz * (vLocal.y / max(uSunDir.y, 0.2));
  float caus = (swCaustic(cq * 0.85, uTime * 1.3) + 0.6 * swCaustic(cq * 1.9 + 7.3, uTime * 1.7 + 2.0)) * smoothstep(uSurfaceY - 30.0, uSurfaceY - 7.0, vLocal.y) * smoothstep(-0.1, 0.45, N.y);
  vec3 amb = mix(uDeepLight, uSkyLight, N.y * 0.5 + 0.5);
  float dl = swDepth(vLocal.y);
  // the lit sand throws light back up: bellies read pale, not black (strongest low over the floor)
  amb += uBounce * clamp(0.15 - N.y, 0.0, 1.0) * (0.55 + 0.45 * (1.0 - smoothstep(3.0, 22.0, vLocal.y)));
  float shaft = swShaft(vLocal, uTime);                                            // a shaft of sun rakes across the ranks
  vec3 col = alb * (uSunColor * dl * ndl * (0.55 + 2.0 * caus) * (0.74 + 1.25 * shaft) + amb * (0.45 + 0.55 * dl));
  vec3 H = normalize(uSunDir + V);
  float ndh = max(dot(N, H), 0.0), ndv = max(dot(N, V), 0.0);
  col += uSunColor * dl * 0.10 * pow(ndh, 28.0) * (1.0 - belly) * (0.5 + caus);
  float fres = 1.0 - ndv; fres = fres * fres * fres;
  col += (uSkyLight + uSunColor * 0.35 * shaft * dl) * fres * (0.06 + 0.42 * smoothstep(-0.1, 0.7, N.y));          // the pale rim along the back
  col += (uSkyLight * 1.2 + uSunColor * 0.3) * glint;
  col = swHaze(col, vLocal);
  gl_FragColor = vec4(col, 1.0);
  // in the world's water the far ranks fade to a tone a little darker than the haze behind them, so the wall
  // holds as silhouettes from the bend instead of dissolving
  #ifdef FOG_EXP2
    float swF = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor * mix(0.62, 1.0, smoothstep(0.86, 1.0, swF)), swF);
  #else
    #include <fog_fragment>
  #endif
}`,Ft=`
attribute vec4 aCol;    // rgb albedo, a = occlusion
attribute float aMat;   // 0 sand, 1 rock, 2 plate coral, 3 mound coral
varying vec3 vN, vLocal;
varying vec4 vCol;
varying float vMat;
#include <fog_pars_vertex>
void main(){
  vN = normal; vLocal = position; vCol = aCol; vMat = aMat;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Bt=`
uniform vec3 uPink, uOchre, uOlive, uBounce;
uniform vec2 uFlow;
varying vec3 vN, vLocal;
varying vec4 vCol;
varying float vMat;
#include <fog_pars_fragment>
${Ge}
// one cellular lookup: x = distance to the nearest cell centre, y = distance to the cell wall (F2 - F1), z = cell id
vec3 swCell(vec3 p){
  vec3 i = floor(p), f = fract(p); float f1 = 9.0, f2 = 9.0, id = 0.0;
  for (int z = -1; z <= 1; z++) for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec3 g = vec3(float(x), float(y), float(z)), c = i + g;
    vec3 o = vec3(swHash(c), swHash(c + 17.3), swHash(c + 41.9));
    float d = length(g + 0.15 + 0.7 * o - f);
    if (d < f1) { f2 = f1; f1 = d; id = o.x; } else if (d < f2) { f2 = d; }
  }
  return vec3(f1, f2 - f1, id);
}
void main(){
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 lp = vLocal;
  // materials: 0 sand, 1 rock, 2 plate coral, 3 mound coral
  float sand = 1.0 - step(0.5, vMat), mound = clamp(vMat - 2.0, 0.0, 1.0) * (1.0 - sand), plate = clamp(1.0 - abs(vMat - 2.0), 0.0, 1.0) * (1.0 - sand);
  float rock = clamp(1.0 - sand - plate - mound, 0.0, 1.0);
  float mpp = length(fwidth(lp));                                           // metres per pixel, roughly
  // What a pixel can still resolve. Every pattern is drawn only while one of its features spans a good many pixels, and
  // hands over to the next coarser one beyond: grain (4 cm) and polyps (12 cm cells, only on the nearest two or three
  // metres), mottling (11 cm and 32 cm), crevices (4-13 cm wide, to about 25 m), colony lobes and pockets (0.5-1.5 m),
  // crust patches (2-3 m, at every range). Nothing on the rock is cellular: there is no net of cell walls to read as paving.
  float creK = clamp(1.6 - mpp * 9.0, 0.0, 1.0), lobeK = clamp(1.6 - mpp * 4.5, 0.0, 1.0), patchK = clamp(1.7 - mpp * 2.4, 0.0, 1.0), n2K = clamp(1.7 - mpp * 26.0, 0.0, 1.0);
  float n3K = clamp(1.7 - mpp * 85.0, 0.0, 1.0), polyK = clamp(1.6 - mpp * 70.0, 0.0, 1.0), fineK = clamp(1.6 - mpp * 110.0, 0.0, 1.0);
  // the fine fields are read in a frame turned well off the world's axes: a canyon wall is close to an axis plane, and a
  // lattice cut square-on by it shows as rows of square cells; cut obliquely it shows as uneven patches
  vec3 lr = vec3(dot(lp, vec3(0.869, 0.391, 0.304)), dot(lp, vec3(0.410, -0.912, 0.0)), dot(lp, vec3(0.277, 0.125, -0.953)));
  float n2 = swNoise(lr * 3.1 + 11.0), n3 = swNoise(lr * 9.0 + 5.0), n4 = swNoise(lr * 23.0 + 3.0);
  float m2 = mix(0.5, n2, n2K), m3 = mix(0.5, n3, n3K), m4 = mix(0.5, n4, fineK);
  float nB = swNoise(lp * 0.3 + 7.7);                                       // broad and soft: what the crust bands follow
  vec3 Ng = N;                                                              // the modelled normal, before the painted relief
  float solid = 1.0 - sand, hy = smoothstep(4.0, 24.0, lp.y);              // hy: height in the water column
  // warm: 1 on the sunlit upper part of a wall, the crown of a dome or a boulder (the writer's occlusion carries that
  // height: 0.5 at a wall's foot, 1 at its rim), 0 in its foot, its creases and its undercuts; a little less with depth
  float warm = smoothstep(0.48, 0.82, vCol.a) * (0.88 + 0.12 * hy) * solid;
  // every patch edge is read through one slow warp, so borders come out lobed and scalloped, never straight
  vec3 wv = 1.5 * (vec3(swNoise(lp * 0.37 + 3.1), nB, swNoise(lp * 0.37 + 41.3)) - 0.5) + 0.25 * (m2 - 0.5), wq = lr + wv, wl = lp + wv;
  float cA = swNoise(wq * 0.46 + 21.0), cB = swNoise(wq * 0.71 + 57.0), cC = swNoise(wq * 1.25 + 13.0);
  vec3 alb = vCol.rgb;
  // THE REEF AT ARM'S LENGTH (eighth pass; a rule in space: each part of it is full within its own range of the lens and
  // fades out beyond, wherever the lens is, and is drawn only while a pixel resolves it). A wall that near was broad soft blotches under a net of light: painted clay. Within that range the
  // encrusting colonies take a crisp edge a few centimetres wide, two more generations of plates stand on the crust (a
  // forearm to a metre across, and a hand across), each with a lit lip, a pale growing rim and a pocket of shadow under
  // its lower edge; the crust is pitted and grained (11 cm and 4 cm), and the caustic net lies on the faces that look up.
  // (the three ranges: pits and grain to 14 m, gone by 30; hand-sized plates to 18 m, gone by 36; the large plates, the
  // colonies' crisp edges and the plate tiers to 30 m, gone by 60: most of a canyon wall in the picture is 10 to 40 m off)
  float dCam = length(lp - uCamLocal), nearK = (1.0 - smoothstep(14.0, 30.0, dCam)) * rock, nearB = (1.0 - smoothstep(18.0, 36.0, dCam)) * rock, nearA = (1.0 - smoothstep(30.0, 60.0, dCam)) * rock;
  // ---- rock: crust in soft lobed patches two or three metres across (olive low and in the shade, ochre, dusty rose toward
  // the light), with pink coralline crust blotched over it, thickest on shaded and overhung faces
  float st = swNoise(vec3(lp.y * 0.7 + 0.5 * nB, 0.30 * (lp.x + lp.z), 3.7));   // (2.3 : 1 along the wall; it was 6 : 1 and warped twice as far: stretched swirls where a wall turned)
  float tone = 0.58 * cA + 0.42 * st + 0.18 * (cC - 0.5);
  vec3 crust = mix(uOlive, uOchre, smoothstep(0.34, 0.54, tone));
  crust = mix(crust, uPink, smoothstep(0.50, 0.68, tone) * 0.85);
  float coralline = smoothstep(0.50, 0.70, cB + 0.24 * (cC - 0.5) + 0.20 * (1.0 - smoothstep(-0.5, 0.35, N.y)));
  crust = mix(crust, uPink * vec3(1.04, 0.84, 1.0), coralline * 0.72);
  alb = mix(alb, crust, rock * 0.64);
  // encrusting colonies: raised soft lobes half a metre to a metre across, paler toward the middle, each kind its own tint
  float colF = swNoise(wq * 1.05 + 71.0) + 0.10 * (m2 - 0.5);
  float colonyS = mix(smoothstep(0.58, 0.72, colF), clamp(0.5 + (colF - 0.62) / max(length(vec2(dFdx(colF), dFdy(colF))), 0.012) * 0.8, 0.0, 1.0), nearA) * rock, colCore = smoothstep(0.66, 0.88, colF), bare = rock * (1.0 - colonyS);
  vec3 colTint = mix(mix(uOchre, uPink, smoothstep(0.38, 0.62, swNoise(lp * 0.21 + 33.0))), uOlive * 1.18, smoothstep(0.58, 0.78, swNoise(lp * 0.23 + 88.0)));
  alb = mix(alb, colTint * (0.80 + 0.32 * colCore), colonyS * 0.52 * mix(0.5, 1.0, patchK));
  float live = max(mound, colonyS);
  // a few wandering crevices: the centre lines of a slow field stretched up the wall (they run with the buttresses, wander,
  // and never meet in a net), on about a quarter of the rock, their width uneven; and shadowed pockets, lens-shaped hollows
  // lying across the face as under small overhangs
  float cv = swNoise(vec3(wl.x * 0.50, lp.y * 0.16 + 0.4 * nB, wl.z * 0.50) + 5.3);
  float cvG = length(vec2(dFdx(cv), dFdy(cv))) / max(mpp, 1e-5);          // its slope per metre along the surface
  float cvD = abs(cv - 0.5) / max(cvG, 0.03);                             // metres to the crevice's centre line
  float cvW = mix(0.035, 0.13, swNoise(lp * 0.9 + 15.0));
  float crack = (1.0 - smoothstep(cvW * 0.35, cvW + mpp, cvD)) * smoothstep(0.50, 0.72, swNoise(lp * 0.3 + 11.0)) * bare * creK;
  float pkF = swNoise(vec3(wl.x * 0.62, wl.y * 1.25, wl.z * 0.62) + 91.0);
  float pocket = smoothstep(0.75, 0.92, pkF + 0.10 * (1.0 - smoothstep(-0.6, 0.2, Ng.y))) * rock * patchK;   // (a few: one face in twelve)
  float under = (1.0 - smoothstep(-0.6, 0.0, Ng.y)) * solid;                      // the underside of an overhang, a dish or a dome
  alb *= mix(1.0, 1.05 * (0.89 + 0.15 * mix(0.7, smoothstep(0.1, 0.7, n3), n3K)) * (0.90 + 0.20 * m4) * (0.93 + 0.14 * m2) * (0.92 + 0.16 * mix(0.5, cC, lobeK)), rock);
  alb = mix(alb, alb * vec3(0.60, 0.72, 0.82), crack);
  alb = mix(alb, alb * vec3(0.52, 0.64, 0.72), pocket * 0.7);
  // ---- the reef at arm's length: plates, their rims and the pockets under them, pits and grain (see nearK above)
  // (the same fields are read again a hand's breadth higher up the wall: where a plate stands just above a point and none
  // on it, that point lies under the plate's lower lip and is in its shadow)
  vec3 lrUp = vec3(0.391, -0.912, 0.125);                                   // straight up, in the turned frame the fields are read in
  vec3 qa = wq * 1.7 + 101.0, qb = (lr + 0.35 * wv) * 4.3 + 57.0;
  float fA = swNoise(qa) + 0.16 * (n2 - 0.5) + 0.05 * (n3 - 0.5), fAu = swNoise(qa + lrUp * 0.24) + 0.16 * (n2 - 0.5) + 0.05 * (n3 - 0.5);
  float fB = swNoise(qb) + 0.10 * (n3 - 0.5), fBu = swNoise(qb + lrUp * 0.21) + 0.10 * (n3 - 0.5);
  // (an edge is a pixel and a third wide measured across itself, whatever angle the face is seen at: the field's own
  // gradient on the screen gives the distance to the edge in pixels. A width taken from fwidth alone smears every edge
  // on a wall seen along its length, which is how a canyon wall is seen.)
  float gA = max(length(vec2(dFdx(fA), dFdy(fA))), 0.012), gB = max(length(vec2(dFdx(fB), dFdy(fB))), 0.016);
  float mppN = sqrt(length(dFdx(lp)) * length(dFdy(lp))), plKA = clamp(1.8 - mppN * 7.0, 0.0, 1.0) * nearA, plK = clamp(1.8 - mppN * 18.0, 0.0, 1.0) * nearB;
  float plateA = clamp(0.5 + (fA - 0.55) / gA * 0.8, 0.0, 1.0) * plKA, plateB = clamp(0.5 + (fB - 0.61) / gB * 0.8, 0.0, 1.0) * plK;
  float rimA = plateA * (1.0 - smoothstep(0.57, 0.62, fA)), rimP = plateB * (1.0 - smoothstep(0.63, 0.69, fB));
  float lipA = clamp(0.5 + (fAu - 0.55) / gA * 0.8, 0.0, 1.0) * plKA * (1.0 - plateA), lipB = clamp(0.5 + (fBu - 0.61) / gB * 0.8, 0.0, 1.0) * plK * (1.0 - plateB);
  // (each generation its own tints and its own step of tone: the large plates deep olive, cream-ochre or pink coralline by
  // the slow crust fields, the hand-sized ones pale rose or deep olive-brown by the 32 cm field, so neighbours differ)
  float kA = 0.6 * cB + 0.4 * cC;
  vec3 tintA = mix(mix(uOlive * 0.76, uOchre * 1.28 + 0.04, smoothstep(0.39, 0.43, kA)), uPink * vec3(1.14, 0.84, 1.02), smoothstep(0.53, 0.57, kA)) * (0.84 + 0.32 * cA);
  vec3 tintB = mix(uOlive * vec3(0.66, 0.58, 0.52), uPink * vec3(1.12, 0.96, 1.0) + 0.04, smoothstep(0.46, 0.54, n2));
  alb = mix(alb, tintA * (0.86 + 0.26 * smoothstep(0.60, 0.85, fA)), plateA * mix(0.58, 0.86, nearK));   // (strongest beside the lens; further off the plates are a step of tone, not a patchwork)
  alb = mix(alb, tintB * (0.90 + 0.2 * m3), plateB * mix(0.55, 0.80, nearK));
  alb = mix(alb, alb * 1.25 + 0.04, max(rimA * (1.0 - plateB), rimP) * 0.75);
  // plate tiers: shelves of plate coral a metre or two across and half as tall on the face (the pockets' own slow field,
  // which lies across the wall, cut crisp), each standing proud with a pale lip, and under every one a pocket of shadow a
  // forearm deep: the same field read 35 cm higher up the wall. They carry the wall's relief out to the range the canyon
  // is mostly seen at.
  float fS = pkF + 0.10 * (n2 - 0.5) + 0.06 * (cC - 0.5), fSu = swNoise(vec3(wl.x * 0.62, wl.y * 1.25 + 0.44, wl.z * 0.62) + 91.0) + 0.10 * (n2 - 0.5) + 0.06 * (cC - 0.5);
  float gS = max(length(vec2(dFdx(fS), dFdy(fS))), 0.008), tierK = clamp(1.7 - mppN * 2.6, 0.0, 1.0) * nearA * (1.0 - smoothstep(0.80, 0.95, abs(Ng.y)));   // (on walls and leaning faces: a shelf has no meaning on the reef top)
  float tier = clamp(0.5 + (fS - 0.61) / gS * 0.8, 0.0, 1.0) * tierK, tierLip = clamp(0.5 + (fSu - 0.61) / gS * 0.8, 0.0, 1.0) * tierK * (1.0 - tier);
  vec3 tintS = mix(uOchre * 1.16 + 0.03, mix(uOlive * 0.92, uPink * vec3(1.06, 0.90, 1.0), smoothstep(0.52, 0.58, cB)), smoothstep(0.44, 0.50, cA));
  alb = mix(alb, tintS * (0.88 + 0.24 * smoothstep(0.62, 0.90, fS)) * (0.92 + 0.16 * m2), tier * 0.54 * (1.0 - plateA));
  alb = mix(alb, alb * 1.22 + 0.035, tier * (1.0 - smoothstep(0.61, 0.66, fS)) * 0.7);
  alb = mix(alb, alb * vec3(0.40, 0.50, 0.62), tierLip * 0.8);
  // pits and grain: the crust is pocked (dark pits 4 to 5 cm across, finer ones 2 cm) and its tone is grained
  float g3K = clamp(1.9 - mppN * 42.0, 0.0, 1.0) * nearK, g4K = clamp(1.8 - mppN * 80.0, 0.0, 1.0) * nearK;
  float pit3 = (1.0 - smoothstep(0.17, 0.33, n3)) * g3K, pit4 = (1.0 - smoothstep(0.18, 0.34, n4)) * g4K;
  alb *= (1.0 + 0.30 * (n3 - 0.5) * g3K + 0.22 * (n4 - 0.5) * g4K) * (1.0 - 0.42 * pit3) * (1.0 - 0.34 * pit4);
  alb = mix(alb, alb * vec3(0.44, 0.54, 0.66), max(lipA, 0.8 * lipB) * 0.75);
  // ---- the high-sun looks (uFootK): under a noon sun a far wall is one pale sheet unless its own structure is drawn. So
  // there: a few dark creases run up the face between the buttresses (the centre lines of a slow field stretched up the
  // wall, ten to twenty metres apart, each half a metre to a metre and a half wide at any range), a band of shadow lies
  // under the rim's overhang (from the writer's occlusion, which carries height), and the crust's patches are told apart
  // by tone as well as hue. Walls only (not the reef top, the sand, the coral domes or the boulders at the foot).
  float wallK = uFootK * rock * (1.0 - smoothstep(0.55, 0.85, abs(Ng.y)));
  float crF = swNoise(vec3(wl.x * 0.085, lp.y * 0.02 + 0.3 * nB, wl.z * 0.085) + 61.0);
  float crGr = length(vec2(dFdx(crF), dFdy(crF))) / max(mpp, 1e-5);
  float crease2 = (1.0 - smoothstep(0.30, 0.95 + mpp, abs(crF - 0.5) / max(crGr, 0.012))) * wallK;
  float rimB = smoothstep(0.80, 0.88, vCol.a) * (1.0 - smoothstep(0.93, 0.985, vCol.a)) * smoothstep(13.0, 17.0, lp.y) * wallK;
  alb *= mix(1.0, mix(0.70, 1.10, smoothstep(0.36, 0.62, cA)), wallK * 0.9);
  alb = mix(alb, alb * vec3(0.38, 0.50, 0.58), crease2 * 0.92);
  alb *= 1.0 - 0.52 * rimB;
  // ---- mound corals: smooth lobes (a soft dome inside each cell, a shaded crease between two), each lobe a tone of its own
  // (the one cellular field left, and only on the coral domes themselves, where lobes are what a brain coral is)
  float dome = 0.5, crease = 0.0, cz = 0.5, lobeW = mound * lobeK;
  if (lobeW > 0.004) {
    vec3 ce = swCell(lp * 2.3 + 0.15 * (n2 - 0.5) + 0.7 * (nB - 0.5));
    dome = smoothstep(0.0, 0.55, ce.y); crease = 1.0 - smoothstep(0.0, 0.40, ce.y); cz = ce.z;
  }
  alb *= mix(1.0, (0.96 + 0.07 * dome) * (1.0 - 0.08 * crease) * (0.92 + 0.16 * cz), lobeW);
  // ---- polyps: cups (a dark pit inside a pale ring, the seam between two cups barely darker: never a net of tiles),
  // looked up (a second cellular field) only where a pixel can show them
  float pk = polyK * live, cup = 0.5, pit = 0.0, pz = 0.5;
  if (pk > 0.004) {
    vec3 pc = swCell(lr * 8.0 + 0.5 * (n2 - 0.5) + 1.3 * (n3 - 0.5));   // (warped: cups of uneven size, not a ruled grid)
    cup = smoothstep(0.10, 0.30, pc.x) * smoothstep(0.0, 0.12, pc.y); pit = 1.0 - smoothstep(0.05, 0.22, pc.x); pz = pc.z;
  }
  alb *= mix(1.0, (0.88 + 0.22 * cup) * (1.0 - 0.45 * pit) * (0.96 + 0.08 * pz), pk);
  alb *= mix(1.0, 0.92 + 0.16 * m2, live);
  alb *= mix(1.0, 0.84 + 0.32 * m3, plate);
  // a dome of living coral is palest on its crown
  alb = mix(alb, alb * 1.12 + 0.03, mound * smoothstep(0.0, 0.9, Ng.y));
  // ---- relief from the same fields (screen-space bump; derivatives are taken here, outside any loop): colony lobes stand
  // proud, pockets are hollow, and a crevice is cut in only while it is several pixels wide (a bump of a line two pixels
  // wide comes out as a staircase; beyond that range the crevice is its dark line alone)
  // (and the crust itself is knobbly: soft bosses a hand to a forearm across, shaded by the key, out to some forty metres)
  float knob = swNoise(wl * 2.6 + 27.0) * clamp(1.6 - mpp * 11.0, 0.0, 1.0);
  float h = bare * 0.15 * (0.24 * n3 * n3K + 0.12 * n4 * fineK) + rock * 0.10 * knob
          + 0.14 * tier - 0.05 * tierLip + 0.080 * plateA + 0.022 * smoothstep(0.55, 0.85, fA) * plKA + 0.036 * plateB + 0.030 * (n3 - 0.5) * g3K + 0.012 * (n4 - 0.5) * g4K - 0.030 * pit3 - 0.010 * pit4 - 0.035 * max(lipA, lipB) - crack * 0.05 * clamp(1.6 - mpp * 30.0, 0.0, 1.0) - pocket * 0.14 - crease2 * 0.22
          + colonyS * (0.05 + 0.06 * colCore) * patchK + lobeW * 0.02 * dome + pk * 0.02 * (0.6 * cup - 0.5 * pit);
  vec3 dpx = dFdx(lp), dpy = dFdy(lp);
  float dhx = dFdx(h), dhy = dFdy(h);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx);
  float det = dot(dpx, r1);
  N = normalize(abs(det) * N - sign(det) * (dhx * r1 + dhy * r2) + N * 1e-7);
  // sand: current ripples square to the flow, pale rivers along it
  vec2 q = lp.xz;
  float along = dot(q, uFlow), across = dot(q, vec2(uFlow.y, -uFlow.x));
  float exitK = (1.0 - smoothstep(-84.0, -52.0, lp.z));
  // (down the exit canyon the ripples wander and fork and lie in patches with bare sand between: one even field of them
  // read from the bowl as ruled streaks across the whole floor)
  float rPh = along * 7.0 + 2.2 * swNoise(vec3(q * 0.35, 3.0)) + 1.1 * sin(across * 0.6) + exitK * (3.0 * swNoise(vec3(q * 0.9, 21.0)) + 3.0 * swNoise(vec3(q * 0.21, 25.0)));   // (seventh pass: the fine warp at two thirds, it cut the ripples into dark dashes)
  float ripA = clamp(1.5 - fwidth(rPh) * 0.55, 0.0, 1.0) * mix(1.0, smoothstep(0.36, 0.66, swNoise(vec3(q * 0.16, 29.0))), exitK * 0.9);
  float rip = sin(rPh) * ripA;
  float wa = across + 5.0 * swNoise(vec3(q * 0.07, 1.0)) + 2.0 * swNoise(vec3(q * 0.21, 4.0));
  float river = smoothstep(0.5, 0.78, swNoise(vec3(wa * 0.13, along * 0.035, 9.0))) * 0.55;
  // (down the exit canyon, z under -60, the pale rivers are broken into short lenses a few metres long: seen along their
  // length from the bowl they were continuous pale streaks)
  river *= mix(1.0, smoothstep(0.34, 0.62, swNoise(vec3(q * 0.23, 17.0))) * 0.8, exitK);
  alb = mix(alb, alb * (0.84 + 0.2 * (1.0 - 0.3 * exitK) * rip) * (1.0 + 0.55 * river) * (0.88 + 0.24 * n2), sand);
  N = normalize(N + sand * vec3(uFlow.x, 0.0, uFlow.y) * cos(rPh) * 0.28 * (1.0 - 0.34 * exitK) * ripA);
  // rubble flecks on the sand
  // (seventh pass: down the exit canyon and in the bowl they are half as dark, and gone 22 m from the lens: seen low along
  // the floor there, each was a dark dash)
  alb = mix(alb, alb * mix(0.55, 0.78, exitK), sand * smoothstep(0.80, 0.90, swNoise(lp * vec3(2.3, 0.0, 2.3) + 40.0)) * (1.0 - river) * (1.0 - exitK * smoothstep(7.0, 22.0, length(lp - uCamLocal))));
  // ---- light. Sand takes the plain key; the reef takes a wrapped key, so that its upright faces catch the sun and the
  // caustic net (skewed by the face's own lean, so it dapples a wall instead of streaking down it)
  float sdn = dot(N, uSunDir);
  float ndl = mix(clamp((sdn + 0.15) / 1.15, 0.0, 1.0), clamp((sdn + 0.7) / 1.7, 0.0, 1.0), solid);
  // (the net is projected three ways and blended by the modelled normal: down the sun on faces that look up, and square on
  // to each upright face in that face's own plane. One projection skewed by the normal drew the net out into long swirls
  // wherever a wall turned)
  // (seventh pass) down the exit canyon (exW) the reef takes the one projection down the sun again, skewed by the face's own
  // lean: there the walls are seen along their length, and that net lies on them as broad warm swirls of light where the
  // square-on nets drew a fine bright mesh over the whole face, which with the cool cast read as ice
  float exW = exitK * solid;
  vec2 cp = lp.xz - uSunDir.xz * (lp.y / max(uSunDir.y, 0.2)) + Ng.xz * (lp.y * 0.55 * exW);
  // (on the reef the net is gone 18 m down; on open sand a larger, softer net still crawls at 30 m, so no floor is ever bare)
  float cScale = mix(0.85, 0.5, sand);
  float wT = mix(mix(smoothstep(0.30, 0.72, abs(Ng.y)), 1.0, exW), 1.0, sand), wX = Ng.x * Ng.x, wZ = Ng.z * Ng.z, wS = (1.0 - wT) / max(wX + wZ, 1e-4), caus = 0.0;
  if (wT > 0.01) caus += wT * (swCaustic(cp * cScale, uTime * 1.3) + 0.6 * swCaustic(cp * (cScale * 2.25) + 7.3, uTime * 1.7 + 2.0));
  if (wX * wS > 0.01) { vec2 c1 = vec2(lp.z + 0.4 * lp.y, lp.y * 1.15 + 3.0); caus += wX * wS * (swCaustic(c1 * 0.85, uTime * 1.3) + 0.6 * swCaustic(c1 * 1.9 + 7.3, uTime * 1.7 + 2.0)); }
  if (wZ * wS > 0.01) { vec2 c2 = vec2(lp.x - 0.4 * lp.y, lp.y * 1.15 + 11.0); caus += wZ * wS * (swCaustic(c2 * 0.85, uTime * 1.3) + 0.6 * swCaustic(c2 * 1.9 + 7.3, uTime * 1.7 + 2.0)); }
  caus *= mix(smoothstep(uSurfaceY - 22.0, uSurfaceY - 6.0, lp.y), 0.22 + 0.78 * smoothstep(uSurfaceY - 34.0, uSurfaceY - 9.0, lp.y), sand);
  caus *= 1.0 - 0.35 * exW * smoothstep(36.0, 74.0, dCam);   // (the net is a third dimmer on the far, cool walls of the exit)
  // (eighth pass) on the reef the net lies on the faces that look up: ledges, the tops of buttresses and boulders, the upper
  // lip of every plate (the painted relief counts). An upright face keeps none of it beside the lens and a little of it far
  // off, where the net is all that tells a wall from the water; down the exit canyon the walls keep theirs (the seventh
  // pass's broad warm swirls, which that stretch is lit by) beyond some 44 m of the lens; nearer, an upright face gives up
  // most of it (all but a seventh within 20 m) and shows its plates and their shadows instead.
  { float upF = smoothstep(0.10, 0.60, Ng.y + 0.8 * (N.y - Ng.y));
    caus *= mix(1.0, upF, solid * mix(1.0 - 0.45 * smoothstep(18.0, 40.0, dCam), 0.85 * (1.0 - smoothstep(20.0, 44.0, dCam)), exitK));
    caus *= 1.0 - 0.85 * max(tierLip, max(lipA, 0.8 * lipB)); }                // (and none in the pocket of shadow under a plate)
  float shaft = swShaft(lp, uTime);
  vec3 amb = mix(uDeepLight, uSkyLight, N.y * 0.5 + 0.5) + uBounce * clamp(0.2 - N.y, 0.0, 1.0) * 0.5 * solid;
  float dl = swDepth(lp.y);
  // (the sunlit part of the reef loses less of the key to depth than open sand does: it must read as lit, deep in the bowl too)
  vec3 light = uSunColor * mix(dl, 1.0, 0.45 * warm) * ndl * (0.6 + mix(1.7, 2.0 * (1.0 - 0.5 * uFootK), solid) * caus) * mix(0.80 + 0.95 * shaft, 0.90 + 0.45 * shaft, solid) * mix(1.0, mix(0.6, 1.3, warm), solid) + amb * (0.4 + 0.6 * dl);
  // the sunlit rim of the reef keeps its own warm colours (little water between it and the sun); down the face the
  // water's cast grows, but the crust's own colours still show through it: the foot of a wall is rock, never a pane of water
  light = mix(light, vec3(dot(light, vec3(0.3, 0.5, 0.2))), mix(0.36, 0.72, warm) * solid);
  float ao = mix(vCol.a, vCol.a * (0.5 + 0.5 * vCol.a), rock) * (1.0 - (0.42 * pocket + mix(0.28, 0.55, uFootK) * under) * solid) * (1.0 - 0.5 * max(max(lipA, 0.8 * lipB), 1.1 * tierLip));
  // shadows have a colour: creases, undercuts, pockets and the foot of the reef drain to a deep olive-teal that keeps the
  // crust's hue and sits well below the tone of the water behind, so the wall stands as a solid dark mass to its foot
  float aL = dot(alb, vec3(0.3333));
  vec3 shade = mix((uDeepLight * 0.75 + uHazeDeep * 0.35) * (0.4 + aL), alb * (uDeepLight * 1.25 + uSkyLight * 0.30) + uHazeDeep * 0.06, 0.62);
  // (under a high sun the crown is bright and the foot would drain to exactly the water's blue, a wall that reads as a
  // veil: there the foot is tied to the water's own colour taken two steps down and turned toward olive, and it reaches
  // further up the face, so the wall stands as rock to the sand)
  shade = mix(shade, (uHazeCol * 0.50 + alb * 0.09) * vec3(0.90, 1.0, 0.80), uFootK);
  vec3 col = alb * light * ao + shade * (1.0 - ao) * solid;
  col = mix(col, shade, (1.0 - warm) * mix(0.10, 0.42, uFootK) * solid);
  // pale growing rims on the coral domes
  vec3 V = normalize(uCamLocal - lp);
  float fres = 1.0 - max(dot(Ng, V), 0.0);
  col += mound * (alb * 0.6 + 0.12) * (uSkyLight * 0.8 + uSunColor * 0.25 * dl) * fres * fres * (0.3 + 0.7 * smoothstep(-0.3, 0.5, Ng.y));
  col = swHaze(col, lp);
  // (sixth polish pass) down the exit canyon the reef goes to the water's own clean blue with distance, tone for tone: warm
  // coral beside the lens and wherever the sun lands on a crown, blue rock and blue shadow beyond some forty metres (the
  // crust's ochre and rose under teal light read from the bowl as a muddy purple-green)
  // (seventh pass: the cast began 13 m from the lens and reached eight tenths by 44 m, so the near walls of the exit lost
  // their ochre and rose and read as pale ice under the net. Now every wall within some 35 m keeps its warm crust, and the
  // cast comes in from 36 m to 74 m, where the water has half taken the reef anyway, to six tenths at most)
  { float dC = length(lp - uCamLocal), blueK = exitK * smoothstep(36.0, 74.0, dC) * solid * (0.6 - 0.25 * warm * smoothstep(0.5, 1.0, shaft));
    vec3 cool = uHazeCol * 0.95 + uSkyLight * 0.30 + uHazeDeep * 0.15;
    col = mix(col, cool * (dot(col, vec3(0.3, 0.5, 0.2)) / max(dot(cool, vec3(0.3, 0.5, 0.2)), 1e-3)), blueK); }
  gl_FragColor = vec4(col, 1.0);
  // the water takes the reef a little sooner than the scene's fog alone would: crisp beside the lens, an eighth haze thirty
  // metres on, a quarter across the amphitheatre (the walls there stay solid rock: they fade into the blue only with distance)
  #ifdef USE_FOG
    float hzD = max(vFogDepth, 0.0) * mix(0.011, 0.0088 * (1.0 - 0.5 * uFootK), solid);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 1.0 - exp(-hzD * hzD));
  #endif
  #include <fog_fragment>
}`,Nt=`
varying vec3 vDir;
void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,Pt=`
varying vec3 vDir;
${Ge}
void main(){
  vec3 dir = normalize(vDir);
  vec3 col = swWater(dir);
  // Snell's window: the sky squeezed into a wobbling disc 48 degrees wide, ringed by dark
  float az = atan(dir.z, abs(dir.x) < 1e-4 ? 1e-4 : dir.x);
  float wob = 0.012 * sin(az * 7.0 + uTime * 1.3) + 0.009 * sin(az * 13.0 - uTime * 1.9) + 0.006 * sin(az * 23.0 + uTime * 2.6);
  float edge = 0.665 + wob;
  float win = smoothstep(edge - 0.012, edge + 0.035, dir.y);
  vec2 sp = dir.xz / max(dir.y, 0.15) * 14.0;
  float rip = swCaustic(sp * 0.55, uTime * 1.5), rip2 = swCaustic(sp * 1.3 + 4.0, uTime * 2.1);
  vec3 sky = mix(vec3(0.16, 0.50, 0.86), vec3(0.62, 0.90, 1.0), 0.35 + 0.5 * rip) * 1.15;
  float sd = max(dot(dir, uSunDir), 0.0);
  float s2 = sd * sd; s2 *= s2; s2 *= s2; s2 *= s2;            // sd^16
  float s4 = s2 * s2; s4 *= s4;                                // sd^64
  sky += uSunColor * (0.5 * s2 + (1.6 + 2.2 * rip2) * s4 * s4);
  float ring = (1.0 - smoothstep(edge - 0.03, edge + 0.02, dir.y)) * smoothstep(0.30, 0.62, dir.y);
  col = mix(col, uHazeDeep * 0.9 + uHazeCol * 0.25, ring * 0.55);
  col = mix(col, sky, win);
  // sun shafts fanning down from the window
  vec3 ax = normalize(cross(uSunDir, vec3(0.0, 0.0, 1.0)));
  vec3 ay = cross(uSunDir, ax);
  float sx = dot(dir, ax), sy = dot(dir, ay);
  float sa = atan(sy, abs(sx) < 1e-4 ? 1e-4 : sx);
  float sh = 0.5 + 0.5 * sin(sa * 29.0 + sin(sa * 6.0 + uTime * 0.21) * 1.6 + uTime * 0.11);
  sh = sh * sh * sh * (0.35 + 0.65 * (0.5 + 0.5 * sin(sa * 67.0 - uTime * 0.17 + 1.7)));
  float fall = smoothstep(-0.55, 0.25, dir.y) * (1.0 - smoothstep(edge - 0.32, edge + 0.02, dir.y)) * smoothstep(0.1, 0.7, sd);
  col += uSunColor * vec3(0.5, 0.95, 1.0) * sh * fall * 0.06;
  gl_FragColor = vec4(col, 1.0);
}`;async function Lt(h,i){const o=i.getAttribute("position").array,y=i.index.array,l=new Float32Array(o.length);for(let m=0;m<y.length;m+=3){m%9e3===0&&await h.yield?.();const b=y[m]*3,A=y[m+1]*3,k=y[m+2]*3,T=o[k]-o[A],q=o[k+1]-o[A+1],V=o[k+2]-o[A+2],M=o[b]-o[A],O=o[b+1]-o[A+1],ae=o[b+2]-o[A+2],X=q*ae-V*O,$=V*M-T*ae,D=T*O-q*M,R=l[b]+X,te=l[b+1]+$,j=l[b+2]+D,ve=l[A]+X,ye=l[A+1]+$,ge=l[A+2]+D,be=l[k]+X,g=l[k+1]+$,d=l[k+2]+D;l[b]=R,l[b+1]=te,l[b+2]=j,l[A]=ve,l[A+1]=ye,l[A+2]=ge,l[k]=be,l[k+1]=g,l[k+2]=d}for(let m=0;m<l.length;m+=3){m%18e3===0&&await h.yield?.();const b=l[m],A=l[m+1],k=l[m+2],T=1/(Math.sqrt(b*b+A*A+k*k)||1);l[m]=b*T,l[m+1]=A*T,l[m+2]=k*T}const N=new n.BufferAttribute(l,3);N.needsUpdate=!0,i.setAttribute("normal",N)}function wt(){const h=[],i=[],o=[],y=[];return{pos:h,idx:y,v(l,N,m,b,A,k){return h.push(l,N,m),i.push(b.r,b.g,b.b,A),o.push(k),h.length/3-1},quad(l,N,m,b){y.push(l,N,m,l,m,b)},tri(l,N,m){y.push(l,N,m)},build(){const l=new n.BufferGeometry;return l.setAttribute("position",new n.Float32BufferAttribute(h,3)),l.setAttribute("aCol",new n.Float32BufferAttribute(i,4)),l.setAttribute("aMat",new n.Float32BufferAttribute(o,1)),l.setIndex(y),l.computeVertexNormals(),l},async buildAsync(l){const N=new n.BufferGeometry;return N.setAttribute("position",new n.Float32BufferAttribute(h,3)),await l.yield?.(),N.setAttribute("aCol",new n.Float32BufferAttribute(i,4)),await l.yield?.(),N.setAttribute("aMat",new n.Float32BufferAttribute(o,1)),N.setIndex(y),await l.yield?.(),await Lt(l,N),N}}}async function Dt(h,i,o,y,l,N,m,b){const T=o.range(0,50),q=o.int(3,5),V=o.range(-.6,.6),M=new n.Color,O=new n.Color("#9b8d88"),ae=l.ochre.clone().lerp(l.olive,.35),X=l.pink.clone(),$={knob:0},D=(g,d)=>{const I=d<.74?ne(3.4,2.4,Y(0,.24,d))+2.3*Y(.2,.72,d):4.7*Math.sqrt(Math.max(0,1-Math.pow((d-.74)/.262,2))),t=1+.16*Math.sin(g*q+T+d*2)+.09*Math.sin(g*(q*2+1)-T*1.7),r=Math.cos(g),v=Math.sin(g),z=y.fbm3(r*1.3+T,d*3.2,v*1.3,3),P=1-Math.abs(y.n3(r*3.1+T,d*6.5,v*3.1)),F=1-Math.abs(y.n3(r*7.3,d*15+T,v*7.3));$.knob=P*.7+F*.3;const _=Y(.08,.45,d);return I*t*(.84+.18*z)+_*(.62*P*P+.2*F*F-.3)},R=(g,d,I)=>{const t=D(g,d),r=-1+d*(b+1);return I[0]=N+Math.cos(g)*t+V*d*d*1.4,I[1]=r+.25*$.knob*Y(.6,.95,d),I[2]=m+Math.sin(g)*t,I},te=[],j=[0,0,0];for(let g=0;g<=30;g++){await h.yield?.();const d=g/30,I=[];for(let t=0;t<56;t++){const r=t/56*Math.PI*2;R(r,Math.min(d,.998),j);const v=y.n3(j[0]*.5,j[1]*.5,j[2]*.5),z=Y(.25,.8,$.knob);M.copy(O).lerp(X,.45*Y(.55,.1,d)).lerp(ae,Y(.35,.85,d)*(.45+.3*v)),M.multiplyScalar(.8+.3*z);const P=(.4+.6*Y(.04,.6,d))*(.5+.5*z);I.push(i.v(j[0],j[1],j[2],M,P,d>.52?3:1))}te.push(I)}for(let g=0;g<30;g++)for(let d=0;d<56;d++){const I=(d+1)%56;i.quad(te[g][d],te[g+1][d],te[g+1][I],te[g][I])}await h.yield?.();const ve=30,ye=new n.Color("#b9aca0"),ge=[l.ochre,l.olive,l.pink,l.ochre.clone().lerp(l.pink,.5)];for(let g=0;g<ve;g++){g%6===5&&await h.yield?.();const d=o.range(0,Math.PI*2),I=o.range(.4,.94),t=o.range(.55,1.45)*(I>.8?.8:1),r=18;R(d,I,j);const v=j[0]+Math.cos(d)*t*.3,z=j[2]+Math.sin(d)*t*.3,P=j[1]+o.range(.25,.5),F=d+o.range(-.6,.6),_=o.range(.02,.16),w=ye.clone().lerp(o.pick(ge),o.range(.3,.6)).multiplyScalar(o.range(.8,1.05)),le=o.range(0,6.28),H=(G,S)=>-(G*Math.cos(F)+S*Math.sin(F))*_,W=i.v(v,P-.12,z,M.copy(w).multiplyScalar(.72),.85,2),se=i.v(v-Math.cos(d)*t*.3,P-.42,z-Math.sin(d)*t*.3,M.copy(O).multiplyScalar(.7),.35,1),de=[],J=[],fe=[],ie=[];for(let G=0;G<r;G++){const S=G/r*Math.PI*2,re=t*(.88+.09*Math.sin(S*3+le)+.06*Math.sin(S*5-le*2)),De=Math.cos(S)*re*.55,Fe=Math.sin(S)*re*.55,we=Math.cos(S)*re,ue=Math.sin(S)*re,xe=G%2?.66:1;de.push(i.v(v+De,P-.04+H(De,Fe)+(G%2?-.02:.02),z+Fe,M.copy(w).multiplyScalar(.86*xe),.95,2)),J.push(i.v(v+we,P+.05+H(we,ue)+(G%2?-.03:.03),z+ue,M.copy(w).lerp(l.white,.4).multiplyScalar(xe),1,2)),fe.push(i.v(v+we*.96,P-.08+H(we,ue),z+ue*.96,M.copy(w).multiplyScalar(.5),.55,2)),ie.push(i.v(v+we*.3,P-.15+H(we,ue)*.3,z+ue*.3,M.copy(w).multiplyScalar(.4),.4,2))}for(let G=0;G<r;G++){const S=(G+1)%r;i.tri(W,de[S],de[G]),i.quad(de[G],de[S],J[S],J[G]),i.quad(J[G],J[S],fe[S],fe[G]),i.quad(fe[G],fe[S],ie[S],ie[G]),i.tri(ie[G],ie[S],se)}}await h.yield?.();const be=34;for(let g=0;g<be;g++){const d=o.range(0,Math.PI*2),I=o.range(3.6,9),t=o.range(.25,.9)*(1.2-I/13),r=o.range(0,9),v=N+Math.cos(d)*I,z=m+Math.sin(d)*I,P=t*.2,F=7,_=4,w=[],le=o.range(.55,.85);M.copy(O).lerp(o.chance(.4)?X:ae,o.range(.1,.4)).multiplyScalar(o.range(.7,1.05));for(let H=0;H<=_;H++){const W=[],se=H/_*Math.PI;for(let de=0;de<F;de++){const J=de/F*Math.PI*2,fe=.78+.3*Math.sin(J*2+r+H)+.16*Math.sin(J*3-r*2+H*1.7),ie=Math.sin(se)*t*fe;W.push(i.v(v+Math.cos(J)*ie*1.3,P+Math.cos(se)*t*le,z+Math.sin(J)*ie,M,.5+.5*Y(-.5,.6,Math.cos(se)),1))}w.push(W)}for(let H=0;H<_;H++)for(let W=0;W<F;W++){const se=(W+1)%F;i.quad(w[H][W],w[H][se],w[H+1][se],w[H+1][W])}}}async function Kt(h,i,o,y,l,N,m){const T=new n.Color,q=[],V=i.v(0,0,0,y.sand,1,0);for(let M=1;M<=28;M++){M%3===0&&await h.yield?.();const O=300*Math.pow(M/28,1.7),ae=[];for(let X=0;X<72;X++){const $=X/72*Math.PI*2,D=Math.cos($)*O,R=Math.sin($)*O,te=Math.hypot(D-l,R-N);let j=.55*o.fbm2(D*.035,R*.035,3)+.2*o.n2(D*.15,R*.15)-.3;m&&(j-=.9*Y(13,6,te)*Y(2.5,5.5,te)),T.copy(y.sand).multiplyScalar(.9+.12*o.n2(D*.06+9,R*.06)),ae.push(i.v(D,j,R,T,m?.6+.4*Y(3,9,te):1,0))}q.push(ae)}await h.yield?.();for(let M=0;M<72;M++)i.tri(V,q[0][(M+1)%72],q[0][M]);for(let M=0;M<27;M++)for(let O=0;O<72;O++){const ae=(O+1)%72;i.quad(q[M][O],q[M][ae],q[M+1][ae],q[M+1][O])}}async function qt(h,i={}){const o=h.rng.fork("shark-wall"),y=o,l=h.noise,N=h.quality?.detail??1,m=(i.palette&&i.palette.length>=7?i.palette:Mt).map(e=>new n.Color(e)),[,b,A,k,T,q]=m,V=new n.Group;V.name="shark-wall";const M=i.crossAngle??o.range(50,56),O=M*Math.PI/180,ae=new n.Vector3(Math.sin(O),0,Math.cos(O)),X=new n.Vector3(Math.cos(O),0,-Math.sin(O)),$=o.range(6.2,7.8),D=o.range(32,46),R=o.range(0,100),te=o.range(0,100),j=new n.Color(i.haze??"#1B7FA6").offsetHSL(o.range(-.012,.012),0,o.range(-.015,.02)),ve=new n.Color(i.hazeDeep??q),ye=(i.sunDir?new n.Vector3().copy(i.sunDir):new n.Vector3(-.071,.978,.195)).normalize(),ge=i.sunColor?new n.Color(i.sunColor):new n.Color("#FFF8EA").multiply(new n.Color(.5,.84,.95)).multiplyScalar(1.7),be=i.skyLight?new n.Color(i.skyLight):b.clone().multiplyScalar(.34).add(j.clone().multiplyScalar(.95)),g=i.deepLight?new n.Color(i.deepLight):q.clone().multiplyScalar(1.3).add(j.clone().multiplyScalar(.28)),d={uTime:{value:0},uSunDir:{value:ye},uSunColor:{value:ge},uSkyLight:{value:be},uDeepLight:{value:g},uHazeCol:{value:j},uHazeDeep:{value:ve},uCamLocal:{value:new n.Vector3(0,14,400)},uHaze:{value:0},uSurfaceY:{value:pt},uBounce:{value:i.bounce?new n.Color(i.bounce):ge.clone().multiply(new n.Color(.2,.23,.21))},uFootK:{value:Ae(i.footDark??0,0,1)}},I=()=>n.UniformsUtils.clone(n.UniformsLib.fog),t=Math.max(60,Math.round(i.count??600)),r=Math.min(1,t/600),v=11,z=-64,P=8,F=i.halfWidth??41,_=e=>14+e*(e>0?.022:.03),w=7.5,le=new Map,H=e=>Math.floor(e/w)+64,W=e=>{const a=H(e.x)+128*(H(e.y)+128*H(e.z));let s=le.get(a);return s||le.set(a,s=[]),s.push(e),e},se=(e,a,s,c)=>{const p=H(e),K=H(a),U=H(s),L=c*c;for(let E=-1;E<=1;E++)for(let oe=-1;oe<=1;oe++)for(let f=-1;f<=1;f++){const u=le.get(p+E+128*(K+oe+128*(U+f)));if(u)for(let x=0;x<u.length;x++){const C=u[x],B=C.x-e,Q=(C.y-a)*1.55,ee=C.z-s;if(B*B+Q*Q+ee*ee<L)return!1}}return!0},de=[];{let e=o.range(0,6.28),a=45;for(;a>-40&&de.length<Math.round(100*r);){const s=a<-30,c=s?o.range(1.6,3.6):o.range(1.35,1.95);e+=2.4+o.range(-.3,.3);let p=Math.cos(e)*c*1.2;const K=Math.sin(e)*c*.85;Math.abs(K)<.75&&Math.abs(p)<1.65&&(p=(p<0?-1:1)*1.65),de.push(W({x:p,y:_(a)+K,z:a,line:c,big:!0})),a-=s?o.range(1.6,2.4):o.range(.7,1.05)}}await h.yield?.();const J=[];for(let e=0;e<6e4&&J.length<t;e++){e%300===299&&await h.yield?.();const a=o.range(-F-4,F+4),s=o.range(-50,50),c=o.range(4,24),p=Math.hypot(a,(c-_(s))*1.3),K=Math.exp(-(p*p)/240);if(o()>(.2+.8*K)*(s<-12?ne(1,.6,Y(-12,-48,s)):1))continue;const U=l.n2(a*.045+R,s*.045+te),L=l.n2(a*.05-te,s*.05+R+30),E=l.n2(s*.06+R,c*.12+te),oe=l.n2(a*.06+te,c*.12-R);if(c>22.8+1.6*U||c<4.6+1.6*L||Math.abs(a)>F-2+3.5*E||s>43+5*oe||s<-39+4*oe||p<2.7)continue;const f=ne(3.3,5.6,Y(.75,.1,K));se(a,c,s,f)&&J.push(W({x:a,y:c,z:s,line:p}))}await h.yield?.();const fe=[];for(let e=0;e<2e3&&fe.length<Math.round(38*r);e++){const a=o.range(47,81),s=ne(30,11,Y(47,81,a)),c=o.range(-s,s),p=o.range(3.7,5.2)+5.5*o()*o();se(c,p,a,4.2)&&fe.push(W({x:c,y:p,z:a,line:99}))}await h.yield?.();const ie=ut("shark-wall-step:"+(h.seed??0)),G=[];for(let e=0;e<2500&&G.length<Math.round(34*r);e++){const a=ie.range(48,90),s=a>=90?13:13+34.5*Y(90,62,a),c=Math.min(16,s-5.5),p=(ie.chance(.5)?1:-1)*ie.range(4.5,Math.max(5.5,c)),K=a>70?16.5+(a-70)*.0577:15+(a-46)*.0625,U=K+ie.range(-5,1.5);se(p,U,a,4.6)&&G.push(W({x:p,y:U,z:a,line:99,big:Math.abs(p)<11}))}await h.yield?.();const S=ut("shark-wall-front:"+(h.seed??0)),re=e=>e>46?15+(e-46)*.0625:_(e),De=e=>e>=90?13:e>=62?13+34.5*Y(90,62,e):47.5,Fe=[],we=[],ue=[];{let e=S.range(0,6.28),a=83;for(;a>45.7&&Fe.length<Math.round(46*r);){const s=S.range(1.4,2.1);e+=2.4+S.range(-.3,.3);let c=Math.cos(e)*s*1.2;const p=Math.sin(e)*s*.85;Math.abs(p)<.75&&Math.abs(c)<1.65&&(c=(c<0?-1:1)*1.65),Fe.push(W({x:c,y:re(a)+p,z:a,line:s,big:!0})),a-=S.range(.8,1.2)}}for(let e=0;e<1500&&we.length<Math.round(20*r);e++){const a=S.range(50,88),s=(S.chance(.5)?1:-1)*S.range(3.2,Math.min(9,De(a)-6)),c=re(a)+S.range(-3,2.4);se(s,c,a,4)&&we.push(W({x:s,y:c,z:a,line:99,big:!0}))}await h.yield?.();for(let e=0;e<9e3&&ue.length<Math.round(140*r);e++){e%300===299&&await h.yield?.();const a=S.range(43,75),s=Math.min(F+2,De(a)-7),c=S.range(-s,s),p=S.range(4.5,24),K=Math.hypot(c,(p-re(a))*1.3),U=Math.exp(-(K*K)/260);S()>(.22+.78*U)*ne(1,.45,Y(58,75,a))||K<2.8||se(c,p,a,ne(3.3,5.4,Y(.75,.1,U)))&&ue.push(W({x:c,y:p,z:a,line:K}))}await h.yield?.(),ue.sort((e,a)=>e.line-a.line),J.sort((e,a)=>e.line-a.line),await h.yield?.();const xe=Math.min(J.length,Math.round(110*r)),$e=J.slice(0,xe).concat(fe),Je=$e.length,Ee=Math.max(0,Math.round((J.length-xe)*Ae(N,.5,1))),Ce=Math.min(ue.length,Math.round(34*r)),Ie=Math.max(0,Math.round((ue.length-Ce)*Ae(N,.5,1))),gt=o.chance(.8)?o.int(8,14):0,Qe=new Map;for(let e=0;e<gt;e++)Qe.set(o.int(0,Math.max(0,Math.min(J.length,xe+80)-1)),o.chance(.6)?1:2);const me={...I(),...d,uCamDir:{value:new n.Vector3(0,0,-1)},uHead:{value:new n.Vector2(Math.sin(O),Math.cos(O))},uSway:{value:new n.Vector4(.6,Math.PI*2/D,Math.PI*2/$,.11)},uPart:{value:1},uCamFwd:{value:new n.Vector3(0,0,-1)},uCamRt:{value:new n.Vector3(1,0,0)},uCamUp:{value:new n.Vector3(0,1,0)},uGate:{value:new n.Vector4(1.07,.6,2,6)},uPacA:{value:Array.from({length:Le},()=>new n.Vector4(0,-999,0,0))},uPacB:{value:Array.from({length:Le},()=>new n.Vector4(0,0,1,1))},uBack:{value:new n.Color(.165,.17,.172)},uBronze:{value:T.clone().multiplyScalar(.36).lerp(new n.Color(.24,.21,.17),.4)},uBelly:{value:k.clone().multiplyScalar(.86)},uBounce:d.uBounce},vt=new n.ShaderMaterial({uniforms:me,vertexShader:St,fragmentShader:mt,fog:!0,side:n.DoubleSide});await h.yield?.();const Be=(e,a)=>{const s=Math.sin(e.x*12.9898+e.y*78.233+e.z*37.719+a*4.137)*43758.5453;return s-Math.floor(s)},ke=(e,a,s=y)=>{const c=e.length,p=new Float32Array(c*3),K=new Float32Array(c*4),U=new Float32Array(c*4);for(let f=0;f<c;f++){const u=e[f],x=Qe.get(a+f)??0;p.set([u.x,u.big&&(u.line??99)<5?re(u.z)+(u.y-re(u.z))*.72:u.y,u.z],f*3);const C=u.big?s.range(2.25,2.65):x===2?s.range(2.4,2.9):x===1?s.range(1.7,2):s.range(1.85,2.3),B=Be(u,1),Q=Be(u,2),ee=Be(u,3),ce=Ae(C*(B<.16?ne(.62,.76,B/.16):B<.84?ne(.8,1.04,(B-.16)/.68):ne(1.08,1.24,(B-.84)/.16)),1.4,2.8),Me=!u.big&&(u.line??0)>6&&Math.hypot(u.x,u.y-re(u.z))>8&&Q>.62?.25:0,pe=ee>.7?(Be(u,4)-.5)*.24:0,kt=!u.big&&ee<.36?(Be(u,5)-.5)*.9:0;K.set([ce,s(),s.range(.52,.8)*(1.7/ce),x+Me],f*4);const zt=Math.hypot(u.x,u.y-re(u.z));U.set([kt+s.gauss()*.07+.25*Y(6,-20,u.x)+.3*Y(.4,-2.2,u.x)*(1-Y(8,13,zt)),s.gauss()*.025+pe,s.range(16,44),s()],f*4)}const L=new Map,E=f=>Math.floor(f.z/26+.37*Math.sign(f.x))*64+Math.floor(f.y/14)*4+(f.x>0?1:0),oe=f=>!f.big&&Math.hypot(f.x,f.y-re(f.z))>9;for(let f=0;f<c;f++){const u=e[f];if(!oe(u))continue;const x=E(u),C=L.get(x)||[0,0,0,0];C[0]+=u.x,C[1]+=u.y,C[2]+=u.z,C[3]++,L.set(x,C)}for(let f=0;f<c;f++){const u=e[f];if(!oe(u))continue;const x=E(u),C=L.get(x),B=Math.sin(x*12.9898+4.7)*43758.5453,Q=B-Math.floor(B);if(C[3]<3||Q>.56)continue;const ee=.3+.2*Be(u,6),ce=ne(u.x,C[0]/C[3],ee),Me=ne(u.y,C[1]/C[3],ee),pe=ne(u.z,C[2]/C[3],ee);Math.hypot(ce,Me-re(pe))>8.5&&p.set([ce,Me,pe],f*3)}return{n:c,iPos:p,iA:K,iB:U}},et=(e,a)=>{const s=(c,p)=>{const K=new Float32Array(c.length+p.length);return K.set(c),K.set(p,c.length),K};return{n:e.n+a.n,iPos:s(e.iPos,a.iPos),iA:s(e.iA,a.iA),iB:s(e.iB,a.iB)}},_e=[null,null,null],tt=[],at=[],ze=(e,a,s,c,p=null,K=!1)=>{const U=_e[e]||(_e[e]=ft(e)),L=new n.InstancedBufferGeometry;L.setIndex(U.index);for(const B of["position","normal","aInfo"])L.setAttribute(B,U.attributes[B]);const E=s.length,oe=new Float32Array(E*3),f=new Float32Array(E*4),u=new Float32Array(E*4),x=new Float32Array(E);for(let B=0;B<E;B++){const Q=s[B];oe.set(a.iPos.subarray(Q*3,Q*3+3),B*3),f.set(a.iA.subarray(Q*4,Q*4+4),B*4),u.set(a.iB.subarray(Q*4,Q*4+4),B*4),x[B]=a.iPos[Q*3+2]}L.setAttribute("iPos",new n.InstancedBufferAttribute(oe,3)),L.setAttribute("iA",new n.InstancedBufferAttribute(f,4)),L.setAttribute("iB",new n.InstancedBufferAttribute(u,4)),L.instanceCount=E,L.boundingSphere=new n.Sphere(new n.Vector3(0,14,0),100);const C=new n.Mesh(L,vt);return C.name=c,K&&(C.frustumCulled=!1),V.add(C),p&&E&&tt.push({mesh:C,g:L,zs:x,n:E,...p}),C},Ne=(e,a)=>{const s=Array.from({length:e.n},(c,p)=>p);return s.sort((c,p)=>a*(e.iPos[c*3+2]-e.iPos[p*3+2])),s},Ke={asc:!0,off:14},yt=ke(de,5e5),ot=ke($e,0),st=ke(J.slice(xe,xe+Ee),Je);await h.yield?.();const Ye=et(ke(Fe,6e5,S),yt),Ve=Ne(Ye,-1).filter((e,a)=>a%5!==2),nt=5,lt=Math.ceil(Ve.length/nt);for(let e=0;e<nt;e++)ze(2,Ye,Ve.slice(e*lt,(e+1)*lt),"sharks-tunnel",{asc:!1,off:14,back:5});ze(0,Ye,Ve.slice().reverse(),"sharks-tunnel-ahead",{asc:!0,off:-14,swap:!0}),await h.yield?.(),ze(0,ot,Ne(ot,1),"sharks-near",Ke),await h.yield?.(),Ee>0&&ze(1,st,Ne(st,1),"sharks-far",Ke),await h.yield?.();const Oe=et(ke(G,2e5,ie),ke(we,7e5,S));Oe.n&&ze(0,Oe,Ne(Oe,1),"sharks-step",Ke),await h.yield?.();const Ue=ke(ue.slice(0,Ce+Ie),8e5,S),it=(e,a)=>Ne(Ue,1).filter(s=>s>=e&&s<a);Ce&&ze(0,Ue,it(0,Ce),"sharks-front-near",Ke),Ie&&ze(1,Ue,it(Ce,Ce+Ie),"sharks-front-far",Ke),await h.yield?.();const He={sand:T.clone().lerp(k,.3).multiplyScalar(.62),white:k.clone().multiplyScalar(.8),ochre:new n.Color("#D69A45"),olive:new n.Color("#928C62"),pink:T.clone().lerp(new n.Color("#D97C92"),.45)},bt=()=>({...I(),...d,uPink:{value:He.pink},uOchre:{value:He.ochre},uOlive:{value:He.olive},uBounce:d.uBounce,uFlow:{value:new n.Vector2(ae.x,ae.z)}}),We=new n.ShaderMaterial({uniforms:bt(),vertexShader:Ft,fragmentShader:Bt,fog:!0,side:n.DoubleSide}),rt=i.coralHead!==!1;if(rt){const e=wt();await Dt(h,e,o.fork("head"),l,He,v,z,P),await h.yield?.();const a=new n.Mesh(await e.buildAsync(h),We);a.name="coral-head",V.add(a)}await h.yield?.();const ct=wt();await Kt(h,ct,l,He,v,z,rt),await h.yield?.();const Re=new n.Mesh(await ct.buildAsync(h),We);Re.name="standalone-floor",Re.visible=!1,V.add(Re),await h.yield?.();const Se=new n.Mesh(new n.SphereGeometry(900,40,24),new n.ShaderMaterial({uniforms:{...d},vertexShader:Nt,fragmentShader:Pt,side:n.BackSide,depthWrite:!1,depthTest:!1,fog:!1}));Se.name="standalone-water",Se.renderOrder=-.5,Se.frustumCulled=!1,Se.visible=!1,V.add(Se);let ht=i.standalone===!0?!0:i.standalone===!1?!1:null;const Pe=new n.Vector3,dt=new n.Vector3,qe=new n.Vector3,Ze=new n.Vector3,Te=new n.Matrix4;let Xe=!0;const xt=(e,a,s)=>{d.uTime.value=a;let c=V;for(;c.parent;)c=c.parent;const p=c!==V?c.fog:null,K=!!p&&(p.isFogExp2&&p.density>=.004||p.isFog&&p.far<400),U=ht??!K;if(Re.visible=U,Se.visible=U,d.uHaze.value=U?.0095:0,!s)return;V.updateWorldMatrix(!0,!1),Te.copy(V.matrixWorld).invert(),s.matrixAutoUpdate!==!1&&s.updateMatrixWorld(),Pe.setFromMatrixPosition(s.matrixWorld).applyMatrix4(Te),qe.set(0,0,-1).transformDirection(s.matrixWorld).transformDirection(Te);const L=me.uCamDir.value;Ze.subVectors(Pe,dt);const E=e>1e-4?Ze.length()/e:0,oe=!Xe&&E>1&&E<60?Ze.normalize():qe;Xe||!(e>1e-4)?L.copy(oe):L.lerp(oe,1-Math.exp(-e*5)).normalize(),L.lengthSq()>.5||L.copy(qe),dt.copy(Pe),Xe=!1,d.uCamLocal.value.copy(Pe);{const x=s.matrixWorld.elements,C=s.projectionMatrix.elements,B=me.uGate.value;me.uCamFwd.value.copy(qe),me.uCamRt.value.set(x[0],x[1],x[2]).transformDirection(Te),me.uCamUp.value.set(x[4],x[5],x[6]).transformDirection(Te),B.x=1/Math.max(C[0],.2),B.y=1/Math.max(C[5],.2)}Se.position.copy(Pe);const f=qe.z<-.3,u=Pe.z;for(const x of tt){const C=x.zs;let B=x.n,Q=!0;if(f){let ee=0,ce=x.n;if(x.asc){const Me=u+x.off;for(;ee<ce;){const pe=ee+ce>>1;C[pe]<=Me?ee=pe+1:ce=pe}}else{const Me=u-x.off;for(;ee<ce;){const pe=ee+ce>>1;C[pe]>Me?ee=pe+1:ce=pe}Q=x.back===void 0||C[x.n-1]<u+x.back}B=ee}else x.swap&&(B=0);x.g.instanceCount=B,x.mesh.visible=Q&&B>0}},Z=(e,a,s)=>new n.Vector3(e,a,s);return{object:V,radius:24,height:24,center:Z(0,14,0),anchors:{heading:ae.clone(),crossAngle:M,flyThrough:[Z(0,18,96),Z(0,16.5,70),Z(0,15,46),Z(0,14.5,20),Z(0,14,0),Z(0,13.4,-24),Z(0,12.6,-46),Z(0,9.2,-64),Z(-1,5,-90)],viewpoints:{bend:Z(0,17,78),inside:Z(0,14,0),exit:Z(0,12.6,-46)},sheet:{center:Z(0,14,0),size:[80,20,80],yMin:4,yMax:24},coralHead:{position:Z(v,0,z),crownY:P,radius:5},mantaOrbit:{center:Z(v,10.5,z),radius:7,y:10.5},escortLanes:[Z(-9,9,-70),Z(7,12,-40)],portalSeat:{position:Z(-4,20,-186),facing:Z(0,-.342,.94)},surfaceY:pt,floorY:0},uniforms:{...d,...me},rockMaterial:We,count:Ve.length+Je+Ee+Oe.n+Ce+Ie,addSharks(e,a=0,s={}){if(!e||!e.length)return null;const c=ke(e,1e6+(s.offset??0),s.rng??y);return ze(a,c,Ne(c,-1),s.name??"sharks-stragglers",s.range?{asc:!1,off:s.range,back:s.back??14}:null,!0)},addPacer(e={}){const a=at.length;if(a>=Le)return null;const s=e.length??2.7,c=new n.Matrix4,p=new n.Vector4(s,e.phase??.31+.23*a,e.variant??0,0),K=new n.Vector3(0,0,0),U=new n.ShaderMaterial({uniforms:{...me,uPM:{value:c},uPA:{value:p},uPB:{value:K}},vertexShader:At,fragmentShader:mt,fog:!0,side:n.DoubleSide}),L=new n.Mesh(_e[2]||(_e[2]=ft(2)),U);L.name="shark-pacer",L.frustumCulled=!1,L.visible=!1,V.add(L);const E=me.uPacA.value[a],oe=me.uPacB.value[a],f=c.elements,u={mesh:L,length:s,place(x,C,B=0,Q=0,ee=0,ce=2){if(L.visible=!!C,!C){E.set(0,-999,0,0);return}c.copy(x),K.set(B,Q,0),p.w=ee,E.set(f[12],f[13],f[14],ce),oe.set(f[8],f[9],f[10],s*.46)}};return at.push(u),u},setParting(e){me.uPart.value=Ae(e,0,1)},setStandalone(e){ht=e==null?null:!!e},setLight(e={}){e.sunDir&&ye.copy(e.sunDir).normalize(),e.sunColor&&ge.set(e.sunColor),e.skyLight&&be.set(e.skyLight),e.deepLight&&g.set(e.deepLight),e.haze&&j.set(e.haze),e.hazeDeep&&ve.set(e.hazeDeep)},update:xt,dispose(){},ground:!1,groundY:0}}export{qt as buildHero,wt as makeWriter,ft as sharkGeometry,Lt as vertexNormalsInSlices};
