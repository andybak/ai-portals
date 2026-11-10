import*as s from"three";import{clamp as mt,lerp as Ve,smoothstep as wt}from"../kit/core.js";const ie=640,me=985,xe=1350,ae=15,re=226,Ro=230,qt=8,he=S=>63+5*(1-S/xe*(S/xe));function _e(S){const o=Math.abs(S);if(o<=ie){const l=o/ie;return 71.5+(re-71.5)*l*l}if(o<=me){const l=(o-ie)/(me-ie);return re+(66.6-re)*l-48*l*(1-l)}return 66.6-8.6*Math.min(1,(o-me)/30)}const vt=S=>{const o=new s.Color(S);return[o.r,o.g,o.b]},ue=(S,o)=>[S[0]*o,S[1]*o,S[2]*o],fo=(S,o,l)=>[Ve(S[0],o[0],l),Ve(S[1],o[1],l),Ve(S[2],o[2],l)];class Ie{constructor(o,l=3e4){this.rnd=o,this.n=0,this.cap=l,this.jit=.06,this.P=new Float32Array(l*3),this.N=new Float32Array(l*3),this.C=new Float32Array(l*3),this.U=new Float32Array(l*2),this.S=new Float32Array(l*2)}grow(){const o=this.cap*2;for(const l of["P","N","C"]){const y=new Float32Array(o*3);y.set(this[l]),this[l]=y}for(const l of["U","S"]){const y=new Float32Array(o*2);y.set(this[l]),this[l]=y}this.cap=o}quad(o,l,y,z,A,K=0,V=0,L=null,H=1){this.n+6>this.cap&&this.grow();let _=l[0]-o[0],M=l[1]-o[1],q=l[2]-o[2],B=z[0]-o[0],G=z[1]-o[1],W=z[2]-o[2],k=M*W-q*G,v=q*B-_*W,U=_*G-M*B;if(L&&k*L[0]+v*L[1]+U*L[2]<0){const we=l;l=z,z=we,k=-k,v=-v,U=-U}const $=Math.hypot(k,v,U)||1;k/=$,v/=$,U/=$;let T=1,Y=0;const se=Math.abs(v)>.75;if(!se){const we=Math.hypot(k,U)||1;T=-U/we,Y=k/we}const ee=H*(1+this.jit*(this.rnd()-.5)*2),Ne=A[0]*ee,Ee=A[1]*ee,We=A[2]*ee,ce=[o,l,y,o,y,z],Le=Array.isArray(V);Le&&ce[1]!==arguments[1]&&(V=[V[0],V[3],V[2],V[1]]);const Pe=[0,1,2,0,2,3];for(let we=0;we<6;we++){const Se=ce[we],j=this.n*3,qe=this.n*2;this.P[j]=Se[0],this.P[j+1]=Se[1],this.P[j+2]=Se[2],this.N[j]=k,this.N[j+1]=v,this.N[j+2]=U,this.C[j]=Ne,this.C[j+1]=Ee,this.C[j+2]=We,this.U[qe]=se?Se[0]:Se[0]*T+Se[2]*Y,this.U[qe+1]=se?Se[2]:Se[1],this.S[qe]=K,this.S[qe+1]=Le?V[Pe[we]]:V,this.n++}}box(o,l,y,z,A,K,V,L=0,H=0,_=63){const M=o-z/2,q=o+z/2,B=l-A/2,G=l+A/2,W=y-K/2,k=y+K/2;_&1&&this.quad([q,B,k],[q,B,W],[q,G,W],[q,G,k],V,L,H,[1,0,0]),_&2&&this.quad([M,B,W],[M,B,k],[M,G,k],[M,G,W],V,L,H,[-1,0,0]),_&4&&this.quad([M,G,k],[q,G,k],[q,G,W],[M,G,W],V,L,H,[0,1,0],1.06),_&8&&this.quad([M,B,W],[q,B,W],[q,B,k],[M,B,k],V,L,H,[0,-1,0],.8),_&16&&this.quad([M,B,k],[q,B,k],[q,G,k],[M,G,k],V,L,H,[0,0,1]),_&32&&this.quad([q,B,W],[M,B,W],[M,G,W],[q,G,W],V,L,H,[0,0,-1])}beam(o,l,y,z,A,K=0,V=!1){const L=l[0]-o[0],H=l[1]-o[1],_=l[2]-o[2],M=Math.hypot(L,H,_)||1;let q,B,G;if(Math.abs(H)>.999*M)q=1,B=0,G=0;else{q=-_,B=0,G=L;const ce=Math.hypot(q,G);q/=ce,G/=ce}let W=B*_-G*H,k=G*L-q*_,v=q*H-B*L;const U=Math.hypot(W,k,v)||1;W/=U,k/=U,v/=U;const $=y/2,T=z/2,Y=(ce,Le,Pe)=>[ce[0]+q*$*Le+W*T*Pe,ce[1]+B*$*Le+k*T*Pe,ce[2]+G*$*Le+v*T*Pe],se=[Y(o,-1,-1),Y(o,1,-1),Y(o,1,1),Y(o,-1,1)],ee=[Y(l,-1,-1),Y(l,1,-1),Y(l,1,1),Y(l,-1,1)],Ne=[q,B,G],Ee=[W,k,v],We=ce=>[-ce[0],-ce[1],-ce[2]];this.quad(se[0],ee[0],ee[1],se[1],A,K,0,We(Ee),.82),this.quad(se[1],ee[1],ee[2],se[2],A,K,0,Ne),this.quad(se[2],ee[2],ee[3],se[3],A,K,0,Ee,1.05),this.quad(se[3],ee[3],ee[0],se[0],A,K,0,We(Ne)),V&&(this.quad(se[0],se[1],se[2],se[3],A,K,0,[-L,-H,-_]),this.quad(ee[0],ee[1],ee[2],ee[3],A,K,0,[L,H,_]))}tier(o,l,y,z,A,K,V,L=0,H=!0){const _=o.length;for(let M=0;M<_;M++){const q=(M+1)%_,B=o[M],G=o[q],W=l[q],k=l[M],v=(B[0]+G[0])/2,U=(B[1]+G[1])/2;this.quad([y+B[0],A,z+B[1]],[y+G[0],A,z+G[1]],[y+W[0],K,z+W[1]],[y+k[0],K,z+k[1]],V,L,0,[v,1e-4,U])}if(H)for(let M=0;M<_;M+=2){const q=l[M],B=l[(M+1)%_],G=l[(M+2)%_];this.quad([y,K,z],[y+q[0],K,z+q[1]],[y+B[0],K,z+B[1]],[y+G[0],K,z+G[1]],V,L,0,[0,1,0],1.06)}}get triangles(){return this.n/3}toGeometry(){const o=new s.BufferGeometry,l=this.n;return o.setAttribute("position",new s.BufferAttribute(this.P.slice(0,l*3),3)),o.setAttribute("normal",new s.BufferAttribute(this.N.slice(0,l*3),3)),o.setAttribute("color",new s.BufferAttribute(this.C.slice(0,l*3),3)),o.setAttribute("aUv",new s.BufferAttribute(this.U.slice(0,l*2),2)),o.setAttribute("aS",new s.BufferAttribute(this.S.slice(0,l*2),2)),o.computeBoundingSphere(),o.computeBoundingBox(),o}async toGeometrySteps(o){const l=new s.BufferGeometry,y=this.n,z=2500;if(l.setAttribute("position",new s.BufferAttribute(this.P.subarray(0,y*3),3)),await o.yield(),l.setAttribute("normal",new s.BufferAttribute(this.N.subarray(0,y*3),3)),await o.yield(),l.setAttribute("color",new s.BufferAttribute(this.C.subarray(0,y*3),3)),await o.yield(),l.setAttribute("aUv",new s.BufferAttribute(this.U.subarray(0,y*2),2)),l.setAttribute("aS",new s.BufferAttribute(this.S.subarray(0,y*2),2)),await o.yield(),y===0)return l.computeBoundingSphere(),l.computeBoundingBox(),l;const A=l.attributes.position.array;let K=1/0,V=1/0,L=1/0,H=-1/0,_=-1/0,M=-1/0;for(let k=0;k<y;k+=z){for(let v=k*3,U=Math.min(k+z,y)*3;v<U;v+=3){const $=A[v],T=A[v+1],Y=A[v+2];K=Math.min(K,$),V=Math.min(V,T),L=Math.min(L,Y),H=Math.max(H,$),_=Math.max(_,T),M=Math.max(M,Y)}await o.yield()}const q=(K+H)*.5,B=(V+_)*.5,G=(L+M)*.5;let W=0;for(let k=0;k<y;k+=z){for(let v=k*3,U=Math.min(k+z,y)*3;v<U;v+=3){const $=q-A[v],T=B-A[v+1],Y=G-A[v+2];W=Math.max(W,$*$+T*T+Y*Y)}await o.yield()}return l.boundingSphere=new s.Sphere(new s.Vector3(q,B,G),Math.sqrt(W)),l.boundingBox=new s.Box3(new s.Vector3(K,V,L),new s.Vector3(H,_,M)),l}}function Ae(S,o,l){const y=[[S,o-2*l],[S-l,o-2*l],[S-l,o-l],[S-2*l,o-l],[S-2*l,o],[-(S-2*l),o]],z=[];return z.push([S,-(o-2*l)],...y.slice(0,5)),z.push([-(S-2*l),o],[-(S-2*l),o-l],[-(S-l),o-l],[-(S-l),o-2*l],[-S,o-2*l]),z.push([-S,-(o-2*l)],[-(S-l),-(o-2*l)],[-(S-l),-(o-l)],[-(S-2*l),-(o-l)],[-(S-2*l),-o]),z.push([S-2*l,-o],[S-2*l,-(o-l)],[S-l,-(o-l)],[S-l,-(o-2*l)]),z}const lt=`
uniform sampler2D uFN;
uniform vec4 uFg;      // x mean top, y billow amp, z valley floor, w time
uniform vec4 uFg2;     // x gap threshold, y wake strength, z density (1/m), w flow speed (m/s)
uniform vec4 uGap;     // xz centre, z radius, w strength (the valley under the main span)
uniform vec4 uGap2;    // the same for the clearing at the portal tower
uniform vec4 uShip;    // xz of ship 0, zw unit heading
uniform vec2 uFlow; uniform float uShipDip;   // uShipDip: the level the fog stands at round ship 0 in the valley
uniform vec3 uFogLit; uniform vec3 uFogShade; uniform vec3 uCam; uniform float uCamH;
uniform vec4 uRift[4]; // rifts torn in the river down to the water: xz centre, zw half-axes (m)
uniform float uRiftK;  // 0 closed .. 1 open
uniform float uInK;    // tone of the fog seen from inside it (1; the world deepens it for the blind arrival)
vec3 frbN(vec2 p) { vec2 i = floor(p), f = p - i; f = f * f * (3. - 2. * f); return textureLod(uFN, (i + f + .5) / 64., 0.).rgb; }
float frbShipK = 0.;      // set by frbH: how far its point lies in the fog that stands round ship 0 (0..1)
float frbRiftK = 0.;      // set by frbH: how far its point lies inside a rift (0 fog .. 1 open water)
// a rift's rim wanders and breaks into bays and tongues that drift with the flow (q is the advected point)
float frbRift(vec2 p, vec2 q) {
  vec2 w = frbN(q * .0052 + 2.9).rg - .5;
  float w2 = (frbN(q * .019 + 6.1).b - .5) * .34 + (frbN(q * .033 + 1.7).r - .5) * .12, r = 0.;      // 50 m bays and 30 m tongues
  for (int i = 0; i < 4; i++) {
    vec2 d = (p - uRift[i].xy) / max(uRift[i].zw, vec2(1.));
    r = max(r, 1. - smoothstep(.38, 1.04, length(d + w * .42) + w2));
  }
  return r * uRiftK;
}
float frbH(vec2 p) {
  vec2 q = p - uFlow * (uFg.w * uFg2.w);
  vec2 a = vec2(dot(q, vec2(-uFlow.y, uFlow.x)), dot(q, uFlow) * .6);          // billows drawn out along the flow
  float rr = max(abs(p.x) * .55, abs(p.y));
  float f3 = 1. - smoothstep(600., 1400., rr);
  float far = 1. + 1.1 * smoothstep(1300., 3000., rr) + 1.3 * smoothstep(3000., 5600., rr);   // far banks pile higher and break the skyline
  float n = frbN(a * .0033).r * .5 + frbN(a * .0085 + 3.7).g * .32 + (frbN(a * .021 + 9.1).b - .5) * .18 * f3 + .09;
  float g = frbN(q * .00105 + 11.3).b;
  float gaps = smoothstep(uFg2.x, uFg2.x + .16, g);
  vec2 d = (p - uGap.xy) / vec2(uGap.z, uGap.z * 1.7);
  vec2 d2 = (p - uGap2.xy) / vec2(uGap2.z, uGap2.z * 1.7);
  float v = max(gaps, max(uGap.w * (1. - smoothstep(.45, 1., length(d))), uGap2.w * (1. - smoothstep(.45, 1., length(d2)))));
  float b = (n * 2. - 1.) * far;
  float h = mix(uFg.x + uFg.y * b, uFg.z + uFg.y * .5 * b, v);      // (a valley's floor lies flatter than the top: half its billows)
  // cauliflower: rounded heads with creases between them, real height near the bridge
  h += (frbN(a * .0125 + 5.3).g - .5) * 15. * (1. - .5 * v) * (1. - smoothstep(900., 1900., rr));          // 80 m lumps with real height near the bridge (half in a valley: its floor is many heads, not one dome)
  vec2 r = p - uShip.xy;
  float along = -dot(r, uShip.zw), lat = dot(r, vec2(-uShip.w, uShip.z));
  float beh = max(along, 0.), w = 7. + beh * .16;
  float fade = exp(-beh / 320.) * smoothstep(-30., 8., along) * (1. - smoothstep(46., 64., h)) * uFg2.y;
  float rim = (abs(lat) - w * 1.9) / (w * .8);
  h += (-exp(-lat * lat / (w * w)) + .55 * exp(-rim * rim)) * fade * 5.;
  // the fog stands higher round the ship in the valley: only her mast, radar and funnel top clear it
  vec2 hs = (p - uShip.xy + uShip.zw * 12.) / 62.;
  float k1 = uFg2.y * min(1.4 * exp(-dot(hs, hs)), 1.) * (1. - smoothstep(54., 70., h));
  h = mix(h, uShipDip + (n - .5) * 5., k1);
  // ... and forward of her house it never lies lower than her deck cargo (a long patch over the hull)
  vec2 rs = p - uShip.xy;
  vec2 hf = vec2(dot(rs, uShip.zw) - 100., dot(rs, vec2(-uShip.w, uShip.z))) / vec2(125., 44.);
  float k2 = uFg2.y * min(1.5 * exp(-dot(hf, hf)), 1.) * (1. - smoothstep(54., 70., h));
  h = mix(h, max(h, uShipDip - 2.5 + 4. * smoothstep(33., 37., uShipDip) + (n - .5) * 4.), k2);
  frbShipK = max(k1, k2);      // (a low dip still covers her tallest stacks, 34 m)
  frbRiftK = frbRift(p, q);
  h = mix(h, -12., frbRiftK);  // in a rift the river's top falls away to the water (the sheet thins out on the way down)
  return h;
}
float frbFogAmount(vec3 lp) {
  float H = frbH(lp.xz), rk = frbRiftK;
  float lo = min(uCam.y, lp.y), span = max(abs(uCam.y - lp.y), .5);
  float fr = .5 * (clamp((H - lo) / span, 0., 1.) + clamp((uCamH - lo) / span, 0., 1.));
  float f = 1. - exp(-uFg2.z * distance(uCam, lp) * fr);
  // seen from above, whatever stands below the fog top is drowned; from inside the fog only distance drowns it
  float cin = clamp((uCamH - uCam.y + 4.) / 10., 0., 1.);
  float Hn = H + (frbN(lp.xz * .09 + uFg.w * .05).r - .5) * 7.;                       // a broken, wispy drowning edge
  // with the camera in clear air (above the river, or low in a valley of it) the sight line to anything that stands above
  // its own fog top runs through air: only a breath of haze is left on it, however far off it is
  f *= 1. - .9 * (1. - cin) * smoothstep(Hn + 4., Hn + 45., lp.y);
  float edge = 1. - smoothstep(Hn - 2., Hn + mix(7., 26., smoothstep(150., 700., distance(uCam, lp))) + 6. * frbShipK, lp.y);      // (round ship 0 the bank is soft: her upper tiers fade into it over 13 m)                              // legs, cables and masts fade into the river with depth: a veil from ~20 m above its top
  return max(f, .95 * edge * edge * (1. - cin)) * (1. - .94 * smoothstep(.1, .38, rk) * (1. - cin));      // (seen from inside the fog a rift is as drowned as all else)      // in a rift the air is clear down to the water
}
vec3 frbFogColor() { float sunny = smoothstep(-16., 6., uCam.y - uCamH); return mix((uFogShade * .82 + uFogLit * .1) * uInK, mix(uFogShade, uFogLit, .66), sunny); }
vec3 frbSlab(vec3 col, vec3 lp) { return mix(col, frbFogColor(), frbFogAmount(lp)); }
`,ho=`
vec3 frbDome(vec2 p) {
  vec2 ip = floor(p), fp = p - ip; float ws = 0., hs = 0.; vec2 gs = vec2(0.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 o = textureLod(uFN, (ip + g + .5) / 64., 0.).rb * .8 + .1;
    vec2 r = g + o - fp; float d = dot(r, r), w = exp(-d * 7.5);
    ws += w; hs += w * (1. - d * 2.3); gs += w * r;
  }
  ws = max(ws, 1e-5);
  return vec3(max(hs / ws, 0.), gs / ws);
}
float frbLift(vec2 p) {
  float k = 1. - smoothstep(520., 1100., max(abs(p.x) * .55, abs(p.y)));
  if (k <= 0.) return 0.;
  vec2 q = p - uFlow * (uFg.w * uFg2.w * 1.2);
  vec2 wq = q + (frbN(q * .011 + 4.4).rg - .5) * 46.;
  float h1 = frbDome(wq / 66.).x, h2 = frbDome((wq + (frbN(q * .034 + 8.1).gb - .5) * 15.) / 24. + 31.7).x;
  return ((h1 - .55) * 11. + (h2 - .55) * 7.) * k;
}
`,uo=`
float frbDeckY(float x) { float t = x / 1350.; return 63. + 5. * (1. - t * t); }
float frbWrap(float x) { return mod(x + 1350., 2700.) - 1350.; }
`;function Bt(S,o=0,l={}){const y=new s.MeshStandardMaterial({color:16777215,vertexColors:!0,roughness:.6,metalness:.12,...l});return y.defines={...y.defines||{},FRB_MODE:o},y.onBeforeCompile=z=>{for(const A of Object.keys(S))z.uniforms[A]=S[A];z.vertexShader=z.vertexShader.replace("#include <common>",`#include <common>
        attribute vec2 aUv; attribute vec2 aS; uniform mat4 uInv; uniform vec4 uFg; uniform vec3 uPerp; uniform float uPx;
        varying vec3 vLp; varying vec2 vUvM; varying vec2 vS; varying vec2 vUpFlat;
        #if FRB_MODE == 1
        attribute vec2 aCar;
        #endif
        #if FRB_MODE == 2
        attribute vec3 aFlag;
        #endif
        ${uo}`).replace("#include <begin_vertex>",`vec3 transformed = position;
        #if FRB_MODE == 1
        float cx = frbWrap(aCar.x + aCar.y * uFg.w);
        transformed.x += cx; transformed.y += frbDeckY(transformed.x);
        #endif
        #if FRB_MODE == 2
        float fw = sin(aFlag.x * 7. - uFg.w * 5.2 + aFlag.y) + .45 * sin(aFlag.x * 15. - uFg.w * 8.3 + aFlag.y * 2.);
        transformed += uPerp * (fw * aFlag.z * aFlag.x);
        transformed.y += (.35 * sin(aFlag.x * 5. - uFg.w * 3.7 + aFlag.y) - .9 * aFlag.x) * aFlag.z * aFlag.x;
        #endif
        if (aS.x > 5.5 && aS.x < 6.5 && aS.y > .01) {      // main cables: never thinner than ~1.5 px
          float cd = distance(cameraPosition, (modelMatrix * vec4(position, 1.)).xyz);
          transformed += normal * max(cd * uPx * .75 - aS.y, 0.);
        }
        vLp = (uInv * (modelMatrix * vec4(transformed, 1.))).xyz; vUvM = aUv; vS = aS;
        vUpFlat = vec2(normal.y, step(.75, abs(normal.y)));`),z.fragmentShader=z.fragmentShader.replace("#include <common>",`#include <common>
        varying vec3 vLp; varying vec2 vUvM; varying vec2 vS; varying vec2 vUpFlat;
        uniform vec4 uLook;    // x wet, y frost, z flute pitch (m), w bounce
        uniform vec4 uLamps;   // x lamp level, y window level, z tower flood, w beacon
        uniform vec3 uPrimer; uniform vec3 uWarm; uniform vec3 uSkyCol; uniform vec3 uSun; uniform vec4 uStrutLo; uniform vec4 uStrutHi;
        float frbRough = .6; vec3 frbEmit = vec3(0.); float frbOcc = 1.; float frbUnder = 0.; float frbSunK = 1.;
        float frbSeam(float v, float period) { return (.5 - abs(fract(v / period) - .5)) * period; }
        // a dark line of half-width h at distance d from its centre, box-filtered over a pixel footprint fw
        float frbLine(float d, float h, float fw) { return (1. - smoothstep(h - .5 * fw - 1e-4, h + .5 * fw, d)) * min(1., 2. * h / max(fw, 1e-3)); }
        ${lt}`).replace("#include <color_fragment>",`#include <color_fragment>
        {
          float kind = vS.x; vec2 m = vUvM; vec2 fw2 = fwidth(m); float fw = max(fw2.x, fw2.y);
          float aa = 1. - smoothstep(.12, .7, fw);
          vec3 wn = textureLod(uFN, vec2(m.x * .013 + m.y * .0006, m.y * .0019), 0.).rgb;
          vec3 pn = textureLod(uFN, vLp.xy * .0052 + vec2(.31, .77), 0.).rgb;
          vec3 c = diffuseColor.rgb;
          if (kind < 1.5 || (kind > 5.5 && kind < 6.5)) {
            c *= .8 + .3 * mix(.5, wn.r, 1. - smoothstep(.5, 2., fw)) + .1 * (textureLod(uFN, vec2(m.x * .035 + .5, m.y * .008), 0.).g * 2. - 1.) * (1. - smoothstep(.15, .5, fw));
            float prim = smoothstep(.68, .74, pn.b) * step(kind, 1.5);
            c = mix(c, uPrimer, prim * .55);                                    // red-lead primer where the painters have been
            c *= 1. + .16 * (1. - smoothstep(.22, .3, pn.g));                              // fresh coats
            frbRough = mix(.62, .3, uLook.x * (.6 + .4 * wn.g));
            c = mix(c, vec3(.74, .8, .86), uLook.y * smoothstep(.4, .9, vUpFlat.x) * (.45 + .5 * wn.b));
            if (kind > 5.5 && vS.y > .01) c *= 1. - .4 * (1. - smoothstep(.3, .5 + fw, frbSeam(m.x, 15.)));   // cable bands
          }
          if (kind < .5 || (kind > 5.5 && kind < 6.5 && vS.y < .01)) {
            float sy = frbSeam(m.y, 3.2), sx = frbSeam(m.x + floor(m.y / 3.2) * 1.3, 2.6);
            float seam = max(frbLine(sy, .07, fw2.y), .4 * frbLine(sx, .05, fw2.x));
            vec2 pid = floor(vec2((m.x + floor(m.y / 3.2) * 1.3) / 2.6, m.y / 3.2));
            c *= mix(1., .9 + .2 * textureLod(uFN, (pid + .5) / 64., 0.).g, 1. - smoothstep(.25, .9, fw));
            // close to the eye (the truss beside and over the flight) the plates carry more: deeper seams, prouder rivets, a slow
            // weathering streak down each plate; gone by 120 m, so nothing shimmers far off
            float nearD = 1. - smoothstep(60., 120., distance(uCam, vLp));
            c *= 1. - (.36 + .24 * nearD) * seam;
            float riv = (1. - smoothstep(.14, .2, sy)) * smoothstep(.07, .1, sy) * step(.5, fract(m.x / .32));
            c *= 1. + (.22 + .2 * nearD) * riv * (1. - smoothstep(.02, .09, fw));
            c *= 1. + (textureLod(uFN, vec2(m.x * .021 + .37, m.y * .0031), 0.).b - .5) * .18 * nearD * (1. - smoothstep(.2, .8, fw));
          } else if (kind < 1.5) {
            float f = abs(fract(m.x / uLook.z) - .5) * 2.;
            float fa = 1. - smoothstep(.1, .42, fw2.x / uLook.z);
            c *= mix(.86, mix(.42, 1.15, smoothstep(.06, .62, f)), fa);
            vec3 gn = cross(dFdx(vLp), dFdy(vLp)); gn = gn / max(length(gn), 1e-6);
            float sunT = clamp(dot(uSun.xz, vec2(-gn.z, gn.x)) * 1.8, -1., 1.);
            c *= 1. - .42 * fa * sunT * sin((fract(m.x / uLook.z) - .5) * 6.2832);
            c *= 1. - .25 * frbLine(frbSeam(m.y, 6.4), .07, fw2.y);
          } else if (kind < 2.5) {
            float z = abs(m.y);
            float dash = step(fract(m.x / 12.), .28);
            float ln = frbLine(abs(z - 3.5), .09, fw2.y) * dash + frbLine(abs(z - 7.), .09, fw2.y) * dash + frbLine(abs(z - 10.1), .1, fw2.y);
            float mid = frbLine(abs(z - .28), .1, fw2.y);
            float aaR = 1. - smoothstep(.3, 1.6, fw);
            c *= .8 + .35 * wn.g - .12 * (1. - smoothstep(.3, .9, abs(fract(z / 3.5) - .5) * 2.)) ;
            c = mix(c, vec3(.56, .55, .5), clamp(ln, 0., 1.) * aaR * .9);
            c = mix(c, vec3(.62, .42, .06), mid * aaR * .9);
            frbRough = mix(.9, .34, uLook.x);
          } else if (kind < 3.5) {
            float bar = step(fract(m.x / .34), .3), rail = step(.86, vS.y) + step(vS.y, .1);
            float posts = step(fract(m.x / 3.75), .06);
            if (max(max(bar, rail), posts) < .5) { if (fw2.x < .16) discard; c *= .7; }
          } else if (kind < 4.5) {
            c *= .8 + .34 * wn.g;
            c *= 1. - .14 * frbLine(frbSeam(m.y, 1.5), .04, fw2.y);
            c *= mix(.78, 1., smoothstep(0., 30., vLp.y));
            frbRough = .92;
          } else if (kind < 5.5) {
            frbEmit = vColor.rgb * vS.y * uLamps.x;
          } else if (kind > 6.5 && kind < 7.5) {
            vec2 cell = vec2(m.x / 1.7, m.y / 2.9), id = floor(cell), fc = fract(cell);
            float lit = step(.42, textureLod(uFN, (id + .5) / 64., 0.).r);
            float win = step(.16, fc.x) * step(fc.x, .84) * step(.3, fc.y) * step(fc.y, .78) * (1. - vUpFlat.y);
            c = mix(c, vec3(.03, .05, .07), win);
            frbEmit = uWarm * win * lit * vS.y * uLamps.y * (1. - smoothstep(.3, 1.5, fw) * .6);
            frbRough = mix(.6, .2, win);
          } else if (kind > 7.5 && kind < 8.5) {
            vec2 cs = mix(vec2(12.4, 2.7), vec2(2.5, 12.4), vUpFlat.y);
            vec2 cell = m / cs, id = floor(cell), fc = fract(cell);
            vec3 h = textureLod(uFN, (id + vec2(.5 + floor(vLp.x * .0001), .5)) / 64., 0.).rgb;
            vec3 k = h.r < .28 ? vec3(.36, .08, .05) : h.r < .5 ? vec3(.04, .1, .22) : h.r < .68 ? vec3(.05, .25, .24) : h.r < .84 ? vec3(.5, .33, .07) : vec3(.42, .43, .44);
            float gap = smoothstep(.0, .03, fc.x) * (1. - smoothstep(.97, 1., fc.x)) * smoothstep(0., .05, fc.y) * (1. - smoothstep(.95, 1., fc.y));
            float corr = .9 + .1 * step(.5, fract(m.x / .3)) * (1. - vUpFlat.y) * (1. - smoothstep(.05, .2, fw));
            c = k * (.75 + .5 * h.g) * mix(.35, 1., gap) * corr;
            frbRough = .7;
          } else if (kind > 8.5) {
            // a ship's house: rows of small portholes (about one in four lit), plate seams, rust weeping from the ports
            float px = m.x / 2.6, row = (m.y - 15.) / 5.6, fx = fract(px), fy = fract(row);
            vec3 ph = textureLod(uFN, (vec2(floor(px), floor(row)) + .5) / 64., 0.).rgb;
            float port = (1. - smoothstep(.13, .13 + fw2.x * .5 + .02, abs(fx - .5))) * (1. - smoothstep(.058, .058 + fw2.y * .2 + .01, abs(fy - .62)));
            port *= step(.12, ph.b) * (1. - vUpFlat.y);
            c *= .86 + .2 * wn.g;
            c *= 1. - .1 * frbLine(frbSeam(m.y - 15., 2.8), .04, fw2.y) - .06 * frbLine(frbSeam(m.x, 5.2), .03, fw2.x);
            c *= 1. - .14 * (1. - smoothstep(.1, .2, abs(fx - .5))) * step(fy, .55) * smoothstep(.1, .55, fy) * step(.5, ph.g);
            c = mix(c, vec3(.03, .05, .07), port);
            frbEmit = uWarm * port * step(.74, ph.r) * vS.y * uLamps.y * (1. - smoothstep(.3, 1.5, fw) * .5);
            frbRough = mix(.55, .2, port);
          }
          if (kind < 1.5 || (kind > 5.5 && kind < 6.5)) {
            float dkY = 63. + 5. * (1. - vLp.x * vLp.x / 1822500.);
            float under = (1. - smoothstep(12.2, 15.3, abs(vLp.z))) * step(vLp.y, dkY - .6) * step(dkY - 9.6, vLp.y);
            frbUnder = under;
            // the soffit and everything between the trusses stands in the deck's own shade: the sun reaches it only where it
            // slants in under the slab, and then through the lattice
            float sdk = (dkY - .9 - vLp.y) / max(uSun.y, .05);
            float deckSh = 1. - smoothstep(13., 17., abs(vLp.z + uSun.z * sdk));
            frbSunK = 1. - under * mix(.55, .92, deckSh);
            frbOcc = (1. - .26 * smoothstep(.5, .9, -vUpFlat.x)) * (1. - .5 * under);
            // the towers: each tier stands lighter than the one below, shade gathers under every strut and ledge
            float tw = step(600., abs(vLp.x)) * step(abs(vLp.x), 680.) * step(58., vLp.y);
            vec4 dLo = uStrutLo - vec4(vLp.y), dHi = vec4(vLp.y) - uStrutHi;
            vec4 below = exp(-max(dLo, 0.) / 4.5) * step(0., dLo), above = exp(-max(dHi, 0.) / 9.) * step(0., dHi);
            float legs = 1. - smoothstep(5.5, 7., abs(abs(vLp.z) - 15.));
            float tone = mix(.8, 1.06, smoothstep(70., 228., vLp.y)) * (1. - .3 * legs * max(max(below.x, below.y), max(below.z, below.w))) * (1. + .1 * max(max(above.x, above.y), max(above.z, above.w)));
            frbOcc *= mix(1., tone, tw);
            // the reveals of the tower portals (the legs' inner faces and where the struts meet them) see less sky
            frbOcc *= 1. - .24 * (1. - smoothstep(.9, 1.9, abs(abs(vLp.z) - 10.9))) * step(600., abs(vLp.x)) * step(abs(vLp.x), 680.) * step(70., vLp.y);
            c *= frbOcc;
          }
          diffuseColor.rgb = c;
        }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = frbRough;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        totalEmissiveRadiance += frbEmit + diffuseColor.rgb * uSkyCol * .05;
        totalEmissiveRadiance += diffuseColor.rgb * mix(uFogLit, uFogShade, .6 * frbUnder) * (uLook.w * (1. - .35 * frbUnder)) * (.5 - .5 * vUpFlat.x) * (1. - .65 * smoothstep(70., 250., vLp.y)) * mix(1., .6, smoothstep(95., 125., vLp.y));
        totalEmissiveRadiance += diffuseColor.rgb * uWarm * uLamps.z * exp(-max(vLp.y - 66., 0.) / 85.) * step(vS.x, 1.5) * step(52., vLp.y);`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
reflectedLight.directDiffuse *= frbSunK; reflectedLight.directSpecular *= frbSunK;`).replace("#include <fog_fragment>",`gl_FragColor.rgb = frbSlab(gl_FragColor.rgb, vLp);
#include <fog_fragment>`)},y.customProgramCacheKey=()=>"frb-steel-"+o,y}const Kt=()=>s.UniformsUtils.clone(s.UniformsLib.fog);function Mo(S){return new s.ShaderMaterial({uniforms:{...Kt(),...S},fog:!0,transparent:!0,depthWrite:!0,vertexShader:`
      attribute vec3 aT; attribute vec2 aW; attribute vec3 color;
      uniform mat4 uInv; uniform vec3 uCam; uniform float uPx;
      varying vec3 vLp; varying vec3 vCol; varying float vA; varying float vSide;
      #include <fog_pars_vertex>
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.);
        vec3 lp = (uInv * wp).xyz; vLp = lp;
        vec3 tw = normalize(mat3(modelMatrix) * aT);
        vec3 toCam = cameraPosition - wp.xyz; float dist = length(toCam);
        vec3 sd = cross(tw, toCam); sd = sd / max(length(sd), 1e-4);
        float w = max(aW.y, dist * uPx * 1.05);
        vA = clamp(aW.y / w, .3, 1.); vSide = aW.x; vCol = color;
        wp.xyz += sd * (aW.x * w * .5);
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vLp; varying vec3 vCol; varying float vA; varying float vSide;
      uniform vec3 uSunCol; uniform vec3 uSkyCol;
      ${lt}
      #include <fog_pars_fragment>
      void main() {
        float rnd = .55 + .45 * (1. - vSide * vSide);
        vec3 col = vCol * (uSkyCol * .55 + uSunCol * (.25 + .5 * (.5 + .5 * vSide))) * rnd;
        col = frbSlab(col, vLp);
        gl_FragColor = vec4(col, vA);
        #include <fog_fragment>
      }`})}function Co(S){return new s.ShaderMaterial({uniforms:{...Kt(),...S},fog:!0,transparent:!0,depthWrite:!1,blending:s.AdditiveBlending,vertexShader:`
      attribute vec2 aOff; attribute vec4 aG; attribute vec2 aCar; attribute vec3 color;
      uniform mat4 uInv; uniform vec4 uLamps; uniform float uPx;
      varying vec2 vOff; varying vec3 vCol;
      ${uo}
      ${lt}
      #include <fog_pars_vertex>
      void main() {
        vec3 p = position;
        if (aG.w > 1.5) { float cx = frbWrap(aCar.x + aCar.y * uFg.w); p.x += cx; p.y += frbDeckY(p.x); }
        vec4 wp = modelMatrix * vec4(p, 1.);
        vec3 lp = (uInv * wp).xyz;
        float f = frbFogAmount(lp);
        vec4 mvPosition = viewMatrix * wp;
        float dist = length(mvPosition.xyz);
        float s = max(aG.x, dist * uPx * 3.) * (1. + 2.2 * f);
        float pulse = 1.;
        if (aG.y > 0.) { float ph = .5 + .5 * sin(uFg.w * aG.y * 6.2832 + aG.z); pulse = .12 + .88 * ph * ph * ph; }
        float level = aG.w > .5 && aG.w < 1.5 ? uLamps.w : uLamps.x;
        float thin = aG.x / s;
        vCol = color * pulse * level * (1. - f * (1. - .3 * exp(-dist * .0025))) * mix(1., thin * thin, .6) * (1. + 2.2 * f * .3);   // a lamp deep in fog fades out with distance
        vOff = aOff;
        mvPosition.xy += aOff * s;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vOff; varying vec3 vCol;
      #include <fog_pars_fragment>
      void main() {
        float r2 = dot(vOff, vOff);
        float g = max(exp(-r2 * 9.) - .0001, 0.) + .22 * max(exp(-r2 * 2.6) - .0743, 0.);
        gl_FragColor = vec4(vCol * g, 1.);
        #ifdef USE_FOG
        #ifdef FOG_EXP2
        gl_FragColor.rgb *= .4 + .6 * exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
        #else
        gl_FragColor.rgb *= 1. - .6 * smoothstep(fogNear, fogFar, vFogDepth);
        #endif
        #endif
      }`})}function Ao(S,o=1){return new s.ShaderMaterial({defines:{FRB_FINE:o?1:0},uniforms:{...Kt(),...S},fog:!0,transparent:!0,depthWrite:!0,side:s.FrontSide,vertexShader:`
      varying vec3 vLp; varying vec3 vN; varying float vSh; varying float vRk;
      uniform vec3 uSun;
      ${lt}
      ${ho}
      #include <fog_pars_vertex>
      void main() {
        vec2 p = position.xz; float h = frbH(p), e = 10.;
        float shipK = frbShipK; vRk = frbRiftK;
        float hx = frbH(p + vec2(e, 0.)) - h, hz = frbH(p + vec2(0., e)) - h;
        vN = normalize(vec3(-hx, e, -hz));
        // near the bridge the heads have real height: silhouettes and parallax, not only shading
        // (round the ship the heads keep their shading but lose their height: a gap between two heads would bare her cargo)
        float hl = h + frbLift(p) * (1. - .85 * shipK);
        // under a low sun the heads shade one another: two looks toward the sun (16 m and 40 m), worked out per vertex of
        // the 5-10 m cells, so the shade is a soft dapple with no edge; far off, where the heads have no height, there is none
        float sl = max(length(uSun.xz), 1e-3); vec2 sdir = uSun.xz / sl; float tanE = uSun.y / sl;
        vec2 p1 = p + sdir * 16., p2 = p + sdir * 40.;
        // (the sheet's real relief is gentle, as its shading normal is steeper than its slope: the same exaggeration here)
        float o1 = (frbH(p1) + frbLift(p1) - hl) * 2.6 - 16. * tanE, o2 = (frbH(p2) + frbLift(p2) - hl) * 2.6 - 40. * tanE;
        vec2 p3 = p + sdir * 110.; float o3 = (frbH(p3) + frbLift(p3) - hl) * 2.2 - 110. * tanE;
        vSh = max(max(smoothstep(-8., 17., o1), smoothstep(-8., 21., o2)), .8 * smoothstep(-9., 24., o3)) * (1. - smoothstep(860., 990., abs(p.x))) * (1. - smoothstep(350., 445., abs(p.y)));      // only on the even 5-10 m cells of the core: on the big outer cells it would show their edges
        // ... but never over the eye of a camera that is flying in clear air above the river (no popping through a head)
        float dc = distance(p, uCam.xz), clearAir = 1. - clamp((uCamH - uCam.y + 4.) / 10., 0., 1.);
        h = mix(hl, min(hl, max(h, uCam.y - 4.5 + dc * .4)), clearAir * (1. - smoothstep(20., 70., dc)));
        vec3 lp = vec3(p.x, h, p.y); vLp = lp;
        vec4 mvPosition = modelViewMatrix * vec4(lp, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vLp; varying vec3 vN; varying float vSh; varying float vRk;
      uniform vec3 uSun; uniform vec3 uSunCol; uniform vec4 uStrutY; uniform float uShadeK; uniform float uRelief;
      uniform vec4 uPG; uniform vec3 uPGc;      // the portal's light on the fog under it: xz centre, radius, strength; colour
      ${lt}
      ${ho}
      #include <fog_pars_fragment>
      // a tower's shadow: both legs are solids 14 m deep along the bridge (tapering upward), so under a sun that stands across
      // the bridge they throw one long band 17 to 23 m wide to the lee side, soft at its edges and softer with distance
      float frbLeg(vec3 P, float xT, vec3 S, float zc) {
        float sz = abs(S.z) < 1e-3 ? 1e-3 : S.z;
        float s = (zc - P.z) / sz;
        vec3 Q = P + S * s;
        float soft = 1.6 + s * .009, hw = 7.2 - Q.y * .012;
        return (1. - smoothstep(hw - soft, hw + soft, abs(Q.x - xT))) * step(0., s) * (1. - smoothstep(224., 236., Q.y)) * (1. - smoothstep(900., 2100., s));
      }
      float frbTower(vec3 P, float xT, vec3 S) { return max(frbLeg(P, xT, S, 15.), frbLeg(P, xT, S, -15.)); }
      // the main cables' shadows: two long curves lying across the fog (a little wider than true, so they read)
      float frbCableY(float x) { float ax = abs(x), t = min(ax / 640., 1.), q = clamp((ax - 640.) / 345., 0., 1.); return ax <= 640. ? 71.5 + 154.5 * t * t : 226. - 159.4 * q - 48. * q * (1. - q); }
      float frbCable(vec3 P, vec3 S, float zc) {
        float sz = abs(S.z) < 1e-3 ? 1e-3 : S.z;
        float s = (zc - P.z) / sz; vec3 Q = P + S * s;
        float w = 1.0 + s * .006, d = abs(Q.y - frbCableY(Q.x));
        return step(0., s) * step(abs(Q.x), 985.) * (1. - smoothstep(w, w * 2.4 + .5, d)) * (1. - smoothstep(500., 1500., s));
      }
      // the curtains of suspenders: a ladder of faint stripes between the cable's shadow and the deck's (wider than true, so it reads)
      float frbHarp(vec3 P, vec3 S, float zc) {
        float sz = abs(S.z) < 1e-3 ? 1e-3 : S.z;
        float s = (zc - P.z) / sz; vec3 Q = P + S * s;
        float dk = 63. + 5. * (1. - Q.x * Q.x / 1822500.), st = abs(fract(Q.x / 15. + .5) - .5) * 15., w = .7 + s * .004;
        return step(0., s) * step(abs(Q.x), 985.) * step(dk, Q.y) * step(Q.y, frbCableY(Q.x)) * (1. - smoothstep(w, w * 2.6 + 1.2, st)) * (1. - smoothstep(300., 900., s));
      }
      void main() {
        vec3 toCam = uCam - vLp; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-3);
        vec2 q = vLp.xz - uFlow * (uFg.w * uFg2.w * 1.2);
        float graze = max(abs(V.y), .06);
        float foot = dist * .35 / graze;
        // the heads fade to a smooth sea as their cells shrink under a pixel (they sparkled at grazing angles)
        vec3 hf = vec3(1. - smoothstep(10., 50., foot * .12), 1. - smoothstep(6., 26., foot * .008), 1. - smoothstep(6., 26., foot * .003));
        // the cells are looked up through a slow warp, so the creases between heads wander instead of running straight
        vec2 wq = q + (frbN(q * .011 + 4.4).rg - .5) * 46.;
        vec3 c1 = frbDome(wq / 66.), c2 = frbDome((wq + (frbN(q * .034 + 8.1).gb - .5) * 15.) / 24. + 31.7);
        float h1 = c1.x, h2 = c2.x;                                             // pillow profiles: 1 on the head, 0 in the gaps
        vec2 G = c1.yz * (hf.z * 2.2) + c2.yz * (hf.y * 1.6);                  // uphill slope: flat on the head, steeper at its rim (gentle: fog has no edges)
        float nearK = 1. - smoothstep(50., 260., dist);                         // close to the eye the small heads carry the picture
        float valK0 = (1. - smoothstep(.08, .7, clamp((vLp.y - uFg.z) / max(uFg.x - uFg.z, 1.), 0., 1.2))) * nearK;      // down in a valley beside the eye the small cells' slopes are gentler: vapour, not a creased skin
        #if FRB_FINE == 1
        vec3 c3 = frbDome((wq + (frbN(q * .09 + 2.7).br - .5) * 14.) / 8.5 + 11.3);
        float h3 = c3.x;
        G += c3.yz * (hf.x * (.9 + .7 * nearK) * (1. - .3 * valK0));
        #else
        float h3 = .7;
        #endif
        // fleece: within ~140 m of the eye a fourth, small scale of heads (3.6 m), so the sheet beside the eye is cotton
        float nearF = (1. - smoothstep(35., 140., dist)) * (1. - smoothstep(10., 50., foot * .3)), h4 = .7;
        #if FRB_FINE == 1
        if (nearF > .01) {
          vec3 c4 = frbDome((wq + (frbN(q * .23 + 7.7).rg - .5) * 3.6) / 3.6 + 53.1);
          h4 = c4.x; G += c4.yz * (1.2 * nearF * (1. - (.5 + .2 * uRelief) * valK0));
        }
        #endif
        float fine = frbN(q * .21 + 2.3).g;
        float swell = mix(.45, 1.15, smoothstep(500., 2400., dist));           // far off, where the heads have melted away, the long banks carry the form
        vec3 N = normalize(vec3(vN.x * swell - G.x, vN.y, vN.z * swell - G.y));      // the heads carry the shading; the long swells only a little (they made blotches)
        float hh = clamp((vLp.y - uFg.z) / max(uFg.x - uFg.z, 1.), 0., 1.2);
        float crest = (vLp.y - uFg.x) / max(uFg.y, 1.);                         // -1 troughs .. +1 crests of the big billows
        float cc = clamp(crest, -1., 1.);
        float head = mix(.7, h1, hf.z) * .56 + mix(.7, h2, hf.y) * .3 + mix(.7, h3, hf.x) * .14;   // 0 in the gaps between the heads .. 1 on their tops
        // a faster layer of wisps drawn out down the wind, sliding over the heads
        vec2 qw = vLp.xz - uFlow * (uFg.w * uFg2.w * 1.8);
        vec2 qs = vec2(dot(qw, vec2(-uFlow.y, uFlow.x)), dot(qw, uFlow));
        float wisp = frbN(qs * vec2(.06, .014) + 7.7).r * .6 + frbN(qs * vec2(.15, .035) + 1.3).g * .4;
        // fog is a scatterer: the terminator is wide and broken by the wisps, the shade is luminous, nothing has a ruled edge
        float ndl = dot(N, uSun);
        float topW = smoothstep(.3, .8, hh);
        float sunF = smoothstep(uSun.y - .66 + .3 * uRelief * topW, uSun.y + .6, ndl + (wisp - .5) * mix(.35, .18, smoothstep(250., 900., dist)));      // level fog stands half-way (lower under a low sun: uRelief)      // level fog stands half-way: what leans to the sun is bright, what leans away is in shade
        // creases: each scale of heads dims its own folds a little, so the sheet reads as billows even when the sun is behind the eye
        float midK = smoothstep(150., 400., dist) * (1. - smoothstep(900., 1600., dist));      // deeper folds in the middle distance only: relief under a raking sun, nothing ruled near or far
        float valK = (1. - smoothstep(.08, .7, hh)) * nearK;                    // down in a valley, close to the eye: the folds between the small heads are deep
        float crease = mix(1., mix(.73 - .08 * midK, 1., smoothstep(.06, .7, h1)), hf.z) * mix(1., mix(.81 - .06 * midK - .14 * valK, 1., smoothstep(.06, .7, h2)), hf.y) * mix(1., mix(.86 - .12 * nearK - .06 * valK, 1., smoothstep(0., .85, h3)), hf.x) * mix(1., mix(.8, 1.04, smoothstep(0., .8, h4)), nearF);
        float ao = crease * (.86 + .28 * mix(.5, fine * .4 + wisp * .6, hf.x));
        float hollow = mix(.42, 1., smoothstep(.08, .95, hh));                  // valleys and gaps: cooler, but their heads still reach the sun
        // relief on the open top under a low sun (uRelief, set by the world per look): the troughs of the big billows and the gaps
        // between the heads fall into shade, what leans away from the sun goes deeper
        float trough = (1. - smoothstep(-.75, .4, cc)) * topW;
        float lit = ao * mix(.36 - .14 * uRelief * topW, 1., sunF) * mix(.86, 1., smoothstep(-1., .35, cc)) * hollow * (1. - .34 * uRelief * trough);
        lit *= 1. - .3 * uRelief * topW * (1. - smoothstep(.15, .7, head));
        // down in a valley the tops of the heads stand in the sun and the folds between them fall into cool shade
        lit *= mix(1., mix(.34, 1.15, smoothstep(.2, .8, head)), 1. - smoothstep(.08, .7, hh));
        // close to the eye the sheet is cotton, not a smooth skin: three octaves of soft fluff
        float fluff = frbN(q * .047 + 6.1).r * .5 + frbN(q * .12 + 1.9).g * .32 + frbN(q * .31 + 4.3).b * .18;      // 20 m, 8 m and 3 m
        lit *= mix(1., mix(.44 + 1.12 * fluff, .56 + .88 * fluff, smoothstep(.3, .8, hh)), nearK);
        // the heads' shade on one another (soft, broken by the wisps)
        float selfSh = clamp(vSh * (.6 + .8 * fluff) + (wisp - .5) * .3 * step(.02, vSh), 0., 1.) * smoothstep(30., 150., dist);      // (per vertex of 5 m cells: close to the eye it would show them as facets)
        lit *= 1. - min(.66 * (.6 + .4 * uShadeK) + .2 * valK, .84) * selfSh;
        // thin veils of mist drawn out down the wind lie over the heads and hide their relief in streaks
        float veil = smoothstep(.36, .88, frbN(qs * vec2(.021, .0052) + 3.1).b * .65 + wisp * .35) * mix(.5, .38, smoothstep(250., 900., dist));
        lit = mix(lit, .7 * hollow, veil);
        // down in a valley, close to the eye: bright streaks of mist torn off the heads slide over them down the wind, faster than the heads
        vec2 qf = vLp.xz - uFlow * (uFg.w * uFg2.w * 2.6);
        vec2 qt = vec2(dot(qf, vec2(-uFlow.y, uFlow.x)), dot(qf, uFlow));
        float streak = smoothstep(.48, .74, frbN(qt * vec2(.105, .0105) + 5.9).r * .58 + frbN(qt * vec2(.26, .027) + 2.2).g * .42) * valK * (.4 + .6 * hf.x);
        lit = mix(lit, 1.1, streak * .9);
        // shadows: the deck strip and both towers, projected along the sun onto the fog
        float sy = max(uSun.y, .05);
        float sd = (64. - vLp.y) / sy; vec3 Qd = vLp + uSun * sd; float softd = 3. + sd * .1;      // (a wide penumbra: under a high moon the strip lies close under the deck and would be ruled)
        float sh = step(0., sd) * (1. - smoothstep(16. - softd, 16. + softd, abs(Qd.z))) * step(abs(Qd.x), 1350.) * (1. - smoothstep(60., 220., sd)) * .8;
        sh = max(sh, .96 * max(frbTower(vLp, 640., uSun), frbTower(vLp, -640., uSun)));
        sh = max(sh, .92 * max(frbCable(vLp, uSun, 15.), frbCable(vLp, uSun, -15.)));
        sh = max(sh, .34 * max(frbHarp(vLp, uSun, 15.), frbHarp(vLp, uSun, -15.)) * (1. - smoothstep(300., 750., dist)));      // (faint and soft: a hard ladder of stripes reads as facets on the fog)
        lit *= 1. - .8 * sh;
        // every darkening goes toward a pale, luminous cool shade (bluer in the hollows), never toward grey and never to a dark blot
        vec3 shadeC = mix(mix(uFogShade, uFogLit, .28 - .16 * uRelief * topW), uFogShade, (1. - hollow) * 1.3) * .9;
        // the tone map presses everything above ~0.45 into white, so from above what leans away from the sun goes a little
        // deeper (uShadeK, set by the world per look): still soft and luminous, but the billows get a lit and a shaded side
        float topK = uShadeK * smoothstep(.3, .8, hh);
        float tl = smoothstep(.3 * topK, 1.05, lit);
        // down in a valley, close to the eye, the folds between the small heads fall into a deeper cool shade: cauliflower, not a skin
        float fold = valK * (1. - smoothstep(.15, .7, mix(.7, h2, hf.y) * .42 + mix(.7, h3, hf.x) * .34 + mix(.7, h4, nearF) * .24)) * (1. - .85 * streak) * (1. - .45 * max(uRelief, 1. - uShadeK));      // (under a low sun the folds would read as a creased skin: there the floor is vapour)
        shadeC *= (1. - (.28 + .14 * uRelief) * topK * (1. - tl)) * (1. - .36 * fold) * (1. - .2 * selfSh * valK);
        vec3 col = mix(shadeC, uFogLit * (.86 - .07 * uRelief), tl * (1. - .5 * fold));
        // cotton: close to the eye the gaps between the small heads (8.5 m and 3.6 m) go down in value, most of all in a valley,
        // where the heads also shade one another; the tone map leaves no room for this between the lit and the shade colour
        float cot = mix(.7, h3, hf.x) * .5 + mix(.7, h4, nearF) * .5;
        col *= 1. - nearK * mix(.4, 1., 1. - smoothstep(.08, .7, hh)) * (.32 * (1. - .45 * max(uRelief, 1. - uShadeK)) * (1. - smoothstep(.12, .7, cot)) * (1. - .8 * streak) + .14 * selfSh);
        // a rift's wall is vapour pouring down toward the water: soft, streaked down its fall, cooler with depth, no creases
        float wallK = smoothstep(.04, .26, vRk);
        if (wallK > 0.) {
          vec3 Nw = normalize(vN);
          vec2 tw = vec2(-Nw.z, Nw.x); tw = tw / max(length(tw), 1e-3);
          float sC = dot(vLp.xz, tw), fall = uFg.w * .09;
          float pourN = frbN(vec2(sC * .012, vLp.y * .012 + fall)).r * .6 + frbN(vec2(sC * .03 + 3.3, vLp.y * .026 + fall * 1.7)).g * .4;
          float deep = smoothstep(-6., 62., vLp.y);
          float lw = smoothstep(-.7, .9, dot(Nw, uSun) * .45 + (pourN - .5) * .3);      // (the wall's own facets, 10 m cells on a steep fall, must not show: its light comes mostly from the pour)
          vec3 wc = mix(mix(uFogShade, uFogLit, .3) * mix(.74, .95, deep), uFogLit * mix(.74, .9, deep), lw * (.7 + .3 * pourN));      // light veils: over the dark water a dim veil reads as murk
          wc *= mix(.84, 1.07, fluff) * mix(.9, 1.05, smoothstep(.2, .8, frbN(vec2(sC * .06 + 7.1, vLp.y * .03 + fall * 2.3)).b));      // cotton and streaks: never one smooth pale ramp
          col = mix(col, wc, wallK * .92);
        }
        col = mix(col, mix(uFogShade, uFogLit, .14) * .76, sh * .76);                              // the long soft shadows of the towers and the deck carry the drama
        col += uFogLit * (.16 - .08 * uRelief) * (1. - sunF) * smoothstep(.3, .9, head) * (1. - sh);                // light bleeding through the thin tops
        col += uSunCol * .24 * smoothstep(uSun.y + .04, uSun.y + .5, ndl) * (1. - .5 * veil) * (1. - sh);   // a warm rim on whatever leans toward the sun
        float grz = max(1. - abs(dot(N, V)), 0.);
        float back = max(dot(-V, uSun), 0.); back *= back; back *= back;
        col += uSunCol * .45 * back * grz * clamp(head * 1.2 - .1, 0., 1.) * (1. - sh);           // back-lit rims on the heads
        // fuzz: a brow of fog seen edge-on pales into the mist behind it, so crests have no drawn outline; and down in a
        // valley of the river the far heads recede into a luminous haze, layer behind layer
        vec3 paleC = mix(uFogShade, uFogLit, .7 - .22 * uRelief) * .92;
        col = mix(col, paleC, grz * grz * sqrt(grz) * (.5 - .12 * uRelief) * (1. - .6 * sh) * mix(.4, 1., smoothstep(.08, .7, hh)));
        col = mix(col, mix(uFogShade, uFogLit, .36) * .9, (1. - smoothstep(.1, .85, hh)) * (1. - exp(-max(dist - 60., 0.) / 300.)) * .5);      // a cooler haze than the top's, and later: the floor keeps a value step under its lit heads
        // far off the sheet melts into the horizon haze, and its rim fades out, so there is no ruled line
        #ifdef USE_FOG
        col = mix(col, fogColor, .8 * smoothstep(2000., 5600., dist));
        col = mix(col, fogColor, .5 * smoothstep(.9, 1., 1. - abs(dot(normalize(vN), V))) * smoothstep(150., 600., dist));   // the brow of a bank seen edge-on pales: softer skylines
        #endif
        { vec2 pg = (vLp.xz - uPG.xy) / max(uPG.z, 1.); col += uPGc * (uPG.w * exp(-dot(pg, pg)) * (.4 + .6 * head)); }      // the portal's light lies on the fog under it
        float rimA = 1. - smoothstep(5000., 5950., max(abs(vLp.x) * .97, abs(vLp.z)));
        // seen from inside the fog (the camera below the local fog top) the sheet's far valleys drown like everything else
        float cin = clamp((uCamH - uCam.y + 4.) / 10., 0., 1.);
        col = mix(col, frbFogColor(), cin * (1. - exp(-uFg2.z * dist)));
        // from inside the fog the sheet is not part of the view at all (the world's own gradient stands in): any slope of it
        // that faces a camera below it would otherwise show as a flat patch. It comes in over the last metres of the climb.
        float alpha = smoothstep(2., 16., dist) * rimA * (1. - smoothstep(.5, .98, cin));
        // a rift: the wall thins out toward the water in torn wisps, and the water shows under it
        // (its lower two thirds are veils: the dark water shows through them more and more toward the hole)
        float veilN = frbN(q * .017 + 5.7).r * .55 + wisp * .45;
        alpha *= 1. - smoothstep(.02, .22, vRk) * (1. - smoothstep(8., 70., vLp.y + (veilN - .5) * 54.));
        // ... and its lip is torn into veils drawn out down the wind: no ruled rim, the water shows between the streaks
        float tearN = frbN(qs * vec2(.052, .012) + 9.3).g * .6 + frbN(qs * vec2(.13, .03) + 4.1).r * .4;
        alpha *= 1. - smoothstep(.0, .1, vRk) * (1. - smoothstep(.5, .85, vRk)) * smoothstep(.36, .7, tearN * .7 + wisp * .3) * .88;
        if (alpha < .004) discard;
        gl_FragColor = vec4(col, alpha);
        #include <fog_fragment>
      }`})}class co{constructor(){this.P=[],this.T=[],this.W=[],this.C=[],this.I=[]}seg(o,l,y,z){const A=l[0]-o[0],K=l[1]-o[1],V=l[2]-o[2],L=Math.hypot(A,K,V)||1,H=this.P.length/3;for(const _ of[o,o,l,l])this.P.push(_[0],_[1],_[2]),this.T.push(A/L,K/L,V/L),this.C.push(z[0],z[1],z[2]);this.W.push(-1,y,1,y,-1,y,1,y),this.I.push(H,H+1,H+2,H+1,H+3,H+2)}toGeometry(){const o=new s.BufferGeometry;return o.setAttribute("position",new s.Float32BufferAttribute(this.P,3)),o.setAttribute("aT",new s.Float32BufferAttribute(this.T,3)),o.setAttribute("aW",new s.Float32BufferAttribute(this.W,2)),o.setAttribute("color",new s.Float32BufferAttribute(this.C,3)),o.setIndex(this.I),o.computeBoundingSphere(),o}}const No=(async function(o,l={}){const y=o.rng.fork("fog-river-bridge"),z=y.fork("geo"),A=y.fork("fog"),K=y.fork("traffic"),V=y.fork("ship"),L=y.fork("look"),H=o.quality?.detail??1,_=o.vary||{},M=l.palette&&l.palette.length>=7?l.palette:["#cb552d","#f6f1e8","#8da2c6","#b3ada0","#1c2530","#ffb24a","#ff3b28"],q=l.hour??_.hour??"day",B={dawn:1,day:1,golden:1,night:1}[q]?q:"day",G={dawn:[1,1,.1],day:[.5,.55,0],golden:[.85,.85,.07],night:[1.5,1.4,.5]}[B],W=mt(_.density??1,.6,1.4),k=new s.Color(M[0]);k.offsetHSL(L.range(-.012,.014),L.range(-.04,.05)-.07,L.range(-.03,.03)-.012);const v=[k.r,k.g,k.b],U=ue(v,.8),$=vt(M[3]),T=vt(M[4]),Y=vt(M[5]),se=vt(M[6]),ee=L.int(0,1),Ne=L.range(.07,.1),Ee=L.range(1.5,2.1),We=l.wet??L.range(.2,.6),ce=l.season==="winter"?.7:0,Le=l.fogTop??A.range(78,88),Pe=l.fogAmp??A.range(9,13),we=A.range(35,41),Se=A.range(-.4,.4),j=[Math.sin(Se),-Math.cos(Se)],qe=A.range(-70,-10),Dt=A.range(-30,60),po=A.range(280,320),le=-me+7.5*Math.round((L.range(40,100)*.4-28+me)/7.5)-1.2,Je=qe-L.range(95,125),bt=l.sunDir||[-.6,.7,.4],Vt=new s.Vector3(bt[0],bt[1],bt[2]).normalize();await o.yield();const Ge=new Uint8Array(4096*4);for(let e=0;e<Ge.length;e++)Ge[e]=Math.floor(A()*256);const Be=new s.DataTexture(Ge,64,64,s.RGBAFormat);Be.wrapS=Be.wrapT=s.RepeatWrapping,Be.magFilter=Be.minFilter=s.LinearFilter,Be.generateMipmaps=!1,Be.needsUpdate=!0,await o.yield();const je=ee===0?[[104,116],[150,158],[189,196],[219,226]]:[[112,126],[170,180],[217,226],[217,226]],N={uFN:{value:Be},uFg:{value:new s.Vector4(Le,Pe,we,0)},uFg2:{value:new s.Vector4(A.range(.62,.7),l.ships===0?0:1,.03,A.range(6,9))},uGap:{value:new s.Vector4(qe,Dt,po,1)},uGap2:{value:new s.Vector4(-ie+50,10,190,0)},uShip:{value:new s.Vector4(Je,9999,0,-1)},uFlow:{value:new s.Vector2(j[0],j[1])},uShipDip:{value:46.5},uFogLit:{value:new s.Color(M[1]).multiplyScalar(.94)},uFogShade:{value:new s.Color(M[2]).lerp(new s.Color("#ffffff"),.2).multiplyScalar(.8)},uCam:{value:new s.Vector3(0,300,800)},uCamH:{value:Le},uInv:{value:new s.Matrix4},uPerp:{value:new s.Vector3(-j[1],0,j[0])},uPx:{value:.0011},uLook:{value:new s.Vector4(We,ce,Ee,.22)},uLamps:{value:new s.Vector4(G[0],G[1],G[2],1)},uPrimer:{value:new s.Color("#b0503f")},uWarm:{value:new s.Color("#ffc078").multiplyScalar(2.6)},uSun:{value:Vt.clone()},uSunCol:{value:new s.Color("#fff0d8")},uSkyCol:{value:new s.Color("#9db8e6")},uStrutY:{value:new s.Vector4(...je.map(e=>(e[0]+e[1])/2))},uShadeK:{value:0},uRelief:{value:0},uStrutLo:{value:new s.Vector4(...je.map(e=>e[0]-.8))},uStrutHi:{value:new s.Vector4(...je.map(e=>e[1]+1))},uRift:{value:[0,1,2,3].map(()=>new s.Vector4(1e5,1e5,1,1))},uRiftK:{value:0},uInK:{value:1},uPG:{value:new s.Vector4(-ie,0,150,0)},uPGc:{value:new s.Color("#ffe0b0")}},ve=(e,t,a)=>{const f=Math.floor(e),r=Math.floor(t);let u=e-f,i=t-r;u=u*u*(3-2*u),i=i*i*(3-2*i);const n=f&63,p=f+1&63,m=(r&63)*64,b=(r+1&63)*64,c=Ge[(m+n)*4+a],d=Ge[(m+p)*4+a],g=Ge[(b+n)*4+a],x=Ge[(b+p)*4+a];return(c+(d-c)*u+(g+(x-g)*u-c-(d-c)*u)*i)/255},de=(e,t,a)=>wt(e,t,a);let ft=0;function _t(e,t,a,f){const r=N.uRiftK.value,u=N.uRift.value;if(r<=0)return 0;let i=!1;for(let c=0;c<4;c++){const d=u[c];if(Math.abs(e-d.x)<d.z*1.52&&Math.abs(t-d.y)<d.w*1.52){i=!0;break}}if(!i)return 0;const n=ve(a*.0052+2.9,f*.0052+2.9,0)-.5,p=ve(a*.0052+2.9,f*.0052+2.9,1)-.5,m=(ve(a*.019+6.1,f*.019+6.1,2)-.5)*.34+(ve(a*.033+1.7,f*.033+1.7,0)-.5)*.12;let b=0;for(let c=0;c<4;c++){const d=u[c],g=(e-d.x)/Math.max(d.z,1)+n*.42,x=(t-d.y)/Math.max(d.w,1)+p*.42,I=Math.hypot(g,x)+m;I<1.04&&(b=Math.max(b,1-de(.38,1.04,I)))}return b*r}function mo(e,t){const a=N.uFg.value.w*N.uFg2.value.w;return _t(e,t,e-j[0]*a,t-j[1]*a)}function gt(e,t){const a=N.uFg.value,f=N.uFg2.value,r=N.uGap.value,u=N.uShip.value,i=a.w*f.w,n=e-j[0]*i,p=t-j[1]*i,m=n*-j[1]+p*j[0],b=(n*j[0]+p*j[1])*.6,c=Math.max(Math.abs(e)*.55,Math.abs(t)),d=1-de(600,1400,c),g=1+1.1*de(1300,3e3,c)+1.3*de(3e3,5600,c),x=ve(m*.0033,b*.0033,0)*.5+ve(m*.0085+3.7,b*.0085+3.7,1)*.32+(ve(m*.021+9.1,b*.021+9.1,2)-.5)*.18*d+.09,I=ve(n*.00105+11.3,p*.00105+11.3,2),X=(e-r.x)/r.z,E=(t-r.y)/(r.z*1.7),P=N.uGap2.value,O=(e-P.x)/P.z,ne=(t-P.y)/(P.z*1.7),J=Math.max(de(f.x,f.x+.16,I),r.w*(1-de(.45,1,Math.hypot(X,E))),P.w*(1-de(.45,1,Math.hypot(O,ne)))),h=(x*2-1)*g;let w=Ve(a.x+a.y*h,a.z+a.y*.5*h,J);w+=(ve(m*.0125+5.3,b*.0125+5.3,1)-.5)*15*(1-.5*J)*(1-de(900,1900,c));const F=e-u.x,C=t-u.y,R=-(F*u.z+C*u.w),Q=F*-u.w+C*u.z,Ue=Math.max(R,0),fe=7+Ue*.16,Ke=Math.exp(-Ue/320)*de(-30,8,R)*(1-de(46,64,w))*f.y,it=(Math.abs(Q)-fe*1.9)/(fe*.8);w+=(-Math.exp(-Q*Q/(fe*fe))+.55*Math.exp(-it*it))*Ke*5;{const ke=F+u.z*12,De=C+u.w*12,Ze=f.y*Math.min(1.4*Math.exp(-(ke*ke+De*De)/3844),1)*(1-de(54,70,w));w+=(N.uShipDip.value+(x-.5)*5-w)*Ze,ft=Ze}{const ke=(F*u.z+C*u.w-100)/125,De=(F*-u.w+C*u.z)/44,Ze=f.y*Math.min(1.5*Math.exp(-(ke*ke+De*De)),1)*(1-de(54,70,w));w+=(Math.max(w,N.uShipDip.value-2.5+4*de(33,37,N.uShipDip.value)+(x-.5)*4)-w)*Ze,Ze>ft&&(ft=Ze)}{const ke=_t(e,t,n,p);ke>0&&(w+=(-12-w)*ke)}return w}const It=(e,t)=>{const a=Math.floor(e),f=Math.floor(t),r=e-a,u=t-f;let i=0,n=0;for(let p=-1;p<=1;p++)for(let m=-1;m<=1;m++){const b=((f+p&63)*64+(a+m&63))*4,c=m+Ge[b]/255*.8+.1-r,d=p+Ge[b+2]/255*.8+.1-u,g=c*c+d*d,x=Math.exp(-g*7.5);i+=x,n+=x*(1-g*2.3)}return Math.max(n/Math.max(i,1e-5),0)};function Ht(e,t){const a=1-de(520,1100,Math.max(Math.abs(e)*.55,Math.abs(t)));if(a<=0)return 0;const f=N.uFg.value.w*N.uFg2.value.w*1.2,r=e-j[0]*f,u=t-j[1]*f,i=r*.011+4.4,n=u*.011+4.4,p=r*.034+8.1,m=u*.034+8.1,b=r+(ve(i,n,0)-.5)*46,c=u+(ve(i,n,1)-.5)*46,d=It(b/66,c/66),g=It((b+(ve(p,m,1)-.5)*15)/24+31.7,(c+(ve(p,m,2)-.5)*15)/24+31.7);return((d-.55)*11+(g-.55)*7)*a}await o.yield();const et=Bt(N,0);await o.yield();const wo=Bt(N,1);await o.yield();const vo=Bt(N,2,{side:s.DoubleSide,roughness:.8,metalness:0});await o.yield();const Ot=Mo(N),Ut=Co(N);await o.yield();const Fe=new s.Group;Fe.name="fog-river-bridge";const Et=[new Ie(z,72e3),new Ie(z,48e3),new Ie(z,72e3)],Re=e=>Et[e<-330?0:e>330?2:1],ht=new co,be={P:[],O:[],G:[],C:[],K:[],I:[]},tt=(e,t,a,f,r,u=0,i=0,n=0,p=[0,0])=>{const m=be.P.length/3;for(const b of[[-1,-1],[1,-1],[1,1],[-1,1]])be.P.push(e,t,a),be.O.push(b[0],b[1]),be.G.push(f,u,i,n),be.C.push(r[0],r[1],r[2]),be.K.push(p[0],p[1]);be.I.push(m,m+1,m+2,m,m+2,m+3)};await o.yield();const ye=ee===0?[6,60,116,158,196,re]:[6,60,126,180,re],ot=ye.length-1,at=e=>7*(1-Ne*e),Qe=e=>4.8*(1-Ne*e),bo=e=>{let t=0;for(;t<ot-1&&e>=ye[t+1];)t++;return t},te={towerTops:[],flagTips:[],saddles:[],pylonTops:[]};function Wt(e,t,a,f,r){const u=bo(a+.1),i=at(u),n=ae-Qe(u)+.4,p=f-a;if(e.box(t,(a+f)/2,0,i*1.24,p,n*2,v,1,0,15),e.box(t,f+.5,0,i*1.44,1,n*2,v,0,0,15),e.box(t,a-.4,0,i*1.36,.8,n*2,v,0,0,11),!!r){for(let m=0;m<3;m++)for(const b of[-1,1]){const c=n*(.44-.125*m);e.box(t,a-.8-2.4*(m+.5),b*(n-c/2),i*1.2,2.4,c,v,0,0,11+(b>0?32:16))}e.box(t,(a+f)/2,0,i*1.24+.7,p*.66,n*.52,v,0,0,63),e.box(t,(a+f)/2,0,i*1.24+1.3,p*.4,n*.27,v,6,0,63);for(const m of[-1,1])e.box(t,(a+f)/2,m*n*.62,i*1.24+.5,p*.8,.9,v,6,0,63)}}async function jt(e){const t=Re(e),a=he(e);for(const i of[-1,1]){const n=i*ae;for(let c=0;c<ot;c++){const d=at(c),g=Qe(c),x=.6*(1-Ne*c),I=Ae(d,g,x);if(t.tier(I,I,e,n,ye[c],ye[c+1],v,0,!0),c<ot-1){const J=at(c+1),h=Qe(c+1),w=Ae(Ve(d,J,.35),Ve(g,h,.35),x),F=Ae(Ve(d,J,.7),Ve(g,h,.7),x);t.tier(w,w,e,n,ye[c+1],ye[c+1]+1.8,v,0,!0),t.tier(F,F,e,n,ye[c+1]+1.8,ye[c+1]+3.8,v,0,!0)}for(const J of[ye[c+1]-1.1,ye[c+1]-2.6]){const h=Ae(d+.3,g+.3,x);t.tier(h,h,e,n,J,J+.6,v,6,!0)}const X=ye[c]+(c===0?3:6),E=ye[c+1]-7,P=E-X,O=2*(g-2*x)*.74,ne=2*(d-2*x)*.74;for(const J of[-1,1]){const h=e+J*(d+.05),w=60+(J>0?1:2);t.box(h,(X+E)/2,n,.6,P,O,v,1,0,w),t.box(h,E+1.1,n,.6,2.2,O*.66,v,1,0,w),t.box(h,E+3,n,.6,1.6,O*.34,v,1,0,w);const F=n+J*(g+.05),C=15+(J>0?16:32);t.box(e,(X+E)/2,F,ne,P,.6,v,1,0,C),t.box(e,E+1.1,F,ne*.66,2.2,.6,v,1,0,C),t.box(e,E+3,F,ne*.34,1.6,.6,v,1,0,C)}await o.yield()}const p=at(ot-1),m=Qe(ot-1);t.box(e,re-.6,n,2*p+3.4,2.2,2.8,U,6),t.box(e,re+.6,n,2*p+.9,1.2,2*m+.9,v,0);let b;ee===0?(t.box(e,re+2.2,n,2*p*.74,2,2*m*.74,v,1),t.box(e,re+4,n,2*p*.48,1.6,2*m*.48,v,0),b=re+10.2,t.beam([e,re+4.8,n],[e,b,n],.4,.4,T,6)):(t.box(e,re+2,n,2*p*.6,1.6,2*m*.6,v,1),b=re+13.5,t.beam([e,re+2.8,n],[e,b,n],.45,.45,T,6),t.beam([e-1.6,re+8,n],[e+1.6,re+8,n],.22,.22,T,6,!0),t.beam([e,re+10.5,n-1.1],[e,re+10.5,n+1.1],.22,.22,T,6,!0)),t.box(e,b+.35,n,1,.8,1,se,5,7),tt(e,b+.35,n,6.5,ue(se,4.5),.4,(e>0?0:3.1)+(i>0?0:.6),1),te.towerTops.push(new s.Vector3(e,b+.35,n)),te.saddles.push(new s.Vector3(e,re,n)),t.box(e,a-.3,n+i*1.6,2*at(1)+6,1.2,2*Qe(1)+6.5,U,0),await o.yield()}for(const i of je)Wt(t,e,i[0],i[1],!0),await o.yield();Wt(t,e,49,57,!1);const f=ae-Qe(0)+.4;for(const[i,n]of[[10,29],[29,48]])t.beam([e,i,-f],[e,n,f],2.6,1.8,v,0),t.beam([e,i,f],[e,n,-f],2.6,1.8,v,0),t.box(e,n,0,3,1.6,f*2,v,0,0,15);const r=Ae(13,27,2.5),u=Ae(17,31,3);t.tier(u,u,e,0,-3,2.5,$,4,!0),t.tier(r,r,e,0,2.5,6.4,$,4,!0)}await jt(ie),await o.yield(),await jt(-ie),await o.yield();const go=[.075,.08,.088],Qt=ue(fo($,v,.3),.72),Yt=v;let st=0;for(let e=-me;e<me-.01;e+=7.5,st++){const t=e+7.5,a=Re((e+t)/2),f=he(e),r=he(t),u=.9,i=qt;for(const n of[-ae,ae])a.beam([e,f-u,n],[t,r-u,n],1.1,1.1,v,0),a.beam([e,f-i,n],[t,r-i,n],1.1,1.1,v,0),a.beam([e,f-i,n],[e,f-u,n],.7,.7,v,6),st%2===0?a.beam([e,f-i,n],[t,r-u,n],.6,.6,v,6):a.beam([e,f-u,n],[t,r-i,n],.6,.6,v,6);a.beam([e,f-1.35,-ae],[e,f-1.35,ae],.5,1.5,U,0),a.beam([e,f-i,-ae],[e,f-i,ae],.5,.6,U,6),st%2===0?a.beam([e,f-i,-ae],[t,r-i,ae],.45,.45,U,6):a.beam([e,f-i,ae],[t,r-i,-ae],.45,.45,U,6),st%2===0&&(a.beam([e,f-i,-ae],[e,f-2,0],.4,.4,U,6),a.beam([e,f-i,ae],[e,f-2,0],.4,.4,U,6));for(const n of[-7.5,0,7.5])a.beam([e,f-1.15,n],[t,r-1.15,n],.35,.9,U,6);st%3===2&&await o.yield()}await o.yield();for(let e=-xe;e<xe-.01;e+=15){const t=e+15,a=Re((e+t)/2),f=he(e),r=he(t),u=(i,n,p,m,b,c,d,g=0)=>a.quad([e,f+n,i],[t,r+n,i],[t,r+m,p],[e,f+m,p],b,c,g,d);u(-10.6,0,10.6,0,go,2,[0,1,0]),u(-14.7,-.95,14.7,-.95,U,6,[0,-1,0]);for(const i of[-1,1])u(i*10.6,0,i*10.6,.32,Qt,4,[-i,0,0]),u(i*10.6,.32,i*14.7,.32,Qt,4,[0,1,0]),u(i*14.7,.32,i*14.7,-.95,v,0,[0,0,i]),u(i*14.55,.32,i*14.55,1.65,Yt,3,[0,0,i],[0,0,1,1]),u(i*14.55,.32,i*14.55,1.65,Yt,3,[0,0,-i],[0,0,1,1]),u(i*10.75,.32,i*10.75,1.1,v,6,[-i,0,0]),u(i*11,.32,i*11,1.1,v,6,[i,0,0]),u(i*10.75,1.1,i*11,1.1,v,6,[0,1,0]);Math.abs(e%150)<15&&await o.yield()}await o.yield();const Me=[{x:-me-30,hang:!1}];for(let e=0;e<=23;e++)Me.push({x:-me+e*15,hang:e>0&&e<23});for(let e=1;e<=84;e++)Me.push({x:-ie+e*(2*ie/85),hang:!0});for(let e=0;e<=23;e++)Me.push({x:ie+e*15,hang:e>0&&e<23});Me.push({x:me+30,hang:!1});const ut=8,Xt=ue(v,.92),xo=ue(v,.8),ct=.55;for(const e of[-ae,ae]){let t=null;for(let a=0;a<Me.length;a++){const f=Me[a].x,r=_e(f),u=Me[Math.max(a-1,0)].x,i=Me[Math.min(a+1,Me.length-1)].x;let n=i-u,p=_e(i)-_e(u);const m=Math.hypot(n,p);n/=m,p/=m,Math.abs(Math.abs(f)-ie)<.01&&(n=1,p=0);const b=[];for(let d=0;d<=ut;d++){const g=d/ut*Math.PI*2,x=Math.cos(g),I=Math.sin(g);b.push([-p*x,n*x,I])}const c={x:f,y:r,ring:b,u:a*15};if(t){const d=Re((t.x+f)/2);d.n+ut*6>d.cap&&d.grow();for(let g=0;g<ut;g++){const x=[[t,g],[t,g+1],[c,g+1],[t,g],[c,g+1],[c,g]];for(const[I,X]of x){const E=I.ring[X],P=d.n*3,O=d.n*2,ne=.94+.06*(g*5%3);d.P[P]=I.x+E[0]*ct,d.P[P+1]=I.y+E[1]*ct,d.P[P+2]=e+E[2]*ct,d.N[P]=E[0],d.N[P+1]=E[1],d.N[P+2]=E[2],d.C[P]=v[0]*ne,d.C[P+1]=v[1]*ne,d.C[P+2]=v[2]*ne,d.U[O]=I.u,d.U[O+1]=X,d.S[O]=6,d.S[O+1]=ct,d.n++}}for(const g of[-.5,.5])ht.seg([t.x,t.y+1.3,e+g],[f,r+1.3,e+g],.05,Xt)}for(const d of[-.5,.5])ht.seg([f,r+.45,e+d],[f,r+1.3,e+d],.06,Xt);if(Me[a].hang){const d=he(f)-.4;r-.5-d>.6&&ht.seg([f,r-.45,e],[f,d,e],.3,xo)}t=c,a%9===8&&await o.yield()}await o.yield()}for(const e of[-1,1]){const t=e*me,a=Re(t),f=he(t),r=Ae(31,25,3);a.tier(r,r,t+e*4,0,-3,f-1.2,$,4,!0);for(const u of[-1,1]){const i=u*20.6,n=[[5.2,4.6,f-1.2,f+16],[4.3,3.8,f+16,f+26],[3.3,2.9,f+26,f+33],[2.2,1.9,f+33,f+36]];for(const[p,m,b,c]of n){const d=Ae(p,m,.42);if(a.tier(d,d,t,i,b,c,$,4,!0),c-b>5)for(const g of[-1,1])for(const x of[-1,0,1])a.box(t+g*(p+.1),(b+c)/2-.6,i+x*m*.42,.5,c-b-2.6,m*.2,$,4,0,60+(g>0?1:2))}a.box(t,f+36.5,i,1.3,1,1.3,Y,5,4),tt(t,f+36.5,i,4.5,ue(Y,1.8),0,0,0),te.pylonTops.push(new s.Vector3(t,f+37,i)),await o.yield()}for(let u=me;u<xe-.01;u+=30){const i=e*u,n=e*(u+30);for(const p of[-11.5,11.5])a.beam([i,he(i)-2.7,p],[n,he(n)-2.7,p],.9,3.4,v,0)}for(let u=1;u<=5;u++){const i=e*(me+31+u*60),n=he(i),p=Ae(2.6,12.6,.8),m=Ae(3.4,14.4,.8);a.tier(p,p,i,0,-3,n-6.2,$,4,!1),a.tier(m,m,i,0,n-6.2,n-4.4,$,4,!0)}await o.yield(),a.box(e*(xe+9),he(xe)/2-2,0,18,he(xe)+2,44,$,4),await o.yield()}await o.yield();for(let e=-xe+22.5;e<xe;e+=45){if(Math.abs(Math.abs(e)-ie)<13||Math.abs(Math.abs(e)-me)<8)continue;const t=Re(e),a=he(e);for(const f of[-1,1]){const r=f*14.2;t.beam([e,a+.32,r],[e,a+9.2,r],.3,.3,U,6),t.beam([e,a+9,r],[e,a+9.6,r-f*2.5],.22,.22,U,6),t.box(e,a+9.55,r-f*2.8,1.2,.26,.55,Y,5,5.5),tt(e,a+9.4,r-f*2.8,2.8,ue(Y,2),0,0,0)}await o.yield()}await o.yield();const xt=[[.5,.51,.53],[.62,.62,.6],[.04,.045,.05],[.05,.09,.2],[.36,.05,.04],[.22,.25,.24],[.5,.42,.26],[.1,.2,.17]],Ye=[1,.9,.72],$t=[1,.06,.03],yt=l.traffic===!1?0:Math.max(4,Math.round(25*W*H)),Z=new Ie(K,Math.max(9e3,yt*6*400)),Tt=[];Z.jit=.03;const St=[[.6,.6,.58],[.34,.36,.39],[.45,.2,.1],[.55,.5,.4],[.2,.3,.4]],yo=[.2,.19,.17],Ft=[.035,.035,.04];for(const e of[-1,1])for(let t=0;t<3;t++){const a=e*(1.75+t*3.5),f=e*(30-t*3.4),r=2*xe/yt;let u=-1e5;for(let i=0;i<yt;i++){const n=-xe+(i+K.range(.12,.88))*r,p=Z.n,m=K.pick(xt),b=K.chance(t===2?.3:.04);let c,d;if(b){c=K.range(9,13),d=1;let g=K.pick(St);const x=K.pick(xt.slice(0,2).concat(xt.slice(3)));g===St[0]&&(t<2&&n-u<400?g=St[1]:u=n);const I=c-2.8,X=-e*1.3,E=X-e*I/2;Z.box(e*(c/2-1.2),1.75,a,2.4,2.3,2.4,x,6,0,55),Z.box(e*(c/2-.5),2.2,a,1.05,.9,2.2,[.03,.04,.05],6,0,55),Z.box(e*(c/2-1.75),3.2,a,1.3,.62,2.2,x,6,0,55),Z.box(e*(c/2+.01),1.05,a,.07,.62,2.1,Ft,6,0,55),Z.box(X,3.05,a,I,2.1,2.5,g,6,0,55),Z.box(X,1.65,a,I,.7,2.5,fo(g,yo,.5),6,0,51),Z.box(X,1.05,a,I+.04,.5,2.55,ue(g,.4),6,0,51);for(let P=-I/2+1.2;P<I/2-.4;P+=2.4)Z.box(X+P,2.74,a,.11,2.86,2.59,ue(g,.7),6,0,55);for(const P of[-1.14,0,1.14])Z.box(E-e*.02,2.6,a+P,.06,2.9,.08,Ft,6,0,55);for(const P of[-.4,.4])Z.box(E-e*.04,2.3,a+P,.05,2.3,.05,[.3,.31,.32],6,0,55);Z.box(E-e*.06,.72,a,.12,.16,2.3,Ft,6,0,55),Z.box(0,.55,a,c-.6,.5,2.3,[.03,.03,.035],6,0,55);for(const P of[-.36,-.22,.34])for(const O of[-1.18,1.18])Z.box(P*c,.5,a+O,1,1,.3,[.02,.02,.02],6,0,55)}else{c=K.range(4.2,4.9),d=.78,Z.box(0,.66,a,c,.6,1.85,m,6,0,55);const g=c*.3,x=.84,I=c*.17,X=.7,E=-e*.3;Z.tier([[g,-x],[g,x],[-g,x],[-g,-x]],[[I,-X],[I,X],[-I,X],[-I,-X]],E,a,.96,1.46,[.03,.04,.055],6,!1),Z.box(E,1.48,a,I*2+.1,.06,X*2+.06,m,6,0,55);for(const P of[-.31,.31])for(const O of[-.88,.88])Z.box(P*c,.34,a+O,.68,.68,.2,[.02,.02,.02],6,0,55)}for(const g of[-.62,.62])Z.box(e*(c/2+.02),d,a+g,.06,.2,.34,Ye,5,7,e>0?1:2),Z.box(-e*(c/2+.02),d+.08,a+g,.06,.16,.3,$t,5,3,e>0?2:1);for(let g=p;g<Z.n;g++)Tt.push(n,f);tt(e*(c/2+.3),d,a,2.6,ue(Ye,2.4),0,0,2,[n,f]),tt(-e*(c/2+.2),d+.1,a,1.5,ue($t,1.5),0,0,2,[n,f]),i%6===5&&await o.yield()}await o.yield()}await o.yield();const ge=he(le),oe=9,zt=17.3,kt=[.4,.42,.44];{const e=Re(le);for(const t of[-2.6,2.6])e.beam([le+t,ge+.5,12.2],[le+t,ge+2,zt+.3],.18,.18,kt,6,!0),e.beam([le+t,ge+.32,13.4],[le+t,ge+1.25,13.4],.14,.14,kt,6),e.box(le+t,ge+.67,11.9,.9,.7,1.3,$,4),e.box(le+t,ge+1.06,11.9,.7,.08,1,U,6);e.beam([le-2.6,ge+1.3,12.6],[le+2.6,ge+1.3,12.6],.1,.1,kt,6,!0)}await o.yield();const D=new Ie(z,2400),Lt=new co,pt=[.36,.3,.2],Zt=[.62,.6,.54];D.box(0,-oe,0,7.2,.14,1.34,pt,6);for(const e of[-.66,.66]){D.box(0,-oe+.14,e,7.2,.2,.05,pt,6),D.beam([-3.6,-oe+1.1,e],[3.6,-oe+1.1,e],.07,.07,T,6),D.beam([-3.6,-oe+.6,e],[3.6,-oe+.6,e],.05,.05,T,6);for(const t of[-3.6,-1.2,1.2,3.6])D.beam([t,-oe,e],[t,-oe+1.1,e],.06,.06,T,6)}for(const e of[-2.6,2.6]){for(const t of[-.66,.66])D.beam([e,-oe+1.1,t],[e,-oe+2.1,t*.3],.07,.07,T,6);D.box(e,-oe+2.1,0,.3,.22,.5,T,6),Lt.seg([e,.2,0],[e,-oe+2.1,0],.045,[.5,.46,.38]),Lt.seg([e+.12,.2,0],[e+.12,-oe+.2,.7],.03,[.45,.42,.36])}D.box(-.2,-oe+.27,.3,.3,.32,.3,[.4,.4,.42],6),D.box(-.2,-oe+.44,.3,.26,.03,.26,v,6),D.box(2.3,-oe+.27,.25,.3,.32,.3,[.4,.4,.42],6),D.box(2.3,-oe+.44,.25,.26,.03,.26,v,6),D.box(-2.9,-oe+.4,.1,.9,.5,.7,Zt,6),await o.yield();const ze=[.7,.68,.62],Mt=[.05,.05,.06],Xe=[.5,.33,.24],Ct=[],He=new Ie(z,200);He.jit=.02,He.beam([0,0,0],[.07,.02,-.3],.12,.12,ze,6,!0),He.beam([.07,.02,-.3],[.06,.26,-.54],.1,.1,ze,6,!0),He.box(.06,.28,-.57,.09,.1,.1,Xe,6),He.beam([.05,.08,-.36],[.1,1.1,-1.7],.045,.045,pt,6),He.box(.1,1.12,-1.74,.36,.13,.13,v,6);const So=He.toGeometry();await o.yield();for(const[e,t,a,f]of[[-1.5,1,[.78,.56,.05],!1],[1.2,-1,[.72,.72,.68],!0]]){const r=-oe+.07,u=(n,p)=>[[n,-p],[n,p],[-n,p],[-n,-p]],i=n=>{const p=[];for(let m=0;m<8;m++){const b=(m+.5)/8*Math.PI*2;p.push([Math.cos(b)*n,Math.sin(b)*n])}return p};for(const n of[-1,1]){const p=[e+n*.1,r+.9,.02],m=[e+n*.15,r+.5,n*t>0?-.1:.03],b=[e+n*.17,r+.13,n*t>0?-.04:.08];D.beam(p,m,.2,.2,ze,6),D.beam(m,b,.16,.16,ze,6),D.box(b[0],r+.07,b[2]-.05,.17,.14,.32,Mt,6)}D.tier(u(.17,.11),u(.2,.12),e,.01,r+.84,r+1.02,ze,6,!1),D.tier(u(.185,.115),u(.27,.14),e,-.03,r+1.02,r+1.47,ze,6,!1),D.tier(u(.27,.14),u(.1,.09),e,-.06,r+1.47,r+1.57,ze,6,!0),D.box(e,r+1.02,.02,.43,.07,.27,Mt,6);for(const n of[-.11,.11])D.beam([e+n,r+1.03,.14],[e+n*.6,r+1.5,.11],.05,.03,Mt,6);D.tier(i(.06),i(.06),e,-.07,r+1.55,r+1.62,Xe,6,!1),D.tier(i(.095),i(.115),e,-.08,r+1.6,r+1.71,Xe,6,!1),D.tier(i(.115),i(.1),e,-.08,r+1.71,r+1.79,Xe,6,!0),D.tier(i(.175),i(.175),e,-.1,r+1.775,r+1.8,a,6,!0),D.tier(i(.13),i(.12),e,-.08,r+1.8,r+1.87,a,6,!1),D.tier(i(.12),i(.07),e,-.08,r+1.87,r+1.93,a,6,!0);{const n=[e-.26*t,r+1.46,-.05],p=[e-.33*t,r+1.2,-.2],m=[e-.3*t,r+1.08,-.5];D.beam(n,p,.12,.12,ze,6,!0),D.beam(p,m,.1,.1,ze,6,!0),D.box(m[0],m[1],m[2]-.05,.09,.08,.11,Xe,6)}if(f){const n=new s.Mesh(So,et);n.position.set(e+.27*t,r+1.45,-.05),n.name="painter-arm",Ct.push(n)}else{const n=[e+.26*t,r+1.46,-.05],p=[e+.36*t,r+1.52,-.36],m=[e+.4*t,r+1.74,-.64];D.beam(n,p,.12,.12,ze,6,!0),D.beam(p,m,.1,.1,ze,6,!0),D.box(m[0],m[1],m[2],.09,.1,.1,Xe,6),D.beam([m[0],m[1]-.25,m[2]+.22],[e+.5*t,r+2.5,-1.62],.04,.04,pt,6),D.box(e+.5*t,r+2.52,-1.66,.3,.11,.11,v,6)}await o.yield()}{const e=Re(le),t=le+1.2,a=[.5,.33,.29];e.box(t-1.6,ge-qt,ae,9.4,1.17,1.17,a,6,0,63),e.box(t,ge-4.7,ae,.79,5.4,.79,a,6,0,51),e.box(t-7.5,ge-6.2,ae,.79,2.6,.79,a,6,0,51)}await o.yield();const $e=new s.Group;$e.position.set(le,ge+2,zt);const Fo=new s.Mesh(D.toGeometry(),et),Jt=new s.Mesh(Lt.toGeometry(),Ot);Jt.renderOrder=-.5,$e.add(Fo,Jt,...Ct),Fe.add($e),te.cradle=new s.Vector3(le,ge+2-oe+1,zt),await o.yield();const pe={P:[],N:[],C:[],U:[],S:[],F:[],I:[]},zo=L.pick([[.1,.22,.5],[.62,.6,.52],[.06,.34,.3]]),ko=L.pick([[.6,.58,.5],v,Y.map(e=>e*.7)]),At=je[je.length-1][1]+1;for(const e of[-ie,ie]){const t=Re(e),a=At+21,f=11,r=6.4,u=12,i=4,n=pe.P.length/3,p=e>0?0:2.1;t.beam([e,At,0],[e,a,0],.42,.42,Zt,6,!0),t.box(e,At+.6,0,1.6,1.2,1.6,v,0),t.box(e,a+.25,0,.7,.5,.7,Y,6);for(let m=0;m<=i;m++)for(let b=0;b<=u;b++){const c=b/u,d=m/i,g=Math.abs(d-.5)<.2?ko:zo;pe.P.push(e+j[0]*c*f,a-.4-(1-d)*r,j[1]*c*f),pe.N.push(-j[1],0,j[0]),pe.C.push(g[0],g[1],g[2]),pe.U.push(c*f,d*r),pe.S.push(6,0),pe.F.push(c,p+d*.7,1.25)}for(let m=0;m<i;m++)for(let b=0;b<u;b++){const c=n+m*(u+1)+b,d=c+1,g=c+u+1,x=g+1;pe.I.push(c,d,x,c,x,g)}te.flagTips.push(new s.Vector3(e,a,0))}const Ce=new s.BufferGeometry;Ce.setAttribute("position",new s.Float32BufferAttribute(pe.P,3)),Ce.setAttribute("normal",new s.Float32BufferAttribute(pe.N,3)),Ce.setAttribute("color",new s.Float32BufferAttribute(pe.C,3)),Ce.setAttribute("aUv",new s.Float32BufferAttribute(pe.U,2)),Ce.setAttribute("aS",new s.Float32BufferAttribute(pe.S,2)),Ce.setAttribute("aFlag",new s.Float32BufferAttribute(pe.F,3)),Ce.setIndex(pe.I),Ce.computeBoundingSphere(),Ce.boundingSphere.radius+=6;const Lo=new s.Mesh(Ce,vo);Fe.add(Lo),await o.yield();const eo=mt(l.ships??2,0,2),Gt=[],Rt=[];if(eo>0){const e=new Ie(V,3e3),t=ue(T,.85),a=[.6,.6,.57],f=[.1,.17,.15],r=[-146,-128,-98,-40,60,120,140,146],u=[.6,9.5,17.5,21,21,20,17,14.5],i=[.3,5,13,19.5,20,18,13,9];for(let h=0;h<7;h++){for(const w of[-1,1])e.quad([w*i[h],-2,r[h]],[w*i[h+1],-2,r[h+1]],[w*(i[h+1]*.4+u[h+1]*.6),5,r[h+1]],[w*(i[h]*.4+u[h]*.6),5,r[h]],[.3,.05,.04],6,0,[w,0,0]),e.quad([w*(i[h]*.4+u[h]*.6),5,r[h]],[w*(i[h+1]*.4+u[h+1]*.6),5,r[h+1]],[w*u[h+1],15,r[h+1]],[w*u[h],15,r[h]],t,6,0,[w,0,0]),e.quad([w*u[h],15,r[h]],[w*u[h+1],15,r[h+1]],[w*u[h+1],16.3,r[h+1]],[w*u[h],16.3,r[h]],t,6,0,[w,0,0]);e.quad([-u[h],15,r[h]],[u[h],15,r[h]],[u[h+1],15,r[h+1]],[-u[h+1],15,r[h+1]],f,6,0,[0,1,0])}e.quad([-u[7],16.3,146],[u[7],16.3,146],[i[7],-2,146],[-i[7],-2,146],t,6,0,[0,0,1]),await o.yield();for(let h=-112;h<50;h+=13.4)e.box(0,15+1.35*V.int(3,7),h,37.5,2.7*V.int(3,7),12.4,[1,1,1],8,0,55);for(let h=99;h<130;h+=13.4)e.box(0,15+1.35*3,h,32.5,2.7*3,12.4,[1,1,1],8,0,55);const n=[.09,.1,.11];for(let h=-112+6.7;h<44;h+=13.4)e.box(0,15+6.2,h,39.4,12.4,.45,n,6,0,51);await o.yield();const p=ue(a,.78),m=[.02,.035,.05],b=[.8,.25,.04],c=(h,w,F,C,R,Q)=>{e.quad([h,R,w],[F,R,C],[F,R+1.1,C],[h,R+1.1,w],p,3,[0,0,1,1],Q),e.quad([h,R,w],[F,R,C],[F,R+1.1,C],[h,R+1.1,w],p,3,[0,0,1,1],[-Q[0],0,-Q[2]])},d=(h,w,F,C)=>{const R=F/2,Q=C/2;c(-R,h-Q,R,h-Q,w,[0,0,-1]),c(-R,h+Q,R,h+Q,w,[0,0,1]),c(-R,h-Q,-R,h+Q,w,[-1,0,0]),c(R,h-Q,R,h+Q,w,[1,0,0])};[[15,20.6,39,16],[20.6,26.2,37,14.4],[26.2,31.8,34.4,12.8],[31.8,37.4,31.4,11.4],[37.4,43,28,10]].forEach(([h,w,F,C],R)=>{const Q=74+R*.7;e.box(0,(h+w)/2,Q,F,w-h,C,a,9,1,51),e.box(0,w+.09,Q,F+2.6,.18,C+2,p,6,0,63),d(Q,w+.18,F+2.5,C+1.9)}),await o.yield(),e.box(0,43.2,73,52,.3,6.6,p,6,0,63),e.box(0,43.95,73,52,1.2,6.6,a,6,0,51),e.box(0,44.9,74,31,3.8,8,a,6,0,55);{e.quad([-15.5,44.6,69.94],[15.5,44.6,69.94],[15.5+.1,46.1,69.94-.55],[-15.5-.1,46.1,69.94-.55],m,6,0,[0,0,-1]),e.quad([-15.5,46.1,69.94-.55],[15.5,46.1,69.94-.55],[15.5,46.25,69.94],[-15.5,46.25,69.94],p,6,0,[0,1,-1]);for(const F of[-1,1])e.quad([F*(15.5+.06),44.6,70],[F*(15.5+.06),44.6,76],[F*(15.5+.06),46.1,76],[F*(15.5+.06),46.1,70],m,6,0,[F,0,0]);for(const F of[-1,1])e.box(F*25.4,44.9,73,.9,.7,1.6,p,6)}e.box(0,47,74.4,25,.4,9,p,6),d(74.4,47.2,24.6,8.6),await o.yield();for(const h of[-1,1]){const w=h*19.2,F=29.4,C=75;e.box(w,F,C,2.7,1.6,8.6,b,6),e.box(w,F+1.2,C,2.1,.9,7.2,b,6),e.box(w,F+1.2,C-3,2.14,.5,.9,m,6);for(const R of[-3.3,3.3])e.beam([h*17.2,26.4,C+R],[h*17.6,32.6,C+R],.3,.3,p,6),e.beam([h*17.6,32.6,C+R],[w+h*.4,31.9,C+R],.26,.26,p,6,!0)}await o.yield(),e.beam([0,47.2,74],[0,57,74],.8,.8,a,6,!0),e.beam([-5.5,54.2,74],[5.5,54.2,74],.26,.26,a,6,!0),e.box(0,50.6,73,4.4,.22,3.2,p,6),e.box(0,51.05,72.4,.5,.7,.5,p,6);for(const h of[-1,1])e.beam([h*5.5,54.2,74],[0,56.8,74],.1,.1,a,6),e.beam([h*5.5,54.2,74],[h*9,47.3,75.5],.08,.08,p,6);e.box(0,57.25,74,.6,.6,.6,Ye,5,6),await o.yield();const x=(h,w,F=0)=>{const C=[];for(let R=0;R<16;R++){const Q=(R+.5)/16*Math.PI*2;C.push([h*Math.cos(Q),w*Math.sin(Q)+F])}return C},I=V.pick([v,Y.map(h=>h*.6),[.55,.55,.5],[.05,.2,.3]]);e.box(0,25.5,92.5,16,21,9,a,9,1,51),e.box(0,36.1,92.5,17.4,.2,10.4,p,6),d(92.5,36.2,17.2,10.2),e.tier(x(2.7,3.7,0),x(2.45,3.4,1.1),0,92.5,36.2,45.5,t,6,!1),e.tier(x(2.45,3.4,1.1),x(2.35,3.25,1.6),0,92.5,45.5,49.6,I,6,!1),e.tier(x(2.35,3.25,1.6),x(2.3,3.2,1.95),0,92.5,49.6,52.6,[.02,.02,.025],6,!0),e.tier(x(2.52,3.47,1.1),x(2.5,3.45,1.16),0,92.5,45.5,46,a,6,!1),e.tier(x(2.42,3.32,1.55),x(2.4,3.3,1.6),0,92.5,49.1,49.6,a,6,!1),e.tier(x(2.42,3.32,1.9),x(2.42,3.32,1.95),0,92.5,52.2,52.6,[.05,.05,.055],6,!1);for(let h=0;h<9;h++)e.box(2.7-h*.028,37.2+h*1,92.5+h*.12,.12,.07,.6,p,6);for(const h of[-.8,.8])e.beam([h,52.6,94.2],[h,54,94.5],.5,.5,[.03,.03,.035],6,!0);await o.yield(),e.beam([0,16,-134],[0,34,-134],.55,.55,a,6,!0),e.box(0,34.4,-134,.6,.6,.6,Ye,5,5);for(const[h,w]of[[-1,[1,.08,.04]],[1,[.1,1,.3]]])e.box(h*26.1,44.9,71,.25,.5,.7,w,5,4);await o.yield();const X=e.toGeometry();await o.yield();const E=new Ie(V,120);E.jit=0,E.box(0,0,0,6.6,.36,.5,a,6),E.box(0,-.4,0,.5,.5,.5,p,6);const P=E.toGeometry(),O={P:[],O:[],G:[],C:[],K:[],I:[]},ne=(h,w,F,C,R,Q,Ue)=>{const fe=O.P.length/3;for(const Ke of[[-1,-1],[1,-1],[1,1],[-1,1]])O.P.push(h,w,F),O.O.push(Ke[0],Ke[1]),O.G.push(C,Q,Ue,0),O.C.push(R[0],R[1],R[2]),O.K.push(0,0);O.I.push(fe,fe+1,fe+2,fe,fe+2,fe+3)};ne(0,57.3,74,5.2,ue(Ye,3.4),.28,0),ne(0,34.5,-134,3.6,ue(Ye,2.6),.28,1.6),ne(-26.3,44.9,71,3.2,[3.2,.2,.1],0,0),ne(26.3,44.9,71,3.2,[.25,2.8,.8],0,0),ne(0,49.5,96.5,4.2,ue(Y,1.6),0,0);const J=new s.BufferGeometry;J.setAttribute("position",new s.Float32BufferAttribute(O.P,3)),J.setAttribute("aOff",new s.Float32BufferAttribute(O.O,2)),J.setAttribute("aG",new s.Float32BufferAttribute(O.G,4)),J.setAttribute("color",new s.Float32BufferAttribute(O.C,3)),J.setAttribute("aCar",new s.Float32BufferAttribute(O.K,2)),J.setIndex(O.I);for(let h=0;h<eo;h++){const w=new s.Mesh(X,et);w.name="ship"+h,Gt.push(w),Fe.add(w);const F=new s.Mesh(P,et);F.position.set(0,51.75,72.4),F.name="radar"+h,w.add(F),Rt.push(F);const C=new s.Mesh(J,Ut);C.frustumCulled=!1,C.renderOrder=2,C.name="ship-lights"+h,w.add(C)}await o.yield()}te.shipStart=new s.Vector3(835,0,200),te.funnelTop=new s.Vector3(0,53.4,94.4),te.shipTrack=[new s.Vector3(Je,0,188),new s.Vector3(Je,0,-232)];const dt=(e,t,a,f)=>{const r=Gt[e];r&&(r.position.set(t,0,a),r.rotation.y=f,e===0&&N.uShip.value.set(t+72*Math.sin(f),a+72*Math.cos(f),-Math.sin(f),-Math.cos(f)))};dt(0,Je,60,0),dt(1,te.shipStart.x,te.shipStart.z,.12);for(const e of Et){const t=new s.Mesh(await e.toGeometrySteps(o),et);Fe.add(t),await o.yield()}const to=new s.Mesh(ht.toGeometry(),Ot);to.renderOrder=-.5,Fe.add(to),await o.yield();const oo=await Z.toGeometrySteps(o);oo.setAttribute("aCar",new s.Float32BufferAttribute(Tt,2));const ao=new s.Mesh(oo,wo);ao.frustumCulled=!1,Fe.add(ao),await o.yield();const Oe=new s.BufferGeometry;Oe.setAttribute("position",new s.Float32BufferAttribute(be.P,3)),Oe.setAttribute("aOff",new s.Float32BufferAttribute(be.O,2)),Oe.setAttribute("aG",new s.Float32BufferAttribute(be.G,4)),Oe.setAttribute("color",new s.Float32BufferAttribute(be.C,3)),Oe.setAttribute("aCar",new s.Float32BufferAttribute(be.K,2)),Oe.setIndex(be.I);const Nt=new s.Mesh(Oe,Ut);Nt.frustumCulled=!1,Nt.renderOrder=2,Fe.add(Nt),await o.yield();let Te=null;if(l.fog!==!1){const e=H>=1?1:.8,t=(b,c,d,g,x)=>{const I=5.2/e,X=10.4/e,E=w=>I+(X-I)*wt(0,170,Math.max(b-w,w-c,0)),P=[],O=[];for(let w=(b+c)/2;w<d;w+=E(w))P.push(w);for(let w=(b+c)/2-E((b+c)/2);w>-d;w-=E(w))O.push(w);const ne=w=>{let F=1,C=1.4;for(let fe=0;fe<40;fe++){const Ke=(F+C)/2;let it=0,ke=X;for(let De=0;De<x;De++)ke*=Ke,it+=ke;it>g-Math.abs(w)?C=Ke:F=Ke}const R=[];let Q=X,Ue=Math.abs(w);for(let fe=0;fe<x;fe++)Q*=F,Ue+=Q,R.push(Ue);return R[x-1]=g,R},J=ne(P[P.length-1]),h=ne(O[O.length-1]);return Float32Array.from([...h.reverse().map(w=>-w),...O.reverse(),...P,...J])},a=t(-340,280,1010,6200,Math.round(44*e)),f=t(-70,230,460,6e3,Math.round(48*e)),r=a.length-1,u=f.length-1;await o.yield();const i=new Float32Array((r+1)*(u+1)*3);await o.yield();const n=new Uint32Array(r*u*6);await o.yield();let p=0;for(let b=0;b<=u;b++){const c=f[b];for(let d=0;d<=r;d++)i[p++]=a[d],i[p++]=0,i[p++]=c;b%10===9&&await o.yield()}await o.yield(),p=0;for(let b=0;b<u;b++){for(let c=0;c<r;c++){const d=b*(r+1)+c,g=d+1,x=d+r+1,I=x+1;n[p++]=d,n[p++]=x,n[p++]=g,n[p++]=g,n[p++]=x,n[p++]=I}b%8===7&&await o.yield()}const m=new s.BufferGeometry;m.setAttribute("position",new s.BufferAttribute(i,3)),m.setIndex(new s.BufferAttribute(n,1)),m.boundingSphere=new s.Sphere(new s.Vector3(0,60,0),9e3),Te=new s.Mesh(m,Ao(N,H>=1)),Te.frustumCulled=!1,Te.renderOrder=-1,Te.name="fog-river",Fe.add(Te),await o.yield()}const so=he(ie)+11.6;te.portalSeat={position:new s.Vector3(-ie,so,0),normal:new s.Vector3(1,0,0)},te.gap=new s.Vector3(qe,we,Dt),te.cableDive=[new s.Vector3(560,_e(560)+3,23),new s.Vector3(150,_e(150)+3,23)],te.underDeck=new s.Vector3(le-60,he(le)-qt-6,30),te.flyThrough=[new s.Vector3(905,44,300),new s.Vector3(872,60,258),new s.Vector3(800,122,150),new s.Vector3(710,186,62),te.cableDive[0].clone(),new s.Vector3(360,_e(360)+3,23),te.cableDive[1].clone(),new s.Vector3(le+20,60,30),te.underDeck.clone(),new s.Vector3(-150,62,30),new s.Vector3(-250,96,26),new s.Vector3(-340,_e(340)+11,15),new s.Vector3(-440,101,4),new s.Vector3(-545,so+1.5,0),te.portalSeat.position.clone()],te.viewpoints={postcard:{position:new s.Vector3(260,205,1240),target:new s.Vector3(0,125,0)},axis:{position:new s.Vector3(905,108,0),target:new s.Vector3(-ie,120,0)},valley:{position:new s.Vector3(150,52,170),target:new s.Vector3(-320,120,0)}};const rt=new s.Vector3,ro=new s.Vector2;let nt=-1,no=!1,io=!1,lo=[!1,!1];const Pt={object:Fe,radius:290,height:236,length:2*xe,center:new s.Vector3(-330,150,0),anchors:te,ground:!1,groundY:0,uniforms:N,deckY:he,cableY:_e,ships:Gt,cradle:$e,fogMesh:Te,look:{style:ee,hour:B,paint:"#"+k.getHexString(),fogTop:Le,fogAmp:Pe,fogFloor:we,flow:j,sun:Vt},fog:{heightAt:gt,liftAt:Ht,riftAt:mo,surfaceAt:(e,t)=>gt(e,t)+Ht(e,t)*(1-.85*ft),immersion:0},setProgress(e){nt=mt(e,0,1)},setGap(e,t,a,f=1){no=!0,N.uGap.value.set(e,t,a,f)},setGap2(e,t,a,f=1){io=!0,N.uGap2.value.set(e,t,a,f)},setShip(e,t,a,f=0){lo[e]=!0,dt(e,t,a,f)},setRift(e,t,a,f,r){N.uRift.value[e].set(t,a,f,r)},setLight(e={}){e.sunDir&&N.uSun.value.set(e.sunDir.x??e.sunDir[0],e.sunDir.y??e.sunDir[1],e.sunDir.z??e.sunDir[2]).normalize(),e.sun&&N.uSunCol.value.set(e.sun),e.sky&&N.uSkyCol.value.set(e.sky),e.fogLit&&N.uFogLit.value.set(e.fogLit),e.fogShade&&N.uFogShade.value.set(e.fogShade)},update(e,t,a){N.uFg.value.w=t,N.uInv.value.copy(Fe.matrixWorld).invert();const f=nt>=0?nt:t/46%1;no||(N.uGap.value.w=nt>=0?wt(.2,.45,f):1),io||(N.uGap2.value.w=nt>=0?wt(.6,.8,f):0),lo[0]||dt(0,Je,188-420*f,0);for(let r=0;r<Rt.length;r++)Rt[r].rotation.y=t*2.3+r*1.3;$e.rotation.x=Math.sin(t*.83)*.022+Math.sin(t*.31+1)*.012,$e.rotation.z=Math.sin(t*.57+2)*.01;for(const r of Ct)r.rotation.x=.1+.3*Math.sin(t*1.9);if(a){rt.setFromMatrixPosition(a.matrixWorld).applyMatrix4(N.uInv.value),N.uCam.value.copy(rt);const r=gt(rt.x,rt.z);N.uCamH.value=r,Pt.fog.immersion=mt((r-rt.y+4)/10,0,1),o.renderer.getDrawingBufferSize(ro),N.uPx.value=2/(Math.max(a.projectionMatrix.elements[5],.001)*Math.max(ro.y,1))}},dispose(){Be.dispose()}};return Pt.update(0,0,null),Pt});export{ho as DOME_GLSL,lt as FOG_GLSL,No as buildHero,_e as cableY,he as deckY};
