import*as t from"three";const O=Math.PI*2,Ie=["#E4DCCB","#D8283A","#E66E58","#F6C453","#7FD1C2","#17414A","#DDF3EE"],J=12,be=160,Se=3,C=150;function Me(){return{pos:[],nor:[],uv:[],dat:[],idx:[]}}function Ae(a,o,n,h,v,w,u){const G=a.pos.length/3,z=o.length;for(let i=0;i<z;i++){const[c,s,r]=o[i],d=o[Math.max(0,i-1)],g=o[Math.min(z-1,i+1)];let M=g[0]-d[0],m=g[1]-d[1];const A=Math.hypot(M,m)||1;M/=A,m/=A;const[y,F]=h(c);for(let b=0;b<=n;b++){const T=b/n*O,_=Math.cos(T),D=Math.sin(T),W=r?1+r*.5*Math.cos(T*u):1,R=c+(r?r*.9*(.5+.5*Math.cos(T*u)):0);a.pos.push(y+_*s*W,R,F+D*s*W),a.nor.push(_*M,-m,D*M),a.uv.push(b/n,R),a.dat.push(v,w,i>=z-3?1:0)}}for(let i=0;i<z-1;i++)for(let c=0;c<n;c++){const s=G+i*(n+1)+c,r=s+n+1;a.idx.push(s,r,s+1,s+1,r,r+1)}}function ze(a,o,n,h){const v=[],w=n*a.range(1.25,1.5),u=Math.min(.32,n*.22)*(h?1.25:1);h&&v.push([-1.5,w*1.05]),v.push([.2,w],[o*.035+1.2,n*.98]);const G=h?9:2,z=[];for(let c=0;c<(h?4:1);c++)a.chance(h?1:.5)&&z.push(a.range(.15,.9));for(let c=1;c<=G;c++){const s=c/(G+1);v.push([o*s,n*(.9+.1*s)*(1+a.range(-.025,.025))])}for(const c of z){const s=o*c,r=n*a.range(.5,1.1),d=n*(.9+.1*c);h?v.push([s-r,d],[s-r*.8,d*1.07],[s+r*.8,d*1.075],[s+r,d*1]):v.push([s-r,d*1.08],[s+r,d*1.09])}v.sort((c,s)=>c[0]-s[0]);const i=n*1.04;return h?v.push([o-u*3.2,i],[o-u*1.4,i*1.03],[o-u*.9,i+u*.75,0],[o-u*.25,i+u*1.05,u*.5],[o+u*.3,i+u*.55,u*.8],[o+u*.25,i-u*.3,u*.6],[o-u*1.2,i-u*.9],[o-3,i*.8],[o-3.01,.001]):v.push([o-u*2.4,i],[o-u*.7,i+u*.95,u*.3],[o+u*.3,i+u*.5,u*.8],[o-u*.6,i-u*.8,u*.2],[o-2.4,i*.8],[o-2.41,.001]),v}async function Le(a,o){const n=[],h=a.range(.004,.012);n.push({x:-J,z:0,H:be,R:Se,master:1,lx:0,lz:0,bow:-h}),n.push({x:J,z:0,H:be,R:Se,master:1,lx:0,lz:0,bow:h});const v=[135,112,90,68,48],w=[3.1,6.2,10,13.8,17.7],u=a.range(2.4,2.8),G=a.range(.9,1.02),z=a.range(0,O),i=a.range(0,2.2);let c=0;for(;n.length<194&&c++<9e3;){(c&511)===0&&await o.yield?.();const s=a.range(-63,63),r=a.range(-19,19),d=Math.max(Math.abs(s)-J,0),g=Math.hypot(d/u,r/G),M=g+i*Math.sin(Math.atan2(r,s)*3+z)*(g/17.7);if(M>17.7)continue;let m=0;for(;M>w[m];)m++;m===0&&Math.abs(s)<11.5&&(m=1),Math.abs(s)<9&&Math.abs(r)<5&&m<2&&(m=2);const A=a.range(1.15,1.9)*(m===0?1.2:m===4?.85:1);let y=!0;for(const _ of n)if(Math.hypot(_.x-s,_.z-r)<(_.R+A)*.86){y=!1;break}if(!y)continue;const F=v[m]*(m===0?a.range(.92,1.05):a.range(.86,1.07))+a.range(-2,2),b=Math.hypot(s,r)||1,T=a.range(0,.03)*(m/4);n.push({x:s,z:r,H:F,R:A,master:0,rank:m,lx:s/b*T,lz:r/b*T,bow:a.range(-.5,.5)})}return n}function Fe(a,o,n,h,v,w,u,G){const z=a.pos.length/3,i=new t.Vector3,c=new t.Vector3,s=new t.Vector3,r=new t.Vector3,d=new t.Vector3,g=new t.Vector3(0,0,1);let M=0;const m=o(0).clone();for(let A=0;A<=h;A++){const y=A/h,F=.5/h;i.copy(o(y)),M+=i.distanceTo(m),m.copy(i),c.copy(o(u?y+F:Math.min(1,y+F))),s.copy(o(u?y-F:Math.max(0,y-F))),s.subVectors(c,s).normalize(),r.crossVectors(g,s),r.lengthSq()<1e-6&&r.set(1,0,0),r.normalize(),d.crossVectors(s,r);const b=n(y);for(let T=0;T<=v;T++){const _=T/v*O,D=Math.cos(_),W=Math.sin(_),R=r.x*D+d.x*W,P=r.y*D+d.y*W,L=r.z*D+d.z*W;a.pos.push(i.x+R*b,i.y+P*b,i.z+L*b),a.nor.push(R,P,L),a.uv.push(T/v,M*G),a.dat.push(w,1e4,0)}}for(let A=0;A<h;A++)for(let y=0;y<v;y++){const F=z+A*(v+1)+y,b=F+v+1;a.idx.push(F,F+1,b,F+1,b+1,b)}}function Te(a){const o=new t.BufferGeometry;return o.setAttribute("position",new t.Float32BufferAttribute(a.pos,3)),o.setAttribute("normal",new t.Float32BufferAttribute(a.nor,3)),o.setAttribute("uv",new t.Float32BufferAttribute(a.uv,2)),o.setAttribute("aDat",new t.Float32BufferAttribute(a.dat,3)),o.setIndex(a.idx),o}const U=`
  uniform vec3 uSunDir, uSunCol, uFill, uTeal;
  uniform float uShade, uTime;
  float hash11(float n) { return fract(sin(n * 127.1 + 3.7) * 43758.5453); }
  float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y);
  }
  // sky fill: jade from above, teal bounce from below; never grey
  vec3 fillLightS(float ny, float sh) { return mix(uFill * 0.55 + vec3(0.06, 0.02, 0.015), uFill, 0.5 + 0.5 * ny) * (1. + 0.06 * sh); }
  vec3 fillLight(float ny) { return fillLightS(ny, uShade); }
  // Fill for an ivory pipe, so that it has form in shade as well as in sun: brighter toward the sun's quarter of the sky,
  // deep and cool at the foot rising to a pale lip, and a warm bounce from the sunlit plumes on the side turned from the sun.
  vec3 pipeFill(vec3 N, float sh, float hg, vec3 warm) {
    vec2 sa = uSunDir.xz / max(length(uSunDir.xz), 1e-4);
    float az = dot(N.xz, sa), lee = 0.5 - 0.5 * az;
    vec3 cool = mix(vec3(1.), uTeal / max(max(uTeal.r, uTeal.g), max(uTeal.b, 1e-3)), 0.5);
    float azK = 0.3;                      // in sun the side turned from it is plainly darker and cooler
    float lipK = hg * hg * hg;
    vec3 sky = fillLightS(N.y, sh) * (1. - azK + azK * az) * mix(0.2 + 0.42 * (1. - sh), 1.14 - 0.42 * sh + 0.34 * sh * lipK, mix(hg, hg * hg, sh)) * mix(mix(vec3(1.), cool, 0.6 + 0.4 * sh), vec3(1.), hg);
    sky *= mix(vec3(1.), cool, 0.4 * lee * (1. - sh));
    return sky * (1. - 0.42 * sh) + warm * lee * lee * mix(0.36, 0.22, hg) * (0.1 + 0.9 * sh);
  }
  // a high sun rakes upright pipes only weakly: for them the key is taken from lower down, so each has a lit side
  float pipeKey(vec3 N) { float k = clamp((dot(N, normalize(uSunDir * vec3(1., 0.5, 1.) + vec3(0., 1e-4, 0.))) + 0.5) / 1.5, 0., 1.); return k * k * 1.22; }
  // thin ground mist that gathers wherever a cloud's shadow lies: near, middle and far ranks part into separate tones
  vec3 shadeMist(vec3 col, vec3 w, float sh) {
    float d = length(cameraPosition - w);
    float f = (1. - exp(-d * 0.011)) * (1. - smoothstep(0.5, 8., w.y)) * smoothstep(0.08, 0.55, sh) * 0.42;
    return mix(col, uFill * 0.5 + vec3(0.012), f);
  }
  // On the Spire the shade is a front that climbs: everything below uShadeY is in the cloud's shadow, the rest still in sun.
  #ifdef HERO_SHADE
    uniform float uShadeY;
    #define SHADE_AT(y) (uShade * (1. - smoothstep(uShadeY - 7., uShadeY + 7., (y))))
  #else
    #define SHADE_AT(y) uShade
  #endif
`;function Ce(a,o,n){return new t.ShaderMaterial({defines:n?{HERO_SHADE:1}:{},uniforms:{...a,uIvory:{value:o[0]},uGold:{value:o[3]},uCoral:{value:o[2]},uOpen:{value:1}},fog:!0,vertexShader:`
      attribute vec3 aDat;
      varying vec3 vW, vN; varying vec2 vUv; varying vec3 vDat;
      #include <fog_pars_vertex>
      void main() {
        vUv = uv; vDat = aDat;
        vec4 w = modelMatrix * vec4(position, 1.);
        vW = w.xyz; vN = mat3(modelMatrix) * normal;
        vec4 mvPosition = viewMatrix * w;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${U}
      uniform vec3 uIvory, uGold, uCoral; uniform float uOpen;
      varying vec3 vW, vN; varying vec2 vUv; varying vec3 vDat;
      #include <fog_pars_fragment>
      void main() {
        float seed = vDat.x, H = vDat.y, throat = vDat.z;
        float shd = SHADE_AT(vW.y);
        vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
        float ang = vUv.x * 6.2831853, y = vUv.y;
        // growth rings 0.4 m apart: a raised rib, a hairline groove, a faint amber band
        float rp = y / 0.4 + 0.25 * vnoise(vec2(ang * 1.5 + seed * 9., y * 0.3)) + seed * 7.;
        float rf = fract(rp), rid = floor(rp);
        float near = 1. - smoothstep(0.1, 0.36, fwidth(rp));                         // rings melt away when sub-pixel
        float rib = smoothstep(0.0, 0.18, rf) * (1. - smoothstep(0.18, 0.5, rf)) * near;
        float groove = (1. - smoothstep(0.0, 0.05, abs(rf - 0.93))) * near;
        float flute = cos(ang * 8. + seed * 20.);
        // bend the normal with ribs and flutes (tangent frame from N and up)
        vec3 Tn = normalize(cross(vec3(0., 1., 0.), N) + vec3(1e-4, 0., 1e-4));
        float dRib = (smoothstep(0.0, 0.18, rf + 0.04) * (1. - smoothstep(0.18, 0.5, rf + 0.04)) * near - rib) * 6.;
        N = normalize(N + Tn * sin(ang * 8. + seed * 20.) * 0.22 - vec3(0., 1., 0.) * (dRib * 0.13 - groove * 0.12));
        vec3 alb = uIvory * (0.9 + 0.1 * hash11(seed * 13.1));
        alb *= mix(vec3(1.), vec3(1.0, 0.86, 0.62), 0.22 * hash11(rid + seed * 31.) * smoothstep(0.5, 0.95, rf));   // amber band
        alb *= 1. - 0.22 * groove;
        alb *= 0.93 + 0.07 * flute;
        float blotch = vnoise(vec2(ang * 2.2 + seed * 40., y * 0.12));
        alb *= 0.88 + 0.16 * blotch;                                                  // old repairs, weathering
        // sea-green algal felt in the grooves of the lee side, strongest low down
        float lee = smoothstep(0.35, 0.95, dot(N, normalize(vec3(0.75, 0., 0.65))));
        float felt = lee * mix(0.35, smoothstep(0.55, 1., rf), near) * smoothstep(0.35, 0.75, vnoise(vec2(ang * 5., y * 0.7 + seed)));
        float hN = H > 9000. ? 0.85 : y / max(H, 1.);
        alb = mix(alb, vec3(0.24, 0.5, 0.42), 0.4 * felt * (1. - smoothstep(0.2, 0.9, hN)));
        // gold lichen freckles under the lip
        float nearLip = smoothstep(H - 3.5, H - 0.4, y) * step(y, H + 2.) * step(H, 9000.);
        float fre = smoothstep(0.72, 0.8, vnoise(vec2(ang * 14., y * 5.) + seed * 3.));
        alb = mix(alb, uGold * 0.85, fre * nearLip * 0.8);
        // light
        // fallen filaments banked against the foot
        float drift = (1. - smoothstep(0.5, 1.5 + 1.2 * vnoise(vec2(ang * 3. + seed * 5., seed * 9.)), y)) * step(H, 9000.);
        alb = mix(alb, mix(uCoral * vec3(0.95, 0.6, 0.7), uIvory * vec3(1., 0.9, 0.7), 0.55 * vnoise(vec2(ang * 9., y * 6. + seed * 3.))) * (0.7 + 0.3 * vnoise(vec2(ang * 40., y * 3.))), drift * 0.85);
        float hg = smoothstep(0.0, 0.75, hN);
        float ao = (0.62 + 0.38 * smoothstep(0.2, 0.98, hN)) * (0.86 + 0.14 * flute);
        float ndl = pipeKey(N);
        vec3 lit = uSunCol * ndl * (1. - shd) * mix(0.7, 1., ao) + pipeFill(N, shd, hg, uCoral) * (0.86 + 0.14 * flute);
        // in shade each pipe keeps a pale rim, brightest on the side toward the sunlit country
        vec3 Vr = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.));
        float rimK = 1. - abs(dot(N, Vr)); rimK *= rimK * rimK;
        lit += (uFill * 0.55 + uSunCol * 0.3 * max(dot(N.xz, uSunDir.xz / max(length(uSunDir.xz), 1e-4)), 0.)) * rimK * shd * (0.45 + 0.55 * hg);
        // red light spilling down from the open plume above
        lit += uCoral * 0.22 * uOpen * smoothstep(H - 9., H, y) * step(y, H + 2.);
        vec3 col = alb * lit;
        col = mix(col, uTeal * (0.5 + 0.9 * fillLightS(1., shd)), throat * 0.92);           // dark teal throat
        col = shadeMist(col, vW, shd);
        gl_FragColor = vec4(min(col, vec3(1.18)), 1.);                                    // sunlit ivory is the brightest solid thing there is
        #include <fog_fragment>
      }`})}function re(a,o,n,h){const v=[],w=[],u=Math.round(a*n);for(let s=0;s<2;s++){const r=v.length/3;for(let d=0;d<=u;d++)for(let g=0;g<=o;g++)v.push(d/u,Math.pow(g/o,.8),s);for(let d=0;d<u;d++)for(let g=0;g<o;g++){const M=r+d*(o+1)+g,m=M+o+1;w.push(M,m,M+1,M+1,m,m+1)}}const G=v.length/3,z=h,i=6;for(let s=0;s<=z;s++)for(let r=0;r<=i;r++)v.push(s/z,r/i,2);for(let s=0;s<z;s++)for(let r=0;r<i;r++){const d=G+s*(i+1)+r,g=d+i+1;w.push(d,g,d+1,d+1,g,g+1)}const c=new t.InstancedBufferGeometry;return c.setAttribute("position",new t.Float32BufferAttribute(v,3)),c.setIndex(w),c.boundingSphere=new t.Sphere(new t.Vector3(0,130,0),160),c}const le=`
  uniform vec4 uStand;       // the field's three phases s0, s1, s2 and the paint's strength (0 on the Spire, 1 in the forest)
  uniform vec2 uStandW;      // the wind's direction, a constant of the place
  float standF(vec2 p) { float a = dot(p, uStandW), c = dot(p, vec2(-uStandW.y, uStandW.x)); return sin(c * 0.015 + 1.5 * sin(a * 0.007 + uStand.y) + 0.6 * sin(a * 0.019 + uStand.z) + uStand.x); }
  // an animal's class by its root: +1 in an old street, -1 in a spawning street, 0 elsewhere
  float standOf(vec2 root) { float S = standF(root) + 0.12 * (fract(sin(dot(root, vec2(12.9898, 78.233))) * 43758.5453) - 0.5); return (step(0.76, S) - step(S, -0.76)) * uStand.w; }
  // an old street is older growth: a tint laid over whatever is already drawn there (pale heart, banding, light and shade all stay underneath).
  // At k = 1 it takes the crown's mean colour halfway to the look's wine; it lets go of the brightest filaments (largest channel 0.3 to 0.8) and spares a channel the pixel hardly has (whole from half of its largest, none under a tenth), so no channel is emptied; k is the class, let go in a cloud's shade by the caller
  vec3 standTint(vec3 c, vec3 coral, vec3 crimson, vec3 wine, float k) { float v = max(c.r, max(c.g, c.b)); return c * mix(vec3(1.), wine / max(mix(crimson, coral, 0.5), vec3(1e-3)), 0.5 * k * (1. - smoothstep(0.3, 0.8, v)) * smoothstep(0.1, 0.5, c / max(v, 1e-4))); }
`,_e=`
  attribute vec3 iRoot;      // mouth centre (local)
  attribute vec4 iSize;      // plume height, plume radius, handedness (+1 / -1), seed
  attribute vec2 iOrder;     // flinch order 0-1 (terraces: by height; great: 0 west, 1 east), hue shift
  uniform float uTime, uTurns, uLow, uSlopeLo, uSlopeHi, uGreat, uFlinchT, uCamFlinch, uSpin, uRoot0;
  uniform vec2 uFlinchG;
  ${le}
  varying float vStand;
  varying vec3 vW; varying vec4 vP; varying vec3 vI;
  #include <fog_pars_vertex>
  void main() {
    float a = position.x, s = position.y, part = position.z;
    float Hp = iSize.x, Rp = iSize.y, hand = iSize.z, seed = iSize.w;
    vec3 rootW = (modelMatrix * vec4(iRoot, 1.)).xyz;
    vStand = standOf(rootW.xz);
    // retraction R for this animal
    //<retraction>
    float Rt = smoothstep(0., 0.1, uFlinchT * 1.12 - iOrder.x - 0.02 * seed);
    float dc = distance(cameraPosition, rootW + vec3(0., Hp * 0.5, 0.));
    Rt = max(Rt, 1. - smoothstep(uCamFlinch * 0.75, uCamFlinch + 0.001, dc));
    float R = mix(Rt, mix(uFlinchG.x, uFlinchG.y, iOrder.x), uGreat);
    //</retraction>
    float isStalk = step(1.5, part);
    float aa = mix(a, 0., isStalk);
    float ang, r, y, hf;
    float stalkR = Rp * 0.035 + 0.05;
    if (isStalk > 0.5) {
      ang = a * 2.5 + position.y * 6.2831853;
      r = stalkR * (1.15 - 0.6 * a);
      y = Hp * (-0.06 + 0.76 * a);
      hf = a * 0.7;
    } else {
      float rad = Rp * mix(uLow, 1., aa * (2. - aa));
      float slope = mix(uSlopeLo, uSlopeHi, smoothstep(0., 0.5, aa));
      ang = hand * (aa * uTurns * 6.2831853 + part * 3.14159265) + seed * 6.2831853;
      // a ripple running up the spiral, tips trembling
      float rip = sin(aa * uTurns * 6.2831853 * 1.0 - uTime * 1.7 + seed * 40.);
      float trem = sin(uTime * 6.1 + aa * 310. + seed * 9.) * s * s * s;
      r = stalkR * 0.6 + s * rad * (1. + 0.035 * rip);
      y = Hp * (uRoot0 + 0.62 * aa) + rad * (slope * s - 0.22 * s * s * s * s * sign(slope + 0.3)) + rad * (0.03 * rip * s + 0.012 * trem);
      ang += hand * (0.10 * s * s + 0.02 * trem);                       // filaments sweep back a little
      hf = clamp((0.05 + 0.62 * aa) + 0.3 * s, 0., 1.);
    }
    ang += hand * uTime * 0.157 * uSpin;                                // one turn in 40 s; opposite hands counter-turn
    float Rv = clamp(R * 1.3 - 0.3 * hf, 0., 1.);
    float k = 1. - Rv;
    r *= mix(k, 1. - 0.45 * Rv, isStalk);
    ang += hand * 18.85 * Rv * (1. - isStalk);                          // three turns on the way down
    y = y * k * k - (2.5 + Hp * 0.04) * Rv * (1. - 0.8 * uGreat);      // the great plumes stop at the lip: their folded tips still show in the mouths
    vec3 p = iRoot + vec3(cos(ang) * r, y, sin(ang) * r);
    p.x += uGreat * sign(iRoot.x) * max(y, 0.) * 0.14;                  // the great plumes lean apart, so there is sky between their upper whorls
    vec4 w = modelMatrix * vec4(p, 1.);
    vW = w.xyz;
    vP = vec4(aa * uTurns, s, part, Rv);
    vI = vec3(seed, iOrder.y, aa);
    vec4 mvPosition = viewMatrix * w;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,Ge=`
  ${U}
  uniform vec3 uCoral, uCrimson, uWine, uGold, uGlowA, uGlowB;
  uniform float uFil, uPin, uGreat, uFogK, uCore;
  ${le}
  varying float vStand;
  varying vec3 vW; varying vec4 vP; varying vec3 vI;
  #include <fog_pars_fragment>
  void main() {
    float s = vP.y, part = vP.z, seed = vI.x, aa = vI.z;
    vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.));
    vec3 dx = dFdx(vW), dy = dFdy(vW);
    vec3 N = cross(dx, dy); N = N / max(length(N), 1e-9); N = normalize(N + vec3(0., 1e-4, 0.));
    if (dot(N, V) < 0.) N = -N;
    float shd = SHADE_AT(vW.y);
    float sunK = 1. - shd;
    vec3 col;
    if (part > 1.5) {
      // the stalk: coral, ringed, fleshy
      float ring = 0.5 + 0.5 * sin(vP.x * 3. + aa * 240.);
      vec3 alb = mix(uCoral, uCrimson, 0.25 + 0.2 * ring) * 0.85;
      col = alb * (uSunCol * sunK * (0.25 + 0.75 * max(dot(N, uSunDir), 0.)) + fillLightS(N.y, shd) * 0.8);
    } else {
      float fx = vP.x * uFil + part * 0.5;
      float fw = fwidth(fx);
      float id = floor(fx), f = fract(fx) - 0.5;
      float len = 0.74 + 0.26 * hash11(id * 1.37 + seed * 91. + part * 17.);        // hashed lengths: a fringe, not an edge
      len *= 1. - 0.25 * smoothstep(0.9, 1., aa) - 0.3 * (1. - smoothstep(0., 0.03, aa));
      float sn = s / len;
      if (sn > 1.) discard;
      // rod: tapering, a hand thick; pinnules: herringbone barbs on both sides, shorter toward the tip
      float rodW = mix(0.2, 0.05, sn) / max(0.25 + s * 3.5, 0.25);                   // rods fuse at the root
      float rod = 1. - smoothstep(rodW, rodW + max(fw, 0.02), abs(f));
      float pc = sn * len * uPin - abs(f) * 2.6;
      // barbs keep to 2-4 px by halving their count with distance, so the vane never turns to mush
      float pw = fwidth(s) * uPin + fw * 2.6;
      float lod = clamp(log2(max(pw, 1e-4) / 0.2), 0., 5.);
      float l0 = floor(lod), sc = exp2(-l0);
      float b0 = 1. - smoothstep(0.24, 0.24 + max(pw * sc, 0.03), abs(fract(pc * sc) - 0.5));
      float b1 = 1. - smoothstep(0.24, 0.24 + max(pw * sc * 0.5, 0.03), abs(fract(pc * sc * 0.5) - 0.5));
      float pin = mix(b0, b1, smoothstep(0.35, 0.85, lod - l0));
      float pinLen = 0.5 * (1. - sn * sn * sn) * smoothstep(0.02, 0.12, sn) + 0.02;
      pin *= 1. - smoothstep(pinLen - 0.04, pinLen, abs(f));
      float alpha = max(rod, pin);
      float sheet = smoothstep(0.3, 0.8, fw);                                        // rods under ~2 px: a flat 55 % sheet
      // far off, filaments are drawn in bundles at least ~2.5 px wide with their own hashed lengths: a fringe, never a dot screen
      float gw = exp2(ceil(log2(max(fw * 2.5, 1.))));
      float gid = floor(fx / gw), gf = fract(fx / gw);
      float lenG = 0.62 + 0.38 * hash11(gid * 1.91 + seed * 37. + part * 5.);
      // (further still, where a bundle is only a pixel or two, the gaps close up: a solid plume, not a dot screen)
      float aSheet = step(sn, lenG) * mix(1., step(0.36, gf), smoothstep(0.5, 0.72, sn) * (1. - smoothstep(1.2, 3., fw)));
      alpha = mix(alpha, aSheet, sheet);
      if (alpha < 0.5) discard;
      // colour by radius: coral core, crimson mid, wine tip
      vec3 alb = mix(uCoral * vec3(1., 1.3, 1.1), mix(uCrimson, uCoral, 0.18), smoothstep(uCore, 0.95, sn));
      alb = mix(alb, uWine * 1.6, smoothstep(0.78, 1., sn) * 0.75);
      alb *= 0.8 + 0.4 * hash11(id * 0.77 + seed * 5.) * mix(1., 0.5, sheet);
      alb *= 0.9 + 0.2 * vnoise(vec2(fx * 0.06, seed * 7.));                          // slow banding along the ramp                           // filament to filament
      alb = mix(alb, alb * vec3(1.08, 0.8, 0.7), vI.y);                              // animal to animal
      alb = mix(alb, uGold, 0.5 * (1. - sheet) * rod * (1. - smoothstep(0.0, 0.07, sn)));   // gold at the roots
      alb = mix(alb, uGold * 0.8, step(0.5, -vStand) * (1. - smoothstep(0.35, 0.5, sn)));   // a spawning street: gold-hearted to mid-length
      float ndl = dot(N, uSunDir);
      float front = max(ndl, 0.), back = max(-ndl, 0.);
      float ao = mix(0.2, 1., smoothstep(0.03, 0.7, sn)) * mix(mix(0.8, 0.55, uGreat), 1., aa);
      ao = mix(ao, mix(mix(0.8, 0.55, uGreat), 1., aa), step(0.5, -vStand));               // and its heart is not occluded
      // the sun through a whorl: orange-red glow, rods as darker lines
      float vdl = max(dot(-V, uSunDir), 0.);
      vec3 glow = mix(uGlowA, uGlowB, smoothstep(0.15, 0.95, sn)) * (0.75 + 0.5 * hash11(id * 0.77 + seed * 5.));
      vec3 trans = glow * (0.62 * back + 0.5 * vdl * vdl * vdl) * mix(1., 0.45, rod * (1. - sheet));
      vec3 lit = uSunCol * sunK * (alb * (0.16 + 0.55 * front) * ao + trans * mix(0.5, 1., ao));
      lit += alb * fillLightS(N.y, shd) * ao * 0.6;
      lit = mix(lit, uWine * (0.4 + 0.3 * sunK), (1. - ao) * 0.6);                  // self-shadow is wine, never black
      lit = standTint(lit, uCoral, uCrimson, uWine, step(0.5, vStand) * clamp(1. - 2. * shd / 0.85, 0., 1.));   // an old street deepens what is drawn above toward wine, and has let go of it by half of a cloud's shade
      col = lit;
    }
    col.r = min(col.r, 0.9); col = min(col, vec3(0.9));
    gl_FragColor = vec4(col, 1.);
    // the hero's plumes hold their colour through the haze (uFogK < 1), so they are the accent of the far view
    #ifdef USE_FOG
      #ifdef FOG_EXP2
        float fogFactor = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
      #else
        float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
      #endif
      gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor * uFogK);
    #endif
  }`;function ke(a,o,n,h){return new t.ShaderMaterial({defines:{HERO_SHADE:1},uniforms:{...a,uCoral:{value:o[2]},uCrimson:{value:o[1]},uWine:{value:n},uGold:{value:o[3]},uTurns:{value:h?5:3.5},uGreat:{value:h?1:0},uLow:{value:h?.8:.42},uSlopeLo:{value:h?-1.3:.1},uRoot0:{value:h?.012:.05},uSlopeHi:{value:h?1.05:.8},uFil:{value:h?150:90},uPin:{value:h?46:26},uSpin:{value:1},uFogK:{value:h?.22:.5}},vertexShader:_e,fragmentShader:Ge,side:t.DoubleSide,fog:!0})}const Qe={GLSL_COMMON:U,PLUME_VERT:_e,PLUME_FRAG:Ge,plumeGeometry:re,makeTubeMaterial:Ce,makeSink:Me,lathe:Ae,tubeProfile:ze,sinkToGeometry:Te};Qe.STANDS=le;async function je(a,o={}){const n=a.rng.fork?a.rng.fork("twin-spire"):a.rng,h=Math.min(1,Math.max(.6,o.detail??a.quality?.detail??1)),w=(o.palette&&o.palette.length>=7?o.palette:Ie).map(e=>new t.Color(e)),u=o.wine?new t.Color(o.wine):w[1].clone().multiplyScalar(.34).lerp(new t.Color("#7A1426"),.6),G=(o.sunDir?o.sunDir.clone():new t.Vector3(-.906*.559,.829,-.423*.559)).normalize();await a.yield?.();const i={...t.UniformsUtils.clone(t.UniformsLib.fog),uSunDir:{value:G},uSunCol:{value:new t.Color("#FFF4DA").multiplyScalar(1.15)},uFill:{value:new t.Color("#8FD6C8").lerp(new t.Color("#ffffff"),.3).multiplyScalar(.7)},uTeal:{value:w[5]},uShade:{value:0},uShadeY:{value:400},uTime:{value:0},uCore:{value:o.core??.2},uGlowA:{value:new t.Vector3(...o.glowA||[.95,.3,.09])},uGlowB:{value:new t.Vector3(...o.glowB||[.85,.07,.04])},uFlinchT:{value:0},uFlinchG:{value:new t.Vector2(0,0)},uCamFlinch:{value:16},uStand:{value:new t.Vector4(0,0,0,0)},uStandW:{value:new t.Vector2(1,0)}},c=new t.Group;c.name="twin-spire",await a.yield?.();const s=await Le(n,a);await a.yield?.();const r=Me();let d=0;for(const e of s){(++d&15)===0&&await a.yield?.();const l=e.master===1;e.axis=x=>{const N=Math.max(0,x)/e.H;return[e.x+e.lx*x+e.bow*N*N,e.z+e.lz*x+(l?0:e.bow*.6*Math.sin(N*3.1))]},e.seed=n(),Ae(r,ze(n,e.H,e.R,l),l?24:8,e.axis,e.seed,e.H,l?12:4);const p=e.axis(e.H);e.mouth=new t.Vector3(p[0],e.H,p[1])}await a.yield?.();const g=8.15,M=1.12,m=n(),A=n.range(0,O),y=new t.Vector3;Fe(r,e=>{const l=e*O,p=g+.12*Math.sin(l*5+A);return y.set(Math.cos(l)*p,C+Math.sin(l)*p,.25*Math.sin(l*2+A))},e=>M*(1+.1*Math.sin(e*O*7+A)+.14*Math.pow(Math.abs(Math.cos(e*O)),6)),72,12,m,!0,1),await a.yield?.();const F=new t.Vector3,b=new t.Vector3,T=new t.Vector3;for(const e of[-1,1]){const l=s[e<0?0:1],p=[[40,6.5,1.3],[-46,-14,-1.2],[-74,-27,1.6]];for(const[x,N,Ve]of p){const xe=(x+n.range(-5,5))*Math.PI/180,ie=[e*Math.cos(xe)*g,C+Math.sin(xe)*g,0],ye=C+N+n.range(-1.5,1.5),X=[l.axis(ye)[0]-e*(l.R*.75),ye,Ve*n.range(.8,1.3)],Be=[(ie[0]+X[0])*.5+e*n.range(-.6,.4),(ie[1]+X[1])*.5+(N>0?1.4:-2.4)*n.range(.7,1.2),X[2]*.8],He=n.range(.62,.82);Fe(r,I=>{const se=1-I;return F.fromArray(ie).multiplyScalar(se*se),b.fromArray(Be).multiplyScalar(2*se*I),T.fromArray(X).multiplyScalar(I*I),y.copy(F).add(b).add(T)},I=>He*(1+.9*Math.pow(1-I,4)+1.3*Math.pow(I,4)),14,8,n(),!1,1)}}await a.yield?.();const _=Ce(i,w,!0),D=new t.Mesh(Te(r),_);await a.yield?.(),D.geometry.computeBoundingSphere(),c.add(D),await a.yield?.();const W=s.filter(e=>!e.master),R=W.length,P=re(h<.8?10:12,2,3.5,1),L=new Float32Array(R*3),ue=new Float32Array(R*4),ce=new Float32Array(R*2);W.forEach((e,l)=>{const p=n.range(8.5,15)*(e.rank===4?.85:1),x=Math.min(p*n.range(.4,.5),e.rank===0?3.8:9);L.set([e.mouth.x,e.mouth.y-.4,e.mouth.z],l*3),ue.set([p,x,n.sign(),n()],l*4),ce.set([Math.min(.98,e.H/150*.92+n.range(0,.05)),Math.pow(n(),2)],l*2),e.plumeTop=e.H+p}),P.setAttribute("iRoot",new t.InstancedBufferAttribute(L,3)),P.setAttribute("iSize",new t.InstancedBufferAttribute(ue,4)),P.setAttribute("iOrder",new t.InstancedBufferAttribute(ce,2)),P.instanceCount=R;const Re=ke(i,w,u,!1),he=new t.Mesh(P,Re);he.frustumCulled=!1,c.add(he),await a.yield?.();const Q=re(48,5,5,10),fe=n.sign(),de=114,Z=27.5,E=s[0].mouth,V=s[1].mouth;Q.setAttribute("iRoot",new t.InstancedBufferAttribute(new Float32Array([E.x,E.y-.5,E.z,V.x,V.y-.5,V.z]),3)),Q.setAttribute("iSize",new t.InstancedBufferAttribute(new Float32Array([de,Z,fe,n(),de*n.range(.96,1.03),Z,-fe,n()]),4)),Q.setAttribute("iOrder",new t.InstancedBufferAttribute(new Float32Array([0,n()*.3,1,n()*.3]),2)),Q.instanceCount=2;const Pe=ke(i,w,u,!0),ve=new t.Mesh(Q,Pe);ve.frustumCulled=!1,c.add(ve),await a.yield?.();const Y=Math.round(14*h)*2,B=new t.InstancedBufferGeometry;B.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),B.setIndex([0,1,2,0,2,3]);const me=new Float32Array(Y*3);for(let e=0;e<Y;e++)me.set([e%2,(Math.floor(e/2)+n()*.6)/(Y/2),n()],e*3);B.setAttribute("iM",new t.InstancedBufferAttribute(me,3)),B.instanceCount=Y;const K=new t.ShaderMaterial({uniforms:{...i,uMist:{value:new t.Vector2(0,0)},uMouth:{value:[E.clone(),V.clone()]},uWind:{value:new t.Vector3(.3,0,-.95)},uMint:{value:w[6]}},transparent:!0,depthWrite:!1,fog:!0,vertexShader:`
      attribute vec3 iM;
      uniform vec2 uMist; uniform vec3 uMouth[2]; uniform vec3 uWind; uniform float uTime;
      uniform vec3 uSunDir;
      varying vec2 vQ; varying vec3 vA; varying vec2 vS;
      #include <fog_pars_vertex>
      void main() {
        float m = iM.x, age = fract(iM.y + uTime * 0.12), seed = iM.z;
        float amt = mix(uMist.x, uMist.y, m);
        vec3 c = mix(uMouth[0], uMouth[1], m);
        c.y += -1. + age * 30. * (0.35 + 0.65 * amt);
        c += uWind * (age * age * 11. + sin(uTime * 0.6 + seed * 20.) * age * 1.5);
        c.xz += (vec2(hash(seed), hash(seed + 0.37)) - 0.5) * (1. + age * 5.);
        float size = (3.0 + age * 10.5) * (0.8 + 0.4 * seed);
        vec4 mvPosition = viewMatrix * modelMatrix * vec4(c, 1.);
        mvPosition.xy += position.xy * size;
        vQ = position.xy; vA = vec3(amt * sin(3.14159 * age) * (1. - 0.5 * age), seed, age);
        vec3 sv = (viewMatrix * vec4(uSunDir, 0.)).xyz; vS = sv.xy / max(length(sv.xy), 0.2);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`.replace("void main()",`float hash(float n) { return fract(sin(n * 127.1 + 3.7) * 43758.5453); }
      void main()`),fragmentShader:`
      ${U}
      uniform vec3 uMint;
      varying vec2 vQ; varying vec3 vA; varying vec2 vS;
      #include <fog_pars_fragment>
      void main() {
        float d = length(vQ);
        float n = vnoise(vQ * 2.2 + vA.y * 30. + vec2(0., -uTime * 0.25)) * 0.55 + vnoise(vQ * 5. + vA.y * 11. + vec2(0., -uTime * 0.4)) * 0.3 + vnoise(vQ * 11. + vA.y * 7.) * 0.15;
        // mist, not a white ball: torn at the edge, thin enough to see through, lit on the sun's side and grey-cool on the other
        float a = (1. - smoothstep(0.1, 0.95, d + (n - 0.5) * 1.0)) * vA.x * 0.72 * (0.5 + 0.7 * n);
        if (a < 0.004) discard;
        float sunSide = smoothstep(-0.7, 0.6, dot(vQ, vS) + (n - 0.5) * 0.6);
        vec3 col = uMint * (uSunCol * (1. - uShade) * (0.14 + 0.8 * sunSide) * (0.7 + 0.5 * n) + fillLight(0.6) * mix(0.6, 1., sunSide));
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`}),ee=new t.Mesh(B,K);ee.frustumCulled=!1,ee.renderOrder=3,c.add(ee);const H=new t.InstancedBufferGeometry;H.setAttribute("position",B.getAttribute("position")),H.setIndex([0,1,2,0,2,3]),H.setAttribute("iRoot",P.getAttribute("iRoot")),H.setAttribute("iSize",P.getAttribute("iSize")),H.setAttribute("iOrder",P.getAttribute("iOrder")),H.instanceCount=R;const De=new t.ShaderMaterial({defines:{HERO_SHADE:1},uniforms:{...i,uWind:K.uniforms.uWind,uMint:{value:w[6]}},transparent:!0,depthWrite:!1,fog:!0,vertexShader:`
      attribute vec3 iRoot; attribute vec4 iSize; attribute vec2 iOrder;
      uniform float uTime, uFlinchT; uniform vec3 uWind;
      varying vec2 vQ; varying vec3 vA; varying float vY;
      #include <fog_pars_vertex>
      void main() {
        float seed = iSize.w;
        float x = uFlinchT * 1.12 - iOrder.x - 0.02 * seed;                 // > 0 once this pipe's plume has begun to sink
        float burst = smoothstep(0.03, 0.09, x) * (1. - smoothstep(0.12, 0.3, x));
        float breathe = 0.5 * smoothstep(0.1, 0.2, x) * smoothstep(0.1, 0.8, sin(uTime * 0.8 + seed * 40.));
        float amt = max(burst, breathe);
        float age = fract(uTime * 0.4 + seed * 7.);
        vec3 c = iRoot + vec3(0., 1.2 + age * 10., 0.) + uWind * age * age * 7.;
        float size = (2.4 + age * 5.) * (0.8 + 0.5 * fract(seed * 13.));
        vQ = position.xy;
        vec4 wc = modelMatrix * vec4(c, 1.);
        vec4 mvPosition = viewMatrix * wc;
        mvPosition.xy += position.xy * size * step(0.004, amt);
        vA = vec3(amt * sin(3.14159 * age) * smoothstep(14., 40., length(mvPosition.xyz)), seed, age); vY = wc.y;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${U}
      uniform vec3 uMint;
      varying vec2 vQ; varying vec3 vA; varying float vY;
      #include <fog_pars_fragment>
      void main() {
        float d = length(vQ);
        float n = vnoise(vQ * 2.2 + vA.y * 30. + vec2(0., -uTime * 0.3)) * 0.6 + vnoise(vQ * 5. + vA.y * 11.) * 0.4;
        float a = (1. - smoothstep(0.2, 1., d + (n - 0.5) * 0.6)) * vA.x * 0.6;
        if (a < 0.004) discard;
        float shd = SHADE_AT(vY);
        vec3 col = uMint * (uSunCol * (1. - shd) * (0.7 + 0.45 * n) + fillLightS(0.6, shd) * 1.25);
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`}),te=new t.Mesh(H,De);te.frustumCulled=!1,te.renderOrder=3,c.add(te);const oe=Math.round(240*h),j=new t.InstancedBufferGeometry;j.setAttribute("position",B.getAttribute("position")),j.setIndex([0,1,2,0,2,3]);const pe=new Float32Array(oe*4);for(let e=0;e<oe;e++){const l=n()*O,p=4+34*Math.sqrt(n());pe.set([(e%2?V.x:E.x)+Math.cos(l)*p,n(),Math.sin(l)*p,n()],e*4)}j.setAttribute("iO",new t.InstancedBufferAttribute(pe,4)),j.instanceCount=oe;const Ne=new t.ShaderMaterial({uniforms:{...i,uGold:{value:w[3]}},transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,fog:!0,vertexShader:`
      attribute vec4 iO; uniform float uTime, uShade, uShadeY;
      varying vec2 vQ; varying float vK;
      #include <fog_pars_vertex>
      void main() {
        float seed = iO.w, age = fract(iO.y + uTime * (0.012 + 0.01 * seed));
        vec3 c = vec3(iO.x, 132. + age * 125., iO.z);
        float sw = uTime * 0.25 + seed * 40.;
        c.xz += vec2(sin(sw + c.y * 0.05), cos(sw * 0.8 + c.y * 0.04)) * 3.;
        vec4 mvPosition = viewMatrix * modelMatrix * vec4(c, 1.);
        float size = max(0.16, -mvPosition.z * 0.0016) * (0.7 + 0.6 * seed);
        mvPosition.xy += position.xy * size;
        float tw = 0.55 + 0.45 * sin(uTime * (1.2 + seed * 1.6) + seed * 60.);
        vK = tw * sin(3.14159 * age) * (1. - 0.75 * uShade * (1. - smoothstep(uShadeY - 16., uShadeY + 16., c.y))) * min(1., 0.16 / max(size * 0.5, 0.08) + 0.35);
        vQ = position.xy;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uGold; varying vec2 vQ; varying float vK;
      #include <fog_pars_fragment>
      void main() {
        float d = dot(vQ, vQ);
        float a = (1. - smoothstep(0.05, 1., d)) * vK;
        gl_FragColor = vec4(uGold * 3.2 * a, 1.);
        #include <fog_fragment>
      }`}),ae=new t.Mesh(j,Ne);ae.frustumCulled=!1,ae.renderOrder=4,c.add(ae);const ge=new t.ShaderMaterial({uniforms:{uMint:{value:w[6]},uGlow:{value:0},uTime:i.uTime},transparent:!0,depthWrite:!1,depthTest:!1,blending:t.AdditiveBlending,fog:!1,vertexShader:"varying vec2 vQ; void main() { vQ = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy * 15., 0., 1.); }",fragmentShader:`
      uniform vec3 uMint; uniform float uGlow, uTime; varying vec2 vQ;
      void main() {
        float d = length(vQ) * 15. / 7.2;
        float disc = 1. - smoothstep(0.82, 1.0, d);
        float halo = exp(-max(d - 1., 0.) * 3.2) * 0.35;
        float sw = 0.82 + 0.18 * sin(atan(vQ.y, abs(vQ.x) < 1e-5 ? 1e-5 : vQ.x) * 3. + d * 5. - uTime * 0.8);
        gl_FragColor = vec4(uMint * (disc * 0.8 * sw + halo * 0.7) * uGlow, 1.);
      }`}),q=new t.Mesh(new t.PlaneGeometry(2,2),ge);q.position.set(0,C,.4),q.frustumCulled=!1,q.renderOrder=5,c.add(q);const f=(e,l,p)=>new t.Vector3(e,l,p),k=.7071,We={portalSeat:{position:f(0,C,0),normal:f(0,0,1),radius:7},approach:[f(0,42,245),f(0,78,162),f(0,128,85),f(0,C,30),f(0,C,0)],flyThrough:[f(0,C,100),f(0,C,60),f(0,C,30),f(0,C,0),f(0,C,-30),f(0,C,-70)],climb:[f(-46*k,22,-46*k),f(-43*k,52,-43*k),f(-41*k,80,-41*k),f(-40*k,108,-40*k),f(-40*k,132,-40*k)],orbit:[f(-40*k,132,-40*k),f(-6,152,-52),f(48,166,-50),f(88,172,0),f(92,166,62),f(56,156,112),f(16,151,122),f(0,C,100)],viewpoints:{veil:f(0,146,62),gears:f(60,200,150),far:f(-120,60,300)},mouths:[E.clone(),V.clone()],greatPlumeCentre:[f(E.x,205,0),f(V.x,205,0)],greatPlumeRadius:Z,veilBottomY:137,masterPipeX:J},S=(e,l,p)=>{const x=Math.min(1,Math.max(0,(p-e)/(l-e)));return x*x*(3-2*x)},ne=e=>Math.min(1,Math.max(0,S(0,1,e)+.09*Math.sin(9*e)*(1-e))),$={driven:!1,mist:K.uniforms.uMist.value};function we(e,l,p,x,N){$.driven=!0,i.uFlinchT.value=e,i.uFlinchG.value.set(l,p??l),_.uniforms.uOpen.value=1-e,x!==void 0&&$.mist.set(x,N??x)}function Oe(e){const l=S(.8,.8435,e),p=S(.811,.8545,e),x=S(.835,.865,e)*(1-.4*S(.9,1,e)),N=S(.846,.876,e)*(1-.4*S(.9,1,e));we(S(.775,.802,e),l,p,x,N),i.uShade.value=.85*S(.772,.8,e)}function Ee(e){const l=(e%30+30)%30,p=1-ne((l-24.5)/4),x=1-ne((l-25)/4.5);i.uFlinchT.value=S(16,17.6,l)*p,i.uFlinchG.value.set(S(17.5,19.5,l)*x,S(18,20,l)*(1-ne((l-25.6)/4.5))),_.uniforms.uOpen.value=1-i.uFlinchT.value,$.mist.set(S(19,20.5,l)*(1-S(23.5,26.5,l)),S(19.5,21,l)*(1-S(24,27,l))),i.uShade.value=.85*S(15.8,17.6,l)*(1-S(24,25.5,l))}return{object:c,radius:42,height:252,center:f(0,150,0),anchors:We,uniforms:{...i,uWind:K.uniforms.uWind,uMist:K.uniforms.uMist,uRingGlow:ge.uniforms.uGlow},setProgress:Oe,setFlinch:we,update(e,l){i.uTime.value=l,$.driven||Ee(l)},dispose(){},ground:!0,groundY:0}}export{je as buildHero,Qe as heroKit};
