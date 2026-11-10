import*as s from"three";import{makePath as ca,clamp as _e,lerp as Se,smoothstep as ee}from"../kit/core.js";import{buildHero as Ja,GLSL_COMMON as yt,OVERHEAD_GLSL as en,PITCH as ct}from"../parts/stitched-country.js";const N=Math.PI*2,f=h=>new s.Color(h),$=(h,y,F)=>new s.Vector3(h,y,F),tn={afternoon:{pal:["#E6DCC8","#F7F2E6","#7FA8B8","#8DAA5B","#D9A441","#8A5A3C","#C4283C"],sky:"#E4D9C3",glow:"#FFF4DC",sun:[1,.94,.84,.64],amb:[.5,.49,.5],shade:[.66,.62,.72],el:40,az:.72,exposure:1,fogD:5e-4,lamp:0,glowK:.25,moon:0,precip:0,flowers:["#f3b6c4","#F7F2E6","#EBCB6A","#E58CA4"],tint:"#fff8ee",sat:1.1},morning:{pal:["#DEDDD2","#F4F4EE","#7BA6BC","#86AC72","#D4B25E","#86604A","#C4283C"],sky:"#D5DAD6",glow:"#F2F7F6",sun:[.93,.96,1,.66],amb:[.46,.5,.56],shade:[.56,.63,.78],el:21,az:1,exposure:1,fogD:72e-5,lamp:0,glowK:.3,moon:0,precip:0,flowers:["#F7F2E6","#C9DCF0","#F0E08A","#f3b6c4"],tint:"#f2f8ff",sat:1.04},evening:{pal:["#D9C6A6","#F2E6CC","#6E93A8","#7E9A54","#D9A441","#7A4E34","#C4283C"],sky:"#6F5A4E",glow:"#E8B678",sun:[1,.78,.56,.2],amb:[.36,.3,.31],shade:[.38,.32,.4],el:30,az:.6,exposure:1.12,fogD:62e-5,lamp:1,glowK:3.2,moon:1,precip:0,flowers:["#f3b6c4","#F7F2E6","#EBCB6A","#E58CA4"],tint:"#ffe9cf",sat:1.08},spring:{pal:["#E9E1CF","#FBF5EE","#86BACB","#9CC76C","#F0A6BC","#8A5A3C","#C4283C"],sky:"#E3DFCF",glow:"#FFF8EA",sun:[1,.97,.9,.64],amb:[.5,.51,.5],shade:[.64,.66,.74],el:44,az:.5,exposure:1,fogD:48e-5,lamp:0,glowK:.25,moon:0,precip:0,flowers:["#F59CB8","#FFFFFF","#F7D9E4","#F0E08A"],tint:"#fffaf4",sat:1.12},autumn:{pal:["#E4D5BA","#F5EAD6","#7896A4","#8F9B45","#D9A23A","#84482E","#BA242F"],sky:"#E2CFAE",glow:"#FFE7BC",sun:[1,.9,.74,.68],amb:[.5,.46,.44],shade:[.62,.55,.62],el:26,az:.85,exposure:1,fogD:6e-4,lamp:0,glowK:.4,moon:0,precip:0,flowers:["#E0913A","#E9C46A","#F5EAD6","#F5EAD6"],tint:"#fff5e6",sat:1.06},winter:{pal:["#EFEEE9","#FCFCFA","#BCD2E8","#E3ECF2","#F3D7DE","#B9AFA8","#C4283C"],sky:"#F0F0EC",glow:"#FFFFFF",sun:[1,.98,.95,.75],amb:[.52,.55,.62],shade:[.62,.68,.86],el:28,az:.75,exposure:1.1,fogD:45e-5,fogK:.95,lamp:0,glowK:.3,moon:0,precip:2,flowers:["#FFFFFF","#DCE8F4","#F6DDE4","#C4283C"],tint:"#f8fbff",sat:1.06}};function g(h,y,F={}){const K=F.aoK??.6;if(h.index){const B=h.toNonIndexed();h.dispose(),h=B}const oe=h.attributes.position,P=oe.count,q=new Float32Array(P*3),ve=new Float32Array(P*3);for(let B=0;B<P;B++){const C=oe.getY(B),Ye=F.ao?K+(1-K)*ee(F.ao[0],F.ao[1],C):1;q[B*3]=y.r*Ye,q[B*3+1]=y.g*Ye,q[B*3+2]=y.b*Ye,ve[B*3]=F.tint||0,ve[B*3+1]=F.emis||0,ve[B*3+2]=F.leg?F.leg(oe.getX(B),C,oe.getZ(B)):0}return h.setAttribute("color",new s.BufferAttribute(q,3)),h.setAttribute("aFx",new s.BufferAttribute(ve,3)),h.attributes.uv&&h.deleteAttribute("uv"),h}function Te(h){let y=0;for(const K of h)y+=K.attributes.position.count;const F=new s.BufferGeometry;for(const K of["position","normal","color","aFx"]){const oe=new Float32Array(y*3);let P=0;for(const q of h)oe.set(q.attributes[K].array,P),P+=q.attributes[K].array.length;F.setAttribute(K,new s.BufferAttribute(oe,3))}for(const K of h)K.dispose();return F}const V=(h,y,F,K,oe,P,q=0)=>{const ve=new s.BoxGeometry(h,y,F);return q&&ve.rotateY(q),ve.translate(K,oe,P)},te=(h,y,F,K,oe=1,P=1,q=1,ve=1)=>new s.IcosahedronGeometry(h,ve).scale(oe,P,q).translate(y,F,K),It=(h,y,F,K,oe,P,q=8)=>new s.CylinderGeometry(h,y,F,q).translate(K,oe+F/2,P),pe=h=>{const y=h.toNonIndexed();h.dispose();const F=y.attributes.position,K=y.attributes.normal;y.computeBoundingSphere();const oe=y.boundingSphere.center,P=new s.Vector3;for(let q=0;q<F.count;q++)P.fromBufferAttribute(F,q).sub(oe).normalize(),K.setXYZ(q,P.x,P.y,P.z);return y};function ce(h,y,F,K){const oe=new s.InstancedMesh(h,y,F);return oe.name=K,oe.frustumCulled=!1,h.setAttribute("iCol",new s.InstancedBufferAttribute(new Float32Array(F*3).fill(1),3)),h.setAttribute("iP",new s.InstancedBufferAttribute(new Float32Array(F*4),4)),oe}const Wt=new s.Matrix4,fa=new s.Quaternion,ua=new s.Euler,da=new s.Vector3,ha=new s.Vector3;function H(h,y,F,K,oe,P,q,ve,B,C,Ye=0,bt=0,de=0,ye=0,De=0,fe=0){h.setMatrixAt(y,Wt.compose(da.set(F,K,oe),fa.setFromEuler(ua.set(De,P,fe,"YXZ")),ha.set(q,ve,B))),C&&h.geometry.attributes.iCol.setXYZ(y,C.r,C.g,C.b),h.geometry.attributes.iP.setXYZW(y,Ye,bt,de,ye)}const Ot=`
  uniform vec4 uRoad; uniform vec4 uRoad2;      // a1, k1, p1, a2 | k2, p2, sx, river d
  float roadX(float d){ return uRoad.x * sin(d * uRoad.y + uRoad.z) + uRoad.w * sin(d * uRoad2.x + uRoad2.y); }
  float railLat(float d){ float k = smoothstep(1000., 1380., d); return uRoad2.z * (14. + 190. * k * k); }
  float riverD(float x){ return uRoad2.w + 46. * sin(x * 0.0058 + 1.1); }
  // the new land is sewn outward from the road: how many metres the stitching front trails at a lateral distance
  // the new land is sewn outward from each new red stitch: metres behind the spreading front (negative = not yet sewn)
  uniform float uSewD;                          // how far down the road the stitching front has got
  float sewAt(float d, float lat){ float al = abs(lat); return uSewD - d - 0.75 * min(al, 88.) - 0.45 * max(al - 88., 0.); }
  // felt-cloud shadows sliding over the country: x = shade, y = the blanket-stitched rim
  vec2 cloudSh(vec2 p, float t){
    vec2 q = p * 0.0036 + vec2(t * 0.021, 7. + t * 0.006);
    float n = vnoise(q) * 0.78 + vnoise(q * 2.3 + 11.) * 0.22;
    return vec2(smoothstep(0.575, 0.62, n), smoothstep(0.545, 0.56, n) * (1. - smoothstep(0.56, 0.575, n)));
  }`,wo=`
  uniform vec3 uSunDir, uSun, uAmb, uLampC; uniform vec4 uLampP; uniform float uTime, uGlow;
  vec3 lampAt(vec3 w){ vec2 q = w.xz - uLampP.xz; return uLampC * exp(-dot(q, q) / (uLampP.w * uLampP.w)); }
  vec3 feltLight(vec3 alb, vec3 N, vec3 V, vec3 w){
    float dif = smoothstep(-0.4, 0.9, dot(N, uSunDir)), rim = pow(1. - max(dot(N, V), 0.), 2.);
    vec3 lamp = lampAt(w);
    return alb * (uAmb * 1.1 + uSun * dif + lamp) + alb * rim * 0.35 * (uSun + lamp);
  }`,xt=()=>s.UniformsUtils.clone(s.UniformsLib.fog);function on(h){return new s.ShaderMaterial({fog:!0,side:s.DoubleSide,uniforms:{...xt(),...h},vertexShader:`
      ${yt}
      ${Ot}
      attribute vec3 color, aFx, iCol; attribute vec4 iP;
      uniform float uTime, uFrontD, uEdgeD; uniform vec3 uTrainP;
      varying vec3 vN; varying vec3 vCol; varying vec3 vW; varying float vE; varying vec3 vLp; varying float vSh;
      #include <fog_pars_vertex>
      void main(){
        vec4 o = modelMatrix * instanceMatrix * vec4(0., 0., 0., 1.);
        vec3 lp = position;
        lp.z += sin(uTime * 2.6 + iP.x * 5. + (aFx.z > 0. ? 0. : 3.14159)) * abs(aFx.z);          // legs
        float dI = -o.z, latI = o.x - roadX(dI);
        float rev = (iP.w < 0. || dI < uEdgeD) ? 1. : smoothstep(0., 18., sewAt(dI, latI) - 34. + (fract(iP.x * 3.7) - .5) * 14.);   // sewn in behind the spreading front
        float pop = rev * (1. + 0.9 * sin(3.14159 * rev));
        vec3 wp = mat3(instanceMatrix) * lp * pop;
        float hgt = abs(position.y);
        float sw = sin(uTime * 1.7 + iP.x + o.x * 0.05) * iP.y;                                    // wind in wheat, wobble of pom-poms
        wp.x += sw * hgt; wp.z += sw * 0.6 * hgt * cos(iP.x);
        vec2 tq = o.xz - uTrainP.xz; float flt = max(iP.w, 0.) * exp(-dot(tq, tq) / 420.);         // wheat flattens as the train passes
        wp.x -= uRoad2.z * flt * hgt * 0.8; wp.y *= 1. - 0.6 * flt;
        float rp = ripple(o.xz);
        float hopT = abs(sin(uTime * (2.2 + fract(iP.x) * 1.4) + iP.x * 7.));
        vec3 base = o.xyz;
        base.xz += vec2(sin(uTime * 0.21 + iP.x * 3.), cos(uTime * 0.17 + iP.x * 5.)) * iP.z * 5.;  // bobbling about the field
        base.y += rp + hopT * iP.z * 0.9 + max(rp, 0.) * iP.z * 3.5;                                // and bouncing on the ripple ring
        vec4 w = vec4(base + wp, 1.);
        vN = normalize(mat3(instanceMatrix) * normal); vCol = color * mix(vec3(1.), iCol, aFx.x); vW = w.xyz; vE = aFx.y; vLp = position; vSh = cloudSh(o.xz, uTime).x;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${wo}
      uniform vec3 uShade;
      varying vec3 vN; varying vec3 vCol; varying vec3 vW; varying float vE; varying vec3 vLp; varying float vSh;
      #include <fog_pars_fragment>
      void main(){
        vec3 N = normalize(vN), V = normalize(cameraPosition - vW); if (!gl_FrontFacing) N = -N;
        float fib = 0.9 + 0.1 * sin(vW.y * 9. + vW.x * 7.);
        vec3 alb = vCol * fib;
        float kfw = fwidth(length(vLp.xz) * 16.);
        if (vE < -0.5) {                                                    // a French knot: thread wound round and round, sunk into the cloth at its foot
          float sp = sin(atan(vLp.z, vLp.x + 1e-5) + length(vLp.xz) * 16. + vLp.y * 6.);
          float sf = 1. - smoothstep(0.25, 0.8, kfw);
          alb *= mix(0.9, 0.66 + 0.4 * smoothstep(-0.5, 0.5, sp), sf) * (0.5 + 0.5 * smoothstep(0.02, 0.26, vLp.y));
        }
        vec3 col = feltLight(alb, N, V, vW);
        col = mix(col, alb * uShade * 0.92, vSh * 0.42);
        col += vCol * clamp(vE, 0., 1.) * uGlow;
        if (vE > 1.5) { float sp = pow(max(0., sin(uTime * 3.1 + vW.x * 1.3 + vW.z * 1.7 + vW.y * 2.)), 24.); col += vec3(1., 0.95, 0.85) * sp * 3.5 + vCol * 0.25; }
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function an(h){return new s.ShaderMaterial({fog:!0,uniforms:{...xt(),...h},vertexShader:`
      ${yt}
      ${Ot}
      attribute vec3 color; attribute vec2 iZ;       // d along the rail, side
      uniform float uTrainD, uPinD;
      varying vec3 vN; varying vec3 vCol; varying vec3 vW;
      #include <fog_pars_vertex>
      void main(){
        float d = iZ.x, e = 2.;
        vec2 c = vec2(roadX(d) + railLat(d), -d), c2 = vec2(roadX(d + e) + railLat(d + e), -d - e);
        vec2 t = normalize(c2 - c), nrm = vec2(-t.y, t.x);
        float ahead = d - uTrainD, open = smoothstep(-1.5, 16., ahead);
        float snap = exp(-ahead * ahead / 30.) * 0.5;                              // each tooth kicks as the slider bites it
        float off = mix(0.22, 2.0, open);
        vec3 lp = position; lp.x += off; lp.y *= 1. + snap; lp.x *= iZ.y;
        float yaw = mix(0., 0.5, open) * iZ.y;                                     // splayed tapes toe outward
        vec2 r = vec2(lp.x * cos(yaw) - lp.z * sin(yaw), lp.x * sin(yaw) + lp.z * cos(yaw));
        vec2 xz = c + nrm * r.x + t * (r.y + (iZ.y > 0. ? 0. : 0.65) * (1. - open));
        float deck = 2.3 * smoothstep(uPinD - 34., uPinD - 22., d) * (1. - smoothstep(uPinD + 22., uPinD + 34., d));   // over the safety pin
        vec4 w = vec4(xz.x, lp.y + 0.12 + deck + ripple(c), xz.y, 1.);
        vN = normalize(vec3(normal.x * iZ.y, normal.y, normal.z)); vCol = color; vW = w.xyz;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${wo}
      varying vec3 vN; varying vec3 vCol; varying vec3 vW;
      #include <fog_pars_fragment>
      void main(){
        vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
        vec3 col = feltLight(vCol, N, V, vW);
        float brass = step(0.9, vCol.r / max(vCol.b, 0.05) * 0.4);
        col += brass * uSun * pow(max(dot(reflect(-V, N), uSunDir), 0.), 12.) * 1.4;
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function nn(h){return new s.ShaderMaterial({fog:!0,uniforms:{...xt(),...h},vertexShader:`
      ${yt}
      varying vec3 vW; varying vec3 vN; varying float vRip;
      #include <fog_pars_vertex>
      void main(){
        vec4 w = modelMatrix * vec4(position, 1.);
        float h = ripple(w.xz), e = 3.;
        float hx = ripple(w.xz + vec2(e, 0.)), hz = ripple(w.xz + vec2(0., e));
        w.y += h; vRip = h;
        vN = normalize(normalize(normal) + vec3(h - hx, 0., h - hz) / e);
        vW = w.xyz;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #define CELL 118.
      #define ROWW 2.2
      ${yt}
      ${Ot}
      ${wo}
      uniform float uNeedleD, uFrontD, uEdgeD, uBareD;
      uniform vec3 uShade, uLinen, uPencil, uCrimson, uRiverC, uGold, uNe0, uNe1;
      uniform vec3 uPal[6]; uniform vec4 uSt[6]; uniform float uStW[6];
      varying vec3 vW; varying vec3 vN; varying float vRip;
      #include <fog_pars_fragment>
      ${en}
      float segShadow(vec2 p){                    // soft shadow of the needle on the cloth
        vec3 a = uNe0, b = uNe1; if (a.y < vW.y && b.y < vW.y) return 0.;
        float sy = max(uSunDir.y, 0.15);
        vec2 sa = a.xz - uSunDir.xz * (a.y - vW.y) / sy, sb = b.xz - uSunDir.xz * (b.y - vW.y) / sy;
        vec2 ab = sb - sa; float t = clamp(dot(p - sa, ab) / max(dot(ab, ab), 1e-3), 0., 1.);
        float hgt = mix(a.y, b.y, t) - vW.y; if (hgt < 0.) return 0.;
        float soft = 1.2 + hgt * 0.07, d = length(p - (sa + ab * t));
        return (1. - smoothstep(2.6 - soft * .3, 2.6 + soft * 1.3, d)) * (1. / (1. + hgt * 0.012));
      }
      void main(){
        vec2 p = vW.xz; vec3 N = normalize(vN);
        vec3 V = normalize(cameraPosition - vW);
        float d = -p.y, lat = p.x - roadX(d);
        vec2 fwp = fwidth(p); float px = max(fwp.x, fwp.y);                 // metres per pixel
        // ---- linen: over-under weave near, slubby streaks far
        vec2 uv = p / 0.3; float wf = 1. - smoothstep(0.2, 0.7, px / 0.3);
        float chk = mod(floor(uv.x) + floor(uv.y), 2.);
        float warpT = abs(sin(3.14159 * uv.x)), weftT = abs(sin(3.14159 * uv.y));
        float weave = mix(warpT * (0.75 + 0.25 * weftT), weftT * (0.75 + 0.25 * warpT), chk);
        float slub = vnoise(vec2(p.x * 0.9, p.y * 0.035)) * 0.5 + vnoise(vec2(p.x * 0.03, p.y * 1.1)) * 0.5;
        float mott = vnoise(p * 0.021) * 0.6 + vnoise(p * 0.11) * 0.4;
        vec3 linen = uLinen * (0.9 + 0.1 * slub) * (0.93 + 0.1 * mott);
        linen *= mix(1., 0.7 + 0.42 * weave, wf);
        N = normalize(N + vec3(vnoise(p * 0.06) - .5, 0., vnoise(p * 0.06 + 31.7) - .5) * 0.22);
        vec2 wg = vec2(cos(3.14159 * uv.x) * sign(sin(3.14159 * uv.x)), cos(3.14159 * uv.y) * sign(sin(3.14159 * uv.y)));
        N = normalize(N - vec3(wg.x * (1. - chk), 0., wg.y * chk) * 0.45 * wf);
        // ---- the patchwork: jittered Voronoi fields, each with its own stitch direction
        vec2 gp = p / CELL, gi = floor(gp), gf = fract(gp); float b1 = 9., b2 = 9.; vec2 bc = vec2(0.), bid = vec2(0.);
        for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 o = vec2(float(x), float(y)), id = gi + o;
          vec2 c = o + 0.14 + 0.72 * vec2(hash21(id), hash21(id + 17.3)); float dd = length(c - gf);
          if (dd < b1) { b2 = b1; b1 = dd; bc = c; bid = id; } else if (dd < b2) b2 = dd; }
        float fe = (b2 - b1) * CELL * 0.5;                                   // metres-ish to the field border
        vec2 cc = (gi + bc) * CELL; float h1 = hash21(bid + 5.7), h2 = hash21(bid + 11.1);
        float ang = h1 * 3.14159; vec2 dir = vec2(cos(ang), sin(ang)), prp = vec2(-dir.y, dir.x), q = p - cc;
        float u = dot(q, dir), v = dot(q, prp), Rf = CELL * 0.85, rows = floor(2. * Rf / ROWW);
        float ri = clamp(floor((Rf - v) / ROWW), 0., rows - 1.);
        float dc = -cc.y, clat = cc.x - roadX(dc);
        float unsewn = step(uEdgeD, dc);
        float rj = hash21(vec2(ri * 1.7, h1 * 91.));
        float fwv = px / ROWW, rf = 1. - smoothstep(0.15, 0.6, fwv);
        // metres behind the stitching front. Every row ends on a whole stitch (1.1 m), a few stitches before or after its
        // neighbours, so the front is a crisp comb of row ends near the lens and one clean line once rows are too fine to see
        vec2 ps = mix(p, cc + dir * (floor(u / 1.1) * 1.1 + 0.55) + prp * (Rf - (ri + .5) * ROWW), rf);
        float dS = -ps.y;
        float fr = sewAt(dS, ps.x - roadX(dS)) + (rj - .5) * 5. * rf + (h2 - .5) * 26. + (vnoise(ps * 0.02 + 3.) - .5) * 10.;
        float bareE = uBareD - max(abs(lat) - 28., 0.) * 1.0 + (rj - .5) * 26. + (vnoise(p * 0.035) - .5) * 30.; // where the unpicking has got to: every row ends at its own place
        fr -= mix(22., mod(ri, 2.) * 44., rf);                                  // sewn in two passes: every other row first, the rows between them 44 m behind
        float st = unsewn < .5 ? smoothstep(-0.5, 0.5, d - bareE) : smoothstep(-mix(24., 0.4, rf), mix(24., 0.4, rf), fr);
        float fresh = unsewn * st * (1. - smoothstep(0.5, 5., fr));                                            // thread just laid shines
        float blush = unsewn * st * (1. - smoothstep(3., 16., fr));                                            // and is still the crimson of the strand it came from
        float bz = 1. - smoothstep(uBareD + 30., uBareD + 110., d);                                            // the unpicked cloth behind the country
        // the bare corridor: road and railway, and only the road where no railway runs (before its first tooth, and up the last stitch)
        float ck = max(smoothstep(1040., 1150., d), 1. - smoothstep(150., 200., d));
        float ce = abs(lat - 6. * uRoad2.z * (1. - ck)) - mix(14.5, 7.5, ck), corr = smoothstep(0., 2., ce);   // ce: metres outside the corridor's edge
        // the new land under the needle: a strip of thread still hot from the strand lies along both edges of the road cloth,
        // from the needle's point back 130 m, widening as it trails and cooling to crimson at its rim
        float bk = uNeedleD - d, hw = 7. + 0.13 * clamp(bk, 0., 135.);
        float hk = unsewn * st * smoothstep(-25., 5., bk) * (1. - smoothstep(55., 135., bk));
        float hot = hk * (1. - smoothstep(hw * 0.5, hw, ce));
        blush = max(blush, hk * (1. - smoothstep(hw, hw * 1.7, ce)) * 1.2);
        st *= corr;
        // bare cloth under the design: needle holes along each row, blue pencil outlines, the pencilled road
        float rv = fract((Rf - v) / ROWW), ru = fract(u / 1.1);
        float dots = (1. - smoothstep(0.05, 0.16, length(vec2(rv - .5, (ru - .5) * 0.5)))) * (1. - smoothstep(0.1, 0.4, fwv));
        vec3 bare = linen * (1. - 0.45 * dots * corr);
        float dash = step(0.35, fract((p.x + p.y) * 0.11));
        float pk = max(unsewn, bz);                                                                            // the drawn design ahead, its unpicked ghost behind
        float pwT = 0.2 + min(px, 1.6) * mix(1.3, mix(1.9, 1.5, bz), pk), pw = max(pwT, px * 0.8);                 // a pencil line is never wider than a pencil: far off it stays one pixel and only gets fainter
        float pencil = (1. - smoothstep(pw, pw + mix(0.9, 0.4, bz), fe)) * mix(dash, 1., unsewn) * mix(0.6, 1., pk) * corr * (0.35 + 0.65 * pwT / pw);
        pencil = max(pencil, (1. - smoothstep(pw * 0.5, pw * 0.5 + 0.5, abs(lat))) * step(0.4, fract(d * 0.09)) * step(uNeedleD + 8., d) * 0.9);
        { // pencilled trees waiting to be sewn: a ring on a stalk, one to a 34 m square
          vec2 tg = p / 34., ti = floor(tg); vec2 tc = (ti + 0.25 + 0.5 * vec2(hash21(ti + 2.9), hash21(ti + 8.1))) * 34.;
          float tr = 3. + 2. * hash21(ti + 4.4), dd = length(p - tc), tw = 0.2 + px * 1.6;
          float ring = 1. - smoothstep(tw, tw + 0.5, abs(dd - tr));
          ring = max(ring, (1. - smoothstep(tw, tw + 0.5, abs(p.x - tc.x))) * step(abs(p.y - tc.y - tr - 2.5), 2.5));
          float gate = max(unsewn, bz) * corr * step(0.4, hash21(ti + 6.6));
          pencil = max(pencil, ring * gate * 0.95 * (1. - smoothstep(1.4, 3.6, px)));
          bare = mix(bare, uPal[0], (1. - smoothstep(tr - 1.2, tr, dd)) * gate * 0.12);          // a wash of colour inside each pencilled tree
        }
        pencil = max(pencil, (1. - smoothstep(pw * 0.4, pw * 0.4 + 0.4, abs(abs(fract(v / 11.) - .5) - .25) * 11.)) * mix(0.16, 0.42, max(bz, unsewn * 0.6)) * corr * (1. - smoothstep(0.4, 1.8, px)));
        bare = mix(bare, uPencil * mix(1., 0.9, pk), pencil * (1. - 0.4 * smoothstep(3.6, 11., px)));              // far lines stay pencil-thin and faint, never slabs
        // satin: one colour per field, each row a slightly different dye lot, floss stripes along the stitch
        float wave = sin(dot(p, vec2(0.05, 0.031)) - uTime * 0.9) * 0.5 + 0.5;       // sheen wave, like wind over a crop
        vec3 fc = uPal[int(min(h2 * 6., 5.))]; float rh = hash21(vec2(ri, h2 * 7.1 + cc.x));
        fc *= 0.8 + 0.34 * rh; fc *= 0.9 + 0.2 * wave;
        float rowB = 0.5 + 0.5 * cos(6.2832 * rv);
        fc *= mix(1., 0.72 + 0.36 * rowB, rf);
        fc *= 0.94 + 0.06 * vnoise(vec2(u * 0.5, v * 6.));
        vec3 T = vec3(dir.x, 0., dir.y); T = normalize(T - N * dot(T, N));
        vec3 Hh = normalize(uSunDir + V); float th = dot(normalize(T + N * (wave - .5) * 0.5), Hh);
        float sth = sqrt(max(1. - th * th, 0.)), kk = 0.25 + 0.75 * mix(pow(sth, 70.), pow(sth, 4.), 0.5);   // the tight highlight alone left satin dull and muddy right under the lens
        float hedge = (1. - smoothstep(1.0, 2.4 + px, fe + sin(u * 2.2) * 0.5));
        vec3 hedgeCol = uPal[1] * vec3(0.4, 0.55, 0.36) + uLinen * 0.08;
        vec3 sat = mix(fc, hedgeCol, hedge * 0.85);
        sat = mix(sat, uCrimson * (0.85 + 0.35 * rowB), min(blush * 0.6, 0.9));
        sat = mix(sat, sat * 1.2 + vec3(0.08, 0.06, 0.04), fresh);
        sat = mix(sat, vec3(1.32, 0.46, 0.09) * (0.74 + 0.4 * rowB), hot * 0.92);
        { // the corridor's cloth is hemmed where the fields end: the shade of the raised satin on the linen, a blanket stitch of
          // brown thread (a line and its teeth) and, a metre and a half inside it, a gold running stitch
          float in1 = -ce, lf = 1. - smoothstep(0.25, 1.1, px);
          bare *= 1. - 0.2 * (1. - smoothstep(0., 2.6, in1)) * (1. - corr);
          float hemL = 1. - smoothstep(0.1, 0.2 + px, abs(in1 - 1.0));
          float tooth = (1. - smoothstep(0.1, 0.2 + px, abs(fract(d / 1.5) - .5) * 1.5)) * step(-0.2, in1) * step(in1, 1.0);
          float run = (1. - smoothstep(0.11, 0.2 + px, abs(in1 - 2.5))) * step(0.42, fract(d / 2.4));
          bare = mix(bare, mix(uCrimson, uGold, 0.4) * 0.6, max(hemL, tooth) * 0.85 * lf);
          bare = mix(bare, uGold * 0.95, run * 0.9 * lf);
          // between the road's stitch and the railway, where both run: a row of cross stitches, crimson and gold by turns
          float xd = d / 2.6; vec2 xq = vec2(lat * uRoad2.z - 7., (fract(xd) - .5) * 2.6);
          float arm = min(abs(xq.x - xq.y), abs(xq.x + xq.y)) * 0.7071;
          float xst = (1. - smoothstep(0.1, 0.18 + px, arm)) * step(max(abs(xq.x), abs(xq.y)), 0.62);
          bare = mix(bare, mix(uCrimson, uGold, mod(floor(xd), 2.)) * 0.85, xst * 0.8 * lf * (1. - ck));
        }
        vec3 alb = mix(bare, sat, st);
        float spec = st * (1. - hedge) * kk * (0.1 + 0.3 * wave) + fresh * 0.22; vec3 specCol = mix(vec3(1.), fc, 0.7) * 1.2;
        N = normalize(N + vec3(prp.x, 0., prp.y) * (rv - .5) * 0.5 * rf * st);
        // ---- the ribbon river: blue satin flowing across the valley, gold running stitch down both selvedges
        float rd = abs(d - riverD(p.x));
        float rm = 1. - smoothstep(19.2, 20. + px, rd);
        if (rm > 0.) {
          float flow = sin(p.x * 0.21 - uTime * 1.6 + sin(rd * 0.5 + p.x * 0.05) * 1.5) * 0.5 + 0.5;
          float ribs = 0.5 + 0.5 * cos(rd * 6.2832 / 1.3); float rbf = 1. - smoothstep(0.2, 0.7, px / 1.3);
          vec3 rc = uRiverC * (0.74 + 0.36 * flow) * mix(1., 0.8 + 0.3 * ribs, rbf);
          float sel = (1. - smoothstep(0.35, 0.6, abs(rd - 17.6))) * step(0.4, fract(p.x * 0.3));
          rc = mix(rc, uGold, sel * 0.9);
          float glint = pow(flow, 6.) * (0.5 + 0.5 * vnoise(vec2(p.x * 0.4 - uTime * 2., rd)));
          alb = mix(alb, rc, rm); spec = mix(spec, glint * 0.5, rm); specCol = mix(specCol, vec3(1.), rm);
          N = normalize(mix(N, vec3(0., 1., 0.) + vec3(0.25 * (flow - .5), 0., 0.), rm));
        }
        // ---- light: broad soft window key, coloured shade, cloud-applique shadows, pucker where the needle has pierced
        float nl = dot(N, uSunDir); float dif = smoothstep(-0.2, 1.0, nl) * 1.16;                                    // a decided key: slopes toward the window glow, slopes away go lavender
        float sh = segShadow(p) * 0.72;
        float puck = clamp(-vRip * 0.16, 0., 0.5);
        float st2 = 0.;
        for (int i = 0; i < 6; i++) { vec4 sg = uSt[i]; if (uStW[i] <= 0.) continue; vec2 ab = sg.zw - sg.xy, pq = p + uSunDir.xz * 0.9 - sg.xy;
          float t = clamp(dot(pq, ab) / max(dot(ab, ab), 1e-3), 0., 1.); st2 = max(st2, (1. - smoothstep(0.4, 3.2, length(pq - ab * t))) * uStW[i]); }
        sh = max(sh, st2 * 0.5);
        sh = max(sh, overheadShadow(p, vW.y) * 0.8);                                                                                    // the knot overhead, the strand down to the needle, the strands the hills feed it
        vec2 cs = cloudSh(p, uTime);
        alb = mix(alb, alb * uShade * 0.7, cs.y * step(0.45, fract((p.x - p.y) * 0.1)) * 0.6 * (1. - smoothstep(1.5, 6., px)));       // the blanket stitch round each cloud shadow
        vec3 lamp = lampAt(vW);
        vec3 light = uShade * (0.44 + 0.2 * N.y) + uSun * dif * (1. - sh) + lamp * (0.6 + 0.4 * dif);
        light = max(light, (uShade * 0.95 + uSun * 0.2) * 0.74 * (1. - 0.45 * sh));                                                       // satin never shades to mud: the shade is lavender
        light = mix(light, uShade * 0.82 + uSun * 0.06, cs.x * 0.5);                                                                     // under a felt cloud
        light = mix(light, uShade * 0.45, puck);
        float fres = pow(1. - max(dot(N, V), 0.), 3.);
        vec3 col = alb * light + alb * fres * 0.12 * uSun + specCol * spec * (uSun + lamp) * (1. - sh);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function sn(h){return new s.ShaderMaterial({side:s.BackSide,depthWrite:!1,depthTest:!1,fog:!1,uniforms:h,vertexShader:`
      varying vec3 vDir;
      void main(){ vDir = position; vec4 p = projectionMatrix * viewMatrix * vec4(cameraPosition + position, 1.); gl_Position = p; }`,fragmentShader:`
      uniform vec3 uSkyC, uSkyLow, uSkyTop, uGlowC, uFogC, uSunDir, uButton, uGold, uCloudC, uStitchC; uniform float uTime, uMoon; uniform vec4 uCl[9];
      varying vec3 vDir;
      float h11(float x){ return fract(sin(x * 127.1) * 43758.5453); }
      float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y); }
      float cloudSD(vec2 q, float seed, out vec2 nearC){
        float d = 9.; nearC = vec2(0.);
        for (int k = 0; k < 4; k++) { float fk = float(k); vec2 c = vec2((fk - 1.5) * 0.52 + (h11(seed + fk) - .5) * 0.2, (h11(seed + fk * 3.7) - .5) * 0.3 + (fk == 1. || fk == 2. ? 0.14 : 0.));
          float r = 0.34 + 0.2 * h11(seed + fk * 9.1) + (fk == 1. || fk == 2. ? 0.1 : 0.); float dk = length((q - c) * vec2(1., 1.25)) - r; if (dk < d) { d = dk; nearC = c; } }
        return max(d, -(q.y + 0.34) * 1.2);      // flat felt base
      }
      void main(){
        vec3 r = normalize(vDir);
        float az = atan(r.x, -r.z), el = asin(clamp(r.y, -1., 1.));
        float su = dot(r, uSunDir);
        // the sky cloth is warm where it meets the land and cooler overhead
        vec3 col = mix(uSkyLow, uSkyTop, smoothstep(0.0, 0.5, r.y) * 0.75 + smoothstep(0.3, 0.95, r.y) * 0.25);
        col += uGlowC * (0.2 * pow(max(su * 0.5 + 0.5, 0.), 6.) + 0.05 * exp(-el * el * 14.));       // cloth held up to a window
        // the weave of the sky cloth and its slubs
        vec2 wuv = vec2(az, el) * 95.; vec2 fwv = fwidth(wuv); float wf = (1. - smoothstep(0.25, 0.8, max(fwv.x, fwv.y))) * step(max(fwv.x, fwv.y), 5.);
        float weave = abs(sin(3.14159 * wuv.x)) * 0.5 + abs(sin(3.14159 * wuv.y)) * 0.5;
        col *= mix(1., 0.9 + 0.14 * weave, wf);
        { // the coarse weave over it: warp and weft a hand apart, each thread round where it passes over, sunk where it passes under
          vec2 cw = vec2(az, el) * 52., cfw = fwidth(cw), ci = floor(cw), cf = fract(cw); float cwf = 1. - smoothstep(0.2, 0.7, min(max(cfw.x, cfw.y), 5.));
          float over = mod(ci.x + ci.y, 2.), warp = sin(3.14159 * cf.x), weft = sin(3.14159 * cf.y);
          float th = mix(warp * (0.55 + 0.45 * weft), weft * (0.55 + 0.45 * warp), over);
          float slub = smoothstep(0.8, 0.97, vnoise(vec2(az * 2.2, ci.y * 7.3))) * weft;                     // here and there a thicker weft thread
          col *= mix(1., 0.91 + 0.12 * th + 0.05 * slub, cwf);
        }
        col *= 0.96 + 0.05 * vnoise(vec2(az * 60., el * 3.)) + 0.035 * vnoise(vec2(az * 2.5, el * 90.));
        // quilted felt clouds, blanket-stitched on, sliding slowly over the cloth
        float cd = 9., cs = 9., ca = 0., csz = 1.; vec2 cq = vec2(0.);
        for (int i = 0; i < 9; i++) {
          vec4 c = uCl[i]; if (c.z <= 0.) continue;
          float a = az - c.x - uTime * 0.0035 * (0.6 + 0.8 * h11(c.w)); a = mod(a + 3.14159, 6.28318) - 3.14159;
          vec2 q = vec2(a * cos(c.y), el - c.y) / c.z; if (dot(q, q) > 6.) continue;
          vec2 nr, nr2; float dk = cloudSD(q, c.w, nr), ds = cloudSD(q + vec2(-0.05, 0.11), c.w, nr2);
          if (dk < cd) { cd = dk; cq = q; ca = atan(q.y - nr.y, q.x - nr.x); csz = c.z; }
          cs = min(cs, ds);
        }
        float aa = min(fwidth(cd), 0.04) + 1e-4;
        float cm = 1. - smoothstep(-aa, aa, cd);
        col *= 1. - 0.3 * (1. - smoothstep(-0.02, 0.1, cs)) * (1. - cm);                               // the shadow a raised applique casts on the cloth
        vec2 dq = vec2(cq.x + cq.y, cq.x - cq.y) * 3.2; vec2 df = abs(fract(dq) - .5);
        float quilt = smoothstep(0.0, 0.16, min(df.x, df.y));                                         // pinched quilting lines, puffed between
        float pfy = 0.86 + 0.14 * quilt * (0.7 + 0.3 * (1. - 2. * max(df.x, df.y)));
        vec3 felt = uCloudC * pfy * (0.9 + 0.12 * smoothstep(0.2, -0.5, cd)) * (0.97 + 0.05 * vnoise(cq * 40.));
        felt *= 0.9 + 0.14 * smoothstep(-0.4, 0.5, cq.y);
        float edge = smoothstep(-0.105, -0.085, cd) * (1. - smoothstep(-0.075, -0.055, cd));           // blanket stitch: a line and its teeth
        float teeth = smoothstep(-0.085, -0.075, cd) * step(0.72, fract(ca * 7.));
        felt = mix(felt, uStitchC, clamp(edge + teeth, 0., 1.) * 0.8 * (1. - smoothstep(0.012, 0.03, aa)));
        col = mix(col, felt, cm);
        // the button: mother-of-pearl, four holes, sewn on with gold thread, a little loose
        if (su > 0.9) {
          vec3 rt = normalize(cross(vec3(0., 1., 0.), uSunDir)), up = cross(uSunDir, rt);
          vec2 b = vec2(dot(r, rt), dot(r, up)) / 0.0785; float rock = 0.2 * sin(uTime * 0.8) + 0.07 * sin(uTime * 2.1);
          b = vec2(b.x * cos(rock) - b.y * sin(rock), b.x * sin(rock) + b.y * cos(rock));
          float rr = length(b), ba = fwidth(rr) + 1e-4;
          float disc = 1. - smoothstep(1. - ba, 1. + ba, rr);
          float ang = atan(b.y, b.x);
          float sw = 0.5 + 0.5 * sin(ang * 2. + rr * 6. + vnoise(b * 2.5) * 2.5);
          vec3 pearl = uButton * mix(vec3(0.965, 0.79, 0.84), vec3(0.81, 0.914, 0.84), sw);                    // pink '#F6C9D6' to green '#CFE9D6'
          pearl *= 0.9 + 0.1 * sin(ang * 5. + rr * 9. + 2.);
          float rim = smoothstep(0.74, 0.82, rr) * (1. - smoothstep(0.93, 1., rr));
          float dish = 1. - smoothstep(0.58, 0.72, rr);
          pearl *= 1. - 0.16 * dish + 0.12 * dish * smoothstep(-0.6, 0.6, b.y - b.x);
          pearl *= 1. - 0.22 * smoothstep(0.66, 0.72, rr) * (1. - smoothstep(0.72, 0.78, rr));                 // the groove inside the rim
          float cres = smoothstep(0.84, 0.9, rr) * (1. - smoothstep(0.92, 0.98, rr)) * smoothstep(0.2, 0.9, dot(normalize(b + 1e-4), vec2(-0.6, 0.8)));
          pearl += uButton * (0.14 * rim + 0.9 * cres);
          vec2 hb = abs(b) - 0.27; float hole = 1. - smoothstep(0.125 - ba, 0.125 + ba, length(hb));
          float th = min(abs(b.x - b.y), abs(b.x + b.y)) * 0.7071;
          float thread = (1. - smoothstep(0.045, 0.045 + ba * 1.5, th)) * step(max(abs(b.x), abs(b.y)), 0.29);
          pearl = mix(pearl, uStitchC * 0.32, hole);
          pearl = mix(pearl, uGold * (0.85 + 0.3 * fract(th * 60.)), thread);
          col = mix(col * (1. - 0.16 * (1. - smoothstep(1., 1.25, length(b + vec2(-0.05, 0.1))))), pearl, disc);
          col += uGlowC * 0.16 * exp(-rr * rr * 0.12) * (1. - disc);
        }
        col = mix(uFogC, col, smoothstep(-0.02, 0.07, r.y));
        gl_FragColor = vec4(col, 1.);
      }`})}function rn(h){return new s.ShaderMaterial({fog:!0,side:s.DoubleSide,transparent:!0,uniforms:{...xt(),...h},vertexShader:`
      attribute float aSeed; uniform float uTime;
      varying vec2 vQ; varying float vSeed; varying vec3 vRt; varying vec3 vFw;
      #include <fog_pars_vertex>
      void main(){
        vQ = position.xy; vSeed = aSeed;
        vRt = normalize(mat3(instanceMatrix) * vec3(1., 0., 0.)); vFw = normalize(mat3(instanceMatrix) * vec3(0., 0., 1.));
        vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.);
        w.y += sin(uTime * 0.13 + aSeed) * 1.5;                                  // a slow breathing up and down, the same at any hour
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uCloudC, uShade, uSun, uStitchC, uSunDir;
      varying vec2 vQ; varying float vSeed; varying vec3 vRt; varying vec3 vFw;
      #include <fog_pars_fragment>
      float h11(float x){ return fract(sin(x * 127.1) * 43758.5453); }
      void main(){
        vec2 q = vQ; float d1 = 9., d2 = 9., ri = 1., fi = 0.; vec2 ci = vec2(0.);
        for (int k = 0; k < 5; k++) { float fk = float(k), mid = 1. - abs(fk - 2.) * 0.5;
          float r = 0.25 + 0.13 * h11(vSeed + fk * 9.1) + 0.17 * mid;
          vec2 c = vec2((fk - 2.) * 0.42 + (h11(vSeed + fk) - .5) * 0.14, r * 0.62 - 0.3 + 0.1 * h11(vSeed + fk * 3.7) * mid);
          float dk = length(q - c) - r; if (dk < d1) { d2 = d1; d1 = dk; ri = r; ci = c; fi = fk; } else if (dk < d2) d2 = dk; }
        float d = max(d1, -(q.y + 0.3));                                          // the straight base
        float aa = clamp(fwidth(d), 1e-4, 0.05), a = 1. - smoothstep(-aa, aa, d);
        if (a < 0.02) discard;
        // the pad: a low dome, lit from the window's side
        vec2 e = (q - ci) / ri; float z = sqrt(clamp(1. - dot(e, e), 0., 1.));
        vec3 n = normalize(vec3(e * 0.9, z + 0.35)), N = normalize(n.x * vRt + n.y * vec3(0., 1., 0.) + n.z * vFw);
        vec3 Lc = normalize(uSunDir + vec3(0., 0.7, 0.) + vFw * 0.9);
        float dif = smoothstep(-0.25, 0.95, dot(N, Lc));
        // long stitches side by side, each pad's laid in a direction of its own
        float ph = (h11(vSeed + fi * 5.3) - .5) * 1.5 + (mod(fi, 2.) - .5) * 0.7; vec2 t = vec2(sin(ph), cos(ph)), pr = vec2(t.y, -t.x);
        float s = dot(q - ci, pr) * 15., sf = 1. - smoothstep(0.25, 0.75, fwidth(s));
        float ridge = abs(sin(3.14159 * s)), lot = 0.93 + 0.1 * h11(floor(s) + vSeed + fi * 17.);
        float sheen = pow(clamp(1. - abs(dot(n.xy, t) - 0.3) * 1.5, 0., 1.), 3.) * (0.5 + 0.5 * z);
        vec3 col = uCloudC * mix(uShade * 0.86, vec3(1.02), dif) * mix(1., (0.82 + 0.2 * ridge) * lot, sf);
        col += uSun * 0.14 * sheen;
        col *= 1. - 0.3 * (1. - smoothstep(0., 0.05, d2 - d1));                    // the crease where two pads meet
        col *= 0.8 + 0.2 * smoothstep(-0.3, 0.02, q.y);                           // the underside, in its own shade
        // the outline: a stem stitch a little inside the edge, each stitch slanting over the last
        float arc = atan(e.y, e.x) * ri * 24. + q.x * 9.;
        float rope = smoothstep(-0.075, -0.06, d) * (1. - smoothstep(-0.03, -0.015, d)) * step(0.22, fract(arc - d * 30.));
        col = mix(col, uStitchC * 0.9, rope * 0.75 * (1. - smoothstep(0.01, 0.03, aa)));
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`})}function ln(h){return new s.ShaderMaterial({side:s.BackSide,fog:!1,transparent:!1,uniforms:h,vertexShader:`
      varying vec3 vL;
      void main(){ vL = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,fragmentShader:`
      uniform vec3 uFogC, uM0, uM1, uM2, uM3, uMc, uMg; uniform float uMSeed, uHaze;
      varying vec3 vL;
      float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      float ridge(float a){ return 0.5 + 0.2 * sin(a * 3. + uMSeed) + 0.15 * sin(a * 7. + 1.7 * uMSeed) + 0.09 * sin(a * 17. + uMSeed * 3.) + 0.05 * sin(a * 41. + uMSeed); }
      void main(){
        float R = length(vL.xz), a = atan(vL.z, vL.x), cell = 6.28318 / 470.;      // 470 cells round the ring, about 40 m each, so the X of every stitch reads
        vec2 uv = vec2(a / cell, vL.y / (R * cell)); vec2 id = floor(uv), f = fract(uv) - .5;
        float aaw = fwidth(uv.y) * 1.2;
        float top = ridge((id.x + .5) * cell) * 660. / (R * cell);
        if (id.y + .5 > top) discard;
        float hn = (id.y + .5) / max(top, 1.), hj = hash21(id);
        vec3 tc = hn > 0.74 + 0.1 * hj ? uM3 : (hn > 0.42 + 0.14 * hj ? uM2 : (hn > 0.16 + 0.1 * hj ? uM1 : uM0));
        tc *= 0.85 + 0.3 * hash21(id + 3.3);
        tc = max(mix(vec3(dot(tc, vec3(0.3, 0.55, 0.15))), tc, 1.35), 0.);
        // sampler motifs: a border row of gold with crimson along the ridge, a gold zigzag across the middle
        float zig = abs(mod(id.x, 8.) - 4.) - 2.;
        if (abs(id.y - floor(top * 0.46) - zig) < 0.5) tc = uMg;
        if (id.y + 1.5 > top) tc = mod(id.x, 4.) < 1. ? uMc : uMg;
        float dx = min(abs(f.x - f.y), abs(f.x + f.y)) * 0.7071;
        float stroke = 1. - smoothstep(0.14 - aaw, 0.14 + aaw, dx);
        stroke *= step(max(abs(f.x), abs(f.y)), 0.44);
        float cover = mix(stroke, 0.55, smoothstep(0.25, 0.6, aaw));              // too fine to draw: flat thread coverage
        vec3 col = mix(uFogC * 0.985, tc, cover);
        col = mix(col, uFogC, clamp(uHaze + 0.2 * (1. - hn) * (1. - hn), 0., 0.95));
        gl_FragColor = vec4(col, 1.);
      }`})}function cn(h){return new s.ShaderMaterial({fog:!1,transparent:!0,depthWrite:!1,side:s.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4,uniforms:h,vertexShader:`
      ${yt}
      ${Ot}
      attribute vec2 iR;             // 1 = stands on land that is sewn in during the flight, strength
      uniform float uEdgeD, uFogD, uK;
      varying vec2 vQ; varying float vA;
      void main(){
        vec4 o = modelMatrix * instanceMatrix * vec4(0., 0., 0., 1.);
        float dI = -o.z, latI = o.x - roadX(dI);
        float rev = (iR.x < .5 || dI < uEdgeD) ? 1. : smoothstep(0., 18., sewAt(dI, latI) - 34.);
        vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.);
        w.y += ripple(w.xz);
        float fd = distance(cameraPosition, w.xyz) * uFogD;
        vQ = position.xz; vA = rev * iR.y * uK * exp(-fd * fd);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:`
      uniform vec3 uShadeC; varying vec2 vQ; varying float vA;
      void main(){ gl_FragColor = vec4(uShadeC, (1. - smoothstep(0.42, 1., length(vQ))) * vA); }`})}function fn(h){return new s.ShaderMaterial({fog:!0,side:s.DoubleSide,transparent:!0,depthWrite:!1,uniforms:{...xt(),...h},vertexShader:`
      attribute vec4 iA, iB; attribute float iSc;        // iA: centre xyz, phase   iB: rx, rz, speed, trail index (0 = the bird)   iSc: size
      uniform float uTime;
      varying float vA;
      #include <fog_pars_vertex>
      vec3 route(float t){ float a = t * iB.z + iA.w; return iA.xyz + vec3(cos(a) * iB.x, sin(a * 2. + iA.w) * 6. + sin(a * 5.) * 2., sin(a) * iB.y + sin(a * 3.) * iB.y * 0.25); }
      void main(){
        float k = iB.w, t = uTime - k * 0.22 * (0.6 + 0.4 * iSc) / max(abs(iB.z) * 3., 0.2);
        vec3 c = route(t), tg = normalize(route(t + 0.05) - c);
        vec3 sd = normalize(cross(tg, vec3(0., 1., 0.)));
        float flap = k < 0.5 ? 0.55 + 0.35 * sin(uTime * 9. + iA.w * 5.) : 0.;
        // position.x: -1/1 = which wing, position.y: 0..1 along the stroke, position.z: -1/1 across it
        vec3 strokeDir = k < 0.5 ? normalize(-tg * 0.7 + sd * position.x * 0.8 + vec3(0., 1., 0.) * flap * 0.5) : -tg;
        float len = (k < 0.5 ? 2.4 : 0.8) * iSc;
        vec3 wc = c + strokeDir * position.y * len;
        vec3 vdir = normalize(cameraPosition - wc);
        float w = max((k < 0.5 ? 0.16 : 0.1) * iSc, distance(cameraPosition, wc) * (k < 0.5 ? 0.0018 : 0.0012));
        vec3 w3 = wc + normalize(cross(strokeDir, vdir) + 1e-4) * position.z * w;
        vA = (k < 0.5 ? 1. : (1. - k / 9.) * 0.85) * smoothstep(12., 42., distance(cameraPosition, c));   // a stitch brushing the lens is a black brick: fade it
        vec4 mvPosition = viewMatrix * vec4(w3, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uBirdC; varying float vA;
      #include <fog_pars_fragment>
      void main(){ gl_FragColor = vec4(uBirdC, vA); 
        #include <fog_fragment>
      }`})}function un(h){return new s.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!1,uniforms:h,vertexShader:`
      attribute vec4 iS;            // seed xyz, size
      uniform float uTime, uMode; uniform vec3 uCamP;
      varying vec2 vQ; varying float vF, vTw;
      void main(){
        vec3 bx = uMode > 0.5 && uMode < 1.5 ? vec3(120., 70., 120.) : vec3(150., 60., 150.);
        vec3 vel = uMode < 0.5 ? vec3(0.9, 0.25 * sin(iS.x * 40.), 0.4) : (uMode < 1.5 ? vec3(0., -46., 0.) : vec3(0.8, -3.4, 0.3));
        vec3 p = iS.xyz * bx + vel * uTime;
        if (uMode != 1.) p += vec3(sin(uTime * 0.6 + iS.y * 30.), sin(uTime * 0.45 + iS.x * 50.) * 0.6, cos(uTime * 0.5 + iS.z * 40.)) * 1.6;
        p = mod(p - uCamP + bx * 0.5, bx) - bx * 0.5 + uCamP;
        vec4 mv = viewMatrix * vec4(p, 1.);
        float dist = -mv.z, sz = iS.w * max(1., dist * 0.012);
        vec2 q = position.xy;
        vec2 ext = uMode > 0.5 && uMode < 1.5 ? vec2(0.05, 1.3) : vec2(sz * (uMode > 1.5 ? 0.16 : 0.1));
        if (uMode > 1.5) { float sp = uTime * (1.5 + iS.w * 3.) + iS.x * 60.; q.x *= cos(sp); }     // sequins tumble
        mv.xy += q * ext * (uMode > 0.5 && uMode < 1.5 ? max(1., dist * 0.02) * vec2(1., 1.) : vec2(1.));
        vQ = position.xy; vF = smoothstep(1.5, 5., dist) * (1. - smoothstep(bx.x * 0.34, bx.x * 0.5, dist));
        vTw = pow(max(0., sin(uTime * (2. + iS.w * 4.) + iS.x * 90.)), 8.);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uMoteC; uniform float uMode;
      varying vec2 vQ; varying float vF, vTw;
      void main(){
        float r = length(vQ);
        float a = uMode > 0.5 && uMode < 1.5 ? (1. - abs(vQ.x)) * (1. - vQ.y * vQ.y) * 0.5 : (uMode > 1.5 ? (1. - smoothstep(0.8, 1., r)) * 0.9 : (1. - smoothstep(0.2, 1., r)) * 0.5);
        vec3 col = uMoteC * (uMode > 1.5 ? 0.8 + 2.2 * vTw : (uMode > 0.5 ? 1.0 + 1.6 * step(0.6, vQ.y) : 1.));
        gl_FragColor = vec4(col, a * vF);
      }`})}var mn={id:"stitched-country",name:"The Stitched Country",category:"domestic",weirdness:.75,media:["air","rail"],async build(h){const y=h.rng,F=h.noise,K=h.vary||{},oe=h.quality?.detail??1,P=_e(K.density??1,.7,1.3)*oe,q=e=>h.core.makeRng(h.core.hashSeed(e+":"+h.seed)),ve=K.hour||"any",B=ve==="dawn"?"morning":ve==="night"?"evening":ve==="golden"?y.pick(["autumn","autumn","evening"]):ve==="day"?y.pick(["afternoon","afternoon","spring","autumn","winter"]):y.pick(["afternoon","afternoon","afternoon","morning","morning","evening","evening","spring","spring","autumn","autumn","winter","winter"]),C=tn[B],Ye=C.pal.map(f),[bt,de,ye,De,fe,Fe,Ce]=Ye,Mt=B==="morning"&&y.chance(.55)?1:C.precip,j=y.chance(.5)?1:-1,yo=y.pick(["sheep","sheep","geese","rabbits"]),pa=y.pick(["fish","fish","frogs"]),ft=y.int(4,7),Ke=980,Pe=48,ma=16,Ge=y.range(770,790),ut=-34,xo=1010,He=-100,Ae=[y.range(20,32),N/y.range(720,900),y.range(0,N),y.range(5,8),N/y.range(360,460),y.range(0,N)],A=e=>Ae[0]*Math.sin(e*Ae[1]+Ae[2])+Ae[3]*Math.sin(e*Ae[4]+Ae[5]),va=e=>{const t=ee(1e3,1380,e);return j*(14+190*t*t)},st=e=>A(e)+va(e),Oe=e=>Ge+46*Math.sin(e*.0058+1.1),Qe=[[300,-1,195,80,1.4],[458,1,205,76,1],[628,-1,262,70,1],[926,1,205,67,1],[150,-1,102,58,.9]].map(([e,t,a,p,l])=>({x:A(e)+t*j*(a+y.range(-12,25)),z:-e,r:p*y.range(.92,1.06),h:y.range(28,40)*l})),X={x:A(525)-j*128,z:-525},Vt=[];for(let e=0;e<500&&Vt.length<28;e++){const t=y.range(-300,2e3),a=y.sign(),p=y.range(170,950),l=y.range(110,230)*(1+p/1500),r=y.range(18,44)*(.7+p/500),v=A(_e(t,0,1400))+a*p,x=-t;p-l*.8<105||Qe.some(b=>Math.hypot(v-b.x,x-b.z)<b.r+l+6)||Math.hypot(v-X.x,x-X.z)<l+60||Vt.push({x:v,z:x,r:l,h:r})}const T=(e,t)=>{const a=-t,p=e-A(a);let l=0;for(const v of Vt){const x=((e-v.x)*(e-v.x)+(t-v.z)*(t-v.z))/(v.r*v.r);x<1&&(l+=v.h*Math.pow(1-x,1.5))}l>0&&(l*=(1+.14*F.n2(e*.011,t*.011))*ee(25,90,Math.abs(a-Oe(e))));const r=Math.abs(p);return r>500&&(l+=30*ee(500,1700,r)*(.6+.4*F.n2(e*.0015,t*.0015))),l+=ma*ee(xo,1235,a)*(1-ee(1500,2e3,a))*Math.exp(-(p*p)/22500),l},rt=(e,t,a=0)=>{const p=-t,l=(e-A(p))*j,r=ee(1040,1150,p);if(l>Se(-15,-9.5,r)-a&&l<Se(27,9.5,r)+a||p>950&&Math.abs(e-st(p))<9+a||Math.abs(p-Oe(e))<23+a)return!1;for(const v of Qe)if(Math.hypot(e-v.x,t-v.z)<v.r+3+a)return!1;return!0},bo=e=>1-ee(150,200,e),dt=(e,t,a=0)=>{const p=-t,l=(e-A(p))*j,r=Math.max(ee(1040,1150,p),bo(p));if(l>Se(-15,-9.5,r)-a&&l<Se(27,9.5,r)+a||p>950&&Math.abs(e-st(p))<9+a||Math.abs(p-Oe(e))<23+a)return!1;for(const v of Qe)if(Math.hypot(e-v.x,t-v.z)<v.r+3+a)return!1;return!0},Xt=s.MathUtils.degToRad(C.el*.62+2),St=C.az*.55,Mo=Xt+.3,So=e=>$(-j*Math.sin(St)*Math.cos(e),Math.sin(e),-Math.cos(St)*Math.cos(e)),ga=So(Xt),Ct=So(Mo);await h.yield();const Co=(e,t=0)=>205+(30+t)*(1-ee(ut,200,e)),ko=e=>(e+Co(e)-.1*ct-100)/1150,Zt=.3,zo=70,wa=25,ya=1,jt=Qe[Qe.length-1],he=await Ja(h,{palette:C.pal,lightDir:Ct.toArray(),cloth:!1,roadLength:8*ct,knots:Math.round(420*P),threadHeight:96,gatherBack:zo,threadRadius:ya,feederSag:.07,feederSagMax:20,gatherSide:-16*j,layRadius:.8,stitchRadius:.7,darkField:.9,moundRings:30,moundSegs:80,needleWiden:.012,needleRim:.2,road:(e,t)=>{const a=A(e);return t.set(a,T(a,-e),-e)},mounds:Qe,fieldOrder:(e,t)=>{const a=_e((-t-150)/850,0,1);return Math.hypot(e-jt.x,t-jt.z)<jt.r?Math.min(a,(ko(-t)-Zt)/(1-Zt)):a},unravelSpan:Zt}),ae=he.uniforms;ae.uSun.value.setRGB(C.sun[0],C.sun[1],C.sun[2]).multiplyScalar(C.sun[3]),ae.uAmb.value.setRGB(...C.amb),ae.uShade.value.setRGB(...C.shade),C.moon&&ae.uButton.value.setRGB(.8,.86,1);const kt=he.anchors,zt=kt.portalSeat.position,dn=kt.portalSeat.direction;await h.yield();const E=new s.Scene,Ft=f(C.sky),Ut=f(C.glow),it=Ft.clone().multiplyScalar(C.fogK??.76).add(Ut.clone().multiplyScalar(.06));E.fog=new s.FogExp2(it,C.fogD),E.background=it.clone(),E.add(he.object);const xa=new s.HemisphereLight(f(C.glow),Fe.clone().lerp(bt,.5),C.lamp?.7:1.5),At=new s.DirectionalLight(f(C.glow).lerp(new s.Color(C.sun[0],C.sun[1],C.sun[2]),.6),C.lamp?1.1:2.2);At.position.copy(zt).addScaledVector(Ct,100),At.target.position.copy(zt),E.add(xa,At,At.target);const ie={uRip:ae.uRip,uTime:{value:0},uSunDir:ae.uSunDir,uSun:ae.uSun,uAmb:ae.uAmb,uRoad:{value:new s.Vector4(Ae[0],Ae[1],Ae[2],Ae[3])},uRoad2:{value:new s.Vector4(Ae[4],Ae[5],j,Ge)},uNeedleD:{value:0},uFrontD:{value:0},uEdgeD:{value:Ke},uSewD:{value:0},uShade:ae.uShade,uTrainP:{value:$(0,0,1e4)},uTrainD:{value:0},uPinD:{value:0},uLampC:{value:new s.Color(1,.72,.42).multiplyScalar(C.lamp*.95)},uLampP:{value:new s.Vector4(0,0,0,62)},uGlow:{value:C.glowK}},le=on(ie),ba=an(ie);{const e=[0];for(let d=3;d<2700;d+=Math.max(3,d*.1))e.push(d),e.unshift(-d);const t=[];for(let d=-1900;d<-70;d+=Math.max(8,(-70-d)*.22))t.push(d);for(let d=-70;d<=1425;d+=6.5)t.push(d);for(let d=1434;d<3200;d+=Math.max(8,(d-1425)*.22))t.push(d);const a=e.length,p=t.length,l=new Float32Array(a*p*3),r=new Uint32Array((a-1)*(p-1)*6);for(let d=0,o=0;d<p;d++){const n=t[d],m=A(n);for(let i=0;i<a;i++){const c=m+e[i];l[o++]=c,l[o++]=T(c,-n),l[o++]=-n}d%2===1&&await h.yield()}for(let d=0,o=0;d<p-1;d++){for(let n=0;n<a-1;n++){const m=d*a+n,i=m+1,c=m+a,w=c+1;r[o++]=m,r[o++]=i,r[o++]=c,r[o++]=i,r[o++]=w,r[o++]=c}d%32===31&&await h.yield()}const v=new s.BufferGeometry;v.setAttribute("position",new s.BufferAttribute(l,3)),v.setIndex(new s.BufferAttribute(r,1)),await h.yield();{const d=new Float32Array(l.length);for(let o=0;o<r.length;o+=3){const n=r[o]*3,m=r[o+1]*3,i=r[o+2]*3,c=l[i]-l[m],w=l[i+1]-l[m+1],S=l[i+2]-l[m+2],M=l[n]-l[m],k=l[n+1]-l[m+1],z=l[n+2]-l[m+2],Z=w*z-S*k,J=S*M-c*z,U=c*k-w*M;d[n]+=Z,d[n+1]+=J,d[n+2]+=U,d[m]+=Z,d[m+1]+=J,d[m+2]+=U,d[i]+=Z,d[i+1]+=J,d[i+2]+=U,o%9e3===8997&&await h.yield()}for(let o=0;o<d.length;o+=3){const n=1/(Math.sqrt(d[o]*d[o]+d[o+1]*d[o+1]+d[o+2]*d[o+2])||1);d[o]*=n,d[o+1]*=n,d[o+2]*=n}v.setAttribute("normal",new s.BufferAttribute(d,3))}await h.yield();const x=B==="winter"?f("#AFC6D6"):ye.clone().lerp(f("#4F8FB8"),.35),b=new s.Mesh(v,nn({...ie,uBareD:{value:He-160},uShade:ae.uShade,uLinen:ae.uLinen,uPencil:{value:f("#7FA8B8").lerp(ye,.3).multiplyScalar(.8)},uCrimson:ae.uCrimson,uPal:ae.uPal,uNe0:ae.uNe0,uNe1:ae.uNe1,uSt:ae.uSt,uStW:ae.uStW,uKnot:ae.uKnot,uSup:ae.uSup,uFeed:ae.uFeed,uRiverC:{value:x},uGold:{value:fe.clone()}}));b.name="linen",b.frustumCulled=!1,E.add(b)}await h.yield();const $e=[];for(let e=0;e<140&&$e.length<9;e++){const t=$e.length<5,a=t?y.range(-1.15,1.15):y.range(-3.1,3.1),p=t?y.range(.12,.3):y.range(.3,.6),l=y.range(.07,.14),r=Math.atan2(Math.sin(a+j*St),Math.cos(a+j*St));Math.hypot(r,p-Xt)<.2+l*1.6||$e.some(v=>Math.hypot(Math.atan2(Math.sin(a-v.x),Math.cos(a-v.x)),p-v.y)<(l+v.z)*1.7)||$e.push(new s.Vector4(a,p,l,y.range(1,90)))}for(;$e.length<9;)$e.push(new s.Vector4(0,0,0,0));const Ma=Ft.clone().lerp(Ut,.22).lerp(fe,.1).multiplyScalar(.86),Sa=Ft.clone().lerp(ye,.4).multiplyScalar(.7),Yt={uSkyC:{value:Ft},uSkyLow:{value:Ma},uSkyTop:{value:Sa},uGlowC:{value:Ut},uFogC:{value:it},uSunDir:{value:ga},uTime:ie.uTime,uMoon:{value:C.moon},uButton:{value:C.moon?new s.Color(.9,.92,1).multiplyScalar(1.02):new s.Color(1,.95,.88).multiplyScalar(.95)},uGold:{value:fe.clone()},uCloudC:{value:de.clone().multiplyScalar(C.moon?.7:1.08)},uStitchC:{value:Fe.clone().lerp(Ce,.25)},uCl:{value:$e}},Et=new s.Mesh(new s.SphereGeometry(4800,48,24),sn(Yt));Et.name="sky",Et.renderOrder=-10,Et.frustumCulled=!1,E.add(Et),await h.yield();{const e={uFogC:{value:it},uMSeed:{value:y.range(0,50)},uHaze:{value:B==="evening"?.26:.13},uMc:{value:Ce.clone().lerp(it,.12)},uMg:{value:fe.clone().lerp(it,.1)},uM0:{value:De.clone().lerp(fe,.2)},uM1:{value:De.clone().lerp(ye,.55)},uM2:{value:ye.clone().lerp(f("#9A8FB8"),.4)},uM3:{value:de.clone().lerp(ye,.15)}},t=new s.CylinderGeometry(2950,2950,800,160,1,!0).translate(0,400,0),a=new s.Mesh(t,ln(e));a.name="mountains",a.position.set(A(650),-12,-650),a.frustumCulled=!1,a.renderOrder=-5,E.add(a)}await h.yield();{const e=q("satin-clouds"),t=[{every:250,d0:-150,d1:1950,lat:[95,185],y:[106,138],w:[72,112]},{every:230,d0:-300,d1:2350,lat:[250,540],y:[130,205],w:[125,195]},{every:280,d0:-400,d1:2800,lat:[680,1500],y:[200,370],w:[230,390]}],a=t.reduce((x,b)=>x+Math.ceil((b.d1-b.d0)/b.every),0),p=new s.PlaneGeometry(2.6,1.24).translate(0,.2,0),l=new Float32Array(a),r=new s.InstancedMesh(p,rn({uTime:ie.uTime,uCloudC:Yt.uCloudC,uShade:ae.uShade,uSun:ae.uSun,uStitchC:Yt.uStitchC,uSunDir:ae.uSunDir}),a);r.name="satin-clouds",r.frustumCulled=!1;let v=0;for(const x of t)for(let b=x.d0+e.range(0,x.every);b<x.d1;b+=x.every){const d=e.sign(),o=d*e.range(x.lat[0],x.lat[1]),n=e.range(x.y[0],x.y[1]),m=e.range(x.w[0],x.w[1])/2.6,i=b+e.range(-.3,.3)*x.every;Wt.compose(da.set(A(i)+o,n+.3*m,-i),fa.setFromEuler(ua.set(0,-d*e.range(.1,.5),0)),ha.set(m,m*e.range(.9,1.15),1)),r.setMatrixAt(v,Wt),l[v++]=e.range(1,90)}r.count=v,p.setAttribute("aSeed",new s.InstancedBufferAttribute(l,1)),E.add(r)}await h.yield();const Ne=-j,re=(e,t,a)=>{const p=A(e)+t*Ne;return $(p,T(p,-e)+a,-e)},Me=kt.flyThrough,Fo=37,Ca=e=>{const t=A(-e.z);return e.x=t+_e(e.x-t,-Fo,Fo),e},Ao=8.5,Dt=38,Kt=(e,t,a)=>{const p=st(e)+j*t;return $(p,T(p,-e)+a,-e)};let qe=Ge;for(let e=0;e<6;e++)qe=Oe(A(qe)+j*Dt);const Eo=(e,t)=>re(qe+e,-Dt,t),ka=8.6+6.5*ft,Do=100,za=ka+20,Po=re(-X.z,9,24),Bo=Kt(qe-Do-za,Ao,6.5),Fa=Kt(qe-Do,Ao,5.5),To=(-Po.z-Bo.z)/2,Aa=(Me[1].x-A(-Me[1].z))*Ne>0?-1:1,Ht=(e,t,a)=>Ca(e.clone().add($(Ne*Aa*t,a,0))),Qt=Ht(Me[1],24,1.5),$t=-Qt.z,Ea=(Qt.x-A($t))*Ne,Ro=(e,t)=>re(Se(qe+20,$t,e),Se(-Dt,Ea,e),t),Lo=[re(ut,14,4),re(28,14,5),re(92,14,8),re(165,18,18),re(250,30,25),re(345,37,35),re(440,28,37),Po,Kt(To,0,13),Bo,Fa,Eo(-40,6),Eo(20,7),Ro(.3,23.5),Ro(.6,27.5),Qt,Ht(Me[2],17,-1.5),Ht(Me[2].clone().lerp(Me[3],.55),6.5,-1),Me[3].clone(),Me[4].clone()],Pt=ca(Lo),_o=-Lo[3].z,ht=(e,t,a,p)=>Pt.distanceTo(e,t,a)>p;await h.yield();const Jt=C.flowers.map(f),Ve=[];{const e=y.fork("flora"),t=70,a=(u,R)=>Math.max(0,Math.round(u*(t-Pe)/R)),p=Pe-He,l=(u,R)=>Math.round(u*p/R),r=ca([re(-34,14,4),re(28,14,5),re(92,14,8),re(165,18,18),re(250,30,30),re(345,37,43),re(440,28,44),re(540,15,30),re(640,14,16),re(Ge-10,15,12.5),re(880,15,13),re(965,14,15),Me[1].clone().add($(Ne*20,-3.5,0)),Me[2].clone().add($(Ne*16,-3.5,0)),Me[2].clone().lerp(Me[3],.55).add($(Ne*4.5,-1,0)),Me[3].clone(),Me[4].clone()]);await h.yield();const v=g(pe(new s.OctahedronGeometry(.5,0).scale(1,.7,1).translate(0,.3,0)),f("#ffffff"),{tint:1,ao:[0,.6],aoK:.5}),x=g(pe(new s.IcosahedronGeometry(.5,1).scale(1,.6,1).translate(0,.27,0)),f("#ffffff"),{tint:1,emis:-1});await h.yield();const b=Math.round(820*P),d=Math.round(6e3*P),o=Math.round(540*P),n=b-o,m=a(d,1500-(t+5)),i=a(o*.75,1262-(t+5)),c=l(d*.6,1500-(t+5)),w=l(o*.75,1262-(t+5)),S=Math.round(110*P),M=ce(v,le,d+m+c,"french-knots"),k=ce(x,le,b+i,"french-knots-near"),z=g(pe(new s.IcosahedronGeometry(.5,0).scale(1,.6,1).translate(0,.27,0)),f("#ffffff"),{tint:1,emis:-1}),Z=ce(z,le,c+w+S,"french-knots-arrival"),J=u=>u-Math.floor(u),U=(u,R)=>{let G=J(u*123.34),L=J(R*456.21);const D=G*(G+45.32)+L*(L+45.32);return G+=D,L+=D,J(G*L)},ge=(u,R)=>{const G=u/118,L=R/118,D=Math.floor(G),Y=Math.floor(L),O=G-D,ne=L-Y;let I=9,_=9;for(let Q=-1;Q<=1;Q++)for(let se=-1;se<=1;se++){const be=se+.14+.72*U(D+se,Y+Q),ze=Q+.14+.72*U(D+se+17.3,Y+Q+17.3),we=Math.hypot(be-O,ze-ne);we<I?(_=I,I=we):we<_&&(_=we)}return(_-I)*59};await h.yield();let Lt=0,Yo=0,_t=0;const io=async(u,R,G,L,D=n,Y=rt,O=!1)=>{for(let ne=0,I=0;ne<L&&I<L*3;I++){(I&15)===15&&await h.yield();const _=u.range(R,G),Q=u.chance(.4),se=Q?u.chance(.5)?-32-Math.abs(u.gauss())*9:44+Math.abs(u.gauss())*9:u.range(30,330)*u.sign(),be=A(_)+se*j,ze=-_;if(!Q&&ge(be,ze)>4.5||!Y(be,ze,1.5))continue;const we=u.int(5,9),nt=u.pick(Jt),lt=O?Math.abs(se+20)<50:Math.abs(se+20)<120&&_<1420&&Lt+we<=D;for(let Ee=0;Ee<we&&ne<L;Ee++,ne++){const gt=u.range(0,N),wt=Ee?u.range(.4,1.2):0,je=be+Math.cos(gt)*wt,Ue=ze+Math.sin(gt)*wt,Le=u.range(.6,1.2)*(Ee?.85:1.25);lt?H(O?Z:k,O?_t++:Lt++,je,T(je,Ue),Ue,u.range(0,N),Le*1.2,Le*1.2,Le*1.2,nt.clone().multiplyScalar(u.range(.82,1)),u.range(0,N),.03,0,0):H(M,Yo++,je,T(je,Ue),Ue,u.range(0,N),Le,Le,Le,nt.clone().multiplyScalar(u.range(.82,1)),u.range(0,N),.05,0,0)}}},lo=async(u,R,G,L,D,Y=rt,O=I=>ee(1040,1150,I),ne=!1)=>{for(let I=0,_=0;I<L&&_<L*4;_++){const Q=D&&_%4===0?u.range(1100,1262):u.range(R,G),se=O(Q),be=u.chance(.5)?Se(-16.5,-10.5,se)-Math.abs(u.gauss())*9:Se(28.5,10.5,se)+Math.abs(u.gauss())*9,ze=A(Q)+be*j,we=-Q,nt=u.int(3,5),lt=u.pick(Jt);for(let Ee=0;Ee<nt&&I<L;Ee++){const gt=u.range(0,N),wt=Ee?u.range(.75,1.5):0,je=ze+Math.cos(gt)*wt,Ue=we+Math.sin(gt)*wt;if(!Y(je,Ue,.5))continue;const Le=u.range(.95,1.6)*(Ee?.85:1.15);H(ne?Z:k,ne?_t++:Lt++,je,T(je,Ue),Ue,u.range(0,N),Le,Le,Le,lt.clone().multiplyScalar(u.range(.82,1)),u.range(0,N),.03,0,0),I++}(_&127)===127&&await h.yield()}};await io(e,t+5,1500,d),await lo(e,t+5,1262,o,!0),await h.yield();const Ko=[g(pe(te(3.6,0,8.2,0,1,.92,1)),f("#ffffff"),{tint:1,ao:[5,11]})];for(let u=0;u<3;u++)Ko.push(g(te(.62,0,.95+u*1.75,0,.75,1.6,.75,0),Fe.clone().multiplyScalar(.8+.12*(u%2))));const Xa=20,vt=Math.round(340*P),Ho=a(vt*.8,1560-(t+15)),Qo=Math.round(P*(1330-Ge)/Xa),$o=5,co=3,Jo=l(vt*.4,1560-(t+15)),fo=2,uo=ce(Te(Ko),le,vt+Ho+Qo+2*($o-fo)*co+Jo,"pom-pom-trees"),ea=[g(pe(te(3.6,0,8.2,0,1,.92,1,2)),f("#ffffff"),{tint:1,ao:[5,11]})];for(let u=0;u<3;u++)ea.push(g(te(.62,0,.95+u*1.75,0,.75,1.6,.75,0),Fe.clone().multiplyScalar(.8+.12*(u%2))));const ho=ce(Te(ea),le,2*fo*co,"grove-trees"),Za=B==="winter"?[f("#F4F6F4"),f("#DDE5E8"),f("#EDEAE0")]:B==="autumn"?[f("#CE7E2C"),f("#D99A2E"),f("#8A5A3C"),f("#8A8A3A")]:B==="spring"?[f("#F2A6BE"),f("#9CC76C"),f("#F6D2DC"),f("#7FB067")]:[De.clone().multiplyScalar(.7),De.clone().lerp(fe,.3).multiplyScalar(.75),De.clone().multiplyScalar(.55)];let at=0,ta=0,oa=0;const po=(u,R,G,L,D,Y,O=22,ne=7,I=!1)=>{const _=u.range(0,N),Q=D*u.range(.9,1.15),se=u.pick(Za).clone().multiplyScalar(u.range(.85,1.1)),be=u.range(0,N);!ht(R,G+8*D,L,O)||O<22&&!ht(R,G+3*D,L,ne)||(Ve.push(R,G,L,D,Y?1:0),H(I?ho:uo,I?oa++:ta++,R,G,L,_,D,Q,D,se,be,.03,0,0))};for(let u=0;at<vt&&u<vt*12;u++){const R=at>=14&&at%5===2,G=at<14?e.range(70,150):R?e.range(Ke+10,1330):e.range(t+15,1560),L=at<14?e.range(46,120)*(at%2?1:-1):R?e.range(24,135)*e.sign():(25+Math.pow(e(),1.6)*470)*e.sign(),D=A(G)+L,Y=-G,O=T(D,Y),ne=e.range(.8,1.35);!rt(D,Y,6)||Math.hypot(D-X.x,Y-X.z)<62||!(r.distanceTo(D,O+8*ne,Y)>15)||F.n2(D*.008,Y*.008)<-.25||(at++,po(e,D,O,Y,ne,R),(u&7)===7&&await h.yield())}await h.yield();const aa=B==="autumn",ja=g(new s.CylinderGeometry(.2,.05,1.7,3,1,!0).translate(0,.8,0),f("#ffffff"),{tint:1,ao:[0,1.4]}),Gt=Math.round(4600*P),na=a(Gt,1350-(t+10)),sa=l(Gt,1350-(t+10)),Nt=ce(ja,le,Gt+na+sa+S,"tassel-wheat"),ra=B==="winter"?f("#F2F0E8"):fe.clone().lerp(de,.25);let mo=0;const vo=async(u,R,G,L,D=rt)=>{for(let Y=0,O=0;Y<L&&O<L*10;O++){(O&511)===511&&await h.yield();const ne=u.range(R,G),I=u.chance(.5)?u.range(-170,-17):u.range(29,150),_=A(ne)+I*j,Q=-ne;if(F.n2(_*.007+40,Q*.007)<.12||!D(_,Q,1)||Math.hypot(_-X.x,Q-X.z)<58)continue;const se=u.range(.9,1.5);Y++,H(Nt,mo++,_,T(_,Q),Q,u.range(0,N),se,se*(aa?.3:1),se,ra.clone().multiplyScalar(u.range(.75,1.05)),u.range(0,N),.2,0,1)}};await vo(e,t+10,1350,Gt);const ia=e.fork("knots"),Ua=e.fork("trees"),Ya=e.fork("wheat"),Ka=e.fork("more-trees");await io(ia,Pe+5,t+5,m),await lo(ia,Pe+5,t+5,i,!1),await vo(Ya,Pe+10,t+10,na);const go=(u,R,G,L=rt)=>{for(let D=0,Y=0;D<R&&Y<R*12;Y++){const[O,ne]=G(u),I=A(O)+ne,_=-O,Q=T(I,_),se=u.range(.8,1.35);!L(I,_,6)||Math.hypot(I-X.x,_-X.z)<62||F.n2(I*.008,_*.008)<-.25||(D++,po(u,I,Q,_,se,O>Ke))}};go(Ua,Ho,u=>[u.range(Pe+15,t+15),(25+Math.pow(u(),1.6)*470)*u.sign()]),go(Ka,Qo,u=>[u.range(Ge,1330),u.range(24,135)*u.sign()]);const Ha=u=>Math.max(ee(1040,1150,u),bo(u)),la=q("arrival-knots"),Qa=q("arrival-wheat"),$a=q("arrival-trees");await io(la,He+5,Pe+5,c,0,dt,!0),await lo(la,He+5,Pe+5,w,!1,dt,Ha,!0),await vo(Qa,He+10,Pe+10,sa,dt),go($a,Jo,u=>[u.range(He+15,Pe+15),(25+Math.pow(u(),1.6)*470)*u.sign()],dt);const Be=q("railless-verge");for(let u=0,R=0;u<S&&R<S*4;R++){const G=Be.range(He+5,196),L=Be.range(10.5,28),D=A(G)+L*j,Y=-G,O=Be.int(3,5),ne=Be.pick(Jt),I=Be.chance(.5);for(let _=0;_<O;_++){const Q=Be.range(0,N),se=_?Be.range(.75,1.5):0,be=D+Math.cos(Q)*se,ze=Y+Math.sin(Q)*se,we=Be.range(.95,1.6)*(_?.85:1.15),nt=Be.range(0,N),lt=Be.range(.82,1),Ee=Be.range(0,N);u>=S||!dt(be,ze,.5)||(I?H(Nt,mo++,be,T(be,ze),ze,nt,we*.9,we*.9*(aa?.3:1),we*.9,ra.clone().multiplyScalar(lt),Ee,.2,0,1):H(Z,_t++,be,T(be,ze),ze,nt,we,we,we,ne.clone().multiplyScalar(lt),Ee,.03,0,0),u++)}}const qt=q("grove");for(const u of[-1,1])for(let R=0;R<co;R++)for(let G=0;G<$o;G++){const L=Dt+18.5+G*11.5+qt.range(-2.5,2.5),D=u*(29+R*15+qt.range(-5,5)),Y=qt.range(1.2,1.6);let O=Ge;for(let I=0;I<4;I++)O=Oe(A(O)+j*L)+D;const ne=A(O)+j*L;po(qt,ne,T(ne,-O),-O,Y,!1,3.6*Y+11,11,G<fo)}M.count=Yo,k.count=Lt,Z.count=_t,uo.count=ta,ho.count=oa,Nt.count=mo,E.add(k),E.add(Z),E.add(M),E.add(uo),E.add(ho),E.add(Nt)}await h.yield();let Bt=null;const me=$(),Je=[];{const e=y.fork("village"),t=[],a=[de,f("#E9C9B4"),f("#CFE0D6"),f("#EAD9A8"),f("#D9C4D6")],p=[Fe.clone().lerp(fe,.35),Fe,ye.clone().multiplyScalar(.8),fe.clone().multiplyScalar(.85)],l=f("#F3C94F"),r=[],v=(c,w,S,M,k,z)=>{const Z=[g(V(M,z,k,0,z/2,0),e.pick(a).clone().multiplyScalar(.92),{ao:[0,z]}),g(new s.CylinderGeometry(0,.78,1,4,1).rotateY(Math.PI/4).scale(M*1.02,z*.75,k*1.05).translate(0,z+z*.375,0),e.pick(p).clone().multiplyScalar(.9)),g(V(1.3,2.4,.3,0,1.2,k/2+.1),Fe.clone().multiplyScalar(.8))];for(const U of[-1,1])Z.push(g(V(1.3,1.3,.3,U*M*.3,z*.6,k/2+.1),l,{emis:1}),g(V(.3,1.3,1.3,U*(M/2+.1),z*.6,0),l,{emis:1}));const J=T(c,w);for(const U of Z)U.rotateY(S).translate(c,J,w),t.push(U);r.push($(c,J+z*1.75,w)),Je.push([c,J,w,z*1.3,M*.62,0,.9])};for(let c=0;c<14;c++){const w=c<5?0:1,S=c/(w?9:5)*N+e.range(-.2,.2),M=(w?44:21)+e.range(-4,4),k=X.x+Math.cos(S)*M,z=X.z+Math.sin(S)*M;v(k,z,Math.atan2(X.x-k,X.z-z)+e.range(-.3,.3),e.range(7,10),e.range(6,7.5),e.range(4.2,5.6)),c%4===3&&await h.yield()}{const c=T(X.x,X.z),w=[g(V(8,9,17,0,4.5,0),de.clone().multiplyScalar(.95),{ao:[0,9]}),g(new s.CylinderGeometry(0,.78,1,4,1).rotateY(Math.PI/4).scale(8.3,5,17.6).translate(0,11.5,0),ye.clone().multiplyScalar(.7)),g(V(5.2,19,5.2,0,9.5,-10.5),de.clone().multiplyScalar(.9),{ao:[0,19]}),g(new s.ConeGeometry(3.9,11,4).rotateY(Math.PI/4).translate(0,24.5,-10.5),Ce.clone().lerp(Fe,.35)),g(te(1,0,30.6,-10.5),f("#CFEFFF"),{emis:2}),g(V(1.6,3.4,.4,0,12,-7.8),l,{emis:1})];for(const S of[-1,1])for(let M=-1;M<=1;M++)w.push(g(V(.3,3,1.6,S*4.1,5,M*5),l,{emis:1}));for(const S of w)S.rotateY(e.range(0,N)*0+(j>0?.6:-.6)).translate(X.x,c,X.z),t.push(S)}me.set(X.x+j*62,0,X.z-34),me.y=T(me.x,me.z),Je.push([X.x,T(X.x,X.z),X.z,15,9,0,.9],[me.x,me.y,me.z,17,3.6,0,1]);const x=[de,fe,ye,f("#E9C9B4"),De];for(let c=0;c<4;c++)t.push(g(new s.CylinderGeometry(3.3-c*.45,3.75-c*.45,4.2,10,1,!0).translate(me.x,me.y+2.1+c*4.2,me.z),x[(c+e.int(0,3))%5].clone().multiplyScalar(.9)));t.push(g(new s.ConeGeometry(2.6,3.4,10).translate(me.x,me.y+18.5,me.z),Fe.clone().multiplyScalar(.9)));const b=ce(Te(t),le,1,"felt-village");H(b,0,0,0,0,0,1,1,1,null,0,0,0,-1),E.add(b);const d=[g(te(.7,0,0,.5,1,1,1,0),Fe)];for(let c=0;c<4;c++){const w=c*Math.PI/2;d.push(g(V(.35,10.5,.25,0,5.25,.4).rotateZ(w),Fe.clone().multiplyScalar(.8)));for(let S=0;S<3;S++)d.push(g(V(2.6,2.3,.12,1.5,3.6+S*2.5,.5).rotateZ(w),x[(c+S)%5].clone().multiplyScalar(.95)))}Bt=ce(Te(d),le,1,"windmill-sails"),me.y+=16.2,E.add(Bt),await h.yield();const o=new s.BufferGeometry;o.setAttribute("position",new s.Float32BufferAttribute([-.55,0,0,.55,0,0,0,-1.3,0],3)),o.setAttribute("normal",new s.Float32BufferAttribute([0,0,1,0,0,1,0,0,1],3));const n=[],m=[Ce,fe,ye,de,De];for(let c=0;c<r.length;c++){const w=r[c];let S=null,M=1e9;for(let z=0;z<r.length;z++){if(z===c)continue;const Z=w.distanceTo(r[z]);Z<M&&(z>c||Z>0)&&(M=Z,S=r[z])}const k=r[(c+1)%r.length];for(const z of[S,k]){if(!z||z===w)continue;const Z=Math.floor(w.distanceTo(z)/1.5),J=Math.atan2(z.x-w.x,z.z-w.z)+Math.PI/2;for(let U=1;U<Z;U++){const ge=U/Z;n.push([Se(w.x,z.x,ge),Se(w.y,z.y,ge)-1.2-Math.sin(Math.PI*ge)*2.2,Se(w.z,z.z,ge),J])}}}const i=ce(g(o,f("#ffffff"),{tint:1}),le,n.length,"bunting");n.forEach((c,w)=>H(i,w,c[0],c[1],c[2],c[3],1,1,1,m[w%5],w*.9,.35,0,-1)),E.add(i)}await h.yield();{const e=y.fork("flock"),t=f("#3A3030"),a=[],p=n=>(m,i,c)=>(i<.7?n:0)*(m*c>0?1:-1);let l=.55,r=1.25,v=de.clone();if(yo==="sheep"){a.push(g(pe(te(1.15,0,1.55,0,1,.85,1.25)),f("#ffffff"),{tint:1,ao:[.6,2.2]}),g(te(.5,0,1.95,1.4,.85,1,1.1),t),g(pe(te(.42,0,2.45,1.05)),f("#ffffff"),{tint:1}));for(const n of[-1,1]){a.push(g(V(.5,.14,.26,n*.5,2.1,1.3),t));for(const m of[-1,1])a.push(g(V(.2,.9,.2,n*.5,.45,m*.75),t,{leg:p(.3)}))}}else if(yo==="geese"){l=.3,r=1.2,v=f("#FBFBF6"),a.push(g(pe(te(.85,0,1.25,0,.8,.8,1.5)),f("#ffffff"),{tint:1,ao:[.5,1.8]}),g(It(.2,.26,1.3,0,1.5,1,6).rotateX(.25),f("#ffffff"),{tint:1}),g(te(.33,0,2.95,1.6),f("#ffffff"),{tint:1}),g(new s.ConeGeometry(.15,.6,5).rotateX(Math.PI/2).translate(0,2.9,2.1),f("#E8862E")),g(new s.ConeGeometry(.5,1,4).rotateX(-Math.PI/2.4).translate(0,1.5,-1.5),f("#ffffff"),{tint:1}));for(const n of[-1,1])a.push(g(V(.14,.7,.14,n*.3,.35,0),f("#E8862E"),{leg:(m,i)=>(i<.5?.3:0)*n}))}else{l=1.2,r=1,v=y.pick([f("#E9DCC6"),f("#C9B49A"),f("#F6F2EA")]),a.push(g(pe(te(.9,0,1,0,.9,.9,1.2)),f("#ffffff"),{tint:1,ao:[.2,1.6]}),g(pe(te(.55,0,1.75,.95)),f("#ffffff"),{tint:1}),g(pe(te(.34,0,1,-1.15)),f("#FFFFFF")));for(const n of[-1,1])a.push(g(V(.24,1.3,.12,n*.25,2.75,.85).rotateZ(-n*.12),f("#ffffff"),{tint:1}),g(V(.1,.1,.1,n*.26,1.85,1.45),t))}const x=60,b=ce(Te(a),le,x,"flock"),d=[X.x+j*66,X.z+52],o=[X.x+j*60,X.z-86];for(let n=0,m=0;n<x&&m<2e3;m++){const i=m%2?d:o,c=e.range(0,N),w=Math.sqrt(e())*30,S=i[0]+Math.cos(c)*w,M=i[1]+Math.sin(c)*w;if(!rt(S,M,7))continue;const k=r*e.range(.85,1.2);H(b,n++,S,T(S,M),M,e.range(0,N),k,k,k,v.clone().multiplyScalar(e.range(.86,1)),e.range(0,40),0,l*e.range(.7,1.2),-1),b.count=n}E.add(b)}await h.yield();{const e=y.fork("cut-threads"),t=Math.round(130*_e(P,.7,1.2)),a=7,p=-40,l=150,r=2*Math.ceil((l-p)/a),v=ce(g(new s.TorusGeometry(1,.11,4,8,Math.PI),f("#ffffff"),{tint:1,ao:[-.1,.5]}),le,t+r,"cut-threads"),x=[Ce,Ce,Ce,de,fe.clone().lerp(de,.4),De.clone().lerp(de,.3)];let b=0;for(let o=0;b<t&&o<t*8;o++){const n=e.range(-70,Pe+34),m=e.gauss()*27,i=A(n)+m,c=-n,w=T(i,c),S=e.chance(.15),M=e.range(.7,1.9)*(S?1.6:1),k=e.range(0,N),z=e.range(.5,1.5),Z=e.pick(x).clone().multiplyScalar(e.range(.85,1.05)),J=e.range(0,N),U=e.range(-.5,.5);Math.abs(m)<2.8||!ht(i,w+1,c,S?17:9)||H(v,b++,i,w-.06,c,k,M,M*z,M,Z,J,.3,0,-1,0,U)}const d=q("road-loops");for(const o of[-1,1])for(let n=0,m=p+d.range(0,a);n<r/2;n++){const i=m+n*a+d.range(-1.5,1.5),c=o*d.range(4.6,6.4),w=d.range(1.3,2.6),S=d.range(.8,1.5),M=Math.PI/2+d.range(-.45,.45),k=d.range(.88,1.06),z=d.range(0,N),Z=d.range(-.35,.35),J=A(i)+c,U=-i,ge=T(J,U);i>l||!ht(J,ge+w*S*.6,U,7)||H(v,b++,J,ge-.06,U,M+Math.atan2(A(i)-A(i+4),4),w,w*S,w,Ce.clone().multiplyScalar(k),z,.3,0,-1,0,Z)}v.count=b,E.add(v)}const Ie={mesh:null,n0:0,set:null};{const e=Math.min(1.5,1/Math.tan(Mo)),t=$(-Ct.x,0,-Ct.z).normalize(),a=$(),p=$(),l=$(),r=2;for(let o=0;o<Ve.length;o+=5)Je.push([Ve[o],Ve[o+1],Ve[o+2],8.2*Ve[o+3],3.7*Ve[o+3],Ve[o+4],1]);const v=Je.length+ft+1,x=new s.CircleGeometry(1,14).rotateX(-Math.PI/2),b=new Float32Array(v*2).fill(1),d=new s.InstancedMesh(x,cn({uRip:ie.uRip,uRoad:ie.uRoad,uRoad2:ie.uRoad2,uSewD:ie.uSewD,uEdgeD:ie.uEdgeD,uFogD:{value:C.fogD},uK:{value:C.lamp?.36:B==="winter"?.42:.6},uShadeC:{value:new s.Color(...C.shade).multiplyScalar(.24)}}),v);d.name="cast-shadows",d.frustumCulled=!1,d.renderOrder=1,Ie.set=(o,n,m,i,c)=>{const w=(i*e+1.6*c)/2,S=w-.6*c,M=n+t.x*S,k=m+t.z*S;a.set(T(M-r,k)-T(M+r,k),2*r,T(M,k-r)-T(M,k+r)).normalize(),p.copy(t).addScaledVector(a,-t.dot(a)).normalize(),l.crossVectors(p,a),d.setMatrixAt(o,Wt.makeBasis(p.multiplyScalar(w),a,l.multiplyScalar(c*1.05)).setPosition(M,T(M,k)+.1,k))};for(let o=0;o<Je.length;o++){const n=Je[o];Ie.set(o,n[0],n[2],n[3],n[4]),b[o*2]=n[5],b[o*2+1]=n[6],(o&63)===63&&await h.yield()}x.setAttribute("iR",new s.InstancedBufferAttribute(b,2)),Ie.mesh=d,Ie.n0=Je.length,E.add(d)}await h.yield();let Xe=Ge;for(let e=0;e<8;e++)Xe=Oe(st(Xe));ie.uPinD.value=Xe;const Da=e=>2.3*ee(Xe-34,Xe-22,e)*(1-ee(Xe+22,Xe+34,e)),et=(e,t)=>{const a=st(e),p=st(e+2);return t.pos.set(a,T(a,-e)+Da(e),-e),t.yaw=Math.atan2(-(p-a),2),t};{const e=fe.clone().lerp(f("#C9A24A"),.5).multiplyScalar(1.05),t=B==="winter"?f("#E6E6E2"):ye.clone().lerp(bt,.35).multiplyScalar(.8),a=(x,b,d)=>{const o=new s.InstancedBufferGeometry;o.index=x.index;for(const i of["position","normal","color"])o.setAttribute(i,x.attributes[i]);const n=[];for(let i=196;i<1520;i+=b)n.push(i,1,i,-1);o.setAttribute("iZ",new s.InstancedBufferAttribute(new Float32Array(n),2)),o.instanceCount=n.length/2;const m=new s.Mesh(o,ba);m.name=d,m.frustumCulled=!1,E.add(m)};a(g(V(.6,.38,.6,.28,.19,0),e),1.5,"zip-teeth"),a(g(V(1.7,.12,4.3,1.25,0,0),t),4.1,"zip-tapes");const p=et(Xe,{pos:$(),yaw:0}),l=[];for(const x of[-1,1])l.push(new s.CylinderGeometry(.6,.6,62,10).rotateX(Math.PI/2).translate(x*2.9,0,0));l.push(new s.TorusGeometry(2.9,.6,8,28).rotateX(Math.PI/2).translate(0,0,31),new s.TorusGeometry(2.2,.6,8,28).rotateX(Math.PI/2).translate(0,.9,32.5)),l.push(new s.SphereGeometry(1,14,10).scale(4.3,1.5,3.4).translate(0,.2,-31.5));const r=Te(l.map(x=>g(x,f("#ffffff"))));r.deleteAttribute("color"),r.deleteAttribute("aFx"),r.translate(0,-300,0);const v=new s.Mesh(r,he.object.getObjectByName("needle").material);v.name="safety-pin",v.frustumCulled=!1,v.position.set(p.pos.x,300+1.15,p.pos.z),v.rotation.y=p.yaw,E.add(v)}await h.yield();const ue={n:ft,reels:null,loco:null,tab:null,steam:null,pose:{pos:$(),yaw:0}};{const e=y.fork("train"),t=fe.clone().lerp(f("#C9A24A"),.4),a=Fe.clone().lerp(fe,.3).multiplyScalar(1.25),p=(o,n)=>{const m=o.attributes.position;for(let i=0;i<m.count;i++){const c=m.getZ(i);c<0&&m.setX(i,m.getX(i)*(1+c*n))}return o},l=[g(p(V(3.6,.6,7.2,0,.7,0),.07),t.clone().multiplyScalar(.85)),g(p(V(2.7,1.7,5.4,0,1.85,-.3),.1),t,{ao:[.8,2.6]}),g(V(.9,1.1,2.6,0,3.2,-.2),t.clone().multiplyScalar(1.1)),g(It(.42,.55,2.4,0,2.6,-2.4,10),t.clone().multiplyScalar(.9)),g(It(.75,.5,.5,0,5,-2.4,10),t),g(V(2.6,2.1,1.9,0,3.7,2.3),Ce.clone().multiplyScalar(.9),{ao:[2.6,4.8]}),g(V(2.9,.25,2.3,0,4.85,2.3),de.clone().multiplyScalar(.9)),g(V(.3,3.4,.3,0,5.3,.4),t)];for(const o of[-1,1])l.push(g(V(.12,.9,1,o*1.33,3.9,2.3),f("#F3C94F"),{emis:1}));ue.loco=ce(Te(l),le,1,"zip-slider"),E.add(ue.loco);const r=[g(V(1.7,3,.26,0,-2.3,0),t.clone().multiplyScalar(1.05)),g(new s.TorusGeometry(.62,.17,6,14).translate(0,-.45,0),t),g(V(.9,1.3,.3,0,-2.6,0),t.clone().multiplyScalar(.6))];ue.tab=ce(Te(r),le,1,"pull-tab"),E.add(ue.tab),await h.yield();const v=[];for(const o of[-1,1]){const n=new s.CylinderGeometry(2.5,2.5,.4,16).rotateZ(Math.PI/2).translate(o*1.7,0,0),m=g(n,a),i=m.attributes.position,c=m.attributes.color;for(let w=0;w<i.count;w++){const S=Math.atan2(i.getZ(w),i.getY(w)),M=Math.hypot(i.getZ(w),i.getY(w)),k=(Math.floor((S+Math.PI)/N*6+.01)%2?.72:1.05)*(M<.1?.6:1);c.setXYZ(w,c.getX(w)*k,c.getY(w)*k,c.getZ(w)*k)}v.push(m,g(new s.CylinderGeometry(.55,.55,.3,8).rotateZ(Math.PI/2).translate(o*2,0,0),a.clone().multiplyScalar(.6)))}const x=new s.CylinderGeometry(1.95,1.95,3,18,6).rotateZ(Math.PI/2);{const o=x.attributes.position;for(let n=0;n<o.count;n++){const m=o.getX(n),i=1+.06*Math.cos(m*2.2)-0;o.setY(n,o.getY(n)*i),o.setZ(n,o.getZ(n)*i)}x.computeVertexNormals()}const b=g(x,f("#ffffff"),{tint:1});{const o=b.attributes.position,n=b.attributes.color;for(let m=0;m<o.count;m++){const i=.82+.18*Math.abs(Math.sin(o.getX(m)*9+Math.atan2(o.getZ(m),o.getY(m))));n.setXYZ(m,i,i,i)}}v.push(b),ue.reels=ce(Te(v),le,ft,"cotton-reels"),E.add(ue.reels);const d=e.shuffle([Ce,fe,ye,De,f("#E58CA4"),de,f("#8E6FB0"),f("#E8862E")].map(o=>o.clone()));for(let o=0;o<ft;o++)H(ue.reels,o,0,-50,0,0,1,1,1,B==="winter"?[Ce,f("#F4F4F0"),fe.clone().lerp(f("#D9A441"),.8),f("#DCE8F4"),f("#F6DDE4"),f("#F4F4F0"),f("#BCD2E8")][o%7]:d[o],o,0,0,-1);ue.steam=ce(g(pe(te(1,0,0,0)),f("#ffffff"),{tint:1}),le,16,"cotton-steam"),E.add(ue.steam)}await h.yield();const pt=[],eo=7,to=3.6;let tt=null;{const e=y.fork("river"),t=A(Ge),a=Math.round(420*P),p=ce(g(new s.CircleGeometry(.55,6).rotateX(-Math.PI/2),f("#ffffff"),{tint:1,emis:2}),le,a,"sequins"),l=[f("#DCEBF4"),f("#F6E7B0"),ye.clone().lerp(f("#ffffff"),.4),f("#F3B6C4")];for(let o=0;o<a;o++){const n=t+e.range(-330,330),m=Oe(n)+e.range(-16,16),i=e.range(.6,1.5);H(p,o,n,T(n,-m)+.3,-m,e.range(0,N),i,i,i,e.pick(l),e.range(0,N),0,0,-1,e.range(-.3,.3),e.range(-.3,.3))}E.add(p);const r=pa==="frogs",v=r?f("#7FB85A"):e.pick([f("#E8862E"),f("#E58CA4"),f("#F3C94F")]),x=r?[g(pe(te(.9,0,0,0,1,.7,1.15)),f("#ffffff"),{tint:1}),g(te(.26,.4,.5,.75,1,1,1,0),f("#FFFFFF"),{emis:2}),g(te(.26,-.4,.5,.75,1,1,1,0),f("#FFFFFF"),{emis:2}),g(V(.3,.2,1.6,.8,-.3,-.9),f("#ffffff"),{tint:1}),g(V(.3,.2,1.6,-.8,-.3,-.9),f("#ffffff"),{tint:1})]:[g(pe(te(1,0,0,0,.42,.75,1.7)),f("#ffffff"),{tint:1}),g(new s.ConeGeometry(.9,1.3,3).rotateX(-Math.PI/2).scale(.2,1,1).translate(0,0,-2.1),f("#ffffff"),{tint:1}),g(V(.08,.5,.9,0,.8,-.1),f("#ffffff"),{tint:1}),g(te(.13,.33,.2,1.1,1,1,1,0),f("#2A2A30"))];if(!r)for(let o=0;o<5;o++)for(const n of[-1,1])x.push(g(new s.CircleGeometry(.2,6).rotateY(n*Math.PI/2).translate(n*(.4-Math.abs(o-2)*.05),.1*(o%2),-.9+o*.42),f("#F6F0D8"),{emis:2}));tt=ce(Te(x),le,12,"leapers"),E.add(tt);const b=q("river-leapers"),d=12;for(let o=0;pt.length<12&&o<60;o++){let n,m;do n=t+b.range(-75,75),m=(n-t)*j;while(m>-5&&m<24||Math.abs(m+8)<4);const i={x:n,d:Oe(n)+b.range(-12,12),dir:b.sign(),T:b.range(2,3.4),ph:b.range(0,4),s:b.range(.8,1.25)*(r?1:1.1),col:v.clone().multiplyScalar(b.range(.8,1.1))};let c=!0;for(let w=0;w<=6&&c;w++)c=ht(i.x+(w/6-.5)*eo,T(i.x,-i.d)+Math.sin(Math.PI*w/6)*to-.7,-i.d,d+2.8*i.s+.5);c&&pt.push(i)}tt.count=pt.length}{const e=y.fork("swallows"),t=Math.max(10,Math.round(24*_e(P,.7,1.2))),a=t+12,p=new s.BufferGeometry,l=[],r=[];for(const n of[-1,1]){const m=l.length/3;l.push(n,0,-1,n,0,1,n,1,-1,n,1,1),r.push(m,m+1,m+2,m+1,m+3,m+2)}const v=new s.InstancedBufferGeometry;v.setAttribute("position",new s.Float32BufferAttribute(l,3)),v.setIndex(r);const x=new Float32Array(a*9*4),b=new Float32Array(a*9*4),d=new Float32Array(a*9);for(let n=0;n<a;n++){const m=n>=t,i=m?e.range(700,1300):e.range(60,1230),c=e.sign(),w=m?e.range(0,90):e.range(18,110),S=A(i)+c*w,M=T(S,-i)+(m?e.range(58,96):e.range(16,46)),k=e.range(0,N),z=m?e.range(70,150):e.range(26,70),Z=m?e.range(90,180):e.range(40,95),J=(m?e.range(.16,.28):e.range(.3,.55))*e.sign(),U=m?e.range(1.5,2.1):1;for(let ge=0;ge<9;ge++)x.set([S,M,-i,k],(n*9+ge)*4),b.set([z,Z,J,ge],(n*9+ge)*4),d[n*9+ge]=U}v.setAttribute("iA",new s.InstancedBufferAttribute(x,4)),v.setAttribute("iB",new s.InstancedBufferAttribute(b,4)),v.setAttribute("iSc",new s.InstancedBufferAttribute(d,1)),v.instanceCount=a*9,p.dispose();const o=new s.Mesh(v,fn({uTime:ie.uTime,uBirdC:{value:f(B==="evening"?"#2A2230":"#34405E")}}));o.name="swallows",o.frustumCulled=!1,E.add(o)}const oo={uTime:ie.uTime,uMode:{value:Mt},uCamP:{value:$()},uMoteC:{value:Mt===1?new s.Color(.8,.9,1).multiplyScalar(1.1):Mt===2?new s.Color(1,1,1):de.clone().lerp(f(C.glow),.5).multiplyScalar(C.lamp?1.5:1.02)}};{const e=y.fork("air"),t=Math.round((Mt===0?700:1500)*P),a=new s.InstancedBufferGeometry,p=new s.PlaneGeometry(2,2);a.index=p.index,a.setAttribute("position",p.attributes.position);const l=new Float32Array(t*4);for(let v=0;v<t;v++)l.set([e(),e(),e(),e.range(.5,1.5)],v*4);a.setAttribute("iS",new s.InstancedBufferAttribute(l,4)),a.instanceCount=t;const r=new s.Mesh(a,un(oo));r.name="air",r.frustumCulled=!1,r.renderOrder=5,E.add(r)}await h.yield();let We=null;if(K.rare){const e=(B==="autumn"||B==="evening"?["#D8CDBC","#C9BCAA","#E4DACA","#BDB0A0","#D2C6B6"]:B==="winter"?["#8A6248","#9C6E4C","#74523E","#A87A54","#80604A"]:["#9A6A48","#B07A4E","#7E5A44","#C08A5A","#8C6650"]).map(f),t=[],a=(r,v,x,b,d,o,n,m)=>t.push(g(pe(te(r,v,x,b,d,o,n)),f("#ffffff"),{tint:1,...m}));a(4.2,0,6.3,0,.85,.9,1.35,{ao:[2.5,9]}),a(2.7,0,9.4,1.8,.9,.9,1),a(2.6,0,8.4,5.4,.9,1.1,.95);for(let r=0;r<6;r++)a(1.05-r*.11,0,6.6-r*1,7.5+Math.sin(r*.6)*1.1,1,1.2,1,{leg:()=>.12*r});for(const r of[-1,1]){for(let v=0;v<5;v++)t.push(g(te(.42-v*.05,r*(1.3+v*.25),6.4-Math.sin(v*.7)*1.6,7+v*.9,1,1,1,0),f("#F4EBD6")));t.push(g(pe(te(1.7,r*2.5,8.6,4.6,.25,1,.8)),f("#ffffff"),{tint:1}));for(const v of[-1,1])t.push(g(It(1,1.25,5.4,r*1.9,0,v*2.7,8),f("#d8d8d8"),{tint:1,leg:(x,b)=>Math.max(0,(4.8-b)/4.8)*1.1*r*v}))}const p=ce(Te(t),le,5,"mammoths");for(let r=0;r<5;r++)H(p,r,0,-80,0,0,1,1,1,e[r],r*1.3,0,0,-1);E.add(p);const l=ce(g(pe(te(.75,0,0,0,1,1,1.5)),f("#ffffff"),{tint:1}),le,40,"roving");E.add(l),We={mesh:p,beads:l,wool:e[4]}}const Tt=5,Rt=ce(g(pe(new s.IcosahedronGeometry(.5,2).scale(1,.86,1).translate(0,.3,0)),f("#ffffff"),{tint:1,emis:-1}),le,1,"gathering-knot");H(Rt,0,0,-80,0,0,1,1,1,Ce.clone().multiplyScalar(.92),0,0,0,-1),E.add(Rt);const Go=-zt.z,Pa=Math.floor(he.hoopPhase),No=he.hoopClearPhase,Ba=230,Ta=260,mt=$(),W={pos:$(),yaw:0},Ra=$(),xe=$(),La=new s.Color,Re=e=>{e.instanceMatrix.needsUpdate=!0},_a=kt.mounds[0].center.clone().add($(0,12,0)),Ga=$(),ke=$(),ot=e=>-Pt.pointAt(e,Ga).z,qo=e=>{let t=0,a=1;for(let p=0;p<24;p++){const l=(t+a)/2;ot(l)<e?t=l:a=l}return t},Io=(e,t,a)=>{const p=(e+Co(e,.3*ct))/ct-.1+.07*Math.sin(a*.8)*(1-ee(ut,0,e)),l=Math.floor(p),r=p-l;return Math.min(l+(r<.914?.1+r*(.78/.914):.88+(r-.914)*(.22/.086)),he.hoopClearPhase)},Wo=e=>{const t=e-160;return e>1010?1065.4+(e-1010)*.72:215+.5*(t+Math.sqrt(t*t+1600))},Oo=e=>ee(216,262,e),Vo=(e,t)=>{const a=Wo(e);return a+5*Math.sin(t*.35)*Oo(a)},Xo=(e,t,a,p)=>{const l=_e((ot(t)-ut)/(Go-ut),0,1),r=912-l*120+e*32,v=A(r)+Ne*(90+4*Math.sin(e*2.2)),x=(e===4?Se(.98,.6,l):1.05-e*.03)*1.8;return p.set(v,T(v,-r)+.25*Math.sin(a*2.6+e*1.3)*x,-r),x},ao={pos:$(),yaw:0},no=(e,t)=>{const a=Io(ot(t),t,e),p=a-Math.floor(a),l=Math.sin(Math.PI*_e((p-.05)/.9,0,1));return he.road(a*ct-27,ke),ke.y+=17+31*l*l,ke},Zo=140,Na=(e,t)=>{const a=ot(t)+Zo;return ke.set(A(a),0,-a),ke.y=T(ke.x,ke.z)+8,ke},qa=(e,t)=>(et(Vo(ot(t),e)-24,ao),ke.copy(ao.pos).setY(ao.pos.y+3)),Ia=(e,t)=>{const a=Xo(4,t,e,ke);return ke.y+=9*a,ke.z+=20,ke},Wa=60,so=ot(0),ro=ot(1),Ze=(e,t,a,p)=>({at:e,from:t<=so?0:qo(t),to:a>=ro?1:qo(a),weight:p,fade:_e(Wa/Math.max(Math.min(a,ro)-Math.max(t,so),1),0,.5)}),Oa=300,Va=100,jo=-Qe[0].z;function Uo(e,t,a,p){ie.uTime.value=t,Pt.pointAt(p,mt);const l=-mt.z,r=Io(l,p,t),v=r*ct;he.setPhase(r),he.setGatherBack(Se(zo,wa,ee(Pa,No,r))),he.setUnravel(ko(l)),he.setFinalTaut(ee(he.hoopPhase,No,r)),he.update(e,t,a);{const o=he.gather;H(Rt,0,o.x,o.y-.6*Tt,o.z,r*2.1,2*Tt,2*Tt,2*Tt,null,0,0,0,-1),Re(Rt)}ie.uNeedleD.value=v,ie.uFrontD.value=l+150,ie.uSewD.value=l+Ba+Ta*ee(Ke,Go,l),ie.uLampP.value.set(mt.x,0,mt.z-24,66),a&&a.matrixWorld?oo.uCamP.value.setFromMatrixPosition(a.matrixWorld):oo.uCamP.value.copy(mt);const x=Oo(Wo(l)),b=Vo(l,t);ie.uTrainD.value=b+3.6,et(b,W);const d=W.pos.y+he.rippleAt(W.pos.x,W.pos.z)*0;ie.uTrainP.value.set(W.pos.x,d,W.pos.z),H(ue.loco,0,W.pos.x,d+.3+.05*Math.sin(t*13),W.pos.z,W.yaw,1,1,1,null,0,0,0,-1,0,.02*Math.sin(t*9)),H(ue.tab,0,W.pos.x+Math.sin(W.yaw)*.75,d+7,W.pos.z+Math.cos(W.yaw)*.75,W.yaw,1,1,1,null,0,0,0,-1,0,.55*Math.sin(t*3.3)*(.4+.6*x)+.12*Math.sin(t*7.7)),Re(ue.loco),Re(ue.tab);for(let o=0;o<ue.n;o++){const n=b-8.6-o*6.5;et(n,W),H(ue.reels,o,W.pos.x,W.pos.y+2.95+.14*Math.abs(Math.sin(t*11+o*2.1))*x,W.pos.z,W.yaw,1,1,1,null,o,0,0,-1,-n/2.5,.03*Math.sin(t*6+o))}Re(ue.reels),et(b,W),Ie.set(Ie.n0,W.pos.x,W.pos.z,4.5,3.2);for(let o=0;o<ue.n;o++)et(b-8.6-o*6.5,W),Ie.set(Ie.n0+1+o,W.pos.x,W.pos.z,4.6,2.5);Re(Ie.mesh);for(let o=0;o<16;o++){const n=(t*.5+o/16)%1,m=b+2.4-n*(6+44*x);et(m,W);const i=(.5+1.5*n)*(1-ee(.8,1,n))*ee(0,.06,n);H(ue.steam,o,W.pos.x+Ne*n*n*6+Math.sin(o*2.4)*n*2.5,W.pos.y+6.2+n*(5+6*x)+Math.abs(Math.sin(n*10+o*1.7))*2.6*(1-n),W.pos.z,o,i,i,i,o===0?de:null,o,0,0,-1)}Re(ue.steam),H(Bt,0,me.x+j*3.9,me.y,me.z+.6,j*Math.PI/2-.15*j,1,1,1,null,0,0,0,-1,0,t*N/6),Re(Bt);for(let o=0;o<pt.length;o++){const n=pt[o],m=(t+n.ph)/n.T%1,i=m/.44;if(i>=1){H(tt,o,n.x,-30,-n.d,0,.001,.001,.001,n.col,o,0,0,-1);continue}const c=(i-.5)*eo*n.dir,w=Math.sin(Math.PI*i)*to-.7,S=Math.cos(Math.PI*i)*to*Math.PI,M=eo;H(tt,o,n.x+c,T(n.x,-n.d)+w,-n.d,n.dir*Math.PI/2,n.s,n.s,n.s,n.col,o,0,0,-1,-Math.atan2(S,M),Math.sin(i*9)*.3)}if(Re(tt),tt.geometry.attributes.iCol.needsUpdate=!0,We){let o=null;for(let i=0;i<5;i++){const c=Xo(i,p,t,xe),w=xe.x,S=xe.y,M=-xe.z,k=Math.atan2(A(M-4)-A(M),4);H(We.mesh,i,w,S,-M,k,c,c,c,null,i*1.3,0,0,-1,.025*Math.sin(t*2.6+i),.02*Math.sin(t*1.3+i)),i===4&&(o=Ra.set(w,S+6.2*c,-M-5.6*c))}Re(We.mesh);const n=he.gather;xe.lerpVectors(o,n,.3),xe.y=o.y+34;const m=We.beads.geometry.attributes.iCol;for(let i=0;i<40;i++){const c=(i+t*1.4)%40/40,w=(1-c)*(1-c),S=2*c*(1-c),M=c*c,k=Se(1.5,1,c)*ee(0,.04,c)*(1-ee(.96,1,c)),z=2*((1-c)*(xe.x-o.x)+c*(n.x-xe.x)),Z=2*((1-c)*(xe.y-o.y)+c*(n.y-xe.y)),J=2*((1-c)*(xe.z-o.z)+c*(n.z-xe.z)),U=Math.hypot(z,Z,J)||1;H(We.beads,i,w*o.x+S*xe.x+M*n.x+Math.sin(c*20+t*2)*.6,w*o.y+S*xe.y+M*n.y,w*o.z+S*xe.z+M*n.z,Math.atan2(z,J),k,k,U/40/2.1,La.copy(We.wool).lerp(Ce,ee(.12,.55,c)),i,0,0,-1,-Math.asin(_e(Z/U,-1,1)))}Re(We.beads),m.needsUpdate=!0}}return Uo(0,0,null,0),{scene:E,path:Pt,duration:44,ride:"none",style:"none",camera:{fov:62,near:.3,nearThrough:.3,far:6500,lookAhead:30,sway:.6,bank:.2},pois:[Ze(no,so,_o,.3),Ze(_a,jo-Oa,jo-Va,.4),Ze(no,_o,-X.z,.5),Ze(qa,To,qe+20,.4),Ze(no,qe,$t,.3),...We?[Ze(Ia,qe,Ke,.4)]:[],Ze(Na,Ke-Zo,xo,.35),Ze(zt.clone(),Ke,ro,.55)],portal:{shape:"circle",radius:7,color:C.lamp?"#ffcf8a":"#fff0d0",glow:.9,revealDistance:320},post:{exposure:C.exposure*.84,bloom:{strength:.34,radius:.6,threshold:.92},grade:{saturation:C.sat,contrast:1.04,tint:C.tint,shadowTint:C.lamp?"#241a26":"#1a1626",vignette:.3,grain:.035,aberration:0}},update:Uo,dispose(){he.dispose()}}}};export{mn as default};
