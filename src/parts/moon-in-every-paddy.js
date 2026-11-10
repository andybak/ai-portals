import*as m from"three";import{clamp as xe,lerp as we}from"../kit/core.js";const pt=["#061417","#0F2B30","#1F4A4C","#5E857A","#A9C2B4","#F5EBC8","#F2A03D"],X=250,Y=165,te=2.3,V=.8,ye=.45,S=30,Me=7.2,N=8.25;function vt(T,I){let g=new Float32Array(I*T),H=0;return{push(...be){if((H+1)*T>g.length){const _=new Float32Array(g.length*2);_.set(g),g=_}return g.set(be,H*T),H++},get count(){return H},get array(){return g.subarray(0,H*T)}}}async function ht(T,I={}){const g=T.rng.fork?T.rng.fork("moon-paddy"):T.rng,H=T.noise,be=(I.palette&&I.palette.length>=7?I.palette:pt).map(e=>new m.Color(e)),[_,oe,K,B,E,Z,Ne]=be,U=new m.Group;U.name="moon-in-every-paddy-hero";const R=I.levels??g.int(38,46),ze=Math.round(R*(Y/X)),Ue=R-ze,W=[0],We=(e,t,i)=>{const v=[];let c=0;for(let l=0;l<e;l++)v.push(g.range(.7,1.4)),c+=v[l];let f=t;for(let l=0;l<e;l++)f+=(i-t)*v[l]/c,W.push(l===e-1?i:f)};We(ze,0,Y),We(Ue,Y,X);const J=ze,Se=400,$e=g.range(.76,.9),Xe=g.range(74,88),Fe=g.range(.3,.37),Ye=g.range(0,50),He=g.range(0,50),Ke=g.range(.04,.08),F=(e,t)=>{const i=W[t],v=i/X,c=Se*(1+Ke*H.n2(e*.9+Ye,3.1)+.05*Math.sin(e)*Math.sin(e)),f=Math.exp(-(e/Fe)*(e/Fe));return c*(.15+.85*Math.pow(v,$e))+5.5*v*H.n2(e*2.6+He,i*.021)+Xe*f*(t>J?.55:-.45)},le=(e,t)=>t<R?F(e,t+1)-ye*(W[t+1]-W[t]):F(e,R)+16,Ze=g.range(0,9),Je=g.range(.7,.9),Pe=e=>te-Je*Math.pow(W[e]/X,1.6)+.035*Math.sin(e*1.7+Ze),Qe=e=>{const t=Math.abs(e);for(let i=R;i>0;i--)if(Pe(i)>=t)return i;return 0},qe=e=>{const t=Qe(e);return{kt:t,r:t===R?F(e,R)+16:le(e,t),y:W[t]+.42}},me=(e,t,i,v=new m.Vector3)=>v.set(t*Math.sin(e),i,-t*Math.cos(e)),et=F(0,J),b=new m.Vector3(0,Y+.12,-(et+V+S+.3)),A=b.z+S+.5,x=b.y,pe=vt(13,14e4),ve=[],Ae=[],tt=3.3,Ce=new m.Vector3;for(let e=0;e<=R;e++){const t=W[e],i=e>0?t-W[e-1]:6,v=e===R,c=Pe(e);let f=-c,l=0;for(;f<c-1e-4;){(++l&3)===0&&await T.yield();const h=F(f,e);let o=(v?70:g.range(20,52)*(.75+.5*t/X))/h;c-(f+o)<.45*o&&(o=c-f);const p=f+o*.5,r=F(p,e),s=le(p,e),d=Math.max(.5,s-r-V),u=v||d>17,y=o*(r+s)*.5,C=g();me(p,r+V+d*.5,t,Ce);const L=Ce.x,z=t,M=Ce.z,w=u?0:xe(.36*Math.min(d,y*.6),.75,3.2);u||Ae.push({x:L,y:z,z:M,r:w,len:y,wid:d,level:e});const O=Math.max(2,Math.ceil(y/(v?9:u?6:tt)));let k=-1;for(let D=0;D<=O;D++){const $=f+o*D/O,he=y*D/O,_e=Math.sin($),st=-Math.cos($),ee=F($,e),Ge=Math.max(ee+V+.4,le($,e)),Ve=u?3:0,ce=(G,ct,lt,mt)=>pe.push(G*_e,ct,G*st,L,z,M,w,lt,C,he,mt,y,d),ge=ce(Ge,t,Ve,Ge-ee);if(ce(ee+V,t,Ve,V),ce(ee+V,t+.06,1,V),ce(ee,t+.42,1,0),ce(ee,t+.42,2,0),ce(ee-ye*i,t-i-.15,2,i),k>=0)for(let G=0;G<6;G+=2)ve.push(k+G,ge+G,k+G+1,ge+G,ge+G+1,k+G+1);k=ge}f+=o}for(const h of[-c,c]){const n=Math.sin(h),o=-Math.cos(h),p=F(h,e),r=le(h,e)+7,s=(L,z,M)=>pe.push(L*n,z,L*o,0,0,0,0,2,.5,0,M,1,1),d=s(p,t+.42,0),u=s(r+.5,t+.42,0),y=s(r+.5,-6,t),C=s(p-ye*i,-6,t);ve.push(d,u,y,d,y,C)}await T.yield()}{let t=-1;for(let i=0;i<=220;i++){(i&31)===31&&await T.yield();const v=-te+2*te*i/220,c=Math.sin(v),f=-Math.cos(v),l=qe(v),h=l.r,n=l.y,o=(s,d,u)=>pe.push(s*c,d,s*f,0,0,0,0,u,.5,0,n-d,1,1),p=o(h,n,4);o(h+25+.2*n+12*H.n2(v*2,9),n*.86,4),o(h+50+.7*n,n*.44,4),o(h+60+1.3*n,-6,4);const r=o(F(v,0)+2,-5.5,3);if(pe.push(0,-5.5,0,0,0,0,0,3,.5,0,0,1,1),t>=0){for(let s=0;s<3;s++)ve.push(t+s,p+s,t+s+1,p+s,p+s+1,t+s+1);ve.push(t+4,r,t+5)}t=p}}await T.yield();const ot=I.moonGain??1.7,j={uTime:{value:0},uFront:{value:-1e4},uLantern:{value:new m.Vector4(0,0,0,0)},uRip:{value:Array.from({length:8},()=>new m.Vector4(0,0,-100,0))},uRipC:{value:Array.from({length:8},()=>new m.Vector2(1e5,1e5))},uSkyMoon:{value:new m.Vector4(0,Math.sin(30*Math.PI/180),Math.cos(30*Math.PI/180),Math.sin(2.6*Math.PI/180))},uMinPx:{value:I.minMoonPx??.0035},uFar:{value:1},uIdle:{value:1},uLanK:{value:1},uOv:{value:new m.Vector2(90,170)},uMoonCol:{value:Z.clone().multiplyScalar(ot)},uCres:{value:0},uRain:{value:0},uFrost:{value:0},uRice:{value:new m.Vector4(_.r,_.g,_.b,1)},uPortalCol:{value:Z.clone().multiplyScalar(1.5)},uPond:{value:new m.Vector4(b.x,b.z,S+.4,b.y)},cInk:{value:_},cDeep:{value:oe},cTeal:{value:K},cSage:{value:B},cMist:{value:E},cCream:{value:Z},cAmber:{value:Ne}},ae=(e={})=>({...m.UniformsUtils.clone(m.UniformsLib.fog),...j,...e}),ue=`
    uniform float uTime, uFront, uMinPx, uFar, uCres, uRain, uFrost, uIdle, uLanK; uniform vec4 uLantern, uPond, uRice, uSkyMoon; uniform vec4 uRip[8]; uniform vec2 uRipC[8], uOv;
    uniform vec3 cInk, cDeep, cTeal, cSage, cMist, cCream, cAmber, uMoonCol, uPortalCol;
    float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
    float breezeAmp(float z){ float tau = (uFront - z) / 25.; return smoothstep(0., .3, tau) * (1. - smoothstep(1., 3.2, tau)); }
    // catspaws: slow patches of light air drifting across the bowl before the breeze. c = a paddy's centre, so each moon moves as a unit
    float idleAmp(vec2 c){
      float a = sin(c.x * .021 + uTime * .31) * sin(c.y * .017 - uTime * .23 + c.x * .004);
      float b = sin(c.x * .0083 - uTime * .17 + 2.) * sin(c.y * .0127 + uTime * .13 + 4.);
      return uIdle * .22 * smoothstep(.53, .83, .5 + .5 * max(a, .8 * b));
    }
  `,ne=ue+`
    // q: unit-disc coords; returns moon coverage, broken into sliding bars when amp > 0
    float moonBars(vec2 q, float amp, float rnd, float aa){
      float nb = 5. + floor(rnd * 2.99), by = (q.y * .5 + .5) * nb, band = floor(by);
      float off = amp * 1.15 * sin(band * 2.4 + uTime * 6. + rnd * 40.);
      float gap = step(fract(by), .2 * min(amp * 3., 1.));
      float m = 1. - smoothstep(1. - aa, 1. + aa, length(vec2(q.x - off, q.y)));
      m *= mix(1., smoothstep(1. - aa, 1. + aa, length(vec2(q.x - off - uCres, q.y - .3 * uCres))), step(.001, uCres));
      return m * (1. - gap) * step(abs(q.y), 1.);
    }
    vec3 finish(vec3 col, vec3 wp, float glow){
      float dist = distance(wp, cameraPosition);
      col = mix(col, mix(col, cTeal, .45), smoothstep(300., 440., dist) * uFar * (1. - glow));
      // the lantern's pool: a hard-edged one-step tone lift that keeps the hue, cut by eight swinging rib shadows
      vec3 dl = wp - uLantern.xyz;
      if (uLantern.w > 0. && dot(dl.xz, dl.xz) < uLantern.w * uLantern.w && abs(dl.y) < 3.5) {
        float rib = step(.82, fract(atan(dl.x, abs(dl.z) < 1e-4 ? 1e-4 : dl.z) * 1.2732 + .3 * sin(uTime * .9)));
        col = mix(col, col * 1.5 + cAmber * (.012 + .2 * dot(col, vec3(.333))), (1. - rib) * (1. - glow) * uLanK);
      }
      // static paper fibre: short horizontal strands hashed on the pixel, no time term
      vec2 pq = floor(gl_FragCoord.xy * vec2(.34, 1.));
      return col * (.962 + .07 * fract(sin(dot(pq, vec2(12.9898, 78.233))) * 43758.5453));
    }
  `,Q=new m.BufferGeometry;{const e=new m.InterleavedBuffer(pe.array.slice(),13);Q.setAttribute("position",new m.InterleavedBufferAttribute(e,3,0)),Q.setAttribute("aC",new m.InterleavedBufferAttribute(e,4,3)),Q.setAttribute("aD",new m.InterleavedBufferAttribute(e,4,7)),Q.setAttribute("aE",new m.InterleavedBufferAttribute(e,2,11)),Q.setIndex(new m.BufferAttribute(new Uint32Array(ve),1)),Q.boundingSphere=new m.Sphere(new m.Vector3(0,120,0),900)}await T.yield();const at=new m.ShaderMaterial({uniforms:ae(),fog:!0,side:m.DoubleSide,vertexShader:ue+`
      attribute vec4 aC, aD; attribute vec2 aE;
      varying vec4 vClip, vMoon, vD, vP; varying vec3 vW; varying vec2 vL, vX, vPc;
      #include <fog_pars_vertex>
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vL = position.xz; vD = aD;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition; vClip = gl_Position;
        vec4 wc = modelMatrix * vec4(aC.xyz, 1.); vec4 cc = projectionMatrix * viewMatrix * wc;
        float sinE = abs(normalize(cameraPosition - wc.xyz).y);
        float low = step(aC.y, uPond.w - 1.);                    // the terraces below the bench carry the last image: larger, brighter moons
        float R = max(aC.w * (1. + .4 * low), uMinPx * (1. + .45 * low) * cc.w / projectionMatrix[1][1]) * (1. + .03 * sin(uTime * .8 + aD.y * 6.2832));   // each moon breathes a little
        // far paddies (print licence): the disc keeps its size and may spill over its own dyke and wall, so the far walls read as moons
        float ov = smoothstep(uOv.x, uOv.y, distance(cameraPosition, wc.xyz));
        R = min(min(R, (.5 + .16 * low) * aE.y * max(sinE, mix(.5, 1., ov))), .24 * cc.w / projectionMatrix[1][1]);
        vX = vec2(1. + .3 * low, ov); vPc = aC.xz;
        vMoon = (aC.w > 0. && cc.w > .5) ? vec4(cc.xy / cc.w, R * projectionMatrix[0][0] / cc.w, R * projectionMatrix[1][1] / cc.w) : vec4(0.);
        float amp = max(breezeAmp(aC.z), idleAmp(aC.xz));
        for (int i = 0; i < 8; i++) { float age = uTime - uRip[i].z; amp = max(amp, step(distance(aC.xz, uRipC[i]), .5) * smoothstep(0., .3, age) * (1. - smoothstep(1.5, 4., age))); }
        amp = max(amp, uRain * smoothstep(.3, .6, sin(uTime * 1.7 + aD.y * 60.)));
        vP = vec4(aE, amp, -aC.z / max(length(aC.xz), 1.) + (aD.y - .5) * .3);
        #include <fog_vertex>
      }`,fragmentShader:ne+`
      varying vec4 vClip, vMoon, vD, vP; varying vec3 vW; varying vec2 vL, vX, vPc;
      #include <fog_pars_fragment>
      void main(){
        float fwR = length(fwidth(vW.xz)) * 1.1, camD = distance(vW, cameraPosition);
        float kind = vD.x, rnd = vD.y, s = vD.z, d = vD.w, L = vP.x, W = vP.y, amp = vP.z;
        vec3 col; float glow = 0.;
        if (kind < .5) {                                   // water
          col = mix(cDeep, cTeal, step(.6, (d - ${V.toFixed(2)}) / W) * .5);
          vec2 g = vec2(s, d) * 2.2; float fw = fwidth(g.x) + fwidth(g.y);
          float dots = (1. - smoothstep(.13, .2 + fw, length(fract(g) - .5) / uRice.w)) * (1. - smoothstep(.45, 1.1, fw)) * mix(.22, 1., smoothstep(11., 26., camD));   // near the lens the blades carry the rice, not polka dots
          float lq = 9., m = 0.;
          if (vMoon.z > 0.) {
            vec2 q = (vClip.xy / vClip.w - vMoon.xy) / vMoon.zw; lq = length(q);
            m = moonBars(q, amp, rnd, fwidth(lq) * .75);
            float halo = step(1.2, lq) * step(lq, 1.42) * (1. - smoothstep(0., .12, amp));
            col = mix(col, mix(cTeal, cSage, .35), halo);
          }
          col = mix(col, uRice.rgb, dots * .85 * step(2., lq));
          if (uRain > 0.) {                                  // rain: every paddy ringed
            vec2 rg = vec2(s, d) / 2.3; float rfw = fwidth(rg.x) + fwidth(rg.y);
            float rage = fract(uTime * .55 + hash21(floor(rg) + rnd * 17.));
            col = mix(col, mix(cTeal, cSage, .55), uRain * step(abs(length(fract(rg) - .5) - rage * .42), .05) * (1. - rage) * (1. - smoothstep(.15, .5, rfw)) * step(1.5, lq));
          }
          for (int i = 0; i < 8; i++) {                      // frog rings
            float age = uTime - uRip[i].z, rp = (age * 2.6 - distance(vW.xz, uRip[i].xy)) * 1.1;      // four thin concentric rings, radial only
            float ring = step(0., rp) * step(rp, 4.) * step(abs(fract(rp) - .5), max(.045, fwR)) * step(age, 4.) * step(0., age) * (1. - smoothstep(.45, 1.2, fwR));
            ring *= (1. - floor(clamp(rp, 0., 3.)) * .2) * step(distance(vPc, uRipC[i]), .5);          // fine rings, fainter outward, never across a dyke
            col = mix(col, mix(cSage, cMist, .5), ring * .7 * (1. - smoothstep(2.5, 4., age)));
          }
          float e = min(s, L - s);
          if (d < ${(V+.13).toFixed(2)} || d > W + ${(V-.22).toFixed(2)} || (e > .45 && e < .6)) { col = cInk; m = 0.; }
          if (e < .45) { col = mix(cSage, cMist, .55); m = 0.; }
          col = mix(col, uMoonCol * vX.x, m); glow = m;
        } else if (kind < 1.5) {                           // pale dyke top: the moonlit edge
          vec3 pale = mix(mix(cSage, cMist, .6 + .3 * step(.5, rnd)), cCream, uFrost) * (1. - .27 * smoothstep(110., 190., camD)) * (.7 + .3 * smoothstep(9., 15., camD));   // frost; far strips a step darker so moons out-read lines
          col = d < .3 ? pale : mix(cDeep, cTeal, .6);
          float ir = hash21(vec2(floor(s * 2.5), floor(rnd * 91.)));
          col = mix(col, d < .3 ? mix(cTeal, cSage, .6) : mix(cTeal, cSage, .5), step(.8, ir) * step(abs(fract(s * 2.5) - .5), .2));
          float fd = fwidth(d);                              // ink keyline on both edges of the pale strip, near only
          col = mix(col, cInk, max(step(d, max(.1, fd)), step(abs(d - .3), max(.05, .6 * fd))) * (1. - smoothstep(70., 150., camD)));
        } else if (kind < 2.5) {                           // wall face
          float lit = step(.2, vP.w), near = 1. - smoothstep(50., 150., distance(vW, cameraPosition));
          col = mix(cInk, cDeep, min(1., .45 + .5 * lit + .4 * (1. - smoothstep(22., 40., camD))));       // near the lens the walls lift one step, so they read as planes, not holes
          col = mix(col, mix(cDeep, cTeal, .25 + .35 * lit), step(d, 1.0));
          float hb = hash21(vec2(floor(s * 3.2), floor(rnd * 53.)));
          col = mix(col, mix(cDeep, cTeal, .25 + .35 * lit), step(.72, hb) * step(d, 1. + 1.5 * fract(hb * 7.3)) * near);
          col = mix(col, cInk, step(.9, hash21(floor(vec2(s * .35 + rnd * 77., d * .5)))) * near * .8);
          col = mix(col, cInk, step(d, .12));
        } else if (kind < 3.5) {                           // bench + crest ground
          vec2 pl = vL - uPond.xy;
          if (length(pl) < uPond.z || (abs(pl.x) < 11.3 && pl.y > 0. && pl.y < uPond.z + .7)) discard;
          col = mix(cDeep, cTeal, .4);
          float tuft = step(.9, hash21(floor(vL * 1.6))) * (1. - smoothstep(60., 160., distance(vW, cameraPosition)));
          col = mix(col, mix(cDeep, cTeal, .75), tuft);
          col = mix(col, mix(cDeep, cTeal, .2), step(.5, fract(d * .045 + .1 * sin(s * .08))));
        } else {                                           // outer hill skirt: two flat scalloped bands
          float h = d + 9. * abs(sin(vW.x * .045 + vW.z * .03));
          col = mix(mix(cInk, cDeep, .55), cInk, step(42., h));
          col = mix(col, cInk * .7, step(140., h));
        }
        if (kind > .5 && kind < 2.5 && vMoon.z > 0. && vX.y > 0.) {     // a far moon spilling over its own dyke and wall
          vec2 q = (vClip.xy / vClip.w - vMoon.xy) / vMoon.zw;
          float m = moonBars(q, amp, rnd, fwidth(length(q)) * .75) * vX.y;
          col = mix(col, uMoonCol * vX.x, m); glow = m;
        }
        gl_FragColor = vec4(finish(col, vW, glow), 1.);
        #include <fog_fragment>
      }`}),De=new m.Mesh(Q,at);De.name="terraces",U.add(De);const Ie=(e=m.FrontSide)=>new m.ShaderMaterial({uniforms:ae(),fog:!0,side:e,vertexColors:!0,vertexShader:ue+`
      attribute float aSway; varying vec3 vCol, vW;
      #include <fog_pars_vertex>
      void main(){
        vec3 p = position; vCol = color;
        float g = breezeAmp(p.z);
        p.x += aSway * (.5 * sin(uTime * .9 + p.x * .05 + p.z * .08) + .25 * sin(uTime * 2.3 + p.z * .3));
        p.z += aSway * 2.2 * g;
        vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:ne+`
      varying vec3 vCol, vW;
      #include <fog_pars_fragment>
      void main(){ gl_FragColor = vec4(finish(vCol, vW, 0.), 1.); 
        #include <fog_fragment>
      }`}),Be=()=>{const e=[],t=[],i=[],v=(l,h,n,o,p=0,r=p,s=p)=>{e.push(l.x,l.y,l.z,h.x,h.y,h.z,n.x,n.y,n.z);for(let d=0;d<3;d++)t.push(o.r,o.g,o.b);i.push(p,r,s)};return{tri:v,quad:(l,h,n,o,p)=>{v(l,h,n,p),v(l,n,o,p)},build:()=>{const l=new m.BufferGeometry;return l.setAttribute("position",new m.Float32BufferAttribute(e,3)),l.setAttribute("color",new m.Float32BufferAttribute(t,3)),l.setAttribute("aSway",new m.Float32BufferAttribute(i,1)),l},get tris(){return e.length/9}}},a=(e,t,i)=>new m.Vector3(e,t,i),P=(e,t,i)=>e.clone().lerp(t,i),Ee=e=>{const t=[],i=Math.asin(11/e),v=72;for(let c=0;c<=v;c++){const f=i+(Math.PI*2-2*i)*c/v;t.push([e*Math.sin(f),e*Math.cos(f)])}return t.push([-11,S+1.05],[11,S+1.05]),t},Te=N*2+6;{const e=Be(),t=Ee(S+.6),i=P(oe,K,.45),v=i;for(let f=0;f<t.length;f++){const l=t[f],h=t[(f+1)%t.length],n=a(b.x+l[0],x,b.z+l[1]),o=a(b.x+h[0],x,b.z+h[1]),p=n.clone().setY(x-Te),r=o.clone().setY(x-Te);e.quad(n,o,r,p,i),e.tri(p,r,a(b.x,x-Te,b.z),v)}const c=new m.Mesh(e.build(),Ie(m.DoubleSide));c.name="pond-well",U.add(c)}const nt=new m.ShaderMaterial({uniforms:ae({uG:{value:new m.Vector4(0,x,A,0)}}),fog:!0,side:m.DoubleSide,vertexShader:`
      varying vec3 vL, vW;
      #include <fog_pars_vertex>
      void main(){ vL = position; vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:ne+`
      uniform vec4 uG; varying vec3 vL, vW;
      #include <fog_pars_fragment>
      void main(){
        float h = uG.y - vL.y, amp = breezeAmp(uG.z - 6.);          // h: height of the mirrored point above water
        float by = h / 1.35, band = floor(by);
        float x = vL.x - amp * 2.4 * sin(band * 2.4 + uTime * 6.);
        if (step(fract(by), .2 * min(amp * 3., 1.)) > .5) discard;
        vec2 rp = vec2(x, h - ${N.toFixed(2)}); float rr = length(rp), glow = 0.; vec3 col;
        if (rr < ${Me.toFixed(2)}) { col = uPortalCol; glow = 1.; }
        else if (rr < ${N.toFixed(2)}) {
          float ang = atan(rp.x, rp.y) * ${(26/(Math.PI*2)).toFixed(4)};
          col = mix(cSage, cMist, .55 + .25 * step(.5, hash21(vec2(floor(ang), 3.)))) * 1.5;
          if (abs(fract(ang) - .5) > .46 || rr < ${(Me+.12).toFixed(2)} || rr > ${(N-.12).toFixed(2)}) col = cInk;
        }
        else if ((h < .5 && abs(x) < 6.4) || (h < 1. && abs(x) > 5.2 && abs(x) < 9.3) || (h < 2.5 && abs(x) > 6.7 && abs(x) < 9.) || (h < 4.25 && abs(x) > 7.95 && abs(x) < 8.75) || (h > 4.2 && h < 5.3 && abs(abs(x) - 8.35) < (5.3 - h) * .48)) col = mix(cSage, cMist, .4) * 1.4;
        else discard;
        gl_FragColor = vec4(finish(col, vW, glow), 1.);
        #include <fog_fragment>
      }`});{const e=N+4.5,t=new m.BufferGeometry,i=x-.02,v=x-N*2-1,c=A-.42;t.setAttribute("position",new m.Float32BufferAttribute([-e,i,c,e,i,c,e,v,c,-e,v,c],3)),t.setIndex([0,1,2,0,2,3]);const f=new m.Mesh(t,nt);f.name="gate-mirror",f.renderOrder=1,U.add(f)}const rt=new m.ShaderMaterial({uniforms:ae({uAlpha:{value:.5}}),fog:!0,transparent:!0,depthWrite:!1,vertexShader:ue+`
      varying vec4 vClip, vMoon; varying vec3 vW; varying vec2 vL; varying float vAmp;
      #include <fog_pars_vertex>
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vL = position.xz - uPond.xy;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition; vClip = gl_Position;
        vec4 wc = modelMatrix * vec4(uPond.x, uPond.w, uPond.y - 13., 1.); vec4 cc = projectionMatrix * viewMatrix * wc;
        float sinE = abs(normalize(cameraPosition - wc.xyz).y);
        float R = min(min(max(8.5, uMinPx * cc.w / projectionMatrix[1][1]), 24. * max(sinE, .12)), .25 * max(cc.w, .01) / projectionMatrix[1][1]);      // never more than a third of the picture's height: the great moon is seen whole
        vMoon = cc.w > .5 ? vec4(cc.xy / cc.w, R * projectionMatrix[0][0] / cc.w, R * projectionMatrix[1][1] / cc.w) : vec4(0.);
        vAmp = max(breezeAmp(uPond.y - 18.), uRain * smoothstep(.3, .6, sin(uTime * 1.7 + 2.)));          // (no catspaws here: the great moon stays whole until the breeze itself)
        for (int i = 0; i < 8; i++) { float age = uTime - uRip[i].z; vAmp = max(vAmp, step(distance(wc.xz, uRip[i].xy), 30.) * smoothstep(0., .3, age) * (1. - smoothstep(1.5, 4., age))); }
        #include <fog_vertex>
      }`,fragmentShader:ne+`
      uniform float uAlpha; varying vec4 vClip, vMoon; varying vec3 vW; varying vec2 vL; varying float vAmp;
      #include <fog_pars_fragment>
      void main(){
        float r = length(vL), fwR = length(fwidth(vW.xz)) * 1.1;
        // bokashi in three flat steps: the open water lifts toward the far bank, where it mirrors the pale foot of the sky
        vec3 vv = normalize(vW - cameraPosition); float gz = -vv.y + .018 * sin(vL.x * .21 + uTime * .25) + .012 * sin(vL.x * .57 - uTime * .4);
        // the window the gate's mirror image is seen through: the sight line carried on under the water to the mirror's plane, tested against its outline
        float mAmp = breezeAmp(uPond.y + uPond.z - 5.9), tz = (uPond.y + uPond.z - .32 - vW.z) / max(vv.z, 1e-3);
        vec2 mh = vec2(vW.x + vv.x * tz, -vv.y * tz);
        float mr = length(vec2(mh.x, mh.y - ${N.toFixed(2)})), mp = step(mh.y, 5.4);
        float win = step(0., tz) * max(step(mr, ${(N+.3).toFixed(2)} + 2.5 * mAmp), step(abs(mh.x), 9.5 + 2.5 * mAmp) * mp);
        float win0 = step(0., tz) * max(step(mr, ${(N+.3).toFixed(2)}), step(abs(mh.x), 9.5) * mp);          // the unbroken outline: rice dots keep out of this only
        float s1 = step(gz, .42), s2 = step(gz, .24);
        vec3 col = mix(cDeep, cTeal, .2 + .45 * s1); col = mix(col, mix(cTeal, cSage, .24), s2);
        float aOut = max(uAlpha, .82 * s1 + .1 * s2), a = mix(aOut, uAlpha, win), m = 0., lq = 9.; vec2 qm = vec2(9.);
        vec3 cWell = mix(cDeep, cTeal, .45); col = mix(col, cWell + (aOut / uAlpha) * (col - cWell), win);      // inside the window the thinner water is tinted so it lands on the same tone as the water around it
        // sliding dashes, the print-maker's sign for moving water: sparse when calm, crowding and paling when the breeze crosses
        {
          vec2 dg = vec2(vL.x / 3.4, vL.y / 1.2); float row = floor(dg.y);
          dg.x += .37 * row + (.22 + .6 * vAmp) * sin(row * 2.4 + uTime * 1.1) + .35 * vAmp * sin(row * 1.3 + uTime * 5.);
          float dh = hash21(vec2(floor(dg.x), row) + 7.);
          float dash = step(1. - (.1 + .34 * vAmp), dh) * step(abs(fract(dg.x) - .5), .15 + .22 * fract(dh * 7.)) * step(abs(fract(dg.y) - .5), .15) * (1. - smoothstep(.3, .8, fwidth(dg.y))) * (1. - .75 * win0);
          col = mix(col, mix(mix(cTeal, cSage, .5), cMist, .75 * vAmp), dash); a = max(a, dash * .9);
        }
        if (vMoon.z > 0.) {
          vec2 q = (vClip.xy / vClip.w - vMoon.xy) / vMoon.zw; lq = length(q); qm = q;
          m = moonBars(q, vAmp, .93, fwidth(lq) * .75);
          float halo = step(1.14, lq) * step(lq, 1.3) * (1. - smoothstep(0., .12, vAmp));
          col = mix(col, mix(cTeal, cSage, .35), halo); a = max(a, halo * .85);
        }
        vec2 g = vec2(r, atan(vL.x, vL.y) * floor(r * 2.) / 2.) * 2.; float fw = fwidth(g.x) + fwidth(vL.x) * 2.;
        float dots = (1. - smoothstep(.13, .2 + fw, length(fract(g) - .5))) * (1. - smoothstep(.45, 1.1, fw)) * step(1.45, lq) * (1. - win0);
        col = mix(col, uRice.rgb, dots * .85); a = max(a, dots);
        if (uRain > 0.) {
          vec2 rg = vL / 2.3; float rfw = fwidth(rg.x) + fwidth(rg.y);
          float rage = fract(uTime * .55 + hash21(floor(rg)));
          float rr = uRain * step(abs(length(fract(rg) - .5) - rage * .42), .05) * (1. - rage) * (1. - smoothstep(.15, .5, rfw)) * step(1.45, lq);
          col = mix(col, mix(cTeal, cSage, .55), rr); a = max(a, rr);
        }
        for (int i = 0; i < 8; i++) {
          float age = uTime - uRip[i].z, rp = (age * 2.6 - distance(vW.xz, uRip[i].xy)) * 1.1;
          float ring = step(0., rp) * step(rp, 4.) * step(abs(fract(rp) - .5), max(.045, fwR)) * step(age, 4.) * step(0., age) * (1. - smoothstep(.45, 1.2, fwR)) * (1. - smoothstep(2.5, 4., age));
          ring *= (1. - floor(clamp(rp, 0., 3.)) * .2) * .7;
          col = mix(col, mix(cSage, cMist, .5), ring); a = max(a, ring);
        }
        // the printed sky moon mirrored in the pond once we are out over it: a disc cut into bars, and a path of sliding bars either side of it
        {
          vec3 rf = vec3(vv.x, -vv.y, vv.z), mrt = normalize(cross(uSkyMoon.xyz, vec3(0., 1., 0.))), mup = cross(mrt, uSkyMoon.xyz);
          vec2 mq = vec2(dot(rf, mrt), dot(rf, mup)) / (uSkyMoon.w * 1.3);
          float ay = abs(mq.y), aa2 = fwidth(mq.x) * .9, cm = 0.;
          float calm = .1 + .9 * min(vAmp * 3., 1.);
          if (ay < 1.) {
            float by = (mq.y * .5 + .5) * 6., bd = floor(by);
            float off = (.1 + .5 * vAmp) * sin(bd * 2.4 + uTime * 1.7) + .3 * vAmp * sin(bd * 1.9 + uTime * 6.);
            float hw = sqrt(max(1. - mq.y * mq.y, 0.));
            cm = (1. - smoothstep(hw - aa2, hw + aa2, abs(mq.x - off))) * (1. - step(fract(by), .22 * calm));
          } else {
            float tl = (ay - 1.) / (mq.y > 0. ? 5. : 2.6), by = ay * 2.1, bd = floor(by) + step(0., mq.y) * 9.;
            float off = (.3 + .45 * vAmp) * sin(bd * 2.4 + uTime * 1.7) + .3 * vAmp * sin(bd * 1.9 + uTime * 6.);
            float hw = .86 * pow(max(1. - tl, 0.), .7) * (.55 + .45 * hash21(vec2(bd, 3.)));
            cm = (1. - smoothstep(hw - aa2, hw + aa2, abs(mq.x - off))) * step(.45, fract(by)) * step(tl, 1.) * .8;
          }
          cm *= step(0., dot(rf, uSkyMoon.xyz)) * smoothstep(-31., -19., cameraPosition.z - uPond.y) * (1. - smoothstep(.5, 1.5, aa2));
          m = max(m, cm);
        }
        // the great moon is printed, not blank: its seas in one flat step, a shade under the cream
        float seas = max(max(step(length(qm - vec2(-.34, .30)), .30), step(length(qm - vec2(.12, .46)), .21)), max(step(length(qm - vec2(.30, -.02)), .27), max(step(length(qm - vec2(-.12, -.38)), .19), step(length(qm - vec2(.47, -.45)), .11)))) * step(lq, .94);
        col = mix(col, uMoonCol * .52 * (1. - .34 * seas), m); a = max(a, m);
        gl_FragColor = vec4(finish(col, vW, m), a);
        #include <fog_fragment>
      }`});{const e=Ee(S+.2),t=[b.x,x,b.z],i=[];for(const f of e)t.push(b.x+f[0],x,b.z+f[1]);for(let f=0;f<e.length;f++)i.push(0,1+f,1+(f+1)%e.length);const v=new m.BufferGeometry;v.setAttribute("position",new m.Float32BufferAttribute(t,3)),v.setIndex(i);const c=new m.Mesh(v,rt);c.name="round-paddy",c.renderOrder=2,U.add(c)}await T.yield();const re=a(0,x+N,A),q=Be();{const t=Math.PI*2/26,i=.14,v=(n,o,p)=>{const r=Math.cos(o);return n===0?P(B,E,.38+.3*p):n===1||n===7?_.clone():n===2?r>.15?P(B,E,.8):P(K,B,.4):n===3||n===5?P(E,Z,.35).multiplyScalar(.92):n===4?P(E,Z,.12*p).multiplyScalar(.9):r>0?P(K,B,.25):P(oe,K,.6)};for(let n=0;n<26;n++){const o=g(),p=N+(g.chance(.3)?g.range(.05,.16):0),r=Me-(g.chance(.2)?.06:0),s=.5+g.range(0,.07),d=[[r+i,-s],[p-i,-s],[p,-s+i],[p,s-i],[p-i,s],[r+i,s],[r,s-i],[r,-s+i]],u=.0045,y=n*t+u,C=(n+1)*t-u,L=3,z=(M,w)=>a(re.x+w[0]*Math.sin(M),re.y+w[0]*Math.cos(M),re.z+w[1]);for(let M=0;M<L;M++){const w=we(y,C,M/L),O=we(y,C,(M+1)/L);for(let k=0;k<8;k++){const D=d[k],$=d[(k+1)%8];q.quad(z(w,D),z(w,$),z(O,$),z(O,D),v(k,(w+O)/2,o))}}for(const M of[y,C])for(let w=1;w<7;w++)q.tri(z(M,d[0]),z(M,d[w]),z(M,d[w+1]),_)}const c=(n,o,p,r,s,d,u=.12,y=.5)=>{const C=P(B,E,.3+.3*y),L=P(E,Z,.1).multiplyScalar(.9),z=P(K,B,.7),M=P(B,E,.85),w=r-u;q.quad(a(n,p,s),a(o,p,s),a(o,w,s),a(n,w,s),C),q.quad(a(o,p,d),a(n,p,d),a(n,w,d),a(o,w,d),L),q.quad(a(n,p,d),a(n,p,s),a(n,w,s),a(n,w,d),z),q.quad(a(o,p,s),a(o,p,d),a(o,w,d),a(o,w,s),z),q.quad(a(n,w,s),a(o,w,s),a(o-u,r,s+u),a(n+u,r,s+u),_),q.quad(a(o,w,d),a(n,w,d),a(n+u,r,d-u),a(o-u,r,d-u),P(E,Z,.35).multiplyScalar(.92)),q.quad(a(n,w,d),a(n,w,s),a(n+u,r,s+u),a(n+u,r,d-u),M),q.quad(a(o,w,s),a(o,w,d),a(o-u,r,d-u),a(o-u,r,s+u),M),q.quad(a(n+u,r,s+u),a(o-u,r,s+u),a(o-u,r,d-u),a(n+u,r,d-u),M)};c(-6.4,6.4,x-.04,x+.5,A-.95,A+1.15,.14,.4);for(const n of[-1,1]){const o=n*5.2,p=n*9.3,r=Math.min(o,p),s=Math.max(o,p);c(r,s,x-.04,x+1,A-.8,A+1,.14,g());const d=n>0?r+1.5:r+.3,u=n>0?s-.3:s-1.5;c(d,u,x+1,x+2.5,A-.68,A+.82,.13,g());const y=n>0?d+1.25:d+.25,C=n>0?u-.25:u-1.25;c(y,C,x+2.5,x+3.9,A-.5,A+.6,.1,g()),c(y-.28,C+.28,x+3.9,x+4.25,A-.82,A+.92,.12,g());const L=(y+C)/2,z=a(L,x+5.3,A+.05),M=x+4.25,w=a(y-.1,M,A-.62),O=a(C+.1,M,A-.62),k=a(C+.1,M,A+.72),D=a(y-.1,M,A+.72);q.tri(w,O,z,P(B,E,.45)),q.tri(O,k,z,P(K,B,.7)),q.tri(k,D,z,P(E,Z,.2).multiplyScalar(.9)),q.tri(D,w,z,P(K,B,.7))}const f=96,l=Math.asin(11.2/S),h=(n,o,p)=>a(b.x+o*Math.sin(n),p,b.z+o*Math.cos(n));for(let n=0;n<f;n++){const o=l+(Math.PI*2-2*l)*n/f,p=l+(Math.PI*2-2*l)*(n+1)/f;q.quad(h(o,S-.1,x-.06),h(p,S-.1,x-.06),h(p,S+.25,x+.3),h(o,S+.25,x+.3),_),q.quad(h(o,S+.25,x+.3),h(p,S+.25,x+.3),h(p,S+.95,x+.3),h(o,S+.95,x+.3),P(B,E,n%5===0?.6:.85)),q.quad(h(o,S+.95,x+.3),h(p,S+.95,x+.3),h(p,S+1.5,x-.2),h(o,S+1.5,x-.2),P(_,oe,.6))}}{const e=I.cedars??520;await T.yield();for(let t=0;t<e;t++){(t&127)===127&&await T.yield();const i=g.range(-te+.03,te-.03);if(Math.abs(i)<.03)continue;const v=qe(i),c=v.kt===R,f=!c||g.chance(.45),l=f?g.range(c?18:3,c?80:45):g.range(3,15),h=(c?F(i,R):v.r)+l,n=f?v.y-(c?l-16:l)*.45-1.5:X+.3,o=g.range(20,35),p=o*g.range(.17,.23),r=me(i,h,n),s=g.range(0,6.28),d=g.range(-.6,.6);if(I.keepOut&&I.keepOut(r.x,r.z,p,c?l:999))continue;const u=.6;q.quad(a(r.x-u,r.y,r.z),a(r.x+u,r.y,r.z),a(r.x+u*.5,r.y+o*.3,r.z),a(r.x-u*.5,r.y+o*.3,r.z),_);for(let y=0;y<3;y++){const C=r.y+o*(.16+.25*y),L=y===2?r.y+o:C+o*.44,z=p*(1-.26*y),M=Math.pow((C-r.y)/o,2),w=Math.pow((L-r.y)/o,2),O=a(r.x+d*(L-r.y)/o,L,r.z);for(let k=0;k<5;k++){const D=s+k*1.2566,$=D+1.2566,he=D+.6283,_e=Math.cos(he)>.25?P(_,oe,.85):Math.sin(he)>.3?P(_,oe,.3):_.clone().multiplyScalar(.8);q.tri(a(r.x+Math.sin(D)*z,C,r.z+Math.cos(D)*z),a(r.x+Math.sin($)*z,C,r.z+Math.cos($)*z),O,_e,M,M,w)}}}}await T.yield();const ke=new m.Mesh(q.build(),Ie(m.DoubleSide));ke.name="gate-and-cedars",ke.geometry.boundingSphere=new m.Sphere(new m.Vector3(0,150,0),900),U.add(ke),await T.yield();const Oe=[];{const e=[],t=[],i=[];let v=.05;for(let l=R;l>=1;l--){v=l===J||l===J+1?0:xe(v+g.range(-.012,.012),-.08,.08);const h=W[l]-W[l-1],n=F(v,l)-.3,o=(l===J?3.2:g.range(1.3,2.6))*.5,p=Math.cos(v),r=Math.sin(v),s=me(v,n,W[l]+.5),d=me(v,n-ye*h-.25,W[l-1]+.05),u=e.length/3,y=g.range(0,10);Oe.push(s.clone()),e.push(s.x-p*o,s.y,s.z-r*o,s.x+p*o,s.y,s.z+r*o,d.x+p*o*1.25,d.y,d.z+r*o*1.25,d.x-p*o*1.25,d.y,d.z-r*o*1.25),t.push(0,y,1,y,1,y+h,0,y+h),i.push(u,u+1,u+2,u,u+2,u+3)}const c=new m.BufferGeometry;c.setAttribute("position",new m.Float32BufferAttribute(e,3)),c.setAttribute("uv",new m.Float32BufferAttribute(t,2)),c.setIndex(i);const f=new m.Mesh(c,new m.ShaderMaterial({uniforms:ae(),fog:!0,side:m.DoubleSide,vertexShader:`varying vec2 vUv; varying vec3 vW;
        #include <fog_pars_vertex>
        void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        }`,fragmentShader:ne+`varying vec2 vUv; varying vec3 vW;
        #include <fog_pars_fragment>
        void main(){
          float lane = floor(vUv.x * 5.), fx = fract(vUv.x * 5.);
          float run = step(fract(vUv.y * .32 - uTime * (.55 + .12 * lane) + lane * .37), .62);
          float on = step(abs(fx - .5), .3) * run;
          vec3 col = mix(mix(cDeep, cTeal, .7), cCream * 1.25, on);
          gl_FragColor = vec4(finish(col, vW, on), 1.);
          #include <fog_fragment>
        }`}));f.name="falls",U.add(f)}if(I.mist!==!1){const e=(t,i,v,c)=>{const f=new m.PlaneGeometry(1700,1900,1,1);f.rotateX(-Math.PI/2),f.translate(0,t,520);const l=new m.Mesh(f,new m.ShaderMaterial({uniforms:ae({uRho:{value:i},uTone:{value:v},uSeed:{value:c}}),fog:!0,transparent:!0,depthWrite:!1,vertexShader:`varying vec3 vW; varying vec2 vL;
          #include <fog_pars_vertex>
          void main(){ vL = position.xz; vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
          }`,fragmentShader:ne+`uniform float uRho, uTone, uSeed; varying vec3 vW; varying vec2 vL;
          #include <fog_pars_fragment>
          void main(){
            float wide = uRho * (1. + max(vL.y, 0.) * .0022);
            float d = vL.y > 0. ? abs(vL.x) : length(vL);
            float along = vL.y > 0. ? vL.y : atan(vL.x, vL.y) * uRho;
            float sc = 16. * abs(sin(along * .034 + uSeed + uTime * .03)) + 7. * abs(sin(along * .09 + uSeed * 2.));
            if (d + sc > wide || vL.y + 26. * abs(sin(vL.x * .03 + uSeed)) > 430.) discard;
            // bokashi: inside the hard scalloped edge the tone is wiped up softly toward the middle of the band
            float core = 1. - smoothstep(wide - 70., wide - 8., d + sc * 1.6);
            vec3 col = mix(mix(cSage, cMist, uTone) * .4, cMist * .56, core);
            gl_FragColor = vec4(finish(col, vW, 0.), .42 + .3 * core);
            #include <fog_fragment>
          }`}));l.renderOrder=3,l.name="valley-mist",U.add(l)};e(12,150,.55,g.range(0,6)),e(22,92,.8,g.range(0,6))}const ie=F(0,R),Re=[a(0,X+2,-(ie+15)),a(0,X+2.2,-(ie+1))];for(let e=R-1;e>J;e-=3)Re.push(a(we(0,5,(R-e)/(R-J)),W[e]+5.5,-(F(0,e)+3)));Re.push(a(5,Y+2.2,b.z-S-26),a(2,x+1.8,b.z-S-2),a(0,x+3.4,b.z),a(0,x+6.6,b.z+17),re.clone(),a(0,re.y,A+40));const je=(e,t)=>{const i=Math.hypot(e,t),v=xe(Math.atan2(e,-t),-te,te),c=qe(v);if(i>c.r)return Math.max(-6,c.y-(i-c.r)*.45);for(let f=c.kt;f>=0;f--)if(i>=F(v,f))return W[f];return-5.5},it=a(0,Math.sin(30*Math.PI/180),Math.cos(30*Math.PI/180)),se={portalSeat:{position:re.clone(),facing:a(0,0,-1),normal:a(0,0,-1),radius:Me},flyThrough:Re,viewpoints:{reveal:a(0,X+2.2,-(ie+1)),overPond:a(0,x+3.4,b.z),across:a(ie*.55,Y+40,-ie*.2)},ridgeEntry:a(0,X+.42,-(ie+15)),pondCenter:b.clone(),pondRadius:S,benchY:Y,waterY:x,gateBase:a(0,x,A),farmhouseSeat:a(46,Y,b.z-22),camphorSeat:a(58,Y,b.z-2),wheelSeat:a(-9,Y,b.z-S-16),streamLine:Oe,moonDir:it,paddies:Ae,heightAt:je,levels:W,topLevel:R,benchLevel:J,contour:(e,t,i=0,v=new m.Vector3)=>me(e,F(e,t)+i,W[t]+.42,v),radiusAt:(e,t)=>F(e,t),outerAt:(e,t)=>le(e,t),phiEnd:Pe,breeze:{speed:25,zStart:-(Se+60),zEnd:Se+140}};let Le=!1,fe=0;const de=new m.Vector3;return{object:U,radius:70,height:120,center:a(0,200,40),extent:{radius:400,skirtRadius:760,height:285},anchors:se,uniforms:j,ground:!0,groundY:-6,setProgress(e){Le=!0,j.uFront.value=we(se.breeze.zStart,se.breeze.zEnd,xe(e,0,1))},setBreezeFront(e){Le=!0,j.uFront.value=e},plop(e,t,i=j.uTime.value){const v=je(e,t);let c=null,f=1e9;for(const l of Ae){if(Math.abs(l.y-v)>.01)continue;const h=(l.x-e)*(l.x-e)+(l.z-t)*(l.z-t);h<f&&(f=h,c=l)}c?j.uRipC.value[fe].set(c.x,c.z):j.uRipC.value[fe].set(1e5,1e5),de.set(e,0,t),U.localToWorld(de),j.uRip.value[fe].set(de.x,de.z,i,0),fe=(fe+1)%8},setLantern(e,t=12){j.uLantern.value.set(e.x,e.y,e.z,t)},update(e,t){j.uTime.value=t,Le||(j.uFront.value=se.breeze.zStart+t*25%(se.breeze.zEnd-se.breeze.zStart+150))},dispose(){}}}export{ht as buildHero};
