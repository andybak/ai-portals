import*as t from"three";import{mergeGeometries as Vt}from"three/addons/utils/BufferGeometryUtils.js";const _t=["#c4b9a3","#8f8572","#4e4a46","#1e1a22","#2f5fd0","#d02f4a","#ffcf5a"],G=30,dt=9,Ae=`
uniform vec3 uBlue, uRuby, uGold;
uniform vec4 uVar;            // x: eye fold count, y: rotation, z: seed offset, w: alternate scheme
uniform float uRoseT;         // seconds: panes glint and dim one by one as the sun moves behind them
const float R_PI = 3.14159265;
vec2 rHash(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
vec3 rVoro(vec2 x){
  vec2 n = floor(x), f = fract(x), mg = vec2(0.), mr = vec2(0.); float md = 8.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)); vec2 r = g + rHash(n + g) - f; float d = dot(r, r);
    if (d < md) { md = d; mr = r; mg = g; } }
  md = 8.;
  for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++) {
    vec2 g = mg + vec2(float(i), float(j)); vec2 r = g + rHash(n + g) - f;
    if (dot(mr - r, mr - r) > 1e-5) md = min(md, dot(0.5 * (mr + r), normalize(r - mr))); }
  vec2 h = rHash(n + mg + 17.3);
  return vec3(md, h);
}
float rSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)); }
// p: metres from the rose centre in the wall plane (x toward +X, y up). detail 1 = leaded panes, 0 = smooth.
// soft: edge softness of the stone mask in metres. Returns linear colour, 0 where stone blocks the light.
vec3 roseGlass(vec2 p, float detail, float soft){
  float r = length(p);
  if (r > 9.05 + soft) return vec3(0.);
  float ang = atan(p.y, p.x) + uVar.y;
  float s = R_PI / 6.;
  float sec = floor((ang + s * .5) / s);
  float a = abs(mod(ang + s * .5, s) - s * .5);
  vec2 q = r * vec2(cos(a), sin(a));
  const vec2 e = vec2(0.9659258, 0.2588190);
  float d = 9.0 - r;
  d = min(d, abs(r - 5.15) - .2);
  d = min(d, rSeg(q, 5.15 * e, 6.6 * e) - .13);
  float dArch = length(q - vec2(6.375, -.729)) - 2.437;
  d = min(d, (q.x > 6.375 ? abs(dArch) : length(q - 6.6 * e)) - .12);
  float dOc = length(q - 8.2 * e) - .6;
  d = min(d, abs(dOc) - .08);
  float dMed = length(q - vec2(7.3, 0.)) - .72;
  d = min(d, abs(dMed) - .07);
  float sE = 2. * R_PI / uVar.x;
  float aE = abs(mod(ang + sE * .5, sE) - sE * .5);
  vec2 qe = r * vec2(cos(sE * .5 - aE), sin(sE * .5 - aE));
  d = min(d, rSeg(qe, vec2(1.3, 0.), vec2(4.2, 0.)) - .07);
  d = min(d, abs(r - 1.3) - .09);
  d = min(d, abs(r - 4.2) - .1);
  float alt = mod(sec + uVar.w, 2.);
  vec3 c;
  if (r < 1.3) c = mix(uRuby, uGold, smoothstep(.45, .6, r));
  else if (r < 4.2) { c = mod(floor(ang / sE + .5), 2.) < .5 ? uBlue : mix(uBlue, uRuby, .8); if (r < 1.9) c = uRuby; if (abs(r - 3.0) < .28 && aE < sE * .2) c = uGold; }
  else if (r < 5.15) c = mix(uGold, uRuby, step(.6, fract(ang * 36. / (2. * R_PI))) * .75);
  else if (q.x < 6.375 || dArch < 0.) {
    c = uBlue;
    if (dMed < 0.) c = alt < .5 ? uRuby : uGold;
    else if (dArch > -.32 && q.x > 6.375) c = mix(uRuby, uBlue, .15);
    else if (r < 5.75) c = uRuby;
  } else c = dOc < 0. ? uGold : (alt < .5 ? uRuby : mix(uRuby, uBlue, .35));
  if (detail > 0.) {
    vec3 v = rVoro(p * 2.4 + uVar.z);
    vec3 cd = c * (.45 + .9 * v.y);
    cd *= 1. + .34 * sin(uRoseT * (.55 + 1.5 * v.z) + v.y * 37.) + .16 * sin(uRoseT * .37 - r * .9);
    cd = mix(cd, cd.gbr * .6 + cd * .5, step(.9, v.z) * .35);
    cd = mix(cd, uGold, step(.965, v.z) * .8);
    cd *= smoothstep(.015, .05, v.x);
    c = mix(c * (.82 + .14 * sin(uRoseT * .37 - r * .9 + sec * 1.7)), cd, detail);
  }
  return c * smoothstep(0., max(soft, .02), d);
}
vec3 lancetGlass(vec2 p, float hw, float seed){
  // p.x in [-hw,hw], p.y from the sill upward
  float bx = hw - abs(p.x);
  float cell = 2.6; float k = floor(p.y / cell); vec2 m = vec2(p.x, mod(p.y, cell) - cell * .5);
  float dm = length(m) - hw * .72;
  float alt = mod(k + seed, 2.);
  vec3 c = alt < .5 ? uBlue : mix(uRuby, uBlue, .12);
  if (dm < 0.) c = alt < .5 ? uRuby : uBlue;
  if (abs(dm) < .09) c = uGold;
  if (length(m) < hw * .28) c = uGold;
  if (bx < .22) c = mod(floor(p.y / .45), 2.) < .5 ? uRuby : uGold;
  vec3 v = rVoro(p * 2.8 + seed * 13.7);
  c *= .5 + .95 * v.y;
  c *= 1. + .3 * sin(uRoseT * (.5 + 1.4 * v.z) + v.y * 31. + seed);
  c = mix(c, c.gbr * .6 + c * .5, step(.86, v.z) * .5);
  c *= smoothstep(.015, .05, v.x);
  c *= smoothstep(.0, .04, abs(bx - .22) ) * smoothstep(0., .05, abs(abs(dm) - .09));
  // horizontal saddle bars
  c *= smoothstep(.0, .03, abs(mod(p.y, 1.3) - .65) - .02);
  return c;
}
`,mt=`
uniform vec4 uSunS;           // xy: shear (Lx/Lz, Ly/Lz), z: intensity, w: cone length (z)
uniform vec4 uLan;            // lancets: count, spacing, half width, sill height
uniform float uLanSpring;
uniform vec2 uLanS;           // shear of the lancets' light (the true sun; the rose may use a lower one)
float gRoseSoft = 0.;
vec3 lancetLightAt(vec3 p){
  vec2 q = p.xy - uLanS * p.z;
  if (q.y < uLan.w || q.y > uLanSpring + 1.1 + uLan.z * 1.8) return vec3(0.);
  float h = (uLan.x - 1.) * .5;
  float i = clamp(floor(q.x / uLan.y + h + .5), 0., uLan.x - 1.);
  float cx = (i - h) * uLan.y, lx = q.x - cx;
  if (abs(lx) > uLan.z) return vec3(0.);
  float spring = uLanSpring + (1. - abs(i - h) / h) * 1.1, R = 2. * uLan.z, e = abs(lx) + uLan.z;
  if (q.y > spring + sqrt(max(R * R - e * e, 0.))) return vec3(0.);
  return lancetGlass(vec2(lx, q.y), uLan.z, floor(cx * .37 + 9.)) * uSunS.z * .8 * (1. - smoothstep(30., 44., p.z));
}
vec3 roseLightAt(vec3 p, float detail){
  if (p.z < .3 || p.z > uSunS.w) return vec3(0.);
  vec2 q = p.xy - uSunS.xy * p.z - vec2(0., ${G}.);
  float fade = 1. - smoothstep(uSunS.w * .72, uSunS.w, p.z);
  vec3 l = roseGlass(q, detail, .03 + p.z * .012 + gRoseSoft) * fade * uSunS.z;
  if (detail > .5 && p.z > 1.5) l += lancetLightAt(p);
  return l;
}
`;async function Ce(i,l,c,x=.35){let z=0;for(const R of l)z+=R.g.index?R.g.index.count:R.g.attributes.position.count;const p=new Float32Array(z*3),u=new Float32Array(z*3);let g=0;for(const{g:R,col:H,amp:ae}of l){await i.yield?.();const q=R.attributes.position.array,P=R.index?R.index.array:null,y=P?P.length:q.length/3;for(let A=0;A<y;A++,g+=3){const L=(P?P[A]:A)*3,j=q[L],Q=q[L+1],te=q[L+2],O=1+ae*1.3*c.n3(j*x,Q*x,te*x);p[g]=j,p[g+1]=Q,p[g+2]=te,u[g]=H.r*O,u[g+1]=H.g*O,u[g+2]=H.b*O}R.dispose()}await i.yield?.();const b=new t.BufferGeometry;return b.setAttribute("position",new t.BufferAttribute(p,3)),b.setAttribute("color",new t.BufferAttribute(u,3)),b.computeVertexNormals(),b}function M(i,l,c,x,z,p=.06){const u=i.length,g=[[-c,x],[-c,z-p],[-c+p,z],[c-p,z],[c,z-p],[c,x]],b=[],R=[],H=g.length;for(let P=0;P<u;P++){const y=i[l?(P-1+u)%u:Math.max(P-1,0)],A=i[l?(P+1)%u:Math.min(P+1,u-1)];let L=A[0]-y[0],j=A[1]-y[1];const Q=Math.hypot(L,j)||1;L/=Q,j/=Q;for(const[te,O]of g)b.push(i[P][0]-j*te,i[P][1]+L*te,O)}const ae=l?u:u-1;for(let P=0;P<ae;P++){const y=P*H,A=(P+1)%u*H;for(let L=0;L<H;L++){const j=(L+1)%H;R.push(y+L,A+L,A+j,y+L,A+j,y+j)}}const q=new t.BufferGeometry;return q.setAttribute("position",new t.Float32BufferAttribute(b,3)),q.setIndex(R),q}const ht=(i,l,c,x,z,p)=>{const u=[];for(let g=0;g<=p;g++){const b=x+(z-x)*(g/p);u.push([i+Math.cos(b)*c,l+Math.sin(b)*c])}return u},E=(i,l,c,x)=>ht(i,l,c,0,Math.PI*2*(1-1/x),x-1);function S(i,l,c,x,z,p,u=0){const g=new t.BoxGeometry(i,l,c);return u&&g.rotateZ(u),g.translate(x,z,p),g}function De(i,l,c,x,z=10){const p=l*2,u=[[i-l,c],[i+l,c]],g=Math.acos((p-l)/p);for(let b=0;b<=z;b++){const R=g*(b/z);u.push([i+l-p+Math.cos(R)*p,x+Math.sin(R)*p])}for(let b=z-1;b>=0;b--){const R=g*(b/z);u.push([i-l+p-Math.cos(R)*p,x+Math.sin(R)*p])}return u}function ve(i,l,c){if(i.userData.rosePatched)return i;i.userData.rosePatched=!0;const x=u=>Object.prototype.hasOwnProperty.call(i,u)?i[u]:null,z=x("onBeforeCompile"),p=x("customProgramCacheKey");return i.onBeforeCompile=(u,g)=>{z&&z.call(i,u,g);for(const b of["uBlue","uRuby","uGold","uVar","uRoseT","uSunS","uLan","uLanSpring","uRoseInv","uSunLW","uFloorTint","uAisle","uAisleC","uLanS","uRoseK"])u.uniforms[b]=l[b];u.vertexShader=u.vertexShader.replace("#include <common>",`#include <common>
uniform mat4 uRoseInv; varying vec3 vRoseP; varying vec3 vRoseN;`).replace("#include <project_vertex>",`#include <project_vertex>
        { vec4 rwp = vec4(transformed, 1.);
        #ifdef USE_INSTANCING
          rwp = instanceMatrix * rwp;
        #endif
          vRoseP = (uRoseInv * modelMatrix * rwp).xyz; vRoseN = normalize(mat3(uRoseInv) * mat3(modelMatrix) * objectNormal); }`),u.fragmentShader=u.fragmentShader.replace("#include <common>",`#include <common>
        varying vec3 vRoseP; varying vec3 vRoseN; uniform vec3 uSunLW; uniform vec3 uFloorTint; uniform vec4 uAisle; uniform vec3 uAisleC; uniform vec2 uRoseK;
        ${Ae}
        ${mt}`).replace("#include <color_fragment>",`#include <color_fragment>
        ${c===1?`{
          vec3 P = vRoseP; float row = floor(P.y / .62); float u = (P.x + P.z * .7) / 1.35 + mod(row, 2.) * .5 + rHash(vec2(row, 3.)).x * .3;
          vec2 f = vec2(fract(u), fract(P.y / .62)); vec2 h = rHash(vec2(floor(u), row));
          float mortar = smoothstep(.0, .035, f.x) * smoothstep(1., .965, f.x) * smoothstep(.0, .06, f.y) * smoothstep(1., .94, f.y);
          diffuseColor.rgb *= (.82 + .3 * h.x) * mix(.6, 1., mortar);
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(.8, .82, 1.05), h.y * .5);
        }`:""}
        ${c===2?`{
          vec2 t = vRoseP.xz / 1.625; vec2 f = fract(t); float ch = mod(floor(t.x) + floor(t.y), 2.);
          vec2 h = rHash(floor(t));
          float vein = sin(t.x * 9. + sin(t.y * 7. + h.x * 6.) * 2.5 + h.y * 20.);
          vec3 tile = mix(uFloorTint * .16, vec3(1.), ch) * (.85 + .2 * h.x) * (1. - .12 * smoothstep(.6, 1., vein));
          float joint = smoothstep(.0, .012, f.x) * smoothstep(1., .988, f.x) * smoothstep(.0, .012, f.y) * smoothstep(1., .988, f.y);
          if (abs(vNormalY) > .7) diffuseColor.rgb *= tile * mix(.5, 1., joint);
        }`:""}`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        { vec3 Lv = normalize((viewMatrix * vec4(uSunLW, 0.)).xyz);
          float nd0 = dot(normal, -Lv), ndl = max(nd0, 0.);
          ndl = mix(ndl, smoothstep(-.04, .22, nd0) * (.42 + .58 * ndl), uRoseK.y);      // grazed walls still take the pattern
          totalEmissiveRadiance += mix(diffuseColor.rgb, vec3(.55), .45) * roseLightAt(vRoseP, 1.) * ndl * 2.6 * uRoseK.x;
          // candle glow low on the outer aisle walls (the stands along them, one per bay), see setAisleGlow
          if (uAisle.w > 0.) {
            float az = cos(6.2831853 * (vRoseP.z - uAisle.z) / uAisle.y) * .5 + .5, ay = vRoseP.y - 4.5;
            totalEmissiveRadiance += diffuseColor.rgb * uAisleC * (uAisle.w * smoothstep(uAisle.x - 1.2, uAisle.x - .2, abs(vRoseP.x)) * (.3 + .7 * az * az) * exp(-ay * ay * (ay > 0. ? .012 : .05))
              * (.92 + .08 * sin(uRoseT * 6.3 + vRoseP.z * .4)));
          }
          // coloured spill of the glass on the stone around it (reveals, tracery flanks, wall face)
          vec2 rq = vRoseP.xy - vec2(0., ${G}.); float rr = length(rq);
          if (vRoseP.z < 3. && rr < 22.) {
            float flank = 1. - abs(vRoseN.z);
            vec3 near = roseGlass(rq + vRoseN.xy * .28, 0., .25);
            vec3 spillC = uBlue * .55 + uRuby * .5 + uGold * .28;
            float halo = exp(-max(rr - 9., 0.) * .28) * smoothstep(-1.4, .1, vRoseP.z) * (.35 + .65 * max(vRoseN.z, 0.));
            totalEmissiveRadiance += diffuseColor.rgb * (near * flank * 1.6 * step(vRoseP.z, 0.) * step(-.72, vRoseP.z) + spillC * halo * .34) * uSunS.z;
          } }`),c===2&&(u.vertexShader=u.vertexShader.replace("#include <common>",`#include <common>
varying float vNormalY;`).replace("#include <project_vertex>",`#include <project_vertex>
vNormalY = normal.y;`),u.fragmentShader=u.fragmentShader.replace("#include <common>",`#include <common>
varying float vNormalY;`))},i.customProgramCacheKey=()=>(p?p.call(i)+"|":"")+"glass-nave-"+c,i}const Tt=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aInfo;           // x: kind (0 rose, 1 lancet), y: per-window seed, z: half width (lancet)
varying vec2 vP; varying vec3 vInfo; varying vec3 vView; varying vec3 vWN;
void main(){
  vP = position.xy; vInfo = aInfo;
  vec4 wp = modelMatrix * vec4(position, 1.);
  vView = wp.xyz - cameraPosition;
  vWN = normalize(mat3(modelMatrix) * vec3(0., 0., 1.));
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,It=`
#include <common>
#include <fog_pars_fragment>
${Ae}
uniform vec3 uSunLW; uniform float uTime; uniform vec4 uSunS; uniform float uGlassGain;
varying vec2 vP; varying vec3 vInfo; varying vec3 vView; varying vec3 vWN;
void main(){
  float far = smoothstep(60., 150., length(vView));
  vec3 c = vInfo.x < .5 ? roseGlass(vP - vec2(0., ${G}.), 1. - .8 * far, .02 + .1 * far) : lancetGlass(vP - vec2(vInfo.y, 0.), vInfo.z, floor(vInfo.y * .37 + 9.));
  vec3 vd = normalize(vView);
  // the sun behind the glass: brighter where the eye lines up with it, and a slow breathing of the light
  float toSun = max(dot(vd, -uSunLW), 0.);
  float hot = 1. + .3 * pow(toSun, 10.);
  float breathe = .9 + .1 * sin(uTime * .23 + vP.x * .12 + vP.y * .07);
  float facing = dot(vd, vWN);              // > 0 when seen from outside (behind the wall)
  float gz = (.6 + .4 * uSunS.z) * uGlassGain;
  float goldK = smoothstep(.3, .55, min(c.r, c.g) / max(max(c.r, c.g), max(c.b, 1e-4)));      // gold panes are the only ones that bloom
  vec3 col = c * (.42 + .3 * dot(c, vec3(.3, .5, .2))) * (1. + 1.6 * goldK) * hot * breathe * gz;
  col += vec3(.0, .08, .5) * c.b * .12 * gz;
  // keep the glass deep after tone mapping; from far away push saturation (not brightness) so the wheel reads from the door
  col = max(mix(vec3(dot(col, vec3(.3, .5, .2))), col, 1.5 + 1.1 * far), 0.);
  col.g += .1 * col.b * (1. - goldK);                       // toward azure: pure blue turns violet under the tone map
  col *= 1. + .5 * far;
  if (facing > 0.) col = c * .05 + vec3(.012, .014, .02);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Bt=`
#include <common>
#include <fog_pars_vertex>
uniform mat4 uRoseInv;
varying vec3 vP; varying vec3 vCam;
void main(){
  vP = position;
  vCam = (uRoseInv * vec4(cameraPosition, 1.)).xyz;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ft=`
#include <common>
#include <fog_pars_fragment>
${Ae}
${mt}
uniform float uTime; uniform vec3 uSunL; uniform vec3 uDais;   // uDais: half width, height, length
uniform float uVolGain, uVolReach, uClipX; uniform vec3 uOccMin, uOccMax;
varying vec3 vP; varying vec3 vCam;
float vHash(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
float vNoise(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(vHash(i), vHash(i + vec3(1,0,0)), f.x), mix(vHash(i + vec3(0,1,0)), vHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(vHash(i + vec3(0,0,1)), vHash(i + vec3(1,0,1)), f.x), mix(vHash(i + vec3(0,1,1)), vHash(i + vec3(1,1,1)), f.x), f.y), f.z); }
void main(){
  vec3 ro = vCam; vec3 rd = vP - vCam; float tmax = length(rd); rd /= tmax;
  if (ro.z < 0.) {                       // camera behind the wall: the wall hides whatever the ray meets beyond it
    if (rd.z <= 1e-4) discard;
    vec3 w = ro + rd * (-ro.z / rd.z);
    if (abs(w.x) < 13.2 && w.y < 40. + (13.2 - abs(w.x))) discard;
  }
  vec3 S = vec3(uSunS.xy, 0.);
  vec3 so = ro - S * ro.z - vec3(0., ${G}., 0.), sd = rd - S * rd.z;
  float a = dot(sd.xy, sd.xy), b = dot(so.xy, sd.xy), c = dot(so.xy, so.xy) - 9.3 * 9.3;
  float h = b * b - a * c; if (h < 0. || a < 1e-6) discard;
  h = sqrt(h); float t0 = (-b - h) / a, t1 = (-b + h) / a;
  if (abs(rd.z) > 1e-4) { float z0 = (.4 - ro.z) / rd.z, z1 = (uSunS.w - ro.z) / rd.z; t0 = max(t0, min(z0, z1)); t1 = min(t1, max(z0, z1)); }
  if (rd.y < -1e-4) t1 = min(t1, (0. - ro.y) / rd.y);
  t0 = max(t0, 0.); t1 = min(t1, tmax);
  {                                      // one solid box of the world (setOccluder) stops the ray: the cone is not depth-tested
    vec3 rs = vec3(rd.x < 0. ? -1. : 1., rd.y < 0. ? -1. : 1., rd.z < 0. ? -1. : 1.) / max(abs(rd), vec3(1e-5));
    vec3 ta = (uOccMin - ro) * rs, tb = (uOccMax - ro) * rs, tmn = min(ta, tb), tmx = max(ta, tb);
    float tn = max(max(tmn.x, tmn.y), tmn.z), tf = min(min(tmx.x, tmx.y), tmx.z);
    if (tf > max(tn, 0.)) t1 = min(t1, max(tn, 0.));
  }
  if (t1 <= t0) discard;
  const int N = 24;
  float dt = (t1 - t0) / float(N);
  float j = fract(sin(dot(gl_FragCoord.xy + fract(uTime * .7) * 61., vec2(12.9898, 78.233))) * 43758.5453);
  j = mix(j, fract(sin(dot(gl_FragCoord.yx + fract(uTime * .7 + .37) * 47., vec2(39.346, 11.135))) * 24634.6345), .5);
  gRoseSoft = dt * .22;
  vec3 acc = vec3(0.);
  for (int i = 0; i < N; i++) {
    vec3 p = ro + rd * (t0 + (float(i) + j) * dt);
    float fl = (abs(p.x) < uDais.x && p.z < uDais.z) ? uDais.y : 0.;
    if (p.y < fl || abs(p.x) > uClipX) continue;
    vec3 l = roseLightAt(p, 0.) * (1. - smoothstep(uVolReach * .5, uVolReach, p.z));
    float n = vNoise(p * .16 + vec3(uTime * .035, -uTime * .02, uTime * .015));
    n = .45 + 1.1 * n * n + .5 * vNoise(p * .55 + vec3(-uTime * .06, uTime * .05, 0.));
    acc += l * n;
  }
  float phase = .55 + 2.6 * pow(max(dot(rd, -uSunL), 0.), 5.);
  vec3 col = acc * dt * .05 * phase * uVolGain;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      col *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth * .5);
    #else
      col *= 1. - .7 * smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  gl_FragColor = vec4(col, 1.);
}`;async function Et(i,l={}){const c=i.rng.fork?i.rng.fork("glass-nave-hero"):i.rng,x=i.noise,z=(l.palette&&l.palette.length>=7?l.palette:_t).map(e=>new t.Color(e)),[p,u,g,b,R,H,ae]=z,q=l.dais!==!1,P=l.apron!==!1,y=q?l.daisHeight??2:0,A=l.daisLength??49.5,L=l.naveWidth??19.5,j=l.intensity??1,Q=c.pick([6,8,12]),te=c.pick([0,Math.PI/12]),O=c.pick([5,5,7]),pt=t.MathUtils.degToRad(l.sunElevation??30),le=t.MathUtils.degToRad(l.roseElevation??l.sunElevation??30),de=t.MathUtils.degToRad(l.sunAzimuth??9+c.range(-3,3)),Ne=c.range(-.025,.025),gt=R.clone().offsetHSL(Ne,0,0),xt=H.clone().offsetHSL(Ne*.6,0,0),yt=ae.clone(),C=new t.Vector3(-Math.sin(de)*Math.cos(le),-Math.sin(le),Math.cos(de)*Math.cos(le)).normalize(),Y=l.coneLength??68,h={uBlue:{value:gt},uRuby:{value:xt},uGold:{value:yt},uVar:{value:new t.Vector4(Q,te,c.range(0,50),c.int(0,1))},uSunS:{value:new t.Vector4(C.x/C.z,C.y/C.z,j,Y)},uSunL:{value:C.clone()},uSunLW:{value:C.clone()},uRoseInv:{value:new t.Matrix4},uTime:{value:0},uRoseT:{value:0},uFloorTint:{value:b.clone().lerp(R,.12)},uDais:{value:new t.Vector3(L/2,y,q?A:0)},uLan:{value:new t.Vector4(5,3.9,1.25,8.2)},uLanSpring:{value:15.2},uVolGain:{value:1},uVolReach:{value:Y},uGlassGain:{value:1},uAisle:{value:new t.Vector4(1e6,16.5,0,0)},uAisleC:{value:new t.Color("#ffb878")},uLanS:{value:new t.Vector2(-Math.tan(de),-Math.tan(pt)/Math.cos(de))},uRoseK:{value:new t.Vector2(1,0)},uClipX:{value:l.clipX??1e6},uOccMin:{value:new t.Vector3(1e5,1e5,1e5)},uOccMax:{value:new t.Vector3(100001,100001,100001)},uCamL:{value:new t.Vector3(0,0,1e4)},uLens:{value:0}},T=new t.Group;T.name="glass-nave-hero";const ne=[],d=[],r=(e,a,o,n=.1)=>e.push({g:a,col:o,amp:n}),ce=u.clone().lerp(g,.25),w=p.clone().lerp(u,.35),se=13,me=40,he=53,W=1.6,Ge=new t.Shape([[-se,0],[se,0],[se,me],[0,he],[-se,me]].map(e=>new t.Vector2(e[0],e[1]))),oe=dt+.45;Ge.holes.push(new t.Path(E(0,G,oe,96).reverse().map(e=>new t.Vector2(e[0],e[1]))));const ke=O===5?3.9:2.95,Z=O===5?1.25:.95,Se=8.2,He=15.2,Ve=[];h.uLan.value.set(O,ke,Z,Se),h.uLanSpring.value=He;for(let e=0;e<O;e++){const a=(e-(O-1)/2)*ke,o=1-Math.abs(e-(O-1)/2)/((O-1)/2),n=He+o*1.1,s=De(a,Z,Se,n);Ve.push({cx:a,spring:n,pts:s,top:n+Math.sqrt(4*Z*Z-Z*Z)}),Ge.holes.push(new t.Path(s.slice().reverse().map(v=>new t.Vector2(v[0],v[1]))))}const We=new t.ExtrudeGeometry(Ge,{depth:W,bevelEnabled:!1,curveSegments:4});We.translate(0,0,-W),r(ne,We,ce,.2),await i.yield?.();const D=[],$=-1.15,X=-.22,_e=(e,a)=>[e[0]*Math.cos(a)-e[1]*Math.sin(a),e[0]*Math.sin(a)+e[1]*Math.cos(a)];D.push(M(E(0,0,5.15,96),!0,.24,$,X+.1,.09)),D.push(M(E(0,0,9.24,128),!0,.26,$,X+.1,.1));const wt=Math.atan2(.729,2.325);for(let e=0;e<12;e++){await i.yield?.();const a=e*Math.PI/6,o=a+Math.PI/12,n=[Math.cos(o),Math.sin(o)];D.push(M([[n[0]*5.3,n[1]*5.3],[n[0]*6.6,n[1]*6.6]],!1,.14,$,X,.07)),D.push(S(.34,.5,1,n[0]*6.62,n[1]*6.62,($+X)/2+.03,o)),D.push(S(.2,.42,.98,n[0]*5.5,n[1]*5.5,($+X)/2+.02,o));for(const s of[1,-1]){const v=ht(6.375,-.729,2.437,wt,Math.PI/2,12).map(f=>_e([f[0],f[1]*s],a));D.push(M(v,!1,.125,$,X,.06))}D.push(M(E(7.3,0,.72,20).map(s=>_e(s,a)),!0,.075,$+.2,X-.08,.035)),D.push(M(E(8.2*Math.cos(Math.PI/12),8.2*Math.sin(Math.PI/12),.6,18).map(s=>_e(s,a)),!0,.085,$+.1,X-.04,.04))}D.push(M(E(0,0,1.3,40),!0,.1,$+.2,X-.05,.05)),D.push(M(E(0,0,4.2,72),!0,.11,$+.2,X-.05,.05));for(let e=0;e<Q;e++){const a=(e+.5)*Math.PI*2/Q,o=[Math.cos(a),Math.sin(a)];D.push(M([[o[0]*1.35,o[1]*1.35],[o[0]*4.15,o[1]*4.15]],!1,.075,$+.2,X-.08,.035))}for(const e of D)e.rotateZ(-te),e.translate(0,G,0),r(d,e,w,.1);for(const[e,a,o]of[[oe+.22,.3,.38],[oe+.78,.13,.2],[oe-.02,.1,.12]]){const n=M(E(0,G,e,128),!0,a,-.3,o,a*.4);r(d,n,w,.1)}for(const e of Ve)r(d,M(e.pts,!0,.13,-.5,.2,.06),w,.1),r(d,S(Z*2+.7,.3,.6,e.cx,Se-.2,.1),w,.1);for(const e of[6.6,19.6,me])r(d,S(se*2,.34,.5,0,e,.12),w,.1);await i.yield?.();const J=(e,a,o,n,s,v,f)=>{const m=new t.CylinderGeometry(e,a,o,n,1);return m.translate(s,v,f),m};{const n=Math.acos(.17424242424242417),s=f=>{const m=[];for(let B=0;B<=22;B++){const F=n*B/22;m.push([10.9-13.2+Math.cos(F)*(13.2+f),36+Math.sin(F)*(13.2+f)])}for(let B=21;B>=0;B--){const F=n*B/22;m.push([-(10.9-13.2)-Math.cos(F)*(13.2+f),36+Math.sin(F)*(13.2+f)])}return m};r(d,M(s(0),!1,.38,0,.78,.14),w,.1),r(d,M(s(-.62),!1,.2,0,.44,.08),w,.1),r(d,M(s(.62),!1,.15,0,.3,.06),w,.1);for(const f of[-1,1]){const m=f*11.15;r(ne,S(2,36,1.1,m,36/2,.55),ce,.2);for(const[_,re,N]of[[-.78,1.12,.22],[0,1.36,.3],[.78,1.12,.22]]){r(d,J(N,N,36-1.6,10,m+_,(36-1.6)/2+.8,re),w,.1),r(d,J(N*1.15,N*1.75,.9,10,m+_,.45,re),w,.1),r(d,J(N*1.9,N*1.05,.95,10,m+_,36-.62,re),w,.1);for(const ye of[12.4,19.6,27.5])r(d,J(N*1.35,N*1.35,.22,10,m+_,ye,re),w,.1)}r(d,S(2.5,.3,2,m,36-.02,.9),w,.1);const K=f*7.4,B=41.3;r(d,M(E(K,B,1.28,36),!0,.17,0,.3,.07),w,.1);for(let _=0;_<4;_++)r(d,M(E(K+Math.cos(_*Math.PI/2+Math.PI/4)*.52,B+Math.sin(_*Math.PI/2+Math.PI/4)*.52,.46,16),!0,.07,0,.17,.03),w,.1);const F=f*11.9;r(ne,S(2.5,25,3.4,F,12.5,-W-1.7),ce,.2),r(ne,S(2.3,9,2.4,F,29.5,-W-1.2),ce,.2),r(ne,S(2,6.5,1.5,F,37.2,-W-.75),ce,.2),r(ne,S(1.7,3.6,1.7,F,41.8,-W/2),ce,.2);const ue=new t.ConeGeometry(1.25,7.5,4,1);ue.rotateY(Math.PI/4),ue.translate(F,47.3,-W/2),r(d,ue,w,.12),r(d,S(2,.3,2,F,43.6,-W/2),w,.1)}r(d,M(E(0,45.6,1.5,36),!0,.16,-.1,.26,.07),w,.1);for(let f=0;f<3;f++)r(d,M(E(Math.cos(f*2.094+1.571)*.6,45.6+Math.sin(f*2.094+1.571)*.6,.55,18),!0,.07,0,.16,.03),w,.1);r(d,M([[-se-.2,me-.2],[0,he+.25],[se+.2,me-.2]],!1,.32,-W-.2,.22,.1),w,.1),r(d,S(.34,3.4,.34,0,he+1.7,-W/2),w,.1),r(d,S(1.7,.34,.34,0,he+2.3,-W/2),w,.1);const v=y+.4;for(let f=-5;f<=5;f++){const m=f*1.9;Math.abs(m)<4.2||r(d,M(De(m,.72,v,v+2.7,6),!0,.09,0,.17,.04),w,.1)}}await i.yield?.();const Te=[],$e=(e,a,o,n,s,v)=>{const f=new t.BufferGeometry;return f.setAttribute("position",new t.Float32BufferAttribute([e,a,s,o,a,s,o,n,s,e,a,s,o,n,s,e,n,s],3)),f.setAttribute("aInfo",new t.Float32BufferAttribute(new Array(6).fill(v).flat(),3)),f};Te.push($e(-oe,G-oe,oe,G+oe,-.72,[0,0,0]));for(const e of Ve)Te.push($e(e.cx-Z,Se,e.cx+Z,e.top+.1,-.8,[1,e.cx,Z]));const Xe=new t.ShaderMaterial({uniforms:t.UniformsUtils.merge([t.UniformsLib.fog]),vertexShader:Tt,fragmentShader:It,fog:!0,side:t.DoubleSide});Object.assign(Xe.uniforms,h);const Ke=new t.Mesh(Vt(Te),Xe);Ke.name="rose-glass",T.add(Ke);const pe=[];if(q){{const a=new t.BoxGeometry(L,y,A,4,1,10);a.translate(0,y/2,A/2),r(pe,a,l.daisColor?new t.Color(l.daisColor):p,.05)}const e=Math.max(2,Math.round(y/.4));for(let a=0;a<e;a++){const o=y-y/e*(a+1);o>.01&&r(pe,S(L,o,.7,0,o/2,A+.35+a*.7),p,.05)}}if(P){const e=q?A:0,a=Y+12,o=new t.PlaneGeometry(L+14,a-e);o.rotateX(-Math.PI/2),o.translate(0,.03,(e+a)/2),r(pe,o,p,.05)}const V=[],Ie=[],ee=y+.75,be=ee+1.34,I=ae.clone().multiplyScalar(.62),St=new t.Color(.7,.62,.46),Ye=new t.Color(.72,.7,.66),Be=(e,a,o,n,s=.05)=>{r(d,J(s*.85,s,n,6,e,a+n/2,o),St,.04),Ie.push([e,a+n+.11,o,.2+s*1.6])};{for(let o=0;o<3;o++){const n=6.2-o*.95;r(d,S(9.4-o*1.3,.25,n,0,y+.125+o*.25,n/2),w,.08)}r(d,S(4.5,1.14,1.5,0,ee+.57,2.6),u,.1),r(d,S(4.9,.16,1.86,0,ee+1.22,2.6),w,.06),r(d,S(5,.05,1.94,0,ee+1.32,2.6),Ye,.03),r(d,S(5,.5,.04,0,ee+1.08,3.58),Ye,.03),r(V,S(3.9,.74,.05,0,ee+.5,3.37),I,.1);for(let o=-2;o<=2;o++)r(V,M(E(o*.76,ee+.5,.26,14),!0,.035,3.36,3.44,.015),I,.1);for(const o of[-1,0,1]){const n=o===0?2.5:2,s=o===0?5.6:4.3,v=o*2.32,f=ee+.2;r(d,S(n,s,.5,v,f+s/2,.45),g.clone().lerp(b,.3),.1),r(d,S(n-.5,s-2,.06,v,f+.4+(s-2)/2,.71),(o===0?H:R).clone().multiplyScalar(.45),.25),r(V,M(De(v,n/2-.2,f+.35,f+s-1.75,7),!0,.085,.7,.84,.035),I,.1),r(V,M(E(v,f+s*.52,n*.2,16),!0,.05,.72,.8,.02),I,.1);const m=new t.ConeGeometry(n*.36,2.3,4,1);m.rotateY(Math.PI/4),m.scale(1,1,.35),m.translate(v,f+s+1.1,.45),r(V,m,I,.1),r(V,S(n+.16,.14,.62,v,f+s,.45),I,.1)}r(V,S(7.4,.2,.7,0,ee+.2,.45),I,.1),await i.yield?.();for(const o of[-2.5,-1.5,-.5,.5,1.5,2.5]){const n=o*.82,s=.75+(2.5-Math.abs(o))*.13;r(V,J(.045,.13,.4,6,n,be+.2,2.15),I,.1),Be(n,be+.4,2.15,s,.045)}for(const o of[-1,1]){const n=o*5.6,s=3.6,v=y;r(V,J(.07,.1,2.2,6,n,v+1.1,s),I,.1),r(V,J(.12,.42,.3,8,n,v+.15,s),I,.1);const f=[];for(let m=0;m<=12;m++){const K=Math.PI*(m/12);f.push([n-Math.cos(K)*1.1,v+2.2-Math.sin(K)*.55])}r(V,M(f,!1,.035,s-.035,s+.035,.012),I,.1);for(let m=-3;m<=3;m++){const K=n+m*.366,B=v+2.2-Math.sqrt(Math.max(0,1-(m/3)**2))*.55*(m===0?0:1)*0;Be(K,B,s,.42+c.range(-.08,.08),.035)}}if(q)for(const o of[-1,1])for(let n=8;n<A-2;n+=5.5){await i.yield?.();const s=o*(L/2-1);r(V,J(.04,.06,1.5,5,s,y+.75,n),I,.1),r(V,J(.07,.3,.2,6,s,y+.1,n),I,.1),r(V,S(.05,.05,.9,s,y+1.5,n),I,.1);for(const v of[-.42,0,.42])Be(s,y+1.52,n+v,.3+c.range(0,.25),.035)}const e=new t.Color(.1,.2,.07),a=new t.Color(.8,.78,.7);for(const o of[-1,1]){const n=o*3.55,s=4.7,v=y+.5,f=[[.02,0],[.3,.02],[.36,.3],[.2,.75],[.16,.95],[.26,1.1]].map(_=>new t.Vector2(_[0],_[1])),m=new t.LatheGeometry(f,10);m.translate(n,v,s),r(V,m,I,.1);const K=[],B=[];for(let _=0;_<11;_++){const re=c.range(0,Math.PI*2),N=c.range(.1,.55),ye=c.range(1,2),k=new t.Vector3(n+Math.cos(re)*N*ye,v+1.1+ye*Math.cos(N),s+Math.sin(re)*N*ye),U=new t.Vector3(n,v+1,s);B.push(U.x-.02,U.y,U.z,U.x+.02,U.y,U.z,k.x,k.y,k.z,U.x,U.y,U.z-.02,U.x,U.y,U.z+.02,k.x,k.y,k.z);const we=k.clone().sub(U).normalize(),ft=new t.Vector3(1,0,0).cross(we).normalize(),At=we.clone().cross(ft);for(let je=0;je<6;je++){const vt=je*Math.PI/3+_,Oe=ft.clone().multiplyScalar(Math.cos(vt)).addScaledVector(At,Math.sin(vt)),Ct=we.clone().cross(Oe).multiplyScalar(.085),ie=k.clone().addScaledVector(we,.22).addScaledVector(Oe,.1),Ue=k.clone().addScaledVector(we,.34).addScaledVector(Oe,.3);for(const Gt of[1,-1]){const fe=ie.clone().addScaledVector(Ct,Gt);K.push(k.x,k.y,k.z,fe.x,fe.y,fe.z,ie.x,ie.y,ie.z,ie.x,ie.y,ie.z,fe.x,fe.y,fe.z,Ue.x,Ue.y,Ue.z)}}}const F=new t.BufferGeometry;F.setAttribute("position",new t.Float32BufferAttribute(K,3)),r(d,F,a,.05);const ue=new t.BufferGeometry;ue.setAttribute("position",new t.Float32BufferAttribute(B,3)),r(d,ue,e,.1)}}const Fe=(e,a)=>l.materials&&l.materials[e]||a(),bt=ve(Fe("gilt",()=>new t.MeshStandardMaterial({vertexColors:!0,roughness:.38,metalness:.35,side:t.DoubleSide,emissive:ae.clone().multiplyScalar(.05)})),h,0),Ze=new t.Mesh(await Ce(i,V,x),bt);Ze.name="gilt",T.add(Ze);let ge=null;l.light!==!1&&(ge=new t.PointLight(new t.Color("#ffb060"),260,34,2),ge.position.set(0,be+2.2,5.2),T.add(ge)),await i.yield?.();const Je=(e,a)=>{const o=new t.InstancedBufferGeometry;o.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,-1,0,1,1,0,-1,1,0],3));const n=new Float32Array(e*4),s=new Float32Array(e);for(let v=0;v<e;v++)a(v,n,s);return o.setAttribute("aPos",new t.InstancedBufferAttribute(n,4)),o.setAttribute("aSeed",new t.InstancedBufferAttribute(s,1)),o.instanceCount=e,o},Qe=new t.ShaderMaterial({uniforms:t.UniformsUtils.merge([t.UniformsLib.fog]),fog:!0,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 aPos; attribute float aSeed; uniform float uTime; varying vec2 vUv; varying float vF;
      void main(){
        vUv = position.xy;
        float fl = sin(uTime * 9. + aSeed * 40.) * .5 + sin(uTime * 14.3 + aSeed * 71.) * .3;
        vF = .85 + .15 * fl;
        vec4 mvPosition = modelViewMatrix * vec4(aPos.xyz, 1.);
        vec2 o = position.xy * aPos.w * vec2(1.6, 2.2) + vec2(0., aPos.w * 1.1);
        o.x += (position.y + 1.) * aPos.w * .16 * sin(uTime * 5. + aSeed * 30.);
        mvPosition.xy += o;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      varying vec2 vUv; varying float vF;
      void main(){
        vec2 p = vUv; p.y = p.y * 1.0 + .45;
        float tear = length(vec2(p.x * (2.6 + 2.2 * smoothstep(-.6, .8, p.y)), p.y * 1.25));
        float core = smoothstep(.62, .2, tear);
        float halo = exp(-dot(vUv, vUv) * 4.5) * .22;
        vec3 col = (vec3(1., .62, .2) * 5.5 * core + vec3(1., .9, .6) * 3. * smoothstep(.3, .0, tear) + vec3(1., .5, .16) * halo) * vF;
        gl_FragColor = vec4(col, 1.);
        #ifdef USE_FOG
          gl_FragColor.rgb *= 1. - .6 * smoothstep(0., 1., 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth));
        #endif
      }`});Object.assign(Qe.uniforms,{uTime:h.uTime});const Me=new t.Mesh(Je(Ie.length,(e,a,o)=>{a.set(Ie[e],e*4),o[e]=c()}),Qe);Me.name="candle-flames",Me.frustumCulled=!1,Me.renderOrder=7,T.add(Me);const Mt=900,et=new t.ShaderMaterial({uniforms:t.UniformsUtils.merge([t.UniformsLib.fog]),fog:!0,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      ${Ae}
      attribute vec4 aPos; attribute float aSeed; uniform float uTime; uniform vec4 uSunS; uniform vec3 uDais;
      varying vec2 vUv; varying vec3 vCol;
      void main(){
        vUv = position.xy;
        float t = uTime * (.25 + aSeed * .5);
        float z = mod(aPos.z + t * .35, uSunS.w * .9) + .6;
        vec2 q = aPos.xy + vec2(sin(t * .31 + aSeed * 50.), cos(t * .27 + aSeed * 31.)) * .9;
        vec3 p = vec3(q + uSunS.xy * z + vec2(0., ${G}.), z);
        p.y += sin(t * .5 + aSeed * 90.) * .5;
        vec2 qq = p.xy - uSunS.xy * p.z - vec2(0., ${G}.);
        float fl = (abs(p.x) < uDais.x && p.z < uDais.z) ? uDais.y : 0.;
        float tw = .35 + .65 * pow(.5 + .5 * sin(uTime * (1.5 + aSeed * 3.) + aSeed * 200.), 3.);
        vCol = roseGlass(qq, 0., .3) * tw * uSunS.z * (1. - smoothstep(uSunS.w * .6, uSunS.w * .9, z)) * step(fl + .1, p.y);
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        mvPosition.xy += position.xy * aPos.w;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      varying vec2 vUv; varying vec3 vCol;
      void main(){
        float d = dot(vUv, vUv); if (d > 1.) discard;
        gl_FragColor = vec4((vCol * 2.2 + dot(vCol, vec3(.5))) * exp(-d * 3.5) * 1.6, 1.);
      }`});Object.assign(et.uniforms,h);const ze=new t.Mesh(Je(Mt,(e,a,o)=>{const n=Math.sqrt(c())*8.8,s=c()*Math.PI*2;a[e*4]=Math.cos(s)*n,a[e*4+1]=Math.sin(s)*n,a[e*4+2]=c()*Y,a[e*4+3]=.035+c()*c()*.09,o[e]=c()}),et);ze.name="cone-dust",ze.frustumCulled=!1,ze.renderOrder=7,T.add(ze);const zt=ve(Fe("stone",()=>new t.MeshStandardMaterial({vertexColors:!0,roughness:.92,metalness:0,side:t.DoubleSide})),h,1),Rt=ve(Fe("carved",()=>new t.MeshStandardMaterial({vertexColors:!0,roughness:.8,metalness:0,side:t.DoubleSide})),h,0),Pt=l.materials&&l.materials.floor?ve(l.materials.floor,h,0):ve(new t.MeshStandardMaterial({vertexColors:!0,roughness:.35,metalness:0}),h,2),tt=new t.Mesh(await Ce(i,ne,x),zt);tt.name="east-wall",T.add(tt);const ot=new t.Mesh(await Ce(i,d,x),Rt);if(ot.name="tracery",T.add(ot),pe.length){const e=new t.Mesh(await Ce(i,pe,x),Pt);e.name="choir-floor",T.add(e)}await i.yield?.();const at=h.uSunS.value.x*Y,qe=new t.BoxGeometry(1,1,1),nt=Math.min(-10,at-10),st=Math.max(10,at+10);qe.scale(st-nt,41,Y),qe.translate((nt+st)/2,20.5,Y/2+.3);const rt=new t.ShaderMaterial({uniforms:t.UniformsUtils.merge([t.UniformsLib.fog]),vertexShader:Bt,fragmentShader:Ft,fog:!0,side:t.BackSide,transparent:!0,depthWrite:!1,depthTest:!1,blending:t.AdditiveBlending});Object.assign(rt.uniforms,h);const Re=new t.Mesh(qe,rt);Re.name="rose-cone",Re.frustumCulled=!1,Re.renderOrder=6,T.add(Re);const it=new t.BufferGeometry;it.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,-1,0,1,1,0,-1,1,0],3));const lt=new t.ShaderMaterial({uniforms:{},transparent:!0,depthWrite:!1,depthTest:!1,blending:t.AdditiveBlending,fog:!1,vertexShader:`
      varying vec2 vS;
      void main(){ vS = position.xy; gl_Position = vec4(position.xy, 0., 1.); }`,fragmentShader:`
      uniform vec3 uBlue, uRuby, uGold; uniform vec4 uVar;
      uniform vec4 uSunS; uniform vec3 uCamL; uniform float uLens, uTime;
      varying vec2 vS;
      void main(){
        // where the camera stands in the pattern, plus a few metres of it spread across the lens, so it slides as the camera moves
        vec2 q = uCamL.xy - uSunS.xy * uCamL.z - vec2(0., ${G}.);
        q += vS * vec2(3.6, 2.2) + .5 * vec2(sin(uTime * .37 + vS.y * 2.), cos(uTime * .31 + vS.x * 1.6));
        q += vec2(1.3e-4, .7e-4);
        // a smooth reading of the rose (petals blue and ruby by turns, the gold ring, the eye): the leaded pattern itself
        // would cross the lens as hard-edged patches
        float r = length(q), a = atan(q.y, q.x) + uVar.y;
        vec3 c = mix(uBlue, uRuby, smoothstep(.25, .75, .5 + .5 * sin(a * 12.)));
        c = mix(mix(uRuby, uBlue, smoothstep(.3, .7, .5 + .5 * sin(a * uVar.x + r * .8))), c, smoothstep(3.6, 5.6, r));
        float g = r - 5.; c = mix(c, uGold, .85 * exp(-g * g * .45));
        c = mix(c, uGold, .5 * exp(-r * r * .25));
        c *= 1. - smoothstep(7.5, 11., r);
        float rim = .1 + .9 * smoothstep(.3, 1.15, length(vS * vec2(1., .82)));       // keep the middle of the frame clear
        float zf = smoothstep(4., 16., uCamL.z) * (1. - smoothstep(uSunS.w * .7, uSunS.w, uCamL.z));
        gl_FragColor = vec4(c * (.22 * uLens * rim * zf * uSunS.z), 1.);
      }`});Object.assign(lt.uniforms,h);const Pe=new t.Mesh(it,lt);Pe.name="rose-lens",Pe.frustumCulled=!1,Pe.renderOrder=9,T.add(Pe);const ct=e=>{const a=(G-e)/-C.y;return new t.Vector3(C.x*a,e,C.z*a)},Lt={portalSeat:{position:new t.Vector3(0,G,.9),normal:new t.Vector3(0,0,1),radius:5},roseCenter:new t.Vector3(0,G,0),roseRadius:dt,eyeRadius:5,flyThrough:[[0,6,125],[0,13,100],[0,23,78],[0,30,60],[0,30,30],[0,30,.9]].map(e=>new t.Vector3(...e)),coneAxis:{origin:new t.Vector3(0,G,0),dir:C.clone(),length:Y/C.z},coneEntry:ct(20),discCenter:ct(y),altar:new t.Vector3(0,be,2.6),viewpoints:[new t.Vector3(0,6,120),new t.Vector3(6,12,62),new t.Vector3(-3,22,26),new t.Vector3(0,30,40)]};let Ee=-1;const Le=new t.Matrix4,xe=new t.Vector3,ut={object:T,radius:26,height:he,center:new t.Vector3(0,23,6),anchors:Lt,ground:!0,groundY:0,uniforms:h,setProgress(e){Ee=e},setConeGain(e){h.uVolGain.value=e},setConeReach(e){h.uVolReach.value=Math.min(Y,Math.max(8,e))},setGlassGain(e){h.uGlassGain.value=e},setAisleGlow(e={}){h.uAisle.value.set(e.x??1e6,e.bay??16.5,e.z??0,e.strength??0),e.color&&h.uAisleC.value.set(e.color)},setSurfaceLight(e,a=0){h.uRoseK.value.set(e,a)},setLens(e){h.uLens.value=e},setOccluder(e,a){h.uOccMin.value.set(e[0],e[1],e[2]),h.uOccMax.value.set(a[0],a[1],a[2])},coneOffset(e){return xe.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Le),Math.hypot(xe.x-h.uSunS.value.x*xe.z,xe.y-h.uSunS.value.y*xe.z-G)},applyRoseLight(e){return ve(e,h,0)},update(e,a,o){h.uTime.value=a,h.uRoseT.value=a,T.updateWorldMatrix(!0,!1),Le.copy(T.matrixWorld).invert(),h.uRoseInv.value.copy(Le);const n=Ee<0?.7:Ee,s=.62+.38*t.MathUtils.smoothstep(n,.3,.62),v=de+(n-.6)*.07;C.set(-Math.sin(v)*Math.cos(le),-Math.sin(le),Math.cos(v)*Math.cos(le)).normalize(),h.uSunL.value.copy(C),h.uSunLW.value.copy(C).transformDirection(T.matrixWorld),ge&&(ge.intensity=260*(.9+.06*Math.sin(a*7.3)+.04*Math.sin(a*12.1))),h.uSunS.value.set(C.x/C.z,C.y/C.z,j*s*(.96+.04*Math.sin(a*.31)),Y),o&&h.uCamL.value.setFromMatrixPosition(o.matrixWorld).applyMatrix4(Le)},dispose(){}};return ut.update(0,0),ut}export{Et as buildHero};
