import*as r from"three";import{makePath as Po,clamp as et,smoothstep as b,lerp as Lt}from"../kit/core.js";import*as ce from"../kit/fx.js";import{buildHero as Vo,makeSphereGeo as It,ENV_GLSL as Do,NOISE_GLSL as qo}from"../parts/bubble-skin.js";const Go={afternoon:{title:"Skin of a Bubble",palette:["#0F2A1C","#E8308C","#19C3D6","#F2B93B","#F4F1E6","#6FB34A","#05080A"],sunElev:50,sunColor:"#fff6e4",sunGlow:"#fff2cf",flowers:["#f6a9c6","#fbe9ee"],lawn:1,dome:1,flow:1,post:{exposure:1.05,tint:"#fffdf6",shadow:"#03100a",sat:1.1},portal:"#fff1c4",mote:["#fff3c9","#ffffff","#d8f0a0"]},golden:{title:"Skin of a Bubble, Golden Hour",palette:["#241808","#E8308C","#19C3D6","#F2B93B","#F3D9A2","#D99A32","#070504"],sunElev:20,sunColor:"#ffab52",sunGlow:"#ff9a3c",flowers:["#ff9d6e","#ffd9a6"],lawn:.7,dome:1,flow:1,post:{exposure:1.05,tint:"#fff0dc",shadow:"#140803",sat:1.12},portal:"#ffcf8a",mote:["#ffc46a","#ffe6b0","#ff9a4a"]},dusk:{title:"Skin of a Bubble, Garden Lights",palette:["#0A1634","#E8308C","#19C3D6","#F2B93B","#CBD6F4","#34508C","#03040A"],sunElev:40,sunColor:"#141c38",sunGlow:"#1c2a55",flowers:["#5a5fae","#9aa4e0"],lawn:.35,dome:1.15,flow:.9,lamps:!0,post:{exposure:1.2,tint:"#f0f2ff",shadow:"#03051a",sat:1.08},portal:"#ffc98a",mote:["#ffc070","#9ab0ff","#ffe0b0"]},frost:{title:"Skin of a Bubble, Frost Morning",palette:["#172B3D","#E8308C","#19C3D6","#F2B93B","#F3F8FF","#B9D6EC","#05080C"],sunElev:28,sunColor:"#f2f8ff",sunGlow:"#eaf4ff",flowers:["#d8e8f6","#ffffff"],lawn:1.5,dome:1,flow:.4,frost:!0,post:{exposure:1,tint:"#f4faff",shadow:"#061220",sat:1.02},portal:"#dff2ff",mote:["#ffffff","#dcefff","#bfe0ff"]}};var Eo={id:"bubble-skin",name:"Skin of a Bubble",category:"domestic",weirdness:.35,media:["air","tiny"],async build(m){const L=m.rng,Ve=m.vary||{},de=m.quality?.detail??1,Y=et(Ve.density??1,.7,1.3),n=(e,t,o)=>new r.Vector3(e,t,o),g=e=>new r.Color(e),C=L.fork("variation"),ue=Ve.hour||"any";let X=C.pick(["afternoon","afternoon","golden","dusk","frost"]);ue==="golden"?X="golden":ue==="night"?X="dusk":ue==="dawn"?X="frost":ue==="day"&&(X=C.chance(.7)?"afternoon":"frost");const l=Go[X],tt=C.chance(.3)?C.range(.05,.3):C.chance(.4)?C.range(.75,1):C.range(.3,.75),Kt=C.pick(["bee","bee","dragonfly","thistle"]),Et=C.pick([0,0,1,2]),Ot=!!Ve.rare,De=35,k=new r.Scene;k.background=g(l.palette[0]);const qe=(l.sunElev+C.range(-4,4))*Math.PI/180,ot=C.range(-.12,.12),G=n(Math.sin(ot)*Math.cos(qe),Math.sin(qe),Math.cos(ot)*Math.cos(qe)).normalize(),T=await Vo(m,{palette:l.palette,duration:De,age:tt,sunDir:G,sunColor:l.sunColor,satellites:1,frost:!!l.frost,lamps:!!l.lamps,rimSpeed:165,progress:0});k.add(T.object),await m.yield();const v=T.anchors,y=T.R,u=v.bubbleCenter,Wt=v.pole,h=Po(v.flyThrough);await m.yield();{const e=v.flyThrough[2],t=v.flyThrough[3].clone().sub(e).normalize(),o=e.clone().addScaledVector(t,20).sub(u).normalize(),a=e.clone().sub(o.clone().multiplyScalar(y).add(u)).normalize(),s=o.clone().multiplyScalar(2*o.dot(a)).sub(a).normalize();s.y>.12&&s.y<.97&&(T.env.uWin.value.copy(s),T.env.uWinX.value.set(0,1,0).cross(s).normalize())}const x=T.burstU,fe=n(0,1,0),_={value:0};let pe=.6;{const e=n();let t=1e9;for(let o=0;o<=400;o++){const a=h.pointAt(o/400,e).distanceTo(v.satellite.flank);a<t&&(t=a,pe=o/400)}}const z=h.length,at=n(),Rt=n(),te=e=>{let t=1e18,o=0;for(let a=0;a<=z;a+=.5){const s=h.posAtDist(a,at).distanceToSquared(e);s<t&&(t=s,o=a)}return o},Ge=(e,t=0)=>{for(let o=t;o<=z;o+=.5)if(e(h.posAtDist(o,at)))return o;return z},he=n(),st=n(),Ut=(e,t)=>{const o=he.subVectors(t,e).length();he.divideScalar(Math.max(o,1e-6));const a=he.dot(st.subVectors(e,u)),s=a*a-(st.lengthSq()-y*y);if(s<=0)return!0;const i=-a-Math.sqrt(s);return!(i>0&&i<o)};let O=null;T.object.traverse(e=>{const t=!O&&e.material&&e.material.uniforms&&e.material.uniforms.uVort;t&&(O=t.value[t.value.length-2])});const Ht=Ge(e=>{const t=he.subVectors(e,u).normalize();return 2*(1-(t.x*O.x+t.y*O.y+t.z*O.z))<O.w*O.w}),jt=te(v.flyThrough[2]),Fe=te(v.flyThrough[4]),Nt=te(v.flyThrough[6]),Be=te(v.flyThrough[7]),_e=v.satellite.center,Yt=h.posAtDist(Be,Rt).distanceTo(_e),Xt=Ge(e=>Ut(e,_e)),$t=Ge(e=>e.distanceTo(_e)>Yt,te(v.flyThrough[8]));await m.yield();const Qt=T.env,W=Object.assign({},Qt,{uEnvWin:{value:0},uEnvWall:{value:new r.Vector2(.4,1)},uGain:{value:l.dome*.55},uLawn:{value:l.lawn},uFl0:{value:g(l.flowers[0])},uFl1:{value:g(l.flowers[1])},uGlow:{value:g(l.sunGlow)},uPink:{value:g("#ff6fae").lerp(g(l.flowers[0]),X==="afternoon"?.35:.7)},uSeedD:{value:C.range(0,50)},uGardenAz:{value:Math.atan2(h.startTangent.x,h.startTangent.z)+C.range(-.35,.35)},uSunK:{value:l.lamps?.15:1},uPc:{value:n(0,-1e4,0)},uPr:{value:y},uThru:{value:1},uDown:{value:l.frost?.6:l.lamps?0:.92},uGardenAz2:{value:Math.atan2(v.heading.x,v.heading.z)+C.range(-.12,.12)}}),me=new r.Mesh(new r.SphereGeometry(5200,48,32),new r.ShaderMaterial({uniforms:W,side:r.BackSide,depthWrite:!1,depthTest:!1,defines:l.lamps?{BS_LAMPS:1}:{},vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`precision highp float;
${qo}${Do}
uniform float uGain, uLawn, uSeedD, uGardenAz, uGardenAz2, uSunK, uPr, uThru, uDown;
uniform vec3 uPc;
uniform vec3 uFl0, uFl1, uGlow, uPink;
varying vec3 vD;
float dAng(float a, float b){ return abs(mod(a - b + 3.14159, 6.28318) - 3.14159); }
void main(){
  vec3 r = normalize(vD);
  float up = r.y;
  float az = atan(r.x, abs(r.z) + abs(r.x) < 1e-5 ? 1e-5 : r.z);
  vec3 c = bsEnv(r) * uGain;
  // POLISH L1: what stands behind the planet is seen through two skins: its bright discs are dimmed there,
  // so the bokeh stays behind the film and is never read as lying on it
  float pb = dot(r, uPc), pd = pb * pb - dot(uPc, uPc) + uPr * uPr;
  float feat = 1.0 - 0.72 * uThru * step(0.0, pb) * smoothstep(0.0, 5000.0, pd);
  // sunlit lawn a long way down, mottled
  float lw = smoothstep(-0.1, -0.6, up);
  vec2 lp = r.xz / max(-up, 0.12) + vec2(uTime * 0.004, 0.0);
  float mot = bsNoise(vec3(lp * 0.9, uSeedD)) * 0.65 + bsNoise(vec3(lp * 2.6, uSeedD + 3.0)) * 0.35;
  c *= mix(1.0, 0.75 + 2.6 * mot * mot * uLawn, lw);
  c += uShade * 2.0 + vec3(0.014);                                             // the floor of the picture is deep shade green, never black
  c += uShade * 0.22 * smoothstep(0.25, -0.5, up);                // tree shade dappling the lawn
  float pool = smoothstep(0.5, 0.78, mot) * (0.8 + 0.2 * sin(uTime * 0.7 + mot * 30.0));   // pools of sun on the grass, leaf shadows stirring
  c += (uLeaf * 0.3 + uGlow * 0.07) * uLawn * uSunK * lw * pool;
  // the hedge: a dark band on the garden side
  float gs = smoothstep(1.2, 0.6, dAng(az, uGardenAz));
  c *= 1.0 - 0.3 * gs * smoothstep(0.1, 0.0, up) * smoothstep(-0.26, -0.08, up);
  c = mix(vec3(dot(c, vec3(0.3, 0.55, 0.15))), c, 0.78);          // the tone curve deepens dark greens: keep them leaf, not neon
  // the exit looks into the deep of the garden: a tall dark hedge mass with a soft scalloped top, and the
  // tree's own shade pooled on the lawn straight beneath the bubble, so the rim and the droplets burn on darkness
  float g2 = smoothstep(1.5, 0.45, dAng(az, uGardenAz2));
  float top2 = 0.1 + 0.07 * sin(az * 5.0 + uSeedD) + 0.04 * sin(az * 13.0 + uSeedD * 2.0 + 0.3 * sin(uTime * 0.4 + az * 3.0));
  float deep = max(g2 * smoothstep(top2 + 0.1, top2 - 0.06, up) * (0.82 - 0.3 * smoothstep(-0.3, -0.8, up)), 0.78 * smoothstep(-0.3, -0.8, up));
  vec3 dk = uShade * (1.7 + 2.6 * mot * mot * lw) + vec3(0.006) + (uLeaf * 0.11 + uGlow * 0.03) * uSunK * uLawn * lw * smoothstep(0.62, 0.84, mot);   // POLISH L2: dark lawn with a few pools of sun, so the droplets and the rim burn on darkness
#ifdef BS_LAMPS
  // DUSK REPAIR: under the garden lights the deep of the garden is the one of before L2 (these two lines as they were), the
  // masses below are not laid and the dark floor is off (uDown 0): see the header
  deep = max(g2 * smoothstep(top2 + 0.1, top2 - 0.06, up) * (0.82 - 0.3 * smoothstep(-0.3, -0.8, up)), 0.6 * smoothstep(-0.35, -0.85, up));
  dk = uShade * (2.3 + 1.5 * mot * lw) + vec3(0.008);
#endif
  c = mix(c, dk, deep);
#ifndef BS_LAMPS
  // POLISH L2: the backdrop is deep shade with blurred masses in it (dark boughs, lit foliage), not one flat green
  float ms = bsNoise(r * 2.1 + uSeedD) * 0.6 + bsNoise(r * 4.7 + uSeedD * 1.7) * 0.4;
  c *= mix(0.64, 1.25, smoothstep(0.28, 0.72, ms)) * (0.74 + 0.26 * smoothstep(0.0, 0.5, abs(up)));
  c += uLeaf * 0.085 * uSunK * smoothstep(0.6, 0.86, ms) * smoothstep(-0.25, 0.25, up);
#endif
  // hollyhock spires far out of focus (POLISH L2): each a tall soft column of pink-white rising out of the dark
  // of the hedge, and over it the lens's own discs, all one size for one distance, overlapping, each with a
  // slightly brighter rim (they were chains of separate grey-pink discs hanging in the air)
  for (int i = 0; i < 12; i++) {                                  // seven where the entry looks, five against the dark where the exit looks
    float fi = float(i);
    float a0 = i < 7 ? uGardenAz + (fi - 3.0) * 0.36 + 0.2 * sin(fi * 5.1 + uSeedD) : uGardenAz2 + (fi - 9.0) * 0.3 + 0.1 * sin(fi * 5.1 + uSeedD);
    float top = 0.2 + 0.2 * fract(sin(fi * 12.9 + uSeedD) * 43.7);
    float da0 = dAng(az, a0);
    if (da0 < 0.2 && up > -0.5 && up < top + 0.1) {
      float sway = 0.012 * sin(uTime * 0.6 + fi * 1.9);
      float sgn = mod(az - a0 + 9.42478, 6.28318) - 3.14159;       // signed azimuth offset from the spire
      float tt = clamp((up + 0.3) / (top + 0.3), 0.0, 1.0);
      float wv = 0.05 - 0.028 * tt, xs = sgn - sway * tt;
      float body = exp(-xs * xs / (wv * wv)) * smoothstep(-0.46, -0.16, up) * (1.0 - smoothstep(top - 0.1, top + 0.06, up));
      vec3 fcol = mix(uPink, uFl0, 0.35);
      float gk = i < 7 ? 1.0 : 0.62;
      c = mix(c, c * 0.5 + fcol * (0.24 + 0.14 * tt), body * 0.72 * feat * gk);
      c = mix(c, c * 0.4 + uLeaf * 0.05, exp(-xs * xs / 0.012) * smoothstep(-0.1, -0.4, up) * 0.5 * feat);   // its leaves, a darker green mass at the foot
      float rad = 0.034 + 0.012 * fract(sin(fi * 3.7 + uSeedD) * 17.3);
      for (int k = 0; k < 11; k++) {
        float fk = float(k), hk = fract(sin(fi * 7.7 + fk * 3.1 + uSeedD) * 91.3), h2 = fract(hk * 13.7 + 0.3);
        float y = mix(-0.2, top, (fk + 0.6 * hk) / 11.0);
        vec2 e = vec2(sgn - (hk - 0.5) * 0.075 * (1.0 - 0.5 * fk / 11.0) - sway * (fk / 11.0), up - y);
        float d = length(e);
        float disc = (1.0 - smoothstep(rad * 0.93, rad, d)) * (0.62 + 0.38 * smoothstep(rad * 0.62, rad * 0.96, d));
        c += mix(fcol, uFl1, step(0.7, h2)) * disc * feat * gk * (0.035 + 0.075 * h2) * (0.75 + 0.25 * sin(uTime * 0.5 + hk * 30.0));
      }
    }
  }
  // washing line: pale sheets lifting slowly
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float a0 = uGardenAz + 2.55 + fi * 0.2;
    float lift = 0.07 * (0.5 + 0.5 * sin(uTime * 0.5 + fi * 1.7));
    float da = dAng(az, a0 + lift * 0.6 * (0.02 - up) * 8.0);
    float sh = smoothstep(0.16, 0.0, da) * smoothstep(-0.3 + lift, -0.06 + lift, up) * smoothstep(0.16, -0.1, up - 0.012 * sin(az * 40.0 + uTime));
    float fold = 0.75 + 0.25 * sin(az * 34.0 + up * 9.0 + uTime * 0.6 + fi * 2.0);          // slow folds travelling across the cloth
    c = mix(c, uWhite * 0.5 * fold, sh * 0.32 * feat);
  }
  // the bubble wand: a blurred pink ring, a new bubble swelling from it every six seconds
  {
    vec3 wd = normalize(vec3(sin(uGardenAz - 2.5), -0.06, cos(uGardenAz - 2.5)));
    vec3 wx = normalize(cross(wd, vec3(0.0, 1.0, 0.0))), wy = cross(wx, wd);
    vec2 q = vec2(dot(r, wx), dot(r, wy)) / max(dot(r, wd), 0.05);
    float front = step(0.05, dot(r, wd));
    // POLISH L2: a thin pink loop on a stick with a sheen of film across it (it was a fat ring that read as a doughnut)
    float rq = (length(q) - 0.043) / 0.012; float ring = exp(-rq * rq);
    float hq = q.x / 0.011; float handle = exp(-hq * hq) * smoothstep(-0.043, -0.055, q.y) * smoothstep(-0.26, -0.2, q.y);
    float inl = 1.0 - smoothstep(0.03, 0.043, length(q));
    c += (uPink * (ring + handle * 0.8) * 0.3 + mix(uPink, uWhite * vec3(0.5, 0.9, 1.0), 0.5 + 0.5 * sin(q.y * 70.0 + q.x * 30.0 + uTime * 0.8)) * inl * 0.06) * front * feat;
    float ph = fract(uTime / 6.0);
    float br = 0.043 * smoothstep(0.0, 0.55, ph) * (1.0 + 0.06 * sin(uTime * 7.0) * step(ph, 0.6));
    vec2 bc = vec2(0.02, 0.0) * smoothstep(0.5, 1.0, ph) + vec2(0.03 * sin(ph * 9.0), 0.22) * pow(max(ph - 0.55, 0.0) / 0.45, 1.5);
    float bd = length(q - bc);
    float bq = (bd - br) / 0.008; float bub = exp(-bq * bq) * (1.0 - smoothstep(0.9, 1.0, ph)) * step(0.02, ph);
    c += mix(uWhite, uPink, 0.3 + 0.3 * sin(atan(q.y - bc.y, q.x - bc.x + 1e-4) * 2.0 + uTime)) * bub * 0.4 * front;
  }
  // the sprinkler: an arc of sparks that sweeps
  {
    float a0 = uGardenAz + 1.25, sweep = sin(uTime * 0.55);
    for (int i = 0; i < 16; i++) {
      float s = fract(float(i) / 16.0 + uTime * 0.42);
      float a = a0 + sweep * 0.3 * s + 0.004 * sin(float(i) * 7.0);
      float h = -0.24 + 0.5 * s * (1.0 - s) * (0.8 + 0.2 * sweep * sweep);
      vec3 sd = normalize(vec3(sin(a), h, cos(a)));
      float dd = max(1.0 - dot(r, sd), 0.0);
      c += uWhite * (1.0 - smoothstep(0.00003, 0.00008, dd)) * (0.5 + 0.5 * sin(uTime * 9.0 + float(i) * 2.3)) * 1.2 * sin(s * 3.14159) * uSunK;
    }
  }
  // POLISH L2: the lawn is a dark floor a long way down (it was a pale veil behind the droplets and the dive): deep
  // shade with the pools of sun left in it, so the rim, the droplet ring and the portal burn on darkness
  { float dn = smoothstep(-0.08, -0.62, up); c = mix(c, c * (0.2 + 0.5 * c) + uShade * 0.5, dn * uDown); }
  // the gap in the leaves the sun comes through: one big soft disc and its glow
  float sd = max(1.0 - dot(r, uSun), 0.0);
  c += uGlow * uSunK * ((1.0 - smoothstep(0.0016, 0.0026, sd)) * 3.2 + exp(-sd * 55.0) * 0.55 + exp(-sd * 6.0) * 0.12);
  c += min(bsLamps(r, 0.0009), vec3(1.2)) * 1.6;
  gl_FragColor = vec4(c, 1.0);
}`}));me.renderOrder=-10,me.frustumCulled=!1,k.add(me),await m.yield();const c=L.fork("sprites"),F=l.palette,nt=g(F[5]),ge=g(F[4]),D=new r.Color,R={pos:[],sc:[],col:[]},oe=(e,t,o,a,s,i)=>{R.pos.push(e.x,e.y,e.z),R.sc.push(t,o,a,s),R.col.push(i.r,i.g,i.b)},Le=(e,t)=>{for(;;){const o=n(c.gauss(),c.gauss(),c.gauss()).normalize();if(o.y>=e&&o.y<=t)return o}},Jt=Math.round(600*Y*de),rt=n().crossVectors(G,fe).normalize(),Zt=n().crossVectors(rt,G).normalize();for(let e=0;e<Jt;e++){const t=e<8?2:c.chance(.62)?0:1,o=t===2||c.chance(.8),a=t<2&&c.chance(.17);let s=o?Le(t===2?.3:.12,1):Le(-.45,.3);if(a){const w=c.range(0,6.2832),M=.08+.4*c()**.7;s=G.clone().addScaledVector(rt,Math.cos(w)*M).addScaledVector(Zt,Math.sin(w)*M*.7).normalize()}const i=[4400,3300,2400][t]*c.range(.9,1.1),d=l.lamps&&c.chance(.18),f=t===0?c.range(.1,.18):t===1?c.range(.15,.3):c.range(.3,.45);D.copy(nt).lerp(ge,c()**2*(a?1:.8)).multiplyScalar(f*(o?1:.45)*(a?1.5:1)),d&&D.set("#ffb060").multiplyScalar(c.range(.3,.6));const p=i*(t===0?c.range(.01,.024):t===1?c.range(.022,.045):c.range(.06,.095));oe(s.multiplyScalar(i).add(u),p,0,c(),t===0?.5:t===1?.72:.8,D)}for(let e=0;e<14;e++){const t=Le(-.35,.8),o=c.range(2300,4200);D.copy(ge).lerp(g(c.pick([F[1],F[2],F[3]])),.35).multiplyScalar(c.range(.25,.5)),oe(t.multiplyScalar(o).add(u),o*c.range(.03,.07),1,c(),0,D)}const it=h.pointAt(.1),eo=h.tangentAt(.1),to=it.clone().sub(u).normalize(),lt=it.clone().addScaledVector(to,130).addScaledVector(eo,170),ct=n().crossVectors(G,fe).normalize(),oo=n().crossVectors(G,ct).normalize(),ao=l.mote.map(g);for(let e=0;e<Math.round(60*Y);e++)D.copy(c.pick(ao)).multiplyScalar(c.range(1.2,2.6)),oe(lt.clone().addScaledVector(G,c.range(-150,150)),c.range(.5,1.1),2,c(),c.range(6,42)*c.sign(),D);for(let e=0;e<80;e++)D.copy(ge).multiplyScalar(c.range(1.2,2.4)),oe(n(c.gauss(),c.gauss(),c.gauss()).normalize(),c.range(2,5),3,c(),e<40?0:1,D);{const e=c.fork("garden-discs"),t=Math.atan2(h.startTangent.x,h.startTangent.z),o=Math.round(90*Y*de);for(let a=0;a<o;a++){const s=a%3!==0,i=s?e.range(0,6.2832):t+1.25+e.gauss()*.22,d=s?e.range(-.5,.02):e.range(-.3,0),f=n(Math.sin(i)*Math.cos(d),Math.sin(d),Math.cos(i)*Math.cos(d)),p=3e3*e.range(.9,1.1);D.copy(nt).lerp(ge,s?e.range(.2,.9):.95).multiplyScalar(s?e.range(.12,.3):e.range(.25,.5)),l.lamps&&e.chance(.3)&&D.set("#ffb060").multiplyScalar(e.range(.2,.45)),oe(f.multiplyScalar(p).add(u),p*e.range(.008,.02),0,e(),.86,D)}}await m.yield();const U=new r.InstancedBufferGeometry;U.setAttribute("position",new r.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),U.setIndex([0,1,2,0,2,3]),U.setAttribute("aPos",new r.InstancedBufferAttribute(new Float32Array(R.pos),3)),U.setAttribute("aSC",new r.InstancedBufferAttribute(new Float32Array(R.sc),4)),U.setAttribute("aCol",new r.InstancedBufferAttribute(new Float32Array(R.col),3)),U.instanceCount=R.sc.length/4;const ae={uTime:_,uPxK:{value:.003},uShX:{value:ct},uShY:{value:oo},uShD:{value:G},uCenY:{value:u.y},uPuff:{value:[new r.Vector4(0,0,0,-1),new r.Vector4(0,0,0,-1)]},uCen:{value:u.clone()},uPr:W.uPr,uThru:W.uThru},Ie=new r.Mesh(U,new r.ShaderMaterial({uniforms:ae,transparent:!0,depthWrite:!1,depthTest:!1,blending:r.AdditiveBlending,vertexShader:`
attribute vec3 aPos, aCol; attribute vec4 aSC;
uniform float uTime, uPxK, uCenY, uPr, uThru; uniform vec3 uShX, uShY, uShD, uCen; uniform vec4 uPuff[2];
varying vec2 vUv; varying vec3 vCol; varying vec3 vK;
void main(){
  vec3 p = aPos; float size = aSC.x, kind = aSC.y, sd = aSC.z, live = 1.0, tw = 1.0;
  if (kind < 0.5) {
    p += vec3(sin(uTime * 0.31 + sd * 40.0), cos(uTime * 0.23 + sd * 17.0), sin(uTime * 0.19 + sd * 29.0)) * size * 0.22;
    tw = 0.55 + 0.45 * sin(uTime * (0.5 + sd * 1.7) + sd * 60.0);
  } else if (kind < 1.5) {
    float ph = fract((aPos.y - uCenY + 2400.0) / 4800.0 + uTime * (0.0012 + 0.0016 * sd));
    p.y = uCenY - 2400.0 + ph * 4800.0;
    tw = smoothstep(0.0, 0.08, ph) * (1.0 - smoothstep(0.9, 1.0, ph));
  } else if (kind < 2.5) {
    float ang = uTime * (0.35 + sd * 0.9) * sign(aSC.w) + sd * 50.0, rad = abs(aSC.w) * (0.8 + 0.2 * sin(uTime * 0.6 + sd * 20.0));
    p += uShX * cos(ang) * rad + uShY * sin(ang) * rad + uShD * sin(uTime * 0.5 + sd * 30.0) * 14.0;
    tw = 0.5 + 0.5 * sin(uTime * (3.0 + sd * 5.0) + sd * 9.0);
  } else {
    vec4 pf = aSC.w < 0.5 ? uPuff[0] : uPuff[1];
    float age = pf.w; live = step(0.0, age) * step(age, 2.4);
    float k = 1.0 - exp(-2.5 * max(age, 0.0));
    p = pf.xyz + aPos * (30.0 + 110.0 * sd) * k + vec3(0.0, -9.0 * age * age, 0.0);
    tw = (1.0 - smoothstep(0.8, 2.4, age)) * (0.6 + 0.4 * sin(uTime * 17.0 + sd * 70.0));
  }
  if (kind < 1.5) {                                    // a disc behind the planet is seen through two skins: dimmer
    vec3 oc = uCen - cameraPosition, rd = p - cameraPosition; rd /= max(length(rd), 1e-3);
    float pb = dot(rd, oc), pd = pb * pb - dot(oc, oc) + uPr * uPr;
    tw *= 1.0 - 0.7 * uThru * step(0.0, pb) * smoothstep(0.0, 5000.0, pd);
  }
  vec4 mv = viewMatrix * vec4(p, 1.0);
  float px = max(-mv.z, 0.1) * uPxK / max(projectionMatrix[1][1], 0.05);
  size = max(size, px * 1.5) * live;
  vec3 vd = normalize(mv.xyz), bx = normalize(cross(vd, vec3(0.0, 1.0, 0.0))), by = cross(bx, vd);   // face the eye, not the film plane
  mv.xyz += (bx * position.x + by * position.y) * size;
  vUv = position.xy; vCol = aCol * tw; vK = vec3(kind, sd, aSC.w);
  gl_Position = projectionMatrix * mv;
}`,fragmentShader:`
varying vec2 vUv; varying vec3 vCol; varying vec3 vK;
void main(){
  float r = length(vUv); if (r > 1.0) discard;
  float a;
  if (vK.x < 0.5) a = (1.0 - smoothstep(vK.z, 1.0, r)) * (0.7 + 0.3 * smoothstep(vK.z * 0.6, vK.z, r));
  else if (vK.x < 1.5) a = (1.0 - smoothstep(0.86, 1.0, r)) * (0.16 + 0.84 * smoothstep(0.5, 0.88, r));
  else a = exp(-r * r * 5.0) + (1.0 - smoothstep(0.0, 0.25, r));
  gl_FragColor = vec4(vCol * a, 1.0);
}`}));Ie.frustumCulled=!1,Ie.renderOrder=-5,k.add(Ie),await m.yield();const $=ce.fxGroup();k.add($.object);const so=$.add(ce.makeGodRays({rng:L.fork("rays"),position:lt.clone().addScaledVector(G,430).toArray(),direction:G.clone().negate().toArray(),radius:46,count:9,length:900,width:[12,44],color:l.lamps?"#ffb060":l.sunGlow,intensity:l.lamps?.04:.13,time:_,fogAmount:0}));so.object.renderOrder=-4,await m.yield();const Fo=$.add(ce.makeParticles(l.frost?{rng:L.fork("motes"),preset:"dust",time:_,count:Math.round(1300*Y*de),box:[110,70,110],size:[.08,.3],colors:l.mote,intensity:1.5,fog:!1,renderOrder:12}:{rng:L.fork("motes"),preset:"dust",time:_,count:Math.round(1100*Y*de),box:[90,60,90],size:[.07,.3],colors:l.mote,intensity:1.5,fog:!1,renderOrder:12}));await m.yield();const A=L.fork("moons"),ve=Math.round(12*Y),dt=T.makeMoonMaterial({thin:.7-.3*tt,span:3,ns:.9,phase:A.range(0,20)}),se=new r.InstancedMesh(It(14),dt,ve);se.frustumCulled=!1,se.renderOrder=0,dt.uniforms.uGain.value=.95;const ut=[];for(let e=0;e<ve;e++){const t=n(A.gauss(),A.gauss()*.8+.25,A.gauss()).normalize(),o=A.range(22,50)*(e<3?1.4:1),a=y+230+o+(e<4?A.range(0,200):A.range(160,1400));ut.push({base:t.multiplyScalar(a).add(u),rad:o,rise:A.range(1.5,5),ph:A(),spin:A.range(-.1,.1),ax:n(A.gauss(),A.gauss(),A.gauss()).normalize(),pop:e>=ve-2?A.range(11,19):0,popAt:A.range(.55,.8)})}k.add(se);const ft=new r.Matrix4,we=new r.Quaternion,pt=n(),S=n(),Ke=n(),Bo=n(),_o=n();function ht(e){let t=0;for(let o=0;o<ve;o++){const a=ut[o],s=500,i=((a.ph*s+e*a.rise)%s+s)%s,d=i/s;let f=a.rad*b(0,.1,d)*(1-b(.9,1,d))*(1+.015*Math.sin(e*1.3+o));if(S.copy(a.base),S.y+=i-s*.5,S.x+=Math.sin(e*.21+o*2.1)*12,a.pop){const p=(e+a.ph*a.pop)%a.pop/a.pop,w=(p-a.popAt)*a.pop;w>0&&(f*=b(.97,1,p)),ae.uPuff.value[t].set(S.x,S.y,S.z,w>0?w:-1),t++}we.setFromAxisAngle(a.ax,e*a.spin+o),se.setMatrixAt(o,ft.compose(S,we,pt.setScalar(Math.max(f,.001))))}se.instanceMatrix.needsUpdate=!0}ht(0),await m.yield();const V=v.satellite,be=v.satDir,ye=fe.clone().addScaledVector(be,-fe.dot(be)).normalize(),Se=n().crossVectors(ye,be).normalize();Se.dot(h.pointAt(.3).sub(V.center))<0&&Se.negate();const mt=It(17),Ee=new r.MeshBasicMaterial({color:new r.Color(1.2,1.1,.9)}),no=v.poleNormal,ro=165/y,Oe=[];function gt(e,t,o){const a=e*Math.PI/180,s=(V.radius+t)*.86,i=be.clone().multiplyScalar(y).addScaledVector(Se,Math.cos(a)*s).addScaledVector(ye,Math.sin(a)*s).normalize(),d=i.clone().multiplyScalar(y+t*.45).add(u),f=T.makeMoonMaterial({thin:.9,span:2.6,ns:1,phase:o}),p=new r.Mesh(mt,f);p.scale.setScalar(t),p.position.copy(d),p.frustumCulled=!1,p.renderOrder=3,k.add(p);const w=y+t*.45,M=(w*w+y*y-t*t)/(2*w),K=Math.sqrt(Math.max(1,y*y-M*M)),E=new r.Mesh(new r.TorusGeometry(K,.38,6,96),Ee);E.position.copy(i).multiplyScalar(M).add(u),E.quaternion.setFromUnitVectors(n(0,0,1),i),E.frustumCulled=!1,k.add(E);const _t={mesh:p,mat:f,ridge:E,c:d,dir:i,r:t,colat:Math.acos(et(i.dot(no),-1,1)),pos:d.clone(),gone:0};return Oe.push(_t),_t}const We=L.fork("foam");for(let e=0;e<Et;e++)gt(205+e*62+We.range(-8,8),We.range(15,24),We.range(0,30));let P=null;if(Ot){const e=gt(158,27,11.3),t=e.c.distanceTo(V.center),o=(t*t+V.radius*V.radius-e.r*e.r)/(2*t),a=Math.sqrt(Math.max(1,V.radius*V.radius-o*o)),s=e.c.clone().sub(V.center).normalize(),i=V.center.clone().addScaledVector(s,o),d=new r.Mesh(new r.CircleGeometry(a,48),new r.MeshBasicMaterial({color:g(F[4]).multiplyScalar(.5),transparent:!0,opacity:0,depthWrite:!1,side:r.DoubleSide,blending:r.AdditiveBlending}));d.position.copy(i),d.quaternion.setFromUnitVectors(n(0,0,1),s),d.renderOrder=5,k.add(d);const f=new r.Mesh(new r.TorusGeometry(a,.4,6,96),Ee);f.position.copy(i),f.quaternion.copy(d.quaternion),f.frustumCulled=!1,k.add(f);const p=e.dir.clone().multiplyScalar(.75).addScaledVector(ye,.5).addScaledVector(s,.45).normalize();P={o:e,wall:d,join:f,from:p,nIdx:f.geometry.index.count,rIdx:e.ridge.geometry.index.count},f.geometry.setDrawRange(0,0),e.ridge.geometry.setDrawRange(0,0)}const xe=pe-.08,vt=(e,t)=>{const o=P,a=1-b(xe-.34,xe,e);return t.copy(o.o.c).addScaledVector(o.from,300*a*a+3*a).addScaledVector(Se,30*a*Math.sin(e*20))};function io(e,t){const o=T.holeAngle();if(P){const a=P,s=a.o;vt(t,s.pos);const i=et((t-xe)*De,0,9),d=i>0?Math.exp(-i*1.6)*Math.sin(i*11)*.07:0;s.mesh.scale.set(s.r*(1+d),s.r*(1-d*1.4),s.r*(1+d));const f=3*Math.floor(b(0,1.1,i)*a.nIdx/3);a.join.geometry.setDrawRange(0,f),s.ridge.geometry.setDrawRange(0,3*Math.floor(b(.1,1.4,i)*a.rIdx/3)),a.wall.material.opacity=.55*b(0,.25,i)*(.6+.4*Math.exp(-i))}for(const a of Oe){const s=o>0?(o-a.colat+.12)/ro:-1;if(s>0){const i=1-Math.exp(-s*.7);a.mesh.position.copy(a.pos).addScaledVector(a.dir,22*i+3*s).addScaledVector(ye,6*i),a.mat.uniforms.uClipR.value=0,a.mat.uniforms.uWob.value=.01+.1*Math.exp(-s*.9),a.ridge.visible=!1,P&&a===P.o&&(P.join.visible=!1,P.wall.visible=!1)}else a.mesh.position.copy(a.pos),a.mat.uniforms.uClipC.value.copy(u).sub(a.pos).divideScalar(a.r),a.mat.uniforms.uClipR.value=y/a.r,a.mat.uniforms.uWob.value=.012,a.ridge.visible=!0,P&&a===P.o&&(P.join.visible=!0,P.wall.visible=!0);a.mesh.rotation.set(Math.sin(e*.7+a.r)*.015,0,Math.cos(e*.6+a.r)*.015)}}await m.yield();const H={bee:0,dragonfly:1,thistle:2}[Kt],Re=new r.PlaneGeometry(2,2),Ue=(e,t,o,a=0)=>new r.ShaderMaterial({uniforms:{uTime:_,uKind:{value:e},uA:{value:t},uFlat:{value:o},uSoft:{value:a},uDark:{value:g("#1a1208")},uGold:{value:g(F[3]).multiplyScalar(.8)},uWing:{value:g(F[4]).multiplyScalar(.55)}},transparent:!0,depthWrite:!1,depthTest:!1,side:r.DoubleSide,vertexShader:"varying vec2 vUv; void main(){ vUv = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`
uniform float uTime, uKind, uA, uFlat, uSoft; uniform vec3 uDark, uGold, uWing; varying vec2 vUv;
float ell(vec2 q, vec2 c, vec2 r, float blur){ vec2 e = (q - c) / r; return 1.0 - smoothstep(1.0 - blur, 1.0 + blur, length(e)); }
void main(){
  vec2 q = vUv; vec3 col = vec3(0.0); float a = 0.0;
  if (uKind < 0.5) {                         // bee: a soft dark-and-gold barrel, two swept wings a pale blur
    float bl = 0.6 + 0.25 * uSoft, se = 0.7 + 0.7 * uSoft;
    float ab = ell(q, vec2(-0.3, -0.1), vec2(0.36, 0.2), bl), th = ell(q, vec2(0.14, -0.06), vec2(0.21, 0.19), bl), hd = ell(q, vec2(0.42, -0.1), vec2(0.12, 0.12), bl);
    float stripe = smoothstep(-se, se, sin(q.x * 14.0 + 0.4));
    a = max(max(ab, th), hd);
    col = mix(mix(uDark * 1.4, uGold * 0.75, 0.3), mix(uDark, uGold, stripe), smoothstep(0.0, 0.3, ab));
    col = mix(col, uDark, smoothstep(0.1, 0.5, hd) * (1.0 - smoothstep(0.2, 0.6, th)));
    float fl = sin(uTime * 23.0);
    vec2 w1 = q - vec2(-0.16, 0.3), w2 = q - vec2(-0.3, 0.16);
    w1 = vec2(w1.x * 0.9 + w1.y * 0.44, w1.y * 0.9 - w1.x * 0.44); w2 = vec2(w2.x * 0.97 + w2.y * 0.26, w2.y * 0.97 - w2.x * 0.26);
    float w = max(ell(w1, vec2(0.0), vec2(0.46, 0.15 + 0.05 * fl), 0.7), 0.8 * ell(w2, vec2(0.0), vec2(0.38, 0.11 - 0.04 * fl), 0.7)) * (1.0 - uFlat);
    col = mix(uWing * 1.2, col, smoothstep(0.0, 0.35, a)); a = max(a, w * 0.6);
  } else if (uKind < 1.5) {                  // dragonfly: four blurred vanes on a soft two-tone needle
    float bd = ell(q, vec2(-0.16, 0.0), vec2(0.66, 0.09), 0.7), th = ell(q, vec2(0.46, 0.0), vec2(0.2, 0.14), 0.6);
    a = max(bd, th);
    col = mix(uDark * 1.5, uGold * 0.55 + vec3(0.0, 0.16, 0.22), smoothstep(-0.7, 0.55, q.x)) * (1.0 - 0.6 * th) + uGold * 0.1 * smoothstep(0.0, 0.08, q.y) * th;
    float fl = sin(uTime * 14.0);
    float w = 0.0;                           // vanes swept a little back, each pair beating against the other
    for (int k = 0; k < 2; k++) {
      float sg = k == 0 ? 1.0 : -1.0;
      vec2 e1 = vec2(q.x - 0.4 + 0.1 * abs(q.y), q.y * sg - 0.3), e2 = vec2(q.x - 0.2 + 0.22 * abs(q.y), q.y * sg - 0.27);
      w += ell(e1, vec2(0.0), vec2(0.12 + 0.045 * fl, 0.3 + 0.05 * fl), 0.75) + 0.85 * ell(e2, vec2(0.0), vec2(0.11 - 0.045 * fl, 0.27 - 0.05 * fl), 0.75);
    }
    w = min(w, 1.0) * (1.0 - uFlat * 0.5);
    col = mix(uWing * 1.15, col, smoothstep(0.0, 0.4, a)); a = max(a, w * 0.62);
  } else {                                   // thistle seed: a drifting globe of down
    float r = length(q), an = atan(q.y, abs(q.x) + abs(q.y) < 1e-5 ? 1e-5 : q.x);
    float fil = 0.45 + 0.55 * pow(abs(sin(an * 13.0 + sin(an * 5.0) * 2.0 + uTime * 0.15)), 3.0);
    a = (1.0 - smoothstep(0.35, 0.95, r)) * fil * 0.7 + (1.0 - smoothstep(0.0, 0.12, r));
    col = mix(uWing * 1.5, uDark, 1.0 - smoothstep(0.03, 0.12, r));
  }
  a *= 1.0 - smoothstep(0.7, 1.0, length(q));       // nothing reaches the edge of the quad
  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0) * uA);
}`}),ke=.3,j=new r.Mesh(Re,Ue(H,.9,0));j.frustumCulled=!1,j.renderOrder=-3;const wt=H===2?70:H===1?150:95;j.scale.set(wt,wt*(H===2?1:.62),1),k.add(j);const Me=h.pointAt(ke),He=h.tangentAt(ke),ze=Me.clone().sub(u).normalize(),je=n().crossVectors(He,ze).normalize(),Ne=je.dot(n().subVectors(n(u.x,u.y+y,u.z),Me))>0?1:-1,bt=Me.clone().addScaledVector(He,430).addScaledVector(je,-Ne*330).addScaledVector(ze,150),yt=Me.clone().addScaledVector(He,330).addScaledVector(je,Ne*260).addScaledVector(ze,240),I=new r.Mesh(Re,Ue(H,0,1));I.frustumCulled=!1,I.renderOrder=6,I.scale.set(46,30,1),k.add(I);const Ye=ke+.07,St=h.pointAt(Ye+.03),xt=h.tangentAt(Ye+.03),lo=St.clone().sub(u).normalize(),Xe=n().crossVectors(xt,lo).normalize(),ne=pe-.01,$e=h.pointAt(ne+.03),kt=h.tangentAt(ne+.03),Mt=$e.clone().sub(u).normalize(),zt=$e.clone().sub(V.center).normalize(),co=$e.clone().addScaledVector(zt,11).addScaledVector(Mt,3),Q=new r.Mesh(Re,Ue(0,.7,0,1));Q.frustumCulled=!1,Q.renderOrder=11,Q.scale.set(4.2,2.8,1),k.add(Q);const J=n(),Ae=n(),B=n(),Ce=n(),At=new r.Matrix4;function Ct(e,t,o,a){B.subVectors(a,t).normalize(),J.copy(o).addScaledVector(B,-o.dot(B)).normalize(),Ae.crossVectors(B,J),e.quaternion.setFromRotationMatrix(At.makeBasis(J,Ae,B)),e.position.copy(t)}const uo=yt.clone().sub(bt).normalize();function fo(e,t,o){const a=(t-(ke-.08))/.15;S.lerpVectors(bt,yt,a),S.addScaledVector(ze,Math.sin(e*1.7)*6),Ct(j,S,uo,o),j.material.uniforms.uA.value=(H===2?.8:.9)*(1-b(1,1.3,a)),j.visible=a<1.3;const s=(t-(Ye-.035))/.085;Ke.copy(St).addScaledVector(Xe,Lt(-70,70,s)).addScaledVector(xt,Lt(-12,26,s)).sub(u).normalize(),S.copy(Ke).multiplyScalar(y+.8).add(u),B.copy(Ke),J.copy(Xe).addScaledVector(B,-Xe.dot(B)).normalize(),Ae.crossVectors(B,J),I.quaternion.setFromRotationMatrix(At.makeBasis(J,Ae,B)),I.position.copy(S),I.material.uniforms.uA.value=(H===2?.17:.5)*b(0,.2,s)*(1-b(.8,1,s)),I.visible=s>0&&s<1;const i=b(ne-.015,ne+.05,t);S.copy(co).addScaledVector(Mt,Math.sin(e*5.1)*.5+260*i*i).addScaledVector(kt,Math.sin(e*3.3)*.7+90*i).addScaledVector(zt,Math.sin(e*4.3+1)*.6+120*i*i),Ct(Q,S,kt,o),Q.visible=t>ne-.3&&i<.98}await m.yield();const N=L.fork("seeds"),q={pos:[],dir:[],sw:[],col:[],idx:[]},Te=(e,t,o,a,s,i)=>{const d=q.pos.length/3,f=t.clone().sub(e).normalize();for(const[p,w,M,K]of[[e,o,s,-1],[e,o,s,1],[t,a,i,-1],[t,a,i,1]])q.pos.push(p.x,p.y,p.z),q.dir.push(f.x,f.y,f.z),q.sw.push(K,w),q.col.push(M.r,M.g,M.b);q.idx.push(d,d+1,d+2,d+2,d+1,d+3)};{const e=g(F[4]).multiplyScalar(1.15),t=g(F[4]).multiplyScalar(.7),o=g("#b9ad8c"),a=g("#5a4326");Te(n(0,0,0),n(.3,-7,0),.16,.14,o,o),Te(n(.3,-7,0),n(0,-13.5,.2),.14,.2,o,o),Te(n(0,-13.5,.2),n(0,-16.6,.2),.55,.3,a,a);for(let s=0;s<72;s++){const i=s/72*Math.PI*2+N.range(-.05,.05),d=N.range(.12,.62),f=N.range(10.5,13),p=n(Math.cos(i),0,Math.sin(i));let w=n(0,0,0);for(let M=1;M<=3;M++){const K=M/3,E=p.clone().multiplyScalar(f*K*Math.cos(d)).add(n(0,f*Math.sin(d)*(K-.35*K*K),0));Te(w,E,.07,.06,M===3?t:e,M===3?t:e),w=E}}}await m.yield();const Z=new r.BufferGeometry;Z.setAttribute("position",new r.Float32BufferAttribute(q.pos,3)),Z.setAttribute("aDir",new r.Float32BufferAttribute(q.dir,3)),Z.setAttribute("aSW",new r.Float32BufferAttribute(q.sw,2)),Z.setAttribute("aCol",new r.Float32BufferAttribute(q.col,3)),Z.setIndex(q.idx);const po={uPxK:ae.uPxK,uTime:_,uTint:{value:g(l.sunGlow).lerp(g("#ffffff"),.5).multiplyScalar(l.lamps?.55:1)},uCen:ae.uCen,uPr:W.uPr,uThru:W.uThru},re=new r.InstancedMesh(Z,new r.ShaderMaterial({uniforms:po,transparent:!0,depthWrite:!1,side:r.DoubleSide,vertexShader:`
attribute vec3 aDir, aCol; attribute vec2 aSW; uniform float uPxK, uTime, uPr, uThru; uniform vec3 uCen; varying vec3 vCol; varying float vS, vHid;
void main(){
  mat4 mm = modelMatrix;
  #ifdef USE_INSTANCING
  mm = modelMatrix * instanceMatrix;
  #endif
  vec3 p = position; p.xz *= 1.0 + 0.035 * sin(uTime * 1.1 + position.y * 0.4);        // the parachute breathes
  vec4 wp = mm * vec4(p, 1.0);
  vec4 mv = viewMatrix * wp;
  { // POLISH L1B: what hangs behind the planet is behind its skins (nothing here writes depth, so a far seed was drawn over
    // the film it is behind): each part goes out as the limb comes in front of it, and is back when the film is gone
    vec3 oc = uCen - cameraPosition, rd = wp.xyz - cameraPosition; float hl = max(length(rd), 1e-3); rd /= hl;
    float pb = dot(rd, oc), pd = pb * pb - dot(oc, oc) + uPr * uPr;
    vHid = uThru * step(0.0, pb) * smoothstep(0.0, 1500.0, pd) * smoothstep(0.0, 20.0, hl - (pb - sqrt(max(pd, 0.0))));
  }
  vec3 dv = mat3(viewMatrix) * mat3(mm) * aDir;
  vec2 n = vec2(-dv.y, dv.x); float nl = length(n); n = nl > 1e-4 ? n / nl : vec2(1.0, 0.0);
  float px = max(-mv.z, 0.1) * uPxK / max(projectionMatrix[1][1], 0.05);
  mv.xy += n * aSW.x * max(aSW.y, px * 0.8);
  vCol = aCol * min(1.0, aSW.y / max(px * 0.8, 1e-4) + 0.35); vS = aSW.x;
  gl_Position = projectionMatrix * mv;
}`,fragmentShader:`uniform vec3 uTint; varying vec3 vCol; varying float vS, vHid;
void main(){ float e = 1.0 - smoothstep(0.55, 1.0, abs(vS)); gl_FragColor = vec4(vCol * uTint, e * (1.0 - clamp(vHid, 0.0, 1.0))); }`}),3);re.frustumCulled=!1,re.renderOrder=11,k.add(re);const ho=Ne>0?-1:1,mo=n(),go=n(),Tt=n(),vo=n(),ie=n(),Pt=(e,t,o,a,s)=>{const i=h.posAtDist(e+t,s),d=h.tangentAtDist(e,mo),f=go.subVectors(i,u).normalize();return Tt.crossVectors(d,f).normalize(),i.addScaledVector(f,o).addScaledVector(Tt,ho*a)},wo=17+13.7,bo=18,yo=e=>{ie.copy(e),ie.y-=2;let t=ie.distanceTo(V.center)-V.radius;for(const o of Oe)t=Math.min(t,ie.distanceTo(o.c)-o.r);if(P)for(let o=0;o<=xe*z;o+=2.5)t=Math.min(t,ie.distanceTo(vt(o/z,vo))-P.o.r);return t-wo},So=[[Fe,10,80,1,!1,!0],[Be,30,36,-1,!0,!1],[x*z,16,34,1,!1,!1]].map(([e,t,o,a,s,i])=>{const d=N.range(-13,13),f=i?Math.abs(d):d,p=Pt(e,f,t,o,n());let w=e;if(s)for(;w-2.5>Fe&&yo(p)<bo;)w-=2.5,Pt(w,f,t,o,p);return{base:p,at:w,ph:N.range(0,6),tilt:N.range(.15,.35),spin:N.range(.08,.2)*a}}),xo=new r.Euler;function Vt(e){for(let t=0;t<3;t++){const o=So[t];S.copy(o.base),S.x+=Math.sin(e*.13+o.ph)*9,S.y+=Math.sin(e*.21+o.ph*2)*5-2,S.z+=Math.cos(e*.11+o.ph)*9,we.setFromEuler(xo.set(Math.sin(e*.5+o.ph)*o.tilt,e*o.spin,Math.cos(e*.37+o.ph)*o.tilt)),re.setMatrixAt(t,ft.compose(S,we,pt.setScalar(1)))}re.instanceMatrix.needsUpdate=!0}Vt(0),await m.yield();const Qe=v.portalSeat.position,Dt=$.add(ce.makeGlow({position:Qe.toArray(),size:36,color:l.portal,intensity:1.1,halo:.4,core:.75,depthTest:!1,fogAmount:0,time:_,renderOrder:0})),qt=$.add(ce.makeGlow({position:Qe.toArray(),size:120,color:l.portal,intensity:0,halo:1,core:.25,depthTest:!1,fogAmount:0,time:_,renderOrder:0}));await m.yield();const Gt=new r.MeshBasicMaterial({color:g(l.portal).multiplyScalar(2.6),transparent:!0,opacity:1,depthWrite:!1}),le=new r.Mesh(new r.TorusGeometry(8.4,.5,8,72),Gt);le.position.copy(Qe),le.quaternion.setFromUnitVectors(n(0,0,1),v.portalSeat.normal),le.renderOrder=1.5,le.frustumCulled=!1,k.add(le),await m.yield();const Lo=v.vortexStreet,ko=v.ringCenter,Mo=pe,zo=[{at:(e,t)=>Ze(t,55,22),from:0,to:jt/z,weight:.85},{at:(e,t)=>Ze(t,20,-10),from:Ht/z,to:Fe/z,weight:.92},{at:V.center,from:Xt/z,to:Be/z,weight:.5},{at:(e,t)=>Ze(t,40,0),from:Nt/z,to:$t/z,weight:.7},{at:(e,t)=>Co(t),from:Mo-.04,to:x+.02,weight:.8,fade:.14},{at:ko,from:x-.04,to:.95,weight:.85}],Pe=n(),ee=n(),Je=n(),Ao=n(u.x,u.y+y,u.z);function Ze(e,t,o){return h.posAtDist(Math.min(z,(e||0)*z+t),Pe),Je.subVectors(Pe,u).normalize(),ee.subVectors(Ao,Pe),ee.addScaledVector(Je,-ee.dot(Je)),ee.lengthSq()>1e-6&&ee.normalize(),Pe.addScaledVector(ee,o).sub(u).normalize().multiplyScalar(y).add(u)}const Ft=n();function Co(e){return h.pointAt(Math.min(1,(e||0)+.075),Ft).sub(u).normalize().multiplyScalar(y).add(u),Ft.lerp(Wt,b(x-.13,x-.03,e||0))}const Bt=new r.Vector2,To=l.flow;return{scene:k,path:h,duration:De,title:l.title,ride:"none",style:"none",camera:{fov:62,near:.4,far:9e3,lookAhead:24,sway:.6,bank:1},pois:zo,portal:{shape:"circle",radius:7,color:l.portal,glow:1,tilt:!0,revealDistance:320},post:{exposure:l.post.exposure,bloom:{strength:.42,radius:.6,threshold:1},grade:{saturation:l.post.sat,contrast:1.06,tint:l.post.tint,shadowTint:l.post.shadow,vignette:.36,grain:.02,aberration:0}},update(e,t,o,a){const s=a||0;_.value=t,o.getWorldPosition(Ce),me.position.copy(Ce),W.uPc.value.subVectors(u,Ce),W.uThru.value=1-b(x,x+.035,s),T.setProgress(s),T.update(e,t*To,o),m.renderer&&(m.renderer.getDrawingBufferSize(Bt),ae.uPxK.value=2/Math.max(64,Bt.y)),ht(t),io(t,s),fo(t,s,Ce),Vt(t),$.update(e,t,o),Dt.uniforms.uIntensity&&(Dt.uniforms.uIntensity.value=(.5+1.3*b(x-.02,x+.01,s))*(1+.6*b(x,x+.05,s))*(1-.7*b(.87,.95,s))),qt.uniforms.uIntensity&&(qt.uniforms.uIntensity.value=(1.3+1.1*b(x-.02,x,s))*b(.56,x-.08,s)*(1-b(x,x+.05,s))),Gt.opacity=1-b(x+.005,x+.05,s)},dispose(){T.dispose(),mt.dispose(),Ee.dispose()}}}};export{Eo as default};
