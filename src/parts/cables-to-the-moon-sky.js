import*as e from"three";import{CM_GLSL as w,withShared as E,C as a,DEG as l,STEAM_DIM as Z}from"./cables-to-the-moon-common.js";const $=`
uniform vec3 uDir; uniform vec2 uSize;        // centre direction; tangent of the radius, extent of the quad in radii
varying vec2 vUv; varying vec3 vDir;      // (vDir: the direction of the point on the sky: the Moon reads its height)
void main(){
  vUv = position.xy*uSize.y;
  vec3 f = normalize(uDir);
  vec3 r = cross(f, vec3(0.0, 1.0, 0.0)); r /= max(length(r), 1e-4);
  vec3 up = cross(r, f);
  vec3 dir = f + (r*vUv.x + up*vUv.y)*uSize.x; vDir = dir;
  vec4 p = projectionMatrix*vec4(mat3(viewMatrix)*dir, 1.0);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,K=`
uniform vec3 uCore, uLimb, uCorona; uniform vec4 uSunP; uniform vec3 uVeil;      // radiance, veil 0..1, -, seed; the sky's colour round the sun (the veil's bands take it)
varying vec2 vUv;
${w}
void main(){
  float r = length(vUv), fw = fwidth(r) + 1e-5;
  float disc = 1.0 - smoothstep(1.0 - fw, 1.0 + fw, r);
  float mu = sqrt(max(1.0 - r*r, 0.0));
  // slow granulation: fine cells that boil and a faint larger mottle; no pores, no patches (it must never read as
  // a moon's seas)
  vec2 q = vUv*(1.0 + 0.18*(1.0 - mu));
  float g = cmN3(vec3(q*26.0, uTime*0.22 + uSunP.w)) - 0.5;
  float m = cmF3(vec3(q*5.5 + 3.1, uTime*0.045)) - 0.5;
  vec3 col = mix(uLimb, uCore, pow(max(mu, 0.0), 0.55));
  col *= 1.0 + 0.12*g + 0.1*m;
  col *= uSunP.x*(0.5 + 0.5*pow(max(mu, 0.0), 0.5));
  // everything off the limb is centred on the one disc and fades to nothing well inside the quad
  float off = max(r - 1.0, 0.0), edge = 1.0 - smoothstep(1.1, 1.55, off);
  // (no prominences: a tongue of fire on the limb read as a lump on the disc. The sun's edge is its own round
  // limb, with the chromosphere and the corona outside it)
  vec3 add = vec3(0.0);
  // the chromosphere hugging the limb, and the corona: soft
  // (mend R, V3: ONE CORONA AT EVERY HEIGHT. It took the limb's colour, and the limb reddens as the air
  // thins: high up, on the dark sky, it was a ring of dark red round the disc. It keeps the colour the
  // visit's sun has at the leaves (uCorona), at every height: a soft warm glow, light added and nothing else.)
  // (mend T, T3: THE SUN KEEPS A GLOW OF ITS OWN AT EVERY HEIGHT, NARROW: the chromosphere on the limb and a
  // soft glow that is a twentieth of its limb's value a third of the disc's radius out (e to the minus 9
  // radii; it had the same strength at the limb and reached a radius and more, in streams: no stream now,
  // nothing that could read as a ray; 0.42 was tried: a bright ring round the disc by day). Its own colour at the leaves, light added and nothing else; the broad glow low
  // in the air is the dome's own, which thins with height as it did.)
  add += uCorona*uSunP.x*(0.5*exp(-off*30.0) + 0.2*exp(-off*9.0))*(1.0 - disc)*edge;
  // a veil of high seed softens it all, and lies across it in level bands of haze that drift
  col = mix(col, uCore*uSunP.x*0.55, uSunP.y*0.75);
  float bands = smoothstep(0.35, 0.75, cmF(vec2(vUv.x*0.7 + uTime*0.01 + uSunP.w, vUv.y*5.0)));
  col = mix(col, uVeil.rgb*1.05, uSunP.y*0.55*bands);
  add *= 1.0 - 0.6*uSunP.y;
  // (round Q, R5: NOTHING ROUND THE DISC IS PAINTED OVER THE SKY. A patch of 'the sky's colour near the sun' lay
  // round it here to hide the stars in its glare, whole where the air is thin: but the dome behind it carries
  // its own glow round the sun, lighter than that one colour, so the patch stood on it as a dark ring that
  // grew with height. Off the disc this adds light only (the chromosphere and the corona) and covers nothing.)
  gl_FragColor = vec4(col*disc + add, disc);
}`,Y=`
uniform vec3 uAsh, uMare, uGreen, uNet, uLight, uSunTint, uSkyZ, uSkyM, uSkyH, uAxis;
uniform vec4 uMoonP, uLimbP, uSkyG, uSkyG2;   // -, green 0..1, net brightness, seed; the band's limb; the dome's powers
uniform float uMoonAir;
varying vec2 vUv; varying vec3 vDir;
${w}
// distance to the nearest edge of a cell pattern, and the distance to the nearest knot
vec2 web(vec2 p){
  vec2 n = floor(p), f = fract(p), mg = vec2(0.0), mr = vec2(0.0); float md = 8.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)), o = cmH2(n + g + uMoonP.w), r = g + o - f; float d = dot(r, r);
    if (d < md) { md = d; mr = r; mg = g; }
  }
  float ed = 8.0, kd = 8.0;
  for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++) {
    vec2 g = mg + vec2(float(i), float(j)), o = cmH2(n + g + uMoonP.w), r = g + o - f; vec2 dr = r - mr;
    float l2 = dot(dr, dr);
    if (l2 > 1e-5) { float e = dot(0.5*(mr + r), dr/sqrt(l2)); if (e < ed) { kd = min(kd, max(ed, e)); ed = e; } else kd = min(kd, e); }
  }
  return vec2(ed, kd);
}
void main(){
  float r = length(vUv), fw = fwidth(r) + 1e-5;
  // (mend R, V4: THE MOON'S LIMB IS SOFT, at every height: the outer twelfth of its radius goes out into the
  // sky in front of it, so it has no hard edge and no rim on a plain sky. Its size and its place are as they were.)
  float disc = 1.0 - smoothstep(0.915 - fw, 1.0, r);
  float z = sqrt(max(1.0 - r*r, 0.0));
  vec3 n = vec3(vUv, z);
  vec2 sp = vUv/(1.0 + z);                                    // stereographic: the net keeps its mesh to the limb
  float pw = fwidth(sp.x) + fwidth(sp.y) + 1e-5;
  // ashen cream, LARGE SOFT SEAS (four or five across the face), the pale grey-green growth in broad patches
  float mare = smoothstep(0.4, 0.8, cmF(sp*2.1 + uMoonP.w));
  float blot = smoothstep(0.34, 0.7, cmF(sp*2.7 - 11.0 + uMoonP.w*2.0));                // the green has spread over most of it
  vec3 alb = mix(uAsh, uMare, mare*0.6);
  alb = mix(alb, uGreen*(0.88 + 0.24*cmN(sp*9.0)), blot*uMoonP.y);
  float ndl = dot(n, normalize(uLight));
  float lit = smoothstep(-0.08, 0.3, ndl)*(0.45 + 0.55*clamp(ndl, 0.0, 1.0));
  lit *= 0.72 + 0.28*z;                                       // a darkened limb
  vec3 col = alb*uSunTint*(lit*0.95 + 0.03);
  // the net: GREAT CABLES of thread from knot to knot (they show as soon as the Moon is a hand across) and one
  // finer mesh between them in patches, glints sliding along the cables
  // (nothing spun is even: the mesh is pulled about, and each size of it lies in patches)
  vec2 wp = sp + 0.11*(vec2(cmN(sp*2.6 + 7.0 + uMoonP.w), cmN(sp*2.6 + 19.0 + uMoonP.w)) - 0.5);
  vec2 w0 = web(wp*3.7 + 2.0), w1 = web(wp*13.0);
  // (the great cables: a mesh of seven across the face, each cable 0.016 of its mesh across and 0.05 at a
  // knot: one to four pixels of a Moon 170 pixels across; they come and go in long reaches, below, so the
  // face is never a honeycomb)
  float th0 = 0.016 + 0.034*(1.0 - smoothstep(0.0, 0.25, w0.y)), th1 = 0.012 + 0.03*(1.0 - smoothstep(0.0, 0.2, w1.y));
  float p0 = pw*3.7, p1 = pw*13.0;
  float l0 = mix(clamp((th0 - w0.x)/max(p0, 1e-4) + 0.5, 0.0, 1.0), min(th0*3.2, 1.0), smoothstep(0.1, 0.5, p0));
  float l1 = mix(clamp((th1 - w1.x)/max(p1, 1e-4) + 0.5, 0.0, 1.0), min(th1*3.2, 1.0), smoothstep(0.1, 0.5, p1))*0.55;
  float glint = pow(clamp(0.5 + 0.5*sin(dot(sp, vec2(31.0, 17.0)) - uTime*0.9 + 6.0*cmN(sp*4.0)), 0.0, 1.0), 6.0)*(1.0 - smoothstep(0.1, 0.5, p0));
  l0 *= 0.15 + 0.85*smoothstep(0.34, 0.6, cmN(sp*1.9 + 5.0 + uMoonP.w));
  l1 *= smoothstep(0.38, 0.66, cmN(sp*3.3 + 40.0 + uMoonP.w));
  float net = max(l0, l1);
  // the thread is A LITTLE PALER THAN THE FACE IT LIES ON, silver-green: the face's own colour there gone
  // 0.45 of the way to the lit thread's (mend R, G2: it was the thread's colour itself, five times the green's
  // brightness: a heavy white net). One law on every deal, at every height; no net stands on the limb's edge.
  // (mend S: and NEVER MORE THAN 1.6 TIMES AS LIGHT AS THE FACE UNDER IT: on the green growth, a darker ground,
  // the lit thread's colour was two to three times the face's and the net stood on it as white lines.
  // Mend S2, said as it is: THE CAP IS TAKEN BEFORE THE GLINT, which then multiplies it by up to 1.5 on the
  // fully lit face: at a glint's peak a thread is drawn about 2.1 times the face under it (the reader's
  // count), 1.6 times everywhere else. Not changed in this mend.)
  vec3 nc = mix(col, uNet*(0.3 + 0.75*lit)*uMoonP.z, 0.45);
  nc *= min(1.0, 1.6*dot(col, vec3(0.3, 0.5, 0.2))/max(dot(nc, vec3(0.3, 0.5, 0.2)), 1e-4))*(1.0 + 0.5*glint*lit);
  col = mix(col, nc, net*0.8*smoothstep(0.0, 0.3, z));
  // THE UNLIT PART OF THE MOON IS NOT SEEN: it is the sky behind it, at every height. Its face and its net show
  // only where the sun lights them; nothing stands off its limb (mend P, Q6: no halo, a clean lit limb).
  float body = clamp(lit*1.4, 0.0, 1.0);
  float a = disc*body;
  // THROUGH THE AIR (the law at the head of this shader): the sky's own colour at this point of the Moon, and
  // on it what of the lit face comes through
  vec3 d = normalize(vDir); float inv = 1.0 - clamp(d.y, 0.0, 1.0);
  vec3 sky = mix(mix(uSkyZ, uSkyM, pow(inv, uSkyG2.x)), uSkyH, pow(inv, uSkyG.x));
  float e = acos(clamp(dot(d, uAxis), -1.0, 1.0)) - uLimbP.x;                 // the point's height over the world's edge
  float through = uMoonAir*mix(0.4, 1.0, smoothstep(0.0, 0.436, e));
  col = sky + 0.9*through*col;
  gl_FragColor = vec4(col*a, a);
}`,O=`
varying vec3 vDir;
void main(){ vDir = position; vec4 p = projectionMatrix*vec4(mat3(viewMatrix)*position, 1.0); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,Q=`
uniform vec3 uAxis, uBandCol; uniform vec4 uLimbP;
varying vec3 vDir;
${w}
void main(){
  vec3 d = normalize(vDir);
  float e = acos(clamp(dot(d, uAxis), -1.0, 1.0)) - uLimbP.x;           // angle above the limb
  vec2 hd = d.xz/max(length(d.xz), 1e-4), sd = uSunDir.xz/max(length(uSunDir.xz), 1e-4);
  float sun = 0.5 + 0.5*dot(hd, sd);
  float below = 1.0 - smoothstep(-0.004, 0.004, e);
  // heat shimmer: the band's top edge wavers
  float az = atan(d.x, -d.z + 1e-6);
  float wav = 0.0012*sin(az*37.0 + uTime*1.3) + 0.0008*sin(az*83.0 - uTime*2.1);
  float x = max(e + wav, 0.0)/max(uLimbP.y, 1e-3);
  // THE WORLD'S EDGE HAS NO LINE (mend P): on the limb and under it the far plane is the sky's own colour at
  // the horizon (uLandAir, mend S: the land's own lit air, the colour the far land has gone into), whole at the limb and
  // thinning upward to an UNEVEN top (by bearing, 0.4 of a band height to about two), so the sky comes down
  // into the land softly at every height of the eye; no strength of it goes by the eye.
  // (mend S: uneven in BROAD REACHES of bearing, 20 to 40 degrees long. It was uneven every 3 to 6 degrees:
  // unseen while the band was the sky's own colour, but the lit air of the land under a violet sky showed it
  // as upright rays over the world's edge.)
  float lift = 0.4 + 2.2*cmF(hd*1.6 + 11.0)*cmF(hd*3.1 + 2.0);
  float band = exp(-x*2.4/lift);
  vec3 steam = uBandCol*${Z.toFixed(2)}*(1.0 + 0.16*sun*sun*sun);
  vec3 col = uLandAir;
  // LONG LOW TORN BANKS OF STEAM lie on the forest at the world's edge (G3 a): by bearing, long along the edge,
  // thin, torn, drifting slowly, just over the limb and never standing up in the sky; the steam's own colour (0.7
  // of the haze's: the common part's STEAM_DIM), a sixth brighter toward the sun.
  float torn = smoothstep(0.46, 0.7, cmF(vec2(az*5.0 + uTime*0.0015, x*7.0) + 7.0) + 0.3*(cmF(vec2(az*31.0, x*17.0) + 3.0) - 0.5))*exp(-x*x*9.0);
  col = mix(col, steam, 0.55*torn*(1.0 - below));
  float a = clamp(max(below, max(band, 0.8*torn)), 0.0, 1.0);
  gl_FragColor = vec4(col*a, a);
}`,J=`
uniform vec3 uAxis, uCloudLit, uCloudShade; uniform vec4 uLimbP, uCloudP; uniform float uSunA;
varying vec3 vDir;
${w}
void main(){
  vec3 d = normalize(vDir);
  float e = acos(clamp(dot(d, uAxis), -1.0, 1.0)) - uLimbP.x, ed = e*57.29578;       // degrees above the world's edge
  vec2 hd = d.xz/max(length(d.xz), 1e-4), sd = uSunDir.xz/max(length(uSunDir.xz), 1e-4);
  float sun = 0.5 + 0.5*dot(hd, sd), sd0 = uCloudP.y;
  // bars: long in bearing (about 25 degrees), thin in height (a degree or two)
  vec3 q = vec3(hd*2.3 + sd0, ed*0.42 + sd0*3.0);
  float n1 = cmF3(q), n2 = cmF3(q - vec3(0.0, 0.0, 0.25));
  float few = smoothstep(0.42, 0.62, cmN3(vec3(hd*1.1 + 7.0 + sd0, ed*0.07)));
  float bar = smoothstep(0.54, 0.66, n1)*few*smoothstep(4.0, 8.0, ed)*(1.0 - smoothstep(16.0, 23.0, ed));
  // (mend T, T4, the guard's limit: NO CLOUD LIES ACROSS THE SUN'S FACE. A bar ends short of the sun: nothing of
  // it within 1.15 of the disc's own radius of the sun's middle, whole past 1.9 of it: a rule of the sky)
  bar *= smoothstep(1.15*uSunA, 1.9*uSunA, acos(clamp(dot(d, normalize(uSunDir)), -1.0, 1.0)));
  float lit = clamp(0.35 + 9.0*(n1 - n2), 0.0, 1.0);
  vec3 col = mix(uCloudShade, uCloudLit*(0.8 + 0.6*sun*sun*sun), lit);
  float a = bar*0.8*uCloudP.x;
  // veils
  float az = atan(d.x, -d.z + 1e-6), veil = 0.0;
  for (int i = 0; i < 4; i++) {
    float fi = float(i), a0 = 6.2831853*cmH(vec2(fi*3.7 + sd0, 1.3)), wd = 0.035 + 0.05*cmH(vec2(fi, 5.1 + sd0)), top = 0.05 + 0.07*cmH(vec2(fi, 9.7 + sd0));
    float x = az - a0 - uCloudP.z*e*1.6; x -= 6.2831853*floor(x/6.2831853 + 0.5);
    float streak = 0.55 + 0.45*cmN(vec2(x*160.0 + fi*9.0, e*50.0 - uTime*0.15));
    veil = max(veil, exp(-x*x/(wd*wd))*(1.0 - smoothstep(0.3*top, top, e))*smoothstep(-0.004, 0.006, e)*streak);
  }
  float av = veil*0.5*uCloudP.x;
  col = mix(col, uHazeCol*0.8, av/max(a + av, 1e-4));                 // (a far storm's veil is the steam's kin: under white)
  a = clamp(a + av, 0.0, 1.0);
  gl_FragColor = vec4(col*a, a);
}`;function te(X,m,t={}){const v=m.U,u=new e.Group;u.name="heavens";const R=new e.PlaneGeometry(2,2),C=(k,o,r)=>{const s=new e.Mesh(R,new e.ShaderMaterial({uniforms:E(v,o),vertexShader:$,fragmentShader:k,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,depthTest:!0,fog:!1}));return s.frustumCulled=!1,s.renderOrder=r,u.add(s),s},G=(t.sunRadius??7.5)*l,n={uDir:{value:m.sunDir.clone()},uSize:{value:new e.Vector2(Math.tan(G),2.6)},uCore:{value:a(t.sunCore??"#FFDC7A")},uLimb:{value:a(t.sunLimb??"#F08A24")},uSunP:{value:new e.Vector4(t.sunRadiance??3.5,t.veil??0,0,t.seed??0)},uVeil:{value:new e.Vector3(0,0,0)},uCorona:{value:a(t.sunLimb??"#F08A24")}},V=C(K,n,-.9);V.name="sun";const f=(t.moonDir?t.moonDir.clone():new e.Vector3(0,Math.sin(24*l),-Math.cos(24*l))).normalize(),T=new e.Vector3().crossVectors(f,new e.Vector3(0,1,0)).normalize(),I=new e.Vector3().crossVectors(T,f),P=m.sunDir.dot(T),D=m.sunDir.dot(I),N=Math.hypot(P,D)||1,x=t.moonPhase??.55,L=Math.sqrt(Math.max(1-x*x,0)),h=new e.Color(1,1,1).lerp(a(t.sunLight??"#FFDC7A"),.3),b=.2126*h.r+.7152*h.g+.0722*h.b;h.lerp(new e.Color(b,b,b),t.sunVeil??0);const i={uAxis:{value:new e.Vector3(0,-1,0)},uBandCol:{value:a("#F2DC9A")},uLimbP:{value:new e.Vector4(Math.PI/2,6*l,0,.5)}},d=t.skyU||{uZenith:{value:a("#D8C27A",.64)},uMid:{value:a("#E6D48C",.76)},uHorizon:{value:a("#F6E8B4",.92)},uGrad:{value:new e.Vector4(2.6,0,0,0)},uGrad2:{value:new e.Vector4(1.3,0,0,0)}},y={uDir:{value:f},uSize:{value:new e.Vector2(Math.tan((t.moonRadius??7.5)*l),1.3)},uAsh:{value:a("#DCD4B2")},uMare:{value:a("#8E8A70")},uGreen:{value:a(t.moonGreen??"#8C9A7C")},uNet:{value:a("#C4DCC0",1.1)},uLight:{value:new e.Vector3(P/N*L,D/N*L,x)},uSunTint:{value:h},uSkyZ:d.uZenith,uSkyM:d.uMid,uSkyH:d.uHorizon,uSkyG:d.uGrad,uSkyG2:d.uGrad2,uAxis:i.uAxis,uLimbP:i.uLimbP,uMoonAir:{value:1},uMoonP:{value:new e.Vector4(0,t.moonGreenAmount??.75,t.netGain??1,(t.seed??0)*7)}},U=C(Y,y,-.8);U.name="moon";const c=new e.Mesh(new e.BoxGeometry(2,2,2),new e.ShaderMaterial({uniforms:E(v,i),vertexShader:O,fragmentShader:Q,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,depthTest:!0,side:e.DoubleSide,fog:!1}));c.frustumCulled=!1,c.renderOrder=-.7,c.name="air-band",u.add(c);const p={uSunA:{value:(t.sunRadius??7.5)*l},uAxis:i.uAxis,uLimbP:i.uLimbP,uCloudP:{value:new e.Vector4(1,(t.seed??0)*13,t.windLean??1,0)},uCloudLit:{value:a(t.cloudLit??"#FFD79A",1.05)},uCloudShade:{value:a(t.cloudShade??"#B89A8E",.9)}},g=new e.Mesh(c.geometry,new e.ShaderMaterial({uniforms:E(v,p),vertexShader:O,fragmentShader:J,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,depthTest:!0,side:e.DoubleSide,fog:!1}));g.frustumCulled=!1,g.renderOrder=-.75,g.name="high-cloud",u.add(g);const S=new e.Vector3,A=new e.Vector3,z=n.uCore.value.clone(),B=n.uLimb.value.clone(),_=z.clone().lerp(a("#FFF2C8"),.2),q=a("#D8401A"),j=n.uSunP.value.y,W=n.uSunP.value.x;return{object:u,sunU:n,moonU:y,bandU:i,cloudU:p,moonDir:f,update(k,o){o.moonAir!==void 0&&(y.uMoonAir.value=o.moonAir),o.cloud!==void 0&&(p.uCloudP.value.x=o.cloud),o.skyNearSun&&p.uCloudShade.value.copy(o.skyNearSun).multiplyScalar(.78),o.skyNearSun&&n.uVeil.value.set(o.skyNearSun.r,o.skyNearSun.g,o.skyNearSun.b),o.thin!==void 0&&(n.uCore.value.copy(z).lerp(_,o.thin),n.uLimb.value.copy(B).lerp(q,o.thin),n.uSunP.value.y=j*(1-.85*o.thin),n.uSunP.value.x=W*(1+.06*o.thin)),k.getWorldPosition(S);const r=v.uBend.value,s=r.z,F=o.roofY-r.w;if(s<1e-9)i.uAxis.value.set(0,-1,0),i.uLimbP.value.x=Math.PI/2-Math.atan2(Math.max(S.y-F,.5),6e4);else{const M=1/s;A.set(r.x,F-M,r.y).sub(S);const H=A.length();i.uAxis.value.copy(A).multiplyScalar(1/H),i.uLimbP.value.x=Math.asin(Math.min(1,M/Math.max(H,M+.5)))}}}}export{te as makeHeavens};
