import*as y from"three";const ft={linen:"#D8CCAE",terracotta:"#A9462B",bluegreen:"#3E6E69",gold:"#C59A3C",olive:"#6F7A3B",blue:"#3C5C84",dark:"#1E2836",sage:"#8E9A73",buff:"#B48F5E"},Vt=["#D8CCAE","#A9462B","#3E6E69","#C59A3C","#6F7A3B","#3C5C84","#1E2836"],lt=new Map;function pt(t){const a=ft[t]||t;return lt.has(a)||lt.set(a,new y.Color(a)),lt.get(a)}const Z=`
uniform float uTime;
uniform vec4 uWave;   // amp m, length m, speed m/s, hung sway m
uniform vec4 uCrest;  // world z of the scripted crest, its height, its half width, gust 0..1
uniform vec2 uPx;     // world size of one pixel at distance 1, least width of a thin mark in pixels
float fsHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float fsNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(fsHash(i), fsHash(i+vec2(1.,0.)), f.x), mix(fsHash(i+vec2(0.,1.)), fsHash(i+vec2(1.,1.)), f.x), f.y); }
// the billow of the floor cloth; everything standing on it adds this to its y
float clothWave(vec2 xz){
  float k = 6.2831853 / max(uWave.y, 1.);
  float a = sin(k*(xz.y - uWave.z*uTime) + 0.7*sin(xz.x*0.011 + 1.3));
  float b = sin(k*2.3*(xz.y*0.82 + xz.x*0.57) - uTime*0.45);
  float d = (xz.y - uCrest.x) / max(uCrest.z, 1.);
  return uWave.x*(0.40*a + 0.10*b) + uCrest.y*exp(-d*d);
}
`,dt=`
// laid and couched work. uv in metres: x along the lay, y across it. Returns a factor round 1 (mean 1).
float woolLaid(vec2 uv){
  float wander = (fsNoise(uv*vec2(0.03, 0.09)) - 0.5);            // the lay wanders
  float v = (uv.y + wander*0.6) / 0.14;
  float aT = 1. - smoothstep(0.20, 0.40, fwidth(v));               // threads go first
  float th = cos(6.2831853*v);
  float ub = uv.x/0.5 + 0.1*fsNoise(uv*vec2(0.9, 0.5)) + wander*0.5; // bars a tenth uneven
  float fb = fwidth(ub);
  float aB = 1. - smoothstep(0.22, 0.44, fb);                       // bars about four times farther
  float d = abs(fract(ub) - 0.5) * 0.5;                              // metres from the bar's middle
  float mpp = max(fb*0.5, 1e-4);
  float bar = clamp((0.04 - d)/mpp + 0.5, 0., 1.) * min(1., 0.08/mpp) * aB;
  float c = 1.022 + 0.07*th*aT;
  return mix(c, 0.86 + 0.10*th*aT, bar);
}
// stem stitch: s metres along the rope, q -1..1 across, hw its half width in metres
float stemRope(float s, float q, float hw){
  float ph = s/max(hw*2.8, 0.05) + q*0.5;
  float a = 1. - smoothstep(0.20, 0.40, fwidth(ph));
  return 1. + 0.09*cos(6.2831853*ph)*a - 0.05*a*smoothstep(0.55, 1., abs(q));
}
// tabby linen. uv in metres (warp along y). Mean 1; flat beyond about 25 m.
float linenWeave(vec2 uv){
  vec2 t = uv/0.08;
  vec2 fw = fwidth(t);
  float a = 1. - smoothstep(0.18, 0.36, max(fw.x, fw.y));
  float over = cos(6.2831853*t.x)*cos(6.2831853*t.y);            // over and under
  float slubW = step(0.90, fsHash(vec2(floor(t.y), 3.))) * (fsNoise(vec2(uv.x*0.4, floor(t.y))) - 0.3);
  float slubP = step(0.93, fsHash(vec2(floor(t.x), 7.))) * (fsNoise(vec2(uv.y*0.3, floor(t.x))) - 0.3);
  float fine = 0.055*over - 0.05*max(slubW, 0.) - 0.04*max(slubP, 0.) + 0.006;
  // coarse unevenness of the web, visible a little farther, then nothing
  vec2 cu = uv*vec2(0.5, 2.2);
  float a2 = 1. - smoothstep(0.10, 0.30, max(fwidth(cu.x), fwidth(cu.y)));
  float coarse = 0.022*(fsNoise(cu) - 0.5);
  // slubs: here and there a thick thread, a third of a metre wide and some metres long, seen much farther off
  vec2 sw = uv.yx*vec2(2.6, 0.16), sp = uv.yx*vec2(0.5, 2.6);
  float aw = 1. - smoothstep(0.22, 0.5, max(fwidth(sw.x), 4.*fwidth(sw.y))), ap = 1. - smoothstep(0.25, 0.55, fwidth(sp.y));
  float kw = step(0.86, fsHash(floor(sw) + 11.)), kp = step(0.90, fsHash(floor(sp) + 23.));
  vec2 fw2 = fract(sw), fp2 = fract(sp);
  float slW = kw*smoothstep(0., 0.3, fw2.x)*smoothstep(1., 0.7, fw2.x)*smoothstep(0., 0.2, fw2.y)*smoothstep(1., 0.8, fw2.y);
  float slP = kp*smoothstep(0., 0.3, fp2.y)*smoothstep(1., 0.7, fp2.y)*smoothstep(0., 0.2, fp2.x)*smoothstep(1., 0.8, fp2.x);
  // the web seen from the flight's height: bundles of eight threads, over and under
  vec2 tb = uv/0.64; vec2 fb2 = fwidth(tb);
  float a3 = 1. - smoothstep(0.16, 0.34, max(fb2.x, fb2.y));
  float broad = 0.03*cos(6.2831853*tb.x)*cos(6.2831853*tb.y)*a3;
  return 1. + fine*a + coarse*a2 + broad - 0.05*slW*aw - 0.008*slP*ap;
}
`,kt=`
attribute vec3 color; attribute vec2 aUv; attribute vec4 aK; attribute vec3 aPivot; attribute vec3 aSwing;
uniform vec3 uHang;   // 1 if hung from a rail, the rail's local y, the drop in metres
uniform float uSide;  // 1 the face, -1 the same work on the back of the cloth
uniform float uLie;   // 1 for work that lies on the floor cloth (water lines)
uniform float uRide;  // 1 rides the floor's billow (standing flats), 0 does not (things in the air)
uniform vec3 uLinen;
varying vec3 vCol; varying vec2 vUv; varying vec3 vK;
${Z}
void main(){
  vec3 p = position; vec2 n = aK.zw; p.z *= uSide;
  if (abs(aPivot.z) > 1e-5) {                       // hinged part: turn in the flat's own plane
    float t = uTime*aSwing.x + aSwing.y, ang;
    if (aSwing.z < 0.5) ang = aPivot.z*sin(t);
    else ang = aPivot.z*(floor(t) + smoothstep(0., 0.3, fract(t)));   // by notches
    float c = cos(ang), s = sin(ang); mat2 R = mat2(c, s, -s, c);
    p.xy = aPivot.xy + R*(p.xy - aPivot.xy); n = R*n;
  }
  mat4 mm = modelMatrix;
  #ifdef USE_INSTANCING
  mm = modelMatrix*instanceMatrix;
  #endif
  vec4 wp = mm*vec4(p, 1.);
  vec3 zW = (mm*vec4(0., 0., 1., 0.)).xyz;
  if (uHang.x > 0.5) {                               // cloth on a rail: still at the rail, a metre at the hem
    float h = clamp((uHang.y - p.y)/max(uHang.z, 1.), 0., 2.);
    float sw = sin(uTime*0.55 + wp.x*0.013) + 0.35*sin(uTime*1.25 + wp.x*0.047 + 1.7);
    wp.xyz += zW*(uWave.w*h*(0.4 + 0.6*h)*sw*0.75);
    wp.y += 0.25*uWave.w*h*sin(uTime*0.8 + wp.x*0.021);
  } else {
    wp.y += clothWave(wp.xz)*uRide;
  }
  float hw = aUv.y;
  vec3 colr = color;
  float dist = length(cameraPosition - wp.xyz);
  float show = smoothstep(135., 185., dist);         // far-only work (the rows of oval heads) is not there near the eye
  if ((aK.x < 0.5 || aK.x > 1.5) && aK.y > 0.5) wp.xyz -= (mm*vec4(aK.zw, 0., 0.)).xyz*(1. - show);
  if (aK.x > 0.5 && aK.x < 1.5) {                    // stem-stitch rope: an outline is never thinner than uPx.y pixels
    float px = 0.5*uPx.y*uPx.x*dist;
    if (uLie > 0.5) {                                // a rope lying on the floor is seen foreshortened: widen a little, then let it go pale
      float need = px*dist/max(abs(cameraPosition.y - wp.y), 1.);
      px = min(need, 0.8);
      colr = mix(uLinen, color, clamp(max(aUv.y, px)/max(need, 1e-4), 0., 1.));
    }
    hw = max(aUv.y, px);
    if (aK.x > 1.2) {                                // inner lines (stays, lands, seams, hubs): they thin with distance and are gone
      float nat = 2.*aUv.y/max(uPx.x*dist, 1e-5);    // before they are half a pixel, leaving flat wool
      hw = max(aUv.y, 0.55*px)*smoothstep(0.38, 0.8, nat);
      if (aK.x > 1.32) hw = max(aUv.y, px)*show*(1. - smoothstep(520., 700., dist));
    }
    wp.xyz += normalize((mm*vec4(n, 0., 0.)).xyz + vec3(0., 1e-6, 0.))*(aK.y*hw);
  }
  vCol = colr; vUv = aUv; vK = vec3(aK.x, aK.y, hw);
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,Pt=`
uniform vec3 uLinen;
varying vec3 vCol; varying vec2 vUv; varying vec3 vK;
${Z}
${dt}
void main(){
  float laid = woolLaid(vUv);
  float rope = stemRope(vUv.x, vK.y, max(vUv.y, 0.02));
  // unfinished work: bare linen pricked with dots of the wool that was to come
  // the holes are pricked in ROWS along the lay, where the threads were to go (down a sail stripe, along a strake): a
  // row every 0.9 m with a hole every 0.45 m, so drawn work is hatched the way its filling would have run
  vec2 pf = fwidth(vUv); float f1 = max(pf.x, pf.y);
  float row = floor(vUv.y/0.9);
  vec2 g = vec2(vUv.x/0.45 + 0.5*mod(row, 2.), vUv.y/0.9);
  float dd = length((fract(g) - 0.5)*vec2(0.45, 0.9));
  float aP = 1. - smoothstep(0.07, 0.16, f1);
  float near_ = 1. - smoothstep(0.12, 0.12 + max(f1, 0.03), dd);
  // (seen from far the holes of a row run together into a pricked line; farther still every third row is read, then a tint)
  float hw1 = max(0.10, 0.55*f1);
  float l1 = (1. - smoothstep(hw1, hw1 + max(f1, 0.03), abs(fract(vUv.y/0.9) - 0.5)*0.9))*0.8;
  float hw3 = max(0.22, 0.6*f1);
  float l3 = (1. - smoothstep(hw3, hw3 + max(f1, 0.03), abs(fract(vUv.y/2.7 + 1./3.) - 0.5)*2.7))*0.85;
  float a1 = 1. - smoothstep(0.2, 0.34, f1), a3 = 1. - smoothstep(0.7, 1.1, f1);
  float far_ = mix(mix(0.2, l3, a3), l1, a1);
  float dot_ = mix(far_, near_, aP);
  float weave = linenWeave(vUv);
  vec3 col = vCol*laid;
  if (vK.x > 1.5) col = mix(uLinen*weave, vCol, dot_);
  else if (vK.x > 0.5) col = vCol*rope;
  gl_FragColor = vec4(col, 1.);
}`,At=`
uniform vec3 uHang; uniform vec2 uMode;   // uMode.x: 0 weave in world xz, 1 in local xy; uMode.y: 1 rides the billow
varying vec2 vUv;
${Z}
void main(){
  vec4 wp = modelMatrix*vec4(position, 1.);
  vUv = uMode.x > 0.5 ? position.xy : wp.xz;
  if (uHang.x > 0.5) {
    vec3 zW = (modelMatrix*vec4(0., 0., 1., 0.)).xyz;
    float h = clamp((uHang.y - position.y)/max(uHang.z, 1.), 0., 2.);
    float sw = sin(uTime*0.55 + wp.x*0.013) + 0.35*sin(uTime*1.25 + wp.x*0.047 + 1.7);
    wp.xyz += zW*(uWave.w*h*(0.4 + 0.6*h)*sw*0.75);
    wp.y += 0.25*uWave.w*h*sin(uTime*0.8 + wp.x*0.021);
  } else if (uMode.y > 0.5) wp.y += clothWave(wp.xz);
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,Wt=`
uniform vec3 uLinen; varying vec2 vUv;
${Z}
${dt}
void main(){ gl_FragColor = vec4(uLinen*linenWeave(vUv), 1.); }`,Tt=`
attribute vec3 color; attribute vec4 aT;   // t along, side -1/1, length m, phase
attribute vec2 aW;                          // half width m, lean of the comb (x per metre of drop)
uniform vec3 uHang; uniform float uPlumb;   // uPlumb: the weather's plumb 0..1 (1 = hangs straight)
uniform float uRide;                        // 1: the root stands on the floor cloth and rides its billow
varying vec3 vCol; varying vec3 vK;
${Z}
void main(){
  float t = aT.x, L = aT.z, ph = aT.w;
  vec3 p = position;
  vec4 wp = modelMatrix*vec4(p, 1.);
  vec3 zW = (modelMatrix*vec4(0., 0., 1., 0.)).xyz, xW = (modelMatrix*vec4(1., 0., 0., 0.)).xyz;
  if (uHang.x > 0.5) {                               // the root rides the hung cloth
    float h = clamp((uHang.y - (p.y + t*L))/max(uHang.z, 1.), 0., 2.);
    float sw = sin(uTime*0.55 + wp.x*0.013) + 0.35*sin(uTime*1.25 + wp.x*0.047 + 1.7);
    wp.xyz += zW*(uWave.w*h*(0.4 + 0.6*h)*sw*0.75);
  }
  wp.y += clothWave((modelMatrix*vec4(p.x, 0., p.z, 1.)).xz)*uRide;
  float loose = 1. - uPlumb, g = uCrest.w;
  float tt = t*t;
  // sway of a free end: slow swing plus a travelling ripple, more toward the tip; the gust streams it to port
  float s1 = sin(uTime*0.9 + ph*6.2831853 + wp.x*0.05), s2 = sin(uTime*2.1 + ph*17. - t*5.0);
  wp.xyz += zW*(L*tt*(0.10*s1 + 0.035*s2)*(0.3 + loose));
  wp.xyz += xW*(L*tt*(0.05*sin(uTime*0.7 + ph*9.) - (0.10 + 0.5*g)*loose) + L*t*aW.y);
  wp.y += L*tt*(0.03 + 0.25*g)*loose;
  // wool is crimped: a free end never hangs ruler-straight, it waves a little all the way down
  float cr = smoothstep(0., 0.2, t)*min(L, 30.)*0.02;
  wp.xyz += xW*(cr*sin(t*(6. + 5.*fract(ph*7.31)) + ph*40.)) + zW*(cr*0.6*sin(t*(5. + 4.*fract(ph*3.77)) + ph*23.));
  vec3 d = wp.xyz - cameraPosition;       // (read only to turn the ribbon's face to the eye and to keep it a mark wide: no free end is placed by the eye)
  float dist = length(cameraPosition - wp.xyz);
  float hw = max(aW.x, 0.5*uPx.y*uPx.x*dist);
  vec3 sd = vec3(d.z, 0., -d.x); float sl = length(sd);      // the ribbon faces the eye
  if (sl > 1e-3) sd /= sl; else sd = xW;
  wp.xyz += sd*(aT.y*hw);
  vCol = color; vK = vec3(t*L, aT.y, aW.x);
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,Ct=`
varying vec3 vCol; varying vec3 vK;
${Z}
${dt}
void main(){ gl_FragColor = vec4(vCol*stemRope(vK.x, vK.y, max(vK.z, 0.02)), 1.); }`,rt={still:[.8,.35,1,0],draught:[2.5,1,.25,.25],gale:[4,2.4,0,.75]};function St(t,a={}){const s=new y.Color(a.palette&&a.palette[0]||ft.linen),c={uTime:{value:0},uWave:{value:new y.Vector4(2.5,240,14,1)},uCrest:{value:new y.Vector4(-420,0,60,0)},uPx:{value:new y.Vector2(.0016,1.6)},uLinen:{value:s},uPlumb:{value:.25}},f=new y.Vector2(1280,720);let d=.25,n=0;const r=(e,i,h,m)=>new y.ShaderMaterial({vertexShader:e,fragmentShader:i,side:y.DoubleSide,fog:!1,toneMapped:!1,uniforms:{...c,uHang:{value:new y.Vector3(m&&m.hung?1:0,m&&m.hung?m.hung[0]:0,m&&m.hung?m.hung[1]:1)},...h}}),u={uniforms:c,wool:e=>r(kt,Pt,{uSide:{value:e&&e.side<0?-1:1},uRide:{value:e&&e.ride===0?0:1},uLie:{value:e&&e.lie?1:0}},e),linen:(e={})=>r(At,Wt,{uMode:{value:new y.Vector2(e.plane==="xy"?1:0,e.ride?1:0)}},e),thread:e=>r(Tt,Ct,{uRide:{value:e&&e.ride?1:0}},e),setWeather(e){const i=rt[e]||rt.draught;c.uWave.value.x=i[0],c.uWave.value.w=i[1],c.uPlumb.value=i[2],d=i[3],c.uCrest.value.w=d},setProgress(e){n=e,c.uCrest.value.x=2600*e-420,c.uCrest.value.y=c.uWave.value.x*.9*Math.min(1,Math.max(0,(e-.2)*8))},setGust(e){c.uCrest.value.w=Math.max(d,e)},update(e,i,h){c.uTime.value=e,h&&h.getDrawingBufferSize&&h.getDrawingBufferSize(f);const m=i&&i.projectionMatrix?i.projectionMatrix.elements[5]:1.7;c.uPx.value.x=2/(Math.max(m,.05)*Math.max(f.y,100))}};return u.setWeather(a.weather||"draught"),u}let gt=1;function Nt(t){gt=t}function T(t,a=5,s=!0){a=Math.max(2,Math.round(a*gt));const c=[],f=t.length,d=s?f:f-1,n=r=>s?t[(r%f+f)%f]:t[Math.min(f-1,Math.max(0,r))];for(let r=0;r<d;r++){const u=n(r-1),e=n(r),i=n(r+1),h=n(r+2);for(let m=0;m<a;m++){const l=m/a,x=l*l,P=x*l;c.push([.5*(2*e[0]+(i[0]-u[0])*l+(2*u[0]-5*e[0]+4*i[0]-h[0])*x+(3*e[0]-u[0]-3*i[0]+h[0])*P),.5*(2*e[1]+(i[1]-u[1])*l+(2*u[1]-5*e[1]+4*i[1]-h[1])*x+(3*e[1]-u[1]-3*i[1]+h[1])*P)])}}return s||c.push(t[f-1].slice()),c}class Ht{constructor(){this.pos=[],this.col=[],this.uv=[],this.k=[],this.piv=[],this.sw=[],this.idx=[],this.tx=0,this.ty=0,this.ts=1,this.td=1,this.h=[0,0,0,0,0,0],this.z=.12,this.nv=0,this.zb=0,this.kind=0,this.cls=0,this.kindFn=null,this.line2=null}_kind(a){return this.kindFn&&typeof a=="string"&&a!=="linen"?this.kindFn(a):this.kind}at(a=0,s=0,c=1,f=1){return this.z=.1,this.tx=a,this.ty=s,this.ts=c,this.td=f<0?-1:1,this}hinge(a=0,s=0,c=0,f=1,d=0,n=0){return this.h=[this.tx+a*this.ts*this.td,this.ty+s*this.ts,c*this.td,f,d,n],this}noHinge(){return this.h=[0,0,0,0,0,0],this}_map(a){return[this.tx+a[0]*this.ts*this.td,this.ty+a[1]*this.ts]}_v(a,s,c,f,d,n,r,u,e,i){this.pos.push(a,s,c+this.zb),this.col.push(f.r,f.g,f.b),this.uv.push(d,n),this.k.push(r,u,e,i);const h=this.h;return this.piv.push(h[0],h[1],h[2]),this.sw.push(h[3],h[4],h[5]),this.nv++}fill(a,s,c=0,f={}){const d=s.isColor?s:pt(s);let n=a.map(v=>this._map(v));const r=f.inset??.3,u=n.length;if(r>0&&u>2){let v=0;for(let L=0;L<u;L++){const b=n[L],V=n[(L+1)%u];v+=b[0]*V[1]-V[0]*b[1]}const B=v>0?1:-1;n=n.map((L,b)=>{const V=n[(b+u-1)%u],E=n[(b+1)%u];let U=E[0]-V[0],D=E[1]-V[1];const O=Math.hypot(U,D)||1;return U/=O,D/=O,[L[0]-D*r*B,L[1]+U*r*B]})}const e=this.td<0?Math.PI-c:c,i=Math.cos(e),h=Math.sin(e),m=f.z??(this.z+=.012),l=this.nv,x=f.kind??this._kind(s),P=n.map(v=>new y.Vector2(v[0],v[1]));let w=0,H=0;if(this.cls===2)for(const v of n)w+=v[0]/n.length,H+=v[1]/n.length;for(const v of n)this._v(v[0],v[1],m,d,v[0]*i+v[1]*h,-v[0]*h+v[1]*i,x,this.cls===2?1:0,this.cls===2?v[0]-w:0,this.cls===2?v[1]-H:0);const C=y.ShapeUtils.triangulateShape(P,[]);for(const v of C)this.idx.push(l+v[0],l+v[1],l+v[2]);return this}rope(a,s,c=.3,f={}){const d=s.isColor?s:pt(s),n=a.map(w=>this._map(w)),r=n.length,u=!!f.closed;if(r<2)return this;const e=f.z??(this.z+=.012),i=c*.5,h=this.cls===2?1.4:this.cls===1?1.25:1;let m=f.s0??0,l=-1,x=-1;const P=u?r+1:r;for(let w=0;w<P;w++){const H=w%r,C=n[H],v=u?n[(H+r-1)%r]:n[Math.max(0,H-1)],B=u?n[(H+1)%r]:n[Math.min(r-1,H+1)];let L=B[0]-v[0],b=B[1]-v[1];const V=Math.hypot(L,b)||1;if(L/=V,b/=V,w>0){const U=n[(w-1)%r];m+=Math.hypot(C[0]-U[0],C[1]-U[1])}const E=this._v(C[0],C[1],e,d,m,i,h,-1,-b,L);this._v(C[0],C[1],e,d,m,i,h,1,-b,L),x>=0&&this.idx.push(x,x+1,E,x+1,E+1,E),x=E,l<0&&(l=E)}return this}shape(a,s,c,f=0,d={}){const n=d.kind??this._kind(s);return this.fill(a,s,f,d.kind===n?d:{...d,kind:n}),n===2&&typeof s=="string"&&s!=="linen"&&(c=this.line2||s),this.rope(a,c,d.width??.3,{closed:!0,z:d.z!==void 0?d.z+.012:void 0})}disc(a,s,c,f,d,n=0,r=20,u={}){const e=[];for(let i=0;i<r;i++){const h=i/r*Math.PI*2;e.push([a+Math.cos(h)*c,s+Math.sin(h)*c])}return d?this.shape(e,f,d,n,u):this.fill(e,f,n,u)}get triangles(){return this.idx.length/3}build(){const a=new y.BufferGeometry;return a.setAttribute("position",new y.Float32BufferAttribute(this.pos,3)),a.setAttribute("color",new y.Float32BufferAttribute(this.col,3)),a.setAttribute("aUv",new y.Float32BufferAttribute(this.uv,2)),a.setAttribute("aK",new y.Float32BufferAttribute(this.k,4)),a.setAttribute("aPivot",new y.Float32BufferAttribute(this.piv,3)),a.setAttribute("aSwing",new y.Float32BufferAttribute(this.sw,3)),a.setIndex(this.nv>65535?new y.Uint32BufferAttribute(this.idx,1):new y.Uint16BufferAttribute(this.idx,1)),a.computeBoundingSphere(),a.boundingSphere&&(a.boundingSphere.radius+=12),a}}const Lt={terracotta:"dark",bluegreen:"dark",gold:"terracotta",olive:"dark",blue:"gold",dark:"terracotta",sage:"bluegreen",buff:"terracotta",linen:"dark"},j=t=>Lt[t]||"dark";function ht(t,a,s){const c=[],f=[],d=t.length;for(let n=0;n<d;n++){const r=t[Math.max(0,n-1)],u=t[Math.min(d-1,n+1)];let e=u[0]-r[0],i=u[1]-r[1];const h=Math.hypot(e,i)||1;e/=h,i/=h;const m=(a+(s-a)*n/(d-1))*.5;c.push([t[n][0]-i*m,t[n][1]+e*m]),f.push([t[n][0]+i*m,t[n][1]-e*m])}return c.concat(f.reverse())}const Bt=[[-1.5,1],[1.5,1],[1.4,-3],[.6,-5.4],[.9,-7],[2.7,-7.3],[2.9,-8.3],[-.5,-8.3],[-1,-6],[-.7,-3.4]];function tt(t,a,s,c,f,d,n,r=1){const u=Bt.map((e,i)=>[a+(e[0]-(i===3||i===8||i===9?n:0))*r,s+e[1]*r]);t.hinge(a,s,.2,2.4,d),t.shape(T(u,3),c,f,Math.PI/2),t.rope([[a+1.5*r,s-7.9*r],[a+2.8*r,s-7.8*r]],f,.2),t.noHinge()}function vt(t,a,s,c,f){t.disc(a,s,c,"linen",f,0,8,{inset:0})}function mt(t,a,s,c,f,d,n=0,r=0){const u=d.a,e=d.b,i=d.line||j(u),h=j(e)===u?"dark":j(e);t.at(a,s,c,f),tt(t,-5.6,8.3,e,h,n+Math.PI,.9),tt(t,7,8.6,e,h,n,0),t.hinge(-9,10.5,.06,1.1,n);const m=T(r===0?[[-9,10.4],[-11.6,10.8],[-12.8,13.4],[-11.6,16.6],[-8.6,17.8],[-5.6,16.8],[-4.6,15]]:[[-9,10.8],[-11.8,11.6],[-13.2,14.5],[-12.4,17.6],[-10.6,18.4]],4,!1);t.shape(ht(m,1.3,.7),u,i,.6,{inset:.2}),r===0&&t.shape(T([[-4.9,15.4],[-3.2,16.6],[-1.6,15.6],[-2.6,14.6],[-1.4,13.4],[-3.4,13],[-4.4,13.9]],3),e,h,.8),t.noHinge();const l=[[-9.2,9.6],[-8,12.6],[-3,11.9],[2,12.1],[5.6,13.6],[7.8,12],[7.2,8.2],[4.4,6.4],[-1,7.2+r*.8],[-5,6.2],[-8.6,6.6]];t.shape(T(l,4),u,i,.04),tt(t,-7.2,8.2,u,i,n,.9),tt(t,5.4,8.6,u,i,n+Math.PI,0),t.hinge(6,12.5,.05,1.2,n+1);const x=r===0?[[5.4,12.2],[4.8,16],[6.4,18.8],[9,19.4],[11.3,18.2],[12.6,16.4],[11.9,15.3],[12.3,14],[10.5,13.4],[8.6,12.6],[7.6,11.2]]:[[5.6,12.2],[5.6,15.6],[7,18.2],[9.2,18.6],[11.4,17.6],[14.4,17],[14.6,16],[12.2,15.6],[14,14.6],[13.4,14],[10.2,14],[8.4,12.4],[7.6,11]];if(r===0&&t.shape(T([[5,19],[3.5,17.6],[4.3,16],[2.9,14.4],[4.1,12.9],[3.3,11.2],[4.9,10.2],[5.3,8.4],[7.1,8.9],[8.9,8.6],[9.3,10.6],[8.3,12.4],[6.6,14.6],[6.3,17.2]],3),e,h,1.3,{inset:.16}),t.shape(T(x,4),u,i,1.1),r===0){for(let P=0;P<4;P++){const w=5.6+P*.5,H=17.4-P*1.5;t.rope(T([[w+1.6,H+.5],[w+.2,H+.3],[w-.5,H-.8],[w+.5,H-1.3]],3,!1),e,.34)}t.shape(T([[6,18.6],[6.3,20.8],[7.9,19.6]],3),e,i,1.4,{inset:.15}),t.rope(T([[11.4,14.8],[12.8,14.6],[13.6,13.6]],3,!1),e==="terracotta"?"gold":"terracotta",.4)}else t.shape(T([[6.6,18],[5.2,17.2],[4.4,14.6],[5.6,14.2],[7.2,16.2]],3),e,h,1.4,{inset:.15}),t.rope([[5.8,12.6],[8,11.6]],e,.6);return vt(t,9.5,17-r*.3,.5,i),t.noHinge().at()}const Ut=(t,a,s,c,f,d,n=0)=>mt(t,a,s,c,f,d,n,1);function yt(t,a,s,c,f,d,n=0){const r=d.a,u=d.b,e=d.line||j(r),i=j(u)===r?"dark":j(u);t.at(a,s,c,f);const h=(l,x,P)=>{t.hinge(l,5.2,.16,2.4,P),t.rope([[l,5.4],[l+.5,2.6],[l+.2,.3]],x,.5),t.rope([[l-1.2,.15],[l+.2,.3],[l+2.2,.15]],x,.34),t.rope([[l+.2,.3],[l+1.7,1]],x,.3),t.noHinge()};h(1.6,u,n+Math.PI),t.shape(T([[-3.5,8.6],[-9,10.2],[-12.2,8.8],[-11.6,7.5],[-8.6,7.7],[-12.4,6],[-11.8,5],[-8,5.7],[-10.6,3.5],[-9.7,2.7],[-4,5.2]],3),u,i,.15);const m=T([[4.2,8.4],[7.6,10.4],[8.7,13.6],[6.9,16.6],[7.3,19.2],[9.2,20.4]],4,!1);t.hinge(5,9,.05,1.3,n),t.shape(ht(m,2.6,1.3),r,e,1.2,{inset:.2}),t.shape(T([[10.4,21.3],[14,20.3],[10.5,19.6]],2),u==="gold"?"terracotta":"gold",e,0,{inset:.12}),t.disc(9.6,20.5,1.5,r,e,.4,10,{inset:.2}),vt(t,9.9,20.8,.42,e),t.noHinge(),t.shape(T([[-4.4,8.2],[0,10.8],[4.6,10.2],[6.2,8],[4,5.4],[0,4.4],[-4.2,5.4]],4),r,e,.1),h(-.4,r,n),t.hinge(3.4,9.2,.14,1.7,n+.6),t.shape(T([[4.6,9.4],[1.5,11.6],[-3.2,10.6],[-7.6,7.2],[-8.4,5.4],[-4.4,6],[1,6.6]],4),u,i,.35);for(let l=0;l<3;l++)t.rope(T([[2.4-l*1.9,9.8-l*.3],[-.6-l*1.9,8.6-l*.4],[-3.4-l*1.4,6.6-l*.2]],3,!1),i,.26);return t.noHinge().at()}function Et(t,a,s,c,f,d,n=0){const r=d.a,u=d.b,e=d.line||j(r),i=j(u)===r?"dark":j(u);t.at(a,s,c,f),tt(t,3.6,6.2,u,i,n+Math.PI,0,.74),t.hinge(-4,7,.07,1,n);const h=T([[-3.6,7.2],[-8,7.8],[-11.2,5.8],[-11.8,2.8],[-9.2,1.3],[-6.9,2.9],[-8.2,4.8],[-10.2,3.9]],4,!1);return t.shape(ht(h,2.6,.7),r,e,.2,{inset:.2}),t.shape(T([[-10.2,3.9],[-9.4,5.2],[-8.4,3.6],[-9.6,2.8]],3),u,i,.5,{inset:.12}),t.noHinge(),t.hinge(1,10.4,.16,1.5,n+.4),t.shape(T([[-1.2,10],[-3.4,17.2],[.8,19.8],[1.9,16.2],[4.4,17.8],[4.6,13.6],[3.6,10.4]],4),u,i,1.5),t.rope([[.6,10.6],[-.6,17.6]],i,.26),t.rope([[2.2,10.8],[2.6,16.4]],i,.26),t.noHinge(),t.shape(T([[-5,7],[-2,10.6],[3,11.2],[6.2,9.2],[5.2,6],[1,4.8],[-3,5]],4),r,e,.1),tt(t,1.6,6,r,e,n,0,.74),t.hinge(5,9,.06,1.2,n),t.shape(ht(T([[4.4,8.8],[7.4,11.2],[7.6,14.4],[8.2,16.8]],4,!1),3,1.9),r,e,1.3,{inset:.2}),t.shape(T([[7.2,16.6],[8.2,19.6],[11,19.8],[14.2,18.8],[13.8,18],[11.4,17.9],[13.5,16.2],[12.9,15.5],[9.4,15.6]],3),r,e,.2),t.shape(T([[8,19.4],[7.2,21.6],[9.2,20.2]],2),u,i,1.4,{inset:.12}),vt(t,9.9,18.4,.45,e),t.noHinge().at()}function _t(t,a,s,c,f,d){t.at(a,s,c/10,1);const n=j(d);t.rope(T([[0,0],[.3,3],[-.2,6.4]],3,!1),f,.4),t.rope(T([[.2,2.6],[1.8,4.2],[2.6,5.6]],3,!1),f,.34),t.rope(T([[.1,3.2],[-1.6,4.4],[-2.6,5.4]],3,!1),f,.34);const r=(u,e,i)=>{const h=Math.cos(i),m=Math.sin(i);t.shape(T([[0,-.2],[1.3,1.2],[.9,2.6],[0,3.7],[-.9,2.6],[-1.3,1.2]],3).map(l=>[u+l[0]*h-l[1]*m,e+l[0]*m+l[1]*h]),d,n,i+Math.PI/2,{inset:.15})};return r(-.2,6.2,0),r(2.6,5.4,-.7),r(-2.6,5.2,.7),t.at()}function Ft(t,a,s,c,f,d,n,r=1.7,u=5.2){t.at();for(let e=0;e<2;e++){const i=a+(e-.5)*u,h=e?n:d,m=[[i-f/2-r/2,s+.5],[i-f/2+r/2,s+.5],[i+f/2+r/2,c-.5],[i+f/2-r/2,c-.5]];t.shape(m,h,j(h),Math.atan2(c-s,f),{inset:.25})}return t}function It(t,a=12){const s=t.length,c=s*(a+1)*2,f=new Float32Array(c*3),d=new Float32Array(c*3),n=new Float32Array(c*4),r=new Float32Array(c*2),u=new(c>65535?Uint32Array:Uint16Array)(s*a*6);let e=0,i=0;for(const m of t){const l=m.wool.isColor?m.wool:pt(m.wool);for(let x=0;x<=a;x++){const P=x/a;for(let w=-1;w<=1;w+=2)f[e*3]=m.x,f[e*3+1]=m.y-P*m.len,f[e*3+2]=m.z??.4,d[e*3]=l.r,d[e*3+1]=l.g,d[e*3+2]=l.b,n[e*4]=P,n[e*4+1]=w,n[e*4+2]=m.len,n[e*4+3]=m.phase??0,r[e*2]=(m.width??.36)*.5*(1-.35*P*P),r[e*2+1]=m.lean??0,e++;if(x<a){const w=e-2;u[i++]=w,u[i++]=w+1,u[i++]=w+2,u[i++]=w+1,u[i++]=w+3,u[i++]=w+2}}}const h=new y.BufferGeometry;return h.setAttribute("position",new y.BufferAttribute(f,3)),h.setAttribute("color",new y.BufferAttribute(d,3)),h.setAttribute("aT",new y.BufferAttribute(n,4)),h.setAttribute("aW",new y.BufferAttribute(r,2)),h.setIndex(new y.BufferAttribute(u,1)),h.computeBoundingSphere(),h.boundingSphere&&(h.boundingSphere.radius+=30),h}function xt(t,a,s,c){const f=1-c.plumb,d=t.phase??0,n=t.lean??0,r=(t.width??.36)*.5,u=t.z??.4,e=c.segs,i=4,h=E=>E-Math.floor(E),m=E=>{const U=Math.max(0,Math.min(1,E/.2));return U*U*(3-2*U)},l=c.hung?Math.min(2,Math.max(0,(c.hung[0]-t.y)/Math.max(c.hung[1],1))):0,x=c.hung?c.sway*l*(.4+.6*l)*1.35*.75:0,P=6+5*h(d*7.31),w=5+4*h(d*3.77),H=Math.min(a,30)*.02;let C=0,v=0,B=0,L=0,b=0,V=0;for(let E=0;E<=e;E++){const U=E/e,D=U*U,O=m(U)*H,et=t.x-a*D*(.1+.5*c.gust)*f+a*U*n+O*Math.sin(U*P+d*40),$=t.y-U*a+a*D*(.03+.25*c.gust)*f,at=u+O*.6*Math.sin(U*w+d*23),q=a*D*.05,ot=a*D*.135*(.3+f)+x,st=r*(1-.35*D)+c.clear;for(let nt=E?1:i;nt<=i;nt++){const _=E?nt/i:1,Q=C+(et-C)*_,X=v+($-v)*_,it=B+(at-B)*_,ct=L+(q-L)*_,ut=b+(ot-b)*_,o=V+(st-V)*_;for(let p=0;p<s.length;p+=3){const z=Math.max(Math.abs(s[p+2]-it)-ut,0);if(z>=o)continue;const A=Math.max(Math.abs(s[p]-Q)-ct,0),g=s[p+1]-X;if(A*A+g*g+z*z<o*o)return!1}}C=et,v=$,B=at,L=q,b=ot,V=st}return!0}function Rt(t,a,s){const d=1-(.03+.25*s.gust)*(1-s.plumb),n=[];let r=0,u=1e9,e=-1e9,i=1e9,h=-1e9;for(let l=0;l<a.length;l+=3)u=Math.min(u,a[l]),e=Math.max(e,a[l]);const m=(l,x)=>{let P=x,w=x-.5;for(;w>0&&!xt(l,w,a,s);)P=w,w-=.5;if(w<=0)return 0;for(let H=0;H<8;H++){const C=(w+P)/2;xt(l,C,a,s)?w=C:P=C}return w};for(const l of t){const x=l.len*(.05+(.1+.5*s.gust)*(1-s.plumb)+Math.abs(l.lean??0))+Math.min(l.len,30)*.02+(l.width??.36)*.5+s.clear;if(l.x<u-x||l.x>e+x)continue;let P=0,w=1e9;for(let H=0;H<a.length;H+=3){const C=Math.abs(a[H+2]-(l.z??.4));C<w&&(w=C,P=a[H+1])}n.push(l,P),!xt(l,l.len,a,s)&&(l.len=m(l,l.len),r++,l.y-l.len*d>P&&(i=Math.min(i,l.x),h=Math.max(h,l.x)))}for(let l=0;l<n.length;l+=2){const x=n[l],P=n[l+1];if(x.x>i&&x.x<h&&x.y>P&&x.y-x.len*d<P){const w=m(x,Math.min(x.len,(x.y-P)/d));w<x.len&&(x.len=w,r++)}}return r}const Mt={terracotta:{petal:"gold",hub:"terracotta",spike:"terracotta",rays:["terracotta","gold"],fringe:["terracotta","gold","terracotta","gold","bluegreen","dark"],lead:["terracotta","bluegreen","gold","olive","blue"]},blue:{petal:"terracotta",hub:"buff",spike:"blue",rays:["terracotta","buff"],fringe:["terracotta","buff","blue","terracotta","bluegreen","dark"],lead:["blue","bluegreen","terracotta","gold","olive"]},green:{petal:"gold",hub:"terracotta",spike:"olive",rays:["olive","gold"],fringe:["olive","gold","sage","terracotta","gold","dark"],lead:["olive","sage","gold","terracotta","bluegreen"]}},bt={lions:[mt,yt],wyverns:[Et,yt],hounds:[Ut,mt]},Kt={x:30,y:91,r:23},wt={y0:70,y1:106,width:520,railY:108,drop:38};async function jt(t,a={}){const s=t.rng,c=Math.min(1,Math.max(.6,a.detail??1));a.palette&&a.palette.length>=7&&(["linen","terracotta","bluegreen","gold","olive","blue","dark"].forEach((p,z)=>{ft[p]=a.palette[z]}),lt.clear());const f=o=>o[Math.floor(s()*9973.13%1*o.length)],d=f(["terracotta","terracotta","blue","green"]),n=f(["lions","lions","wyverns","hounds"]),r=f(["draught","draught","still","gale"]),u=a.lot||d,e=a.cast||n,i=a.weather||r,h=Mt[u]||Mt.terracotta,m=bt[e]||bt.lions,l=a.style||St(t,{palette:a.palette,weather:i});a.style||l.setWeather(i);const x=[wt.railY,wt.drop],P=l.wool({hung:x}),w=l.linen({plane:"xy",hung:x}),H=l.thread({hung:x}),C=new y.Group;C.name="long-haired-star";const v=Kt,B=wt,L=B.width/2;{const o=[],p=[];for(let W=0;W<=5;W++)for(let I=0;I<=104;I++)o.push(-L+I*B.width/104,68+W*40/5,0);for(let W=0;W<5;W++)for(let I=0;I<104;I++){const R=W*105+I,N=R+104+1;p.push(R,R+1,N,R+1,N+1,N)}const g=o.length/3,M=48,k=v.r+9.5;o.push(v.x,v.y,-.03);for(let W=1;W<=3;W++)for(let I=0;I<M;I++){const R=I/M*Math.PI*2,N=k*W/3*(W===3?1+.03*Math.cos(R*16):1);o.push(v.x+Math.cos(R)*N,v.y+Math.sin(R)*N,-.03)}for(let W=0;W<M;W++){const I=(W+1)%M;p.push(g,g+1+W,g+1+I);for(let R=0;R<2;R++){const N=g+1+R*M+W,Y=g+1+R*M+I;p.push(N,N+M,Y,Y,N+M,Y+M)}}const S=new y.BufferGeometry;S.setAttribute("position",new y.Float32BufferAttribute(o,3)),S.setIndex(p),S.computeBoundingSphere();const F=new y.Mesh(S,w);F.name="span-cloth",C.add(F)}await t.yield();const b=new Ht,V=(o,p,z,A=5)=>{const g=[],M=Math.max(1,Math.round(Math.abs(p-o)/A));for(let k=0;k<=M;k++)g.push([o+(p-o)*k/M,z+.12*Math.sin(k*1.7+z)]);return g},E=o=>Math.sqrt(Math.max(0,(v.r+.5)*(v.r+.5)-(o-v.y)*(o-v.y)));for(const o of[B.y0,B.y1]){const p=E(o);b.rope(V(-L,v.x-p+.8,o),"dark",.9,{z:.1}),b.rope(V(v.x+p-.8,L,o),"dark",.9,{z:.1}),b.rope(V(-L,v.x-p-1,o+(o===B.y0?1.5:-1.5)),o===B.y0?"terracotta":"gold",.36,{z:.1}),b.rope(V(v.x+p+1,L,o+(o===B.y0?1.5:-1.5)),o===B.y0?"terracotta":"gold",.36,{z:.1})}const U=["terracotta","bluegreen","gold","olive","blue","buff","sage"],D=[[-L+11,v.x-v.r-152],[v.x+v.r+9,L-11]];let O=s.int(0,6),et=0;for(const[o,p]of D){const z=Math.max(1,Math.round((p-o)/47)),A=(p-o)/z;for(let g=0;g<=z;g++){const M=o+g*A,k=(g%2?-1:1)*9,S=U[O%7],F=U[(O+3)%7];if(O+=s.int(1,2),Ft(b,M,B.y0+1.6,B.y1-1.6,k,S,F,1.8,6.4),_t(b,M+.4,B.y0+8,17,s.chance(.5)?"sage":"buff",U[(O+1)%5]),g===z)break;const W=g%2===0?1:-1,I=Math.floor(g/2)+et,R=h.lead[I%5],N=h.lead[(I+2)%5],Y=m[I%2],K=(A-13)/26*s.range(.94,1);Y(b,M+A/2-W*3.2,B.y0+2.2,Math.min(K,1.42)*.93,W,g%2===0?{a:R,b:N}:{a:N,b:R},s.range(0,6.28))}et+=3,await t.yield()}const $=[],at=[];let q=null,ot=null;const st=o=>{const p=ot;let z=0;for(;z<p.length-2&&p[z+1][0]>o;)z++;const A=p[z],g=p[z+1],M=Math.min(1,Math.max(0,(A[0]-o)/Math.max(.001,A[0]-g[0])));return A[1]+(g[1]-A[1])*M};for(let o=0;o<9;o++){const p=o-4,z=Math.PI-p*.15,A=v.x+Math.cos(z)*(v.r-2.5),g=v.y+Math.sin(z)*(v.r-2.5),M=p*.022-.035-(p===-4?.05:0),k=(p===-4?122:150*(.8+.2*s())-Math.abs(p)*3)-0,S=s.range(0,6.28),F=[],W=Math.round(k/3),I=p===-4?5:6+1.6*(p+4);for(let K=0;K<=W;K++){const G=k*K/W,J=G/k,zt=Math.min(1,G/30);F.push([A-G,g+M*G-I*J*J+zt*(2.3*Math.sin(G*.115+S)+.9*Math.sin(G*.27+S*2.3))])}const R=h.rays[o%2];b.at().rope(F,R,1.4,{z:.13+o*.002}),b.rope(F.slice(1,Math.max(3,W-3-o%3*2)).map(K=>[K[0],K[1]+1.15]),o%2?"dark":"bluegreen",.3,{z:.13});const N=F[W];at.push(N);const Y=Math.round(9*c);for(let K=0;K<Y;K++){const G=F[W-Math.min(W,Math.floor(K/3))],J=Y>1?K/(Y-1):.5;$.push({x:G[0]+K%3*1.3-.4,y:G[1]-.3,z:.45+.02*K,len:25*s.range(.78,1.08),wool:K%4===3?h.rays[(o+1)%2]:R,lean:-.1+(J-.5)*.16,phase:s(),width:.4})}if(p===-4){ot=F,q=[];const K=Math.round(k/4);for(let G=0;G<=K;G++){const J=k*G/K;q.push([A-J,g+M*J+1.1*Math.sin(J*.045+S)*Math.min(1,J/30)])}}}{const o=1.15/c;let p=4,z=0;for(let g=1;g<q.length;g++){const M=q[g-1],k=q[g],S=Math.hypot(k[0]-M[0],k[1]-M[1]);for(;p<S;){const F=p/S;$.push({x:M[0]+(k[0]-M[0])*F,y:st(M[0]+(k[0]-M[0])*F)-.4,z:.4+.05*(z%3),len:25*s.range(.82,1.06)*(.9+.1*Math.sin(z*.37)),wool:h.fringe[(z+(s.chance(.2)?1:0))%h.fringe.length],lean:s.range(-.02,.01),phase:s(),width:s.range(.32,.46)}),p+=o*s.range(.85,1.15),z++}p-=S}const A=["buff","sage",h.rays[1],"bluegreen"];for(let g=2;g<q.length-1;g++){if(c<.8&&g%2)continue;const M=q[g],k=q[g+1];for(let S=0;S<2;S++){const F=s();$.push({x:M[0]+(k[0]-M[0])*F,y:st(M[0]+(k[0]-M[0])*F)-.4,z:.95+.25*S,len:s.range(13,21),wool:A[(g+S)%4],lean:s.range(-.03,.02),phase:s(),width:.22})}}}await t.yield(),a.eye&&Rt($,a.eye,{sway:rt[i][1],plumb:rt[i][2],gust:rt[i][3],hung:x,segs:16,clear:2.02}),await t.yield();const nt=s.range(0,1);b.at(v.x,v.y,1,1);const _=(o,p)=>[Math.cos(p)*o,Math.sin(p)*o];for(let o=0;o<16;o++){const p=(Math.floor(o/2)+(o%2?.75:.25))*Math.PI/4;if(Math.cos(p)<-.72)continue;const z=h.rays[o%2],A=[];for(let k=0;k<=5;k++){const S=21+k*1.7;A.push(_(S,p+.012*Math.sin(k*1.9+o)))}b.rope(A,z,.5,{z:.15});const g=_(30.4,p),M=[];for(let k=0;k<9;k++)M.push([g[0]+Math.cos(k/9*6.2832)*1.05,g[1]+Math.sin(k/9*6.2832)*1.05]);b.fill(M,h.rays[(o+1)%2],p,{z:.15,inset:.1}),b.rope(M,j(h.rays[(o+1)%2]),.3,{closed:!0,z:.162})}b.hinge(0,0,Math.PI/8,.4,nt,1);for(let o=0;o<8;o++){const p=(o+.5)*Math.PI/4;b.shape([_(11,p-.17),_(20,p-.085),_(26.5,p),_(20,p+.085),_(11,p+.17)],h.spike,j(h.spike)===h.petal?"bluegreen":j(h.spike),p,{z:.16,inset:.25})}for(let o=0;o<8;o++){const p=o*Math.PI/4,z=1+.02*Math.sin(o*2.3),A=[],g=[];for(let M=0;M<=9;M++){const k=M/9,S=5.5+19*z*k,F=4.9*Math.pow(Math.sin(Math.PI*Math.pow(k,.62)),.8);A.push(_(S,p-F/S)),M>0&&M<9&&g.unshift(_(S,p+F/S))}A.push(...g),b.fill(A,h.petal,p,{z:.2,inset:.45}),b.rope(A,"dark",.55,{closed:!0,z:.215}),b.rope([_(9,p),_(20.4,p)],h.hub===h.petal?"dark":h.hub,.34,{z:.215})}const Q=(o,p)=>{const z=[];for(let A=0;A<p;A++)z.push(_(o,A/p*Math.PI*2));return z};b.fill(Q(7.6,28),h.hub,0,{z:.26,inset:.3}),b.rope(Q(7.6,28),"dark",.6,{closed:!0,z:.275}),b.rope(Q(5,22),h.petal,.5,{closed:!0,z:.275});for(let o=0;o<8;o++)b.rope([_(5.3,o*Math.PI/4+.39),_(7.3,o*Math.PI/4+.39)],h.petal,.3,{z:.275});b.fill(Q(2.5,14),"linen",0,{z:.29,inset:0,kind:2}),b.rope(Q(2.5,14),"dark",.45,{closed:!0,z:.3}),b.noHinge().at(),await t.yield();const X=new y.Mesh(b.build(),P);if(X.name="span-work",C.add(X),a.back!==!1){const o=new y.Mesh(X.geometry,l.wool({hung:x,side:-1}));o.name="span-work-back",o.frustumCulled=!1,C.add(o)}await t.yield();const it=new y.Mesh(It($,16),H);it.name="star-fringe",C.add(it);for(const o of[X,it])o.frustumCulled=!1;const ct=new y.Vector3(0,62,0),ut={head:{x:v.x,y:v.y,r:v.r,position:new y.Vector3(v.x,v.y,0)},band:{...B},fringeGate:ct,flyThrough:[[0,16,330],[0,22,210],[0,44,100],[0,58,32],[0,62,0],[0,58,-36],[0,34,-110]].map(o=>new y.Vector3(...o)),viewpoints:{front:new y.Vector3(-30,50,230),close:new y.Vector3(6,66,34),back:new y.Vector3(-20,80,-160)},portalSeat:{position:new y.Vector3(0,0,-40),facing:new y.Vector3(0,0,1)},rayEnds:at.map(o=>new y.Vector3(o[0],o[1],0)),lot:u,cast:e,weather:i};return{object:C,radius:110,height:116,center:new y.Vector3(-28,84,0),anchors:ut,style:l,triangles:b.triangles+$.length*32+1400,setProgress(o){l.setProgress(o)},setWeather(o){l.setWeather(o)},update(o,p,z){a.style||l.update(p,z,t.renderer)},dispose(){},ground:!1,groundY:0}}export{wt as BAND,Vt as DEFAULT_PALETTE,Ht as FlatBuilder,Kt as HEAD,dt as STYLE_FRAG_GLSL,Z as STYLE_GLSL,ft as WOOLS,ht as band,yt as beastBird,Ut as beastHound,mt as beastLion,Et as beastWyvern,jt as buildHero,j as lineFor,It as makeFringe,St as makeStyle,Nt as setSmooth,Ft as slantBars,T as smoothLoop,_t as sprig,Rt as trimToRoute,pt as woolColor};
