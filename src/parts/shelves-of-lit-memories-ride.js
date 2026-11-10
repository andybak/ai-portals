import*as a from"three";import{makeRng as $,hashSeed as O}from"../kit/core.js";import*as I from"../kit/fx.js";import{TUBES as S,TUBE as R,TRACK as A,RAIL as _,courseAt as J,spineAt as Y,LANE as K,TOWER as D,ORB as k,ORB_SHARE as H,MOUTH as z,RING as B}from"./shelves-of-lit-memories-plan.js";const N=`
#ifdef USE_FOG
  varying float vFogDepth;
#endif`,L=`
#ifdef USE_FOG
  uniform vec3 fogColor; uniform float fogDensity; varying float vFogDepth;
  float rideHaze(){ return 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth); }
#else
  float rideHaze(){ return 0.; }
#endif`,P=()=>({fogColor:{value:new a.Color(2497104)},fogDensity:{value:5e-4},fogNear:{value:1},fogFar:{value:4e3}}),j=(c,f)=>`
uniform vec3 uP[${c}];
vec3 rideAt(float base, float cnt, float t, out vec3 tang){
  float tc = ${f?"mod(t, cnt)":"clamp(t, 0., cnt - 1.001)"}, i = floor(tc), u = tc - i;
  ${f?"int i0 = int(base + mod(i - 1. + cnt, cnt)), i1 = int(base + i), i2 = int(base + mod(i + 1., cnt)), i3 = int(base + mod(i + 2., cnt));":"int i0 = int(base + max(i - 1., 0.)), i1 = int(base + i), i2 = int(base + min(i + 1., cnt - 1.)), i3 = int(base + min(i + 2., cnt - 1.));"}
  vec3 p0 = uP[i0], p1 = uP[i1], p2 = uP[i2], p3 = uP[i3];
  vec3 b = p2 - p0, c = 2.*p0 - 5.*p1 + 4.*p2 - p3, d = 3.*p1 - p0 - 3.*p2 + p3;
  tang = .5*(b + 2.*c*u + 3.*d*u*u);
  return .5*(2.*p1 + b*u + c*u*u + d*u*u*u);
}`,Q=c=>{const f=[];for(const n of c)for(const s of n.points)f.push(new a.Vector3(s[0],s[1],s[2]));return f},V=(c,f)=>{const n=J(c,f),s=new a.Vector3(n[3],n[4],n[5]).normalize(),m=new a.Vector3(-s.z,0,s.x).normalize(),u=new a.Vector3().crossVectors(s,m).negate();return{P:new a.Vector3(n[0],n[1],n[2]),T:s,R:m,U:u.y<0?u.negate():u}};function Z(c){const f=[],n=[],s=[],m=[],u=[];for(const o of S){const w=o.points.length,p=Math.round(o.length/5.6),r=f.length/3,e=o===S[0]||o===S[5]?16:10;for(let l=0;l<=p;l++){const i=V(o,l/p*(w-1));for(let t=0;t<=e;t++){const b=t/e*Math.PI*2,h=Math.cos(b),v=Math.sin(b),M=i.R.clone().multiplyScalar(h).addScaledVector(i.U,v);f.push(i.P.x+M.x*R.r,i.P.y+M.y*R.r,i.P.z+M.z*R.r),n.push(M.x,M.y,M.z),s.push(i.T.x,i.T.y,i.T.z),m.push(l/p*o.length,t/e)}}for(let l=0;l<p;l++)for(let i=0;i<e;i++){const t=r+l*(e+1)+i,b=t+e+1;u.push(t,b,t+1,t+1,b,b+1)}}const g=new a.BufferGeometry;g.setAttribute("position",new a.Float32BufferAttribute(f,3)),g.setAttribute("normal",new a.Float32BufferAttribute(n,3)),g.setAttribute("aT",new a.Float32BufferAttribute(s,3)),g.setAttribute("uv",new a.Float32BufferAttribute(m,2)),g.setIndex(u);const y=new a.ShaderMaterial({name:"slmGlass",transparent:!0,depthWrite:!1,side:a.DoubleSide,fog:!0,blending:a.CustomBlending,blendSrc:a.OneFactor,blendDst:a.OneMinusSrcAlphaFactor,uniforms:{...P(),uTime:c.uTime},vertexShader:`attribute vec3 aT; varying vec3 vN, vW, vT; varying vec2 vUv; ${N}
      void main(){ vUv = uv; vN = normal; vT = aT; vec3 ctr = position - normal*${R.r.toFixed(2)};      // the tube's middle line
        float dist = length((modelMatrix*vec4(ctr, 1.)).xyz - cameraPosition), rr = max(${R.r.toFixed(2)}, dist*.0032);      // far off the glass is drawn wider, never a hairline (a level of detail by where the eye is)
        vec4 w = modelMatrix*vec4(ctr + normal*rr, 1.); vW = w.xyz; vec4 mv = viewMatrix*w; gl_Position = projectionMatrix*mv;
      #ifdef USE_FOG
        vFogDepth = -mv.z;
      #endif
      }`,fragmentShader:`precision highp float; varying vec3 vN, vW, vT; varying vec2 vUv; uniform float uTime; ${L}
      void main(){
        vec3 n = vN*inversesqrt(max(dot(vN, vN), 1e-6)), v = cameraPosition - vW; float d2 = dot(v, v); v *= inversesqrt(max(d2, 1e-6));
        vec3 tg = vT*inversesqrt(max(dot(vT, vT), 1e-6)), vp = v - tg*dot(v, tg); vp *= inversesqrt(max(dot(vp, vp), 1e-4));      // the sight line across the tube: looked along, a tube still shows its two edges and a clear middle
        float f = 1. - abs(dot(n, vp));                    // the glass shows at its grazing edges
        float far = smoothstep(1.5e4, 2.5e5, d2);      // from 120 m to 500 m off the glass gathers into one soft line of light (a level of detail by where the eye is)
        float ew = max(.52, 2.4*fwidth(f)), edge = smoothstep(1. - ew, 1. - .3*ew, f), rim = mix(edge, f*f*(.35 + .65*f), far);      // seen near: two crisp bright lines at the grazing edges and a clear body between them (never under a pixel and a half); far off the soft rim
        float tw = max(.012, 1.8*fwidth(n.y)), hl = smoothstep(1. - tw, 1. - .3*tw, n.y);      // seen near: one fine bright line along the top
        float sheen = mix(hl, smoothstep(.72, 1., n.y)*.92, far) + smoothstep(.55, 1., -n.y)*.14*far;      // far off the dome's light along the top, the brighter upper edge, and the lanes' glow under it
        vec3 col = vec3(.74, .72, 1.)*(.012 + .9*rim) + vec3(.96, .93, 1.)*sheen*mix(.95, .55, far) + vec3(.74, .7, 1.)*far*.4;      // almost no fill: what lies behind shows through
        float a = clamp(.012 + .9*rim + mix(.85, .38, far)*sheen + .34*far, 0., .94), k = 1. - rideHaze();
        float body = (1. - far)*(.016 + .045*smoothstep(.35, .9, n.y));      // seen near, a faint presence (each of the two walls adds half of it): about 3 parts in 100 of fill, and a soft band of light along the top third
        gl_FragColor = vec4((col*a + vec3(.82, .8, 1.)*body)*k, (a*.5 + .3*body)*k);
      }`}),d=new a.Mesh(g,y);return d.name="tubes",d.renderOrder=6,d.frustumCulled=!1,{mesh:d,triangles:u.length/3}}const q={transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendSrc:a.OneFactor,blendDst:a.OneMinusSrcAlphaFactor};function W(){const c=new a.InstancedBufferGeometry;return c.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),c.setIndex([0,1,2,0,2,3]),c}function ee(c,f){const n=$(O("shelves-of-lit-memories:tube-orbs:"+c.seed)),s=Object.keys(H),m=s.map(t=>new a.Color(k[t]).multiplyScalar(t==="grey"?.4:1)),u=46,g=24,y=[],d=[],o=[];let w=0,p=0;for(const t of S){const b=t===S[5],h=t.points.length,v=Math.max(4,Math.round(t.length/(b?g/2:g))),M=b?1:p++%2?-1:1;for(let x=0;x<v;x++){const T=n.range(-.3,.3),F=n(),U=n();let C=0,G=F;for(;C<s.length-1&&(G-=H[s[C]],!(G<0));C++);y.push(w,h,t.length),d.push((x+.5+T)/v,M,b?1:0,U),o.push(m[C].r,m[C].g,m[C].b)}w+=h}const r=W(),e=d.length/4;r.setAttribute("aCourse",new a.InstancedBufferAttribute(new Float32Array(y),3)),r.setAttribute("aRun",new a.InstancedBufferAttribute(new Float32Array(d),4)),r.setAttribute("aCol",new a.InstancedBufferAttribute(new Float32Array(o),3)),r.instanceCount=e;const l=new a.ShaderMaterial({name:"slmTubeOrb",...q,fog:!0,uniforms:{...P(),uTime:f.uTime,uP:{value:Q(S)}},vertexShader:`attribute vec3 aCourse, aCol; attribute vec4 aRun; uniform float uTime; varying vec2 vQ; varying vec3 vCol, vMv; varying float vSeed, vNear; ${N}
      ${j(w,!1)}
      void main(){
        float s = fract(aRun.x + aRun.y*uTime*${u.toFixed(1)}/aCourse.z);      // the share of its course run, by the clock
        vec3 tg; vec3 c = rideAt(aCourse.x, aCourse.y, s*(aCourse.y - 1.), tg);
        float ends = smoothstep(0., 12., s*aCourse.z)*smoothstep(0., 12., (1. - s)*aCourse.z);      // nothing at either end of the tube
        vec4 mv = viewMatrix*vec4(c, 1.); float dist = length(mv.xyz);
        float big = max(1., dist/200.), share = mix(1., .3, smoothstep(220., 900., dist)), seen = 1. - smoothstep(share - .06, share + .06, aRun.w*.9 + .05);      // far off fewer beads and larger ones, never a row of dots (a level of detail by where the eye is)
        mv.xy += position.xy*ends*big*seen*(1. + .34*aRun.z);      // tube F's balls (aRun.z 1) are larger by a third: the tube the way passes closest
        gl_Position = projectionMatrix*mv; vQ = position.xy; vCol = aCol; vSeed = aRun.w; vMv = mv.xyz; vNear = aRun.z;
      #ifdef USE_FOG
        vFogDepth = -mv.z;
      #endif
      }`,fragmentShader:`precision highp float; varying vec2 vQ; varying vec3 vCol, vMv; varying float vSeed, vNear; uniform float uTime; ${L}
      ${I.GLSL_HASH}${I.GLSL_VALUE_NOISE}
      void main(){
        float r2 = dot(vQ, vQ), thick = sqrt(max(1. - r2, 0.)), r = sqrt(max(r2, 1e-6)), seed = vSeed, foot = max(fwidth(r), 1e-4);
        vec3 n = vec3(vQ, thick), rd = vMv*inversesqrt(max(dot(vMv, vMv), 1e-6)), q = n + rd*(.55*thick);
        float ang = uTime*(.20 + .22*seed) + seed*40. + q.y*1.7, ca = cos(ang), sa = sin(ang);
        vec3 qs = vec3(ca*q.x - sa*q.z, q.y, sa*q.x + ca*q.z);
        float keep = 1. - smoothstep(.10, .45, foot);
        float sw = mix(.5, smoothstep(.30, .74, .62*vnoise(qs*2.2 + seed*17.) + .38*vnoise(qs*4.6 + vec3(0., uTime*.06, 0.) + seed*5.)), keep);
        vec3 col = vCol*(.34 + .52*thick)*(.50 + 1.30*sw) + mix(vCol, vec3(1.), .6)*(sw*sw*.60*thick);
        float f1 = 1. - clamp(-dot(n, rd), 0., 1.), fres = f1*f1*f1;
        col += vCol*fres*.55 + vec3(.15, .13, .34)*fres*.6;
        float hl = max(dot(reflect(rd, n), mat3(viewMatrix)*vec3(0., .75, .66)), 0.), h2 = hl*hl, h8 = h2*h2*h2*h2, h64 = h8*h8*h8*h8*h8*h8*h8*h8;
        col += vec3(1., .97, .92)*(1.5*h64 + .10*h8)*keep;
        float a = (1. - smoothstep(1. - 1.5*foot, 1., r))*(1. - rideHaze());
        gl_FragColor = vec4(col*(1.55 + .65*smoothstep(4e4, 6.4e5, dot(vMv, vMv)))*(1. + .3*vNear)*a, a);      // a little brighter than on a shelf: it is seen through the glass; brighter still far off, a bead of light
        if (r2 > 1.) discard;
      }`}),i=new a.Mesh(r,l);return i.name="tube-orbs",i.renderOrder=5,i.frustumCulled=!1,{mesh:i,triangles:e*2}}const X=44,te=11.2,oe=`
float rideLaid(float along){      // how brightly the track is laid at a place: faint all round, bright ahead of an engine, dimming behind a last car
  float g = 0.;
  for (int k = 0; k < 3; k++) { float d = mod(along - uTime*${_.speed.toFixed(1)} - float(k)*${(A.length/3).toFixed(2)}, ${A.length.toFixed(2)});      // metres ahead of the engine's front
    float back = ${A.length.toFixed(2)} - d;
    g = max(g, max(1. - smoothstep(55., 90., d), 1. - smoothstep(${X.toFixed(1)}, ${(X+260).toFixed(1)}, back))); }
  return g;
}`;function ae(c){const f=A.points.length,n=Math.round(A.length/3.6),s=[],m=[],u=[],g=[],y=_.gauge/2,d=Math.SQRT1_2;for(let r=0;r<=n;r++){const e=V(A,r/n*f),l=r/n*A.length;for(const i of[-1,1])for(const[t,b]of[[d,d],[-d,d],[-d,-d],[d,-d],[d,d]])s.push(e.P.x+e.R.x*y*i,e.P.y,e.P.z+e.R.z*y*i),m.push(e.R.x*t+e.U.x*b,e.R.y*t+e.U.y*b,e.R.z*t+e.U.z*b),u.push(l,0);for(const i of[-1,1])s.push(e.P.x+e.R.x*(y+.45)*i-e.U.x*.16,e.P.y-e.U.y*.16,e.P.z+e.R.z*(y+.45)*i-e.U.z*.16),m.push(0,0,0),u.push(l,i)}for(let r=0;r<n;r++){const e=r*12,l=e+12;for(const i of[0,5])for(let t=0;t<4;t++)g.push(e+i+t,l+i+t,e+i+t+1,e+i+t+1,l+i+t,l+i+t+1);g.push(e+10,l+10,e+11,e+11,l+10,l+11)}const o=new a.BufferGeometry;o.setAttribute("position",new a.Float32BufferAttribute(s,3)),o.setAttribute("aOff",new a.Float32BufferAttribute(m,3)),o.setAttribute("uv",new a.Float32BufferAttribute(u,2)),o.setIndex(g);const w=new a.ShaderMaterial({name:"slmTrack",...q,side:a.DoubleSide,fog:!0,uniforms:{...P(),uTime:c.uTime},vertexShader:`attribute vec3 aOff; varying vec2 vUv; varying float vRail, vThin, vNear; ${N}
      void main(){ vUv = uv; float rail = step(.5, dot(aOff, aOff));
        vec3 c = (modelMatrix*vec4(position, 1.)).xyz; float dist = length(c - cameraPosition), w = max(.24, dist*.0024);      // half the bar's width across its corners: far off a rail is drawn wider, an unbroken line
        vec4 mv = viewMatrix*vec4(c + aOff*w*rail, 1.); gl_Position = projectionMatrix*mv; vRail = rail; vNear = .24/w; vThin = max(vNear, .45);
      #ifdef USE_FOG
        vFogDepth = -mv.z;
      #endif
      }`,fragmentShader:`precision highp float; varying vec2 vUv; varying float vRail, vThin, vNear; uniform float uTime; ${L}
      ${oe}
      void main(){
        float g = rideLaid(vUv.x), k = 1. - rideHaze();
        float u = vUv.x/2.4, fw = fwidth(u)*2.4, w = .34 + fw, dd = abs(fract(u) - .5)*2.4;      // a tie every 2.4 m
        float tie = (1. - smoothstep(w*.5, w, dd))*min(.34/w*1.5, 1.)*(1. - smoothstep(.78, .98, abs(vUv.y)))*smoothstep(.2, .6, vNear);      // the ties melt away far off (from about 110 m, gone by 330 m)
        float a = mix(tie*.55, clamp(vThin, 0., 1.), step(.5, vRail));
        vec3 col = mix(vec3(.7, .6, 1.)*(.1 + .5*g), vec3(1., .86, .6)*(.22 + .64*g), step(.5, vRail));
        gl_FragColor = vec4(col*a*k, a*k*mix(.4, .85, step(.5, vRail)));
      }`}),p=new a.Mesh(o,w);return p.name="track",p.renderOrder=4,p.frustumCulled=!1,{mesh:p,triangles:g.length/3}}function ne(c){const f=[],n=[],s=[],m=[],u=[[1,0,0],[0,1,0],[0,0,1]],g=(o,w,p)=>{for(let r=0;r<3;r++)for(const e of[-1,1]){const l=u[(r+1)%3],i=u[(r+2)%3],t=f.length/3;for(const[b,h]of[[-1,-1],[1,-1],[1,1],[-1,1]]){for(let v=0;v<3;v++)f.push(o[v]+(u[r][v]*e+l[v]*b+i[v]*h)*w[v]/2);n.push(u[r][0]*e,u[r][1]*e,u[r][2]*e),s.push(p)}e>0?m.push(t,t+1,t+2,t,t+2,t+3):m.push(t,t+2,t+1,t,t+3,t+2)}},y=(o,w,p,r,e,l=12)=>{const i=(h,v)=>{const M=Math.cos(h)*w,x=Math.sin(h)*w;return r===2?[o[0]+M,o[1]+x,o[2]+v*p/2]:[o[0]+M,o[1]+v*p/2,o[2]-x]},t=h=>r===2?[Math.cos(h),Math.sin(h),0]:[Math.cos(h),0,-Math.sin(h)],b=f.length/3;for(let h=0;h<=l;h++){const v=h/l*Math.PI*2;for(const M of[-1,1])f.push(...i(v,M)),n.push(...t(v)),s.push(e)}for(let h=0;h<l;h++){const v=b+h*2;m.push(v,v+2,v+1,v+1,v+2,v+3)}for(const h of[-1,1]){const v=f.length/3,M=r===2?[0,0,h]:[0,h,0];f.push(...r===2?[o[0],o[1],o[2]+h*p/2]:[o[0],o[1]+h*p/2,o[2]]),n.push(...M),s.push(e);for(let x=0;x<=l;x++)f.push(...i(x/l*Math.PI*2,h)),n.push(...M),s.push(e);for(let x=0;x<l;x++)h>0?m.push(v,v+1+x,v+2+x):m.push(v,v+2+x,v+1+x)}};for(const o of c)o[0]==="box"?g(o[1],o[2],o[3]):y(o[1],o[2],o[3],o[4],o[5],o[6]);const d=new a.InstancedBufferGeometry;return d.setAttribute("position",new a.Float32BufferAttribute(f,3)),d.setAttribute("normal",new a.Float32BufferAttribute(n,3)),d.setAttribute("aKind",new a.Float32BufferAttribute(s,1)),d.setIndex(m),d}const E=c=>c.flatMap(f=>[["box",[-1.2,.6,f],[.3,1.2,1.2],2],["box",[1.2,.6,f],[.3,1.2,1.2],2]]),re=[["box",[0,.85,0],[2.6,.5,9.6],2],["box",[0,2.65,-3.1],[3.3,3.1,3.4],0],["box",[0,4.35,-3.1],[3.7,.3,4],4],["drum",[0,2.35,1.3],1.3,5.6,2,0],["drum",[0,4.9,3.2],.5,.14,1,3],["drum",[0,4.15,3.2],.42,1.4,1,1],["box",[0,3.8,1.1],[.9,.5,.9],1],["box",[0,2.35,4.25],[1.2,1.2,.3],3],["box",[0,1,4.7],[3,.5,.4],2],...E([-3,0,3])],ie=[["box",[0,2.5,0],[3.3,3.2,10],0],["drum",[0,3.05,0],1.9,10.3,2,4,20],["box",[0,.75,0],[2.6,.3,9.4],2],...E([-3.2,3.2])],se=[["box",[0,2,0],[3.3,2.2,10],6],["drum",[0,2.35,0],1.75,9.6,2,5,20],["box",[0,.75,0],[2.6,.3,9.4],2],...E([-3.2,3.2])],le=[k.red,k.blue,k.green,k.violet];function fe(c){const f=A.points.length,n=A.length,s=new a.ShaderMaterial({name:"slmTrain",fog:!0,uniforms:{...P(),uTime:c.uTime,uP:{value:Q([A])}},vertexShader:`attribute vec3 aTint; attribute vec4 aCar; attribute float aKind; uniform float uTime; varying vec3 vL, vNl, vNw, vTint; varying vec2 vCar; varying float vKind; ${N}
      ${j(f,!0)}
      void main(){
        float s = mod(uTime*${_.speed.toFixed(1)} + aCar.y*${(n/3).toFixed(2)} - aCar.x, ${n.toFixed(2)});      // metres round the loop, by the clock
        vec3 tg; vec3 P = rideAt(0., ${f.toFixed(1)}, s/${n.toFixed(2)}*${f.toFixed(1)}, tg);
        vec3 T = tg*inversesqrt(max(dot(tg, tg), 1e-6)), R = vec3(T.z, 0., -T.x); R *= inversesqrt(max(dot(R, R), 1e-4)); vec3 U = cross(T, R);
        vec3 w = P + R*position.x + U*(position.y + .17) + T*position.z;
        vL = position; vNl = normal; vNw = R*normal.x + U*normal.y + T*normal.z; vTint = aTint; vKind = aKind; vCar = aCar.zw;
        vec4 mv = viewMatrix*vec4(w, 1.); gl_Position = projectionMatrix*mv;
      #ifdef USE_FOG
        vFogDepth = -mv.z;
      #endif
      }`,fragmentShader:`precision highp float; varying vec3 vL, vNl, vNw, vTint; varying vec2 vCar; varying float vKind; ${L}
      #ifdef USE_FOG
        vec3 rideFogged(vec3 c){ return mix(c, fogColor, rideHaze()); }
      #else
        vec3 rideFogged(vec3 c){ return c; }
      #endif
      void main(){
        vec3 n = vNw*inversesqrt(max(dot(vNw, vNw), 1e-6));
        vec3 base = vKind < .5 ? vTint : vKind < 1.5 ? vec3(.2, .16, .28) : vKind < 2.5 ? vec3(.11, .1, .15) : vKind < 3.5 ? vec3(1., .92, .7) : vKind < 4.5 ? mix(vTint, vec3(1.), .14) : vTint;
        float up = .5 + .5*n.y;
        vec3 col = base*(vec3(.5, .44, .8)*(.3 + .95*up) + vec3(1., .8, .5)*.4*(1. - up))*1.3;      // the dome's light from above, the warm glow from below
        float side = step(.5, abs(vNl.x))*step(vKind, .5), fz = fwidth(vL.z);
        vec2 gh = vec2(vL.x, vL.z)/.92; float fwh = clamp((fwidth(gh.x) + fwidth(gh.y))*1.2, 0., 1.);      // the heap's footprint, taken here before any branch, from the unstepped coordinates
        float wy = mix(smoothstep(1.95, 2.05, vL.y)*(1. - smoothstep(3.4, 3.5, vL.y)), smoothstep(2.75, 2.85, vL.y)*(1. - smoothstep(3.75, 3.85, vL.y)), vCar.y);
        float cz = fract((vL.z + 5.)/2.), wc = mix(smoothstep(.14, .2, cz)*(1. - smoothstep(.8, .86, cz)), .66, clamp(fz*1.5, 0., 1.));      // a car's windows, one every 2 m
        float we = smoothstep(-4.5, -4.4, vL.z)*(1. - smoothstep(-1.95, -1.85, vL.z));      // the engine's cab
        float lit = side*wy*mix(wc, we, vCar.y);
        if (vKind < .5 || vKind > 3.5) col += base*.26;      // what is painted keeps its own strong colour under the violet dome
        col = mix(col, vec3(1., .8, .46)*(2.1 + .5*sin(floor((vL.z + 5.)/2.)*2.7 + vCar.x*9.)), lit);      // lit windows, nobody in them
        if (vKind > 3.5 && vKind < 4.5) {      // a roof: a row of small warm lamps along both edges, one every 1.25 m (far off the row is one soft line)
          float ex = abs(vL.x) - 1.46, cz2 = (fract(vL.z/1.25) - .5)*1.25;
          float lamp = mix(1. - smoothstep(.13, .2, length(vec2(cz2, ex))), (1. - smoothstep(.13, .2, abs(ex)))*.3, clamp(fz*2.5, 0., 1.));
          col = mix(col, vec3(1., .8, .45)*3., lamp);
        }
        if (vKind > 4.5 && vKind < 5.5) {      // the hopper's heap: round softly glowing orbs in the plan's colours and shares, row beside row
          vec2 g = vec2(vL.x, vL.z)/.92; g.x += .5*mod(floor(g.y), 2.); vec2 id = floor(g), q = fract(g) - .5;
          float h = fract(sin(dot(id + vCar.x*31., vec2(12.9898, 78.233)))*43758.5453), r = length(q), fw = fwh;
          vec3 oc = h < .52 ? vec3(1., .79, .29) : h < .66 ? vec3(.29, .62, 1.) : h < .76 ? vec3(1., .33, .28) : h < .86 ? vec3(.44, .86, .42) : h < .96 ? vec3(.69, .48, 1.) : vec3(.5, .5, .56);
          oc = mix(oc, vec3(.86, .68, .4), fw);
          col = mix(vec3(.06, .05, .1), oc*(.75 + 1.1*(1. - 2.*r)), mix(1. - smoothstep(.36, .47, r), .6, fw));
        }
        if (vKind > 2.5 && vKind < 3.5) col = vec3(1., .93, .7)*3.2;
        gl_FragColor = vec4(rideFogged(col), 1.);
      }`}),m=(r,e)=>{const l=ne(r);l.setAttribute("aCar",new a.InstancedBufferAttribute(new Float32Array(e.flatMap(t=>t.car)),4)),l.setAttribute("aTint",new a.InstancedBufferAttribute(new Float32Array(e.flatMap(t=>t.tint)),3)),l.instanceCount=e.length;const i=new a.Mesh(l,s);return i.frustumCulled=!1,i},u=r=>{const e=new a.Color(le[r]);return[e.r,e.g,e.b]},g=[],y=[],d=[];for(let r=0;r<3;r++){g.push({car:[5,r,r/3,1],tint:u(0)});for(let e=1;e<=3;e++)(e<3?y:d).push({car:[5+te*e,r,(r*3+e)/9,0],tint:u(e)})}const o=m(re,g),w=m(ie,y),p=m(se,d);return o.name="engines",w.name="cars",p.name="hoppers",{meshes:[o,w,p],material:s,triangles:o.geometry.index.count/3*3+w.geometry.index.count/3*6+p.geometry.index.count/3*3}}function ve(c,f){const n=$(O("shelves-of-lit-memories:motes-lane:"+c.seed)),s=$(O("shelves-of-lit-memories:motes-chasm:"+c.seed)),m=Math.min(Math.max(c.quality?c.quality.detail:1,.5),1),u=[],g=[],y=Math.round(760*m),d=Math.round(900*m),o=K.lane/2-1.2;for(let l=0;l<y;l++){const i=n.range(5.2,13),t=n.range(-o,o),b=n.range(2.5,K.wallH-3),h=n(),v=n.range(.04,.08),M=n.range(.6,1.4),x=n.range(.5,1),T=Y(i);u.push(T[0]+T[3]*t,Math.min(b,21),T[1]-T[2]*t),g.push(h,v,M,x)}for(let l=0;l<d;l++){const i=s(),t=s.range(-75,75),b=s.range(-44,12),h=s(),v=s.range(.04,.09),M=s.range(.6,1.4),x=s.range(.5,1),T=z[2]+4+i*(D.z-D.r-30-z[2]),F=Math.min(Math.max((T-z[2])/(B.z-z[2]),0),1),U=F*F*(3-2*F);u.push(z[0]+(B.x-z[0])*F+t,Math.max(z[1]+(B.y-z[1])*U+b,-20),T),g.push(h,v,M,x)}const w=W(),p=g.length/4;w.setAttribute("aHome",new a.InstancedBufferAttribute(new Float32Array(u),3)),w.setAttribute("aMote",new a.InstancedBufferAttribute(new Float32Array(g),4)),w.instanceCount=p;const r=new a.ShaderMaterial({name:"slmMote",...q,fog:!0,uniforms:{...P(),uTime:f.uTime},vertexShader:`attribute vec3 aHome; attribute vec4 aMote; uniform float uTime; varying vec2 vQ; varying float vA; ${N}
      void main(){
        float ph = aMote.x*6.283, t = uTime*.21*aMote.z;
        vec3 c = aHome + vec3(sin(t + ph), .7*sin(t*.77 + ph*1.7), cos(t*.9 + ph*2.3))*1.6;
        vec4 mv = viewMatrix*vec4(c, 1.); float dist = length(mv.xyz), h = max(aMote.y, dist*.0013), thin = aMote.y/h;
        mv.xy += position.xy*h; gl_Position = projectionMatrix*mv; vQ = position.xy;
        vA = aMote.w*(.62 + .38*sin(uTime*1.1*aMote.z + ph*3.1))*thin*thin*smoothstep(8., 15., dist)*(1. - smoothstep(30., 62., dist));
      #ifdef USE_FOG
        vFogDepth = -mv.z;
      #endif
      }`,fragmentShader:`precision highp float; varying vec2 vQ; varying float vA; ${L}
      void main(){ float r = 1. - smoothstep(0., 1., dot(vQ, vQ)), a = r*r*vA*(1. - rideHaze()); gl_FragColor = vec4(vec3(1., .84, .58)*.9*a, 0.); }`}),e=new a.Mesh(w,r);return e.name="motes",e.renderOrder=7,e.frustumCulled=!1,{mesh:e,triangles:p*2}}async function me(c,f){const n=new a.Group;n.name="ride";const s=Z(f);n.add(s.mesh),await c.yield();const m=ee(c,f);n.add(m.mesh),await c.yield();const u=ae(f);n.add(u.mesh),await c.yield();const g=fe(f);n.add(...g.meshes),await c.yield();const y=ve(c,f);n.add(y.mesh),await c.yield();const d=[s.mesh,m.mesh,u.mesh,...g.meshes,y.mesh];return{object:n,triangles:s.triangles+m.triangles+u.triangles+g.triangles+y.triangles,update(){},dispose(){for(const o of d)o.geometry.dispose(),o.material.dispose()}}}export{me as buildRide};
