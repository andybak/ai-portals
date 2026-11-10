import*as d from"three";const Gt={alert:2.3,run:1.4,climb:1.3,climbPerM:.09},Ut=["#9E1B2C","#5C0F1E","#F3A0B4","#D81E3A","#F2EEE6","#CBDDE3","#6E6F73"],Se=Math.PI*2;function Ne(f,t,r){const S=[],P=[],Fe=[],ve=[],me=[],E=[],Re=[],j=(n,i,m,p,u)=>(S.push(n[0],n[1],n[2]),P.push(i[0],i[1],i[2]),Fe.push(m.r,m.g,m.b),ve.push(p.r,p.g,p.b),me.push(u[0],u[1],u[2],u[3]),S.length/3-1),We=(n,i,m,p)=>{E.push(n,i,m),Re.push(p?1:0)},I=(n,i,m,p,u)=>{We(n,i,m,u),We(n,m,p,u)},B=(n,i,m)=>n.clone().lerp(i,m),te=(n,i)=>n.clone().multiplyScalar(1+(r()-.5)*i),G=f<0?[[-.27,.006,.006,.04],[-.228,.03,.025,.031],[-.175,.057,.047,.019],[-.11,.086,.071,.006],[-.04,.106,.087,-.003],[.03,.111,.091,-.006],[.09,.099,.081,.003],[.14,.073,.061,.018],[.178,.043,.039,.032],[.2,.027,.027,.039]]:f===0?[[-.27,.006,.006,.04],[-.18,.05,.042,.02],[-.08,.096,.078,0],[.01,.112,.092,-.006],[.09,.098,.08,.004],[.155,.058,.05,.024],[.2,.026,.026,.038]]:f===1?[[-.27,.006,.006,.04],[-.1,.09,.074,.004],[.07,.108,.088,0],[.2,.028,.028,.036]]:[[-.27,.006,.006,.04],[0,.11,.09,0],[.2,.028,.028,.036]],Z=f<0?10:f===0?6:f===1?4:3,g=[];for(let n=0;n<G.length;n++){const[i,m,p,u]=G[n],T=S.length/3;g.push(T);for(let ne=0;ne<Z;ne++){const U=(ne+.5)/Z*Se,L=Math.sin(U),N=Math.cos(U),y=B(B(t.belly,t.pink,N*.5+.5),t.rose,Math.max(0,-i*2.2)*.5),ae=Math.hypot(L*m,N*p)||1;j([L*p,u+N*m*(N<0?1.08:1),i],[L*m/ae,N*p/ae,n===0?-.6:n===G.length-1?.6:0],te(y,.08),y,[0,0,0,0])}}for(let n=0;n<G.length-1;n++)for(let i=0;i<Z;i++){const m=g[n]+i,p=g[n]+(i+1)%Z,u=g[n+1]+(i+1)%Z,T=g[n+1]+i;I(m,p,u,T,!0)}const ce=f<0?12:f===0?7:f===1?3:2;let D=null;for(let n=0;n<=ce;n++){const i=n/ce,m=.036-.015*i+.01*Math.max(0,1-i*5),p=B(t.pink,t.pale,i*.7),u=j([0,.035+.45*i,.15],[0,0,1],p,p,[1,i,m,0]),T=j([0,.035+.45*i,.15],[0,0,1],p,p,[1,i,-m,0]);D&&I(D[0],D[1],T,u,!1),D=[u,T]}const $=f<=0?[[0,0,.021,t.pale],[.032,.013,.036,t.pale],[.066,.008,.033,t.pink],[.094,-.004,.025,t.bill],[.124,-.032,.019,t.bill],[.142,-.07,.006,t.black]]:f===1?[[0,0,.021,t.pale],[.042,.013,.036,t.pale],[.094,-.004,.025,t.bill],[.142,-.07,.007,t.black]]:[[0,0,.02,t.pale],[.05,.008,.03,t.pink],[.13,-.06,.008,t.bill]];D=null;for(const n of $){const i=j([0,.5,.2+n[0]],[0,0,1],n[3],n[3],[2,n[0],n[1],n[2]]),m=j([0,.5,.2+n[0]],[0,0,1],n[3],n[3],[2,n[0],n[1],-n[2]]);D&&I(D[0],D[1],m,i,!1),D=[i,m]}const O=f<=0?[[0,.013],[.25,.009],[.47,.011],[.5,.015],[.53,.01],[.93,.008],[.95,.024],[1,.016]]:f===1?[[0,.012],[.5,.013],[.94,.009],[1,.02]]:[[0,.013],[1,.013]];for(let n=3;n<=4;n++){D=null;for(const i of O){const m=i[0]>.94||Math.abs(i[0]-.5)<.02?t.legDark:t.leg,p=j([n===3?.045:-.045,-.06-.5*i[0],-.02],[0,0,1],m,m,[n,i[0],i[1],0]),u=j([n===3?.045:-.045,-.06-.5*i[0],-.02],[0,0,1],m,m,[n,i[0],-i[1],0]);D&&I(D[0],D[1],u,p,!1),D=[p,u]}}const ze=f<0?[0,.1,.2,.31,.42,.53,.64,.75,.85,.93,1]:f===0?[0,.2,.42,.64,.84,1]:f===1?[0,.45,1]:[0,1],Ce=f<0?[1,.45,-.25,-1]:f===0?[1,0,-1]:[1,-1];for(let n=5;n<=6;n++){const i=n===5?1:-1,m=[];for(let p=0;p<ze.length;p++){const u=ze[p],T=Math.max(u-.3,0)/.7,ne=.115*(1-.5*u)*Math.max(Math.pow(1-T*T,.7),.16),U=.03-.08*u-.035*T*T;m.push([]);for(const L of Ce){let N,y;L>.5?(N=u<.5?B(t.pink,t.scarlet,.35+u):B(t.scarlet,t.black,(u-.5)*2),y=u<.62?t.scarlet:B(t.scarlet,t.black,(u-.62)*2.6)):L>-.5?(N=u<.3?t.pink:u<.58?B(t.pink,t.scarlet,(u-.3)*3.5):t.black,y=u<.5?B(t.scarlet,t.crimson,.3):t.black):(N=u<.1?t.rose:t.black,y=u<.1?t.scarlet:t.black),f>0&&L>.5&&(N=u<.7?B(t.pink,t.scarlet,.5+u*.5):t.black,y=u<.7?t.scarlet:t.black),f<0&&(L>.5?(N=u<.55?B(t.pink,t.scarlet,.3+u):B(t.scarlet,t.black,Math.min(1,(u-.55)*3)),y=u<.66?t.scarlet:B(t.scarlet,t.black,Math.min(1,(u-.66)*4))):L>.2?(N=u<.22?t.pink:u<.6?B(t.pink,t.scarlet,(u-.22)*2.6):B(t.scarlet,t.black,Math.min(1,(u-.6)*5)),y=u<.58?B(t.scarlet,t.crimson,.25):B(t.scarlet,t.black,Math.min(1,(u-.58)*5))):L>-.5&&(N=u<.12?t.rose:t.black,y=u<.12?t.scarlet:t.black));const ae=U+L*ne;m[p].push(j([i*(.06+u*.5),.05,ae],[0,1,0],N,y,[n,u,ae,L]))}}for(let p=0;p<ze.length-1;p++)for(let u=0;u<Ce.length-1;u++)I(m[p][u],m[p+1][u],m[p+1][u+1],m[p][u+1],!0)}const Pe=new d.Vector3,q=new d.Vector3,Q=new d.Vector3,fe=new d.Vector3;for(let n=0;n<E.length;n+=3){if(!Re[n/3])continue;const i=E[n],m=E[n+1],p=E[n+2];Pe.set(S[i*3],S[i*3+1],S[i*3+2]),q.set(S[m*3],S[m*3+1],S[m*3+2]),Q.set(S[p*3],S[p*3+1],S[p*3+2]),fe.copy(q).sub(Pe).cross(Q.sub(Pe)),fe.x*(P[i*3]+P[m*3]+P[p*3])+fe.y*(P[i*3+1]+P[m*3+1]+P[p*3+1])+fe.z*(P[i*3+2]+P[m*3+2]+P[p*3+2])<0&&(E[n+1]=p,E[n+2]=m)}const X=new d.BufferGeometry;return X.setAttribute("position",new d.Float32BufferAttribute(S,3)),X.setAttribute("normal",new d.Float32BufferAttribute(P,3)),X.setAttribute("color",new d.Float32BufferAttribute(Fe,3)),X.setAttribute("aCol2",new d.Float32BufferAttribute(ve,3)),X.setAttribute("aPart",new d.Float32BufferAttribute(me,4)),X.setIndex(E),X}function It(){const f=new d.BufferGeometry;return f.setAttribute("position",new d.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),f.setIndex([0,1,2,0,2,3]),f}function Me(f,t,r){const S=new d.InstancedBufferGeometry;S.index=f.index;for(const P in f.attributes)S.setAttribute(P,f.attributes[P]);for(const P in t)S.setAttribute(P,new d.InstancedBufferAttribute(t[P].subarray(0,r*4),4));return S.instanceCount=r,S}const Ye=`
uniform float uTime, uFront, uVF, uPix, uMarchW, uRipple;
uniform vec3 uCam;
uniform vec4 uLane;   // lane start station, lane full station, corridor half width, lane half width
uniform vec2 uOver;   // stations between which the highest fliers near the axis may pass OVER it (the camera rides below them)
uniform vec2 uOverH;  // cruise height of those over-fliers: base, range (the world keeps the base 5.69 m above its route at the eye)
uniform vec2 uPush;   // fliers in the corridor are moved aside as the eye comes within these distances of them: far, near (m)
attribute vec4 iPos;  // ground x, ground z, flight yaw, path curvature (right +)
attribute vec4 iA;    // station, seed, cruise height, lateral offset from the axis (right +)
attribute vec4 iB;    // behaviour (0 feed 1 stand 2 one-leg rest 3 preen 4 march), size, jitter s, rest yaw
attribute vec4 iC;    // marchers: circle centre x, z, radius, start angle
const float TR = 1.4;
const float ACC = 7.143;
float bTb, bD, bAir, bAlert, bOpen, bSize, bYaw, bPitch, bSeed, bBeh, bMd, bRunW, bFlap, bCy, bSy, bCp, bSp, bMarch, bNeckFly, bDist, bPale;
vec3 bPos; vec2 bFwd, bG, bF0;
float hash1(float n){ return fract(sin(n*127.1 + 3.7)*43758.5453); }
float travel(float rt){ float t1 = min(rt, 2.1); return 0.5*ACC*t1*t1 + 15.0*max(rt - 2.1, 0.0); }
#ifdef ESCORT
// escorts: birds the world places every frame (iPos = x, y, z, yaw; iA = pitch, seed, bird clock, behaviour; iB = 0, size,
// flap rate, metres run). The bird clock is seconds before (-) or after (+) liftoff, as for every bird of the band: far
// below zero it stands and feeds, then looks up, opens its wings and runs (the world moves it; "metres run" plants
// its feet), above zero it flies. An ordinary escort is given 5: in full flight.
void evalBird(){
  bSeed = iA.y; bBeh = iA.w; bSize = iB.y; bPale = smoothstep(1.12, 1.3, iB.y); bTb = iA.z; bMarch = 0.; bMd = 0.; bG = iPos.xz;
  bAlert = smoothstep(-2.3, -1.7, bTb); bOpen = smoothstep(-1.75, -1.25, bTb); bD = iB.w; bRunW = smoothstep(0., 0.5, bD);
  bAir = smoothstep(0., 0.6, bTb); bNeckFly = smoothstep(-1.4, -0.5, bTb);
  bF0 = vec2(sin(iPos.w), cos(iPos.w)); bFwd = bF0; bYaw = iPos.w; bPitch = iA.x;
  bPos = iPos.xyz; bDist = distance(uCam, bPos);
  bSize *= smoothstep(1.2, 3.2, bDist);
  bFlap = uTime*6.2832*(2.9 + hash1(bSeed*3.1)*0.5)*iB.z + bSeed*61.;
  bPos.y -= sin(bFlap)*0.035*bAir;
  bCy = cos(bYaw); bSy = sin(bYaw); bCp = cos(bPitch); bSp = sin(bPitch);
}
#else
void evalBird(){
  float s = iA.x; bSeed = iA.y; bBeh = iB.x; bSize = iB.y; bPale = smoothstep(1.12, 1.3, iB.y);
  float low = 1. - smoothstep(2.0, 2.6, iA.z);     // stragglers that skim under the plane: never pushed out of the corridor
  float over = smoothstep(8.5, 9.5, iA.z)*step(uOver.x, s)*step(s, uOver.y)*step(abs(iA.w), 13.5);
  bTb = (uFront - s)/uVF - iB.z + 0.5*over;      // the over-fliers are the first to go, so they are well up when the camera arrives
  vec2 G = iPos.xy; float restYaw = iB.w;
  bMarch = step(0.5, iC.z); bMd = 0.;
  if (iC.z > 0.5) {
    float clk = min(uFront/uVF, s/uVF + iB.z - 2.3);
    float a = iC.w + uMarchW*clk;
    G = iC.xy + iC.z*vec2(cos(a), sin(a)); restYaw = -a; bMd = uMarchW*iC.z*clk;
  }
  bG = G;
  bAlert = smoothstep(-2.3, -1.7, bTb);
  float turn = smoothstep(-2.2, -1.5, bTb);
  bOpen = smoothstep(-1.75, -1.25, bTb);
  bD = travel(max(bTb + TR, 0.));
  bRunW = smoothstep(0., 0.5, bD);
  bAir = smoothstep(0., 0.6, bTb);
  bNeckFly = smoothstep(-1.4, -0.5, bTb);
  float cruise = mix(iA.z, uOverH.x + uOverH.y*hash1(bSeed*3.7), over), Tc = 1.3 + cruise*0.09;
  float x = clamp(bTb/Tc, 0., 1.);
  float hgt = cruise*x*x*(3. - 2.*x);
  float rate = cruise*6.*x*(1. - x)/Tc;
  float hd = iPos.z; vec2 f0 = vec2(sin(hd), cos(hd)); vec2 r0 = vec2(-f0.y, f0.x); bF0 = f0;
  float lat = iA.w, sg = lat >= 0. ? 1. : -1.;
  float minLat = mix(uLane.z*(1. - over), uLane.w, smoothstep(uLane.x, uLane.y, s + bD))*(1. - low);
  float latNow = lat + (hash1(bSeed*7.3) - .5)*0.14*max(bD - 7., 0.) + sin(uTime*0.45 + bSeed*40.)*0.5*bAir;
  // Far ahead of the eye the corridor is full of risers (the wall has no notch); a bird only peels aside as the eye
  // closes on it, and in the lane before the ring it has peeled aside for good.
  vec2 Pf = G + f0*bD + r0*((latNow - lat) + 0.5*iPos.w*bD*bD);
  float nearEye = 1. - smoothstep(uPush.y, uPush.x, distance(Pf, uCam.xz));
  float inLane = smoothstep(uLane.x, uLane.y, s + bD);
  float push = sg*max(minLat - sg*latNow, 0.)*1.6*max(nearEye, inLane)*smoothstep(0., 0.6, bTb);
  vec2 P = Pf + r0*push;
  vec2 fw = normalize(f0 + r0*(iPos.w*bD));
  float flyYaw = atan(fw.x, fw.y);
  float dy = mod(flyYaw - restYaw + 3.14159265, 6.2831853) - 3.14159265;
  bYaw = restYaw + dy*turn; bFwd = fw;
  float bob = sin(uTime*0.9 + bSeed*17.)*0.3*smoothstep(0.3, 2.2, bTb);
  bPos = vec3(P.x, mix(0.50, 0.45, bRunW)*bSize + hgt + bob, P.y);
  bPitch = mix(mix(0.14, -0.04, bRunW), atan(rate, 15.)*0.8 + 0.03, bAir);
  bDist = distance(uCam, bPos);
  bSize *= smoothstep(1.2, 3.2, bDist);
  bFlap = uTime*6.2832*(2.9 + hash1(bSeed*3.1)*0.5) + bSeed*61.;
  bPos.y -= sin(bFlap)*0.035*bAir;
  bCy = cos(bYaw); bSy = sin(bYaw); bCp = cos(bPitch); bSp = sin(bPitch);
}
#endif
vec3 rotB(vec3 q){ float y = q.y*bCp + q.z*bSp; float z = q.z*bCp - q.y*bSp; return vec3(q.x*bCy + z*bSy, y, -q.x*bSy + z*bCy); }
vec3 toW(vec3 q){ return bPos + rotB(q*bSize); }
// planar mirror: the point's reflection, slid along the eye ray onto the water plane (so depth testing still works)
vec3 mirrorP(vec3 w, out float fade){
  float hh = max(w.y, 0.);
  vec3 m = vec3(w.x, -hh, w.z);
  m.xz += vec2(sin(w.z*1.7 + uTime*1.3 + hh*1.9), cos(w.x*1.9 - uTime*1.1 + hh*2.3))*(0.03 + 0.07*hh)*uRipple;
  float ch = max(uCam.y, 0.05);
  vec3 pw = uCam + (m - uCam)*(ch/(ch + hh));
  float dm = length(pw.xz - uCam.xz);
  pw.y = 0.02 + 0.0005*dm;
  fade = (1. - smoothstep(200., 460., dm))*smoothstep(0.02, 0.5, ch)*(1. - 0.45*smoothstep(8., 30., hh));
  return pw;
}
// planted foot: body distance d, cycle length C, half stance a, phase offset -> (foot ahead of body, lift 0..1)
vec2 footCycle(float d, float C, float a, float off){
  float c = d/C + off; float k = floor(c + 0.5); float x = (c - k)*C;
  float w = clamp(x > 0. ? (x - a)/(C - 2.*a) : 1. - (-a - x)/(C - 2.*a), 0., 1.);
  float sw = w*w*(3. - 2.*w);
  bool st = abs(x) <= a;
  return vec2(st ? -x : mix(-a, a, sw), st ? 0. : sin(3.14159*w));
}
`,_e=`
${Ye}
attribute vec4 aPart; attribute vec3 aCol2;
uniform vec3 uPinkV;
varying vec3 vCol, vCol2, vN, vV, vWg; varying vec4 vFlag; varying float vPale, vNearK; varying vec2 vMq;
#include <fog_pars_vertex>
void neckCtl(out vec3 p1, out vec3 p2, out vec3 p3, out float phi){
  float tA = uTime*(0.5 + hash1(bSeed*9.1)*0.4) + bSeed*90.;
  float feed = bBeh < 0.5 ? smoothstep(-0.6, -0.2, sin(tA*0.37)) : 0.;
  float rest = (bBeh > 1.5 && bBeh < 2.5) ? 1. : 0.;
  float preen = (bBeh > 2.5 && bBeh < 3.5) ? smoothstep(-0.3, 0.3, sin(tA*0.5)) : 0.;
  float sx = hash1(bSeed*5.7) > .5 ? 1. : -1.;
  p1 = vec3(0., 0.02, 0.36); p2 = vec3(0., 0.30, 0.02); p3 = vec3(sin(tA*0.8)*0.03, 0.46, 0.17); phi = -0.3 + sin(tA*1.3)*0.15;
  p1 = mix(p1, vec3(0., 0.03, 0.30), rest); p2 = mix(p2, vec3(0., 0.22, 0.), rest); p3 = mix(p3, vec3(0., 0.31, 0.12), rest);
  p1 = mix(p1, vec3(0., 0.10, 0.30), preen); p2 = mix(p2, vec3(sx*0.10, 0.30, 0.05), preen); p3 = mix(p3, vec3(sx*0.09, 0.12 + sin(tA*5.)*0.02, -0.06), preen); phi = mix(phi, -1.9, preen);
  float sw = sin(tA*2.6)*0.07;
  p1 = mix(p1, vec3(0., 0.12, 0.36), feed); p2 = mix(p2, vec3(sw*0.5, -0.18, 0.44), feed); p3 = mix(p3, vec3(sw, -0.47, 0.30), feed); phi = mix(phi, -2.5, feed);
  float tall = max(bMarch, bAlert);
  float fl = sin(uTime*6.5 + floor(bSeed*4.)*1.57), flag = bMarch*(1. - bAlert)*fl/sqrt(fl*fl + 0.12)*0.075;
  p1 = mix(p1, vec3(0., 0.02, 0.33), tall); p2 = mix(p2, vec3(0., 0.30, 0.11), tall); p3 = mix(p3, vec3(flag, 0.55, 0.15), tall); phi = mix(phi, -0.2, tall);
  p1 = mix(p1, vec3(0., 0.03, 0.33), bNeckFly); p2 = mix(p2, vec3(0., 0.025, 0.50), bNeckFly); p3 = mix(p3, vec3(0., 0., 0.66), bNeckFly); phi = mix(phi, -0.12, bNeckFly);
}
// camera-facing ribbon: centre cw, world tangent tw, signed half width
vec3 ribbon(vec3 cw, vec3 tw, float rad, out vec3 nW){
  vec3 vd = uCam - cw; float dist = max(length(vd), 1e-3);
  vec3 sd = cross(tw, vd); sd /= max(length(sd), 1e-4);
  float sg = rad >= 0. ? 1. : -1.;
  nW = normalize(vd/dist + sd*sg*0.9);
  return cw + sd*sg*max(abs(rad)*bSize, 0.75*uPix*dist);
}
void main(){
  evalBird();
  float part = aPart.x; vec3 wpos, nW; vFlag = vec4(0.); float legFar = 0.; vWg = vec3(0.);
  if (part < 0.5) { wpos = toW(position); nW = rotB(normal); vWg = vec3(position.z, position.y, abs(position.x)); }      // the body's own coordinates, for its plumage
  else if (part < 2.5) {
    vec3 p0 = vec3(0., 0.035, 0.15), p1, p2, p3; float phi; neckCtl(p1, p2, p3, phi);
    vec3 c, tg; float rad;
    if (part < 1.5) {
      float t = aPart.y, m = 1. - t;
      c = m*m*m*p0 + 3.*m*m*t*p1 + 3.*m*t*t*p2 + t*t*t*p3;
      tg = 3.*m*m*(p1 - p0) + 6.*m*t*(p2 - p1) + 3.*t*t*(p3 - p2) + vec3(0., 0., 1e-4);
      rad = aPart.z;
    } else {
      vec3 hd = vec3(0., sin(phi), cos(phi)), hu = vec3(0., cos(phi), -sin(phi));
      c = p3 + hd*aPart.y + hu*aPart.z; tg = hd; rad = aPart.w;
    }
    wpos = ribbon(toW(c), rotB(tg), rad, nW); vFlag.x = 1.;
  }
  else if (part < 4.5) {
    float ls = part < 3.5 ? 1. : -1.;
    vec3 hipW = toW(vec3(0.045*ls, -0.06, -0.02));
    vec3 bx = vec3(bCy, 0., -bSy), f3 = vec3(bSy, 0., bCy), base = vec3(bPos.x, 0., bPos.z);
    float sx = hash1(bSeed*5.7) > .5 ? 1. : -1.;
    float off = ls > 0. ? 0. : 0.5;
    vec3 stand = base + bx*(0.045*ls*bSize) - f3*(0.02*bSize); stand.y = -0.06*bSize;
    if (bMarch > 0.5) { vec2 fm = footCycle(bMd, 0.8, 0.22, off); stand += f3*fm.x; stand.y += fm.y*0.1; }
    float lifted = (bBeh > 1.5 && bBeh < 2.5 && ls*sx > 0.) ? 1. - bAlert : 0.;
    stand = mix(stand, hipW + (vec3(0., -0.15, 0.) + f3*0.04)*bSize, lifted);
    vec2 fr = footCycle(bD, 1.56, 0.3, off);
    vec3 run = base + f3*fr.x + bx*(0.04*ls*bSize); run.y = fr.y*0.2*bSize;
    vec3 trail = toW(vec3(0.03*ls, -0.085, -0.535));
    vec3 foot = mix(mix(stand, run, bRunW), trail, smoothstep(0.02, 0.6, bTb));
    float L1 = 0.265*bSize;
    vec3 v = foot - hipW; float dist = clamp(length(v), 1e-3, 2.*L1*0.999); vec3 dir = v/max(length(v), 1e-3);
    foot = hipW + dir*dist;
    vec3 bk = -f3 + dir*dot(f3, dir); bk /= max(length(bk), 1e-3);
    vec3 knee = hipW + dir*(dist*0.5) + bk*sqrt(max(L1*L1 - dist*dist*0.25, 0.));
    float t = aPart.y;
    vec3 c = t < 0.5 ? mix(hipW, knee, t*2.) : mix(knee, foot, t*2. - 1.);
    vec3 tg = t < 0.5 ? knee - hipW : foot - knee; tg += vec3(0., 1e-4, 0.);
    wpos = ribbon(c, tg, aPart.z, nW); vFlag.x = 1.;
    legFar = smoothstep(22., 80., bDist);     // far legs are hairlines: let them take the body's pink, not a red of their own
  }
  else {
    float ws = part < 5.5 ? 1. : -1.; float u = aPart.y, zc = aPart.z;
    float amp = mix(0.95, 0.78, bAir);
    float th1 = amp*sin(bFlap) + 0.12, th2 = amp*0.8*sin(bFlap - 1.0) - 0.15;
    float u2 = max(u - 0.42, 0.);
    vec3 open = vec3(ws*(0.065 + 0.5*((u - u2)*cos(th1) + u2*cos(th1 + th2))), 0.05 + 0.5*((u - u2)*sin(th1) + u2*sin(th1 + th2)), zc + 0.02);
    float tho = u > 0.42 ? th1 + th2 : th1;
    vec3 fold = vec3(ws*(0.088 - 0.036*u), 0.04 + aPart.w*0.0575*(1. - 0.5*u) - 0.015*u, 0.07 - u*0.33);
    // behaviour 5: a standing bird stretches one wing out and down, slowly, and folds it again
    float tS = uTime*(0.5 + hash1(bSeed*9.1)*0.4) + bSeed*90.;
    float str = (bBeh > 4.5 && bBeh < 5.5 && ws*(hash1(bSeed*5.7) > .5 ? 1. : -1.) > 0.) ? smoothstep(0.1, 0.8, sin(tS*0.33))*(1. - bAlert)*(1. - bOpen) : 0.;
    if (str > 0.) {
      float s1 = -0.5 + 0.04*sin(tS*1.7), s2 = -0.3;
      open = mix(open, vec3(ws*(0.065 + 0.5*((u - u2)*cos(s1) + u2*cos(s1 + s2))), 0.05 + 0.5*((u - u2)*sin(s1) + u2*sin(s1 + s2)), zc - 0.05 - 0.1*u), str);
      tho = mix(tho, u > 0.42 ? s1 + s2 : s1, str);
    }
    float wOpen = max(bOpen, str);
    // a slight camber: the open wing arches along its chord (leading and trailing edges a little below the line
    // between them), and its normal follows, so the light falls off across it as over a feathered vault
    float cam = 0.03*(1. - aPart.w*aPart.w)*(1. - 0.6*u);
    open += vec3(-ws*sin(tho), cos(tho), 0.)*cam;
    wpos = toW(mix(fold, open, wOpen));
    nW = rotB(normalize(mix(vec3(ws, 0.25, 0.), vec3(-ws*sin(tho), cos(tho), 0.5*aPart.w*(1. - 0.5*u)), wOpen)));
    vFlag.y = 1.; vFlag.z = (1. - wOpen)*0.8;
    vWg = vec3(u, aPart.w, wOpen);   // span, chord (-1 trailing edge .. 1 leading edge), how far open
  }
  vCol = mix(color, uPinkV, legFar*0.75); vCol2 = aCol2; vN = nW; vPale = bPale; vV = uCam - wpos; vMq = wpos.xz;
  vNearK = 1. - smoothstep(15., 28., bDist);      // the near tier, by the eye's distance: the wings show their feathers
#ifdef MIRROR
  float fd; wpos = mirrorP(wpos, fd); vFlag.w = fd; vMq = wpos.xz;
#endif
  vec4 mvPosition = viewMatrix*modelMatrix*vec4(wpos, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Oe=`
