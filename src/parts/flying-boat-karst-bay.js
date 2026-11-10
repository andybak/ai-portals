import*as i from"three";const et=["#2F8F78","#17574C","#C9C6B8","#1E3B24","#F2B27A","#2B3340","#B3402A"],z=(e=0,t=0,o=0)=>new i.Vector3(e,t,o),K=(e,t,o)=>e+(t-e)*o,qe=e=>Math.min(1,Math.max(0,e)),ie=(e,t,o)=>{const n=qe((o-e)/(t-e));return n*n*(3-2*n)},Ae=e=>{const t=new i.Color(e);return[t.r,t.g,t.b]},Ce=(e,t,o)=>[K(e[0],t[0],o),K(e[1],t[1],o),K(e[2],t[2],o)];class ut{constructor(){this.p=[],this.uv=[],this.c=[],this.t=[],this.i=[],this.n=0}grid(t,o={}){const n=t.length,g=t[0].length,k=this.n;let c=o.u0||0;const r=g>>1;for(let l=0;l<n;l++){const u=t[l];if(l>0){const y=t[l-1][r],v=u[r];c+=Math.hypot(v[0]-y[0],v[1]-y[1],v[2]-y[2])}let s=0;for(let y=0;y<g;y++){const v=u[y];if(y>0){const A=u[y-1];s+=Math.hypot(v[0]-A[0],v[1]-A[1],v[2]-A[2])}this.p.push(v[0],v[1],v[2]),this.uv.push(o.uOf?o.uOf(v,l,y):c,o.vOf?o.vOf(v,l,y):s);const d=o.col?o.col(v,l,y):[.6,.6,.6];this.c.push(d[0],d[1],d[2]);const S=o.ph?o.ph(v,l,y):[0,99];this.t.push(o.surf?o.surf(v,l,y):0,o.move?o.move(v,l,y):0,S[0],S[1])}}for(let l=0;l<n-1;l++)for(let u=0;u<g-1;u++){const s=k+l*g+u,y=s+1,v=s+g,d=v+1;o.flip?this.i.push(s,y,v,y,d,v):this.i.push(s,v,y,y,v,d)}this.n+=n*g}cap(t,o,n={}){this.grid([t,t.map(()=>o)],n)}async build(t){const o=async()=>{t&&await t.yield()},n=new i.BufferGeometry,g=new Float32Array(this.p),k=this.i,c=new Float32Array(g.length);await o(),n.setAttribute("position",new i.BufferAttribute(g,3)),n.setAttribute("uv",new i.BufferAttribute(new Float32Array(this.uv),2)),await o(),n.setAttribute("color",new i.BufferAttribute(new Float32Array(this.c),3)),await o(),n.setAttribute("aTag",new i.BufferAttribute(new Float32Array(this.t),4)),await o(),n.setIndex(k),await o();for(let r=0;r<k.length;r+=3){const l=k[r]*3,u=k[r+1]*3,s=k[r+2]*3,y=g[s]-g[u],v=g[s+1]-g[u+1],d=g[s+2]-g[u+2],S=g[l]-g[u],A=g[l+1]-g[u+1],W=g[l+2]-g[u+2],I=v*W-d*A,x=d*S-y*W,q=y*A-v*S;c[l]+=I,c[l+1]+=x,c[l+2]+=q,c[u]+=I,c[u+1]+=x,c[u+2]+=q,c[s]+=I,c[s+1]+=x,c[s+2]+=q,r%12e3===11997&&await o()}for(let r=0;r<c.length;r+=3){const l=Math.hypot(c[r],c[r+1],c[r+2])||1;c[r]/=l,c[r+1]/=l,c[r+2]/=l}return n.setAttribute("normal",new i.BufferAttribute(c,3)),n}}function Je(e,t,o,n,g,k,c=23,r=1){const l=[],u=(c-1)/2;for(let s=0;s<c;s++){const y=s<u?1:-1,v=Math.abs(s-u)/u,d=r*(1-Math.cos(v*Math.PI*.5))**1.25,S=5*g*(.2969*Math.sqrt(d)-.126*d-.3516*d*d+.2843*d*d*d-.1036*d*d*d*d),W=k*4*d*(1-d)+y*S+(r<1&&v>.999,0);l.push([e.x+t.x*d*n+o.x*W*n,e.y+t.y*d*n+o.y*W*n,e.z+t.z*d*n+o.z*W*n,d])}return l}const We=`
float h11(float n){ return fract(sin(n*127.1)*43758.5453); }
float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
vec2 h22(vec2 p){ float n = h21(p); return vec2(n, h21(p+n*17.3+3.1)); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }
float fbm3(vec2 p){ return vnoise(p)*0.55 + vnoise(p*2.13+7.1)*0.3 + vnoise(p*4.31+3.7)*0.15; }
`,ft=`
attribute vec4 aTag;
uniform vec3 uHP[6]; uniform vec3 uHD[6]; uniform float uHA[6];
varying vec3 vN; varying vec3 vW; varying vec3 vL; varying vec3 vLN; varying vec2 vUv; varying vec3 vCol; varying vec4 vTag;
#include <fog_pars_vertex>
vec3 hrot(vec3 q, vec3 d, float a){ float c = cos(a), s = sin(a); return q*c + cross(d, q)*s + d*dot(d, q)*(1.-c); }
void main(){
  vec3 p = position, n = normal;
  int id = int(aTag.y + 0.5);
  if (id > 0) { p = uHP[id] + hrot(p - uHP[id], uHD[id], uHA[id]); n = hrot(n, uHD[id], uHA[id]); }
  vL = p; vLN = n; vUv = uv; vCol = color; vTag = aTag;
  vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz;
  vN = mat3(modelMatrix) * n;
  vec4 mvPosition = viewMatrix * w;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ht=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uHorizonCol, uShadeCol, uWaterCol, uLampCol;
uniform float uTime, uWet, uMetal, uCabin, uLamp, uRunway, uAmbK;
uniform vec2 uPh; uniform vec3 uStripe; uniform float uStripeOn;
varying vec3 vN; varying vec3 vW; varying vec3 vL; varying vec3 vLN; varying vec2 vUv; varying vec3 vCol; varying vec4 vTag;
#include <fog_pars_fragment>
${We}
vec3 envCol(vec3 r, float t){
  float up = clamp(r.y, 0., 1.);
  vec3 sky = mix(uHorizonCol, uSkyCol, pow(up, 0.55));
  float sh = vnoise(r.xz*5. / max(0.25, -r.y) + vec2(t*0.35, -t*0.2));
  vec3 wat = mix(uWaterCol * 0.55, uHorizonCol * 0.42, 0.62) * (0.45 + 0.4*sh*sh);
  wat = mix(uHorizonCol*0.5, wat, smoothstep(0., 0.35, -r.y));
  return mix(wat, sky, smoothstep(-0.02, 0.04, r.y));
}
void main(){
  vec3 Ng = normalize(vN); if (!gl_FrontFacing) Ng = -Ng;
  vec3 N = Ng;
  vec3 V = normalize(cameraPosition - vW);
  vec3 L = normalize(uSunDir);
  float surf = vTag.x;
  float isFab = step(0.5, surf) * step(surf, 1.5);
  float isGlass = step(1.5, surf) * step(surf, 2.5);
  float isDark = step(2.5, surf) * step(surf, 3.5);
  float isLamp = step(3.5, surf);
  float isMetal = 1. - step(0.5, surf);
  vec3 base = vCol;
  float gloss = mix(0.55, 0.12, isFab); gloss = mix(gloss, 0.08, isDark);
  // ---- panel lines, per-panel tone, rivet rows (metal skin)
  vec2 g = vUv / vec2(0.92, 0.46);
  vec2 gw = fwidth(g) + 1e-5;
  vec2 gc = 0.5 - abs(fract(g) - 0.5);
  vec2 ln = 1. - smoothstep(vec2(0.), gw*1.6 + vec2(0.006, 0.012), gc);
  float lfade = 1. - smoothstep(0.1, 0.4, max(gw.x, gw.y));
  float line = max(ln.x, ln.y) * lfade;
  float tone = h21(floor(g) + 3.7);
  float mm = isMetal;
  base *= 1. + mm * (tone - 0.5) * 0.22 * lfade;
  gloss *= 1. + mm * (tone - 0.5) * 0.5;
  base *= 1. - mm * line * mix(0.26, 0.34, uMetal);
  vec2 duv = fwidth(vUv);
  float rfade = (1. - smoothstep(0.02, 0.05, max(duv.x, duv.y))) * mm;
  vec2 em = gc * vec2(0.92, 0.46);                 // metres to the nearest seam on each axis
  float r1 = length(vec2((fract(vUv.x/0.085) - 0.5)*0.085, em.y - 0.036));
  float r2 = length(vec2((fract(vUv.y/0.085) - 0.5)*0.085, em.x - 0.036));
  float riv = (1. - smoothstep(0.007, 0.015, min(r1, r2))) * rfade;
  base *= 1. - riv * 0.5;
  // ---- doped fabric: ribs showing through, slight scallop between them
  float rb = fract(vUv.x / 0.31);
  float rib = smoothstep(0.38, 0.5, abs(rb - 0.5));
  float ribw = 1. - smoothstep(0.1, 0.5, fwidth(vUv.x / 0.31));
  base *= 1. - isFab * ribw * (0.16 * rib - 0.07 * cos(rb * 6.2832));
  // ---- grime and rain streaks running aft
  float gr = fbm3(vec2(vL.z * 0.35, (vL.x + vL.y) * 2.6));
  float gr2 = fbm3(vL.xz * 1.7 + vL.y);
  base *= 1. - (1. - isLamp) * (0.3 * smoothstep(0.4, 0.85, gr) + 0.12 * gr2 - 0.05);
  // ---- portholes on the hull side
  float inRow = step(uPh.x, vTag.z) * step(vTag.z, uPh.y);
  float pu = (fract(vTag.z / 1.3) - 0.5) * 1.3;
  float pd = length(vec2(pu, vTag.w));
  float pd2 = length(vec2(pu, vTag.w - 1.15)) + 9. * step(vTag.z, uPh.x + 5.2) + 9. * step(uPh.y - 2.6, vTag.z);
  pd = min(pd, pd2) + 9. * (1. - inRow);
  float pw = fwidth(pd) + 1e-4;
  float pGlass = 1. - smoothstep(0.17 - pw, 0.17 + pw, pd);
  float pRim = (1. - smoothstep(0.225 - pw, 0.225 + pw, pd)) * (1. - pGlass);
  base = mix(base, base * 0.55 + 0.05, pRim);
  float sw = fwidth(vTag.w) + 1e-4;
  float stripe = step(vTag.w, 50.) * smoothstep(0.52 - sw, 0.52 + sw, vTag.w) * (1. - smoothstep(0.70 - sw, 0.70 + sw, vTag.w)) * uStripeOn;
  base = mix(base, uStripe, stripe * (1. - pGlass) * (1. - pRim));
  isGlass = max(isGlass, pGlass);
  // ---- glazing bars on the flight deck
  vec2 fr = 0.5 - abs(fract(vUv / vec2(0.62, 0.5)) - 0.5);
  float bar = step(1.5, surf) * step(surf, 2.5) * (1. - smoothstep(0.035, 0.05, min(fr.x * 0.62, fr.y * 0.5)));
  isGlass *= 1. - bar;
  base = mix(base, vec3(0.012, 0.018, 0.022), isGlass);
  base = mix(base, vec3(0.42, 0.43, 0.42), bar);
  gloss = mix(gloss, 0.95, isGlass);
  // ---- rain beads crawling aft
  vec3 an = abs(normalize(vLN));
  vec2 q = an.y > 0.55 ? vL.xz : (an.x > an.z ? vL.yz : vL.xz + vL.y);
  q.y += uTime * (0.55 + 0.5 * uRunway);
  vec2 bq = q * vec2(26., 7.);
  vec2 bi = floor(bq); vec2 bf = fract(bq);
  vec2 bo = h22(bi);
  float bfade = 1. - smoothstep(0.25, 0.8, max(fwidth(bq.x), fwidth(bq.y)));
  vec2 bd = (bf - 0.3 - 0.4 * bo) / vec2(26., 7.);
  float bdm = length(vec2(bd.x, bd.y * (bd.y > 0. ? 0.2 : 1.)));
  float bead = (1. - smoothstep(0.003, 0.0065, bdm)) * step(0.66, bo.x) * bfade * uWet * (1. - isLamp) * (1. - isGlass * 0.5);
  N = normalize(N + bead * vec3(bd.x, 0.004, min(bd.y, 0.01)) * 22.);
  // ---- light
  float ndl = dot(N, L);
  float lit = smoothstep(-0.08, 0.55, ndl);
  float skyv = Ng.y * 0.5 + 0.5;
  float cau = vnoise(vL.xz * 1.6 + vec2(uTime * 0.6, uTime * 0.37)) * vnoise(vL.xz * 3.3 - vec2(uTime * 0.45, -uTime * 0.5));
  vec3 shd = mix(uShadeCol, vec3(dot(uShadeCol, vec3(0.3333))), 0.5);
  vec3 bounce = mix(uHorizonCol, vec3(dot(uHorizonCol, vec3(0.3333))), 0.45);
  vec3 amb = mix(shd * 0.4 + bounce * 0.44 + mix(uWaterCol, bounce, 0.35) * 1.1 * cau * cau, uSkyCol * 0.8 + uHorizonCol * 0.3, smoothstep(0.25, 0.8, skyv));
  vec3 col = base * (uSunCol * lit * (0.55 + 0.45 * max(ndl, 0.)) * 0.74 + amb * 0.62 * uAmbK);
  // ---- reflections: sky above, shimmering jade below, the sun as a wet glint
  vec3 R = reflect(-V, N);
  float ndv = clamp(dot(N, V), 0., 1.);
  float f0 = mix(0.045, 0.4, isMetal * uMetal); f0 = mix(f0, 0.07, isGlass); f0 += bead * 0.25;
  float fres = f0 + (1. - f0) * pow(1. - ndv, 5.);
  vec3 env = envCol(R, uTime);
  vec3 tint = mix(vec3(1.), base * 1.25 + 0.08, isMetal * uMetal * (1. - isGlass));
  float wetg = clamp(gloss + uWet * 0.3 * (1. - isFab), 0., 1.);
  float downF = mix(1., 0.3, smoothstep(0.2, 0.75, -Ng.y));
  col = mix(col, env * tint, clamp(fres * (0.35 + 0.65 * wetg), 0., 1.) * (1. - isLamp) * downF);
  float rl = max(dot(R, L), 0.);
  float sp = pow(rl, mix(18., 140., wetg)) * mix(0.25, 2.2, wetg) + pow(rl, 420.) * bead * 9.;
  col += uSunCol * tint * sp * (0.25 + 0.75 * smoothstep(-0.25, 0.1, dot(Ng, L)));
  // ---- lit cabin behind the portholes, landing lamp
  col += pGlass * uCabin * vec3(1.0, 0.72, 0.38) * (0.55 + 0.45 * vnoise(vec2(vTag.z * 3., 1.)));
  float lens = 0.6 + 0.4 * cos(length(fract(vUv * 28.) - 0.5) * 9.);
  col = mix(col, uLampCol * (0.08 + uLamp * lens * (0.5 + 0.5 * ndv)), isLamp);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,ge={rootChord:6.3,tipChord:3,leZ:3.3,sweep:.085,leY:4.72,dihedral:.012,ailIn:11.2,ailOut:18.6,ailCut:.74},Be=e=>{const t=e<1.8?ge.rootChord:K(ge.rootChord,ge.tipChord,(e-1.8)/16.2);return e>18?t*Math.sqrt(Math.max(.02,1-((e-18)/2.03)**2)):t},je=e=>{const t=Math.abs(e),o=t<1.8?ge.rootChord:K(ge.rootChord,ge.tipChord,(t-1.8)/16.2);return z(e,ge.leY+ge.dihedral*t,ge.leZ-ge.sweep*t-(o-Be(t))*.45)},tt=e=>K(.17,.105,qe(e/20)),Ze=(e,t)=>{const o=Math.abs(e),n=Be(o),k=5*tt(o)*(.2969*Math.sqrt(t)-.126*t-.3516*t*t+.2843*t**3-.1036*t**4);return je(e).y-.05*t*n+(.03*4*t*(1-t)-k)*n},xe={keel(e,t){return e>1||e===1&&t?-.55+3.3*((e-1)/12)**3:e>-7||e===-7&&t?-.33+(1-e)/8*.75:.6+2.5*((-7-e)/8)**1.2},beam(e){return e>6?1.75*Math.max(0,1-((e-6)/7)**2)**.55:e>-1?1.75:e>-7?K(1.75,.55,((-1-e)/6)**1.3):K(.55,.1,(-7-e)/8)},upper(e){return e>6?1.6*Math.max(0,1-((e-6)/7)**2)**.55:e>-1?1.6:K(1.6,.12,((-1-e)/14)**1.15)},top(e){if(e>6)return 4-.7*((e-6)/7)**2;if(e>-4)return 4;const t=(-4-e)/11;return 4-.45*Math.sin(Math.PI*t)+.3*t}},dt=2.15;function mt(e,t){const o=xe.keel(e,t),n=xe.beam(e),g=xe.upper(e),k=xe.top(e),c=e<-7?(-7-e)/8:0,r=e>6?((e-6)/7)**2:0,l=o+Math.min((.5+.55*r)*(1-c)+.15*c,(k-o)*.45),u=Math.min(1.05,(k-l)*.45),s=k-u,y=[],v=[];for(let d=0;d<=4;d++){const S=d/4;y.push([n*S,K(o,l,S)+.05*Math.sin(Math.PI*S)*(1-c),e])}for(let d=0;d<=6;d++){const S=d/6;v.push([K(n,g,ie(0,.45,S)),K(l,s,S),e])}for(let d=1;d<=7;d++){const S=d/7*Math.PI*.5;v.push([g*Math.cos(S)**.75,s+u*Math.sin(S)**.85,e])}return{bottom:y,upper:v}}function He(e,t,o,n,g,k,c=1.5){const r=z().subVectors(o,t),l=r.length();r.normalize();const u=z(0,0,1).addScaledVector(r,-r.z).normalize(),s=z().crossVectors(r,u).normalize(),y=[];for(const[v,d]of[[0,c],[.08,1.1],[.2,1],[.8,1],[.92,1.1],[1,c]]){const S=z().lerpVectors(t,o,v),A=[];for(let W=0;W<=10;W++){const I=W/10*Math.PI*2,x=Math.cos(I),q=Math.sin(I),D=(x>0?.42:.58)*n*d*x,f=g*.5*d*q*(x>0?1:Math.sqrt(Math.max(0,1+x*.55)));A.push([S.x+u.x*D+s.x*f,S.y+u.y*D+s.y*f,S.z+u.z*D+s.z*f])}y.push(A)}return e.grid(y,{col:()=>k,uOf:(v,d)=>d<3?[0,.08,.2][d]*l:[.8,.92,1][d-3]*l}),l}async function vt(e,t,o){const n=new ut,g=t.body,k=t.bottom,c=t.trim,r=t.fabric,l=[];for(let f=12.98;f>12;f-=.25)l.push([f,!0]);for(let f=12;f>1.01;f-=.5)l.push([f,!0]);l.push([1,!0],[1,!1]);for(let f=.5;f>-6.99;f-=.5)l.push([f,!1]);l.push([-7,!0],[-7,!1]);for(let f=-7.5;f>-15.01;f-=.5)l.push([f,!1]);const u=l.map(([f,m])=>mt(f,m)),s=f=>{const m=ie(.34,.42,f[1]-0);let w=Ce(k,g,m);const O=ie(8.6,9.6,f[2])*ie(xe.top(f[2])-.75,xe.top(f[2])-.35,f[1]);return w=Ce(w,t.glare,O),w},y=f=>[f[2],f[1]-dt],v=f=>13-f[2];for(const f of[1,-1])n.grid(u.map(m=>m.bottom.map(w=>[w[0]*f,w[1],w[2]])),{col:()=>k,uOf:v,flip:f<0,ph:()=>[0,99]});await o.yield(),n.grid(u.map(f=>[...f.upper.map(m=>[m[0],m[1],m[2]]),...f.upper.slice(0,-1).reverse().map(m=>[-m[0],m[1],m[2]])]),{col:s,uOf:v,ph:y}),await o.yield();{const f=u[u.length-1],m=[...f.upper,...f.upper.slice(0,-1).reverse().map(w=>[-w[0],w[1],w[2]])];n.grid([m,m.map(w=>[0,w[1],w[2]-.12])],{col:()=>g})}{const f=[[9.75,-.02,1,2],[9.15,.5,1.22,2],[8.3,.66,1.3,2],[7.4,.66,1.3,2],[7.38,.66,1.3,0],[6.2,.45,1.2,0],[4.9,0,.9,0]],m=f.map(([w,O,T])=>{const _=[],N=xe.top(w)-.42;for(let h=0;h<=10;h++){const M=h/10*Math.PI;_.push([T*Math.sign(Math.cos(M))*Math.abs(Math.cos(M))**.7,N+(O+.42)*Math.sin(M)**.6,w])}return _});n.grid(m,{col:()=>g,surf:(w,O)=>f[O][3],uOf:w=>9.75-w[2]+.31,vOf:(w,O,T)=>T*.25+.25})}const d=[];{const f=[0,1,1.8,2.6,3.5,4.4,5.5,6.5,7.4,8.4,9.6,10.4,ge.ailIn,"A",12.6,14.2,15.8,17.4,ge.ailOut,"B",19,19.5,19.8,19.97,20.02],m=T=>{const _=[];let N=!1,h=0;for(const M of f)M==="A"?(N=!0,_.push([T*h,!0])):M==="B"?(N=!1,_.push([T*h,!1])):(_.push([T*M,N]),h=M);return _},w=m(1),O=m(-1);O.shift(),d.push(...O.reverse().map(([T,_])=>[T,_]),...w)}const S=z(0,-.05,-1).normalize(),A=z(0,1,-.05).normalize();await o.yield();const W=d.map(([f])=>{const m=Math.abs(f);return Je(je(f),S,A,Be(m),tt(m),.03,27)}),I=(f,m)=>d[m][1]&&f[3]>ge.ailCut;n.grid(W,{uOf:(f,m)=>d[m][0]+40,flip:!0,col:(f,m)=>{if(I(f,m))return r;const w=ie(.035,.02,f[3])*ie(2.2,2.6,Math.abs(d[m][0]));return Ce(g,t.glare,w)},surf:(f,m)=>I(f,m)?1:0,move:(f,m)=>I(f,m)?d[m][0]>0?1:2:0}),await o.yield();const x=(f,m,w)=>{const O=je(f).addScaledVector(S,w*Be(Math.abs(f))),T=je(m).addScaledVector(S,w*Be(Math.abs(m)));return{p:O.clone().lerp(T,.5),d:T.sub(O).normalize()}},q=[null,x(ge.ailIn,ge.ailOut,ge.ailCut),x(-ge.ailIn,-ge.ailOut,ge.ailCut)],D=[];for(const f of[1,-1]){const m=f*10.15,w=.13,O=je(m).addScaledVector(S,w*Be(10.15));O.y=Ze(m,w)-.012;const T=(_,N)=>{const h=[];for(let M=0;M<=16;M++){const B=M/16*Math.PI*2;h.push([O.x+Math.cos(B)*_,O.y+N-Math.sin(B)*_*.04,O.z+Math.sin(B)*_])}return h};n.grid([T(.23,.01),T(.2,-.03),T(.165,-.035)],{col:()=>t.glare,surf:()=>3,flip:!0}),n.grid([T(.165,-.035),T(.09,-.065),T(.001,-.075)],{col:()=>[1,1,1],surf:()=>4,flip:!0,uOf:_=>_[0]*.5,vOf:_=>_[2]*.5}),D.push(O.clone())}return{G:n,hinges:q,cd:S,nd:A,lamps:D}}const Qe=[3.5,7.4,-3.5,-7.4],Pe=11.9,De=.9,Ke=e=>{const t=je(e);return z(e,t.y+.06,t.z+2.32)};async function pt(e,t,o,n,g){const k=t.body,c=t.bottom,r=t.fabric,l=[[.1,.5,2],[0,.6,1],[.05,.69,1],[.16,.75,1],[.38,.8,0],[.6,.815,0],[.62,.823,3],[.67,.823,3],[.69,.82,0],[.9,.83,0],[1.2,.84,0],[1.3,.87,3],[1.31,.68,3],[2,.63,0],[3,.5,0],[4,.32,0],[4.8,.06,0]];for(const m of Qe){const w=Ke(m),O=w.z-.22,T=w.y,_=(h,M,B=0)=>{const Y=[];for(let ae=0;ae<=18;ae++){const F=ae/18*Math.PI*2;Y.push([m+Math.cos(F)*M,T-B+Math.sin(F)*M,O-h])}return Y},N=l.map(([h,M])=>_(h,M,h>1.4?(h-1.4)*-.02:0));e.grid(N,{uOf:(h,M)=>l[M][0]+.2,vOf:(h,M,B)=>B*.262,col:(h,M)=>{const B=l[M][2];return B===1?t.bronze:B===2?[.02,.02,.022]:B===3?Ce(k,[.05,.05,.05],.6):k},surf:(h,M)=>l[M][2]===2?3:0}),e.grid([_(.1,.5),_(.14,.3),_(.02,.2)],{col:(h,M,B)=>M===1?[.16,.15,.14]:B%2?[.09,.09,.09]:[.03,.03,.03],surf:()=>3}),e.grid([_(.02,.2),_(-.2,.2),_(-.36,.17),_(-.5,.1),_(-.57,.005)],{col:()=>t.spinner,uOf:(h,M)=>M*.11+.05,vOf:(h,M,B)=>B*.05});for(const[h,M]of[[-1.2,.075],[-1.9,.06],[-.45,.06]]){const B=[],Y=Math.cos(h)*Math.sign(m),ae=Math.sin(h);for(const[F,L]of[[1.12,.8],[1.4,.89],[1.8,.89]]){const ne=[];for(let Z=0;Z<=8;Z++){const se=Z/8*Math.PI*2;ne.push([m+Y*L+Math.cos(se)*M,T+ae*L+Math.sin(se)*M,O-F])}B.push(ne)}e.grid(B,{col:(F,L)=>L===2?[.03,.028,.025]:t.bronze,surf:()=>3})}await g.yield()}const u=m=>{const w=m-De,O=(3.2-w)/5.8,T=.5*Math.max(0,Math.sin(Math.PI*Math.min(1,O*1.02)**.62))**.7,N=w>=.2?-.12+.75*((w-.2)/3)**2.4:-.02+.55*((.2-w)/2.8)**1.3,h=.98-.25*(2*O-1)**2*(O>.5?1.6:1);return{bw:T,yk:N,yc:Math.min(N+.2,h-.1),top:h}},s=[];for(let m=0;m<=16;m++)s.push(3.2-.01-m/16*5.78);s.splice(9,0,.2001,.1999),s.sort((m,w)=>w-m);for(let m=0;m<s.length;m++)s[m]+=De;for(const m of[1,-1]){const w=m*Pe,O=s.map(N=>{const h=u(N),M=[];M.push([w,h.yk,N],[w+h.bw*.55,K(h.yk,h.yc,.6),N],[w+h.bw,h.yc,N],[w+h.bw,h.yc,N],[w+h.bw*1.02,K(h.yc,h.top,.4),N]);for(let B=1;B<=5;B++){const Y=B/5*Math.PI*.5;M.push([w+h.bw*Math.cos(Y)**.7,K(h.yc,h.top,.4)+(h.top-K(h.yc,h.top,.4))*Math.sin(Y)**.8,N])}return M});for(const N of[1,-1])e.grid(O.map(h=>h.map(M=>[w+(M[0]-w)*N,M[1],M[2]])),{uOf:h=>4.4-h[2],flip:N<0,col:h=>Ce(c,k,ie(.28,.36,h[1]))});const T=(N,h)=>{const M=je(N),B=qe((M.z-h)/Be(Math.abs(N)));return Ze(N,B)+.04},_=N=>z(w,u(N).top-.05,N);for(const[N,h]of[[_(1.3),z(w,T(w,.3),.3)],[_(-.9),z(w,T(w,-1.9),-1.9)]])He(e,N,h,.32,.105,k),He(e,N.clone().lerp(h,-.04),N.clone().lerp(h,.11),.52,.19,Ce(k,t.bottom,.4),.55),He(e,N.clone().lerp(h,.9),N.clone().lerp(h,1.02),.5,.18,Ce(k,t.bottom,.5),.6);He(e,_(-.75),z(w-m*2.6,T(w-m*2.6,-2.3),-2.3),.28,.095,k)}await g.yield();const y=z(0,0,-1),v=z(0,1,0),d=z(1,0,0),S=-11.2,A=n.twin?4.5:4.62,W=n.twin?5.4:5.9,I=[-1,-.985,-.95,-.86,-.6,-.3,-.06,0,.06,.3,.6,.86,.95,.985,1].map(m=>m*W),x=m=>K(3.1,1.75,m/W)*(n.twin?1:Math.sqrt(Math.max(.03,1-Math.max(0,(m-W*.86)/(W*.142))**2))),q=m=>{const w=Math.abs(m);return z(m,A+w*.02,S-w*.16-(K(3.1,1.75,w/W)-x(w))*.4)};e.grid(I.map(m=>Je(q(m),y,v,x(Math.abs(m)),.11,0,19)),{uOf:(m,w)=>I[w]+20,flip:!0,col:(m,w)=>m[3]>.58&&Math.abs(I[w])>.2?r:k,surf:(m,w)=>m[3]>.58&&Math.abs(I[w])>.2?1:0,move:(m,w)=>m[3]>.58&&Math.abs(I[w])>.2?3:0});const D=[];D[3]={p:q(0).addScaledVector(y,.58*3.1),d:d.clone()};const f=(m,w,O,T,_,N,h,M)=>{const Y=[];for(let F=0;F<=9;F++){const L=F/9,ne=L<.85?1:Math.sqrt(Math.max(.04,1-((L-.85)/.152)**2)),Z=K(_,N,L)*ne;Y.push(Je(z(m,K(w,O,L),T-h*L-(K(_,N,L)-Z)*.35),y,d,Z,.1,0,19))}const ae=(F,L)=>M>0&&F[3]>.55&&L>0;return e.grid(Y,{uOf:(F,L)=>L/9*(O-w)+3,col:(F,L)=>ae(F,L)?t.rudderStripe&&Math.floor(L/9*4.99)%2===0?t.trim:r:k,surf:(F,L)=>ae(F,L)?1:0,move:(F,L)=>ae(F,L)?M:0}),{p:z(m,(w+O)/2,T-h*.5-.55*(_+N)/2),d:z(0,O-w,-h-.55*(N-_)).normalize()}};return n.twin?(D[4]=f(W,A-1.25,A+2.35,S-W*.16+.35,2.5,1.5,.5,4),f(-W,A-1.25,A+2.35,S-W*.16+.35,2.5,1.5,.5,4),f(0,xe.top(-12.5)-.3,xe.top(-12.5)+.75,-10.4,3.4,2.2,.9,0)):D[4]=f(0,xe.top(-11.5)-.35,8.55,-10.1,4.3,1.9,1.5,4),He(e,z(0,5.1,4.4),z(0,6.4,4.3),.2,.07,k,1),{hinges:D}}function wt(){const e=[],t=[],o=[],n=[];let g=0;Qe.forEach((c,r)=>{const l=Ke(c);for(let u=0;u<3;u++){const v=g;for(let d=0;d<=7;d++){const S=.16+d/7*1.54,A=d/7,W=.06+.16*Math.sin(Math.PI*Math.min(1,A*1.15)**.7)*(A>.9?1-(A-.9)*5:1),I=K(1.05,.3,A),x=K(.07,.012,A);for(let q=0;q<6;q++){const D=q/6*Math.PI*2,f=Math.cos(D)*W,m=Math.sin(D)*x;e.push(f*Math.cos(I)-m*Math.sin(I),S,f*Math.sin(I)+m*Math.cos(I)),t.push(l.x,l.y,l.z),o.push(u*Math.PI*2/3+r*.7,A,r),g++}}for(let d=0;d<7;d++)for(let S=0;S<6;S++){const A=v+d*6+S,W=v+d*6+(S+1)%6;n.push(A,W,A+6,W,W+6,A+6)}}});const k=new i.BufferGeometry;return k.setAttribute("position",new i.Float32BufferAttribute(e,3)),k.setAttribute("aHub",new i.Float32BufferAttribute(t,3)),k.setAttribute("aPh",new i.Float32BufferAttribute(o,3)),k.setIndex(n),k.computeVertexNormals(),k}function gt(e){const t=[],o=[],n=[],g=[];let k=0;const c=(u,s,y)=>{for(let d=0;d<=10;d++)for(const S of[-1,1])t.push(u.x,u.y,u.z),o.push(s.x,s.y,s.z),n.push(d/10,S,y);for(let d=0;d<10;d++){const S=k+d*2;g.push(S,S+1,S+2,S+1,S+3,S+2)}k+=22};let r=1;for(const u of[1,-1]){const s=u*Pe,y=(v,d)=>Ze(v,qe((je(v).z-d)/Be(Math.abs(v))));c(z(s,.95,1.2),z(s,y(s,-1.8),-1.8),r++),c(z(s,.9,-.8),z(s,y(s,.2),.2),r++),c(z(s-u*.25,.9,3.2),z(s+u*.9,y(s+u*.9,1.5),1.5),r++),c(z(s+u*.25,.9,3.2),z(s-u*.45,y(s-u*.45,1.5),1.5),r++),c(z(s,.85,-1.2),z(s+u*1,y(s+u,-2.6),-2.6),r++)}c(z(0,6.35,4.4),e.twin?z(0,4.9,-11.4):z(0,7.3,-11.75),r++);const l=new i.BufferGeometry;return l.setAttribute("position",new i.Float32BufferAttribute(t,3)),l.setAttribute("aB",new i.Float32BufferAttribute(o,3)),l.setAttribute("aT",new i.Float32BufferAttribute(n,3)),l.setIndex(g),l}const bt=`
