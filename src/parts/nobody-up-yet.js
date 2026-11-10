import*as x from"three";const rt=["#F3E9C8","#7FA8A6","#4F8FB8","#C2BC6A","#A5432B","#234A3A","#161D1E"],s={WHITE:0,ROOF:1,SEA:2,STRAW:3,RED:4,GREEN:5,DARK:6,STREET:7,ROOMWALL:8,ROOMFLOOR:9,ROOMCEIL:10,PANE:11,WALL:12,GRASS:13,LEAF:14,TIN:15,WALLDEEP:16,TIE:17},bt=18,$e=22,Ve=o=>[parseInt(o.slice(1,3),16)/255,parseInt(o.slice(3,5),16)/255,parseInt(o.slice(5,7),16)/255],b=(o,t,e)=>[o[0]+(t[0]-o[0])*e,o[1]+(t[1]-o[1])*e,o[2]+(t[2]-o[2])*e],it=o=>o.map(t=>t<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4));function Nt(o=rt,t={}){const[e,f,h,u,r,l,g]=o.map(Ve),v=t.wall?Ve(t.wall):e,O=[v[0]*.45,v[1]*.66,v[2]*.78],T=[[e,f,[e[0]*.45,e[1]*.66,e[2]*.78]],[b(f,g,.46),b(f,g,.64),b(f,g,.74)],t.october?[b(h,l,.22),b(h,l,.55),b(h,l,.68)]:[h,b(h,l,.4),b(h,l,.55)],[u,b(u,l,.72),b(u,l,.86)],[r,b(r,g,.4),b(r,g,.54)],[b(l,u,.22),l,b(l,g,.45)],[b(g,f,.1),g,g],[b(e,g,.36),b(f,g,.5),b(f,g,.62)],[b(e,u,.1),b(g,f,.2),b(g,f,.3)],[e,b(g,l,.4),b(g,l,.4)],[e,b(g,f,.12),b(g,f,.12)],[h,h,h],[v,t.wall?b(f,u,.34):f,t.wall?b(b(f,u,.34),l,.16):O],t.october?[b(u,r,.2),b(b(u,r,.2),l,.7),b(b(u,r,.2),l,.84)]:[u,b(u,l,.72),b(u,l,.86)],t.october?[b(r,u,.45),b(b(r,u,.3),l,.6),b(b(r,l,.6),g,.4)]:[b(l,u,.22),l,b(l,g,.45)],[b(f,g,.2),b(f,g,.38),b(f,g,.5)],t.wall?Array(3).fill(b(b(f,u,.34),l,.16)):[O,O,O],[b(e,g,.42),b(f,g,.42),b(f,g,.56)]],R=[];for(const d of T)for(const y of d){const M=it(y);R.push(new x.Vector3(M[0],M[1],M[2]))}return R}function zt(o=rt,t={}){const[e,,f]=o.map(Ve),h=it(b(f,e,2/3)),u=it(f),r=256,l=new Uint8Array(r*r);let g=(t.seed??7)>>>0||7;const v=()=>(g=Math.imul(g,1664525)+1013904223>>>0)/4294967296,O=new Float32Array(r*r);for(let y=0;y<r*r;y++)O[y]=v();for(let y=0;y<r;y++)for(let M=0;M<r;M++){let q=0;for(let F=-3;F<=3;F++)q+=O[y*r+(M+F+r&255)];l[y*r+M]=Math.max(0,Math.min(255,Math.round((q/7-.5)*2.2*255+127.5)))}const T=new x.DataTexture(l,r,r,x.RedFormat,x.UnsignedByteType);T.wrapS=T.wrapT=x.RepeatWrapping,T.magFilter=x.LinearFilter,T.minFilter=x.LinearMipmapLinearFilter,T.generateMipmaps=!0,T.needsUpdate=!0;const R=[],d=[];for(let y=0;y<$e;y++)R.push(new x.Vector3(0,-1e4,0)),d.push(new x.Vector3(0,-1e4,0));return{uSun:{value:new x.Vector3(.9,.2,-.33).normalize()},uTime:{value:0},uGust:{value:0},uTab:{value:Nt(o,t)},uHead:{value:new x.Vector4(0,0,0,1)},uHeadZ:{value:1e9},uCar:{value:new x.Vector4(0,0,0,-1)},uCastM:{value:new x.Matrix4},uBoxMin:{value:R},uBoxMax:{value:d},uNoise:{value:T},uSkyTop:{value:new x.Vector3(...u)},uSkyHor:{value:new x.Vector3(...h)},uHorizon:{value:0},uWinPer:{value:7.6}}}const st=`
uniform vec3 uSun; uniform float uTime; uniform vec3 uTab[${bt*3}]; uniform vec4 uHead; uniform float uHeadZ; uniform mat4 uCastM; uniform vec4 uCar;
uniform vec3 uBoxMin[${$e}]; uniform vec3 uBoxMax[${$e}]; uniform sampler2D uNoise;
uniform vec3 uSkyTop; uniform vec3 uSkyHor; uniform float uHorizon;
vec3 hopTab(float pig, int k){ int i = int(clamp(pig, 0., ${bt-1}.) + .5) * 3 + k; return uTab[i]; }
// brush drag: one noise stretched 12:1 along the plane's long (level) axis, in world space. Returns 0..1.
float hopDrag(vec3 p, vec3 n){
  vec2 uv = abs(n.y) > .6 ? vec2(p.x / 12., p.z) : vec2((p.x * n.z - p.z * n.x) / 12., p.y);
  return texture2D(uNoise, uv * .16).r;
}
// the same hand with a loaded brush: streaks a hand wide and metres long. Returns 0..1.
float hopDragB(vec3 p, vec3 n){
  vec2 uv = abs(n.y) > .6 ? vec2(p.x / 12., p.z) : vec2((p.x * n.z - p.z * n.x) / 12., p.y);
  return texture2D(uNoise, uv * .037 + vec2(.37, .61)).r;
}
// the bare sky: the only gradient in the world, cerulean overhead to (2 cream : 1 blue) at the horizon, in level strokes.
vec3 hopSky(vec3 dir){
  float t = clamp(dir.y / .85, 0., 1.);
  t += (texture2D(uNoise, vec2(dir.x * .05 + dir.z * .03, dir.y * 3.)).r - .5) * .05;
  t = clamp(t, 0., 1.); t = 1. - (1. - t) * (1. - t);
  return mix(uSkyHor, uSkyTop, t);
}
// length (m) of the sun ray's chord through the caster boxes: > 0 means the point is in a thrown shadow.
float hopChordL(vec3 p, vec3 s){
  vec3 inv = 1. / (sign(s + 1e-6) * max(abs(s), vec3(1e-4)));
  float v = -1.;
  for (int i = 0; i < ${$e}; i++) {
    vec3 t0 = (uBoxMin[i] - p) * inv, t1 = (uBoxMax[i] - p) * inv;
    vec3 a = min(t0, t1), b = max(t0, t1);
    v = max(v, min(min(b.x, b.y), b.z) - max(max(a.x, a.y), max(a.z, 0.)));
  }
  // the unseen car we ride in: a screen in the plane x = uCar.x from z = uCar.z to uCar.w, base at uCar.y, 3.1 m tall, five window holes
  float tc = (uCar.x - p.x) * inv.x; vec3 q = p + s * tc;
  float dc = min(min(q.y - uCar.y, uCar.y + 3.1 - q.y), min(q.z - uCar.z, uCar.w - q.z));
  float per = max(uCar.w - uCar.z, 1e-3) / 5.;
  float dh = min(min(q.y - uCar.y - 1.35, uCar.y + 2.55 - q.y), per * (.36 - abs(fract((q.z - uCar.z) / per) - .5)));
  v = max(v, tc > 0. ? min(dc, -dh) : -1.);
  return v;
}
float hopChord(vec3 pw){ return hopChordL((uCastM * vec4(pw, 1.)).xyz, mat3(uCastM) * uSun); }
float hopCast(vec3 pw, float wob){ float v = hopChord(pw) - .05 + wob; float w = max(fwidth(v), 1e-4) * .75; return smoothstep(-w, w, v); }
// ruled lines (clapboard, ranks): cast-tone, never thinner than 1.5 px, flat average tint when closer than 3 px. c in metres.
// hopRuleW is the same rule with the width of c handed in (cw = fwidth(c)): for a rule laid inside a branch, whose width must be taken before it.
float hopRuleW(float c, float cw, float sp, float hw){
  float fw = max(cw, 1e-5); float d = abs(fract(c / sp + .5) - .5) * sp;
  float h = max(hw, .75 * fw); float a = (1. - smoothstep(h - .5 * fw, h + .5 * fw, d)) * (hw / h);
  return mix(a, 2. * hw / sp, smoothstep(.1, .25, fw / sp));
}
float hopRule(float c, float sp, float hw){ return hopRuleW(c, fwidth(c), sp, hw); }
// THE ROUTINE. pig: surface kind; n: unit world normal of the plane; pw: world position; line: rule spacing (0 = none);
// winLit: for rooms, 1 where the sun comes in at the window (pass -1. outside rooms to use the thrown shadows).
vec3 hopTone(float pig, vec3 n, vec3 pw, float line, float winLit){
  float drag = hopDrag(pw, n), dragB = hopDragB(pw, n);
  float face = step(.03, dot(n, uSun));
  float hd = max(dot(pw, uHead.xyz) + uHead.w, pw.z - uHeadZ); float hw = max(fwidth(hd), 1e-4);
  face *= smoothstep(-hw, hw, hd + (drag - .5) * .04 + (dragB - .5) * .14);
  float thr = winLit < -.5 ? hopCast(pw + n * .04, (drag - .5) * .03 + (dragB - .5) * .12) : 1. - winLit;
  vec3 sunC = hopTab(pig, 0), shC = hopTab(pig, 1), caC = hopTab(pig, 2);
  vec3 col = mix(shC, mix(sunC, caC, thr), face);
  // the rule's wander and its width are taken here, by every pixel, before the branch: taken inside it they are not defined
  // on a pixel whose neighbour lays no rule (the ground, where the ranks stop at a slope)
  float cn = texture2D(uNoise, vec2((pw.x + pw.z) * .11, .37)).r;
  float c = abs(n.y) > .6 ? pw.z : pw.y + (cn - .5) * .034;
  float cw = fwidth(c);
  if (line > .01) {
    float tie = step(16.5, pig);
    float a = hopRuleW(c, cw, line, abs(n.y) > .6 ? mix(.03, line * .29, tie) : .022);
    col = mix(col, mix(mix(caC, mix(shC, caC, .5), face * (1. - thr)), uTab[19], tie), a);
  }
  return col * (1. + (drag - .5) * .07 + (dragB - .5) * .15);
}
`,_t=`
attribute float aPig; attribute float aLine; attribute vec4 aWind;
#ifdef ROOM
attribute vec3 aWinC; attribute vec3 aWinS; attribute vec3 aWinC2; attribute vec3 aWinS2;
varying vec3 vWinC; varying vec3 vWinS; varying vec3 vWinC2; varying vec3 vWinS2; varying vec3 vL;
#endif
uniform float uTime; uniform float uGust;
varying vec3 vW; varying vec3 vN; varying float vPig; varying float vLine;
void main(){
  vec3 p = position;
  float ph = aWind.w;                                   // wind: xyz = throw (m), w = phase; blinds lift, valances flap
  float g = .5 + .5 * sin(uTime * (1.1 + fract(ph * 3.7)) + ph * 6.283) ; g = g * g * (.6 + .4 * uGust) * (1. + .22 * sin(uTime * 4.3 + ph * 41.));
  p += aWind.xyz * g;
  #ifdef ROOM
  vWinC = aWinC; vWinS = aWinS; vWinC2 = aWinC2; vWinS2 = aWinS2; vL = position;
  #endif
  vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; vN = mat3(modelMatrix) * normal; vPig = aPig; vLine = aLine;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Vt=`
