import*as e from"three";import{BS_NOISE as V,BS_COMMON as F,lin as R,instanced as B,makeAcc as j,vtx as $,tube as P,loft as K,finish as E,litMaterial as I}from"./blue-sails-dry-sea.js";const D=24;function U(v,t={}){const n={...v,uShips:{value:Array.from({length:D},()=>new e.Vector4(0,9999,0,0))},uSandA:{value:new e.Color(t.sand??"#A89A88")},uSandB:{value:new e.Color(t.sandPale??"#F1E6D0")},uBone:{value:new e.Color("#F2EEE6")},uHaze:{value:new e.Color(t.haze??"#A898A6")},uShore:{value:t.shoreZ??-430},uMoonPath:{value:t.moonPath??.3},uStairs:{value:new e.Vector4(0,-400,1,0)}},a=new e.BufferGeometry,l=7e3,o=(t.shoreZ??-430)-2,c=2500;a.setAttribute("position",new e.Float32BufferAttribute([-l,0,c,l,0,c,l,0,o,-l,0,o],3)),a.setIndex([0,1,2,0,2,3]);const r=new e.ShaderMaterial({uniforms:n,vertexShader:"varying vec3 vW; void main(){ vW = position; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.0); }",fragmentShader:`
${F}
${V}
uniform vec4 uShips[${D}]; uniform vec4 uStairs;
uniform vec3 uSandA, uSandB, uBone, uHaze; uniform float uShore, uMoonPath;
varying vec3 vW;
void main(){
  vec2 p = vW.xz; float t = uTime;
  vec3 Vv = cameraPosition - vW; float d = length(Vv); vec3 V = Vv/max(d, 1e-3);
  float fp = max(length(dFdx(p)), length(dFdy(p)));
  // tone: slow drifts of paler and darker sand, old shorelines as long sinuous bands
  float big = bsF3(p/230.0 + 3.0), med = bsF2(p/41.0 + 11.0);
  vec2 sw = vec2(bsF2(p/310.0), bsF2(p/310.0 + 4.1));
  float band = bsF2(vec2(p.x/260.0, p.y/70.0) + 2.2*sw);
  float veins = 1.0 - smoothstep(0.0, 0.05 + 0.002*fp, abs(band - 0.5));
  vec3 alb = mix(uSandA, uSandB, clamp(0.55*big + 0.3*med - 0.1, 0.0, 1.0));
  alb *= 1.0 - 0.16*veins*(1.0 - smoothstep(20.0, 90.0, fp));
  alb *= 0.94 + 0.12*bsN(p*0.9)*(1.0 - smoothstep(0.3, 1.2, fp));                       // grain close by: coarse, fine, and the sand's own sparkle
  alb *= 0.9 + 0.2*bsN(p*7.3 + 1.7)*(1.0 - smoothstep(0.04, 0.3, fp));
  alb *= 0.88 + 0.24*bsH(floor(p*34.0))*(1.0 - smoothstep(0.012, 0.05, fp));
  // shell fragments and small pale stones lie scattered over the bed
  // (few, in loose drifts, no two alike: a cell in eleven holds one, and whole stretches hold none)
  vec2 pc = p*1.3 + 3.0*(vec2(bsN(p*0.21), bsN(p*0.21 + 5.0)) - 0.5), pcI = floor(pc); float pcH = bsH(pcI + 17.0), pcG = bsH(pcI + 41.0);
  vec2 pcJ = fract(pc) - 0.5 - (vec2(bsH(pcI + 3.0), bsH(pcI + 9.0)) - 0.5)*0.8;
  float pcA = pcG*6.2832; pcJ = vec2(cos(pcA)*pcJ.x - sin(pcA)*pcJ.y, sin(pcA)*pcJ.x + cos(pcA)*pcJ.y)*vec2(1.0, 1.5 + 1.5*pcG);
  float speck = step(0.91, pcH)*smoothstep(0.3, 0.6, bsN(p/23.0 + 9.0))*(1.0 - smoothstep(0.025 + 0.05*pcG, 0.05 + 0.07*pcG + fp*1.5, length(pcJ)))*(1.0 - smoothstep(0.03, 0.2, fp));
  alb = mix(alb, mix(uSandB*1.25, uBone*vec3(0.95, 0.82, 0.72), 0.3 + 0.5*pcG), 0.7*speck);
  float fine = 1.0 - smoothstep(0.03, 0.14, fp);
  // relief: broad swells 20 to 70 m long, undulations of 8 m, and ripple marks 1.3 m apart running across the wind;
  // every scale is lit by the low afterglow, and each fades by its own footprint so the bed keeps its grain far out
  float e = 2.0;
  float u0 = bsF2(p/52.0 + 1.3), ux = bsF2((p + vec2(e, 0.0))/52.0 + 1.3), uz = bsF2((p + vec2(0.0, e))/52.0 + 1.3);
  float v0 = bsN(p/9.0 + 5.0), vx = bsN((p + vec2(e, 0.0))/9.0 + 5.0), vz = bsN((p + vec2(0.0, e))/9.0 + 5.0);
  float nearK = 1.0 - smoothstep(2.0, 12.0, fp);
  vec3 N = vec3(-(ux - u0)/e*9.0 - (vx - v0)/e*1.1*nearK, 1.0, -(uz - u0)/e*9.0 - (vz - v0)/e*1.1*nearK);
  alb *= 0.86 + 0.28*u0;
  N.xz += (vec2(bsN(p*5.3), bsN(p*5.3 + 4.7)) - 0.5)*0.22*fine + (vec2(bsN(p*17.0), bsN(p*17.0 + 2.9)) - 0.5)*0.16*fine;      // pocked, grainy close by
  // ripple marks at three sizes (1.3 m, 5 m and 19 m from crest to crest), each fading where a pixel grows wider than its wave
  vec2 rd = normalize(vec2(uWind.x, uWind.y)), rd2 = normalize(rd + vec2(0.35, 0.1)), rd3 = normalize(rd - vec2(0.3, -0.25));
  vec2 rw = p + 6.0*(vec2(bsN(p/13.0), bsN(p/13.0 + 7.3)) - 0.5);
  float patchy = smoothstep(0.1, 0.4, bsN(p/61.0 + 3.0));
  float ra = dot(rw, rd)*4.8 + 2.2*bsN(p/6.0 + 2.0);
  float rm = (1.0 - smoothstep(0.3, 1.1, fwidth(ra)))*(0.45 + 0.55*patchy);
  float rs = ra + 0.6*sin(ra), rcA = cos(rs)*(1.0 + 0.6*cos(ra));                        // a steep lee and a long windward slope
  vec2 rw2 = p + 14.0*(vec2(bsN(p/53.0 + 2.0), bsN(p/53.0 + 9.3)) - 0.5);
  float rb = dot(rw2, rd2)*1.25 + 3.2*bsN(p/19.0 + 4.0);
  float rm2 = (1.0 - smoothstep(0.3, 1.1, fwidth(rb)))*(0.45 + 0.55*patchy);
  vec2 rw3 = p + 50.0*(vec2(bsN(p/190.0 + 6.0), bsN(p/190.0 + 1.3)) - 0.5);
  float rc = dot(rw3, rd3)*0.33 + 2.0*bsN(p/90.0 + 8.0);
  float rm3 = 1.0 - smoothstep(0.3, 1.1, fwidth(rc));
  N.xz -= rd*rcA*0.42*rm + rd2*cos(rb)*0.2*rm2 + rd3*cos(rc)*0.13*rm3;
  alb *= 1.0 - 0.24*rm*(0.5 - 0.5*sin(rs)) - 0.1*rm2*(0.5 - 0.5*sin(rb));

  // the twin tracks of every runner and the blue light under every sail
  float track = 0.0; vec3 sail = vec3(0.0); float glint = 0.0; vec2 gpx = dFdx(p), gpy = dFdy(p);
  for (int i = 0; i < ${D}; i++) {
    vec4 sh = uShips[i];
    float cc = cos(sh.z), sc = sin(sh.z); vec2 rel = p - sh.xy;
    float dx = rel.x*cc + rel.y*sc, dz = rel.y*cc - rel.x*sc;                            // across and astern of this ship
    float line = abs(abs(dx) - 3.0), lw = (abs(gpx.x*cc + gpx.y*sc) + abs(gpy.x*cc + gpy.y*sc))*1.2;
    float tr = (1.0 - smoothstep(0.14, 0.3 + lw, line))*smoothstep(-9.0, -5.0, dz)*(1.0 - smoothstep(60.0, 300.0, dz))*min(1.0, 0.3/(lw + 0.05));
    float rim = (1.0 - smoothstep(0.1, 0.25 + lw, abs(line - 0.42)))*smoothstep(-9.0, -5.0, dz)*(1.0 - smoothstep(40.0, 260.0, dz));
    track = max(track, tr*sh.w*(0.6 + 0.4*bsN(vec2(dz*0.35, sh.x))));
    glint += rim*sh.w*(1.0 - smoothstep(0.02, 0.2, lw));
    vec2 gv = vec2(dx - uTack*3.5, dz - 1.5)/vec2(12.0, 15.0);
    sail += uSailB*exp(-dot(gv, gv));
  }
  alb *= (1.0 - 0.34*track)*(1.0 + 0.3*min(glint, 1.0));
  // the thread of water from the stairs sinks into a dark wet fan
  vec2 wq = (p - uStairs.xy)/vec2(5.0, 9.0); float wet = (1.0 - smoothstep(0.3, 1.0, length(wq)))*step(uStairs.y - 2.0, p.y + 2.0)*uStairs.z;
  alb *= 1.0 - 0.45*wet;
  N = normalize(N);
  // the afterglow lies almost flat along the bed, so every slope that leans toward it lights and every lee goes blue
  float sl = dot(N.xz, normalize(uKeyDir.xz));
  // (the bed is dust, not snow: the afterglow on it is a rose-ochre light that reaches the flats too, and the blue of
  // the sky and the moons is left to the lee slopes, the hollows and the ground under the sails)
  vec3 keyS = mix(uKeyCol, dot(uKeyCol, vec3(0.3333))*vec3(1.25, 1.05, 0.55), 0.8)*1.05;
  vec3 Lg = uSkyCol*(0.29 + 0.12*N.y) + uGndCol*0.25 + keyS*clamp(0.55 + 2.1*sl, 0.05, 1.5) + uMoonCol*0.6*clamp(dot(N, uMoonDir), 0.0, 1.0);
  vec3 col = alb*Lg;
  col += alb*sail*1.0;
  // the moons' light lies on the sand as a long soft path, and wet sand and ripple crests glint in it
  vec3 R = reflect(-V, N);
  float mg = clamp(dot(R, uMoonDir), 0.0, 1.0); float mg2 = mg*mg; mg2 *= mg2; mg2 *= mg2;
  col += uMoonCol*alb*(mg2*1.6*uMoonPath + mg2*mg2*mg2*4.0*wet);
  // sand streamers: thin pale veils sliding over the bed downwind
  vec2 wd = normalize(uWind), wn = vec2(-wd.y, wd.x);
  float al = dot(p, wd), ac = dot(p, wn);
  float sn = bsN(vec2(ac/2.6 + 3.0*bsN(vec2(al/31.0 - t*0.21, ac/17.0)), al/38.0 - t*0.42));
  float spatch = smoothstep(0.35, 0.7, bsF2(vec2(al/120.0 - t*0.05, ac/90.0) + 6.0));
  float streak = smoothstep(0.5, 0.82, sn)*spatch*(1.0 - smoothstep(0.5, 3.0, fwidth(ac/2.6)));
  // and close to the eye the finer drift: quick thin veils of sand smoking along the bed
  float sn2 = bsN(vec2(ac/0.8 + 2.4*bsN(vec2(al/9.0 - t*0.9, ac/4.0)), al/12.0 - t*1.5));
  float sn3 = bsN(vec2(ac/0.31 + 1.7*bsN(vec2(al/5.0 - t*1.3, ac/2.0 + 7.0)), al/7.0 - t*2.3));
  float drift = (smoothstep(0.52, 0.9, sn2)*(1.0 - smoothstep(0.03, 0.3, fp)) + 0.7*smoothstep(0.6, 0.95, sn3)*(1.0 - smoothstep(0.01, 0.1, fp)))*(0.3 + 0.7*spatch);
  col = mix(col, (uSandB*1.1)*(uSkyCol*0.5 + keyS*0.9 + uMoonCol*0.4), clamp(0.36*streak + 0.42*drift, 0.0, 0.8));
  // a low haze lies on the bed: more of it the longer the line of sight runs near the ground, rose toward the afterglow
  float west = clamp(dot(normalize(-Vv.xz + vec2(1e-4)), normalize(uKeyDir.xz)), 0.0, 1.0);
  float hz = 1.0 - exp(-d*0.0034*(0.65 + 0.35*bsN(p/140.0 + vec2(t*0.02, 0.0))));
  vec3 hazeCol = mix(uFog.rgb, uHaze*(0.5 + 0.9*west*west), 0.6);
  col = mix(col, hazeCol, hz*0.36);
  col = mix(col, uFog.rgb, bsFogF(d));
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}`}),i=new e.Mesh(a,r);return i.frustumCulled=!1,{object:i,uniforms:n,material:r}}function Y(v,t={}){const n={uDir:{value:[new e.Vector3(0,.2,-1),new e.Vector3(0,.4,-1)]},uCol:{value:[new e.Color("#FFF1D8"),new e.Color("#CFE0FF")]},uPhase:{value:new e.Vector2(t.phaseA??.72,t.phaseB??.6)},uGain:{value:t.gain??2.5},uTime:v.uTime},a=[],l=[],o=[];for(let d=0;d<2;d++){const f=d*4;a.push(-1,-1,0,1,-1,0,1,1,0,-1,1,0),o.push(d,d,d,d),l.push(f,f+1,f+2,f,f+2,f+3)}const c=new e.BufferGeometry;c.setAttribute("position",new e.Float32BufferAttribute(a,3)),c.setAttribute("aWhich",new e.Float32BufferAttribute(o,1)),c.setIndex(l);const r=new e.ShaderMaterial({uniforms:n,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,vertexShader:`
uniform vec3 uDir[2]; attribute float aWhich; varying vec2 vQ; varying float vM;
void main(){
  vec3 dir = normalize(aWhich < 0.5 ? uDir[0] : uDir[1]);
  float rad = aWhich < 0.5 ? 0.0218 : 0.0131;                       // 1.25 and 0.75 degrees
  vec3 rt = normalize(cross(dir, vec3(0.0, 1.0, 0.0))), up = cross(rt, dir);
  float halo = 5.0;
  vec3 wp = cameraPosition + (dir + (rt*position.x + up*position.y)*rad*halo)*2600.0;
  vQ = position.xy*halo; vM = aWhich;
  vec4 c = projectionMatrix*viewMatrix*vec4(wp, 1.0);
  gl_Position = c;
}`,fragmentShader:`
uniform vec3 uCol[2]; uniform vec2 uPhase; uniform float uGain, uTime; varying vec2 vQ; varying float vM;
float h2(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.x); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f); return mix(mix(h2(i), h2(i + vec2(1., 0.)), f.x), mix(h2(i + vec2(0., 1.)), h2(i + vec2(1., 1.)), f.x), f.y); }
void main(){
  float r2 = dot(vQ, vQ), r = sqrt(r2);
  vec3 col = vM < 0.5 ? uCol[0] : uCol[1]; float ph = vM < 0.5 ? uPhase.x : uPhase.y;
  float disc = 1.0 - smoothstep(0.94, 1.0, r);
  float z = sqrt(max(1.0 - r2, 0.0));
  vec3 n = vec3(vQ, z);
  float a = (ph - 0.5)*3.1416;                                        // the sun stands to the left: gibbous, waxing
  vec3 L = normalize(vec3(-cos(a), 0.22, sin(a)));
  float lit = smoothstep(-0.04, 0.12, dot(n, L))*(0.55 + 0.45*clamp(dot(n, L), 0.0, 1.0));
  float maria = 0.72 + 0.28*n2(vQ*2.6 + vM*17.0) + 0.14*n2(vQ*7.0 + 3.0) - 0.1;
  float crat = smoothstep(0.55, 0.8, n2(vQ*4.4 + 9.0 + vM*5.0));
  vec3 c = col*uGain*disc*(lit*maria*(1.0 - 0.18*crat) + 0.02);
  float halo = exp(-max(r - 0.9, 0.0)*1.9)*0.07*(1.0 - disc*0.9);
  c += col*halo*uGain*0.5;
  gl_FragColor = vec4(c, 1.0);
}`}),i=new e.Mesh(c,r);return i.frustumCulled=!1,i.renderOrder=-.5,{object:i,uniforms:n}}const A=(v,t,n)=>{const a=Math.min(1,Math.max(0,(n-v)/(t-v)));return a*a*(3-2*a)};function L(v,t,n){const a=Math.abs(t);if(a<=300&&n<=-450&&n>=-850)return-120;const l=a<=352?-432:-432+.3*(a-352),o=l-n;if(o<=0)return-3;const c=10+35*A(40,240,a),r=A(300,352,a),i=(c+(46-c)*r)*A(0,70,o),d=Math.max(A(900,1500,-n),A(352,800,a)),f=Math.pow(.5+.5*v.fbm2(t/520+3.1,n/520-1.7,3),1.5);return i+(18+125*f)*d*A(0,220,o)+9*v.n2(t/170,n/170)*A(40,220,o)}function ee(v,t,n={}){const f=[],b=[];for(let g=0;g<=45;g++)for(let M=0;M<=96;M++){const s=-2400+M*50,x=-2600+g*50;f.push(s,L(t,s,x),x)}for(let g=0;g<45;g++)for(let M=0;M<96;M++){const s=g*97+M;b.push(s,s+96+1,s+1,s+1,s+96+1,s+96+2)}const w=new e.BufferGeometry;w.setAttribute("position",new e.Float32BufferAttribute(f,3)),w.setIndex(b),w.computeVertexNormals();const p=new e.ShaderMaterial({uniforms:{...v,uHillA:{value:new e.Color(n.hill??"#6C6AA8")},uHillB:{value:new e.Color(n.hillPale??"#B79AA8")}},vertexShader:"varying vec3 vW, vN; void main(){ vW = position; vN = normal; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.0); }",fragmentShader:`
${F}
${V}
uniform vec3 uHillA, uHillB;
varying vec3 vW, vN;
void main(){
  if (vW.y < -2.5) discard;
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  float d = length(cameraPosition - vW);
  float n = bsF3(vW.xz/60.0) , m = bsF2(vW.xz/13.0 + 4.0);
  N = normalize(N + vec3(n - 0.5, 0.0, m - 0.5)*0.35);
  vec3 alb = mix(uHillA, uHillB, clamp(0.25 + 0.5*n + 0.2*m - 0.4*smoothstep(10.0, 120.0, vW.y), 0.0, 1.0))*0.55;
  // dry gullies running down the slopes
  float gul = smoothstep(0.42, 0.5, abs(bsF2(vec2(vW.x/34.0 + n*1.5, vW.z/90.0)) - 0.5));
  alb *= 0.8 + 0.2*gul;
  vec3 c = alb*bsLight(N);
  gl_FragColor = vec4(bsFog(c, d*1.25), 1.0);
}`}),h=new e.Mesh(w,p);return h.frustumCulled=!1,{object:h,triangles:b.length/3}}const T=`
uniform vec4 uCanopy[2]; uniform vec3 uHead[2];
vec3 birdPos(vec4 sd, float fl, out vec3 fwd){
  vec4 cn = fl < 0.5 ? uCanopy[0] : uCanopy[1]; vec3 hd = fl < 0.5 ? uHead[0] : uHead[1];
  vec3 side = normalize(cross(hd, vec3(0.0, 1.0, 0.0)) + vec3(1e-5, 0.0, 0.0));
  float a = sd.x, t = uTime;
  vec3 fan = cn.xyz + hd*(11.0 + 59.0*a) + side*(sd.y*(3.0 + 34.0*a)) + vec3(0.0, 2.5 + 4.0*a + sd.w*(1.5 + 11.0*a), 0.0);
  fan += side*1.3*sin(t*0.9 + sd.z*6.0) + vec3(0.0, 0.9*sin(t*1.3 + sd.z*9.0), 0.0) + hd*1.6*sin(t*0.6 + sd.z*4.0);
  // settled, they wheel slowly round the canopy as a wide flat ring of sparks
  float th = t*(0.22 + 0.2*a)*(sd.y > 0.0 ? 1.0 : -1.0) + sd.z*6.283, rr = 9.0 + 22.0*a*a;
  vec3 ring = cn.xyz + vec3(cos(th)*rr, 1.5 + 5.0*abs(sd.w)*(0.4 + a) + 1.6*sin(th*2.0 + sd.z*5.0), sin(th)*rr);
  vec3 tang = vec3(-sin(th), 0.0, cos(th))*(sd.y > 0.0 ? 1.0 : -1.0);
  fwd = normalize(mix(hd, tang, cn.w) + vec3(0.0, 1e-4, 0.0));
  return mix(fan, ring, cn.w);
}`;function te(v,t={}){const n=t.rng,a=t.flocks??1,l=t.count??900,o=l*a,c=new e.Group,r={...v,uCanPh:{value:new e.Vector2(t.phase?.[0]??0,t.phase?.[1]??0)},uCanopy:{value:[new e.Vector4(0,60,-300,0),new e.Vector4(0,-500,0,0)]},uHead:{value:[new e.Vector3(1,0,0),new e.Vector3(-1,0,0)]}},i=new Float32Array(o*4),d=new Float32Array(o);for(let m=0;m<o;m++){const S=Math.pow(n(),.7);i.set([S,(n()*2-1)*(.35+.65*n()),n(),n()*2-1],m*4),d[m]=m<l?0:1}const f=[0,0,.3,-.05,0,0,.05,0,0,0,0,-.75,-.04,0,.12,-.04,0,-.1,-.3,0,-.06,-.26,0,.1,.04,0,.12,.04,0,-.1,.3,0,-.06,.26,0,.1],b=[0,0,0,0,0,0,1,1,0,0,1,1],w=[1,1,1,-.4,.5,.5,.15,.15,.5,.5,.15,.15],p=new e.BufferGeometry;p.setAttribute("position",new e.Float32BufferAttribute(f,3)),p.setAttribute("aW",new e.Float32BufferAttribute(b,1)),p.setAttribute("aHot",new e.Float32BufferAttribute(w,1)),p.setIndex([0,1,2,1,3,2,4,5,6,4,6,7,8,10,9,8,11,10]);const h=new e.Mesh(B(p,o,[["aSeed",i,4],["aFlock",d,1]]),new e.ShaderMaterial({uniforms:r,side:e.DoubleSide,vertexShader:`
${F}
${T}
attribute vec4 aSeed; attribute float aFlock, aW, aHot; varying vec3 vC; varying float vD;
void main(){
  vec3 fwd; vec3 c = birdPos(aSeed, aFlock, fwd);
  vec3 sx = cross(fwd, vec3(0.0, 1.0, 0.0)); float sxl = length(sx);                      // (a bird that heads straight up or down has no such side: it takes a fixed one)
  vec3 side = sxl > 1e-4 ? sx/sxl : vec3(1.0, 0.0, 0.0), up = cross(side, fwd);
  float d = length(cameraPosition - c), k = max(1.0, 2.6*uPx*d/0.6);                       // never less than a few pixels of wing
  float flap = sin(uTime*(9.0 + 4.0*aSeed.z) + aSeed.z*40.0);
  vec3 lp = position; lp.y += aW*flap*0.24; lp.x *= 1.0 - 0.3*aW*flap*flap;
  vec3 wp = c + (side*lp.x + up*lp.y + fwd*lp.z)*k;
  float hot = clamp(aHot, 0.0, 1.0);
  vC = mix(vec3(1.0, 0.24, 0.03), vec3(1.0, 0.56, 0.16), hot)*(aHot < 0.0 ? 0.9 : 1.5 + 1.6*hot)*(0.75 + 0.25*flap)*min(1.0, 1.5/k + 0.12);
  vD = d;
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,fragmentShader:`
${F}
varying vec3 vC; varying float vD;
void main(){ gl_FragColor = vec4(mix(max(vC, 0.0), uFog.rgb, 0.5*bsFogF(max(vD, 0.0))), 1.0); }`}));h.frustumCulled=!1,c.add(h);const g=6,M=[],s=[];for(let m=0;m<=g;m++)M.push(m/g,-1,0,m/g,1,0);for(let m=0;m<g;m++){const S=m*2;s.push(S,S+2,S+3,S,S+3,S+1)}const x=new e.BufferGeometry;x.setAttribute("position",new e.Float32BufferAttribute(M,3)),x.setIndex(s);const u=new e.Mesh(B(x,o,[["aSeed",i,4],["aFlock",d,1]]),new e.ShaderMaterial({uniforms:r,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:e.DoubleSide,vertexShader:`
${F}
${T}
attribute vec4 aSeed; attribute float aFlock; varying float vA;
void main(){
  vec3 fwd; vec3 b = birdPos(aSeed, aFlock, fwd);
  vec4 cn = aFlock < 0.5 ? uCanopy[0] : uCanopy[1];
  float k = aSeed.z*6.283 + aSeed.y*2.0, s = position.x;
  vec3 at = cn.xyz + vec3(cos(k)*6.6, -0.2, sin(k)*6.6);
  float len = length(b - at);
  vec3 wp = mix(at, b, s) - vec3(0.0, sin(3.1416*s)*len*(0.05 + 0.25*cn.w), 0.0);
  wp += vec3(sin(uTime*1.7 + s*9.0 + aSeed.z*20.0), cos(uTime*1.3 + s*7.0 + aSeed.z*11.0), 0.0)*0.35*sin(3.1416*s);
  vec3 Vv = cameraPosition - wp; float d = length(Vv);
  vec3 sd = normalize(cross(b - at, Vv) + vec3(0.0, 1e-4, 0.0));
  float w = max(0.05, 0.6*uPx*d);
  wp += sd*position.y*w;
  vA = 0.22*min(1.0, 0.05/w)*(0.4 + 0.6*s)*(1.0 - 0.8*cn.w)*(1.0 - bsFogF(d));
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,fragmentShader:`
${F}
varying float vA;
void main(){ vec3 c = vec3(0.55, 0.9, 0.66)*(uSkyCol*1.0 + uKeyCol*0.6 + uMoonCol*0.4 + uGold*0.3); float a = clamp(vA, 0.0, 1.0); gl_FragColor = vec4(c*a, a); }`}));u.frustumCulled=!1,u.renderOrder=5,c.add(u);const y=[],W=[],z=[],N=20,G=5;for(let m=0;m<=G;m++)for(let S=0;S<=N;S++)y.push(0,0,0),W.push(S/N,m/G);for(let m=0;m<G;m++)for(let S=0;S<N;S++){const C=m*(N+1)+S;z.push(C,C+1,C+N+2,C,C+N+2,C+N+1)}const H=new e.BufferGeometry;H.setAttribute("position",new e.Float32BufferAttribute(y,3)),H.setAttribute("uv",new e.Float32BufferAttribute(W,2)),H.setIndex(z);const _=new e.Mesh(B(H,a,[["aFlock",new Float32Array(a===2?[0,1]:[0]),1]]),new e.ShaderMaterial({uniforms:r,side:e.DoubleSide,vertexShader:`
${F}
${T}
attribute float aFlock; varying vec3 vN, vW; varying float vR;
uniform vec2 uCanPh; float cph = 0.0;                              // where in its ripple and bob this canopy starts (the world draws it)
vec3 dome(float a, float r, vec4 cn){
  float rip = (0.35*sin(a*5.0 + uTime*2.3 + cph) + 0.22*sin(a*9.0 - uTime*3.1 + cph*1.7))*r*r*(1.0 - 0.6*cn.w);
  return vec3(cos(a)*r*7.0, 1.9*(1.0 - r*r) - 0.3 + rip + 0.25*sin(uTime*1.1 + cph*0.6)*(1.0 - r), sin(a)*r*7.0);
}
void main(){
  vec4 cn = aFlock < 0.5 ? uCanopy[0] : uCanopy[1]; cph = aFlock < 0.5 ? uCanPh.x : uCanPh.y;
  float a = uv.x*6.2832, r = uv.y;
  vec3 p = dome(a, r, cn), px = dome(a + 0.05, r, cn), pr = dome(a, r + 0.05, cn);
  vN = normalize(cross(pr - p, px - p) + vec3(0.0, 1e-4, 0.0)); vW = cn.xyz + p; vR = r;
  gl_Position = projectionMatrix*viewMatrix*vec4(vW, 1.0);
}`,fragmentShader:`
${F}
varying vec3 vN, vW; varying float vR;
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0)); if (!gl_FrontFacing) N = -N;
  vec3 alb = vec3(0.78, 0.76, 0.74)*(0.92 + 0.08*sin(clamp(vR, 0.0, 1.0)*40.0));
  vec3 c = alb*bsLight(N) + alb*uGold*0.5*clamp(-N.y*0.5 + 0.5, 0.0, 1.0);             // the birds' fire lights it from ahead and below
  gl_FragColor = vec4(bsFog(c, length(cameraPosition - vW)), 1.0);
}`}));return _.frustumCulled=!1,c.add(_),{object:c,uniforms:r,count:o}}function oe(v,t){const n=t.length,a=new Float32Array(n*4),l=new Float32Array(n*4);t.forEach((r,i)=>{a.set([r.x,r.y,r.z,r.r],i*4),l.set([r.ph,r.roam,i*.618%1,i*.383%1],i*4)});const o=new e.BufferGeometry;o.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),o.setIndex([0,1,2,0,2,3]);const c=new e.Mesh(B(o,n,[["iP",a,4],["iS",l,4]]),new e.ShaderMaterial({uniforms:v,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,vertexShader:`
${F}
attribute vec4 iP, iS; varying vec2 vQ; varying vec3 vK;
void main(){
  float t = uTime, ph = iS.x;
  vec3 wp = iP.xyz + vec3(sin(t*0.09 + ph)*iS.y + sin(t*0.31 + ph*2.0)*2.0, sin(t*0.21 + ph*3.0)*(2.0 + iS.y*0.08), cos(t*0.07 + ph*1.7)*iS.y);
  vec4 mv = viewMatrix*vec4(wp, 1.0);
  float d = -mv.z, r = max(iP.w, 3.0*uPx*d), halo = 4.0;
  mv.xy += position.xy*r*halo;
  vQ = position.xy*halo; vK = vec3(ph, sqrt(min(1.0, iP.w/r))*(0.75 + 0.25*sin(t*(0.7 + iS.z) + ph*4.0))*(1.0 - 0.8*bsFogF(d)), iS.w);
  gl_Position = projectionMatrix*mv;
}`,fragmentShader:`
${F}
${V}
varying vec2 vQ; varying vec3 vK;
void main(){
  float r = length(vQ), t = uTime;
  float ang = atan(vQ.y, vQ.x + 1e-5);
  float fl = bsN(vec2(ang*2.5 + vK.x*9.0, r*3.0 - t*1.4)) ;
  float core = 1.0 - smoothstep(0.55 + 0.3*fl, 1.0 + 0.25*fl, r);
  float inner = exp(-r*r*2.2);
  float halo = exp(-r*1.3)*0.3;
  vec3 c = vec3(0.07, 0.3, 1.0)*(1.5*core + 0.9*halo) + vec3(0.22, 0.5, 1.0)*0.5*inner*core;
  gl_FragColor = vec4(c*max(vK.y, 0.0)*1.3, 1.0);
}`}));return c.frustumCulled=!1,c.renderOrder=4,{object:c}}const Q=R("#F2EEE6"),k=v=>[Q[0]*v,Q[1]*v*.98,Q[2]*v];function q(v,t){const a=[],l=[];for(let o=0;o<=20;o++)a.push([.1*Math.sin(o*.5),.1,-4.4+o*.44]),l.push(o%2?.36:.2);P(v,a,l,5,k(.8),.1);for(let o=0;o<7;o++){const c=-3.9+o*7.8/6,r=.6+.4*Math.sin(Math.PI*(o+.6)/(7+.2));for(const i of[-1,1]){const d=t()<.4,f=d?1+Math.floor(t()*4):5,b=[],w=[];for(let p=0;p<=f;p++){const h=p/5,g=h*2.35;b.push([i*(.2+2.5*r*Math.sin(g)*(1-.15*h)),.1+2.9*r*(1-Math.cos(g))*.6,c+.5*h*(o/6-.5)+.1*Math.sin(o*2.1+p)]),w.push(.26*(1-.62*h)+.05)}P(v,b,w,5,b.map((p,h)=>k(.78+.22*h/5)),.1)}}}function O(v,t){const n=[],a=[],l=[],c=2.4+t()*.5;for(let r=0;r<=38;r++){const i=r/38,d=i*c*6.283,f=.16*Math.exp(.17*d);n.push([Math.cos(d)*f,0,Math.sin(d)*f]),a.push(Math.max(.04,.46*f*(r%2?1:.86))*(r===38?.7:1)),l.push(k(.72+.28*(r%2)-.1*i))}P(v,n,a,7,l,.1)}function Z(v,t){const n=2+Math.floor(t()*3);for(let a=0;a<n;a++){const l=(t()-.5)*3.2,o=(t()-.5)*3.2,c=(t()-.5)*1.6,r=2.2+t()*2.4,i=.5+t()*.9,d=t()*6.283,f=[],b=[];for(let w=0;w<=6;w++){const p=w/6,h=c*.4+i*p;f.push([l+Math.cos(d)*Math.sin(h)*r*p,-.3+Math.cos(h)*r*p,o+Math.sin(d)*Math.sin(h)*r*p]),b.push(.3*(1-.8*p)+.04)}P(v,f,b,6,f.map((w,p)=>k(.74+.26*p/6)),.1)}}function X(v,t){const n=4+Math.floor(t()*4);for(let a=0;a<n;a++){const l=(a-n/2)*.95+(t()-.5)*.5,o=Math.sin(a*.8)*.7+(t()-.5)*.6,c=.3+t()*.2,r=t()*3.14,i=Math.cos(r)*.3,d=Math.sin(r)*.3;P(v,[[l-i,.12,o-d],[l-i*.6,.16,o-d*.6],[l+i*.6,.16,o+d*.6],[l+i,.12,o+d]],[c*.5,c,c,c*.5],6,k(.8+.2*t()),.1),t()<.6&&P(v,[[l,.2,o],[l+(t()-.5)*.5,.9+t()*.5,o+(t()-.5)*.5]],[.12,.04],4,k(.9),.1)}}function ae(v,t,n){const a=j(),l=new e.Group,o=new e.Matrix4,c=new e.Quaternion,r=new e.Euler,i=new e.Vector3,d=new e.Vector3,f=[4.6,2.2,2.6,2.6],b=[2.6,1.2,3.6,.9];for(const u of t){const y=j();[q,O,Z,X][u.kind](y,n),r.set(u.tilt||0,u.rot||0,u.roll||0,"YXZ"),c.setFromEuler(r),o.compose(i.set(u.x,-(u.sink||0)*u.s,u.z),c,d.set(u.s,u.s,u.s));const W=a.n;for(let z=0;z<y.n;z++)i.set(y.p[z*3],y.p[z*3+1],y.p[z*3+2]).applyMatrix4(o),$(a,i.x,i.y,i.z,[y.c[z*3],y.c[z*3+1],y.c[z*3+2]],y.g[z]);for(const z of y.i)a.i.push(W+z)}const w=E(a),p=new e.Mesh(w,I(v,{mode:"plain",bounce:.5}));p.frustumCulled=!1,l.add(p);const h=t.length,g=new Float32Array(h*4),M=new Float32Array(h*4);t.forEach((u,y)=>{g.set([u.x,u.z,f[u.kind]*u.s,b[u.kind]*u.s*Math.max(1-(u.sink||0),.3)],y*4),M.set([u.rot||0,y*1.7,0,0],y*4)});const s=new e.BufferGeometry;s.setAttribute("position",new e.Float32BufferAttribute([-1,0,-1,1,0,-1,1,0,1,-1,0,1],3)),s.setIndex([0,2,1,0,3,2]);const x=new e.Mesh(B(s,h,[["iP",g,4],["iS",M,4]]),new e.ShaderMaterial({uniforms:v,transparent:!0,depthWrite:!1,side:e.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:`
${F}
attribute vec4 iP, iS; varying vec2 vQ; varying vec3 vW; varying float vL;
void main(){
  vec2 away = -normalize(uKeyDir.xz), side = vec2(-away.y, away.x);
  float len = iP.z + min(iP.w*2.6, 9.0);                                // the shadow runs out from under it, away from the low light
  vec2 c = iP.xy + away*(len - iP.z)*0.5;
  vec2 w = c + side*position.x*iP.z*1.25 + away*position.z*(len*0.5 + iP.z*0.25);
  vQ = position.xz; vW = vec3(w.x, 0.03, w.y); vL = (len - iP.z)/max(len, 1e-3);
  gl_Position = projectionMatrix*viewMatrix*vec4(vW, 1.0);
}`,fragmentShader:`
${F}
varying vec2 vQ; varying vec3 vW; varying float vL;
void main(){
  vec2 q = clamp(vQ, -1.0, 1.0); float r = length(q);
  float a = (1.0 - smoothstep(0.35, 1.0, r))*0.5;
  float d = length(cameraPosition - vW);
  gl_FragColor = vec4(uSkyCol*0.16*(1.0 - bsFogF(d)) + uFog.rgb*bsFogF(d), a*(1.0 - bsFogF(d)));
}`}));return x.frustumCulled=!1,x.renderOrder=1,l.add(x),{object:l,triangles:w.userData.triangles}}function se(v,t){const n=j(),a=k(.8),l=k(.95),o=[],c=[],r=[1,.8,1.1,.9,1.15,.75],i=[.55,.7,.5,.75,.6,.62];for(let s=0;s<6;s++){const x=s/6*6.283+s%2*.25;o.push([Math.cos(x)*r[s],-.1,Math.sin(x)*r[s],a]),c.push([Math.cos(x)*i[s],.8+.2*(s%3)*.5,Math.sin(x)*i[s],l])}K(n,[o,c],!0,!0);const d=c.map(s=>$(n,s[0],s[1],s[2],l,0));for(let s=1;s<5;s++)n.i.push(d[0],d[s+1],d[s]);const f=E(n,!0),b=new e.InstancedMesh(f,I(v,{mode:"plain",bounce:.4}),t.length),w=new e.Matrix4,p=new e.Quaternion,h=new e.Euler,g=new e.Vector3,M=new e.Vector3;return t.forEach((s,x)=>{h.set(0,s.rot,0),p.setFromEuler(h),w.compose(g.set(s.x,-.02,s.z),p,M.set(s.s,s.s*s.flat,s.s*(.7+.6*s.tone))),b.setMatrixAt(x,w)}),b.instanceMatrix.needsUpdate=!0,b.frustumCulled=!1,{object:b}}export{D as MAX_SHIPS,L as hillHeight,ae as makeBones,te as makeFlameBirds,oe as makeGlobes,ee as makeHills,Y as makeMoons,U as makeSand,se as makeStones};
