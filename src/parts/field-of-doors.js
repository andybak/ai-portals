import*as o from"three";import{mergeGeometries as Ge}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as Ae,lerp as ue,smoothstep as Ne}from"../kit/core.js";const We=["#1a1440","#5a3f8a","#e88a6a","#ffd9a0","#3a3a4a","#14141c","#ffffff"],F=125,Z=400,ae=38,Q=17,O=2.4,me=9,fe=48,N={STONE:0,WOOD:1,BRONZE:2,GLOW:3},Ke=new o.Vector3,Qe=new o.Vector3,Ie=new o.Vector3,ne=new o.Vector3;function xe(){const e=[],f=[],t={pos:e,nor:f,tri(a,g,i,c){ne.subVectors(g,a).cross(Ie.subVectors(i,a));const r=ne.length();if(!(r<1e-9)){if(ne.multiplyScalar(1/r),c&&ne.dot(c)<0){const m=g;g=i,i=m,ne.negate()}e.push(a.x,a.y,a.z,g.x,g.y,g.z,i.x,i.y,i.z);for(let m=0;m<3;m++)f.push(ne.x,ne.y,ne.z)}},quad(a,g,i,c,r){t.tri(a,g,i,r),t.tri(a,i,c,r)},geo(){const a=new o.BufferGeometry;return a.setAttribute("position",new o.Float32BufferAttribute(e,3)),a.setAttribute("normal",new o.Float32BufferAttribute(f,3)),a}};return t}function V(e,f,t,a=.6,g=1,i=g){const c=e/2,r=f/2,m=t/2;a=Math.min(a,c*.49,r*.49,m*.49);const d=xe(),u=(y,s,p,x)=>{const S=new o.Vector3(y*(c-(x===0?0:a)),s*(r-(x===1?0:a)),p*(m-(x===2?0:a)));return s>0&&(S.x*=g,S.z*=i),S},w=(...y)=>{const s=new o.Vector3;for(const p of y)s.add(p);return s.multiplyScalar(1/y.length)},M=[-1,1];for(let y=0;y<3;y++)for(const s of M){const p=[];for(const S of M)for(const P of M){const n=y===0?s:S,z=y===1?s:y===0?S:P,W=y===2?s:P;p.push(u(n,z,W,y))}const x=new o.Vector3(y===0?s:0,y===1?s:0,y===2?s:0);d.quad(p[0],p[1],p[3],p[2],x)}for(let y=0;y<3;y++){const s=(y+1)%3,p=(y+2)%3;for(const x of M)for(const S of M){const P=U=>{const I=[0,0,0];return I[y]=U,I[s]=x,I[p]=S,I},n=P(-1),z=P(1),W=u(n[0],n[1],n[2],s),A=u(z[0],z[1],z[2],s),E=u(n[0],n[1],n[2],p),k=u(z[0],z[1],z[2],p);d.quad(W,A,k,E,w(W,A,E,k))}}for(const y of M)for(const s of M)for(const p of M){const x=u(y,s,p,0),S=u(y,s,p,1),P=u(y,s,p,2);d.tri(x,S,P,w(x,S,P))}return d.geo()}function oe(e,f,t,a,g=!1,i=!0){const c=xe(),r=f.length,m=[],d=new o.Vector3,u=g?r:r-1;for(let s=0;s<u;s++)d.subVectors(f[(s+1)%r],f[s]).normalize(),m.push(new o.Vector3().crossVectors(t,d).normalize());const w=[];for(let s=0;s<r;s++){const p=m[g?(s-1+u)%u:Math.max(0,s-1)],x=m[g?s%u:Math.min(u-1,s)],S=new o.Vector3().addVectors(p,x).normalize();S.multiplyScalar(1/Math.max(.3,S.dot(p))),w.push(S)}const M=(s,p)=>new o.Vector3().copy(f[s]).addScaledVector(w[s],e[p][0]).addScaledVector(t,e[p][1]),y=new o.Vector3;for(let s=0;s<u;s++){const p=(s+1)%r;for(let x=0;x<e.length-1;x++){const S=e[x+1][0]-e[x][0];let n=e[x+1][1]-e[x][1],z=-S;const W=(e[x][0]+e[x+1][0])/2-a[0],A=(e[x][1]+e[x+1][1])/2-a[1];n*W+z*A<0&&(n=-n,z=-z),y.set(0,0,0).addScaledVector(m[s],n).addScaledVector(t,z),c.quad(M(s,x),M(p,x),M(p,x+1),M(s,x+1),y)}}if(!g&&i)for(const[s,p]of[[0,-1],[r-1,1]]){d.subVectors(f[s===0?1:r-1],f[s===0?0:r-2]).normalize().multiplyScalar(p);const x=new o.Vector3().copy(f[s]).addScaledVector(w[s],a[0]).addScaledVector(t,a[1]);for(let S=0;S<e.length-1;S++)c.tri(x,M(s,S),M(s,S+1),d)}return c.geo()}const we=(e,f,t,a=0,g=0)=>[new o.Vector3(a+e,t,g+f),new o.Vector3(a-e,t,g+f),new o.Vector3(a-e,t,g-f),new o.Vector3(a+e,t,g-f)],ze=(e,f,t,a,g)=>[new o.Vector3(t-e,a-f,g),new o.Vector3(t-e,a+f,g),new o.Vector3(t+e,a+f,g),new o.Vector3(t+e,a-f,g)],le=new o.Vector3(0,1,0),ve=new o.Vector3(0,0,1),Pe=new o.Vector3(0,0,-1);function Me(){const e=[],f=new o.Matrix4,t=new o.Quaternion,a=new o.Vector3(1,1,1),g=new o.Vector3,i=new o.Euler;return{list:e,add(c,r,m,d={}){let u=c.index?c.toNonIndexed():c.clone();u.getAttribute("uv")&&u.deleteAttribute("uv"),u.getAttribute("normal")||u.computeVertexNormals(),i.set(d.rx||0,d.ry||0,d.rz||0),t.setFromEuler(i),a.set(d.sx??d.s??1,d.sy??d.s??1,d.sz??d.s??1),g.set(d.x||0,d.y||0,d.z||0),u.applyMatrix4(f.compose(g,t,a));const w=u.getAttribute("position").count,M=new Float32Array(w*3),y=new Float32Array(w),s=d.shade??1,p=u.getAttribute("position");let x=1/0,S=-1/0;if(d.grad)for(let P=0;P<w;P++){const n=p.getY(P);n<x&&(x=n),n>S&&(S=n)}for(let P=0;P<w;P++){let n=s;d.grad&&(n*=1-d.grad*(1-(p.getY(P)-x)/Math.max(.001,S-x))),M[P*3]=r.r*n,M[P*3+1]=r.g*n,M[P*3+2]=r.b*n,y[P]=m}u.setAttribute("color",new o.BufferAttribute(M,3)),u.setAttribute("aMat",new o.BufferAttribute(y,1)),e.push(u)},build(){const c=Ge(e,!1);for(const m of e)m.dispose();e.length=0;const r=c.getAttribute("normal").array;for(let m=0;m<r.length;m+=3)r[m]*r[m]+r[m+1]*r[m+1]+r[m+2]*r[m+2]>1e-8||(r[m]=0,r[m+1]=1,r[m+2]=0);return c}}}const ge=`
float gdHash(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float gdNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(gdHash(i), gdHash(i + vec2(1., 0.)), f.x), mix(gdHash(i + vec2(0., 1.)), gdHash(i + vec2(1., 1.)), f.x), f.y); }
float gdFbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 5; i++){ s += a * gdNoise(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
`,pe=`
float gdFog(){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      return smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #else
    return 0.;
  #endif
}
`;function Be(e){const f=new o.MeshStandardMaterial({vertexColors:!0,roughness:.9,metalness:0});return f.onBeforeCompile=t=>{Object.assign(t.uniforms,e),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
        attribute float aMat; uniform mat4 uHeroInv;
        varying float vMat; varying vec3 vHP; varying vec3 vHN; varying vec3 vOP; varying vec3 vON;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        vMat = aMat; vOP = position; vON = normal;
        mat4 gdM = uHeroInv * modelMatrix; vHP = (gdM * vec4(position, 1.)).xyz; vHN = mat3(gdM) * normal; vHN = dot(vHN, vHN) > 1e-12 ? normalize(vHN) : vec3(0., 1., 0.);`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
        varying float vMat; varying vec3 vHP; varying vec3 vHN; varying vec3 vOP; varying vec3 vON;
        uniform vec3 uLight; uniform vec3 uSkyTop; uniform vec3 uSkyHor; uniform vec3 uWarm;
        uniform float uOpen; uniform float uTime; uniform float uFreeX; uniform float uLeafTan; uniform float uGapX; uniform float uSeed;
        ${ge}`).replace("#include <color_fragment>",`#include <color_fragment>
        float gdRough = .9, gdMetal = 0., gdH = 0.;
        vec3 gdAN = abs(vON);
        vec2 gdUV = gdAN.z > .55 ? vOP.xy : (gdAN.x > .55 ? vOP.zy : vOP.xz);
        float gdPix = length(fwidth(gdUV)) + 1e-4;
        if (vMat < .5) {            // ---- stone: ashlar courses, block tint, weather streaks
          bool flat_ = gdAN.y > .55;
          float ch = flat_ ? 3.2 : 2.4, bl = flat_ ? 4.4 : 5.6;
          // flagstones: courses of uneven height, every course its own length of flag, so the paving never reads as a grid
          float gy = flat_ ? gdUV.y + 1.5 * sin(gdUV.y * .11 + uSeed) + .9 * sin(gdUV.y * .31 + 2.) : gdUV.y;
          float row = floor(gy / ch);
          if (flat_) bl *= .55 + 1.1 * gdHash(vec2(row, uSeed + 5.));
          float uu = gdUV.x / bl + .5 * mod(row, 2.) + .37 * gdHash(vec2(row, uSeed));
          vec2 cell = vec2(floor(uu), row);
          vec2 f = vec2(fract(uu) * bl, fract(gy / ch) * ch);
          float d = min(min(f.x, bl - f.x), min(f.y, ch - f.y));
          if (flat_) d -= .16 * gdNoise(gdUV * 1.1) * (1. - smoothstep(.12, .5, gdPix));        // worn, chipped edges
          float vis = 1. - smoothstep(.12, .7, gdPix), visT = 1. - smoothstep(1., 3.6, gdPix);
          float mortar = (1. - smoothstep(.05, .14 + gdPix, d)) * vis;
          float bd = abs(fract(gdUV.y / (ch * 4.) + .5) - .5) * ch * 4.;
          float band = flat_ ? 0. : (1. - smoothstep(.1, .45 + gdPix, bd)) * (1. - smoothstep(1.2, 5., gdPix));
          float tint = gdHash(cell + uSeed);
          float big = gdFbm(gdUV * .012 + uSeed);
          float streak = gdFbm(vec2(gdUV.x * .09, gdUV.y * .008) + 3.7);
          float grit = gdNoise(gdUV * 5.) * vis;
          vec3 c = diffuseColor.rgb * (.76 + .42 * tint * visT + .1 * (1. - visT));
          c = mix(c, c * vec3(.74, .7, .95), smoothstep(.35, .8, big));          // violet lichen blooms
          c = mix(c, c * vec3(1.18, 1.05, .9), smoothstep(.55, .85, streak) * .6);  // pale warm runs
          c *= .9 + .2 * grit;
          c *= 1. - .3 * smoothstep(.45, .75, gdFbm(vec2(gdUV.x * .16 + 11., gdUV.y * .012)));   // dark rain stains
          c *= 1. - .5 * mortar; c *= 1. - .22 * band;
          if (!flat_) c *= .62 + .38 * smoothstep(0., 60., vHP.y);                // damp base
          else {
            float t2 = gdHash(cell + uSeed + 9.);                                  // each flag its own tone; a few dark replacements
            c *= mix(vec3(1.1, 1., .9), vec3(.86, .93, 1.12), t2) * (1. - .3 * step(.9, tint) * visT) * (.8 + .4 * gdFbm(gdUV * .05 + 3.));
            float rx = abs(vHP.x - 15.);                                           // a paler runner of stone leads to the slot, edged in dark
            float run = (1. - smoothstep(8.6, 8.9, rx)) * step(vHP.y, 3.) * step(-2., vHP.z);
            c = mix(c, c * vec3(1.32, 1.22, 1.08), run * .7); c *= 1. - .55 * (1. - smoothstep(.0, .45, abs(rx - 9.6))) * step(vHP.y, 3.) * step(-2., vHP.z);
            // scrape arc of the swinging leaf
            float r = length(vHP.xz - vec2(${F.toFixed(1)}, 0.));
            float arc = (1. - smoothstep(.6, 2.4, abs(r - ${(F-1.5).toFixed(1)}))) * step(0., vHP.z) * step(vHP.x, 124.) * step(vHP.y, 3.);
            c *= 1. - .4 * arc;
          }
          diffuseColor.rgb = c; gdRough = .86 + .12 * tint; gdH = -mortar * .5 + grit * .12;
        } else if (vMat < 1.5) {    // ---- wood: tall planks with grain
          float pw = 2.3, px = gdUV.x / pw, pid = floor(px);
          float e = abs(fract(px) - .5) * pw;
          float vis = 1. - smoothstep(.1, .55, gdPix), visT = 1. - smoothstep(.5, 2., gdPix);
          float groove = smoothstep(pw * .5 - .1 - gdPix, pw * .5 - .01, e) * vis * .6;
          float jy = (gdUV.y + gdHash(vec2(pid, 7.)) * 60.) / 29.;                 // butt joints break every plank into boards of their own tone
          float joint = (1. - smoothstep(.05, .14 + gdPix, (.5 - abs(fract(jy) - .5)) * 29.)) * vis;
          pid += 17. * floor(jy); groove = max(groove, joint * .7);
          float knot = smoothstep(.8, .93, gdNoise(vec2(gdUV.x * .9 + pid, gdUV.y * .22))) * vis;
          float grain = mix(gdFbm(gdUV * vec2(.11, .02) + 5.), gdFbm(vec2(gdUV.x * 5. + pid * 7.3, gdUV.y * .16 + pid * 3.1)), .25 + .45 * visT);
          float fine = gdNoise(vec2(gdUV.x * 30., gdUV.y * 1.1)) * vis;
          vec3 c = diffuseColor.rgb * (.82 + .32 * gdHash(vec2(pid, uSeed + 3.)) * visT + .16 * (1. - visT));
          c *= (.78 + .36 * grain + .12 * fine) * (1. - .4 * knot);
          c *= .88 + .24 * gdNoise(vec2(gdUV.x * .35, gdUV.y * 2.6)) * vis;         // saw marks across the grain
          c = mix(c, c * vec3(1.25, .95, .8), smoothstep(.6, .9, grain) * .35);
          c *= 1. - .6 * groove;
          c *= .7 + .3 * smoothstep(0., 45., vHP.y);
          diffuseColor.rgb = c; gdRough = .62 + .25 * grain; gdH = -groove * .45 + fine * .05;
        } else if (vMat < 2.5) {    // ---- bronze: patina in the hollows, polish on the highs
          float pat = gdFbm(vOP.xy * .11 + vOP.z * .3 + uSeed);
          vec3 c = diffuseColor.rgb * (.75 + .5 * gdNoise(vOP.xy * .9 + vOP.yz * .7));
          c = mix(c, vec3(.1, .26, .25), smoothstep(.52, .78, pat) * .55);
          float visB = 1. - smoothstep(.12, .7, gdPix);
          vec2 pg = gdUV / vec2(4.2, 2.1), pf = abs(fract(pg) - .5);
          float seam = smoothstep(.47, .492, max(pf.x, pf.y)) * visB * step(.9, gdAN.z);
          float rivet = (1. - smoothstep(.03, .05, length((pf - .43) * vec2(2., 1.)))) * visB * step(.9, gdAN.z);
          c *= 1. - .5 * seam; c += vec3(.12, .09, .04) * rivet;
          float lzA = abs(fract((gdUV.x + gdUV.y) / 7.) - .5), lzB = abs(fract((gdUV.x - gdUV.y) / 7.) - .5);
          float lat = smoothstep(.43, .47, max(lzA, lzB)) * (1. - smoothstep(.5, 2.2, gdPix)) * step(.9, gdAN.z);   // chased lozenges on the plates
          c *= 1. - .42 * lat; c *= .8 + .35 * smoothstep(.15, .4, min(lzA, lzB)) * (1. - smoothstep(.5, 2.2, gdPix));
          c *= .88 + .24 * gdNoise(gdUV * 2.3);
          diffuseColor.rgb = c; gdRough = .34 + .4 * pat; gdMetal = .55; gdH = -seam * .2 + rivet * .25;
        } else {                    // ---- glow parts: black body, all emissive
          diffuseColor.rgb = vec3(0.); gdRough = 1.;
        }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        roughnessFactor = gdRough;`).replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
        metalnessFactor = gdMetal;`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        {
          vec3 q0 = dFdx(-vViewPosition), q1 = dFdy(-vViewPosition);
          float hx = dFdx(gdH), hy = dFdy(gdH);
          vec3 r1 = cross(q1, normal), r2 = cross(normal, q0);
          float det = dot(q0, r1);
          vec3 g = sign(det) * (hx * r1 + hy * r2);
          vec3 gdNn = abs(det) * normal - g * 1.6; if (dot(gdNn, gdNn) > 1e-16) normal = normalize(gdNn);   // sliver triangles have no usable derivatives
        }`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
        { float gdS = gl_FragColor.r + gl_FragColor.g + gl_FragColor.b; if (!(gdS >= 0. && gdS < 1e6)) gl_FragColor = vec4(0., 0., 0., 1.); }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        {
          vec3 hn = normalize(vHN); vec3 p = vHP;
          float inY = 1. - smoothstep(${(O+Z-2).toFixed(1)}, ${(O+Z+2).toFixed(1)}, p.y);
          // direct beam: everything between the door plane and the ajar leaf, plus the free slot
          float slot = 1. - smoothstep(uFreeX - 1., uFreeX + 2. + .04 * max(p.z, 0.), p.x);
          float wedge = step(p.z, (${F.toFixed(1)} - p.x) * uLeafTan + 7.) * step(p.x, ${(F+1).toFixed(1)});
          float inb = smoothstep(-1., 1.5, p.z) * smoothstep(-.5, 1.5, p.x) * max(slot, wedge) * inY;
          float e1 = inb * max(dot(hn, normalize(vec3(0., .2, -1.))), 0.) * 4.6;
          // scattered glare from the slot (a vertical line source)
          vec3 v = vec3(uGapX - p.x, 0., 14. - p.z); float d = length(v);
          float wrap = dot(hn, v / max(d, .001)) * .5 + .5;
          float e2 = wrap * wrap * 1.5 / (1. + d * d / 2600.) * inY;
          e2 += wrap * .3 / (1. + d * d / 40000.) * (1. - smoothstep(${(O+Z).toFixed(1)}, ${(O+Z+90).toFixed(1)}, p.y));
          if (hn.y > .7) { float gdFl = gdFbm(vec2(p.x * .1, p.z * .055 - uTime * .45)); e1 *= .45 + 1.3 * gdFl; e2 *= .6 + .9 * gdFl; }   // the light runs over the paving like water
          vec3 alb = diffuseColor.rgb + vec3(.02);
          totalEmissiveRadiance += alb * uLight * (e1 + e2) * uOpen;
          if (vMat > 1.5 && vMat < 2.5) {     // fake sky reflection so bronze is never black
            vec3 rd = inverseTransformDirection(reflect(-normalize(vViewPosition), normal), viewMatrix);
            vec3 env = mix(uSkyHor, uSkyTop, smoothstep(-.1, .7, rd.y)) * (.35 + .65 * smoothstep(-.4, .1, rd.y));
            totalEmissiveRadiance += alb * env * .9;
          }
          if (vMat > 2.5) {
            float fl = .85 + .15 * sin(uTime * 1.3 + p.x * .05 + p.y * .02);
            totalEmissiveRadiance += vColor.rgb * fl * (.35 + .65 * uOpen);
          }
        }`)},f.customProgramCacheKey=()=>"great-door-solid",f}function Re(e){return new o.ShaderMaterial({side:o.DoubleSide,fog:!0,uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),uHeroInv:e.uHeroInv,uLight:e.uLight,uWarm:e.uWarm,uCool:e.uSkyTop,uOpen:e.uOpen,uTime:e.uTime,uSeed:e.uSeed,uPocket:e.uPocket},vertexShader:`
      uniform mat4 uHeroInv; varying vec3 vHP; varying vec3 vCam;
      #include <fog_pars_vertex>
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.);
        vHP = (uHeroInv * wp).xyz; vCam = (uHeroInv * vec4(cameraPosition, 1.)).xyz;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uLight, uWarm, uCool; uniform float uOpen, uTime, uSeed, uPocket; varying vec3 vHP; varying vec3 vCam;
      #include <fog_pars_fragment>
      ${ge}
      ${pe}
      void main(){
        vec3 d = normalize(vHP - vCam); d.z = -abs(d.z);
        float el = d.y / max(length(d.xz), 1e-3);                 // tan of elevation
        float az = d.x / max(-d.z, .05);
        // gradient: blinding at the horizon, apricot, then a clear rose-violet high up
        vec3 hor = uLight * 6.5, mid = mix(uWarm, uLight, .2) * .85, top = mix(uWarm, uCool, .72) * .36;
        float ae = abs(el);
        vec3 col = mix(hor, mid, smoothstep(0., .11, ae));
        col = mix(col, top, smoothstep(.12, .85, ae));
        float t = uTime * .014;
        if (el > 0.) {
          // cloud ceiling seen from underneath: bright bellies near the light, dusky cores
          vec2 uv = vec2(az, 1.) / (el + .11) * .42 + vec2(uSeed, t);
          float c = gdFbm(uv * vec2(.8, 1.7));
          float m = smoothstep(.42, .7, c) * smoothstep(.02, .2, el);
          vec3 belly = mix(uLight * 3.2, mix(uWarm, uLight, .35) * 1.3, smoothstep(.03, .5, el));
          vec3 core = mix(uWarm * .42, uCool * .22, smoothstep(.06, .6, el));
          col = mix(col, mix(belly, core, smoothstep(.62, .86, c)), m * .92);
          // second, higher wisp layer
          float c2 = gdFbm(vec2(az, 1.) / (el + .3) * 1.4 + vec2(3.1 + uSeed, -t * 2.));
          col += uLight * .8 * smoothstep(.55, .8, c2) * smoothstep(.15, .5, el) * (1. - m);
        } else {
          // cloud sea below the horizon, lit along its crests
          vec2 uv = vec2(az, 1.) / (-el + .09) * .5 + vec2(uSeed * 1.7, -t);
          float c = gdFbm(uv * vec2(.7, 2.1));
          vec3 sea = mix(uLight * 4.5, mix(uWarm, uLight, .4) * 1.2, smoothstep(.0, .3, -el));
          vec3 hollow = mix(uWarm * .7, uCool * .25, smoothstep(.03, .4, -el));
          col = mix(hollow, sea, smoothstep(.35, .7, c));
          col *= .8 + .45 * gdNoise(uv * vec2(2.2, 5.) + vec2(0., uTime * .22));     // light running along the crests
        }
        float mu = max(dot(d, normalize(vec3(0., .03, -1.))), 0.);
        col += uLight * (pow(mu, 80.) * 4. + pow(mu, 12.) * .3);
        col *= .35 + .65 * uOpen;
        col *= 1. - .45 * gdFog();
        // on the final approach the glare stands back from the last door, so it and its portal read as a dark shape in the light
        float pk = (1. - smoothstep(12., 27., abs(vHP.x - 15.))) * (1. - smoothstep(${(O+30).toFixed(1)}, ${(O+58).toFixed(1)}, vHP.y));
        col *= 1. - .74 * pk * uPocket;
        gl_FragColor = vec4(col, 1.);
        if (!(col.r + col.g + col.b >= 0.)) gl_FragColor = vec4(0., 0., 0., 1.);
      }`})}function Ue(e){return new o.ShaderMaterial({side:o.DoubleSide,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,fog:!0,uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),uLight:e.uLight,uOpen:e.uOpen,uTime:e.uTime,uVeil:e.uVeil,uPocket:e.uPocket},vertexShader:`
      attribute vec3 aUvs; varying vec3 vUvs; varying float vFace;
      #include <fog_pars_vertex>
      void main(){
        vUvs = aUvs;
        vec4 wp = modelMatrix * vec4(position, 1.);
        vec3 wn = normalize(mat3(modelMatrix) * normal);
        vec3 gdTo = cameraPosition - wp.xyz; vFace = abs(dot(wn, gdTo / max(length(gdTo), 1e-4)));
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uLight; uniform float uOpen, uTime, uVeil, uPocket; varying vec3 vUvs; varying float vFace;
      #include <fog_pars_fragment>
      ${ge}
      ${pe}
      void main(){
        float u = vUvs.x, v = vUvs.y, s = vUvs.z;
        float along = exp(-u * 3.4) * (1. - smoothstep(.7, 1., u)) * smoothstep(0., .03, u);
        float vert = (.22 + .78 * exp(-v * 5.)) * (1. - smoothstep(.72, 1., v)) * smoothstep(0., .015, v);
        float n1 = gdNoise(vec2(v * 34. + s * 31., u * .9 - uTime * .012 + s * 9.));
        float n2 = gdNoise(vec2(v * 9. + s * 5., u * .5 + uTime * .005));
        float streak = .06 + smoothstep(.2, .75, n1 * (.4 + n2)) * 1.25;
        streak *= .78 + .22 * sin(uTime * .7 + s * 40. + v * 9.);                                  // a slow shimmer, shaft by shaft
        streak *= 1. - .7 * uPocket * (1. - smoothstep(.07, .16, v)) * (1. - smoothstep(.03, .16, u));
        float a = along * vert * streak * smoothstep(.02, .3, vFace) * mix(1., .28, smoothstep(.3, .9, vFace));
        vec3 col = uLight * vec3(1., .84, .62) * a * .21 * uOpen * uVeil * (1. - gdFog());
        gl_FragColor = vec4(col, 1.);
        if (!(col.r + col.g + col.b >= 0.)) gl_FragColor = vec4(0., 0., 0., 1.);
      }`})}function Xe(e,f){return new o.ShaderMaterial({side:o.DoubleSide,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,fog:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8,uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),uHeroInv:e.uHeroInv,uLight:e.uLight,uOpen:e.uOpen,uTime:e.uTime,uFreeX:e.uFreeX,uLeafTan:e.uLeafTan,uGapX:e.uGapX,uLen:{value:f},uVeil:e.uVeil},vertexShader:`
      attribute float aLayer; uniform mat4 uHeroInv; varying vec3 vP; varying float vLayer; varying float vCamY;
      #include <fog_pars_vertex>
      void main(){
        vP = position; vLayer = aLayer;
        vCamY = (uHeroInv * vec4(cameraPosition, 1.)).y;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uLight; uniform float uOpen, uTime, uFreeX, uLeafTan, uGapX, uLen, uVeil;
      varying vec3 vP; varying float vLayer; varying float vCamY;
      #include <fog_pars_fragment>
      ${ge}
      ${pe}
      void main(){
        float z = vP.z, x = vP.x - uGapX, zz = max(z, 0.);
        float halfW = uFreeX * .5 + zz * .034, pen = 3. + zz * .07 + vLayer * .25;
        float band = 1. - smoothstep(halfW - pen * .4, halfW + pen, abs(x));
        // the lit triangle of floor between the door plane and the ajar leaf
        float wedge = step(0., vP.x) * step(z, (${F.toFixed(1)} - vP.x) * uLeafTan) * step(vP.x, ${F.toFixed(1)});
        float lit = max(band, wedge) * smoothstep(-1., 2., z);
        float along = exp(-zz / (uLen * .42)) * (1. - smoothstep(uLen * .7, uLen, zz));
        float a;
        if (vLayer < .5) {
          // ground: long soft streaks and puddle glints; a thin spill under the closed leaf
          float st = gdNoise(vec2(vP.x * .22, z * .012)) * .5 + gdNoise(vec2(vP.x * .05 + 9., z * .004)) * .5;
          float pud = smoothstep(.55, .8, gdFbm(vP.xz * .035 + 4.));
          st = smoothstep(.3, .75, gdNoise(vec2(vP.x * .13, z * .009 - uTime * .035)) * .6 + st * .4);     // the river runs in long bright threads
          a = lit * along * (.2 + 1.25 * st + 1.3 * pud) * (.5 + .5 * smoothstep(20., 200., z));
          a *= .4 + 1.2 * gdFbm(vec2(vP.x * .05 + 3., z * .03 - uTime * .6));        // the light flows outward like a river
          float spill = step(vP.x, 0.) * step(-${F.toFixed(1)}, vP.x) * exp(-zz / 9.) * smoothstep(-.5, 5., z) * (.6 + .4 * gdNoise(vec2(vP.x * .3, 1.)));
          a += spill * 1.1;
          a += exp(-abs(x) / (halfW * 3. + 20.)) * along * .1 * smoothstep(-1., 30., z) * (1. - smoothstep(95., 150., abs(x)));   // bounce beside the river
        } else {
          // mist sheet: drifting density, fades out as the camera crosses its height
          vec2 q = vP.xz * .012 + vec2(vLayer * 3.3, -uTime * .012);
          float dens = smoothstep(.42, .8, gdFbm(q));
          float cross_ = smoothstep(1.5, 9., abs(vCamY - vP.y));
          a = lit * along * dens * cross_ * .16 * exp(-vLayer * .014);
        }
        vec3 col = uLight * (vLayer < .5 ? vec3(1., .74, .42) : vec3(1., .84, .6)) * a * uOpen * (vLayer < .5 ? .45 + .55 * uVeil : uVeil) * (1. - gdFog());
        gl_FragColor = vec4(col, 1.);
        if (!(col.r + col.g + col.b >= 0.)) gl_FragColor = vec4(0., 0., 0., 1.);
      }`})}function Ee(e,f){return new o.ShaderMaterial({transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,fog:!0,uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),uLight:e.uLight,uOpen:e.uOpen,uTime:e.uTime,uGapX:e.uGapX,uFreeX:e.uFreeX,uViewH:e.uViewH,uLen:{value:Math.min(f,700)}},vertexShader:`
      attribute vec4 aSeed; uniform float uTime, uGapX, uFreeX, uViewH, uLen; varying float vA; varying float vTw;
      #include <fog_pars_vertex>
      void main(){
        float life = fract(aSeed.x + uTime * (.006 + .01 * aSeed.y));
        float z = -6. + life * uLen;
        float sp = uFreeX * .42 + z * (.03 + .12 * aSeed.w);
        float ph = aSeed.x * 61.;
        vec3 p;
        p.x = uGapX + (aSeed.z * 2. - 1.) * sp + sin(uTime * .17 + ph + z * .013) * (4. + z * .02);
        p.y = ${O.toFixed(1)} + 2. + pow(aSeed.w, 1.7) * 385. * (1. - .35 * life) + life * 60. * (aSeed.y - .35) + sin(uTime * .11 + ph * 1.7) * 6.;
        p.z = z + cos(uTime * .13 + ph) * 5.;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mvPosition;
        float size = .45 + 1.5 * aSeed.y * aSeed.y;
        float px = size * projectionMatrix[1][1] * uViewH * .5 / max(-mvPosition.z, 1.);
        float cl = clamp(px, 1.3, 7.);
        gl_PointSize = cl;
        vTw = .55 + .45 * sin(uTime * (1.2 + 2. * aSeed.z) + ph * 3.);
        vA = smoothstep(0., .06, life) * (1. - smoothstep(.55, 1., life)) * min(1., (px * px) / (cl * cl) + .12) * (.3 + .7 * smoothstep(8., 70., -mvPosition.z)) * smoothstep(3., 10., -mvPosition.z);
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uLight; uniform float uOpen; varying float vA; varying float vTw;
      #include <fog_pars_fragment>
      ${pe}
      void main(){
        vec2 c = gl_PointCoord - .5; float r = dot(c, c) * 4.;
        float a = (1. - smoothstep(.0, 1., r)); a *= a;
        gl_FragColor = vec4(uLight * vec3(1., .72, .36) * 3.4 * a * vA * vTw * uOpen * (1. - gdFog()), 1.);
      }`})}function Ve(e,f,t,a,g){return(e>0?[[f,-a],[t,-a],[t,a],[f,a]]:[[-f,a],[-t,a],[-t,-a],[-f,-a]]).map(([c,r])=>new o.Vector3(c,g,r))}async function De(e,f,t,a,g){const i=N.STONE,c=O+Z,r=c+fe,m={crown:new o.Vector3},d=34,u=4.4;for(const l of[-1,1]){const T=l*(F+ae/2);e.add(V(ae,Z,Q*2,1.2),t.stone,i,{x:T,y:O+Z/2}),e.add(V(ae+12,d,Q*2+12,2.2),t.stoneDk,i,{x:l*(F+(ae+12)/2),y:O+d/2}),e.add(oe([[0,0],[3.2,0],[3.2,2.2],[1.6,3.6],[1.6,5.2],[0,6.4]],Ve(l,F,F+ae+12,Q+6,O+d),le,[-1,3],!1,!0),t.stoneLt,i),e.add(oe([[0,0],[8.5,0],[8.5,3],[7,4.6],[0,4.6]],Ve(l,F,F+ae,Q,O+d+6.4),le,[-1,2],!1,!0),t.stone,i);const H=3+(f()<.5?1:0);for(let h=1;h<=H;h++){const L=O+d+(Z-d-30)*(h/(H+1));e.add(oe([[0,0],[1.8,.7],[1.8,2.6],[0,3.4]],Ve(l,F,F+ae,Q,L),le,[-1,1.5],!1,!0),t.stoneLt,i)}for(const h of[-1,1]){await g?.();const L=l*(F+27.5),b=h*(Q+1.4),B=Z-d-11-26,R=O+d+11+B/2;e.add(V(20,B,3.2,.7),t.stoneLt,i,{x:L,y:R,z:b,grad:.12});for(const $ of[-5.4,0,5.4])e.add(V(2.4,B-16,1.4,.5),t.stone,i,{x:L+$,y:R,z:b+h*1.9});e.add(V(23,5,5.5,1.2),t.stoneLt,i,{x:L,y:O+d+13.5,z:b+h*.6});let C=O+d+11+B;for(const[$,X,K]of[[22,3,4.6],[25,6,6.6],[29,5,9],[33,4.5,11.5],[36,7.5,13]])e.add(V($,X,K,.8),t.stoneLt,i,{x:L,y:C+X/2,z:h*(Q+K/2-1.2)}),C+=X;await g?.();const G=[],D=Z-d-30;for(let $=0;$<=8;$++){const X=$/8;G.push(new o.Vector2(u*(1-.16*X*X)*(1+.05*Math.sin(X*Math.PI)),X*D))}const Y=l*(F+ae+.8),J=h*(Q+.8),ee=O+d+11;e.add(new o.LatheGeometry(G,12),t.stoneLt,i,{x:Y,y:ee,z:J,grad:.1});for(const[$,X]of[[0,1.5],[3.2,1.1],[D*.5,.9],[D-2,1.2]])e.add(new o.TorusGeometry(u*($>D*.4?.9:1)+.6,X,6,14),t.stone,i,{x:Y,y:ee+$,z:J,rx:Math.PI/2});e.add(V(11,6,11,1),t.stone,i,{x:Y,y:ee-3,z:J}),e.add(V(11.5,7,11.5,1.4,1,1),t.stoneLt,i,{x:Y-l*.6,y:ee+D+3.5,z:J-h*.6})}await g?.();const _=new o.PlaneGeometry(.8,2),v=()=>t.lamp.clone().multiplyScalar(f.range(.5,1.5));for(let h=0;h<46;h++){const L=O+d+22+h*7.2;for(const b of[-1,1])for(const B of[-8.3,-2.7,2.7,8.3])f()>(b>0?.26:.14)||e.add(_,v(),N.GLOW,{x:l*(F+27.5)+B,y:L+f.range(-.3,.3),z:b*(Q+3.05),ry:b>0?0:Math.PI});for(let b=0;b<6;b++)f()>.2||e.add(_,v(),N.GLOW,{x:l*(F+ae+.06),y:L,z:-Q+4+b*((Q*2-8)/5),ry:l*Math.PI/2})}_.dispose();for(const h of[-1,1]){const L=l*(F+14+f.range(-3,12)),b=h*(Q+6);e.add(V(3.4,5.2,.8,.2),t.stoneLt,i,{x:L,y:O+2.6,z:b+h*.2}),e.add(V(2.2,4.2,.5,.1),t.woodFrieze,N.WOOD,{x:L,y:O+2.1,z:b+h*.6}),e.add(V(2.3,.14,.3,.02),t.glow,N.GLOW,{x:L,y:O+.08,z:b+h*.8}),e.add(V(.12,4.1,.3,.02),t.glow,N.GLOW,{x:L+1.12,y:O+2.1,z:b+h*.8}),e.add(new o.SphereGeometry(.42,6,5),t.lampHi,N.GLOW,{x:L,y:O+6.4,z:b+h*1.3})}await g?.()}const w=[[0,-7],[0,4.6],[5,4.6],[5,3.3],[10.5,3.3],[10.5,2.1],[15.2,2.1],[16.4,0]],M=[[-F,O],[-F,c],[F,c],[F,O]].map(([l,T])=>new o.Vector3(l,T,Q)),y=[[F,O],[F,c],[-F,c],[-F,O]].map(([l,T])=>new o.Vector3(l,T,-Q));e.add(oe(w,M,ve,[8,-3],!1,!0),t.stoneLt,i),e.add(oe(w,y,Pe,[8,-3],!1,!0),t.stoneLt,i);const s=F+ae+4,p=Q+2;e.add(V(s*2,fe,p*2,1.2),t.stone,i,{y:c+fe/2}),e.add(oe([[0,0],[2.2,0],[2.2,1.6],[0,2.4]],we(s,p,c+17),le,[-1,1],!0),t.stoneLt,i);const x=2*f.int(4,6)+1,S=2*(F+12),P=c+27.5;for(const l of[-1,1]){for(let T=0;T<x;T++){T%4===0&&await g?.();const H=-S/2+S*(T/(x-1));if(T===(x-1)/2)continue;const _=l*(p+.5),v=T%2===0;e.add(V(10.5,16,2.2,.7),t.stoneLt,i,{x:H,y:P,z:_}),e.add(V(7.6,13,1.2,.4),t.woodFrieze,N.WOOD,{x:H,y:P-.6,z:_+l*1.2}),v&&e.add(new o.CylinderGeometry(3.8,3.8,1.2,12,1,!1,0,Math.PI),t.woodFrieze,N.WOOD,{x:H,y:P+5.6,z:_+l*1.2,rx:Math.PI/2,ry:Math.PI/2}),f()<.45?e.add(V(.7,12.4,.6,.1),t.glow,N.GLOW,{x:H+(f()<.5?-3.3:3.3),y:P-.6,z:_+l*1.9}):e.add(new o.SphereGeometry(.6,6,4),t.bronze,N.BRONZE,{x:H+2.4,y:P-1.5,z:_+l*1.9})}e.add(V(20,34,9,1.4,1.3,1),t.stoneLt,i,{y:c+19,z:l*(p+2.5)}),e.add(V(12.5,19,1.6,.6),t.bronze,N.BRONZE,{y:c+20,z:l*(p+7.4)}),e.add(new o.CylinderGeometry(3.1,3.1,.8,18),t.glow,N.GLOW,{y:c+23.5,z:l*(p+8.4),rx:Math.PI/2}),e.add(V(3.6,9,.8,.1,.42,1),t.glow,N.GLOW,{y:c+17.2,z:l*(p+8.4)})}await g?.();const n=c+fe-15.5;for(let l=-s+3;l<=s-3+.01;l+=8.05){await g?.();for(const T of[-1,1])e.add(V(4.6,5.4,5,.5),t.stoneLt,i,{x:l,y:n,z:T*(p+2)})}for(let l=-p+5;l<=p-5+.01;l+=8)for(const T of[-1,1])e.add(V(5,5.4,4.6,.5),t.stoneLt,i,{x:T*(s+2),y:n,z:l});e.add(oe([[0,0],[5.5,.6],[5.5,2.6],[9.5,4.2],[9.5,6.2],[13.5,8],[13.5,11.2],[11.5,12.6],[0,12.6]],we(s,p,c+fe-12.6),le,[-2,6],!0),t.stoneLt,i),await g?.();const z=s+6,W=p*2-6,A=[[-11,0],[-11,2.2],[-6,2.2],[-6,4],[2.2,4],[2.2,0]];let E=r+30,k=W/2,U=17,I=r+60;if(a<2){const l=new o.Shape,T=[];if(a===0){const v=z-8,h=f.range(56,70);I=r+6+h,E=r+6+h*.45,l.moveTo(-v,0);for(let L=0;L<=40;L++){const b=Math.PI*(1-L/40),B=Math.cos(b)*v,R=Math.sin(b)*h;l.lineTo(B,R),T.push(new o.Vector3(B,r+6+R,0))}l.lineTo(-v,0)}else{const v=z-2,h=f.range(66,84);I=r+6+h,E=r+6+h*.36,U=15,l.moveTo(-v,0),l.lineTo(0,h),l.lineTo(v,0),l.lineTo(-v,0),T.push(new o.Vector3(-v,r+6,0),new o.Vector3(0,r+6+h,0),new o.Vector3(v,r+6,0))}const H=new o.Path;H.absarc(0,E-r-6,U,0,Math.PI*2,!0),l.holes.push(H);const _=new o.ExtrudeGeometry(l,{depth:W-3,bevelEnabled:!0,bevelThickness:1.5,bevelSize:1.2,bevelSegments:1,curveSegments:28});_.translate(0,0,-(W-3)/2),e.add(_,t.stone,i,{y:r+6}),await g?.(),e.add(V(z*2,6,W+3,1),t.stoneLt,i,{y:r+3}),e.add(oe(A,T.map(v=>v.clone().setZ(W/2)),ve,[-3,1],!1,!0),t.stoneLt,i),e.add(oe(A,T.map(v=>v.clone().setZ(-W/2)).reverse(),Pe,[-3,1],!1,!0),t.stoneLt,i)}else{let l=r;const T=[[z*2-20,20],[z*2-110,44],[z*2-200,16],[70,14]];for(let H=0;H<T.length;H++){const[_,v]=T[H];e.add(V(_,v,W-H*4,1.6),H%2?t.stone:t.stoneLt,i,{y:l+v/2}),e.add(oe([[0,0],[3,.8],[3,2.6],[0,3.6]],we(_/2,(W-H*4)/2,l+v-3.6),le,[-1,2],!0),t.stoneLt,i),H===1&&(E=l+v/2,k=(W-4)/2),l+=v}I=l,U=15}await g?.();for(const l of[-1,1]){await g?.(),e.add(new o.TorusGeometry(U+1.2,2.8,8,30),t.stoneLt,i,{y:E,z:l*k,sz:1.4}),e.add(new o.TorusGeometry(U-.8,.9,6,30),t.bronze,N.BRONZE,{y:E,z:l*(k+2.6)});for(let H=0;H<12;H++){const _=H/12*Math.PI*2+Math.PI/12;e.add(V(3.2,5.2,3,.6),t.stone,i,{x:Math.cos(_)*(U+5.4),y:E+Math.sin(_)*(U+5.4),z:l*(k+.6),rz:_-Math.PI/2})}e.add(new o.CircleGeometry(U-.5,30),t.glowHi,N.GLOW,{y:E,z:l*(a<2?1.5:k+.4),ry:l>0?0:Math.PI});const T=new o.CylinderGeometry(U-1,U-1,1.6,30);e.add(T,t.wood,N.WOOD,{x:U*.55,y:E,z:l*(a<2?5.5:k+3.2),rx:Math.PI/2,ry:0,rz:l*.5}),e.add(new o.TorusGeometry(2.6,.5,5,12),t.bronze,N.BRONZE,{x:U*.55-6,y:E,z:l*(a<2?6.9:k+4.6)})}await g?.(),m.crown.set(0,E,0);const re=(l,T,H)=>{e.add(V(12,8,12,1.2),t.stoneLt,i,{x:l,y:T+4*H,s:H}),e.add(V(8,34,8,.8,.18),t.stone,i,{x:l,y:T+25*H,s:H}),e.add(new o.SphereGeometry(2.6,8,6),t.bronze,N.BRONZE,{x:l,y:T+44.5*H,s:H})};re(-(s-2),a===2?r+20:r+6,1),re(s-2,a===2?r+20:r+6,1),a!==0?re(0,I,a===1?.8:1.1):(e.add(V(16,10,14,1.4),t.stoneLt,i,{y:I+4}),e.add(new o.SphereGeometry(6,10,8),t.bronze,N.BRONZE,{y:I+14})),m.top=I+(a===0?20:45),await g?.();for(let l=0;l<3;l++){const T=O-l*.8,H=2*(F+ae+30)+l*9,_=176+l*9;e.add(V(H,T+1.5,_,.2),l===0?t.pave:t.stoneDk,i,{y:(T-1.5)/2,z:26})}return m}function He(e,f,t,a){const g=xe(),i=e/2,c=f/2,r=i-a,m=c-a,d=[[-i,-c],[i,-c],[i,c],[-i,c]].map(([w,M])=>new o.Vector3(w,M,0)),u=[[-r,-m],[r,-m],[r,m],[-r,m]].map(([w,M])=>new o.Vector3(w,M,t));g.quad(u[0],u[1],u[2],u[3],ve);for(let w=0;w<4;w++){const M=(w+1)%4,y=new o.Vector3().addVectors(d[w],d[M]).setZ(Math.abs(i));g.quad(d[w],d[M],u[M],u[w],y)}return g.geo()}function $e(e){const f=F-.6,t=O+1,a=O+Z-.8,g=e.pick([1,2,2,2,3]),i=e.int(4,6),c=11,r=8,m=27,d=14,u=9,w=[];for(let P=0;P<i;P++){const n=P/(i-1);w.push(.75+1.5*Math.sin(Math.PI*Math.pow(n,.8))+e.range(-.15,.15))}w[i-1]*=.7;const M=w.reduce((P,n)=>P+n,0),y=a-t-m-d-u*(i-1),s=[];let p=t+m;for(let P=0;P<i;P++){const n=y*w[P]/M;s.push([p,p+n]),p+=n+u}const x=[],S=(f-2*c-r*(g-1))/g;for(let P=0;P<g;P++)x.push([c+P*(S+r),c+P*(S+r)+S]);return{LW:f,yb:t,yt:a,cols:g,rows:s,colsX:x,sw:c,mw:r,botRail:m,topRail:d,rail:u,nHinge:e.int(3,5),ringY:O+e.range(150,172),rosette:e()<.7,studPitch:e.range(10.5,14)}}async function Oe(e,f,t,a,g,i){const c=N.WOOD,r=N.BRONZE,{LW:m,yb:d,yt:u,sw:w}=a,M=u-d,y=(d+u)/2,s=2.8;e.add(V(m,M,s*2,.5),t.woodDk,c,{x:m/2,y}),e.add(V(2.4,M+.4,me+1.2,.5),t.bronze,r,{x:m-.9,y});const p=n=>{const z=n.toNonIndexed();return z.deleteAttribute("uv"),n.dispose(),z},x=p(new o.ConeGeometry(1.5,1.3,4)),S=p(new o.ConeGeometry(3.4,1.8,8)),P=p(new o.SphereGeometry(1,6,4));for(const n of[-1,1]){const z=n*Math.PI/2,W=n*(s+.85),A=n*(s+1.7),E=n>0?ve:Pe;e.add(V(w,M,1.7,.45),t.wood,c,{x:w/2,y,z:W}),e.add(V(w,M,1.7,.45),t.wood,c,{x:m-w/2-1.6,y,z:W});for(let v=1;v<a.cols;v++)e.add(V(a.mw,M-a.botRail-a.topRail+1,1.7,.45),t.wood,c,{x:a.colsX[v][0]-a.mw/2,y:(d+a.botRail+u-a.topRail)/2,z:W});const k=m-2*w-1.2,U=w+k/2-.4;e.add(V(k,a.botRail,1.7,.45),t.wood,c,{x:U,y:d+a.botRail/2,z:W}),e.add(V(k,a.topRail,1.7,.45),t.wood,c,{x:U,y:u-a.topRail/2,z:W});for(let v=0;v<a.rows.length-1;v++)e.add(V(k,a.rail,1.7,.45),t.wood,c,{x:U,y:a.rows[v][1]+a.rail/2,z:W});const I=[[0,0],[0,2.3],[-1.7,2.3],[-2.8,1.2],[-4.4,.8],[-4.4,0]];for(const[v,h]of a.rows)for(const[L,b]of a.colsX){await i?.();const B=(L+b)/2,R=(v+h)/2,C=b-L,G=h-v;let D=ze(C/2,G/2,B,R,n*s);n<0&&(D=D.reverse()),e.add(oe(I,D,E,[-2,.4],!0),t.woodLt,c);const Y=C-14,J=G-14;if(Y>6&&J>6)if(e.add(He(Y,J,1.5,Math.min(5,Y*.2,J*.2)),t.wood,c,{x:B,y:R,z:n*s,ry:n>0?0:Math.PI}),J>46&&Y>24){const ee=Y-16,$=J-16;let X=ze(ee/2,$/2,B,R,n*(s+1.5));if(n<0&&(X=X.reverse()),e.add(oe([[0,0],[0,.9],[-1.4,.9],[-2.2,0]],X,E,[-1,.2],!0),t.woodLt,c),a.rosette){e.add(S,t.bronze,r,{x:B,y:R,z:n*(s+2.3),rx:z,s:Math.min(1.6,ee/18)});for(let K=0;K<8;K++){const ie=K/8*Math.PI*2;e.add(P,t.bronze,r,{x:B+Math.cos(ie)*7,y:R+Math.sin(ie)*7,z:n*(s+1.7),s:.9})}}}else Y>12&&e.add(S,t.bronze,r,{x:B,y:R,z:n*(s+2.2),rx:z,s:.8})}await i?.();const re=Math.floor(M/a.studPitch);for(let v=0;v<re;v++){const h=d+(v+.5)*(M/re);e.add(x,t.bronze,r,{x:w/2,y:h,z:A+n*.6,rx:z}),e.add(x,t.bronze,r,{x:m-w/2-1.8,y:h,z:A+n*.6,rx:z})}const l=Math.floor(k/a.studPitch),T=[u-a.topRail/2,...a.rows.slice(0,-1).map(v=>v[1]+a.rail/2)];for(const v of T)for(let h=0;h<l;h++)e.add(x,t.bronze,r,{x:w+(h+.5)*(k/l),y:v,z:A+n*.6,rx:z,s:.8});e.add(V(m-5,17,.9,.3),t.bronze,r,{x:m/2-.6,y:d+10.5,z:A+n*.4});for(let v=0;v<14;v++)for(const h of[3.6,17.4])e.add(x,t.bronze,r,{x:6+v*((m-13)/13),y:d+h,z:A+n*1.2,rx:z,s:.7});for(let v=0;v<a.nHinge;v++){await i?.();const h=d+M*((v+.5)/a.nHinge)+(v===0?14:0),L=m*.6;e.add(V(7,L,1,.3,.4,1),t.bronze,r,{x:L/2,y:h,z:A+n*.5,rz:-Math.PI/2}),e.add(V(9,13,1,.3,.06,1),t.bronze,r,{x:L+5.5,y:h,z:A+n*.5,rz:-Math.PI/2});for(const b of[-1,1])e.add(new o.TorusGeometry(3.4,.9,5,12),t.bronze,r,{x:L-2.5,y:h+b*6.2,z:A+n*.6});for(let b=0;b<5;b++)e.add(x,t.bronzeHi,r,{x:6+b*(L-12)/4,y:h,z:A+n*1.3,rx:z,s:.75});if(n>0){e.add(new o.CylinderGeometry(6.2,6.2,20,12),t.bronze,r,{x:.6,y:h,z:0});for(const b of[-1,1])e.add(new o.SphereGeometry(6.6,10,5),t.bronze,r,{x:.6,y:h+b*10.5,z:0,sy:.5})}}await i?.();const H=m-19,_=a.ringY;if(e.add(V(13,30,1.2,.5),t.bronze,r,{x:H,y:_,z:A+n*.6}),e.add(new o.CylinderGeometry(4.6,5.4,2.6,12),t.bronze,r,{x:H,y:_+7,z:A+n*2.2,rx:z}),e.add(new o.SphereGeometry(3.3,10,6),t.bronzeHi,r,{x:H,y:_+7,z:A+n*3.6}),e.add(new o.TorusGeometry(10,1.5,8,26),t.bronzeHi,r,{x:H,y:_-2.6,z:A+n*4.4,rx:n*.12}),e.add(V(8.5,17,1,.4),t.bronze,r,{x:H,y:_-44,z:A+n*.5}),e.add(new o.CylinderGeometry(1.9,1.9,.5,14),t.glow,N.GLOW,{x:H,y:_-41.5,z:A+n*1.15,rx:Math.PI/2}),e.add(V(2.4,6.5,.5,.05,.4,1),t.glow,N.GLOW,{x:H,y:_-45.6,z:A+n*1.15}),g){let v=m-36,h=d+1.4,L=34,b=64,B=A+1.6*n,R=3.2;for(let C=0;C<3;C++){const G=L/34,D=B+n*R;let Y=ze(L/2,b/2,v,h+b/2,B);n<0&&(Y=Y.reverse()),e.add(oe([[0,0],[0,R+1.2*G],[3.4*G,R+1.2*G],[4.6*G,0]],Y,E,[1.5*G,.3*G],!0),t.woodLt,c),e.add(V(L,b,R,.3*G),C===1?t.wood:t.woodLt,c,{x:v,y:h+b/2,z:B+n*R/2});for(const[$,X]of[[.74,.4],[.3,.34]])for(const K of[-.24,.24])C===0&&$<.5&&K>0||e.add(He(L*.38,b*X,.9*G,2.2*G),t.woodDk,c,{x:v+K*L,y:h+b*$,z:D,ry:n>0?0:Math.PI});e.add(new o.TorusGeometry(1.5*G,.3*G,5,12),t.bronzeHi,r,{x:v+L*.4,y:h+b*.52,z:D+n*.5*G}),e.add(V(.5*G+.08,b,.5*G,.03),t.glow,N.GLOW,{x:v+L/2+.3*G,y:h+b/2,z:D-n*.2*G}),e.add(V(L,.5*G+.08,.5*G,.03),t.glow,N.GLOW,{x:v,y:h-.3*G,z:D-n*.2*G});const J=L/4,ee=b/4;v=v+L*.24,h=h+.9*G,B=D,R=Math.max(.25,R*.3),L=J,b=ee}e.add(new o.SphereGeometry(.3,6,5),t.lampHi,N.GLOW,{x:v-L*2.2,y:h+b*4.6,z:B+n*.5})}await i?.()}g&&(e.add(V(m+.6,1,me-3,.1),t.glow,N.GLOW,{x:m/2,y:d-.5}),e.add(V(m+.6,.8,me-3,.1),t.glowLo,N.GLOW,{x:m/2,y:u+.4}),e.add(V(.7,M,me-3,.1),t.glowLo,N.GLOW,{x:-.1,y})),x.dispose(),S.dispose(),P.dispose()}function je(e,f,t){const a=[],g=[],i=[],c=[];for(let d=0;d<18;d++){const u=ue(1.5,f-1.5,(d+e())/18),w=4,M=Math.min(.17,Math.atan((f-1-u)/84)),y=ue(-.17,M,Math.pow(e(),.8)),s=t*e.range(.5,.95),p=Math.sin(y),x=Math.cos(y),S=Z-4,P=Z*e.range(.8,1.1),n=e(),z=a.length/3;a.push(u,O,w,u+p*s,.3,w+x*s,u+p*s,P,w+x*s,u,O+S,w);for(let W=0;W<4;W++)g.push(x,0,-p);i.push(0,0,n,1,0,n,1,1,n,0,1,n),c.push(z,z+1,z+2,z,z+2,z+3)}const m=new o.BufferGeometry;return m.setAttribute("position",new o.Float32BufferAttribute(a,3)),m.setAttribute("normal",new o.Float32BufferAttribute(g,3)),m.setAttribute("aUvs",new o.Float32BufferAttribute(i,3)),m.setIndex(c),m}function Ye(e,f){const t=[],a=[],g=[],i=e-150,c=e+150,r=(d,u,w,M,y)=>{const s=t.length/3;t.push(i,u,d,c,u,d,c,M,w,i,M,w),a.push(y,y,y,y),g.push(s,s+2,s+1,s,s+3,s+2)};r(0,O+.12,114,O+.12,0),r(114,O+.12,124,.25,0),r(124,.25,f,.25,0);for(const d of[8,15,25,39,58,82])r(0,d,f,d,d);const m=new o.BufferGeometry;return m.setAttribute("position",new o.Float32BufferAttribute(t,3)),m.setAttribute("aLayer",new o.Float32BufferAttribute(a,1)),m.setIndex(g),m}async function Je(e,f={}){const t=e.rng.fork?e.rng.fork("great-door"):e.rng,a=(f.palette&&f.palette.length>=7?f.palette:We).map(j=>new o.Color(j)),[g,i,c,r,m,,d]=a,u=(j,se)=>j.clone().multiplyScalar(se),w=f.ajar?f.ajar==="left":t()<.4,M=f.crown??t.int(0,2),y=f.riverLength??900,s=m.clone().lerp(d,.3).lerp(i,.08).lerp(c,t.range(0,.07));let p=u(g.clone().lerp(i,t.range(.5,.9)),1.15);t()<.35&&p.lerp(c,.14);const x=r.clone().lerp(d,.35),S={stone:s,stoneLt:u(s,1.2),stoneDk:u(s,.72),pave:u(s.clone().lerp(r,.08),.95),wood:p,woodDk:u(p,.62),woodLt:u(p.clone().lerp(r,.06),1.35),woodFrieze:u(p,.8),bronze:u(r.clone().lerp(c,.18),.55),bronzeHi:u(r,.8),glow:u(x,3.6),glowLo:u(x,2.2),glowHi:u(x,5),lamp:u(r.clone().lerp(c,.35),3.2),lampHi:u(r.clone().lerp(c,.2),6)},P=$e(t),n=P.LW,z=30,W=17,A=Math.acos((F-z)/n),E=Math.acos((F-W)/n),k={uHeroInv:{value:new o.Matrix4},uLight:{value:x},uWarm:{value:c.clone()},uSkyTop:{value:i.clone().lerp(d,.15)},uSkyHor:{value:u(c,.7)},uOpen:{value:1},uTime:{value:0},uFreeX:{value:z},uLeafTan:{value:Math.tan(A)},uGapX:{value:z/2},uSeed:{value:t.range(0,50)},uViewH:{value:720},uProgress:{value:1},uVeil:{value:1},uPocket:{value:0}},U=new o.Group;U.name="great-door";const I=new o.Group;I.scale.x=w?-1:1,U.add(I);const re=Be(k),l=Me(),T=await De(l,t.fork("frame"),S,M,e.yield);await e.yield?.();const H=new o.Mesh(l.build(),re);H.name="frame",I.add(H),await e.yield?.();const _=new o.Group;_.position.set(-F,0,0),I.add(_);const v=new o.Group;v.position.set(F,0,0),I.add(v);const h=Me();await Oe(h,t.fork("leafC"),S,P,!0,e.yield);const L=new o.Mesh(h.build(),re);L.name="leaf-closed",_.add(L),await e.yield?.();const b=Me();await Oe(b,t.fork("leafA"),S,P,!1,e.yield);const B=new o.Mesh(b.build(),re);B.name="leaf-ajar",v.add(B),await e.yield?.();const R=new o.PlaneGeometry(F+.6,Z);R.translate((F-.6)/2,O+Z/2,0);const C=new o.Mesh(R,Re(k));C.name="doorway-sky",I.add(C);const G=new o.Mesh(Ye(z/2,y),Xe(k,y));G.renderOrder=2,G.name="light-river",I.add(G);const D=new o.Mesh(je(t.fork("rays"),z,y),Ue(k));D.renderOrder=3,D.name="shafts",I.add(D);const Y=f.motes??7e3,J=t.fork("motes"),ee=new Float32Array(Y*4);for(let j=0;j<ee.length;j++)ee[j]=J();const $=new o.BufferGeometry;$.setAttribute("position",new o.BufferAttribute(new Float32Array(Y*3),3)),$.setAttribute("aSeed",new o.BufferAttribute(ee,4));const X=new o.Points($,Ee(k,y));X.frustumCulled=!1,X.renderOrder=4,X.name="motes",I.add(X);let K=null;f.pointLight&&(K=new o.PointLight(x,6e4,1400,2),K.position.set(z/2,70,30),I.add(K));let ie=1,he=A;const be=()=>{const j=Ne(0,.85,ie);he=ue(E,A,j),k.uOpen.value=ue(.72,1,j),k.uProgress.value=ie,K&&(K.intensity=6e4*k.uOpen.value)},Le=j=>{v.rotation.y=Math.PI+j;const se=F-n*Math.cos(j);k.uFreeX.value=se,k.uGapX.value=se/2,k.uLeafTan.value=Math.tan(j)};be(),Le(he);const ye=w?-1:1,q=(j,se,Se)=>new o.Vector3(ye*j,se,Se),te=z/2,de=O+12,Fe=T.top,Te=q(te,165,20),ke={portalSeat:{position:q(te,de,0),facing:new o.Vector3(0,0,1),width:12,height:24,floorY:O},flyThrough:[q(te,64,y),q(te,42,y*.7),q(te,24,y*.44),q(te,de+2,230),q(te,de,100),q(te,de,0)],beyond:q(te,de,-80),gap:{center:q(te,O+Z/2,0),width:z,xMin:Math.min(0,ye*z),xMax:Math.max(0,ye*z),floorY:O,top:O+Z},freeEdge:q(z,O,n*Math.sin(A)),lightRiver:{origin:q(te,0,0),direction:new o.Vector3(0,0,1),length:y,halfWidth0:z/2,spread:.034},lightColor:x.clone(),viewpoints:{far:q(te,14,1250),reveal:q(-170,60,760),threeQuarter:q(-330,120,470),under:q(-45,10,150)},crown:T.crown.clone()},_e=new o.Vector2,ce={object:U,radius:260,height:Fe,center:Te,anchors:ke,uniforms:k,mirrored:w,setProgress(j){ie=Ae(j,0,1),be()},update(j,se,Se){k.uTime.value=se,I.updateWorldMatrix(!0,!1),k.uHeroInv.value.copy(I.matrixWorld).invert(),e.renderer&&e.renderer.getDrawingBufferSize&&(k.uViewH.value=e.renderer.getDrawingBufferSize(_e).y),Le(he+.0035*Math.sin(se*.13)*k.uOpen.value)},dispose(){},ground:!0,groundY:0};return f.view==="approach"&&(ce.radius=150,ce.height=70,ce.center=q(te,60,0)),ce.update(0,0,null),ce}export{Je as buildHero};
