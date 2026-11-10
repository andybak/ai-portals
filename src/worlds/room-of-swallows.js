import*as n from"three";import{makePath as Wt,smoothstep as K,clamp as s0,lerp as o0}from"../kit/core.js";import{buildHero as jt,buildFlyThrough as Nt}from"../parts/room-of-swallows.js";const Et=["#EFE8DA","#FFFBF0","#A63A24","#D9A441","#3A6EA5","#1E1B1A","#A9C9DF"],T=50,i0=42.5,m0=75,r0=15,L={z0:-9.5,z1:8.5,y0:28,y1:52},j={z0:21.5,z1:37.5,y1:50},B0={z0:-37,z1:-22,y0:20,y1:42,d:6},f0={x:-8,z:3.5,w:40,d:18,h:8},X0={x:16,z:-15.5},_0={x:24,z:9.5},t0=Math.PI*2,l0=.55,lt=["spring","noon","unfinished"],x0=[T+11.3,3,L.z1-2.1],dt=47,R=(o,t,e)=>o.clone().lerp(t,e);function ct(){const o=[],t=[],e=[],z=[],c=[];let u=0;const y=new n.Matrix4,s=new n.Matrix3,h=new n.Vector3,v=new n.Euler,b=new n.Quaternion,m=new n.Vector3;return{get count(){return c.length/3},add(p,i={}){const d=p.attributes.position,a=p.attributes.normal,l=p.attributes.uv,r=p.attributes.color;v.set(...i.r||[0,0,0]),b.setFromEuler(v);const w=i.s??1;typeof w=="number"?m.set(w,w,w):m.set(w[0],w[1],w[2]),y.compose(h.set(...i.p||[0,0,0]),b,m),s.getNormalMatrix(y);const f=i.c,P=i.kind||0,k=i.sway||0,A=i.uv&&!i.uv.call?i.uv[0]:1,D=i.uv&&!i.uv.call?i.uv[1]:1;for(let g=0;g<d.count;g++){h.fromBufferAttribute(d,g).applyMatrix4(y);const x=h.x,S=h.y,M=h.z;o.push(x,S,M),h.fromBufferAttribute(a,g).applyMatrix3(s).normalize(),t.push(h.x,h.y,h.z),r?e.push(r.getX(g),r.getY(g),r.getZ(g)):e.push(f.r,f.g,f.b);let V=l?l.getX(g):0,G=l?l.getY(g):0;if(i.uv&&i.uv.call){const H=i.uv(x,S,M,V,G);V=H[0],G=H[1]}else V*=A,G*=D;z.push(V,G,P,typeof k=="function"?k(x,S,M):k)}if(p.index){const g=p.index;for(let x=0;x<g.count;x++)c.push(u+g.getX(x))}else for(let g=0;g<d.count;g++)c.push(u+g);u+=d.count,p.dispose()},build(){const p=new n.BufferGeometry;return p.setAttribute("position",new n.Float32BufferAttribute(o,3)),p.setAttribute("normal",new n.Float32BufferAttribute(t,3)),p.setAttribute("aC",new n.Float32BufferAttribute(e,3)),p.setAttribute("aQ",new n.Float32BufferAttribute(z,4)),p.setIndex(u>65535?new n.Uint32BufferAttribute(c,1):new n.Uint16BufferAttribute(c,1)),p.computeBoundingSphere(),p}}}function N(o,t,e,z=.3){const c=new n.BoxGeometry(o,t,e,3,3,3),u=c.attributes.position,y=c.attributes.normal,s=c.attributes.uv,h=[o/2,t/2,e/2],v=[o/2-z,t/2-z,e/2-z],b=[0,0,0],m=[0,0,0],p=[0,0,0];for(let i=0;i<u.count;i++){b[0]=u.getX(i),b[1]=u.getY(i),b[2]=u.getZ(i);const d=Math.abs(y.getX(i)),a=Math.abs(y.getY(i));for(let r=0;r<3;r++){const w=Math.sign(b[r])*(Math.abs(b[r])>h[r]*.99?h[r]:v[r]);m[r]=s0(w,-v[r],v[r]),p[r]=w-m[r]}const l=Math.hypot(p[0],p[1],p[2])||1;p[0]/=l,p[1]/=l,p[2]/=l,u.setXYZ(i,m[0]+p[0]*z,m[1]+p[1]*z,m[2]+p[2]*z),y.setXYZ(i,p[0],p[1],p[2]),d>.5?s.setXY(i,u.getZ(i),u.getY(i)):a>.5?s.setXY(i,u.getX(i),u.getZ(i)):s.setXY(i,u.getX(i),u.getY(i))}return c}function X(o,t,e){const z=[],c=[],u=[],y=[],s=[],h=o.length,v=[];for(let i=0;i<h;i++){const d=o[Math.max(0,i-1)],a=o[Math.min(h-1,i+1)];let l=a[0]-d[0],r=a[1]-d[1];const w=Math.hypot(l,r)||1;v.push([r/w,-l/w])}let b=0,m=0;for(let i=0;i<h-1;i++){const d=o[i],a=o[i+1],l=d[2]||e,r=Math.hypot(a[0]-d[0],a[1]-d[1]);for(let w=0;w<2;w++){const f=w?a:d,P=v[i+w],k=b+w*r;for(let A=0;A<=t;A++){const D=A/t*t0,g=Math.cos(D),x=Math.sin(D);z.push(f[0]*g,f[1],f[0]*x),c.push(P[0]*g,P[1],P[0]*x),u.push(l.r,l.g,l.b),y.push(A/t*t0*Math.max(d[0],a[0],.2),k)}}for(let w=0;w<t;w++){const f=m+w,P=m+w+1,k=m+t+1+w,A=k+1;s.push(f,k,P,P,k,A)}m+=2*(t+1),b+=r}const p=new n.BufferGeometry;return p.setAttribute("position",new n.Float32BufferAttribute(z,3)),p.setAttribute("normal",new n.Float32BufferAttribute(c,3)),p.setAttribute("color",new n.Float32BufferAttribute(u,3)),p.setAttribute("uv",new n.Float32BufferAttribute(y,2)),p.setIndex(s),p}function $t(o,t,e,z,c,u,y,s){const h=new n.BufferGeometry,v=new n.Vector3().subVectors(new n.Vector3(...t),new n.Vector3(...o)).cross(new n.Vector3().subVectors(new n.Vector3(...z),new n.Vector3(...o))).normalize();return h.setAttribute("position",new n.Float32BufferAttribute([...o,...t,...e,...z],3)),h.setAttribute("normal",new n.Float32BufferAttribute([v.x,v.y,v.z,v.x,v.y,v.z,v.x,v.y,v.z,v.x,v.y,v.z],3)),h.setAttribute("uv",new n.Float32BufferAttribute([...c||[0,0],...u||[1,0],...y||[1,1],...s||[0,1]],2)),h.setIndex([0,1,2,0,2,3]),h}function Bt(o,t){const e=c=>(Math.round(c*1e3)/1e3).toFixed(3);let z="";for(const c of o)z+=`  sh = max(sh, slabSh(p, s, py, vec4(${c.slice(0,4).map(e).join(", ")}), vec2(${e(c[4])}, ${e(c[5])})));
`;for(const c of t)z+=`  sh = max(sh, taperSh(p, s, py, vec2(${e(c[0])}, ${e(c[1])}), vec2(${e(c[2])}, ${e(c[3])}), vec2(${e(c[4])}, ${e(c[5])})));
`;return`
float slabSh(vec3 p, vec2 s, float py, vec4 b, vec2 yy){
  float h0 = max(yy.x, py) - p.y, h1 = yy.y - p.y;
  vec2 lo = (b.xz - p.xz) / s, hi = (b.yw - p.xz) / s;
  vec2 t0 = min(lo, hi), t1 = max(lo, hi);
  float ov = min(min(t1.x, t1.y), h1) - max(max(t0.x, t0.y), h0);
  return clamp(ov / max(fwidth(ov), 1e-4) + 0.5, 0.0, 1.0);
}
float taperSh(vec3 p, vec2 s, float py, vec2 c, vec2 yy, vec2 rr){
  float h0 = max(yy.x, py) - p.y, h1 = yy.y - p.y;
  float ok = step(0.01, h1 - h0);
  float dh = max(h1 - h0, 0.01);
  vec2 a = p.xz + s * h0 - c, d = s * dh;
  float t = clamp(-dot(a, d) / max(dot(d, d), 1e-4), 0.0, 1.0);
  float r = mix(rr.x, rr.y, clamp((h0 + t * dh + p.y - yy.x) / max(yy.y - yy.x, 0.01), 0.0, 1.0));
  float dist = length(a + d * t) - r;
  return ok * clamp(0.5 - dist / max(fwidth(dist), 1e-4), 0.0, 1.0);
}
float castShadow(vec3 p, vec3 L){
  vec2 s = L.xz / max(L.y, 0.08);
  s = vec2(s.x >= 0.0 ? max(s.x, 0.02) : min(s.x, -0.02), s.y >= 0.0 ? max(s.y, 0.02) : min(s.y, -0.02));
  float py = p.y + 0.4;
  float sh = 0.0;
${z}  return sh;
}
`}const ut=`
attribute vec3 aC; attribute vec4 aQ;
varying vec3 vC, vN, vP; varying vec4 vQ;
`;function Xt(o,t){return`
uniform float uTime;
uniform vec3 uKey, uPlaster, uPlasterSun, uJoint, uSlateA, uSlateB, uSlateC, uSlateD, uRed, uBlue, uInk, uStone, uReedA, uReedB, uReedC;
varying vec3 vC, vN, vP; varying vec4 vQ;
${o.sun}
${o.hash}
${o.crack}
${t}
float hair(float c, float w){ return 1.0 - smoothstep(w * 0.5, w, abs(c) / max(fwidth(c), 1e-5)); }
float is(float k, float v){ return step(abs(k - v), 0.25); }
float bandF(float s, float a, float b, float e){ return smoothstep(a - e, a + e, s) * (1.0 - smoothstep(b - e, b + e, s)); }
void main(){
  float kind = floor(vQ.z + 0.5);
  float kF = is(kind, 0.0), kC = is(kind, 1.0), kP = is(kind, 2.0), kS = is(kind, 3.0);
  vec2 q = mix(vQ.xy, vP.xz, kF + kC);
  float px = clamp(max(length(dFdx(q)), length(dFdy(q))), 1e-4, 6.0);
  vec3 N = normalize(vN);
  float sun = sunAt(vP);

  // ---- cells: slate flags on the floor, dressed blocks in the reveal
  float H = mix(11.0, 4.0, kS);
  float row = floor(q.y / H), fy = q.y - row * H;
  float hr = hash21(vec2(row, 3.7));
  float W = mix(13.0 + 6.0 * hr, 6.5 + 4.0 * hr, kS);
  float xx = q.x + 60.0 * hash21(vec2(row, 9.1));
  float ci = floor(xx / W), fx = xx - ci * W;
  float split = step(0.6, hash21(vec2(ci, row))) * kF;
  float hf = step(H * 0.5, fy) * split;
  float dy = min(fy, H - fy);
  dy = mix(dy, min(dy, abs(fy - H * 0.5)), split);
  float jd = min(min(fx, W - fx), dy);
  float fh = hash21(vec2(ci + 0.37 * hf, row) + 0.5);

  // ---- hairline marks: straight cleavage across each slate flag (its own direction), tooling on stone
  float ca = cos(fh * 6.2832), sa = sin(fh * 6.2832);
  vec2 qr = mix(q, vec2(ca * q.x - sa * q.y, sa * q.x + ca * q.y), kF);
  vec2 isc = kF * vec2(0.035, 0.55) + kP * vec2(0.075, 0.095) + kS * vec2(0.3, 0.8) + kC * vec2(0.03, 0.03);
  vec2 iq = qr * isc + (kF + kS) * fh * 57.0 + 7.3;
  float n1 = vnoise(iq) + 0.5 * vnoise(iq * 2.3 + 5.0);
  float lineMany = hair(sin(n1 * 9.0), 1.3) * (1.0 - smoothstep(0.12, 0.4, px));
  // plaster cracks: a few angular, forking hairlines (the same field as the painted walls)
  float crack = crackLines(q + vec2(131.0, 57.0), px) * kP;

  // ---- floor
  vec3 slate = fh < 0.3 ? uSlateA : (fh < 0.56 ? uSlateB : (fh < 0.82 ? uSlateC : uSlateD));
  vec3 fl = slate * (1.0 - 0.13 * lineMany * smoothstep(0.3, 0.55, vnoise(q * 0.17 + 3.0)));
  float jw = 0.2, jwe = max(jw, 0.75 * px);
  float joint = (1.0 - smoothstep(jwe - 0.7 * px, jwe + 0.7 * px, jd)) * min(1.0, jw / jwe + 0.3);
  fl = mix(fl, uJoint, joint);
  // the painted border: round the whole room, in lime plaster laid over the flags, a band of red ochre carrying a
  // running spiral between black lines, then a plaster band and a blue line; a rosette in each corner
  {
    float dWx = 50.0 - abs(q.x), dWz = 42.5 - abs(q.y);
    float dB = min(dWx, dWz);
    float inRoom = step(0.0, dWx);
    float al = dWx < dWz ? q.y : q.x;
    float e2 = max(px, 0.02);
    float band = bandF(dB, 1.9, 8.9, e2), blk = bandF(dB, 1.3, 1.9, e2) + bandF(dB, 8.9, 9.5, e2);
    float pla = bandF(dB, -0.5, 1.3, e2) + bandF(dB, 9.5, 10.7, e2), blu = bandF(dB, 10.7, 11.3, e2);
    vec3 bc = uRed;
    // running spiral: two-armed spirals 8 m apart, each joined to the next by their common tangent
    float P = 8.0, R = 2.55, pt = 1.0, lw = 0.24;
    float cx = (fract(al / P + 0.5) - 0.5) * P, Y = dB - 5.4;
    vec2 v = vec2(cx, Y); v.x += step(dot(v, v), 1e-6) * 1e-3;
    float r = length(v), th = atan(v.y, v.x);
    float gA = fract(r / pt + th / 3.14159265 - (R / pt + 0.28));
    float arm = (1.0 - smoothstep(lw - e2, lw + e2, min(gA, 1.0 - gA) * pt)) * (1.0 - smoothstep(R + lw - e2, R + lw + e2, r));
    float d1 = 0.6375 * (cx - 0.5 * P) + 0.7705 * Y, d2 = 0.6375 * (cx + 0.5 * P) + 0.7705 * Y;
    float link = max((1.0 - smoothstep(lw - e2, lw + e2, abs(d1))) * step(1.62, cx), (1.0 - smoothstep(lw - e2, lw + e2, abs(d2))) * step(cx, -1.62));
    float eye = 1.0 - smoothstep(0.55 - e2, 0.55 + e2, r);
    bc = mix(bc, uPlaster, mix(0.26 * step(abs(Y), R + lw), max(arm, link), 1.0 - smoothstep(0.3, 1.0, px)));
    bc = mix(bc, uBlue, eye);
    // corner panels
    vec2 cq = vec2(dWx, dWz) - 5.4;
    float corner = step(max(dWx, dWz), 8.9) * step(1.9, dB);
    cq.x += step(dot(cq, cq), 1e-6) * 1e-3;
    float cr = length(cq), ca2 = atan(cq.y, cq.x);
    float petal = 1.0 - smoothstep(-e2, e2, cr - 3.0 * (0.5 + 0.5 * abs(cos(4.0 * ca2))));
    vec3 cc = mix(uPlaster, uRed, petal);
    cc = mix(cc, uInk, (1.0 - smoothstep(0.16 - e2, 0.16 + e2, abs(cr - 3.25))) );
    cc = mix(cc, uBlue, 1.0 - smoothstep(0.8 - e2, 0.8 + e2, cr));
    bc = mix(bc, cc, corner);
    vec3 paint = bc * band + uInk * min(blk, 1.0) + uPlaster * 0.97 * min(pla, 1.0) + uBlue * blu;
    float cover = min(band + blk + pla + blu, 1.0) * inRoom;
    // worn: the paint has gone from the flag joints and in a few scuffed patches
    float wear = smoothstep(0.62, 0.8, vnoise(q * 0.21 + 17.0)) * 0.55 + 0.45 * joint;
    fl = mix(fl, paint, cover * (1.0 - wear * (1.0 - smoothstep(0.3, 1.2, px))));
  }
  // swept dust: drifts along the wall foot, round the bed posts and the big vessel, broom arcs between them,
  // and almost none on the open flags
  float dW = min(50.0 - abs(q.x), 42.5 - abs(q.y)) + 2.6 * (vnoise(q * 0.13 + 3.0) - 0.5) + 0.7 * (vnoise(q * 0.8) - 0.5);
  float drift = 1.0 - smoothstep(0.5, 4.4, dW);
  float dL = length(abs(q - vec2(${f0.x.toFixed(1)}, ${f0.z.toFixed(1)})) - vec2(${(f0.w/2-1.6).toFixed(1)}, ${(f0.d/2-1.6).toFixed(1)})) + 1.3 * (vnoise(q * 0.5 + 9.0) - 0.5);
  drift = max(drift, 1.0 - smoothstep(2.0, 4.6, dL));
  float dJ = length(q - vec2(${_0.x.toFixed(1)}, ${_0.z.toFixed(1)})) + 1.3 * (vnoise(q * 0.5 + 4.0) - 0.5);
  drift = max(drift, 1.0 - smoothstep(3.6, 6.4, dJ));
  float arcs = smoothstep(0.52, 0.7, vnoise(q * 0.05 + 3.0)) * smoothstep(0.5, 0.62, sin(length(q - vec2(-70.0, 90.0)) * 0.9));
  drift = max(drift, 0.42 * arcs);
  vec2 dq = q / 0.36; vec2 di = floor(dq); float dh = hash21(di);
  vec2 dc = di + 0.5 + 0.6 * (vec2(hash21(di + 3.1), hash21(di + 7.7)) - 0.5);
  float dr = 0.02 + 0.04 * hash21(di + 1.7);
  float dre = max(dr, 0.8 * px);
  float speck = (1.0 - smoothstep(dre - 0.6 * px, dre + 0.6 * px, length(dq - dc) * 0.36)) * min(1.0, (dr * dr) / (dre * dre));
  float dust = speck * step(dh, 0.012 + 0.9 * drift * sqrt(drift));
  fl = mix(fl, uPlaster, dust * 0.9);
  // the thickest of it lies as one flat pale strip against the wall, and far off the drifts read as a paler tone
  float heap = 1.0 - smoothstep(0.8 - px, 0.8 + px, dW);
  fl = mix(fl, uPlaster * 0.9, max(0.5 * heap, 0.3 * drift * drift * smoothstep(0.04, 0.2, px)));
  float sh = castShadow(vP, uKey) * kF;
  fl = mix(fl, fl * vec3(0.43, 0.45, 0.52), sh);
  fl = mix(fl, mix(fl, uPlasterSun, 0.32), sun * (1.0 - sh));

  // ---- ceiling: reed matting in the shade
  // (the mats lie in panels between the joists; the reeds of every other panel run the other way, so that from the floor
  // the ceiling is a chequer of two straw tones crossed by dark lashings, never one flat field)
  float pj = floor((q.x + 49.965) / 8.33), pk = floor((q.y + 42.5) / 10.625);
  float alt = mod(pj + pk, 2.0);
  vec2 rq = mix(q, q.yx, alt);
  float ri = floor(rq.y / 0.5);
  float rh = hash21(vec2(ri, 1.3 + pj * 7.0 + pk * 3.0));
  vec3 reed = rh < 0.45 ? uReedA : (rh < 0.85 ? uReedB : uReedC);
  float bd = abs(fract(rq.x / 6.25 + 0.5) - 0.5) * 6.25;
  float bind = 1.0 - smoothstep(0.12 - px, 0.12 + px, bd);
  reed = mix(reed, uReedC * 0.8, bind);
  vec3 ce = mix(reed, (uReedA + uReedB) * 0.5, smoothstep(0.12, 0.4, px)) * mix(1.0, 0.8, alt);
  float lz = abs(fract((q.y + 42.5) / 10.625 + 0.5) - 0.5) * 10.625;
  float lash = 1.0 - smoothstep(0.32 - px, 0.32 + px, lz);
  float lz2 = abs(lz - 0.95);
  lash = max(lash, 0.7 * (1.0 - smoothstep(0.1 - px, 0.1 + px, lz2)) * (1.0 - smoothstep(0.3, 0.9, px)));
  ce = mix(ce, uReedC * 0.62, lash);
  ce = mix(ce, uRed * 0.9, lash * step(0.5, mod(pk, 2.0)) * (1.0 - smoothstep(0.1 - px, 0.1 + px, abs(lz - 0.0))));

  // ---- plain plaster: hairline cracks, a day-join, the one red band
  vec3 pl = uPlaster * (1.0 - 0.17 * crack);
  float jn = vP.y - (38.6 + 2.4 * (vnoise(vec2(vP.z * 0.05, 3.0)) - 0.5));
  pl *= 1.0 - 0.07 * (1.0 - smoothstep(0.0, 1.6 * px, abs(jn))) * step(0.99, vQ.w);
  float e = px * 0.8;
  float band = smoothstep(69.6 - e, 69.6 + e, vP.y) * (1.0 - smoothstep(71.6 - e, 71.6 + e, vP.y)) * step(0.99, vQ.w);
  pl = mix(pl, uRed, band);
  pl *= min(vQ.w, 1.0);

  // ---- dressed stone: flat tone per block, dark joints, a few tooling marks, lit side and shade side
  vec2 pq = q / 1.3; vec2 pc = floor(pq); vec2 pf = fract(pq) - 0.5;
  vec2 pr = vec2(pf.x + pf.y, pf.x - pf.y) * 0.7071 + (vec2(hash21(pc + 2.0), hash21(pc + 5.0)) - 0.5) * 0.3;
  float peck = (1.0 - smoothstep(0.2, 0.25, abs(pr.x))) * (1.0 - smoothstep(0.03, 0.03 + px, abs(pr.y))) * step(0.55, hash21(pc + 17.0)) * (1.0 - smoothstep(0.08, 0.25, px));
  vec3 st = uStone * (0.89 + 0.05 * floor(fh * 4.0)) * (1.0 - 0.1 * peck);
  st = mix(st, st * vec3(1.02, 0.97, 0.8), 0.6 * smoothstep(0.66, 0.7, vnoise(q * 0.42 + 40.0)) * step(0.4, vnoise(q * 3.1)));
  float sw = 0.1, swe = max(sw, 0.75 * px);
  float sj = (1.0 - smoothstep(swe - 0.7 * px, swe + 0.7 * px, jd)) * min(1.0, sw / swe + 0.25);
  st = mix(st, uStone * 0.6, sj);
  float ndl = dot(N, uSunDir) - 0.02;
  float lit = clamp(ndl / max(fwidth(ndl), 1e-4) + 0.5, 0.0, 1.0);
  st *= mix(${l0.toFixed(2)}, 1.0, lit) * min(vQ.w, 1.0);

  vec3 col = fl * kF + ce * ${l0.toFixed(2)} * kC + pl * kP + st * kS;
  gl_FragColor = vec4(col, 1.0);
}
`}const _t=`${ut}
void main(){
  vC = aC; vQ = aQ; vP = position; vN = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;function Qt(o){return`${ut}
