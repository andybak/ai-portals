import*as S from"three";const _=Object.freeze({minuteDeg:60,hourDeg:305}),P=Math.PI/180,s=r=>{const t=Number(r).toFixed(6);return t.indexOf(".")<0?t+".0":t},J=Object.freeze({a:205,b:235,c:385,d:420,minuteTurn:660,hourTurn:55});function lt(r){const{a:t,b:w,c:y,d:b}=J,a=(w-t)/2+(y-w)+(b-y)/2;let n=0;r<=t?n=0:r<=w?n=(r-t)*(r-t)/(2*(w-t)):r<=y?n=(w-t)/2+(r-w):r<b?n=(w-t)/2+(y-w)+(r-y)-(r-y)*(r-y)/(2*(b-y)):n=a;const e=n/a;return{E:e,minuteDeg:_.minuteDeg+J.minuteTurn*e,hourDeg:_.hourDeg+J.hourTurn*e}}const D=Object.freeze({rFace:.88,hub:.11,stroke:Object.freeze({uIn:.62,uOut:.8,hIn:.016,hOut:.034}),quarter:Object.freeze({uIn:.54,uOut:.8,hIn:.026,hOut:.058}),track:Object.freeze({r:.84,h:.008}),minute:Object.freeze({L:.6,w0:.04,ue:.4,Re:.07,Ri:.04}),hour:Object.freeze({L:.42,w0:.055,ue:.28,Re:.085,Ri:.048}),T:.35});function Mt(){const r=D,t=Math.PI*r.rFace*r.rFace,w=e=>(2*e.hIn+2*e.hOut)/2*(e.uOut-e.uIn),y=8*w(r.stroke)+4*w(r.quarter),b=4*Math.PI*r.track.r*r.track.h,a=e=>{const l=r.hub,d=e.w0/(e.L-l),g=d*(e.L-e.ue)/Math.sqrt(1+d*d),k=2*e.w0*l-(e.w0*Math.sqrt(l*l-e.w0*e.w0)+l*l*Math.asin(e.w0/l)),c=e.w0*(e.L-l),m=2*(e.Re*e.Re*Math.acos(g/e.Re)-g*Math.sqrt(e.Re*e.Re-g*g));return k+c+m-Math.PI*e.Ri*e.Ri},n=Math.PI*r.hub*r.hub+a(r.minute)+a(r.hour);return{strokes:y/t,track:b/t,hands:n/t}}const tt=Object.freeze(Mt()),et=`
#ifndef TPT_FILTER_GLSL
#define TPT_FILTER_GLSL
float tptBox(float d, float h, float w){ return clamp((min(d + h, w * 0.5) - max(d - h, -w * 0.5)) / w, 0.0, 1.0); }
float tptEdge(float d, float w){ return clamp(0.5 - d / w, 0.0, 1.0); }
float tptDisc(float r, float R0, float w){
  float rho = w < 1.7320508 * R0 ? sqrt(R0 * R0 - w * w / 12.0) : pow(3.0 * w * R0 * R0, 0.33333333) - 0.5 * w;
  return clamp(0.5 - (r - rho) / w, 0.0, 1.0);
}
#endif
`;function ut(r,t,w){const y=D,b=w*P,a=t.w0/(t.L-y.hub),n=y.hub,e=(t.w0*Math.sqrt(n*n-t.w0*t.w0)+n*n*Math.asin(t.w0/n))/(2*t.w0);return`
float ${r}(vec2 p, float w){
  float u = p.x * ${s(Math.sin(b))} + p.y * ${s(Math.cos(b))};
  float v = abs(p.x * ${s(Math.cos(b))} - p.y * ${s(Math.sin(b))});
  float H = min(${s(t.w0)}, ${s(a)} * (${s(t.L)} - u));                                  // neck, then the straight taper to the point
  float du = u - ${s(t.ue)};
  H = max(max(H, 0.0), sqrt(max(${s(t.Re*t.Re)} - du * du, 0.0)));                     // the eye's ring swells the outline
  // across the hand the box over the outline's width, along it the box over its length: the two together keep the
  // outline's area for any w (the first sums to 2 H(u) across, the second is odd about each end, where H is level)
  float c = tptBox(v, H, w) * tptBox(u - ${s((t.L+e)/2)}, ${s((t.L-e)/2)}, w);
  float bore = tptDisc(length(vec2(du, v)), ${s(t.Ri)}, w);
  return max(c - bore, 0.0);
}`}function St(){const r=D.stroke,t=D.quarter;return`
float tptStrokes(vec2 p, float w){
  float r = length(p);
  if (r < 0.2) return 0.0;
  float k = floor(atan(p.x, p.y) / 0.5235988 + 0.5);                                      // the nearest of the twelve
  float a = k * 0.5235988, sa = sin(a), ca = cos(a);
  float u = p.x * sa + p.y * ca, v = abs(p.x * ca - p.y * sa);
  float qt = 1.0 - step(0.5, abs(mod(k + 12.0, 3.0)));                                     // 1 at twelve, three, six, nine
  float uIn = mix(${s(r.uIn)}, ${s(t.uIn)}, qt), uOut = mix(${s(r.uOut)}, ${s(t.uOut)}, qt);
  float hIn = mix(${s(r.hIn)}, ${s(t.hIn)}, qt), hOut = mix(${s(r.hOut)}, ${s(t.hOut)}, qt);
  float h = mix(hIn, hOut, clamp((u - uIn) / (uOut - uIn), 0.0, 1.0));                     // the wedge narrows toward the centre
  return tptBox(v, h, w) * tptBox(u - 0.5 * (uIn + uOut), 0.5 * (uOut - uIn), w);
}`}const at=8*Math.sin(Math.PI/8),ht=1-Math.PI*D.rFace*D.rFace/at,kt=et+St()+ut("tptHandMinute",D.minute,_.minuteDeg)+ut("tptHandHour",D.hour,_.hourDeg)+`
uniform vec3 uTptFaceCol[4];     // by kind: white enamel, ivory enamel, glass against sky, marble
uniform vec3 uTptStrokeCol[4];   // strokes and minute track
uniform vec3 uTptHandCol[4];     // hands and hub: blued steel; brass on the marble floor
// share: the face disc's own cover of the pixel (1 on a face that fills it; on the far disc, 1 less the bezel's cover),
// which the typed means are shares of.
vec3 tptFaceCov(vec2 p, float fw, float hands, float share){
  float w = max(fw, 1e-5), r = length(p);
  float cs = tptStrokes(p, w);
  // THE MINUTE TRACK lies 0.04 inside the face's edge. Its box cover runs past that edge once w / 2 + h > 0.04; the
  // part that would fall outside is laid back inside as its mirror image in the edge, weighed by r' / r (r' = 2 rFace
  // - r, the mirrored radius: a ring at r' is that much longer than the ring at r it is laid on), so that the cover
  // summed over the face stays the track's whole area 4 pi r h for any w. Nothing of it is drawn beyond the edge.
  float rm = ${s(2*D.rFace)} - r;
  float ct = (tptBox(r - ${s(D.track.r)}, ${s(D.track.h)}, w) + tptBox(rm - ${s(D.track.r)}, ${s(D.track.h)}, w) * rm / max(r, 0.2)) * step(r, ${s(D.rFace)});
  // hub, minute hand and hour hand: their covers add, held to 1 (the necks' straight cuts lap the hub by two slivers: see handGLSL)
  float ch = min(tptDisc(r, ${s(D.hub)}, w) + tptHandMinute(p, w) + tptHandHour(p, w), 1.0);
  float toMean = 1.0 - smoothstep(${s(.25*D.T)}, ${s(D.T)}, w);                   // period T = ${s(D.T)}: the strokes' spacing
  // typed means: the shares of the face disc, from faceShares()
  cs = mix(${s(tt.strokes)} * share, cs, toMean);
  ct = mix(${s(tt.track)} * share, ct, toMean);
  ch = mix(${s(tt.hands)} * share, ch, toMean) * hands;
  return vec3(cs, ct, ch);
}
vec3 tptFaceCov(vec2 p, float fw, float hands){ return tptFaceCov(p, fw, hands, 1.0); }
// THE FAR DISC'S BEZEL: what lies between the face's edge (the circle rFace) and the disc's own edge. THE DISC IS
// BUILT AS A FIGURE OF SIXTEEN SIDES with its corners at radius 1: its area is 8 sin(pi / 8) = ${s(at)} and its
// sides come in to ${s(Math.cos(Math.PI/16))} at their middles. The bezel's cover of the pixel is 1 less the enamel disc's, whose edge
// is drawn in as in tptDisc so that the enamel keeps its whole area pi rFace^2; the edge's ramp ends inside the
// sixteen sides while w <= 0.2 (rho + w / 2 <= 0.8781 + 0.1). A wider pixel uses the form at 0.2 and goes over to
// the typed mean by w = 0.48: the bezel's share of the built figure, 1 - pi rFace^2 / ${s(at)} = ${s(ht)}.
float tptFarBezel(float r, float fw){
  float w = min(max(fw, 1e-5), 0.2);
  float enamel = tptEdge(r - sqrt(${s(D.rFace*D.rFace)} - w * w / 12.0), w);
  return mix(${s(ht)}, 1.0 - enamel, 1.0 - smoothstep(0.2, 0.48, fw));
}
// THE SHARES OF THE PIXEL on a dial's disc at p: (strokes and track, hands and hub, bezel, bare face); they add to
// one. onFar: 1 on the far disc, which carries its bezel; 0 on a face disc. The bezel gives way where a stroke's or a
// hand's cover overlaps its own.
vec4 tptDialShares(vec2 p, float fw, float hands, float onFar){
  float bz = onFar * tptFarBezel(length(p), fw);
  vec3 cov = tptFaceCov(p, fw, hands, 1.0 - bz);
  float marks = min(cov.x + cov.y + cov.z, 1.0);
  bz = min(bz, 1.0 - marks);
  return vec4(cov.x + cov.y, cov.z, bz, 1.0 - marks - bz);
}
// the face's colour at p for a kind (0..3): the ground less the covers, each cover in its own colour
vec3 tptFace(vec2 p, float fw, float kind, float hands){
  int ki = int(clamp(kind, 0.0, 3.0) + 0.5);
  vec3 c = tptFaceCov(p, fw, hands);
  return uTptFaceCol[ki] * (1.0 - c.x - c.y - c.z) + uTptStrokeCol[ki] * (c.x + c.y) + uTptHandCol[ki] * c.z;
}
vec3 tptFace(vec2 p, float fw, float kind){ return tptFace(p, fw, kind, 1.0); }
`,ct=r=>`
attribute float aPart;
attribute float aKind;
varying vec2 vP; varying vec3 vN; varying vec3 vT; varying vec3 vB; varying vec3 vW; varying float vPart; varying float vKind;
#include <common>
#include <fog_pars_vertex>
${r}
void main(){
  #ifdef USE_INSTANCING
    mat4 mm = modelMatrix * instanceMatrix;
  #else
    mat4 mm = modelMatrix;
  #endif
  mm = tptMove(mm);                                                   // the whole dial moves as one body (a watch on its chain); the face law is untouched
  vP = position.xy; vPart = aPart; vKind = aKind;
  mat3 m3 = mat3(mm);
  vN = m3 * normal; vT = m3[0]; vB = m3[1];
  vec4 wp = mm * vec4(position, 1.0);
  vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Tt=r=>`
