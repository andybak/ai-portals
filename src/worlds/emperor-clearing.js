import*as e from"three";import{makePath as x0,clamp as Fe,lerp as _,smoothstep as v}from"../kit/core.js";import*as t0 from"../kit/fx.js";import{buildHero as b0,STAIN_GLSL as k0}from"../parts/emperor-clearing.js";const _e=["#8E8CA6","#23233A","#D6D9EA","#3F6FA3","#F3A6C8","#8FE6C4","#4AB2FF"],De=Math.PI/180,Je=42,St=o=>[Math.sin(o*De),-Math.cos(o*De)],E=St(150),We=[-E[1],E[0]],ee=new e.Vector3(-4,0,-220),Mt=new e.Vector3(120,44,-220),me={x0:116,k:9e-4,zN:-220,vMin:-290,vMax:190},Wt=o=>me.x0-me.k*(o-me.zN)*(o-me.zN),o0=o=>[[0,1.2,0],[0,1.3,-30],[.4,1.55,-46],[3,6.2,-79],[4,2.2,-106],[3,1.5,-126],[-2,1.4,-150],[.6,o?2.6:1.5,-160.5],[2,o?5.5:3.2,o?-169:-168],[-1,3.2,-202],[-4,3.2,-220],[-9,3.4,-238],[-32,5.5,-236],[-46,8,-220],[-38,10.5,-196],[-24,6.2,Tt-1.2],[-9,3.6,Tt],[12,4.4,Tt+1],[30,7,-172],[62,8.3,-196.1],[73,11.75,-200.65],[84.75,19.81,-205.49],[96.5,27.87,-210.32],[120,44,-220]],Tt=-180,S0=new e.Vector3(Math.sin(351*De)*Math.cos(7.5*De),Math.sin(7.5*De),-Math.cos(351*De)*Math.cos(7.5*De)),a0=-192,Ue=`
uniform float uSfEdge, uSfLean, uSfDense, uSfHaze, uSfTime, uSfTop, uSfThin, uSfHs, uSfWall;
uniform vec3 uSfColA, uSfColB, uSfHazeCol, uSfGlow, uSfGlowDir, uMoonDir, uMoonCol;
uniform vec2 uSfKey;
float sfHash(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.y); }
float sfVN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(sfHash(i), sfHash(i + vec2(1.0, 0.0)), f.x), mix(sfHash(i + vec2(0.0, 1.0)), sfHash(i + vec2(1.0, 1.0)), f.x), f.y); }
float sfTear(vec2 p){ return smoothstep(0.15, 0.9, sfVN(p)) - 0.45; }
// the same noise read on a turned, sheared lattice with a second octave: no cell edge runs level or upright on a wall
float sfVR(vec2 p){ vec2 q = vec2(p.x*0.8 + p.y*0.6, p.y*0.8 - p.x*0.6); return 0.68*sfVN(q) + 0.32*sfVN(q*2.13 + vec2(17.3, 5.1)); }   // rounded tongues thrown up from a level edge (gentle: steep ones are saw teeth)
float sfRamp(float x){ return x < 0.0 ? 0.0 : (x < 1.0 ? 0.5*x*x : x - 0.5); }
// rgb = fog colour, a = amount. hz scales the clear-air haze (0 for the sky dome).
// The snow layer is a convex wedge: under a ragged, billowing top (uSfTop) and under its REAR FACE, a slope that
// rises downwind from a foot line at wind coordinate uSfEdge (uSfLean m up per metre). It is a GROUND blizzard:
// thick in its lowest ten metres (uSfHs) and a thin veil above (uSfThin) that is mostly open above a few degrees
// of elevation, so from inside the sky stands clear over the drift and from behind the wall is a dense drift at
// its foot under translucent, folded veils.
vec4 sfFogRay(vec3 C, vec3 P, float hz){
  vec3 d = P - C; float D = max(length(d), 1e-3); vec3 n = d/D;
  vec2 W = vec2(0.5, 0.8660254), X = vec2(-0.8660254, 0.5);
  float sC = dot(C.xz, W) - uSfEdge, lC = dot(C.xz, X), nl = dot(n.xz, X);
  float ns = dot(n.xz, W);
  float hC = C.y - uSfLean*sC, nh = n.y - uSfLean*ns;
  // seen from behind, the rays that run level with the leaning face never meet it: in the picture they are one straight
  // line (the face's own horizon), with the whole wall on one side of it and clear air on the other. Near that line
  // the face is read with a slow wobble in the direction itself, and (below) the wall thins away toward it: a billowed,
  // feathered edge against the sky, never a straight slant
  float gzOut = smoothstep(0.0, 4.0, hC);
  float gz = gzOut*(1.0 - smoothstep(0.06, 0.5, abs(nh)));
  nh += gz*(0.22*(sfVN(vec2(n.x*4.3 + n.y*2.7 + 2.0, n.z*4.3 - n.y*1.9 + uSfTime*0.03)) - 0.5) + 0.09*(sfVN(vec2(n.x*11.0 - n.y*5.0 + 9.0, n.z*11.0 + n.y*7.0 - uSfTime*0.05)) - 0.5));
  nh = abs(nh) < 2e-3 ? (nh < 0.0 ? -2e-3 : 2e-3) : nh;
  float ny = abs(n.y) < 1e-3 ? 1e-3 : n.y;
  // raggedness is read where the ray meets the nominal face and the nominal top (fixed in the world, not in the view)
  float tF = clamp(-hC/nh, 0.0, min(D, 420.0));
  float latF = lC + nl*tF, yF = clamp(C.y + n.y*tF, 0.0, 110.0);
  float lod = 1.0 - smoothstep(110.0, 300.0, tF);      // far along the wall the fine detail would only alias: let it go
  // fp: how many metres along the wall one pixel covers where the ray meets it. Seen at a slant (the wall running
  // away into the distance) that grows fast, and every term is let go before a pixel spans a third of its wavelength:
  // without this the far wall breaks into marbled glassy panes
  float fp = tF*0.0024*(1.0 + abs(nl)/max(abs(nh), 0.02));
  float f90 = 1.0 - smoothstep(10.0, 34.0, fp), f40 = 1.0 - smoothstep(4.5, 15.0, fp), f22 = 1.0 - smoothstep(2.5, 8.0, fp), f3 = 1.0 - smoothstep(0.35, 1.2, fp);
  float rag = (sfVN(vec2(latF*0.011, yF*0.016 + 3.0)) - 0.5)*26.0*(0.35 + 0.65*lod)*f90
            + (sfVN(vec2(latF*0.045 + 7.0, yF*0.06)) - 0.5)*10.0*lod*f22
            + (sfVN(vec2(latF*0.3 + yF*0.05, yF*0.03 + 5.0)) - 0.5)*5.0*(1.0 - smoothstep(50.0, 170.0, tF))*smoothstep(0.12, 0.5, abs(ns))*f3
            + (sfVN(vec2(latF*0.024 + 1.7, yF*0.033 + 9.0)) - 0.5)*15.0*f40    // lumps
            + (sfVN(vec2(latF*0.041 + 2.0, yF*0.052 - uSfTime*0.03)) - 0.5)*20.0*f22*(1.0 - smoothstep(300.0, 420.0, tF));   // slow billows
  // (as a firm departing wall the face only billows gently: the big raggedness, read on the nominal face, would
  // fold a steep firm face into saw teeth; its torn edge is the top's own)
  // (for its first two seconds, while it still leans at 3.2, it keeps 0.4 of it: its edge against the sky is billowed, never one straight slant)
  hC += uSfLean*rag*mix(1.0, mix(0.4, 0.16, smoothstep(3.2, 4.0, uSfLean)), uSfWall);
  float tT = clamp((uSfTop - C.y)/ny, 0.0, min(D, 420.0));
  // (as a departing wall its top is read where the ray meets the face, so the torn edge is one line along the
  // wall; read on the top plane it would be corrugated along the wind and fan out in spikes from the vanishing point)
  float latT = mix(lC + nl*tT, latF, uSfWall);
  float fpT = mix(tT*0.0024*(1.0 + abs(nl)/max(abs(ny), 0.02)), fp, uSfWall);
  float top = uSfTop + (sfVN(vec2(latT*0.012, 11.0)) - 0.5)*36.0*(1.0 - smoothstep(10.0, 34.0, fpT))
            + (sfVN(vec2(latT*0.05, 4.0)) - 0.5)*14.0*(1.0 - smoothstep(2.5, 8.0, fpT))
            + (sfVN(vec2(latT*0.03 + 9.0, uSfTime*0.06)) - 0.5)*18.0*(1.0 - smoothstep(4.0, 13.0, fpT))
            // as it leaves it stands as a wall, and its top is torn: tongues a few metres across, some thrown up, drifting along it
            + uSfWall*(sfTear(vec2(latT*0.07 + 2.0, 7.0 + uSfTime*0.05))*10.0*(1.0 - smoothstep(1.0, 3.5, fpT))
                     + (sfVN(vec2(latT*0.21 + 5.0, 3.0 - uSfTime*0.11)) - 0.5)*4.6*(1.0 - smoothstep(0.35, 1.2, fpT))
                     + (sfVN(vec2(latT*0.8 + 9.0, 5.0 + uSfTime*0.2)) - 0.5)*1.7*(1.0 - smoothstep(0.12, 0.45, fpT)));
  float t0 = 0.0, t1 = D;
  float ty = (top - C.y)/ny;
  if (ny > 0.0) t1 = min(t1, ty); else t0 = max(t0, ty);
  float tf = -hC/nh;
  if (nh < 0.0) t0 = max(t0, tf); else t1 = min(t1, tf);
  float tIn = max(t0, 0.0);
  float kOut = smoothstep(0.0, 6.0, tIn);
  if (C.z > 0.0 && n.z < 0.0) t0 = max(t0, -C.z/n.z);   // seen through the previous portal: the snow starts at the entry plane
  t1 = max(t1, t0);
  // density ramps up over the first 20 m under the face, so the wall is feathered wherever it is seen
  float R = mix(28.0, 7.0, uSfWall*kOut) + 0.08*min(tIn, 400.0);   // and more softly the further away its edge is seen (as a departing wall: a firm face)
  float x0 = -(hC + nh*t0)/R, x1 = -(hC + nh*t1)/R;
  float len = max((sfRamp(x1) - sfRamp(x0))*R/(-nh), 0.0);
  // the layer thins toward its top as it does under its face: no crisp corner where the top meets the face
  // (and over more height the further off the wall stands, so its far reach has no hard top)
  len *= smoothstep(0.0, mix(24.0 + 0.1*min(tIn, 400.0), 1.6 + 0.022*min(tIn, 400.0), uSfWall*kOut), top - (C.y + n.y*0.5*(t0 + t1)));
  // a ground blizzard: the mean of exp(-y/uSfHs) along the ray's stretch inside the layer, over a thin veil
  float ya = clamp(C.y + n.y*t0, 0.0, 300.0), yb = clamp(C.y + n.y*t1, 0.0, 300.0);
  float xh = max(abs(yb - ya)/uSfHs, 1e-3);
  float thin = mix(uSfThin, 0.62, uSfWall*kOut);         // the departing wall has a body all the way up
  len *= thin + (1.0 - thin)*exp(-min(ya, yb)/uSfHs)*(1.0 - exp(-xh))/xh;
  float cz = mix(3.5, 8.0, kOut);                      // the nearest metres stay clear, without a step (more of them
  len -= cz*(1.0 - exp(-len/cz));                      // at the foot of the departing wall: birds there keep their darks)
  // gust walls: bands across the wind that march downwind every four seconds
  vec3 M = C + n*min(D, 34.0);
  float g = sfVN(vec2((dot(M.xz, W) - uSfTime*20.0)/80.0, dot(M.xz, X)/150.0 + 2.0));
  g = 0.6*g + 0.4*sfVN(vec2((dot(M.xz, W) - uSfTime*26.0)/23.0, dot(M.xz, X)/40.0));
  float dens = uSfDense*(0.42 + 1.75*g*g);
  // it is a GROUND blizzard: above a few degrees of elevation the veil is mostly open sky, with torn rags of it
  // lying in level layers and drifting round the horizon (read in direction space, so they never fan out as
  // streaks from the wind's vanishing point)
  float upK = smoothstep(0.03, 0.2, n.y)*(1.0 - kOut);
  vec2 dh = n.xz/max(length(n.xz), 1e-3);
  float gw = sfVN(dh*1.3 + vec2(n.y*2.0 + 3.0, uSfTime*0.02));
  float gn = 0.5*sfVN(vec2(dh.x*2.6 + 3.0 + uSfTime*0.03, n.y*7.5 + 1.2*gw)) + 0.5*sfVN(vec2(dh.y*2.6 + 11.0 - uSfTime*0.02, n.y*7.5 + 5.0 + 1.2*gw));
  gn = mix(gn, 0.8, smoothstep(0.55, 0.85, n.y));
  dens *= mix(1.0, mix(0.5, 0.05, smoothstep(0.33, 0.5, gn)), upK);
  // seen from outside, the face of the snow layer: billows and hanging fringes
  // (read on the nominal face, which is smooth across the screen, and let go with the same footprint)
  float f33 = 1.0 - smoothstep(4.0, 13.0, fp), f10 = 1.0 - smoothstep(1.2, 4.0, fp);
  float bil = 0.6*mix(0.5, sfVR(vec2(latF*0.03, yF*0.045 - uSfTime*0.02)), f33) + 0.4*mix(0.5, sfVR(vec2(latF*0.1 + 3.0, yF*0.12 - uSfTime*0.05)), f10);
  float bilU = 0.6*mix(0.5, sfVR(vec2(latF*0.03, (yF + 5.0)*0.045 - uSfTime*0.02)), f33) + 0.4*mix(0.5, sfVR(vec2(latF*0.1 + 3.0, (yF + 5.0)*0.12 - uSfTime*0.05)), f10);
  float frg = mix(0.5, sfVR(vec2(latF*0.21 + 2.2*bil + yF*0.07, yF*0.045 + 5.0)), f3);   // torn wisps that lean and break, not upright bars
  float lodE = 1.0 - smoothstep(120.0, 320.0, tIn);
  bil = mix(0.5, bil, lodE); bilU = mix(0.5, bilU, lodE); frg = mix(0.5, frg, lodE);
  dens *= mix(1.0, clamp((0.2 + 1.5*bil)*(0.76 + 0.48*frg), 0.24, 1.7)*mix(1.0, 0.4, smoothstep(50.0, 280.0, tIn)), kOut);   // folds thicken and thin the veil (nothing punches a hole); its far reach is haze
  // the departing wall is dense right up to its torn top (its foot stays a feathered drift)
  dens *= mix(1.0, mix(1.5, 4.5, smoothstep(3.0, 14.0, C.y + n.y*tIn))*mix(1.6, 1.0, smoothstep(60.0, 140.0, tIn)), uSfWall*kOut);   // (and a firm body where it stands close: nothing shows through it)
  dens *= 1.0 - 0.94*gzOut*smoothstep(15.0, 130.0, tIn)*(1.0 - smoothstep(0.1, 0.5, abs(nh)));   // (toward the face's own horizon the wall thins to nothing)
  float tS = dens*len, tH = uSfHaze*hz*D;
  vec2 dx = n.xz/max(length(n.xz), 1e-3);
  float glow = 0.5 + 0.5*dot(dx, uSfKey);
  float up = n.y;
  float crown = smoothstep(10.0, 56.0, yF);
  // inside, the murk is a slate band on the horizon, darker than the snow under it and paler than the sky over it,
  // palest on the key side; from outside the wall is slate, and the upper edge of every fold catches the pearl light
  float kIn = 0.03 + 0.58*glow*glow - 0.8*(g - 0.45) - 0.7*max(up, 0.0)*(1.0 - 0.5*glow) + 0.3*(gn - 0.5)*upK;
  float lit = smoothstep(-0.02, 0.14, bil - bilU)*lodE;
  float kFace = 0.15 + 0.14*glow*glow + 0.46*lit*(0.55 + 0.45*crown) + 0.24*crown*bil + 0.14*(frg - 0.5) + 0.22*smoothstep(60.0, 380.0, tIn);
  // the wall's torn top catches the pearl light: a pale crest along it, above a slate body
  float yIn = C.y + n.y*tIn;
  // (a narrow rim, bright only on the tongues that stand up and broken between them, fading along the wall: one even
  // band of it is a white ribbon drawn across the sky)
  float crB = smoothstep(0.3, 0.72, sfVN(vec2(latT*0.045 + 13.0, 3.0 + uSfTime*0.04)))*(0.55 + 0.45*sfVN(vec2(latT*0.19 + 5.0, 9.0 - uSfTime*0.07)));
  float crest = (1.0 - smoothstep(1.5, 9.0, top - yIn))*smoothstep(-3.0, 1.0, top - yIn)*uSfWall*kOut*(1.0 - 0.9*smoothstep(110.0, 260.0, tIn))*(0.38 + 0.62*crB);
  kFace = mix(kFace, kFace*0.3, uSfWall*(1.0 - crest)) + 0.62*crest*(0.7 + 0.6*bil);
  float k = clamp(mix(kIn, kFace, kOut), 0.1*kOut, 1.0 + 0.1*kOut*crown);
  // act one: a darker gust wall stands above the horizon, so the upper frame is never one flat grey
  k -= (1.0 - kOut)*0.3*smoothstep(0.5, 0.75, g)*smoothstep(0.02, 0.2, up)*(1.0 - smoothstep(0.35, 0.7, up));
  vec3 sc = mix(uSfColA, uSfColB, max(k, 0.0));
  // while it blows, the murk glows toward the notch: the light of the ring and the pearl bank soaking through
  float gd = max(dot(n, uSfGlowDir), 0.0); float g4 = gd*gd; g4 *= g4; float g16 = g4*g4; g16 *= g16;
  sc += uSfGlow*(0.7*g16 + 0.3*g4)*(1.0 - kOut);
  sc += vec3(0.25, 0.21, 0.25)*crest + vec3(0.15, 0.12, 0.14)*crest*crest*crest;
  // the low moon soaks through the drift: a warm bloom in the murk round it
  float md = max(dot(n, uMoonDir), 0.0); float m4 = md*md; m4 *= m4; float m16 = m4*m4; m16 *= m16; float m64 = m16*m16; m64 *= m64;
  sc += uMoonCol*(0.5*m64 + 0.2*m16 + 0.02*m4);
  vec3 col = (sc*tS + uSfHazeCol*tH)/max(tS + tH, 1e-5);
  return vec4(col, 1.0 - exp(-(tS + tH)));
}
vec3 sfApply(vec3 col, vec3 P){ vec4 f = sfFogRay(cameraPosition, P, 1.0); return mix(col, f.rgb, f.a); }
`,tt=`
uniform vec3 uKeyDir, uKeyCol, uSkyCol, uGroundCol, uRimCol;
uniform float uSat;
vec3 wGrade(vec3 c){ float l = dot(c, vec3(0.2126, 0.7152, 0.0722)); return mix(l*vec3(0.97, 0.96, 1.09), c, uSat); }
`,M0=`
varying vec3 vWp, vN, vLp;
void main(){
  vec4 lp = vec4(position, 1.0); vec3 n = normal;
  #ifdef USE_INSTANCING
    lp = instanceMatrix*lp; n = mat3(instanceMatrix)*n;
  #endif
  vLp = position;
  vec4 wp = modelMatrix*lp; vWp = wp.xyz; vN = mat3(modelMatrix)*n;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,C0=`
