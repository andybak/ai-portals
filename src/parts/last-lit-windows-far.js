import*as e from"three";import{NL_GLSL as z}from"./last-lit-windows.js";const E=`precision highp float;
${z}
varying vec3 vCol; varying vec3 vW;
void main(){ gl_FragColor = vec4(nlFog(vCol, vW), 1.0); }`;function q(x,i,o=[0,1400]){const v=i.house,s=26,c=30,l=22,n=new e.BoxGeometry(s,c,l).translate(0,c/2-2,0),u=Math.atan2(o[0]-v.x,o[1]-v.z),d=new e.ShaderMaterial({uniforms:{...x.uniforms,uSize:{value:new e.Vector3(s,c,l)}},vertexShader:`
      varying vec3 vL; varying vec3 vN; varying vec3 vNw; varying vec3 vW;
      void main(){ vL = position; vN = normal; vNw = normalize(mat3(modelMatrix)*normal); vec4 w = modelMatrix*vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`precision highp float;
      ${z}
      uniform vec3 uSize;
      varying vec3 vL; varying vec3 vN; varying vec3 vNw; varying vec3 vW;
      void main(){
        vec3 N = normalize(vNw); vec3 toE = cameraPosition - vW; float dist = max(length(toE), 1e-3); vec3 V = toE/dist;
        vec3 alb = vec3(0.028, 0.029, 0.033)*(0.8 + 0.4*nlN(vL.xy*0.35 + vL.z*0.2));
        vec3 c = nlLight(vW, N, V, alb, 0.6) + alb*vec3(0.03, 0.034, 0.045);
        // the front: three rows of three windows, and the door; the same on the two sides so that it is never blind
        float front = step(0.5, vN.z), side = step(0.5, abs(vN.x));
        vec2 f = mix(vec2(vL.x/uSize.x, 0.0), vec2(vL.z/uSize.z, 0.0), side) + vec2(0.5, (vL.y + 2.0)/uSize.y);
        float px = dist*0.0011;                                          // about one pixel, in metres
        vec2 wsz = vec2(0.055, 0.05) + vec2(px/uSize.x, px/uSize.y)*0.5;     // a far window never falls below a pixel
        vec2 cell = vec2(f.x*3.0, (f.y - 0.3)*3.0/0.62);
        vec2 q = fract(cell) - 0.5; q /= vec2(3.0, 3.0/0.62);
        float inRows = step(0.3, f.y)*step(f.y, 0.92);
        float win = (1.0 - smoothstep(wsz.x*0.8, wsz.x, abs(q.x)))*(1.0 - smoothstep(wsz.y*0.8, wsz.y, abs(q.y)))*inRows*max(front, side*step(0.5, vN.x));
        float door = (1.0 - smoothstep(0.07, 0.075, abs(f.x - 0.5)))*(1.0 - smoothstep(0.2, 0.205, f.y))*front;
        c = mix(c, vec3(0.0), door);
        c += vec3(0.72, 0.83, 1.0)*win*2.6;
        gl_FragColor = vec4(nlFog(c, vW), 1.0);
      }`}),a=new e.Mesh(n,d);a.position.set(v.x,v.y,v.z),a.rotation.y=u,a.name="house";const r=[v.x+Math.sin(u)*(l/2+3),v.y+c*.55,v.z+Math.cos(u)*(l/2+3)];return{mesh:a,front:r,triangles:12}}async function T(x,i,o,v){const s=x.noise,c=new e.Group;c.name="cones";const l=[],n=[],u=[],d=[],a=[],r=28,f=[[1,0],[.72,.22],[.47,.5],[.3,.76],[.2,.95],[.16,1],[.11,.9],[.05,.78]];for(const t of o.cones){const p=l.length/3;for(let h=0;h<f.length;h++)for(let b=0;b<r;b++){const F=b/r*6.2832,C=1+.16*s.n2(Math.cos(F)*2+t.x,Math.sin(F)*2+h*.7)*(h<5?1:.3),A=t.r*f[h][0]*C,B=t.x+Math.cos(F)*A,Q=t.z+Math.sin(F)*A,k=h===0?o.heightAt(B,Q)-2:t.y+t.h*f[h][1]*(1+.06*s.n2(F*3,t.z));l.push(B,k,Q);const G=h>5?-1:1;n.push(Math.cos(F)*.75*G,.66,Math.sin(F)*.75*G),u.push(h>5?(h-5)/2:h===5?.25:0,f[h][1],v()),d.push(t.x,t.z,h>5?0:1)}for(let h=0;h<f.length-1;h++)for(let b=0;b<r;b++){const F=p+h*r+b,C=p+h*r+(b+1)%r,A=F+r,B=C+r;a.push(F,A,C,C,A,B)}await x.yield()}const m=new e.BufferGeometry;m.setAttribute("position",new e.Float32BufferAttribute(l,3)),m.setAttribute("normal",new e.Float32BufferAttribute(n,3)),m.setAttribute("aC",new e.Float32BufferAttribute(u,3)),m.setAttribute("aCc",new e.Float32BufferAttribute(d,3)),m.setIndex(a),m.computeBoundingSphere();const S=new e.Mesh(m,new e.ShaderMaterial({uniforms:{...i.uniforms},side:e.DoubleSide,fragmentShader:`precision highp float;
      ${z}
      varying vec3 vCol; varying vec3 vW; varying vec3 vCc; varying float vHt;
      void main(){
        vec2 dv = vW.xz - vCc.xy; float a = atan(dv.y, dv.x + 1e-5), rr = length(dv), sd = fract(vCc.x*0.0137 + vCc.y*0.0071), em = 0.0;
        for (int i = 0; i < 2; i++) {
          float fi = float(i);
          float a0 = 6.2832*fract(sd + 0.37*fi + 0.11) - 3.1416 + 0.22*sin(vHt*7.0 + sd*40.0 + fi*2.0) + 0.08*sin(vHt*23.0 + fi);
          float da = abs(mod(a - a0 + 3.14159265, 6.2831853) - 3.14159265)*rr, wd = 2.2 + 5.0*(1.0 - vHt);
          em += exp(-da*da/(wd*wd))*smoothstep(0.1 + 0.3*fi, 0.42 + 0.3*fi, vHt)*(0.5 + 0.5*nlN(vec2(vHt*26.0 - uTime*0.15, fi*5.0 + sd*9.0)));
        }
        vec3 fire = vec3(0.95, 0.17, 0.03)*(em*vCc.z);
        gl_FragColor = vec4(nlFog(vCol, vW) + fire*(1.0 - nlFogAmount(vW, uFog.x*0.5)), 1.0);
      }`,vertexShader:`
      ${z}
      attribute vec3 aC; attribute vec3 aCc; varying vec3 vCol; varying vec3 vW; varying vec3 vCc; varying float vHt;
      void main(){
        vCc = aCc; vHt = aC.y;
        vec3 N = normalize(normal); vec3 toE = cameraPosition - position; vec3 V = toE/max(length(toE), 1e-3);
        vec3 alb = vec3(0.04, 0.038, 0.042)*(0.7 + 0.6*aC.z);
        float fr = 1.0 - max(dot(N, V), 0.0);
        // the throat glows, and the glow licks the lip
        vCol = nlKey(position, N, V, alb, 0.8) + alb*vec3(0.03, 0.03, 0.045) + vec3(0.62, 0.028, 0.018)*(1.6*aC.x*(0.8 + 0.2*sin(uTime*0.9 + aC.z*20.0)))
          + vec3(0.2, 0.012, 0.008)*smoothstep(0.7, 1.0, aC.y)*fr*0.4;
        vW = position; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.0);
      }`}));S.name="cone-hills",c.add(S);const w=[];for(const t of o.cones)for(let p=0;p<3;p++)w.push(t.x,t.y+t.h*.9,t.z,t.h*(.5+.22*p),t.h*(2.6+.9*p),v(),p,0);const g=(t,p,h)=>{const b=Math.sin(t*12.9898+p*78.233+h*37.719)*43758.5453;return b-Math.floor(b)};for(const t of o.pits)if(t.x>200)for(let p=0;p<2;p++)w.push(t.x,t.y+1,t.z,t.r*(2.6+1.2*p),t.r*(6+4*p),g(t.x,t.z,p),p,1+t.kind);for(const t of o.farFires)t.r>3.6&&w.push(t.x,t.y+1,t.z,t.r*(4.5+2.5*g(t.x,t.z,3)),t.r*(7+6*g(t.x,t.z,4)),g(t.x,t.z,5),0,1+t.kind);const y=new e.InstancedBufferGeometry;y.setAttribute("position",new e.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),y.setIndex([0,1,2,0,2,3]);const M=new e.InstancedInterleavedBuffer(new Float32Array(w),8);y.setAttribute("aAt",new e.InterleavedBufferAttribute(M,4,0)),y.setAttribute("aF",new e.InterleavedBufferAttribute(M,4,4)),y.instanceCount=w.length/8,y.boundingSphere=new e.Sphere(new e.Vector3(1500,100,2400),3200);const W=new e.Mesh(y,new e.ShaderMaterial({uniforms:{...i.uniforms},transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec4 aAt; attribute vec4 aF;
      varying vec2 vQ; varying vec4 vF; varying vec3 vW;
      void main(){
        vec3 base = aAt.xyz; vec3 toE = cameraPosition - base; toE.y = 0.0;
        vec3 right = normalize(vec3(toE.z, 0.0, -toE.x) + vec3(1e-4, 0.0, 0.0));
        float y = position.y;
        vec3 p = base + right*position.x*aAt.w*(0.55 + 1.5*y) + vec3(0.0, y*aF.x, 0.0);
        p.x -= y*y*aF.x*0.55;
        vQ = vec2(position.x, y); vF = aF; vW = p;
        gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.0);
      }`,fragmentShader:`precision highp float;
      ${z}
      varying vec2 vQ; varying vec4 vF; varying vec3 vW;
      void main(){
        float x = vQ.x, y = clamp(vQ.y, 0.0, 1.0), s = vF.y*31.0;
        float n = nlF(vec2(x*1.4 + s, y*3.2 - uTime*0.06*(1.0 + 0.4*vF.z))), n2 = nlF(vec2(x*3.6 - s, y*7.0 - uTime*0.11));
        float body = (1.0 - smoothstep(0.25, 0.95, abs(x) + 0.5*(n - 0.5)))*smoothstep(0.0, 0.05, y)*(1.0 - smoothstep(0.5, 1.0, y));
        float a = clamp(body*(0.35 + 0.9*n2)*0.8, 0.0, 0.9);
        float pit = step(0.5, vF.w), blue = step(1.5, vF.w);
        vec3 fire = mix(vec3(0.4, 0.022, 0.014), vec3(0.04, 0.12, 0.62), blue);
        vec3 c = vec3(0.018, 0.017, 0.022)*(0.6 + 0.8*n) + fire*exp(-y*mix(9.0, 5.0, pit))*(0.6 + 0.6*n2)*(1.0 + 0.8*pit) + fire*0.125*exp(-y*2.5)*(1.0 + 1.6*pit);
        // (polish round 1, P1d: the underside of a cone's smoke takes a dull glow from its throat, carried as above)
        vec3 und = fire*((1.0 - pit)*0.35*exp(-y*5.0)*(0.4 + 0.9*n2));       // (second part, G3c: thinner and lower)
        gl_FragColor = vec4((nlFog(c, vW) + und*(1.0 - nlFogAmount(vW, uFog.x*0.5)))*a, a);
      }`}));return W.name="cone-smoke",W.renderOrder=2,c.add(W),{group:c,triangles:a.length/3+w.length/8*2}}function _(x,i){const o=i.kiln,v=[],s=[],c=[],l=40,n=15;for(let a=0;a<=l;a++){const r=a/l*6.2832,f=Math.cos(r-Math.atan2(1400-o.z,0-o.x)),m=2+7*Math.max(0,.75-f)+1.5*Math.sin(r*5),S=Math.cos(r),w=Math.sin(r);for(const[g,y]of[[n+3.5,-1],[n+1,m],[n-1,m],[n-2,-1]])v.push(o.x+S*g,o.y+y,o.z+w*g),s.push(S*(g>n?1:-1),.5,w*(g>n?1:-1))}for(let a=0;a<l;a++)for(let r=0;r<3;r++){const f=a*4+r,m=f+4;c.push(f,f+1,m,m,f+1,m+1)}const u=new e.BufferGeometry;u.setAttribute("position",new e.Float32BufferAttribute(v,3)),u.setAttribute("normal",new e.Float32BufferAttribute(s,3)),u.setIndex(c),u.computeBoundingSphere();const d=new e.Mesh(u,new e.ShaderMaterial({uniforms:{...x.uniforms,uAt:{value:new e.Vector3(o.x,o.y+3,o.z)}},fragmentShader:E,side:e.DoubleSide,vertexShader:`
      ${z}
      uniform vec3 uAt; varying vec3 vCol; varying vec3 vW;
      void main(){
        vec3 N = normalize(normal); vec3 toE = cameraPosition - position; vec3 V = toE/max(length(toE), 1e-3);
        vec3 alb = vec3(0.05, 0.047, 0.05);
        vec3 toF = uAt - position; float d = max(length(toF), 1.0);
        vCol = nlKey(position, N, V, alb, 0.6) + alb*vec3(0.62, 0.028, 0.018)*(max(dot(N, toF/d), 0.0)*60.0/(1.0 + d*d*0.02))*(0.85 + 0.15*sin(uTime*2.3));
        vW = position; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.0);
      }`}));return d.name="kiln",{mesh:d,triangles:c.length/3}}function P(x,i,o){const v=[],s=[],c=[],l=[];i.forEach((a,r)=>{const f=v.length/3,[m,S,w,g,y,M]=a;for(const[W,t]of[[-1,-1],[1,-1],[1,1],[-1,1]])v.push(S+W*g,m,w+t*g),s.push(r*1.37+.3,y,M,m),c.push(W,t);l.push(f,f+2,f+1,f,f+3,f+2)});const n=new e.BufferGeometry;n.setAttribute("position",new e.Float32BufferAttribute(v,3)),n.setAttribute("aS",new e.Float32BufferAttribute(s,4)),n.setAttribute("aC",new e.Float32BufferAttribute(c,2)),n.setIndex(l),n.boundingSphere=new e.Sphere(new e.Vector3(0,500,1800),9e3);const u={...x.uniforms,uThick:{value:1},uGlowFar:{value:o?o.tex:null},uGlowFarBox:{value:new e.Vector4(...o?o.box:[0,0,1,1])},uGlowWide:{value:o&&o.wide?o.wide:null},uWideBox:{value:new e.Vector4(...o&&o.wide?o.wideBox:[0,0,0,0])}},d=new e.Mesh(n,new e.ShaderMaterial({uniforms:u,transparent:!0,depthWrite:!1,side:e.DoubleSide,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec4 aS; attribute vec2 aC; varying vec3 vW; varying vec4 vS; varying vec2 vC;
      void main(){ vW = position; vS = aS; vC = aC; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.0); }`,fragmentShader:`precision highp float;
      ${z}
      uniform float uThick; uniform sampler2D uGlowFar, uGlowWide; uniform vec4 uGlowFarBox, uWideBox;
      varying vec3 vW; varying vec4 vS; varying vec2 vC;
      void main(){
        vec3 toE = cameraPosition - vW; float dist = max(length(toE), 1.0);
        // the fires of the country under it, blurred as wide as the smoke is high
        vec2 fuv = (vW.xz - uGlowFarBox.xy)*uGlowFarBox.zw, fo = vec2(50.0 + 0.4*vS.w)*uGlowFarBox.zw;
        float inBox = step(0.0, fuv.x)*step(fuv.x, 1.0)*step(0.0, fuv.y)*step(fuv.y, 1.0);
        vec3 under = 0.28*texture2D(uGlowFar, clamp(fuv, 0.0, 1.0)).rgb + 0.18*(texture2D(uGlowFar, clamp(fuv + vec2(fo.x, 0.0), 0.0, 1.0)).rgb + texture2D(uGlowFar, clamp(fuv - vec2(fo.x, 0.0), 0.0, 1.0)).rgb
          + texture2D(uGlowFar, clamp(fuv + vec2(0.0, fo.y), 0.0, 1.0)).rgb + texture2D(uGlowFar, clamp(fuv - vec2(0.0, fo.y), 0.0, 1.0)).rgb);
        // long bars lying along the wind, drifting west at 3 m/s
        vec2 q = vW.xz + vec2(uTime*3.0, 0.0);
        float sd = vS.x*17.0;
        float n = nlF(vec2(q.x/1300.0, q.y/300.0) + sd), n2 = nlF(vec2(q.x/340.0, q.y/95.0) - sd), n3 = nlN(vec2(q.x/90.0, q.y/31.0) + sd);
        float d = smoothstep(0.45, 0.74, n*0.62 + n2*0.3 + n3*0.08 + (vS.y - 0.5)*0.36);
        float edge = 1.0 - smoothstep(0.55, 1.0, max(abs(vC.x), abs(vC.y)));
        float fromFace = vW.z - (1200.0 - 0.325*vW.y);
        float off = smoothstep(8.0, 150.0, fromFace);                    // it lies against the face without cutting it
        // seen edge on a sheet is thick, seen from straight below it is thin
        float graze = clamp(dist/max(abs(toE.y), 20.0), 1.0, 5.0);
        // (thin: whatever lies behind a bar shows through it dimmed, never blanked)
        float a = clamp(d*edge*off*smoothstep(60.0, 220.0, dist)*uThick*(0.2 + 0.11*graze), 0.0, 0.5);
        // black against the windows; its edges lit amber on the pyramid's side, dull red from below over the pits
        float thin = d*(1.0 - d)*4.0;
        vec3 c = vec3(0.004, 0.004, 0.0055)*(0.7 + 0.6*n2);
        c += uKeyCol*((0.05*thin + 0.006*(0.4 + 1.2*n3*n2))*exp(-max(fromFace, 0.0)/420.0) + 0.003*exp(-max(fromFace, 0.0)/1500.0))*(1.0 - 0.6*vS.z);
        c += vec3(0.06, 0.0045, 0.0035)*(0.35 + 0.65*thin)*smoothstep(0.35, 0.75, nlF(vW.xz/420.0 + 3.0))*mix(exp(-vS.w/600.0), 1.0, vS.z)*0.6;
        c += min(under, vec3(1.2))*inBox*(0.3 + 0.7*thin)*mix(0.5*exp(-vS.w/500.0), 0.55, vS.z);
        // polish round 1 (P1): the smoke that lies over the fire country takes the country's wide firelight on its
        // underside, less the higher it lies; that glow carries through the night's air as the ground's does
        vec2 quv = (vW.xz - uWideBox.xy)*uWideBox.zw;
        float inW = step(0.0, quv.x)*step(quv.x, 1.0)*step(0.0, quv.y)*step(quv.y, 1.0);
        vec3 w0 = min(texture2D(uGlowWide, clamp(quv, 0.0, 1.0)).rgb, vec3(2.0));
        // (second part, G3c: thinner, and lower: less than half by 60 m of height; where a cold fire lies under the smoke the
        // red gives way to it, so the two never make rose)
        float cold = clamp(6.0*(w0.b - 0.05*w0.r), 0.0, 1.0);
        w0 = mix(w0, vec3(0.05, 0.15, 0.7)*(w0.b/0.7), cold);
        vec3 wu = w0*(inW*(0.25 + 0.75*thin)*mix(0.03*exp(-vS.w/70.0), 0.03, vS.z));
        gl_FragColor = vec4((nlFog(c, vW) + wu*(1.0 - nlFogAmount(vW, uFog.x*0.5)))*a, a);
      }`}));return d.name="strata",d.renderOrder=1,{mesh:d,uniforms:u,triangles:i.length*2}}function D(x,i,o){const v=new e.CylinderGeometry(o,o,o*.16,56,1,!0),s=new e.Mesh(v,new e.ShaderMaterial({uniforms:{...x.uniforms},transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:"varying vec2 vU; varying vec3 vW; void main(){ vU = uv; vec4 w = modelMatrix*vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }",fragmentShader:`precision highp float;
      ${z}
      varying vec2 vU; varying vec3 vW;
      void main(){
        // a ring of cold fire, blue-white: brighter knots that go slowly round it, and a flicker
        float a = vU.x*6.2831853, band = clamp(1.0 - abs(vU.y*2.0 - 1.0), 0.0, 1.0);
        float knots = 0.45 + 0.55*smoothstep(0.2, 0.9, 0.5 + 0.5*sin(a*5.0 - uTime*0.35)) + 0.5*smoothstep(0.6, 1.0, 0.5 + 0.5*sin(a*2.0 + uTime*0.21));
        float fl = 0.8 + 0.2*sin(uTime*2.7 + a*3.0)*sin(uTime*1.3);
        vec3 c = vec3(0.3, 0.48, 1.0)*(band*band*knots*fl*1.8) + vec3(0.7, 0.82, 1.0)*pow(band, 6.0)*knots*1.1;
        gl_FragColor = vec4(c*(1.0 - nlFogAmount(vW, uFog.x*0.35)), 1.0);
      }`}));return s.position.set(i[0],i[1],i[2]),s.rotation.set(.12,0,.08),s.name="crown",s.renderOrder=3,{mesh:s,triangles:112}}function I(x,i,o,v=11){const s=[],c=[];let l=0;for(;s.length/4<v&&l++<400;){const d=i.range(420,2500),a=i.range(1560,2700);if(o.farIn(d,a,120)||Math.hypot(d-o.house.x,a-o.house.z)<220)continue;const r=i.range(50,170),f=i.range(2.2,4.5)/r*(i.chance(.5)?1:-1);s.push(d,a,r,r*i.range(.3,.8)),c.push(f,i()*6.283,o.heightAt(d,a)+i.range(5,9),i.range(.9,1.6))}const n=new e.InstancedBufferGeometry;n.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),n.setIndex([0,1,2,0,2,3]),n.setAttribute("aC",new e.InstancedBufferAttribute(new Float32Array(s),4)),n.setAttribute("aQ",new e.InstancedBufferAttribute(new Float32Array(c),4)),n.instanceCount=s.length/4,n.boundingSphere=new e.Sphere(new e.Vector3(1400,0,2100),2200);const u=new e.Mesh(n,new e.ShaderMaterial({uniforms:{...x.uniforms},transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,vertexShader:`
      uniform float uTime; uniform vec2 uRes;
      attribute vec4 aC; attribute vec4 aQ;      // centre x, z, the two radii of its round; speed, phase, height, size
      varying vec2 vQ; varying vec3 vW; varying float vK;
      void main(){
        float t = uTime*aQ.x + aQ.y;
        vec3 c = vec3(aC.x + aC.z*sin(t), aQ.z + 1.5*sin(t*3.1 + aQ.y), aC.y + aC.w*sin(t*0.63 + aQ.y*3.0));
        vec3 toE = cameraPosition - c; float dist = max(length(toE), 1.0);
        float pix = dist*1.2498/max(uRes.y, 1.0), hw = max(aQ.w, 2.2*pix);
        vec3 right = normalize(vec3(toE.z, 0.0, -toE.x) + vec3(1e-4, 0.0, 0.0));
        vec3 p = c + right*(position.x*hw) + vec3(0.0, position.y*hw, 0.0);
        vK = (aQ.w/hw)*(0.75 + 0.25*sin(uTime*0.9 + aQ.y*7.0)); vQ = position.xy; vW = c;
        gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.0);
      }`,fragmentShader:`precision highp float;
      ${z}
      varying vec2 vQ; varying vec3 vW; varying float vK;
      void main(){
        float r2 = dot(vQ, vQ);
        vec3 c = vec3(0.72, 0.83, 1.0)*(2.6*exp(-r2*9.0) + 0.35*exp(-r2*2.2))*(1.0 - smoothstep(0.7, 1.0, r2))*clamp(vK, 0.0, 1.0);
        gl_FragColor = vec4(c*(1.0 - nlFogAmount(vW, uFog.x*0.5)), 1.0);
      }`}));return u.name="wanderers",u.renderOrder=3,{mesh:u,triangles:2*s.length/4}}function V(x,i,o){const v=i.x-i.f[0]*i.tall*.9,s=i.z-i.f[1]*i.tall*.9,c=-i.f[1],l=i.f[0],n=i.tall*1.6,u=-20,d=i.tall*2.1,a=new e.BufferGeometry;a.setAttribute("position",new e.Float32BufferAttribute([v-c*n,u,s-l*n,v+c*n,u,s+l*n,v+c*n,d,s+l*n,v-c*n,d,s-l*n],3)),a.setAttribute("aQ",new e.Float32BufferAttribute([-1,0,1,0,1,1,-1,1],2)),a.setIndex([0,1,2,0,2,3]),a.computeBoundingSphere();const r=new e.Mesh(a,new e.ShaderMaterial({uniforms:{...x.uniforms,uCol:{value:new e.Color(...o)}},transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:"attribute vec2 aQ; varying vec2 vQ; varying vec3 vW; void main(){ vQ = aQ; vW = position; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.0); }",fragmentShader:`precision highp float;
      ${z}
      uniform vec3 uCol; varying vec2 vQ; varying vec3 vW;
      void main(){
        float r2 = vQ.x*vQ.x*1.3 + (vQ.y - 0.3)*(vQ.y - 0.3)*2.4;
        float gl = exp(-r2*3.4)*(0.75 + 0.25*nlN(vec2(vQ.x*3.0 + uTime*0.03, vQ.y*5.0 - uTime*0.05)))*(1.0 - smoothstep(0.8, 1.0, abs(vQ.x)))*(1.0 - smoothstep(0.8, 1.0, vQ.y));
        gl_FragColor = vec4(uCol*(gl*(1.0 - nlFogAmount(vW, uFog.x*0.5))), 1.0);
      }`}));return r.name="far-watcher-glow",r.renderOrder=1,{mesh:r,triangles:2}}export{T as buildCones,D as buildCrown,V as buildFarGlow,q as buildHouse,_ as buildKiln,P as buildStrata,I as buildWanderers};