uniform vec3 uSunDir, uSunColor, uSkyColor, uGroundColor, uPink, uDeep, uSalt, uScarlet;
uniform vec2 uRim;      // gain of the rim light, gain of the light through the feathers
varying vec3 vCol, vCol2, vN, vV, vWg; varying vec4 vFlag; varying float vPale, vNearK; varying vec2 vMq;
#include <fog_pars_fragment>
//MIRROR_CLIP_PARS
#ifdef MIRROR
uniform vec3 uCam; uniform float uTime;
float mrH(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x*p.y); }
float mrN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(mrH(i), mrH(i + vec2(1., 0.)), f.x), mix(mrH(i + vec2(0., 1.)), mrH(i + vec2(1., 1.)), f.x), f.y); }
#endif
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  vec3 alb = vCol;
  if (vFlag.x < 0.5 && !gl_FrontFacing) { N = -N; alb = vCol2; }
  alb = mix(alb, uPink, vFlag.z);
  float fwB = fwidth(clamp(vWg.x, -0.3, 0.25)*24.);      // taken here, outside the branch
  if (vFlag.x < 0.5 && vFlag.y < 0.5) {
    // the body's plumage, from its own coordinates (tail -0.27 .. breast 0.2, belly -0.11 .. back 0.11): a paler belly,
    // a darker rose line where the folded coverts and scapulars meet the flank, soft scalloped feather rows over the
    // back, a darker rump. Low in contrast, and only while a feather row is wider than a pixel.
    float bz = clamp(vWg.x, -0.3, 0.25), by = clamp(vWg.y, -0.15, 0.15), det = 1. - smoothstep(0.2, 0.7, fwB);
    float lineY = 0.012 - 0.1*bz;
    alb = mix(alb, mix(alb, uSalt, 0.55), 0.5*smoothstep(0.01, -0.07, by - lineY));
    float flank = smoothstep(0.03, 0.06, vWg.z)*smoothstep(-0.24, -0.16, bz)*(1. - smoothstep(0.08, 0.15, bz));
    alb *= 1. - 0.3*flank*det*(1. - smoothstep(0.004, 0.016, abs(by - lineY)));
    float rows = abs(fract(bz*24. + 0.35*sin(by*70. + vWg.z*40.)) - 0.5)*2.;
    alb *= 1. - 0.13*det*smoothstep(0., 0.03, by - lineY)*smoothstep(0.6, 0.95, rows)*(1. - smoothstep(0.1, 0.17, bz));
    alb *= 1. - 0.12*smoothstep(-0.14, -0.25, bz);
  }
  // close to the lens the spread wing shows its feathers: flight feathers with pale shafts and dark gaps, two scalloped
  // rows of coverts, rounded feather tips along the trailing edge and fingered primaries at the tip
  float fu = vWg.x*26., fwU = fwidth(fu);
  float wU = clamp(vWg.x, 0., 1.), wC = clamp(vWg.y, -1., 1.), fwC = fwidth(wC);      // span, chord (held to their own ranges), taken outside the branch
  if (vFlag.y > 0.5) {
    // THE NEAR TIER'S WINGS (by the eye's distance, vNearK): the lesser flamingo's two colours cut feather by feather.
    // Coverts over the fore wing (above: pink at the shoulder and the leading edge, a scarlet band down the middle of
    // the wing; below: scarlet all over), a clear, stepped break to black flight feathers behind them and over the
    // whole hand, a trailing edge notched between the tips of nine secondaries, the primaries parted into fingers.
    float nearW = vNearK*vWg.z;
    if (nearW > 0.01) {
      float cb = mix(mix(-0.12, 0.2, smoothstep(0.08, 0.5, wU)), 1.1, smoothstep(0.5, 0.86, wU)) + 0.1*(abs(fract(wU*12.) - 0.5) - 0.25);
      float aaC = max(0.035, 1.2*fwC), blk = smoothstep(-aaC, aaC, cb - wC);
      float band = smoothstep(0.06, 0.26, wU)*(1. - 0.6*smoothstep(0.35, 0.95, wC))*(0.75 + 0.25*smoothstep(0.3, 0.7, abs(fract(wU*12. + 0.5) - 0.5)*2.));
      vec3 cov = gl_FrontFacing ? mix(uPink, uScarlet, 0.25 + 0.75*band) : mix(uScarlet, uScarlet*vec3(0.8, 0.55, 0.6), 0.6*(1. - band));
      vec3 fl = vec3(0.02, 0.017, 0.022)*(1. + 1.2*smoothstep(0.75, 1., 1. - abs(fract(wU*9.) - 0.5)*2.)*(1. - smoothstep(0.7, 0.9, wU)));      // a paler shaft down each flight feather
      alb = mix(alb, mix(cov, fl, blk), nearW);
      float sN = abs(fract(wU*9.) - 0.5)*2.;
      if (wC < -1. + nearW*0.55*sN*sN*(1. - smoothstep(0.74, 0.9, wU))) discard;                       // the notch between two secondaries' tips
      if (abs(fract(wC*1.7 + 0.15) - 0.5)*2. > 1. - 0.6*nearW*smoothstep(0.76, 0.96, wU)) discard;      // the slots between the primaries
    }
    float det = (1. - smoothstep(0.22, 0.6, fwU))*vWg.z;
    float sF = abs(fract(fu) - 0.5)*2.;
    float aft = 1. - smoothstep(-0.35, 0.15, vWg.y);
    alb *= 1. - det*aft*0.34*smoothstep(0.7, 0.96, sF);
    alb += det*aft*0.035*(1. - smoothstep(0., 0.16, sF));
    float row = abs(fract(vWg.y*1.5 + 0.25 + 0.1*sin(fu*3.14159)) - 0.5)*2.;
    alb *= 1. - det*(1. - aft)*0.17*smoothstep(0.72, 0.96, row);
    float edge = -1. + det*(0.2*sF*sF + 0.55*smoothstep(0.84, 1., vWg.x)*smoothstep(0.45, 1., sF));
    if (vWg.y < edge - 0.002) discard;
    // the wing ends in a rounded tip at any range and from any side, never a square block
    float tu = clamp(vWg.x - 0.9, 0., 0.1)/0.1, tc = clamp(vWg.y, -1., 1.);
    if (tu*tu + tc*tc > 1.02) discard;
  }
  alb = mix(alb, uSalt*vec3(1.02, 0.86, 0.87), vPale*0.36*smoothstep(0.2, 0.4, alb.g));   // greater flamingos: taller and far paler
  float ndl = dot(N, uSunDir);
  float dif = clamp((ndl + 0.3)/1.3, 0., 1.);
  vec3 hemi = mix(uGroundColor, uSkyColor, N.y*.5 + .5)*1.3;
  vec3 c = alb*(hemi + uSunColor*dif)*0.3183;
  c += alb*uSunColor*(vFlag.y*0.4*max(-ndl, 0.)*0.3183);
  c *= 0.86 + 0.28*clamp(N.y*.5 + .5, 0., 1.);
  // seen against the light the feathers glow through and the outline catches the sun
  vec3 V = normalize(vV + vec3(0., 1e-4, 0.));
  float back = max(dot(-V, uSunDir), 0.), fres = 1. - abs(dot(N, V)); fres *= fres*fres;
  c += alb*uSunColor*0.3183*(0.5*uRim.y*back*back*(0.3 + 0.7*vFlag.y) + 0.45*uRim.x*fres*smoothstep(-0.3, 0.5, back + 0.25*N.y));