uniform float uTime, uShake;
${o.gust}
void main(){
  vC = aC; vQ = aQ;
  vec3 p = position;
  float sw = aQ.w;
  vec2 g = gustAt(-30.0 - 0.4 * p.x);
  float a = sw * (0.35 * g.x + 0.05 * sin(uTime * 1.7 + p.x * 0.4 + p.z * 0.3) + 0.25 * uShake * sin(uTime * 23.0 + p.x));
  // a lamp flame (kind 8) never stands still
  float fk = step(7.5, aQ.z) * step(aQ.z, 8.5);
  a += fk * sw * (0.2 * sin(uTime * 9.0 + p.x * 2.0) + 0.12 * sin(uTime * 15.7 + p.z * 3.0));
  p += vec3(0.5 * a, 0.9 * a * sin(p.x * 0.6 + uTime * 2.2), 0.8 * a);
  vP = p; vN = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`}function Yt(o,t){return`
uniform float uTime;
uniform vec3 uKey, uKey2, uPlaster, uPlasterSun, uRed, uBlue, uFlame;
varying vec3 vC, vN, vP; varying vec4 vQ;
${o.sun}
${o.hash}
${t}
float hair(float c, float w){ return 1.0 - smoothstep(w * 0.5, w, abs(c) / max(fwidth(c), 1e-5)); }
float is(float k, float v){ return step(abs(k - v), 0.25); }
float bandIn(float s, float a, float b, float e){ return smoothstep(a - e, a + e, s) * (1.0 - smoothstep(b - e, b + e, s)); }
void main(){
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  float kind = floor(vQ.z + 0.5);
  float alt = step(15.5, kind); kind -= 16.0 * alt;
  vec3 L = normalize(mix(uKey, uKey2, alt));
  float ndl = dot(N, L) - 0.05;
  float lit = clamp(ndl / max(fwidth(ndl), 1e-4) + 0.5, 0.0, 1.0);
  float sh = castShadow(vP, uKey) * (1.0 - alt) * step(vP.y, 30.0);
  lit = min(lit, 1.0 - sh);
  float kWood = is(kind, 1.0), kClay = is(kind, 2.0), kWeave = is(kind, 3.0), kStone = is(kind, 4.0), kCloth = is(kind, 5.0), kHide = is(kind, 6.0), kReed = is(kind, 7.0);
  vec2 q = vQ.xy;
  float px = clamp(max(length(dFdx(q)), length(dFdy(q))), 1e-4, 6.0);
  vec3 col = vC;

  // hairline marks: grain, wheel lines, tooling, creases
  vec2 isc = kWood * vec2(0.09, 1.3) + kClay * vec2(0.03, 1.6) + kStone * vec2(0.3, 0.8) + kHide * vec2(0.5, 0.2) + kReed * vec2(0.04, 5.0) + kCloth * vec2(0.05, 0.6);
  float n1 = vnoise(q * isc + 3.7) + 0.5 * vnoise(q * isc * 2.6 + 9.0);
  float marks = hair(sin(n1 * (7.0 + 5.0 * kWood - 4.5 * kStone)), 1.3) * (1.0 - smoothstep(0.1, 0.35, px));
  vec2 pq = q / 1.3; vec2 pc = floor(pq); vec2 pf = fract(pq) - 0.5;
  vec2 pr = vec2(pf.x + pf.y, pf.x - pf.y) * 0.7071 + (vec2(hash21(pc + 2.0), hash21(pc + 5.0)) - 0.5) * 0.3;
  float peck = (1.0 - smoothstep(0.2, 0.25, abs(pr.x))) * (1.0 - smoothstep(0.03, 0.03 + px, abs(pr.y))) * step(0.55, hash21(pc + 17.0)) * (1.0 - smoothstep(0.08, 0.25, px));
  col *= 1.0 - marks * (0.2 * kWood + 0.07 * kClay + 0.1 * kHide + 0.2 * kReed + 0.06 * kCloth) - 0.1 * peck * kStone;
  // wood: a darker knot here and there
  float kn = smoothstep(0.86, 0.9, vnoise(q * vec2(0.22, 0.7) + 40.0));
  col *= 1.0 - 0.22 * kn * kWood;
  // clay: sparse dark grits
  vec2 gi = floor(q / 0.45);
  float grit = step(0.93, hash21(gi)) * (1.0 - smoothstep(0.1, 0.3, px));
  col *= 1.0 - 0.16 * grit * kClay * step(length(fract(q / 0.45) - 0.5), 0.22);

  // weave: over and under, with a dark line where strands cross (q is in strand widths)
  vec2 wi = floor(q), wf = fract(q);
  float over = mod(wi.x + wi.y, 2.0);
  float wedge = min(min(wf.x, 1.0 - wf.x), min(wf.y, 1.0 - wf.y));
  float wline = 1.0 - smoothstep(0.07 - px, 0.07 + px, wedge);
  vec3 wv = col * mix(0.84, 1.0, over) * (1.0 - 0.3 * wline);
  wv = mix(wv, col * 0.92, smoothstep(0.2, 0.6, px));
  col = mix(col, wv, kWeave);

  // striped cloth: red ground, plaster and blue stripes across v (metres)
  float s = fract(q.y / 7.0), e = px / 7.0;
  float white = bandIn(s, 0.06, 0.16, e) + bandIn(s, 0.56, 0.6, e) + bandIn(s, 0.7, 0.74, e);
  float blue = bandIn(s, 0.22, 0.27, e) + bandIn(s, 0.63, 0.67, e);
  vec3 cl = mix(mix(col, uPlaster, white), uBlue, blue);
  col = mix(col, cl, kCloth);

  // reed: a dark node every couple of metres
  float nd = abs(fract(q.x / 2.3 + hash21(vec2(floor(q.y), 2.0))) - 0.5) * 2.3;
  col *= 1.0 - 0.3 * kReed * (1.0 - smoothstep(0.06 - px, 0.06 + px, nd));

  float sun = sunAt(vP) * lit;
  col *= mix(${l0.toFixed(2)}, 1.0, lit);
  col = mix(col, mix(col, uPlasterSun, 0.25), sun);
  // a flame is its own light: flat, in two tones, a pale heart inside a yellow and red tongue
  float kFlame = is(kind, 8.0);
  float heart = 1.0 - smoothstep(0.42, 0.5, abs(dot(N, normalize(cameraPosition - vP))) * -1.0 + 1.0);
  col = mix(col, mix(vC, uFlame, heart * step(vQ.y, 1.7)), kFlame);
  gl_FragColor = vec4(col, 1.0);
}
`}function Kt(o){return`
attribute vec4 iA;      // z, phase, tone, length
uniform float uTime, uShake, uShow;
varying vec3 vR;        // z across the door, y, tone
${o.gust}
void main(){
  float t = position.y;
  float w = pow(t, 1.4);
  vec2 g = gustAt(-8.0 + 0.4 * (iA.x - 29.5));
  float sway = w * (2.2 * max(g.x, -0.2) + 0.3 * sin(uTime * 1.4 + iA.y * 6.283) + 0.12 * sin(uTime * 3.3 + iA.y * 40.0) + 0.6 * uShake * sin(uTime * 9.0 + iA.y * 20.0));
  float side = 0.3 * w * sin(uTime * 1.1 + iA.y * 11.0) * (0.3 + g.x);
  vec3 p = vec3(52.5 - sway, ${j.y1.toFixed(1)} - t * iA.w + 0.12 * abs(sway), iA.x + position.x * 0.085 + side);
  vR = vec3(iA.x, t * iA.w, iA.z);
  // seen from behind (the camera that looks in through the previous portal can stand in the doorway) it folds away
  gl_Position = mix(vec4(2.0, 2.0, 2.0, 1.0), projectionMatrix * modelViewMatrix * vec4(p, 1.0), uShow);
}
`}const Ut=`
uniform vec3 uStraw, uStrawB, uRed, uBlue, uDark;
varying vec3 vR;
float bandIn(float s, float a, float b, float e){ return smoothstep(a - e, a + e, s) * (1.0 - smoothstep(b - e, b + e, s)); }
void main(){
  float px = clamp(fwidth(vR.y), 1e-3, 3.0);
  vec3 col = mix(uStraw, uStrawB, step(0.5, vR.z));
  // a painted chevron runs across all the reeds
  float zz = abs(fract((vR.x - 21.5) / 5.33) - 0.5) * 2.0;
  float y = vR.y + 2.6 * zz;
  col = mix(col, uRed, bandIn(y, 9.0, 11.6, px) + bandIn(y, 30.0, 32.6, px));
  col = mix(col, uBlue, bandIn(y, 12.6, 13.6, px) + bandIn(y, 28.0, 29.0, px) + bandIn(y, 20.4, 21.4, px));
  float nd = abs(fract(vR.y / 2.4 + vR.z * 3.7) - 0.5) * 2.4;
  col = mix(col, uDark, 0.55 * (1.0 - smoothstep(0.07 - px, 0.07 + px, nd)) * (1.0 - smoothstep(0.1, 0.4, px)));
  gl_FragColor = vec4(col, 1.0);
}
`,Ot=`
attribute vec3 aC; attribute vec4 aL;
uniform float uRun, uPhase, uHead, uTurn, uTime, uShadow;
varying vec3 vC, vN, vL; varying float vPart;
void main(){
  vec3 p = position;
  float s = aL.y;
  float leg = step(0.5, aL.x) * step(aL.x, 1.5);
  float amp = mix(0.42, 0.09, smoothstep(0.0, 0.62, s)) * (1.0 - 0.6 * smoothstep(0.8, 1.0, s));
  p.x += (uRun * amp * sin(s * 9.5 - uPhase) + 0.06 * (1.0 - smoothstep(0.0, 0.5, s)) * sin(uTime * 0.9 + s * 6.0)) * (1.0 - leg * 0.6);
  p.z += leg * uRun * 0.42 * sin(uPhase + aL.z) * (1.0 - smoothstep(0.0, 0.35, p.y));
  p.y += leg * uRun * 0.12 * max(0.0, cos(uPhase + aL.z));
  // breathing flanks
  float flank = smoothstep(0.52, 0.62, s) * (1.0 - smoothstep(0.72, 0.8, s)) * (1.0 - leg);
  p.x *= 1.0 + 0.05 * flank * sin(uTime * 3.2);
  // head and neck lift and turn about the shoulders
  float hw = smoothstep(0.74, 0.86, s) * (1.0 - leg);
  float zn = 0.9;
  float dz = p.z - zn;
  float ca = cos(uHead * hw), sa = sin(uHead * hw);
  p.y += hw * (dz * sa + 0.06 * uHead);
  p.z = zn + mix(dz, dz * ca, hw);
  p.x += hw * dz * sin(uTurn);
  vec3 pp = p;
  if (aL.x > 1.5) pp = vec3(p.x, 0.03, p.z) * step(0.5, uShadow);
  vC = aC; vL = position; vPart = aL.x;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pp, 1.0);
}
`,Zt=`
uniform vec3 uLdir, uDark, uPale, uGround;
uniform float uLitAll;
varying vec3 vC, vN, vL; varying float vPart;
void main(){
  vec3 N = normalize(vN);
  float ndl = dot(N, uLdir) - 0.05;
  float lit = clamp(ndl / max(fwidth(ndl), 1e-4) + 0.5, 0.0, 1.0) * uLitAll;
  vec3 col = vC;
  float body = 1.0 - step(0.5, vPart);
  // two rows of dark blotches down the back, a pale line along each flank
  float px = clamp(max(length(dFdx(vL.xz)), length(dFdy(vL.xz))), 1e-4, 1.0);
  vec2 b = vec2((abs(vL.x) - 0.15) / 0.1, (fract(vL.z / 0.36 + 0.25 * step(0.0, vL.x)) - 0.5) * 0.36 / 0.11);
  float e = px / 0.1;
  float blot = (1.0 - smoothstep(1.0 - e, 1.0 + e, length(b))) * step(0.12, vL.y) * step(-1.2, vL.z) * step(vL.z, 1.15) * body;
  col = mix(col, uDark, blot);
  float fl = 1.0 - smoothstep(0.035 - px, 0.035 + px, abs(abs(vL.x) - 0.3));
  col = mix(col, uPale, fl * step(0.1, vL.y) * step(-0.6, vL.z) * step(vL.z, 1.0) * body);
  col *= mix(${l0.toFixed(2)}, 1.0, lit);
  col = mix(col, uGround, step(1.5, vPart));
  gl_FragColor = vec4(col, 1.0);
}
`;function Jt(o){return`
attribute vec4 aS;
uniform float uTime, uPx, uFall, uFallA;
varying float vSun, vA, vKind;
${o.sun}
void main(){
  float ph = aS.x * 6.2832;
  float trem = step(0.5, aS.w);
  vec3 sd = uSunDir;
  vec3 w0 = vec3(uWinIn.x, position.y, position.z);
  float tMax = min(min((w0.z + ${i0.toFixed(1)}) / max(sd.z, 0.05), w0.y / max(sd.y, 0.05)), ${(2*T).toFixed(1)} / max(sd.x, 0.05));
  vec3 beam = w0 - sd * (tMax * position.x);
  // slow drift and a slow rise that wraps over 5 m
  float amp = mix(1.3, 0.35, step(0.15, aS.w));
  vec3 drift = vec3(amp * sin(uTime * 0.21 + ph), mod(uTime * aS.z + aS.x * 5.0, 5.0) - 2.5, amp * cos(uTime * 0.17 + ph * 1.7));
  // tremor dust: sifts down from the joists, keyed to the journey
  float fall = clamp(uFall * (9.0 + 6.0 * aS.z) - aS.x * 42.0, 0.0, 74.0);
  vec3 sift = vec3(0.35 * sin(fall * 0.4 + ph), -fall, 0.5 * sin(fall * 0.23 + ph * 2.0));
  vec3 p = mix(beam + drift, position + sift, trem);
  float wrap = mix(smoothstep(0.0, 0.6, 2.5 - abs(drift.y)), smoothstep(0.0, 1.5, fall) * (1.0 - smoothstep(66.0, 72.0, fall)) * uFallA, trem);
  vSun = sunAt(p); vKind = trem;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float size = aS.y * uPx * projectionMatrix[1][1] / max(-mv.z, 0.5);
  float sz = clamp(size, 1.5, 5.0);
  vA = wrap * min(1.0, size / 1.5) * step(1.0, -mv.z);
  gl_PointSize = sz;
}
`}const Ct=`
uniform vec3 uSunCol, uShadeCol, uSiftCol;
varying float vSun, vA, vKind;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float disc = 1.0 - smoothstep(0.34, 0.5, d);
  vec3 col = mix(mix(uShadeCol, uSunCol, vSun), mix(uSiftCol, uSunCol, vSun), vKind);
  float a = disc * vA * mix(mix(0.0, 1.0, vSun), 0.85, vKind);
  if (a < 0.01) discard;
  gl_FragColor = vec4(col, a);
}
`,te=`
varying vec3 vP;
void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`,ee=`
uniform vec3 uBeamCol, uRoot, uSunDir;
uniform vec4 uWinIn, uWinHalf;
uniform float uBeamK;
varying vec3 vP;
void slab(float fo, float fd, float lo, float hi, inout float t0, inout float t1){
  float inv = 1.0 / (abs(fd) < 1e-5 ? (fd < 0.0 ? -1e-5 : 1e-5) : fd);
  float a = (lo - fo) * inv, b = (hi - fo) * inv;
  t0 = max(t0, min(a, b)); t1 = min(t1, max(a, b));
}
void main(){
  vec3 o = cameraPosition - uRoot, d = vP - o;
  float len = max(length(d), 1e-3);
  d /= len;
  float sx = max(uSunDir.x, 0.02), k = uSunDir.y / sx, m = uSunDir.z / sx;
  const float E = 3.2;   // metres over which each face of the beam fades
  float t0 = 0.0, t1 = len;
  // beam coordinates: where the line from a point toward the sun meets the window plane (by, bz), both linear along the ray
  float by0 = o.y + k * (uWinIn.x - o.x) - uWinIn.z, byd = d.y - k * d.x;
  float bz0 = o.z + m * (uWinIn.x - o.x) - uWinIn.y, bzd = d.z - m * d.x;
  slab(by0, byd, -uWinHalf.y - E, uWinHalf.y + E, t0, t1);
  slab(bz0, bzd, -uWinHalf.x - E, uWinHalf.x + E, t0, t1);
  slab(o.x, d.x, -${T.toFixed(1)}, ${T.toFixed(1)}, t0, t1);
  slab(o.y, d.y, 0.0, ${m0.toFixed(1)}, t0, t1);
  slab(o.z, d.z, -${i0.toFixed(1)}, ${i0.toFixed(1)}, t0, t1);
  float L = max(t1 - t0, 0.0), acc = 0.0, dt = L / 10.0;
  for (int i = 0; i < 10; i++) {
    float t = t0 + (float(i) + 0.5) * dt;
    float fy = 1.0 - smoothstep(uWinHalf.y - E, uWinHalf.y + E, abs(by0 + byd * t));
    float fz = 1.0 - smoothstep(uWinHalf.x - E, uWinHalf.x + E, abs(bz0 + bzd * t));
    float along = (uWinIn.x - (o.x + d.x * t)) / sx;          // metres down the beam from the window
    float fa = smoothstep(7.0, 24.0, along) * mix(1.0, 0.6, clamp(along / 70.0, 0.0, 1.0));
    float near = smoothstep(4.0, 18.0, t);                    // the eye never flies through a fog
    acc += fy * fz * fa * near * dt;
  }
  float side = 1.0 - smoothstep(0.55, 0.9, abs(dot(d, uSunDir)));
  float a = (1.0 - exp(-acc / 16.0)) * uBeamK * side;
  gl_FragColor = vec4(uBeamCol, a);
}
`;function oe(o){return`
uniform float uTime;
uniform vec3 uHaze, uSea, uRim, uGlint, uHazeB;
varying vec3 vP;
${o.hash}
void main(){
  vec3 d = vP - cameraPosition;
  float hx = max(d.x, 1.0);
  float el = d.y / hx, az = d.z / hx;
  float px = clamp(fwidth(el), 1e-5, 0.05);
  vec3 col = uHaze;
  // thin bands of haze drifting left to right
  float hb = vnoise(vec2(az * 2.2 - uTime * 0.02, el * 26.0)) + 0.5 * vnoise(vec2(az * 5.0 - uTime * 0.035, el * 60.0 + 4.0));
  col = mix(col, uHazeB, smoothstep(0.72, 0.9, hb) * 0.9);
  // the far rim of the island: one paler shape standing on the horizon
  float rim = 0.035 + 0.03 * vnoise(vec2(az * 3.1 + 2.0, 0.5)) + 0.012 * vnoise(vec2(az * 11.0, 3.5));
  rim *= smoothstep(-0.75, -0.3, az) * (1.0 - smoothstep(0.25, 0.9, az));
  col = mix(col, uRim, (1.0 - smoothstep(rim - px, rim + px, el)) * step(0.004, rim));
  // the sea: a deeper band under the horizon, thinning back into haze below
  float sea = (1.0 - smoothstep(-0.012 - px, -0.012 + px, el)) * (0.25 + 0.75 * smoothstep(-0.5, -0.16, el));
  col = mix(col, uSea, sea);
  // glints that come and go slowly
  vec2 gq = vec2(az * 40.0, (el + 0.012) * 190.0);
  vec2 gi = floor(gq);
  float gh = hash21(gi);
  float tw = smoothstep(0.55, 0.95, sin(uTime * (0.35 + 0.5 * gh) + gh * 40.0));
  vec2 gf = fract(gq) - 0.5;
  float gl = (1.0 - smoothstep(0.3, 0.42, abs(gf.x))) * (1.0 - smoothstep(0.1, 0.2, abs(gf.y)));
  col = mix(col, uGlint, gl * tw * step(0.55, gh) * step(el, -0.018) * step(-0.42, el));
  gl_FragColor = vec4(col, 1.0);
}
`}const ae=`
varying vec3 vP;
void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;function $(o,t,e,z,c=8){const u=new n.Vector3(...o),y=new n.Vector3(...t),s=y.clone().sub(u),h=s.length(),v=new n.CylinderGeometry(z,e,h,c,1,!1),b=v.attributes.uv;for(let m=0;m<b.count;m++)b.setXY(m,b.getY(m)*h,b.getX(m)*t0*Math.max(e,z));return v.applyQuaternion(new n.Quaternion().setFromUnitVectors(new n.Vector3(0,1,0),s.normalize())),v.translate((o[0]+t[0])/2,(o[1]+t[1])/2,(o[2]+t[2])/2),v}function y0(o,t,e,z,c,u=2){let y=null;for(let s=0;s<e.length;s+=u){const h=e[Math.min(s,e.length-1)];y&&h[1]>y[1]+.2&&c.push([o,t,z+y[1],z+h[1],y[0]*.94,h[0]*.94]),(!y||h[1]>y[1]+.2)&&(y=h)}}async function ne(o,t,e,z){const{x:c,z:u,w:y,d:s,h}=f0,v=c-y/2,b=c+y/2,m=u-s/2,p=u+s/2,i=e.wood,d=e.woodD;for(const x of[-1,1])for(const S of[-1,1]){const M=c+x*(y/2-1.6),V=u+S*(s/2-1.6);t.add(N(3.2,9.4,3.2,.4),{p:[M,4.7,V],c:i,kind:1,uv:(G,H,_)=>[H,(G+_)*.8]}),t.add(X([[1,0],[1.5,.5],[1.15,1],[1.35,1.6],[.9,2.2],[0,2.45]],12,d),{p:[M,9.3,V],kind:1}),z.slabs.push([M-1.3,M+1.3,V-1.3,V+1.3,0,9.2]),t.add($([M+x*1.55,6.6,V-.6],[M+x*1.85,6.6,V-.6],.28,.28,8),{c:d,kind:0}),t.add($([M+.6,6.6,V+S*1.55],[M+.6,6.6,V+S*1.85],.28,.28,8),{c:d,kind:0}),await o.yield()}for(const x of[-1,1])t.add(N(y-3.4,2.8,1.5,.3),{p:[c,6.6,u+x*(s/2-1.2)],c:i,kind:1}),t.add(N(y-3.4,1.1,1,.25),{p:[c,2.4,u+x*(s/2-1.5)],c:d,kind:1});for(const x of[-1,1])t.add(N(1.5,2.8,s-3.4,.3),{p:[c+x*(y/2-1.2),6.6,u],c:i,kind:1}),t.add(N(1,1.1,s-3.4,.25),{p:[c+x*(y/2-1.5),2.4,u],c:d,kind:1});z.slabs.push([v+.4,b-.4,m+.4,p-.4,5.4,7.9]),await o.yield();const a=(x,S,M,V,G,H,_,a0)=>{const Y=new n.BoxGeometry(M?x:S,.22,M?S:x,M?10:1,1,M?1:10),O=Y.attributes.position,d0=Y.attributes.uv;for(let I=0;I<O.count;I++){const Z=(M?O.getX(I):O.getZ(I))/x;O.setY(I,O.getY(I)-_*Math.cos(Math.PI*Z)),d0.setXY(I,M?O.getX(I):O.getZ(I),M?O.getZ(I):O.getX(I))}Y.computeVertexNormals(),t.add(Y,{p:[V,H,G],c:a0,kind:6})};let l=0;for(let x=v+3.4;x<b-3;x+=1.9)a(s-3.2,1.05,!1,x,u,7.42,.5,l++&1?e.hide:e.hideB),(l&3)===0&&await o.yield();for(let x=m+2.9;x<p-2.5;x+=1.75)a(y-3.2,1.2,!0,c,x,7.66,.55,l++&1?e.hideB:e.hide),(l&3)===0&&await o.yield();await o.yield();const r=30,w=26,f=[],P=[],k=[],A=[];for(let x=0;x<=w;x++)for(let S=0;S<=r;S++){const M=S/r,V=x/w,G=V*23.5,H=Math.min(G,14.6),_=Math.max(0,G-14.6),a0=.45*Math.sin(M*11+V*5)*Math.sin(V*7+1)+.3*Math.sin(M*23+V*13+2),Y=2.2*Math.sin(V*5.5+.6)*(1-M)+1.3*Math.sin(V*9+2)*M,O=_>0?.55*Math.sin(M*16+1.3)*Math.min(1,_/2):0,d0=c-9+M*20.5+Y*(.35+.65*(1-M)*(1-M))+(_>0?.25*Math.sin(M*9+_):0),I=m+1.6+H+Math.min(_,1.2)*.75+O,Z=8.05+(_>0?.3-Math.max(0,_-.7)*(.92+.08*Math.sin(M*7)):.3+Math.max(0,a0)*.9+.5*Math.exp(-((M-.2)**2)*40)*Math.sin(V*6));f.push(d0,Z,I),P.push(G,M*20.5),k.push(Math.min(1,_/4))}for(let x=0;x<w;x++)for(let S=0;S<r;S++){const M=x*(r+1)+S,V=M+1,G=M+r+1,H=G+1;A.push(M,G,V,V,G,H)}const D=new n.BufferGeometry;D.setAttribute("position",new n.Float32BufferAttribute(f,3)),D.setAttribute("uv",new n.Float32BufferAttribute(P,2)),D.setIndex(A),D.computeVertexNormals(),await o.yield();let g=0;t.add(D,{c:e.red,kind:5,sway:()=>k[g++]}),z.slabs.push([c-8,c+11,p-.2,p+1.5,1.6,8.2]),await o.yield(),t.add(N(5.2,2.6,12.5,1.25),{p:[v+5.6,9.1,u],c:e.linen,kind:5,uv:(x,S,M)=>[x,M*1.9+1.2]})}function se(o,t,e,z){const{x:c,z:u}=_0;let y;if(z==="baskets"){let m=0;[[5,5.2,t.straw],[4,4.4,t.yellowD],[3,3.6,t.straw]].forEach(([p,i,d],a)=>{y=[[p*.72,0,d],[p*.9,i*.25,d],[p,i*.8,t.red],[p*1.03,i*.9,t.red],[p*1.03,i,d],[p*.9,i,d],[p*.82,i*.86,d]],o.add(X(y,30,d),{p:[c+a*.5,m,u-a*.4],kind:3,uv:[1/.55,1/.55]}),y0(c+a*.5,u-a*.4,y.slice(0,5),m,e.tapers,2),m+=i*.82}),o.add(X([[0,0,t.yellowD],[2.6,.15,t.yellowD],[2.8,.5,t.red],[2.6,.7,t.straw],[0,.9,t.straw]],24,t.straw),{p:[c-5.6,2.5,u+2.2],r:[0,0,1.15],kind:3,uv:[1/.55,1/.55]}),e.tapers.push([c-5.4,u+2.2,0,5,1,.6]);return}const s=t.clay,h=t.clayD,v=t.red;if(z==="strainer"?y=[[2.6,0,h],[2.9,.5,s],[3.4,3,s],[3.7,5.2,v],[3.8,6,s],[3.9,8.4,h],[3.95,9,s],[4.3,12.2,v],[4.7,13.2,s],[5,14,h],[4.6,14,s],[4.2,13.2,s]]:y=[[2.3,0,h],[2.5,.5,s],[3.6,2.6,s],[4.5,5,h],[4.7,6.3,s],[4.6,7.2,s],[4,9,h],[3.4,9.7,s],[2.2,10.9,s],[1.5,11.8,v],[1.45,12.6,s],[1.7,13.3,s],[2,13.7,h],[1.7,13.7,s],[1.2,13,s]],o.add(X(y,32,s),{p:[c,0,u],kind:2}),y0(c,u,y.slice(0,z==="strainer"?10:13),0,e.tapers,2),z==="strainer"){for(let m=0;m<3;m++)for(let p=0;p<18;p++){const i=(p+(m&1)*.5)/18*t0,d=9.9+m*.8,a=3.98+(d-9)*.11;o.add(new n.SphereGeometry(.2,6,4),{p:[c+Math.cos(i)*a,d,u+Math.sin(i)*a],c:t.black,kind:0})}for(const m of[-1,1])o.add(new n.TorusGeometry(1.3,.34,8,14,Math.PI),{p:[c,12.9,u+m*4.5],r:[0,0,0],s:[1,1,1],c:s,kind:2});return}const b=new n.CylinderGeometry(.45,1.5,3.2,14,1,!0);o.add(b,{p:[c-1.5,14.2,u-.6],r:[0,.38,.95],c:s,kind:2}),o.add(new n.TorusGeometry(1.75,.36,8,16,Math.PI),{p:[c+1.6,11.3,u+.6],r:[0,-.38,-Math.PI/2+.25],c:s,kind:2}),e.tapers.push([c-1.9,u-.7,13.2,15.6,1.2,.5])}function ie(o,t,e,z){const{x:c,z:u}=X0,y=t.red,s=t.linen;o.add(X([[0,6.9,y],[3.6,6.9,y],[4.7,7.15,y],[5,7.5,s],[5,7.95,s],[4.55,8,y],[3.2,7.86,s],[2.9,7.84,y],[0,7.8,y]],40,y),{p:[c,0,u],kind:0}),e.tapers.push([c,u,7,7.9,4.9,4.9]);for(let m=0;m<3;m++){const p=m/3*t0+.5,i=Math.cos(p),d=Math.sin(p),a=X([[.62,0,s],[.7,.5,y],[.78,3.4,s],[.82,3.9,y],[.95,7,y]],12,y);o.add(a,{p:[c+i*3.9,0,u+d*3.9],r:[-d*.1,0,i*.1],kind:0}),e.tapers.push([c+i*3.7,u+d*3.7,0,7,.6,.85])}const h=7.84;o.add(X([[0,.12,t.clay],[1.3,.12,t.clay],[2.5,.8,t.red],[2.7,.95,t.red],[2.45,.95,t.clay],[1.3,.34,t.clay],[0,.3,t.clay]],28,t.clay),{p:[c-.7,h,u+.4],kind:2});for(let m=0;m<8;m++){const p=m/7*t0+.3,i=m===7?0:1.15,d=c-.7+Math.cos(p)*i,a=u+.4+Math.sin(p)*i,l=m%3===1?t.figB:t.fig;o.add(X([[0,0,l],[.42,.14,l],[.62,.5,l],[.5,.86,l],[.2,1.12,l],[.07,1.3,t.yellowD],[0,1.32,t.yellowD]],10,l),{p:[d,h+.4+(m===7?.55:0),a],r:[z.range(-.5,.5),z.range(0,6),z.range(-.5,.5)],kind:0})}const v=[c+1.2,h+.18,u-3.2],b=[c+3.4,h+.3,u+1.6];o.add($(v,b,.11,.07,6),{c:t.yellowD,kind:0});for(let m=0;m<6;m++){const p=.25+m*.13,i=m&1?1:-1,d=[o0(v[0],b[0],p),o0(v[1],b[1],p),o0(v[2],b[2],p)],a=[d[0]+i*.7,d[1]+.15,d[2]+.45];o.add($(d,a,.06,.05,5),{c:t.yellowD,kind:0}),o.add(X([[0,0,t.red],[.2,.1,t.red],[.26,.34,t.red],[0,.62,t.red]],8,t.red),{p:a,r:[.6,0,-i*1.1],kind:0})}Q0(o,t,[c+2.2,h,u+2.6],[0,0,0])}function re(o){return[[0,0,o.clay],[.55,0,o.clay],[.72,.5,o.clay],[1.12,1.62,o.red],[1.25,2,o.red],[1.1,2,o.clayD],[.5,.3,o.clayD],[0,.28,o.clayD]]}function Q0(o,t,e,z){o.add(X(re(t),20,t.clay),{p:e,r:z,kind:2})}async function le(o,t,e,z,c){for(let a=0;a<5;a++)Q0(t,e,[3.5+.05*a*(a&1?1:-1),a*.72,20+.04*a],[0,a*1.3,0]);z.tapers.push([3.5,20,0,4.9,.7,1.2]),Q0(t,e,[3.5+3.3,1.1,20-1.6],[0,.7,Math.PI/2+.25]),z.slabs.push([3.5+1.7,3.5+3.6,20-2.7,20-.6,0,1.9]);const s=-30,h=-3,v=15,b=24.6,m=.3;t.add(N(h-s,m,b-v,.12),{p:[(s+h)/2,m/2,(v+b)/2],c:e.straw,kind:3,uv:(a,l,r)=>[a/.62,r/.62]});for(const a of[v,b])t.add(N(h-s+.5,m+.12,.7,.14),{p:[(s+h)/2,m/2+.06,a],c:e.red,kind:0});for(const a of[s,h])t.add(N(.7,m+.12,b-v+.5,.14),{p:[a,m/2+.06,(v+b)/2],c:e.yellowD,kind:0});await o.yield();const p=(a,l,r)=>{const w=new n.CylinderGeometry(1.15,1.15,.3,20),f=w.attributes.position;for(let D=0;D<f.count;D++){const g=f.getZ(D);f.setZ(D,g*2.7),f.setX(D,f.getX(D)*(1-.22*Math.max(0,-g)+.06*g))}w.computeVertexNormals();const P=Math.cos(r),k=Math.sin(r);t.add(w,{p:[a,m+.16,l],r:[0,r,0],c:e.hide,kind:6,uv:[3,3]});const A=(D,g)=>[a+D*P+g*k,m+.3,l-D*k+g*P];t.add(new n.TorusGeometry(.95,.13,6,12,Math.PI),{p:A(0,1.4),r:[0,r,0],c:e.woodD,kind:0}),t.add(new n.TorusGeometry(.85,.13,6,12,Math.PI),{p:A(0,.2),r:[0,r,0],c:e.woodD,kind:0}),t.add(new n.TorusGeometry(.8,.12,6,12,Math.PI),{p:A(0,-2.2),r:[.5,r,0],c:e.woodD,kind:0}),z.slabs.push([a-1.4,a+1.4,l-2.6,l+2.6,0,1])};p(-14.5,19.2,.25),p(-10.6,20.6,-.5),await o.yield();const i=-19,d=-17.5;t.add(N(7,.9,5,.3),{p:[i,5,d],c:e.wood,kind:1});for(const a of[-1,1])for(const l of[-1,1])t.add($([i+a*3.2,0,d+l*2.3],[i+a*2.6,4.6,d+l*1.8],.42,.55,8),{c:e.woodD,kind:1}),z.tapers.push([i+a*2.9,d+l*2.05,0,4.6,.4,.5]);t.add($([i-2.9,2.3,d-2],[i+2.9,2.3,d-2],.26,.26,6),{c:e.woodD,kind:1}),t.add($([i-2.9,2.3,d+2],[i+2.9,2.3,d+2],.26,.26,6),{c:e.woodD,kind:1}),z.slabs.push([i-3.3,i+3.3,d-2.3,d+2.3,4.6,5.4]),t.add(N(3.6,.5,3,.22),{p:[i-1.2,5.7,d+.2],r:[0,.2,0],c:e.blue,kind:0}),t.add(N(3.4,.5,2.8,.22),{p:[i-1.1,6.2,d+.3],r:[0,.32,0],c:e.blue,kind:0}),t.add(new n.SphereGeometry(1.05,16,10),{p:[i+2.1,6.45,d-.7],c:e.red,kind:7,uv:[30,12]}),t.add($([i+.4,5.75,d+1.9],[i+3.3,5.95,d+.9],.1,.07,6),{c:e.woodD,kind:0}),t.add(X([[0,0,e.clay],[.5,.1,e.clay],[.5,.3,e.clay],[0,.4,e.clay]],10,e.clay),{p:[i+.9,5.72,d+1.72],r:[0,0,1.4],kind:2})}function ft(o,t,e,z,c,u,y={}){const h=(e+z)/2,v=(c+u)/2,b=z-e,m=u-c,p=b>=m;o.add(N(b,.3,m,.12),{p:[h,.3/2,v],c:y.c||t.straw,kind:3,uv:(f,P,k)=>[f/.62,k/.62]});const i=y.edge||t.red,d=y.end||t.yellowD;for(const f of[c,u])o.add(N(b+.5,.3+.12,.7,.14),{p:[h,.3/2+.06,f],c:p?i:d,kind:0});for(const f of[e,z])o.add(N(.7,.3+.12,m+.5,.14),{p:[f,.3/2+.06,v],c:p?d:i,kind:0});const a=p?b:m,l=y.cols||[t.red,t.blue],r=y.stripes??0;for(let f=0;f<r;f++){const P=(p?e:c)+2.2+f/Math.max(1,r-1)*(a-4.4),k=f&1?.7:1.5;o.add(new n.BoxGeometry(p?k:b-1.6,.08,p?m-1.6:k),{p:p?[P,.3+.02,v]:[h,.3+.02,P],c:l[f%l.length],kind:0})}const w=Math.round((p?m:b)/.9);for(const f of[-1,1])for(let P=0;P<w;P++){const k=(p?c:e)+.5+P/Math.max(1,w-1)*((p?m:b)-1),A=(p?f<0?e:z:f<0?c:u)+f*1,D=.18*Math.sin(P*2.7);o.add(new n.BoxGeometry(p?1.3:.3,.1,p?.3:1.3),{p:p?[A,.06,k+D]:[k+D,.06,A],r:[0,D,0],c:P%3===0?i:y.c||t.straw,kind:0})}}async function de(o,t,e,z){const s=f=>-25.4+.115*f;for(const f of[-20.6,-3.4]){t.add($([s(0),0,f],[s(30+1.6),30+1.6,f],.95,.8,10),{c:e.wood,kind:1}),t.add(N(3,1.3,3,.3),{p:[s(0),.65,f],c:e.stone,kind:4});const P=f+(f<-12?-1:1);t.add($([s(21),21,P],[-16.6,0,P],.5,.6,8),{c:e.woodD,kind:1}),t.add(X([[.8,0,e.woodD],[1.1,.5,e.woodD],[.7,1.2,e.woodD],[0,1.5,e.woodD]],10,e.woodD),{p:[s(30+1.6),30+1.5,f],kind:1}),z.slabs.push([s(12)-.8,s(12)+.8,f-.8,f+.8,0,30])}t.add($([s(30)-.2,30,-20.6-2.2],[s(30)-.2,30,-3.4+2.2],1.05,1.05,12),{c:e.joist,kind:1});for(const f of[-20.6-1.6,-3.4+1.6])t.add($([s(30)-1.9,30+.2,f],[s(30)+1.5,30-.2,f],.22,.22,6),{c:e.woodD,kind:0});t.add($([s(14)-1.5,14,-20.6-.9],[s(14)-1.5,14,-3.4+.9],.36,.36,8),{c:e.woodD,kind:1});for(const f of[-20.6,-3.4])t.add($([s(14.4),14.4,f],[s(14)-1.9,13.8,f],.3,.3,6),{c:e.woodD,kind:0});t.add($([s(8.5)+.5,8.5,-20.6+.3],[s(8.5)+.5,8.5,-3.4-.3],.3,.3,8),{c:e.wood,kind:1}),await o.yield();const h=30-.6,v=20.4,b=-20.6+1.3,m=-3.4-1.3,p=10,i=6,d=[],a=[],l=[];for(let f=0;f<=i;f++)for(let P=0;P<=p;P++){const k=P/p,A=f/i,D=o0(h,v,A);d.push(s(D)-.55-.12*Math.sin(k*9+A*3),D,o0(b,m,k)+.1*Math.sin(A*7+k*4)),a.push(o0(b,m,k),(h-D)*1.4+.6)}for(let f=0;f<i;f++)for(let P=0;P<p;P++){const k=f*(p+1)+P,A=k+1,D=k+p+1,g=D+1;l.push(k,D,A,A,D,g)}const r=new n.BufferGeometry;r.setAttribute("position",new n.Float32BufferAttribute(d,3)),r.setAttribute("uv",new n.Float32BufferAttribute(a,2)),r.setIndex(l),r.computeVertexNormals(),t.add(r,{c:e.ochre,kind:5}),z.slabs.push([s(25)-.9,s(25)-.3,b,m,v,h]),await o.yield();const w=13;for(let f=0;f<w;f++){const P=o0(b+.5,m-.5,f/(w-1)),k=f&1,A=3.4+(k?1.5:0)+.5*Math.sin(f*1.9),D=k?s(v)-.5:s(A)-.6,g=(S,M)=>s0((v-M)/(v-A),0,1.15)*1.5;for(const S of[-.36,.36])t.add($([D,A+1.9,P],[s(v)-.55,v,P+S],.11,.11,5),{c:k?e.linen:e.straw,kind:0,sway:g});const x=X([[0,0,e.clayD],[.75,.15,e.clay],[1.05,.8,e.clay],[.85,1.5,f%3===0?e.red:e.clay],[.3,1.95,e.clayD],[0,2,e.clayD]],12,e.clay);t.add(x,{p:[D,A,P],s:[.5,1,1],kind:2,sway:g}),(f&3)===3&&await o.yield()}z.slabs.push([s(4)-1.2,s(4)+.6,b,m,3.2,6.2])}async function ce(o,t,e,z){const y=e.clay,s=e.clayD,h=e.red,v=[[2.6,0,s],[2.9,.6,y],[4.3,3.6,y],[5.2,6.6,h],[5.45,7.3,y],[5.6,9.8,s],[5.65,10.5,y],[5.3,13.4,h],[5.1,14,y],[4.2,16.4,s],[3.7,17.2,y],[3.3,18.6,y],[3.9,19.6,s],[4.1,20.1,y],[3.5,20.1,s],[3,19,s]];t.add(X(v,36,y),{p:[-42.3,0,-34.8],kind:2}),y0(-42.3,-34.8,v.slice(0,14),0,z.tapers,3);for(let i=0;i<4;i++){const d=i/4*t0+.6;t.add(new n.TorusGeometry(1.25,.36,8,14,Math.PI),{p:[-42.3+Math.cos(d)*4.2,17,-34.8+Math.sin(d)*4.2],r:[0,-d+Math.PI/2,0],c:y,kind:2})}for(const[i,d]of[[5.4,4.95],[11.9,5.62]])t.add(new n.TorusGeometry(d,.22,6,40),{p:[-42.3,i,-34.8],r:[Math.PI/2,0,0],c:e.yellowD,kind:7,uv:[60,3]});await o.yield();const b=-35.4,m=-38.2,p=[[1.7,0,s],[1.9,.4,y],[3.2,3.2,y],[3.5,5,s],[3.45,5.7,y],[2.7,8.2,h],[2.2,9,y],[2.5,9.9,s],[2.2,9.9,s]];t.add(X(p,28,y),{p:[b,0,m],kind:2}),y0(b,m,p,0,z.tapers,3),t.add(X([[0,9.8,e.stoneD],[2.7,9.8,e.stoneD],[2.8,10.3,e.stone],[.6,10.6,e.stone],[.5,11.1,e.stoneD],[0,11.15,e.stoneD]],20,e.stone),{p:[b,0,m],kind:4})}function pt(o,t,e,z=1.25){const c=e[1];o.add(X([[0,0,t.flameA],[.45,.2,t.flameA],[.62,.75,t.flameA],[.42,1.5,t.flameB],[.14,2.2,t.flameR],[0,2.5,t.flameR]],10,t.flameA),{p:e,s:z,kind:8,sway:(u,y)=>s0((y-c)/(2.5*z),0,1)*1.6})}function ht(o,t,e,z,c){const u=t.stone,y=t.stoneD,s=t.red,h=[[2.3,0,y],[2.5,.5,u],[1.6,1.1,u],[.95,2,u],[.85,6.4,s],[1.3,7.1,u],[1,7.7,u],[2.2,8.6,u],[2.9,9.6,y],[2.9,10.1,y],[2.3,10.1,t.black],[1.6,9.7,t.black],[0,9.6,t.black]];o.add(X(h,24,u),{p:[z,0,c],kind:4}),y0(z,c,h.slice(0,10),0,e.tapers,3),o.add($([z+1.5,9.7,c],[z+2.1,10.3,c],.16,.12,6),{c:t.linen,kind:0}),pt(o,t,[z+2.1,10.2,c])}function mt(o,t,e,z,c,u=1){const y=new n.Vector3(...e),s=new n.Vector3(...z),h=y.clone().lerp(s,.55);h.y+=.06*y.distanceTo(s);const v=(k,A)=>s0((A-c)/9,0,1.3)*1.2;o.add($(y.toArray(),h.toArray(),.17*u,.14*u,6),{c:t.yellowD,kind:0,sway:v}),o.add($(h.toArray(),s.toArray(),.14*u,.11*u,6),{c:t.yellowD,kind:0,sway:v});const b=s.clone().sub(h).normalize(),m=new n.Vector3().crossVectors(b,new n.Vector3(.31,.2,.93)).normalize(),p=new n.Vector3().crossVectors(b,m),i=[],d=[],a=[],l=new n.Vector3,r=new n.Vector3,w=new n.Vector3,f=new n.Vector3;for(let k=0;k<5;k++){const A=k/5*t0+.3,D=i.length/3,g=6,x=2.9*u;l.copy(m).multiplyScalar(Math.cos(A)).addScaledVector(p,Math.sin(A)),r.crossVectors(b,l).normalize(),w.copy(s);for(let S=0;S<=g;S++){const M=S/g,V=.3+2.1*Math.pow(M,1.2),G=.52*u*Math.pow(Math.sin(Math.PI*(.08+.9*M)),.75);if(i.push(w.x-r.x*G,w.y-r.y*G,w.z-r.z*G,w.x+r.x*G,w.y+r.y*G,w.z+r.z*G),d.push(0,M,1,M),f.copy(b).multiplyScalar(Math.cos(V)).addScaledVector(l,Math.sin(V)),w.addScaledVector(f,x/g),S<g){const H=D+S*2;a.push(H,H+1,H+3,H,H+3,H+2)}}}const P=new n.BufferGeometry;P.setAttribute("position",new n.Float32BufferAttribute(i,3)),P.setAttribute("uv",new n.Float32BufferAttribute(d,2)),P.setIndex(a),P.computeVertexNormals(),o.add(P,{c:t.red,kind:0,sway:v});for(let k=0;k<3;k++){const A=k/3*t0+1.1;l.copy(m).multiplyScalar(Math.cos(A)).addScaledVector(p,Math.sin(A)),w.copy(s).addScaledVector(b,1.9*u).addScaledVector(l,.55*u),o.add($(s.toArray(),w.toArray(),.06*u,.05*u,4),{c:t.yellow,kind:0,sway:v}),o.add(new n.SphereGeometry(.2*u,6,4),{p:w.toArray(),c:t.yellow,kind:0,sway:v})}}function ue(o,t,e,z){const c=t.clay,u=t.clayD,y=t.red,s=15.2,h=-5.2,v=[[1.5,0,u],[1.7,.4,c],[2.9,2.6,c],[3.2,4.2,y],[3.15,4.9,t.linen],[2.9,5.6,t.blue],[2.3,6.9,c],[1.25,8.2,u],[1.2,8.9,c],[1.75,9.6,y],[1.45,9.6,u],[1,8.8,u]];o.add(X(v,26,c),{p:[s,0,h],kind:2}),y0(s,h,v.slice(0,10),0,e.tapers,3);for(const i of[-1,1])o.add(new n.TorusGeometry(1.2,.26,6,12,Math.PI),{p:[s,7.3,h+i*2.2],r:[0,Math.PI/2,i*-Math.PI/2],c,kind:2});for(let i=0;i<6;i++){const d=i/6*t0+z.range(-.3,.3),a=i===0?.6:z.range(2.4,4.6),l=i===0?9:z.range(5.5,8.2);mt(o,t,[s+Math.cos(d)*.5,9.2,h+Math.sin(d)*.5],[s+Math.cos(d)*a,9.4+l,h+Math.sin(d)*a],9.4)}e.tapers.push([s,h,12,18,1,4]);const b=X0.x-2.8,m=X0.z-2.8,p=7.84;o.add(X([[.55,0,u],[.65,.15,c],[.95,1.1,y],[.9,1.7,c],[.5,2.6,c],[.45,3,u],[.62,3.3,c],[.45,3.3,u]],16,c),{p:[b,p,m],kind:2});for(let i=0;i<3;i++){const d=i/3*t0+.9,a=i===0?.3:1.7;mt(o,t,[b,p+3.1,m],[b+Math.cos(d)*a,p+(i===0?7.6:6.2),m+Math.sin(d)*a],p+3.1,.62)}}function fe(o,t,e){for(const u of[-1,1])for(const y of[-1,1])o.add(N(1.1,.9,1.1,.2),{p:[-1+u*4.2,.45,-15+y*2.3],c:t.woodD,kind:1});o.add(N(10,4.4,6,.35),{p:[-1,3,-15],c:t.wood,kind:1}),o.add(N(10.6,1,6.6,.4),{p:[-1,5.6,-15],c:t.woodD,kind:1});for(const u of[-1,1])o.add(N(.9,4.5,6.12,.1),{p:[-1+u*2.8,3,-15],c:t.red,kind:0}),o.add(new n.TorusGeometry(.9,.2,6,12,Math.PI),{p:[-1+u*5.05,3.6,-15],r:[Math.PI,Math.PI/2,0],c:t.straw,kind:7,uv:[20,3]});e.slabs.push([-6,4,-18,-12,.8,6.1]),o.add(N(4,.6,3.6,.26),{p:[-1-2.6,6.4,-15+.3],r:[0,.15,0],c:t.blue,kind:0}),o.add(N(3.8,.6,3.4,.26),{p:[-1-2.5,7,-15+.2],r:[0,-.1,0],c:t.linen,kind:5,uv:(u,y,s)=>[u,s*2.4]}),o.add(X([[0,0,t.straw],[1.6,0,t.straw],[2.3,1.5,t.yellowD],[2.4,1.9,t.red],[2.15,1.9,t.straw],[1.5,.3,t.straw],[0,.25,t.straw]],22,t.straw),{p:[-1+2.4,6.1,-15-.2],kind:3,uv:[1/.45,1/.45]}),o.add(new n.SphereGeometry(.95,14,10),{p:[1,7.4,-15-.5],c:t.red,kind:7,uv:[28,11]}),o.add(new n.SphereGeometry(.85,14,10),{p:[-1+3.1,7.3,-15+.4],c:t.linen,kind:7,uv:[26,10]}),o.add(new n.SphereGeometry(.8,14,10),{p:[-1+2.2,7.25,-15+.9],c:t.yellow,kind:7,uv:[26,10]})}function pe(o){const t=ct(),e=T,z=T+r0,c=(b,m,p,i,d,a)=>{const l=b,r=[b[0]+m[0],b[1]+m[1],b[2]+m[2]],w=[b[0]+p[0],b[1]+p[1],b[2]+p[2]],f=[r[0]+p[0],r[1]+p[1],r[2]+p[2]];t.add($t(l,r,f,w),{c:o.plaster,kind:i,sway:d,uv:a})},u=(b,m,p)=>[p,m],y=(b,m,p)=>[b,m],s=(b,m,p)=>[b,p];c([-T,0,i0],[2*T,0,0],[0,0,-2*i0],0,1,s),c([e,0,j.z1],[r0,0,0],[0,0,j.z0-j.z1],0,1,s),c([-T,m0,-i0],[2*T,0,0],[0,0,2*i0],1,1,s);const h=B0,v=h.d;return c([e+v,h.y0,h.z0],[0,0,h.z1-h.z0],[0,h.y1-h.y0,0],2,.8,u),c([e,h.y0,h.z0],[v,0,0],[0,h.y1-h.y0,0],2,.9,y),c([e,h.y0,h.z1],[0,h.y1-h.y0,0],[v,0,0],2,l0,y),c([e,h.y0,h.z1],[v,0,0],[0,0,h.z0-h.z1],2,.94,s),c([e,h.y1,h.z0],[v,0,0],[0,0,h.z1-h.z0],2,l0,s),c([e,L.y0,L.z0],[r0,0,0],[0,L.y1-L.y0,0],3,1,y),c([e,L.y0,L.z1],[0,L.y1-L.y0,0],[r0,0,0],3,1,(b,m,p)=>[b+3.3,m]),c([e,L.y0,L.z1],[r0,0,0],[0,0,L.z0-L.z1],3,1,(b,m,p)=>[b+1.7,p+2]),c([e,L.y1,L.z0],[r0,0,0],[0,0,L.z1-L.z0],3,1,s),c([e,0,j.z0],[r0,0,0],[0,j.y1,0],2,.88,y),c([e,0,j.z1],[0,j.y1,0],[r0,0,0],2,l0,y),c([e,j.y1,j.z0],[r0,0,0],[0,0,j.z1-j.z0],2,.66,s),c([z,0,j.z0],[0,0,j.z1-j.z0],[0,j.y1,0],2,.6,u),t.build()}async function he(o,t,e,z,c){const y=e.clay,s=e.clayD;for(let a=0;a<12;a++){const l=-45.8+a*8.33,r=1.35+.25*z(),w=new n.CylinderGeometry(r,r*(.9+.1*z()),2*i0,14,1,!0);w.rotateX(Math.PI/2),t.add(w,{p:[l,m0-.9,0],c:a%3===1?e.woodD:e.joist,kind:1,uv:(f,P,k,A)=>[k,A*9]})}await o.yield();const h=a=>e.stone.clone().multiplyScalar(a);for(const a of[-1,1]){const l=a<0?L.z0:L.z1;for(let r=0;r<6;r++){const w=(r+(a<0?0:1))%2===0,f=w?5.4:3.6;t.add(N(1.7,3.84,f,.22),{p:[T-.55,L.y0+2+r*4,l+a*f/2],c:h(.94+.07*z()),kind:20})}}{const a=L.z0-6,l=L.z1+6,r=[[T+.3,28],[T-3.6,25.7],[T-3.6,24.3],[T+.3,24.3]],w=[],f=[],P=[];let k=0;const A=(g,x,S,M,V,G,H,_)=>{w.push(...g,...x,...S,...M),P.push(...V,...G,...H,..._),f.push(k,k+1,k+2,k,k+2,k+3),k+=4};for(let g=0;g<3;g++){const x=r[g],S=r[g+1],M=Math.hypot(S[0]-x[0],S[1]-x[1]);A([x[0],x[1],l],[x[0],x[1],a],[S[0],S[1],a],[S[0],S[1],l],[l,0],[a,0],[a,M],[l,M])}A([r[0][0],r[0][1],a],[r[3][0],r[3][1],a],[r[2][0],r[2][1],a],[r[1][0],r[1][1],a],[0,4],[0,0],[4,0],[4,2]),A([r[0][0],r[0][1],l],[r[1][0],r[1][1],l],[r[2][0],r[2][1],l],[r[3][0],r[3][1],l],[0,4],[4,2],[4,0],[0,0]);const D=new n.BufferGeometry;D.setAttribute("position",new n.Float32BufferAttribute(w,3)),D.setAttribute("uv",new n.Float32BufferAttribute(P,2)),D.setIndex(f),D.computeVertexNormals(),t.add(D,{c:h(1.02),kind:20})}t.add(N(2.2,3.4,L.z1-L.z0+13,.35),{p:[T-.7,L.y1+1.7,(L.z0+L.z1)/2],c:e.joist,kind:17});for(let a=0;a<5;a++){const l=new n.CylinderGeometry(1.45,1.45,L.z1-L.z0+2,12,1,!0);l.rotateX(Math.PI/2),t.add(l,{p:[T+2+a*3,L.y1+1.2,(L.z0+L.z1)/2],c:a&1?e.woodD:e.joist,kind:17,uv:(r,w,f,P)=>[f,P*9]})}await o.yield();for(let a=0;a<5;a++){const l=T+4.5+a*1.1+z.range(-.4,.4),r=L.z0+1.2+z.range(0,2),w=r+z.range(8,13);t.add($([l,L.y0+.2+.1*a,r],[l+z.range(-1.6,1.6),L.y0+.22+.1*a,Math.min(w,L.z1-.8)],.16,.1,6),{c:a&1?e.straw:e.yellowD,kind:23})}for(const[a,l,r,w,f]of[[T+9.6,-4.2,T+12.6,2.2,0],[T+12.9,-2.4,T+9.4,3.9,1],[T+7.6,-.8,T+9.2,5.6,2]])t.add($([a,L.y0+.2+.1*f,l],[r,L.y0+.24+.1*f,w],.16,.1,6),{c:f&1?e.straw:e.yellowD,kind:23});for(let a=0;a<7;a++){const l=a/7*t0,r=.34+.2*Math.sin(l),w=.2*Math.cos(l);t.add($([T+5.6+.3*(a%3),L.y0+r,L.z0+1.5+w],[T+13.2-.35*(a%2),L.y0+r+.05,L.z0+2.5+w],.15,.1,6),{c:a%3===0?e.yellowD:e.straw,kind:23})}for(const a of[T+7.6,T+11])t.add(new n.TorusGeometry(.46,.09,6,14),{p:[a,L.y0+.35,L.z0+1.76+(a-T-5.6)*.13],r:[0,Math.PI/2-.13,0],c:e.red,kind:16});for(const[a,l,r,w,f]of[[0,.55,0,.55,e.sandB],[.42,.52,.2,.42,e.straw],[.62,.72,.42,.3,e.sandB],[.6,.92,.6,.19,e.clayD]])t.add(new n.SphereGeometry(w,12,8),{p:[T+9.3+a,L.y0+l*.9,3.6+r],c:f,kind:18,uv:[8,3]});c&&t.add(X([[1.5,0,y],[1.75,.2,s],[1.7,.45,y],[1.85,1.3,e.red],[1.75,1.85,y],[1.35,2.55,s],[1.05,2.9,y],[.8,3,y],[0,3,y]],22,y),{p:[x0[0],L.y0,x0[2]],kind:18}),await o.yield();for(const a of[j.z0-1,j.z1+1])t.add(N(1.8,j.y1+1.5,2.2,.3),{p:[T-.5,(j.y1+1.5)/2,a],c:e.wood,kind:17,uv:(l,r,w)=>[r,w+l]});t.add(N(2.2,3.2,j.z1-j.z0+7,.35),{p:[T-.6,j.y1+1.6,(j.z0+j.z1)/2],c:e.joist,kind:17}),t.add(N(5,.5,j.z1-j.z0,.2),{p:[T+1.8,.1,(j.z0+j.z1)/2],c:h(.97),kind:20});const v=B0,b=(v.z0+v.z1)/2;t.add(N(v.d-.6,.8,v.z1-v.z0,.2),{p:[T+v.d/2,31.4,b],c:e.wood,kind:17,uv:(a,l,r)=>[r,a]}),t.add(N(.9,1,v.z1-v.z0+2.4,.2),{p:[T-.25,v.y0-.5,b],c:e.wood,kind:17});const m=e.clay,p=e.clayD,i=e.red;t.add(X([[1.3,0,p],[1.5,.3,m],[2.5,2.2,i],[2.6,2.9,m],[2.3,4.2,p],[1.2,5.4,m],[1,6.3,m],[1.35,6.9,i],[1.1,6.9,m]],22,m),{p:[T+2.9,v.y0,v.z0+3.4],kind:18}),t.add(new n.TorusGeometry(1.2,.26,6,12,Math.PI),{p:[T+2.3,v.y0+5.2,v.z0+5],r:[0,.9,-Math.PI/2],c:m,kind:18}),t.add(X([[.9,0,i],[1.5,1.8,i],[1.6,3.4,e.linen],[1.5,3.9,i],[.75,6.4,i],[.55,8.6,p],[.85,9.2,i],[.6,9.2,i]],18,i),{p:[T+3.3,v.y0,b+.6],kind:18});for(let a=0;a<4;a++)t.add(X([[0,0,m],[.9,0,m],[2.1,1,a&1?i:m],[2.25,1.25,p],[2,1.25,m],[.8,.25,m],[0,.22,m]],20,m),{p:[T+2.8,v.y0+a*.62,v.z1-3.2],r:[0,a,0],kind:18});await o.yield();const d=31.8;t.add(new n.SphereGeometry(1.5,18,12),{p:[T+2.6,d+1.5,v.z0+2.8],c:e.blue,kind:23,uv:[36,14]}),t.add(N(3.8,.7,4.2,.3),{p:[T+2.8,d+.35,b-.6],c:i,kind:21,uv:(a,l,r)=>[a,r*2.2]}),t.add(N(3.6,.7,4,.3),{p:[T+2.8,d+1.05,b-.5],r:[0,.12,0],c:e.linen,kind:16}),t.add(N(3.4,.6,3.8,.28),{p:[T+2.8,d+1.7,b-.6],r:[0,-.1,0],c:e.blue,kind:16}),t.add(X([[0,0,e.stoneD],[1.2,0,e.stoneD],[1.7,.6,e.stoneD],[1.75,1,e.stoneD],[1.3,1,e.black],[0,.7,e.black]],16,e.stoneD),{p:[T+2.6,d,v.z1-5],kind:20}),t.add(X([[1.5,0,e.yellowD],[1.5,1.6,i],[1.6,1.7,e.yellowD],[1.6,2,e.yellowD],[.3,2.5,i],[.3,2.9,i],[0,2.9,i]],16,e.yellowD),{p:[T+2.8,d,v.z1-2],kind:16})}function me(o){const t=[],e=[],z=[],c=[],u=[];let y=0;const s=(a,l,r,w)=>(t.push(a[0],a[1],a[2]),e.push(l[0],l[1],l[2]),z.push(r.r,r.g,r.b),c.push(w[0],w[1],w[2],0),y++),h=a=>{const l=[[0,.015],[.2,.07],[.45,.17],[.55,.3],[.66,.37],[.76,.3],[.83,.2],[.9,.27],[.955,.21],[1,.05]];let r=0;for(;r<l.length-2&&a>l[r+1][0];)r++;const w=s0((a-l[r][0])/(l[r+1][0]-l[r][0]),0,1);return o0(l[r][1],l[r+1][1],w*w*(3-2*w))},v=34,b=10;for(let a=0;a<=v;a++){const l=a/v,r=-2.2+4*l,w=h(l),f=w*.62,P=f*.72+.04;for(let k=0;k<=b;k++){const A=k/b*t0,D=Math.sin(A),g=Math.cos(A),x=P+(g>0?g*f:g*f*.7),S=g>.25?o.sand:g>-.3?o.sandB:o.linen;s([D*w,x,r],[D,g*1.3,0].map((M,V,G)=>M/Math.hypot(G[0],G[1])),l>.985?o.sandB:S,[0,l,0])}}for(let a=0;a<v;a++)for(let l=0;l<b;l++){const r=a*(b+1)+l,w=r+1,f=r+b+1,P=f+1;u.push(r,w,f,w,P,f)}const m=(a,l,r)=>{const w=a.attributes.position,f=a.attributes.normal,P=y;for(let k=0;k<w.count;k++)s([w.getX(k),w.getY(k),w.getZ(k)],[f.getX(k),f.getY(k),f.getZ(k)],l,r);if(a.index)for(let k=0;k<a.index.count;k++)u.push(P+a.index.getX(k));else for(let k=0;k<w.count;k++)u.push(P+k);a.dispose()};for(const a of[-1,1]){const l=new n.SphereGeometry(.06,8,6);l.translate(a*.2,.3,1.42),m(l,o.black,[0,.9,0])}const p=[[.57,1,0],[.57,-1,Math.PI],[.775,1,Math.PI],[.775,-1,0]];for(const[a,l,r]of p){const w=-2.2+4*a,f=h(a),P=a<.6,k=[1,a,r],A=[l*f*.8,.2,w],D=[l*(f+.36),.3,w+(P?-.12:.16)],g=[l*(f+.52),.05,w+(P?.14:.36)];m($(A,D,.12,.09,6),o.sand,k),m($(D,g,.09,.06,6),o.sand,k);for(let x=0;x<4;x++){const S=(P?.5:.1)+(x-1.5)*.42,M=(P?.34:.26)*(x===2?1.25:1);m($(g,[g[0]+l*Math.sin(S+.5)*M,.03,g[2]+Math.cos(S+.5)*M],.045,.025,4),o.sandB,k)}}const i=y;for(let a=0;a<=v;a++){const l=a/v,r=-2.2+4*l,w=h(l)*1.25+.03;s([-w-.2,.03,r-.06],[0,1,0],o.black,[2,l,0]),s([w-.12,.03,r-.06],[0,1,0],o.black,[2,l,0])}for(let a=0;a<v;a++){const l=i+a*2;u.push(l,l+2,l+1,l+1,l+2,l+3)}const d=new n.BufferGeometry;return d.setAttribute("position",new n.Float32BufferAttribute(t,3)),d.setAttribute("normal",new n.Float32BufferAttribute(e,3)),d.setAttribute("aC",new n.Float32BufferAttribute(z,3)),d.setAttribute("aL",new n.Float32BufferAttribute(c,4)),d.setIndex(u),d}const ye=`
attribute vec3 aC; attribute vec4 aL;
uniform float uHead, uTurn, uTime, uShadow, uCrouch;
varying vec3 vC, vN; varying float vPart;
void main(){
  vec3 p = position, n = normal;
  float head = step(0.5, aL.x) * step(aL.x, 1.5), tail = step(1.5, aL.x) * step(aL.x, 2.5);
  // the head turns and lifts about the neck
  vec3 pivot = vec3(0.0, 1.25, 0.5);
  float cy = cos(uTurn * head), sy = sin(uTurn * head), cp = cos(uHead * head), sp = sin(uHead * head);
  vec3 d = p - pivot;
  d = vec3(d.x * cy + d.z * sy, d.y, -d.x * sy + d.z * cy);
  d = vec3(d.x, d.y * cp + d.z * sp, -d.y * sp + d.z * cp);
  n = vec3(n.x * cy + n.z * sy, n.y, -n.x * sy + n.z * cy);
  n = vec3(n.x, n.y * cp + n.z * sp, -n.y * sp + n.z * cp);
  p = pivot + d;
  // the tail flicks, the breast breathes, the whole bird dips before a hop
  float tw = smoothstep(-0.9, -2.2, p.z) * tail;
  p.y += tw * (0.22 * sin(uTime * 4.3) * smoothstep(0.2, 1.0, sin(uTime * 0.9)) + 0.25 * uCrouch);
  p.x *= 1.0 + 0.035 * sin(uTime * 5.0) * (1.0 - head) * (1.0 - tail) * step(0.45, p.y);
  p.y -= 0.16 * uCrouch * step(0.35, p.y) * step(aL.x, 2.5);
  if (aL.x > 2.5) p = vec3(p.x, 0.03, p.z) * step(0.5, uShadow);
  vC = aC; vPart = aL.x;
  vN = normalize(mat3(modelMatrix) * n);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`,we=`
uniform vec3 uLdir, uGround;
uniform float uLitAll;
varying vec3 vC, vN; varying float vPart;
void main(){
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  float ndl = dot(N, uLdir) - 0.05;
  float lit = clamp(ndl / max(fwidth(ndl), 1e-4) + 0.5, 0.0, 1.0) * uLitAll;
  vec3 col = vC * mix(${l0.toFixed(2)}, 1.0, lit);
  col = mix(col, uGround, step(2.5, vPart));
  gl_FragColor = vec4(col, 1.0);
}
`;function ve(o){const t=[],e=[],z=[],c=[],u=[];let y=0;const s=new n.Vector3,h=new n.Vector3,v=new n.Matrix4,b=new n.Matrix3,m=new n.Euler,p=new n.Quaternion,i=new n.Vector3,d=(g,x,S,M,V=[0,0,0],G=[1,1,1])=>{const H=g.attributes.position,_=g.attributes.normal,a0=y;p.setFromEuler(m.set(V[0],V[1],V[2])),v.compose(s.set(M[0],M[1],M[2]),p,i.set(G[0],G[1],G[2])),b.getNormalMatrix(v);for(let Y=0;Y<H.count;Y++){s.fromBufferAttribute(H,Y);const O=S.isColor?S:S(s.x,s.y,s.z);s.applyMatrix4(v),h.fromBufferAttribute(_,Y).applyMatrix3(b).normalize(),t.push(s.x,s.y,s.z),e.push(h.x,h.y,h.z),z.push(O.r,O.g,O.b),c.push(x,0,0,0),y++}if(g.index)for(let Y=0;Y<g.index.count;Y++)u.push(a0+g.index.getX(Y));else for(let Y=0;Y<H.count;Y++)u.push(a0+Y);g.dispose()},a=R(o.wood,o.black,.12),l=R(o.woodD,o.black,.35),r=R(o.plaster,o.black,.12),w=o.sand,f=R(o.black,o.plaster,.5),P=R(o.plaster,o.black,.06),k=R(o.red,o.black,.35),A=o.black;d(new n.SphereGeometry(1,20,14),0,(g,x,S)=>x>.25?Math.abs(((g*2.6+.5)%1+1)%1-.5)<.16&&S<.55?l:a:x>-.2?w:r,[0,.98,-.05],[-.32,0,0],[.64,.6,1.05]);for(const g of[-1,1])d(new n.SphereGeometry(1,12,10),0,(x,S,M)=>M>.3&&M<.5?P:M>.5?k:l,[g*.56,1.08,-.3],[-.42,0,g*.12],[.15,.4,.86]);{const g=new n.BoxGeometry(.5,.09,1.35,1,1,3),x=g.attributes.position;for(let S=0;S<x.count;S++)x.setX(S,x.getX(S)*(1.25-.5*(x.getZ(S)/1.35+.5)));g.computeVertexNormals(),d(g,2,l,[0,.98,-1.55],[.12,0,0])}d(new n.SphereGeometry(.47,18,14),1,(g,x,S)=>x>.2?S<-.05&&Math.abs(g)>.12?k:f:S>.2&&x<-.12&&Math.abs(g)<.3?A:Math.abs(g)>.3&&S<.05&&x>-.05?k:P,[0,1.52,.7]);for(const g of[-1,1])d(new n.SphereGeometry(.07,8,6),1,A,[g*.37,1.6,.93]);{const g=new n.ConeGeometry(.17,.44,8);g.rotateX(Math.PI/2),d(g,1,R(o.black,o.yellowD,.3),[0,1.47,1.3])}d(new n.SphereGeometry(1,10,8),0,A,[0,1.12,.72],[0,0,0],[.3,.34,.2]);for(const g of[-1,1]){const x=[g*.26,.04,.16];d($([g*.22,.56,.02],x,.05,.045,6),0,k,[0,0,0]);for(const S of[-.5,0,.5])d($(x,[x[0]+Math.sin(S)*.36,.03,x[2]+Math.cos(S)*.36],.04,.025,4),0,k,[0,0,0]);d($(x,[x[0],.03,x[2]-.26],.04,.025,4),0,k,[0,0,0])}{const g=new n.CircleGeometry(1,18);g.rotateX(-Math.PI/2),d(g,3,A,[-.25,.03,-.25],[0,0,0],[.8,1,1.5])}const D=new n.BufferGeometry;return D.setAttribute("position",new n.Float32BufferAttribute(t,3)),D.setAttribute("normal",new n.Float32BufferAttribute(e,3)),D.setAttribute("aC",new n.Float32BufferAttribute(z,3)),D.setAttribute("aL",new n.Float32BufferAttribute(c,4)),D.setIndex(u),D}var ze={id:"room-of-swallows",name:"The Room of Swallows",category:"domestic",weirdness:.35,media:["tiny","interior"],async build(o){const t=o.rng,e=o.vary||{},z=o.quality?.detail??1,c=Math.abs(Math.floor(Number(o.seed)||0));let u=lt[c%5%3];e.hour==="day"?u="noon":(e.hour==="dawn"||e.hour==="golden")&&u==="noon"&&(u="spring");const y=!!e.rare,s=c%7%4===0,h=e.hour==="night";h&&u==="noon"&&(u="spring");const v=u==="noon"?"blue":["yellow","blue","red"][c%3],b=u==="noon"?"papyrus":c%2===0?"white":"red",p=["jar","strainer","baskets"][(lt.indexOf(u)+(c%2===0?1:0))%3],i=Et.slice();h?(i[0]="#CDD0D0",i[1]="#F3F3EC",i[6]="#2F4C77"):u==="noon"?(i[0]="#E9E9E3",i[1]="#FDFDF7",i[6]="#A0C6E6"):u==="unfinished"&&(i[0]="#F0E7D4",i[1]="#FFFAEA",i[6]="#B2CDDD");const[d,a,l,r,w,f,P]=i.map(q=>new n.Color(q)),k=R(r,l,.45),A={plaster:d,plasterSun:a,red:l,blue:w,black:R(f,d,.05),yellowD:R(r,f,.14),straw:R(r,d,.5),wood:R(k,f,.24),woodD:R(k,f,.52),joist:R(k,f,.4),hide:R(R(r,d,.55),l,.1),hideB:R(R(r,d,.72),l,.06),linen:R(d,a,.4),clay:R(R(r,d,.55),l,.1),clayD:R(l,f,.45),fig:R(f,l,.3),figB:R(f,w,.42),stone:R(R(d,f,.13),w,.03),stoneD:R(d,f,.42),sand:R(R(r,d,.42),f,.16),sandB:R(r,d,.66),yellow:r,ochre:R(r,d,.22),flameA:new n.Color("#FFD45E"),flameB:R(r,l,.45),flameR:R(l,r,.15)};await o.yield();const D=Nt([[0,7],[146,7],[212,29.5],[266,32.5],[301,37]]),g=Wt(D);await o.yield();const x=await jt(o,{palette:i,look:u,cast:v,lily:b,rare:y,density:e.density,demo:!1,path:g}),S=x.anchors,M=x.uniforms,V=x.glsl;await o.yield();const G=new n.Scene;G.background=P.clone();const H=new n.Group;G.add(H),H.add(x.object);const _={value:0},a0={value:0},Y={value:new n.Vector3(.55,.56,-.62).normalize()},O={value:new n.Vector3(-.45,.55,.7).normalize()},d0={uSunDir:M.uSunDir,uWinIn:M.uWinIn,uWinOut:M.uWinOut,uWinHalf:M.uWinHalf},I=q=>({value:q}),Z={slabs:[],tapers:[]},J=ct(),b0=t.fork("furniture");await ne(o,J,A,Z),await o.yield(),se(J,A,Z,p),await o.yield(),ie(J,A,Z,b0),await o.yield(),await le(o,J,A,Z,b0),await o.yield(),await he(o,J,A,b0,s),await o.yield();const yt=b0.fork("lived-in");ft(J,A,17.5,42,23.2,35.8,{stripes:6,cols:[A.blue,A.red],edge:A.blue,end:A.red}),ft(J,A,6.5,25.5,-24.5,-7,{stripes:5,cols:[A.red,A.yellowD],c:A.sandB}),await o.yield(),await de(o,J,A,Z),await o.yield(),await ce(o,J,A,Z),await o.yield(),ht(J,A,Z,.8,15.6),await o.yield(),ht(J,A,Z,-10.5,-10.5),pt(J,A,[T+2.6,32.75,B0.z1-5],1),await o.yield(),ue(J,A,Z,yt),await o.yield(),fe(J,A,Z),await o.yield();const Y0=Bt(Z.slabs,Z.tapers);await o.yield();const wt=new n.ShaderMaterial({uniforms:{...d0,uGustT:M.uGustT,uTime:_,uShake:a0,uKey:Y,uKey2:O,uPlaster:I(d),uPlasterSun:M.uPlasterSun,uRed:I(l),uBlue:I(w),uFlame:I(new n.Color("#FFE9A0"))},vertexShader:Qt(V),fragmentShader:Yt(V,Y0),side:n.DoubleSide}),L0=new n.Mesh(J.build(),wt);L0.name="real-things",L0.frustumCulled=!1,H.add(L0),await o.yield();const vt=new n.ShaderMaterial({uniforms:{...d0,uTime:_,uKey:Y,uPlaster:I(d),uPlasterSun:M.uPlasterSun,uJoint:I(R(d,f,.1)),uSlateA:I(R(R(f,d,.36),w,.3)),uSlateB:I(R(f,d,.46)),uSlateC:I(R(R(r,d,.5),f,.34)),uSlateD:I(R(R(l,d,.45),f,.36)),uBlue:I(w),uInk:I(R(f,d,.06)),uRed:I(l),uStone:I(A.stone),uReedA:I(R(r,d,.42)),uReedB:I(R(r,d,.6)),uReedC:I(R(r,f,.32))},vertexShader:_t,fragmentShader:Xt(V,Y0)}),T0=new n.Mesh(pe(A),vt);T0.name="shell",T0.frustumCulled=!1,H.add(T0),await o.yield();const z0=200,k0=18,w0=new n.InstancedBufferGeometry;{const q=[],F=[];for(let E=0;E<=k0;E++)q.push(-.5,E/k0,0,.5,E/k0,0);for(let E=0;E<k0;E++){const Q=E*2;F.push(Q,Q+1,Q+2,Q+1,Q+3,Q+2)}w0.setAttribute("position",new n.Float32BufferAttribute(q,3)),w0.setIndex(F);const B=new Float32Array(z0*4),W=t.fork("reeds");for(let E=0;E<z0;E++)B[E*4]=j.z0+(E+.5)*(j.z1-j.z0)/z0,B[E*4+1]=W(),B[E*4+2]=W(),B[E*4+3]=j.y1-.6-W()*.9;w0.setAttribute("iA",new n.InstancedBufferAttribute(B,4)),w0.instanceCount=z0}const K0=new n.ShaderMaterial({uniforms:{uGustT:M.uGustT,uTime:_,uShake:a0,uShow:{value:1},uStraw:I(R(r,d,.38)),uStrawB:I(R(r,d,.58)),uRed:I(l),uBlue:I(w),uDark:I(A.woodD)},vertexShader:Kt(V),fragmentShader:Ut,side:n.DoubleSide}),R0=new n.Mesh(w0,K0);R0.name="reed-curtain",R0.frustumCulled=!1,H.add(R0),await o.yield();const I0=s?1.9:1.3,e0={uRun:{value:0},uPhase:{value:0},uHead:{value:0},uTurn:{value:0},uTime:_,uShadow:{value:1},uLitAll:{value:1},uCrouch:{value:0},uLdir:{value:new n.Vector3},uDark:I(R(f,k,.25)),uPale:I(A.sandB),uGround:I(A.stone.clone().multiplyScalar(1.02*l0))},p0=new n.Mesh(s?ve(A):me(A),new n.ShaderMaterial({uniforms:e0,vertexShader:s?ye:Ot,fragmentShader:s?we:Zt,side:n.DoubleSide}));p0.name=s?"sparrow":"lizard",p0.frustumCulled=!1,p0.matrixAutoUpdate=!1,H.add(p0);const xt=new n.Vector3(-2.3,3.9,0).normalize(),U0=new n.Vector3(0,0,1),bt=new n.Vector3(0,0,-1),zt=new n.Vector3(-.22,.97,0).normalize(),kt=new n.Vector3(0,1,0),gt=new n.Vector3(-.8,0,-.6).normalize(),q0=new n.Vector3,O0=new n.Vector3,At=new n.Vector3(I0,I0,I0),U={run0:.488,run1:.54,z0:-3.5,z1:9.5,swap:.66},g0=6,V0={f:0},Z0=(q,F)=>{if(s){if(q>=U.swap)return F.set(x0[0],L.y0+x0[1],x0[2]);const B=s0((q-U.run0)/(U.run1-U.run0),0,1)*g0,W=Math.min(g0-1,Math.floor(B)),E=B-W,Q=K(.25,.75,E);return V0.f=B>0&&B<g0?E:0,F.set(T+1.9,L.y0+.8*Math.sin(Math.PI*Q),o0(-5,6,(W+Q)/g0))}if(q<U.swap){const B=K(U.run0,U.run1,q);return F.set(T-1.65,26.85,o0(U.z0,U.z1,B))}return F.set(T+5.5,37.6,L.z1-.02)},J0=q=>{const F=q<U.swap,B=s?kt:F?xt:bt,W=s?F?U0:gt:F?U0:zt;Z0(q,q0),O0.crossVectors(B,W),p0.matrix.makeBasis(O0,B,W).scale(At).setPosition(q0),p0.matrixWorldNeedsUpdate=!0,s?e0.uLdir.value.set(.7,.62,-.3).normalize():F?e0.uLdir.value.set(.55,.75,.35).normalize():e0.uLdir.value.set(.8,.5,-.33).normalize(),e0.uShadow.value=F?1:0};J0(0),await o.yield();const C=t.fork("dust"),A0=Math.round(4200*z*s0(e.density??1,.7,1.3)),G0=y?Math.round(3*1700*Math.max(.7,z)):0,c0=new Float32Array((A0+G0)*3),n0=new Float32Array((A0+G0)*4);for(let q=0;q<A0;q++){const F=C()<.45,B=C();let W=C.range(-1,1),E=C.range(-1,1);if(F){const rt=1-.07*B*B;C()<.5?W=(W<0?-1:1)*rt:E=(E<0?-1:1)*rt}const Q=C();c0[q*3]=1-Q*Q*.78,c0[q*3+1]=(L.y0+L.y1)/2+W*(L.y1-L.y0)/2,c0[q*3+2]=(L.z0+L.z1)/2+E*(L.z1-L.z0)/2,n0[q*4]=C(),n0[q*4+1]=F?C.range(.028,.055):C.range(.03,.085),n0[q*4+2]=C.range(.12,.4),n0[q*4+3]=F?.3:0,(q&255)===0&&await o.yield()}const Mt=[[20.83,-12,-7],[12.5,12,17],[4.17,-2.5,2.5]];for(let q=0;q<G0;q++){const F=A0+q,B=Mt[q%3];c0[F*3]=B[0]+C.range(-.2,.2),c0[F*3+1]=m0-2.4,c0[F*3+2]=C.range(B[1],B[2]),n0[F*4]=C(),n0[F*4+1]=C.range(.05,.11),n0[F*4+2]=C(),n0[F*4+3]=1,(q&255)===0&&await o.yield()}const H0=new n.BufferGeometry;H0.setAttribute("position",new n.BufferAttribute(c0,3)),H0.setAttribute("aS",new n.BufferAttribute(n0,4));const M0={...d0,uTime:_,uPx:{value:450},uFall:{value:0},uFallA:{value:0},uSunCol:M.uPlasterSun,uShadeCol:I(d),uSiftCol:I(R(R(d,r,.35),f,.42))},S0=new n.Points(H0,new n.ShaderMaterial({uniforms:M0,vertexShader:Jt(V),fragmentShader:Ct,transparent:!0,depthWrite:!1}));S0.name="dust",S0.frustumCulled=!1,S0.renderOrder=4,H.add(S0),await o.yield();const C0=new n.BoxGeometry(2*T,m0,2*i0);C0.translate(0,m0/2,0);const tt={uSunDir:M.uSunDir,uWinIn:M.uWinIn,uWinHalf:M.uWinHalf,uRoot:{value:H.position},uBeamK:{value:0},uBeamCol:I(h?new n.Color(.8,.86,.95):new n.Color(1,.9,.6))},St=h?.24:.36,P0=new n.Mesh(C0,new n.ShaderMaterial({uniforms:tt,vertexShader:te,fragmentShader:ee,side:n.BackSide,transparent:!0,depthWrite:!1,depthTest:!1}));P0.name="sun-shaft",P0.frustumCulled=!1,P0.renderOrder=2,H.add(P0),await o.yield();const W0=new n.PlaneGeometry(2400,1800);W0.rotateY(-Math.PI/2),W0.translate(T+330,40,0);const Pt={uTime:_,uHaze:I(P),uSea:I(R(P,w,.48)),uRim:I(R(P,a,.42)),uGlint:I(a),uHazeB:I(R(P,a,.3))},j0=new n.Mesh(W0,new n.ShaderMaterial({uniforms:Pt,vertexShader:ae,fragmentShader:oe(V)}));j0.name="sea-haze",j0.frustumCulled=!1,G.add(j0),await o.yield();const Ft=S.kiss.position.clone(),Dt=S.heroNest[0].clone().add(S.heroNest[1]).multiplyScalar(.5),Lt=new n.Vector3,et=new n.Vector3,N0=new n.Vector3,u0=new n.Vector3,F0=new n.Vector3,E0=new n.Vector3,Tt=S.portalSeat.position,v0=new n.Vector3,ot=new n.Vector3,Rt=new n.Vector3(f0.x-6,4,f0.z-4),It=S.kiss.u0,qt=S.kiss.u1,D0=u!=="noon",at=S.pairs[0].meet,$0=S.pairs[1].meet,Vt=new n.Vector3(10.5,48,7),nt=[{at:[-36,25,29.5],from:.03,to:.14,weight:.4,fade:.355},{at:()=>et.copy(at).setY(at.y-7),from:.1,to:.215,weight:.86,fade:.33},{at:(q,F)=>et.set($0.x+3.5,$0.y-4.5,$0.z-2).lerp(ot.set(-16,15,-42.5),K(.258,.3,F)),from:.185,to:.32,weight:.82,fade:.26},{at:(q,F)=>(D0?x.sunShapeAt(u0):u0.copy(Dt),u0.x=s0(u0.x,-4,22),u0.y=s0(u0.y,12,20),x.pairAt(F,F0),F0.y=Math.min(F0.y,g.pointAt(F,Lt).y+9),u0.lerp(F0,K(D0?.378:.35,D0?.408:.38,F))),from:.295,to:.425,weight:D0?.72:.6,fade:.39},{at:Vt,from:.398,to:.475,weight:.92,fade:.3},{at:(q,F)=>(Z0(F,N0),N0.set(T+2,31.5,-6.5+.2*(N0.z-3)-15*K(.515,.56,F))),from:.45,to:.578,weight:y?.12:.9},{at:(q,F)=>v0.set(-11,16,-5.5).lerp(Rt,K(.618,.672,F)),from:.555,to:.665,weight:.55,fade:.46},{at:(q,F)=>{x.ribbonAt(F,110,v0);const B=K(.69,.75,F);return v0.lerp(ot.set(4,30,3),B),v0.y+=2.5*(1-B),v0},from:.612,to:.78,weight:.8,fade:.25},{at:(q,F)=>(F>It?x.pairAt(Math.min(F,qt),E0):E0.copy(Ft),E0.lerp(Tt,K(.812,.836,F))),from:.69,to:.9,weight:.7}];y&&nt.push({at:[-12,32,2],from:.43,to:.6,weight:.86,fade:.2});const h0=S.pace,Gt=q=>{let F=0;for(;F<h0.length-2&&q>h0[F+1][0];)F++;return o0(h0[F][1],h0[F+1][1],K(h0[F][0],h0[F+1][0],q))},st=new n.Vector2,it=new n.Vector3,Ht=q=>1-Math.abs((q%2+2)%2-1);return{scene:G,path:g,duration:dt,pace:Gt,camera:{fov:60,near:.3,far:3e3,lookAhead:14,sway:.5,bank:0},pois:nt,portal:{shape:"circle",radius:S.portalSeat.radius,color:i[6],glow:.25,revealDistance:230},post:{flat:1,exposure:1,bloom:{strength:0,radius:.1,threshold:1},grade:{saturation:1,contrast:1,vignette:0,grain:0,aberration:0}},ride:"none",style:"none",companion:"none",update(q,F,B,W){_.value=F,x.setProgress(W),x.update(q,F,B),o.renderer.getDrawingBufferSize(st),M0.uPx.value=st.y,Y.value.set(.55,.56-.07*Ht(F/40),-.62).normalize(),tt.uBeamK.value=St*(1-.6*K(.355,.39,W)*(1-K(.46,.5,W)))*(1-K(.63,.69,W)),it.setFromMatrixPosition(B.matrixWorld),K0.uniforms.uShow.value=it.x<T+1.5?1:0,J0(W);const E=W<U.swap?K(.455,.485,W):K(.885,.93,W);if(s){const Q=Math.sin(F*1.15+.6*Math.sin(F*.37));e0.uHead.value=.08+.34*E+.1*Math.sin(F*.8),e0.uTurn.value=.75*Math.sign(Q)*Math.pow(Math.abs(Q),.22)*(1-.5*E)-(W<U.swap?.5:.15)*E,e0.uCrouch.value=K(0,.18,V0.f)*(1-K(.22,.34,V0.f))}else{const Q=W<U.swap?K(U.run0,U.run0+.006,W)*(1-K(U.run1-.008,U.run1,W)):0;e0.uRun.value=Q,e0.uPhase.value=(q0.z-U.z0)*7.5,e0.uHead.value=.12+.05*Math.sin(F*.7)+.5*E*(1-.6*Q),e0.uTurn.value=W<U.swap?.35*K(U.run1,U.run1+.02,W)*Math.sin(F*1.3)-.25*E*(1-Q):-.3*E+.1*Math.sin(F*.9)}if(y){const Q=K(.44,.452,W)*(1-K(.468,.5,W));a0.value=Q,H.position.set(Math.sin(F*31)*.16*Q,Math.sin(F*27+1)*.1*Q,Math.sin(F*23+2)*.16*Q),M0.uFall.value=Math.max(0,W-.443)*dt,M0.uFallA.value=K(.443,.45,W)*(1-K(.6,.64,W))}},dispose(){x.dispose()}}}};export{ze as default};
