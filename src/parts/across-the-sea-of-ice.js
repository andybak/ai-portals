import*as z from"three";import{clamp as Y,lerp as K,smoothstep as q}from"../kit/core.js";import*as wt from"../kit/fx.js";const O=Math.PI*2,T=f=>{const n=new z.Color(f);return[n.r,n.g,n.b]},R=(f,n,a)=>[K(f[0],n[0],a),K(f[1],n[1],a),K(f[2],n[2],a)],tt=f=>{const n=[];for(let a=0;a<f;a++)n.push(new z.Vector3);return n};function At(){return{uJA:{value:new z.Vector3(1e6,2e6,3e6)},uJB:{value:new z.Vector3(1000001,2000001,3000001)},uSunDirH:{value:tt(4)},uSunColH:{value:tt(4)},uSkyColH:{value:tt(4)},uGndColH:{value:tt(4)},uFogColH:{value:tt(4)},uFogDenH:{value:new z.Vector4(0,0,0,0)},uZenH:{value:tt(4)},uFlashPos:{value:new z.Vector3(0,300,0)},uFlashCol:{value:new z.Color(.8,.86,1)},uFlashAmt:{value:0},uShadeY:{value:new z.Vector2(-1e3,-999)},uShadeOn:{value:0},uGlow:{value:1},uCloudAmt:{value:0},uTime:{value:0},uFloorK:{value:new z.Vector4(0,1,0,1)},uWind:{value:new z.Vector2(5,-1.5)},uPortal:{value:new z.Vector4(0,-9999,0,1)},uPortalCol:{value:new z.Color(0,0,0)},uFire:{value:new z.Vector4(0,-9999,0,1)},uFireCol:{value:new z.Color(0,0,0)},uLamp:{value:new z.Vector4(0,-9999,0,1)},uLamp2:{value:new z.Vector4(0,-9999,0,1)},uLampCol:{value:new z.Color(0,0,0)},uOpen:{value:0},uSwell:{value:0}}}function Wt(f,n,a){f.uSunDirH.value[n].copy(a.sunDir).normalize();for(const[w,y]of[["sun","uSunColH"],["sky","uSkyColH"],["gnd","uGndColH"],["fog","uFogColH"],["zen","uZenH"]])a[w]&&f[y].value[n].set(a[w][0],a[w][1],a[w][2]);f.uFogDenH.value.setComponent(n,a.fogDen??5e-4)}const ct=`uniform vec3 uJA, uJB, uSunDirH[4], uSunColH[4], uSkyColH[4], uGndColH[4], uFogColH[4], uZenH[4], uFlashPos, uFlashCol, uPortalCol, uFireCol, uLampCol;
uniform vec4 uFogDenH, uPortal, uFire, uFloorK, uLamp, uLamp2; uniform float uFlashAmt, uGlow, uCloudAmt, uTime, uShadeOn; uniform vec2 uShadeY, uWind;
// how far the low sun reaches down at a place: 0 in the shade under the band of heights over the valley's own floor, 1 above it
float sunReach(vec3 w){ float f = uFloorK.z*pow(max(clamp((-w.z - uFloorK.x)/max(uFloorK.y, 1.), 0., 1.), .0001), uFloorK.w); return smoothstep(uShadeY.x, uShadeY.y, w.y - f); }
struct PlaceLight { vec3 k; vec3 sunDir; vec3 sunCol; vec3 skyCol; vec3 gndCol; vec3 fogCol; vec3 flashDir; float fogDen; float shadeK; float cloud; float flash; };
vec3 hourK(float s){ return smoothstep(uJA, uJB, vec3(s)); }
vec3 mixH(vec3 a, vec3 b, vec3 c, vec3 d, vec3 k){ return mix(mix(mix(a, b, k.x), c, k.y), d, k.z); }
PlaceLight placeLight(vec3 w){
  PlaceLight L; vec3 k = hourK(-w.z); L.k = k;
  L.sunDir = normalize(mixH(uSunDirH[0], uSunDirH[1], uSunDirH[2], uSunDirH[3], k));
  L.sunCol = mixH(uSunColH[0], uSunColH[1], uSunColH[2], uSunColH[3], k);
  L.skyCol = mixH(uSkyColH[0], uSkyColH[1], uSkyColH[2], uSkyColH[3], k);
  L.gndCol = mixH(uGndColH[0], uGndColH[1], uGndColH[2], uGndColH[3], k);
  L.fogCol = mixH(uFogColH[0], uFogColH[1], uFogColH[2], uFogColH[3], k);
  L.fogDen = mix(mix(mix(uFogDenH.x, uFogDenH.y, k.x), uFogDenH.z, k.y), uFogDenH.w, k.z);
  L.shadeK = uShadeOn*k.x*(1.-k.y); L.cloud = uCloudAmt*k.y*(1.-k.z);
  L.flash = uFlashAmt*(1.-smoothstep(uJA.x, uJB.x + 160., -w.z)); L.flashDir = normalize(uFlashPos - w);
  L.fogCol = mix(L.fogCol, vec3(.27, .36, .6), min(.6, .35*L.flash));
  return L;
}
// a small light at a place: what a surface at w facing n takes of it
vec3 pointLight(vec4 at, vec3 col, vec3 w, vec3 n){ vec3 pd = at.xyz - w; float pl = max(length(pd), .001), pk = clamp(1. - pl/max(at.w, 1.), 0., 1.); return col*pk*pk*(.35 + .65*clamp(dot(n, pd/pl), 0., 1.)); }
// every small light of the place on a face: the ring, the fire, the lamps
vec3 smallLights(vec3 w, vec3 n){ return pointLight(uPortal, uPortalCol, w, n) + pointLight(uFire, uFireCol, w, n) + pointLight(uLamp, uLampCol, w, n) + pointLight(uLamp2, uLampCol, w, n); }
vec3 placeFog(vec3 c, PlaceLight L, float d){ return mix(c, L.fogCol, 1.-exp(-L.fogDen*L.fogDen*d*d)); }`,vt=`  PlaceLight PL = placeLight(vW);
  vec3 uSunDir = PL.sunDir, uSunCol = PL.sunCol, uSkyCol = PL.skyCol, uGndCol = PL.gndCol, uFlashDir = PL.flashDir; float uFlash = PL.flash;
`;function Ht(f,n={}){const a=!!n.floe;return new z.ShaderMaterial({uniforms:{...f},defines:a?{FLOE:1}:{},vertexShader:`attribute vec3 aCol, aMix; varying vec3 vCol, vMix, vW, vN;
#ifdef FLOE
attribute vec4 aFloe; uniform float uOpen, uSwell, uTime;
#endif
varying float vFd;
void main(){
  vec3 p = position, n = normal;
#ifdef FLOE
  // a plate of ice: it drifts by its own measure as the leads open (aFloe.zw: metres at the full), turns a little about its
  // own middle, rides the swell that runs under the ice and rocks
  vec2 c = aFloe.xy; float ph = fract(c.x*.137 + c.y*.071)*6.283;
  float sw = sin(c.y*.045 + uTime*.9 + ph*.3), sw2 = cos(c.x*.05 - uTime*.7 + ph);
  float tiltX = uSwell*(.05*sw + .025*sin(uTime*1.3+ph)), tiltZ = uSwell*(.04*sw2);
  vec3 q = p - vec3(c.x, 0., c.y);
  float ang = (fract(ph*3.7)-.5)*.11*uOpen, ca = cos(ang), sa = sin(ang);
  q.xz = vec2(q.x*ca - q.z*sa, q.x*sa + q.z*ca);
  n.xz = vec2(n.x*ca - n.z*sa, n.x*sa + n.z*ca);
  q.y += q.x*tiltZ + q.z*tiltX;
  n = normalize(n + vec3(-tiltZ, 0., -tiltX)*n.y);
  q.xz += aFloe.zw*uOpen;
  q.y += uSwell*.55*sw;
  p = q + vec3(c.x, 0., c.y);
#endif
  vec4 wp = modelMatrix*vec4(p, 1.); vW = wp.xyz; vN = normalize(mat3(modelMatrix)*n); vCol = aCol; vMix = aMix;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  vFd = -mvPosition.z;
}`,fragmentShader:`${ct}
varying vec3 vCol, vMix, vW, vN;
${wt.GLSL_NOISE}
varying float vFd;
void main(){
${vt}
  float ice = clamp(vMix.x, 0., 1.), snow = clamp(vMix.y, 0., 1.), depth = clamp(vMix.z, 0., 60.), rock = clamp(1.-ice-snow, 0., 1.);
  // the facet's own normal (crisp ice, masonry-hard rock) mixed with the smooth one
  vec3 cr = cross(dFdx(vW), dFdy(vW)); float cl = length(cr);
  vec3 N = normalize(vN), fn = cl > 1e-9 ? cr/cl : N; if (dot(fn, N) < 0.) fn = -fn;
  N = normalize(mix(N, fn, .2 + .5*ice + .65*rock));
  float n1 = vnoise(vW.xz*.31), n2 = vnoise(vW.xz*1.9 + vW.y*.7), n3 = vnoise(vec2(vW.x*.6+vW.z*.6, vW.y*1.6)*.35), n4 = vnoise(vW.xz*.045);
  // small relief from the noise's own slope
  vec2 g = vec2(vnoise(vW.xz*1.9 + vec2(.35, 0.) + vW.y*.7) - n2, vnoise(vW.xz*1.9 + vec2(0., .35) + vW.y*.7) - n2);
  N = normalize(N + vec3(g.x, 0., g.y)*(.9*rock*smoothstep(.45, .9, fn.y) + .45*snow + .3*ice));
  // ROCK takes its grain in world space on three planes, each weighed by how the facet faces it (no stripes drawn down a
  // face): masses 20 m across, blocks of 5 m, a grain of 0.8 m and one of 0.25 m that holds at 5 m from the eye
  vec3 tw = fn*fn; tw /= (tw.x + tw.y + tw.z);
  float r1 = vnoise(vW.zy*.05)*tw.x + vnoise(vW.xz*.05)*tw.y + vnoise(vW.xy*.05)*tw.z, r2 = vnoise(vW.zy*.21 + 3.)*tw.x + vnoise(vW.xz*.21 + 3.)*tw.y + vnoise(vW.xy*.21 + 3.)*tw.z;
  float r3 = vnoise(vW.zy*1.3)*tw.x + vnoise(vW.xz*1.3)*tw.y + vnoise(vW.xy*1.3)*tw.z, r4 = vnoise(vW.zy*4.1)*tw.x + vnoise(vW.xz*4.1)*tw.y + vnoise(vW.xy*4.1)*tw.z;
  vec3 albedo = vCol*mix((.84 + .2*n1 + .12*n2)*(.9 + .2*n4), (.58 + .56*r1)*(.76 + .48*r2)*(.84 + .32*r3)*(.9 + .2*r4), rock);
  // steep rock shows its beds (a dark line 0.8 m thick every 8 m of height, lifted by the masses: it reads from 200 m) and
  // its upright joints, about 11 m apart along the face
  float steep = rock*(1. - smoothstep(.5, .88, normalize(vN).y));
  float bed = abs(fract(vW.y*.125 + .9*r1) - .5);
  vec2 along = normalize(vec2(-vN.z, vN.x) + vec2(1e-4));
  float jv = abs(vnoise(vec2(dot(vW.xz, along)*.09, vW.y*.012) + 3.7) - .5);
  albedo *= mix(1., (.68 + .32*smoothstep(.0, .05, bed))*(.76 + .24*smoothstep(.0, .022, jv)), steep);
  float inner = 1.-exp(-depth*.2);
  // ice deepens to blue with its depth below the surface
  albedo = mix(albedo, vec3(.1, .34, .62), ice*inner*.82);
  float wrap = .3*max(ice, snow), ndl = dot(N, uSunDir), dif = clamp((ndl + wrap)/(1. + wrap), 0., 1.);
  // the low sun does not reach below the valley's shade line; cloud shadows cross the open ice
  float shade = mix(1., sunReach(vW), PL.shadeK);
  float cloud = 1.-PL.cloud*smoothstep(.42, .7, vnoise(vW.xz*.0042 + uTime*vec2(.05, .02)));
  float ao = exp(-depth*.075);
  vec3 amb = mix(uGndCol, uSkyCol, N.y*.5 + .5);
  vec3 c = albedo*(uSunCol*dif*shade*cloud*ao + amb*(.3 + .7*ao));
  // light from inside the ice: strongest far down the rifts, a little on every lit facet's edge
  float lum = dot(uSkyCol + uSunCol*.35, vec3(.3, .5, .2));
  c += ice*uGlow*vec3(.1, .52, .95)*(inner*inner*(.75 + .5*n2)*(.35 + lum*.55) + .04*lum*(1.-N.y));
  // snow glitter in the sun
  float sp = smoothstep(.93, 1., vnoise(vW.xz*9. + N.xz*3.));
  c += (snow + .5*ice)*(1.-inner)*sp*uSunCol*dif*shade*.5;
  // drift snow running low over the open ice before the wind, on the world's clock: pale streaks that pass over the snow
  // and the ice of the ice river and the frozen ocean (never down a rift's wall)
  float wl = max(length(uWind), .01); vec2 wd = uWind/wl; float al = dot(vW.xz, wd) - uTime*wl, ac = dot(vW.xz, vec2(-wd.y, wd.x));
  float sn = vnoise(vec2(al*.045, ac*.26))*.6 + vnoise(vec2(al*.11 + 7., ac*.6))*.4;
  // (r2: and fine snakes of it, 3 m long, within 120 m of the eye, gone by 380 m where they would be finer than the picture)
  sn = mix(sn, vnoise(vec2(al*.3 + 3., ac*1.3)), .4*(1. - smoothstep(120., 380., length(cameraPosition - vW))));
  // (r2: over the great waves too: on every face lying flatter than 60 degrees, at .65 of the snow's light)
  // (its own place: it comes on over the 50 m about the snout's brink, 20 m before the ice's hour begins to 30 m after, and
  // holds from there to the ice's edge: a thing of the ice, not of the hour)
  float drift = (smoothstep(.3, .8, sn) - .45)*smoothstep(uJA.y - 20., uJA.y + 30., -vW.z)*(snow + .6*ice)*(1. - inner)*smoothstep(.45, .8, N.y);
  c *= 1. + .65*drift;
  // the storm's flash, and the ring's light on what stands round it
  c += albedo*uFlashCol*uFlash*(.3 + .7*clamp(dot(N, uFlashDir), 0., 1.));
  c += albedo*smallLights(vW, N);
  // the lights of the north stand faintly on the snow and ice of the dusk's own country
  c += (snow + ice)*vec3(.1, 1., .48)*.04*PL.k.z*max(N.y, 0.)*(.5 + vnoise(vW.xz*.012 + uTime*.03));
  // OPEN WATER in a lead (a depth of -1): dark, mirroring the sky of its place; the low sun's light stands in it, and the
  // green of the north
  float water = 1. - smoothstep(-.9, -.5, vMix.z);
  if (water > 0.) {
    vec3 Vw = normalize(cameraPosition - vW), wa = vnoised(vW.xz*.7 + uTime*vec2(.3, .2));
    vec3 Nw = normalize(vec3(-wa.y*.22, 1., -wa.z*.22)), Rw = reflect(-Vw, Nw);
    float fr = .04 + .96*pow(1. - clamp(dot(Nw, Vw), 0., 1.), 5.), sr = max(dot(Rw, uSunDir), 0.);
    vec3 skyw = mix(PL.fogCol, mixH(uZenH[0], uZenH[1], uZenH[2], uZenH[3], PL.k), pow(clamp(Rw.y, 0., 1.), .45));
    vec3 wc = mix(vec3(.004, .008, .014), skyw, fr) + uSunCol*(pow(sr, 90.)*5. + pow(sr, 10.)*.45) + vec3(.1, 1., .48)*.07*PL.k.z*fr + smallLights(vW, Nw)*.25;
    c = mix(c, wc, water);
  }
  gl_FragColor = vec4(c, 1.);
  gl_FragColor.rgb = placeFog(gl_FragColor.rgb, PL, vFd);
}`})}function Dt(){const f=[],n=[],a=[],w=[],y=[];return{get count(){return f.length/3},get triangles(){return w.length/3},v(s,m,h,v,l=0,p=0,u=0){return f.push(s,m,h),n.push(v[0],v[1],v[2]),a.push(l,p,u),f.length/3-1},floe(s,m,h,v){for(;y.length/4<f.length/3;)y.push(s,m,h,v)},tri(s,m,h){w.push(s,m,h)},quad(s,m,h,v){w.push(s,m,h,s,h,v)},async buildBy(s,m=!1){const h=f.length/3,v=new Float32Array(f),l=new Float32Array(h*3);for(let u=0;u<w.length;u+=3){const o=w[u]*3,r=w[u+1]*3,t=w[u+2]*3,c=v[r]-v[o],g=v[r+1]-v[o+1],e=v[r+2]-v[o+2],i=v[t]-v[o],d=v[t+1]-v[o+1],H=v[t+2]-v[o+2],P=g*H-e*d,k=e*i-c*H,M=c*d-g*i;l[o]+=P,l[o+1]+=k,l[o+2]+=M,l[r]+=P,l[r+1]+=k,l[r+2]+=M,l[t]+=P,l[t+1]+=k,l[t+2]+=M,s&&u%9e4===89997&&await s.yield()}for(let u=0;u<h*3;u+=3){const o=Math.hypot(l[u],l[u+1],l[u+2])||1;l[u]/=o,l[u+1]/=o,l[u+2]/=o}s&&await s.yield();const p=new z.BufferGeometry;if(p.setAttribute("position",new z.BufferAttribute(v,3)),p.setAttribute("normal",new z.BufferAttribute(l,3)),p.setAttribute("aCol",new z.BufferAttribute(new Float32Array(n),3)),p.setAttribute("aMix",new z.BufferAttribute(new Float32Array(a),3)),m){for(;y.length/4<h;)y.push(0,0,0,0);p.setAttribute("aFloe",new z.BufferAttribute(new Float32Array(y),4))}return p.setIndex(h>65535?new z.BufferAttribute(new Uint32Array(w),1):new z.BufferAttribute(new Uint16Array(w),1)),p.computeBoundingSphere(),p}}}function Ct(){const f=[],n=[],a=[],w=[];let y=null;const C=new z.Vector3,s=new z.Vector3,m=new z.Vector3,h=new z.Vector3,v={get triangles(){return f.length/9},tri(l,p,u,o,r){C.set(l[0],l[1],l[2]),s.set(p[0],p[1],p[2]),m.set(u[0],u[1],u[2]),h.subVectors(s,C).cross(m.sub(C)).normalize(),f.push(l[0],l[1],l[2],p[0],p[1],p[2],u[0],u[1],u[2]);for(let t=0;t<3;t++){n.push(h.x,h.y,h.z);const c=r&&t===2?r:o;a.push(c[0],c[1],c[2]),y?w.push(y[0],y[1],y[2],y[3]):w.push(0,0,0,0)}},tag(l){y=l},quad(l,p,u,o,r,t){v.tri(l,p,u,r,t),v.tri(l,u,o,t||r,t)},box(l,p,u,o,r,t,c,g=0,e=0,i){const d=Math.cos(g),H=Math.sin(g),P=Math.cos(e),k=Math.sin(e),M=(A,D,b)=>{const S=D*P-b*k,L=D*k+b*P;return[l+A*d+L*H,p+S,u-A*H+L*d]},x=[M(-o,-r,-t),M(o,-r,-t),M(o,r,-t),M(-o,r,-t),M(-o,-r,t),M(o,-r,t),M(o,r,t),M(-o,r,t)];v.quad(x[1],x[0],x[3],x[2],c),v.quad(x[4],x[5],x[6],x[7],c),v.quad(x[0],x[4],x[7],x[3],c),v.quad(x[5],x[1],x[2],x[6],c),v.quad(x[3],x[7],x[6],x[2],i||c),v.quad(x[0],x[1],x[5],x[4],c)},cyl(l,p,u,o,r,t,c){const g=new z.Vector3(p[0]-l[0],p[1]-l[1],p[2]-l[2]).normalize(),e=new z.Vector3(1,0,0);Math.abs(g.x)>.9&&e.set(0,1,0);const i=new z.Vector3().crossVectors(g,e).normalize(),d=new z.Vector3().crossVectors(g,i),H=(P,k,M)=>{const x=M/r*O,A=Math.cos(x)*k,D=Math.sin(x)*k;return[P[0]+i.x*A+d.x*D,P[1]+i.y*A+d.y*D,P[2]+i.z*A+d.z*D]};for(let P=0;P<r;P++)v.quad(H(l,u,P),H(l,u,P+1),H(p,o,P+1),H(p,o,P),t,c)},band(l,p,u,o,r=[0,1,0]){const t=p[0]-l[0],c=p[1]-l[1],g=p[2]-l[2];let e=c*r[2]-g*r[1],i=g*r[0]-t*r[2],d=t*r[1]-c*r[0];const H=Math.hypot(e,i,d)||1;e*=u/2/H,i*=u/2/H,d*=u/2/H;const P=[l[0]-e,l[1]-i,l[2]-d],k=[l[0]+e,l[1]+i,l[2]+d],M=[p[0]-e,p[1]-i,p[2]-d],x=[p[0]+e,p[1]+i,p[2]+d];v.quad(P,k,x,M,o),v.quad(k,P,M,x,o)},build(l=!1){const p=new z.BufferGeometry;return p.setAttribute("position",new z.Float32BufferAttribute(f,3)),p.setAttribute("normal",new z.Float32BufferAttribute(n,3)),p.setAttribute("color",new z.Float32BufferAttribute(a,3)),l&&p.setAttribute("aTag",new z.Float32BufferAttribute(w,4)),p.computeBoundingSphere(),p}};return v}async function Nt(f,n,a,w,y){const C=n*a,s=new Float32Array(C*3),m=new Float32Array(C*3),h=new Float32Array(C*3),v=new Float32Array(C*3),l={x:0,y:0,z:0,c:[0,0,0],ice:0,snow:0,depth:0};for(let o=0;o<n;o++){for(let r=0;r<a;r++){const t=(o*a+r)*3;l.ice=0,l.snow=0,l.depth=0,w(o,r,l),s[t]=l.x,s[t+1]=l.y,s[t+2]=l.z,m[t]=l.c[0],m[t+1]=l.c[1],m[t+2]=l.c[2],h[t]=l.ice,h[t+1]=l.snow,h[t+2]=l.depth}o%3===2&&await f.yield()}const p=[];for(let o=0;o<n-1;o++){for(let r=0;r<a-1;r++){if(y&&y(o,r))continue;const t=o*a+r,c=t+1,g=t+a,e=g+1;p.push(t,c,g,c,e,g)}o%60===59&&await f.yield()}for(let o=0;o<p.length;o+=3){const r=p[o]*3,t=p[o+1]*3,c=p[o+2]*3,g=s[t]-s[r],e=s[t+1]-s[r+1],i=s[t+2]-s[r+2],d=s[c]-s[r],H=s[c+1]-s[r+1],P=s[c+2]-s[r+2],k=e*P-i*H,M=i*d-g*P,x=g*H-e*d;v[r]+=k,v[r+1]+=M,v[r+2]+=x,v[t]+=k,v[t+1]+=M,v[t+2]+=x,v[c]+=k,v[c+1]+=M,v[c+2]+=x,o%9e4===89997&&await f.yield()}for(let o=0;o<C*3;o+=3){const r=Math.hypot(v[o],v[o+1],v[o+2])||1;v[o]/=r,v[o+1]/=r,v[o+2]/=r}await f.yield();const u=new z.BufferGeometry;return u.setAttribute("position",new z.BufferAttribute(s,3)),u.setAttribute("normal",new z.BufferAttribute(v,3)),u.setAttribute("aCol",new z.BufferAttribute(m,3)),u.setAttribute("aMix",new z.BufferAttribute(h,3)),u.setIndex(C>65535?new z.BufferAttribute(new Uint32Array(p),1):new z.BufferAttribute(new Uint16Array(p),1)),u.computeBoundingSphere(),u}const gt=36,Et=2.4,bt=[6,18],Z=T("#e6edf6"),dt=T("#b4dcee"),at=T("#93c4dd"),yt=T("#55595c"),Bt=T("#05090f");async function _t(f,n,a,w){const y=a.noise,C=a.dens??1,s=(b,S)=>14*y.n2(b*.006+3.1,S*.004)+5*y.n2(b*.02,S*.011+7),m=(b,S)=>q(0,30,a.inside(b,S))*(1-q(a.sBreak-90,a.sBreak-30,S)),h=(b,S)=>{const L=m(b,S);if(L<=0)return S;let N=S-L*s(b,S);return N=S-L*s(b,N),N},v=b=>K(1,.2,q(a.sGate-70,a.sGate+50,b)),l=6.283*(.5+.5*y.n2(a.s0*.013,7.7)),p=(b,S,L=S)=>{const N=S*O/gt+.5*y.n2(b*.011,S*.004)+.3*y.n2(b*.03+5,S*.02),B=N+.6*Math.sin(N+.8),F=.5+.5*Math.sin(B),W=b-a.route(S),I=1-q(bt[0],bt[1],Math.abs(W)),_=a.figZone,V=_?_.lim(L):0,E=V>0?(b-a.route(L))*_.D:0,U=V>0&&E>0?_.on(L)*(1-q(V,V+14,E)):0,$=Math.max(I,U),X=U>0?q(_.b0-9,_.b0,E)*q(_.sA-14,_.sA,L)*(1-q(_.sB,_.sB+14,L)):0,j=X>0?X*(4.4+2*Y((E-_.b0)/(_.b1-_.b0),0,1)+1.6*Y((L-_.sA)/(_.sB-_.sA),0,1)):0,nt=.5+.5*Math.sin(S*O/230+l)*(W>=0?1:-1),ot=(6+8*Y(.62*nt+.38*(.5+.5*y.n2(b*.017+3,S*.012))+.19,0,1))*(Math.pow(F,2.1)-.25)+1.5*y.n2(b*.045,S*.045)+1.3*F*Math.abs(y.n2(b*.1+4,S*.035)),et=2.4*(Math.pow(F,1.5)-.5)-1.2+.5*y.n2(b*.045,S*.045);return K(ot,et*(1-.9*X)+j,$)+.3*(1-.8*X)*y.n2(b*.13,S*.13)},u=[];{const b=w.rifts;for(let N=Math.ceil((a.s0+46)/gt);N*gt<a.sGate+10;N++){const B=b.range(5,10),F=b.range(240,330),W=b.range(-30,30),I=b.range(13,22),_=b.range(0,5),V=b.chance(Math.min(.95,.9*C)),E=N*gt+_,U=a.cutLimit&&a.cutLimit(E,j=>E+s(j,E)*m(j,E))||[-1e9,1e9],$=W-F/2,X=W+F/2;V&&u.push({kind:0,sw:N*gt+_,w:B,D:I,x0:Math.max($,U[0]),x1:Math.min(X,U[1]),tap:40,tapA:U[0]>$?U[2]:void 0,tapB:U[1]<X?U[2]:void 0})}const S=w.leads;let L=a.sGate+S.range(40,60);for(;L<a.sBreak-30;){const N=S.range(3,10),B=S.range(160,420),F=S.range(-120,120),W=a.leadLimit||[-1e9,1e9],I=L,_=a.cutLimit&&a.cutLimit(I,V=>I+s(V,I)*m(V,I))||[-1e9,1e9];u.push({kind:1,sw:L,w:N,D:1.5,x0:Math.max(F-B/2,W[0],_[0]),x1:Math.min(F+B/2,W[1],_[1]),tap:30}),L+=S.range(46,80)/C+N}}const o=(b,S)=>q(b.x0,b.x0+(b.tapA||b.tap),S)*(1-q(b.x1-(b.tapB||b.tap),b.x1,S)),r=(b,S,L)=>{let N=0;for(let B=0;B<u.length;B++){const F=u[B],W=Math.abs(L-F.sw);if(W>F.w*.5)continue;const I=o(F,b-a.axis(S)),_=F.w*.5*I;if(W>=_)continue;const V=Math.min(.5,_*.4),E=F.D*Math.pow(I,.7)*(F.kind?1:1-.15*(W/_));N=Math.max(N,W>_-V?E*.85*(_-W)/V:E*(.85+.15*(1-W/(_-V))))}return N},t={x:0,y:0,z:0,c:[0,0,0],ice:0,snow:0,depth:0},c=(b,S,L,N)=>a.level(S)+p(b,L,S)*v(S)*q(4,40,N)*(a.swept?1-.9375*a.swept(b,S):1),g=(b,S)=>{const L=-S,N=a.inside(b,L);if(N<=0)return a.land(b,S,t),t.y;const B=h(b,L),F=c(b,L,B,N)-r(b,L,B),W=q(0,a.rim??12,N);return W>=1?F:(a.land(b,S,t),K(t.y,F,W))},e=[];for(let b=a.s0-40;b<a.sEdge+.01;b+=b<a.sGate+60?2.6:6){let S=!1;for(const L of u)Math.abs(b-L.sw)<L.w*.5+1.3&&(S=!0);!S&&Math.abs(b-a.sBreak)>2.5&&e.push({sw:b,cut:null,t:0})}e.push({sw:a.sBreak,cut:null,t:0});for(const b of u)for(const S of[-2,-1,0,1,2])e.push({sw:b.sw,cut:b,t:S});const i=b=>b.sw+(b.cut?b.t*b.cut.w*.25:0);e.sort((b,S)=>i(b)-i(S)),await f.yield();const d=a.offs,H=d.length,P=e.length,k=a.rim??12,A=await Nt(f,P,H,(b,S,L)=>{const N=e[b],B=a.route(N.sw)+d[S];let F=N.sw,W=0,I=0;if(N.cut){const J=N.cut,rt=o(J,B-a.axis(J.sw)),lt=J.w*.5*rt,ht=Math.min(.5,lt*.4),ft=J.D*Math.pow(rt,.7),pt=Math.abs(N.t);F=J.sw+Math.sign(N.t)*(pt===2?lt:pt===1?lt-ht:0),W=pt===2?0:pt===1?ft*.85:ft,I=J.kind&&pt<2&&rt>.05?1:0,I&&(W=1.3)}const _=m(B,F),V=F+(_>0?_*s(B,F):0),E=a.route(V)+d[S],U=-V,$=a.inside(E,V);if(L.x=E,L.z=U,$<=0){if(a.land(E,U,L),L.y-=.02,$>-9){const J=q(-9,-1,$)*.7;L.c=R(L.c,yt,J),L.snow*=1-J}return}const X=c(E,V,F,$),j=q(0,k,$),nt=q(-.4,.5,y.n2(E*.016+9,V*.016));let st=X-W;j<1&&(a.land(E,U,t),st=K(t.y-1.5,st,j)),L.y=st;const ot=q(-1.2,1.6,(X-a.level(V))/Math.max(.25,v(V))),et=q(a.sGate-40,a.sGate+80,V),ut=(1-q(bt[0],bt[1],Math.abs(d[S])))*(1-et),mt=q(-.15,.35,y.n2(E*.05+2,V*.11+5)),it=Y(K(.25+.6*ot,.86+.14*ot,et)-.35*nt*(1-et),0,1)*(W>.01?0:1)*j*(1-ut*(1-mt)*.85);L.c=R(R(dt,at,nt),Z,it),j<1&&(L.c=R(R(yt,at,.35),L.c,q(.15,1,j))),L.ice=1-it,L.snow=it,L.depth=W+(1-j)*2+(W>.01?0:Math.max(1.7*(1-ot)*(1-ut),1.1*ut*(1-mt))*(1-et)*j),I&&(L.c=Bt,L.ice=0,L.snow=0,L.depth=-1)},(b,S)=>e[b+1].sw>a.sBreak&&Math.abs(d[S]+d[S+1])*.5<a.floeHalf),D=new z.Mesh(A,Ht(n));return D.name="sea-of-ice",await f.yield(),{mesh:D,material:D.material,warp:s,swOf:h,amp:v,waveAt:p,cuts:u,taper:o,cutDepth:r,topAt:c,surfAt:g,rows:e}}function Tt(f,n,a,w,y,C,s,m,h,v=0,l=0,p=.6){const u=Math.cos(h),o=Math.sin(h),r=[],t=[],c=[],g=()=>n.range(.72,1.12);for(let e=0;e<8;e++){const i=e&1?1:-1,d=e&2?1:0,H=e&4?1:-1,P=i*C*g()*(d?.8:1),k=H*m*g()*(d?.8:1),M=d?2*s*g()+P*l+k*v:-p,x=a+P*u+k*o,A=y-P*o+k*u;r.push(f.v(x,w+M,A,d?dt:at,d?.35:1,d?.65:0,d?.15:1.2)),d||c.push([x,A,a+(x-a)*1.55,y+(A-y)*1.55]),d&&t.push(f.v(x,w+M+.02,A,Z,.1,.9,0))}if(s>.6){const e=c.map(d=>f.v(d[0],w+.3*s,d[1],Z,.15,.85,.8)),i=c.map(d=>f.v(d[2],w-p*.5,d[3],Z,.05,.95,0));for(const[d,H]of[[0,1],[1,3],[3,2],[2,0]])f.quad(i[H],i[d],e[d],e[H])}return f.quad(t[0],t[2],t[3],t[1]),f.quad(r[0],r[2],r[3],r[1]),f.quad(r[5],r[7],r[6],r[4]),f.quad(r[4],r[6],r[2],r[0]),f.quad(r[1],r[3],r[7],r[5]),Math.hypot(C,m)*1.12}function Kt(f,n,a,w,y,C,s,m,h){const l=n.range(0,O),p=[[-1.5,1.08,3.4],[.34*s,.94,1.5],[.68*s,.74,.8],[s,.5,.35]],u=[],o=Math.cos(h)*m,r=Math.sin(h)*m;for(let t=0;t<p.length;t++){const c=Math.max(0,p[t][0])/s,g=[];for(let e=0;e<6;e++){const i=l+e/6*O+n.range(-.22,.22)+t*.2,d=C*p[t][1]*n.range(.8,1.15),H=w+p[t][0]+(t===3?n.range(-.16,.06)*s:t?n.range(-.05,.05)*s:0);g.push([a+Math.cos(i)*d+o*c*c,H,y+Math.sin(i)*d+r*c*c])}u.push(g)}for(let t=0;t<3;t++){const c=u[t].map(e=>f.v(e[0],e[1],e[2],at,1,0,p[t][2])),g=u[t+1].map(e=>f.v(e[0],e[1],e[2],t===2?dt:at,1,0,p[t+1][2]));for(let e=0;e<6;e++){const i=(e+1)%6;f.quad(c[i],c[e],g[e],g[i])}}{const t=u[3],c=[0,0,0];for(const i of t)c[0]+=i[0]/6,c[1]+=i[1]/6,c[2]+=i[2]/6;const g=f.v(c[0],c[1]+.05*s,c[2],Z,.05,.95,0),e=t.map(i=>f.v(i[0],i[1]+.03,i[2],Z,.1,.9,0));for(let i=0;i<6;i++)f.tri(g,e[(i+1)%6],e[i])}{const t=[],c=[];for(let g=0;g<6;g++){const e=u[0][g],i=e[0]-a,d=e[2]-y;t.push(f.v(a+i*.98,w+.07*s*n.range(.5,1.3),y+d*.98,Z,.15,.85,1.2)),c.push(f.v(a+i*1.75,w-.4,y+d*1.75,Z,.05,.95,0))}for(let g=0;g<6;g++){const e=(g+1)%6;f.quad(c[e],c[g],t[g],t[e])}}return C*1.25+Math.abs(m)}async function Vt(f,n,a,w,y){const C=a.floeHalf,s=Math.round(2*C/(27/Math.sqrt(a.dens??1))),m=2*C/s,h=m*.866,v=Math.ceil((a.sEdge-a.sBreak)/h)+1,l=a.level(a.sBreak),p=l-.9,u=[];for(let e=-1;e<=v+1;e++){const i=[];for(let d=-1;d<=s;d++)i.push([-C+(d+.25+.5*(e&1))*m+w.range(-.2,.2)*m,a.sBreak+(e+.5)*h+w.range(-.26,.26)*h]);u.push(i)}const o=(e,i)=>u[e+1][i+1],r=(e,i)=>{const d=e&1;return[[e,i+1],[e+1,i+d],[e+1,i+d-1],[e,i-1],[e-1,i+d-1],[e-1,i+d]]},t=Dt(),c=[];for(let e=0;e<v;e++){for(let i=0;i<s;i++){const d=o(e,i),H=r(e,i),P=[];for(let F=0;F<6;F++){const W=o(H[F][0],H[F][1]),I=o(H[(F+1)%6][0],H[(F+1)%6][1]);P.push([Y((d[0]+W[0]+I[0])/3,-C+.4,C-.4),Math.max((d[1]+W[1]+I[1])/3,a.sBreak+.4)])}const k=d[0],M=d[1];if(M>a.sEdge+h*.3)continue;const x=a.route(M)+k,A=-M;let D=0;for(const F of P)D=Math.max(D,Math.hypot(F[0]-k,F[1]-M));const b=[w.range(-.6,.6),-((M-a.sBreak)/h)*3.5-w.range(0,1.4)];if(y&&!y(x,A,D,b))continue;const S=w.range(0,.5),L=t.v(x,l+S+w.range(.1,.5),A,Z,.1,.9,0),N=[],B=[];for(const F of P){const W=F[0]-k,I=F[1]-M,_=Math.hypot(W,I)||1,V=a.route(M)+F[0]-W/_*.5,E=-(F[1]-I/_*.5);N.push(t.v(V,l+S,E,R(Z,dt,.35),.4,.6,.2)),B.push(t.v(V,p-1.6,E,at,1,0,3.2))}for(let F=0;F<6;F++){const W=(F+1)%6;t.tri(L,N[F],N[W]),t.quad(N[W],N[F],B[F],B[W])}t.floe(x,A,b[0],b[1]),c.push({x,z:A,r:D,drift:b})}await f.yield()}const g=new z.Mesh(await t.buildBy(f,!0),Ht(n,{floe:!0}));return g.name="floes",g.frustumCulled=!1,{mesh:g,plates:c,sea:p,top:l}}function Ot(f,n,a){const y=f.v(0,.35,0,Z,.1,.9,0),C=[],s=[];for(let m=0;m<9;m++){const h=m/9*O,v=a*n.range(.72,1.1);C.push(f.v(Math.cos(h)*v,0,Math.sin(h)*v,R(Z,dt,.3),.4,.6,.2)),s.push(f.v(Math.cos(h)*v*.9,-2.6,Math.sin(h)*v*.9,at,1,0,3.2))}for(let m=0;m<9;m++){const h=(m+1)%9;f.tri(y,C[h],C[m]),f.quad(C[m],C[h],s[h],s[m])}}function Ut(f,n,a,w={}){const y=w.ax??14.5,C=w.ay??17,s=w.yc??4,m=26,h=9,v=-.32,l=Math.PI+.32,p=[];for(let u=0;u<=m;u++){const o=K(v,l,u/m),r=y*Math.cos(o),t=s+C*Math.sin(o),c=Math.max(0,Math.sin(o));let g=-y*Math.sin(o),e=C*Math.cos(o);const i=Math.hypot(g,e);g/=i,e/=i;const d=e,H=-g,P=K(4.6,2.9,Math.pow(c,.8)),k=[];for(let M=0;M<h;M++){const x=M/h*O,A=1+.2*a.n3(r*.16+7,t*.16,Math.cos(x)*1.3+Math.sin(x)*2.1)+.08*a.n3(r*.5,t*.5,x*2),D=P*A,b=Math.cos(x)*D,S=Math.sin(x)*D*1.5,L=r+d*b,N=t+H*b,B=H*Math.cos(x),F=q(.35,.8,B)*.9;k.push(f.v(L,N,S,R(dt,Z,F),1-F,F,1.2+2.6*(1-F)*(.6+.4*a.n2(L*.3,N*.3+S))))}p.push(k)}for(let u=0;u<m;u++)for(let o=0;o<h;o++){const r=(o+1)%h;f.quad(p[u][o],p[u+1][o],p[u+1][r],p[u][r])}for(const u of[-1,1])for(let o=0;o<5;o++)Tt(f,n,u*(y+n.range(-1,7.5)),-1.2,n.range(-7,7),n.range(3,5),n.range(1.2,3.2),n.range(3.5,6.5),n.range(0,O),n.range(-.2,.2),n.range(-.2,.2),2);return{ax:y,ay:C,yc:s,top:s+C+3.2,half:y+6.5}}const Pt=12;function Rt(f,n={}){const a=[],w=[],y=[],C=[],s=T(n.coat||"#15171c"),m=T(n.coat2||"#1d2026"),h=T(n.hair||"#050506"),v=T(n.skin||"#3b3a34"),l=T(n.boot||"#0b0b0d"),p=(k,M,x,A,D,b,S,L,N,B,F)=>{const W=[[M-b,A,x-S],[M+b,A,x-S],[M+b,A,x+S],[M-b,A,x+S],[M-L,D,x-N],[M+L,D,x-N],[M+L,D,x+N],[M-L,D,x+N]],I=(V,E,U,$,X,j)=>{const nt=W[E][0]-W[V][0],st=W[E][1]-W[V][1],ot=W[E][2]-W[V][2],et=W[$][0]-W[V][0],ut=W[$][1]-W[V][1],mt=W[$][2]-W[V][2];let it=st*mt-ot*ut,J=ot*et-nt*mt,rt=nt*ut-st*et;const lt=Math.hypot(it,J,rt)||1;it/=lt,J/=lt,rt/=lt;for(const ht of[V,E,U,V,U,$]){a.push(W[ht][0],W[ht][1],W[ht][2]),w.push(it,J,rt);const ft=W[ht][1]===D?j:X;y.push(ft[0],ft[1],ft[2]),C.push(k)}},_=F||B;I(0,1,2,3,B,_),I(4,7,6,5,B,_),I(1,0,4,5,B,_),I(2,1,5,6,B,_),I(3,2,6,7,B,_),I(0,3,7,4,B,_)};p(0,0,0,-.05,.86,.27,.17,.37,.2,s,m),p(0,0,.02,.8,.95,.2,.14,.11,.1,m),p(1,0,.01,0,.4,.125,.14,.14,.15,v),p(1,0,-.06,-.3,.46,.2,.14,.17,.15,h),p(1,0,.02,.3,.47,.16,.17,.14,.14,h);for(const[k,M]of[[2,-1],[4,1]])p(k,0,0,-.7,0,.11,.115,.14,.14,s),p(k+1,0,0,-.66,0,.085,.09,.105,.11,l),p(k+1,0,.1,-.7,-.56,.09,.2,.085,.16,l),p(k===2?6:8,M*.02,0,-.56,.04,.085,.09,.11,.115,s),p(k===2?7:9,M*.02,0,-.52,0,.07,.075,.082,.088,s),p(k===2?7:9,M*.02,.01,-.68,-.5,.05,.06,.06,.07,v),p(k===2?10:11,M*.17,-.1,-1,.02,.2,.05,.16,.09,s,m),p(k===2?10:11,M*.31,.02,-.92,.02,.035,.16,.04,.15,s,m),n.cloak&&p(k===2?10:11,M*.2,-.26,-1.05,.04,.3,.05,.22,.05,s,m);n.cloak&&p(0,0,-.25,-.02,.9,.42,.05,.37,.07,s,m);const u=new z.BufferGeometry;u.setAttribute("position",new z.Float32BufferAttribute(a,3)),u.setAttribute("normal",new z.Float32BufferAttribute(w,3)),u.setAttribute("aCol",new z.Float32BufferAttribute(y,3)),u.setAttribute("aB",new z.Float32BufferAttribute(C,1)),u.boundingSphere=new z.Sphere(new z.Vector3(0,1.4,0),3.2);const o=[];for(let k=0;k<Pt;k++)o.push(new z.Matrix4);const r=new z.ShaderMaterial({uniforms:{...f,uB:{value:o}},vertexShader:`uniform mat4 uB[${Pt}]; attribute float aB; attribute vec3 aCol; varying vec3 vCol, vN, vW;
varying float vFd;
void main(){
  mat4 B = uB[int(aB + .5)];
  vec4 wp = modelMatrix*(B*vec4(position, 1.)); vW = wp.xyz; vN = normalize(mat3(modelMatrix)*(mat3(B)*normal)); vCol = aCol;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  vFd = -mvPosition.z;
}`,fragmentShader:`${ct}
varying vec3 vCol, vN, vW;
varying float vFd;
void main(){
${vt}
  vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
  float dif = clamp(dot(N, uSunDir)*.6 + .4, 0., 1.);
  vec3 c = vCol*(uSunCol*dif*.8 + mix(uGndCol, uSkyCol, N.y*.5 + .5));
  // a thin edge of sky light, so the dark shape keeps its outline against dark ice
  float rim = 1.-clamp(dot(N, V), 0., 1.); c += (uSkyCol*.5 + uSunCol*.12)*rim*rim*rim*.22;
  c += vCol*uFlashCol*uFlash*(.4 + .6*clamp(dot(N, uFlashDir), 0., 1.));
  gl_FragColor = vec4(c, 1.);
  gl_FragColor.rgb = placeFog(gl_FragColor.rgb, PL, vFd);
}`}),t=new z.Mesh(u,r);t.name="figure",t.frustumCulled=!1;const c=1.34,g=new z.Matrix4,e=new z.Matrix4,i=new z.Matrix4,d=(k,M,x,A,D,b,S=0,L=0)=>(k.copy(M).multiply(g.makeTranslation(x,A,D)),S&&k.multiply(e.makeRotationY(S)),b&&k.multiply(e.makeRotationX(b)),L&&k.multiply(e.makeRotationZ(L)),k),H=new z.Matrix4,P=k=>{const M=k.stand||0,x=1-M,A=(k.c||0)*Math.PI,D=Math.sin(A)*x,b=k.time||0,S=K(.34,.04,M),L=(k.rise||0)*4*(k.fly||0)*(1-(k.fly||0))*x,N=(k.look||0)*.85*M;d(i,H,0,c-.1*x*(1-Math.abs(D))+L,0,S),d(o[0],i,0,0,0,0,N+.12*D),d(o[1],o[0],0,.93,0,-S*.7+.1*M,(k.look||0)*1.25*M);for(const[B,F]of[[2,-1],[4,1]]){const W=F*D*1.05,I=Math.max(0,-W);d(o[B],i,F*.14,0,0,-W-.12*x),d(o[B+1],o[B],0,-.7,0,(.22+1.25*I)*x+.04);const _=B===2?6:8,V=-W*.85;d(o[_],o[0],F*.45,.8,0,-V+.1*M,0,F*(.1+.05*M)),d(o[_+1],o[_],0,-.56,0,-(.95*x+.18)),d(o[B===2?10:11],i,0,0,0,(.75+.22*Math.sin(A*2+F))*x+(.1+.07*Math.sin(b*2.3+F*1.7))*M-S,0,F*.05)}};return P({}),{mesh:t,geometry:u,material:r,bones:o,pose:P,height:2.7}}const xt=T("#1c1511"),Mt=T("#5d4a2b"),zt=T("#4a3b2c"),Q=T("#3a2c1f"),G=T("#d9e3ee"),Lt=T("#c9d2dc");function Zt(f){const n=Ct(),a=40,w=[],y=[],C=o=>4.7*(.6+.4*q(0,.28,o))*(1-Math.pow(q(.58,1,o),1.7)),s=o=>4+1.9*(2*o-1)*(2*o-1)+(o<.24?1.5:0),m=14,h=o=>(o-.5)*a;for(let o=0;o<m;o++){const r=o/m,t=(o+1)/m;for(const H of[-1,1]){const P=(D,b)=>{const S=C(D),L=b===0?-1.6:b===1?.9:b===2?s(D)-1.1:s(D),N=b===0?.25*S+.05:b===1?.93*S+.05:S+.05;return[H*N,L,h(D)]};for(let D=0;D<3;D++){const b=D===2?Mt:xt,S=P(r,D),L=P(t,D),N=P(t,D+1),B=P(r,D+1);H>0?n.quad(L,S,B,N,b,D===1?R(xt,G,.25):b):n.quad(S,L,N,B,b,D===1?R(xt,G,.25):b)}const k=P(r,3),M=P(t,3),x=[k[0]-H*.3,k[1],k[2]],A=[M[0]-H*.3,M[1],M[2]];H>0?n.quad(k,M,A,x,G):n.quad(M,k,x,A,G)}const c=s(r)-.95,g=s(t)-.95,e=C(r),i=C(t),d=f.chance(.55)?R(zt,G,f.range(.4,.9)):zt;n.quad([-e,c,h(r)],[e,c,h(r)],[i,g,h(t)],[-i,g,h(t)],zt,d)}{const o=C(0),r=s(0);n.quad([o,-1.6,h(0)],[-o,-1.6,h(0)],[-o,r,h(0)],[o,r,h(0)],xt,Mt);const t=h(.24),c=C(.24);n.quad([-c,s(.25)-.95,t],[c,s(.25)-.95,t],[c,s(.23)-.95,t],[-c,s(.23)-.95,t],Mt)}n.box(0,s(.42)-.95+1,h(.42),1.7,1,2.3,Mt,0,0,G),n.cyl([.9,s(.42)+1,h(.42)+1.2],[.9,s(.42)+2.6,h(.42)+1.2],.2,.18,6,xt);const v=[.9,s(.42)+2.7,h(.42)+1.2];n.box(0,s(.62)-.95+.45,h(.62),.95,.45,2.6,G,0,0,G);const l=[];for(const[o,r,t]of[[.74,28,.92],[.47,32,1],[.2,24,.78]]){const c=h(o),g=s(o)-1,e=-.035*r,i=k=>[0,g+r*k,c+e*k];n.cyl(i(0),i(.46),.44,.34,7,Q,R(Q,G,.5)),n.cyl(i(.42),i(.78),.28,.2,6,Q,R(Q,G,.6)),n.cyl(i(.74),i(1),.16,.08,5,R(Q,G,.5),G);{const k=i(.44);n.box(k[0],k[1],k[2],1.3,.09,1,R(Q,G,.6))}let d=0;for(const[k,M]of[[.36,21*t],[.62,16*t],[.84,11*t]]){const x=i(k),A=f.range(-.5,.5)*(d===0?1.4:.6),D=f.range(-.08,.08)*M,b=[-M/2,x[1]-A,x[2]+.5-D],S=[M/2,x[1]+A,x[2]+.5+D];n.cyl(b,S,.17,.17,5,Q,R(Q,G,.5));const L=6;for(let B=0;B<L;B++){const F=.06+.88*B/L,W=.06+.88*(B+1)/L,I=(.24+.2*Math.sin(Math.PI*(B+.5)/L))*f.range(.8,1.2);n.cyl([K(b[0],S[0],F),K(b[1],S[1],F)+.3,K(b[2],S[2],F)],[K(b[0],S[0],W),K(b[1],S[1],W)+.3,K(b[2],S[2],W)],I,I*f.range(.8,1.1),5,Lt,G)}const N=i(Math.min(1,k+.14));n.band(b,N,.1,G,[0,0,1]),n.band(S,N,.1,G,[0,0,1]),d++}const H=i(.44),P=C(o);for(const k of[-1,1]){const M=[];for(let x=0;x<4;x++)M.push([k*(P+.1),s(o),c-2.4+x*1.5]);for(const x of M)n.band([k*.5,H[1],H[2]],x,.11,G,[0,0,1]);for(let x=1;x<6;x++){const A=x/6.5;n.band([K(M[0][0],k*.5,A),K(M[0][1],H[1],A),K(M[0][2],H[2],A)],[K(M[3][0],k*.5,A),K(M[3][1],H[1],A),K(M[3][2],H[2],A)],.07,G,[k,0,0])}n.band(i(.78),[k*(P+.1),s(Math.max(0,o-.12)),c-5.2],.09,G,[0,0,1])}l.push({z:c,top:g+r,yard:21*t/2,at:i})}const p=[0,s(1)+.2,h(1)-1],u=[0,s(1)+4.6,h(1)+11];n.cyl(p,u,.3,.14,6,Q,R(Q,G,.6)),n.band(l[0].at(.46),u,.11,G,[1,0,0]),n.band(l[0].at(.78),u,.1,G,[1,0,0]),n.band(l[0].at(1),[0,u[1]+.4,u[2]-1],.09,G,[1,0,0]),n.band(l[1].at(.46),l[0].at(.12),.11,G,[1,0,0]),n.band(l[1].at(.78),l[0].at(.46),.1,G,[1,0,0]),n.band(l[2].at(.46),l[1].at(.12),.11,G,[1,0,0]),n.band(l[2].at(.78),l[1].at(.46),.1,G,[1,0,0]);{const o=l[2],r=o.at(.3),t=[0,r[1]+3.2,r[2]-8.5];n.cyl(r,t,.14,.09,5,Q,G),n.cyl([0,r[1]+.2,r[2]],[0,t[1]-.2,t[2]+.4],.3,.2,5,Lt,G)}w.push([0,s(0)+1.6,h(0)-.5,1.5],[C(.47)-.4,s(.47)+3,h(.47)-1,1],[-C(.47)+.4,s(.47)+3,h(.47)-1,1],[C(.74)-.4,s(.74)+2.6,h(.74),.9],[0,s(1)+1.4,h(1)-1.5,1],[-1.9,s(.42)+.2,h(.42),.9],[1.6,s(0)-1.6,h(0)-.25,.8],[-1.6,s(0)-1.6,h(0)-.25,.8]);for(const o of[-1.7,0,1.7])n.box(o,s(0)-1.55,h(0)-.05,.52,.4,.05,[2.6,1.45,.5]);for(const o of w.slice(0,5))n.box(o[0],o[1],o[2],.16,.24,.16,T("#2a2018")),n.box(o[0],o[1]+.34,o[2],.2,.05,.2,G);for(let o=0,r=2*f.int(3,4);o<r;o++){const t=f.range(.1,.9),c=o%2?1:-1,g=c*(C(t)-.75),e=s(t)-.95,i=h(t),d=R(T("#3a2f28"),T("#24303a"),f());n.box(g,e+.72,i,.24,.72,.2,d,f.range(0,3)),n.box(g,e+1.6,i,.14,.16,.14,T("#6a5648"),f.range(0,3)),y.push([g,e+1.6,i])}return{geometry:n.build(),triangles:n.triangles,length:a,beam:9.5,lanterns:w,smokeAt:v,masts:l,crew:y,mastTop:36,sheer:s,half:C,zAt:h}}function $t(f,n){const a=Ct(),w=T("#3b2b1d"),y=T("#17130f"),C=[T("#2a2622"),T("#6f6a62"),T("#191715"),T("#8d867a")],s=T("#b9b3a6");for(const t of[-1,1]){a.box(t*.62,.08,0,.05,.07,1.9,w),a.box(t*.62,.3,2.05,.05,.07,.34,w,0,-.9);for(const c of[-1.2,0,1.2])a.box(t*.62,.3,c,.04,.2,.04,w)}a.box(0,.78,-.1,.78,.3,1.5,y,0,0,T("#2c241c")),a.box(0,1.1,1.25,.72,.32,.1,y,0,.35),a.box(0,1.3,-1.5,.74,.5,.08,y,0,-.12),a.box(0,1,-.4,.5,.14,.7,T("#5a5348"));const m=n.int(4,5),h=2.3,v=3.6,l=[];a.band([0,.55,2.2],[0,.42,v+m*h+.8],.06,s,[1,0,0]);for(let t=0;t<=m;t++)for(const c of t===m?[0]:[-1,1])l.push({x:c*.55,z:v+t*h+n.range(-.2,.2),s:n.range(.9,1.1),ph:n.range(0,O),c:n.pick(C)});for(const t of l){const c=t.s,g=t.c,e=R(g,[.5,.5,.5],.25);a.tag([0,0,t.ph,0]),a.box(t.x,.58*c,t.z,.16*c,.17*c,.46*c,g,0,0,e),a.box(t.x,.74*c,t.z+.52*c,.1*c,.11*c,.17*c,g,0,-.6),a.box(t.x,.84*c,t.z+.7*c,.09*c,.09*c,.13*c,e,0,.1),a.box(t.x,.8*c,t.z+.86*c,.05*c,.045*c,.07*c,y),a.box(t.x,.82*c,t.z-.55*c,.035*c,.035*c,.2*c,e,0,.9);for(const[i,d,H]of[[-1,.34,0],[1,.34,.5],[-1,-.34,2.6],[1,-.34,3.1]])a.tag([.5*c,t.z+d*c,t.ph+H,.75]),a.box(t.x+i*.11*c,.26*c,t.z+d*c,.04*c,.26*c,.05*c,g);a.tag(null),t.x&&a.band([t.x,.62*c,t.z-.2],[0,.45,t.z-1],.04,s,[0,1,0])}const p=l[l.length-1];p&&a.band([0,.6,p.z-.2],[0,.42,p.z-.9],.04,s,[1,0,0]);const u={value:0},o=new z.ShaderMaterial({uniforms:{...f,uRun:u},side:z.DoubleSide,vertexShader:`uniform float uRun; attribute vec4 aTag; attribute vec3 color; varying vec3 vCol, vN, vW;
varying float vFd;
void main(){
  vec3 p = position, n = normal;
  // a leg swings about its joint; the body rises and falls twice to the stride
  float g = uRun*3.9, a = aTag.w*sin(g + aTag.z), ca = cos(a), sa = sin(a);
  vec2 d = p.yz - aTag.xy; p.yz = aTag.xy + vec2(d.x*ca - d.y*sa, d.x*sa + d.y*ca)*step(.01, aTag.w) + d*(1.-step(.01, aTag.w));
  n.yz = mix(n.yz, vec2(n.y*ca - n.z*sa, n.y*sa + n.z*ca), step(.01, aTag.w));
  p.y += .05*sin(g*2. + aTag.z)*step(.001, abs(aTag.z));
  vec4 wp = modelMatrix*vec4(p, 1.); vW = wp.xyz; vN = normalize(mat3(modelMatrix)*n); vCol = color;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  vFd = -mvPosition.z;
}`,fragmentShader:`${ct}
varying vec3 vCol, vN, vW;
varying float vFd;
void main(){
${vt}
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  float dif = clamp(dot(N, uSunDir)*.6 + .4, 0., 1.);
  vec3 c = vCol*(uSunCol*dif*.8 + mix(uGndCol, uSkyCol, N.y*.5 + .5));
  gl_FragColor = vec4(c, 1.);
  gl_FragColor.rgb = placeFog(gl_FragColor.rgb, PL, vFd);
}`}),r=new z.Mesh(a.build(!0),o);return r.name="sledge",r.frustumCulled=!1,{mesh:r,run:u,dogs:l.length,length:v+m*h+2,seat:[0,.9,-.55]}}function jt(f,n={}){const a={...f,uVault:{value:n.vault??40},uRag:{value:n.rag??45},uCloudLitH:{value:tt(4)},uCloudShadeH:{value:tt(4)},uDiscH:{value:tt(4)},uDiscDirH:{value:tt(4)},uCovH:{value:new z.Vector4(.3,.3,.3,.3)},uScatH:{value:new z.Vector4(0,0,0,0)},uDiscSizeH:{value:new z.Vector4(1,1,1,1)},uStarH:{value:new z.Vector4(0,0,0,0)},uAurH:{value:new z.Vector4(0,0,0,0)}},w=new z.ShaderMaterial({uniforms:a,side:z.BackSide,depthWrite:!1,vertexShader:`varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix*vec4(mat3(viewMatrix)*position, 1.);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,fragmentShader:`${ct}
uniform float uVault, uRag; uniform vec3 uCloudLitH[4], uCloudShadeH[4], uDiscH[4], uDiscDirH[4]; uniform vec4 uCovH, uScatH, uDiscSizeH, uStarH, uAurH;
varying vec3 vDir;
${wt.GLSL_NOISE}
float w4(vec4 a, vec3 k){ return mix(mix(mix(a.x, a.y, k.x), a.z, k.y), a.w, k.z); }
void main(){
  vec3 d = normalize(vDir), E = cameraPosition; float up = max(d.y, 0.);
  // the place this piece of sky stands over
  vec2 P = E.xz + d.xz*(uVault/max(d.y, .033));
  float rag = (vnoise(P*.0045) - .5)*2.*uRag + (vnoise(P*.016) - .5)*.7*uRag;
  vec3 k = hourK(-P.y + rag);
  vec4 w = vec4(1.-k.x, k.x*(1.-k.y), k.y*(1.-k.z), k.z);
  vec3 zen = mixH(uZenH[0], uZenH[1], uZenH[2], uZenH[3], k), hor = mixH(uFogColH[0], uFogColH[1], uFogColH[2], uFogColH[3], k);
  vec3 col = mix(hor, zen, pow(up, .5));
  // clouds on their own high plane, going with the wind (r2: 14 m a second at their height; their shadows on the ice 13)
  vec2 cp = (E.xz + d.xz*(1600./max(d.y, .05)))*.00042 + uTime*vec2(.006, .00274);
  float n = fbm(cp), n2 = fbm(cp*2.6 + 9.3), cov = w4(uCovH, k);
  float cl = smoothstep(1.02 - cov - .2, 1.02 - cov + .2, n*.62 + n2*.38);
  vec3 lit = mixH(uCloudLitH[0], uCloudLitH[1], uCloudLitH[2], uCloudLitH[3], k), shd = mixH(uCloudShadeH[0], uCloudShadeH[1], uCloudShadeH[2], uCloudShadeH[3], k);
  vec3 cc = mix(shd, lit, clamp(n2*1.5 - .3 + .5*(1. - cl), 0., 1.));
  // each hour's own sun or moon, in its own sky only
  vec3 sunAdd = vec3(0.);
  for (int i = 0; i < 4; i++) {
    float sd = max(dot(d, uDiscDirH[i]), 0.), e = 1. - .00012*uDiscSizeH[i];
    sunAdd += w[i]*uDiscH[i]*(smoothstep(e - .00008*uDiscSizeH[i], e, sd)*14. + pow(sd, 240.)*.5 + pow(sd, 9.)*uScatH[i]);
  }
  // stars, and the lights of the north: folded curtains with rays, going slowly on the clock
  vec3 sg = d*170., sf = fract(sg) - .5; float sh = hash13(floor(sg));
  float star = step(.9962, sh)*(1. - smoothstep(.06, .34, length(sf)))*smoothstep(.02, .16, up)*(.65 + .35*sin(uTime*2.7 + sh*870.));
  vec2 q = d.xz/(up + .3)*1.5;
  float wv = vnoise(vec2(q.x*.8 + uTime*.025, q.y*.3 - uTime*.011));
  float band = pow(1. - abs(sin(q.x*2.1 + wv*5.5 + q.y*.5)), 5.), rays = .45 + .55*vnoise(vec2(q.x*13. + wv*5., uTime*.4));
  // (curtains from 3 degrees over the horizon to near the zenith)
  float hg = smoothstep(.05, .2, up)*(1. - smoothstep(.72, .98, up));
  vec3 aur = hg*band*rays*(vec3(.1, 1., .48) + vec3(.5, .14, .8)*smoothstep(.3, .75, up))*1.5;
  col += (sunAdd + w4(uStarH, k)*star*vec3(.8, .9, 1.)*1.7 + w4(uAurH, k)*aur)*(1. - cl);
  col = mix(col, cc, cl);
  // the storm's fire inside its own cloud
  vec3 fd = normalize(uFlashPos - E);
  col += uFlashCol*uFlashAmt*w.x*(.07 + .6*pow(max(dot(d, fd), 0.), 4.))*(.35 + .65*cl)*(.25 + 1.5*smoothstep(.25, .8, n)*(.5 + n2));
  // the horizon's haze is the fog of that place; below the horizon the same
  col = mix(col, hor, pow(clamp(1. - up, 0., 1.), 9.)*.92);
  col = mix(col, hor*.85, (1. - smoothstep(-.1, 0., d.y)));
  gl_FragColor = vec4(col, 1.);
}`}),y=new z.Mesh(new z.SphereGeometry(100,32,20),w);return y.name="sky",y.renderOrder=-1,y.frustumCulled=!1,{mesh:y,material:w,uniforms:a,setSky:(s,m)=>{m.cloudLit&&a.uCloudLitH.value[s].set(...m.cloudLit),m.cloudShade&&a.uCloudShadeH.value[s].set(...m.cloudShade),a.uDiscH.value[s].set(...m.disc||[0,0,0]),a.uDiscDirH.value[s].copy(m.discDir||f.uSunDirH.value[s]).normalize(),a.uCovH.value.setComponent(s,m.cov??.3),a.uScatH.value.setComponent(s,m.scat??0),a.uDiscSizeH.value.setComponent(s,m.discSize??1),a.uStarH.value.setComponent(s,m.stars??0),a.uAurH.value.setComponent(s,m.aurora??0)}}}function Jt(f){return new z.ShaderMaterial({uniforms:{...f},side:z.DoubleSide,vertexShader:`attribute vec3 color; varying vec3 vCol, vN, vW;
varying float vFd;
void main(){
  vec4 wp = modelMatrix*vec4(position, 1.); vW = wp.xyz; vN = normalize(mat3(modelMatrix)*normal); vCol = color;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  vFd = -mvPosition.z;
}`,fragmentShader:`${ct}
varying vec3 vCol, vN, vW;
varying float vFd;
void main(){
${vt}
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  float shade = mix(1., sunReach(vW), PL.shadeK);
  float dif = clamp(dot(N, uSunDir), 0., 1.);
  vec3 c = vCol*(uSunCol*dif*shade + mix(uGndCol, uSkyCol, N.y*.5 + .5));
  c += vCol*uFlashCol*uFlash*(.3 + .7*clamp(dot(N, uFlashDir), 0., 1.));
  c += vCol*smallLights(vW, N);
  // (a face whose colour is over 1.5 in red gives light of its own: a lit window)
  c = mix(c, vCol*.55, step(1.5, vCol.r));
  gl_FragColor = vec4(c, 1.);
  gl_FragColor.rgb = placeFog(gl_FragColor.rgb, PL, vFd);
}`})}function Xt(f,n,a={}){const w=n.length,y=new z.InstancedBufferGeometry;y.setAttribute("position",new z.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),y.setIndex([0,1,2,0,2,3]);const C=new Float32Array(w*4),s=new Float32Array(w*4),m=new Float32Array(w*4);let h=0,v=0,l=0,p=0;n.forEach((t,c)=>{C.set([t.p[0],t.p[1],t.p[2],t.size],c*4),s.set([t.v[0],t.v[1],t.v[2],t.grow??1.5],c*4),m.set([t.per,t.ph,t.life,(t.a??.5)+Math.floor((t.tone??0)*8)*2],c*4),h+=t.p[0]/w,v+=t.p[1]/w,l+=t.p[2]/w}),n.forEach(t=>{p=Math.max(p,Math.hypot(t.p[0]-h,t.p[1]-v,t.p[2]-l)+t.size*4+Math.hypot(t.v[0],t.v[1],t.v[2])*t.life)}),y.setAttribute("iP",new z.InstancedBufferAttribute(C,4)),y.setAttribute("iV",new z.InstancedBufferAttribute(s,4)),y.setAttribute("iT",new z.InstancedBufferAttribute(m,4)),y.instanceCount=w,y.boundingSphere=new z.Sphere(new z.Vector3(h,v,l),p||1);const u={value:1},o=new z.ShaderMaterial({uniforms:{...f,uAmount:u,uShade:{value:new z.Color(a.shade||"#8fa3c0")},uTint:{value:new z.Color(a.tint||"#ffffff")}},transparent:!0,depthWrite:!1,vertexShader:`uniform float uTime; attribute vec4 iP, iV, iT; varying vec2 vUv; varying vec4 vK; varying vec3 vW; varying float vNear;
varying float vFd;
void main(){
  float age = mod(uTime + iT.y, max(iT.x, .01)), k = clamp(age/max(iT.z, .01), 0., 1.), live = step(age, iT.z);
  float size = iP.w*(1. + iV.w*k)*live;
  vec3 c = iP.xyz + iV.xyz*age; vW = c;
  vec4 mvPosition = viewMatrix*vec4(c, 1.);
  // a medium's law: it fades only inside 0.6 to 2.5 m of the lens (no step, nothing else read)
  vNear = smoothstep(.6, 2.5, length(mvPosition.xyz));
  mvPosition.xy += position.xy*size;
  vUv = position.xy; float tone = floor(iT.w*.5)/8.;
  vK = vec4(k, fract(iT.w*.5)*2., tone, fract(iP.x*.37 + iP.z*.71)*40.);
  gl_Position = projectionMatrix*mvPosition;
  vFd = -mvPosition.z;
}`,fragmentShader:`${ct}
uniform float uAmount; uniform vec3 uShade, uTint; varying vec2 vUv; varying vec4 vK; varying vec3 vW; varying float vNear;
${wt.GLSL_NOISE}
varying float vFd;
void main(){
${vt}
  float r = length(vUv); if (r > 1.) discard;
  float k = clamp(vK.x, 0., 1.);
  float body = 1.-smoothstep(.25, 1., r);
  float n = vnoise(vUv*1.7 + vK.w + vec2(0., -k*.8))*.6 + vnoise(vUv*4.1 - vK.w)*.4;
  float a = clamp(body*smoothstep(.18 + .3*k, .75, n + body*.55), 0., 1.)*smoothstep(0., .12, k)*(1.-k)*(1.-k*.4)*vK.y*uAmount*vNear;
  // lit from above by the sky and the sun, shaded below
  float up = clamp(vUv.y*.5 + .5 + (n - .5)*.5, 0., 1.);
  vec3 light = uSkyCol*1.05 + uSunCol*(.25 + .45*up) + uFlashCol*uFlash*.8;
  vec3 c = mix(uTint, uShade, clamp(vK.z + (1.-up)*.35, 0., 1.))*light;
  gl_FragColor = vec4(c, a);
  gl_FragColor.rgb = placeFog(gl_FragColor.rgb, PL, vFd);
}`}),r=new z.Mesh(y,o);return r.renderOrder=a.renderOrder??3,r.name=a.name||"puffs",{mesh:r,amount:u,count:w}}function Yt(f,n={}){return new z.ShaderMaterial({uniforms:{...f,uDeep:{value:new z.Color(n.deep||"#0a1a2c")},uBandW:{value:n.band??.12},uRipple:{value:n.ripple??1},uFoam:{value:n.foam??1},uFireK:{value:n.fire??1}},transparent:!0,depthWrite:!1,vertexShader:`attribute float aShore; varying float vShore; varying vec3 vW;
varying float vFd;
void main(){ vec4 wp = modelMatrix*vec4(position, 1.); vW = wp.xyz; vShore = aShore; vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  vFd = -mvPosition.z;
}`,fragmentShader:`${ct}
uniform vec3 uDeep; uniform float uBandW, uRipple, uFoam, uFireK; varying float vShore; varying vec3 vW;
${wt.GLSL_NOISE}
varying float vFd;
void main(){
${vt}
  vec3 V = cameraPosition - vW; float dist = max(length(V), .01); V /= dist;
  // ripples of two sizes, driven two ways; they flatten with distance so the far water is calm glass, never streaks
  float fl = 1./(1. + dist*.012);
  vec2 q = vW.xz, t = uTime*vec2(.5, .32);
  vec3 a = vnoised(q*.42 + t), b = vnoised(q*1.35 - t*1.6 + 7.), c = vnoised(q*.09 + t*.2);
  vec2 slope = (a.yz*.55 + b.yz*.3*fl + c.yz*.5)*uRipple*.5*(.35 + .65*fl);
  vec3 N = normalize(vec3(-slope.x, 1., -slope.y));
  float ndv = clamp(dot(N, V), 0., 1.), fres = .03 + .97*pow(1.-ndv, 5.);
  vec3 Rr = reflect(-V, N); float up = clamp(Rr.y, 0., 1.);
  vec3 uZen = mixH(uZenH[0], uZenH[1], uZenH[2], uZenH[3], PL.k), uHor = PL.fogCol;
  vec3 sky = mix(uHor, uZen, pow(up, .45));
  // the far shore's dark mirror lies in the low part of the reflection
  sky = mix(uHor*.45, sky, smoothstep(uBandW*.5, uBandW*1.6, up + (a.x - .5)*.04));
  float glint = pow(clamp(dot(Rr, uSunDir), 0., 1.), 220.)*3. + pow(clamp(dot(Rr, uSunDir), 0., 1.), 24.)*.2;
  // night water under the storm is never a black sheet: it mirrors the lighter bands of the storm's roof, and its wave
  // crests are pale (only where the storm stands: 1 - k.x)
  float st = 1. - PL.k.x;
  sky *= 1. + st*1.6*smoothstep(.3, .75, vnoise(Rr.xz/max(Rr.y, .1)*.9 + uTime*.012));
  vec3 col = mix(uDeep*(uSkyCol*.8 + uSunCol*.25), sky, fres) + uSunCol*glint;
  col += st*uSkyCol*.34*smoothstep(.6, .92, a.x*.6 + b.x*.4 + .12*c.x)*(.3 + .7*fl);
  // a small light's broken path on the water toward the eye (the fire on the shore, the ring): where a ripple's mirror
  // faces the light, less with the light's distance from that water
  vec3 tf = uFire.xyz - vW; float lf = max(length(tf), .01);
  col += uFireCol*(pow(max(dot(Rr, tf/lf), 0.), 120.)*1.3 + pow(max(dot(Rr, tf/lf), 0.), 28.)*.16)/(1. + lf*lf/8100.)*uFireK;
  vec3 tp = uPortal.xyz - vW; float lp = max(length(tp), .01);
  col += uPortalCol*(pow(max(dot(Rr, tp/lp), 0.), 90.)*1.1 + pow(max(dot(Rr, tp/lp), 0.), 20.)*.14)/(1. + lp*lp/6400.);
  // the flash: the whole sheet takes fire, brightest where the ripples face the bolt
  float fire = uFlash*uFireK*(.1 + .9*pow(clamp(dot(reflect(-V, normalize(vec3(-slope.x*2.5, 1., -slope.y*2.5))), uFlashDir), 0., 1.), 3.));
  col += uFlashCol*fire*(.3 + .5*fres);
  // white where it breaks on the shore, in ragged lines that come and go
  float sh = clamp(vShore, 0., 40.);
  float foam = (1.-smoothstep(.0, 1.6, sh - .5*a.x))*smoothstep(.35, .7, b.x + .25*sin(sh*2.2 - uTime*1.3))*uFoam;
  col = mix(col, (uSkyCol + uSunCol*.6)*.85, clamp(foam, 0., 1.));
  float alpha = smoothstep(0., .5, sh)*(.72 + .28*fres);
  gl_FragColor = vec4(col, clamp(alpha + foam, 0., 1.));
  gl_FragColor.rgb = placeFog(gl_FragColor.rgb, PL, vFd);
}`})}const kt=T("#5c636a"),St=T("#787b7e"),Ft=T("#7d7166");function Qt(f,n,a,w){const y=w.kind==="dome",C=w.rings??(y?16:11),s=w.seg??(y?34:16),m=n.int(4,7),h=n.range(0,O),v=n.range(0,90),l=y?0:.3*n.range(-.18,.18),p=n.range(0,O),u=w.snowLine??(y?.3:.9),o=[];for(let t=0;t<=C;t++){const c=t/C,g=y?Math.pow(c,1.25):Math.pow(c,1.6);for(let e=0;e<s;e++){const i=e/s*O+(t&1)*Math.PI/s,d=Math.pow(Math.abs(Math.sin(i*m/2+h)),.7),H=w.R*g*(1+(y?.12:.3)*(d-.5)+.16*a.n2(Math.cos(i)*1.7+v,Math.sin(i)*1.7+c*2)),P=y?Math.pow(1-Math.pow(Math.min(1,g),1.9),.62):Math.pow(1-g,1.35)*(.86+.28*d)+.1*(1-g)*a.n2(i*3+v,c*5),k=w.y0+w.H*Math.max(0,P)*(1+(t>0?.05*a.n2(Math.cos(i)*4+v,Math.sin(i)*4+c*7):0)),M=w.x+Math.cos(i)*H+Math.cos(p)*l*(k-w.y0),x=w.z+Math.sin(i)*H+Math.sin(p)*l*(k-w.y0),A=(k-w.y0)/w.H,D=y?q(.42,.6,a.n2(i*2.2+v,A*6.5))*(1-q(.55,.85,A)):0,b=y?Y(q(u-.12,u+.1,A)*(1-.85*D)+.25*(1-d),0,1):Y(q(u-.5,u,A)*.3+.5*q(.55,.9,a.n2(i*4+v,A*9))*(1-d),0,1),S=R(R(kt,St,a.n2(i*3+v,A*4)*.5+.5),Ft,w.warm??.2);o.push(f.v(M,k,x,R(S,Z,b),0,b,0))}}let r=C;if(!y){r=C+1;for(let t=0;t<s;t++){const c=t/s*O+(r&1)*Math.PI/s,g=w.R*1.5*(1+.14*a.n2(Math.cos(c)*2.3+v,Math.sin(c)*2.3)),e=.3+.3*a.n2(c*3+v,1.7);o.push(f.v(w.x+Math.cos(c)*g,w.y0-.1*w.H,w.z+Math.sin(c)*g,R(yt,Z,Y(e,0,1)*.6),0,Y(e,0,1)*.6,0))}}for(let t=0;t<r;t++)for(let c=0;c<s;c++){const g=o[t*s+c],e=o[t*s+(c+1)%s],i=o[(t+1)*s+c],d=o[(t+1)*s+(c+1)%s];t&1?(f.tri(g,d,i),f.tri(g,e,d)):(f.tri(g,e,i),f.tri(e,d,i))}}function te(f,n,a,w,y){const C=y.levels??11,s=w.length,m=[],h=n.range(0,90);for(let v=0;v<s;v++){const l=w[v],p=w[Math.max(0,v-1)],u=w[Math.min(s-1,v+1)];let o=u[0]-p[0],r=u[1]-p[1];const t=Math.hypot(o,r)||1;o/=t,r/=t;const c=r,g=-o,e=Math.min(1,v/3,(s-1-v)/3),i=y.H(v)*(.35+.65*q(0,1,e))*(1+.16*a.n2(v*.31+h,3.3)),d=[];{const H=9*a.n2(v*.42+h,0)+4*a.n2(v*1.1,h)+14,P=.5+.5*a.n2(v*.7+h,9.3);d.push(f.v(l[0]+c*(H+26+8*P),l[2]+1.5,l[1]+g*(H+26+8*P),R(yt,at,.3+.3*P),.3,.1,.6)),d.push(f.v(l[0]+c*(H+9),l[2]+10+5*P,l[1]+g*(H+9),R(yt,kt,.4*P),0,.12*P,0))}for(let H=1;H<=C;H++){const P=Math.min(1,H/(C-2)),k=Math.max(0,H-(C-2))/2,x=9*a.n2(v*.42+h,P*1.6)+4*a.n2(v*1.1,P*5+h)+14*Math.pow(1-P,2.2)-P*10-k*y.depth,A=l[2]+(k>0?i*(1+.12*k)+30*k:i*P),D=q(.5,.8,a.n2(v*.5+h,P*7))*.55+(k>0?.75:0),b=R(R(St,Ft,.45+.4*a.n2(v*.2+h,P*2.4)),kt,.5*a.n2(v*.9,P*11)+.3);d.push(f.v(l[0]+c*x,A,l[1]+g*x,R(b,Z,D),0,D,0))}m.push(d)}for(let v=0;v<s-1;v++)for(let l=0;l<m[v].length-1;l++)f.quad(m[v][l],m[v][l+1],m[v+1][l+1],m[v+1][l])}function ee(f,n){const a=()=>{const e=n.range(.8,1.15),i=R(T("#55554f"),T("#6b655a"),n());return[i[0]*e,i[1]*e,i[2]*e]},w=T("#aeb6bd"),y=T("#0d0d10"),C=(e,i,d,H)=>{const P=Math.hypot(i[0]-e[0],i[1]-e[1]),k=Math.atan2(i[0]-e[0],i[1]-e[1]),M=Math.max(2,Math.round(P/3.2));for(let x=0;x<M;x++){const A=(x+.5)/M,D=d*(H?Y(1-H*(.3+.7*Math.abs(Math.sin(x*1.7+H*9))),.25,1):1)+(x%2?.9:0);f.box(K(e[0],i[0],A),D/2-1,K(e[1],i[1],A),.7,D/2+1,P/M/2+.02,a(),k,0,w)}},s=(e,i,d,H,P)=>{const k=a();if(f.cyl([e,-3,i],[e,H,i],d*1.06,d,9,k,k),P)for(let M=0;M<5;M++){const x=n.range(0,O),A=n.range(1,5.5);f.box(e+Math.cos(x)*d*.62,H+A/2,i+Math.sin(x)*d*.62,d*.42,A/2,d*.3,a(),-x,0,w)}else{f.cyl([e,H,i],[e,H+1.6,i],d*1.16,d*1.16,9,a(),w);for(let M=0;M<8;M+=2){const x=M/8*O+.3;f.box(e+Math.cos(x)*d*1.05,H+2.2,i+Math.sin(x)*d*1.05,.55,.65,.45,a(),-x,0,w)}}for(let M=0;M<2;M++){const x=n.range(0,O);f.box(e+Math.cos(x)*d*1,H*n.range(.45,.8),i+Math.sin(x)*d*1,.28,.75,.12,y,Math.PI/2-x)}},m=n.range(13,16),h=5,v=[];for(let e=0;e<h;e++){const i=e/h*O+n.range(-.2,.2)+.3,d=m*n.range(.82,1.1);v.push([Math.cos(i)*d,Math.sin(i)*d])}const l=v.map(()=>4+.28*n.range(13,20));l[n.int(0,h-1)]=4+.28*n.range(22,26);const p=n.int(0,h-1);for(let e=0;e<h;e++){const i=e===p||n.chance(.3)?n.range(.5,.9):.42;C(v[e],v[(e+1)%h],.75*n.range(7,9.5),i),n.chance(.25),s(v[e][0],v[e][1],n.range(2.6,3.6),l[e],!0)}const u=n.range(4,5),o=n.range(3.6,4.4),r=.45*n.range(21,25),t=n.range(-2,2),c=n.range(-3,1),g=a();f.box(t,r/2-1.5,c,u,r/2+1.5,o,g,.2,0,w);for(let e=0;e<4;e++)f.box(t+(e%2?1:-1)*u*.5,r+n.range(.5,2.2),c+(e<2?1:-1)*o*.5,u*.42,n.range(.6,2.4),o*.4,a(),.2,0,w);for(let e=0;e<5;e++)f.box(t+n.range(-.6,.6)*u,r*n.range(.3,.85),c+o*1.02,.3,.9,.1,y,.2);return{radius:m*1.1+3.6,height:Math.max(r+4,...l)+3}}function oe(f,n,a,w,y,C,s,m){const h=Math.cos(y),v=Math.sin(y),l=(i,d,H)=>[n+i*h+H*v,a+d,w-i*v+H*h],p=T("#6f6558"),u=T("#877c6c"),o=T("#4a4640"),r=T("#dfe6ee"),t=T("#17140f");f.box(n,a+m/2-.6,w,C/2,m/2+.6,s/2,p,y,0,u);const c=.42*C,g=.5;for(const i of[-1,1]){const d=l(i*(C/2+g),m-.15,-s/2-g),H=l(i*(C/2+g),m-.15,s/2+g),P=l(0,m+c,s/2+g),k=l(0,m+c,-s/2-g);i>0?f.quad(d,k,P,H,o,r):f.quad(H,P,k,d,o,r);const M=l(-C/2,m,i*s/2),x=l(C/2,m,i*s/2),A=l(0,m+c-.1,i*s/2);i>0?f.tri(M,x,A,u):f.tri(x,M,A,u)}{const i=l(C/2+.03,.95,-s*.2);f.box(i[0],i[1],i[2],.05,.95,.5,t,y);const d=l(C/2+.03,1.5,s*.22);f.box(d[0],d[1],d[2],.05,.4,.45,t,y)}const e=l(0,m+c+.5,s/2-.7);return f.box(e[0],e[1]-.6,e[2],.4,1,.4,p,y,0,t),[e[0],e[1]+.5,e[2]]}function ae(f,n={}){const a=n.width??3,w=n.height??9,y=n.sheets??4,C=[],s=[],m=[];for(let p=0;p<y;p++){const u=p/y*Math.PI,o=Math.cos(u)*a/2,r=Math.sin(u)*a/2,t=C.length/3;C.push(-o,0,-r,o,0,r,o,w,r,-o,w,-r),s.push(-1,0,p,1,0,p,1,1,p,-1,1,p),m.push(t,t+1,t+2,t,t+2,t+3)}const h=new z.BufferGeometry;h.setAttribute("position",new z.Float32BufferAttribute(C,3)),h.setAttribute("aUv",new z.Float32BufferAttribute(s,3)),h.setIndex(m),h.computeBoundingSphere();const v=new z.ShaderMaterial({uniforms:{uTime:f.uTime},transparent:!0,depthWrite:!1,blending:z.AdditiveBlending,side:z.DoubleSide,vertexShader:"attribute vec3 aUv; varying vec3 vUv; void main(){ vUv = aUv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }",fragmentShader:`uniform float uTime; varying vec3 vUv;
${wt.GLSL_NOISE}
void main(){
  float x = vUv.x, y = vUv.y, sd = vUv.z*3.7;
  float n = vnoise(vec2(x*2.1 + sd, y*2.6 - uTime*2.8))*.6 + vnoise(vec2(x*5.3 - sd, y*6. - uTime*4.6))*.4;
  // a tongue: widest at the foot, narrowing and breaking toward its tip, swaying
  float sway = (vnoise(vec2(sd, uTime*.9 + y*1.3)) - .5)*.7*y;
  float half_ = (1. - y*(.72 + .5*n))*(.5 + .5*n);
  float hw_ = max(half_, .002), body = 1. - smoothstep(hw_*.3, hw_, abs(x - sway));
  float a = clamp(body*(1. - smoothstep(.5, 1., y + (1. - n)*.5))*smoothstep(0., .05, y), 0., 1.);
  vec3 col = mix(vec3(1., .46, .07), vec3(1., .93, .62), (1. - smoothstep(0., .5, y + abs(x - sway)*.7)));
  col = mix(col, vec3(1., .2, .03), smoothstep(.45, 1., y));
  gl_FragColor = vec4(col*a*(o_k), a);
}`.replace("o_k",(n.gain??1.5).toFixed(2))}),l=new z.Mesh(h,v);return l.name=n.name||"flame",l.renderOrder=4,{mesh:l}}function ne(f,n){const a=T("#0e0c0b"),w=T("#c8b287"),y=T("#6b5234");f.cyl([0,-.6,0],[0,1.5,0],1.25,.95,9,a,R(a,y,.4)),f.cyl([0,1.5,0],[.15,2.5,.1],.95,.7,9,R(a,y,.5),a);for(let C=0,s=n.int(16,22);C<s;C++){const m=n.range(0,O),h=n.range(.15,.7),v=n.range(1.4,5.2),l=n.range(.1,.95),p=n.range(.1,.3),u=[Math.cos(m)*h,2.3+n.range(-.3,.3),Math.sin(m)*h],o=[u[0]+Math.cos(m)*v*l*.4,u[1]+v*.55,u[2]+Math.sin(m)*v*l*.4],r=[o[0]+Math.cos(m+n.range(-.5,.5))*v*l*.6,o[1]+v*(.45-l*.7),o[2]+Math.sin(m+n.range(-.5,.5))*v*l*.6];f.band(u,o,p,w,[Math.cos(m),0,Math.sin(m)]),f.band(o,r,p*.7,R(w,a,n.range(.2,.8)),[Math.cos(m),0,Math.sin(m)])}for(let C=0,s=n.int(10,14);C<s;C++){const m=n.range(0,O),h=n.range(1.6,7.5),v=n.range(.8,3.2),l=m+n.range(-1.2,1.2);f.band([Math.cos(m)*h,.12,Math.sin(m)*h],[Math.cos(m)*h+Math.cos(l)*v,.2+n.range(0,.5),Math.sin(m)*h+Math.sin(l)*v],n.range(.12,.3),R(w,y,n()),[0,1,0])}return{top:[.1,2.6,.05]}}function se(f,n,a,w,y=3){const C=Ct(),s=[1,1,1],m=(h,v,l,p)=>{let u=[h,v];const o=Math.hypot(v[0]-h[0],v[1]-h[1],v[2]-h[2]);for(let r=0,t=o*.11;r<4;r++,t*=.52){const c=[u[0]];for(let g=0;g<u.length-1;g++){const e=u[g],i=u[g+1];c.push([(e[0]+i[0])/2+f.range(-t,t),(e[1]+i[1])/2+f.range(-t,t)*.4,(e[2]+i[2])/2+f.range(-t,t)],i)}u=c}for(let r=0;r<u.length-1;r++){const t=1-.5*r/u.length;C.band(u[r],u[r+1],l*t,s,[1,0,.2]),C.band(u[r],u[r+1],l*t,s,[.2,0,1])}if(p>0)for(let r=0;r<y;r++){const t=f.int(2,u.length-4),c=u[t],g=o*f.range(.15,.4),e=f.range(0,O);m(c,[c[0]+Math.cos(e)*g*.7,c[1]-g*.75,c[2]+Math.sin(e)*g*.7],l*.5,p-1)}};return m(n,a,w,1),C.build()}async function It(f,n,a,w,y=9,C=null){const s={},m=[];let h=null;for(let g=0,e=0;g<=w;g+=.25,e++){C&&e%160===159&&await C.yield(),a(g,s);const i=n.cutDepth(s.x,s.s,n.swOf(s.x,s.s))>.01;i&&!h&&(h=[g-1.1,g]),i&&h&&(h[1]=g+1.1),!i&&h&&g>h[1]&&(m.push(h),h=null)}h&&m.push(h);const v=g=>{for(const e of m){if(g>e[0]&&g<e[1])return e;if(g-w>e[0]&&g-w<e[1])return[e[0]+w,e[1]+w]}return null},l=v(0),p=l?l[1]:0,u=[p];let o=p;for(;o<p+w-y*1.45;){let g=o+y*f.range(.9,1.1);const e=v(g);e&&(g=e[0]-o>=3.5?e[0]:e[1]),u.push(g),o=g}u.push(p+w);const r=u.map(g=>(a(g%w,s),n.surfAt(s.x,-s.s))),t=u.map((g,e)=>{const i=(u[e+1]??g+y)-g;return .25+.012*i*i});return r[r.length-1]=r[0],{at:(g,e)=>{const i=((g-p)%w+w)%w+p;let d=0,H=u.length-1;for(;H-d>1;){const x=d+H>>1;u[x]<=i?d=x:H=x}const P=(i-u[d])/(u[H]-u[d]);a((i+1.5)%w,s);const k=s.x,M=s.s;return a(i%w,s),e.x=s.x,e.z=-s.s,e.s=s.s,e.y=K(r[d],r[H],P),e.yaw=Math.atan2(k-s.x,-(M-s.s)),e.c=d+P,e.fly=P,e.rise=t[d],e.len=u[H]-u[d],e},footfalls:u,heights:r,rifts:m,f0:p,Q:w}}function Gt(f=2.5,n=30,a=1.15,w=1300){const y=[];let C=f,s=0;for(;s<w;)y.push(s),s>=n&&(C*=a),s+=C;return y.push(w),y.slice(1).reverse().map(m=>-m).concat(y)}async function ie(f,n={}){const a=!n.field,w=n.U||At(),y=f.rng,C=f.noise,s=n.streams||{rifts:y.fork("rifts"),leads:y.fork("leads"),floes:y.fork("floes"),figure:y.fork("figure")},m=n.field||{noise:C,dens:1,offs:Gt(2.5,30,1.2,420),s0:0,sGate:250,sBreak:330,sEdge:420,floeHalf:0,rim:10,route:()=>0,axis:()=>0,level:o=>22+.03*Y(o,0,250),inside:(o,r)=>r>250?400:Math.min(150-Math.abs(o)+Math.max(0,r-200)*3,r+6-o/150*(o/150)*50),land:(o,r,t)=>{t.x=o,t.z=r,t.y=Math.max(0,Math.abs(o)-150)*.9+3*C.n2(o*.02,r*.02),t.c=R(kt,St,.5+.5*C.n2(o*.05,r*.05)),t.ice=0,t.snow=0,t.depth=0}};if(a){const o=m.offs;m.floeHalf=o.find(r=>r>=90)}const h=new z.Group,v=await _t(f,w,m,s);h.add(v.mesh),await f.yield();const l=await Vt(f,w,m,s.floes,n.keep||null);h.add(l.mesh);const p=Rt(w,{cloak:!0});h.add(p.mesh),await f.yield();let u=()=>{};if(a){for(let e=0;e<4;e++)Wt(w,e,{sunDir:new z.Vector3(-.6,.55,-.4),sun:[1,.9,.75],sky:[.2,.28,.46],gnd:[.13,.17,.22],fog:[.33,.5,.75],zen:[.02,.08,.4],fogDen:4e-4});const o=new z.Mesh(new z.PlaneGeometry(900,300).rotateX(-Math.PI/2),new z.MeshBasicMaterial({color:"#05090f"}));o.position.set(0,l.sea,-m.sBreak-100),h.add(o);const r=400+O*14,t=(e,i)=>{if(e<200)i.x=-14,i.s=35+e;else if(e<200+Math.PI*14){const d=(e-200)/14;i.x=-14*Math.cos(d),i.s=235+14*Math.sin(d)}else if(e<400+Math.PI*14)i.x=14,i.s=235-(e-200-Math.PI*14);else{const d=(e-400-Math.PI*14)/14;i.x=14*Math.cos(d),i.s=35-14*Math.sin(d)}},c=await It(s.figure,v,t,r,8,f),g={};h.position.set(0,-m.level(0),200),u=(e,i)=>{w.uTime.value=i,w.uOpen.value=.5+.5*Math.sin(i*.3),w.uSwell.value=1,c.at(i*16,g),p.mesh.position.set(g.x,g.y,g.z),p.mesh.rotation.y=g.yaw,p.pose({c:g.c,fly:g.fly,rise:g.rise,time:i})}}return{object:h,radius:150,height:40,center:new z.Vector3(0,12,60),anchors:{},ground:!1,U:w,field:m,sea:v,floes:l,figure:p,update:u,dispose(){}}}export{Ut as archInto,Tt as blockInto,se as boltGeometry,ie as buildHero,ee as castleInto,T as col3,oe as cottageInto,Dt as makeAcc,Rt as makeFigure,ae as makeFlame,Vt as makeFloes,_t as makeIceSea,Ht as makeLandMaterial,At as makeLightUniforms,Ct as makeProp,Jt as makePropMaterial,Xt as makePuffs,It as makeRound,Zt as makeShip,jt as makeSkyDome,$t as makeSledge,Yt as makeWaterMaterial,R as mix3,Qt as peakInto,Ot as raftInto,Wt as setHour,Nt as stripMesh,Gt as stripOffsets,ne as stumpInto,Kt as towerInto,te as wallInto};
