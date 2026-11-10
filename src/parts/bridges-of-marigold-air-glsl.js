import{GLSL_HASH as p,GLSL_VALUE_NOISE as $,GLSL_FBM as f,GLSL_FOG_PARS_VERT as l,GLSL_FOG_VERT as m,GLSL_FOG_PARS_FRAG as v}from"../kit/fx.js";import{TOWERS as c,GREAT_BRIDGE as e,HIGH_BRIDGE as r,CANYON_BRIDGE as a,ring as g}from"./bridges-of-marigold-plan.js";const t=o=>{const n=String(Math.round(o*1e4)/1e4);return/[.e]/.test(n)?n:n+"."},u=p+$+f,y=l,z=m,_=v,i=g(a.b,a.r0),s=g(a.b,a.r1),G={x0:i[0],z0:i[1],x1:s[0],z1:s[1],length:a.r1-a.r0},R=`
float mgGreatDeck(float z){ float t=(${t(e.z0)}-z)/${t(e.z0-e.z1)};
  return ${t(e.y0)}+${t(e.y1-e.y0)}*t+${t(e.rise)}*t*(1.-t); }
float mgHighDeck(float z){ float t=(z-${t(r.z0)})/${t(r.z1-r.z0)};
  return ${t(r.y0)}+${t(r.y1-r.y0)}*t+${t(r.rise)}*t*(1.-t); }
float mgCanyonDeck(float s){ return ${t(a.y0)}+${t(a.y1-a.y0)}*s+${t(a.rise)}*s*(1.-s); }
vec3 mgBridge(int k, vec2 p){
  if(k==0){ float z=clamp(p.y, ${t(e.z1)}, ${t(e.z0+14)});
    return vec3(length(p-vec2(${t(e.x)}, z)), mgGreatDeck(z), ${t(e.width/2)}); }
  if(k==1){ float z=clamp(p.y, ${t(r.z0)}, ${t(r.z1+12)});
    return vec3(length(p-vec2(${t(r.x)}, z)), mgHighDeck(z), ${t(r.width/2)}); }
  vec2 a=vec2(${t(i[0])}, ${t(i[1])}), d=vec2(${t(s[0]-i[0])}, ${t(s[1]-i[1])});
  float s=clamp(dot(p-a, d)/dot(d, d), 0., 1.);
  return vec3(length(p-a-d*s), mgCanyonDeck(s), ${t(a.width/2)}); }
`,P=c.length,S=`
const int MG_TOWERS = ${c.length};
vec4 mgTower(int k){
${c.map((o,n)=>`  if(k==${n}) return vec4(${t(o.x)}, ${t(o.z)}, ${t(o.footR)}, ${t(o.footTop)});`).join(`
`)}
  return vec4(0.); }
vec4 mgStack(int k){
${c.map((o,n)=>`  if(k==${n}) return vec4(${t(o.r)}, ${t(o.r*(1-o.taper))}, ${t(o.base)}, ${t(o.top)});`).join(`
`)}
  return vec4(1.); }
`,E=`
float mgPetal(vec2 q){
  float y=clamp(q.y, 0., 1.);
  float w=0.16+0.84*smoothstep(0., 0.62, y);          // narrow foot, broad shoulder
  w*=1.-0.55*smoothstep(0.78, 1.0, y);               // rounded tip
  float notch=0.085*smoothstep(0.75, 1.0, y)*(0.5+0.5*cos(q.x*9.42));   // three soft teeth at the tip
  float tip=1.0-notch-0.04;
  return min(w-abs(q.x), min(q.y+0.0, tip-q.y)); }
vec3 mgPetalHue(float s){
  vec3 deep=vec3(1.0, 0.20, 0.012), mid=vec3(1.0, 0.36, 0.02), gold=vec3(1.0, 0.56, 0.06);
  return s<0.5 ? mix(deep, mid, s*2.) : mix(mid, gold, s*2.-1.); }
`,d=`
vec3 mgHang(vec3 rest, vec4 hang, float time){
  float s = hang.z*(0.7*sin(time*0.62 + hang.w) + 0.3*sin(time*1.37 + hang.w*2.3));
  return rest + vec3(hang.x*s, -abs(s)*0.08, hang.y*s); }
`,L=`
${l}${d}
attribute vec4 aP, aHang, aCol; uniform float uTime, uPx, uDrop; varying vec2 vQ; varying vec3 vCol;
void main(){
  vec3 c = mgHang(aP.xyz, aHang, uTime); c.y -= uDrop;
  vec4 mvPosition = viewMatrix*vec4(c, 1.); float dist = max(-mvPosition.z, 0.05);
  float size = max(aP.w, uPx*dist*3.0), dim = (aP.w/size); dim *= dim;
  float tw = 0.82 + 0.18*sin(uTime*(1.7 + 2.6*aCol.w) + aCol.w*61.);
  vCol = aCol.rgb*tw*mix(1., dim, 0.75); vQ = position.xy*2.;
  mvPosition.xy += position.xy*size; gl_Position = projectionMatrix*mvPosition;
${m} }`,w=`
${v}
uniform float uCore, uHalo; varying vec2 vQ; varying vec3 vCol;
void main(){
  float d = length(vQ), core = smoothstep(0.22, 0.07, d), halo = exp(-d*d*5.5)*(1. - smoothstep(0.7, 1., d));
  vec3 col = vCol*(core*uCore + halo*uHalo)*(1. - 0.7*fxFog());
  gl_FragColor = vec4(col, 1.);
}`;export{G as CANYON_LINE,_ as FOG_FRAG_PARS,z as FOG_VERT,y as FOG_VERT_PARS,d as HANG,u as NOISE,E as PETAL,R as PLACE,w as SPARK_FRAG,L as SPARK_VERT,P as TOWER_COUNT,S as TOWER_GLSL};
