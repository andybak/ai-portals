import*as v from"three";import{clamp as T,lerp as X,smoothstep as Re}from"../kit/core.js";const P=Math.PI*2,ee=a=>{const e=new v.Color(a);return[e.r,e.g,e.b]},Te=(a,e)=>[a[0]*e,a[1]*e,a[2]*e],xt=(a,e,t)=>[a[0]+(e[0]-a[0])*t,a[1]+(e[1]-a[1])*t,a[2]+(e[2]-a[2])*t],ce=Te(ee("#f4ead2"),.74),he=Te(ee("#c2202b"),.7),j=ee("#ffd04a"),De=.55,Ne=.3,ue=[1,.74,.42],fe=[.9,.16,.3];async function tt(a,e,t,o,c){const s=new Float32Array(t*t);let f=1,h=0;for(let l=0;l<4;l++){const r=8<<l,n=new Float32Array(r*r);for(let i=0;i<r*r;i++)n[i]=a();const u=r/t;for(let i=0;i<t;i++){const m=i*u,d=Math.floor(m),b=m-d,g=b*b*(3-2*b),p=d%r*r,x=(d+1)%r*r;for(let w=0;w<t;w++){const y=w*u,S=Math.floor(y),F=y-S,q=F*F*(3-2*F),L=S%r,_=(S+1)%r,M=n[p+L],U=n[p+_],E=n[x+L],Se=n[x+_];s[i*t+w]+=f*(M+(U-M)*q+(E-M)*g+(M-U-E+Se)*q*g)}}h+=f,f*=.5,c&&await c()}for(let l=0;l<t*t;l++)e[l*4+o]=Math.round(T(s[l]/h,0,1)*255)}function at(a,e){const t=new v.DataTexture(a,e,e,v.RGBAFormat,v.UnsignedByteType);return t.wrapS=t.wrapT=v.RepeatWrapping,t.magFilter=v.LinearFilter,t.minFilter=v.LinearMipmapLinearFilter,t.generateMipmaps=!0,t.needsUpdate=!0,t}async function nt(a,e,t=128){const o=new Uint8Array(t*t*4);for(let c=0;c<4;c++)await tt(a,o,t,c,e);return{uTime:{value:0},uSun:{value:new v.Vector3(-.62,.42,.5).normalize()},uSunCol:{value:new v.Color(2.1,1.8,1.4)},uSky:{value:new v.Color(.42,.56,.8)},uGnd:{value:new v.Color(.3,.3,.16)},uFogCol:{value:new v.Color(.62,.78,.95)},uFogDen:{value:4e-4},uNight:{value:0},tNoise:{value:at(o,t)}}}const de=`
uniform vec3 uSun, uSunCol, uSky, uGnd, uFogCol; uniform float uFogDen, uTime, uNight; uniform sampler2D tNoise;
vec3 csFog(vec3 c, float d){ float f = 1. - exp(-d * d * uFogDen * uFogDen); return mix(c, uFogCol, clamp(f, 0., 1.)); }
vec3 csAmbient(vec3 n){ return mix(uGnd, uSky, clamp(n.y * .5 + .5, 0., 1.)); }
vec3 csEnv(vec3 r){
  float h = clamp(r.y, -1., 1.);
  vec3 sky = mix(uFogCol, uSky * 1.5, smoothstep(0., .7, h));
  return mix(uGnd * 1.3, sky, smoothstep(-.12, .06, h));
}
vec3 csShade(vec3 alb, vec3 shade, vec3 n, vec3 v, float gloss, float ao){
  float ndl = dot(n, uSun), dif = clamp(ndl * .8 + .2, 0., 1.);
  vec3 col = alb * uSunCol * dif * dif * mix(.6, 1., ao) + alb * shade * csAmbient(n) * ao;
  vec3 h = normalize(uSun + v + vec3(0., 1e-5, 0.));
  float ndh = clamp(dot(n, h), 0., 1.), ndv = clamp(dot(n, v), 0., 1.);
  float sp = pow(ndh, mix(10., 120., gloss)) * mix(.05, 1.1, gloss * gloss) * smoothstep(-.1, .15, ndl);
  float fr = pow(1. - ndv, 4.);
  vec3 rt = mix(vec3(1.), alb / max(max(alb.r, max(alb.g, alb.b)), .05), .6 * gloss);
  col += uSunCol * sp * ao * mix(vec3(1.), rt, .4) + csEnv(reflect(-v, n)) * rt * (fr * mix(.04, .5, gloss) + .045 * gloss) * ao;
  return col;
}`,ot=`
void csRotX(inout vec3 p, float a, vec3 piv){ float c = cos(a), s = sin(a); p -= piv; p = vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); p += piv; }
void csRotY(inout vec3 p, float a, vec3 piv){ float c = cos(a), s = sin(a); p -= piv; p = vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); p += piv; }
void csRotZ(inout vec3 p, float a, vec3 piv){ float c = cos(a), s = sin(a); p -= piv; p = vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z); p += piv; }
// heavy cloth in the wind of a run (k = how hard she runs): pressed against her in front, blown out and lifted
// behind, deep folds travelling round, the back of the hem snapping. The weight grows from the waist to the hem.
vec3 csSkirt(vec3 p, float k, float ph){
  float w = pow(clamp(1. - smoothstep(.9, 21., p.y), 0., 1.), 1.4);
  float ang = atan(p.x, p.z + 1e-4), t = uTime * 5. + ph, back = .5 - .5 * cos(ang), front = 1. - back;
  float fold = sin(ang * 6. - t * .8 + p.y * .25) * .1 + sin(ang * 9. + t * 1.4 - p.y * .4) * .045;
  float snap = sin(ang * 4. - t * 2.2) * .55 + sin(ang * 7. + t * 3.4) * .35;
  float rs = 1. + k * w * (.36 * back * back - .36 * front * front + fold * (.45 + back) + .07 * w * back * snap);
  vec3 q = vec3(p.x * rs, p.y, p.z * rs);
  q.z -= k * w * (1.2 + 4.4 * back * back);
  q.y += k * w * w * (.1 + 1.2 * back * back * back + .45 * back * snap);
  return q;
}
void csAnim(inout vec3 p, inout vec3 n, vec4 rig, vec4 an){
  vec3 piv = vec3(0., rig.y, rig.z), o = vec3(0.);
  if (rig.x > .5 && rig.x < 1.5) { csRotX(p, an.y, piv); csRotX(n, an.y, o); csRotY(p, an.x, piv); csRotY(n, an.x, o); }
  else if (rig.x > 1.5 && rig.x < 2.5) { csRotX(p, -an.z, piv); csRotX(n, -an.z, o); }
  else if (rig.x > 2.5 && rig.x < 3.5) {
    vec3 seat = vec3(0., rig.w, 0.);
    csRotZ(p, an.y, seat); csRotZ(n, an.y, o); csRotX(p, -an.z * .7, piv); csRotX(n, -an.z * .7, o);
  }
  else if (rig.x > 3.5 && rig.x < 4.5) {
    // the bell keeps its volume: the surface is moved as a whole and its normal taken from the moved surface
    vec3 tg = normalize(vec3(p.z, 0., -p.x) + vec3(1e-4, 0., 0.)), bt = normalize(cross(tg, n) + vec3(0., 1e-4, 0.));
    vec3 q = csSkirt(p, an.z, an.w), qa = csSkirt(p + tg * .3, an.z, an.w), qb = csSkirt(p + bt * .3, an.z, an.w);
    n = normalize(n * .02 - cross(qa - q, qb - q) * 11.); p = q;
  }
  else if (rig.x > 4.5 && rig.x < 5.5) {
    float a = rig.w * (an.x + an.y * sin(uTime * an.z + an.w)); vec3 pv = vec3(rig.y, 0., rig.z);
    csRotY(p, a, pv); csRotY(n, a, o);
  }
  else if (rig.x > 5.5 && rig.x < 6.5) {
    float a = rig.w * (an.x + an.y * sin(uTime * an.z + an.w)); vec3 pv = vec3(rig.z, rig.y, 0.);
    csRotZ(p, a, pv); csRotZ(n, a, o);
  }
  else if (rig.x > 6.5 && rig.x < 8.5) {
    // a leg of the fawn. At a walk each leg keeps its own phase (rig.w); in the bound (a wide swing, an.z over 0.5) the
    // forelegs go together and the hind legs against them, so the legs gather under the body and stretch out.
    // Part 7 is the thigh: it swings about the hip. Part 8 is the lower leg and hoof: it swings with its thigh about
    // the hip (2.05 m up, 0.92 m before or behind the middle) and bends at its own joint as the leg comes forward.
    float bound = smoothstep(.5, .8, an.z), ph = an.w + mix(rig.w, rig.z > 0. ? 0. : 3.1416, bound), a = an.z * sin(ph);
    if (rig.x > 7.5) {
      float b = sign(rig.z) * an.z * (1.2 + .7 * bound) * max(0., -cos(ph)); vec3 hip = vec3(0., 2.05, sign(rig.z) * .92);
      csRotX(p, b, piv); csRotX(n, b, o); csRotX(p, a, hip); csRotX(n, a, o);
    } else { csRotX(p, a, piv); csRotX(n, a, o); }
  }
}`,it=(a,e)=>`
attribute vec3 aCol; attribute vec2 aMat; attribute vec4 aRig;
${e?"attribute vec4 iCol, iShade, iAnim;":"uniform vec4 uICol, uIShade, uIAnim;"}
uniform float uTime;
varying vec3 vCol, vN, vW, vP; varying vec2 vMat; varying vec4 vICol, vIShade;
${a}
void main(){
  vec4 ic = ${e?"iCol":"uICol"}, ish = ${e?"iShade":"uIShade"}, an = ${e?"iAnim":"uIAnim"};
  vec3 p = position, n = normal;
  csAnim(p, n, aRig, an);
  mat4 m = modelMatrix;
  #ifdef USE_INSTANCING
    m = modelMatrix * instanceMatrix;
  #endif
  vec4 w = m * vec4(p, 1.);
  vN = normalize(mat3(m) * n + vec3(0., 1e-6, 0.)); vW = w.xyz; vP = position;
  vCol = aCol; vMat = aMat; vICol = ic; vIShade = ish;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,st=a=>`