${st}
varying vec3 vW; varying vec3 vN; varying float vPig; varying float vLine;
#ifdef ROOM
varying vec3 vWinC; varying vec3 vWinS; varying vec3 vWinC2; varying vec3 vWinS2; varying vec3 vL; uniform float uWinPer;
// 1 where the sun ray from this point leaves by the window (centre c; s = half width, half height, axis 0:x 1:z)
float winLit(vec3 p, vec3 sl, vec3 c, vec3 s){
  float n = floor(s.z * .5 + .01); float ax = step(.5, s.z - 2. * n);     // s.z = axis + 2 * (windows in the row)
  float pn = mix(p.x, p.z, ax), cn = mix(c.x, c.z, ax), sn = mix(sl.x, sl.z, ax);
  float t = (cn - pn) / (sign(sn + 1e-6) * max(abs(sn), 1e-4));
  vec3 q = p + sl * t;
  float al = mix(q.z, q.x, ax) - mix(c.z, c.x, ax);
  al -= clamp(floor(al / uWinPer + .5), 0., max(n - 1., 0.)) * uWinPer;
  float d = max(abs(al) - s.x, abs(q.y - c.y) - s.y);
  float w = min(max(fwidth(d), 1e-4) * .75, .4);
  float open = 1. - smoothstep(-.05, .05, hopChordL(q + sl * .12, sl) - .1);   // the hotel's own shadow across the window
  return (1. - smoothstep(-w, w, d)) * step(.02, t) * step(.01, s.x) * open;
}
#endif
void main(){
  vec3 n = vN / max(length(vN), 1e-4);
  vec3 col;
  if (abs(vPig - 11.) < .5) {                                    // a far window: sky over a level sea, by the ray, so it parallaxes as a real opening
    vec3 d = vW - cameraPosition; d /= max(length(d), 1e-4);
    float w = max(fwidth(d.y), 1e-5);
    float sea = 1. - smoothstep(-w, w, d.y - uHorizon);
    float rid = hopRule(1. / max(uHorizon - d.y, .004) + uTime * 1.4, 9., .9) * step(d.y, uHorizon);   // the rows march
    col = mix(hopSky(d), mix(mix(uTab[6], uTab[7], .6), uTab[6], rid), sea);
  } else {
    float wl = -1.;
    #ifdef ROOM
    vec3 sl = mat3(uCastM) * uSun;
    wl = max(winLit(vL, sl, vWinC, vWinS), winLit(vL, sl, vWinC2, vWinS2));
    #endif
    col = hopTone(vPig, n, vW, vLine, wl);
  }
  gl_FragColor = vec4(col, 1.);
}`;function Ot(o,t={}){return new x.ShaderMaterial({uniforms:o,vertexShader:_t,fragmentShader:Vt,defines:t.room?{ROOM:1}:{},side:t.side??x.FrontSide,fog:!1,toneMapped:!1})}function lt(){return{pos:[],nor:[],pig:[],line:[],wind:[],wc:[],ws:[],wc2:[],ws2:[],win:null,win2:null}}const ct=[0,0,0,0],Kt=[0,0,0];function I(o,t,e,f,h,u,r=0,l=null){const g=e[0]-t[0],v=e[1]-t[1],O=e[2]-t[2],T=h[0]-t[0],R=h[1]-t[1],d=h[2]-t[2];let y=v*d-O*R,M=O*T-g*d,q=g*R-v*T;const F=Math.hypot(y,M,q)||1;y/=F,M/=F,q/=F;const Y=[t,e,f,t,f,h],ie=l?[l[0],l[1],l[2],l[0],l[2],l[3]]:null;for(let E=0;E<6;E++){o.pos.push(Y[E][0],Y[E][1],Y[E][2]),o.nor.push(y,M,q),o.pig.push(u),o.line.push(r);const ee=ie?ie[E]:ct;if(o.wind.push(ee[0],ee[1],ee[2],ee[3]),o.win){const D=o.win,k=o.win2||kt;o.wc.push(D[0],D[1],D[2]),o.ws.push(D[3],D[4],D[5]),o.wc2.push(k[0],k[1],k[2]),o.ws2.push(k[3],k[4],k[5])}}}const kt=[0,0,0,0,0,0];function j(o,t,e,f,h,u,r,l,g=0,v="",O=l){const T=(R,d,y,M,q=l,F=g)=>I(o,R,d,y,M,q,F);v.includes("x")||T([t,e,f],[t,e,r],[t,u,r],[t,u,f]),v.includes("X")||T([h,e,r],[h,e,f],[h,u,f],[h,u,r]),v.includes("y")||T([t,e,f],[h,e,f],[h,e,r],[t,e,r],l,0),v.includes("Y")||T([t,u,r],[h,u,r],[h,u,f],[t,u,f],O,0),v.includes("z")||T([h,e,f],[t,e,f],[t,u,f],[h,u,f]),v.includes("Z")||T([t,e,r],[h,e,r],[h,u,r],[t,u,r])}function B(o,t){return{O:o,N:t,R:[t[2],0,-t[0]]}}const c=(o,t,e,f)=>[o.O[0]+o.R[0]*t-o.N[0]*f,o.O[1]+e,o.O[2]+o.R[2]*t-o.N[2]*f];function te(o,t,e,f,h,u,r,l,g=0,v=null){h-e<1e-4||u-f<1e-4||I(o,c(t,e,f,r),c(t,h,f,r),c(t,h,u,r),c(t,e,u,r),l,g,v)}function le(o,t,e,f,h,u,r,l,g=0,v=0){te(o,t,e,f,h,u,v-r,l,g),I(o,c(t,e,u,v-r),c(t,h,u,v-r),c(t,h,u,v),c(t,e,u,v),l),I(o,c(t,e,f,v),c(t,h,f,v),c(t,h,f,v-r),c(t,e,f,v-r),l),I(o,c(t,e,f,v),c(t,e,f,v-r),c(t,e,u,v-r),c(t,e,u,v),l),I(o,c(t,h,f,v-r),c(t,h,f,v),c(t,h,u,v),c(t,h,u,v-r),l)}function Oe(o,t,e,f,h,u,r,l,g=0){let v=e;for(const O of r)te(o,t,v,h,O.u-O.hw,u,0,l,g),te(o,t,O.u-O.hw,h,O.u+O.hw,O.y0,0,l,g),te(o,t,O.u-O.hw,O.y1,O.u+O.hw,u,0,l,g),v=O.u+O.hw;te(o,t,v,h,f,u,0,l,g)}function je(o,t,e,f={}){const h=f.rev??.3,u=e.u-e.hw,r=e.u+e.hw,l=s.WHITE;I(o,c(t,u,e.y0,0),c(t,u,e.y0,h),c(t,u,e.y1,h),c(t,u,e.y1,0),l),I(o,c(t,r,e.y0,h),c(t,r,e.y0,0),c(t,r,e.y1,0),c(t,r,e.y1,h),l),I(o,c(t,u,e.y0,0),c(t,r,e.y0,0),c(t,r,e.y0,h),c(t,u,e.y0,h),l),I(o,c(t,u,e.y1,h),c(t,r,e.y1,h),c(t,r,e.y1,0),c(t,u,e.y1,0),l),le(o,t,u-.14,e.y0-.13,r+.14,e.y0,.15,l),le(o,t,u-.2,e.y1,r+.2,e.y1+.16,.13,l),le(o,t,u-.13,e.y0,u,e.y1,.035,l),le(o,t,r,e.y0,r+.13,e.y1,.035,l);const g=(e.y0+e.y1)*.5;if(f.big){const v=e.y1-(e.y1-e.y0)*.3,O=(R,d,y,M)=>{le(o,t,R,d,y,M,.08,l,0,h*.55),I(o,c(t,y,d,h*.55),c(t,R,d,h*.55),c(t,R,M,h*.55),c(t,y,M,h*.55),l)},T=f.lights??3;for(let R=1;R<T;R++){const d=u+(r-u)*R/T;O(d-.06,e.y0,d+.06,e.y1)}O(u,v,r,v+.12)}else f.open?f.clear||le(o,t,u,e.y1-.5,r,e.y1-.42,.05,l,0,h*.72):le(o,t,u,g-.04,r,g+.04,.05,l,0,h*.72);if(f.blind>.01){const v=e.y1-(e.y1-e.y0)*f.blind,O=f.phase??0,T=[0,.42,0,O];te(o,t,u,v,r,e.y1,h*.55,f.blindPig??s.STRAW,0,[T,T,ct,ct]),te(o,t,e.u-.03,v-.16,e.u+.03,v,h*.55,s.WHITE,0,[T,T,T,T])}f.glass&&te(o,t,u,e.y0,r,e.y1,h,s.DARK)}function ut(o,t=!1){const e=new x.BufferGeometry;return e.setAttribute("position",new x.Float32BufferAttribute(o.pos,3)),e.setAttribute("normal",new x.Float32BufferAttribute(o.nor,3)),e.setAttribute("aPig",new x.Float32BufferAttribute(o.pig,1)),e.setAttribute("aLine",new x.Float32BufferAttribute(o.line,1)),e.setAttribute("aWind",new x.Float32BufferAttribute(o.wind,4)),t&&(e.setAttribute("aWinC",new x.Float32BufferAttribute(o.wc,3)),e.setAttribute("aWinS",new x.Float32BufferAttribute(o.ws,3)),e.setAttribute("aWinC2",new x.Float32BufferAttribute(o.wc2,3)),e.setAttribute("aWinS2",new x.Float32BufferAttribute(o.ws2,3))),e.computeBoundingSphere(),e.computeBoundingBox(),e}function Pe(o,t,e,f,h,u,r,l=s.WHITE,g=0){const v=[t.N[0],t.N[1],t.N[2],-(t.N[0]*t.O[0]+t.N[2]*t.O[2])],O=[e,f],T=[h,f],R=[h,u],d=[e,u],y=[[O,T],[T,R],[R,d],[d,O]];for(const[M,q]of y)o.push({p:[c(t,M[0],M[1],0),c(t,q[0],q[1],0),c(t,q[0],q[1],-r),c(t,M[0],M[1],-r)],pl:v,pig:l,line:g});o.push({p:[O,T,R,d].map(M=>c(t,M[0],M[1],-r)),pl:v,pig:l,line:g})}function Dt(o,t){const e=new x.InstancedBufferGeometry;e.setAttribute("position",new x.Float32BufferAttribute([0,0,0,1,0,0,2,0,0,3,0,0],3)),e.setIndex([0,1,2,0,2,3]);const f=(r,l,g)=>{const v=new Float32Array(Math.max(1,t.length)*l);t.forEach((O,T)=>v.set(g(O),T*l)),e.setAttribute(r,new x.InstancedBufferAttribute(v,l))};for(let r=0;r<4;r++)f("aP"+r,3,l=>l.p[r]);f("aPl",4,r=>r.pl),f("aPg",2,r=>[r.pig,r.line]),e.instanceCount=t.length;const h=new x.ShaderMaterial({uniforms:o,side:x.DoubleSide,toneMapped:!1,vertexShader:`
      attribute vec3 aP0; attribute vec3 aP1; attribute vec3 aP2; attribute vec3 aP3; attribute vec4 aPl; attribute vec2 aPg;
      uniform vec3 uSun; uniform mat4 uCastM; varying vec3 vW; varying vec3 vN; varying vec2 vPg;
      void main(){
        vec3 P = position.x < .5 ? aP0 : position.x < 1.5 ? aP1 : position.x < 2.5 ? aP2 : aP3;
        vec3 sl = mat3(uCastM) * uSun; float ns = dot(aPl.xyz, sl);
        float t = (dot(aPl.xyz, P) + aPl.w) / max(ns, .03);
        vec4 w = modelMatrix * vec4(P - sl * t + aPl.xyz * .015, 1.);
        vW = w.xyz; vN = mat3(modelMatrix) * aPl.xyz; vPg = aPg;
        gl_Position = ns < .03 ? vec4(2., 2., 2., 1.) : projectionMatrix * viewMatrix * w;
      }`,fragmentShader:`
      ${st}
      varying vec3 vW; varying vec3 vN; varying vec2 vPg;
      void main(){ vec3 n = vN / max(length(vN), 1e-4); gl_FragColor = vec4(hopTone(vPg.x, n, vW, vPg.y, 0.), 1.); }`}),u=new x.Mesh(e,h);return u.frustumCulled=!1,u.name="thrown-shadows",u}const Mt=1.3,Yt=Mt,p=85,w=4.5,ce=6.8,ft=25,U=18,ht=[.3,3.9,8.6,13.3],ne=11,G=3,V=6,me=23.2,Tt=1,Zt=2.55,Lt=.45,Et=3.3,fe=-70,he=p+14,pe=10.6,re=3,Me=6.3;let pt=null;async function Te(o,t,e,f,h,u,r,l,g){for(let v=0;v<u.length-1;v++){pt&&await pt();const O=u[v],T=u[v+1],R=v===0&&!(g&&g.upper),d=v===Tt&&!(g&&g.upper),y=d?Zt:Mt,M=O+(d?Lt:.7),q=M+(R?2.2:d?Et:2.9),F=[];for(let Y=0;Y<f;Y++)F.push({u:(Y+.5)*ce,hw:y,y0:M,y1:q});Oe(o,e,0,f*ce,R?0:O,T,F,s.WALL,.78);for(let Y=0;Y<f;Y++){const ie=r[v][Y],E=F[Y];if(je(o,e,E,{blind:ie.drop,blindPig:ie.pig,phase:ie.ph,glass:!t,open:ie.open,big:d&&!ie.open,lights:4}),I(o,c(e,E.u-y-.14,M-.13,-.012),c(e,E.u-y-.4,M-.42,-.012),c(e,E.u+y-.12,M-.42,-.012),c(e,E.u+y+.14,M-.13,-.012),s.WALLDEEP,.78),!t)continue;const ee=l[v][f-1-Y],D=Y*ce+.1,k=D+ce-.2,Z=.3,H=h-.3,A=O+.05,$=T-.3,ge=q-(q-M)*ee.drop,Ee=c(e,E.u,(M+ge)*.5,H);if(t.win=[Ee[0],Ee[1],Ee[2],y,Math.max(0,(ge-M)*.5),0],I(t,c(e,D,A,Z),c(e,k,A,Z),c(e,k,A,H),c(e,D,A,H),s.ROOMFLOOR),I(t,c(e,D,$,H),c(e,k,$,H),c(e,k,$,Z),c(e,D,$,Z),s.ROOMCEIL),I(t,c(e,D,A,Z),c(e,D,A,H),c(e,D,$,H),c(e,D,$,Z),s.ROOMWALL),I(t,c(e,k,A,H),c(e,k,A,Z),c(e,k,$,Z),c(e,k,$,H),s.ROOMWALL),te(t,e,D,A,E.u-y,$,H,s.ROOMWALL),te(t,e,E.u+y,A,k,$,H,s.ROOMWALL),te(t,e,E.u-y,A,E.u+y,M,H,s.ROOMWALL),te(t,e,E.u-y,ge,E.u+y,$,H,s.ROOMWALL),te(t,e,E.u-y,M,E.u+y,ge,H,s.PANE),te(t,e,E.u-y,M-.1,E.u+y,M,H-.12,s.ROOMCEIL),g&&g.bed&&g.bed(v,Y)){const ae=D+.5,X=1.5;t.win2=null,I(t,c(e,ae,A+.55,Z+2.2),c(e,ae+X,A+.55,Z+2.2),c(e,ae+X,A+.55,Z+4.3),c(e,ae,A+.55,Z+4.3),s.ROOMCEIL),I(t,c(e,ae+X,A,Z+2.2),c(e,ae+X,A,Z+4.3),c(e,ae+X,A+.55,Z+4.3),c(e,ae+X,A+.55,Z+2.2),s.ROOMWALL),te(t,e,ae,A,ae+X,A+.55,Z+2.2,s.ROOMWALL),te(t,e,ae,A,ae+X,A+1.15,Z+4.3,s.ROOMWALL)}}}}async function Ut(o,t={}){const e=o.rng.fork?o.rng.fork("nobody-up-yet-hotel"):o.rng,f=t.detail??o.quality?.detail??1,h=t.palette??rt,u=e()<.22,r=t.colourway?t.colourway==="straw":u,l=!!t.october,g=r?"#"+b(Ve(h[0]),Ve(h[3]),.55).map(a=>Math.round(a*255).toString(16).padStart(2,"0")).join(""):null,v=t.uniforms??zt(h,{wall:g,october:l,seed:Math.floor(e()*1e6)});await o.yield(),pt=o.yield;const O=Ot(v),T=Ot(v,{room:!0}),R=new x.Group;R.name="hotel";const d=lt(),y=lt(),M=21+Math.floor(e()*3),q=t.heroBay??M,F=1,Y=(a,n)=>ht.map((i,m)=>Array.from({length:a},(P,W)=>{const N=e(),L=e(),z=e(),S=e();return{drop:l?.97:N<.07?0:.12+.7*L*(.6+.4*N),pig:z<.42?s.GREEN:s.STRAW,ph:S,open:!1,curtain:n&&S<(t.curtainShare??.13)*(l?.5:1)*Math.min(1,f+.2)&&m>0}})),ie=ne*ce,E=[Y(ne,1),Y(G,1),Y(ft-ne-G,1)],ee=[Y(ft-ne-G,0),Y(G,0),Y(ne,0)];for(const[a,n]of t.openBays||[[1,1],[1,3],[2,2]])E[2][a][n].curtain=!0;for(const[a,n]of t.curtainBays||[])E[2][a][n].curtain=!0;const D=q<ne?E[0][F][q]:E[2][F][q-ne-G];D.drop=.1,D.open=!0,D.curtain=!0,D.hero=!0;for(const[a,n]of t.clearBays||[]){const i=E[0][a][n];i.drop=0,i.curtain=!1}for(const[a,n]of t.bareBays||[]){const i=E[2][a][n];i.drop=Math.min(i.drop,.12),i.curtain=!1}for(const a of E)for(const n of a)for(const i of n)i.curtain&&(i.open=!0,i.drop=Math.min(i.drop,.3));for(const[a,n]of t.openBays||[]){const i=E[2][a][n];i.drop=0,i.open=!0,i.curtain=!1}{const a=(m,P,W)=>{const N=Math.sin(m*12.9898+P*78.233+W*37.719)*43758.5453;return N-Math.floor(N)},n=[0,ne,ne+G],i=[];for(let m=0,P=n[2]+E[2][1].length;m<P;m++){const W=_=>i[m-_].q,N=(_,Q,be)=>m>=Q&&Math.abs(_-W(Q))<be,L=(_,Q)=>m>=3*Q&&(_-W(Q))*(W(Q)-W(2*Q))>0&&(W(Q)-W(2*Q))*(W(2*Q)-W(3*Q))>0,z=_=>m>=4&&(_-W(1))*(W(1)-W(2))<0&&(W(1)-W(2))*(W(2)-W(3))<0&&(W(2)-W(3))*(W(3)-W(4))<0,S=_=>16*N(_,1,.25)+4*(L(_,1)+L(_,2)+L(_,3))+2*z(_)+N(_,2,.07)+N(_,3,.07)+N(_,4,.07);let K=a(1,m,40),C=S(K);for(let _=1;_<48&&C>0;_++){const Q=a(1,m,40+_),be=S(Q);be<C&&(K=Q,C=be)}const Be=m>=3&&i[m-1].green===i[m-2].green&&i[m-2].green===i[m-3].green,xe=!(m&&i[m-1].open)&&a(1,m,23)<.36;i.push({q:K,green:Be?!i[m-1].green:a(1,m,29)<.42,open:xe,curtain:xe&&a(1,m,31)<.5})}[[E[0],ee[2]],[E[1],ee[1]],[E[2],ee[0]]].forEach(([m,P],W)=>m.forEach((N,L)=>N.forEach((z,S)=>{const K=a(L,S,W),C=z.hero||(l?L===1?K<.5:K<.14:L===1),Be=n[W]+S;if(!C)return;if(L===1&&!l){const _=i[Be];z.drop=.03+.22*_.q,z.pig=_.green?s.GREEN:s.STRAW,_.open&&(z.open=!0,_.curtain&&(z.curtain=!0))}else z.drop=Math.min(z.drop,.03+(L===1?.22:.3)*a(L,S,W+7));const xe=P[L][N.length-1-S];xe.drop=Math.min(xe.drop,.04+.3*a(L,S,W+13))})))}const k=[...ht,U],Z=(a,n)=>f>=.8&&(a*7+n*3)%5===1,H=-p+ie,A=H+G*ce;await Te(d,y,B([-w,0,-p],[-1,0,0]),ne,2*w,k,E[0],ee[2],{bed:Z}),await o.yield(),await Te(d,y,B([-V,0,H],[-1,0,0]),G,2*V,k,E[1],ee[1],{bed:Z}),await o.yield(),await Te(d,y,B([-w,0,A],[-1,0,0]),ne,2*w,k,E[2],ee[0],{bed:Z}),await o.yield(),await Te(d,null,B([w,0,p],[1,0,0]),ne,0,k,ee[0],null),await o.yield(),await Te(d,null,B([V,0,A],[1,0,0]),G,0,k,ee[1],null),await Te(d,null,B([w,0,H],[1,0,0]),ne,0,k,ee[2],null),await o.yield();const $=[],ge=(a,n,i,m,P,W=Yt)=>{for(let N=0;N<m.length-1;N++){const L=m[N],z=m[N+1],S=L+.7,K=L<P?[]:i.map(C=>({u:C,hw:W,y0:S,y1:S+2.9}));Oe(d,a,0,n,N===0?0:L,z,K,s.WALL,.78);for(const C of K)je(d,a,C,{blind:l?.97:.15+.6*e(),blindPig:e()<.4?s.GREEN:s.STRAW,phase:e(),glass:!0}),Pe($,a,C.u-W-.14,C.y0-.13,C.u+W+.14,C.y0,.15,s.WALL,.78),Pe($,a,C.u-W-.2,C.y1,C.u+W+.2,C.y1+.16,.13,s.WALL,.78),Pe($,a,C.u-W-.13,C.y0,C.u-W,C.y1,.035,s.WALL,.78),Pe($,a,C.u+W,C.y0,C.u+W+.13,C.y1,.035,s.WALL,.78);Pe($,a,0,0,.32,m[m.length-1],.06,s.WALL,.78),Pe($,a,n-.32,0,n,m[m.length-1],.06,s.WALL,.78)}};ge(B([w,0,-p],[0,0,-1]),2*w,[2*w*(.3+.4*e())],k,0),ge(B([-w,0,p],[0,0,1]),2*w,[w],k,13);const Ee=[0,U,me];ge(B([V,0,H],[0,0,-1]),2*V,[],Ee,99),ge(B([-V,0,A],[0,0,1]),2*V,[],Ee,99);const ae=()=>[Array.from({length:G},()=>({drop:l?.97:.1+.7*e(),pig:e()<.4?s.GREEN:s.STRAW,ph:e()}))];await Te(d,null,B([-V,0,H],[-1,0,0]),G,0,[U,me],ae(),null,{upper:1}),await Te(d,null,B([V,0,A],[1,0,0]),G,0,[U,me],ae(),null,{upper:1});const X=(a,n,i,m=!0,P=!0)=>{m&&le(d,a,0,0,.32,i,.06,s.WHITE),P&&le(d,a,n-.32,0,n,i,.06,s.WHITE),le(d,a,0,i-.6,n,i,.07,s.WHITE),le(d,a,0,0,n,.32,.09,s.WHITE)};X(B([-w,0,-p],[-1,0,0]),ie,U,!0,!1),X(B([-w,0,A],[-1,0,0]),ie,U,!1,!0),X(B([w,0,p],[1,0,0]),ie,U,!0,!1),X(B([w,0,H],[1,0,0]),ie,U,!1,!0),X(B([-V,0,H],[-1,0,0]),G*ce,me),X(B([V,0,A],[1,0,0]),G*ce,me),X(B([w,0,-p],[0,0,-1]),2*w,U),X(B([-w,0,p],[0,0,1]),2*w,U),X(B([V,0,H],[0,0,-1]),2*V,me),X(B([-V,0,A],[0,0,1]),2*V,me);const oe=.85;j(d,-w-oe,U,-p-oe,w+oe,U+.45,p+oe,s.WHITE,0,"",s.ROOF);for(let a=0;a*3.4+1.7<2*p;a++){const n=-p+1.7+a*3.4;if(!(n>H-.5&&n<A+.5))for(const i of[-1,1])j(d,i<0?-w-oe+.15:w,U-.55,n-.12,i<0?-w:w+oe-.15,U,n+.12,s.WHITE,0,i<0?"XY":"xY")}await o.yield();const Qe=(a,n,i,m,P,W,N,L,z,S)=>{const K=[a,P,i],C=[n,P,i],Be=[n,P,m],xe=[a,P,m],_=[a+N,W,i+L],Q=[n-N,W,i+L],be=[n-N,W,m-L],nt=[a+N,W,m-L];I(d,C,K,_,Q,z,S),I(d,Be,C,Q,be,z,S),I(d,xe,Be,be,nt,z,S),I(d,K,xe,nt,_,z,S),I(d,nt,be,Q,_,z,0)},Ie=U+.45,ve=Ie+4.1;Qe(-w-.3,w+.3,-p-.3,p+.3,Ie,ve,1.45,1.45,s.ROOF,.52),j(d,-w+1.05,ve-.05,-p+1.05,w-1.05,ve+.22,p-1.05,s.WHITE,0,"y",s.ROOF);const ke=(a,n,i,m,P,W,N)=>{const L=i+P,z=1.5;Oe(d,{...a,O:[a.O[0]+a.N[0]*W,a.O[1],a.O[2]+a.N[2]*W]},n-m-.22,n+m+.22,i,L+.2,[{u:n,hw:m,y0:i+.25,y1:L}],s.WHITE);const S={...a,O:[a.O[0]+a.N[0]*W,a.O[1],a.O[2]+a.N[2]*W]};je(d,S,{u:n,hw:m,y0:i+.25,y1:L},{blind:N,blindPig:e()<.5?s.GREEN:s.STRAW,phase:e(),glass:!0,rev:.18});const K=n-m-.22,C=n+m+.22;I(d,c(S,K,i,z),c(S,K,i,0),c(S,K,L+.2,0),c(S,K,L+.2,z),s.ROOF),I(d,c(S,C,i,0),c(S,C,i,z),c(S,C,L+.2,z),c(S,C,L+.2,0),s.ROOF),I(d,c(S,K-.15,L+.2,-.2),c(S,C+.15,L+.2,-.2),c(S,C+.15,L+.45,z),c(S,K-.15,L+.45,z),s.ROOF),le(d,S,K-.15,L+.05,C+.15,L+.2,.2,s.WHITE)};await o.yield();for(let a=0;a<ft;a++){if(a>=ne&&a<ne+G)continue;const n=-p+(a+.5)*ce,i=a%2===0;i&&ke(B([-w-.3,0,-p],[-1,0,0]),n+p,Ie+.75,.6,2,.05,l?.97:.2+.6*e()),(i||e()<.3)&&ke(B([w+.3,0,p],[1,0,0]),p-n,Ie+.75,.6,2,.05,l?.97:.2+.6*e())}j(d,-V-oe,me,H-oe,V+oe,me+.45,A+oe,s.WHITE,0,"",s.ROOF);const Ne=me+.45,At=5+1.6*e(),ze=Ne+At;Qe(-V-.3,V+.3,H-.3,A+.3,Ne,ze,2.3,2.3,s.ROOF,.52),j(d,-V+1.7,ze-.05,H+1.7,V-1.7,ze+.25,A-1.7,s.WHITE,0,"y",s.ROOF),ke(B([-V-.3,0,H],[-1,0,0]),G*ce*.5,Ne+.8,.75,2.3,.05,.3),ke(B([V+.3,0,A],[1,0,0]),G*ce*.5,Ne+.8,.75,2.3,.05,.5);const Ae=ze+8.5,Ce=(H+A)*.5;j(d,-.11,ze+.2,Ce-.11,.11,Ae,Ce+.11,s.WHITE,0,"y"),j(d,-.24,Ae,Ce-.24,.24,Ae+.4,Ce+.24,s.WHITE);const vt=5+Math.floor(e()*3);for(let a=0;a<vt;a++){let n=-p+12+(a+.2+.6*e())*(2*p-24)/vt;n>H-2&&n<A+2&&(n=H-3);const i=(e()<.5?-1:1)*.9,m=2.2+e()*1.2;j(d,i-.55,ve+.2,n-.7,i+.55,ve+m,n+.7,s.WHITE,0,"y"),j(d,i-.68,ve+m,n-.83,i+.68,ve+m+.22,n+.83,s.WHITE,0,"",s.DARK)}const J=-w-3.2,se=3.05,Re=3.6;I(d,[J,se,p],[-w,Re,p],[-w,Re,-p],[J,se,-p],s.TIN,1.36),I(d,[J,se-.12,-p],[-w,Re-.12,-p],[-w,Re-.12,p],[J,se-.12,p],s.WHITE,0),j(d,J-.06,se-.42,-p,J,se+.02,p,s.WHITE,0,"X"),I(d,[-w,se-.42,-p],[J,se-.42,-p],[J,se,-p],[-w,Re,-p],s.WHITE),j(d,J,0,-p,-w,.3,p,s.WHITE,0,"yX",s.STREET);for(let a=0;a<=50;a++){const n=-p+.12+a*(2*p-.24)/50;j(d,J+.04,.3,n-.1,J+.24,se-.42,n+.1,s.WHITE,0,"yY")}j(d,J+.1,1.2,-p,J+.18,1.3,p,s.WHITE),j(d,J+.1,.5,-p,J+.18,.58,p,s.WHITE,0,"Y"),await o.yield();const ye=-w-fe,Je=8,Ge=a=>6+7.6*a,Le=re+.3,de=Le+6,Fe=Array.from({length:Je},(a,n)=>({u:Ge(n),hw:2.5,y0:Le,y1:de,k:n})),et=[...Fe].reverse().map(a=>({...a,u:ye-a.u})).concat([{u:ye+1.6,hw:2.5,y0:Le,y1:de,k:9}]),De=[{u:3.2,hw:1.4,y0:Le,y1:de,k:9},{u:10.8,hw:1.4,y0:Le,y1:de,k:9}],Ye=(a,n,i,m)=>{Oe(d,a,0,n,0,pe,i,s.WALL,.78),X(a,n,pe);for(const P of i)je(d,a,P,{open:P.k===0,clear:!0,big:P.k!==0,blind:P.k===0||m?0:l?.9:.08+.3*e(),blindPig:s.STRAW,phase:e()})};Ye(B([-w,0,p],[0,0,-1]),ye,Fe,!1),Ye(B([fe,0,he],[0,0,1]),ye+2*w,et,!1),Ye(B([fe,0,p],[-1,0,0]),14,De,!1),Ye(B([w,0,he],[1,0,0]),14,De,!0),j(d,fe-.7,pe,p,w+.7,pe+.4,he+.7,s.WHITE,0,"",s.ROOF),j(d,fe-.7,pe,p-.7,-w,pe+.4,p,s.WHITE,0,"Z",s.ROOF),Qe(fe-.25,w+.25,p-.25,he+.25,pe+.4,pe+3.2,3,3,s.ROOF,.52),y.win=[w,(Le+de)*.5,p+3.2,1.4,3,4],y.win2=[-w-Ge(Je-1),(Le+de)*.5,p,2.5,3,1+2*Je];const He=fe+.3,Se=w-.3,_e=p+.3,ue=he-.3,We=pe-.4;I(y,[He,re,_e],[He,re,ue],[Se,re,ue],[Se,re,_e],s.ROOMFLOOR,.34),I(y,[He,We,_e],[Se,We,_e],[Se,We,ue],[He,We,ue],s.ROOMCEIL);const Ze=(a,n)=>[...a].reverse().map(i=>({...i,u:n-i.u}));Oe(y,B([fe,0,_e],[0,0,1]),.3,ye+2*w-.3,re,We,Ze(Fe,ye).map(a=>({...a})),s.ROOMWALL),Oe(y,B([w,0,ue],[0,0,-1]),.3,ye+2*w-.3,re,We,Ze(et,ye+2*w),s.ROOMWALL),Oe(y,B([Se,0,p],[-1,0,0]),.3,13.7,re,We,Ze(De,14),s.ROOMWALL),Oe(y,B([He,0,he],[1,0,0]),.3,13.7,re,We,Ze(De,14),s.ROOMWALL);for(const a of et){const n=fe+a.u;for(const i of[-1,1])j(y,n+i*(a.hw+.16)-.16,re,ue-.1,n+i*(a.hw+.16)+.16,de+.36,ue,s.WHITE,0,"yZ");j(y,n-a.hw-.46,de+.02,ue-.13,n+a.hw+.46,de+.4,ue,s.WHITE,0,"Z")}j(y,He,re,ue-.06,Se,re+.28,ue,s.WHITE,0,"yZxX"),y.win=null,y.win2=null,await o.yield();const dt=new x.Mesh(ut(d),O);dt.name="hotel-slabs",R.add(dt),await o.yield();const wt=new x.Mesh(ut(y,!0),T);if(wt.name="hotel-rooms",R.add(wt),R.add(Dt(v,$)),await o.yield(),t.apron!==!1){const a=lt();I(a,[-190,0,230],[150,0,230],[150,0,-230],[-190,0,-230],s.STRAW,.4);const n=new x.Mesh(ut(a),O);n.name="apron",R.add(n)}[[-w+.35,-1,-p+.35,w-.35,U,p-.35],[-w-oe,U,-p-oe,w+oe,U+.45,p+oe],[-w+1.15,Ie,-p+1.15,w-1.15,ve+.2,p-1.15],[-V+.35,-1,H+.35,V-.35,Ne,A-.35],[fe+.35,-1,p+.35,w-.35,pe+.4,he-.35],[J,se-.4,-p,-w,Re,p]].forEach((a,n)=>{v.uBoxMin.value[n].set(a[0],a[1],a[2]),v.uBoxMax.value[n].set(a[3],a[4],a[5])});const qe=[],Xe=(a,n,i,m,P,W,N)=>qe.push({base:a,nx:n,nz:i,w:m,len:P,ph:W,mode:N});let mt=null;const Ct=[[0,-w,-p],[1,-V,H],[2,-w,A]];for(const[a,n,i]of Ct)E[a].forEach((m,P)=>m.forEach((W,N)=>{if(!W.curtain)return;const L=ht[P]+(P===Tt?Lt+Et:.7+(P===0?2.2:2.9))-.05,z=i+(N+.5)*ce;W.hero?(mt=new x.Vector3(n,L,z),Xe([n,L,z+.3],-.97,.24,4.3,5,W.ph,1)):Xe([n,L,z],-1,0,2.2,2.6+.6*W.ph,W.ph,.25)}));Xe([0,Ae-.2,Ce],-.94,.34,1.5,6.5,e(),2),Xe([-w-Ge(1)-.9,de-.05,he-.75],0,-1,2.6,5.5,.2,0);const Ke=new x.InstancedBufferGeometry;Ke.copy(new x.PlaneGeometry(1,1,12,16));const tt=(a,n,i)=>{const m=new Float32Array(qe.length*n);qe.forEach((P,W)=>m.set(i(P),W*n)),Ke.setAttribute(a,new x.InstancedBufferAttribute(m,n))};tt("aBase",3,a=>a.base),tt("aOut",4,a=>[a.nx,a.nz,a.w,a.len]),tt("aCh",2,a=>[a.ph,a.mode]),Ke.instanceCount=qe.length;const Rt=new x.ShaderMaterial({uniforms:v,side:x.DoubleSide,toneMapped:!1,vertexShader:`
      attribute vec3 aBase; attribute vec4 aOut; attribute vec2 aCh; uniform float uTime; uniform float uGust; varying vec3 vW; varying float vFold; varying float vOut; varying float vKind;
      void main(){
        vFold = 0.; vOut = 0.; vKind = aCh.y;
        float t = 1. - uv.y, sx = uv.x - .5, ph = aCh.x * 6.283, L = aOut.w;
        vec3 N = vec3(aOut.x, 0., aOut.y), Rv = vec3(aOut.y, 0., -aOut.x), p;
        if (aCh.y > 1.5) {                                      // the pennant: streams level, tapers, ripples
          vFold = t * 7. - uTime * 5. + ph + 1.57;
          float rip = sin(t * 7. - uTime * 5. + ph) * .28 * t + sin(t * 13. - uTime * 8.) * .07 * t;
          p = aBase + N * (t * L) + vec3(0., sx * aOut.z * (1. - .8 * t) - t * t * .8 + sin(t * 4. - uTime * 3.) * .15 * t, 0.) + Rv * rip;
        } else {
          float amb = .5 + .5 * sin(uTime * 1.5 + ph); amb *= amb; amb = .12 + .88 * amb;
          // 0 hangs in the room, 1 blown out flat (the short curtains of the flank only breathe out past the sill). THE LONG CURTAIN
          // (mode 1) is the same cloth, longer: it hangs from its rod across the raised sash and the gust lifts it out over the veranda
          // roof, downwind, bellying, its free end flapping, so it is a curtain from the first sight of it to the pass.
          float lg = step(.5, aCh.y), g = mix(amb * (aCh.y > .1 ? .5 : .9), .3 + .52 * uGust + .04 * sin(uTime * 2.1 + ph), lg);
          float a = (g * 1.5 - .22) * (.45 + .55 * t) + sin(t * 8. - uTime * 6. + ph) * .1 * t * (.3 + g);
          float c = 1. - cos(a), s = sin(a);                    // closed-form sweep of a bending strip
          float outw = L * t * s * .92 + sin(t * 3.1416) * .4 * g * (1. - 2.2 * sx * sx), down = L * t * (1. - c * .8);
          vFold = sx * mix(11., 8., lg) + t * 3. - uTime * 2.5 + ph; vOut = t * g - .45;     // how far out of the window this part of the cloth has blown
          float fold = sin(vFold) * .1 * (.35 + t);
          p = aBase + N * (-.45 + outw + fold) + vec3(0., -down, 0.) + Rv * (sx * aOut.z * (1. - .25 * t * g) + sin(t * 5. - uTime * 3.2 + ph) * .14 * t * g);
        }
        vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:`
      ${st}
      varying vec3 vW; varying float vFold; varying float vOut; varying float vKind;
      void main(){                                              // cloth is thin: sun reaches both sides; its folds are painted, one tone each
        float c = cos(vFold), w = max(fwidth(c), 1e-4);
        float f = smoothstep(-w, w, c - (vKind > .5 && vKind < 1.5 ? .62 : 0.));   // the long curtain: narrow strokes of shade in the folds of a cream cloth
        float hd = max(dot(vW, uHead.xyz) + uHead.w, vW.z - uHeadZ);
        float lit = (1. - hopCast(vW, 0.)) * step(0., hd);
        float ow = max(fwidth(vOut), 1e-4);                     // blown clear of the sash, the cloth catches the sun that comes level through the room behind it
        lit = max(lit, smoothstep(-ow, ow, vOut) * step(0., hd));
        vec3 col = mix(mix(uTab[1], uTab[2], f), mix(uTab[0], uTab[1], f), lit);
        gl_FragColor = vec4(col * (1. + (hopDrag(vW, vec3(0., 0., 1.)) - .5) * .07), 1.);
      }`}),at=new x.Mesh(Ke,Rt);at.frustumCulled=!1,at.name="curtains",R.add(at),await o.yield();const we=-w-6,gt=[];for(let a=0;a<26;a++){const n=e(),i=-p+3+e()*(2*p-6);gt.push(n<.4?[-w+1.05+.1,ve+.22,i]:n<.7?[-w-oe+.2,U+.45,i]:n<.85?[J+.3,se+.06,i]:[fe+4+e()*50,pe+3.2,p+7])}const Ht={eyeY:Me,flyThrough:[[we-9.5,Me,-p-60],[we-8,Me,-p],[we-4,Me,0],[we,Me,p-6],[we,Me,p],[we,Me,he],[we,Me,he+12]].map(a=>new x.Vector3(...a)),buffers:new x.Vector3(we-8,0,-p),reveal:{position:new x.Vector3(-34,5,-p-150),target:new x.Vector3(-2,11,-30)},windowIn:{center:new x.Vector3(we,re+3.3,p),width:5,height:6,normal:new x.Vector3(0,0,-1)},windowOut:{center:new x.Vector3(we,re+3.3,he),width:5,height:6,normal:new x.Vector3(0,0,1)},diningFloorY:re,curtain:mt,pennant:new x.Vector3(0,Ae,Ce),perches:gt.map(a=>new x.Vector3(...a)),roofTop:ve+.22,eave:U,portalSeat:null},yt=Math.PI/180,St=t.curtainU??.47;let Wt=!1;const Ue=(a,n=20,i=!1)=>{const m=a*yt,P=n*yt;v.uSun.value.set((i?-1:1)*Math.cos(m)*Math.cos(P),Math.sin(m),-Math.cos(m)*Math.sin(P))},ot=a=>{v.uGust.value=Math.max(0,Math.min(1,a))},Bt=a=>{const n=Math.max(0,Math.min(1,a/.4));Wt=!0,Ue(8+12*n*n*(3-2*n),20,!!t.evening);const i=Math.abs(a-St)/.07;ot(i<1?(1-i*i)*(1-i*i):0)};Ue(14,20,!!t.evening);const xt=new x.Matrix4;let Pt=118,It=new x.Vector3(-20,9,8);return{object:R,radius:Pt,height:null??Ae+.4,center:It,anchors:Ht,uniforms:v,material:O,roomMaterial:T,setProgress:Bt,setSun:Ue,setGust:ot,update(a,n){if(v.uTime.value=n,R.updateWorldMatrix(!0,!1),xt.copy(R.matrixWorld).invert(),v.uCastM.value.copy(xt),!Wt){const i=.5+.5*Math.sin(n*.55);ot(i*i),Ue(14+5*Math.sin(n*.3),20,!!t.evening)}},dispose(){v.uNoise.value.dispose()},ground:!1,groundY:0}}export{rt as HOP_PALETTE,s as PIG,st as STYLE_GLSL,Ut as buildHero,le as hopBoard,j as hopBox,ut as hopFinish,B as hopFrame,lt as hopGeo,Ot as hopMaterial,I as hopQuad,te as hopRect,Pe as hopShadowBoard,Dt as hopShadowMesh,Nt as hopToneTable,Oe as hopWall,je as hopWindow,zt as makeHopUniforms};