attribute vec3 aHub; varying vec2 vUv; varying float vSeed;
#include <fog_pars_vertex>
void main(){ vUv = uv; vSeed = aHub.x;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,yt=`
uniform float uSpin, uGhost, uDim; uniform vec3 uSunCol, uTipCol;
varying vec2 vUv; varying float vSeed;
#include <fog_pars_fragment>
void main(){
  float r = length(vUv);
  if (r > 1. || uSpin < 0.004) discard;
  float ang = atan(vUv.y, abs(vUv.x) + abs(vUv.y) < 1e-5 ? 1e-5 : vUv.x);
  float plan = smoothstep(0.1, 0.22, r) * (1. - smoothstep(0.93, 1., r));
  float dens = clamp(0.05 / (r + 0.1), 0.06, 0.4) * plan;
  float lobe = 0.5 + 0.5 * cos(3. * (ang - uGhost - vSeed * 0.9));
  float ghost = lobe * lobe * plan;
  float lobe2 = 0.5 + 0.5 * cos(3. * (ang + uGhost * 0.37 + vSeed));
  float sheen = (pow(abs(cos(ang - 0.9)), 14.) + 0.6 * pow(abs(cos(ang + 0.5 + 0.2 * sin(uGhost * 0.7))), 30.)) * plan * (0.4 + 0.6 * r);
  float tip = smoothstep(0.9, 0.935, r) * (1. - smoothstep(0.955, 0.985, r));
  vec3 col = vec3(0.05, 0.055, 0.06) + uSunCol * (sheen * 0.42 + 0.03 * lobe2) + uTipCol * tip * 0.35 * (0.3 + 0.7 * ghost);
  float a = 0.12 * plan + dens * 0.5 + ghost * 0.24 + lobe2 * lobe2 * 0.06 * plan + sheen * 0.2;
  a = max(a, tip * (0.1 + 0.16 * ghost));
  gl_FragColor = vec4(col, a * uSpin * uDim);
  #include <fog_fragment>
}`,xt=`
attribute vec3 aHub; attribute vec3 aPh; uniform float uAng; varying vec3 vN; varying vec3 vW; varying float vF;
#include <fog_pars_vertex>
void main(){
  float a = uAng * (1. + 0.07 * aPh.z) + aPh.x; float c = cos(a), s = sin(a);
  vec3 p = vec3(position.x * c - position.y * s, position.x * s + position.y * c, position.z) + aHub;
  vec3 n = vec3(normal.x * c - normal.y * s, normal.x * s + normal.y * c, normal.z);
  vF = aPh.y; vN = mat3(modelMatrix) * n; vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz;
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,kt=`
uniform float uAlpha; uniform vec3 uSunDir, uSunCol, uSkyCol, uShadeCol, uTipCol;
varying vec3 vN; varying vec3 vW; varying float vF;
#include <fog_pars_fragment>
void main(){
  if (uAlpha < 0.01) discard;
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  vec3 L = normalize(uSunDir), V = normalize(cameraPosition - vW);
  vec3 base = mix(vec3(0.05, 0.055, 0.06), uTipCol * 0.8, smoothstep(0.9, 0.92, vF));
  vec3 col = base * (uSunCol * smoothstep(-0.1, 0.6, dot(N, L)) + uSkyCol * 0.5 + uShadeCol * 0.5);
  col += uSunCol * pow(max(dot(reflect(-V, N), L), 0.), 40.) * 0.6;
  gl_FragColor = vec4(col, uAlpha);
  #include <fog_fragment>
}`,Mt=`
attribute vec3 aB; attribute vec3 aT; uniform float uTime, uPx, uThrum; varying float vA; varying float vS;
#include <fog_pars_vertex>
void main(){
  vec4 m0 = modelViewMatrix * vec4(position, 1.), m1 = modelViewMatrix * vec4(aB, 1.);
  vec4 mvPosition = mix(m0, m1, aT.x);
  vec3 d = m1.xyz - m0.xyz; vec3 n = cross(d, mvPosition.xyz); float nl = length(n); n = nl > 1e-6 ? n / nl : vec3(1., 0., 0.);
  float len = length(d);
  mvPosition.xyz += n * sin(3.14159 * aT.x) * sin(uTime * (31. + 60. / max(len, 1.)) + aT.z * 5.) * 0.0035 * uThrum * min(len, 6.);
  float w = 0.013, px = uPx * max(0.05, -mvPosition.z), ww = max(w, px);
  mvPosition.xyz += n * aT.y * ww * 0.5;
  vA = clamp(w / ww, 0.22, 1.); vS = aT.y;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,St=`
uniform vec3 uSunCol, uSkyCol; varying float vA; varying float vS;
#include <fog_pars_fragment>
void main(){
  float e = 1. - vS * vS;
  vec3 col = vec3(0.05, 0.055, 0.06) + (uSkyCol * 0.35 + uSunCol * 0.3) * smoothstep(0.3, 1., e) * 0.6;
  gl_FragColor = vec4(col, vA * smoothstep(0., 0.35, e + 0.2));
  #include <fog_fragment>
}`,Ct=`
attribute vec2 aAB; attribute vec3 aV; attribute vec4 aK;
uniform float uTime, uAmpH, uAmpF, uSkip;
varying vec2 vAB; varying vec4 vK; varying vec3 vW; varying float vTau; varying float vAmp; varying float vH;
void main(){
  float amp = aK.x < 0.5 ? uAmpH : uAmpF;
  float tau = aAB.y * aK.w, a = aAB.x;
  // the throw is uneven along the chine: tongues from 3 to 9 m that wander aft, so the crest is lobed, never a level line
  float lobe = 0.76 + 0.3 * sin(a * 13. + uTime * 1.7 + aK.z * 2.) * sin(a * 5.3 - uTime * 0.9 + aK.z) + 0.13 * sin(a * 31. - uTime * 4.3 + aK.z * 2.);
  float h = clamp(amp, 0., 1.4) * lobe;
  float lay = 1. + 0.14 * aK.y;
  vec3 p = position;
  p.x += aV.x * (1. - exp(-tau / 0.45)) * (0.5 + 0.5 * h) * lay;
  float yy = (aV.y * tau - 4.9 * tau * tau) * h * (1. - 0.1 * aK.y);
  p.y += max(-0.05, yy);
  p.z -= aV.z * tau * (1. + 0.3 * aK.y);
  // the sheet billows in depth as it rises: a veil, not a pane
  p.x += (sin(tau * 5. + uTime * 2.3 + a * 7.) * 0.3 + sin(a * 19. + uTime * 1.3 + aK.z * 4.) * 0.34) * tau;
  vAB = aAB; vK = aK; vTau = tau; vAmp = amp; vH = yy / (aK.x < 0.5 ? 8. : 2.4);
  vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,At=`
uniform float uTime, uGain; uniform vec3 uSunDir, uSprayCol, uShadeCol;
varying vec2 vAB; varying vec4 vK; varying vec3 vW; varying float vTau; varying float vAmp; varying float vH;
${We}
void main(){
  if (vAmp < 0.01) discard;
  float a = vAB.x, b = vAB.y, hull = 1. - step(0.5, vK.x);
  float len = mix(3., 9., hull);
  vec2 q = vec2(a * len + vK.z * 3.7 + vK.y * 1.9, vTau * 5. - uTime * (4.2 + vK.y));
  vec2 qd = q * vec2(9., 1.5), qd2 = q * vec2(23., 3.7) + 17.;
  float bfade = 1. - smoothstep(0.3, 0.9, max(fwidth(qd.x), fwidth(qd.y)));
  float cfade = 1. - smoothstep(0.3, 0.9, max(fwidth(qd2.x), fwidth(qd2.y)));
  float warp = fbm3(q * vec2(0.5, 0.22) + 5.);
  q.x += (warp - 0.5) * 1.5;                                               // the drawn-out fingers wander: no ruled streaks
  float fing = vnoise(vec2(q.x * 2.6, q.y * 0.5)) * 0.6 + vnoise(vec2(q.x * 6.5 + 3., q.y * 0.9)) * 0.4;
  float tear = fbm3(q * vec2(0.55, 0.3) + 2.);
  float fil = smoothstep(0.5, 0.92, vnoise(vec2(q.x * 11., q.y * 0.9)));
  float big = fbm3(vec2(a * len * 0.45 + vK.z * 5., b * 2.6 - uTime * 0.35));           // slow holes torn through the whole sheet
  float hgt = clamp(vH, 0., 1.);
  // both ends dissolve behind a ragged, moving noise front over a third of the length: there is no end line
  float endN = fbm3(vec2(b * 3.2 - uTime * 0.5, a * 13. + vK.z * 3.));
  float ends = smoothstep(0.02, 0.4, a - 0.32 * endN + 0.06) * (1. - smoothstep(0.68, 1., a + 0.28 * endN - 0.04));
  float thick = 1. - smoothstep(0.08, 0.6, hgt);                           // dense at the chine, mist toward the crest
  float th = mix(0.4, 0.74, hgt) + 0.08 * vK.y + 0.34 * (1. - ends) + 0.15 * (1. - hull);
  float veil = smoothstep(th, th + 0.13, fing * 0.4 + tear * 0.5 + big * 0.42);
  // open holes a metre or two across torn right through the sheet at every height (hull, chine and portholes show through them)
  float hole = fbm3(vec2(a * len * 1.1 + vK.z * 9. + vK.y * 2.3, b * 4.2 - uTime * 0.55) + 13.);
  veil *= smoothstep(0.36, 0.5, hole + 0.1 * (fing - 0.5));
  veil *= mix(1., fil * 0.85, smoothstep(0.3, 0.62, hgt));                 // above mid-height only filaments are left
  float tongue = smoothstep(0.34, 0.6, vnoise(vec2(a * len * 1.9 + vK.z * 7., uTime * 0.45 + vK.y)));
  veil *= mix(1., tongue, smoothstep(0.5, 0.82, hgt));                     // the crest breaks into separate tongues
  veil *= 1. - 0.75 * smoothstep(0.52, 0.85, b);                           // what falls back is beads and mist
  float edge = ends * (1. - smoothstep(0.5, 1., b + (fing - 0.5) * 0.45)) * smoothstep(0., 0.04, b);
  veil *= edge;
  // droplets drawn out along the throw, in two sizes
  vec2 bq = qd; vec2 bi = floor(bq), bf = fract(bq); vec2 bo = h22(bi + 11.);
  float br = 0.04 + 0.13 * bo.x * bo.x;
  float bead = smoothstep(br, br * 0.3, length(bf - 0.3 - 0.4 * bo)) * step(0.42 - 0.2 * b, bo.y) * (0.35 + 0.65 * h21(bi + 3.)) * bfade;
  vec2 ci = floor(qd2), cf = fract(qd2); vec2 co = h22(ci);
  bead += (1. - smoothstep(0.03, 0.12, length(cf - 0.3 - 0.4 * co))) * step(0.4, co.y) * 0.7 * cfade;
  float beadEdge = smoothstep(0., 0.3, a - 0.2 * endN + 0.12) * (1. - smoothstep(0.8, 1., a + 0.15 * endN)) * (1. - smoothstep(0.7, 1., b)) * smoothstep(0., 0.04, b);
  bead *= beadEdge * smoothstep(0.03, 0.25, b) * (0.35 + 0.65 * tear);      // beads fly on past the veil's torn ends
  vec3 V = normalize(vW - cameraPosition);
  float fwd = max(dot(V, normalize(uSunDir)), 0.); fwd = fwd * fwd;
  float amp = clamp(vAmp, 0., 1.);
  float haze = edge * thick * 0.025 * hull;                                // the faint mist the sheet stands in, at its foot only
  float va = clamp(clamp(veil, 0., 1.) * (0.14 + 0.36 * thick) + haze, 0., 0.44) * amp * mix(0.8, 1., hull);
  vec3 deepGold = mix(uSprayCol * uSprayCol, uSprayCol, 0.3);
  // (capped below clipping: against the light the veil stays the spray's own gold and a bead is a gold spark, never white)
  vec3 vc = min(mix(deepGold * 0.6 + uShadeCol * 0.1, deepGold * 1.5 + uSprayCol * 0.9, fwd) * (0.75 + 0.5 * fil), deepGold * 0.5 + uSprayCol * 0.95);
  vec3 bc = uSprayCol * min(1.1 + 4.6 * fwd, 1.9);
  float ba = bead * amp * (0.4 + 0.6 * fwd);
  vec3 rgb = (vc * va + bc * ba) * uGain;
  gl_FragColor = vec4(rgb, clamp(va + ba * 0.5, 0., 1.));
}`;function zt(){const e=[],t=[],o=[],n=[],g=[];let k=0;const c=(u,s,y,v,d,S,A,W)=>{for(let I=0;I<=u;I++){const x=I/u,q=y(x),D=v(x);for(let f=0;f<=s;f++)e.push(q[0],q[1],q[2]),t.push(x,f/s),o.push(D[0],D[1],D[2]),n.push(d,S,A,W)}for(let I=0;I<u;I++)for(let x=0;x<s;x++){const q=k+I*(s+1)+x;g.push(q,q+s+1,q+1,q+1,q+s+1,q+s+2)}k+=(u+1)*(s+1)};let r=1;for(const u of[1,-1])for(const s of[0,1])u>0?c(44,14,y=>{const v=K(9.6,.4,y);return[u*(xe.beam(v)*.98+.4*Math.sin(Math.PI*y)),.04,v]},y=>[u*5.8*(.45+.55*Math.sin(Math.PI*y**.8)),9.3*(.5+.5*Math.sin(Math.PI*y**.7)),3+4*y],0,s,r++,2):c(56,22,y=>{const v=K(10.6,.2,y);return[u*(xe.beam(v)*.98+.5*Math.sin(Math.PI*y)),.04,v]},y=>[u*(3.3+.8*s)*(.5+.5*Math.sin(Math.PI*y**.8)),12.6*(.25+.75*Math.sin(Math.PI*y**.7)),.9+1.7*y],0,s,r++,2.3);for(const u of[Pe,-Pe])for(const s of[1,-1])c(18,12,y=>[u+s*.36,.03,K(2.9,.7,y)+De],y=>[s*(.5+1.5*y),6.9*(.35+.65*Math.sin(Math.PI*y**.7)),.8+2.6*y],1,s>0?0:1,r++,1.35);const l=new i.BufferGeometry;return l.setAttribute("position",new i.Float32BufferAttribute(e,3)),l.setAttribute("aAB",new i.Float32BufferAttribute(t,2)),l.setAttribute("aV",new i.Float32BufferAttribute(o,3)),l.setAttribute("aK",new i.Float32BufferAttribute(n,4)),l.setIndex(g),l}const Tt=`
attribute vec3 aVel; attribute vec4 aS;
uniform float uTime, uAmpH, uAmpF, uPxScale, uMaxPx;
varying float vA; varying vec3 vW; varying float vMist;
void main(){
  float mist = step(1.5, aS.w);
  float amp = (aS.w < 0.5 || (aS.w > 1.5 && aS.w < 2.5)) ? uAmpH : uAmpF;
  float ph = fract(aS.x + uTime / aS.y); float tau = ph * aS.y;
  vec3 p = position + aVel * tau * vec3(1., clamp(amp, 0.3, 1.2), 1.); p.y -= mix(4.9, 1.2, mist) * tau * tau;
  p.y = mix(p.y, max(p.y, 0.15), mist);
  vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz;
  vec4 mv = viewMatrix * w;
  float size = aS.z * mix(1., 0.55 + 0.9 * ph, mist) * uPxScale / max(0.6, -mv.z);
  vA = smoothstep(0., 0.08, ph) * (1. - smoothstep(mix(0.7, 0.35, mist), 1., ph)) * clamp(amp, 0., 1.) * clamp(size / 1.6, 0.25, 1.) * step(-0.05, p.y);
  vA *= mix(1., smoothstep(0.7, 2.2, -mv.z), mist);
  vMist = mist;
  gl_PointSize = clamp(size, 1.6, mix(42., uMaxPx, mist));
  gl_Position = projectionMatrix * mv;
  if (amp < 0.01) gl_Position = vec4(2., 2., 2., 1.);
}`,Ft=`
uniform vec3 uSunDir, uSprayCol; varying float vA; varying vec3 vW; varying float vMist;
void main(){
  vec2 c = gl_PointCoord - 0.5; float r = length(c) * 2.;
  vec3 V = normalize(vW - cameraPosition);
  float fwd = max(dot(V, normalize(uSunDir)), 0.); float f2 = fwd * fwd;
  if (vMist > 0.5) {
    float soft = exp(-r * r * 3.2) * (1. - smoothstep(0.7, 1., r));
    float a = soft * vA * 0.1;
    gl_FragColor = vec4(mix(uSprayCol * uSprayCol, uSprayCol, 0.4) * min(0.45 + 1.5 * f2, 1.45) * a, a * 0.75);
  } else {
    float soft = (1. - smoothstep(0.25, 1., r));
    float a = soft * vA;
    gl_FragColor = vec4(uSprayCol * min(0.6 + 2.6 * f2 * fwd, 1.9) * a * (0.5 + 0.5 * (1. - smoothstep(0., 0.6, r))), a * 0.6);
  }
}`;function qt(e,t){const o=[],n=[],g=[];for(let r=0;r<t;r++)if((r%4===0?1:0)===0){const u=r%8<5?-1:1,s=e.range(.5,9.5);o.push(u*xe.beam(s),.1,s),n.push(u*e.range(2.5,8),e.range(4,9.5),-e.range(2,9)),g.push(e(),e.range(.9,1.7),e.range(.025,.075),0)}else{const u=e.chance(.5);o.push(-Pe+e.range(-.4,.5),.15,e.range(.5,3)+De),n.push(u?e.range(.2,1.6):e.range(-2,2),e.range(4.5,8.5),-e.range(2.5,8)),g.push(e(),e.range(.7,1.3),e.range(.025,.07),1)}const k=Math.round(t*.42);for(let r=0;r<k;r++)if(r%6===5){const l=r%12===5?-Pe:Pe;o.push(l+e.range(-.5,.5),.2,e.range(.4,3.2)+De),n.push(e.range(-.9,.9),e.range(1.2,3.4),-e.range(1.5,4.5)),g.push(e(),e.range(.7,1.2),e.range(.45,.9),3)}else{const l=r%3===0?1:-1,u=e(),s=u<.3?e.range(8.6,11.4):u<.5?e.range(-.6,1.6):e.range(.5,10);o.push(l*(xe.beam(Math.min(s,12.5))+e.range(0,.9)),.2,s),n.push(l*e.range(.8,3.2),e.range(1.5,5.5),-e.range(.6,3)),g.push(e(),e.range(.9,1.7),e.range(.8,1.9),2)}const c=new i.BufferGeometry;return c.setAttribute("position",new i.Float32BufferAttribute(o,3)),c.setAttribute("aVel",new i.Float32BufferAttribute(n,3)),c.setAttribute("aS",new i.Float32BufferAttribute(g,4)),c}const Bt=`
varying vec3 vL;
#include <fog_pars_vertex>
void main(){ vL = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,jt=`
uniform float uTime, uWake, uGround, uFlow, uBow, uFleck; uniform vec3 uFoamCol, uDeepCol;
varying vec3 vL;
#include <fog_pars_fragment>
${We}
void main(){
  float x = vL.x, z = vL.z, ax = abs(x);
  vec2 fl = vec2(x, z + uFlow);
  float n = fbm3(fl * 0.55) * 0.65 + vnoise(fl * 2.3 + 3.) * 0.35;
  float n2 = fbm3(fl * vec2(1.6, 0.5) + 9.);
  float aft = max(0., 8.5 - z);
  // V arms leaving the chine, thickening and breaking into lace as they go aft
  float arm = ax - (1.5 + 0.30 * aft + 0.5 * sin(aft * 0.35 + uTime) * smoothstep(5., 30., aft));
  float armW = 0.5 + 0.11 * aft;
  float armM = (1. - smoothstep(0., armW, abs(arm))) * smoothstep(0., 1.5, aft) * (1. - smoothstep(40., 78., aft));
  // churned water inside the V behind the step
  float inner = (1. - smoothstep(-armW, 0.3, arm)) * smoothstep(6., 10., aft) * (1. - smoothstep(18., 70., aft));
  // bow wave hugging the forebody
  float hq = max(0., (z - 6.) / 7.);
  float hw = 1.75 * pow(max(1e-4, 1. - hq * hq), 0.55);
  float bow = (1. - smoothstep(0.1, 1.0 + 1.3 * uBow, ax - hw)) * step(-1., z) * (1. - smoothstep(7.5, 10.5, z)) * step(hw - 0.25, ax);
  // float trails
  float fa = max(0., 3.5 - z);
  float ft = (1. - smoothstep(0.25, 0.7 + 0.07 * fa, abs(ax - 11.9))) * smoothstep(3., 8.5, fa) * (1. - smoothstep(14., 46., fa));
  float fw = clamp(fwidth(z) * 1.2, 0., 1.);
  n = mix(n, 0.52, fw); n2 = mix(n2, 0.5, fw);
  float lace = smoothstep(0.42, 0.68, n);
  float foam = armM * (0.45 + 0.55 * lace) + inner * smoothstep(0.38, 0.75, n2 * 0.6 + n * 0.5) * 0.85 + bow * (0.3 + 0.7 * lace) + ft * (0.4 + 0.6 * lace);
  foam = clamp(foam, 0., 1.) * uWake;
  foam *= mix(1., smoothstep(0.6, 0.72, vnoise(fl * vec2(3.1, 2.2) + 1.) * 0.7 + vnoise(fl * vec2(9., 6.) + 4.) * 0.3) * 1.5, uFleck);     // glowing plankton (night): sparse sparkling flecks, no smooth sheet
  float sA = x / 2.6, sB = (z + 1.) / 11., sC = (ax - 11.9) / 0.9, sD = (z - 1.2) / 3.2, sE = x / 17., sF = (z - 0.6) / 3.4;
  sE *= sE;
  float shadow = exp(-sA * sA - sB * sB) * 0.62 + exp(-sC * sC - sD * sD) * 0.5 + exp(-sE * sE - sF * sF) * 0.3;
  shadow *= uGround;
  float edge = (1. - smoothstep(15., 22., ax)) * smoothstep(-78., -60., z);
  vec3 col = mix(uDeepCol * 0.35, uFoamCol * (0.75 + 0.35 * n), foam);
  float a = max(shadow * (1. - foam), foam) * edge;
  if (a < 0.003) discard;
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`,Ue=z(-10.9,3,-1.1),Pt=["silver","white","cream"];async function Et(e,t={}){const o=e.rng,n=e.quality&&e.quality.detail||1,g=(t.palette&&t.palette.length>=7?t.palette:et).map(Ae),k=t.livery||o.pick(Pt),c={twin:t.twinFin!==void 0?!!t.twinFin:o.chance(.4)},r=o.int(0,2),l=o.int(0,1),u=o.chance(.5),s=o.range(0,6.28),y=o.fork("drops"),v=g[5],d=g[1],S=[d,Ce(v,[.03,.09,.2],.5),Ce(v,d,.4)][r],A={glare:Ce(v,[0,0,0],.45),bronze:Ae("#4a382a"),bottom:Ce(v,[0,0,0],.35),trim:S};let W=1,I=0;k==="white"?(A.body=Ae("#d6d4ca"),A.fabric=Ae("#cbc9bd"),W=.08,I=1,A.rudderStripe=!0):k==="cream"?(A.body=Ae("#d3c398"),A.fabric=Ae("#c9bb92"),W=.05,I=1,A.rudderStripe=!1):(A.body=Ae("#b3b6b3"),A.fabric=Ae("#bdbbb0"),W=1,I=r===0?0:1,A.rudderStripe=r===2),A.spinner=u?A.body:S;const x=new i.Color().setRGB(...l?g[4]:Ae("#e8c24a")),q=new i.Group;q.name="flying-boat";const D=t.scale||1;q.scale.setScalar(D);const f=t.uniforms||st(g);t.sprayColor&&f.uSprayCol.value.set(t.sprayColor);const m=()=>i.UniformsUtils.clone(i.UniformsLib.fog),w=(b,j)=>{const E={...m(),...j};for(const Q of b)E[Q]=f[Q];return E},O=await vt(o,A,e);await e.yield();const T=await pt(O.G,A,o,c,e);await e.yield();const _=[null,O.hinges[1],O.hinges[2],T.hinges[3],T.hinges[4],T.hinges[4]],N=await O.G.build(e);await e.yield();const h=new i.ShaderMaterial({vertexShader:ft,fragmentShader:ht,vertexColors:!0,fog:!0,side:i.DoubleSide,uniforms:w(["uSunDir","uSunCol","uSkyCol","uHorizonCol","uShadeCol","uWaterCol","uTime"],{uHP:{value:_.map(b=>b?b.p.clone():z())},uHD:{value:_.map(b=>b?b.d.clone():z(1,0,0))},uHA:{value:[0,0,0,0,0,0]},uWet:{value:1},uMetal:{value:W},uCabin:{value:t.cabin||0},uAmbK:{value:1},uLamp:{value:t.lamp!==void 0?t.lamp:2.4},uLampCol:{value:new i.Color("#ffe2b0")},uRunway:{value:0},uPh:{value:new i.Vector2(-7.6,8.4)},uStripe:{value:new i.Color().setRGB(...S)},uStripeOn:{value:I}})}),M=new i.Mesh(N,h);M.frustumCulled=!1,q.add(M);const B=new i.BufferGeometry;{const b=[],j=[],E=[],Q=[];Qe.forEach(($,re)=>{const fe=Ke($),a=1.72;for(const[p,G]of[[-1,-1],[1,-1],[1,1],[-1,1]])b.push(fe.x+p*a,fe.y+G*a,fe.z),j.push(p,G),E.push(re*1.7+.3,0,0);Q.push(re*4,re*4+1,re*4+2,re*4,re*4+2,re*4+3)}),B.setAttribute("position",new i.Float32BufferAttribute(b,3)),B.setAttribute("uv",new i.Float32BufferAttribute(j,2)),B.setAttribute("aHub",new i.Float32BufferAttribute(E,3)),B.setIndex(Q)}const Y=new i.ShaderMaterial({vertexShader:bt,fragmentShader:yt,fog:!0,transparent:!0,depthWrite:!1,side:i.DoubleSide,uniforms:w(["uSunCol"],{uSpin:{value:1},uGhost:{value:s},uDim:{value:1},uTipCol:{value:x}})}),ae=new i.Mesh(B,Y);ae.frustumCulled=!1,ae.renderOrder=3,q.add(ae);const F=new i.ShaderMaterial({vertexShader:xt,fragmentShader:kt,fog:!0,transparent:!0,depthWrite:!1,side:i.DoubleSide,uniforms:w(["uSunDir","uSunCol","uSkyCol","uShadeCol"],{uAng:{value:0},uAlpha:{value:0},uTipCol:{value:x}})}),L=new i.Mesh(wt(),F);L.frustumCulled=!1,L.renderOrder=2,q.add(L);const ne=new i.ShaderMaterial({vertexShader:Mt,fragmentShader:St,fog:!0,transparent:!0,depthWrite:!1,side:i.DoubleSide,uniforms:w(["uSunCol","uSkyCol","uTime"],{uPx:{value:.002},uThrum:{value:1}})});await e.yield();const Z=new i.Mesh(gt(c),ne);Z.frustumCulled=!1,Z.renderOrder=2,q.add(Z),await e.yield();const se=new i.PlaneGeometry(44,92,1,1);se.rotateX(-Math.PI/2),se.translate(0,.03,-32);const de=new i.ShaderMaterial({vertexShader:Bt,fragmentShader:jt,fog:!0,transparent:!0,depthWrite:!1,uniforms:w(["uTime"],{uWake:{value:0},uGround:{value:0},uFlow:{value:0},uBow:{value:0},uFleck:{value:0},uFoamCol:{value:new i.Color("#e9dcc0")},uDeepCol:{value:new i.Color().setRGB(...g[1])}})}),he=new i.Mesh(se,de);he.frustumCulled=!1,he.renderOrder=1,q.add(he);const me={uAmpH:{value:0},uAmpF:{value:0}},be=new i.ShaderMaterial({vertexShader:Ct,fragmentShader:At,transparent:!0,depthWrite:!1,side:i.DoubleSide,premultipliedAlpha:!0,uniforms:{uTime:f.uTime,uSunDir:f.uSunDir,uSprayCol:f.uSprayCol,uShadeCol:f.uShadeCol,uSkip:{value:0},uGain:{value:t.sprayGain||1},...me}}),ue=new i.Mesh(zt(),be);ue.frustumCulled=!1,ue.renderOrder=2.5,q.add(ue);const pe=new i.ShaderMaterial({vertexShader:Tt,fragmentShader:Ft,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,uniforms:{uTime:f.uTime,uSunDir:f.uSunDir,uSprayCol:f.uSprayCol,uPxScale:{value:400},uMaxPx:{value:120},...me}});await e.yield();const ye=new i.Points(qt(y,Math.round(860*n)),pe);ye.frustumCulled=!1,ye.renderOrder=5,q.add(ye),await e.yield();const ee={spray:0,feather:0,wake:0,ground:0,rpm:1,wet:1,bow:0,flow:26,aileron:0,elevator:0,rudder:0};let P=!1,H=0,X=0,R=s;const U={object:q,radius:22*D,height:9*D,center:z(0,3.6*D,0),ground:!0,groundY:0,livery:k,twinFin:c.twin,state:ee,uniforms:f,parts:{skin:M,disc:ae},anchors:{seat:{position:Ue.clone().multiplyScalar(D),look:z(Math.sin(.14),0,Math.cos(.14))},propHub:Ke(-7.4).multiplyScalar(D),floatNose:z(-Pe,.6,3.2+De).multiplyScalar(D),bow:z(0,2.7,13).multiplyScalar(D),sprayCentre:z(-6.5,2.6,4).multiplyScalar(D),wakeOrigin:z(0,0,1).multiplyScalar(D),tail:z(0,4.2,-15).multiplyScalar(D),lamp:O.lamps[1].clone().multiplyScalar(D),departLine:[Ue.clone(),z(-11.3,2.9,4),z(-12.2,2.8,14),z(-12.5,3.2,30)].map(b=>b.multiplyScalar(D)),flyThrough:[z(-30,6,-40),z(-28,5,-12),z(-27,4.5,18),z(-25,5.5,60)].map(b=>b.multiplyScalar(D)),viewpoints:[z(-34,5,30),z(-9,2.6,34),z(26,9,-26)].map(b=>b.multiplyScalar(D))},setProgress(b){const j=ie(0,.28,b)*(1-ie(.45,.85,b)),E=ie(1.05,1.7,b)*(1-.9*ie(5.6,10.5,b));ee.spray=Math.max(j*.85,E*1.08),ee.feather=ie(1.3,2.2,b)*(1-.92*ie(5.8,10,b)),ee.wake=ie(0,.5,b)*(1-.45*ie(8,14,b)),ee.ground=ie(-2.2,.1,b),ee.bow=ie(5.5,10.5,b),ee.rpm=1-.9*ie(6,10.5,b),ee.flow=K(30,12,ie(0,11,b))},heave(b){return b<0?0:.42*Math.sin(Math.PI*qe((b-.4)/.72))-.38*ie(5.8,11,b)},pitch(b){return b<0?.075*ie(-3,0,b):K(.075,.03,ie(0,2.5,b))*(1-ie(5.8,11,b))},set(b){Object.assign(ee,b)},setLight(b={}){P=!0,b.sunDir&&f.uSunDir.value.copy(b.sunDir).normalize(),b.sunColor&&f.uSunCol.value.copy(b.sunColor),b.sky&&f.uSkyCol.value.copy(b.sky),b.horizon&&f.uHorizonCol.value.copy(b.horizon),b.shade&&f.uShadeCol.value.copy(b.shade),b.water&&f.uWaterCol.value.copy(b.water),b.spray&&f.uSprayCol.value.copy(b.spray),b.cabin!==void 0&&(h.uniforms.uCabin.value=b.cabin),b.lamp!==void 0&&(h.uniforms.uLamp.value=b.lamp),b.ambient!==void 0&&(h.uniforms.uAmbK.value=b.ambient),b.foam&&de.uniforms.uFoamCol.value.copy(b.foam),b.fleck!==void 0&&(de.uniforms.uFleck.value=b.fleck)},seatPose(b,j,E=0,Q=0,$=null){const re=Math.atan2(j.x,j.z);ot.set(-Q,re,E,"YXZ"),q.quaternion.setFromEuler(ot),Ie.copy(Ue).multiplyScalar(D),$&&Ie.sub(at.copy($).multiplyScalar(D)),q.position.copy(b).sub(Ie.applyQuaternion(q.quaternion))},seatAt(b,j,E=null){q.quaternion.copy(j),Ie.copy(Ue).multiplyScalar(D),E&&Ie.sub(at.copy(E).multiplyScalar(D)),q.position.copy(b).sub(Ie.applyQuaternion(q.quaternion))},update(b,j,E){const Q=j;if(f.uTime.value=Q,!P&&q.parent){let a=q.parent;for(;a.parent;)a=a.parent;for(const p of a.children)p.isDirectionalLight?(f.uSunDir.value.copy(p.position).sub(p.target.position).normalize(),f.uSunCol.value.copy(p.color).multiplyScalar(p.intensity*.85)):p.isHemisphereLight&&f.uSkyCol.value.copy(p.color).multiplyScalar(.6*p.intensity+.2)}const $=h.uniforms;$.uWet.value=ee.wet,$.uRunway.value=qe(ee.flow/30);const re=Math.sin(Q*.9)*.02+Math.sin(Q*2.3+1)*.012;$.uHA.value[1]=ee.aileron+re,$.uHA.value[2]=ee.aileron-re*.8,$.uHA.value[3]=ee.elevator+Math.sin(Q*1.3)*.02,$.uHA.value[4]=ee.rudder+Math.sin(Q*.7+2)*.03,$.uHA.value[5]=$.uHA.value[4],H+=b*(2+ee.rpm*40)*(ee.rpm>.001?1:0),R+=b*(.6+1.6*ee.rpm),Y.uniforms.uSpin.value=ie(.16,.5,ee.rpm),Y.uniforms.uGhost.value=R,F.uniforms.uAng.value=H,F.uniforms.uAlpha.value=1-ie(.18,.45,ee.rpm),X+=b*ee.flow;const fe=de.uniforms;if(fe.uWake.value=ee.wake,fe.uGround.value=ee.ground,fe.uFlow.value=X%400,fe.uBow.value=ee.bow,me.uAmpH.value=ee.spray,me.uAmpF.value=ee.feather,E&&e.renderer){e.renderer.getDrawingBufferSize(nt);const a=E.projectionMatrix.elements[5]||1.5,p=Math.max(64,nt.y);ne.uniforms.uPx.value=1.6*2/(a*p),pe.uniforms.uPxScale.value=p*a*.5*D,pe.uniforms.uMaxPx.value=Math.min(256,p*.3)}},dispose(){}};return U.setProgress(t.progress!==void 0?t.progress:3.5),U}const ot=new i.Euler,Ie=z(),at=z(),nt=new i.Vector2,Rt=`
attribute vec4 aCave; attribute vec4 aRock;      // aRock = (metres below the ledge above, occlusion, outer-shell flag, cave weight)
varying vec3 vN; varying vec3 vW; varying vec3 vL; varying vec2 vUv; varying vec4 vCave; varying vec4 vRock;
#include <fog_pars_vertex>
void main(){
  vL = position; vUv = uv; vCave = aCave; vRock = aRock;
  vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = mat3(modelMatrix) * normal;
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Nt=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uShadeCol, uWaterCol, uRockCol, uRustCol, uLeafCol, uHorizonCol;
uniform float uTime, uWetRock, uBumpK; uniform vec4 uHole;
varying vec3 vN; varying vec3 vW; varying vec3 vL; varying vec2 vUv; varying vec4 vCave; varying vec4 vRock;
#include <fog_pars_fragment>
${We}
// one water stain hanging from a ledge. u metres round the tower, d metres below the ledge it hangs from (nothing above it),
// row an id for that ledge; cw the spacing of possible runs, thr the share of them left out, a length range, the widest width.
// Each run has its own place, width and length, wanders a little, tapers, and dies out: a distinct mark, never a curtain.
float gNear;                                   // 1 within about 100 m of the eye, 0 beyond 180 m (set in main)
float gFu;                                     // metres of wall one pixel covers along u (set in main)
float run(float u, float d, float row, float cw, float thr, float lmin, float lmax, float wmax){
  float q = u / cw + h11(row * 1.37 + cw) * 9.;
  float ci = floor(q), cf = fract(q);
  vec2 hh = h22(vec2(ci, row * 3.1 + cw));
  float k = fract(hh.x * 57.3 + hh.y * 13.1);
  float len = mix(lmin, lmax, hh.y);
  float w0 = mix(0.3, 1., k) * wmax * (1. - 0.6 * smoothstep(0., len, d));
  float w = max(w0, 1.3 * gFu);                                                 // never thinner than a pixel and a third: it widens and pales instead
  float cx = (cf - (0.25 + 0.5 * k)) * cw + (vnoise(vec2(ci * 7.7 + row, d * 0.22)) - 0.5) * 0.9;
  float body = (1. - smoothstep(w * mix(0.3, 0.72, gNear), w, abs(cx))) * (w0 / w);          // close to, a run has an edge: a distinct mark, not an airbrushed band
  return smoothstep(thr + 0.05 * gNear - 0.02, thr + 0.05 * gNear + 0.02, hh.x) * body * (1. - smoothstep(len * 0.4, len, d)) * smoothstep(-0.05, 0.3, d);
}
// a thread of falling water under a ledge: its own place and length like run(), one constant width w (the caller never lets
// it go under a pixel and a half: it widens it and thins its alpha instead), wandering a little
float thread(float u, float d, float row, float cw, float thr, float lmin, float lmax, float w){
  float q = u / cw + h11(row * 1.37 + cw) * 9.;
  float ci = floor(q), cf = fract(q);
  vec2 hh = h22(vec2(ci, row * 3.1 + cw));
  float len = mix(lmin, lmax, hh.y);
  float cx = (cf - (0.25 + 0.5 * fract(hh.x * 57.3 + hh.y * 13.1))) * cw + (vnoise(vec2(ci * 7.7 + row, d * 0.21)) - 0.5) * 2.2 + (vnoise(vec2(ci * 3.1 + row, d * 0.9)) - 0.5) * 0.5;
  return step(thr, hh.x) * (1. - smoothstep(w * 0.45, w, abs(cx))) * (1. - smoothstep(len * 0.6, len, d)) * smoothstep(0., 0.6, d);
}
// the height field of the rain-cut flutes: broad ribs 20 m and 6 m apart that wander and die out over 30-60 m of height
float sabs(float x){ return sqrt(x * x + 0.02); }
float flute(float u, float y){ return sabs(fbm3(vec2(u * 0.15, y * 0.034)) * 2. - 1.) + 0.4 * sabs(vnoise(vec2(u * 0.5, y * 0.085) + 7.) * 2. - 1.) + 0.15 * vnoise(vec2(u * 1.9, y * 0.3)); }
float rill(float ru, float y){ return sabs(vnoise(vec2(ru, y * 0.05 + 3.)) * 2. - 1.); }
// where bedding joint k lies (in units of the mean bed, 17 m): each joint has its own level and its own slow wander round the
// tower, so beds are 3 to 30 m thick and two joints can run together (a bed pinching out); joints never cross
float jointAt(float k, float u){ return k + 0.5 + 0.62 * (h11(k * 1.31 + 0.7) - 0.5) + 0.34 * (vnoise(vec2(u * 0.013 + k * 7.3, k * 3.1)) - 0.5); }
// jittered cells: x = distance to the nearest cell border, y = the cell's own hash, z = distance to its site (cell units),
// w = the hash of the cell across that border. No texture look-up and no derivative inside the loop.
vec4 cells(vec2 p){
  vec2 ci = floor(p), cf = fract(p); float d1 = 9., d2 = 9., id = 0., id2 = 0.;
  for (int yy = -1; yy <= 1; yy++) for (int xx = -1; xx <= 1; xx++) {
    vec2 o = vec2(float(xx), float(yy)); vec2 h = h22(ci + o); vec2 d = o + 0.1 + 0.8 * h - cf; float dd = dot(d, d);
    if (dd < d1) { d2 = d1; id2 = id; d1 = dd; id = h.x; } else if (dd < d2) { d2 = dd; id2 = h.x; } }
  return vec4(sqrt(d2) - sqrt(d1), id, sqrt(d1), id2);
}
void main(){
  float holeD = 9.;
  if (uHole.w > 0.5 && vRock.z > 0.5 && vL.z > 0.) { float hx = (vL.x - uHole.x) / uHole.y, hy = vL.y / uHole.z; holeD = hx * hx + hy * hy; if (holeD < 1.) discard; }
  float holeGate = 1. - smoothstep(1.0, 1.25, holeD);          // (nothing with a screen-space slope right at the tunnel's cut edge)
  vec3 Ng = normalize(vN); if (!gl_FrontFacing) Ng = -Ng;
  vec3 L = normalize(uSunDir);
  // (with antialiasing a sliver triangle is shaded outside its own area and its varyings run on past their ends: every one
  // that feeds an exponent or a product is clamped to its true range here, and the colour is capped at the end)
  float u = vUv.x, y = vL.y, rim = max(vRock.x, 0.), ao = clamp(vRock.y, 0., 1.);
  float wall = 1. - smoothstep(0.5, 0.85, abs(Ng.y));
  // how many metres of rock one pixel covers: every layer of detail fades out before it is finer than a pixel
  float fu = fwidth(u), fy = fwidth(y), fw = fu + fy; gFu = fu;
  // the footprint that round (isotropic) detail fades by leans on the smaller of the two axes: looking along a wall the
  // pixel is long in u only, and pits, joints and grain must not all blur out with it (each still fades two pixels wide)
  float fwP = 0.7 * fw + 0.6 * min(fu, fy);
  float gfade = 1. - smoothstep(0.045, 0.14, fwP);         // decimetre grain
  float g2fade = 1. - smoothstep(0.12, 0.35, fwP);         // grain a third of a metre across
  float pfade = 1. - smoothstep(0.23, 0.7, fwP);           // pits, hairline cracks (half a metre)
  float qfade = 1. - smoothstep(0.55, 1.6, fwP);           // solution hollows (two metres)
  float tfade = 1. - smoothstep(0.3, 1.3, fw);            // rills and thin runs (a metre or two)
  float cfade = 1. - smoothstep(1.1, 3.4, fwP);           // joint blocks (three to eight metres)
  float dEye = length(cameraPosition - vW);
  gNear = 1. - smoothstep(100., 180., dEye);              // at arm's length the wall is pitted, jointed stone: the long curtains and flutes step back
  float nearB = 1. - smoothstep(170., 300., dEye);        // and its blocks, hollows and cracks carry relief of their own
  float jfade = 1. - smoothstep(1.4, 4.2, fw);            // bedding
  float ffade = 1. - smoothstep(1.6, 5.5, fw);            // broad flutes and the weathering skin (six to twenty metres)
  // how far the lathe's own (u, y) is stretched over the real surface here (a shelf, a cave's throat, the underside of an
  // overhang: metres of rock per metre of (u, y)). Everything that runs down the wall fades with it, so nothing smears.
  float sK = 1. - smoothstep(1.6, 3.0, (length(dFdx(vW)) + length(dFdy(vW))) / max(fw, 1e-4));
  vec3 T = cross(vec3(0., 1., 0.), Ng); float tl = length(T); T = tl > 1e-4 ? T / tl : vec3(1., 0., 0.);
  float pit = vnoise(vec2(u * 1.7, y * 1.5)), big = fbm3(vec2(u * 0.03, y * 0.045) + 3.);
  float grain = vnoise(vec2(u * 7.1, y * 5.3)), grain2 = vnoise(vec2(u * 3.4 + 5., y * 3.1));
  float hol = vnoise(vec2(u * 0.55 + 31., y * 0.6 + 7.)) * 0.65 + vnoise(vec2(u * 1.05 + 3., y * 1.1 + 17.)) * 0.35;      // solution hollows and bosses, one to two metres
  // BEDDING: beds of unequal thickness, nearly level, that pinch out here and there (jointAt). A bed's joint is a parting,
  // never a course line: it shows along part of its length only.
  float bwarp = (vnoise(vec2(u * 0.011, 1.)) - 0.5) * 7. + (vnoise(vec2(u * 0.06, 3.)) - 0.5) * 1.6 + (vnoise(vec2(u * 0.37, 3.)) - 0.5) * 0.4;
  float bq = (y + bwarp) / 17.;
  float bk = floor(bq);
  float bed = bq < jointAt(bk, u) ? bk : bk + 1.;                         // this bed lies between joint bed-1 and joint bed
  float jlo = jointAt(bed - 1., u), jhi = jointAt(bed, u);
  float bm = max(jhi - jlo, 0.02) * 17.;                                  // its thickness here, metres
  float bf = clamp((bq - jlo) / max(jhi - jlo, 0.02), 0., 1.);            // 0 at its foot .. 1 under the joint above
  float dTop = (jhi - bq) * 17., dBot = (bq - jlo) * 17.;
  float jrow = dTop < dBot ? bed : bed - 1.;                              // the joint this point is nearest
  float jd = dTop < dBot ? dTop : -dBot;                                  // metres below that joint (negative above it)
  float thick = smoothstep(2.5, 8., bm);                                  // a bed that has all but pinched out carries no lines
  // FLUTING follows the rock irregularly: each bed shifts the ribs a little, they come and go in patches, and they fade
  // where the surface is stretched or finer than a pixel
  float uf = u + (h11(bed * 1.9) - 0.5) * 5.;
  float f0 = flute(uf, y), f1 = flute(uf + 0.4, y);
  float ru = uf * 0.72 + 0.7 * vnoise(vec2(u * 0.06, y * 0.045));
  float r0 = rill(ru, y), r1 = rill(ru + 0.13, y);
  float sfam = mix(1., 0.4, gNear);                                                               // (the streak family at 40% close to)
  float rillM = smoothstep(0.3, 0.62, vnoise(vec2(u * 0.05 + 17., y * 0.028))) * tfade * sK * sfam;      // rills come and go in patches
  float fl = (0.35 + 0.65 * smoothstep(0.25, 0.6, vnoise(vec2(u * 0.017 + 5., y * 0.021)))) * ffade * sK * sfam;
  // joint blocks and hairline cracks: two sizes of jittered cells, their borders as thin dark lines. The larger set is laid
  // out bed by bed (its own offset in every bed), so a vertical joint never runs through from one bed to the next
  vec4 c1 = cells(vec2((u + h11(bed * 2.3) * 23.) * 0.2, bed * 3.7 + bf * bm / 5.5) + (vnoise(vec2(u * 0.09, y * 0.08)) - 0.5) * 0.5);
  vec4 c2 = cells(vec2(u * 1.6 + 13., y * 1.45));
  // a joint is a fracture, not a net: of a block's borders fewer than half are open (each border has its own hash, the same
  // from both sides), so cracks run a block or two and stop; a block's own tone fades out toward its borders, so where no
  // crack runs there is no outline either
  float eh = fract((c1.y + c1.w) * 9.73 + c1.y * c1.w * 31.7);
  // (a crack's and a block edge's own distance over one pixel, from the footprint's longer axis: no derivative of the cell
  // field itself, which jumps from block to block and turned lines to dots)
  float pc1 = clamp(0.19 * max(fu, fy), 1e-4, 0.5);
  // a block's own tone: the same all over the block, meeting its neighbour's half-way at the border over a pixel or two, so
  // two blocks that weathered differently stand side by side with a clean edge (a joint, whether or not a crack is open in it)
  float blockT = mix(0.5 * (c1.y + c1.w), c1.y, smoothstep(0., max(pc1 * 2., 0.02), c1.x)) - 0.5;
  // (a crack keeps its own width, a few centimetres: thinner than a pixel it fades, it never fattens)
  float px1 = max(fwP * 0.2, 1e-4), px2 = max(fwP * 1.2, 1e-4);
  float crackM = smoothstep(0.5, 0.72, vnoise(vec2(u * 0.045 + 7., y * 0.04)));
  crackM = mix(crackM, smoothstep(0.52, 0.6, eh + 0.3 * (crackM - 0.5)), nearB);
  // (an open joint is a hand to a forearm wide; under a pixel and a third it keeps that width and loses contrast instead)
  float cw1 = 0.014 + 0.034 * fract(eh * 5.3);
  float crack1 = (1. - smoothstep(max(cw1, pc1 * 1.3) * 0.4, max(cw1, pc1 * 1.3), c1.x)) * clamp(cw1 * 1.3 / pc1, 0., 1.) * cfade * crackM;
  float crack2 = clamp((0.04 - c2.x) / px2 + 0.5, 0., 1.) * clamp(0.13 / px2, 0., 1.) * pfade * smoothstep(0.42, 0.66, vnoise(vec2(u * 0.17 + 3., y * 0.12)));
  float pitR = 0.07 + 0.15 * fract(c2.y * 5.7);                           // pockmarks of unlike size, in clusters (never a dotted grid)
  float pitD = (1. - smoothstep(pitR * 0.5, pitR, c2.z)) * step(0.55, c2.y) * smoothstep(0.45, 0.62, vnoise(vec2(u * 0.23 + 11., y * 0.27))) * pfade * clamp(pitR * 1.2 / px2, 0., 1.)
    * (1. - smoothstep(0.1, 0.3, fwP));                                   // (a pockmark is a hand across: under two pixels it is only pepper, so it goes)
  float bend = (f1 - f0) * 1.25 * fl + (r1 - r0) * 0.7 * rillM + (pit - 0.5) * 0.45 * pfade * (1. - nearB) + (c1.y - 0.5) * 0.1 * (1. - nearB) * cfade;
  vec3 N0 = normalize(Ng - T * bend * wall + vec3(0., ((vnoise(vec2(u * 1.3 + 9., y * 1.6)) - 0.5) * 0.4 * pfade * (1. - nearB) + (c2.y - 0.5) * 0.08 * pfade) * wall, 0.));
  // CLOSE TO, the face has relief of its own, the same in every direction: solution hollows and bosses a metre or two
  // across, pits half a metre across and grain, as one height field in metres whose slope is taken by differences in (u, y)
  // (never from screen-space derivatives: those are one value per 2 x 2 pixels and drew a chequered dither). Its hollows
  // are darker too (cav, the field's own zero-mean part); open joints and pockmarks are dark marks on top.
  float cav = ((hol - 0.5) * 0.6 * qfade + (pit - 0.5) * 0.3 * pfade + (grain2 - 0.5) * 0.2 * g2fade - 0.4 * pitD) * nearB * wall;
  float eB = max(0.16, 0.6 * fwP);
  float holU = vnoise(vec2((u + eB) * 0.55 + 31., y * 0.6 + 7.)) * 0.65 + vnoise(vec2((u + eB) * 1.05 + 3., y * 1.1 + 17.)) * 0.35;
  float holY = vnoise(vec2(u * 0.55 + 31., (y + eB) * 0.6 + 7.)) * 0.65 + vnoise(vec2(u * 1.05 + 3., (y + eB) * 1.1 + 17.)) * 0.35;
  float pitU = vnoise(vec2((u + eB) * 1.7, y * 1.5)), pitY = vnoise(vec2(u * 1.7, (y + eB) * 1.5));
  float g2U = vnoise(vec2((u + eB) * 3.4 + 5., y * 3.1)), g2Y = vnoise(vec2(u * 3.4 + 5., (y + eB) * 3.1));
  vec2 dH = vec2((holU - hol) * 0.7 * qfade + (pitU - pit) * 0.26 * pfade + (g2U - grain2) * 0.05 * g2fade,
                 (holY - hol) * 0.7 * qfade + (pitY - pit) * 0.26 * pfade + (g2Y - grain2) * 0.05 * g2fade) / eB;
  // (a slope is never steeper than the stone; the relief comes in patches, calm stone between: never one even pebble-dash)
  float relM = 0.3 + 0.7 * smoothstep(0.36, 0.64, vnoise(vec2(u * 0.07 + 51., y * 0.09 + 13.)));
  dH = clamp(dH, vec2(-1.3), vec2(1.3)) * nearB * wall * (1. - holeGate) * relM * 0.8;
  vec3 N = normalize(N0 - T * dH.x - vec3(0., 1., 0.) * dH.y);
  // WEATHERED LIMESTONE: warm grey stone under a rain-blackened, lichened skin (dark grey to grey-green) that hangs in
  // irregular curtains 30-60 m long from the shoulder and the ledges; paler ribs stand between the flutes, and here and
  // there a slab has come away and left a pale scar. Far off the skin settles to its mean, so a distant tower stays dark.
  vec3 base = uRockCol * (0.5 + 0.42 * big) * mix(1., 0.8 + 0.2 * smoothstep(0., 0.55, f0), fl) * mix(0.9 + 0.2 * pit, 0.8 + 0.4 * pit, pfade);
  base *= (1. + mix((c1.y - 0.5) * 0.07, blockT * 0.24, nearB) * cfade) * (1. + (c2.y - 0.5) * 0.1 * pfade) * (1. + (grain - 0.5) * 0.24 * gfade) * (1. + (grain2 - 0.5) * 0.16 * g2fade);
  base *= (1. - mix(0.3, 0.5, nearB) * crack1 * wall) * (1. - 0.5 * crack2 * wall) * (1. - 0.45 * pitD * wall);
  base *= 1. + clamp(cav, -0.34, 0.26);
  float under = max(exp(-rim / 40.), 0.6 * exp(-dTop / 9.) * thick);
  float st = fbm3(vec2(uf * 0.1 + 11., y * 0.021)) * 0.75 + vnoise(vec2(uf * 0.42 + 3., y * 0.05)) * 0.35;
  // close to, the skin lies in patches that keep to the joint blocks (a block is weathered or it is not) and to the hollows:
  // no more than about two and a half times taller than wide, with an edge
  float stN = fbm3(vec2(uf * 0.1 + 11., y * 0.047)) * 0.5 + vnoise(vec2(uf * 0.3 + 3., y * 0.13)) * 0.2 + 0.17 + blockT * 0.42 * cfade + (hol - 0.5) * 0.1 * qfade;
  st = mix(st, stN, gNear);
  float se = mix(0.1, 0.055, gNear);
  float skin = mix(0.56, smoothstep(0.5 - se, 0.5 + se, st + 0.15 * under), ffade * sK) * mix(1., 0.75 + 0.25 * under, wall);
  float scar = smoothstep(0.62, 0.72, fbm3(vec2(u * 0.035 + bed * 0.9, y * 0.05) + 23.)) * (1. - smoothstep(2.4, 7., fw)) * wall;
  skin *= 1. - 0.85 * scar;
  base = mix(base, base * vec3(0.27, 0.31, 0.31), skin * 0.9 * (0.3 + 0.7 * wall));
  base = mix(base, base * vec3(0.86, 1.0, 0.8), 0.6 * smoothstep(0.35, 0.7, vnoise(vec2(u * 0.05 + 40., y * 0.06))) * skin);     // lichen: grey-green
  base = mix(base, base * vec3(1.12, 1.04, 0.9), scar * 0.7);
  // a joint shows as a parting with a shadow under it along about half its length (it comes and goes, so the face runs on
  // across it); about a fifth of it is a real ledge with a pale lip, tufts on top and creepers hanging below
  float jline = smoothstep(0.36, 0.66, vnoise(vec2(u * 0.038 + jrow * 7.3, jrow * 5.1))) * jfade * wall * vRock.z * thick;
  float jmask = smoothstep(0.58, 0.7, vnoise(vec2(u * 0.075 + jrow * 17.3, jrow * 3.1))) * jfade * wall * vRock.z * thick;
  float jbelow = smoothstep(-0.05, 0.1, jd);
  float seam = (1. - smoothstep(mix(0.1, 0.07, gNear), mix(0.32, 0.2, gNear) + fw, abs(jd - 0.12))) * jline * mix(1., 1.5, gNear);      // (a crisp level line close to)
  float lip = smoothstep(-0.7 - fw, -0.3, jd) * (1. - smoothstep(-0.08, 0.1 + fw, jd)) * max(jmask, mix(0.1, 0.5, gNear) * jline) * smoothstep(5., 10., bm);
  float jsh = jbelow * exp(-max(jd, 0.) / mix(0.8, 1.9, jmask)) * max(jmask, 0.3 * jline);
  base *= (1. - 0.5 * jsh) * (1. - 0.32 * seam);
  // THIN BEDS close to: the limestone lies in courses a forearm to a stride thick, and their partings are level lines laid
  // in world space (height, and the wall's own run in x and z: nothing stretches where the lathe's u does), each with a
  // shadow in it and a lit lip under it, open along part of its length only. They fade by the pixel's height alone, so
  // they hold when the wall is seen along its length from 40 m.
  float hcW = vW.z * 0.83 + vW.x * 0.56;
  float lmQ = (y + 0.5 * vnoise(vec2(hcW * 0.045, y * 0.11)) + 2.2 * vnoise(vec2(hcW * 0.013 + 3., y * 0.16 + 9.))) / 1.15, lmR = floor(lmQ);      // (courses of unlike thickness: never ruled lines)
  float lmD = (fract(lmQ) - 0.25 - 0.5 * h11(lmR * 1.71 + 3.)) * 1.15;             // metres above this course's parting
  float lmW = max(0.045, 0.75 * fy);
  float lmF = (1. - smoothstep(0.16, 0.5, fy)) * nearB * wall * vRock.z * step(0.42, h11(lmR * 3.3 + 1.)) * smoothstep(0.36, 0.56, vnoise(vec2(hcW * 0.1 + lmR * 3.1, lmR * 1.7)));
  float lmLine = (1. - smoothstep(lmW * 0.5, lmW, abs(lmD))) * clamp(0.09 / lmW, 0., 1.);
  float lmLip = (1. - smoothstep(lmW, lmW * 2.6, abs(lmD + 1.7 * lmW))) * clamp(0.12 / lmW, 0., 1.);
  base *= (1. - 0.5 * lmLine * lmF) * (1. + 0.2 * lmLip * lmF) * (1. + (h11(lmR * 2.9) - 0.5) * 0.14 * lmF);
  // and within a course, at arm's length, hair partings a hand apart that come and go (the same rule, a third of the scale)
  float lnQ = (y + 0.2 * vnoise(vec2(hcW * 0.11, y * 0.3 + 7.))) / 0.36, lnR = floor(lnQ);
  float lnD = (fract(lnQ) - 0.25 - 0.5 * h11(lnR * 1.37 + 5.)) * 0.36, lnW = max(0.02, 0.75 * fy);
  float lnF = (1. - smoothstep(0.07, 0.2, fy)) * nearB * wall * vRock.z * step(0.6, h11(lnR * 2.1 + 9.)) * smoothstep(0.45, 0.62, vnoise(vec2(hcW * 0.21 + lnR * 1.3, lnR * 0.7)));
  base *= 1. - 0.3 * (1. - smoothstep(lnW * 0.5, lnW, abs(lnD))) * clamp(0.045 / lnW, 0., 1.) * lnF;
  float rimE = min(rim, max(jd, 0.) + (1. - jmask * jbelow) * 90.);      // metres below the nearest ledge of either kind
  float tuft = smoothstep(-2.4, -0.4, jd) * (1. - smoothstep(-0.1, 0.5, jd)) * (0.3 + 0.7 * jmask)
    * smoothstep(0.52, 0.72, vnoise(vec2(u * 0.3, jrow * 5.3)) * 0.6 + vnoise(vec2(u * 1.1, y * 0.7)) * 0.4) * wall * vRock.z * jfade;
  // distinct black rain streaks and rust runs, each hanging from a ledge: the top of this bed, the bed above, the shoulder
  float sfil = 0.7 + 0.3 * mix(vnoise(vec2(u * 2.6, y * 0.09)), pit, gNear);
  float runF = wall * (1. - smoothstep(1.2, 3.6, fw)) * sK;
  float streak = max(run(u, dTop, bed, 12., 0.55, 7., 30., 2.2), run(u, dTop + bm, bed + 1., 12., 0.6, 7., 30., 2.2));
  streak = max(streak, run(u, rim, 77., 13., 0.4, 16., 55., 3.2)) * sfil * runF;
  // the thin rain runnels the shower left: white threads of falling water down the middle of the wetter runs, sliding
  float rnw = min(max(0.34, 1.6 * fu), mix(4., 0.5, gNear));                 // close to a runnel stays a hair: it thins out instead of fattening
  float runnel = max(thread(u + 1.1, dTop, bed + 7., 31., 0.68, 8., 24., rnw), thread(u + 2.3, rim, 53., 26., 0.45, 25., 75., rnw * 1.15))
    * runF * clamp(0.5 / rnw, 0., 1.) * clamp(rnw / max(1.6 * fu, 1e-3), 0.25, 1.) * mix(1., 0.64, gNear) * (1. - smoothstep(1.4, 3.2, fw)) * (0.5 + 0.5 * vnoise(vec2(u * 0.4, y * 0.7 + uTime * 3.5)));
  base = mix(base, base * vec3(0.2, 0.21, 0.24), streak * 0.9);
  // rust: thin runs a hand to an arm wide and 7 to 36 m long, each from its own ledge, streaked along their fall: never a patch
  float rust = max(run(u + 5., dTop, bed + 40., 8.5, 0.6, 7., 24., 0.85), run(u + 5., rim, 91., 10.5, 0.5, 12., 36., 1.15));
  rust *= (0.55 + 0.45 * vnoise(vec2(u * 3.1, y * 0.1))) * runF;
  base = mix(base, uRustCol * (0.55 + 0.5 * pit), rust * 0.72);
  base = mix(base, base * vec3(1.1, 0.9, 0.74), 0.5 * exp(-rim / 16.) * smoothstep(0.35, 0.7, big) * wall);     // a faint warm wash under the shoulder
  // creepers hanging in ragged curtains from the cap and from every ledge, swaying; their feet fray into strands
  float sway = sin(uTime * 0.8 + u * 0.3) * 0.3;
  float strand = vnoise(vec2(u * 2.9 + sway, y * 0.13));
  float cl = (6. + 16. * vnoise(vec2(u * 0.11, 2.))) * (0.3 + 0.7 * vnoise(vec2(u * 0.7, 9.)));
  float hang = clamp(rim / cl, 0., 1.);
  float cn = vnoise(vec2((u + sway * hang) * 0.8, y * 0.06));
  float creeper = smoothstep(0.42, 0.6, cn + 0.55 * (1. - hang)) * (1. - smoothstep(0.8, 1., hang)) * smoothstep(0.1, 0.5, strand + 1.2 * (1. - hang));
  float clJ = (5. + 9. * vnoise(vec2(u * 0.13 + jrow * 5.1, 7.))) * jmask + 0.02;                 // a fringe of strands, each its own length, tapering out at the ledge's ends
  float hangJ = clamp(max(jd, 0.) / clJ, 0., 1.);
  float uS = u + sway * hangJ;
  float lenN = (0.28 + 0.72 * vnoise(vec2(uS * 2.3 + jrow * 3.3, 5.))) * (0.45 + 0.55 * vnoise(vec2(uS * 0.31 + jrow * 9.1, 2.)));
  float cnJ = vnoise(vec2(uS * 0.85 + jrow * 3.7, y * 0.07));
  float creeperJ = (1. - smoothstep(lenN - 0.16, lenN, hangJ)) * smoothstep(0.22, 0.42, cnJ + 0.45 * (1. - hangJ)) * smoothstep(0.02, 0.3, jmask) * jbelow;
  creeper = max(creeper, creeperJ) * wall * vRock.z;
  float leafn = vnoise(vec2(u * 2.3, y * 1.9)), leaff = vnoise(vec2(u * 6.1, y * 5.3));
  float cvar = vnoise(vec2(u * 0.21 + 5., y * 0.16));                       // dark-green curtains (never black), shadowed under the ledge they hang from
  vec3 creepCol = (uLeafCol * 2.3 + vec3(0.01, 0.026, 0.005)) * (0.42 + 0.8 * leafn + 0.5 * (leaff - 0.5) * pfade) * (0.55 + 0.9 * cvar) * mix(0.45, 1., smoothstep(0.3, 4., rimE));
  float green = max(creeper, tuft * 0.9);
  base = mix(base, creepCol, green);
  // the tunnel's lip: paler, wet rock catching the portal's light
  float lipRim = (1. - smoothstep(1.02, 1.5, holeD)) * step(0.5, uHole.w);
  base = mix(base, uRockCol * 0.95, lipRim * 0.5);
  // cave mouths: an arch over a flattish floor with a ragged rim and stalactite teeth along the upper lip; a pale sill that
  // catches the light below, a shadowed brow above, and depth inside: the throat darkens inward and upward, while the floor
  // just inside the sill and the inner wall turned to the sun are still lit. Far off (over half a metre of rock to a pixel)
  // the teeth go and the mouth is a recessed shadow in the shade colour, never a black spot.
  vec2 chw = max(vCave.zw, vec2(1.));
  vec2 cq = (vUv - vCave.xy) / chw;
  float craw = length(vec2(cq.x, cq.y < 0. ? cq.y * 1.9 : cq.y));
  float cfar = smoothstep(0.5, 1.5, fw), cfar2 = smoothstep(1.0, 2.4, fw);
  float topK = smoothstep(0.05, 0.5, cq.y);
  float tq = u * 0.34 + 0.5 * vnoise(vec2(u * 0.23, 3.));
  float tri = 1. - abs(fract(tq) * 2. - 1.);
  float tooth = tri * sqrt(tri) * (0.05 + 0.3 * h11(floor(tq) + vCave.x)) * topK * (1. - cfar);         // stalactite teeth three metres apart, half a metre to four long
  float carch = craw + 0.16 * (fbm3(vUv * 0.21 + 3.) - 0.5) + 0.09 * (vnoise(vUv * 0.9 + 7.) - 0.5) * (1. - cfar);      // the arch itself, ragged
  float cdist = carch + tooth;
  float cgate = smoothstep(0.6, 0.95, vRock.w);
  float caa = clamp(fwidth(carch), 0.003, 0.25) * 0.75;                                   // a hard rim: one pixel, whatever the range (from the arch alone: the teeth's field jumps from tooth to tooth)
  float caaT = caa + min(0.15 * fu, 0.2) * topK;                                           // the teeth's own edge
  float mouth = (1. - smoothstep(1. - caaT, 1. + caaT, cdist)) * cgate;
  float cave = mouth;
  float inArch = (1. - smoothstep(1. - caa, 1. + caa, carch)) * cgate;                    // the teeth are what is inside the arch but not open
  float sill = (1. - smoothstep(1.02, 1.3, cdist)) * (1. - mouth) * (1. - smoothstep(-0.3, -0.12, cq.y)) * cgate;
  float brow = (1. - smoothstep(1.0, 1.0 + 1.1 / chw.y + caa, carch)) * (1. - inArch) * smoothstep(0., 0.3, cq.y) * cgate;      // a metre of shadow under the brow, above the lip
  float tipK = smoothstep(0.4, 1., (1. - carch) / max(tooth, 0.02)) * clamp(inArch - mouth, 0., 1.);      // teeth: pale at the root, dark-tipped
  base *= (1. + 1.1 * sill) * (1. - 0.55 * brow) * (1. + 0.3 * (inArch - mouth)) * (1. - 0.55 * tipK);
  // inside: the eye's ray is carried on into a throat that narrows to under half the mouth over its depth, with a level
  // floor; where it lands (floor, wall or roof of the throat, or the back) is lit by what sun comes in through the mouth, by
  // the sky's light falling off inward and by the lit floor's bounce. No look-up and no derivative in here.
  vec3 caveCol = vec3(0.);
  if (mouth > 0.002) {
    vec3 Vd = normalize(vW - cameraPosition + vec3(1e-5));
    float vt = dot(Vd, T), vb = Vd.y, dz = max(-dot(Vd, Ng), 0.24);
    vec2 p0 = vUv - vCave.xy;
    float Dc = 1.15 * chw.x + 2.5, kz = 0.58 / Dc;
    vec2 e0 = p0 / chw; e0 *= 0.97 / max(length(e0), 0.97);
    vec2 ed = vec2(vt, vb) / chw;
    float qa = dot(ed, ed) - kz * kz * dz * dz, qb = dot(e0, ed) + kz * dz, qc = dot(e0, e0) - 1.;
    float den = qb + sqrt(max(qb * qb - qa * qc, 0.));
    float tw = den > 1e-4 ? -qc / den : 1e3;
    float yf = -0.5 * chw.y, fs = 0.5;                                   // the floor rises inward (silt and fallen blocks): half a metre a metre
    float fden = fs * dz - vb;
    float tf = fden > 1e-3 ? max(e0.y * chw.y - yf, 0.) / fden : 1e3;
    float tbk = Dc / dz;
    float tt = min(min(tw, tf), tbk);
    float isF = tf <= min(tw, tbk) ? 1. : 0., isB = (tbk < tw && tbk < tf) ? 1. : 0.;
    vec2 hp = e0 * chw + tt * vec2(vt, vb); float hz = tt * dz;
    vec2 en = hp / (chw * chw); en /= max(length(en), 1e-4);
    vec3 nIn = isF > 0.5 ? vec3(0., 1., 0.) : (isB > 0.5 ? Ng : normalize(-(T * en.x + vec3(0., en.y, 0.)) + Ng * 0.3));
    float Ln = dot(L, Ng), Lt = dot(L, T);
    vec2 sp = (hp + hz * vec2(Lt, L.y) / max(Ln, 0.06)) / chw;
    float sunIn = smoothstep(0.02, 0.22, Ln) * (1. - smoothstep(0.78, 1.02, length(vec2(sp.x, sp.y < 0. ? sp.y * 1.9 : sp.y))));
    float dk = exp(-hz / 2.6);
    float tex = vnoise(vec2(hp.x * 0.9 + hz * 0.8, hp.y * 0.9 - hz * 0.35)) * 0.6 + vnoise(vec2(hp.x * 2.3 - hz * 1.7, hp.y * 2.1 + hz)) * 0.4;
    vec3 albIn = mix(uRockCol * vec3(0.78, 0.66, 0.52), uRockCol * vec3(1.0, 0.96, 0.84), isF * 0.8) * (0.5 + 0.55 * tex);      // warm stone; the floor's silt is cream
    vec3 shdI = mix(uShadeCol, vec3(dot(uShadeCol, vec3(0.3333))), 0.3);
    vec3 ambIn = (shdI * 1.5 + uSkyCol * 0.55 + uHorizonCol * 0.2) * (0.1 + 1.0 * dk) * (0.5 + 0.5 * max(nIn.y, 0.) + 0.25 * max(dot(nIn, Ng), 0.));
    vec3 bncIn = uSunCol * vec3(1.0, 0.84, 0.62) * 0.3 * smoothstep(0.02, 0.22, Ln) * (0.1 + 0.9 * dk) * (0.55 + 0.45 * max(-nIn.y, 0.));     // the lit floor and far wall throw warm light back on roof and walls
    caveCol = albIn * (uSunCol * sunIn * (0.25 + 0.75 * max(dot(nIn, L), 0.)) * 0.6 * (0.22 + 0.78 * exp(-hz / 4.5)) + ambIn + bncIn) + mix(uShadeCol, vec3(0.2, 0.14, 0.08), 0.45) * 0.05;     // deep in: jade-brown, never black
  }
  // the tide band: wet near-black rock up to a ragged line five or six metres above the water (never thinner than a pixel
  // or two, so every foot far off still stands on a dark base), a pale barnacle line across it close to
  float yy = y + 0.5 * (vnoise(vec2(u * 0.25, 4.)) - 0.5) + 0.12 * sin(uTime * 0.9 + u * 0.15);
  float wet = 1. - smoothstep(2.5, 3.4, yy);
  float tideTop = 5.8 + 1.8 * (vnoise(vec2(u * 0.12, 4.)) - 0.5) + min(fw, 5.) * 1.3;
  float tide = (1. - smoothstep(tideTop - 1.4, tideTop, yy)) * vRock.z;
  float barn = smoothstep(1.8, 2.2, yy) * (1. - smoothstep(2.9, 3.5, yy)) * (1. - smoothstep(0.5, 2., fw));
  base = mix(base, base * 0.2 + vec3(0.003, 0.007, 0.007), max(wet, tide * 0.88) * (1. - barn));
  base = mix(base, vec3(0.40, 0.39, 0.32) * (0.65 + 0.55 * pit), barn * 0.85);
  // light: gold sunward face, jade-blue shade. The sun stands nearly square to the lit wall and the sky fill square to the
  // shaded one, so relief is read from the height field itself (a raking term and darker grooves) in sun and in shade alike
  float ndl = dot(N, L);
  float lit = smoothstep(-0.05, 0.5, ndl);
  float ndl0 = dot(N0, L);
  float bumpS = clamp(1. + 1.6 * uBumpK * (ndl - ndl0), 1. - 0.5 * uBumpK, 1. + 0.5 * uBumpK), bumpA = clamp(1. + uBumpK * (1.3 * (N.y - N0.y) + 0.5 * (ndl - ndl0)), 1. - 0.34 * uBumpK, 1. + 0.34 * uBumpK);     // the close relief, read in sun and (from the sky above) in shade
  float rel = ((f1 - f0) * 3.4 * fl + (r1 - r0) * 1.0 * rillM + (pit - 0.5) * 0.36 * pfade + (c1.y - 0.5) * 0.08 * cfade) * wall * (1. - green);
  float groove = mix(1., 0.72 + 0.28 * smoothstep(0.14, 0.6, r0), rillM * wall * (1. - green)) * mix(1., 0.74 + 0.26 * smoothstep(0.1, 0.6, f0), fl * wall * (1. - green));
  float relA = clamp(1. + rel * 0.85, 0.6, 1.45) * groove, relS = clamp(1. + rel * 1.25, 0.45, 1.65) * (0.3 + 0.7 * groove);
  float s1 = 1. - abs(vnoise(vec2(u * 0.3 + uTime * 0.35, y * 0.42 - uTime * 0.6)) * 2. - 1.), s2 = 1. - abs(vnoise(vec2(u * 0.55 - uTime * 0.3, y * 0.3 + uTime * 0.28)) * 2. - 1.);
  float shim = s1 * s1 * s2 + 0.35 * s1 * s2 * s2;
  float low = 1. - smoothstep(3., 36., y);
  vec3 shd = mix(uShadeCol, vec3(dot(uShadeCol, vec3(0.3333))), 0.5);
  float sunSide = 0.5 + 0.5 * dot(normalize(Ng.xz + vec2(1e-4)), normalize(L.xz + vec2(1e-4)));
  vec3 amb = (shd * (1.3 + 0.3 * Ng.y) + uSkyCol * (0.37 + 0.4 * max(Ng.y, 0.))) * mix(1., 0.8 + 0.22 * smoothstep(0., 0.6, sunSide), wall) + uHorizonCol * (0.1 + 0.16 * sunSide) * wall;   // a face turned from the sun is a step darker: towers stand dark against the light
  // ... and it stands in jade-blue shade, never in grey or olive: the sky's cool fill, with its relief readable
  // (seen against the light, with the sun behind it, a tower keeps more of its darkness: the Sentinel stands dark in the glitter)
  float cjour = max(dot(normalize(vW.xz - cameraPosition.xz + vec2(1e-4)), normalize(L.xz + vec2(1e-4))), 0.);
  float shadeK = wall * (1. - smoothstep(0.15, 0.6, sunSide)) * (1. - 0.5 * cjour * cjour);
  amb += (mix(uShadeCol, vec3(dot(uShadeCol, vec3(0.3333))), 0.15) * 1.05 + uSkyCol * 0.15 - uHorizonCol * 0.05) * shadeK;
  vec3 bounce = uWaterCol * low * (0.1 + 1.25 * shim) * (1. - 0.6 * wet);
  vec3 col = base * (uSunCol * lit * (0.3 + 0.24 * max(ndl, 0.)) * relS * bumpS + amb * relA * bumpA + bounce) * ao;
  col += creepCol * green * dot(uSkyCol + shd, vec3(0.3333)) * 0.9 * ao * (1. - cave);               // a floor: creepers in shade stay dark green, never black
  col += base * (uHorizonCol * 0.55 + uSkyCol * 0.3) * lip * (1. - green) * ao * (1. - cave) * mix(1., 1.9, gNear);       // the ledge's lip catches the low light: a thin gold rim
  // rain runnels: white threads, blue-white in shade, a few catching the gold
  col = mix(col, (uSkyCol * 0.8 + shd * 0.7 + uHorizonCol * 0.25 + uSunCol * lit * 0.34) * (1. - 0.5 * green), runnel * 0.55 * (1. - cave));
  vec3 V = normalize(cameraPosition - vW); vec3 R = reflect(-V, N);
  float ndv = max(dot(N, V), 0.);
  float gl = uWetRock * (0.2 + 0.6 * streak) * (1. - green) + wet;
  col += uSunCol * pow(max(dot(R, L), 0.0), 22.) * gl * 0.5 * smoothstep(-0.1, 0.2, dot(Ng, L)) * (1. - cave) * ao;
  float fres = (1. - ndv) * (1. - ndv);
  col += uSkyCol * fres * 0.3 * wet * (1. - ndv) + base * uSkyCol * fres * 0.6 * uWetRock * (0.15 + 0.85 * streak) * (1. - green) * (1. - cave) * wall * ao;   // wet sheen in shade: the rock's own colour, strongest on the runs
  col += vec3(0.5, 0.82, 0.72) * 0.42 * lipRim * (0.6 + 0.4 * pit);
  // the cave's inside; far off it is a recessed shadow in the wall's own shade, never a black spot
  col = mix(col, mix(caveCol, base * amb * 0.55 + uShadeCol * 0.02, cfar2) * ao, cave);
  gl_FragColor = vec4(clamp(col, vec3(0.), uSunCol * 1.1 + 0.3), 1.);
  #include <fog_fragment>
}`,_t=`
attribute vec3 aSw; uniform float uTime; uniform vec3 uSunDir;
varying vec3 vN; varying vec3 vW; varying vec3 vCol; varying vec2 vRoof;
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  p.x += sin(uTime * 1.1 + aSw.y) * 0.35 * aSw.x; p.z += cos(uTime * 0.9 + aSw.y * 1.7) * 0.3 * aSw.x; p.y += sin(uTime * 1.7 + aSw.y * 0.6) * 0.12 * aSw.x;
  vCol = color; vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; vN = mat3(modelMatrix) * normal;
  // how far toward the sun this point sits on its own summit (-1 the lee side .. 1 the sunward side)
  vec2 sx = uSunDir.xz / max(length(uSunDir.xz), 1e-3);
  vRoof = vec2(aSw.z, clamp(dot(w.xz - modelMatrix[3].xz, sx) / 55., -1., 1.));
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Wt=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uShadeCol; uniform float uTime;
varying vec3 vN; varying vec3 vW; varying vec3 vCol; varying vec2 vRoof;
#include <fog_pars_fragment>
${We}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); vec3 L = normalize(uSunDir);
  float mott = vnoise(vW.xz * 0.9 + vW.y * 0.7) * vnoise(vW.xz * 2.3 - vW.y);
  float gap = 0., tone = 1.;
  if (vRoof.x > 0.5) {
    // the roof between the modelled crowns: a mosaic of rounded heads (nearest-cell bump), dark in the gaps between them
    vec2 q = vW.xz / 7.5 + vec2(sin(uTime * 0.7 + vW.z * 0.05), cos(uTime * 0.6 + vW.x * 0.05)) * 0.02;
    vec2 qi = floor(q), qf = fract(q), best = vec2(0.); float bd = 9., bh = 0.;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j)), hsh = h22(qi + o), d = o + 0.15 + 0.7 * hsh - qf; float dd = dot(d, d);
      if (dd < bd) { bd = dd; best = d; bh = hsh.x; } }
    float rr = sqrt(bd);
    N = normalize(N - vec3(best.x, 0., best.y) * 1.9 * smoothstep(0.05, 0.6, rr));
    gap = smoothstep(0.42, 0.7, rr); tone = 0.65 + 0.7 * bh;
  }
  float ndl = dot(N, L);
  vec3 vc = clamp(vCol, 0., 1.);                                          // (never past its ends on a sliver, see the rock)
  vec3 base = vc * (0.55 + 1.6 * mott) * tone * (1. - 0.6 * gap);
  float side = smoothstep(-0.9, 0.7, vRoof.y);
  float lit = smoothstep(-0.2, 0.55, ndl) * mix(0.42, 1.1, side);
  vec3 fresh = vec3(0.26, 0.31, 0.04);
  vec3 shd = mix(uShadeCol, vec3(dot(uShadeCol, vec3(0.3333))), 0.5);
  vec3 col = base * (uSunCol * lit * 0.85 + shd * 1.2 + uSkyCol * 0.6 * max(N.y, 0.)) + fresh * uSunCol * 0.2 * lit * lit * (0.35 + mott * 2.2) * tone * (1. - gap);
  // a floor so a crown in shade is dark green, never black: leaf colour under the sky's own brightness, fuller on top
  float skyL = dot(uSkyCol + shd, vec3(0.3333));
  col += vc * (0.45 + 1.5 * mott) * tone * (1. - 0.5 * gap) * skyL * (1.9 + 1.3 * N.y);
  // and a thin gold rim where a crown's edge is turned to the sun
  vec3 V = normalize(cameraPosition - vW);
  float edge = 1. - abs(dot(N, V)); edge *= edge * edge;
  col += uSunCol * vec3(0.3, 0.27, 0.06) * edge * smoothstep(-0.05, 0.6, ndl) * (0.35 + 1.3 * mott) * (1. - gap) * mix(0.5, 0.12, step(0.5, vRoof.x));
  gl_FragColor = vec4(clamp(col, vec3(0.), uSunCol * 0.8 + 0.3), 1.);
  #include <fog_fragment>
}`,Dt=`
attribute float aOn; varying vec2 vUv; varying float vOn;
#include <fog_pars_vertex>
void main(){ vUv = uv; vOn = aOn; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,It=`
uniform float uTime; uniform vec3 uFoamCol, uDeepCol;
varying vec2 vUv; varying float vOn;
#include <fog_pars_fragment>
${We}
void main(){
  float u = vUv.x, v = vUv.y;
  float surge = sin(uTime * 0.7 + u * 0.08) * 0.5 + 0.5;
  float n = fbm3(vec2(u * 0.33, v * 3.2 - uTime * 0.22 - surge * 0.5)) * 0.7 + vnoise(vec2(u * 1.3 + uTime * 0.1, v * 7. - uTime * 0.4)) * 0.4;
  float foam = smoothstep(mix(0.22, 0.85, v), mix(0.45, 1.0, v), n) * (1. - smoothstep(0.75, 1., v));
  foam = max(foam, (1. - smoothstep(0.02, 0.12 + 0.1 * surge, abs(v - 0.2))) * (0.5 + 0.5 * n));
  float dark = (1. - smoothstep(0.1, 0.55, v)) * 0.55;
  float a = max(foam, dark * (1. - foam)) * vOn;
  if (a < 0.004) discard;
  gl_FragColor = vec4(mix(uDeepCol * 0.3, uFoamCol * (0.7 + 0.3 * n), foam), a);
  #include <fog_fragment>
}`;function st(e){return{uSunDir:{value:z(-.84,.375,.39).normalize()},uSunCol:{value:new i.Color("#FFD9A0").multiplyScalar(2.4)},uSkyCol:{value:new i.Color("#6E97A8")},uHorizonCol:{value:new i.Color("#E8C89A")},uShadeCol:{value:new i.Color("#2C5560")},uWaterCol:{value:new i.Color().setRGB(...e[0])},uSprayCol:{value:new i.Color("#FFCF8A")},uTime:{value:0}}}function Lt(e={}){const t=(e.palette&&e.palette.length>=7?e.palette:et).map(Ae),o=e.uniforms||st(t),n=()=>i.UniformsUtils.clone(i.UniformsLib.fog),g=u=>({...n(),uHorizonCol:o.uHorizonCol,uSunDir:o.uSunDir,uSunCol:o.uSunCol,uSkyCol:o.uSkyCol,uShadeCol:o.uShadeCol,uWaterCol:o.uWaterCol,uTime:o.uTime,uRockCol:{value:new i.Color().setRGB(...t[2])},uRustCol:{value:new i.Color("#7c4526")},uBumpK:{value:1},uLeafCol:{value:new i.Color().setRGB(...t[3])},uWetRock:{value:e.wet!==void 0?e.wet:1},uHole:{value:u||new i.Vector4(0,1,1,0)}}),k=u=>new i.ShaderMaterial({vertexShader:Rt,fragmentShader:Nt,fog:!0,side:i.DoubleSide,uniforms:g(u)}),c=k(null),r=new i.ShaderMaterial({vertexShader:_t,fragmentShader:Wt,fog:!0,vertexColors:!0,side:i.DoubleSide,uniforms:{...n(),uSunDir:o.uSunDir,uSunCol:o.uSunCol,uSkyCol:o.uSkyCol,uShadeCol:o.uShadeCol,uTime:o.uTime}}),l=new i.ShaderMaterial({vertexShader:Dt,fragmentShader:It,fog:!0,transparent:!0,depthWrite:!1,uniforms:{...n(),uTime:o.uTime,uFoamCol:{value:new i.Color("#e9dcc0")},uDeepCol:{value:new i.Color().setRGB(...t[1])}}});return{rock:c,canopy:r,slop:l,makeRock:k,uniforms:o,pal:t}}const Ye=(()=>{const e=(1+Math.sqrt(5))/2,t=Math.hypot(1,e),o=1/t,n=e/t,g=[-o,n,0,o,n,0,-o,-n,0,o,-n,0,0,-o,n,0,o,n,0,-o,-n,0,o,-n,n,0,-o,n,0,o,-n,0,-o,-n,0,o],k=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],c=[];for(const r of k)c.push(g[r*3],g[r*3+1],g[r*3+2]);return c})();async function Gt(e,t={}){const o=(t.rng||e.rng).fork("tower"),n=e.noise,g=e.quality&&e.quality.detail||1,k=t.materials||Lt(t),c=t.height||160,r=t.width||120,l=t.depth||r*o.range(.62,.95),u=!!t.pierced,s=t.segments||Math.min(140,Math.max(48,Math.round((r+l)*1.6/6.5/2)*2)),y=t.rows||30,v=o.range(-50,50),d=o.range(-50,50),S=Math.PI*2,A=(a,p)=>{let G=Math.abs(a-p)%S;return G>Math.PI?S-G:G},W=(a,p,G)=>1-ie(G*.5-.3,G*.5,A(a,p)),I=[],x=[],q=[],D=t.shoulders!==void 0?t.shoulders:o.int(1,2);for(let a=0;a<D;a++)I.push({th:o.range(0,S),span:o.range(1.1,2.3),t:o.range(.45,.8),cut:o.range(.16,.3)});const f=o.int(2,3);for(let a=0;a<f;a++)x.push({th:u&&a===0?o.range(-.3,.3):o.range(0,S),span:o.range(.9,1.9),t:u&&a===0?o.range(.3,.38):o.range(.14,.5),bulge:o.range(3,5.5)});const m=o.int(3,5);for(let a=0;a<m;a++)q.push({j:Math.floor(K(.12,.88,(a+o.range(.2,.8))/m)*s),t:o.range(.12,.6),hw:o.range(5,9),hh:o.range(7,14)});if(u)for(const a of q){const p=a.j/s;p>.36&&p<.64&&(a.j=Math.floor((p<.5?.3:.7)*s))}const w=[];for(let a=0;a<400;a++)w.push(o());const O=[],T=Math.round((t.crowns!==void 0?t.crowns:Math.min(520,Math.max(110,r*l/60)))*g);for(let a=0;a<2600;a++)O.push(o());const _=r/2,N=l/2,h=2.3,M=[],B=[],Y=[],ae=[];for(let a=0;a<=s;a++){const p=Math.PI+a/s*S,G=Math.sin(p),C=Math.cos(p),V=1/(Math.abs(G/_)**h+Math.abs(C/N)**h)**(1/h);M.push(p),B.push(V*(1+.19*n.n2(G*1.3+v,C*1.3+d)+.09*n.n2(G*3.1+d,C*3.1+v)+.05*n.n2(G*6.3+v,C*6.3-d))),ae.push(c*(1-.1*(.5+.5*n.n2(G*.9+v+9,C*.9+d))-.03*(.5+.5*n.n2(G*2.7+d,C*2.7+v))))}B[s]=B[0],ae[s]=ae[0],Y.push(0);for(let a=1;a<=s;a++)Y.push(Y[a-1]+Math.hypot(B[a]*Math.sin(M[a])-B[a-1]*Math.sin(M[a-1]),B[a]*Math.cos(M[a])-B[a-1]*Math.cos(M[a-1])));const F=[-4,-.6,.4,1.6,2.7,3.3],L=[-1.5,-2.2,-3.3,-3.5,-2.6,-.3],ne=[.8,.6,.42,.4,.5,.8],Z=[0];for(let a=1;a<=y;a++)Z.push(a/y);for(const a of I)Z.push(a.t,a.t+.003);for(const a of x)Z.push(a.t-.004,a.t);const se=1-5.5/c;Z.push(se,1-2.2/c),Z.sort((a,p)=>a-p);const de=[...F.map((a,p)=>({notch:p,y:a})),...Z.map(a=>({t:a})),{t:1,top:1}],he=B[s/2|0],me=(a,p)=>4.4+p*(ae[a]-4.4);let be=null;if(t.caveAt){const a=t.caveAt,p=Math.max(1,Math.min(s-1,Math.round(s*(.5+Math.atan2(a.x,he)/S))));be={j:p,t:Math.min(.8,Math.max(.05,(a.y-4.4)/(ae[p]-4.4))),hw:a.hw||7,hh:a.hh||10},q.push(be)}for(const a of q)a.u=Y[a.j],a.v=me(a.j,a.t);if(be)for(let a=q.length-1;a>=0;a--){const p=q[a];p!==be&&Math.hypot((p.u-be.u)/9,(p.v-be.v)/14)<6.5&&q.splice(a,1)}const ue=[],pe=[],ye=[],ee=[],P=[],H=s+1,X=de.length,R=(a,p)=>{const G=Math.max(0,p-se)/(1-se);let C=B[a]*(1-.02*p)-3.2*G*G;C-=4.6*Math.max(0,1-Math.abs(n.n2(Y[a]/26+d*2,p*.5+v))*3.2)*(.4+.6*ie(0,.12,p));for(const V of I)p>V.t+.001&&(C*=1-V.cut*W(M[a],V.th,V.span));for(const V of x)p>=V.t-.001&&(C+=V.bulge*W(M[a],V.th,V.span)*Math.max(0,1-(p-V.t)/.1));return C+=2.6*n.n2(Y[a]/16+v,p*1.2+d)+1.3*n.n2(Y[a]/7+d,p*3+v),C};for(let a=0;a<X;a++){const p=de[a];for(let G=0;G<=s;G++){const C=G===s?0:G,V=p.notch!==void 0?0:p.t;let te=p.notch!==void 0?p.y:me(C,V),oe=R(C,V)+(p.notch!==void 0?L[p.notch]:0);p.top&&(oe-=2.6,te+=.9);let J=1e9,le=1e9,ce=null;for(const ve of q){let Me=Math.abs(Y[C]-ve.u);Me=Math.min(Me,Y[s]-Me);const Te=Math.hypot(Me/ve.hw,(te-ve.v)/ve.hh);Te<J?(le=J,J=Te,ce=ve):Te<le&&(le=Te)}let we=oe*Math.sin(M[C]),ke=oe*Math.cos(M[C]);if(u&&ke>0){const ve=(1-ie(11,21,Math.abs(we)))*(1-ie(25,38,te));ke=K(ke,he,ve)}ue.push(we,te,ke),pe.push(G===s?Y[s]:Y[C],te);let Se=Math.max(0,ae[C]-te);for(const ve of I)V<=ve.t+.001&&W(M[C],ve.th,ve.span)>.5&&(Se=Math.min(Se,Math.max(0,me(C,ve.t)-te)));let ze=p.notch!==void 0?ne[p.notch]:1;for(const ve of x)V<ve.t-.001&&W(M[C],ve.th,ve.span)>.4&&(Se=Math.min(Se,Math.max(0,me(C,ve.t)-te)),Math.abs(V-(ve.t-.004))<.001&&(ze=.5));ye.push(Se,ze,1,J<3.4&&le>J+2.2?1:0),ee.push(ce.u,ce.v,ce.hw,ce.hh)}await e.yield()}for(let a=0;a<X-1;a++)for(let p=0;p<s;p++){const G=a*H+p,C=G+1,V=G+H,te=V+1;P.push(G,C,V,C,te,V)}await e.yield();let U=X*H,b=0;const j=()=>w[b++%w.length],E=(a,p,G,C,V,te,oe,J,le)=>{const ce=U;for(let we=0;we<5;we++){const ke=we/5*S;ue.push(a+Math.cos(ke)*V,p,G+Math.sin(ke)*V),pe.push(te+we*.3,p),ye.push(oe,J,le,0),ee.push(0,-999,1,1)}ue.push(a+(j()-.5)*V,p-C,G+(j()-.5)*V),pe.push(te,p-C),ye.push(oe+C*.4,J,le,0),ee.push(0,-999,1,1);for(let we=0;we<5;we++)P.push(ce+we,ce+(we+1)%5,ce+5);U+=6};for(const a of x){const p=de.findIndex(C=>C.t===a.t),G=p-1;for(let C=0;C<s;C++){if(C%8===7&&await e.yield(),W(M[C],a.th,a.span)<.45)continue;const V=2+(j()>.5?1:0);for(let te=0;te<V;te++){const oe=j()*.75+.2,J=j(),le=(G*H+C)*3,ce=(p*H+C)*3,we=le+3,ke=ce+3,Se=K(K(ue[le],ue[we],J),K(ue[ce],ue[ke],J),oe),ze=K(K(ue[le+2],ue[we+2],J),K(ue[ce+2],ue[ke+2],J),oe),ve=K(ue[le+1],ue[ce+1],oe)+.4;u&&ze>0&&Math.abs(Se)<20&&ve<38||E(Se,ve,ze,1.5+j()*j()*9,.35+j()*.75,Y[C]+J*4,.5,.7,1)}}}await e.yield();const Q={top:z(0,c,0),front:z(0,0,he)};if(Q.caves=q.map(a=>{const p=R(a.j,a.t);return{position:z(p*Math.sin(M[a.j]),a.v,p*Math.cos(M[a.j])),halfWidth:a.hw,halfHeight:a.hh}}),u){const a=[[0,9,22],[3,8.5,18.5],[8,7.6,13.4],[14,6.6,11.5],[22,4.2,8],[24,.3,4]],p=16,G=U;a.forEach(([C,V,te],oe)=>{for(let J=0;J<=p;J++){let le,ce;if(J===0)le=-V,ce=-3;else if(J===p)le=V,ce=-3;else{const we=Math.PI*(1-(J-1)/(p-2));le=Math.cos(we)*V,ce=Math.sin(we)*te}oe>0&&(le+=.9*n.n2(J*.7+v,C*.3),ce+=.9*n.n2(J*.7+d,C*.3+5)*(ce>1?1:0)),ue.push(le,ce,he-C),pe.push(le*1.3+C*2.1+500,ce+C*.4),ye.push(Math.max(0,te-ce)*.5,K(.85,.16,qe(C/20)),0,0),ee.push(0,-999,1,1)}});for(let C=0;C<a.length-1;C++)for(let V=0;V<p;V++){const te=G+C*(p+1)+V,oe=te+1,J=te+p+1,le=J+1;P.push(te,J,oe,oe,J,le)}U+=a.length*(p+1),await e.yield();for(let C=0;C<26;C++){const V=.6+j()*9,te=Math.PI*(.22+.56*j()),oe=qe(V/8),J=K(9,7.6,oe),le=K(22,13.4,oe);E(Math.cos(te)*J*.97,Math.sin(te)*le*.985+.3,he-V,1.2+j()*j()*5.5,.3+j()*.5,520+C*3,.5,K(.8,.4,oe),0)}Q.tunnelMouth=z(0,0,he),Q.tunnelSize={width:18,height:22},Q.portalSeat={position:z(0,0,he-8),normal:z(0,0,1),width:15,height:13},Q.approach=[z(0,2.6,he+96),z(0,4.2,he+40),z(0,5.5,he-8)]}const $=new i.BufferGeometry;$.setAttribute("position",new i.Float32BufferAttribute(ue,3)),$.setAttribute("uv",new i.Float32BufferAttribute(pe,2)),await e.yield(),$.setAttribute("aRock",new i.Float32BufferAttribute(ye,4)),$.setAttribute("aCave",new i.Float32BufferAttribute(ee,4)),$.setIndex(P),await e.yield(),$.computeVertexNormals(),await e.yield();{const a=$.getAttribute("normal");for(let p=0;p<X;p++){const G=p*H,C=G+s,V=a.getX(G)+a.getX(C),te=a.getY(G)+a.getY(C),oe=a.getZ(G)+a.getZ(C),J=Math.hypot(V,te,oe)||1;a.setXYZ(G,V/J,te/J,oe/J),a.setXYZ(C,V/J,te/J,oe/J)}}const re=new i.Group;re.name=u?"pierced-tower":"karst-tower";const fe=u?k.makeRock(new i.Vector4(0,9,22,1)):k.rock;return re.add(new i.Mesh($,fe)),Ht(e,{object:re,M:k,rows:de,K:H,R:X,A:s,pos:ue,th:M,hCol:ae,uArc:Y,shoulders:I,sector:W,yAt:me,crownR:O,nCrown:T,pierced:u,zF:he,H:c,W:r,D:l,anchors:Q,noise:n,ox:v,oy:d,lipTrees:Math.round((t.lipTrees||0)*g)})}async function Ht(e,t){const{object:o,M:n,K:g,R:k,A:c,pos:r,th:l,uArc:u,shoulders:s,sector:y,crownR:v,nCrown:d,pierced:S,zF:A,H:W,W:I,D:x,anchors:q,noise:D,ox:f,oy:m,rows:w}=t,O=n.pal,T=O[3],_=[],N=[],h=[],M=[],B=[];let Y=0,ae=0;const F=()=>v[ae++%v.length],L=(k-1)*g,ne=3+.035*Math.min(I,x);let Z=0;for(let P=0;P<c;P++)Z+=r[(L+P)*3+1];Z/=c;const se=(P,H)=>{const X=r[(L+P)*3]*H,R=r[(L+P)*3+2]*H;return K(Z,r[(L+P)*3+1],Math.pow(H,1.5))+ne*(1-Math.pow(H,2.5))+2.8*D.n2(X*.028+f,R*.028+m)+1.3*D.n2(X*.085+m,R*.085+f)},de=[1.035,1,.93,.83,.71,.58,.44,.3,.16,.03];for(let P=0;P<de.length;P++){const H=de[P];for(let X=0;X<=c;X++){const R=X===c?0:X,U=r[(L+R)*3]*H,b=r[(L+R)*3+2]*H,j=P===0?r[(L+R)*3+1]-1.1:P===1?r[(L+R)*3+1]+.7:se(R,H),E=.75+.3*D.n2(U*.05+m,b*.05+f)+(P===0?-.3:0);_.push(U,j,b),N.push(0,1,0),h.push(T[0]*E,T[1]*E,T[2]*E),M.push(P===0?.5:.08,X*.7,1)}await e.yield()}for(let P=0;P<de.length-1;P++)for(let H=0;H<c;H++){const X=P*(c+1)+H,R=X+1,U=X+c+1,b=U+1;B.push(X,R,U,R,b,U)}Y=de.length*(c+1);const he=Y,me=B.length;await e.yield();const be=(P,H,X,R)=>{const U=F()*6.283,b=Math.cos(U),j=Math.sin(U),E=.7+.7*F(),Q=F()<.2?1:0,$=.55+.25*F(),re=F()*6.283;for(let fe=0;fe<Ye.length;fe+=3){const a=Ye[fe],p=Ye[fe+1],G=Ye[fe+2],C=a*b-G*j,V=a*j+G*b;_.push(P+C*R,H+p*R*$,X+V*R);const te=Math.hypot(C*.85,p*.8+.45,V*.85);N.push(C*.85/te,(p*.8+.45)/te,V*.85/te);const oe=E*(p<-.2?.45:.8+.35*p);h.push(K(T[0]*oe,.16*oe,Q*.5),K(T[1]*oe,.22*oe,Q*.5),K(T[2]*oe,.035*oe,Q*.5)),M.push(Math.max(0,p+.4),re,0),B.push(Y++)}};for(let P=0;P<d;P++){const H=Math.floor(F()*c),X=F()<.34,R=X?.9+.12*F():Math.sqrt(F())*.9,U=2.6+3*F()*F()+(X?0:.6);be(r[(L+H)*3]*R,se(H,Math.min(1,R))+U*(X?.05:.2),r[(L+H)*3+2]*R,U),P%12===11&&await e.yield()}for(const P of s){const H=w.findIndex(R=>R.t===P.t),X=H+1;for(let R=0;R<c;R++){if(y(l[R],P.th,P.span)<.5)continue;const U=1+(F()>.4?1:0);for(let b=0;b<U;b++){const j=.1+.8*F(),E=(H*g+R)*3,Q=(X*g+R)*3,$=1.8+2.2*F();be(K(r[E],r[Q],j),r[E+1]+$*.35,K(r[E+2],r[Q+2],j),$)}R%6===5&&await e.yield()}}await e.yield();const ue=t.lipTrees||0;if(ue){const P=[.085,.078,.062],H=(R,U,b,j,E,Q,$,re)=>{for(const[fe,a]of[[R,E],[U,Q],[b,$]])_.push(fe[0],fe[1],fe[2]),N.push(.2,.9,.2),h.push(j[0],j[1],j[2]),M.push(a,re,0),B.push(Y++)},X=s.map(R=>w.findIndex(U=>U.t===R.t));for(let R=0;R<ue;R++){let U=Math.floor(F()*c),b,j,E;const Q=F(),$=F()*6.283,re=s.length&&R%2?R%s.length:-1;if(re>=0){for(let Le=0;Le<12&&y(l[U],s[re].th,s[re].span)<.6;Le++)U=Math.floor(F()*c);const Re=(X[re]*g+U)*3;b=r[Re],j=r[Re+1],E=r[Re+2]}else b=r[(L+U)*3],j=r[(L+U)*3+1],E=r[(L+U)*3+2];const fe=Math.sin(l[U]),a=Math.cos(l[U]),p=a,G=-fe,C=Q<.3?1.6+F():5.5+5*F(),V=Q<.3?.2:.45+.5*F(),te=(F()-.5)*.5,oe=Q<.3?.5:.3;b-=fe*.8,E-=a*.8,j-=.4;const J=b+(fe*Math.sin(V)+p*te)*C,le=j+Math.cos(V)*C,ce=E+(a*Math.sin(V)+G*te)*C,we=[b+p*oe,j,E+G*oe],ke=[b-p*oe,j,E-G*oe],Se=[b+fe*oe,j,E+a*oe],ze=[J,le,ce];if(H(we,ke,ze,P,0,0,.5,$),H(ke,Se,ze,[P[0]*.7,P[1]*.7,P[2]*.7],0,0,.5,$),H(Se,we,ze,P,0,0,.5,$),Q>.62){be(J,le+.6,ce,2.2+1.6*F());continue}const ve=Q<.3?7:9,Me=Q<.3?2.4:3.3,Te=.8+.5*F(),Ve=[T[0]*1.5*Te+.012,T[1]*1.7*Te+.03,T[2]*1.1*Te];for(let Re=0;Re<ve;Re++){const Le=Re/ve*6.283+$,Ne=Math.cos(Le),_e=Math.sin(Le),$e=Q<.3?.9:.45+.5*F(),Fe=Me*.3,rt=J+Ne*Me,lt=le+$e*Me*.5-Me*.35,ct=ce+_e*Me,Oe=J+Ne*Me*.55,Ee=le+$e*Me*.55,Ge=ce+_e*Me*.55;H([J,le,ce],[Oe-_e*Fe,Ee,Ge+Ne*Fe],[Oe+_e*Fe,Ee,Ge-Ne*Fe],Ve,.5,.9,.9,$),H([Oe-_e*Fe,Ee,Ge+Ne*Fe],[rt,lt,ct],[Oe+_e*Fe,Ee,Ge-Ne*Fe],[Ve[0]*.75,Ve[1]*.8,Ve[2]*.75],.9,1.4,.9,$)}R%6===5&&await e.yield()}}await e.yield();const pe=new i.BufferGeometry;pe.setAttribute("position",new i.Float32BufferAttribute(_,3)),await e.yield(),pe.setAttribute("normal",new i.Float32BufferAttribute(N,3)),await e.yield(),pe.setAttribute("color",new i.Float32BufferAttribute(h,3)),await e.yield(),pe.setAttribute("aSw",new i.Float32BufferAttribute(M,3)),await e.yield(),pe.setIndex(B),await e.yield();{const P=new i.BufferGeometry;P.setAttribute("position",new i.Float32BufferAttribute(_.slice(0,he*3),3)),P.setIndex(B.slice(0,me)),await e.yield(),P.computeVertexNormals();const H=P.getAttribute("normal").array,X=pe.getAttribute("normal").array;for(let R=0;R<he*3;R+=3){const U=H[R+1]<0?-1:1;X[R]=H[R]*U,X[R+1]=H[R+1]*U,X[R+2]=H[R+2]*U}P.dispose()}await e.yield();const ye=new i.Mesh(pe,n.canopy);o.add(ye),await e.yield();{const P=[],H=[],X=[],R=[];for(let j=0;j<=c;j++){const E=j===c?0:j,Q=(2*g+E)*3,$=r[Q],re=r[Q+2],fe=Math.sin(l[E]),a=Math.cos(l[E]),p=S&&re>0&&Math.abs($)<12?0:1;P.push($-fe*1.6,.06,re-a*1.6,$+fe*7,.06,re+a*7),H.push(j===c?u[c]:u[E],0,j===c?u[c]:u[E],1),X.push(p,p)}for(let j=0;j<c;j++){const E=j*2;R.push(E,E+1,E+2,E+1,E+3,E+2)}const U=new i.BufferGeometry;U.setAttribute("position",new i.Float32BufferAttribute(P,3)),U.setAttribute("uv",new i.Float32BufferAttribute(H,2)),U.setAttribute("aOn",new i.Float32BufferAttribute(X,1)),U.setIndex(R);const b=new i.Mesh(U,n.slop);b.renderOrder=1,o.add(b)}await e.yield();const ee=n.uniforms;return{object:o,radius:Math.max(I,x)*.5,height:W+ne,center:z(0,W*.5,0),anchors:q,materials:n,uniforms:ee,ground:!0,groundY:0,update(P,H){ee.uTime.value=H},dispose(){}}}function Kt(e,t,o,n,g,k,c,r,l){const u=Math.hypot(o-e,n-t),s=Math.hypot(g-o,k-n),y=Math.hypot(c-g,r-k);if(s<1e-9||y<1e-9)return null;const v=(g-o)/s,d=(k-n)/s,S=(c-g)/y,A=(r-k)/y,W=u<1e-9?v:(o-e)/u,I=u<1e-9?d:(n-t)/u,x=W*d-I*v,q=v*A-d*S,D=Math.atan2(Math.abs(x),W*v+I*d),f=Math.atan2(Math.abs(q),v*S+d*A),m=l*Math.tan(D/2),w=l*Math.tan(f/2),O=x<0?-1:1,T=q<0?-1:1,_=u-m,N=s-m-w,h=y-w;if(!(_>-1e-9)||!(N>-1e-9)||!(h>-1e-9)||D>3.1||f>3.1)return null;const M=o-W*m,B=n-I*m,Y=M-I*O*l,ae=B+W*O*l,F=o+v*m,L=n+d*m,ne=g-v*w,Z=k-d*w,se=ne-d*T*l,de=Z+v*T*l,he=g+S*w,me=k+A*w,be=Math.max(0,_),ue=be+l*D,pe=ue+Math.max(0,N),ye=pe+l*f;return{x0:e,z0:t,x1:o,z1:n,x2:g,z2:k,x3:c,z3:r,rho:l,s1:be,s2:ue,s3:pe,s4:ye,len:ye+h,run:h,d0x:W,d0z:I,d1x:v,d1z:d,d2x:S,d2z:A,cAx:Y,cAz:ae,aA:Math.atan2(B-ae,M-Y),kA:O/l,cBx:se,cBz:de,aB:Math.atan2(Z-de,ne-se),kB:T/l,mx:F,mz:L,jx:he,jz:me,turn:D+f,tA:m}}function Ut(e,t,o){if(t<e.s1)o[0]=e.x0+e.d0x*t,o[1]=e.z0+e.d0z*t,o[2]=e.d0x,o[3]=e.d0z;else if(t<e.s2){const n=e.aA+e.kA*(t-e.s1),g=Math.cos(n),k=Math.sin(n),c=e.kA<0?-1:1;o[0]=e.cAx+g*e.rho,o[1]=e.cAz+k*e.rho,o[2]=-k*c,o[3]=g*c}else if(t<e.s3)o[0]=e.mx+e.d1x*(t-e.s2),o[1]=e.mz+e.d1z*(t-e.s2),o[2]=e.d1x,o[3]=e.d1z;else if(t<e.s4){const n=e.aB+e.kB*(t-e.s3),g=Math.cos(n),k=Math.sin(n),c=e.kB<0?-1:1;o[0]=e.cBx+g*e.rho,o[1]=e.cBz+k*e.rho,o[2]=-k*c,o[3]=g*c}else o[0]=e.jx+e.d2x*(t-e.s4),o[1]=e.jz+e.d2z*(t-e.s4),o[2]=e.d2x,o[3]=e.d2z;return o}const Xe=[.6,.5];function Yt(e,t,o){const n=[],g=[];for(let l=0;l<e;l++){const u=t.stray&&l%t.stray===0?3.2:1;n.push(o(),o(),o(),o()),g.push(o.gauss()*t.spread[0]*u,o.gauss()*t.spread[1]*u,o.gauss()*t.spread[2])}const k=new Float32Array(n),c=new Float32Array(g),r={across:0,up:0,down:0,along:0};for(let l=0;l<c.length;l+=3)r.across=Math.max(r.across,Math.abs(c[l])),r.up=Math.max(r.up,c[l+1]),r.down=Math.max(r.down,-c[l+1]),r.along=Math.max(r.along,Math.abs(c[l+2]));return{n:e,aA:k,aOff:c,reach:r,spread:t.spread}}const it=(e,t,o,n)=>Math.hypot(e/o,(t<0?1.9:1)*t/n);async function Xt(e,t,o,n,g,k,c,r){const l=t.object,u=l.children[0].geometry,s=u.getAttribute("position").array,y=u.getAttribute("uv").array,v=u.getAttribute("aCave").array,d=u.getAttribute("aRock").array,S=u.index.array;l.updateMatrixWorld(!0);const A=l.matrixWorld.elements,W=o.halfWidth,I=o.halfHeight,x=[0,0,0,0,0,0,0,0,0],q=h=>ie(.6,.95,h);let D=-1/0,f=1/0,m=1/0,w=1/0,O=0;const T=[],_=new Map;for(let h=0;h<S.length;h+=3){(O+=1)>=2048&&(O=0,await e.yield());for(let F=0;F<3;F++){const L=S[h+F]*3,ne=s[L],Z=s[L+1],se=s[L+2],de=A[0]*ne+A[4]*Z+A[8]*se+A[12]-n.x,he=A[1]*ne+A[5]*Z+A[9]*se+A[13]-n.y,me=A[2]*ne+A[6]*Z+A[10]*se+A[14]-n.z;x[F*3]=de*k-me*g,x[F*3+1]=he,x[F*3+2]=de*g+me*k}if(Math.min(x[0],x[3],x[6])>c.across||Math.max(x[0],x[3],x[6])<-c.across||Math.min(x[1],x[4],x[7])>c.up||Math.max(x[1],x[4],x[7])<-c.down||Math.min(x[2],x[5],x[8])>r||Math.max(x[2],x[5],x[8])<-r)continue;const M=S[h],B=S[h+1],Y=S[h+2],ae=Math.max(1,Math.ceil(2*Math.max(Math.hypot(x[3]-x[0],x[4]-x[1],x[5]-x[2]),Math.hypot(x[6]-x[0],x[7]-x[1],x[8]-x[2]),Math.hypot(x[6]-x[3],x[7]-x[4],x[8]-x[5]))));for(let F=0;F<=ae;F++)for(let L=0;L<=ae-F;L++){const ne=F/ae,Z=L/ae,se=1-ne-Z,de=se*x[0]+ne*x[3]+Z*x[6],he=se*x[1]+ne*x[4]+Z*x[7],me=se*x[2]+ne*x[5]+Z*x[8];if(Math.abs(de)>c.across||he>c.up||he<-c.down||Math.abs(me)>r)continue;const be=se*v[M*4]+ne*v[B*4]+Z*v[Y*4],ue=se*v[M*4+1]+ne*v[B*4+1]+Z*v[Y*4+1],pe=Math.max(1,se*v[M*4+2]+ne*v[B*4+2]+Z*v[Y*4+2]),ye=Math.max(1,se*v[M*4+3]+ne*v[B*4+3]+Z*v[Y*4+3]),ee=(se*y[M*2]+ne*y[B*2]+Z*y[Y*2]-be)/pe,P=(se*y[M*2+1]+ne*y[B*2+1]+Z*y[Y*2+1]-ue)/ye,H=(Math.floor(de)+512)*1024+Math.floor(he)+512;if(Math.hypot(ee,P<0?P*1.9:P)<1&&q(se*d[M*4+3]+ne*d[B*4+3]+Z*d[Y*4+3])>.5){const X=_.get(H);(X===void 0||me>X)&&_.set(H,me),me<w&&(w=me);continue}T.push(me,it(de,he,W,I),H)}O+=63}const N=h=>{const M=_.get(T[h+2]);return M===void 0||T[h]>M-1};for(let h=0;h<T.length;h+=3)N(h)&&(T[h]>D&&(D=T[h]),T[h+1]<f&&(f=T[h+1]));for(let h=0;h<T.length;h+=3)T[h]<w&&!N(h)&&T[h+1]<f&&-T[h]<m&&(m=-T[h]);return{lip:D,free:f,deep:m,back:-w,hw:W,hh:I}}const Vt=`
attribute vec4 aA; attribute vec3 aOff;
uniform float uTime; uniform float uRate; uniform float uSize; uniform float uFar; uniform float uNear; uniform float uDir; uniform float uIn;
uniform vec4 uLnA; uniform vec4 uLnB; uniform vec4 uLnC; uniform vec4 uLnD; uniform vec4 uLnE; uniform vec4 uS; uniform vec4 uLev; uniform vec4 uFun;
uniform vec3 uTk; uniform vec2 uTkL; uniform vec2 uBend;
varying float vShade; varying float vFade;
#include <fog_pars_vertex>
void main(){
  float t = fract(aA.x + uTime*uRate*(0.8 + 0.4*aA.w));
  float len = uLnE.w, rho = uLnE.z;
  float sl = (uDir > 0. ? t : 1. - t)*len + uDir*aOff.z;                      // the bird's own place: metres of line from the far end
  vec2 pl; vec2 tg;
  if (sl < uS.x) { tg = uLnA.xy; pl = uLev.xy + tg*sl; }                      // the first run
  else if (sl < uS.y) { float a = uLnB.z + uLnB.w*(sl - uS.x); vec2 e = vec2(cos(a), sin(a)); pl = uLnB.xy + e*rho; tg = vec2(-e.y, e.x)*sign(uLnB.w); }      // the first turn
  else if (sl < uS.z) { tg = uLnA.zw; pl = uLnD.xy + tg*(sl - uS.y); }        // the middle run
  else if (sl < uS.w) { float a = uLnC.z + uLnC.w*(sl - uS.z); vec2 e = vec2(cos(a), sin(a)); pl = uLnC.xy + e*rho; tg = vec2(-e.y, e.x)*sign(uLnC.w); }      // the second turn
  else { tg = uLnE.xy; pl = uLnD.zw + tg*(sl - uS.w); }                       // the last run, and on past the mouth's end
  float lv = clamp(sl/uS.w, 0., 1.);
  vec3 c = vec3(pl.x, uLev.z + uLev.w*(1. - lv*lv*(3. - 2.*lv)), pl.y);
  vec3 f = normalize(vec3(tg.x, -uLev.w*6.*lv*(1. - lv)/uS.w, tg.y))*uDir;
  vec3 s = normalize(cross(f, vec3(0., 1., 0.)) + vec3(1e-3, 0., 0.));
  vec3 u = cross(s, f);
  vec2 q = vec2(aOff.x, aOff.y*(aOff.y < 0. ? 1.9 : 1.))/uFun.zw;             // the funnel
  float q2 = dot(q, q);
  float fun = mix(1., inversesqrt(sqrt(1. + q2*q2)), 1. - smoothstep(uFun.x, uFun.y, len - sl));
  vec2 off = aOff.xy;
  vec2 qt = off/uTkL; float qt2 = dot(qt, qt);                                // the tuck
  off *= mix(1., inversesqrt(sqrt(1. + qt2*qt2)), smoothstep(uTk.x - uTk.z, uTk.x, sl)*(1. - smoothstep(uTk.y, uTk.y + uTk.z, sl)));
  float qa = max(0., off.x*sign(uLnB.w)*uDir)/uBend.x; qa *= qa;              // the inside of the first turn
  off.x *= mix(1., inversesqrt(sqrt(1. + qa*qa)), smoothstep(uS.x - uBend.y, uS.x, sl)*(1. - smoothstep(uS.y, uS.y + uBend.y, sl)));
  float qb = max(0., off.x*sign(uLnC.w)*uDir)/uBend.x; qb *= qb;              // the inside of the second
  off.x *= mix(1., inversesqrt(sqrt(1. + qb*qb)), smoothstep(uS.z - uBend.y, uS.z, sl)*(1. - smoothstep(uS.w, uS.w + uBend.y, sl)));
  c += (s*off.x + u*off.y) * fun;
  c += s*sin(uTime*1.3 + aA.y*40.)*${Xe[0].toFixed(1)} + u*sin(uTime*1.7 + aA.z*40.)*${Xe[1].toFixed(1)};
  float flap = sin(uTime*(9. + 6.*aA.w) + aA.y*60.);
  float sc = uSize * (0.75 + 0.5*aA.z);
  sc *= smoothstep(0., 0.04, t) * (1. - smoothstep(0.96, 1., t));
  sc *= step(sl, uIn);                                                        // (inside the rock, as deep as the tower is there: drawn no farther)
  float dEye = length(c - cameraPosition);
  sc *= mix(uNear, 1., smoothstep(6., 55., dEye));
  vFade = 1. - smoothstep(uFar*0.4, uFar, dEye);                             // a flock thins out with distance: birds near the eye, never pepper on a far wall
  float wx = abs(position.x);
  vec3 p = c + (s*position.x*(1. - 0.25*wx*abs(flap)) + f*position.z + u*(wx*0.45 + wx*wx*0.5)*flap) * sc;
  vShade = 0.55 + 0.45*flap*wx + 0.25*step(wx, 0.14);
  vec4 mvPosition = viewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ot=`
uniform vec3 uCol; uniform vec3 uRim;
varying float vShade; varying float vFade;
#include <fog_pars_fragment>
void main(){
  if (vFade < 0.02) discard;
  gl_FragColor = vec4(uCol*vShade + uRim*max(vShade - 0.7, 0.), vFade);
  #include <fog_fragment>
}`;function Jt(e){const t=e.line,o=e.funnel,n=e.tuck,g=e.bend,k=Math.min(e.flock.n,e.count===void 0?e.flock.n:e.count),c=Math.max(e.flock.spread[0]/o.hw,e.flock.spread[1]/o.hh,Math.min(1e3,o.free)*.875-it(Xe[0],-Xe[1],o.hw,o.hh)),r=Math.max(0,o.lip),l=Math.max(r+.001,o.head),u=o.deep<1e6?t.len+Math.max(o.deep-e.size,o.back>-1e6?o.back:-1e6):1e9,s=new i.InstancedBufferGeometry;s.index=e.base.index,s.setAttribute("position",e.base.getAttribute("position")),s.setAttribute("aA",new i.InstancedBufferAttribute(e.flock.aA.subarray(0,k*4),4)),s.setAttribute("aOff",new i.InstancedBufferAttribute(e.flock.aOff.subarray(0,k*3),3)),s.instanceCount=k;const y=new i.ShaderMaterial({vertexShader:Vt,fragmentShader:Ot,fog:!0,side:i.DoubleSide,transparent:!0,uniforms:{...i.UniformsUtils.clone(i.UniformsLib.fog),uTime:e.time,uFar:{value:e.far},uNear:{value:e.near},uRate:{value:e.rate},uSize:{value:e.size},uDir:{value:e.dir<0?-1:1},uIn:{value:u},uCol:{value:e.col},uRim:{value:e.rim},uLnA:{value:new i.Vector4(t.d0x,t.d0z,t.d1x,t.d1z)},uLnB:{value:new i.Vector4(t.cAx,t.cAz,t.aA,t.kA)},uLnC:{value:new i.Vector4(t.cBx,t.cBz,t.aB,t.kB)},uLnD:{value:new i.Vector4(t.mx,t.mz,t.jx,t.jz)},uLnE:{value:new i.Vector4(t.d2x,t.d2z,t.rho,t.len)},uS:{value:new i.Vector4(t.s1,t.s2,t.s3,t.s4)},uLev:{value:new i.Vector4(t.x0,t.z0,e.y,e.lift||0)},uFun:{value:new i.Vector4(r,l,o.hw*c,o.hh*c)},uTk:{value:new i.Vector3(n?n.from:1e6,n?n.to:1e6,n?n.ease:1)},uTkL:{value:new i.Vector2(n?n.across:1,n?n.up:1)},uBend:{value:new i.Vector2(g?g.lim:1e6,g?g.ease:1)}}}),v=new i.Mesh(s,y);return v.frustumCulled=!1,v.userData.swift={points:[new i.Vector3(t.x0,e.y+(e.lift||0),t.z0),new i.Vector3(t.x1,e.y,t.z1),new i.Vector3(t.x2,e.y,t.z2),new i.Vector3(t.x3,e.y,t.z3)],line:t,y:e.y,lift:e.lift||0,dir:e.dir<0?-1:1,lip:r,head:l,lim:c,cut:u,hw:o.hw,hh:o.hh,tuck:n||null,bend:g||null},v}export{Et as buildHero,Jt as buildSwiftlets,Gt as buildTower,Lt as makeTowerMaterials,it as swiftArch,Ut as swiftAt,Yt as swiftFlock,Kt as swiftLine,Xt as swiftMouth,Xe as swiftWob};
