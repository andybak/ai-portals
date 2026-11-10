import*as a from"three";const B=45,H=60,q=46,J=31,O=13,I=28,j=Math.PI/2,V=7*Math.PI/6,Z=["#0A0B0E","#DDE9F0","#8E6BD6","#2FA35A","#F2A21E","#D9471C","#1D5FBF"];function R(t){if(t<O)return q+(H-q)*Math.sin(Math.PI/2*(t/O));const l=Math.min(1.1,(t-O)/(B-O));return H-(H-J)*Math.pow(l,1.8)}function $(t,l){let d=1/0;d=Math.min(d,Math.hypot(t-I,l-Math.max(0,Math.min(160,l))));let s=Math.atan2(t,l);s<0&&(s+=Math.PI*2),s>=j&&s<=V&&(d=Math.min(d,Math.abs(Math.hypot(t,l)-I)));const n=Math.sin(V)*I,u=Math.cos(V)*I,M=Math.cos(V),g=-Math.sin(V),w=Math.max(0,Math.min(140,(t-n)*M+(l-u)*g));return d=Math.min(d,Math.hypot(t-n-M*w,l-u-g*w)),d}class tt{constructor(){this.p=[],this.n=[],this.i=[],this.r=[]}add(l,d,s=7,n=1){const u=l.length,M=this.p.length/3,g=new a.Vector3,w=new a.Vector3,p=new a.Vector3,r=new a.Vector3,z=new a.Quaternion,f=new a.Vector3;for(let e=0;e<u;e++){g.subVectors(l[Math.min(u-1,e+1)],l[Math.max(0,e-1)]).normalize(),e===0?(w.set(0,1,0),Math.abs(g.y)>.9&&w.set(1,0,0),w.addScaledVector(g,-w.dot(g)).normalize()):(z.setFromUnitVectors(r,g),w.applyQuaternion(z).addScaledVector(g,-w.dot(g)).normalize()),r.copy(g),p.crossVectors(g,w);const h=typeof d=="function"?d(e/(u-1),e):d;for(let o=0;o<s;o++){const c=o/s*Math.PI*2,x=Math.cos(c),b=Math.sin(c)*n;f.copy(w).multiplyScalar(x).addScaledVector(p,b),this.p.push(l[e].x+f.x*h,l[e].y+f.y*h,l[e].z+f.z*h),f.normalize(),this.n.push(f.x,f.y,f.z),this.r.push(h)}if(e>0)for(let o=0;o<s;o++){const c=M+(e-1)*s+o,x=M+(e-1)*s+(o+1)%s,b=c+s,P=x+s;this.i.push(c,b,x,x,b,P)}}const N=this.p.length/3,i=l[u-1];this.p.push(i.x+r.x*.05,i.y+r.y*.05,i.z+r.z*.05),this.n.push(r.x,r.y,r.z),this.r.push(.02);for(let e=0;e<s;e++)this.i.push(M+(u-1)*s+e,N,M+(u-1)*s+(e+1)%s)}geometry(){const l=new a.BufferGeometry;return l.setAttribute("position",new a.Float32BufferAttribute(this.p,3)),l.setAttribute("normal",new a.Float32BufferAttribute(this.n,3)),l.setAttribute("aRad",new a.Float32BufferAttribute(this.r,1)),l.setIndex(this.i),l}}function et(t,l,d){const s=i=>new a.Color(i),n=(i,e,h,o)=>{const c={};return i.getHSL(c),new a.Color().setHSL((c.h+e+1)%1,Math.min(1,Math.max(0,c.s*h)),Math.min(.92,Math.max(.04,c.l*o)))},u=s(t[2]),M=s(t[3]),g=s(t[4]),w=s(t[5]),p=s(t[1]);let r;if(l==="laburnum"){const i=s("#E9C84A");r=[n(i,0,1,.85),i,n(i,.02,.8,1.25),n(M,-.04,.45,1.75)]}else if(l==="cherry"){const i=s("#E0679A");r=[n(i,-.01,1,.8),i,n(i,.01,.8,1.25),n(i,.02,.5,1.5)]}else r=[n(u,.03,1.1,.8),u,n(u,-.045,.95,1.12),n(u,-.02,.7,1.38)];const z=[n(M,.05,1.1,.55),M,n(M,-.035,1,1.15),n(M,-.1,.95,1.45)];let f;if(d==="wine"){const i=s("#B01E3A");f=[n(i,-.02,1,.6),i,n(i,.02,1,1.2),n(i,.04,.95,1.5)]}else if(d==="ginkgo"){const i=s("#F0C928");f=[n(i,-.02,1,.8),i,n(i,.01,.95,1.1),n(i,.02,.8,1.3)]}else f=[n(w,-.01,1.05,.78),w,n(g,-.02,1,.98),n(g,.015,.95,1.12)];const N=[n(p,0,1.6,.8),n(p,.01,1,.92),p,n(p,-.02,.5,1.03)];return[...r,...z,...f,...N]}const E=`
uniform float uTime, uSeason, uFallT, uSheetGain, uGlassGain, uRain, uHeroFog;
uniform vec3 uFam[16];
uniform vec3 uLead;
float h11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec3 fam(float i, float x){
  float p = clamp(x, 0., 0.999) * 3.; float k = floor(p); int b = int(clamp(i, 0., 3.)) * 4 + int(k);
  return mix(uFam[b], uFam[b + 1], p - k);
}
// colour of a pane: x ramp position, c front coordinate (0 = first reached), r random, topC = 1 - height
vec3 seasonColor(float x, float c, float r, float topC){
  float S = clamp(uSeason, 0., 2.999); float i = floor(S); float f = S - i;
  float e = (i > 1.5 ? topC : c) * 0.8 + r * 0.1;
  return mix(fam(i, x), fam(i + 1., x), smoothstep(e, e + 0.08, f));
}
float frontCoord(vec3 p){ return clamp(0.5 - (p.x * 0.862 + p.z * 0.507) / 90., 0., 1.); }   // from the entry parting toward the exit parting
float sheet(vec3 d){
  float rp = uRain * 0.09 * sin(d.x * 23. + sin(d.z * 17. + uTime * 0.9) * 2. + d.y * 31. - uTime * 2.2);
  return uSheetGain * (1. + rp + 0.18 * max(d.y, 0.) + 0.07 * sin(d.x * 3.1 + d.z * 2.3 + uTime * 0.05) * sin(d.z * 4.7 - d.y * 2. + uTime * 0.03));
}
// slow travelling waves through everything that hangs; d = metres below the attachment
vec3 sway(vec3 p, float d){
  float ph = dot(p.xz, vec2(0.071, 0.052)) - uTime * 0.8;
  float a = min(0.028 * pow(max(d, 0.), 1.25), 1.6);
  return vec3(a * (sin(ph) + 0.4 * sin(ph * 2.3 + 1.7)), 0., a * 0.6 * sin(ph * 1.31 + p.x * 0.11 + 2.));
}
`;async function ot(t,l,d,s){const n=new tt,u=(e,h,o)=>new a.Vector3(e,h,o),M=[],g=d.strands,w=d.hand;for(let e=0;e<g;e++){const h=e/g*Math.PI*2+t.range(-.25,.25),o=t.range(1.1,1.7),c=t.range(.85,1.2),x=t()*9,b=t.range(4.2,5.8),P=[],C=64;for(let v=0;v<=C;v++){const m=v/C,U=-3+m*(q+5),A=Math.max(0,U)/q,y=Math.pow(Math.max(0,1-Math.max(0,U)/9),2.2)*b,_=1.95*(1-.35*A)+y+.35*Math.sin(A*11+x)+(U>38?(U-38)*.05:0),F=h+w*o*Math.PI*2*Math.pow(A,.85)+.25*Math.sin(A*7+x*2);P.push(u(Math.sin(F)*_,U-y*.3,Math.cos(F)*_))}n.add(P,v=>c*(1.65-.6*v)*(1+.16*Math.sin(v*40+x)+.1*Math.sin(v*91+x*3))*(v<.06?.5+v*8:1),8,.8),await s()}for(let e=0;e<3;e++){const h=t()*6.28,o=[];for(let c=0;c<=48;c++){const x=c/48,b=1+x*44,P=h-w*x*15,C=3.6-1.1*x+.4*Math.sin(x*23+e);o.push(u(Math.sin(P)*C,b,Math.cos(P)*C))}n.add(o,c=>.32-.14*c,5)}const p=d.ribs,r=[],z=[],f=(e,h,o)=>u(Math.sin(e)*h,R(h)+o,Math.cos(e)*h),N=(e,h,o,c,x)=>{for(let b=1;b<=12;b++){const P=b/12*Math.PI*1.7,C=x*(1-.6*b/12),v=o+Math.sin(P)*C,m=c-x+Math.cos(P)*C;e.push(u(Math.sin(h)*v,m,Math.cos(h)*v))}};for(let e=0;e<p;e++){const h=e/p*Math.PI*2+t.range(-.08,.08),o=w*d.swirl,c=t()*9,x=t.range(-.5,.5),b=t.range(17,23),P=[],C=v=>h+o*(v/B)+.1*Math.sin(v*.21+c);for(let v=0;v<=16;v++){const m=.6+(b-.6)*(v/16);P.push(f(C(m),m,x*(m/B))),v>5&&v%2===0&&M.push(P[P.length-1])}n.add(P,v=>1.15-.55*v,7),z.push(P);for(const v of[-1,1]){const m=v*(Math.PI/p)*t.range(.42,.58),U=t()*9,A=B+t.range(-1.2,1.5),y=[];for(let S=0;S<=22;S++){const k=S/22,T=b+(A-b)*k,G=C(T)+m*Math.pow(k,.7)+.05*Math.sin(k*9+U);y.push(f(G,T,x*(T/B)+.6*Math.sin(k*5+U))),S>1&&S%2===0&&M.push(y[y.length-1])}const _=y[y.length-1],F=Math.atan2(_.x,_.z);r.push({az:F,r:A,y:_.y}),z.push(y.slice()),N(y,F,A,_.y,t.range(1.5,2.3)),n.add(y,S=>(.62-.36*Math.min(1,S*1.3))*(S>.78?1-(S-.78)*2.2:1),6)}await s()}for(const[e,h,o]of[[O+3,.3,.5],[30.5,.26,1.1],[B-.4,.24,1.6]]){const c=[],b=t()*9;for(let P=0;P<=150;P++){const C=P/150*Math.PI*2,v=e+.7*Math.sin(C*5+b),m=R(v)-o*(.5+.5*Math.cos(C*p*2+b))-.25;c.push(u(Math.sin(C)*v,m,Math.cos(C)*v)),P%2===0&&P<150&&M.push(c[c.length-1])}n.add(c,h,5),await s()}for(let e=0;e<d.twigs;e++){const h=t.pick(z),o=h[t.int(3,h.length-2)],c=Math.hypot(o.x,o.z);if(c<9)continue;const x=Math.atan2(o.x,o.z),b=t.sign(),P=t.range(4,9),C=t.range(2,6),v=t.range(-1,3),m=[],U=t()*9;for(let F=0;F<=9;F++){const S=F/9,k=c+v*S,T=x+b*(P*S)/c,G=Math.max(27,o.y+(R(k)-R(c))-C*S*S+.4*Math.sin(S*6+U)-.2);m.push(u(Math.sin(T)*k,G,Math.cos(T)*k))}const A=m[m.length-1],y=Math.atan2(A.x,A.z),_=Math.hypot(A.x,A.z);for(let F=1;F<=6;F++){const S=F/6*Math.PI*1.5,k=.7*(1-.5*F/6);m.push(u(Math.sin(y+b*Math.sin(S)*k/_)*_,A.y-.7+Math.cos(S)*k,Math.cos(y+b*Math.sin(S)*k/_)*_))}n.add(m,F=>.2-.13*F,3),M.push(m[5],m[9]),e%24===23&&await s()}await s();const i=n.geometry();return i.boundingSphere=new a.Sphere(new a.Vector3(0,29,0),62),{geometry:i,attach:M,ribEnds:r}}function at(t){return new a.ShaderMaterial({fog:!0,uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...t},vertexShader:`
      varying vec3 vWp, vN, vLp;
      #include <fog_pars_vertex>
      void main(){
        vLp = position; vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz; vN = normalize(mat3(modelMatrix) * normal);
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:E+`
      varying vec3 vWp, vN, vLp;
      #include <fog_pars_fragment>
      void main(){
        vec3 V = normalize(cameraPosition - vWp), N = normalize(vN);
        float fr = 1. - abs(dot(N, V)); fr = fr * fr * fr;
        // pools of the season's colour sliding over the lead
        vec3 q = vLp * 0.19; float t = uTime * 0.25;
        float m = sin(q.x * 1.7 + t + sin(q.y * 1.3 - t * 0.7)) * sin(q.y * 2.1 - t * 0.6 + sin(q.z * 1.9)) * sin(q.z * 1.5 + q.x + t * 0.4);
        m = smoothstep(0.12, 0.7, m);
        float under = smoothstep(52., 30., vLp.y) * (1. - smoothstep(2.2, 3., uSeason) * 0.7) * (1. - smoothstep(4., 9., uFallT) * 0.6);
        vec3 pool = seasonColor(0.35 + 0.3 * sin(q.y + q.x), frontCoord(vLp), 0.5, 0.5) * m * under * 0.11;
        // solder seams: faint paler rings along the strands
        float seam = smoothstep(0.92, 1., sin(vLp.y * 2.3 + sin(vLp.x * 1.1 + vLp.z * 0.9) * 2.)) * 0.012;
        vec3 col = uLead + pool + seam + vec3(0.87, 0.92, 0.95) * fr * 0.035 * sheet(-V);
        gl_FragColor = vec4(col, 1.);
        #ifdef USE_FOG
          #ifdef FOG_EXP2
            float fogK = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth * uHeroFog);
          #else
            float fogK = smoothstep(fogNear, fogFar, vFogDepth) * uHeroFog;
          #endif
          gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogK);
        #endif
      }`})}function nt(t){const s=[],n=[];for(let M=0;M<=26;M++)for(let g=0;g<=112;g++){const w=g/112*Math.PI*2,p=2.2+(41.5-2.2)*Math.pow(M/26,.9),r=Math.sin(w)*p,z=Math.cos(w)*p;s.push(r,R(p)-.15+.7*t.n2(r*.09,z*.09)*Math.min(1,p/12),z)}for(let M=0;M<26;M++)for(let g=0;g<112;g++){const w=M*113+g,p=w+1,r=w+112+1,z=r+1;n.push(w,r,p,p,r,z)}const u=new a.BufferGeometry;return u.setAttribute("position",new a.Float32BufferAttribute(s,3)),u.setIndex(n),u.computeVertexNormals(),u.boundingSphere=new a.Sphere(new a.Vector3(0,45,0),50),u}function it(t){return new a.ShaderMaterial({fog:!0,side:a.DoubleSide,uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...t},vertexShader:`
      varying vec3 vWp, vN, vLp;
      #include <fog_pars_vertex>
      void main(){
        vLp = position; vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz; vN = normalize(mat3(modelMatrix) * normal);
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:E+`
      varying vec3 vWp, vN, vLp;
      #include <fog_pars_fragment>
      // is this cell glazed now?  x: glazed, y: ever glazed
      vec2 cellState(vec2 id, vec2 cpos){
        float h = h21(id + 3.7), r = length(cpos);
        float dens = 1. - 0.8 * smoothstep(0.4, 0.95, r / 45.);
        float ever = step(h, dens);
        float rel = 0.4 + 5.6 * sqrt(h21(id + 11.3));
        float keep = step(h21(id + 23.1), 0.05);
        float gone = step(rel, uFallT) * (1. - keep);
        return vec2(ever * (1. - gone), ever);
      }
      void main(){
        vec2 p = vLp.xz / 2.7;
        float fw = length(fwidth(p));
        vec2 ip = floor(p), fp = fract(p);
        float d1 = 9., d2 = 9.; vec2 id1 = vec2(0.), id2 = vec2(0.), c1 = vec2(0.), c2 = vec2(0.);
        for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
          vec2 g = vec2(float(i), float(j)), o = vec2(h21(ip + g), h21(ip + g + 57.3)) * 0.8 + 0.1;
          vec2 dv = g + o - fp; float d = dot(dv, dv);
          if (d < d1) { d2 = d1; id2 = id1; c2 = c1; d1 = d; id1 = ip + g; c1 = (ip + g + o) * 2.7; }
          else if (d < d2) { d2 = d; id2 = ip + g; c2 = (ip + g + o) * 2.7; }
        }
        float edge = sqrt(d2) - sqrt(d1);
        vec2 s1 = cellState(id1, c1), s2 = cellState(id2, c2);
        float bw = max(0.075, 1.5 * fw);
        float came = 1. - smoothstep(bw * 0.6, bw, edge);
        // bare came survives the fall here and there, as tracery
        float bare = step(0.45, h21(id1 + id2)) * max(s1.y, s2.y);
        float cameOn = came * max(max(s1.x, s2.x), bare);
        if (s1.x < 0.5 && cameOn < 0.5) discard;
        vec3 V = normalize(vWp - cameraPosition);
        float hx = h21(id1 + 1.9), hy = h21(id1 + 7.7);
        float graze = abs(dot(normalize(vN), V));
        float b = sheet(V) * mix(0.42, 1., smoothstep(0., 0.75, graze));
        vec2 lp = vLp.xz - c1;
        float streak = 0.8 + 0.2 * sin(dot(lp, vec2(cos(hx * 6.28), sin(hx * 6.28))) * 4. + sin(lp.x * 2.1 + hy * 9.) * 1.5);
        vec2 bb = fract(vLp.xz * 1.3 + hy * 5.) - 0.5; float bub = smoothstep(0.1, 0.03, length(bb)) * step(0.82, h21(floor(vLp.xz * 1.3 + hy * 5.)));
        vec3 gc = seasonColor(0.1 + 0.55 * hx, frontCoord(vec3(c1.x, 0., c1.y)), hy, 0.1);
        // frost: the few cells that stay turn clear and craze
        float frost = smoothstep(2.2, 3., uSeason);
        float craze = smoothstep(0.06, 0.0, abs(sin(lp.x * 5. + hy * 9.) * sin(lp.y * 4.3 + hx * 7.) - 0.2));
        vec3 glass = gc * b * streak * uGlassGain * 0.86 + bub * 0.4 + frost * craze * 0.35;
        float dissolve = 1. - smoothstep(0.12, 0.4, fw);
        vec3 col = mix(glass, mix(glass * 0.4, uLead, dissolve), cameOn * step(0.5, s1.x) + (1. - step(0.5, s1.x)));
        gl_FragColor = vec4(col, 1.);
        #ifdef USE_FOG
          #ifdef FOG_EXP2
            float fogK = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth * uHeroFog);
          #else
            float fogK = smoothstep(fogNear, fogFar, vFogDepth) * uHeroFog;
          #endif
          gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogK);
        #endif
      }`})}function st(t,l,d){const s=[],n=Math.round(d*.42),u=d-n,M=(p,r,z)=>{let f=null,N=z*z;for(const i of l){const e=(i.x-p)*(i.x-p)+(i.z-r)*(i.z-r);e<N&&(N=e,f=i)}return f},g=(p,r,z)=>{let f=Math.hypot(p,r),N=R(f)-.5;const i=M(p,r,f>40?6:2.2);if(i)p=i.x+t.range(-.3,.3),r=i.z+t.range(-.3,.3),N=i.y-.3,f=Math.hypot(p,r);else if(f>40)return;let e=z?t.range(8,11.5):f<20?t.range(12,21)+(20-f)*.5:t.range(10,23);const h=$(p,r);if(h<12.5){const c=25.5+t()*3.5-Math.max(0,f-38)*.35;e=Math.max(e,h<8.5?c:c+(e-c)*((h-8.5)/4))}const o=N-e;o<2.2||s.push({x:p,y:N,z:r,L:o,W:Math.min(4.4,1.7+o*.15)*t.range(.8,1.2),az:Math.atan2(p,r),rnd:t(),flat:t.range(.45,.8)})};for(let p=0;p<n;p++){const r=(p+t())/n*Math.PI*2,z=t.range(37,45.4);g(Math.sin(r)*z,Math.cos(r)*z,!0)}const w=[];for(let p=0;p<u;p++){let r=0,z=0,f=-1;for(let N=0;N<6;N++){const i=t()*Math.PI*2,e=Math.sqrt(t.range(7.5*7.5,1369)),h=Math.sin(i)*e,o=Math.cos(i)*e;let c=1e9;for(const x of w)c=Math.min(c,(x[0]-h)*(x[0]-h)+(x[1]-o)*(x[1]-o));c>f&&(f=c,r=h,z=o)}w.push([r,z]),g(r,z,!1)}return s}async function rt(t,l,d,s){let n=0;for(const o of l)n+=o.L*o.W;const u=[],M=[],g=[],w=[],p=[],r=[],z=[],f=[];let N=0;for(const o of l){++N%24===0&&await s();const c=Math.max(12,Math.round(d*o.L*o.W/n)),x=Math.cos(o.az),b=-Math.sin(o.az),P=Math.sin(o.az),C=Math.cos(o.az),v=t.range(-.6,.6),m=Math.min(o.L,t.range(2,6)+.12*o.L);for(let A=0;A<c;A++){const y=Math.pow((A+t())/c,.85),_=y*o.L,F=o.W*.5*Math.pow(1-y,.55)*(.3+.7*Math.min(1,y*9)),S=t()*Math.PI*2,k=Math.sqrt(t())*F,T=Math.cos(S)*k,G=Math.sin(S)*k*o.flat,K=(1.3-.62*y)*t.range(.8,1.2);u.push(o.x+x*T+P*G+x*v*y*y,o.y-_-.4,o.z+b*T+C*G+b*v*y*y),M.push(_+.4,t(),o.rnd,K);const X=_<m&&t()<.3,W=X?1e3:.3+5.2*Math.pow(t(),.45);g.push(o.az+t.range(-1,1)+(t()<.5?Math.PI:0),W,y,t.range(-.3,.3))}const U=w.length/3;for(let A=0;A<=6;A++){const y=A/6,_=y*o.L*.97;for(const F of[-1,1])w.push(o.x+x*v*y*y,o.y-_,o.z+b*v*y*y),p.push(_),r.push(F),f.push(m);if(A<6){const F=U+A*2;z.push(F,F+1,F+2,F+1,F+3,F+2)}}}await s();const i=new a.PlaneGeometry(1,1),e=new a.InstancedBufferGeometry;e.index=i.index,e.setAttribute("position",i.getAttribute("position")),e.setAttribute("iPos",new a.InstancedBufferAttribute(new Float32Array(u),3)),e.setAttribute("iA",new a.InstancedBufferAttribute(new Float32Array(M),4)),e.setAttribute("iB",new a.InstancedBufferAttribute(new Float32Array(g),4)),e.instanceCount=u.length/3,e.boundingSphere=new a.Sphere(new a.Vector3(0,30,0),75);const h=new a.BufferGeometry;return h.setAttribute("position",new a.Float32BufferAttribute(w,3)),h.setAttribute("aHang",new a.Float32BufferAttribute(p,1)),h.setAttribute("aSide",new a.Float32BufferAttribute(r,1)),h.setAttribute("aKeep",new a.Float32BufferAttribute(f,1)),h.setIndex(z),h.boundingSphere=new a.Sphere(new a.Vector3(0,30,0),75),{panes:e,strings:h,count:e.instanceCount}}function lt(t){return new a.ShaderMaterial({fog:!0,side:a.DoubleSide,uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...t},vertexShader:E+`
      attribute vec3 iPos; attribute vec4 iA, iB;
      varying vec2 vUv; varying vec3 vCol, vN, vWp; varying vec3 vK;   // vK: random, fallen, frost
      #include <fog_pars_vertex>
      vec3 rot(vec3 v, vec3 ax, float a){ float c = cos(a), s = sin(a); return v * c + cross(ax, v) * s + ax * dot(ax, v) * (1. - c); }
      void main(){
        float r1 = iA.y, size = iA.w;
        float tt = max(uFallT - iB.y, 0.), fell = step(0.0001, tt);
        vec3 c = iPos + sway(iPos, iA.x) * exp(-tt * 0.8);
        // drag-limited fall to 4 m/s, with a lazy sideways wander
        float late = max(tt - 3.5, 0.); c.y -= 4. * (tt - (1. - exp(-1.4 * tt)) / 1.4) + 0.3 * late * late;   // stragglers hurry, so the air clears
        float wd = min(tt, 2.5) * 0.55;
        c.xz += vec2(sin(tt * 0.9 + r1 * 40.), cos(tt * 0.7 + r1 * 23.)) * wd + vec2(0.25, -0.15) * tt;
        float land = smoothstep(0.15, 1.6, c.y); c.y = max(c.y, 0.12);
        float yaw = iB.x + 0.35 * sin(uTime * 2.1 + r1 * 50.) * (1. - fell);
        float tilt = iB.w + 0.12 * sin(uTime * 1.7 + r1 * 31.);
        vec3 X = vec3(cos(yaw), 0., -sin(yaw)), N = vec3(sin(yaw) * cos(tilt), sin(tilt), cos(yaw) * cos(tilt));
        vec3 Y = cross(N, X);
        vec3 ax = normalize(vec3(sin(r1 * 90.), 0.35, cos(r1 * 90.)));
        float ang = tt * (1.4 + 2.6 * fract(r1 * 7.3));
        X = rot(X, ax, ang); Y = rot(Y, ax, ang); N = rot(N, ax, ang);
        float cd = distance(c, cameraPosition);
        float sc = mix(1., land * smoothstep(0.7, 1.8, cd) * mix(0.3, 1., smoothstep(2., 9., cd)), fell);
        vec3 lp = c + (X * position.x * size * 0.84 + Y * position.y * size * 1.22) * sc;
        vUv = position.xy * 2.; vN = normalize(mat3(modelMatrix) * N);
        vCol = seasonColor(0.55 * iA.z + 0.27 * r1 + 0.18 * iB.z, frontCoord(iPos), r1, 1. - clamp(iPos.y / 60., 0., 1.));
        vK = vec3(r1, fell, smoothstep(2.2, 3., uSeason));
        vec4 wp = modelMatrix * vec4(lp, 1.); vWp = wp.xyz;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:E+`
      varying vec2 vUv; varying vec3 vCol, vN, vWp; varying vec3 vK;
      #include <fog_pars_fragment>
      void main(){
        float u = vUv.x, v = vUv.y, r = vK.x;
        // petal: pointed at the bottom, round at the top
        float w = v < 0. ? 0.84 * pow(max(v + 1., 0.), 0.62 + 0.3 * r) : 0.84 * sqrt(max(1. - v * v, 0.));
        float e = min(w - abs(u), (1. - v) * 1.4 + 0.02);
        if (e < 0.) discard;
        float fw = (abs(dFdx(u)) + abs(dFdy(u)) + abs(dFdx(v)) + abs(dFdy(v))) * 0.6;
        float bw = max(0.12, 1.5 * fw);
        float came = 1. - smoothstep(bw * 0.65, bw, e);
        vec3 V = normalize(vWp - cameraPosition), N = normalize(vN);
        float graze = abs(dot(N, V));
        float b = sheet(V) * mix(0.42, 1., smoothstep(0., 0.75, graze));
        float streak = 0.8 + 0.2 * sin(v * 3.2 + u * 7. * (r - 0.5) + r * 30. + sin(u * 4. + r * 11.));
        vec2 bb = fract(vUv * 1.7 + r * 7.) - 0.5; float bub = smoothstep(0.13, 0.04, length(bb)) * step(0.72, h21(floor(vUv * 1.7 + r * 7.) + r));
        float craze = smoothstep(0.08, 0.0, abs(sin(u * 6. + r * 9.) * sin(v * 5.3 + r * 7.) - 0.2)) * vK.z;
        float run = smoothstep(0.8, 1., sin(u * 9. + r * 40.)) * smoothstep(0.3, 1., sin(v * 2.4 + uTime * (2. + 2. * r) + r * 60.)) * uRain;
        vec3 glass = vCol * b * streak * uGlassGain * (1. - 0.12 * uRain) + bub * 0.45 + craze * 0.3 + run * 0.55;
        // a brief white glint as a tumbling pane turns its face to the light
        float gl = abs(dot(N, normalize(vec3(0., 0.75, 0.) - V)));
        gl *= gl; gl *= gl; gl *= gl; gl *= gl; gl *= gl; gl *= gl;
        glass += vec3(1., 0.97, 0.92) * gl * 3.2 * vK.y;
        float dissolve = 1. - smoothstep(0.18, 0.5, fw);
        vec3 col = mix(glass, mix(glass * 0.72, uLead, dissolve), came);
        gl_FragColor = vec4(col, 1.);
        #ifdef USE_FOG
          #ifdef FOG_EXP2
            float fogK = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth * uHeroFog);
          #else
            float fogK = smoothstep(fogNear, fogFar, vFogDepth) * uHeroFog;
          #endif
          gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogK);
        #endif
      }`})}function ct(t){return new a.ShaderMaterial({fog:!0,side:a.DoubleSide,uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...t},vertexShader:E+`
      attribute float aHang, aSide, aKeep;
      #include <fog_pars_vertex>
      void main(){
        // once its panes have gone the stalk breaks back to a short bare stub
        float h = mix(aHang, min(aHang, aKeep), smoothstep(3., 8., uFallT + h11(aKeep) * 1.5));
        vec3 p = position; p.y += aHang - h; p += sway(p, h);
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        vec2 dn = (modelViewMatrix * vec4(0., 1., 0., 0.)).xy; float l = length(dn); dn = l > 1e-4 ? dn / l : vec2(0., 1.);
        float wdt = clamp(0.0016 * -mvPosition.z, 0.03, 0.14);
        mvPosition.xy += vec2(-dn.y, dn.x) * aSide * wdt;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uLead; uniform float uHeroFog;
      #include <fog_pars_fragment>
      void main(){ gl_FragColor = vec4(uLead, 1.);
        #ifdef USE_FOG
          #ifdef FOG_EXP2
            float fogK = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth * uHeroFog);
          #else
            float fogK = smoothstep(fogNear, fogFar, vFogDepth) * uHeroFog;
          #endif
          gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogK);
        #endif
      }`})}function ft(t,l){const d=new a.PlaneGeometry(1,1);d.rotateX(-Math.PI/2);const s=new a.InstancedBufferGeometry;s.index=d.index,s.setAttribute("position",d.getAttribute("position"));const n=new Float32Array(l*4);for(let u=0;u<l;u++){const M=t()*Math.PI*2,g=Math.sqrt(t.range(36,2116));n[u*4]=Math.sin(M)*g,n[u*4+1]=Math.cos(M)*g,n[u*4+2]=t.range(8,17),n[u*4+3]=t()}return s.setAttribute("iP",new a.InstancedBufferAttribute(n,4)),s.instanceCount=l,s.boundingSphere=new a.Sphere(new a.Vector3(0,0,0),70),s}function ht(t){return new a.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),...t},vertexShader:E+`
      attribute vec4 iP; varying vec2 vUv; varying vec3 vCol; varying float vR;
      #include <fog_pars_vertex>
      void main(){
        vec3 c = vec3(iP.x, 0.06 + iP.w * 0.03, iP.y);
        c += sway(c, 22.) * 1.4;
        vUv = position.xz * 2.; vR = iP.w;
        float fade = (1. - 0.75 * smoothstep(1., 8., uFallT)) * (1. - 0.6 * smoothstep(2.2, 3., uSeason));
        vCol = seasonColor(iP.w, frontCoord(c), iP.w, 0.5) * fade;
        vec4 mvPosition = modelViewMatrix * vec4(c + position * iP.z, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:E+`
      varying vec2 vUv; varying vec3 vCol; varying float vR;
      #include <fog_pars_fragment>
      void main(){
        float a = atan(vUv.y, vUv.x + 1e-4), l = length(vUv);
        float lobes = 0.88 + 0.12 * sin(a * 3. + vR * 20. + uTime * 0.3) * sin(a * 2. - vR * 9.);
        float m = smoothstep(lobes, 0.0, l);
        gl_FragColor = vec4(vCol * vCol * m * m * 0.22, 1.);
        #ifdef USE_FOG
          #ifdef FOG_EXP2
            gl_FragColor.rgb *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
          #else
            gl_FragColor.rgb *= 1. - smoothstep(fogNear, fogFar, vFogDepth);
          #endif
        #endif
      }`})}async function ut(t,l={}){const d=t.rng.fork?t.rng.fork("wisteria"):t.rng,s=t.noise,n=l.palette&&l.palette.length>=7?l.palette:Z,u=(t.quality?.detail??1)*(l.density??1),M=d(),g=d(),w=l.variant||(M<.7?"wisteria":"laburnum"),p=l.autumn||(g<.6?"amber":g<.8?"wine":"ginkgo"),r=Object.assign({summer:[.17,.3],autumn:[.575,.63],fall:.6,winter:[.7,.8]},l.timeline||{}),z=l.duration??40,f={uTime:{value:0},uSeason:{value:0},uFallT:{value:-1},uSheetGain:{value:l.sheetGain??1.15},uGlassGain:{value:l.glassGain??1.5},uHeroFog:{value:1},uFam:{value:et(n,w,p)},uLead:{value:new a.Color(n[0])},uRain:{value:l.rain??0}},N={strands:d.int(4,6),hand:d.sign(),ribs:d.int(13,17),swirl:d.range(.25,.7),twigs:150},i=new a.Group;i.name="wisteria-tree";const e=async()=>{t.yield&&await t.yield()},h=await ot(d,s,N,e),o=new a.Mesh(h.geometry,at(f));i.add(o),await t.yield?.();const c=new a.Mesh(nt(s),it(f));i.add(c),await t.yield?.();const x=st(d,h.attach,420);await t.yield?.();const b=await rt(d,x,Math.round(4e4*u),e);await e();const P=new a.Mesh(b.panes,lt(f));i.add(P);const C=new a.Mesh(b.strings,ct(f));i.add(C),await t.yield?.();let v=null;l.pools!==!1&&(v=new a.Mesh(ft(d,Math.round(130*Math.min(1,u))),ht(f)),v.renderOrder=2,i.add(v));const m=(L,D,Q)=>new a.Vector3(L,D,Q),U=[m(28,18,150),m(28,16.5,95),m(28,15,36)];for(let L=0;L<=8;L++){const D=j+(V-j)*(L/8);U.push(m(Math.sin(D)*I,14+4*Math.sin(Math.PI*L/8),Math.cos(D)*I))}const A=Math.sin(V)*I,y=Math.cos(V)*I,_=Math.cos(V),F=-Math.sin(V),S=m(_,0,F),k=m(A+_*35.2,15,y+F*35.2);U.push(k.clone(),m(A+_*105,16,y+F*105));const T={flyThrough:U,entryParting:{position:m(28,15,36),direction:m(0,0,-1),width:14},exitParting:{position:k,direction:S,width:14},orbit:{center:m(0,0,0),radius:I,fromAzimuth:j,toAzimuth:V,yMin:14,yMax:18},portalSeat:{position:m(A+_*95,16,y+F*95),normal:S.clone().negate()},viewpoints:{reveal:m(28,20,150),inside:m(28,15,10),underApex:m(9,16,9)},trunkTop:m(0,q,0),apex:m(0,H,0),rimRadius:B,curtainBottom:8};let G=!1;const K=(L,D)=>Math.min(1,Math.max(0,(L-D[0])/(D[1]-D[0])));function X(L){G=!0,L.season!=null&&(f.uSeason.value=Math.min(3,Math.max(0,L.season))),L.fallT!=null&&(f.uFallT.value=L.fallT)}function W(L){f.uSeason.value=K(L,r.summer)+K(L,r.autumn)+K(L,r.winter),f.uFallT.value=L>r.fall?(L-r.fall)*z:-1}function Y(L){G=!0,W(Math.min(1,Math.max(0,L)))}return{object:i,radius:B+1,height:H,center:m(0,31,0),anchors:T,variant:w,autumn:p,uniforms:f,setProgress:Y,setState:X,update(L,D){f.uTime.value=D,G||W(D/40%1)},dispose(){},ground:!0,groundY:0,stats:{panes:b.count,racemes:x.length}}}export{E as GLSL_COMMON,tt as Tubes,ut as buildHero,et as makeFamilies};
