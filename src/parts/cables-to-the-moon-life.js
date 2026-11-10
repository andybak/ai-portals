import*as R from"three";import{cmStream as ot,CM_GLSL as rt,CM_RIBBON as Ct,withShared as pt,Geo as dt,bound as ut,peakH as yt,ROOF_Y as It,C as ct,clamp as mt,lerp as gt}from"./cables-to-the-moon-common.js";const et=Math.PI*2,U=(_,u,s)=>new R.Vector3(_,u,s),nt={rounds:3,snap:2,shut:9,keep:12,dealOver:1.5},Bt=`const float CV_ROUNDS = ${nt.rounds.toFixed(1)}, CV_SNAP = ${nt.snap.toFixed(1)}, CV_SHUT = ${nt.shut.toFixed(1)};`,Kt=`
attribute vec4 aBase, aAn; attribute vec3 aCol; attribute vec2 aPh, aUv;
varying vec3 vW, vN, vC, vL; varying vec2 vK, vUv;
${rt}
vec3 rotX(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(p.x, p.y*c - p.z*s, p.y*s + p.z*c); }
void main(){
  vec3 p = position, n = normal; float kind = aAn.w, ph = aPh.x;
  if (kind > 0.5 && kind < 1.5) {                       // an arm goes up to point, and comes down again
    float lift = smoothstep(0.35, 0.8, sin(uTime*0.23 + ph*40.0))*2.3;
    p = aAn.xyz + rotX(p - aAn.xyz, -lift); n = rotX(n, -lift);
  }
  // the whole figure shifts its weight: a lean from the feet (an arm's pivot is its shoulder, 0.84 m up)
  float lean = 0.07*sin(uTime*0.6 + ph*17.0);
  if (kind > 2.5) p.x += lean*(p.y - aAn.y);
  else if (kind > 0.5 && kind < 1.5) p.x += lean*(0.84 + p.y - aAn.y);
  if (kind > 1.5 && kind < 2.5) {                       // a bladder fills as it drinks and sinks again
    float b = sin(uTime*1.1 + ph*6.2831853);
    p = aAn.xyz + (p - aAn.xyz)*vec3(1.0 + 0.16*b, 1.0 + 0.10*b*b, 1.0 + 0.16*b);
  }
  vec2 xz = aBase.xz + p.xz;
  float y = aBase.w*cmRoof(aBase.xz, uTime) + aBase.y + p.y - cmDrop(xz);
  vW = vec3(xz.x, y, xz.y); vN = n; vC = aCol; vL = position; vK = vec2(aPh.y, ph); vUv = aUv;
  gl_Position = projectionMatrix*viewMatrix*vec4(vW, 1.0);
}`,Rt=`
#define CM_FOLLOW 1.0
varying vec3 vW, vN, vC, vL; varying vec2 vK, vUv;
${rt}
void main(){
  vec3 v = normalize(cameraPosition - vW);
  vec3 n = normalize(vN); float surf = vK.x;
  float lod = 1.0 - smoothstep(0.07, 0.44, cmPx(vW));     // footprint fade of the bark's cracks and grain (taken before the branch below)
  float ndl = dot(n, uSunDir), toward = clamp(dot(-v, uSunDir), 0.0, 1.0);
  vec3 alb = vC, col;
  if (surf < 0.5) {
    // bark: fibres, cracks, moss on every upper side
    float len = vUv.x, th = vUv.y + vK.y*20.0;
    // long ridges of fibre down the length, fine grain, cracks across it, lichen, moss on every upper side
    float ridge = cmN(vec2(th*5.0 + 0.5*sin(len*0.3), len*0.16));
    float fine = cmN(vec2(th*17.0, len*1.1)), grain = cmN(vec2(th*46.0, len*3.5));
    // (the cracks and the grain go to their own means under the footprint: 0.86 of the light; half)
    float crack = mix(0.86, smoothstep(0.0, 0.18, abs(cmN(vec2(th*2.2, len*0.7 + 7.0)) - 0.5)*2.0), lod);
    float h = mix(0.5, 0.55*ridge + 0.3*fine + 0.15*grain, lod)*crack;
    alb *= 0.35 + 1.25*h;
    alb = mix(alb, vec3(0.42, 0.44, 0.30), smoothstep(0.62, 0.8, cmN(vec2(th*1.6 + 9.0, len*0.2)))*0.45);
    alb = mix(alb, vec3(0.08, 0.16, 0.04)*(0.6 + 0.8*fine), smoothstep(0.05, 0.75, n.y)*smoothstep(0.25, 0.6, cmN(vec2(th*2.0 + 3.0, len*0.13)))*0.9);
    col = alb*(cmSunL*clamp(ndl*0.8 + 0.2, 0.0, 1.0)*0.5 + cmAmb(n)*1.0)*(0.75 + 0.25*crack);
    col += cmSunL*vec3(0.5, 0.42, 0.2)*pow(clamp(1.0 - dot(n, v), 0.0, 1.0), 3.0)*toward*toward*0.3;      // the sun behind it lights its edge
  } else if (surf < 1.5) {
    // green skin: a small dark figure, the sun on its shoulder
    col = alb*(cmSunL*clamp(ndl*0.7 + 0.3, 0.0, 1.0)*0.55 + cmAmb(n)*0.6);
    col += cmSunL*vec3(0.6, 0.8, 0.4)*pow(clamp(1.0 - dot(n, v), 0.0, 1.0), 3.0)*0.12*(0.3 + 0.7*toward);
  } else if (surf < 2.5) {
    // a bladder: pale, veined, the light in its skin
    float vein = 1.0 - smoothstep(0.0, 0.14, abs(cmN(vL.xy*2.6 + vL.z*1.7 + vK.y*30.0) - 0.5)*2.0);
    float thru = pow(clamp(1.0 - abs(dot(n, v)), 0.0, 1.0), 1.5)*(0.35 + 0.65*toward) + 0.35*clamp(-ndl, 0.0, 1.0);
    col = alb*(cmSunL*clamp((ndl + 0.5)/1.5, 0.0, 1.0)*0.5 + cmAmb(n)*0.8)*(1.0 - 0.4*vein) + alb*vec3(1.1, 1.0, 0.45)*cmSunL*thru*0.24;
  } else {
    // amber: sap beads and the pod, the sun coming through
    vec3 h = uSunDir + v; h /= max(length(h), 1e-3);
    col = alb*(cmAmb(n)*0.55 + cmSunL*(0.14 + 0.5*toward*toward + 0.25*clamp(-ndl, 0.0, 1.0)));
    col += cmSunL*pow(clamp(dot(n, h), 0.0, 1.0), 60.0)*0.8;
  }
  col = cmHaze(col, vW, 1.0);
  gl_FragColor = vec4(col, 1.0);
}`;function _t(){return new dt({aBase:4,aAn:4,aCol:3,aPh:2,aUv:2})}function ft(_,u,s){const T=u.length,O=_.count,a=U(0,0,0),A=U(0,0,0),N=U(0,0,0),o=U(0,1,0),q="aUv"in _.a;let Y=0;for(let P=0;P<T;P++){P&&(Y+=u[P].p.distanceTo(u[P-1].p)),a.subVectors(u[Math.min(T-1,P+1)].p,u[Math.max(0,P-1)].p).normalize(),P===0&&Math.abs(a.y)>.9&&o.set(1,0,0),A.crossVectors(a,o).normalize(),N.crossVectors(A,a).normalize(),o.copy(N);for(let V=0;V<=s;V++){const I=V/s*et,L=Math.cos(I),W=Math.sin(I),g=u[P];q&&_.set("aUv",Y,I),_.v(g.p.x+(A.x*L+N.x*W)*g.r,g.p.y+(A.y*L+N.y*W)*g.r,g.p.z+(A.z*L+N.z*W)*g.r,A.x*L+N.x*W,A.y*L+N.y*W,A.z*L+N.z*W)}}_.stitch(O,T,s)}function wt(_,u,s,T,O,a=8,A=5){const N=_.count;for(let o=0;o<=A;o++){const q=o/A*Math.PI,Y=Math.sin(q),P=Math.cos(q);for(let V=0;V<=a;V++){const I=V/a*et,L=Math.cos(I)*Y,W=Math.sin(I)*Y,g=L/s,tt=P/T,z=W/O,y=Math.hypot(g,tt,z)||1;_.v(u.x+L*s,u.y+P*T,u.z+W*O,g/y,tt/y,z/y)}}_.stitch(N,A+1,a,!0)}async function Ft(_,u,s){const T=s.forks||{},O=n=>ot(u,T[n],n,_),a=_t(),A=u.cable,N=s.peak;let o=O("boughs");const q=ct("#4F4A38"),Y=[ct("#3F7A3A"),ct("#4E8A3C"),ct("#356B38")],P=ct("#152410"),V=ct("#C9D6A4"),I=ct("#F0962A"),L=ct("#C9D27A",.8),W=(n,i,h,d,r,e,f)=>{a.set("aBase",n.x,i,n.z,h),a.set("aAn",d[0],d[1],d[2],d[3]),a.set("aCol",r.r,r.g,r.b),a.set("aPh",e,f)},g=[],tt=new Set;for(let n=0,i=0;i<(s.crowns||[]).length;i++){const h=s.crowns[i],d=o.chance(1/3),r=o.range(9,24),e=o.range(-.5,.5),f=o.range(.7,1.25),c=o.range(1.2,2.6),M=o.range(-.25,.25),p=o(),x=(h.x+h.nx)/2,S=(h.z+h.nz)/2,k=Math.round(x)+":"+Math.round(S);if(!d||tt.has(k)||(tt.add(k),yt(N,x,S)>2||s.path.distanceTo(x,u.hump(x,S,0),S)<16))continue;const J=Math.atan2(h.nz-h.z,h.nx-h.x)+Math.PI/2+e,lt=U(x,0,S),ht=[],F=Math.cos(J),H=Math.sin(J);for(let st=0;st<=9;st++){const at=st/9,vt=(at-.5)*r,it=M*r*(at-.5)*(at-.5)*2;ht.push({p:U(F*vt-H*it,-1.9+c*1.9*Math.sin(Math.PI*at)+.25*Math.sin(at*11+n),H*vt+F*it),r:f*(.75+.35*Math.sin(Math.PI*at)+.18*Math.sin(at*17+n*3))})}W(lt,0,1,[0,0,0,0],q,p,0),ft(a,ht,7),g.push({base:lt,pts:ht,r0:f}),n++,n%12===0&&await _.yield()}const z=s.suckers??40;o=O("suckers");for(let n=0;n<z&&g.length;n++){const i=g[Math.floor(o()*g.length)],h=2+Math.floor(o()*6),d=i.pts[h],r=o.range(1.5,2.3),e=r*o.range(.34,.46),f=o(),c=U(d.p.x+o.range(-.3,.3),d.p.y+d.r*.8,d.p.z+o.range(-.3,.3)),M=U(c.x,c.y+r*.52,c.z);W(i.base,0,1,[c.x,c.y,c.z,2],V,f,2),wt(a,M,e,r*.55,e,8,5),W(i.base,0,1,[0,0,0,0],V.clone().multiplyScalar(.7),f,2),ft(a,[{p:U(c.x,c.y+.25,c.z),r:e*.32},{p:U(c.x,c.y-.3,c.z),r:e*.2},{p:U(c.x,c.y-.7,c.z),r:.05}],6);for(let p=0;p<3;p++){const x=o.range(0,et),S=o.range(.1,.2);W(i.base,0,1,[0,0,0,0],I,f,3),wt(a,U(c.x+Math.cos(x)*e*.4,c.y-.05-.12*p,c.z+Math.sin(x)*e*.4),S,S*1.3,S,5,3)}}await _.yield();const y=U(N.x,0,N.z);o=O("watchers");const b=s.figures??6,B=(n,i,h)=>ft(a,[{p:n,r:h},{p:i,r:h*.8}],4),v=[],m=u.sunDir.x,X=u.sunDir.z,Q=Math.hypot(m,X)||1,Z=o.range(-.6,.6),D=(m*Math.cos(Z)+X*Math.sin(Z))/Q,j=(-m*Math.sin(Z)+X*Math.cos(Z))/Q;let G=o.range(20,34);const $=n=>N.h-3.5+2.2*Math.sin(n*2.2)+.3*Math.sin(n*9),t=n=>{let i=1/0;for(let h=0;h<=6;h++){const d=h/6,r=2+d*n;i=Math.min(i,s.path.distanceTo(N.x+D*r,$(d)+1,N.z+j*r)-2.4)}return i};for(;G>6&&t(G)<(s.keep??22);)G-=.5;const l=[];for(let n=0;n<=12;n++){const i=n/12,h=2+i*G;l.push({p:U(D*h,$(i),j*h),r:gt(1.9,.85,i)*(1+.12*Math.sin(i*13))})}W(y,0,0,[0,0,0,0],q,o(),0),ft(a,l,9);const w=n=>{const i=mt(1-n/G,0,1),h=Math.min(11,Math.floor(i*12)),d=i*12-h,r=l[h],e=l[h+1];return{x:gt(r.p.x,e.p.x,d),y:gt(r.p.y+r.r,e.p.y+e.r,d)-.06,z:gt(r.p.z,e.p.z,d)}};for(let n=0;n<b;n++){const i=w(.8+n*1.6+o.range(-.2,.2)),h=o(),d=o.range(-.45,.45),r=o.range(1.15,1.38),e=Y[n%3],f=U(i.x,i.y,i.z);v.push(f);const c=(x,S,k)=>U(f.x+(x*Math.cos(d)-k*Math.sin(d))*r,f.y+S*r,f.z+(x*Math.sin(d)+k*Math.cos(d))*r),M=[f.x,f.y,f.z,3];W(y,0,0,M,e,h,1),B(c(-.09,0,0),c(-.08,.5,0),.06),B(c(.09,0,0),c(.08,.5,0),.06),ft(a,[{p:c(0,.46,0),r:.12},{p:c(0,.7,.01),r:.13},{p:c(0,.88,.03),r:.09}],5),wt(a,c(0,1,.07),.095*r,.11*r,.1*r,6,4),B(c(-.15,.84,.02),c(-.19,.5,.05),.04),W(y,0,0,M,P,h,1),wt(a,c(0,1.04,0),.1*r,.09*r,.11*r,6,3);const p=c(.15,.84,.02);W(y,0,0,[p.x,p.y,p.z,1],e,h,1),B(p,c(.19,.5,.05),.04)}{const n=w(.8+b*1.6+2.4),i=U(n.x,n.y+.5,n.z);W(y,0,0,[0,0,0,0],L,.3,3);const h=a.count,d=U(D,.05,j).normalize(),r=U(0,1,0),e=U(0,0,0).crossVectors(d,r).normalize();r.crossVectors(e,d);for(let f=0;f<=7;f++){const c=f/7*Math.PI,M=Math.pow(Math.sin(c),1.3),p=Math.cos(c);for(let x=0;x<=8;x++){const S=x/8*et,k=Math.cos(S),J=Math.sin(S);a.v(i.x+d.x*p*1.6+(r.x*k+e.x*J)*M*.62,i.y+d.y*p*1.6+(r.y*k+e.y*J)*M*.62,i.z+d.z*p*1.6+(r.z*k+e.z*J)*M*.62,r.x*k+e.x*J,r.y*k+e.y*J,r.z*k+e.z*J)}}a.stitch(h,8,8,!0)}const E=ut(a.geometry(),N.x,20,N.z,1400),K=new R.Mesh(E,new R.ShaderMaterial({uniforms:pt(u.U),vertexShader:Kt,fragmentShader:Rt,side:R.DoubleSide,fog:!1}));K.name="rooted",K.frustumCulled=!1;const C=U(N.x+D*(2+G),$(1)+2,N.z+j*(2+G));return{object:K,triangles:a.triangles,boughs:g,figures:v,watch:{turn:Z,length:G,fromRoute:s.path.distanceTo(C.x,C.y,C.z),least:t(G)}}}const Lt=`
attribute vec2 aT; attribute vec4 aI0, aI1; attribute float aI2;
varying vec3 vW, vN, vIn; varying vec4 vUv;
${rt}
${Bt}
void main(){
  float jaw = aT.x, size = aI1.x;
  // how wide it gapes, 0 shut .. 1 wide. A trap without a covey opens slowly and snaps on a round of its own.
  float tt = fract(uTime/aI1.y + aI1.z);
  float own = smoothstep(0.0, 0.7, tt)*(1.0 - smoothstep(0.86, 0.872, tt));
  // (mend W, W4) ONE WITH A COVEY resting round it waits wide open for them to stir, AND THEY STIR ON ITS ROUND: cs is
  // the seconds since its covey last stirred (its round: CV_ROUNDS of its gaping rounds, from its own phase,
  // on the world's clock). CV_SNAP seconds after the stir the jaws are shut in 0.13 s, stay shut CV_SHUT
  // seconds, and open again over 0.7 of the trap's gaping round: the numbers a sprung trap had when the eye
  // sprang it. NOTHING HERE IS BY THE EYE (before this mend aSp, a moment written when the eye first came within
  // 62 m, shut any trap once, and a trap with a covey otherwise waited open for ever).
  float cs = fract(uTime/(CV_ROUNDS*aI1.y) + aI1.z)*CV_ROUNDS*aI1.y;
  float shut = smoothstep(CV_SNAP, CV_SNAP + 0.13, cs) - smoothstep(CV_SNAP + CV_SHUT, CV_SNAP + CV_SHUT + 0.7*aI1.y, cs);
  float gape = mix(own, (0.86 + 0.14*sin(uTime*0.7 + aI1.z*20.0))*(1.0 - shut), step(0.5, aI1.w));
  float g = mix(0.07, 1.22, gape) + 0.02*sin(uTime*2.1 + aI1.z*50.0)*gape;     // it trembles a little while it waits
  vec3 p, n, nin = vec3(0.0, 0.0, -jaw);
  vec2 uv = vec2(0.0);
  if (abs(jaw) < 0.5) {
    // the stalk: slightly bent, each its own way (its top, where the jaws hinge, stays where it is)
    float by = position.y - 2.4, ba = aI1.z*40.0;
    p = (position + vec3(cos(ba), 0.0, sin(ba))*0.8*sin(by*0.42 + aI1.z*9.0)*smoothstep(0.0, -3.5, by))*size; n = normal;
    uv = vec2(atan(position.z, position.x), position.y); nin = vec3(0.0, 0.3 + aI1.z, 0.0);
  }
  else {
    float u = position.x, s = position.z;
    // a jaw is a great leaf: narrow at the hinge, broad in the middle, round at the lip, deeply cupped
    float uc = clamp(u, 0.0, 1.0);
    float w = 0.7 + 3.4*pow(max(sin(3.14159*clamp(0.06 + 0.86*uc, 0.0, 1.0)), 0.0), 0.75);
    float cup = 1.9*(1.0 - s*s)*sin(3.14159*pow(uc, 0.8));
    vec3 q = vec3(s*w, 2.4 + u*12.0, jaw*(0.25 + cup));
    q.z -= jaw*aT.y*2.6;                                   // a long thorn stands in from the rim
    vec3 nq = normalize(vec3(s*0.9, 0.0, jaw));               // outward: the back of the jaw
    // swing about the hinge (the stalk's top, the x axis)
    float a = jaw*g, c = cos(a), sn = sin(a);
    q.y -= 2.4; q = vec3(q.x, q.y*c - q.z*sn, q.y*sn + q.z*c); q.y += 2.4;
    nq = vec3(nq.x, nq.y*c - nq.z*sn, nq.y*sn + nq.z*c);
    nin = vec3(0.0, jaw*sn, -jaw*c);                          // the way its lining faces
    p = q*size; n = nq; uv = vec2(u, s);
  }
  float cy = cos(aI0.w), sy = sin(aI0.w);
  p = vec3(p.x*cy + p.z*sy, p.y, -p.x*sy + p.z*cy); n = vec3(n.x*cy + n.z*sy, n.y, -n.x*sy + n.z*cy); nin = vec3(nin.x*cy + nin.z*sy, nin.y, -nin.x*sy + nin.z*cy);
  // the whole plant leans toward the light, each by its own amount (about the line across the sun's bearing)
  vec2 sh = uSunDir.xz/max(length(uSunDir.xz), 1e-3); vec3 ax = vec3(sh.y, 0.0, -sh.x);
  float ct = cos(aI2), st = sin(aI2);
  p = p*ct + cross(ax, p)*st + ax*dot(ax, p)*(1.0 - ct); n = n*ct + cross(ax, n)*st + ax*dot(ax, n)*(1.0 - ct); nin = nin*ct + cross(ax, nin)*st + ax*dot(ax, nin)*(1.0 - ct);
  vec2 xz = aI0.xz + p.xz;
  vW = vec3(xz.x, cmRoof(aI0.xz, uTime) + aI0.y + p.y - cmDrop(xz), xz.y);
  vN = n; vIn = nin; vUv = vec4(uv, jaw, aT.y);
  gl_Position = projectionMatrix*viewMatrix*vec4(vW, 1.0);
}`,qt=`
#define CM_FOLLOW 1.0
varying vec3 vW, vN, vIn; varying vec4 vUv;
${rt}
void main(){
  vec3 v = normalize(cameraPosition - vW), n = normalize(vN);
  float jaw = vUv.z, u = vUv.x, s = vUv.y;
  vec3 col;
  if (abs(jaw) < 0.5) {
    // the stalk: a tapering green-brown stem, fibred along its length, with a few NODES at uneven heights (each a
    // dark crease under a paler swelling, tilted; in the stalk's own units, each trap its own), on a spreading
    // foot of buttress roots that grips the crown it stands on (browner, a shade paler than the leaves round it)
    float ndl = dot(n, uSunDir), ang = u, hy = s, own = length(vIn)*37.0;
    float nd = cmN(vec2(hy*0.8 + 0.25*sin(ang + own), own));
    float node = 1.0 - smoothstep(0.0, 0.05, abs(nd - 0.5)), swell = 1.0 - smoothstep(0.0, 0.16, abs(nd - 0.56));
    float fibre = cmN(vec2(ang*7.0 + own, hy*0.35)), foot = 1.0 - smoothstep(-5.0, -1.5, hy);
    float butt = 0.5 + 0.5*cos(ang*5.0 + 1.3*cmN(vec2(ang*1.5, hy*0.3)));
    vec3 alb = mix(vec3(0.15, 0.2, 0.08), vec3(0.3, 0.33, 0.15), fibre)*(1.0 + 0.25*swell)*(1.0 - 0.55*node);
    alb = mix(alb, mix(vec3(0.2, 0.2, 0.1), vec3(0.4, 0.35, 0.2), fibre)*(0.7 + 0.3*butt), foot);
    col = alb*(cmSunL*clamp(ndl*0.7 + 0.3, 0.0, 1.0)*0.5 + cmAmb(n)*0.75);
  } else {
    float inside = step(0.0, dot(normalize(vIn), v));
    float rib = 1.0 - smoothstep(0.03, 0.10, abs(s));
    // outside: a jaw is green, a leaf's plain back with a midrib (G3 f: no stripes), red-brown along its rim
    vec3 nI = dot(n, v) < 0.0 ? -n : n;
    float ndl = dot(nI, uSunDir);
    vec3 back = mix(vec3(0.13, 0.32, 0.07), vec3(0.3, 0.52, 0.13), cmN(vec2(s*4.0, u*6.0)))*(1.0 - 0.3*rib);
    back = mix(back, vec3(0.4, 0.17, 0.08), smoothstep(0.7, 1.0, abs(s))*0.7);
    vec3 outer = back*(cmSunL*clamp(ndl*0.8 + 0.2, 0.0, 1.0)*0.42 + cmAmb(nI)*0.6);
    // inside: the throat, wet red-brown, darkest at the hinge, mottled paler toward the lip
    // (one material for every trap: no veins or stripes in it, and it takes the sun weakly, as wet dark flesh)
    vec3 lining = mix(vec3(0.13, 0.042, 0.028), vec3(0.25, 0.1, 0.06), smoothstep(0.0, 0.9, u))*(0.8 + 0.4*cmN(vec2(u*7.0, s*3.0)));
    vec3 h = uSunDir + v; h /= max(length(h), 1e-3);
    vec3 inner = lining*(cmSunL*clamp(ndl*0.8 + 0.2, 0.0, 1.0)*0.3 + cmAmb(nI)*0.7) + cmSunL*pow(clamp(dot(nI, h), 0.0, 1.0), 40.0)*0.06;
    col = mix(outer, inner, inside);
    // teeth: thorns the colour of horn (never white: dull, a shade paler at the root than at the point)
    col = mix(col, mix(vec3(0.5, 0.43, 0.27), vec3(0.36, 0.28, 0.16), smoothstep(0.6, 1.0, vUv.w))*(cmSunL*0.2 + cmAmb(n)*0.7), smoothstep(0.1, 0.45, vUv.w));
  }
  col = cmHaze(col, vW, 1.0);
  gl_FragColor = vec4(col, 1.0);
}`;async function Ht(_,u,s){const T=ot(u,s.rng,"traps",_),O=ot(u,s.coveyRng,"coveys",_),a=new dt({aT:2}),A=s.count??80;{const z=[[4.6,-9],[3.7,-6],[2.7,-3.8],[2.05,-2],[1.75,-.6],[1.65,.4],[1.5,1.4],[1.2,2.2],[.8,2.6]],y=a.count;a.set("aT",0,0);for(const[b,B]of z)for(let v=0;v<=12;v++){const m=v/12*et;a.v(Math.cos(m)*b,B,Math.sin(m)*b,Math.cos(m),B<-1?.6:.2,Math.sin(m))}a.stitch(y,z.length,12,!0)}for(const z of[-1,1]){const B=a.count;a.set("aT",z,0);for(let v=0;v<=8;v++)for(let m=0;m<=4;m++)a.v(v/8,0,m/4*2-1);a.stitch(B,9,4);for(const v of[-1,1])for(let m=0;m<10;m++){const X=.12+.086*m;a.set("aT",z,0);const Q=a.v(X-.034,0,v),Z=a.v(X+.034,0,v);a.set("aT",z,1);const D=a.v(X,0,v*.93);a.tri(Q,Z,D)}}const N=a.geometry(),o=new R.InstancedBufferGeometry;o.instanceCount=A,o.setAttribute("position",N.getAttribute("position")),o.setAttribute("normal",N.getAttribute("normal")),o.setAttribute("aT",N.getAttribute("aT")),o.setIndex(N.getIndex());const q=new Float32Array(A*4),Y=new Float32Array(A*4),P=new Float32Array(A),V=[],I=s.peak;let L=0;const W=Math.min(s.belt??12,A),g=ot(u,s.beltRng,"trap-belt",_);for(let z=0;L<A&&z<A*30+400;z++){const y=L<W,b=y?g:T,B=b.range(0,et),v=Math.sqrt(y?b.range((I.r+12)*(I.r+12),(I.r+70)*(I.r+70)):b.range((I.r+12)*(I.r+12),520*520)),m=I.x+Math.cos(B)*v,X=I.z+Math.sin(B)*v,Q=b.range(0,et),Z=b.range(.1,.45),D=b.range(.6,1.6),j=b.range(11,19),G=b(),$=s.path.distanceTo(m,u.roof(m,X)+3.2+8*D,X);z%12===11&&await _.yield(),!($<8+10*D||V.some(t=>Math.hypot(t.x-m,t.z-X)<44))&&(V.push({x:m,z:X,round:j,ph:G,covey:!1,off:$}),q.set([m,3.2,X,Q],L*4),Y.set([D,j,G,0],L*4),P[L]=Z,L++)}for(let z=0;z<L;z++)V[z].covey=O.chance(1/2),Y[z*4+3]=V[z].covey?1:0;o.instanceCount=L,o.setAttribute("aI0",new R.InstancedBufferAttribute(q,4)),o.setAttribute("aI1",new R.InstancedBufferAttribute(Y,4)),o.setAttribute("aI2",new R.InstancedBufferAttribute(P,1)),ut(o,I.x,0,I.z,700);const tt=new R.Mesh(o,new R.ShaderMaterial({uniforms:pt(u.U),vertexShader:Lt,fragmentShader:qt,side:R.DoubleSide,fog:!1}));tt.name="traps",tt.frustumCulled=!1;for(let z=0;z<L;z++)V[z].size=Y[z*4];return{object:tt,triangles:a.triangles*L,sites:V}}const Wt=`
attribute vec3 aKp; attribute float aKq; attribute vec4 aI0, aI1;
uniform vec3 uWind;
varying vec3 vW, vN; varying vec4 vK; varying vec2 vA;
${rt}
${Ct}
void main(){
  float part = aKp.x, ph = aI0.w, size = aI1.x, h = aI0.y;
  vec3 up = vec3(0.0, 1.0, 0.0), wind = normalize(uWind), right = cross(up, wind);
  float gust = cmGust(aI0.xz, uTime);
  // the kite tugs and swings on its stalk
  vec3 sw = vec3(sin(uTime*0.5 + ph*20.0), 0.3*sin(uTime*0.8 + ph*31.0), cos(uTime*0.37 + ph*11.0))*aI1.z*(0.7 + 0.6*gust);
  float roofA = cmRoof(aI0.xz, uTime);
  vec3 kite = vec3(aI0.x, roofA + h*(1.0 + 0.03*sin(uTime*1.7 + ph*50.0)), aI0.z) + sw;
  vec3 foot = vec3(aI0.x, roofA - 0.5, aI0.z) - wind*aI1.y*h;
  // the leaf's own frame: it lies back on the wind, and rolls as it swings
  float roll = 0.3*sin(uTime*0.5 + ph*20.0 + 1.2) + 0.12*sin(uTime*2.3 + ph*70.0)*gust;
  vec3 nrm = normalize(wind*0.55 + up*0.84 + right*roll), kr = normalize(cross(nrm, wind)), ku = cross(kr, nrm);
  vec3 c, n = nrm; float k = 1.0; vec4 mv; bool ribbon = false; vec3 tng = up; float side = 0.0, wdt = 0.0;
  if (part < 0.5) {                                   // the stalk: a thread that bellies downwind
    float q = aKp.y; ribbon = true; side = aKp.z; wdt = 0.035*size;
    c = mix(foot, kite, q) + wind*(0.3*h*sin(3.14159*q)) - up*(0.12*h*sin(3.14159*q));          // slack: it bellies down the wind
    tng = normalize(kite - foot + (wind*0.3 - up*0.12)*(h*3.14159*cos(3.14159*q)));
  } else if (part < 1.5) {                            // the leaf: a diamond with a keel
    c = kite + (kr*aKp.y + ku*aKp.z)*size + nrm*aKq*size;
  } else {
    // the tail streams from the lower corner, down the wind, and wags
    float q = part < 2.5 ? aKp.y : aKq;
    vec3 from = kite - ku*1.9*size;
    vec3 tp = from + (wind*0.75 - up*0.65)*(5.5*size*q) + kr*0.5*size*sin(uTime*1.9 + ph*40.0 - q*5.0)*q;
    if (part < 2.5) { ribbon = true; side = aKp.z; wdt = 0.03*size; c = tp; tng = normalize(wind*0.75 - up*0.65); }
    else c = tp + (kr*aKp.y + ku*aKp.z)*size;
  }
  c.y -= cmDrop(c.xz);
  if (ribbon) { mv = cmRibbon(c, tng, side, wdt, k); } else mv = viewMatrix*vec4(c, 1.0);
  vW = c; vN = n; vK = vec4(part, aKp.y, aKp.z, aI1.w); vA = vec2(k, side);
  gl_Position = projectionMatrix*mv;
}`,Ut=`
#define CM_FOLLOW 1.0
varying vec3 vW, vN; varying vec4 vK; varying vec2 vA;
${rt}
void main(){
  vec3 v = normalize(cameraPosition - vW), n = normalize(vN);
  float part = vK.x, toward = clamp(dot(-v, uSunDir)*0.5 + 0.5, 0.0, 1.0);
  vec3 col; float al = 1.0;
  if (part < 0.5 || (part > 1.5 && part < 2.5)) {
    float e = 1.0 - smoothstep(0.5, 1.0, abs(vA.y));
    al = e*clamp(vA.x, 0.0, 1.0);
    al *= 0.75;
    col = vec3(0.55, 0.66, 0.45)*(cmAmb(vec3(0.0, 0.3, 0.0))*0.4 + cmSunL*(0.05 + 0.3*toward*toward*toward));
  } else if (part < 1.5) {
    // a leaf stretched like a sail: a keel, veins raking back from it, the sun through it
    // its outline is a leaf's, not a toy's: lobed, ragged, torn in from the rim, browned at the edge
    float od = abs(vK.y)/1.5 + abs(vK.z + 0.15)/1.75, ang = atan(vK.z + 0.15, vK.y);
    float rim = 0.8 + 0.1*sin(ang*5.0 + vK.w*40.0) + 0.14*cmN(vec2(ang*4.0 + vK.w*90.0, vK.w*17.0));
    float tear = smoothstep(0.74, 0.8, cmN(vec2(vK.y*1.7 + vK.w*31.0, vK.z*0.6 + vK.w*13.0)))*smoothstep(0.35, 0.6, od);
    if (od > rim || tear > 0.5) discard;
    float rib = 1.0 - smoothstep(0.02, 0.07, abs(vK.y)), sv = 1.0 - smoothstep(0.06, 0.2, abs(fract(vK.z*1.6 + abs(vK.y)*1.1) - 0.5));
    float vein = max(rib, 0.5*sv);
    // a pale sail: a bleached leaf as thin as paper, the light in it whichever side the sun is on
    col = cmLeaf(n, v, vK.w, 1.0 - 0.5*vein, 0.95, 0.5);
    col = mix(col, vec3(0.9, 0.87, 0.64)*(cmAmb(n)*0.6 + cmSunL*(0.14 + 0.4*toward*toward)), 0.8)*(1.0 - 0.25*vein);
    col = mix(col, col*vec3(1.0, 0.72, 0.42), smoothstep(rim - 0.22, rim, od)*0.6);
  } else {
    col = vec3(0.34, 0.22, 0.08)*(cmSunL*(0.2 + 0.4*toward*toward) + cmAmb(n)*0.7);
  }
  col = cmHaze(col, vW, 0.6);
  if (al < 0.01) discard;
  gl_FragColor = vec4(col*al, al);
}`;function jt(_,u,s){const T=ot(u,s.rng,"kites",_),O=s.count??140,a=new dt({aKp:3,aKq:1}),A=(y,b)=>{const B=a.count;for(let v=0;v<=b;v++)for(const m of[-1,1])a.set("aKp",y,v/b,m),a.v(0,0,0);for(let v=0;v<b;v++){const m=B+v*2;a.i.push(m,m+1,m+2,m+1,m+3,m+2)}};a.set("aKq",0),A(0,12);{a.set("aKp",1,0,0),a.set("aKq",.07);const y=a.v(0,0,0);a.set("aKq",0);const b=[[0,1.6],[1.5,.15],[0,-1.9],[-1.5,.15]].map(([B,v])=>(a.set("aKp",1,B,v),a.v(0,0,0)));for(let B=0;B<4;B++)a.tri(y,b[B],b[(B+1)%4])}A(2,6);for(let y=0;y<4;y++){a.set("aKq",.3+.22*y);const b=[[0,.3],[.16,0],[0,-.3],[-.16,0]].map(([B,v])=>(a.set("aKp",3,B,v),a.v(0,0,0)));a.quad(b[0],b[1],b[2],b[3])}const N=a.geometry(),o=new R.InstancedBufferGeometry;o.instanceCount=O;for(const y of["position","normal","aKp","aKq"])o.setAttribute(y,N.getAttribute(y));o.setIndex(N.getIndex());const q=new Float32Array(O*4),Y=new Float32Array(O*4),P=U(0,0,0),V=U(0,0,0),I=U(...s.wind??[1,0,.3]).normalize(),L=s.mist||[9.5,14.5],W=(s.traps||[]).filter(y=>y.covey);let g=0;for(const y of W){if(g>=O)break;const b=T.range(20,40),B=T.range(L[0],L[1]),v=T.range(.25,.6),m=T(),X=T.range(.8,1.25),Q=T.range(.8,2.6),Z=T(),D=y.x+I.x*b,j=y.z+I.z*b,G=u.roof(D,j),$=Math.max(B-G,6);let t=s.path.distanceTo(D,G+$,j)>16;for(let l=0;l<=4&&t;l++){const w=l/4;t=s.path.distanceTo(D-I.x*v*$*(1-w)+I.x*.3*$*Math.sin(Math.PI*w),G+$*w,j-I.z*v*$*(1-w)+I.z*.3*$*Math.sin(Math.PI*w))>13}!t||yt(s.peak,D,j)>$-8||(q.set([D,$,j,m],g*4),Y.set([X,v,Q,Z],g*4),g++)}o.instanceCount=g,o.setAttribute("aI0",new R.InstancedBufferAttribute(q,4)),o.setAttribute("aI1",new R.InstancedBufferAttribute(Y,4)),ut(o,0,20,-250,1200);const tt={uWind:{value:new R.Vector3(...s.wind??[1,0,.3])}},z=new R.Mesh(o,new R.ShaderMaterial({uniforms:pt(u.U,tt),vertexShader:Wt,fragmentShader:Ut,transparent:!0,premultipliedAlpha:!0,side:R.DoubleSide,fog:!1}));return z.name="kites",z.frustumCulled=!1,z.renderOrder=1,{object:z,triangles:a.triangles*O}}const Vt=`
attribute vec2 aWg; attribute vec4 aB0, aB1, aB2;
varying vec3 vW, vN; varying vec3 vK; varying float vFol;
${rt}
${Bt}
// where a bird is at world time t
vec3 birdAt(float t){
  float ph = aB0.w;
  if (aB2.w < -2.5) {
    float tt = fract(t/aB1.z + aB1.w), in_ = smoothstep(0.5, 0.86, tt), a = ph*6.2831853 + t*0.45;
    vec3 c = vec3(aB1.x, cmRoof(aB1.xy, uTime) + 11.0, aB1.y);
    return c + vec3(cos(a), 0.0, sin(a))*mix(20.0, 0.0, in_) + vec3(0.0, mix(10.0 + 3.0*sin(a*1.7), 0.0, in_), 0.0);
  }
  if (aB2.w < 0.0) {
    // (mend W, W4) A covey resting round a trap STIRS AND RISES ON ITS TRAP'S ROUND, again and again: since is the
    // seconds since it last stirred (aB1.z: the seconds of its round; aB1.w: its trap's phase; the world's
    // clock). The birds are all in the air 1.3 s after (the jaws go at CV_SNAP) and come down again 14 to 22 s
    // after they rose. One of each covey (aB2.w = -2) veers over the gape and hangs there, and THE JAWS TAKE IT
    // when they shut; WHEN THEY OPEN AGAIN ANOTHER COMES IN FROM THE AIR to the taken one's place on the crowns:
    // from 20 m out and 10 m up (where a lone glider wheels), down over the 0.7 of the trap's gaping round
    // its jaws take to open. (Before this mend the covey was put up once, by the eye's coming within 100 m.)
    float roof = cmRoof(aB1.xy, uTime);
    vec3 mouth = vec3(aB1.x, roof + 11.0, aB1.y);
    float since = fract(t/aB1.z + aB1.w)*aB1.z;
    float f = smoothstep(0.0, 1.3, since)*(1.0 - smoothstep(14.0, 22.0, since));
    vec2 d = aB0.xz/max(length(aB0.xz), 1e-3);
    vec3 rest = vec3(aB1.x + aB0.x, roof + 3.6, aB1.y + aB0.z);
    if (aB2.w < -1.5) {
      // (half way through the jaws' shut time, while there is no bird to see, its place goes over to the newcomer's)
      if (since > CV_SNAP + 0.5*CV_SHUT) return rest + vec3(d.x*20.0, 10.0, d.y*20.0)*(1.0 - smoothstep(CV_SNAP + CV_SHUT, CV_SNAP + CV_SHUT + 0.7*aB1.z/CV_ROUNDS, since));
      return mix(rest, mouth + vec3(d.x, 0.2, d.y)*1.5*sin(t*0.9 + ph*30.0), f);
    }
    return rest + vec3(aB0.x, 0.0, aB0.z)*2.6*f + vec3(0.0, (13.0 + 3.0*aB0.y)*f*(2.0 - f), 0.0)
         + vec3(d.x, 0.15, d.y)*sin(t*0.45 + ph*30.0)*3.0*f;
  }
  // a flock on its round, on the world clock
  float a = aB2.y + aB1.w*t;
  vec3 f = vec3(aB1.x + cos(a)*aB1.z, aB2.x + 3.0*sin(a*2.0 + aB2.y), aB1.y + sin(a)*aB1.z*aB2.w);
  vec3 wander = vec3(sin(t*0.31 + ph*20.0)*6.0, sin(t*0.5 + ph*33.0)*2.2, cos(t*0.27 + ph*12.0)*6.0);
  return f + aB0.xyz + wander;
}
void main(){
  vec3 c = birdAt(uTime), c2 = birdAt(uTime + 0.15);
  vec3 fwd = c2 - c; float fl = length(fwd); fwd = fl > 1e-4 ? fwd/fl : vec3(0.0, 0.0, -1.0);
  if (aB2.w < 0.0 && aB2.w > -2.5) { vec2 d = aB0.xz/max(length(aB0.xz), 1e-3); fwd = normalize(mix(fwd, vec3(d.x, 0.25, d.y), 0.7) + vec3(1e-3, 0.0, 0.0)); }
  vec3 rt = cross(fwd, vec3(0.0, 1.0, 0.0)); rt /= max(length(rt), 1e-3);
  vec3 upv = cross(rt, fwd);
  // it tilts as it sails; the wings flex a little on the air
  float roll = 0.38*sin(uTime*0.7 + aB0.w*40.0), cr = cos(roll), sr = sin(roll);
  float sz = (0.8 + 0.5*aB0.w)*(1.0 + aB2.z);
  // the one that goes into the jaws is gone once they shut (and another comes in from the air when they open again)
  if (aB2.w < -2.5) { float tt = fract(uTime/aB1.z + aB1.w); sz *= smoothstep(0.0, 0.08, tt)*(1.0 - smoothstep(0.86, 0.872, tt)); }
  // (mend W, W4) the one over the gape is gone as the jaws shut (0.13 s), and the newcomer is there 1.2 s after they begin to open
  else if (aB2.w < -1.5) { float cs = fract(uTime/aB1.z + aB1.w)*aB1.z; sz *= 1.0 - smoothstep(CV_SNAP, CV_SNAP + 0.13, cs) + smoothstep(CV_SNAP + CV_SHUT, CV_SNAP + CV_SHUT + 1.2, cs); }
  vec3 p = position*sz, n = normal;
  if (abs(aWg.x) > 0.5) { float fx = (0.16 + 0.07*(aB2.z > 0.5 ? 0.3 : 1.0)*sin(uTime*2.3 + aB0.w*60.0))*aWg.y; p.y += abs(p.x)*fx; }
  p = vec3(p.x*cr - p.y*sr, p.x*sr + p.y*cr, p.z); n = vec3(n.x*cr - n.y*sr, n.x*sr + n.y*cr, n.z);
  vec3 w = c + rt*p.x + upv*p.y - fwd*p.z;
  // (mend U, U1) THE SHARE OF THE LAND'S FALL THIS BIRD TAKES, said ONCE: none for a high glider (it keeps the
  // cable's height), all of it for the rest (they sink with the land). The same number moves it here and
  // tells its light its own height (BIRD_FRAG's CM_FOLLOW): the two cannot part.
  vFol = aB2.z > 0.5 ? 0.0 : 1.0;
  w.y -= cmDrop(w.xz)*vFol;
  vW = w; vN = normalize(rt*n.x + upv*n.y - fwd*n.z); vK = vec3(aWg, aB0.w);
  gl_Position = projectionMatrix*viewMatrix*vec4(w, 1.0);
}`,Dt=`
#define CM_FOLLOW vFol
varying vec3 vW, vN; varying vec3 vK; varying float vFol;
${rt}
void main(){
  vec3 v = normalize(cameraPosition - vW), n = normalize(vN);
  vec3 col;
  if (abs(vK.x) > 0.5) col = cmLeaf(n, v, 0.35 + 0.4*fract(vK.z*7.0), 0.9, 0.95, 0.4);       // leaf wings, lit through
  else {
    float ndl = dot(n, uSunDir);
    col = vec3(0.30, 0.20, 0.09)*(cmSunL*clamp(ndl*0.7 + 0.3, 0.0, 1.0)*0.55 + cmAmb(n)*0.7);
  }
  col = cmHaze(col, vW, 0.6);
  gl_FragColor = vec4(col, 1.0);
}`;function Gt(_,u,s){const T=ot(u,s.rng,"flocks",_),O=ot(u,s.coveyRng,"covey-birds",_),a=s.flocks??6,A=s.each??60,N=9,o=s.peak,q=new dt({aWg:2}),Y=(s.traps??[]).filter(t=>t.covey),P=ot(u,s.gliderRng,"gliders",_),V=(s.traps??[]).filter(t=>P.chance(.3333333333333333)&&!t.covey),I=[],L=[[s.moonDir,s.moonRadius],[u.sunDir,s.sunRadius]].filter(t=>t[0]&&t[1]).map(([t,l])=>{const w=t.clone().normalize();return{x:w.x,y:w.y,z:w.z,rho:1.15*l*Math.PI/180,tr:Math.tan(1.15*l*Math.PI/180)}});if(s.path){const t=new R.Vector3;for(let l=0;l<=s.path.length;l+=6)s.path.posAtDist(l,t),I.push(t.x,t.y,t.z)}const W=(t,l,w,E)=>{const K=E+36,C=K+20;for(const n of L)for(let i=0;i<I.length;i+=3){const h=I[i],d=I[i+1],r=I[i+2],e=t-h,f=w-d,c=l-r,M=Math.hypot(e,f,c);if(!(M>C&&Math.acos(mt((e*n.x+f*n.y+c*n.z)/M,-1,1))>n.rho+Math.asin(C/M)))for(let p=Math.max(0,M-C);p<=M+C;p+=10){const x=Math.max(0,Math.hypot(h+p*n.x-t,r+p*n.z-l)-K),S=Math.max(0,Math.abs(d+p*n.y-w)-15);if(Math.hypot(x,S)<p*n.tr+5)return!0}}return!1},g=ot(u,s.highRng,"high-gliders",_),tt=s.high??0,z=14,y=u.cable,b=[];for(let t=0;t<tt;t++)for(let l=0;l<40;l++){const w=g.range(90+430*t/tt,90+430*(t+1)/tt),E=g.sign()*g.range(110,330),K=g.range(25,45),C=g.range(.6,.95),n=g.range(-130,-30),i=y.at(w,E,0),h=i.y+n;let d=!0;const r=new R.Vector3;for(let e=0;e<48&&d;e++){const f=e/48*et;r.set(i.x+Math.cos(f)*K,h,i.z+Math.sin(f)*K*C);const c=mt(r.clone().sub(y.P).dot(y.d),0,y.L);d=r.distanceTo(y.at(c,0,0))>=70&&(!s.path||s.path.distanceTo(r.x,r.y,r.z)>=70)&&h-60>It+yt(o,i.x+Math.cos(f)*(K+36),i.z+Math.sin(f)*(K+36))}if(!(!d||W(i.x,i.z,h,K))){b.push({x:i.x,z:i.z,R:K,h,flat:C,w:g.sign()*g.range(7,11)/K,a0:g.range(0,et),upCable:w,side:E});break}}const B=[],v={coveys:Y.length,nearRoad:0,dealt:0,refused:0,noneToTake:0,dealLeast:1/0};{const t=[],l=[],w=new R.Vector3,E=u.U.uBend.value,K=E.clone(),C=[],n=[];if(s.roadTable){const e=s.roadTable;for(let f=0;f*3<e.road.length;f+=2)t.push(e.road[f*3],e.road[f*3+1],e.road[f*3+2]),l.push(e.bends[f*4],e.bends[f*4+1],e.bends[f*4+2],e.bends[f*4+3])}let i=1,h=0;const d=(e,f,c)=>{let M=1/0,p=1/0,x=-1/0,S=0,k=C[0],J=1/0;for(let F=0;F<n.length;F+=3){const H=n[F]*i+n[F+2]*h;p=Math.min(p,H),x=Math.max(x,H),S=Math.max(S,Math.abs(n[F]*h-n[F+2]*i))}const lt=F=>{const H=t[F*3]-e.x,st=t[F*3+2]-e.z,at=mt(H*i+st*h,p,x);return Math.hypot(H-at*i,st-at*h)-S};for(const F of C){const H=lt(F);H<J&&(J=H,k=F)}const ht=Math.max(nt.keep+nt.dealOver,v.dealLeast);for(let F=-1;F<C.length;F++){const H=F<0?k:C[F];if(F>=0&&(H===k||lt(H)>=Math.min(Math.sqrt(M),ht)))continue;E.set(l[H*4],l[H*4+1],l[H*4+2],l[H*4+3]);const st=t[H*3],at=t[H*3+1],vt=t[H*3+2];for(let it=0;it<n.length;it+=3){const xt=e.x+n[it],zt=e.z+n[it+2],St=u.drop(xt,zt),bt=xt-st,kt=zt-vt,Tt=bt*bt+kt*kt;for(const Nt of[f,c]){const Mt=Nt+n[it+1]-St-at,At=Tt+Mt*Mt;At<M&&(M=At)}}}return Math.sqrt(M)},r=(e,f)=>{const c=Math.hypot(e.x,e.z)||1,M=e.x/c,p=e.z/c;n.length=0,i=M,h=p;for(let x=0;x<=8;x++)for(let S=-1;S<=1;S++){const k=x/8;f?n.push(e.x+(M*1.5*S-e.x)*k,3.6+(11+.3*S-3.6)*k,e.z+(p*1.5*S-e.z)*k):n.push(e.x*(1+2.6*k)+M*3*S*k,3.6+(13+3*e.y)*k*(2-k)+.45*S*k,e.z*(1+2.6*k)+p*3*S*k)}if(f)for(let x=0;x<=8;x++)n.push(e.x+M*20*(x/8),3.6+10*(x/8),e.z+p*20*(x/8))};Y.forEach(e=>{let f=!0,c=0,M=0;if(C.length=0,e.off<150){for(let p=0;p*3<t.length;p++)Math.hypot(t[p*3]-e.x,t[p*3+2]-e.z)<125&&C.push(p);c=1/0,M=-1/0;for(let p=0;p<12;p++){const x=u.roof(e.x,e.z,p*1.9);c=Math.min(c,x),M=Math.max(M,x)}}C.length&&v.nearRoad++;for(let p=0;p<N;p++){const x=O.range(0,et),S=O.range(9,24),k={cv:e,x:Math.cos(x)*S,y:O.range(-1,1),z:Math.sin(x)*S,ph:O(),taken:!1};if(v.dealt++,C.length){let J=1/0;if(f&&(r(k,!0),J=d(e,c,M),k.taken=J>=nt.keep+nt.dealOver),!k.taken&&(r(k,!1),J=d(e,c,M),J<nt.keep+nt.dealOver)){v.refused++;continue}v.dealLeast=Math.min(v.dealLeast,J)}else k.taken=f;k.taken&&(f=!1),B.push(k)}f&&v.noneToTake++}),E.copy(K),v.dealLeast=Math.round(v.dealLeast*100)/100}const m=a*A+B.length+V.length+b.length*z;{const t=[[0,-.5],[.17,-.17],[.17,.2],[0,.5]],l=q.count;q.set("aWg",0,0);for(const[w,E]of t)for(let K=0;K<=4;K++){const C=K/4*et;q.v(Math.cos(C)*w,Math.sin(C)*w*.85,E,Math.cos(C),Math.sin(C),0)}q.stitch(l,t.length,4,!0)}for(const t of[-1,1]){const l=[[.1,-.22,0],[.75,-.3,.6],[1.3,.05,1],[.7,.28,.6],[.1,.2,0]].map(([w,E,K])=>(q.set("aWg",t,K),q.v(t*w,.05,E,0,1,0)));q.tri(l[0],l[1],l[4]),q.tri(l[1],l[3],l[4]),q.tri(l[1],l[2],l[3])}const X=q.geometry(),Q=new R.InstancedBufferGeometry;Q.instanceCount=m;for(const t of["position","normal","aWg"])Q.setAttribute(t,X.getAttribute(t));Q.setIndex(X.getIndex());const Z=new Float32Array(m*4),D=new Float32Array(m*4),j=new Float32Array(m*4),G=[];for(let t=0;t<a;t++){const l=T.range(150,260),w=T.range(.6,.95),E=T.range(0,et),K=T.range(l+o.r+30,900),C=o.x+Math.cos(E)*K,n=o.z+Math.sin(E)*K,i=T.sign()*T.range(11,16)/l,h=It+T.range(18,26),d=T.range(0,et);G.push({x:C,z:n,R:l,h});for(let r=0;r<A;r++){const e=(t*A+r)*4;Z.set([T.gauss()*20,T.gauss()*2.5,T.gauss()*20,T()],e),D.set([C,n,l,i],e),j.set([h,d,0,w],e)}}B.forEach((t,l)=>{const w=(a*A+l)*4;Z.set([t.x,t.y,t.z,t.ph],w),D.set([t.cv.x,t.cv.z,nt.rounds*t.cv.round,t.cv.ph],w),j.set([0,0,0,t.taken?-2:-1],w)}),V.forEach((t,l)=>{const w=(a*A+B.length+l)*4;Z.set([0,0,0,P()],w),D.set([t.x,t.z,t.round,t.ph],w),j.set([0,0,0,-3],w)}),b.forEach((t,l)=>{for(let w=0;w<z;w++){const E=(a*A+B.length+V.length+l*z+w)*4,K=g.range(0,et),C=22*Math.sqrt(g());Z.set([Math.cos(K)*C,g.range(-8,8),Math.sin(K)*C,g()],E),D.set([t.x,t.z,t.R,t.w],E),j.set([t.h,t.a0+g.range(-.5,.5),1.5,t.flat],E)}}),Q.setAttribute("aB0",new R.InstancedBufferAttribute(Z,4)),Q.setAttribute("aB1",new R.InstancedBufferAttribute(D,4)),Q.setAttribute("aB2",new R.InstancedBufferAttribute(j,4)),ut(Q,0,30,-250,1400);const $=new R.Mesh(Q,new R.ShaderMaterial({uniforms:pt(u.U),vertexShader:Vt,fragmentShader:Dt,side:R.DoubleSide,fog:!1}));return $.name="seed-birds",$.frustumCulled=!1,{object:$,triangles:q.triangles*m,rounds:G,highRounds:b,coveys:v,first:{covey:a*A,coveyBirds:B.length}}}export{nt as COVEY,Gt as makeBirds,jt as makeKites,Ft as makeRooted,Ht as makeTraps};
