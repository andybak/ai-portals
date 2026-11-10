import*as D from"three";import{clamp as yt,lerp as pt,smoothstep as Vt}from"../kit/core.js";const re=["#CFE4F2","#8FB7A5","#2E5D73","#F3B8A0","#E8935E","#5B4A7A","#E9C24A"],ht=Math.PI*2,Xt=`
float h11(float n){ return fract(sin(n*127.1)*43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float vn2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
float fb2(vec2 p){ return vn2(p)*.55 + vn2(p*2.13+7.1)*.3 + vn2(p*4.7+3.3)*.15; }
`,Zt=`
uniform float uTime, uSwing4;      // seconds; uSwing4 = seconds since the last touch (0..4)
uniform vec4 uBarge;               // x, z, amount, heading sign
uniform vec3 uSkyPeach, uSkyRose, uSkyViolet, uSunL;   // uSunL: lower sun dir, upright frame
uniform vec4 uRings[8];            // little rings (fish, swallows, the dive): x, z (local), age s, amplitude m
uniform vec4 uWakes[3];            // ferry wakes under the empty punts: x, z, heading rad, amount
uniform float uRain;               // sun-shower: a field of small rings, 0..1
uniform vec2 uCamL;                // the eye, in the city's own plan (rain rings fade with distance)
uniform vec3 uBarA, uBarB, uSunGlow;   // lower sky: cloud bar colours (low, high), sun glow colour
uniform vec4 uMoon;                // lower sky: thin moon direction (upright frame, unit) and strength
uniform vec4 uPGlow;               // the portal's glow: world position and amount
`,Wt=`
vec3 ripple(vec2 p){
  float r = length(p); vec2 dir = p / max(r, 1e-3);
  const float SPD = 17., SPC = 68., LAM = 7.0, WID = 6.0;
  float x = r - SPD*(uSwing4 + .55);      // the bulge the bob pushes ahead of it: a ring already round the finial as it touches
  float k = floor(x/SPC + .5);
  float xr = x - k*SPC, Rk = r - xr;
  float amp = .17 * smoothstep(1., 10., Rk) * exp(-Rk/420.) / sqrt(1. + Rk/45.);
  float ph = 6.2832*xr/LAM, g = exp(-(xr*xr)/(WID*WID));
  float h = amp*cos(ph)*g;
  float dr = amp*g*(-(6.2832/LAM)*sin(ph) - 2.*xr/(WID*WID)*cos(ph));
  vec2 s = dir*dr;
  // two swell octaves
  vec2 d1 = vec2(.83,.56), d2 = vec2(-.42,.91);
  float a1 = dot(p,d1)*.19 + uTime*.8, a2 = dot(p,d2)*.43 - uTime*1.25;
  h += .035*sin(a1) + .018*sin(a2);
  s += d1*(.035*.19*cos(a1)) + d2*(.018*.43*cos(a2));
  // V-wake of the barge that is not there
  vec2 q = p - uBarge.xy; float back = clamp(-q.y*uBarge.w, -10., 400.);
  float arm = clamp(abs(q.x) - back*.36 - .8, -30., 30.);
  float wv = uBarge.z * smoothstep(0., 4., back) * exp(-back/70.) * exp(-arm*arm/3.2);
  h += .14*wv*cos(arm*2.1);
  s.x += sign(q.x)*wv*(-.14*2.1*sin(arm*2.1) - .14*arm/1.6*cos(arm*2.1));
  for (int i = 0; i < 8; i++) {      // small rings
    vec4 rg = uRings[i];
    vec2 q1 = p - rg.xy; float r1 = length(q1);
    float x1 = r1 - 3.4*rg.z;
    float e1 = rg.w * exp(-(x1*x1)/2.6) * smoothstep(0., .7, r1);
    float p1 = x1*4.4;
    h += e1*cos(p1);
    s += q1/max(r1, 1e-3) * (e1*(-4.4*sin(p1) - (x1/1.3)*cos(p1)));
  }
  for (int i = 0; i < 3; i++) {      // ferry wakes
    vec4 wk = uWakes[i];
    vec2 q2 = p - wk.xy; float c2 = cos(wk.z), s2 = sin(wk.z);
    vec2 rt = vec2(c2, -s2);
    float bk = clamp(-dot(q2, vec2(s2, c2)), -10., 300.), lat = dot(q2, rt);
    float ar = clamp(abs(lat) - bk*.3 - .9, -30., 30.);
    float w2 = wk.w * smoothstep(0., 4., bk) * exp(-bk/42.) * exp(-ar*ar/2.4);
    h += .1*w2*cos(ar*2.4);
    s += rt * (sign(lat)*w2*(-.24*sin(ar*2.4) - .083*ar*cos(ar*2.4)));
  }
  float rainK = uRain * (1. - smoothstep(40., 150., length(p - uCamL)));
  if (rainK > 0.) {                  // a sun-shower's rings
    vec2 g = p*.26, gc = floor(g), gf = fract(g) - .5;
    float hh = fract(sin(dot(gc, vec2(127.1, 311.7)))*43758.5453), h2 = fract(hh*57.31);
    float tt = fract(uTime*.55 + hh);
    vec2 dd = gf - (vec2(h2, fract(h2*13.7)) - .5)*.44; float rr = length(dd);
    float xx = rr - tt*.42;
    float ee = rainK * exp(-xx*xx*110.) * (1. - tt) * step(.25, hh);
    h += .011*ee*cos(xx*42.);
    s += dd/max(rr, 1e-3) * (ee*(-.011*42.*.26*sin(xx*42.)));
  }
  return vec3(h, s);
}
`,_t=`
// the gradient and the low sun only (haze and window glass use this)
vec3 lowerSkyG(vec3 r){
  float h = clamp(r.y, 0., 1.);
  vec3 c = mix(uSkyPeach*.92, uSkyRose*.74, smoothstep(0., .17, h));
  c = mix(c, uSkyViolet*.95, smoothstep(.09, .58, h));
  c = mix(c, uSkyViolet*.62, smoothstep(.5, 1., h));
  float sd = max(dot(r, uSunL), 0.);
  float s2 = sd*sd, s8 = s2*s2*s2*s2;
  c += uSunGlow * (s8*.3 + s8*s8*s8*s8*.7);
  return c;
}
// one deck of long cloud bars on a plane: lit on the edge that faces the low sun, shaded on the other
vec4 lsDeck(vec3 r, float h, float plane, float freq, float lo, vec2 drift, vec2 sdir){
  vec2 q = r.xz / (h + plane) * freq;
  vec2 st = vec2(.4, 2.8);
  float n0 = fb2(q*st + drift);
  float n1 = fb2((q + sdir*.34)*st + drift);
  float d = smoothstep(lo, lo + .1, n0);
  float lit = clamp((n0 - n1)*8. - .3, 0., 1.);    // (inside a bar n0 > n1 on average, hence the offset)
  float thin = d*(1. - d)*4.;
  vec3 col = mix(uBarB, uBarA, lit) + uBarA*thin*.35;
  return vec4(col, d);
}
vec3 lowerSky(vec3 r){
  vec3 c = lowerSkyG(r);
  float h = clamp(r.y, 0., 1.);
  vec2 sdir = uSunL.xz / max(length(uSunL.xz), 1e-3);
  vec3 air = c;
  // far deck: thin streaks low on the horizon, half melted into the air
  vec4 k0 = lsDeck(r, h, .06, 2.6, .55, vec2(uTime*.002, 3.7), sdir);
  c = mix(c, mix(air, k0.rgb, .62), k0.a * smoothstep(.012, .05, h) * (1. - smoothstep(.22, .42, h)) * .85);
  // middle deck: the long bars
  vec4 k1 = lsDeck(r, h, .2, 1.25, .57, vec2(uTime*.0045, 0.), sdir);
  c = mix(c, mix(air, k1.rgb, .86), k1.a * smoothstep(.03, .11, h) * (1. - smoothstep(.7, .97, h)) * .92);
  // near deck: big soft bars high up (deep down under the lens), drifting faster
  vec4 k2 = lsDeck(r, h, .5, 1.5, .61, vec2(uTime*.009, 8.3), sdir);
  c = mix(c, k2.rgb*vec3(.92,.9,1.), k2.a * smoothstep(.16, .36, h) * .8);
  float dm = distance(r, uMoon.xyz);
  float crescent = (1. - smoothstep(.024, .03, dm)) * smoothstep(.022, .03, distance(r, uMoon.xyz + vec3(.011, .005, 0.)));
  c += vec3(1., .96, .84) * (crescent*1.8 + .05*exp(-dm*dm*90.)) * uMoon.w;
  return c;
}
`,nt=t=>{const o=new D.Color(t);return[o.r,o.g,o.b]},F=(t,o,a)=>[t[0]+(o[0]-t[0])*a,t[1]+(o[1]-t[1])*a,t[2]+(o[2]-t[2])*a],R=(t,o)=>[t[0]*o,t[1]*o,t[2]*o],Yt=(t,o)=>{const a=t[0]*.3+t[1]*.55+t[2]*.15;return[Math.max(0,a+(t[0]-a)*o),Math.max(0,a+(t[1]-a)*o),Math.max(0,a+(t[2]-a)*o)]},p={PLAIN:0,FACADE:1,ROOF:2,STONE:3,VERDI:4,GOLD:5,LAMP:6,BRONZE:7,CLOCK:8,DARK:9,BALUS:10,POLE:11,CLOTH:12,CAP:13,FAR:14,GLASS:15};class qt{constructor(){this.p=[],this.n=[],this.c=[],this.u=[],this.d=[],this.i=[],this.nv=0,this.ox=0,this.oy=0,this.oz=0,this.ca=1,this.sa=0}frame(o=0,a=0,s=0,c=0){return this.ox=o,this.oy=a,this.oz=s,this.ca=Math.cos(c),this.sa=Math.sin(c),this}v(o,a,s,c,e,n,k,r,i,f){const w=this.ca,h=this.sa;return this.p.push(this.ox+o*w+s*h,this.oy+a,this.oz-o*h+s*w),this.n.push(c*w+n*h,e,-c*h+n*w),this.c.push(k[0],k[1],k[2]),this.u.push(r,i),this.d.push(f[0],f[1],f[2]||0,f[3]||0),this.nv++}quad(o,a,s,c,e,n,k,r){if(n[0]===p.CAP&&this.sink){const C=this.sink;return C.ox=this.ox,C.oy=this.oy,C.oz=this.oz,C.ca=this.ca,C.sa=this.sa,C.quad(o,a,s,c,e,[p.CAP,n[1],Math.hypot(a[0]-o[0],a[2]-o[2]),Math.hypot(c[0]-o[0],c[2]-o[2])],[[0,0],[1,0],[1,1],[0,1]],r)}const i=a[0]-o[0],f=a[1]-o[1],w=a[2]-o[2],h=c[0]-o[0],d=c[1]-o[1],u=c[2]-o[2];let x=f*u-w*d,l=w*h-i*u,v=i*d-f*h;const y=Math.hypot(x,l,v)||1;x/=y,l/=y,v/=y;const b=k||[[0,0],[1,0],[1,1],[0,1]],A=r||e,P=this.v(o[0],o[1],o[2],x,l,v,e,b[0][0],b[0][1],n),q=this.v(a[0],a[1],a[2],x,l,v,e,b[1][0],b[1][1],n),E=this.v(s[0],s[1],s[2],x,l,v,A,b[2][0],b[2][1],n),S=this.v(c[0],c[1],c[2],x,l,v,A,b[3][0],b[3][1],n);this.i.push(P,q,E,P,E,S)}tri(o,a,s,c,e,n){const k=a[0]-o[0],r=a[1]-o[1],i=a[2]-o[2],f=s[0]-o[0],w=s[1]-o[1],h=s[2]-o[2];let d=r*h-i*w,u=i*f-k*h,x=k*w-r*f;const l=Math.hypot(d,u,x)||1;d/=l,u/=l,x/=l;const v=n||[[0,0],[1,0],[.5,1]],y=this.v(o[0],o[1],o[2],d,u,x,c,v[0][0],v[0][1],e),b=this.v(a[0],a[1],a[2],d,u,x,c,v[1][0],v[1][1],e),A=this.v(s[0],s[1],s[2],d,u,x,c,v[2][0],v[2][1],e);this.i.push(y,b,A)}wall(o,a,s,c,e,n,k,r,i=0,f=0,w=null,h=0){const d=Math.hypot(s-o,c-a)||1,u=(c-a)/d,x=-(s-o)/d,l=i>0?Math.max(1,Math.ceil((n-e)/i)):1;let v=-1,y=-1;for(let b=0;b<=l;b++){const A=b/l,P=e+(n-e)*A,q=w?F(k,w,A):k,E=this.v(o,P,a,u,0,x,q,f,h+P-e,r),S=this.v(s,P,c,u,0,x,q,f+d,h+P-e,r);b>0&&this.i.push(v,y,S,v,S,E),v=E,y=S}}box(o,a,s,c,e,n,k,r,i="xXyYzZ",f=0){i.includes("Z")&&this.wall(c,n,o,n,a,e,k,r,f),i.includes("z")&&this.wall(o,s,c,s,a,e,k,r,f),i.includes("X")&&this.wall(c,s,c,n,a,e,k,r,f),i.includes("x")&&this.wall(o,n,o,s,a,e,k,r,f),i.includes("Y")&&this.quad([o,e,n],[c,e,n],[c,e,s],[o,e,s],k,r,[[o,n],[c,n],[c,s],[o,s]]),i.includes("y")&&this.quad([o,a,s],[c,a,s],[c,a,n],[o,a,n],k,r,[[o,s],[c,s],[c,n],[o,n]])}lathe(o,a,s,c,e,n,k=0,r=1,i=1){const f=[];for(let w=0;w<s.length;w++){const h=s[Math.max(0,w-1)],d=s[Math.min(s.length-1,w+1)];let u=d[1]-h[1],x=d[0]-h[0];const l=Math.hypot(u,x)||1;u/=l,x/=l;const v=typeof e=="function"?e(w/(s.length-1)):e,y=[];for(let b=0;b<=c;b++){const A=k+b/c*ht,P=Math.cos(A),q=Math.sin(A);y.push(this.v(o+P*s[w][0]*r,s[w][1],a+q*s[w][0]*i,P*u,-x,q*u,v,b/c*ht*Math.max(s[w][0],.5),s[w][1],n))}f.push(y)}for(let w=0;w<f.length-1;w++)for(let h=0;h<c;h++){const d=f[w][h],u=f[w][h+1],x=f[w+1][h+1],l=f[w+1][h];this.i.push(d,u,x,d,x,l)}}hipRoof(o,a,s,c,e,n,k,r,i=.6,f=null){const w=o-i,h=s+i,d=a-i,u=c+i,x=h-w,l=u-d,v=Math.min(x,l)*.5,y=x>=l,b=y?[w+v,e+n,(d+u)/2]:[(w+h)/2,e+n,d+v],A=y?[h-v,e+n,(d+u)/2]:[(w+h)/2,e+n,u-v],P=Math.hypot(v,n),q=[w,e,d],E=[h,e,d],S=[h,e,u],C=[w,e,u];y?(this.quad(C,S,A,b,k,r,[[0,0],[x,0],[x-v,P],[v,P]]),this.quad(E,q,b,A,k,r,[[0,0],[x,0],[x-v,P],[v,P]]),this.tri(q,C,b,k,r,[[0,0],[l,0],[l/2,P]]),this.tri(S,E,A,k,r,[[0,0],[l,0],[l/2,P]])):(this.quad(q,C,A,b,k,r,[[0,0],[l,0],[l-v,P],[v,P]]),this.quad(S,E,b,A,k,r,[[0,0],[l,0],[l-v,P],[v,P]]),this.tri(E,q,b,k,r,[[0,0],[x,0],[x/2,P]]),this.tri(C,S,A,k,r,[[0,0],[x,0],[x/2,P]])),f&&this.quad(q,E,S,C,f,[p.STONE,0,0,0])}geometry(){const o=new D.BufferGeometry;return o.setAttribute("position",new D.Float32BufferAttribute(this.p,3)),o.setAttribute("normal",new D.Float32BufferAttribute(this.n,3)),o.setAttribute("color",new D.Float32BufferAttribute(this.c,3)),o.setAttribute("uv",new D.Float32BufferAttribute(this.u,2)),o.setAttribute("aD",new D.Float32BufferAttribute(this.d,4)),o.setIndex(this.nv>65535?new D.Uint32BufferAttribute(this.i,1):new D.Uint16BufferAttribute(this.i,1)),o}}const fe=`
attribute vec3 color; attribute vec4 aD;
uniform float uShiver;
varying vec3 vN, vCol, vWp; varying vec2 vUv; varying vec4 vD; varying float vH;
#include <fog_pars_vertex>
${Zt}
${Wt}
#ifdef MOVER
attribute vec4 aMove;             // per vertex: mover id, 0, 0, 0
uniform vec4 uMovers[13];          // x, z, heading (rad), bob
#endif
#ifdef FLOCK
attribute vec4 aMove;             // sheet u, sheet v (m), phase, wing-tip flag
uniform vec4 uFlock;              // centre x, z, height, radius
#endif
#ifdef PENDULUM
uniform vec3 uPend;               // swing angle (rad), dip (m), pivot height (m)
#endif
void main(){
  vec3 p = position; vec3 nrm = normal;
  if (aD.x > 11.5 && aD.x < 12.5) {          // cloth: uv.x metres from its fixing, aD.z amplitude
    float w = uv.x * aD.z;
    float a = uTime*2.6 + aD.y*37. - uv.x*1.4 + uv.y*.8;
    p += nrm * sin(a)*w*.16; p.y += cos(a*.7)*w*.05;
  }
#ifdef MOVER
  vec4 mv = uMovers[int(aMove.x + .5)];
  float cs = cos(mv.z), sn = sin(mv.z);
  p = vec3(p.x*cs + p.z*sn + mv.x, p.y + mv.w, -p.x*sn + p.z*cs + mv.y);
  nrm = vec3(nrm.x*cs + nrm.z*sn, nrm.y, -nrm.x*sn + nrm.z*cs);
#endif
#ifdef FLOCK
  { float ft = uTime*.42 - aMove.y*.035 + sin(aMove.z*6.)*.02;
    vec2 el = vec2(uFlock.w*.42, uFlock.w);
    vec2 c = uFlock.xy + vec2(sin(ft), cos(ft))*el;
    vec2 tg = vec2(cos(ft)*el.x, -sin(ft)*el.y); tg /= max(length(tg), 1e-3);
    vec2 sd2 = vec2(tg.y, -tg.x);
    float bank = sin(ft*2. + .6)*.2;
    float fsc = 1. - smoothstep(60., 105., distance(cameraPosition, (modelMatrix*vec4(c.x, -uFlock.z, c.y, 1.)).xyz));
    p *= fsc;
    vec3 q = vec3(p.x + aMove.x, p.y, p.z);
    q.y += fsc * aMove.w * sin(uTime*13. + aMove.z*40.)*.3 + q.x*bank + fract(aMove.z*7.31)*4.5 - .4;
    p = vec3(c.x + sd2.x*q.x + tg.x*q.z, uFlock.z + .5*sin(ft*1.3 + aMove.x*.08) + q.y, c.y + sd2.y*q.x + tg.y*q.z);   // the vertical play of the sheet: over its centre a bird reaches at most .5 (roll) + .3 (the beat of a wing tip) + .2*13.86 (the bank across the dealt 12 m and a half span of 1.86) + .4 (the highest level) = 3.972 m, so at the 5 m the world asks no bird is nearer the surface than 1 m; the levels hang 4.5 m below that top
    float na = aMove.z*40. + ft*2.; nrm = normalize(vec3(sin(na)*.8, .35 + .5*cos(na*.7 + aMove.x), cos(na)*.8)); }
#endif
#ifdef PENDULUM
  { float cs = cos(uPend.x), sn = sin(uPend.x); vec2 r = vec2(p.x, p.y - uPend.z);
    p.x = r.x*cs - r.y*sn; p.y = uPend.z + r.x*sn + r.y*cs + uPend.y;
    nrm = vec3(nrm.x*cs - nrm.y*sn, nrm.x*sn + nrm.y*cs, nrm.z);
    if (aD.w > .5) {                           // the rod stays at least ~2 px wide
      float dc = distance(cameraPosition, (modelMatrix*vec4(p.x, -p.y, p.z, 1.)).xyz);
      p += vec3(normal.x*cs, normal.x*sn, normal.z) * dc * .0015; } }
#endif
  vec4 wp = modelMatrix * vec4(p.x, -p.y, p.z, 1.);
  vec3 org = modelMatrix[3].xyz;
  float camY = cameraPosition.y - org.y;
  float dep = max(org.y - wp.y, 0.);
  float tt = camY / max(camY + dep, 1e-3);
  vec2 X = cameraPosition.xz + (wp.xz - cameraPosition.xz)*tt - org.xz;
  vec3 rp = ripple(X);
  float sd = dep / (1. + dep/400.);
  wp.xz += rp.yz * (1. + sd*.1) * uShiver * smoothstep(.2, 3., camY);
  vWp = wp.xyz; vN = nrm; vCol = color; vUv = uv; vD = aD; vH = p.y;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,he=`
