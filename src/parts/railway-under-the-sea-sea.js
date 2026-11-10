import*as e from"three";import{Reflector as z}from"three/addons/objects/Reflector.js";import{LINE as v,LEVEL as y,GAUGE as R,RING as r,CAR as D}from"./railway-under-the-sea-line.js";const b=`
  float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float n1(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
    return mix(mix(h1(i), h1(i + vec2(1., 0.)), f.x), mix(h1(i + vec2(0., 1.)), h1(i + vec2(1., 1.)), f.x), f.y); }
  uniform vec4 uLine;                                   // x: zBend0, y: zBend1, z: shift, w: half the gauge
  float lineX(float z){ float q = clamp((uLine.x - z) / (uLine.x - uLine.y), 0., 1.); return uLine.z * q*q*(3. - 2.*q); }
`,F=`
  uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vW;
  void main(){ vUv = textureMatrix * vec4(position, 1.); vW = (modelMatrix * vec4(position, 1.)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }
`,E=`
  uniform sampler2D tDiffuse; uniform float uTime; uniform vec3 uBody; uniform vec3 uRiffle; uniform vec3 uFogCol; uniform float uFogDen;
  uniform vec4 uCar;                                    // x: the nose's z, y: the car's length, z: its pace against the eye's (0 = standing)
  uniform vec4 uRing; uniform vec3 uRingCol;            // xyz: the ring's centre, w: the strength of its light on the water
  uniform float uCalm;                                  // 0..1: how strong the cat's paws are
  varying vec4 vUv; varying vec3 vW;
  ${b}
  void main(){
    vec3 E = cameraPosition - vW; float dist = length(E); vec3 V = E / max(dist, 1e-4);
    vec2 p = vW.xz; float fw = max(fwidth(p.x), fwidth(p.y)); float t = uTime;
    // ripples: cat's paws are patches where a breath of air roughens the glass
    float paw = smoothstep(0.42, 0.78, n1(p*0.011 + vec2(t*0.018, -t*0.012)));
    float amp = 0.0021 + 0.0105*paw*uCalm;
    vec2 sl = vec2(0.);
    sl += amp*vec2(1., .3)*cos(dot(p, vec2(1.9, .6)) + t*1.3 + 1.2*n1(p*.21)) * clamp(1. - fw*.9, 0., 1.);
    sl += amp*vec2(-.4, 1.)*cos(dot(p, vec2(-.8, 2.3)) - t*1.1 + 1.2*n1(p*.17 + 5.)) * clamp(1. - fw*1., 0., 1.);
    sl += amp*.7*vec2(.7, -.7)*cos(dot(p, vec2(4.3, -4.1)) + t*2.3) * clamp(1. - fw*2.6, 0., 1.);
    sl += 0.0012*vec2(cos(p.x*.23 + t*.4), cos(p.y*.19 - t*.33));          // a long slow heave
    // the line: metres east of the track's centre, and the two riffle lines over the rail heads
    float l = p.x - lineX(p.y), al = abs(l);
    float rr = abs(al - uLine.w), rw = 0.06 + 0.9*fwidth(l);            // filtered by the footprint ACROSS the line: the two lines run on to the horizon
    float cov = (1. - smoothstep(0.35*rw, rw, rr)) * min(1., 0.2/rw) * step(-1400., p.y) * step(p.y, 340.);
    float shim = 0.65 + 0.35*n1(vec2(p.y*0.9 + t*0.7, l*3.));                  // a slow shimmer along the riffle (no dashes)
    cov *= shim;
    // the railcar's wake: s is metres behind its nose along the line
    float s = p.y - uCar.x, sb = max(s, 0.), on = smoothstep(0.15, 0.9, uCar.z);
    float front = 1.3 + 0.085*sb, d = al - front;
    float env = exp(-(d + 1.1)*(d + 1.1)/(2.2 + 0.03*sb)) * smoothstep(-2., 5., s) * exp(-sb/260.) * on;
    float crest = cos(d*6.2 + t*4.5) * clamp(1. - fw*1.1, 0., 1.);
    sl.x += sign(l)*0.075*env*crest;
    // the wake's two arms read on the mirror as long pale lines (their crests take the bright low sky), and the lane
    // between them is a little roughened: thin lines and no spray
    float arm = env * (0.22 + 0.95*smoothstep(0.15, 0.9, crest));          // bright crest lines
    float dip = env * smoothstep(0.15, 0.9, -crest);                       // dark trough lines
    float lane = (1. - smoothstep(front - 1.6, front - 0.4, al)) * smoothstep(0., 8., s) * exp(-sb/190.) * on;
    float chop = (1. - smoothstep(front - 1.2, front, al)) * smoothstep(-1., 4., s) * exp(-sb/85.) * on;
    sl += chop*0.05*(vec2(n1(p*1.9 + t*vec2(.9, .4)), n1(p*2.3 - t*vec2(.6, .8))) - .5) * clamp(1. - fw*1.5, 0., 1.);
    float foam = chop * exp(-sb/22.) * (1. - smoothstep(0.2, 0.9, rr));
    // the mirror law
    vec3 N = normalize(vec3(-sl.x, 1., -sl.y));
    float c = clamp(dot(N, V), 0., 1.), k = 1. - c;
    float m = mix(0.07, 1., k*k*k);                        // near the eye the clear water shows its bed; far off it is all mirror
    float f = 1. - exp(-uFogDen*uFogDen*dist*dist*6.);     // far off the sea is all mirror: it takes the sky's own horizon in every direction
    m = mix(m, 1., f);
    vec4 uvp = vUv; uvp.xy += sl*vec2(1.2, 9.0)*max(uvp.w, 0.)*0.35;
    vec3 refl = texture2D(tDiffuse, uvp.xy / max(uvp.w, 1e-4)).rgb;
    refl *= 1. - 0.3*dip;
    refl = mix(refl, uRiffle, clamp(cov*0.6 + foam*0.5 + arm*0.6 + lane*0.1*(0.6 + 0.8*n1(p*0.8 + t*0.3)), 0., 1.));
    vec2 dR = p - uRing.xz; float dr2 = dot(dR, dR);
    refl += uRingCol*uRing.w*(0.8*exp(-dr2/70.) + 0.2*exp(-dr2/2200.));
    float body = 0.2;                                    // how much the water's own body hides the bed
    vec3 col = refl*m + uBody*(1. - m)*body; float a = m + (1. - m)*body;
    gl_FragColor = vec4(col, a);
  }
`,k="varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",S=`
  uniform float uTime; uniform vec3 uFogCol; uniform float uFogDen; uniform vec3 uLight; varying vec3 vW;
  ${b}
  void main(){
    vec2 p = vW.xz; float fw = max(fwidth(p.x), fwidth(p.y)); float t = uTime;
    float big = n1(p*0.013)*0.6 + n1(p*0.041 + 11.)*0.4;                          // bars and hollows
    float wr = 2.2*n1(p*0.12) + 0.9*n1(p*0.6);                                    // the ripple marks wander
    float rip = sin(dot(p, vec2(11.5, 3.1)) + wr*3.0)*0.5 + 0.5;                  // fine ripple marks, about half a metre
    rip = mix(0.5, rip*rip*(3. - 2.*rip), clamp(1. - fw*4.2, 0., 1.));
    float meg = sin(dot(p, vec2(1.9, 0.5)) + 3.*n1(p*0.05) + wr)*0.5 + 0.5;       // broad sand waves, three metres
    meg = mix(0.5, meg, clamp(1. - fw*0.7, 0., 1.));
    vec3 sand = mix(vec3(0.30, 0.25, 0.165), vec3(0.60, 0.52, 0.35), clamp(0.12 + 0.26*rip + 0.2*meg + 0.46*big, 0., 1.));
    float weed = smoothstep(0.60, 0.80, n1(p*0.019 + 31.)*(0.72 + 0.28*n1(p*0.33)));
    sand = mix(sand, vec3(0.22, 0.31, 0.23), weed*0.6);
    float l = p.x - lineX(p.y), al = abs(l);
    float ch1 = abs((p.y + 339.) + 0.45*l)/1.097;                                 // the channel the withies mark
    float chan = (1. - smoothstep(4., 9., ch1)) * smoothstep(5., 11., al);
    float mz = n1(p*0.0021 + 3.7);                                                // a few wide winding channels far from the line
    chan = max(chan, (1. - smoothstep(0.012, 0.05, abs(mz - 0.5))) * smoothstep(60., 120., al));
    sand = mix(sand, vec3(0.09, 0.27, 0.33), chan*0.8);
    float c1 = sin(dot(p, vec2(2.3, 1.1)) + t*1.25 + 2.6*n1(p*0.7 + t*0.07));
    float c2 = sin(dot(p, vec2(-1.2, 2.6)) - t*1.0 + 2.6*n1(p*0.6 - t*0.06 + 9.));
    float cq = clamp(1. - abs(c1 + c2)*0.5, 0., 1.); float ca = cq*cq*cq * clamp(1. - fw*2.0, 0., 1.);
    vec3 col = sand*vec3(0.80, 0.97, 1.0)*uLight*(0.88 + 0.42*ca);      // seen through half a metre of clear water
    float dist = length(cameraPosition - vW);
    gl_FragColor = vec4(mix(uFogCol, col, exp(-uFogDen*uFogDen*dist*dist)), 1.);
  }
`;async function W(p,f={}){const i=new e.Group;i.name="sea";const h={value:new e.Vector4(v.zBend0,v.zBend1,v.shift,R/2)},c={value:0},m={value:new e.Color("#c8d8e0")},d={value:f.fogDensity??3e-4},u=new e.ShaderMaterial({uniforms:{uTime:c,uFogCol:m,uFogDen:d,uLight:{value:new e.Color(1,1,1)},uLine:h},vertexShader:k,fragmentShader:S}),n=new e.Mesh(new e.PlaneGeometry(2600,3400,26,34).rotateX(-Math.PI/2),u);n.position.set(35,y.bed,-520),n.name="bed",n.userData.noMirror=!0,i.add(n),await p.yield();const g=p.quality&&p.quality.detail||1,o=new z(new e.PlaneGeometry(9e3,9e3,96,96),{textureWidth:Math.round(960*g),textureHeight:Math.round(540*g),clipBias:.003,multisample:0,shader:{name:"TidalFlatMirror",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null},uTime:c,uBody:{value:new e.Color("#2a8a8a")},uRiffle:{value:new e.Color("#dfeaf0")},uFogCol:m,uFogDen:d,uLine:h,uCalm:{value:1},uCar:{value:new e.Vector4(40,D.length,0,0)},uRing:{value:new e.Vector4(r.x,r.y,r.z,1)},uRingCol:{value:new e.Color(f.ringColor||"#ffe2b0")}},vertexShader:F,fragmentShader:E}});o.material.transparent=!0,o.material.premultipliedAlpha=!0,o.material.depthWrite=!1,o.rotation.x=-Math.PI/2,o.position.set(0,y.sea,-500),o.renderOrder=3,o.name="mirror sea",o.userData.noMirror=!0,o.camera.layers.set(1),i.add(o);const w=new e.MeshBasicMaterial({color:new e.Color(f.ringColor||"#ffe2b0").multiplyScalar(2.2),fog:!1}),l=new e.Mesh(new e.TorusGeometry(r.radius,.2,8,72),w);l.position.set(r.x,r.y,r.z),l.userData.mirrorOnly=!0,l.name="the ring light for the mirror",i.add(l);const x=new e.MeshBasicMaterial({color:new e.Color(f.ringColor||"#ffe2b0").multiplyScalar(.34),fog:!1,side:e.DoubleSide}),s=new e.Mesh(new e.CircleGeometry(r.radius-.1,48),x);s.position.set(r.x,r.y,r.z-.05),s.userData.mirrorOnly=!0,s.name="the ring glow for the mirror",i.add(s);const a=o.material.uniforms;return a.uTime=c,a.uFogCol=m,a.uFogDen=d,a.uLine=h,{object:i,mirror:o,uniforms:a,bedUniforms:u.uniforms,setLight(t){t.bed&&u.uniforms.uLight.value.copy(t.bed),t.body&&a.uBody.value.copy(t.body),t.riffle&&a.uRiffle.value.copy(t.riffle),t.fog&&m.value.copy(t.fog),t.calm!==void 0&&(a.uCalm.value=t.calm),t.ring!==void 0&&(a.uRing.value.w=t.ring)},update(t,C,M){c.value=t,a.uCar.value.x=C,a.uCar.value.z=M},dispose(){n.geometry.dispose(),u.dispose(),o.dispose(),o.geometry.dispose(),l.geometry.dispose(),w.dispose(),s.geometry.dispose(),x.dispose()}}}export{W as buildSea};
