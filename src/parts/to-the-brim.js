import*as a from"three";import{mergeGeometries as Le}from"three/addons/utils/BufferGeometryUtils.js";const G={height:.88,footR:.15,stemR:.018,bowlY:.36,bowlH:.52,wall:.007},re=.5,ce=G.bowlY+G.bowlH*re,V=8,Ke=96,ft=.004,vt=.0055,S=Math.PI;function ue(e){return e<.42?Math.max(G.stemR,.18*Math.sqrt(Math.max(Math.sin(.5*S*e/.42),0))):.165+.015*Math.cos(S*(e-.42)/.58)}const dt=`
float bowlR(float s){
  float a = 0.18*sqrt(max(sin(1.5707963*clamp(s,0.0,0.42)/0.42),0.0));
  float b = 0.165+0.015*cos(3.14159265*(clamp(s,0.42,1.0)-0.42)/0.58);
  return max(0.018, s<0.42 ? a : b);
}`,Ae=`
float h11(float p){ p = fract(p*0.1031); p *= p+33.33; p *= p+p; return fract(p); }
float h31(vec3 p){ p = fract(p*0.1031); p += dot(p, p.zyx+31.32); return fract((p.x+p.y)*p.z); }
float vnoise(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x), mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x), f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x), mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x), f.y), f.z); }
float breath(vec3 fp, float t){ float k = h31(floor(fp*7.0)+3.0);
  return 1.0 + 0.045*sin(t*(3.1+3.0*k)+k*40.0) + 0.025*sin(t*(5.3+2.6*k)+k*17.0); }
`,mt=`
uniform float uGustM;
float gustD(float z){
  float a = z < -40.0 ? 150.0+(z+262.0)/37.0 : (z < 58.0 ? 156.0+(z+40.0)/12.25 : (z < 130.0 ? 164.0+(z-58.0)*0.5 : 200.0+(z-130.0)/13.5714));
  return (a-uGustM)*2.0; }
`,he=`#include <common>
#include <fog_pars_vertex>
`,pe=`#include <common>
#include <fog_pars_fragment>
`,We=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    col *= exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #else
    col *= 1.0-smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#endif`,ge=e=>new a.Color(e),Re={ruby:{deep:"#3a0410",body:"#8e0f22",edge:"#ff3b2e",caustic:"#c2162c"},gold:{deep:"#4a2e06",body:"#a07318",edge:"#eebb4e",caustic:"#d09a30"},rose:{deep:"#521220",body:"#a8364a",edge:"#f07a78",caustic:"#c84c60"}};function q(e,t,r={}){const l=[],n=[],d=[],o=[],f=e.length;for(let v=0;v<f;v++){const h=e[Math.max(0,v-1)],p=e[Math.min(f-1,v+1)];let w=p[0]-h[0],c=p[1]-h[1];f===1&&(w=0,c=1);const M=Math.hypot(w,c)||1,A=c/M,$=-w/M;for(let Y=0;Y<t;Y++){const R=Y/t*S*2,H=Math.cos(R),I=Math.sin(R);l.push(e[v][0]*H,e[v][1],e[v][0]*I),r.up?n.push(0,1,0):n.push(A*H,$,A*I),d.push(e[v][2],e[v][3])}}for(let v=0;v<f-1;v++)for(let h=0;h<t;h++){const p=v*t+h,w=v*t+(h+1)%t,c=p+t,M=w+t;o.push(p,c,w,w,c,M)}if(r.bottom){const v=l.length/3;l.push(0,r.bottom[0],0),n.push(0,r.up?1:-1,0),d.push(r.bottom[1],r.bottom[2]);for(let h=0;h<t;h++)o.push(v,h,(h+1)%t)}if(r.top){const v=l.length/3,h=(f-1)*t;l.push(0,r.top[0],0),n.push(0,1,0),d.push(r.top[1],r.top[2]);for(let p=0;p<t;p++)o.push(v,h+(p+1)%t,h+p)}const u=new a.BufferGeometry;return u.setAttribute("position",new a.Float32BufferAttribute(l,3)),u.setAttribute("normal",new a.Float32BufferAttribute(n,3)),u.setAttribute("uv",new a.Float32BufferAttribute(d,2)),u.setIndex(o),u}const ne=(e,t=0)=>[ue(e)-t,G.bowlY+G.bowlH*e,0,e];function ht(e){const t=G.bowlY;if(e==="far")return q([[.07,0,1,0],[.03,t+.03,1,1],[ue(.5),ce,0,.5],ne(1)],4);if(e==="speck")return q([[.07,0,1,0],[.03,t+.03,1,0],ne(1)],3);if(e==="mid")return q([[.15,.006,2,1],[.022,.05,1,0],[.019,t-.012,1,1],ne(.07),ne(.5),ne(1)],5);if(e==="near")return q([[.15,.004,2,1],[.143,.017,2,.95],[.022,.05,1,0],[.018,t-.015,1,1],ne(.05),ne(.42),ne(1)],10);const r=[[.138,0,2,.92],[.147,.003,2,.98],[.15,.009,2,1],[.147,.015,2,.98],[.138,.019,2,.92]];for(let d=1;d<=6;d++){const o=d/6,f=.138-(.138-.026)*o;r.push([f,.019+.03*o*o+.004*Math.exp(-Math.pow((f-.052)/.008,2)),2,f/.15])}for(let d=0;d<=9;d++){const o=d/9,f=.0185-.003*Math.sin(S*o)+.012*Math.exp(-Math.pow((o-.93)/.05,2))+.008*Math.pow(1-o,6)+.01*Math.pow(o,14);r.push([f,.052+(t-.052)*o,1,o])}for(let d=1;d<=22;d++){const o=Math.pow(d/22,1.25);r.push(ne(Math.max(o,.012)))}const l=G.height,n=ft;r.push([.15-n*.15,l+n*.42,3,1],[.15-n*.5,l+n*.55,3,1],[.15-n*.85,l+n*.42,3,1],[.15-n,l,3,1]);for(let d=1;d<=5;d++){const o=1-.46*(d/5);r.push([ue(o)-n*.85,t+G.bowlH*o,4,o])}return q(r,Ke)}function pt(e){const t=G.wall+.002,r=e==="near"?10:e==="mid"?5:e==="far"?4:3,l=G.bowlY+.006,n=e==="far"||e==="speck"?q([[ue(re)-t,ce,0,1]],r,{bottom:[l,0,0]}):q([[ue(.16)-t,G.bowlY+G.bowlH*.16,0,.32],[ue(re)-t,ce,0,1]],r,{bottom:[l,0,0]}),d=q([[ue(re)-t,ce,1,1]],r,{top:[ce,1,0],up:!0}),o=Le([n,d]);return n.dispose(),d.dispose(),o}function gt(){const e=Ke,t=[],r=[];for(let o=0;o<=9;o++)t.push([1,Math.pow(o/9,.8),0,o/9]);for(let o=8;o>=1;o--){const f=Math.sqrt(o/8);r.push([f,0,1,f])}const l=q(t,e),n=q(r,e,{top:[0,1,0],up:!0}),d=Le([l,n]);return l.dispose(),n.dispose(),d}const je=`
attribute vec4 aFlame;
uniform float uTime, uPix;
varying vec3 vW; varying vec3 vN; varying vec2 vUv; varying vec4 vFl; varying vec3 vL; varying float vHl; varying float vThin;
// (GSC: how many times the hall's glass this one is drawn: 1, or 8 for the great glass, BIG. glassPx is one pixel's size
// at the glass's middle in the glass's OWN measure, so that every law below holds at either size)
#ifdef BIG
  #define GSC 8.0
#else
  #define GSC 1.0
#endif
float glassPx(){
  #ifdef USE_INSTANCING
    return length(cameraPosition-(modelMatrix*vec4(instanceMatrix[3].xyz+vec3(0.0,0.5*GSC,0.0),1.0)).xyz)*uPix/GSC;
  #else
    return 0.0;
  #endif
}
`,Qe=`
  vec3 nn = n; vHl = 1.0;
  #ifdef MEANS
    vHl = 1.0-smoothstep(0.03,0.12,glassPx());
  #endif
  #ifdef USE_INSTANCING
    p = (instanceMatrix*vec4(p,1.0)).xyz; nn = mat3(instanceMatrix)*nn;
  #endif
  vec4 wp = modelMatrix*vec4(p,1.0);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix)*nn + vec3(0.0,1e-6,0.0));
  vFl = vec4((modelMatrix*vec4(aFlame.xyz,1.0)).xyz, aFlame.w);
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
`,Je=`
uniform float uTime, uSurge, uFillAmt, uK;
uniform vec3 uFlameCol, uAmb, uFill, uFillDir, uWineDeep, uWineBody, uWineEdge, uGwE, uGwW;
uniform vec2 uCut;
varying vec3 vW; varying vec3 vN; varying vec2 vUv; varying vec4 vFl; varying vec3 vL; varying float vHl; varying float vThin;
#ifdef BIG
// THE GREAT GLASS stands in a ring of six candles (uRing: their flames, world): ringSpec is the brightest of their six
// images along the mirrored ray R (the nearest flame's, vFl, is one of the six), ringC their light's middle
uniform vec3 uRing[6]; uniform vec3 uCool;
float ringSpec(vec3 P, vec3 R){ float m = 0.0;
  for (int i = 0; i < 6; i++) { vec3 Lv = uRing[i]-P; m = max(m, dot(R, Lv*inversesqrt(max(dot(Lv,Lv),1e-4)))); }
  return max(m, 0.0); }
