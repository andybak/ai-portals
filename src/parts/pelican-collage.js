import*as f from"three";const We=["#FDFBF3","#F7A65E","#2FA8C9","#8CC63F","#E8C65A","#1E7F86","#DFA233"],Ae=Math.PI*2,ae=o=>new f.Color(o),q=(o,M,e)=>o.clone().lerp(M,e);async function qe(o,M){const r=new Float32Array(16384);for(let R=0;R<r.length;R++)r[R]=o();const C=(R,x,i,l,y)=>{const v=R*i,m=x*l,b=Math.floor(v),z=Math.floor(m);let w=v-b,g=m-z;w=w*w*(3-2*w),g=g*g*(3-2*g);const P=(b%i+i)%i,X=(P+1)%i,I=(z%l+l)%l,oe=(I+1)%l,J=(j,$)=>r[(($*7+y*13)%64*64+(j*3+y*29+$*11)%64)*4+(y&3)];return(J(P,I)*(1-w)+J(X,I)*w)*(1-g)+(J(P,oe)*(1-w)+J(X,oe)*w)*g},_=new Uint8Array(256*256*4);for(let R=0;R<256;R++){M&&(R&3)===0&&await M();for(let x=0;x<256;x++){const i=x/256,l=R/256,y=(R*256+x)*4,v=.5*C(i,l,7,7,0)+.28*C(i,l,17,17,1)+.22*C(i,l,41,41,2),m=.55*C(i,l,9,61,3)+.45*C(i,l,53,13,4),b=.5*C(i,l,3,37,5)+.3*C(i,l,5,59,6)+.2*C(i,l,11,11,7),z=.6*C(i,l,4,4,8)+.4*C(i,l,9,9,9);_[y]=v*255,_[y+1]=m*255,_[y+2]=b*255,_[y+3]=z*255}}const Q=new f.DataTexture(_,256,256,f.RGBAFormat);return Q.wrapS=Q.wrapT=f.RepeatWrapping,Q.minFilter=f.LinearMipmapLinearFilter,Q.magFilter=f.LinearFilter,Q.generateMipmaps=!0,Q.needsUpdate=!0,Q}function Ue(){return{pos:[],dat:[],col:[],idx:[],n:0}}function ee(o,M,e){const A=e.S,r=e.K,C=e.len,_=e.curl??0,Q=e.up??1,R=e.shift??0,x=e.org??[0,0,0],i=e.hwRef??Math.max(e.hw(.25),e.hw(.5),e.hw(.75)),l=o.n,y=(M*.37+(e.uvo??0))%1,v=Math.min(_/2,Math.PI/2),m=e.tear??1;for(let b=0;b<=A;b++){const z=b/A,w=Math.max(e.hw(z),5e-4),g=z*C*(e.zdir??1),P=e.bend?e.bend(z):0;for(let X=0;X<r;X++){const I=X/(r-1)*2-1,oe=I+R;let J,j;if(_<.05)J=oe*w,j=0;else{const F=w/Math.sin(v),D=I*_/2;J=F*Math.sin(D)+R*w,j=Q*(F*Math.cos(D)-(_<Math.PI?F*Math.cos(v):0))}j+=P,e.axis==="x"?o.pos.push(x[0]+g,x[1]+j,x[2]+J):o.pos.push(x[0]+J,x[1]+j,x[2]+g);let $=1-Math.abs(I);e.endA!==!1&&($=Math.min($,z*C/i)),e.endB!==!1&&($=Math.min($,(1-z)*C/i)),$=$*m+(1-m)*Math.min(1,$*4);const B=_<.05?w:w/Math.sin(v)*(_/2);o.dat.push(I*B/.6+y,z*C/.6+y*1.7,$,M);const d=e.col(z,I);o.col.push(d.r,d.g,d.b)}}for(let b=0;b<A;b++)for(let z=0;z<r-1;z++){const w=l+b*r+z,g=w+1,P=w+r,X=P+1;o.idx.push(w,P,g,g,P,X)}o.n+=(A+1)*r}function Ve(o){const M=new f.BufferGeometry;return M.setAttribute("position",new f.Float32BufferAttribute(o.pos,3)),M.setAttribute("aData",new f.Float32BufferAttribute(o.dat,4)),M.setAttribute("color",new f.Float32BufferAttribute(o.col,3)),M.setIndex(o.idx),M}const Z={L1:.62,L2:.82,SH:[.17,.4,.16],H1:[0,.4,.34],LN1:.36,LN2:.34,LH:.2,LB:.44};function Me(o,M){const e=Ue(),A=!M,r=Math.sin,C=Math.PI,_=i=>()=>i,Q=(i,l,y)=>{const v=Math.min(1,Math.max(0,(y-i)/(l-i)));return v*v*(3-2*v)};ee(e,0,{S:A?6:4,K:A?7:5,len:.97,org:[0,.22,-.55],curl:4.2,up:-1,hw:i=>.25*Math.pow(r(C*(.07+.88*i)),.6),bend:i=>.06*(2*i-1)*(2*i-1),col:(i,l)=>{const y=q(o.white,o.flush,.25+.55*(1-Math.abs(l))*(1-.5*i));return o.breast?y.lerp(o.breast,.8*Q(.42,.9,i)*(1-.45*Math.abs(l))):y},tear:.6}),ee(e,1,{S:A?5:3,K:A?5:3,len:.86,org:[0,.3,-.5],curl:2.6,up:1,hw:i=>.235*Math.pow(r(C*(.09+.85*i)),.7),col:o.back?_(o.back):i=>q(o.white,o.cream,.5*i)}),ee(e,2,{S:2,K:3,len:.34,org:[0,.34,-.46],zdir:-1,curl:1.2,up:1,endA:!1,hw:i=>.09+.09*i,bend:i=>.1*i,col:_(o.tail??q(o.white,o.flush,.2))});for(const i of[3,5]){const l=A?4:2,y=A?4:3;ee(e,i,{S:l,K:3,len:Z.L1,axis:"x",org:[0,-.012,0],shift:-1.25,curl:.3,up:1,endA:!1,endB:!1,hw:v=>.15+.02*r(C*v),col:_(o.ink),uvo:.3,tear:.7}),ee(e,i,{S:l,K:3,len:Z.L1+.03,axis:"x",shift:.12,curl:.5,up:1,endA:!1,endB:!1,hw:v=>.165+.02*r(C*v),col:(v,m)=>q(o.white,o.cream,.5-.5*m),tear:.7}),A&&o.shadow&&ee(e,i+.25,{S:l,K:3,len:Z.L1+.02,axis:"x",org:[0,-.006,0],shift:-.62,curl:.3,up:1,endA:!1,endB:!1,hw:v=>.2+.015*r(C*v),col:_(o.shadow),uvo:.45,tear:.8}),ee(e,i+1,{S:y,K:3,len:Z.L2,axis:"x",org:[0,-.012,0],shift:-.75,curl:.3,up:1,endA:!1,hw:v=>.2*(1-.72*v*v),col:_(o.ink),uvo:.6,tear:.7}),ee(e,i+1,{S:y,K:3,len:Z.L2*.72,axis:"x",shift:.55,curl:.4,up:1,endA:!1,hw:v=>.1*(1-.8*v),col:_(o.white),tear:.7})}if(ee(e,7,{S:A?3:2,K:A?5:4,len:Z.LN1+.03,curl:4.7,up:-1,endA:!1,endB:!1,hw:i=>.105-.02*i,col:i=>q(o.breast??o.flush,o.white,.4+.6*i),tear:.4}),ee(e,8,{S:A?3:2,K:A?5:4,len:Z.LN2+.03,curl:4.7,up:-1,endA:!1,endB:!1,hw:i=>.086-.012*i,col:_(o.white),uvo:.2,tear:.4}),ee(e,9,{S:A?4:2,K:A?5:4,len:Z.LH+.04,org:[0,0,-.04],curl:4.9,up:1,endB:!1,hw:i=>.072+.036*r(C*Math.min(1,i*1.15)),col:i=>i>.6?o.face:q(o.white,o.face,i>.4?.5:0),tear:.5}),ee(e,10,{S:A?6:2,K:3,len:Z.LB,curl:1.5,up:1,endA:!1,hwRef:.12,hw:i=>.052-.028*i,col:(i,l)=>i>.85?o.nail??o.pouch:o.ridge&&Math.abs(l)<.5?o.ridge:q(o.bill,o.face,.25*(1-i)+(o.ridge?.2:0)),tear:.4}),ee(e,11,{S:A?4:2,K:A?5:3,len:Z.LB-.02,org:[0,-.012,0],curl:3.5,up:-1,endA:!1,hwRef:.12,hw:i=>.044-.024*i,col:(i,l)=>q(o.pouch,o.pouchDeep,.6*Math.abs(l)),tear:.4}),A){for(const i of[12,13])ee(e,i,{S:2,K:3,len:.24,endA:!1,hw:l=>.022+.06*l,col:_(o.pouchDeep),hwRef:.1,tear:.5});for(let i=0;i<3;i++){const l=e.n,y=.1+.11*i,v=(i-1)*.03,m=.022-.004*i,b=1-.22*i;for(let z=0;z<=2;z++)for(let w=0;w<3;w++){const g=z/2,P=w-1;e.pos.push(v+P*m*(1-.5*g),-g*b,y),e.dat.push(P*.05+i*.31,g*.5+i*.17,Math.min(1-Math.abs(P),z===2?0:1),14),e.col.push(o.white.r,o.white.g,o.white.b)}for(let z=0;z<2;z++)for(let w=0;w<2;w++){const g=l+z*3+w;e.idx.push(g,g+3,g+1,g+1,g+3,g+4)}e.n+=9}for(const i of[-1,1]){const l=e.n,y=4;for(let v=0;v<=y;v++)for(let m=0;m<3;m++){const b=v/y,z=m-1,w=.02+.06*b,g=i*(.22+.5*b),P=.15-2*b;e.pos.push(g+z*w*.96,.03,P+z*w*.28*i),e.dat.push(z*w/.6+(i>0?.43:.11),b*4.8,Math.min(1-Math.abs(z),b*6,(1-b)*3),15),e.col.push(o.white.r,o.white.g,o.white.b)}for(let v=0;v<y;v++)for(let m=0;m<2;m++){const b=l+v*3+m;e.idx.push(b,b+3,b+1,b+1,b+3,b+4)}e.n+=(y+1)*3}}return Ve(e)}const pe=`
uniform sampler2D uPaper;
uniform vec3 uWhite, uTint, uHaze;
// Tears the rim (edge 0 at the rim .. 1 on the centre line), paints the deckle, streaks and fibre.
// puv is in tiles (0.6 m of paper per tile); tearAmp fades with distance; deckle 0 for shadow sheets.
vec4 paperSheet(vec3 col, vec2 puv, float edge, float tearAmp, float seed, float deckle) {
  float ang = fract(seed * 7.31) * 6.2832;
  vec2 ruv = mat2(cos(ang), sin(ang), -sin(ang), cos(ang)) * puv;
  vec4 nA = texture2D(uPaper, puv * 0.9 + vec2(seed, seed * 1.7));
  vec4 nB = texture2D(uPaper, ruv * vec2(0.7, 0.7) + vec2(seed * 3.1, 0.37));
  float th = 0.05 + 0.46 * nA.r * tearAmp;
  float aa = fwidth(edge) + 1e-4;
  float alpha = clamp((edge - th) / aa + 0.5, 0.0, 1.0);
  float dk = (1.0 - smoothstep(th + 0.04, th + 0.13 + aa, edge)) * deckle;
  col *= 0.9 + 0.14 * nB.b + 0.08 * (nB.a - 0.5);
  col = mix(col, col * vec3(0.8, 0.85, 1.0), (1.0 - smoothstep(0.3, 0.62, nB.b)) * 0.55);   // cool watercolour streaks, never grey
  col *= 1.0 + 0.09 * (vec3(fract(seed * 3.7), fract(seed * 5.3), fract(seed * 9.1)) - 0.5);
  col += (nA.g - 0.5) * 0.05;
  col = mix(col, uWhite * (0.9 + 0.1 * nA.g), dk * 0.9);
  return vec4(col, alpha);
}
vec3 paperFar(vec3 col, float dist) { return max(mix(col, uHaze, 0.6 * clamp(dist / 900.0, 0.0, 1.0)) * uTint, vec3(0.0)); }
`,Qe=`
vec3 rX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c); }
vec3 rY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c); }
vec3 rZ(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x * c - p.y * s, p.x * s + p.y * c, p.z); }
`,ze=`
attribute vec4 aData;
attribute vec3 color;
attribute vec4 iA, iB, iC;
uniform float uTime, uWave, uClose, uAlert, uSlip, uSunK;
uniform vec3 uShadowDir, uFlush, uDalPouch, uSunP;
varying vec3 vCol;
varying vec4 vData;
varying float vDist, vFlag, vUnder, vWy, vPid, vSun;
#ifdef FLY
uniform float uU, uGlide, uFlapRate, uHide;
uniform vec4 uLaunch;
uniform vec3 uNeck, uFoldTint, uHover;
attribute vec4 iD;   // a free flyer's own roll (x) and nose-up pitch (y), set by the world each frame (zero = level flight)
#endif
#include <fog_pars_vertex>
${Qe}
float ss(float a, float b, float x) { return smoothstep(a, b, x); }
const vec3 SH = vec3(${Z.SH.map(o=>o.toFixed(3)).join(",")});
const vec3 H1 = vec3(${Z.H1.map(o=>o.toFixed(3)).join(",")});
const vec3 PIV = vec3(0.0, 0.05, 0.2);
void main() {
  float pid = aData.w, seed = iB.w;
  vec3 p = position, off = vec3(0.0);
  float a1, a2, a3, pitch, sweep, roll, liftA, fold, tipUp, swell, drain, kick, bob, gape, open;
  float LT = 0.0, unf = 1.0;
#if defined(FLY)
  // a free flyer: iA = (x, y, z, yaw) in the mesh's space, iB = (flap phase, launch u or -1, scale, seed).
  // Before its launch u the bird sits folded; after it the wings open and it runs and rises along its heading.
  float la = max(uU - iB.y, 0.0);
  unf = smoothstep(0.0, 0.006, la); LT = la * 40.0;
  float flapF = iC.w * uGlide * sin(uTime * uFlapRate + iB.x);
  a1 = mix(2.0, uNeck.x, unf); a2 = mix(1.0, uNeck.y, unf); a3 = mix(-0.62, uNeck.z, unf);
  pitch = -0.32 * unf * (1.0 - smoothstep(1.5, 5.0, LT));
  swell = 0.0; drain = 0.0; gape = 0.04; bob = 0.0;
  kick = 0.5 * sin(uTime * 15.0 + seed * 50.0) * unf * (1.0 - smoothstep(1.5, 3.5, LT));
  sweep = mix(1.47, 0.06, unf); roll = mix(1.2, 0.0, unf); fold = mix(2.95, 0.1, unf);
  liftA = unf * (0.1 + 0.55 * flapF); tipUp = unf * (0.14 + 0.5 * liftA); open = unf;
#elif defined(SOAR)
  float flap = iC.w * sin(uTime * 4.2 + seed * 31.0);
  a1 = 2.75; a2 = 0.15; a3 = -0.12; pitch = 0.0; swell = 0.0; drain = 0.0; kick = 0.0; gape = 0.0;
  sweep = 0.06 + 0.04 * sin(uTime * 0.7 + seed * 17.0); roll = 0.0; fold = 0.1;
  liftA = 0.1 + 0.06 * sin(uTime * 1.1 + seed * 40.0) + 0.45 * flap;
  tipUp = 0.14 + 0.5 * liftA; bob = 0.0; open = 1.0;
#else
  float f = fract(uWave - iB.y);
  float lift = ss(0.0, 0.06, f) * (1.0 - ss(0.14, 0.26, f)) + 0.5 * ss(0.42, 0.5, f) * (1.0 - ss(0.6, 0.8, f));
  float dip = ss(0.07, 0.19, f) * (1.0 - ss(0.40, 0.52, f));
  lift = max(lift, 0.55 * dip);
  float up = ss(0.44, 0.54, f) * (1.0 - ss(0.88, 0.99, f));
  float toss = ss(0.70, 0.78, f) * (1.0 - ss(0.84, 0.93, f));
  swell = ss(0.40, 0.46, f) * (1.0 - ss(0.76, 0.92, f));
  drain = ss(0.46, 0.50, f) * (1.0 - ss(0.60, 0.74, f));
  float calm = 1.0 - uAlert;   // an alarm stills the fishing: every head comes up
  lift *= calm; dip *= calm; up *= calm; toss *= calm; swell *= calm; drain *= calm;
  float idle = sin(uTime * 0.9 + seed * 20.0);
  a1 = 2.0 + 0.05 * idle; a2 = 1.0; a3 = -0.62 + 0.07 * idle;
  a1 = mix(a1, -0.15, dip); a2 = mix(a2, -0.5, dip); a3 = mix(a3, -0.75, dip);
  a1 = mix(a1, 1.75, up); a2 = mix(a2, 1.2, up); a3 = mix(a3, -0.28, up);
  a1 = mix(a1, 1.85, toss); a2 = mix(a2, 1.5, toss); a3 = mix(a3, 0.9, toss);
  pitch = dip * 0.95 - toss * 0.1;
  sweep = mix(1.47, 0.7, lift); roll = mix(1.2, 0.45, lift); liftA = lift * 0.65; fold = mix(2.95, 1.2, lift);
  tipUp = 0.0; gape = 0.05 + 0.1 * swell; open = lift;
  kick = 0.5 * sin(uTime * (5.0 + 6.0 * dip) + seed * 50.0);
  bob = 0.015 * sin(uTime * 1.7 + seed * 30.0) - 0.05 * dip;
#endif
  vec3 d1 = vec3(0.0, sin(a1), cos(a1)), d2 = vec3(0.0, sin(a2), cos(a2)), d3 = vec3(0.0, sin(a3), cos(a3));
  vec3 e1 = H1 + ${Z.LN1.toFixed(3)} * d1, e2 = e1 + ${Z.LN2.toFixed(3)} * d2, e3 = e2 + ${Z.LH.toFixed(3)} * d3;
  if (pid < 2.5) {
  } else if (pid < 6.5) {
    float side = pid > 4.5 ? -1.0 : 1.0;
    if (fract(pid) > 0.1) p.z = mix(p.z, 0.03, open);   // the wing's shadow sheet shows only while the wing is folded (it closes to nothing as the wing opens)
    else if (p.z < 0.0) p.z *= mix(0.1, 1.0, open);   // flight feathers fan out from under the white coverts
    if (abs(pid - 4.0) < 0.5 || pid > 5.5) { p = rY(p, fold); p = rZ(p, tipUp); p.x += ${Z.L1.toFixed(3)}; p.y -= 0.014; }
    p = rX(p, -roll); p = rY(p, sweep); p = rZ(p, liftA); p += SH; p.x *= side;
  } else if (pid < 7.5) { p = rX(p, -a1) + H1;
  } else if (pid < 8.5) { p = rX(p, -a2) + e1;
  } else if (pid < 9.5) { p = rX(p, -a3) + e2;
  } else if (pid < 10.5) { p = rX(p, -(a3 + gape)) + e3;
  } else if (pid < 11.5) {
    float b = sin(3.1416 * clamp(p.z / ${Z.LB.toFixed(3)}, 0.0, 1.0));
    p.xy *= 1.0 + swell * 2.6 * b; p.y -= swell * 0.05 * b;
    p = rX(p, -(a3 - gape)) + e3;
  } else if (pid < 13.5) {
    float sx = pid < 12.5 ? 1.0 : -1.0;
    p = rX(p, 1.95 + kick * sx) + vec3(0.09 * sx, 0.03, -0.3);
  } else if (pid < 14.5) {
    off = vec3(p.x, p.y * drain * (0.45 + 0.25 * fract(seed * 13.0)), 0.0);
    p = rX(vec3(0.0, -0.05 - swell * 0.12, p.z), -a3) + e3;
  }
  if (pid < 14.5) { p = rX(p - PIV, pitch) + PIV; p.y += bob; p += off; }
  if (iC.x > 0.5 && pid > 13.5) p = vec3(0.0);
#if defined(FLY)
  if (pid > 13.5) p = vec3(0.0);
  p *= iB.z * mix(1.0, smoothstep(0.0, 0.02, la), uHide);
  p = rZ(p, uHover.z + iD.x);
  p = rX(p, -iD.y);
  p = rY(p, iA.w);
  vec2 fwd = vec2(sin(iA.w), cos(iA.w));
  float runD = uLaunch.x * LT * LT / (LT + 1.5), riseD = uLaunch.y * LT * LT / (LT + 2.5);
  p += iA.xyz + vec3(fwd.x * runD, riseD, fwd.y * runD);
  p.y += uHover.x * sin(uTime * 1.3 + seed * 40.0);
  p.xz += uHover.y * vec2(sin(uTime * 0.4 + seed * 20.0), cos(uTime * 0.33 + seed * 31.0));
#elif defined(SOAR)
  float ang = iA.z + uTime * iA.w, rad = iA.x + 1.2 * sin(uTime * 0.23 + seed * 11.0);
  vec3 ctrS = (modelMatrix * vec4(rad * cos(ang), iA.y, rad * sin(ang), 1.0)).xyz;
  p *= iB.z * (1.0 + 1.0 * clamp((distance(ctrS, cameraPosition) - 40.0) / 300.0, 0.0, 1.0));   // far birds are cut a little larger so they never thin out
  float dir = iA.w < 0.0 ? -1.0 : 1.0;
  p = rZ(p, dir * (0.38 + 0.1 * sin(uTime * 0.31 + seed * 9.0)));
  p = rY(p, -ang + (dir < 0.0 ? 3.14159 : 0.0));
  p += vec3(rad * cos(ang), iA.y + 1.0 * sin(uTime * 0.37 + seed * 23.0), rad * sin(ang));
#else
  p *= iB.z;
  p = rY(p, iB.x);
  vec2 xz = mix(iA.xy, iA.zw, uClose);
  p += vec3(xz.x, 0.0, xz.y);
#endif
  vec4 world = modelMatrix * vec4(p, 1.0);
  if (iC.x > 0.5) {   // the shadow sheet slips out sideways and always lies behind its bird, never over it
    vec3 vdir = normalize(world.xyz - cameraPosition + vec3(0.0, 1e-3, 0.0)), so = uShadowDir * uSlip * iB.z;
    so -= vdir * min(dot(so, vdir), 0.0);
    world.xyz += so + vdir * (0.04 + max(uSlip - 0.07, 0.0) * 3.0);   // a wider slip lies further back, so it never covers its own bird
  }
  vec3 c = color;
  if (pid < 2.5) c = mix(c, uFlush, iC.z * 0.35);
  if (iC.y > 0.5) { c *= vec3(0.78, 0.83, 0.9); if (abs(pid - 11.0) < 0.5) c = uDalPouch; }
#ifdef FLY
  c = mix(c * uFoldTint, c, unf);
#endif
  vCol = c; vFlag = iC.x; vWy = world.y; vPid = pid;
  // the sun in the cloud's eye lights whatever flies near it: strongest on the open wings, fading with distance
  vSun = uSunK * (1.0 - smoothstep(16.0, 105.0, distance(world.xyz, uSunP))) * (pid > 2.5 && pid < 6.5 ? 1.0 : 0.6);
  vData = vec4(aData.xy, aData.z, pid * 0.137 + seed);
  vUnder = step(cameraPosition.y + 2.0, world.y);
  vec4 mvPosition = viewMatrix * world;
  vDist = length(mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,be=`
