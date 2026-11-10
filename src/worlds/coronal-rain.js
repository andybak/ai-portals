import*as e from"three";import{mergeGeometries as i0}from"three/addons/utils/BufferGeometryUtils.js";import*as w from"../kit/fx.js";import{buildHero as n0}from"../parts/coronal-rain.js";const ye=["#FFB52E","#D9781A","#34160A","#FF4F86","#E9E0FF","#020204","#7A2338"],F=14e3,W=-2700,be=10,Se=12,ze=8,G=Math.PI,Y=`
#define NS ${be}
#define R_SUN ${F.toFixed(1)}
uniform vec4 uSpot[NS];     // x, z, umbra radius, penumbra radius (radius 0 = unused)
uniform float uSpotD[NS];   // depth of the dish
float surfY(vec2 p) {
  vec2 q = p - vec2(0.0, ${W.toFixed(1)});
  float d2 = min(dot(q, q), R_SUN * R_SUN * 0.9);
  float y = -d2 / (R_SUN + sqrt(R_SUN * R_SUN - d2));
  for (int i = 0; i < NS; i++) {
    float r = uSpot[i].z;
    if (r > 1.0) y -= uSpotD[i] * (1.0 - smoothstep(r * 0.85, r * 1.25, length(p - uSpot[i].xy)));
  }
  return y;
}
`,z=(u,y,q)=>{const E=Math.max(0,Math.min(1,(q-u)/(y-u)));return E*E*(3-2*E)},_e=u=>new e.Color(u),s0={quiet:{sea:1,stream:1,stars:400,jet:1,rain:"quiet",exposure:1,title:"Coronal Rain"},after:{sea:.92,stream:1.3,stars:400,jet:1.1,rain:"heavy",exposure:.96,title:"Coronal Rain: After the Flare"},prominence:{sea:.86,stream:2.3,stars:420,jet:2,rain:"quiet",exposure:1,title:"Coronal Rain: Prominence Country"},deep:{sea:.3,stream:1.7,stars:800,jet:1,rain:"quiet",exposure:1.12,title:"Coronal Rain: Deep Light"}};var d0={id:"coronal-rain",name:"Coronal Rain",category:"sky",weirdness:.5,media:["space","air"],async build(u){const y=u.rng,q=u.quality?.detail??1,E=u.vary||{hour:"any",rare:!1,density:1,mood:.5},Ae=Math.max(.7,Math.min(1.3,E.density??1)),M=new e.Scene;M.background=_e(ye[5]);const R=ye.map(_e),P={value:0},Be=[],L={day:"quiet",golden:"after",dawn:"prominence",night:"deep"}[E.hour]||y.pick(["quiet","quiet","after","prominence","deep"]),_=s0[L],ue=Math.max(0,Math.min(1,E.mood??.5)),I=y.pick(["round","split","pores"]),Fe=y.chance(.4),k={x:-120,z:-1900},J={x:150,z:-3700},A=[];A.push([k.x,k.z,I==="pores"?300:340,I==="pores"?560:620,25]),L!=="prominence"?A.push([J.x,J.z,400,640,20]):A.push([J.x,J.z,0,0,0]);const Q=y.fork("pores"),Pe=I==="pores"?8:5;for(let t=0;t<Pe&&A.length<be;t++){const c=I==="pores"&&t<4,a=Q.range(0,G*2),i=c?k:J;let o=c?Q.range(720,980):Q.range(760,1050),n=i.x+Math.cos(a)*o,s=i.z+Math.sin(a)*o;c&&Math.abs(n)<170&&(n=(n<0?-1:1)*Q.range(190,320));const m=Q.range(30,60);A.push([n,s,m,m*1.3,7])}for(;A.length<be;)A.push([0,0,0,0,0]);function qe(t,c){const a=t,i=c-W,o=Math.min(a*a+i*i,F*F*.9);let n=-o/(F+Math.sqrt(F*F-o));for(const s of A)s[2]>1&&(n-=s[4]*(1-z(s[2]*.85,s[2]*1.25,Math.hypot(t-s[0],c-s[1]))));return n}const D={uSpot:{value:A.map(t=>new e.Vector4(t[0],t[1],t[2],t[3]))},uSpotD:{value:A.map(t=>t[4])},uTime:P,cGold:{value:R[0]},cAmber:{value:R[1]},cUmber:{value:R[2]},cRose:{value:R[3]},cViolet:{value:R[4]},cRoseDeep:{value:R[6]}},Z=y.range(-.35,.35),Te=A[0][2],ee=I==="split"?y.range(-20,20):y.range(90,150),te=Math.sqrt(Math.max(1,Te*Te-ee*ee))+60,Ie=new e.Vector4(k.x-Math.cos(Z)*te,k.z+ee-Math.sin(Z)*te,k.x+Math.cos(Z)*te,k.z+ee+Math.sin(Z)*te),De=I==="split"?76:54,U=-3040,de=[[0,400,0],[0,400,-150],[0,400,-290],[0,378,-400],[0,300,-535],[0,180,-735],[0,70,-915],[0,15,-1020],[0,2,-1120],[0,20,-1300],[-15,38,-1480],[-62,46,-1690],[-120,58,-1900],[-30,76,-2030],[60,86,-2140],[88,90,-2240],[78,96,-2320],[63,104,-2390],[30,135,-2465],[6,180,-2530],[0,209,-2560]],Me=new e.Vector3(0,831,-480).normalize();for(let t=137;t<959;t+=137)de.push([0,209+Me.y*t,-2560+Me.z*t]);de.push([0,1040,U]);const oe=u.core.makePath(de);await u.yield();const fe=new e.Vector3,Ue=new e.Vector3(88,90,-2240),je=new e.Vector3(0,209,-2560);let B=.6,$=.74,Re=1e9,Ge=1e9;for(let t=0;t<=800;t++){oe.pointAt(t/800,fe);const c=fe.distanceTo(Ue),a=fe.distanceTo(je);c<Re&&(Re=c,B=t/800),a<Ge&&(Ge=a,$=t/800),t%100===99&&await u.yield()}const He=t=>t<=B?t*.6/B:t<=$?.6+(t-B)/($-B)*.14:.74+(t-$)/(1-$)*.26;await u.yield();const V=await n0({...u,rng:y.fork("hero")},{palette:ye,rain:_.rain,far:[1700,5600],groundAt:(t,c)=>qe(t,c+U)});V.object.position.copy(V.anchors.worldOffset),M.add(V.object);const ae=V.anchors.kernel.clone().add(V.anchors.worldOffset);await u.yield();{const i=new Float32Array(76803),o=new Uint32Array((200+25400*2)*3);let n=3,s=0;for(let d=1;d<=128;d++){const r=9200*Math.pow(d/128,1.8);for(let p=0;p<200;p++){const f=(p+d%2*.5)/200*G*2;i[n++]=Math.cos(f)*r,i[n++]=0,i[n++]=Math.sin(f)*r}d%24===0&&await u.yield()}for(let d=0;d<200;d++)o[s++]=0,o[s++]=1+(d+1)%200,o[s++]=1+d;for(let d=1;d<128;d++){for(let r=0;r<200;r++){const p=1+(d-1)*200+r,f=1+(d-1)*200+(r+1)%200,h=p+200,b=f+200;o[s++]=p,o[s++]=f,o[s++]=h,o[s++]=f,o[s++]=b,o[s++]=h}d%24===0&&await u.yield()}const m=new e.BufferGeometry;m.setAttribute("position",new e.BufferAttribute(i,3)),m.setIndex(new e.BufferAttribute(o,1)),m.boundingSphere=new e.Sphere(new e.Vector3(0,0,W),9200*1.5),await u.yield();var X=new e.ShaderMaterial({uniforms:{...D,uBridge:{value:Ie},uBridgeW:{value:De},uSplash:{value:Array.from({length:Se},()=>new e.Vector4(0,0,0,0))},uRib:{value:new e.Vector4(ae.x,ae.z,0,0)},uRibDir:{value:new e.Vector2(.94,-.34)},uSeaGain:{value:_.sea},uRoseAt:{value:new e.Vector3(-60,-2380,L==="after"?.085:.05)}},vertexShader:Y+`
          varying vec3 vW;
          void main() {
            vec2 p = position.xz + vec2(0.0, ${W.toFixed(1)});
            vW = vec3(p.x, surfY(p), p.y);
            gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.0);
          }`,fragmentShader:w.GLSL_NOISE+Y+`
          #define NSP ${Se}
          varying vec3 vW;
          uniform float uTime, uBridgeW, uSeaGain;
          uniform vec3 cGold, cAmber, cUmber, cRose, cViolet, cRoseDeep, uRoseAt;
          uniform vec4 uBridge, uRib, uSplash[NSP];
          uniform vec2 uRibDir;
          // granules: a weighted voronoi of moving cell points. Every cell's weight swells and sinks on its own 8-14 s
          // clock, so cells well up, spread to their lanes, are squeezed out and replaced without popping, and no two
          // are the same size (no paving). Returns (distance to the cell edge, cell id, distance to the cell point)
          // in cell units; gN = unit vector toward the nearest edge (downhill on the dome); gW = the cell's weight
          // -1..1 (1 = fully grown).
          vec3 gran(vec2 x, float t, out vec2 gN, out float gW) {
            vec2 n = floor(x), f = fract(x), mg = vec2(0.0), mr = vec2(0.0); float md = 8.0, id = 0.0; gW = 0.0;
            for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
              vec2 g = vec2(float(i), float(j)), h = hash22(n + g);
              vec2 o = 0.5 + 0.36 * sin(t * (0.35 + 0.4 * h.yx) + 6.2831 * h);
              float w = sin(t * (0.45 + 0.3 * h.x) + h.y * 43.0);
              vec2 r = g + o - f; float d = dot(r, r) - 0.15 * w;
              if (d < md) { md = d; mr = r; mg = g; gW = w; id = hash12(n + g + 17.3); }
            }
            // the edge distance is a smooth minimum over the neighbours, so cells have rounded corners (not cracked
            // tiles) and gN, its gradient, turns smoothly and dies away on the crown: a dome, not a pyramid
            float acc = 0.0; vec2 an = vec2(0.0);
            for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++) {
              vec2 g = mg + vec2(float(i), float(j)), h = hash22(n + g);
              vec2 o = 0.5 + 0.36 * sin(t * (0.35 + 0.4 * h.yx) + 6.2831 * h);
              float w = sin(t * (0.45 + 0.3 * h.x) + h.y * 43.0);
              vec2 r = g + o - f, dr = r - mr; float l2 = dot(dr, dr);
              if (l2 > 0.00001) { float l = sqrt(l2), e = max((dot(r, r) - 0.15 * w - md) / (2.0 * l), 0.0), k = exp(-13.0 * e); acc += k; an += k * dr / l; }
            }
            acc = max(acc, 1e-9); gN = an / acc;
            return vec3(max(-log(acc) / 13.0, 0.0), id, length(mr));
          }
          void main() {
            vec2 p = vW.xz;
            vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-3);
            vec3 N = normalize(vW - vec3(0.0, -R_SUN, ${W.toFixed(1)}));
            float mu = clamp(dot(N, V), 0.0, 1.0), k = sqrt(mu);
            vec2 ddx = dFdx(p), ddy = dFdy(p);                       // derivatives before any loop
            float fa = max(length(ddx), length(ddy)), fi = min(length(ddx), length(ddy));
            float t = uTime;

            // ---- spots: umbra, penumbral filaments (grains creep inward), plage round them
            float umb = 0.0, pen = 0.0, penL = 0.0, nearSpot = 0.0;
            float filt2 = smoothstep(2.5, 9.0, fa);
            for (int i = 0; i < NS; i++) {
              vec4 s = uSpot[i];
              if (s.z < 1.0) continue;
              vec2 v = p - s.xy; float d = length(v);
              if (d > s.w * 1.9) continue;
              vec2 dn = v / max(d, 1.0); float K = s.w / 5.5;
              float n1 = vnoise(vec3(dn * K * 0.4, float(i) * 3.7));
              float lo = vnoise(vec3(dn * 3.0, float(i) + 0.5));
              float rag = n1 - 0.5;
              float ui = 1.0 - smoothstep(0.9, 1.06, d / s.z + rag * 0.22 + (lo - 0.5) * 0.2);
              float pi_ = 1.0 - smoothstep(0.9, 1.04, d / s.w + rag * 0.1 + (lo - 0.5) * 0.14);
              float fil = vnoise(vec3(dn * K, d / 120.0 + t * 0.03 + n1 * 2.0));
              float grain = vnoise(vec3(dn * K * 2.1, d / 30.0 + t * 0.11));
              float fine = vnoise(vec3(dn * K * 3.1, d / 300.0 + 4.0));
              float fb = mix(smoothstep(0.4, 0.58, fil) * (0.45 + 0.55 * smoothstep(0.3, 0.6, fine)), 0.4, filt2);
              float radial = mix(0.55, 1.1, clamp((d - s.z) / max(s.w - s.z, 1.0), 0.0, 1.0));
              float L = mix(0.06, 0.95, fb) * mix(0.55 + 0.9 * grain * grain, 1.0, filt2) * radial;
              if (pi_ > pen) { pen = pi_; penL = L; }
              umb = max(umb, ui);
              nearSpot = max(nearSpot, 1.0 - smoothstep(1.0, 1.9, d / s.w));
            }
            // ---- the light bridge: a tongue of granulation across S1
            vec2 ba = uBridge.zw - uBridge.xy;
            float hb = clamp(dot(p - uBridge.xy, ba) / max(dot(ba, ba), 1.0), 0.0, 1.0);
            float bd = length(p - uBridge.xy - ba * hb) + (vnoise(p / 55.0) - 0.5) * 22.0;
            float br = 1.0 - smoothstep(uBridgeW * 0.5 - 6.0, uBridgeW * 0.5 + 6.0, bd);
            umb *= 1.0 - br; pen *= 1.0 - br;

            // ---- granules: domed cells with bright crowns, darker shoulders and hairline lanes
            float sc = mix(40.0, 26.0, br), fc = fa / sc, fic = fi / sc;
            vec2 pw = p + (vec2(vnoise(p / 31.0), vnoise(p / 31.0 + 17.3)) - 0.5) * 24.0;        // warped: no straight edges
            vec2 gN; float gW;
            vec3 g = gran(pw / sc + vec2(3.7, 1.9), t, gN, gW);
            float life = 0.5 + 0.5 * gW;
            float filt = smoothstep(0.045, 0.3, fc);                    // the pattern melts to its mean well before a pixel nears a cell: no crackle in the mid field
            float nearK = 1.0 - smoothstep(0.5, 2.4, fa);               // fine structure only where a pixel is under about 2 m
            float wl = max(0.012 + 0.014 * (1.0 - life), 0.7 * fic);    // the hairline at the bottom of each lane, never under 0.7 px
            float midK = smoothstep(0.015, 0.07, fc);                   // 0 near the lens (domes) .. 1 where a cell is ~15 px (a gold field with hairline seams)
            float lane = 1.0 - smoothstep(wl, wl + 0.012 + fc * 0.4, g.x);
            float eg = max(g.x - wl, 0.0), shd = exp(-eg * 10.0);        // shd: 1 on the shoulder beside the lane, 0 on the crown
            float cen = 1.0 - smoothstep(0.0, 0.7, g.z);
            // one old cell in a few darkens at its centre before it bursts
            float pit = smoothstep(0.72, 1.0, life) * step(0.55, g.y) * (1.0 - smoothstep(0.05, 0.26, g.z));
            float top = (mix(0.4, 0.66, midK) + mix(0.34, 0.2, midK) * (1.0 - shd) + mix(0.3, 0.16, midK) * cen) * (0.74 + 0.26 * life) * (1.0 - 0.42 * pit);
            float sub = 1.0;                                            // the boiling froth on the cell tops, near the lens
            if (nearK > 0.01) {
              vec2 sN; float sW;
              vec3 g2 = gran(pw / 6.3 + g.y * 13.0 + vec2(t * 0.03, -t * 0.02), t * 1.6, sN, sW);
              float fine = vnoise(p / 1.9 + vec2(t * 0.21, -t * 0.13));
              sub = mix(1.0, (0.64 + 0.5 * smoothstep(0.0, 0.26, g2.x) + 0.06 * sW) * (0.88 + 0.24 * fine), nearK * (1.0 - 0.5 * shd));
            }
            // dome relief: the shoulder's slope tilts the normal, and limb darkening then brightens the shoulder that
            // faces the lens and turns the far one umber
            vec3 Nl = normalize(N + vec3(gN.x, 0.0, gN.y) * (0.6 * shd * (1.0 - lane)));
            float rel = clamp(dot(Nl, V) / max(mu, 0.1), 0.5, 1.5);
            float tex = vnoise(p / 6.5 + g.y * 31.0 + vec2(t * 0.11, -t * 0.07));
            float L = top * sub * mix(1.0, rel, 0.8 - 0.55 * midK) * (0.9 + 0.2 * tex);
            L = mix(L, mix(0.11, 0.36, midK), lane);
            // filtered to the mean, with a low-contrast grain left on the mean so the mid field is a soft mottle, not flat
            L = mix(L, 0.6 * (0.9 + 0.2 * vnoise(p / 85.0 + vec2(t * 0.01, 3.0))), filt);
            float hue = mix((1.0 - lane) * (1.0 - shd) * (0.5 + 0.5 * cen) * clamp(rel, 0.55, 1.2), 0.55, filt);
            float core = smoothstep(0.02, 0.09, g.x);                  // 0 in the lanes and along their edges
            // magnetic bright points winking in the lanes
            float bpn = vnoise(p / 13.0 + 11.0);
            float bp = (1.0 - core) * smoothstep(0.62, 0.8, bpn) * smoothstep(0.35, 0.8, vnoise(p / 21.0 + vec2(t * 0.35, -t * 0.27))) * (1.0 - filt);
            // the slow 300 m mottle and the plage round the spots
            float mot = vnoise(p / 300.0 + vec2(t * 0.004, t * 0.003)) * 0.62 + vnoise(p / 120.0 - vec2(t * 0.006, 0.0)) * 0.38;
            float plage = nearSpot * smoothstep(0.42, 0.75, vnoise(p / 95.0 + 7.0));
            L *= (0.72 + 0.5 * mot) * (1.0 + 0.22 * plage) * (1.0 + 0.2 * br);
            L = L * mix(uSeaGain, 1.0, clamp(plage * 0.75, 0.0, 1.0)) + bp * 0.85;
            hue = max(hue, bp);
            float lim = 0.46 + 0.54 * k;
            vec3 seaC = mix(cAmber, cGold, (0.3 + 0.7 * hue) * smoothstep(0.08, 0.5, k) * mix(1.0, 0.25, 1.0 - uSeaGain));
            seaC = mix(vec3(0.62, 0.12, 0.022), seaC, smoothstep(0.02, 0.36, k));
            seaC = mix(seaC, vec3(1.0, 0.62, 0.16), 0.32 * smoothstep(0.78, 1.0, L) * smoothstep(0.25, 0.6, k) * uSeaGain);   // crowns: pale gold, never white
            vec3 col = seaC * min(L, 1.0) * lim;

            // ---- penumbra and umbra
            vec3 penC = mix(cAmber, cGold, 0.25 + 0.5 * penL) * penL * (0.55 + 0.45 * k) * mix(uSeaGain, 1.0, 0.4) + cUmber * 0.6;
            col = mix(col, penC, pen);
            float un = vnoise(p / 70.0 + vec2(t * 0.02, 0.0));
            vec3 uc = vec3(0.044, 0.019, 0.009) * (0.4 + 1.0 * un);
            vec2 dc = p / 17.0, di = floor(dc), dh = hash22(di);
            float dr = length((fract(dc) - 0.2 - 0.6 * dh) * 17.0);
            float rad = max(1.4 + 2.6 * dh.x * dh.y, fi * 0.9);
            float ember = (1.0 - smoothstep(rad * 0.35, rad, dr)) * step(0.4, hash12(di + 5.0)) * max(0.0, 0.5 + 0.5 * sin(t * (0.8 + 2.0 * dh.y) + dh.x * 40.0));
            uc += mix(cAmber, cGold, dh.x) * ember * 0.75 * (1.0 - smoothstep(6.0, 22.0, fa));
            uc += cRose * uRoseAt.z * exp(-length(p - uRoseAt.xy) / 420.0) * (0.6 + 0.8 * un);
            col = mix(col, uc, umb);

            // ---- rings that ripple out where a shower lands
            float ring = 0.0;
            for (int i = 0; i < NSP; i++) {
              vec4 s = uSplash[i];
              if (s.z <= 0.0) continue;
              float sec = fract(t / s.z + s.w - 0.905) * s.z, d = length(p - s.xy);
              float rr = 16.0 + 46.0 * sec, w = 5.0 + 1.6 * sec + fa;
              float a = exp(-sec * 0.45) * (1.0 - smoothstep(4.5, 7.0, sec));
              float q = (d - rr) / w, q2 = (d - rr * 0.62) / w;
              ring += (exp(-q * q) + 0.5 * exp(-q2 * q2)) * a;
            }
            col = col * (1.0 + 0.45 * ring) + (cRose * 0.5 + vec3(0.16, 0.09, 0.06)) * ring * (0.3 + 0.7 * max(umb, pen));

            // ---- the flare: two rose ribbons running along the surface either side of the kernel
            if (uRib.w > 0.001) {
              vec2 rp = p - uRib.xy; float a = dot(rp, uRibDir), c = dot(rp, vec2(-uRibDir.y, uRibDir.x));
              float wob = (vnoise(vec2(a / 85.0, sign(c) * 3.0 + 9.0)) - 0.5) * 60.0;
              float cc = abs(c) - 150.0 + wob, ext = uRib.z * 640.0, w = 6.0 + fa * 0.7;
              float run = 1.0 - smoothstep(ext - 90.0, ext, abs(a));
              float rib = exp(-cc * cc / (w * w)) * run * uRib.w * (0.65 + 0.35 * vnoise(vec2(a / 14.0 - t * 2.0, 1.0)));
              col += cRose * (rib * 1.1 + exp(-abs(cc) / 30.0) * run * uRib.w * 0.16) + vec3(1.0, 0.85, 0.9) * rib * rib * 0.5;
            }
            // ---- rose-umber emission haze: the only depth cue above the surface
            col += cRoseDeep * 0.4 * (1.0 - exp(-dist / 2600.0)) * (1.0 - k);
            gl_FragColor = vec4(max(col, 0.0), 1.0);
          }`});await u.yield();const v=new e.Mesh(m,X);v.frustumCulled=!1,v.name="sea",M.add(v)}V.anchors.splashes.slice().sort((c,a)=>(a.near?1:0)-(c.near?1:0)).slice(0,Se).forEach((c,a)=>X.uniforms.uSplash.value[a].set(c.x,c.z+U,c.period,c.phase)),await u.yield();const ie={value:.0028},Ke=new e.ShaderMaterial({uniforms:{...D,uStream:{value:_.stream*(.8+.4*ue)},uJetH:{value:_.jet*(.9+.2*ue)}},side:e.BackSide,depthWrite:!1,depthTest:!1,vertexShader:`
        varying vec3 vDir;
        void main() { vDir = position; gl_Position = projectionMatrix * viewMatrix * vec4(cameraPosition + position * 8200.0, 1.0); }`,fragmentShader:w.GLSL_HASH+w.GLSL_VALUE_NOISE+`
        varying vec3 vDir;
        uniform float uTime, uStream, uJetH;
        uniform vec3 cGold, cRose, cViolet, cRoseDeep;
        void main() {
          vec3 v = normalize(vDir);
          vec3 oc = cameraPosition - vec3(0.0, -${F.toFixed(1)}, ${W.toFixed(1)});
          float Lc = max(length(oc), 1.0); vec3 n = oc / Lc;
          float alpha = asin(clamp(${F.toFixed(1)} / Lc, 0.0, 1.0));
          float el = acos(clamp(-dot(v, n), -1.0, 1.0)) - alpha;         // radians above the limb
          vec3 e1 = normalize(cross(n, vec3(1.0, 0.0, 0.0))), e2 = cross(n, e1);
          float az = atan(dot(v, e2), dot(v, e1) + 1e-5);                  // seam behind the entry
          // corona: pearl-violet streamers rising radially, drifting sideways very slowly
          float drift = uTime * 0.004;
          float s1 = vnoise(vec2(az * 9.0 + drift, 1.3));
          float s2 = vnoise(vec2(az * 31.0 - drift * 2.3, 4.1 + el * 2.0));
          float s3 = vnoise(vec2(az * 83.0 + drift * 4.0, 9.7 + el * 5.0));
          float streak = s1 * s1 * (0.3 + 0.7 * s2 * s2) * (0.45 + 0.55 * s3) * 1.9;
          float I = 0.25 * uStream * exp(-max(el, 0.0) / mix(0.05, 0.15, s1)) * (0.08 + 0.92 * streak) * (1.0 - smoothstep(0.28, 0.44, el));
          vec3 col = cViolet * I;
          // chromosphere: a rose hairline on the limb, ragged with flame jets
          float j1 = vnoise(vec2(az * 520.0, uTime * 0.22));
          float j2 = vnoise(vec2(az * 170.0 + 3.0, uTime * 0.09));
          float j3 = vnoise(vec2(az * 40.0 + 8.0, uTime * 0.03));
          float h = (0.007 + 0.02 * j1 * j1 * (0.4 + 0.6 * j2) + 0.008 * j3) * mix(1.0, uJetH, 0.6);
          float e = max(el, 0.0) / h;
          float chrom = 1.0 - smoothstep(0.3, 1.0, e);
          col += (mix(cRose * 0.95, cRoseDeep * 0.9, smoothstep(0.0, 0.9, e)) + vec3(1.0, 0.8, 0.6) * 0.22 * exp(-e * 7.0)) * chrom;
          if (el < 0.0) col = vec3(0.62, 0.12, 0.022) * 0.46 * 0.6 + cRoseDeep * 0.3;
          gl_FragColor = vec4(max(col, 0.0), 1.0);
        }`}),me=new e.Mesh(new e.IcosahedronGeometry(1,4),Ke);me.frustumCulled=!1,me.renderOrder=-10,M.add(me),await u.yield();const ne=new e.Group;M.add(ne);{const t=y.fork("stars"),c=[],a=[],i=Math.round(_.stars*1.9*(.6+.4*q)),o=new e.Vector3;let n=0;for(;c.length<i&&n++<2e4;){if(o.set(t.gauss(),t.gauss(),t.gauss()),o.lengthSq()<1e-4||(o.normalize(),o.y<-.32))continue;const v=z(-.25,.45,o.y);t.chance(.22+.78*v)&&(c.push([o.x*7800,o.y*7800,o.z*7800]),a.push(t.range(.6,1.6)*(.5+.5*v)*(t.chance(.09)?1.9:1)))}await u.yield();const s=w.makeGlows({rng:t,positions:c,sizes:a,colors:["#ffffff","#E9E0FF","#fff1d6","#cfd8ff"],size:36,intensity:4.4,halo:.5,flicker:.12,minAngle:.0062,fogAmount:0,time:P,renderOrder:-5});s.object.frustumCulled=!1,ne.add(s.object);const m=w.makeGlow({rng:t,position:[-3100,3250,-6400],color:"#ffe6bd",size:95,intensity:2.6,halo:1,spikes:0,flicker:0,minAngle:.009,fogAmount:0,time:P,renderOrder:-5});m.object.frustumCulled=!1,ne.add(m.object)}await u.yield();const Le={...D,uCen:{value:new e.Vector2(0,-400)},uBox:{value:1150},uJetH:{value:Math.min(_.jet*(.9+.2*ue),1.7)},uPx:ie};{const c=[],a=[];for(let r=0;r<=6;r++)c.push(-1,r/6,0,1,r/6,0);for(let r=0;r<6;r++){const p=r*2;a.push(p,p+1,p+2,p+2,p+1,p+3)}const i=Math.round(8500*q*Ae),o=y.fork("jets"),n=new Float32Array(i*4),s=new Float32Array(i*4);for(let r=0;r<i;r++)r>0&&o.chance(.6)?(n[r*4]=(n[(r-1)*4]+o.gauss()*.006+1)%1,n[r*4+1]=(n[(r-1)*4+1]+o.gauss()*.006+1)%1):(n[r*4]=o(),n[r*4+1]=o()),n[r*4+2]=o(),n[r*4+3]=o.range(30,45),s[r*4]=o.range(5,9),s[r*4+1]=o.range(2,3),s[r*4+2]=o(),s[r*4+3]=o();const m=new e.InstancedBufferGeometry;m.setAttribute("position",new e.Float32BufferAttribute(c,3)),m.setIndex(a),m.setAttribute("aB",new e.InstancedBufferAttribute(n,4)),m.setAttribute("aR",new e.InstancedBufferAttribute(s,4)),m.instanceCount=i;const v=new e.ShaderMaterial({uniforms:Le,transparent:!0,depthWrite:!1,side:e.DoubleSide,vertexShader:w.GLSL_HASH+w.GLSL_VALUE_NOISE+Y+`
          attribute vec4 aB, aR;
          uniform vec2 uCen; uniform float uBox, uJetH, uTime, uPx;
          varying vec3 vJ;   // across, along, dim
          varying vec2 vS;   // seed, hue
          void main() {
            vec2 base = uCen + (fract(aB.xy - uCen / uBox) - 0.5) * uBox;
            vec2 rel = (base - uCen) / (uBox * 0.5);
            float edge = 1.0 - smoothstep(0.72, 1.0, max(abs(rel.x), abs(rel.y)));
            // densest along the dark lanes of the 300 m mottle and round the spots; none in the umbra
            float mot = vnoise(base / 300.0 + vec2(uTime * 0.004, uTime * 0.003)) * 0.62 + vnoise(base / 120.0 - vec2(uTime * 0.006, 0.0)) * 0.38;
            float dens = smoothstep(0.54, 0.3, mot) * 0.95 + 0.03;
            float fa_ = vnoise(base / 420.0 + 3.0) * 12.566;
            vec2 lean = vec2(cos(fa_), sin(fa_));
            float tall = 1.0;
            for (int i = 0; i < NS; i++) {
              vec4 s = uSpot[i];
              if (s.z < 1.0) continue;
              vec2 v = base - s.xy; float d = length(v), q = d / s.w;
              float shore = smoothstep(0.9, 1.0, q) * (1.0 - smoothstep(1.02, 1.3, q)) * 0.5 * (0.4 + 0.6 * vnoise(base / 60.0 + 5.0));
              dens = max(dens * smoothstep(0.8, 1.0, q), shore);
              lean = mix(lean, v / max(d, 1.0), 1.0 - smoothstep(1.0, 1.7, q));       // like reeds round a pond
              tall = max(tall, 1.0 + 0.25 * shore);
            }
            float keep = smoothstep(0.0, 0.12, dens - aR.z * 0.92);
            float ph = fract(uTime / aR.x + aB.z);
            float up = pow(max(sin(3.14159265 * ph), 0.0), 0.7);
            float H = aB.w * uJetH * tall * up * edge * keep;
            float y = position.y;
            float amt = 0.3 + 0.14 * sin(uTime * 0.8 + aB.z * 6.2831) + 0.25 * (1.0 - up);
            vec3 b3 = vec3(base.x, surfY(base) - 1.0, base.y);
            vec3 L3 = vec3(lean.x, 0.0, lean.y);
            vec3 P = b3 + vec3(0.0, 1.0, 0.0) * H * y + L3 * H * amt * y * y + L3 * sin(uTime * 1.3 + aB.z * 40.0 + y * 3.0) * 0.6 * y;
            vec3 T = normalize(vec3(0.0, 1.0, 0.0) + L3 * amt * 2.0 * y);
            vec3 toCam = cameraPosition - P; float dist = length(toCam);
            vec3 side = normalize(cross(T, toCam) + vec3(1e-4, 0.0, 0.0));
            float w = aR.y * 0.62 * (1.0 - 0.86 * y) * (0.6 + 0.4 * up);
            float wmin = 0.75 * uPx * dist, dim = w / max(w, wmin);
            P += side * position.x * max(w, wmin);
            vJ = vec3(position.x, y, dim * step(0.5, H) * (1.0 - smoothstep(380.0, 640.0, dist)));
            vS = vec2(aB.z, aR.w);
            gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.0);
          }`,fragmentShader:w.GLSL_HASH+w.GLSL_VALUE_NOISE+`
          uniform vec3 cGold, cAmber, cRose, cRoseDeep; uniform float uTime;
          varying vec3 vJ; varying vec2 vS;
          void main() {
            float x = vJ.x, y = vJ.y;
            float fl = 0.72 + 0.4 * vnoise(vec2(y * 5.0 - uTime * 1.3 + vS.x * 30.0, vS.x * 9.0));
            vec3 c = mix(mix(cGold, cAmber, 0.5) * 0.8, mix(cRose, cRoseDeep, 0.2 + 0.35 * vS.y) * 1.15, smoothstep(0.03, 0.42, y));
            float a = (1.0 - x * x) * (1.0 - y * y * y) * vJ.z * smoothstep(0.0, 0.06, y);
            gl_FragColor = vec4(max(c * fl * (0.95 - 0.2 * y), 0.0), clamp(a * 0.8, 0.0, 1.0));
          }`}),d=new e.Mesh(m,v);d.frustumCulled=!1,d.renderOrder=1,M.add(d)}await u.yield();const j=L==="after"?new e.Vector2(-100,-2330):new e.Vector2(ae.x,ae.z),H=X.uniforms.uRibDir.value,se=new e.Vector2(-H.y,H.x);X.uniforms.uRib.value.set(j.x,j.y,L==="after"?1:0,L==="after"?.8:0);const Ce={...D,uPx:ie,uLift:{value:Array.from({length:ze},()=>new e.Vector2(0,0))}};{const a=[],i=[];for(let f=0;f<=110;f++)for(let h=0;h<=6;h++)a.push(f/110,h/6,0);for(let f=0;f<110;f++)for(let h=0;h<6;h++){const b=f*7+h,S=b+6+1;i.push(b,b+1,S,S,b+1,S+1)}const o=y.fork("rope"),n=[],s=[],m=[],v=o.sign();for(let f=0;f<4;f++)n.push(520,-3150,1150,-3500),f<3?(s.push(900,40,f*2.094,v*5.5),m.push(15,0,0,o())):(s.push(900,0,0,0),m.push(62,0,.1,o()));if(L==="after")for(let f=0;f<6;f++){const h=-640+f*92+o.range(-18,18),b=o.range(110,190);n.push(j.x+H.x*h+se.x*150,j.y+H.y*h+se.y*150,j.x+H.x*(h+20)-se.x*150,j.y+H.y*(h+20)-se.y*150),s.push(b,0,0,0),m.push(o.range(5,7.5),1+f,.85,o())}const d=new e.InstancedBufferGeometry;d.setAttribute("position",new e.Float32BufferAttribute(a,3)),d.setIndex(i),d.setAttribute("aA",new e.InstancedBufferAttribute(new Float32Array(n),4)),d.setAttribute("aP",new e.InstancedBufferAttribute(new Float32Array(s),4)),d.setAttribute("aQ",new e.InstancedBufferAttribute(new Float32Array(m),4)),d.instanceCount=m.length/4;const r=new e.ShaderMaterial({uniforms:Ce,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,vertexShader:Y+`
          #define NLIFT ${ze}
          attribute vec4 aA, aP, aQ;
          uniform vec2 uLift[NLIFT]; uniform float uTime, uPx;
          varying vec3 vN, vView; varying vec4 vT;   // s, angle, gain, gold
          varying vec2 vM;                           // length (m), seed
          vec3 arch(float s, float H, float lift) {
            float a = 3.14159265 * s;
            vec2 xz = mix(aA.xy, aA.zw, 0.5 - 0.5 * cos(a));
            float y = H * sin(a) * (1.0 + 0.3 * sin(2.0 * a) * (1.0 - lift));
            return vec3(xz.x, y, xz.y);
          }
          void main() {
            int slot = int(aQ.y + 0.5);
            float lift = uLift[slot].x, s = position.x;
            float H = max(aP.x * lift, 2.0);
            vec3 c = arch(s, H, lift), c1 = arch(s + 0.004, H, lift);
            float yb = mix(surfY(aA.xy), surfY(aA.zw), s) - 2.0;
            vec3 T = normalize(c1 - c);
            vec2 ab = aA.zw - aA.xy;
            vec3 Nn = normalize(vec3(ab.y, 0.0, -ab.x)), n2 = cross(T, Nn);
            float th = aP.z + aP.w * 6.2831853 * s * mix(1.0, 0.3, lift) + uTime * 0.12;
            float rS = aP.y * (0.3 + 0.7 * sin(3.14159265 * s)) * (0.7 + 0.8 * lift);
            c += (Nn * cos(th) + n2 * sin(th)) * rS + Nn * sin(uTime * 0.21 + s * 5.0 + aQ.w * 6.0) * 6.0 * lift;
            c.y += yb;
            float dist = length(cameraPosition - c);
            float r = aQ.x * (1.0 + 0.25 * sin(s * 40.0 + aQ.w * 30.0 - uTime * 0.6)), rmin = 0.8 * uPx * dist;
            float dim = r / max(r, rmin); r = max(r, rmin);
            float a = position.y * 6.2831853;
            vec3 dir = Nn * cos(a) + n2 * sin(a);
            vec3 p = c + dir * r;
            vN = dir; vView = cameraPosition - p;
            vT = vec4(s, position.y, uLift[slot].y * dim * (aQ.x > 30.0 ? 0.22 : 1.0), aQ.z);
            vM = vec2(3.14159265 * sqrt((dot(ab, ab) * 0.25 + H * H) * 0.5), aQ.w);
            gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
          }`,fragmentShader:w.GLSL_HASH+w.GLSL_VALUE_NOISE+`
          uniform vec3 cGold, cAmber, cRose, cRoseDeep, cViolet; uniform float uTime;
          varying vec3 vN, vView; varying vec4 vT; varying vec2 vM;
          void main() {
            float ndv = abs(dot(normalize(vN), normalize(vView)));
            float edge = 1.0 / max(ndv, 0.25);
            float a = vT.y * 6.2831853, along = abs(vT.x - 0.5) * vM.x;
            float t1 = vnoise(vec3(cos(a) * 2.2, sin(a) * 2.2, along / 55.0 + uTime * 0.5 + vM.y * 20.0));
            float t2 = vnoise(vec3(cos(a) * 5.0, sin(a) * 5.0, along / 18.0 + uTime * 0.9 + vM.y * 7.0));
            float th = smoothstep(0.35, 0.8, t1) * 0.7 + smoothstep(0.45, 0.9, t2) * 0.6;
            float I = min(0.9, (0.07 + 0.36 * th) * (0.4 + 0.6 * edge));
            vec3 body = mix(mix(cRoseDeep, cRose, smoothstep(0.0, 0.7, th)), mix(cAmber, cGold, smoothstep(0.0, 0.6, th)), vT.w);
            body = mix(body, mix(vec3(1.0, 0.8, 0.88), vec3(1.0, 0.92, 0.8), vT.w), 0.4 * smoothstep(0.8, 1.3, th));
            float foot = sin(3.14159265 * vT.x);
            body = mix(mix(cGold, vec3(1.0, 0.9, 0.75), 0.4), body, smoothstep(0.0, 0.3, foot));
            gl_FragColor = vec4(max(body * I * vT.z * smoothstep(0.0, 0.03, foot), 0.0), 1.0);
          }`}),p=new e.Mesh(d,r);p.frustumCulled=!1,p.renderOrder=2,M.add(p)}if(await u.yield(),L==="prominence"){const t=new e.PlaneGeometry(1300,520,90,14);t.translate(0,260,0);const c=(a,i)=>new e.ShaderMaterial({uniforms:{...D,uSeed:{value:a},uGain:{value:i}},transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:Y+`
          uniform float uTime, uSeed;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec4 wp = modelMatrix * vec4(position, 1.0);
            wp.z += sin(position.x / 130.0 + uSeed * 5.0 + uTime * 0.07) * 40.0 * uv.y + sin(position.x / 47.0 + uTime * 0.11) * 12.0 * uv.y;
            wp.y += surfY(wp.xz) - 6.0;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }`,fragmentShader:w.GLSL_HASH+w.GLSL_VALUE_NOISE+`
          uniform vec3 cGold, cRose, cRoseDeep; uniform float uTime, uSeed, uGain;
          varying vec2 vUv;
          void main() {
            float x = vUv.x * 1300.0, y = vUv.y;
            float top = 0.5 + 0.48 * vnoise(vec2(x / 190.0 + uSeed * 11.0, 2.0));
            float pil = vnoise(vec2(x / 70.0 + uSeed * 31.0, 7.0));
            float body = (1.0 - smoothstep(top - 0.22, top, y)) * mix(smoothstep(0.42, 0.62, pil), 1.0, smoothstep(0.08, 0.14 + 0.3 * pil, y));
            float th = vnoise(vec2(x / 6.0 + uSeed * 9.0, y * 6.0 + uTime * 0.12));
            float th2 = vnoise(vec2(x / 19.0, y * 2.5 + uTime * 0.05 + 4.0));
            float I = body * (0.16 + 0.55 * smoothstep(0.3, 0.8, th) * (0.4 + 0.8 * th2)) * (0.55 + 0.6 * smoothstep(0.2, 0.8, vnoise(vec2(x / 45.0 + uSeed * 3.0, y * 1.5 + uTime * 0.03))));
            I *= smoothstep(0.0, 0.1, vUv.x) * (1.0 - smoothstep(0.9, 1.0, vUv.x));
            vec3 col = mix(cRose, cRoseDeep * 1.6, smoothstep(0.25, 1.0, y / max(top, 0.05))) * I + cGold * 0.3 * exp(-y * 16.0) * body;
            gl_FragColor = vec4(max(col * uGain, 0.0), 1.0);
          }`});for(let a=0;a<2;a++){const i=new e.Mesh(t,c(y.range(0,1),a===0?2.1:1.2));i.position.set(-1180-a*60,0,-3350-a*110),i.rotation.y=.5-a*.1,i.frustumCulled=!1,i.renderOrder=2,M.add(i)}await u.yield()}const re={...D,uHead:{value:new e.Vector3(-1500,700,-2700)},uTail:{value:new e.Vector3(-.6,.8,0)},uFade:{value:0}};let K=null;if(E.rare){const t=new e.PlaneGeometry(2,1.06,2,24);t.translate(0,.47,0),K=new e.Mesh(t,new e.ShaderMaterial({uniforms:re,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:`
          uniform vec3 uHead, uTail;
          varying vec2 vC;
          void main() {
            vec3 c = uHead + uTail * position.y * 900.0;
            vec3 side = normalize(cross(uTail, cameraPosition - c) + vec3(0.0, 1e-4, 0.0));
            float w = mix(46.0, 150.0, clamp(position.y, 0.0, 1.0));
            vC = vec2(position.x, position.y);
            gl_Position = projectionMatrix * viewMatrix * vec4(c + side * position.x * w, 1.0);
          }`,fragmentShader:w.GLSL_HASH+w.GLSL_VALUE_NOISE+`
          uniform vec3 cViolet, cRose; uniform float uTime, uFade;
          varying vec2 vC;
          void main() {
            float x = vC.x, y = vC.y, ym = y * 900.0;
            float head = exp(-(x * x * 5.0 + ym * ym / 900.0));
            float tail = pow(clamp(1.0 - y, 0.0, 1.0), 1.6) * step(0.0, y) * exp(-x * x * (1.5 + 4.0 * (1.0 - y))) * (1.0 - x * x)
                       * (0.45 + 0.55 * vnoise(vec2(x * 3.0, ym / 70.0 - uTime * 2.0)));
            vec3 col = (cViolet * (tail * 0.8 + head * 2.6) + vec3(1.0) * head * head * 1.2 + cRose * tail * 0.08) * uFade;
            gl_FragColor = vec4(max(col, 0.0), 1.0);
          }`})),K.frustumCulled=!1,K.renderOrder=3,M.add(K)}await u.yield();const O=new e.Group;O.name="shield-rig",M.add(O);const le={uTime:P,cGold:{value:R[0]},cRose:{value:R[3]},cRoseDeep:{value:R[6]},cViolet:{value:R[4]},uUnder:{value:new e.Color(1,.46,.03)},uTopL:{value:new e.Color(.14,.11,.15)},uSkin:{value:Fe?1:0},uGlow:{value:1}};{const t=[],c=new e.Matrix4().makeRotationX(4*G/180).setPosition(0,-1.05,-.8),a=(l,g,x)=>{x&&l.applyMatrix4(x);const N=l.attributes.position.count;l.setAttribute("aL",new e.BufferAttribute(l.attributes.position.array.slice(),3)),l.setAttribute("aK",new e.BufferAttribute(new Float32Array(N).fill(g),1)),l.applyMatrix4(c),t.push(l)},i=(l,g,x)=>new e.Vector3(Math.sin(l*G/180)*g,x,-Math.cos(l*G/180)*g),o=(l,g,x)=>new e.Matrix4().makeTranslation(l.x,l.y,l.z).multiply(new e.Matrix4().makeRotationY(g)).multiply(new e.Matrix4().makeRotationX(x)),n=[[1.19,-.1],[1.2,-.02],[1.195,.012],[1.17,.024],[1.14,.018],[1.12,0],[1.105,-.006],[1.09,0],[1,.004],[.6,.01],[.001,.012]];a(new e.LatheGeometry(n.map(l=>new e.Vector2(l[0],l[1])),160),0),await u.yield();for(let l=0;l<8;l++){const g=22.5+l*45,x=-g*G/180;a(new e.BoxGeometry(.085,.03,.15),1,o(i(g,1.15,.036),x,0)),a(new e.BoxGeometry(.06,.05,.03),1,o(i(g,1.215,0),x,0)),a(new e.CylinderGeometry(.014,.014,.022,8),1,o(i(g,1.11,.058),x,0))}await u.yield();for(const l of[-1,1]){const g=-l*58*G/180;a(new e.BoxGeometry(.32,.016,.46),2,o(i(l*58,1.4,.1),g,13*G/180)),a(new e.BoxGeometry(.36,.028,.028),1,o(i(l*58,1.175,.05),g,13*G/180));for(const ce of[-5,5]){const a0=new e.CatmullRomCurve3([i(l*(50+ce),.78,.012),i(l*(53+ce),.95,.05),i(l*(56+ce*.6),1.1,.06),i(l*(57.5+ce*.5),1.24,.07)]);a(new e.TubeGeometry(a0,18,.011,5),3)}const x=i(l*33,1.16,.03),N=x.clone().add(new e.Vector3(l*1.15,0,-.62));a(new e.TubeGeometry(new e.LineCurve3(x,N),12,.006,4),4);const Ee=new e.SphereGeometry(.017,8,6);Ee.attributes.uv.array.fill(1),a(Ee,5,new e.Matrix4().makeTranslation(N.x,N.y,N.z)),a(new e.CylinderGeometry(.02,.026,.05,8),1,new e.Matrix4().makeTranslation(x.x,x.y+.01,x.z))}await u.yield();const s=i0(t,!1);t.forEach(l=>l.dispose()),await u.yield();var Oe=new e.ShaderMaterial({uniforms:le,side:e.DoubleSide,vertexShader:`
          attribute float aK; attribute vec3 aL;
          uniform float uTime;
          varying vec3 vL, vNr, vPr; varying float vK; varying vec2 vUv2;
          void main() {
            vec3 p = position;
            if (aK > 3.5) {       // whips tremble
              float a = uv.x * uv.x, sg = sign(p.x);
              p += vec3(sin(uTime * 31.0 + sg), cos(uTime * 27.0 + 1.3 * sg), 0.0) * 0.011 * a + vec3(0.0, sin(uTime * 2.3 + sg), 0.0) * 0.022 * a;
            }
            vL = aL; vK = aK; vNr = normal; vPr = p; vUv2 = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }`,fragmentShader:w.GLSL_HASH+w.GLSL_VALUE_NOISE+w.GLSL_VORONOI+`
          uniform vec3 uUnder, uTopL, cGold, cRose, cRoseDeep, cViolet; uniform float uTime, uSkin, uGlow;
          varying vec3 vL, vNr, vPr; varying float vK; varying vec2 vUv2;
          void main() {
            vec2 q = vL.xz, cuv = vUv2 * vec2(6.0, 9.0);
            float fq = fwidth(q.x) + fwidth(q.y), fwc = fwidth(cuv.x) + fwidth(cuv.y);      // derivatives first
            vec3 n = normalize(vNr), v = normalize(-vPr);
            if (dot(n, v) < 0.0) n = -n;
            float r = length(q), ang = atan(q.x, -q.y + 1e-5);
            vec2 rd = q / max(r, 1e-3);
            float under = max(-n.y, 0.0) + 0.4 * max(dot(n.xz, rd), 0.0);
            vec3 col;
            if (vK < 0.5) {
              // top skin: pale ceramic with hairline crazing at two scales (or bare carbon weave), in shadow; the lip
              // burns: white-gold at the edge grading smoothly through gold to dull rose 20 cm in
              float f1 = fq * 34.0, f2 = fq * 88.0;
              vec3 vor = voronoi(q * 34.0 + 3.0), vor2 = voronoi(q * 88.0 + 11.0);
              float crack = max((1.0 - smoothstep(f1 * 0.25, 0.012 + f1 * 0.85, vor.y)) * (1.0 - smoothstep(0.35, 0.9, f1)),
                                0.6 * (1.0 - smoothstep(f2 * 0.25, 0.015 + f2 * 0.85, vor2.y)) * (1.0 - smoothstep(0.3, 0.8, f2)));
              float weave = 0.5 + 0.5 * sin(q.x * 230.0) * sin(q.y * 230.0) * (1.0 - smoothstep(0.3, 1.2, fq * 27.0));
              vec3 skin = mix(vec3(0.74, 0.72, 0.7) * (0.9 + 0.12 * vor.z), vec3(0.03, 0.03, 0.036) * (0.5 + 1.2 * weave), uSkin);
              float heat = smoothstep(0.98, 1.17, r), lip = smoothstep(1.125, 1.18, r) * (1.0 - smoothstep(1.196, 1.2, r) * 0.6);
              float mid = smoothstep(1.07, 1.16, r);
              float breathe = 0.85 + 0.15 * sin(uTime * 1.1 + ang * 3.0) + 0.07 * sin(uTime * 3.7 + ang * 11.0);
              vec3 lit = skin * (uTopL * mix(2.4, 1.0, uSkin) * (0.55 + 0.45 * n.y) + uUnder * under * 0.5);
              lit *= 1.0 - 0.34 * crack * (1.0 - uSkin * 0.7);
              float lw = 0.9 + 0.1 * sin(ang * 140.0);
              vec3 glow = mix(cRoseDeep * 0.8, cRose * 0.6, heat) * heat * heat * 0.5
                        + cGold * mid * mid * (1.0 - lip) * 0.55
                        + mix(cGold, vec3(1.0, 0.93, 0.8), 0.5) * lip * lip * 2.1 * lw;
              col = lit + glow * breathe * uGlow;
            } else if (vK < 1.5) {
              float spec = pow(max(dot(reflect(-v, n), normalize(vec3(0.0, 0.5, -1.0))), 0.0), 12.0);
              col = vec3(0.34, 0.33, 0.35) * (uTopL * (0.7 + 0.5 * n.y) + uUnder * under) + uTopL * spec * 0.7
                  + cGold * 0.55 * smoothstep(1.13, 1.24, r) * uGlow * (0.4 + 0.6 * under);
            } else if (vK < 2.5) {
              vec2 gq = abs(fract(cuv) - 0.5);
              float line = smoothstep(0.44 - fwc, 0.49, max(gq.x, gq.y));
              col = mix(vec3(0.02, 0.028, 0.07), vec3(0.3, 0.3, 0.33), line) * (uTopL * 1.3 + uUnder * (under + 0.1))
                  + cViolet * 0.06 * pow(1.0 - abs(dot(n, v)), 3.0);
            } else if (vK < 3.5) {
              float pulse = smoothstep(0.9, 1.0, sin(vUv2.x * 9.0 - uTime * 3.0));
              col = vec3(0.5, 0.24, 0.12) * (uTopL * 1.2 + uUnder * (under + 0.05)) + cViolet * pulse * 0.45;
            } else if (vK < 4.5) {
              col = vec3(0.32) * (uTopL * 1.4 + uUnder * (0.35 + under));
            } else {
              col = mix(cGold, vec3(1.0, 0.9, 0.8), 0.3) * (1.5 + 0.4 * sin(uTime * 5.0 + vPr.x));
            }
            gl_FragColor = vec4(max(col, 0.0), 1.0);
          }`});const m=new e.Mesh(s,Oe);m.frustumCulled=!1,m.renderOrder=5,O.add(m),await u.yield();const v=y.fork("sparks"),d=Math.round(110*(.6+.4*q)),r=Math.round(170*q*Ae),p=[],f=[],h=[],b=new e.Vector3;for(let l=0;l<d;l++){const g=v.range(-82,82);b.copy(i(g,1.19,.02)).applyMatrix4(c);const x=v.range(.3,.75);p.push(b.x,b.y,b.z,x),f.push(Math.sin(g*G/180)*v.range(.2,1.3),v.range(.4,2.4)*(v.chance(.12)?1.8:1),v.range(5,11),v()),h.push(0,v.range(.003,.006),v.range(.016,.03),v())}for(let l=0;l<r;l++){const g=v.range(0,G*2),x=v.range(1.7,8),N=v.range(70,110);p.push(Math.cos(g)*x,Math.sin(g)*x*.8-.4,-44,46/N),f.push(0,0,N,v()),h.push(1,v.range(.004,.011),.0075,v())}const S=new e.InstancedBufferGeometry;S.setAttribute("position",new e.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),S.setIndex([0,1,2,0,2,3]),S.setAttribute("aS",new e.InstancedBufferAttribute(new Float32Array(p),4)),S.setAttribute("aV",new e.InstancedBufferAttribute(new Float32Array(f),4)),S.setAttribute("aC",new e.InstancedBufferAttribute(new Float32Array(h),4)),S.instanceCount=d+r;const T=new e.ShaderMaterial({uniforms:{uTime:P,uPx:ie,cGold:{value:R[0]},cRose:{value:R[3]}},transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:`
          attribute vec4 aS, aV, aC;
          uniform float uTime, uPx;
          varying vec4 vF; varying float vKs;
          void main() {
            float f = fract(uTime / aS.w + aV.w), tt = f * aS.w;
            vec3 p = aS.xyz + aV.xyz * tt;
            if (aC.x < 0.5) p += vec3(sign(aS.x) * 1.6, 1.0, 0.0) * tt * tt * 3.0;
            vec3 q = p - aV.xyz * aC.z;
            vec4 A = modelViewMatrix * vec4(p, 1.0), B = modelViewMatrix * vec4(q, 1.0);
            vec2 ax = A.xy / max(-A.z, 0.05) - B.xy / max(-B.z, 0.05);
            vec2 perp = normalize(vec2(-ax.y, ax.x) + vec2(1e-6, 0.0));
            vec4 P = mix(A, B, position.y);
            P.xy += perp * position.x * max(aC.y, 0.9 * uPx * max(-P.z, 0.1));
            vF = vec4(position.x, position.y, f, aC.w); vKs = aC.x + 0.4 * smoothstep(2.0, 7.0, -A.z);
            gl_Position = projectionMatrix * P;
          }`,fragmentShader:`
          uniform vec3 cGold, cRose;
          varying vec4 vF; varying float vKs;
          void main() {
            float x = vF.x, y = vF.y, f = vF.z;
            float shape = (1.0 - x * x) * (1.0 - y) * (1.0 - y);
            vec3 col;
            if (vKs < 0.5) col = mix(vec3(1.0, 0.8, 0.5), cRose, smoothstep(0.1, 0.8, f)) * 2.4 * smoothstep(0.0, 0.05, f) * (1.0 - f) * (1.0 - f);
            else col = mix(cRose, cGold, vF.w) * 2.2 * (vKs - 1.0) * smoothstep(0.0, 0.2, f) * (1.0 - smoothstep(0.9, 1.0, f));
            gl_FragColor = vec4(max(col * shape, 0.0), 1.0);
          }`}),C=new e.Mesh(S,T);C.frustumCulled=!1,C.renderOrder=6,O.add(C)}await u.yield();const ke=new e.Vector3(0,1040,U),ve=w.makeGlow({rng:y.fork("pstar"),position:[0,1040,U],color:"#E9E0FF",size:70,intensity:3.2,halo:1,spikes:4,flicker:0,minAngle:.014,fogAmount:0,time:P,renderOrder:6});ve.object.frustumCulled=!1,M.add(ve.object),await u.yield();const We=[{at:[0,430,U],from:.05,to:.46,weight:.5},{at:[-140,70,-2330],from:B-.13,to:B+.05,weight:.45},{at:ke,from:B+.03,to:1,weight:.6}],pe=new e.Vector3,he=new e.Vector3,xe=new e.Vector3,Je=new e.Quaternion,Qe=new e.Euler,$e=new e.Vector2,Ve=new e.Vector3(-1500,700,-2700),Ne=new e.Vector3(800,70,-3500),Xe=new e.Vector3().subVectors(Ve,Ne).normalize().multiplyScalar(1).add(new e.Vector3(0,.3,0)).normalize();re.uTail.value.copy(Xe);const Ye=new e.Color(1,.46,.03).multiplyScalar(L==="deep"?.45:1),Ze=new e.Color(.3,.085,.035),ge=new e.Color(.12,.11,.135),we=new e.Color(1,.3,.45),e0=A[0][2],t0=A[0][3];function o0(t,c,a,i){P.value=c;let o=720;u.renderer?.getDrawingBufferSize&&(o=Math.max(1,u.renderer.getDrawingBufferSize($e).y)),ie.value=2/(Math.max(.1,a.projectionMatrix.elements[5])*o);const n=a.position;ne.position.copy(n),pe.set(0,0,-1).applyQuaternion(a.quaternion),Le.uCen.value.set(n.x+pe.x*380,n.z+pe.z*380),ve.uniforms.uIntensity.value=3.2*z(700,1500,n.distanceTo(ke));const s=He(i);V.update(t,c,a),V.setProgress(s);const m=X.uniforms.uRib.value,v=z(.606,.62,s)*(1-.7*z(.72,.92,s));L==="after"?m.w=.75+.1*Math.sin(c*.9)+.35*v:(m.z=.08+.92*z(.608,.7,s),m.w=v);const d=Ce.uLift.value;d[0].set(.1+.9*z(.2,.7,i),1);for(let T=1;T<ze;T++){const C=(c/16+T/6)%1;d[T].set(z(0,.5,C),z(0,.08,C)*(1-z(.8,1,C)))}if(K){const T=(i-.15)/.3,C=T>0&&T<1;K.visible=C,C&&(re.uHead.value.lerpVectors(Ve,Ne,T),re.uFade.value=z(0,.1,T)*(1-z(.8,1,T))*(1-.25*z(.6,1,T)*(.5+.5*Math.sin(c*11))))}oe.tangentAt(i,he),oe.tangentAt(Math.min(1,i+.012),xe);const r=he.z*xe.x-he.x*xe.z,p=Math.max(-.035,Math.min(.035,r*.5));O.position.copy(n),O.quaternion.copy(a.quaternion).multiply(Je.setFromEuler(Qe.set(0,p,p*.7)));const f=1-z(e0*.85,t0*.95,Math.hypot(n.x-k.x,n.z-k.z)),h=1-z(150,1e3,Math.hypot(n.x,n.z+2450)),b=1/(1+Math.max(0,n.y-120)/700);le.uUnder.value.copy(Ye).lerp(Ze,f).multiplyScalar(b);const S=.04*f+.07*h;le.uTopL.value.setRGB(ge.r+we.r*S,ge.g+we.g*S,ge.b+we.b*S),le.uGlow.value=1-.3*f}return{scene:M,path:oe,duration:46,title:_.title,camera:{fov:64,near:.4,far:9500,lookAhead:60,sway:.6,bank:2.2},pois:We,portal:{shape:"circle",radius:10,color:"#E9E0FF",glow:1,tilt:!0,revealDistance:3200},post:{exposure:_.exposure,bloom:{strength:.25,radius:.6,threshold:1.1},grade:{saturation:1.06,contrast:1.05,tint:"#ffffff",shadowTint:"#000000",vignette:.28,grain:.018,aberration:0}},ride:"none",style:"none",update:o0,dispose(){V.dispose(),Be.forEach(t=>t.dispose())}}}};export{d0 as default};