vec3 ringMid(){ return (uRing[0]+uRing[1]+uRing[2]+uRing[3]+uRing[4]+uRing[5])/6.0; }
#endif
`+Ae+`
// a line that lies along a surface's top edge, from y0 up to 1 (y: the surface's own height, 0 to 1; w: a pixel's
// footprint in it): its mean over the part of the footprint that lies on the surface, never less and never more
float topLine(float y, float y0, float w){ float hi = min(1.0, y+0.5*w), lo = max(0.0, y-0.5*w); return clamp((hi-max(y0,lo))/max(hi-lo,1e-5), 0.0, 1.0); }
// what every surface needs to know of its flame
#define LIGHT   vec3 V = normalize(cameraPosition - vW + vec3(0.0,1e-5,0.0));   vec3 Lv = vFl.xyz - vW; float d2 = dot(Lv,Lv); vec3 L = Lv*inversesqrt(max(d2,1e-4));   float br = breath(vFl.xyz, uTime); float att = vFl.w*br/(1.0+d2*uK);
`,De=he+je+`
#ifdef DEC
attribute vec3 aLocal;
#endif
void main(){ vec3 p = position; vec3 n = normal; vUv = uv; vL = position; vThin = 1.0;
  #ifdef DEC
    vL = aLocal;
  #endif
  #ifdef MEANS
    // the stem is a thin thing: it keeps its true width and goes out by pixel width (its light whole where it is 0.6 of
    // a pixel wide, nothing at 0.4); it is never made wider
    if (uv.x > 0.5 && uv.x < 1.5) vThin = smoothstep(0.4, 0.6, 2.0*length(p.xz)/max(glassPx(),1e-6));
  #endif
`+Qe+"}",_e=pe+Je+`
void main(){
  LIGHT
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  float part = vUv.x;
  float cut = 0.0, cutEdge = 0.0;
  #ifdef DEC
    // cut in plain diamonds: each facet a little pyramid, so the flame breaks into a hundred sparks
    float ang = atan(vL.z, vL.x+1e-5)/6.2831853; float ax = vL.y;
    cut = smoothstep(0.07,0.12,ax)*(1.0-smoothstep(0.66,0.72,ax))*step(part,0.5);
    vec2 dg = vec2(ang*uCut.x + ax*uCut.y, ang*uCut.x - ax*uCut.y);
    vec2 df = fract(dg)-0.5; vec2 de = abs(df);
    cutEdge = cut*smoothstep(0.44,0.5,max(de.x,de.y));
    vec3 Tn = normalize(cross(N, vec3(0.31,0.9,0.29))+vec3(1e-5)); vec3 Bn = cross(N,Tn);
    vec3 Nf = normalize(N + cut*1.1*(Tn*(df.x+df.y) + Bn*(df.x-df.y)));
    float spark = pow(max(dot(reflect(-V,Nf),L),0.0),48.0);
    #ifdef BIG
      spark = pow(ringSpec(vW, reflect(-V,Nf)),48.0);                               // (the great decanter: a spark for each of the six flames)
    #endif
  #endif
  // (vHl: every highlight below goes to its own mean over the bowl as the glass comes down to a few pixels)
  float nv = abs(dot(N,V)); float fr = 1.0-nv; fr = mix(0.1, fr*fr*fr, vHl);       // (0.1: the sheen's mean over a round bowl's face)
  vec3 R = reflect(-V,N); float rl = max(dot(R,L),0.0);
  #ifdef BIG
    rl = ringSpec(vW, R);                                                         // (six flames: six images)
  #endif
  vec3 H = normalize(L+V+vec3(0.0,1e-5,0.0));
  vec3 lightC = uFlameCol*att;
  vec3 col = vec3(0.0);
  float isBowl = step(part,0.5)+step(3.5,part), isStem = step(0.5,part)*step(part,1.5), isFoot = step(1.5,part)*step(part,2.5), isLip = step(2.5,part)*step(part,3.5);
  #ifdef MEANS
    if (!gl_FrontFacing && vUv.y < 0.5) isBowl = 0.0;                             // (the far wall under THE HALF stands behind the wine: it is not seen)
  #endif
  // bowl: a sheen that follows the eye, the flame's image (front wall), and again small on the far wall
  float img = gl_FrontFacing ? pow(rl,220.0)*3.5 + pow(rl,24.0)*0.10 : pow(rl,700.0)*3.5;
  img = mix(0.03, img, vHl);
  col += isBowl*( fr*(uAmb*0.55 + lightC*0.9) + img*lightC );
  #ifdef BIG
    // the great bowl's two walls: a broader sheen toward each wall's edge against the eye, and each flame drawn out long down the glass
    // and, drawn out long down the glass, the hall's two lights: the ranks' candles to the south, warm, and the doorway
    // to the north, cold
    { float f2 = 1.0-nv; f2 = f2*sqrt(f2);
      vec3 Rv = normalize(vec3(R.x, R.y*0.25, R.z)+vec3(0.0,1e-5,0.0));
      float sS = pow(max(dot(Rv,vec3(0.0,0.0,1.0)),0.0), 40.0), sN = pow(max(dot(Rv,vec3(0.0,0.0,-1.0)),0.0), 70.0);
      col += (isBowl+0.6*isStem*vThin)*( f2*(uAmb*0.3+lightC*0.15) + uFlameCol*sS*0.45 + uCool*sN*5.0 ); }
  #endif
  // rim: a line (the top twentieth of the bowl; under a wide pixel it shows its mean: rw = a pixel's footprint
  // in the bowl's height), and two glints that wheel round it as the eye moves
  vec2 nh = N.xz/max(length(N.xz),1e-4); vec3 T = vec3(-nh.y,0.0,nh.x);
  float gl = 1.0-abs(dot(T,H)); gl = mix(inversesqrt(1.0+5917.0*dot(H.xz,H.xz)), pow(max(gl,0.0),48.0), vHl);     // (the glints' mean round the rim hangs on the half vector's level length h: 0.0130/h, and 1 where h is nothing)
  #ifdef BIG
    // (the great glass's rim line is no wider for its size: the top eightieth of the bowl, 0.05 m)
    float rw = max(fwidth(vUv.y), 0.004);
    float rim = max(isLip, isBowl*topLine(vUv.y, 0.9875, rw)*step(part,0.5));
  #else
  float rw = max(fwidth(vUv.y), 0.03);
  float rim = max(isLip, isBowl*topLine(vUv.y, 0.95, rw)*step(part,0.5));
  #endif
  float rimK = 1.0;
  #ifdef DEC
    rimK = 0.4;
  #endif
  col += rimK*rim*( uAmb*0.5 + lightC*(0.4+5.0*gl) );
  // stem: one long highlight
  vec2 hh = H.xz/max(length(H.xz),1e-4); float sl = mix(0.13, pow(max(dot(nh,hh),0.0),36.0), vHl);
  col += isStem*vThin*( lightC*(sl*3.2+0.10) + uAmb*(0.18+fr*0.6) );
  // foot: edge line, pontil ring, a flat glint
  float pq = (vUv.y-0.35)/0.035; float pont = exp(-pq*pq);
  #ifdef BIG
    col += isFoot*( (uAmb*0.7+lightC*0.9)*mix(0.0449, smoothstep(0.975,0.996,vUv.y)+0.35*pont, vHl) + lightC*mix(0.02, pow(rl,160.0)*2.5 + pow(rl,14.0)*0.12, vHl) + uAmb*0.05 );     // (the edge line's and the ring's mean over the great foot: 0.0449)
    // the choir's cold light, from the doorway behind it: an edge on whatever of the glass faces north
    col += uCool*(isBowl+isStem*vThin+isFoot*0.5+rim)*(fr*1.3+rim*0.5)*max(dot(N,vec3(0.0,0.2,-0.98))*0.6+0.4,0.0);
  #else
  col += isFoot*( (uAmb*0.7+lightC*0.9)*mix(0.1, smoothstep(0.93,0.99,vUv.y)+0.35*pont, vHl) + lightC*mix(0.02, pow(rl,160.0)*2.5, vHl) + uAmb*0.05 );
  #endif
  // the look's cool edge (blue hour from the east, moon from the west)
  col += uFill*uFillAmt*(isBowl+isStem*vThin+rim)*(fr*1.4+rim*0.6)*max(dot(N,uFillDir)*0.6+0.4,0.0);
  // the hall's two great windows (the end walls x 62 and -62 of the transepts, z -72 to 10): a cold edge on the glass that
  // faces one, falling off with the distance from it (uGwE, uGwW: their light by the look; black where there is no hall)
  { float sd = vW.x > 0.0 ? 1.0 : -1.0, dg = 62.0-abs(vW.x);
    float gw = step(-71.8,vW.z)*step(vW.z,9.8)*step(0.4,dg)*exp(-dg*0.045)*(1.0-smoothstep(27.0,34.0,dg));
    col += (vW.x > 0.0 ? uGwE : uGwW)*gw*3.0*(isBowl+isStem*vThin+rim)*(fr*1.4+rim*0.6)*max(dot(N,vec3(sd*0.94,0.34,0.0))*0.6+0.4,0.0); }
  #ifdef DEC
    col += cut*lightC*spark*4.5 + cutEdge*(uAmb*0.22+lightC*0.16)*(0.35+fr*2.0);
  #endif
  #ifdef BIG
    col *= (0.5+0.5*mix(0.5, vnoise(vW*vec3(2.2,0.7,2.2)), vHl)*0.3+0.35);
  #else
  col *= (0.5+0.5*mix(0.5, vnoise(vW*vec3(9.0,3.0,9.0)), vHl)*0.3+0.35);
  #endif
  `+We+`
  gl_FragColor = vec4(col,1.0);
}`,Ge=he+je+dt+`
uniform float uLevel, uDome;
// (WINSET: the wine's inset from the bowl's outside; MEN_H: how far the still wine climbs the wall. In the glass's own
// measure: the great glass's wall is thinner for its size, and its wine climbs 0.016 m, not 0.064)
#ifdef BIG
  #define WINSET `+vt.toFixed(4)+`
  #define MEN_H 0.002
#else
  #define WINSET 0.009
  #define MEN_H 0.008
#endif
float domeH(float rho){ float q = clamp(rho,0.0,1.0); float k = 1.0-q*q*q*q;
  #ifdef BIG
    k = 1.0-q*q*sqrt(q);                                                           // (a rounder shoulder: the great dome is seen from the side)
    float tremble = 1.0 + 0.035*sin(uTime*2.3) + 0.03*sin(uTime*3.7+q*5.0);        // (a great mass trembles slowly)
  #else
    float tremble = 1.0 + 0.07*sin(uTime*5.3) + 0.05*sin(uTime*8.1+q*6.0);
  #endif
  float below = 1.0-smoothstep(0.0,0.004,uDome);
  return uDome*sqrt(max(k,0.0))*tremble + below*MEN_H*q*q*q*q*q*q; }
void main(){ vec3 p = position; vec3 n = normal; vUv = uv; vL = position; vThin = 1.0;
  #ifdef ONE
    if (uv.x < 0.5) {
      float s = max(position.y*uLevel, 0.012); float r = bowlR(s)-WINSET;
      float dr = (bowlR(s+0.012)-bowlR(s-0.012))/(0.024*0.52);
      p = vec3(position.x*r, 0.36+0.52*s, position.z*r);
      n = normalize(vec3(position.x, -dr, position.z)); vUv.y = position.y;
    } else {
      float rho = uv.y; vec2 dir = position.xz/max(rho,1e-3);
      float rs = bowlR(uLevel)-WINSET+(WINSET-0.0005)*smoothstep(0.0,0.01,uDome);
      #ifdef BIG
        float wob = 0.004*rho*(sin(uTime*1.3)*dir.x+cos(uTime*0.9)*dir.y)*smoothstep(0.0,0.02,uDome);
      #else
        float wob = 0.006*rho*(sin(uTime*2.3)*dir.x+cos(uTime*1.7)*dir.y)*smoothstep(0.0,0.02,uDome);
      #endif
      float dH = (domeH(rho+0.02)-domeH(rho-0.02))/0.04;
      p = vec3(position.x*rs, 0.36+0.52*uLevel+domeH(rho)+wob, position.z*rs);
      n = normalize(vec3(-dH*dir.x, rs, -dH*dir.y));
    }
    vL = p;
  #endif
`+Qe+"}",Se=pe+Je+`
uniform float uPour, uDome, uLevel; uniform vec2 uPourAt;
// the body of the wine: deep, with a garnet edge that lights when the flame stands behind it
vec3 wineBody(vec3 N, vec3 V, vec3 L, vec3 lightC){
  float nv = abs(dot(N,V)); float edge = 1.0-nv; edge = edge*edge;
  float back = max(dot(-V,L),0.0); back *= back;
  float wrap = max(dot(N,L)*0.6+0.4,0.0);
  vec3 c = uWineDeep*(uAmb*2.2 + lightC*(0.5+1.2*wrap));
  c += uWineBody*lightC*(0.35*wrap + 0.8*back*(0.3+edge));
  c += uWineEdge*edge*(uAmb*0.5 + lightC*(0.4+1.5*back));
  return c;
}
void main(){
  LIGHT
  vec3 N = normalize(vN);
  vec3 lightC = uFlameCol*att;
  vec3 col;
  bool body = vUv.x < 0.5;
  #ifdef DEC
    if (vL.y > uLevel) discard;
    if (!gl_FrontFacing) { body = false; N = vec3(0.0,1.0,0.0); }
  #endif
  if (body) {
    float nv = abs(dot(N,V)); float edge = 1.0-nv; edge = edge*edge;
    col = wineBody(N,V,L,lightC);
    #ifdef BIG
      // LIGHT THROUGH THE GREAT GLASS'S WINE: the six candles' light comes through where the wine is thin (low in the bowl,
      // on the side that faces them) and at the bowl's edge against the eye; its core stays dark
      { vec3 Lm = ringMid()-vW; float dm = dot(Lm,Lm); Lm *= inversesqrt(max(dm,1e-4));
        float toward = dot(N,Lm)*0.5+0.5, lowK = 1.0-vUv.y;
        float thin = clamp(lowK*lowK*1.1+0.5*edge, 0.0, 1.0);                       // where the wine is thin: low in the bowl, and at its edge against the eye
        float bk = max(dot(-V,Lm),0.0); bk *= bk;                                   // the eye looks toward the candles through it
        float thr = thin*(0.2+0.8*toward*toward+0.7*bk) + 0.04*bk;
        col = col*(0.4+0.6*edge) + (uWineBody*2.0 + uWineEdge*thr*0.4)*uFlameCol*thr/(1.0+dm*uK); }
      float lw = max(fwidth(vUv.y), 0.012);                                         // (a pixel's footprint in the wine's depth)
      col += uWineEdge*topLine(vUv.y, 0.976, lw)*(uAmb*0.9+lightC*1.1);      // the meniscus line all round, no wider for the glass's size: under a wide pixel it shows its mean
    #else
    float lw = max(fwidth(vUv.y), 0.05);                                            // (a pixel's footprint in the wine's depth)
    col += uWineEdge*topLine(vUv.y, 0.93, lw)*(uAmb*0.4+lightC*0.45);         // the line, seen from the side: under a wide pixel it shows its mean
    #endif
    col += uFill*uFillAmt*edge*max(dot(N,uFillDir),0.0)*0.6;
  } else {
    float rho = vUv.y; vec2 rd = vL.xz/max(length(vL.xz),1e-4);
    #ifdef DEC
      rho = 0.3;
    #endif
    float wave = 0.55+0.45*sin(vW.z*0.045+uTime*0.9);                           // one slow wave down the hall
    float amp = 0.035*wave*(1.0+uSurge*4.0);
    vec2 pd = vL.xz-uPourAt; float pl = length(pd);                             // rings from the falling thread (the one glass)
    #ifdef BIG
      // (the great glass's rings are no coarser for its size: 0.09 m apart; the thread's 0.12 m apart, dying over 0.9 m.
      // Each is filtered by a pixel's footprint: gone where a pixel holds a whole ring)
      float rph = rho*90.0, pph = pl*420.0;
      float ring = sin(rph-uTime*2.6)*amp*smoothstep(0.0,0.2,rho)*(1.0-smoothstep(1.0,2.5,fwidth(rph)));
      float pring = uPour*0.2*sin(pph-uTime*9.0)*exp(-pl*9.0)*(1.0-smoothstep(1.0,2.5,fwidth(pph)));
    #else
    float ring = sin(rho*34.0-uTime*3.4)*amp*smoothstep(0.0,0.2,rho);
    float pring = uPour*0.16*sin(pl*150.0-uTime*11.0)*exp(-pl*7.0);
    #endif
    vec3 n = normalize(N + vec3(rd.x,0.0,rd.y)*ring + vec3(pd.x,0.0,pd.y)/max(pl,1e-3)*pring);
    vec3 R = reflect(-V,n); float rl = max(dot(R,L),0.0);
    #ifdef BIG
      rl = ringSpec(vW, R);
      #define MEN0 0.975
      #define MEN1 0.996
      #define GLN0 0.988
      #define GLN1 0.998
      #define HOLD0 0.992
    #else
      #define MEN0 0.84
      #define MEN1 0.975
      #define GLN0 0.945
      #define GLN1 0.99
      #define HOLD0 0.955
    #endif
    float fr = 1.0-max(dot(n,V),0.0); fr = fr*fr*fr*fr;
    col = uWineDeep*(uAmb*2.0+lightC*0.7) + uWineBody*lightC*0.22;
    #ifdef BIG
      col += uAmb*fr*0.22 + lightC*fr*0.04;                                       // (seen low across it, the great surface gives back the dark hall, not a pale sheet)
    #else
    col += uAmb*fr*0.8 + lightC*fr*0.12;
    #endif
    col += uFlameCol*att*mix(0.04, pow(rl,260.0)*5.5 + pow(rl,30.0)*0.25, vHl);     // the flame riding on it (its mean over the surface where the glass is a few pixels)
    float men = smoothstep(MEN0,MEN1,rho);                                        // (the great glass's meniscus is no wider for its size)
    vec2 lh = L.xz/max(length(L.xz),1e-4);
    col += uWineEdge*men*(uAmb*0.4 + lightC*(0.22+0.9*abs(dot(rd,lh))));          // the meniscus line
    col += uFlameCol*att*mix(0.05, smoothstep(GLN0,GLN1,rho)*(0.25+1.6*pow(abs(dot(rd,lh)),6.0)), vHl);
    // the dome: the wine's own body standing above the rim, the flame bent in it, a bright line where it holds
    float dk = smoothstep(0.0,0.02,uDome)*smoothstep(0.4,0.75,rho);
    float de = 1.0-max(dot(n,V),0.0); de *= de;                                    // the dome's own edge against the eye: bright garnet
    #ifdef BIG
      #define DOME_E 0.06
    #else
      #define DOME_E 0.3
    #endif
    vec3 dcol = wineBody(n,V,L,lightC) + uWineEdge*(lightC*(DOME_E+1.5*de)+uAmb*0.5*de) + uFlameCol*att*(pow(rl,180.0)*4.5 + pow(rl,48.0)*1.6 + pow(rl,12.0)*0.3)
              + (uWineEdge*lightC*1.5 + uFlameCol*att*1.1)*smoothstep(HOLD0,1.0,rho);
    col = mix(col, dcol, dk);
    col += uFill*uFillAmt*(fr+men*0.5)*0.7;
  }
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,$e=he+`
attribute vec4 aFlame; uniform float uTime, uPix;
varying vec2 vUv; varying vec4 vFl; varying vec3 vW; varying float vR; varying float vHl;
void main(){
  vec3 c = vec3(0.0);
  #ifdef USE_INSTANCING
    c = instanceMatrix[3].xyz;
  #endif
  vec2 away = c.xz-aFlame.xz; float dl = length(away); away = dl > 1e-3 ? away/dl : vec2(1.0,0.0);
  #ifdef BIG
    // the great glass's caustic lies on the plinth's top: a card 5.4 m square about the foot, read in plan from the
    // foot's middle (vUv: metres away from the candles' middle, and across)
    vec2 q = (uv-0.5)*5.4;
    vec4 wp = modelMatrix*vec4(c.x+q.x, c.y+0.012, c.z+q.y, 1.0);
    vR = length(q); vHl = 1.0; vUv = vec2(dot(q,away), dot(q,vec2(-away.y,away.x)));
  #else
  float rise = max(aFlame.y-c.y, 0.2);
  float len = clamp(0.55+0.5*dl/rise*0.3, 0.6, 1.25);
  vec2 q = away*(uv.x*len-0.12) + vec2(-away.y,away.x)*(uv.y-0.5)*0.62;
  vec4 wp = modelMatrix*vec4(c.x+q.x, c.y+0.006, c.z+q.y, 1.0);
  vR = length(q);
  vHl = 1.0-smoothstep(0.03,0.12,length(cameraPosition-wp.xyz)*uPix);       // (the glass's own footprint: its bowl 12 pixels across, 3 pixels across)
  vUv = uv;
  #endif
  vW = wp.xyz; vFl = vec4((modelMatrix*vec4(aFlame.xyz,1.0)).xyz, aFlame.w);
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,et=pe+`
uniform float uTime, uClipR, uK; uniform vec3 uFlameCol, uCaustic;
varying vec2 vUv; varying vec4 vFl; varying vec3 vW; varying float vR; varying float vHl;
`+Ae+`
void main(){
  vec3 Lv = vFl.xyz-vW; float d2 = dot(Lv,Lv);
  float br = breath(vFl.xyz, uTime); float att = vFl.w*br/(1.0+d2*uK);
  #ifdef BIG
  // THE GREAT GLASS'S CAUSTIC, in metres on the plinth's top (al: away from the candles' middle; ac: across): the foot's
  // shadow, the bowl's long shadow, the wine's light thrown through it as a ruby pool 1.95 m out, a gold cusp round it
  float al = vUv.x, ac = vUv.y;
  float env = 1.0-smoothstep(uClipR-0.1, uClipR, vR);
  float foot = 1.0-smoothstep(1.12,1.5,vR);
  float sh = exp(-(ac*ac)/1.69)*smoothstep(0.2,1.4,al)*0.6;
  float du = (al-1.95)/0.55, dv = ac/0.95; float ruby = exp(-du*du-dv*dv);
  float rr = length(vec2((al-1.55)*1.15, ac*0.8)); float cq = (rr-0.62)/0.045;
  float cusp = exp(-cq*cq)*smoothstep(1.55,1.95,al) + exp(-(ac*ac)/0.006)*smoothstep(1.7,2.0,al)*(1.0-smoothstep(2.1,2.5,al));
  cusp *= 0.85+0.15*sin(uTime*1.3+al*4.0);
  vec3 col = (uCaustic*ruby*1.5 + uFlameCol*cusp*1.2)*att*env;
  float a = clamp((sh*0.5+foot*0.4)*env*min(att*2.5,1.0), 0.0, 0.8);
  #else
  float u = vUv.x, v = (vUv.y-0.5)*2.0;
  float env = smoothstep(0.0,0.1,u)*(1.0-smoothstep(0.75,1.0,u))*(1.0-smoothstep(0.7,1.0,abs(v)));
  env *= 1.0-smoothstep(uClipR-0.04, uClipR, vR);
  float w = 0.16+0.5*u;                                                // the shadow widens away from the foot
  float sh = exp(-(v*v)/(w*w))*(1.0-smoothstep(0.35,0.95,u));
  float foot = 1.0-smoothstep(0.10,0.17,length(vec2((u-0.115)*1.6, v*0.5)));
  float du = (u-0.52)/0.2, dv = v/0.36; float ruby = exp(-du*du-dv*dv);
  float rr = length(vec2((u-0.46)*1.25, v*0.62)); float cq = (rr-0.17)/0.022;
  float cusp = exp(-cq*cq)*smoothstep(0.44,0.6,u) + exp(-(v*v)/0.0016)*smoothstep(0.52,0.62,u)*(1.0-smoothstep(0.62,0.9,u));
  cusp *= 0.85+0.15*sin(uTime*2.1+vFl.x*3.0+u*9.0);
  cusp = mix(0.019, cusp, vHl);                                        // the gold cusp, a thin line, goes to its mean where the glass is a few pixels (0.019: its mean over the card, weighed by the card's envelope)
  vec3 col = (uCaustic*ruby*1.3 + uFlameCol*cusp*1.5)*att*env;
  float a = clamp((sh*0.5+foot*0.35)*env*min(att*2.5,1.0), 0.0, 0.8);
  #endif
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float ff = exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
      float ff = 1.0-smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    col *= ff; a *= ff;
  #endif
  gl_FragColor = vec4(col, a);
}`,wt=he+`
uniform float uTime, uGustAmp, uGustTail;
varying vec2 vUv; varying float vBr;
`+Ae+mt+`
void main(){
  vec3 c = vec3(0.0); float w = 1.0, h = 1.0;
  #ifdef USE_INSTANCING
    c = instanceMatrix[3].xyz; w = length(instanceMatrix[0].xyz); h = length(instanceMatrix[1].xyz);
  #endif
  vec4 wc = modelMatrix*vec4(c,1.0);
  float ms = length(modelMatrix[1].xyz); w *= ms; h *= ms;
  float k = h31(floor(c*7.0)+3.0);
  vBr = breath(c, uTime);
  vec3 toC = cameraPosition-wc.xyz; vec2 f = toC.xz/max(length(toC.xz),1e-3); vec3 right = vec3(f.y,0.0,-f.x);
  // the breath: a front travelling south (gustD: its measure as this flame feels it); flames gutter low in a band at
  // the front and lean on the breath's one bearing (south, 18 degrees east of it) behind it, recovering over uGustTail
  // of that measure. Never to dark.
  float y = uv.y; float dz = gustD(wc.z); float gust = uGustAmp*(dz > 0.0 ? exp(-dz*dz/60.0) : exp(dz/max(uGustTail,1.0)));
  float dg = dz+7.0; float gut = min(uGustAmp*exp(-dg*dg/260.0),1.0);
  h *= 1.0+0.11*sin(uTime*(2.2+2.0*k)+k*30.0)-0.4*gut+0.5*min(gust,1.2);     // drawn out long as it is laid over
  w *= 1.0+0.25*min(gust,1.0);
  vec2 lean = vec2(sin(uTime*(1.7+1.9*k)+k*50.0), cos(uTime*(1.3+1.6*k)+k*23.0))*0.085*h*(1.0+2.0*min(gust,1.0)) + vec2(0.309, 0.951)*3.54*gust*h;
  vBr *= 1.0-0.3*gut;
  // (the flame's card, 2.6 w wide and 1.25 h tall, keeps its true size at every distance: a far flame's light is carried
  // by its halo, which the world draws)
  vec3 p = wc.xyz + right*(uv.x-0.5)*w*2.6 + vec3(0.0,(y-0.06)*h*1.25,0.0) + vec3(lean.x,0.0,lean.y)*y*y;
  p.y -= 0.62*min(gust,1.2)*h*y*y;
  vUv = uv;
  vec4 mvPosition = viewMatrix*vec4(p,1.0); gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,xt=pe+`
uniform vec3 uFlameCol; uniform float uFlameGain;
varying vec2 vUv; varying float vBr;
void main(){
  float y = clamp((vUv.y-0.05)/0.8, 0.0, 1.0); float x = (vUv.x-0.5)*2.6;
  float wd = 0.52*sqrt(y)*(1.0-y*y)+0.02;                              // teardrop
  float r = abs(x)/wd;
  float body = (1.0-smoothstep(0.55,1.0,r))*step(vUv.y,0.86)*smoothstep(0.0,0.03,vUv.y-0.05);
  float core = (1.0-smoothstep(0.0,0.7,r))*smoothstep(0.08,0.3,y)*(1.0-smoothstep(0.55,0.95,y));
  vec3 outer = vec3(1.0,0.36,0.07)*0.75, hot = uFlameCol*2.6+vec3(0.35,0.3,0.2);
  vec3 col = mix(outer, hot, core)*body;
  col = mix(col, vec3(0.10,0.16,0.5)*body, (1.0-smoothstep(0.0,0.16,y))*0.8); // the blue foot of the flame
  float gx = (vUv.x-0.5)*2.0, gy = (vUv.y-0.4)*1.6; float glow = exp(-(gx*gx+gy*gy)*5.0);
  col += uFlameCol*glow*0.10;
  col *= vBr*uFlameGain;
  `+We+`
  gl_FragColor = vec4(col,1.0);
}`,tt=["#F3E3BF","#7A0F1E","#E8A23A","#1A120C","#3A2416","#C9A24A","#16233F"];function O(e,t,r,l={}){return new a.ShaderMaterial({uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...e},vertexShader:t,fragmentShader:r,fog:!0,...l})}function yt(e,t={}){const r=t.palette||tt,l=ge(r[2]).lerp(ge("#FFE0A6"),.62),n={uTime:{value:0},uK:{value:.1},uSurge:{value:0},uGustZ:{value:0},uGustM:{value:0},uGustAmp:{value:0},uGustTail:{value:70},uFlameGain:{value:1},uFlameCol:{value:l},uAmb:{value:ge(r[4]).multiplyScalar(1.2).add(new a.Color(.055,.045,.032))},uFill:{value:ge(r[6]).multiplyScalar(4)},uFillDir:{value:new a.Vector3(1,.3,0).normalize()},uFillAmt:{value:0},uWineDeep:{value:new a.Color},uWineBody:{value:new a.Color},uWineEdge:{value:new a.Color},uCaustic:{value:new a.Color},uGwE:{value:new a.Color(0,0,0)},uGwW:{value:new a.Color(0,0,0)},uPix:{value:.0013}},d={uLevel:{value:re},uDome:{value:0},uPour:{value:0},uPourAt:{value:new a.Vector2(-.1,0)}},o={transparent:!0,depthWrite:!1,blending:a.AdditiveBlending},f={shell:O(n,De,_e,{...o,side:a.DoubleSide,defines:{MEANS:1}}),wine:O({...n,...d},Ge,Se,{defines:{MEANS:1}}),wineFar:O({...n,...d},Ge,Se,{defines:{MEANS:1}}),caustic:O({...n,uClipR:{value:1e3}},$e,et,{transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendSrc:a.OneFactor,blendDst:a.OneMinusSrcAlphaFactor,side:a.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),flame:O(n,wt,xt,o)},u={caustic:new a.PlaneGeometry(1,1),flame:new a.PlaneGeometry(1,1)},v={};for(const b of["near","mid","far","speck","one"])u[b]={shell:ht(b),wine:b==="one"?gt():pt(b)},v[b]=(u[b].shell.index.count+u[b].wine.index.count)/3;const h=new a.Matrix4,p=new a.Quaternion,w=new a.Vector3,c=new a.Vector3(1,1,1),M=new a.Vector3(0,1,0);function A(b,i,m,g){const x=b.clone(),F=new a.InstancedBufferAttribute(new Float32Array(m*4),4);x.setAttribute("aFlame",F);const C=new a.InstancedMesh(x,i,m);return C.renderOrder=g,C}function $(b,i,m={}){const g=new a.Group,x=A(u[b].wine,m.wineMaterial||(b==="far"||b==="speck"?f.wineFar:f.wine),i,-.5),F=A(u[b].shell,f.shell,i,3),C=m.caustic===!1?null:A(u.caustic,f.caustic,i,1);C&&(C.frustumCulled=!1),g.add(x,F),C&&g.add(C);const T=C?[x,F,C]:[x,F];return{group:g,shell:F,wine:x,caustic:C,count:i,set(E,le,U,P,Z,D,K,se=1,ve=0){h.compose(w.set(le,U,P),p.setFromAxisAngle(M,ve),c);for(const j of T)j.setMatrixAt(E,h),j.geometry.attributes.aFlame.setXYZW(E,Z,D,K,se)},commit(){for(const E of T)E.instanceMatrix.needsUpdate=!0,E.geometry.attributes.aFlame.needsUpdate=!0,E.computeBoundingSphere()}}}function Y(b){const i=new a.InstancedMesh(u.flame,f.flame,b);return i.frustumCulled=!1,i.renderOrder=5,{mesh:i,set(m,g,x,F,C=.34,T=.13){h.compose(w.set(g,x,F),p.identity(),c.set(T,C,1)),c.set(1,1,1),i.setMatrixAt(m,h)},commit(){i.instanceMatrix.needsUpdate=!0}}}function R(b){const i=Re[b]||Re.ruby;n.uWineDeep.value.set(i.deep),n.uWineBody.value.set(i.body),n.uWineEdge.value.set(i.edge),n.uCaustic.value.set(i.caustic),ee.wine=Re[b]?b:"ruby"}const H=new a.Color;function I(b=1,i=null,m=null,g=0){n.uFlameGain.value=b,i&&n.uFill.value.copy(H.set(i)).multiplyScalar(1),m&&n.uFillDir.value.copy(m).normalize(),n.uFillAmt.value=g}const ee={uniforms:n,geometry:u,materials:f,instanced:A,makeGlasses:$,makeFlames:Y,setWine:R,setLight:I,triangles:v,wine:"ruby",flameColor:l,update(b){n.uTime.value=b}};return R(t.wine),ee}const ot=he+`
attribute vec3 color; attribute vec3 aMat;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec3 vM; varying vec2 vG; varying vec3 vP;
void main(){
  vec4 wp = modelMatrix*vec4(position,1.0);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix)*normal + vec3(0.0,1e-6,0.0)); vC = color; vM = aMat; vG = uv; vP = position;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,at=pe+`
uniform float uTime, uFillAmt, uFlameI, uK;
uniform vec3 uFlamePos, uFlameCol, uAmb, uFill, uFillDir, uWineEdge;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec3 vM; varying vec2 vG; varying vec3 vP;
`+Ae+`
void main(){
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW + vec3(0.0,1e-5,0.0));
  vec3 Lv = uFlamePos - vW; float d2 = dot(Lv,Lv); vec3 L = Lv*inversesqrt(max(d2,1e-4));
  float br = breath(uFlamePos, uTime); float att = uFlameI*br/(1.0+d2*uK);
  vec3 alb = vC; float metal = vM.x, gloss = vM.y, kind = vM.z;
  float n1 = vnoise(vP*26.0), n2 = vnoise(vP*vec3(90.0,7.0,90.0));
  if (kind > 1.5 && kind < 2.5) {                                    // polished oak, laid herringbone
    vec2 h = vP.xz/0.26; float ci = floor(h.x); float sgn = mod(ci,2.0) < 0.5 ? 1.0 : -1.0;
    float al = (h.y + sgn*fract(h.x))/1.6; float bi = floor(al);
    float id = h31(vec3(ci, bi, 3.0));
    float ex = min(fract(h.x), 1.0-fract(h.x)), ey = min(fract(al), 1.0-fract(al))*1.6;
    float seam = smoothstep(0.0,0.035,min(ex,ey));
    float grain = vnoise(vec3(vP.x*(sgn>0.0?9.0:60.0), 1.0, vP.z*(sgn>0.0?60.0:9.0)) + id*20.0);
    alb *= (0.7+0.6*id)*(0.85+0.3*grain)*(0.45+0.55*seam);
    gloss *= seam;
  } else if (kind > 3.5) {                                           // the dais's marble: polished, veined
    float v1 = vnoise(vP*vec3(1.3,3.0,1.3)+vnoise(vP*2.7)*2.0); float vein = smoothstep(0.44,0.5,v1)*(1.0-smoothstep(0.5,0.58,v1));
    alb *= 0.92+0.1*n1-0.3*vein; gloss *= 1.0-0.4*vein;
  } else if (kind > 2.5) {                                           // linen: soft weave, creases come from the form
    alb *= 0.93+0.07*n2+0.05*(n1-0.5);
  } else {
    alb *= 0.9+0.2*n1; gloss *= 0.8+0.3*n2;                           // hammered, turned, handled
  }
  vec3 R = reflect(-V,N); float rl = max(dot(R,L),0.0);
  float nl = dot(N,L); float wrap = max(nl*0.75+0.25,0.0);
  vec3 lightC = uFlameCol*att;
  // metal: it shows the hall, a dark warm room with a band of far candles round the horizon
  float ry = (R.y-0.06)/0.2; float band = exp(-ry*ry);
  float cand = vnoise(vec3(R.x*8.0, R.y*5.0+uTime*0.12, R.z*8.0)+3.0); cand *= 0.9+0.1*sin(uTime*2.6+R.x*31.0+R.z*27.0);
  vec3 env = uAmb*(0.5+0.7*smoothstep(-0.4,0.6,R.y)) + uFlameCol*band*(0.22+1.5*smoothstep(0.55,0.85,cand));
  env += uWineEdge*0.05*(1.0-smoothstep(-0.4,0.2,R.y));
  vec3 cm = alb*(env*1.25 + lightC*(pow(rl, mix(10.0,180.0,gloss))*(1.0+5.0*gloss) + 0.35*wrap));
  vec3 cd = alb*(uAmb*(0.9+0.5*N.y) + lightC*wrap*1.05) + lightC*pow(rl,40.0)*gloss*0.35;
  vec3 col = mix(cd, cm, metal);
  float fr = 1.0-max(dot(N,V),0.0); fr = fr*fr*fr;
  float ak = clamp(dot(alb,vec3(1.6)),0.0,1.0);                                                     // a dark surface takes little of the cool edge
  col += uFill*uFillAmt*(alb*max(dot(N,uFillDir),0.0)*0.3 + fr*(0.15+0.5*metal)*ak*ak);
  col *= vG.y;
  col += alb*mix(uFlameCol, vec3(1.0,0.92,0.8), 0.6)*vG.x*br*0.9;                                   // wax lit from within, under the flame
  gl_FragColor = vec4(col,1.0);
  #include <fog_fragment>
}`;function z(e,t,r,l,n,d=0,o={}){o.matrix&&t.applyMatrix4(o.matrix);const f=t.attributes.position.count,u=t.attributes.position,v=new Float32Array(f*3),h=new Float32Array(f*3),p=new Float32Array(f*2),w=ge(r);for(let c=0;c<f;c++){const M=o.shade?o.shade(u.getX(c),u.getY(c),u.getZ(c)):1;v[c*3]=w.r*M,v[c*3+1]=w.g*M,v[c*3+2]=w.b*M,h[c*3]=l,h[c*3+1]=n,h[c*3+2]=d,p[c*2]=o.glow?o.glow(u.getX(c),u.getY(c),u.getZ(c)):0,p[c*2+1]=o.ao?o.ao(u.getX(c),u.getY(c),u.getZ(c)):1}return t.setAttribute("color",new a.BufferAttribute(v,3)),t.setAttribute("aMat",new a.BufferAttribute(h,3)),t.setAttribute("uv",new a.BufferAttribute(p,2)),e.push(t),t}const oe=(e,t,r)=>q(e.map(l=>[l[0],l[1],0,0]),t,r);function bt(e,t,r,l,n,d=0){const o=e.attributes.position;for(let f=0;f<o.count;f++){const u=o.getX(f),v=o.getY(f),h=o.getZ(f);if(v<l||v>n)continue;const p=(v-l)/(n-l),w=Math.sin(S*p)**.5,c=1-r*w*(.5+.5*Math.cos(t*(Math.atan2(h,u)+d*p)));o.setXYZ(f,u*c,v,h*c)}return e.computeVertexNormals(),e}const ye=(e,t,r,l=8,n=!1)=>new a.TubeGeometry(new a.CatmullRomCurve3(e.map(d=>new a.Vector3(d[0],d[1],d[2])),n),r,t,l,n),ae=(e,t,r,l=0,n=0,d=0,o=1)=>new a.Matrix4().compose(new a.Vector3(e,t,r),new a.Quaternion().setFromEuler(new a.Euler(l,n,d)),new a.Vector3(o,o,o)),W=[0,.9,0],be=W[1]+V*G.height,B=[-.35,be+2.6,0],X=3.9,J=14*S/180,Me=1.55*X,He=.115*X,Te=[B[0]+He*Math.sin(J),B[1]+He*Math.cos(J)],it=ae(Te[0]-Math.cos(J)*Me,Te[1]+Math.sin(J)*Me,0,0,0,-(S/2+J)),ie=(e,t=0)=>[Te[0]-Math.cos(J)*(Me-e)-Math.sin(J)*t,Te[1]+Math.sin(J)*(Me-e)-Math.cos(J)*t];function Be(e){if(e<.06)return .29+.05*Math.sqrt(e/.06);if(e<.75)return .34+.025*Math.sin(S*(e-.06)/.69);if(e<1.02){const t=(e-.75)/.27,r=t*t*(3-2*t);return .34+(.085-.34)*r}return e<1.46?.085-.012*Math.sin(S*(e-1.02)/.44)+.012*Math.exp(-Math.pow((e-1.08)/.02,2)):.085+(.115-.085)*Math.pow((e-1.46)/(1.55-1.46),1.6)}const fe=e=>X*Be(e/X),nt=3.8,Ie=4.5,Ue=[20,43,66,89,112,135].map(e=>e*S/180),Ve=e=>[-nt*Math.sin(Ue[e]),nt*Math.cos(Ue[e])],we=[4.2,3.4,2.6],_=-7.6;async function Mt(e,t,r,l,n){const d=r[5],o="#cdbf9f",f="#1f2b25",u=72,v=(i,m,g)=>1-.55*Math.exp(-Math.pow(Math.max(Math.hypot(i,g)-1.2,0)/.35,2));for(let i=0;i<3;i++){const m=we[i],g=.3*i,x=g+.3;z(e,oe([[m,g],[m,g+.22]],u),f,0,.75,4),z(e,oe([[m,g+.22],[m+.055,g+.24],[m+.055,g+.285],[m-.05,x]],u),d,1,.8),i<2?z(e,oe([[m-.05,x],[we[i+1],x]],u,{up:!0}),o,0,.8,4,{shade:(F,C,T)=>.82+.18*Math.min(1,(m-Math.hypot(F,T))/.5)}):z(e,oe([[m-.05,x],[1.7,x],[1.25,x]],u,{top:[x,0,0],up:!0}),o,0,.8,4,{shade:v}),await n()}const h=l==="blue"?.3:.52,p=Ie-.66,w=p+h,c=p-.3,M=[[.36,0],[.38,.05],[.3,.13],[.15,.2],[.1,.36],[.15,.44],[.08,.54],[.06,.3*c],[.075,.5*c],[.14,.53*c],[.075,.56*c],[.055,.8*c],[.07,c-.14],[.25,c-.05],[.28,c],[.1,c-.02]].map(i=>[i[0],i[1]+.3]),A=(i,m)=>.32*Math.exp(-Math.max(w-m,0)/.16);for(let i=0;i<6;i++){const[m,g]=Ve(i),x=ae(m,0,g,0,i*1.3,0);z(e,oe(M,8),d,1,.75,0,{matrix:x,shade:(F,C)=>.6+.4*Math.min(1,(C-.3)/.3)}),z(e,oe([[.095,p-.02],[.098,w-.05],[.09,w],[.03,w-.02]],6,{top:[w-.02,0,0]}),r[0],0,.5,0,{matrix:x,glow:A,shade:()=>.95}),i%2&&await n()}const $=t.int(5,7),Y=54.5*S/180;for(let i=0;i<$;i++){const m=i%3===2,g=Y+t.range(-.03,.03),x=.17+t()*.03,F=(m?3:3.75)+t.range(-.14,.14),C=m?.6:.3,T=[];for(let U=1;U<=5;U++){const P=U/6;T.push([x*Math.pow(Math.sin(S*P),.8)*(1+.04*Math.cos(P*9)),x*(1-Math.cos(S*P))*.94])}T.push([x*.2,x*1.9],[x*.24,x*2.08],[x*.3,x*2.14]);const E=oe(T,8,{bottom:[0,0,0]});bt(E,5,.06,.02,x*1.85,0);const le=ge("#5a1517").lerp(ge(t.chance(.4)?"#7a341c":"#3f0d13"),t()*.7);z(e,E,"#"+le.getHexString(),0,.45,0,{matrix:ae(-F*Math.sin(g),C+.015,F*Math.cos(g),t.range(-.5,.5),t()*6,t.range(-.5,.5))})}await n();const R=t()*6.28,H=.6+t()*.14,I=31.5*S/180,ee=-Math.sin(I),b=Math.cos(I);for(let i=0;i<2;i++){const x=[],F=[],C=i*.016,T=2.75+i*.12,E=we[1]+.07,le=i?.16:.26;for(let P=0;P<=12;P++)for(let Z=0;Z<=8;Z++){const D=(Z/8-.5)*H,K=P/12*(E-T+le);let se,ve;if(K<E-T)se=T+K,ve=.612+C;else{const j=K-(E-T),de=Math.min(1,j/.1);se=E+C+.02*de+de*(.03*Math.sin(D*15+R)+.018*Math.sin(D*31+R*2)),ve=.612+C-j}x.push(ee*se-b*D,ve,b*se+ee*D)}for(let P=0;P<12;P++)for(let Z=0;Z<8;Z++){const D=P*9+Z,K=D+8+1;F.push(D,K,D+1,D+1,K,K+1)}const U=new a.BufferGeometry;U.setAttribute("position",new a.Float32BufferAttribute(x,3)),U.setIndex(F),U.computeVertexNormals(),U.setAttribute("uv",new a.Float32BufferAttribute(new Float32Array(234),2)),z(e,U,r[0],0,.1,3,{shade:(P,Z,D)=>(i?.74:.66)*(.86+.14*Math.sin((P*b+D*ee)*30+R+1.5))})}return{top:w,cup:p}}async function Ft(e,t,r){const l=t[5],n=(c,M)=>.6+.4*Math.min(1,M/.4);z(e,oe([[.55,0],[.58,.06],[.52,.16],[.34,.24],[.26,.5],[.3,.62],[.2,.78],[.17,3],[.15,6.5],[.21,6.62],[.21,6.74],[.14,6.86],[.13,10],[.115,12.9],[.2,13.05],[.22,13.2],[.12,13.32]],10,{top:[13.32,0,0]}),l,1,.75,0,{matrix:ae(_,0,0),shade:n});const o=1,f=3.1,u=ie((o+f)/2,-(fe((o+f)/2)+.32)),v=[u[0],u[1]+.16],h=[v[0],v[1]+1.55];z(e,ye([[_,13.25,0],[_+.15,14.7,0],[_+1,16,0],[(_+h[0])/2+.3,16.5,0],[h[0]-.55,16.05,0],[h[0],h[1]+.12,0]],.1,16,6),l,1,.8),z(e,ye([[_+.1,11.2,0],[_+.75,12.6,0],[_+1.15,14.4,0],[_+1.3,15.95,0]],.06,8,5),l,1,.8),z(e,new a.SphereGeometry(.2,8,5),l,1,.85,0,{matrix:ae(_,13.5,0)}),await r();for(let c=0;c<5;c++)z(e,new a.TorusGeometry(.16,.035,4,8),l,1,.85,0,{matrix:ae(h[0],h[1]-.06-.295*c,0,0,c%2?S/2:0,0)});z(e,new a.TorusGeometry(.15,.045,4,8),l,1,.85,0,{matrix:ae(v[0],v[1],0)});for(const c of[o,f]){const M=new a.TorusGeometry(fe(c)+.075,.075,5,28);M.rotateY(S/2);const A=ie(c);z(e,M,l,1,.85,0,{matrix:ae(A[0],A[1],0,0,0,-J)})}const p=ie(o-.35,-(fe(o)+.3)),w=ie(f+.35,-(fe(o)+.3));z(e,ye([[p[0],p[1],0],[u[0],u[1],0],[w[0],w[1],0]],.07,6,5),l,1,.85);for(const c of[o,f]){const M=ie(c,-(fe(c)+.1)),A=ie(c,-(fe(o)+.3));z(e,ye([[M[0],M[1],0],[A[0],A[1],0]],.06,1,5),l,1,.85)}return{post:[_,13.32],armTop:16.6,end:h}}function Ct(){const e=[[0,.035,0,0],[.16,.022,0,0],[.25,.004,0,0],[.285,0,0,0]];for(let r=0;r<=20;r++){const l=.004+1.456*(r/20);e.push([Be(l),l,0,.9*l/1.55])}e.push([.098,1.5,0,.9],[.115-.004,1.55-.012,3,1],[.115,1.55,3,1],[.115-.012,1.55+.004,3,1],[.078,1.55-.03,3,1],[.07,1.4,0,.9]);const t=q(e,64);return t.setAttribute("aLocal",new a.BufferAttribute(t.attributes.position.array.slice(),3)),t.scale(X,X,X),t.applyMatrix4(it),t}function Lt(){const e=[];for(let u=0;u<=14;u++){const v=.03+.99*(u/14);e.push([Math.max(Be(v)-.012,.02),v,0,.5])}const t=q(e,32,{bottom:[.045,0,.5],top:[1.03,0,.5]});t.scale(X,X,X),t.applyMatrix4(it);const r=ie(.9*X,.2*X),l=ie(1.03*X,fe(1.03*X)-.1),n=ie(Me-.04,He-.08),d=ye([[r[0],r[1],0],[l[0],l[1],0],[(l[0]+n[0])/2,(l[1]+n[1])/2,0],[n[0],n[1],0],[B[0]+.02,B[1]+.04,0]],.075,10,6),o=d.attributes.uv;for(let u=0;u<o.count;u++)o.setXY(u,0,.5);const f=Le([t,d]);return t.dispose(),d.dispose(),f}function At(){const e=[];for(let t=0;t<=48;t++)e.push([1,t/48,0,t/48]);return q(e,10)}const zt=he+`
uniform float uTime, uSurfY, uHead, uBreak, uDrop, uOn, uPix;
uniform vec3 uLip;
varying vec3 vW; varying vec3 vN; varying float vT; varying float vA;
void main(){
  float t = position.y; vT = t;
  float len = max(uLip.y-uSurfY, 0.01);
  // THE GREAT DECANTER'S STREAM, at its true size: 0.15 m through at the lip, drawn down to 0.09 m, spreading a little
  // where it lands; it twists slowly and sways 0.035 m either way
  float r = 0.075*mix(1.0, 0.6, smoothstep(0.0,0.3,t)) + 0.03*smoothstep(0.93,1.0,t);
  r *= 1.0+0.18*sin(t*11.0-uTime*4.5)*smoothstep(0.05,0.3,t);            // it twists a little
  // the drops: drop k leaves the lip when uDrop is k and falls for two of uDrop's units, gathering speed (three drops)
  float pv = 2.0*sqrt(max(t,0.0)); float ph = uDrop-pv; float k = floor(ph+0.5); float d = ph-k;
  float bead = exp(-d*d/0.0016)*step(-0.5,k)*step(k,2.5);
  r = r*(1.0-uBreak) + 0.07*bead*uBreak;
  r *= step(t, uHead)*uOn;
  vec2 off = 0.035*vec2(sin(t*5.0+uTime*2.1), cos(t*4.0-uTime*1.7))*smoothstep(0.0,0.4,t);
  vec3 c = vec3(uLip.x+off.x, uLip.y-t*len, uLip.z+off.y);
  vec4 wc = modelMatrix*vec4(c,1.0);
  float dist = length(cameraPosition-wc.xyz);
  float ms = max(length(modelMatrix[1].xyz), 1e-4);
  // drawn at its true width at every distance. It may only go out by pixel width: whole where it is 0.6 of a pixel
  // wide, nothing at 0.4 (uPix: one pixel's angle, one number for the whole frame)
  vA = smoothstep(0.4, 0.6, 2.0*r*ms/max(dist*uPix, 1e-7));
  float sq = 1.0+0.25*sin(t*9.0-uTime*3.2);
  vec3 p = c + vec3(position.x*r*sq, 0.0, position.z*r/sq);
  vec4 wp = modelMatrix*vec4(p,1.0);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix)*vec3(position.x,0.15,position.z));
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Gt=pe+`
uniform float uTime, uFlameI, uK;
uniform vec3 uFlamePos, uFlameCol, uAmb, uWineDeep, uWineBody, uWineEdge;
varying vec3 vW; varying vec3 vN; varying float vT; varying float vA;
`+Ae+`
void main(){
  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition-vW+vec3(0.0,1e-5,0.0));
  vec3 Lv = uFlamePos-vW; float d2 = dot(Lv,Lv); vec3 L = Lv*inversesqrt(max(d2,1e-4));
  float att = uFlameI*breath(uFlamePos,uTime)/(1.0+d2*uK);
  vec3 lightC = uFlameCol*att;
  float edge = 1.0-abs(dot(N,V)); edge *= edge;
  float back = max(dot(-V,L),0.0); back *= back;
  vec2 nh = N.xz/max(length(N.xz),1e-4); vec3 H = normalize(L+V+vec3(0.0,1e-5,0.0)); vec2 hh = H.xz/max(length(H.xz),1e-4);
  float sl = pow(max(dot(nh,hh),0.0),14.0);
  float run = 0.7+0.5*sin(vT*30.0-uTime*8.0);
  vec3 col = uWineDeep*(uAmb*2.0+lightC*0.6) + uWineBody*lightC*(0.55+0.9*back);
  col += uWineEdge*(edge*(uAmb*0.6+lightC*(0.7+2.2*back)) + lightC*0.25);
  col += uFlameCol*att*sl*run*3.4;                                       // it catches the candle beyond it
  gl_FragColor = vec4(col, clamp(vA, 0.0, 1.0));
  #include <fog_fragment>
}`,St=he+`
uniform float uTime; uniform vec3 uBase;
varying vec2 vUv;
void main(){
  float y = uv.y; vUv = uv;
  vec3 c = uBase + vec3(0.0, y*1.9, 0.0);
  c.x += (sin(y*3.1-uTime*0.7)*0.07 + sin(y*7.3-uTime*1.3)*0.03*y)*y;
  c.z += (cos(y*2.6-uTime*0.6)*0.06 + sin(y*6.1-uTime*1.1)*0.03*y)*y;
  vec4 wc = modelMatrix*vec4(c,1.0);
  vec3 toC = cameraPosition-wc.xyz; vec2 f = toC.xz/max(length(toC.xz),1e-3);
  float ms = length(modelMatrix[1].xyz);
  wc.xyz += vec3(f.y,0.0,-f.x)*(uv.x-0.5)*(0.035+0.16*y)*ms;
  vec4 mvPosition = viewMatrix*wc; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Tt=pe+`
uniform float uTime; uniform vec3 uFlameCol;
varying vec2 vUv;
void main(){
  float x = abs(vUv.x-0.5)*2.0, y = vUv.y;
  float a = (1.0-x)*(1.0-x)*smoothstep(0.0,0.08,y)*(1.0-y)*(1.0-y);
  a *= 0.75+0.25*sin(y*21.0-uTime*2.3);
  vec3 col = (vec3(0.30,0.27,0.25)+uFlameCol*0.25*(1.0-y))*a*0.16;
  `+We+`
  gl_FragColor = vec4(col,1.0);
}`;function lt(e){const t=(o,f,u)=>{const v=Math.min(1,Math.max(0,(u-o)/(f-o)));return v*v*(3-2*v)},r=(o,f,u)=>Math.min(1,Math.max(0,(u-o)/(f-o))),l=r(300,302,e)*(1-.3*t(400,403,e)),n=1.3*Math.exp(-Math.max(e-407,0)/3.5),d=r(291,300,e);return{level:re+(1-re)*r(300,396,e),dome:.25*t(396,406,e),head:d*d,on:e<406.5?1:0,breakup:t(400,401.5,e),drop:(e-400)/1.5,pour:l+(n-l)*t(404.5,407,e),decanter:B[1]+.75-.55*r(300,406,e)}}async function kt(e,t={}){const r=e.rng.fork?e.rng.fork("to-the-brim-hero"):e.rng,l=t.palette||tt,n=t.look||"midnight",d=r.pick(["ruby","ruby","gold","rose"]),o=t.kit||yt(e,{palette:l,wine:t.wine||d}),f=o.uniforms,u=new a.Group;u.name="to-the-brim-hero",await e.yield();const v=[],h=await Mt(v,r,l,n,e.yield);await e.yield();const p=await Ft(v,l,e.yield);await e.yield();const w=Ue.map((s,y)=>{const[k,L]=Ve(y);return[k+.01,h.top+.05,L+.004]});for(const s of w)z(v,ye([[s[0]-.01,h.top-.03,s[2]-.004],[s[0]-.006,h.top+.02,s[2]-.004],s],.011,2,3),"#1a120c",0,.2);const c=w.map(s=>new a.Vector3(s[0],s[1]+.16,s[2])),M=c.reduce((s,y)=>s.addScaledVector(y,1/6),new a.Vector3),A={uFlamePos:{value:M.clone()},uFlameI:{value:3.2}};await e.yield();const $=Le(v);for(const s of v)s.dispose();const Y=new a.Mesh($,O({...f,...A},ot,at,{side:a.DoubleSide}));u.add(Y),await e.yield();const R={transparent:!0,depthWrite:!1,blending:a.AdditiveBlending},H={uRing:{value:c.map(s=>s.clone())},uCool:{value:new a.Color(0,0,0)}},I={uLevel:{value:re},uDome:{value:0},uPour:{value:0},uPourAt:{value:new a.Vector2((B[0]-W[0])/V,(B[2]-W[2])/V)}},ee=O({...f,...H},De,_e,{...R,side:a.DoubleSide,defines:{BIG:1,MEANS:1}}),b=O({...f,...I,...H},Ge,Se,{defines:{ONE:1,BIG:1}}),i=O({...f,uClipR:{value:we[2]-.06}},$e,et,{transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendSrc:a.OneFactor,blendDst:a.OneMinusSrcAlphaFactor,side:a.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,defines:{BIG:1}}),m=new a.Matrix4,g=new a.Quaternion,x=c[1],F=(s,y,k,L,te=1,Q=x,ut=3)=>{const Ce=o.instanced(s,y,1,k);return Ce.setMatrixAt(0,L?m.compose(new a.Vector3(L[0],L[1],L[2]),g,new a.Vector3(te,te,te)):m.identity()),Ce.geometry.attributes.aFlame.setXYZW(0,Q.x,Q.y,Q.z,ut),Ce.frustumCulled=!1,u.add(Ce),Ce},C=F(o.geometry.one.wine,b,0,W,V),T=F(o.geometry.one.shell,ee,3,W,V),E=F(o.geometry.caustic,i,1,W,1,M,3);await e.yield();const le=r.pick([26,32,38]),U={uLevel:{value:B[1]+.75},uDome:{value:0},uPour:{value:0},uPourAt:{value:new a.Vector2}},P=O({...f,...H,uCut:{value:new a.Vector2(le,le/2.2)}},De,_e,{...R,side:a.DoubleSide,defines:{DEC:1,BIG:1}}),Z=O({...f,...U},Ge,Se,{side:a.DoubleSide,defines:{DEC:1}}),D=Ct(),K=Lt();await e.yield();const se=F(K,Z,0,null,1,c[2],6),ve=F(D,P,3,null,1,c[2],6);D.dispose(),K.dispose(),await e.yield();const j={uSurfY:{value:W[1]+V*ce},uHead:{value:0},uBreak:{value:0},uDrop:{value:0},uOn:{value:0},uLip:{value:new a.Vector3(B[0],B[1],B[2])}},de=new a.Mesh(At(),O({...f,...A,...j},zt,Gt,{transparent:!0,depthWrite:!1}));de.frustumCulled=!1,de.renderOrder=2,u.add(de);const Ee=o.makeFlames(6);w.forEach((s,y)=>Ee.set(y,s[0],s[1],s[2],n==="blue"?.42:.5,.17)),Ee.commit(),u.add(Ee.mesh);const ze=new a.Mesh(new a.PlaneGeometry(1,1,2,28),O({...f,uBase:{value:new a.Vector3(w[4][0],w[4][1]+.5,w[4][2])}},St,Tt,R));ze.frustumCulled=!1,ze.renderOrder=6,u.add(ze);let xe=null;t.light!==!1&&(xe=new a.PointLight(o.flameColor,14,24,2),xe.position.copy(M),u.add(xe)),!t.kit&&n==="blue"?o.setLight(1,"#3f6fd0",new a.Vector3(1,.35,0),.7):!t.kit&&n==="moon"&&o.setLight(1,"#aebfe0",new a.Vector3(-1,.5,0),.7),await e.yield();const qe=t.showcase?Et(e,o,l,u):null;await e.yield();const st=t.routeLength||479.6;function Oe(s){const y=lt(s);I.uLevel.value=y.level,I.uDome.value=y.dome/V,I.uPour.value=y.pour,j.uSurfY.value=W[1]+V*(G.bowlY+G.bowlH*y.level)+y.dome*.9,j.uHead.value=y.head,j.uBreak.value=y.breakup,j.uDrop.value=y.drop,j.uOn.value=y.on&&y.head>0?1:0,U.uLevel.value=y.decanter}const Xe=s=>{Oe(s)};Oe(0);const me=s=>(s.geometry.index?s.geometry.index.count:s.geometry.attributes.position.count)/3,rt={triangles:Math.round(me(Y)+me(C)+me(T)+2+me(se)+me(ve)+me(de)+12+me(ze)),drawCalls:9},Ye=new a.Vector3,N=(s,y,k)=>new a.Vector3(s,y,k),Fe=(s,y,k=24,L=0)=>{const te=[];for(let Q=0;Q<k;Q++)te.push([s*Math.cos(Q*2*S/k),y,s*Math.sin(Q*2*S/k),L]);return te},Ne=[];for(let s=0;s<=12;s++)Ne.push(...Fe(V*ue(s/12),W[1]+V*(G.bowlY+G.bowlH*s/12)));Ne.push(...Fe(V*G.footR,W[1]),[0,W[1]+1.5,0,.15],[0,be+.3,0,.6],[B[0],be+1.3,0,.1]);const Ze=[];for(let s=0;s<=16;s++){const y=Me*s/16,k=ie(y),L=fe(y);for(let te=0;te<8;te++){const Q=te*S/4;Ze.push([k[0]+Math.sin(J)*L*Math.cos(Q),k[1]+Math.cos(J)*L*Math.cos(Q),L*Math.sin(Q),.03])}}const ke=[];for(let s=0;s<=13.5;s+=.75)ke.push([_,s,0,.58]);for(let s=0;s<=10;s++)ke.push([_+(p.end[0]-_)*s/10,p.armTop,0,.2],[_+(p.end[0]-_)*s/10,p.end[1]-1.7,0,.3]);const Pe=[];for(let s=0;s<6;s++){const[y,k]=Ve(s);for(let L=.3;L<=Ie+.6;L+=.6)Pe.push([y,L,k,.38]);Pe.push([y,Ie+.75,k,.1])}const ct=[...Fe(we[0]+.06,.3,36),...Fe(we[1]+.06,.6,36),...Fe(we[2]+.06,.9,36)];return{object:u,kit:o,light:xe,info:rt,uniforms:f,look:n,wine:o.wine,great:H,radius:8.4,height:16.7,center:N(-1.6,7.6,0),ground:!0,groundY:0,anchors:{glass:N(W[0],W[1],W[2]),rim:N(0,be,0),half:N(0,W[1]+V*ce,0),bowl:N(0,W[1]+V*(G.bowlY+.5*G.bowlH),0),lip:N(B[0],B[1],B[2]),flame:M.clone(),flames:c.map(s=>s.clone()),poi:N(0,be,0),flyThrough:[N(0,4.4,49),N(0,5.6,25),N(4.6,8.8,0),N(.6,5.2,-27),N(0,4.2,-65)],portalSeat:{position:N(0,4.2,-65),normal:N(0,0,1),radius:5.5},viewpoints:{closest:{position:N(4.6,8.8,0),lookAt:N(0,be,0)},approach:{position:N(0,5.4,28),lookAt:N(0,W[1]+V*ce,0)}}},bodies:[["the great glass (bowl, rim, foot, stem, dome, thread)",2.6,Ne],["the great decanter",3,Ze],["the crane and the yoke",3,ke],["a candle stand of the great glass (to its flame's tip)",2,Pe],["the great glass's plinth",2,ct]],setMetres:Xe,setProgress:s=>Xe(s*st),fillLaw:lt,setLight:(s,y,k,L)=>{o.setLight(s,y,k,L),A.uFlameI.value=3.2*s,xe&&(xe.intensity=14*s)},update(s,y,k){o.update(y),u.updateWorldMatrix(!0,!1),Ye.set(M.x+.035*Math.sin(y*1.7),M.y+.02*Math.sin(y*2.3),M.z+.035*Math.cos(y*1.3)),A.uFlamePos.value.copy(Ye.applyMatrix4(u.matrixWorld));for(let L=0;L<6;L++)H.uRing.value[L].copy(c[L]).applyMatrix4(u.matrixWorld);qe&&qe.update(y)},dispose(){for(const s of["near","mid","far","speck","one"])o.geometry[s].shell.dispose(),o.geometry[s].wine.dispose();o.geometry.caustic.dispose()}}}function Et(e,t,r,l){const n=[],u="#cfcac0",v=new a.BoxGeometry(3,2.4,8.399999999999999,10,6,28);v.translate(-2.2,1.8,(4.3+12.7)/2);{const i=v.attributes.position;for(let m=0;m<i.count;m++){const g=i.getX(m),x=i.getY(m),F=i.getZ(m);if(x>2.99)continue;const C=(3-x)/2.4,T=(g- -2.2)*2.1+F*3.3,E=.05+.1*C;i.setXYZ(m,g+Math.sign(g- -2.2)*(Math.abs(g- -2.2)>1.49?E*(1+.6*Math.sin(F*4.1)):0),x,F+(F<4.3+.01?-1:F>12.7-.01?1:0)*E*(1+.6*Math.sin(T)))}v.computeVertexNormals()}z(n,v,r[0],0,.1,3,{shade:(i,m)=>.72*(.45+.55*Math.min(1,(m-.6)/2))});const h=new a.PlaneGeometry(.5,12.7-4.3-.3,1,1);h.rotateX(-S/2),h.translate(-2.2,3.004,(4.3+12.7)/2),z(n,h,r[5],0,.3,3,{shade:()=>.8});const p=[5.3,8.5,11.7],w=4;for(const i of p)z(n,oe([[.17,0],[.18,.02],[.16,.05],[.07,.09],[.04,.2],[.06,.26],[.04,.32],[.05,.4],[.12,.44],[.13,.47],[.075,.48],[.07,.52]],16),u,1,.85,0,{matrix:ae(-2.2,3,i)}),z(n,oe([[.062,.47],[.064,.8],[.062,.93],[.064,.955],[.04,.945]],12,{top:[.94,0,0]}),r[0],0,.5,0,{matrix:ae(-2.2,3,i),shade:()=>.8,glow:(m,g)=>.5*Math.exp(-Math.max(3.95-g,0)/.15)});const c={uFlamePos:{value:new a.Vector3},uFlameI:{value:1.6}},M=Le(n);for(const i of n)i.dispose();const A=new a.Mesh(M,O({...t.uniforms,...c},ot,at,{side:a.DoubleSide}));l.add(A);const $=t.makeFlames(p.length);p.forEach((i,m)=>$.set(m,-2.2,w,i,.32,.12)),$.commit(),l.add($.mesh);const Y=t.makeGlasses("near",5),R=t.makeGlasses("mid",3),H=t.makeGlasses("far",2),I=i=>p.reduce((m,g)=>Math.abs(g-i)<Math.abs(m-i)?g:m,p[0]);for(let i=0;i<5;i++){const m=4.9+1.6*i,g=I(m);Y.set(i,-2.2+.9,3,m,-2.2,w+.15,g,1),i<3?R.set(i,-2.2-.9,3,m,-2.2,w+.15,g,1):H.set(i-3,-2.2-.9,3,m,-2.2,w+.15,g,1)}for(const i of[Y,R,H])i.commit(),l.add(i.group);const ee=new a.Vector3(-2.2,w+.15,p[1]),b=new a.Vector3;return{update(){c.uFlamePos.value.copy(b.copy(ee).applyMatrix4(l.matrixWorld))}}}export{G as GLASS,mt as GLSL_GUST,V as GREAT,vt as GREAT_INSET,Ke as GREAT_SEG,ft as GREAT_WALL,re as HALF,ce as HALF_Y,ue as bowlR,kt as buildHero,lt as fillLaw,yt as makeGlassKit};
