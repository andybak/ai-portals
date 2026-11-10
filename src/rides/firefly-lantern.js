import*as t from"three";const T=Math.PI,J=T*2,$=200*T,h=(a,e,p)=>new t.Vector3(a,e,p),m0=a=>Math.min(1,Math.max(0,a)),I0=(a,e,p)=>{const l=m0((p-a)/(e-a));return l*l*(3-2*l)},b0=(a,e)=>a<=-e?0:a>=e?a:(a+e)*(a+e)/(4*e),g=(a=0,e=0,p=0,l=0,u=0,i=0,s=1,v=s,d=s)=>new t.Matrix4().compose(h(a,e,p),new t.Quaternion().setFromEuler(new t.Euler(l,u,i)),h(s,v,d)),g0=[h(.8,-1.12,-.5),h(.87,-.57,-.95),h(1.47,-.05,-1.52),h(1.8,.52,-1.74),h(1.77,.85,-1.77),h(1.62,.965,-1.77),h(1.45,.93,-1.77)],h0=g0[0],D=g0[g0.length-1],re=1.8,I=h(D.x,D.y-.07,D.z),B=.062;function j0(){const a=[],e=[],p=[],l=[],u=[],i=[],s=[],v=h(),d=h(),x=new t.Matrix3,N=new t.Matrix4;return{add(o,c,m,S={}){c=c||N;const n=o.attributes.position,r=o.attributes.normal;x.getNormalMatrix(c);for(const L of S.both?[1,-1]:[1]){const P=a.length/3;for(let f=0;f<n.count;f++){v.fromBufferAttribute(n,f).applyMatrix4(c),d.fromBufferAttribute(r,f).applyMatrix3(x).normalize().multiplyScalar(L),a.push(v.x,v.y,v.z),e.push(d.x,d.y,d.z);const C=typeof m=="function"?m(v,f):m;p.push(C.r,C.g,C.b),l.push(S.sw?S.sw(v):0),u.push(S.glow||0),i.push(S.metal||0)}const F=o.index?o.index.count:n.count,w=f=>P+(o.index?o.index.getX(f):f);for(let f=0;f<F;f+=3)L>0?s.push(w(f),w(f+1),w(f+2)):s.push(w(f),w(f+2),w(f+1))}o.dispose()},raw(o,c,m,S){const n=a.length/3;for(let r=0;r<o.length;r++)a.push(o[r]),e.push(c[r]),p.push(m[r]);for(let r=0;r<o.length/3;r++)l.push(0),u.push(0),i.push(0);for(const r of S)s.push(n+r)},build(o,c=.12,m=.03){const S=[];for(let r=0;r<a.length;r+=3){const L=o.x-a[r],P=o.y-a[r+1],F=o.z-a[r+2],w=L*L+P*P+F*F,f=Math.sqrt(w)||1,C=(e[r]*L+e[r+1]*P+e[r+2]*F)/f;S.push((c+(1-c)*Math.max(0,C))*m/(w+m))}const n=new t.BufferGeometry;return n.setAttribute("position",new t.Float32BufferAttribute(a,3)),n.setAttribute("normal",new t.Float32BufferAttribute(e,3)),n.setAttribute("color",new t.Float32BufferAttribute(p,3)),n.setAttribute("aSw",new t.Float32BufferAttribute(l,1)),n.setAttribute("aGlow",new t.Float32BufferAttribute(u,1)),n.setAttribute("aMetal",new t.Float32BufferAttribute(i,1)),n.setAttribute("aLamp",new t.Float32BufferAttribute(S,1)),n.setIndex(s),n}}}function O0(a,e,p,l){const u=new t.PlaneGeometry(a,e,4,p.length-1),i=u.attributes.position;for(let s=0;s<i.count;s++){const v=i.getX(s),d=.5-i.getY(s)/e;i.setZ(s,l*(.05*d*Math.sin(d*2.8)+.02*d*d)+9*v*v*(.4+d))}return u.computeVertexNormals(),u}const U0=["rrrrr","rrrrr",".....","..k..",".kkk.","..k..",".....",".kk..","..kk.",".....","..ss.","..ss.","....."],K0=["rrrrr",".....",".kkk.","..k..",".kkk.",".....","..k..",".ss..",".ss..","....."];function se(a,e,p){const l=new t.CatmullRomCurve3(g0,!1,"centripetal"),u=108,i=8,s=l.computeFrenetFrames(u,!1),v=[],d=[],x=[],N=[],o=h(),c=h(),m=new t.Color;let S=3,n=0,r=1,L=50;for(let y=0;y<=u;y++){const V=y/u;l.getPointAt(V,o);let H=.027-.0165*Math.pow(V,.8);const _=y===S;_&&(S+=6+Math.floor(p()*4),n++,r=.86+p()*.28);const l0=V>.15&&V<.31,c0=V>.96||Math.abs(y-L)<=1;_&&!l0&&(H*=1.2),(l0||c0)&&(H+=.0028+y%2*.0012),l0||c0?m.copy(e.cord).multiplyScalar(y%2?1:.62):(m.copy(e.bamboo).multiplyScalar(r*(.92+.16*(y*7%5)/5)),_?m.multiplyScalar(.42):(y===S-1||y+1===S)&&m.multiplyScalar(.8));for(let G=0;G<i;G++){const k=G/i*J,R=Math.cos(k),o0=Math.sin(k);c.copy(s.normals[y]).multiplyScalar(R).addScaledVector(s.binormals[y],o0),v.push(o.x+c.x*H,o.y+c.y*H,o.z+c.z*H),d.push(c.x,c.y,c.z);const Q=.93+.07*Math.sin(G*2.4+n*1.7);x.push(m.r*Q,m.g*Q,m.b*Q)}if(y<u)for(let G=0;G<i;G++){const k=y*i+G,R=y*i+(G+1)%i;N.push(k,R,k+i,R,R+i,k+i)}}a.raw(v,d,x,N),a.add(new t.CylinderGeometry(.0026,.0026,.06,5,1,!0),g(D.x,D.y-.032,D.z),e.cord),a.add(new t.TorusGeometry(.012,.0028,5,12),g(I.x,I.y,I.z,0,T/2,0),e.iron),a.add(new t.SphereGeometry(.012,8,6),g(D.x,D.y-.004,D.z),e.cord);const P=l.getPointAt(L/u),F=P.y-.012,w=y=>m0((F-y.y)/.42),f=P.x+.04,C=P.z+.035,z=F-.105,E=e.brass.clone().multiplyScalar(2.6),e0=e.brass.clone().multiplyScalar(.55);a.add(new t.CylinderGeometry(.0026,.0026,.075,5,3,!0),g(f,F-.037,C),e.cord,{sw:w}),a.add(new t.SphereGeometry(.04,14,8,0,J,0,T*.62),g(f,z,C,0,0,0,1,1.15,1),y=>y.y<z-.012?e.brass:y.y>z+.03?e0:e.brass.clone().multiplyScalar(1.3),{sw:w,metal:1}),a.add(new t.TorusGeometry(.0375,.0042,6,18),g(f,z-.019,C,T/2,0,0),E,{sw:w,metal:1}),a.add(new t.SphereGeometry(.009,6,5),g(f,z+.05,C),e.brass,{sw:w,metal:1}),a.add(new t.SphereGeometry(.011,8,6),g(f,z-.03,C),E,{sw:w,metal:1}),a.add(new t.CylinderGeometry(.002,.002,.06,4,2,!0),g(f,z-.066,C),e.cord,{sw:w});const i0=new t.Color("#c0271c"),r0=new t.Color("#3b2f29"),s0=e.paper.clone().multiplyScalar(1.05),t0=y=>(V,H)=>{const _=y[Math.floor(H/5)][H%5];return _==="r"?e.motif:_==="k"?r0:_==="s"?i0:s0},a0=z-.095;a.add(O0(.074,.24,U0,1),g(f,a0-.12,C,0,-.45,0),t0(U0),{sw:w,both:!0}),e.twoSlips&&a.add(O0(.05,.16,K0,-.8),g(f+.03,a0-.08,C-.03,0,.5,-.06),t0(K0),{sw:w,both:!0})}function le(a,e){const{H:p,R:l,ribs:u}=e,i=p/2,s=n=>B+(l-B)*Math.pow(Math.max(0,Math.cos(T*n/p)),e.shape),v=[],d=4;for(let n=0;n<=u*d;n++){const r=n/(u*d),L=-i+p*r,P=Math.sin(T*(r*u%1));v.push(new t.Vector2(s(L)*(1-.026*P*P),L))}a.add(new t.LatheGeometry(v,30),null,e.paper,{glow:1});for(const n of[1,-1]){const r=n*(i+.014);a.add(new t.CylinderGeometry(B+.005,B+.005,.034,22,1,!0),g(0,r,0),e.cap),a.add(new t.TorusGeometry(B+.0055,.003,5,22),g(0,r-n*.012,0,T/2,0,0),e.gilt,{metal:1}),a.add(new t.TorusGeometry(B+.004,.0034,5,22),g(0,r+n*.017,0,T/2,0,0),e.cap),a.add(new t.RingGeometry(B*.62,B+.005,22),g(0,r+n*.017,0,-n*T/2,0,0),e.cap),a.add(new t.CircleGeometry(B*.62,18),g(0,r+n*.012,0,-n*T/2,0,0),e.paper,{glow:2})}const x=i+.03,N=new t.CatmullRomCurve3([h(-B,x,0),h(-B*.92,x+.07,0),h(-.012,e.hang-.012,0),h(0,e.hang,0),h(.012,e.hang-.012,0),h(B*.92,x+.07,0),h(B,x,0)]);a.add(new t.TubeGeometry(N,22,.0026,5,!1),null,e.iron);for(const n of[1,-1])a.add(new t.SphereGeometry(.007,6,5),g(n*B,x-.004,0),e.gilt,{metal:1});const o=-i-.03,c=n=>m0((o-n.y)/.2);a.add(new t.CylinderGeometry(.002,.002,.05,5,2,!0),g(0,o-.02,0),e.tassel,{sw:c}),a.add(new t.SphereGeometry(.0135,10,8),g(0,o-.03,0),e.gilt,{sw:c,metal:1}),a.add(new t.SphereGeometry(.0105,8,6),g(0,o-.055,0,0,0,0,1,1.25,1),e.tassel,{sw:c}),a.add(new t.TorusGeometry(.0085,.0026,5,10),g(0,o-.07,0,T/2,0,0),e.gilt,{sw:c,metal:1});const m=e.tassel.clone().multiplyScalar(.6),S=new t.Color;a.add(new t.CylinderGeometry(.0085,.022,.13,14,5,!0),g(0,o-.135,0),(n,r)=>S.copy(r%2?e.tassel:m).multiplyScalar(.75+.25*m0((o-.07-n.y)/.12)),{sw:c})}function Y0(a,e,p,l){const u=new t.MeshStandardMaterial({vertexColors:!0,roughness:.72,metalness:0,side:l});return u.onBeforeCompile=i=>{Object.assign(i.uniforms,e),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
attribute float aSw; attribute float aGlow; attribute float aLamp; attribute float aMetal; uniform vec3 uLag; varying vec3 vLP; varying float vGlow; varying float vLamp; varying float vMetal;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vLP = position; vGlow = aGlow; vLamp = aLamp; vMetal = aMetal; transformed += uLag * (aSw * aSw);`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uGlowCol; uniform vec3 uMotifCol; uniform vec4 uPaper; uniform vec4 uDim; uniform vec2 uFly; uniform vec4 uKind; uniform float uSheen;
varying vec3 vLP; varying float vGlow; varying float vLamp; varying float vMetal;
float rstep(float a, float b, float x){ return 1.0 - smoothstep(b, a, x); }
float flHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float flNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(flHash(i), flHash(i + vec2(1., 0.)), f.x), mix(flHash(i + vec2(0., 1.)), flHash(i + vec2(1., 1.)), f.x), f.y); }`).replace("#include <color_fragment>",`#include <color_fragment>
float flPaper = step(0.5, vGlow) * step(vGlow, 1.5), flShade = 1.0;
if (flPaper > 0.5) {
  float yN = vLP.y / uDim.y, ang = atan(vLP.x, vLP.z), pm = 0.0;
  if (uDim.w < 0.5) {            // two dyed bands
    pm = rstep(0.03, 0.0, abs(abs(yN) - 0.74) - 0.085) * 0.85 + rstep(0.012, 0.0, abs(abs(yN) - 0.52) - 0.012) * 0.7;
  } else if (uDim.w < 1.5) {     // a crest on three sides, one of them toward the eye
    float da = mod(ang - uFly.y + 1.0472, 2.0944) - 1.0472;
    float d = length(vec2(da * uDim.x, vLP.y));
    pm = rstep(0.052, 0.046, d) * (1.0 - rstep(0.03, 0.026, length(vec2(da * uDim.x - 0.012, vLP.y - 0.01)))) * 0.85
       + rstep(0.005, 0.0, abs(d - 0.066) - 0.004) * 0.8;
  } else {                       // dipped in dye, with a scalloped tide line
    float yy = yN + 0.42 + 0.07 * abs(sin(ang * 4.5));
    pm = rstep(0.03, 0.0, yy) * 0.8 + rstep(0.015, 0.0, abs(yy - 0.13) - 0.014) * 0.7;
  }
  float fib = 0.86 + 0.2 * flNoise(vec2(ang * 34.0, vLP.y * 900.0)) * flNoise(vec2(ang * 9.0, vLP.y * 60.0) + 7.0);
  float seam = 0.82 + 0.18 * smoothstep(0.0, 0.03, abs(fract(ang / 6.2832 * 6.0 + 0.5) - 0.5));
  float pf = (yN * 0.5 + 0.5) * uDim.z, pw = fwidth(pf) * 0.75;
  float pleat = 0.8 + 0.2 * sin(3.1416 * fract(pf));
  // split-bamboo ribs at each pleat: a dark line whose edge is as wide as a pixel, so it never breaks up
  float rib = (1.0 - smoothstep(0.045 - pw, 0.045 + pw, abs(fract(pf + 0.5) - 0.5))) * step(abs(yN), 0.985);
  rib *= 0.045 / max(0.045, pw);
  flShade = fib * seam * pleat * (0.72 + 0.28 * (1.0 - yN * yN)) * (1.0 - 0.62 * rib);
  diffuseColor.rgb = mix(diffuseColor.rgb * (0.9 + 0.1 * fib), uMotifCol, pm) * (1.0 - 0.6 * rib);
}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.35, vMetal);`).replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
metalnessFactor = 0.6 * vMetal;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += diffuseColor.rgb * uGlowCol * vLamp * uPaper.w;
// gilt and brass: a little of the sky and of the lantern caught on the upper curve of the metal
totalEmissiveRadiance += diffuseColor.rgb * vMetal * uSheen * (0.5 + 0.5 * uGlowCol) * (0.25 + pow(clamp(normal.y * 0.5 + 0.5, 0.0, 1.0), 5.0) * 2.2);
if (flPaper > 0.5) {
  float g = 0.0, t = uFly.x, yN = vLP.y / uDim.y, ang = atan(vLP.x, vLP.z);
  if (uKind.x > 0.01) {          // fireflies: seven lights wandering about inside, each one blinking
    float a = 0.0;
    for (int i = 0; i < 7; i++) {
      float fi = float(i);
      vec3 q = vec3(sin(t * (0.41 + 0.13 * fi) + fi * 2.4), sin(t * (0.33 + 0.09 * fi) + fi * 4.1), cos(t * (0.37 + 0.11 * fi) + fi * 1.3));
      q *= vec3(uDim.x * 0.74, uDim.y * 0.7, uDim.x * 0.74);
      vec3 d = vLP - q;
      float blink = 0.35 + 0.65 * smoothstep(-0.2, 0.9, sin(t * (1.1 + 0.37 * fi) + fi * 5.0));
      a += blink * 0.0022 / (dot(d, d) + 0.0022);
    }
    g += a * uKind.x;
  }
  if (uKind.y > 0.01) {          // a flame: one light low on the axis, leaning and flickering
    float fl = 0.8 + 0.13 * sin(t * 61.0) * sin(t * 77.0) + 0.1 * sin(t * 5.3) * sin(t * 3.1);
    vec3 d = vLP - vec3(0.014 * sin(t * 2.3) * fl, -0.34 * uDim.y + 0.02 * fl, 0.014 * sin(t * 1.7 + 2.0));
    d.y *= 0.5;
    g += uKind.y * fl * (0.034 / (dot(d, d) + 0.011)) * (0.85 - 0.3 * yN);
  }
  if (uKind.z > 0.01) {          // a captured star: one steady core seen through the paper
    float face = abs(dot(normalize(vViewPosition), normal));
    g += uKind.z * (0.3 + 0.75 * pow(face, 3.0) + 1.1 * pow(face, 14.0)) * (0.8 + 0.2 * (1.0 - yN * yN)) * (0.96 + 0.04 * sin(t * 3.7));
  }
  if (uKind.w > 0.01) {          // glowing moss: slow blotches that breathe
    float n = flNoise(vec2(ang * 2.4 + 3.0, vLP.y * 15.0)) * 0.7 + flNoise(vec2(ang * 7.0, vLP.y * 44.0) + 11.0) * 0.3;
    g += uKind.w * (0.2 + 1.25 * smoothstep(0.32, 0.72, n) * (0.72 + 0.28 * sin(t * 0.62 + n * 9.0)));
  }
  totalEmissiveRadiance += diffuseColor.rgb * uGlowCol * (uPaper.x + uPaper.y * g) * flShade;
} else if (vGlow > 1.5) {
  totalEmissiveRadiance += uGlowCol * uPaper.z * (1.0 - 0.5 * smoothstep(0.4, 1.0, length(vLP.xz) / 0.04));
}`)},a(u),u.customProgramCacheKey=()=>"firefly-lantern-"+p,u}const ce=16,ue=10,fe=3;function de(a,e){const p=[3,1];for(let o=0;o<ce;o++)p.push(0);for(let o=0;o<ue;o++)p.push(4);for(let o=0;o<fe;o++)p.push(2);const l=p.length,u=new Float32Array(l*12),i=new Float32Array(l*16),s=new Float32Array(l*12),v=[];for(let o=0;o<l;o++){const c=[a(),a(),a(),a()];for(let m=0;m<4;m++)i.set(c,(o*4+m)*4),s.set([m%2?1:-1,m<2?-1:1,p[o]],(o*4+m)*3);v.push(o*4,o*4+1,o*4+2,o*4+2,o*4+1,o*4+3)}const d=new t.BufferGeometry;d.setAttribute("position",new t.BufferAttribute(u,3)),d.setAttribute("aSeed",new t.BufferAttribute(i,4)),d.setAttribute("aCor",new t.BufferAttribute(s,3)),d.setIndex(v);const x=new t.ShaderMaterial({uniforms:e,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,vertexShader:`
#define W(f) (floor((f) * 100.0 + 0.5) * 0.01)
attribute vec4 aSeed; attribute vec3 aCor;
uniform vec3 uC; uniform vec3 uTrail; uniform vec4 uAnim; // time, orbit phase, burst, presence
uniform vec4 uMode;                                        // bubbles, star, half height of the lantern, -
varying vec2 vQ; varying float vKind; varying float vB;
void main(){
  float t = uAnim.x, kind = aCor.z; vec3 o = vec3(0.0); float size = 0.5; vB = 1.0; vKind = kind;
  if (kind < 0.5 || kind > 3.5) {
    if (kind > 3.5 && uMode.x > 0.5) {   // a bubble: wobbling up out of the lantern's mouth, swelling as it rises
      float ph = fract(aSeed.x + t * W(0.9 + 0.8 * aSeed.y) / 6.2831853);
      float wob = t * W(1.6 + 1.5 * aSeed.z) + aSeed.w * 20.0;
      o = vec3(sin(wob), 0.0, cos(wob * 0.8 + 1.0)) * (0.02 + 0.06 * ph) + vec3((aSeed.y - 0.5) * 0.16 * ph - 0.05 * ph, uMode.z + 0.02 + ph * 0.62, 0.0);
      o += uTrail * ph * 1.5;
      vB = smoothstep(0.0, 0.06, ph) * (1.0 - smoothstep(0.7, 1.0, ph)) * (2.0 * uMode.x - 1.0);
      size = (0.018 + 0.03 * aSeed.z) * (0.6 + 0.8 * ph) * uAnim.w;
      vKind = 4.0;
    } else {                             // a firefly: a lazy orbit that wanders, pulsing
      float dir = aSeed.w > 0.5 ? 1.0 : -1.0, stray = step(0.8, aSeed.x);
      float ang = aSeed.x * 6.2832 + uAnim.y * W(0.22 + 0.5 * aSeed.y) * dir;
      float rad = mix(0.15 + 0.4 * aSeed.z, 0.58 + 0.24 * aSeed.z, stray) * (1.0 + uAnim.z * (0.5 + aSeed.y));
      o = vec3(cos(ang) * rad * 0.6 + 0.04, (aSeed.w - 0.5) * 0.8 + 0.1 * sin(t * W(0.5 + aSeed.z) + aSeed.x * 40.0), sin(ang) * rad);
      o += 0.035 * vec3(sin(t * 1.7 + aSeed.y * 30.0), sin(t * 2.3 + aSeed.z * 30.0), cos(t * 1.9 + aSeed.x * 30.0));
      o += uTrail * (0.35 + aSeed.z) * (0.6 + 0.4 * sin(t * 0.9 + aSeed.w * 20.0));
      vB = 0.3 + 0.9 * smoothstep(-0.3, 1.0, sin(t * W(0.9 + 1.4 * aSeed.y) + aSeed.w * 30.0));
      if (kind > 3.5) vB *= 1.0 - 2.0 * uMode.x;
      size = (0.04 + 0.03 * aSeed.z) * uAnim.w;
      vKind = 0.0;
    }
  } else if (kind > 1.5 && kind < 2.5) { // a moth, battering round the paper
    float ang = aSeed.x * 6.2832 + t * W(1.6 + aSeed.y) + 0.8 * sin(t * 2.7 + aSeed.z * 9.0);
    float rad = 0.23 + 0.06 * sin(t * 3.1 + aSeed.w * 12.0);
    o = vec3(cos(ang) * rad * 0.7, (aSeed.y - 0.5) * 0.34 + 0.07 * sin(t * 2.1 + aSeed.x * 20.0), sin(ang) * rad) + uTrail * 0.3;
    size = 0.036 * uAnim.w * (1.0 - uMode.x);   // no moths under water
  } else if (kind > 2.5) { size = 1.4 * uAnim.w; }
  else { size = 0.62 * uAnim.w; }
  vec4 mv = modelViewMatrix * vec4(uC + o, 1.0);
  vec2 q = aCor.xy;
  if (kind > 1.5 && kind < 2.5) q.x *= 0.3 + 0.7 * abs(sin(t * 31.0 + aSeed.w * 6.0));    // wing beats
  if (kind > 0.5 && kind < 1.5) mv.xyz += normalize(-mv.xyz) * 0.2;   // the halo sits in front of the lantern
  mv.xy += q * size;
  vQ = aCor.xy;
  gl_Position = projectionMatrix * mv;
}`,fragmentShader:`
uniform vec3 uCol; uniform vec3 uHaloCol; uniform vec4 uK; // firefly gain, halo gain, moth gain, flicker
uniform vec4 uMode;
varying vec2 vQ; varying float vKind; varying float vB;
float rstep(float a, float b, float x){ return 1.0 - smoothstep(b, a, x); }
void main(){
  float r = length(vQ); vec3 c;
  if (vKind < 0.5) c = uCol * uK.x * vB * (exp(-r * r * 26.0) * 3.2 + exp(-r * r * 5.0) * 0.3) * rstep(1.0, 0.7, r);
  else if (vKind > 3.5) {       // bubble: a bright rim, a faint body and a glint
    float rim = rstep(0.2, 0.03, abs(r - 0.76)), gl = rstep(0.22, 0.05, length(vQ - vec2(-0.32, 0.36)));
    c = (uHaloCol * 0.6 + 0.4) * vB * (rim * 1.5 + gl * 2.2 + 0.14 * rstep(0.8, 0.6, r)) * (0.7 + 0.4 * uK.x);
  } else if (vKind > 2.5) {     // the wide, faint pool of light
    c = uHaloCol * uK.y * uK.w * 0.3 * pow(max(0.0, 1.0 - r), 3.0);
  } else if (vKind > 1.5) {     // moth: two pale wings and a body
    float w = rstep(1.0, 0.7, length(vec2(abs(vQ.x) - 0.45, vQ.y * 1.2)) * 1.9) + rstep(0.3, 0.1, length(vec2(vQ.x * 3.0, vQ.y)));
    c = (uHaloCol * 0.5 + vec3(0.5, 0.42, 0.3)) * uK.z * min(1.0, w);
  } else {                      // the halo, with a four-pointed glint when the lantern holds a star
    float a = pow(max(0.0, 1.0 - r), 2.6) + 1.4 * pow(max(0.0, 1.0 - r * 2.6), 2.0);
    vec2 s = abs(vQ);
    float glint = (exp(-s.y * 70.0) * exp(-s.x * 3.5) + exp(-s.x * 70.0) * exp(-s.y * 3.5)) * (1.0 - smoothstep(0.6, 1.0, max(s.x, s.y)));
    c = uHaloCol * uK.y * uK.w * a + (uHaloCol * 0.5 + 0.5) * uMode.y * glint * (0.7 + 0.9 * uK.y);
  }
  gl_FragColor = vec4(max(c, 0.0), 1.0);
}`}),N=new t.Mesh(d,x);return N.renderOrder=3,N.frustumCulled=!1,N}const pe=[["#efdcb2","#15110e","#b3261e","#a8241d","#7a1f1a"],["#e9cfa6","#2c1a10","#d6a02e","#27405f","#2a3f5c"],["#f0e5cc","#0f1417","#2e6b5c","#2a6656","#b9975a"],["#f0c0a4","#1a1210","#eadcb8","#8e1f2a","#8e1f2a"],["#e8e2d2","#1b1620","#6a3f8a","#4a3470","#c0a060"]],me=[[.36,.15,.62,12],[.44,.118,.42,15],[.3,.158,.8,10]],X0=["fireflies","flame","star","moss"],Z0={fireflies:["#d6f25a","#ffbe5c"],flame:["#ffc070","#ffa248"],star:["#bcdcff","#a6c6ff"],moss:["#74f7c0","#8ef0c4"]};var he={id:"firefly-lantern",name:"Firefly Lantern",media:["air","interior","tiny","snow","underwater"],near:.7,gaze:.94,stow:[1.3,-2.7,.5],async build(a){const{rng:e,lit:p}=a,l=(b,O=1)=>new t.Color(b).multiplyScalar(O),u=e.pick(pe),i=e.pick(me),s={paper:l(u[0],.62),cap:l(u[1]),tassel:l(u[2]),motif:l(u[3]),cord:l(u[4]),gilt:l("#d8a844"),brass:l("#c08f38"),iron:l("#23252a"),bamboo:l(e.pick(["#c2a566","#98a252","#7a5632","#b8964a"])),H:i[0],R:i[1],shape:i[2],ribs:i[3],hang:i[0]/2+.2,twoSlips:e.chance(.6),motifKind:Math.floor(e()*3)},v=h(I.x,I.y-s.hang,I.z),d={};for(const b of X0)d[b]=[l(Z0[b][0]),l(Z0[b][1])];const x={uGlowCol:{value:d.fireflies[1].clone()},uMotifCol:{value:s.motif.clone()},uPaper:{value:new t.Vector4(.7,2.6,3,2)},uDim:{value:new t.Vector4(s.R,s.H/2,s.ribs,s.motifKind)},uFly:{value:new t.Vector2(0,Math.atan2(-v.x,-v.z))},uKind:{value:new t.Vector4(1,0,0,0)},uSheen:{value:.25}},N={...x,uLag:{value:h(0,0,0)}},o={...x,uLag:{value:h(0,0,0)}},c={uC:{value:v.clone()},uTrail:{value:h(0,0,0)},uAnim:{value:new t.Vector4(0,0,0,1)},uMode:{value:new t.Vector4(0,0,s.H/2,0)},uCol:{value:d.fireflies[0].clone()},uHaloCol:{value:d.fireflies[1].clone()},uK:{value:new t.Vector4(2,.4,.5,1)}},m=j0();se(m,s,e);const S=new t.Mesh(m.build(v,.35,.3),Y0(p,N,"pole",t.FrontSide));await a.yield();const n=j0();le(n,s);const r=new t.Mesh(n.build(h(0,0,0),.3),Y0(p,o,"paper",t.DoubleSide));r.position.y=-s.hang;const L=de(e,c);S.frustumCulled=!1,r.frustumCulled=!1;const P=new t.Group,F=new t.Group,w=new t.Group,f=new t.Group,C=new t.Group;w.position.copy(h0),f.position.copy(h0).negate(),C.position.copy(I),C.add(r),f.add(S,C,L),w.add(f),F.add(w),P.add(F);const z=e()*J,E=e()*J,e0=e()*J,i0=e()*J,r0={x:0,v:0},s0={x:0,v:0},t0={x:0,v:0},a0=(b,O,A,U,K)=>{b.v+=((O-b.x)*A*A-b.v*U)*K,b.x+=b.v*K},y=new t.Color,V=new t.Color,H=new t.Color("#9fd0ff"),_=new t.Euler,l0=h(0,0,0),c0=new t.Quaternion,G=h(0,0,0),k=[1,0,0,0];let R=!0,o0=-1,Q=0,x0=0,M0="",z0=null,k0=0,v0=0,u0=e()*40,f0=e()*40;const j=J*1.8,P0=Math.asin(Math.min(.6,Math.max(.05,(re-D.x-s.R-.085)/s.hang)));return{object:P,update(b,O,A){b=Math.min(Math.max(b||0,0),.05);const U=A.speed||0,K=A.turn||0,n0=A.crossing||0,G0=A.prev?Math.exp(-(A.entered||0)*.8):0,Y=A.world||{};let d0=R?0:Y===z0?O-k0:b;Math.abs(d0)<3600||(d0=b),R&&(v0=O),z0=Y,k0=O,v0+=d0,u0=(u0+d0*(1+1.2*n0+2*G0))%$,u0<0&&(u0+=$),f0=(f0+d0*(1+.8*n0))%$,f0<0&&(f0+=$);const M=v0,J0=(v0%$+$)%$;o0<0&&(o0=U),b>0&&(Q+=((U-o0)/b-Q)*Math.min(1,b*3)),o0=U;const X=Math.min(U,30)/30,$0=.55+.45*Math.min(1,U*.08),ee=I0(.55,.9,Math.sin(M*.11+i0));x0+=(ee-x0)*Math.min(1,b*1.5+(R?1:0));const Z=$0*(1-.75*x0),te=.02*Z*(Math.abs(Math.sin(M*j*.5+z))-.6),ae=.012*Z*Math.sin(M*j*.5+z);a0(t0,K*.16,2.2,3,b);const A0=.012*Z*Math.sin(M*j+z+.9)+.006*Math.sin(M*.43+E)-Q*.002,L0=t0.x*.6+.01*Z*Math.sin(M*j*.5+z-.5)+.005*Math.sin(M*.31+e0);w.position.set(h0.x+ae,h0.y+te,h0.z),w.rotation.set(A0,t0.x*.25,L0);const p0=A.camera;let B0=0,N0=0;if(p0&&p0.projectionMatrix&&(c0.copy(p0.quaternion).invert().multiply(P.quaternion),G.copy(v).applyQuaternion(c0),G.z<-.2)){const q=p0.projectionMatrix.elements[0]||.94,E0=p0.projectionMatrix.elements[5]||1.66,Q0=Math.atan2(G.x,-G.z),W0=Math.atan(.86/q),oe=Math.min(Math.atan(.72/q),W0-.07);B0=b0(Q0-W0,.02)-b0(oe-Q0,.02);const q0=Math.atan2(G.y,-G.z),ne=Math.atan(.6/E0),ie=Math.atan(.2/E0);N0=b0(ie-q0,.02)-b0(q0-ne,.02)}F.rotation.set(N0,B0,0),a0(r0,-X*.16-Q*.01,5.2,.9,b),a0(s0,-K*.35,5,.9,b);const F0=r0.x+.05*Z*Math.sin(M*j-1.4+z)+.02*Math.sin(M*1.13+E),H0=s0.x+.065*Z*Math.sin(M*j*.5-1.2+z)+.02*Math.sin(M*.87+e0);let y0=H0-L0;y0>0&&(y0=P0*Math.tanh(y0/P0)),C.rotation.set(F0-A0,.12*Math.sin(M*.37+i0)+.04*Math.sin(M*1.3+E),y0),_.copy(C.rotation),c.uC.value.copy(l0.set(0,-s.hang,0).applyEuler(_)).add(I),o.uLag.value.set(.018*Math.sin(M*2.3+e0)-s0.v*.03+H0*.1,0,.018*Math.sin(M*1.9+z)+X*.05-r0.v*.03-F0*.1);const T0=.3+X;N.uLag.value.set(.03*T0*Math.sin(M*5.3+E)+.014*Math.sin(M*1.4+i0)-K*.08,X*.02,.03*T0*Math.sin(M*4.1+e0)+X*.1+.02*Z*Math.sin(M*j+z));const S0=A.light,w0=Y.media||[],R0=Y.id||"",_0=w0.includes("underwater")||Y.category==="ocean"&&/kelp|reef|abyss|deep|under|trench/.test(R0)?3:w0.includes("space")||w0.includes("snow")||/orbit|aurora|ice|snow|frost|glacier|moon/.test(R0)?2:Y.category==="interior"||Y.category==="domestic"||w0.includes("interior")?1:0,D0=d[X0[_0]];A.portalColor&&A.portalColor!==M0&&(M0=A.portalColor,H.set(M0)),y.copy(D0[0]).lerp(H,.5*n0),V.copy(D0[1]).lerp(H,.25*n0);const C0=R?1:1-Math.exp(-b*1.2);c.uCol.value.lerp(y,C0),c.uHaloCol.value.lerp(V,C0),x.uGlowCol.value.copy(c.uHaloCol.value);for(let q=0;q<4;q++)k[q]+=((q===_0?1:0)-k[q])*C0;x.uKind.value.set(k[0],k[1],k[2],k[3]),c.uMode.value.set(k[3],k[2],s.H/2,0);const W=S0&&S0.has?1-m0(S0.level/1.1):.55,V0=.92+.08*Math.sin(M*3.1+z)*Math.sin(M*1.7+E)*(1-k[2]);x.uFly.value.x=f0,x.uPaper.value.set(.6+.3*W,(2.4+.8*W)*V0,1.8+2.4*W,.6+2*W),x.uSheen.value=.14+.26*(1-W),c.uAnim.value.set(J0,u0,G0+.25*n0,I0(.3,1,A.presence??1)),c.uTrail.value.set(-K*.25,.04*X,.3*X+.05),c.uK.value.set(1.3+1.5*W,(.16+.54*W)*(1+.5*n0)*(1-.5*k[2]),.3+.5*W,V0),R=!1},dispose(){}}}};export{he as default};