#ifdef MIRROR
#ifdef MCLIP
  if (mirrorOnWater(vMq) < 0.5) discard;      // brine mirrors; dry crust does not
#endif
  // A reflection in the brine is the bird's own shape upside down, but darker than the bird and stained by the water,
  // broken into strokes by the ripple and strongest where the eye meets the sheet at a low angle. Close to the eye it is
  // seen steeply, so the brine shows through it: dark crimson there, a rose stroke far off.
  vec3 Vm = uCam - vec3(vMq.x, 0., vMq.y); float dm = max(length(Vm), 1e-3), mF = 1. - clamp(Vm.y/dm, 0., 1.), mF2 = mF*mF;
  float Fm = 0.03 + 0.9*mF2*mF2*sqrt(mF);
  float brk = smoothstep(0.2, 0.6, mrN(vMq*5.5 + uTime*vec2(1.3, 0.9)) + 0.4*mrN(vMq*14. - uTime*1.7));
  float farM = smoothstep(14., 48., dm);
  vec3 stain = c*vec3(1., 0.5, 0.55);
  vec3 mc = mix(uDeep*0.5 + stain*0.3, mix(uDeep, c*vec3(1., 0.74, 0.78), 0.66), farM);
  gl_FragColor = vec4(mc, vFlag.w*mix(0.45 + 0.55*Fm, 0.95, farM)*mix(1., brk, mix(0.55, 0.25, farM)));
