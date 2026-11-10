import{NOISE as R,PLACE as L,TOWER_GLSL as A,FOG_VERT_PARS as F,FOG_VERT as _,FOG_FRAG_PARS as G}from"./bridges-of-marigold-air-glsl.js";import{fogUniforms as W}from"../kit/fx.js";import{WATER as r,MIST as B,GREAT_BRIDGE as E,HIGH_BRIDGE as M}from"./bridges-of-marigold-plan.js";const w=34,z=`
${F}
attribute float aL; varying vec3 vW; varying float vL;
void main(){ vL = aL; vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
${_} }`,O=`
float mgDistrict(vec2 p){ return smoothstep(0.5, 0.66, 0.65*vnoise(p*0.006 + 7.3) + 0.35*vnoise(p*0.017 + 2.1)); }
vec3 mgLow(vec2 p, vec3 warm, vec3 rose, vec3 teal){
  float d = mgDistrict(p);
  vec2 q = p/46. + 3.4*vec2(vnoise(p*0.0045 + 2.), vnoise(p*0.0045 + 13.)), f = fract(q) - 0.5, c = floor(q), g = abs(f);
  float h2 = hash12(c*1.7 + 9.), fwq = max(fwidth(q.x), fwidth(q.y));
  vec2 eid = g.x > g.y ? vec2(c.x + step(0., f.x), c.y*1.37 + 0.31) : vec2(c.x*1.61 + 0.77, c.y + step(0., f.y));      // (which street of the block)
  float al = g.x > g.y ? f.y : f.x, lampK = 1. - smoothstep(0.1, 0.34, abs(fract(al*7. + 0.5) - 0.5));
  float street = (1. - smoothstep(0.02, 0.06, 0.5 - max(g.x, g.y)))*(0.22 + 0.9*lampK)*step(0.36, hash12(eid));
  vec2 sq = q*5., sf = fract(sq) - 0.5; float hs = hash12(floor(sq) + 3.), inner = 1. - smoothstep(0.34, 0.42, max(g.x, g.y));
  float roof = step(0.66, hs)*(1. - smoothstep(0.1, 0.36, max(abs(sf.x), abs(sf.y))))*inner;
  vec2 o = f - (hash22(c + 1.) - 0.5)*0.3; float ro = length(o), dome = step(0.9, h2)*(1. - smoothstep(0.1, 0.13, ro));
  vec3 hue = hs < 0.9 ? warm : (hs < 0.95 ? rose : teal);
  vec3 sharp = warm*street*1.3 + hue*roof*(1. - dome)*(0.5 + 1.2*fract(hs*17.)) + (teal*0.8 + warm*1.3*smoothstep(0.085, 0.11, ro))*dome;
  return d*mix(sharp, warm*0.2, smoothstep(0.12, 0.5, fwq));
}`,P=`
${R}${O}${L}${A}${G}
uniform float uTime, uLit; uniform vec3 uSkyLo, uSkyHi, uGold, uWarm, uRose, uTeal, uLime; varying vec3 vW;
vec3 lampHue(float h){ return h<0.6 ? uWarm : (h<0.72 ? uRose : (h<0.84 ? uTeal : (h<0.93 ? uLime : uGold))); }
void main(){
  vec3 toP = vW - cameraPosition; float dist = max(length(toP), 1e-3); vec3 V = toP/dist;
  vec2 p = vW.xz;
  vec3 n1 = vnoised(p*0.42 + vec2(uTime*0.10, uTime*0.06)), n2 = vnoised(p*1.5 - vec2(uTime*0.17, -uTime*0.12));
  vec2 slope = (n1.yz*0.6 + n2.yz*0.32)*0.075/(1. + dist*0.0016);
  vec3 N = normalize(vec3(-slope.x, 1., -slope.y));
  vec3 R = reflect(V, N); R.y = abs(R.y) + 0.004;
  float fres = 1. - clamp(dot(-V, N), 0., 1.); fres *= fres; fres *= fres;
  vec3 col = vec3(0.004, 0.0035, 0.013) + mix(uSkyLo, uSkyHi, sqrt(clamp(R.y, 0., 1.)))*(0.05 + 0.95*fres);
  // the towers: the nearest stack the mirrored ray meets, as cells of lit windows
  float tBest = 1e9; vec3 lights = vec3(0.);
  vec2 d = R.xz; float a = max(dot(d, d), 1e-5);
  for(int k = 0; k < MG_TOWERS; k++){
    vec4 T = mgTower(k), S = mgStack(k); float r = 0.5*(S.x + S.y);
    vec2 o = p - T.xy; float b = dot(o, d), c = dot(o, o) - r*r, disc = b*b - a*c;
    if(disc > 0. && c > 0.){
      float t = (-b - sqrt(max(disc, 0.)))/a, y = t*R.y;
      if(t > 0. && t < tBest && y > S.z && y < S.w){
        vec2 hit = o + d*t; float ang = atan(hit.y, hit.x);
        vec2 cell = floor(vec2(ang*r/3.6, y/3.4)); float h = hash12(cell + float(k)*17.3), h2 = hash12(cell.yx + float(k)*5.1 + 3.7);
        tBest = t; lights = lampHue(h2)*step(1. - uLit, h)*(0.55 + 0.9*h2);
      }
    }
  }
  // the petal bridges: each one's glowing underside where the mirrored ray climbs to it
  for(int k = 0; k < 3; k++){
    float h = 45.; vec3 g = vec3(0.);
    for(int i = 0; i < 3; i++){ g = mgBridge(k, p + d*(h/R.y)); h = max(g.y - 1.6, 4.); }
    float t = h/R.y; g = mgBridge(k, p + d*t);
    float band = 1. - smoothstep(g.z - 3.0, g.z + 1.2, g.x);
    if(t < tBest) lights = mix(lights, uGold*(1.5 - 0.6*g.x/g.z), band);
  }
  col += lights*(0.34 + 0.66*fres);
  col += mgLow(p, uWarm, uRose, uTeal)*1.7;             // the low city's own lights, under the mist
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`,$=`
${R}${O}${L}${A}${G}
uniform float uTime, uSea, uTop, uWater; uniform vec3 uMist, uGold, uAmber, uRose, uTeal; uniform vec4 uEnds; varying vec3 vW; varying float vL;
void main(){
  vec2 p = vW.xz; float y = vW.y - uWater, dist = length(vW - cameraPosition), R = length(p);
  vec2 flow = vec2(-0.7, -3.4)*uTime;                       // (the mist goes with the wind, toward the south)
  float n = fbm((p + flow)*0.0066), n2 = vnoise((p + flow*0.6)*0.031 + 9.1), n3 = vnoise((p + flow*1.4)*0.085 + vL*5.3);
  // what stands over this place: the towers (their feet draw the banks up; their windows warm the mist at their
  // feet) and the bridges (their gold)
  float rise = 5.*(1. - smoothstep(120., 210., R)), near = 0., wsum = 1e-4, stone = 1e4; vec3 hsum = vec3(0.);
  for(int k = 0; k < MG_TOWERS; k++){
    vec4 T = mgTower(k); float dd = max(length(p - T.xy) - T.z, 0.), w = exp(-dd/20.);
    rise = max(rise, (min(T.w + 7., uTop - 1.) - uSea)*exp(-dd/34.));
    // (the great tower's foot is lit amber; the ring towers' rose and teal by turns)
    vec3 hue = k == 0 ? uAmber : (fract(float(k)*0.5) > 0.25 ? uRose : uTeal);
    near = max(near, w); hsum += hue*w*w; wsum += w*w; stone = min(stone, dd);
  }
  // (within 9 m of a stone foot the mist thins to wisps and its glow falls, so that it meets the stone softly)
  float off = smoothstep(0., 9., stone);
  vec3 lit = hsum/wsum*(0.5*near*near + 0.06*sqrt(near))*(0.5 + 0.5*off);
  vec3 gold = vec3(0.);
  for(int k = 0; k < 3; k++){ vec3 g = mgBridge(k, p); float h = max(g.y - 3.0 - y, 6.); gold += uGold*min(g.z*2.*h/(h*h + g.x*g.x), 2.2); }
  vec2 e0 = p - uEnds.xy, e1 = p - uEnds.zw;
  rise = max(rise, 11.*min(exp(-dot(e0, e0)/5200.) + exp(-dot(e1, e1)/5200.), 1.));
  // the mist's own top at this place: the sea (with a few dark lakes of open water) and the banks over it
  float lake = 1. - smoothstep(0.26, 0.38, n + 0.3*rise);
  float top = (uSea*(0.25 + 1.3*n) + rise*(0.4 + 0.75*n2 + 0.3*n3) + 5.*(n3 - 0.5))*(1. - lake);
  float cov = smoothstep(-2.4, 3.2, top - y);
  // its light: the mounds lighter than the hollows, whatever sheet shows them
  // (the finest wisps are drawn only where a pixel is smaller than they are)
  float n4 = mix(0.5, vnoise((p + flow*1.9)*0.23 + vL*7.1), 1. - smoothstep(90., 320., dist));
  float yN = clamp(y/uTop, 0., 1.), mound = max(0.12, 0.26 + 0.95*n2*n2 + 0.75*(n3 - 0.5) + 0.34*(n4 - 0.5));
  // (over a district of the low city the mist is thinner and warmed from below)
  float low = mgDistrict(p);
  vec3 L = (uMist*2.1 + lit + gold*0.5 + uAmber*low*0.6)*mound*(0.7 + 0.6*yN);
  float aOut = cov*0.4*(1. - 0.4*low)*mix(0.4 + 0.55*n3, 1., off)*smoothstep(0.6, 2.5, dist)*(1. - smoothstep(1000., 1480., R));
  gl_FragColor = vec4(fxFogPremult(L*aOut, aOut), aOut);
}`;async function V(q,g){const{THREE:e,look:m,U:y,H:u}=g,o=l=>new e.Color(l),f=new e.Group,c=new e.PlaneGeometry(3600,3600).rotateX(-Math.PI/2);c.setAttribute("aL",new e.Float32BufferAttribute(new Float32Array(4),1));const i=g.lampColors,x=new e.ShaderMaterial({fog:!0,vertexShader:z,fragmentShader:P,uniforms:{...W(),uTime:y.uTime,uLit:{value:.36+.2*(m.density-.7)/.6},uSkyLo:{value:o(u.horizon).multiplyScalar(.8)},uSkyHi:{value:o(u.zenith)},uGold:{value:m.glow.clone().multiplyScalar(1.15)},uWarm:{value:o("#ffb060")},uRose:{value:i.magenta},uTeal:{value:i.teal},uLime:{value:i.lime}}}),d=new e.Mesh(c,x);d.position.y=r,d.renderOrder=1,f.add(d),await q.yield();const v=Math.max(6,Math.round(10*Math.min(1,m.detail+.2))),p=[],T=[],b=[],t=1500;for(let l=0;l<v;l++){const n=l/(v-1),h=r+2.5+(w-2.5-r)*n,s=p.length/3;p.push(-t,h,-t,t,h,-t,t,h,t,-t,h,t),T.push(n,n,n,n),b.push(s,s+2,s+1,s,s+3,s+2)}const a=new e.BufferGeometry;a.setAttribute("position",new e.Float32BufferAttribute(p,3)),a.setAttribute("aL",new e.Float32BufferAttribute(T,1)),a.setIndex(b),a.boundingSphere=new e.Sphere(new e.Vector3(0,w/2,0),t*1.5);const k=new e.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,vertexShader:z,fragmentShader:$,blending:e.CustomBlending,blendEquation:e.AddEquation,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,uniforms:{...W(),uTime:y.uTime,uSea:{value:B-r},uTop:{value:w-r},uWater:{value:r},uMist:{value:o(u.mist)},uGold:{value:m.glow.clone()},uAmber:{value:o("#ff9438")},uRose:{value:o("#ff9438").lerp(i.magenta,.6)},uTeal:{value:i.teal.clone().multiplyScalar(.6)},uEnds:{value:new e.Vector4(E.x,E.z0+8,M.x,M.z1+8)}}}),S=new e.Mesh(a,k);return S.renderOrder=2,f.add(S),{object:f,triangles:2+v*2,drawCalls:2,update(){},dispose(){c.dispose(),x.dispose(),a.dispose(),k.dispose()}}}export{w as BANK_TOP,V as buildGulf};