uniform float uLit, uSceneFog;
uniform vec3 uSunCol, uAmbSky, uAmbShade, uCapCol, uWinCol;
varying vec3 vN, vCol, vWp; varying vec2 vUv; varying vec4 vD; varying float vH;
#include <fog_pars_fragment>
${Zt}
${Xt}
${_t}
float winSdf(vec2 q, float ww, float wh, float arch){
  float dRect = max(q.x - ww, max(-q.y, q.y - wh - (1.-arch)*ww*.5));
  float dArc = length(vec2(q.x, q.y - wh)) - ww;
  return (q.y > wh && arch > .5) ? dArc : dRect;
}
void main(){
  float mat = vD.x, seed = vD.y;
  vec3 N = vN / max(length(vN), 1e-4);
  vec3 Vr = vWp - cameraPosition; float dist = length(Vr); Vr /= max(dist, 1e-3);
  vec3 V = vec3(Vr.x, -Vr.y, Vr.z);                 // view ray in the city's own upright frame
  float inside = 0.;                                // back faces: we are looking into a building through its foot
  if (dot(N, V) > ((mat < 3.5 || (mat > 8.5 && mat < 9.5)) ? 0. : .22)) { N = -N; inside = 1.; }
#ifdef FLOCK
  inside = 0.;                                      // a bird has no inside: both sides of a wing take the light
#endif
  vec2 uv = vUv;
  vec3 alb = vCol, emis = vec3(0.); float alpha = 1.;
#ifdef FLOCK
  emis = vCol*.2*uLit;                             // pale birds stay pale in the blue hour
#endif
  float pxm = max(fwidth(vUv.x), fwidth(vUv.y));               // metres of wall under one pixel
  float spec = 0., lod = max(smoothstep(260., 800., dist), smoothstep(.16, .46, pxm));
  float fine = 1. - smoothstep(.07, .3, pxm);                  // surface grain only where a pixel can hold it: no speckle
  float nz1 = mix(.5, fb2(uv*.8 + seed*17.), fine);
  if (mat < .5) {
    alb *= .84 + .3*nz1;
    if (vD.z > 0.) {                                 // ashlar courses
      float ch = vD.z, rw = floor(uv.y/ch), bx = uv.x/(ch*2.3) + .5*mod(rw, 2.);
      vec2 bq = vec2(fract(bx), fract(uv.y/ch));
      float mort = smoothstep(0., .035, bq.x)*(1. - smoothstep(.965, 1., bq.x))*smoothstep(0., .08, bq.y)*(1. - smoothstep(.92, 1., bq.y));
      alb *= mix(1., (.6 + .4*mort) * (.86 + .28*h21(vec2(rw, floor(bx)) + seed)), (1. - lod) * smoothstep(1., 3., ch/max(pxm, 1e-4)));
    }
  } else if (mat < 1.5) {                            // ---- plaster facade with windows
    float bw = max(vD.z, 1.), fh = max(vD.w, 1.);
    vec2 g = vec2(uv.x/bw, uv.y/fh), cell = floor(g), f = fract(g);
    vec2 q = vec2((f.x - .5)*bw, f.y*fh);
    float rnd = h21(cell + seed*91.7);
    float litB = clamp(uLit*(.4 + .85*h11(seed*1.37 + .11)), 0., 1.);   // some houses nearly dark, some lit from top to bottom
    float on0 = smoothstep(rnd, rnd + .015, litB + .3*inside);
    vec3 warm0 = mix(uWinCol, uWinCol*vec3(1.,.72,.45), h21(cell + 7.)*.7);
    alb *= .82 + .32*nz1;
    // patched plaster over brick
    float pt = smoothstep(.64, .7, fb2(uv*.21 + seed*5.3)) * (1. - lod) * fine;
    float row = floor(uv.y/.28);
    float mort = smoothstep(.03, .09, fract(uv.x/.62 + .5*mod(row, 2.))) * smoothstep(.06, .2, fract(uv.y/.28));
    alb = mix(alb, mix(vec3(.5,.44,.4), vec3(.46,.2,.13)*(.75 + .5*h21(vec2(row, floor(uv.x/.62 + .5*mod(row,2.))))), mort), pt*.9);
    // water stain towards the waterline
    float st = (1. - smoothstep(.5, 7., vH + fb2(vec2(uv.x*.6, seed))*4.));
    alb = mix(alb, alb*vec3(.5,.58,.52), st*.65);
    // string course
    float sc = step(q.y, .26) * (1. - lod);
    alb = mix(alb, vec3(.78,.7,.6)*(.75 + .25*step(.07, q.y)), sc);
    // window
    float ww = min(1.05, bw*.23)*(.7 + .42*h11(seed*2.71 + .53)), wh = fh*(.4 + .2*h11(seed*4.3 + .2)), wy = fh*.24;
    float arch = step(.3, h11(seed*3.1 + cell.y*.37));
    vec2 wq = vec2(abs(q.x), q.y - wy);
    float dW = winSdf(wq, ww, wh, arch);
    // stone surround, keystone, sill and its shadow
    float fr = (1. - smoothstep(.15, .2, dW)) * step(0., dW) * step(-.02, wq.y);
    alb = mix(alb, vec3(.8,.72,.63)*(.86 + .14*nz1), fr);
    float sill = step(abs(q.x), ww + .3) * step(wy - .2, q.y) * step(q.y, wy);
    alb = mix(alb, vec3(.84,.77,.68), sill);
    alb *= 1. - .3*step(abs(q.x), ww + .3)*step(wy - .5, q.y)*step(q.y, wy - .2);
    // shutters, half open
    float hasSh = step(.3, h11(seed*5.7));
    float sw = .5*(.45 + .55*h21(cell + 3.3));
    float sh = hasSh * step(ww + .16, abs(q.x)) * step(abs(q.x), ww + .16 + sw) * step(wy, q.y) * step(q.y, wy + wh + arch*ww*.3);
    float sk = h11(seed*7.3);
    vec3 shCol = sk < .4 ? vec3(.08,.2,.15) : (sk < .7 ? vec3(.12,.19,.3) : vec3(.27,.13,.08));
    alb = mix(alb, shCol*(.7 + .45*step(.5, fract(q.y*6.))), sh);
    // the opening: reveal, glass, light
    if (dW < 0.) {
      vec3 T = vec3(N.z, 0., -N.x); T /= max(length(T), 1e-3);
      vec2 off = vec2(dot(V, T), V.y) / max(-dot(V, N), .2) * .3;
      vec2 q2 = q + off;
      float d2 = winSdf(vec2(abs(q2.x), q2.y - wy), ww, wh, arch);
      if (d2 > 0.) { alb = vec3(.62,.54,.48)*(off.y > 0. ? .5 : .85); }
      else {
        float on = smoothstep(rnd, rnd + .015, litB + .3*inside);
        vec2 pq = vec2(q2.x, q2.y - wy);
        float bars = (step(abs(pq.x), max(.04, pxm*.7)) + step(abs(fract(pq.y/.62) - .5), max(.056, pxm*1.1))) * (1. - smoothstep(.09, .2, pxm));   // glazing bars never thinner than a pixel: no stipple
        float cur = .55 + .45*vn2(vec2(pq.x*2.5 + rnd*9., pq.y*.9 + rnd*5.));
        vec3 glass = lowerSkyG(normalize(vec3(-V.x, abs(V.y) + .15, -V.z)))*.3 + vec3(.02,.02,.04);
        vec3 warm = mix(uWinCol, uWinCol*vec3(1.,.72,.45), h21(cell + 7.)*.7);
        alb = mix(glass, vec3(.12,.07,.05), min(bars, 1.)*.8);
        emis = warm * 2.5 * cur * on * (1. - .75*min(bars, 1.));
        alb *= 1. - .8*on;
      }
    }
    // window boxes
    float wb = step(.62, h21(cell + 9.1)) * step(abs(q.x), ww + .1) * step(wy, q.y) * step(q.y, wy + .3) * (1. - lod);
    alb = mix(alb, mix(vec3(.12,.3,.12), vec3(.8,.14,.2), step(.55, vn2(uv*9.))), wb);
    // far: each window a soft dark pane, a share of them lit, so that a wall a quarter of a mile off still shows its rows of
    // windows; where a bay is smaller than two pixels it melts to the average and nothing shimmers
    float aa = pxm*.7 + .02;
    float wm = (1. - smoothstep(ww - aa, ww + aa, abs(q.x))) * smoothstep(wy - aa, wy + aa, q.y) * (1. - smoothstep(wy + wh - aa, wy + wh + aa, q.y));
    float keep = smoothstep(1.3, 3.2, min(bw, fh)/max(pxm, 1e-4));
    float cov = (2.*ww/bw) * (wh/fh);
    vec3 wallFar = vCol*(.74 + .1*h21(vec2(cell.y, seed)));
    vec3 albFar = mix(wallFar, vec3(.06,.06,.1), mix(cov, wm, keep)*.85);
    float onF = smoothstep(rnd, rnd + .015, litB*.8 + .3*inside);
    vec3 emisFar = warm0 * 2.1 * mix(litB*.8*cov, onF*wm, keep);
    alb = mix(alb, albFar, lod);
    emis = mix(emis, emisFar, lod);
  } else if (mat < 2.5) {                            // ---- pantile roof
    float rw = uv.y/.42, cl = uv.x/.3;
    float tile = h21(vec2(floor(cl), floor(rw)));
    alb *= mix(.81, (.62 + .38*fract(rw)) * (.8 + .2*sin(cl*6.2832)) * (.8 + .4*tile), fine);
    alb = mix(alb, alb*vec3(.55,.5,.45), smoothstep(.55, .8, fb2(uv*.3 + seed))*.6);
    alb = mix(alb, vCol*.8, lod) * .8;
  } else if (mat < 3.5) {                            // ---- stone trim (dentils when aD.z > 0)
    alb *= .85 + .25*nz1;
    if (vD.z > 0.) alb *= 1. - .42*step(.5, fract(uv.x/vD.z))*step(uv.y, vD.w)*(1. - lod);
  } else if (mat < 4.5) {                            // ---- verdigris
    alb *= .74 + .5*fb2(vec2(uv.x*.5, uv.y*.1) + seed);
    float rim = 1. - abs(dot(N, V)); rim *= rim*rim;
    emis = uSunCol * rim * .1;
  } else if (mat < 5.5) {                            // ---- gold
    vec3 R = reflect(V, N);
    vec3 env = lowerSkyG(normalize(vec3(R.x, abs(R.y) + .02, R.z))) * (R.y < 0. ? .5 : 1.);
    float g1 = max(dot(R, uSunL), 0.); g1 *= g1; g1 *= g1; g1 *= g1;
    float rim = 1. - abs(dot(N, V));
    float band = .85 + .15*sin(vH*9.);                 // turned work: fine lathe rings
    vec3 tint = mix(vCol, vec3(1., .8, .46), .45);
    emis = tint * (env*1.5*band + uSunCol*(2.2*g1) + .22*rim*rim*rim);
    { vec3 dg = vWp - uPGlow.xyz; emis += vec3(.16, .8, .66) * uPGlow.w * 1.1 / (1. + dot(dg, dg)/36.); }
    alb *= .28;
  } else if (mat < 6.5) {                            // ---- lamp
    emis = vCol * vD.z; alb = vec3(0.);
  } else if (mat < 7.5) {                            // ---- bronze
    alb *= .7 + .6*nz1;
    vec3 R = reflect(V, N); float g1 = max(dot(R, uSunL), 0.); g1 *= g1; g1 *= g1;
    float rim = 1. - abs(dot(N, V));
    vec3 env = lowerSkyG(normalize(vec3(R.x, abs(R.y) + .02, R.z)));
    emis = env*vec3(1., .78, .5)*(.2 + .3*rim) + uSunCol*(.55*g1 + .1*rim*rim*rim);
    { vec3 dg = vWp - uPGlow.xyz; emis += vec3(.16, .8, .66) * uPGlow.w * 1.5 / (1. + dot(dg, dg)/150.); }
  } else if (mat < 8.5) {                            // ---- clock without numerals
    float R = max(vD.z, 1.), r = length(uv)/R;
    alb = mix(vec3(.82,.76,.62), vec3(.5,.42,.3), smoothstep(.0, 1., r)*.4);
    float ring = (1. - smoothstep(.0, .03, abs(r - .9))) + (1. - smoothstep(.0, .015, abs(r - .62)));
    alb = mix(alb, vec3(.75,.52,.14), min(ring, 1.));
    float a1 = -uTime*6.2832/40. + seed, a2 = a1/12. + 1.3;
    vec2 d1 = vec2(sin(a1), cos(a1)), d2 = vec2(sin(a2), cos(a2));
    vec2 p = uv/R;
    float l1 = length(p - d1*clamp(dot(p, d1), -.12, .8)) - .035*(1.2 - clamp(dot(p,d1),0.,.8));
    float l2 = length(p - d2*clamp(dot(p, d2), -.1, .5)) - .05;
    float hand = step(min(l1, l2), 0.) + step(r, .07);
    alb = mix(alb, vec3(.07,.05,.06), min(hand, 1.));
    emis = vec3(.75,.52,.14)*min(ring,1.)*.5*(1. - min(hand, 1.));
    alb *= step(r, 1.) + .6*step(1., r);
  } else if (mat < 9.5) {                            // ---- arcade back wall: dark, some lit doors
    float bw = max(vD.z, 1.);
    float cx = floor(uv.x/bw), fx = (fract(uv.x/bw) - .5)*bw;
    float dD = winSdf(vec2(abs(fx), uv.y - .2), bw*.24, 2.5, 1.);
    float rnd = h21(vec2(cx, seed*31.));
    alb *= .8 + .3*nz1;
    float pool = exp(-(fx*fx)/(bw*bw*.11) - (uv.y - 2.9)*(uv.y - 2.9)/5.);
    alb *= .55 + .25*step(.5, fract(uv.y*2.6 + .5*floor(uv.x*1.3)))*smoothstep(3., 12., 1./max(pxm, 1e-4));
    emis = vCol*vec3(1.,.7,.42)*(.035 + (.1 + .5*uLit)*pool)*(.7 + .3*vn2(uv*.7 + seed));
    if (dD < 0.) { float on = smoothstep(rnd, rnd + .02, uLit*1.1);
      alb = vec3(.2,.13,.09)*(.75 + .25*step(.5, fract(fx*2.2))); emis = uWinCol*vec3(1.,.7,.42)*1.7*on*(.5 + .5*vn2(uv*vec2(2.,1.) + rnd*7.)); }
    else alb = mix(alb, vec3(.6,.52,.45), (1. - smoothstep(.12, .16, dD)));
  } else if (mat < 10.5) {                           // ---- balustrade
    float hh = max(vD.z, .5);
    float solid = step(hh - .13, uv.y) + step(uv.y, .1);
    float bx = abs(fract(uv.x/.3) - .5), wv = .2 + .13*sin(uv.y/hh*9.4 + 1.);
    if (solid < .5 && bx > wv && pxm < .085) discard;      // from far off the balusters close to a screen: no dotted rows
    alb *= 1. - .22*smoothstep(.06, .085, pxm)*(1. - solid);
    alb *= .9 + .2*nz1;
  } else if (mat < 11.5) {                           // ---- striped mooring pole
    alb = mix(vec3(.82,.78,.72), vCol, step(.5, fract(uv.y*.55 + uv.x*.6)));
  } else if (mat < 12.5) {                           // ---- cloth
    if (vD.w > .5) alb *= .72 + .28*step(.5, fract(uv.y*vD.w));
  } else if (mat < 13.5) {                           // ---- foot cap: a darker pane of the same water
    alb = vec3(0.);
    float gz = 1. - clamp(abs(V.y), 0., 1.);          // 0 looking straight down, 1 at a grazing angle
    emis = lowerSky(normalize(vec3(V.x, abs(V.y) + .05, V.z)))*vec3(.7,.8,.95)*.9 + uCapCol*.06;
    alpha = max(mix(.34, .82, gz*gz), .8*step(.5, vD.y));   // aD.y 1: a solid pier's foot, nothing to see inside
  } else if (mat < 15.5) {                           // ---- dome glass: rose panes and fine glazing bars
    vec2 guv = uv*vec2(.5, .33334);                            // 48 panes round, one row to each hoop
    vec2 gq = abs(fract(guv) - .5);
    float lw = clamp(.008 + pxm*.5, .008, .05);                  // thin glazing bars, never under a pixel and a half
    float line = smoothstep(.5 - lw*1.6, .5 - lw*.6, max(gq.x, gq.y*.985));
    float rim = 1. - abs(dot(N, V)); rim *= rim;
    vec3 R = reflect(V, N); R.y = abs(R.y);
    float pane = h21(floor(guv) + seed);
    alb = mix(vec3(.5,.3,.32)*(.94 + .12*pane), vCol*1.5 + vec3(.1,.07,.03), line);
    emis = lowerSky(normalize(R + vec3(0., .05, 0.))) * (.1 + .45*rim) * (1. - line);
    float gl = smoothstep(.72, 1., sin(uv.x*.9 + uv.y*.55 - uTime*1.1 + pane*2.)) * smoothstep(.35, .8, pane);
    float sg = max(dot(R, uSunL), 0.); sg *= sg; sg *= sg; sg *= sg;
    emis += uSunCol * (gl*.55 + sg*.9) * (1. - line);
    alpha = mix(.1 + .3*rim + .3*gl + .3*sg, .95, line);
    alb = mix(alb, mix(vec3(.012,.016,.05), alb*.7, line), inside);
    emis *= 1. - .8*inside;
    alpha = mix(alpha, mix(.8 + .14*rim, .96, line), inside);
    { vec3 dg = vWp - uPGlow.xyz; float fg = uPGlow.w / (1. + dot(dg, dg)/mix(520., 140., inside)); emis += vec3(.16, .8, .66) * fg * (1.1 + 1.5*inside); alpha = min(alpha + fg*.3, .96); }
  }
  float nl = dot(N, uSunL);
  float sun = clamp(nl*1.2 + .03, 0., 1.) * (1. - inside);
  vec3 amb = (mix(uAmbShade, uAmbSky, N.y*.5 + .5) + vec3(.2,.11,.07)*max(-N.y, 0.)) * (1. - .62*inside) + vec3(.07,.04,.025)*inside*uLit;
  emis *= 1. - .5*inside;
  vec3 R2 = reflect(V, N); float sp = max(dot(R2, uSunL), 0.); sp *= sp; sp *= sp; sp *= sp;
  vec3 col = alb*(uSunCol*sun + amb) + uSunCol*sp*spec + emis;
  vec3 hz = lowerSkyG(normalize(vec3(V.x, abs(V.y) + .03, V.z)));
  float ha = 1. - exp(-(dist*.0006 + max(vH, 0.)*.0003));
  col = mix(col, hz*.9, ha * (mat > 5.5 && mat < 6.5 ? .5 : 1.));
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float ff = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #else
    float ff = smoothstep(fogNear, fogFar, vFogDepth);
  #endif
  col = mix(col, fogColor, ff*uSceneFog);
#endif
  gl_FragColor = vec4(col, alpha);
}`;function Dt(t,o,a,s,c,e,n,k,r,i,f,w,h=10){const d=[[o,s]];for(const u of n){d.push([u.cx-u.R,s]);for(let x=1;x<h;x++){const l=Math.PI*x/h;d.push([u.cx-u.R*Math.cos(l),s+u.R*Math.sin(l)])}d.push([u.cx+u.R,s])}d.push([a,s]);for(let u=0;u<d.length-1;u++){const x=d[u],l=d[u+1];l[0]-x[0]<1e-4||(t.quad([x[0],x[1],e],[l[0],l[1],e],[l[0],c,e],[x[0],c,e],k,r,[[x[0],x[1]],[l[0],l[1]],[l[0],c],[x[0],c]]),i>0&&t.quad([x[0],x[1],e-i],[l[0],l[1],e-i],[l[0],l[1],e],[x[0],x[1],e],f||k,w||r,[[x[0],0],[l[0],0],[l[0],i],[x[0],i]]))}}function oe(t,o,a,s,c,e,n,k,r=10){for(let i=0;i<r;i++){const f=Math.PI*i/r,w=Math.PI*(i+1)/r,h=s+c,d=[o-s*Math.cos(f),a+s*Math.sin(f),e],u=[o-s*Math.cos(w),a+s*Math.sin(w),e],x=[o-h*Math.cos(w),a+h*Math.sin(w),e],l=[o-h*Math.cos(f),a+h*Math.sin(f),e];t.quad(d,u,x,l,i%2?n:R(n,.86),k,[[i,0],[i+1,0],[i+1,c],[i,c]])}}function Ht(t,o,a,s,c,e,n,k=6){const r=[p.STONE,o*.13+a*.07,0,0];t.lathe(o,a,[[e*1.5,s],[e*1.5,s+e*.5],[e*1.05,s+e*.9],[e,s+c*.35],[e*.84,s+c-e*1.6],[e*1.25,s+c-e*.9],[e*1.55,s+c-e*.5]],k,n,r,.3),t.box(o-e*1.7,s+c-e*.5,a-e*1.7,o+e*1.7,s+c,a+e*1.7,R(n,1.05),r,"xXyzZ")}function It(t,o,a,s,c,e,n,k,r,i=2,f=.5){for(let w=0;w<i;w++){const h=k*(w+1)/i,d=e+n*w/i,u=e+n*(w+1)/i;t.box(o-h,d,a-h,s+h,u,c+h,w%2?R(r,.92):r,[p.STONE,w*.37+o*.01,w===0?f:0,n/i*.6],"xXzZy"+(w===i-1?"Y":""))}}const Q={W:15,legTop:44,shaftTop:346,belfry0:352,belfry1:384,top:404,pivot:382};function ue(t,o,a){const s=Q.W,c=o.brick,e=o.stone,n=a()*10;t.frame(0,0,0,0);const k=5.4,r=(2*s-2*k)/2,i=25;for(const l of[-1,1])for(const v of[-1,1]){const y=l<0?-s:s-k,b=v<0?-s:s-k;t.box(y-.5,0,b-.5,y+k+.5,3.2,b+k+.5,F(c,e,.5),[p.STONE,n,0,0],"xXzZY");for(let A=0;A<5;A++){const P=3.2+A*4.2,q=P+4.2,E=A%2?0:.22;t.box(y-E,P,b-E,y+k+E,q,b+k+E,A%2?F(c,e,.12):F(c,e,.34),[p.PLAIN,n+A,.3,0],"xXzZ"+(E?"yY":""))}t.box(y-.6,24.2,b-.6,y+k+.6,25.4,b+k+.6,e,[p.STONE,n,.6,.5],"xXzZyY"),t.box(y,25.4,b,y+k,Q.legTop,b+k,F(c,e,.2),[p.PLAIN,n,.3,0],"xXzZ",5),t.quad([y,.03,b],[y+k,.03,b],[y+k,.03,b+k],[y,.03,b+k],o.cap,[p.CAP,1,0,0])}for(let l=0;l<4;l++){t.frame(0,0,0,l*Math.PI/2),Dt(t,-s+k,s-k,25.4,Q.legTop,s-.4,[{cx:0,R:r-.01}],F(c,e,.2),[p.PLAIN,n+l,.9,0],2.6,R(e,.8),[p.STONE,n,0,0],12),oe(t,0,25.4,r,1.5,s-.15,e,[p.STONE,n,0,0],12),t.box(-1.1,25.4+r-.3,s-.4,1.1,25.4+r+2.6,s+.2,e,[p.STONE,n,0,0],"xXZyY");const v=Q.legTop,y=Q.shaftTop-30,b=s-.5;t.wall(s-3.2,s,-s+3.2,s,v,y,c,[p.FACADE,n+l*3.1,(2*s-6.4)/3,21],4,0,F(c,o.rose,.35));for(const m of[-1,1]){const M=m<0?-s-.3:s-3.2,g=m<0?-s+3.2:s+.3;t.wall(g,s+.3,M,s+.3,v,Q.shaftTop,F(c,e,.3),[p.PLAIN,n,.8,0],4),t.wall(m<0?g:M,s+.3,m<0?g:M,s,v,Q.shaftTop,R(c,.8),[p.PLAIN,n,0,0],8)}for(let m=0;m*9.2+v+3<Q.shaftTop;m++){const M=v+2+m*9.2;t.box(s-4.4,M,s+.3,s+.62,M+4.4,s+.62,e,[p.STONE,n+m,0,0],"xXZyY"),t.box(-s-.62,M+4.6,s+.3,-s+4.4,M+9,s+.62,e,[p.STONE,n+m+.5,0,0],"xXZyY")}for(let m=1;m<=4;m++){const M=v+(y-v)*m/4-1;t.box(-s+3.2,M,s,s-3.2,M+1.3,s+.5,e,[p.STONE,n,.8,.6],"ZyY")}t.box(-s-.4,v-1.2,s,s+.4,v+.8,s+.9,e,[p.STONE,n,.9,.8],"ZyYxX"),t.wall(s-3.2,s+.1,-s+3.2,s+.1,y,Q.shaftTop,F(e,c,.25),[p.PLAIN,n,0,0],5);const A=y+15,P=9.2;t.quad([-P-1,A-P-1,s+.45],[P+1,A-P-1,s+.45],[P+1,A+P+1,s+.45],[-P-1,A+P+1,s+.45],e,[p.CLOCK,l*1.7+n,P,0],[[-P-1,-P-1],[P+1,-P-1],[P+1,P+1],[-P-1,P+1]]),t.box(-P-1.6,A-P-1.6,s+.1,P+1.6,A-P-1,s+.9,e,[p.STONE,n,.7,.4],"ZyYxX"),t.box(-P-1.6,A+P+1,s+.1,P+1.6,A+P+1.7,s+.9,e,[p.STONE,n,.7,.4],"ZyYxX");const q=Q.belfry0,E=q+20,S=(2*b-7)/3,C=S/2-.7;Dt(t,-b+3.5,b-3.5,E,Q.belfry1,b,[{cx:-S,R:C},{cx:0,R:C},{cx:S,R:C}],F(e,c,.15),[p.PLAIN,n,0,0],2,R(e,.78),null,8);for(const m of[-S,0,S])oe(t,m,E,C,.55,b+.12,e,[p.STONE,n,0,0],8);for(const m of[-S/2,S/2])Ht(t,m,b-1,q+2.2,E-q-2.2,.95,e,8);t.box(-b,q,b-2,b,q+2.2,b+.2,e,[p.BALUS,n,2.2,0],"Z"),t.box(b-3.5,q,b-3.5,b,Q.belfry1,b,F(e,c,.15),[p.PLAIN,n,0,0],"xXzZ",8)}t.frame(0,0,0,0);const f=s-.5;It(t,-s-.3,-s-.3,s+.3,s+.3,Q.shaftTop,6,2.4,e,3,1.1),t.box(-f-1,Q.shaftTop+6,-f-1,f+1,Q.belfry0,f+1,e,[p.STONE,n,0,0],"y"),It(t,-f,-f,f,f,Q.belfry1,3.2,1.8,e,2,.9),t.box(-f,Q.pivot-1.2,-1.3,f,Q.pivot+1.2,1.3,o.bronze,[p.BRONZE,n,0,0]),t.box(-1.2,Q.pivot-1.2,-f,1.2,Q.pivot+1.2,f,o.bronze,[p.BRONZE,n,0,0]);const w=Q.belfry1+3.2,h=s-3.5;t.box(-h,w,-h,h,w+7,h,F(c,o.rose,.2),[p.FACADE,n+9,h*2/3,7],"xXzZy"),It(t,-h,-h,h,h,w+7,1.6,1,e,2,.7);const d=w+8.6,u=Q.top-d-2.5,x=h+.6;for(let l=0;l<4;l++){t.frame(0,0,0,l*Math.PI/2);const v=Math.hypot(x,u);for(let y=0;y<4;y++){const b=y/4,A=(y+1)/4,P=x*(1-b)*(1-.12*Math.sin(b*Math.PI)),q=x*(1-A)*(1-.12*Math.sin(A*Math.PI));t.quad([-P,d+u*b,P],[P,d+u*b,P],[q,d+u*A,q],[-q,d+u*A,q],o.verdi,[p.VERDI,n+l,0,0],[[-P,v*b],[P,v*b],[q,v*A],[-q,v*A]])}}t.frame(0,0,0,0),t.lathe(0,0,[[.25,d+u-.6],[.9,d+u+.5],[1.3,d+u+1.4],[.9,d+u+2.2],[.2,d+u+2.9]],8,o.gold,[p.GOLD,0,0,0])}function ve(t,o){t.frame(0,0,0,0);const a=[p.GOLD,0,0,0],s=64,c=15.5,e=Q.pivot,n=[];for(let i=0;i<=s;i++)n.push([.42,c+(e-c)*i/s]);t.lathe(0,0,n,6,F(o.bronze,o.gold,.45),[p.BRONZE,0,0,1]);for(let i=1;i<=8;i++){const f=c+(e-c)*i/9;t.lathe(0,0,[[.5,f-1],[1.05,f-.4],[1.05,f+.4],[.5,f+1]],8,o.gold,a)}t.lathe(0,0,[[.02,0],[.22,.7],[.5,1.5],[1.1,1.95],[1.5,2.7],[1.38,3.3],[.8,3.9],[.5,4.3],[.95,4.7],[1,5],[.55,5.4],[.8,6]],12,o.gold,a);const k=[];for(let i=0;i<=10;i++){const f=Math.PI*i/10;k.push([Math.max(.02,5.2*Math.sin(f)),11-5.2*Math.cos(f)])}t.lathe(0,0,k,20,i=>F(o.bronze,o.gold,.25+.5*Math.abs(Math.cos(i*Math.PI*3))),[p.BRONZE,1,0,0],0,1,.3);const r=[];for(let i=0;i<=6;i++){const f=Math.PI*i/6;r.push([Math.max(.02,5.6*Math.sin(f)),11-5.6*Math.cos(f)])}t.lathe(0,0,r,20,o.gold,a,0,1,.09);for(const i of[-1,1]){const f=[];for(let w=0;w<=5;w++){const h=Math.PI*w/5;f.push([Math.max(.02,2.1*Math.sin(h)),11-2.1*Math.cos(h)])}t.lathe(0,i*1.2,f,12,o.gold,a,0,1,.32)}}const ae=`
varying vec3 vWp; varying vec2 vLp;
#include <fog_pars_vertex>
void main(){
  vLp = position.xz;
  vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,$t=`
varying vec3 vWp; varying vec2 vLp;
#include <fog_pars_fragment>
${Zt}
${Xt}
${Wt}
${_t}
uniform float uSceneFog;
float sceneFog(){
#ifdef USE_FOG
  #ifdef FOG_EXP2
    return 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #else
    return smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#else
  return 0.;
#endif
}
vec3 fogCol(){
#ifdef USE_FOG
  return fogColor;
#else
  return vec3(0.);
#endif
}`,de=`
${$t}
void main(){
  vec3 Vr = vWp - cameraPosition; float dist = length(Vr); Vr /= max(dist, 1e-3);
  vec3 rp = ripple(vLp);
  float k = 2.2 / (1. + dist*.006);
  vec3 n = normalize(vec3(-rp.y*k, 1., -rp.z*k));
  vec3 R = reflect(Vr, n); R.y = abs(R.y) + .003;
  vec3 col = lowerSky(normalize(R));
  col = mix(col, fogCol(), sceneFog()*uSceneFog);
  gl_FragColor = vec4(col, 1.);
}`,me=`
${$t}
uniform vec3 uUpHor, uUpZen, uSunU, uSunUCol, uUpBand; uniform vec2 uPaws;
void main(){
  vec3 Vr = vWp - cameraPosition; float dist = length(Vr); Vr /= max(dist, 1e-3);
  vec3 rp = ripple(vLp);
  float k = 1. / (1. + dist*.004);
  // cat's-paws: drifting patches of fine ripple
  float cp = smoothstep(.5 - uPaws.y, .72 - uPaws.y, fb2(vLp*.0045 + vec2(uTime*.011, uTime*.006)*(1. + 3.*uPaws.y))) * uPaws.x;
  cp *= .35 + .65*smoothstep(.35, .7, vn2(vLp*.021 - vec2(uTime*.03, 0.)));
  vec2 mq = vLp*vec2(.9, 2.3) + uTime*vec2(.7, 1.1);
  float nearK = 1. / (1. + dist*.012);
  vec2 mic = vec2(vn2(mq) - .5, vn2(mq + 17.3) - .5) * cp * nearK;
  vec3 n = normalize(vec3(-rp.y*k + mic.x*.22, 1., -rp.z*k + mic.y*.22));
  float sinG = clamp(dot(-Vr, n), 0., 1.);
  float deg = asin(sinG)*57.296;
  float w = min(.78, .78*exp(-(deg - 1.)/1.35));
  w = max(w, min(cp*.35, .4)*mix(1., .6 + .8*vn2(mq*.6), nearK) * (.2 + .8*(1. - smoothstep(3., 16., deg))) * (1. - smoothstep(6., 60., deg)));
  // a cat's-paw from close by: long silver streaks of fine ripple lying across the course
  float sk = smoothstep(.58, .76, fb2(vLp*vec2(.015, .07) + vec2(uTime*.02, uTime*.013)));
  float fine = .5 + .5*vn2(vLp*vec2(1.3, 3.3) + uTime*vec2(.6, .9));
  sk *= 1. - smoothstep(14., 48., cameraPosition.y - (vWp.y));                 // streaks belong to the low passes; from the air they are scratches
  w = max(w, sk*fine*.14*min(uPaws.x, 1.2) * (1. - smoothstep(110., 380., dist)) * (.3 + .7*(1. - smoothstep(8., 28., deg))));
  w += smoothstep(.07, .24, length(rp.yz)) * .1;                              // the crest of a ring or a wake catches the morning: boats below have their water line
  vec2 vh = Vr.xz / max(length(Vr.xz), 1e-3);
  float fac = dot(rp.yz, vh) * (.4 + .6*(1. - smoothstep(8., 70., deg)));   // slopes leaning away catch the morning sky, slopes facing us go clear and a little dark
  w += clamp(fac*3., 0., .26);
  float dark = clamp(-fac*2.2, 0., .22);
  w = clamp(w, 0., .94);
  float bowl = (1. - smoothstep(50., 63., length(vLp - vec2(0., 540.)))) * smoothstep(7., 22., deg);
  w *= 1. - .75*bowl;
  vec3 Ru = reflect(Vr, n); Ru.y = abs(Ru.y);
  vec3 sky = mix(uUpHor, uUpZen, smoothstep(0., .55, Ru.y));
  sky = mix(uUpBand, sky, smoothstep(.02, .15, Ru.y + .05*vn2(vec2(atan(Ru.x, Ru.z + 1e-4)*9., 3.))));
  float sg = max(dot(normalize(Ru), uSunU), 0.); sg *= sg; sg *= sg; sg *= sg; sg *= sg; sg *= sg; sg *= sg;   // ^64
  float spk = smoothstep(.66, .98, vn2(mq*3.1 + 5. + uTime*vec2(.9, -.6)) * vn2(mq.yx*2.3 + 9. - uTime*vec2(.5, .7)) * 1.7) * (cp + .15);   // two crossed octaves: glints, not square flakes
  float sg4 = sg*sg*sg*sg;
  vec3 col = sky*w + uSunUCol * (sg4*spk*.4) + mix(uUpHor, vec3(.8, .84, .9), .5) * (sk*fine*.04*(1. - smoothstep(110., 380., dist)));
  float ff = sceneFog()*uSceneFog;
  col = mix(col, fogCol(), ff*.0);
  gl_FragColor = vec4(col, min(w + dark, .96));
}`,pe=`
attribute vec4 aD;
varying vec3 vWp; varying vec2 vLp; varying vec2 vUv; varying vec4 vD;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix * vec4(position.x, -position.y, position.z, 1.); vWp = wp.xyz; vLp = wp.xz - modelMatrix[3].xz;
  vUv = uv; vD = aD;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,we=`
${$t}
uniform vec3 uCapTint; uniform float uCapK;
varying vec2 vUv; varying vec4 vD;
void main(){
  vec3 Vr = vWp - cameraPosition; float dist = length(Vr); Vr /= max(dist, 1e-3);
  vec3 rp = ripple(vLp);
  float k = 2.2 / (1. + dist*.006);
  vec3 n = normalize(vec3(-rp.y*k, 1., -rp.z*k));
  vec3 R = reflect(Vr, n); R.y = abs(R.y) + .003;
  vec3 col = lowerSky(normalize(R));
  float gz = 1. - clamp(abs(Vr.y), 0., 1.);                    // 0 looking straight down, 1 at a grazing angle
  float same = max(max(smoothstep(.74, .95, gz), .78*step(1.5, vD.y)), .94);   // the feet are the lake's own water, a little shaded
  vec2 e2 = min(vUv, 1. - vUv) * vD.zw;                        // metres from the pane's edge
  float edge = min(e2.x, e2.y);
  float rim = 1. - smoothstep(.0, .22 + dist*.0012, edge);
  float lum = dot(col, vec3(.3, .55, .15));
  vec3 deep = mix(vec3(lum), col, .8) * uCapTint * uCapK * (1. - .45*smoothstep(.18, .7, lum));   // under a bright sky the shadow is deeper
  deep *= .82 + .18*smoothstep(0., 4., edge);                  // darkest against the walls
  col = mix(deep, col, same);
  col *= 1. - .16*rim*(1. - .35*same);
  col = mix(col, fogCol(), sceneFog()*uSceneFog);
  gl_FragColor = vec4(col, 1.);
}`;function jt(t,o={},a={}){return new D.ShaderMaterial({uniforms:{...D.UniformsUtils.clone(D.UniformsLib.fog),...t},vertexShader:fe,fragmentShader:he,fog:!0,side:D.DoubleSide,defines:o,...a})}async function Ce(t,o={}){const a=t.rng,s=yt(o.detail??t.quality?.detail??1,.6,1),c=o.palette&&o.palette.length>=7?o.palette:re,e=c.map(nt),n=a.pick([0,0,1,2]),k=a.sign()*a.range(10,13)*.42,r=a.range(-.16,.2),i=new D.Vector3(Math.sin(1.12+r),.125,-Math.cos(1.12+r)).normalize(),f=R(F(e[3],e[4],.45),.8),w=R(F(nt("#F2E2C4"),e[3],.18),.8),h=R(F(e[6],e[4],.4),.78),d={rose:R(e[3],.8),gold:R(e[6],1),cap:R(e[2],.6),verdi:R(F(e[1],nt("#5FA890"),.4),.8),stone:R(nt("#E6D8BF"),.84),bronze:nt("#4A3524"),brick:R(F(nt("#B9705A"),e[4],.25),.82),roof:R(F(nt("#B5522C"),e[4],.3),.85),plasters:[f,w,h,R(e[3],.78),R(F(w,e[4],.3),.9)],dark:nt("#3A2A36"),white:nt("#E8E2D6"),red:nt("#B3261E"),teal:e[2],livery:n};n===1?(d.plasters=[R(nt("#EFE7DA"),.84),R(nt("#E9D9C6"),.82),w,R(F(nt("#EFE7DA"),e[3],.35),.82),R(nt("#DCCFC0"),.85)],d.verdi=R(F(nt("#3F6FA8"),e[2],.25),.85),d.brick=R(nt("#E3D3BD"),.82)):n===2&&(d.plasters=[d.brick,R(nt("#A8604C"),.85),f,h,R(nt("#C98F70"),.85)],d.roof=R(F(nt("#5A5868"),e[5],.35),.9),d.verdi=R(F(nt("#C0764A"),e[4],.3),.8)),d.plasters=d.plasters.map(L=>Yt(L,1.3)),d.brick=Yt(d.brick,1.2),d.roof=Yt(d.roof,1.2);const u={uTime:{value:0},uSwing4:{value:0},uBarge:{value:new D.Vector4(0,-9999,0,1)},uSkyPeach:{value:new D.Color(c[4])},uSkyRose:{value:new D.Color(c[3])},uSkyViolet:{value:new D.Color(c[5])},uSunL:{value:i},uShiver:{value:1},uLit:{value:.3},uSceneFog:{value:o.sceneFog??.35},uSunCol:{value:new D.Vector3(1.38,.74,.42)},uAmbSky:{value:new D.Vector3(.3,.2,.28)},uAmbShade:{value:new D.Vector3(.14,.11,.3)},uCapCol:{value:new D.Vector3(...d.cap)},uWinCol:{value:new D.Color("#FBE9D0")},uPend:{value:new D.Vector3(0,0,Q.pivot)},uMovers:{value:Array.from({length:13},()=>new D.Vector4(0,-9999,0,0))},uRings:{value:Array.from({length:8},()=>new D.Vector4(0,-9999,0,0))},uWakes:{value:Array.from({length:3},()=>new D.Vector4(0,-9999,0,0))},uRain:{value:0},uCamL:{value:new D.Vector2},uBarA:{value:new D.Vector3(1.05,.5,.42)},uBarB:{value:new D.Vector3(.5,.3,.52)},uSunGlow:{value:new D.Vector3(1,.5,.2)},uMoon:{value:new D.Vector4(.26,.42,.87,0)},uPaws:{value:new D.Vector2(1,0)},uPGlow:{value:new D.Vector4(0,-62,1100,0)},uUpBand:{value:new D.Color("#7f9fb8")},uFlock:{value:new D.Vector4(0,150,0,0)},uCapTint:{value:new D.Vector3(.66,.76,.95)},uCapK:{value:.6}},x=new D.Group;x.name="city-in-the-lake";const l=(L,I)=>(L.frustumCulled=!1,L.renderOrder=I,L.matrixAutoUpdate=!0,x.add(L),L),v=xe(a.fork("layout"),k),y=new qt,b=new qt;y.sink=b,ue(y,d,a.fork("camp")),await t.yield();const A=await ye(y,d,a.fork("canal"),v,s,()=>t.yield());await t.yield(),Me(y,d,a.fork("bridges"),v),await t.yield(),await ke(y,d,a.fork("dome"),v,()=>t.yield()),await t.yield(),await Se(y,d,a.fork("fill"),v,s,t.noise,()=>t.yield()),await t.yield();const P=jt(u),q=new D.BufferGeometry;for(const[L,I,X]of[["position",y.p,3],["normal",y.n,3],["color",y.c,3],["uv",y.u,2],["aD",y.d,4]])q.setAttribute(L,new D.Float32BufferAttribute(I,X)),await t.yield();q.setIndex(y.nv>65535?new D.Uint32BufferAttribute(y.i,1):new D.Uint16BufferAttribute(y.i,1));const E=l(new D.Mesh(q,P),2);await t.yield();const S=l(new D.Mesh(b.geometry(),new D.ShaderMaterial({uniforms:{...D.UniformsUtils.clone(D.UniformsLib.fog),...u},vertexShader:pe,fragmentShader:we,fog:!0,side:D.DoubleSide,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:3})),2);await t.yield();const C=new qt;ve(C,d),l(new D.Mesh(C.geometry(),jt(u,{PENDULUM:1})),2),await t.yield();const m=qe(d,a.fork("life"),v,s,u,jt,A,!!o.airship);for(const L of m.meshes)l(L,L.userData.order??2);await t.yield();let M=null,g=null;if(o.water!==!1){const L=o.waterRadius??3200,I=new D.CircleGeometry(L,96);I.rotateX(-Math.PI/2);const X=o.upperSky||[c[0],"#6FA8D8"],Z=o.upperSun?new D.Vector3(...o.upperSun).normalize():new D.Vector3(-.947,.276,.167).normalize(),tt={...u,uUpHor:{value:new D.Color(X[0])},uUpZen:{value:new D.Color(X[1])},uSunU:{value:Z},uSunUCol:{value:new D.Vector3(4,3.7,3.1)}};M=l(new D.Mesh(I,new D.ShaderMaterial({uniforms:{...D.UniformsUtils.clone(D.UniformsLib.fog),...tt},vertexShader:ae,fragmentShader:de,fog:!0,depthWrite:!1})),1),g=l(new D.Mesh(I,new D.ShaderMaterial({uniforms:{...D.UniformsUtils.clone(D.UniformsLib.fog),...tt},vertexShader:ae,fragmentShader:me,fog:!0,depthWrite:!1,transparent:!0,premultipliedAlpha:!0})),4)}const z=14/Q.pivot,O=3.4;let B=o.touchU??.49;const W=o.lit||[.3,.85];let _=-1,J=46,H=0,lt=null,N=null;const T=[0,0,1,0],U=(L,I)=>(L%I+I)%I;function ot(L,I=46,X){_=yt(L,0,1),J=I,X!=null&&(B=X)}function at(L,I,X=1,Z=0){T[0]=L,T[1]=I,T[2]=X,T[3]=Z,N=T}function $(L,I,X,Z){u.uMovers.value[12].set(L,I,X,Z)}function j(L,I,X){const Z=Math.min(Math.max(L||0,0),.1);lt===null&&(H=_>=0?(_-B)*J:I),lt=I;let tt=1;if(_>=0){const K=U((_-B)*J-H+2,4)-2;tt=yt(1+K*1.5,.25,2.2),u.uLit.value=pt(W[0],W[1],yt(_/.9,0,1))}else u.uLit.value=.3+.55*Vt(0,50,I%70)*(1-Vt(64,70,I%70));H+=Z*tt;const it=Math.PI*H/4,et=Math.sin(it);if(u.uTime.value=I,u.uSwing4.value=U(H,4),X){const K=X.matrixWorld.elements;u.uCamL.value.set(K[12]-x.position.x,K[14]-x.position.z)}u.uPend.value.set(z*et,O*et*et,Q.pivot),m.update(Z,I,H,N,X)}await t.yield(),j(0,0,null);const st=new D.Vector3(0,62,v.domeZ-104),V=new D.Vector3(0,-62,v.domeZ),Y=[[0,70,-330],[30,70,-200],[20,30,-80],[7,5,0]];for(let L=40;L<=300;L+=32.5)Y.push([v.axis(L),2.5,L]);Y.push([0,30,345],[0,72,405],[0,62,v.domeZ-104],[0,-62,v.domeZ]);const ct={touchPoint:new D.Vector3(0,0,0),pendulumPivot:new D.Vector3(0,-Q.pivot,0),canalAxis:L=>v.axis(L),canalStart:40,canalEnd:300,bridges:v.bridgeZ.slice(),clear:(L,I,X=6)=>v.open(L,I,-X)&&!(v.extra||[]).some(Z=>Math.hypot(L-Z[0],I-Z[1])<Z[2]+X),flyThrough:Y.map(L=>new D.Vector3(L[0],L[1],L[2])),portalSeat:{position:V.clone(),normal:st.clone().sub(V).normalize(),radius:7},diveLine:[st,V],domeCenter:new D.Vector3(0,0,v.domeZ),domeRadius:v.domeR,posts:A.posts,ferries:L=>m.ferries(L),bargeAt:L=>m.bargeAt(L),viewpoints:{reveal:new D.Vector3(0,70,-330),finialPass:new D.Vector3(7,5,-14),canal:new D.Vector3(v.axis(170),2.5,170),domeCrest:new D.Vector3(0,72,405)},lowerSunDir:new D.Vector3(i.x,-i.y,i.z)};return{object:x,radius:230,height:100,center:new D.Vector3(0,24,90),anchors:ct,update:j,dispose(){},ground:!1,groundY:0,setProgress:ot,setBarge:at,setAirship:$,uniforms:u,glsl:{uniforms:Zt,noise:Xt,ripple:Wt,lowerSky:_t},meshes:{city:E,base:M,veil:g},livery:n}}function xe(t,o){const c=k=>{const r=yt((k-40)/260,0,1);return o*Math.sin(r*ht)*Vt(0,.12,r)*(1-Vt(.88,1,r))},n={z0:40,z1:300,axis:c,slope:k=>(c(k+1)-c(k-1))/2,half:20,bridgeZ:[172,234],domeZ:540,domeR:60,basinZ:420,basinR:120,bend:o,isle:[-330-t.range(0,10),-211-t.range(-3,4),46],cityR:640};return n.isles=[n.isle,[62+t.range(0,10),-352+t.range(-8,8),36],[-80+0*t.range(0,12),-394+0*t.range(-6,8),30],[n.isle[0]+46-6+210+18,n.isle[1],27]],n.lagoonL=k=>-(170+1.6*(-k-40)),n.lagoonR=k=>78+.3*(-k-40),n.open=(k,r,i=0)=>{if(r>34&&r<304&&Math.abs(k-c(r))<20+i||Math.hypot(k,r-n.basinZ)<n.basinR+i||Math.hypot(k,r-n.domeZ)<n.domeR+10+i||Math.hypot(k,r)<46+i)return!0;if(r<-40+i&&k>n.lagoonL(r)-i&&k<n.lagoonR(r)+i){for(const f of n.isles)if(Math.hypot(k-f[0],r-f[1])<=f[2]-i)return!1;return!0}return!1},n}function ut(t,o,a,s,c,e=1,n=4){t.lathe(o,s,[[.02,a-.5*e],[.26*e,a-.28*e],[.3*e,a+.22*e],[.05*e,a+.5*e]],4,R([1,.78,.5],1),[p.LAMP,0,n,0],.78)}function se(t,o,a,s,c,e){t.lathe(o,s,[[.38,a],[.36,a+c*.62],[.85,a+c*.9],[.85,a+c],[.5,a+c+.12]],6,e,[p.PLAIN,o*.3,0,0],.2)}function ge(t,o,a,s,c,e){const n=a()*50,k=s/c,r=a.pick(o.plasters),i=F(r,o.rose,a.range(0,.3)),f=a.range(12,17),w=a.chance(.68),h=w?a.range(5.2,6):a.range(4.6,5.2),d=a.int(2,4),u=a.range(3.7,4.5)*(d===2?1.25:1),x=h+d*u+1,l=s/2,v=R(o.stone,a.range(.9,1.02)),y=[p.FACADE,n,k,u];if(w){const S=k/2-.5,C=h-1.1-S,m=[];for(let M=0;M<c;M++)m.push({cx:-l+k*(M+.5),R:S});Dt(t,-l,l,C,h,0,m,F(r,v,.5),[p.PLAIN,n,0,0],.7,R(v,.7),[p.STONE,n,0,0],8);for(let M=0;M<=c;M++){const g=-l+k*M;M===0||M===c?t.box(g-(M?.55:0),0,-.7,g+(M?0:.55),C,0,F(r,v,.5),[p.PLAIN,n,0,0],"xXZ"):Ht(t,g,-.35,0,C,.3,v,6)}t.wall(l,-3.2,-l,-3.2,0,h,R(r,.55),[p.DARK,n,k,0]),t.quad([-l,h-.25,-3.2],[l,h-.25,-3.2],[l,h-.25,-.7],[-l,h-.25,-.7],R(i,.6),[p.PLAIN,n,0,0],[[-l,0],[l,0],[l,2.5],[-l,2.5]]);for(const M of[-1,1])t.wall(M*l,M<0?-3.2:0,M*l,M<0?0:-3.2,0,h,F(r,v,.3),[p.PLAIN,n,0,0]);if(e&&a.chance(.55)){const M=a.int(0,c-1),g=-l+k*(M+.5),z=a.pick([o.red,o.teal,R(o.gold,.8),o.verdi]);t.quad([g-S,h-1.3,.05],[g+S,h-1.3,.05],[g+S,h-2.3,2.1],[g-S,h-2.3,2.1],z,[p.CLOTH,n,.35,2.2],[[0,0],[0,2*S],[2.2,2*S],[2.2,0]])}}else t.wall(l,0,-l,0,0,h,R(F(r,v,.3),1.35),[p.DARK,n,s/c,0]),t.box(-l-.08,0,0,l+.08,.45,.2,F(r,v,.6),[p.STONE,n,0,0],"ZyY"),t.box(-l-.08,h-.9,0,l+.08,h-.3,.2,F(r,v,.6),[p.STONE,n,.5,.3],"ZyY");if(t.wall(l,0,-l,0,h,x,r,y,0,0,i),t.wall(-l,0,-l,-f,w?h:0,x,R(r,.92),y,0,0,i,w?0:-h),t.wall(l,-f,l,0,w?h:0,x,R(r,.92),y,0,0,i,w?0:-h),t.wall(-l,-f,l,-f,0,x,R(r,.88),y,0,0,null,-h),w)for(const S of[-1,1])t.wall(S*l,S<0?-f:-3.2,S*l,S<0?-3.2:-f,0,h,R(r,.9),[p.PLAIN,n,0,0]);t.quad([-l,.03,w?-3.2:0],[l,.03,w?-3.2:0],[l,.03,-f],[-l,.03,-f],o.cap,[p.CAP,2,0,0]),t.box(-l-.1,h-.28,0,l+.1,h+.22,.4,v,[p.STONE,n,.42,.25],"ZyYxX");const b=Math.min(c,a.int(1,3)),A=Math.floor((c-b)/2),P=(S,C,m,M)=>{t.box(S,m-.22,0,C,m,M,v,[p.STONE,n,0,0],"xXZyY");for(const z of[S+.25,C-.25])t.box(z-.12,m-.85,0,z+.12,m-.22,M*.7,R(v,.85),[p.STONE,n,0,0],"xXZy");const g=[p.BALUS,n,1.05,0];t.wall(C,M-.06,S,M-.06,m,m+1.05,v,g),t.wall(S,M-.06,S,0,m,m+1.05,v,g),t.wall(C,0,C,M-.06,m,m+1.05,v,g)};P(-l+k*A+.35,-l+k*(A+b)-.35,h+u*.24,1.15);for(let S=1;S<d;S++)for(let C=0;C<c;C++)a.chance(.22)&&P(-l+k*C+.55,-l+k*(C+1)-.55,h+u*(S+.24),.8);It(t,-l,-f,l,0,x,.9,.7,v,2,.38);const q=x+.9;if(a.chance(.24)){t.quad([-l,q,0],[l,q,0],[l,q,-f],[-l,q,-f],R(o.roof,.8),[p.ROOF,n,0,0],[[0,0],[s,0],[s,f],[0,f]]);const S=[p.BALUS,n,1,0];t.wall(l,0,-l,0,q,q+1,v,S),t.wall(-l,0,-l,-f*.5,q,q+1,v,S),t.wall(l,-f*.5,l,0,q,q+1,v,S);const C=a.range(-l+2,l-5),m=-f*.55;for(const[M,g]of[[C,m],[C+3.6,m],[C,m-3],[C+3.6,m-3]])t.box(M-.08,q,g-.08,M+.08,q+2.7,g+.08,o.dark,[p.PLAIN,n,0,0],"xXzZ");t.box(C-.3,q+2.7,m-3.3,C+3.9,q+2.82,m+.3,o.dark,[p.PLAIN,n,0,0]);for(let M=0;M<4;M++){const g=-l+1.5+M*1.5+a()*.4,z=a.range(.7,1.2),O=a.range(.9,1.6);t.quad([g,q+2.3,-1.6],[g+z,q+2.3,-1.6],[g+z,q+2.3-O,-1.6],[g,q+2.3-O,-1.6],a.pick([o.white,o.white,R(o.rose,1.1),R(o.teal,1.6)]),[p.CLOTH,n+M,.45,0],[[0,0],[0,z],[O,z],[O,0]])}}else t.hipRoof(-l,-f,l,0,q,a.range(2.6,4.2),o.roof,[p.ROOF,n,0,0],.5);const E=a.int(1,3);for(let S=0;S<E;S++)se(t,a.range(-l+1,l-1),q+.6,-a.range(1.2,3)-S%2*(f-5),a.range(2.6,3.8),F(r,o.brick,.5));return{dpt:f,top:q,g0:h}}async function ye(t,o,a,s,c,e){const n=[];for(const k of[-1,1]){e&&k>0&&await e();let r=s.z0+a.range(0,2),i=0;for(;r<s.z1-9;){e&&++i%2===0&&await e();let f=a.int(3,5),w=f*a.range(3,3.4);r+w>s.z1&&(f=3,w=Math.max(8,s.z1-r));const h=r+w/2,d=s.slope(h),u=Math.hypot(1,d),x=-k/u,l=k*d/u,v=s.axis(h)+k*s.half,y=Math.atan2(x,l),b=s.bridgeZ.some(C=>Math.abs(h-C)<w/2+5);t.frame(v,0,h,y),ge(t,o,a,w-.15,f,!0);const A=a.int(1,3);for(let C=0;C<A&&!b;C++){const m=a.range(-w/2+.6,w/2-.6),M=a.range(3.4,5.2),g=a.range(3.4,5),z=a.pick([o.red,o.teal,R(o.gold,.8),o.dark]);t.lathe(m,M,[[.17,0],[.16,g],[.24,g+.05],[.24,g+.3],[.02,g+.75]],6,O=>O>.3?o.gold:z,[p.POLE,m,0,0],.1),t.quad([m-.3,.03,M-.3],[m+.3,.03,M-.3],[m+.3,.03,M+.3],[m-.3,.03,M+.3],o.cap,[p.CAP,0,0,0])}const P=-w/2+.2,q=5.8;t.lathe(P,q,[[.16,0],[.09,.5],[.07,3.3],[.2,3.45],[.05,3.55]],5,o.dark,[p.PLAIN,0,0,0]),ut(t,P,4,q,o,1.15,5);const E=Math.cos(y),S=Math.sin(y);n.push([v+P*E+q*S,h-P*S+q*E]);for(const C of[-w/4,w/4])t.box(C-.04,4.2,0,C+.04,4.28,.7,o.dark,[p.PLAIN,0,0,0],"xXyY"),ut(t,C,3.85,.7,o,.7,4);r+=w+(a.chance(.16)?a.range(2.5,4):0)}}return t.frame(0,0,0,0),{posts:n}}function Me(t,o,a,s){for(const c of s.bridgeZ){const e=a()*30,n=R(o.stone,a.range(.9,1)),k=s.slope(c);t.frame(s.axis(c),0,c,Math.atan(k)*-1);const r=6.4,i=15.6,f=s.half+1.5,w=16,h=x=>Math.abs(x)>=i?0:7.4*Math.sqrt(Math.max(0,1-x/i*(x/i))),d=x=>9.9-4.3*Math.pow(Math.abs(x)/f,1.25);for(let x=0;x<w*2;x++){const l=-f+2*f*x/(w*2),v=-f+2*f*(x+1)/(w*2);for(const y of[-1,1]){const b=y*r,A=[l,h(l),b],P=[v,h(v),b],q=[v,d(v),b],E=[l,d(l),b],S=[[l,A[1]],[v,P[1]],[v,q[1]],[l,E[1]]];y>0?t.quad(A,P,q,E,n,[p.PLAIN,e,.7,0],S):t.quad(P,A,E,q,n,[p.PLAIN,e,.7,0],[S[1],S[0],S[3],S[2]])}(Math.abs(l)<i||Math.abs(v)<i)&&t.quad([l,h(l),-r],[v,h(v),-r],[v,h(v),r],[l,h(l),r],R(F(n,o.brick,.5),.95),[p.PLAIN,e,.8,0],[[l*1.15,0],[v*1.15,0],[v*1.15,12.8],[l*1.15,12.8]]),t.quad([l,d(l),r],[v,d(v),r],[v,d(v),-r],[l,d(l),-r],R(n,.8),[p.STONE,e,0,0])}for(const x of[-1,1]){t.frame(s.axis(c),0,c,-Math.atan(k)+(x<0?Math.PI:0));for(let v=0;v<14;v++){const y=-i+2*i*v/14,b=-i+2*i*(v+1)/14,A=1.25,P=q=>1+A/Math.max(4,Math.hypot(q,h(q)*2));t.quad([y,h(y),r+.2],[b,h(b),r+.2],[b*P(b),h(b)+A*.9,r+.2],[y*P(y),h(y)+A*.9,r+.2],v%2?o.stone:R(o.stone,.85),[p.STONE,e+v,0,0])}t.box(-1,7.2,r,1,9.6,r+.5,o.stone,[p.STONE,e,0,0],"xXZyY");for(let v=-5;v<5;v++){if(v===-1||v===0)continue;const y=v*3.5,b=y+3.5,A=Math.min(d(y),d(b)),P=3.6,q=a.pick(o.plasters);t.box(y+.05,A,2.6,b-.05,A+P,r+.25,q,[p.FACADE,e+v,3.4,P],"xXzZ"),t.quad([y-.1,A+P,r+.7],[b+.1,A+P,r+.7],[b+.1,A+P+1.3,2.4],[y-.1,A+P+1.3,2.4],o.roof,[p.ROOF,e+v,0,0],[[0,0],[3.7,0],[3.7,4.5],[0,4.5]]),v%2&&ut(t,y,A+2.6,r+.65,o,.8,4.5)}const l=d(3.5)-.2;Dt(t,-3.5,3.5,l+3.2,l+7.6,r+.45,[{cx:0,R:2.3}],a.pick(o.plasters),[p.PLAIN,e,0,0],.8,R(o.stone,.7),null,8);for(const v of[-1,1])t.box(v<0?-3.5:2.3,l,r-.35,v<0?-2.3:3.5,l+3.2,r+.45,o.stone,[p.STONE,e,0,0],"xXZ");t.wall(ne(3.5),r+.45,ne(3.5),-r-.45,l,l+7.6,o.plasters[1],[p.FACADE,e+7,4.3,7.6]),t.box(-3.7,l+7.6,r+.2,3.7,l+8.2,r+.8,o.stone,[p.STONE,e,.4,.3],"ZyYxX"),t.box(-f,0,r,-i-.4,.03,r,o.cap,[p.CAP,0,0,0],"")}t.frame(s.axis(c),0,c,-Math.atan(k));const u=d(3.5)-.2;t.hipRoof(-3.6,-r-.5,3.6,r+.5,u+8.2,2.6,o.roof,[p.ROOF,e,0,0],.4),t.lathe(0,0,[[.1,u+10.6],[.5,u+11.2],[.5,u+11.7],[.05,u+12.6]],6,o.gold,[p.GOLD,0,0,0]);for(const x of[-1,1])t.quad([x*f,.03,-r],[x*i,.03,-r],[x*i,.03,r],[x*f,.03,r],o.cap,[p.CAP,2,0,0]);for(const x of[-9,-3,3,9])for(const l of[-3.2,3.2])ut(t,x,h(x)-.75,l,o,.95,5)}t.frame(0,0,0,0)}const ne=t=>t,ie=10.5;function vt(t,o,a,s,c=0){const e=(t+c)*Math.cos(a),n=(o+c)*Math.sin(a);return[e*Math.cos(s),n,e*Math.sin(s)]}async function ke(t,o,a,s,c){const e=s.domeR,n=62,k=Math.acos(ie/e),r=24,i=14,f=a()*9;t.frame(0,0,s.domeZ,0);const w=o.bronze,h=F(o.bronze,o.gold,.3);for(let u=0;u<r;u++){c&&u%4===3&&await c();const x=u/r*ht,l=-Math.sin(x),v=Math.cos(x);for(let q=0;q<i;q++){const E=k*q/i,S=k*(q+1)/i,C=pt(.6,.15,q/i),m=pt(.6,.15,(q+1)/i),M=vt(e,n,E,x,pt(.7,.3,q/i)),g=vt(e,n,S,x,pt(.7,.3,(q+1)/i)),z=vt(e,n,E,x,pt(-1.5,-.45,q/i)),O=vt(e,n,S,x,pt(-1.5,-.45,(q+1)/i)),B=(H,lt,N)=>[H[0]+l*lt*N,H[1],H[2]+v*lt*N],W=[p.BRONZE,f+u,0,0],_=[p.GOLD,0,0,0],J=F(o.bronze,o.gold,.62);t.quad(B(M,C,1),B(g,m,1),B(O,m,1),B(z,C,1),h,W),t.quad(B(g,m,-1),B(M,C,-1),B(z,C,-1),B(O,m,-1),R(h,.8),W),t.quad(B(M,C,-1),B(g,m,-1),B(g,m,1),B(M,C,1),J,_),t.quad(B(z,C,1),B(O,m,1),B(O,m,-1),B(z,C,-1),J,_)}const y=vt(e,n,k,x,-.4);t.lathe(y[0],y[2],[[.05,y[1]-.9],[.7,y[1]-.3],[.7,y[1]+.3],[.05,y[1]+.9]],5,o.gold,[p.GOLD,0,0,0]);const b=vt(e,n,0,x,0),A=Math.cos(x),P=Math.sin(x);t.frame(b[0],0,s.domeZ+b[2],Math.PI/2-x),t.lathe(0,-.3,[[1.75,0],[1.6,1.1],[1.15,1.6],[.95,3.6],[1.2,4],[.6,4.6]],6,q=>q>.7?o.gold:F(o.bronze,o.gold,.2),[p.BRONZE,f,0,0],.52),t.quad([-1.3,.03,-1.6],[1.3,.03,-1.6],[1.3,.03,1],[-1.3,.03,1],o.cap,[p.CAP,0,0,0]),t.frame(0,0,s.domeZ,0)}c&&await c();const d=[.045,.2,.36,.52,.68,.84,1].map(u=>u*k);d.forEach((u,x)=>{const l=x===d.length-1,v=l?36:72,y=l?.9:.42,b=l?o.gold:h,A=[l?p.GOLD:p.BRONZE,f+x,0,0];for(let P=0;P<v;P++){const q=P/v*ht,E=(P+1)/v*ht,S=y*1.4/n,C=vt(e,n,u-S,q,.55),m=vt(e,n,u-S,E,.55),M=vt(e,n,u+S,q,.55),g=vt(e,n,u+S,E,.55),z=vt(e,n,u-S,q,-1.1),O=vt(e,n,u-S,E,-1.1),B=vt(e,n,u+S,q,-1.1),W=vt(e,n,u+S,E,-1.1);t.quad(C,m,g,M,b,A),t.quad(O,z,B,W,b,A),t.quad(z,O,m,C,l?b:w,A),l&&t.quad(M,g,W,B,b,A)}}),t.frame(0,0,0,0)}function be(t,o){const a=new qt,s=o.domeR,c=62,e=Math.acos(ie/s),n=96,k=14;a.frame(0,0,o.domeZ,0);const r=[];for(let i=0;i<=k;i++){const f=e*(.045+.955*i/k),w=[];for(let h=0;h<=n;h++){const d=h/n*ht,u=vt(s,c,f,d,0);w.push(a.v(u[0],u[1],u[2],Math.cos(f)*Math.cos(d),Math.sin(f),Math.cos(f)*Math.sin(d),t.bronze,h/n*96,i*3,[p.GLASS,3.3,0,0]))}r.push(w)}for(let i=0;i<k;i++)for(let f=0;f<n;f++)a.i.push(r[i][f],r[i][f+1],r[i+1][f+1],r[i][f],r[i+1][f+1],r[i+1][f]);return a.geometry()}function bt(t,o,a,s,c,e,n){t.box(o-.06,a,s-.06,o+.06,a+c*.9+1.2,s+.06,[.1,.08,.08],[p.PLAIN,0,0,0],"xXzZ"),t.tri([o,a+c*.9+1.1,s],[o,a+c*.9+1.1-c*.42,s],[o+c,a+c*.9+1.1-c*.2,s+.01],e,[p.CLOTH,n,1.3/Math.max(1,c*.3),0],[[0,0],[0,1],[c,.5]])}function xt(t,o,a,s,c,e,n,k){const r=a()*60,i=a.pick(o.plasters),f=n/2,w=o.stone,h=m=>m-Math.floor(m),d=h(r*.19),u=d<.3?F(i,w,.55+.3*h(r*.53)):d<.62?i:F(i,o.brick,.45+.4*h(r*.53)),x=2+Math.floor(3*h(r*.37)),l=4.4+3.4*h(r*.73),v=2+Math.floor(3*h(r*.61)),y=.6+1*h(r*.91);t.frame(s,0,c,k);const b=f*a.range(.84,.94),A=e*a.range(.76,.84),P=Math.max(2,Math.ceil(A/9));for(let m=0;m<4;m++){t.frame(s,0,c,k+m*Math.PI/2);for(let g=0;g<P;g++){const z=g/P,O=(g+1)/P,B=pt(f,b,z),W=pt(f,b,O),_=A*z,J=A*O;t.quad([-B,_,B],[B,_,B],[W,J,W],[-W,J,W],F(u,o.rose,z*.3),[p.FACADE,r,n/x,l],[[0,_],[n,_],[n,J],[0,J]])}for(let g=1;g<=v;g++){const z=g/(v+1),O=pt(f,b,z);t.box(-O-.3,A*z,O,O+.3,A*z+.9,O+.45,w,[p.STONE,r,.5,.5],"ZyY")}const M=b+.5;t.wall(M,M,-M,M,A+.9,e*.93,F(u,w,.5),[p.DARK,r+m,M*.95,0]),t.box(-M-.3,A,M,M+.3,A+.9,M+.45,w,[p.STONE,r,.45,.5],"ZyY"),t.box(-M-.3,e*.93,M,M+.3,e*.93+.8,M+.45,w,[p.STONE,r,.45,.5],"ZyY")}t.frame(s,0,c,k),t.quad([-f,.03,-f],[f,.03,-f],[f,.03,f],[-f,.03,f],o.cap,[p.CAP,0,0,0]);const q=e*.93+.8,E=b+.8,S=a.int(0,2);S===0?t.hipRoof(-E,-E,E,E,q,(e*.09+n*.7)*y,o.roof,[p.ROOF,r,0,0],0):S===1?t.lathe(0,0,[[E*.95,q],[E*1.15,q+n*.25],[E*.95,q+n*.6],[E*.45,q+n*.95],[.12,q+n*1.5]],8,o.verdi,[p.VERDI,r,0,0],.39):t.lathe(0,0,[[E*.8,q],[E*.8,q+n*.5],[E*.9,q+n*.55],[.1,q+n*1.9]],8,m=>m<.5?F(u,w,.4):o.verdi,[p.VERDI,r,0,0],.39);const C=q+(S===0?(e*.09+n*.7)*y:S===1?n*1.5:n*1.9);t.lathe(0,0,[[.05,C-.3],[.55,C+.3],[.55,C+.8],[.05,C+1.5]],5,o.gold,[p.GOLD,0,0,0]),a.chance(.7)&&bt(t,0,C+1.2,0,a.range(3,5.5),a.pick([o.red,R(o.gold,.8),o.white,o.teal]),r)}function Lt(t,o,a,s,c,e,n){const k=a()*40,r=a.pick(o.plasters),i=o.stone,f=e*a.range(1,1.5);t.frame(s,0,c,n),t.box(-e*1.1,0,-e*2.4,e*1.1,f*.9,e*1.2,r,[p.FACADE,k,4.2,f*.45],"xXzZ"),t.hipRoof(-e*1.1,-e*2.4,e*1.1,e*1.2,f*.9,e*.5,o.roof,[p.ROOF,k,0,0],.6),t.quad([-e*1.1,.03,-e*2.4],[e*1.1,.03,-e*2.4],[e*1.1,.03,e*1.2],[-e*1.1,.03,e*1.2],o.cap,[p.CAP,0,0,0]);for(const u of[-1,1])le(t,o,u<0?-e*1.95:e*1.1,-e*.6,u<0?-e*1.1:e*1.95,e*.6,f*.74,r,k+3+u,4.2,f*.37,1,o.roof,e*.42,.5);const w=f*.9+e*.2,h=[[e*.96,w],[e*.96,w+e*.1]];t.lathe(0,0,[[e,f*.7],[e,w-.6],[e*1.08,w-.5],[e*1.08,w]],16,F(r,i,.6),[p.DARK,k,ht*e/8,0],0);for(let u=1;u<=7;u++){const x=u/7*Math.PI*.5;h.push([e*.96*Math.cos(x)+(u===7?e*.14:0),w+e*.1+e*1.08*Math.sin(x)])}t.lathe(0,0,h,16,o.verdi,[p.VERDI,k,0,0],0);const d=w+e*1.18;return t.lathe(0,0,[[e*.15,d-e*.05],[e*.15,d+e*.28],[e*.22,d+e*.3],[.05,d+e*.55]],8,u=>u<.6?i:o.verdi,[p.STONE,k,0,0]),t.lathe(0,0,[[.05,d+e*.5],[e*.07,d+e*.58],[.05,d+e*.7]],5,o.gold,[p.GOLD,0,0,0]),d+e*.7}function le(t,o,a,s,c,e,n,k,r,i,f,w,h,d,u=.8){const x=F(k,o.rose,.22),l=[p.FACADE,r,i,f],v=[p.ROOF,r,0,0];t.wall(c,e,a,e,0,n,k,l,0,0,x,-f*.1),t.wall(a,s,c,s,0,n,k,l,0,0,x,-f*.1),t.wall(c,s,c,e,0,n,k,l,0,0,x,-f*.1),t.wall(a,e,a,s,0,n,k,l,0,0,x,-f*.1),t.quad([a,.03,s],[c,.03,s],[c,.03,e],[a,.03,e],o.cap,[p.CAP,0,0,0]);const y=c-a,b=e-s;if(w===2)return t.quad([a,n,e],[c,n,e],[c,n,s],[a,n,s],R(h,.8),v,[[0,0],[y,0],[y,b],[0,b]]),t.box(a,n,s,c,n+1.1,e,F(k,o.stone,.5),[p.STONE,r,0,0],"xXzZ"),n+1.1;if(w===0)return t.hipRoof(a,s,c,e,n,d,h,v,u),n+d;const A=u,P=[p.PLAIN,r,0,0],q=R(x,.96);if(y>=b){const E=(s+e)/2,S=Math.hypot(b/2+A,d),C=[a-A,n+d,E],m=[c+A,n+d,E];t.quad([a-A,n,e+A],[c+A,n,e+A],m,C,h,v,[[0,0],[y,0],[y,S],[0,S]]),t.quad([c+A,n,s-A],[a-A,n,s-A],C,m,h,v,[[0,0],[y,0],[y,S],[0,S]]),t.tri([a,n,s],[a,n,e],[a,n+d*.96,E],q,P),t.tri([c,n,e],[c,n,s],[c,n+d*.96,E],q,P)}else{const E=(a+c)/2,S=Math.hypot(y/2+A,d),C=[E,n+d,s-A],m=[E,n+d,e+A];t.quad([a-A,n,s-A],[a-A,n,e+A],m,C,h,v,[[0,0],[b,0],[b,S],[0,S]]),t.quad([c+A,n,e+A],[c+A,n,s-A],C,m,h,v,[[0,0],[b,0],[b,S],[0,S]]),t.tri([c,n,s],[a,n,s],[E,n+d*.96,s],q,P),t.tri([a,n,e],[c,n,e],[E,n+d*.96,e],q,P)}return n+d}function Jt(t,o,a,s,c,e){const n=[.05+.03*(e%1),.15,.09];t.lathe(o,a,[[c*.35,0],[c,s*.22],[c*.85,s*.62],[.06,s]],5,k=>R(n,.8+.5*k),[p.PLAIN,e,0,0],e)}function Ae(t,o,a,s,c,e,n,k,r){const[i,f,w,h,d,u]=k,x=g=>g-Math.floor(g),l=x(w*13.7+u*5.3),v=.38+.24*x(i*9.7+h*3.1),y=x(f*7.9+d*4.3),b=c-a,A=e-s,P=g=>o.plasters[Math.floor(x(f*3.7+g*.37+d)*o.plasters.length)%o.plasters.length],q=g=>R(o.roof,.8+.34*x(u*3.3+g*.41)),E=i*80,S=g=>3.1+2.3*x(h*5.1+g*.63),C=g=>3.3+1.5*x(w*4.3+g*.29),m=(g,z,O,B,W,_,J)=>le(t,o,z,O,B,W,_,P(g),E+g*7.3,S(g),C(g),J,q(g),Math.min(B-z,W-O)*(.34+.3*x(y+g*.37)));let M;if(l<.2)M=[a,s,c,e,n],m(0,a,s,c,e,n,y<.8?0:2);else if(l<.42){const g=a+b*v,z=n*(.58+.5*y);m(0,a,s,g,e,n,1),m(1,g,s+A*.12*y,c,e-A*.2*(1-y),z,y<.5?1:0),M=[a,s,g,e,n]}else if(l<.6){const g=s+A*v,z=n*(.58+.5*y);m(0,a,s,c,g,n,1),m(1,a+b*.15*y,g,c-b*.18*(1-y),e,z,y<.5?1:0),M=[a,s,c,g,n]}else if(l<.8){const g=b*(.36+.16*y),z=A*(.36+.16*(1-y)),O=i>.5,B=h>.5,W=O?c-g:a,_=O?c:a+g,J=O?a:a+g,H=O?c-g:c;m(0,W,s,_,e,n,1),m(1,J,B?e-z:s,H,B?e:s+z,n*(.6+.35*y),1),M=[W,s,_,e,n],u>.5&&Jt(t,(J+H)/2,B?s+(A-z)*.45:e-(A-z)*.45,8+5*y,1.3,E)}else if(l<.92){const g=b*.3,z=A*.34,O=h>.5;m(0,a,s,a+g,e,n,1),m(1,c-g,s,c,e,n*(.75+.3*y),1),m(2,a+g,O?e-z:s,c-g,O?e:s+z,n*(.55+.3*y),0),M=[a,s,a+g,e,n]}else{const g=a+b*(.42+.16*y),z=s+A*(.5+.14*y);m(0,a,s,g,z,n*.8,1),M=[a,s,g,z,n*.8];for(let O=0;O<4;O++)Jt(t,g+(c-g)*(.25+.5*x(y*3.1+O*.37)),s+A*(.12+.25*O),7+6*x(y+O*.61),1.2+.5*x(O*.7+y),E+O);Jt(t,a+(g-a)*.5,z+(e-z)*.55,10+4*y,1.5,E+9)}return M}async function Se(t,o,a,s,c,e,n){const f=Math.ceil(s.cityR/25),w=new Map,h=(m,M)=>m*4096+M,d=(m,M,g,z,O=60)=>{for(let B=0,W=0;B<m&&W<m*O;W++){const _=a()*ht,J=Math.sqrt(a())*(g-M)+M,H=0+Math.cos(_)*J,lt=180+Math.sin(_)*J,N=Math.round(H/25),T=Math.round(lt/25);if(s.open(H,lt,22)||w.has(h(N,T)))continue;let U=!0;for(const[ot,at]of w)if(at.tag===z&&Math.hypot(at.x-H,at.z-lt)<(z==="c"?150:42)){U=!1;break}U&&(w.set(h(N,T),{tag:z,x:N*25,z:T*25}),B++)}};d(10,90,560,"c"),d(Math.round(a.range(62,78)),60,610,"t");const u=(m,M,g)=>(s.extra||(s.extra=[])).push([m,M,g]);u(s.isle[0],s.isle[1]-8,34),u(s.isle[0]+30,s.isle[1]+18,14),Lt(t,o,a,s.isle[0],s.isle[1],17,a.range(-.3,.3)),xt(t,o,a,s.isle[0]+30,s.isle[1]+18,a.range(84,100),10,0);{const[m,M]=s.isles[1];u(m+6,M-4,16),u(m-16,M+14,14),xt(t,o,a,m+6,M-4,a.range(96,112),11,a.range(-.2,.2)),xt(t,o,a,m-16,M+14,a.range(58,72),8.5,a.range(-.2,.2))}{const[m,M]=s.isles[2];u(m,M-6,25),u(m+26,M+10,13),Lt(t,o,a,m,M,12,a.range(-.25,.25)),xt(t,o,a,m+26,M+10,a.range(50,57),8.5,0)}{const[m,M]=s.isles[3];u(m+4,M+2,14),xt(t,o,a,m+4,M+2,a.range(64,76),10,0)}u(-104,22,40),Lt(t,o,a,-104,22,19,Math.PI/2),u(96,-10,18),xt(t,o,a,96,-10,a.range(150,172),13,a.range(-.1,.1)),u(132,44,27),Lt(t,o,a,132,44,12.5,-Math.PI/2),u(-72,-64,14),xt(t,o,a,-72,-64,a.range(72,84),9.5,0),u(70,84,13),xt(t,o,a,70,84,a.range(88,104),9,0),n&&await n();for(const m of w.values())if(n&&await n(),m.tag==="c"){const M=a.range(10.5,16.5);Lt(t,o,a,m.x,m.z,M,a.pick([0,Math.PI/2,Math.PI,-Math.PI/2]))}else{const M=a.chance(.16),g=M?a.range(150,220):a.range(58,125);xt(t,o,a,m.x,m.z,g,M?a.range(11.5,14):a.range(7.5,11),a.range(-.2,.2))}const x=m=>(m%3+3)%3,l=m=>(m%2+2)%2,v=(m,M)=>{const g=Math.sin(m*127.1+M*311.7)*43758.5453;return g-Math.floor(g)},y=new Set;for(const m of w.keys()){const M=Math.floor(m/4096+.5),g=m-M*4096;for(let z=-1;z<=1;z++)for(let O=-1;O<=1;O++)(z||O)&&v(M+z*1.7,g+O*2.3)<(z&&O?.62:.86)&&y.add(h(M+z,g+O))}n&&await n();for(let m=-f;m<=f;m++){n&&await n();for(let M=-f;M<=f;M++){const g=0+m*25,z=180+M*25,O=Math.hypot(g-0,z-180),B=s.cityR*(.84+.16*e.n2(g*.004+9,z*.004)),W=a(),_=a(),J=a(),H=a(),lt=a(),N=a(),T=s.isles.some((dt,Ft)=>Ft>0&&Math.hypot(g-dt[0],z-dt[1])<dt[2]),U=h(Math.round(g/25),Math.round(z/25));if(O>B&&!T||w.has(U)||y.has(U)&&!T||Math.abs(e.n2(g*.0045+3.1,z*.0045-7.7))<.12||Math.abs(e.n2(g*.0023-11.3,z*.0023+5.9))<.05)continue;const ot=Math.floor(m/3),at=Math.floor(M/2),$=e.n2(ot*.9+40,at*.9-13);if($>.4||e.n2(g*.0075+71.3,z*.0075+23.9)>.46)continue;const j=g-25/2+(x(m)===0?3.2:.15+W*.5),st=g+25/2-(x(m)===2?3.2:.15+_*.5),V=z-25/2+(l(M)===0?3.2:.15+J*.5),Y=z+25/2-(l(M)===1?3.2:.15+H*.5),ct=(j+st)/2,L=(V+Y)/2,I=st-j,X=Y-V,Z=I/2,tt=X/2;if(s.open(ct,L,Math.max(I,X)*.6)||s.extra&&s.extra.some(dt=>Math.hypot(ct-dt[0],L-dt[1])<dt[2]))continue;const it=Math.hypot(ct-yt(ct,-30,30),L-yt(L,-60,560));if(it>260&&lt>c*(1.2-it/900))continue;const et=dt=>dt-Math.floor(dt),K=et(W*7.31+lt*3.77),wt=et(_*5.13+N*9.1),Pt=et(J*11.7+W*2.9),Mt=et(H*3.3+_*6.1),Ct=(9+5*$+13*Math.pow(lt,1.6)+5*Math.max(0,1-O/380))*(N>.92?1.4:1),mt=W*80,Ot=o.plasters[_*o.plasters.length|0];t.frame(ct,0,L,0);const[At,St,Rt,Et,Nt]=Ae(t,o,-Z,-tt,Z,tt,Ct,[W,_,J,H,lt,N],$),Tt=Math.min(Rt-At,Et-St)/2,Kt=R(o.roof,.86+N*.28),te=[p.ROOF,mt,0,0],zt=Tt*.5,Bt=Nt;it<150&&(se(t,At+(Rt-At)*(.2+lt*.6),Bt+zt*.3,St+(Et-St)*(.25+J*.5),2.6+N+zt*.5,F(Ot,o.brick,.5)),H>.8&&bt(t,(At+Rt)*.5,Bt+zt+1,(St+Et)*.5,2.6,lt>.5?o.red:R(o.gold,.8),mt));const ce=it<420?.4:.2;if(Pt<ce){const dt=Mt*3|0,Ft=K<.5?At:Rt,ee=wt<.78?St:Et,Gt=K<.5?-1:1,Ut=wt<.78?-1:1;if(dt===0){const G=2.1+wt*1.1,gt=Math.max(3,Nt-9),ft=Nt+4+K*9,rt=Ft+Gt*G*.45,kt=ee+Ut*G*.45;t.lathe(rt,kt,[[G,gt],[G,ft],[G*1.25,ft+.3]],7,F(Ot,o.stone,.35),[p.FACADE,mt+3,G*.9,4.2],.2),t.lathe(rt,kt,[[G*1.3,ft+.3],[G*.6,ft+G*1.6],[.08,ft+G*4.2]],7,Mt*3%1<.5?o.verdi:Kt,Mt*3%1<.5?[p.VERDI,mt,0,0]:te,.2),t.lathe(rt,kt,[[.05,ft+G*4.1],[.4,ft+G*4.5],[.05,ft+G*5.1]],4,o.gold,[p.GOLD,0,0,0])}else if(dt===1){const G=2.6+wt*1.2,gt=Nt+zt+5+K*15,ft=Ft-Gt*G*.6,rt=ee-Ut*G*.6,kt=[p.FACADE,mt+5,G,4.4];t.box(ft-G,Nt*.5,rt-G,ft+G,gt,rt+G,F(Ot,o.rose,.25),kt,"xXzZ"),t.box(ft-G-.4,gt,rt-G-.4,ft+G+.4,gt+.7,rt+G+.4,o.stone,[p.STONE,mt,.5,.4],"xXzZy"),t.hipRoof(ft-G,rt-G,ft+G,rt+G,gt+.7,G*(1.3+Mt),K<.4?o.verdi:Kt,K<.4?[p.VERDI,mt,0,0]:te,.6)}else{const G=Math.min(Tt*.55,3.6+wt*2.4),gt=(At+Rt)/2+Gt*Tt*.3,ft=(St+Et)/2+Ut*Tt*.3,rt=Bt+zt*.35;t.lathe(gt,ft,[[G,rt],[G,rt+G*.9],[G*1.12,rt+G],[G*1.05,rt+G*1.5],[G*.7,rt+G*2.05],[G*.2,rt+G*2.35],[.06,rt+G*3.1]],8,kt=>kt<.3?F(Ot,o.stone,.5):o.verdi,[p.VERDI,mt,0,0],.3)}}}}const b=s.isle[1],A=s.isle[0]+s.isle[2]-6,P=A+210,q=P-A,E=14,S=q/E,C=R(o.stone,.95);t.frame(A,0,b,0);for(const m of[-1,1]){t.frame(m>0?A:P,0,b,m>0?0:Math.PI);const M=[];for(let g=0;g<E;g++)M.push({cx:S*(g+.5),R:S/2-1.3});Dt(t,0,q,1.2,S/2+2.6,4,M,C,[p.PLAIN,3,.8,0],m>0?8:0,R(F(C,o.brick,.4),.85),[p.PLAIN,3,.9,0],6);for(let g=0;g<=E;g++)t.box(S*g-1.3,0,3.6,S*g+1.3,1.2,4.6,C,[p.STONE,g,0,0],"xXZ"),t.box(S*g-1,1.2,4,S*g+1,S/2+3.9,4.5,R(C,1.04),[p.STONE,g,0,0],"xXZY");t.box(0,S/2+2.6,4,q,S/2+3.1,4.4,C,[p.STONE,1,.6,.3],"ZyY"),t.wall(q,4.1,0,4.1,S/2+3.1,S/2+4.2,C,[p.BALUS,2,1.1,0]);for(let g=0;g<=E;g++){const z=S*g;t.lathe(z,4.2,[[.12,S/2+3.9],[.07,S/2+7]],4,o.dark,[p.PLAIN,0,0,0]),ut(t,z,S/2+7.5,4.2,o,1.3,5)}}t.frame(A,0,b,0),t.quad([0,S/2+3.1,-4],[q,S/2+3.1,-4],[q,S/2+3.1,4],[0,S/2+3.1,4],R(C,.7),[p.STONE,0,0,0]);for(let m=0;m<=E;m++)t.quad([S*m-1.3,.03,-4.6],[S*m+1.3,.03,-4.6],[S*m+1.3,.03,4.6],[S*m-1.3,.03,4.6],o.cap,[p.CAP,0,0,0]);t.frame(0,0,0,0),s.longBridge={x0:A,x1:P,z:b,y:S/2+3.1}}function Qt(t,o,a,s,c,e,n,k=.5,r=8,i=!1){const f=w=>{const h=Math.abs(w);return[a/2*Math.pow(Math.max(0,1-Math.pow(h,2.4)),.55)+.04,s*(1+k*w*w*(w>0?1.4:.8))]};for(let w=0;w<r;w++){const h=-1+2*w/r,d=-1+2*(w+1)/r,u=h*o/2,x=d*o/2,[l,v]=f(h),[y,b]=f(d);for(const P of[-1,1]){const q=[P*l*.7,0,u],E=[P*y*.7,0,x],S=[P*y,b,x],C=[P*l,v,u];P>0?t.quad(E,q,C,S,c,n,[[x,0],[u,0],[u,v],[x,b]],e):t.quad(q,E,S,C,c,n,[[u,0],[x,0],[x,b],[u,v]],e)}if(t.quad([-l,v-.15,u],[l,v-.15,u],[y,b-.15,x],[-y,b-.15,x],R(e,.5),n),i)for(const P of[-1,1])for(const[q,E]of[[.8,.98],[.36,.45]]){const S=(z,O,B,W)=>[P*(z*(.7+.3*W)+.035),O*W,B],C=S(l,v,u,q),m=S(y,b,x,q),M=S(y,b,x,E),g=S(l,v,u,E);P>0?t.quad(m,C,g,M,e,[p.GOLD,0,0,0]):t.quad(C,m,M,g,e,[p.GOLD,0,0,0])}const A=R(F(c,[.16,.1,.1],.72),.8);for(const P of[-1,1])t.quad([0,.02,u],[0,.02,x],[P*y*.7,.02,x],[P*l*.7,.02,u],R(A,.2),[p.PLAIN,2,.22,0],[[0,u],[0,x],[y,x],[l,u]],R(A,.3))}}function qe(t,o,a,s,c,e,n,k){const r=[],i=new qt,f=[],w=(N,T)=>{const U=i.nv;i.frame(0,0,0,0),T();for(let ot=U;ot<i.nv;ot++)f.push(N,0,0,0)},h=t.gold,d=[p.PLAIN,1,0,0];w(0,()=>{Qt(i,30,5.4,1.5,R(t.red,.62),h,d,.9,10,!0);for(let N=-3;N<=3;N++)for(const T of[-1,1])Ht(i,T*1.9,N*2.1-2,1.4,3.1,.13,h,5);i.box(-2.3,4.5,-8.8,2.3,4.8,4.8,h,[p.GOLD,0,0,0],"xXzZy"),i.hipRoof(-2.3,-8.8,2.3,4.8,4.8,1.3,t.red,[p.CLOTH,2,0,1.5],.25);for(const N of[-1,1])i.quad([N*2.3,4.5,-8.8],[N*2.3,4.5,4.8],[N*2.3,3.8,4.8],[N*2.3,3.8,-8.8],t.red,[p.CLOTH,3,.5,1.2],[[0,0],[0,13.6],[.7,13.6],[.7,0]]);i.lathe(0,14.6,[[.28,2.6],[.2,4.6],[.45,5.2],[.6,5.9],[.35,6.5],[.05,7.1]],6,h,[p.GOLD,0,0,0]),i.box(-1.6,1.8,-14.2,1.6,3.6,-10.4,t.red,d,"xXzZ"),i.box(-1.8,3.6,-14.4,1.8,3.85,-10.2,h,[p.GOLD,0,0,0]);for(const N of[-12,-6,0,6,12])for(const T of[-1,1])ut(i,T*2.5,3.2,N,t,.75,5);bt(i,0,3.85,-12.3,4.2,t.red,1),bt(i,0,2.6,13.2,3,R(h,.8),2);for(let N=-4;N<=4;N++)for(const T of[-1,1])i.quad([T*2.5,1.5,N*2.4-.08],[T*2.5,1.5,N*2.4+.08],[T*6.2,.15,N*2.4+.7],[T*6.2,.15,N*2.4+.5],h,d)});const u=()=>{Qt(i,24,5.6,1.4,t.white,R(t.teal,1.2),d,.35,8),i.box(-2.3,1.3,-8.5,2.3,3.9,6.5,t.white,[p.FACADE,5,1.9,2.6],"xXzZ"),i.box(-2.7,3.9,-9,2.7,4.1,7.2,R(t.white,.9),d),i.box(-1.9,4.1,-7,1.9,6.3,3.5,t.white,[p.FACADE,8,1.75,2.2],"xXzZ"),i.box(-2.3,6.3,-7.6,2.3,6.5,4.2,R(t.white,.9),d),i.wall(2.7,7.2,2.7,-9,4.1,5,t.white,[p.BALUS,1,.9,0]),i.wall(-2.7,-9,-2.7,7.2,4.1,5,t.white,[p.BALUS,1,.9,0]),i.lathe(0,-3.5,[[.75,6.5],[.7,8.4],[.8,8.5],[.8,9],[.6,9.05]],8,N=>N>.45?t.red:R(t.white,.9),d),ut(i,0,2.9,10.6,t,.9,5),ut(i,0,7.2,4,t,.7,4),bt(i,0,2.2,-11,2.4,t.red,4)};w(1,u),w(2,u),w(3,u),w(4,()=>{for(const N of[-7.2,.4]){i.box(-1.2,.45,N,1.2,3.25,N+6.8,t.red,[p.FACADE,3,1.36,2.8],"xXzZy"),i.box(-1.28,3.25,N-.1,1.28,3.42,N+6.9,t.white,d),i.box(-.9,3.42,N+.5,.9,3.6,N+6.3,R(t.white,.85),d,"xXzZY"),i.box(-1.24,1.42,N-.02,1.24,1.56,N+6.82,R(h,.8),d,"xXzZ");for(const T of[N+1.2,N+5.6])i.box(-.9,0,T-.5,.9,.45,T+.5,t.dark,d,"xXzZ")}i.box(-.04,3.6,2.5,.04,5,2.58,t.dark,d,"xXzZ"),i.box(-.7,5,2.3,.7,5.06,2.8,t.dark,d),ut(i,0,2.3,7.35,t,.8,6),ut(i,0,2.3,-7.35,t,.5,3)});const x=30,l=6.5;w(5,()=>{for(let N=0;N<x;N++){const T=(N%2?.9:-.9)+o.range(-.3,.3),U=N*l+o.range(-.8,.8);i.box(U-.22,0,T-.16,U+.22,1.5,T+.16,t.dark,d,"xXzZ"),i.lathe(U,T,[[.02,1.45],[.16,1.62],[.02,1.8]],4,R(t.dark,1.5),d),i.box(U+.2,1.2,T-.02,U+.26,2.5,T+.02,t.dark,d,"xXzZ"),ut(i,U+.23,2.75,T,t,.6,5)}});const v=()=>{Qt(i,11,1.5,.55,[.03,.03,.04],R(h,.6),d,2.2,8),i.box(-.5,.5,-1.4,.5,1.5,.6,t.dark,d,"xXzZY"),i.box(-.2,.6,-4.3,.2,2.3,-3.95,t.dark,d,"xXzZ"),i.lathe(0,-4.1,[[.02,2.25],[.17,2.42],[.02,2.6]],4,R(t.white,.6),d),ut(i,0,1.25,4.6,t,.55,5)};w(6,v),w(7,v),w(8,u),w(9,u),w(10,u),w(11,u),k&&w(12,()=>{const $=R(t.white,.92),j=R(t.red,.9),st=V=>11.5*Math.pow(Math.max(0,Math.sin(Math.PI*Math.pow(V,.82))),.62);for(let V=0;V<18;V++){const Y=V/18,ct=(V+1)/18,L=(Y-.5)*120,I=(ct-.5)*120,X=st(Y),Z=st(ct);for(let tt=0;tt<12;tt++){const it=tt/12*ht,et=(tt+1)/12*ht,K=tt%3===0?j:$,wt=[p.PLAIN,tt,0,0],Pt=[Math.cos(it)*X,15.5+Math.sin(it)*X,L],Mt=[Math.cos(et)*X,15.5+Math.sin(et)*X,L],Ct=[Math.cos(et)*Z,15.5+Math.sin(et)*Z,I],mt=[Math.cos(it)*Z,15.5+Math.sin(it)*Z,I];X<.05?i.tri(Pt,Ct,mt,K,wt):Z<.05?i.tri(Pt,Mt,Ct,K,wt):i.quad(Pt,Mt,Ct,mt,K,wt,[[0,L],[1,L],[1,I],[0,I]])}if(V>1&&V<17&&V%3===0)for(let tt=0;tt<12;tt++){const it=tt/12*ht,et=(tt+1)/12*ht,K=st(Y)+.12;i.quad([Math.cos(it)*K,15.5+Math.sin(it)*K,L-.4],[Math.cos(et)*K,15.5+Math.sin(et)*K,L-.4],[Math.cos(et)*K,15.5+Math.sin(et)*K,L+.4],[Math.cos(it)*K,15.5+Math.sin(it)*K,L+.4],h,[p.GOLD,0,0,0])}}for(const[V,Y]of[[1,0],[-1,0],[0,1],[0,-1]]){const L=[V*3,15.5+Y*3,-34],I=[V*15,15.5+Y*15,-48],X=[V*15,15.5+Y*15,-58],Z=[V*2,15.5+Y*2,-54];i.quad(L,I,X,Z,j,d),i.quad(Z,X,I,L,j,d)}i.box(-2.6,0,-10,2.6,3.6,16,t.white,[p.FACADE,11,2,3.4],"xXzZ"),i.box(-2.9,-.3,-10.6,2.9,0,16.6,h,[p.GOLD,0,0,0]),i.box(-2.8,3.6,-10.4,2.8,4.1,16.4,R(t.white,.85),d,"xXzZ");for(const V of[-9,-3,3,9,15])for(const Y of[-1,1])ut(i,Y*3.1,1.2,V,t,.9,6),i.box(Y*2.2-.08,3.6,V-.08,Y*2.2+.08,15.5-11.5*.78,V+.08,t.dark,d,"xXzZ");for(const V of[-1,1])i.box(V*9-1.2,5.2,-22,V*9+1.2,7.6,-15,t.dark,d),ut(i,V*9,4.6,-18.5,t,.8,5);ut(i,0,1.2,18,t,1.6,7),bt(i,0,15.5,-120/2-1,7,t.red,6),bt(i,0,4.2,16.4,3.4,R(h,.8),7)});const y=i.geometry();y.setAttribute("aMove",new D.Float32BufferAttribute(f,4)),r.push(new D.Mesh(y,e(c,{MOVER:1})));const b=Math.round(72*s),A=new qt,P=[];for(let N=0;N<b;N++){const T=o()*ht,U=Math.sqrt(o())*12,ot=Math.cos(T)*U,at=Math.sin(T)*U*1.5,$=o(),j=o.range(.85,1.2)*2.5,st=R(o.pick([t.white,t.white,[.72,.72,.78],[.8,.76,.78],[.5,.5,.58]]),1.3),V=[p.PLAIN,$,0,0],Y=A.v(0,0,.17*j,0,1,0,st,0,0,V),ct=A.v(0,0,-.15*j,0,1,0,R(st,.7),0,0,V),L=A.v(-.62*j,0,-.12*j,0,1,0,R(st,.22),0,0,V),I=A.v(.62*j,0,-.12*j,0,1,0,R(st,.22),0,0,V);A.i.push(Y,ct,L,Y,I,ct),P.push(ot,at,$,0,ot,at,$,0,ot,at,$,1,ot,at,$,1)}const q=A.geometry();q.setAttribute("aMove",new D.Float32BufferAttribute(P,4)),r.push(new D.Mesh(q,e(c,{FLOCK:1}))),c.uFlock.value.set(a.axis(185),185,10,34);const E=new D.Mesh(be(t,a),e(c,{},{transparent:!0,depthWrite:!1}));E.userData.order=3,r.push(E);const S=(N,T)=>{const U=yt(N,a.z0,a.z1);return[a.axis(U)+T,N,Math.atan(a.slope(U))]},C=a.z0+6,m=a.z1-6,M=m-C,g=9,z=2*M+ht*g,O=N=>{if(N=(N%z+z)%z,N<M)return[a.axis(C+N)-g,C+N];if(N<M+Math.PI*g){const U=(N-M)/g;return[a.axis(m)-g*Math.cos(U),m+g*Math.sin(U)]}if(N<2*M+Math.PI*g){const U=m-(N-M-Math.PI*g);return[a.axis(U)+g,U]}const T=(N-2*M-Math.PI*g)/g;return[a.axis(C)+g*Math.cos(T),C-g*Math.sin(T)]},B=N=>O(N*7+60),W=Array.from({length:7},()=>[0,0,0,0]),_=(N,T,U,ot,at)=>{const $=W[N];$[0]=T,$[1]=U,$[2]=ot,$[3]=at},J=N=>{const T=a.bend>=0?1:-1,U=N*.034+.6,ot=230+Math.sin(U)*44,at=-T*9+2.4*Math.cos(U);{const V=N*.024+4.2;_(0,Math.cos(V)*104,a.basinZ+24+Math.sin(V)*22,Math.atan2(-Math.sin(V)*104,Math.cos(V)*22),.6)}const $=N*.028+2.6;_(1,Math.cos($)*78,a.basinZ+24+Math.sin($)*13,Math.atan2(-Math.sin($)*78,Math.cos($)*13),.7);const j=N*.03+2;_(2,58+Math.sin(j)*36,-150+Math.cos(j)*12,Math.atan2(Math.cos(j)*36,-Math.sin(j)*12),Math.abs(Math.cos(j))*.7);const st=N%180;for(let V=0;V<4;V++)_(3+V,[-170,-134,-104,-58][V]+.8*st,-292+[6,-8,10,-9][V],Math.PI/2,.25);return W},H=c.uMovers.value;function lt(N,T,U,ot){let at,$,j=0,st=1;if(ot)at=ot[0],$=ot[1],st=ot[2],j=ot[3]||0;else{const Z=T*7+60,tt=O(Z-.6),it=O(Z+.6);[at,$]=O(Z),j=Math.atan2(it[0]-tt[0],it[1]-tt[1]);const et=Math.cos(j);st=et*et*et*et}const V=Math.cos(j)>=0?1:-1;H[0].set(at,$,j,Math.sin(T*.9)*.05),c.uBarge.value.set(at,$+13*V,st,V);const Y=J(T);for(let Z=0;Z<7;Z++)H[Z<3?1+Z:5+Z].set(Y[Z][0],Y[Z][1],Y[Z][2],Math.sin(T*.7+Z*2)*.06);for(let Z=0;Z<3;Z++)c.uWakes.value[Z].set(Y[Z][0]+Math.sin(Y[Z][2])*11,Y[Z][1]+Math.cos(Y[Z][2])*11,Y[Z][2],Y[Z][3]);const ct=S(170+Math.sin(T*.085)*112,-a.half+1.9);H[4].set(ct[0],ct[1],ct[2],0);const L=a.longBridge;L&&H[5].set(L.x0+4+T*1.1%l,L.z,0,L.y);const I=T*.05,X=T*.045+2.4;H[6].set(Math.sin(I)*60,a.basinZ+24+Math.cos(I*1.3)*16,Math.atan2(Math.cos(I)*60,-Math.sin(I*1.3)*20.8),Math.sin(T*1.3)*.04),H[7].set(a.isle[0]+95+Math.cos(X)*30,a.isle[1]+20+Math.sin(X)*55,Math.atan2(-Math.sin(X)*30,Math.cos(X)*55),Math.sin(T*1.1)*.04)}return{meshes:r,update:lt,ferries:J,bargeAt:B}}export{Ce as buildHero};