${de}
varying vec3 vCol, vN, vW, vP; varying vec2 vMat; varying vec4 vICol, vIShade;
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-6, 0.)); if (!gl_FrontFacing) n = -n;
  vec3 toCam = cameraPosition - vW; float dist = length(toCam); vec3 v = toCam / max(dist, 1e-3);
  float id = vMat.x, gloss = vMat.y, ao = 1., eng = 1.;
  vec3 alb = vCol, shade = vec3(1.), col;
  ${a||""}
  if (id < .5) {
    ao = clamp(max(vCol.r, max(vCol.g, vCol.b)), 0., 1.);
    // A CHESSMAN'S SURFACE, from the piece's own shape (local metres): the lathe's rings round the turning, coarse and
    // fine; rims and beads (where the surface turns fast and stands proud) worn; grooves (where the profile lies
    // inside its neighbours) dark. Red: deep lacquer, darker in the grooves, worn to the wood on the rims. White: old
    // ivory, honey in the hollows, hairline cracks running up it. A band of green baize under every base.
    float white = step(.25, vICol.g), ang = atan(vP.x, vP.z + 1e-4) * .15915, hy = vP.y, nearK = 1. - smoothstep(60., 220., dist);
    vec2 gq = vec2(ang, hy * .11), fq = vec2(ang * 2., hy * .9);
    float gr = texture2D(tNoise, gq).r, grU = texture2D(tNoise, gq + vec2(0., .004)).r, fine = texture2D(tNoise, fq).g, fineU = texture2D(tNoise, fq + vec2(0., .02)).g;
    float curv = length(fwidth(n)) / max(length(fwidth(vP)), 1e-4);
    float edge = smoothstep(.2, .7, curv) * smoothstep(.7, .98, ao), groove = clamp((1. - ao) * 1.8, 0., 1.);
    n = normalize(n + vec3(0., ((gr - grU) * 4. + (fine - fineU) * 2. * nearK), 0.) * .5);
    vec3 base = vICol.rgb;
    if (white > .5) {
      alb = base * (.84 + .24 * gr + .1 * (fine - .5) * nearK);
      alb = mix(alb, base * vec3(.8, .56, .27), groove * .85);
      vec2 cq = vec2(ang * 3., hy * .035); float cn = texture2D(tNoise, cq).b, cf = fwidth(cn);
      float crack = (1. - smoothstep(0., cf + .0015, abs(cn - .5))) * smoothstep(.5, .66, texture2D(tNoise, cq * .37 + .21).a) * (1. - smoothstep(.02, .09, cf));
      alb *= 1. - .5 * crack;
      alb = mix(alb, base * vec3(1.1, 1.06, .98), edge * .5);
      gloss = vICol.a * (1. - .6 * groove);
    } else {
      alb = base * (.78 + .34 * gr);
      alb = mix(alb, base * vec3(.42, .3, .34), groove);
      float worn = edge * smoothstep(.3, .62, fine * .5 + gr * .5);
      alb = mix(alb, vec3(.5, .31, .14) * (.8 + .5 * fine), worn * .8);
      gloss = vICol.a * (1. - .8 * worn) * (.85 + .3 * gr);
    }
    float baize = 1. - smoothstep(.55, .7, hy);
    alb = mix(alb, vec3(.025, .15, .055) * (.7 + .6 * fine), baize); gloss *= 1. - baize;
    shade = vIShade.rgb;
    col = csShade(alb, shade, n, v, gloss, ao);
    // self light at night: white pieces glow all over, red ones (negative glow) stand in lamp light from their feet
    float gl = abs(vIShade.a), lampK = mix(1.5, .3, smoothstep(0., 30., vP.y));
    col += vIShade.a < 0. ? (alb * 1.7 + vec3(.04, .008, .0)) * vec3(1., .5, .3) * gl * lampK : alb * 1.15 * gl * (.55 + .45 * clamp(n.y * .5 + .5, 0., 1.));
    // the low sun catches a bright edge on the side it shines from
    col += (alb * .7 + .12) * uSunCol * pow(1. - clamp(dot(n, v), 0., 1.), 3.) * clamp(dot(n, uSun) + .3, 0., 1.) * .45 * ao * (1. - uNight);
    // no lit face clips to white: what is brighter than 1 is drawn in to a third of its excess
    float pm = max(col.r, max(col.g, col.b)); col *= pm > 1. ? (1. + (pm - 1.) * .33) / pm : 1.;
  } else if (id < 1.5) {
    float pg = 1. - step(.9, vICol.g);                                 // gilding on a chessman, not the crown's own gold
    float faz = (floor(atan(n.x, n.z + 1e-5) / .5236) + .5) * .5236, fel = (floor(asin(clamp(n.y, -1., 1.)) / .5236) + .5) * .5236;
    n = normalize(mix(n, vec3(sin(faz) * cos(fel), sin(fel), cos(faz) * cos(fel)), .6 * pg));
    vec3 r = reflect(-v, n);
    float ndh = clamp(dot(n, normalize(uSun + v + vec3(0., 1e-5, 0.))), 0., 1.);
    float hy = clamp(r.y, -1., 1.), gl = clamp(dot(n, uSun), 0., 1.), hm = texture2D(tNoise, vP.xz * .23 + vP.y * .19).r;
    vec3 envc = mix(uGnd * .5, mix(uFogCol * 1.1, uSky * .8, smoothstep(.05, .75, hy)), smoothstep(-.3, .04, hy + (hm - .5) * .25));
    col = vCol * eng * (envc * 1.15 + uSunCol * (pow(ndh, 50.) * 1.5 + .34 * gl * gl) + csAmbient(n) * .1);
    col += vCol * vec3(1., .55, .2) * pow(1. - clamp(dot(n, v), 0., 1.), 3.) * .25 + vCol * uNight * .25 + uSunCol * pow(ndh, 160.) * 1.2 * pg;
  } else if (id < 2.5) {
    col = csShade(vCol * vICol.rgb * .32, vIShade.rgb, n, v, .3, 1.);
  } else if (id < 3.5) {
    col = csShade(alb, shade, n, v, gloss, 1.) + alb * max(vIShade.a, 0.);
  } else if (id < 4.5) {
    float ndh = clamp(dot(n, normalize(uSun + v + vec3(0., 1e-5, 0.))), 0., 1.);
    float tw = .5 + .5 * sin(uTime * 3. + vP.x * 3.1 + vP.y * 2.3 + vP.z * 1.7);
    col = vCol * (.55 + .5 * clamp(dot(n, uSun), 0., 1.) + .5 * tw) + uSunCol * pow(ndh, 40.) * 1.5 + vCol * pow(1. - clamp(dot(n, v), 0., 1.), 2.) * .8;
  } else if (id < 5.5) {
    col = vCol * gloss;
  } else if (id > 7.5) {
    // a coat with a nap: fine hairs lying along the body, lighter and darker in drifts, pale dapples on the back; no
    // gloss, and a soft fringe of light where the coat turns away
    vec2 hq = vec2(vP.x * 2.3 + vP.y * 1.9, vP.z * .45);
    float nap = texture2D(tNoise, hq * 1.7).r, nap2 = texture2D(tNoise, hq * 6.1).g, drift = texture2D(tNoise, vP.zy * .13).b;
    alb = vCol * (.7 + .4 * nap + .25 * (nap2 - .5)) * (.82 + .36 * drift);
    alb = mix(alb, vec3(.86, .78, .62), smoothstep(.6, .68, texture2D(tNoise, vec2(vP.z * .21 + vP.x * .07, vP.y * .27)).a) * gloss * .75);
    vec3 nn = normalize(n + vec3(nap - .5, 0., nap2 - .5) * .6);
    float ndl = dot(nn, uSun), dif = clamp(ndl * .7 + .3, 0., 1.);
    col = alb * (uSunCol * dif * dif + csAmbient(nn) * 1.15) + alb * (uSunCol * .45 + uSky) * pow(1. - clamp(dot(n, v), 0., 1.), 2.5) * .55 + alb * max(vIShade.a, 0.);
  } else if (id > 6.5) {
    alb = vCol * vICol.rgb;
    col = csShade(alb, vec3(1.), n, v, .22, 1.) + alb * uSunCol * clamp(-dot(n, uSun), 0., 1.) * .4;
    // A WHITE PETAL in this sun would stand three times over the page's white: its light is drawn in above 0.45 so
    // that its brightest face stays under 0.92 (albedo and light together) and its shaded side and its folds still
    // tell; the whiter the petal the more (a red or orange petal keeps its light)
    float pm = max(col.r, max(col.g, col.b)), wh = min(alb.r, min(alb.g, alb.b)) / max(max(alb.r, max(alb.g, alb.b)), 1e-3);
    col *= mix(1., pm > .45 ? (.45 + .47 * (1. - exp(-(pm - .45) / .47))) / pm : 1., smoothstep(.3, .6, wh));
  } else {
    vec2 q = vW.xz + vW.y * vec2(.61, .37);
    float lf = texture2D(tNoise, q * .045).g, lf2 = texture2D(tNoise, q * .21).b, lf3 = texture2D(tNoise, q * .83).r, tuft = lf2 * .55 + lf3 * .45;
    alb = vCol * (.55 + .7 * lf) * mix(.34, 1.3, smoothstep(.3, .66, tuft));
    alb = mix(alb, alb * vec3(1.7, 1.4, .7), smoothstep(.6, .8, lf3) * .45);
    // may blossom on a hawthorn hedge (gloss 1 marks it): white sprays in drifts, a paler cast far off
    float mayK = gloss * smoothstep(.4, .62, lf);
    alb = mix(alb, vec3(.95, .92, .88), mayK * smoothstep(.63, .7, texture2D(tNoise, q * .9).a) * .95);
    vec3 nn = normalize(n + (vec3(lf2, lf3, lf) - .5) * 1.2);
    float ndl = dot(nn, uSun), dif = clamp(ndl * .7 + .3, 0., 1.);
    col = alb * (uSunCol * dif * dif + csAmbient(nn) * .95);
    col += alb * uSunCol * vec3(.5, .7, .2) * clamp(-ndl, 0., 1.) * .25;
  }
  gl_FragColor = vec4(csFog(col, dist), 1.);
}`;function te(a,e={}){const t=e.instanced!==!1,o={...a,...e.uniforms||{}};return t||(o.uICol={value:new v.Vector4(1,1,1,.3)},o.uIShade={value:new v.Vector4(1,1,1,0)},o.uIAnim={value:new v.Vector4(0,0,0,0)}),new v.ShaderMaterial({uniforms:o,vertexShader:it(e.anim||ot,t),fragmentShader:st(e.fragExtra),side:e.side??v.FrontSide})}const Ue=new v.Matrix3,V=new v.Vector3;class ae{constructor(){this.P=[],this.N=[],this.C=[],this.M=[],this.R=[],this.I=[],this.count=0,this._c=[1,1,1],this._m=[3,.2],this._r=[0,0,0,0],this._x=null}col(e,t=1){return this._c=[e[0]*t,e[1]*t,e[2]*t],this}mat(e,t=.2){return this._m=[e,t],this}rig(e=0,t=0,o=0,c=0){return this._r=[e,t,o,c],this}xf(e){return this._x=e||null,e&&Ue.setFromMatrix4(e),this}at(e,t,o,c=0,s=0,f=0,h=1){return this.xf(new v.Matrix4().compose(new v.Vector3(e,t,o),new v.Quaternion().setFromEuler(new v.Euler(c,s,f,"YXZ")),new v.Vector3(h,h,h)))}v(e,t,o,c,s,f,h=1,l){this._x&&(V.set(e,t,o).applyMatrix4(this._x),e=V.x,t=V.y,o=V.z,V.set(c,s,f).applyMatrix3(Ue.setFromMatrix4(this._x)).normalize(),c=V.x,s=V.y,f=V.z);const r=this._c,n=this._r;return this.P.push(e,t,o),this.N.push(c,s,f),this.C.push(r[0]*h,r[1]*h,r[2]*h),this.M.push(this._m[0],this._m[1]),this.R.push(n[0],n[1],n[2],l===void 0?n[3]:l),this.count++}grid(e,t,o,c={}){const s=e+1,f=t+1,h=new Array(s*f),l=this.count,r=c.flip?-1:1;for(let n=0;n<f;n++)for(let u=0;u<s;u++)h[n*s+u]=o(u/e,n/t);for(let n=0;n<f;n++)for(let u=0;u<s;u++){const i=u>0?u-1:c.wrapU?e-1:0,m=u<e?u+1:c.wrapU?1:e,d=h[n*s+i],b=h[n*s+m],g=h[Math.max(n-1,0)*s+u],p=h[Math.min(n+1,t)*s+u],x=h[n*s+u],w=b[0]-d[0],y=b[1]-d[1],S=b[2]-d[2],F=p[0]-g[0],q=p[1]-g[1],L=p[2]-g[2];let _=y*L-S*q,M=S*F-w*L,U=w*q-y*F;const E=Math.hypot(_,M,U);E<1e-12?(_=0,M=c.poleY??1,U=0):(_*=r/E,M*=r/E,U*=r/E),this.v(x[0],x[1],x[2],_,M,U,x[3]??1,x[4])}for(let n=0;n<t;n++)for(let u=0;u<e;u++){const i=l+n*s+u,m=i+1,d=i+s+1,b=i+s;c.flip?this.I.push(i,d,m,i,b,d):this.I.push(i,m,d,i,d,b)}return this}lathe(e,t,o={}){const c=this.latheSteps(e,t,o);for(;!c.next().done;);return this}*latheSteps(e,t,o={}){const c=e.prims.reduce((f,h)=>f+h.pts.length,0);let s=0;for(const f of e.prims){const h=f.pts,l=h.length-1,r=s;s+=h.length,f.mat&&this.mat(f.mat[0],f.mat[1]),f.rig&&this.rig(...f.rig);const n=this._c;f.mat&&f.mat[0]===1&&(this._c=j),this.grid(t,l,(u,i)=>{const m=Math.round(i*l),d=h[m],b=u*P;let g=d[0],p=d[1],x=d[2]??1,w;if(o.mod){const y=o.mod(b,g,p,(r+m)/c);g=y[0],p=y[1],y[2]!==void 0&&(x*=y[2]),w=y[3]}return[Math.sin(b)*g,p,Math.cos(b)*g,x,w]},{wrapU:!0,poleY:h[l][0]<.05?1:-1}),this._c=n,yield}}tube(e,t,o=8,c={}){const s=e.length-1,f=[];let h=new v.Vector3(0,0,1);for(let r=0;r<=s;r++){const n=e[Math.max(r-1,0)],u=e[Math.min(r+1,s)],i=new v.Vector3(u[0]-n[0],u[1]-n[1],u[2]-n[2]).normalize();Math.abs(i.dot(h))>.95&&(h=new v.Vector3(1,0,0));const m=new v.Vector3().crossVectors(h,i).normalize(),d=new v.Vector3().crossVectors(i,m).normalize();h=d,f.push([m,d])}const l=r=>typeof t=="function"?t(r):t;return this.grid(o,s+2,(r,n)=>{const u=T(Math.round(n*(s+2))-1,0,s),i=n===0||n===1,m=r*P,d=i?.001:l(u/s),b=e[u],g=f[u],p=Math.cos(m)*d,x=Math.sin(m)*d;return[b[0]+g[0].x*p+g[1].x*x,b[1]+g[0].y*p+g[1].y*x,b[2]+g[0].z*p+g[1].z*x,c.shade??1]},{wrapU:!0})}blob(e,t,o=12,c=8,s={}){return this.grid(o,c,(f,h)=>{const l=f*P,r=(T(h,.004,.996)-.5)*Math.PI,n=Math.cos(r),u=Math.sin(l)*n,i=Math.sin(r),m=Math.cos(l)*n,d=s.f?s.f(u,i,m):1;return[e[0]+u*t[0]*d,e[1]+i*t[1]*d,e[2]+m*t[2]*d,s.shade?s.shade(u,i,m):1]},{wrapU:!0})}box(e,t,o=1){const c=t[0]/2,s=t[1]/2,f=t[2]/2,h=[[1,0,0,0,1,0,0,0,1],[-1,0,0,0,1,0,0,0,-1],[0,1,0,0,0,1,1,0,0],[0,-1,0,0,0,1,-1,0,0],[0,0,1,1,0,0,0,1,0],[0,0,-1,-1,0,0,0,1,0]];for(const[l,r,n,u,i,m,d,b,g]of h){const p=[c,s,f],x=[l*p[0],r*p[1],n*p[2]],w=[u*p[0],i*p[1],m*p[2]],y=[d*p[0],b*p[1],g*p[2]],S=[];for(const[F,q]of[[-1,-1],[1,-1],[1,1],[-1,1]])S.push(this.v(e[0]+x[0]+F*w[0]+q*y[0],e[1]+x[1]+F*w[1]+q*y[1],e[2]+x[2]+F*w[2]+q*y[2],l,r,n,o));this.I.push(S[0],S[1],S[2],S[0],S[2],S[3])}return this}poly(e,t=1){const o=e[0],c=e[1],s=e[2],f=new v.Vector3(c[0]-o[0],c[1]-o[1],c[2]-o[2]).cross(new v.Vector3(s[0]-o[0],s[1]-o[1],s[2]-o[2])).normalize(),h=e.map(l=>this.v(l[0],l[1],l[2],f.x,f.y,f.z,t,l[3]));for(let l=1;l<h.length-1;l++)this.I.push(h[0],h[l],h[l+1]);return this}get triangles(){return this.I.length/3}build(){const e=new v.BufferGeometry;return e.setAttribute("position",new v.Float32BufferAttribute(this.P,3)),e.setAttribute("normal",new v.Float32BufferAttribute(this.N,3)),e.setAttribute("aCol",new v.Float32BufferAttribute(this.C,3)),e.setAttribute("aMat",new v.Float32BufferAttribute(this.M,2)),e.setAttribute("aRig",new v.Float32BufferAttribute(this.R,4)),e.setIndex(this.count>65535?new v.Uint32BufferAttribute(this.I,1):new v.Uint16BufferAttribute(this.I,1)),e.computeBoundingSphere(),e}}function me(a=1){const e=[];let t=0,o=0,c=null,s=null;const f=r=>Math.max(1,Math.round(r*(a>.5?1:a<-1.5?.15:a<0?.25:.4))),h=r=>{e.push({pts:r,mat:c,rig:s});const n=r[r.length-1];t=n[0],o=n[1]},l={prims:e,at(r,n){return t=r,o=n,l},mat(r,n){return c=[r,n],l},rig(...r){return s=r,l},line(r,n){return h([[t,o],[r,n]]),l},curve(r,n,u,i=6){const m=r-t,d=n-o,b=(t+r)/2+d*u,g=(o+n)/2-m*u,p=f(i),x=[];for(let w=0;w<=p;w++){const y=w/p,S=1-y;x.push([Math.max(.001,S*S*t+2*S*y*b+y*y*r),S*S*o+2*S*y*g+y*y*n])}return h(x),l},ball(r,n,u,i,m=8){const d=f(m),b=[];for(let g=0;g<=d;g++){const p=X(u,i,g/d);b.push([Math.max(.001,n*Math.cos(p)),r+n*Math.sin(p)])}return h(b),l},bead(r,n,u){const i=t;return l.line(r,o+n*.18),l.curve(r,o+n*.82,.5,4),l.line(u??i,o+n*.18),l},shade(r=2.2,n=.55){const u=[];for(const i of e)for(const m of i.pts)u.push(m);for(const i of u){let m=i[0];for(const d of u)Math.abs(d[1]-i[1])<r&&(m=Math.max(m,d[0]));i[2]=1-n*T((m-i[0])/(r*1.1),0,1)}return l}};return l}function Ee(a,e){const t=(s,f)=>(s||[]).join()===(f||[]).join(),o=[];for(const s of a.prims){const f=o[o.length-1];f&&t(f.mat,s.mat)&&t(f.rig,s.rig)?f.pts.push(...s.pts.slice(1)):o.push({pts:s.pts.slice(),mat:s.mat,rig:s.rig})}const c=(s,f,h,l)=>{const r=s[f],n=s[h],u=n[0]-r[0],i=n[1]-r[1],m=Math.hypot(u,i)||1;let d=0,b=-1;for(let g=f+1;g<h;g++){const p=Math.abs((s[g][0]-r[0])*i-(s[g][1]-r[1])*u)/m;p>d&&(d=p,b=g)}b>0&&d>e&&(c(s,f,b,l),l[b]=!0,c(s,b,h,l))};for(const s of o){const f=s.pts.map(()=>!1);f[0]=f[s.pts.length-1]=!0,c(s.pts,0,s.pts.length-1,f),s.pts=s.pts.filter((h,l)=>f[l])}return a.prims.length=0,a.prims.push(...o),a}const We=.4,Le=.8,Fe={king:{h:48,r:9.5,head:31.8},queen:{h:45,r:9,head:30.2},bishop:{h:37,r:8,head:25},knight:{h:34,r:8.5,head:7},rook:{h:30,r:8.5,head:22.4},pawn:{h:22,r:6.5,head:14.3}},ne=(a,e)=>a.at(.001,0).line(e*.97,0).line(e,.4).curve(e*.97,2,.34,5).line(e*.85,2.35).curve(e*.75,3.5,.3,4).line(e*.68,3.8),_e=(a,e,t,o=1)=>a.line(t*1.85,e+.5*o).curve(t*1.85,e+2.3*o,.5,5).line(t*1.1,e+2.8*o).line(t*1.42,e+3.3*o).curve(t*1.42,e+4.4*o,.5,4).line(t*1.05,e+4.8*o);function oe(a,e,t,o=.3,c=1){a.mat(2,.3);for(const s of[-1,1])a.blob([Math.sin(s*o)*t,e,Math.cos(s*o)*t],[.42*c,.62*c,.3*c],6,4);a.mat(0,0)}function Ve(a,e=1){const t=Ge(a,e);for(;;){const o=t.next();if(o.done)return o.value}}async function rt(a,e,t){const o=Ge(a,e);for(;;){const c=o.next();if(c.done)return c.value;await t()}}function*Ge(a,e=1){const t=new ae,o=e>.5,c=e<-1.5,s=e<-2.25,f=e<-2.75,h=o?24:f?4:c?5:e<0?6:10,l=Fe[a],r=l.r,n=me(e),u=i=>t.latheSteps(s?Ee(n,f?Le:We):n,h,i);if(t.mat(0,0).rig(0),a==="pawn")ne(n,r).curve(2.4,12.2,-.2,10).line(4.4,12.6).curve(4.4,13.9,.5,5).line(2.6,14.3),n.rig(1,l.head,0,0).ball(18.2,3.9,-.84,1.565,12).shade(),yield*u(),o&&(t.rig(1,l.head,0,0),oe(t,18.9,3.75,.33,.9));else if(a==="rook"){ne(n,r).curve(5.3,9,-.2,6).line(5.15,12.4).bead(5.6,.9,5.1).line(5,16.6).bead(5.45,.9,4.95).line(4.9,20).line(6.6,20.6).curve(6.6,22,.5,4).line(5.6,22.4),n.rig(1,l.head,0,0).curve(7.1,24,-.18,4).line(7.1,26.4).line(5.5,26.4).line(5.5,25.6).line(.001,25.6).shade(1.6,.5),yield*u(),t.rig(1,l.head,0,0);const i=6,m=o?4:1;for(let d=0;d<i;d++){const b=(d+.2)/i*P,g=(d+.8)/i*P,p=(x,w,y)=>{const S=X(b,g,y);return[Math.sin(S)*x,w,Math.cos(S)*x]};t.grid(m,1,(x,w)=>p(7.1,X(26.4,29.9,w),x)),t.grid(m,1,(x,w)=>p(5.5,X(26.4,29.9,w),x),{flip:!0}),t.grid(m,1,(x,w)=>p(X(7.1,5.5,w),29.9,x)),t.poly([p(7.1,26.4,0),p(5.5,26.4,0),p(5.5,29.9,0),p(7.1,29.9,0)]),t.poly([p(5.5,26.4,1),p(7.1,26.4,1),p(7.1,29.9,1),p(5.5,29.9,1)])}if(o){t.mat(2,.3);for(const d of[-1,1])t.blob([Math.sin(d*.34)*7,25,Math.cos(d*.34)*7],[.34,1,.3],6,4);t.rig(0),t.blob([0,5.4,r*.7],[1.1,1.9,.5],8,5),t.mat(0,0)}}else if(a==="bishop")ne(n,r).curve(2.6,20.2,-.2,12),_e(n,20.2,2.6),n.rig(1,l.head,0,0).curve(4.5,28.4,.2,6).curve(.95,34.3,.2,9).ball(35.6,1.3,-.82,1.565,6).shade(),yield*u({mod:(i,m,d)=>{const b=Math.cos(i)*m;return(d>26&&d<33.5&&b>0?Math.abs(d-28-b*.95):9)<.5?[m*.86,d,.12]:[m,d]}}),o&&(t.rig(1,l.head,0,0),oe(t,27.4,4.1,.36));else if(a==="king"||a==="queen"){const i=a==="king",m=i?27:25.4,d=i?3.2:3,b=l.head;ne(n,r).curve(d,m,-.2,12),_e(n,m,d),n.rig(1,b,0,0).curve(i?5.9:5.7,b+6.6,-.13,7),n.mat(1,.8).bead(i?6.5:6.2,1.5,i?5.3:5.1).mat(0,0);const g=b+6.6+1.5*.18+.2;if(i?n.curve(.9,g+2.6,.26,6).line(.001,g+2.6):n.curve(1,g+2.9,.3,6).mat(1,.8).ball(g+4.1,1.5,-.8,1.565,6).mat(0,0),n.shade(),yield*u(),t.rig(1,b,0,0),i)t.mat(1,.8).col(j),t.box([0,g+4.9,0],[1.2,5.6,1.2]),t.box([0,g+5.5,0],[4.2,1.2,1.2]),t.col([1,1,1]).mat(0,0);else{const p=o?9:c?4:e<0?5:6;for(let x=0;x<p;x++){const w=(x+.5)/p*P,y=Math.sin(w),S=Math.cos(w);t.mat(0,0).tube([[y*5.5,g-.6,S*5.5],[y*6,g+1.4,S*6],[y*6.5,g+3.2,S*6.5]],F=>.95-.7*F,o?6:c?3:4),t.mat(1,.8).col(j).blob([y*6.55,g+3.5,S*6.55],[.62,.62,.62],o?6:c?3:4,o?4:c?2:3).col([1,1,1])}t.mat(0,0)}o&&oe(t,b+3.6,i?4.75:4.6,.3)}else a==="knight"&&(ne(n,r).curve(6.3,5.2,-.15,4).line(7.1,5.6).curve(7.1,6.6,.5,4).line(6.1,7).line(.001,7).shade(1.5,.4),yield*u(),yield*lt(t,o,e));return t.build()}function*lt(a,e,t=0){const o=t<-1.5,c=t<-2.25,s=t<-2.75,f=e?14:s?3:o?4:t<0?5:7,h=e?9:s?2:t<0?3:5,l=e?8:t<0?3:5,r=[2,7,-4.2,0];a.mat(0,0).rig(...r);const n=(i,m,d)=>1-.12*Math.max(0,-m);a.blob([0,15.6,0],[3.3,3.5,6.8],f,h,{f:n,shade:(i,m)=>.72+.28*T(m+.9,0,1)}),a.blob([0,16.4,-4.6],[3.2,3.6,3.4],f,h),a.blob([0,16.6,4.6],[3,3.8,3.2],f,h),yield;for(const i of[-1,1])a.tube(s?[[i*2,15.4,-5],[i*2.2,7.15,-4.2]]:[[i*2,15.4,-5],[i*2.3,11.6,-6],[i*2.2,9.4,-4.4],[i*2.2,7.15,-4.2]],m=>1.75-1*m,l,{shade:.86}),a.tube(s?[[i*1.9,15.2,5],[i*2,7.15,5.8]]:[[i*1.9,15.2,5],[i*2,12,6.4],[i*2,9.6,5.6],[i*2,7.15,5.8]],m=>1.5-.85*m,l,{shade:.86}),s||a.tube([[i*.95,27.9,7.5],[i*1.25,29.9,7.1]],m=>.55-.42*m,o?3:5);if(yield,a.tube([[0,17.2,4.8],[0,20.6,6.4],[0,24.2,7.6],[0,26.6,8.6]],i=>3-1.1*i,l+2),a.at(0,26.6,9.9,.62,0,0).blob([0,0,0],[1.55,1.95,3.5],f,h,{f:(i,m,d)=>1-.25*Math.max(0,d)}),a.xf(null),e)for(let i=0;i<8;i++){const m=i/7,d=i%2?1:-1;a.at(d*.5,X(27.6,18.4,m),X(7.4,3.3,m),-.9,d*.5,0).blob([0,0,0],[.75,1.9,.6],6,4,{shade:(b,g)=>.5+.35*T(g+.5,0,1)}),a.xf(null)}else s||(a.at(0,22.6,5.2,-.36,0,0).blob([0,0,0],[.55,4.9,1.7],o?3:5,h,{shade:()=>.6}),a.xf(null));if(a.tube(s?[[0,17.2,-6.6],[0,12.6,-10.4],[0,9.4,-9.8]]:[[0,17.2,-6.6],[0,16.4,-9.4],[0,12.6,-10.4],[0,9.4,-9.8]],i=>1.15-.8*i,l,{shade:.7}),a.mat(1,.7).col(j).blob([0,19,-.9],[3,1,3],f,o?3:5).col([1,1,1]).mat(0,0),e){a.mat(2,.3);for(const i of[-1,1])a.blob([i*1.42,27.5,9.3],[.3,.42,.42],6,4);a.mat(0,0)}yield,a.rig(3,r[1],r[2],19.4);const u=me(e?1:t).at(.001,19.3).line(2.7,19.3).curve(1.5,24.3,-.12,5).line(2.3,24.6).curve(2.3,25.5,.5,3).line(1.35,25.8).ball(27.6,2.05,-.85,1.565,7).shade(1.4,.5);a.at(0,0,-.9),yield*a.latheSteps(c?Ee(u,s?Le:We):u,e?16:s?4:o?5:7),a.mat(1,.8).col(j).blob([0,30.2,0],[.7,.9,.7],o?4:6,o?2:4).col([1,1,1]).mat(0,0),a.tube([[2.9,19.8,.4],[3.2,27,1.6],[3.5,34,2.8]],i=>.4-.2*i,o?3:5),e&&oe(a,27.9,1.95,.4,.55),a.xf(null).rig(0)}function ct(a){const e=new v.BufferGeometry;for(const[t,o]of Object.entries(a.attributes))o.isInstancedBufferAttribute||e.setAttribute(t,o);return e.setIndex(a.index),e.boundingSphere=a.boundingSphere,e.boundingBox=a.boundingBox,e.userData=a.userData,e}const ve=new v.Matrix4,pe=new v.Quaternion,ge=new v.Euler(0,0,0,"YXZ"),Xe=new v.Vector3,Ke=new v.Vector3;function ht(a,e){const t=e.count,o=e.geometry||Ve(e.kind,e.detail??1),c=Fe[e.kind]||null,s=new v.InstancedBufferAttribute(new Float32Array(t*4),4),f=new v.InstancedBufferAttribute(new Float32Array(t*4),4),h=new v.InstancedBufferAttribute(new Float32Array(t*4),4);h.setUsage(v.DynamicDrawUsage),o.setAttribute("iCol",s),o.setAttribute("iShade",f),o.setAttribute("iAnim",h);const l=new v.InstancedMesh(o,e.material||te(a),t);return l.frustumCulled=!1,l.instanceMatrix.setUsage(v.DynamicDrawUsage),{kind:e.kind,K:c,mesh:l,geometry:o,count:t,iAnim:h,color(n,u,i=0,m=1){const d=u?ce:he,b=u?ue:fe;s.setXYZW(n,d[0]*m,d[1]*m,d[2]*m,u?Ne:De),f.setXYZW(n,b[0],b[1],b[2],i),s.needsUpdate=!0,f.needsUpdate=!0},tint(n,u,i=.3,m=0){s.setXYZW(n,u[0],u[1],u[2],i),f.setXYZW(n,1,1,1,m),s.needsUpdate=!0,f.needsUpdate=!0},place(n,u,i,m,d=0,b=0,g=0,p=1,x=1){ge.set(b,d,g),pe.setFromEuler(ge);const w=x/Math.sqrt(Math.max(p,.2));ve.compose(Xe.set(u,i,m),pe,Ke.set(w,x*p,w)),l.setMatrixAt(n,ve)},anim(n,u,i,m,d=0){h.setXYZW(n,u,i,m,d)},commit(){l.instanceMatrix.needsUpdate=!0,h.needsUpdate=!0},twin(n,u=0,i=Ve(e.kind,u)){const m=ct(i);m.setAttribute("iAnim",h);const d=new v.InstancedMesh(m,n,t);return d.instanceMatrix=l.instanceMatrix,d.frustumCulled=!1,d}}}const be=[.1,.045],xe=[.55,.35],Oe=a=>Math.pow(T(1-Re(.9,21,a),0,1),1.4),Be=(a,e,t,o,c,s,f)=>{const h=Oe(e),l=1-c,r=1+o*h*(.36*c*c-.36*l*l+s*(.45+c)+.07*h*c*f);return[a*r,e+o*h*h*(.1+1.2*c*c*c+.45*c*f),t*r-o*h*(1.2+4.4*c*c)]},wt=(a,e,t,o,c)=>{const s=Math.atan2(a,t+1e-4),f=.5-.5*Math.cos(s);return Be(a,e,t,o,f,Math.sin(s*6-c*.8+e*.25)*be[0]+Math.sin(s*9+c*1.4-e*.4)*be[1],Math.sin(s*4-c*2.2)*xe[0]+Math.sin(s*7+c*3.4)*xe[1])},ut=(a,e,t=1)=>-Be(0,e,-a,t,1,be[0]+be[1],xe[0]+xe[1])[2];function Ye(a,e){const t=new v.CircleGeometry(1,20).rotateX(-Math.PI/2),o=new v.ShaderMaterial({uniforms:a,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4,vertexShader:"varying vec2 vQ; varying vec3 vW; void main(){ vQ = position.xz; vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`${de} varying vec2 vQ; varying vec3 vW; void main(){ float a = 1. - smoothstep(.35, 1., length(vQ)); gl_FragColor = vec4(vec3(.03, .05, .12), a * .55 * (1. - clamp(1. - exp(-pow(length(cameraPosition - vW) * uFogDen, 2.)), 0., 1.))); }`}),c=new v.InstancedMesh(t,o,e);return c.frustumCulled=!1,c.renderOrder=.6,{mesh:c,place(s,f,h,l,r,n){const u=Math.hypot(n.x,n.z)||1,i=T(1.2/Math.max(n.y,.2),1,3.2);ge.set(0,Math.atan2(-n.x/u,-n.z/u),0),pe.setFromEuler(ge),ve.compose(Xe.set(f-n.x/u*r*(i-1)*.8,h+.12,l-n.z/u*r*(i-1)*.8),pe,Ke.set(r,1,r*i)),c.setMatrixAt(s,ve),c.instanceMatrix.needsUpdate=!0}}}function ft(a,e={}){const t=e.length??84,o=e.width??3.6,c=e.height??3.6,s=e.steps??28,f=e.around??6,h=new ae,l=[a.range(0,9),a.range(0,9),a.range(0,9)],r=e.color||[.032,.125,.036],n=u=>T((P/u/(t/s)-3)/3,0,1);return h.mat(6,1).col(r).rig(0),h.grid(s,f,(u,i)=>{const m=(u-.5)*t,d=(i-.5)*Math.PI,b=Math.min(1,Math.min(u,1-u)*s*.9),p=(1+.2*n(.53)*Math.sin(m*.53+l[0]+d*2.1)+.16*n(1.31)*Math.sin(m*1.31+l[1]-d*1.7)+.12*n(2.9)*Math.sin(m*2.9+l[2]+d*2.6)+.08*n(5.3)*Math.sin(m*5.3+l[0]*3-d*2.2))*Math.sqrt(b)+.02,x=Math.sin(d),w=Math.max(0,Math.cos(d));return[Math.sign(x)*Math.pow(Math.abs(x),.62)*o*.5*p,Math.pow(w,.55)*c*p,m,.5+.5*w,w]}),h.build()}const H={hem:11.3,band:9.6,waist:24.4,head:29.2};function dt(){const a=me(1),e=H.waist,t=H.head;a.at(H.hem+.1,-.7).line(H.hem,.9).curve(11,2.3,.5,4).line(10.4,2.6).curve(7.5,H.band,-.1,7).bead(8,1,7.2).curve(5,17.2,-.1,7).bead(5.5,.9,4.8).curve(2.9,e,-.08,7);const o=a.prims.length;_e(a,e,2.9);const c=a.prims.length;a.rig(1,t,0,0).curve(5.7,t+6.6,-.13,7);const s=a.prims[a.prims.length-1].pts,f=s[s.length-1][1]+1.5*.18+.2;a.mat(1,.8).bead(6.2,1.5,5.1).mat(0,0),a.curve(1,f+2.9,.3,6).mat(1,.8).ball(f+4.1,1.5,-.8,1.565,6).mat(0,0).shade();let h=0,l=e,r=0;for(let n=o;n<c;n++)for(const u of a.prims[n].pts)h=Math.max(h,u[0]);for(let n=o;n<c;n++)for(const u of a.prims[n].pts)u[0]>h-1e-6&&(l=Math.max(l,u[1]));for(const n of a.prims)for(const u of n.pts)r=Math.max(r,u[1]);return{P:a,yr:f,collar:l,crown:r,skirtEnd:o}}const Z=dt(),N={...H,collar:Z.collar,crown:Z.crown},we=[.05,.02];function*$e(a=!1){const e=new ae,t=Z.P,o=N.waist,c=N.head,s=Z.yr;e.mat(0,0).rig(4,0,0,0),yield*e.latheSteps(t,a?20:64,{mod:(h,l,r)=>{if(r>o)return[l,r];const n=Math.pow(1-Re(.9,21,r),1.4);return[l*(1+we[0]*n*Math.sin(h*10)+we[1]*n*Math.sin(h*17+1)),r,1-.16*n*(.5-.5*Math.sin(h*10)),n]}});const f=me(1).at(.001,0).line(5,0).line(5.15,.45).curve(5,2,.34,5).line(4.4,2.4).curve(3.4,9.5,-.12,6).line(3,17);e.mat(0,0).rig(0),yield*e.latheSteps(f,a?8:20,{mod:(h,l,r)=>[l,r,.6]}),e.rig(1,c,0,0);for(let h=0;h<(a?0:9);h++){const l=(h+.5)/9*P,r=Math.sin(l),n=Math.cos(l);e.mat(0,0).tube([[r*5.5,s-.6,n*5.5],[r*6.1,s+1.6,n*6.1],[r*6.7,s+3.8,n*6.7]],u=>1-.75*u,6),e.mat(1,.8).col(j).blob([r*6.75,s+4.1,n*6.75],[.68,.68,.68],6,4).col([1,1,1])}return e.mat(0,0),a||oe(e,c+3.6,4.6,.3),e.rig(0).mat(0,0),e.tube([[2.4,o+2.9,.4],[4.4,o+1.6,5.2],[4.9,o+3.6,10.4]],h=>1.05-.4*h,a?4:7).blob([5,o+4.1,11.3],[.85,.85,1.1],a?4:7,a?3:5),e.tube([[-2.4,o+2.9,.2],[-5,o-.6,-1.6],[-5.8,o-2.6,-5.6]],h=>1.05-.4*h,a?4:7).blob([-5.9,o-3,-6.4],[.85,.85,1],a?4:7,a?3:5),e.build()}const ie=45,Me=[26,44],ye=[3,7],je=Me[1]+ye[1]/2,mt=a=>`
void csAnim(inout vec3 p, inout vec3 n, vec4 rig, vec4 an){
  float zc = mod(rig.y - uTime * rig.w + ${(ie*a).toFixed(3)}, ${(2*ie*a).toFixed(3)}) - ${(ie*a).toFixed(3)}, k = (1. - smoothstep(${(Me[0]*a).toFixed(3)}, ${(Me[1]*a).toFixed(3)}, abs(zc))) * an.x;
  p.z += zc - rig.y; p.x = rig.z + (p.x - rig.z) * k; p.y *= k;
}`,Mt=1.5,vt=31,yt=(()=>{let a=0;for(let e=0;e<Z.skirtEnd;e++)for(const t of Z.P.prims[e].pts)t[1]<=N.waist&&(a=Math.max(a,ut(t[0]*(1+(we[0]+we[1])*Oe(t[1])),t[1])));return{skirt:a,dust:N.hem+vt,straws:je}})(),pt=`
attribute vec4 aRig; attribute vec2 aMat; attribute vec3 aCol; uniform float uTime, uK, uTrail; varying vec3 vN, vW, vCol; varying float vA, vKind;
void main(){
  float f = fract(uTime * (.2 + .1 * aMat.y) + aRig.x), s = 1.; vec3 c;
  float rim = sqrt(max(0., ${(N.hem*N.hem).toFixed(2)} - aRig.y * aRig.y));
  if (aMat.x < .5) { s = .5 + 1.5 * f; c = vec3(aRig.y * (1. + .2 * f), .8 * s + aRig.z * f * (1.3 - f), -rim - (2. + aRig.w * f) * uTrail - 2. * f); }
  else c = vec3(aRig.y * (1. + .15 * f), .3 + aRig.z * 4. * f * (1. - f), -rim * .8 - (2. + .5 * aRig.w * f) * uTrail);
  vec4 w = modelMatrix * vec4(c + position * s, 1.);
  vA = f; vKind = aMat.x; vCol = aCol; vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.));
  gl_Position = projectionMatrix * viewMatrix * w;
}`,gt=`
${de}
uniform float uK; varying vec3 vN, vW, vCol; varying float vA, vKind;
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-5, 0.)), tc = cameraPosition - vW; float d = length(tc), ndv = clamp(dot(n, tc / max(d, 1e-3)), 0., 1.);
  float nz = texture2D(tNoise, vW.xz * .11 + vW.y * .07).r, top = clamp(n.y * .5 + .5, 0., 1.), k = clamp(uK, 0., 1.);
  // lit on top (sun and sky; the sun comes through a puff, so its far side is not black), shaded beneath
  vec3 lit = uSunCol * (.4 + .4 * clamp(dot(n, uSun) * .6 + .4, 0., 1.)) * (.3 + .5 * top) + csAmbient(n) * mix(.5, 1., top);
  // a billow has a body: whole but for its very rim, it thins away only as it settles
  float a = smoothstep(0., .5, ndv) * smoothstep(0., .08, vA) * pow(1. - vA, .9) * (.7 + .3 * nz) * .82 * k;
  if (vKind > .5) a = k * (1. - smoothstep(.85, 1., vA)) * smoothstep(0., .04, vA);
  gl_FragColor = vec4(csFog(vCol * lit, d), a);
}`,He=(a,e,t)=>T(a*e,-t,t)*(1-Re(Math.PI/2,Math.PI,Math.abs(a)));async function St(a,e={}){const t=e.rng||a.rng.fork("queen"),o=!e.env,c=e.env||await nt(a.rng.fork("env"),()=>a.yield()),s=e.side??1,f=e.pawnAt||[-15*s,5],h=e.hedgeAt||[17*s,-2],l=new v.Group,r=new v.Group;l.add(r);const n=te(c,{instanced:!1,side:v.DoubleSide});n.uniforms.uICol.value.set(he[0],he[1],he[2],De),n.uniforms.uIShade.value.set(fe[0],fe[1],fe[2],0);const u=$e();let i=null;for(;;){const C=u.next();if(C.done){i=C.value;break}await a.yield()}const m=new v.Mesh(i,n);m.name="queen",m.frustumCulled=!1,r.add(m);const d=$e(!0);let b=null;for(;;){const C=d.next();if(C.done){b=C.value;break}await a.yield()}await a.yield();const g=te(c,{instanced:!1});g.uniforms.uICol.value.set(ce[0],ce[1],ce[2],Ne),g.uniforms.uIShade.value.set(ue[0],ue[1],ue[2],0);const p=new v.Mesh(await rt("pawn",1,()=>a.yield()),g);p.frustumCulled=!1,p.scale.setScalar(.62),l.add(p);const x=new v.Mesh(ft(t,{length:34,steps:28,around:8,height:4.6,width:4.2}),te(c,{instanced:!1,side:v.DoubleSide}));x.frustumCulled=!1,l.add(x);const w=new ae,y=ee("#f1e3a0"),S=ee("#7fb04a"),F=T(((e.strawReach??je)-ye[1]/2)/Me[1],.25,1);for(let C=0;C<40;C++){const A=t.range(-22,22),R=t.range(-ie,ie)*F,I=.2+.7*Math.pow(t(),2.2),k=t.range(ye[0],ye[1]),z=t.range(.08,.16),O=t.range(34,60);w.mat(5,t.range(.22,.42)).col(t.chance(.6)?y:S).rig(9,R,A,O),w.poly([[A-z,I,R-k/2],[A+z,I,R-k/2],[A+z,I+.02,R+k/2],[A-z,I+.02,R+k/2]])}const q=te(c,{instanced:!1,anim:mt(F),side:v.DoubleSide}),L=new v.Mesh(w.build(),q);L.frustumCulled=!1,l.add(L),await a.yield();const _=new ae,M=e.dustRng||t.fork("dust"),U=[.9,.85,.74],E=[.07,.13,.04],Se=[.17,.11,.06];for(let C=0;C<30;C++){_.mat(0,M()).col(U,M.range(.9,1.08)).rig(C/30+M.range(-.02,.02),M.range(-.7,.7)*N.hem,M.range(2,5),M.range(18,27));const A=M.range(1.6,2.2);_.blob([0,0,0],[A,A*.85,A],7,5);for(let R=0;R<2;R++){const I=M.range(0,P),k=M.range(.9,1.4);_.blob([Math.sin(I)*1.2,M.range(-.1,.6),Math.cos(I)*1.2],[k,k*.9,k],6,4)}}for(let C=0;C<26;C++){const A=C%2===1;_.mat(1,M()).col(A?[.8,.7,.36]:M.chance(.5)?E:Se,M.range(.8,1.2)).rig(C/26+M.range(-.03,.03),M.range(-.8,.8)*N.hem,M.range(2,5),M.range(14,30)),_.at(0,0,0,M.range(-1.2,1.2),M.range(0,P),0).blob([0,0,0],A?[.05,.05,M.range(.6,1.1)]:[M.range(.22,.4),M.range(.12,.2),M.range(.2,.36)],4,3).xf(null)}const ze=new v.ShaderMaterial({uniforms:{...c,uK:{value:1},uTrail:{value:1}},vertexShader:pt,fragmentShader:gt,transparent:!0,depthWrite:!1}),Ce=new v.Mesh(_.build(),ze);Ce.frustumCulled=!1,Ce.renderOrder=1,r.parent.add(Ce);const K=e.contact??!0?Ye(c,2):null;K&&l.add(K.mesh);let se=null;(e.ground??o)&&(se=new v.Mesh(new v.CircleGeometry(60,48).rotateX(-Math.PI/2),new v.ShaderMaterial({uniforms:c,transparent:!0,depthWrite:!1,vertexShader:"varying vec3 vL, vW; void main(){ vL = position; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`${de} varying vec3 vL, vW;
        void main(){
          float s = texture2D(tNoise, vec2(vL.x * .06, vL.z * .004 + uTime * .55)).r, s2 = texture2D(tNoise, vec2(vL.x * .21, vL.z * .011 + uTime * 1.3)).g;
          vec3 c = mix(vec3(.16, .3, .08), vec3(.62, .58, .26), smoothstep(.35, .7, s * .6 + s2 * .4));
          c = c * (uSunCol * max(uSun.y, .1) * .3 + uSky * .35);
          float a = 1. - smoothstep(22., 58., length(vL.xz));
          gl_FragColor = vec4(csFog(c, length(cameraPosition - vW)), a);
        }`})),se.position.y=.15,se.renderOrder=.4,l.add(se)),await a.yield();let Q=null,Ae=null;if(e.family??o){const C=["king","queen","bishop","knight","rook","pawn"];Q=[],Ae=Ye(c,6),l.add(Ae.mesh);for(let A=0;A<C.length;A++){const R=ht(c,{kind:C[A],count:1});l.add(R.mesh),Q.push(R);const I=Math.PI+(A-2.5)*.62,k=38;R.color(0,A%2===0),R.home=[[Math.sin(I)*k,Math.cos(I)*k,I+Math.PI+.5]],Ae.place(A,Math.sin(I)*k,0,Math.cos(I)*k,Fe[C[A]].r*1.25,c.uSun.value),await a.yield()}}const W=new v.Vector3,D={speed:1,streak:1,lead:f[1],pawn:1},Ze=t.range(0,P),Qe=t.range(0,P),J=t.range(0,P);return{object:l,radius:40,height:N.crown,center:new v.Vector3(0,20,-4),ground:!0,groundY:0,queen:m,pawn:p,hedge:x,queenMaterial:n,pawnMaterial:g,env:c,queenShadowGeometry:b,anchors:{gaze:new v.Vector3(0,24,0),pawn:new v.Vector3(f[0],0,f[1]),hedge:new v.Vector3(h[0],0,h[1])},setSpeed(C,A=C,R=f[1],I=C){D.speed=C,D.streak=A,D.lead=R,D.pawn=I},update(C,A,R,I){o&&(c.uTime.value=A);const k=D.speed,z=A,O=z*5.2+Ze,Pe=Math.abs(Math.sin(O));r.rotation.set((.05+.012*Math.cos(O*2))*k+.006*Math.sin(z*2.3),0,.022*Math.sin(O)*k),r.position.set(.5*Math.sin(z*1.55),.3+.3*Pe*k,0),I?(W.copy(I),l.worldToLocal(W)):W.set(0,0,1),n.uniforms.uIAnim.value.set(He(Math.atan2(W.x,W.z),.55,.9)+.08*Math.sin(z*.9),(.13+.05*Math.cos(O*2))*k,k,1.7),ze.uniforms.uK.value=k,ze.uniforms.uTrail.value=D.streak,q.uniforms.uIAnim.value.x=D.streak;const ke=Math.abs(Math.sin(z*6.4+Qe)),Ie=D.pawn;if(p.position.set(f[0]+.8*Math.sin(z*1.1),.2+.75*ke*Ie,D.lead+1.6*Math.sin(z*.7)),p.rotation.set((.36+.07*ke)*Ie,.2*Math.sin(z*.8),.06*Math.sin(z*3.2)),g.uniforms.uIAnim.value.set(He(Math.atan2(W.x-f[0],W.z-D.lead),.6,.6),.12+.1*Math.sin(z*1.9),0,0),x.position.set(h[0]+.4*Math.sin(z*1.3+J),.25*Math.abs(Math.sin(z*4.3+J)),h[1]+1.2*Math.sin(z*.9+J)),x.rotation.set(.03*Math.sin(z*4.3+J),0,.03*Math.sin(z*2.1+J)),K&&K.place(0,r.position.x,0,.6,N.hem*1.15-.6*Pe*k,c.uSun.value),K&&K.place(1,p.position.x,0,p.position.z+.6,4.3-.7*ke*Ie,c.uSun.value),Q)for(let re=0;re<Q.length;re++){const B=Q[re];for(let G=0;G<1;G++){const Y=B.home[G],$=re*1.7+G*2.9,Je=W.x-Y[0],et=W.z-Y[1];B.place(G,Y[0],0,Y[1],Y[2],.03*Math.sin(z*.8+$),.03*Math.sin(z*.63+$*2),1+.015*Math.sin(z*1.7+$));let le=Math.atan2(Je,et)-Y[2];if(le=Math.atan2(Math.sin(le),Math.cos(le)),B.kind==="knight"){const qe=Math.pow(Math.max(0,Math.sin(z*.7+$)),3);B.anim(G,0,.16*Math.sin(z*1.9+$)+.25*qe*Math.sin(z*3.3),.42*qe,0)}else B.anim(G,T(le,-1.2,1.2),.07+.06*Math.sin(z*1.3+$),0,0)}B.commit()}},dispose(){}}}export{de as CS_COMMON,Mt as DUST_REACH,vt as DUST_TAIL,Ne as GLOSS_IVORY,De as GLOSS_LACQUER,j as GOLD,ae as Geo,ce as IVORY,ue as IVORY_SHADE,Fe as PIECES,ot as PIECE_ANIM,me as Prof,he as RED,fe as RED_SHADE,N as RUNNER,yt as RUN_WAKE,P as TAU,St as buildHero,ft as hedgeGeometry,ee as lin,Ye as makeBlobs,nt as makeEnv,te as makeLit,ht as makePieces,xt as mixc,Te as mulc,He as neck,ct as ownGeometry,Ve as pieceGeometry,rt as pieceGeometryAsync,wt as skirtAt,ut as skirtReach};