#else
  gl_FragColor = vec4(c, 1.);
#endif
  #include <fog_fragment>
}`,dt=`
${Ye}
uniform vec3 uSunDir;
varying vec2 vUv; varying vec4 vAx, vWg, vNk, vLg; varying float vDif, vFade;
#include <fog_pars_vertex>
void main(){
  evalBird();
  vec3 vd = uCam - bPos; float dist = max(length(vd), 1e-3); vec3 vn = vd/dist;
  vec3 rgt = cross(vec3(0., 1., 0.), vn); rgt /= max(length(rgt), 1e-4);
  vec3 up = cross(vn, rgt);
  float px = uPix*dist, R = 0.78*max(bSize, 0.01), sc = max(R, 2.5*px);
  vec3 f3 = rotB(vec3(0., 0., 1.)), l3 = rotB(vec3(1., 0., 0.)), u3 = rotB(vec3(0., 1., 0.));
  vec2 ax = vec2(dot(f3, rgt), dot(f3, up));
  float th = 0.85*sin(bFlap) + 0.1;
  vec3 wl = l3*cos(th) + u3*sin(th), wr = -l3*cos(th) + u3*sin(th);
  vWg = vec4(dot(wl, rgt), dot(wl, up), dot(wr, rgt), dot(wr, up))*0.5*bOpen;
  vec2 U = vec2(0., max(up.y, 0.2));
  float tA = uTime*(0.5 + hash1(bSeed*9.1)*0.4) + bSeed*90.;
  float feed = (bBeh < 0.5 ? smoothstep(-0.6, -0.2, sin(tA*0.37)) : 0.)*(1. - bAlert);
  float tall = mix(0.46, 0.56, max(bAlert, bMarch));
  vec2 mid = mix(mix(ax*0.30 + U*0.12, ax*0.38 - U*0.08, feed), ax*0.42, bNeckFly);
  vec2 head = mix(mix(ax*0.17 + U*tall, ax*(0.32 + 0.05*sin(tA*2.6)) - U*0.45, feed), ax*0.74, bNeckFly);
  vNk = vec4(mid, head);
  float trail = smoothstep(0.02, 0.6, bTb);
  float runPh = bRunW*(1. - trail);
  vLg = vec4(mix(-U*0.56 - ax*0.02, -ax*0.66, trail), runPh*(0.5 + 0.5*sin(bD*8.05)), px/sc*0.78);
  vAx = vec4(ax, bOpen, bNeckFly);
  float sdn = dot(normalize(vn + vec3(0., 0.35, 0.)), uSunDir);
  vDif = max(clamp((sdn + 0.3)/1.3, 0., 1.), 0.36 + 0.3*sdn);      // a bird is round: seen across the light, half of it is lit
  vUv = position.xy;
  vec3 wpos = bPos + (rgt*position.x + up*position.y)*sc; vFade = 1.;
#ifdef MIRROR
  float fd; wpos = mirrorP(wpos, fd); vFade = fd;
#endif
  vec4 mvPosition = viewMatrix*modelMatrix*vec4(wpos, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,pt=`
uniform vec3 uSunColor, uSkyColor, uGroundColor, uPink, uScarlet, uSalt, uDeep;
varying vec2 vUv; varying vec4 vAx, vWg, vNk, vLg; varying float vDif, vFade;
#include <fog_pars_fragment>
float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba)/max(dot(ba, ba), 1e-6), 0., 1.); return length(pa - ba*h); }
void main(){
  vec2 p = vUv*0.78; float px = vLg.w, fly = vAx.w;
  vec2 ax = vAx.xy; float al = length(ax); vec2 an = ax/max(al, 1e-3); vec2 pn = vec2(-an.y, an.x);
  if (pn.y < 0.) pn = -pn;
  float La = 0.1 + 0.13*al;
  vec2 bp = vec2(dot(p, an)/La, dot(p, pn)/0.1);
  bp.y *= bp.y < 0. ? 0.94 : 1.1;
  float dBody = length(bp) - 1.;
  float farK = smoothstep(0.05, 0.2, px);                       // sprite only a few pixels tall: a pink body, no fat red legs
  bp /= 1. + 0.9*farK; dBody = length(bp) - 1.;
  float thin = max(0.013, px*0.55*(1. - 0.75*farK));
  vec2 nb = ax*0.14 + pn*0.02;
  float dNeck = min(sdSeg(p, nb, vNk.xy), sdSeg(p, vNk.xy, vNk.zw)) - max(0.017, px*0.55);
  float dHead = length(p - vNk.zw) - max(0.03, px*0.65);
  vec2 billEnd = vNk.zw + an*(0.05 + 0.04*al) - vec2(0., 0.05)*(1. - fly);
  float dBill = sdSeg(p, vNk.zw, billEnd) - max(0.014, px*0.5);
  vec2 lo = an*(0.035*al)*(1. - fly) + vec2(0.012, 0.)*(1. - fly);
  float dLeg = min(sdSeg(p, -ax*0.04 + lo, vLg.xy + lo), sdSeg(p, -ax*0.04 - lo, vLg.xy - lo)) - thin;
  float tl = clamp(dot(p, vWg.xy)/max(dot(vWg.xy, vWg.xy), 1e-5), 0., 1.);
  float tr = clamp(dot(p, vWg.zw)/max(dot(vWg.zw, vWg.zw), 1e-5), 0., 1.);
  float wRad = max(0.075*vAx.z, px*0.6);
  float dWl = length(p - vWg.xy*tl) - wRad*(1. - 0.55*tl);
  float dWr = length(p - vWg.zw*tr) - wRad*(1. - 0.55*tr);
  float dSplash = length((p - vec2(0., -0.5))*vec2(0.62, 1.4)) - max(0.2, 2.0*px)*vLg.z;
  vec3 alb = uPink; float d = 1., up = clamp(p.y*4., -1., 1.);
  if (dLeg < 0.) { alb = mix(uPink, uScarlet, 0.3*(1. - farK))*mix(0.85, 1., farK); d = dLeg; }
  if (dNeck < 0.) { alb = mix(uPink, uSalt, 0.12); d = dNeck; up = 0.3; }
  if (dBill < 0.) { alb = mix(uScarlet*0.35, vec3(0.02), smoothstep(0.03, 0.07, length(p - vNk.zw))); d = dBill; }
  if (dHead < 0.) { alb = mix(uPink, uSalt, 0.2); d = dHead; up = 0.4; }
  if (dBody < 0.) {
    alb = uPink; d = dBody; up = clamp(bp.y, -1., 1.);
    if (vAx.z < 0.5 && bp.y > -0.45 && bp.y < 0.1 && bp.x < 0.15 && bp.x > -0.8) alb = mix(uPink, uScarlet, 0.2);
    if (bp.x < -0.78) alb = mix(uPink, vec3(0.03), 0.6*(1. - vAx.z));
  }
  if (vAx.z > 0.05) {
    if (dWl < 0.) { alb = tl > 0.58 ? vec3(0.02) : mix(uPink, uScarlet, 0.15 + tl); d = dWl; up = 0.2; }
    if (dWr < 0.) { alb = tr > 0.58 ? vec3(0.02) : mix(uPink, uScarlet, 0.15 + tr); d = dWr; up = 0.2; }
  }
  vec3 c = alb*(mix(uGroundColor, uSkyColor, 0.5 + 0.4*up)*1.3 + uSunColor*vDif*(0.8 + 0.2*up))*0.3183;
  if (dSplash < 0. && vLg.z > 0.02) { c = uSalt*1.25; d = dSplash; }
  if (d > 0.) discard;
#ifdef MIRROR
  gl_FragColor = vec4(mix(uDeep, c*vec3(1., 0.74, 0.78), 0.68), 0.92*vFade);
#else
  gl_FragColor = vec4(c, 1.);
#endif
  #include <fog_fragment>
}`,qt=`
${Ye}
attribute vec4 iS;
varying vec2 vUv; varying vec3 vK, vRg; varying vec2 vSq;
#include <fog_pars_vertex>
void main(){
  evalBird();
  float slot = iS.x, j = mod(slot, 2.), ring = step(1.5, slot);
  float nMax = min(floor((bD + 0.3)/0.78), 9.);
  float n = nMax - mod(nMax - j, 2.);
  float dT = max(0.78*n - 0.3, 0.01);
  float age = bTb + TR - sqrt(2.*dT/ACC);
  vec2 r0 = vec2(-bF0.y, bF0.x);
  vec2 fp = bG + bF0*(0.78*n) + r0*((mod(n, 2.) > 0.5 ? 1. : -1.)*0.04 + 0.5*iPos.w*(0.78*n)*(0.78*n));      // along the bird's own curve
  float on = step(0.5, n)*step(0., age);
  vec3 wpos; float alpha, size;
  vec3 vd = uCam - vec3(fp.x, 0., fp.y); float dist = max(length(vd), 1e-3);
  if (ring < 0.5) {
    float a = clamp(age/0.4, 0., 1.);
    size = (0.1 + 0.17*sqrt(a))*bSize; alpha = on*(1. - a*a);
    vec3 rgt = cross(vec3(0., 1., 0.), vd); rgt /= max(length(rgt), 1e-4);
    size = max(size, 2.3*uPix*dist);
    wpos = vec3(fp.x, 0., fp.y) + rgt*(position.x*size) + vec3(0., (position.y + 1.)*size*(0.45 + 0.6*a), 0.);
  } else {
    float a = clamp(age/1.5, 0., 1.);
    size = 0.2 + 1.15*sqrt(a); alpha = on*(1. - a)*(1. - a)*0.5;
    if (bTb < -2.3) {   // idle: slow rings round a wading leg
      float ph = fract(uTime*0.33 + bSeed*7. + j*0.5);
      size = 0.1 + 0.95*ph; alpha = 0.45*(1. - ph)*smoothstep(0., 0.15, ph); fp = bPos.xz;
    }
    wpos = vec3(fp.x + position.x*size, 0.03 + 0.0004*dist, fp.y + position.y*size);
  }
  alpha *= 1. - smoothstep(260., 420., dist);
  if (alpha < 0.004) wpos = vec3(fp.x, -5., fp.y);
  vUv = position.xy; vK = vec3(ring, alpha, bSeed*40. + n); vSq = fp; vRg = vec3(wpos.xz, max(size, 0.05));      // where this point of a ring lies on the water, and the ring's radius in metres
  vec4 mvPosition = viewMatrix*modelMatrix*vec4(wpos, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,vt=`
uniform vec3 uSalt, uSkyColor, uDeep; uniform float uTime;
varying vec2 vUv; varying vec3 vK, vRg; varying vec2 vSq;
float spH(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x*p.y); }
float spN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(spH(i), spH(i + vec2(1., 0.)), f.x), mix(spH(i + vec2(0., 1.)), spH(i + vec2(1., 1.)), f.x), f.y); }
//SPLASH_CLIP_PARS
#include <fog_pars_fragment>
void main(){
  float a; vec3 c;
  float rr = length(vUv), fw = fwidth(rr);       // taken here, outside the branch
  #ifdef MCLIP
  if (mirrorOnWater(vSq) < 0.5) discard;         // a foot that comes down on dry crust throws no spray and leaves no ring
  #endif
  if (vK.x < 0.5) {
    // a burst of spray, not a fan: thin uneven jets broken into beads close to; one soft fleck far off
    float r = length(vUv*vec2(1., 0.85)), ang = atan(vUv.x, vUv.y + 1.3);
    float jets = 0.5 + 0.5*sin(ang*17. + vK.z), beads = 0.5 + 0.5*sin(r*13. - vK.z*2.3 + ang*5.);
    float fan = 1. - smoothstep(0.45, 1., abs(vUv.x)/(0.3 + 0.45*(clamp(vUv.y, -1., 1.) + 1.)));      // narrow at the foot, opening upward
    // close to: separate jets and beads with gaps between (never a soft ball); far off: one low white fleck lying on the waterline
    float jet = smoothstep(0.5, 0.92, jets*0.7 + beads*0.45)*(1. - smoothstep(0.2, 1., r))*fan*smoothstep(-1., -0.7, vUv.y)*0.85;
    float fleck = 0.55*(1. - smoothstep(0.25, 1., length(vec2(vUv.x*1.15, (vUv.y + 0.72)*3.4))));
    a = mix(jet, fleck, smoothstep(0.06, 0.22, fw));
    c = uSalt*1.2;
  } else {
    // SOFT RINGS: a swell riding outward from the footfall: a light crest with a dark trough inside it, a weaker crest
    // and trough inside those. The crest is a hand wide on the water (never drawn under a pixel and a half: below that
    // it pales instead of thinning to a hairline); the brine's own ripple bends it and breaks it into arcs (noise on
    // the water where the ring lies, so rings that overlap are broken together and their crests and troughs lie
    // softly over one another); it fades outward with age (the vertex shader's alpha). No closed hairline circle.
    float sz = clamp(vRg.z, 0.05, 4.);
    float n1 = spN(vRg.xy*2.3 + uTime*vec2(0.5, 0.3)), n2 = spN(vRg.xy*5.3 - uTime*vec2(0.4, 0.6));
    float n0 = spN(vRg.xy*0.9 + uTime*vec2(0.17, -0.11) + 7.);
    float rw = clamp(rr + (0.3*(n0 - 0.5) + 0.12*(n1 - 0.5) + 0.04*(n2 - 0.5))/sz, 0., 1.5);      // the ring's across coordinate, bent by the ripple and held to its own range
    float w0 = 0.13/sz, w = clamp(max(w0, 1.6*fw), 0.02, 0.36);
    float soft = clamp(w0/w, 0.22, 1.);
    float x1 = clamp((rw - 0.8)/w, -8., 8.);
    float crest = exp(-x1*x1) + 0.16*exp(-(x1 + 3.1)*(x1 + 3.1));
    float trough = exp(-(x1 + 1.55)*(x1 + 1.55)) + 0.16*exp(-(x1 + 4.6)*(x1 + 4.6));
    float arc = smoothstep(0.36, 0.62, spN(vRg.xy*0.8 + vK.z*0.37) + 0.5*(n1 - 0.5))*(0.5 + 0.5*smoothstep(0.25, 0.6, n2));
    float la = crest*arc, da = trough*arc;
    a = clamp(0.66*la + 0.6*da, 0., 0.68)*soft*(1. - smoothstep(0.9, 1., rr));
    c = mix(uDeep*0.5, mix(uSkyColor*0.3183, uSalt, 0.4)*0.8, clamp(la/max(la + da, 1e-3), 0., 1.));
  }
  a *= vK.y;
  if (a < 0.003) discard;
  gl_FragColor = vec4(c, a);
  #include <fog_fragment>
}`,Vt=`
varying vec3 vP;
#include <fog_pars_vertex>
void main(){
  vP = position;
  vec4 mvPosition = viewMatrix*modelMatrix*vec4(position, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,jt=`
uniform vec3 uCam, uShallow, uDeep, uSkyHor, uSkyZen, uSunDir, uSunColor, uSalt;
uniform float uTime, uRipple, uLum;
varying vec3 vP;
#include <fog_pars_fragment>
float h2(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(h2(i), h2(i + vec2(1., 0.)), f.x), mix(h2(i + vec2(0., 1.)), h2(i + vec2(1., 1.)), f.x), f.y); }
float rip(vec2 q){ return vn(q*2.1 + uTime*vec2(0.21, 0.13)) + 0.5*vn(q*5.3 - uTime*vec2(0.17, 0.26)); }
void main(){
  vec3 V = uCam - vP; float dist = max(length(V), 1e-3); V /= dist;
  vec2 q = vP.xz;
  float paw = smoothstep(0.5, 0.78, vn(q*0.03 + uTime*vec2(0.022, 0.013)));
  float r0 = rip(q); vec2 g = vec2(rip(q + vec2(0.3, 0.)) - r0, rip(q + vec2(0., 0.3)) - r0);
  float amp = uRipple*(0.1 + 0.75*paw)/(1. + dist*0.06);
  vec3 N = normalize(vec3(-g.x*amp, 1., -g.y*amp));
  float cv = clamp(dot(N, V), 0., 1.), m = 1. - cv;
  float F = 0.03 + 0.97*m*m*m*m*m;
  vec3 R = reflect(-V, N);
  vec3 sky = mix(uSkyHor, uSkyZen, sqrt(clamp(R.y, 0., 1.)));
  float mot = 0.55*vn(q*0.018) + 0.3*vn(q*0.09 + 7.) + 0.15*vn(q*0.6);
  vec3 body = mix(uDeep, uShallow, smoothstep(0.3, 0.95, mot))*uLum;
  body *= 0.92 + 0.16*vn(q*vec2(0.012, 0.11) + vec2(uTime*0.006, 0.));
  vec3 c = mix(body, sky, F) + paw*0.03*sky;
  float sp = max(dot(R, uSunDir), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  c += uSunColor*sp*sp*0.05;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,mt={morning:{sunDir:[-.824,.309,.476],sunColor:"#fff0dc",sunI:2.8,sky:null,skyI:1.3,bounce:.9},dawn:{sunDir:[-.86,.06,.5],sunColor:"#ffb48a",sunI:2.5,sky:"#d9bccb",skyI:1,bounce:.8},evening:{sunDir:[.83,.2,.5],sunColor:"#ffc890",sunI:2.7,sky:"#c9c4d6",skyI:1.1,bounce:.85},moon:{sunDir:[-.6,.55,.45],sunColor:"#b8c8ff",sunI:.6,sky:"#3a4468",skyI:.6,bounce:.3}};async function Ht(f,t={}){const r=f.rng.fork?f.rng.fork("natron-liftoff"):f.rng,S=f.noise,P=f.quality?.detail??1,Fe=(t.palette&&t.palette.length>=7?t.palette:Ut).map(e=>new d.Color(e)),[ve,me,E,Re,j,We]=Fe,I=(e,a,s)=>e.clone().lerp(a,s),B=r.range(-.012,.012),te=E.clone().multiplyScalar(.82).offsetHSL(B,0,0),G=Re.clone().multiplyScalar(.88),Z={pink:te,pale:I(te,j,.3),belly:I(te,j,.14),rose:I(te,G,.4),scarlet:G,crimson:I(G,ve,.6),black:new d.Color(.016,.014,.018),bill:I(me,G,.35),leg:I(te,G,.34).multiplyScalar(.9),legDark:I(G,me,.5)},g=t.length??640,ce=t.tail??420,D=t.vF??34;let $;if(t.path){const e=t.pathFrom??0,a=new d.Vector3,s=new d.Vector3,o=l=>(t.path.tangentAtDist(e+l,s),Math.atan2(s.x,s.z));$=l=>{t.path.posAtDist(e+l,a);const h=o(l);let v=o(l+5)-o(l-5);return v=((v+Math.PI)%Se+Se)%Se-Math.PI,{x:a.x,z:a.z,yaw:h,k:-v/10}}}else $=e=>({x:0,z:g/2-e,yaw:Math.PI,k:0});const O=(e,a)=>{const s=$(e);return s.x+=-Math.cos(s.yaw)*a,s.z+=Math.sin(s.yaw)*a,s},ze=r.range(0,100),Ce=r.range(0,100),Pe=e=>d.MathUtils.clamp(27+8*S.n2(e*.005,ze),20,35)*d.MathUtils.smoothstep(e,-20,50),q=g-60,Q=$(q),fe=t.season||"october",X=t.weather||"calm",n=(t.density??1)*(fe==="dry"?.85:fe==="december"?.92:1),i=Object.assign({near:250,mid:1120,far:7400,mirror:600,sprites:900,farMirror:2e3},t.counts||{});i.mid=Math.round(i.mid*Math.min(1.3,n)*(.7+.3*P)),i.far=Math.round(i.far*Math.min(1.3,n)*(.5+.5*P));const m=r.range(70,120),p=t.marchRadius??r.range(12,14.5),u=r.range(13.5,16),T=t.marchStation??m,ne=-(p+(t.marchGap??u)),U=O(T,ne),L=Math.atan2(Math.sin(U.yaw),-Math.cos(U.yaw)),N=.8/p,y=new Set,ae=r.range(.45,.62),bt=r.range(0,10),gt=r,Ze=f.core&&f.core.makeRng?f.core.makeRng("natron-liftoff:placed:"+((f.seed??0)>>>0)):r.fork?r.fork("placed"):r;function ue(e,a,s=gt){const o=O(e,a),l=s(),h=s();return{x:o.x,z:o.z,yaw:o.yaw,k:o.k,s:e,lat:a,seed:s(),cruise:Math.abs(a)<13?2.5+11*Math.pow(l,1.2):2+26*Math.pow(l,1.5),beh:h<ae?0:h<ae+.16?1:h<ae+.3?2:3,size:s.range(.86,1.02),jit:s.range(0,.6),restYaw:S.n2(o.x*.02+bt,o.z*.02)*2.5+s.range(-.9,.9)+o.yaw,march:null}}async function be(e,a,s,o,l){const h=[];let v=e*60;for(;h.length<e&&v-- >0;){(v&127)===0&&await f.yield?.();const x=r.range(a,s),z=Pe(Math.min(x,g)),k=o(z,x);if(k===null)continue;const A=O(x,k),V=.5+.5*S.fbm2(A.x*.028+Ce,A.z*.028,3),c=1-d.MathUtils.smoothstep(Math.abs(k)/Math.max(z,1),.7,1.35);if(!(r()>c*(.2+.8*d.MathUtils.smoothstep(V,.3,.62)))&&!(Math.hypot(A.x-Q.x,A.z-Q.z)<10)&&!(Math.hypot(A.x-U.x,A.z-U.z)<p+5)){if(l){const b=Math.round(A.x/l)+":"+Math.round(A.z/l);if(y.has(b))continue;y.add(b)}h.push(ue(x,k))}}return h}const Ae=t.nearBias,H=Ae?(await be(Math.round(i.near*(1-Ae[2])),5,g+30,()=>r.range(-13,13),.8)).concat(await be(Math.round(i.near*Ae[2]),Ae[0],Ae[1],()=>r.range(-13,13),.8)):await be(i.near,5,g+30,()=>r.range(-13,13),.8);if(t.stragglers){const e=r.fork?r.fork("stragglers"):r;for(const a of Array.isArray(t.stragglers)?t.stragglers:[t.stragglers]){const s=a.lat?a.lat[0]:.6,o=a.lat?a.lat[1]:10,l=a.cruise?a.cruise[0]:1.1,h=a.cruise?a.cruise[1]:2;for(let v=0,x=a.count*20;v<a.count&&x>0;x--){const z=e.range(a.from,a.to),k=(e()<.5?-1:1)*(s+(o-s)*Math.pow(e(),.8)),A=O(z,k),V=Math.round(A.x/1.1)+":"+Math.round(A.z/1.1);if(y.has(V)||Math.hypot(A.x-Q.x,A.z-Q.z)<9)continue;y.add(V);const c=ue(z,k);c.cruise=l+(h-l)*e(),c.jit=a.jit(z,e),c.beh=e()<.7?0:1,H.push(c),v++}}}for(const e of t.calm?Array.isArray(t.calm)?t.calm:[t.calm]:[]){const a=r.fork?r.fork("calm"):r,s=e.lat?e.lat[0]:6.6,o=e.lat?e.lat[1]:11.5,l=e.hold?e.hold[0]:4.2,h=e.hold?e.hold[1]:5.2;for(let v=0,x=e.count*30;v<e.count&&x>0;){const z=a.range(e.from,e.to),k=(a()<.5?-1:1)*a.range(s+.8,o-.8),A=Math.min(e.count-v,a.int(2,4));for(let V=0;V<A&&x>0;x--){const c=z+a.range(-2.2,2.2),b=k+a.range(-1.3,1.3);if(Math.abs(b)<s)continue;const w=O(c,b),F=Math.round(w.x/1.1)+":"+Math.round(w.z/1.1);if(y.has(F))continue;y.add(F);const W=ue(c,b);W.jit=a.range(l,h),W.beh=[0,0,3,0,1][(v+V)%5],W.cruise=12+8*a(),H.push(W),V++,v++}}}for(const e of t.calmPlace||[]){const a=O(e.s,e.lat),s=Math.round(a.x/1.1)+":"+Math.round(a.z/1.1);y.add(s);const o=ue(e.s,e.lat,Ze);o.jit=e.hold??4.7,o.beh=e.beh??0,o.cruise=12+6*o.seed,e.size&&(o.size=e.size),H.push(o)}await f.yield?.();const Ue=t.marchCount?Math.round(t.marchCount):Math.min(150,Math.round(i.mid*.12)),Ie=t.marchCount?9:6,J=await be(i.mid-(t.marchCount?0:Ue),0,g+40,e=>(r()+r()-1)*e*1.15,.8);for(const e of t.wall?Array.isArray(t.wall)?t.wall:[t.wall]:[]){const a=r.fork?r.fork("wall"):r,s=e.lat??15;for(let o=0,l=e.count*12;o<e.count&&l>0;l--){(l&127)===0&&await f.yield?.();const h=a.range(e.from,e.to),v=a.range(-s,s);if(Math.abs(v)<(e.latMin??1.2))continue;const x=O(h,v),z=Math.round(x.x/.8)+":"+Math.round(x.z/.8);if(y.has(z))continue;y.add(z);const k=ue(h,v);e.cruise?(k.cruise=e.cruise[0]+(e.cruise[1]-e.cruise[0])*a(),e.jit&&(k.jit=e.jit(h,a)),k.beh=a()<.7?0:1):a()<(e.high??.55)?k.cruise=9.7+3.5*a():e.low&&(k.cruise=2+e.low*Math.pow(a(),2.2)),J.push(k),o++}}const wt=Math.ceil(Ue/Ie),yt=t.marchHold??0,xt=t.marchCount?4:2;for(let e=0;e<Ue;e++){const a=e%Ie,s=Math.floor(e/Ie),o=ue(T,ne),l=p-xt+a*.8+r.range(-.08,.08),h=L-(t.marchLead??.9)+(s-wt/2)*.66/p+r.range(-.006,.006);o.march=[U.x,U.z,l,h],o.beh=4,o.jit=yt+r.range(0,.35),o.seed=a%4/4+r()*.2,o.size=r.range(.92,1),J.push(o)}await f.yield?.();const $e=Math.round(i.far*.6),Y=(await be($e,-10,g+20,e=>{const a=r.range(-1.7,1.7)*e;return Math.abs(a)<16?null:a},0)).concat(await be(i.far-$e,g,g+ce,(e,a)=>r()<(a-g)/ce*.7?null:r.range(-1.5,1.5)*e,0));await f.yield?.();const ie=[],qe=[],Be=1e5;if(t.outliers){const e=t.outliers,a=e.from??-300,s=Math.max(4,Math.round((e.mid??0)/16)),o=(c,b,w)=>{const F=ue(c,b,w);return F.s=Be,F.s0=c,F.cruise=3,F};let l=(e.mid??0)*30;for(let c=0;c<s&&ie.length<(e.mid??0);c++){let b=c===0?a+24:c===1?a+46:r.range(a+30,-6);e.avoid&&b>e.avoid[0]&&b<e.avoid[1]&&(b=e.avoid[0]-(b-e.avoid[0])*.6-8);const F=(c===0?1:c===1||r()<.5?-1:1)*(c<2?r.range(10,13):9+26*Math.pow(r(),1.7)),W=r.range(2.5,7),C=c<2?14:r.int(8,24),ee={x:0,z:0,r:W,s:b,lat:F};{const _=O(b,F);ee.x=_.x,ee.z=_.z,qe.push(ee)}for(let _=0;_<C&&l-- >0;_++){const ye=b+r.gauss()*W*1.4,xe=F+r.gauss()*W;if(Math.abs(xe)<(e.minLat??6.8)||ye<a+14){_--;continue}const ke=O(ye,xe),ut=Math.round(ke.x/.8)+":"+Math.round(ke.z/.8);if(!y.has(ut)){y.add(ut);{const ht=o(ye,xe);ht.grp=ee,ie.push(ht)}}}}for(const c of e.pool?Array.isArray(e.pool)?e.pool:[e.pool]:[]){const b=r.fork?r.fork("pool"):r;{const w=O(c.s,c.lat);qe.push({x:w.x,z:w.z,r:c.r,pool:!0,open:!!c.open})}for(let w=0,F=c.n*30;w<c.n&&F>0;F--){const W=b.range(0,Se),C=Math.sqrt(b())*c.r,ee=c.s+Math.cos(W)*C*(c.along??1.5),_=c.lat+Math.sin(W)*C*(c.across??.8);if(Math.abs(_)<(c.minLat??6.4))continue;const ye=O(ee,_),xe=Math.round(ye.x/1.3)+":"+Math.round(ye.z/1.3);if(y.has(xe))continue;y.add(xe);const ke=o(ee,_);ke.size=(c.size??1.5)*b.range(.94,1.06),ke.beh=[1,0,3,1,2,0,1,3,0,1][w%10],H.push(ke),w++}}for(const c of e.place||[]){const b=O(c.s,c.lat);y.add(Math.round(b.x/.8)+":"+Math.round(b.z/.8));const w=o(c.s,c.lat,Ze);w.placed=1,w.size=c.size??.95,w.beh=c.beh??0,c.yaw!==void 0&&(w.restYaw=b.yaw+c.yaw),c.tier==="mid"?ie.push(w):H.push(w)}await f.yield?.();const h=$(0),v=Math.sin(h.yaw),x=Math.cos(h.yaw),z=Math.cos(h.yaw),k=-Math.sin(h.yaw),A=e.horn??700,V=Math.round((e.far??0)*.8);for(let c=0,b=V*8;c<V&&b>0;b--){(b&255)===0&&await f.yield?.();const w=28+Math.pow(r(),.8)*A,F=(r()+r()-1)*(30-12*w/A),W=45e-5*w*w+F-8,C=h.x+z*w+v*W,ee=h.z+k*w+x*W;if(.5+.5*S.fbm2(C*.03+Ce,ee*.03,2)<.3+.25*r())continue;const _=o(0,0);_.x=C,_.z=ee,_.yaw=h.yaw,_.restYaw=r.range(0,Se),Y.push(_),c++}for(let c=0,b=Math.round((e.far??0)*.2/30);c<b;c++){const w=r.range(a,g),F=(r()<.6?1:-1)*r.range(60,260),W=r.range(6,16);for(let C=0;C<30;C++)Y.push(o(w+r.gauss()*W*2,F+r.gauss()*W))}if(await f.yield?.(),typeof e.keep=="function")for(let c=Y.length-1;c>=0;c--)Y[c].s===Be&&!e.keep(Y[c].x,Y[c].z)&&Y.splice(c,1),(c&127)===0&&await f.yield?.();for(const c of ie)J.push(c)}if(await f.yield?.(),typeof t.adjust=="function"){for(let e=0;e<H.length;e++)t.adjust(H[e]),(e&63)===63&&await f.yield?.();for(let e=0;e<J.length;e++)t.adjust(J[e]),(e&63)===63&&await f.yield?.()}function ge(e,a){const s=e.length*(a||1),o={iPos:new Float32Array(s*4),iA:new Float32Array(s*4),iB:new Float32Array(s*4),iC:new Float32Array(s*4)};a&&(o.iS=new Float32Array(s*4));let l=0;for(const h of e)for(let v=0;v<(a||1);v++,l+=4)o.iPos[l]=h.x,o.iPos[l+1]=h.z,o.iPos[l+2]=h.yaw,o.iPos[l+3]=h.k,o.iA[l]=h.s,o.iA[l+1]=h.seed,o.iA[l+2]=h.cruise,o.iA[l+3]=h.lat,o.iB[l]=h.beh,o.iB[l+1]=h.size,o.iB[l+2]=h.jit,o.iB[l+3]=h.restYaw,h.march&&(o.iC[l]=h.march[0],o.iC[l+1]=h.march[1],o.iC[l+2]=h.march[2],o.iC[l+3]=h.march[3]),a&&(o.iS[l]=v);return{attrs:o,count:s}}const De=J.filter(e=>!e.march&&e.s!==Be).sort((e,a)=>Math.abs(e.lat)-Math.abs(a.lat));ie.sort((e,a)=>Math.abs(e.lat)-Math.abs(a.lat));const kt=J.filter(e=>e.march),Te=Math.min(ie.length,140),Qe=ie.slice(0,Te).concat(H,kt,De).slice(0,i.mirror+Te),St=(t.spriteBirds||[]).length,Ve=ie.slice(0,Te).concat(H,De).slice(0,Math.max(i.sprites+Te-St,0));for(const e of t.spriteBirds||[])Ve.push({x:e.x,z:e.z,yaw:e.yaw,k:0,s:e.s,lat:20,seed:e.seed??.5,cruise:3,beh:1,size:e.size??1,jit:0,restYaw:e.yaw,march:null});await f.yield?.();const Mt=De.slice(0,Math.min(i.midMirror??0,De.length)).concat(Y.filter(e=>e.s<g+20&&e.s!==Be).sort((e,a)=>Math.abs(e.lat)-Math.abs(a.lat))).slice(0,i.farMirror),he=mt[t.hour]||mt.morning,je=t.light||null,Xe=I(E,ve,.5),R={uTime:{value:0},uFront:{value:-160},uVF:{value:D},uPix:{value:.0027},uMarchW:{value:N},uRipple:{value:X==="rains"?.7:X==="noon"?.4:.22},uCam:{value:new d.Vector3(0,6,g)},uLane:{value:new d.Vector4(q-230,q-130,7,16)},uPush:{value:new d.Vector2(36,15)},uOver:{value:new d.Vector2(1e9,-1e9)},uOverH:{value:new d.Vector2(14,2)},uSunDir:{value:new d.Vector3().fromArray(he.sunDir).normalize()},uSunColor:{value:new d.Color(he.sunColor).multiplyScalar(he.sunI)},uSkyColor:{value:(he.sky?new d.Color(he.sky):We.clone()).multiplyScalar(he.skyI)},uGroundColor:{value:Xe.clone().multiplyScalar(he.bounce)},uPink:{value:te},uPinkV:{value:te},uScarlet:{value:G},uSalt:{value:j.clone().multiplyScalar(.9)},uDeep:{value:me.clone()},uRim:{value:new d.Vector2(1,1)},uShallow:{value:ve.clone()},uSkyHor:{value:new d.Color(t.skyHorizon||"#e4ecee")},uSkyZen:{value:new d.Color(t.skyZenith||"#8eaec4")},uLum:{value:t.hour==="moon"?.3:.85}};let Je=!je;function Ke(e){if(!e)return;const a=(s,o)=>(s&&s.isColor?s.clone():new d.Color(s)).multiplyScalar(o??1);if(e.sunDir){const s=e.sunDir;(s.isVector3?R.uSunDir.value.copy(s):R.uSunDir.value.fromArray(s)).normalize()}e.sunColor!==void 0&&R.uSunColor.value.copy(a(e.sunColor,e.sunIntensity)),e.sky!==void 0&&R.uSkyColor.value.copy(a(e.sky,e.skyIntensity)),e.ground!==void 0&&R.uGroundColor.value.copy(a(e.ground,e.groundIntensity))}je&&Ke(je);const de=new d.Group;de.name="natron-liftoff-hero";const zt=()=>d.UniformsUtils.clone(d.UniformsLib.fog),le=e=>new d.ShaderMaterial(Object.assign({fog:!0},e,{uniforms:{...zt(),...R}})),oe=(e,a,s,o)=>{const l=new d.Mesh(e,a);return l.frustumCulled=!1,l.renderOrder=s,l.name=o,l.matrixAutoUpdate=!1,de.add(l),l},Ge={birds:H.length+J.length+Y.length,triangles:0,calls:0},re=(e,a)=>{Ge.triangles+=e.index.count/3*a,Ge.calls++},et=le({vertexShader:_e,fragmentShader:Oe,vertexColors:!0,side:d.DoubleSide});await f.yield?.();const tt=Ne(0,Z,r),at=Ne(1,Z,r),Le=Ne(2,Z,r),we=It();await f.yield?.();const ot=Ne(-1,Z,r.fork?r.fork("hero-lod"):r);await f.yield?.();let M=ge(H);oe(Me(tt,M.attrs,M.count),et,0,"near"),re(tt,M.count),M=ge(J),oe(Me(at,M.attrs,M.count),et,0,"mid"),re(at,M.count),await f.yield?.();const Ct=le({vertexShader:dt,fragmentShader:pt});M=ge(Y),oe(Me(we,M.attrs,M.count),Ct,0,"far"),re(we,M.count),await f.yield?.();const pe=t.mirrorClip||null,rt=pe?Oe.replace("//MIRROR_CLIP_PARS",pe.pars):Oe;pe&&Object.assign(R,pe.uniforms);const He=e=>pe?Object.assign({MCLIP:1},e):e,Pt=le({vertexShader:_e,fragmentShader:rt,vertexColors:!0,side:d.DoubleSide,defines:He({MIRROR:1}),transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8});M=ge(Qe),oe(Me(Le,M.attrs,M.count),Pt,1,"mirror"),re(Le,M.count),await f.yield?.();const At=le({vertexShader:dt,fragmentShader:pt,defines:{MIRROR:1},transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8});M=ge(Mt),oe(Me(we,M.attrs,M.count),At,1,"farMirror"),re(we,M.count),await f.yield?.();const se=Math.max(0,Math.round(t.escorts??0));let st=null;if(se>0){const e=new Float32Array(se*4),a=new Float32Array(se*4),s=new Float32Array(se*4);for(let v=0;v<se;v++)e[v*4+1]=-50,a[v*4+1]=r(),a[v*4+2]=5,a[v*4+3]=1,s[v*4+1]=.95,s[v*4+2]=1,s[v*4+3]=60;const o=v=>{const x=new d.InstancedBufferGeometry;x.index=v.index;for(const k in v.attributes)x.setAttribute(k,v.attributes[k]);const z=[new d.InstancedBufferAttribute(e,4),new d.InstancedBufferAttribute(a,4),new d.InstancedBufferAttribute(s,4)];for(const k of z)k.setUsage(d.DynamicDrawUsage);return x.setAttribute("iPos",z[0]),x.setAttribute("iA",z[1]),x.setAttribute("iB",z[2]),x.instanceCount=se,{g:x,attrs:z}},l=o(ot),h=o(Le);oe(l.g,le({vertexShader:_e,fragmentShader:Oe,vertexColors:!0,side:d.DoubleSide,defines:{ESCORT:1}}),0,"escorts"),re(ot,se),oe(h.g,le({vertexShader:_e,fragmentShader:rt,vertexColors:!0,side:d.DoubleSide,defines:He({MIRROR:1,ESCORT:1}),transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),1,"escortMirror"),re(Le,se),st={count:se,set(v,x,z,k,A,V,c,b,w,F,W){const C=v*4;e[C]=x,e[C+1]=z,e[C+2]=k,e[C+3]=A,a[C]=V,a[C+2]=w??5,a[C+3]=F??1,s[C+1]=c,s[C+2]=b??1,s[C+3]=W??60},commit(){for(const v of l.attrs)v.needsUpdate=!0;for(const v of h.attrs)v.needsUpdate=!0}}}const Ft=le({vertexShader:qt,fragmentShader:pe?vt.replace("//SPLASH_CLIP_PARS",pe.pars):vt,defines:He({}),transparent:!0,depthWrite:!1,side:d.DoubleSide});if(M=ge(Ve,4),oe(Me(we,M.attrs,M.count),Ft,2,"splash"),re(we,M.count),await f.yield?.(),t.water!==!1){const e=$(g/2),a=new d.CircleGeometry(3600,72);a.rotateX(-Math.PI/2),a.translate(e.x,0,e.z),oe(a,le({vertexShader:Vt,fragmentShader:jt}),-1,"water"),re(a,1)}const Rt=e=>[Math.sin(e.yaw),0,Math.cos(e.yaw)],K=(e,a,s=0)=>{const o=O(e,s);return[o.x,a,o.z]},Ee=[];for(let e=-140;e<q-1;e+=70)Ee.push(K(e,e<0?5-e*.02:e<200?5:e<420?5.5+(e-200)/220*.5:6.5));Ee.push(K(q-60,6.5),K(q,6.5));const nt=Rt(Q),Wt={portalSeat:{position:[Q.x,7,Q.z],facing:[-nt[0],0,-nt[2]],radius:7,station:q},flyThrough:Ee,lane:{from:q-130,to:q+40,halfWidth:15},marchers:{center:[U.x,.9,U.z],radius:p,station:T,side:-1,block:[U.x+p*Math.cos(L-(t.marchLead??.9)),.9,U.z+p*Math.sin(L-(t.marchLead??.9))]},viewpoints:{entry:K(-140,7.8),wave:K(g*.4,5.5),lane:K(q-60,6.5),marchPass:K(T,3)},axisAt:$,bandStart:K(0,0),bandEnd:K(g,0),tailEnd:K(g+ce,0),waterY:0,sunDir:R.uSunDir.value};let it=!1,lt=!0;const ct=e=>{it=!0,R.uFront.value=e},Bt=new d.Vector3,Dt=new d.Vector2,Tt=new d.Color,ft=$(g/2),Lt=36,Nt=16,_t=new d.Vector3(ft.x,5,ft.z);function Ot(e,a,s){if(lt){lt=!1,de.updateMatrixWorld(!0);let o=de;for(;o.parent;)o=o.parent;if(Je){let l=null,h=null;o.traverse(v=>{v.isDirectionalLight&&!l?l=v:v.isHemisphereLight&&!h&&(h=v)}),l&&(R.uSunDir.value.copy(l.position).sub(l.target.position).normalize(),R.uSunColor.value.copy(l.color).multiplyScalar(l.intensity)),h&&(R.uSkyColor.value.copy(h.color).multiplyScalar(h.intensity*1.2),R.uGroundColor.value.copy(Xe).multiplyScalar(.55+.35*h.intensity).lerp(Tt.copy(h.groundColor).multiplyScalar(h.intensity),.25))}!t.skyHorizon&&o.fog&&o.fog.color&&R.uSkyHor.value.copy(o.fog.color)}if(R.uTime.value=a,it||(R.uFront.value=-150+(a*24+222)%(g+330)),s){de.updateWorldMatrix(!0,!1),R.uCam.value.copy(de.worldToLocal(Bt.setFromMatrixPosition(s.matrixWorld)));const o=f.renderer?f.renderer.getDrawingBufferSize(Dt).y:1080;R.uPix.value=2/(Math.max(s.projectionMatrix.elements[5],.05)*Math.max(o,1))}}return{object:de,radius:Lt,height:Nt,center:_t,anchors:Wt,update:Ot,dispose(){},ground:!1,groundY:0,setFront:ct,setProgress:e=>ct(-160+(g+220)*Math.min(Math.max(e,0),1)),frontAt:(e,a=90)=>e+a,setLight:e=>{Je=!1,Ke(e)},uniforms:R,stats:Ge,length:g,vF:D,extent:{length:g,tail:ce,halfWidth:35,radius:g/2+10,height:30},outlierGroups:qe,escorts:st,layout:{near:H.length,mid:J.length,far:Y.length,mirror:Qe.length,splashSprites:Ve.length*4}}}export{Gt as BIRD_CLOCK,Ht as buildHero};