varying vec3 vCol;
varying vec4 vData;
varying float vDist, vFlag, vUnder, vWy, vPid, vSun;
uniform vec3 uShade, uUnder, uSunC;
uniform float uClipY;
#include <fog_pars_fragment>
${pe}
void main() {
  bool cut = vWy < uClipY;   // under the clip line: decided here, thrown away below, once the last texture read and fwidth are made (a kept neighbour's are not defined after a pixel has left)
  float tearAmp = 1.0 - 0.8 * smoothstep(60.0, 400.0, vDist);
  vec3 col = mix(vCol, vCol * uUnder, vUnder);
  // close to the lens every sheet shows that it is painted paper: long brush streaks in two directions and fibre
  float nearK = 1.0 - smoothstep(5.0, 13.0, vDist), sd2 = fract(vData.w * 1.7);
  float b1 = texture2D(uPaper, vec2(vData.y * 0.42, vData.x * 0.5) + sd2).b;
  float b2 = texture2D(uPaper, vec2((vData.x + vData.y * 0.6) * 0.5, (vData.y - vData.x * 0.6) * 0.62) + sd2 * 3.0 + 0.4).b;
  float fib = texture2D(uPaper, vData.xy * 2.3 + sd2).g;
  col = mix(col, col * vec3(0.7, 0.75, 1.0), nearK * (1.0 - smoothstep(0.36, 0.52, b1)));
  col = mix(col, col * vec3(1.0, 0.78, 0.83), nearK * 0.85 * (1.0 - smoothstep(0.37, 0.5, b2)));
  col *= 1.0 + nearK * 0.12 * (fib - 0.5);
  // the eye: a dark paper dot in a pale ring on each side of the head (piece 9, placed in the head sheet's own paper metres)
  float headK = 1.0 - step(0.3, abs(vPid - 9.0));
  float er = length((vec2(abs(vData.x - 0.33), vData.y - 0.561) - vec2(0.218, 0.2)) / 0.047);
  col = mix(col, uWhite, headK * (1.0 - smoothstep(1.3, 1.5, er)));
  col = mix(col, vec3(0.03, 0.05, 0.13), headK * (1.0 - smoothstep(0.82, 1.0, er)));
  vec4 s = paperSheet(col, vData.xy, vData.z, tearAmp, vData.w, 1.0 - vFlag);
  if (cut) discard;
  s.rgb = mix(s.rgb, s.rgb * uSunC * 1.2 + uSunC * 0.05, vSun);          // warm paper where the sun's rays fall
  s.rgb = mix(s.rgb, uShade * (0.96 + 0.08 * fract(vData.w * 3.3)), vFlag);
  if (s.a < 0.04) discard;
  gl_FragColor = vec4(paperFar(s.rgb, vDist), s.a);
  #include <fog_fragment>
}`;function le(o,M,e,A,r={},C={}){return new f.ShaderMaterial({uniforms:{...f.UniformsUtils.clone(f.UniformsLib.fog),...o,...M},vertexShader:e,fragmentShader:A,defines:r,fog:!0,side:f.DoubleSide,alphaToCoverage:!0,...C})}function re(o,M,e,A,r){const C=Math.PI*o,_=Math.cos(C),Q=Math.sin(C);return[-M*Math.sign(_)*Math.pow(Math.abs(_),.72)+r*Q*Q,A-e*Math.pow(Q,.85)]}function he(o,M,e){const A=new f.InstancedBufferGeometry;A.index=o.index;for(const r in o.attributes)A.setAttribute(r,o.attributes[r]);for(const r in e)A.setAttribute(r,new f.InstancedBufferAttribute(e[r],4));return A.instanceCount=M,A}async function Le(o,M,e){const{path:A,PT:r,fishers:C,centre:_,inArc:Q}=o,R=A.length/(r.length-1),x=new f.Vector3,i=new f.Vector3,l=Math.fround,y={side:0,across:0,on:0,pair:0,short:0},v=[];let m,b,z,w;const g=B=>{m=B,b=2+m.skin,z=Math.max(...m.slabs.map(d=>d[0]))+b,w=Q(m.x,m.z)},P=(B,d,F)=>{const D=Math.abs(B.x-d)-m.h,N=Math.abs(B.z-F)-m.h;let k=1/0;if(D>z+R||N>z+R)return k;const T=Math.hypot(Math.max(D,0),Math.max(N,0))+Math.min(Math.max(D,N),0);for(const S of m.slabs){const L=Math.max(S[1]-B.y,B.y-S[2],0);L<b&&(k=Math.min(k,T-S[0]-Math.sqrt(b*b-L*L)))}return k},X=(B,d,F)=>{let D=1/0,N=1/0,k=P(r[0],B,d);for(let T=0;T<r.length;T++){if(F&&k<0)return k;const S=T+1<r.length?P(r[T+1],B,d):1/0;if(k<=N&&k<=S&&k<b+R){let L=Math.max(T-1,0)*R,W=Math.min(T+1,r.length-1)*R;for(let O=0;O<30;O++){const ve=L+(W-L)/3,de=W-(W-L)/3;P(A.posAtDist(ve,x),B,d)<P(A.posAtDist(de,x),B,d)?W=de:L=ve}const E=P(A.posAtDist((L+W)/2,x),B,d);E<D&&(D=E,i.copy(x))}N=k,k=S}return D},I=(B,d)=>(Q(B,d)||!w)&&C.every(F=>Math.hypot(F[0]-B,F[1]-d)>=m.keep)&&!(m.own&&Math.hypot(m.own[0]-B,m.own[1]-d)<m.own[2]),oe=(B,d)=>I(B,d)&&X(B,d,1)>=0,J=(B,d,F=0)=>M.every(D=>D===m||D.wait||Math.hypot(D.x-B,D.z-d)>=Math.max(m.skin,D.skin)-F),j=async(B,d,F,D,N,k,T)=>{for(let S=0;S<=k;S+=R){if(e&&await e(),!B(l(d+D*S),l(F+N*S)))continue;let L=Math.max(S-R,0),W=S;for(let E=0;E<12&&L<W;E++){if(T&&!J(l(d+D*W),l(F+N*W),W-L))return null;e&&await e();const O=(L+W)/2;B(l(d+D*O),l(F+N*O))?W=O:L=O}return[l(d+D*W),l(F+N*W)]}return null},$=(B,d)=>{A.posAtDist(B,x);const F=x.x,D=x.z,N=_[0]-F,k=_[1]-D;A.tangentAtDist(B,x);const T=Math.hypot(x.x,x.z)*(x.x*k-x.z*N<0?-1:1);return j(oe,F,D,-x.z/T,x.x/T,Math.hypot(N,k),d)};for(const B of M){g(B);let d=l(m.x),F=l(m.z),D=X(d,F),N=0;for(;D<0&&N<12;N++){let k=d-i.x,T=F-i.z;const S=Math.hypot(k,T);S>0?(k/=S,T/=S):k=1;let L=0,W=2*(m.h+z)*Math.SQRT2;for(let E=0;E<40;E++){const O=(L+W)/2;P(i,l(d+k*O),l(F+T*O))>=0?W=O:L=O}d=l(d+k*W),F=l(F+T*W),D=X(d,F)}N&&(D>=0&&I(d,F)?(m.x=d,m.z=F,y.side++):(m.wait=1,v.push(m))),e&&await e()}for(const B of v){g(B);const d=l(m.x),F=l(m.z);let D=0,N=1/0;for(let T=1;T<r.length;T++){const S=r[T-1],L=r[T].x-S.x,W=r[T].z-S.z,E=Math.min(1,Math.max(0,((d-S.x)*L+(F-S.z)*W)/(L*L+W*W))),O=Math.hypot(S.x+L*E-d,S.z+W*E-F);O<N&&(N=O,D=(T-1+E)*R)}let k=await $(D);if(k&&!J(k[0],k[1])){let T=null;for(let S=1;S*R<=12&&!T;S++)for(const L of[S,-S]){const W=await $(D+L*R,1);if(W&&J(W[0],W[1])){T=W;break}}T?(k=T,y.on++):y.pair++}if(!k){const T=_[0]-d,S=_[1]-F,L=Math.hypot(T,S);k=await j((W,E)=>oe(W,E)&&J(W,E),d,F,T/L,S/L,L)}k?(m.x=k[0],m.z=k[1],y.across++):y.short++,m.wait=0,e&&await e()}return y}async function Ee(o,M={}){const e=o.rng.fork?o.rng.fork("pelican-hero"):o.rng,A=o.quality?.detail??1,r=(M.palette??We).map(ae);for(;r.length<7;)r.push(ae(We[r.length]));const C={morning:{tint:[1,1,1],shade:"#B9B2DC"},dawn:{tint:[1,.9,.93],shade:"#C9A6D2"},evening:{tint:[1,.88,.72],shade:"#9A86C8"},dusk:{tint:[.6,.7,.96],shade:"#6A70B4"}},_=C[M.hour]??C.morning,Q=ae(_.shade),R=q(r[1],ae("#F29BB8"),.6),x={white:r[0].clone().multiplyScalar(.85),ink:q(r[5].clone().multiplyScalar(.3),ae("#16264A"),.55),face:q(r[1],ae("#F08CA8"),.5).multiplyScalar(.92),bill:r[4].clone().multiplyScalar(.92),pouch:r[1].clone().multiplyScalar(.95),pouchDeep:q(r[1],ae("#E8703A"),.55).multiplyScalar(.9)};x.cream=q(x.white,r[4],.1),x.flush=q(x.white,R,.3+.15*e()),x.breast=q(x.white,R,.6),x.ridge=ae("#F2CF3C").multiplyScalar(.9),x.nail=ae("#E04A30").multiplyScalar(.9),x.shadow=q(Q,r[2],.22).multiplyScalar(.84);const i=new f.Vector3(...M.shadowDir??[-.8,-.25,-.6]).normalize(),l=await qe(e.fork?e.fork("paper"):e,o.yield?()=>o.yield():null),y={uPaper:{value:l},uTime:{value:0},uWave:{value:0},uClose:{value:0},uAlert:{value:0},uWhite:{value:x.white.clone()},uTint:{value:new f.Color(..._.tint)},uHaze:{value:ae("#E6F6EC").multiplyScalar(.85)},uShadowDir:{value:i},uShade:{value:q(Q,r[2],.22).multiplyScalar(.82)},uUnder:{value:q(new f.Color(1,1,1),Q,.6)},uSunP:{value:new f.Vector3(0,115,-195)},uSunC:{value:new f.Color(1,.84,.56)},uSunK:{value:0}},v=new f.Group;v.name="pelican-collage-hero",await o.yield?.();const m=M.weather==="gale",b=m?18:22,z=m?12:15,w=e.range(37,42),g=20,P=e.range(-3.5,3.5),X=Math.max(8,Math.round(M.fishers??60)),I=[];{let t=0,a=re(0,b,w,g,P);I.push(0);for(let s=1;s<=400;s++){const n=re(s/400,b,w,g,P);t+=Math.hypot(n[0]-a[0],n[1]-a[1]),I.push(t),a=n}}const oe=t=>{const a=t*I[400];let s=1;for(;s<400&&I[s]<a;)s++;return(s-(I[s]-a)/Math.max(1e-6,I[s]-I[s-1]))/400},J=M.dalmatian!=null?Math.round(X*M.dalmatian):e.int(0,3),j=[];for(let t=0;t<X;t++){const a=(t+.5+e.range(-.22,.22))/X,s=oe(a),n=Math.abs(Math.cos(Math.PI*s)),u=(t%2*2-1)*.85*n+e.range(-.3,.3),p=(V,K)=>{const G=re(s,V,K,g,P),Y=P*.5,fe=g-K*.45;let se=Y-G[0],ne=fe-G[1];const Te=Math.hypot(se,ne)||1;return se/=Te,ne/=Te,{x:G[0]-se*u,z:G[1]-ne*u,nx:se,nz:ne}},c=p(b,w),h=p(z,w*.94),U=c.nx*.8*n,H=1+c.nz*.8*n;j.push({f:a,s,o:c,c:h,yaw:Math.atan2(U,H)+e.range(-.16,.16),phase:(M.waveLength?a*I[400]/M.waveLength:.5*a)+.1+e.range(-.02,.02),scale:e.range(.92,1.1)*(s<.36?1.09:1),seed:e(),dal:0,flush:e()})}for(let t=0;t<J;t++)j[e.int(0,X-1)].dal=1;const $=j.length;for(const t of M.joiners??[])j.push({f:0,s:2,o:{x:t.x,z:t.z,nx:0,nz:0},c:{x:t.cx??t.x,z:t.cz??t.z,nx:0,nz:0},yaw:t.yaw??0,phase:t.phase??.1,scale:t.scale??1.05,seed:t.seed??e(),dal:0,flush:t.flush??e(),joiner:!0});const B=t=>{let a=0,s=1e9;for(let n=0;n<=100;n++){const u=re(n/200,z,w*.94,g,P),p=Math.abs(u[1]-t);p<s&&(s=p,a=u[0])}return a},d=new f.Vector3(...M.columnOffset??[30,0,-195]),F=115,D=d.clone().add(new f.Vector3(0,F,0));y.uSunP.value.copy(D);const N=new f.Vector3(14+P*.5,4.2,g-w-1.5),k=new f.Vector2(d.x-N.x,d.z-N.z).normalize(),T=(t,a)=>new f.Vector2(t.x*Math.cos(a)-t.y*Math.sin(a),t.x*Math.sin(a)+t.y*Math.cos(a)),S=T(k,-.42),L=T(k,.32),W=new f.Vector3(S.x*Math.SQRT1_2,Math.SQRT1_2,S.y*Math.SQRT1_2),E=D.clone().addScaledVector(W,-60),O=E.clone().sub(new f.Vector3(L.x*57,33,L.y*57)),ve=O.clone().lerp(E,.55).add(new f.Vector3(L.x*3-S.x*3,-1.5,L.y*3-S.y*3)),de=t=>re(t,z,w*.94,g,P),ce=(t,a,s)=>{const n=de(t),u=P*.5,p=g-w*.94*.45;let c=u-n[0],h=p-n[1];const U=Math.hypot(c,h)||1;return new f.Vector3(n[0]+c/U*a,s,n[1]+h/U*a)},me=t=>{let a=0,s=1e9;for(let n=0;n<=100;n++){const u=Math.abs(de(n/200)[1]-t);u<s&&(s=u,a=n/200)}return a};N.copy(ce(.585,-2.2,4.4));const ue=[new f.Vector3(B(20)+5.6,2.6,g+21),new f.Vector3(B(20)+4.3,1,g+5),ce(me(13),3.3,.64),ce(me(4),3.2,.6),ce(me(-4),3.3,.6),ce(me(-11),3.8,.64),ce(.43,4.4,.9),N,N.clone().add(new f.Vector3(4.6,3.4,-8.5)),N.clone().lerp(O,.5).add(new f.Vector3(0,-3,0)),O,ve,E,D.clone()],De=new f.CatmullRomCurve3(ue,!1,"centripetal").getSpacedPoints(260);await o.yield?.();let xe=1e9;for(const t of j)for(const a of["o","c"]){const s=t[a];for(let n=0;n<4;n++){let u=1e9,p=null;for(const V of De){if(V.y>7)break;const K=Math.hypot(V.x-s.x,V.z-s.z,Math.max(0,V.y-1.3));K<u&&(u=K,p=V)}if(u>=3.05||!p){xe=Math.min(xe,u);break}const c=s.x-p.x,h=s.z-p.z,U=Math.hypot(c,h),H=(3.2-u)/Math.max(U,.3);U<.05?s.x+=3.2-u:(s.x+=c*H,s.z+=h*H)}}await o.yield?.();const Ce=Math.max(40,Math.round(M.soarers??240*A)),_e=De.map(t=>[Math.hypot(t.x-d.x,t.z-d.z),t.y]),Se=e.sign(),we=[];let ge=1e9;for(let t=0;t<Ce;t++){(t&15)===15&&await o.yield?.();let a=20,s=60,n=0;for(let c=0;c<40;c++){t%5===4?(s=e.range(20,80),a=e.range(34,36+(82-s)*.85)):(s=15+113*Math.pow(e(),.9),a=e.range(11,24+10*Math.sin(Math.PI*Math.min(1,(s-15)/113)))),n=1e9;for(const h of _e)n=Math.min(n,Math.hypot(h[0]-a,h[1]-s));if(n>8.5)break}if(n<=8.5)continue;ge=Math.min(ge,n-2.2);const u=t%5,p=e.range(8,11.5);we.push({r:a,y:s,a0:u*Ae/5+Se*s*.05+e.range(-.5,.5),w:Se*p/a,scale:e.range(.9,1.12),seed:e(),flap:e.chance(.14)?e.range(.5,1):0,flush:e()})}await o.yield?.();const ye={uFlush:{value:q(x.white,R,.6)},uDalPouch:{value:ae("#F0683A").multiplyScalar(.9)}};{const t=Me(x,!1),a=j.length*2,s=new Float32Array(a*4),n=new Float32Array(a*4),u=new Float32Array(a*4);j.forEach((c,h)=>{for(const U of[0,1]){const H=(h+U*j.length)*4;s.set([c.o.x,c.o.z,c.c.x,c.c.z],H),n.set([c.yaw,c.phase,c.scale,c.seed],H),u.set([U,c.dal,c.flush,0],H)}});const p=new f.Mesh(he(t,a,{iA:s,iB:n,iC:u}),le(y,{...ye,uClipY:{value:-.02},uSlip:{value:.07}},ze,be));p.frustumCulled=!1,p.name="fishers",v.add(p),p.userData.iB=n,p.userData.iA=s}await o.yield?.();{const t=Me(x,!0),a=we.length,s=new Float32Array(a*4),n=new Float32Array(a*4),u=new Float32Array(a*4);we.forEach((c,h)=>{s.set([c.r,c.y,c.a0,c.w],h*4),n.set([0,0,c.scale,c.seed],h*4),u.set([0,0,c.flush,c.flap],h*4)});const p=new f.Mesh(he(t,a,{iA:s,iB:n,iC:u}),le(y,{...ye,uClipY:{value:-1e6},uSlip:{value:.07}},ze,be,{SOAR:1}));p.position.copy(d),p.frustumCulled=!1,p.name="soarers",v.add(p)}await o.yield?.();{const t=new f.PlaneGeometry(1,1),a=j.length*3,s=new Float32Array(a*4),n=new Float32Array(a*4),u=new Float32Array(a*4);j.forEach((h,U)=>{for(let H=0;H<3;H++){const V=(U*3+H)*4;s.set([h.o.x,h.o.z,h.c.x,h.c.z],V),n.set([h.yaw,h.phase,h.scale,h.seed],V),u.set([H,0,0,0],V)}});const p=le(y,{},`
      attribute vec4 iA, iB, iC;
      uniform float uWave, uClose; uniform vec3 uShadowDir;
      varying vec2 vQ, vW; varying vec4 vP; varying float vDist;
      #include <fog_pars_vertex>
      void main() {
        vec2 xz = mix(iA.xy, iA.zw, uClose), q = position.xy, ctr; float kind = iC.x, R = 1.0, fade = 0.0, half2;
        vec2 fw = vec2(sin(iB.x), cos(iB.x));
        if (kind < 1.5) {
          float age = (fract(uWave - iB.y - 0.13) + kind) * 3.0;
          R = 0.35 + 0.75 * sqrt(age); fade = age / 6.0; half2 = R * 1.25 + 0.3;
          ctr = xz + fw * 0.95 * iB.z + vec2(0.0, -0.8 * age);
        } else {
          half2 = 1.5 * iB.z; ctr = xz + uShadowDir.xz * 0.5 * iB.z;
          q = vec2(q.x * fw.y + q.y * fw.x, -q.x * fw.x + q.y * fw.y);
        }
        vQ = position.xy * 2.0 * half2; vP = vec4(R, fade, kind, iB.w);
        vec4 world = modelMatrix * vec4(ctr.x + q.x * 2.0 * half2, 0.035 + 0.004 * kind, ctr.y + q.y * 2.0 * half2, 1.0);
        vW = world.xz;
        vec4 mvPosition = viewMatrix * world; vDist = length(mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,`
      varying vec2 vQ, vW; varying vec4 vP; varying float vDist;
      uniform vec3 uShade, uShadowDir;
      #include <fog_pars_fragment>
      ${pe}
      void main() {
        float n = texture2D(uPaper, vW * 0.21 + vP.w).r, n2 = texture2D(uPaper, vW * 0.83 + vP.w * 2.0).r;
        vec3 col; float a;
        if (vP.z < 1.5) {
          float w = 0.09 + 0.1 * (1.0 - vP.y), Rr = vP.x * (0.88 + 0.24 * n), th = 0.12 + 0.5 * n2 + vP.y * vP.y * 0.95;
          float band = 1.0 - abs(length(vQ) - Rr) / w, band2 = 1.0 - abs(length(vQ - uShadowDir.xz * 0.07) - Rr) / w;
          float aa = fwidth(band) + 1e-3;
          float a1 = smoothstep(th - aa, th + aa, band), a2 = smoothstep(th - aa, th + aa, band2) * 0.75;
          col = mix(uShade, uWhite * (0.92 + 0.08 * n2), a1); a = max(a1, a2) * (1.0 - smoothstep(0.85, 1.0, vP.y));
        } else {
          float d = length(vQ / (vec2(0.62, 1.15) * 1.0)) + (n2 - 0.5) * 0.35;
          col = uShade; a = (1.0 - smoothstep(0.7, 1.0, d)) * 0.8;
        }
        if (a < 0.01) discard;
        gl_FragColor = vec4(paperFar(col, vDist), a);
        #include <fog_fragment>
      }`,{},{transparent:!0,depthWrite:!1,alphaToCoverage:!1}),c=new f.Mesh(he(t,a,{iA:s,iB:n,iC:u}),p);c.frustumCulled=!1,c.renderOrder=2,c.name="rings",v.add(c),c.userData.iB=n,c.userData.iA=s}{const t=Math.round(320*A),a=Math.round(170*A),s=t+a,n=new Float32Array(s*4),u=new Float32Array(s*4);for(let h=0;h<t;h++){const U=e.range(.12,.88),H=re(U,z*e.range(0,.7),w*e.range(.25,.8),g,P);n.set([H[0],H[1]+e.range(-3,6),e(),e.range(1.3,3.2)],h*4),u.set([e.range(.28,.5),0,e(),e.range(.4,1.2)],h*4)}for(let h=t;h<s;h++)n.set([e.range(1,13)+(h%3===0?e.range(0,30):0),0,e(),e.range(22,40)],h*4),u.set([e.range(.16,.34),1,e(),0],h*4);const p=le(y,{uCol:{value:d.clone()},uFishA:{value:q(x.white,r[2],.45)},uFishB:{value:q(x.white,r[6],.5)}},`
      attribute vec4 iA, iB;
      uniform float uTime; uniform vec3 uCol;
      varying vec2 vQ; varying vec3 vP; varying float vDist, vNear;
      #include <fog_pars_vertex>
      void main() {
        float seed = iB.z, size = iB.x; vec3 c, T, W; vNear = 1.0;
        if (iB.y < 0.5) {
          float tt = uTime / iA.w + iA.z, q = fract(tt), cyc = floor(tt);
          float h1 = fract(sin(cyc * 12.9898 + seed * 78.233) * 43758.5453);
          vec2 base = iA.xy + (vec2(h1, fract(h1 * 7.13)) - 0.5) * 6.0;
          float j = q / 0.4, air = step(j, 1.0), da = seed * 6.2832 + cyc * 2.4;
          vec2 d = vec2(cos(da), sin(da));
          c = vec3(base.x + d.x * j * 1.4, air * iB.w * 4.0 * j * (1.0 - j) - (1.0 - air) * 0.6 - 0.04, base.y + d.y * j * 1.4);
          float pa = atan(iB.w * 4.0 * (1.0 - 2.0 * j) / 1.4), sp = uTime * 8.0 + seed * 40.0;
          T = vec3(d.x * cos(pa), sin(pa), d.y * cos(pa)); vec3 Nn = vec3(-d.y, 0.0, d.x), Bn = cross(T, Nn);
          W = (Nn * cos(sp) + Bn * sin(sp)) * 0.42;
        } else {
          float q = fract(iA.z + uTime / iA.w), ang = seed * 6.2832 + uTime * 0.22 * (0.5 + fract(seed * 5.0));
          c = uCol + vec3(iA.x * cos(ang), 13.0 + q * 114.0, iA.x * sin(ang)) + 0.6 * vec3(sin(uTime * 0.9 + seed * 30.0), 0.0, cos(uTime * 0.7 + seed * 50.0));
          size *= smoothstep(0.0, 0.05, q) * (1.0 - smoothstep(0.93, 1.0, q));
          // the down is a medium we fly through, so it takes the near law of the world's own down (the kit's makeParticles form): by the true
          // distance of its middle from the lens, on its alpha alone, with the same two figures, 0.6 m and 2.5 m, of the kit's petals preset
          vNear = smoothstep(0.6, 2.5, length((viewMatrix * modelMatrix * vec4(c, 1.0)).xyz));
          float s1 = uTime * 1.3 + seed * 60.0, s2 = uTime * 0.8 + seed * 20.0;
          T = normalize(vec3(cos(s1), 0.5 * sin(s1 * 1.3), sin(s1)));
          W = cross(T, vec3(sin(s2), cos(s2), 0.35)); W *= 0.5 / max(length(W), 1e-3);
        }
        vec4 world = modelMatrix * vec4(c + (T * position.x + W * position.y) * size, 1.0);
        vQ = position.xy; vP = vec3(iB.y, seed, size);
        vec4 mvPosition = viewMatrix * world; vDist = length(mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,`
      varying vec2 vQ; varying vec3 vP; varying float vDist, vNear;
      uniform vec3 uFishA, uFishB;
      #include <fog_pars_fragment>
      ${pe}
      void main() {
        float prof = 0.12 + 0.88 * pow(max(sin(3.1416 * clamp(vQ.x + 0.5, 0.0, 1.0)), 0.0), 0.6);
        float e = vP.x < 0.5 ? 1.0 - abs(vQ.y) * 2.0 / prof : 1.0 - length(vQ * vec2(2.0, 2.6));
        vec3 col = vP.x < 0.5 ? mix(uWhite, fract(vP.y * 9.0) < 0.2 ? uFishB : uFishA, step(0.08, vQ.y)) : uWhite;
        vec4 s = paperSheet(col, vQ * vP.z * vec2(1.6, 0.8) + vP.y, clamp(e, 0.0, 1.0), 1.0, vP.y, 1.0);
        if (vP.x > 0.5) s.a *= vNear;                 // (the down alone: a piece whose middle is within about 0.83 m is under 0.04 and not drawn)
        if (s.a < 0.04) discard;
        gl_FragColor = vec4(paperFar(s.rgb, vDist), s.a);
        #include <fog_fragment>
      }`),c=new f.Mesh(he(new f.PlaneGeometry(1,1),s,{iA:n,iB:u}),p);c.frustumCulled=!1,c.name="scraps",v.add(c),Object.assign(c.userData,{iA:n,iB:u,nFish:t})}if(await o.yield?.(),M.water!==!1){const t=M.waterRadius??215,a=M.waterCenter??[d.x*.5,d.z*.5],s=new f.CircleGeometry(t,64);s.rotateX(-Math.PI/2),s.translate(a[0],0,a[1]);const n=le(y,{uW0:{value:r[2].clone()},uW1:{value:q(r[2],x.white,.34)},uW2:{value:q(r[2],r[5],.7)},uW3:{value:q(r[2],ae("#5B86D8"),.6)},uSeedW:{value:e()},uCtr:{value:new f.Vector2(a[0],a[1])},uWR:{value:t}},`
      varying vec3 vW, vWorld; varying float vDist;
      #include <fog_pars_vertex>
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0); vW = position; vWorld = world.xyz;
        vec4 mvPosition = viewMatrix * world; vDist = length(mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,`
      varying vec3 vW, vWorld; varying float vDist;
      uniform vec3 uW0, uW1, uW2, uW3; uniform float uTime, uSeedW, uWR; uniform vec2 uCtr;
      #include <fog_pars_fragment>
      ${pe}
      // one torn sheet: x = inside the sheet, y = white deckle hairline along its torn edge
      vec2 sheet(vec2 uv, float th) {
        float n = texture2D(uPaper, uv).r, fwn = fwidth(n);
        float hw = max(0.008, 1.5 * fwn);
        return vec2(smoothstep(th - fwn, th + fwn, n), (1.0 - smoothstep(0.0, hw, abs(n - th))) * min(1.0, 0.012 / hw));
      }
      void main() {
        vec2 w = vW.xz; float t = uTime;
        vec3 col = uW0;
        // long torn bands lying across the direction of travel (stretched 3:1 along X), sliding at four speeds
        vec2 s1 = sheet((w - vec2(0.1, -0.8) * t) * vec2(0.34, 1.0) / 19.0 + uSeedW, 0.5);
        vec2 s2 = sheet((mat2(0.97, 0.24, -0.24, 0.97) * w - vec2(-0.3, -0.62) * t) * vec2(0.3, 1.0) / 27.0 + uSeedW * 3.0, 0.5);
        vec2 s3 = sheet((mat2(0.98, -0.2, 0.2, 0.98) * w - vec2(0.45, -0.95) * t) * vec2(0.3, 1.0) / 11.0 + uSeedW * 5.0, 0.72);
        vec2 s4 = sheet((w - vec2(-0.5, -0.7) * t) * vec2(0.4, 1.0) / 33.0 + uSeedW * 7.0, 0.61);
        col = mix(col, uW3, s2.x * 0.85); col = mix(col, uWhite, s2.y * 0.3);
        col = mix(col, uW2, s1.x * 0.85); col = mix(col, uWhite, s1.y * 0.35);
        col = mix(col, mix(uW0, uW1, 0.4), s4.x * 0.5); col = mix(col, uWhite, s4.y * 0.3);
        col = mix(col, uW1, s3.x * 0.7); col = mix(col, uWhite, s3.y * 0.4);
        vec4 br = texture2D(uPaper, (w - vec2(0.0, -0.8) * t) * vec2(0.021, 0.006) + 0.3);
        vec4 br2 = texture2D(uPaper, (w - vec2(0.1, -0.8) * t) * vec2(0.23, 0.05) + 0.7);
        col *= (0.9 + 0.2 * br.b) * (0.9 + 0.2 * br2.b);
        float e = clamp((1.0 - length(w - uCtr) / uWR) * 14.0, 0.0, 1.0);
        vec4 s = paperSheet(col, w / 14.0, e, 1.0, 0.37, 1.0);
        if (s.a < 0.04) discard;
        gl_FragColor = vec4(paperFar(mix(col, s.rgb, 0.6 + 0.4 * step(e, 0.5)), length(vWorld - cameraPosition)), 1.0);
        #include <fog_fragment>
      }`,{},{alphaToCoverage:!1,depthWrite:M.waterDepthWrite??!0}),u=new f.Mesh(s,n);u.name="lagoon",u.frustumCulled=!1,u.renderOrder=-.5,v.add(u)}if(M.cloud!==!1){const a=new Float32Array(28),s=new Float32Array(28);for(let p=0;p<7;p++){const c=p/6,h=4+14*c;a.set([e.range(-h,h),F+4.5+p*4.2,e.range(-h,h),e.range(88,100)+80*c],p*4),s.set([e(),Math.max(0,1-c*.85),e()*Ae,e.range(.85,1.25)],p*4)}const n=le(y,{uSeat:{value:D.clone()},uHoleDir:{value:new f.Vector2(S.x,S.y)},uLilac:{value:q(Q,r[2],.12).multiplyScalar(.8)}},`
      attribute vec4 iA, iB;
      uniform float uTime; uniform vec3 uSeat;
      varying vec2 vQ, vH; varying vec3 vP; varying float vDist;
      #include <fog_pars_vertex>
      void main() {
        vec3 c = vec3(uSeat.x + iA.x + 5.0 * sin(uTime * 0.05 + iB.z), iA.y, uSeat.z + iA.z + 4.0 * cos(uTime * 0.04 + iB.z * 1.7));
        vec3 p = c + vec3(position.x * iA.w * iB.w, position.x * iA.w * 0.04 * sin(iB.z), position.y * iA.w);
        vec4 world = modelMatrix * vec4(p, 1.0);
        vQ = position.xy; vH = p.xz - uSeat.xz; vP = vec3(iB.x, iB.y, iA.w);
        vec4 mvPosition = viewMatrix * world; vDist = length(mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,`
      varying vec2 vQ, vH; varying vec3 vP; varying float vDist;
      uniform vec3 uLilac, uSunC; uniform vec2 uHoleDir; uniform float uSunK;
      #include <fog_pars_fragment>
      ${pe}
      void main() {
        vec4 n = texture2D(uPaper, vQ * 0.55 + vP.x);
        float e = (1.0 - length(vQ * 2.0)) * 1.7 + (n.a - 0.5) * 1.5;
        float al = dot(vH, uHoleDir);
        vec2 hq = vH - uHoleDir * al * (al < 0.0 ? 0.45 : 0.0);
        e = min(e, (length(hq) / 10.5 - 1.0) * 2.2 + (n.r - 0.5) * 0.3);
        vec3 col = mix(uWhite, uLilac, vP.y);
        // the sun in the eye warms the paper round the hole: two torn rings of apricot and gold tissue
        float hr = length(hq) + (n.b - 0.5) * 9.0;
        col = mix(col, mix(col, uWhite * uSunC, 0.75), uSunK * (1.0 - smoothstep(30.0, 31.5, hr)) * 0.55);
        col = mix(col, uWhite * uSunC * 1.08, uSunK * (1.0 - smoothstep(17.0, 18.2, hr)) * 0.6);
        vec4 s = paperSheet(col, vQ * vP.z / 9.0 + vP.x, clamp(e, 0.0, 1.0), 1.0, vP.x, 1.0);
        if (s.a < 0.04) discard;
        gl_FragColor = vec4(paperFar(s.rgb, vDist * 0.35), s.a);
        #include <fog_fragment>
      }`),u=new f.Mesh(he(new f.PlaneGeometry(1,1),7,{iA:a,iB:s}),n);u.frustumCulled=!1,u.name="cloud",v.add(u)}await o.yield?.();const te=t=>[+t.x.toFixed(2),+t.y.toFixed(2),+t.z.toFixed(2)];let ie=j[0],Pe=1e9;for(const t of j){if(t.s>.4)continue;const a=Math.hypot(t.c.x-ue[3].x,t.c.z-ue[3].z);a<Pe&&(Pe=a,ie=t)}const Re={flyThrough:ue.map(te),portalSeat:{position:te(D),normal:te(W.clone().negate()),direction:te(W)},approachStart:te(E),columnFoot:te(d),columnTop:te(D),horseshoeCenter:[+(P*.5).toFixed(2),1,+(g-w*.5).toFixed(2)],mouth:[0,.8,g],leftArm:te(ue[2]),rightBend:te(N),closestBird:{open:[ie.o.x,0,ie.o.z],closed:[ie.c.x,0,ie.c.z],arc:ie.f,phase:ie.phase},viewpoints:[{name:"mouth",position:[-4,2.2,g+30],target:[0,1.5,g-w*.6]},{name:"leftPass",position:te(ue[2]),target:[ie.c.x,.7,ie.c.z-3]},{name:"underColumn",position:te(E),target:te(D)}],clearance:{fishers:+xe.toFixed(2),soarers:+ge.toFixed(2)}};let Fe=null,Be=null;const je=24,He=12,Ne=new f.Vector3(0,2,-2);function Ke(t,a={}){const s={...x,...a.colors??{}};if(a.colors)for(const Y of["breast","ridge","nail","shadow"])s[Y]=a.colors[Y];const n=Me(s,!!a.lod),u=a.shadow?2:1,p=t.length,c=p*u,h=new Float32Array(c*4),U=new Float32Array(c*4),H=new Float32Array(c*4),V=new Float32Array(c*4);t.forEach((Y,fe)=>{for(let se=0;se<u;se++){const ne=(fe+se*p)*4;h.set([Y.x,Y.y,Y.z,Y.yaw??0],ne),U.set([Y.phase??0,Y.launch??-1,Y.scale??1,Y.seed??.5],ne),H.set([se,Y.dal??0,Y.flush??.5,Y.flap??1],ne)}});const K={uU:{value:0},uGlide:{value:1},uHide:{value:a.hideBefore?1:0},uFlapRate:{value:a.flapRate??4.2},uClipY:{value:a.clipY??-1e6},uLaunch:{value:new f.Vector4(a.run??0,a.rise??0,0,0)},uSlip:{value:a.slip??.07},uHover:{value:new f.Vector3(0,0,0)},uNeck:{value:new f.Vector3(...a.neck??[2.75,.15,-.12])},uFoldTint:{value:new f.Vector3(...a.foldTint??[1,1,1])}},G=new f.Mesh(he(n,c,{iA:h,iB:U,iC:H,iD:V}),le(y,{...ye,...K},ze,be,{FLY:1}));return G.frustumCulled=!1,G.userData.u=K,G.userData.iA=h,G.userData.iD=V,G.userData.count=p,G.userData.copies=u,G}const ke=j.map(t=>({o:[t.o.x,t.o.z],c:[t.c.x,t.c.z],yaw:t.yaw,s:t.s,scale:t.scale,seed:t.seed,dal:t.dal,phase:t.phase,joiner:!!t.joiner}));return{object:v,radius:je,height:He,center:Ne,anchors:Re,uniforms:y,ground:!1,groundY:0,counts:{fishers:j.length,soarers:we.length},paper:l,colors:x,makeFlock:Ke,fisherList:ke,setPlace(t,a,s,n){const u=v.getObjectByName("fishers"),p=v.getObjectByName("rings"),c=j.length,h=j[t],U=ke[t];h.o.x=h.c.x=a,h.o.z=h.c.z=s,h.yaw=n,U.o=[a,s],U.c=[a,s],U.yaw=n;for(const H of[0,1]){const V=(t+H*c)*4;u.userData.iA.set([a,s,a,s],V),u.userData.iB[V]=n}for(let H=0;H<3;H++){const V=(t*3+H)*4;p.userData.iA.set([a,s,a,s],V),p.userData.iB[V]=n}for(const H of[u,p])H.geometry.attributes.iA.needsUpdate=!0,H.geometry.attributes.iB.needsUpdate=!0},shape:(t,a=1)=>{const s=re(t,b,w,g,P),n=re(t,z,w*.94,g,P);return[s[0]+(n[0]-s[0])*a,s[1]+(n[1]-s[1])*a]},joiners:{first:$,count:j.length-$},setPhase(t,a){const s=v.getObjectByName("fishers"),n=v.getObjectByName("rings"),u=j.length;j[t].phase=a;for(const p of[0,1])s.userData.iB[(t+p*u)*4+1]=a;for(let p=0;p<3;p++)n.userData.iB[(t*3+p)*4+1]=a;s.geometry.attributes.iB.needsUpdate=!0,n.geometry.attributes.iB.needsUpdate=!0},async standFish(t,a,s){const n=v.getObjectByName("scraps"),{iA:u,iB:p,nFish:c}=n.userData,h=[],U=o.yield?()=>o.yield():null;for(let K=0;K<c;K++)h.push({x:u[K*4],z:u[K*4+1],h:6/2,slabs:[[1.4,-.04,p[K*4+3]-.04],[1.4/.4,-.6-.04,-.6-.04]],skin:.5*p[K*4]*Math.hypot(1,.42),keep:1.5});const H={path:t,PT:a,fishers:j.map(K=>[K.c.x,K.c.z]),centre:[P*.5,g-w*.5],inArc:(K,G)=>{const Y=(g-G)/(w*.94),fe=Math.pow(Math.max(Y,0),2/.85);return Y>=0&&Y<=1&&Math.abs(K-P*fe)<=z*Math.pow(1-fe,.36)}},V=[await Le(H,h,U),await Le(H,s,U)];return h.forEach((K,G)=>{u[G*4]=K.x,u[G*4+1]=K.z}),n.geometry.attributes.iA.needsUpdate=!0,V.some(K=>K.pair+K.short)&&console.warn("pelican-collage: leaping fish left as a pair or short of 2 m",V),V},setProgress(t){Fe=Math.min(1,Math.max(0,t))},setWave(t){Be=t},update(t,a){y.uTime.value=a,y.uWave.value=Be??a/3;const s=.5-.5*Math.cos(a*Ae/90),n=Fe??s;y.uClose.value=n*n*(3-2*n)},dispose(){l.dispose()}}}export{pe as PAPER_GLSL,Qe as ROT_GLSL,Ee as buildHero,Ve as finishGeo,he as instanced,Ue as makeGeo,q as mixc,le as paperMaterial,Le as standOff,ee as strip};
