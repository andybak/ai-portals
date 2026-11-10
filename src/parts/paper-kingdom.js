import*as z from"three";import{clamp as B,lerp as U,smoothstep as ce}from"../kit/core.js";const Me=["#f4ecdc","#e6dcc6","#c9bda2","#8a8272","#2a2a3a","#1f3fa8","#e23a2a"],$=148,G=150,p=9,Q=15,qe=130,ke=-130,W=-134,ee=48,ie=60,te=7.6,X=p+27,H={x:-37,z:-8,h:70},ne=446,J=.08,le=.84,Se=(i,u)=>{const c=(152-i)*.96+(124-u)*.26,g=86+(144-u)+.35*Math.abs(i);return U(g,c,ce(-10,30,i)*ce(-20,60,u))},O=(i,u)=>B(J+le*Se(i,u)/ne,J,.97),Pe=[[152,45,124],[100,40,106],[50,34,96],[18,27,84],[3,20,62],[0,17,44],[0,17.5,18],[0,25,-10],[0,33.5,-36],[0,36,-50],[0,36,-92],[0,36,-134]],Ae=(i,u)=>{const c=Math.max(0,(i*1.4-u)/.16);return 1-Math.exp(-5*c)*Math.cos(7*c)};function ve(i){const u=[],c=[],g=[],M=[],w=[],l=[];let v=0,y=0,A=-1,S=0;const m=(o,f,r,n,a,e,t,s,d)=>{u.push(o[0],o[1],o[2]),c.push(f,r,n),g.push(a,e),M.push(t,s),w.push(v,y,A),l.push(d,S)},q=(o,f)=>Math.hypot(o[0]-f[0],o[1]-f[1],o[2]-f[2]),b={fold(o,f,r){v=o,y=f,A=r,S=Math.floor(i()*997)},still(o=0,f=0){v=o,y=f,A=-1,S=Math.floor(i()*997)},quad(o,f,r,n,a,e=0,t={}){const s=1+(i()-.5)*2*(t.tint??.05),d=a.r*s,h=a.g*s,x=a.b*s,k=t.w??q(o,f),P=t.h??q(o,n),T=t.noEdge?0:k,R=P,I=t.u0??0,F=t.v0??0;if(t.uv){const E=t.uv,_=t.size;m(o,d,h,x,E[0],E[1],_[0],_[1],e),m(f,d,h,x,E[2],E[3],_[0],_[1],e),m(r,d,h,x,E[4],E[5],_[0],_[1],e),m(o,d,h,x,E[0],E[1],_[0],_[1],e),m(r,d,h,x,E[4],E[5],_[0],_[1],e),m(n,d,h,x,E[6],E[7],_[0],_[1],e);return}m(o,d,h,x,I,F,T,R,e),m(f,d,h,x,I+k,F,T,R,e),m(r,d,h,x,I+k,F+P,T,R,e),m(o,d,h,x,I,F,T,R,e),m(r,d,h,x,I+k,F+P,T,R,e),m(n,d,h,x,I,F+P,T,R,e)},tri(o,f,r,n,a=0,e={}){const t=1+(i()-.5)*2*(e.tint??.05),s=n.r*t,d=n.g*t,h=n.b*t,x=q(o,f),k=q(f,r),P=q(r,o),T=(x+k+P)/2,R=Math.sqrt(Math.max(0,T*(T-x)*(T-k)*(T-P))),I=e.noEdge?0:2*R/Math.max(x,k,P,.001),F=e.noEdge?0:-1;m(o,s,d,h,1,0,F,I,a),m(f,s,d,h,0,1,F,I,a),m(r,s,d,h,0,0,F,I,a)},walls(o,f,r,n,a,e,t,s=1,d={}){b.quad([o,a,n],[f,a,n],[f,e,n],[o,e,n],t,s,d),b.quad([f,a,n],[f,a,r],[f,e,r],[f,e,n],t,s,d),b.quad([f,a,r],[o,a,r],[o,e,r],[f,e,r],t,s,d),b.quad([o,a,r],[o,a,n],[o,e,n],[o,e,r],t,s,d)},ring(o,f,r,n,a,e,t,s,d=0,h=0,x={}){for(let k=0;k<t;k++){const P=h+k/t*Math.PI*2,T=h+(k+1)/t*Math.PI*2,R=Math.cos(P),I=Math.sin(P),F=Math.cos(T),E=Math.sin(T);a<.01?b.tri([o+F*r,n,f+E*r],[o+R*r,n,f+I*r],[o,e,f],s,d,x):b.quad([o+F*r,n,f+E*r],[o+R*r,n,f+I*r],[o+R*a,e,f+I*a],[o+F*a,e,f+E*a],s,d,x)}},get tris(){return u.length/9},geometry(){const o=new z.BufferGeometry;return o.setAttribute("position",new z.Float32BufferAttribute(u,3)),o.setAttribute("color",new z.Float32BufferAttribute(c,3)),o.setAttribute("uv",new z.Float32BufferAttribute(g,2)),o.setAttribute("aSize",new z.Float32BufferAttribute(M,2)),o.setAttribute("aFold",new z.Float32BufferAttribute(w,3)),o.setAttribute("aK",new z.Float32BufferAttribute(l,2)),o}};return b}const re=`
  uniform float uUnfold, uTime;
  const float PY = ${p.toFixed(1)};
  float hash11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
  float hash21(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
  float springE(float phase){ float t = max(0., (uUnfold * 1.4 - phase) / .16); return 1. - exp(-5. * t) * cos(7. * t); }
  // parallelogram pop-up: every point swings about its own foot on the page, along the fold direction
  vec3 popup(vec3 p, vec2 dir, float e){
    float h = p.y - PY, th = mix(.05, 1.5708, e);
    return vec3(p.x + dir.x * h * cos(th), PY + h * sin(th), p.z + dir.y * h * cos(th));
  }
  float phaseAt(vec2 xz){
    float a = (152. - xz.x) * .96 + (124. - xz.y) * .26, b = 86. + (144. - xz.y) + .35 * abs(xz.x);
    float d = mix(b, a, smoothstep(-10., 30., xz.x) * smoothstep(-20., 60., xz.y));
    return clamp(${J.toFixed(2)} + ${le.toFixed(2)} * d / ${ne.toFixed(1)}, ${J.toFixed(2)}, .97);
  }
`,he=`
  uniform vec3 uLightDir, uSun, uAmbSky, uAmbShade, uWarm;
  uniform float uCloudT;
  float plH(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
  float plN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(plH(i), plH(i + vec2(1., 0.)), f.x), mix(plH(i + vec2(0., 1.)), plH(i + 1.), f.x), f.y); }
  // the shadows of the cloud flats sliding over the desk: crisp-edged, like paper shadows
  float cloudShade(vec3 viewPos){
    vec3 w = cameraPosition + (vec4(viewPos, 0.) * viewMatrix).xyz;
    vec2 q = w.xz * .0040 + vec2(uCloudT * .042, uCloudT * .013);
    float n = plN(q) * .66 + plN(q * 2.7 + 7.3) * .34;
    return 1. - .46 * smoothstep(.555, .60, n);
  }
  // flat-shaded paper: geometric normal from derivatives (always faces the viewer), warm transmission when back-lit
  vec3 paperLight(vec3 alb, vec3 viewPos, float shadow, float ao, out vec3 n){
    n = normalize(cross(dFdx(viewPos), dFdy(viewPos)));
    vec3 L = normalize((viewMatrix * vec4(uLightDir, 0.)).xyz);
    vec3 nw = (vec4(n, 0.) * viewMatrix).xyz;
    float ndl = dot(n, L);
    vec3 amb = mix(uAmbShade, uAmbSky, nw.y * .5 + .5) * ao;
    vec3 sun = uSun * (max(ndl, 0.) * shadow + max(-ndl, 0.) * .26 * shadow) * cloudShade(viewPos);
    return alb * (amb + sun) + alb * uWarm * max(-ndl, 0.) * .10;
  }
`;function ze(i){return new z.ShaderMaterial({side:z.DoubleSide,fog:!0,vertexColors:!0,uniforms:{...z.UniformsUtils.clone(z.UniformsLib.fog),uUnfold:i.uUnfold,uTime:i.uTime,uLightDir:i.uLightDir,uSun:i.uSun,uAmbSky:i.uAmbSky,uAmbShade:i.uAmbShade,uWarm:i.uWarm,uInk:i.uInk,uRed:i.uRed,uBlue:i.uBlue,uHole:i.uHole,uGlow:i.uGlow,uShadow:i.uShadow,uCloudT:i.uTime,uPageCol:i.uPageCol},vertexShader:`
      attribute vec2 aSize; attribute vec3 aFold; attribute vec2 aK;
      uniform vec3 uHole;
      varying vec3 vRest, vView, vCol, vHole; varying vec2 vUv, vSize, vK; varying float vE, vPop;
      #include <fog_pars_vertex>
      ${re}
      void main(){
        vec3 p = position; float e = 1.;
        if (aFold.z >= 0.) {
          e = springE(aFold.z); float ec = clamp(e, 0., 1.);
          if (aK.x > 11.5) {                                  // the rosette round the hole: petal tips breathe toward the avenue
            float w = aSize.x < -.5 ? 1. - uv.x - uv.y : 0.;
            p.z += w * ec * (.8 * sin(uTime * 2.1 + aK.y) + .35 * sin(uTime * 4.3 + aK.y * 1.7));
            p.x += w * ec * .3 * sin(uTime * 1.7 + aK.y * 2.3);
          } else if (aK.x > 10.5) {                           // paper-doll chains: a ripple runs down the line of linked hands
            float h = max(p.y - PY, 0.) / 5. * ec, ph = (position.x + position.z) * .33;
            float r = .42 * sin(uTime * 1.7 + ph) + .18 * sin(uTime * 3.4 + ph * 2.1);
            p.x += h * r; p.z += h * r * .6;
          } else if (aK.x > 9.5) {                            // avenue trees: the cut-out crowns nod
            float h = max(p.y - PY - 1.5, 0.) / 8.; h *= h * ec;
            p.x += h * (.75 * sin(uTime * 1.25 + position.z * .31) + .3 * sin(uTime * 2.9 + position.z * 1.1));
            p.z += h * 1.1 * sin(uTime * .95 + position.z * .21 + 1.3);
          } else if (aK.x > 8.5) {                            // bunting: the pennant tips snap about in the draught
            float w = aSize.x < -.5 ? 1. - uv.x - uv.y : 0., ph = position.z * .55 + aK.y;
            p.x += w * ec * (.85 * sin(uTime * 3.1 + ph) + .4 * sin(uTime * 5.3 + ph * 1.7));
            p.z += w * ec * .5 * cos(uTime * 2.3 + ph);
            p.y += w * ec * .25 * sin(uTime * 4.1 + ph * 1.3);
          } else if (aK.x > 7.5) {                            // kites
            float k = (p.y - PY) / 60.; k *= k;
            p += vec3(sin(uTime * .5 + aK.y) * 5., sin(uTime * .8 + aK.y * 2.) * 1.6, cos(uTime * .37 + aK.y * 1.7) * 4.) * k;
            p.x += k * .9 * sin(uTime * 3.3 + p.y * .7 + aK.y);  // tail ripple
          } else if (aK.x > 1.5 && aK.x < 2.5) {              // the standing page: its top corners curl forward and flutter
            float c = smoothstep(24., 48., abs(uv.x - ${ee.toFixed(1)})) * smoothstep(30., ${ie.toFixed(1)}, uv.y); c *= c;
            p.z += c * (5. + 2.6 * sin(uTime * 1.3 + uv.x * .08) + 1.1 * sin(uTime * 2.9 + uv.x * .21));
            p.y -= c * (1.5 + .8 * sin(uTime * 1.3 + uv.x * .08));
          }
          p = popup(p, aFold.xy, e);
        }
        else if (aK.x > 6.5) { float w = uv.x / max(aSize.y, 1.); p.y += aFold.x * w * w * (.6 + sin(uTime * 1.7 + aFold.y + uv.y * .09) + .4 * sin(uTime * 3.1 + aFold.y * 2. + uv.y * .21)); }
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        vView = mvPosition.xyz; vHole = (modelViewMatrix * vec4(uHole, 1.)).xyz - mvPosition.xyz;
        vRest = position; vCol = color; vUv = uv; vSize = aSize; vK = aK; vE = e; vPop = step(0., aFold.z);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uInk, uRed, uBlue, uPageCol; uniform float uGlow; uniform sampler2D uShadow;
      varying vec3 vRest, vView, vCol, vHole; varying vec2 vUv, vSize, vK; varying float vE, vPop;
      #include <fog_pars_fragment>
      ${re}
      ${he}
      float vnoise(vec3 p){
        vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        float n = i.x + i.y * 57. + i.z * 113.;
        return mix(mix(mix(hash11(n), hash11(n + 1.), f.x), mix(hash11(n + 57.), hash11(n + 58.), f.x), f.y),
                   mix(mix(hash11(n + 113.), hash11(n + 114.), f.x), mix(hash11(n + 170.), hash11(n + 171.), f.x), f.y), f.z);
      }
      // printed lines of "words": p in metres, lh = line height
      float textInk(vec2 p, float lh){
        float row = floor(p.y / lh), fr = fract(p.y / lh);
        float band = step(.30, fr) * step(fr, .66);
        float cw = lh * .62, cx = floor(p.x / cw), fx = fract(p.x / cw);
        float word = step(.17, hash21(vec2(floor(cx * .37 + hash11(row) * 9.), row))) * step(.06, fx) * step(fx, .94);
        float para = step(hash11(row * 1.7 + 3.), .9);
        return band * mix(step(.5, hash21(vec2(cx, row))), 1., .75) * word * para;
      }
      // a column of print between x0 and x1: ragged right edge, paragraph breaks, short last lines, indents
      float textCol(vec2 p, float lh, float x0, float x1){
        float row = floor(p.y / lh), fr = fract(p.y / lh);
        float band = step(.30, fr) * step(fr, .66);
        float blank = step(hash11(row * 1.7 + 3. + x0), .12), last = step(hash11((row - 1.) * 1.7 + 3. + x0), .12), first = step(hash11((row + 1.) * 1.7 + 3. + x0), .12);
        float len = mix(mix(.86, 1., hash11(row * 3.1 + x0)), mix(.22, .7, hash11(row * 5.3 + x0)), last);
        float t = (p.x - x0) / (x1 - x0);
        float inside = step(first * .07, t) * step(t, len);
        float cw = lh * .62, cx = floor(p.x / cw), fx = fract(p.x / cw);
        float word = step(.17, hash21(vec2(floor(cx * .37 + hash11(row) * 9.), row))) * step(.06, fx) * step(fx, .94);
        return band * word * inside * (1. - blank) * mix(.7, 1., hash21(vec2(cx, row)));
      }
      float box(vec2 p, vec2 lo, vec2 hi){ return step(lo.x, p.x) * step(p.x, hi.x) * step(lo.y, p.y) * step(p.y, hi.y); }
      float frameLine(vec2 p, vec2 lo, vec2 hi, float w){ return box(p, lo, hi) - box(p, lo + w, hi - w); }
      void main(){
        float kind = vK.x, seed = floor(vK.y + .5), e = clamp(vE, 0., 1.);   // snap the interpolated per-face seed
        vec3 alb = vCol, emis = vec3(0.);
        float shadow = 1., ao = 1.;
        vec3 fp = vRest * vec3(.8, 2.3, .8);
        alb *= .93 + .12 * (vnoise(fp) * .6 + vnoise(fp * 3.7 + 11.) * .4);
        float ed = 1e3;
        if (vSize.x > 0.) ed = min(min(vUv.x, vSize.x - vUv.x), min(vUv.y, vSize.y - vUv.y));
        else if (vSize.x < -.5) ed = min(min(vUv.x, vUv.y), 1. - vUv.x - vUv.y) * vSize.y;
        float aa = fwidth(ed) + 1e-4;
        float line = (1. - smoothstep(.05, .05 + aa, ed)) * clamp(.3 / aa, 0., 1.);
        if (vPop > .5) ao = mix(.66, 1., smoothstep(0., 8., vRest.y - PY));

        if (kind > .5 && kind < 1.5) {                       // wall with cut-out windows lit from behind
          vec2 nc = max(floor(vSize / vec2(3.1, 3.5) + .03), 1.), cell = vSize / nc;   // +.03: vSize is interpolated, keep the count stable
          vec2 g = vUv / cell, id = floor(g), f = fract(g);
          float ok = step(2.2, vSize.x) * step(3., vSize.y);
          float win = step(abs(f.x - .5), .23) * step(.30, f.y) * step(f.y, .76) * ok;
          float frame = step(abs(f.x - .5), .29) * step(.25, f.y) * step(f.y, .81) * ok - win;
          float mull = max(step(abs(f.x - .5), .022), step(abs(f.y - .55), .016));
          float h = hash21(id + vec2(seed * .37, seed * .11)), lit = step(.36, h);
          alb = mix(alb, alb * .78, frame * .7);
          alb = mix(alb, mix(alb * vec3(.34, .34, .46), alb * .45, lit), win);
          float h2 = hash21(id + vec2(seed * .71 + 2., seed * .43));
          float flick = 1. + .15 * sin(uTime * (2.2 + h * 4.) + h2 * 40.) + step(.72, h2) * .22 * sin(uTime * 7.3 + h * 60.) * sin(uTime * 1.9 + h2 * 20.);
          emis += uWarm * win * lit * (1. - mull * .8) * (1.3 + 1.8 * hash21(id + vec2(seed * .13 + 5., seed * .29))) * flick * e * e;
        } else if (kind < 2.5 && kind > 1.5) {               // the standing page: print, ornament ring, light spilling from the cut
          vec2 c = vUv - vec2(${ee.toFixed(1)}, ${(X-p).toFixed(1)}); float r = length(c);
          float mrg = step(7., vUv.x) * step(vUv.x, ${(2*ee-7).toFixed(1)}) * step(5., vUv.y) * step(vUv.y, ${(ie-6).toFixed(1)});
          vec2 b0 = vec2(60., 7.5), b1 = vec2(88., 20.);                          // a blue engraved plate, bottom right
          float plate = box(vUv, b0, b1);
          float tx = (textCol(vUv, 1.9, 8., 45.) * box(vUv, vec2(8., 5.), vec2(45., 45.5)) + textCol(vUv, 1.9, 51., 88.) * box(vUv, vec2(51., 5.), vec2(88., 45.5)))
            * mrg * smoothstep(13., 13.6, r) * (1. - plate);
          alb = mix(alb, uInk, tx * .55 * (1. - step(vUv.x, 17.5) * step(36., vUv.y)));
          float hills = step(vUv.y, b0.y + 3.5 + 3. * vnoise(vec3(vUv.x * .35, 3., 1.)) + 2.4 * abs(sin(vUv.x * .42)));
          float rays = step(.5, fract(atan(vUv.y - b0.y - 4., vUv.x - 74.) * 3.2)) * step(3.2, length(vUv - vec2(74., b0.y + 4.)));
          vec3 pl = mix(mix(uBlue, vCol, .78), mix(uBlue, vCol, .52), rays);
          pl = mix(pl, mix(uBlue, uInk, .35), hills); pl = mix(pl, uRed, step(length(vUv - vec2(74., b0.y + 4.)), 2.6) * (1. - hills));
          alb = mix(alb, pl, plate * .92);
          alb = mix(alb, uInk, frameLine(vUv, b0 - .5, b1 + .5, .22) * .7);
          alb = mix(alb, uRed, box(vUv, vec2(46.6, 2.2), vec2(49.4, 3.6)) * .8);                       // folio mark
          alb = mix(alb, uInk, frameLine(vUv, vec2(4.5, 1.2), vec2(${(2*ee-4.5).toFixed(1)}, ${(ie-3).toFixed(1)}), .16) * .35);
          vec2 dc = abs(vUv - vec2(12., 41.5));                                   // red drop cap and a heading rule
          float cap = step(max(dc.x, dc.y), 4.2) * (1. - step(max(dc.x, dc.y), 3.5) * step(.9, abs(dc.x - dc.y * .6)));
          alb = mix(alb, uRed, cap * .85);
          alb = mix(alb, uInk, step(abs(vUv.y - 49.5), 1.1) * step(22., vUv.x) * step(vUv.x, 74.) * step(.25, fract(vUv.x / 5.3)) * .6);
          float ra = fwidth(r);
          alb = mix(alb, uRed, (smoothstep(10.2 - ra, 10.2, r) - smoothstep(10.8, 10.8 + ra, r)) * .85);
          alb = mix(alb, uInk, (smoothstep(11.7 - ra, 11.7, r) - smoothstep(11.9, 11.9 + ra, r)) * .6);
          float dr = max(r - ${te.toFixed(1)}, 0.);
          emis += uWarm * (2.2 * exp(-dr * 1.6) + .28 * exp(-dr * .2)) * uGlow;
        } else if (kind > 2.5 && kind < 3.5) {               // roof: shingle rows
          float rw = fract(vUv.y / 1.15), ra = fwidth(vUv.y / 1.15);
          alb *= 1. - .16 * (1. - smoothstep(.1, .1 + ra, rw)) * clamp(.4 / ra, 0., 1.);
        } else if (kind > 3.5 && kind < 4.5) {               // book page: avenue, rules, print, baked pop-up shadows
          vec2 q = vRest.xz; float ax = abs(q.x), ra = fwidth(ax) + 1e-4;
          float ave = 1. - smoothstep(${Q.toFixed(1)} - .2, ${Q.toFixed(1)}, ax);
          float inb = step(abs(q.y), 143.);
          // the printed spread: two columns of text a side, a red drop cap, an engraved map, a compass plate, a tinted title band
          vec2 pp = vec2(ax, q.y), sd = vec2(step(0., q.x) * 37., 0.);
          vec2 m0 = vec2(84., 60.), m1 = vec2(137., 118.), c0 = vec2(22., -78.), c1 = vec2(76., -26.), t0 = vec2(84., -126.), t1 = vec2(137., -110.), d0 = vec2(22., 124.), d1 = vec2(35., 138.);
          float mapB = box(pp, m0, m1), cmpB = box(pp, c0, c1), ttlB = box(pp, t0, t1), capB = box(pp, d0, d1);
          float colA = box(pp, vec2(22., -139.), vec2(76., 139.)), colB = box(pp, vec2(84., -139.), vec2(137., 139.));
          float tx = (textCol(vec2(ax, q.y + 400.) + sd, 2.6, 22. + sd.x, 76. + sd.x) * colA + textCol(vec2(ax, q.y + 400.) + sd, 2.6, 84. + sd.x, 137. + sd.x) * colB)
            * (1. - mapB) * (1. - cmpB) * (1. - ttlB) * (1. - box(pp, d0 - 1., d1 + vec2(2., 1.))) * inb;
          alb = mix(alb, uInk, tx * .36);
          vec3 wash = mix(uBlue, vCol, .80);
          // engraved map: contour lines in pale blue ink, a red route, a hatched sea
          float hgt = vnoise(vec3(q * .045 + sd.x, 2.)) * .65 + vnoise(vec3(q * .13, 9.)) * .35, hw = fwidth(hgt) * 9. + 1e-4;
          float cont = (1. - smoothstep(.08, .08 + hw, abs(fract(hgt * 9.) - .5) * 2.)) * clamp(.5 / hw, 0., 1.);
          float sea = step(hgt, .40) * step(.5, fract((q.x + q.y) * .45));
          vec3 mp = mix(vCol * .97, wash, sea * .55); mp = mix(mp, mix(uBlue, uInk, .3), cont * .55);
          mp = mix(mp, uRed, (1. - smoothstep(.0, .5, abs(pp.y - 89. - 14. * sin(pp.x * .11 + sd.x)) - .25)) * step(.4, fract(pp.x * .35)) * .8);
          alb = mix(alb, mp, mapB); alb = mix(alb, uInk, frameLine(pp, m0 - .8, m1 + .8, .3) * .6);
          // compass plate: rings and a sixteen-point star
          vec2 cc = pp - (c0 + c1) * .5; float cr = length(cc), ca = atan(cc.y, cc.x), cw = fwidth(cr) + 1e-4;
          float star = step(cr, 9. + 13. * pow(abs(cos(ca * 4.)), 6.) + 4. * pow(abs(cos(ca * 8. + 1.5708)), 10.));
          float rings = (1. - smoothstep(.12, .12 + cw, abs(cr - 23.))) + (1. - smoothstep(.1, .1 + cw, abs(cr - 20.5))) + step(.5, fract(ca * 5.093)) * step(20.5, cr) * step(cr, 23.);
          vec3 cp = mix(vCol * .98, wash, star * .7 * step(.5, fract(ca * 1.2732 + .125)) + star * .25);
          cp = mix(cp, uRed, step(cr, 2.2) * .85); cp = mix(cp, mix(uBlue, uInk, .3), clamp(rings, 0., 1.) * .55);
          alb = mix(alb, cp, cmpB); alb = mix(alb, uInk, frameLine(pp, c0 - .8, c1 + .8, .3) * .5);
          // title band and drop cap
          alb = mix(alb, wash, ttlB * .8); alb = mix(alb, uInk, ttlB * step(abs(pp.y + 118.), 1.6) * step(90., pp.x) * step(pp.x, 131.) * step(.22, fract(pp.x / 6.1)) * .55);
          vec2 dq = abs(pp - (d0 + d1) * .5);
          alb = mix(alb, uRed, capB * (1. - step(max(dq.x, dq.y), 5.2) * step(1.3, abs(dq.x - dq.y * .55))) * .85);
          // margin rules, running head
          alb = mix(alb, uRed, (smoothstep(140.2 - ra, 140.2, ax) - smoothstep(140.5, 140.5 + ra, ax)) * .55 * inb);
          alb = mix(alb, uInk, step(abs(abs(q.y) - 141.2), .14) * step(20., ax) * step(ax, 139.) * .45);
          // fold creases across the sheet (every 60 m, and one down each page): a lit lip and a lavender valley
          float fz = (fract((q.y + 30.) / 60. + .5) - .5) * 60., fxx = ax - 80.;
          float crease = exp(-fz * fz / 5.) + exp(-fxx * fxx / 5.) * .8;
          alb = mix(alb, alb * vec3(.78, .78, .90), clamp(crease, 0., 1.) * .55);
          alb *= 1. + .05 * (smoothstep(0., 6., fz) * exp(-abs(fz) / 9.) - smoothstep(0., 6., -fz) * exp(-abs(fz) / 9.));
          alb = mix(alb * vec3(.90, .89, .95), alb, smoothstep(0., 70., ax));           // the sheet curls down into the gutter
          // avenue: cut-paper paving, each tile its own off-white, joints scored in
          float brick = step(.5, fract(q.y / 12.)) * 2.5;
          float jz = fract(q.y / 6.), jx = fract((ax + brick) / 5.);
          float ja = fwidth(q.y / 6.), jb = fwidth(ax / 5.) + 1e-4;
          float joint = max((1. - smoothstep(.025, .025 + ja, jz)) * clamp(.25 / ja, 0., 1.), (1. - smoothstep(.03, .03 + jb, jx)) * clamp(.25 / jb, 0., 1.));
          float tile = hash21(vec2(floor(q.y / 6.), floor((ax + brick) / 5.)));
          alb *= 1. - ave * (.03 + .09 * tile * clamp(.5 / ja, 0., 1.) + .16 * joint);
          alb = mix(alb, alb * vec3(.84, .84, .93), ave * step(.86, tile) * clamp(.5 / ja, 0., 1.) * .6);
          alb = mix(alb, uBlue, (smoothstep(15.5 - ra, 15.5, ax) - smoothstep(15.85, 15.85 + ra, ax)) * .8 * inb);
          alb = mix(alb, uRed, (smoothstep(16.7 - ra, 16.7, ax) - smoothstep(16.9, 16.9 + ra, ax)) * .8 * inb);
          alb *= 1. - .45 * (1. - smoothstep(.12, .12 + ra, ax));
          alb = mix(alb, uRed, (1. - smoothstep(.3, .3 + ra, ax)) * step(fract(q.y / 9.), .55) * step(.12, ax) * .8 * inb);   // sewn binding thread
          ao = mix(.72, 1., smoothstep(0., 9., ax));          // the valley fold sits in shade
          float sh = texture2D(uShadow, (q + 150.) / 300.).r;
          shadow = 1. - sh * .85 * clamp(springE(phaseAt(q)), 0., 1.);
        } else if (kind > 5.5 && kind < 6.5) {               // fore-edge: the stack of page edges
          float l = fract(vUv.y * 5.), la = fwidth(vUv.y * 5.);
          alb *= 1. - .22 * step(l, .45) * clamp(.3 / la, 0., 1.);
        }
        if (vPop > .5) {                                      // lying flat, every piece is a bold printed cut-out of itself
          float up = smoothstep(.03, .5, e), hs = hash11(seed * 1.37 + 5.);
          bool body = (kind > .5 && kind < 1.5) || (kind > 2.5 && kind < 3.5);       // walls and roofs: printed in red, indigo or their own paper
          vec3 inkC = hs < .30 ? uRed : (hs < .52 ? mix(uBlue, uInk, .25) : alb);
          vec3 flatC = body ? mix(alb, inkC, .8) : alb;
          float keep = body || kind > 8.5 ? .9 : .55;
          alb = mix(mix(uPageCol * .93, flatC, keep), alb, up);
        }
        alb = mix(alb, alb * vec3(.56, .55, .66), line * .7);
        vec3 n;
        vec3 col = paperLight(alb * .8, vView, shadow, ao, n);
        float front = smoothstep(${(W+.5).toFixed(1)}, ${(W+3).toFixed(1)}, vRest.z);
        float hl = max(dot(n, normalize(vHole)), 0.) / (1. + dot(vHole, vHole) / 1500.) * uGlow * front;
        col += alb * uWarm * hl * 1.5 + emis;
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}const ue=i=>{const u=Math.abs(i);return p-2*Math.exp(-((u/5)**2))-Math.max(u-136,0)**2/144*1.6};function Te(i,u,c){i.still();const g=[0,1,2,3.5,5,7,10,15,25,50,80,110,136,139,142,145,$],M=[...g.slice(1).reverse().map(o=>-o),...g],w=[-G,-90,-30,30,90,G];for(let o=0;o<M.length-1;o++){const f=M[o],r=M[o+1],n=ue(f),a=ue(r);for(let e=0;e<w.length-1;e++){const t=w[e],s=w[e+1];i.quad([f,n,s],[r,a,s],[r,a,t],[f,n,t],c.page,4,{tint:.012,noEdge:!0})}for(const e of[-G,G])i.quad([f,1.4,e],[r,1.4,e],[r,a,e],[f,n,e],c.edge,6,{tint:.02,uv:[f,1.4,r,1.4,r,a,f,n],size:[0,1]})}for(const o of[-1,1]){const f=o*$,r=ue(f);i.quad([f,1.4,-G],[f,1.4,G],[f,r,G],[f,r,-G],c.edge,6,{tint:.02,uv:[0,1.4,300,1.4,300,r,0,r],size:[0,1]})}const l=$+6,v=G+6;i.quad([-l,1.4,v],[l,1.4,v],[l,1.4,-v],[-l,1.4,-v],c.cover,5,{tint:.02});const y=6,A=[c.edge,c.page,c.walls[1],c.page,c.edge,c.page];for(let o=0;o<y;o++){const f=.6*(y-o),r=1.4+(o+1)*.8,n=r-.8,a=A[o];for(const e of[-1,1]){const t=e*(G+f-.6),s=e*(G+f);i.quad([-$-f,r,s],[$+f,r,s],[$+f,r,t],[-$-f,r,t],a,0,{tint:.03}),i.quad([-$-f,n,s],[$+f,n,s],[$+f,r,s],[-$-f,r,s],c.edge,6,{tint:.02,uv:[0,n,300,n,300,r,0,r],size:[0,1]})}for(const e of[-1,1]){const t=e*($+f-.6),s=e*($+f),d=G+f-.6;i.quad([s,r,-d],[s,r,d],[t,r,d],[t,r,-d],a,0,{tint:.03}),i.quad([s,n,-d-.6],[s,n,d+.6],[s,r,d+.6],[s,r,-d-.6],c.edge,6,{tint:.02,uv:[0,n,300,n,300,r,0,r],size:[0,1]})}}{i.walls(-l,l,-v,v,0,2.5,c.coverDark,5,{tint:.02,noEdge:!0}),i.walls(-l+1.5,l-1.5,-v+1.5,v-1.5,1.4,2.5,c.cover,5,{tint:.02,noEdge:!0});for(const r of[-1,1])i.quad([-l,2.5,r*v],[l,2.5,r*v],[l,2.5,r*(v-1.5)],[-l,2.5,r*(v-1.5)],c.coverLight,5,{tint:.03});for(const r of[-1,1])i.quad([r*l,2.5,-v+1.5],[r*l,2.5,v-1.5],[r*(l-1.5),2.5,v-1.5],[r*(l-1.5),2.5,-v+1.5],c.coverLight,5,{tint:.03})}for(const o of[-1,1])i.quad([o*($+2.2),1.45,v-2],[o*($+3),1.45,v-2],[o*($+3),1.45,-v+2],[o*($+2.2),1.45,-v+2],c.page,0,{noEdge:!0});const S=7;for(const o of[-1,1])for(const f of[-1,1]){if(u()<.2)continue;const r=u.range(6,13),n=u.range(3,8),a=u()*20;i.still(u.range(.5,1.1),a);const e=(t,s)=>{const d=112+t/S*36,h=112+s/S*38,x=B(((d-112)/36+(h-112)/38-.75)/1.25,0,1),k=x*x;return{p:[o*(d-n*k),ue(d)+.06+r*k+1.2*x,f*(h-n*.8*k)],w:x*10,v:h}};for(let t=0;t<S;t++)for(let s=0;s<S;s++){const d=e(t,s),h=e(t+1,s),x=e(t+1,s+1),k=e(t,s+1);x.w<=0||i.quad(d.p,h.p,x.p,k.p,c.page,7,{tint:.015,uv:[d.w,d.v,h.w,h.v,x.w,x.v,k.w,k.v],size:[0,10]})}}i.still();const m=u.range(-9,9),q=u.range(-1,1),b=[[m,p-.4,138],[m+.3,p-.2,147],[m+.5,p-.6,151.5],[m+1,2.9,156.4],[m+2,.2,162],[m+5*q,.2,171],[m+2*q,.2,180],[m+7*q,.2,189],[m+6*q,.2,196]];for(let o=0;o<b.length-1;o++){const f=b[o],r=b[o+1],n=1.7;o===b.length-2?(i.tri([f[0]-n,f[1],f[2]],[f[0],f[1],f[2]+2.5],[r[0]-n,r[1],r[2]],c.red,0),i.tri([f[0]+n,f[1],f[2]],[r[0]+n,r[1],r[2]],[f[0],f[1],f[2]+2.5],c.red,0),i.tri([f[0]-n,f[1],f[2]],[f[0]+n,f[1],f[2]],[f[0],f[1],f[2]+2.5],c.red,0,{noEdge:!0})):i.quad([f[0]-n,f[1],f[2]],[f[0]+n,f[1],f[2]],[r[0]+n,r[1],r[2]],[r[0]-n,r[1],r[2]],c.red,0,{tint:.04})}}function me(i,u,c,g,M,w,l,v,y,A,S){const m=u.pick(c.walls),q=u()<.12?c.red:u()<.16?c.blueRoof:u.pick(c.roofs),b=p,o=p+y,f=w-M,r=v-l,n=.55;i.walls(M,w,l,v,b,o,m,1),i.walls(M-.18,w+.18,l-.18,v+.18,o-1,o-.5,c.walls[0],0,{noEdge:!0,tint:.02}),i.walls(M-.12,w+.12,l-.12,v+.12,b,b+.7,c.walls[2],0,{noEdge:!0,tint:.03});let a=y;if(A===0||A===1){const t=(A===0?f:r)*u.range(.42,.62);if(a=y+t,A===0){const s=(M+w)/2;i.quad([M-n,o-.3,v+n],[M-n,o-.3,l-n],[s,o+t,l-n],[s,o+t,v+n],q,3),i.quad([w+n,o-.3,l-n],[w+n,o-.3,v+n],[s,o+t,v+n],[s,o+t,l-n],q,3),i.tri([M,o,v],[w,o,v],[s,o+t,v],m,0),i.tri([w,o,l],[M,o,l],[s,o+t,l],m,0)}else{const s=(l+v)/2;i.quad([M-n,o-.3,v+n],[w+n,o-.3,v+n],[w+n,o+t,s],[M-n,o+t,s],q,3),i.quad([w+n,o-.3,l-n],[M-n,o-.3,l-n],[M-n,o+t,s],[w+n,o+t,s],q,3),i.tri([w,o,v],[w,o,l],[w,o+t,s],m,0),i.tri([M,o,l],[M,o,v],[M,o+t,s],m,0)}}else if(A===2){const t=Math.min(f,r)*u.range(.9,1.5),s=(M+w)/2,d=(l+v)/2;a=y+t;const h=[M-n,o-.2,v+n],x=[w+n,o-.2,v+n],k=[w+n,o-.2,l-n],P=[M-n,o-.2,l-n],T=[s,o+t,d];i.tri(h,x,T,q,3),i.tri(x,k,T,q,3),i.tri(k,P,T,q,3),i.tri(P,h,T,q,3)}else if(A===3){const t=S>0?M:w,s=r*.22,d=r*.36,h=(l+v)/2;a=y+4.4,i.quad([M,o-.5,v],[w,o-.5,v],[w,o-.5,l],[M,o-.5,l],q,0),i.quad([t,o,l],[t,o,v],[t,o+1.5,v],[t,o+1.5,l],m,0),i.quad([t,o+1.5,h-d],[t,o+1.5,h+d],[t,o+3,h+d],[t,o+3,h-d],m,0),i.quad([t,o+3,h-s],[t,o+3,h+s],[t,o+4.4,h+s],[t,o+4.4,h-s],m,0)}else{const t=u.range(2.6,3.8),s=Math.min(f,r)*.22;a=y+t;const d=[[M-n,v+n],[w+n,v+n],[w+n,l-n],[M-n,l-n]],h=[[M+s,v-s],[w-s,v-s],[w-s,l+s],[M+s,l+s]];for(let x=0;x<4;x++){const k=(x+1)%4;i.quad([d[x][0],o-.2,d[x][1]],[d[k][0],o-.2,d[k][1]],[h[k][0],o+t,h[k][1]],[h[x][0],o+t,h[x][1]],q,3)}i.quad([h[0][0],o+t,h[0][1]],[h[1][0],o+t,h[1][1]],[h[2][0],o+t,h[2][1]],[h[3][0],o+t,h[3][1]],q,0)}if(A!==2&&u()<.6){const t=U(M,w,u.range(.25,.75)),s=U(l,v,u.range(.2,.8)),d=a-y+u.range(.8,1.8);i.walls(t-.6,t+.6,s-.6,s+.6,o,o+d,c.walls[2],0)}{const t=S>0?M-.06:w+.06,s=U(l,v,u.range(.3,.7)),d=S>0?-1:1;i.quad([t,b,s-.8],[t,b,s+.8],[t,b+2.5,s+.8],[t,b+2.5,s-.8],c.ink,0,{noEdge:!0}),i.quad([t,b+2.7,s-1.3],[t,b+2.7,s+1.3],[t+d*1.3,b+2.1,s+1.3],[t+d*1.3,b+2.1,s-1.3],u()<.25?c.red:c.roofs[0],0)}const e=U(M,w,.5);return i.quad([e-1,b,l-y*.4],[e+1,b,l-y*.4],[e+1,b+y*.6,l],[e-1,b+y*.6,l],c.walls[1],0),g.push({x0:M,x1:w,z0:l,z1:v,h:y+(a-y)*.5}),a}const pe=[-88,-44,0,44,88],fe=[44,0],N={x:64,z:-80,r:22};async function Fe(i,u,c,g,M,w,l,v){const y=(a,e)=>O(a,e)+u.range(-.015,.015),A=(a,e)=>Math.abs(a-w*N.x)<N.r+6&&Math.abs(e-N.z)<N.r+6||Math.hypot(a-H.x,e-H.z)<17;let S=0;for(const a of[-1,1]){let e=Q+3.6;for(let t=0;t<6;t++){const s=u.range(10,12.5),d=[-121,...pe,121];for(let h=0;h<d.length-1;h++){const x=d[h]+(h===0?0:3.6);let P=d[h+1]-(h===d.length-2?0:3.6)-u.range(0,1.5);for(;P-7>x;){let T=u.range(7.5,13.5);P-T-7<x&&(T=P-x);const R=P,I=P-T;P=I-(u()<.2?u.range(1.5,3):.35);const F=s-u.range(0,2.2),E=a>0?e:-(e+F),_=E+F,V=(E+_)/2,Y=(I+R)/2;if(A(V,Y)||u()<.05)continue;let K=u.pick([0,0,0,1,1,2,3,4,4]),D=7.5+t*2.1+u.range(0,5.5);K===2&&(D+=u.range(3,9));const L=Math.min(l(V,Y),l(E,I),l(E,R),l(_,I),l(_,R))-p;if(L<D+16){if(L<10.5)continue;D+9>L?(K=u()<.3?3:4,D=Math.min(D,L-6)):K===2&&(K=0)}const j=y(V,Y);i.fold(0,1,j);const oe=me(i,u,c,g,E,_,I,R,D,K,a);S++;const se=V,Z=Y,ge=K===3?p+D-.45:p+oe,ye=K===0?[se,I+.8,se,R-.8]:K===1?[E+.8,Z,_-.8,Z]:K===2?[se,Z,se,Z]:K===3?[E+2,Z,_-2,Z]:[se-1.5,Z,se+1.5,Z];M.push({a:ye,y:ge,p:j})}}e+=s+(t%2===1?7:4.2),await v()}}for(const a of[-1,1])for(let e=124;e>-124;e-=u.range(9,12.5)){if(fe.some(k=>Math.abs(e-k)<5.5))continue;const t=a*(Q+1.3),s=u.range(6,10.5),d=s*u.range(.3,.42),h=u.int(0,2),x=u()<.12?c.red:u.pick(c.walls);if(i.fold(0,1,y(t,e)),i.quad([t-.22,p,e],[t+.22,p,e],[t+.22,p+s*.45,e],[t-.22,p+s*.45,e],c.walls[2],10,{noEdge:!0}),h===0)i.tri([t-d,p+s*.3,e],[t+d,p+s*.3,e],[t,p+s*.75,e],x,10),i.tri([t-d*.75,p+s*.55,e+.05],[t+d*.75,p+s*.55,e+.05],[t,p+s,e+.05],x,10);else{const k=h===1?5:8,P=h===1?Math.PI:Math.PI*2,T=p+s*(h===1?.42:.68),R=h===1?d*1.5:d*1.05;for(let I=0;I<k;I++){const F=I/k*P,E=(I+1)/k*P;i.tri([t+Math.cos(F)*R,T+Math.sin(F)*R,e],[t+Math.cos(E)*R,T+Math.sin(E)*R,e],[t,T,e],x,10,{tint:.1})}}g.push({x0:t-d,x1:t+d,z0:e-.2,z1:e+.2,h:s,y0:s*.3})}await v();for(const a of[-1,1]){const e=a*(Q+1.3);let t=0;for(let s=122;s>-120;s-=12){const d=s-12;if(fe.some(x=>x<s+2&&x>d-2))continue;i.fold(0,1,y(e,(s+d)/2));const h=x=>p+8.2-Math.sin(x*Math.PI)*1.5;i.quad([e,h(0)-.05,s],[e,h(.5)-.05,s-6],[e,h(.5)+.06,s-6],[e,h(0)+.06,s],c.ink,0,{noEdge:!0}),i.quad([e,h(.5)-.05,s-6],[e,h(1)-.05,d],[e,h(1)+.06,d],[e,h(.5)+.06,s-6],c.ink,0,{noEdge:!0});for(const x of[s,d])i.quad([e-.12,p,x],[e+.12,p,x],[e+.12,p+8.3,x],[e-.12,p+8.3,x],c.walls[2],0,{noEdge:!0});for(let x=0;x<8;x++,t++){const k=(x+.12)/8,P=(x+.88)/8,T=(x+.5)/8,R=t%4===0?c.red:t%4===2?c.walls[2]:c.walls[0];i.tri([e,h(k),s-k*12],[e,h(P),s-P*12],[e-a*.3,h(T)-2.3,s-T*12],R,9,{tint:.04})}}}for(const a of[-1,1])for(let e=0;e<2;e++){const t=a*(e?133.5:124.5),s=e?c.far:c.walls[1],d=[];for(let F=-112;F<112;F+=u.range(14,30))d.push({z:F+u.range(-4,4),h:e?u.range(22,43):u.range(9,17),s:e?u.range(1.1,1.9):u.range(.5,.9)});const h=F=>{let E=e?9:4;for(const _ of d)E=Math.max(E,_.h-_.s*Math.abs(F-_.z));return E*ce(0,10,110-Math.abs(F))+1.5},x=F=>a===1?U(1,e?.4:.7,ce(-110,-40,F)):1,k=F=>Math.max(1.5,Math.min(h(F)*x(F),l(t,F,70)-p-2)),P=[s,s,s,c.far2,c.farRed],T=[-108,...d.map(F=>B(F.z,-104,104)),108];for(let F=-100;F<108;F+=9)T.push(F);T.sort((F,E)=>F-E);let R=-72,I=y(t,-90);i.fold(0,1,I);for(let F=0;F<T.length-1;F++){const E=T[F],_=T[F+1];if(_-E<.3)continue;E>=R&&(R+=36,I=y(t,E+18),i.fold(0,1,I),i.quad([t-a,p,E-8],[t-a,p,E-5],[t,p+8,E+1],[t,p+8,E+.2],c.walls[1],0));const V=k(E),Y=k(_);if(i.quad([t,p,E],[t,p,_],[t,p+Y,_],[t,p+V,E],e?P[F*7%5]:s,0,{tint:.045}),e){const K=.3+.12*Math.sin(E*.21),D=.3+.12*Math.sin(_*.21);i.quad([t-a*.25,p,E],[t-a*.25,p,_],[t-a*.25,p+Y*D,_],[t-a*.25,p+V*K,E],c.walls[2],0,{noEdge:!0,tint:.03}),i.quad([t-a*.3,p+V*.72,E],[t-a*.3,p+Y*.72,_],[t-a*.3,p+Y,_],[t-a*.3,p+V,E],c.page,0,{noEdge:!0,tint:.02})}g.push({x0:t-.3,x1:t+.3,z0:E,z1:_,h:(V+Y)/2})}await v()}for(const a of fe){i.fold(0,1,y(0,a));const e=x=>Math.abs(x)<14?p+4+17*Math.sqrt(1-(x/14)**2):p,t=x=>p+25.6-1.6*(x/20)**2,s=[];for(let x=0;x<=20;x++){const k=x/20;s.push(-14*Math.cos(k*Math.PI))}const d=[-20.5,-17,...s,17,20.5],h=c.walls[0];for(let x=0;x<d.length-1;x++){const k=d[x],P=d[x+1],T=Math.abs((k+P)/2)<14,R=T?e(k):p,I=T?e(P):p;for(const F of[-2.2,2.2])i.quad([k,R,a+F],[P,I,a+F],[P,t(P),a+F],[k,t(k),a+F],h,0,{noEdge:!!T,tint:.03});i.quad([k,t(k)-1.1,a-2.2],[P,t(P)-1.1,a-2.2],[P,t(P)-1.1,a+2.2],[k,t(k)-1.1,a+2.2],c.walls[1],0,{noEdge:!0}),T&&i.quad([k,R,a-2.2],[P,I,a-2.2],[P,I,a+2.2],[k,R,a+2.2],c.walls[2],0,{noEdge:!0,tint:.03})}for(const x of[-1,1])for(const k of[-2.45,2.45]){const P=x>0?14.9:-19.9;i.quad([P,p+1.5,a+k],[P+5,p+1.5,a+k],[P+5,p+19,a+k],[P,p+19,a+k],h,1)}for(const x of[-2.45,2.45])i.tri([-1.6,p+25.4,a+x],[1.6,p+25.4,a+x],[0,p+22.2,a+x],c.red,0);g.push({x0:-20.5,x1:-14,z0:a-2.2,z1:a+2.2,h:24},{x0:14,x1:20.5,z0:a-2.2,z1:a+2.2,h:24},{x0:-14,x1:14,z0:a-2.2,z1:a+2.2,h:25,y0:18}),M.push({a:[-13,a,13,a],y:p+25.4,p:O(0,a)})}const m=(a,e,t,s,d=0)=>[a+d,p+s,e+t],q=(a,e,t,s,d,h)=>{const x=Math.min(t*u.range(.3,.42),h);if(i.fold(0,1,O(a,e)+u.range(-.012,.012)),i.quad(m(a,e,-.22,0),m(a,e,.22,0),m(a,e,.22,t*.45),m(a,e,-.22,t*.45),c.walls[2],10,{noEdge:!0}),s===0)i.tri(m(a,e,-x,t*.3),m(a,e,x,t*.3),m(a,e,0,t*.75),d,10),i.tri(m(a,e,-x*.75,t*.55,.05),m(a,e,x*.75,t*.55,.05),m(a,e,0,t,.05),d,10);else{const k=s===1?5:8,P=s===1?Math.PI:Math.PI*2,T=t*(s===1?.42:.68),R=s===1?x*1.5:x*1.05;for(let I=0;I<k;I++){const F=I/k*P,E=(I+1)/k*P;i.tri(m(a,e,Math.cos(F)*R,T+Math.sin(F)*R),m(a,e,Math.cos(E)*R,T+Math.sin(E)*R),m(a,e,0,T),d,10,{tint:.1})}}g.push({x0:a-.2,x1:a+.2,z0:e-x,z1:e+x,h:t,y0:t*.3})},b=()=>{const a=u();return a<.17?c.red:a<.27?c.blue:u.pick(c.walls)};await v();const o=(a,e,t)=>!A(a,e)&&l(a,e)-p-2>t;for(const a of[-1,1]){for(const e of pe)for(let t=Q+9;t<118;t+=u.range(9,13)){const s=a*t,d=e+u.range(-1,1),h=u.range(6,9.5);o(s,d,h)&&q(s,d,h,u.int(0,2),b(),2.3)}for(let e=104;e>-106;e-=u.range(8,11.5)){const t=a*139.6,s=u.range(5.5,8.5);o(t,e,s)&&q(t,e,s,u.int(0,2),b(),3.2)}await v()}const f=(a,e,t,s)=>{i.fold(0,1,O(a,e)),i.quad(m(a,e,-.95,0),m(a,e,.95,0),m(a,e,.36,t*.66),m(a,e,-.36,t*.66),s,11,{tint:.03}),i.quad(m(a,e,-1.5,t*.47,.04),m(a,e,1.5,t*.47,.04),m(a,e,1.5,t*.6,.04),m(a,e,-1.5,t*.6,.04),s,11,{noEdge:!0,tint:.03});const d=t*.82,h=t*.18;i.quad(m(a,e,-h,d),m(a,e,0,d-h),m(a,e,h,d),m(a,e,0,d+h),s,11,{tint:.03})},r=(a,e,t,s)=>{for(let d=e;d>t;d-=3){const h=u();o(a,d,s)&&f(a,d,s,h<.17?c.red:h<.27?c.blue:c.walls[0])}g.push({x0:a-.2,x1:a+.2,z0:t,z1:e,h:s*.6})},n=[-121,...pe,121];for(const a of[-1,1]){for(let e=0;e<n.length-1;e++)r(a*(Q-1.3),n[e+1]-6,n[e]+6,u.range(4.2,5.2));await v();for(const[e,t]of[[102,40],[28,-32],[-44,-104]])r(a*143.8,e,t,u.range(4.6,5.6))}return S}const we=Math.max(J,O(H.x,H.z)-.085);function Ee(i,u,c,g,M){const{x:w,z:l}=H,v=we,y=8,A=Math.PI/8;i.fold(0,1,v);const S=u.int(5,7),m=55,q=u()<.6,b=u.range(8.6,10),o=u.range(3.8,4.6);i.ring(w,l,b+3,p,b+1.4,p+2.6,y,c.walls[2],0,A),i.ring(w,l,b+1.4,p+2.6,b+.2,p+2.6,y,c.walls[1],0,A,{noEdge:!0});let f=p+2.6;for(let n=0;n<S;n++){const a=(m-2.6)/S*U(1.12,.88,n/(S-1)),e=U(b,o,n/S),t=U(b,o,(n+.8)/S);i.ring(w,l,e,f,t,f+a,y,n%2?c.walls[1]:c.walls[0],1,A);const s=f+a,d=q?3.4-n*.2:1.6;if(i.ring(w,l,t+d,s-(q?1.5:.5),t*.9,s+(q?1.3:.6),y,n===S-1?c.red:c.roofs[n%c.roofs.length],3,A),i.ring(w,l,t+d,s-(q?1.5:.5),t+.1,s-(q?.2:.4),y,c.walls[2],0,A,{noEdge:!0}),q)for(let x=0;x<y;x++){const k=A+x/y*Math.PI*2,P=Math.cos(k),T=Math.sin(k),R=t+d;i.tri([w+P*(R-1.3)-T*.5,s-1.2,l+T*(R-1.3)+P*.5],[w+P*(R-1.3)+T*.5,s-1.2,l+T*(R-1.3)-P*.5],[w+P*(R+1.1),s+.5,l+T*(R+1.1)],c.walls[0],0)}const h=t+d*.6;M.push({a:[w-h,l+h,w+h,l+h],y:s-.4,p:v,w:3},{a:[w-h,l-h,w+h,l-h],y:s-.4,p:v,w:3},{a:[w-h,l-h,w-h,l+h],y:s-.4,p:v,w:3},{a:[w+h,l-h,w+h,l+h],y:s-.4,p:v,w:3}),f=s+(q?1.3:.6)}const r=p+H.h;i.ring(w,l,o+1.6,f-.6,o*.7,f+1.4,y,c.red,3,A),i.ring(w,l,o*.75,f+1.2,0,r,y,c.red,3,A);for(let n=0;n<4;n++){const a=n/4*Math.PI*2+.3,e=a+1.1;i.tri([w,r+2.5,l],[w+Math.cos(a)*4.2,r+2.5+Math.sin(a)*4.2,l],[w+Math.cos(e)*2.1,r+2.5+Math.sin(e)*2.1,l],n%2?c.walls[0]:c.red,0)}i.quad([w-.15,r-2,l],[w+.15,r-2,l],[w+.15,r+2.5,l],[w-.15,r+2.5,l],c.walls[2],0,{noEdge:!0});for(const n of[-1,1])i.quad([w-1.6,p,l+n*27],[w+1.6,p,l+n*27],[w+1.6,p+30,l+n*6.6],[w-1.6,p+30,l+n*6.6],c.walls[1],0),i.quad([w-1.6,p,l+n*27],[w-1.6,p,l+n*21],[w-1.6,p+24,l+n*9],[w-1.6,p+30,l+n*6.6],c.walls[2],0,{noEdge:!0}),g.push({x0:w-1.6,x1:w+1.6,z0:l+n*14,z1:l+n*16,h:16,y0:12});g.push({x0:w-b,x1:w+b,z0:l-b,z1:l+b,h:20},{x0:w-6.5,x1:w+6.5,z0:l-6.5,z1:l+6.5,h:62,y0:18})}function Re(i,u,c,g,M,w){const l=w*N.x,v=N.z,y=N.r,A=11,S=(e,t,s,d,h,x)=>{for(let k=0;k<x;k++){if(k%2)continue;const P=k/x,T=(k+1)/x;i.quad([U(e,s,P),h,U(t,d,P)],[U(e,s,T),h,U(t,d,T)],[U(e,s,T),h+1.7,U(t,d,T)],[U(e,s,P),h+1.7,U(t,d,P)],c.walls[0],0)}},m=[[l-y,v+y],[l+y,v+y],[l+y,v-y],[l-y,v-y]];for(let e=0;e<4;e++){const t=m[e],s=m[(e+1)%4],d=O((t[0]+s[0])/2,(t[1]+s[1])/2);i.fold(0,1,d),i.quad([t[0],p,t[1]],[s[0],p,s[1]],[s[0],p+A,s[1]],[t[0],p+A,t[1]],c.walls[1],0),S(t[0],t[1],s[0],s[1],p+A,17),M.push({a:[t[0],t[1],s[0],s[1]],y:p+A+1.7,p:d}),g.push({x0:Math.min(t[0],s[0])-.3,x1:Math.max(t[0],s[0])+.3,z0:Math.min(t[1],s[1])-.3,z1:Math.max(t[1],s[1])+.3,h:A})}for(let e=0;e<4;e++){const[t,s]=m[e],d=u.range(17,23),h=4.6,x=O(t,s);i.fold(0,1,x),i.ring(t,s,h,p,h*.92,p+d,8,c.walls[0],1),i.ring(t,s,h*.92+.9,p+d+1.2,h*.92,p+d-.4,8,c.walls[1],0),i.ring(t,s,h+1.3,p+d+.9,0,p+d+10,8,e===0||u()<.3?c.red:c.blueRoof,3),i.quad([t-.1,p+d+10,s],[t+.1,p+d+10,s],[t+.1,p+d+14,s],[t-.1,p+d+10+4,s],c.walls[2],0,{noEdge:!0}),i.tri([t,p+d+14,s],[t,p+d+12.2,s],[t+3.2,p+d+13.1,s],c.red,0),g.push({x0:t-h,x1:t+h,z0:s-h,z1:s+h,h:d+4})}const q=9,b=8,o=u.range(24,30),f=O(l,v);i.fold(0,1,f),i.walls(l-q,l+q,v-b,v+b,p,p+o,c.walls[0],1);const r=[[l-q,v+b],[l+q,v+b],[l+q,v-b],[l-q,v-b]];for(let e=0;e<4;e++)S(r[e][0],r[e][1],r[(e+1)%4][0],r[(e+1)%4][1],p+o,9);i.quad([l-q,p+o-.6,v+b],[l+q,p+o-.6,v+b],[l+q,p+o-.6,v-b],[l-q,p+o-.6,v-b],c.walls[2],0),i.ring(l,v,3.6,p+o-.6,3.3,p+o+9,8,c.walls[1],1),i.ring(l,v,5,p+o+8.6,0,p+o+19,8,c.red,3),i.tri([l,p+o+23,v],[l,p+o+20.6,v],[l+4,p+o+21.8,v],c.red,0),i.quad([l-.1,p+o+19,v],[l+.1,p+o+19,v],[l+.1,p+o+23,v],[l-.1,p+o+23,v],c.walls[2],0,{noEdge:!0}),i.quad([l-1.5,p,v+b+16],[l+1.5,p,v+b+16],[l+1.5,p+17,v+b],[l-1.5,p+17,v+b],c.walls[1],0),M.push({a:[l-q,v+b,l+q,v+b],y:p+o+1.7,p:f,w:2},{a:[l-q,v-b,l+q,v-b],y:p+o+1.7,p:f,w:2}),g.push({x0:l-q,x1:l+q,z0:v-b,z1:v+b,h:o+5});const n=l-w*y,a=O(n,v);i.fold(0,1,a),me(i,u,c,g,n-4.5,n+4.5,v-5,v+5,15,0,w)}const ae=.02,C=i=>W-5*(i/ee)**2;function Ie(i,u,c,g,M){i.fold(0,1,ae);const w=X-p,l=ee,v=ie,y=[];for(let r=0;r<56;r++)y.push(r/56*Math.PI*2);for(const[r,n]of[[l,v-w],[-l,v-w],[-l,-w],[l,-w]])y.push((Math.atan2(n,r)+Math.PI*2)%(Math.PI*2));y.sort((r,n)=>r-n);const A=r=>{const n=Math.cos(r),a=Math.sin(r);let e=1e9;return n>1e-6&&(e=Math.min(e,l/n)),n<-1e-6&&(e=Math.min(e,-l/n)),a>1e-6&&(e=Math.min(e,(v-w)/a)),a<-1e-6&&(e=Math.min(e,-w/a)),e},S=5,m=(r,n)=>{const a=A(r),e=U(te,a,Math.pow(n/S,1.6));return[Math.cos(r)*e,p+w+Math.sin(r)*e,C(Math.cos(r)*e)]},q=r=>[r[0]+l,r[1]-p];for(let r=0;r<y.length;r++){const n=y[r],a=r+1<y.length?y[r+1]:y[0]+Math.PI*2;if(!(a-n<1e-4))for(let e=0;e<S;e++){const t=m(n,e),s=m(a,e),d=m(a,e+1),h=m(n,e+1);i.quad(t,s,d,h,c.page,2,{tint:.008,uv:[...q(t),...q(s),...q(d),...q(h)],size:[2*l,v]})}}const b=(r,n,a,e,t,s,d)=>{i.fold(0,1,ae);const h=(x,k,P)=>{const T=Math.cos(x)*k;return[T,p+w+Math.sin(x)*k,C(T)+P]};i.tri(h(r-e,n,t),h(r+e,n,t),h(r,a,s),d,12,{tint:.06})},o=18,f=u()*.3;for(let r=0;r<o;r++){const n=f+r/o*Math.PI*2;b(n+Math.PI/o,12.3,17.4+r%2*1.8,.08,.3,1.5,c.gold),b(n,12.1,15.4,.13,.5,2.2,r%6===3?c.walls[0]:c.red)}i.fold(0,1,ae);for(const r of[-1,1]){const n=r*31,a=C(n)-.2,e=C(n+r*5)-.2;i.tri([n,p,a],[n,p,a-13],[n,p+40,a],c.walls[1],0),i.quad([n,p,a-13],[n+r*5,p,e-13],[n+r*5,p+40,e],[n,p+40,a],c.walls[2],0)}M.push({a:[-l+3,C(l-3),-14,C(14)],y:p+v,p:ae,w:2.5},{a:[14,C(14),l-3,C(l-3)],y:p+v,p:ae,w:2.5}),g.push({x0:-l,x1:l,z0:W-.3,z1:W+.3,h:v})}function _e(i,u,c,g){const M=u.int(7,10);for(let w=0;w<M;w++){const l=w%2?1:-1,v=l*u.range(52,112),y=u.range(-70,105),A=v+u.range(-12,12),S=y-u.range(8,22),m=p+u.range(46,72),q=u.pick([c.red,c.red,c.blue,c.walls[0],c.walls[0],c.walls[1]]),b=u.range(2.4,3.2),o=b*1.5;if(g(A,S,34)<1e3||g(v,y,34)<1e3||g((v+A)/2,(y+S)/2,34)<1e3)continue;i.fold(0,1,O(v,y)+.03),i.quad([A-b,m,S],[A,m-o*1.2,S],[A+b,m,S],[A,m+o*.8,S],q,8,{tint:.03}),i.quad([A-.12,m-o*1.2,S+.05],[A+.12,m-o*1.2,S+.05],[A+.12,m+o*.8,S+.05],[A-.12,m+o*.8,S+.05],c.ink,8,{noEdge:!0});for(let n=0;n<5;n++){const a=m-o*1.2-1.6-n*2.1,e=A+Math.sin(n*1.3+w)*.9;i.tri([e-.9,a+.5,S],[e+.9,a-.5,S],[e+.9,a+.5,S],n%2?c.walls[0]:q,8),i.tri([e-.9,a+.5,S],[e-.9,a-.5,S],[e+.9,a-.5,S],n%2?q:c.walls[0],8,{noEdge:!0})}const f=6;let r=[v,p+14,y];for(let n=1;n<=f;n++){const a=n/f,e=Math.sin(a*Math.PI)*5,t=[U(v,A,a),U(p+14,m-o*.2,a)-e,U(y,S,a)+.02];i.quad([r[0]-.09,r[1],r[2]],[r[0]+.09,r[1],r[2]],[t[0]+.09,t[1],t[2]],[t[0]-.09,t[1],t[2]],c.ink,8,{noEdge:!0}),r=t}}}function Ve(i,u){if(typeof document>"u"){const m=new z.DataTexture(new Uint8Array([0,0,0,255]),1,1);return m.needsUpdate=!0,m}const c=1024,g=document.createElement("canvas");g.width=g.height=c;const M=g.getContext("2d");M.fillStyle="#000",M.fillRect(0,0,c,c);const w=c/300,l=-u.x/Math.max(u.y,.2),v=-u.z/Math.max(u.y,.2);M.fillStyle="#fff";for(const m of i){const q=m.y0||0,b=Math.max(2,Math.ceil((m.h-q)/3));M.beginPath();for(let o=0;o<=b;o++){const f=U(q,m.h,o/b);M.rect((m.x0+l*f+150)*w,(m.z0+v*f+150)*w,(m.x1-m.x0)*w,(m.z1-m.z0)*w)}M.fill()}const y=document.createElement("canvas");y.width=y.height=c;const A=y.getContext("2d");try{A.filter="blur(3px)"}catch{}A.drawImage(g,0,0);const S=new z.CanvasTexture(y);return S.flipY=!1,S.generateMipmaps=!0,S.minFilter=z.LinearMipmapLinearFilter,S.anisotropy=4,S}const xe=3.927,be=2.75;function de(i){const u=xe-(1-i)*be*Math.PI*2,c=U(30,12,i*i*(3-2*i));return new z.Vector3(H.x+Math.cos(u)*c,p+U(12,H.h+16,i),H.z+Math.sin(u)*c)}function Le(){const i=[],u=[],c=(b,o=0,f=0,r=1)=>{i.push(b[0],b[1],b[2]),u.push(o,f,r)},g=(b,o,f,r=1,n=[0,0],a=[0,0],e=[0,0])=>{c(b,n[0],n[1],r),c(o,a[0],a[1],r),c(f,e[0],e[1],r)},M=[0,0,.55],w=[0,0,-.55],l=[0,-.3,0],v=[0,.2,0],y=[-.23,.05,0],A=[.23,.05,0];g(M,y,v,1),g(M,v,A,.96),g(w,v,y,.97),g(w,A,v,1),g(M,l,y,.9),g(M,A,l,.88),g(w,y,l,.9),g(w,l,A,.88);const S=[0,.82,1.1],m=[0,.56,1.46];g([-.08,.05,.36],S,[0,-.12,.52],.97),g([0,-.12,.52],S,[.08,.05,.36],.92),g(S,m,[-.05,.62,1.02],1),g(S,[.05,.62,1.02],m,.9);const q=[0,.78,-1.2];g([-.08,.05,-.36],[0,-.12,-.52],q,.95),g([0,-.12,-.52],[.08,.05,-.36],q,.9);for(const b of[-1,1]){const o=[b*.12,.12,.32],f=[b*.12,.12,-.3],r=[b*.85,.2,.44],n=[b*.85,.2,-.18],a=[b*1.78,.12,0],e=[b*1.42,.17,.32];g(o,r,n,1,[b,0],[b,1],[b,1]),g(o,n,f,.95,[b,0],[b,1],[b,0]),g(r,e,n,.98,[b,1],[b,2],[b,1]),g(e,a,n,.93,[b,2],[b,2],[b,1])}return{P:i,W:u}}function Ue(i,u,c,g,M){const w=Le(),l=new z.InstancedBufferGeometry;l.setAttribute("position",new z.Float32BufferAttribute(w.P,3)),l.setAttribute("aWing",new z.Float32BufferAttribute(w.W,3));const v=[];let y=0;for(const f of c){const r=(f.a[0]+f.a[2])/2,n=(f.a[1]+f.a[3])/2,a=Math.hypot(f.a[2]-f.a[0],f.a[3]-f.a[1]);f.d=Math.hypot(r-H.x,n-H.z),y+=(f.w||1)*(a+3)*Math.exp(-f.d/75),v.push(y)}const A=new Float32Array(g*3),S=new Float32Array(g*3),m=new Float32Array(g*4),q=new Float32Array(g*3);for(let f=0;f<g;f++){const r=i()*y;let n=0,a=v.length-1;for(;n<a;){const x=n+a>>1;v[x]<r?n=x+1:a=x}const e=c[n],t=i();A.set([U(e.a[0],e.a[2],t),e.y+.36,U(e.a[1],e.a[3],t)],f*3),S.set([0,1,e.p],f*3),m.set([i(),B(((e.p-J)/le*ne-110)/220,0,.5)+i()*.1,i(),i()<M?1:0],f*4);let s,d,h;do s=i()*2-1,d=i()*2-1,h=i()*2-1;while(s*s+d*d+h*h>1);q.set([s,d,h],f*3)}l.setAttribute("iRoost",new z.InstancedBufferAttribute(A,3)),l.setAttribute("iFold",new z.InstancedBufferAttribute(S,3)),l.setAttribute("iSeed",new z.InstancedBufferAttribute(m,4)),l.setAttribute("iOff",new z.InstancedBufferAttribute(q,3)),l.instanceCount=g;const b=new z.ShaderMaterial({side:z.DoubleSide,fog:!0,uniforms:{...z.UniformsUtils.clone(z.UniformsLib.fog),uUnfold:u.uUnfold,uTime:u.uTime,uCrane:u.uCrane,uSize:u.uCraneSize,uTower:u.uTower,uB0:u.uB0,uB1:u.uB1,uB2:u.uB2,uB3:u.uB3,uLightDir:u.uLightDir,uSun:u.uSun,uAmbSky:u.uAmbSky,uAmbShade:u.uAmbShade,uWarm:u.uWarm,uRed:u.uCraneRed,uPaper:u.uPaper,uCloudT:u.uTime},vertexShader:`
      attribute vec3 aWing, iRoost, iFold, iOff; attribute vec4 iSeed;
      uniform float uCrane, uSize; uniform vec3 uTower, uB0, uB1, uB2, uB3;
      varying vec3 vView; varying float vRed, vShade;
      #include <fog_pars_vertex>
      ${re}
      vec3 spiral(float a){
        float ang = ${xe.toFixed(4)} - (1. - a) * ${(be*Math.PI*2).toFixed(4)}, r = mix(30., 12., smoothstep(0., 1., a));
        return uTower + vec3(cos(ang) * r, mix(12., ${(H.h+16).toFixed(1)}, a), sin(ang) * r);
      }
      vec3 pathQ(float w){
        if (w < .62) return spiral(w / .62);
        float t = (w - .62) / .38, s = 1. - t;
        return s * s * s * uB0 + 3. * s * s * t * uB1 + 3. * s * t * t * uB2 + t * t * t * uB3;
      }
      vec2 rot(vec2 v, float a){ float c = cos(a), s = sin(a); return vec2(c * v.x - s * v.y, s * v.x + c * v.y); }
      void main(){
        float e = clamp(springE(iFold.z), 0., 1.), rnd = iSeed.z;
        float roofUp = smoothstep(0., .6, clamp(springE(iFold.z + .03 + .07 * fract(rnd * 13.7)), 0., 1.));
        float take = smoothstep(iSeed.y, iSeed.y + .16, uCrane) * roofUp, gate = smoothstep(.4, .8, uCrane);
        float wf = fract(iSeed.x + uTime * .03 * (.85 + .3 * rnd));
        float w = wf * mix(.62, 1., gate);
        float sp = mix(7., 2.3, smoothstep(.72, .93, w));
        vec3 o = (iOff + .35 * vec3(sin(uTime * .7 + rnd * 31.), sin(uTime * .9 + rnd * 17.), cos(uTime * .6 + rnd * 23.))) * sp;
        vec3 q0 = pathQ(w) + o, q1 = pathQ(w + .004) + o;
        vec3 pos = mix(popup(iRoost, iFold.xy, e), q0, take) + vec3(0., sin(take * 3.1416) * 5., 0.);
        float yaw = rnd * 6.2832;
        vec3 fwd = normalize(mix(vec3(sin(yaw), 0., cos(yaw)), normalize(q1 - q0), take));
        vec3 right = normalize(cross(vec3(0., 1., 0.), fwd)), up = cross(fwd, right);
        float fl = uTime * (6.5 + rnd * 2.5) + rnd * 50.;
        float a1 = mix(1.0, .12 + .78 * sin(fl), take), a2 = mix(.25, .5 * sin(fl - 1.1), take);
        vec3 p = position;
        if (aWing.y > .5) {
          float s = aWing.x; vec2 root = vec2(s * .12, .12), mid = vec2(s * .85, .2), q = p.xy;
          if (aWing.y > 1.5) q = mid + rot(q - mid, s * a2);
          p.xy = root + rot(q - root, s * a1);
        }
        float fade = mix(smoothstep(.55, 1., e), smoothstep(0., .03, wf) * (1. - smoothstep(.965, 1., wf)), take);
        float camD = length((modelViewMatrix * vec4(pos, 1.)).xyz);
        p *= uSize * (.8 + .45 * fract(rnd * 7.31)) * fade * smoothstep(8., 26., camD);
        vec4 mvPosition = modelViewMatrix * vec4(pos + right * p.x + up * p.y + fwd * p.z, 1.);
        vView = mvPosition.xyz; vRed = iSeed.w; vShade = aWing.z;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uRed, uPaper;
      varying vec3 vView; varying float vRed, vShade;
      #include <fog_pars_fragment>
      ${he}
      void main(){
        vec3 n, alb = mix(uPaper, uRed, vRed) * vShade * .82;
        gl_FragColor = vec4(paperLight(alb, vView, 1., 1., n), 1.);
        #include <fog_fragment>
      }`}),o=new z.Mesh(l,b);return o.frustumCulled=!1,o.name="paper-cranes",o}function He(i,u,c){const g=[],M=[],w=X,l=(m,q,b,o,f,r)=>{for(const[n,a,e]of[[m,0,0],[q,1,0],[b,1,1],[m,0,0],[b,1,1],[o,0,1]])g.push(n[0],n[1],n[2]),M.push(a,e,f,r)};if(c){const m=te+2;l([-m,w-m,W-.8],[m,w-m,W-.8],[m,w+m,W-.8],[-m,w+m,W-.8],0,0)}const v=16;for(let m=0;m<v;m++){const q=m/v*Math.PI*2+i.range(-.12,.12),b=i.range(.1,.19),o=i.range(55,120),f=i.range(.1,.24),r=te*.9,n=r+o*f,a=(e,t,s)=>[Math.cos(e)*t,w+Math.sin(e)*t,s];l(a(q-b,r,W+.4),a(q+b,r,W+.4),a(q+b*.8,n,W+o),a(q-b*.8,n,W+o),1,i()*30)}const y=new z.BufferGeometry;y.setAttribute("position",new z.Float32BufferAttribute(g,3)),y.setAttribute("aV",new z.Float32BufferAttribute(M,4));const A=new z.ShaderMaterial({side:z.DoubleSide,transparent:!0,depthWrite:!1,blending:z.AdditiveBlending,fog:!0,uniforms:{...z.UniformsUtils.clone(z.UniformsLib.fog),uWarm:u.uWarm,uGlow:u.uGlow,uTime:u.uTime,uUnfold:u.uUnfold},vertexShader:`
      attribute vec4 aV; varying vec4 vV;
      #include <fog_pars_vertex>
      ${re}
      void main(){ vV = aV; vec3 p = popup(position, vec2(0., 1.), springE(${ae.toFixed(3)}));
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uWarm; uniform float uGlow, uTime; varying vec4 vV;
      #include <fog_pars_fragment>
      void main(){
        float I;
        if (vV.z < .5) { float r = length(vV.xy * 2. - 1.) * ${((te+2)/te).toFixed(3)}; I = (1.6 + 1.1 * max(1. - r * r, 0.)) * (1. - smoothstep(.97, 1.03, r)); }
        else { float x = 1. - abs(vV.x * 2. - 1.); I = pow(1. - vV.y, 1.7) * smoothstep(0., .08, vV.y) * x * x * .3 * (.7 + .3 * sin(uTime * .8 + vV.w)); }
        vec3 col = mix(uWarm, vec3(1., .9, .72), .55) * I * uGlow;
        #ifdef USE_FOG
          #ifdef FOG_EXP2
            col *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
          #else
            col *= 1. - smoothstep(fogNear, fogFar, vFogDepth);
          #endif
        #endif
        gl_FragColor = vec4(col, 1.);
      }`}),S=new z.Mesh(y,A);return S.frustumCulled=!1,S.renderOrder=3,S.name="paper-glow",S}function We(i,u,c){const g=new Float32Array(c*3),M=new Float32Array(c*3);for(let y=0;y<c;y++)g.set([i.range(-75,75),i()*62,i.range(-128,136)],y*3),M.set([i(),i(),i()],y*3);const w=new z.BufferGeometry;w.setAttribute("position",new z.BufferAttribute(g,3)),w.setAttribute("aS",new z.BufferAttribute(M,3));const l=new z.ShaderMaterial({fog:!0,uniforms:{...z.UniformsUtils.clone(z.UniformsLib.fog),uUnfold:u.uUnfold,uTime:u.uTime,uViewH:u.uViewH,uPaper:u.uPaper,uRed:u.uRed,uBlue:u.uBlue,uSun:u.uSun,uAmbSky:u.uAmbSky},vertexShader:`
      attribute vec3 aS; uniform float uViewH; varying vec3 vS; varying float vA;
      #include <fog_pars_vertex>
      ${re}
      void main(){
        vec3 p = position;
        p.y = PY + .5 + mod(p.y - uTime * (1.1 + aS.x * 1.7), 62.);
        p.x += sin(uTime * .55 + aS.y * 40.) * 3.5; p.z += cos(uTime * .43 + aS.z * 40.) * 3.5;
        float e = clamp(springE(phaseAt(p.xz) + .06), 0., 1.);
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = clamp((.35 + .5 * aS.z) * e * projectionMatrix[1][1] * uViewH * .5 / max(-mvPosition.z, .1), 0., 40.);
        vS = aS; vA = e;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uPaper, uRed, uBlue, uSun, uAmbSky; uniform float uTime; varying vec3 vS; varying float vA;
      #include <fog_pars_fragment>
      void main(){
        if (vA < .02) discard;
        float a = uTime * (1.5 + vS.x * 3.) + vS.y * 60., c = cos(a), s = sin(a);
        vec2 q = gl_PointCoord - .5; q = vec2(c * q.x - s * q.y, s * q.x + c * q.y);
        float flip = sin(uTime * (2. + vS.z * 4.) + vS.x * 30.);
        if (abs(q.x) > .34 || abs(q.y) > .06 + .2 * abs(flip)) discard;
        vec3 alb = vS.y < .09 ? uRed : (vS.y < .14 ? uBlue : uPaper);
        gl_FragColor = vec4(alb * .8 * (uAmbSky + uSun * (.25 + .6 * abs(flip))), 1.);
        #include <fog_fragment>
      }`}),v=new z.Points(w,l);return v.frustumCulled=!1,v.name="paper-confetti",v}async function Ge(i,u={}){const c=i.rng.fork("paper-kingdom-hero"),g=(u.palette&&u.palette.length>=7?u.palette:Me).map(L=>new z.Color(L)),M=(L,j,oe)=>L.clone().lerp(j,oe),w=new z.Color(1,1,1),l=M(g[0],g[1],c.range(0,.35)),v=c.pick([M(g[5],g[4],.3),M(g[5],g[4],.55),M(g[6],g[4],.38)]),y={page:l,edge:M(g[0],g[2],.35),cover:v,coverDark:M(v,g[4],.5),far:M(g[0],w,.25),walls:[g[0],g[1],M(g[1],g[2],.55)],roofs:[g[2],M(g[2],g[3],.5),g[3],M(g[1],g[2],.5)],blueRoof:M(g[5],g[3],.5),red:g[6],ink:M(g[4],g[3],.25),blue:g[5],gold:new z.Color("#e9a92c")};y.far2=M(y.far,g[5],.1),y.farRed=M(y.far,g[6],.16),y.coverLight=M(v,g[0],.32);const A=c()<.65?1:-1,S=new z.Vector3(...u.lightDir||[-.6,.7,.4]).normalize(),m={uUnfold:{value:1},uCrane:{value:.7},uTime:{value:0},uGlow:{value:1},uViewH:{value:720},uLightDir:{value:S},uSun:{value:new z.Color(.96,.86,.7)},uAmbSky:{value:new z.Color(.36,.36,.4)},uAmbShade:{value:new z.Color(.23,.23,.35)},uWarm:{value:new z.Color(1,.56,.2)},uInk:{value:g[4]},uRed:{value:g[6]},uBlue:{value:g[5]},uPaper:{value:M(g[0],w,.2)},uHole:{value:new z.Vector3(0,X,W)},uShadow:{value:null},uPageCol:{value:l},uCraneRed:{value:new z.Color(u.craneAccent||g[6])},uTower:{value:new z.Vector3(H.x,p,H.z)},uCraneSize:{value:u.craneSize??1.45},uB0:{value:new z.Vector3},uB1:{value:new z.Vector3},uB2:{value:new z.Vector3(-9,X+9,W+52)},uB3:{value:new z.Vector3(0,X,W-18)}};m.uB0.value.copy(de(1)),m.uB1.value.copy(de(1)).sub(de(.995)).normalize().multiplyScalar(45).add(m.uB0.value);const q=new z.Group;q.name="paper-kingdom-hero";const b=ze(m),o=[],f=[];await i.yield?.();const r=ve(c.fork("book"));Te(r,c.fork("book2"),y);const n=new z.Mesh(r.geometry(),b);n.name="paper-book",n.frustumCulled=!1,q.add(n),await i.yield?.();const a=ve(c.fork("pop")),e=u.ceiling||(()=>1e9),t=await Fe(a,c.fork("town"),y,o,f,A,e,async()=>{await i.yield?.()});await i.yield?.(),Ee(a,c.fork("tower"),y,o,f),Re(a,c.fork("castle"),y,o,f,A),await i.yield?.(),Ie(a,c.fork("page"),y,o,f),_e(a,c.fork("kites"),y,e),await i.yield?.();const s=new z.Mesh(a.geometry(),b);s.name="paper-popups",s.frustumCulled=!1,q.add(s),await i.yield?.(),m.uShadow.value=Ve(o,S),await i.yield?.();const d=u.cranes??1e3,h=Ue(c.fork("cranes"),m,f,d,c.range(.04,.09));q.add(h),q.add(He(c.fork("glow"),m,u.holeFill!==!1));const x=u.confetti??1200;x>0&&q.add(We(c.fork("confetti"),m,x)),await i.yield?.();const k=u.unfoldFrom??.5,P=u.unfoldTo??.76,T=u.cranesFrom??.72,R=u.cranesTo??.96,I=L=>{m.uUnfold.value=B(L,0,1);const j=B(Ae(m.uUnfold.value,ae),0,1);m.uGlow.value=j*j*j},F=L=>{m.uCrane.value=B(L,0,1)},E=L=>I(Math.max(.05,(J+le*L/ne)/1.4)),_=L=>{I((L-k)/(P-k)),F((L-T)/(R-T))};_(.9);const V=(L,j,oe)=>new z.Vector3(L,j,oe),K={portalSeat:{position:V(0,X,W).clone(),facing:V(0,0,1),radius:te},flyThrough:Pe.map(L=>V(L[0],L[1],L[2])),beyond:V(0,X,W-60),gutter:{a:V(0,p-1.1,G),b:V(0,p-1.1,-G)},avenue:{start:V(0,p,qe),end:V(0,p,ke),width:Q*2},tower:{base:V(H.x,p,H.z),top:V(H.x,p+H.h,H.z),radius:13.5,wave:(we-J)/le*ne},craneColumn:{center:V(H.x,p,H.z),radius:30,yMin:p+12,yMax:p+H.h+16},standingPage:{center:V(0,p+ie/2,W),width:ee*2,height:ie,z:W},bridges:fe.map(L=>({z:L,clearY:p+21,halfWidth:13})),castle:V(A*N.x,p,N.z),bookMin:V(-$-6,0,-G-6),bookMax:V($+6,p,G+6),pageY:p,viewpoints:{far:V(170,100,330),reveal:V(120,p+42,182),gutter:V(18,p+18,84),avenue:V(0,p+8,70),tower:V(12,p+26,-30)}},D=new z.Vector2;return{object:q,radius:220,height:p+H.h+7,center:V(0,26,-12),anchors:K,uniforms:m,setProgress:_,setUnfold:I,setCranes:F,setWave:E,stats:{houses:t,cranes:d,triangles:r.tris+a.tris+d*22+34},update(L,j,oe){m.uTime.value=j,i.renderer?.getDrawingBufferSize?.(D),D.y>0&&(m.uViewH.value=D.y)},dispose(){m.uShadow.value?.dispose()},ground:!0,groundY:0}}export{Pe as FLY_THROUGH,he as GLSL_PAPER_LIGHT,Ge as buildHero,Le as craneGeometry,Se as waveDistance};
