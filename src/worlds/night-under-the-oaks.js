import*as e from"three";import{mergeGeometries as Ke,mergeVertices as It}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as Gt}from"../kit/core.js";import{makeSky as _t}from"../kit/sky.js";import{buildHero as Et,makeBodySink as Lt,NIGHT_LAW_GLSL as Ut,NIGHT_SKY_GLSL as Rt}from"../parts/night-under-the-oaks.js";const se=Math.PI*2,le=14,J=t=>new e.Color(t),R=(t,c,r)=>{const l=Math.min(1,Math.max(0,(r-t)/(c-t)));return l*l*(3-2*l)},Ve=Ut+`
uniform vec4 uTrees[${le}];
uniform float uTreeY[${le}];
uniform vec2 uWind;
uniform float uGain;      // night-side eye adaptation (the camera's own n lifts it)
float treeRad(vec4 t, float a, float i){
  return t.z * (1. + .07 * sin(a * 3. + i * 1.7) + .045 * sin(a * 5. + i * 2.9)) + .35 * sin(a * 2. + uTime * .79 + i * 2.);
}
float treeD(vec3 p, vec4 t, float i){
  vec2 q = p.xz - t.xy;
  float a = safeAng(q.yx);
  return length(vec3(q.x, p.y * t.z / max(t.w, .1), q.y)) - treeRad(t, a, i);
}
float nightAll(vec3 p){
  float n = nightN(p);
  for (int i = 0; i < ${le}; i++){
    vec4 t = uTrees[i];
    float w = .16 * t.z;
    n = max(n, step(1.5, t.z) * (1. - smoothstep(-w, w, treeD(p - vec3(0., uTreeY[i], 0.), t, float(i)))));   // a slot under 1.5 m is no night anywhere (as nightAt and the dome skin have it)
  }
  return n;
}
// oakLaw with n supplied (so n can come per vertex or from every tree)
vec3 lawN(vec3 alb, vec3 p, vec3 N, vec3 V, float ao, float n){
  // inside the Oak the midnight is lit from its sources (hero law); a lesser tree's night keeps its even starlight,
  // lifted once more by the eye's adaptation (the hero's uniforms already carry the gain once)
  float oakN = nightN(p);
  vec3 night = nightLit(alb, p, N, V, ao, oakN) * mix(uGain, 1., oakN);
  float nl = max(dot(N, uSunDir), 0.);
  vec3 noon = alb * (uSunCol * nl * ao + uSkyCol * (.55 + .45 * N.y) * ao);
  float rim = 1. - max(dot(N, V), 0.); rim = rim * rim * rim;
  float band = 4. * n * (1. - n);
  vec3 c = mix(noon, night, n);
  c += duskRamp(n) * band * (.3 + alb * .9 + .35 * rim);
  return c;
}
`,Te=`
float groundH(vec2 p){
  float r = length(p);
  float m = smoothstep(108., 300., r);
  float h = sin(p.x * .0105 + 1.3) * sin(p.y * .0088 + 2.1) * 2.6 + sin(p.x * .021 - p.y * .017 + .6) * 1.1 + sin(p.y * .033 + p.x * .009) * .5;
  return h * m + smoothstep(520., 900., r) * 26. * smoothstep(520., 900., r);
}`;function de(t,c){const r=Math.hypot(t,c),l=R(108,300,r),u=R(520,900,r);return(Math.sin(t*.0105+1.3)*Math.sin(c*.0088+2.1)*2.6+Math.sin(t*.021-c*.017+.6)*1.1+Math.sin(c*.033+t*.009)*.5)*l+u*u*26}const Kt={june:{name:"Where Night Spends the Day",grassA:"#3F6A2A",grassB:"#86B648",flower:"#F2D95C",seed:"#D9CF8C",accent:"#C8553F",leafA:"#2F5A26",leafB:"#7DB34A",hanger:"#2C4A2E",zenith:"#4F9BE2",horizon:"#BFE3F5",fog:"#BFE3F5",flowerAmt:1,mist:0,snow:0,leafDrop:0,pal:["#F2D95C","#7DB34A","#BFE3F5","#0B1033","#E9ECFF","#F08A4B","#2C4A2E"]},september:{name:"Where Night Spends the Day: September",grassA:"#6E5A2A",grassB:"#C9A650",flower:"#E8C56A",seed:"#E9D9A0",accent:"#B5532C",leafA:"#7A3B1C",leafB:"#C8782E",hanger:"#5A4226",zenith:"#5E9AD4",horizon:"#E4DCC4",fog:"#E0D9C6",flowerAmt:.25,mist:1,snow:0,leafDrop:1,pal:["#E8C56A","#B98A3A","#D9E2E8","#0B1033","#E9ECFF","#F08A4B","#5A4226"]},frost:{name:"Where Night Spends the Day: Hard Frost",grassA:"#8FA6A0",grassB:"#DDE9EC",flower:"#F4F8FF",seed:"#FFFFFF",accent:"#B9C9D9",leafA:"#5A5048",leafB:"#9A8E82",hanger:"#6E7C84",zenith:"#6FA6DC",horizon:"#E6EEF5",fog:"#DCE7F0",flowerAmt:.12,mist:.5,snow:1,leafDrop:0,pal:["#EEF3F8","#B9CBC6","#D5E4F0","#0B1033","#E9ECFF","#F08A4B","#6E7C84"]}},Ht={sunset:["#F08A4B","#E8668A","#6A4BC0"],aurora:["#D8E05A","#4FD6A0","#1E8FA8"],scarlet:["#FF3B2A","#C2264E","#4E2A9E"]};function Yt(t){const c=t.rng.fork?t.rng.fork("look"):t.rng,r=c(),l=c(),u=c(),w=c(),b=c(),y=t.vary?.hour??"any";let o=r<.12||r>=.56&&r<.8?"september":r<.56?"june":"frost";y==="golden"&&(o="september");let d=l>=.6?"crescent":l>=.3?"full":"none";y==="night"&&(d="none");const n=u<.55?"sunset":u<.8?"aurora":"scarlet";return{season:o,moon:d,ring:n,S:Kt[o],trees:9+Math.floor(w*5),blossom:b<.34&&o==="june",rare:!!t.vary?.rare,density:t.vary?.density??1,detail:t.quality?.detail??1}}const tt=`
#include <common>
#include <fog_pars_vertex>
varying vec3 vP; varying vec3 vN;
`,yt=`
#include <common>
#include <fog_pars_fragment>
varying vec3 vP; varying vec3 vN;
`+Ve;function he(t,{vert:c,frag:r,uniforms:l={},...u}){return new e.ShaderMaterial({uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),...t.U,...l},vertexShader:tt+Ve+c,fragmentShader:yt+r,fog:!0,...u})}const at=`
uniform vec3 uGrassA, uGrassB, uFlower, uSeed, uAccent; uniform float uFlowerAmt; uniform vec2 uPicXZ;
float gustAt(vec2 p){ return vn2(p * .028 + vec2(uTime * .21, uTime * .08)) * .62 + vn2(p * .11 + vec2(uTime * .47, uTime * .13)) * .38; }
float driftAt(vec2 p){ return smoothstep(.36, .62, fbm2(p * .045 + 9.)); }
`;function qt(t){const c=t.look.S,r=new e.PlaneGeometry(2400,2400,110,110);r.rotateX(-Math.PI/2);const l=he(t,{uniforms:{uHanger:{value:J(c.hanger)},uFrost:{value:c.snow},uPath:t.uPath},vert:Te+`
      void main(){ vec3 p = position;
        p.y = groundH(p.xz) - .45 * (1. - smoothstep(98., 106., length(p.xz)));
        vP = p; vN = vec3(0., 1., 0.);
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,frag:at+Te+ot+`
      uniform vec3 uHanger; uniform float uFrost;
      void main(){
        vec2 p = vP.xz; float r = length(p);
        float dist = length(uCamL - vP);
        float near = smoothstep(110., 18., dist);
        float n = nightAll(vP);
        float gust = gustAt(p);
        float patchy = fbm2(p * .06 + 3.);
        float blades = vn2(p * vec2(9., 3.1) + gust * 1.5) * .4 + vn2(p * 23.) * .35 + vn2(p * 61.) * .25;
        blades = mix(.5, blades, near);
        vec3 alb = mix(uGrassA, uGrassB, .22 + .33 * patchy + .45 * blades);
        alb *= (.66 + .5 * gust) * mix(.8 + .4 * fbm2(p * .019 + 60.), 1., near);   // gust waves cross the meadow, seen to the horizon
        alb = mix(alb, uSeed * .62, .3 * vn2(p * .9 + 4.) + .12);  // pale seed heads
        alb = mix(alb, uAccent * .55, smoothstep(.55, .8, fbm2(p * .09 + 31.)) * .3);   // sorrel haze
        float drift = driftAt(p);
        vec2 cell = floor(p * 3.4), cf = fract(p * 3.4) - .5;
        float fh = h21(cell);
        float dot1 = smoothstep(.24, .1, length(cf + (vec2(h21(cell + 3.), h21(cell + 7.)) - .5) * .5));
        float mown = (1. - smoothstep(.6, 1.25, pathD(p))) * smoothstep(96., 110., r);
        alb = mix(alb, mix(uGrassA, uGrassB, .8) * (.8 + .35 * blades), mown * .9);
        float cover = (.06 + .62 * drift) * uFlowerAmt * (1. - mown);
        float butter = mix(cover * .85, step(1. - cover, fh) * dot1, near);
        alb = mix(alb, uFlower * (1. - .3 * n), clamp(butter + cover * .3, 0., 1.) * (1. - .55 * n));
        float daisy = step(.93, h21(cell + 21.)) * dot1 * near;
        alb = mix(alb, vec3(.86, .88, .84), daisy);
        alb = mix(alb, vec3(.84, .9, .95), uFrost * (.35 + .4 * blades));
        // the far hanger
        float hang = smoothstep(560., 760., r + (fbm2(p * .012) - .5) * 160.);
        alb = mix(alb, uHanger * (.55 + .7 * vn2(p * .05)), hang);
        float e = 6.;
        vec3 N = normalize(vec3(groundH(p - vec2(e, 0.)) - groundH(p + vec2(e, 0.)), 2. * e, groundH(p - vec2(0., e)) - groundH(p + vec2(0., e))));
        N = normalize(N + vec3((blades - .5) * .5, 0., (gust - .5) * .5) * near);
        vec3 V = normalize(uCamL - vP);
        vec3 c = lawN(alb, vP, N, V, 1., n);
        c += vec3(.75, .8, 1.) * daisy * n * .22 * uGain * (.6 + .4 * sin(uTime * 1.7 + fh * 40.));   // daisies glimmer in the night
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`});l.uniforms.uGrassA=t.MU.uGrassA,l.uniforms.uGrassB=t.MU.uGrassB,l.uniforms.uFlower=t.MU.uFlower,l.uniforms.uSeed=t.MU.uSeed,l.uniforms.uAccent=t.MU.uAccent,l.uniforms.uFlowerAmt=t.MU.uFlowerAmt,l.uniforms.uPicXZ=t.MU.uPicXZ;const u=new e.Mesh(r,l);return u.frustumCulled=!1,u}function Xt(t){const r=[],l=[],u=t.rng.fork("hanger");for(let o=0;o<=220;o++){const d=o/220*se,n=905+Math.sin(d*3+1)*40+Math.sin(d*7)*18,i=30+22*t.noise.fbm2(Math.cos(d)*9,Math.sin(d)*9,3)+u.range(-3,3)+9*Math.abs(Math.sin(o*1.3)),p=de(Math.sin(d)*n,Math.cos(d)*n)-8;if(r.push(Math.sin(d)*n,p,Math.cos(d)*n,Math.sin(d)*(n+30),p+8+i,Math.cos(d)*(n+30)),o<220){const m=o*2;l.push(m,m+2,m+1,m+1,m+2,m+3)}}const w=new e.BufferGeometry;w.setAttribute("position",new e.Float32BufferAttribute(r,3)),w.setIndex(l);const b=he(t,{uniforms:{uHanger:{value:J(t.look.S.hanger)}},side:e.DoubleSide,vert:`void main(){ vP = position; vN = vec3(0., 1., 0.);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
    }`,frag:`uniform vec3 uHanger;
      void main(){
        float a = safeAng(vP.zx) * 140.;
        float crowns = vn2(vec2(a, vP.y * .09)) * .6 + vn2(vec2(a * 2.7, vP.y * .23 + 4.)) * .4;
        vec3 alb = uHanger * (.5 + .9 * crowns) * (.6 + .012 * vP.y);
        vec3 c = alb * (uSunCol * .55 + uSkyCol * 1.2);
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`}),y=new e.Mesh(w,b);return y.frustumCulled=!1,y}const He=18,ot=`
uniform vec2 uPath[${He}];
float pathD(vec2 p){
  float d = 1e4;
  for (int i = 0; i < ${He-1}; i++){
    vec2 a = uPath[i], ab = uPath[i + 1] - a;
    float t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-3), 0., 1.);
    d = min(d, length(p - a - ab * t));
  }
  return d;
}`;function xt(t,c,r,l,u,w,b=3){const y=t.rng.fork("tufts"+r),o=new e.PlaneGeometry(1,1,1,2);o.translate(0,.5,0);const d=Ke(b===3?[o,o.clone().rotateY(se/6),o.clone().rotateY(se/3)]:[o,o.clone().rotateY(se/4)]),n=new e.InstancedBufferGeometry;n.index=d.index,n.attributes.position=d.attributes.position,n.attributes.uv=d.attributes.uv;const i=new Float32Array(c*4);for(let A=0;A<c;A++)i[A*4]=y()*r,i[A*4+1]=y()*r,i[A*4+2]=y(),i[A*4+3]=y();n.setAttribute("aI",new e.InstancedBufferAttribute(i,4)),n.instanceCount=c;const p=he(t,{uniforms:{...t.MU,uWin:{value:r},uCen:t.cen[l],uSize:{value:new e.Vector2(u,w)},uPond:t.hero.uniforms.uPond,uPath:t.uPath},side:e.DoubleSide,vert:at+Te+ot+`
      attribute vec4 aI; uniform float uWin; uniform vec2 uCen, uSize; uniform vec4 uPond;
      varying vec2 vUv; varying vec3 vC; varying vec3 vCf; varying float vK; varying float vFl;
      void main(){
        vec2 w = mod(aI.xy - uCen + uWin * .5, uWin) - uWin * .5;
        vec2 b = uCen + w;
        float edge = 1. - smoothstep(.36, .5, length(w) / uWin);
        float gy = groundH(b);
        vec3 bp = vec3(b.x, gy + .3, b.y);
        float n = nightAll(bp), oakIn = nightN(bp);
        float r = length(b);
        float keep = edge * smoothstep(15., 17.5, length(b - uPond.xy)) * smoothstep(6., 10., r);
        keep *= smoothstep(1.5, 2.5, length(b - uPicXZ));                // the picnic's trampled patch
        float mown = smoothstep(.5, 1.3, pathD(b));
        float h = uSize.y * (.6 + .6 * aI.z) * mix(1., .6, oakIn) * mix(.22, 1., mown) * keep;
        float ca = cos(aI.w * 6.2832), sa = sin(aI.w * 6.2832);
        float wd = uSize.x * clamp(h / uSize.y * 1.3, .4, 1.) * mix(1., 1.45, oakIn);
        vec3 lp = vec3(position.x * wd, position.y * h, position.z * wd);
        lp.xz = vec2(ca * lp.x - sa * lp.z, sa * lp.x + ca * lp.z);
        float gust = gustAt(b);
        float bend = (gust - .35) * .75 + .06 * sin(uTime * 3.1 + aI.z * 40. + b.x);
        vec3 p = vec3(b.x, gy + .1, b.y) + lp;
        p.xz += uWind * bend * position.y * position.y * h;
        p.y -= abs(bend) * .25 * position.y * position.y * h;
        vP = p; vUv = uv; vK = aI.z;
        vec3 alb = mix(uGrassA, uGrassB, .25 + .5 * uv.y + .25 * aI.w) * (.74 + .5 * gust);
        alb = mix(alb, vec3(.5, .46, .16), .4 * aI.w * aI.z);
        alb = mix(alb, uSeed * .8, smoothstep(.6, 1., uv.y) * step(.45, aI.z) * mown);
        // under the Oak the sward is blue-green in every season (September's straw would go grey-beige by moonlight)
        alb = mix(alb, mix(alb * vec3(.7, 1.3, 1.12), dot(alb, vec3(.3, .5, .2)) * vec3(.5, 1.12, .92) * 1.3, .72), oakIn);
        vec3 N = normalize(vec3(uWind.x * bend, 1., uWind.y * bend) + uSunDir * .35);
        vN = N;
        vC = lawN(alb, p, N, normalize(uCamL - p), mix(mix(.3 + .7 * uv.y, .8 + .2 * uv.y, step(1., uSize.x)), 1., n * .5), n) * (1. + .5 * n * uv.y);
        vC *= mix(vec3(1.), vec3(.84, 1.02, 1.1), oakIn);
        // under the Oak the blades are rimmed ivory-blue toward the moon, brightest in its pool on the lawn
        float dmn = length(uMoon - p), mpool = smoothstep(27., 6., dmn);
        vC += oakIn * uMoonCol * vec3(.8, .93, 1.12) * uv.y * uv.y * (.02 + .08 * mpool + .05 / (1. + dmn * dmn / 900.)) * (.6 + .8 * aI.z);
        // the sward keeps its deep blue-green to the last (no grey as the eye adapts toward the arch), and where the
        // arch's fan of day lies on it each blade is sunlit grass again, lit from behind, with a bright gold tip
        vec3 Le; float fk = clamp(exitFan(p, Le) * .55, 0., 1.) * oakIn;
        float l0 = dot(vC, vec3(.3, .5, .2)); vC = mix(vC, mix(vec3(l0), vC, 1.6) * vec3(.74, 1.02, .9) / (1. + 1.4 * l0), oakIn * (1. - fk));
        vec3 sunAlb = mix(mix(uGrassA, uGrassB, .3 + .5 * uv.y) * vec3(1., 1.05, .7), vec3(.5, .4, .15), .45);
        vC = mix(vC, vC * .35 + uSunCol * vec3(1.12, .72, .26) * sunAlb * (.4 + 1.5 * uv.y * uv.y), fk);
        vCf = lawN(uFlower, p, N, normalize(uCamL - p), 1., n);
        vFl = (.12 + .8 * driftAt(b)) * uFlowerAmt * mown * (1. - oakIn);
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
        if (h < .02) gl_Position = vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,frag:`
      varying vec2 vUv; varying vec3 vC; varying vec3 vCf; varying float vK; varying float vFl;
      void main(){
        // five tapering blades per card, some of them carrying a buttercup
        float x = vUv.x * 5. + vK * 3.;
        float bl = abs(fract(x) - .5) * 2.;
        float len = .55 + .45 * h11(floor(x) + vK * 17.);
        float head = step(h11(floor(x) + vK * 5. + 5.), vFl) * step(length(vec2((fract(x) - .5) * .2, vUv.y - len + .07)), .062);
        if (head < .5 && (vUv.y > len || bl > (1. - vUv.y / len) * .9 + .04)) discard;
        vec3 c = mix(vC * (.75 + .5 * h11(floor(x) + 3.)), vCf * (.85 + .3 * h11(floor(x) + 9.)), head);
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`}),m=new e.Mesh(n,p);return m.frustumCulled=!1,m}function jt(t,c,r,l){const u=t.rng.fork("flowers"),w=new e.InstancedBufferGeometry,b=new e.PlaneGeometry(1,1);w.index=b.index,w.attributes.position=b.attributes.position,w.attributes.uv=b.attributes.uv;const y=new Float32Array(c*4);for(let n=0;n<c;n++)y[n*4]=u()*r,y[n*4+1]=u()*r,y[n*4+2]=u(),y[n*4+3]=u();w.setAttribute("aI",new e.InstancedBufferAttribute(y,4)),w.instanceCount=c;const o=he(t,{uniforms:{...t.MU,uWin:{value:r},uCen:t.cen[l],uPond:t.hero.uniforms.uPond,uPath:t.uPath},side:e.DoubleSide,vert:at+Te+ot+`
      attribute vec4 aI; uniform float uWin; uniform vec2 uCen; uniform vec4 uPond;
      varying vec2 vUv; varying vec3 vC; varying vec3 vE; varying float vKind;
      void main(){
        vec2 w = mod(aI.xy - uCen + uWin * .5, uWin) - uWin * .5;
        vec2 b = uCen + w;
        float edge = 1. - smoothstep(.36, .5, length(w) / uWin);
        float gy = groundH(b);
        vec3 bp = vec3(b.x, gy + .5, b.y);
        float n = nightAll(bp), oakIn = nightN(bp);
        float kind = aI.w < .72 ? 0. : (aI.w < .9 ? 1. : 2.);         // buttercup, daisy, sorrel
        float drift = driftAt(b);
        float want = kind < .5 ? (.3 + .7 * drift) * uFlowerAmt : (kind < 1.5 ? .22 + .2 * uFlowerAmt : .5);
        float driftN = smoothstep(.36, .68, fbm2(b * .085 + 21.));
        want = mix(want, kind > 1.5 ? .1 : (kind > .5 ? .1 + .5 * driftN : .02 + .42 * driftN * driftN), oakIn);
        float keep = edge * step(aI.z, want * 1.25) * smoothstep(15.5, 18., length(b - uPond.xy)) * smoothstep(7., 11., length(b));
        keep *= smoothstep(.6, 1.4, pathD(b)) * smoothstep(1.5, 2.4, length(b - uPicXZ));
        float gust = gustAt(b);
        float hgt = (.55 + .4 * h11(aI.z * 91.)) * mix(1., .5, oakIn);
        float sz = (kind < .5 ? .15 : (kind < 1.5 ? .2 : .13)) * (.8 + .5 * h11(aI.w * 53.)) * keep;
        sz *= kind < .5 ? mix(1. - .45 * n, .95, oakIn) : 1.;                       // buttercups close for the night; campion opens
        vec3 c0 = vec3(b.x, gy + .1 + hgt, b.y);
        c0.xz += uWind * ((gust - .35) * .5 + .05 * sin(uTime * 3.3 + aI.z * 50.)) * hgt;
        vec4 mv = modelViewMatrix * vec4(c0, 1.);
        vec2 q = position.xy * sz; if (kind > 1.5) q.y *= 2.6;
        mv.xy += q;
        vP = c0; vUv = uv; vKind = kind; vN = vec3(0., 1., 0.);
        vec3 alb = kind < .5 ? mix(uFlower, vec3(.7, .73, .74), oakIn) : (kind < 1.5 ? vec3(.82, .84, .8) * (1. - .2 * oakIn) : uAccent * .8);
        vC = lawN(alb, c0, normalize(vec3(0., 1., 0.) + uSunDir * .5), normalize(uCamL - c0), 1., n);
        vE = vec3(.7, .78, 1.) * uGain * (.6 + .4 * sin(uTime * 1.7 + aI.z * 40.)) * (kind < .5 ? oakIn * .16 : (kind < 1.5 ? n * .2 : 0.));
        vec4 mvPosition = mv; gl_Position = projectionMatrix * mv;
        if (sz < .01) gl_Position = vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,frag:`
      varying vec2 vUv; varying vec3 vC; varying vec3 vE; varying float vKind;
      void main(){
        vec2 d = vUv - .5; float r = length(d) * 2.;
        float a = safeAng(d);
        vec3 c = vC;
        if (vKind < .5) { if (r > .72 + .28 * cos(a * 5.)) discard; c *= .8 + .35 * r; c += vE; }
        else if (vKind < 1.5) { if (r > .6 + .4 * abs(cos(a * 6.))) discard; c = mix(vC * vec3(1., .8, .25), vC, smoothstep(.22, .3, r)) + vE; }
        else { if (abs(d.x) > .16 * (1. - vUv.y) + .04 || h21(floor(vUv * vec2(3., 14.))) < .3) discard; }
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`}),d=new e.Mesh(w,o);return d.frustumCulled=!1,d}const wt={hawthorn:{h:8,R:10,H:7,trunk:.32,blobs:9,spread:4.2,blob:[1.5,2.6]},maple:{h:14,R:13,H:10,trunk:.5,blobs:13,spread:6,blob:[2.2,3.8]},ash:{h:22,R:16,H:13,trunk:.7,blobs:17,spread:7.5,blob:[2.6,4.6]}};function Ot(t,c,r){const l=t.rng.fork("trees"),u=[],w=(n,i,p,m=l.range(.9,1.12))=>u.push({x:n,z:i,kind:p,...wt[p],y:de(n,i),s:m}),b=(n,i)=>{const p=c.posAtDist(n),m=c.tangentAtDist(n);return[p.x+-m.z*i,p.z+m.x*i]};w(...b(t.dThorn,5.2),"hawthorn",1.9),w(...b(212,46),"maple"),w(...b(122,74),"ash");const y=c.posAtDist(0),o=c.tangentAtDist(0);let d=0;for(;u.length<Math.min(t.look.trees,le-2)&&d++<500;){const n=l.range(-40,c.length*r+40),i=(l()<.5?-1:1)*l.range(34,240),[p,m]=b(Math.max(0,n),i),A=l()<.55?"hawthorn":"maple",V=wt[A];if(!(Math.hypot(p,m)<150+V.R)){{const I=p-y.x,h=m-y.z,v=Math.hypot(I,h);if(v<520&&(I*o.x+h*o.z)/v>.64)continue}c.nearestXZ(p,m).dist<V.R+16||u.some(I=>Math.hypot(I.x-p,I.z-m)<I.R+V.R+14)||w(p,m,A)}}return u.slice(0,le-2)}async function Zt(t,c){const r=t.rng.fork("treegeo"),l=[],u=(h,v,_)=>{const K=h.attributes.position.count,L=new Float32Array(K*2);for(let H=0;H<K;H++)L[H*2]=v,L[H*2+1]=_;h.setAttribute("aK",new e.BufferAttribute(L,2)),h.deleteAttribute("uv"),l.push(h.index?h.toNonIndexed():h)},w=new e.Vector3,b=new e.Vector3,y=new e.Vector3,o=new e.Vector3,d=new e.Vector3(0,1,0),n=new e.Vector3(1,0,0),i=(h,v,_,K,L,H=0)=>{w.subVectors(v,h);const f=w.length();w.normalize(),b.crossVectors(w,Math.abs(w.y)>.9?n:d).normalize(),y.crossVectors(w,b);const x=9,F=Math.max(4,Math.round(f/.55)),C=[],T=[],P=h.x*1.7+h.z*2.3+h.y;for(let O=0;O<=F;O++){const B=O/F,Z=Math.sin(B*Math.PI)*f*.07,ee=(_+(K-_)*B)*(1+H*Math.exp(-B*7))*(1+.13*Math.sin(B*9+P));o.copy(h).addScaledVector(w,B*f).addScaledVector(b,Z*Math.sin(P)+.35*_*Math.sin(B*7+P*2)).addScaledVector(y,Z*Math.cos(P)+.35*_*Math.sin(B*5.3+P));for(let ae=0;ae<x;ae++){const U=ae/x*se,W=U+B*2.2+P,me=ee*(1+.2*Math.sin(W*3)+.09*Math.sin(W*5+1.3)+H*.5*Math.exp(-B*9)*Math.pow(Math.abs(Math.sin(U*2.5+P)),3));C.push(o.x+(b.x*Math.cos(U)+y.x*Math.sin(U))*me,o.y+(b.y*Math.cos(U)+y.y*Math.sin(U))*me,o.z+(b.z*Math.cos(U)+y.z*Math.sin(U))*me)}if(O<F)for(let ae=0;ae<x;ae++){const U=O*x+ae,W=O*x+(ae+1)%x;T.push(U,U+x,W,W,U+x,W+x)}}const N=new e.BufferGeometry;N.setAttribute("position",new e.Float32BufferAttribute(C,3)),N.setIndex(T),N.computeVertexNormals(),u(N,0,L)};t.blobs=[];const p=[2,1].map(h=>It(new e.IcosahedronGeometry(1,h).deleteAttribute("normal").deleteAttribute("uv")));for(let h=0;h<t.trees.length;h++){const v=t.trees[h];await c.yield();const _=new e.Vector3(v.x,v.y-.3,v.z),K=v.h*v.s,L=new e.Vector3(r.range(-.6,.6),0,r.range(-.6,.6)),H=_.clone().add(new e.Vector3(L.x,K*.34,L.z)),f=v.trunk*Math.max(1,v.s);i(_,H,f*1.5,f*.85,h,.9),await c.yield();const x=v.kind==="hawthorn"?4:5,F=[];for(let C=0;C<x;C++){const T=C/x*se+r.range(-.4,.4),P=v.spread*Math.max(1,v.s)*r.range(.55,.95),N=H.clone().add(new e.Vector3(Math.sin(T)*P,K*r.range(.22,.5),Math.cos(T)*P)),O=H.clone().lerp(N,.5).add(new e.Vector3(0,K*.06,0));i(H.clone().setY(H.y-f*.5),O,f*.66,f*.44,h),i(O,N,f*.44,f*.15,h),F.push(N)}await c.yield();for(let C=0;C<v.blobs;C++){C===5&&await c.yield();const T=F[C%F.length],P=r.range(v.blob[0],v.blob[1])*v.s,N=T.clone().add(new e.Vector3(r.range(-1,1),r.range(-.3,1.1),r.range(-1,1)).multiplyScalar(P*.75));C>=F.length&&N.lerp(new e.Vector3(v.x,_.y+K*r.range(.62,.92),v.z),r.range(.2,.7)),N.y=Math.max(N.y,v.y+2.2+P*.72),t.blobs.push({c:N.clone(),r:P,ti:h,haw:v.kind==="hawthorn"});const O=p[h<3?0:1].clone(),B=O.attributes.position,Z=r()*9;for(let ee=0;ee<B.count;ee++){const ae=B.getX(ee),U=B.getY(ee),W=B.getZ(ee),me=1+.2*Math.sin(ae*4.1+Z)*Math.sin(U*3.7+Z*2)*Math.sin(W*4.5-Z)+.1*Math.sin(ae*9+W*7+Z);B.setXYZ(ee,N.x+ae*P*me*.86,N.y+U*P*.74*me*(U<0?.62:1)*.86,N.z+W*P*me*.86)}O.computeVertexNormals(),u(O,v.kind==="hawthorn"?2:1,h)}}await c.yield();const m=Ke(l);l.forEach(h=>h.dispose()),await c.yield();const A=t.look.S,V=he(t,{uniforms:{uLeafA:{value:J(A.leafA)},uLeafB:{value:J(A.leafB)},uBlossom:{value:t.look.blossom?1:0},uBare:{value:A.snow}},side:e.DoubleSide,vert:`
      attribute vec2 aK; varying vec2 vK;
      void main(){ vec3 p = position; vK = aK;
        float sway = sin(uTime * 1.3 + p.x * .3 + p.z * .2) * .5 + sin(uTime * 2.9 + p.z * .9) * .2;
        p.xz += uWind * sway * (aK.x > .5 ? .16 : .03) * smoothstep(1., 9., p.y);
        vP = p; vN = normal;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,frag:`
      uniform vec3 uLeafA, uLeafB; uniform float uBlossom, uBare; varying vec2 vK;
      void main(){
        vec3 N = normalize(vN), V = normalize(uCamL - vP);
        float ndv = abs(dot(N, V)), back = gl_FrontFacing ? 1. : .45;
        vec3 alb; float ao = 1., rid = 0.;
        if (vK.x > .5) {
          float f = vn3(vP * 2.3 + uTime * .12) * .55 + vn3(vP * 6.5) * .45;
          if (f < .3 + smoothstep(.6, .0, ndv) * .5 + uBare * .25) discard;      // ragged, leafy edges; a frosted tree is half bare
          alb = mix(uLeafA, uLeafB, smoothstep(.25, .8, f) * (.5 + .5 * N.y));
          alb = mix(alb, vec3(.86, .8, .82), uBlossom * step(1.5, vK.x) * step(.5, vn3(vP * 9.)) * .85);
          alb = mix(alb, vec3(.8, .86, .9), uBare * .6);
          ao = (.4 + .6 * smoothstep(.3, .8, f)) * back;
          N = normalize(N + (vec3(vn3(vP * 5.), vn3(vP * 5. + 7.), vn3(vP * 5. + 13.)) - .5) * .9);
        } else {
          // ridged bark: plates between deep cracks, twisting round the limb; the ridges catch the light
          vec4 tr = uTrees[int(vK.y + .5)];
          vec2 ob = vP.xz - tr.xy; float tw = vP.y * .16;
          vec3 bq3 = vec3(ob.x * cos(tw) - ob.y * sin(tw), vP.y * .17, ob.x * sin(tw) + ob.y * cos(tw)) * 3.4;
          vec2 bq = bq3.xz + bq3.y;
          float r1 = abs(vn3(bq3) - .5) * 2., r2 = abs(vn3(bq3 * vec3(2.7, 4.5, 2.7) + 7.) - .5) * 2.;
          rid = smoothstep(.04, .34, r1) * (.55 + .45 * smoothstep(.0, .3, r2));
          vec3 dpx = dFdx(vP), dpy = dFdy(vP); float hx = dFdx(rid), hy = dFdy(rid);
          vec3 gr = (dpx * hx + dpy * hy) / max(dot(dpx, dpx) + dot(dpy, dpy), 1e-6);
          N = normalize(N - clamp(gr * .12, -1.1, 1.1));
          alb = mix(vec3(.014, .012, .012), mix(vec3(.085, .07, .056), vec3(.15, .13, .105), vn2(bq * 2.)), rid);
          alb = mix(alb, vec3(.16, .23, .1), smoothstep(.5, .85, vn2(bq * .9 + 3.)) * smoothstep(.1, .7, N.y + .35) * .6);   // moss
          ao = .25 + .75 * rid;
        }
        float nn = nightAll(vP);
        vec3 c = lawN(alb, vP, N, V, ao, nn);
        if (vK.x > .5) c += uMoonCol * alb * nn * uGain * 1.6 * smoothstep(.62, .9, vn3(vP * 7. + 3.)) * back;   // leaves catching starlight
        else {
          // in its night the wood is lit by its own stars from above and by the dusk hem from outside
          vec4 tr = uTrees[int(vK.y + .5)]; vec2 ow = vP.xz - tr.xy; ow = ow / max(length(ow), 1e-3);
          float hgt = clamp((vP.y - uTreeY[int(vK.y + .5)]) / max(tr.w, 1.), 0., 1.);
          float rimv = 1. - max(dot(N, V), 0.);
          c += nn * uGain * (vec3(.4, .47, .78) * (alb * .55 + .004) * (.35 + .65 * max(N.y * .6 + .4, 0.)) + vec3(.5, .62, 1.) * rid * rimv * rimv * .05);
          float out1 = max(dot(N.xz, ow), 0.);
          c += nn * uGain * uRampA * (alb * 1.3 + .02) * out1 * out1 * (1. - hgt) * (1. - hgt) * .8;
        }
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`}),I=new e.Mesh(m,V);return I.frustumCulled=!1,I}async function Wt(t,c){const r=t.rng.fork("treeleaf"),l=[],u=[],w=[],b=[],y=new e.Vector3,o=new e.Vector3,d=new e.Vector3,n=new e.Vector3,i=new e.Vector3,p=new e.Vector3(0,1,0);let m=0;for(const v of t.blobs){m>700&&(m=0,await c.yield());const _=Math.round((v.haw?44:34)*t.look.detail*(v.ti===0?3:1));m+=_;for(let K=0;K<_;K++){const L=r.range(-.75,1),H=r()*se,f=Math.sqrt(Math.max(0,1-L*L));y.set(Math.cos(H)*f,L,Math.sin(H)*f);const x=v.r*r.range(.7,1.02);i.set(v.c.x+y.x*x,v.c.y+y.y*x*.74*(L<0?.62:1),v.c.z+y.z*x),o.set(y.x+r.range(-.7,.7),y.y+r.range(-.7,.7),y.z+r.range(-.7,.7)).normalize(),d.crossVectors(o,p),d.lengthSq()<1e-4&&d.set(1,0,0),d.normalize(),n.crossVectors(d,o);const F=r()*se,C=Math.cos(F),T=Math.sin(F),P=(v.haw?.62:.85)*r.range(.75,1.3)*(v.ti===0?1.5:1),N=r();for(const[O,B]of[[0,0],[1,0],[1,1],[0,0],[1,1],[0,1]]){const Z=(O-.5)*2*P,ee=(B-.5)*2*P,ae=Z*C-ee*T,U=Z*T+ee*C;l.push(i.x+d.x*ae+n.x*U,i.y+d.y*ae+n.y*U,i.z+d.z*ae+n.z*U),u.push(O,B),w.push(o.x,o.y,o.z),b.push(N,v.ti,v.haw?1:0)}}}await c.yield();const A=new e.BufferGeometry;A.setAttribute("position",new e.Float32BufferAttribute(l,3)),A.setAttribute("uv",new e.Float32BufferAttribute(u,2)),A.setAttribute("normal",new e.Float32BufferAttribute(w,3)),A.setAttribute("aK",new e.Float32BufferAttribute(b,3)),await c.yield();const V=t.look.S,I=he(t,{uniforms:{uLeafA:{value:J(V.leafA)},uLeafB:{value:J(V.leafB)},uBlossom:{value:t.look.blossom?1:0},uBare:{value:V.snow}},side:e.DoubleSide,vert:`
      attribute vec3 aK; varying vec3 vK; varying vec2 vUv;
      void main(){ vec3 p = position; vK = aK; vUv = uv;
        float sway = sin(uTime * 1.3 + p.x * .3 + p.z * .2) * .5 + sin(uTime * 2.9 + p.z * .9 + aK.x * 20.) * .3;
        p.xz += uWind * sway * .2 * smoothstep(1., 9., p.y); p.y += .05 * sin(uTime * 2.3 + aK.x * 40.);
        vP = p; vN = normal;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,frag:`
      uniform vec3 uLeafA, uLeafB; uniform float uBlossom, uBare; varying vec3 vK; varying vec2 vUv;
      void main(){
        vec2 g = vUv * vec2(3., 4.), id = floor(g), f = fract(g) - .5;
        float h = h21(id + vK.x * 37.), h2 = h21(id + 5. + vK.x * 11.);
        float ca = cos(h * 6.2832), sa = sin(h * 6.2832);
        vec2 q = vec2(ca * f.x - sa * f.y, sa * f.x + ca * f.y);
        float dd = q.x * q.x / .19 + q.y * q.y / .045;
        if (dd > 1. || h2 < .2 + uBare * .45) discard;
        vec3 N = normalize(vN), V = normalize(uCamL - vP); if (dot(N, V) < 0.) N = -N;
        N = normalize(N + vec3(h - .5, .3, h2 - .5) * .7);
        vec3 alb = mix(uLeafA, uLeafB, .25 + .75 * h2) * (.8 + .4 * (1. - dd)) * (1. - .35 * smoothstep(.03, .0, abs(q.y)));
        alb = mix(alb, vec3(.9, .84, .86), uBlossom * vK.z * step(.62, h));
        alb = mix(alb, vec3(.8, .86, .9), uBare * .6);
        float nn = nightAll(vP);
        vec3 c = lawN(alb, vP, N, V, .55 + .45 * h2, nn);
        c += (1. - nn) * alb * uSunCol * .45 * max(dot(-N, uSunDir), 0.);                 // sun through the leaf
        c += nn * uGain * (alb * vec3(.4, .55, 1.1) * .9 + uMoonCol * alb * 1.2 * step(.8, h));   // starlit, a few leaves glinting
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`}),h=new e.Mesh(A,I);return h.frustumCulled=!1,h}const $t=`
float fogAmt(){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      return smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #else
    return 0.;
  #endif
}`;function Qt(t){const c=[];for(let p=0;p<le;p++){const m=new e.SphereGeometry(1,36,10,0,se,0,Math.PI*.5).toNonIndexed();m.setAttribute("aIdx",new e.BufferAttribute(new Float32Array(m.attributes.position.count).fill(p),1)),m.deleteAttribute("uv"),m.deleteAttribute("normal"),c.push(m)}const r=Ke(c);c.forEach(p=>p.dispose());const l=t.look.S.pal,u={uSkyLo:{value:J(l[3]).multiplyScalar(1.7)},uSkyHi:{value:J("#1A2A6E").multiplyScalar(1.35)},uMilky:{value:J("#AEB8F0").multiplyScalar(t.look.moon==="none"?1.1:.7)},uMeteorP:{value:t.look.moon==="none"?2.1:6.3},uStarPx:t.starPx},w=Te+`
    attribute float aIdx; varying vec3 vU; varying vec4 vT; varying float vI; varying float vBase;
    void main(){ vU = normalize(position);
      vec4 t = uTrees[int(aIdx + .5)]; vT = t; vI = aIdx;
      float a = safeAng(vU.zx), rad = treeRad(t, a, aIdx);
      float gy = uTreeY[int(aIdx + .5)] - .5; vBase = gy;
      vec3 p = vec3(t.x + vU.x * rad, gy + vU.y * (rad * t.w / t.z + .5), t.y + vU.z * rad);
      vP = p; vN = vU;
      vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
      if (t.z < 1.5) gl_Position = vec4(2., 2., 2., 1.);
      #include <fog_vertex>
    }`,b=yt+Rt+$t+`
    varying vec3 vU; varying vec4 vT; varying float vI; varying float vBase;`,y=()=>({...e.UniformsUtils.clone(e.UniformsLib.fog),...t.U,...u}),o=new e.ShaderMaterial({uniforms:y(),fog:!0,side:e.BackSide,vertexShader:tt+Ve+w,fragmentShader:b+`
      void main(){
        vec3 dir = normalize(vU * vec3(1., 1., 1.)); dir.y = abs(dir.y);
        vec3 w = wheel(dir);
        vec3 c = nightSky(dir, starPix(w, 46.), starPix(w, 19.));
        float cut = .2 * vT.w + .25 * (vn2(vec2(safeAng(vU.zx) * 30., uTime * .6)) - .5);
        float hy = vP.y - vBase - .5 - cut;
        if (hy < 0.) discard;
        float t = pow(clamp(hy / (.26 * vT.w + 1.), 1e-4, 1.), uHem.y);
        vec3 dusk = mix(mix(uRampA, uRampB, smoothstep(.0, .38, t)), uRampC, smoothstep(.3, .72, t));
        c = mix(c, dusk * (1.15 - .55 * t), 1. - smoothstep(.45, 1., t));
        float camIn = 1. - smoothstep(-2., 2., treeD(uCamL - vec3(0., vBase, 0.), vT, vI));
        // far off a small dome is a pool of deep blue with a handful of stars, not a heap of glitter
        float farK = smoothstep(2.2, 6., length(vP - uCamL) / max(vT.z, 1.)) * (1. - camIn);
        float keep = 1. - smoothstep(.45, 1., t);
        vec3 cFar = mix(mix(uSkyHi, uSkyLo, smoothstep(.0, .75, dir.y)) * .62 + starGrid(w, 4., 41., 0.) * 1.2, c, keep);
        c = mix(c, cFar, farK);
        c *= mix(1., uGain, camIn);
        vec3 pre = c; gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
        gl_FragColor.rgb = mix(gl_FragColor.rgb, pre, max(camIn, .55));
      }`}),d=new e.ShaderMaterial({uniforms:{...y(),uVeil:{value:J(l[3]).lerp(J("#1A2A6E"),.45).multiplyScalar(1.5)}},fog:!0,side:e.FrontSide,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,vertexShader:tt+Ve+w,fragmentShader:b+`
      uniform vec3 uVeil;
      void main(){
        float k = vT.z / max(vT.w, .1);
        vec3 sc = vec3(1., k, 1.), cen = vec3(vT.x, vBase, vT.y);
        vec3 o = (uCamL - cen) * sc, dv = (vP - uCamL) * sc; float dl = max(length(dv), 1e-3); vec3 d = dv / dl;
        float R = length((vP - cen) * sc);
        float b = dot(o, d), cc = dot(o, o) - R * R, sq = sqrt(max(b * b - cc, 0.));
        float t0 = max(-b - sq, 0.), t1 = -b + sq;
        if (d.y < -1e-4) t1 = min(t1, -o.y / d.y);
        float chord = max(t1 - t0, 0.);
        float camD = treeD(uCamL - vec3(0., vBase, 0.), vT, vI);
        float vis = smoothstep(0., 6., camD);
        float a = .7 * smoothstep(0., 1., chord / (1.3 * vT.z)) * vis;
        vec3 dir = normalize(vU); dir.y = abs(dir.y);
        vec3 w = wheel(dir);
        vec3 st = starGrid(w, 30., 31., starPix(w, 30.)) * 1.2 + starGrid(w, 15., 5., starPix(w, 15.)) * 1.5;
        float farK = smoothstep(2.2, 6., length(vP - uCamL) / max(vT.z, 1.));
        st = st * (1. - .97 * farK) + starGrid(w, 3., 23., 0.) * 1.3 * farK;
        st *= smoothstep(.12, .45, abs(dot(normalize(vU * vec3(1., k, 1.)), -d)));
        float t = pow(clamp((vP.y - vBase - .5) / (.2 * vT.w + 1.), 1e-4, 1.), uHem.y);
        vec3 dusk = mix(mix(uRampA, uRampB, smoothstep(.0, .4, t)), uRampC, smoothstep(.3, .8, t)) * (1. - t) * (1. - t) * .5;
        vec3 c = uVeil * a + (st * smoothstep(.02, .25, chord / vT.z) + dusk) * vis;
        c = mix(c, fogColor * a, fogAmt() * (.45 - .25 * farK));
        gl_FragColor = vec4(c, a);
      }`}),n=new e.Mesh(r,o);n.frustumCulled=!1,n.renderOrder=-.4;const i=new e.Mesh(r,d);return i.frustumCulled=!1,i.renderOrder=21,[n,i]}function Jt(t){const c=t.rng.fork("sprites"),r=t.look,l=[],u=[],w=[],b=(n,i,p)=>{for(let m=0;m<p;m++){const A=c()*se,V=i===1?1:Math.sqrt(c())*.86;l.push(Math.sin(A)*V,i===1?c.range(.1,.5):c.range(.05,.6),Math.cos(A)*V),u.push(c(),c(),c()),w.push(n,i)}};for(let n=0;n<le;n++){const i=n===le-1;if(n===le-2){b(n,0,5),b(n,1,3);continue}!i&&n>=t.trees.length||(b(n,0,Math.round((i?260:40)*r.detail)),b(n,1,Math.round((i?30:9)*r.detail)),r.S.snow>0&&b(n,2,Math.round((i?200:70)*r.detail)))}const y=new e.BufferGeometry;y.setAttribute("position",new e.Float32BufferAttribute(l,3)),y.setAttribute("aS",new e.Float32BufferAttribute(u,3)),y.setAttribute("aT",new e.Float32BufferAttribute(w,2));const o=new e.ShaderMaterial({uniforms:{...t.U,uPx:t.uPx,uFly:{value:J("#D8F07A")}},transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,vertexShader:Ve+`
      attribute vec3 aS; attribute vec2 aT; uniform float uPx; uniform vec3 uFly;
      varying vec3 vCol;
      void main(){
        int si = int(aT.x + .5); vec4 t = uTrees[si]; float gy = uTreeY[si];
        vec3 p; float size = .1; vec3 c = vec3(0.);
        if (aT.y < .5) {                 // firefly: wanders, pulses slowly out of step
          p = vec3(t.x + position.x * t.z, gy + .4 + position.y * t.w, t.y + position.z * t.z);
          p += vec3(sin(uTime * (.3 + aS.x * .4) + aS.y * 40.), sin(uTime * (.5 + aS.y * .3) + aS.z * 30.) * .5, cos(uTime * (.35 + aS.z * .4) + aS.x * 50.)) * 1.2;
          float pulse = .5 + .5 * sin(uTime * (.7 + aS.x * .9) + aS.z * 60.);
          c = uFly * 4. * pulse * pulse * nightAll(p); size = .11 + .07 * aS.y;
        } else if (aT.y < 1.5) {         // a star leaks from the hem, drifts 6 to 10 m downwind and melts in 3 s
          float cyc = 5. + 4. * aS.x, ph = fract(uTime / cyc + aS.y), age = ph * cyc;
          float a = safeAng(position.zx), rad = treeRad(t, a, aT.x) * .97;
          p = vec3(t.x + position.x * rad, gy + position.y * t.w * 1.2, t.y + position.z * rad);
          p.xz += uWind * age * 2.8; p.y += sin(age * 1.7 + aS.z * 9.) * .4 + age * .15;
          float life = smoothstep(0., .4, age) * (1. - smoothstep(1.2, 3.2, age));
          c = vec3(.8, .88, 1.) * 5. * life * (.75 + .25 * sin(uTime * 6. + aS.z * 70.)); size = .13 + .1 * aS.z;
        } else {                         // snow that falls only inside the night
          float fall = fract(aS.x - uTime * (.05 + .03 * aS.y));
          p = vec3(t.x + position.x * t.z + sin(uTime * .7 + aS.z * 20.) * .6, gy + fall * t.w * .9, t.y + position.z * t.z);
          c = vec3(.75, .82, 1.) * 1.1 * nightAll(p); size = .07 + .05 * aS.z;
        }
        c *= step(1.5, t.z);
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        float px = size * uPx / max(-mv.z, .1), k = max(1., 1.8 / max(px, 1e-3));
        gl_PointSize = px * k * 2.4; vCol = c / (k * k) * (1. - .9 * smoothstep(45., 200., -mv.z));   // far nights are blue pools, not glitter
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      varying vec3 vCol;
      void main(){ vec2 d = gl_PointCoord - .5; float r = length(d) * 2.;
        float a = exp(-r * r * 7.) * (1. - smoothstep(.8, 1., r));
        gl_FragColor = vec4(vCol * a, 1.);
      }`}),d=new e.Points(y,o);return d.frustumCulled=!1,d.renderOrder=22,d}function ea(t){const c=[],r=[],l=[],u=(o,d,n,i=1,p=0)=>{for(const m of[o,d,n])c.push(m[0],m[1],m[2]),r.push(Math.abs(m[0])*i),l.push(p)},w=(o,d,n)=>{const i=[0,0,n],p=[0,0,-n],m=[[o,0,0],[0,d,0],[-o,0,0],[0,-d,0]];for(let A=0;A<4;A++){const V=m[A],I=m[(A+1)%4];c.push(...i,...V,...I,...p,...I,...V);for(let h=0;h<6;h++)r.push(0),l.push(0)}},b=o=>{for(let d=0;d<o.length-1;d++)for(let n=0;n<8;n++){const i=n/8*se,p=(n+1)/8*se,[m,A]=o[d],[V,I]=o[d+1],h=[Math.cos(i)*A,Math.sin(i)*A*.9,m],v=[Math.cos(p)*A,Math.sin(p)*A*.9,m],_=[Math.cos(i)*I,Math.sin(i)*I*.9,V],K=[Math.cos(p)*I,Math.sin(p)*I*.9,V];c.push(...h,...v,..._,...v,...K,..._);for(let L=0;L<6;L++)r.push(0),l.push(0)}};for(const o of[1,-1])if(t==="swallow")u([.05*o,0,.16],[.5*o,0,.05],[.05*o,0,-.1]),u([.5*o,0,.05],[o,0,-.42],[.05*o,0,-.1]),u([0,0,-.3],[.2*o,0,-.85],[.03*o,0,-.45]);else if(t==="owl"){const d=i=>.2-.13*i*i,n=(i,p)=>d(i)-.46*(1-.58*i*i*i)+(p%2?.05:0);for(let i=0;i<12;i++){const p=.07+.93*i/12,m=.07+.93*(i+1)/12,A=(p+m)/2,V=[p*o,0,d(p)],I=[m*o,0,d(m)],h=[m*o,0,n(m,1)],v=[p*o,0,n(p,1)],_=[A*o,0,n(A,0)-.015];u(V,I,h),u(V,h,_),u(V,_,v)}u([0,0,-.36],[.17*o,0,-.62],[0,0,-.68]),u([0,0,-.36],[.09*o,0,-.3],[.17*o,0,-.62])}else t==="lark"?(u([.05*o,0,.18],[.6*o,0,.12],[.05*o,0,-.16]),u([.6*o,0,.12],[o,0,-.12],[.05*o,0,-.16]),u([0,0,-.3],[.12*o,0,-.62],[0,0,-.6])):(u([.02*o,0,.05],[.9*o,0,.75],[o,0,.1]),u([.02*o,0,.05],[o,0,.1],[.5*o,0,-.1]),u([.02*o,0,0],[.7*o,0,-.15],[.55*o,0,-.7]));if(t==="owl"){b([[.37,.05],[.34,.15],[.27,.2],[.17,.21],[.07,.18],[-.04,.17],[-.2,.15],[-.36,.1],[-.47,.02]]);const o=.385,d=n=>.185*(1-.22*Math.pow(Math.max(0,Math.sin(n)),8))*(.85+.15*Math.abs(Math.cos(n)));for(let n=0;n<14;n++){const i=n/14*se,p=(n+1)/14*se;u([0,0,o+.02],[Math.cos(i)*d(i),Math.sin(i)*d(i)*1.05,o-.04],[Math.cos(p)*d(p),Math.sin(p)*d(p)*1.05,o-.04],0,.22)}for(const n of[-1,1])for(let i=0;i<6;i++){const p=i/6*se,m=(i+1)/6*se,A=n*.068,V=.03,I=.032;u([A,V,o+.012],[A+Math.cos(p)*I,V+Math.sin(p)*I,o+.008],[A+Math.cos(m)*I,V+Math.sin(m)*I,o+.008],0,-.94)}u([-.02,-.02,o+.016],[.02,-.02,o+.016],[0,-.085,o+.03],0,-.45)}else t==="butterfly"?w(.03,.03,.3):w(.07,.06,.3);for(;l.length<r.length;)l.push(0);const y=new e.BufferGeometry;return y.setAttribute("position",new e.Float32BufferAttribute(c,3)),y.setAttribute("aW",new e.Float32BufferAttribute(r,1)),y.setAttribute("aT",new e.Float32BufferAttribute(l,1)),y}function ta(t){return he(t,{side:e.DoubleSide,vert:`
      attribute float aW; attribute float aT; attribute vec4 aF; attribute vec3 aC; varying vec3 vC;
      void main(){
        // aF: flap speed, amplitude, phase, glide (0 = always flapping .. 1 = long glides)
        float ph = uTime * aF.x + aF.z * 6.2832;
        float beat = sin(ph) * mix(1., smoothstep(-.2, .6, sin(ph * .11 + aF.z * 9.)), aF.w);
        float ang = beat * aF.y * aW + .15 * aW;
        vec3 lp = position; float sx = sign(lp.x);
        lp.y += abs(lp.x) * sin(ang); lp.x = sx * abs(lp.x) * cos(ang);
        vec4 wp = modelMatrix * instanceMatrix * vec4(lp, 1.);
        vec3 p = wp.xyz; vP = p;
        vec3 ln = aW > .01 ? vec3(-sx * sin(ang), 1., 0.) : vec3(position.xy, .02) + vec3(0., .001, 0.);
        vec3 N = normalize(mat3(modelMatrix * instanceMatrix) * ln); vN = N;
        float n = nightAll(p);
        vec3 alb = aC * (aW > .01 ? (.82 + .18 * sin(aW * 30.)) * (1. - .3 * aW * aW) : .85) * (1. + aT);
        vec3 c = lawN(alb, p, N, normalize(uCamL - p), 1., n) + lawN(alb, p, -N, normalize(uCamL - p), 1., n) * (aW > .01 ? .5 : .25);
        c += alb * alb * alb * vec3(.8, .75, .64) * 1.05 * n * (.6 + .4 * N.y);                        // pale wings glimmer in the night
        vC = c;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,frag:`varying vec3 vC;
      void main(){ gl_FragColor = vec4(vC, 1.);
        #include <fog_fragment>
      }`})}function Ie(t,c,r,l){const u=ea(r),w=l.length,b=new Float32Array(w*4),y=new Float32Array(w*3);l.forEach((V,I)=>{b.set(V.flap,I*4);const h=J(V.color);y.set([h.r,h.g,h.b],I*3)}),u.setAttribute("aF",new e.InstancedBufferAttribute(b,4)),u.setAttribute("aC",new e.InstancedBufferAttribute(y,3));const o=new e.InstancedMesh(u,c,w);o.frustumCulled=!1;const d=new e.Matrix4,n=new e.Quaternion,i=new e.Vector3,p=new e.Vector3(0,0,1),m=new e.Euler,A=new e.Vector3;return o.userData.set=(V,I,h,v,_=0)=>{v&&v.lengthSq()>1e-10?A.copy(v).normalize():A.set(0,0,1);const K=Math.atan2(A.x,A.z),L=-Math.asin(Math.max(-.9,Math.min(.9,A.y)));m.set(L,K,_,"YXZ"),n.setFromEuler(m),i.set(h*.5,h*.5,h*.5),d.compose(I,n,i),o.setMatrixAt(V,d)},o}function nt(t,c){const r=Lt(),l=[.42,.2,.09],u=[.56,.45,.3],w=[.09,.06,.045],b=[.66,.59,.46],y=(f,x,F)=>[f[0]+(x[0]-f[0])*F,f[1]+(x[1]-f[1])*F,f[2]+(x[2]-f[2])*F],o=f=>(x,F)=>y(y(l,u,Math.min(1,Math.max(0,.25-F*.75))),w,f*.5+(F>.8?.16:0));r.loft([[-.66,1,0],[-.5,1.03,0],[-.15,1,0],[.22,.96,0],[.48,.98,0],[.66,1.08,0]],[.13,.25,.28,.32,.31,.2],[.11,.21,.24,.25,.22,.15],10,(f,x)=>f<=1&&x>-.3?b:o(0)(f,x),f=>[f>=2&&f<=3?1:.3,0,0],4.5),r.loft([[-.74,1.08,0],[-.86,.98,0],[-.9,.84,0]],[.035,.03,.012],[.04,.035,.012],5,()=>y(b,w,.35),()=>[0,.6,0],4.5);const d=[[.54,1.1,0],[.72,1.3,0],[.84,1.47,0],[.9,1.6,0]];r.loft(d,[.23,.165,.12,.1],[.165,.12,.095,.085],8,o(.05),null,4.5);const n=d[3],i=[.93,-.36,0],p=(f,x=0,F=0)=>[n[0]+i[0]*f,n[1]+i[1]*f+x,n[2]+F];r.loft([p(-.07,.02),p(.03,.03),p(.14,.01),p(.25,-.01),p(.33,-.015)],[.085,.1,.075,.052,.042],[.075,.088,.06,.042,.036],8,(f,x)=>f>=4?w:f===3?y(o(0)(f,x),w,.35):o(.05)(f,x),null,4.5);for(const f of[-1,1])r.blade(p(-.03,.07,f*.06),p(-.13,.22,f*.2),[i[0],i[1]+.25,0],.07,y(l,w,.3),[0,1,0],4.5+f*.13);const m=[[-1,1,0],[1,1,1],[-1,-1,2],[1,-1,3]];for(const[f,x,F]of m){const C=x*.13,T=f>0?[[.46,.98,C],[.5,.56,C],[.47,.14,C],[.5,.02,C]]:[[-.5,.98,C],[-.64,.56,C],[-.52,.16,C],[-.5,.02,C]];r.loft(T,f>0?[.1,.05,.034,.04]:[.15,.06,.034,.04],f>0?[.08,.045,.03,.036]:[.1,.05,.03,.036],6,(P,N)=>P>=3?w:o(.15)(P,N),P=>[0,0,Math.min(1,P/3),0],F+.5,new e.Vector3(1,0,0))}const A=r.geometry(),V=new e.InstancedBufferGeometry;V.index=A.index;for(const f of["position","normal","color","aAnim"])V.setAttribute(f,A.attributes[f]);const I=new Float32Array(c*2);V.setAttribute("aGo",new e.InstancedBufferAttribute(I,2));const h=he(t,{side:e.DoubleSide,uniforms:{uWalk:{value:0}},vert:`
      attribute vec4 aAnim; attribute vec3 color; attribute vec2 aGo; uniform float uWalk; varying vec3 vCol; varying vec2 vCl;
      void main(){
        vec3 p = position; vCl = vec2(position.x + .12 * sin(uTime * 1.2 + position.y * 6.), aGo.y); float leg = floor(aAnim.w), ph = (uWalk + aGo.x) * aGo.y + leg * 1.5708;
        float k = aAnim.z * aGo.y;
        p.x += sin(ph) * .27 * k; p.y += max(cos(ph), 0.) * .1 * k * aAnim.z;
        p.y += .014 * sin((uWalk + aGo.x) * 2.) * aGo.y * (1. - aAnim.z);
        p += normal * aAnim.x * .02 * sin(uTime * 1.6 + aGo.x);
        float fk = smoothstep(.8, 1., sin(uTime * .9 + aGo.x * 7. + fract(aAnim.w) * 20.)) * sin(uTime * 15.);
        p += normal * aAnim.y * .06 * fk;
        vec4 wp = modelMatrix * instanceMatrix * vec4(p, 1.);
        vP = wp.xyz; vN = normalize(mat3(modelMatrix * instanceMatrix) * normal); vCol = color;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,frag:`varying vec3 vCol; varying vec2 vCl;
      void main(){
        vec3 N = normalize(vN), V = normalize(uCamL - vP);
        if (dot(N, V) < 0.) N = -N;
        vec3 alb = vCol * (.84 + .32 * vn3(vP * vec3(26., 60., 26.)));
        // an animal's night is the night of the place it stands in, as for everything else: n comes from position only
        float n = nightAll(vP);
        vec3 c = lawN(alb * mix(.62, .8, n), vP, N, V, .6 + .4 * smoothstep(-.3, .5, N.y), n);
        float rim = 1. - max(dot(N, V), 0.); rim *= rim;
        c += n * uGain * (alb * vec3(.6, .62, .8) * .16 + vec3(.5, .62, .95) * rim * (.2 + .5 * max(N.y, 0.)));   // never a black cut-out in her night
        c += (1. - n) * uSunCol * alb * rim * .25 * max(dot(N, uSunDir) + .4, 0.);                               // a sunlit edge to the coat
        float b4 = 4. * n * (1. - n), Lc = dot(c, vec3(.3, .5, .2));
        c = mix(c, alb / max(dot(alb, vec3(.3, .5, .2)), .02) * Lc, .5 * b4);                                    // in the dusk band she keeps her red coat
        { float nn = nightAll(vP), Ln = dot(c, vec3(.3, .5, .2)); vec3 Lm = normalize(uMoon - vP + vec3(0., 1e-3, 0.));   // by night she keeps her red coat, rimmed ivory toward the moon
          c = mix(c, alb / max(dot(alb, vec3(.3, .5, .2)), .02) * Ln / (1. + 2.8 * Ln), nn * .85);
          c += nn * uMoonCol * vec3(1.05, 1., .88) * rim * (.25 + .6 * max(N.y, 0.) + .6 * smoothstep(-.4, .5, dot(N, Lm))) * .34; }
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`}),v=new e.InstancedMesh(V,h,c);v.frustumCulled=!1;const _=new e.Matrix4,K=new e.Quaternion,L=new e.Vector3,H=new e.Vector3(0,1,0);return v.userData.set=(f,x,F,C,T,P,N)=>{K.setFromAxisAngle(H,Math.atan2(-C,F)),L.set(T,T,T),_.compose(x,K,L),v.setMatrixAt(f,_),I[f*2]=P,I[f*2+1]=N},v.userData.mat=h,v}async function aa(t,c,r){await r.yield();const l=t.rng.fork("props"),u=[],w=new e.Group,b=(f,x,F,C,T,P,N=0,O=0)=>{const B=new e.BoxGeometry(f,x,F,1,2,1);B.rotateZ(O),B.rotateY(N),B.translate(C,T,P),u.push(B)},y=c.posAtDist(24),o=c.tangentAtDist(24),d=-o.z,n=o.x,i=Math.atan2(d,n);for(const f of[-1,1]){let x=null;for(let F=0;F<46;F++){const C=f*(3.6+F*2.5),T=y.x+d*C+o.x*Math.sin(F*.21)*1.5,P=y.z+n*C+o.z*Math.sin(F*.21)*1.5,N=de(T,P);if(b(.17,1.4+l.range(-.1,.1),.15,T,N+.6,P,i+l.range(-.3,.3),l.range(-.06,.06)),x)for(const O of[.45,.95]){const B=T-x.x,Z=P-x.z,ee=Math.hypot(B,Z);b(ee+.3,.12,.06,(T+x.x)/2,(N+x.y)/2+O+l.range(-.03,.03),(P+x.z)/2,Math.atan2(-Z,B),Math.atan2(N-x.y,ee))}x={x:T,y:N,z:P}}for(let F=0;F<5;F++){const C=F/4*Math.PI*.9,T=f*3.6;b(.1,1.3,.1,y.x+d*T+o.x*(.4+Math.sin(C)*1.5)-d*f*(1-Math.cos(C))*.8,de(y.x,y.z)+.6,y.z+n*T+o.z*(.4+Math.sin(C)*1.5)-n*f*(1-Math.cos(C))*.8,i)}}await r.yield();const p=(f,x,F,C,T)=>{const P=(B,Z,ee,ae,U,W=0)=>{B.rotateX(W),B.translate(ee,ae,U),B.scale(T,T,T),B.rotateY(C),B.translate(f,x,F),B.userData.r=Z,u.push(B)},N=new e.SphereGeometry(1,10,8);N.scale(.115,.125,.23),P(N,1,0,.17,0,-.5),P(new e.SphereGeometry(.075,9,7),1,0,.345,.15);const O=new e.ConeGeometry(.03,.14,6);P(O,2,0,.33,.265,1.75),P(new e.BoxGeometry(.1,.018,.24),1,0,.06,-.25,.42);for(const B of[-1,1]){const Z=new e.SphereGeometry(1,8,6);Z.scale(.035,.09,.2),P(Z,1,B*.105,.17,-.03,-.55)}for(const B of[-1,1])P(new e.BoxGeometry(.014,.1,.014),2,B*.04,.03,.02)};for(const[f,x,F]of[[-1,1,1.25],[-1,2,1.1],[1,1,1.2],[1,3,1.15],[-1,4,1.1]]){const C=f*(3.6+x*2.5),T=y.x+d*C+o.x*Math.sin(x*.21)*1.5,P=y.z+n*C+o.z*Math.sin(x*.21)*1.5;p(T,de(T,P)+1.3,P,i+Math.PI+f*.5+l.range(-.9,.9),F)}await r.yield();const m=t.picnic,A=new e.CylinderGeometry(.3,.24,.3,12,3);A.scale(1.35,1,1),A.translate(m.x-.75,.27,m.z-.75),u.push(A);const V=new e.TorusGeometry(.3,.025,5,14,Math.PI);V.translate(m.x-.75,.42,m.z-.75),u.push(V);for(const[f,x]of[[.35,.1],[.1,.5]]){const F=new e.CylinderGeometry(.055,.05,.11,10);F.translate(m.x+f,.19,m.z+x),u.push(F)}await r.yield();const I=Ke(u.map(f=>{const x=f.index?f.toNonIndexed():f.clone();return x.deleteAttribute("uv"),x.setAttribute("aR",new e.BufferAttribute(new Float32Array(x.attributes.position.count).fill(f.userData.r||0),1)),f.dispose(),x})),v=he(t,{uniforms:{uPic:{value:new e.Vector2(m.x,m.z)}},vert:`attribute float aR; varying float vR;
`+`void main(){ vP = position; vN = normal;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
    }`.replace("vP = position;","vP = position; vR = aR;"),frag:`uniform vec2 uPic; varying float vR;
      void main(){ vec3 N = normalize(vN), V = normalize(uCamL - vP);
        float g = vn2(vec2(vP.x * 3. + vP.z * 3., vP.y * 26.)) * .5 + vn2(vP.xz * 40. + vP.y * 9.) * .5;
        vec3 alb = mix(vec3(.3, .25, .19), vec3(.62, .57, .47), g);                       // weathered chestnut
        float nearPic = step(length(vP.xz - uPic), 3.);
        float weave = step(.5, fract(vP.y * 18. + step(.5, fract(safeAng(vP.xz - uPic + vec2(.75)) * 4.)) * .5));
        alb = mix(alb, mix(vec3(.5, .36, .18), vec3(.74, .58, .32), weave), nearPic);       // wicker
        alb = mix(alb, vec3(.82, .86, .9), nearPic * step(length(vP.xz - uPic + vec2(.75)), .01) );
        alb = mix(alb, mix(vec3(.016, .018, .034), vec3(.5, .47, .4), step(1.5, vR)), step(.5, vR));   // rook: blue-black, pale bill
        vec3 c = lawN(alb, vP, N, V, .6 + .4 * g, nightAll(vP));
        float rk = step(.5, vR) * (1. - step(1.5, vR)), sh = max(dot(N, normalize(uSunDir + V + vec3(0., 1e-3, 0.))), 0.); sh *= sh; sh *= sh;
        c += rk * vec3(.22, .26, .5) * (sh * sh * .9 + .12 * (1. - max(dot(N, V), 0.))) * (1. - nightAll(vP));   // the gloss on a rook's back
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`}),_=new e.Mesh(I,v);_.frustumCulled=!1,w.add(_),await r.yield();const K=new e.PlaneGeometry(2,2,16,16);K.rotateX(-Math.PI/2);const L=he(t,{side:e.DoubleSide,uniforms:{uPic:{value:new e.Vector3(m.x,.16,m.z)}},vert:`uniform vec3 uPic; varying vec2 vUv;
      void main(){ vUv = uv; vec3 lp = position;
        float free = clamp(length(lp.xz - vec2(-.75, -.75)) / 2.4, 0., 1.);           // 0 at the pinned corner
        float lift = free * free;
        float w1 = sin(uTime * 3.1 + lp.x * 2.6 + lp.z * 1.9), w2 = sin(uTime * 5.3 - lp.x * 4.1 + lp.z * 3.3);
        float gust = .5 + .5 * sin(uTime * .9 + 1.);
        lp.y += lift * (.16 + .42 * gust + .22 * w1 * (.4 + gust) + .07 * w2) + .03 * sin(lp.x * 5.) * sin(lp.z * 6.);
        vec3 p = lp + uPic; vP = p;
        vN = normalize(vec3(-lift * cos(uTime * 3.1 + lp.x * 2.6 + lp.z * 1.9) * .5, 1., -lift * cos(uTime * 5.3 - lp.x * 4.1 + lp.z * 3.3) * .3));
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,frag:`varying vec2 vUv;
      void main(){ vec3 N = normalize(vN), V = normalize(uCamL - vP); if (!gl_FrontFacing) N = -N;
        vec2 q = vUv * 9.;
        float chk = step(.5, fract(q.x)) + step(.5, fract(q.y));
        vec3 alb = mix(vec3(.78, .74, .62), vec3(.7, .3, .26), chk * .22) * (.9 + .1 * vn2(vUv * 60.));   // cream, faint red check
        vec3 c = lawN(alb, vP, N, V, 1., nightAll(vP));
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`}),H=new e.Mesh(K,L);return H.frustumCulled=!1,w.add(H),w}var ia={id:"night-under-the-oaks",name:"Where Night Spends the Day",category:"bizarre",weirdness:.9,media:["open","air"],async build(t){const c=Yt(t),r=c.S,l=new e.Scene,u=await Et(t,{palette:r.pal,detail:c.detail});u.object.position.y=.1,l.add(u.object);const w=u.uniforms,b=u.anchors,y=Ht[c.ring].map((a,s)=>J(a).multiplyScalar((c.ring==="scarlet"?[1.3,.8,.9]:[1.5,1.35,1.5])[s]));c.ring==="scarlet"&&w.uHem.value.set(8.5,.34),w.uRampA.value.copy(y[0]),w.uRampB.value.copy(y[1]),w.uRampC.value.copy(y[2]),u.setMoon?.(c.moon);const o=c.moon==="full"?1.55:c.moon==="none"?.5:1,d={amb:w.uStarAmb.value.clone().multiplyScalar(c.moon==="none"?1.25:1),moon:w.uMoonCol.value.clone().multiplyScalar(o)};await t.yield();const n=Math.PI/180,i=(a,s,z)=>new e.Vector3(Math.sin(a*n)*s,z,Math.cos(a*n)*s),p=[];{const a=i(135,1,0).multiplyScalar(-1),s=10,z=19.1,g=36*n,D=[];let q=i(135,150,0);D.push(q.clone());for(let $=1;$<=s;$++){const ne=g*($-.5)/s,k=Math.cos(ne),Q=Math.sin(ne);q=q.clone().addScaledVector(new e.Vector3(a.x*k-a.z*Q,0,a.z*k+a.x*Q),-z),D.push(q.clone())}D.reverse();const re=[3.2,3.2,3.2,3.4,3.3,2.6,2.3,3,5.5,8.5,9.5];D.forEach(($,ne)=>p.push($.setY(de($.x,$.z)+re[ne])))}const m=[[134.5,128,7.5],[134,106,6],[132.5,90,5],[130,84,4.6],[124,81.5,4.4],[117,80,4.3],[110,79,4.2],[104,78,4.2],[95,71.5,4]];for(const[a,s,z]of m)p.push(i(a,s,z));const A=[[62,6,4],[54,24,4],[43,41,3.6],[26,55,2],[7,56,1.8],[-6,43,2.3],[-12,28,2.8],[-16.5,14,2.4],[-19,2,2.5],[-19,-9,3.3],[-15,-21,3.9],[-8.5,-31.5,4],[-11.5,-39.5,3.6],[-19,-40,3.4],[-25.5,-34.5,3.6],[-22,-25.5,3.6],[-17.5,-15,3.4],[-18.5,-3,2.8],[-17,10,2.5],[-13,22,2.1],[-11.5,35,1.5],[-15,47,2.3],[-23,56,4.2],[-34,52,5],[-36.8,41.5,4.8]];for(const[a,s,z]of A)p.push(new e.Vector3(a,z,s));const V=[4.2,3.6,3,3.4,4.6,6,7];b.flyThrough.slice(10).forEach((a,s)=>p.push(a.clone().setY(V[s])));const I=b.runStart.clone();await t.yield();const h=Gt(p),v=h.length;await t.yield();const _=a=>h.nearestXZ(a.x,a.z).u,K=b.portalSeat.position,L=a=>1-(a.x-K.x)*b.portalSeat.facing.x/v-(a.z-K.z)*b.portalSeat.facing.z/v,H=a=>{const s=a*n;return 75*(1+.06*(Math.sin(s*3+.7)*.5+Math.sin(s*5+2.1)*.3+Math.sin(s*8+4)*.2))},f=i(101,H(101),0),x=_(f),F=L(b.moon.view),C=L(b.moon.passAt),T=L(b.stag.position),P=L(I),N=76,O=(N-8)/v,B=190/v,Z=129,ee=(Z-7)/v,ae=(a,s)=>_(i(a,s,0)),U=[],W={...w,uTrees:{value:[]},uTreeY:{value:new Array(le).fill(0)},uGain:{value:1}};for(let a=0;a<le;a++)W.uTrees.value.push(new e.Vector4(9e4+a*500,9e4,1,1));const me={uGrassA:{value:J(r.grassA)},uGrassB:{value:J(r.grassB)},uFlower:{value:J(r.flower).multiplyScalar(.92)},uSeed:{value:J(r.seed)},uAccent:{value:J(r.accent)},uFlowerAmt:{value:r.flowerAmt},uPicXZ:{value:new e.Vector2}},st={value:[]};for(let a=0;a<He;a++){const s=h.posAtDist(-50+(x*v+30)*a/(He-1));st.value.push(new e.Vector2(s.x,s.z))}const Ge=i(94,H(94),0),_e=Math.hypot(Ge.x,Ge.z),Y={rng:t.rng,noise:t.noise,look:c,hero:u,U:W,MU:me,uPath:st,trees:U,dThorn:N,uPx:{value:400},starPx:{value:1},cen:{near:{value:new e.Vector2},far:{value:new e.Vector2}},picnic:{x:Ge.x/_e*(_e+1.3),z:Ge.z/_e*(_e+1.3)}};me.uPicXZ.value.set(Y.picnic.x,Y.picnic.z),await t.yield();for(const a of Ot(Y,h,x))U.push(a);await t.yield(),U.forEach((a,s)=>{W.uTrees.value[s].set(a.x,a.z,a.R*a.s,a.H*a.s),W.uTreeY.value[s]=a.y});const Ce=_t({rng:t.rng,preset:"day",zenith:r.zenith,horizon:r.horizon,sunElevation:68,sunAzimuth:132,sunSize:1.1,clouds:{coverage:.34,softness:.2,scale:1.25,wind:[.016,.006]},clouds2:!1});l.add(Ce.object);const rt=J(r.fog),bt=J("#1A2A6E").multiplyScalar(.8);l.fog=new e.FogExp2(rt.clone(),.0012),u.setSun(Ce.sunDirection),await t.yield();const Ye=c.detail*Math.min(1.08,Math.max(.86,c.density));l.add(qt(Y)),await t.yield(),l.add(Xt(Y)),await t.yield(),l.add(xt(Y,Math.round(8300*Ye),46,"near",.7,.72)),await t.yield(),l.add(xt(Y,Math.round(5300*Ye),130,"far",1.7,.95,2)),await t.yield(),l.add(jt(Y,Math.round(9e3*Ye),52,"near")),await t.yield(),l.add(await Zt(Y,t)),await t.yield(),l.add(await Wt(Y,t)),await t.yield(),await t.yield();for(const a of Qt(Y))l.add(a),await t.yield();await t.yield(),l.add(Jt(Y)),await t.yield(),l.add(await aa(Y,h,t)),await t.yield();const ue=nt(Y,9);l.add(ue),await t.yield();const ve=t.rng.fork("fliers"),Fe=ta(Y),qe=Ie(Y,Fe,"lark",[0,1].map(()=>({flap:[27,.95,ve(),0],color:"#9A7B50"}))),Xe=Ie(Y,Fe,"swallow",Array.from({length:8},()=>({flap:[17,.85,ve(),.7],color:"#27356A"}))),Ee=Ie(Y,Fe,"owl",[{flap:[5.2,.8,.2,.15],color:"#F3ECDD"},{flap:[4.6,.8,.55,.15],color:"#F3ECDD"}]),je=Math.round(40*c.detail),Oe=Ie(Y,Fe,"butterfly",Array.from({length:je},()=>({flap:[12+ve()*5,1.15,ve(),0],color:ve()<.55?"#F6F3E8":"#A8703A"})));l.add(qe,Xe,Ee,Oe),await t.yield(),await t.yield();const pe=(a,s)=>{const z=h.tangentAtDist(a);return s.set(-z.z,0,z.x).normalize()},Ze=Array.from({length:je},()=>{const a=ve.range(8,x*v-20),s=h.posAtDist(a),z=pe(a,new e.Vector3),g=(ve()<.5?-1:1)*ve.range(2.2,9);return{p:new e.Vector3(s.x+z.x*g,de(s.x+z.x*g,s.z+z.z*g)+ve.range(.9,2.3),s.z+z.z*g),ph:ve()*40}}),it=(a,s,z)=>z.set(a.p.x+Math.sin(s*.7+a.ph)*1.4+Math.sin(s*1.9+a.ph)*.4,a.p.y+Math.sin(s*2.3+a.ph*2)*.4,a.p.z+Math.cos(s*.6+a.ph)*1.4),Mt=[30,104],We=136,$e=U[1],ce={X:h.posAtDist(We),r:pe(We,new e.Vector3),M:new e.Vector3($e.x,$e.y+3.2,$e.z)};ce.S=ce.X.clone().addScaledVector(ce.r,-34).setY(ce.X.y+2),ce.F=ce.M.clone().add(ce.M.clone().sub(ce.X).setY(0).normalize().multiplyScalar(40)).setY(ce.M.y+5);const zt=new e.CatmullRomCurve3([ce.S,ce.X,ce.M,ce.F],!1,"centripetal"),At=(We-6-60*(1/3-.34+3.5*.022))/v,Pt=Array.from({length:8},(a,s)=>({s:(s-3.5)*.022,a:ve()*se,lat:ve.range(-1.3,1.3),y:ve.range(-.7,.7)})),M=new e.Vector3,te=new e.Vector3,fe=new e.Vector3,De=new e.Vector3,Qe=new e.Vector2;function lt(a,s,z,g){const D=Pt[a],q=.34+(z-At)*v/60+D.s,re=Math.min(1,Math.max(0,q));zt.getPoint(re,g);const $=1-R(-.25,.02,q)*(1-R(.98,1.25,q)),ne=s*1.1+D.a;return g.x+=D.lat*ce.r.x+Math.sin(ne)*9*$,g.z+=D.lat*ce.r.z+Math.cos(ne)*9*$*.7,g.y+=D.y+Math.sin(s*2.3+D.a)*(.3+$),g}const ct=h.posAtDist(N+5).addScaledVector(pe(N+5,new e.Vector3),-1),kt=h.posAtDist(N-9).addScaledVector(pe(N-9,new e.Vector3),-1.7),ze=U[0],St=new e.Vector3(ze.x,ze.y+9.5,ze.z);function ut(a,s,z){const g=Math.min(3,Math.max(-1.5,(a*v-(N-27))/12));z.lerpVectors(ct,kt,g).setY(ct.y+.75-.45*R(0,1,g)+.9*R(1.1,3,g)+Math.sin(s*5.2)*.06);const D=1-R(N-44,N-30,a*v),q=s*.55+2.2;return D>0&&(z.x+=(ze.x+Math.sin(q)*7.5-z.x)*D,z.z+=(ze.z+Math.cos(q)*7.5-z.z)*D,z.y+=(ze.y+4.6+Math.sin(s*.9)*.5-z.y)*D),z}const Ct=(a,s)=>{let z=0;for(let g=0;g<le;g++){const D=W.uTrees.value[g];if(D.z<1.5)continue;const q=a.x-D.x,re=a.z-D.y,$=Math.atan2(q,Math.abs(re)<1e-4?1e-4:re),ne=D.z*(1+.07*Math.sin($*3+g*1.7)+.045*Math.sin($*5+g*2.9))+.35*Math.sin($*2+s*.79+g*2),k=Math.hypot(q,(a.y-W.uTreeY.value[g])*D.z/Math.max(D.w,.1),re)-ne,Q=.16*D.z;z=Math.max(z,1-R(-Q,Q,k))}return z};await t.yield(),await Ce.prewarm(t.renderer,null,l),await t.yield();const Le=a=>{let s=0,z=1e9;for(let g=0;g<=800;g++){const D=h.posAtDist(g/800*v,De).distanceToSquared(a);D<z&&(z=D,s=g)}return s/800},ge=(a,s,z)=>new e.Vector3(a,s,z),Ue=Le(ge(26,2,55)),Ne=Le(ge(-16.5,2.4,14)),Re=Le(ge(-25.5,3.6,-34.5)),Ae=Le(ge(-11.5,1.5,35)),vt=new e.Vector3,Pe=i(127,H(127)+.5,1.3),oe={p:h.posAtDist(Z-4),d:h.tangentAtDist(Z).setY(0).normalize()};{const a=pe(Z-4,new e.Vector3);oe.p.addScaledVector(a,2.8),oe.r=a.clone()}const Ft=W.uTrees.value[le-2];function ft(a){const s=Math.max(0,a*v-(Z-60))*.07;M.copy(oe.p).addScaledVector(oe.d,s),M.y=de(M.x,M.z)+.02,ue.userData.set(0,M,oe.d.x,oe.d.z,1.12,0,1),vt.copy(M).setY(M.y+1.25),Ft.set(M.x-oe.d.x*.75,M.z-oe.d.z*.75,1.3,1.3),W.uTreeY.value[le-2]=M.y,te.copy(M).addScaledVector(oe.d,-1.7).addScaledVector(oe.r,.9),te.y=de(te.x,te.z)+.02,ue.userData.set(1,te,oe.d.x,oe.d.z,.64,2.1,1),ue.userData.mat.uniforms.uWalk.value=s*(se/1.3),ue.instanceMatrix.needsUpdate=!0,ue.geometry.attributes.aGo.needsUpdate=!0}{const a=i(182,1,0);M.set(Pe.x,.12,Pe.z),ue.userData.set(2,M,a.x,a.z,1.18,1.3,0)}const Dt=ge(11.5,1.6,48.6),Nt=ge(-8.8,1.4,41.5),Je=ge(-26,6,-22),dt=b.moon.position.clone();dt.y-=1.4,M.set(11.2,.12,49.6),ue.userData.set(3,M,.69,-.73,1.15,.7,0),M.set(14.6,.12,47.2),ue.userData.set(4,M,.8,-.6,1.08,2.9,0),M.set(10.2,.12,47.4),ue.userData.set(5,M,.6,-.8,.62,4.1,0),M.set(-9.5,.12,39.5),ue.userData.set(6,M,-.97,-.24,1.16,5.2,0),M.set(-6.6,.12,42.2),ue.userData.set(7,M,-.9,.44,1.1,1.7,0),M.set(-10.6,.12,42.6),ue.userData.set(8,M,-.99,.1,.64,3.3,0);const Bt=b.moon.position.clone().add(ge(3.6,-1.4,-1)),Vt=ge(-20.1,4.1,-36.5);function mt(a,s,z){const g=Math.min(3.4,Math.max(-.6,.4+.04*(a-Re)*v));return z.lerpVectors(Bt,Vt,g),z.y+=.14*Math.sin(s*.8)+2.5*Math.max(0,g-1)*Math.max(0,g-1),z}ft(0);const ht={rise:!0,graze:!0},pt=(a,s,z,g)=>{const D=a-oe.p.x,q=s-oe.p.z,re=D*oe.d.x+q*oe.d.z,$=q*oe.d.x-D*oe.d.z;return re>-4&&$>-z&&$<g},et=(a,s)=>Math.hypot(a,s)<118?.12:de(a,s)+.02,ke=[];if(ht.rise)for(let a=140,s=0;a<=245;a+=5.5,s++){const z=h.posAtDist(a),g=pe(a,new e.Vector3),D=s%2&&!pt(z.x+g.x*3,z.z+g.z*3,2,3)?1:-1,q=z.x+g.x*3*D,re=z.z+g.z*3*D;ke.push({x:q,z:re,g:et(q,re),top:4+8*(s*.755%1),T:16+9*((s*.618+.3)%1),ph:s*.381%1})}const Be=ke.length?Ie(Y,Fe,"lark",ke.map((a,s)=>({flap:[27,.95,s*.618%1,0],color:"#9A7B50"}))):null;Be&&l.add(Be);const xe=ht.graze?[nt(Y,7),nt(Y,4)]:null;if(xe){{const k=xe[0].geometry.attributes,Q=Math.cos(-1.36),S=Math.sin(-1.36);for(let G=0;G<k.position.count;G++){const E=k.position.getX(G)-.5,j=k.position.getY(G)-1.05,X=k.normal.getX(G),ie=k.normal.getY(G),we=R(.02,.3,E*.58+j*.81),be=1+(Q-1)*we,Me=S*we;k.position.setXY(G,.5+E*be-j*Me,1.05+E*Me+j*be),k.normal.setXY(G,X*be-ie*Me,X*Me+ie*be)}}let a=0,s=0;const z=(k,Q,S)=>{const G=h.posAtDist(k),E=pe(k,te);S.set(G.x+E.x*Q,0,G.z+E.z*Q);const j=Math.hypot(S.x,S.z);return Math.abs(j-118)<2.5&&S.multiplyScalar(115.5/j),S.y=et(S.x,S.z),S},g=[],D=(k,Q,S)=>{const G=Math.cos(Q),E=Math.sin(Q),j=(X,ie)=>{const we=X-k.x,be=ie-k.z,Me=Math.min(1.5*S,Math.max(-1.1*S,we*G+be*E));return Math.hypot(we-G*Me,be-E*Me)-.35*S};return!pt(k.x,k.z,3.2,4.2)&&Math.hypot(k.x,k.z)-H(Math.atan2(k.x,k.z)/n)>6&&Math.hypot(k.x-Pe.x,k.z-Pe.z)>12&&Ze.every(X=>j(X.p.x,X.p.z)>2.4)&&ke.every(X=>j(X.x,X.z)>1.55)&&g.every(X=>Math.hypot(k.x-X.x,k.z-X.z)>4.2)},q=(k,Q,S,G,E)=>(G?xe[0]:xe[1]).userData.set(G?a++:s++,k,Math.cos(Q),Math.sin(Q),S,E,0),re=_(oe.p)*v+15,$=_(Pe)*v-12;let ne=re;for(;ne<$&&Math.hypot(h.posAtDist(ne,M).x,M.z)>118;)ne+=.5;for(let k=0;k<10;k++){const Q=k<3?re+(ne-re)*(k+1)/4:ne+($-ne)*(k-2.5)/7,S=1.05+.1*(k*.381%1);let G=0,E=0;for(;G<20;G++){const j=Q+[0,2,-2,4,-4][G>>2],X=h.tangentAtDist(j);if(E=Math.atan2(X.z,X.x)+k*2.4,D(z(j,((k+G)%2?-1:1)*(5.6+2.4*((k+G*3)*.618%1)),M),E,S))break}if(G!==20){if(q(M,E,S,k%3!==1,k*1.7),k===6){for(const j of[1,-1])if(fe.set(M.x-Math.sin(E)*1.6*j,0,M.z+Math.cos(E)*1.6*j),fe.y=et(fe.x,fe.z),Math.abs(Math.hypot(fe.x,fe.z)-118)>2.5&&D(fe,E+.4,.62)){q(fe,E+.4,.62,!1,9.3),g.push(fe.clone());break}}g.push(M.clone())}}xe[0].count=a,xe[1].count=s;for(const k of xe)k.instanceMatrix.needsUpdate=!0,k.geometry.attributes.aGo.needsUpdate=!0,l.add(k)}let gt=0,Se=1;const Tt=new e.Vector3,ye=(a,s,z)=>{const g=Math.max(0,1-Math.abs(z-a)/s);return g*g*(3-2*g)};return{scene:l,path:h,duration:Math.round(v/16),title:r.name,pace:a=>1.18-.22*ye(O,.035,a)-.25*ye(ee,.035,a)-.3*ye(B,.05,a)-.28*ye(x-.015,.05,a)-.25*ye(Ue+.02,.04,a)-.3*ye(Ne+.015,.05,a)-.38*ye(Re-.012,.045,a)-.25*ye(Ae+.012,.04,a)-.45*R(P-.06,P,a)*(1-R(C+.005,C+.05,a))-.2*R(C+.005,C+.05,a),camera:{fov:62,near:.3,far:2400,lookAhead:22,bank:0,nearThrough:.3},pois:[{at:St,from:.045,to:.105,weight:.42,fade:.35},{at:()=>vt,from:ee-.05,to:ee+.03,weight:.4,fade:.3},{at:[0,30,0],from:B-.06,to:B+.045,weight:.7,fade:.3},{at:Pe,from:x-.085,to:x-.012,weight:.5,fade:.3},{at:[-6,15,-3],from:x-.005,to:Ue-.03,weight:.8,fade:.22},{at:Dt,from:Ue-.035,to:Ue+.05,weight:.6,fade:.3},{at:[-27.5,5.2,-9.5],from:Ne-.045,to:Ne+.035,weight:.75,fade:.3},{at:dt,from:Re-.04,to:Re+.014,weight:.8,fade:.36},{at:Nt,from:Ae-.045,to:Ae+.03,weight:.75,fade:.3},{at:[-27,1,6],from:Ae+.034,to:P-.03,weight:.8,fade:.3},{at:K.clone().setY(5),from:P-.036,to:F-.02,weight:.55,fade:.25},{at:b.stag.head.clone(),from:T-.045,to:T-.006,weight:.3},{at:b.moon.position.clone(),from:F-.022,to:C+.004,weight:.42,fade:.25}],portal:{shape:"circle",radius:7,color:"#FFE7A8",glow:1,revealDistance:240,blendDistance:30},post:{exposure:1,bloom:{strength:.5,radius:.6,threshold:1},grade:{saturation:1.08,contrast:1.03,tint:"#ffffff",shadowTint:"#0a1030",vignette:.28,grain:.02,aberration:0}},ride:"none",style:"none",update(a,s,z,g){const D=z.getWorldPosition(Tt),q=Math.max(1-R(-2,2,u.nightD(D,s)),Ct(D,s)),$=1+(.06+.8*(R(x,x+.03,g)*(1-R(Ne-.05,Ne,g))+.5*R(Ae-.045,Ae-.01,g)*(1-R(P-.05,P,g))))*q*(1-.45*R(C+.01,1,g));Se+=($-Se)*Math.min(1,a*2.5),(a>.5||Math.abs(g-gt)>.02)&&(Se=$),gt=g,W.uGain.value=Se,w.uStarAmb.value.copy(d.amb).multiplyScalar(Se),w.uMoonCol.value.copy(d.moon).multiplyScalar(Se);const ne=q*(1-.7*R(C,.995,g));l.fog.color.copy(rt).lerp(bt,ne),l.fog.density=.0012+(.0022+.003*r.mist)*ne,u.setProgress(R(T-.075,T-.03,g));const k=W.uTrees.value[le-1];if(c.rare){const S=84/v,G=180/v,E=(g-S)/(G-S),j=46*R(0,.22,E)*(1-R(.8,1,E)),X=S*v+34+Math.min(1,Math.max(0,E))*(G-S)*v*.8;h.posAtDist(X,M),pe(X,te);const ie=j*.9+3.5-5*Math.sin(Math.min(1,Math.max(0,E))*Math.PI);k.set(M.x+te.x*ie,M.z+te.z*ie,Math.max(1,j),Math.max(1,j*.4)),W.uTreeY.value[le-1]=de(k.x,k.y)}ft(g),u.update(a,s,z),w.uProgress.value=R(T-.075,T-.03,g),Ce.update(a,s,z),z.getWorldDirection(M),M.y=0,M.lengthSq()<1e-6&&M.set(0,0,-1),M.normalize(),Y.cen.near.value.set(D.x+M.x*17,D.z+M.z*17),Y.cen.far.value.set(D.x+M.x*48,D.z+M.z*48),t.renderer.getDrawingBufferSize(Qe),Y.uPx.value=z.projectionMatrix.elements[5]*Qe.y*.5,Y.starPx.value=Math.max(1,Qe.y/450);for(let S=0;S<2;S++){const G=Mt[S],E=G/v,j=R(E-.04,E-.008,g),X=R(E-.008,E+.05,g);h.posAtDist(G,M),pe(G,te);const ie=s*1.6+S*2,we=de(M.x,M.z)+.6+2.9*j+10*X+Math.sin(s*3.1+S)*.12;fe.set(M.x-te.x*2.4+Math.cos(ie)*.4,we,M.z-te.z*2.4+Math.sin(ie)*.4),De.set(-Math.sin(ie),.6+1.2*X,Math.cos(ie)),qe.userData.set(S,fe,.5,De)}qe.instanceMatrix.needsUpdate=!0;const Q=.05*17.5/v;for(let S=0;S<8;S++)lt(S,s,g,M),lt(S,s+.05,g+Q,te),Xe.userData.set(S,M,.56,te.sub(M),-.95+.35*Math.sin(s*1.7+S));Xe.instanceMatrix.needsUpdate=!0,ut(g,s,M),ut(g+Q,s+.05,te),Ee.userData.set(0,M,1.9,te.sub(M),.12),mt(g,s,Je),mt(g+Q,s+.05,te),Ee.userData.set(1,Je,2.1,te.sub(Je),.1),Ee.instanceMatrix.needsUpdate=!0;for(let S=0;S<je;S++)it(Ze[S],s,M),it(Ze[S],s+.05,te).sub(M),Oe.userData.set(S,M,.11,te);if(Oe.instanceMatrix.needsUpdate=!0,Be){for(let S=0;S<ke.length;S++){const G=ke[S],E=(s/G.T+G.ph)%1,j=R(0,.2,E),X=R(.7,.86,E),ie=s*1.6+S*2;fe.set(G.x+Math.cos(ie)*.3,G.g+.6+(G.top-.6)*j*(1-X)+Math.sin(s*3.1+S)*.12,G.z+Math.sin(ie)*.3),De.set(-Math.sin(ie),.35+5*j*(1-j)-3*X*(1-X),Math.cos(ie)),Be.userData.set(S,fe,.5,De)}Be.instanceMatrix.needsUpdate=!0}},dispose(){u.dispose(),Ce.dispose?.()}}}};export{ia as default};
