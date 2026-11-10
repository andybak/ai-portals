import*as z from"three";import{cmStream as he,CM_GLSL as de,CM_RIBBON as Re,DIP_GLSL as Me,withShared as pe,Geo as be,bound as ge,CABLE_L as Ne,CABLE_FALL as Se,peakH as ke,C as ie,clamp as xe,lerp as ee,sstep as fe,ROPE_BARK as ze}from"./cables-to-the-moon-common.js";const w=(l,n,t)=>new z.Vector3(l,n,t),V=Math.PI*2,He=`
attribute vec4 aK; attribute vec3 aT, aAx; attribute vec2 aD;
uniform vec3 uCN, uLay;
varying vec3 vW, vN, vAround, vT; varying vec2 vRf;
${de}
${Me}
void main(){
  vec3 c = position;
  c.y -= cmDrop(c.xz)*aK.x;
  vec3 sw = cross(aAx, vec3(0.0, 1.0, 0.0)); sw /= max(length(sw), 1e-4);
  c += sw*aK.z*sin(uTime*0.31 + aT.z*6.2831853)*(0.6 + 0.4*sin(uTime*0.13 + aT.z*40.0));
  // (aD.x: how much of the cable's dip a point is spared: 0 on the cable, 1 on a root out on the hill)
  if (aK.w >= 0.0) c += uCN*cmCableDip(aK.w)*(1.0 - aD.x);
  vec4 mv = viewMatrix*vec4(c, 1.0);
  // A ROPE IS SOLID ALONG ITS WHOLE LENGTH: it is never drawn narrower than 1.6 pixels (0.8 of a pixel to each
  // side of its middle), and it is NOT dimmed toward the air behind it: where it grows thin far off its surface
  // goes to its own mean colour by the pixel's footprint (cmPx, in the fragment), never paler than itself
  float r = max(aK.y, uPx*0.8*max(-mv.z, 0.1));
  // THE STRANDS STAND ROUND in the rope's own outline where its mesh follows the lay (aD.y: how deep the
  // grooves between them are cut, as a share of the radius)
  float lay = fract(aT.y/6.2831853*uLay.x + aT.x/uLay.y + uLay.x/6.2831853*(0.2*sin(aT.y*2.0 + 1.0) + 0.1*sin(aT.y*3.0 + 4.0)));
  r *= 1.0 - aD.y*(1.0 - sqrt(clamp(lay*(1.0 - lay)*4.0, 0.0, 1.0)));
  vW = c + normal*r; vN = normal; vAround = cross(aAx, normal); vT = aT; vRf = vec2(aK.y, aK.x);
  gl_Position = projectionMatrix*viewMatrix*vec4(vW, 1.0);
}`,Ae=`
#define CM_FOLLOW vRf.y
uniform vec3 uRopeA, uRopeB, uRopeMoss; uniform vec3 uLay;     // strands, metres per turn, how much old pale web is wrapped on it
uniform vec2 uLow;
varying vec3 vW, vN, vAround, vT; varying vec2 vRf;
${de}
void main(){
  vec3 v = normalize(cameraPosition - vW);
  float l = vT.x, th = vT.y, rad = max(vRf.x, 0.05), px = cmPx(vW);      // the pixel's footprint on the rope (antialiasing)
  float lod = 1.0 - smoothstep(0.2, 1.2, px);                              // the strands' relief, grooves and glint go to their mean under it
  vec3 q3 = vec3(l, cos(th)*rad, sin(th)*rad);                 // the point in the rope's own metres
  // the lay: which strand, and where across it
  // (THE STRANDS ARE OF UNLIKE THICKNESS: round the rope they are from a third to five thirds of the common one)
  float layv = th/6.2831853*uLay.x + l/uLay.y + uLay.x/6.2831853*(0.2*sin(th*2.0 + 1.0) + 0.1*sin(th*3.0 + 4.0)), lay = fract(layv), ks = floor(layv);
  float sw = 6.2831853*rad/max(uLay.x, 1.0);
  vec2 sm = vec2(l, (lay - 0.5)*sw);
  float round_ = sqrt(clamp(lay*(1.0 - lay)*4.0, 0.0, 1.0)), groove = clamp(1.0 - round_, 0.0, 1.0);
  // yarns 0.8 m thick twisted the other way in each strand, and fibre in each yarn: each is there while it is
  // more than a pixel or two across
  float wY = 1.0 - smoothstep(0.25, 0.9, px/0.8), wF = 1.0 - smoothstep(0.25, 0.9, px/0.25);
  float yarn = fract(sm.y/0.8 - sm.x/5.5 + ks*0.37), yRound = sqrt(clamp(yarn*(1.0 - yarn)*4.0, 0.0, 1.0));
  float fib = 0.6*cmN(vec2(sm.x*0.35 + ks*7.3, sm.y*5.0 + ks*3.1)) + 0.4*cmN(vec2(sm.x*1.3 + ks*1.7, sm.y*17.0));
  // (round Q, R6 a: THE ROPE CLOSE TO. Beside it the finest thing was a fibre a quarter of a metre across and
  // metres long, so from 18 m it was soft streaks. Now each yarn is hair-fine fibre as well, 6 cm and 2 cm
  // across, in lengths of one to three metres, raised and furrowed: there while a pixel is under a few
  // centimetres of the rope, at its mean beyond)
  float wH = 1.0 - smoothstep(0.25, 0.9, px/0.07);
  float hairF = 0.6*cmN(vec2(sm.x*0.9 + ks*2.3, sm.y*48.0 + ks*5.7)) + 0.4*cmN(vec2(sm.x*2.7 + ks*9.1, sm.y*150.0));
  vec3 n = normalize(vN + vAround*((0.5 - lay)*1.9*lod + (0.5 - yarn)*0.9*wY + (hairF - 0.5)*0.9*wH));
  // old patches, pale web wrapped round and round
  float patch_ = smoothstep(0.5, 0.7, cmN3(q3*vec3(0.035, 0.09, 0.09) + 3.0));
  float wrap = smoothstep(0.42, 0.62, cmN3(q3*vec3(0.09, 0.06, 0.06) + 21.0))*uLay.z;
  float wline = 0.86 + 0.14*sin(l*7.0 + th*3.0 + 11.0*cmN(vec2(l*0.5, 2.0)));
  float lowK = uLow.x > 0.0 ? 1.0 - smoothstep(0.3*uLow.x, uLow.x, l) : 0.0;
  float highK = uLow.y > 0.0 ? smoothstep(uLow.y, 2.2*uLow.y, l) : 0.0;
  float under = smoothstep(-0.1, 0.7, -n.y);
  float moss = clamp(under*smoothstep(0.3, 0.7, cmN3(q3*0.11 + 5.0) + 0.25*under)
    + lowK*smoothstep(0.25, 0.8, groove + 0.6*cmN3(q3*0.23 + 9.0) - 0.15), 0.0, 1.0);
  vec3 alb = mix(uRopeA, uRopeB, patch_*0.7);
  alb *= (0.45 + 0.8*mix(0.5, fib, wF))*(1.0 + 0.7*(hairF - 0.5)*wH);
  alb *= 0.8 + 0.4*cmN3(q3*vec3(0.05, 0.2, 0.2) + 1.0);
  alb = mix(alb, mix(uRopeMoss, vec3(0.2, 0.4, 0.1), lowK)*(0.6 + 0.8*cmN3(q3*0.8)), moss*0.8*(1.0 - wrap));
  alb = mix(alb, vec3(0.5, 0.54, 0.44)*wline, wrap*0.16);                 // (old web on it: a faint paler tone, never bands)
  // the creeper: three stems as thick as an arm winding up against the lay, in leaf
  float cv = th/6.2831853*3.0 - l/23.0 + 0.3*cmN(vec2(l*0.11, 3.0));
  float dvn = abs(fract(cv) - 0.5)*6.2831853*rad/3.0;          // metres from the nearest stem
  float stem = (1.0 - smoothstep(0.16, 0.2 + px, dvn))*lowK;
  float leafy = (1.0 - smoothstep(0.5, 1.5 + px, dvn))*smoothstep(0.42, 0.56, cmN3(q3*0.75 + 13.0))*lowK;
  alb = mix(alb, vec3(0.26, 0.52, 0.12)*(0.6 + 0.9*cmN3(q3*2.6)), leafy*0.9);
  alb = mix(alb, vec3(0.1, 0.12, 0.06), stem*0.9);
  // the white threads: a few strays, each wandering its own way up the rope, in lengths (never a regular hatch)
  float tv = th/6.2831853*3.0 + l/7.3 + 1.3*cmN(vec2(l*0.09, 5.0)) + 0.4*cmN(vec2(l*0.31, th + 9.0));
  float thread = 1.0 - smoothstep(0.02, 0.03 + px/1.7, abs(fract(tv) - 0.5));
  thread = mix(thread, 0.1, smoothstep(0.15, 0.6, px/1.7))*smoothstep(0.46, 0.66, cmN3(q3*vec3(0.045, 0.12, 0.12) + 40.0))*highK;
  alb = mix(alb, vec3(0.6, 0.66, 0.52), thread*0.6);
  float ndl = dot(n, uSunDir), diff = clamp((ndl + 0.3)/1.3, 0.0, 1.0);
  // lit by the sun on one side, by the sky's colour at its own height, and from below by the bright roof of the
  // forest: a lit side and a shadow side, never a black bar against the sky
  vec3 bounce = cmBounceL*vec3(0.42, 0.47, 0.3)*dot(uSunCol, vec3(0.33))*0.8*clamp(0.6 - 0.4*n.y, 0.0, 1.0);
  // (under the footprint the grooves' shade and the yarns' go to their own means, 0.315 and 0.903: a far rope
  // has the light of a near one)
  float ao = (1.0 - 0.85*mix(0.315, smoothstep(0.0, 0.6, groove), lod)*(1.0 - wrap))*mix(0.903, 0.55 + 0.45*yRound, wY)*(1.0 - 0.35*leafy*(1.0 - stem));
  vec3 col = alb*0.72*(cmSunL*cmLitL(ndl)*0.75 + cmAmb(n)*0.6 + bounce)*ao;
  // sap: it glistens where it has run down the grooves
  vec3 h = uSunDir + v; h /= max(length(h), 1e-3);
  // (under the footprint the glint goes to its mean over the strands' own turn: a fifth of it, as broad as they turn)
  float wet = smoothstep(0.45, 0.8, cmN3(q3*vec3(0.07, 0.12, 0.12) + 11.0))*(0.3 + 0.7*mix(0.215, groove, lod));
  col += cmSunL*mix(0.2*pow(clamp(dot(normalize(vN), h), 0.0, 1.0), 5.0), pow(clamp(dot(n, h), 0.0, 1.0), 70.0), lod)*wet*0.35;
  // seed-hair stands off the fibre and catches the low sun: along the edge, and all over a rope that lies toward
  // the sun from us (a far web is fine bright lines there)
  float toward = clamp(dot(-v, uSunDir), 0.0, 1.0);
  // (mend T, T3: THE RIM IS LIGHT CAUGHT IN THE SEED-HAIR, THIN, BROKEN, UNEVEN, and by the sun's direction:
  // where the rope stands toward the sun from the eye, and a tenth of that on its sun side elsewhere; in
  // lengths of a metre or two (the hair's own pattern, at its mean under the footprint); never an even
  // pale edge down both sides of a rope, which it was (half of it at every bearing))
  float hairB = 2.0*mix(0.45, smoothstep(0.3, 0.75, cmN3(q3*vec3(0.35, 1.1, 1.1) + 23.0)), lod);
  float rim = pow(clamp(1.0 - dot(n, v), 0.0, 1.0), 3.0)*(0.1*clamp(ndl + 0.5, 0.0, 1.0) + 0.8*toward*toward)*hairB;
  col += cmSunL*vec3(0.75, 0.8, 0.55)*(rim*(0.16 + 0.04*wrap) + 0.022*pow(toward, 6.0) + thread*0.08*toward*toward);
  col = cmDeepL(col, 0.8 + 0.25*ao);              // (mend T, T3: never a flat black bar; the common part)
  col = cmAir(col, vW);
  gl_FragColor = vec4(col, 1.0);
}`;function me(l,n,t,h,b=!1,o=0,r=0){const u=n.length,H=l.count,M=w(0,0,0),A=w(0,1,0),O=w(0,0,0),D=w(0,0,0),x=w(0,0,0);for(let T=0;T<u;T++){const L=n[b?(T-1+u)%u:Math.max(0,T-1)].p,m=n[b?(T+1)%u:Math.min(u-1,T+1)].p;M.subVectors(m,L).normalize(),T===0&&(x.copy(Math.abs(M.y)>.9?w(1,0,0):A),n[0].ref&&x.copy(n[0].ref)),O.crossVectors(M,x).normalize(),D.crossVectors(O,M).normalize(),x.copy(D);const e=n[T];for(let d=0;d<=t;d++){const f=d/t*V-o*e.l,i=Math.cos(f),c=Math.sin(f);l.set("aK",e.follow??0,e.r,e.sway??0,e.s??-1),l.set("aT",e.l,f,h),l.set("aAx",M.x,M.y,M.z),l.set("aD",e.nodip??0,r),l.v(e.p.x,e.p.y,e.p.z,O.x*i+D.x*c,O.y*i+D.y*c,O.z*i+D.z*c)}}if(l.stitch(H,u,t),b){const T=H+(u-1)*(t+1);for(let L=0;L<t;L++){const m=T+L,e=H+L;l.i.push(m,e,m+1,m+1,e,e+1)}}}function ye(l,n,t){let h=1;for(const b of n){let o=t-b.ang;o-=V*Math.round(o/V),h+=b.pull*Math.exp(-o*o/.05)}return l*h}const we=(l,n,t,h=w(0,0,0))=>{const b=l.hub,o=ye(b.R,n,t);return h.copy(b.H).addScaledVector(l.X,Math.cos(t)*o).addScaledVector(l.n,Math.sin(t)*o)};function Le(l,n,t,h,b){const o={list:[],made:0,cut:0,least:1/0};for(let r=0;r<7;r++){const u=(r+h.range(-.3,.3))/7*V,H=h.range(5,19),M=h.range(34,66),A=h.range(.85,1.15),O=h.range(-.7,.7),D=h.range(0,V),x=w(Math.cos(u),0,Math.sin(u)),T=x.clone().addScaledVector(l.d,-x.dot(l.d)).normalize(),L=l.radius(H),m=l.fall(H),e=[];e.push({p:l.at(H+9,0,0).addScaledVector(T,L*.4),r:1.3*A,follow:m,s:H+9,l:0}),e.push({p:l.at(H+3,0,0).addScaledVector(T,L*.8),r:2.3*A,follow:m,s:H+3,l:6}),e.push({p:l.at(H-3,0,0).addScaledVector(T,L),r:2.8*A,follow:m,s:H-3,l:12});let d=12,f=e[2].p;for(let v=0;v<=12;v++){const a=v/12,N=9+a*M,R=u+O*a*a+.14*Math.sin(a*7+D),p=n.x+Math.cos(R)*N,C=n.z+Math.sin(R)*N,k=(3*(1-.82*a)*(1+.14*Math.sin(a*13+r*2))+.3)*A,W=ke(n,p,C)+k*.3-3*a*a,q=t?t.distanceTo(p,W,C)-k:1/0;if(q<b){o.cut++;break}o.least=Math.min(o.least,q);const s=w(p,W,C);d+=s.distanceTo(f),f=s,e.push({p:s,r:k,follow:1,s:0,l:d,nodip:Math.min(1,(v+1)/3)})}const i=e[e.length-1],c=i.p.clone().sub(e[e.length-2].p).normalize().multiplyScalar(3);c.y=-(i.r+5),e.push({p:i.p.clone().add(c),r:i.r*.8,follow:i.follow,s:i.s,l:d+6,nodip:i.nodip??0}),o.list.push(e),o.made++}return o}const ve=[7,19,.25];function Ee(l,n,t){const h=l.hub,b=[{ang:Math.atan2(-h.m,-h.x),pull:.09}],o=[];for(let r=1;r<n.length;r++){const u=n[r],H=w(u.x,u.h,u.z),M=w(0,0,0).subVectors(H,h.H),A={T:H,ang:Math.atan2(M.dot(l.n),M.dot(l.X)),thick:(u.thick??7)*t.range(.55,1.35),slack:t.range(.035,.085),amp:t.range(2,5),phase:t(),pull:t.range(.03,.11)};o.push(A),b.push({ang:A.ang,pull:A.pull})}for(const r of o)r.E=we(l,b,r.ang),r.len=r.T.distanceTo(r.E),r.sag=r.len*r.slack;return{ties:b,others:o}}const Be=(l,n,t=w(0,0,0))=>(t.lerpVectors(l.T,l.E,n),t.y-=l.sag*4*n*(1-n),t);function qe(l,n,t){const h=new be({aK:4,aT:3,aAx:3,aD:2}),b=he(n,t.rng,"cables",l,!!t.quiet),o=n.cable,r=o.hub,{ties:u,others:H}=Ee(o,t.peaks,b);{const e=[];for(const d of o.stations)e.push({p:o.course(d),r:o.girth(d),follow:o.fall(d),sway:0,s:Math.max(d,0),l:d});e[0].ref=o.n,me(h,e,56,0,!1,V/(ve[0]*ve[1]),.2)}const M=t.quiet?{list:[],made:0,cut:0,least:1/0}:Le(o,t.peaks[0],t.path,he(n,t.rootRng,"collar",l),t.keep??22),A=e=>{const d=[],f=e.length,i=c=>e[xe(c,0,f-1)];for(let c=0;c<f-1;c++)for(let v=0;v<3;v++){const a=v/3,N=i(c-1),R=i(c),p=i(c+1),C=i(c+2),k=a*a,W=k*a,q=-.5*W+k-.5*a,s=1.5*W-2.5*k+1,g=-1.5*W+2*k+.5*a,E=.5*W-.5*k,G=w(0,0,0).addScaledVector(N.p,q).addScaledVector(R.p,s).addScaledVector(p.p,g).addScaledVector(C.p,E);d.push({p:G,r:ee(R.r,p.r,a),follow:ee(R.follow,p.follow,a),s:ee(R.s,p.s,a),l:ee(R.l,p.l,a),nodip:ee(R.nodip??0,p.nodip??0,a)})}return d.push(e[f-1]),d};if(M.list.forEach((e,d)=>me(h,A(e),14,.1*d)),t.strandS!==void 0)for(let e=0;e<3;e++){const d=t.strandS+(e-1)*.9,f=o.radius(d)+.3,i=[];for(let c=0;c<20;c++){const v=c/20*V;i.push({p:o.at(d+.3*Math.sin(v*2+e),Math.cos(v)*f,Math.sin(v)*f),r:.45,follow:o.fall(d),sway:0,s:d,l:c*2.2})}me(h,i,6,.3+e*.2,!0)}const O=[],D=w(0,1,0);for(const e of H){const d=e.T,f=we(o,u,e.ang),i=d.distanceTo(f),c=72,v=[],a=e.thick/2,N=i*e.slack,R=s=>Math.sin(Math.PI*s)*(1-fe(.7,.85,s)),p=w(0,0,0).subVectors(f,d).cross(D).normalize(),C=s=>1-fe(0,.6,s),k=s=>ee(a,a*.55,s)*(1+.5*fe(.985,1,s))*(1+1.6*Math.pow(1-fe(0,40,s*i),2));for(let s=0;s<=c;s++){const g=s/c,E=w(0,0,0).lerpVectors(d,f,g);E.y-=N*4*g*(1-g),v.push({p:E,r:k(g),follow:C(g),sway:e.amp*R(g),s:-1,l:g*i})}const W=h.count;me(h,v,8,e.phase);const q=(s,g,E)=>(E.lerpVectors(d,f,s),E.y-=N*4*s*(1-s),E.y-=n.drop(E.x,E.z)*C(s),E.addScaledVector(p,e.amp*R(s)*Math.sin(g*.31+e.phase*V)*(.6+.4*Math.sin(g*.13+e.phase*40))));O.push({T:d,E:f,len:i,r0:a,sag:N,at:q,fall:C,radius:k,k:e,mesh:{v0:W,rings:c+1,ring:9}})}const x=ge(h.geometry(),0,200,-1e3,4200),T={uCN:{value:o.n.clone()},uGr:{value:t.grips},uRopeA:{value:ie(ze)},uRopeB:{value:ie("#6E7660")},uRopeMoss:{value:ie("#566644")},uLay:{value:new z.Vector3(ve[0],ve[1],ve[2])},uLow:{value:new z.Vector2(150,110)}},L=new z.ShaderMaterial({uniforms:pe(n.U,T),vertexShader:He,fragmentShader:Ae,fog:!1}),m=new z.Mesh(x,L);return m.name="cables",m.frustumCulled=!1,{object:m,material:L,ends:O,ties:u,roots:M,triangles:h.triangles}}const Ve=`
varying vec2 vP; varying vec3 vW;
void main(){ vP = position.xy; vec4 w = modelMatrix*vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,Oe=`
uniform vec3 uNetCol, uSap, uWX, uWN; uniform vec4 uOrb, uTear;     // inner radius, ring radius, spokes, turns; tear: angle, half width, from radius, seed
uniform vec2 uTies[10];
varying vec2 vP; varying vec3 vW;
${de}
float cover(float d, float w, float px){ return clamp((min(d + 0.5*px, 0.5*w) - max(d - 0.5*px, -0.5*w))/px, 0.0, 1.0); }
float wrapA(float d){ return d - 6.2831853*floor(d/6.2831853 + 0.5); }
float jitOf(float i){ return (cmH(vec2(mod(i + uOrb.z, uOrb.z), 3.1 + uTear.w)) - 0.5)*0.34; }
float ringR(float a){ float k = 1.0; for (int i = 0; i < 10; i++) { float d = wrapA(a - uTies[i].x); k += uTies[i].y*exp(-d*d/0.05); } return uOrb.y*k; }
void main(){
  float px = max(length(dFdx(vP)), length(dFdy(vP))) + 1e-5;
  // the whole web trembles
  vec2 p = vP + 0.10*vec2(sin(uTime*2.3 + vP.y*0.31), sin(uTime*1.9 + vP.x*0.27))*smoothstep(uOrb.x - 2.0, uOrb.x + 6.0, length(vP));
  float r = max(length(p), 1e-3), a = atan(p.y, p.x);
  float inner = uOrb.x, NS = uOrb.z, turns = uOrb.w, rim = ringR(a) - 1.2;
  float r0 = inner + 1.6, r1 = uOrb.y - 2.4, pitch = (r1 - r0)/turns;
  // ---- spokes, each a little out of true; in the torn sector some have parted and hang short.
  // The span we are in lies between the spoke below (sLo) and the spoke above (sHi), in spokes round the web.
  float sa = a/6.2831853*NS, i0 = floor(sa), sLo = i0 + jitOf(i0), sHi = i0 + 1.0 + jitOf(i0 + 1.0);
  if (sa < sLo) { sHi = sLo; i0 -= 1.0; sLo = i0 + jitOf(i0); } else if (sa > sHi) { sLo = sHi; i0 += 1.0; sHi = i0 + 1.0 + jitOf(i0 + 1.0); }
  float sec = mod(i0 + NS, NS), fs = clamp((sa - sLo)/max(sHi - sLo, 1e-3), 0.0, 1.0);
  float nearHi = step(sHi - sa, sa - sLo), sAt = mix(sLo, sHi, nearHi), si = i0 + nearHi, sid = mod(si + NS, NS);
  float ds = abs(sa - sAt)*6.2831853*r/NS;
  float sAng = sAt/NS*6.2831853, luck = cmH(vec2(sid, 9.7 + uTear.w));
  float parted = step(abs(wrapA(sAng - uTear.x)), uTear.y)*step(0.4, luck);
  float sEnd = mix(rim + 1.4, inner + (rim - inner)*(0.2 + 0.5*cmH(vec2(sid, 4.4))), parted);
  float spoke = cover(ds, 0.06, px)*step(inner, r)*step(r, sEnd);
  // ---- the one spiral
  float t0 = (r - r0)/pitch - a/6.2831853, k0 = floor(t0 + 0.5);
  float slack = pitch*(0.10 + 0.45*cmH(vec2(k0, sec) + uTear.w));
  float hang = slack*sin(3.14159*fs)*(-p.y/r);                       // the span sags downward
  float rs = (r - hang - r0)/pitch - a/6.2831853, ri = floor(rs + 0.5);
  float dr = abs(rs - ri)*pitch;
  float turn = ri + a/6.2831853;                                      // how many turns out along the thread this is
  float gone = step(cmH(vec2(ri, sec) + 3.3 + uTear.w), 0.08);
  float tornK = step(abs(wrapA(a - uTear.x)) + 0.10*cmH(vec2(ri, 7.0)), uTear.y)*step(uTear.z + 1.5*cmH(vec2(sec, 2.0)), r);
  float inSp = step(-0.5, turn)*step(turn, turns - 0.5)*step(r0 - 0.5, r)*(1.0 - gone)*(1.0 - tornK);
  float spiral = cover(dr, 0.045, px)*inSp;
  // the rim of the opening: a doubled thread
  float hole = max(cover(abs(r - inner), 0.09, px), 0.6*cover(abs(r - inner - 0.5), 0.05, px));
  // beads of sap on the spiral: they catch the sun in turn
  vec2 bc = vec2(ri, floor(fs*3.0) + sec*3.0); float bid = cmH(bc + 17.0);
  float bfs = (floor(fs*3.0) + 0.5)/3.0, ba = mix(sLo, sHi, bfs)/NS*6.2831853;
  float brr = r0 + (ri + ba/6.2831853)*pitch + slack*sin(3.14159*bfs)*(-sin(ba));
  vec2 bp = vec2(cos(ba), sin(ba))*brr;
  float bd = length(p - bp), bsz = 0.15*(0.6 + 0.8*fract(bid*7.7));
  float bead = (1.0 - smoothstep(max(bsz - px, 0.0), bsz + px, bd))*step(0.62, bid)*inSp*min(1.0, bsz*2.0/px);
  float flash = pow(clamp(0.5 + 0.5*sin(uTime*(1.1 + 2.0*fract(bid*3.3)) + bid*50.0), 0.0, 1.0), 10.0);
  // caught fluff: a few soft pale tufts
  vec2 fc = floor(p/3.1); float fid = cmH(fc + 5.0); vec2 fo = (fc + 0.3 + 0.4*cmH2(fc))*3.1;
  float fluff = (1.0 - smoothstep(0.0, 0.5, length(p - fo)))*step(0.86, fid)*step(inner + 0.5, r)*step(r, r1)*(1.0 - tornK);
  // ---- light: dull thread, and a glint where a thread lies square to the half-way direction
  vec3 v = normalize(cameraPosition - vW);
  vec3 hv = uSunDir + v; hv /= max(length(hv), 1e-3);
  vec2 hp = vec2(dot(hv, uWX), dot(hv, uWN)), rh = p/r;
  float gs = dot(rh, hp), gt = dot(vec2(-rh.y, rh.x), hp);
  float sparkle = 0.55 + 0.45*sin(r*2.3 - uTime*1.3 + si*2.1 + uTear.w);
  float toward = clamp(dot(-v, uSunDir)*0.5 + 0.5, 0.0, 1.0);
  vec3 sunL = uSunCol*0.3, dull = (cmAmb(vec3(0.0, -0.4, 0.0)) + vec3(0.10, 0.12, 0.06))*0.55;
  vec3 col = uNetCol*(spoke*(dull + sunL*1.5*exp(-gs*gs*30.0)*sparkle) + spiral*(dull*0.8 + sunL*1.3*exp(-gt*gt*30.0)*sparkle) + hole*(dull + sunL*0.5*toward));
  col += uSap*sunL*bead*(0.15 + 2.4*flash*(0.3 + 0.7*toward));
  col += vec3(0.8, 0.82, 0.66)*(dull + sunL*0.4*toward)*fluff*0.6;
  float al = clamp((spoke + spiral + hole)*0.9 + bead + fluff*0.6, 0.0, 1.0);
  float x = uFog.x*length(cameraPosition - vW)*0.4, f = 1.0 - exp(-x*x);
  col = mix(col, uFogCol*al, f);
  gl_FragColor = vec4(col, al);
}`;function Ke(l,n,t={}){const h=new z.Group;h.name="hub";const b=n.cable,o=n.hub,r=he(n,t.rng,"ring",l),u=t.ties||[{ang:Math.atan2(-o.m,-o.x),pull:.09}],H=new be({aK:4,aT:3,aAx:3,aD:2}),M=180,A=r.range(0,V),O=r.range(0,V),D=r.range(0,V),x=a=>{let N=0;for(const R of u){let p=a-R.ang;p-=V*Math.round(p/V),N+=Math.exp(-p*p/.012)}return Math.min(N,1)};for(let a=0;a<3;a++){const N=[];for(let R=0;R<M;R++){const p=R/M*V,C=p*9+a*V/3,k=x(p),W=.7*Math.sin(p*5+A)+.45*Math.sin(p*11+O),q=ye(o.R,u,p)+W+Math.cos(C)*1.25*(1-.5*k),s=Math.sin(C)*1.25*(1-.5*k)+.5*Math.sin(p*7+D),g=w(0,0,0).copy(o.H).addScaledVector(b.X,Math.cos(p)*q).addScaledVector(b.n,Math.sin(p)*q).addScaledVector(b.d,s);N.push({p:g,r:1.45*(1+.5*k)*(1+.16*Math.sin(p*13+A+a)),follow:0,sway:0,s:-1,l:p*o.R})}me(H,N,9,a*.33,!0)}for(const a of u){const N=we(b,u,a.ang),R=w(0,0,0).subVectors(N,o.H).normalize(),p=w(0,0,0).crossVectors(b.d,R).normalize(),C=2+Math.floor(r()*3);for(let k=0;k<C;k++){const W=(k-(C-1)/2)*1.5+r.range(-.3,.3),q=r.range(-.35,.35),s=r.range(3.1,3.9),g=[];for(let E=0;E<16;E++){const G=E/16*V;g.push({p:w(0,0,0).copy(N).addScaledVector(p,W+q*s*Math.cos(G)).addScaledVector(R,Math.cos(G)*s).addScaledVector(b.d,Math.sin(G)*s),r:r.range(.7,1),follow:0,sway:0,s:-1,l:E*1.3})}me(H,g,6,r(),!0)}}const T=ge(H.geometry(),o.H.x,o.H.y,o.H.z,o.R+10),L={uCN:{value:b.n.clone()},uGr:{value:t.grips},uRopeA:{value:ie("#7F8C6C")},uRopeB:{value:ie("#B4BA9E")},uRopeMoss:{value:ie("#5C6C48")},uLay:{value:new z.Vector3(3,9,.9)},uLow:{value:new z.Vector2(0,0)}},m=new z.Mesh(T,new z.ShaderMaterial({uniforms:pe(n.U,L),vertexShader:He,fragmentShader:Ae,fog:!1}));m.name="hub-ring",h.add(m);const e=t.inner??8,d=new z.RingGeometry(e-.6,o.R*1.16,64,1),f=[];for(let a=0;a<10;a++)f.push(new z.Vector2(u[a]?.ang??0,u[a]?.pull??0));const i=new z.Vector4(r.range(0,V),r.range(.28,.45),e+(o.R-e)*r.range(.2,.5),r.range(0,50)),c={uNetCol:{value:ie("#C6DCBA")},uSap:{value:ie("#F0C870")},uOrb:{value:new z.Vector4(e,o.R,t.spokes??32,t.turns??14)},uTear:{value:i},uTies:{value:f},uWX:{value:b.X.clone()},uWN:{value:b.n.clone()}},v=new z.Mesh(d,new z.ShaderMaterial({uniforms:pe(n.U,c),vertexShader:Ve,fragmentShader:Oe,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:z.DoubleSide,fog:!1}));return v.matrixAutoUpdate=!1,b.matrix(o.s,v.matrix),v.matrix.setPosition(o.H),v.name="orb-web",v.renderOrder=2,h.add(v),{object:h,ring:m,orb:v,tear:i,triangles:H.triangles+128}}const De=`
attribute vec3 aTan, aO; attribute vec4 aR, aF; attribute float aM;
uniform vec4 uBox;                       // loose web drifts across a box: centre x, width, wind m/s, -
varying vec4 vR; varying vec3 vW; varying vec3 vA; varying float vFol, vSun;
${de}
${Re}
void main(){
  vec3 o = aO; float al = 1.0; vFol = aF.x;
  if (aF.z > 0.5) {
    // (mend T, T4: ABOVE THE AIR NOTHING DRIFTS ON A WIND. A loose thread is carried by the wind as far as the
    // air at its own height carries anything (the air's one thinning at its own level, cmThin): whole at
    // the leaves, a twentieth of it at the height of the ring's rim and above, where it hangs and turns.)
    float W = uBox.y, x = mod(aO.x - uBox.x + uTime*uBox.z*(0.6 + 0.8*aR.w)*mix(1.0, 0.05, cmThin(aO.y)) + 0.5*W, W) - 0.5*W;
    al = smoothstep(0.5*W, 0.38*W, abs(x)); o.x = uBox.x + x;
    o.y += 4.0*sin(uTime*0.11 + aR.w*30.0);
  }
  vec3 c = o + position;
  c.y -= cmDrop(c.xz)*aF.x;
  vec3 wv = cross(aTan, vec3(0.0, 1.0, 0.0)); wv /= max(length(wv), 1e-4);
  float env = sin(3.14159*clamp(aR.z, 0.0, 1.0));
  c += (wv*sin(uTime*0.6 + aR.z*7.0 + aR.w*40.0) + vec3(0.0, 0.35, 0.0)*sin(uTime*0.43 + aR.z*5.0 + aR.w*19.0))*aF.y*mix(env, 1.0, aF.z);
  float k, hw = aR.y;
  // (mend T, T2) THE HAIR RUNS ON TO THE MOON, 400 km of it: a point of it farther than 8.6 km from the eye is
  // drawn on its own ray at 8.6 km, its width in the same measure, so the picture is the true one and it lies
  // inside the far plane (as the sun, the Moon and the air on the world's edge are drawn at the far plane)
  if (aF.w > 1.5) { vec3 rel = c - cameraPosition; float pull = min(1.0, 8600.0/max(length(rel), 1.0)); c = cameraPosition + rel*pull; hw *= pull; }
  vec4 mv = cmRibbon(c, aTan, aR.x, hw, k);
  // which way across the ribbon the sun stands (the ribbon's own side, in the world)
  vec3 sdW = cross(aTan, c - cameraPosition); vSun = dot(sdW/max(length(sdW), 1e-5), uSunDir);
  vW = c; vR = vec4(aR.x, aR.z, aR.w, aF.w); vA = vec3(k, al, aM);
  gl_Position = projectionMatrix*mv;
}`,Ce=`
#define CM_FOLLOW vFol
uniform vec3 uNetCol; uniform float uHairLit;
varying vec4 vR; varying vec3 vW; varying vec3 vA; varying float vFol, vSun;
${de}
void main(){
  float s = abs(vR.x), fw = fwidth(vR.x) + 1e-4;
  float e = 1.0 - smoothstep(max(1.0 - fw*1.5, 0.0), 1.0, s);
  vec3 v = normalize(cameraPosition - vW);
  float toward = clamp(dot(-v, uSunDir)*0.5 + 0.5, 0.0, 1.0);
  // nothing here shines of itself: dull thread under the sky and over the bright forest; glints of sun slide
  // down it; beads of dew and sap sit on it every metre or two and flash in turn
  float g = pow(clamp(0.5 + 0.5*sin(vR.y*38.0 - uTime*1.6 + vR.z*50.0), 0.0, 1.0), 14.0);
  float m = vA.z/1.7 + vR.z*9.0, cell = floor(m), mw = fwidth(vA.z) + 1e-4;
  float bid = cmH(vec2(cell, vR.z*91.0));
  float bead = (1.0 - smoothstep(0.05, 0.09 + mw*0.3, abs(fract(m) - 0.5)))*step(0.45, bid)*(1.0 - smoothstep(0.2, 0.7, mw));
  float flash = pow(clamp(0.5 + 0.5*sin(uTime*(0.9 + 2.0*bid) + bid*40.0), 0.0, 1.0), 8.0);
  // (mend P, Q5: a GREAT DROP hangs every 11 m or so on one stretch in two. Mend R, V1: A DROP IS A BEAD, NEVER
  // A STREAK ALONG ITS STRAND: the great drop is a third of a metre long (it was a metre and more, and seen from
  // farther off than the small beads: near the eye it was a white-hot run on the thread) and it goes to nothing
  // under the pixel's footprint exactly as the small beads do: a few pixels across near to, nothing far off)
  float m2 = vA.z/11.0 + vR.z*5.0, mw2 = mw*(1.7/11.0), bid2 = cmH(vec2(floor(m2), vR.z*57.0));
  float drop = (1.0 - smoothstep(0.011, 0.016 + mw2*0.3, abs(fract(m2) - 0.5)))*step(0.5, bid2)*(1.0 - smoothstep(0.2, 0.7, mw));
  if (drop > bead) { bead = drop; flash = pow(clamp(0.5 + 0.5*sin(uTime*(0.9 + 2.0*bid2) + bid2*40.0), 0.0, 1.0), 8.0); }
  // (mend R, V1) A THREAD IS NEVER BRIGHTER THAN THE LIT ROPE BESIDE IT, AT ANY HEIGHT, AND IT IS NEVER WHITE: the
  // thread's one law of light (the common part: cmThreadDull, cmThreadSun, cmThreadCap). What it catches of the
  // sun it gives back in its own pale green-silver (the glints and the beads the same), as bright at one end
  // of it as along it; high up it is seen by the sky's light and the roof's alone.
  float hT = vW.y + vFol*cmDrop(vW.xz), sunY = cmThreadSun(hT);
  vec3 col = cmThreadCap(uNetCol*(vR.w*(cmThreadDull(hT) + sunY*(0.3*toward*toward + 2.2*g*(0.3 + 0.7*toward))) + sunY*bead*(0.4 + 2.4*flash)*(0.4 + 0.6*toward)), hT);
  // (mend S, the guard's G4) THE HAIR FROM THE RING TO THE MOON IS A ROPE OF FORTY STRANDS, AND THE SUN IS ON IT
  // as it is on the cable beside us: it has the lit rope's own brightness at its height (the cap of V1's law
  // itself: as bright as the lit rope and never brighter) in the thread's pale green-silver. By V1's law for
  // a single strand it caught nothing of the sun above the ring's rim and could not be seen; so the title's
  // cable is seen to go on to the Moon, one fine pale line.
  // (mend T, T2: it takes the sun on the same side as everything else: the side of it turned from the sun has
  // 0.6 of the lit side's light; where it is under two pixels across that is one even tone)
  if (vR.w > 1.5) col = cmThreadCap(uNetCol*8.0, hT)*mix(0.6, 1.0, clamp(0.5 + 0.9*vR.x*vSun, 0.0, 1.0));
  float kpx = clamp(vA.x, 0.0, 1.0);                     // the strand's share of a pixel's width (cmRibbon)
  // (mend P, Q5: THE THREAD fades by the power 1.5 of that share (was the share itself), so a strand too thin
  // to see goes into nothing sooner instead of scratching the sky; A BEAD is a drop broader than its thread and
  // fades by the share itself, so the beads still catch the sun in turn along a strand too fine to see)
  // (mend T, T2: THE HAIR IS A CABLE ARRIVING. It is one breadth from end to end (0.9 m: forty strands), so it
  // is broader toward the ring only as distance makes it so; it is drawn by its true share of a pixel and
  // never fainter than a hair: 0.55 of a line 1.6 pixels wide where it leaves the gathered strands, down to
  // 0.3 where it meets the Moon's limb (vR.y: 0 at the gather, 1 at the limb). No beads on it. It ENDS at
  // the limb, at a KNOT: the threads of the net that meet it there (vR.w 3) are as faint, broader at the
  // knot, and go to nothing along their own length. uHairLit: how lit the limb is that it reaches; toward an
  // unlit limb the hair goes into the dark over its last fifth and the knot is not seen. (Mend U: THAT ARM
  // DOES NOT ACT ON THE DEALT RANGES: uHairLit is 1 on every deal, the limb turned to the ring being the
  // sun's. It is left in.)
  float hairAl = vR.w > 2.5 ? max(kpx, 0.3)*(1.0 - smoothstep(0.45, 1.0, vR.y))*uHairLit
    : max(kpx, mix(0.55, 0.3, smoothstep(0.0, 1.0, vR.y)))*mix(1.0 - smoothstep(0.8, 0.95, vR.y), 1.0, uHairLit);
  float al = e*vA.y*clamp(vR.w > 1.5 ? hairAl : kpx*sqrt(kpx)*(0.55*vR.w + 0.3) + kpx*bead, 0.0, 1.0);
  // (round Q: A THREAD GOES OUT WITHIN 12 M OF THE EYE'S PLACE, the one opacity by the eye's nearness that the
  // rules allow, declared in the world file's list. The climb now runs beside the cable, through the air where
  // loose threads drift: one adrift a metre from the eye was a broad pale bar across the whole picture.)
  al *= smoothstep(3.0, 12.0, length(cameraPosition - vW));
  // (mend T, T2: the hair runs far above the air: it stands in the air that lies along the ray to it, by the
  // air's one law (cmHaze), never in the eye's own air for the whole of its length: that drew its far part in
  // the horizon's colour, a dark line on the night sky)
  if (vR.w > 1.5) col = cmHaze(col, vW, 1.0);
  else { float x = uFog.x*length(cameraPosition - vW)*0.5; col = mix(col, uFogCol, 1.0 - exp(-x*x)); }
  gl_FragColor = vec4(col*al, al);
}`;function Te(){return new be({aTan:3,aO:3,aR:4,aF:4,aM:1})}function le(l,n,t,h,b,o,r,u,H){const M=n.length,A=l.count,O=w(0,0,0);let D=0;for(let x=0;x<M;x++){x&&(D+=n[x].distanceTo(n[x-1])),O.subVectors(n[Math.min(M-1,x+1)],n[Math.max(0,x-1)]).normalize();const T=x/(M-1),L=typeof o=="function"?o(T):o,m=typeof h=="function"?h(T):h;for(const e of[-1,1])l.set("aTan",O.x,O.y,O.z),l.set("aO",t.x,t.y,t.z),l.set("aR",e,m,T,b),l.set("aF",L,r,u,H),l.set("aM",D),l.v(n[x].x,n[x].y,n[x].z)}for(let x=0;x<M-1;x++){const T=A+x*2;l.i.push(T,T+1,T+2,T+1,T+3,T+2)}}function _e(l,n,t){const h=t.forks||{},b=m=>he(n,h[m],m,l),o=new z.Group;o.name="strands";const r=n.cable,u=n.hub,H=(m,e,d,f,i,c,v)=>{const a=new z.Mesh(ge(m.geometry(),f,i,c,v),new z.ShaderMaterial({uniforms:pe(n.U,d),vertexShader:De,fragmentShader:Ce,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:z.DoubleSide,fog:!1}));return a.name=e,a.renderOrder=1,a.frustumCulled=!1,o.add(a),a},M={value:ie("#C6DCBA")},A=w(0,0,0),O={value:new z.Vector4(0,1,0,0)},D={value:1};let x=0;const T=[],L={lengthKm:400,breadthM:.9,sagDeg:.6,knotThreads:0,limbLit:1};{const m=Te(),e=b("guys"),d=t.peaks[0],f=t.guys??12;let i=0;for(let c=0;i<f&&c<f*12;c++){const v=e.range(8,70),a=e.range(0,V),N=e.range(70,165),R=e.range(.1,.17),p=e(),C=e.range(1.8,3.2),k=w(Math.cos(a),0,Math.sin(a)),W=r.at(v,0,0).addScaledVector(k,r.radius(v)*.8),q=d.x+Math.cos(a)*N,s=d.z+Math.sin(a)*N,g=w(q,t.peakHeight(q,s)-.5,s),E=W.distanceTo(g),G=r.fall(v),_=[];for(let I=0;I<=16;I++){const ae=I/16,Q=w(0,0,0).lerpVectors(W,g,ae);Q.y-=R*E*Math.sin(Math.PI*ae),_.push(Q)}if(t.path&&_.some(I=>t.path.distanceTo(I.x,I.y,I.z)<14))continue;const Y=I=>ee(G,1,I);le(m,_,A,I=>ee(.14,.07,I),p,Y,.4,0,.6);const te=w(0,0,0).crossVectors(k,w(0,1,0));for(const I of[-1,1])le(m,[r.at(v+I*C,0,0).addScaledVector(k,r.radius(v)*.8),_[1].clone().lerp(_[2],.5),_[2]],A,.07,p,ae=>ee(G,Y(2/16),ae),.2,0,.5),le(m,[_[14],_[15].clone().addScaledVector(te,I*C*.6),g.clone().addScaledVector(te,I*C*1.6)],A,.05,p,1,.2,0,.5);i++}x+=m.triangles,H(m,"guys",{uNetCol:M,uBox:O,uHairLit:D},d.x,50,d.z,900)}{const m=Te(),e=b("strands"),d=t.beyond??40,f=(t.moonDir||r.d).clone().normalize(),i=520,c=4e5,v=t.ties||[],a=(t.moonRadius??0)*Math.PI/180,N=r.d.clone().addScaledVector(f,-r.d.dot(f));N.lengthSq()<1e-6&&N.set(0,-1,0).addScaledVector(f,f.y),N.normalize();const R=f.clone().multiplyScalar(Math.cos(a)).addScaledVector(N,Math.sin(a)).normalize();{const s=n.sunDir.clone().addScaledVector(f,-n.sunDir.dot(f)),g=t.moonPhase??.55;s.lengthSq()>1e-8&&s.normalize(),D.value=fe(-.08,.3,Math.sqrt(Math.max(1-g*g,0))*N.dot(s))}const p=(s,g)=>g.copy(u.H).addScaledVector(R,1.5+s);for(let s=0;s<d;s++){const g=s/d*V+e.range(-.06,.06),E=e.range(1.5,3.2)*e.sign(),G=e.range(.004,.02),_=e.range(.07,.2),Y=e.range(.5,1),te=e(),I=[],ae=ye(u.R,v,g);for(let Q=0;Q<=30;Q++){const J=Q/30,y=ae*Math.pow(1-J,2.2)*(1+.12*Math.sin(J*9+s))+.2*J,F=g+E*J,S=p(J*i,w(0,0,0)).addScaledVector(r.X,Math.cos(F)*y).addScaledVector(r.n,Math.sin(F)*y);S.y-=G*i*Math.sin(Math.PI*J),I.push(S)}le(m,I,A,Q=>ee(_,.16,Q),te,0,.5,0,Y)}const C=w(0,-1,0).addScaledVector(R,R.y).normalize(),k=.6*Math.PI/180,W=s=>{const g=(s-i)/(s-i+700);return p(s,w(0,0,0)).addScaledVector(C,s*k*4*g*(1-g))},q=[];for(let s=0;s<=40;s++)q.push(W(i*Math.pow(c/i,s/40)));if(le(m,q,A,.45,e(),0,0,0,2),a>0){const s=q[40],g=N.clone().multiplyScalar(-Math.cos(a)).addScaledVector(f,Math.sin(a)).normalize(),E=w(0,0,0).crossVectors(R,g).normalize(),G=Math.tan(a)*c,_=3+Math.floor(e()*3);L.knotThreads=_,L.limbLit=Math.round(D.value*1e3)/1e3;for(let Y=0;Y<_;Y++){const te=((Y+.5)/_*2-1)*1.15+e.range(-.18,.18),I=G*e.range(.07,.2),ae=e.range(-.35,.35)*I,Q=G*e.range(.007,.012),J=[],y=g.clone().multiplyScalar(Math.cos(te)).addScaledVector(E,Math.sin(te)),F=w(0,0,0).crossVectors(R,y).normalize();for(let S=0;S<=8;S++){const P=S/8;J.push(s.clone().addScaledVector(y,P*I).addScaledVector(F,ae*Math.sin(Math.PI*P*.5)*P))}le(m,J,A,S=>ee(Q,G*.002,Math.sqrt(S)),e(),0,0,0,3)}}{const s=he(n,h.far,"far-lines",l),g=t.farLines??0,E=(t.cableBearings||[]).slice(),G=Math.atan2(-r.d.z,-r.d.x),_=[],Y=[[t.moonDir,t.moonRadius],[n.sunDir,t.sunRadius]].filter(y=>y[0]&&y[1]).map(y=>[y[0].clone().normalize(),y[1]*Math.PI/180]);if(t.path)for(let y=0;y<=t.path.length;y+=6)_.push(t.path.posAtDist(y,w(0,0,0)));const te=(y,F,S,P)=>Math.acos(xe(y*P.x+F*P.y+S*P.z,-1,1)),I=(y,F,S,P,oe,ne,B)=>{let j=F*ne-S*oe,$=S*P-y*ne,X=y*oe-F*P;const se=Math.hypot(j,$,X);if(se<1e-9)return te(y,F,S,B);j/=se,$/=se,X/=se;const U=B.x*j+B.y*$+B.z*X,re=B.x-j*U,ce=B.y-$*U,ue=B.z-X*U,K=j*(F*ue-S*ce)+$*(S*re-y*ue)+X*(y*ce-F*re),Z=j*(ce*ne-ue*oe)+$*(ue*P-re*ne)+X*(re*oe-ce*P);return K>=0&&Z>=0?Math.abs(Math.asin(xe(U,-1,1))):Math.min(te(y,F,S,B),te(P,oe,ne,B))},ae=y=>{const F=Y.map(()=>9);for(const S of _){let P=0,oe=0,ne=0;for(let B=0;B<y.length;B++){let j=y[B].x-S.x,$=y[B].y-S.y,X=y[B].z-S.z;const se=Math.hypot(j,$,X)||1;if(j/=se,$/=se,X/=se,B>0){for(let U=0;U<Y.length;U++)if(F[U]=Math.min(F[U],I(P,oe,ne,j,$,X,Y[U][0])/Y[U][1]),F[U]<1.25)return null}P=j,oe=$,ne=X}}return F},Q=(y,F)=>{let S=y-F;return S-=V*Math.round(S/V),Math.abs(S)},J=y=>1-fe(0,.6,1-y);for(let y=0,F=0;y<g&&F<g*20;F++){const S=s.range(0,V),P=s.range(3200,6500),oe=s.range(.012,.03),ne=s();if(Q(S,G)<25*Math.PI/180||E.some(K=>Q(S,K)<9*Math.PI/180))continue;const B=w(u.H.x+Math.cos(S)*P,n.roof(u.H.x+Math.cos(S)*P,u.H.z+Math.sin(S)*P),u.H.z+Math.sin(S)*P),j=B.clone().sub(u.H),$=we(r,v,Math.atan2(j.dot(r.n),j.dot(r.X))),X=$.distanceTo(B),se=oe*X,U=(K,Z)=>(Z.lerpVectors($,B,K),Z.y-=se*4*K*(1-K),Z),re=[];for(let K=0;K<=24;K++)re.push(U(K/24,w(0,0,0)));if(t.path&&re.some((K,Z)=>Z>0&&t.path.distanceTo(K.x,K.y,K.z)<60))continue;const ce=ae(re);if(!ce)continue;le(m,re,A,.3,ne,J,0,0,2);const ue=(K,Z)=>(U(K,Z),Z.y-=n.drop(Z.x,Z.z)*J(K),Z);E.push(S),T.push({at:ue,fall:J,len:X,bearing:S,footKm:P/1e3,clear:ce}),y++}}x+=m.triangles,H(m,"strands-beyond",{uNetCol:M,uBox:O,uHairLit:D},u.H.x,u.H.y+500,u.H.z-1200,3600)}{const m=Te(),e=he(n,h.loose,"loose-web",l),d=t.loose??44,f=300;for(let i=0;i<d;i++){const c=e.range(90,720),v=r.at(c,e.range(-f/2,f/2),e.range(-120,50)),a=e.range(30,95),N=w(e.range(-1,1),e.range(-.9,.2),e.range(-.6,.6)).normalize(),R=w(e.range(-1,1),e.range(-1,.4),e.range(-1,1)).multiplyScalar(a*.22),p=[],C=e.range(.8,1.6);for(let k=0;k<=12;k++){const W=k/12;p.push(w(0,0,0).addScaledVector(N,(W-.5)*a).addScaledVector(R,Math.sin(W*Math.PI*C)))}le(m,p,v,k=>.045+.03*Math.sin(Math.PI*k),e(),0,1.6,1,e.range(.6,1.1))}x+=m.triangles,H(m,"loose-web",{uNetCol:M,uHairLit:D,uBox:{value:new z.Vector4(-20*r.mx,f,1.6,0)}},0,250,-750,700)}return{object:o,triangles:x,hair:L,farLines:T}}const Ie=`
attribute vec4 aH, aRt;
uniform vec3 uCP, uCD, uCN, uCX;
varying vec3 vW; varying vec4 vR; varying vec2 vA; varying float vFol;
${de}
${Me}
${Re}
void main(){
  float s = aH.x, q = position.x, t = clamp(s/${Ne.toFixed(1)}, 0.0, 1.0);
  float rad = s < 300.0 ? mix(7.0, 4.5, clamp(s/300.0, 0.0, 1.0)) : mix(4.5, 3.0, clamp((s - 300.0)/400.0, 0.0, 1.0));
  vec3 out_ = uCX*sin(aH.y) - uCN*cos(aH.y);
  vec3 root = uCP + uCD*s + uCN*cmCableDip(s) + out_*rad*0.92;
  root.y -= cmDrop(root.xz)*(1.0 - smoothstep(0.0, ${Se.toFixed(2)}, t));
  vFol = 1.0 - smoothstep(0.0, ${Se.toFixed(2)}, t);
  if (aRt.w > 0.5) { root = aRt.xyz; vFol = 0.0; }
  // it hangs straight down and streams a little with the air
  // (round Q: the climb looks along the cable, and its hair is in the wind that comes up it: a hair swings a
  // third of its length to either side, where it swung an eighth)
  vec3 hang = vec3(0.3*sin(uTime*0.7 + aH.w*30.0), -1.0, 0.22*sin(uTime*0.5 + aH.w*17.0) + 0.18);
  vec3 c = root + (hang*q + out_*0.25*q*(1.0 - q))*aH.z;
  float k; vec4 mv = cmRibbon(c, normalize(hang), position.z, (0.9 + aH.z*0.14)*(1.0 - 0.3*q), k);
  vW = c; vR = vec4(position.z, q, aH.w, 1.0); vA = vec2(k, 1.0);
  gl_Position = projectionMatrix*mv;
}`,Fe=`
#define CM_FOLLOW vFol
varying vec3 vW; varying vec4 vR; varying vec2 vA; varying float vFol;
${de}
void main(){
  float s = abs(vR.x), q = clamp(vR.y, 0.0, 1.0);
  // many hairs in one ribbon: streaks of floss with gaps, thinning to nothing at the tip
  float fine = cmN(vec2(vR.x*19.0 + vR.z*23.0, q*4.0));
  float cx = vR.x*4.5 + vR.z*50.0 + 0.22*sin(q*5.0 + vR.z*70.0), id = floor(cx), f = fract(cx);
  float own = 0.3 + 0.7*cmH(vec2(id, floor(vR.z*977.0)));                       // each hair ends where it ends
  float aa = fwidth(cx);
  float line = 1.0 - smoothstep(0.16, 0.3 + aa, abs(f - 0.5));
  line = mix(line, 0.45, smoothstep(0.35, 1.2, aa));                            // too far to tell hairs apart: floss
  float e = line*(1.0 - smoothstep(own*0.7, own, q));
  vec3 v = normalize(cameraPosition - vW);
  float toward = clamp(dot(-v, uSunDir)*0.5 + 0.5, 0.0, 1.0);
  // grey-green moss and old seed-hair: dark against the sky from below, bright only where the sun is behind it
  vec3 light = cmAmb(vec3(0.0, -0.3, 0.0))*0.55 + vec3(0.06, 0.08, 0.04) + cmSunL*(0.05 + 0.4*toward*toward*toward*toward);
  vec3 col = mix(vec3(0.09, 0.12, 0.06), vec3(0.2, 0.24, 0.15), q)*(0.6 + 0.4*fine)*light;
  float al = e*(1.0 - 0.6*q)*clamp(vA.x, 0.0, 1.0)*0.7;
  col = cmAir(col, vW);
  gl_FragColor = vec4(col*al, al);
}`;function Ge(l,n,t){const h=he(n,t.rng,"cable-hair",l),b=t.count??620,o=t.ends||[],r=44,u=b+o.length*r,H=4,M=n.cable,A=new z.InstancedBufferGeometry;A.instanceCount=u;const O=[],D=[];for(let i=0;i<=H;i++)for(const c of[-1,1])O.push(i/H,0,c);for(let i=0;i<H;i++){const c=i*2;D.push(c,c+1,c+2,c+1,c+3,c+2)}A.setAttribute("position",new z.Float32BufferAttribute(O,3)),A.setIndex(D);const x=new Float32Array(u*4),T=new Float32Array(u*4),L=new z.Vector3,m=h.range(0,V),e=h.range(0,V);for(let i=0;i<b;i++){const c=Math.pow(h(),.8)*(M.L-45);x.set([c,h.gauss()*.8,h.range(1.2,5)*(.35+1.5*fe(-.5,.6,Math.sin(c*.043+m)+.6*Math.sin(c*.117+e))),h()],i*4)}o.forEach((i,c)=>{for(let v=0;v<r;v++){const a=b+c*r+v,N=h.range(.85,.985),R=h.gauss()*.7,p=ee(i.r0,i.r0*.55,N)*.9;i.at(N,0,L),T.set([L.x+Math.sin(R)*p*M.mx,L.y-Math.cos(R)*p,L.z,1],a*4),x.set([0,R,h.range(1.2,5)*(h()<.12?2:1),h()],a*4)}}),A.setAttribute("aH",new z.InstancedBufferAttribute(x,4)),A.setAttribute("aRt",new z.InstancedBufferAttribute(T,4)),ge(A,0,240,-720,900);const d={uCP:{value:M.P.clone()},uCD:{value:M.d.clone()},uCN:{value:M.n.clone()},uCX:{value:M.X.clone()},uGr:{value:t.grips}},f=new z.Mesh(A,new z.ShaderMaterial({uniforms:pe(n.U,d),vertexShader:Ie,fragmentShader:Fe,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:z.DoubleSide,fog:!1}));return f.name="cable-hair",f.renderOrder=1,f.frustumCulled=!1,{object:f,triangles:u*H*2}}export{Be as cableStill,Ee as dealCables,Le as footRoots,Ge as makeCableHair,qe as makeCables,Ke as makeHub,_e as makeStrands,we as ringPoint,ye as ringRadius};
