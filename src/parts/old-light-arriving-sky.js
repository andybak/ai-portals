import*as e from"three";import{DEG as M,STAR_AZ as F,STAR_EL as C,skyDir as q,BAND_GLSL as Q}from"./old-light-arriving-common.js";const g=6200,V="varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix*modelViewMatrix*vec4(position,1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p; }",D=(w,A,z,u,d,v)=>{const x=new e.BufferGeometry,y=[],p=[],a=[],f=new e.Vector3;for(let s=0;s<=v;s++)for(let t=0;t<=d;t++)q(z+(u-z)*s/v,w+(A-w)*t/d,f),y.push(f.x*g,f.y*g,f.z*g),p.push(t/d,s/v);for(let s=0;s<v;s++)for(let t=0;t<d;t++){const r=s*(d+1)+t;a.push(r,r+1,r+d+1,r+1,r+d+2,r+d+1)}return x.setAttribute("position",new e.Float32BufferAttribute(y,3)),x.setAttribute("uv",new e.Float32BufferAttribute(p,2)),x.setIndex(a),x},G=(w,A,z,u,d)=>{const v=new e.BufferGeometry,x=[],y=[];for(let p=0;p<=d;p++)for(let a=0;a<=u;a++){const f=(-w+2*w*a/u)*M,s=(A+(z-A)*p/d)*M;x.push(Math.sin(f)*g,Math.cos(f)*Math.sin(s)*g,-Math.cos(f)*Math.cos(s)*g)}for(let p=0;p<d;p++)for(let a=0;a<u;a++){const f=p*(u+1)+a;y.push(f,f+1,f+u+1,f+1,f+u+2,f+u+1)}return v.setAttribute("position",new e.Float32BufferAttribute(x,3)),v.setIndex(y),v},k=w=>new e.ShaderMaterial({depthWrite:!1,depthTest:!1,side:e.DoubleSide,fog:!1,...w}),L={transparent:!0,depthTest:!0,blending:e.CustomBlending,blendEquation:e.AddEquation,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor},T={transparent:!0,depthTest:!0,blending:e.CustomBlending,blendEquation:e.AddEquation,blendSrc:e.OneFactor,blendDst:e.OneFactor};function P(w){const{late:A,rare:z,highCloud:u,LU:d,streams:v}=w,x=new e.Group;x.frustumCulled=!1;const y=(t,r,h)=>{const i=new e.Mesh(t,r);return i.frustumCulled=!1,i.renderOrder=h,x.add(i),i},p={uStar:d.uStar,uTime:d.uTime,uFogCol:d.uFogCol,uLate:{value:A?1:0}};y(new e.SphereGeometry(g,32,20),k({uniforms:p,vertexShader:V,fragmentShader:`
    uniform vec3 uFogCol; uniform float uLate; varying vec3 vDir;
    void main(){ vec3 d = normalize(vDir); float y = d.y;
      vec3 zen = vec3(.0030,.0060,.0296), mid = vec3(.0110,.0212,.0802), hor = vec3(.0202,.0331,.1022);
      vec3 c = mix(mid, zen, smoothstep(.12,.85,y)); c = mix(hor, c, smoothstep(-.02,.24,y));
      c = mix(c, c*vec3(.62,.66,.8), uLate);
      float back = clamp(d.z, 0., 1.) / max(length(d.xz), 1e-3);                                   // 1 dead astern
      float glow = (1.-uLate) * back*back*back * exp(-max(y,0.)/.1);
      c += vec3(.36,.22,.27) * glow * .55;
      c = mix(uFogCol*1.05, c, smoothstep(-.06,.012,y));                                           // under the horizon: the haze the far plain fades into
      gl_FragColor = vec4(c, 1.); }`}),-1);let a=null;const f=t=>{const r=Math.asin(Math.max(-1,Math.min(1,t.x)))/M,h=Math.atan2(t.y,-t.z)/M,i=Math.sin(Math.max(0,Math.min(180,h))*M),c=.2/Math.sqrt(i*i+.03);return Math.abs(r)<2*c+.3};{const t=A?300:80,r=new e.InstancedBufferGeometry,h=new e.PlaneGeometry(2,2),i=new Float32Array(t*4),c=new Float32Array(t*2),n=new e.Vector3,b=q(C,F);r.index=h.index,r.setAttribute("position",h.getAttribute("position"));for(let o=0;o<t;o++){for(;;){const S=.04+.96*v.stars(),l=v.stars()*6.2832,m=Math.sqrt(1-S*S);if(n.set(Math.cos(l)*m,S,Math.sin(l)*m),n.angleTo(b)>9*M&&!f(n))break}i[o*4]=n.x,i[o*4+1]=n.y,i[o*4+2]=n.z,i[o*4+3]=.25+.75*v.stars()**3,c[o*2]=v.stars()*6.2832,c[o*2+1]=.8+2.4*v.stars()}r.setAttribute("aStar",new e.InstancedBufferAttribute(i,4)),r.setAttribute("aTw",new e.InstancedBufferAttribute(c,2)),r.instanceCount=t,a={dirs:i,tw:c,n:t},y(r,k({...T,uniforms:p,vertexShader:`
      attribute vec4 aStar; attribute vec2 aTw; uniform float uTime; varying vec2 vQ; varying float vB;
      void main(){ vec3 d = aStar.xyz, a = normalize(cross(d, vec3(0.,1.,.01))), b = cross(a, d); vQ = position.xy;
        vB = aStar.w * (.72 + .28*sin(uTime*aTw.y + aTw.x)) * smoothstep(.03,.2,d.y);
        vec4 p = projectionMatrix*modelViewMatrix*vec4((d + (a*position.x + b*position.y)*.0042)*${g}., 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p; }`,fragmentShader:`varying vec2 vQ; varying float vB;
      void main(){ float r2 = dot(vQ,vQ), px = max(fwidth(vQ.x), 1e-4), s = max(.3, 1.1*px);      // never smaller than a pixel across; its light is kept
        gl_FragColor = vec4(vec3(.74,.82,1.) * vB * 1.5 * exp(-r2/(s*s)) * (1. - smoothstep(.6, 1., sqrt(r2))) * pow(min(1., .3/s), 1.2), 1.); }`}),-.98)}const s=[v.mottle()*50,v.mottle()*50];return y(G(44,-2,182,22,72),k({...L,uniforms:{...p,uMott:{value:new e.Vector2(s[0],s[1])}},vertexShader:V,fragmentShader:`
    float olaHash(vec2 p){ vec3 q = fract(vec3(p.xyx)*.1031); q += dot(q, q.yzx+33.33); return fract((q.x+q.y)*q.z); }
    float olaNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(olaHash(i), olaHash(i+vec2(1.,0.)), f.x), mix(olaHash(i+vec2(0.,1.)), olaHash(i+vec2(1.,1.)), f.x), f.y); }
    uniform float uLate, uTime; uniform vec2 uMott; varying vec3 vDir; ${Q}
    void main(){ vec3 d = normalize(vDir);
      float off = asin(clamp(d.x,-1.,1.)) * 57.29578, e = atan(d.y, -d.z) * 57.29578, el = asin(clamp(d.y,-1.,1.)) * 57.29578;      // degrees
      float hw = olaBandHW(e);                                                                     // half width, degrees
      float px = max(fwidth(off), 1e-4), w = max(hw, .8*px);                                       // never thinner than a pixel and a half; where it is widened its light is cut by as much
      float x = off/w, high = smoothstep(15., 60., min(e, 180. - e));
      float prof = olaBandProf(x, high, olaBandLow(e));                                                           // a ribbon: even across, soft edges, a little crisper high up
      // land seen from far: uneven mottling that the eye can see, in patches of unlike size along it (seas, lands and cloud: a degree
      // or so long, and three or four), still. It is never paler than pearl: its palest patch is the pearl itself, its darkest half that.
      float m = smoothstep(.22, .78, olaNoise(vec2(e*1.1, x*1.1) + uMott)*.5 + olaNoise(vec2(e*.3, x*.4) + uMott.yx)*.5);
      float lit = olaBandLit(e, uLate);
      vec3 pearl = mix(vec3(.66,.75,.95), vec3(.92,.86,.87), m) * (.5 + .5*m);
      float I = olaBandAxis(e, lit) * (hw/w) * prof;
      // its night side: a fifth of the light (BAND_GHOST in the law), blue-grey, with a very few pin lights of its own (each a point; where a point is under a
      // pixel and a half it is widened and its light cut by as much)
      vec2 pc = vec2(e*1.7, x*1.3 + 7.), ci = floor(pc), cf = fract(pc) - .5 - .3*(vec2(olaHash(ci + 3.1), olaHash(ci + 7.7)) - .5);
      float rr = max(.05, .9*px), pd = dot(cf*vec2(1./1.7, w/1.3), cf*vec2(1./1.7, w/1.3));
      float pin = exp(-min(pd/(rr*rr), 40.)) * (.05/rr)*(.05/rr) * step(.93, olaHash(ci)) * (1. - lit) * step(abs(x), .8) * smoothstep(1., 4., e);
      vec3 col = I * mix(vec3(.62,.7,1.), pearl, lit) + vec3(.95,.82,.6) * .5 * pin;
      // (the air about it aloft takes a little of its light, in the haze's blue, twice its width: it has no hard edge. Not below thirty
      // degrees: nothing wraps its foot.)
      vec3 haze = vec3(.30,.38,.84);
      col += haze * olaBandAxis(e, 1.) * (hw/w) * exp(-min(x*x*.38, 40.)) * .12 * smoothstep(12., 30., min(e, 180. - e)) * lit;
            // (it is land seen through the whole depth of the air: its light is added to the sky's own. No star shows through it: the
      // stars' table leaves out any star that stands behind it.)
      // the low level glow along the horizon (uneven as haze is, by a still pattern of its own; a faint shimmer of air)
      float shim = .94 + .06*olaNoise(vec2(off*.5 + uTime*.16, el*.9 - uTime*.06));
      float lump = .75 + .5*olaNoise(vec2(off*.13 + 3., el*.2) + uMott);
      col += haze * olaBandGlow(off, el, uLate) * lump * shim;
      gl_FragColor = vec4(col, 0.); }`}),-.96),_(w,x,y,p,a)}function _(w,A,z,u,d){const{late:v,rare:x,highCloud:y,LU:p,streams:a}=w;{const s=new e.PlaneGeometry(2,2),t=q(C,F),r=new e.Vector3().crossVectors(t,new e.Vector3(0,1,0)).normalize(),h=new e.Vector3().crossVectors(r,t),i=s.getAttribute("position"),c=Math.tan(3.2*M),n=new e.Vector3;for(let l=0;l<i.count;l++)n.copy(t).addScaledVector(r,i.getX(l)*c).addScaledVector(h,i.getY(l)*c).multiplyScalar(g);const b=new Float32Array(12),o=new Float32Array(8);for(let l=0;l<4;l++){const m=i.getX(l),B=i.getY(l);n.copy(t).addScaledVector(r,m*c).addScaledVector(h,B*c).multiplyScalar(g),b.set([n.x,n.y,n.z],l*3),o.set([m*3.2,B*3.2],l*2)}const S=new e.BufferGeometry;S.setAttribute("position",new e.BufferAttribute(b,3)),S.setAttribute("aQ",new e.BufferAttribute(o,2)),S.setIndex(s.index),z(S,k({...T,uniforms:u,vertexShader:`attribute vec2 aQ; varying vec2 vQ;
      void main(){ vQ = aQ; vec4 p = projectionMatrix*modelViewMatrix*vec4(position,1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p; }`,fragmentShader:`uniform float uStar; varying vec2 vQ;
      void main(){ float r = length(vQ), px = max(fwidth(vQ.x), 1e-4);                             // degrees from the point; a pixel in degrees
        float s = max(.075, .75*px);                                                               // the point's spread: 0.15 of a degree across, or a pixel and a half
        float k = clamp(uStar, 0., 1.), first = pow(k, .55);
        float core = 14. * first * exp(-r*r/(s*s));
        float glare = .8 * first * exp(-r/.15) + .4 * k * pow(clamp(1.-r/2.4, 0., 1.), 3.);      // (falling all the way from the point: never a disc)
        // THE HALO IS ROUND because all of it is the star's own: the point's light is held just under the level at which the picture's
        // own glow pass would spread it (that pass spreads a point over square cells, and the display's black point then draws the
        // square's outline round the star)
        gl_FragColor = vec4(vec3(.71,.80,1.) * 1.05 * (1. - exp(-(core + glare)/1.05)), 1.); }`}),-.94)}{const s=[];for(let o=0;o<3;o++)s.push({az:-68+13*o+a.clouds.range(-3,3),el:a.clouds.range(5.5,11),w:a.clouds.range(15,25),h:a.clouds.range(.8,1.4),sd:a.clouds()*40});if(y)for(let o=0;o<9;o++){const S=o%2?1:-1;s.push({az:S*a.clouds.range(9,62),el:a.clouds.range(24,62),w:a.clouds.range(22,38),h:a.clouds.range(1.7,3.1),sd:a.clouds()*40})}const t=[],r=[],h=[],i=[],c=new e.Vector3,n=10;for(const o of s){const S=t.length/3;for(let l=0;l<=2;l++)for(let m=0;m<=n;m++)q(o.el+o.h*(l-1),o.az+o.w*(m/n-.5)/Math.cos(o.el*M),c),t.push(c.x*g,c.y*g,c.z*g),r.push(m/n,l/2),h.push(o.sd,o.w/o.h);for(let l=0;l<2;l++)for(let m=0;m<n;m++){const B=S+l*(n+1)+m;i.push(B,B+1,B+n+1,B+1,B+n+2,B+n+1)}}const b=new e.BufferGeometry;b.setAttribute("position",new e.Float32BufferAttribute(t,3)),b.setAttribute("uv",new e.Float32BufferAttribute(r,2)),b.setAttribute("aSd",new e.Float32BufferAttribute(h,2)),b.setIndex(i),z(b,k({...L,uniforms:u,vertexShader:`attribute vec2 aSd; varying vec2 vUv, vSd; varying float vY;
      void main(){ vUv = uv; vSd = aSd; vY = normalize(position).y; vec4 p = projectionMatrix*modelViewMatrix*vec4(position,1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p; }`,fragmentShader:`uniform float uStar, uTime, uLate; varying vec2 vUv, vSd; varying float vY;
      float h2(vec2 p){ vec3 q = fract(vec3(p.xyx)*.1031); q += dot(q, q.yzx+33.33); return fract((q.x+q.y)*q.z); }
      float n2(vec2 p){ vec2 i = floor(p), f = fract(p), u = f*f*f*(f*(f*6. - 15.) + 10.);
        vec4 a = 6.2831853 * vec4(h2(i), h2(i + vec2(1.,0.)), h2(i + vec2(0.,1.)), h2(i + vec2(1.,1.)));
        vec4 d = cos(a)*vec4(f.x, f.x - 1., f.x, f.x - 1.) + sin(a)*vec4(f.y, f.y, f.y - 1., f.y - 1.);
        return clamp(.5 + mix(mix(d.x, d.y, u.x), mix(d.z, d.w, u.x), u.y), 0., 1.); }
      void main(){ vec2 q = vUv*2.-1.; float asp = max(vSd.y, 1.);
        vec2 p = vec2(vUv.x*asp*.45 + vSd.x + uTime*.006, vUv.y*1.6 + vSd.x*.37);                  // the bars slide slowly along themselves
        float n = n2(p)*.45 + n2(p*vec2(2.7,3.1) + 11.)*.33 + n2(p*vec2(6.3,5.1) + 23.)*.22;       // streaks along the bar, finer and finer
        float ex = clamp(1.-q.x*q.x, 0., 1.), ey = clamp(1.-q.y*q.y, 0., 1.);
        // A CLOUD HAS NO EDGE: it is thickest along its middle and thins to nothing well inside its patch of sky, across and along, by one
        // smooth bell with no level at which a body begins; the streaks of vapour in it only thin it further. (It was a body cut out at
        // one level of that bell and filled to an even 0.55: from under it, on the climb, a flat pane with a rim.)
        float bell = ex*ex * ey*ey*ey;
        float a = bell * (.2 + .8*smoothstep(.25, .8, n)) * .36;                                    // thin: the sky and its stars show through
        float under = (1. - smoothstep(-.9, .3, q.y));                                                     // pearl beneath, from the far side's light
        vec3 c = vec3(.034,.042,.08) + vec3(.11,.115,.145)*under*mix(1., .6, uLate) + vec3(.71,.80,1.)*.06*uStar*smoothstep(.25,.6,vY+.4);
        gl_FragColor = vec4(c*a, a); }`}),-.92)}{const s=D(-78,78,-.6,3.4,96,2),t=a.range()*100;z(s,k({...L,uniforms:{...u,uSeed:{value:t}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; vec4 p = projectionMatrix*modelViewMatrix*vec4(position,1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p; }",fragmentShader:`uniform vec3 uFogCol; uniform float uStar, uSeed, uLate; varying vec2 vUv;
      float h1(float p){ p = fract(p*.1031); p *= p+33.33; p *= p+p; return fract(p); }
      float n1(float x){ float i = floor(x), f = fract(x); f = f*f*(3.-2.*f); return mix(h1(i), h1(i+1.), f); }
      float ridge(float x){ float s = 0., a = .5; for (int i = 0; i < 5; i++) { s += a*(1.-abs(2.*n1(x)-1.)); x = x*2.13+7.1; a *= .5; } return s; }
      void main(){ float az = (vUv.x-.5)*156., el = -.6 + 4.*vUv.y;
        float env = (1. - smoothstep(52., 72., abs(az)));
        // (under the far side's thread, at bearing 0, the skyline is low and even for a few degrees to either hand: the thread
        // stands beyond the range and must never seem to rise from a summit of it)
        float calm = smoothstep(3., 10., abs(az));
        float rg = ridge(az*.085 + uSeed), sky = (.55 + 2.3*rg*rg*calm) * env;                      // the skyline's height, degrees: peaks and low saddles, never one level
        float aa = max(fwidth(el), .03), a = (1. - smoothstep(sky-aa, sky+aa, el));
        float snowLine = sky*.5 + .25*n1(az*.9+uSeed*3.) - .1;
        float snow = smoothstep(snowLine-.25, snowLine+.4, el);
        float facet = .55 + .45*n1(az*2.3 + el*6. + uSeed);                                         // which slopes face the light
        vec3 rock = uFogCol*.7, sn = rock*1.1 + vec3(.71,.80,1.)*(.03*mix(1., .6, uLate) + .15*uStar*facet);
        vec3 c = mix(rock, sn, snow);
        c = mix(c, uFogCol*1.5, .3 + .6*(1. - smoothstep(0., 1.3, el)));                                   // its foot melts into the plain's haze
        // before it, two layers of low rises, crest behind crest, each nearer one a shade deeper: the country goes back into the haze in
        // layers and nothing rules a line under the range
        float h2 = (.28 + (.5*n1(az*.21 + uSeed*1.7) + .22*n1(az*.67 + 3.)) * mix(.25, 1., calm)) * env, a2 = (1. - smoothstep(h2-aa, h2+aa, el));
        float h1 = (.02 + (.38*n1(az*.13 + uSeed*2.9 + 5.) + .16*n1(az*.51 + 9.)) * mix(.4, 1., calm)) * env, a1 = (1. - smoothstep(h1-aa, h1+aa, el));
        vec3 far2 = uFogCol*1.42 + vec3(.71,.80,1.)*.02*uStar, far1 = uFogCol*1.2;
        c = mix(c, far2, a2); a = max(a, a2); c = mix(c, far1, a1); a = max(a, a1);
        gl_FragColor = vec4(c*a, a); }`}),-.9)}if(x){const t=new Float32Array(12),r=new Float32Array(12);for(let c=0;c<3;c++){const n=a.meteors()<.5,b=n?a.meteors.range(-58,-10):a.meteors.range(F+14,60),o=a.meteors.range(9,19);t.set([b,o,a.meteors.range(-7,7),a.meteors.range(-5.5,-2.5)],c*4),r.set([a.meteors.range(11,19),a.meteors()*19,a.meteors.range(3.2,4.6),0],c*4)}const h=new e.InstancedBufferGeometry,i=new e.PlaneGeometry(2,2);h.index=i.index,h.setAttribute("position",i.getAttribute("position")),h.setAttribute("aA",new e.InstancedBufferAttribute(t,4)),h.setAttribute("aB",new e.InstancedBufferAttribute(r,4)),h.instanceCount=3,z(h,k({...T,uniforms:u,vertexShader:`attribute vec4 aA, aB; uniform float uTime; varying vec2 vQ; varying float vK;
      vec3 dirOf(float el, float az){ el *= .0174533; az *= .0174533; return vec3(sin(az)*cos(el), sin(el), -cos(az)*cos(el)); }
      void main(){ float ph = fract((uTime + aB.y)/aB.x) * aB.x / aB.z, live = step(ph, 1.);       // one slow fall, then a long gap
        vec2 head = aA.xy + aA.zw*ph, tail = head - aA.zw*.34;
        vec3 h = dirOf(head.y, head.x), t = dirOf(tail.y, tail.x), side = normalize(cross(h, t) + vec3(0.,1e-5,0.));
        vQ = position.xy; vK = live * sin(3.14159*clamp(ph,0.,1.));
        vec3 d = mix(t, h, position.x*.5+.5) + side*position.y*.0016;
        vec4 p = projectionMatrix*modelViewMatrix*vec4(d*${g}., 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p; }`,fragmentShader:`varying vec2 vQ; varying float vK;
      void main(){ float along = clamp(vQ.x*.5+.5, 0., 1.), w = max(fwidth(vQ.y), 1e-4), s = max(.5, w);
        float a = along*along * exp(-vQ.y*vQ.y/(s*s)) * min(1., .5/s);
        gl_FragColor = vec4(vec3(.80,.95,.90) * .42 * a * vK, 1.); }`}),-.93)}const f=new e.Vector3;return{group:A,uniforms:u,stars:d,update(s,t){t.getWorldPosition(f),A.position.copy(f)}}}export{P as makeSkyGroup};
