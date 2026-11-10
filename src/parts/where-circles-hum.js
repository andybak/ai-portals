import*as i from"three";const lt=["#EDE3C6","#12110F","#1E3A82","#F0C61C","#D8412A","#45295F","#E6A39B"],st={orange:"#E2772A",green:"#2E8B6E",lviolet:"#6A4B9B",pblue:"#7DB3D8",ochre:"#D2B06A",white:"#DDE6EA"};function Be(o=lt){const n=o&&o.length>=7?o:lt,d=e=>new i.Color(e),r={};["buff","black","blue","yellow","red","violet","rose"].forEach((e,v)=>{r[e]=d(n[v])});for(const e in st)r[e]=d(st[e]);return r}const X={uTime:{value:0},uNight:{value:0},uHeroC:{value:new i.Vector3(0,125,0)},uHeroR:{value:125},uViewH:{value:720},uPaper:{value:new i.Color("#EDE3C6")},uInk:{value:new i.Color("#12110F")},uIvory:{value:new i.Color("#DDE6EA")},uGaze:{value:new i.Vector3(0,0,-1)}},G=(o,n={})=>Object.assign({},o||X,n);function Pt(){const o={};for(const n in X){const d=X[n].value;o[n]={value:d&&d.clone?d.clone():d}}return o}const dt=`
uniform float uTime, uNight, uHeroR, uViewH;
uniform vec3 uHeroC, uPaper, uInk, uIvory, uGaze;
float h11(float n){ return fract(sin(n * 127.1 + 1.7) * 43758.5453); }
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 h22(vec2 p){ float n = h21(p); return vec2(n, h21(p + n * 19.19 + 7.3)); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
float vnoise3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); vec2 o = vec2(37.0, 17.0);
  float a = mix(vnoise(i.xy + o * i.z + f.xy), vnoise(i.xy + o * (i.z + 1.) + f.xy), f.z); return a; }
// when: 0 = a day form (gone inside the great circle), 1 = a night form (gone outside), 2 = always there
float whenScale(float when){ return when < 0.5 ? 1. - uNight : (when < 1.5 ? uNight : 1.); }
`,Wt=`
float heroCover(vec3 P){
  vec3 oc = cameraPosition - uHeroC; vec3 dv = P - cameraPosition; float L = max(length(dv), 1e-4); vec3 d = dv / L;
  float b = dot(oc, d); float h = sqrt(max(dot(oc, oc) - b * b, 0.));
  float fw = clamp(fwidth(h), 1e-4, 4.);
  float c = (1. - smoothstep(uHeroR - fw, uHeroR + fw, h)) * step(b, 0.) * step(1., uHeroR);
  return max(c, uNight);
}
// metres per pixel at view depth z (z > 0)
float pxSize(float z){ return z * 2. / max(projectionMatrix[1][1] * uViewH, 1.); }
`,Rt=`float pxSize(float z){ return z * 2. / max(projectionMatrix[1][1] * uViewH, 1.); }
`,j=`uniform mat4 projectionMatrix;
`+dt+Wt,N=dt+Rt;function ee(o,n,d=1){const r=new i.InstancedBufferGeometry,e=[],v=[];for(let u=0;u<=d;u++){const f=-1+2*u/d;e.push(f,-1,0,f,1,0)}for(let u=0;u<d;u++){const f=u*2;v.push(f,f+2,f+1,f+1,f+2,f+3)}r.setAttribute("position",new i.Float32BufferAttribute(e,3)),r.setIndex(v);for(const u in o)r.setAttribute(u,new i.InstancedBufferAttribute(o[u][1],o[u][0]));return r.instanceCount=n,r}function q(o,n){return o.frustumCulled=!1,o.renderOrder=n,o.matrixAutoUpdate=!0,o}const qe=o=>o.isColor?o:new i.Color(o);function Dt(o={}){const n=o.pig||Be(),d=new i.ShaderMaterial({uniforms:G(o.U,{uOchre:{value:qe(o.cloud||n.ochre)},uPBlue:{value:qe(o.toward||n.pblue)},uViolet:{value:n.violet.clone()},uOchreDir:{value:(o.ochreDir||new i.Vector3(-.8,-.45,.4)).clone().normalize()},uSeed:{value:o.seed??3.7}}),vertexShader:N+`
      varying vec3 vDir;
      void main(){ vDir = position; vec4 p = projectionMatrix * viewMatrix * vec4(cameraPosition + position * 900., 1.);
        if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fragmentShader:j+`
      uniform vec3 uOchre, uPBlue, uViolet, uOchreDir; uniform float uSeed; varying vec3 vDir;
      void main(){
        vec3 d = vDir / max(length(vDir), 1e-4);
        float n1 = vnoise3(d * 1.7 + uSeed), n2 = vnoise3(d * 3.9 - uSeed * 1.3), n3 = vnoise3(d * 9.0 + 11.);
        float mott = (n3 - .5) * .035 + (vnoise3(d * 31.) - .5) * .02;                     // uneven spray
        vec3 day = uPaper;
        float wo = smoothstep(.42, .9, n1 * .62 + .55 * max(dot(d, uOchreDir), 0.) + n2 * .18);
        day = mix(day, uOchre, wo * .8);
        vec3 hv = uHeroC - cameraPosition; vec3 hd = hv / max(length(hv), 1e-3);
        float wb = smoothstep(.62, 1.02, dot(d, hd) * .8 + n2 * .26 + n3 * .06);
        day = mix(day, uPBlue, wb * .62);
        day *= 1. + mott;
        float wv = smoothstep(.52, .95, n1 * .7 + n2 * .45);
        vec3 night = mix(uInk, uViolet, clamp(wv * .34 + mott * 1.2, 0., 1.));
        gl_FragColor = vec4(mix(day, night, uNight), 1.);
      }`,side:i.BackSide,depthWrite:!1,depthTest:!1,transparent:!0});return q(new i.Mesh(new i.IcosahedronGeometry(1,3),d),-10)}function Ut(o={}){const n=o.pig||Be(),d=o.core||[-20,14,85],r=new i.ShaderMaterial({uniforms:G(o.U,{uCoreCol:{value:qe(o.coreColor||n.violet)},uCore:{value:new i.Vector3(...d)},uSeed:{value:o.seed??1.3}}),vertexShader:N+`
      varying vec3 vW;
      void main(){ vW = uHeroC + position * uHeroR * 1.04 * (1. - uNight); gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.); }`,fragmentShader:j+`
      uniform vec3 uCoreCol, uCore; uniform float uSeed; varying vec3 vW;
      void main(){
        vec3 oc = cameraPosition - uHeroC; vec3 dv = vW - cameraPosition; vec3 d = dv / max(length(dv), 1e-4);
        float b = dot(oc, d); vec3 q = oc - b * d; float h = length(q);
        float fw = clamp(fwidth(h), 1e-4, 4.);
        float a = 1. - smoothstep(uHeroR - fw, uHeroR + fw, h);
        if (a < .004) discard;
        float dC = max(length(oc), 1e-3); vec3 f = -oc / dC; vec3 rt = cross(f, vec3(0, 1, 0)); rt /= max(length(rt), 1e-4); vec3 up = cross(rt, f);
        // where the ray meets the plane through the centre, scaled so the circle's own edge is always at uHeroR: a flat disc
        vec3 pp = oc + d * (dC / max(dot(d, f), 1e-3));
        vec2 p = vec2(dot(pp, rt), dot(pp, up)) * (sqrt(max(dC * dC - uHeroR * uHeroR, 0.)) / dC);
        float rc = length(p - uCore.xy);
        float fc = clamp(fwidth(rc), 1e-4, 4.);
        float inCore = 1. - smoothstep(uCore.z - fc, uCore.z + fc, rc);
        // one flat hue with one faint sprayed cloud toward one rim
        float cloud = smoothstep(.2, 1., (p.x * .6 - p.y * .8 - uCore.x * .6 + uCore.y * .8) / max(uCore.z, 1.) * .5 + .5) * (.55 + .9 * vnoise(p * .045 + uSeed));
        vec3 core = mix(uCoreCol, uInk, clamp(cloud * .5, 0., .6)) * (1. + (vnoise(p * .21 + 3.) - .5) * .07 + (vnoise(p * .06 + 9.) - .5) * .06);
        gl_FragColor = vec4(mix(uInk, core, inCore), a);
        vec4 c = projectionMatrix * viewMatrix * vec4(cameraPosition + d * max(-b, .6), 1.);
        gl_FragDepth = clamp(c.z / max(c.w, 1e-4) * .5 + .5, 0., 1.);
      }`,side:i.BackSide,transparent:!0,depthWrite:!0,depthTest:!0});return q(new i.Mesh(new i.SphereGeometry(1,96,48),r),-9)}const Tt=N+`
  attribute vec3 iPos, iCol, iCol2, iIn; attribute vec4 iRC, iVel;
  varying vec2 vUv; varying vec3 vW, vCol, vCol2, vIn; varying vec2 vSeedR;
  void main(){
    vec3 lp = iPos + iVel.xyz * sin(uTime * iVel.w + iRC.z * 6.2832);
    vec3 wc = (modelMatrix * vec4(lp, 1.)).xyz;
    float dist = length(wc - cameraPosition), near = 1. - smoothstep(20., 170., dist);
    float k = iRC.w, r = iRC.x * whenScale(iRC.y);
    r *= 1. + near * (k > .5 && k < 1.5 ? .07 : (k < -.5 ? -.07 : (abs(k) < .5 ? .045 * sin(uTime * 4.4 + iRC.z * 40.) : 0.)));
    float vz = max(-(viewMatrix * vec4(wc, 1.)).z, .05);
    r *= smoothstep(2., 5., r / pxSize(vz));                          // nothing under 4 px across is drawn; a film grows in as it nears
    vec3 cr = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), cu = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
    vW = wc + (cr * position.x + cu * position.y) * r;
    vUv = position.xy; vCol = iCol; vCol2 = iCol2; vIn = iIn; vSeedR = vec2(iRC.z, r);
    gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
  }`,Bt=o=>j+`
  varying vec2 vUv; varying vec3 vW, vCol, vCol2, vIn; varying vec2 vSeedR;
  void main(){
    float rr = length(vUv), fw = clamp(fwidth(rr), 1e-5, .5);
    float a = 1. - smoothstep(1. - 1.5 * fw, 1., rr);
    if (a < .003) discard;
    float s = vSeedR.x, ang = s * 37.;
    float inner = (1. - smoothstep(vIn.z - fw, vIn.z + fw, length(vUv - vIn.xy))) * step(.01, vIn.z);
    vec3 c = mix(vCol, vCol2, inner);
    float cloud = smoothstep(.15, 1.1, dot(vUv, vec2(cos(ang), sin(ang))) * .55 + .45) * (.35 + vnoise(vUv * 2.6 + s * 91.));
    float grainPx = .6 / max(fw * vSeedR.y, 1e-4);                                  // px size of a 0.6 m spray cell
    float spray = (vnoise(vUv * vSeedR.y * 1.7 + s * 13.) - .5) * smoothstep(3., 7., grainPx);
    float tone = clamp(cloud * .30 * (1. - inner) + spray * .10, -.2, .5);          // 0 flat .. darker toward one rim
    float cover = heroCover(vW);
    ${o==="mul"?`
    vec3 T = pow(clamp(c / max(uPaper, vec3(.02)), vec3(.002), vec3(1.)), vec3(.6 * (1. + tone * .9)));
    gl_FragColor = vec4(mix(vec3(1.), T, a * (1. - cover)), 1.);`:o==="exc"?`
    gl_FragColor = vec4(clamp(c * (1. - tone * .7), 0., 1.) * a * cover, 1.);
    if (a * cover < .003) discard;`:`
    gl_FragColor = vec4(c * (1. - tone * .5), a);`}
  }`;function Fe(o="mul",n=X){const d=new i.ShaderMaterial({uniforms:G(n),vertexShader:Tt,fragmentShader:Bt(o),transparent:!0,depthTest:!0,depthWrite:o==="solid",side:i.DoubleSide});return o!=="solid"&&(d.blending=i.CustomBlending,d.blendEquation=i.AddEquation,d.blendSrc=o==="mul"?i.DstColorFactor:i.OneMinusDstColorFactor,d.blendDst=o==="mul"?i.ZeroFactor:i.OneMinusSrcColorFactor,d.blendSrcAlpha=i.ZeroFactor,d.blendDstAlpha=i.OneFactor),d}const qt=o=>o.r>.45&&o.g>.22&&o.b<.2?1:o.b>o.r*1.3?-1:o.r>o.g*2.2?0:2;function se(o){const n=[];return{push(...d){for(let r=0;r<o;r++)n.push(d[r]??0)},get count(){return n.length/o},data:n,stride:o}}function de(o,n){const d=o.count,r={};let e=0;for(const v in n){const u=n[v],f=new Float32Array(d*u);for(let S=0;S<d;S++)for(let y=0;y<u;y++)f[S*u+y]=o.data[S*o.stride+e+y];r[v]=[u,f],e+=u}return r}function Ie(o,n={}){const d=se(20);for(const v of o){const u=v.c,f=v.c2||v.c,S=v.inner||[0,0,0],y=v.vel||[0,0,0];d.push(v.p[0],v.p[1],v.p[2],v.r,v.when??0,v.seed??.5,v.kind??qt(u),u.r,u.g,u.b,f.r,f.g,f.b,S[0],S[1],S[2],y[0],y[1],y[2],v.w??.1)}const r=ee(de(d,{iPos:3,iRC:4,iCol:3,iCol2:3,iIn:3,iVel:4}),d.count),e=new i.Group;return n.solid?e.add(q(new i.Mesh(r,Fe("solid",n.U)),n.order??-8)):(e.add(q(new i.Mesh(r,Fe("mul",n.U)),-4)),e.add(q(new i.Mesh(r,Fe("exc",n.U)),-3))),e}function Ft(o=X){return new i.ShaderMaterial({uniforms:G(o),transparent:!0,depthTest:!0,depthWrite:!1,side:i.DoubleSide,vertexShader:N+`
      attribute vec3 iPos, iCol; attribute vec4 iR, iOpt;
      varying vec2 vM; varying vec3 vW, vCol; varying vec4 vR; varying vec3 vOpt;
      void main(){
        vec3 wc = (modelMatrix * vec4(iPos, 1.)).xyz; float d = length(wc - cameraPosition);
        float ro = iR.y, grow = 1.;
        if (iOpt.x > .5) { wc = uHeroC; d = length(wc - cameraPosition); grow = 1.35 * d / sqrt(max(d * d - ro * ro, .09 * d * d)); }
        float br = 1. + .035 * sin(uTime * iOpt.y + iR.w * 6.2832);
        float r = ro * grow * whenScale(iR.z);
        float vz = max(-(viewMatrix * vec4(wc, 1.)).z, .05); r *= step(2., ro / pxSize(vz));
        vec3 cr = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), cu = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        vW = wc + (cr * position.x + cu * position.y) * r;
        vM = position.xy * ro * grow / br; vCol = iCol; vR = iR; vOpt = iOpt.xzw;
        gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
      }`,fragmentShader:j+`
      varying vec2 vM; varying vec3 vW, vCol; varying vec4 vR; varying vec3 vOpt;
      // one size of dot: returns coverage (discrete dots, or their mean when too small to draw)
      float stip(vec2 m, float cell, float D, float mpp, float seed){
        float px = cell / mpp;
        float mean = D * .045;
        if (px < 2.2) return mean;
        float an = seed * 2.399; vec2 cs = vec2(cos(an), sin(an));                   // every size on its own slant: no lattice
        vec2 g = vec2(m.x * cs.x - m.y * cs.y, m.x * cs.y + m.y * cs.x) / cell + seed * 7.13, id = floor(g), f = fract(g);
        vec2 hh = h22(id + seed); float present = step(h21(id * 1.7 + 3.1 + seed), D * .82);
        float rad = .07 + .30 * hh.x * hh.x + .12 * hh.y;                 // uneven dot sizes, gaps
        vec2 c = rad + (1. - 2. * rad) * h22(id + 17.7 + seed);
        float aa = 1. / px, dd = length(f - c);
        float dot1 = present * (1. - smoothstep(rad - aa, rad + aa, dd));
        float keep = 1. - smoothstep(60., 130., px);
        return mix(mean, dot1, smoothstep(2.2, 4.5, px)) * keep;
      }
      void main(){
        vec3 oc = cameraPosition - uHeroC; vec3 dv = vW - cameraPosition; vec3 d = dv / max(length(dv), 1e-4);
        float b = dot(oc, d), h = sqrt(max(dot(oc, oc) - b * b, 0.));
        float rho = vOpt.x > .5 ? h : length(vM);
        float t = (rho - vR.x) / max(vR.y - vR.x, 1e-3);
        float mpp = max(length(fwidth(vM)) * .7071, 1e-5);
        if (t < 0. || t > 1. || (vOpt.x > .5 && b > 0.)) discard;
        float s = vR.w;
        float lump = .45 + 1.0 * vnoise(vM / max(vR.y, 1e-3) * 5. + s * 31.) ;       // uneven spray: banks and gaps
        float fall = (1. - t); fall = fall * sqrt(fall) * (.55 + .45 * fall);          // thinning outward
        float D = clamp(fall * lump * vOpt.y, 0., 1.) * smoothstep(0., .008, t);
        float base = clamp((vR.y - vR.x) / 430., .004, .13);
        float a = 1.;
        a *= 1. - stip(vM, base, D, mpp, s);
        a *= 1. - stip(vM, base * 2.5, D, mpp, s + 1.);
        a *= 1. - stip(vM, base * 6.25, D, mpp, s + 2.);
        a *= 1. - stip(vM, base * 15.6, D, mpp, s + 3.);
        a *= 1. - stip(vM, base * 39., D * .8, mpp, s + 4.);
        a *= 1. - stip(vM, base * 97., D * .42, mpp, s + 5.);
        a = 1. - a;
        if (a < .004) discard;
        gl_FragColor = vec4(vCol, a);
      }`})}function It(o,n={}){const d=se(14);for(const r of o)d.push(r.p[0],r.p[1],r.p[2],r.ri,r.ro,r.when??0,r.seed??.3,r.c.r,r.c.g,r.c.b,r.hero??0,r.rate??.6,r.dens??1,0);return q(new i.Mesh(ee(de(d,{iPos:3,iR:4,iCol:3,iOpt:4}),d.count),n.material||Ft(n.U)),n.order??-5)}function Ht(o,n={}){const d=o.length/8,r=(n.colors||[new i.Color("#E6A39B")]).slice(0,4);for(;r.length<4;)r.push(r[0]);const e=new Float32Array(o),v=new i.InstancedInterleavedBuffer(e,8),u=ee({},d);u.setAttribute("iPos",new i.InterleavedBufferAttribute(v,4,0)),u.setAttribute("iG",new i.InterleavedBufferAttribute(v,4,4));const f=new i.ShaderMaterial({uniforms:G(n.U,{uCols:{value:r}}),transparent:!0,depthTest:!0,depthWrite:!1,side:i.DoubleSide,vertexShader:N+`
      attribute vec4 iPos, iG; uniform vec3 uCols[4]; varying vec2 vUv; varying vec4 vCA;
      void main(){
        float s = iG.y; vec3 lp = iPos.xyz + .35 * vec3(sin(uTime * .31 + s * 50.), sin(uTime * .23 + s * 81.), cos(uTime * .27 + s * 33.));
        vec4 mv = viewMatrix * modelMatrix * vec4(lp, 1.); float vz = max(-mv.z, .05), px = pxSize(vz);
        float r = iPos.w * whenScale(iG.x), vis = (1. - smoothstep(90., 170., vz)) * smoothstep(.35, 1., r / px);
        r = max(r, px * .9) * step(.01, vis) * step(.3, vz);
        mv.xy += position.xy * r; vUv = position.xy; int ci = int(clamp(iG.z, 0., 3.));
        vCA = vec4(uCols[ci], vis); gl_Position = projectionMatrix * mv;
      }`,fragmentShader:j+`
      varying vec2 vUv; varying vec4 vCA;
      void main(){ float rr = length(vUv), fw = clamp(fwidth(rr), 1e-4, .7); float a = (1. - smoothstep(1. - 1.5 * fw, 1., rr)) * vCA.a;
        if (a < .01) discard; gl_FragColor = vec4(vCA.rgb, a); }`});return q(new i.Mesh(u,f),n.order??-1)}const Lt=(o,n,d)=>{const r=((o/n+d)%1+1)%1,e=Math.min(1,r/.6);return e*e*(3-2*e)};function Et(o=X){return new i.ShaderMaterial({uniforms:G(o,{uRule:{value:1},uStrike:{value:0}}),transparent:!0,depthTest:!0,depthWrite:!1,side:i.DoubleSide,vertexShader:N+`
      attribute vec3 iA, iB; attribute vec4 iL, iM, iBow; uniform float uRule, uStrike;
      varying float vV, vA; varying vec3 vW;
      vec3 at(float t, vec3 A, vec3 B, vec3 dir, float len, vec3 n1){
        vec3 p = mix(A, B, t);
        if (iBow.w < 0.) { float hh = -iBow.w, c2 = len * .5, rho = (c2 * c2 + hh * hh) / max(2. * hh, 1e-3), th = (2. * t - 1.) * asin(clamp(c2 / max(rho, 1e-3), 0., 1.));
          p = mix(A, B, .5) + iBow.xyz * (rho * cos(th) - (rho - hh)) + dir * (rho * sin(th)); }
        else p += iBow.xyz * (iBow.w * 4. * t * (1. - t));                                           // one compass arc
        float ph = t * iM.x * 6.2832 - uTime * 2.2 - iL.z * 9.;
        p += n1 * iL.w * sin(ph) * step(.5, iM.x) + dir * (iL.w * 2.5 * sin(uTime * .35 + iL.z * 20.)) * step(.5, iM.x);   // swimmer
        float near = max(uStrike, 1. - smoothstep(12., 75., length((modelMatrix * vec4(p, 1.)).xyz - cameraPosition)));
        p += n1 * iM.y * near * sin(t * 3.14159 * (3. + floor(iL.z * 5.))) * sin(uTime * 17. + iL.z * 60.);   // hum
        return p;
      }
      void main(){
        vec3 A = iA, B = iB; vec3 dv = B - A; float len = max(length(dv), 1e-3); vec3 dir = dv / len;
        vec3 n1 = cross(dir, vec3(.31, .9, .29)); n1 /= max(length(n1), 1e-3);
        float t = position.x * .5 + .5;
        if (iM.z > .01) { float tt = fract(uTime / iM.z + iL.z); float head = smoothstep(0., .6, tt), tail = smoothstep(.82, 1., tt); t = clamp(t, tail, head); }
        if (iM.w > .5) t = min(t, uRule);
        vec3 p = at(t, A, B, dir, len, n1), p2 = at(min(t + .01, 1.), A, B, dir, len, n1), p0 = at(max(t - .01, 0.), A, B, dir, len, n1);
        vec3 wp = (modelMatrix * vec4(p, 1.)).xyz, tg = mat3(modelMatrix) * (p2 - p0); tg /= max(length(tg), 1e-5);
        vec3 te = cameraPosition - wp; vec3 sd = cross(tg, te); sd /= max(length(sd), 1e-5);
        float vz = max(-(viewMatrix * vec4(wp, 1.)).z, .05), px = pxSize(vz);
        float w = iL.x * (1. + .3 * smoothstep(1. - 4. * iL.x / len, 1., t));                   // ink heavier at the end
        vA = iM.w > 1.5 ? clamp(iL.x / (1.6 * px), 0., 1.) : 1.;
        w = max(w, 1.6 * px) * .5 * whenScale(iL.y) * step(.15, vA);
        w += px * .75 * step(1e-4, w);                                                           // room for the edge
        vV = position.y * (w / max(w - px * .75, 1e-4)); vW = wp + sd * position.y * w;
        gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
      }`,fragmentShader:j+`
      varying float vV, vA; varying vec3 vW;
      void main(){ float v = abs(vV), fw = clamp(fwidth(vV), 1e-4, 1.); float a = (1. - smoothstep(1. - fw, 1. + fw, v)) * vA;
        if (a < .01) discard; gl_FragColor = vec4(mix(uInk, uIvory, heroCover(vW)), a); }`})}function vt(o,n={}){const d=se(18);for(const r of o){const e=r.bowDir||[0,1,0];d.push(r.a[0],r.a[1],r.a[2],r.b[0],r.b[1],r.b[2],r.w??.3,r.when??0,r.seed??.5,r.wave??0,r.waves??0,r.hum??0,r.loop??0,r.ruled??0,e[0],e[1],e[2],r.bow??0)}return q(new i.Mesh(ee(de(d,{iA:3,iB:3,iL:4,iM:4,iBow:4}),d.count,n.segs??1),n.material||Et(n.U)),n.order??-2)}function ut(o,n,d,r,e,v={}){const u=new i.Vector3(...n),f=new i.Vector3(...d),S=f.clone().sub(u),y=S.length();S.normalize();const k=new i.Vector3(...v.side||[.2,1,.1]).cross(S).normalize(),p=[];let t=-e*(r-1)*.5;for(let z=0;z<r;z++){const F=o.range(0,.22)*y,_=y-o.range(0,.22)*y,M=u.clone().addScaledVector(S,F).addScaledVector(k,t),B=u.clone().addScaledVector(S,_).addScaledVector(k,t);p.push({a:M.toArray(),b:B.toArray(),w:(v.w??.3)*o.range(.7,1.5),when:v.when??0,seed:o(),hum:v.hum??0}),t+=e*o.range(.55,1.6)}return p}function Ot(o=X){return new i.ShaderMaterial({uniforms:G(o),transparent:!0,depthTest:!0,depthWrite:!0,side:i.DoubleSide,vertexShader:N+`
      attribute vec3 iPos, iCol, iCol2; attribute vec4 iAx, iN, iS, iVel;
      varying vec2 vP; varying vec4 vS; varying vec3 vW, vCol, vCol2; varying float vSeed;
      void main(){
        float sc = whenScale(iAx.w); vec3 lp = iPos;
        if (iVel.w > .5) { float s = mod(uTime + iN.w * 97., iVel.w / max(length(iVel.xyz), 1e-3)); float f = s * length(iVel.xyz) / iVel.w;
          lp += iVel.xyz * s - iVel.xyz / max(length(iVel.xyz), 1e-3) * iVel.w * .5; sc *= smoothstep(0., .06, f) * (1. - smoothstep(.94, 1., f)); }
        mat3 M = mat3(modelMatrix);
        vec3 e2 = M * iAx.xyz; e2 /= max(length(e2), 1e-4); vec3 n = M * iN.xyz; n -= e2 * dot(n, e2); n /= max(length(n), 1e-4); vec3 e1 = cross(e2, n);
        vec3 wc = (modelMatrix * vec4(lp, 1.)).xyz + e2 * iS.x * .4;
        vec3 v = cameraPosition - wc; v /= max(length(v), 1e-4);
        float c = dot(n, v); if (c < 0.) { n = -n; e1 = -e1; c = -c; }
        if (c < .5736) {                                                  // more than 55 degrees off: turn toward the lens
          vec3 perp = n - v * c; perp /= max(length(perp), 1e-4);
          vec3 n2 = v * .5736 + perp * .8192; vec3 k = cross(n, n2); float sk = length(k);
          if (sk > 1e-4) { k /= sk; float ck = clamp(dot(n, n2), -1., 1.);
            e1 = e1 * ck + cross(k, e1) * sk + k * dot(k, e1) * (1. - ck); e2 = e2 * ck + cross(k, e2) * sk + k * dot(k, e2) * (1. - ck); }
        }
        float hbx = iS.y * max(1., abs(iS.w)) * 1.06;
        vec2 q = vec2(position.x * hbx, (position.y * .53 + .5) * iS.x) ;
        wc -= e2 * iS.x * .4;
        vW = wc + (e1 * q.x + e2 * q.y) * sc; vP = q; vS = iS; vCol = iCol; vCol2 = iCol2; vSeed = iN.w;
        gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
      }`,fragmentShader:j+`
      varying vec2 vP; varying vec4 vS; varying vec3 vW, vCol, vCol2; varying float vSeed;
      float edgeD(vec2 p, vec2 a, vec2 b){ vec2 e = b - a; return (e.x * (p.y - a.y) - e.y * (p.x - a.x)) / max(length(e), 1e-4); }
      void main(){
        vec2 A = vec2(-vS.y, 0.), B = vec2(vS.y, 0.), C = vec2(vS.w * vS.y, vS.x);
        float d = min(edgeD(vP, A, B), min(edgeD(vP, B, C), edgeD(vP, C, A)));
        float fw = clamp(length(fwidth(vP)) * .7071, 1e-5, 10.);
        float a = smoothstep(-fw, fw, d); if (a < .01) discard;
        float ew = max(vS.z, 1.6 * fw);
        float edge = 1. - smoothstep(ew - fw, ew + fw, d);
        float inr = vS.x * vS.y / max(vS.y + length(C - A) * .5 + length(C - B) * .5, 1e-3);      // inradius
        float inset = inr * (.34 + .2 * fract(vSeed * 7.3));
        float inner = smoothstep(inset - fw, inset + fw, d);
        float cover = heroCover(vW);
        vec3 fill = mix(vCol, vCol2, cover);
        vec3 pale = mix(fill, mix(uPaper, uIvory, cover), .5) * (1. + (vnoise(vP * 1.3 + vSeed * 40.) - .5) * .07);
        vec3 col = mix(fill, pale, inner);
        col = mix(col, mix(uInk, uIvory, cover), edge);
        gl_FragColor = vec4(col, a);
      }`})}function Gt(o,n={}){const d=se(25);for(const r of o){const e=r.c,v=r.c2||r.c,u=r.vel||[0,0,0];d.push(r.p[0],r.p[1],r.p[2],e.r,e.g,e.b,v.r,v.g,v.b,r.axis[0],r.axis[1],r.axis[2],r.when??0,r.n[0],r.n[1],r.n[2],r.seed??.5,r.h,r.hb,r.edge??Math.max(.12,r.h*.012),r.lean??0,u[0],u[1],u[2],r.span??0)}return q(new i.Mesh(ee(de(d,{iPos:3,iCol:3,iCol2:3,iAx:4,iN:4,iS:4,iVel:4}),d.count),n.material||Ot(n.U)),n.order??-6)}function jt(o=X){return new i.ShaderMaterial({uniforms:G(o,{uWake:{value:0}}),transparent:!0,depthTest:!0,depthWrite:!0,side:i.DoubleSide,vertexShader:N+`
      attribute vec3 iPos, iCol, iCol2; attribute vec4 iU, iV, iW; uniform float uWake;
      varying vec2 vUv; varying vec3 vW, vCol, vCol2; varying vec3 vK;
      void main(){
        float sc = whenScale(iU.w) * 1.04;
        vec3 lp = iPos + (iU.xyz * position.x + iV.xyz * position.y) * sc;
        vW = (modelMatrix * vec4(lp, 1.)).xyz; vUv = position.xy * 1.04; vCol = iCol; vCol2 = iCol2;
        vK = vec3(clamp((uWake - iW.x) / .12, 0., 1.), iW.y, iV.w);
        gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
      }`,fragmentShader:j+`
      varying vec2 vUv; varying vec3 vW, vCol, vCol2; varying vec3 vK;
      void main(){
        vec2 fw = clamp(fwidth(vUv), 1e-5, 1.), e = vec2(1.) - smoothstep(vec2(1.) - fw, vec2(1.) + fw, abs(vUv));
        float a = e.x * e.y; if (a < .01) discard;
        float cover = heroCover(vW);
        float sweep = vUv.x * .5 + .5 + (vUv.y * .5) * (vK.z - .5) * .5;                  // the wipe runs across on a slight slant
        float w = smoothstep(-fw.x, fw.x, vK.x * 1.3 - .15 - sweep);
        vec3 col = mix(vCol, vCol2, w);
        col = mix(col, mix(uInk, uIvory, cover), vK.y);
        col *= 1. + (vnoise(vUv * 2.1 + vK.z * 50.) - .5) * .06;
        gl_FragColor = vec4(col, a);
      }`})}function ht(o,n={}){const d=se(21);for(const e of o){const v=e.c,u=e.c2||e.c;d.push(e.p[0],e.p[1],e.p[2],v.r,v.g,v.b,u.r,u.g,u.b,e.u[0],e.u[1],e.u[2],e.when??0,e.v[0],e.v[1],e.v[2],e.seed??.5,e.wake??.5,e.ink??0,0,0)}const r=q(new i.Mesh(ee(de(d,{iPos:3,iCol:3,iCol2:3,iU:4,iV:4,iW:4}),d.count),n.material||jt(n.U)),n.order??-7);return r.setWake=e=>{r.material.uniforms.uWake.value=e},r}function He(o,n,d,r,e,v,u,f,S={}){const y=new i.Vector3(...n),k=new i.Vector3(...d),p=new i.Vector3(...r),t=[],z=[0],F=[0];for(let M=0;M<e;M++)z.push(z[M]+u*o.range(.82,1.2));for(let M=0;M<v;M++)F.push(F[M]+u*o.range(.82,1.2));const _=new Set((S.keepEmpty||[]).map(M=>M[0]+","+M[1]));for(let M=0;M<e;M++)for(let B=0;B<v;B++){const Ce=o(),Ae=o(),te=o.pick(f),ve=o(),ue=o();if(_.has(M+","+B)||Ce<(S.empty??.15))continue;const he=Ae<(S.ink??.3)&&(M+B)%2===0?1:0,pe=(z[M+1]-z[M])*.5,P=(F[B+1]-F[B])*.5,R=y.clone().addScaledVector(k,z[M]+pe).addScaledVector(p,F[B]+P);t.push({p:R.toArray(),u:k.clone().multiplyScalar(pe).toArray(),v:p.clone().multiplyScalar(P).toArray(),c:S.from||te,c2:te,ink:he,wake:.08+.8*ue,when:S.when??0,seed:ve})}return t}function Zt(o,n={}){const d=new Float32Array(o*4),r=n.rng||(u=>Math.sin(u*127.1+3.3)*43758.5453%1);for(let u=0;u<o*4;u++){const f=r(u);d[u]=f-Math.floor(f)}const e=new i.ShaderMaterial({uniforms:G(n.U,{uBox:{value:n.box??130},uFall:{value:(n.fall||new i.Vector3(7,-17,6)).clone()},uRain:{value:0},uLen:{value:n.len??1.5}}),transparent:!0,depthTest:!0,depthWrite:!1,side:i.DoubleSide,vertexShader:N+`
      attribute vec4 iS; uniform float uBox, uRain, uLen; uniform vec3 uFall; varying float vV; varying vec3 vW;
      void main(){
        float box = max(uBox, 1.);
        vec3 q = iS.xyz * box + uFall * uTime * (.8 + .4 * iS.w);
        vec3 c = cameraPosition + mod(q - cameraPosition, vec3(box)) - .5 * box;
        vec3 dir = uFall / max(length(uFall), 1e-3);
        float dist = length(c - cameraPosition), len = uLen * (.55 + .9 * fract(iS.w * 7.31));
        vec3 te = cameraPosition - c; vec3 sd = cross(dir, te); sd /= max(length(sd), 1e-4);
        float vz = max(-(viewMatrix * vec4(c, 1.)).z, .05), px = pxSize(vz);
        float on = step(iS.w, uRain) * (1. - uNight) * step(4., len / px) * (1. - smoothstep(.36 * box, .48 * box, dist)) * smoothstep(1.5, 4., dist);
        float w = max(.07, 1.6 * px) * .5 * on; w += px * .75 * step(1e-5, w);
        vV = position.y * (w / max(w - px * .75, 1e-4));
        vW = c + dir * position.x * len * .5 * on + sd * position.y * w;
        gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
      }`,fragmentShader:j+`
      varying float vV; varying vec3 vW;
      void main(){ float v = abs(vV), fw = clamp(fwidth(vV), 1e-4, 1.); float a = 1. - smoothstep(1. - fw, 1. + fw, v);
        if (a < .01) discard; gl_FragColor = vec4(mix(uInk, uIvory, heroCover(vW)), a); }`}),v=q(new i.Mesh(ee({iS:[4,d]},o),e),n.order??-1.5);return v.setRain=u=>{e.uniforms.uRain.value=u},v}function Nt(){const o=new i.ShaderMaterial({uniforms:{uWash:{value:new i.Color(1,1,1)}},transparent:!0,depthTest:!1,depthWrite:!1,side:i.DoubleSide,vertexShader:"void main(){ gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:"uniform vec3 uWash; void main(){ gl_FragColor = vec4(uWash, 1.); }",blending:i.CustomBlending,blendEquation:i.AddEquation,blendSrc:i.DstColorFactor,blendDst:i.ZeroFactor,blendSrcAlpha:i.ZeroFactor,blendDstAlpha:i.OneFactor});return q(new i.Mesh(new i.PlaneGeometry(2,2),o),900)}const g=(o,n,d)=>new i.Vector3(o,n,d);async function Qt(o,n={}){const d=o.rng,r=n.detail??o.quality?.detail??1,e=Be(n.palette),v=n.U||Pt(),u={U:v},f=125,S=g(0,f,0),y=new i.Group,k=d.fork("variant"),p=d.fork("day"),t=d.fork("night"),z=d.fork("grain"),F=new URLSearchParams(n.devQuery||""),_=a=>F.has(a)?+F.get(a):null,M=n.variant??_("wchvariant")??(k()<.6?0:k()<.5?1:2),B=[e.rose,e.yellow,e.pblue][M],Ce=[e.red,e.blue,e.orange][M],Ae=[e.yellow,e.white,e.yellow][M],te=n.ground??_("wchground")??(k()<.6?0:k()<.5?1:2);v.uPaper.value.copy([e.buff,e.ochre,e.white][te]),v.uInk.value.copy(e.black),v.uIvory.value.copy(e.white),v.uHeroR.value=f;const ve=k.range(2.2,3),ue=k.range(20,33),he=k.range(.5,.82);n.field!==!1&&y.add(Dt({U:v,pig:e,seed:k.range(0,9),cloud:[e.ochre,e.buff,e.rose][te],toward:e.pblue}));const pe=Ut({U:v,pig:e,core:[Math.cos(ve)*ue,Math.sin(ve)*ue,85],seed:k.range(0,9)});y.add(pe),await o.yield();const P=g(-50,75,104),R=g(64,22,-516).normalize(),$=[P.clone().addScaledVector(R,-90),P.clone().addScaledVector(R,-40),P.clone(),P.clone().addScaledVector(R,30),g(-36,66,20),g(-10,40,-60),g(30,5,-140),g(80,-30,-215),g(135,-57,-280),g(186.8,-75.1,-323.5)],C=new i.CatmullRomCurve3($.slice(2),!1,"centripetal"),D=$[9].clone().sub($[8]).normalize(),I=$[9].clone(),H=g().crossVectors(D,g(0,1,0)).normalize(),re=g().crossVectors(H,D).normalize(),Le=C.getSpacedPoints(160),Ee=a=>{let c=1e9;for(let s=0;s<Le.length;s++){const l=Le[s].distanceToSquared(a);l<c&&(c=l)}return Math.sqrt(c)},Oe=(a,c)=>{const s=a.clone().sub(I),l=s.dot(D);return l<-115||l>12||s.addScaledVector(D,-l).length()>15+c*1.6},_t=a=>{const c=a.clone().sub(P),s=Math.min(30,c.dot(R));return c.addScaledVector(R,-s).length()},L=[],ne=[],K=[],Y=[],U=[],J=[],fe=[],pt=[e.yellow,e.orange,e.yellow,e.red,e.rose],Ge=[e.pblue,e.green,e.lviolet,e.blue,e.white],je=(a,c)=>{const s=a.range(0,6.283),l=a.range(-.35,.35);return[Math.cos(s)*c,Math.sin(s)*c*.8+l*c,Math.sin(s+1.3)*c*.4]};K.push({p:S.toArray(),ri:f-.5,ro:f+55,c:B,when:0,seed:k(),hero:1,rate:.35,dens:1.5});const ie=g(Math.cos(he)*(f+9),f+Math.sin(he)*(f+9),16);ne.push({p:ie.toArray(),r:32.5,c:Ce,when:0,seed:k(),kind:0,vel:[0,0,0]}),K.push({p:[ie.x,ie.y,ie.z-1],ri:32.5,ro:32.5*1.6,c:Ae,when:0,seed:k(),rate:1.4,dens:2.6});const ze=13;for(let a=0;a<ze+9+6;a++){const c=a<ze,s=a>=ze+9,l=p.range(0,6.283),h=c||s?p.range(8,118):p.range(120,200),w=a<2?p.range(15,23):4+17*p()*p(),m=s?-p.range(140,190):c?p.range(f*.25,f+40):p.range(-20,150),V=p.pick(p()<.55?pt:Ge),A=p()<.25;L.push({p:[Math.cos(l)*h,f+Math.sin(l)*h,m],r:w,c:V,when:0,seed:p(),vel:je(p,c?p.range(26,60):p.range(14,46)),w:c?p.range(.13,.3):p.range(.05,.13),c2:p.pick(Ge),inner:A?[p.range(-.2,.2),p.range(-.2,.2),p.range(.3,.55)]:[0,0,0]}),p()<.34&&K.push({p:L[L.length-1].p,ri:w,ro:w*p.range(1.3,1.6),c:p.pick([e.yellow,e.white,e.rose]),when:0,seed:p(),rate:p.range(.4,1.3),dens:1.1})}const Ne=P.clone().addScaledVector(R,-200),_e=P.clone().addScaledVector(R,30),Ke={a:Ne.toArray(),b:_e.toArray(),w:.3,when:0,seed:.11};n.rail!==!1&&Y.push(Ke);const W=a=>p.range(-a,a);U.push({a:[-235+W(20),262+W(20),62],b:[205+W(20),-34+W(20),96],w:.55,when:0,seed:p(),hum:.3}),U.push({a:[-190+W(20),26+W(20),132],b:[246+W(20),222+W(20),44],w:.32,when:0,seed:p(),hum:.3});for(const a of ut(p,[-150+W(15),10+W(10),70],[-28+W(15),-52+W(10),86],p.int(4,6),3.2,{w:.28,side:[0,0,1]}))Y.push(a);U.push({a:[-120,255,30],b:[150,300,40],w:.3,when:0,seed:p(),loop:p.range(7,10)}),U.push({a:[60+W(10),6,150],b:[78+W(10),4,152+W(4)],w:.3,when:0,seed:p(),wave:.9,waves:6}),U.push({a:[-175,150+W(20),60],b:[-163,156+W(20),64],w:.26,when:0,seed:p(),wave:.7,waves:7});const ge=-p.range(.5,.8),Ve=g(Math.cos(ge)*(f+20),f+Math.sin(ge)*(f+20),24);J.push({p:Ve.toArray(),axis:[-Math.cos(ge)*.9-.2,-Math.sin(ge)*.9+.38,0],n:[0,0,1],h:96,hb:17,lean:.3,edge:.9,c:e.yellow,c2:e.pblue,when:0,seed:p()}),J.push({p:[Ve.x+34,Ve.y-6,40],axis:[-.25,1,0],n:[.1,0,1],h:38,hb:7,lean:-.2,edge:.5,c:e.orange,c2:e.yellow,when:0,seed:p()});const Ye=p.range(3.25,3.6),ke=9.5,ft=g(Math.cos(Ye)*(f+3)-2.5*ke,f+Math.sin(Ye)*(f+3)-2.5*ke,30);for(const a of He(p,ft.toArray(),[1,.06,0],[.21,.98,0],5,5,ke,[e.yellow,e.red,e.pblue,e.orange,e.green,e.lviolet,e.rose],{ink:.5,empty:.16}))fe.push(a);await o.yield();const we=[e.yellow,e.orange,e.red,e.pblue,e.rose,e.green,e.lviolet,e.white,e.yellow,e.pblue],Z=(a,c,s)=>{const l=g().crossVectors(a,g(0,1,0)).normalize(),h=g().crossVectors(l,a).normalize(),w=c.range(0,6.283);return l.multiplyScalar(Math.cos(w)*s).addScaledVector(h,Math.sin(w)*s)},gt=(a,c,s)=>Oe(a,c+17)?s:[0,0,0],Ze=(a,c,s,l,h)=>{const w=l()<.2,m={p:a.toArray(),r:c,c:s,when:1,seed:l(),vel:h?[0,0,0]:gt(a,c,je(l,l.range(5,26))),w:l.range(.04,.11),c2:l.pick(we),inner:w?[l.range(-.2,.2),l.range(-.2,.2),l.range(.3,.55)]:[0,0,0]};L.push(m),l()<.33&&K.push({p:m.p,ri:c,ro:c*l.range(1.3,1.6),c:l.pick([e.yellow,e.white,e.rose,e.pblue]),when:1,seed:l(),rate:l.range(.3,1.4),dens:1.15})},wt=Math.round(56*(.4+.6*r));for(let a=0;a<6;a++){const c=62-25*a;for(let s=0;s<wt;s++){const l=C.getPointAt(t()),h=t.range(0,6.283),w=12+250*Math.pow(t(),1.35),m=1.2+15*t()*t()*t()+(t()<.05?12:0),V=t(),A=g(l.x+Math.cos(h)*w,c+t.range(-4.5,4.5),l.z+Math.sin(h)*w),x=t.pick(we),b=Ee(A);b>m*1.5+5&&(b>45||V<.4)&&Oe(A,m)&&Ze(A,m,x,t)}await o.yield()}for(let a=0;a<15;a++){const c=.06+.72*(a+t.range(.2,.8))/15,s=C.getPointAt(c),l=C.getTangentAt(c),h=t.range(1.1,2.8),w=s.clone().add(Z(l,t,h+t.range(4.2,6.5)));L.push({p:w.toArray(),r:h,c:t.pick(we),when:1,seed:t(),vel:l.clone().multiplyScalar(t.range(2,6)).toArray(),w:t.range(.1,.2)})}for(let a=0;a<9;a++){const c=t.range(0,6.283),s=t.range(260,420),l=g(60+Math.cos(c)*s,t.range(-150,90),-150+Math.sin(c)*s);Ze(l,t.range(18,44),t.pick([e.blue,e.blue,e.lviolet,e.violet,e.green]),t,!0)}const me=t.range(-.85,-.4),Qe=me-t.range(.5,.9),oe=[Math.cos(me),Math.sin(me)],xe=[Math.cos(Qe),Math.sin(Qe)],mt=I.clone().addScaledVector(D,40),E=(a,c,s=0)=>mt.clone().addScaledVector(H,a).addScaledVector(re,c).addScaledVector(D,-s),Pe=E(40*oe[0]-30*xe[0],40*oe[1]-30*xe[1]);ne.push({p:Pe.toArray(),r:75,c:e.blue,c2:e.black,inner:[xe[0]*.4,xe[1]*.4,40/75],when:1,seed:t(),kind:-1}),K.push({p:Pe.clone().addScaledVector(D,1).toArray(),ri:75,ro:75*1.45,c:e.white,when:1,seed:t(),rate:.3,dens:1.3}),K.push({p:I.clone().addScaledVector(D,.6).toArray(),ri:7.2,ro:13.5,c:e.yellow,when:1,seed:t(),rate:1.5,dens:1.4}),n.exitDisc!==!1&&ne.push({p:I.clone().addScaledVector(D,.5).toArray(),r:7,c:e.white,when:1,seed:t(),kind:2});for(let a=0;a<3;a++){const c=me+2.2+a*1.5+t.range(-.3,.3),s=t.range(13,24),l=Math.max(s+12,t.range(30,62));L.push({p:E(Math.cos(c)*l,Math.sin(c)*l,t.range(7,14)).toArray(),r:s,c:[e.yellow,e.rose,e.green][a],when:1,seed:t(),vel:[H.x*5,H.y*5+2,H.z*5],w:.08})}Y.push({a:E(-150,-40+t.range(-10,10),6).toArray(),b:E(120,62+t.range(-10,10),6).toArray(),w:.4,when:1,seed:t()}),Y.push({a:E(-60,120,9).toArray(),b:E(74+t.range(-10,10),-130,9).toArray(),w:.28,when:1,seed:t()}),J.push({p:E(-46,-84,12).toArray(),axis:re.clone().addScaledVector(H,.3).normalize().toArray(),n:D.clone().negate().toArray(),h:78,hb:10,lean:.25,edge:.7,c:e.rose,c2:e.rose,when:1,seed:t()});const Xe=H.clone().addScaledVector(re,.1),$e=re.clone().addScaledVector(H,.26),xt=E(oe[0]*31,oe[1]*31,10).addScaledVector(Xe,-13.5).addScaledVector($e,-16),Je=He(t,xt.toArray(),Xe.toArray(),$e.toArray(),6,7,4.6,[e.yellow,e.red,e.pblue,e.orange,e.green,e.rose,e.white],{ink:.22,empty:.12,when:1,from:e.violet.clone().multiplyScalar(.55)}).filter(a=>g(...a.p).sub(I).cross(D).length()>11.5);await o.yield();const yt=(a,c,s)=>{const l=Math.ceil(a.distanceTo(c)/4),h=g();for(let w=0;w<=l;w++)if(Ee(h.lerpVectors(a,c,w/l))<s)return!1;return!0};for(let a=0;a<12;a++)for(let c=0;c<6;c++){const s=a<6?.1+.75*(a+t())/6:t(),l=C.getPointAt(s),h=C.getTangentAt(s),w=Z(h,t,a<6?t.range(3.6,8):t.range(20,130)),m=g(t.range(-1,1),t.range(-.55,.55),t.range(-1,1)).normalize();a<6&&m.addScaledVector(w.clone().normalize(),-m.dot(w.clone().normalize())).addScaledVector(h,-.6*m.dot(h)).normalize();const V=a<6?t.range(60,200):t.range(120,400),A=t.range(.25,.75),x=l.clone().add(w),b=x.clone().addScaledVector(m,-V*A),T=x.clone().addScaledVector(m,V*(1-A));if(yt(b,T,3.2)){U.push({a:b.toArray(),b:T.toArray(),w:a<6?t.range(.07,.16):t.range(.2,.5),when:1,seed:t(),hum:a<6?.3:0});break}}{const a=C.getPointAt(.43),c=C.getTangentAt(.43),s=g().crossVectors(c,g(0,1,0)).normalize(),l=g(0,1,0).addScaledVector(s,.36).addScaledVector(c,.2).normalize();let h=-5.4;const w=[];for(let x=0;x<4;x++)w.push(h),h-=t.range(5,9.5);h=5.6;for(let x=0;x<5;x++)w.push(h),h+=t.range(5,9.5);for(const x of w){const b=a.clone().addScaledVector(s,x),T=t.range(22,40),le=t.range(58,80)-T;U.push({a:b.clone().addScaledVector(l,-T).toArray(),b:b.clone().addScaledVector(l,le).toArray(),w:.12,when:1,seed:t(),hum:.3})}const m=C.getPointAt(.68),V=C.getTangentAt(.68),A=Z(V,t,15);for(const x of ut(t,m.clone().add(A).addScaledVector(V,-95).toArray(),m.clone().add(A).addScaledVector(V,85).add(g(0,-30,0)).toArray(),t.int(5,7),2.6,{w:.13,when:1,side:A.toArray()}))Y.push(x)}for(let a=0;a<10;a++){const c=.08+.7*t(),s=C.getPointAt(c),l=C.getTangentAt(c),h=8+40*t()*t(),w=Z(l,t,h*.6+t.range(9,70));J.push({p:s.clone().add(w).add(g(0,-h*.4,0)).toArray(),axis:[t.range(-.4,.4),1,t.range(-.4,.4)],n:l.clone().negate().toArray(),h,hb:h*t.range(.13,.22),lean:t.range(-.5,.5),c:t.pick([e.white,e.pblue,e.rose,e.lviolet,e.yellow]),when:1,seed:t()})}{const a=C.getPointAt(.5),c=C.getTangentAt(.5),s=Math.round(26*(.5+.5*r));for(let V=0;V<s;V++){const A=Z(c,t,t.range(7,22)),x=t.range(1.5,4),b=t.range(46,54);J.push({p:a.clone().add(A).addScaledVector(c,t.range(-30,30)).toArray(),axis:c.toArray(),n:A.clone().normalize().toArray(),h:x,hb:x*.2,lean:0,edge:.09,c:t.pick([e.yellow,e.orange,e.white]),when:1,seed:t(),vel:c.clone().multiplyScalar(b).toArray(),span:330})}const l=C.getPointAt(.15),h=C.getTangentAt(.15),w=g().crossVectors(h,g(0,1,0)).normalize(),m=g(.2,1,0).normalize();for(const V of He(t,l.clone().addScaledVector(w,-26).add(g(0,-10,0)).toArray(),w.clone().addScaledVector(h,-.5).normalize().toArray(),m.toArray(),5,4,3,we,{ink:.3,empty:.15,when:1}))fe.push(V)}for(let a=0;a<5;a++){const c=.05+.65*(a+t())/5,s=C.getPointAt(c),l=C.getTangentAt(c),h=s.clone().add(Z(l,t,t.range(2,9))).add(g(0,-t.range(12,20),0)),w=t.int(5,10),m=t.range(4,20),V=t.range(-.4,.4),A=t.range(.5,1.1),x=t.range(0,3.14);for(let b=0;b<w;b++){const T=V+A*((b+t.range(-.3,.3))/(w-1)-.5)*2,le=m*t.range(.45,1)*.72;U.push({a:h.toArray(),b:[h.x+Math.sin(T)*Math.cos(x)*le,h.y+Math.cos(T)*le,h.z+Math.sin(T)*Math.sin(x)*le],w:t.range(.035,.06),when:1,seed:t(),hum:.12})}if(a%2===0){const b=h.clone().add(g(t.range(-5,5),t.range(2,6),t.range(-5,5))),T=t.range(.9,1.8);L.push({p:b.toArray(),r:T,c:t.pick([e.red,e.yellow,e.orange]),c2:e.white,inner:[0,0,.45],when:1,seed:t()}),Y.push({a:[b.x-T*2.4,b.y-T*2.9,b.z],b:[b.x+T*1.5,b.y+T*1.9,b.z],w:.1,when:1,seed:t()})}}const et=[U.findIndex(a=>a.loop)];for(let a=0;a<2;a++){const c=.3+.4*a,s=C.getPointAt(c),l=C.getTangentAt(c),h=Z(l,t,t.range(16,30)),w=s.clone().add(h),m=g().crossVectors(h,l).normalize().addScaledVector(l,.5).normalize();U.push({a:w.clone().addScaledVector(m,-110).toArray(),b:w.clone().addScaledVector(m,130).toArray(),w:.3,when:1,seed:t(),loop:t.range(6.5,9)}),et.push(U.length-1)}for(let a=0;a<4;a++){const c=t.range(.15,.85),s=C.getPointAt(c),l=C.getTangentAt(c),h=s.clone().add(Z(l,t,t.range(7,16))),w=l.clone().add(g(t.range(-.4,.4),t.range(-.2,.2),t.range(-.4,.4))).normalize(),m=t.range(8,20);U.push({a:h.toArray(),b:h.clone().addScaledVector(w,m).toArray(),w:.2,when:1,seed:t(),wave:t.range(.5,1),waves:t.int(5,9)})}await o.yield();const We=[],St=Math.round(7e3*r),bt=Math.round(2e3*r),tt=g().crossVectors(R,g(0,1,0)).normalize(),Mt=g().crossVectors(tt,R).normalize();for(let a=0;a<St;a++){const c=-78*Math.pow(z(),1.6),s=.7+44*Math.pow(z(),2.1),l=z.range(0,6.283),h=z(),w=z(),m=P.clone().addScaledVector(R,c).addScaledVector(tt,Math.cos(l)*s).addScaledVector(Mt,Math.sin(l)*s);m.distanceTo(S)<f+.4&&m.sub(S).setLength(f+.4+s*.2).add(S),We.push(m.x,m.y,m.z,.012+.09*h*h*h,0,w,0,0),a%1500===1499&&await o.yield()}for(let a=0;a<bt;a++){const c=z.range(-15,5)*z(),s=7.6+8.5*z()*z(),l=z.range(0,6.283),h=z(),w=z(),m=I.clone().addScaledVector(D,c).addScaledVector(H,Math.cos(l)*s).addScaledVector(re,Math.sin(l)*s);We.push(m.x,m.y,m.z,.02+.2*h*h,1,w,1,0)}await o.yield();const ot=.9;n.cast&&await n.cast({films:L,solids:ne,halos:K,lines:Y,bent:U,plates:J,squares:fe,heartSq:Je,rail:Ke,fly:$,skin:P,curve:C,head:ot});const Q=a=>a.filter(c=>!c.cut);y.add(It(Q(K),u)),await o.yield(),y.add(Ie(Q(ne),{U:v,solid:!0})),y.add(Ie(Q(L),u)),await o.yield(),y.add(ht(Q(fe),u));const at=ht(Q(Je),u);y.add(at),y.add(Gt(Q(J),u)),await o.yield(),y.add(vt(Q(Y),{U:v,segs:24})),y.add(vt(Q(U),{U:v,segs:48})),await o.yield(),y.add(Ht(We,{U:v,colors:[B,e.yellow,e.white]}));const Re=et.filter(a=>a>=0&&!U[a].cut).map(a=>U[a]),rt=Ie(Re.map(a=>({p:a.a,r:ot,c:a.when?e.white:e.black,when:a.when,seed:a.seed,kind:2})),{U:v,solid:!0,order:-7.5});y.add(rt);const ce=Nt();n.wash!==!1&&y.add(ce),await o.yield();const De=n.night??_("wchnight");let O=_("wchu");const Ct=n.uSkin??.5,At=e.black.clone().lerp(e.violet,.35),ye=g(),Ue=g(),nt=g(),it=g(),zt=new i.Color,Vt=new i.Vector2,Se=new i.Color(1,1,1),kt=new i.Color(1,1,1);let be=null,ae=!1,Me=0;const ct=rt.children[0].geometry.getAttribute("iPos"),Te=(a,c,s)=>{const l=Math.min(1,Math.max(0,(s-a)/(c-a)));return l*l*(3-2*l)};return{object:y,radius:190,height:300,center:S.clone(),ground:!1,groundY:0,U:v,pigments:e,variant:M,groundKind:te,place:{position:[-110,-55,660],rotationY:Math.PI},anchors:{center:S.clone(),skin:{position:P.clone(),direction:R.clone()},rail:{a:Ne.clone(),b:_e.clone()},flyThrough:$.map(a=>a.clone()),portalSeat:{position:I.clone(),facing:D.clone().negate(),direction:D.clone()},blueCircle:{center:Pe.clone(),radius:75},heart:E(40*oe[0],40*oe[1]),companion:ie.clone(),viewpoints:{first:g(0,110,660),reveal:P.clone().addScaledVector(R,-330),close:P.clone().addScaledVector(R,-45),night:$[4].clone(),exit:I.clone().addScaledVector(D,-110)}},setProgress(a){be=a},setNight(a){be=null,ae=a>.5},setWash(a,c){Se.set(a),Me=c},update(a,c,s){if(O!=null){y.updateWorldMatrix(!0,!1);const A=g(-114,53,620),x=O<.5?A.lerp(P,O/.5):C.getPointAt(Math.min(1,(O-.5)/.5)),b=O<.5?x.clone().addScaledVector(R,60).lerp(S,.25):O>.97?x.clone().add(D):C.getPointAt(Math.min(1,(O-.5)/.5+.06));O<.5&&x.add(g(1.6,1.2,0)),s.position.copy(x.applyMatrix4(y.matrixWorld)),s.lookAt(b.applyMatrix4(y.matrixWorld)),s.updateMatrixWorld(!0),ae=O>=.5}s.getWorldPosition(ye),s.getWorldDirection(v.uGaze.value),y.updateWorldMatrix(!0,!1),Ue.copy(S).applyMatrix4(y.matrixWorld),nt.copy(P).applyMatrix4(y.matrixWorld),it.copy(I).applyMatrix4(y.matrixWorld),v.uHeroC.value.copy(Ue),v.uTime.value=c;const l=o.renderer;l&&l.getDrawingBufferSize&&(v.uViewH.value=l.getDrawingBufferSize(Vt).y);const h=ye.distanceTo(Ue),w=ye.distanceTo(nt);o.through?ae=!1:be!=null?ae=be>=Ct:h<f&&(ae=!0);const m=De??(ae?1:0);v.uNight.value=m;const V=De!=null||o.through?0:.85*(m?1-Te(2,17,w):1-Te(1,13,h-f));ce.material.uniforms.uWash.value.copy(kt).lerp(At,V).multiply(zt.setRGB(1+(Se.r-1)*Me,1+(Se.g-1)*Me,1+(Se.b-1)*Me)),at.setWake(1-Te(45,300,ye.distanceTo(it)));for(let A=0;A<Re.length;A++){const x=Re[A],b=Lt(c,x.loop,x.seed);ct.setXYZ(A,x.a[0]+(x.b[0]-x.a[0])*b,x.a[1]+(x.b[1]-x.a[1])*b,x.a[2]+(x.b[2]-x.a[2])*b)}ct.needsUpdate=!0},dispose(){ce.parent||(ce.geometry.dispose(),ce.material.dispose())}}}export{Wt as COVER_GLSL,st as MIXES,lt as PALETTE,dt as STYLE_GLSL,X as U,Qt as buildHero,ut as bundle,He as chequerBoard,jt as chequerMaterial,Fe as filmMaterial,Ft as haloMaterial,Lt as lineHead,Et as lineMaterial,ht as makeChequer,Dt as makeField,Ie as makeFilms,Ht as makeGrain,Ut as makeGreatCircle,It as makeHalos,Zt as makeHatch,vt as makeLines,Gt as makePlates,Pt as makeUniforms,Nt as makeWash,Be as pigments,Ot as plateMaterial};
