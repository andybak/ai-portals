import*as e from"three";import{mergeVertices as Qe}from"three/addons/utils/BufferGeometryUtils.js";const $e=["#1d2e2c","#2b2547","#6a5aa8","#9fe0d0","#0b1c52","#fff3da","#ff5a3c"],de=1e3,D=3e3,he=400,Ae=1500,Me=Math.PI*2;async function Xe(t,r){const A=new Float32Array(65536),d=new Float32Array(256*256),m=[[5,1],[11,.5],[23,.27],[47,.12]];for(const[a,v]of m){const b=new Float32Array(a*a*2);for(let V=0;V<b.length;V++)b[V]=.15+.7*t();for(let V=0;V<256;V++){const B=V/256*a,z=Math.floor(B);for(let s=0;s<256;s++){const f=s/256*a,O=Math.floor(f);let S=9;for(let _=-1;_<=1;_++)for(let W=-1;W<=1;W++){const F=((O+W)%a+a)%a,Y=((z+_)%a+a)%a,p=(Y*a+F)*2,k=O+W+b[p]-f,U=z+_+b[p+1]-B,$=k*k+U*U;$<S&&(S=$)}const h=Math.max(0,1-S/.72);A[V*256+s]+=v*Math.sqrt(h)}(V&31)===31&&await r()}}const H=a=>{const v=new Float32Array(a*a);for(let b=0;b<v.length;b++)v[b]=t();return v};let M=1,w=0;for(const a of[4,8,16,32]){const v=H(a);for(let b=0;b<256;b++){const V=b/256*a,B=Math.floor(V),z=V-B,s=z*z*(3-2*z);for(let f=0;f<256;f++){const O=f/256*a,S=Math.floor(O),h=O-S,_=h*h*(3-2*h),W=(S+1)%a,F=(B+1)%a,Y=v[B*a+S],p=v[B*a+W],k=v[F*a+S],U=v[F*a+W];d[b*256+f]+=M*(Y+(p-Y)*_+(k-Y)*s+(Y-p-k+U)*_*s)}}await r(),w+=M,M*=.55}let x=1e9,P=-1e9;for(let a=0;a<A.length;a++)x=Math.min(x,A[a]),P=Math.max(P,A[a]);await r();const u=new Uint8Array(256*256*4),n=(a,v)=>(A[(v+256)%256*256+(a+256)%256]-x)/(P-x);await r();for(let a=0;a<256;a++)for(let v=0;v<256;v++){v===0&&(a&63)===63&&await r();const b=(a*256+v)*4,V=n(v,a),B=(n(v+1,a)-n(v-1,a))*6,z=(n(v,a+1)-n(v,a-1))*6;u[b]=Math.round(V*255),u[b+1]=Math.round(Math.min(1,Math.max(0,.5+B))*255),u[b+2]=Math.round(Math.min(1,Math.max(0,.5+z))*255),u[b+3]=Math.round(Math.min(1,Math.max(0,d[a*256+v]/w))*255)}const y=new e.DataTexture(u,256,256,e.RGBAFormat,e.UnsignedByteType);return y.wrapS=y.wrapT=e.RepeatWrapping,y.magFilter=e.LinearFilter,y.minFilter=e.LinearMipmapLinearFilter,y.generateMipmaps=!0,y.needsUpdate=!0,y}const Le=`
  #define PI2 6.28318530718
  uniform sampler2D uTex;
  uniform float uScroll, uNC, uNRH, uNR, uRH, uBulge, uH, uR0, uR1, uTw, uTau;
  uniform vec2 uSeed;
  float prof(float t){ return mix(uR0, uR1, smoothstep(0.52, 1.0, t)) * (1.0 + 0.10 * smoothstep(0.22, 0.0, t)); }
  vec2 h2(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
  vec2 canonC(vec2 ic){ float k = floor(ic.x / uNC); return vec2(ic.x - k * uNC, ic.y + k * uNRH); }
  // F1, F2, nearest cell centre (unwrapped lattice coords); idc = canonical cell id
  vec4 cells(vec2 c, out vec2 idc){
    vec2 ic = floor(c), fc = c - ic; float f1 = 9.0, f2 = 9.0; vec2 bc = vec2(0.0); idc = vec2(0.0);
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j)); vec2 cc = canonC(ic + g); vec2 r = h2(cc + uSeed);
      vec2 o = g + 0.5 + (r - 0.5) * 0.62; float d = length(o - fc);
      if (d < f1) { f2 = f1; f1 = d; bc = ic + o; idc = cc; } else if (d < f2) { f2 = d; }
    }
    return vec4(f1, f2, bc);
  }
  // lattice coords of a wall point: x = column around the nave, y = helical row
  // (columns lean against the rows by uTau turns per lap, so the whole lattice corkscrews)
  vec2 latt(float th, float y){ float a = th / PI2, yp = y + uScroll; return vec2(a * uNC + yp * uTw, yp / uRH - a * uNRH); }
  // inverse: lattice coords -> (angle, local height)
  vec2 unlatt(vec2 c){ float yp = (c.y + c.x * uNRH / uNC) * uRH / (1.0 + uTau); return vec2((c.x - yp * uTw) / uNC * PI2, yp - uScroll); }
  // pillow profile: steep at the seams between cells, round on top
  float pillow(vec4 ce){ float b = 1.0 - clamp((ce.y - ce.x) / 0.8, 0.0, 1.0); return 1.0 - b * b * (0.6 + 0.4 * b); }
  // some cells are thin recessed bays between the buttresses: the windows
  float thinOf(vec2 idc){ return smoothstep(0.56, 0.86, h2(idc + uSeed + 7.3).x); }
  // the seams between buttresses wander like the edges of cauliflower lobes instead of running straight (periodic in the lattice)
  vec2 lwarp(vec2 c){ vec2 q = vec2(c.x / uNC * 3.0, c.y);
    return c + (vec2(textureLod(uTex, q, 3.0).a, textureLod(uTex, q + vec2(0.37, 0.61), 3.0).a) - 0.5) * 0.9; }
`,Be=`
  float fogFade(){
    #ifdef USE_FOG
      #ifdef FOG_EXP2
        return exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
      #else
        return 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
      #endif
    #else
      return 1.0;
    #endif
  }
`,Ze=`
  ${Le}
  varying vec2 vC; varying vec3 vN; varying vec3 vT; varying vec3 vP; varying float vDisp; varying vec3 vV; varying float vSl;
  #include <fog_pars_vertex>
  vec3 wallPos(float th, float y, out float disp){
    vec2 c = latt(th, y); vec2 idc; vec4 ce = cells(lwarp(c), idc);
    float h = pillow(ce), thin = thinOf(idc);
    h = mix(h, h * h * (3.0 - 2.0 * h), 0.7);                              // rounded crowns and soft valleys: cauliflower, not ridges
    vec4 ta = textureLod(uTex, vec2(c.x / uNC * 8.0, c.y), 4.3);          // mips coarser than the mesh spacing: soft lumps, no spikes
    vec4 tb = textureLod(uTex, vec2(c.x / uNC * 5.0, c.y * 3.0), 5.0);
    vec4 tm = textureLod(uTex, vec2(c.x / uNC * 13.0, c.y * 2.0) + 0.21, 4.7);  // a middle size of billow, to break the long ridges
    disp = h * uBulge * (1.0 - 0.72 * thin) + (ta.r - 0.45) * 135.0 * (0.3 + 0.7 * h) * (1.0 - 0.5 * thin) + (tb.a - 0.5) * 90.0 + (tm.r - 0.45) * 60.0 * (0.35 + 0.65 * h);
    float tt = y / uH; disp *= smoothstep(0.0, 0.05, tt) * (1.0 - smoothstep(0.88, 0.995, tt)) * min(1.0, prof(tt) / uR0);   // buttresses shrink with the throat
    float r = prof(y / uH) - disp;
    return vec3(cos(th) * r, y, sin(th) * r);
  }
  void main(){
    float th = uv.x * PI2, y = uv.y * uH, d0, d1, d2;
    vec3 p = wallPos(th, y, d0);
    vec3 pa = wallPos(th + 0.014, y, d1);
    vec3 pb = wallPos(th, y + 14.0, d2);
    vec3 n = normalize(cross(pb - p, pa - p));
    vec3 inward = -vec3(cos(th), 0.0, sin(th));
    if (dot(n, inward) < 0.0) n = -n;
    vSl = 1.0 - dot(n, inward);                                            // how steep the flank is here
    n = normalize(mix(n, inward, 0.74));                                   // cloud, not rock: more than half way back to the smooth tube
    vN = n; vT = vec3(-sin(th), 0.0, cos(th)); vP = p; vC = latt(th, y); vDisp = d0;
    vV = cameraPosition - (modelMatrix * vec4(p, 1.0)).xyz;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`,Je=`
  ${Le}
  uniform vec4 uHead[5]; uniform vec3 uHeadCol[5];
  uniform vec3 uDeep, uPurple, uGlow, uCream, uViolet, uTeal;
  uniform float uFrontY, uWakeI, uV0, uWallGain, uTime, uStri, uTopAt;
  varying vec2 vC; varying vec3 vN; varying vec3 vT; varying vec3 vP; varying float vDisp; varying vec3 vV; varying float vSl;
  #include <fog_pars_fragment>
  void main(){
    vec2 idc; vec4 ce = cells(lwarp(vC), idc);
    float h = pillow(ce), thin = thinOf(idc);
    float edge = ce.y - ce.x;
    float crease = 1.0 - smoothstep(0.0, 0.2, edge);
    vec2 rnd = h2(idc + uSeed + 7.3);
    vec4 ta = texture2D(uTex, vec2(vC.x / uNC * 16.0, vC.y));
    vec4 tb = texture2D(uTex, vec2(vC.x / uNC * 5.0, vC.y * 3.0));
    vec4 tc = texture2D(uTex, vec2(vC.x / uNC * 48.0, vC.y * 3.0) + 0.37);
    // detail normal from baked gradients
    vec3 N = normalize(vN); vec3 T = normalize(vT - N * dot(vT, N)); vec3 B = cross(N, T);
    vec4 td = texture2D(uTex, vec2(vC.x / uNC * 30.0, vC.y * 1.9) + 0.61);
    float crown = 1.0 - smoothstep(0.08, 0.36, vSl);                             // on steep flanks the stretched grain would read as gullies in rock: keep it for the crowns
    vec2 g = ((ta.gb - 0.5) * 1.5 + (td.gb - 0.5) * 0.75 + (tc.gb - 0.5) * 0.25) * (0.25 + 0.75 * crown);   // three sizes of cauliflower billow
    N = normalize(N - (T * g.x + B * g.y) * 0.46);
    float t = vP.y / uH;
    float th = atan(vP.z, vP.x);
    vec3 inward = -vec3(cos(th), 0.0, sin(th));
    // permanent glow: purple murk low, teal through the middle, cream pouring from the throat
    vec3 amb = mix(uPurple * 0.55 + uDeep * 0.35, uGlow * 1.25, smoothstep(0.0, 0.42, t));
    amb = mix(amb, uCream * 0.62, pow(smoothstep(uTopAt, 1.0, t), 2.2));
    float grain = mix(0.84, (0.7 + 0.32 * ta.r) * (0.8 + 0.3 * td.r) * (0.9 + 0.2 * tc.r), 0.3 + 0.7 * crown);
    float relief = mix(0.7, 1.0, smoothstep(0.0, 0.75, h)) * grain * (1.0 - 0.3 * thin);   // creases stay above a third of the lit value
    float top = clamp(dot(N, normalize(vec3(0.0, 1.0, 0.0) + inward * 0.35)), -1.0, 1.0);
    float face = clamp(dot(N, inward), 0.0, 1.0);
    float stri = 1.0 - uStri + uStri * sin((vC.y * 5.0 + tb.a * 1.6) * PI2);        // corkscrew plates
    stri = mix(stri, 1.0, 0.7 * smoothstep(0.3, 0.9, h));                            // ... which melt away over the crests of the billows
    float side = dot(N, normalize(T * sign(uNRH) + vec3(0.0, 0.35, 0.0) + inward * 0.45));   // fill swirling round the nave: form from below too
    float lightK = 0.26 + 0.55 * max(top, 0.0) + 0.55 * smoothstep(-0.5, 0.9, side) + 0.1 * face;
    lightK = mix(lightK, 0.8, 0.72);                                         // light scatters round inside cloud: soft terminators
    vec3 col = amb * relief * stri * lightK;
    col += uDeep * 0.10 * (1.0 - relief);
    col += (uPurple * 0.55 + uViolet * 0.03) * (1.0 - clamp(relief * lightK, 0.0, 1.0));   // coloured shadow: the folds go violet, not black
    vec3 pale = mix(uGlow * 2.2, uTeal, 0.5);
    float puff = max(top, 0.0); puff = puff * puff * smoothstep(0.15, 0.9, h);
    col += pale * puff * (0.2 + 0.8 * t) * (0.3 + 0.5 * ta.r);                // daylight from the throat lands on the tops of the billows
    float ndv = abs(dot(N, normalize(vV)));
    float lining = pow(1.0 - ndv, 2.5) + 0.35 * pow(1.0 - ndv, 1.2);
    col += mix(amb, pale, 0.4) * lining * (1.0 + 0.7 * ta.a);
    col += uTeal * (1.0 - ndv) * (1.0 - ndv) * 0.3 * (1.0 - smoothstep(0.6, 0.9, t));   // light scattered out of the rims of the buttresses: they glow where rock would crease                 // silver lining: billows glow at their limbs like backlit vapour
    col += amb * (0.35 * pow(1.0 - h, 3.0) + 0.5 * thin * (0.4 + 0.6 * h)) * (0.4 + 1.2 * tb.a);   // permanent glow seeping through seams and bays
    // cell centre in local space (for buttress-by-buttress light)
    vec2 un = unlatt(ce.zw);
    float thc = un.x, yc = un.y;
    vec3 pc = vec3(cos(thc), 0.0, sin(thc)) * prof(clamp(yc / uH, 0.0, 1.0)) * 0.92; pc.y = yc;
    float seam = 0.05 + 0.95 * pow(1.0 - h, 2.2);
    float bay = (0.3 + 0.7 * smoothstep(0.0, 0.5, h)) * (0.15 + 1.5 * ta.a * ta.a) * (0.4 + 1.1 * tc.r) * (0.75 + 0.5 * stri);
    float lantern = mix(seam * (0.6 + 0.8 * tb.a), bay * 1.15, thin);
    float vein = pow(crease, 4.0) * (0.4 + 1.2 * tb.a);
    vec3 em = vec3(0.0);
    for (int i = 0; i < 5; i++) {
      float I = uHead[i].w; if (I <= 0.001) continue;
      float dq = distance(mix(vP, pc, 0.6), uHead[i].xyz);
      float df = distance(vP, uHead[i].xyz);
      float fall = exp(-dq * dq / (540.0 * 540.0)) * (0.6 + 0.8 * rnd.y);
      float nearv = exp(-df * df / (300.0 * 300.0));
      em += uHeadCol[i] * I * (fall * lantern * 0.22 + nearv * vein * 0.8 + nearv * nearv * lantern * 0.4);
      em += uHeadCol[i] * I * fall * (0.03 + 0.075 * ta.a) * (0.45 + 0.55 * h) * (i >= 2 ? 1.0 : 0.3);   // and swells softly through the body of the cloud
      em += vec3(1.0, 0.95, 1.0) * I * nearv * nearv * pow(crease, 9.0) * 0.25;
    }
    // wake: windows stay lit behind the climbing head, one buttress after another
    float dv = ce.w - uV0; dv -= uNR * floor(dv / uNR + 0.5);
    float lag = uFrontY - (yc - dv * uRH) - (rnd.y - 0.5) * 220.0;
    float wake = smoothstep(-40.0, 140.0, lag) * exp(-max(lag, 0.0) / 1050.0) * exp(-dv * dv / 2.2) * uWakeI;
    vec3 wcol = mix(uViolet * 1.15, uGlow * 3.2 + uTeal * 0.25, smoothstep(0.3, 0.75, rnd.y));
    em += wcol * wake * (lantern * 0.42 + vein * 0.32) * (0.92 + 0.08 * sin(uTime * 2.3 + rnd.x * 40.0));
    col = mix(col, uCream * 0.6 * (0.75 + 0.3 * ta.r + 0.25 * tb.a), smoothstep(0.84, 0.99, t));   // the throat dissolves into the oculus
    col = (col + em) * uWallGain;
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }
`,et=`
  varying vec2 vUv; varying vec3 vP; varying vec3 vWP;
  uniform float uH, uR0, uR1;
  #include <fog_pars_vertex>
  void main(){
    vUv = uv; vP = position;
    vec4 wp = modelMatrix * vec4(position, 1.0); vWP = wp.xyz;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`,tt=`
  uniform sampler2D uTex; uniform float uScroll, uTime, uH;
  uniform vec4 uHead[5]; uniform vec3 uHeadCol[5];
  uniform vec3 uPurple, uGlow, uCream;
  varying vec2 vUv; varying vec3 vP; varying vec3 vWP;
  #include <fog_pars_fragment>
  void main(){
    float sc = uScroll * 1.7 / 900.0;
    float a = texture2D(uTex, vec2(vUv.x * 5.0 + vUv.y * 2.0, vUv.y * 3.3 + sc)).a;
    float b = texture2D(uTex, vec2(vUv.x * 13.0 - vUv.y * 5.0 + uTime * 0.004, vUv.y * 8.0 + sc * 1.6)).a;
    float w = smoothstep(0.50, 0.80, a * 0.65 + b * 0.5);
    float t = vUv.y;
    vec3 col = mix(uPurple * 0.9, uGlow * 1.7, smoothstep(0.0, 0.45, t));
    col = mix(col, uCream * 0.7, pow(smoothstep(0.7, 1.0, t), 2.0));
    for (int i = 0; i < 5; i++) { float d = distance(vP, uHead[i].xyz); col += uHeadCol[i] * uHead[i].w * 0.12 * exp(-d * d / (600.0 * 600.0)); }
    float dc = distance(cameraPosition, vWP);
    float alpha = w * 0.27 * smoothstep(90.0, 420.0, dc) * smoothstep(0.0, 0.06, t) * smoothstep(1.0, 0.94, t);
    gl_FragColor = vec4(col, alpha);
    #include <fog_fragment>
  }
`,Re=`
  uniform float uTime, uGrowth, uFall, uFollow, uFrontY, uStoneI, uOriginY;
  uniform vec3 uOrigin;
  mat3 rotAxis(vec3 a, float ang){
    float s = sin(ang), c = cos(ang), oc = 1.0 - c;
    return mat3(oc*a.x*a.x + c, oc*a.x*a.y + a.z*s, oc*a.z*a.x - a.y*s,
                oc*a.x*a.y - a.z*s, oc*a.y*a.y + c, oc*a.y*a.z + a.x*s,
                oc*a.z*a.x + a.y*s, oc*a.y*a.z - a.x*s, oc*a.z*a.z + c);
  }
  float growOf(vec4 rnd){ return clamp(uGrowth + (rnd.x - 0.5) * 0.22, 0.0, 1.0); }
  float sizeOf(float g, vec4 rnd){ return mix(0.125, 1.5, pow(g, 1.25)) * (0.72 + 0.56 * rnd.w); }
  // centre of a lens companion: a view-space seat with a slow wander
  vec3 companionCentre(vec3 seat, vec4 rnd){
    float p = rnd.y * 6.2832;
    vec3 cv = seat + vec3(sin(uTime * 0.41 + p), sin(uTime * 0.33 + p * 1.7), sin(uTime * 0.29 + p * 2.3)) * vec3(0.55, 0.4, 0.8);
    vec3 c = cameraPosition + cv * mat3(viewMatrix);
    c.y -= uFall * uFall * 45.0;
    return c;
  }
  // centre of a herd stone: a box of stones wrapped around the camera, sharing most of its motion
  vec3 herdCentre(vec3 base, vec4 rnd, vec3 axis, vec3 box, float keepOut, out float fade){
    vec3 drift = axis * vec3(3.0, 1.6, 3.0) * uTime * (0.4 + rnd.z);
    drift += vec3(sin(uTime * 0.23 + rnd.y * 9.0), sin(uTime * 0.31 + rnd.x * 7.0), cos(uTime * 0.27 + rnd.w * 8.0)) * 2.2;
    vec3 rel = mod(base * box + drift - cameraPosition * (1.0 - uFollow), box) - 0.5 * box;
    vec3 e = 1.0 - abs(rel) / (0.5 * box);
    fade = smoothstep(0.0, 0.16, min(e.x, min(e.y, e.z)));
    float d = length(rel);
    rel *= max(d, keepOut) / max(d, 0.001);
    rel.y -= uFall * uFall * (220.0 + 380.0 * rnd.y);
    rel.xz += normalize(rel.xz + 0.001) * uFall * 140.0 * rnd.z;
    return cameraPosition + rel;
  }
  // travelling wave of the Great Illumination (local height of the front in uFrontY)
  float pulseOf(float worldY, vec4 rnd){
    float lag = uFrontY - (worldY - uOrigin.y) - (rnd.y - 0.5) * 160.0;
    return smoothstep(-30.0, 70.0, lag) * exp(-max(lag, 0.0) / 420.0) * uStoneI;
  }
`,at=`
  ${Re}
  attribute vec3 aBase; attribute vec4 aRnd; attribute vec3 aAxis; attribute float aLobe;
  uniform vec3 uBox; uniform float uKeepOut, uClearR;
  varying vec3 vN; varying vec3 vW; varying vec3 vObj; varying vec4 vRnd; varying float vPulse; varying float vGrow;
  #include <fog_pars_vertex>
  void main(){
    float g = growOf(aRnd), size = sizeOf(g, aRnd), fade = 1.0;
    #ifdef COMPANION
      size *= 0.62;
      vec3 centre = companionCentre(aBase, aRnd);
    #else
      vec3 centre = herdCentre(aBase, aRnd, aAxis, uBox, uKeepOut, fade);
      float rad = length(centre.xz - uOrigin.xz);
      fade *= 1.0 - smoothstep(uClearR - 120.0, uClearR, rad);
    #endif
    float lobeAmt = smoothstep(0.1, 0.75, g);
    vec3 squash = vec3(1.0, 0.82 + 0.3 * aRnd.z, 1.0 - 0.15 * aRnd.x);
    vec3 lp = position * (1.0 + aLobe * lobeAmt) * squash;
    mat3 R = rotAxis(aAxis, uTime * (0.25 + 0.9 * aRnd.x) + aRnd.y * 6.2832);
    vec3 n = normalize(mix(position, normal, lobeAmt) / squash);
    vN = R * n; vObj = lp; vRnd = aRnd; vGrow = g;
    vW = centre + R * lp * size * fade;
    vPulse = pulseOf(centre.y, aRnd);
    vec4 mvPosition = viewMatrix * vec4(vW, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`,We=`
  uniform vec3 uAmbHi, uAmbLo, uRim, uTeal, uViolet, uBack;
  uniform vec4 uHead[5]; uniform vec3 uHeadCol[5];
  // translucent onion of clear and milky ice. t = 0 at the centre of the silhouette, 1 at its limb
  vec3 shadeIce(vec3 N, vec3 V, vec3 W, float frost, vec4 rnd, float grow, float pulse){
    float ndv = clamp(dot(N, V), 0.0, 1.0), t = sqrt(max(0.0, 1.0 - ndv * ndv));
    float layers = 1.5 + floor(grow * 3.0 + 0.5);
    float ring = 0.5 + 0.5 * sin((t * t * layers + frost * 0.14 + rnd.y) * 6.2832);
    float bandK = smoothstep(0.3, 0.8, grow) * (1.0 - smoothstep(14.0, 60.0, length(cameraPosition - W)));   // small or far stones stay plain milky ice
    float milky = mix(0.4, 1.0, mix(0.55 + 0.1 * frost, smoothstep(0.22, 0.78, ring), 0.2 + 0.8 * bandK));
    float core = smoothstep(0.62, 0.08, t);
    milky = max(milky * (0.55 + 0.45 * frost), core * (0.75 + 0.25 * frost));
    float fres = pow(1.0 - ndv, 3.0);
    vec3 hemi = mix(uAmbLo, uAmbHi, N.y * 0.5 + 0.5);
    vec3 col = hemi * (0.07 + 0.5 * milky) + uAmbHi * (0.12 * (1.0 - milky) * (1.0 - ndv) + 0.42 * milky);
    col += uBack * (1.0 - milky) * 0.6 * (0.35 + 0.65 * ndv);       // clear ice shows the cloud behind it, not black
    col += uRim * fres * (0.8 + 0.6 * frost);                       // every stone carries a pale rim
    vec3 pcol = mix(uTeal, uViolet, step(0.5, rnd.z));
    col += pcol * pulse * (0.06 + 0.45 * milky + 1.3 * fres);        // the wave of light, thrown back teal / violet
    vec3 Rf = reflect(-V, N);
    for (int i = 0; i < 2; i++) {
      float I = uHead[i].w; if (I <= 0.001) continue;
      vec3 L = uHead[i].xyz + vec3(uOrigin.x, uOrigin.y, uOrigin.z) - W; float d = length(L); L /= d;
      float att = 1.0 / (1.0 + d * d / (i == 0 ? 640000.0 : 22500.0));
      float wrap = max(dot(N, L) * 0.6 + 0.4, 0.0);
      float back = pow(max(dot(-N, L), 0.0), 2.0) * (1.0 - milky * 0.5);
      col += uHeadCol[i] * I * att * (0.07 * wrap * (0.3 + milky) + 0.12 * back + 1.4 * pow(max(dot(Rf, L), 0.0), 60.0));
    }
    return col;
  }
`,ot=`
  uniform sampler2D uTex; uniform vec3 uOrigin;
  ${We}
  varying vec3 vN; varying vec3 vW; varying vec3 vObj; varying vec4 vRnd; varying float vPulse; varying float vGrow;
  #include <fog_pars_fragment>
  void main(){
    vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
    float frost = texture2D(uTex, vObj.xy * 0.37 + vObj.z * vec2(0.23, 0.31) + vRnd.xy).r;
    #ifdef COMPANION
      vec4 f2 = texture2D(uTex, vObj.zx * 1.3 + vObj.y * vec2(0.4, 0.7) + vRnd.zw);
      N = normalize(N + (f2.g - 0.5) * 0.35 * cross(N, vec3(0.0, 1.0, 0.0)) + (f2.b - 0.5) * 0.35 * cross(N, vec3(1.0, 0.0, 0.0)));
      frost = mix(frost, f2.r, 0.4);
    #endif
    gl_FragColor = vec4(shadeIce(N, V, vW, frost, vRnd, vGrow, vPulse), 1.0);
    #include <fog_fragment>
  }
`,nt=`
  ${Re}
  attribute vec4 aRnd; attribute vec3 aAxis;
  uniform vec3 uBox; uniform float uVH, uClearR;
  varying vec4 vRnd; varying float vPulse; varying float vGrow; varying float vA; varying vec3 vW;
  #include <fog_pars_vertex>
  void main(){
    float g = growOf(aRnd), size = sizeOf(g, aRnd), fade;
    vec3 centre = herdCentre(position, aRnd, aAxis, uBox, 0.0, fade);
    float rad = length(centre.xz - uOrigin.xz);
    fade *= 1.0 - smoothstep(uClearR - 120.0, uClearR, rad);
    vec4 mvPosition = viewMatrix * vec4(centre, 1.0);
    float dist = -mvPosition.z;
    fade *= smoothstep(45.0, 90.0, length(mvPosition.xyz));
    float px = size * 2.3 * projectionMatrix[1][1] * uVH * 0.5 / max(dist, 1.0);
    vA = fade * clamp(px / 1.6, 0.0, 1.0);
    gl_PointSize = max(px, 1.6);
    gl_Position = projectionMatrix * mvPosition;
    if (fade < 0.01 || dist < 1.0) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    vRnd = aRnd; vGrow = g; vW = centre; vPulse = pulseOf(centre.y, aRnd);
    #include <fog_vertex>
  }
`,rt=`
  uniform vec3 uOrigin;
  ${We}
  varying vec4 vRnd; varying float vPulse; varying float vGrow; varying float vA; varying vec3 vW;
  #include <fog_pars_fragment>
  void main(){
    vec2 q = gl_PointCoord * 2.0 - 1.0; q.y = -q.y;
    float lob = 1.0 - 0.14 * (0.5 + 0.5 * sin(atan(q.y, q.x) * (3.0 + floor(vRnd.x * 4.0)) + vRnd.y * 20.0));
    float r2 = dot(q, q) / (lob * lob); if (r2 > 1.0) discard;
    vec3 nv = vec3(q / lob, sqrt(1.0 - r2));
    vec3 N = normalize(nv * mat3(viewMatrix)), V = normalize(cameraPosition - vW);
    vec3 col = shadeIce(N, V, vW, 0.5 + 0.3 * sin(vRnd.w * 30.0 + q.x * 5.0), vRnd, vGrow, vPulse);
    gl_FragColor = vec4(col, vA);
    #include <fog_fragment>
  }
`,it=`
  ${Re}
  attribute vec3 aBase; attribute vec4 aRnd; attribute vec3 aAxis; attribute float aLobe; attribute vec2 aSeed;
  uniform float uVH, uSparkI;
  varying float vA;
  #include <fog_pars_vertex>
  void main(){
    float g = growOf(aRnd), size = sizeOf(g, aRnd) * 0.62;
    vec3 centre = companionCentre(aBase, aRnd);
    float lobeAmt = smoothstep(0.1, 0.75, g);
    vec3 squash = vec3(1.0, 0.82 + 0.3 * aRnd.z, 1.0 - 0.15 * aRnd.x);
    mat3 R = rotAxis(aAxis, uTime * (0.25 + 0.9 * aRnd.x) + aRnd.y * 6.2832);
    vec3 nrm = R * normalize(position);
    vec3 w = centre + R * (position * (1.0 + aLobe * lobeAmt) * squash) * size * 1.03;
    float cyc = uTime * (0.35 + 0.5 * aSeed.x) + aSeed.y * 17.0, ph = fract(cyc);
    float on = step(0.45, fract(sin(floor(cyc) * 12.9898 + aSeed.y * 78.233) * 43758.5453));
    float facing = smoothstep(-0.1, 0.35, dot(nrm, normalize(cameraPosition - w)));
    vA = smoothstep(0.0, 0.3, ph) * smoothstep(1.0, 0.45, ph) * on * facing * uSparkI * smoothstep(0.25, 0.6, g);
    vec4 mvPosition = viewMatrix * vec4(w, 1.0);
    gl_PointSize = clamp((0.16 + 0.22 * aSeed.x) * size * projectionMatrix[1][1] * uVH * 0.5 / max(-mvPosition.z, 0.5), 2.0, 64.0);
    gl_Position = projectionMatrix * mvPosition;
    if (vA < 0.01) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    #include <fog_vertex>
  }
`,lt=`
  varying float vA;
  #include <fog_pars_fragment>
  ${Be}
  void main(){
    vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0;
    float core = exp(-r * r * 26.0);
    float star = exp(-abs(d.x) * 46.0 - abs(d.y) * 7.0) + exp(-abs(d.y) * 46.0 - abs(d.x) * 7.0);
    float a = (core * 6.0 + star * 2.2) * (1.0 - smoothstep(0.7, 1.0, r)) * vA;
    gl_FragColor = vec4(vec3(1.0, 0.98, 0.95) * a * fogFade(), 1.0);
  }
`,Ge=`
  attribute vec3 aTan; attribute float aSide; attribute float aAlong; attribute float aW;
  uniform float uWidth, uPxAng;
  varying float vSide; varying float vAlong; varying float vW; varying float vCoreW;
  #include <fog_pars_vertex>
  void main(){
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vec3 tw = normalize(mat3(modelMatrix) * aTan);
    vec3 vd = cameraPosition - wp.xyz; float dist = length(vd); vd /= dist;
    vec3 sd = normalize(cross(tw, vd));
    float want = uWidth * aW, w = max(want, dist * uPxAng * 3.0) * 4.0;      // four times wider than the old ribbon: room for the sheath
    vCoreW = clamp(max(0.11 * want, dist * uPxAng * 0.9) / w, 0.008, 0.6);
    wp.xyz += sd * aSide * w;
    vSide = aSide; vAlong = aAlong; vW = 0.12 + 0.88 * aW;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`,Ie=`
  uniform float uGrow, uFade, uTime; uniform vec3 uCore, uHalo;
  varying float vSide; varying float vAlong; varying float vW; varying float vCoreW;
  #include <fog_pars_fragment>
  ${Be}
  void main(){
    float x = abs(vSide);
    float core = 1.0 - smoothstep(vCoreW * 0.6, vCoreW * 1.5, x);
    float xi = min(x * 4.0, 1.0);
    float glow = pow(1.0 - xi, 2.6) + 0.17 * (1.0 - x) * (1.0 - x) * (0.5 + 0.5 * vW);   // inner glow + the wide sheath
    float vis = 1.0 - smoothstep(uGrow - 0.035, uGrow, vAlong);
    float tip = smoothstep(uGrow - 0.14, uGrow - 0.02, vAlong) * vis;
    float shimmer = 0.86 + 0.14 * sin(uTime * 7.0 + vAlong * 37.0);
    vec3 col = (uCore * core * (2.6 + 2.4 * tip) + uHalo * glow * (0.26 + 0.9 * tip)) * vis * uFade * shimmer * vW;
    gl_FragColor = vec4(col * fogFade(), 1.0);
  }
`,Z=(t,r,i)=>{const A=Math.min(1,Math.max(0,(i-t)/(r-t)));return A*A*(3-2*A)},Pe=t=>(de+(he-de)*Z(.52,1,t))*(1+.1*(1-Z(0,.22,t)));function De(t,r,i){const A=new Float32Array((t+1)*(r+1)*3),d=new Float32Array((t+1)*(r+1)*2);let m=0,H=0;for(let x=0;x<=r;x++)for(let P=0;P<=t;P++){const u=P/t,n=x/r,y=u*Me,a=Pe(n)*i;A[m++]=Math.cos(y)*a,A[m++]=n*D,A[m++]=Math.sin(y)*a,d[H++]=u,d[H++]=n}const M=new Uint16Array(t*r*6);m=0;for(let x=0;x<r;x++)for(let P=0;P<t;P++){const u=x*(t+1)+P,n=u+1,y=u+t+1,a=y+1;M[m++]=u,M[m++]=y,M[m++]=n,M[m++]=n,M[m++]=y,M[m++]=a}const w=new e.BufferGeometry;return w.setAttribute("position",new e.BufferAttribute(A,3)),w.setAttribute("uv",new e.BufferAttribute(d,2)),w.setIndex(new e.BufferAttribute(M,1)),w.boundingSphere=new e.Sphere(new e.Vector3(0,D/2,0),2200),w}function me(t,r=new e.Vector3){const i=t.range(-1,1),A=t.range(0,Me),d=Math.sqrt(1-i*i);return r.set(Math.cos(A)*d,i,Math.sin(A)*d)}function Ce(t,r,i,A){let d=new e.IcosahedronGeometry(1,i);d.deleteAttribute("normal"),d.deleteAttribute("uv"),d=Qe(d,1e-4);const m=d.attributes.position,H=m.count,M=new Float32Array(H),w=new Float32Array(H*3),x=[];for(let n=0;n<A;n++)x.push({d:me(t),w:t.range(.32,.62),a:t.range(.14,.34)});const P=t.range(0,50),u=new e.Vector3;for(let n=0;n<H;n++){u.fromBufferAttribute(m,n).normalize();let y=0;for(const a of x){const v=Math.acos(Math.min(1,Math.max(-1,u.dot(a.d))))/a.w;v<1&&(y=Math.max(y,a.a*Math.sqrt(1-v*v)))}y+=.035*r.n3(u.x*2.6+P,u.y*2.6,u.z*2.6)+(i>3?.012*r.n3(u.x*7+P,u.y*7,u.z*7):0),M[n]=y,w[n*3]=u.x,w[n*3+1]=u.y,w[n*3+2]=u.z,m.setXYZ(n,u.x*(1+y),u.y*(1+y),u.z*(1+y))}return d.computeVertexNormals(),d.setAttribute("position",new e.BufferAttribute(w,3)),d.setAttribute("aLobe",new e.BufferAttribute(M,1)),d}function Te(t,r,i,A){const d=new e.InstancedBufferGeometry;d.index=t.index,d.setAttribute("position",t.attributes.position),d.setAttribute("normal",t.attributes.normal),d.setAttribute("aLobe",t.attributes.aLobe);const m=new Float32Array(r*3),H=new Float32Array(r*4),M=new Float32Array(r*3),w=new e.Vector3;for(let x=0;x<r;x++){const P=A?A(x):[i(),i(),i()];m.set(P,x*3),H.set([i(),i(),i(),i()],x*4),me(i,w),M.set([w.x,w.y,w.z],x*3)}return d.setAttribute("aBase",new e.InstancedBufferAttribute(m,3)),d.setAttribute("aRnd",new e.InstancedBufferAttribute(H,4)),d.setAttribute("aAxis",new e.InstancedBufferAttribute(M,3)),d.instanceCount=r,d.boundingSphere=new e.Sphere(new e.Vector3,1e5),d}function st(t){const r=[],i=(s,f,O,S)=>{let h=[s,f];for(let _=0;_<O;_++){const W=[h[0]];for(let F=0;F<h.length-1;F++){const Y=h[F].clone().add(h[F+1]).multiplyScalar(.5),p=h[F+1].clone().sub(h[F]).normalize(),k=me(t);k.addScaledVector(p,-k.dot(p)),Y.addScaledVector(k,S*t.range(.45,1)),W.push(Y,h[F+1])}h=W,S*=.56}return h},m=i(new e.Vector3(-850,t.range(30,90),t.range(-40,40)),new e.Vector3(850,t.range(-70,10),t.range(-40,40)),7,150),H=m[m.length>>1].clone();for(let s=0;s<m.length;s++){const f=Math.sin(s/(m.length-1)*Math.PI);m[s].y-=H.y*f,m[s].z-=H.z*f}r.push({pts:m,a0:0,a1:.74,w0:1,w1:.8});const M=t.int(9,11);for(let s=0;s<M;s++){const f=s%2===0,O=m.length>>1,S=f?O+t.int(-11,11):t.int(12,m.length-20),h=m[S],_=f?t.range(35,150):t.range(120,420),W=new e.Vector3(t.range(.1,.9),t.range(-1,.45),t.range(-.8,.5)).normalize(),F=S/(m.length-1)*.74,Y=Math.min(1,F+_/1700*.74*1.3),p=i(h.clone(),h.clone().addScaledVector(W,_),4,_*.17);if(r.push({pts:p,a0:F,a1:Y,w0:.62,w1:.16}),t.chance(.65)){const k=t.int(4,p.length-5),U=_*t.range(.3,.55),$=W.clone().add(me(t).multiplyScalar(.8)).normalize(),ie=F+(Y-F)*(k/(p.length-1));r.push({pts:i(p[k].clone(),p[k].clone().addScaledVector($,U),3,U*.18),a0:ie,a1:Math.min(1,ie+U/1700*.74*1.3),w0:.36,w1:.1})}}let w=0,x=0;for(const s of r)w+=s.pts.length*2,x+=(s.pts.length-1)*6;const P=new Float32Array(w*3),u=new Float32Array(w*3),n=new Float32Array(w),y=new Float32Array(w),a=new Float32Array(w),v=new Uint16Array(x);let b=0,V=0;const B=new e.Vector3;for(const s of r){const f=s.pts.length,O=b;for(let S=0;S<f;S++){B.copy(s.pts[Math.min(f-1,S+1)]).sub(s.pts[Math.max(0,S-1)]).normalize();const h=S/(f-1);for(let _=0;_<2;_++)P.set([s.pts[S].x,s.pts[S].y,s.pts[S].z],b*3),u.set([B.x,B.y,B.z],b*3),n[b]=_?1:-1,y[b]=s.a0+(s.a1-s.a0)*h,a[b]=s.w0+(s.w1-s.w0)*h,b++}for(let S=0;S<f-1;S++){const h=O+S*2;v.set([h,h+1,h+2,h+1,h+3,h+2],V),V+=6}}const z=new e.BufferGeometry;return z.setAttribute("position",new e.BufferAttribute(P,3)),z.setAttribute("aTan",new e.BufferAttribute(u,3)),z.setAttribute("aSide",new e.BufferAttribute(n,1)),z.setAttribute("aAlong",new e.BufferAttribute(y,1)),z.setAttribute("aW",new e.BufferAttribute(a,1)),z.setIndex(new e.BufferAttribute(v,1)),z.boundingSphere=new e.Sphere(new e.Vector3,1e5),z}async function vt(t,r={}){const i=t.rng.fork("hail-cathedral-hero"),A=t.noise,d=(r.palette&&r.palette.length>=6?r.palette:$e).map(o=>new e.Color(o)),m=i.range(-.025,.025);for(const o of d)o.offsetHSL(m,0,0);const[H,M,w,x,,P]=d,u=new e.Color(r.glow||"#1f5a58").offsetHSL(m,0,0),n=(o,l=1)=>new e.Vector3(o.r*l,o.g*l,o.b*l),y=i.sign(),a=i.int(17,22),v=i.pick([3,4,4,5]),b=Ae/v,V=v*y,B=i.range(150,185),z=.5+i.int(0,v-1),s=i.range(.45,.8),f=new e.Group;f.name="hail-cathedral-hero";const O=async()=>{await t.yield?.()},S=await Xe(i.fork("tex"),O);await O();const h=[0,1,2,3,4].map(()=>new e.Vector4(0,-1e5,0,0)),_={};w.getHSL(_);const W=new e.Color().setHSL(_.h,.85,.6),F=n(W),Y=[F.clone(),new e.Vector3(.75,.7,1),F.clone(),n(w).lerp(n(x),.45),F.clone().lerp(new e.Vector3(.75,.7,1),.15)],p={uTime:{value:0},uTex:{value:S},uScroll:{value:0},uNC:{value:a},uNRH:{value:V},uNR:{value:v},uRH:{value:b},uBulge:{value:B},uTw:{value:y*s*a/Ae},uTau:{value:s},uH:{value:D},uR0:{value:de},uR1:{value:he},uSeed:{value:new e.Vector2(i.range(0,40),i.range(0,40))},uHead:{value:h},uHeadCol:{value:Y},uDeep:{value:n(H)},uPurple:{value:n(M)},uGlow:{value:n(u)},uCream:{value:n(P)},uViolet:{value:n(W,.9)},uTeal:{value:n(x,.85).lerp(n(u,2.2),.4)},uFrontY:{value:-1e5},uWakeI:{value:0},uV0:{value:z},uWallGain:{value:1},uStri:{value:.22},uTopAt:{value:.62},uGrowth:{value:r.growth??.72},uFall:{value:0},uFollow:{value:r.herdFollow??.88},uStoneI:{value:0},uOrigin:{value:new e.Vector3},uAmbHi:{value:n(u,1.6).lerp(n(P,.55),.4)},uAmbLo:{value:n(M,.75).lerp(n(u),.3)},uRim:{value:n(x,1.5)},uVH:{value:540},uSparkI:{value:1},uBack:{value:n(M,.6).lerp(n(u),.5)},uWidth:{value:4.5},uPxAng:{value:.002},uGrow:{value:0},uFade:{value:0},uCore:{value:new e.Vector3(1,.94,1)},uHalo:{value:n(w,2.4).lerp(new e.Vector3(1,1,1.4),.12)}},k=(o={})=>Object.assign(e.UniformsUtils.merge([e.UniformsLib.fog]),p,o),U=new e.Mesh(De(224,176,1),new e.ShaderMaterial({uniforms:k(),fog:!0,side:e.DoubleSide,vertexShader:Ze,fragmentShader:Je}));U.frustumCulled=!1,U.name="vault-wall",f.add(U),await O();const $=new e.Mesh(De(48,20,.74),new e.ShaderMaterial({uniforms:k(),fog:!0,side:e.DoubleSide,transparent:!0,depthWrite:!1,vertexShader:et,fragmentShader:tt}));$.frustumCulled=!1,$.renderOrder=1,$.name="vault-veil",f.add($);const ie=(o,l)=>new e.ShaderMaterial({uniforms:k({uIn:{value:o},uOut:{value:l}}),fog:!0,side:e.DoubleSide,vertexShader:`varying vec2 vQ; 
#include <fog_pars_vertex>
 void main(){ vQ = position.xy; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition; 
#include <fog_vertex>
 }`,fragmentShader:`uniform sampler2D uTex; uniform vec3 uIn, uOut; uniform float uScroll, uTime; varying vec2 vQ; 
#include <fog_pars_fragment>

      void main(){ float r = length(vQ); float a = atan(vQ.y, vQ.x) / 6.28318;
        float w = texture2D(uTex, vec2(a * 3.0 + r * 0.6 + uTime * 0.006, r * 1.5 - uScroll / 2600.0)).a;
        float w2 = texture2D(uTex, vQ * 0.9 + vec2(uTime * 0.004, 0.0)).r;
        vec3 col = mix(uIn, uOut, pow(smoothstep(0.0, 1.0, r + (w - 0.5) * 0.6), 0.7)) * (0.72 + 0.3 * w2 + 0.3 * w);
        gl_FragColor = vec4(col, 1.0); 
#include <fog_fragment>
 }`}),ze=new e.CircleGeometry(1,48),le=new e.Mesh(ze,ie(n(P,2.6),n(P,.6)));le.rotation.x=Math.PI/2,le.position.y=D-4,le.scale.setScalar(he*1.04),le.name="oculus",f.add(le);const se=new e.Mesh(ze,ie(n(M,.3).lerp(n(H,.5),.5),n(M,.42)));se.rotation.x=-Math.PI/2,se.position.y=4,se.scale.setScalar(de*1.12),se.name="murk-floor",f.add(se),await t.yield?.();const pe=(o,l,R)=>new e.ShaderMaterial({uniforms:k({uBox:{value:new e.Vector3(o,o,o)},uKeepOut:{value:l},uClearR:{value:700}}),defines:R?{COMPANION:1}:{},fog:!0,vertexShader:at,fragmentShader:ot}),ge=(o,l,R)=>{const c=new e.Mesh(o,l);return c.frustumCulled=!1,c.name=R,f.add(c),c},C=i.fork("stones"),Ye=pe(76,11,!1),qe=pe(340,10,!1);for(let o=0;o<3;o++)ge(Te(Ce(C,A,3,C.int(12,18)),16,C),Ye,"stones-near-"+o),await O();await t.yield?.();for(let o=0;o<2;o++)ge(Te(Ce(C,A,1,C.int(6,9)),450,C),qe,"stones-herd-"+o),await O();await t.yield?.();{const l=new Float32Array(14400),R=new Float32Array(4800*4),c=new Float32Array(4800*3),q=new e.Vector3;for(let T=0;T<4800;T++)l.set([C(),C(),C()],T*3),R.set([C(),C(),C(),C()],T*4),me(C,q),c.set([q.x,q.y,q.z],T*3);const I=new e.BufferGeometry;I.setAttribute("position",new e.BufferAttribute(l,3)),I.setAttribute("aRnd",new e.BufferAttribute(R,4)),I.setAttribute("aAxis",new e.BufferAttribute(c,3)),I.boundingSphere=new e.Sphere(new e.Vector3,1e5);const j=new e.Points(I,new e.ShaderMaterial({uniforms:k({uBox:{value:new e.Vector3(840,840,840)},uClearR:{value:700}}),fog:!0,transparent:!0,depthWrite:!1,vertexShader:nt,fragmentShader:rt}));j.frustumCulled=!1,j.renderOrder=2,j.name="stones-far",f.add(j)}await O();const _e=[];if(r.companions!==!1){const o=[[-4.3,-1.7,-6.6],[4.8,1.35,-7.8],[1.7,-2.5,-10.5]].map(T=>[T[0]+C.range(-.4,.4),T[1]+C.range(-.25,.25),T[2]+C.range(-.6,.6)]),l=pe(1,0,!0),R=70,c={position:[],aBase:[],aRnd:[],aAxis:[],aLobe:[],aSeed:[]};for(let T=0;T<3;T++){const ue=Ce(C,A,7,C.int(24,34)),X=Te(ue,1,C,()=>o[T]);X.attributes.aRnd.setX(0,.5+.2*(T-1)),X.attributes.aRnd.setW(0,.55+.2*C()),_e.push(ge(X,l,"companion-"+T));const ae=ue.attributes.position,ve=ue.attributes.aLobe,ne=X.attributes.aRnd,re=X.attributes.aAxis;for(let fe=0;fe<R;fe++){const oe=C.int(0,ae.count-1);c.position.push(ae.getX(oe),ae.getY(oe),ae.getZ(oe)),c.aLobe.push(ve.getX(oe)),c.aBase.push(...o[T]),c.aRnd.push(ne.getX(0),ne.getY(0),ne.getZ(0),ne.getW(0)),c.aAxis.push(re.getX(0),re.getY(0),re.getZ(0)),c.aSeed.push(C(),C())}await t.yield?.()}const q=new e.BufferGeometry,I={position:3,aBase:3,aRnd:4,aAxis:3,aLobe:1,aSeed:2};for(const T in c)q.setAttribute(T,new e.BufferAttribute(new Float32Array(c[T]),I[T]));q.boundingSphere=new e.Sphere(new e.Vector3,1e5);const j=new e.Points(q,new e.ShaderMaterial({uniforms:k(),fog:!0,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,vertexShader:it,fragmentShader:lt}));j.frustumCulled=!1,j.renderOrder=4,j.name="freeze-sparks",f.add(j)}const L=new e.Mesh(st(i.fork("bolt")),new e.ShaderMaterial({uniforms:k(),fog:!0,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:Ge,fragmentShader:Ie}));L.frustumCulled=!1,L.renderOrder=3,L.visible=!1,L.name="nave-channel",f.add(L);const we={uGrow:{value:0},uFade:{value:0}},K=new e.Mesh(L.geometry,new e.ShaderMaterial({uniforms:k(we),fog:!0,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:Ge,fragmentShader:Ie}));K.frustumCulled=!1,K.renderOrder=3,K.visible=!1,K.scale.setScalar(.5),K.name="far-fork",f.add(K),await t.yield?.();const je=r.scrollSpeed??55,xe=-1400,ke=1100,g={manualP:null,manualScroll:null,focus:null,focusLatched:!1,focusY:D*.45,chanLatched:!1,chanManual:!1,chanY:0,chanCamY:0,farLatched:!1,farY:0,farCamY:0,prevCam:new e.Vector3(1e9,0,0)},ce=new e.Vector3,Q=new e.Vector3,G=new e.Vector3,E=new e.Vector3,J=new e.Vector3,Fe=new e.Matrix4,ye=new e.Vector2,te=[i.range(0,6),i.range(0,6),i.range(0,6),i.range(0,6)],be=(o,l,R,c)=>{const q=l+p.uScroll.value,I=(q/b-R)/V*Me,j=Pe(Math.min(1,Math.max(0,l/D)))*.9;h[o].set(Math.cos(I)*j,l,Math.sin(I)*j,c)},Se=new e.Quaternion,Ve=(o,l,R,c,q)=>{R.getWorldQuaternion(Se),G.set(0,0,-1).applyQuaternion(Se),G.y=Math.min(.75,Math.max(-.75,G.y)),G.normalize(),E.set(1,0,0).applyQuaternion(Se),E.y=0,E.lengthSq()<1e-4&&E.set(1,0,0),E.normalize(),J.crossVectors(E,G).normalize(),o.position.copy(l).addScaledVector(G,c).addScaledVector(J,q),G.crossVectors(E,J),o.quaternion.setFromRotationMatrix(Fe.makeBasis(E,J,G))},Ue=(o,l)=>{Ve(L,o,l,80,6),g.chanY=L.position.y,g.chanCamY=o.y,g.chanLatched=!0},Ee=(o,l)=>{Ve(K,o,l,340,40),g.farY=K.position.y,g.farCamY=o.y,g.farLatched=!0};function Ke(o,l,R){if(p.uTime.value=l,p.uScroll.value=g.manualScroll??l*je,f.updateWorldMatrix(!0,!1),ce.setFromMatrixPosition(f.matrixWorld),p.uOrigin.value.copy(ce),R){R.getWorldPosition(Q).sub(ce),t.renderer?.getDrawingBufferSize?.(ye);const ee=ye.y>0?ye.y:540;p.uVH.value=ee,p.uPxAng.value=1/(R.projectionMatrix.elements[5]*ee*.5)}let c=g.manualP;if(c===null){const ee=(l+1.1)%10/5;c=ee<1?ee:0}const q=R&&Q.distanceTo(g.prevCam)>200;g.prevCam.copy(Q),(c<=0||q)&&(g.focusLatched=!1,g.farLatched=!1,g.chanManual||(g.chanLatched=!1)),c>0&&!g.focusLatched&&(g.focusY=g.focus??Q.y,g.focusLatched=!0);const I=Math.min(1,c/.8),j=I*.7+.3*I*I*(3-2*I),T=g.focusY+xe+(ke-xe)*j,ue=Z(0,.07,c)*(1-Z(.74,.93,c)),X=Z(0,.05,c)*(1-Z(.8,1,c));p.uFrontY.value=c>0?T:-1e5,p.uWakeI.value=X,p.uStoneI.value=X,be(0,T,z,3.6*ue);const ae=Math.min(1,Math.max(0,(c-.36)/.09))*1.06,ve=c>.36?1-Z(.7,.84,c):0,ne=Math.min(1,Math.max(0,(c-.16)/.08))*1.06,re=c>.16?.5*(1-Z(.33,.43,c)):0;re>.002&&R?(g.farLatched||Ee(Q,R),K.position.y=g.farY+(Q.y-g.farCamY)*.8,K.visible=!0,we.uGrow.value=ne,we.uFade.value=re):K.visible=!1,ve>.002&&R?(g.chanLatched||Ue(Q,R),g.chanManual||(L.position.y=g.chanY+(Q.y-g.chanCamY)*p.uFollow.value),L.visible=!0,p.uGrow.value=ae,p.uFade.value=ve,h[1].set(L.position.x,L.position.y,L.position.z,1.6*ve*Math.min(1,ae*1.6))):(L.visible=!1,h[1].w=0);const fe=.5-.5*Math.cos(l*.9+te[0]),oe=.5-.5*Math.cos(l*.63+te[1]);if(be(2,D*(.16+.5*(.5+.5*Math.sin(l*.11+te[2]))),z+2,5*fe*fe),be(3,D*(.42+.42*(.5+.5*Math.sin(l*.07+te[3]))),z+1,4.2*oe*oe),R){R.getWorldDirection(G);const ee=.5-.5*Math.cos(l*.52+te[2]*1.7),Ne=Math.min(D*.96,Math.max(60,Q.y+520*G.y+250*Math.sin(l*.2+te[3]))),Oe=Math.atan2(G.z,G.x+1e-6)+.6*Math.sin(l*.17+te[1]),He=Pe(Ne/D)*.9;h[4].set(Math.cos(Oe)*He,Ne,Math.sin(Oe)*He,(r.crawler??3.6)*(.3+.7*ee*ee)*(1-Z(.74,.9,Q.y/D)))}p.uSparkI.value=.65+.35*X}const N=(o,l,R)=>new e.Vector3(o,l,R);return{object:f,radius:100,height:-1600,center:N(0,1900,0),ground:!1,groundY:0,anchors:{vaultRadius:de,vaultHeight:D,clearRadius:720,corkscrew:{hand:y,columns:a,strands:v,lapRise:Ae},axisBottom:N(0,0,0),axisTop:N(0,D,0),flyThrough:[N(0,80,0),N(0,520,0),N(170,1e3,110),N(480,1500,300),N(170,2100,90),N(0,2600,0),N(0,2950,0)],viewpoints:[{position:N(120,1250,80),lookAt:N(0,1750,-300)},{position:N(480,1500,300),lookAt:N(-700,1350,-400)},{position:N(0,1700,0),lookAt:N(600,900,300)}],illumination:{from:xe,to:ke},throat:{position:N(0,D,0),radius:he},portalSeat:{position:N(0,D+60,0),facing:N(0,-1,0)}},uniforms:p,channel:L,companions:_e,setProgress(o){g.manualP=Math.min(1,Math.max(0,o))},setGrowth(o){p.uGrowth.value=Math.min(1,Math.max(0,o))},setFall(o){p.uFall.value=Math.min(1,Math.max(0,o))},setScroll(o){g.manualScroll=o},setFocus(o){g.focus=o},placeChannel(o,l){f.updateWorldMatrix(!0,!1),ce.setFromMatrixPosition(f.matrixWorld),L.position.copy(o).sub(ce),E.copy(l).normalize(),J.set(0,1,0),G.crossVectors(E,J).normalize(),J.crossVectors(G,E),L.quaternion.setFromRotationMatrix(Fe.makeBasis(E,J,G)),g.chanManual=!0,g.chanLatched=!0},update:Ke,dispose(){}}}export{vt as buildHero};
