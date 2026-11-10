import*as N from"three";import{BS_NOISE as x0,BS_COMMON as J,lin as L,makeAcc as V,vtx as G,quad as i0,loft as H,tube as h0,box as u,ball as s0,finish as u0}from"./blue-sails-dry-sea.js";const K=8.4,m=9.6,j=9,b={x:0,z:-745,r:38},p0=t=>({x0:20+40*t,x1:60+40*t,y:t===0?m:10+7*t,z0:-432-14*t}),T={x:8.5,y:m+5,z0:-523,dz:16,n:12},O={x:19.6,z0:-531,dz:32,n:6},U={r:43.5,n:14,gap:11},R={r0:52,dr:6.4,rows:5,da:.25,y0:m+3,dy:4,clear:12,amax:1.5,s:.34},W={n:30,rise:.3,tread:.75,land:3.75,z0:-400,zTop:-430.2},X=t=>t>=W.n?W.zTop:W.z0-W.tread*t-W.land*Math.floor(t/10),B={x:10.5,z0:(X(9)+X(10))/2-.4,dz:X(9)-X(19),n:2,y0:W.rise*10,dy:W.rise*10},Q={x0:34,dx:24,n:7,z:-432.4,s:.8};function c0(t,n={}){const h=!!n.mirror;return new N.ShaderMaterial({uniforms:{...t,uMirrorY:{value:n.mirrorY??K}},side:N.DoubleSide,vertexShader:`
${J}
uniform float uMirrorY;
attribute vec3 color; attribute float aGlow;
varying vec3 vCol, vN, vW, vL; varying float vGlow;
void main(){
  vec3 lp = position, n = normal;
  #ifdef USE_INSTANCING
  lp = (instanceMatrix*vec4(lp, 1.0)).xyz; n = mat3(instanceMatrix)*n;
  #endif
  vec4 wp = modelMatrix*vec4(lp, 1.0);
  vL = wp.xyz; vN = n;
  ${h?`
  float dep = max(uMirrorY - wp.y, 0.0);
  wp.x += (0.10 + 0.012*dep)*sin(wp.y*1.9 + uTime*1.7 + wp.z*0.3) + 0.25*sin(wp.y*0.45 - uTime*0.9);
  wp.z += 0.08*sin(wp.y*2.3 - uTime*1.3);
  vL.y = 2.0*uMirrorY - vL.y;`:""}
  vW = wp.xyz; vCol = color; vGlow = aGlow;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,fragmentShader:`
${J}
${x0}
uniform vec3 uPoolCol;
varying vec3 vCol, vN, vW, vL; varying float vGlow;
// where the ray mirrored in the house floor meets a pillar of the row x = xr (1e4: nowhere)
// (x: how far along the ray, y: how much of the pillar covers it)
vec2 rowHit(vec3 p, vec3 Rr, float xr, float reach){
  float t = (xr - p.x)/(abs(Rr.x) < 1e-3 ? (Rr.x < 0.0 ? -1e-3 : 1e-3) : Rr.x);
  float zh = p.z + t*Rr.z, yh = t*Rr.y;
  float k = clamp(floor((-448.5 - zh)/7.0 + 0.5), 0.0, 9.0);
  float w = 1.05*length(Rr.xz)/max(abs(Rr.x), 0.08);
  float cov = (1.0 - smoothstep(0.55*w, w, abs(zh - (-448.5 - 7.0*k))))*(1.0 - smoothstep(11.0, 16.0, yh))*step(0.3, t);
  // polished stone is no looking-glass: the image of a pillar is strongest at its foot and is gone 5 m from it
  // (metres along the floor from the foot of the pillar to this place on the floor; the eye has no part in it);
  // wine is one: a pool carries the pillars that stand along it (reach: 5 m on stone, 60 m in a pool)
  cov *= 1.0 - smoothstep(0.0, reach, t*length(Rr.xz));
  return vec2(t, cov);
}
vec3 lampAt(vec3 p, vec3 N, vec3 lp, float power){
  vec3 L = lp - p; float d2 = dot(L, L); L *= inversesqrt(d2 + 1e-4);
  return uGold*power*clamp(dot(N, L)*0.85 + 0.15, 0.0, 1.0)/(d2 + 5.0);
}
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0)); if (!gl_FrontFacing) N = -N;
  ${h?"N.y = -N.y;":""}
  vec3 Vv = cameraPosition - vW; float d = length(Vv);
  vec3 p = vL; float fp = max(length(dFdx(p)), length(dFdy(p))) + 1e-4;
  vec3 alb = vCol;
  float up = smoothstep(0.75, 0.95, N.y), wallF = 1.0 - smoothstep(0.2, 0.5, abs(N.y));
  // paving: square tiles 2.4 m, every other one a shade darker, fine joints
  vec2 tq = p.xz/2.4; vec2 tf = abs(fract(tq) - 0.5), ti = floor(tq);
  float joint = smoothstep(0.47 - fp*0.4, 0.5, max(tf.x, tf.y));
  float fadeT = 1.0 - smoothstep(0.5, 2.5, fp);
  // (the floor of the crystal house, from the lip of the stairs to the canal, is one polished dark stone: its joints barely show)
  float inH = step(p.z, -430.2)*step(-515.0, p.z)*step(abs(p.x), 22.0)*step(abs(p.y - ${j.toFixed(1)}), 0.05)*up;
  alb *= 1.0 - up*fadeT*(1.0 - 0.8*inH)*(0.16*joint + 0.07*mod(ti.x + ti.y, 2.0) + 0.05*bsH(ti));
  alb *= 1.0 - 0.42*inH;
  // walls: courses 1.6 m high, long weather streaks below ledges, a little lichen-grey mottling
  float hx = p.x + p.z;
  float course = smoothstep(0.44 - fp*0.3, 0.5, abs(fract(p.y/1.6) - 0.5));
  float streak = bsN(vec2(hx*1.3, p.y*0.12))*bsN(vec2(hx*0.21, 3.0));
  alb *= 1.0 - wallF*((0.15*course)*(1.0 - smoothstep(0.3, 1.5, fp)) + 0.22*streak*(1.0 - smoothstep(1.0, 6.0, fp)));
  alb *= 0.9 + 0.2*bsF2(vec2(hx, p.y)*0.11 + 4.0);
  // the shore's stone keeps the marks of the sea that is gone: what it covered is a shade darker and greener, with
  // three old waterlines; a carved band of rings runs under the string course of the sea wall, and between the
  // pilasters a round-headed niche holds a small fire
  float shoreS = wallF*step(-432.5, p.z), fadeW = 1.0 - smoothstep(0.6, 3.0, fp);
  float tl = p.y + 0.5*bsN(vec2(hx*0.15, 1.0)) + 0.15*bsN(vec2(hx*1.1, 5.0));
  float tide = (1.0 - smoothstep(0.0, 0.3, abs(tl - 6.4))) + 0.7*(1.0 - smoothstep(0.0, 0.26, abs(tl - 5.0))) + 0.5*(1.0 - smoothstep(0.0, 0.22, abs(tl - 3.3)));
  float below = 1.0 - smoothstep(6.1, 6.9, tl);
  alb *= 1.0 - shoreS*(0.22*tide*fadeW + 0.16*below);
  alb = mix(alb, alb*vec3(0.84, 0.97, 0.9), shoreS*0.6*below);
  float seaW = shoreS*step(p.z, -428.4)*step(22.3, abs(p.x))*smoothstep(0.5, 0.8, abs(N.z));
  float frz = abs(fract(p.x/1.5) - 0.5)*1.5, fy = (p.y - 7.3)/0.42, ring = abs(length(vec2(frz, fy*0.42)) - 0.3);
  float band = step(abs(fy), 1.0)*((1.0 - smoothstep(0.03, 0.09 + fp, ring)) + (1.0 - smoothstep(0.03, 0.1, abs(abs(fy) - 0.9))));
  alb *= 1.0 - seaW*0.3*clamp(band, 0.0, 1.0)*(1.0 - smoothstep(0.1, 0.6, fp));
  float nx = mod(abs(p.x) - 28.0, 12.0) - 6.0, ny = p.y - 2.6;
  float nd = ny < 2.4 ? abs(nx) : length(vec2(nx, ny - 2.4));
  float niche = seaW*(1.0 - smoothstep(0.86, 0.94 + fp, nd))*step(0.0, ny), nfl = length(vec2(nx, (ny - 0.5)*0.8));
  alb *= 1.0 - 0.7*niche;
  // the towers are turned stone, lightly fluted: shallow vertical grooves that catch the raking light
  float tower = step(vGlow, -0.5)*wallF*(1.0 - smoothstep(0.15, 0.7, fp));
  vec3 Tn = normalize(vec3(-N.z, 0.0, N.x) + vec3(1e-5, 0.0, 0.0));
  N = normalize(N + Tn*0.16*tower*cos(hx*5.6));
  alb *= 1.0 - 0.05*tower*(0.5 + 0.5*sin(hx*5.6));
  vec3 c = alb*bsLight(N);
  // light that comes back off the lit sand onto the sea wall and the stairs, and off the basin onto the tiers
  c += alb*(uKeyCol*0.34 + uSkyCol*0.5)*clamp(N.z, 0.0, 1.0)*(0.45 + 0.55*smoothstep(-470.0, -432.0, p.z));
  vec2 bq = p.xz - vec2(${b.x.toFixed(1)}, ${b.z.toFixed(1)}); float bl = length(bq);
  c += alb*(uSkyCol*0.6 + uMoonCol*0.32)*clamp(dot(N.xz, -bq/max(bl, 1e-3)), 0.0, 1.0)*(1.0 - smoothstep(60.0, 130.0, bl))*step(p.z, -700.0);
  // and off the pale terraces onto the walls of the terraces above them, so no wall on the shaded side stands dark
  c += alb*(uSkyCol*0.9 + uKeyCol*0.5 + uGold*0.32)*wallF*smoothstep(52.0, 62.0, abs(p.x))*step(p.z, -440.0);
  // lamplight: the nearest two lamps of the canal row on this side, the nearest avenue lamp, the nearest basin lamp
  vec3 Lg = vec3(0.0); float sx = p.x < 0.0 ? -1.0 : 1.0;
  float kf = (${T.z0.toFixed(1)} - p.z)/${T.dz.toFixed(1)}, kq = clamp(floor(kf + 0.5), 0.0, ${(T.n-1).toFixed(1)});
  float kq2 = clamp(kq + (kf > kq ? 1.0 : -1.0), 0.0, ${(T.n-1).toFixed(1)});
  Lg += lampAt(p, N, vec3(sx*${T.x.toFixed(1)}, ${T.y.toFixed(1)}, ${T.z0.toFixed(1)} - ${T.dz.toFixed(1)}*kq), 24.0);
  Lg += lampAt(p, N, vec3(sx*${T.x.toFixed(1)}, ${T.y.toFixed(1)}, ${T.z0.toFixed(1)} - ${T.dz.toFixed(1)}*kq2), 24.0)*step(0.5, abs(kq2 - kq));
  float ka = clamp(floor((${O.z0.toFixed(1)} - p.z)/${O.dz.toFixed(1)} + 0.5), 0.0, ${(O.n-1).toFixed(1)});
  Lg += lampAt(p, N, vec3(sx*${O.x.toFixed(1)}, ${T.y.toFixed(1)}, ${O.z0.toFixed(1)} - ${O.dz.toFixed(1)}*ka), 24.0);
  float ba = atan(bq.x, -bq.y + 1e-5), bi = floor(ba/6.2832*${U.n.toFixed(1)}), baa = (bi + 0.5)/${U.n.toFixed(1)}*6.2832;
  vec3 blp = vec3(sin(baa)*${U.r.toFixed(1)}, ${T.y.toFixed(1)}, ${b.z.toFixed(1)} - cos(baa)*${U.r.toFixed(1)});
  Lg += lampAt(p, N, blp, 24.0)*step(${U.gap.toFixed(1)}, abs(blp.x));
  // the small lamps of the tiers, the standards up the water stairs and along the sea wall
  float tm = clamp(floor((bl - ${R.r0.toFixed(1)})/${R.dr.toFixed(1)} + 0.5), 0.0, ${(R.rows-1).toFixed(1)}), todd = mod(tm, 2.0);
  float ta = (floor(ba/${R.da.toFixed(2)} + 0.5*todd) + 0.5 - 0.5*todd)*${R.da.toFixed(2)}, trl = ${R.r0.toFixed(1)} + ${R.dr.toFixed(1)}*tm;
  vec3 tlp = vec3(sin(ta)*trl, ${(R.y0+5*R.s).toFixed(2)} + ${R.dy.toFixed(1)}*tm, ${b.z.toFixed(1)} - cos(ta)*trl);
  Lg += lampAt(p, N, tlp, 10.0)*step(${R.clear.toFixed(1)}, abs(tlp.x))*step(abs(ta), ${R.amax.toFixed(2)})*step(46.0, bl)*step(p.z, ${b.z.toFixed(1)});
  float ks = clamp(floor((${B.z0.toFixed(1)} - p.z)/${B.dz.toFixed(1)} + 0.5), 0.0, ${(B.n-1).toFixed(1)});
  Lg += lampAt(p, N, vec3(sx*${B.x.toFixed(1)}, ${(B.y0+5).toFixed(1)} + ${B.dy.toFixed(1)}*ks, ${B.z0.toFixed(1)} - ${B.dz.toFixed(1)}*ks), 24.0)*step(-431.0, p.z);
  float kw = clamp(floor((abs(p.x) - ${Q.x0.toFixed(1)})/${Q.dx.toFixed(1)} + 0.5), 0.0, ${(Q.n-1).toFixed(1)});
  Lg += lampAt(p, N, vec3(sx*(${Q.x0.toFixed(1)} + ${Q.dx.toFixed(1)}*kw), ${(m+5*Q.s).toFixed(1)}, ${Q.z.toFixed(1)}), 18.0)*step(-446.0, p.z);
  // and the portal's own pale light on the landing, the aisle and the feet of the two tall towers
  vec3 PL = vec3(0.0, 17.0, -809.0) - p; float pd2 = dot(PL, PL); PL *= inversesqrt(pd2 + 1e-4);
  Lg += vec3(0.62, 0.76, 1.0)*70.0*clamp(dot(N, PL)*0.8 + 0.2, 0.0, 1.0)/(pd2 + 70.0);
  c += alb*Lg;
  // the afterglow grazes the stone: a faint rose sheen where the surface turns toward it
  float rim = clamp(dot(N, uKeyDir), 0.0, 1.0);
  c += alb*uKeyCol*0.25*rim*rim;
  // the crystal house has a polished floor: it takes the gold of the fruit along the screens, and mirrors the
  // pillars, the screens' fruit and the dusk above
  // the niches' fires, and their light on the stone round them
  c += uGold*(1.7*niche*exp(-nfl*nfl*1.6) + 0.5*seaW*alb/(1.0 + 0.7*nd*nd)*step(-2.0, ny)*(1.0 - niche));
  if (inH > 0.5) {
    c += alb*uGold*0.5*exp(-abs(abs(p.x) - 19.0)/3.0);
    // five long shallow pools lie either side of the rill, in the bays between the inner pillars
    vec2 pq = vec2((abs(p.x) - 4.7)/2.3, (mod(-p.z - 445.0, 14.0) - 7.0)/5.2); pq *= pq;
    float pr = sqrt(sqrt(pq.x*pq.x + pq.y*pq.y + 1e-6)), inZ = step(p.z, -445.0)*step(-515.0, p.z);
    float pool = (1.0 - smoothstep(0.94, 1.0, pr))*inZ, rimP = (1.0 - smoothstep(0.0, 0.07, abs(pr - 1.05)))*inZ;
    vec2 wob = (vec2(bsN(p.xz*2.3 + vec2(uTime*0.3, 0.0)), bsN(p.xz*2.3 + vec2(7.0, uTime*0.27))) - 0.5)*0.07*pool;
    // the pools hold wine, as the canal does: dark, with small quick ripples that break up what they mirror, and a
    // bright meniscus where the wine meets the stone
    wob += (vec2(bsN(p.xz*7.1 + vec2(-uTime*0.7, uTime*0.4)), bsN(p.xz*7.1 + vec2(3.0 + uTime*0.5, uTime*0.8))) - 0.5)*0.1*pool*fadeT;
    c = mix(c, uPoolCol*(vec3(0.26) + uMoonCol*0.2 + uGold*0.08), pool) + alb*(uSkyCol*0.5 + uMoonCol*0.4 + uGold*0.2)*rimP*0.6;
    vec3 Rr = reflect(-Vv/max(d, 1e-3), normalize(vec3(wob.x, 1.0, wob.y)));
    float rch = mix(5.0, 60.0, pool);
    vec2 h1 = rowHit(p, Rr, -9.0, rch), h2 = rowHit(p, Rr, 9.0, rch), h3 = rowHit(p, Rr, -20.0, rch), h4 = rowHit(p, Rr, 20.0, rch);
    float cov = max(max(h1.y, h2.y), max(h3.y, h4.y));
    float tb = h1.y > 0.5 ? h1.x : (h2.y > 0.5 ? h2.x : (h3.y > 0.5 ? h3.x : (h4.y > 0.5 ? h4.x : 1e4)));
    float ry = clamp(Rr.y, 0.0, 1.0), om = 1.0 - ry, Ff = 0.05 + 0.95*om*om*om*om*om;
    vec3 refl = mix(uFog.rgb*1.15, uSkyCol*0.45, clamp(Rr.y*1.3, 0.0, 1.0));
    refl = mix(refl, dot(refl, vec3(0.3333))*(uPoolCol/max(dot(uPoolCol, vec3(0.3333)), 0.02)*0.2 + 0.03), 0.9*pool);       // (a pool gives the sky back dark, in its wine's colour; the moon, the pillars and the fruit keep their own light in it)
    float mo = clamp(dot(Rr, uMoonDir), 0.0, 1.0); mo *= mo; mo *= mo; mo *= mo; mo *= mo; mo *= mo;
    refl += uMoonCol*1.2*mo*mo;
    vec3 pilc = vec3(0.26, 0.36, 0.82)*(0.7 + 0.4*sin(p.z*0.9 + p.x*0.7)) + uKeyCol*0.12;
    // the crystal walls behind the outer rows, then the pillars before them, then the fruit as gold lights in the polish
    float ts = (sign(Rr.x)*20.0 - p.x)/(abs(Rr.x) < 1e-3 ? 1e-3 : Rr.x);
    vec2 sc = vec2(p.z + ts*Rr.z, ts*Rr.y);
    float wallHit = step(0.0, ts)*step(sc.y, 12.5)*step(sc.x, -449.0)*step(-512.0, sc.x);
    wallHit *= 1.0 - smoothstep(0.0, 6.0, ts*length(Rr.xz));       // (the wall's image, too, dies 6 m along the floor from the wall's foot)
    refl = mix(refl, vec3(0.13, 0.19, 0.46)*(0.8 + 0.4*bsH(floor(sc*0.42))) + uGold*0.05, 0.6*wallHit);
    refl = mix(refl, pilc, cov*(1.0 - 0.3*pool));       // (in a pool the wine's dark shows through the pillars' image)
    float fr = bsH(floor(sc*1.1));
    refl += uGold*1.8*step(0.84, fr)*(1.0 - smoothstep(0.1, 0.4, length(fract(sc*1.1) - 0.5)))*step(ts, tb)*step(sc.y, 11.5)*step(sc.x, -449.0)*step(-512.0, sc.x);
    float gloss = (0.85 + 0.15*bsH(ti + 7.0))*(1.0 - 0.8*joint*fadeT)*(1.0 - rimP);       // (matt in the joints of the paving and on the pools' rims)
    c = mix(c, refl, mix(clamp((0.34 + 0.6*Ff)*gloss, 0.0, 0.9), clamp(0.3 + 0.6*Ff, 0.0, 0.9), pool));
    // a few glints move on the wine; it lies a little below its kerb, so a dark wetted band of stone shows all
    // round it, and a bright meniscus where the wine meets that stone
    c += (uMoonCol*0.5 + uGold*0.3)*0.5*smoothstep(0.86, 0.97, bsN(p.xz*5.3 + vec2(uTime*0.6, -uTime*0.45)))*pool*fadeT;
    c *= 1.0 - 0.62*smoothstep(0.95, 0.965, pr)*(1.0 - smoothstep(1.0, 1.015, pr))*inZ;
    c += (uSkyCol*0.5 + uMoonCol*0.5 + uGold*0.25)*0.5*(1.0 - smoothstep(0.0, 0.012, abs(pr - 0.945)))*inZ;
  }
  // an inlaid border along each quay: two dark lines and a chain of lozenges between them
  float onQ = up*step(p.z, -517.0)*step(-706.0, p.z)*step(abs(p.y - ${m.toFixed(1)}), 0.3);
  float ax = abs(p.x), bw = fp*0.7;
  float lines = (1.0 - smoothstep(0.1, 0.14 + bw, abs(ax - 10.3))) + (1.0 - smoothstep(0.1, 0.14 + bw, abs(ax - 12.9)));
  float loz = 1.0 - smoothstep(0.5, 0.56 + bw, abs(ax - 11.6) + abs(fract(p.z/2.6) - 0.5)*2.2);
  c *= 1.0 - onQ*(1.0 - smoothstep(0.6, 3.0, fp))*0.42*clamp(lines + loz, 0.0, 1.0);
  c += vCol*max(vGlow, 0.0);
  ${h?"c *= vec3(0.5, 0.42, 0.5);":""}
  gl_FragColor = vec4(bsFog(max(c, 0.0), d), 1.0);
}`})}function I(t,n,h,p,s,x,f,o=0,r=Math.PI*2,a=0){const e=[],l=r-o>6.28;for(let d=0;d<n.length;d++){const z=[],k=l?x:x+1;for(let F=0;F<k;F++){const w=o+(r-o)*F/x;z.push([h+Math.sin(w)*n[d][0],p+n[d][1],s-Math.cos(w)*n[d][0],f(d,w),a])}e.push(z)}H(t,e,l,!1)}const f0=[[[1,0],[1.02,.035],[.86,.06],[.8,.3],[.78,.62],[1.08,.655],[1.08,.7],[.76,.72],[.72,.86],[.9,.885],[.92,.91],[.7,.935],[.34,.97],[.2,.975],[.26,.99],[0,1]],[[1,0],[1.04,.04],[.8,.09],[.52,.3],[.42,.56],[.46,.67],[.84,.705],[.86,.735],[.46,.76],[.44,.79],[.72,.84],[.84,.9],[.72,.955],[.4,.992],[0,1]],[[1.08,0],[1.08,.06],[.72,.1],[.68,.3],[.94,.33],[.94,.38],[.62,.41],[.58,.64],[.9,.675],[.9,.72],[.56,.75],[.52,.9],[.78,.93],[.8,.965],[.5,.99],[0,1]],[[.94,0],[.96,.03],[.62,.08],[.44,.5],[.36,.76],[.56,.785],[.56,.805],[.3,.825],[.62,.865],[.8,.915],[.62,.965],[.28,.995],[0,1]],[[.86,0],[.9,.04],[.64,.1],[.5,.4],[.46,.57],[.74,.6],[.76,.63],[.5,.655],[.78,.75],[.98,.83],[.86,.92],[.5,.975],[.16,.995],[0,1]],[[1,0],[1,.05],[.74,.09],[.58,.45],[.54,.76],[.98,.8],[1,.84],[.62,.86],[.56,.905],[.86,.955],[.98,.985],[.7,1],[0,1]]];function A(t,n){const h=f0[t];for(let p=0;p<h.length-1;p++)if(n>=h[p][1]&&n<=h[p+1][1]){const s=(n-h[p][1])/Math.max(h[p+1][1]-h[p][1],1e-5);return h[p][0]+(h[p+1][0]-h[p][0])*s}return h[h.length-1][0]}function d0(t,n,h){const p=L("#EDE8DF"),s=L("#CFC7C9"),x=L("#F2E6D8"),f=(e,l,d)=>[e[0]+(l[0]-e[0])*d,e[1]+(l[1]-e[1])*d,e[2]+(l[2]-e[2])*d],o=f0[n.kind],r=[];n.balconies=[];for(let e=0;e<o.length;e++)if(r.push([o[e][0]*n.r,o[e][1]*n.h]),e<o.length-1&&h>10){const l=o[e][1]*n.h,d=(o[e+1][1]-o[e][1])*n.h,z=o[e][0]*n.r,k=(o[e+1][0]-o[e][0])*n.r,F=Math.min(4,Math.floor(d/7)),w=[];for(let g=1;g<=F;g++)w.push({t:g/(F+1)});if(h>=20&&d>9&&Math.abs(k)<.16*d&&z>1.2)for(const g of d>24?[.3,.72]:[.5]){for(let v=w.length-1;v>=0;v--)Math.abs(w[v].t-g)*d<2.2&&w.splice(v,1);w.push({t:g,balcony:!0})}w.sort((g,v)=>g.t-v.t);for(const g of w){const v=z+k*g.t,E=l+d*g.t;if(!g.balcony){r.push([v,E]);continue}const _=Math.min(1,.45+.12*n.r);r.push([v,E],[v+_,E+.12],[v+_,E+1.15],[v+_-.16,E+1.15],[v+_-.16,E+.42],[v,E+.42]),n.balconies.push({y:n.y+E+.42,r:v+_*.5})}}const a=.72*(.9+.2*((n.x*.37+n.z*.11)%1+1)%1);I(t,r,n.x,n.y,n.z,h,e=>{const l=r[e][1]/n.h,d=e>0&&Math.abs(r[e][0]-r[e-1][0])>.08*n.r?.06:0,z=f(f(s,p,.35+.65*l),x,.2);return[z[0]*(a+d),z[1]*(a+d),z[2]*(a+d)]},0,Math.PI*2,-1)}const Y=L("#E6E0D6"),S=L("#D5CCC9"),v0=L("#D8CEC6"),$=(t,n)=>[t[0]*n,t[1]*n,t[2]*n],a0=[-103,-45,45,103],y0=[-170,-130,-95,-63,-7.5,7.5,74,111,142,185],b0=[[-23.6,-432.6],[23.6,-432.6],...a0.flatMap(t=>[[t-4.7,-432.6],[t+4.7,-432.6]])],r0=13;function w0(t,n,h,p=[]){const s=$(Y,.74),x=$(S,.7);u(t,-187,m/2,-434.5,330,m,9,s),u(t,187,m/2,-434.5,330,m,9,s);for(const o of[-1,1])u(t,o*11.5,j/2-.05,-434.5,21,j-.1,9,s);u(t,0,4.05,-434.5,2,8.1,9,$(S,.4));for(const o of[-1,1])for(let r=0;r<27;r++){u(t,o*(28+r*12),(m-1.5)/2,-429.75,1.7,m-1.5,.7,x);const a=34+r*12;r<17&&!a0.some(e=>Math.abs(Math.abs(e)-a)<4.5)&&(h.lamps.push([o*a,3.25,-429.7]),h.lampSizes[h.lamps.length-1]=.5)}u(t,-187,m-.12,-429.7,330,.24,.9,s),u(t,187,m-.12,-429.7,330,.24,.9,s),u(t,-187,m-1.5,-429.8,330,.5,.5,x),u(t,187,m-1.5,-429.8,330,.5,.5,x);for(const o of[-1,1])for(let r=0;r<27;r++)u(t,o*(28+r*12),m+.45,-430.6,9.2,.9,.7,s);for(let o=0;o<W.n;o++){const r=W.rise*(o+1),a=X(o),e=$(o%10===9||o%10===0?S:Y,o%10===9?.66:.72);for(const l of[-1,1])u(t,l*10.5,r-.3,(a-430.2)/2,19,.6,430.2+a,e);r>1.2&&u(t,0,r-1.2,(a-430.2)/2,2,.6,430.2+a,$(S,.5))}for(const o of[-1,1]){const r=o*20,a=o*22.2,e=Math.min(r,a),l=Math.max(r,a);H(t,[[[e,0,-398.5,s],[l,0,-398.5,s],[l,1.2,-398.5,s],[e,1.2,-398.5,s]],[[e,0,-430.4,s],[l,0,-430.4,s],[l,10.3,-430.4,s],[e,10.3,-430.4,s]]],!0,!0),u(t,o*21.1,.9,-397.6,3.2,1.8,2.6,x),I(t,[[1,0],[1,.25],[.6,.5],[.6,2.2],[.95,2.5],[.6,2.9],[0,3]],o*21.1,1.8,-397.6,10,()=>s),h.lamps.push([o*21.1,1.8+3.5,-397.6])}for(const o of a0){u(t,o,4.5,-401,5,9,58,s),u(t,o,9.2,-401,5.8,.5,58.4,x),I(t,[[2.9,0],[2.9,8.9],[3.3,9],[3.3,9.5],[0,9.5]],o,0,-372,14,()=>s),I(t,[[.5,0],[.5,.08],[.12,.2],[.1,.6],[.3,.7],[.62,.98],[.56,.98],[.25,.78],[0,.76]],o,9.5,-372,8,()=>$(L("#8C6B3E"),.8)),s0(t,o,9.5+3.6,-372,.36,L("#FFC46A"),3.2,5,1.18),h.lamps.push([o,9.5+3.6,-372]);for(let r=0;r<5;r++)u(t,o,2.2+r%2*2.4,-382-r*10,5.5,.35,.8,x)}const f=$(L("#8C6B3E"),.8);for(const[o,r]of b0)I(t,[[.32,0],[.32,.3],[.15,.6],[.08,r0],[.2,r0+.15],[0,r0+.4]],o,m,r,6,()=>f);for(const o of p){const r=o.r,a=o.h,e=$(S,.6+.12*(o.tone??.5));I(t,[[r*1.5,0],[r*1.3,.3],[r,.6],[r*.86,a*.78],[r*1.22,a*.85],[r*1.22,a*.93],[r*.5,a],[0,a]],o.x,-.05,o.z,9,()=>e),I(t,[[.1,0],[.3,.18],[.32,.24],[0,.24]],o.x,a-.05,o.z,7,()=>f),s0(t,o.x,a+.36,o.z,.17,L("#FFC46A"),3.2,4),h.lamps.push([o.x,a+.36,o.z]),h.lampSizes[h.lamps.length-1]=.45}for(const o of y0){const r=-372-n()*22,a=4.4+n()*1.2,e=.5+n()*.25,l=$(S,.62+.1*n());I(t,[[e*1.3,0],[e*1.15,.5],[e,.9],[e*.86,a*.8],[e*1.25,a*.86],[e*1.25,a*.93],[e*.7,a],[0,a]],o,0,r,9,()=>l),h.posts.push([o,a,r,e])}}function z0(t){if(t>-515)return 22;const n=t-b.z,h=Math.abs(n)<b.r?Math.sqrt(b.r*b.r-n*n):0;return t>b.z?Math.max(7,h):h}function g0(t,n){const h=$(v0,.7),p=$(Y,.72),s=$(S,.66);for(const i of[-1,1])u(t,i*11.5,j-.5,(W.zTop-515)/2,21,1,515+W.zTop,h);u(t,0,7.9,-474.5,2,.4,81,$(S,.4));const x=[];for(let i=-432;i>-900.01;i-=2)x.push(i);x.push(-514.999,-515.001,-707.5,-783.2),x.sort((i,c)=>c-i);for(const i of[-1,1]){const c=[],y=[];for(const q of x){const M=Math.max(z0(q),0);c.push([[i*M,m,q,h],[i*60,m,q,h]]),y.push([[i*M,m,q,p],[i*M,K-.02,q,s]])}H(t,c,!1,i>0),H(t,y,!1,i<0)}for(const i of[-1,1])u(t,i*7.3,m+.12,-611,.6,.24,192,p);const f=-515,o=$(L("#8C6B3E"),.8);u(t,0,8.15,f-.85,1.96,1.1,1.7,$(S,.4));for(const i of[-1,1]){u(t,i*1.64,8.5,f-.35,1.32,1.8,2.7,p),u(t,i*1.64,9.47,f-.35,1.52,.14,2.9,s),u(t,i*4.65,j,f+.17,4.8,.16,.46,s);for(let c=0;c<3;c++)u(t,i*4.65,(7.8+[8.8,8.6,K+.02][c])/2,f+.05-.3*(c+1),4.8,[8.8,8.6,K+.02][c]-7.8,.1+.6*(c+1),p);for(let c=0;c<2;c++)u(t,i*14.5,j+.1*(c+1)-.05,f+.575-.3*c,15,.2*(c+1)+.1,1.25-.6*c,p);u(t,i*7.5,m+.35,f-.5,1,.7,1,p),I(t,[[.35,0],[.35,.06],[.09,.14],[.07,.42],[.21,.49],[.43,.69],[.39,.69],[.18,.55],[0,.53]],i*7.5,m+.7,f-.5,8,()=>o),s0(t,i*7.5,m+.7+1.3,f-.5,.26,L("#FFC46A"),3.2,5,1.18)}for(const i of[-1,1])for(let c=1;c<=5;c++){const y=p0(c),q=$(Y,.7-.02*c);u(t,i*(y.x0+352)/2,(y.y+9)/2,(y.z0-925)/2,352-y.x0,y.y-9,925+y.z0,q),c===1&&u(t,i*206,m-.3,-439.5,292,.6,15,h),u(t,i*(y.x0+.5),y.y+.5,(y.z0-925)/2,1,1,925+y.z0,$(S,.7));for(let M=0;M<16;M++)u(t,i*(y.x0-.5),(y.y+9.6)/2-.3,y.z0-14-M*30,1.6,y.y-9.6-.6,3.2,s);for(let M=0;M<3;M++)for(let C=0;C<7;C++)u(t,i*(y.x0-6.5+C),y.y-7+(C+1)/2,-500-M*150-14*c,1,C+1,5,p)}const r=48,a=1.6,e=20,l=9;for(let i=0;i<e;i++){const c=r+a*i,y=c+a,q=m+i,M=q+1,C=Math.asin(l/c),D=$(i%2?Y:S,i%2?.4:.34);for(const[Z,P]of[[-Math.PI/2,-C],[C,Math.PI/2]]){const l0=[];for(let t0=0;t0<=14;t0++){const n0=Z+(P-Z)*t0/14,o0=Math.sin(n0),e0=-Math.cos(n0);l0.push([[b.x+o0*c,q,b.z+e0*c,D],[b.x+o0*c,M,b.z+e0*c,D],[b.x+o0*y,M,b.z+e0*y,D]])}H(t,l0,!1,!1)}}const d=b.z-Math.sqrt(r*r-l*l),z=b.z-Math.sqrt(6400-l*l),k=m+e;for(const i of[-1,1]){for(let c=0;c<e;c++){const y=r+a*c,q=y+a,M=m+c+1,C=Math.sqrt(y*y-l*l),D=Math.sqrt(q*q-l*l),Z=q/y,P=$(S,.42);i0(t,G(t,i*l,m,b.z-C,P),G(t,i*l,m,b.z-D,P),G(t,i*l,M,b.z-D,P),G(t,i*l,M,b.z-C,P)),t.i.push(G(t,i*l,M,b.z-C,P),G(t,i*l,M,b.z-D,P),G(t,i*l*Z,M,b.z-C*Z,P)),i0(t,G(t,i*y,m,b.z,P),G(t,i*q,m,b.z,P),G(t,i*q,M,b.z,P),G(t,i*y,M,b.z,P))}u(t,i*l,k-9.4,z-1.5,2.4,22,3,p)}const F=[.05,.048,.1],w=-814.6,g=-817.4,v=21,E=[],_=[];for(let i=0;i<=28;i++){const c=-v+2*v*i/28,y=17+Math.sqrt(Math.max(v*v-c*c,0));E.push([[c,m,w,F],[c,y,w,F],[c,y,g,F],[c,m,g,F]])}H(t,E,!0,!1);for(let i=0;i<=28;i++){const c=Math.PI*i/28;_.push([Math.cos(c)*v,17+Math.sin(c)*v,w-.2])}h0(t,[[v,m,w-.2],..._,[-v,m,w-.2]],.8,6,p),I(t,[[80,m],[80,k+1.2],[81.2,k+1.2],[81.2,m]],b.x,0,b.z,40,()=>$(S,.5),-Math.PI/2,Math.PI/2),n.tiers={r0:r,dr:a,n:e,aisle:l,yTop:k}}const F0=[-562,-612,-662];function M0(t){const n=$(Y,.74),h=$(S,.7),p=21;for(const s of F0){const x=[],r=a=>m+11.4*(1-a/p*(a/p));for(let a=0;a<=32;a++){const e=-p+2*p*a/32,l=Math.abs(e)/p,d=r(e),z=.34+1.5*l*l*l;x.push([[e,d-z,s-1.5,h],[e,d-z,s+1.5,h],[e,d,s+1.5+.12,n],[e,d+.16,s+1.5+.12,n],[e,d+.16,s-1.5-.12,n],[e,d,s-1.5-.12,n]])}H(t,x,!0,!1);for(const a of[-1,1]){const e=[];for(let l=0;l<=32;l++){const d=-p+2*p*l/32;e.push([d,r(d)+1.05,s+a*(1.5-.05)])}h0(t,e,.09,4,n);for(let l=-p+.6;l<p;l+=1.2)u(t,l,r(l)+.58,s+a*(1.5-.05),.1,.9,.1,h)}for(const a of[-1,1])I(t,[[.9,0],[.9,.5],[.45,.8],[.45,2],[.75,2.5],[0,3.1]],a*(p+.6),m,s,8,()=>n)}}function $0(t){const n=[],h=[6,5,4,3,3,2],p=[-468,-524,-583,-642,-700,-862];for(const s of[-1,1]){let x=-1;for(let f=0;f<6;f++)for(let o=0;o<h[f];o++){const r=p0(f);let a,e,l,d,z;do z=t.int(0,5);while(z===x);if(x=z,f===0)e=p[o]+t.range(-5,5),l=t.range(3,4.6),a=s*t.range(27+l,50),d=t.range(24,46),o===4&&(a=s*50,e=-700,l=8,d=34.4,z=0);else{e=r.z0-26+(-880-r.z0+26)*((o+.5+t.range(-.3,.3))/h[f]),l=t.range(3.4,6.2),a=s*(r.x0+l+t.range(4,24)),d=t.range(26,44)+4*f+(t()<.3?12:0);const k=e-b.z,F=Math.hypot(a,k);e<-690&&F<90+l&&(a=s*Math.sqrt(Math.max((90+l)*(90+l)-k*k,a*a)))}n.push({x:a,y:r.y,z:e,r:l,h:Math.min(d,62),kind:z,k:f,near:f===0,drum:f===0&&o===4})}n.push({x:s*24,y:m,z:-835,r:6.4,h:72,kind:s<0?3:5,k:0,near:!0,tall:!0})}return n}function k0(t,n,h=0){const p=[];for(const s of n){if(s.near){const f=s.tall||s.drum?3:1+(t()<.5?1:0);for(let o=0;o<f;o++){const r=-Math.sign(s.x)*Math.PI/2+(s.tall?(s.x<0?1:-1)*.5:0)+t.range(-.5,.5)+o*2.1,a=A(s.kind,1.3/s.h)*s.r;p.push([s.x+Math.sin(r)*(a+.06),s.y+1.35,s.z-Math.cos(r)*(a+.06),r,.62,1.3,t()*40,2])}}const x=s.near?Math.max(4,Math.round(s.h/2.6)):Math.max(3,Math.round(s.h/4.5));for(let f=0;f<x;f++){const o=.09+.84*(f+.5)/x,r=A(s.kind,o)*s.r,a=t()<.22,e=Math.abs(A(s.kind,o+.012)-A(s.kind,o-.012))*s.r/(.024*s.h);if(r<.8||e>.55)continue;const l=Math.max(4,Math.round(r*6.28/(a?3.6:1.9))),d=t()*6.28,z=.3+.5*t();for(let k=0;k<l;k++){if(t()>z)continue;const F=d+k/l*6.28,w=a?.26+.1*t():.11+.05*t(),g=a?w:.5+.45*t();p.push([s.x+Math.sin(F)*(r+.05),s.y+o*s.h,s.z-Math.cos(F)*(r+.05),F,w*(s.near?1:1.5),g*(s.near?1:1.4),t()*40,a?1:0])}}}return p}function m0(t,n,h={}){const p=n.length,s=new Float32Array(p*4),x=new Float32Array(p*4);n.forEach((e,l)=>{s.set([e[0],e[1],e[2],e[3]],l*4),x.set([e[4],e[5],e[6],e[7]],l*4)});const f=new N.InstancedBufferGeometry;f.setAttribute("position",new N.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),f.setIndex([0,1,2,0,2,3]),f.setAttribute("iP",new N.InstancedBufferAttribute(s,4)),f.setAttribute("iQ",new N.InstancedBufferAttribute(x,4)),f.instanceCount=p;const o=!!h.mirror,r=new N.ShaderMaterial({uniforms:{...t,uLit:{value:h.lit??1}},side:N.DoubleSide,vertexShader:`
${J}
attribute vec4 iP, iQ; varying vec2 vQ; varying vec3 vW; varying vec2 vK; varying float vDim;
void main(){
  float a = iP.w; vec3 tg = vec3(cos(a), 0.0, sin(a));
  vec2 sz = max(iQ.xy, vec2(0.7*uPx*length(cameraPosition - iP.xyz)));
  vDim = (iQ.x*iQ.y)/max(sz.x*sz.y, 1e-6);
  vec3 wp = iP.xyz + tg*position.x*sz.x + vec3(0.0, position.y*sz.y, 0.0);
  ${o?`
  wp.y = 2.0*${K.toFixed(2)} - wp.y; float dep = max(${K.toFixed(2)} - wp.y, 0.0);
  wp.x += (0.10 + 0.012*dep)*sin(wp.y*1.9 + uTime*1.7 + wp.z*0.3) + 0.25*sin(wp.y*0.45 - uTime*0.9);
  wp.z += 0.08*sin(wp.y*2.3 - uTime*1.3);`:""}
  vQ = position.xy; vW = wp; vK = vec2(iQ.z, iQ.w);
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,fragmentShader:`
${J}
uniform float uLit;
varying vec2 vQ; varying vec3 vW; varying vec2 vK; varying float vDim;
void main(){
  vec2 wq = clamp(vQ, -1.0, 1.0);                                   // (a varying runs past its range at an antialiased edge)
  float r = vK.y > 1.5 ? max(abs(wq.x), wq.y < 0.45 ? abs(wq.y) : length(vec2(wq.x, (wq.y - 0.45)/0.55))) : (vK.y > 0.5 ? length(wq) : max(abs(wq.x), abs(wq.y)));
  if (vK.y > 0.5 && r > 1.0) discard;
  r = min(r, 1.0);
  // each window wavers on its own, and now and then one dims as someone passes inside
  float fl = 0.82 + 0.18*sin(uTime*(1.3 + fract(vK.x)*2.0) + vK.x*7.0);
  float pass = 1.0 - 0.75*smoothstep(0.93, 0.99, sin(uTime*0.23 + vK.x*3.1));
  float core = 1.0 - 0.55*r*r;
  float warm = fract(vK.x*0.731);
  vec3 c = mix(uGold, vec3(1.0, 0.86, 0.6), 0.35*warm)*(2.6 + 2.0*warm)*core*fl*pass*uLit;
  c *= mix(1.0, clamp(vDim, 0.0, 1.0), 0.6);
  c = mix(c, uFog.rgb, 0.6*bsFogF(length(cameraPosition - vW)));
  ${o?"c *= 0.55;":""}
  gl_FragColor = vec4(max(c, 0.0), 1.0);
}`}),a=new N.Mesh(f,r);return a.frustumCulled=!1,a}async function T0(t,n,h={}){const p=h.streams,s=new N.Group,x={lamps:[],posts:[],lampSizes:[]},f=c0(n),o=c0(n,{mirror:!0}),r=(w,g=f)=>{const v=new N.Mesh(u0(w),g);return s.add(v),v};let a=V();w0(a,p.shore,x,h.marks||[]),r(a),await t.yield(),a=V(),g0(a,x),r(a),await t.yield(),a=V(),M0(a);const e=r(a);await t.yield();const l=$0(p.towers),d=V();for(const w of l)w.near&&d0(d,w,w.tall?24:20);const z=r(d);await t.yield();for(const w of[-1,1]){const g=V();for(const v of l)!v.near&&Math.sign(v.x)===w&&d0(g,v,v.k<=2?16:12);r(g),await t.yield()}const k=k0(p.windows,l);s.add(m0(n,k,{lit:h.windows??1})),await t.yield();const F=new N.Group;return F.scale.y=-1,F.position.y=2*K,F.add(new N.Mesh(z.geometry,o),new N.Mesh(e.geometry,o)),s.add(F),s.add(m0(n,k.filter(w=>Math.abs(w[0])<62),{mirror:!0,lit:h.windows??1})),{object:s,towers:l,windows:k,lamps:x.lamps,lampSizes:x.lamps.map((w,g)=>x.lampSizes[g]??1),posts:x.posts,tiers:x.tiers,stone:f}}export{O as AVENUE_LAMPS,b0 as BANNER_MASTS,b as BASIN,F0 as BRIDGES,j as FLOOR_Y,a0 as JETTIES,T as LAMP_ROW,r0 as MAST_H,y0 as POSTS_X,f0 as PROFILES,m as QUAY_Y,U as RING_LAMPS,W as STAIRS,B as STAIR_LAMPS,p0 as TERRACE,R as TIER_LAMPS,Q as WALL_LAMPS,K as WATER_Y,d0 as addTower,I as lathe,$0 as layoutTowers,k0 as layoutWindows,T0 as makeTown,A as profileRadius,X as stairZ,c0 as stoneMaterial,m0 as windowMesh};
