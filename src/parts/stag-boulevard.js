import*as i from"three";import*as oe from"../kit/flora.js";import{makeRng as me}from"../kit/core.js";const se=Math.PI*2,Se=[[60,3,390],[34,3,333],[15,3,273],[4,3,212],[0,3,150],[0,3,0]];function Q(t){if(t<=150)return 0;for(let a=0;a<4;a++){const s=Se[a],c=Se[a+1];if(t<=s[2]&&t>=c[2])return c[0]+(s[0]-c[0])*(t-c[2])/(s[2]-c[2])}return 60+(t-390)*.45}const O=[{y:13,w:26,a:[-300,4],m:[0,4],b:[300,4],len:[3.2,6.4]},{y:21,w:22,a:[-300,-10],m:[0,85],b:[300,240],len:[4.5,9]},{y:29,w:24,a:[-300,260],m:[0,150],b:[300,120],len:[4.5,9]},{y:37,w:24,a:[-300,420],m:[18,285],b:[300,200],len:[4.5,9]},{y:45,w:22,a:[-300,150],m:[4,215],b:[300,330],len:[4.5,9]}];function ee(t,a,s){const c=2*t.m[0]-(t.a[0]+t.b[0])/2,b=2*t.m[1]-(t.a[1]+t.b[1])/2,h=1-a;s.x=h*h*t.a[0]+2*a*h*c+a*a*t.b[0],s.z=h*h*t.a[1]+2*a*h*b+a*a*t.b[1];let f=2*h*(c-t.a[0])+2*a*(t.b[0]-c),p=2*h*(b-t.a[1])+2*a*(t.b[1]-b);const k=Math.hypot(f,p)||1;return f/=k,p/=k,s.tx=f,s.tz=p,s.nx=-p,s.nz=f,s}const Be=(t,a,s)=>{const c=Math.min(1,Math.max(0,(s-t)/(a-t)));return c*c*(3-2*c)};function Xe(t,a,s){const c=2*t.m[0],b=2*t.m[1]-(t.a[1]+t.b[1])/2,h=Math.min(600,Math.max(0,a+300)),f=h/(c+300+Math.sqrt(Math.max((c+300)*(c+300)-2*c*h,1))),p=1-f,k=p*p*t.a[1]+2*f*p*b+f*f*t.b[1],F=2*p*(b-t.a[1])+2*f*(t.b[1]-b),_=2*p*(c+300)+2*f*(300-c);return Math.abs(s-k)*_/Math.hypot(_,F)+Math.max(Math.abs(a)-300,0)}function Ge(t,a,s,c){let b=1;for(const h of O){const f=h.y+1.2-a;if(f<.6)continue;const p=f/Math.max(c[1],.08),k=1+f*.06;b*=1-.92*(1-Be(h.w/2-k,h.w/2+k,Xe(h,t+c[0]*p,s+c[2]*p)))*Be(.6,2.6,f)}return b}function Qe(){return{a:O.map(t=>new i.Vector4(t.a[1],2*t.m[1]-(t.a[1]+t.b[1])/2,t.b[1],2*t.m[0])),b:O.map(t=>new i.Vector4(t.y,t.w/2,0,0))}}class Ue{constructor(){this.p=[],this.c=[]}quad(a,s,c,b,h,f){const p=this.p,k=this.c,F=f||h;p.push(a[0],a[1],a[2],s[0],s[1],s[2],c[0],c[1],c[2],a[0],a[1],a[2],c[0],c[1],c[2],b[0],b[1],b[2]),k.push(h.r,h.g,h.b,h.r,h.g,h.b,F.r,F.g,F.b,h.r,h.g,h.b,F.r,F.g,F.b,F.r,F.g,F.b)}box(a,s,c,b,h,f,p,k,F,_,M){const q=-b,K=c,W=(n,A,r)=>[a+c*h*n+q*f*A,r,s+b*h*n+K*f*A],x=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let n=0;n<4;n++){const A=x[n],r=x[(n+1)%4];this.quad(W(A[0],A[1],p),W(r[0],r[1],p),W(r[0],r[1],k),W(A[0],A[1],k),M||F,F)}this.quad(W(-1,-1,k),W(1,-1,k),W(1,1,k),W(-1,1,k),_||F),M&&this.quad(W(-1,-1,p),W(1,-1,p),W(1,1,p),W(-1,1,p),M)}beam(a,s,c,b,h,f){const p=s[0]-a[0],k=s[2]-a[2],F=Math.hypot(p,k)||1,_=-k/F*c,M=p/F*c,q=[a[0]-_,a[1],a[2]-M],K=[a[0]+_,a[1],a[2]+M],W=[s[0]+_,s[1],s[2]+M],x=[s[0]-_,s[1],s[2]-M],n=A=>[A[0],A[1]-b,A[2]];this.quad(q,K,W,x,f||h),this.quad(n(q),n(K),n(W),n(x),h),this.quad(q,x,n(x),n(q),h),this.quad(K,W,n(W),n(K),h),this.quad(q,K,n(K),n(q),h),this.quad(x,W,n(W),n(x),h)}prism(a,s,c,b,h,f,p,k,F,_,M=8){const q=-b,K=c;for(let W=0;W<M;W++){const x=W/M*se,n=(W+1)/M*se,A=a+c*Math.cos(x)*h+q*Math.sin(x)*f,r=s+b*Math.cos(x)*h+K*Math.sin(x)*f,z=a+c*Math.cos(n)*h+q*Math.sin(n)*f,C=s+b*Math.cos(n)*h+K*Math.sin(n)*f;this.quad([A,p,r],[z,p,C],[z,k,C],[A,k,r],F,_)}}cone(a,s,c,b,h,f,p){for(let k=0;k<5;k++){const F=k/5*se,_=(k+1)/5*se;this.quad([a+Math.cos(F)*b,s,c+Math.sin(F)*b],[a+Math.cos(_)*b,s,c+Math.sin(_)*b],[a,s+h,c],[a,s+h,c],f,p||f)}}build(){const a=new i.BufferGeometry;return a.setAttribute("position",new i.Float32BufferAttribute(this.p,3)),a.setAttribute("color",new i.Float32BufferAttribute(this.c,3)),a.computeVertexNormals(),a}}const _e=`
  float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(h21(i), h21(i+vec2(1.,0.)), f.x), mix(h21(i+vec2(0.,1.)), h21(i+vec2(1.,1.)), f.x), f.y); }
`;function Ne(t,a={}){const s=new i.PlaneGeometry(1,1,1,10);s.translate(0,-.5,0);const c=new i.InstancedBufferGeometry;c.index=s.index,c.setAttribute("position",s.getAttribute("position")),c.setAttribute("uv",s.getAttribute("uv"));const b=t.length,h=new Float32Array(b*4),f=new Float32Array(b*4),p=new Float32Array(b);t.forEach((M,q)=>{h.set([M.top[0],M.top[1],M.top[2],M.width],q*4),f.set([M.height,M.yaw||0,M.kind||0,M.phase??q*.37],q*4),p[q]=M.lit??1}),c.setAttribute("iA",new i.InstancedBufferAttribute(h,4)),c.setAttribute("iB",new i.InstancedBufferAttribute(f,4)),c.setAttribute("iC",new i.InstancedBufferAttribute(p,1)),c.instanceCount=b;const k=i.UniformsUtils.merge([i.UniformsLib.fog,{uTime:{value:0},uLit:{value:new i.Color(a.lit||"#fff4dc").multiplyScalar(a.gain||1.5)},uShade:{value:new i.Color(a.shade||"#8fa0c0").multiplyScalar(a.shadeK??.75)},uFade:{value:1},uPulse:{value:0},uVeil:{value:a.veil??1},uDrizzle:{value:a.drizzle??1}}]),F=new i.ShaderMaterial({uniforms:k,fog:!0,transparent:!0,depthWrite:!1,side:i.DoubleSide,vertexShader:`
      attribute vec4 iA; attribute vec4 iB; attribute float iC; uniform float uTime, uPulse;
      varying vec2 vUv; varying vec4 vP; varying float vLit; varying vec3 vWp; varying float vXm;
      #include <fog_pars_vertex>
      void main(){
        float kind = iB.z, w = iA.w, h = iB.x; vUv = uv; vP = vec4(w, h, kind, iB.w); vLit = iC;
        float v = -position.y;                         // 0 at the lip, 1 at the foot
        vXm = position.x * w * (kind < 0.5 ? (1.0 + 0.5 * v) : 1.0);   // metres across the sheet from its centre line: linear over the mesh, where uv.x is not once the sheet flares
        vec3 right = vec3(cos(iB.y), 0.0, -sin(iB.y)), outw = vec3(sin(iB.y), 0.0, cos(iB.y));
        vec3 wp;
        vec4 mvPosition;
        if (kind > 7.5) {
          wp = iA.xyz + right * (position.x * w) + outw * (v * h * 0.3667) + vec3(0.0, -v * h, 0.0);      // a cascade down ledges 1.5 m high and 0.55 m deep
          mvPosition = viewMatrix * modelMatrix * vec4(wp, 1.0);
        } else if (kind > 6.5) {
          wp = iA.xyz + right * (position.x * w) + vec3(0.0, -v * h, 0.0);          // drizzle off a deck's edge: a plain hanging sheet
          mvPosition = viewMatrix * modelMatrix * vec4(wp, 1.0);
        } else if (kind > 3.5) {
          // what falls free of a wall is a column: its card turns about the vertical axis to face the eye and never leans
          vec3 camL = (cameraPosition - modelMatrix[3].xyz) * mat3(modelMatrix);
          vec2 dc = camL.xz - iA.xz; dc /= max(length(dc), 1e-3); vec3 rc = vec3(dc.y, 0.0, -dc.x);
          if (kind < 4.5) {
            float flare = 1.0 + 0.6 * v; vXm = position.x * w * flare;
            float thrown = (0.3 + 0.2 * sqrt(max(h, 0.0))) * sqrt(max(v, 0.0)) + sin(uTime * 0.6 + iB.w * 9.0 + v * 2.0) * 0.006 * h * v * v;
            wp = iA.xyz + rc * vXm + outw * thrown + vec3(0.0, -v * h, 0.0);
          } else if (kind < 5.5) {
            wp = iA.xyz + vec3(position.x * 2.0 * w, 0.0, (position.y + 0.5) * 2.0 * w);        // rings lying on the pond round a fall's foot
          } else {
            float pulse = iB.w > 50.0 ? (0.5 + 0.5 * sin(uTime * 1.3 + iB.w)) : 1.0;            // the crown of spray thrown up at a foot (a phase above 50: a trunk shower that comes and goes)
            wp = iA.xyz + rc * (position.x * w) + vec3(0.0, (position.y + 1.0) * h * pulse, 0.0);
          }
          mvPosition = viewMatrix * modelMatrix * vec4(wp, 1.0);
        } else if (kind > 0.5 && kind < 1.5) {                // mist puff at the foot, camera facing; a phase above 50 marks a puff that pulses (a trunk shower)
          float pulse = iB.w > 50.0 ? (0.55 + 0.45 * sin(uTime * 1.3 + iB.w)) : 1.0;
          vec3 c = iA.xyz + vec3(0.0, w * 0.32 * pulse, 0.0);
          mvPosition = viewMatrix * modelMatrix * vec4(c, 1.0);
          float s = w * (1.0 + 0.12 * sin(uTime * 0.7 + iB.w * 5.0)) * mix(0.6, 1.0, pulse) * mix(1.0, 0.62, smoothstep(10.0, 26.0, cameraPosition.y));   // seen from the air a foot's mist is a boil of spray, not a wide disc
          mvPosition.xy += vec2(position.x, position.y + 0.5) * s;
          wp = c;
        } else {
          float sway = sin(uTime * 0.6 + iB.w * 9.0 + v * 2.0) * 0.012 * h * v * v;
          float arc = kind < 0.5 ? (mix(0.03, 0.25, smoothstep(10.0, 24.0, h)) + 1.6 * sqrt(max(v, 0.0)) + 0.02 * h * v) : 0.0;   // a short sheet leaves its lip at the wall
          float flare = kind < 0.5 ? (1.0 + 0.5 * v) : 1.0;
          wp = iA.xyz + right * (position.x * w * flare + sway) + outw * arc + vec3(0.0, -v * h, 0.0);
          if (kind > 2.5) wp = iA.xyz + right * (position.x * w) + outw * (v * iB.w) + vec3(0.0, -v * h, 0.0);      // (kinds above 3.5 never get here)
          mvPosition = viewMatrix * modelMatrix * vec4(wp, 1.0);
        }
        vWp = (modelMatrix * vec4(wp, 1.0)).xyz;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime, uFade, uVeil, uDrizzle; uniform vec3 uLit, uShade; varying vec2 vUv; varying vec4 vP; varying float vLit; varying vec3 vWp; varying float vXm;
      ${_e}
      #include <fog_pars_fragment>
      void main(){
        float w = vP.x, h = vP.y, kind = vP.z, ph = vP.w, v = 1.0 - vUv.y, a; vec3 col = uLit;
        vec3 lit = mix(uShade, uLit, 0.12 + 0.88 * vLit);
        if (kind > 7.5 || (kind > 2.5 && kind < 3.5)) {
          // A CASCADE OVER STEPS (kind 3: an escalator's 0.4 m treads; kind 8: mossed ledges 1.5 m high). Dark wet stone shows through a
          // thin glassy sheet; white water only where it goes over a lip and where it lands, in runs of uneven width and reach that
          // wander, break, join and part round bare stone: never a ruled stripe, never a white pane.
          float led = step(7.5, kind), stepH = mix(0.4, 1.5, led), steps = max(floor(h / stepH), 1.0), xm = vUv.x * w, sd = fract(ph * 0.618) * 53.0 + w * 3.0;
          float wob = (vn(vec2(xm * 0.5 + sd, 2.0)) - 0.5) * mix(1.1, 0.8, led) + (vn(vec2(xm * 2.1 + sd, 9.0)) - 0.5) * mix(0.45, 0.3, led);
          float sv = v * steps + wob, st = fract(sv), row = floor(sv), ym = v * h;
          // (round 15, second pass) the white water runs in BRAIDS that wander a metre or two sideways on their way down, join and part,
          // with a glassy sheet of moving water over the wet stone between them; the steps only swell and thin the foam, they never rule
          // it into stripes; the sides of a run are ragged; nothing in it is finer than a hand's width, so it never sparkles into a barcode
          float wx = xm + (vn(vec2(ym * 0.22 + sd, 4.0)) - 0.5) * 2.8 + (vn(vec2(ym * 0.9 + sd, 11.0)) - 0.5) * 0.7;
          float sdw = sd + (vWp.x - xm) * 1.37;                                                        // (each fall its own braids, wherever it stands)
          float run = smoothstep(0.4, 0.66, vn(vec2(wx * 0.55 + sdw, ym * 0.06 + sd)) * 0.6 + vn(vec2(wx * 1.7 + sdw * 2.0, ym * 0.21)) * 0.4 + 0.05);
          float n1 = vn(vec2(xm * 2.4 + sd, sv * 0.7 - uTime * 2.2)), n2 = vn(vec2(xm * 3.6 + sd, ym * 1.1 - uTime * 3.0 + row * 3.1));
          float n3 = vn(vec2(xm * 8.5 + sd, ym * 2.2 - uTime * 4.6));
          float reach = 0.16 + 0.5 * vn(vec2(xm * 1.2 + row * 5.7, sd * 2.0));                         // how far the white water reaches from a lip
          // treads: foam gathers toward the lip and boils just under it; ledges: torn strands down the drop, a boil where they land
          float lipT = smoothstep(1.0 - reach, 1.0 - reach * 0.3, st) + (1.0 - smoothstep(0.0, 0.1 + 0.25 * reach, st)) * 0.7;
          float lipL = smoothstep(0.02, 0.2, st) * (0.5 + 0.5 * smoothstep(0.75, 1.0, st)) + smoothstep(0.8, 1.0, st) * 0.5;
          float lipK = mix(0.55 + 0.45 * min(lipT, 1.0), 0.72 + 0.28 * min(lipL, 1.0), led);
          float white = run * lipK * smoothstep(0.24, 0.66, n2 * 0.6 + n3 * 0.4 + 0.2 * reach) * (0.65 + 0.35 * n1);
          float ux2 = vUv.x + (vn(vec2(ym * 0.6 + sd, 3.0)) - 0.5) * 0.2 + (vn(vec2(ym * 2.3 + sd, 6.0)) - 0.5) * 0.06, edge = smoothstep(0.0, 0.12, ux2) * smoothstep(1.0, 0.88, ux2);
          float body = (0.3 + 0.22 * n1) * (0.55 + 0.45 * run);                                       // the glassy sheet: wet stone seen through moving water
          a = clamp(body + white * 0.9, 0.0, 1.0) * edge * smoothstep(0.0, 0.01, v);
          vec3 glass = mix(uShade * 0.6, lit * vec3(0.45, 0.62, 0.6), 0.3 + 0.3 * n1);
          col = mix(glass, lit * (0.7 + 0.3 * n3), clamp(white * 1.1, 0.0, 1.0));                     // (the foam has greys in it: never one flat white)
        } else if (kind > 6.5) {
          // drizzle off a deck's edge after the rain: long soft threads of drops, each with its own brightness, gathered in slow shafts that
          // drift along the edge; several such sheets stand one behind the other under the decks. Nothing of it within 14 m of the eye.
          // (round 15) a ragged curtain, not a pane: it hangs in separate lengths of the edge with open gaps between, every length ending
          // at its own height in a torn hem; nothing of it where no thread falls
          float xm = vXm + 0.5 * w, yv = v * h, dist = length(cameraPosition - vWp);
          float colK = smoothstep(0.4, 0.58, vn(vec2(xm * 0.06 + ph * 17.0, 3.0)) * 0.7 + vn(vec2(xm * 0.23 + ph * 5.0, 8.0)) * 0.3);
          float hemY = 0.3 + 0.7 * vn(vec2(xm * 0.14 + ph * 9.0, 7.0)) + 0.1 * (vn(vec2(xm * 1.1 + ph, 2.0)) - 0.5);
          float rag = colK * (1.0 - smoothstep(hemY - 0.18, hemY, v));
          float shaft = smoothstep(0.3, 0.75, vn(vec2(xm * 0.11 + ph * 13.0 + uTime * 0.03, yv * 0.012 + ph * 5.0)));
          float th1 = vn(vec2(xm * 1.7 + ph * 31.0, yv * 0.045 - uTime * 0.9)), th2 = vn(vec2(xm * 4.6 + ph * 7.0, yv * 0.11 - uTime * 2.1));
          float bead = 0.3 + 0.7 * smoothstep(0.3, 0.72, vn(vec2(xm * 2.3 + ph * 3.0, yv * 0.24 - uTime * 3.4)));     // each thread is a run of drops, not a string
          float thread = smoothstep(0.55, 0.95, th1 * 0.6 + th2 * 0.4 + 0.2 * shaft) * (0.35 + 0.65 * shaft) * bead;
          a = thread * 0.17 * rag * uDrizzle * smoothstep(0.0, 0.1, v) * (1.0 - smoothstep(0.82, 1.0, v)) * smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x)
            * smoothstep(14.0, 34.0, dist) * (1.0 - 0.5 * smoothstep(120.0, 260.0, dist));
          col = mix(uShade, lit, 0.55 + 0.35 * th2);
        } else if (kind < 0.5) {
          float sp = 3.0 + 0.9 * sqrt(h), xm = vXm + 0.5 * w, ux = clamp(vXm / (w * (1.0 + 0.5 * v)) + 0.5, 0.0, 1.0);
          float vs = 1.0 + 3.0 * (1.0 - smoothstep(10.0, 24.0, h));          // a short sheet seen from close by: rounder foam, or its long streaks break into chevrons
          float n1 = vn(vec2(xm * 2.2 / (0.5 + 0.5 * vs) + ph * 17.0, v * h * 0.22 * vs - uTime * sp * 0.22));
          float n2 = vn(vec2(xm * 6.0 / (0.5 + 0.5 * vs) + ph * 5.0, v * h * 0.6 * vs - uTime * sp * 0.55));
          float shortK = 1.0 - smoothstep(10.0, 24.0, h);
          // a short sheet is seen from close by and from above: its sides wander and feather out, its lip dips and breaks along the rim
          float uxw = ux + (vn(vec2(v * h * 0.6 + ph * 13.0, ph * 29.0)) - 0.5) * 0.16 * shortK;
          float edge = smoothstep(0.0, 0.22, uxw) * smoothstep(1.0, 0.78, uxw);
          float tall = mix(0.75, 1.0, smoothstep(10.0, 24.0, h));           // a short sheet is torn water too, a little calmer than a long one
          float tear = mix(0.95, 0.5, v) + (n1 * 0.7 + n2 * 0.5 - 0.6) * mix(0.6, 1.3, v) * tall;
          float lipN = vn(vec2(xm * 1.5 + ph * 23.0, 1.7)), dip = shortK * (0.06 + 0.42 * lipN);
          float lip = (1.0 - smoothstep(0.25, 0.9, v * h)) * mix(smoothstep(0.0, 0.06, ux) * smoothstep(1.0, 0.94, ux), smoothstep(0.0, 0.18, 0.5 - abs(uxw - 0.5)) * (0.35 + 0.65 * smoothstep(0.35, 0.7, vn(vec2(xm * 2.3 + ph * 7.0, 5.1)))), shortK);   // the glassy bend over the lip, then foam
          a = max(clamp(tear, 0.0, 1.0) * smoothstep(0.15, 0.5, tear) * edge, lip) * smoothstep(0.0, 0.01, v) * (0.8 + 0.2 * smoothstep(10.0, 24.0, h));   // holes where it tears: the wall shows between the white streaks
          a *= mix(1.0, smoothstep(dip - 0.05, dip + 0.12, v * h), shortK);
          // and it comes down in strands of uneven width, the wet wall showing between them: never one pane
          a *= mix(1.0, 0.12 + 0.88 * smoothstep(0.3, 0.58, vn(vec2(xm * 0.85 + ph * 31.0, v * h * 0.07 + ph * 3.0)) + 0.25 * (vn(vec2(xm * 2.9 + ph * 9.0, v * h * 0.25 - uTime * 0.15)) - 0.5)), (1.0 - smoothstep(12.2, 13.6, h)) * smoothstep(0.02, 0.12, v));
          // fine falling streaks with the wall showing between them
          float fine = smoothstep(0.3, 0.75, vn(vec2(xm * 9.0 + ph * 3.0, v * h * 0.8 - uTime * sp * 0.7)) * 0.6 + vn(vec2(xm * 21.0 + ph * 8.0, v * h * 0.3 - uTime * sp * 0.5)) * 0.4);
          a *= mix(1.0, 0.25 + 0.9 * fine, shortK * (1.0 - lip));
          col = mix(uShade, lit, 0.45 + 0.55 * mix(0.5, n2, tall)) * (0.8 + 0.5 * mix(0.5, n1, tall)) + lit * lip * 0.35;
          col = mix(col, lit * 1.08, fine * 0.5 * shortK);
          // white water in falling threads on every sheet, so that a short one reads as water too and not as a pane of glass
          // (where the threads are is one-dimensional noise across the sheet; a second, rounder noise breaks them along their fall: no chevrons)
          float thr = smoothstep(0.5, 0.78, vn(vec2(xm * 3.1 + ph * 11.0, 4.7))) * smoothstep(0.3, 0.65, vn(vec2(xm * 0.9 + ph * 5.0, v * h * 0.45 - uTime * sp * 0.5))) * edge * smoothstep(0.03, 0.2, v);
          a = max(a, thr * 0.9); col = mix(col, lit * 1.05, thr * 0.7);
        } else if (kind > 5.5) {
          // the crown at a fall's foot: spray thrown up and outward in torn plumes, densest low in the middle
          float x = vUv.x * 2.0 - 1.0, up = vUv.y, dome = 1.0 - smoothstep(0.15, 1.0, length(vec2(x, up * 1.04)));
          float n1 = vn(vec2(x * 3.0 + ph * 9.0, up * 3.4 - uTime * 1.7)), n2 = vn(vec2(x * 8.0 + ph * 3.0, up * 7.0 - uTime * 2.6));
          float plume = smoothstep(0.4, 0.78, n1 * 0.6 + n2 * 0.4 + dome * 0.5 - 0.22 * up);
          a = clamp(dome * plume * 0.85 + exp(-(x * x * 7.0 + up * up * 20.0)) * 0.45, 0.0, 1.0) * (0.35 + 0.65 * min(vLit + 0.4, 1.0));
          col = mix(uShade, lit, 0.4 + 0.6 * n1);
        } else if (kind > 4.5) {
          // rings on the pond: white churn where the water goes in, crests running outward in broken arcs and dying away
          vec2 q = vUv * 2.0 - 1.0; float r = length(q), ang = atan(q.y, q.x + 1e-5), tr = uTime * 0.55 + ph * 7.0;
          float churn = (1.0 - smoothstep(0.06, 0.36, r)) * (0.4 + 0.6 * vn(q * 9.0 + vec2(ph * 7.0, -uTime * 1.3)));
          float rr = fract(r * w / 2.4 - tr), crest = smoothstep(0.3, 0.5, rr) * smoothstep(0.72, 0.5, rr);
          float arcs = smoothstep(0.3, 0.62, vn(vec2(ang * 2.4 + ph * 9.0, r * 3.0 - tr * 0.5)));
          a = churn * 0.8 + crest * arcs * 0.42 * smoothstep(0.16, 0.36, r) * (1.0 - smoothstep(0.5, 1.0, r));
          col = mix(uShade * 0.85, lit, 0.45 + 0.55 * churn);
        } else if (kind > 3.5) {
          // a free fall: glassy over the lip, then strands of uneven width that wander, part and tear into drops and veil as they gather
          // speed; a ragged outline that never comes to a straight edge; thin water is blue shade, the cores are white
          // (round 15) no two falls alike: each has its own habit from its phase (fine or coarse strands, how soon it tears, how much veil
          // it trails; one in three comes down as two columns that part below the lip), and a broad one is a body of white water
          float W = w * (1.0 + 0.6 * v), xn = clamp(vXm / max(0.5 * W, 1e-3), -1.0, 1.0), yv = v * h, sp = 2.2 + 0.5 * sqrt(h);
          float st1 = fract(ph * 7.31 + 0.13), st2 = fract(ph * 13.7 + 0.61), thick = smoothstep(5.5, 7.5, w);
          float tallF = smoothstep(60.0, 150.0, h); thick *= 1.0 - tallF;      // a fall the height of a tower is strands of white water with the wall dark between them: it trails little veil, and is never a pale pane over the tower
          float fl = sqrt(yv + 0.5) * 3.0 - uTime * sp * 0.5;
          float sx = vXm * 2.4 * mix(0.6, 1.7, st1) / (0.6 + 0.2 * w) + ph * 31.0 + 0.5 * sin(yv * 0.17 + ph * 9.0);
          float s1 = vn(vec2(sx, yv * 0.035 + ph * 3.0)), s2 = vn(vec2(sx * 2.9 + 5.0, yv * 0.09 + ph * 7.0));
          float strand = smoothstep(0.3 + 0.2 * v, 0.56 + 0.16 * v, s1 * 0.62 + s2 * 0.38 + 0.3 * (1.0 - v) * (1.0 - v) + (st2 - 0.5) * 0.14 + 0.2 * thick);
          float p1 = vn(vec2(sx * 1.1, fl * 1.1 + ph * 5.0)), p2 = vn(vec2(sx * 3.7 + 3.0, fl * 2.6));
          float tear = smoothstep(0.2 + 0.3 * v, 0.55 + 0.3 * v, p1 * 0.6 + p2 * 0.4 + 0.3 * (1.0 - v) + (st1 - 0.5) * 0.22 + 0.25 * thick);
          float en = vn(vec2(yv * 0.3 + ph * 13.0, ph * 29.0)) * 0.4 + vn(vec2(yv * 1.1 + ph * 3.0, fl * 0.4)) * 0.2;
          float edge = 1.0 - smoothstep(0.5 - 0.5 * en, 0.98 - 0.3 * en, abs(xn));
          edge *= 1.0 - step(0.64, st2) * (1.0 - thick) * (1.0 - smoothstep(0.04, 0.3, abs(xn + (en - 0.2) * 0.6))) * smoothstep(0.02, 0.22, v);
          float core = strand * tear * (0.55 + 0.45 * (1.0 - abs(xn)));
          core = max(core, thick * (0.4 + 0.5 * p1) * (0.5 + 0.5 * smoothstep(0.25, 0.6, s2)));
          float veil = (0.08 + 0.34 * v * v) * (0.4 + 0.6 * p2) * mix(0.5, 1.7, st1) * mix(1.0, 0.3, tallF);
          float lip = (1.0 - smoothstep(0.3, 1.3, yv)) * (1.0 - smoothstep(0.7, 1.0, abs(xn)));
          a = max(edge * (core * 0.95 + veil), lip * 0.9) * smoothstep(0.0, 0.006, v) * (1.0 - 0.55 * smoothstep(0.93, 1.0, v));
          col = mix(mix(uShade, lit, 0.3), lit * 1.05, clamp(core + lip * 0.6, 0.0, 1.0)) * (0.8 + 0.3 * p2);
        } else if (kind < 1.5) {
          vec2 q = vUv * 2.0 - 1.0; float r2 = dot(q, q);
          // (two octaves on turned axes: one octave of value noise shows its square cells, and the puff reads as a pale box on the water)
          float n1 = 0.55 * vn(q * 2.2 + vec2(ph * 9.0, -uTime * 0.5)) + 0.45 * vn(vec2(q.x * 0.8 - q.y * 0.6, q.x * 0.6 + q.y * 0.8) * 3.9 + vec2(ph * 5.0, uTime * 0.3));
          a = exp(-r2 * 4.2) * (0.3 + 0.5 * n1) * (1.0 - smoothstep(0.55, 1.0, r2)) * min(h, 1.0);   // a mist item's height is its opacity
          a *= mix(1.0, 1.3 * smoothstep(0.22, 0.6, n1), smoothstep(10.0, 26.0, cameraPosition.y));    // torn into shreds when looked down on
          a *= smoothstep(0.15, 0.42, vUv.y);                                                          // and gone before the card meets the water: no level line at a fall's foot
          col = mix(uShade, lit, 0.6) * 0.8 * (1.0 + 0.5 * max(h - 1.0, 0.0));                          // (a height above 1 is a brighter plume)
        } else {
          // the bead veil: strands of drops at wandering spacing, half of them missing (three in four where the eye passes through), each
          // strand with its own brightness, its own bead spacing and its own length; a third of the beads are petals, lilac in the same light
          float cx = vUv.x * w * 3.4 + 1.5 * vn(vec2(vUv.x * w * 0.8, ph)), id = floor(cx), fx = fract(cx) - 0.5, r = h21(vec2(id, ph)), r2 = h21(vec2(id * 2.3 + 1.0, ph + 5.0));
          float dist = length(cameraPosition - vWp), nearV = 1.0 - smoothstep(10.0, 25.0, dist);
          float keep = step(0.5 + 0.25 * nearV, h21(vec2(id * 1.7 + 3.0, ph + 2.0)));
          float len = 0.4 + 0.6 * h21(vec2(id * 3.3 + 7.0, ph + 1.0));
          float row = v * h * (0.5 + 0.55 * r2) - uTime * (2.2 + 1.6 * r) + r * 7.0, fr = fract(row) - 0.5;
          float bead = (1.0 - smoothstep(0.1, 0.42, length(vec2(fx * 2.3 + (r - 0.5) * 0.6, fr * (0.8 + 0.6 * r2))))) * step(0.42, h21(vec2(id, floor(row))));
          float thread = (1.0 - smoothstep(0.0, 0.08, abs(fx + (r - 0.5) * 0.3))) * 0.012;
          float train = smoothstep(0.42, 0.66, vn(vec2(id * 3.7 + ph * 9.0, row * 0.13)));   // drops fall in trains with long gaps between, never a full string
          float petal = step(0.7, h21(vec2(id * 3.1, floor(row) + 2.0)));
          a = (bead * train + thread) * keep * (0.25 + 0.75 * r2 * r2) * smoothstep(0.0, 0.03, v) * (1.0 - smoothstep(len - 0.15, len, v)) * mix(0.7, 0.25, nearV) * smoothstep(1.5, 6.0, dist) * mix(1.0, 0.6, smoothstep(40.0, 120.0, dist));
          col = mix(lit * 0.9, vec3(0.7, 0.52, 1.0) * dot(lit, vec3(0.36)), petal * 0.85) * uVeil;
        }
        a *= uFade;
        if (a < 0.004) discard;
        gl_FragColor = vec4(max(col, vec3(0.0)), clamp(a, 0.0, 1.0));
        #include <fog_fragment>
      }`}),_=new i.Mesh(c,F);return _.frustumCulled=!1,_.renderOrder=3,{mesh:_,uniforms:k,material:F}}function Le(t,a={},s={}){const c=[],b=[],h=[],f=s.rows||4;for(let M=0;M<2;M++)for(let q=0;q<=f;q++)for(let K=0;K<2;K++){const W=K-.5,x=-q/f;c.push(M===0?W:0,x,M===0?0:W*.7),b.push(K+M*2,q/f)}for(let M=0;M<2;M++)for(let q=0;q<f;q++){const K=M*(f+1)*2+q*2;h.push(K,K+2,K+1,K+1,K+2,K+3)}const p=new i.InstancedBufferGeometry;if(p.setAttribute("position",new i.Float32BufferAttribute(c,3)),p.setAttribute("uv",new i.Float32BufferAttribute(b,2)),p.setIndex(h),p.setAttribute("iA",new i.InstancedBufferAttribute(t.A,4)),p.setAttribute("iB",new i.InstancedBufferAttribute(t.B,4)),p.instanceCount=t.count,s.share){const M=new i.Mesh(p,s.share.material);return M.frustumCulled=!1,{mesh:M,uniforms:s.share.uniforms,material:s.share.material}}const k=i.UniformsUtils.merge([i.UniformsLib.fog,{uTime:{value:0},uGust:{value:a.gust??1},uFlower:{value:new i.Color(a.flower||"#9a78d8")},uTip:{value:new i.Color(a.tip||"#e6dafa")},uFlower2:{value:new i.Color(a.flower2||a.flower||"#9a78d8")},uTip2:{value:new i.Color(a.tip2||a.tip||"#e6dafa")},uLeaf:{value:new i.Color(a.leaf||"#6b7a34")},uSun:{value:new i.Color(a.sun||"#FFE4B5").multiplyScalar(a.sunK??1.5)},uAmb:{value:new i.Color(a.amb||"#6a76a0").multiplyScalar(a.ambK??.75)}}]),F=new i.ShaderMaterial({uniforms:k,fog:!0,side:i.DoubleSide,vertexShader:`
      attribute vec4 iA; attribute vec4 iB; uniform float uTime, uGust;
      varying vec2 vUv; varying vec4 vI; varying float vDist;
      #include <fog_pars_vertex>
      void main(){
        float len = iA.w, yaw = iB.x, ph = fract(iB.y), v = -position.y; vUv = uv; vI = vec4(len, ph, iB.z, step(1.0, iB.y));
        float c = cos(yaw), s = sin(yaw);
        vec3 lp = vec3(position.x * 1.7, position.y * len, position.z * 1.7);
        vec3 wp = iA.xyz + vec3(lp.x * c + lp.z * s, lp.y, -lp.x * s + lp.z * c);
        float gust = sin(uTime * 0.55 - iB.w * 0.045) * 0.5 + 0.5;       // travels along the parapet
        float sw = (sin(uTime * 1.5 + ph * 6.28) * 0.35 + sin(uTime * 0.83 + ph * 17.0) * 0.25) * (0.35 + gust) * uGust;
        float b = v * v * len * 0.11 * sw;
        wp += vec3(s, 0.0, c) * b + vec3(c, 0.0, -s) * b * 0.4; wp.y += abs(b) * 0.25;
        vec4 mvPosition = viewMatrix * modelMatrix * vec4(wp, 1.0);
        vDist = length(mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uFlower, uTip, uFlower2, uTip2, uLeaf, uSun, uAmb; varying vec2 vUv; varying vec4 vI; varying float vDist;
      ${_e}
      #include <fog_pars_fragment>
      void main(){
        float len = vI.x, ph = vI.y, q = floor(vUv.x * 0.5), u = fract(vUv.x * 0.999), v = vUv.y;
        float k = u * 3.0, id = floor(k) + q * 3.0;
        float r = h21(vec2(id + 1.0, ph * 91.0)), r2 = h21(vec2(id + 7.0, ph * 53.0));
        float fu = fract(k) - 0.5 + (r2 - 0.5) * 0.3;                      // racemes hang at uneven spacing
        float rl = 0.35 + 0.65 * r, vv = v / rl;                           // each its own length, 0.35 to 1 of the card
        float nearK = 1.0 - smoothstep(20.0, 60.0, vDist), ym = v * len;   // ym: metres down the card
        float bead = vn(vec2(fu * 9.0 + id * 3.0, vv * len * rl * mix(3.4, 5.0, nearK) + ph * 31.0));
        float wd = (0.3 + 0.3 * r2) * (1.0 - 0.62 * vv) * (0.6 + 0.6 * bead) * step(vv, 1.0) * mix(1.0, 1.35, nearK);   // and its own width, tapering to the tip
        // florets: a staggered lattice of round beads 8 cm across down the raceme
        vec2 fq = vec2(fu * 7.2 + id * 0.37, ym * 12.0 + r * 5.0); fq.x += 0.5 * mod(floor(fq.y), 2.0);
        vec2 fi = floor(fq), ff = fract(fq) - 0.5; float fh = h21(fi + vec2(id * 7.0, ph * 19.0));
        float floret = 1.0 - smoothstep(0.24, 0.52, length(ff - (vec2(fh, h21(fi + 3.3 + ph)) - 0.5) * 0.28));
        float rim = smoothstep(0.55, 1.0, abs(fu) / max(wd, 1e-3));          // toward the raceme's edge only whole florets stay: a beaded outline
        float fl = step(abs(fu), wd) * step(0.06, vv) * step(rim * nearK * 0.75, floret + 0.2);
        // the leaf mass: ragged at the top, at both sides and along its lower edge, in leaflet-sized pieces (coarser pieces far off)
        float edge = abs(u - 0.5) * 2.0, lz = vn(vec2(vUv.x * 5.0 + ph * 29.0, 3.0));
        float lnN = vn(vec2(vUv.x * 23.0 + ph * 13.0, ym * 9.0)) * 0.6 + vn(vec2(vUv.x * 61.0 + ph * 7.0, ym * 24.0)) * 0.4;
        float lnF = vn(vec2(vUv.x * 7.0 + ph * 13.0, ym * 2.6)) * 0.65 + vn(vec2(vUv.x * 19.0 + ph * 7.0, ym * 7.0)) * 0.35;
        float ln = mix(lnF, lnN, nearK);
        float top = 0.08 + 0.5 * vn(vec2(vUv.x * 3.1 + ph * 41.0, 9.0)) + 0.22 * vn(vec2(vUv.x * 11.0 + ph * 3.0, 4.0));          // metres: the top line wanders
        float leafZone = (1.0 - smoothstep(0.10 + 0.14 * lz, 0.20 + 0.22 * lz, v)) * smoothstep(top - 0.12, top + 0.05, ym + 0.3 * (ln - 0.5));
        float leaf = leafZone * step(0.36 + 0.35 * edge * edge + 0.25 * smoothstep(0.08, 0.25, v), ln + 0.12 * (1.0 - nearK));
        if (fl + leaf < 0.5) discard;
        vec3 flower = mix(mix(uFlower, uFlower2, vI.w), mix(uTip, uTip2, vI.w), smoothstep(0.45, 1.0, vv) * 0.35 + 0.3 * fh * nearK) * (0.7 + 0.5 * bead);
        flower *= mix(1.0, 0.5 + 0.75 * floret, nearK);                      // shade between the florets
        vec3 lcol = mix(uLeaf * 0.45, uLeaf * 1.25 + vec3(0.05, 0.04, 0.0), ln) * (0.7 + 0.5 * step(0.5, fract(ln * 7.0)));
        vec3 alb = mix(flower, lcol, step(0.5, leaf) * step(fl * (1.0 - leafZone), 0.5));
        float sun = vI.z * (0.75 + 0.35 * r);
        gl_FragColor = vec4(max(alb * (uAmb * 0.8 + uSun * sun * 0.7), vec3(0.0)), 1.0);
        #ifdef FOG_EXP2
          // (the lilac carries through the haze: at the far end of the boulevard the stack's fringes are a clear band of colour, not grey)
          gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, (1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth)) * mix(0.55, 1.0, smoothstep(0.002, 0.004, fogDensity)));
        #endif
      }`}),_=new i.Mesh(p,F);return _.frustumCulled=!1,{mesh:_,uniforms:k,material:F}}async function Ze(t,a={}){const s=(a.rng||t.rng).fork("wisteria-stack"),c=t.quality?.detail??1,b=a.density??1,h=o=>new i.Color(o),f=h("#b3ab9a"),p=h("#c2b8a2"),k=h("#55545a"),F=h("#5a5a62"),_=h("#5c7a3c"),M=h("#3E6B33"),q=h("#6f9a3e"),K=h("#8a5a3a"),W=h("#6e6a60"),x=h("#cfc8b0"),n=me("deck-tops:"+(t.seed??0)),A=a.sunLocal||[-.03,.44,.9],r=a.litAt||((o,v,m)=>Ge(o,v,m,A)),z=new i.Group;z.name="wisteria-stack";const C=new Ue,e={},D=72,N=O.map(o=>{const v=[];for(let m=0;m<=48;m++)ee(o,m/48,e),v.push(e.x,e.z);return v}),j=(o,v,m)=>{const w=N[o];let V=1e9;for(let E=0;E<w.length;E+=2)V=Math.min(V,Math.hypot(w[E]-v,w[E+1]-m));return V},te=(o,v,m)=>v>-30&&v<420&&Math.abs(o-Q(v))<m||v>150&&v<420&&o>-12&&o<12+.17*(v-150),H=[],Z=[],L=o=>{const v=Math.sin(o*127.1+311.7)*43758.5453;return v-Math.floor(v)},ne=M.clone().lerp(k,.45),ie=[_.clone().lerp(f,.3),M.clone().lerp(f,.25),q.clone().lerp(f,.45)];for(let o=0;o<O.length;o++){const v=O[o],m=v.y+2.4,w=v.w/2,V=[[-w,m+1.5],[-w+.5,m+1.5],[-w+.5,m],[w-.5,m],[w-.5,m+1.5],[w,m+1.5],[w,m-.8],[w*.55,v.y],[-w*.55,v.y],[-w,m-.8],[-w,m+1.5]],E=[_,f,W,f,_,p,f,F,f,p];let u=null,y=null;for(let d=0;d<=D;d++){if(ee(v,d/D,e),y){const l=m+.07,S=(g,B,R,U)=>{const J=y[0]+(e.x-y[0])*R,G=y[1]+(e.z-y[1])*R,I=y[0]+(e.x-y[0])*U,$=y[1]+(e.z-y[1])*U;C.quad([J+e.nx*(g-B),l,G+e.nz*(g-B)],[J+e.nx*(g+B),l,G+e.nz*(g+B)],[I+e.nx*(g+B),l,$+e.nz*(g+B)],[I+e.nx*(g-B),l,$+e.nz*(g-B)],x)};d%2&&S(0,.13,.1,.62),(d*13+o*5)%7>1&&S(w-2.2,.11,0,1),(d*11+o*3)%7>1&&S(-w+2.2,.11,0,1)}if(Math.abs(e.x-Q(e.z))<120){const l=L(d*3.7+o*11.3),S=l>.7?K.clone().lerp(F,.5):l>.42?M.clone().lerp(F,.55):F.clone().lerp(f,.25+.5*l);if(C.box(e.x,e.z,e.nx,e.nz,w*.56,.34,v.y-.66,v.y+.03,S,S,S.clone().multiplyScalar(.72)),y&&Math.abs(e.x-Q(e.z))<90)for(const g of[-.3,.3])C.beam([y[0]+e.nx*w*g,v.y+.02,y[1]+e.nz*w*g],[e.x+e.nx*w*g,v.y+.02,e.z+e.nz*w*g],.45,.42,F.clone().lerp(f,.2+.3*L(d*9.1+g*5)))}y=[e.x,e.z];const P=V.map(l=>[e.x+e.nx*l[0],l[1],e.z+e.nz*l[0]]);if(u)for(let l=0;l<10;l++){let S=E[l],g;const B=L(d*17.3+o*5.1+l*3.7),R=Math.abs(e.x-Q(e.z))<70;(l===5||l===9)&&((d*7+o*3)%5===0||R&&B>.34)&&(S=B>.72?_.clone().lerp(p,.55):B>.5?k.clone().lerp(p,.6):K.clone().lerp(p,.72)),l===1?(S=ie[Math.floor(B*3)%3],g=ne):l===3&&(S=ne,g=ie[Math.floor(B*3)%3]),C.quad(u[l],P[l],P[l+1],u[l+1],S,g)}u=P,d%12===11&&await t.yield()}await t.yield();const T=13;for(let d=0;d<T;d++){if(ee(v,(d+.5)/T,e),te(e.x,e.z,15))continue;let P=!1;for(let l=0;l<o;l++)j(l,e.x,e.z)<O[l].w/2+5&&(P=!0);if(!P){C.prism(e.x,e.z,e.tx,e.tz,2,3,-1.5,6,M,_.clone().lerp(f,.6),12),C.prism(e.x,e.z,e.tx,e.tz,2,3,6,v.y-1.6,_.clone().lerp(f,.6),f,12),C.box(e.x,e.z,e.nx,e.nz,v.w*.34,1.9,v.y-1.6,v.y,p,q,k),H.push([e.x,e.z,v.y-1.6,e.tx,e.tz]);for(const l of[-1,1])Z.push({x:e.x+e.nx*l*v.w*.31,y:v.y-.05,z:e.z+e.nz*l*v.w*.31,s:s.range(1.3,2.3),rot:s.range(0,se),v:4,d:0,u:0})}}const X=Math.round(26*b);for(let d=0;d<X;d++){ee(v,s.range(.03,.97),e);const P=s.range(-w+2.4,w-2.4),l=e.x+e.nx*P,S=e.z+e.nz*P,g=s(),B=g<.42?s()<.5?0:1:g<.7?2:3,R=o===4&&Math.abs(l-Q(S))<16,U=B<2?s.range(.9,1.9):B===2?s.range(.4,.75):s.range(.3,.6),J=s.range(0,se);(Math.abs(l-Q(S))<120||d%2===0)&&Z.push({x:l,y:m,z:S,s:R?Math.min(U,1.1):U,rot:J,v:R&&B>1?0:B,d:0,u:0})}for(let d=0,P=o===4||o===2?20:6;d<P;d++){ee(v,d<18?n.range(.28,.72):n.range(.4,.6),e);const l=n()<.6,S=l?(n()<.5?-1:1)*n.range(w-3.6,w-1.2):n.range(-w+3,w-3),g=e.x+e.nx*S,B=e.z+e.nz*S,R=n()<.5,U=o===4&&Math.abs(g-Q(B))<16;Z.push({x:g,y:m,z:B,s:R?n.range(1,U?1.3:2.2):n.range(.5,U?1:2.2),rot:n.range(0,se),v:R?4:n()<.5?0:1,d:0,u:0})}for(let d=0;d<7;d++){ee(v,(d+.3)/7,e);const P=d%2?1:-1,l=e.x+e.nx*P*(w-.9),S=e.z+e.nz*P*(w-.9),g=s.range(-.8,.8);o===4&&Math.abs(l-Q(S))<26||o===0&&Math.abs(l)<40||(C.beam([l-e.nx*.14,m+1.5,S-e.nz*.14],[l+g-e.nx*.14+.28*e.nx,m+1.5,S+.28*e.nz-e.nz*.14],.14,-.01,_),C.box(l,S,e.tx,e.tz,.16,.16,m+1.5,m+10,M,q),C.box(l-e.nx*P*1.4,S-e.nz*P*1.4,e.nx,e.nz,1.5,.14,m+9.7,m+10,M,q))}await t.yield()}const de=new i.BufferGeometry;de.setAttribute("position",new i.Float32BufferAttribute(C.p,3)),await t.yield(),de.setAttribute("color",new i.Float32BufferAttribute(C.c,3)),await t.yield(),de.computeVertexNormals(),await t.yield();const ue=new i.Mesh(de,a.concrete||new i.MeshStandardMaterial({vertexColors:!0,roughness:.92,metalness:0,side:i.DoubleSide}));ue.name="stack-concrete",z.add(ue),await t.yield();let he=null;if(a.flora!==!1){const o=s.fork("deck-flora"),v=a.flora?.material||oe.windMaterial({wind:oe.makeWind({direction:[.6,.8]})});await t.yield();const m=[];m.push(oe.bushGeometry({rng:o,detail:0})),m.push(oe.bushGeometry({rng:o,detail:0,leaf:"#5c8a34"})),await t.yield(),m.push(oe.bambooGeometry({rng:o,detail:0,height:11})),await t.yield(),m.push(oe.oakGeometry({rng:o,detail:0,height:11,leaf:"#4f7f30",leafLight:"#a9c45a"})),await t.yield(),m.push(oe.fernGeometry({rng:o,size:1.2}));const w=a.tintAt;he=oe.makeScatter({rng:o,variants:m,points:Z,material:v,sink:.01,tilt:.06,groundColor:w?(V,E,u)=>w(V,u+2,E):void 0}),he.object.name="deck-flora",z.add(he.object),await t.yield()}const je=.95,we=[],ze=[],ke=[],Pe=[];for(let o=0;o<O.length;o++){const v=O[o],m=v.y+2.4,w=v.w/2;let V=0,E=0,u=0,y=0;for(let T=0;T<=700;T++){if(T%175===174&&await t.yield(),ee(v,T/700,e),T>0){const l=Math.hypot(e.x-V,e.z-E);u+=l,y+=l}if(V=e.x,E=e.z,u<je)continue;u=0;const X=Math.abs(e.x-Q(e.z))>140,d=Math.abs(e.x-Q(e.z))>110;if(X&&c<1&&s()>c){s(),s(),s(),s(),s(),s();continue}const P=a.mixed&&Math.sin(y*.019+o*1.7)+.5*Math.sin(y*.047+o)>.25?1:0;for(let l=-1;l<=1;l+=2){const S=s()<.06;let g=s.range(v.len[0],v.len[1])*(X?1.15:1);const B=s();if(o===0&&Math.abs(e.x)<13&&(g=Math.min(g,5.2)),o===2&&Math.abs(e.x-Q(e.z))<13&&(g=Math.min(g,5.6)),S)continue;const R=e.x+e.nx*l*(w+.25),U=e.z+e.nz*l*(w+.25),J=(l*e.nz>0?1:.4)*(.12+.88*r(R+e.nx*l*.6,m+1.75-g*.5,U+e.nz*l*.6));(d?ke:we).push(R,m+1.75,U,g),(d?Pe:ze).push(Math.atan2(-e.tz,e.tx),Math.min(B,.999)+P,J,y+o*131)}}await t.yield()}const Me=[];{const o=me("lianas:"+(t.seed??0)),v=O[3],m={},w=(u,y,T,X,d)=>{we.push(u,y,T,X),ze.push(o.range(0,se),o()*.999+(a.mixed&&o()<.4?1:0),.3+.7*r(u,y,T),u*3+d)};for(let u=0;u<6;u++){const y=-20+u*7.4+o.range(-1.7,1.7),T=2+Math.floor(o()*3);for(let X=0;X<T;X++){ee(v,.512+(y+(X-(T-1)/2)*o.range(.5,1.2))/660,m);const d=m.nz>0?1:-1,P=m.x+m.nx*d*(v.w/2+.35),l=m.z+m.nz*d*(v.w/2+.35),S=Math.abs(P-Q(l)),g=v.y+3.7,B=S<6.5?o.range(16.2,19.5):o.range(8.2,17),R=o.range(-1.3,1.3),U=o.range(.2,1.8),J=3+Math.floor(o()*4);Me.push([[P,g,l],[P+R,B,l+U]]);for(let G=0;G<J;G++)w(P+R+o.range(-.45,.45),B+.45+o.range(-.15,.4),l+U+o.range(-.45,.45),S<6.5?o.range(1.9,2.6):o.range(2.4,4),G);for(let G=0;G<4;G++){const I=o.range(.2,.9);o()<.75&&w(P+R*I+o.range(-.2,.2),g+(B-g)*I+.2,l+U*I+o.range(-.2,.2),o.range(1.2,2.3),G+9)}}}const V=[];for(let u=0;u<O.length;u++){const y=O[u];for(let T=0;T<32;T++){ee(y,.5+(L(T*7.9+u*3.3)-.5)*.36,m);const X=(L(T*2.7+u*9.1)-.5)*y.w*1,d=m.x+m.nx*X,P=m.z+m.nz*X,l=Math.abs(d-Q(P));if(l>60)continue;const S=y.y+.15+1.6*Math.max(0,(Math.abs(X)-.275*y.w)/(.225*y.w)),g=Math.min((1.2+3.6*L(T*5.3+u))*(l<5?.6:1),u===0?Math.abs(d)<13?1.2:3.2:9);V.push([[d,S,P],[d+(L(T*1.3+u)-.5)*.5,S-g,P+(L(T*4.1+u)-.5)*.5]]),L(T*6.1+u*2.9)<.6&&!(u===0&&Math.abs(d)<13)&&w(d,S-g*.6,P,1+1.1*L(T*8.7+u),T)}}const E=[];if(H.forEach((u,y)=>{if(!(Math.abs(u[0]-Q(u[1]))>46))for(let T=0,X=2+(L(y*3.9)>.5?1:0);T<X;T++){const d=L(y*7.1+T*2.3)*se,P=(L(y*1.7+T)>.5?1:-1)*(.5+.4*L(y+T*5.1)),l=u[2]-.4-3*L(y*2.9+T),S=Math.max(3,Math.round(l/4.5));let g=null;for(let B=0;B<=S;B++){const R=d+B*P,U=-.2+(l+.2)*B/S,J=Math.cos(R)*2.2,G=Math.sin(R)*3.3,I=[u[0]+u[3]*J-u[4]*G,U,u[1]+u[4]*J+u[3]*G];g&&(E.push([g,I]),L(y*9.3+T*4.7+B)<.5&&U>4&&w(I[0],U,I[2],1+1.4*L(y+T+B*3.1),B)),g=I}}}),a.flora!==!1&&a.flora?.material){const u=oe.makeVines({rng:me("liana-vines:"+(t.seed??0)),material:a.flora.material,spans:Me,sag:.05,thickness:.2,hangers:.5,leaves:1.2,stem:"#8f7c5e",flower:(a.light||{}).flower||"#B59AE0"});u.object.name="wisteria-runners",u.object.frustumCulled=!1,z.add(u.object),await t.yield();const y=oe.makeVines({rng:me("soffit-roots:"+(t.seed??0)),material:a.flora.material,spans:V,sag:.02,thickness:.09,hangers:0,leaves:.45,stem:"#7d6c54"});y.object.name="soffit-roots",y.object.frustumCulled=!1,z.add(y.object),await t.yield();const T=oe.makeVines({rng:me("pier-climbers:"+(t.seed??0)),material:a.flora.material,spans:E,sag:.015,thickness:.15,hangers:.25,leaves:1.3,stem:"#7a6a50"});T.object.name="pier-climbers",T.object.frustumCulled=!1,z.add(T.object),await t.yield()}}const ce=Le({A:new Float32Array(we),B:new Float32Array(ze),count:we.length/4},a.light||{});ce.mesh.name="wisteria",z.add(ce.mesh),await t.yield();const Te=Le({A:new Float32Array(ke),B:new Float32Array(Pe),count:ke.length/4},a.light||{},{rows:1,share:ce});Te.mesh.name="wisteria-far",z.add(Te.mesh),await t.yield();const ae=[],xe=[],Fe=[],ve=new Ue,ge=new i.Color(.016,.024,.022),We=new i.Color(.03,.045,.04),De=k.clone().lerp(M,.45),Y=(o,v,m,w,V=s,E=13,u=!0)=>{const y=O[o];ee(y,v,e);const T=y.w/2,X=e.nx*m,d=e.nz*m,P=e.x+X*T,l=e.z+d*T,S=P+X*1.05,g=l+d*1.05,B=y.y+2.4;if(E>0?te(S,g,E):Math.abs(S-Q(g))<-E)return!1;const R=Math.atan2(X,d),U=B+.05,J=.3+.2*Math.sqrt(U+.3),G=S+X*J,I=g+d*J,$=Math.max(r(G,U*.55,I),.6*r(G,2,I)),pe=r(G,3,I),le=L(G*3.1+I*1.7);return ae.push({top:[S,U,g],width:w,height:U+.3,yaw:R,kind:4,phase:V(),lit:$}),xe.push([G,0,I]),u&&Fe.push([G,I,U,w]),ae.push({top:[G,0,I],width:4+w*1.2+U*.1,height:.7,yaw:0,kind:1,phase:V(),lit:pe}),ae.push({top:[G,.07,I],width:4.5+w*1.3+U*.06,height:1,kind:5,phase:le,lit:pe}),ae.push({top:[G,-.1,I],width:3+w*1.5,height:1.6+.09*U,kind:6,phase:le*.9,lit:pe}),ve.box(P+X*.5,l+d*.5,X,d,.62,w/2+.3,B-.32,B+.03,De,We,k),ve.box(P+X*.04,l+d*.04,X,d,.07,w/2+.12,B+.03,B+1.52,ge,ge),!0},fe=o=>(o+300)/600;Y(0,fe(-20),1,2.6),Y(0,fe(20),1,2.2),Y(0,fe(-74),1,4.2),Y(0,fe(96),1,3.4),Y(0,fe(150),-1,2);const Ve=[[1,4],[2,3],[3,4],[4,4]];for(const[o,v]of Ve){let m=0,w=0;for(;m<v&&w++<40;){const V=s.range(.22,.8),E=s()<.7?1:-1,u=s.range(1.5,5),y=u<2.5?u*.5:u>4?u*1.45:u;Y(o,V,E,y,s,o>2?30:13)&&m++}}if(Y(3,.452,-1,7.2,n,-27)){const o=xe[xe.length-1],v=Math.max(r(o[0],4,o[2]),.5);ae.push({top:[o[0],-.1,o[2]],width:17,height:9,kind:6,phase:.37,lit:v},{top:[o[0],-.1,o[2]],width:11,height:5,kind:6,phase:.81,lit:v},{top:[o[0],2.5,o[2]],width:12,height:1.35,kind:1,phase:.23,lit:v},{top:[o[0],.07,o[2]],width:16,height:1,kind:5,phase:.44,lit:v})}Y(3,.444,1,1.9,n,-27),Y(2,.474,1,5,n,-13.5),Y(2,.532,1,3.4,n,-13.5),Y(4,.445,-1,5.6,n,-30),Y(4,.56,-1,1.5,n,-30),Y(1,.47,1,3.6,n,-14),Y(1,.535,1,3,n,-14);const qe=[];for(const[o,v,m,w,V,E,u]of[[2,.62,-1,1,3.8,.627,1],[4,.672,1,3,3.4,.647,1],[4,.352,-1,2,3.2,.367,1]]){const y=O[o],T=O[w];ee(y,v,e);const X=y.w/2,d=e.nx*m,P=e.nz*m,l=e.x+d*X,S=e.z+P*X,g=l+d*1.05,B=S+P*1.05,R=y.y+2.4,U=T.y+2.4,J=R-U,G=.3+.2*Math.sqrt(J+.35),I=g+d*G,$=B+P*G,pe=Math.max(r(I,U+J*.5,$),.5),le=Math.max(r(I,U+1.5,$),.4),be=L(I*3.1+$*1.7);ae.push({top:[g,R+.05,B],width:V,height:J+.05,yaw:Math.atan2(d,P),kind:4,phase:be,lit:pe}),ae.push({top:[I,U,$],width:6+V,height:.85,yaw:0,kind:1,phase:be*.7+.1,lit:le},{top:[I,U+.09,$],width:3.2+V,height:1,kind:5,phase:be,lit:le},{top:[I,U-.05,$],width:3+V*1.3,height:2.4+.1*J,kind:6,phase:be*.9,lit:le}),ve.box(l+d*.5,S+P*.5,d,P,.62,V/2+.3,R-.32,R+.03,De,We,k),ve.box(l+d*.04,S+P*.04,d,P,.07,V/2+.12,R+.03,R+1.52,ge,ge),Y(w,E,u,V*.85,n,-24,!1),qe.push([I,U,$])}ee(O[3],.5+.012,e);const re=e.nz>0?1:-1,Ae=e.x+e.nx*re*(O[3].w/2+.6),Ce=e.z+e.nz*re*(O[3].w/2+.6);ae.push({top:[Ae,37.2,Ce],width:44,height:37.4,yaw:Math.atan2(e.nx*re,e.nz*re),kind:2,phase:.31,lit:1}),ae.push({top:[Ae,13.4,Ce+.7],width:40,height:13.5,yaw:Math.atan2(e.nx*re,e.nz*re),kind:2,phase:.67,lit:1});for(const[o,v,m,w,V]of[[3,.5,-1,72,.17],[4,.5,1,64,.52],[4,.52,-1,60,.81]]){const E=O[o];ee(E,v,e);const u=(e.nz>0?1:-1)*m;ae.push({top:[e.x+e.nx*u*(E.w/2+.4),E.y+.5,e.z+e.nz*u*(E.w/2+.4)],width:w,height:E.y+.5,yaw:Math.atan2(e.nx*u,e.nz*u),kind:7,phase:V,lit:.9})}const ye=Ne(ae,a.fallLight||{});ye.mesh.name="deck-falls",z.add(ye.mesh),await t.yield();const Ke=new i.Mesh(ve.build(),ue.material);Ke.name="fall-chutes",z.add(Ke),await t.yield();const Ee={portalSeat:new i.Vector3(0,3,0),flyLine:Se.map(o=>new i.Vector3(o[0],o[1],o[2])),curtain:new i.Vector3(Ae,3,Ce),pondCentre:new i.Vector3(0,0,60),fallFeet:xe.map(o=>new i.Vector3(o[0],o[1],o[2]))};return{object:z,radius:330,height:58,center:new i.Vector3(0,24,140),anchors:Ee,wisteria:ce,falls:ye,piers:H,fallList:Fe,stack:ue,spills:qe,lianas:Me,update(o,v,m){ce.uniforms.uTime.value=v,ye.uniforms.uTime.value=v,he&&he.update(o,v,m)},dispose(){},ground:!0,groundY:0}}function Oe(){const t=[],a=[],s=[],c=[],b=[],h=(x,n)=>{const A=t.length/3;for(const r of x)for(let z=0;z<n;z++){const C=z/n*se,e=Math.cos(C),D=Math.sin(C),N=Math.max(r.ru,.001),j=Math.max(r.rv,.001);t.push(r.c[0]+r.u[0]*e*N+r.v[0]*D*j,r.c[1]+r.u[1]*e*N+r.v[1]*D*j,r.c[2]+r.u[2]*e*N+r.v[2]*D*j);let te=r.u[0]*e/N+r.v[0]*D/j,H=r.u[1]*e/N+r.v[1]*D/j,Z=r.u[2]*e/N+r.v[2]*D/j;r.n&&(te=r.n[0],H=r.n[1],Z=r.n[2]);const L=Math.hypot(te,H,Z)||1;a.push(te/L,H/L,Z/L),s.push(r.j[0],r.j[1],r.j[2],r.j[3]),c.push(r.w[0],r.w[1],r.w[2],r.w[3])}for(let r=0;r<x.length-1;r++)for(let z=0;z<n;z++){const C=A+r*n+z,e=A+r*n+(z+1)%n,D=C+n,N=e+n;b.push(C,e,N,C,N,D)}},f=[[-1.05,1.5,.02,.03],[-.99,1.48,.15,.19],[-.85,1.44,.25,.3],[-.62,1.42,.3,.35],[-.3,1.43,.28,.31],[.05,1.38,.31,.37],[.38,1.34,.31,.42],[.62,1.38,.27,.4],[.8,1.5,.2,.33],[.93,1.72,.14,.24],[1.03,1.98,.105,.17],[1.1,2.22,.095,.14],[1.15,2.4,.1,.125],[1.27,2.47,.105,.115],[1.42,2.43,.085,.095],[1.57,2.36,.055,.06],[1.66,2.32,.038,.042],[1.69,2.31,.006,.008]],p=[1.62,.86],k=x=>[0,.3,.6,.85][x-8]??(x<8?0:1),F=f.map((x,n)=>{const A=f[Math.max(0,n-1)],r=f[Math.min(f.length-1,n+1)];let z=r[1]-A[1],C=r[0]-A[0];const e=Math.hypot(z,C)||1;return z/=e,C/=e,{c:[0,x[1],x[0]],u:[1,0,0],v:[0,C,-z],ru:x[2],rv:x[3],j:[p[0],p[1],0,0],w:[0,k(n),0,Math.min(x[0],p[1])]}});F[0].n=[0,0,-1],F[f.length-1].n=[0,-.3,1],h(F,10);const _=[[1.52,-.68,.15,.25,0,0],[1.3,-.66,.14,.23,.5,0],[1.06,-.62,.1,.16,1,0],[.86,-.72,.062,.09,1,0],[.7,-.86,.046,.062,1,.5],[.52,-.845,.034,.038,1,1],[.17,-.8,.031,.033,1,1],[.1,-.79,.042,.046,1,1],[.03,-.77,.05,.055,1,1],[0,-.76,.03,.035,1,1]],M=[[1.44,.52,.14,.2,0,0],[1.22,.55,.12,.17,.55,0],[1.02,.56,.082,.11,1,0],[.84,.56,.058,.07,1,0],[.67,.57,.048,.054,1,.5],[.52,.57,.034,.037,1,1],[.17,.575,.031,.033,1,1],[.1,.585,.042,.046,1,1],[.03,.6,.05,.055,1,1],[0,.61,.03,.035,1,1]];for(let x=0;x<4;x++){const n=x>1,A=x%2?1:-1,r=n?M:_,z=n?[1.3,.55]:[1.36,-.68],C=n?[.67,.57]:[.7,-.86];h(r.map(e=>({c:[A*(.13+.07*Math.min(1,e[0]/1.3)),e[0],e[1]],u:[1,0,0],v:[0,0,1],ru:e[2],rv:e[3],j:[z[0],z[1],C[0],C[1]],w:[x+1,e[4],e[5],z[1]]})),6)}h([[1.56,-1,.045,0],[1.5,-1.05,.055,.4],[1.44,-1.08,.045,.8],[1.39,-1.09,.012,1]].map(x=>({c:[0,x[0],x[1]],u:[1,0,0],v:[0,.35,.94],ru:x[2],rv:x[2]*.6,j:[1.56,-1,0,0],w:[7,x[3],0,-1]})),5);const q=[p[0],p[1],0,0];for(const x of[-1,1]){const n=t.length/3,A=[x*.1,2.52,1.19],r=[x*.74,.58,-.34],z=[x*-.2,.5,.84],C=[r[1]*z[2]-r[2]*z[1],r[2]*z[0]-r[0]*z[2],r[0]*z[1]-r[1]*z[0]];for(const[e,D,N]of[[0,0,0],[.42,-1,.02],[.42,1,.02],[.5,0,-.03],[1,0,0]]){t.push(A[0]+r[0]*e*.27+z[0]*D*.062+C[0]*N,A[1]+r[1]*e*.27+z[1]*D*.062+C[1]*N,A[2]+r[2]*e*.27+z[2]*D*.062+C[2]*N);const j=Math.hypot(C[0],C[1],C[2])||1;a.push(C[0]/j,C[1]/j,C[2]/j),s.push(...q),c.push(5,1,0,p[1])}b.push(n,n+1,n+3,n,n+3,n+2,n+1,n+4,n+3,n+3,n+4,n+2)}const K=(x,n,A,r,z,C)=>{const e=new i.CatmullRomCurve3(x.map(j=>new i.Vector3(j[0],j[1],j[2]))),D=e.computeFrenetFrames(r,!1),N=[];for(let j=0;j<=r+1;j++){const te=Math.min(1,j/r),H=Math.min(j,r),Z=e.getPointAt(te),L=D.tangents[H],ne=j>r?.004:(n+(A-n)*te)*(1+C*Be(.6,.95,te)),ie=j>r?A*(1+C)*.8:0;N.push({c:[Z.x+L.x*ie,Z.y+L.y*ie,Z.z+L.z*ie],u:D.normals[H].toArray(),v:D.binormals[H].toArray(),ru:ne,rv:ne,j:q,w:[6,1,0,p[1]],n:j>r?L.toArray():null})}h(N,z)};for(const x of[-1,1]){const n=r=>[x*r[0],r[1],r[2]],A=x>0?.02:0;K([[.065,2.52,1.2],[.15,2.76,1.1],[.26+A,3.02,1.04],[.3,3.26,1.12+A],[.27,3.44,1.24]].map(n),.036,.023,5,6,.45),K([[.085,2.6,1.2],[.12,2.7,1.36],[.15,2.84+A,1.46]].map(n),.026,.018,2,4,.4),K([[.235,2.96,1.05],[.3,3.06,1.2],[.33+A,3.2,1.29]].map(n),.024,.017,2,4,.4),K([[.295,3.24,1.11],[.36,3.37,1],[.385,3.5-A,.96]].map(n),.023,.017,2,4,.4)}const W=new i.InstancedBufferGeometry;return W.setAttribute("position",new i.Float32BufferAttribute(t,3)),W.setAttribute("normal",new i.Float32BufferAttribute(a,3)),W.setAttribute("aJ",new i.Float32BufferAttribute(s,4)),W.setAttribute("aW",new i.Float32BufferAttribute(c,4)),W.setIndex(b),W}const Re=`
  vec2 rt(vec2 v, float a){ float c = cos(a), s = sin(a); return vec2(v.x * c - v.y * s, v.y * c + v.x * s); }
  // where a leg is in the stride: hind pair first, the fore pair half a stride later, left a little ahead of right (a rotary gallop)
  float legPhase(float leg, float ph){ return ph + step(2.5, leg) * 3.3 + step(0.5, mod(leg, 2.0)) * 0.6; }
`,Ie=`
  attribute vec4 aJ; attribute vec4 aW; attribute vec4 iA; attribute vec4 iB; attribute vec4 iC; attribute vec4 iD;
  uniform float uTime, uStride;
  varying vec3 vW; varying vec3 vN; varying vec3 vP; varying vec3 vN0; varying vec4 vK; varying float vFy; varying float vRim;
  #include <fog_pars_vertex>
  ${Re}
  void main(){
    float sr = uStride * (0.9 + 0.22 * fract(iB.w * 5.3));                                // (round 15) every animal has its own stride rate
    float part = aW.x, ph = (uTime * sr + iB.x) * 6.2832, air = iC.y, st = iC.z;      // st 1: the animal stands
    vec3 p = position, n = normal; vP = position; vN0 = normal;
    if (part > 0.5 && part < 4.5) {
      // a leg swings from hip or shoulder and folds at hock or knee while it comes forward; in the air the fore legs tuck and the hind legs trail
      float fore = step(2.5, part), th = legPhase(part, ph), fold = max(0.0, -cos(th)); fold = fold * (2.0 - fold);
      float a1 = mix(mix(mix(0.1, -0.12, fore) + mix(0.72, 0.8, fore) * sin(th), mix(0.95, -1.0, fore), air), mix(-0.07, 0.05, fore) + 0.05 * (mod(part, 2.0) - 0.5), st);
      float a2 = mix(mix(-1.2, 1.55, fore) * fold, mix(-0.25, 1.5, fore), air) * (1.0 - st);
      p.yz = aJ.zw + rt(p.yz - aJ.zw, a2 * aW.z); n.yz = rt(n.yz, a2 * aW.z);
      p.yz = aJ.xy + rt(p.yz - aJ.xy, a1 * aW.y); n.yz = rt(n.yz, a1 * aW.y);
    } else if (part > 6.5) {
      float fl = mix(0.5 + 0.2 * sin(ph * 2.0 + iB.w * 9.0), 0.12 + 0.3 * max(sin(uTime * 2.1 + iB.w * 9.0), 0.0), st) * aW.y;      // the tail hangs a little below the back line and flicks
      p.yz = aJ.xy + rt(p.yz - aJ.xy, fl); n.yz = rt(n.yz, fl);
    } else {
      // (a standing stag carries a full rack, iC.w more than the herd's half-grown one, scaled about the crown of the head)
      if (part > 5.5) { p = vec3(0.0, 2.5, 1.2) + (p - vec3(0.0, 2.5, 1.2)) * (1.0 + iC.w); p.x *= 1.0 + 0.55 * (fract(iB.w * 9.7 + 0.25) - 0.3); }      // (and its own spread of antler)
      float nod = (mix(0.09 * sin(ph + 0.9) - 0.12 * air, -0.1 + 0.05 * sin(uTime * 0.45 + iB.w * 5.0), st) + iD.z) * aW.y;      // neck and head reach forward with every stride; standing, the head is up and lifts slowly
      p.yz = aJ.xy + rt(p.yz - aJ.xy, nod); n.yz = rt(n.yz, nod);
      // the head turns: neck and head swing about the vertical through the base of the neck (iD.x, radians; positive toward the animal's right)
      float yw = iD.x * aW.y; p.xz = vec2(0.0, 0.86) + rt(p.xz - vec2(0.0, 0.86), yw); n.xz = rt(n.xz, yw);
      if (part > 5.5 && iB.z < 0.5) p = vec3(0.0, 2.44, 1.22);                           // a hind carries no antlers
    }
    // the spine: the back arches as the legs gather under it and stretches as they reach
    float s1 = sin(ph + 0.3), fa = (0.13 * smoothstep(0.1, -0.8, aW.w) - 0.07 * smoothstep(0.1, 0.8, aW.w)) * s1 * (1.0 - 0.6 * air) * (1.0 - st);
    p.yz = vec2(1.42, 0.1) + rt(p.yz - vec2(1.42, 0.1), fa); n.yz = rt(n.yz, fa);
    float pitch = 0.06 * sin(ph + 1.5) * (1.0 - air) * (1.0 - st) + iC.x;
    p.yz = vec2(1.3, 0.0) + rt(p.yz - vec2(1.3, 0.0), pitch); n.yz = rt(n.yz, pitch);
    p.y += (0.1 * sin(ph + 2.2) + 0.03) * (1.0 - air) * (1.0 - st);
    p *= iB.y;
    float ch = cos(iA.w), sh = sin(iA.w);
    vec3 wp = vec3(p.x * ch + p.z * sh, p.y, p.z * ch - p.x * sh) + iA.xyz;
    vW = wp; vN = vec3(n.x * ch + n.z * sh, n.y, n.z * ch - n.x * sh); vK = vec4(part, iB.z, iB.w, iB.y); vRim = iD.y;
    #ifdef MIRROR
      wp.y = -wp.y; wp.xz += vec2(sin(uTime * 2.3 + wp.y * 2.6 + wp.x), cos(uTime * 1.9 + wp.y * 3.1 + wp.z)) * 0.06 * clamp(-wp.y, 0.0, 2.0);
    #endif
    vFy = wp.y;
    vec4 mvPosition = viewMatrix * vec4(wp, 1.0); gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,Je=t=>`
  ${t}
  uniform vec3 uCoat, uCoatDk, uPale, uVelvet; uniform float uRimK, uPads;
  varying vec3 vW; varying vec3 vN; varying vec3 vP; varying vec3 vN0; varying vec4 vK; varying float vFy; varying float vRim;
  #include <fog_pars_fragment>
  float spots(vec2 q, float seed){
    vec2 id = floor(q), f = fract(q) - 0.5 - (vec2(h21(id + seed), h21(id + seed + 3.7)) - 0.5) * 0.36;
    return smoothstep(0.3, 0.19, length(f)) * step(0.22, h21(id + seed + 9.1));
  }
  #ifdef MIRROR
  // where a lily pad lies (the water sheet's own pad field, cell for cell): a leaf gives back no stag
  float padAt(vec2 w){
    vec2 lp = stackXZ(w); float pond = 1.0 - smoothstep(0.75, 1.0, length((lp - vec2(0.0, 60.0)) / vec2(78.0, 68.0)));
    vec2 lc = floor(lp / 1.7), lf = fract(lp / 1.7) - 0.5; float lh = h21(lc + 11.0), rad = 0.36 * (0.5 + 0.9 * h21(lc + 0.7));
    vec2 off = (vec2(h21(lc + 2.3), h21(lc + 5.9)) - 0.5) * (0.96 - 2.0 * rad), ld = lf - off + vec2(sin(uTime * 0.7 + lh * 20.0), cos(uTime * 0.6 + lh * 9.0)) * 0.012;
    float lpatch = smoothstep(0.3, 0.52, vn(lp * 0.045 + 3.0));
    lpatch = max(lpatch, 0.62 * (1.0 - smoothstep(9.0, 24.0, abs(lp.x))) * smoothstep(-4.0, 10.0, lp.y) * (1.0 - smoothstep(120.0, 160.0, lp.y)) * smoothstep(0.25, 0.5, vn(lp * 0.21 + 7.0) + 0.25));
    float band2 = (1.0 - smoothstep(30.0, 62.0, abs(lp.x - 4.0))) * smoothstep(150.0, 168.0, lp.y) * (1.0 - smoothstep(205.0, 228.0, lp.y)) * smoothstep(0.3, 0.55, vn(lp * 0.13 + 5.0) * 0.6 + vn(lp * 0.37) * 0.4 + 0.12);
    float want = step(1.0 - max((0.66 * pond + 0.12) * lpatch, 0.6 * band2) * uPads * step(length(lp - vec2(0.0, 80.0)), 190.0), lh);
    float rn = length(ld) / max(rad, 1e-3), la = atan(ld.y, ld.x + 1e-5) + lh * 40.0;
    return want * (1.0 - smoothstep(0.94, 1.04, rn)) * (1.0 - smoothstep(0.9, 0.96, cos(la)) * step(0.12, rn));
  }
  #endif
  void main(){
    #ifdef MIRROR
      if (vFy > 0.0) discard;
      float kY = cameraPosition.y / max(cameraPosition.y - vFy, 1e-3); vec2 hx = mix(cameraPosition.xz, vW.xz, kY);
      if ((hx.x > -32.0 && hx.x < 18.0 && hx.y > 48.0 && hx.y < 62.0) || (hx.x > -2.0 && hx.x < 14.0 && hx.y > 20.0 && hx.y <= 48.0)) discard;
    #endif
    float part = vK.x, seed = vK.z; vec3 p = vP, n0 = normalize(vN0 + vec3(0.0, 1e-5, 0.0));
    vec3 n = normalize(vN + vec3(0.0, 1e-5, 0.0)); vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-5, 0.0));
    if (dot(n, V) < 0.0) n = -n;
    float fz = vn(p.zy * 38.0 + p.x * 21.0), fz2 = vn(p.zy * 7.0 + seed * 17.0);
    // (round 15) every animal its own coat: tone from dark to pale, a lean toward red or toward grey, spots bold on some and nearly gone on others
    float tn1 = fract(seed * 7.3), tn2 = fract(seed * 13.1), spotK = mix(0.25, 1.0, smoothstep(0.12, 0.5, fract(seed * 3.71))), spotS = 6.2 + 2.6 * fract(seed * 5.3);
    vec3 coat = mix(uCoatDk, uCoat, 0.4 + 0.6 * fz2) * (0.86 + 0.28 * fz) * (0.7 + 0.55 * tn1) * mix(vec3(1.0), tn2 > 0.5 ? vec3(1.14, 0.9, 0.74) : vec3(0.88, 0.94, 1.0), abs(tn2 - 0.5) * 1.3), alb = coat;
    float ao = 1.0, sheen = 0.5, keep = 0.0, glint = 0.0;
    if (part < 0.5) {
      vec2 ar = n0.xy; if (dot(ar, ar) < 1e-6) ar = vec2(0.0, 1.0);
      float trunk = 1.0 - smoothstep(0.72, 0.92, p.z), around = atan(ar.x, ar.y), aa = abs(around);
      float sp = spotK * spots(vec2(p.z * spotS, around * 2.7 * spotS / 7.2), seed * 31.0) * smoothstep(0.16, 0.34, aa) * (1.0 - smoothstep(1.45, 1.95, aa)) * smoothstep(-0.97, -0.82, p.z) * trunk;
      float row = smoothstep(0.3, 0.19, length(vec2(fract(p.z * 7.2 + 0.5) - 0.5, (aa - 0.27) * 2.7))) * trunk * smoothstep(-0.9, -0.75, p.z);   // the row beside the spine
      alb = mix(alb, uPale * 1.12, max(sp, row) * 0.8);
      alb = mix(alb, uCoatDk * 0.42, (1.0 - smoothstep(0.07, 0.17, aa)) * smoothstep(-0.95, -0.8, p.z) * (1.0 - smoothstep(2.2, 2.45, p.y)) * 0.85);   // dorsal stripe, up the nape
      alb = mix(alb, uPale, smoothstep(-0.25, -0.75, n0.y) * trunk);                                                                                  // belly
      alb = mix(alb, uPale * 0.92, (1.0 - trunk) * smoothstep(0.15, 0.7, n0.z - n0.y * 0.6) * (1.0 - smoothstep(2.05, 2.3, p.y)) * 0.55);            // throat
      float rump = smoothstep(-0.1, -0.85, n0.z) * step(p.z, -0.6) * smoothstep(1.05, 1.3, p.y) * (1.0 - 0.6 * smoothstep(1.48, 1.62, p.y)) * (0.75 + 0.25 * fz2);
      alb = mix(alb, uCoatDk * 0.4, smoothstep(-0.05, -0.3, n0.z) * step(p.z, -0.6) * (1.0 - rump) * 0.7);
      alb = mix(alb, vec3(0.8, 0.76, 0.68), rump); keep = max(rump, max(sp, row));
      alb = mix(alb, uPale, smoothstep(-0.2, -0.7, n0.y) * step(1.2, p.z) * 0.7);                                                                    // chin
      alb = mix(alb, vec3(0.025, 0.02, 0.02), smoothstep(1.585, 1.64, p.z));                                                                         // nose
      float eyeD = length(vec3((abs(p.x) - 0.094) * 0.6, p.y - 2.485, p.z - 1.315)), eye = 1.0 - smoothstep(0.03, 0.04, eyeD);
      alb = mix(alb, uPale * 1.05, (1.0 - smoothstep(0.05, 0.075, eyeD)) * 0.6);                                                                     // the pale ring round the eye
      alb = mix(alb, uPale * 0.95, smoothstep(1.47, 1.53, p.z) * (1.0 - smoothstep(1.56, 1.6, p.z)) * 0.6);                                          // the pale band behind the nose
      alb = mix(alb, uCoatDk * 0.5, (1.0 - smoothstep(0.02, 0.06, abs(p.x))) * smoothstep(1.2, 1.3, p.z) * smoothstep(0.2, 0.7, n0.y) * 0.6);        // a dark blaze down the brow
      alb = mix(alb, vec3(0.012), eye); sheen = mix(sheen, 3.0, eye);
      glint = eye * (1.0 - smoothstep(0.006, 0.014, length(vec2(p.y - 2.497, p.z - 1.325))));
      ao = mix(0.6, 1.0, smoothstep(-0.95, 0.1, n0.y));
    } else if (part < 4.5) {
      float inner = smoothstep(0.15, 0.7, -n0.x * sign(p.x));
      alb = mix(alb, uPale * 1.12, spots(vec2(p.z * 7.2, p.y * 7.2), seed * 31.0 + 5.0) * smoothstep(1.05, 1.25, p.y) * (1.0 - inner) * 0.8);
      alb = mix(alb, uPale, inner * 0.65 * smoothstep(0.55, 1.0, p.y));
      alb = mix(alb, uCoatDk * 0.6, (1.0 - smoothstep(0.3, 0.8, p.y)) * 0.7);
      alb = mix(alb, vec3(0.05), 1.0 - smoothstep(0.07, 0.11, p.y));
      ao = mix(0.72, 1.0, smoothstep(0.5, 1.5, p.y) * (1.0 - 0.5 * inner));
    } else if (part < 5.5) {
      alb = coat * 0.86;
    } else if (part < 6.5) {
      alb = uVelvet * (0.8 + 0.4 * fz); sheen = 1.4;
    } else {
      alb = mix(vec3(0.78, 0.74, 0.66), uCoatDk * 0.5, max(smoothstep(0.1, 0.7, n0.y), 1.0 - smoothstep(0.0, 0.03, abs(p.x))));      // a dark line down its middle
    }
    alb *= mix(0.62, 1.0, smoothstep(0.15, 0.7, vW.y));                                       // wet to the knees
    float lit = max(sunMask(vec3(vW.x, max(vW.y, 0.1), vW.z)), 0.06), wrap0 = 0.0;
    alb = mix(alb, vec3(dot(alb, vec3(0.3, 0.5, 0.2))) * vec3(0.98, 0.97, 1.02), 0.2 * (1.0 - lit));          // in shade the chestnut cools a little, as the kit herd's does beside it
    alb *= 1.0 - 0.45 * (1.0 - lit) * keep;                                                   // spots and rump are shaded with the coat: no dots that glow in a deck's shadow
    float wrap = clamp(dot(n, uSunDir) * 0.62 + 0.38, 0.0, 1.0);
    vec3 sky = uAmbCol * (0.72 + 0.43 * n.y) + (uAmbCol * 0.3 + uSunCol * 0.14 * lit) * vec3(0.72, 0.86, 0.76) * clamp(-n.y, 0.0, 1.0);   // and the light off the water
    vec3 skyD = mix(sky, vec3(dot(sky, vec3(0.333))), 0.4 * (1.0 - lit));                                   // a less violet ambient in shade
    vec3 col = alb * (skyD * ao * (1.0 + 1.4 * (1.0 - lit)) + uSunCol * wrap * wrap * lit);
    float rim = pow(max(1.0 - abs(dot(n, V)), 0.0), 2.4);
    col += (uAmbCol * 0.2 + uSunCol * 0.3 * lit) * rim * (0.35 + 0.65 * fz) * sheen * vec3(1.0, 0.86, 0.72) * uRimK * (1.0 + 1.6 * vRim);      // the coat's nap against the light
    col += uSunCol * vec3(1.0, 0.9, 0.78) * 0.34 * vRim * pow(max(1.0 - abs(dot(n, V)), 0.0), 3.2) * (0.3 + 0.7 * lit) * smoothstep(-0.5, 0.3, n.y);      // the hero's outline burns: a rim of low sun along back, neck and antlers
    col += (uAmbCol * 1.2 + uSunCol * 0.9 * lit) * glint;                                                                                                   // the light in its eye
    float alpha = 1.0;
    #ifdef MIRROR
      // how much of the animal the water gives back: little looking down beside us, nearly all of it toward grazing
      float gz = 1.0 - clamp(cameraPosition.y / max(length(cameraPosition - vec3(hx.x, 0.0, hx.y)), 1e-3), 0.0, 1.0);
      alpha = mix(0.32, 0.9, gz * gz * gz) * (1.0 - 0.94 * padAt(hx)); col *= vec3(0.66, 0.72, 0.8);
    #endif
    gl_FragColor = vec4(max(col, vec3(0.0)), alpha);
    #include <fog_fragment>
  }`;function He(t){const a=t.count,s=t.geometry||Oe(),c=(e,D=1)=>new i.Color(e).multiplyScalar(D),b=new i.InstancedBufferAttribute(new Float32Array(a*4),4),h=new i.InstancedBufferAttribute(new Float32Array(a*4),4),f=new i.InstancedBufferAttribute(new Float32Array(a*4),4),p=new i.InstancedBufferAttribute(new Float32Array(a*4),4);b.setUsage(i.DynamicDrawUsage),f.setUsage(i.DynamicDrawUsage),p.setUsage(i.DynamicDrawUsage);for(let e=0;e<a;e++)h.setXYZW(e,t.phases[e],t.sizes[e],t.stags[e]?1:0,t.seeds[e]),b.setXYZW(e,0,-50,0,0);s.setAttribute("iA",b),s.setAttribute("iB",h),s.setAttribute("iC",f),s.setAttribute("iD",p),s.instanceCount=a;const k={uShMin:{value:.5},...t.fogU(),...t.shared,uStride:{value:2.6},uStrideLen:{value:t.strideLen??8.8},uShadowK:{value:t.shadowK??.5},uRimK:{value:t.rimK??1},uPads:t.padsU||{value:1},uCoat:{value:c(t.coat||"#9c6038")},uCoatDk:{value:c(t.coatDark||"#684028")},uPale:{value:c(t.pale||"#e2d2b4")},uVelvet:{value:c(t.velvet||"#8A6A58")}},F=Je(t.common),_=new i.ShaderMaterial({uniforms:k,fog:!0,side:i.DoubleSide,vertexShader:Ie,fragmentShader:F}),M=new i.ShaderMaterial({uniforms:k,fog:!0,side:i.DoubleSide,defines:{MIRROR:1},depthFunc:i.GreaterDepth,depthWrite:!1,vertexShader:Ie,fragmentShader:F,blending:i.CustomBlending,blendSrc:i.SrcAlphaFactor,blendDst:i.OneMinusSrcAlphaFactor,blendEquation:i.AddEquation}),q=new i.Mesh(s,_);q.frustumCulled=!1,q.name="near-deer";const K=new i.Mesh(s,M);K.frustumCulled=!1,K.renderOrder=-.3,K.name="near-deer-mirror";const W=[-1,0,-1,1,0,-1,1,0,1,-1,0,1,-1,0,0,1,0,0,1,0,1,-1,0,1],x=[2,2,2,2,0,0,0,0],n=[0,1,2,0,2,3,4,5,6,4,6,7];for(let e=0;e<4;e++){const D=W.length/3;W.push(-1,0,0,1,0,0,1,1,0,-1,1,0),x.push(3+e,3+e,3+e,3+e),n.push(D,D+1,D+2,D,D+2,D+3)}for(let e=0;e<6;e++){const D=W.length/3;W.push(-1,0,-1,1,0,-1,1,0,1,-1,0,1),x.push(7+e,7+e,7+e,7+e),n.push(D,D+1,D+2,D,D+2,D+3)}const A=new i.InstancedBufferGeometry;A.setAttribute("position",new i.Float32BufferAttribute(W,3)),A.setAttribute("aK",new i.Float32BufferAttribute(x,1)),A.setIndex(n),A.setAttribute("iA",b),A.setAttribute("iB",h),A.setAttribute("iC",f),A.setAttribute("iD",p),A.instanceCount=a;const r=new i.ShaderMaterial({uniforms:k,fog:!0,transparent:!0,depthWrite:!1,side:i.DoubleSide,vertexShader:`
      attribute vec4 iA; attribute vec4 iB; attribute vec4 iC; attribute vec4 iD; attribute float aK;
      uniform float uTime, uStride, uStrideLen, uShMin; uniform vec3 uSunDir;
      varying vec2 vQ; varying float vK; varying vec3 vW; varying float vSeed; varying float vT;
      #include <fog_pars_vertex>
      ${Re}
      float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      void main(){
        vec2 Fw = vec2(sin(iA.w), cos(iA.w)), X = vec2(-Fw.y, Fw.x); vec3 P = iA.xyz; float sz = iB.y;
        float sr = uStride * (0.9 + 0.22 * fract(iB.w * 5.3));
        float wet = 1.0 - smoothstep(-0.1, 0.5, P.y), ph = (uTime * sr + iB.x) * 6.2832;      // no foam while the animal is in the air
        vK = aK; vSeed = iB.w; vT = 1.0; vec4 mvPosition;
        if (aK > 1.5 && aK < 2.5) {
          // the shadow: from under the animal to where its back and head fall, drawn out by a low sun, sliding ahead as it leaps
          float sl = length(uSunDir.xz), body = sz * 1.5, lift = max(P.y, 0.0) + 0.25, tanE = max(uSunDir.y / max(sl, 1e-3), max(uShMin, 0.1)), reach = body * 0.8 / tanE;      // (uShMin: how long a low sun may draw a shadow out)
          vec2 sd = sl > 1e-3 ? -uSunDir.xz / sl : vec2(0.0, -1.0), sx = vec2(sd.y, -sd.x);
          vQ = position.xz; vT = 1.0 - 0.5 * smoothstep(0.5, 3.0, lift);
          vec2 xz = P.xz + sd * (lift / tanE + reach * 0.5 + position.z * (reach * 0.5 + body * 0.75)) + sx * position.x * body * 0.6;
          vW = vec3(xz.x, 0.04, xz.y); mvPosition = viewMatrix * vec4(vW, 1.0);
        } else if (aK < 0.5) {
          vQ = position.xz; float sc = sz * wet, airW = smoothstep(4.5, 12.0, cameraPosition.y);      // (from the air the wake is drawn out long and white)
          vec2 xz = P.xz - Fw * (position.z * 3.6 * (1.0 + 0.7 * airW) - 0.8) * sc + X * position.x * (0.55 + position.z * 0.75) * (1.0 + 0.3 * airW) * sc;      // (a short churned patch: the long V it used to draw lay across the legs of the animal behind as white streaks)
          vW = vec3(xz.x, 0.05, xz.y); mvPosition = viewMatrix * vec4(vW, 1.0);
        } else if (aK > 6.5) {
          // hoof rings: two are born with every stride where the hooves went in and stay there, widening, while the animal runs on;
          // six are on the water behind each animal at any moment
          float gi = aK - 7.0, age = fract((uTime * sr * 2.0 + gi) / 6.0 + iB.x), back = uStrideLen * 3.0 * age;      // a ring lives three strides
          vec2 c = P.xz - Fw * back + X * (h21(vec2(gi + 1.0, floor((uTime * sr * 2.0 + gi) / 6.0 + iB.x) + iB.w * 9.0)) - 0.5) * 0.7 * sz;
          float r = sz * (0.2 + 1.45 * pow(age, 0.7)) * wet * (0.75 + 0.5 * h21(vec2(gi + 3.0, iB.w * 17.0)));
          vQ = position.xz * 1.12; vT = age; vW = vec3(c.x + position.x * r * 1.12, 0.045, c.y + position.z * r * 1.12);
          mvPosition = viewMatrix * vec4(vW, 1.0);
        } else {
          // a hoof strikes when its leg is furthest forward; the splash stays where the hoof went in while the animal runs on
          float leg = aK - 2.0, fore = step(2.5, leg), tau = fract(legPhase(leg, ph) / 6.2832 - 0.75);
          vec2 base = P.xz + Fw * (mix(-0.05, 1.25, fore) * sz - uStrideLen * tau) + X * (mod(leg, 2.0) < 0.5 ? -0.17 : 0.17) * sz;
          vQ = position.xy; vT = tau / 0.46; vW = vec3(base.x, 0.0, base.y);
          float s = sz * (1.0 + 0.7 * iD.y) * wet * (0.5 + 0.8 * sqrt(min(vT, 1.0))) * step(tau, 0.46);      // (the great stag throws a taller sheet: iD.y)                           // (no higher than the hock: a splash never crosses the body)
          mvPosition = viewMatrix * vec4(vW, 1.0); mvPosition.xy += vec2(position.x * 0.72, position.y * 0.62) * s;
        }
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${t.common}
      uniform float uShadowK;
      varying vec2 vQ; varying float vK; varying vec3 vW; varying float vSeed; varying float vT;
      #include <fog_pars_fragment>
      void main(){
        float a, u = vQ.x, v = vQ.y, lit = sunMask(vW);
        if (vK > 1.5 && vK < 2.5) {
          if ((vW.x > -32.5 && vW.x < 18.5 && vW.z > 47.5 && vW.z < 62.5) || (vW.x > -2.5 && vW.x < 14.5 && vW.z > 19.5 && vW.z <= 48.0)) discard;
          a = (1.0 - smoothstep(0.25, 1.0, length(vQ))) * uShadowK * lit * vT;
          if (a < 0.01) discard;
          gl_FragColor = vec4(vec3(0.03, 0.05, 0.09) * uAmbCol * 2.0, a);
          #include <fog_fragment>
          return;
        }
        if (vK < 0.5) {
          // the wake: two torn arms of foam opening behind the animal and a churned patch between them
          // (a churned patch of foam behind the hooves that breaks into flecks as it falls astern: round cells, no drawn lines)
          float churn = exp(-(u * u * 3.2 + (v - 0.42) * (v - 0.42) * 8.0));
          float n = vn(vW.xz * 4.6 + vec2(0.0, uTime * 1.1)) * 0.55 + vn(vW.xz * 11.0 - uTime * 0.7) * 0.45;
          a = clamp(churn * (0.2 + 1.5 * smoothstep(0.4, 0.72, n)) - 0.2 + 0.2 * churn * smoothstep(4.5, 12.0, cameraPosition.y), 0.0, 1.0) * (1.0 - v) * (0.5 + 0.5 * lit) * 0.8;
        } else if (vK > 6.5) {
          // a hoof ring: a pale crest with a dark trough inside it and a fainter ring within, fading as it widens; broken round its rim
          if ((vW.x > -32.5 && vW.x < 18.5 && vW.z > 47.5 && vW.z < 62.5) || (vW.x > -2.5 && vW.x < 14.5 && vW.z > 19.5 && vW.z <= 48.0)) discard;
          float rn = length(vQ), ang = atan(u, v + 1e-4), fade = (1.0 - vT) * sqrt(1.0 - vT) * smoothstep(0.0, 0.06, vT) * (0.15 + 0.85 * smoothstep(0.25, 0.7, vn(vec2(ang * 2.2 + vSeed * 9.0, vT * 3.0 + vSeed * 5.0))));      // arcs of a ring, never a drawn circle
          float c1 = (rn - 1.0) / 0.05, c2 = (rn - 0.62) / 0.045, t1 = (rn - 0.9) / 0.06;
          float crest = exp(-c1 * c1) + 0.45 * exp(-c2 * c2), trough = exp(-t1 * t1);
          a = clamp(crest * 0.42 + trough * 0.26, 0.0, 1.0) * fade;
          if (a < 0.01) discard;
          gl_FragColor = vec4(mix(vec3(0.03, 0.05, 0.08) * uAmbCol * 2.0, uAmbCol * 0.85 + uSunCol * 0.55 * lit, clamp(crest * 0.42 / max(crest * 0.42 + trough * 0.26, 1e-3), 0.0, 1.0)), a);
          #include <fog_fragment>
          return;
        } else {
          // the splash: a crown of water thrown up and outward that tears into drops as it ages; never beads on spokes
          // a short sheet of water thrown up where the hoof went in, torn along its top, and round drops flung out beyond it on their
          // own arcs, each catching the light: never rays drawn across the animal
          float k = clamp(vT, 0.0, 1.0), r = length(vec2(u, v * 1.2)), ang = atan(u, v + 1e-3), rn = r / (0.32 + 0.68 * sqrt(k));
          float crown = smoothstep(0.08, 0.2, rn) * (1.0 - smoothstep(0.4, 0.6, rn)) * (1.0 - smoothstep(0.7, 1.25, abs(ang)));
          float torn = smoothstep(0.3 + 0.3 * k, 0.6 + 0.3 * k, vn(vec2(ang * 4.0 + vSeed * 31.0, rn * 3.0 - k * 2.0)));
          vec2 dq = vec2(ang * 4.2 + vSeed * 13.0, rn * 5.5 - k * 2.4), di = floor(dq), df = fract(dq) - 0.5; float dh = h21(di + vSeed * 7.0);
          float drop = (1.0 - smoothstep(0.1, 0.25, length(df - (vec2(dh, h21(di + 3.1)) - 0.5) * 0.5))) * step(0.42, dh) * smoothstep(0.34, 0.52, rn) * (1.0 - smoothstep(0.9, 1.04, rn)) * (1.0 - smoothstep(0.9, 1.4, abs(ang)));
          a = min((crown * torn * 0.8 * (1.0 - k) + drop * 0.95 + exp(-r * r * 22.0) * 0.5 * (1.0 - k)) * (1.0 - k * k), 1.0);
        }
        if (a < 0.01) discard;
        vec3 col = mix(uAmbCol * 0.95, uAmbCol * 0.65 + uSunCol * 1.05, lit);
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`}),z=new i.Mesh(A,r);z.frustumCulled=!1,z.renderOrder=2,z.name="near-deer-wake";const C=new i.Group;return C.name="near-herd",C.add(K,q,z),{object:C,count:a,uniforms:k,triangles:s.index.count/3*a,set(e,D,N,j,te,H,Z,L=0,ne=0){b.setXYZW(e,D,N,j,te),f.setXYZW(e,H,Z,L,ne)},setHead(e,D,N,j=0){p.setXYZW(e,D,N,j,0)},commit(){b.needsUpdate=!0,f.needsUpdate=!0,p.needsUpdate=!0}}}export{O as DECKS,Se as FLY,Ue as GB,Ze as buildHero,Xe as deckDist,ee as deckPoint,Ge as deckShade,Qe as deckUniforms,Oe as deerGeometry,Q as flyX,Ne as makeFallSet,He as makeNearDeer,Le as makeWisteria};
