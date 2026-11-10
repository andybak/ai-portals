import*as t from"three";import*as I from"../kit/fx.js";import{lipZ as E,BRIDGE as oe,CITY as O,MIRROR_GLSL as re}from"./asgard-bridge-of-light-plan.js";const D=W=>W.toFixed(1),ne=W=>Math.min(.8*Math.sqrt(W),14),he=`
attribute float aDrop, aS;
varying vec3 vDir, vSeaW, vSeaN; varying float vDrop, vBend, vS;
void main(){
  vec4 w = modelMatrix*vec4(position, 1.); vSeaW = w.xyz; vSeaN = normal; vDrop = aDrop; vS = aS; vBend = 1. - normal.y;
  vDir = reflect(w.xyz - cameraPosition, normal);          // the mirrored sight line (exact on the flat sheet)
  gl_Position = projectionMatrix*viewMatrix*w;
}`,le=`varying vec3 vDir; varying vec3 vSeaW, vSeaN; varying float vDrop, vBend, vS;
uniform vec3 uSeaBody, uSeaFog; uniform float uSeaDim, uSeaFogD, uSeaMist, uSeaTime;
${re}
float abH(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float abN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f); return mix(mix(abH(i), abH(i + vec2(1., 0.)), f.x), mix(abH(i + vec2(0., 1.)), abH(i + vec2(1., 1.)), f.x), f.y); }
float abK(float a, float b){ return clamp(1.5 - 1.66*max(a, b), 0., 1.); }      // how much of a pattern is left when a pixel covers a (across) or b (along) of its cells: all under 0.3, none over 0.9
vec4 abSea(vec3 c, vec3 d){
  float fwS = length(fwidth(vSeaW.xz));                                    // the footprint on the water, in metres: taken once
  float far = length(vSeaW.xz - cameraPosition.xz), alpha = 1.;
  float g = 1. - clamp(d.y, 0., 1.), g2 = g*g, fres = .46 + .54*g2*g;      // glass: a full mirror toward the horizon, darker looking down
  float lum = dot(c, vec3(.299, .587, .114));
  c = c*(uSeaDim + .7*smoothstep(.12, .5, lum))*fres + uSeaBody*(1.2 - .8*g2);      // the mirrored sky over deep water: the stars, the star clouds and the moons keep more of their light than the dark between them
  c += vec3(.016, .024, .040)*g2*g2*g2;                                  // a faint cool sheen toward the horizon
  float ax = abs(vSeaW.x);
  float gl = abN(vec2(vSeaW.x*.45 + uSeaTime*.35, vSeaW.z*1.9 - uSeaTime*.6))*abN(vec2(vSeaW.x*1.1 - uSeaTime*.5, vSeaW.z*.7 + uSeaTime*.3) + 31.);
  float glint = smoothstep(.38, .62, gl)*clamp(1.4 - fwS*.9, 0., 1.);      // short glints, no two alike, coming and going
  // THE BRIDGE'S LIGHT ON THE WATER either side of it: the colours passing that stretch, strong beside the slab, a faint wash far out
  float by = 1. - smoothstep(${D(oe.z0)}, ${D(oe.z0+40)}, vSeaW.z);
  vec3 hue = abHue(vSeaW.z*.0031 - uSeaTime*.11 + .06*abN(vec2(vSeaW.z*.02 - uSeaTime*1.3, 3.)));
  c += hue*by*(.30*exp(-ax/16.) + .02*exp(-ax/70.))*(.85 + .4*glint);
  // THE CITY'S GOLD lying on the water round the island
  float cd = max(length(vSeaW.xz - vec2(${D(O.x)}, ${D(O.z)})) - ${D(O.r)}, 0.);
  c += vec3(1., .66, .26)*(.13*exp(-cd/150.) + .035*exp(-cd/600.))*(.9 + .25*glint);
  float sl = (abLipZ(vSeaW.x + 1.) - abLipZ(vSeaW.x - 1.))*.5, edge = (vSeaW.z - abLipZ(vSeaW.x))/sqrt(1. + sl*sl), onGlass = 1. - step(.001, vBend);
  // where the glass ends the water quickens and thins: a soft sheen over its last metres, carried on over the edge (no line there: a line finer than a pixel would break into beads)
  float fe = fwidth(edge), e6 = (1. - smoothstep(0., 6. + fe, edge))*6./(6. + fe); c += vec3(.045, .06, .09)*e6*e6*onGlass;      // (seen low over the water the sheen's band is finer than a pixel: it is spread over the pixel and dimmed)
  c = mix(c, vec3(.30, .36, .50), uSeaMist*.3*smoothstep(900., 3500., far)*onGlass);      // the mist night: the far water pales
  // every derivative the fall uses is taken here, before its branch, so that it is defined at the lip too
  float fs = fwidth(vS) + fwidth(vDrop)*.05, fh = fwidth(vDrop);                 // the footprint along the edge and down the fall, in metres
  float q = sqrt(max(vDrop, 0.) + 3.), fq = fwidth(q);                           // falling water quickens: its patterns are laid out along q and run down it
  if(vDrop > 0.){
    // THE FALL
    float h = vDrop, qt = q - uSeaTime*1.3;
    float k0 = abK(fs*.036, fq*.18), k1 = abK(fs*.11, fq*.4), k2 = abK(fs*.26, fq*.9), k3 = abK(fs*.62, fq), k4 = abK(fs*1.45, fq*2.);
    float u0 = abN(vec2(vS*.017 + 3., uSeaTime*.03));                             // where more water goes over and where less, along the edge
    // falling streaks at four breadths (9 m, 3.8 m, 1.6 m and 0.7 m), each several times longer than broad, and fine bright threads among them
    float W = .30*mix(.5, abN(vec2(vS*.11 + 4., qt*.25)), k1) + .27*mix(.5, abN(vec2(vS*.26 + 9., qt*.5)), k2)
      + .24*mix(.5, abN(vec2(vS*.62 + 2., qt)), k3) + .19*mix(.5, abN(vec2(vS*1.45, qt*2.)), k4);
    float thread = smoothstep(.56, .9, abN(vec2(vS*3.1 + 5., qt*2. + 3.)))*abK(fs*3.1, fq*2.);
    // hanks of water (28 m, 9 m and 3.5 m broad), falling with it: where they are thin the body opens lower down
    float M = .45*mix(.5, abN(vec2(vS*.036 + 7., qt*.18)), k0) + .3*mix(.5, abN(vec2(vS*.115 + 4., qt*.4 + 2.)), k1) + .25*mix(.5, abN(vec2(vS*.29 + 6., qt*.9 + 5.)), k2);
    float streak = smoothstep(.33, .67, W);
    vec3 fn = vSeaN*inversesqrt(max(dot(vSeaN, vSeaN), 1e-8)); float lit = .72 + .6*max(dot(fn, vec3(-.418, .518, -.746)), 0.);      // the faces toward the key light are brighter
    float deep = smoothstep(0., 200., h), dim = mix(1., .36, deep)*(.85 + .3*u0);      // brightest under the lip, dimmer and bluer with the depth
    vec3 v = mix(vec3(.13, .20, .38), vec3(.62, .72, .95), clamp(streak*(.45 + .8*M) + .3*thread, 0., 1.))*lit*dim*mix(vec3(1.), vec3(.74, .86, 1.), deep);
    v += abHue(vSeaW.z*.0031 - uSeaTime*.11)*.14*dim*exp(-ax/50.);              // near the bridge it takes the colours passing there
    // the lip: glass over the turn (the still water's own colour carried over, with a sheen), then the broken rim of foam
    // along the lip a pattern must be ten pixels long to be drawn in full (a finer one would show as beads on so thin a line); the slowest (60 m) carries on far off
    float kA = clamp(1.5 - fs*.42, 0., 1.), kB = clamp(1.5 - fs*1.65, 0., 1.), kC = clamp(1.5 - fs*3., 0., 1.), kD = clamp(1.5 - fs*.35, 0., 1.), thin = clamp(1.5 - fh*1.6, 0., 1.);
    float f0 = (1. + 4.5*mix(.5, abN(vec2(vS*.085 + 2., uSeaTime*.05)), kA)*(.5 + .5*mix(.5, abN(vec2(vS*.33, uSeaTime*.15)), kB)))*(.7 + .6*u0);      // where the glass breaks into foam: 1 to 5.5 m down, more where more water goes over
    float wd = 2. + 2.*mix(.5, abN(vec2(vS*.09 + 5., 1.)), clamp(1.5 - fs*.45, 0., 1.));      // the rim's breadth, 2 to 4 m (11 m cells, eased to their mean by the same rule)
    float full = mix(.7, .35 + .65*smoothstep(.2, .6, abN(vec2(vS*.6 + 8., uSeaTime*.2))), kC)*(.55 + .45*mix(.6, smoothstep(.15, .55, abN(vec2(vS*.07, 4.))), kD))*(.8 + .4*abN(vec2(vS*.017 + 11., uSeaTime*.02)));
    float rim = smoothstep(f0 - .4 - fh, f0 + .4 + fh, h)*(1. - smoothstep(f0 + wd*.5, f0 + wd + fh*2., h))*full*wd/(wd + fh);
    c = mix(uSeaBody*1.2, c, clamp(1.5 - fh*3., 0., 1.)) + vec3(.09, .125, .19);      // the curve's own sheen; its mirror of the sky only where a pixel is finer than the curve (far off the mirror's quick turn would be a line finer than a pixel, and break into beads)
    c += vec3(.10, .13, .19)*(mix(.5, streak, thin) + thread*thin)*smoothstep(.5, f0 + .5, h);      // the sheen of the curve; the first threads of foam in it
    v = mix(v, vec3(.78, .86, 1.)*lit, (1. - smoothstep(f0 + 1., f0 + 15. + fh, h))*(.12 + .6*streak));      // the foam spills on for some 15 m under the rim
    v = mix(v, vec3(.84, .91, 1.)*(.78 + .22*streak)*lit, rim);
    c = mix(c, v, smoothstep(f0 - .6 - fh, f0 + .9 + fh, h));
    // from 60 m down the body opens: holes where the hanks are thin, more and wider with the depth, until only streamers are
    // left, then falling clumps; a fringe of spray round each, and a soft haze where they end
    float th = mix(-.12, .88, pow(clamp((h - 60.)/300., 1e-4, 1.), .45)) - .14*(u0 - .5), w = .07 + .25*(1. - k1);
    float core = smoothstep(th - w, th + w, M), fringe = smoothstep(th - .3 - w, th + .02, M);
    float hz = .4 + .6*abN(vec2(vS*.02 + 1., q*.2 - uSeaTime*.1));
    float cov = max(core*mix(1., .55, smoothstep(100., 380., h)), fringe*.3);      // the water itself
    float bk = max(.3*smoothstep(110., 260., h), .5*smoothstep(55., 100., h)*(1. - smoothstep(230., 400., h)))*hz;      // behind it, in the gaps: spray in shadow, so that the gaps are dark
    alpha = cov + (1. - cov)*bk;
    c = mix(mix(vec3(.035, .06, .13), c*.5, smoothstep(110., 300., h)), c*mix(.55, 1., core), cov/max(alpha, 1e-3));
    alpha *= 1. - smoothstep(310., 440., h);
  }
  float fd = far*uSeaFogD; return vec4(mix(uSeaFog, c, exp(-fd*fd)), alpha*(1. - smoothstep(4200., 7600., far)));
}
`,fe=[[[1.5,-3,0],[4,-20,.3],[8,-70,.8],[13,-160,1],[19,-300,.85],[25,-450,0]],[[12,-40,0],[19,-90,.6],[30,-170,1],[46,-300,1],[60,-440,.8],[72,-580,0]],[[30,-90,0],[44,-180,.5],[60,-300,.85],[76,-460,.55],[90,-620,0]]];function me(W,p,S,ie={}){const K=ie.mist?1:0,c=new t.Group;c.name="sea";const g=[0,1,2,3,4,5,6.5,8,10,12.5,15,18,22,26,30,35,40];for(let e=50;e<=250;e+=10)g.push(e);for(let e=255;e<=350;e+=5)g.push(e);for(let e=350,r=25;e<9e3;r*=1.3)e+=r,g.push(e);const M=g.slice(1).reverse().map(e=>-e).concat(g),G=M.length-1,d=[9e3,5e3,2800,1600,950,600,380,230,120,30,-60,-160,-270,-390,-510],b=d.length+2,$=[0,.5,1.2,2.2,3.6,6,10,16,26,40,60,100,160,240,330,440],v=b+$.length,x=[0,3,6,9,12,15,b,b+6,b+10],q=[],z=[],N=[],B=[],j=[],R=[],U=[],Z=[];let w=0;for(let e=0;e<=G;e++){const r=M[e],i=E(r),n=E(r+.5)-E(r-.5),T=Math.hypot(n,1),o=n/T,s=-1/T;e&&(w+=Math.hypot(r-M[e-1],i-E(M[e-1]))),Z.push([r,i,o,s,w]);for(const a of d)q.push(r,0,a),z.push(0,1,0),N.push(0),B.push(w);for(const a of[1/3,2/3])q.push(r,0,d[d.length-1]+(i-d[d.length-1])*a),z.push(0,1,0),N.push(0),B.push(w);for(const a of $){const l=ne(a),h=a>0?.4/Math.sqrt(a):1e3,f=Math.hypot(1,h);q.push(r+o*l,-a,i+s*l),z.push(o/f,h/f,s/f),N.push(a),B.push(w)}if(e)for(let a=0;a<v-1;a++){const l=(e-1)*v+a,h=e*v+a,f=[l,l+1,h,h,l+1,h+1];(a>=b?U:j).push(...f)}if(e)for(let a=0;a<x.length-1;a++){const l=(e-1)*v+x[a],h=(e-1)*v+x[a+1],f=e*v+x[a],se=e*v+x[a+1];R.push(l,h,f,f,h,se)}}const m=new t.BufferGeometry;m.setAttribute("position",new t.Float32BufferAttribute(q,3)),m.setAttribute("normal",new t.Float32BufferAttribute(z,3)),m.setAttribute("aDrop",new t.Float32BufferAttribute(N,1)),m.setAttribute("aS",new t.Float32BufferAttribute(B,1)),m.setIndex(U.concat(j));const H=new t.BufferGeometry;H.setAttribute("position",m.attributes.position),H.setIndex(R);const y=S.material.fragmentShader,V="gl_FragColor = vec4(max(col, 0.), uOpacity);",P=y.lastIndexOf(V),Y=`vec3 d = normalize(vDir);
  float pix`;let k=P>=0?y.slice(0,P)+"gl_FragColor = abSea(max(col, 0.), d);"+y.slice(P+V.length):y;k=k.replace("varying vec3 vDir;",le),k=k.replace(Y,`float ripK = .0012*clamp(1.5 - length(fwidth(vSeaW.xz))*.35, 0., 1.); vec3 ripN = normalize(vec3((sin(vSeaW.x*.9 + vSeaW.z*.35 + uSeaTime*.8) + sin(vSeaW.x*.23 - vSeaW.z*.61 - uSeaTime*.5))*ripK, 1., (sin(vSeaW.z*.8 - vSeaW.x*.27 + uSeaTime*.7) + sin(vSeaW.z*.19 + vSeaW.x*.5 + uSeaTime*.4))*ripK));
  vec3 dd = vBend < .001 ? reflect(vSeaW - cameraPosition, ripN) : vDir; vec3 d = dd*inversesqrt(max(dot(dd, dd), 1e-8));
  float pix`);const X={...S.uniforms,uSeaBody:{value:new t.Color(.008,.017,.036)},uSeaFog:p.uFogColor,uSeaFogD:p.uFogDensity,uSeaDim:{value:.5},uSeaMist:{value:K},uSeaTime:p.uTime},A=new t.Mesh(m,new t.ShaderMaterial({name:"abSeaMirror",uniforms:X,defines:{...S.material.defines},vertexShader:he,fragmentShader:k,transparent:!0,depthWrite:!1,side:t.DoubleSide,forceSinglePass:!0}));A.frustumCulled=!1,A.renderOrder=.1,c.add(A);const C=new t.Mesh(H,new t.MeshBasicMaterial({colorWrite:!1,depthWrite:!0,transparent:!0,side:t.DoubleSide,forceSinglePass:!0}));C.frustumCulled=!1,C.renderOrder=.6,c.add(C);const F=new t.Mesh(new t.BoxGeometry(2,1,2).translate(0,-.5,0),new t.ShaderMaterial({name:"abSkyBelow",uniforms:S.uniforms,defines:{...S.material.defines,NUM_BODIES:0},vertexShader:"varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix*vec4(mat3(viewMatrix)*position, 1.); if(abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }",fragmentShader:y.replace(Y,`vec3 d = vDir*inversesqrt(max(dot(vDir, vDir), 1e-8)); d = vec3(-d.z, abs(d.y), d.x);
  float pix`),side:t.DoubleSide,depthWrite:!1,depthTest:!0,fog:!1,toneMapped:!1}));F.frustumCulled=!1,F.renderOrder=-.9,c.add(F);const J=[],Q=[],ee=[],te=[],ae=[];let _=0;fe.forEach((e,r)=>{for(let i=0;i<=G;i++){const n=Z[i],T=Math.sign(n[0]);for(const o of e){const s=n[0]+n[2]*o[0],a=T?Math.min(Math.max(s*T/14,0),1):o[0]>12?0:1;J.push(s,o[1],n[1]+n[3]*o[0]),Q.push(o[2]*(o[0]>9?a:1)),ee.push(n[4]),te.push(r)}if(i)for(let o=0;o<e.length-1;o++){const s=_+(i-1)*e.length+o,a=_+i*e.length+o;ae.push(s,s+1,a,a,s+1,a+1)}}_+=(G+1)*e.length});const u=new t.BufferGeometry;u.setAttribute("position",new t.Float32BufferAttribute(J,3)),u.setAttribute("aEdge",new t.Float32BufferAttribute(Q,1)),u.setAttribute("aS",new t.Float32BufferAttribute(ee,1)),u.setAttribute("aLay",new t.Float32BufferAttribute(te,1)),u.setIndex(ae);const L=new t.Mesh(u,new t.ShaderMaterial({name:"abSprayAndMist",uniforms:{uTime:p.uTime,uGlowP:p.uGlowP,uThick:{value:K?1.3:1}},transparent:!0,depthWrite:!1,side:t.DoubleSide,forceSinglePass:!0,vertexShader:"attribute float aEdge, aS, aLay; varying vec3 vW; varying float vE, vS, vLay; void main(){ vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vE = aEdge; vS = aS; vLay = aLay; gl_Position = projectionMatrix*viewMatrix*w; }",fragmentShader:`precision highp float; uniform float uTime, uThick; uniform vec3 uGlowP[3]; varying vec3 vW; varying float vE, vS, vLay;
      ${I.GLSL_HASH}${I.GLSL_VALUE_NOISE}${I.GLSL_FBM}
      ${re}
      void main(){
        float dist = length(vW - cameraPosition), hz = dist*.0005, h = max(-vW.y, 0.), n, a; vec3 c;
        float fl = fwidth(vS);      // the footprint along the edge, taken before the branch
        if(vLay < .5){      // the spray: long soft plumes going down with the water
          vec2 q = vec2(vS*.05, sqrt(h + 3.)*.35 - uTime*.42); n =.6*mix(.5, vnoise(q), clamp(1.5 - fl*.08, 0., 1.)) + .4*mix(.5, vnoise(q*vec2(2.7, 1.9) + 5.3), clamp(1.5 - fl*.22, 0., 1.));
          a = smoothstep(.4, .8, n)*.36; c = vec3(.36, .45, .66)*(.6 + .6*n)*mix(1., .45, smoothstep(30., 320., h));
        } else {            // the mist: soft and slow, sinking at 4 m a second, drifting along the edge
          vec2 q = vec2(vS*.014 + vLay*3.7 + uTime*.0086, vW.y*.009 + uTime*(.034 + .006*vLay)); n = fbm(q + .45*vnoise(q*2.1 - uTime*.02));
          a = smoothstep(.36, .66, n)*(vLay < 1.5 ? .8 : .45); c = vec3(.33, .40, .58)*(.6 + .5*n);
        }
        a *= vE*exp(-hz*hz)*uThick;      // thinned by its own rows (none at its top and bottom) and by air by distance; never by where the eye is
        c += abHue(vW.z*.0031 - uTime*.11)*.16*exp(-abs(vW.x)/55.)*(1. - smoothstep(20., 260., h));      // the bridge's colours near the bridge
        for(int i = 0; i < 3; i++){ vec3 d = uGlowP[i] - vW; c += vec3(.62, .50, .40)*.12/(1. + dot(d, d)/60000.); }      // lit by the gate house and its beam where they are near
        gl_FragColor = vec4(c*a, a);
      }`,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor}));return L.frustumCulled=!1,L.renderOrder=1.3,c.add(L),{object:c,sheet:A,uniforms:X,below:F,bank:L}}export{me as buildSea};