attribute float aRel;
varying vec3 vWp, vN, vLp; varying float vRel;
void main(){
  vLp = position; vRel = aRel;
  vec4 wp = modelMatrix*vec4(position, 1.0); vWp = wp.xyz; vN = mat3(modelMatrix)*normal;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,z0=`
uniform vec3 uZenith, uMid, uArch, uShadow, uBelt, uPearl, uPink, uMint, uBlue, uCone;
uniform vec2 uSun;
uniform float uTime, uStars, uVivid, uRibF, uRayF, uCoreK, uWave, uFlow, uSnake, uSat, uMoonK, uVeilK, uCreep, uRayT;
uniform vec3 uSnowC, uSkyCol, uGroundCol, uKeyCol;
uniform vec4 uLensA[LENS_N], uLensB[LENS_N], uLensC[LENS_N];
${Ue}
varying vec3 vDir;
void main(){
  vec3 d = normalize(vDir);
  float y = max(d.y, 0.0);
  vec2 dx = d.xz/max(length(d.xz), 1e-3);
  float sunSide = 0.5 + 0.5*dot(dx, uSun);
  vec3 sky = mix(uMid, uZenith, smoothstep(0.06, 0.62, y));
  float anti = 1.0 - sunSide;
  float arch = exp(-y*5.5)*(0.25 + 0.75*sunSide*sunSide);
  sky = mix(sky, uArch, arch);
  sky = mix(sky, uShadow, exp(-y*10.0)*anti*0.85);
  // opposite the sun: a lilac-rose band above the slate Earth shadow, the first sky the snow uncovers
  float bz = (y - 0.2)/0.13;
  sky = mix(sky, uBelt, exp(-bz*bz)*anti*anti*0.55);
  sky += uArch*0.25*exp(-y*16.0)*sunSide;
  // a few faint stars
  vec2 sp = d.xz/(0.35 + y)*11.0; vec2 sc = floor(sp);
  float sh = sfHash(sc + 3.7);
  vec2 so = vec2(sfHash(sc + 11.1), sfHash(sc + 27.3))*0.6 + 0.2;
  float st = (1.0 - smoothstep(0.012, 0.05, length(fract(sp) - so)))*step(0.8, sh)*smoothstep(0.2, 0.55, y);     // points (as discs they were dust on the lens)
  sky += vec3(0.8, 0.82, 1.0)*st*uStars*1.5*(0.6 + 0.4*sin(uTime*2.0 + sh*90.0));
  // the moon, low over the plain in the north-north-west: old gold, a soft limb, a warm halo
  float mdt = dot(d, uMoonDir);
  float mdisc = smoothstep(0.99950, 0.99972, mdt);
  float mlimb = clamp((mdt - 0.99950)/0.0005, 0.0, 1.0);
  vec3 mcol = vec3(1.5, 1.08, 0.62)*(0.72 + 0.28*mlimb)*(0.86 + 0.2*sfVN(d.xy*260.0 + d.z*190.0));
  float mh1 = max(mdt, 0.0); float mh2 = mh1*mh1; mh2 *= mh2; mh2 *= mh2; mh2 *= mh2; float mh3 = mh2*mh2; mh3 *= mh3; mh3 *= mh3; mh3 *= mh3;
  sky += uMoonCol*(1.1*mh3*mh3 + 0.5*mh3 + 0.07*mh2)*uMoonK;
  sky = mix(sky, mcol, mdisc*uMoonK);
  float cone = 1.0 - smoothstep(0.93, 0.985, dot(d, uCone));
  // a thin pearl veil joins the lenses into one bank on the sun side
  vec2 vp = d.xz/(0.3 + y);
  vec2 vq = vec2(dot(vp, vec2(-uSun.y, uSun.x)), dot(vp, uSun));
  float vw = sfVN(vec2(vq.x*0.9 + 3.0, vq.y*1.3));
  float vn = sfVN(vec2(vq.x*1.3 + 2.0*vw, vq.y*3.4 + uTime*0.008)) *(0.55 + 0.45*sfVN(vec2(vq.x*4.0, vq.y*11.0 + 4.0)));
  float veil = smoothstep(0.14, 0.56, vn)*smoothstep(0.07, 0.2, y)*(1.0 - smoothstep(0.42, 0.7, y))*smoothstep(0.4, 0.88, sunSide)*cone;
  vec3 veilC = uPearl*0.5 + 0.3*uVivid*mix(uPink, uMint, smoothstep(0.3, 0.7, vw));
  veil *= 0.85 + 0.15*smoothstep(0.2, 0.8, sfVN(vec2((vq.x + 0.09*sfVN(vq*2.7 + 5.0))*17.0 + 5.0*vw, vq.y*3.0 + 9.0)));   // faint, irregular ribbing
  sky = mix(sky, veilC, veil*0.34*uVeilK);
  // nacreous sheets: lee-wave cloud lit from below the horizon, hanging like curtains. Each has a crisp, sinuous
  // hem (folded like cloth, never a closed outline) with the pearl core lying along it, and above the hem it is
  // combed into fine upright rays of unequal height; soft pastel zones (pink, mint, blue) lie in layers above the
  // hem and creep through it. Both ends fade out.
  for (int i = 0; i < LENS_N; i++) {
    vec3 c = uLensA[i].xyz; float cd = dot(d, c);
    if (cd > 0.25) {
      float sd = uLensA[i].w;
      float x = dot(d, uLensB[i].xyz)*uLensB[i].w/cd, yy = dot(d, uLensC[i].xyz)*uLensC[i].w/cd;
      if (abs(x) < 1.0 && abs(yy - 0.6) < 2.6) {
        float wn = sfVN(vec2(x*2.2 + sd*31.0, sd*17.0 + uTime*0.01));
        float hem = -0.55 + 0.22*sin(x*2.3 + sd*40.0) + 0.1*sin(x*6.1 + sd*17.0 + uTime*0.02)
                  + uWave*4.0*(0.6*sin(x*uRibF*0.16*(0.8 + 0.4*wn) + sd*13.0 + uTime*0.03) + 0.4*sin(x*uRibF*0.071 + sd*29.0)) + 0.3*(wn - 0.5);
        float hgt = yy - hem;                                   // height above the hem, in half-heights of the sheet
        if (hgt > 0.0) {
          float rf = uRayF/uLensB[i].w;
          float ray = 0.65*sfVN(vec2(x*rf + sd*57.0 + uRayT*0.22, sd*9.0)) + 0.35*sfVN(vec2(x*rf*0.27 + sd*21.0 - uRayT*0.07, 4.0));
          float amp = sfVN(vec2(x*1.6 + sd*11.0 - uTime*0.04, 2.0));      // bright and faint stretches along the sheet
          float rayH = 0.3*sfVN(vec2(x*rf + sd*57.0 + uRayT*0.22, sd*9.0)) + 0.7*sfVN(vec2(x*rf*0.27 + sd*21.0 - uRayT*0.07, 4.0));
          float reach = (0.36 + 0.2*rayH*rayH)*(0.5 + 0.86*amp);           // how high the sheet stands: a smooth, gently scalloped top (a lens of cloud; tall narrow ribs were a curtain of rays)
          float sw = smoothstep(0.30, 0.78, dot(normalize(c.xz + vec2(1e-4)), uSun));
          if (i < 3) sw = i == 0 ? 0.86 : 0.7;                // the bank the parting snow uncovers first
          float ends = 1.0 - smoothstep(0.5, 1.0, abs(x));
          // a small scrap (under seven degrees tall) and any sheet far from the sun has a soft lower edge: a crisp
          // hem under a faint body is only a white squiggle on the sky
          float small = i < 3 ? 0.0 : smoothstep(14.0, 20.0, uLensC[i].w);
          float hemW = mix(mix(0.4, 0.07, sw), 1.0, small);
          reach = mix(reach, 0.75 + 0.5*amp, small);             // (a scrap is one soft smudge: a thin bright hem on it is a squiggle)
          // above the ribs a second, soft edge closes the sheet: a lens with its bands lying along the hem
          float body = smoothstep(0.0, hemW, hgt)*exp(-1.1*hgt/max(reach, 0.05))*(1.0 - smoothstep(1.6*reach, 3.4*reach, hgt))*ends*ends*(0.3 + 0.7*smoothstep(0.15, 0.6, amp + 0.3*ray));
          // (a scrap is an oval, and its colour bands curve round its middle: level stripes in a square patch were a small flag)
          float rs = length(vec2(x*1.1, (hgt - 0.75)*0.8));
          body *= mix(1.0, 1.0 - smoothstep(0.35, 0.95, rs), small);
          float xb = mod(mix(hgt*1.9, rs*2.3, small) + uCreep + sd*3.0 + 0.35*(wn - 0.5), 3.0);
          vec3 wj = 0.5 + 0.5*cos(2.0944*(vec3(xb) - vec3(0.0, 1.0, 2.0))); wj *= wj;
          vec3 hue = (uPink*wj.x + uMint*wj.y + uBlue*wj.z)/max(wj.x + wj.y + wj.z, 1e-3);
          float kc = (1.0 - smoothstep(0.02, 0.38, hgt))*smoothstep(0.2, 0.7, amp)*sw*sw*(1.0 - small);
          vec3 col = mix(mix(uPearl*0.7, hue*0.96, 0.88), uPearl*mix(0.8, uCoreK, kc), kc*0.85);
          col *= 0.87 + 0.17*smoothstep(0.25, 0.75, ray);                  // the ribs: fine and shallow
          float lum = dot(col, vec3(0.3, 0.55, 0.15));
          col = mix(vec3(lum)*vec3(0.56, 0.54, 0.68)*0.78, mix(vec3(lum), col, uVivid), sw);
          col = min(col, vec3(mix(0.9, 2.0, smoothstep(0.1, 0.2, d.y))));    // nothing low on the horizon burns out
          float a = body*mix(0.36, 0.94, sw)*(1.0 - 0.45*small)*cone*smoothstep(0.03, 0.12, d.y)*(1.0 - smoothstep(0.66, 0.82, d.y));
          sky = mix(sky, col, a);
          sky += uPearl*0.05*sw*kc*body*cone;                 // the core's own glow
        }
      }
    }
  }
  sky = mix(uSfHazeCol, sky, smoothstep(-0.03, 0.02, d.y));
  vec3 Pf = cameraPosition + d*900.0;
  // below the horizon: a stand-in for the ice, only ever seen when the eye of the previous world's portal sits
  // lower than the ice itself (the entry is 1.2 m up), where the real ground cannot be drawn
  if (d.y < -0.002) {
    float hC = max(cameraPosition.y, 1.2);
    float tg = min(hC/(-d.y), 900.0);
    vec2 gp = cameraPosition.xz + d.xz*tg;
    vec2 ge = vec2((gp.y + 52.0)/34.0, (gp.x - 14.5)/2.6);
    float gi = smoothstep(0.0, 0.15, 1.0 - dot(ge, ge));
    vec2 gq = vec2(dot(gp, vec2(-0.8660254, 0.5)), dot(gp, vec2(0.5, 0.8660254)));
    float gy = gq.y - uFlow;
    float gs = sfVN(vec2(gq.x*0.42 + 1.9*sfVN(vec2(gy*0.035, gq.x*0.07)), gy*0.03));
    float gb = smoothstep(mix(0.4, 0.6, gi), mix(0.62, 0.74, gi), gs)*uSnake;
    vec3 snow = uSnowC*(uSkyCol*0.85 + uGroundCol*0.25 + uKeyCol*0.6);
    vec3 gcol = mix(snow*(0.8 + 0.25*sfVN(gq*vec2(0.6, 0.16))), vec3(0.012, 0.02, 0.04) + snow*0.08, gi);
    gcol = mix(gcol, snow*1.2, gb*mix(0.3, 0.9, gi));
    float gl = dot(gcol, vec3(0.2126, 0.7152, 0.0722));
    gcol = mix(gl*vec3(0.97, 0.96, 1.09), gcol, uSat);
    sky = mix(sky, gcol, 1.0 - smoothstep(-0.012, -0.002, d.y));
    Pf = cameraPosition + d*tg;
  }
  vec4 f = sfFogRay(cameraPosition, Pf, 0.0);
  gl_FragColor = vec4(mix(sky, f.rgb, f.a), 1.0);
}`;function V0(o,s,d,u,t){const m=(y,A=1)=>new e.Color(y).multiplyScalar(A),n=s.hour==="deep",f=[[150+o.range(-2,2),35.5,46,9.5],[122,31,30,7],[176,31.5,26,6]];if(s.cloud==="sheet")f.push([36+o.range(-4,4),23,64,18],[104,18,34,7],[-10,15,28,6],[96,42,30,6]);else if(s.cloud==="scales")for(let y=0;y<3;y++)for(let A=0;A<4;A++)f.push([-8+A*37+y%2*18+o.range(-4,4),31-y*8.6+o.range(-1.2,1.2),o.range(36,46),o.range(8.5,11)]);else{f.push([37,15,70,12.5],[50,25.5,40,8.5],[108,19,40,9],[22,32,21,5.5],[117,28.5,20,5],[97,36,18,4.5],[-18,16,22,5]);for(let y=3;y<f.length;y++){const A=f[y];A[0]+=o.range(-3,3),A[1]+=o.range(-1.5,1.5),A[2]*=o.range(.9,1.12)}}const a=f.length,r=[],S=[],p=[];for(const[y,A,B,I]of f){const Y=St(y),le=Math.cos(A*De),U=new e.Vector3(Y[0]*le,Math.sin(A*De),Y[1]*le),te=o.range(-.12,.12),x=new e.Vector3(Math.cos(y*De),0,Math.sin(y*De)).applyAxisAngle(U,te).normalize(),X=new e.Vector3().crossVectors(x,U).normalize();r.push(new e.Vector4(U.x,U.y,U.z,o())),S.push(new e.Vector4(x.x,x.y,x.z,1/Math.tan(B*.5*De))),p.push(new e.Vector4(X.x,X.y,X.z,1/Math.tan(I*.5*De)))}const C=new e.Vector3(51,35,-21).normalize(),w=St(50),M=Object.assign({uZenith:{value:m(n?"#2A2158":"#2B2250")},uMid:{value:m(n?"#35285F":"#4B3A7A")},uArch:{value:m(n?"#6E6688":"#9C94B4")},uShadow:{value:m(n?"#262A48":"#363A62")},uBelt:{value:m(n?"#6A4E86":"#9478A8")},uPearl:{value:m("#F4ECF6")},uPink:{value:m(_e[4])},uMint:{value:m(_e[5])},uBlue:{value:m(_e[6])},uCone:{value:C},uSun:{value:new e.Vector2(w[0],w[1])},uTime:u,uStars:{value:n?1:.5},uVivid:{value:n?1:.84},uRibF:{value:s.cloud==="scales"?26:s.cloud==="sheet"?80:46},uRayF:{value:64},uCoreK:{value:n?1.3:1.4},uWave:{value:s.cloud==="sheet"?.05:.03},uMoonK:{value:1},uVeilK:{value:1},uCreep:{value:0},uRayT:{value:0},uLensA:{value:r},uLensB:{value:S},uLensC:{value:p}},t,d),F=new e.ShaderMaterial({uniforms:M,defines:{LENS_N:a},side:e.BackSide,depthWrite:!1,depthTest:!1,vertexShader:"varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix*viewMatrix*vec4(cameraPosition + position, 1.0); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }",fragmentShader:z0}),O=new e.Mesh(new e.SphereGeometry(1e3,40,20),F);return O.renderOrder=-1,O.frustumCulled=!1,O.name="sky-dome",{object:O,uniforms:M}}const Lt=14,N0=`
uniform vec4 uPaneA[NP], uPaneB[NP];
uniform vec3 uH, uSnow, uStainCol, uShadowCol, uCliff;
uniform vec2 uWind, uCliffV;
uniform float uFlow, uCalm, uSnake, uTime;
${tt}
${Ue}
${k0}
varying vec3 vWp, vN, vLp; varying float vRel;
// sastrugi in wind coordinates (q.x across the wind, q.y downwind), 0..1: wind-carved ridges along the wind (the
// crest is where the lane noise crosses 0.5). Along the wind every ridge is a string of spindles: each starts with
// a rounded nose on its upwind end and narrows to a point over seven metres downwind (thr is the lane level the snow
// must exceed; where it is high the ridge is thin and low, and at the top it is gone). The cross-section is a
// drift's: a long soft ramp from the foot that steepens to a rounded crest (never a prism with two flat flanks), and
// the crest is notched and broken along its length, so no ridge is a ribbon of one height.
// lf.x = meander in metres, lf.y = how tall the field stands here (both slow, taken once per pixel). gCrest is 1 on
// the crest line. makeGround's sasJS is the same arithmetic: the ribbon is displaced by the field this shades.
float gCrest, gPeak, gS0;
float gSas(vec2 q, vec2 lf){
  float qx = q.x + lf.x;
  float a = sfVN(vec2(qx*0.46, q.y*0.065 + 3.0));
  float s0 = 2.0*a - 1.0;
  gS0 = s0;                                           // signed: 0 on the crest line (main() turns it into metres from that line)
  float r = 1.3 - sqrt(s0*s0 + 0.09);                 // the crest is rounded over a forearm's length: a drift, not a knife
  gCrest = r;
  float s = fract(q.y*0.105 + 2.6*sfVN(vec2(qx*0.37 + 9.0, q.y*0.016)));
  float tri = s < 0.24 ? 1.0 - s/0.24 : (s - 0.24)/0.76;
  float thr = 0.46 + 0.68*tri*tri*(3.0 - 2.0*tri);
  float h = clamp((r - thr)/0.64, 0.0, 1.0);
  gPeak = clamp((1.0 - thr)/0.64, 0.0, 1.0)*lf.y;        // how tall this ridge's crest stands here
  h *= 0.58 + 0.42*smoothstep(0.22, 0.7, sfVN(vec2(qx*0.8 + 4.0, q.y*0.47)));
  return h*(h + 0.08)/(h + 0.3)*1.2*lf.y;             // a soft foot that steepens up the ramp
}
// the moon's glints, in the same wind coordinates: long cells laid along the wind (f = cells per metre across and
// along it), every column slipped along the wind by its own amount and the whole lattice warped, so no two crests
// break at the same place. Nine cells in ten are lit (a spark shows only where a crest crosses it), and a lit cell holds ONE spark 16 to 50 cm long, lying
// anywhere along it and dying away toward the cell's sides. Returns x: the squared distance along the crest from the spark's middle, in half-lengths (main()
// adds the distance across the crest: a spark is a spindle with soft ends, never a dash or a round bead), y: lit, and
// flashing as the lens moves, z: its brightness, a cubed hash (many faint, few bright).
vec3 gSpark(vec2 q, vec2 f, float seed, float px){
  float cx = q.x*f.x + 1.3*sfVN(q*vec2(0.9, 0.35) + seed);
  float cl = floor(cx);
  float cy = q.y*f.y + 7.0*sfHash(vec2(cl, seed)) + 0.8*sfVN(q*vec2(0.7, 0.4) + seed + 27.0);
  vec2 bi = vec2(cl, floor(cy));
  float bh = sfHash(bi + seed);
  float l0 = fract(bh*7.3);
  float len = min((0.16 + 0.34*l0*l0)*f.y, 0.9);                          // the spark's length, in cells (16 to 50 cm: seen along its crest a shorter one is a round bead)
  float ctr = mix(0.5*len + 0.03, 0.97 - 0.5*len, sfHash(bi + seed + 3.9));
  float t = (fract(cy) - ctr)/(0.5*len + px*f.y);
  float b0 = fract(bh*13.1);
  float tw = 0.5 + 0.5*sin(bh*90.0 + dot(cameraPosition.xz, vec2(1.3, 1.9))*(1.0 + 2.0*b0) + uTime*(1.0 + b0));
  // (across the wind the spark has a width of its own, three fifths of its length, about a line set anywhere across its cell:
  // where a crest lies flat a spark would otherwise fill its cell and show as a hard-cornered square or a round disc. x
  // carries that too, so every spark is a closed sliver; a crest that only grazes it lights a faint one)
  float hw = min(max(0.3*len/f.y, 0.05)*f.x, 0.48);
  float xs = (fract(cx) - mix(hw, 1.0 - hw, sfHash(bi + seed + 11.3)))/hw;
  return vec3(t*t + xs*xs, step(0.1, bh)*(0.6 + 0.4*tw*tw)*(0.55 + 0.45*b0), b0*b0*b0);
}
void main(){
  vec2 p = vWp.xz;
  float px = max(fwidth(p.x), fwidth(p.y));
  vec3 V = normalize(cameraPosition - vWp + vec3(0.0, 1e-4, 0.0));
  vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0));
  vec2 W = uWind, X = vec2(-W.y, W.x);
  vec2 q = vec2(dot(p, X), dot(p, W));
  float fine = 1.0 - smoothstep(0.04, 0.4, px), mid = 1.0 - smoothstep(0.12, 1.3, px);
  // bare ice panes: listed ellipses near the approach, noise panes far out on the plain
  float ice = -1.0;
  for (int i = 0; i < NP; i++) {
    vec2 d = p - uPaneA[i].xy;
    vec2 e = vec2(d.x*uPaneA[i].z + d.y*uPaneA[i].w, -d.x*uPaneA[i].w + d.y*uPaneA[i].z)/uPaneB[i].xy;
    ice = max(ice, 1.0 - dot(e, e));
  }
  float edgeN = (sfVN(q*vec2(0.9, 0.25)) - 0.5)*0.5 + (sfVN(q*vec2(3.1, 0.8) + 4.0) - 0.5)*0.2*fine;
  float iceM = smoothstep(0.0, 0.05 + px*0.14, ice + edgeN - 0.12);
  float hudD = length(p - uH.xz);
  float farP = sfVN(q*vec2(0.036, 0.011) + 5.0) + 0.25*(sfVN(q*vec2(0.16, 0.05)) - 0.5);
  float farOK = max(smoothstep(24.0, 34.0, abs(p.x)), (1.0 - smoothstep(-190.0, -160.0, p.y)))*smoothstep(62.0, 80.0, hudD);
  // far panes: their edge widens with the pixel and they dissolve before they can alias at a grazing angle
  iceM = max(iceM, smoothstep(0.66, 0.7 + px*0.035, farP)*farOK*(1.0 - smoothstep(2.5, 7.0, px)));
  iceM *= 1.0 - smoothstep(0.03, 0.1, vLp.y - 0.02);
  // sastrugi: low ridges along the wind, lit from the key side
  vec3 st = ecStain(p - uH.xz, px);
  // the relief is shaded from the field itself, tapped a pixel apart (wider with distance, so it cannot alias):
  // a lit flank on the key side of every crest, an indigo lee on the other, and the crest a thin pale line
  vec2 fq = vec2(fwidth(q.x), fwidth(q.y));
  vec2 lf = vec2(2.4*(sfVN(vec2(q.x*0.13 + 5.0, q.y*0.028)) - 0.5) + 0.8*(sfVN(vec2(q.x*0.5 + 2.0, q.y*0.11)) - 0.5),
                 0.45 + 0.55*smoothstep(0.26, 0.66, sfVN(q*vec2(0.07, 0.03) + 17.0)));
  vec2 eq = vec2(max(0.05, fq.x*0.75), max(0.07, fq.y*0.75));
  float h0 = gSas(q, lf); float crestR = gCrest, peak = gPeak, sA = gS0;
  float hx = gSas(q + vec2(eq.x, 0.0), lf); float sB = gS0;
  float hy = gSas(q + vec2(0.0, eq.y), lf); float sC = gS0;
  // metres from the crest line: the lane noise over its own slope, so the line keeps one width and a flat stretch of
  // the noise near 0.5 (a plateau, not a crest) is never taken for one
  float crestD = abs(sA)/max(length(vec2(sB - sA, sC - sA)/eq), 0.25);
  float relF = (1.0 - smoothstep(0.9, 2.8, fq.x))*(1.0 - iceM)*(1.0 - 0.8*st.x)*(1.0 - st.z)*vRel;
  // a ridge's thin tail and the last hand's height of any foot are not drawn: they would only be hairlines on the snow
  relF *= mix(smoothstep(0.02, 0.2, max(h0, max(hx, hy))), 1.0, uCalm);
  vec2 gq = vec2(hx - h0, (hy - h0)*0.45)/eq*0.56;       // (a ridge's blunt nose is shaded gently: steeply, it stands up as a dark streak)
  vec2 gpw = X*gq.x + W*gq.y;
  vec3 Ns = normalize(vec3(-gpw.x, 1.0, -gpw.y));
  // (seen from the air under the pearl light the same ridges are drawn more quietly)
  // and while it blows, gently: a soft gradient up each ramp, quieter still within a few metres of the lens)
  float dCam = length(cameraPosition - vWp);
  float nearK = 1.0 - smoothstep(5.0, 16.0, dCam);
  float real = clamp((dot(Ns, uKeyDir) - uKeyDir.y)*mix(1.8, 2.4, uCalm), -1.0, 1.0)*relF*mix(1.0, 0.4, uCalm);
  float fine2 = 1.0 - smoothstep(0.015, 0.14, px);
  // AT ARM'S LENGTH THE SNOW IS MATTE: no painted spindles or ripples (they ran along the wind, and seen at a grazing
  // angle from 1.2 m they were drawn out into a fan of pleats and long glossy smears). What stands up from the snow
  // there is modelled: the ribbon's drifts and the knife-crested sastrugi of makeSastrugi. The surface itself carries
  // only a fine wind crust, the same in every direction; files of footprints where birds have walked in up the wind
  float crust = (sfVN(p*5.3 + 9.0) - 0.5)*0.6 + (sfVN(p*13.0 + 3.0) - 0.5)*0.4;
  float tu = q.x/6.5 + 0.35*sfVN(vec2(q.y*0.06, 3.0)); float tc = floor(tu), tx = (fract(tu) - 0.5)*6.5;
  float lr = step(0.5, fract(q.y*1.1 + tc*0.37));
  vec2 fd = vec2(tx - (lr - 0.5)*0.26, (fract(q.y*2.2 + tc*0.74) - 0.5)/2.2*0.62);
  float fprint = (1.0 - smoothstep(0.05, 0.085 + px, length(fd)))*step(0.5, sfHash(vec2(tc, 9.0)))*(1.0 - smoothstep(0.02, 0.1, px));
  float drift = sfVN(vec2(q.x*0.2, q.y*0.025)) - 0.5;
  vec3 alb = uSnow*(0.84 + 0.14*sfVN(p*0.11 + 4.0) + 0.2*drift + 0.1*(h0 - 0.3)*relF);
  alb *= 1.0 - 0.14*relF*(1.0 - smoothstep(0.0, 0.3, h0));                 // the troughs between ridges hold less light
  alb *= 1.0 + 0.09*crust*fine2;
  alb *= 1.0 - 0.42*fprint*(1.0 - iceM);
  alb = mix(alb, uStainCol*(0.8 + 0.4*sfVN(p*2.3)), st.x*0.85);
  alb = mix(alb, uSnow*1.08, st.y*0.75);
  alb = mix(alb, uShadowCol*0.5, st.z*0.9);
  // the cliff foot: tide crack and contact shade
  float cv = p.y - uCliff.z;
  float cd = (uCliff.x - uCliff.y*cv*cv) - p.x;
  float along = smoothstep(uCliffV.x, uCliffV.x + 40.0, cv)*(1.0 - smoothstep(uCliffV.y - 60.0, uCliffV.y - 10.0, cv));
  float crack = (1.0 - smoothstep(0.25, 0.7 + px, abs(cd - 13.0 - 5.0*(sfVN(vec2(p.y*0.07, 2.0)) - 0.5))))*along;
  float foot = (1.0 - smoothstep(0.0, 22.0, cd))*along;
  alb = mix(alb, vec3(0.012, 0.03, 0.05), crack*0.9);
  float key = max(0.3 + uKeyDir.y*0.9 + mix(max(real, 0.0)*0.62 + min(real, 0.0)*0.85, real, uCalm), 0.0);
  vec3 col = alb*(uSkyCol*0.78 + uGroundCol*0.25 + uKeyCol*key)*(1.0 - 0.45*foot);
  col += uRimCol*max(real*0.6, 0.0)*0.11*(1.0 - st.x)*(1.0 - st.z);
  col += uRimCol*smoothstep(0.12, 0.5, real)*0.1;                       // the crest's lit flank
  float wl1 = mix(0.07, 0.035, nearK) + fq.x*1.3;
  float cl1 = (1.0 - smoothstep(wl1*0.4, wl1, crestD))*smoothstep(0.08, 0.3, h0)*relF;
  col += uRimCol*cl1*mix(0.16, 0.5, nearK)*mix(0.85, 1.0, uCalm);   // the crest line: a sharp wind-cut edge at arm's length
  // the side away from the key: a soft violet shade while it blows (snow, not plastic), deeper under the pearl light
  // (a thin low tail casts none: its lee would only be a dark crease drawn across the snow)
  // (and at arm's length only a ridge that stands a forearm high has one: there the lee of a low one is a crack)
  float leeK = smoothstep(0.02, mix(mix(0.7, 0.4, nearK), 0.24, uCalm), -real)*mix(smoothstep(mix(0.1, 0.16, nearK), mix(0.34, 0.4, nearK), peak), 1.0, uCalm);
  col *= mix(vec3(1.0), mix(mix(vec3(0.62, 0.64, 0.9), vec3(0.5, 0.52, 0.86), nearK), vec3(0.36, 0.39, 0.62), uCalm), leeK*mix(0.5, 1.0, smoothstep(2.0, 6.0, dCam)));   // (paler within a few metres of the lens: a deep lee there is a dark slit)
  // the low moon: warm light on every flank that looks at it, a path of gold glitter across the snow toward it,
  // and single crystals that flash and go out as the lens moves
  float snowK = (1.0 - st.x)*(1.0 - st.z);
  vec2 mdir = uMoonDir.xz/max(length(uMoonDir.xz), 1e-3), vdir = -V.xz/max(length(V.xz), 1e-3);
  float lane = smoothstep(0.94, 0.999, dot(mdir, vdir));                    // the stripe of snow between the lens and the moon
  float laneW = smoothstep(0.78, 0.99, dot(mdir, vdir));                    // and the broad path round it
  vec3 Nm = Ns;
  float mdif = max(dot(Nm, uMoonDir), 0.0);
  // every flank that looks at the moon is gold
  col += alb*uMoonCol*(mdif*1.5 + mix(0.9, 1.7, nearK)*smoothstep(0.1, 0.55, dot(Ns, uMoonDir))*relF);
  vec3 Hm = normalize(uMoonDir + V);
  float mh = max(dot(Nm, Hm), 0.0); float ms = mh*mh; ms *= ms; ms *= ms; ms *= ms; float ms2 = ms*ms; ms2 *= ms2;
  // (single crystals: read on a turned lattice that is warped by most of a cell, each one anywhere in its cell, so they
  // are a random dusting; on the plain lattice they lay in straight, evenly spaced rows like a halftone screen)
  vec2 gwp = p + 0.05*vec2(sfVN(p*2.9 + 5.0), sfVN(p*2.9 + 31.0)) + 0.02*vec2(sfVN(p*9.7 + 11.0), sfVN(p*9.7 + 57.0));
  vec2 gcl = mat2(0.8, -0.6, 0.6, 0.8)*gwp*23.0; vec2 gid = floor(gcl); float gh = sfHash(gid + 7.7);
  vec2 gjt = vec2(sfHash(gid + 1.3), sfHash(gid.yx + 5.9))*0.76 + 0.12;
  float gpt = (1.0 - smoothstep(0.0, 0.12 + px*4.0, length(fract(gcl) - gjt)))*(0.35 + 0.65*sfHash(gid + 23.1));
  float tw = 0.5 + 0.5*sin(gh*90.0 + dot(cameraPosition.xz, vec2(1.7, 2.3))*(2.0 + 3.0*gh) + uTime*1.3);
  float glint = gpt*step(0.76, gh)*tw*tw*(1.0 - smoothstep(0.012, 0.035, px));      // (gone before a cell is under three pixels: there the lit cells themselves were the dots, in rows)
  // THE MOON'S PATH is a loose scatter of unequal sparks on the crests (gSpark above): per ridge one bright glint and
  // two or three faint ones, no two the same distance apart, and most of the crest dark. Each is a spindle lying on
  // its crest line, the bright ones longer and fatter. The scatter thins out in patches (long
  // dark gaps); only far off, where a spark is under a pixel, does a crest keep a thin thread of gold
  float bfade = 1.0 - smoothstep(0.025, 0.11, px);
  vec3 spA = gSpark(q, vec2(3.1, 1.15), 13.7, px), spB = gSpark(q, vec2(4.7, 2.3), 61.3, px);
  float kcA = smoothstep(0.08, 0.3, h0)*relF*(0.55 + 0.45*nearK);
  float dA = crestD/(wl1*0.9); dA *= dA;
  float wA = 0.55 + 0.7*spA.z, wB = 0.55 + 0.7*spB.z;                    // a brighter spark is a fatter one (always a sliver: several times longer than wide)
  float cvA = (1.0 - smoothstep(0.08, 1.0, spA.x + dA/(wA*wA)))*kcA*spA.y;
  float cvB = (1.0 - smoothstep(0.08, 1.0, spB.x + dA/(wB*wB)))*kcA*spB.y*0.85;
  float pathK = (0.2*laneW + 0.8*laneW*laneW)*smoothstep(0.2, 0.5, sfVN(q*vec2(1.3, 0.42) + 71.0))*bfade;
  float sparkCv = max(cvA, cvB)*pathK, sparkB = cvA > cvB ? spA.z : spB.z;
  float thread = 0.3*(1.0 + smoothstep(0.35, 0.7, sfVN(q*vec2(1.5, 0.9) + 51.0)))*smoothstep(3.0, 8.0, dCam)*(1.0 - bfade);
  float clG = (1.0 - smoothstep(wl1*0.6, wl1*2.6, crestD))*kcA;
  float crestGl = clG*thread*(0.2*laneW + 0.8*laneW*laneW);
  col += uMoonCol*snowK*(1.0 - iceM)*(ms*0.4 + ms2*0.8 + lane*(0.08 + 1.5*glint));
  col += uRimCol*glint*0.22*step(0.9, gh)*snowK*(1.0 - iceM);
  vec3 goldGl = uMoonCol*snowK*(1.0 - iceM)*crestGl*5.0;
  sparkCv *= snowK*(1.0 - iceM);
  // the moon-gold flank: every flank that looks at the moon, most of all in its path (a tint, laid on after the clamp
  // with the glints: added as light before it, a lit flank only clipped to white)
  float goldF = smoothstep(0.15, 0.36, dot(Ns, uMoonDir))*relF*mix(0.45, 1.0, nearK)*(0.55 + 0.45*laneW)*snowK*(1.0 - iceM)*(1.0 - 0.6*uCalm);
  // black-blue ice: dark body, cracks, a sheen of the sky on the key side
  float fr = 1.0 - clamp(V.y, 0.0, 1.0); fr = fr*fr; fr = fr*fr;
  vec3 R = reflect(-V, vec3(0.0, 1.0, 0.0));
  float tk = clamp(dot(normalize(R + vec3(0.0, 1e-4, 0.0)), uKeyDir), 0.0, 1.0);
  vec3 refl = mix(uSkyCol*0.9, uKeyCol*0.75, tk*tk);
  vec2 c1 = vec2(dot(p, vec2(0.92, 0.39)), dot(p, vec2(-0.39, 0.92)));
  float l1 = abs(fract(c1.x*0.11 + 0.9*sfVN(c1*vec2(0.05, 0.16))) - 0.5)/0.11;
  float l2 = abs(fract(c1.y*0.07 + 1.1*sfVN(c1.yx*vec2(0.04, 0.13) + 9.0)) - 0.5)/0.07;
  float lw = 0.03 + px*1.2;
  float crk = ((1.0 - smoothstep(0.0, lw, l1))*0.7 + (1.0 - smoothstep(0.0, lw, l2))*0.5)*(1.0 - smoothstep(0.3, 1.5, px));
  float frost = smoothstep(0.55, 0.92, sfVN(vec2(q.x*1.3, q.y*0.16) + 13.0))*0.25;
  vec3 iceC = vec3(0.008, 0.014, 0.03)*(0.6 + 0.8*sfVN(p*0.05)) + (uSkyCol*0.25 + uKeyCol*0.12)*vec3(0.5, 0.75, 1.0)*0.08;
  iceC += refl*(0.03 + 0.26*fr);                       // polished: at a grazing angle it mirrors the sky
  iceC = mix(iceC, col*0.8, clamp(crk*0.55 + frost, 0.0, 0.85));
  col = mix(col, iceC, iceM);
  // snow snakes: sinuous streaks of drift pouring downwind over everything
  float qy = q.y - uFlow;
  float sn = sfVN(vec2(q.x*0.42 + 1.9*sfVN(vec2(qy*0.035, q.x*0.07)), qy*0.03));
  float body = smoothstep(mix(0.4, 0.6, iceM), mix(0.62, 0.74, iceM), sn);
  float fil = 0.3 + 0.7*sfVN(vec2(q.x*3.6 + 2.0*sfVN(vec2(qy*0.09, 5.0)) + 1.5*sfVN(vec2((q.y - uFlow*1.25)*0.33, q.x*0.6)), (q.y - uFlow*1.25)*0.42));
  fil = mix(fil, 0.62, 0.55*fine2);
  float fil2 = mix(1.0, min(1.7*sfVN(vec2(q.x*9.0 + 3.0*sfVN(vec2(q.x*1.3, (q.y - uFlow*1.4)*0.5)), (q.y - uFlow*1.4)*0.7)), 1.25), 0.75*fine);
  // (no fine grain racing under the lens: what is left there is drawn out along the wind)
  fil2 *= mix(1.0, 0.72 + 0.56*sfVN(vec2(q.x*14.0, (q.y - uFlow*1.4)*0.9)), fine2*smoothstep(0.004, 0.02, px));
  // on snow close to the lens the drift thins to a few long wisps, so the ridges and their light show through it
  float snake = body*fil*fil2*uSnake*mid*mix(1.0, 0.12, fine2*(1.0 - iceM));
  vec3 snowLit = uSnow*(uSkyCol*0.85 + uGroundCol*0.25 + uKeyCol*(0.45 + uKeyDir.y*0.9));
  col = mix(col, snowLit*1.25, clamp(snake*mix(0.2, 1.1, iceM), 0.0, 0.94));
  // spindrift smoking off the crests while it blows: pale torn plumes that hug each crest and stream along it,
  // feathering the line where the lit flank meets the shade
  // (at arm's length they are separate torn plumes with clear crest between them: a blanket there hides the edge)
  float smk = smoothstep(0.45, 0.95, crestR)*smoothstep(0.1, 0.45, h0)*relF*(1.0 - uCalm);
  float smn = sfVN(vec2(q.x*1.6 + 3.0, (q.y - uFlow*0.9)*0.22))*(0.4 + 0.9*sfVN(vec2(q.x*4.5, (q.y - uFlow*1.2)*0.6 + 7.0)));
  col = mix(col, snowLit*1.18, clamp(smk*smoothstep(mix(0.14, 0.3, nearK), mix(0.5, 0.56, nearK), smn)*0.75*mid, 0.0, 0.7));
  // (the glints are the one warm accent: laid on after the snow's clamp and its storm greying, so they stay gold)
  col = min(wGrade(col), vec3(0.72))*mix(vec3(1.0), vec3(1.12, 0.92, 0.66), clamp(goldF, 0.0, 1.0)*(1.0 - clamp(snake, 0.0, 1.0))) + goldGl*(1.0 - 0.8*clamp(snake, 0.0, 1.0));
  // the sparks are GOLD, not white: they take the snow's place (added to it as light they only burnt out to cream)
  col = mix(col, vec3(1.7, 0.98, 0.38)*(uMoonCol.r*3.4)*(0.8 + 1.4*sparkB), clamp(sparkCv*(1.0 - 0.8*clamp(snake, 0.0, 1.0)), 0.0, 1.0));
  gl_FragColor = vec4(sfApply(col, vWp), 1.0);
}`,Te=Math.fround,Dt=o=>Te(o-Math.floor(o));function qt(o,s){let d=Dt(Te(o*Te(.1031))),u=Dt(Te(s*Te(.103)));const t=Te(Te(d*Te(u+Te(33.33)))+Te(u*Te(d+Te(33.33))));return d=Te(d+t),u=Te(u+t),Dt(Te(Te(d+u)*u))}function ot(o,s){const d=Math.floor(o),u=Math.floor(s);let t=o-d,m=s-u;t=t*t*(3-2*t),m=m*m*(3-2*m);const n=qt(d,u),f=qt(d+1,u),a=qt(d,u+1),r=qt(d+1,u+1);return(n+(f-n)*t)*(1-m)+(a+(r-a)*t)*m}function A0(o,s){const d=2.4*(ot(o*.13+5,s*.028)-.5)+.8*(ot(o*.5+2,s*.11)-.5),u=.45+.55*v(.26,.66,ot(o*.07+17,s*.03+17)),t=o+d,m=ot(t*.46,s*.065+3),n=2*m-1,f=1.3-Math.sqrt(n*n+.09),a=s*.105+2.6*ot(t*.37+9,s*.016),r=a-Math.floor(a),S=r<.24?1-r/.24:(r-.24)/.76,p=.46+.68*S*S*(3-2*S);let C=Fe((f-p)/.64,0,1);return C*=.58+.42*v(.22,.7,ot(t*.8+4,s*.47)),C*(C+.08)/(C+.3)*1.2*u}function s0(o,s,d){let u=-1;for(const t of o){const m=s-t.x,n=d-t.z,f=(m*t.c+n*t.s)/(t.a+1.6),a=(-m*t.s+n*t.c)/(t.b+1.6);u=Math.max(u,1-f*f-a*a)}return u}async function n0(o,s){const d=s.getAttribute("position").array,u=s.index.array,t=new Float32Array(d.length);for(let n=0;n<u.length;n+=3){n%9e3===0&&await o.yield();const f=u[n]*3,a=u[n+1]*3,r=u[n+2]*3,S=d[r]-d[a],p=d[r+1]-d[a+1],C=d[r+2]-d[a+2],w=d[f]-d[a],M=d[f+1]-d[a+1],F=d[f+2]-d[a+2],O=p*F-C*M,y=C*w-S*F,A=S*M-p*w,B=t[f]+O,I=t[f+1]+y,Y=t[f+2]+A,le=t[a]+O,U=t[a+1]+y,te=t[a+2]+A,x=t[r]+O,X=t[r+1]+y,pe=t[r+2]+A;t[f]=B,t[f+1]=I,t[f+2]=Y,t[a]=le,t[a+1]=U,t[a+2]=te,t[r]=x,t[r+1]=X,t[r+2]=pe}for(let n=0;n<t.length;n+=3){n%18e3===0&&await o.yield();const f=t[n],a=t[n+1],r=t[n+2],S=1/(Math.sqrt(f*f+a*a+r*r)||1);t[n]=f*S,t[n+1]=a*S,t[n+2]=r*S}const m=new e.BufferAttribute(t,3);m.needsUpdate=!0,s.setAttribute("normal",m)}async function F0(o,s,d,u,t,m,n,f){const a=[{x:14.5,z:-52,a:34,b:2.6,ang:Math.atan2(-.04,-1)}],r=Math.atan2(E[0],E[1]);let S=0;for(;a.length<Lt&&S++<400;){const N=s.range(-150,12),R=s.range(-38,38),re=s.range(6,19),l=re*s.range(.2,.34);u.nearestXZ(R,N).dist<l+11||a.some(h=>Math.hypot(h.x-R,h.z-N)<h.a*.6+re+2&&Math.abs(h.x-R)<h.b+l+5)||a.push({x:R,z:N,a:re,b:l,ang:r+s.range(-.12,.12)})}for(;a.length<Lt;)a.push({x:0,z:5e3,a:1,b:1,ang:0});for(const N of a)N.s=Math.sin(N.ang),N.c=Math.cos(N.ang);const p=a.map(N=>new e.Vector4(N.x,N.z,N.s,N.c)),C=a.map(N=>new e.Vector4(N.a,N.b,0,0));for(const N of a){const R=N.s,re=N.c;N.c=R,N.s=re}let w=1;const M=(N,R)=>{const re=N*We[0]+R*We[1],l=N*E[0]+R*E[1];let h=.56*A0(re,l);h*=1-v(-.25,.25,s0(a,N,R)),h*=1-v(12,16,Math.abs(N)),h*=(1-v(18,25,R))*v(-166,-148,R);const k=u.nearestXZ(N,R),D=v(2,5,k.dist),Z=1+.5*D,se=k.y-.68-.1*(1-v(1.5,5,k.dist))+.42*D,fe=Fe(se/(.56*Z),0,1)*Z;h=Math.max(0,h*fe);let we=Math.min(fe,1.25);for(const xe of f){const L=xe[0]-N,he=xe[1]-R;if(L>2.4||L<-2.4||he>2.4||he<-2.4)continue;const ye=v(.9,2.4,Math.sqrt(L*L+he*he));h>.01&&(h*=ye),we*=ye}return w=we,h},F=204,O=-16,y=25,A=-167,B=(y-A)/F,I=B*(E[0]/E[1])/2,Y=Math.ceil(32/I)+2,le=new Float32Array((Y+1)*(F+1)*3),U=new Float32Array((Y+1)*(F+1)),te=[];for(let N=0;N<=F;N++){await o.yield();for(let R=0;R<=Y;R++){const re=O+R*I,l=y-N*B,h=(N*(Y+1)+R)*3;le[h]=re,le[h+1]=M(re,l)+.02,le[h+2]=l,U[h/3]=w}}await o.yield();for(let N=0;N<F;N++)for(let R=2;R<Y;R++){const re=N*(Y+1)+R,l=re+1,h=(N+1)*(Y+1)+R-2,k=h+1;te.push(re,l,h,l,k,h)}await o.yield();const x=new e.BufferGeometry;x.setAttribute("position",new e.BufferAttribute(le,3)),x.setAttribute("aRel",new e.BufferAttribute(U,1)),x.setIndex(te),await o.yield(),await n0(o,x),await o.yield();const X=[],pe=[],J=[],ie=[0,30,70,130,220,360,560,900,1500],ve=48;for(let N=0;N<ie.length;N++)for(let R=0;R<ve;R++){const re=R/ve*Math.PI*2;X.push(Math.cos(re)*ie[N]+20,0,Math.sin(re)*ie[N]-170),pe.push(0,1,0)}for(let N=0;N<ie.length-1;N++)for(let R=0;R<ve;R++){const re=N*ve+R,l=N*ve+(R+1)%ve,h=re+ve,k=l+ve;J.push(re,l,h,l,k,h)}const H=new e.BufferGeometry;H.setAttribute("position",new e.Float32BufferAttribute(X,3)),H.setAttribute("normal",new e.Float32BufferAttribute(pe,3)),H.setAttribute("aRel",new e.Float32BufferAttribute(new Float32Array(X.length/3).fill(1),1)),H.setIndex(J);const ce=(N,R=1)=>new e.Color(N).multiplyScalar(R),Ge=Object.assign({uPaneA:{value:p},uPaneB:{value:C},uH:{value:ee},uSnow:{value:ce(_e[2],.8)},uStainCol:{value:new e.Color(.2,.185,.19)},uShadowCol:{value:ce(_e[1])},uCliff:{value:new e.Vector3(me.x0,me.k,me.zN)},uCliffV:{value:new e.Vector2(me.vMin,me.vMax)},uWind:{value:new e.Vector2(E[0],E[1])},uHud:t.uHud,uTailSeg:t.uTailSeg,uKeyDir:t.uKeyDir,uKeyCol:t.uKeyCol,uSkyCol:t.uSkyCol,uGroundCol:t.uGroundCol,uRimCol:t.uRimCol,uSat:t.uSat},n,m),Q=new e.ShaderMaterial({uniforms:Ge,defines:{NP:Lt},vertexShader:C0,fragmentShader:N0}),$=new e.Mesh(x,Q);$.name="sastrugi-ribbon";const qe=Q.clone();qe.uniforms=Ge,qe.polygonOffset=!0,qe.polygonOffsetFactor=1,qe.polygonOffsetUnits=2;const st=new e.Mesh(H,qe);st.name="ice-plain",st.frustumCulled=!1;const ut=new e.Group;return ut.add(st,$),{object:ut,heightAt:M,panes:a}}const W0=`
attribute vec3 aT;
varying vec3 vWp, vN, vT;
void main(){
  vWp = position; vN = normal; vT = aT;
  gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.0);
}`,T0=`
uniform vec3 uSnow; uniform vec2 uWind; uniform float uCalm;
${tt}
${Ue}
varying vec3 vWp, vN, vT;
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0));
  vec3 V = normalize(cameraPosition - vWp + vec3(0.0, 1e-4, 0.0));
  vec2 p = vWp.xz, W = uWind, X = vec2(-W.y, W.x);
  vec2 q = vec2(dot(p, X), dot(p, W));
  float t = vT.x;
  float pxm = max(length(fwidth(vWp)), 1e-4);
  float fine2 = 1.0 - smoothstep(0.015, 0.14, pxm);
  // the same snow as the plain it stands on (GROUND_FRAG's albedo), with the wind's etching on the flanks: thin level
  // strata a few centimetres apart, broken along the ridge
  float drift = sfVN(vec2(q.x*0.2, q.y*0.025)) - 0.5;
  vec3 alb = uSnow*(0.84 + 0.14*sfVN(p*0.11 + 4.0) + 0.2*drift);
  alb *= 1.0 + 0.09*((sfVN(p*5.3 + 9.0) - 0.5)*0.6 + (sfVN(p*13.0 + 3.0) - 0.5)*0.4)*fine2;
  float lay = sfVN(vec2(vWp.y*31.0 + 2.0*sfVN(q*vec2(0.9, 0.3)), q.y*0.35 + vT.z*17.0));
  alb *= 1.0 + (0.12 + 0.34*smoothstep(0.25, 0.7, 1.0 - N.y))*(lay - 0.5)*fine2*smoothstep(0.1, 0.5, t);      // (plainest on the steep lee face: wind-cut layers, not a flat slab)
  alb *= mix(0.9, 1.0, smoothstep(0.0, 0.45, t));                      // a contact shade where it rises from the plain
  float real = clamp((dot(N, uKeyDir) - uKeyDir.y)*mix(1.8, 2.4, uCalm), -1.0, 1.0);
  // (the shaded flank takes the plain's light on its lower half: its shade is a band under the crest, not a dark slab)
  // and BOTH flanks start from the plain's own tone at the foot: the lit ramp brightens up to the crest, the lee deepens up
  // to it (one flat tone from foot to crest was a sheet of cut paper lying on the snow, with a hard outline)
  float rampT = smoothstep(0.0, 0.9, t);
  real = max(real, 0.0)*mix(0.1, 1.0, rampT*rampT) + min(real, 0.0)*smoothstep(0.0, 0.62, t);
  float key = max(0.3 + uKeyDir.y*0.9 + mix(max(real, 0.0)*0.7 + min(real, 0.0)*0.55, real*0.7, uCalm), 0.0);
  vec3 col = alb*(uSkyCol*0.78 + uGroundCol*0.25 + uKeyCol*key);
  col += uRimCol*smoothstep(0.12, 0.5, real)*0.1;
  // the lee: short (it is the steep flank's own width) and violet
  float leeK = smoothstep(0.02, mix(0.4, 0.26, uCalm), -real);
  col *= mix(vec3(1.0), mix(vec3(0.62, 0.63, 0.9), vec3(0.46, 0.49, 0.72), uCalm), leeK);
  // the moon: gold on the flank that looks at it
  float mface = smoothstep(0.1, 0.55, dot(N, uMoonDir))*mix(0.15, 1.0, rampT);
  col += alb*uMoonCol*(max(dot(N, uMoonDir), 0.0)*1.5 + 1.0*mface);
  vec2 mdir = uMoonDir.xz/max(length(uMoonDir.xz), 1e-3), vdir = -V.xz/max(length(V.xz), 1e-3);
  float laneW = smoothstep(0.78, 0.99, dot(mdir, vdir));
  float goldF = mface*(0.55 + 0.45*laneW)*(1.0 - 0.6*uCalm);
  col = min(wGrade(col), vec3(0.72))*mix(vec3(1.0), vec3(1.09, 0.95, 0.77), clamp(goldF, 0.0, 1.0));      // (a paler gold than the plain's: many small flanks in full gold were a scatter of cream patches)
  // the crest line: its distance from the crest in pixels (t runs 0 at the foot to 1 on the crest), 3 cm wide and never
  // drawn under a pixel and a quarter; where its true width is under a third of a pixel it keeps only that share of its
  // light; none on the low nose and the last of the tail
  float tpx = max(fwidth(t), 1e-5), wpx = max(0.03/pxm, 1.25);
  float line = (1.0 - smoothstep(0.35*wpx, wpx, (1.0 - t)/tpx))*smoothstep(0.05, 0.16, vT.y)*min(0.09/pxm, 1.0);
  col += uRimCol*line*mix(0.34, 0.2, uCalm);
  float brk = 0.3 + 0.7*smoothstep(0.3, 0.62, sfVN(vec2(q.y*0.55 + vT.z*37.0, vT.z*11.0)));
  col = mix(col, vec3(1.3, 0.82, 0.36)*(uMoonCol.r*2.6), clamp(line*brk*(0.35 + 0.65*laneW)*(1.0 - 0.5*uCalm)*0.9, 0.0, 1.0));
  gl_FragColor = vec4(sfApply(col, vWp), 1.0);
}`;function at(o,s,d,u,t,m){const n=t-d,f=m-u,a=n*n+f*f,r=a>1e-9?Fe(((o-d)*n+(s-u)*f)/a,0,1):0;return Math.hypot(o-d-n*r,s-u-f*r)}function q0(o,s,d,u,t,m,n,f){const a=(d-o)*(m-s)-(u-s)*(t-o),r=(d-o)*(f-s)-(u-s)*(n-o),S=(n-t)*(s-m)-(f-m)*(o-t),p=(n-t)*(u-m)-(f-m)*(d-t);return a*r<0&&S*p<0?0:Math.min(at(o,s,t,m,n,f),at(d,u,t,m,n,f),at(t,m,o,s,d,u),at(n,f,o,s,d,u))}async function B0(o,s,d,u,t,m,n){const f=d.heightAt,a=d.panes,r=15,S=-166,p=15.5,C=26,w=[],M=(l,h)=>l>-16&&l<16&&h<25&&h>-166?f(l,h):0,F=(l,h)=>{if(s0(a,l,h)>.42)return!0;if(Math.max(v(24,34,Math.abs(l)),1-v(-190,-160,h))*v(62,80,Math.hypot(l-ee.x,h-ee.z))<.02)return!1;const D=l*We[0]+h*We[1],Z=l*E[0]+h*E[1];return ot(D*.036+5,Z*.011+5)+.25*(ot(D*.16,Z*.05)-.5)>.62},O=(l,h,k,D,Z,se)=>{for(let fe=-2;fe<=2;fe++)for(let we=-1;we<=1;we++)if(F(l+Z*k*fe*.25+se*D*we*.9,h+se*k*fe*.25-Z*D*we*.9))return!0;return!1},y=(l,h,k)=>{for(const D of a)if(Math.abs(D.x-l)<D.a+2+k&&Math.abs(D.z-h)<D.a+2+k)return!0;return Math.hypot(l-ee.x,h-ee.z)>62-k&&(Math.abs(l)>24-k||h<-160+k)},A=[0,-1.5,1.5,-3,3],B=(l,h,k,D,Z,se,fe,we,xe)=>{const L=E[0]*Math.cos(se)-E[1]*Math.sin(se),he=E[0]*Math.sin(se)+E[1]*Math.cos(se);let ye=l,oe=h;if(y(l,h,k*.5+4)){let z=!1;for(let V=0;V<5&&!z;V++)ye=l+L*A[V],oe=h+he*A[V],z=!O(ye,oe,k,Z,L,he);if(!z)return!1}for(const z of u.solids){const V=z.x-ye,q=z.z-oe;if(Math.abs(V*L+q*he)<k*.5+.5*z.w+.7&&Math.abs(V*he-q*L)<Z+.5*z.w+.7)return!1}for(let z=w.length-1;z>=0;z--){const V=w[z],q=V.x-ye,P=V.z-oe;if(!(q>9||q<-9||P>9||P<-9)&&Math.abs(q*L+P*he)<(k+V.L)*.5+.3&&Math.abs(q*he-P*L)<(Z+V.w)*.72)return!1}return w.push({x:ye,z:oe,L:k,h:D,w:Z,dx:L,dz:he,asym:fe,sd:we,field:xe}),!0};let I=0;const Y=async(l,h,k,D,Z,se,fe,we)=>{const xe=[[h,D],[h,Z],[k,D],[k,Z]].map(([L,he])=>L*We[0]+he*We[1]);for(let L=Math.min(...xe)+s()*l;L<Math.max(...xe);L+=l){const he=Math.max(Math.min((h-L*We[0])/E[0],(k-L*We[0])/E[0]),Math.min((D-L*We[1])/E[1],(Z-L*We[1])/E[1])),ye=Math.min(Math.max((h-L*We[0])/E[0],(k-L*We[0])/E[0]),Math.max((D-L*We[1])/E[1],(Z-L*We[1])/E[1]));for(let oe=he+s()*5;oe<ye;){I++%40===0&&await o.yield();const z=se(),V=s.range(-.18,.18)*l,q=s.range(-.13,.13),P=s.range(.25,.62),Me=s(),be=oe+z.L*.5,Ce=(L+V)*We[0]+be*E[0],ze=(L+V)*We[1]+be*E[1],Ve=z.h*(.75+.25*Math.min(z.L/6,1))*fe(Ce,ze);Ve>=.11&&B(Ce,ze,z.L,Ve,z.w,q,P,Me,we),oe+=z.L+z.gap}}},le=(l,h,k)=>(1-v(10,p,k))*v(S,S+14,h)*(1-v(r-8,r,h))*u.colony(l,h),U=l=>l>S&&l<r;await Y(1.3,-6.5,8.5,S,r,()=>{const l=2.6+5.2*Math.pow(s(),1.3);return{L:l,h:s.range(.3,.5),w:Fe(.09*l,.42,.85)*s.range(.8,1.2),gap:s.range(.4,2.2)}},(l,h)=>{if(!U(h))return 0;const k=u.near(l,h).dist;return k<=3.6?le(l,h,k):0},0),await Y(1.7,-10,12,S,r,()=>{const l=2.5+5.5*Math.pow(s(),1.6);return{L:l,h:s.range(.3,.56),w:Fe(.1*l,.42,.85)*s.range(.8,1.2),gap:s.range(.5,3)}},(l,h)=>{if(!U(h))return 0;const k=u.near(l,h).dist;return k>3.2&&k<6.5?le(l,h,k):0},0),await Y(3,-19,21,S,r,()=>{const l=4.5+3.5*Math.pow(s(),1.25);return{L:l,h:s.range(.38,.6),w:Fe(.12*l,.6,1)*s.range(.85,1.2),gap:s.range(2,7)}},(l,h)=>{if(!U(h))return 0;const k=u.near(l,h).dist;return k>=6&&k<=p?le(l,h,k):0},0);const te=w.length,x=u.leg,X=(l,h)=>Math.min(at(l,h,x[0][0],x[0][2],x[1][0],x[1][2]),at(l,h,x[1][0],x[1][2],x[2][0],x[2][2]));await Y(2.2,Math.min(x[0][0],x[1][0],x[2][0])-C,Math.max(x[0][0],x[1][0],x[2][0])+C,Math.min(x[0][2],x[1][2],x[2][2])-C,Math.max(x[0][2],x[1][2],x[2][2])+C,()=>{const l=3.2+4.8*Math.pow(s(),1.2);return{L:l,h:s.range(.4,.6),w:Fe(.11*l,.5,.95)*s.range(.85,1.2),gap:s.range(1,4.5)}},(l,h)=>{const k=X(l,h);return k<=C?(1-v(16,C,k))*u.colony(l,h)*v(24,32,Wt(h)-l):0},1),await o.yield();const pe=[{pos:[],nrm:[],aT:[],idx:[]},{pos:[],nrm:[],aT:[],idx:[]}],J=[0,0],ie=new Float64Array(120),ve=new Float64Array(12),H=new Float64Array(216),ce=new Float64Array(216),Ge=[0,.45,1,1,.45,0],Q=[],$=(l,h,k,D)=>{H[l]=h,H[l+1]=k,H[l+2]=D},qe=(l,h,k,D,Z)=>{const se=k*3,fe=D*3,we=Z*3,xe=H[fe]-H[se],L=H[fe+1]-H[se+1],he=H[fe+2]-H[se+2],ye=H[we]-H[se],oe=H[we+1]-H[se+1],z=H[we+2]-H[se+2];let V=L*z-he*oe,q=he*ye-xe*z,P=xe*oe-L*ye;q<0?(V=-V,q=-q,P=-P,l.idx.push(h+k,h+Z,h+D)):l.idx.push(h+k,h+D,h+Z),ce[se]+=V,ce[se+1]+=q,ce[se+2]+=P,ce[fe]+=V,ce[fe+1]+=q,ce[fe+2]+=P,ce[we]+=V,ce[we+1]+=q,ce[we+2]+=P};let st=0;for(const l of w){st++%3===0&&await o.yield();const h=u.near(l.x,l.z).dist>9,k=Fe(Math.round(l.L*1.1+2)-(h?3:0),4,11),D=l.dz,Z=-l.dx,se=l.sd*40,fe=l.sd*91,we=l.sd*17;Q.length=0;for(const z of u.walks)at(l.x,l.z,z[0],z[1],z[2],z[3])<l.L*.5+4+z[4]&&Q.push(z);for(let z=0;z<=k;z++){const V=Math.pow(z/k,1.35),q=(V-.5)*l.L,P=z*10,Me=.2*l.w*Math.sin(V*5.5+se)+.07*l.w*Math.sin(V*13+fe),be=l.x+l.dx*q+D*Me,Ce=l.z+l.dz*q+Z*Me;let ze=Math.min(1,Math.pow(V/.07,.6))*(1-.9*Math.pow(V,1.25))*(.85+.15*Math.sin(V*8+fe))*(1-.3*Math.pow(Math.max(0,Math.sin(V*19+we)),3));(z===0||z===k)&&(ze=0);const Ve=l.w*(.3+.7*v(0,.16,V))*(1-.84*Math.pow(V,1.4)),Ee=-(.42+.5*l.asym)*Ve*(.45+.55*(1-V)),Ne=be-D*Ve,nt=Ce-Z*Ve,lt=be+D*Ve,Ke=Ce+Z*Ve,it=be+D*Ee,rt=Ce+Z*Ee,Oe=M(it,rt);let Xe=1;if(ze>0){const je=u.near(it,rt),ke=je.y-.7+.5*v(1.5,3.5,je.dist)-Oe;Xe=Fe(ke/(ze*l.h),0,1);for(let yt=0;yt<Q.length&&Xe>0;yt++){const Ye=Q[yt];Xe=Math.min(Xe,v(.45+Ye[4],1.3+Ye[4],q0(Ne,nt,lt,Ke,Ye[0],Ye[1],Ye[2],Ye[3])))}}ve[z]=Xe,ie[P]=ze,ie[P+1]=Ne,ie[P+2]=nt,ie[P+3]=lt,ie[P+4]=Ke,ie[P+5]=it,ie[P+6]=rt,ie[P+8]=Oe}let xe=0;for(let z=0;z<=k;z++){let V=1;for(let q=0;q<=k;q++)V=Math.min(V,ve[q]+.2*Math.abs(q-z));ie[z*10]*=V,xe=Math.max(xe,ie[z*10]*l.h)}if(xe<.11)continue;const L=pe[l.field],he=L.pos.length/3,ye=(k+1)*6,oe=.05;J[l.field]++;for(let z=0;z<=k;z++){const V=z*10,q=z*18,P=ie[V]*l.h,Me=ie[V+1],be=ie[V+2],Ce=ie[V+3],ze=ie[V+4],Ve=ie[V+5],Ee=ie[V+6],Ne=ie[V+8],nt=M(Me,be),lt=M(Ce,ze);$(q,Me,nt-oe,be),$(q+3,_(Me,Ve,.58),_(nt,Ne,.58)+(P>0?.38*P:-oe),_(be,Ee,.58)),$(q+6,Ve,Ne+(P>0?P:-oe),Ee),$(q+9,Ve,Ne+(P>0?P:-oe),Ee),$(q+12,_(Ce,Ve,.58),_(lt,Ne,.58)+(P>0?.38*P:-oe),_(ze,Ee,.58)),$(q+15,Ce,lt-oe,ze);for(let Ke=0;Ke<6;Ke++)L.pos.push(H[q+Ke*3],H[q+Ke*3+1],H[q+Ke*3+2]),L.aT.push(Ge[Ke],P,l.sd)}ce.fill(0,0,ye*3);for(let z=0;z<k;z++)for(let V=0;V<4;V++){const q=z*6+(V<2?V:V+1),P=q+1,Me=q+6,be=Me+1;qe(L,he,q,P,Me),qe(L,he,P,be,Me)}for(let z=0;z<ye;z++){let V=ce[z*3],q=ce[z*3+1],P=ce[z*3+2];const Me=z%6,be=Math.hypot(V,q,P)||1;if(V/=be,q/=be,P/=be,Me===0||Me===5){q+=1.2;const Ce=Math.hypot(V,q,P);V/=Ce,q/=Ce,P/=Ce}L.nrm.push(V,q,P)}}await o.yield();const N=Object.assign({uSnow:{value:((l,h=1)=>new e.Color(l).multiplyScalar(h))(_e[2],.8)},uWind:{value:new e.Vector2(E[0],E[1])},uKeyDir:t.uKeyDir,uKeyCol:t.uKeyCol,uSkyCol:t.uSkyCol,uGroundCol:t.uGroundCol,uRimCol:t.uRimCol,uSat:t.uSat},n,m),R=new e.ShaderMaterial({uniforms:N,vertexShader:W0,fragmentShader:T0}),re=new e.Group;re.name="sastrugi",re.userData.ridges={approach:J[0],lowLeg:J[1],tried:w.length,triedApproach:te};for(const l of pe){if(!l.idx.length)continue;const h=new e.BufferGeometry;h.setAttribute("position",new e.Float32BufferAttribute(l.pos,3)),h.setAttribute("normal",new e.Float32BufferAttribute(l.nrm,3)),h.setAttribute("aT",new e.Float32BufferAttribute(l.aT,3)),h.setIndex(l.idx),h.computeBoundingSphere(),await o.yield();const k=new e.Mesh(h,R);k.name="sastrugi-ridges",re.add(k)}return{object:re}}const l0=`
uniform vec3 uBlue, uBlueDeep, uJade, uFirn, uSnow, uTurq;
uniform float uTime, uGlow, uBerg;
${tt}
${Ue}
`,R0=`
attribute vec4 aA;
varying vec3 vWp, vN; varying vec4 vA;
void main(){ vA = aA; vec4 wp = modelMatrix*vec4(position, 1.0); vWp = wp.xyz; vN = mat3(modelMatrix)*normal; gl_Position = projectionMatrix*viewMatrix*wp; }`,P0=`
${l0}
uniform vec3 uRing;
varying vec3 vWp, vN; varying vec4 vA;
// scallops: x = squared distance to the nearest cell centre (a cup with crisp crests between cups), yz = the
// vector to that centre (the cup's slope), so one lookup gives the relief and its normal
float cRidge; vec2 cId;
vec3 cCell(vec2 p){
  vec2 i = floor(p), f = fract(p); vec3 best = vec3(4.0, 0.0, 0.0); float d2 = 4.0; cId = i;
  for (int a = -1; a <= 1; a++) for (int b = -1; b <= 1; b++) {
    vec2 g = vec2(float(a), float(b)), r = g + vec2(sfHash(i + g), sfHash(i + g + 17.3))*0.8 + 0.1 - f;
    float d = dot(r, r);
    if (d < best.x) { d2 = best.x; best = vec3(d, r); cId = i + g; } else if (d < d2) d2 = d;
  }
  cRidge = sqrt(d2) - sqrt(best.x);                  // 0 on the crest between two cups
  return best;
}
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0));
  vec3 V = normalize(cameraPosition - vWp + vec3(0.0, 1e-4, 0.0));
  float y = vWp.y, fisA = vA.y, top = vA.z, v = vA.w;
  float px = length(fwidth(vWp));
  // (the face keeps its modelled relief at every distance: flattened toward one plane and banded in level courses it
  // read from the plain as translucent sheets laid over the ice)
  float farK = smoothstep(45.0, 95.0, length(cameraPosition - vWp));
  float lineFade = 1.0 - smoothstep(0.12, 0.7, px);
  float b0 = sfVN(vec2(v*0.55, y*0.55)) + 0.5*sfVN(vec2(v*1.9, y*1.4));
  float bv = sfVN(vec2((v + 0.25)*0.55, y*0.55)) + 0.5*sfVN(vec2((v + 0.25)*1.9, y*1.4));
  float by = sfVN(vec2(v*0.55, (y + 0.25)*0.55)) + 0.5*sfVN(vec2(v*1.9, (y + 0.25)*1.4));
  // a slow swell of the face: gentle at mid distance, halved again far off, and gone at the close pass, where the
  // face is fractured into flat facets instead (below)
  N = normalize(N - vec3(0.0, by - b0, bv - b0)*0.9*(1.0 - smoothstep(0.1, 0.9, px))*mix(0.3, 1.0, smoothstep(0.03, 0.09, px))*mix(1.0, 0.4, smoothstep(0.1, 0.18, px)));
  // crisp near-field relief: melt scallops 1-3 m across (stretched along the strata on a tabular face)
  float k1 = 1.0 - smoothstep(0.08, 0.55, px), k2 = 1.0 - smoothstep(0.04, 0.3, px);
  vec2 sp = vec2(v, y*mix(1.9, 1.0, uBerg));
  // the cup lattice is warped over eight metres, and large shallow cups give way to fields of small ones (cm)
  sp += (vec2(sfVN(vec2(v*0.13 + 3.0, y*0.13)), sfVN(vec2(v*0.13 + 31.0, y*0.13 + 7.0))) - 0.5)*2.8;
  sp += (vec2(sfVN(sp*0.85 + 5.0), sfVN(sp*0.85 + 41.0)) - 0.5)*0.75;        // and again over a metre: no straight edges
  float cm = smoothstep(0.34, 0.66, sfVN(vec2(v*0.1 + 13.0, y*0.12)));
  vec3 c1 = cCell(sp*0.42 + 3.0); float e1 = cRidge/0.42; vec2 id1 = cId;
  vec3 c2 = cCell(sp*1.05 + vec2(11.0, 5.0)); float e2 = cRidge/1.05; vec2 id2 = cId;
  // the close pass: every cell is also a flat facet with its own tilt, so the face breaks into crisp planes with a
  // dark crease between them, and a few facets hold a fleck of bright snow
  vec2 t1 = vec2(sfHash(id1 + 3.3), sfHash(id1 + 19.1)) - 0.5, t2 = vec2(sfHash(id2 + 5.7), sfHash(id2 + 23.9)) - 0.5;
  float kf = 1.0 - smoothstep(0.045, 0.16, px);
  // (a few large conchoidal planes among fields of small ones: which layer leads changes from patch to patch)
  float fA = 0.95*mix(0.3, 1.0, cm), fB = 0.6*mix(1.5, 0.5, cm);
  N = normalize(N + vec3(0.0, t1.y*fA + t2.y*fB, t1.x*fA + t2.x*fB)*kf);
  // fine frost inside each plane: its grain is the plane's own, so it breaks at every edge
  float fz0 = sfVN(vec2(v, y)*9.0 + id2*3.7), fzv = sfVN(vec2(v + 0.04, y)*9.0 + id2*3.7), fzy = sfVN(vec2(v, y + 0.04)*9.0 + id2*3.7);
  float kz = 1.0 - smoothstep(0.02, 0.07, px);
  N = normalize(N - vec3(0.0, fzy - fz0, fzv - fz0)*2.2*kz);
  float sm = 0.3 + 0.7*smoothstep(0.3, 0.68, sfVN(vec2(v*0.035 + 9.0, y*0.07)));                 // scalloped in patches
  float crease = (1.0 - smoothstep(0.0, 0.035 + px*1.5, e1))*0.34 + (1.0 - smoothstep(0.0, 0.02 + px*1.5, e2))*0.2;
  crease *= (0.3 + 0.7*sm)*smoothstep(0.25, 0.6, sfVN(sp*0.6 + 21.0));          // broken: never a closed net
  float fleck = step(0.8, sfHash(id2 + 41.3))*(1.0 - smoothstep(0.0003, 0.0009 + px*0.03, (c2.y*c2.y*0.2 + c2.z*c2.z*2.6)*(0.6 + 1.6*sfHash(id2 + 2.9))))*kf;   // (a pinch of snow lying along a ledge, a short level dash: round and a hand across it was a white disc)
  vec2 cg = c1.yz*0.42*k1*2.2*mix(0.3, 1.0, cm) + c2.yz*1.05*k2*mix(1.0, 0.22, cm);
  N = normalize(N + vec3(0.0, cg.y*mix(1.9, 1.0, uBerg), cg.x)*mix(0.6, 0.8, uBerg)*sm*mix(1.0, 0.6, kf));
  float cup = mix(1.0, sqrt(c1.x), k1*sm*mix(0.3, 1.0, cm))*mix(1.0, 0.75 + 0.35*sqrt(c2.x), k2*sm*mix(1.0, 0.3, cm));
  // the strata dip and rise by a few metres along the berg (it has tilted and settled): no course runs dead level
  float wav = y + 2.6*sfVN(vec2(v*0.02, y*0.08)) + 0.7*sfVN(vec2(v*0.11, y*0.3)) + 7.0*(sfVN(vec2(v*0.0085 + 4.0, 1.5)) - 0.5)*smoothstep(30.0, 70.0, abs(v));
  // strata that read at 100 m: a pale firn cap, compressed blue below, two jade bands of marine ice
  float firn = smoothstep(23.5, 27.5, wav + 2.5*sfVN(vec2(v*0.06, 2.0)))*(1.0 - uBerg);
  vec3 alb = mix(uBlueDeep, uBlue, smoothstep(0.0, 24.0, wav));
  float j1 = (wav - 9.0)/2.5, j2 = (wav - 17.5)/1.9;
  float jade = clamp(exp(-j1*j1) + exp(-j2*j2), 0.0, 1.0)*(1.0 - uBerg);
  jade = max(jade, uBerg*smoothstep(0.52, 0.72, sfVN(vec2(v*0.013 + 3.0, y*0.035))));
  alb = mix(alb, uJade, jade*0.8);
  alb = mix(alb, uFirn*1.08, firn*0.92);
  // a paler band of firn along the top eight metres, whatever the berg: its lower edge is ragged and distinct
  // (it hangs down the face in tongues of unequal depth, so its edge never repeats the skyline below itself)
  float fEdge = top - 5.0 - 8.0*sfVN(vec2(v*0.05, 5.0)) - 2.6*sfVN(vec2(v*0.31, 2.0));
  alb = mix(alb, uFirn*1.02, smoothstep(fEdge, fEdge + 2.6, y)*(0.78 - 0.34*uBerg));
  // layering: two noise-warped band systems (no regular sine), each faded before it can alias
  float s1 = sfVN(vec2(v*0.03, wav*0.85)), s2 = sfVN(vec2(v*0.09 + 5.0, wav*2.6 + 1.5*s1));
  float lf1 = 1.0 - smoothstep(0.3, 1.3, px), lf2 = 1.0 - smoothstep(0.08, 0.4, px);
  alb *= 1.0 + ((s1 - 0.5)*0.42*lf1 + (s2 - 0.5)*0.24*lf2)*(1.0 - uBerg)*(0.55 + 0.45*firn);
  float band = sfVN(vec2(v*0.004, wav*0.55));
  alb *= 0.72 + 0.5*band;
  float flute = sfVN(vec2(v*0.8, y*0.045)) + 0.5*sfVN(vec2(v*2.3, y*0.12))*lineFade;
  // fluting: upright runnels down the face; from the plain they are what carves it into columns
  float flF = sfVN(vec2(v*0.26 + 2.0*sfVN(vec2(v*0.05, y*0.03)), y*0.012 + 7.0));
  alb *= (0.86 + 0.18*flute)*(1.0 - 0.26*farK*(1.0 - smoothstep(0.1, 0.42, abs(flF - 0.5)))*(1.0 - smoothstep(0.86, 1.0, y/max(top, 1.0))));
  float nearK = 1.0 - smoothstep(0.03, 0.25, px);
  alb *= 1.0 + nearK*(0.16*sfVN(vec2(v*3.3, y*3.3)) + 0.2*sfVN(vec2(v*9.0, y*7.0)) - 0.18);
  // the cups are deeper, clearer ice: darker in the middle, paler toward the crests
  alb *= mix(0.92 + 0.14*cup, 0.78 + 0.36*cup, uBerg);
  float snowM = smoothstep(mix(0.5, 0.6, farK), mix(0.8, 0.9, farK), N.y + 0.2*(sfVN(vWp.xz*0.4) - 0.5));   // (from the plain only true ledges hold snow: a pale patch on every swell reads as a sheet laid over the face)
  snowM = max(snowM, 1.0 - smoothstep(0.6, 3.5 + 2.0*sfVN(vec2(v*0.15, 1.0)), y));
  alb *= 1.0 - 0.3*crease*kf*(1.0 - snowM);                 // (a faint shade in the crease: dark seams were cracked glaze)
  alb *= 1.0 + kz*0.3*(fz0 - 0.5)*(1.0 - snowM);
  snowM = max(snowM, fleck);
  alb = mix(alb, uSnow, snowM);
  vec3 hemi = mix(uGroundCol + uKeyCol*0.17, uSkyCol*1.25, N.y*0.5 + 0.5);
  float kd = max(dot(N, uKeyDir), 0.0);
  float west = clamp(0.4 - N.x*0.6, 0.0, 1.0);
  vec3 col = alb*(hemi*(0.75 + 0.55*west) + uKeyCol*kd*0.9);
  // the face is lit by the sky alone, so the relief is drawn by what looks up and what looks down
  col *= 0.8 + 0.3*smoothstep(-0.45, 0.35, N.y);
  col *= 1.0 - 0.6*fisA*(1.0 - snowM);
  col *= 0.72 + 0.28*smoothstep(0.0, 9.0, y);
  // the ice carries its own colour: light soaks through the blue and the jade whatever the sky is doing
  col += (uBlue*0.03 + uJade*0.09*jade)*uGlow*(1.0 - snowM)*(1.0 - firn)*(1.0 - smoothstep(fEdge, fEdge + 1.6, y))*(0.45 + 0.55*uSat);
  float fl = sfVN(vec2(v*0.33, y*0.028));
  float line = (1.0 - smoothstep(0.0, 0.04 + px*0.03, abs(fl - 0.5)))*lineFade;
  float breathe = 0.64 + 0.36*sin(uTime*1.1 + v*0.07 + y*0.05);
  // in a fissure the glow is a faint breath of colour and one or two thin bright seams winding through it
  // the seam is the 0.5 line of a noise; dividing by the noise's slope turns it into metres from that line, so the
  // thread keeps one width (0.1 m) and cannot balloon into a patch where the noise lies flat
  float sn0 = sfVN(vec2(v*0.21 + 7.0, y*0.21));
  vec2 sg = vec2(sfVN(vec2((v + 0.5)*0.21 + 7.0, y*0.21)) - sn0, sfVN(vec2(v*0.21 + 7.0, (y + 0.5)*0.21)) - sn0)*2.0;
  float sgl = length(sg);
  float tw = 0.14 + px*1.5;                                    // half-width: 14 cm of soft light, never under a pixel and a half (a hair line is neon wire drawn on the ice)
  float thread = (1.0 - smoothstep(tw*0.1, tw, abs(sn0 - 0.5)/max(sgl, 0.02)))*smoothstep(0.012, 0.04, sgl)*min(0.2/tw, 1.0)*(1.0 - smoothstep(0.3, 1.0, px))
               *smoothstep(0.3, 0.62, sfVN(vec2(v*0.55 + 31.0, y*0.55 + 3.0)));      // broken along its length
  float sFloor = mix(0.05, 0.15, smoothstep(0.08, 0.22, px));    // far off the fissure keeps a breath of colour; close to, only the threads
  float seam = smoothstep(0.45, 0.9, fisA)*sqrt(sFloor + (1.0 - sFloor)*thread);
  float glow = min(seam*seam*mix(1.7, 1.45, uBerg) + line*0.06*(1.0 - firn), 0.8)*breathe*(1.0 - snowM);
  vec4 fogc = sfFogRay(cameraPosition, vWp, 1.0);
  float clr = 1.0 - fogc.a; clr *= clr;                         // the glow is in the ice: where the snow hides the face it is hidden too
  col += uTurq*glow*uGlow*smoothstep(1.0, 7.0, y)*(1.0 - smoothstep(top - 5.0, top - 0.5, y))*clr;
  float fr = 1.0 - clamp(dot(N, V), 0.0, 1.0); fr = fr*fr*fr;
  float ledge = smoothstep(0.12, 0.62, N.y)*(1.0 - snowM);
  col += uRimCol*(fr*(0.1 + 0.4*ledge) + ledge*0.022);
  col += alb*uMoonCol*(max(dot(N, uMoonDir), 0.0)*1.3 + 0.5*ledge);       // the moon grazes the face: warm on every ledge and snow cap
  // thin pearl light on the lower rim of each cup, the ledge that looks up at the sky: arcs, never a closed net
  float kc = 1.0 - smoothstep(0.05, 0.3, px);
  float crest = (1.0 - smoothstep(0.02, 0.09 + px, e1))*smoothstep(0.3, 0.8, c1.z/max(sqrt(c1.x), 1e-3))*kc*cm
              + 0.5*(1.0 - smoothstep(0.01, 0.05 + px, e2))*smoothstep(0.3, 0.8, c2.z/max(sqrt(c2.x), 1e-3))*k2*(1.0 - cm);
  col += uRimCol*crest*sm*0.055*(1.0 - snowM) + uRimCol*fleck*0.2;
  // the edges between planes are thin and BRIGHT: they catch the ring's light (broken, never a closed net)
  float edgeL = (1.0 - smoothstep(0.0, 0.012 + px*1.1, e1))*smoothstep(0.52, 0.74, sfVN(sp*0.33 + 21.0))*smoothstep(0.42, 0.66, sfVN(sp*1.9 + 47.0))*(0.4 + 0.6*cm)*kf;   // (broken again along its length: short bright nicks, no net of seams)
  col += mix(uRimCol, uTurq*1.6, 0.35)*edgeL*0.2*(1.0 - snowM);
  // the ring's light plays over the ice either side of the notch: a slow shimmer of mint on every plane that looks at
  // it, gone within forty metres (the ice right behind the ring stays dark)
  vec3 rv = uRing - vWp; float rd = length(rv);
  float rsh = sfVN(vec2(v*0.11 + uTime*0.35, y*0.09 - uTime*0.5))*(0.6 + 0.8*sfVN(vec2(v*0.31 - uTime*0.6, y*0.27 + uTime*0.25 + 9.0)));
  col += mix(uTurq, uRimCol, 0.4)*(0.2 + 0.8*smoothstep(0.0, 0.5, dot(N, rv/max(rd, 1e-3))))*rsh*0.4*smoothstep(7.0, 13.0, rd)*exp(-rd*rd/1150.0)*(1.0 - 0.5*snowM)*uGlow;
  // glitter sinking down the face
  vec2 gc = vec2(v, y + uTime*3.2)*1.6; vec2 gi = floor(gc);
  float gh = sfHash(gi + 5.3);
  vec2 gj = vec2(sfHash(gi + 3.1), sfHash(gi + 9.7))*0.6 + 0.2;
  float spark = step(0.84, gh)*(0.4 + 0.6*fract(gh*37.0))*(1.0 - smoothstep(0.008, 0.02 + px*0.9, length(fract(gc) - gj)))*(0.5 + 0.5*sin(uTime*6.0 + gh*200.0));
  col += uRimCol*spark*(1.0 - smoothstep(0.08, 0.26, px))*smoothstep(2.0, 8.0, y)*2.4*smoothstep(5.0, 16.0, length(cameraPosition - vWp));   // at arm's length they would be dots
  col = min(wGrade(col), vec3(1.2));
  gl_FragColor = vec4(mix(col, fogc.rgb, fogc.a), 1.0);
}`,L0=`
${l0}
uniform vec2 uWind;
varying vec3 vWp, vN, vLp;
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0)); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWp + vec3(0.0, 1e-4, 0.0));
  float n1 = sfVN(vLp.xy*2.6 + vLp.z*3.7 + vWp.xz*0.13);
  vec3 alb = mix(uBlueDeep*0.55, uBlue*0.75, n1*n1);
  alb = mix(alb, uJade*0.6, uBerg*0.5*sfVN(vWp.xz*0.05));
  float c = sfVN(vLp.xy*5.1 + vLp.z*6.3 + 7.0);
  alb += uFirn*0.22*(1.0 - smoothstep(0.0, 0.05, abs(c - 0.5)));
  alb *= 0.8 + 0.3*sfVN(vec2(vLp.x*9.0 + vLp.z*5.0, vLp.y*1.3));
  vec3 w3 = normalize(vec3(uWind.x, -0.35, uWind.y));
  float grain = sfVN(vWp.xz*3.1 + vWp.y*2.3);
  float snowM = smoothstep(0.5, 0.8, N.y + 0.3*(grain - 0.5));
  // rime only where a face looks into the wind, broken by a coarse noise so no whole facet turns white
  float rimeN = sfVN(vLp.xy*3.1 + vLp.z*2.3 + vWp.xz*0.41);
  float rime = smoothstep(0.5, 0.95, dot(N, -w3) + 0.7*(rimeN - 0.5))*(0.35 + 0.3*grain);
  snowM = max(max(snowM, rime), 1.0 - smoothstep(0.03, 0.3 + 0.45*rimeN, vWp.y));
  alb = mix(alb, uSnow, snowM);
  vec3 hemi = mix(uGroundCol*1.2, uSkyCol*1.1, N.y*0.5 + 0.5);
  float kd = clamp((dot(N, uKeyDir) + 0.15)/1.15, 0.0, 1.0);
  vec3 col = alb*(hemi + uKeyCol*kd);
  col *= 0.5 + 0.5*smoothstep(0.0, 0.8, vWp.y);
  float fr = 1.0 - clamp(dot(N, V), 0.0, 1.0); fr = fr*fr*fr;
  col += uRimCol*fr*(0.06 + 0.3*snowM) + uTurq*uGlow*0.05*fr*(1.0 - snowM);
  col += alb*uMoonCol*max(dot(N, uMoonDir), 0.0)*2.2;
  col = min(wGrade(col), vec3(0.72));
  gl_FragColor = vec4(sfApply(col, vWp), 1.0);
}`;function D0(o,s,d,u){const t=(n,f=1)=>new e.Color(n).multiplyScalar(f),m=(n,f)=>{const a=n.r*.2126+n.g*.7152+n.b*.0722;return n.lerp(new e.Color(a,a,a*1.1),f)};return Object.assign({uBlue:{value:m(t(_e[3],.95),.36)},uBlueDeep:{value:m(t("#16335E",.8),.3)},uJade:{value:m(t("#4E9C8E",.84),.33)},uFirn:{value:t(_e[2],.8)},uSnow:{value:t(_e[2],.8)},uTurq:{value:t("#58D8CC",.75)},uTime:d,uGlow:{value:u.hour==="deep"?1.25:.9},uBerg:{value:u.berg==="overturned"?1:0},uWind:{value:new e.Vector2(E[0],E[1])},uRing:{value:Mt},uKeyDir:o.uKeyDir,uKeyCol:o.uKeyCol,uSkyCol:o.uSkyCol,uGroundCol:o.uGroundCol,uRimCol:o.uRimCol,uSat:o.uSat},s)}function K0(o,s){const d=s.berg==="overturned";return u=>{const t=Math.abs(u);let m=(d?38:40)+(d?7:4)*o.n2(u*.012,3.1)+(d?.5:1.5)*o.n2(u*.06,8.2);const n=(t-21)/12;return m+=(d?15:14)*Math.exp(-n*n),m=Math.min(m,36+Math.max(t-2.5,0)/.8),m*=(1-v(110,190,u))*(1-v(225,290,-u)),Math.max(m,1.2)}}async function G0(o,s,d,u){const t=K0(s,d),m=[];for(let y=me.vMin;y<=me.vMax+.01;)m.push(y),y+=Math.abs(y)<31?.75:1.6;const n=40,f=[2,6,16,40,90,170],a=n+1+f.length,r=m.length,S=new Float32Array(r*a*3),p=new Float32Array(r*a*4),C=[],w=d.berg==="overturned";for(let y=0;y<r;y++){y%8===0&&await o.yield();const A=m[y],B=t(A),I=me.x0-me.k*A*A,Y=me.zN+A;let le=0;for(let U=0;U<a;U++){const te=y*a+U;let x,X,pe=0;if(U<=n){const J=U/n;x=B*J,pe=(1-v(0,.11,Math.abs(s.n2(A*.055+20,x*.006))))*v(.03,.15,J)*(1-v(.8,.97,J)),Math.abs(A)<16&&(pe*=.3);const ie=2.4*s.n2(A*.03,x*.05)+.9*s.n2(A*.11,x*.18+4),ve=w?.9*s.n2(A*.2,x*.2+9):.42*s.n2(A*.018,x*.2+5)+.3,H=J>.9?2.2*Math.pow((J-.9)/.1,2):0,ce=J<.08?-6*Math.pow(1-J/.08,2):0,Ge=Math.abs(s.n2(A*.043+50,x*.0045+3)),Q=v(30,48,Math.abs(A)),$=(1-v(.02,.3,Ge))*v(.04,.2,J)*(1-v(.8,.98,J))*Q,qe=v(.3,.85,Ge)*(1-v(.7,.98,J))*(.4+.6*v(0,.3,J))*Q;pe=Math.max(pe,.5*$),X=.05*x+ie+ve+3.6*pe+H+ce+2.6*$-1.5*qe,le=X}else X=le+f[U-n-1],x=B+(U-n)*.25+.5*s.n2(A*.05,X*.05),Math.abs(A)<20&&(x=B);S[te*3]=I+X,S[te*3+1]=x,S[te*3+2]=Y,p[te*4]=Math.min(U/n,1),p[te*4+1]=pe,p[te*4+2]=B,p[te*4+3]=A}}for(let y=0;y<r-1;y++)for(let A=0;A<a-1;A++){const B=y*a+A,I=B+1,Y=B+a,le=Y+1;C.push(B,Y,I,I,Y,le)}const M=new e.BufferGeometry;M.setAttribute("position",new e.BufferAttribute(S,3)),M.setAttribute("aA",new e.BufferAttribute(p,4)),M.setIndex(C),await o.yield(),await n0(o,M),await o.yield();const F=new e.ShaderMaterial({uniforms:u,vertexShader:R0,fragmentShader:P0}),O=new e.Mesh(M,F);return O.name="berg-face",O.frustumCulled=!1,{object:O,topAt:t}}function i0(o=4,s=6,d=2){const u=new e.BoxGeometry(1,1,1,o,s,d);u.translate(0,.5,0);const t=u.getAttribute("position"),m=(f,a)=>{let r=Math.imul(f*73+a*151+1013,2654435761)>>>0;return r^=r>>>15,r=Math.imul(r,2246822519)>>>0,r^=r>>>13,(r>>>0)/4294967296-.5},n=(f,a)=>{const r=Math.floor(f),S=f-r,p=S*S*(3-2*S);return m(r,a)*(1-p)+m(r+1,a)*p};for(let f=0;f<t.count;f++){const a=t.getX(f),r=t.getY(f),S=t.getZ(f),p=.66+.34*v(-.5,.25,a)-.1*v(.25,.5,a)+.16*n(a*3.3+1.7,1),C=1-.2*r*r+.14*n(r*2.7+.4,2),w=v(.55,1,Math.abs(a)*2),M=v(.7,1,r);let F=a*C+.1*r+.07*n(r*4.6+(a>0?3:9),3)*w,O=r*p+.05*n(a*5.1+r*2.3,4)*r;const y=(1-.5*w*w)*(1-.55*M*M)*(.82+.4*n(a*2.2+r*1.6+5,5));let A=S*y*(1-.25*r)+.16*n(a*2.4+2.2,6)*n(r*2.9+.7,7)*2+.05*n(a*6.3+r*5.1,8);r<.01&&(O=-.15),t.setXYZ(f,F,O,A)}return u.computeVertexNormals(),u}async function E0(o,s,d,u,t,m){const n=[];n.push({x:-6.2,z:-23.5,h:4.6,w:3.6,t:1,yaw:.42,tilt:.3,roll:.1});let f=0;for(;n.length<20&&f++<600;){const B=s.range(-150,-30),I=s.range(-17,17),Y=d.nearestXZ(I,B);if(Y.dist<6.5||Y.dist>15||n.some(U=>Math.hypot(U.x-I,U.z-B)<9))continue;const le=s.range(1,3);n.push({x:I,z:B,h:le,w:le*s.range(.6,1.1),t:s.range(.42,.78)*(.55+.45*le),yaw:s.range(0,Math.PI*2),tilt:s.range(.2,.6),roll:s.range(-.25,.25)})}await o.yield();const a=Math.round(230*m);for(let B=0;B<a;B++){const I=_(me.vMin+20,me.vMax-8,(B+s())/a);if(t(I)<3)continue;const Y=me.zN+I,le=s.range(1.5,11)+(s.chance(.15)?s.range(3,9):0),U=s.range(1.6,4.2)*(le>11?.6:1);n.push({x:me.x0-me.k*I*I-le,z:Y,h:U,w:U*s.range(.6,1.3),t:U*s.range(.25,.6),yaw:s.range(0,Math.PI*2),tilt:s.range(.1,1.1),roll:s.range(-.5,.5)})}await o.yield();const r=new e.ShaderMaterial({uniforms:u,vertexShader:M0,fragmentShader:L0,side:e.DoubleSide}),S=Math.min(20,n.length),p=new e.InstancedMesh(i0(),r,S),C=new e.InstancedMesh(i0(3,4,1),r,Math.max(n.length-S,1));await o.yield();const w=new e.Matrix4,M=new e.Quaternion,F=new e.Euler,O=new e.Vector3,y=new e.Vector3;n.forEach((B,I)=>{F.set(B.tilt,B.yaw,B.roll,"YXZ"),M.setFromEuler(F),O.set(B.w,B.h,B.t),y.set(B.x,-.1,B.z),I<S?p.setMatrixAt(I,w.compose(y,M,O)):C.setMatrixAt(I-S,w.compose(y,M,O))}),C.count=n.length-S;const A=new e.Group;A.name="slabs-and-rubble";for(const B of[p,C])B.instanceMatrix.needsUpdate=!0,B.frustumCulled=!1,A.add(B);return{object:A,list:n}}const Kt="vec3 snowLit(float k){ return uSnowC*(uSkyCol*0.9 + uGroundCol*0.3 + uKeyCol*k); }";function O0(o){const s=[],d=[];[.12,.24,.38].forEach((f,a)=>{s.push(-1,f,-1,1,f,-1,1,f,1,-1,f,1),d.push(a*4,a*4+2,a*4+1,a*4,a*4+3,a*4+2)});const t=new e.BufferGeometry;t.setAttribute("position",new e.Float32BufferAttribute(s,3)),t.setIndex(d);const m=new e.ShaderMaterial({uniforms:o,transparent:!0,depthWrite:!1,side:e.DoubleSide,vertexShader:"varying vec3 vWp; void main(){ vWp = vec3(position.x*95.0 + cameraPosition.x, position.y, position.z*95.0 + cameraPosition.z); gl_Position = projectionMatrix*viewMatrix*vec4(vWp, 1.0); }",fragmentShader:`
uniform vec3 uSnowC; uniform vec2 uWind; uniform float uFlow, uSnake;
${tt}
${Ue}
${Kt}
varying vec3 vWp;
void main(){
  vec2 W = uWind, X = vec2(-W.y, W.x); vec2 q = vec2(dot(vWp.xz, X), dot(vWp.xz, W));
  float lay = vWp.y*7.0;
  float qy = q.y - uFlow*(1.0 + vWp.y*0.5);
  float sn = sfVN(vec2(q.x*0.4 + 1.8*sfVN(vec2(qy*0.035, q.x*0.07 + lay)), qy*0.03 + lay));
  float fil = sfVN(vec2(q.x*2.8 + 2.0*sfVN(vec2(qy*0.09, 5.0 + lay)), qy*0.2));
  float dist = length(cameraPosition - vWp);
  float a = smoothstep(0.38, 0.62, sn)*(0.25 + 0.75*fil)*uSnake;
  a *= smoothstep(5.0, 20.0, dist)*(1.0 - smoothstep(45.0, 92.0, dist))*(0.5 - 0.6*vWp.y);
  if (a < 0.004) discard;
  vec3 col = min(wGrade(snowLit(0.55)*1.3), vec3(0.72));
  gl_FragColor = vec4(sfApply(col, vWp), a);
}`}),n=new e.Mesh(t,m);return n.frustumCulled=!1,n.renderOrder=2,n.name="snow-snakes",n}function j0(o,s,d){const t=[],m=[];for(let p=0;p<=20;p++)t.push(p/20,-.5,0,p/20,.5,0);for(let p=0;p<20;p++){const C=p*2;m.push(C,C+2,C+1,C+1,C+2,C+3)}const n=new e.InstancedBufferGeometry;n.setAttribute("position",new e.Float32BufferAttribute(t,3)),n.setIndex(m);const f=new Float32Array(d*4),a=new Float32Array(d*4);for(let p=0;p<d;p++)f[p*4]=o(),f[p*4+1]=.35+Math.pow(o(),1.7)*7.5,f[p*4+2]=o(),f[p*4+3]=o.range(60,120),a[p*4]=o.range(.3,1.3),a[p*4+1]=o.range(.85,1.3),a[p*4+2]=o(),a[p*4+3]=o.range(.45,1);n.setAttribute("aSeed",new e.InstancedBufferAttribute(f,4)),n.setAttribute("aRnd",new e.InstancedBufferAttribute(a,4)),n.instanceCount=d;const r=new e.ShaderMaterial({uniforms:s,transparent:!0,depthWrite:!1,side:e.DoubleSide,vertexShader:`
attribute vec4 aSeed, aRnd;
uniform float uFlow, uStream; uniform vec2 uWind;
varying vec2 vUv; varying vec3 vWp; varying vec3 vS;
void main(){
  vec2 W = uWind, X = vec2(-W.y, W.x);
  float BL = 84.0, BS = 280.0;
  float camL = dot(cameraPosition.xz, X), camS = dot(cameraPosition.xz, W);
  float l = camL + mod(aSeed.x*BL - camL + BL*0.5, BL) - BL*0.5;
  float s = camS + mod(aSeed.z*BS + uFlow*aRnd.y - camS + BS*0.5, BS) - BS*0.5;
  float sx = s + (position.x - 0.5)*aSeed.w;
  float und = sin(sx*0.07 + aRnd.z*6.283)*0.5 + sin(sx*0.19 + aRnd.z*17.0)*0.18;
  float ll = l + sin(sx*0.045 + aRnd.z*9.0)*1.3;
  vec3 c = vec3(X.x*ll + W.x*sx, aSeed.y + und*(0.25 + 0.15*aSeed.y), X.y*ll + W.y*sx);
  vec3 toCam = cameraPosition - c;
  float dist = length(toCam);
  vec3 side = normalize(cross(vec3(W.x, 0.0, W.y), toCam) + vec3(0.0, 1e-4, 0.0));
  vec3 wp = c + side*position.y*aRnd.x*(2.2 + dist*0.04);
  float wrap = smoothstep(0.0, 0.14, 0.5 - abs(s - camS)/BS)*smoothstep(0.0, 0.1, 0.5 - abs(l - camL)/BL);
  vUv = vec2(position.x, position.y*2.0); vWp = wp;
  // (none below the eye: seen from above, a ribbon is only a thin line drawn across the snow)
  vS = vec3(aRnd.w*wrap*smoothstep(1.2, 5.0, dist)*uStream*smoothstep(-0.5, 0.5, c.y - cameraPosition.y)*(1.0 - smoothstep(2.0, 3.6, c.y - cameraPosition.y)), aRnd.z, aSeed.w);
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,fragmentShader:`
uniform vec3 uSnowC; uniform float uFlow;
${tt}
${Ue}
${Kt}
varying vec2 vUv; varying vec3 vWp; varying vec3 vS;
void main(){
  float ac = 1.0 - vUv.y*vUv.y; ac *= ac;
  float al = sin(3.14159*clamp(vUv.x, 0.0, 1.0)); al = sqrt(max(al, 0.0));
  float n = sfVN(vec2(vUv.x*vS.z*0.16 - uFlow*0.02 + vS.y*40.0, vUv.y*1.6 + vS.y*9.0));
  float n2 = sfVN(vec2(vUv.x*vS.z*0.6 + vS.y*7.0, vUv.y*3.0));
  float a = ac*al*smoothstep(0.2, 0.85, n*0.75 + n2*0.4)*vS.x*0.3;
  if (a < 0.004) discard;
  vec3 col = min(wGrade(snowLit(0.6)*1.45), vec3(0.72));
  gl_FragColor = vec4(sfApply(col, vWp), a);
}`}),S=new e.Mesh(n,r);return S.frustumCulled=!1,S.renderOrder=4,S.name="streamers",S}function H0(o){const s=[],d=[];[-27,-19,-12,-5,3,12].forEach((f,a)=>{s.push(-.5,0,f,.5,0,f,.5,1,f,-.5,1,f),d.push(a*4,a*4+1,a*4+2,a*4,a*4+2,a*4+3)});const t=new e.BufferGeometry;t.setAttribute("position",new e.Float32BufferAttribute(s,3)),t.setIndex(d);const m=new e.ShaderMaterial({uniforms:o,transparent:!0,depthWrite:!1,side:e.DoubleSide,vertexShader:`
uniform float uSfEdge, uSfLean; uniform vec2 uWind;
varying vec3 vWp; varying vec3 vUv;
void main(){
  vec2 W = uWind, X = vec2(-W.y, W.x);
  float y = position.y*112.0 - 2.0;
  float lat = -106.5 + position.x*820.0, s = uSfEdge + position.z + y/uSfLean;
  vWp = vec3(X.x*lat + W.x*s, y, X.y*lat + W.y*s);
  vUv = vec3(position.x + 0.5, position.y, position.z);
  gl_Position = projectionMatrix*viewMatrix*vec4(vWp, 1.0);
}`,fragmentShader:`
uniform vec3 uSnowC; uniform float uTime, uCurtain; uniform vec2 uWind;
${tt}
${Ue}
${Kt}
varying vec3 vWp; varying vec3 vUv;
void main(){
  float u = vUv.x*820.0, y = vWp.y, id = vUv.z;
  vec2 X = vec2(-uWind.y, uWind.x);
  float lat = dot(vWp.xz, X);
  // height above the ragged face (the two broad terms of sfFogRay's raggedness): > 0 in the clear air behind the wall
  float rag = (sfVN(vec2(lat*0.011, y*0.016 + 3.0)) - 0.5)*26.0 + (sfVN(vec2(lat*0.045 + 7.0, y*0.06)) - 0.5)*10.0
            + (sfVN(vec2(lat*0.024 + 1.7, y*0.033 + 9.0)) - 0.5)*15.0;
  float hh = uSfLean*(rag - id);
  float near = smoothstep(-16.0, -3.0, hh)*(1.0 - smoothstep(3.0, 20.0, hh));
  // soft hanging rags, torn along their length and drifting down
  float n = sfVN(vec2(u*0.028 + id*1.3 + y*0.02, y*0.016 - uTime*0.03));
  float st = sfVN(vec2(u*0.085 + id*0.5 + y*0.05, y*0.03 - uTime*0.06));
  float st2 = sfVN(vec2(u*0.24 + id*2.1 + y*0.12, y*0.06 - uTime*0.1));
  float a = smoothstep(0.4, 0.9, n*0.72 + st*0.38 + st2*0.06)*near;
  // torn: no rag is wider than about fifteen metres, and each is broken along its fall
  a *= smoothstep(0.34, 0.62, sfVN(vec2(u*0.07 + id*3.7, y*0.05 - uTime*0.02)));
  // only a few separate rags hang off the wall: broad stretches of every sheet are empty
  a *= smoothstep(0.46, 0.7, sfVN(vec2(u*0.0075 + id*0.61, y*0.011 + id*0.3)));
  float topE = uSfTop - 23.0 + 30.0*sfVN(vec2(lat*0.012, 11.0)) + 14.0*sfVN(vec2(lat*0.05, 4.0));
  a *= 1.0 - smoothstep(topE - 22.0, topE, y);
  a *= smoothstep(0.0, 0.12, vUv.x)*(1.0 - smoothstep(0.88, 1.0, vUv.x))*smoothstep(5.0, 17.0, y);   // none over the plain at the wall's foot: there a rag is only a smear
  float dist = length(cameraPosition - vWp);
  vec3 Vc = (cameraPosition - vWp)/max(dist, 1e-3);
  a *= smoothstep(12.0, 45.0, dist)*(1.0 - smoothstep(170.0, 330.0, dist))*smoothstep(0.5, 0.82, abs(dot(Vc, normalize(vec3(uWind.x, -1.0/uSfLean, uWind.y)))))*uCurtain*0.1;
  if (a < 0.004) discard;
  float hk = clamp(y/max(topE, 1.0), 0.0, 1.0);
  vec3 col = snowLit(0.2 + 0.5*hk)*0.85 + uRimCol*(0.08 + 0.26*smoothstep(0.45, 0.95, hk));
  col = min(wGrade(col), vec3(0.9));
  vec4 f = sfFogRay(cameraPosition, vWp, 1.0);
  gl_FragColor = vec4(mix(col, f.rgb, f.a*0.85), a);
}`}),n=new e.Mesh(t,m);return n.frustumCulled=!1,n.renderOrder=5,n.name="snow-curtain",n}function I0(o,s,d,u){const t=new e.InstancedBufferGeometry,m=[],n=[],f=12;for(let M=0;M<=f;M++)m.push(-.5,M/f,0,.5,M/f,0);for(let M=0;M<f;M++){const F=M*2;n.push(F,F+1,F+3,F,F+3,F+2)}t.setAttribute("position",new e.Float32BufferAttribute(m,3)),t.setIndex(n);const a=new Float32Array(u*8),r=new Float32Array(u*8),S=[-22,21,-150,-112,-78,-50,53,86];let p=0;for(let M=0;M<u;M++){let F=S[M%S.length]+(M<2?o.range(-1.5,1.5):o.range(-9,9));for(let y=0;y<6;y++){const A=d(F+2),B=d(F-2),I=d(F);A>I&&A>=B?F+=2:B>I&&(F-=2)}Math.abs(F)<19&&(F=(F<0?-1:1)*20);const O=d(F);O<12||(a[p*4]=me.x0-me.k*F*F-o.range(2.5,4.5),a[p*4+1]=O,a[p*4+2]=me.zN+F,a[p*4+3]=o.range(9,14),r[p*4]=o(),r[p*4+1]=o.range(.6,1),r[p*4+2]=o.range(.7,1.3),r[p*4+3]=0,p++)}for(let M=0,F=Math.min(p,2);M<F;M++)a[p*4]=a[M*4]+6,a[p*4+1]=a[M*4+1],a[p*4+2]=a[M*4+2],a[p*4+3]=a[M*4+3],r[p*4]=r[M*4]*7.31%1,r[p*4+1]=r[M*4+1]*3.17%1,r[p*4+2]=M===0?.45:1,r[p*4+3]=1,p++;t.setAttribute("aV",new e.InstancedBufferAttribute(a,4)),t.setAttribute("aR",new e.InstancedBufferAttribute(r,4)),t.instanceCount=p;const C=new e.ShaderMaterial({uniforms:s,transparent:!0,depthWrite:!1,side:e.DoubleSide,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,vertexShader:`
attribute vec4 aV, aR; uniform float uTime;
varying vec3 vWp; varying vec4 vU; varying float vK;
void main(){
  // aR.w = 0: a veil hanging down the face from the lip.  aR.w = 1: a wisp of spindrift that leaves the crest and is
  // drawn out downwind (to the right as the camera sees it) as a banner: it lifts a few metres, levels off, frays and dissolves
  float f = position.y, out2 = (1.0 - f)*(1.0 - f);
  vec3 veil = vec3(aV.x - 2.0 - 5.0*out2 + sin(uTime*0.2 + aR.x*30.0 + f*2.0)*0.8, f*aV.y, aV.z + position.x*aV.w*(0.55 + 0.45*f) + 4.0*out2*(aR.y - 0.3));
  // (a plume, not a thread: two metres thick where it leaves the crest and eight to ten further out, and never
  // thinner than a few pixels however far off it is seen)
  float len = (13.0 + 7.0*aR.y)*mix(0.7, 1.0, aR.z);
  vec3 root = vec3(aV.x - 1.0 + 5.0*f, aV.y - 0.8 + (2.0 + 2.0*aR.x)*(1.0 - exp(-2.2*f)) + 1.0*f*sin(uTime*0.5 + aR.x*40.0 + f*6.0), aV.z - 0.5 + len*f);
  float thick = max((2.6 + 6.5*f)*(0.75 + 0.5*aR.y)*mix(0.7, 1.0, aR.z), length(cameraPosition - root)*0.012);
  vec3 wisp = root + vec3(0.0, position.x*thick*(1.0 + 0.4*position.x), 0.0);
  vWp = mix(veil, wisp, aR.w); vK = aR.w;
  vU = vec4(position.x, position.y, aR.x, aV.y);
  gl_Position = projectionMatrix*viewMatrix*vec4(vWp, 1.0);
}`,fragmentShader:`
uniform float uTime, uVeil;
${tt}
${Ue}
varying vec3 vWp; varying vec4 vU; varying float vK;
void main(){
  float y = vWp.y, zz = vWp.z, top = vU.w;
  float px = length(fwidth(vWp));
  float fall = uTime*5.5;
  float n = sfVN(vec2(zz*0.22 + vU.z*30.0, (y + fall)*0.07)), n2 = sfVN(vec2(zz*0.9 + vU.z*11.0, (y + fall*1.3)*0.16));
  float body = smoothstep(0.3, 0.8, n*0.7 + n2*0.45);
  // the veil is thickest in the top two fifths of the face and is gone before the lip; below it only a thin tail
  float plume = smoothstep(top*0.8, top*0.95, y)*(1.0 - smoothstep(0.84, 0.99, vU.y));
  float ex = clamp(1.0 - 4.0*vU.x*vU.x, 0.0, 1.0);
  float tail = 0.0;   // (no tail down the face: against the dark ice it read as a pale ray drawn over the cliff)
  float a = body*(ex*ex*plume + tail*(1.0 - plume))*smoothstep(0.02, 0.2, vU.y)*uVeil;
  // the wisp: streaks drawn along its length, streaming away from the crest, torn, fading out well before its end
  float t = vU.y;
  // (both edges feathered and eaten by the same scrolling noise that tears its body; brightest at the crest)
  float w1 = sfVN(vec2(t*3.4 - uTime*0.45 + vU.z*30.0, vU.x*2.6 + vU.z*7.0)), w2 = sfVN(vec2(t*5.0 - uTime*0.95 + vU.z*11.0, vU.x*13.0 + 3.0));
  float aw = smoothstep(0.25, 0.85, w1*0.6 + w2*0.5 + 0.25*ex)*ex*ex*smoothstep(0.0, 0.12, t)*(1.0 - t)*(1.0 - t)*uVeil*1.2;
  a = mix(a, aw, vK); plume = mix(plume, 0.6, vK);
  vec2 gc = vec2(zz, y + fall*0.8)*2.4; vec2 gi = floor(gc);
  float gh = sfHash(gi + vU.z*57.0);
  vec2 gj = vec2(sfHash(gi + 3.1), sfHash(gi + 9.7))*0.6 + 0.2;
  float spark = step(0.925, gh)*(1.0 - smoothstep(0.03, 0.14, length(fract(gc) - gj)))*(0.5 + 0.5*sin(uTime*5.0 + gh*200.0));
  spark *= (1.0 - smoothstep(0.05, 0.2, px))*ex*ex*(1.0 - smoothstep(top*0.98, top*1.08, y))*uVeil*(1.0 - vK);
  vec3 col = wGrade(uRimCol*(0.62 + 0.4*plume) + uSkyCol*0.4);
  float al = clamp(a*0.2 + spark*0.8, 0.0, 1.0);
  al *= smoothstep(22.0, 85.0, length(cameraPosition - vWp))*mix(1.0, 0.5, step(-220.0, zz)*(1.0 - vK));
  if (al < 0.004) discard;
  // laid over what is behind it more than it covers it (premultiplied, a third of its own cover), so a plume
  // brightens the ice and never darkens a cloud
  gl_FragColor = vec4(sfApply(col + wGrade(uRimCol)*spark*1.6, vWp)*al, al*0.35);
}`}),w=new e.Mesh(t,C);return w.frustumCulled=!1,w.renderOrder=3,w.name="spindrift-veils",w}const r0=`
${tt}
${Ue}
varying vec3 vWp, vN, vL; varying float vC;
// a SHADED bird, never a white blade: every facet takes its own light (the wing is bent at the wrist, so its two
// halves differ), the underwing is grey, the flight feathers along the trailing edge and the tips are darker, the
// bill and the eye are black
void main(){
  vec3 up = normalize(vN + vec3(0.0, 1e-4, 0.0));
  vec3 V = normalize(cameraPosition - vWp + vec3(0.0, 1e-4, 0.0));
  vec3 N = normalize(cross(dFdx(vWp), dFdy(vWp)) + up*1e-6);
  if (dot(N, V) < 0.0) N = -N;
  float under = 1.0 - smoothstep(-0.2, 0.2, dot(N, up));
  float w = clamp(abs(vL.x)/0.58, 0.0, 1.0), wing = smoothstep(0.05, 0.12, abs(vL.x));
  vec3 alb = vec3(0.8, 0.8, 0.83);
  alb *= mix(1.0, 0.56, under*wing);                                       // the underwing in its own shade
  alb *= 1.0 - 0.34*wing*(1.0 - smoothstep(-0.05, 0.0, vL.z - 0.06*w));    // flight feathers
  alb *= 1.0 - 0.3*smoothstep(0.72, 1.0, w);
  alb *= 1.0 - 0.22*(1.0 - wing)*(1.0 - smoothstep(-0.04, 0.0, vL.y));             // the belly
  alb = mix(alb, vec3(0.03), smoothstep(0.55, 0.9, vC));
  alb = mix(alb, vec3(0.02), 1.0 - smoothstep(0.011, 0.02, length(vec3(abs(vL.x) - 0.04, vL.y - 0.026, vL.z - 0.105))));
  float kd = clamp(dot(N, uKeyDir)*0.5 + 0.5, 0.0, 1.0);
  vec3 col = alb*(mix(uGroundCol*1.5, uSkyCol*1.2, N.y*0.5 + 0.5) + uKeyCol*0.8*kd)*mix(0.55, 1.0, kd);
  col += alb*uMoonCol*max(dot(N, uMoonDir), 0.0)*1.2;
  col *= 1.12/(1.0 + dot(col, vec3(0.3, 0.55, 0.15)));                      // white with form: nothing on it burns out
  gl_FragColor = vec4(sfApply(wGrade(col), vWp), 1.0);
}`,c0=`
  float w = abs(aW);
  vec3 q = position; q.y += 0.27*w*(1.62 - w) + flap*0.34*w*w;      // a gull's M: the arm rises 30 degrees to the wrist, the hand lies level, and beats
`;function f0(){const o=[],s=[],d=[],u=[],t=(w,M,F,O,y)=>(o.push(w,M,F),s.push(O),d.push(y),o.length/3-1),m=t(0,0,.2,1,0),n=t(0,.005,-.25,0,0),f=[t(.07,0,.06,0,0),t(0,.07,.05,0,0),t(-.07,0,.06,0,0),t(0,-.066,.05,0,0)],a=[t(.058,0,-.08,0,0),t(0,.056,-.08,0,0),t(-.058,0,-.08,0,0),t(0,-.05,-.08,0,0)];for(let w=0;w<4;w++){const M=(w+1)%4;u.push(f[w],f[M],m,f[M],f[w],a[w],f[M],a[w],a[M],a[M],a[w],n)}const r=t(.08,.006,-.31,0,0),S=t(-.08,.006,-.31,0,0),p=t(0,.02,-.12,0,0);u.push(p,r,S);for(const w of[1,-1]){const M=t(w*.04,.02,.1,0,0),F=t(w*.04,.02,-.085,0,0),O=t(w*.27,.02,.135,0,w*.48),y=t(w*.27,.02,-.035,0,w*.48),A=t(w*.43,.02,.085,0,w*.76),B=t(w*.42,.02,-.03,0,w*.76),I=t(w*.58,.02,-.035,.35,w);u.push(M,O,F,F,O,y,O,A,y,y,A,B,A,I,B)}const C=new e.InstancedBufferGeometry;return C.setAttribute("position",new e.Float32BufferAttribute(o,3)),C.setAttribute("aCol",new e.Float32BufferAttribute(s,1)),C.setAttribute("aW",new e.Float32BufferAttribute(d,1)),C.setIndex(u),C}function _0(o,s){const d=f0(),u=s.length,t=new Float32Array(u*4),m=new Float32Array(u*4);s.forEach((a,r)=>{t.set([a[0],a[1],a[2],a[3]],r*4),m.set([a[4],a[5],a[6],.13+.61*(r*.618%1)],r*4)}),d.setAttribute("aO",new e.InstancedBufferAttribute(t,4)),d.setAttribute("aP",new e.InstancedBufferAttribute(m,4)),d.instanceCount=u;const n=new e.ShaderMaterial({uniforms:o,side:e.DoubleSide,vertexShader:`
attribute vec4 aO, aP; attribute float aCol, aW; uniform float uTime, uPassT;
varying vec3 vWp, vN, vL; varying float vC;
void main(){
  float dtm = uPassT - aO.w, ph = aP.w*40.0;
  vec3 vel = aP.xyz; float sp = max(length(vel), 1e-3);
  vec3 fw = vel/sp, rt = normalize(vec3(-fw.z, 0.0, fw.x) + vec3(1e-4, 0.0, 0.0)), up = cross(rt, fw);
  float wv = sin(uTime*0.9 + ph), wv2 = sin(uTime*1.3 + ph*1.7);
  vec3 c = aO.xyz + vel*dtm + rt*wv*1.1 + up*wv2*0.55;
  float glide = smoothstep(-0.2, 0.6, sin(uTime*0.7 + ph*2.3));
  float flap = sin(uTime*(8.0 + 2.0*fract(ph*0.31)) + ph)*(0.6 + 0.4*glide);
${c0}
  // it banks its back toward a lens that is level with it or above it (a wing seen along its own plane is a scratch)
  vec3 vd = normalize(cameraPosition - c + vec3(0.0, 1e-4, 0.0));
  float bank = 0.25 + 0.35*sin(uTime*0.9 + ph) - 0.6*dot(rt, vd)*smoothstep(-0.45, 0.05, dot(up, vd)), cb = cos(bank), sb = sin(bank);
  q.xy = vec2(q.x*cb - q.y*sb, q.x*sb + q.y*cb);
  // (gone before it comes and once it is a speck over the horn: it shrinks to nothing, far from the lens)
  float sc = 2.0*smoothstep(-3.0, -2.2, dtm)*(1.0 - smoothstep(5.2, 6.6, dtm));
  vec3 wp = c + (rt*q.x + up*q.y + fw*q.z)*sc;
  vWp = wp; vC = aCol; vL = position; vN = normalize(up*cb - rt*sb);
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,fragmentShader:r0}),f=new e.Mesh(d,n);return f.frustumCulled=!1,f.name="petrel-pass",f}function U0(o,s,d){const u=f0(),t=new Float32Array(d*4),m=new Float32Array(d*4);for(let a=0;a<d;a++){const r=a%2===0,S=(r?1:-1)*o.range(21,26),p=me.zN+S;t[a*4]=me.x0+o.range(-7,5),t[a*4+1]=o.range(44,60),t[a*4+2]=p,t[a*4+3]=o.range(5,9.5),m[a*4]=o()*6.283,m[a*4+1]=o.sign()*o.range(.55,.9),m[a*4+2]=o.range(1,3.5),m[a*4+3]=o.range(1.9,2.4)}u.setAttribute("aO",new e.InstancedBufferAttribute(t,4)),u.setAttribute("aP",new e.InstancedBufferAttribute(m,4)),u.instanceCount=d;const n=new e.ShaderMaterial({uniforms:s,side:e.DoubleSide,vertexShader:`
attribute vec4 aO, aP; attribute float aCol, aW; uniform float uTime;
varying vec3 vWp, vN, vL; varying float vC;
void main(){
  float a = aP.x + uTime*aP.y;
  vec3 c = aO.xyz + vec3(cos(a)*aO.w, sin(a*0.7 + aP.x*3.0)*aP.z, sin(a)*aO.w*0.8);
  float sg = aP.y < 0.0 ? -1.0 : 1.0;
  vec2 f = normalize(vec2(-sin(a)*aO.w, cos(a)*aO.w*0.8))*sg;
  float flap = sin(uTime*(7.0 + 2.0*fract(aP.x*3.1)) + aP.x*20.0)*(0.3 + 0.7*smoothstep(-0.3, 0.5, sin(uTime*0.55 + aP.x*11.0)));
${c0}
  float bank = 0.5*sg, cb = cos(bank), sb = sin(bank);
  q.xy = vec2(q.x*cb - q.y*sb, q.x*sb + q.y*cb);
  vec3 fw = vec3(f.x, 0.0, f.y), rt = vec3(-f.y, 0.0, f.x);
  vec3 wp = c + (rt*q.x + vec3(0.0, 1.0, 0.0)*q.y + fw*q.z)*aP.w;
  vWp = wp; vC = aCol; vL = position; vN = normalize(vec3(-sb*rt.x, cb, -sb*rt.z));
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,fragmentShader:r0}),f=new e.Mesh(u,n);return f.frustumCulled=!1,f.name="snow-petrels",f}var Y0={id:"emperor-clearing",name:"The Huddle",category:"ocean",weirdness:.1,media:["air","snow"],async build(o){const s=o.rng,d=o.noise,u=o.vary||{},t=Fe(o.quality?.detail??1,.5,1),m=Fe(u.density??1,.7,1.3),n=(i,c=1)=>new e.Color(i).multiplyScalar(c),f=s.fork("moods"),a=f(),r={cloud:f.pick(["scales","sheet","train","train"]),hour:u.hour==="night"?"deep":u.hour&&u.hour!=="any"?"bright":f.chance(.5)?"deep":"bright",storm:f.pick(["blizzard","blizzard","snowfall","rime"]),season:a<.5?"august":a<.8?"september":"july",berg:f.chance(.62)?"tabular":"overturned",rare:!!u.rare},S=r.hour==="deep",p={blizzard:{dense:.036,colA:"#56527E",colB:"#C4C2D8",sat:.55,snake:1,stream:1},snowfall:{dense:.032,colA:"#514E78",colB:"#BDBBD2",sat:.55,snake:.6,stream:.55},rime:{dense:.044,colA:"#4E5A84",colB:"#B4C4E0",sat:.6,snake:.45,stream:.4}}[r.storm],C=new e.Scene;C.background=new e.Color("#2a2940"),await o.yield();const w=x0(o0(r.season==="july"));await o.yield();const M=25,F={value:0},O=St(50),y={uSfEdge:{value:a0-420},uSfLean:{value:1.5},uSfDense:{value:p.dense},uSfHaze:{value:.0012},uSfTime:F,uSfTop:{value:58},uSfThin:{value:.15},uSfHs:{value:10},uSfWall:{value:0},uMoonDir:{value:S0.clone()},uMoonCol:{value:n("#FFB878",.42)},uSfGlow:{value:new e.Color(0,0,0)},uSfGlowDir:{value:new e.Vector3(.45,.17,-.87).normalize()},uSfColA:{value:n(p.colA)},uSfColB:{value:n(p.colB)},uSfHazeCol:{value:n("#6F6C96",S?.6:.95)},uSfKey:{value:new e.Vector2(O[0],O[1])}},A=y.uMoonCol.value.clone(),B=n("#BFEBD9",.26).lerp(n("#F3A6C8",.26),.38),I=n(p.colA),Y=n(p.colB),le=n("#474C72",S?.66:.88),U=n("#D9D2E2",S?.6:.72),te=await b0(o,{palette:_e,season:r.season,duration:Je,ground:!1,rareBreak:r.rare,fog:{uniforms:y,parsVertex:"",vertex:"",parsFragment:Ue,fragment:"gl_FragColor.rgb = sfApply(gl_FragColor.rgb, vWp);"}});te.object.position.copy(ee),C.add(te.object);const x=te.uniforms;x.uEcMoonDir=y.uMoonDir,x.uEcMoonCol=y.uMoonCol,await o.yield();const X={uFlow:{value:0},uCalm:{value:0},uSnake:{value:1},uStream:{value:1},uCurtain:{value:1},uVeil:{value:0},uCover:{value:1},uPassT:{value:0},uTime:F},pe=Object.assign({uSnowC:{value:n(_e[2],.8)},uWind:{value:new e.Vector2(E[0],E[1])},uKeyDir:x.uKeyDir,uKeyCol:x.uKeyCol,uSkyCol:x.uSkyCol,uGroundCol:x.uGroundCol,uRimCol:x.uRimCol,uSat:x.uSat},X,y),J=[-E[0],-E[1]],ie=Math.atan2(J[0],J[1]),ve=.2,H=s.fork("cast"),ce=[],Ge=(i,c,b,W,g,ae=1,K=!1,G=J)=>{for(let j=0;j<b;j++){const Se=(g?-1:1)*j*ae*H.range(.85,1.2);ce.push({wx:i+G[0]*Se+H.range(-.15,.15),wz:c+G[1]*Se+H.range(-.1,.1),yaw:ie+H.range(-.3,.3),scale:H.range(.93,1.07),lean:.26+H.range(-.06,.06),walk:1,tPass:W,under:K})}};Ge(-2.6,-19.6,3,1,!1);const Q=new e.Vector3,$=new e.Vector3;[[3.36,6.6,2.35,3,!0,1],[6.72,13.5,5.2,5,!0,1.25],[8.3,0,-3.4,2,!1,1],[9.4,0,2.6,3,!0,1],[10.5,4.9,-2.35,4,!1,2,1],[12.3,0,3.2,3,!0,1],[13.15,0,-3.1,2,!1,1]].forEach(([i,c,b,W,g,ae,K])=>{w.pointAt(i/Je,Q),w.tangentAt(i/Je,$),$.y=0,$.normalize(),Ge(Q.x+$.x*c-$.z*b,Q.z+$.z*c+$.x*b,W,i,g,ae,!1,K?[$.x,$.z]:J)}),r.season==="july"&&(w.pointAt(14.28/Je,Q),Ge(Q.x+.5,Q.z-11,4,14.28,!1,2.5,!0));const qe=[];if(r.season==="july"){const i=s.fork("latecomers");for(let c=0;c<64;c++){const b=(c+i.range(0,.8))/64,W=_(49,23.5,b),g=_(5.6,3.2,b)+i.range(-1.15,1.15)+.9*Math.sin(W*.31);qe.push({x:g,z:W,yaw:Math.PI+i.range(-.25,.25),scale:i.range(.93,1.07),lean:.1+i.range(-.03,.05),walk:1})}}let st=0;for(;ce.length<40&&st++<300;){const i=H.range(-150,-30),c=H.range(-15,15),b=w.nearestXZ(c,i);b.dist<4.5||b.dist>13||ce.some(W=>Math.hypot(W.wx-c,W.wz-i)<6)||Ge(c,i,Math.min(H.int(2,5),40-ce.length),b.u*Je,c>0)}const ut=[];for(const i of ce){const c=w.nearestXZ(i.wx,i.wz);!i.under&&c.dist<2&&(w.pointAt(c.u,Q),i.wx+=(i.wx>=Q.x?1:-1)*(2.05-c.dist)),ut.push([i.wx,i.wz],[i.wx-J[0]*ve*15,i.wz-J[1]*ve*15]),i.x=i.wx-J[0]*ve*Math.min(i.tPass,15)-ee.x,i.z=i.wz-J[1]*ve*Math.min(i.tPass,15)-ee.z}await o.yield();const N=te.makeBirds(ce,0);N.name="stragglers",te.object.add(N);const R=qe.length?te.makeBirds(qe,0):null;R&&(R.name="latecomers",te.object.add(R)),await o.yield();const re=await F0(o,s.fork("ground"),d,w,x,y,X,ut);C.add(re.object),await o.yield();const l=D0(x,y,F,r),h=await G0(o,d,r,l);C.add(h.object),await o.yield();const k=await E0(o,s.fork("blocks"),w,l,h.topAt,m);C.add(k.object),await o.yield();const D=s.fork("walkers"),Z=[],se=[],fe=10,we=Math.round(150*m);for(let i=0;i<fe;i++){const c=St(_(66,150,(i+D.range(.15,.85))/fe));let b=30;for(;b<150&&Wt(ee.z+c[1]*b)-(ee.x+c[0]*b)>17;)b+=2;Z.push({dx:c[0],dz:c[1],r0:16.5,L:b-16.5,tob:r.season==="september"?D.chance(.5):D.chance(.25),dirn:D.chance(.72)?1:-1})}for(let i=0;i<we;i++){const c=Z[i%fe],b=Math.floor(i/fe/4);se.push({f:c,off:(b*.37+D.range(0,.1))*c.L+i%4*1.4,lat:D.range(-.35,.35),s:D.range(.93,1.07),x:0,z:0,yaw:0,scale:1,lean:c.tob?1.38:.1,walk:c.tob?0:1,headUp:1})}const xe=te.makeBirds(se,2);xe.name="walkers",te.object.add(xe);{const i=s.fork("foreground"),c=[];let b=0;for(;c.length<20&&b++<700;){const ne=i.range(.8,.905),de=i.sign()*i.range(7.5,20),ue=i.range(2.2,4.9),Re=i.range(.7,1.2),Pe=i.range(.5,.8),He=i.range(0,Math.PI*2),At=i.range(.15,.6),Ft=i.range(-.3,.3);w.pointAt(ne,Q),w.tangentAt(ne,$),$.y=0,$.normalize();const et=Q.x-$.z*de,ft=Q.z+$.x*de,T=et-ee.x,Ae=ft-ee.z;w.nearestXZ(et,ft).dist<7.5||Wt(ft)-et<16||c.some(ge=>Math.hypot(ge.x-et,ge.z-ft)<5.5)||Z.some(ge=>T*ge.dx+Ae*ge.dz>10&&Math.abs(T*ge.dz-Ae*ge.dx)<3.2)||c.push({x:et,z:ft,h:ue,w:ue*Re,t:Pe*(.55+.45*ue),yaw:He,tilt:At,roll:Ft})}const W=k.object.children[0],g=new e.InstancedMesh(W.geometry,W.material,Math.max(c.length,1)),ae=new e.Matrix4,K=new e.Quaternion,G=new e.Euler,j=new e.Vector3,Se=new e.Vector3;c.forEach((ne,de)=>{G.set(ne.tilt,ne.yaw,ne.roll,"YXZ"),K.setFromEuler(G),j.set(ne.w,ne.h,ne.t),Se.set(ne.x,-.1,ne.z),g.setMatrixAt(de,ae.compose(Se,K,j))}),g.count=c.length,g.instanceMatrix.needsUpdate=!0,g.frustumCulled=!1,g.name="foreground-ice",C.add(g)}const L=xe.geometry.getAttribute("aInst");L.setUsage(e.DynamicDrawUsage);const he=i=>{const c=L.array;for(let b=0;b<se.length;b++){const W=se[b],g=W.f,ae=g.tob?1.7:.42;let K=(W.off+i*ae*g.dirn)%g.L;K<0&&(K+=g.L);const G=g.r0+K,j=b*4;c[j]=g.dx*G-g.dz*W.lat,c[j+1]=g.dz*G+g.dx*W.lat,c[j+2]=Math.atan2(g.dx*g.dirn,g.dz*g.dirn),c[j+3]=W.s*v(0,2.5,K)*v(0,2.5,g.L-K)}L.needsUpdate=!0};he(0),await o.yield();const ye=V0(s.fork("sky"),r,y,F,{uFlow:X.uFlow,uSnake:X.uSnake,uSnowC:pe.uSnowC,uSkyCol:x.uSkyCol,uGroundCol:x.uGroundCol,uKeyCol:x.uKeyCol,uSat:x.uSat});C.add(ye.object);const oe=ye.uniforms,z=oe.uZenith.value.clone(),V=oe.uMid.value.clone(),q=n(S?"#14103A":"#1A1546"),P=n(S?"#251B50":"#30256A"),Me=oe.uVivid.value,be=S?1.2:1;C.add(O0(pe)),await o.yield(),C.add(j0(s.fork("streamers"),pe,Math.round(40*Math.max(t,.75)))),await o.yield();const Ce=H0(pe);C.add(Ce),C.add(I0(s.fork("veils"),pe,h.topAt,8)),C.add(U0(s.fork("petrels"),pe,16)),await o.yield();const ze=r.storm==="snowfall",Ve=t0.makeParticles({rng:s.fork("blow"),count:Math.round((r.storm==="rime"?3200:6e3)*t*m),box:[64,26,64],time:F,fog:!1,mode:ze?"billboard":"streak",shape:ze?"flake":"streak",stretch:.06,velocity:ze?[5.5,-3.2,9.5]:[E[0]*20,-.5,E[1]*20],velocityRandom:ze?[2.5,1.2,2.5]:[3,1.4,3],turbulence:[.7,.3,.6],size:ze?[.06,.17]:[.03,.075],colors:["#c8c7d6","#e2e1ec","#a9a7bb"],intensity:.8,opacity:.85,additive:.1,near:[.6,3]});C.add(Ve.object),await o.yield();const Ee=t0.makeParticles({rng:s.fork("glitter"),preset:"snow",count:Math.round(5600*t*m),box:[80,50,80],time:F,fog:!1,shape:"sparkle",velocity:[.15,-.8,.25],velocityRandom:[.25,.3,.25],turbulence:[.3,.1,.5],size:[.008,.021],twinkle:.7,colors:["#f4ecf6","#f3c9dc","#c6efe0"],intensity:2.6,opacity:.9,additive:.8,near:[5,12]});Ee.setOpacity(0),C.add(Ee.object),await o.yield();{const i=Math.ceil(w.length/.5),c=50,b=new Float32Array(c+i+1),W=new Float32Array(c+i+1),g=new Float32Array(c+i+1);w.pointAt(0,Q),w.tangentAt(0,$),$.y=0,$.normalize();for(let T=0;T<c;T++)b[T]=Q.x-$.x*(c-T)*.5,W[T]=Q.y,g[T]=Q.z-$.z*(c-T)*.5;for(let T=0;T<=i;T++)T%200===0&&await o.yield(),w.posAtDist(Math.min(T*.5,w.length),Q),b[c+T]=Q.x,W[c+T]=Q.y,g[c+T]=Q.z;const ae={dist:0,y:0},K=(T,Ae)=>{let ge=1/0,Ie=0;for(let Be=0;Be<b.length;Be+=8){const ht=b[Be]-T,Le=g[Be]-Ae,Ze=ht*ht+Le*Le;Ze<ge&&(ge=Ze,Ie=Be)}for(let Be=Math.max(Ie-8,0),ht=Math.min(Ie+8,b.length-1);Be<=ht;Be++){const Le=b[Be]-T,Ze=g[Be]-Ae,gt=Le*Le+Ze*Ze;gt<ge&&(ge=gt,Ie=Be)}return ae.dist=Math.sqrt(ge),ae.y=W[Ie],ae},G=o0(r.season==="july"),j=G.findIndex(T=>T[2]===Tt),Se=G.slice(j+1,j+4),ne=x.uHud.value,de=x.uTailSeg.value,ue=ne.y>.5,Re=(T,Ae)=>{const ge=T-ee.x,Ie=Ae-ee.z;let Be=Math.hypot(ge,Ie)-ne.x;if(ue){const Le=de.z-de.x,Ze=de.w-de.y,gt=Fe(((ge-de.x)*Le+(Ie-de.y)*Ze)/(Le*Le+Ze*Ze),0,1);Be=Math.min(Be,Math.hypot(ge-de.x-Le*gt,Ie-de.y-Ze*gt)-_(ne.z,1.1,gt))}let ht=v(12,18,Be);if(r.rare){let Le=Math.hypot(ge,Ie)-1.6*(ne.x+4.5);ue&&(Le=Math.min(Le,at(ge,Ie,de.x,de.y,1.6*de.z,1.6*de.w)-(2*ne.z+1))),ht*=v(4,10,Le)}return ht},Pe=[],He=r.rare?1.6:1;for(const T of ce){const Ae=T.x+ee.x,ge=T.z+ee.z;Pe.push([Ae,ge,Ae+J[0]*ve*15,ge+J[1]*ve*15,0])}for(const T of qe)Pe.push([ee.x+T.x,ee.z+T.z-.12*(Je-29.4),ee.x+T.x*He,ee.z+T.z*He+.12*29.4,r.rare?.7:0]);for(const T of Z)Pe.push([ee.x+T.dx*8,ee.z+T.dz*8,ee.x+T.dx*(T.r0+T.L)*He,ee.z+T.dz*(T.r0+T.L)*He,.35*He]);const At=k.list.slice(0,20).map(T=>({x:T.x,z:T.z,w:T.w})),Ft=C.getObjectByName("foreground-ice"),et=new e.Matrix4;for(let T=0;T<Ft.count;T++){Ft.getMatrixAt(T,et);const Ae=et.elements;At.push({x:Ae[12],z:Ae[14],w:Math.hypot(Ae[0],Ae[1],Ae[2])})}await o.yield();const ft=await B0(o,s.fork("sastrugi"),re,{near:K,leg:Se,colony:Re,walks:Pe,solids:At},x,y,{uCalm:X.uCalm});C.add(ft.object)}await o.yield();const Ne=new e.Mesh(new e.CircleGeometry(20,32),new e.ShaderMaterial({uniforms:Object.assign({uPortal:{value:Mt},uCover:X.uCover},y),transparent:!0,depthWrite:!0,vertexShader:`varying vec3 vWp; varying vec2 vL;
void main(){ vL = position.xy/20.0; vec4 wp = modelMatrix*vec4(position, 1.0); vWp = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }`,fragmentShader:`uniform vec3 uPortal; uniform float uCover;
${Ue}
varying vec3 vWp; varying vec2 vL;
void main(){
  vec3 dv = vWp - cameraPosition; float dl = max(length(dv), 1e-3);
  vec4 f = sfFogRay(cameraPosition, cameraPosition + dv*(length(uPortal - cameraPosition)/dl), 0.0);
  float nz = sfVN(vWp.yz*0.8 + vWp.x*0.6);
  float a = smoothstep(0.12, 0.92, f.a + 0.3*(nz - 0.5)*smoothstep(0.3, 0.6, f.a))*(1.0 - smoothstep(0.45, 0.62, length(vL)));
  a = max(a, uCover*0.72*(1.0 - smoothstep(0.2, 0.6, length(vL))));   // while it blows the ring is only a soft glow in the notch
  if (a < 0.03) discard;
  gl_FragColor = vec4(f.rgb, a);
}`}));Ne.renderOrder=6,Ne.frustumCulled=!1,Ne.name="portal-fog-patch",C.add(Ne);const nt=new e.Vector3(0,0,1),lt=new e.Vector3(0,1,0),Ke=new e.HemisphereLight("#8E8CA6","#23233A",1),it=new e.DirectionalLight("#E9D8F0",.4);it.position.set(O[0]*50,24,O[1]*50),C.add(Ke,it);const rt=.8,Oe=new e.Vector3,Xe=new e.Vector3,je=new e.Vector3,ke=new e.Vector3,yt=new e.Vector3,Ye=new e.Vector3(ee.x+10,8,ee.z+4),Bt=new e.Vector3,h0=new e.Vector3(Wt(ee.z-36)+2,40,ee.z-36),xt=Math.PI*2,Ct=(i,c)=>{const b=Math.atan2(je.x,-je.z),W=Math.asin(Fe(je.y,-1,1)),g=Math.atan2(ke.x,-ke.z),ae=Math.asin(Fe(ke.y,-1,1));let K=g-b;K-=xt*Math.floor(K/xt),!c&&K>Math.PI&&(K-=xt);const G=b+K*i,j=W+(ae-W)*i,Se=Math.cos(j);je.set(Math.sin(G)*Se,Math.sin(j),-Math.cos(G)*Se)},Rt=i=>{const c=i*Je,b=i*w.length;w.posAtDist(b,Oe),w.posAtDist(b+M,Xe),Xe.sub(Oe).normalize(),je.copy(Xe);const W=v(4.3,6.3,c)*(1-v(7.4,9.4,c));W>0&&(ke.set(.4,.015,-.91).normalize(),je.lerp(ke,W*.92).normalize());const g=(r.season==="july"?v(15.3,17,c):v(14,15.7,c))*(1-v(18.2,21.2,c));g>0&&(ke.copy(Xe),ke.y=0,ke.normalize().multiplyScalar(8.5).add(Oe),ke.y=.9,ke.sub(Oe).normalize(),je.lerp(ke,g).normalize());const ae=v(16.2,21.8,c),K=1-v(27.6,30.2,c);ae>0&&K>0&&(Bt.copy(Ye),Bt.y+=3.2*(1-v(21.2,24.5,c)),ke.copy(Bt).sub(Oe).normalize(),K<1?Ct(K,0):Ct(ae,1));const G=v(27.6,30.2,c)*(1-v(30.6,33.4,c));G>0&&(ke.set(ee.x+74,6,ee.z-6).sub(Oe).normalize(),Ct(G,0));const j=v(30.6,34.2,c);if(j>0){ke.copy(Mt),ke.y-=11*(1-v(37,39,c))+11*v(30.6,33.2,c)*(1-v(34.4,36.6,c));const Se=v(34.4,36.3,c)*(1-v(36.9,39.2,c));ke.lerp(h0,Se).sub(Oe).normalize(),Ct(j*.96,0)}return je},ct=.34,dt=.62,Gt=.143,Et=.8,zt=.35,u0=Math.min(M*3.4,Math.max(M,w.length*.22)),mt=new e.Vector3,pt=new e.Vector3,bt=new e.Vector3,$e=new e.Vector3,vt=new e.Vector3,Qe=new e.Vector3,Vt=new e.Vector3,wt=new e.Vector3,Ot=new e.Vector3,d0=new e.Vector3,kt=(i,c,b,W,g)=>{const ae=c.dot(i),K=b*b-(1-b)*(1-b)*(1-ae*ae);return b<(g?.002:.02)?W.copy(c):K<=0?g?W.copy(c).addScaledVector(i,-ae).normalize():W.copy(c):W.copy(c).multiplyScalar((1-b)*ae+Math.sqrt(K)).addScaledVector(i,-(1-b)).normalize()},jt=i=>v(0,.04,i)*(1-v(.93,.985,i)),m0=i=>{const c=(dt-ct)*Gt;return v(ct,ct+c,i)*(1-v(dt-c,dt,i))},Ht=i=>{const c=i*w.length;w.posAtDist(c,bt),w.posAtDist(c+M,pt),pt.sub(bt).normalize(),w.posAtDist(c+u0,$e),$e.sub(bt).normalize(),$e.y*=.55,$e.normalize()},Pt=i=>Math.atan2(i.x,-i.z),It=i=>{mt.copy(Rt(i)),Ht(i);const c=rt*jt(i);kt(pt,mt,c,Qe,!1),wt.copy($e).multiplyScalar(1-zt*c).addScaledVector(Qe,zt*c).normalize();let b=Pt(wt)-Pt($e);return b-=xt*Math.round(b/xt),[b,Math.asin(Fe(wt.y,-1,1))]},[_t,Ut]=It(ct),[p0,v0]=It(dt);let Xt=-1;const $t=i=>{if(i===Xt)return;Xt=i,mt.copy(Rt(i)),Ht(i);const c=jt(i),b=m0(i)*Et*c,W=rt*c;if(b<.002){vt.copy($e),kt(pt,mt,W,Qe,!1);return}const g=(i-ct)/(dt-ct),ae=Pt($e)+_t+(p0-_t)*g,K=Ut+(v0-Ut)*g,G=Math.cos(K),j=zt*W;wt.set(Math.sin(ae)*G,Math.sin(K),-Math.cos(ae)*G),vt.copy($e);for(let Se=0;Se<4;Se++){Vt.copy(pt).multiplyScalar(1-b).addScaledVector(vt,b).normalize(),kt(Vt,mt,W,Qe,!1);const ne=wt.dot(Qe);Ot.copy(wt).multiplyScalar(j*ne+Math.sqrt(Math.max((1-j)*(1-j)-j*j*(1-ne*ne),0))).addScaledVector(Qe,-j).normalize(),kt($e,Ot,zt*b,vt,!0)}Vt.copy(pt).multiplyScalar(1-b).addScaledVector(vt,b).normalize(),kt(Vt,mt,W,Qe,!1)},w0=[{at:(i,c)=>($t(c),d0.copy(bt).addScaledVector(vt,60)),from:ct,to:dt,fade:Gt,weight:Et},{at:(i,c)=>($t(c),yt.copy(bt).addScaledVector(Qe,60)),from:-1,to:2,weight:rt}];{const i=Math.tan(31*De),c=new e.Vector3,b=new e.Vector3,W=new e.Vector3,g=[];for(const[ae,K,G,j,Se,ne,de,ue]of[[32,-.62,.1,15,36.8,114,50,-250],[32.8,-.8,.25,14,37.6,113,50,-258],[33.5,-.6,-.05,17,38,113,51,-254],[34.3,-.85,.3,15,38.6,113,52,-262],[34.9,-.62,.05,16,39,112,49,-256],[35.6,-.75,.2,15,39.6,112,50,-260]]){const Re=Rt(ae/Je);c.crossVectors(Re,lt).normalize(),b.crossVectors(c,Re),W.copy(Oe).addScaledVector(Re,j).addScaledVector(c,K*j*i*16/9).addScaledVector(b,G*j*i);const Pe=17/Math.max(Math.hypot(ne-W.x,de-W.y,ue-W.z),1);g.push([W.x,W.y,W.z,ae,(ne-W.x)*Pe,(de-W.y)*Pe,(ue-W.z)*Pe])}C.add(_0(pe,g))}const Zt=new e.Color,Jt=new e.Color,Yt=(i,c)=>{const b=i.r*.2126+i.g*.7152+i.b*.0722;return i.r=_(b*.97,i.r,c),i.g=_(b*.96,i.g,c),i.b=_(b*1.09,i.b,c),i},g0=S?.78:1.12,y0=S?.86:1;let Qt=0;const Nt=new e.Vector3,e0=(i,c,b,W)=>{const g=Fe(W,0,1)*Je,ae=Math.min(Math.max(i||0,0),.1);F.value=c;const K=v(20,21.6,g),G=v(20,22.6,g);X.uCalm.value=K,Qt+=ae*20*.95*K,X.uFlow.value=20*c-Qt,X.uSnake.value=p.snake*(1-.8*K)*(1-.3*v(24,36,g)),X.uStream.value=p.stream*(1-K),X.uVeil.value=v(21.5,27,g),X.uPassT.value=g,oe.uCreep.value=c/20*(1+v(19.4,21,g)),oe.uRayT.value=c*(1+v(19.4,21,g)),y.uSfEdge.value=a0+20*(g-21)+54*v(19.6,21,g)*(1-v(23,33,g)),y.uSfWall.value=v(19.8,20.8,g),y.uSfTop.value=_(58,37,v(20,21,g)),y.uSfLean.value=_(_(1.5,3.2,v(20.2,21,g)),4,v(22,26.5,g)),y.uSfDense.value=p.dense*_(.35,1,v(.8,6,g))*_(1,.3,v(11.5,13.2,g)*(1-v(15,16.5,g)));const j=b.matrixWorld.elements,Se=j[12]*E[0]+j[14]*E[1];Ce.visible=y.uSfEdge.value-Se>-260,te.setProgress(W),te.update(i,c,b);const ne=Math.max(x.uSat.value,p.sat);x.uSat.value=ne;const de=_(1.5,1,G);{const ue=x.uSkyCol.value,Re=ue.r*.2126+ue.g*.7152+ue.b*.0722,Pe=.45*G;ue.r=_(ue.r,Re*.85,Pe),ue.g=_(ue.g,Re*.97,Pe),ue.b=_(ue.b,Re*1.3,Pe);const He=.7*(1-G);ue.r=_(ue.r,Re*.84,He),ue.g=_(ue.g,Re*.74,He),ue.b=_(ue.b,Re*1.7,He)}x.uSkyCol.value.multiplyScalar(de*_(1,g0,G)),x.uKeyCol.value.multiplyScalar(de*_(1,y0,G)),x.uGroundCol.value.multiplyScalar(de),Ne.visible=g<27.5,X.uCover.value=1-v(20.3,22.5,g),X.uCurtain.value=1-.7*v(19.8,20.8,g),Nt.set(j[12],j[13],j[14]).sub(Mt).normalize(),y.uSfGlowDir.value.copy(Nt).negate(),y.uSfGlow.value.copy(B).multiplyScalar((1-v(19.5,22,g))*(S?1:.85)),Ne.visible&&(Ne.position.copy(Mt).addScaledVector(Nt,11),Ne.quaternion.setFromUnitVectors(nt,Nt)),x.uSteamRim.value*=S?.8:.62,x.uSteamAmt.value=1+.3*v(11.5,13,g)*(1-v(15.5,17,g))-.5*v(20.3,21.2,g)*(1-v(22.6,25,g)),Yt(y.uSfColA.value.copy(I).lerp(le,G),Math.max(ne,.85)),Yt(y.uSfColB.value.copy(Y).lerp(U,G),Math.max(ne,.85)),oe.uZenith.value.copy(z).lerp(q,G),oe.uMid.value.copy(V).lerp(P,G),oe.uVivid.value=_(Me,be,G),oe.uVeilK.value=_(1,.5,G),y.uMoonCol.value.copy(A).multiplyScalar(_(.8,1,G)),Ve.setOpacity(.85*(1-K)),Ee.setOpacity(.9*v(21,25.5,g)),N.position.set(J[0]*ve*Math.min(g,15),0,J[1]*ve*Math.min(g,15)),N.visible=!(r.rare&&g>20.2),R&&(R.position.z=-.12*(g-29.4)),he(c),Ke.intensity=_(1,S?.7:1.1,G),it.intensity=_(.4,1.2,G),Zt.set("#8E8CA6"),Jt.set("#5a4f9a"),Ke.color.copy(Zt).lerp(Jt,G)};{const i=new e.Object3D;i.position.copy(w.pointAt(0)),i.updateMatrixWorld(),e0(0,0,i,0)}return{scene:C,path:w,duration:Je,camera:{fov:62,near:.2,far:4e3,lookAhead:M,sway:1.8,bank:.55},pois:w0,portal:{shape:"circle",radius:6,color:"#D8F6EA",glow:1,revealDistance:300,tilt:!0},post:{exposure:1,bloom:{strength:.3,radius:.6,threshold:.95},grade:{saturation:1.03,contrast:1.06,tint:"#ffffff",shadowTint:"#05040c",vignette:.4,grain:.03,aberration:0}},ride:"none",style:"none",update:e0,dispose(){te.dispose()}}}};export{Y0 as default};
