import*as o from"three";import{mergeGeometries as q}from"three/addons/utils/BufferGeometryUtils.js";import{RoundedBoxGeometry as me}from"three/addons/geometries/RoundedBoxGeometry.js";const Be=["#f7f4ee","#cfe4f5","#8fb8e6","#2f5fb3","#1f5a4a","#ffe2a0","#d6263a"],C=Math.PI*2,Ae=()=>new o.Matrix4,le=new o.Color;function S(l,p={}){const r=l.attributes.position,t=r.count,e=l.attributes.uv,y=new Float32Array(t*3),a=new Float32Array(t*4),f=new Float32Array(t*2),g=typeof p.col=="function",k=typeof p.amp=="function";for(let w=0;w<t;w++){const c=r.getX(w),d=r.getY(w),m=r.getZ(w),i=e?e.getX(w):0,n=e?e.getY(w):0;g?p.col(c,d,m,i,n,le):le.copy(p.col),y[w*3]=le.r,y[w*3+1]=le.g,y[w*3+2]=le.b,a[w*4]=p.mat||0,a[w*4+1]=k?p.amp(c,d,m):p.amp||0,a[w*4+2]=p.phase||0,a[w*4+3]=p.kind||0,p.row!=null?(f[w*2]=i*(p.rep||1),f[w*2+1]=p.row*16+Math.min(15.99,n*(p.vrep||1))):(f[w*2]=0,f[w*2+1]=-1)}for(const w of Object.keys(l.attributes))w!=="position"&&w!=="normal"&&l.deleteAttribute(w);l.setAttribute("uv",new o.BufferAttribute(f,2)),l.setAttribute("aCol",new o.BufferAttribute(y,3)),l.setAttribute("aFx",new o.BufferAttribute(a,4)),p.m&&l.applyMatrix4(p.m);const b=l.index?l.toNonIndexed():l;return p.flat&&b.computeVertexNormals(),b}const M=(l,p,r,t=0,e=0,y=0,a=1,f=a,g=a)=>Ae().compose(new o.Vector3(l,p,r),new o.Quaternion().setFromEuler(new o.Euler(e,t,y,"YXZ")),new o.Vector3(a,f,g)),oe=(l,p=32)=>new o.LatheGeometry(l.map(r=>new o.Vector2(Math.max(r[0],1e-4),r[1])),p);function We(l){const p=l.map(()=>0);for(let r=1;r<l.length-1;r++){const t=l[r][0]-l[r-1][0],e=l[r][1]-l[r-1][1],y=l[r+1][0]-l[r][0],a=l[r+1][1]-l[r][1],f=(t*a-e*y)/(Math.hypot(t,e)*Math.hypot(y,a)+1e-6);p[r]=Math.min(1,Math.max(0,f*1.4))}return p}function W(l,p,r,t,e={}){const y=We(l),a=l.length-1,f=new o.Color,g=oe(l,p);return e.pre&&e.pre(g),S(g,{...e,col:(k,b,w,c,d,m)=>{const i=d*a,n=Math.min(a-1,Math.floor(i)),h=y[n]+(y[n+1]-y[n])*(i-n);e.tint?(e.tint(k,b,w,c,d,f),m.copy(f)):m.copy(r),m.lerp(t,h*.85)}})}function xe(l,p,r,t=.33){const e=l.attributes.position;for(let y=0;y<e.count;y++){const a=e.getX(y),f=e.getY(y),g=e.getZ(y);e.setXYZ(y,a+Math.sin(f*t*2.3+g*t*1.7+1.3)*r,f+Math.sin(a*t*1.9-g*t*2.1)*r*.6,g+Math.sin(a*t*2.2+f*t*1.6+4)*r)}return l}function j(l,p,r){const t=l.attributes.position.count,e=new o.BufferGeometry,y=new o.Matrix3,a=new o.Vector3;for(const f of Object.keys(l.attributes)){const g=l.attributes[f],k=g.itemSize,b=new Float32Array(t*k*p.length),w=f==="position",c=f==="normal";for(let d=0;d<p.length;d++){const m=d*t*k;if(w||c){c&&y.getNormalMatrix(p[d]);for(let i=0;i<t;i++)a.fromBufferAttribute(g,i),c?a.applyMatrix3(y).normalize():a.applyMatrix4(p[d]),b[m+i*3]=a.x,b[m+i*3+1]=a.y,b[m+i*3+2]=a.z}else b.set(g.array,m)}e.setAttribute(f,new o.BufferAttribute(b,k))}return r&&r(e,t),e}function Z(l,p,r=6,t=5){return new o.TubeGeometry(new o.CatmullRomCurve3(l.map(e=>new o.Vector3(e[0],e[1],e[2]))),r,p,t,!1)}function*Ve(l){const t=document.createElement("canvas");t.width=1024,t.height=512;const e=t.getContext("2d");e.fillStyle="#000",e.fillRect(0,0,1024,512),e.fillStyle="#fff",e.strokeStyle="#fff",e.lineCap="round";const y=document.createElement("canvas");y.width=256,y.height=128;const a=y.getContext("2d"),f=(c,d,m,i,n,h,s,u)=>{for(let v=0;v<=22;v++){const x=v/22,G=(1-x)*(1-x),z=2*x*(1-x),B=x*x,N=(s+(u-s)*x)*(.55+.6*Math.sin(x*Math.PI));a.globalAlpha=.7+.3*l(),a.beginPath(),a.arc(G*c+z*m+B*n,G*d+z*i+B*h,Math.max(.8,N),0,C),a.fill()}},g=(c,d)=>{for(let m=0;m<256;m+=2)a.globalAlpha=.75+.25*l(),a.beginPath(),a.arc(m,c+Math.sin(m*C/64)*.8,d*(.8+.3*Math.sin(m*C/128)),0,C),a.fill()},k=()=>{a.globalAlpha=1,a.fillStyle="#000",a.fillRect(0,0,256,128),a.fillStyle="#fff",a.strokeStyle="#fff",a.lineCap="round"},b=c=>{e.globalAlpha=1;for(let d=0;d<4;d++)e.drawImage(y,d*256,c*128)};yield,k(),g(9,3.2),g(119,3.2),g(17,1.2),g(111,1.2);for(let c=0;c<256;c+=2)a.globalAlpha=.9,a.beginPath(),a.arc(c,64+24*Math.sin(c*C/256),2.6+Math.sin(c*.2)*.6,0,C),a.fill();for(let c=0;c<8;c++){const d=16+c*32,m=64+24*Math.sin(d*C/256),i=c%2?1:-1,n=20+l()*8;f(d,m,d+8,m-i*n*.7,d+20+l()*6,m-i*n,3.5,9.5),f(d,m,d-7,m+i*n*.5,d-16,m+i*n*.85,3,7),a.globalAlpha=.9,a.beginPath(),a.arc(d+12,m+i*15,3.2,0,C),a.fill()}b(0),yield,k(),a.lineWidth=5;for(let c=0;c<5;c++)for(let d=-1;d<5;d++){const m=d*64+c%2*32+32,i=c*30-6;a.globalAlpha=.8+.2*l(),a.lineWidth=4+l()*2.5,a.beginPath(),a.arc(m,i,30,.12,Math.PI-.12),a.stroke(),a.lineWidth=2,a.globalAlpha=.7,a.beginPath(),a.moveTo(m,i+12),a.lineTo(m,i+22),a.stroke()}b(1),yield,k(),g(8,3.5),g(120,3.5),a.lineWidth=3;for(let c=-4;c<12;c++)a.globalAlpha=.75+.25*l(),a.lineWidth=2.4+l()*1.4,a.beginPath(),a.moveTo(c*32,16),a.lineTo(c*32+96,112),a.stroke(),a.beginPath(),a.moveTo(c*32+96,16),a.lineTo(c*32,112),a.stroke();for(let c=0;c<8;c++)for(let d=0;d<3;d++)a.globalAlpha=.95,a.beginPath(),a.arc(c*32+16+d%2*16-8,32+d*32,3.6,0,C),a.fill();b(2),yield,k();for(let c=0;c<2;c++){const d=64+c*128,m=c?74:54;for(let n=0;n<6;n++){const h=n*C/6+c*.5,s=19;f(d+Math.cos(h)*5,m+Math.sin(h)*5,d+Math.cos(h+.3)*s*.6,m+Math.sin(h+.3)*s*.6,d+Math.cos(h)*s,m+Math.sin(h)*s,3,6.5)}a.globalAlpha=1,a.fillStyle="#000",a.beginPath(),a.arc(d,m,3.4,0,C),a.fill(),a.fillStyle="#fff";const i=c?-1:1;f(d,m+i*22,d+18,m+i*34,d+40,m+i*30,1.8,5),f(d,m+i*22,d-18,m+i*36,d-38,m+i*28,1.8,5),f(d,m+i*20,d+2,m+i*36,d-4,m+i*46,1.6,2.2);for(let n=0;n<5;n++)a.globalAlpha=.9,a.beginPath(),a.arc(d+44+n%2*10-64*(n>2),m-i*(14+n*7),2.6,0,C),a.fill()}b(3);const w=new o.CanvasTexture(t);return w.wrapS=o.RepeatWrapping,w.wrapT=o.ClampToEdgeWrapping,w.anisotropy=4,w}const ue=`
  uniform vec3 uSunDir, uSunCol, uSkyCol, uBounce, uHorizon;
  uniform float uTime, uCrown;
  vec2 hash22(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
  // the room reflected in the clearcoat: sky gradient, white sill below, one tall window around the sun
  vec3 roomEnv(vec3 r){
    vec3 c = mix(uHorizon, uSkyCol, smoothstep(0.0, 0.75, r.y));
    c = mix(c, uBounce * 0.7, smoothstep(0.02, -0.35, r.y));
    vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), uSunDir)), up = cross(uSunDir, rt);
    float z = dot(r, uSunDir);
    vec2 q = vec2(dot(r, rt), dot(r, up)) / max(z, 0.05);
    float pane = smoothstep(0.62, 0.5, abs(q.x)) * smoothstep(-0.42, -0.3, q.y) * smoothstep(0.95, 0.8, q.y) * step(0.0, z);
    pane *= 0.35 + 0.65 * smoothstep(0.03, 0.07, abs(q.x)) * smoothstep(0.03, 0.07, abs(q.y - 0.28));
    return c + uSunCol * pane * 1.5;
  }
  float vor(vec2 p){
    vec2 i = floor(p), f = fract(p); float d1 = 1.5, d2 = 1.5;
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y)); vec2 o = 0.5 + 0.42 * sin(uTime * 0.7 + 6.2831 * hash22(i + g));
      float d = length(g + o - f);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
    }
    return d2 - d1;
  }
  // caustic net: bright where cells meet, two octaves drifting against each other
  float caustic(vec2 p){
    float a = vor(p * 0.19 + vec2(uTime * 0.03, 0.0)), b = vor(p * 0.37 - vec2(0.0, uTime * 0.05) + 9.0);
    return pow(1.0 - min(a * 1.5, 1.0), 5.0) * 1.3 + pow(1.0 - min(b * 1.5, 1.0), 5.0) * 0.7;
  }
  // sun spots thrown by the 12 glass stars of the crown: one soft disc per 30 degree sector, sweeping with the crown
  float sunSpots(vec2 p){
    float r = length(p), s = (atan(p.x, p.y + 1e-4) - uCrown * 0.35) * 1.9098593, i = floor(s), f = (fract(s) - 0.5) * 0.5236;
    float h = fract(sin(mod(i, 12.0) * 127.1 + 3.3) * 43758.5453), rad = 1.6 + 1.5 * h;
    float l = length(vec2(r * sin(f), r * cos(f) - 34.0 - 30.0 * h));
    return smoothstep(rad, rad * 0.5, l) * (0.75 + 0.25 * sin(uTime * 5.0 + h * 40.0));
  }
`,Me=`
  attribute vec3 aCol; attribute vec4 aFx;
  #ifdef ORBIT
  attribute vec4 aOrb;   // radius, start angle, angular velocity, weave phase
  #endif
  uniform float uTime;
  varying vec3 vCol, vN, vW; varying vec2 vUv, vYW; varying float vMat;
  #include <fog_pars_vertex>
  void main(){
    vec3 p = position, n = normal; float k = aFx.w;
    if (k < 0.5) p.y += aFx.y * sin(uTime * 1.5708 + aFx.z);
    else if (k < 1.5) p.y += aFx.y * sin(uTime * 4.2 + aFx.z);
    else if (k < 2.5) { float ph = fract(uTime * 0.8 + aFx.z); p.y += aFx.y * sin(uTime * 47.0 + aFx.z * 9.0) * exp(-ph * 4.5); }
    else p.x += aFx.y * sin(uTime * 1.2 + aFx.z);
    #ifdef ORBIT
      float ang = aOrb.y + aOrb.z * uTime;
      float wv = sin(ang * 3.0 + aOrb.w);
      float r = aOrb.x + 1.9 * wv;
      float yaw = ang + 1.5708 + (aOrb.z < 0.0 ? 3.14159 : 0.0) - 0.35 * cos(ang * 3.0 + aOrb.w) * sign(aOrb.z);
      float cy = cos(yaw), sy = sin(yaw);
      p.x += p.y * 0.1 * wv;                                  // lean into the weave
      p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
      n = vec3(n.x * cy + n.z * sy, n.y, -n.x * sy + n.z * cy);
      p.xz += vec2(sin(ang), cos(ang)) * r;
    #endif
    vec4 w = modelMatrix * vec4(p, 1.0);
    vW = w.xyz; vN = normalize(mat3(modelMatrix) * n); vCol = aCol; vUv = uv; vMat = aFx.x;
    vec4 mvPosition = viewMatrix * w;
    gl_Position = projectionMatrix * mvPosition; vYW = gl_Position.yw;
    #include <fog_vertex>
  }
`,fe=`
  uniform vec3 uCobalt, uDeep, uWarm, uTarget; uniform sampler2D uBrush; uniform float uBaseY, uCaK, uTsTop, uGlow;
  varying vec3 vCol, vN, vW; varying vec2 vUv, vYW; varying float vMat;
  #ifdef PINE
  varying vec4 vBr;      // local x, local z, 0 (trunk side) .. 1 (rim) along the tier, tier index (-1 = not a tier)
  #endif
  #include <fog_pars_fragment>
  ${ue}
  void main(){
    vec3 V = normalize(cameraPosition - vW), N = normalize(vN);
    if (dot(N, V) < 0.0) N = -N;
    vec3 L = uSunDir, R = reflect(-V, N);
    float ndl = dot(N, L), ndv = max(dot(N, V), 0.0);
    // fake tilt-shift: the top and bottom fifths of the frame lose their fine detail and sink into the haze
    float ts = smoothstep(0.56, 1.0, abs(vYW.x / max(vYW.y, 1e-3))) * mix(1.0, uTsTop, step(0.0, vYW.x));
    float ca = caustic(vW.xz - L.xz / max(L.y, 0.2) * vW.y) * (1.0 - 0.75 * ts);
    float dif = smoothstep(-0.25, 1.0, ndl);
    // (polish) value: a cooler, lower ambient so the shade is a clear blue and the sunlit side a clean white,
    // and the carousel's own lamps: a warm glow from under the canopy that falls on the deck, the ice and the near snow
    vec3 amb = mix(uBounce * 0.2 + uSkyCol * 0.08, uSkyCol * vec3(0.37, 0.48, 0.66), N.y * 0.5 + 0.5);
    vec3 sun = uSunCol * dif * dif * (0.86 + 0.6 * uCaK * ca * smoothstep(-0.1, 0.5, ndl));
    {
      vec3 lv = vec3(0.0, uBaseY + 15.0, 0.0) - vW; float ld = length(lv);
      float lk = 1.0 / (1.0 + ld * ld * 0.0034);
      amb += uWarm * lk * (0.35 + 0.65 * max(dot(N, lv / max(ld, 1e-3)), 0.0)) * smoothstep(52.0, 16.0, ld);
      lv = uTarget - vW; ld = length(lv);                    // and the mirror's own warm light on whatever rises toward it
      amb += uWarm * (1.1 / (1.0 + ld * ld * 0.01)) * (0.3 + 0.7 * max(dot(N, lv / max(ld, 1e-3)), 0.0)) * smoothstep(34.0, 8.0, ld);
    }
    sun += mix(uSunCol, vec3(1.0), 0.3) * 1.25 * sunSpots(vW.xz) * smoothstep(-0.1, 0.45, N.y) * (1.0 - 0.5 * ts);
    vec3 base = vCol, col;
    #ifdef PINE
    if (vBr.w > -0.5) {      // bottle-brush bristles: twisted radial strokes, a thick serrated lip of white glaze on each tier
      float ang = atan(vBr.x, vBr.y + 1e-5), near = smoothstep(150.0, 60.0, length(cameraPosition - vW)) * (1.0 - 0.6 * ts);
      float st = sin(ang * 13.0 + vBr.z * 5.0 + vBr.w * 1.9), st2 = sin(ang * 29.0 - vBr.z * 9.0 + vBr.w * 4.1);
      float br = smoothstep(-0.3, 0.5, st) * (0.78 + 0.22 * smoothstep(-0.2, 0.6, st2));
      base *= mix(1.0, 0.6 + 0.52 * br, near);
      base *= 0.56 + 0.44 * smoothstep(0.08, 0.72, vBr.z);                                    // dark in toward the wire trunk, under the tier above
      float lipAt = 0.8 - 0.03 * vBr.w;                                                         // the upper tiers carry more glaze, the top one a cap
      float gl = smoothstep(lipAt, lipAt + 0.08, vBr.z + (0.06 * st + 0.035 * st2) * near);
      if (vBr.w > 4.5) gl = max(gl, smoothstep(0.3, 0.18, vBr.z + 0.06 * st * near));       // and a cap of glaze on the very tip
      base = mix(base, vec3(0.8, 0.79, 0.76) * (0.93 + 0.07 * br), gl * 0.97);
    }
    #endif
    float rdl = max(dot(R, L), 0.0);
    if (vMat < 0.5) {
      if (vUv.y >= 0.0) {
        float row = floor(vUv.y / 16.0), vv = fract(vUv.y - row * 16.0);
        float m = texture2D(uBrush, vec2(vUv.x, 1.0 - (row + 0.05 + 0.9 * (1.0 - vv)) * 0.25)).r; m = mix(m, 0.3, ts * 0.3); base = mix(base, uCobalt * (0.62 + 0.42 * hash22(floor(vUv * 37.0)).x), m * 0.96); }
      float fr = 0.045 + 0.95 * pow(1.0 - ndv, 5.0);
      col = base * (amb + sun) * (1.0 - fr * 0.45) + roomEnv(R) * (fr * 0.62 + 0.045);
      col += uSunCol * (pow(rdl, 900.0) * 7.0 * (1.0 - 0.8 * ts) + pow(rdl, 60.0) * (0.12 + 0.3 * ts));
    } else if (vMat < 1.5) {
      vec3 e = roomEnv(R);
      col = base * (e * 0.75 + amb * 0.5 + sun * 0.7 + uWarm * 0.12) * (0.5 + 0.5 * smoothstep(-0.3, 0.85, N.y)) + base * uSunCol * (pow(rdl, 140.0) * 6.0 + pow(rdl, 12.0) * 0.7);
    } else {
      vec3 e = roomEnv(R) + roomEnv(refract(-V, N, 0.75)) * 0.6;
      float tw = 0.6 + 0.4 * sin(uTime * 3.0 + vW.x * 2.0 + vW.y * 3.0);
      col = base * e * 0.7 + uSunCol * (pow(rdl, 50.0) * 8.0 * tw + pow(1.0 - ndv, 3.0) * 0.5);
    }
    {   // the carousel's own shade: blue under the canopy, deepest toward the axis, and under the deck's soffit
      float ry = vW.y - uBaseY, rc = length(vW.xz);
      float inC = smoothstep(12.4, 9.6, rc) * smoothstep(10.1, 11.6, ry) * smoothstep(24.6, 23.0, ry) * mix(smoothstep(0.1, -0.25, N.y), 1.0, smoothstep(17.7, 16.5, ry));
      float ao = inC * (0.14 + 0.3 * smoothstep(11.6, 3.0, rc) + 0.24 * smoothstep(12.5, 18.0, ry));
      ao += smoothstep(11.7, 10.6, rc) * smoothstep(9.75, 9.3, ry) * smoothstep(8.2, 8.6, ry) * smoothstep(0.0, -0.3, N.y) * (0.16 + 0.26 * smoothstep(11.0, 3.0, rc));
      col *= mix(vec3(1.0), vec3(0.46, 0.6, 0.92), min(ao, 0.75));
      // (polish 3) the ring of bulbs under the deck's rim (10.5 m from the axis): their glow on the deck's underside round them,
      // in the lamps' own colour and as strong as the bulbs burn; a glow added over the glaze, the same at every clock
      col += uWarm * (0.065 * uGlow) * smoothstep(9.75, 9.3, ry) * smoothstep(8.2, 8.6, ry) * smoothstep(0.0, -0.3, N.y) * exp(-(rc - 10.5) * (rc - 10.5) * 0.3);
    }
    float deep = smoothstep(0.0, -13.0, vW.y - uBaseY);       // sunk in the pit under the ice
    col = mix(col, col * uDeep * 1.6 + uDeep * 0.08, deep * 0.85);
    col = mix(col, uHorizon * 0.8, ts * 0.07);
    if (vMat > 2.5) col = vCol * uGlow * (0.86 + 0.14 * sin(uTime * 2.3 + vW.x * 1.7 + vW.z * 2.3));      // lit windows, lamps and bulbs: their own light
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }
`;function ke(l,p){const r=new o.Shape;return r.moveTo(-l/2,0),r.lineTo(l/2,0),r.lineTo(l/2,p-l/2),r.absarc(0,p-l/2,l/2,0,Math.PI,!1),r.lineTo(-l/2,0),r}function de(l,p,r){const t=[],e=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];if(l>6)for(const a of[-1,1])for(const f of[-1,1])for(const g of[-1,1])e.push([a,f,g]);const y=new o.Vector3(0,1,0);return e.forEach((a,f)=>{const g=f<6?p*(f===3?1.35:1):p*.55,k=new o.ConeGeometry(r*(f<6?1:.8),g,4,1,!0);k.translate(0,g/2,0),k.applyQuaternion(new o.Quaternion().setFromUnitVectors(y,new o.Vector3(a[0],a[1],a[2]).normalize())),t.push(k)}),q(t)}function*Ne(l){const{rng:p,noise:r,C:t}=l,e=[],y=new o.Color;e.push(W([[.01,-15],[20.5,-15],[22.6,-13.8],[23.25,-11],[23.25,-.3]],64,t.basin,t.deep,{row:2,rep:20})),yield e.splice(0);const a=(s,u)=>{const v=Math.hypot(s,u);return(r.fbm2(s*.085+3,u*.085,3)*1.25+.55)*o.MathUtils.smoothstep(v,23.6,28)*(1-o.MathUtils.smoothstep(v,30.5,36.5))};e.push(W([[23.1,-.4],[23.3,.4],[23.9,.95],[25.4,1.35],[27.5,1.5],[30,1.2],[32.5,.7],[34.8,.1],[36.5,-.7],[35.5,-3.5],[24.5,-16]],96,t.white,t.pool,{pre:s=>{const u=s.attributes.position;for(let v=0;v<u.count;v++)u.setY(v,u.getY(v)+a(u.getX(v),u.getZ(v)));s.computeVertexNormals()},tint:(s,u,v,x,G,z)=>z.copy(t.white).lerp(t.pool,o.MathUtils.clamp(.42-a(s,v)*.3+r.n2(s*.3,v*.3)*.12,0,.7))})),yield e.splice(0),e.push(W([[8.75,-.5],[8.65,.3],[8.2,.8],[7,1.3],[5.6,1.72],[4.4,1.9]],48,t.white,t.pool)),yield e.splice(0);const f=new o.TorusGeometry(7.7,.075,5,72);f.rotateX(Math.PI/2),f.translate(0,2.18,0),e.push(S(f,{col:t.gold,mat:1})),yield e.splice(0);const g=[[.2,0],[.24,.1],[.13,.3],[.21,.62],[.1,.95],[.16,1.05],[.18,1.14],[.02,1.24]],k=[];for(let s=0;s<18;s++){const u=(s+.5)/18*C;k.push(M(Math.sin(u)*7.7,1,Math.cos(u)*7.7))}e.push(j(q([W(g,7,t.white,t.pool),S(new o.SphereGeometry(.15,7,5),{col:t.gold,mat:1,m:M(0,1.3,0)})]),k)),yield e.splice(0),e.push(W([[4.4,1.6],[4.7,1.9],[4.72,2.3],[4.35,2.6],[4.2,2.9]],40,t.white,t.pool)),yield e.splice(0),e.push(W([[4.2,2.9],[4.2,6.4]],40,t.white,t.pool,{row:l.wallRow,rep:6})),e.push(W([[4.2,6.4],[4.45,6.6],[4.75,6.95],[4.65,7.3],[3.9,7.85],[2.7,8.3],[2.1,8.7],[2,10.6]],40,t.white,t.pool));const b=new o.TorusGeometry(4.72,.09,5,48);b.rotateX(Math.PI/2),b.translate(0,7.02,0),e.push(S(b,{col:t.gold,mat:1}));for(let s=0;s<6;s++){yield e.splice(0);const u=s/6*C,v=s===0,x=v?1.7:1.05,G=v?2.9:2,z=v?2.75:3.6,B=new o.ExtrudeGeometry(ke(x,G),{depth:.2,bevelEnabled:!0,bevelThickness:.06,bevelSize:.06,bevelSegments:1,curveSegments:5});e.push(S(B,v?{col:(F,A,L,X,_,U)=>U.copy(t.cobalt).lerp(t.deep,.55*(1-A/G)),m:M(Math.sin(u)*4.1,z,Math.cos(u)*4.1,u)}:{col:(F,A,L,X,_,U)=>U.copy(t.lamp).multiplyScalar(.55+.45*A/G),mat:3,m:M(Math.sin(u)*4.1,z,Math.cos(u)*4.1,u)}));const N=[];for(let F=0;F<=8;F++){const A=F/8*Math.PI;N.push([Math.cos(A)*x*.56,G-x/2+Math.sin(A)*x*.56,.3])}if(N.unshift([x*.56,0,.3]),N.push([-x*.56,0,.3]),e.push(S(Z(N,.075,14,5),{col:t.gold,mat:1,m:M(Math.sin(u)*4.1,z,Math.cos(u)*4.1,u)})),v){const F=new o.TorusGeometry(.5,.15,6,16);e.push(S(F,{col:(A,L,X,_,U,Q)=>Q.copy(t.green).multiplyScalar(.7+.5*Math.abs(Math.sin(_*40))),m:M(0,z+1.75,4.1+.36)}));for(let A=0;A<9;A++){const L=A/9*C+p()*.3;e.push(S(new o.SphereGeometry(.085,6,4),{col:t.red,m:M(Math.cos(L)*.5,z+1.75+Math.sin(L)*.5,4.1+.5)}))}e.push(S(new o.SphereGeometry(.09,6,4),{col:t.gold,mat:1,m:M(.5,z+1,4.1+.3)}))}}yield e.splice(0);const w=[];for(let s=10.6;s<=25.61;s+=.5){const u=(s-10.6)/15;w.push([1.75-.6*u+.11*Math.sin(s*2.1),s])}const c=l.twist,d=l.flutes,m=(s,u,v)=>Math.sin(Math.atan2(s,v)*d+u*c);e.push(W(w,30,t.white,t.pool,{pre:s=>{const u=s.attributes.position;for(let v=0;v<u.count;v++){const x=u.getX(v),G=u.getY(v),z=u.getZ(v),B=1+.075*m(x,G,z);u.setX(v,x*B),u.setZ(v,z*B)}s.computeVertexNormals()},tint:(s,u,v,x,G,z)=>z.copy(t.white).lerp(t.cobalt,o.MathUtils.smoothstep(m(s,u,v),-.75,-.35)*.92)})),yield e.splice(0),e.push(W([[1.15,25.6],[1.45,25.95],[1.45,27],[1.05,27.35],[.88,28.6],[.8,30],[1.02,30.5]],20,t.white,t.pool));const i=l.bulb;e.push(W([[1.02,30.5],[1.5*i,31.1],[2*i,31.9],[2.25*i,32.8],[2.05*i,33.8],[1.45*i,34.6],[.95,35.2],[.72,35.6]],28,t.white,t.pool,l.bulbRow===1?{tint:(s,u,v,x,G,z)=>z.copy(t.white).lerp(t.cobalt,o.MathUtils.smoothstep(Math.sin(Math.atan2(s,v)*d-u*c*2.4),-.2,.2)*.94)}:{row:l.bulbRow,rep:8})),yield e.splice(0),e.push(W([[.72,35.6],[.6,36.7],[.9,37],[.95,37.25],[.5,37.6],[.34,38.5]],16,t.white,t.pool,{tint:(s,u,v,x,G,z)=>z.copy(u>36.9&&u<37.4?t.cobalt:t.white)}));for(const[s,u,v]of[[1.1,30.45,.13],[.82,35.55,.12],[1.5,26.5,.1],[2.33*i,32.8,.07]]){const x=new o.TorusGeometry(s,v,6,28);x.rotateX(Math.PI/2),x.translate(0,u,0),e.push(S(x,{col:t.gold,mat:1}))}e.push(S(new o.SphereGeometry(.55,12,8),{col:t.gold,mat:1,m:M(0,38.85,0,0,0,0,1,1.15,1)})),e.push(S(de(l.finialPoints,1.25,.24),{col:t.gold,mat:1,flat:!0,m:M(0,40.3,0,p()*3)})),yield e.splice(0);const n=(s,u,v,x,G,z)=>z.copy(t.steel).multiplyScalar(.8+.3*r.n2(s*6,v*.4));for(let s=0;s<30;s++){const u=-18.1+s*1.248,v=9-s*.17-s%2*.12,x=4.7,G=new me(.92,.3,v,1,.08),z=G.attributes.position;for(let B=0;B<z.count;B++){const N=.5-z.getZ(B)/v;z.setY(B,z.getY(B)*(1.25-.6*N))}e.push(S(G,{col:n,mat:1,kind:2,phase:(s*.377+p()*.2)%1,amp:(B,N,F)=>{const A=.5-F/v;return .2*A*A},m:M(u,-3,x+v/2)})),s%3===2&&(yield e.splice(0))}const h=new me(38.6,.7,3.4,1,.12);h.rotateY(Math.atan2(4.9,36.2)),e.push(S(h,{col:n,mat:1,m:M(0,-2.9,12.3)}));for(let s=0;s<9;s++){const u=-17+s*4.25;e.push(S(new o.CylinderGeometry(.42,.5,.35,8),{col:t.brass,mat:1,m:M(u,-2.45,12.4-u*.135)}))}yield e.splice(0);for(const s of[-1,1])e.push(S(new me(2.2,9,5,2,.4),{col:t.brass,mat:1,m:M(s*21.6,-11,0)}));yield e.splice(0)}function*Re(l){const{rng:p,noise:r,C:t}=l,e=[],y=new o.CylinderGeometry(6,6,38,56,12,!1);y.rotateZ(Math.PI/2),e.push(S(y,{col:(k,b,w,c,d,m)=>m.copy(t.brass).multiplyScalar(.5+.45*Math.pow(Math.abs(Math.sin((k+18.1)/1.248*Math.PI)),.6)+.1*r.n2(k*.8,Math.atan2(b,w)*2)),mat:1})),yield e.splice(0);const a=[],f=[];for(let k=0;k<30;k++){const b=-18.1+k*1.248,w=12+p.int(0,3);for(let c=0;c<w;c++){const d=(c+p())/w*C;a.push(M(b,Math.cos(d)*6.45,Math.sin(d)*6.45,0,d))}}for(let k=0;k<a.length;k+=100)e.push(j(S(new o.ConeGeometry(.3,1.1,5,1,!0),{col:t.steel,mat:1}),a.slice(k,k+100))),yield e.splice(0);for(const k of[-1,1]){const b=oe([[1.3,0],[6.9,0],[7,.25],[6.9,.7],[6,.8],[1.3,1.6]],40);b.rotateZ(-k*Math.PI/2),e.push(S(b,{col:t.brass,mat:1,m:M(k*19,0,0)}));for(let w=0;w<30;w++){const c=w/30*C;f.push(M(k*19.35,Math.cos(c)*7.2,Math.sin(c)*7.2,0,c))}}yield e.splice(0),e.push(j(S(new o.BoxGeometry(.7,.9,.75),{col:t.brass,mat:1}),f));const g=new o.CylinderGeometry(1.3,1.3,43,14);g.rotateZ(Math.PI/2),e.push(S(g,{col:t.steel,mat:1})),yield e.splice(0)}function Se(l){const{rng:p,C:r}=l,t=p.range(.7,1.2),e={amp:.9,phase:0,kind:0},y=[],a=(b,w,c)=>y.push(S(b,{...w,...e,m:c})),f=new o.SphereGeometry(1,14,10);{const b=f.attributes.position;for(let w=0;w<b.count;w++){const c=b.getZ(w);b.setY(w,b.getY(w)*(1+.14*c)+.05*c*c)}f.computeVertexNormals()}a(f,{col:(b,w,c,d,m,i)=>i.copy(r.white).lerp(r.pool,o.MathUtils.clamp(-w*.55,0,.6)),row:3,rep:3},M(0,0,0,0,0,0,.56,.64,1.3)),a(new o.CylinderGeometry(.26,.42,1.4,8),{col:r.white},M(0,.78,1,0,.62)),a(new o.SphereGeometry(1,10,8),{col:r.white},M(0,1.47,1.55,0,.28,0,.3,.33,.5)),a(new o.SphereGeometry(1,8,6),{col:(b,w,c,d,m,i)=>i.copy(r.white).lerp(r.pool,.35)},M(0,1.33,1.98,0,.3,0,.19,.18,.27));for(const b of[-1,1]){a(new o.ConeGeometry(.09,.34,5),{col:r.white},M(b*.25,1.8,1.33,0,-.3,-b*.8)),a(new o.SphereGeometry(.055,5,4),{col:r.deep},M(b*.24,1.56,1.78)),a(Z([[b*.15,1.7,1.42],[b*.42,2.2,1.22],[b*.78,2.66,1.2],[b*.92,3.12,1.48]],.07,6,5),{col:r.gold,mat:1}),a(Z([[b*.42,2.2,1.22],[b*.46,2.52,1.7]],.055,2,4),{col:r.gold,mat:1}),a(Z([[b*.78,2.66,1.2],[b*1.14,2.94,.98]],.055,2,4),{col:r.gold,mat:1}),a(Z([[b*.6,2.44,1.2],[b*.7,2.82,1.62]],.05,2,4),{col:r.gold,mat:1});const w=(c,d,m,i)=>{const n=[-Math.cos(m),-Math.sin(m)],h=[c+.85*n[0],d+.85*n[1]],s=[-Math.cos(i),-Math.sin(i)],u=[h[0]+.82*s[0],h[1]+.82*s[1]];a(new o.CylinderGeometry(.2,.13,.9,6),{col:r.white},M(b*.3,c+.42*n[0],d+.42*n[1],0,m)),a(new o.CylinderGeometry(.12,.08,.84,6),{col:(v,x,G,z,B,N)=>N.copy(r.white).lerp(r.cobalt,x<-.1?.85:0)},M(b*.3,h[0]+.41*s[0],h[1]+.41*s[1],0,i)),a(new o.CylinderGeometry(.1,.15,.18,6),{col:r.gold,mat:1},M(b*.3,u[0],u[1],0,i))};w(-.32,.82,-.75*t+b*.12,.45*t),w(-.28,-.85,.5*t+b*.12,.95*t)}a(new o.SphereGeometry(.15,6,5),{col:r.white},M(0,.3,-1.32));const g=new o.TorusGeometry(.61,.055,5,16);a(g,{col:r.gold,mat:1},M(0,.02,.12,0,0,0,1,1.07,1)),a(new o.SphereGeometry(1,10,6,0,C,0,1.2),{col:(b,w,c,d,m,i)=>i.copy(r.cobalt).lerp(r.gold,w<.42?1:0)},M(0,.06,-.05,0,0,0,.6,.66,.62));const k=new o.TorusGeometry(.39,.06,5,12);return a(k,{col:r.gold,mat:1},M(0,.52,.84,0,-(Math.PI/2-.62))),a(new o.SphereGeometry(.1,6,5),{col:r.gold,mat:1},M(0,.3,1.22)),q(y)}function*Fe(l){const{rng:p,noise:r,C:t}=l,e=[],y=l.scallops,a=(n,h)=>o.MathUtils.smoothstep(Math.cos(Math.atan2(n,h)*6),-.14,.14);e.push(W([[2.25,8.8],[3.6,8.62],[6.6,8.7],[9.6,8.8],[10.9,9.15],[11.3,9.45]],72,t.white,t.pool,{row:1,rep:12,vrep:3,tint:(n,h,s,u,v,x)=>{const G=Math.hypot(n,s);x.copy(t.white).lerp(t.sky,.7*a(n,s)).lerp(t.cobalt,.9*Math.max(o.MathUtils.smoothstep(G,10.2,10.7),1-o.MathUtils.smoothstep(G,3.5,4)))}}));for(let n=0;n<12;n++){const h=(n+.5)/12*C,s=Math.sin(h),u=Math.cos(h);e.push(S(Z([[s*3.7,8.55,u*3.7],[s*6.6,8.62,u*6.6],[s*9.6,8.72,u*9.6],[s*10.85,9.05,u*10.85]],.065,4,5),{col:t.gold,mat:1}))}{const n=new o.TorusGeometry(3.75,.08,5,36);n.rotateX(Math.PI/2),n.translate(0,8.55,0),e.push(S(n,{col:t.gold,mat:1}))}e.push(W([[11.3,9.45],[11.3,9.92]],64,t.cobalt,t.deep)),e.push(W([[11.3,9.92],[11.15,10.02],[10.9,10.02]],64,t.white,t.pool)),e.push(W([[10.9,10.02],[8.1,10.02],[5.3,10.02],[2.6,10.02]],64,t.white,t.pool,{row:l.deckRow,rep:10,vrep:3}));for(const n of[9.42,9.95]){const h=new o.TorusGeometry(11.33,.1,5,72);h.rotateX(Math.PI/2),h.translate(0,n,0),e.push(S(h,{col:t.gold,mat:1}))}e.push(W([[2.6,10.02],[2.9,10.2],[2.9,10.7],[2.6,11]],28,t.white,t.pool)),e.push(W([[2.6,11],[2.6,16.2]],28,t.white,t.pool,{row:3,rep:6,vrep:2})),e.push(W([[2.6,16.2],[2.95,16.5],[3.3,17.2],[3,17.9],[2.2,18.4]],28,t.white,t.pool));for(const n of[10.95,16.25]){const h=new o.TorusGeometry(2.66,.09,5,28);h.rotateX(Math.PI/2),h.translate(0,n,0),e.push(S(h,{col:t.gold,mat:1}))}yield e.splice(0);const f=(n,h)=>Math.cos(Math.atan2(n,h)*y),g=n=>{const h=n.attributes.position;for(let s=0;s<h.count;s++){const u=h.getX(s),v=h.getZ(s),x=Math.hypot(u,v),G=f(u,v),z=1+.04*G*o.MathUtils.smoothstep(x,2.5,6);h.setXYZ(s,u*z,h.getY(s)-.6*(.5+.5*G)*o.MathUtils.smoothstep(x,10.4,11.6)+.22*G*Math.sin(Math.min(1,(x-2)/9.6)*Math.PI),v*z)}n.computeVertexNormals()},k=[[11.6,17.5],[11.3,17.85],[9.6,18.65],[7.2,19.6],[4.8,20.75],[2.9,22],[2,23.1],[1.85,24]];l.canopyStyle===0?e.push(W(k,y*8,t.white,t.pool,{pre:g,tint:(n,h,s,u,v,x)=>x.copy(t.white).lerp(t.cobalt,o.MathUtils.smoothstep(Math.cos(Math.atan2(n,s)*y/2),-.12,.12)*.94)})):e.push(W(k,y*8,t.white,t.pool,{pre:g,row:1,rep:y*2,vrep:4,tint:(n,h,s,u,v,x)=>x.copy(t.white).lerp(t.sky,.7*o.MathUtils.smoothstep(-f(n,s),.1,.9))}));for(let n=0;n<y;n++){const h=(2*n+1)*Math.PI/y,s=Math.sin(h),u=Math.cos(h),v=[];for(const[x,G]of[[11.35,17.8],[9.6,18.65],[7.2,19.6],[4.8,20.75],[2.9,22]]){const z=1-.04*o.MathUtils.smoothstep(x,2.5,6);v.push([s*x*z,G-.22*Math.sin(Math.min(1,(x-2)/9.6)*Math.PI)-.02,u*x*z])}e.push(S(Z(v,.06,5,5),{col:t.gold,mat:1}))}const b=new o.CylinderGeometry(11.55,11.55,1.15,y*8,2,!0);{const n=b.attributes.position;for(let h=0;h<n.count;h++)n.getY(h)<-.5&&n.setY(h,n.getY(h)-.5*(.5+.5*f(n.getX(h),n.getZ(h))))}e.push(S(b,{col:t.white,row:2,rep:y*2,m:M(0,17,0)}));for(let n=0;n<y;n++){const h=(2*n+1)*Math.PI/y;e.push(S(new o.SphereGeometry(.24,8,6),{col:t.gold,mat:1,m:M(Math.sin(h)*11.2,17.45,Math.cos(h)*11.2)}))}yield e.splice(0);{const n=S(new o.SphereGeometry(.2,7,5),{col:t.lamp,mat:3}),h=[];for(let s=0;s<y*2;s++){const u=s*Math.PI/y;h.push(M(Math.sin(u)*11.78,16.72-(s%2?0:.42),Math.cos(u)*11.78,0,0,0,s%2?.85:1.15))}for(let s=0;s<y*2;s++){const u=(s+.5)*Math.PI/y;h.push(M(Math.sin(u)*9.7,17.95,Math.cos(u)*9.7,0,0,0,.9))}for(let s=0;s<12;s++){const u=s/12*C;h.push(M(Math.sin(u)*3.45,17.1,Math.cos(u)*3.45,0,0,0,.9))}for(let s=0;s<24;s++){const u=(s+.5)/24*C;h.push(M(Math.sin(u)*10.5,8.9,Math.cos(u)*10.5,0,0,0,.9))}e.push(j(n,h)),n.dispose()}yield e.splice(0);const w=new o.TorusGeometry(1.95,.13,6,24);w.rotateX(Math.PI/2),w.translate(0,24,0),e.push(S(w,{col:t.gold,mat:1}));for(let n=0;n<10;n++){const h=n/10*C;e.push(S(new o.ConeGeometry(.16,.7,5),{col:t.gold,mat:1,m:M(Math.sin(h)*1.95,24.4,Math.cos(h)*1.95,h,.25)}))}yield e.splice(0);const c=p.int(0,7),d=[Se(l)],m=[[],[]],i=[[],[]];yield[],d.push(Se(l)),yield[];for(let n=0;n<8;n++){const h=n/8*C,s=Math.sin(h)*8.3,u=Math.cos(h)*8.3,v=new o.CylinderGeometry(.11,.11,7.9,6,16);{const z=v.attributes.position;for(let B=0;B<z.count;B++){const N=z.getY(B),F=N*3,A=z.getX(B),L=z.getZ(B),X=1+.35*Math.sin(N*9);z.setX(B,(A*Math.cos(F)-L*Math.sin(F))*X),z.setZ(B,(A*Math.sin(F)+L*Math.cos(F))*X)}v.computeVertexNormals()}e.push(S(v,{col:t.gold,mat:1,m:M(s,13.95,u)}));for(const z of[10.12,17.6])e.push(S(new o.SphereGeometry(.24,7,5),{col:t.gold,mat:1,m:M(s,z,u)}));const x=M(s,13.6,u,h+Math.PI/2,0,0,1.25),G=n*Math.PI*.75+p()*.4;m[n%2].push(x),i[n%2].push(G),e.push(S(new o.SphereGeometry(.1,6,5),{col:n===c?t.red:t.cobalt,amp:.9,phase:G,kind:0,m:x.clone().multiply(M(0,1.3,2.25))}))}yield e.splice(0);for(let n=0;n<2;n++)e.push(j(d[n],m[n],(h,s)=>{const u=h.attributes.aFx.array;for(let v=0;v<m[n].length;v++)for(let x=0;x<s;x++)u[(v*s+x)*4+2]=i[n][v]})),yield e.splice(0)}function ze(l){const{C:p}=l,r=[],t=(e,y,a)=>r.push(S(e,{...y,m:a}));t(new o.SphereGeometry(1,10,8),{col:(e,y,a,f,g,k)=>k.copy(p.white).lerp(p.pool,o.MathUtils.clamp(-y*.5,0,.5))},M(0,0,0,0,0,0,.42,.37,.92)),t(Z([[0,.08,.72],[0,.3,1.25],[0,.44,1.78]],.115,5,6),{col:p.white}),t(new o.SphereGeometry(.18,8,6),{col:p.white},M(0,.46,1.92,0,0,0,1,1,1.3)),t(new o.ConeGeometry(.085,.36,5),{col:p.gold,mat:1},M(0,.44,2.24,0,Math.PI/2));for(const e of[-1,1])t(new o.SphereGeometry(.04,5,4),{col:p.deep},M(e*.14,.52,2));t(new o.ConeGeometry(.3,.7,6),{col:(e,y,a,f,g,k)=>k.copy(p.white).lerp(p.cobalt,y>.1?.8:0)},M(0,.06,-1.05,0,-Math.PI/2,0,1,1,.3));for(const e of[-1,1]){const y=new o.BoxGeometry(1.75,.07,.8,5,1,2),a=y.attributes.position;for(let f=0;f<a.count;f++){const g=(a.getX(f)+.875)/1.75;a.setXYZ(f,e*(.28+g*1.75),a.getY(f)*(1-.5*g)+.24*Math.sin(g*Math.PI)+.1,a.getZ(f)*(1-.68*g)-.55*g*g+.1)}y.computeVertexNormals(),t(y,{col:(f,g,k,b,w,c)=>c.copy(p.white).lerp(p.cobalt,Math.abs(f)>1.55?.85:0),row:1,rep:3,kind:1,amp:f=>(Math.abs(f)-.28)*.42})}return q(r)}function*_e(l){const{rng:p,noise:r,C:t}=l,e=[],y=12;e.push(S(oe([[1.55,25.85],[1.78,26.05],[1.78,26.95],[1.55,27.15]],20),{col:t.gold,mat:1}));const a=new o.CylinderGeometry(5,5,1.3,96,2,!0);{const m=a.attributes.position;for(let i=0;i<m.count;i++)if(m.getY(i)>.5){const n=Math.max(0,Math.cos(Math.atan2(m.getX(i),m.getZ(i))*y));m.setY(i,m.getY(i)+1*n*n*n)}a.computeVertexNormals()}e.push(S(a,{col:(m,i,n,h,s,u)=>u.copy(t.white).lerp(t.pool,.25),row:l.crownRow,rep:12,m:M(0,26.65,0)}));for(const m of[26,27.3]){const i=new o.TorusGeometry(5.03,.1,5,60);i.rotateX(Math.PI/2),i.translate(0,m,0),e.push(S(i,{col:t.gold,mat:1}))}const f=p()*C,g=[],k=[],b=[],w=[],c=[];for(let m=0;m<y;m++){const i=m/y*C,n=Math.sin(i),h=Math.cos(i);e.push(S(new o.SphereGeometry(.2,7,5),{col:t.gold,mat:1,m:M(n*5,28.45,h*5)})),e.push(S(new o.SphereGeometry(.17,6,4),{col:t.lamp,mat:3,m:M(Math.sin(i+Math.PI/y)*5.08,26.65,Math.cos(i+Math.PI/y)*5.08)})),e.push(S(Z([[n*1.7,26.5,h*1.7],[n*3.4,26.85,h*3.4],[n*5,26.5,h*5]],.075,4,5),{col:t.gold,mat:1}));const s=29+1.5*Math.sin(i*2+f)+p.range(-.3,.3),u=7.6;e.push(S(Z([[n*5,27.3,h*5],[n*6.2,s+.1,h*6.2],[n*u,s-.45,h*u]],.07,6,5),{col:t.brass,mat:1})),g.push(M(n*u,s,h*u,i-Math.PI/2,0,0,1.45)),k.push(p()*C);const v=i+Math.PI/y,x=m%2===1,G=x?3.4:5,z=x?26.75:26,B=x?p.range(1.2,2.1):p.range(1.9,3.2),N=Math.sin(v)*G,F=Math.cos(v)*G,A=p()*C,L=(_,U)=>(z-U)*.07,X=new o.CylinderGeometry(.045,.045,B,4,3);X.translate(N,z-B/2,F),e.push(S(X,{col:t.gold,mat:1,kind:3,phase:A,amp:L})),b.push(M(N,z-B-.2,F,p()*3)),w.push(z),c.push(A),m%3===2&&(yield e.splice(0))}const d=ze(l);yield[],e.push(j(d,g,(m,i)=>{const n=m.attributes.aFx.array;for(let h=0;h<y;h++)for(let s=0;s<i;s++)n[(h*i+s)*4+2]=k[h]})),yield e.splice(0),e.push(j(S(de(l.starPoints,1.15,.26),{col:t.glass,mat:2,flat:!0,kind:3}),b,(m,i)=>{const n=m.attributes.aFx.array,h=m.attributes.position;for(let s=0;s<y;s++)for(let u=0;u<i;u++){const v=s*i+u;n[v*4+1]=(w[s]-h.getY(v))*.07,n[v*4+2]=c[s]}})),yield e.splice(0)}function*Ee(l){const{rng:p,C:r}=l,t=[],e=[r.cobalt,r.white,r.sky,r.cobalt,r.green,r.white],y=[];for(let a=0;a<8;a++){{const f=[],g=p.pick(e),k=g===r.white,b=1.3*p.range(.9,1.08),w=p.chance(.14)?r.red:p.pick([r.gold,r.cobalt,r.sky]);f.push(W([[.3,.42],[.56,.5],[.5,.76],[.3,1.15],[.27,1.3],[.34,1.5],[.2,1.68],[.1,1.74]],10,g,k?r.pool:r.deep,k?{row:3,rep:2}:{}));const c=p.range(.2,1);f.push(S(new o.CylinderGeometry(.075,.06,.5,5),{col:r.white,m:M(.12,.25,.02)})),f.push(S(new o.CylinderGeometry(.075,.06,.55,5),{col:r.white,m:M(-.12,.3+c*.12,-.12-c*.22,0,c)})),f.push(S(new o.BoxGeometry(.06,.07,.46),{col:r.gold,mat:1,m:M(.12,.035,.05)})),f.push(S(new o.BoxGeometry(.06,.07,.46),{col:r.gold,mat:1,m:M(-.12,.1+c*.3,-.3-c*.35,0,c)})),f.push(S(new o.SphereGeometry(.2,8,6),{col:r.skin,m:M(0,1.9,.02)})),p.chance(.6)?(f.push(S(new o.ConeGeometry(.21,.42,7),{col:w,m:M(0,2.2,-.03,0,-.25)})),f.push(S(new o.SphereGeometry(.075,5,4),{col:r.gold,mat:1,m:M(0,2.42,-.1)}))):f.push(S(new o.SphereGeometry(.23,8,5,0,C,0,1.7),{col:w,m:M(0,1.93,-.04,0,-.5)}));const d=p.int(0,2);for(const i of[-1,1]){const n=d===0?i*1.1:d===1?i*.25:i*.35,h=d===1?i*.9:d===2?.7:.1,s=new o.CylinderGeometry(.075,.055,.62,5);s.translate(0,-.31,0),f.push(S(s,{col:g,m:M(i*.27,1.56,0,0,h,n)}))}f.push(S(new o.BoxGeometry(.16,.05,.8),{col:w,m:M(.08,1.62,-.48,.2,.35)}));const m=q(f);m.applyMatrix4(M(0,0,0,0,.14,0,b)),y.push(m)}a%2===1&&(yield[])}for(let a=0;a<12;a++){const f=11.9+a%4*2.45+p.range(-.3,.3),g=a%4===2?-1:1,k=a/12*C*2.4+p(),b=p()*C,w=g*p.range(3.2,4.6)/f;for(let c=0;c<2;c++){const d=y[(a*2+c*3+(a>>2))%8].clone(),m=d.attributes.position.count,i=new Float32Array(m*4);for(let n=0;n<m;n++)i[n*4]=f,i[n*4+1]=k+c*(2.6/f)*g,i[n*4+2]=w,i[n*4+3]=b+c*Math.PI;d.setAttribute("aOrb",new o.BufferAttribute(i,4)),t.push(d)}a%4===3&&(yield t.splice(0))}}const Ye=`
  varying vec3 vW, vL;
  #include <fog_pars_vertex>
  void main(){ vL = position; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,Ue=`
  uniform vec3 uIce; varying vec3 vW, vL;
  #include <fog_pars_fragment>
  ${ue}
  void main(){
    vec3 V = normalize(cameraPosition - vW);
    float r = length(vL.xz), a = atan(vL.x, vL.z);
    vec3 N = normalize(vec3(0.03 * sin(vL.x * 0.9 + vL.z * 0.4), 1.0, 0.03 * sin(vL.z * 1.1 - vL.x * 0.3)));
    float ndv = max(dot(N, V), 0.0), fr = 0.04 + 0.96 * pow(1.0 - ndv, 5.0);
    vec3 R = reflect(-V, N);
    float sc = 0.0;                                         // skate tracks: the same weave the skaters follow
    for (int k = 0; k < 3; k++) {
      float fk = float(k), q = (r - 1.9 * sin(a * 3.0 + fk * 1.7)) * (0.31 + 0.13 * fk) + fk * 0.37;
      float l = abs(fract(q) - 0.5), w = fwidth(q) * 1.2 + 0.012;
      sc += smoothstep(w, 0.0, l) * (0.5 + 0.5 * sin(a * 7.0 + fk * 2.0));
    }
    float ca = caustic(vW.xz);
    vec3 col = uIce * 0.3 + roomEnv(R) * fr + vec3(0.85, 0.92, 1.0) * sc * 0.1 + uSunCol * ca * 0.22 + uSunCol * pow(max(dot(R, uSunDir), 0.0), 500.0) * 6.0;
    float alpha = clamp(0.12 + fr * 0.9 + sc * 0.1 + ca * 0.12, 0.0, 0.95);
    float rim = smoothstep(21.2, 23.1, r) + smoothstep(10.2, 8.5, r);    // frosted where it meets the snow
    col = mix(col, vec3(0.72, 0.8, 0.9) * (0.75 + 0.3 * ca), rim * 0.75); alpha = mix(alpha, 0.93, rim * 0.85);
    gl_FragColor = vec4(col, alpha);
    #include <fog_fragment>
  }`,Le=`
  attribute vec4 aSeed;
  uniform float uTime, uSwirl, uS, uFall, uEntry; uniform vec3 uSunDir, uDome, uAim;
  varying vec2 vQ; varying vec4 vInfo; varying float vHex;
  #include <fog_pars_vertex>
  void main(){
    float h1 = aSeed.x, h2 = aSeed.y, h3 = aSeed.z, h4 = aSeed.w;
    // poloidal disc around the torus core, rolling while the swirl lasts
    float rho = 35.0 * sqrt(h1), phi = h2 * 6.2832 + uSwirl * 0.16 * (0.6 + 0.8 * h4);
    float r = 41.0 + rho * cos(phi), y = 37.0 + rho * sin(phi) * 1.03;
    y = mod(y - uFall * (0.75 + 0.5 * h3), 74.0);
    r = sqrt(r * r + 72.0);                                   // the clear eye
    float w = 34.0 / (r + 8.0);
    float arm = floor(h3 * 3.0) / 3.0 + 0.11 * (fract(h3 * 3.0) - 0.5) * (1.0 + 3.0 * step(0.62, h4) * 1.5);
    float ang = arm * 6.2832 + w * uSwirl;
    vec3 c = vec3(sin(ang) * r, y, cos(ang) * r);
    c += 0.4 * vec3(sin(uTime * 1.3 + h1 * 40.0), 0.6 * sin(uTime * 1.7 + h2 * 40.0), cos(uTime * 1.1 + h4 * 40.0));
    vec3 vel = vec3(cos(ang), 0.0, -sin(ang)) * w * r * uS + vec3(0.0, -1.2 * (1.0 - uS), 0.0);
    vec4 mv = viewMatrix * modelMatrix * vec4(c, 1.0);
    float dist = length(mv.xyz);
    vHex = step(0.75, fract(h4 * 7.31));
    float size = mix(0.13, 0.22, vHex);
    size = max(size, dist * 0.00095) * smoothstep(4.0, 22.0, dist) * step(length(c - uDome), 77.0) * step(0.2, c.y);
    // entry: a clean tube from the eye to the spire so the hero's silhouette reads, and thinner far streaks
    vec3 wc = (modelMatrix * vec4(c, 1.0)).xyz - cameraPosition, ab = uAim - cameraPosition;
    float dl = length(wc - ab * clamp(dot(wc, ab) / max(dot(ab, ab), 1e-3), 0.0, 1.0));
    size *= mix(1.0, smoothstep(7.0, 12.5, dl) * (0.3 + 0.7 * smoothstep(95.0, 38.0, dist)) * step(0.35, fract(h2 * 13.7 + h1 * 5.3)), uEntry);
    vec2 vv = (viewMatrix * modelMatrix * vec4(vel, 0.0)).xy;
    float k = smoothstep(0.35, 0.65, uS);
    float tum = uTime * (0.6 + 1.6 * h2) + h1 * 30.0;
    vec2 ax = normalize(mix(vec2(cos(tum), sin(tum)), vv / (length(vv) + 0.001), k) + vec2(0.0001, 0.0));
    float stretch = 1.0 + (3.5 - 1.5 * uEntry) * k * clamp(length(vv) * 0.1, 0.0, 1.0);
    float flat_ = mix(0.3 + 0.7 * abs(sin(tum * 1.7 + h3 * 9.0)), 0.28, k);
    mv.xy += (ax * position.x * stretch + vec2(-ax.y, ax.x) * position.y * flat_) * size;
    // sparkle: a tumbling facet normal against the sun/view half vector
    vec3 wp = (modelMatrix * vec4(c, 1.0)).xyz;
    float t1 = uTime * (1.3 + 2.2 * h1) + h2 * 50.0, t2 = uTime * (0.9 + 1.7 * h3) + h4 * 50.0;
    vec3 n = vec3(sin(t1) * cos(t2), cos(t1), sin(t1) * sin(t2));
    vec3 H = normalize(uSunDir + normalize(cameraPosition - wp));
    float sp = pow(abs(dot(n, H)), 70.0);
    // a third of the mylar hexagons catch the sun outright now and then: a short, bright, coloured flash
    float fl = step(0.7, fract(h1 * 91.7 + h3 * 3.1)) * pow(max(sin(uTime * (1.6 + 2.6 * h2) + h4 * 80.0), 0.0), 24.0);
    vInfo = vec4(sp, 0.5 + 0.5 * n.y, h1 + h3, fl * vHex);
    vQ = position.xy;
    vec4 mvPosition = mv;
    gl_Position = projectionMatrix * mv;
    #include <fog_vertex>
  }`,De=`
  uniform vec3 uWhite, uSkyCol, uSunCol;
  varying vec2 vQ; varying vec4 vInfo; varying float vHex;
  #include <fog_pars_fragment>
  void main(){
    vec2 q = abs(vQ);
    float d = vHex > 0.5 ? max(q.x * 0.866 + q.y * 0.5, q.y) * 1.12 : length(vQ);
    if (d > 1.0) discard;
    vec3 col = uWhite * mix(vec3(1.0), uSkyCol, 0.22) * (0.7 + 0.16 * vInfo.y);          // white snow, a breath of the sky in it
    if (vHex > 0.5) {
      vec3 iri = 0.6 + 0.4 * cos(6.2832 * (vInfo.z * 1.7 + vInfo.y * 0.8 + vec3(0.0, 0.33, 0.67)));
      col = mix(col * 0.94, iri * 0.85, 0.14) + mix(vec3(1.0), iri, 0.6) * (vInfo.x * 7.0 + vInfo.w * 5.5);
    } else col += uSunCol * vInfo.x * 2.6;
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }`,Ce=`
  #ifdef RISE
  attribute vec4 aB; uniform vec3 uTarget;
  #endif
  uniform float uTime;
  varying vec3 vW, vN;
  #include <fog_pars_vertex>
  void main(){
    vec3 p = position, n = normal;
    #ifdef RISE
      float span = uTarget.y - 3.0, f = fract(aB.z + uTime * aB.w / span), wob = sin(uTime * 3.1 + aB.z * 40.0);
      p.xz *= 1.0 + 0.1 * wob; p.y *= 1.0 - 0.12 * wob;
      float k = smoothstep(0.4, 1.0, f);
      vec2 c = mix(aB.xy, uTarget.xz + aB.xy * 0.2, k) + 0.8 * vec2(sin(uTime * 0.9 + f * 20.0 + aB.z * 9.0), cos(uTime * 0.7 + f * 17.0));
      p *= smoothstep(0.0, 0.04, f) * (1.0 - smoothstep(0.95, 1.0, f));
      p += vec3(c.x, 3.0 + f * span, c.y);
    #else
      p += n * 0.1 * sin(uTime * 1.7 + p.x * 0.7 + p.z * 0.5);
    #endif
    vec4 w = modelMatrix * vec4(p, 1.0);
    vW = w.xyz; vN = normalize(mat3(modelMatrix) * n);
    vec4 mvPosition = viewMatrix * w;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,Ge=`
  uniform mat4 uInv; uniform vec3 uWhite, uPool, uCobalt, uGold, uGreen, uIce, uBrass, uDome, uTarget; uniform float uGores, uOpen;
  varying vec3 vW, vN;
  #include <fog_pars_fragment>
  ${ue}
  // the village as the mirror holds it: a painted-plate rosette (canopy gores, the pond over its brass cylinder, two rings
  // of cobalt roofs with gilt ridges, the pine rim). p is in rosette units: canopy 11.6, pond to 19.5, roofs to 33.
  vec3 village(vec2 p){
    float r = length(p), a = atan(p.x, p.y + 1e-5); vec3 wh = min(uWhite, vec3(0.8));
    vec3 c = mix(wh * 0.75, uPool * 0.78, 0.2 + 0.14 * sin(p.x * 0.31) * cos(p.y * 0.27));
    float k1 = a * 1.9098593, k2 = a * 2.8647890 + 0.5;                       // 12 and 18 roofs
    float w1 = step(abs(fract(k1) - 0.5), 0.34) * step(abs(r - 24.3), 2.5) * step(0.12, hash22(vec2(floor(k1), 3.0)).x);
    float w2 = step(abs(fract(k2) - 0.5), 0.33) * step(abs(r - 30.6), 2.1) * step(0.2, hash22(vec2(floor(k2), 9.0)).x);
    c = mix(c, uCobalt * (0.8 + 0.3 * step(0.5, fract(k1 * 0.5))), w1); c = mix(c, uCobalt * 0.82, w2);
    c = mix(c, uGold * 1.15, max(w1 * step(abs(r - 24.3), 0.4), w2 * step(abs(r - 30.6), 0.36)));
    float k3 = a * 5.7295780;                                                 // 36 pines on the rim
    c = mix(c, uGreen * 1.5, step(length(vec2((fract(k3) - 0.5) * 1.3, (r - 35.3) * 0.3)), 0.46) * step(0.25, hash22(vec2(floor(k3), 5.0)).x));
    c = mix(c, uCobalt * 0.55, smoothstep(37.2, 38.2, r));                    // a cobalt border: the lens keeps a dark edge against the ceiling
    c = mix(c, wh * 0.98, smoothstep(21.4, 21.0, r));                     // the snow bank, the brightest white
    vec3 pond = mix(uCobalt * 0.6, uBrass * 1.05, step(abs(p.y), 3.3) * step(abs(p.x), 17.6));
    pond = mix(pond, uCobalt * 0.36, step(abs(abs(p.y) - 3.3), 0.3) * step(abs(p.x), 17.6));
    c = mix(c, pond, smoothstep(19.6, 19.2, r));
    c = mix(c, mix(wh, uCobalt * 0.95, step(0.0, cos(a * uGores * 0.5))), smoothstep(11.9, 11.5, r));
    c = mix(c, uGold * 1.15, smoothstep(0.55, 0.3, abs(r - 11.7)));
    c = mix(c, wh, smoothstep(4.4, 4.0, r));
    return mix(c, uGold * 1.15, smoothstep(2.3, 1.9, r));
  }
  void main(){
    vec3 V = normalize(cameraPosition - vW), N = normalize(vN);
    if (dot(N, V) < 0.0) N = -N;
    float ndv = max(dot(N, V), 0.0), lip = 0.0, under = 0.0;
    vec3 Nm = N;
    #ifndef RISE
      // the underside is a convex mirror (so it holds the whole village) that opens like an iris for the portal
      vec3 ax = normalize(uTarget - uDome + vec3(0.0, 1e-4, 0.0)), rel = vW - uTarget;
      float t = dot(rel, ax); vec3 rad = rel - ax * t; float rr = length(rad);
      under = step(t, 2.6);
      if (under > 0.5 && rr < uOpen) discard;
      lip = smoothstep(0.6, 0.0, rr - uOpen) * step(0.01, uOpen) * under;
      Nm = normalize(N + rad * 0.036 * under);
    #endif
    vec3 R = reflect(-V, Nm);
    vec3 Pl = (uInv * vec4(vW, 1.0)).xyz, Rl = normalize(mat3(uInv) * R);
    vec3 col = roomEnv(R);
    if (Rl.y < -0.01) {
      vec2 h = Pl.xz + Rl.xz * (-Pl.y / Rl.y);
      #ifdef RISE
        vec3 vc = mix(min(uWhite, vec3(0.8)) * 0.9, uPool * 0.8, 0.3 + 0.2 * sin(h.x * 0.13) * cos(h.y * 0.11));
      #else
        // centred on where the lens's own axis meets the ground, and magnified so the carousel fills two fifths of the disc
        vec3 P0 = (uInv * vec4(uTarget, 1.0)).xyz, A0 = normalize(mat3(uInv) * ax);
        vec2 h0 = P0.xz - A0.xz * (P0.y / max(A0.y, 0.2));
        vec3 vc = village((h - h0) / 2.3) * (0.95 + 0.1 * caustic(h * 0.5)) * mix(1.0, 1.25, under);
      #endif
      col = mix(col, vc, smoothstep(-0.01, -0.1, Rl.y));
    }
    float rim = pow(1.0 - ndv, 4.0), edge = smoothstep(0.35, 0.85, 1.0 - ndv);
    col = col * mix(mix(vec3(0.5, 0.6, 0.8), vec3(0.9, 0.94, 1.0), under), vec3(0.9), rim);
    col = mix(col, col * vec3(0.16, 0.24, 0.44), edge * 0.85 * (1.0 - under * 0.6));                    // dark Fresnel edge: the lens has a silhouette
    col += mix(vec3(0.6, 0.8, 1.0), vec3(1.0, 0.82, 0.7), smoothstep(0.35, 0.9, rim)) * rim * 0.68
         + uSunCol * (pow(max(dot(R, uSunDir), 0.0), 300.0) * 8.0 + 6.0 * pow(1.0 - ndv, 7.0) * smoothstep(-0.2, 0.6, dot(N, uSunDir)))
         + vec3(1.5, 1.75, 2.2) * lip;
    gl_FragColor = vec4(col, 1.0);
    #ifdef RISE
    #include <fog_fragment>
    #endif
  }`;async function He(l,p={}){const r=l.rng.fork("shaken-globe-hero"),t=l.noise,e=(p.palette&&p.palette.length>=7?p.palette:Be).map(P=>new o.Color(P)),y=(P,I,R,E)=>P.clone().offsetHSL(I,R,E),a=e[0].clone().multiplyScalar(.84),f=y(e[3],r.range(-.025,.025),0,r.range(-.03,.03)),g={white:a,pool:e[1].clone().lerp(e[2],.45).multiplyScalar(.82),sky:e[2].clone().multiplyScalar(.85),cobalt:f,deep:f.clone().multiplyScalar(.42),basin:e[2].clone().lerp(f,.45).multiplyScalar(.8),green:e[4].clone(),red:e[6].clone(),gold:e[5].clone().multiply(new o.Color(1.12,.84,.44)),lamp:new o.Color(1,.66,.28),brass:e[5].clone().multiply(new o.Color(.8,.68,.5)),steel:new o.Color(.74,.79,.86),skin:e[0].clone().lerp(e[5],.25).multiplyScalar(.84),glass:e[1].clone().lerp(new o.Color(1,1,1),.3)},k={rng:r,noise:t,C:g,twist:r.sign()*r.range(.55,.95),flutes:r.int(5,8),bulb:r.range(.86,1.2),wallRow:r.pick([0,3,0]),bulbRow:r.pick([1,1,2,0]),deckRow:r.pick([3,2]),crownRow:r.pick([2,0]),scallops:r.pick([10,12,12,14]),canopyStyle:r.chance(.7)?0:1,finialPoints:r.pick([6,14]),starPoints:r.pick([6,14,14])},b=p.duration??40,w=Math.max(0,Math.floor(p.flakes??24e3)),c=new o.Vector3(0,20,0),d=80;let m;{const P=Ve(r);let I;for(;!(I=P.next()).done;)await l.yield();m=I.value}await l.yield();const i={uTime:{value:0},uSunDir:{value:new o.Vector3(0,Math.sin(22*Math.PI/180),Math.cos(22*Math.PI/180))},uSunCol:{value:e[5].clone().lerp(new o.Color(1,1,1),.45)},uSkyCol:{value:e[2].clone().lerp(new o.Color(1,1,1),.32)},uBounce:{value:e[0].clone()},uHorizon:{value:e[0].clone().lerp(e[1],.3)},uCobalt:{value:f},uDeep:{value:e[2].clone().lerp(f,.55)},uBaseY:{value:0},uBrush:{value:m},uSwirl:{value:0},uS:{value:.3},uFall:{value:0},uDome:{value:c},uWhite:{value:a},uPool:{value:g.pool},uGold:{value:g.gold},uGreen:{value:g.green},uBrass:{value:g.brass},uIce:{value:e[1].clone().lerp(e[2],.5)},uInv:{value:new o.Matrix4},uGores:{value:k.scallops},uTarget:{value:new o.Vector3},uCrown:{value:0},uEntry:{value:0},uAim:{value:new o.Vector3(0,30,0)},uOpen:{value:0},uCaK:{value:1},uTsTop:{value:1},uWarm:{value:new o.Color(1,.62,.26).multiplyScalar(1.15)},uGlow:{value:3.2}},n=()=>o.UniformsUtils.merge([o.UniformsLib.fog]),h=(P,I,R={})=>new o.ShaderMaterial({uniforms:{...n(),...i},vertexShader:P,fragmentShader:I,fog:!0,side:o.DoubleSide,...R}),s=h(Me,fe),u=h(Me,fe,{defines:{ORBIT:""}}),v=new o.Group;v.name="shaken-globe-hero";const x=(P,I,R=v)=>{const E=new o.Mesh(P,I);return E.frustumCulled=!1,R.add(E),E};await l.yield();const G=async(P,I,R)=>{const E=[];for(const O of P)E.push(...O),await l.yield();const $=q(E);return await l.yield(),I&&(xe($,t,I,R),await l.yield()),$};await l.yield();{const P=oe([[1,0],[1.2,.5],[1,1]],6);await l.yield();const I=S(P,{col:g.white});await l.yield(),P.dispose(),I.dispose(),W([[1,0],[1.2,.5],[1,1]],6,g.white,g.pool,{row:0,rep:1}).dispose(),await l.yield()}x(await G(Ne(k),.07),s);const z=x(await G(Re(k),0),s);z.position.set(0,-7.6,0),await l.yield();const B=x(await G(Fe(k),.045,.4),s);await l.yield();const N=x(await G(_e(k),.03,.5),s);await l.yield();const F=x(await G(Ee(k),0),u);await l.yield();const A=new o.RingGeometry(8.4,23.15,96,4);A.rotateX(-Math.PI/2);const L=x(A,h(Ye,Ue,{transparent:!0,depthWrite:!1}));L.renderOrder=2;let X=null;if(w>0){const P=new o.InstancedBufferGeometry;P.setAttribute("position",new o.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),P.setIndex([0,1,2,0,2,3]),await l.yield();const I=new Float32Array(w*4);for(let R=0;R<I.length;R++)I[R]=r(),(R&16383)===16383&&await l.yield();await l.yield(),P.setAttribute("aSeed",new o.InstancedBufferAttribute(I,4)),P.instanceCount=w,X=x(P,h(Le,De))}await l.yield();const _=new o.Vector3(0,Math.cos(25*Math.PI/180),-Math.sin(25*Math.PI/180)),U=new o.Group;U.name="air-bubble";const Q={position:new o.Vector3,normal:new o.Vector3,direction:new o.Vector3,radius:7},ae={from:new o.Vector3,to:new o.Vector3},se=[],ve={center:new o.Vector3,radius:9},Pe=new o.Vector3(0,1,0);function ye(P){_.copy(P).normalize(),U.position.copy(c).addScaledVector(_,d),U.quaternion.setFromUnitVectors(Pe,_),Q.position.copy(c).addScaledVector(_,d-5.7),Q.direction.copy(_),Q.normal.copy(_).negate(),ve.center.copy(c).addScaledVector(_,d-3),i.uTarget.value.copy(c).addScaledVector(_,d-7),ae.to.copy(Q.position),ae.from.copy(c).addScaledVector(_,d-5.7-36);const I=_.x,R=_.z,E=Math.hypot(I,R)>.001?Math.atan2(-R,I):Math.PI/2;se.length=0;const $=E-2.5*C;for(let O=0;O<8;O++){const H=$+O/8*C;se.push(new o.Vector3(Math.sin(H)*18,13,Math.cos(H)*18))}for(let O=0;O<=14;O++){const H=O/14,V=$+C+H*1.5*C,T=13+34*H,Y=T<19?18:T<25?18-1*(T-19)/6:T<33?17:17-10*(T-33)/14;se.push(new o.Vector3(Math.sin(V)*Y,T,Math.cos(V)*Y))}se.push(ae.from.clone(),ae.to.clone())}if(p.bubble!==!1){const P=[];for(let T=0;T<=14;T++){const Y=9*Math.sin(T/14*Math.PI/2);P.push([Y,-6+5.3*Math.pow(Y/9,8)])}for(let T=1;T<=8;T++){const Y=9*Math.cos(T/8*Math.PI/2);P.push([Y,-.7*(Y/9)*(Y/9)+0])}const I=[oe(P,48)];for(const T of I)T.deleteAttribute("uv");x(q(I),h(Ce,Ge),U),await l.yield();const R=p.rim??5.8,E=[],$=new o.TorusGeometry(R,.2,8,72),O=new o.TorusGeometry(R+.75,.09,6,72);for(const T of[$,O])T.rotateX(Math.PI/2),T.translate(0,-6.06,0),E.push(S(T,{col:g.gold,mat:1}));for(let T=0;T<24;T++)E.push(S(new o.SphereGeometry(.17,6,4),{col:g.gold,mat:1,m:M(Math.sin(T/24*C)*(R+.38),-6.08,Math.cos(T/24*C)*(R+.38))}));x(q(E),s,U);for(const T of E)T.dispose();v.add(U),await l.yield();const H=[],V=r.fork("bubbles");for(let T=0;T<12;T++){T%3===2&&await l.yield();const Y=T>=7,ce=V()*C,he=Y?V.range(27,36):V.range(23,36),pe=V.int(5,9),ne=Y?(T-7+V())/5:V(),J=V.range(2.2,3.6);for(let ee=0;ee<pe;ee++){const K=Y?V.range(.3,1.1):V.range(.15,.6),D=new o.IcosahedronGeometry(K,1);D.deleteAttribute("uv"),D.translate(V.range(-1.6,1.6),V.range(-2,2),V.range(-1.6,1.6));const be=D.attributes.position.count,re=new Float32Array(be*4);for(let te=0;te<be;te++)re[te*4]=Math.sin(ce)*he,re[te*4+1]=Math.cos(ce)*he,re[te*4+2]=ne+ee*.004,re[te*4+3]=J;D.setAttribute("aB",new o.BufferAttribute(re,4)),H.push(D)}}(p.bubblesAt||[]).forEach((T,Y)=>{const ce=V.int(5,8),he=(Y+V())/Math.max(1,p.bubblesAt.length),pe=V.range(1.5,2.3);for(let ne=0;ne<ce;ne++){const J=new o.IcosahedronGeometry(V.range(.25,.8),1);J.deleteAttribute("uv"),J.translate(V.range(-1.8,1.8),V.range(-2.4,2.4),V.range(-1.8,1.8));const ee=J.attributes.position.count,K=new Float32Array(ee*4);for(let D=0;D<ee;D++)K[D*4]=T[0],K[D*4+1]=T[1],K[D*4+2]=he+ne*.004,K[D*4+3]=pe;J.setAttribute("aB",new o.BufferAttribute(K,4)),H.push(J)}}),await l.yield(),x(q(H),h(Ce,Ge,{defines:{RISE:""}})),await l.yield()}ye(p.bubbleDir||_.clone());let ie=-1,we=6.2,ge=0;const Te=new o.Vector3;function Ie(){if(ie<0)return;const P=ie*b,I=11*(1-Math.exp(-P/11));i.uS.value=Math.exp(-P/11),i.uSwirl.value=I,i.uFall.value=1.2*(P-I)}return{object:v,radius:30,height:42,center:new o.Vector3(0,17,0),ground:!1,groundY:0,anchors:{portalSeat:Q,finalLine:ae,flyThrough:se,viewpoints:{front:new o.Vector3(0,16,62),ice:new o.Vector3(17,3.2,15),reindeer:new o.Vector3(0,13,18),crown:new o.Vector3(12,31,12)},pond:{inner:8.3,outer:23.1,y:0},bank:{radius:36.5},eyeRadius:8,tiers:{skaters:0,platform:10,canopy:17.5,crown:26.5,tip:40},stars:{count:12,radius:4.2,y:23.5,spin:-C/11},dome:{center:c,radius:d},bubble:ve},parts:{platform:B,crown:N,cylinder:z,skaters:F,flakes:X,bubble:U,ice:L},uniforms:i,kit:{prep:S,place:M,lathe:oe,glazedLathe:W,instances:j,wobble:xe,tube:Z,archShape:ke,starGeo:de,goose:()=>ze(k),mat:h,glaze:s,C:g,K:k,GLAZE_FRAG:fe,GLSL_COMMON:ue},setProgress(P){ie=Math.min(1,Math.max(0,P)),Ie()},setSun(P,I){i.uSunDir.value.copy(P).normalize(),I!=null&&i.uSunCol.value.set(I)},setBubbleDir:ye,update(P,I){i.uTime.value=I,B.rotation.y=I*C/16,N.rotation.y=-I*C/11,z.rotation.x=I*C/20,i.uCrown.value=N.rotation.y,ie<0&&(we+=P*.3,ge+=P*1.2*(1-.3),i.uS.value=.3,i.uSwirl.value=we,i.uFall.value=ge),v.updateWorldMatrix(!0,!1),i.uBaseY.value=Te.setFromMatrixPosition(v.matrixWorld).y,i.uInv.value.copy(v.matrixWorld).invert()},dispose(){i.uBrush.value.dispose()}}}export{He as buildHero};
