import*as r from"three";import{makePath as Zt}from"../kit/core.js";import*as Xe from"../parts/snow-lattice-model.js";const{LATTICE:jt,PALETTE:Ht,STYLE_GLSL:Re,makeStyle:Ut,makeBatch:Nt,buildLattice:Xt,makeHelixPool:Qt}=Xe,{RING:De,A_LAT:le,DX:O,LAYER:C,BOND:ca,C_LAT:Ve,R_O:ua}=jt,Jt=850,l=new r.Vector3(0,-2*le,Jt-5.5*Ve),X=150,Z=510,f=2*le,ea=`
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix * vec4(mat3(modelViewMatrix) * position, 1.0);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,ta=`
${Re}
uniform vec3 uEye, uSunCol; uniform float uDisc;
varying vec3 vDir;
void main(){
  vec3 d = vDir / max(length(vDir), 1e-4);
  vec3 col = mix(uEye, uPal[4], smoothstep(0.0, 0.34, d.y));          // near white at the level of the eye, the sky's own blue by the top of the frame
  col = mix(col, uPal[5], (1.0 - smoothstep(-0.16, 0.03, d.y)) * 0.96);
  float s = dot(d, uSun);
  col = mix(col, uSunCol, smoothstep(0.9990, 0.9994, s) * uDisc);
  col += uSunCol * 0.10 * smoothstep(0.93, 1.0, s) * uDisc;
  gl_FragColor = vec4(col, 1.0);
}`,Qe=`
uniform vec3 uOff;
attribute float aFace;
varying vec3 vL, vCam; varying float vFace;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0);
  vL = w.xyz - uOff; vCam = cameraPosition - uOff; vFace = aFace;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Je=`
vec2 slmCell(vec2 p){
  float q = p.x / ${O.toFixed(4)}, r = (p.y - q * ${C.toFixed(4)}) / ${le.toFixed(4)};
  float x = q, z = r, y = -q - r;
  float rx = floor(x + 0.5), ry = floor(y + 0.5), rz = floor(z + 0.5);
  float ex = abs(rx - x), ey = abs(ry - y), ez = abs(rz - z);
  if (ex > ey && ex > ez) rx = -ry - rz; else if (ey <= ez) rz = -rx - ry;
  return vec2(rx * ${O.toFixed(4)}, rx * ${C.toFixed(4)} + rz * ${le.toFixed(4)});
}
// offset from the nearest vermilion column of the ring round a cell centre (d = offset from that centre)
vec2 slmBall(vec2 d){
  vec2 sg = vec2(d.x < 0.0 ? -1.0 : 1.0, d.y < 0.0 ? -1.0 : 1.0);
  vec2 l1 = d - vec2(sg.x * ${De.toFixed(3)}, 0.0), l2 = d - sg * vec2(${(De/2).toFixed(3)}, ${C.toFixed(4)});
  return dot(l1, l1) < dot(l2, l2) ? l1 : l2;
}
float slmIvory(vec2 d){
  vec2 q = abs(d);
  return min(length(q - vec2(0.0, ${C.toFixed(4)})), length(q - vec2(${(De*.75).toFixed(3)}, ${(C/2).toFixed(4)})));
}
vec3 slmSky(float dy, vec3 eye){
  vec3 c = mix(eye, uPal[4], smoothstep(0.0, 0.34, dy));
  return mix(c, uPal[5], (1.0 - smoothstep(-0.16, 0.03, dy)) * 0.96);
}`,et=`
${Re}
${Je}
uniform vec3 uOff;
uniform vec4 uSlab;        // z of the face ring's plane; this plane keeps the cells from y to w metres off the flown shaft; shaft axis y in z
uniform float uMode;        // 0 the painted wall | 1 the backdrop deep inside: the nave's plain dark | 2 the plane over the real naves: it keeps each cell's point of daylight when the painting lifts
uniform vec3 uFade;         // alpha, and the distances from the eye over which this painted plane lifts (nearer: gone)
varying vec3 vL, vCam; varying float vFace;
void main(){
  vec3 ray = vL - vCam; float dist = length(ray);
  float rz = abs(ray.z) < 1e-3 ? 1e-3 : ray.z;
  vec2 sl = ray.xy / rz;                                          // sideways metres per metre of depth
  vec2 pf = vL.xy - sl * (vL.z - uSlab.x);                        // this ray where it crossed the face

  float px = max(fwidth(pf.x) + fwidth(pf.y), 1e-3) * 0.7;        // metres per pixel on the face
  vec2 c = slmCell(pf), d0 = pf - c;
  float rc = length(c - vec2(0.0, uSlab.z));
  if (rc < uSlab.y || rc >= uSlab.w || c.y > uOff.y * -1.0 + 46.0) discard;   // cell by cell; nothing above the brink
  vec3 naveC = uPal[5] * vec3(0.10, 0.045, 0.085);                  // the nave: a deep plum, never black
  vec3 col = naveC;
  if (uMode > 0.5 && uMode < 1.5) { gl_FragColor = vec4(uPal[5] * vec3(0.075, 0.033, 0.065), uFade.x * smoothstep(uFade.y, uFade.z, dist)); return; }   // (the rampart's own dark: one tone with the liner, its cap and its lid)
  // two deeper rings, sliding behind the face
  vec2 p2 = pf + sl * 27.15, c2 = slmCell(p2), p1 = pf + sl * 13.57, c1 = slmCell(p1);
  float dk = 1.0 - smoothstep(0.42, 0.64, px);                    // (from far off a cell is one ring round one dark nave: marks that would beat with the face ring are left out)
  col = mix(col, mix(uPal[0], naveC, 0.74), (1.0 - smoothstep(2.0 - px, 2.0 + px, length(slmBall(p2 - c2)))) * dk);
  col = mix(col, mix(uPal[1], naveC, 0.66), (1.0 - smoothstep(1.2 - px, 1.2 + px, slmIvory(p1 - c1))) * dk);
  col = mix(col, mix(uPal[0] * vec3(0.8, 0.8, 0.95), naveC, 0.46), (1.0 - smoothstep(2.0 - px, 2.0 + px, length(slmBall(p1 - c1)))) * dk);
  // the disc of sky at the end of the shaft: slides with the eye, cut by the bore it is seen through
  float bore = 1.0 - smoothstep(6.6 - px, 6.6 + px, length(d0));
  float rd = 2.8 * clamp(dist / 140.0, 0.25, 1.0);                 // a far end looks further off as the eye comes close
  float disc = (1.0 - smoothstep(rd - px, rd + px, length(d0 + sl * 5.5))) * bore;
  float pm = uMouth.x * smoothstep(uMouth.y, uMouth.y + max(uMouth.w, 0.1), rc);   // outside the pool of daylight round the flown mouth the wall steps a tone back
  col = mix(col, vec3(0.985, 0.992, 1.0), disc * (1.0 - 0.40 * pm));
  vec3 flatT = mix(naveC, vec3(0.985, 0.992, 1.0), 0.11);
  if (vFace > 0.5) {
    // the face ring, flat: steel along the hexagon, ivory on the links, vermilion at the six corners, one highlight each
    vec2 q = abs(d0);
    float hx = max(q.y, q.y * 0.5 + q.x * 0.8660254);
    col = mix(col, uPal[3] * 0.82, 1.0 - smoothstep(0.5, 0.5 + px, abs(hx - ${C.toFixed(4)})));
    col = mix(col, uPal[1] * 0.95, 1.0 - smoothstep(1.2 - px, 1.2 + px, slmIvory(d0)));
    vec2 lb = slmBall(d0);
    float lit = smoothstep(-2.0, 0.9, dot(lb, vec2(0.66, 0.50)));
    vec3 vcol = mix(uPal[0] * vec3(0.40, 0.40, 0.60) + uPal[4] * 0.035, uPal[0], lit);
    vcol = mix(vcol, vec3(1.0, 1.0, 0.98), (1.0 - smoothstep(0.30, 0.30 + px, length(lb - vec2(0.74, 0.78)))) * (1.0 - smoothstep(0.2, 0.5, px)));
    col = mix(col, vcol, 1.0 - smoothstep(2.0 - px, 2.0 + px, length(lb)));
    flatT = mix(flatT, uPal[0] * 0.92, 0.2); flatT = mix(flatT, uPal[1] * 0.95, 0.12);
  }
  col = mix(col, col * vec3(0.54, 0.48, 0.62), pm);
  // the cliff falls away into the rose haze of the hollow, row by row (the real face balls carry the same term)
  float kr = clamp((-52.0 - (c.y + uOff.y)) / 60.0, 0.0, 1.0); kr = kr * kr * (3.0 - 2.0 * kr) * 0.9;
  vec3 roseC = uPal[5];
  if (vFace > 0.5) {
    vec2 q2 = abs(d0);
    float hx2 = max(q2.y, q2.y * 0.5 + q2.x * 0.8660254);
    roseC = mix(roseC, mix(uPal[5], vec3(1.0), 0.30), 1.0 - smoothstep(1.6, 1.6 + px, abs(hx2 - ${C.toFixed(4)})));
  }
  col = mix(col, roseC, kr); flatT = mix(flatT, mix(uPal[5], vec3(1.0), 0.08), kr);
  col = mix(flatT, col, 1.0 - smoothstep(1.6, 3.4, px));         // under about five pixels a cell: its flat average
  float A = uFade.x * smoothstep(uFade.y, uFade.z, dist);
  if (uMode > 1.5) A = max(A, disc * smoothstep(30.0, 52.0, dist));
  gl_FragColor = vec4(slmAerial(col, dist), A);
}`,aa=`
attribute vec2 aPl; attribute vec4 aK;
varying vec3 vW; varying vec2 vPl; varying vec4 vK;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz; vPl = aPl; vK = aK;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,oa=`
${Re}
${Je}
uniform vec3 uEye; uniform float uFar;
varying vec3 vW; varying vec2 vPl; varying vec4 vK;
void main(){
  vec3 ray = vW - cameraPosition; float dist = max(length(ray), 1.0);
  vec3 skyc = slmSky(ray.y / dist, uEye);
  vec2 p = vPl * 0.15;
  vec2 d = p - slmCell(p), q = abs(d);
  float h = max(q.y, q.y * 0.5 + q.x * 0.8660254);
  float fw = max(fwidth(p.x) + fwidth(p.y), 1e-4) * 0.7;
  float line = smoothstep(7.35 - fw, 7.35 + fw, h);               // the honeycomb: paler than the plate
  line = mix(line, 0.22, smoothstep(1.3, 3.4, fw));
  vec3 col = mix(uPal[5] * vec3(0.60, 0.33, 0.42), mix(uPal[5], vec3(1.0), 0.12), line);   // (the plate: flat rose a plain step darker than the sky beside it)
  float k = clamp((vW.y - vK.y) / max(vK.z - vK.y, 1.0), 0.0, 1.0);
  k = k * k * (3.0 - 2.0 * k) * vK.x * mix(1.0, uFar, vK.w);
  gl_FragColor = vec4(mix(skyc, col, clamp(k, 0.0, 1.0)), 1.0);
}`,na=`
attribute float aCap;
varying vec3 vL; varying float vCap;
void main(){ vL = position; vCap = aCap; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,ra=`
${Re}
${Je}
uniform float uAxisY, uRootZ, uRL, uTop, uCut;
uniform vec3 uGap, uEye;
varying vec3 vL; varying float vCap;
void main(){
  vec2 d = vec2(vL.x, vL.y - uAxisY);
  float fxy = fwidth(vL.x) + fwidth(vL.y), fz = fwidth(vL.z);
  vec2 q0 = abs(d);
  if (vCap < 0.5 && vL.z > uCut) discard;                         // its far end draws back as the eye comes out into the bay: nothing flat stands near the eye there
  bool cap = vCap > 0.5;                                          // the flat cap behind the cliff's real depth: naves seen end-on
  if (cap && vCap < 1.5 && max(q0.y, q0.y * 0.5 + q0.x * 0.8660254) < uRL && d.y < uTop) discard;
  float ang = dot(d, d) > 1.0 ? atan(d.y, d.x) : 0.0;
  // one even deep plum, and in it the rampart's own balls a tone above the dark, none drawn larger than a ball: no facet,
  // no painted cell, nothing but depth behind the lit ring, the relay wall and the guest
  vec2 p = cap ? vL.xy : vec2(ang * 64.171, vL.z);
  vec2 dc = p - slmCell(p);
  float fw = max(cap ? fxy : fz + fxy, 1e-3) * 0.7;
  float keep = 1.0 - smoothstep(0.5, 1.6, fw);
  float bl = (1.0 - smoothstep(2.0 - fw, 2.0 + fw, length(slmBall(dc)))) * keep;
  float iv = (1.0 - smoothstep(1.2 - fw, 1.2 + fw, slmIvory(dc))) * keep;
  vec3 nave = uPal[5] * vec3(0.075, 0.033, 0.065);
  if (vCap > 1.5) { bl = 0.0; iv = 0.0; }
  vec3 col = nave + uPal[0] * 0.075 * bl + uPal[1] * vec3(0.055, 0.045, 0.085) * iv;
  // behind the guest's cage the rampart stands open to the day: not a pane but a gap in the lattice, a dozen cells of it
  // open, each a ring of balls and links in silhouette against the blue-white sky; the gap's edge is the cells' own
  vec2 cg = p - dc;
  vec2 g = abs((cap ? vec2(1e3) : vec2(cg.x, cg.y * 0.6124)) - uGap.xy);
  float gh = max(g.y, g.y * 0.5 + g.x * 0.8660254);
  float gap = step(gh, 20.0) * uGap.z;
  float fg = min(fw, 0.7);
  vec2 qd = abs(dc); float hxd = max(qd.y, qd.y * 0.5 + qd.x * 0.8660254);
  float sil = max(max(1.0 - smoothstep(2.0 - fg, 2.0 + fg, length(slmBall(dc))), 1.0 - smoothstep(1.2 - fg, 1.2 + fg, slmIvory(dc))), 1.0 - smoothstep(0.42, 0.42 + fg, abs(hxd - ${C.toFixed(4)})));
  col = mix(col, mix(mix(uPal[4], uEye, 0.25), nave * 1.7, sil), gap);
  gl_FragColor = vec4(col, 1.0);
}`,sa={morning:["#DCE9F4","#F5F9FC","#E7C3C4","#FFFFFF",1],dawn:["#BDB6CF","#F6D6CF","#F0C6AE","#FFE9D6",1],overcast:["#E6EBEF","#F8F9F9","#E3D0D2","#FFFFFF",0],golden:["#D6E1EA","#FBEFD0","#EFC8A4","#FFF1B8",1],bluehour:["#8C9FCC","#CCD4EA","#BBAACB","#E8ECFF",0]};var da={id:"snow-lattice-model",name:"The Snow Lattice",category:"bizarre",weirdness:.8,media:["air","open","interior"],async build(h){const S=h.rng,_e=h.vary||{},ie=h.quality?.detail??1,ye=Math.min(1.3,Math.max(.7,_e.density??1)),ge=_e.hour||"any",tt=S.pick(["morning","morning","dawn","overcast","golden"]),xe=ge==="dawn"?"dawn":ge==="golden"?"golden":ge==="night"?"bluehour":ge==="day"?tt==="overcast"?"overcast":"morning":tt,Ge=S.chance(.28),we=S.chance(.3),R=!!_e.rare,K=sa[xe],D=Ht.slice();Ge&&(D[0]="#E27C6C",D[1]="#F7F5EE",D[2]="#93794A"),xe==="golden"&&(D[1]=Ge?"#F8EBC8":"#F6E2B4",D[2]=Ge?"#B08E48":"#DDA63C"),xe==="bluehour"&&(D[1]="#E4E6F2"),D[4]=K[0],D[5]=K[2];const ce=Ut(D),w=ce.uniforms;we&&(w.uHaze.value.x=300);const ue=new r.Scene;ue.background=new r.Color(K[1]);const V=new r.Group;V.name="lattice space",V.position.copy(l),ue.add(V);const qe={...w,uEye:{value:new r.Color(K[1])},uSunCol:{value:new r.Color(K[3])},uDisc:{value:K[4]}},$e=new r.Mesh(new r.SphereGeometry(1,32,16),new r.ShaderMaterial({uniforms:qe,vertexShader:ea,fragmentShader:ta,side:r.BackSide,depthWrite:!1,depthTest:!1}));$e.renderOrder=-10,$e.frustumCulled=!1,ue.add($e),await h.yield();let x=null,at="";try{x=await Xe.buildHero(h,{style:ce,detail:ie,palette:D,rare:R,density:ye,light:xe})}catch(e){at=String(e&&e.message||e),x=null}x&&x.object?V.add(x.object):x=null;const z=x&&x.anchors||{};await h.yield();const b=new r.Vector3(0,le,5.5*Ve).add(l);z.portalSeat&&z.portalSeat.position&&b.copy(z.portalSeat.position).add(l);const de=Zt(R?[[0,0,0],[0,0,60],[0,0,150],[0,0,330],[0,0,440],[0,0,492],[.2,-5,516],[-.9,-13.5,538],[-2,-19.2,558],[-2,-19.8,640],[-1.6,-19.4,690],[-.5,-17.6,726],[0,b.y,762],[0,b.y,b.z-72],[0,b.y,b.z-36],[0,b.y,b.z]]:[[0,0,0],[0,0,60],[0,0,150],[0,0,330],[0,0,440],[0,0,500],[.9,-7.5,526],[2.2,-18.5,548],[2.9,-23.4,564],[3.2,-22.6,572],[4,-17,582],[6.2,-10,592],[8.4,-5.6,602],[9.6,-4.4,613],[10,-4.2,628],[9,-5,648],[6.4,-6.5,670],[3.6,-9.2,692],[1.4,-13,716],[.4,b.y,744],[0,b.y,b.z-72],[0,b.y,b.z-36],[0,b.y,b.z]]),k=new r.Vector3(O,f+C,311-l.z),be=new Float32Array(257),fe=new r.Vector3;for(let e=0;e<=256;e++)be[e]=de.pointAt(e/256,fe).z;const j=e=>{const t=Math.min(1,Math.max(0,e))*256,a=Math.min(255,Math.floor(t));return be[a]+(be[a+1]-be[a])*(t-a)};await h.yield();const E=X-l.z,ot=Z-l.z-.8,nt=E+11,_=262,he=-182-l.y,W=50-l.y,Q=62,At=e=>{const t=Math.min(1,Math.max(0,(-52-Math.round(e/C)*C)/60));return t*t*(3-2*t)*.9},J=391.5-l.z,me=478-l.z,H=500-l.z,St=new r.Vector3(0,f,j(.34)-l.z),Oe=k.clone().sub(St).normalize(),Ke=new r.Vector3,Et=(e,t,a)=>{Ke.set(e,t,a).sub(k);const o=Ke.dot(Oe);return o>7&&Ke.addScaledVector(Oe,-o).length()<4.6+.17*o},Bt=(e,t)=>{const a=Math.abs(e),o=Math.abs(t-f);return Math.max(o,o*.5+a*.866)},Pt=e=>e<=J?0:e<=me?26:e<=H?42.8:1e3,B=Nt(),rt=e=>e.z>E+20&&(e.m===-2&&e.n===3&&e.c>1||e.m===-1&&(e.n===2||e.n===3)&&e.c<2),Tt=S.fork?S.fork("lattice"):S,la=await Xt(h,B,{rng:Tt,pegs:.5,bounds:{x0:-_,x1:_,y0:he,y1:W,z0:E,z1:ot},site(e,t,a,o){const n=Math.hypot(e,t-f),s=n<10.5;if(a<nt){const i=At(t+l.y);return{shade:s?0:8+i}}if(a>J){if(t<.1)return t<-3*C-.1||Math.abs(e)>(a>H?150:56)?null:t<-.1?{shade:t>-C-.1?10.42:10.72}:{shade:!R&&a>me&&e>4?e>14?.86:.62:0};if(!R&&a>me&&e>14&&t<2*C+.1){if(e>=14+2*O)return n<Q||a>H&&e<150?{shade:6.4}:null;const v=z.rootZ??ot+.8,F=[1/16,7/16,9/16,15/16][o];return t>2*C-.1&&e<14+O?{T:((Math.round(a/Ve-F)+(o===2?.5:1))*Ve-v)/16,glide:1}:{T:(a-6-v)/16,glide:1.25}}if(R&&a>me&&e>16&&e<16+2*O&&t<2*C+.1)return{shade:0};const i=Bt(e,t),m=Pt(a);return i<m||n>=Q?null:a>me-16?{shade:6+Math.min(1,Math.max(0,(i-m)/20))}:{shade:10+Math.min(.85,Math.max(.56,.04+Math.max(0,i-m-6)/26,.8*Math.min(1,1-(a-J-30)/45)))}}if(n<Q){const i=Math.min(.92,.1+.72*Math.min(1,(a-nt+3)/10)+(s?0:.08)),m=Math.hypot(e-k.x,t-k.y)<10.5&&Math.abs(a-k.z)<22;return!s&&!m&&Et(e,t,a)?null:s&&e<-4&&a>E+20?{shade:2+Math.min(i,.22+.6*Math.min(1,Math.max(0,1-(a-E-30)/40)))}:{shade:(s||m?2:10)+i}}return n<106&&a<E+52?{shade:10+.74+.16*(a-E)/52}:null},lane:(e,t)=>rt(e)&&rt(t)?1:0});await h.yield();const c=S.fork?S.fork("vapour"):S,ee=[],te=(e,t,a,o,n=!1)=>{if(de.distanceTo(e,t,a)<9.5+2.5*o||!n&&a>X-6-2.4*o&&a<Z+4)return!1;if(o>1&&a<36&&Math.hypot(e,t)<1.25*a)return c(),!1;if(a<160||n){const s=Math.max(4,a-6),i=e/s,m=t/s;for(let v=0;v<ee.length;v+=3){const F=3.7/s+3.7/ee[v+2];if(Math.abs(i-ee[v])<F&&Math.abs(m-ee[v+1])<F)return c(),!1}ee.push(i,m,s)}return B.vapour(e-l.x,t-l.y,a-l.z,c()*97,o,0),!0};{const t=.27419354838709675,a=-4.5/31;ee.push(t,a,31),B.vapour(8.5-l.x,-4.5-l.y,37-l.z,.37*97,.35,0)}for(const e of[[-9.5,6.5,65],[-12,3.5,66],[7,18,98],[-17,-12,108],[31,5,122],[-7,-8.5,70],[-25,10,131],[-31,-13.5,139]])te(e[0],e[1],e[2],.5);for(let e=0;e<2;e++){const t=e?-1:1,a=e?-9:21;for(let o=0;o<7;o++){const n=o/6;te(t*(90-58*n)+c.gauss()*.8,a-17*n+9*Math.sin(n*3.1)+c.gauss()*.8,120-34*n,c.range(1,1.5))}}{const e=ie*ye*(we?1:.6),t=Math.max(8,Math.round(26*e)),a=6;for(let s=0;s<a;s++){const i=s%2?-1:1,m=s>>1,v=i*(92+c.range(0,26)),F=8-48*m+c.range(-8,8),d=c.range(32,46),y=c.range(0,6.283),M=c.range(2.9,4.2)*(c.chance(.5)?1:-1),p=c.range(118,138),g=c.range(80,96);for(let I=0;I<t;I++){const T=(I+c.range(-.2,.2))/t,L=y+M*T;te(v+Math.cos(L)*d*1.15+c.gauss()*1.4,F+Math.sin(L)*d*.7+c.gauss()*1.4,p+(g-p)*T+c.gauss()*1.5,c.range(1.2,2.2))}}await h.yield();const o=Math.max(12,Math.round(46*e));for(let s=0;s<(we?5:3);s++){const i=c.range(-150,150),m=i*.5+c.range(-60,60),v=c.range(150,210),F=c.range(420,520);for(let d=0;d<o;d++){const y=(d+c.range(-.25,.25))/o,M=y*y;te(i+(m-i)*y+c.gauss()*2,58+8*y+(v-66)*M+c.gauss()*2,104+(F-104)*y,c.range(1.2,2.6),!0)}}await h.yield();const n=Math.round(190*e);for(let s=0;s<n;s++)te(c.range(-190,190),c.range(60,118),c.range(96,146),c.range(1.5,3.5)),(s&63)===63&&await h.yield()}const Lt=Math.round(110*(we?2.4:1)*ie*ye);for(let e=0;e<Lt;e++){const t=e%4!==3,a=t?c.range(-150,-34):c.range(118,160)+(R?90:0),o=t?c.range(-14,40):c.range(26,60)+(R?50:0),n=c.range(520,900);te(a,o,t?n:520+(n-520)*.45,c.range(1.2,3.5))}await h.yield();const U=S.fork?S.fork("guests"):S,Fe=(e,t,a,o=3)=>{if(B.guest){B.guest(e,t,a,U()*97,o);return}const n=[9999,U()*97,.5,0],s=3.3;B.ball(e,t,a,0,0,s,1.9,n,6,0,4,1),B.ball(e,t,a,0,0,-s,1.9,n,6,0,1,1),B.link(e,t,a,0,0,s,0,n,9999,0),B.link(e,t,a,0,0,-s,0,n,9999,0)};{const e=[8500,3.06+0*U(),1,0],t=3.3,a=new r.Vector3(0,1,0).cross(Oe).normalize();for(const o of[1,-1])B.ball(k.x,k.y,k.z,a.x*t*o,a.y*t*o,a.z*t*o,2.3,e,6,1,o>0?4:1,1),B.link(k.x,k.y,k.z,a.x*t*o,a.y*t*o,a.z*t*o,0,e,9999,0)}Fe(-2*O,f,198-l.z),Fe(2*O,f,246-l.z);for(let e=0,t=0;e<80&&t<18;e++){const a=U.int(-8,8),o=U.int(-6,4),n=a*O,s=a*C+o*le,i=Math.hypot(n,s-f);i<20||s>W-12||s<he+12||Math.abs(n)>_-12||(t%3===0||i>Q-12?Fe(n,s,E+U.range(9,26)):Fe(n,s,U.range(E+30,J-14)),t++)}if(x){const e=[];for(let t=0;t<=de.length;t+=.5)de.posAtDist(t,fe),e.push(fe.x-l.x,fe.y-l.y,fe.z-l.z);await h.yield(),await Xe.buildColumn(h,B,ce,{course:e,ring:b.clone().sub(l),floorY:z.floorY,sightZ:440-l.z,loose:[x.loose,B.loose],floor:x.sprung}),await h.yield()}const st=await B.build(ce,h);V.add(st.balls,st.links),await h.yield();const Me=E+7.8,Y=E+12.4,lt=Q-6,it={...w,uOff:{value:l},uSlab:{value:new r.Vector4(Me,lt,f,1e6)},uFade:{value:new r.Vector3(1,48,104)},uMode:{value:0}},Rt=new r.ShaderMaterial({uniforms:it,vertexShader:Qe,fragmentShader:et,side:r.DoubleSide,transparent:!0,depthWrite:!1}),ct={...w,uOff:{value:l},uSlab:{value:new r.Vector4(Me,1,f,lt)},uFade:{value:new r.Vector3(1,-2,-1)},uMode:{value:2}},Dt=new r.ShaderMaterial({uniforms:ct,vertexShader:Qe,fragmentShader:et,side:r.DoubleSide,transparent:!0,depthWrite:!1}),ae=Y,We=new r.BufferGeometry;We.setAttribute("position",new r.Float32BufferAttribute([-90,f-90,ae,90,f-90,ae,90,f+90,ae,-90,f-90,ae,90,f+90,ae,-90,f+90,ae],3)),We.setAttribute("aFace",new r.Float32BufferAttribute([0,0,0,0,0,0],1));const Ye=new r.Mesh(We,Dt);Ye.frustumCulled=!1,Ye.renderOrder=2,V.add(Ye);const ut={...w,uOff:{value:l},uSlab:{value:new r.Vector4(Me,1,f,1e6)},uFade:{value:new r.Vector3(1,-2,-1)},uMode:{value:1}},Vt=new r.ShaderMaterial({uniforms:ut,vertexShader:Qe,fragmentShader:et,side:r.DoubleSide,transparent:!0,depthWrite:!1}),N=E+86,P=250,Ie=new r.BufferGeometry;Ie.setAttribute("position",new r.Float32BufferAttribute([-P,f-P,N,P,f-P,N,P,f+P,N,-P,f-P,N,P,f+P,N,-P,f+P,N],3)),Ie.setAttribute("aFace",new r.Float32BufferAttribute([0,0,0,0,0,0],1));const ke=new r.Mesh(Ie,Vt);ke.frustumCulled=!1,ke.renderOrder=1,ke.name="cliff backdrop",V.add(ke);const dt=[],ft=[],Ce=(e,t,a,o,n)=>{dt.push(e,a,Y,t,a,Y,t,o,Y,e,a,Y,t,o,Y,e,o,Y);for(let s=0;s<6;s++)ft.push(n)},Ze=-450-l.y;Ce(-420,-_,Ze,W,1),Ce(_,420,Ze,W,1),Ce(-_,_,Ze,he,1),Ce(-_,_,he,W,0);const je=new r.BufferGeometry;je.setAttribute("position",new r.Float32BufferAttribute(dt,3)),je.setAttribute("aFace",new r.Float32BufferAttribute(ft,1));const He=new r.Mesh(je,Rt);He.frustumCulled=!1,He.renderOrder=1,V.add(He);const ht={value:H};{const e=(Q+6)/.866,t=E+56,a=H,o=[],n=[],s=W-3-f,i=e-s/(e*.866)*e*.5,m=[[e,0],[i,s],[-i,s],[-e,0],[-e/2,-e*.866],[e/2,-e*.866]];for(let d=0;d<6;d++){const y=m[d][0],M=f+m[d][1],p=m[(d+1)%6][0],g=f+m[(d+1)%6][1];o.push(y,M,t,p,g,t,p,g,a,y,M,t,p,g,a,y,M,a),n.push(0,0,0,0,0,0)}{const d=_+160,y=he-40,M=W-3;o.push(-d,y,t,d,y,t,d,M,t,-d,y,t,d,M,t,-d,M,t),n.push(1,1,1,1,1,1);const p=E+14,g=M-11;o.push(-d,g,p,d,g,p,d,g,t,-d,g,p,d,g,t,-d,g,t),n.push(2,2,2,2,2,2)}const v=new r.BufferGeometry;v.setAttribute("position",new r.Float32BufferAttribute(o,3)),v.setAttribute("aCap",new r.Float32BufferAttribute(n,1));const F=new r.Mesh(v,new r.ShaderMaterial({uniforms:{...w,uAxisY:{value:f},uRootZ:{value:H+14},uRL:{value:e*.866-.5},uTop:{value:W-3-f-.4},uCut:ht,uEye:qe.uEye,uGap:{value:new r.Vector3(.5236*64.171,(k.z+68)*.6124,1)}},vertexShader:na,fragmentShader:ra,side:r.DoubleSide}));F.frustumCulled=!1,F.name="rampart liner",V.add(F)}await h.yield();const mt=[],vt=[],pt=[],_t=(e,t,a,o=1)=>{for(let n=1;n<e.length-1;n++)for(const s of[e[0],e[n],e[n+1]]){const i=t(s[0],s[1]);mt.push(i[0],i[1],i[2]),vt.push(s[0]*o,s[1]*o),pt.push(a[0]*(a[4]?1-.2*Math.pow(Math.min(1,Math.max(0,s[1]/a[4])),1.5):1),a[1],a[2],a[3])}};let ze=1;const Ue=(e,t,a,o,n=ze)=>{[[1,1,1],[.95,.66,.88]].forEach(([s,i,m])=>{const v=e*s,F=t*i,d=[o[0]*m,o[1],o[2],o[3],o[4]||0],y=M=>_t(M,(p,g)=>a(g,p,0),d,n);y([[-F,0],[-F*.45,v*.9],[0,v],[F*.45,v*.9],[F,0]]);for(const M of[1,-1])for(let p=0;p<7;p++){const g=.2+p*.105,I=e*g,T=e*(.3*(1-g)+.035)*s*(p%2?.74:1),L=t*.36*(1-.5*g)*i,A=(q,$)=>[M*(q*.866+$*.5),I+q*.5-$*.866];if(y([A(0,-L),A(T*.86,-L*.42),A(T,0),A(T*.86,L*.42),A(0,L)]),p%2===0&&p<5){const q=A(T*.5,0),$=T*.34,Te=L*.5;for(const Le of[[0,1],[M*.866,-.5]]){const kt=[-Le[1],Le[0]],pe=(Ct,zt)=>[q[0]+Le[0]*Ct+kt[0]*zt,q[1]+Le[1]*Ct+kt[1]*zt];y([pe(0,-Te),pe($*.84,-Te*.42),pe($,0),pe($*.84,Te*.42),pe(0,Te)])}}}})},oe=(e,t,a,o,n,s,i,m,v,F,d,y,M)=>{const p=Math.hypot(o,n)||1;o/=p,n/=p;const g=[n,0,-o],I=[-o*Math.sin(s),Math.cos(s),-n*Math.sin(s)],T=[0,1,2].map(A=>I[A]*Math.cos(i)+g[A]*Math.sin(i)),L=[0,1,2].map(A=>g[A]*Math.cos(i)-I[A]*Math.sin(i));Ue(m,v,(A,q,$)=>[e+T[0]*A+L[0]*q+o*$,t+T[1]*A+L[1]*q,a+T[2]*A+L[2]*q+n*$],[F,d,y,M,m])},yt=ye*ie<.6,ne=S.range(-150,150),re=S.range(-120,120),se=S.range(.95,1.1);ze=.5,oe(1250+re,-1400,3900+ne,-.3,-1,.14,-.2,3e3*se,420,1,-50,300,1),oe(-1900-re,-1700,5200-ne,.35,-1,.14,.27,3600*se,480,.84,-50,340,1),await h.yield(),yt||(oe(-3400,-1500,3300,.72,-.7,.14,.12,2400*se,380,.5,-50,380,1),oe(3300,-1600,4300,-.6,-.8,.14,-.1,2800*se,400,.5,-50,380,1)),ze=1,oe(70+re*.3,-1e3,2600+ne*.4,0,-1,.14,-.3,1500*se,190,1,-60,250,1),oe(-160-re*.3,-1150,3100-ne*.4,0,-1,.14,.33,1850*se,215,.94,-60,290,1),ze=2.1,await h.yield(),Ue(2300,250,(a,o,n)=>[-900+re+.6*a-.8*o,-330+n*4,1250+ne+.8*a+.6*o],[.66,-1e5,-99999,0],2.1),yt||Ue(2100,230,(a,o,n)=>[520-re-.75*a-.66*o,-430+n*4,1080-ne+.66*a-.75*o],[.5,-1e5,-99999,0],2.1),await h.yield();const Ae=new r.BufferGeometry;Ae.setAttribute("position",new r.Float32BufferAttribute(mt,3)),Ae.setAttribute("aPl",new r.Float32BufferAttribute(vt,2)),Ae.setAttribute("aK",new r.Float32BufferAttribute(pt,4));const gt={...w,uEye:qe.uEye,uFar:{value:1}},Gt=new r.ShaderMaterial({uniforms:gt,vertexShader:aa,fragmentShader:oa,side:r.DoubleSide,depthWrite:!1}),Se=new r.Mesh(Ae,Gt);Se.frustumCulled=!1,Se.renderOrder=-5,Se.name="far arms",ue.add(Se),await h.yield();const xt=await Qt(ce,h,Math.round(230*(ie<.7?.6:1)));V.add(xt.mesh),await h.yield();const u=(e,t,a)=>{const o=Math.min(1,Math.max(0,(a-e)/(t-e)));return o*o*(3-2*o)},wt=e=>.6+.6*u(0,.15,e)+.3*u(.14,.24,e)-.7*u(.29,.325,e)*(1-u(.35,.385,e))-.5*u(.395,.425,e)*(1-u(.445,.475,e))-.75*u(.56,.66,e)+.25*u(.8,.9,e),qt=z.ringClock??22,$t=(Z+16*qt-j(.925)-43)/u(.84,.94,.925),bt=e=>(R?48+12*u(.72,.8,e):27+22*(1-u(.56,.66,e))+40*u(.665,.72,e)-24*u(.72,.8,e))+$t*u(.84,.94,e),Ft=e=>z.clockForCameraZ?z.clockForCameraZ(j(e)-l.z,bt(e)):(j(e)+bt(e)-Z)/16,ve=new Float32Array(257);{let e=0;for(let t=1;t<=256;t++)e+=1/Math.min(2.5,Math.max(.35,wt((t-.5)/256))),ve[t]=e;for(let t=1;t<=256;t++)ve[t]*=42/e}const Ee=e=>{const t=Math.min(1,Math.max(0,e))*256,a=Math.min(255,Math.floor(t));return ve[a]+(ve[a+1]-ve[a])*(t-a)},Be=w.uBar.value,Ot=.26*Be.w-(k.x*Be.x+k.y*Be.y+k.z*Be.z)-2.5*Ee(.34),Kt=(j(.25)+19-l.z-w.uRelay.value.x)/Math.max(w.uRelay.value.y,1)+1.7+.17-Ee(.25),G=new r.Vector3,Pe=new r.Vector3,Wt=new r.Vector3,Yt=new r.Vector3,It=[{at:new r.Vector3(0,62,X),from:0,to:.075,weight:.5},{at:(e,t)=>Wt.set(-De,-.5,j(t)+15),from:.195,to:.299,weight:.93,fade:.385},{at:(e,t)=>Yt.set(k.x+l.x,k.y+l.y-1,Math.max(k.z+l.z,j(t)+17)),from:.3,to:.385,weight:.76,fade:.29},{at:b.clone(),from:.53,to:.68,weight:.5},{at:(e,t)=>{const a=Ft(t);return R&&z.kink&&z.kinkB?(z.kink(a,G).add(l),z.kinkB(a,Pe).add(l),G.lerp(Pe,.4),G.y+=3,G):z.kink?(z.kink(a,G).add(l),z.kinkB&&(z.kinkB(a,Pe).add(l),G.lerp(Pe,.75*u(.68,.715,t)*(1-u(.75,.8,t)))),G.y+=5*u(.665,.705,t)*(1-u(.76,.82,t)),G):G.set(15,-25,b.z*t+48)},from:R?.5:.455,to:.86,weight:.6},{at:b.clone(),from:.84,to:1,weight:.3}],Mt=new r.Vector2,Ne=new r.Vector3;return{scene:ue,path:de,duration:42,pace:wt,camera:{fov:62,near:.5,far:9e3,lookAhead:34,sway:.35,bank:.25},pois:It,portal:{shape:"circle",radius:7,color:K[1],glow:0,veil:"#"+new r.Color(K[2]).multiply(new r.Color().setRGB(.1,.045,.085)).getHexString(),revealDistance:280,tilt:!1,blendDistance:25},post:{flat:1,exposure:1,bloom:{strength:0},grade:{saturation:1,contrast:1,vignette:0,grain:0}},ride:"none",style:"none",companion:"none",update(e,t,a,o){w.uTime.value=t,w.uClock.value=Ft(o),h.renderer.getDrawingBufferSize(Mt),w.uPxH.value=Math.max(100,Mt.y*.5),x&&x.setClock&&x.setClock(w.uClock.value),x&&x.update&&x.update(e,t,a,o);const n=a.matrixWorld.elements,s=a.projectionMatrix.elements;xt.update(Ne.set(n[12]-l.x,n[13]-l.y,n[14]-l.z),n,1/Math.max(s[0],.05),1/Math.max(s[5],.05)),w.uBarK.value.set(u(X+6,X+46,n[14])*(1-u(J+l.z-52,J+l.z-24,n[14])),Ot+2.5*Ee(o)),w.uMouth.value.set(.45*u(.03,.075,o),120-92.5*u(.03,.078,o)-15.5*u(.125,.155,o),f,34-29*u(.03,.078,o)+u(.125,.155,o)),w.uRT.value=Kt+Ee(o);const i=u(X+8,X+28,n[14])*(1-u(Z-78,Z-44,n[14]));w.uNear.value.set(-2+12*i,-1+17*i);const m=150*(1-u(18,74,Y+l.z-n[14]));it.uFade.value.set(1,48+m,104+m),ht.value=H-40*u(Z-118,Z-78,n[14]),gt.uFar.value=u(.33,.42,o),ct.uFade.value.x=u(72,132,Me-Ne.z),ut.uFade.value.x=u(104,152,N-Ne.z),w.uTime.value=t},dispose(){x&&x.dispose&&x.dispose()},heroError:at}}};export{da as default};
