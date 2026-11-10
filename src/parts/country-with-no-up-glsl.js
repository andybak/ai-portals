import*as t from"three";const E={x:0,z:140,r:80,court:130},T={x:0,z:-238,r:150},h=new t.Vector3(0,185,-558),b=88,i=80,f=new t.Vector3(0,0,-238),m=f.clone().sub(h).normalize(),l=h.distanceTo(f),P=new t.Vector3(-700,420,-1500),y=(e,o,u)=>{const r=Math.min(1,Math.max(0,(u-e)/(o-e)));return r*r*(3-2*r)},v=(e,o,u,r,g,x,w)=>{const s=r-e,a=(w-e)/s,c=a*a,n=c*a;return(2*n-3*c+1)*o+(n-2*c+a)*s*u+(-2*n+3*c)*g+(n-c)*s*x},p=l-i/Math.abs(m.y),d=l+15/Math.abs(m.y);function R(e,o){return e<=o.leave?0:e<o.touch?v(o.leave,0,0,o.touch,p,.75,e):e<o.half?v(o.touch,p,.75,o.half,l,.067,e):e<o.end?v(o.half,l,.067,o.end,d,0,e):d}function C(e,o=new t.Vector3){return o.copy(h).addScaledVector(m,e)}function G(e){return Math.sqrt(Math.max(0,i*i-e*e))}const A=["#49D6C6","#A98BFF","#F2B24E","#EDEBFA","#FFE2A8","#DCD0FF","#FF4A2E","#0B0F2A"];function F(){const e=new t.DataTexture(new Uint8Array(4),1,1,t.RGBAFormat,t.UnsignedByteType);return e.needsUpdate=!0,e}function z(){const e=o=>new t.Color(o);return{uEye:{value:new t.Vector3(0,1,480)},uLift:{value:0},uTime:{value:0},uMap:{value:0},uPx:{value:400},uCircle:{value:new t.Vector4(0,-376,0,0)},uSphere:{value:new t.Vector4(0,185,-558,i)},uFogP:{value:new t.Vector4(.008,.25,7,1)},uFogA:{value:e("#0E3A4E")},uFogB:{value:e("#2A2463")},uGl:{value:[new t.Vector4(0,140,150,1),new t.Vector4(-330,120,260,1),new t.Vector4(330,120,260,1),new t.Vector4(0,420,230,1)]},uGlC:{value:[e("#F2B24E"),e("#A98BFF"),e("#A98BFF"),e("#49D6C6")]},uPal:{value:A.map(e)},uAge:{value:new t.Vector4(0,-1e5,0,0)},uHour:{value:new t.Vector4(1,1,0,0)},uSq:{value:new t.Vector4(0,-50,0,0)},uRain:{value:new t.Vector4(0,0,0,0)},uGlow:{value:F()},uGlowR:{value:new t.Vector4(-1320,-1320,1/2640,0)}}}const L=`
precision highp float;
uniform vec3 uEye; uniform float uLift, uTime, uMap, uPx;
uniform vec4 uCircle, uSphere, uFogP, uAge, uHour, uRain, uSq;
uniform vec3 uFogA, uFogB, uPal[8];
uniform vec4 uGl[4]; uniform vec3 uGlC[4];
uniform sampler2D uGlow; uniform vec4 uGlowR;
float cH(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.x); }
float cH1(float n){ n = fract(n*0.1031); n *= n + 33.33; n *= n + n; return fract(n); }
float cN(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(cH(i), cH(i + vec2(1.,0.)), f.x), mix(cH(i + vec2(0.,1.)), cH(i + vec2(1.,1.)), f.x), f.y);
}
// edge colour of a class, with the age: after colour was forbidden every edge is pearl-grey (the gold of the priests
// and the one vermilion square keep theirs); on the rare day the painting runs north as a front
vec3 edgeCol(float id, vec2 p){
  vec3 c = uPal[int(clamp(id, 0., 7.) + .5)];
  float keep = step(5.5, id) + step(3.5, id)*step(id, 4.5);
  float grey = uAge.x*(1. - smoothstep(-40., 40., p.y - uAge.y + 30.*(cN(p*0.02) - .5)));
  vec3 g = vec3(0.62, 0.68, 0.80)*(0.55 + 0.45*dot(c, vec3(.3, .5, .2)));
  return mix(c, g, grey*(1. - clamp(keep, 0., 1.)));
}
// the town's own light gathered over some 20 m: warm where houses stand close, aqua along the soldiers' roads
vec3 townGlow(vec2 p){
  vec4 g = textureLod(uGlow, (p - uGlowR.xy)*uGlowR.z, 0.);
  g *= g*(1.6 - 0.6*g);                                   // the strongest hue of a district leads: light gathered, not summed to white
  vec3 c = g.r*uPal[2] + g.g*uPal[0] + g.b*uPal[1] + g.a*uPal[3]*0.45;
  c /= 1. + 0.55*dot(c, vec3(.3, .5, .2));
  float grey = uAge.x*(1. - smoothstep(-40., 40., p.y - uAge.y));
  return mix(c, vec3(0.62, 0.68, 0.80)*dot(c, vec3(.3, .5, .2)), grey)*uGlowR.w;
}
// the light the mist carries at a place: cool and dim over empty glass, lifted by the districts under it and by the circle
vec3 fogLight(vec2 p){
  float m = cN(p*0.0031 + vec2(uTime*0.011, -uTime*0.007));
  vec3 c = mix(uFogA, uFogB, smoothstep(.3, .7, m));
  c = mix(c, vec3(dot(c, vec3(.4, .5, .6)))*vec3(.75, .9, 1.25), 0.8*uAge.x);
  float r = length(p - vec2(0., -100.));
  c *= 0.22 + 0.78*(1. - smoothstep(520., 1350., r));
  for (int i = 0; i < 4; i++) { vec2 d = p - uGl[i].xy; c += uGlC[i]*uGl[i].w*exp(-dot(d, d)/(uGl[i].z*uGl[i].z)); }
  float e = max(length(p - uCircle.xy) - uCircle.z, 0.);
  c += uPal[4]*uCircle.w*0.10*exp(-e/45.);
  c += townGlow(p)*0.03;
  return c*uFogP.w;
}
// rgb: light scattered toward the eye on the way to P; a: how much of P is left. dir must be a unit vector, L the distance
vec4 slabFogRay(vec3 dir, float L){
  if (uMap > 0.5) return vec4(0., 0., 0., 1.);
  float dy = abs(dir.y) < 1e-4 ? (dir.y < 0. ? -1e-4 : 1e-4) : dir.y;
  float t0 = (0. - uEye.y)/dy, t1 = (uFogP.z - uEye.y)/dy;
  float tA = max(min(t0, t1), 0.), tB = min(max(t0, t1), L);
  float len = max(tB - tA, 0.);
  vec2 s1 = uEye.xz + dir.xz*(tA + min(len, 70.)*0.5), s2 = uEye.xz + dir.xz*(tA + min(len, 420.)*0.62);
  float breath = 1. + uFogP.y*(2.*cN(s1*0.006 + vec2(uTime*0.03, -uTime*0.021)) - 1.);
  float od = uFogP.x*breath, T = exp(-od*len), T1 = exp(-od*min(len, 110.));
  return vec4(fogLight(s1)*(1. - T1) + fogLight(s2)*(T1 - T), T);
}
vec4 slabFog(vec3 P){ vec3 d = P - uEye; float L = length(d); return slabFogRay(d/max(L, 1e-3), L); }
// THE GLASS AS A MIRROR, one law for every point and every eye (Schlick's): how much of what stands over it the glass
// mirrors, from s, the sine of the angle between the line of sight and the glass at the point seen: all of it where
// the sight grazes the glass, 3 in a hundred seen from straight above. Space, the horizon's band and the bodies' own
// reflections all take it.
float mirrorK(float s){ float om = 1. - clamp(s, 0., 1.); return 0.03 + 0.97*om*om*om*om*om; }
// THE COUNTRY'S FAR EDGE, a rule of the place: the country is whole within 700 m of its middle (0, -100) and gone by
// 1150 m (the plan's own fullness: its houses thin over the same ring), and its lights dim over that ring with it:
// 1 inside, 0 beyond. Everything lit that lies on the glass takes it; what is left beyond is the far mist's low glow.
float edgeDim(vec2 p){ return 1. - smoothstep(700., 1150., length(p - vec2(0., -100.))); }
// the circle's own light on anything lying in the plane
float circleLight(vec2 p){ float e = max(length(p - uCircle.xy) - uCircle.z, 0.); return uCircle.w*exp(-e/36.)/(1. + e*0.02); }
`,S=`
vec3 horizon(vec3 d){
  vec2 a = d.xz/max(length(d.xz), 1e-3);
  float m = cN(a*1.9 + vec2(3.1, uTime*0.004)), m2 = cN(a*5.3 + 11.);
  vec3 c = mix(vec3(0.05, 0.42, 0.50), vec3(0.34, 0.20, 0.70), smoothstep(0.25, 0.75, m));
  c = mix(c, vec3(dot(c, vec3(.3, .5, .2)))*vec3(.8, .95, 1.3), 0.75*uAge.x);
  float band = d.y >= 0. ? exp(-d.y/0.07) : exp(d.y/0.08);
  return c*band*(0.13 + 0.08*m2);
}
vec3 skyCol(vec3 d){
  float h = clamp(d.y, -1., 1.);
  vec3 c = mix(vec3(0.0075, 0.0125, 0.0380), vec3(0.0028, 0.0038, 0.0115), smoothstep(0., 0.7, abs(h)));
  vec2 q = d.xz/(abs(h) + 0.4);
  float m1 = cN(q*1.1 + vec2(uTime*0.003, 0.)), m2 = cN(q*2.7 - vec2(0., uTime*0.002)), m3 = cN(q*0.55 + 5.);
  c *= 0.55 + 0.9*m1 + 0.45*m2;
  c += vec3(0.0100, 0.0060, 0.0300)*smoothstep(0.42, 0.85, m3) + vec3(0.0020, 0.0100, 0.0140)*smoothstep(0.5, 0.9, 2.*m1*m2);
  return c + horizon(d);
}
`;export{L as COMMON,T as FIELD,E as HALL,h as HOOP,b as HOOP_R,A as PALETTE,P as POINT,f as REST,S as SKY,i as SPHERE_R,m as TRACK,l as TRACK_LEN,G as circleR,z as makeShared,y as smooth,C as spherePos,R as sphereS};
