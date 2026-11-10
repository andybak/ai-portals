import*as e from"three";import{clamp as Se,lerp as be,smoothstep as Z}from"../kit/core.js";const Dt=["#E6DCC8","#F7F2E6","#7FA8B8","#8DAA5B","#D9A441","#8A5A3C","#C4283C"],oe=165,Be=110,He=120,rt=6.5,Ne=8,ne=Math.PI*2,Oe=`
  uniform vec4 uRip[${Ne}];   // x, z, seconds since the needle pierced here, strength
  float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y); }
  float ripple(vec2 p){
    float h = 0.;
    for (int i = 0; i < ${Ne}; i++) {
      vec4 r = uRip[i]; if (r.w <= 0.) continue;
      float d = length(p - r.xy), t = r.z, fr = d - 67. * t;
      h += r.w * (2.3 * exp(-fr * fr / 200.) * cos(fr * 0.22) * exp(-d / 120.) * smoothstep(0., .2, t)
                 - 4. * exp(-d * d / 70.) * (exp(-t * 2.4) + 0.14));
    }
    return h;
  }`,je=()=>e.UniformsUtils.clone(e.UniformsLib.fog);function _t(o,n,r){let M=0;for(let y=0;y<Ne;y++){const c=o[y];if(c.w<=0)continue;const s=Math.hypot(n-c.x,r-c.y),d=c.z,v=s-67*d;M+=c.w*(2.3*Math.exp(-v*v/200)*Math.cos(v*.22)*Math.exp(-s/120)*Z(0,.2,d)-4*Math.exp(-s*s/70)*(Math.exp(-d*2.4)+.14))}return M}function Xe(o,n=20){const r=[],M=[];for(const[c,s,d,v]of o)for(let f=0;f<n;f++){const u=f/n*ne;r.push(s+Math.cos(u)*d,c,Math.sin(u)*v)}for(let c=0;c<o.length-1;c++)for(let s=0;s<n;s++){const d=c*n+s,v=c*n+(s+1)%n,f=d+n,u=v+n;M.push(d,f,v,v,f,u)}const y=new e.BufferGeometry;return y.setAttribute("position",new e.Float32BufferAttribute(r,3)),y.setIndex(M),y.computeVertexNormals(),y}function xt(o){let n=0,r=0;for(const u of o)n+=u.attributes.position.count,r+=u.index.count;const M=new Float32Array(n*3),y=new Float32Array(n*3),c=new Float32Array(n*3),s=new Uint32Array(r);let d=0,v=0;for(const u of o){M.set(u.attributes.position.array,d*3),y.set(u.attributes.normal.array,d*3),u.attributes.color?c.set(u.attributes.color.array,d*3):c.fill(1,d*3,(d+u.attributes.position.count)*3);const P=u.index.array;for(let m=0;m<P.length;m++)s[v+m]=P[m]+d;d+=u.attributes.position.count,v+=P.length,u.dispose()}const f=new e.BufferGeometry;return f.setAttribute("position",new e.BufferAttribute(M,3)),f.setAttribute("normal",new e.BufferAttribute(y,3)),f.setAttribute("color",new e.BufferAttribute(c,3)),f.setIndex(new e.BufferAttribute(s,1)),f}function Pe(o,n,r=0,M=null){const y=o.attributes.position.count,c=new Float32Array(y*3);for(let s=0;s<y;s++){const d=1+(M?(M()-.5)*r:0);c[s*3]=n.r*d,c[s*3+1]=n.g*d,c[s*3+2]=n.b*d}return o.setAttribute("color",new e.BufferAttribute(c,3)),o}const se=.3,le=.66,We=.96;function Et(o,n){const r=He,M=-3,y=r+6,c=new e.Vector3,s=new e.Vector3,d=new e.Vector3,v=new e.Vector3,f=new e.Vector3,u=Math.cos(n),P=Math.sin(n),m=.4*y/se*(le-se),g=(F,ve)=>{let ee=0,X=1;for(let ae=0;ae<30;ae++){const q=(ee+X)/2;F(q)<ve?ee=q:X=q}return ee},S=F=>1.6*F-.6*F*F,k=F=>.4*F+.6*F*F,D=se*g(S,(r-rt-M)/y),b=le+(We-le)*g(k,(r-rt-M)/y);function j(F,ve,ee){const X=Math.floor(F),ae=F-X;if(o(X*oe,c),o(X*oe+Be,s),d.subVectors(s,c).setY(0).normalize(),ae<se)ee.copy(d).multiplyScalar(u).setY(P),ve.copy(c).addScaledVector(ee,M+y*S(ae/se));else if(ae<le){const q=(ae-se)/(le-se),ce=q*q,ze=ce*q,J=n*Math.cos(Math.PI*q),Te=2*ze-3*ce+1,z=ze-2*ce+q,$=-2*ze+3*ce,ke=ze-ce,ye=M+y-r/2;v.copy(c).addScaledVector(d,u*ye),v.y+=P*ye,f.copy(s).addScaledVector(d,-u*ye),f.y+=P*ye,ve.copy(v).multiplyScalar(Te).addScaledVector(f,$).addScaledVector(d,(z+ke)*m*u),ve.y+=(z-ke)*m*P,ee.copy(d).multiplyScalar(Math.cos(J)).setY(Math.sin(J)),ve.addScaledVector(ee,r/2)}else{const q=(ae-le)/(We-le);ee.copy(d).multiplyScalar(u).setY(-P),ve.copy(s).addScaledVector(ee,M+y*(q<1?k(q):1+(q-1)*.4))}return ae}return{pose:j,fEyeOut:D,fEyeIn:b,fEntry:le+(We-le)*g(k,-M/y),fExit:se*g(S,-M/y)}}const It=`
  uniform vec3 uKnot; uniform vec3 uSup[4]; uniform vec4 uFeed[8];
  float strandSh(vec2 p, vec3 a, vec3 b, float y, float w){
    float sy = max(uSunDir.y, 0.15);
    vec2 sa = a.xz - uSunDir.xz * max(a.y - y, 0.) / sy, sb = b.xz - uSunDir.xz * max(b.y - y, 0.) / sy, ab = sb - sa;
    float t = clamp(dot(p - sa, ab) / max(dot(ab, ab), 1e-3), 0., 1.), h = max(mix(a.y, b.y, t) - y, 0.), soft = w + h * 0.018;
    return (1. - smoothstep(soft * 0.35, soft * 1.5, length(p - (sa + ab * t)))) / (1. + h * 0.004);
  }
  float overheadShadow(vec2 p, float y){
    float s = 0.; vec3 b0 = uSup[0];
    for (int i = 1; i <= 5; i++) { float t = float(i) / 5., k = 1. - t;
      vec3 b1 = k * k * k * uSup[0] + 3. * k * k * t * uSup[1] + 3. * k * t * t * uSup[2] + t * t * t * uSup[3]; s = max(s, strandSh(p, b0, b1, y, 2.0)); b0 = b1; }
    for (int i = 0; i < 8; i++) { if (uFeed[i].w <= 0.) continue; s = max(s, strandSh(p, uFeed[i].xyz, uKnot, y, 1.3) * uFeed[i].w); }
    float hk = max(uKnot.y - y, 0.), kr = 5. + hk * 0.018;
    vec2 ks = uKnot.xz - uSunDir.xz * hk / max(uSunDir.y, 0.15);
    return max(s, (1. - smoothstep(kr * 0.5, kr * 1.6, length(p - ks))) / (1. + hk * 0.004));
  }`;function Yt(o,n){return new e.ShaderMaterial({fog:!0,uniforms:{...je(),uRip:o.uRip,uTime:o.uTime,uSunDir:o.uSunDir,uSun:o.uSun,uAmb:o.uAmb,uShade:o.uShade,uLinen:o.uLinen,uPencil:o.uPencil,uCrimson:o.uCrimson,uPal:o.uPal,uSeed:o.uSeed,uSeedB:o.uSeedB,uNe0:o.uNe0,uNe1:o.uNe1,uRowW:o.uRowW,uSt:o.uSt,uStW:o.uStW,uKnot:o.uKnot,uSup:o.uSup,uFeed:o.uFeed},vertexShader:`
      ${Oe}
      attribute float aField;
      varying vec3 vW; varying vec3 vN; varying float vField; varying float vRip;
      #include <fog_pars_vertex>
      void main(){
        vec4 w = modelMatrix * vec4(position, 1.);
        float h = ripple(w.xz), e = 3.;
        float hx = ripple(w.xz + vec2(e, 0.)), hz = ripple(w.xz + vec2(0., e));
        w.y += h; vRip = h;
        vN = normalize(normalize(mat3(modelMatrix) * normal) + vec3(h - hx, 0., h - hz) / e);
        vW = w.xyz; vField = aField;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #define NF ${n}
      ${Oe}
      uniform float uTime, uRowW, uFade;
      uniform vec3 uSunDir, uSun, uAmb, uShade, uLinen, uPencil, uCrimson, uNe0, uNe1;
      uniform vec3 uPal[6]; uniform vec4 uSeed[NF]; uniform vec4 uSeedB[NF]; uniform vec4 uSt[6]; uniform float uStW[6];
      varying vec3 vW; varying vec3 vN; varying float vField; varying float vRip;
      #include <fog_pars_fragment>
      ${It}
      float segShadow(vec2 p){                    // soft shadow of the needle on the cloth
        vec3 a = uNe0, b = uNe1; if (a.y < 0. && b.y < 0.) return 0.;
        vec2 sa = a.xz - uSunDir.xz * (a.y - vW.y) / uSunDir.y, sb = b.xz - uSunDir.xz * (b.y - vW.y) / uSunDir.y;
        vec2 ab = sb - sa; float t = clamp(dot(p - sa, ab) / max(dot(ab, ab), 1e-3), 0., 1.);
        float hgt = mix(a.y, b.y, t) - vW.y; if (hgt < 0.) return 0.;
        float soft = 1.2 + hgt * 0.07, d = length(p - (sa + ab * t));
        return (1. - smoothstep(1.4 - soft * .3, 1.4 + soft, d)) * (1. / (1. + hgt * 0.018));
      }
      void main(){
        vec2 p = vW.xz; vec3 N = normalize(vN);
        vec3 V = normalize(cameraPosition - vW);
        // ---- linen: over-under weave near, slubby streaks far
        vec2 uv = p / 0.3; vec2 fw = fwidth(uv); float wf = 1. - smoothstep(0.2, 0.7, max(fw.x, fw.y));
        float chk = mod(floor(uv.x) + floor(uv.y), 2.);
        float warpT = abs(sin(3.14159 * uv.x)), weftT = abs(sin(3.14159 * uv.y));
        float weave = mix(warpT * (0.75 + 0.25 * weftT), weftT * (0.75 + 0.25 * warpT), chk);
        float slub = vnoise(vec2(p.x * 0.9, p.y * 0.035)) * 0.5 + vnoise(vec2(p.x * 0.03, p.y * 1.1)) * 0.5;
        float mott = vnoise(p * 0.021) * 0.6 + vnoise(p * 0.11) * 0.4;
        vec3 alb = uLinen * (0.9 + 0.1 * slub) * (0.93 + 0.1 * mott);
        alb *= mix(1., 0.7 + 0.42 * weave, wf);
        N = normalize(N + vec3(vnoise(p * 0.06) - .5, 0., vnoise(p * 0.06 + 31.7) - .5) * 0.22);
        // ---- pencil ghost of the unpicked design + empty needle holes
        vec2 gp = p / 62.; vec2 gi = floor(gp), gf = fract(gp); float d1 = 9., d2 = 9.;
        for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 o = vec2(float(x), float(y));
          vec2 c = o + vec2(hash21(gi + o), hash21(gi + o + 17.3)) * 0.8 + 0.1; float d = length(c - gf);
          if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
        float edge = (d2 - d1) * 62.;
        float dash = step(0.35, fract((p.x + p.y) * 0.11));
        float pencil = (1. - smoothstep(0.35, 1.1, edge)) * dash * 0.5 * (1. - vField);
        vec2 hp = p / 2.2; vec2 hc = fract(hp) - .5; float holeRow = step(0.8, vnoise(floor(hp.yy * 0.25 + gi * 7.) + 3.));
        float hole = (1. - smoothstep(0.08, 0.2, length(hc))) * step(0.5, hash21(floor(hp) + gi)) * (1. - smoothstep(0.03, 0.12, max(fwidth(hp.x), fwidth(hp.y))));
        float spec = 0.; vec3 specCol = vec3(1.);
        // ---- satin fields on the mounds, unravelled row by row
        if (vField > 0.5) {
          float b1 = 1e9, b2 = 1e9; vec4 sd = uSeed[0], sb = uSeedB[0];
          for (int i = 0; i < NF; i++) { float d = distance(p, uSeed[i].xy) / max(uSeedB[i].z, 0.01); if (d < b1) { b2 = b1; b1 = d; sd = uSeed[i]; sb = uSeedB[i]; } else if (d < b2) b2 = d; }
          float fe = (b2 - b1) * 0.5;                                   // metres-ish to the field border
          vec2 dir = vec2(cos(sd.z), sin(sd.z)), prp = vec2(-dir.y, dir.x), q = p - sd.xy;
          float u = dot(q, dir), v = dot(q, prp), Rf = sb.x, rows = floor(2. * Rf / uRowW);
          float ri = clamp(floor((Rf - v) / uRowW), 0., rows - 1.);
          float cur = sb.y * rows, uu = clamp(u / (2. * Rf) + .5, 0., 1.); if (mod(ri, 2.) > .5) uu = 1. - uu;
          float st = (sb.y <= 0.) ? 1. : ((ri > floor(cur)) ? 1. : ((ri == floor(cur)) ? step(fract(cur), uu) : 0.));
          float lifting = (ri == floor(cur) && sb.y > 0.) ? (1. - smoothstep(0., 0.12, uu - fract(cur))) * st : 0.;
          // linen under the field: dotted needle holes along each row, blue pencil outline
          float rv = fract((Rf - v) / uRowW), ru = fract(u / 1.1);
          float fwv = fwidth(v / uRowW);
          float dots = (1. - smoothstep(0.05, 0.16, length(vec2(rv - .5, (ru - .5) * 0.5)))) * (1. - smoothstep(0.1, 0.4, fwv));
          vec3 bare = alb * vec3(0.95, 0.91, 0.86) * (1. - 0.5 * dots) * (0.88 + 0.12 * smoothstep(0.08, 0.2, abs(rv - .5)) * (1. - smoothstep(0.25, 0.8, fwv)) + 0.12 * smoothstep(0.25, 0.8, fwv));
          bare = mix(bare, uPencil, (1. - smoothstep(0.5, 1.6, fe)) * 0.75);
          { // what a pulled-out field leaves on the hill: the ghost of its dye in the cloth, soft gathers where the cloth has lost
            // its stitches, and the tacking that still holds it to its form: a running stitch of the field's thread round every 5 m of height
            vec3 dye = uPal[int(sd.w)]; float qa = atan(q.y, q.x + 1e-5), ql = max(length(q), 6.);
            bare = mix(bare, bare * (0.5 + 0.95 * dye), 0.34);
            bare *= 0.93 + 0.07 * sin(qa * 9. + vnoise(p * 0.07) * 5.);
            float cb = vW.y / 5., cf = fwidth(cb) + 1e-4;
            float tack = (1. - smoothstep(0.03, 0.03 + cf * 1.5, abs(fract(cb) - .5))) * step(0.42, fract(qa * ql / 3.4)) * (1. - smoothstep(0.2, 0.5, cf));
            bare = mix(bare, mix(dye, uCrimson, 0.45) * 0.72, tack * 0.85);
          }
          // satin: one colour per field, each row a slightly different dye lot, floss stripes along the stitch
          float wave = sin(dot(p, vec2(0.05, 0.031)) - uTime * 0.9) * 0.5 + 0.5;       // sheen wave, like wind over a crop
          vec3 fc = uPal[int(sd.w)]; float rh = hash21(vec2(ri, sd.w * 7.1 + sd.x));
          fc *= 0.8 + 0.34 * rh; fc *= 0.9 + 0.2 * wave;
          float rowB = 0.5 + 0.5 * cos(6.2832 * rv); float rf = 1. - smoothstep(0.15, 0.6, fwv);
          fc *= mix(1., 0.72 + 0.36 * rowB, rf);
          fc *= 0.94 + 0.06 * vnoise(vec2(u * 0.5, v * 6.));
          vec3 T = normalize(vec3(dir.x, 0., dir.y) + N * 0.0); T = normalize(T - N * dot(T, N));
          vec3 Hh = normalize(uSunDir + V); float th = dot(normalize(T + N * (wave - .5) * 0.5), Hh);
          float kk = pow(sqrt(max(1. - th * th, 0.)), 70.);
          float hedge = (1. - smoothstep(1.0, 2.4, fe + sin(u * 2.2) * 0.5));
          vec3 hedgeCol = uPal[1] * vec3(0.32, 0.5, 0.3);
          vec3 sat = mix(fc, hedgeCol, hedge * 0.85);
          sat = mix(sat, sat * 1.25 + 0.05, lifting);
          alb = mix(bare, sat, st);
          spec = st * (1. - hedge) * kk * (0.1 + 0.3 * wave); specCol = mix(vec3(1.), fc, 0.7) * 1.2;
          N = normalize(N + vec3(prp.x, 0., prp.y) * (rv - .5) * 0.5 * rf * st);
          hole = 0.; pencil = 0.;
        }
        alb = mix(alb, uPencil, pencil); alb *= 1. - 0.5 * hole;
        // ---- light: broad soft window key, lavender shade, pucker shading where the needle has pierced
        float nl = dot(N, uSunDir); float dif = smoothstep(-0.35, 0.95, nl);
        float sh = segShadow(p) * 0.6;
        float puck = clamp(-vRip * 0.16, 0., 0.5);
        float st2 = 0.;
        for (int i = 0; i < 6; i++) { vec4 sg = uSt[i]; if (uStW[i] <= 0.) continue; vec2 ab = sg.zw - sg.xy, pq = p + uSunDir.xz * 0.9 - sg.xy;
          float t = clamp(dot(pq, ab) / max(dot(ab, ab), 1e-3), 0., 1.); st2 = max(st2, (1. - smoothstep(0.4, 3.2, length(pq - ab * t))) * uStW[i]); }
        sh = max(sh, st2 * 0.5 * (1. - vField));
        sh = max(sh, overheadShadow(p, vW.y) * 0.8);
        vec3 light = uShade * (0.5 + 0.2 * N.y) + uSun * dif * (1. - sh);
        light = mix(light, uShade * 0.45, puck);
        float fres = pow(1. - max(dot(N, V), 0.), 3.);
        vec3 col = alb * light + alb * fres * 0.12 * uSun + specCol * spec * uSun * (1. - sh);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function Gt(o){const n=(v,f)=>{const u=[];for(let P=0;P<=v;P++)u.push(f(P/v));return u},y=He,c=1.6,s=[];s.push(Xe(n(10,v=>{const f=-.1+v*3.1,u=Math.sqrt(Math.max(1e-4,1-Math.pow(Math.abs(v*2-1),2.6)));return[f,0,2.05*u,1.12*u]}),24));for(const v of[-1,1])s.push(Xe(n(18,f=>{const u=be(1.1,12.6,f),P=Math.pow(Math.sin(Math.PI*Se((u-2+1.2)/(11.4-2+2.4),0,1)),.55);return[u,v*(.5+.98*P),.62-.1*P,1.1+.05*P]}),14));s.push(Xe(n(64,v=>{const f=v<.25?be(10.200000000000001,22,v/.25):be(22,y,Math.pow((v-.25)/.75,.85)),u=Z(11.4-1.25,11.4+.6,f),P=1-Z(11.4,19,f),m=Z(y-40,y,f),g=Math.sqrt(Math.max(0,1-Math.pow(m,1.7)))*(1-.25*m),S=(c-.22*Z(20,80,f))*Math.max(g,.004);return[f,0,S*(1+.28*P)*(.25+.75*u),S*(1-.3*P)*(.25+.75*u)]}),24));const d=xt(s);return d.deleteAttribute("color"),d}function Kt(o){return new e.ShaderMaterial({fog:!0,uniforms:{...je(),uSunDir:o.uSunDir,uLinen:o.uLinen,uPal:o.uPal,uCrimson:o.uCrimson,uFlash:o.uFlash,uButton:o.uButton,uCut:o.uCut,uWide:o.uWide,uRim:o.uRim},vertexShader:`
      uniform float uWide;
      varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec3 vLN; varying vec3 vAx;
      #include <fog_pars_vertex>
      void main(){
        vL = position; vLN = normal;
        vec3 lp = position;
        vAx = normalize(mat3(modelMatrix) * vec3(0., 1., 0.));
        if (position.y > -100.) {                                      // the needle (not the safety pin that shares this steel): never a hairline
          vec4 c0 = modelMatrix * vec4(0., position.y, 0., 1.);
          lp.xz *= max(1., distance(cameraPosition, c0.xyz) * uWide);
        }
        vec4 w = modelMatrix * vec4(lp, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uLinen, uCrimson, uButton; uniform vec3 uPal[6]; uniform float uFlash, uCut, uRim;
      varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec3 vLN; varying vec3 vAx;
      #include <fog_pars_fragment>
      float h1(float x){ return fract(sin(x * 127.1) * 43758.5453); }
      float n1(float x){ float i = floor(x), f = fract(x); f = f * f * (3. - 2. * f); return mix(h1(i), h1(i + 1.), f); }
      // the tiny world the chrome mirrors: bright linen sky with a pearl-button sun, a patchwork ground, a crimson line
      vec3 env(vec3 r){
        float su = dot(r, uSunDir);
        // sky: bright only high up and toward the window, falling to a dark band at the horizon (mirror banding)
        vec3 sky = uLinen * mix(0.12, 0.86, smoothstep(0.16, 0.9, r.y * 0.6 + su * 0.5));
        sky *= mix(0.24, 1., smoothstep(-0.3, 0.2, sin(atan(r.z, r.x + 1e-5) * 2. + 0.6)));           // the window's dark piers: light and dark bands down the barrel whichever way it leans
        sky += uButton * (smoothstep(0.972, 0.99, su) * 3.2 + pow(max(su, 0.), 900.) * 26.);
        float az = atan(r.z, r.x + 1e-5), band = floor(az * 2.2 + n1(r.y * 3.) * 1.2);
        vec3 patchC = uPal[int(mod(band, 5.))];
        vec3 gnd = mix(patchC * 0.2, uLinen * 0.12, smoothstep(-0.05, -0.9, r.y));
        gnd = mix(gnd, patchC * 0.75, (1. - smoothstep(0.03, 0.1, abs(r.y + 0.34 + 0.05 * sin(az * 3.)))) * 0.8);          // a streak of field colour
        gnd = mix(gnd, uCrimson * 1.05, (1. - smoothstep(0.04, 0.11, abs(r.y + 0.16 + 0.04 * sin(az * 2. + 1.)))) * 0.9);  // and of the crimson road
        vec3 e = mix(gnd, sky, smoothstep(-0.03, 0.03, r.y + 0.02 * sin(az * 9.)));
        return mix(e, vec3(0.05, 0.05, 0.08), 0.86 * exp(-r.y * r.y * 16.));
      }
      void main(){
        if (vW.y < uCut) discard;
        vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
        // lengthwise polishing lines and the long thread groove under the eye
        float ang = atan(vLN.z, vLN.x);
        float brush = n1(ang * 40.) * 0.5 + n1(ang * 140. + vL.y * 0.05) * 0.5;
        float groove = (1. - smoothstep(0.25, 0.5, abs(vL.x))) * smoothstep(11.5, 13.5, vL.y) * (1. - smoothstep(26., 34., vL.y)) * step(0.5, abs(vLN.z));
        N = normalize(N + (brush - .5) * 0.05 * normalize(cross(N, vec3(0., 1., 0.) + 1e-3)) - N * groove * 0.25);
        vec3 R = reflect(-V, N);
        float fres = pow(1. - max(dot(N, V), 0.), 4.);
        vec3 col = env(R) * mix(vec3(0.6, 0.67, 0.82), vec3(1.), fres);
        // studio banding round the barrel: a dark core stripe beside the highlight, so it reads as a mirror at any distance
        float fc = max(dot(N, V), 0.);
        float prof = mix(0.2, 1., smoothstep(0.52, 0.86, fc));                        // dark flanks either side of a bright core
        col *= mix(prof, uRim, 1. - smoothstep(0.04, 0.24, fc));                      // and a thin rim at the very edge (lighter by default; dark draws the needle's outline on a pale sky)
        col *= 1. - 0.35 * groove;
        col *= 0.96 + 0.04 * n1(vL.y * 1.7 + ang * 3.);
        // lines of light running the length of the barrel: work across the axis so they never slide off the end
        vec3 ax = normalize(vAx);
        vec3 sP = uSunDir - ax * dot(uSunDir, ax); sP = normalize(sP + ax * 1e-4);
        vec3 vP = V - ax * dot(V, ax); vP = normalize(vP + sP * 1e-3);
        vec3 hP = normalize(sP + vP + ax * 1e-4);
        float air = smoothstep(-0.12, 0.1, uFlash) * (1. - smoothstep(0.9, 1.12, uFlash));
        float isNeedle = step(-100., vL.y);
        float lit = smoothstep(0.45, 0.95, dot(N, hP));
        float fy = (vL.y - uFlash * 150. + 15.) / 9.;
        col += uButton * lit * exp(-fy * fy) * 5.5;                                   // the button sun flashing down the needle during the hang
        float hl = pow(max(dot(N, hP), 0.), 40.);                                     // standing highlight toward the viewer
        float gl = pow(max(dot(N, sP), 0.), 26.);                                     // sun glint on the lit flank, whoever is looking
        col += uButton * (hl * (1.7 + 2.6 * air * isNeedle) + gl * (0.7 + 3.2 * air) * isNeedle + fres * 0.3);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}const it=56,Me=7;function qt(o){const n=[],r=[];for(let c=0;c<=it;c++)for(let s=0;s<Me;s++)n.push(c/it,s/Me*ne,0);for(let c=0;c<it;c++)for(let s=0;s<Me;s++){const d=c*Me+s,v=c*Me+(s+1)%Me,f=d+Me,u=v+Me;r.push(d,v,f,v,u,f)}const M=new e.InstancedBufferGeometry;M.setAttribute("position",new e.Float32BufferAttribute(n,3)),M.setIndex(r);const y=c=>{const s=new e.InstancedBufferAttribute(new Float32Array(o*c),c);return s.setUsage(e.DynamicDrawUsage),s};for(const[c,s]of[["iP0",3],["iP1",3],["iP2",3],["iP3",3],["iA",4],["iB",4],["iC0",3]])M.setAttribute(c,y(s));return M.instanceCount=o,M.boundingSphere=new e.Sphere(new e.Vector3,1e5),M}function Ht(o){return new e.ShaderMaterial({fog:!0,uniforms:{...je(),uRip:o.uRip,uTime:o.uTime,uS:o.uS,uSunDir:o.uSunDir,uSun:o.uSun,uAmb:o.uAmb,uCrimson:o.uCrimson,uTwist:o.uTwist},vertexShader:`
      ${Oe}
      attribute vec3 iP0, iP1, iP2, iP3, iC0; attribute vec4 iA, iB;   // iA: radius, slack wiggle, crimp, whip   iB: length, ramp end (t), ride, phase
      uniform float uTime, uS; uniform vec3 uCrimson;
      varying vec3 vW; varying vec3 vN; varying vec3 vT; varying vec3 vCol; varying vec2 vUV; varying float vLen, vPly;
      #include <fog_pars_vertex>
      vec3 curve(float t){
        float k = 1. - t; vec3 c = k * k * k * iP0 + 3. * k * k * t * iP1 + 3. * k * t * t * iP2 + t * t * t * iP3;
        vec3 ch = iP3 - iP0; vec3 sd = normalize(vec3(-ch.z, 0., ch.x) + vec3(1e-4, 0., 0.));
        float env = sin(3.14159 * t);
        c += sd * sin(t * 31.4 + iB.w) * iA.y * env + vec3(0., 1., 0.) * abs(sin(t * 18.8 + iB.w * 1.7)) * iA.y * 0.6 * env;   // slack loops
        c.y += sin(t * iB.x * 1.9) * iA.z * (1. - t) * smoothstep(0., .04, t);                                               // crimp from the old stitches
        c += (sd * sin(t * 11. - uS * 6.2832 * 2.) + vec3(0., 1., 0.) * cos(t * 8. - uS * 6.2832 * 2.)) * iA.w * env;         // whip wave from the leap
        c.y += ripple(c.xz) * iB.z * (1. - smoothstep(1., 9., c.y));
        return c;
      }
      void main(){
        float t = position.x, a = position.y;
        vec3 c = curve(t), tg = normalize(curve(t + 0.012) - curve(t - 0.012));
        vec3 sd = normalize(cross(tg, vec3(0., 1., 0.)) + vec3(1e-3, 0., 1e-3)); vec3 up = cross(sd, tg);
        vec4 wc = modelMatrix * vec4(c, 1.);
        float r = max(iA.x, distance(cameraPosition, wc.xyz) * 0.0023) * step(1e-4, iA.x);
        vec3 n = cos(a) * sd + sin(a) * up;
        vec4 w = modelMatrix * vec4(c + n * r, 1.);
        vW = w.xyz; vN = normalize(mat3(modelMatrix) * n); vT = normalize(mat3(modelMatrix) * tg);
        vUV = vec2(t, a); vLen = iB.x / max(r, 0.05) * (iB.w < 0. ? 2.2 : 1.); vPly = iB.w < 0. ? 1. : 0.;
        vCol = mix(iC0, uCrimson, smoothstep(iB.y * 0.6, iB.y * 1.6 + 1e-3, t));
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uSun, uAmb, uCrimson; uniform float uTwist;
      varying vec3 vW; varying vec3 vN; varying vec3 vT; varying vec3 vCol; varying vec2 vUV; varying float vLen, vPly;
      #include <fog_pars_fragment>
      void main(){
        vec3 N = normalize(vN), T = normalize(vT), V = normalize(cameraPosition - vW);
        // three-ply twist: grooves spiral round the strand, fading to plain sheen when they get too fine
        float tw = vUV.x * vLen * 0.11 * uTwist + vUV.y * 3. / 6.2832;
        float fwv = fwidth(vUV.x * vLen * 0.11 * uTwist); float tf = 1. - smoothstep(0.15, 0.5, fwv);
        float ply = abs(sin(3.14159 * tw));
        vec3 alb = vCol * mix(1., mix(0.5, 0.26, vPly) + mix(0.62, 0.9, vPly) * ply, tf);
        N = normalize(N + T * (ply - 0.5) * 0.5 * tf * vPly);                 // each ply is a round of its own
        alb *= 0.9 + 0.2 * fract(sin(floor(tw) * 91.7) * 43758.5);
        float dif = mix(smoothstep(-0.5, 0.9, dot(N, uSunDir)), smoothstep(-0.15, 0.9, dot(N, uSunDir)) * (0.55 + 0.45 * N.y), vPly);
        vec3 Hh = normalize(uSunDir + V); float th = dot(T, Hh);
        float kk = pow(sqrt(max(1. - th * th, 0.)), 34.) * smoothstep(-0.2, 0.5, dot(N, Hh));
        float rim = pow(1. - max(dot(N, V), 0.), 2.2);                       // fibre fuzz
        vec3 col = alb * (uAmb * 1.1 + uSun * dif) + (alb * 0.9 + 0.12) * rim * 0.42 * uSun + mix(vec3(1.), alb, 0.5) * kk * 0.55 * uSun;
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function Ot(o,n){return new e.ShaderMaterial({fog:!0,uniforms:{...je(),uRip:o.uRip,uTime:o.uTime,uSunDir:o.uSunDir,uSun:o.uSun,uAmb:o.uAmb,uSeedB:o.uSeedB},vertexShader:`
      #define NF ${n}
      ${Oe}
      attribute vec4 iK;        // field index, row threshold 0..1, wobble phase, stem height
      attribute vec3 iCol;
      uniform float uTime; uniform vec4 uSeedB[NF];
      varying vec3 vN; varying vec3 vCol; varying vec3 vW; varying float vAO;
      #include <fog_pars_vertex>
      void main(){
        float prog = uSeedB[int(iK.x)].y;
        float gone = smoothstep(iK.y - 0.03, iK.y + 0.005, prog) * step(1e-4, prog);
        float pop = (1. - gone) * (1. + 2.2 * gone * (1. - gone) * 1.6);          // swell, then nothing
        vec4 o = instanceMatrix * vec4(0., 0., 0., 1.);
        vec3 lp = mat3(instanceMatrix) * position * pop;
        float wob = sin(uTime * 1.7 + iK.z) * 0.08 * iK.w;                         // pom-poms wobble on their stems
        vec4 w = modelMatrix * vec4(o.xyz + lp + vec3(wob, iK.w * (pop > 0.01 ? 1. : 0.) + gone * 6., wob * 0.6), 1.);
        w.y += ripple(w.xz);
        vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal); vCol = iCol; vW = w.xyz; vAO = 0.62 + 0.38 * smoothstep(-0.6, 0.7, position.y);
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uSun, uAmb;
      varying vec3 vN; varying vec3 vCol; varying vec3 vW; varying float vAO;
      #include <fog_pars_fragment>
      void main(){
        vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
        float dif = smoothstep(-0.4, 0.9, dot(N, uSunDir)), rim = pow(1. - max(dot(N, V), 0.), 2.);
        float fib = 0.9 + 0.1 * sin(vW.y * 9. + vW.x * 7.);
        vec3 col = vCol * fib * vAO * (uAmb * 1.1 + uSun * dif) + vCol * rim * 0.35 * uSun;
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}async function jt(o,n,r,M){const y=[],c=n.wood,s=n.brass,d=(m,g,S,k)=>{const D=[],b=[[m+k,-S],[g-k,-S],[g,-S+k],[g,S-k],[g-k,S],[m+k,S],[m,S-k],[m,-S+k],[m+k,-S]];for(const j of b)D.push(new e.Vector2(j[0],j[1]));return D},v=(m,g)=>{const S=m.attributes.position.count,k=new Float32Array(S*3),D=m.attributes.position;for(let b=0;b<S;b++){const j=Math.atan2(D.getY(b),D.getX(b)),F=.86+.14*Math.sin(j*37+Math.sin(j*5)*3)+.08*Math.sin(j*131+D.getZ(b)*4);k[b*3]=g.r*F,k[b*3+1]=g.g*F*F,k[b*3+2]=g.b*F*F}return m.setAttribute("color",new e.BufferAttribute(k,3)),m},f=new e.LatheGeometry(d(7,7.85,.95,.16),96).rotateX(Math.PI/2),u=new e.LatheGeometry(d(7.95,8.9,.75,.16),96,Math.PI+.07,ne-.14).rotateX(Math.PI/2);y.push(v(f,c.clone().multiplyScalar(1.18)),v(u,c.clone().multiplyScalar(.82))),await M();const P=new e.LatheGeometry([new e.Vector2(7.9,-.2),new e.Vector2(8.7,-.8),new e.Vector2(9.3,-1),new e.Vector2(9.9,-.9)],96).rotateX(Math.PI/2);{const m=P.attributes.position;for(let g=0;g<m.count;g++){const S=m.getX(g),k=m.getY(g),D=Math.hypot(S,k),b=Math.atan2(k,S),j=Z(8.6,9.9,D);m.setZ(g,m.getZ(g)+Math.sin(b*23+Math.sin(b*3)*2)*.25*j);const F=D+Math.sin(b*11)*.22*j;m.setXY(g,Math.cos(b)*F,Math.sin(b)*F)}P.computeVertexNormals(),y.push(Pe(P,n.cream.clone().multiply(new e.Color(.6,.57,.64)),.06,o))}await M();{const m=[],g=s.clone().multiplyScalar(2.6);for(const S of[-1,1])m.push(Pe(new e.BoxGeometry(.7,2,1.3).translate(S*.8,9.3,0),g,.08,o));m.push(Pe(new e.CylinderGeometry(.3,.3,5.4,10).rotateZ(Math.PI/2).translate(.4,9.7,0),g.clone().multiplyScalar(.8))),m.push(Pe(new e.CylinderGeometry(.8,.8,.7,8).rotateZ(Math.PI/2).translate(-1.7,9.7,0),g)),m.push(Pe(new e.CylinderGeometry(1.1,.9,.55,12).rotateZ(Math.PI/2).translate(3,9.7,0),g)),m.push(Pe(new e.BoxGeometry(.45,2.9,.75).translate(3.45,9.7,0),g.clone().multiplyScalar(1.15))),y.push(...m)}if(r>.3)for(const m of[-1,1])for(const g of[-1,1]){const S=new e.Vector3(m*4.9,-6.6,g*.2),k=new e.Vector3(m*6.4,-8.3-r-1.5,g*3.2),D=S.distanceTo(k),b=Xe([[0,0,.3,.3],[.3,0,.42,.42],[D*.2,0,.36,.36],[D*.25,0,.5,.5],[D*.3,0,.38,.38],[D*.85,0,.5,.5],[D*.9,0,.68,.68],[D,0,.6,.6]],10);b.applyQuaternion(new e.Quaternion().setFromUnitVectors(new e.Vector3(0,1,0),k.clone().sub(S).normalize())).translate(S.x,S.y,S.z),y.push(Pe(b,c.clone().multiplyScalar(.9),.1,o))}return await M(),xt(y)}async function Qt(o,n={}){const r=o.rng.fork?o.rng.fork("stitched-hero"):o.rng,y=(n.palette&&n.palette.length>=7?n.palette:Dt).map(t=>new e.Color(t)),[c,s,d,v,f,u,P]=y,m=r.range(-.025,.025),g=[v.clone(),f.clone(),d.clone(),v.clone().multiplyScalar(n.darkField??.8),v.clone().lerp(f,.45),f.clone().lerp(u,.45).lerp(P,r.range(.05,.2))];for(const t of g)t.offsetHSL(m,.04,-.02);r.shuffle(g);const S=n.period??3,k=e.MathUtils.degToRad(n.angle??r.range(49,55)),D=new e.Vector3(...n.lightDir||[-.6,.7,.4]).normalize(),b=!n.road,j=4*oe/ne,F=b&&r.chance(.5)?-1:1,ve=Be-7,ee=r.range(-.45,.45)-F*ve/j,X=b?(t,l)=>{const i=ee+F*t/j;return l.set(Math.sin(i)*j,0,Math.cos(i)*j)}:n.road,ae=b?4:1/0,q=b?4:Math.max(1,Math.floor((n.roadLength??1400)/oe)),ce=b?0:n.hoopStitch??q-1,ze=n.keep??(b?2.75:1/0),J=Et(X,k),Te=n.startPhase??r.range(0,4),z={uRip:{value:Array.from({length:Ne},()=>new e.Vector4(0,0,0,0))},uTime:{value:0},uS:{value:0},uSunDir:{value:D},uSun:{value:new e.Color(1,.94,.84).multiplyScalar(.62)},uAmb:{value:new e.Color(.5,.49,.5)},uShade:{value:new e.Color(.66,.62,.72)},uLinen:{value:c.clone()},uPencil:{value:d.clone().multiplyScalar(.9)},uCrimson:{value:P.clone()},uPal:{value:g},uSeed:{value:[]},uSeedB:{value:[]},uNe0:{value:new e.Vector3(0,-10,0)},uNe1:{value:new e.Vector3(0,-10,0)},uKnot:{value:new e.Vector3(0,-1e3,0)},uSup:{value:Array.from({length:4},()=>new e.Vector3(0,-1e3,0))},uFeed:{value:Array.from({length:8},()=>new e.Vector4)},uRowW:{value:2.2},uSt:{value:Array.from({length:6},()=>new e.Vector4)},uStW:{value:[0,0,0,0,0,0]},uFlash:{value:-1},uButton:{value:new e.Color(1,.93,.86)},uCut:{value:n.needleCutY??-1e5},uTwist:{value:r.range(.85,1.25)},uWide:{value:n.needleWiden??.0062},uRim:{value:n.needleRim??.62}},$=n.mounds??[{x:0,z:0,r:78,h:r.range(28,38)}],ke=$.length?$.length===1?r.int(6,8):Math.max(3,Math.floor(12/$.length)):0,ye=Math.max(1,$.length*ke),_=[];for(const t of $){const l=r.range(0,ne);for(let i=0;i<ke;i++){const h=i===0,w=l+i/(ke-1)*ne+r.range(-.25,.25),R=h?t.r*r.range(0,.12):t.r*r.range(.56,.68);_.push({x:t.x+Math.cos(w)*R,z:t.z+Math.sin(w)*R,ang:r.range(0,Math.PI),col:(_.length+(h?3:0))%6,Rf:t.r*(h?.3:.34),order:0,prog:0,m:t})}}if(r.shuffle(_.map((t,l)=>l)).forEach((t,l)=>{_[t].order=l/Math.max(1,_.length)}),n.fieldOrder)for(const t of _)t.order=Se(n.fieldOrder(t.x,t.z),-.5,1);for(;_.length<ye;)_.push({x:1e6,z:1e6,ang:0,col:0,Rf:1,order:0,prog:0,m:null});z.uSeed.value=_.map(t=>new e.Vector4(t.x,t.z,t.ang,t.col)),z.uSeedB.value=_.map(t=>new e.Vector4(t.Rf,0,1,0));const ue=(t,l)=>{let i=0;for(const h of $){const w=Math.hypot(t-h.x,l-h.z)/h.r;if(w<1){const R=Math.pow(1-w*w,1.35);i+=h.h*R*(1+.16*o.noise.fbm2(t*.02+7,l*.02,3))+.4*Z(1,.9,w)}}return i},St=(t,l)=>{let i=0,h=1e9;for(let w=0;w<_.length;w++){const R=Math.hypot(t-_[w].x,l-_[w].z);R<h&&(h=R,i=w)}return i},me=new e.Group;me.name="stitched-country-hero",await o.yield();const st=Yt(z,ye),bt=n.clothRadius??420;if(n.cloth!==!1){const i=[],h=[];for(let C=0;C<=70;C++){const Y=bt*Math.pow(C/70,1.55);for(let W=0;W<144;W++){const B=W/144*ne;i.push(Math.cos(B)*Y,0,Math.sin(B)*Y)}}for(let C=0;C<70;C++)for(let Y=0;Y<144;Y++){const W=C*144+Y,B=C*144+(Y+1)%144,G=W+144,a=B+144;h.push(W,B,G,B,a,G)}const w=new e.BufferGeometry;w.setAttribute("position",new e.Float32BufferAttribute(i,3));const R=new Float32Array(i.length);for(let C=1;C<R.length;C+=3)R[C]=1;w.setAttribute("normal",new e.BufferAttribute(R,3)),w.setAttribute("aField",new e.BufferAttribute(new Float32Array(i.length/3),1)),w.setIndex(h);const T=new e.Mesh(w,st);T.name="linen",T.frustumCulled=!1,me.add(T)}await o.yield();for(const t of $){const l=n.moundRings??40,i=n.moundSegs??96,h=[],w=[],R=[],T=.8;for(let W=0;W<=l;W++)for(let B=0;B<i;B++){B===0&&await o.yield();const G=t.r*(W/l),a=B/i*ne,N=t.x+Math.cos(a)*G,x=t.z+Math.sin(a)*G,A=W===l?-.5:0;h.push(N,ue(N,x)+A,x);const p=new e.Vector3(ue(N-T,x)-ue(N+T,x),2*T,ue(N,x-T)-ue(N,x+T)).normalize();w.push(p.x,p.y,p.z)}for(let W=0;W<l;W++)for(let B=0;B<i;B++){const G=W*i+B,a=W*i+(B+1)%i,N=G+i,x=a+i;R.push(G,a,N,a,x,N)}const C=new e.BufferGeometry;C.setAttribute("position",new e.Float32BufferAttribute(h,3)),C.setAttribute("normal",new e.Float32BufferAttribute(w,3)),C.setAttribute("aField",new e.BufferAttribute(new Float32Array(h.length/3).fill(1),1)),C.setIndex(R);const Y=new e.Mesh(C,st);Y.name="mound",Y.frustumCulled=!1,me.add(Y),await o.yield()}await o.yield();const ge=$.length?n.knots??700:0;if(ge){const t=x=>{const A=new e.IcosahedronGeometry(1,x),p=A.attributes.position,Q=A.attributes.normal;for(let O=0;O<p.count;O++){const U=new e.Vector3().fromBufferAttribute(p,O).normalize();Q.setXYZ(O,U.x,U.y,U.z)}return A},l=Math.ceil(ge*.16),i=t(1),h=t(n.knotDetail??0),w=Ot(z,ye),R=new e.InstancedMesh(i,w,l);R.name="knots",R.frustumCulled=!1;const T=new e.InstancedMesh(h,w,Math.max(1,ge-l));T.name="flower-knots",T.frustumCulled=!1,T.count=ge-l;const C=[new Float32Array(l*4),new Float32Array((ge-l)*4)],Y=[new Float32Array(l*3),new Float32Array((ge-l)*3)],W=new e.Matrix4,B=new e.Quaternion,G=new e.Vector3,a=new e.Vector3,N=[new e.Color("#f3b6c4"),s.clone(),f.clone().lerp(s,.3),f.clone().lerp(u,.25).lerp(s,.2)];for(let x=0;x<ge;x++){const A=$[x%$.length],p=x<ge*.16,Q=r.range(0,ne),O=A.r*Math.sqrt(r.range(.01,.9)),U=A.x+Math.cos(Q)*O,re=A.z+Math.sin(Q)*O,xe=St(U,re),te=_[xe],Ae=-(U-te.x)*Math.sin(te.ang)+(re-te.z)*Math.cos(te.ang),ie=p?r.range(2.4,4.4):r.range(.5,1.1);a.set(U,ue(U,re)+ie*(p?.75:.35),re),G.set(ie,ie*(p?r.range(.85,1.1):.6),ie),B.setFromEuler(new e.Euler(0,r.range(0,ne),0));const nt=p?x:x-l,Tt=C[p?0:1],Lt=Y[p?0:1];(p?R:T).setMatrixAt(nt,W.compose(a,B,G)),Tt.set([xe,Se((te.Rf-Ae)/(2*te.Rf),.01,.99),r.range(0,ne),p?ie*.25:0],nt*4);const at=p?v.clone().lerp(r.chance(.3)?f:u,r.range(0,.3)).multiplyScalar(r.range(.55,.8)):r.pick(N).clone().multiplyScalar(r.range(.85,1));Lt.set([at.r,at.g,at.b],nt*3),(x&31)===31&&await o.yield()}[i,h].forEach((x,A)=>{x.setAttribute("iK",new e.InstancedBufferAttribute(C[A],4)),x.setAttribute("iCol",new e.InstancedBufferAttribute(Y[A],3))}),me.add(R),me.add(T)}await o.yield();const Ce=new e.Mesh(Gt(r),Kt(z));Ce.name="needle",Ce.matrixAutoUpdate=!1,Ce.frustumCulled=!1,me.add(Ce),await o.yield();const K=new e.Vector3,Le=new e.Vector3,lt=new e.Vector3,Zt=new e.Vector3,Ze=new e.Vector3(0,1,0),Fe=new e.Vector3,H=new e.Vector3,fe=new e.Vector3(0,1,0),De=new e.Vector3,E=new e.Vector3,pe=new e.Vector3,Mt=X(ce*oe,new e.Vector3).clone(),$e=X(ce*oe+Be,new e.Vector3).clone(),he=$e.clone().sub(Mt).setY(0).normalize(),ct=n.hoopHeight??9.2,de=$e.clone().addScaledVector(he,-ct/Math.tan(k));de.y+=ct;const zt=de.clone().setY($e.y),Vt=ce+J.fEntry-.012,At=ce+We;if(await o.yield(),n.hoop!==!1){const t={wood:u.clone().lerp(f,.12).multiplyScalar(n.hoopWood??1.15),brass:f.clone().multiplyScalar(1.3),cream:s.clone()},l=await jt(r,t,de.y-8.3-zt.y,()=>o.yield()),i=new e.Mesh(l,new e.MeshStandardMaterial({vertexColors:!0,roughness:.55,metalness:.05,side:e.DoubleSide,emissive:u.clone(),emissiveIntensity:.16}));i.name="hoop",i.position.copy(de),i.quaternion.setFromRotationMatrix(new e.Matrix4().makeBasis(new e.Vector3().crossVectors(Ze,he).normalize(),Ze,he)),me.add(i)}await o.yield();const _e=6,Ee=$.length?null:n.feederSources||[],ut=$.length?_.length:Ee.length,Nt=_e+1+ut,ft=qt(Nt),Qe=new e.Mesh(ft,Ht(z));Qe.name="thread",Qe.frustumCulled=!1,me.add(Qe);const Ve=t=>ft.attributes[t],Re=[Ve("iP0"),Ve("iP1"),Ve("iP2"),Ve("iP3")],Je=Ve("iA"),Ie=Ve("iB"),ht=Ve("iC0"),Ye=n.threadRadius??.58,Ge=(t,l,i,h,w,R,T,C,Y,W,B,G)=>{Re[0].setXYZ(t,l.x,l.y,l.z),Re[1].setXYZ(t,i.x,i.y,i.z),Re[2].setXYZ(t,h.x,h.y,h.z),Re[3].setXYZ(t,w.x,w.y,w.z);const a=l.distanceTo(i)+i.distanceTo(h)+h.distanceTo(w);Je.setXYZW(t,R,T,C,Y),Ie.setXYZW(t,a,G>0?G/a:0,W,t*2.4),ht.setXYZ(t,B.r,B.g,B.b)},Ue=t=>Je.setXYZW(t,0,0,0,0),Ke=P.clone(),Pt=_.map(t=>g[t.col].clone().lerp(s,.25));let qe=null,et=null,kt=Te,dt=0,vt=n.gatherBack??190;const V=new e.Vector3,tt=new e.Vector3,I=new e.Vector3,L=new e.Vector3,we=new e.Vector3,mt=new e.Vector3,ot=new e.Vector3,Ct=new e.Matrix4,pt=t=>b||t>=0&&t<q,yt=At+.03,Bt=n.span??(b?6:q);function Ft(t,l){kt=t,z.uS.value=t,z.uTime.value=l;const i=Math.floor(t),h=J.pose(t,Fe,fe);H.copy(Fe).addScaledVector(fe,-(He-rt)),De.copy(Fe).addScaledVector(fe,-He),K.copy(fe).setY(0).normalize(),pe.crossVectors(Ze,K).normalize(),ot.copy(pe).addScaledVector(fe,-pe.dot(fe)).normalize(),mt.crossVectors(fe,ot),Ce.matrix.copy(Ct.makeBasis(mt,fe,ot).setPosition(De)),Ce.matrixWorldNeedsUpdate=!0,z.uNe0.value.copy(Fe),z.uNe1.value.copy(De),z.uFlash.value=(h-se+.04)/(le-se+.08);let w=0;const R=z.uRip.value;for(let a=i;a>i-4&&w<Ne;a--)if(pt(a))for(const[N,x,A]of[[a+J.fEntry,a*oe+Be,1],[a+J.fExit,a*oe,.55]]){if(N>t||w>=Ne)continue;const p=(t-N)*S,Q=A*(1-Z(3,4.4,p));Q<=0||(X(x,K),R[w++].set(K.x,K.z,p,Q))}for(;w<Ne;w++)R[w].w=0;for(let a=0;a<_e;a++){const N=i-a,x=t-N;if(z.uStW.value[a]=0,!pt(N)||x<J.fEyeOut){Ue(a);continue}if(X(N*oe,V),V.y-=.7,X(N*oe+Be,tt),tt.y-=.7,x<J.fEyeIn){I.lerpVectors(V,H,.3),I.y=Math.max(V.y+1.6,be(V.y,H.y,.12)),L.copy(H).addScaledVector(fe,-16),L.y=Math.max(V.y+1.2,L.y-5),Ge(a,V,I,L,H,Ye*(n.layRadius??1),0,0,.5,1,Ke,0),Ie.setW(a,-1-a*2.4),z.uSt.value[a].set(V.x,V.z,be(V.x,H.x,.25),be(V.z,H.z,.25)),z.uStW.value[a]=.6;continue}const A=(x-J.fEyeIn)/(1+J.fEyeOut-J.fEyeIn),p=A-.62;let Q=Z(0,.25,A)*(A<.62?1:Math.exp(-3.2*p)*Math.cos(7*p));!b&&N===q-1&&(Q*=1-dt);let O=0;if(x>ze){if(O=(x-ze)/.55,O>=1){Ue(a);continue}Q=Math.max(Q,Math.sin(Math.PI*O)*.8)}we.lerpVectors(tt,V,O);const U=Math.max(.5,1.1+4.5*Q);I.lerpVectors(V,we,.25),L.lerpVectors(V,we,.75);{const re=N*oe,xe=Be*(1-O),te=.667*(U+.7)-.7,Ae=X(re+xe*.315,Le).y+te,ie=X(re+xe*.685,Le).y+te+O*1.3;I.y=(-5*V.y+18*Ae-9*ie+2*we.y)/6,L.y=(2*V.y-9*Ae+18*ie-5*we.y)/6}Ge(a,V,I,L,we,Ye*(n.stitchRadius??1.4),.8*Math.abs(Q)*(1-O*.6),0,0,1,Ke,0),Ie.setW(a,-1-a*2.4),z.uSt.value[a].set(V.x,V.z,we.x,we.z),z.uStW.value[a]=1}if(X(t*oe-vt,E),E.y+=(n.threadHeight??96)+Math.sin(t*ne)*2.5,n.hang!==!1&&$.length){let a=0,N=0,x=.6;for(const A of _){if(!A.m)continue;const p=Z(0,.08,A.prog)*(1-Z(.92,1,A.prog));a+=p*(A.x-E.x),N+=p*(A.z-E.z),x+=p}E.addScaledVector(pe,Se((a*pe.x+N*pe.z)/x*.2,-36,36)+(n.gatherSide??0)*(pe.x<0?-1:1)*(1-Math.min(1,(x-.6)*2)))}const T=Z(J.fEyeOut-.05,se+.08,h)*(1-Z(le-.1,We,h));K.subVectors(E,H);const C=K.length(),Y=E.y-H.y;K.setY(0);const W=K.length();K.normalize();const B=Math.exp(-Math.pow((h-.32)/.16,2));if(n.hang===!1)I.copy(H).addScaledVector(K,C*.22).addScaledVector(pe,3),I.y+=be(-14,12,T),L.copy(E).addScaledVector(K,-C*.3),L.y-=be(30,6,T);else{const a=E.y-(n.threadHeight??96)+4,N=T*.82;I.copy(H).addScaledVector(K,W*.55).addScaledVector(pe,3),I.y=Math.max(H.y+Y*.04-5,Math.min(a,H.y+Y*.3)),L.copy(E).addScaledVector(K,-W*.12),L.y=E.y-Y*.52-6,Le.lerpVectors(H,E,.33),lt.lerpVectors(H,E,.67),I.lerp(Le,N),L.lerp(lt,N)}Ge(_e,H,I,L,E,Ye,0,0,1+2.2*(1-T)+1.2*B,0,Ke,0),z.uKnot.value.copy(E),z.uSup.value[0].copy(H),z.uSup.value[1].copy(I),z.uSup.value[2].copy(L),z.uSup.value[3].copy(E);let G=0;for(let a=0;a<ut;a++){const N=_e+1+a;if(Ee)V.copy(Ee[a]);else{const p=_[a];if(!p.m||p.prog<=.001||p.prog>=.999){Ue(N);continue}const Q=Math.floor(2*p.Rf/z.uRowW.value),O=p.prog*Q,U=Math.floor(O);let re=O-U;U%2&&(re=1-re);const xe=(re-.5)*2*p.Rf,te=p.Rf-(U+.5)*z.uRowW.value,Ae=Math.cos(p.ang),ie=Math.sin(p.ang);V.set(p.x+Ae*xe-ie*te,0,p.z+ie*xe+Ae*te),V.y=ue(V.x,V.z)+.4,G<8&&z.uFeed.value[G++].set(V.x,V.y,V.z,Z(.001,.03,p.prog)*(1-Z(.97,.999,p.prog)))}K.subVectors(E,V);const x=K.length();K.setY(0).normalize();const A=Math.min(x*(n.feederSag??0),n.feederSagMax??40);I.copy(V).addScaledVector(K,x*(A>0?.16:.08)),I.y+=16+3*Math.sin(l*1.3+a)-A*.35,L.copy(E).addScaledVector(K,-x*(A>0?.36:.3)),L.y-=22+a%3*4+A*(.85+.15*(a%3)),A>0&&(I.y=Math.max(I.y,ue(I.x,I.z)+9,V.y+5),L.y=Math.max(L.y,ue(L.x,L.z)+14)),Ge(N,V,I,L,E,Ye*.66,0,.6,A>0?.9+1.7*B:.5,0,Ee?Ke:Pt[a],30)}for(;G<8;G++)z.uFeed.value[G].w=0;for(const a of Re)a.needsUpdate=!0;Je.needsUpdate=!0,Ie.needsUpdate=!0,ht.needsUpdate=!0}function gt(t){const l=n.unravelSpan??.45;for(let i=0;i<_.length;i++){const h=_[i];h.prog=Se((t-h.order*(1-l))/l,0,1),z.uSeedB.value[i].y=h.prog}}const Rt=r.range(.02,.2),Wt=[-240,-170,-115,-60,0,50,110].map((t,l)=>de.clone().addScaledVector(he,t).setY(de.y+(t<-60?(-t-60)*.1:0))),wt={object:me,radius:b?100:(n.roadLength??1400)/2,height:110,center:new e.Vector3(0,34,0),ground:!1,groundY:0,uniforms:z,needle:{tip:Fe,eye:H,crown:De,dir:fe},gather:E,hoopPhase:Vt,hoopClearPhase:yt,stitchesPerLap:ae,anchors:{portalSeat:{position:de.clone(),facing:he.clone().negate(),direction:he.clone(),radius:7},flyThrough:Wt,beyond:de.clone().addScaledVector(he,60),ringRoad:b?{center:new e.Vector3(0,0,0),radius:j,direction:F}:null,mounds:$.map(t=>({center:new e.Vector3(t.x,ue(t.x,t.z),t.z),radius:t.r})),threadHeight:n.threadHeight??96,viewpoints:{far:new e.Vector3(-150,70,300),reveal:de.clone().addScaledVector(he,-210).add(new e.Vector3(0,45,0)),chase:de.clone().addScaledVector(he,-150).setY(12),under:new e.Vector3(0,40,0).addScaledVector(he,-80)}},road:(t,l=new e.Vector3)=>X(t,l),pose:(t,l,i)=>J.pose(t,l,i),rippleAt:(t,l)=>_t(z.uRip.value,t,l),setPhase(t){qe=t},setProgress(t){qe=yt-(1-Se(t,0,1))*Bt},setUnravel(t){et=t},setFinalTaut(t){dt=Se(t,0,1)},setGatherBack(t){vt=t},update(t,l){const i=qe!==null?qe:Te+l/S;if(et!==null)gt(Se(et,0,1));else{const h=(l/64+Rt)%1;gt(h<.84?.06+.72*h/.84:.78*(1-Z(.86,.98,h))+.06*Z(.86,.98,h))}Ft(i,l)},dispose(){}};return wt.update(0,0),wt}export{rt as EYE_Y,se as F1,le as F2,We as F3,Oe as GLSL_COMMON,He as NEEDLE_LEN,It as OVERHEAD_GLSL,oe as PITCH,Be as SEW,Qt as buildHero};
