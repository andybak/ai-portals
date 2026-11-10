import*as t from"three";import{makePath as J}from"../kit/core.js";import{buildHero as Z,makeClock as ee,LIGHT_GLSL as R}from"../parts/dial-towers-at-dusk.js";import{TOWERS as H,KNOTS as te,LOOKS as oe,LOOK_AHEAD as ae,FLIGHT_SECONDS as ie,RING as ne,RIVER as x,SOUND as _,COLOURS as A,RING_COLOUR as re,SKY as se,GROUND_Y as y,UNIT as O,RING_LUM as le,dirOf as z,fromEastBank as P,overWater as ce}from"../parts/dial-towers-at-dusk-data.js";const T=a=>{const n=new t.Color(a);return[n.r,n.g,n.b]},C=a=>`vec3(${a[0].toFixed(6)}, ${a[1].toFixed(6)}, ${a[2].toFixed(6)})`,N=a=>C(T(a)),I=(a,n)=>{let u=a*374761393+n*668265263|0;return u=Math.imul(u^u>>>13,1274126177),((u^u>>>16)>>>0)/4294967296};function de(){const a=s=>se[s].map(C).join(", "),n=`
      varying vec3 vDir;
      void main() { vDir = position; vec4 p = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,u=s=>`
      ${R}
      varying vec3 vDir;
      // a column: colours at 0, 10, 15, 20 and 28 degrees above the horizon, mixed straight between two neighbours
      vec3 column(vec3 c0, vec3 c1, vec3 c2, vec3 c3, vec3 c4, float up) {
        vec3 r = mix(c0, c1, clamp(up / 10., 0., 1.));
        r = mix(r, c2, clamp((up - 10.) / 5., 0., 1.));
        r = mix(r, c3, clamp((up - 15.) / 5., 0., 1.));
        return mix(r, c4, clamp((up - 20.) / 8., 0., 1.));
      }
      void main() {
        vec3 d = normalize(vDir);
        float up = max(0., degrees(asin(clamp(d.y, -1., 1.))));
        vec3 west = column(${a("west")}, up), halfw = column(${a("half")}, up), away = column(${a("away")}, up);
        vec3 sky = byShare(westShare(d.xz), west, halfw, away);
        ${s?`float units = dot(sky, vec3(.2126, .7152, .0722)) / ${O.toFixed(6)};
        gl_FragColor = vec4(sky, smooth01((units - .55) / .4));`:"gl_FragColor = vec4(sky, 1.);"}
      }`,b=new t.SphereGeometry(3e3,32,16),r=new t.Mesh(b,new t.ShaderMaterial({side:t.BackSide,depthWrite:!1,depthTest:!1,vertexShader:n,fragmentShader:u(!1)}));r.name="sky",r.renderOrder=-10,r.frustumCulled=!1;const o=new t.Mesh(b,new t.ShaderMaterial({side:t.BackSide,depthWrite:!1,depthTest:!0,depthFunc:t.LessEqualDepth,transparent:!0,vertexShader:n,fragmentShader:u(!0)}));return o.name="sky-over-rings",o.renderOrder=4.5,o.frustumCulled=!1,r.add(o),r}function fe(){const a=new t.Group,n=x.inland,u=z(x.bearing),b=x.p,r=x.width,o=3400,s=(M,F,p)=>[b[0]+u[0]*M+n[0]*F,p,b[1]+u[1]*M+n[1]*F],d=(M=>{const F=new t.BufferGeometry;return F.setAttribute("position",new t.Float32BufferAttribute(M.flat(),3)),F.setIndex([0,1,2,0,2,3]),F.computeVertexNormals(),F})([s(-o,0,0),s(-o,-r,0),s(o,-r,0),s(o,0,0)]),i=new t.Mesh(d,new t.ShaderMaterial({depthWrite:!1,side:t.DoubleSide,vertexShader:`
      varying vec3 vWp;
      void main() { vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`
      ${R}
      varying vec3 vWp;
      void main() { gl_FragColor = vec4(farFade(${N(A.river)}, vWp, cameraPosition, 1.), 1.); }`}));i.name="river",i.renderOrder=-5,i.frustumCulled=!1,a.add(i);const l=new t.Mesh(d,new t.MeshBasicMaterial({colorWrite:!1,depthWrite:!0,transparent:!0,side:t.DoubleSide}));l.name="river-level",l.renderOrder=3.8,l.frustumCulled=!1,a.add(l);const e=[],f=[],h=[],m=(M,F)=>{const p=e.length/3;for(const $ of M)e.push($[0],$[1],$[2]),f.push(F[0],F[1],F[2]);h.push(p,p+1,p+2,p,p+2,p+3)};m([s(-o,0,y),s(o,0,y),s(o,o,y),s(-o,o,y)],[0,1,0]),m([s(-o,-r,y),s(o,-r,y),s(o,-r-o,y),s(-o,-r-o,y)],[0,1,0]),m([s(-o,0,0),s(o,0,0),s(o,0,y),s(-o,0,y)],[-n[0],0,-n[1]]),m([s(-o,-r,0),s(o,-r,0),s(o,-r,y),s(-o,-r,y)],[n[0],0,n[1]]);const v=new t.BufferGeometry;v.setAttribute("position",new t.Float32BufferAttribute(e,3)),v.setAttribute("normal",new t.Float32BufferAttribute(f,3)),v.setIndex(h);const c=new t.Mesh(v,new t.ShaderMaterial({side:t.DoubleSide,vertexShader:`
      varying vec3 vN, vWp;
      void main() { vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz; vN = normal; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`
      ${R}
      varying vec3 vN, vWp;
      const vec3 TOP = ${N(A.houseRoof)}, WALL_U = ${N(A.bankUnlit)}, WALL_L = ${N(A.stoneLit)};
      void main() {
        vec3 N = normalize(vN);
        // the walls' stone in courses of 0.6 m; the tops dark as a roof
        float cy = vWp.y / .6, fw = fwidth(cy), joint = smoothstep(.44 - fw, .44, abs(fract(cy) - .5)) * (1. - smooth01((fw - .3) / .6));
        vec3 wall = mix(WALL_U, WALL_L, max(0., dot(N, KEY))) * (1. - .12 * joint);
        gl_FragColor = vec4(farFade(N.y > .5 ? TOP : wall, vWp, cameraPosition, 1.), 1.);
      }`}));c.name="ground",c.frustumCulled=!1,a.add(c);const g=new t.Mesh(v,new t.ShaderMaterial({side:t.DoubleSide,transparent:!0,depthWrite:!1,depthTest:!0,depthFunc:t.LessEqualDepth,vertexShader:c.material.vertexShader,fragmentShader:`
      ${R}
      varying vec3 vN, vWp;
      void main() {
        vec3 col = farFade(${N(A.houseRoof)}, vWp, cameraPosition, 1.);
        float units = dot(col, vec3(.2126, .7152, .0722)) / ${O.toFixed(6)};
        gl_FragColor = vec4(col, step(.5, normalize(vN).y) * smooth01((units - .2) / .2));
      }`}));return g.name="ground-over-rings",g.renderOrder=4.4,g.frustumCulled=!1,a.add(g),{group:a,river:i,plain:c}}const D=260,ve=640,ue=30;function he(a,n){const u=[];for(let d=0;d<=Math.ceil(a.length);d++){const i=a.posAtDist(Math.min(d,a.length));u.push(i.x,i.z)}const b=(d,i)=>{let l=1/0;for(let e=0;e<u.length;e+=2){const f=u[e]-d,h=u[e+1]-i,m=f*f+h*h;m<l&&(l=m)}return Math.sqrt(l)},r=(d,i)=>{let l=1/0;for(const e of H)l=Math.min(l,Math.max(Math.abs(d-e.x),Math.abs(i-e.z))-e.w/2-4.6);return l},o=[],s=(d,i,l,e,f,h,m)=>{const v=r(d,i),c=Math.min(f+h*I(l,e+71),v),g=Math.min(f+h*I(l+37,e),v),M=14+(m?15:20)*I(l+5,e+11),F=I(l+9,e+23)<.5?1:0,p=F?c:g,$=Math.min((.42+.38*I(l+13,e+3))*p,M-y-6),S=I(l+17,e+41),W=S<.35?0:.3+.45*I(l+19,e+43);o.push({x:d,z:i,ix:l,iz:e,ha:c,hb:g,top:M,roof:$,rot:F,inset:W,far:m,n:o.length})};for(let d=0,i=-420;i<=440;i+=15,d++)for(let l=0,e=-480;e<=300;e+=15,l++){const f=P(i,e);ce(i,e)||Math.abs(f)<4||Math.abs(f+x.width)<4||!(f<-x.width&&f>-x.width-70&&e>-460&&e<120)&&!(f>0&&b(i,e)<=D)||r(i,e)<4.9||s(i,e,d,l,5.2,1.5,0)}const w=ue;for(let d=200,i=-1110;i<=1110;i+=w,d++)for(let l=200,e=-1200;e<=1110;e+=w,l++){const f=P(i,e);if(f<=8&&f>=-x.width-8)continue;const h=b(i,e);h>ve||f>0&&h<=D+w/2||f<0&&f>-x.width-70-w/2&&e>-460&&e<120||r(i,e)<13||I(d+3,l+7)>=n||s(i,e,d,l,9.5,3.5,1)}return o}function pe(a){const n=(e,f,h,m)=>[e,f,h,e,h,m],b=[n([1,0,-1],[1,0,1],[1,.8,1],[1,.8,-1]),n([1,0,1],[-1,0,1],[-1,.8,1],[1,.8,1]),n([-1,0,1],[-1,0,-1],[-1,.8,-1],[-1,.8,1]),n([-1,0,-1],[1,0,-1],[1,.8,-1],[-1,.8,-1]),n([1,.8,1],[-1,.8,1],[-1,1,0],[1,1,0]),n([-1,.8,-1],[1,.8,-1],[1,1,0],[-1,1,0]),[[1,.8,-1],[1,.8,1],[1,1,0]],[[-1,.8,1],[-1,.8,-1],[-1,1,0]]],r=[],o=[];b.forEach((e,f)=>{for(const h of e)r.push(h[0],h[1],h[2]),o.push(f)});const s=new t.BufferGeometry;s.setAttribute("position",new t.Float32BufferAttribute(r,3)),s.setAttribute("aF",new t.Float32BufferAttribute(o,1));const w=new Float32Array(a.length*4);a.forEach((e,f)=>w.set([1-e.roof/(e.top-y),e.inset,e.rot,e.n],f*4)),s.setAttribute("iB",new t.InstancedBufferAttribute(w,4));const d=new t.ShaderMaterial({side:t.DoubleSide,vertexShader:`
      attribute float aF; attribute vec4 iB;
      varying vec3 vN, vWp, vK; varying vec4 vF;
      void main() {
        float ha = instanceMatrix[0].x, H = instanceMatrix[1].y, hb = instanceMatrix[2].z, rot = iB.z;
        // along the ridge and across it
        float la = mix(ha, hb, rot), lb = mix(hb, ha, rot), roofH = H * (1. - iB.x);
        vec3 p = position; float ridge = step(.9, p.y);
        p.y = mix(p.y / ${.8.toFixed(1)} * iB.x, 1., ridge); p.x *= 1. - ridge * iB.y;
        vec3 n = vec3(1., 0., 0.); float W = lb, u = p.z * lb, kind = 0.;
        if (aF > .5 && aF < 1.5) { n = vec3(0., 0., 1.); W = la; u = p.x * la; }
        else if (aF > 1.5 && aF < 2.5) { n = vec3(-1., 0., 0.); }
        else if (aF > 2.5 && aF < 3.5) { n = vec3(0., 0., -1.); W = la; u = p.x * la; }
        else if (aF > 3.5 && aF < 4.5) { n = vec3(0., lb, roofH); kind = 1.; }
        else if (aF > 4.5 && aF < 5.5) { n = vec3(0., lb, -roofH); kind = 1.; }
        else if (aF > 5.5) { n = vec3((aF < 6.5 ? 1. : -1.) * max(roofH, .01), iB.y * la, 0.); kind = step(.02, iB.y); }
        // where the ridge runs along z, the block's two level axes change places
        vec3 q = rot > .5 ? p.zyx : p; n = rot > .5 ? n.zyx : n;
        vec4 wp = modelMatrix * instanceMatrix * vec4(q, 1.);
        vWp = wp.xyz; vN = normalize(n); vF = vec4(u, p.y * H, W, H * iB.x); vK = vec3(kind, iB.w * 8. + aF, 0.);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      ${R}
      varying vec3 vN, vWp, vK; varying vec4 vF;
      const vec3 ROOF = ${N(A.houseRoof)}, WALL_U = ${N(A.houseUnlit)}, WALL_L = ${N(A.houseLit)}, WIN = ${N(A.window)};
      float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
      // the share of a pixel's footprint that lies in the band a to b of every whole step of x
      float band(float x, float a, float b, float fw) {
        fw = max(fw, 1e-4);
        float x0 = x - .5 * fw, x1 = x + .5 * fw;
        float i0 = floor(x0) * (b - a) + clamp(fract(x0), a, b) - a, i1 = floor(x1) * (b - a) + clamp(fract(x1), a, b) - a;
        return clamp((i1 - i0) / fw, 0., 1.);
      }
      void main() {
        vec3 N = normalize(vN);
        float s = max(0., dot(N, KEY)), u = vF.x, v = vF.y, W = max(vF.z, 1.), wallH = vF.w, id = floor(vK.y + .5);
        float st = v / 3.2, nst = floor(wallH / 3.2), ncol = max(4., floor(2. * W / 2.3)), pitch = 2. * W / ncol, cu = (u + W) / pitch;
        float fs = fwidth(st), fc = fwidth(cu), row = floor(st), col = floor(cu);
        // every block a little of its own tone; a band under the eaves
        float own = .86 + .28 * hash12(vec2(floor(id / 8.), 5.));
        vec3 wall = mix(WALL_U, WALL_L, s) * own * (1. - .18 * smoothstep(wallH - .9, wallH - .6, v) * step(v, wallH + .01));
        // a plain ground storey a little darker, and a thin course at every floor
        wall *= 1. - .22 * (1. - smoothstep(2.9, 3.3, v)) - .14 * band(st, 0., .07, fs) * (1. - smooth01((fs - .5) / .5));
        float m = band(st, 1. / 3.2, 2.4 / 3.2, fs) * band(cu, .5 - .45 / pitch, .5 + .45 / pitch, fc) * step(1., row) * step(row, nst - 1.);
        // a row is lit whole or dark whole; three fronts in four carry lit rows
        float P = .5 * step(.25, hash12(vec2(id, 91.)));
        float lit = mix(step(hash12(vec2(id, row)), P), P, smooth01((fs - .4) / .6));
        float tone = mix(.65 + .35 * hash12(vec2(id + col * 7.13, row)), .825, smooth01((fc - .4) / .6));
        vec3 front = mix(wall, mix(wall * .45, WIN * tone, lit), m);
        vec3 col3 = vK.x > .5 ? ROOF * (1. + .7 * s) * (.8 + .4 * hash12(vec2(floor(id / 8.), 9.))) : front;
        gl_FragColor = vec4(farFade(col3, vWp, cameraPosition, 1.), 1.);
      }`}),i=new t.InstancedMesh(s,d,a.length),l=new t.Matrix4;return a.forEach((e,f)=>{l.makeScale(e.ha,e.top-y,e.hb),l.setPosition(e.x,y,e.z),i.setMatrixAt(f,l)}),i.instanceMatrix.needsUpdate=!0,i.name="houses",i.frustumCulled=!1,i}function U(a,n,u,b,r){const o=new t.InstancedBufferGeometry,s=new t.PlaneGeometry(2,2);o.setAttribute("position",s.getAttribute("position")),o.setIndex(s.getIndex()),o.instanceCount=a.length,o.setAttribute("iL",new t.InstancedBufferAttribute(new Float32Array(a.flat()),4));const w=new t.Mesh(o,new t.ShaderMaterial({uniforms:{uH:u},transparent:!0,depthWrite:!1,blending:t.CustomBlending,blendEquation:t.AddEquation,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec4 iL; uniform float uH; varying vec2 vUv; varying float vB;
      void main() {
        vec4 mv = viewMatrix * modelMatrix * vec4(iL.xyz, 1.);
        float pxPerM = projectionMatrix[1][1] * uH * .5 / max(-mv.z, .5);
        float size = max(${b.toFixed(2)}, ${r.toFixed(1)} * uH / 450. / pxPerM);
        mv.xy += position.xy * size * .5; vUv = position.xy; vB = iL.w;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      varying vec2 vUv; varying float vB;
      const vec3 LAMP = ${N(A.lamp)};
      void main() { float a = 1. - smoothstep(.55, 1., length(vUv)); gl_FragColor = vec4(LAMP * vB * a, a); }`}));return w.name=n,w.frustumCulled=!1,w.renderOrder=3,w}const k=4,me=.5,xe=1.2,we=2.2,ge=.4,ye=1.8,Fe=2.4,q=67,be=74.8,Me=.5,K=.45,$e=.2,_e=.25,G=30,j=65,B=75,Ae=92,Ne=.75,X=.4,V=.9,Ie=.55,Y=.46;function Q(a,n,u,b,r){const o=r?64:128,s=new Float32Array((o+1)*2*3),w=[];for(let v=0;v<=o;v++)for(let c=0;c<2;c++)s.set([v/o,c?1:-1,0],(v*2+c)*3);for(let v=0;v<o;v++){const c=v*2;w.push(c,c+1,c+2,c+1,c+3,c+2)}const d=new t.InstancedBufferGeometry;d.setAttribute("position",new t.Float32BufferAttribute(s,3)),d.setIndex(w);const i=a.length*k,l=new Float32Array(i*4),e=new Float32Array(i*3);a.forEach((v,c)=>{for(let g=0;g<k;g++)l.set([v.x,v.ring,v.z,v.r0],(c*k+g)*4),e.set([v.interval,v.start,g],(c*k+g)*3)}),d.setAttribute("iC",new t.InstancedBufferAttribute(l,4)),d.setAttribute("iT",new t.InstancedBufferAttribute(e,3)),d.instanceCount=i;const f=T(re).map(v=>v*O/le),h=new t.ShaderMaterial({uniforms:{uClock:n,uH:u,uLinePx:b},transparent:!0,depthWrite:!1,side:t.DoubleSide,blending:t.CustomBlending,blendEquation:t.MaxEquation,blendSrc:t.OneFactor,blendDst:t.OneFactor,vertexShader:`
      attribute vec4 iC; attribute vec3 iT;
      uniform float uClock, uH, uLinePx;
      varying float vAcross, vHalf, vBright; varying vec2 vXz;
      float sm(float x) { x = clamp(x, 0., 1.); return x * x * (3. - 2. * x); }
      void main() {
        float age = mod(uClock - iT.y, iT.x) + iT.z * iT.x;
        float radius = iC.w + ${_.speed.toFixed(2)} * age;
        // the designer's fade by the radius; then by the ring's own level: low over the roofs and the water it keeps a
        // floor, high in the open air it thins between ${G.toFixed(0)} and ${j.toFixed(0)} m out and sinks to a trace beyond ${B.toFixed(0)} m
        float law = ${_.fadeTop.toFixed(2)} * ${_.fadeK.toFixed(1)} / (${_.fadeK.toFixed(1)} + radius);
        float low = 1. - sm((iC.y - ${q.toFixed(1)}) / ${(be-q).toFixed(1)});
        float high = max(${K.toFixed(2)}, law * (1. - ${(1-_e).toFixed(2)} * sm((radius - ${G.toFixed(1)}) / ${(j-G).toFixed(1)})));
        high *= 1. - ${(1-$e/K).toFixed(4)} * sm((radius - ${B.toFixed(1)}) / ${(Ae-B).toFixed(1)});
        float level = mix(high, max(${Me.toFixed(2)}, law), low);
        vBright = level * sm(age / ${_.easeIn.toFixed(2)}) * sm((${_.life.toFixed(1)} - age) / ${_.easeOut.toFixed(1)});
        float ang = position.x * 6.2831853, c = cos(ang), s = sin(ang);
        vec3 P = vec3(iC.x + radius * c, ${r?"-iC.y":"iC.y"}, iC.z + radius * s), T = vec3(-s, 0., c);
        vXz = P.xz;
        vec3 V = P - cameraPosition; float dist = max(length(V), .1);
        vec3 x = cross(T, V); float xl = length(x); vec3 across = xl > 1e-4 ? x / xl : vec3(0., 1., 0.);
        float pxPerM = projectionMatrix[1][1] * uH * .5 / dist, k = uH / 450.;
        float wpx = clamp(${(r?_.lineM:me).toFixed(2)} * pxPerM, uLinePx * k, ${(r?Fe:we).toFixed(1)} * k);
        ${r?"":`float fineLow = mix(${Ne.toFixed(2)}, 1., sm((level - ${X.toFixed(2)}) / ${(V-X).toFixed(2)}));
        float fineHigh = mix(${Ie.toFixed(2)}, 1., sm((level - ${Y.toFixed(2)}) / ${(V-Y).toFixed(2)}));
        wpx = max(uLinePx * k, wpx * mix(fineHigh, fineLow, low));`}
        vHalf = .5 * wpx; vAcross = position.y * (vHalf + 1.);
        ${r?"P += across * (sin(1.3 * uClock + .2 * P.x) / pxPerM);":""}
        P += across * (vAcross / pxPerM);
        gl_Position = age >= ${_.life.toFixed(1)} ? vec4(2., 2., 2., 1.) : projectionMatrix * viewMatrix * vec4(P, 1.);
      }`,fragmentShader:`
      varying float vAcross, vHalf, vBright; varying vec2 vXz;
      const vec3 RING = ${C(f)};
      void main() {
        // a hard-edged line with one pixel of smoothing at each edge, and nothing beyond it
        float a = clamp(vHalf + .5 - abs(vAcross), 0., 1.);
        ${r?`float sb = (vXz.x - ${x.p[0].toFixed(3)}) * ${x.inland[0].toFixed(6)} + (vXz.y - ${x.p[1].toFixed(3)}) * ${x.inland[1].toFixed(6)};
        a *= ${ge.toFixed(2)} * step(sb, 0.) * step(${(-x.width).toFixed(1)}, sb);`:""}
        gl_FragColor = vec4(RING * (vBright * a), 1.);
      }`}),m=new t.Mesh(d,h);return m.name=r?"ring-lines-on-water":"rings",m.frustumCulled=!1,m.renderOrder=r?3.6:4,m}const Se=a=>{const n=P(a.x,a.z),u=a.r0+_.speed*_.life;return n>0?n<u:-x.width-n<u};var Re={id:"dial-towers-at-dusk",name:"Dial Towers at Dusk",category:"books",placeKind:"city",book:"As I Walked Out One Evening",author:"W. H. Auden, 1907 to 1973",weirdness:.35,media:["air"],async build(a){const n=new t.Scene,u=a.vary||{},b=a.quality&&a.quality.detail||1,r=ee(),o={value:450},s={value:xe},w=J(te),d=de();n.add(d),await a.yield();const i=await Z(a,{city:!0,clock:r});n.add(i.object),await a.yield();const l=fe();n.add(l.group),await a.yield();const e=he(w,b);await a.yield(),n.add(pe(e)),await a.yield();{const c=[],g=[],M=x.inland,F=z(x.bearing);for(let p=0;p<127;p++){const $=p<64,S=-372+12*($?p:p-64),W=$?.4:-x.width-.4,E=x.p[0]+F[0]*S+M[0]*W,L=x.p[1]+F[1]*S+M[1]*W;c.push([E,y+2.2,L,1]),g.push([E,-(y+2.2),L,.6])}for(const p of e){if(p.n%2)continue;const $=Math.floor(4*I(p.n,3)),[S,W]=[[1,0],[0,1],[-1,0],[0,-1]][$],E=$%2?p.hb:p.ha,L=(I(p.n,5)-.5)*6;c.push([p.x+S*(E+.5)-W*L,y+6,p.z+W*(E+.5)+S*L,1])}n.add(U(c,"lamps",o,.5,2)),n.add(U(g,"lamp-points-on-water",o,.5,2)),await a.yield()}const f=Q(H,r,o,s,!1);n.add(f),await a.yield(),n.add(Q(H.filter(Se),r,o,{value:ye},!0)),await a.yield();const h=new t.Vector2,m=new t.Vector3,v=oe.map(c=>({at:c.at,from:c.from,to:c.to,fade:c.fade,weight:c.weight,steady:c.steady}));return{scene:n,path:w,duration:ie,camera:{fov:62,near:.3,far:4e3,lookAhead:ae,sway:0,bank:0},pois:v,portal:{shape:"circle",radius:ne.radius,color:"#c9d6ff",glow:1},post:{flat:1,bloom:{strength:0},grade:{saturation:1,contrast:1,vignette:0,grain:0}},ride:"none",companion:"none",style:"none",update(c,g,M){r.value=g,m.setFromMatrixPosition(M.matrixWorld),d.position.copy(m),a.renderer.getDrawingBufferSize(h),o.value=h.y,i.update(c,g,M)},dispose(){i.dispose()}}}};export{Re as default};