uniform vec3 uSkyCol; uniform vec3 uGroundCol; uniform vec3 uSunCol; uniform vec3 uSunDir; uniform float uSun;
uniform vec3 uBezelCol; uniform float uHands; uniform float uFar;
varying vec2 vP; varying vec3 vN; varying vec3 vT; varying vec3 vB; varying vec3 vW; varying float vPart; varying float vKind;
#include <common>
#include <fog_pars_fragment>
${kt}
${r}
void main(){
  float lenN = max(length(vN), 1e-6), sc = max(length(vT), 1e-6);
  vec3 N = vN / lenN;
  vec3 V = cameraPosition - vW; V /= max(length(V), 1e-4);
  if (dot(N, V) < 0.0) N = -N;
  float fw = max(length(dFdx(vP)), length(dFdy(vP)));                 // the pixel's width on the face, in dial radii
  float fpW = fw * sc;                                                // and in metres
  float r = length(vP);
  int ki = int(clamp(vKind, 0.0, 3.0) + 0.5);
  float isFace = 1.0 - step(0.5, vPart), isHand = step(1.5, vPart);
  float toMean = 1.0 - smoothstep(${s(.25*D.T)}, ${s(D.T)}, fw);
  // the face and (far disc) the bezel beyond it: every share of the pixel in its own colour, the shares adding to
  // one (the bezel gives way where a stroke's or a hand's cover overlaps its own). A modelled bezel or hand takes
  // its own colour.
  vec4 sh = tptDialShares(vP, fw, uHands, uFar);
  float bz = sh.z, ground = sh.w;                                      // the bezel's share and the bare face's
  vec3 alb = uTptFaceCol[ki] * ground + uTptStrokeCol[ki] * sh.x + uTptHandCol[ki] * sh.y + uBezelCol * bz;
  alb = mix(alb, uBezelCol, (1.0 - isFace) * (1.0 - isHand));
  alb = mix(alb, uTptHandCol[ki], isHand);
  // enamel has a slight dome: the highlight's normal leans outward 0.22 for each dial radius from the hub. Under a
  // pixel wider than 0.35 of a dial radius the highlight is the dome's own mean over the face (radius 0.88): with the
  // half vector on the dial's axis exactly A_n = (1 - (1 + c R^2)^(1 - n/2)) / (c R^2 (n/2 - 1)), c R^2 = 0.0484 x
  // 0.88^2 = 0.037481: A_48 = 0.662366, A_14 = 0.880900. Off the axis the fall with the angle is A FIT, A_n cos^M
  // (M 31.1 for the sun's power 48, 12.3 for the sky's 14): within 0.0041 and 0.0020 of the highlight's peak (1),
  // counted by half degrees from 0 to 40 degrees between the axis and the half vector.
  float domed = isFace * (1.0 - bz);
  vec3 Nd = N + (vT * vP.x + vB * vP.y) / sc * (0.22 * domed);
  Nd /= max(length(Nd), 1e-4);
  float sunShare = uSun * worldSun(vW, N, fpW);
  float through = isFace * (1.0 - bz) * step(1.5, vKind) * step(vKind, 2.5);   // kind 2: glass against the sky, written as it is
  vec3 hemi = mix(uGroundCol, uSkyCol, N.y * 0.5 + 0.5);
  #ifdef TPT_SKY_LIFT
    hemi *= tptSkyLift(vW);                                           // a world's own rise and fall of the sky light, by place and time
  #endif
  #ifdef TPT_FILL
    hemi += tptFill(vW, N);                                           // a world's own fill light, by place (see above)
  #endif
  vec3 col = alb * (hemi + uSunCol * sunShare * max(dot(N, uSunDir), 0.0));
  vec3 Hs = uSunDir + V; Hs /= max(length(Hs), 1e-4);
  vec3 Hz = vec3(0.0, 1.0, 0.0) + V; Hz /= max(length(Hz), 1e-4);
  float gloss = mix(0.5, 1.0, isFace);
  float axS = max(dot(N, Hs), 0.0), axZ = max(dot(N, Hz), 0.0);
  float hs = mix(mix(pow(axS, 48.0), 0.662366 * pow(axS, 31.1), domed), pow(max(dot(Nd, Hs), 0.0), 48.0), toMean);
  float hz = mix(mix(pow(axZ, 14.0), 0.880900 * pow(axZ, 12.3), domed), pow(max(dot(Nd, Hz), 0.0), 14.0), toMean);
  col += gloss * (uSunCol * sunShare * 0.55 * hs + uSkyCol * 0.16 * hz);
  // kind 2: the bare glass shows the sky as it is (unlit); its strokes and hands are lit like any other
  col = mix(col, uTptFaceCol[2] * ground + (alb - uTptFaceCol[2] * ground) * hemi, through);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,It=r=>`
uniform vec3 uSkyCol; uniform vec3 uSunCol; uniform vec3 uSunDir; uniform float uSun;
varying vec3 vN; varying vec3 vT; varying vec3 vW;
#include <common>
#include <fog_pars_fragment>
${r}
void main(){
  vec3 N = vN / max(length(vN), 1e-6);
  vec3 V = cameraPosition - vW; V /= max(length(V), 1e-4);
  if (dot(N, V) < 0.0) N = -N;
  float fpW = max(length(dFdx(vW)), length(dFdy(vW)));
  float g = 1.0 - clamp(dot(N, V), 0.0, 1.0);
  vec3 Hs = uSunDir + V; Hs /= max(length(Hs), 1e-4);
  float sunShare = uSun * worldSun(vW, N, fpW);
  // a domed glass: a soft sheen of sky toward its edge and the sun's soft flash where it mirrors
  vec3 col = uSkyCol * (0.03 + 0.5 * g * g * g) + uSunCol * sunShare * 1.2 * pow(max(dot(N, Hs), 0.0), 90.0);
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float ff = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float ff = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    col *= 1.0 - ff;
  #endif
  gl_FragColor = vec4(col, 1.0);
}`;function Q(){const r=[],t=[],w=[],y={P:r,N:t,A:w,tri(b,a,n,e,l){r.push(b[0],b[1],b[2],a[0],a[1],a[2],n[0],n[1],n[2]);for(let d=0;d<3;d++)t.push(e[0],e[1],e[2]),w.push(l)},quad(b,a,n,e,l,d){y.tri(b,a,n,l,d),y.tri(b,n,e,l,d)},band(b,a,n,e,l,d,g=0){const k=n-b,c=e-a,m=Math.hypot(k,c)||1,M=-c/m,v=k/m;for(let O=0;O<l;O++){const T=g+O/l*Math.PI*2,u=g+(O+1)/l*Math.PI*2,i=Math.cos(T),x=Math.sin(T),h=Math.cos(u),f=Math.sin(u),p=[b*i,b*x,a],I=[b*h,b*f,a],q=[n*i,n*x,e],F=[n*h,n*f,e],C=[M*i,M*x,v],H=[M*h,M*f,v];r.push(...p,...q,...F,...p,...F,...I),t.push(...C,...C,...H,...C,...H,...H);for(let L=0;L<6;L++)w.push(d)}},geometry(b="aPart"){const a=new S.BufferGeometry;return a.setAttribute("position",new S.Float32BufferAttribute(r,3)),a.setAttribute("normal",new S.Float32BufferAttribute(t,3)),a.setAttribute(b,new S.Float32BufferAttribute(w,1)),a}};return y}function dt(r,t,w,y){const b=D,a=w*P,n=[Math.sin(a),Math.cos(a)],e=[Math.cos(a),-Math.sin(a)],l=[0,0,1],d=(v,O)=>[n[0]*v+e[0]*O,n[1]*v+e[1]*O,y],g=v=>Math.max(0,Math.min(t.w0,t.w0*(t.L-v)/(t.L-b.hub))),k=t.ue-t.Ri,c=t.ue+t.Ri;r.quad(d(0,-t.w0),d(b.hub,-t.w0),d(b.hub,t.w0),d(0,t.w0),l,2),r.quad(d(b.hub,-t.w0),d(k,-g(k)),d(k,g(k)),d(b.hub,t.w0),l,2),r.tri(d(c,-g(c)),d(t.L,0),d(c,g(c)),l,2);const m=t.Re/Math.cos(Math.PI/8),M=t.Ri/Math.cos(Math.PI/8);for(let v=0;v<8;v++){const O=(v+.5)*Math.PI/4,T=(v+1.5)*Math.PI/4;r.quad(d(t.ue+M*Math.cos(O),M*Math.sin(O)),d(t.ue+m*Math.cos(O),m*Math.sin(O)),d(t.ue+m*Math.cos(T),m*Math.sin(T)),d(t.ue+M*Math.cos(T),M*Math.sin(T)),l,2)}}function $t(r,t={}){const w=(t.palette||["#F3F0E6","#15191C","#2F6B62","#C8A545","#8FC3EA","#D8432B","#D9D2C0","#1E2F5C"]).map(f=>new S.Color(f)),y=t.sunGLSL||"float worldSun(vec3 wp, vec3 n, float fp){ return 1.0; }",b=t.moveGLSL||"mat4 tptMove(mat4 mm){ return mm; }",a=(f,p=1)=>new S.Vector3(f.r*p,f.g*p,f.b*p),n={uSkyCol:{value:new S.Vector3(.78,.9,1.08)},uGroundCol:{value:new S.Vector3(.46,.47,.5)},uSunCol:{value:new S.Vector3(2.6,2.45,2)},uSunDir:{value:new S.Vector3(.7002,.7071,.0984)},uSun:{value:1},uBezelCol:{value:a(w[3],.8)},uTptFaceCol:{value:[a(w[0],.86),a(w[6],.95),new S.Vector3(.62,.8,1),new S.Vector3(.74,.73,.69)]},uTptStrokeCol:{value:[a(w[1]),a(w[1]),a(w[1]),new S.Vector3(.05,.06,.075)]},uTptHandCol:{value:[a(w[7]),a(w[7]),a(w[7]),a(w[3],.9)]},...t.sunUniforms||{}},e=(f,p)=>new S.ShaderMaterial({uniforms:{...S.UniformsUtils.merge([S.UniformsLib.fog]),...n,uHands:{value:f},uFar:{value:p}},vertexShader:ct(b),fragmentShader:Tt(y),fog:!0,side:S.DoubleSide}),l=D,d=16,g=Math.PI/2,k=l.rFace/Math.cos(Math.PI/d);let c=Q();for(let f=0;f<d;f++){const p=f/d*6.2831853,I=(f+1)/d*6.2831853;c.tri([0,0,0],[Math.cos(p),Math.sin(p),0],[Math.cos(I),Math.sin(I),0],[0,0,1],0)}c.band(k,.012,.945,.085,d,1,g),c.band(.945,.085,1,0,d,1,g);{const f=l.hub*Math.sqrt(Math.PI/(2*Math.SQRT2));for(let p=0;p<8;p++){const I=(p+.5)*Math.PI/4,q=(p+1.5)*Math.PI/4;c.tri([0,0,.025],[f*Math.cos(I),f*Math.sin(I),.025],[f*Math.cos(q),f*Math.sin(q),.025],[0,0,1],2)}}dt(c,l.hour,_.hourDeg,.035),dt(c,l.minute,_.minuteDeg,.05);const m=c.geometry(),M=c.P.length/9;c=Q();for(let H=0;H<12;H++){const L=H/12*6.2831853,R=(H+1)/12*6.2831853,$=(A,E,Z)=>{const V=[Math.cos(A)*Z,Math.sin(A)*Z,1],j=Math.hypot(V[0],V[1],1);return[V[0]/j,V[1]/j,1/j]},z=[0,0,.19],N=[.52*Math.cos(L),.52*Math.sin(L),.148],B=[.52*Math.cos(R),.52*Math.sin(R),.148],U=[.95*Math.cos(L),.95*Math.sin(L),.04],X=[.95*Math.cos(R),.95*Math.sin(R),.04];c.P.push(...z,...N,...B,...N,...U,...X,...N,...X,...B),c.N.push(0,0,1,...$(L,.52,.25),...$(R,.52,.25),...$(L,.52,.25),...$(L,.95,.6),...$(R,.95,.6),...$(L,.52,.25),...$(R,.95,.6),...$(R,.52,.25));for(let A=0;A<9;A++)c.A.push(3)}const v=c.geometry(),O=c.P.length/9,T=new S.ShaderMaterial({uniforms:{...S.UniformsUtils.merge([S.UniformsLib.fog]),...n},vertexShader:ct(b),fragmentShader:It(y),fog:!0,side:S.DoubleSide,transparent:!0,depthWrite:!1,blending:S.AdditiveBlending});c=Q();for(let f=0;f<d;f++){const p=g+f/d*6.2831853,I=g+(f+1)/d*6.2831853;c.tri([0,0,0],[.951*Math.cos(p),.951*Math.sin(p),0],[.951*Math.cos(I),.951*Math.sin(I),0],[0,0,1],0)}c.band(k,0,1,.03,d,1,g);const u=c.geometry(),i=c.P.length/9;c=Q();for(let f=0;f<d;f++){const p=g+f/d*6.2831853,I=g+(f+1)/d*6.2831853;c.tri([0,0,0],[Math.cos(p),Math.sin(p),0],[Math.cos(I),Math.sin(I),0],[0,0,1],0)}const x=c.geometry(),h=c.P.length/9;return{near:{geometry:m,material:e(0,0),glassGeometry:v,glassMaterial:T,triangles:M+O},middle:{geometry:u,material:e(1,0),triangles:i},far:{geometry:x,material:e(1,1),triangles:h},uniforms:n,FACE:D,setSun(f){n.uSun.value=f}}}function Ot(r,t){const w=[];for(const[y,b]of t){let a=y;for(let n=0;n<8;n++){let e=.4*ot(r,a);if(e=.4*ot(r,a+e),a+2*e>b||e<.25)break;w.push(Object.freeze({u:a+e,r:e})),a+=2.45*e}}return Object.freeze(w)}function ot(r,t){const w=r.prof;if(t<=w[0][0])return w[0][1];for(let y=1;y<w.length;y++)if(t<=w[y][0])return w[y-1][1]+(w[y][1]-w[y-1][1])*(t-w[y-1][0])/(w[y][0]-w[y-1][0]);return 0}function ft(r){return r.prof=Object.freeze([[r.u0,r.w0],...r.ua?[[r.ua,r.wa]]:[],[r.u1,r.w1],[r.u2,r.w2],[r.tip,0]]),r.holes=Ot(r,r.spans),Object.freeze(r)}const W=Object.freeze({R:38,ringIn:35.6,opalIn:30.1,minuteIn:29.5,collarOut:11.3,collarIn:9.56,bossOut:9.5,bossIn:6.6,bossProud:2.6,bossBack:.9,bossThroat:2.3,bossMouthIn:6.9,bossMouthOut:9.2,stroke:Object.freeze({uIn:31.2,uOut:35.2,hIn:.42,hOut:.95}),quarter:Object.freeze({uIn:30.35,uOut:35.35,hIn:.62,hOut:1.55}),bars:24,barH:.15,rings:Object.freeze([14.5,19.5,24.5]),ringH:.15,minute:ft({tip:33.5,u0:11.3,w0:1.7,ua:14.5,wa:1.1,u1:29,w1:.8,u2:30.4,w2:1.6,ue:22.33,Re:2.5,Ri:1.5,z:2.4,tailU:14.2,tw0:1.5,tw1:1.15,cu:15.3,cr:2,spans:[[12.3,14.35],[14.65,18.9]]}),hour:ft({tip:23,u0:11.3,w0:2.6,u1:18.8,w1:1.5,u2:20,w2:2.2,ue:15.33,Re:3,Ri:1.8,z:1.3,tailU:14,tw0:2,tw1:1.5,cu:15.1,cr:2.4,spans:[]})}),mt=r=>(r*Math.sqrt(W.collarOut*W.collarOut-r*r)+W.collarOut*W.collarOut*Math.asin(r/W.collarOut))/(2*r);function pt(r,t){const w=t.prof;let y="0.0";for(let e=w.length-1;e>=1;e--)y=`(ub <= ${s(w[e][0])} ? mix(${s(w[e-1][1])}, ${s(w[e][1])}, clamp((ub - ${s(w[e-1][0])}) / ${s(w[e][0]-w[e-1][0])}, 0.0, 1.0)) : ${y})`;const b=t.holes.map(e=>`  open += tptDisc(length(vec2(u - ${s(e.u)}, v)), ${s(e.r)}, w);`).join(`
`),a=mt(t.w0),n=mt(t.tw0);return`
float ${r}(vec2 q, float a, float w){
  float sa = sin(a), ca = cos(a);
  float u = q.x * sa + q.y * ca, v = abs(q.x * ca - q.y * sa), t = -u;
  // blade and tail begin at their straight cuts (see above); short of a cut the outline is read at its mirror place
  float ub = ${s(a)} + abs(u - ${s(a)}), tb = ${s(n)} + abs(t - ${s(n)});
  // the outline's half width: blade (cut to the point), the eye's ring, the tail's stub and its weight
  float Hb = ${y};
  float He = sqrt(max(${s(t.Re*t.Re)} - (ub - ${s(t.ue)}) * (ub - ${s(t.ue)}), 0.0));
  float Ht = mix(${s(t.tw0)}, ${s(t.tw1)}, clamp((tb - ${s(t.u0)}) / ${s(t.tailU-t.u0)}, 0.0, 1.0)) * step(tb, ${s(t.tailU)});
  float Hc = sqrt(max(${s(t.cr*t.cr)} - (tb - ${s(t.cu)}) * (tb - ${s(t.cu)}), 0.0));
  float solid = tptBox(v, max(Hb, He), w) * tptEdge(${s(a)} - u, w) + tptBox(v, max(Ht, Hc), w) * tptEdge(${s(n)} - t, w);
  // what is pierced: the eye's bore and the round piercings of the web
  float open = tptDisc(length(vec2(u - ${s(t.ue)}, v)), ${s(t.Ri)}, w);
${b}
  float collar = tptBox(length(q) - ${s((o.collarIn+o.collarOut)/2)}, ${s((o.collarOut-o.collarIn)/2)}, w);
  return min(max(solid - open, 0.0) + collar, 1.0);
}`}const o=W,Rt=.92,vt=r=>(2*r.hIn+2*r.hOut)/2*(r.uOut-r.uIn),qt=(8*vt(o.stroke)+4*vt(o.quarter))/(Math.PI*(o.ringIn*o.ringIn-o.opalIn*o.opalIn)),gt=et+pt("tptGreatMinute",o.minute)+pt("tptGreatHour",o.hour)+`
uniform vec3 uTptC;        // the dial's centre, world
uniform vec3 uTptN;        // its facing (unit, toward the read side), world
uniform float uTptR;       // its radius, world metres
uniform vec3 uTptSun;      // direction to the sun, world
uniform vec2 uTptHands;    // the two hands' present angles, radians clockwise from twelve: (minute, hour)
uniform float uTptGable;   // the open share of the gable outside the dial's circle
uniform float uTptBore;    // the share that passes the hub's bore
uniform float uTptPen;     // the sun's width: metres of blur for each metre between the dial and the lit place
// bars of half width h, one every T, centred on the multiples of T: the box mean over [x - w/2, x + w/2]
float tptLinesF(float y, float T, float h){ float k = floor(y / T); return k * 2.0 * h + min(y - k * T, 2.0 * h); }
float tptLines(float x, float T, float h, float w){ return clamp((tptLinesF(x + 0.5 * w + h, T, h) - tptLinesF(x - 0.5 * w + h, T, h)) / w, 0.0, 1.0); }
float tptGreatStrokes(vec2 q, float w){
  float k = floor(atan(q.x, q.y) / 0.5235988 + 0.5);
  float a = k * 0.5235988, sa = sin(a), ca = cos(a);
  float u = q.x * sa + q.y * ca, v = abs(q.x * ca - q.y * sa);
  float qt = 1.0 - step(0.5, abs(mod(k + 12.0, 3.0)));
  float uIn = mix(${s(o.stroke.uIn)}, ${s(o.quarter.uIn)}, qt), uOut = mix(${s(o.stroke.uOut)}, ${s(o.quarter.uOut)}, qt);
  float hIn = mix(${s(o.stroke.hIn)}, ${s(o.quarter.hIn)}, qt), hOut = mix(${s(o.stroke.hOut)}, ${s(o.quarter.hOut)}, qt);
  float h = mix(hIn, hOut, clamp((u - uIn) / (uOut - uIn), 0.0, 1.0));
  return tptBox(v, h, w) * tptBox(u - 0.5 * (uIn + uOut), 0.5 * (uOut - uIn), w);
}
// the light that passes the opal ring with its strokes at q: half of what the strokes leave of the ring's cover
float tptOpalLight(vec2 q, float w){
  float opal = tptBox(length(q) - ${s((o.ringIn+o.opalIn)/2)}, ${s((o.ringIn-o.opalIn)/2)}, w);
  // strokes: period, their spacing, 2 pi 33 / 12 = 17.3
  float cs = mix(${s(qt)} * opal, tptGreatStrokes(q, min(w, 12.0)), 1.0 - smoothstep(${s(.25*17.3)}, 17.3, w));
  return 0.5 * max(opal - cs, 0.0);
}
// the share of light that passes the dial's glass and fixed iron (rim, opal ring, web, boss and bore; the hands and
// their collars stand before the glass and are no part of this) for a ray that meets the glass's plane at q (dial
// metres from the centre) under a pixel of width w. d is the ray's drift across the dial for each metre before
// the glass: z before the glass the ray stands at q + d z, z behind it at q - d z. dep: how far before the glass
// the ray begins.
// THE BOSS IS TAKEN THROUGH ITS DEPTH, AS IT IS BUILT. The boss ring stands from ${s(o.bossBack)} behind the glass to its
// mouth ${s(o.bossProud)} before it. Its bore keeps the radius ${s(o.bossIn)} from its back to ${s(o.bossThroat)} before the glass and opens from
// there to ${s(o.bossMouthIn)} at the mouth; its outer side keeps ${s(o.bossOut)} as far and comes in to ${s(o.bossMouthOut)} at the mouth. The ray
// passes the bore only if it stands inside ${s(o.bossIn)} at the back and at ${s(o.bossThroat)}, and inside ${s(o.bossMouthIn)} at the mouth; the boss
// stops it wherever it comes within ${s(o.bossOut)} of the axis between the back and ${s(o.bossThroat)}, or within ${s(o.bossMouthOut)} at the mouth; the
// web's glass begins where the boss ends.
// THE ROUNDS KEEP THEIR AREAS. The rim and the bore's three rounds are filtered by tptDisc, which keeps each round's
// area under any footprint (the area, not the shape of the round's mean under a footprint wider than the round).
// The bore's cover is the least of the three: exact where the ray is square on to the dial; under the world's sun
// (the ray drifts 0.14 and 1.01 m across the dial for each metre before the glass) the three stand apart, the lit
// shape is a lens of 94.21 square metres, and the least of the three stands over the lens's own area by 1.0005,
// 1.0042, 1.0117, 1.0305 and 1.0720 at footprints of 1, 3, 5, 8 and 12 m; its exact form would be the lens's own
// closed mean. The web's glass is the ring between the boss and the minute ring less its three rings, which lie
// wholly inside it, times the open share between the bars.
float tptDialGlass(vec2 q, vec2 d, float dep, float w){
  float r = length(q);
  float outside = 1.0 - tptDisc(r, ${s(o.R)}, w);
  vec2 qa = q + d * min(${s(o.bossThroat)}, dep), qm = q + d * min(${s(o.bossProud)}, dep), qb = q - d * ${s(o.bossBack)}, e = qb - qa;
  float bore = min(min(tptDisc(length(qa), ${s(o.bossIn)}, w), tptDisc(length(qb), ${s(o.bossIn)}, w)), tptDisc(length(qm), ${s(o.bossMouthIn)}, w));
  float boss = max(tptEdge(length(qa + e * clamp(-dot(qa, e) / max(dot(e, e), 1e-6), 0.0, 1.0)) - ${s(o.bossOut)}, w), tptEdge(length(qm) - ${s(o.bossMouthOut)}, w));
  float web = tptEdge(r - ${s(o.minuteIn)}, w) * (1.0 - boss);
  float light = uTptGable * outside + uTptBore * bore;
  if (r > 1.0) {
    light += tptOpalLight(q, w);
    // the web: 24 radial bars measured along the arc, and three rings that lie wholly inside the web's ring: the
    // glass is the ring less its rings, times the open share between the bars
    float arc = (atan(q.x, q.y) + 3.14159265) * r;
    float bars = tptLines(arc, r * ${s(2*Math.PI/o.bars)}, ${s(o.barH)}, w);
    float rings = min(tptBox(r - ${s(o.rings[0])}, ${s(o.ringH)}, w) + tptBox(r - ${s(o.rings[1])}, ${s(o.ringH)}, w) + tptBox(r - ${s(o.rings[2])}, ${s(o.ringH)}, w), 1.0);
    light += ${s(Rt)} * max(web - rings, 0.0) * (1.0 - bars);
  }
  return light;
}
// THE BOSS BEFORE A HAND, for an eye on the read side (a mirror's): the share of a hand's figure, read in its plane
// z before the glass, that the boss hides. The eye's ray (at q + d z' at z' before the glass, begun dep before it)
// has passed the boss's body between its mouth and the hand's plane if it stands inside the boss's outer side at
// ${s(o.bossThroat)} or at the mouth and outside it in the hand's own plane.
float tptBossBefore(vec2 q, vec2 d, float z, float dep, float w){
  float far = max(tptEdge(length(q + d * clamp(dep, z, max(z, ${s(o.bossThroat)}))) - ${s(o.bossOut)}, w), tptEdge(length(q + d * clamp(dep, z, max(z, ${s(o.bossProud)}))) - ${s(o.bossMouthOut)}, w));
  return max(far - tptEdge(length(q + d * z) - ${s(o.bossOut)}, w), 0.0);
}
// EACH HAND IN ITS OWN PLANE: the ray toward the sun meets the minute hand's plane ${s(o.minute.z)} and the hour hand's ${s(o.hour.z)}
// (dial metres) before it meets the glass, so on the dial each hand, with its collar, is read at the glass's point
// q moved by that depth times d, d = (the sun's direction across the dial) / (its direction through it). So a
// hand's shadow lies that much FURTHER from the dial's foot than its figure in the glass's plane would (on a
// level floor by the hand's own depth, 2.4 m and 1.3 m), and higher on the dial. A hand shades only a place whose
// ray toward the sun meets the hand's plane: a place that stands between that plane and the glass (dep less than
// the hand's depth) is not shaded by it; the change is taken by the same footprint as the rest.
float tptDialLight(vec3 wp, float fp){
  float dn = min(dot(uTptSun, uTptN), -1e-4);                  // the sun stands behind the dial
  float t = dot(uTptC - wp, uTptN) / dn;                       // metres along the ray to the dial's plane
  if (t <= 0.0) return 1.0;                                    // the place is not on the read side
  vec3 Q = wp + uTptSun * t - uTptC;
  vec3 X = cross(vec3(0.0, 1.0, 0.0), uTptN); X /= max(length(X), 1e-4);   // three o'clock, as the dial is read
  vec3 Y = cross(uTptN, X);
  float k = 38.0 / max(uTptR, 1e-3);
  vec2 q = vec2(dot(Q, X), dot(Q, Y)) * k, d = vec2(dot(uTptSun, X), dot(uTptSun, Y)) / dn;
  float w = max((fp + uTptPen * t) * k, 1e-4), dep = -t * dn * k;      // dep: the place's own depth before the glass, dial metres
  return tptDialGlass(q, d, dep, w) * (1.0 - tptGreatMinute(q + d * ${s(o.minute.z)}, uTptHands.x, w) * tptEdge(${s(o.minute.z)} - dep, w))
    * (1.0 - tptGreatHour(q + d * ${s(o.hour.z)}, uTptHands.y, w) * tptEdge(${s(o.hour.z)} - dep, w));
}
`;function Y(){const r=[],t=[],w=[],y=(a,n,e)=>{r.push(a[0],a[1],a[2]),t.push(n[0],n[1],n[2]),w.push(e[0],e[1],e[2])},b={P:r,N:t,C:w,get triangles(){return r.length/9},tri(a,n,e,l){const d=n[0]-a[0],g=n[1]-a[1],k=n[2]-a[2],c=e[0]-a[0],m=e[1]-a[1],M=e[2]-a[2];let v=[g*M-k*m,k*c-d*M,d*m-g*c];const O=Math.hypot(v[0],v[1],v[2])||1;v=[v[0]/O,v[1]/O,v[2]/O],y(a,v,l),y(n,v,l),y(e,v,l)},quad(a,n,e,l,d){b.tri(a,n,e,d),b.tri(a,e,l,d)},lathe(a,n,e,l=0,d=0){for(let g=0;g<a.length-1;g++){const[k,c]=a[g],[m,M]=a[g+1],v=m-k,O=M-c,T=Math.hypot(v,O)||1,u=-O/T,i=v/T,x=typeof e=="function"?e(g):e;for(let h=0;h<n;h++){const f=h/n*6.283185307,p=(h+1)/n*6.283185307,I=Math.cos(f),q=Math.sin(f),F=Math.cos(p),C=Math.sin(p),H=[l+k*I,d+k*q,c],L=[l+k*F,d+k*C,c],R=[l+m*I,d+m*q,M],$=[l+m*F,d+m*C,M],z=[u*I,u*q,i],N=[u*F,u*C,i];k>1e-6&&(y(H,z,x),y(R,z,x),y(L,N,x)),m>1e-6&&(y(L,N,x),y(R,z,x),y($,N,x))}}},prism(a,n,e,l,d,g=(c,m,M)=>[c,m,M],k=d){const c=a.length,m=[];for(let i=0;i<c;i++){const x=a[i],h=a[(i+c-1)%c],f=a[(i+1)%c];let p=[x[0]-h[0],x[1]-h[1]],I=[f[0]-x[0],f[1]-x[1]];const q=Math.hypot(p[0],p[1])||1,F=Math.hypot(I[0],I[1])||1;p=[p[0]/q,p[1]/q],I=[I[0]/F,I[1]/F];const C=[-p[1],p[0]],H=[-I[1],I[0]],L=l/Math.max(.35,1+C[0]*H[0]+C[1]*H[1]);m.push([x[0]+(C[0]+H[0])*L,x[1]+(C[1]+H[1])*L])}let M=0,v=0;for(const i of a)M+=i[0]/c,v+=i[1]/c;const O=Math.hypot(a[0][0]-M,a[0][1]-v);if(Math.hypot(m[0][0]-M,m[0][1]-v)>O)for(let i=0;i<c;i++)m[i]=[2*a[i][0]-m[i][0],2*a[i][1]-m[i][1]];const u=e-l;for(let i=1;i<c-1;i++)b.tri(g(m[0][0],m[0][1],e),g(m[i][0],m[i][1],e),g(m[i+1][0],m[i+1][1],e),k);for(let i=0;i<c;i++){const x=(i+1)%c;b.quad(g(a[i][0],a[i][1],u),g(a[x][0],a[x][1],u),g(m[x][0],m[x][1],e),g(m[i][0],m[i][1],e),d),b.quad(g(a[i][0],a[i][1],n),g(a[x][0],a[x][1],n),g(a[x][0],a[x][1],u),g(a[i][0],a[i][1],u),d)}},bolt(a,n,e,l,d,g,k=0,c=(m,M,v)=>[m,M,v]){const m=(T,u)=>{const i=[];for(let x=0;x<6;x++){const h=k+x*1.0471976;i.push(c(a+T*Math.cos(h),n+T*Math.sin(h),u))}return i},M=m(l,e),v=m(l,e+d*.7),O=m(l*.72,e+d);for(let T=0;T<6;T++){const u=(T+1)%6;b.quad(M[T],M[u],v[u],v[T],g),b.quad(v[T],v[u],O[u],O[T],g)}for(let T=1;T<5;T++)b.tri(O[0],O[T],O[T+1],g)},nut(a,n,e,l,d,g,k=0,c=(m,M,v)=>[m,M,v]){const m=(u,i)=>{const x=[];for(let h=0;h<4;h++){const f=k+h*1.5707963;x.push(c(a+u*Math.cos(f),n+u*Math.sin(f),i))}return x},M=m(l,e),v=m(l*.8,e+d*.7),O=m(l*.42,e+d*.7),T=c(a,n,e+d);for(let u=0;u<4;u++){const i=(u+1)%4;b.quad(M[u],M[i],v[i],v[u],g),b.tri(O[u],O[i],T,g)}b.quad(v[0],v[1],v[2],v[3],g)},gusset(a,n,e,l,d,g,k,c,m,M,v,O,T=(u,i,x)=>[u,i,x]){const u=T(a,-e,c),i=T(n,-l,c),x=T(n,l,c),h=T(a,e,c),f=T(a+k,-d,m),p=T(n-k,-g,M),I=T(n-k,g,M),q=T(a+k,d,m);b.quad(u,i,p,f,v),b.quad(h,x,I,q,v),b.quad(f,p,I,q,O),b.quad(u,f,q,h,v),b.quad(i,x,I,p,v)},rivet(a,n,e,l,d,g,k=(c,m,M)=>[c,m,M]){const c=k(a,n,e+d),m=k(0,0,1),M=k(0,0,0),v=[m[0]-M[0],m[1]-M[1],m[2]-M[2]];for(let O=0;O<6;O++){const T=O*1.0471976,u=(O+1)*1.0471976,i=k(a+l*Math.cos(T),n+l*Math.sin(T),e),x=k(a+l*Math.cos(u),n+l*Math.sin(u),e),h=k(a,n,e),f=p=>{const I=[p[0]-h[0]+v[0]*l*.6,p[1]-h[1]+v[1]*l*.6,p[2]-h[2]+v[2]*l*.6],q=Math.hypot(I[0],I[1],I[2])||1;return[I[0]/q,I[1]/q,I[2]/q]};y(i,f(i),g),y(x,f(x),g),y(c,v,g)}},geometry(){const a=new S.BufferGeometry;return a.setAttribute("position",new S.Float32BufferAttribute(r,3)),a.setAttribute("normal",new S.Float32BufferAttribute(t,3)),a.setAttribute("aCol",new S.Float32BufferAttribute(w,3)),a}};return b}const nt=r=>{const t=r*P,w=Math.sin(t),y=Math.cos(t);return(b,a,n)=>[b*w+a*y,b*y-a*w,n]},rt=`
attribute vec3 aCol;
varying vec3 vCol; varying vec3 vN; varying vec3 vW; varying vec3 vO;
#include <common>
#include <fog_pars_vertex>
void main(){
  vCol = aCol; vO = position; vN = mat3(modelMatrix) * normal;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,bt=`
float tptHash3(vec3 p){ return fract(sin(dot(p, vec3(99.7, 287.9, 73.1))) * 46210.1010); }
float tptHash1(float x){ return fract(sin(x * 97.0113) * 45210.3581); }
// value noise: a blend, with weights that sum to one, of values spread evenly over 0..1, so its mean is one half by
// its form. Counted in single precision: the three-number hash's mean over every whole-number point to 40 either way
// is 0.4987, the one-number hash's over the whole numbers -700 to 699 is 0.4989, and the noise's over 8,000,000 places
// at random (x, y in -30..30, z in 0..20) is 0.4983.
float tptNoise3(vec3 p){
  vec3 i = floor(p), u = fract(p); u = u * u * (3.0 - 2.0 * u);
  return mix(mix(mix(tptHash3(i), tptHash3(i + vec3(1.0, 0.0, 0.0)), u.x), mix(tptHash3(i + vec3(0.0, 1.0, 0.0)), tptHash3(i + vec3(1.0, 1.0, 0.0)), u.x), u.y),
             mix(mix(tptHash3(i + vec3(0.0, 0.0, 1.0)), tptHash3(i + vec3(1.0, 0.0, 1.0)), u.x), mix(tptHash3(i + vec3(0.0, 1.0, 1.0)), tptHash3(i + vec3(1.0, 1.0, 1.0)), u.x), u.y), u.z);
}`,Ht=`
uniform vec3 uSkyCol; uniform vec3 uGroundCol; uniform vec3 uSunCol; uniform vec3 uSunDir; uniform float uSun;
uniform float uHemiGain; uniform float uSelf; uniform float uSheen; uniform float uSunGain; uniform float uSeed; uniform float uHaze; uniform float uBore;
varying vec3 vCol; varying vec3 vN; varying vec3 vW; varying vec3 vO;
#include <common>
#include <fog_pars_fragment>
${bt}
void main(){
  vec3 N = vN / max(length(vN), 1e-6);
  vec3 V = cameraPosition - vW; V /= max(length(V), 1e-4);
  if (dot(N, V) < 0.0) N = -N;
  float fp = max(length(dFdx(vO)), length(dFdy(vO)));                 // the pixel's width on the iron, metres
  // paint: a breakup of period 1.6 m, 9 per cent either way about the plain colour. The noise's mean counts 0.497 to
  // 0.499 by the region, so the factor's mean is 0.9995 to 0.9998: a wide pixel's plain colour is at most 0.0005 over.
  float toMean = 1.0 - smoothstep(0.4, 1.6, fp);
  vec3 alb = vCol * (1.0 + 0.18 * (tptNoise3(vO / 1.6 + uSeed) - 0.5) * toMean);
  vec3 hemi = mix(uGroundCol, uSkyCol, N.y * 0.5 + 0.5) * uHemiGain;
  // the boss's bore (the fixed iron alone, uBore 1; all that stands within 6.76 of the dial's centre): the sky's
  // light falls with depth into it, whole at the mouth (${s(o.bossProud)} before the glass) and 0.35 of it at the back (${s(o.bossBack)} behind)
  vec2 qb = vO.xy - vec2(0.0, ${s(o.R)});
  hemi *= mix(1.0, 0.35 + 0.65 * clamp((vO.z + ${s(o.bossBack)}) / ${s(o.bossProud+o.bossBack)}, 0.0, 1.0), uBore * step(dot(qb, qb), 6.76 * 6.76));
  vec3 col = alb * (hemi + uSunCol * (uSun * uSunGain * max(dot(N, uSunDir), 0.0)) + uSelf);
  float g = 1.0 - clamp(dot(N, V), 0.0, 1.0);
  col += uSkyCol * (uSheen * g * g * g * g);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
  gl_FragColor.rgb = mix(col, gl_FragColor.rgb, uHaze);               // uHaze 1: the scene's haze whole; the hands take half
}`,Ct=`
uniform vec3 uOpalCol; uniform float uOpalGlow; uniform float uSun; uniform float uTime;
varying vec3 vCol; varying vec3 vN; varying vec3 vW; varying vec3 vO;
#include <common>
#include <fog_pars_fragment>
void main(){
  vec2 q = vO.xy - vec2(0.0, ${s(o.R)});
  float t = clamp((length(q) - ${s(o.opalIn)}) / ${s(o.ringIn-o.opalIn)}, 0.0, 1.0);
  float band = 4.0 * t * (1.0 - t);                                   // a soft depth: the opal is brightest along its middle (mean of the band 2/3)
  // its iron frame (the rim ring outside, the minute ring inside) casts a thin shade on its two edges, 0.33 wide
  // (0.06 of the ring's width) and four tenths deep at the edge: 2.4 per cent of the ring. It is never drawn
  // narrower than the pixel; where it is drawn wider it is shallower by the same factor (and no wider than the
  // ring), so that it takes the same 2.4 per cent at every distance.
  float fp = max(length(dFdx(vO.xy)), length(dFdy(vO.xy))) / ${s(o.ringIn-o.opalIn)};
  float ew = min(max(0.06, fp), 1.0);
  float shade = 1.0 - (0.4 * 0.06 / ew) * ((1.0 - smoothstep(0.0, ew, t)) + (1.0 - smoothstep(0.0, ew, 1.0 - t)));
  float lift = 0.94 + 0.06 * clamp(q.y / ${s(o.R)}, -1.0, 1.0);       // a little more sky behind its upper half
  float milk = 0.96 + 0.04 * sin(q.x * 0.21 + 1.3 + uTime * 0.11) * sin(q.y * 0.17 + 0.4 - uTime * 0.07);   // the light behind the opal drifts, 4 per cent either way
  vec3 col = uOpalCol * (uOpalGlow * (0.50 + 0.56 * band) * shade * lift * milk * mix(0.86, 1.0, uSun));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Ft=`
uniform vec3 uSkyCol; uniform float uTime; uniform float uRain;
varying vec3 vCol; varying vec3 vN; varying vec3 vW; varying vec3 vO;
#include <common>
#include <fog_pars_fragment>
${et}
${bt}
void main(){
  vec3 N = vN / max(length(vN), 1e-6);
  vec3 V = cameraPosition - vW; V /= max(length(V), 1e-4);
  float g = 1.0 - abs(dot(N, V));
  vec2 q = vO.xy - vec2(0.0, ${s(o.R)});
  float fp = max(max(length(dFdx(vO.xy)), length(dFdy(vO.xy))), 1e-4);
  float sheen = 0.5 + 0.5 * sin((q.x * 0.6 + q.y) * 0.085 + 0.7 + uTime * 0.12);   // one broad soft band of sky sheen, drifting slowly across the whole dial
  float a = 0.03 + 0.05 * sheen * sheen + 0.30 * g * g * g;
  // sheets: period 4.5 m, mean 0.5
  float sheet = mix(0.5, tptNoise3(vec3(q.x * 0.22, q.y * 0.10 + uTime * 0.55, 3.7)), 1.0 - smoothstep(1.125, 4.5, fp));
  // threads: period 0.8 m, typed mean 0.075 (worked out above)
  float ci = floor(q.x / 0.8), h1 = tptHash1(ci), h2 = tptHash1(ci + 17.3), h3 = tptHash1(ci + 51.9);
  float xl = q.x - (ci + 0.5) * 0.8 - (h1 - 0.5) * 0.4 - 0.04 * sin(q.y * 1.7 + h2 * 40.0);
  float dash = 0.5 + 0.5 * sin(q.y * (0.9 + 0.6 * h2) + uTime * (2.2 + 1.5 * h3) + h1 * 6.2831853);
  float thread = mix(0.075, tptBox(xl, 0.06, fp) * dash, 1.0 - smoothstep(0.2, 0.8, fp));
  // The water lies on the glass in layers, each linear in its own pattern, so a wide pixel holds the layers' means.
  // A sheet is a film that dims what lies behind it to a deep blue-grey (0.55 of it at its thickest); a thread, over
  // both, catches the sky's light (0.9 of it, brighter than the sky behind). The sheet's shape is sharpened about its
  // mean: smoothstep(0.3, 0.7, n) is odd about 0.5, as the noise is, so its mean stays 0.5.
  float sh = smoothstep(0.30, 0.70, sheet), aS = uRain * 0.55 * sh, aT = uRain * 0.9 * thread;
  vec3 pre = uSkyCol * (0.95 * a + 0.5 * aS);                         // sheen and sheet, colour times cover
  a += aS;
  pre = pre * (1.0 - aT) + uSkyCol * (1.6 * aT);                      // the thread over both
  a += (1.0 - a) * aT;
  gl_FragColor = vec4(pre / max(a, 1e-4), clamp(a, 0.0, 1.0));
  #include <fog_fragment>
}`,Dt={green:null,prussian:"#35609C",graphite:"#55606B"};function*Lt(r,t,w,y){const b=o.R,a=u=>{const i=nt(u);return(x,h,f)=>{const p=i(x,h,f);return[p[0],p[1]+b,p[2]]}},{base:n,light:e,dark:l,bolt:d,black:g,blackLight:k,hub:c,hubDark:m,hubLight:M}=t;r.lathe([[35.6,0],[35.6,.8],[35.9,1.05],[36.45,1.05],[36.6,.6],[37.15,.6],[37.3,1.3],[37.75,1.3],[38,1.05],[38,-.9],[35.6,-.9],[35.6,0]],120,u=>[l,e,n,l,l,n,e,n,n,l,l][u],0,b);for(let u=0;u<96;u++)r.nut(36.875,0,.6,.2,.24,d,w()*1.05,a(u*3.75+1.875));for(let u=0;u<24;u++){const i=a(u*15+7.5);r.prism([[35.75,-.75],[37.9,-.75],[37.9,.75],[35.75,.75]],.6,1.52,.1,n,i,e);for(const[x,h]of[[36.2,-.42],[36.2,.42],[37.5,-.42],[37.5,.42]])r.nut(x,h,1.52,.15,.17,d,w()*1.05,i)}yield;for(let u=0;u<12;u++){const i=u%3===0?o.quarter:o.stroke,x=a(u*30);r.prism([[i.uIn,-i.hIn],[i.uOut,-i.hOut],[i.uOut,i.hOut],[i.uIn,i.hIn]],.1,.7,.14,g,x,k),r.prism([[i.uIn+.5,-i.hIn*.42],[i.uOut-.5,-i.hOut*.5],[i.uOut-.5,i.hOut*.5],[i.uIn+.5,i.hIn*.42]],.7,.94,.08,g,x,k);for(const[h,f]of[[i.uIn+.26,-i.hIn*.6],[i.uIn+.26,i.hIn*.6],[i.uOut-.28,-i.hOut*.74],[i.uOut-.28,i.hOut*.74]])r.rivet(h,f,.7,.09,.07,k,x)}yield,r.lathe([[29.5,0],[29.5,.48],[29.62,.6],[29.98,.6],[30.1,.48],[30.1,0]],120,u=>[l,e,n,e,l][u],0,b);for(let u=0;u<60;u++)r.rivet(29.8,0,.6,.13,.1,d,a(u*6));yield;const v=o.barH-.08;for(let u=0;u<o.bars;u++){const i=a(u*15);r.prism([[9.45,-o.barH],[29.55,-o.barH],[29.55,o.barH],[9.45,o.barH]],-.25,.2,.03,n,i,l);for(const x of[-1,1])r.prism([[9.45,x*v],[29.55,x*v],[29.55,x*o.barH],[9.45,x*o.barH]],.2,.34,.03,n,i,e)}yield;const O=Math.max(2,Math.round(3*y));for(const u of o.rings){r.lathe([[u-o.ringH,-.25],[u-o.ringH,.26],[u-.08,.34],[u+.08,.34],[u+o.ringH,.26],[u+o.ringH,-.25]],96,i=>[l,n,e,n,l][i],0,b);for(let i=0;i<o.bars;i++){const x=a(i*15);r.prism([[u-.34,-.34],[u+.34,-.34],[u+.34,.34],[u-.34,.34]],.3,.46,.06,n,x,e),r.bolt(u,0,.46,.15,.18,d,w()*1.05,x);for(let h=1;h<=O;h++)r.rivet(u,0,.34,.07,.06,d,a(i*15+15*h/(O+1)))}yield}yield,r.lathe([[o.bossIn,-o.bossBack],[6.6,.6],[6.75,.75],[6.75,1.5],[6.6,1.65],[o.bossIn,o.bossThroat],[o.bossMouthIn,o.bossProud],[7.4,2.6],[7.62,2.15],[8.28,2.15],[8.5,2.6],[o.bossMouthOut,o.bossProud],[o.bossOut,o.bossThroat],[o.bossOut,-o.bossBack],[o.bossIn,-o.bossBack]],96,u=>[m,m,m,m,m,m,c,m,m,m,c,M,c,m][u],0,b);for(let u=0;u<24;u++){const i=a(u*15+7.5),x=w()*1.05;r.bolt(7.95,0,2.15,.33,.09,M,x+.5,i),r.bolt(7.95,0,2.24,.27,.55,d,x,i)}const T=Math.max(24,Math.round(48*y));for(let u=0;u<T;u++)r.rivet(8.84,0,2.6,.1,.08,d,a(u*360/T)),r.rivet(7.18,0,2.6,.085,.07,d,a((u+.5)*360/T))}function zt(r,t,w,y,b,a){const n=t.length;if(!w){for(let c=1;c<n-1;c++)r.tri(a(t[0][0],t[0][1],y),a(t[c][0],t[c][1],y),a(t[c+1][0],t[c+1][1],y),b);return}const[e,l,d]=w,g=[];for(let c=0;c<16;c++)g.push(c/16*6.283185307+.01);for(const c of t)g.push(Math.atan2(c[1]-l,c[0]-e));g.sort((c,m)=>(c%6.283185307+6.283185307)%6.283185307-(m%6.283185307+6.283185307)%6.283185307);const k=c=>{const m=Math.cos(c),M=Math.sin(c);let v=1e9;for(let O=0;O<n;O++){const T=t[O],u=t[(O+1)%n],i=u[0]-T[0],x=u[1]-T[1],h=m*x-M*i;if(Math.abs(h)<1e-9)continue;const f=((T[0]-e)*x-(T[1]-l)*i)/h,p=((T[0]-e)*M-(T[1]-l)*m)/h;f>0&&p>=-1e-6&&p<=1+1e-6&&f<v&&(v=f)}return[e+m*v,l+M*v]};for(let c=0;c<g.length;c++){const m=g[c],M=g[(c+1)%g.length],v=k(m),O=k(M);r.quad(a(e+d*Math.cos(m),l+d*Math.sin(m),y),a(v[0],v[1],y),a(O[0],O[1],y),a(e+d*Math.cos(M),l+d*Math.sin(M),y),b)}}function Nt(r,t,w,y,b=!0){const a=(h,f,p)=>[f,h,p],n=t.z,{verm:e,vermLight:l,vermDark:d}=w,g=[e[0]*.85,e[1]*.85,e[2]*.85],k=h=>h<=t.u0?t.w0:ot(t,h),c=h=>Math.min(.55,Math.max(.2,.28*k(h))),m=10.5;if(r.lathe([[o.collarIn,n-.3],[o.collarIn,n+.3],[9.8,n+.36],[10.5,n+.36],[10.62,n+.24],[11.1,n+.24],[11.3,n+.1],[11.3,n-.3],[o.collarIn,n-.3]],72,h=>[d,l,e,d,e,l,e,d][h]),b){for(let f=0;f<24;f++){const p=f*15*P;r.gusset(9.78,11.18,.34,.2,.07,.05,.06,n+.1,n+.7,n+.36,d,l,nt(f*15+7.5)),r.bolt(10.88*Math.sin(p),10.88*Math.cos(p),n+.24,.23,.26,l,p)}const h=Math.max(24,Math.round(48*y));for(let f=0;f<h;f++)r.rivet(10.15,0,n+.36,.08,.065,l,nt((f+.5)*360/h))}r.prism([[11,-(t.w0-.62)],[12,-(k(12)-.66)],[12,k(12)-.66],[11,t.w0-.62]],n,n+.2,.06,e,a,l);for(const h of[-.55,0,.55])for(const f of[11.42,11.78])r.bolt(h*(t.w0-.9)/.55,f,n+.2,.11,.14,l,.4);const M=[m,...t.prof.slice(0,-1).map(h=>h[0])],v=h=>{let f=t.Ri;for(let p=0;p<8;p++){const I=k(t.ue+h*f)-c(t.ue+h*f);f=I<t.Ri?Math.sqrt(t.Ri*t.Ri-I*I):0}return f},O=v(-1),T=v(1);for(const h of[-1,1]){for(let p=0;p<M.length-1;p++){const I=M[p],q=M[p+1],F=I<t.ue&&q>t.ue&&(O>0||T>0)?[[I,t.ue-O],[t.ue+T,q]]:[[I,q]];for(const[C,H]of F)r.prism([[C,h*k(C)],[H,h*k(H)],[H,h*(k(H)-c(H))],[C,h*(k(C)-c(C))]],n-.3,n+.3,.07,e,a,l)}r.prism([[t.u2,h*t.w2],[t.tip,0],[t.u2,h*(t.w2-c(t.u2))]],n-.3,n+.3,.07,e,a,l);const f=.75/Math.max(.6,y);for(let p=t.u0+.35;p<t.u1-.2;p+=f)Math.abs(p-t.ue)<t.Re+.1||r.rivet(p,h*(k(p)-c(p)*.5),n+.3,.075,.06,l,a)}const u=(t.Re+t.Ri)/2,i=.04,x=[[m,t.ue-u],[t.ue+u,t.tip]];for(const[h,f]of x){const p=t.holes.filter(q=>q.u>h&&q.u<f),I=[h];for(let q=0;q<p.length-1;q++)I.push((p[q].u+p[q].r+p[q+1].u-p[q+1].r)/2);p.length&&f-(p[p.length-1].u+p[p.length-1].r)>.6&&I.push(p[p.length-1].u+p[p.length-1].r+.3),I.push(f);for(const q of t.prof.slice(1,-1).map(F=>F[0]))q>h+.001&&q<f-.001&&!I.some(F=>Math.abs(F-q)<.001)&&I.push(q);I.sort((q,F)=>q-F);for(let q=0;q<I.length-1;q++){const F=I[q],C=I[q+1],H=[F];for(const $ of[t.u0])$>F+.001&&$<C-.001&&H.push($);H.push(C);const L=[];for(const $ of H)L.push([$,-Math.max(0,k($)-i)]);for(let $=H.length-1;$>=0;$--){const z=Math.max(0,k(H[$])-i);z>1e-4&&L.push([H[$],z])}const R=p.find($=>$.u>F&&$.u<C);zt(r,L,R?[R.u,0,R.r+.08]:null,n,g,a)}}{const h=t.holes.length?t.holes[t.holes.length-1].u+t.holes[t.holes.length-1].r+.45:12.3;for(const[f,p]of[[h,t.ue-t.Re-.1],[t.ue+t.Re+.1,t.u1-.1]])p-f>.6&&r.prism([[f,-.16],[p,-.13],[p,.13],[f,.16]],n,n+.22,.07,e,a,l)}for(const h of t.holes)r.lathe([[h.r,n-.14],[h.r,n+.14],[h.r+.08,n+.2],[h.r+.17,n+.2],[h.r+.24,n+.02]],16,f=>[d,l,e,e][f],0,h.u);r.lathe([[t.Ri,n-.34],[t.Ri,n+.34],[t.Ri+.16,n+.48],[t.Re-.16,n+.48],[t.Re,n+.34],[t.Re,n-.34]],48,h=>[d,l,e,l,e][h],0,t.ue);for(let h=0;h<16;h++){const f=(h+.5)/16*6.283185307;r.rivet(t.ue+u*Math.cos(f),u*Math.sin(f),n+.48,.09,.07,l,a)}r.prism([[-m,-t.tw0],[-t.u0,-t.tw0],[-t.tailU,-t.tw1],[-t.tailU,t.tw1],[-t.u0,t.tw0],[-m,t.tw0]],n-.22,n+.22,.08,e,a,d),r.prism([[-m,-.3],[-t.tailU,-.24],[-t.tailU,.24],[-m,.3]],n+.22,n+.36,.06,e,a,l),r.lathe([[0,n+.5],[t.cr*.5,n+.5],[t.cr-.28,n+.32],[t.cr,n+.14],[t.cr,n-.3]],32,h=>[l,e,l,d][h],0,-t.cu);for(let h=0;h<8;h++){const f=h/8*6.283185307;r.rivet(-t.cu+t.cr*.74*Math.cos(f),t.cr*.74*Math.sin(f),n+.34,.1,.08,l,a)}r.bolt(0,-t.cu,n+.5,.3,.22,l,.3)}const G=new S.Vector3(.0984,.7071,-.7002).normalize();async function Pt(r,t={}){const w=r.rng,y=r.quality?.detail??1,b=t.palette||["#F3F0E6","#15191C","#2F6B62","#C8A545","#8FC3EA","#D8432B","#D9D2C0","#1E2F5C"],a=t.look==="rain"||t.look==="cloud"?t.look:"sun",n=R=>{const $=new S.Color(R);return[$.r,$.g,$.b]},e=(R,$)=>[R[0]*$,R[1]*$,R[2]*$],l=n(Dt[t.iron]||b[2]),d=a==="rain"?.82:1,g=1+(w()-.5)*.08,k=n(b[5]),c=n(b[1]),m={base:e(l,d*g),light:e(l,1.28*d*g),dark:e(l,.7*d*g),bolt:e(l,1.45*d*g),hub:e(l,.42*d*g),hubDark:e(l,.28*d*g),hubLight:e(l,.62*d*g),black:e(c,1),blackLight:e(c,1.9),verm:k,vermLight:[Math.min(1,k[0]*1.12),k[1]*1.05,k[2]],vermDark:e(k,.74)},M={uSkyCol:{value:a==="rain"?new S.Vector3(.95,.98,1.03):new S.Vector3(.78,.9,1.08)},uGroundCol:{value:new S.Vector3(.5,.52,.56)},uSunCol:{value:new S.Vector3(2.6,2.45,2)},uSunDir:{value:G.clone()},uSun:{value:a==="rain"?0:1},uTime:{value:0},uRain:{value:a==="rain"?1:0},uOpalCol:{value:a==="rain"?new S.Vector3(.84,.92,1):new S.Vector3(1,.955,.86)},uOpalGlow:{value:1.3},uSeed:{value:w()*40}},v={uTptC:{value:new S.Vector3(0,o.R,0)},uTptN:{value:new S.Vector3(0,0,1)},uTptR:{value:o.R},uTptSun:{value:G.clone()},uTptHands:{value:new S.Vector2(_.minuteDeg*P,_.hourDeg*P)},uTptGable:{value:.6},uTptBore:{value:1},uTptPen:{value:.0093}},O=()=>S.UniformsUtils.merge([S.UniformsLib.fog]),T=(R,$,z,N,B=1,U=0)=>new S.ShaderMaterial({uniforms:{...O(),...M,uHemiGain:{value:R},uSelf:{value:$},uSheen:{value:z},uSunGain:{value:N},uHaze:{value:B},uBore:{value:U}},vertexShader:rt,fragmentShader:Ht,fog:!0,side:S.DoubleSide}),u=new S.Group;u.name="ten-past-ten great dial";const i={triangles:0,drawCalls:0},x=(R,$,z=u)=>{const N=new S.Mesh(R,$);return N.frustumCulled=!0,z.add(N),i.triangles+=R.attributes.position.count/3,i.drawCalls++,N};let h=Y();for(const R of Lt(h,m,w,y))await r.yield();await r.yield(),x(h.geometry(),T(.8,.02,.2,1,1,1)),await r.yield(),h=Y(),h.lathe([[o.opalIn,.08],[o.ringIn,.08]],120,[1,1,1],0,o.R),x(h.geometry(),new S.ShaderMaterial({uniforms:{...O(),...M},vertexShader:rt,fragmentShader:Ct,fog:!0,side:S.DoubleSide})),h=Y(),h.lathe([[o.bossOut,0],[o.minuteIn+.1,0]],96,[1,1,1],0,o.R);const f=x(h.geometry(),new S.ShaderMaterial({uniforms:{...O(),...M},vertexShader:rt,fragmentShader:Ft,fog:!0,side:S.DoubleSide,transparent:!0,depthWrite:!1}));f.renderOrder=2,await r.yield();const p=T(1.3,.1,.12,1,.5),I={};for(const R of["hour","minute"]){h=Y(),Nt(h,o[R],R==="hour"?{...m,verm:e(m.verm,.62),vermLight:e(m.vermLight,.62),vermDark:e(m.vermDark,.62)}:m,y,R==="minute");const $=new S.Group;$.position.set(0,o.R,0),u.add($),x(h.geometry(),p,$),I[R]=$,await r.yield()}let q=0;function F(R){q=R;const $=lt(R);return I.minute.rotation.z=-$.minuteDeg*P,I.hour.rotation.z=-$.hourDeg*P,v.uTptHands.value.set($.minuteDeg%360*P,$.hourDeg%360*P),$}F(0);const C=new S.Vector3;function H(){u.updateWorldMatrix(!0,!1);const R=u.matrixWorld;v.uTptC.value.set(0,o.R,0).applyMatrix4(R),v.uTptN.value.set(0,0,1).transformDirection(R),v.uTptR.value=o.R*C.setFromMatrixColumn(R,0).length(),t.sunDir?C.set(t.sunDir[0]??t.sunDir.x,t.sunDir[1]??t.sunDir.y,t.sunDir[2]??t.sunDir.z).normalize():C.copy(G).transformDirection(R),v.uTptSun.value.copy(C),M.uSunDir.value.copy(C)}if(H(),t.demo){const R=new S.Mesh(new S.PlaneGeometry(220,150),new S.ShaderMaterial({uniforms:{...O(),...M,...v},fog:!0,vertexShader:`varying vec3 vW;
        #include <common>
        #include <fog_pars_vertex>
        void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`uniform vec3 uSkyCol; uniform vec3 uSunCol; uniform float uSun; varying vec3 vW;
        #include <common>
        #include <fog_pars_fragment>
        ${gt}
        void main(){
          float fp = max(length(dFdx(vW)), length(dFdy(vW)));
          vec3 col = vec3(0.60, 0.58, 0.53) * (uSkyCol * 0.55 + uSunCol * (uSun * 0.7071 * tptDialLight(vW, fp)) * 0.45);
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`}));R.rotation.x=-Math.PI/2,R.position.set(0,.03,75),u.add(R),i.drawCalls++,i.triangles+=2;const $=$t(r,{palette:b,sunUniforms:v,sunGLSL:gt+"float worldSun(vec3 wp, vec3 n, float fp){ return tptDialLight(wp, fp); }"}),z=[["near",5,10],["middle",5,22],["far",5,34],["near",1.2,2.6],["middle",1.2,2.6],["far",1.2,2.6],["far",.45,.4]],N=new S.Matrix4,B=new S.Quaternion,U=new S.Vector3,X=new S.Vector3;z.forEach(([A,E,Z],V)=>{const j=A==="near"?[[$.near.geometry,$.near.material],[$.near.glassGeometry,$.near.glassMaterial]]:[[$[A].geometry,$[A].material]];for(const[wt,xt]of j){const st=wt.clone();st.setAttribute("aKind",new S.InstancedBufferAttribute(new Float32Array([0,1,2,3]),1));const it=new S.InstancedMesh(st,xt,4);for(let K=0;K<4;K++){const yt=E>2?(K-1.5)*12:-52+V*4+K*3.2*(E>1?1:.5);it.setMatrixAt(K,N.compose(U.set(yt,Z,E>2?48:60),B.identity(),X.set(E,E,E)))}u.add(it),i.drawCalls++}})}const L={dialCenter:new S.Vector3(0,o.R,0),portalSeat:{position:new S.Vector3(0,o.R,2),normal:new S.Vector3(0,0,1),radius:6},flyThrough:[[0,o.R,140],[0,o.R,100],[0,o.R,66],[0,o.R,30],[0,o.R,12],[0,o.R,2]].map(R=>new S.Vector3(...R)),viewpoints:[[-40,30,150],[10,34,96],[0,o.R,66],[0,o.R,24]].map(R=>new S.Vector3(...R)),lightCenterAt:(R=44)=>new S.Vector3(0,o.R,0).addScaledVector(G,-R/G.y),lightCenter:new S.Vector3(0,o.R,0).addScaledVector(G,-44/G.y),handPlanes:{hourZ:o.hour.z,minuteZ:o.minute.z},bossMouthZ:o.bossProud,boreRadius:o.bossIn,bossOuter:o.bossOut,collarOuter:o.collarOut,rim:o.R};return{object:u,radius:o.R,height:2*o.R,center:new S.Vector3(0,o.R,0),anchors:L,ground:!0,groundY:0,lightUniforms:v,uniforms:M,info:i,look:a,setMetres:F,handAngles:lt,syncLight:H,get metres(){return q},setSun(R){const $=Math.min(1,Math.max(0,R));M.uSun.value=$},update(R,$,z){M.uTime.value=$,H()},dispose(){}}}export{gt as DIAL_LIGHT_GLSL,D as FACE,kt as FACE_GLSL,tt as FACE_MEANS,ht as FAR_BEZEL_SHARE,at as FAR_DISC_AREA,et as FILTER_GLSL,Rt as GLASS_PASS,W as GREAT,qt as GREAT_STROKE_SHARE,J as HAND_LAW,Dt as IRON_PAINT,_ as TEN_PAST_TEN,Pt as buildHero,lt as handAngles,$t as makeDialKit};
