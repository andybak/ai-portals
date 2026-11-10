import*as k from"three";import{clamp as ae,lerp as _,smoothstep as D,makeNoise as dt,makeRng as ut,hashSeed as $e}from"../kit/core.js";const Ge=2.6,pt=[["straight",60],["bend",-35,45],["straight",30],["bend",40,45],["straight",20],["bend",47,55],["straight",45],["bend",-30,60],["straight",32],["bend",-80,40],["straight",90]],qe=[[62,0],[90,-.9],[132,1.3],[164,.3],[214,2.9],[266,.3],[306,-.3],[350,.5],[392,.3]],se=Math.PI/180;function Fe(r,e=qe){const t=e.length;if(r<=e[0][0])return e[0][1];if(r>=e[t-1][0])return e[t-1][1];let m=0;for(;r>e[m+1][0];)m++;return _(e[m][1],e[m+1][1],D(e[m][0],e[m+1][0],r))}function Ce(r=pt,e=qe){const t=[];let m=0,s=0,H=0,A=0;for(const[o,f,u]of r)if(o==="straight"){const R=f;t.push({s0:A,len:R,x:m,z:s,b:H,kap:0}),m+=Math.sin(H)*R,s-=Math.cos(H)*R,A+=R}else{const R=u,y=Math.sign(f)/R,x=Math.abs(f)*se*R,b=m+Math.cos(H)/y,a=s+Math.sin(H)/y;t.push({s0:A,len:x,x:m,z:s,b:H,kap:y,cx:b,cz:a}),H+=y*x,m=b-Math.cos(H)/y,s=a-Math.sin(H)/y,A+=x}const C=A,B=t.length-1,T=(o,f=0,u=[0,0,0])=>{let R=0;for(;R<B&&o>t[R].s0+t[R].len;)R++;const y=t[R],x=o-y.s0;let b,a,i=y.b;return y.kap===0?(b=y.x+Math.sin(y.b)*x,a=y.z-Math.cos(y.b)*x):(i=y.b+y.kap*x,b=y.cx-Math.cos(i)/y.kap,a=y.cz-Math.sin(i)/y.kap),u[0]=b+Math.cos(i)*f,u[1]=a+Math.sin(i)*f,u[2]=i,u},W=(o,f,u={s:0,d:0})=>{let R=1/0;for(let y=0;y<=B;y++){const x=t[y];let b,a,i,c=x.b;if(x.kap===0)b=(o-x.x)*Math.sin(x.b)-(f-x.z)*Math.cos(x.b),b=ae(b,y===0?-4e3:0,y===B?6e3:x.len),a=x.x+Math.sin(x.b)*b,i=x.z-Math.cos(x.b)*b;else{const N=Math.sign(x.kap);let E=Math.atan2(-N*(f-x.cz),-N*(o-x.cx))-x.b;E=Math.atan2(Math.sin(E),Math.cos(E)),b=ae(E/x.kap,0,x.len),c=x.b+x.kap*b,a=x.cx-Math.cos(c)/x.kap,i=x.cz-Math.sin(c)/x.kap}const d=(o-a)**2+(f-i)**2;d<R&&(R=d,u.s=x.s0+b,u.d=(o-a)*Math.cos(c)+(f-i)*Math.sin(c))}return u},w=[],g=[];for(const o of t)w.push(new k.Vector4(o.x,o.z,o.b,o.len)),g.push(new k.Vector4(o.kap,o.s0,o.cx||0,o.cz||0));const h=o=>Fe(o,e),l=o=>Fe(o+.5,e)-Fe(o-.5,e),M=o=>{let f=0;for(;f<B&&o>t[f].s0+t[f].len;)f++;return o<0||o>C?0:t[f].kap},n=o=>t[o].s0+t[o].len;return{segs:t,L:C,at:T,locate:W,segA:w,segB:g,n:t.length,yAt:h,slopeAt:l,kapAt:M,knot:n}}const mt=`
uniform vec4 uSegA[NSEG]; uniform vec4 uSegB[NSEG];
vec4 roadSD(vec2 p){
  float best = 1e12; vec4 res = vec4(0.);
  for (int i = 0; i < NSEG; i++) {
    vec4 A = uSegA[i], B = uSegB[i]; float t, bb = A.z; vec2 q;
    if (B.x == 0.) {
      t = (p.x - A.x) * sin(A.z) - (p.y - A.y) * cos(A.z);
      t = clamp(t, i == 0 ? -4000. : 0., i == NSEG - 1 ? 6000. : A.w);
      q = A.xy + vec2(sin(A.z), -cos(A.z)) * t;
    } else {
      float sg = sign(B.x); vec2 v = -sg * (p - B.zw);
      float db = atan(v.y, v.x + sign(v.x + 1e-9) * 1e-7) - A.z;
      db = atan(sin(db), cos(db) + 1e-9); t = clamp(db / B.x, 0., A.w);
      bb = A.z + B.x * t; q = B.zw - vec2(cos(bb), sin(bb)) / B.x;
    }
    vec2 e = p - q; float dd = dot(e, e);
    if (dd < best) { best = dd; res = vec4(B.y + t, dot(e, vec2(cos(bb), sin(bb))), e); }
  }
  return res;
}`,we=-56,Be=520,ce=256,Ne=80,Ee={bearing:2,up:9,size:6},Pt={bearing:145,up:42},be={bearing:-58,full:55,none:70,top:13,star:16,starBearing:-80},ye={from:75,peak:85,to:105},G=(r,e=1)=>{const t=new k.Color(r);return[t.r*e,t.g*e,t.b*e]},Me=(r,e=0)=>{const t=r*se,m=e*se;return[Math.sin(t)*Math.cos(m),Math.sin(m),-Math.cos(t)*Math.cos(m)]},vt=(()=>{const r=Ce(),e=Qe(r),t=m=>r.locate(m[0],m[1]).s;return{entry:0,gate:e.gate,posts:e.posts,wagon:e.wagon,crest:e.crest,alder:t(e.alder),shoreEnd:e.shore[1],post4:e.fence4[0],culvert:e.culvert,oak:t(e.oak),floodHead:t(e.floodR),elm:t(e.elmXZ[1])}})(),ee=vt,wt=[[ee.gate,ee.posts],[ee.wagon,ee.crest],[ee.alder,ee.post4],[ee.culvert,ee.oak],[ee.floodHead,ee.elm]],ie={key:[G("#fff3dc",1.02),G("#ffc56a",1),G("#ffc8a4",.85),G("#8f9aee",.9),G("#c9d6e8",1.45),G("#c9d6e8",1.35)],fill:[G("#b4cde6",.5),G("#a888c8",.34),G("#a868b0",.42),G("#6474d0",.62),G("#4a62b6",.62),G("#445aac",.6)],shade:[G("#8a9a84",.34),G("#7a4a50",.2),G("#6a3858",.24),G("#2a3470",.22),G("#1c2a60",.18),G("#1a2656",.17)],fog:[G("#b4d0ea",1),G("#eebc74",.95),G("#d0745c",.8),G("#44549e",.7),G("#1c2a5c",.75),G("#17234e",.75)],reach:[1400,900,800,420,600,1500],top:[G("#3878d2",1),G("#a08e9c",.95),G("#3a2f7c",.85),G("#1c2868",1),G("#131f48",1.8),G("#0f183c",1.9)],low:[G("#a9cdee",1.05),G("#f7a83e",1.12),G("#ee6c3c",1),G("#4656a8",1),G("#2c3f86",1.25),G("#243474",1.25)],disc:[G("#fff6e4",9),G("#ffe2a8",8),G("#f0602c",5.5),G("#e2552a",5),G("#e2552a",5),G("#e2552a",5)],dew:[0,0,.1,1,.8,.5],mist:[0,0,.1,1,.42,.08],cumulus:[1,.25,.1,0,0,0],bands:[0,.9,1,.5,0,0]},gt=[[ee.entry,48],[ee.gate,34],[ee.posts,20],[ee.wagon,10],[ee.crest,3],[ee.alder,0],[ee.shoreEnd,-3],[ee.culvert,-6]];function _e(r){const e=gt,t=e.length;if(r<=e[0][0])return e[0][1];if(r>=e[t-1][0])return e[t-1][1];let m=0;for(;r>e[m+1][0];)m++;const s=W=>(e[W+1][1]-e[W][1])/(e[W+1][0]-e[W][0]),H=W=>W<=0||W>=t-1?0:2*s(W-1)*s(W)/(s(W-1)+s(W)),A=e[m+1][0]-e[m][0],C=(r-e[m][0])/A,B=C*C,T=B*C;return(2*T-3*B+1)*e[m][1]+(T-2*B+C)*A*H(m)+(-2*T+3*B)*e[m+1][1]+(T-B)*A*H(m+1)}const Ke=r=>D(-6,3,r),Ye=r=>D(ee.alder,ee.shoreEnd,r)*(1-D(ee.shoreEnd,ee.floodHead,r)),Pe=r=>{let e=0;for(const[t,m]of wt)e+=D(t,m,r);return e};function xt(r,e={}){const t=new Float32Array(ce*8*4),m=Me(Ee.bearing,Ee.up),s=(T,W)=>{const w=Math.min(4,Math.floor(W)),g=W-w,h=T[w],l=T[w+1];return typeof h=="number"?_(h,l,g):[_(h[0],l[0],g),_(h[1],l[1],g),_(h[2],l[2],g)]};for(let T=0;T<ce;T++){const W=we+(Be-we)*(T+.5)/ce,w=Pe(W),g=_e(W),h=Ke(g),l=(a,i,c)=>{const d=(a*ce+T)*4;t[d]=i[0],t[d+1]=i[1],t[d+2]=i[2],t[d+3]=c},M=Me(Ne,Math.max(g,2)),n=1-D(2,3,w),o=D(3,4,w),f=1-n-o,u=[M[0]*n+m[0]*o,M[1]*n+m[1]*o+f,M[2]*n+m[2]*o],R=Math.hypot(u[0],u[1],u[2])||1;l(0,s(ie.key,w),g*se),l(1,[u[0]/R,u[1]/R,u[2]/R],h),l(2,s(ie.fill,w),Ye(W)),l(3,s(ie.shade,w),s(ie.dew,w));const y=Math.min(4,Math.floor(w)),x=y+D(0,.7,w-y),b=y+D(.3,1,w-y);l(4,s(ie.fog,w),1/s(ie.reach,w)),l(5,s(ie.top,b),s(ie.mist,w)),l(6,s(ie.low,x),s(ie.cumulus,w)),l(7,s(ie.disc,w),s(ie.bands,w))}const H=new Uint16Array(t.length);for(let T=0;T<t.length;T++)H[T]=k.DataUtils.toHalfFloat(t[T]);const A=new k.DataTexture(H,ce,8,k.RGBAFormat,k.HalfFloatType);A.magFilter=A.minFilter=k.LinearFilter,A.wrapS=A.wrapT=k.ClampToEdgeWrapping,A.needsUpdate=!0;const C=(T,W,w=[0,0,0,0])=>{const g=ae((W-we)/(Be-we)*ce-.5,0,ce-1),h=Math.min(ce-2,Math.floor(g)),l=g-h,M=(T*ce+h)*4;for(let n=0;n<4;n++)w[n]=_(t[M+n],t[M+4+n],l);return w};return{data:t,tHours:A,row:C,setEye:(T,W)=>{const w=[0,0,0,0];for(let g=0;g<8;g++)C(g,W,w),T.uRow.value[g].set(w[0],w[1],w[2],w[3])},sunHeight:_e,veilOf:Ke,duskOf:Ye,hourAt:Pe}}const je={n:160,half:800};async function bt(r,e,t={}){const m=t.fixedS!==void 0?2:je.n,s=je.half,H=r.at(r.L/2),A=H[0],C=H[1],B=new Float32Array(m*m),T=[],W=[0,0,0];if(t.fixedS!==void 0)B.fill(t.fixedS);else{for(let i=-400;i<=r.L+600;i+=5)r.at(i,0,W),T.push(W[0],W[1],i);for(let i=0;i<m;i++){const c=C-s+(i+.5)/m*2*s;for(let d=0;d<m;d++){const N=A-s+(d+.5)/m*2*s;let E=0,K=0;for(let V=0;V<T.length;V+=3){const U=N-T[V],O=c-T[V+1],q=U*U+O*O+36,j=1/(q*q*q);E+=j,K+=j*T[V+2]}B[i*m+d]=K/E}i%8===7&&e&&await e()}}const w=new Uint16Array(m*m);for(let i=0;i<m*m;i++)w[i]=k.DataUtils.toHalfFloat(B[i]);const g=new k.DataTexture(w,m,m,k.RedFormat,k.HalfFloatType);g.magFilter=g.minFilter=k.LinearFilter,g.wrapS=g.wrapT=k.ClampToEdgeWrapping,g.needsUpdate=!0;const h=new k.Vector4(A-s,C-s,1/(2*s),1/(2*s));let l=0,M=1,n=0,o=1,f=2,u=2,R=new Float32Array([20,20,20,20]);if(t.fixedS===void 0){l=1e9,M=-1e9,n=1e9,o=-1e9;for(let c=0;c<=r.L;c+=4)r.at(c,0,W),l=Math.min(l,W[0]),M=Math.max(M,W[0]),n=Math.min(n,W[1]),o=Math.max(o,W[1]);l-=14,M+=14,n-=14,o+=14,f=Math.ceil((M-l)/2),u=Math.ceil((o-n)/2),R=new Float32Array(f*u);const i={s:0,d:0};for(let c=0;c<u;c++){for(let d=0;d<f;d++)r.locate(l+(d+.5)/f*(M-l),n+(c+.5)/u*(o-n),i),R[c*f+d]=Math.min(20,Math.abs(i.d));c%40===39&&e&&await e()}}const y=new Uint16Array(R.length);for(let i=0;i<R.length;i++)y[i]=k.DataUtils.toHalfFloat(R[i]);const x=new k.DataTexture(y,f,u,k.RedFormat,k.HalfFloatType);x.magFilter=x.minFilter=k.LinearFilter,x.wrapS=x.wrapT=k.ClampToEdgeWrapping,x.needsUpdate=!0;const b=new k.Vector4(l,n,1/(M-l),1/(o-n));return{tex:g,box:h,smapAt:(i,c)=>{const d=ae((i-h.x)*h.z*m-.5,0,m-1),N=ae((c-h.y)*h.w*m-.5,0,m-1),E=Math.min(m-2,Math.floor(d)),K=Math.min(m-2,Math.floor(N)),V=d-E,U=N-K,O=K*m+E;return _(_(B[O],B[O+1],V),_(B[O+m],B[O+m+1],V),U)},corr:x,corrBox:b,dispose(){g.dispose(),x.dispose()}}}const ke=40,ge=-.8,Ae=-.9,Ze=.3;function yt(r,e){const t=[],m=[],s=[];for(let H=0;H<8;H++)t.push(new k.Vector4);for(let H=0;H<ke;H++)m.push(new k.Vector4(0,0,1,0)),s.push(new k.Vector4(0,0,0,0));return{tHours:{value:r.tHours},tSmap:{value:e.tex},uSmapBox:{value:e.box},uTime:{value:0},uRow:{value:t},uLamp0:{value:new k.Vector4(0,-50,0,0)},uLamp1:{value:new k.Vector4(0,-50,0,0)},uWind:{value:new k.Vector4(.8,.6,1,6)},uPair:{value:new k.Vector4(1e5,1e5,0,-1)},uPairK:{value:new k.Vector4(0,0,0,0)},tCorr:{value:e.corr},uCorrBox:{value:e.corrBox},uMistSeed:{value:new k.Vector2(0,0)},uCastA:{value:m},uCastB:{value:s},uLast:{value:new k.Vector4(1e5,Ze,Ae,ge)},uBankPh:{value:new k.Vector4(0,0,0,0)}}}const Ie=r=>.6*Math.sin(r)+.4*Math.sin(r*2.3+1.7),Mt=(r,e,t)=>11.5+1.5*Ie(r*.09+e*2.1+t[0]),kt=(r,e,t)=>4.8+1.2*Ie(r*.13+e*4.7+t[1]),He=G("#ffb347",1),At=G("#f3d9c2",.16),de=r=>`vec3(${r[0].toFixed(4)}, ${r[1].toFixed(4)}, ${r[2].toFixed(4)})`,Rt=Me(be.bearing,6),Xe=Me(ye.peak,4),Re=`
uniform sampler2D tHours, tSmap, tCorr; uniform vec4 uSmapBox, uLamp0, uLamp1, uWind, uCorrBox, uLast, uBankPh; uniform float uTime; uniform vec2 uMistSeed;
uniform vec4 uRow[8];
float hourS(vec2 xz){ return textureLod(tSmap, clamp((xz - uSmapBox.xy) * uSmapBox.zw, 0., 1.), 0.).r; }
vec4 hourRow(float k, float s){ return textureLod(tHours, vec2(clamp((s - (${we}.)) / ${Be-we}., .002, .998), (k + .5) / 8.), 0.); }
float standDew(float s){ return hourRow(3., s).a; }
float standMist(float s){ return hourRow(5., s).a; }
float lineDist(vec2 xz){ return textureLod(tCorr, clamp((xz - uCorrBox.xy) * uCorrBox.zw, 0., 1.), 0.).r; }
float hHash(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
float hNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hHash(i), hHash(i + vec2(1., 0.)), f.x), mix(hHash(i + vec2(0., 1.)), hHash(i + vec2(1., 1.)), f.x), f.y); }
// the wind's long waves: 0..1, travelling along uWind.xy at uWind.w metres a second, uWind.z scales their length
float hourGust(vec2 xz){ float a = dot(xz, uWind.xy) - uTime * uWind.w; return .5 + .5 * sin(a * (6.2832 / (55. * uWind.z)) + 1.7 * sin(dot(xz, vec2(-uWind.y, uWind.x)) * .021)); }
vec3 lampOne(vec4 lamp, vec3 wp, vec3 N){ vec3 d = lamp.xyz - wp; float r2 = dot(d, d);
  float nl = clamp(dot(N, d) / sqrt(max(r2, 1e-4)) * .6 + .4, 0., 1.);
  return ${de(He)} * (lamp.w * .5 * nl * (1. - smoothstep(20., 81., r2)) / (1. + r2 * .12)); }
vec3 lampLight(vec3 wp, vec3 N){ return lampOne(uLamp0, wp, N) + lampOne(uLamp1, wp, N); }
// small clouds' shadows drifting over the land with the wind (as many as the row's cumulus figure)
float cloudShade(vec2 xz){ float cu = uRow[6].a; if (cu < .01) return 1.;
  vec2 p = xz / 85. - uTime * uWind.xy * .06 + uMistSeed * .37; float n = hNoise(p) * .6 + hNoise(p * 2.3 + 5.) * .3 + hNoise(p * 5.1) * .1;
  return 1. - .45 * cu * smoothstep(.52, .68, n); }
// the first light's pearl on a face turned to it (a far light of one strength; the day's veil outshines it)
vec3 firstLight(vec3 N){ return ${de(At)} * ((1. - uRow[1].a) * clamp(dot(N, ${de(Rt)}) * .7 + .3, 0., 1.)); }
vec3 hourShade0(vec3 alb, vec3 N, vec3 wp, float ao, float sun){
  vec3 L = normalize(uRow[1].xyz + vec3(0., 1e-3, 0.));
  // by night a thing keeps little of its own colour
  alb = mix(alb, vec3(dot(alb, vec3(.3, .55, .15))) * vec3(.72, 1., 1.1), (1. - uRow[1].a) * .58);
  float nl = clamp(dot(N, L), 0., 1.);
  vec3 amb = mix(uRow[3].rgb, uRow[2].rgb, clamp(N.y * .5 + .5, 0., 1.));
  vec3 c = alb * (uRow[0].rgb * (nl * sun * cloudShade(wp.xz)) + amb * ao);
  // the afterglow's thin light on the side toward where the sun went down (its strength is the row's)
  float ag = clamp(dot(N, ${de(Xe)}) * .6 + .4, 0., 1.);
  c += alb * vec3(.5, .6, .26) * (uRow[2].a * ag * ag * .55);
  return c + alb * firstLight(N);
}
vec3 hourShade(vec3 alb, vec3 N, vec3 wp, float ao, float sun){ return hourShade0(alb, N, wp, ao, sun) + alb * lampLight(wp, N); }
// A SHADE UNDER A LOW SUN IS LIT BY THE WHOLE SKY: the row's fill (the sky's top) and its low band alike, at the fill's own strength,
// and greyed by four tenths (what the ground gives back). It keeps the brightness the shade has and changes its hue only, by w (how
// deep in shade), by the day's veil and by the row's sun: whole while the sun stands 3 degrees up or lower, nothing from 10 up. So
// under a high sun and by night nothing changes; under the low sun a shade is a warm brown violet, never the fill's purple alone.
vec3 skyShade(vec3 c, vec3 alb, float w){
  const vec3 LW = vec3(.2126, .7152, .0722);
  vec3 sk = mix(uRow[2].rgb, uRow[6].rgb * (dot(uRow[2].rgb, LW) / max(dot(uRow[6].rgb, LW), 1e-4)), .5);
  sk = alb * mix(sk, vec3(dot(sk, LW)), .4);
  return mix(c, sk * (dot(c, LW) / max(dot(sk, LW), 1e-5)), clamp(w, 0., 1.) * uRow[1].a * (1. - smoothstep(${(3*se).toFixed(4)}, ${(10*se).toFixed(4)}, uRow[0].a)));
}
`,Wt=`
// (a size of the field, lam metres, under a footprint of w metres: whole while the footprint is smaller, its mean from four times it)
float mistKeep(float lam, float w){ return 1. - smoothstep(lam, lam * 4., w); }
float meadowMist(vec3 ro, vec3 rd, float dist, float pa){
  float t0 = 0., t1 = dist;
  if (abs(rd.y) > 1e-4) { float ta = (4.1 - ro.y) / rd.y, tb = (-.5 - ro.y) / rd.y; t0 = max(0., min(ta, tb)); t1 = min(dist, max(ta, tb)); }
  else if (ro.y > 4.1) return 0.;
  if (t1 <= t0) return 0.;
  float L = min(t1 - t0, 200.), tau = 0.;
  for (int i = 0; i < 8; i++) {
    float f = (float(i) + .5) / 8., t = t0 + L * f * f, dt = L * f * .25;
    vec3 q = ro + rd * t;
    float m = standMist(hourS(q.xz)); if (m < .01) continue;
    float w = max(pa * t, dt * .5), k26 = mistKeep(26., w);
    vec2 p = q.xz + uMistSeed + uTime * vec2(.22, .08);
    float n = .5 + (hNoise(p / 26.) - .5) * .42 * k26 + (hNoise(p / 11.) - .5) * .38 * mistKeep(11., w) + (hNoise(p / 4.3) - .5) * .2 * mistKeep(4.3, w) + .106 * (1. - k26);
    // A FEW CLEAR HEAPS WITH CLEAR AIR BETWEEN: the mist stands only where the field is well over its middle (about a third of the
    // ground, its thick heart a sixth), thicker there; between the heaps the ground is seen plainly. (Where a footprint holds the whole
    // field the figure goes to the heaps' own mean share.)
    float isl = smoothstep(.56, .72, n), top = (.6 + 3.3 * m) * isl * mix(.42, 1., smoothstep(10., 19., lineDist(q.xz)));
    float v = 1. - clamp((q.y + .2) / max(top, .05), 0., 1.);
    tau += dt * .22 * smoothstep(0., .3, m) * isl * v * v;
  }
  return tau;
}
float bankWob(float t){ return .6 * sin(t) + .4 * sin(t * 2.3 + 1.7); }
// the ground of the last road at a place: the bank's top, its side, the flood (the same law the ground is built by)
float bankGround(float s, float ad, float side){
  float e = 11.5 + 1.5 * bankWob(s * .09 + side * 2.1 + uBankPh.x), run = 4.8 + 1.2 * bankWob(s * .13 + side * 4.7 + uBankPh.y);
  return mix(uLast.y, uLast.z, smoothstep(e - run, e, ad));
}
// the low mist's depth of fog over a face at wp: nothing before the flood begins, nothing inside the rails
float lowMist(vec3 wp, float onGround, float w){
  float s = hourS(wp.xz), zone = smoothstep(uLast.x - 4., uLast.x + 14., s);
  if (zone < .004) return 0.;
  float ad = lineDist(wp.xz), g = mix(bankGround(s, ad, 0.), wp.y, onGround);
  vec2 p = wp.xz + uMistSeed * 3.1 + uTime * vec2(.11, .05);
  float k31 = mistKeep(31., w), n = .5 + (hNoise(p / 31.) - .5) * .4 * k31 + (hNoise(p / 12.) - .5) * .4 * mistKeep(12., w) + (hNoise(p / 4.7) - .5) * .2 * mistKeep(4.7, w) + .045 * (1. - k31);
  float deep = .3 + .5 * mix(.5, hNoise(p / 19. + 7.3), mistKeep(19., w));
  float onWater = smoothstep(11., 15., ad), island = smoothstep(mix(.5, .5, onWater), mix(.66, .72, onWater), n) * smoothstep(3.2, 5.2, ad);
  // (it keeps to the flood and the bank's wet foot: none on ground 0.8 m and more over the flood's level, so the bank's top is grass)
  float foot = 1. - smoothstep(uLast.z + .3, uLast.z + .8, mix(bankGround(s, ad, 0.), wp.y, onGround));
  return zone * island * foot * clamp((g + deep - wp.y) / max(deep, .05), 0., 1.) * deep;
}
vec3 hourMist(vec3 c, vec3 wp, float onGround){
  vec3 rd = wp - cameraPosition; float dist = length(rd); rd /= max(dist, 1e-4);
  // the pixel's own angle, and its footprint on the face it shows (taken here, before any branch)
  float pa = length(fwidth(rd)), fw = length(fwidth(wp.xz));
  float tau = meadowMist(cameraPosition, rd, dist, pa);
  tau += min(lowMist(wp, onGround, fw) * .34 / max(abs(rd.y), .1), .8) * smoothstep(.6, 2.5, dist);
  if (tau < 1e-4) return c;
  vec3 mc = (uRow[2].rgb * 1.5 + uRow[0].rgb * mix(.5, .3, 1. - uRow[1].a) + uRow[4].rgb * .3) * mix(1., .66, 1. - uRow[1].a) + firstLight(vec3(0., .5, -.5)) * 1.5;
  return mix(mc, c, exp(-tau));
}
vec3 hourFog(vec3 c, vec3 wp){ return hourMist(mix(uRow[4].rgb, c, exp(-distance(wp, cameraPosition) * uRow[4].a)), wp, 0.); }
vec3 hourFogGround(vec3 c, vec3 wp){ return hourMist(mix(uRow[4].rgb, c, exp(-distance(wp, cameraPosition) * uRow[4].a)), wp, 1.); }
`,Te=Re+Wt,Oe=`
uniform vec4 uCastA[${ke}], uCastB[${ke}];
float castShade(vec3 wp, vec3 L){
  float lh = length(L.xz); if (lh < .05) return 1.;
  vec2 ld = L.xz / lh; float tanEl = L.y / lh, sh = 1.;
  for (int i = 0; i < ${ke}; i++) {
    vec4 A = uCastA[i], B = uCastB[i]; vec2 e = A.xy - wp.xz;
    float al = dot(e, ld), ac = abs(e.x * ld.y - e.y * ld.x), hy = wp.y + al * tanEl, soft = A.z * .3 + .3 + al * .025;
    float k = (1. - smoothstep(A.z - soft, A.z + soft, ac)) * smoothstep(-A.z * .5, A.z * .5, al) * smoothstep(B.x - soft, B.x + soft, hy) * (1. - smoothstep(B.y - soft * 2., B.y + soft, hy));
    sh *= 1. - B.z * k;
  }
  return sh;
}`;function Qe(r){const e=C=>r.knot(C),t=(C,B=0)=>{const T=r.at(C,B);return[T[0],T[1]]},m=C=>[Math.sin(C*se),-Math.cos(C*se)],s={bend1:e(0),bend1End:e(1),bend2:e(2),bend2End:e(3),bend3:e(4),crest:e(5),bend4:e(6),bend4End:e(7),bend5:e(8),bendEnd:e(9),ring:r.L,gate:62,picketL:[14,84],wallR:[16,58],wallBack:16,washing:[46,58,26],hens:[20,55],posts:106,wallL:[140,172],wagon:164,railR:[92,150],reapedR:[150,205],spit:246,shore:[234,282],fence4:[290,318],culvert:306,floodHead:366,ringC:[-9,-50],ringR:4.5,porch:[-16.3,-63.9],schoolBack:[-29,-72],pump:[-13,-58],mapleA:[-11,-38],mapleB:[10,-30],mapleC:[-31,-66],mapleD:[-22,-46],whiteHouse:[34,-52],village:[-68,-94],meeting:[-118,-138],barn:[-80,-182],barnHalf:12,barnWide:7,silo:[-74,-196],lane:[[-58,-140],[-92,-172]],ridgeBearing:142,alder:[25,-201],headS:228,headD:30,shoreD:8,deer:[[19,-276],[17,-282]],carr:[[-4,-236],[4,-264],[10,-292],[22,-316],[33,-325]],rise:[37.4,-301.9],riseBearing:-18,cornice:[42,-287.6],oak:[45.5,-300.6],elms:[[398,25],[410,33],[444,-22],[486,-28],[540,-36],[548,-39],[566,85],[575,90],[585,90]]},H=t(s.crest),A=r.at(s.crest)[2];return s.C=H,s.fwd=[Math.sin(A),-Math.cos(A)],s.rgt=m(s.ridgeBearing),s.head=t(s.headS,s.headD),s.shoreOff=t(s.shore[1],s.shoreD),s.dirNear=m(62),s.dirFar=m(100),s.dirSun=m(Ne),s.end=t(s.bendEnd),s.last=m(r.at(s.bendEnd+1)[2]/se),s.floodR=t(s.floodHead,11.5),s.gateP=t(s.posts),s.gateDir=m(r.at(s.posts)[2]/se),s.elmXZ=s.elms.map(([C,B])=>t(C,B)),s.riseAxis=m(s.riseBearing),s}function zt(r,e,t){const m=t.noise,s={s:0,d:0},H=[0,0,0],A=t.gaps||[],C=t.bankPh||[0,0],B=t.swell||[0,0],T=v=>{let S=0;for(const[p,L]of A)S=Math.max(S,D(p-2,p+1.5,v)*(1-D(p+L-1.5,p+L+2,v)));return S},W=[e.head,[(e.head[0]+r.at(e.shore[0],e.shoreD)[0])/2+2,(e.head[1]+r.at(e.shore[0],e.shoreD)[1])/2-3]];for(let v=e.shore[0];v<=e.shore[1]+1e-6;v+=4)r.at(v,e.shoreD,H),W.push([H[0],H[1]]);W.push([e.shoreOff[0]+e.dirNear[0]*760,e.shoreOff[1]+e.dirNear[1]*760],[e.head[0]+e.dirFar[0]*760,e.head[1]+e.dirFar[1]*760]);const w=(v,S)=>{let p=1e18,L=!1;for(let I=0,P=W.length-1;I<W.length;P=I++){const Y=W[P][0],X=W[P][1],J=W[I][0],te=W[I][1],re=J-Y,ne=te-X,pe=ae(((v-Y)*re+(S-X)*ne)/(re*re+ne*ne),0,1),ze=v-Y-re*pe,Se=S-X-ne*pe;p=Math.min(p,ze*ze+Se*Se),X>S!=te>S&&v<Y+(S-X)/(te-X)*re&&(L=!L)}return(L?1:-1)*Math.sqrt(p)},g=r.at((e.shore[1]+e.floodHead)/2,30),h=[Math.cos(56*se),Math.sin(56*se)],l=(v,S)=>(v-g[0])*h[0]+(S-g[1])*h[1]<0?1:0,M=(v,S,p,L)=>{const I=L[0]-p[0],P=L[1]-p[1],Y=ae(((v-p[0])*I+(S-p[1])*P)/(I*I+P*P),0,1);return Math.hypot(v-p[0]-I*Y,S-p[1]-P*Y)},n=r.at(e.spit-2,e.shoreD-2).slice(0,2),o=[e.alder[0]+(e.alder[0]-n[0])*.12,e.alder[1]+(e.alder[1]-n[1])*.12],f=v=>Math.max(3.2,3.2+(r.yAt(v)-ge)*2.4),u=(v,S,p,L)=>{if(l(v,S)&&L>0)return-30;let I=w(v,S)+1.2*m.n2(v*.11,S*.11);return L>0&&L<14&&p>e.shore[0]&&p<e.shore[1]&&(I+=T(p)*Math.max(0,e.shoreD-f(p))*(1-D(9,14,L))),Math.min(I,M(v,S,n,o)-4.4)},R=(v,S)=>{let p=1e9;for(let L=0;L<e.carr.length-1;L++){const I=e.carr[L],P=e.carr[L+1],Y=P[0]-I[0],X=P[1]-I[1],J=ae(((v-I[0])*Y+(S-I[1])*X)/(Y*Y+X*X),0,1);p=Math.min(p,Math.hypot(v-I[0]-Y*J,S-I[1]-X*J))}return p},y=v=>62+190*D(e.ring-12,e.ring+95,v),x=(v,S,p,L)=>{const I=L<0?-1:1,P=Math.abs(L),Y=I>0?e.floodHead:e.bendEnd,X=Mt(p,I,C);let J=Math.min(P-X,(p-Y)*1.2+2*m.n2(v*.07,S*.07+3.3));if(I<0)J=Math.min(J,y(p)+7*m.n2(v*.02+9.1,S*.02)-P);else{const te=(v-g[0])*h[0]+(S-g[1])*h[1];te>=0&&(J=Math.min(J,-1-te))}return J=Math.min(J,R(v,S)-9),J},b={long:1.7,wander:.14,shore:.79,top:.3,up:Ze-Ae,under:1.6},a=[];for(const[v,S]of e.elmXZ){const p=a.find(L=>Math.hypot(L[0]-v,L[1]-S)<16);p?(p[0]=(p[0]+v)/2,p[1]=(p[1]+S)/2,p[2]=16):a.push([v,S,11])}for(const v of a){r.locate(v[0],v[1],s);const S=r.at(s.s)[2];v[3]=Math.sin(S),v[4]=-Math.cos(S)}let i=.5;for(let v=0,S=0,p=1;v<30;v++)i=(S+p)/2,i*i*(3-2*i)<b.up/(b.up+b.under)?S=i:p=i;const c=(v,S)=>{let p=-9;for(const[L,I,P,Y,X]of a){const J=v-L,te=S-I,re=P*b.top,ne=re+(P*b.shore-re)/i,pe=Math.hypot((J*Y+te*X)/b.long,J*X-te*Y)*(1+b.wander*m.n2(v*.09+5.3,S*.09));pe<ne&&(p=Math.max(p,Ae+b.up-(b.up+b.under)*D(re,ne,pe)))}return p},d=(v,S,p,L)=>{const I=L[0]-p[0],P=L[1]-p[1],Y=ae(((v-p[0])*I+(S-p[1])*P)/(I*I+P*P),0,1);return Math.hypot(v-p[0]-I*Y,S-p[1]-P*Y)},N=[Math.cos(100*se),Math.sin(100*se)],E=(v,S,p,L)=>D(v-p,v+p,L)*(1-D(S-p,S+p,L)),K=(v,S,p={})=>{r.locate(v,S,s);const L=s.s,I=s.d,P=Math.abs(I),Y=(v-e.C[0])*e.fwd[0]+(S-e.C[1])*e.fwd[1],X=(v-e.C[0])*e.rgt[0]+(S-e.C[1])*e.rgt[1],J=u(v,S,L,I),te=L>e.floodHead-30?x(v,S,L,I):-50,re=(v-e.head[0])*N[0]+(S-e.head[1])*N[1],ne=E(e.reapedR[0],e.reapedR[1],1,L)*E(6,40,.6,I),pe=E(e.wallL[0]-2,e.wallL[1]+1,1,L)*E(3.4,36,.8,-I),ze=1-D(20,24,Math.hypot(v-e.barn[0],S-e.barn[1])),Se=1-D(6,9,d(v,S,e.lane[0],e.lane[1])),ht=1-D(40,48,d(v,S,e.village,e.meeting)),Ve=D(e.posts-1.5,e.posts+.5,L),ct=I>0?1-D(4,7,Y):1-D(-1.5,.5,Y),ft=I>0?D(3,9,re)*D(0,4,Y+2):0;p.wheat=Ve*Math.max(ct,ft)*(1-ne)*(1-pe)*(1-ze)*(1-Se)*(1-ht)*(1-D(-3,-1,J))*(1-D(560,640,P));const Ue=D(-1.5,.5,Y)*(I<0?1:0)*(1-D(64,74,P))*Ve;return p.reaped=Math.max(ne,Ue*(1-D(e.shore[1]-12,e.shore[1]-2,L))),p.rough=D(e.shore[1]-8,e.shore[1]+4,L)*(1-D(e.floodHead-6,e.bendEnd,L)),p.paintStub=I<0?Math.max(ne,Ue*(1-D(e.shore[1]+16,e.shore[1]+24,L))):p.reaped,p.paintRough=I<0?D(e.shore[1]-26,e.shore[1]-16,L)*(1-D(e.floodHead-6,e.bendEnd,L)):p.rough,p.s=L,p.d=I,p.ad=P,p.m=Y,p.n=X,p.reach=J,p.flood=te,p.water=Math.max(J,te),p.side=l(v,S),p},V=v=>1-D(0,50,Math.abs(v)),U=v=>_(t.saddle??2.6,t.shoulder??4.9,D(0,v>0?t.shoulderAtR??9:t.shoulderAt??25,Math.abs(v)))*(1-D(90,120,Math.abs(v))),O=(v,S)=>{const p=v-e.rise[0],L=S-e.rise[1],I=p*e.riseAxis[0]+L*e.riseAxis[1],P=p*e.riseAxis[1]-L*e.riseAxis[0],Y=Math.abs(I);let X=2.2*(1-.42*D(9,15,Y));const J=6.2*1.276;if(Y>15){const ne=(Y-15)/J;if(ne>=1)return 0;X*=(1-ne*ne)**2}const te=Math.max(7.9,6.2*X),re=Math.abs(P)/te;return re>=1?0:X*(1-re*re)**2},q=(v,S,p,L,I)=>{const P=V(L),Y=D(e.posts-10,e.posts+12,p)*(1-D(10,60,L))*(1-.7*P*(1-D(90,120,Math.abs(I)))),X=(v-e.head[0])*N[0]+(S-e.head[1])*N[1],J=(v-e.head[0])*e.dirFar[0]+(S-e.head[1])*e.dirFar[1],te=(t.rim??4.2)*D(10,45,X)*(1-D(80,140,X))*D(25,70,J);return Y*(t.swellAmp??2.4)*m.n2((v+B[0])/125,(S+B[1])/125)+U(I)*P+O(v,S)+te},j=-420,z=Math.ceil(r.L+720),F=new Float32Array(z-j+1);for(let v=0;v<F.length;v++){const S=j+v;r.at(S,0,H),F[v]=r.yAt(S)-q(H[0],H[1],S,(H[0]-e.C[0])*e.fwd[0]+(H[1]-e.C[1])*e.fwd[1],(H[0]-e.C[0])*e.rgt[0]+(H[1]-e.C[1])*e.rgt[1])}const $=v=>{const S=ae(v-j,0,F.length-1.001),p=Math.floor(S);return _(F[p],F[p+1],S-p)},Z={};return{gapAt:T,sdPoly:w,floodSide:l,shoreGap:f,reachF:u,floodF:x,leftShore:y,carrDist:R,isles:a,isleAt:c,zone:K,heightAt:(v,S,p=Z,L=!0)=>{K(v,S,p);const I=p.s,P=p.ad;let Y=q(v,S,I,p.m,p.n)+$(I)*(1-D(10,38,P));if(Y=_(Y,r.yAt(I),1-D(2,6,P)),L&&(Y+=p.wheat*(oe.stalk-.05)*D(oe.last-3,oe.last,P)),p.reach>-40){Y=Math.min(Y,p.reach<0?ge+.04-p.reach/2:ge-1.3*D(0,6,p.reach));const X=o[0]-n[0],J=o[1]-n[1],te=ae(((v-n[0])*X+(S-n[1])*J)/(X*X+J*J),0,1);Math.hypot(v-n[0]-X*te,S-n[1]-J*te)<9&&(Y=Math.min(Y,_(r.yAt(e.spit)+.2,ge+.55,D(0,.55,te))))}if(p.flood>-12){const X=kt(I,p.d<0?-1:1,C);Y=_(Y,Ae,D(-X,0,p.flood)),p.flood>0&&(Y=Ae-1.1*D(0,5,p.flood)),Y=Math.max(Y,c(v,S))}return Y},E:q,offAt:$,riseAt:O,poly:W,dv:g,dn:h}}const jt=(r,e,t)=>r.shore[1]-2+D(4,14,e)*(7+7*Ie(e*.19+t[3])),Je={at:1.1,full:1.18},Zt=(r,e,t)=>Math.sin(r*.21+t[2])*Math.sin(e*.17+t[3])+.45*Math.sin(r*.083-e*.11+t[2]*1.7),me=(r,e)=>ut($e("fields-of-gazing-grain:"+e+":"+r));function Xt(r,e={}){const t=Ce(),m=Qe(t),s=me(r,"reach"),H=[];let A=m.shore[0]+s.range(2,8);for(;A<m.shore[1]-8;){const g=s.range(6,13);A<m.spit+8&&A+g>m.spit-8&&(A=m.spit+8+s.range(0,3)),H.push([A,g]),A+=g+s.range(10,18)}const C=me(r,"bank"),B=[C.range(0,6.283),C.range(0,6.283),C.range(0,100),C.range(0,100)],T=me(r,"swells"),W=[T.range(0,1e3),T.range(0,1e3)],w=dt($e("fields-of-gazing-grain:ground:"+r));return{road:t,PL:m,gaps:H,bankPh:B,swell:W,noise:w,land:zt(t,m,{noise:w,gaps:H,bankPh:B,swell:W,...e})}}const et=3.3;function Qt(r,e){const t=me(r,"elms"),m=[];return e.elmXZ.forEach(([s,H],A)=>{const C=t.range(26,32),B=t.range(.6,.8),T=t.range(8.6,11),W=t()*6.283,w=t.range(.01,.045),g=t.int(4,5),h=t()*6.283,l=[],M=[],n=[Math.cos(W)*w*T,T,Math.sin(W)*w*T],o=(f,u,R,y)=>{const x=et*y,b=Math.hypot(f,R),a=b+x>8.9?Math.max(0,8.9-x)/b:1;M.push({x:f*a,y:u,z:R*a,s:y,sy:t.range(.9,1.12),rot:t()*6.283})};for(let f=0;f<g;f++){const u=h+f/g*6.283+t.range(-.35,.35),R=t.range(3.4,5.4),y=C*t.range(.74,.88)-T,x=[];for(let d=0;d<=5;d++){const N=d/5,E=R*(.25*N+.75*N*N),K=y*(1-(1-N)**1.6);x.push([n[0]+Math.cos(u)*E,T+K,n[2]+Math.sin(u)*E])}l.push({pts:x,r0:B*t.range(.32,.42)});const b=d=>{const N=d*5,E=Math.min(4,Math.floor(N)),K=N-E;return[_(x[E][0],x[E+1][0],K),_(x[E][1],x[E+1][1],K),_(x[E][2],x[E+1][2],K)]},a=b(1);o(a[0]+t.range(-.6,.6),a[1]-2.2,a[2]+t.range(-.6,.6),t.range(1.25,1.5)),o(a[0]+Math.cos(u)*t.range(1.6,2.6),a[1]-t.range(7,10),a[2]+Math.sin(u)*t.range(1.6,2.6),t.range(1.05,1.3));const i=b(t.range(.5,.66));o(i[0]+Math.cos(u)*t.range(1.2,2.4),i[1]-2.6,i[2]+Math.sin(u)*t.range(1.2,2.4),t.range(1.1,1.35));const c=b(t.range(.26,.38));o(c[0]+Math.cos(u)*t.range(1.6,3.2),T+t.range(-.4,2.2),c[2]+Math.sin(u)*t.range(1.6,3.2),t.range(1,1.25))}o(n[0]+t.range(-1,1),C-et*1.3*1.12,n[2]+t.range(-1,1),t.range(1.2,1.3)),m.push({x:s,z:H,H:C,girth:B,fork:T,top:n,boughs:l,clumps:M,near:A<4})}),m}function Jt(r,e,t={}){const{road:m,PL:s,land:H}=e,A={},C=[],B=[],T=[],W=me(r,"carr"),w=me(r,"thicket"),g=me(r,"ridgewood"),h=(n,o,f)=>{H.zone(n,o,A);const u=(n-s.end[0])*s.last[0]+(o-s.end[1])*s.last[1];return(A.s<=s.bendEnd||u<9&&A.ad>12&&H.carrDist(n,o)<7.6)&&A.ad>=f&&A.water<-.3};for(let n=0;n<s.carr.length-1;n++){const o=s.carr[n],f=s.carr[n+1],u=f[0]-o[0],R=f[1]-o[1],y=Math.hypot(u,R),x=-R/y,b=u/y;for(let a=0;a<y;a+=t.carrStep??3.3)for(let i=-6;i<=6.01;i+=3){const c=a+W.range(-1,1),d=i+W.range(-1.1,1.1),N=o[0]+u*c/y+x*d,E=o[1]+R*c/y+b*d,K=W.range(9,13),V=W.range(2.1,3);h(N,E,6.5)&&C.push({x:N,z:E,h:K,r:V,rot:W()*6.283,lean:[W.range(-.05,.05),W.range(-.05,.05)],kind:W.int(0,2),inner:Math.abs(i)<4.5})}for(let a=0;a<y;a+=.8)for(const i of[-7.6,0,7.6]){const c=a+w.range(-.3,.3),d=i+w.range(-.9,.9),N=o[0]+u*c/y+x*d,E=o[1]+R*c/y+b*d;h(N,E,4.2)&&B.push({x:N,z:E,h:w.range(2.6,3.2)})}}const l=[];for(let n=0;n<s.carr.length-1;n++){const o=s.carr[n],f=s.carr[n+1],u=f[0]-o[0],R=f[1]-o[1],y=Math.hypot(u,R),x=-R/y,b=u/y,a=Math.hypot(o[0]+x*5-s.rise[0],o[1]+b*5-s.rise[1])<Math.hypot(o[0]-x*5-s.rise[0],o[1]-b*5-s.rise[1])?1:-1;for(let i=0;i<y;i+=2.2){const c=a*(6.4+W.range(-.4,.4)),d=i+W.range(-.3,.3),N=o[0]+u*d/y+x*c,E=o[1]+R*d/y+b*c;h(N,E,6.5)&&l.push({x:N,z:E,h:W.range(3.6,5),r:W.range(2,2.5),rot:W()*6.283})}}const M=[s.last[1],-s.last[0]];for(let n=7;n<=(t.thicketWide??30);n+=2.6)for(let o=1;o<=(t.thicketDeep??8.5);o+=2.5){const f=n+w.range(-.8,.8),u=o+w.range(-.8,.8),R=s.end[0]+M[0]*f-s.last[0]*u,y=s.end[1]+M[1]*f-s.last[1]*u;h(R,y,6.5)&&H.riseAt(R,y)<.9&&C.push({x:R,z:y,h:w.range(9,13),r:w.range(2.1,3),rot:w()*6.283,lean:[w.range(-.05,.05),w.range(-.05,.05)],kind:w.int(0,2),inner:o>2&&o<7.5&&n>9})}for(let n=.8;n<=9;n+=2.2){const o=6.7+w.range(-.15,.15),f=s.end[0]+M[0]*o-s.last[0]*n,u=s.end[1]+M[1]*o-s.last[1]*n;h(f,u,6.5)&&C.push({x:f,z:u,h:w.range(10,13),r:w.range(2.7,3),rot:w()*6.283,lean:[0,0],kind:w.int(0,2)})}for(let n=4.3;n<=12;n+=.5)for(let o=0;o<3;o++){const f=n+w.range(-.3,.3),u=w.range(.5,7),R=s.end[0]+M[0]*f-s.last[0]*u,y=s.end[1]+M[1]*f-s.last[1]*u;h(R,y,4.2)&&B.push({x:R,z:y,h:w.range(2.6,3.2)})}for(let n=7;n<=(t.thicketWide??30);n+=2.2){const o=n+w.range(-.3,.3),f=w.range(8.2,9.2),u=s.end[0]+M[0]*o-s.last[0]*f,R=s.end[1]+M[1]*o-s.last[1]*f;h(u,R,6.5)&&H.riseAt(u,R)<.9&&l.push({x:u,z:R,h:w.range(3.6,5),r:w.range(2,2.5),rot:w()*6.283})}for(let n=7;n<=75;n+=5.2)for(let o=-2;o<=30;o+=5.4){const f=n+g.range(-1.8,1.8),u=o+g.range(-1.9,1.9),R=s.C[0]-s.rgt[0]*f+s.fwd[0]*u,y=s.C[1]-s.rgt[1]*f+s.fwd[1]*u;H.zone(R,y,A),!(A.ad<7)&&T.push({x:R,z:y,h:g.range(14,18),r:g.range(3.6,5),rot:g()*6.283,kind:g.int(0,2),inner:o>4&&o<24&&n>13&&n<70})}for(let n=7;n<=76;n+=3.3)for(let o=-3;o<=31;o+=3.6){const f=n+g.range(-1,1),u=o+g.range(-1.1,1.1),R=s.C[0]-s.rgt[0]*f+s.fwd[0]*u,y=s.C[1]-s.rgt[1]*f+s.fwd[1]*u;H.zone(R,y,A),!(A.ad<6)&&l.push({x:R,z:y,h:g.range(3.4,5.2),r:g.range(1.9,2.5),rot:g()*6.283})}return{carr:C,reed:B,wood:T,under:l}}function tt(){const r=[],e=[],t=[],m=[],s=[],H=new k.Matrix4,A=new k.Vector3;let C=[1,1,1],B=0,T=0,W=[0,0,0,0],w=0;const g={col(h,l=1){return C=[h[0]*l,h[1]*l,h[2]*l],g},kind(h,l=0){return B=h,T=l,g},wind(h=0,l=0,M=0,n=0){return W=[h,l,M,n],g},tr(h,l,M,n=0,o=1){return H.makeRotationY(n),H.scale(A.set(o,o,o)),H.setPosition(h,l,M),g},pop(){return H.identity(),g},vert(h,l=C,M=W){return A.set(h[0],h[1],h[2]).applyMatrix4(H),r.push(A.x,A.y,A.z),e.push(l[0],l[1],l[2]),t.push(B,T),m.push(M[0],M[1],M[2],M[3]),w++},tri(h,l,M){const n=g.vert(h);return g.vert(l),g.vert(M),s.push(n,n+1,n+2),g},quad(h,l,M,n){const o=g.vert(h);return g.vert(l),g.vert(M),g.vert(n),s.push(o,o+1,o+2,o,o+2,o+3),g},face(h){return s.push(h,h+1,h+2,h,h+2,h+3),g},box(h,l,M,n,o,f,u={}){return u.px!==!1&&g.quad([n,l,f],[n,l,M],[n,o,M],[n,o,f]),u.nx!==!1&&g.quad([h,l,M],[h,l,f],[h,o,f],[h,o,M]),u.pz!==!1&&g.quad([h,l,f],[n,l,f],[n,o,f],[h,o,f]),u.nz!==!1&&g.quad([n,l,M],[h,l,M],[h,o,M],[n,o,M]),u.top!==!1&&g.quad([h,o,f],[n,o,f],[n,o,M],[h,o,M]),u.bottom&&g.quad([h,l,M],[n,l,M],[n,l,f],[h,l,f]),g},tube(h,l,M=6,n={}){const o=h.length,f=w,u=new k.Vector3,R=new k.Vector3,y=new k.Vector3,x=new k.Vector3(0,1,0),b=new k.Vector3;for(let a=0;a<o;a++){const i=h[Math.max(0,a-1)],c=h[Math.min(o-1,a+1)];u.set(c[0]-i[0],c[1]-i[1],c[2]-i[2]).normalize(),R.crossVectors(Math.abs(u.y)>.95?b.set(1,0,0):x,u).normalize(),y.crossVectors(u,R);const d=typeof l=="number"?l:l.length===o?l[a]:l,N=typeof d=="number"?d:d[0],E=typeof d=="number"?d:d[1],K=n.colors?n.colors[a]:C,V=n.winds?n.winds[a]:W;for(let U=0;U<M;U++){const O=U/M*6.2832+(n.twist||0);g.vert([h[a][0]+(R.x*Math.cos(O)*N+y.x*Math.sin(O)*E),h[a][1]+(R.y*Math.cos(O)*N+y.y*Math.sin(O)*E),h[a][2]+(R.z*Math.cos(O)*N+y.z*Math.sin(O)*E)],K,V)}}for(let a=0;a<o-1;a++)for(let i=0;i<M;i++){const c=f+a*M+i,d=f+a*M+(i+1)%M,N=c+M,E=d+M;s.push(c,d,E,c,E,N)}if(n.cap!==!1)for(const a of[0,o-1]){const i=g.vert(h[a],n.colors?n.colors[a]:C,n.winds?n.winds[a]:W);for(let c=0;c<M;c++){const d=f+a*M+c,N=f+a*M+(c+1)%M;a?s.push(d,N,i):s.push(N,d,i)}}return g},get count(){return w},get triangles(){return s.length/3},toGeometry(){const h=new k.BufferGeometry;return h.setAttribute("position",new k.Float32BufferAttribute(r,3)),h.setAttribute("color",new k.Float32BufferAttribute(e,3)),h.setAttribute("uv",new k.Float32BufferAttribute(t,2)),h.setAttribute("wind",new k.Float32BufferAttribute(m,4)),h.setIndex(s),h.computeVertexNormals(),h}};return g}function ot(r,e={}){const t={...r,tLeaf:{value:e.map||null},uMirror:{value:e.mirror?1:0},uMirrorY:{value:e.level??ge},uTint:{value:new k.Vector3(1,1,1)},uLow:{value:e.low?1:0}};return new k.ShaderMaterial({uniforms:t,side:e.side??k.DoubleSide,defines:e.leaf?{LEAF:1}:{},vertexShader:`
      attribute vec3 color; attribute vec4 wind;
      varying vec3 vCol, vN, vW; varying vec2 vUv; varying vec4 vWind;
      uniform float uMirror, uMirrorY;
      ${Re}
      void main(){
        #ifdef USE_INSTANCING
          mat4 mm = modelMatrix * instanceMatrix;
        #else
          mat4 mm = modelMatrix;
        #endif
        vec4 wp = mm * vec4(position, 1.);
        vN = normalize(mat3(mm) * normal);
        float sc = length(mm[1].xyz), g = hourGust(wp.xz);
        wp.xz += uWind.xy * (wind.x * sc * (.25 + .95 * g) * .5);
        wp.xyz += wind.y * .05 * sc * vec3(sin(uTime * 6.1 + wp.z * 2.3 + wp.y * 3.1), .5 * sin(uTime * 7.3 + wp.x * 2.9), sin(uTime * 5.3 + wp.x * 2.1 + wp.y * 2.3));
        if (uMirror > .5) { float dp = wp.y - uMirrorY; wp.y = uMirrorY - dp; wp.xz += .012 * dp * vec2(sin(uTime * 1.3 + wp.x * .9 + dp * 1.7), sin(uTime * 1.1 + wp.z * .8 + dp * 1.3)); vN.y = -vN.y; }
        vW = wp.xyz; vCol = color; vUv = uv; vWind = vec4(wind.xyz, g);
        #ifdef USE_INSTANCING_COLOR
          vCol *= instanceColor;
        #endif
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      varying vec3 vCol, vN, vW; varying vec2 vUv; varying vec4 vWind;
      uniform sampler2D tLeaf; uniform float uMirror, uLow; uniform vec3 uTint;
      ${Te}
      void main(){
        vec3 alb = max(vCol, vec3(0.)) * uTint, N = normalize(vN), V = normalize(cameraPosition - vW);
        float leaf = 0., ao = 1., kd = vUv.x;
        #ifdef LEAF
          leaf = clamp(vWind.z, 0., 1.);
          if (leaf > .5) { vec4 t = texture2D(tLeaf, vUv); if (t.a < .4) discard; alb *= .5 + .95 * t.r; }
          else alb *= .7 + .5 * hNoise(vec2((vW.x + vW.z) * 7., vW.y * 1.1));
          alb *= 1. + .3 * (clamp(vWind.w, 0., 1.) - .4) * leaf;
          kd = 0.;
        #else
          if (!gl_FrontFacing) N = -N;
          if (kd > .5 && kd < 1.5) alb *= .78 + .22 * smoothstep(0., .25, fract(vW.y / .14));
          else if (kd > 1.5 && kd < 2.5) { float row = floor(vW.y * 7.), u = (vW.x + vW.z * .83) * 3.1 + hHash(vec2(row, 3.)) * 9., cell = hHash(vec2(row * 7.3, floor(u))); alb *= (.72 + .45 * cell) * (.85 + .3 * hNoise(vW.xz * 9. + vW.y * 7.)) * (.5 + .5 * smoothstep(0., .22, fract(vW.y * 7.)) * smoothstep(0., .1, fract(u))); }
          else if (kd > 2.5 && kd < 3.5) { float row = floor(vW.y / .2); alb *= (.72 + .28 * smoothstep(0., .3, fract(vW.y / .2))) * (.85 + .3 * hHash(vec2(row, floor((vW.x + vW.z) * 3. + row * .5)))); }
          else if (kd > 3.5 && kd < 4.5) alb *= .75 + .45 * hNoise(vec2((vW.x + vW.z) * 9., vW.y * 1.3));
          else if (kd > 9.5) alb *= (.62 + .5 * hNoise(vW.xz * .045)) * (.8 + .4 * hNoise(vW.xz * .16 + vW.y * .1));
          else if (kd > 8.5) alb *= .7 + .6 * hNoise(vW.xz * 13. + vW.y * 9.);
          else if (kd > 7.5) alb *= .8 + .4 * hNoise(vUv.yy * 0. + vW.xz * 40.);
        #endif
        vec4 key = uRow[0], kdir = uRow[1];
        vec3 L = normalize(kdir.xyz + vec3(0., 1e-3, 0.)), c;
        if (uLow > .5) { N = normalize(vec3(0., 1., 0.) + L * .45 + N * .25); leaf *= .35; }
        if (kd > 6.5 && kd < 7.5) c = alb * vUv.y * (.85 + .15 * sin(uTime * 11. + vW.x * 7.) * sin(uTime * 17.3 + vW.z * 5.));
        else {
          c = hourShade(alb, N, vW, ao, 1. - .55 * leaf);
          float nl = dot(N, L), vl = clamp(dot(V, -L), 0., 1.);
          // leaves: light scattered inside the crown, and light through the leaf when seen against the key
          c += alb * key.rgb * (leaf * cloudShade(vW.xz)) * (.55 * (clamp((nl + .6) / 1.6, 0., 1.)) + .9 * clamp(.25 - nl * .75, 0., 1.) * (.3 + .7 * vl * vl));
          if (kd > 4.5 && kd < 5.5) c += alb * key.rgb * (.55 * clamp(-nl, 0., 1.));
          // straw takes the light through its stalks: a sheaf seen against the key glows at its edges and is never a dark figure
          if (kd > 8.5 && kd < 9.5) c += alb * key.rgb * cloudShade(vW.xz) * (.5 * clamp(-nl, 0., 1.) + .22);
          if (kd > 7.5 && kd < 8.5) { float fr = 1. - clamp(dot(N, V), 0., 1.); vec3 R = reflect(-V, N); float sp = clamp(dot(R, L), 0., 1.); sp *= sp; sp *= sp; sp *= sp; c += uRow[2].rgb * (.05 + .3 * fr * fr) + key.rgb * sp * .25 + lampLight(vW, R) * .15; }
          if (kd > 5.5 && kd < 6.5) { vec3 R = reflect(-V, N); float sp = clamp(dot(R, L), 0., 1.); sp *= sp; sp *= sp; c += (key.rgb * sp * sp + lampLight(vW, R) * 2.) * vec3(1., .82, .5); }
        }
        c = hourFog(c, vW);
        if (uMirror > .5) c = mix(c, uRow[4].rgb * .5, .35) * .8;
        gl_FragColor = vec4(c, 1.);
      }`})}const ue=G("#b9b6ae"),he=[.035,.026,.02],Le=G("#c9a04a"),St=[.06,.055,.05],We=[[2.84,1.3,1.02,.1,1],[2.92,1.5,.92,.22,.9],[3.05,1.6,.86,.295,.8],[3.2,1.635,.84,.31,.8],[3.45,1.6,.86,.29,.95],[3.75,1.565,.82,.315,1.05],[4.05,1.56,.8,.325,1.1],[4.3,1.59,.8,.3,1.3],[4.5,1.65,.82,.27,1.75],[4.7,1.57,.88,.255,1.4],[4.86,1.42,.96,.2,1.1],[4.96,1.28,1.04,.1,1]],xe=(r,e)=>{let t=0;for(;t<r.length-2&&e>r[t+1][0];)t++;const m=D(0,1,ae((e-r[t][0])/(r[t+1][0]-r[t][0]),0,1));return r[t].map((s,H)=>_(s,r[t+1][H],m))},le={crest0:[4.5,1.65],crest1:[5.66,2.25],under0:[4.9,1.02],under1:[5.55,1.9],dock:[2.93,1.47]},at=r=>[_(le.crest0[0],le.crest1[0],r),_(le.crest0[1],le.crest1[1],r)+.1*Math.sin(Math.PI*Math.pow(r,.85))],De=r=>[_(le.under0[0],le.under1[0],r),_(le.under0[1],le.under1[1],r)-.035*Math.sin(Math.PI*r)];function Nt(r){const e=[],t=[],m=[],s=[],H=[],A=[];let C=0;const B=(n,o,f,u,R=[0,0,0,0],y=[0,0,0],x=0,b=0)=>(e.push(n,o,-f),t.push(u[0],u[1],u[2]),m.push(x,b),s.push(R[0],R[1],R[2],R[3]),H.push(y[0],y[1],-y[2]),C++),T=(n,o)=>[n[0]*o,n[1]*o,n[2]*o],W=20,w=(n,o,f,u,R,y,x,b,a,i,c=0)=>{const d=C;for(let N=0;N<W;N++){const E=N/W*6.2832,K=Math.cos(E),V=Math.sin(E),U=R*Math.sign(K)*Math.pow(Math.abs(K),V>0?b:1),O=(V>0?y:x)*V-c*Math.exp(-((U/.06)**2))*Math.max(V,0),q=.5+.5*D(-.9,.35,V);B(U,n+f*O,o+u*O,T(a,q),i)}return d},g=(n,o)=>{for(let f=0;f<W;f++){const u=n+f,R=n+(f+1)%W,y=o+f,x=o+(f+1)%W;A.push(u,y,x,u,x,R)}},h=(n,o,f,u,R,y)=>{const x=B(0,o,f,u,R);for(let b=0;b<W;b++){const a=n+b,i=n+(b+1)%W;y?A.push(i,a,x):A.push(a,i,x)}};let l=-1;for(let n=0;n<=36;n++){const o=_(2.84,4.96,n/36),f=xe(We,o),u=f[2]+.56*(f[1]-f[2]),R=w(u,o,1,0,f[3],f[1]-u,u-f[2],f[4],ue,[0,0,0,0],o<3.6?.03*(1-D(3.2,3.6,o)):0);l>=0?g(l,R):h(R,u,o-.02,T(ue,.6),[0,0,0,0],!0),l=R}h(l,1.16,4.99,T(ue,.6),[0,0,0,0],!1),l=-1;for(let n=0;n<=12;n++){const o=n/12,f=at(o),u=De(o),R=(f[1]+u[1])/2,y=(f[0]+u[0])/2,x=f[1]-u[1],b=f[0]-u[0],a=Math.hypot(x,b),i=_(.225,.1,Math.pow(o,.8)),c=w(R,y,x/a,b/a,i,a/2,a/2,_(1.5,1.2,o),ue,[o,0,0,0]);l>=0&&g(l,c),l=c}const M=[[0,.1,.165],[.14,.122,.17],[.3,.125,.16],[.5,.098,.125],[.72,.08,.095],[.9,.082,.085],[1,.06,.06]];for(let n=1;n<=12;n++){const o=n/12,f=xe(M,o),u=[_(5.66,6.2,o),_(2.25,1.82,o)+.025*Math.sin(Math.PI*o)],R=[_(5.55,6.17,o),_(1.9,1.67,o)-.055*Math.sin(Math.PI*Math.min(1,o*1.6))],y=(u[1]+R[1])/2,x=(u[0]+R[0])/2,b=u[1]-R[1],a=u[0]-R[0],i=Math.hypot(b,a),c=T(ue,_(1,.45,D(.6,1,o))),d=w(y,x,b/i,a/i,f[1],i/2,i/2,1.15,c,[1+.25*o,0,0,0]);g(l,d),l=d}h(l,1.74,6.22,T(ue,.35),[1.25,0,0,0],!1);for(const n of[-1,1]){const o=n*.062,f=2.255,u=5.63,R=r.range(0,6.28),y=[];for(let x=0;x<=5;x++){const b=x/5,a=.046*Math.pow(Math.sin(Math.PI*(.18+.82*b)*.985),.8)*(1-.25*b),i=[];for(const c of[-1,-.5,0,.5,1]){const d=(1-c*c)*a*.75;i.push(B(o+n*(.03*b)+c*a*.9,f+.195*b,u+.07*b-d,T(ue,_(.8,.5,b)),[1,0,-b,R],[o,f,u]))}y.push(i)}for(let x=0;x<5;x++)for(let b=0;b<4;b++)A.push(y[x][b],y[x][b+1],y[x+1][b+1],y[x][b],y[x+1][b+1],y[x+1][b])}return{P:e,C:t,UV:m,AN:s,PV:H,I:A,vert:B,mulc:T,count:()=>C}}function Et(r,e){const{P:t,C:m,UV:s,AN:H,PV:A,I:C,vert:B,mulc:T}=r,W=[.62,.6,.55],w=(a,i,c,d,N,E,K,V)=>{const U=a.length;let O=-1;for(let q=0;q<U;q++){const j=q/(U-1),z=c*(1-.6*j)/2,F=a[q],$=T(d,.75+.25*j),Z=[typeof N=="function"?N(j):N,E*j,0,K],Q=B(F[0]-i[0]*z,F[1],F[2]-i[1]*z,$,Z,V);B(F[0]+i[0]*z,F[1],F[2]+i[1]*z,$,Z,V),O>=0&&C.push(O,Q,Q+1,O,Q+1,O+1),O=Q}};for(let a=0;a<150;a++){const i=ae((a+e())/150,.02,1),c=at(i),d=_(.34,.2,i)*e.range(.75,1.2),N=_(.225,.1,Math.pow(i,.8)),E=.5*Math.hypot(c[1]-De(i)[1],c[0]-De(i)[0]),K=[],V=e.range(-.02,.02),U=T(W,e.range(.6,1.25));for(let O=0;O<5;O++){const q=O/4,j=d*Math.pow(q,1.15);K.push([.006+(N+.014)*Math.pow(Math.min(1,j/E),.62),c[1]+.012-j*.93,c[0]+V*q-.03*q])}w(K,[0,1],e.range(.014,.024),U,i,1,e.range(0,6.28),[0,c[1],c[0]])}for(let a=0;a<14;a++){const i=e.range(-.035,.035),c=[],d=e.range(.1,.17);for(let N=0;N<4;N++){const E=N/3;c.push([i*(1+E),2.262-.3*d*E,5.67+d*E])}w(c,[1,0],.016,T(W,e.range(.6,1.2)),1.05,1,e.range(0,6.28),[0,2.26,5.67])}for(let a=0;a<150;a++){const i=e.range(-.035,.035),c=e.range(-.1,.1)+i,d=e.range(.78,1.08),N=e.range(.1,.17),E=[],K=T(W,e.range(.55,1.3));for(let V=0;V<7;V++){const U=V/6;E.push([i+(c-i)*Math.pow(U,.8),le.dock[1]+.03*Math.sin(Math.PI*Math.min(1,U*2.5))-d*Math.pow(U,1.45),le.dock[0]-N*Math.sin(Math.PI/2*Math.min(1,U*2.2))-.04*U])}w(E,[1,0],e.range(.014,.026),K,0,-1,e.range(0,6.28),[0,le.dock[1],le.dock[0]])}const g=new k.Vector3,h=new k.Vector3,l=new k.Vector3,M=new k.Vector3(0,1,0),n=new k.Vector3,o=(a,i,c,d,N,E=[0,0,0],K=0)=>{const V=a.length,U=r.count();for(let O=0;O<V;O++){const q=a[Math.max(0,O-1)],j=a[Math.min(V-1,O+1)];g.set(j[0]-q[0],j[1]-q[1],-(j[2]-q[2])).normalize(),h.crossVectors(Math.abs(g.y)>.95?n.set(1,0,0):M,g).normalize(),l.crossVectors(g,h);const z=typeof i=="number"?i:i.length===V?i[O]:i,F=typeof z=="number"?z:z[0],$=typeof z=="number"?z:z[1];for(let Z=0;Z<c;Z++){const Q=Z/c*6.2832,v=Math.cos(Q)*F,S=Math.sin(Q)*$;B(a[O][0]+h.x*v+l.x*S,a[O][1]+h.y*v+l.y*S,a[O][2]-(h.z*v+l.z*S),typeof d=="function"?d(O):d,typeof N=="function"?N(a[O],O):N,E,K)}}for(let O=0;O<V-1;O++)for(let q=0;q<c;q++){const j=U+O*c+q,z=U+O*c+(q+1)%c,F=j+c,$=z+c;C.push(j,z,$,j,$,F)}},f=a=>a>=4?St:T(ue,a>=2?.5:.72);[[-1,0],[1,Math.PI]].forEach(([a,i])=>{const c=[a*.2,1.25,3.15],d=[a*.19,1.15,4.76];o([[a*.2,1.2,3.12],[a*.22,.95,3.3],[a*.2,.56,2.95],[a*.2,.14,2.98],[a*.2,.06,3.02],[a*.2,0,3.04]],[[.16,.27],[.12,.2],.075,.05,.065,.075],8,f,N=>[0,0,ae((c[1]-N[1])/.4,0,1),i],c),o([[a*.19,1.1,4.78],[a*.2,.88,4.66],[a*.19,.5,4.74],[a*.19,.14,4.72],[a*.19,.06,4.76],[a*.19,0,4.78]],[[.12,.19],[.095,.14],.066,.046,.06,.07],8,f,N=>[0,0,ae((d[1]-N[1])/.4,0,1),i+Math.PI/2],d)});const u=(a,i,c,d,N=12)=>{const E=xe(We,a),K=E[2]+.56*(E[1]-E[2]),V=[];for(let U=0;U<=N;U++){const O=_(i,c,U/N),q=Math.cos(O),j=Math.sin(O);V.push([(E[3]+d)*Math.sign(q)*Math.pow(Math.abs(q),j>0?E[4]:1),K+((j>0?E[1]-K:K-E[2])+d)*j,a])}return V},R=[];for(let a=0;a<=18;a++){const i=a/18*6.2832;R.push([.25*Math.sin(i),1.3+.4*Math.cos(i),4.74-.1*Math.cos(i)])}o(R,[.05,.06],6,he,[.05,0,0,0]);for(const a of[-1,1])o([[a*.05,1.68,4.63],[a*.06,1.8,4.6],[a*.065,1.84,4.59]],[.016,.014,.02],5,Le,[.05,0,0,0],[0,0,0],6);o(u(4.27,-.5,Math.PI+.5,.012),[.04,.014],5,he,[0,0,0,0]);for(const a of[-1,1]){const i=[];for(let c=0;c<=8;c++){const d=c/8*6.2832;i.push([a*.1,1.61+.03+.03*Math.cos(d),4.27+.03*Math.sin(d)])}o(i,.006,4,Le,[0,0,0,0],[0,0,0],6)}const y=[];for(let a=0;a<=10;a++){const i=_(4.27,2.96,a/10);y.push([0,xe(We,i)[1]+.008,i])}o(y,[.02,.008],4,he,[0,0,0,0]),o(u(3.22,.1,Math.PI-.1,.01,8),[.022,.008],4,he,[0,0,0,0]);const x=[];for(let a=0;a<=6;a++){const i=_(3.4,2.86,a/6);x.push([-(xe(We,i)[3]+.012),1.2,i])}x.push([-.05,1.2,2.822],[.05,1.2,2.822]);for(let a=6;a>=0;a--){const i=_(3.4,2.86,a/6);x.push([xe(We,i)[3]+.012,1.2,i])}o(x,[.012,.03],4,he,[0,0,0,0]);for(const a of[-1,1]){o([[a*.27,1.22,4.78],[a*.335,1.12,4.2],[a*.33,1.05,3.5],[a*.34,.98,2.9],[a*.36,.92,2.45]],[.01,.024],4,he,[0,0,0,0]);const i=[];for(let c=0;c<=8;c++){const d=c/8;i.push([a*_(.1,.075,d),_(1.66,1.8,d)-.05*Math.sin(Math.PI*d),_(4.27,6.1,d)])}o(i,[.004,.011],4,he,(c,d)=>[D(0,1,d/8)*1.2,0,0,0]),o([[a*.1,2.2,5.69],[a*.118,2.07,5.8],[a*.09,1.86,6.03],[a*.074,1.78,6.1]],[.005,.012],4,he,(c,d)=>[1.05+.06*d,0,0,0])}o([[-.1,2.21,5.7],[0,2.262,5.68],[.1,2.21,5.7]],[.012,.005],4,he,[1.05,0,0,0]),o([[-.082,1.9,5.98],[0,1.975,5.99],[.082,1.9,5.98],[0,1.79,5.94],[-.082,1.9,5.98]],[.005,.011],4,he,[1.2,0,0,0]);const b=new k.BufferGeometry;return b.setAttribute("position",new k.Float32BufferAttribute(t,3)),b.setAttribute("color",new k.Float32BufferAttribute(m,3)),b.setAttribute("uv",new k.Float32BufferAttribute(s,2)),b.setAttribute("aAnim",new k.Float32BufferAttribute(H,4)),b.setAttribute("aPiv",new k.Float32BufferAttribute(A,3)),b.setIndex(C),b.computeVertexNormals(),b}const st=.55,Ht=.6,Tt=.1,Lt=.65,rt=2.3,nt=[.35,.8],Ft=.5,it=.45;function Ct(r){return new k.ShaderMaterial({uniforms:{...r},side:k.DoubleSide,vertexShader:`
      attribute vec3 color; attribute vec4 aAnim; attribute vec3 aPiv; attribute vec4 aInst;
      varying vec3 vCol, vN, vW, vL; varying vec2 vUv; varying vec3 vAn;
      uniform vec4 uPairK;
      vec2 rot(vec2 v, float a){ float c = cos(a), s = sin(a); return vec2(v.x * c - v.y * s, v.x * s + v.y * c); }
      uniform float uTime;
      void main(){
        vec3 p = position; float ph = uTime * 5.97 * aInst.y + aInst.x, hw = abs(aAnim.y), s2 = hw * hw;
        // ears flick singly; strands swing (mane with the stride, tail on its own slow beat with a switch now and then)
        if (aAnim.z < 0.) { float fl = max(sin(uTime * .9 + aAnim.w * 3. + aInst.x * 7.), 0.); fl *= fl; fl *= fl; fl *= fl; fl *= fl; vec3 e = p - aPiv; e.yz = rot(e.yz, (.8 * fl + .07 * sin(uTime * 2.3 + aAnim.w)) * -aAnim.z); p = aPiv + e; }
        if (aAnim.y > 0.) { p.x += s2 * (.022 * sin(2. * ph + aAnim.w) + .02 * sin(uTime * 1.7 + aAnim.w * 2.)); p.z += s2 * .02 * sin(2. * ph + aAnim.w * 1.7); p.y += s2 * .012 * sin(2. * ph + aAnim.w); }
        else if (aAnim.y < 0.) { float sx = max(sin(uTime * .53 + aInst.x * 9.), 0.), sx2 = sx * sx, sx4 = sx2 * sx2; float sw = .15 * sin(uTime * 1.1 + aInst.x * 4.) + .45 * sx4 * sx4 * sx2 * sin(uTime * 5.); p.x += s2 * (sw + .03 * sin(uTime * 2.1 + aAnim.w)); p.z += s2 * .035 * sin(2. * ph + aAnim.w); }
        // the neck nods twice a stride and the head turns a little, slowly; in a bend the neck turns into it by the road's curve
        float nod = (.045 * sin(2. * ph + .7) + .02 * sin(uTime * .37 + aInst.x * 3.)) * aAnim.x;
        float turn = (.05 * sin(uTime * .29 + aInst.x * 5.) + .025 * sin(uTime * .83 + aInst.x) + uPairK.y * aInst.w) * aAnim.x;
        vec3 q = p - vec3(0., 1.4, -4.6); q.yz = rot(q.yz, nod); q.xz = rot(q.xz, turn); p = vec3(0., 1.4, -4.6) + q;
        // legs swing from hip and shoulder
        if (aAnim.z > 0.) { vec3 e = p - aPiv; e.yz = rot(e.yz, .3 * sin(ph + aAnim.w) * aAnim.z); p = aPiv + e; }
        // quarters roll, shoulders answer, the whole horse rises and falls twice a stride
        float a = -p.z, rear = 1. - smoothstep(3.3, 4.1, a), fore = smoothstep(3.9, 4.6, a);
        float roll = .05 * sin(ph) * rear - .03 * sin(ph + .9) * fore, cy = p.y - 1.2, px = p.x;
        p.x += -cy * roll + .012 * sin(ph) * rear; p.y += px * roll + .012 * sin(2. * ph);
        mat4 mm = modelMatrix * instanceMatrix;
        vec4 wp = mm * vec4(p, 1.);
        vN = normalize(mat3(mm) * normal); vW = wp.xyz; vL = position; vCol = color * aInst.z; vUv = uv; vAn = aAnim.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      varying vec3 vCol, vN, vW, vL; varying vec2 vUv; varying vec3 vAn;
      uniform vec4 uPairK;
      ${Te}
      ${Oe}
      // a lamp's amber on the pair, by distance from the flame: failing along the barrel, nothing from LAMP_REACH on (the withers stand
      // 2.35 m from the flames): necks and heads take none of it. pairReach: that same reach alone (for the brass's glint of the flame)
      uniform vec4 uPair;
      float pairReach(vec4 lamp, vec3 wp){ return lamp.w * (1. - smoothstep(${(rt*.55).toFixed(2)}, ${rt.toFixed(2)}, distance(lamp.xyz, wp))); }
      vec3 pairLamp(vec4 lamp, vec3 wp, vec3 N){ vec3 d = lamp.xyz - wp; float r2 = dot(d, d), q = r2 / 1.44;
        return ${de(He)} * (.55 * clamp(dot(N, d) / sqrt(max(r2, 1e-4)) * .6 + .4, 0., 1.) / (1. + q * q) * pairReach(lamp, wp)); }
      float lumOf(vec3 c){ return dot(c, vec3(.2126, .7152, .0722)); }
      void main(){
        vec3 alb = max(vCol, vec3(0.)), N = normalize(vN), V = normalize(cameraPosition - vW);
        bool thin = abs(vAn.y) > 1e-4 || vAn.z < 0.;
        if (thin && dot(N, V) < 0.) N = -N;
        // the coat: faint dapples over quarters and barrel, the hair's own streaks on mane and tail
        if (vUv.x < .5 && !thin) alb *= .9 + .2 * smoothstep(.35, .75, hNoise(vL.xz * 9. + vL.y * 6.));
        if (abs(vAn.y) > 1e-4) alb *= mix(.8 + .4 * hNoise(vec2(vL.x * 160. + vL.z * 160., vL.y * 3.)), .9, uPairK.x);
        vec3 L = normalize(uRow[1].xyz + vec3(0., 1e-3, 0.));
        float dark = uPairK.x, rim = 1. - clamp(dot(N, V), 0., 1.); rim *= rim * rim;
        // THE COAT TAKES THE HOUR'S KEY AS THE LAND BESIDE IT DOES: by day the lit face leans toward the key by the ground's own figure
        // (GROUND_LEAN: what the grass of the verge takes), both horses alike. Under a sun two degrees up a level back would take
        // a thirtieth of the key and stand flat in the fill alone while the grass beside it glows; with the land's lean the pale
        // coat is rose gold on its sunward side and on its back. In the dark it leans to nothing.
        vec3 Nl = normalize(N + L * (${it.toFixed(2)} * (1. - dark))); float sunC = castShade(vW, L);
        vec3 c = hourShade0(alb * mix(1., ${Ht.toFixed(2)}, dark), Nl, vW, 1., sunC);
        // ITS OWN SHADE BY DAY IS LIT BY THE WHOLE SKY (the fill and the low band alike, as skyShade mixes them for the ground in the pair's
        // shade), AT EVERY HEIGHT OF THE SUN: a warm grey violet in the gold hour, never the fill's purple alone. (The lamps lay no wash
        // on the quarters by day either, so the coat's shade stands as the sky makes it.)
        { float w = (1. - clamp(dot(Nl, L), 0., 1.) * sunC) * (1. - dark) * uRow[1].a;
          vec3 sk = mix(uRow[2].rgb, uRow[6].rgb * (lumOf(uRow[2].rgb) / max(lumOf(uRow[6].rgb), 1e-4)), .5); sk = alb * mix(sk, vec3(lumOf(sk)), .4);
          c = mix(c, sk * (lumOf(c) / max(lumOf(sk), 1e-5)), clamp(w, 0., 1.)); }
        c += alb * uRow[0].rgb * (rim * (.25 + .9 * clamp(dot(L, -V) * .5 + .5, 0., 1.)) * .7 * (1. - .8 * dark));
        // the ceiling of the dark: one value (a tenth of the afternoon coat, far under its third), never over the sky's low band of the row
        float low = lumOf(uRow[6].rgb);
        float ceil0 = min(${(st*Tt).toFixed(3)}, low);
        c *= mix(1., ceil0 / (lumOf(c) + ceil0), dark);
        c = mix(c, uRow[2].rgb * (dot(c, vec3(.2126, .7152, .0722)) / max(dot(uRow[2].rgb, vec3(.2126, .7152, .0722)), 1e-4)), ${Lt.toFixed(2)} * dark);
        // the thin pearl line of the first light along manes, ears and upper edges; the afterglow's thin rim on the sunward side;
        // with them the pair is nowhere brighter than the coat's own ceiling of the dark (so nowhere over the low band)
        c += alb * vec3(.95, .85, .76) * ((1. - uRow[1].a) * rim * clamp(N.y * .6 + .5, 0., 1.) * (thin ? .22 : .4));
        c += alb * vec3(.5, .6, .26) * (uRow[2].a * rim * clamp(dot(N, ${de(Xe)}) * .7 + .3, 0., 1.) * .9);
        // (the brass's glint of the row's key light, the sun's by day, lies under that same ceiling in the dark: no moon's spark on a hame)
        vec3 R = reflect(-V, N);
        if (vUv.x > 5.5) { float sp = clamp(dot(R, L), 0., 1.); sp *= sp; sp *= sp; c += uRow[0].rgb * (sp * sp * (1. - .7 * dark)) * vec3(1., .82, .5); }
        c *= mix(1., min(1., ceil0 / max(lumOf(c), 1e-4)), dark);
        // THE LAMPS' WARM EDGE (one constant): on the faces turned outward to the lamp's own side (the pair's own right hand is
        // (-uPair.w, uPair.z); a horse's outer side is the side it stands on), never over LAMP_MOST of the coat's afternoon value
        float outw = dot(N.xz, vec2(-uPair.w, uPair.z)) * sign(vL.x), most = ${(st*Ft).toFixed(3)};
        vec3 lay = alb * (pairLamp(uLamp0, vW, N) + pairLamp(uLamp1, vW, N)) * smoothstep(${nt[0].toFixed(2)}, ${nt[1].toFixed(2)}, outw);
        if (vUv.x > 5.5) lay += lampLight(vW, R) * (2. * max(pairReach(uLamp0, vW), pairReach(uLamp1, vW))) * vec3(1., .82, .5);
        c += lay * min(1., most / max(lumOf(lay), 1e-4));
        gl_FragColor = vec4(hourFog(c, vW), 1.);
      }`})}const fe={rail:2.2,railDrop:1.05,lamp:.8,croup:3.2,withers:4.5,poll:5.7,pollDrop:.35,off:.5};function Bt(r,e,t){const m=new k.Group,s=Et(Nt(t),t),H=Ct(e),A=new k.InstancedMesh(s,H,2),C=new k.Matrix4,B=t.range(.965,.985),T=t.range(0,6.28),W=T+t.range(1.9,4.2);A.setMatrixAt(0,C.makeScale(B,B,B).setPosition(-fe.off,0,0)),A.setMatrixAt(1,C.makeScale(-1,1,1).setPosition(fe.off,0,0)),s.setAttribute("aInst",new k.InstancedBufferAttribute(new Float32Array([T,1,1,1,W,t.range(.955,.985),t.range(.9,.96),-1]),4)),A.frustumCulled=!1,m.add(A);const w=tt(),g=Ge-fe.railDrop,h=fe.rail,l=z=>-z,M=[[h-.2,g-.75],[h-.13,g-.5],[h-.07,g-.27],[h-.02,g-.11],[h+.03,g-.03],[h+.1,g],[h+.16,g-.012]];w.col([.03,.026,.03]).kind(8);for(let z=0;z<M.length-1;z++)for(let F=0;F<6;F++){const $=-.95+F*1.9/6,Z=$+1.9/6,Q=v=>.04*(v*v)/.9;w.quad([$,M[z][1]-Q($),l(M[z][0])],[Z,M[z][1]-Q(Z),l(M[z][0])],[Z,M[z+1][1]-Q(Z),l(M[z+1][0])],[$,M[z+1][1]-Q($),l(M[z+1][0])])}w.col(Le).kind(6);const n=[];for(let z=0;z<=10;z++){const F=-.93+z*.186;n.push([F,g+.065-.04*F*F/.9,l(h+.1)])}w.tube(n,.013,6);for(const z of[-.9,-.45,0,.45,.9])w.tube([[z,g-.02-.04*z*z/.9,l(h+.1)],[z,g+.065-.04*z*z/.9,l(h+.1)]],.009,5);const o=[];for(const z of[-1,1]){const F=z*fe.lamp,$=g+.2,Z=l(h+.02);w.col(Le).kind(6),w.tube([[z*.9,g-.2,l(h-.03)],[z*.93,g,l(h)],[F,$-.1,Z]],.011,5),w.box(F-.055,$-.1,Z-.055,F+.055,$-.075,Z+.055,{bottom:!0}),w.box(F-.06,$+.075,Z-.06,F+.06,$+.095,Z+.06,{bottom:!0}),w.tube([[F,$+.095,Z],[F,$+.14,Z],[F,$+.17,Z]],[.045,.022,.026],6);for(const[Q,v]of[[-1,-1],[1,-1],[1,1],[-1,1]])w.tube([[F+Q*.05,$-.075,Z+v*.05],[F+Q*.05,$+.075,Z+v*.05]],.006,4);w.col(He).kind(7,.75),w.box(F-.047,$-.075,Z-.047,F+.047,$+.075,Z+.047,{top:!1}),w.kind(7,4.5),w.tube([[F,$-.05,Z],[F,$-.02,Z],[F,$+.035,Z]],[.012,.016,.003],5),o.push(new k.Vector3(F,$,Z))}w.col([.2,.13,.07]).kind(4),w.tube([[0,.95,l(2.3)],[0,1,l(3.8)],[0,1.06,l(5.02)]],.035,6),w.tube([[-.42,1.08,l(4.98)],[0,1.07,l(5)],[.42,1.08,l(4.98)]],.025,5),w.col(he).kind(0);for(const z of[-1,1])for(const F of[-1,1]){const $=z*fe.off+F*.1,Z=z*.13,Q=[];for(let v=0;v<=8;v++){const S=v/8;Q.push([_($,Z,S*S),_(1.67,g+.085,S)-.07*Math.sin(Math.PI*S),l(_(4.27,h+.1,S))])}w.tube(Q,[.011,.004],4,{winds:Q.map((v,S)=>[0,.5*Math.sin(Math.PI*S/8),0,0])})}const f=[];for(let z=0;z<=10;z++){const F=z/10,$=_(-.13,.13,F);f.push([$,g+.085-.26*Math.sin(Math.PI*F)*(1-.3*Math.sin(Math.PI*F))-.02,l(h+.1-.1*Math.sin(Math.PI*F))])}w.tube(f,[.011,.004],4,{winds:f.map((z,F)=>[0,.6*Math.sin(Math.PI*F/10),0,0])});const u=new k.Mesh(w.toGeometry(),ot(e));u.frustumCulled=!1,m.add(u);const R=9,y=3,x=ae(Math.round(R*((r.vary&&r.vary.density)??1)),4,R+y),b=[[],[]],a=[],i=z=>[0,z(),z.range(.14,.45),z.range(2.2,5)*(z()<.5?-1:1)];for(let z=0;z<R*2;z++)b[z<R?0:1].push(i(t));const c=[t(),t()],d=[t.range(.94,1.06),t.range(.94,1.06)];for(let z=0;z<6;z++){const F=z<3?0:1;a.push([1,z%3/3+c[F]+t.range(-.05,.05),1,d[F]])}const N=t.fork("moths");for(let z=0;z<y*2;z++)b[z<y?0:1].push(i(N));const E=x*2+6,K=new Float32Array(E*4),V=new Float32Array(E*3);for(let z=0;z<x*2;z++){const F=z<x?0:1,$=o[F];K.set(b[F][z-F*x],z*4),V.set([$.x,$.y+.02,$.z],z*3)}for(let z=0;z<6;z++){const F=z<3?-1:1;K.set(a[z],(x*2+z)*4),V.set([F*fe.off,1.73,-6.24],(x*2+z)*3)}const U=new k.InstancedBufferGeometry,O=new k.PlaneGeometry(2,2);U.index=O.index,U.setAttribute("position",O.attributes.position),U.setAttribute("aW",new k.InstancedBufferAttribute(K,4)),U.setAttribute("aC",new k.InstancedBufferAttribute(V,3)),U.instanceCount=E;const q={value:0},j=new k.Mesh(U,new k.ShaderMaterial({uniforms:{...e,uDew:q},transparent:!0,depthWrite:!1,side:k.DoubleSide,vertexShader:`attribute vec4 aW; attribute vec3 aC; uniform float uDew; varying vec2 vUv; varying vec3 vK;
      ${Re}
      void main(){
        vUv = position.xy; vec3 p; float show = uDew;
        if (aW.x < .5) {
          // a moth: round its lamp on its own small way, wings beating
          float th = uTime * aW.w + aW.y * 6.2832, r = aW.z * (.75 + .25 * sin(uTime * 1.3 + aW.y * 9.)), sz = .019 * show;
          vec3 rad = vec3(cos(th), 0., sin(th)), fwd = vec3(-sin(th), 0., cos(th)) * sign(aW.w);
          float fl = .95 * sin(uTime * 52. + aW.y * 30.);
          p = aC + rad * r + vec3(0., .1 * sin(uTime * 2.1 + aW.y * 20.) + .03, 0.) + rad * (position.x * cos(fl) * sz) + vec3(0., abs(position.x) * sin(fl) * sz, 0.) + fwd * (position.y * sz * .7);
          vK = vec3(0., 1., 0.); gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.);
        } else {
          // a breath: let go at the muzzle, left behind by the pair, widening and thinning
          float t = fract(uTime * .62 * aW.w + aW.y), sz = mix(.05, .3, t);
          p = aC + vec3(.05 * sin(aW.y * 40.), .1 * t - .05, .1 + 1.1 * t);
          vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.); mv.xy += position.xy * sz;
          vK = vec3(1., (1. - t) * (1. - t) * smoothstep(0., .12, t) * show, 0.); gl_Position = projectionMatrix * mv;
        }
      }`,fragmentShader:`varying vec2 vUv; varying vec3 vK;
      void main(){
        if (vK.x < .5) { float e = length(vUv * vec2(1., 1.25)); if (e > 1.) discard; gl_FragColor = vec4(vec3(.95, .88, .72) * (.55 + .45 * (1. - e)), 1.); }
        else { float a = (1. - smoothstep(.2, 1., length(vUv))) * vK.y * .3; gl_FragColor = vec4(vec3(.62, .64, .7) + ${de(He)} * .12, a); }
      }`}));return j.frustumCulled=!1,j.renderOrder=6,m.add(j),{object:m,horses:A,carriage:u,lamps:o,station:fe,uDew:q,triangles:s.index.count/3*2+w.triangles+E*2}}const oe={first:2.4,last:44,stalk:1.1,ear:.1,clear:2,side:1.7};function It(r=.5){const e=(t,m,s)=>new k.Color(t).lerp(new k.Color(m),s);return{ear:e("#f2d688","#f0b848",r),straw:e("#dcb850","#d08e2c",r),shade:e("#7a5a1c","#6e4414",r)}}const Ot=()=>{const r=[];let e=oe.first;for(;e<8;)r.push(e),e+=.32;for(;e<16;)r.push(e),e+=.5;for(;e<28;)r.push(e),e+=.9;for(;e<=oe.last;)r.push(e),e+=1.6;return r};function Dt(r,e){return{...r,uEar:{value:e.ear},uStraw:{value:e.straw},uShadeC:{value:e.shade}}}const ve=(r,e)=>{const t=Math.sin(r*127.1+e*311.7)*43758.5453;return t-Math.floor(t)},Vt=(r,e)=>{const t=Math.floor(r),m=r-t,s=m*m*(3-2*m);return _(ve(t,e),ve(t+1,e),s)};async function Ut(r,e,t){const m=Ot(),s=2,H=new k.Group,A=[0,0,0],C=t.chunk||20,B=new Map,T=h=>{const l=Math.floor((h-t.from)/C);return B.has(l)||B.set(l,{P:[],R:[],Lv:[],I:[],n:0}),B.get(l)};let W=0;for(const h of[-1,1])for(const l of m){t.yield&&++W%8===0&&await t.yield();const M=t.rng(),n=(oe.stalk+oe.ear*.5)*t.rng.range(.94,1.06)*(l>8?t.rng.range(.9,1.12):1),o=t.rng.range(11.5,18.5),f=l>8?Math.min(.55,(l-8)*.06):0,u=t.rng()*6.283,R=t.rng()*6.283,y=t.rng.range(.05,.09),x=t.rng.range(.13,.21),b=[];for(let c=t.from;c<=t.to+1e-6;c+=s){const d=(t.rng()-.5)*.12+f*(Math.sin(c*y+u)+.6*Math.sin(c*x+R)),N=h*(l+d);r.at(c,N,A);const E=A[0],K=A[1],V=A[2];if(!t.valid(E,K,c,N)){b.push(null);continue}b.push({s:c,x:E,z:K,b:V,dd:N,lean:ae(o+2.5*(t.rng()-.5),10,20)*se,hh:n*(.95+.1*t.rng())})}for(let c=0;c<b.length;c++){const d=b[c];if(!d)continue;r.at(d.s,d.dd+h*oe.side,A);let N=!t.valid(A[0],A[1],d.s,d.dd+h*oe.side);N||(r.at(d.s,d.dd-h*oe.side,A),N=!t.valid(A[0],A[1],d.s,d.dd-h*oe.side)),N&&(l>8&&Vt(d.s/5.5+M*97,3.1)<.36?b[c]=null:d.hh*=.62+.38*ve(M*51.7,c))}for(let c=0;c<b.length;c++){if(!b[c])continue;let d=c;for(;d+1<b.length&&b[d+1];)d++;d>c&&(b[c].hh*=.3+.3*ve(M*7.7,c),b[d].hh*=.3+.3*ve(M*3.3,d)),d-c>=4&&(b[c+1].hh*=.6+.4*ve(M*13.1,c),b[d-1].hh*=.6+.4*ve(M*29.3,d)),c=d}let a=null,i=0;for(const c of b){if(!c){a=null;continue}const{s:d,x:N,z:E,b:K,hh:V}=c,U=a?a.A:T(d),O=-h*Math.cos(K),q=-h*Math.sin(K),j=t.heightAt(N,E),z=Math.abs(c.dd)-oe.clear-.02,F=Math.min(c.lean,Math.asin(ae(z/V,Math.sin(2*se),1))),$=Math.max(0,z-V*Math.sin(F)),Z=a?Math.hypot(N-a.x,E-a.z):0;i+=Z;const Q=U.n;U.n+=2,U.P.push(N,j,E,N,j,E),U.R.push(i,0,M,V,i,1,M,V),U.Lv.push(O*F,q*F,$,O*F,q*F,$),a&&U.I.push(a.i,Q,Q+1,a.i,Q+1,a.i+1),a={i:Q,x:N,z:E,s:d,A:U};const v=T(d);if(v!==U){const S=v.n;v.n+=2,v.P.push(N,j,E,N,j,E),v.R.push(i,0,M,V,i,1,M,V),v.Lv.push(O*F,q*F,$,O*F,q*F,$),a={i:S,x:N,z:E,s:d,A:v}}}}const w=$t(e);let g=0;for(const h of B.values()){if(!h.I.length)continue;const l=new k.BufferGeometry;l.setAttribute("position",new k.Float32BufferAttribute(h.P,3)),l.setAttribute("aRow",new k.Float32BufferAttribute(h.R,4)),l.setAttribute("aLean",new k.Float32BufferAttribute(h.Lv,3)),l.setIndex(h.I),l.computeBoundingSphere(),l.boundingSphere.radius+=2,H.add(new k.Mesh(l,w)),g+=h.I.length/3}return{object:H,material:w,triangles:g}}function $t(r){return new k.ShaderMaterial({uniforms:r,side:k.DoubleSide,vertexShader:`
      attribute vec4 aRow; attribute vec3 aLean;
      varying vec2 vUv; varying vec3 vW, vN; varying vec4 vRow;
      ${Re}
      void main(){
        vec3 p = position; float ang = length(aLean.xy), g = hourGust(p.xz), dip = .26 * g * g;
        vec2 toRoad = aLean.xy / max(ang, 1e-4);
        // the stalk's own lean toward the road's line, and the wind's dip along the wind. THE WIND NEVER CARRIES A TIP INTO THE ROAD'S CLEAR
        // AIR: what of its push goes toward the road's line beyond the stalk's own room (aLean.z metres, a figure of its place) is left out
        vec3 tip = vec3(toRoad.x * sin(ang), cos(ang), toRoad.y * sin(ang));
        vec2 push = uWind.xy * sin(dip); push -= toRoad * max(dot(push, toRoad) - aLean.z / max(aRow.w, .1), 0.);
        tip.xz += push; tip.y -= 1. - cos(dip);
        p += tip * (aRow.w * aRow.y);
        p.xz += aRow.y * .012 * vec2(sin(uTime * 3.1 + aRow.x * 2.), cos(uTime * 2.7 + aRow.x * 1.7));
        vec4 wp = modelMatrix * vec4(p, 1.);
        vW = wp.xyz; vUv = aRow.xy; vRow = vec4(aRow.z, aRow.w, g, 0.); vN = normalize(vec3(toRoad.x, .4, toRoad.y));
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      varying vec2 vUv; varying vec3 vW, vN; varying vec4 vRow;
      uniform vec3 uEar, uStraw, uShadeC;
      ${Te}
      ${lt}
      ${Oe}
      // a row seen from afar is a line of TUFTS: each its own height and width, the top falling away between them
      float tuftTop(float x, float w, float seed){ float i = floor(x / w), f = abs(fract(x / w) - .5), h = hHash(vec2(i, seed)), wd = .26 + .2 * hHash(vec2(i * 1.7 + 5., seed));
        return (.7 + .3 * h) * (1. - (.3 + .25 * hHash(vec2(i * 3.1, seed + 9.))) * smoothstep(wd * .35, .5, f)); }
      void main(){
        float x = vUv.x, y = vUv.y, H = vRow.y, fw = fwidth(x), cw = .045;
        float ci = floor(x / cw), fx = fract(x / cw) - .5, h1 = hHash(vec2(ci, vRow.x * 91.)), h2 = hHash(vec2(ci * 1.7 + 3., vRow.x * 57.));
        float topY = .9 + .1 * h1, earLen = .1 / max(H, .2) * (.9 + .25 * h2), earY0 = topY - earLen;
        float dx = abs(fx - (h2 - .5) * .3) * cw, ey = clamp((y - earY0) / earLen, 0., 1.);
        // near: each stalk and its ear (the ear's broad face lies in the row's plane); far: the row as one mass with a ragged top
        float earW = .012 * sqrt(clamp(sin(3.1416 * (.08 + .9 * ey)), 0., 1.));
        float stem = step(dx, .005) * step(y, earY0 + .01), ear = step(dx, earW) * step(earY0, y) * step(y, topY);
        float awn = step(dx, earW + .012 * ey) * step(earY0 + earLen * .2, y) * step(y, topY + .035) * step(hHash(vec2(ci * 1.3 + vRow.x * 17., floor(y * 220.))), .4);
        float nearA = max(max(stem, ear), awn);
        // far: columns of stalks twice as wide at each doubling of the pixel's footprint, each with its own top
        float lf = max(log2(max(fw, 1e-5) / (cw * .6)), 0.), l0 = floor(lf), w0 = cw * exp2(l0), w1 = w0 * 2.;
        float c0 = hNoise(vec2(x / w0 * .7, vRow.x * 71. + l0)), c1 = hNoise(vec2(x / w1 * .7, vRow.x * 71. + l0 + 1.)), colK = mix(c0, c1, fract(lf));
        float tw0 = w0 * 7., tw1 = w1 * 7., tf = mix(tuftTop(x, tw0, vRow.x * 31. + l0), tuftTop(x, tw1, vRow.x * 31. + l0 + 1.), fract(lf));
        float farTop = (.86 + .1 * colK) * tf * (.9 + .1 * hNoise(vec2(x * .9 + vRow.x * 40., vRow.x * 9.)));
        float farA = step(y, farTop);
        float t = smoothstep(cw * .25, cw * .7, fw);
        if (mix(nearA, farA, t) < .5) discard;
        h1 = mix(h1, colK, t);
        float inEar = mix(smoothstep(earY0 - .02, earY0 + .02, y), smoothstep(farTop - .16, farTop - .08, y), t);
        vec3 alb = mix(mix(uShadeC * .7, uStraw, smoothstep(.0, .8, y)) * (.8 + .4 * h2 * (1. - t) + .4 * colK * t), uEar * (.8 + .4 * h1), inEar);
        alb = mix(alb, uEar * 1.2, .5 * vRow.z * vRow.z * smoothstep(.45, 1., y));
        vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
        if (dot(N, V) < 0.) N.xz = -N.xz;
        vec4 key = uRow[0], kdir = uRow[1], fill = uRow[2], shd = uRow[3];
        vec3 L = normalize(kdir.xyz + vec3(0., 1e-3, 0.));
        float nl = dot(N, L), vl = clamp(dot(V, -L), 0., 1.), sh = pairShade(vW, L) * cloudShade(vW.xz) * castShade(vW, L);
        // deep between the rows the light does not reach: the lower the darker
        float depth = smoothstep(0., .75, y), lit = (.25 + .75 * clamp((nl + .5) / 1.5, 0., 1.)) + .7 * clamp(.3 - nl, 0., 1.) * (.3 + .7 * vl * vl) * inEar;
        alb *= .86 + .28 * hNoise(vW.xz * 9. + vW.y * 5.);
        vec3 c = alb * (key.rgb * lit * sh * (.38 + .62 * depth) + mix(shd.rgb, fill.rgb, .5 + .5 * depth) * (.6 + .4 * depth));
        // awns catch a low key as fine bright hairs
        c += key.rgb * uEar * (inEar * step(.9, hHash(vec2(ci * 3.1, floor(y * 90.)))) * (.25 + .75 * vl) * .5 * sh);
        c += alb * lampLight(vW, N) + alb * firstLight(N) * (inEar * .9);
        gl_FragColor = vec4(hourFog(c, vW), 1.);
      }`})}const lt=`
uniform vec4 uPair;
float pairBody(vec3 o, vec3 d, vec3 c, vec3 r){ vec3 oc = (o - c) / r, dd = d / r; float b = dot(oc, dd), a = max(dot(dd, dd), 1e-5), c0 = dot(oc, oc) - 1.;
  float h = (b * b - a * c0) / a; return 1. - .85 * smoothstep(0., .55, h) * max(step(b, 0.), step(c0, 0.)); }
float pairShade(vec3 wp, vec3 L){
  vec2 e = wp.xz - uPair.xy, f = uPair.zw, r = vec2(-f.y, f.x);
  vec3 o = vec3(dot(e, r), wp.y, dot(e, f)), d = vec3(dot(L.xz, r), L.y, dot(L.xz, f));
  if (dot(e, e) > 3600.) return 1.;
  float s = pairBody(o, d, vec3(-.5, 1.2, 3.9), vec3(.33, .48, 1.15)) * pairBody(o, d, vec3(.5, 1.2, 3.9), vec3(.33, .48, 1.15));
  s *= pairBody(o, d, vec3(-.5, 1.75, 5.3), vec3(.15, .33, .6)) * pairBody(o, d, vec3(.5, 1.75, 5.3), vec3(.15, .33, .6));
  return s * pairBody(o, d, vec3(0., 1., .3), vec3(.95, .75, 1.7));
}`;function Gt(r,e,t={}){return{...r,uSegA:{value:e.segA},uSegB:{value:e.segB},uRing:{value:new k.Vector4(0,1e5,4.5,0)},uPuddle:{value:new k.Vector2(t.puddleSeed??.37,20)},uShoreS:{value:t.shoreS??1e5},uYard:{value:new k.Vector4(1e5,1e5,3.5,40)},uPath:{value:new k.Vector4(0,1e5,0,1e5)},uWorn:{value:[0,1,2,3].map(()=>new k.Vector4(0,1e5,1,0))}}}function qt(r,e){return new k.ShaderMaterial({uniforms:r,defines:{NSEG:e.n},vertexShader:`
      attribute vec4 aZone; varying vec3 vW, vN; varying vec4 vZone;
      void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal); vZone = aZone; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`
      varying vec3 vW, vN; varying vec4 vZone;
      uniform vec3 uEar, uStraw, uShadeC; uniform vec4 uRing, uYard, uPath, uWorn[4]; uniform vec2 uPuddle;
      ${Te}
      ${mt}
      ${lt}
      ${Oe}
      uniform float uShoreS;
      // THE FORM OF WORKED GROUND AND OF THE FLANK'S TURF IS IN THE SKIN'S OWN HEIGHT: a height field of the place (world metres; the mesh's 2 m grid
      // cannot carry it), whose slope takes the key and whose crests and humps throw their shade away from the key by its height.
      // Whatever of it is finer than the pixel's footprint gives way to its mean (keep).
      // The hollows: the twin of the part's hollowAt.
      float hollowF(vec2 p){ return sin(p.x * .21 + uBankPh.z) * sin(p.y * .17 + uBankPh.w) + .45 * sin(p.x * .083 - p.y * .11 + uBankPh.z * 1.7); }
      // one size of furrow across the rows: lam metres from crest to crest, amp metres high, u metres across the rows; el = (the key's rise for
      // each metre across the rows, the side it comes from); cap = the most of a furrow its crest may shade. Adds the slope to g; returns the lit share.
      float furrow(float u, float lam, float amp, vec2 el, float cap, float keep, inout float g){
        float ph = u / lam; g -= amp * 6.2832 / lam * sin(6.2832 * ph) * keep;
        float f = clamp(2. * amp / (lam * max(el.x, 1e-3)), 0., cap), q = fract(el.y > 0. ? -ph : ph);
        return 1. - mix(f * .9, (1. - smoothstep(f - .07, f + .07, q)) * smoothstep(0., .07, q), keep);
      }
      // THE SHORE'S LEFT GROUND (the flank from the wheat's end down to the wet meadow): turf in low hummocks and hollows as broad as they
      // are long: a height field of the place in two sizes (4.6 m and 1.9 m, half a metre from hollow to top), nothing in it long in any
      // direction. Returns (the height's slope, the height 0..1, the lit share: a hummock's shade lies away from the key by its height).
      float humH(vec2 p){ return hNoise(p / 4.6 + 7.3) * .65 + hNoise(p / 1.9 + 31.7) * .35; }
      vec4 hummocks(vec2 p, vec3 L){
        const float A = .5, e = .35; float h = humH(p), lh = max(length(L.xz), 1e-3), rise = L.y / lh; vec2 Lh = L.xz / lh;
        vec2 gr = vec2(humH(p + vec2(e, 0.)) - humH(p - vec2(e, 0.)), humH(p + vec2(0., e)) - humH(p - vec2(0., e))) * (A / (2. * e));
        float sh = max((humH(p + Lh * 1.1) - h) * A - rise * 1.1, (humH(p + Lh * 2.4) - h) * A - rise * 2.4);
        return vec4(gr, h, 1. - .7 * smoothstep(-.02, .2, sh));
      }
      // what a level pool shows: the sky of the eye's row along the mirrored look, with the sun's disc, the afterglow, the moon and the first light
      vec3 poolSky(vec3 R){
        float sunH = uRow[0].a, veil = uRow[1].a, night = 1. - veil, bd = degrees(atan(R.x, -R.z + 1e-7)), eD = degrees(asin(clamp(R.y, 0., 1.)));
        vec3 c = mix(uRow[6].rgb, uRow[5].rgb, pow(clamp(R.y, 1e-4, 1.), .42)), sd = vec3(${Math.sin(Ne*se).toFixed(5)} * cos(sunH), sin(sunH), ${(-Math.cos(Ne*se)).toFixed(5)} * cos(sunH));
        float cs = clamp(dot(R, sd), 0., 1.), cs8 = pow(cs, 8.);
        c += uRow[7].rgb * (.05 * pow(cs8, 6.) + .02 * cs8) * veil; c = mix(c, uRow[7].rgb, smoothstep(.99855, .99875, cs));
        c += vec3(.5, .62, .26) * (smoothstep(${ye.from}., ${ye.peak}., bd) * (1. - smoothstep(${ye.peak+1}., ${ye.to}., bd)) * exp(-radians(eD) * 9.) * uRow[2].a * .9);
        float cm = clamp(dot(R, ${de(Me(Ee.bearing,Ee.up))}), 0., 1.);
        c += vec3(.5, .6, .8) * (.1 * pow(cm, 256.) + .1 * pow(cm, 16.) + .05 * cm * cm * cm) * night; c = mix(c, vec3(.9, .94, 1.) * .95, smoothstep(.99863, .99883, cm) * night);
        float rel = abs(mod(bd - (${be.bearing}.) + 540., 360.) - 180.), up = clamp(eD / ${be.top}., 0., 1.);
        c += mix(vec3(.98, .74, .34), vec3(.94, .84, .76), smoothstep(2.6, 10.5, eD)) * ((1. - smoothstep(${be.full}., ${be.none}., rel)) * (1. - up) * sqrt(1. - up) * (.45 + .55 * (1. - smoothstep(0., 11., eD))) * .88 * night);
        return c;
      }
      void main(){
        float dry = step(2., vZone.w), level = mix(uLast.w, uLast.z, clamp(vZone.w - 4. * dry, 0., 1.));
        if (dry < .5 && vW.y < level - .03) discard;
        vec4 sd = roadSD(vW.xz); float s = sd.x, d = sd.y, ad = abs(d), sH = hourS(vW.xz), px = fwidth(ad), dew = standDew(sH);
        float n1 = hNoise(vW.xz * .23), n2 = hNoise(vW.xz * 2.1), n3 = hNoise(vW.xz * 9.), n4 = hNoise(vW.xz * 31.);
        vec3 L = normalize(uRow[1].xyz + vec3(0., 1e-3, 0.)), N = normalize(vN);
        // THE SHORE BETWEEN THE FLANK AND THE WET MEADOW, left of the road: a line of the place that wanders (the twin of the part's
        // shoreEdge, with a finer wander of its own), the flank's turf on its near side and the meadow's rough ground beyond it
        float left = step(d, 0.), edgeS = uShoreS - 2. + smoothstep(4., 14., ad) * (7. + 7. * bankWob(ad * .19 + uBankPh.w)) + 5. * (n1 - .5);
        float shoreK = smoothstep(-5., 5., s - edgeS), stubW = vZone.y * (1. - left * shoreK), roughW = vZone.z * mix(1., shoreK, left), rim = 4. * shoreK * (1. - shoreK) * left * vZone.y;
        // (left of the road the zone is the flank's turf, right of it the reaped strip's stubble in rows)
        float flankW = stubW * left, stubR = stubW - flankW;
        // the pixel's footprint: across the stubble's rows, and on the ground
        float ru = vW.x * .8 + vW.z * .6, fu = fwidth(ru), fg = length(fwidth(vW.xz));
        // standing water: in the hollows of the flank (level ground only, 7 m and more from the line), and in the shore's wet rim
        float hol = hollowF(vW.xz) + .05 * (n2 - .5), lvl = smoothstep(.988, .996, N.y) * smoothstep(7., 11., ad);
        // (the flank's alone: the wet meadow's own ground is one even rough skin under its dew, with no pools and no humps)
        float pool = max(smoothstep(${Je.at.toFixed(2)}, ${Je.full.toFixed(2)}, hol) * stubW * left, rim * smoothstep(.52, .64, hNoise(vW.xz / 3.7 + 11.))) * lvl;
        float damp = max(smoothstep(.8, 1.1, hol) * stubW * left, rim) * lvl;
        // meadow grass, the reaped strip's stubble in rows, rough wet meadow
        vec3 grass = mix(vec3(.085, .17, .04), vec3(.15, .27, .06), n1) * (.7 + .35 * n2 + .25 * n3);
        float srow = smoothstep(.12, .4, abs(fract(ru / .42) - .5));
        vec3 stub = mix(vec3(.33, .27, .13), vec3(.5, .42, .2), n2) * (.62 + .38 * mix(srow, .6, smoothstep(.1, .4, fu))) * (.85 + .3 * n3);
        // the worked land's own height: lands of 8.4 m, the reaper's swaths of 2.1 m (five rows), the rows' own stubble
        float gF = 0., litF = 1.;
        if (stubR > .01) {
          vec2 el = vec2(L.y / max(abs(L.x * .8 + L.z * .6), 1e-3), L.x * .8 + L.z * .6);
          litF = furrow(ru, 8.4, .1, el, .4, 1. - smoothstep(2., 8., fu), gF) * furrow(ru + 1.9 * (n1 - .5), 2.1, .045, el, .55, 1. - smoothstep(.5, 2., fu), gF);
          furrow(ru, .42, .012, el, 0., 1. - smoothstep(.1, .4, fu), gF);
        }
        vec3 rough = mix(vec3(.07, .15, .05), vec3(.13, .22, .07), n2) * (.7 + .5 * n3);
        // the flank's turf: darker and greener in its hollows, paler and drier on its tops
        vec2 gH = vec2(0.); float litH = 1., humK = .5;
        if (flankW > .01) { float keep = 1. - smoothstep(1.5, 5., fg); vec4 hk = hummocks(vW.xz, L); gH = hk.xy * keep; humK = mix(.5, hk.z, keep); litH = mix(1. - .35 * clamp(1. - 2. * L.y, 0., 1.), hk.w, keep); }
        vec3 turf = mix(mix(vec3(.07, .145, .04), vec3(.15, .25, .07), n1), vec3(.3, .27, .12), .45 * smoothstep(.45, .8, humK)) * (.72 + .3 * n2 + .22 * n3) * (.5 + 1. * humK);
        vec3 alb = mix(mix(mix(grass, stub, stubR), turf, flankW), rough, roughW);
        alb = mix(alb, alb * vec3(.5, .46, .44), damp * .85);
        N = normalize(N - (vec3(.8, 0., .6) * (gF * stubR) + vec3(gH.x, 0., gH.y) * flankW) * (1. - pool));
        // the wheat: straw and shade on its floor, and beyond the last standing row its surface of heads
        float g = hourGust(vW.xz), far = smoothstep(${(oe.last-3).toFixed(1)}, ${(oe.last-.5).toFixed(1)}, ad), inWheat = vZone.x * smoothstep(${(oe.first-.3).toFixed(1)}, ${(oe.first+.2).toFixed(1)}, ad);
        vec3 floorC = mix(uShadeC * .9, uStraw * .8, .35 + .65 * n3 * n2);
        float rows = mix(.8 + .3 * smoothstep(.15, .5, abs(fract(ad / 1.6) - .5)), 1., smoothstep(.25, 1., px));
        vec3 surf = mix(uStraw, uEar * 1.1, .3 + .25 * n2 + .45 * g * g) * rows * (.88 + .24 * n3);
        alb = mix(alb, mix(floorC, surf, far), inWheat);
        // a ring worn bare, the road, its ruts, the grass strip, a pale verge
        float ring = (1. - smoothstep(uRing.z - 1.1, uRing.z + .2 + .5 * (n2 - .5), distance(vW.xz, uRing.xy))) * (.75 + .25 * n3);
        vec3 dirt = mix(vec3(.4, .33, .23), vec3(.56, .48, .36), n2) * (.86 + .28 * n4);
        alb = mix(alb, dirt * .9, ring * .85);
        // THE SCHOOL'S YARD, behind its picket fence from the fence's first metre to its last: a mown lawn in swaths, drifts of white clover and of
        // dandelions in it (each head a point of the place; their mean where a pixel holds many), and worn bare where feet go: the path from the
        // gate to the porch, under each swing, about the pump and before the steps
        float yard = left * smoothstep(uYard.z - .1, uYard.z + .3, ad) * (1. - smoothstep(uYard.w - 8., uYard.w, ad)) * smoothstep(uYard.x - 3., uYard.x + 3., s) * (1. - smoothstep(uYard.y - 3., uYard.y + 3., s)) * (1. - vZone.x);
        if (yard > .01) {
          float sw = smoothstep(-.3, .3, sin((vW.x * .92 - vW.z * .39) * 4.19)) * (1. - smoothstep(.3, 1.2, fg));
          vec3 lawn = grass * vec3(1.06, 1.1, .82) * (.9 + .16 * sw);
          float kf = 1. - smoothstep(.02, .09, fg), drift = smoothstep(.42, .66, hNoise(vW.xz / 3.3 + 5.)), drift2 = smoothstep(.5, .72, hNoise(vW.xz / 4.7 + 23.));
          vec2 c1 = floor(vW.xz / .2), c2 = floor(vW.xz / .3);
          float h1 = hHash(c1), h2 = hHash(c2 + 7.), r1 = .04 + .03 * hHash(c1 + 3.), r2 = .06;
          float dot1 = (1. - smoothstep(r1 * .6, r1, length(vW.xz - (c1 + .3 + .4 * vec2(hHash(c1 + 1.3), hHash(c1 + 2.7))) * .2))) * step(h1, .6 * drift);
          float dot2 = (1. - smoothstep(r2 * .6, r2, length(vW.xz - (c2 + .2 + .6 * vec2(hHash(c2 + 4.1), hHash(c2 + 9.3))) * .3))) * step(h2, .5 * drift2);
          lawn = mix(lawn, vec3(.86, .84, .76), mix(.14 * drift, dot1, kf));   // (the mean is the heads' own share of the ground)
          lawn = mix(lawn, vec3(.95, .7, .06), mix(.06 * drift2, dot2, kf));
          vec2 pa = vW.xz - uPath.xy, pb = uPath.zw - uPath.xy; float worn = 1. - smoothstep(.3, .75 + .5 * (n2 - .5), length(pa - pb * clamp(dot(pa, pb) / dot(pb, pb), 0., 1.)));
          for (int i = 0; i < 4; i++) worn = max(worn, uWorn[i].w * (1. - smoothstep(uWorn[i].z * .45, uWorn[i].z * (1. + .5 * (n2 - .5)), distance(vW.xz, uWorn[i].xy))));
          lawn = mix(lawn, dirt * .92, worn * (.6 + .3 * n3));
          alb = mix(alb, lawn, yard * (1. - ring));
        }
        float roadK = 1. - smoothstep(1.55, 1.9 + .25 * (n2 - .5), ad), rut = (1. - smoothstep(.1, .24, abs(ad - .75))) * roadK;
        float strip = (1. - smoothstep(.12, .3 + .14 * (n3 - .5), ad)) * (.6 + .4 * n2);
        alb = mix(alb, mix(alb, vec3(.2, .3, .09) * (.8 + .4 * n3), .5), (1. - roadK) * (1. - smoothstep(1.9, 3.3, ad)) * (1. - far));
        alb = mix(alb, dirt, roadK); alb = mix(alb, dirt * .7, rut * .75); alb = mix(alb, grass * 1.15, strip * roadK);
        // a puddle in a rut now and then: it holds the sky of the eye's hour
        float cell = floor(s / uPuddle.y), ph = hHash(vec2(cell, uPuddle.x * 97.)), pl = .5 + .75 * hHash(vec2(cell * 3.7, uPuddle.x * 31.));
        float pside = step(.5, hHash(vec2(cell * 1.3, uPuddle.x * 7.))) * 2. - 1.;
        vec2 pq = vec2((s - (cell + .25 + .5 * ph) * uPuddle.y) / pl, (d - pside * .75) / .26);
        float puddle = (1. - smoothstep(.75, 1., dot(pq, pq) + .3 * (n3 - .5))) * roadK;
        // shade: the pair's, the long shade of great things, contact shade at their feet
        float inW = inWheat * far;
        float pSh = pairShade(vW, L), sun = pSh * castShade(vec3(vW.x, vW.y, vW.z), L) * mix(1., litF, stubR * .7) * mix(1., litH, flankW * .9);
        float ao = 1.;
        for (int i = 0; i < ${ke}; i++) { vec4 A = uCastA[i], B = uCastB[i]; ao *= 1. - B.w * (1. - smoothstep(.5, 1.5, distance(vW.xz, A.xy) / max(A.z, .1))); }
        // wet ground at the water's edge; dew where it stands (pale and beaded: the last road's shoulders are pale with it)
        float wet = (1. - smoothstep(level + .02, level + .4, vW.y)) * (1. - dry);
        alb = mix(alb, alb * vec3(.45, .42, .4), wet * .8);
        // (the dew lies in patches: grass keeps its own dark between them)
        float dewP = dew * (.3 + .7 * smoothstep(.36, .62, n1 * .65 + n2 * .35));
        // (no dew on standing water)
        dewP *= 1. - pool;
        alb = mix(alb, alb * vec3(.9, 1.05, 1.3) + vec3(.03, .04, .05), dewP * .8 * (1. - roadK) * (1. - inWheat));
        // (the road's dirt takes the key as a level face; the grass strip down its middle leans to it as the verge's grass does)
        vec3 c = hourShade(alb, normalize(N + L * (mix(${it.toFixed(2)}, .12, inW) * (1. - roadK * (1. - strip)))), vW, (.55 + .45 * sun) * ao, sun * (.5 + .5 * ao));
        // (under the low sun the whole sky lights what the key does not reach: the ground in the pair's shade, and the road's level dirt by
        // as much as it goes without the key; so neither is more purple than the ground beside it)
        c = skyShade(c, alb, max(1. - pSh, roadK * (1. - strip) * (1. - clamp(dot(N, L), 0., 1.) * sun)));
        c += (uRow[2].rgb + firstLight(vec3(0., 1., 0.)) * 2.) * (dewP * step(.93, n4) * (1. - roadK) * .5);
        // the puddle: the row's sky, the lamps, and by night a few stars as points
        float night = 1. - uRow[1].a, st = step(.985, hHash(floor(vW.xz * 14.) + uPuddle.x)) * night * night;
        vec3 skyC = mix(uRow[6].rgb, uRow[5].rgb, .45) * (.8 + .2 * sin(uTime * 2.3 + vW.x * 5. + vW.z * 3.)) + lampLight(vW, vec3(0., 1., 0.)) * .5 + vec3(.8, .86, 1.) * st * 1.6;
        c = mix(c, skyC, puddle * .9);
        // standing pools: the sky of the eye's row along the mirrored look (the sun, the afterglow, the moon, the first light), stars as points
        if (pool > .003) { vec3 Vp = normalize(cameraPosition - vW), Rp = normalize(vec3(-Vp.x + .02 * (n3 - .5), abs(Vp.y) + .002, -Vp.z + .02 * (n4 - .5)));
          c = mix(c, poolSky(Rp) + vec3(.8, .86, 1.) * st * 1.6 + lampLight(vW, vec3(0., 1., 0.)) * .4, pool * (1. - roadK) * .93); }
        gl_FragColor = vec4(hourFogGround(c, vW), 1.);
      }`})}async function _t(r,e,t,m,s){const H=r.length,A=e.length,C=new Float32Array(H*A*3),B=new Float32Array(H*A*4),T=[0,0,0,0];for(let h=0;h<A;h++){for(let l=0;l<H;l++){const M=h*H+l;C[M*3]=r[l],C[M*3+1]=t(r[l],e[h]),C[M*3+2]=e[h],m(r[l],e[h],T),B.set(T,M*4)}s&&h%16===15&&await s()}s&&await s();const W=new Uint32Array((H-1)*(A-1)*6);let w=0;for(let h=0;h<A-1;h++)for(let l=0;l<H-1;l++){const M=h*H+l,n=M+1,o=M+H,f=o+1;W[w++]=M,W[w++]=o,W[w++]=f,W[w++]=M,W[w++]=f,W[w++]=n}s&&await s();const g=new k.BufferGeometry;return g.setAttribute("position",new k.BufferAttribute(C,3)),g.setAttribute("aZone",new k.BufferAttribute(B,4)),g.setIndex(new k.BufferAttribute(W,1)),g.computeVertexNormals(),g}function Kt(){const r=tt(),e=G("#d8bc70"),t=G("#e8c466");r.kind(9);for(let m=0;m<5;m++){const s=m/5*6.283+.3,H=Math.cos(s)*.52,A=Math.sin(s)*.52,C=Math.cos(s)*.09,B=Math.sin(s)*.09;r.tube([[H,-.05,A],[_(H,C,.5),.55,_(A,B,.5)],[C,.98,B],[C*3.4,1.22,B*3.4],[C*5.2,1.4,B*5.2]],[.2,.15,.08,.2,.07],4,{colors:[e.map(T=>T*.8),e,e.map(T=>T*.9),t,t.map(T=>T*1.12)]})}return r.toGeometry()}async function eo(r,e={}){const t=r.rng.fork("hero"),m=t.fork("rows"),s=t.fork("pair"),H=t.fork("shocks"),A=Ce([["straight",30],["bend",-36,45],["straight",22]],[[10,0],[62,2]]),C=e.fixedS??150,B=xt(A),T=await bt(A,r.yield,{fixedS:C}),W=yt(B,T),w=It((r.vary&&r.vary.mood)??.5),g=Dt(W,w),h=Gt(g,A);B.setEye(W,C);const l=new k.Group,M=A.at(A.L/2),n={s:0,d:0},o=[0,0,0],f=(p,L)=>2.1*Math.sin(p*.05+1)*Math.cos(L*.045)+.5*Math.sin(p*.021-L*.017),u=(p,L)=>p>14&&p<66&&L>5&&L<13?1:0,R=(p,L)=>{A.locate(p,L,n);const I=Math.abs(n.d);return A.at(n.s,0,o),A.yAt(n.s)+(f(p,L)-f(o[0],o[1]))*D(2,30,I)},y=(p,L)=>{const I=R(p,L),P=Math.abs(n.d);return I+(u(n.s,n.d)?0:(oe.stalk-.05)*D(oe.last-3,oe.last,P))},x=[],b=[];for(let p=0;p<=64;p++)x.push(M[0]-80+p*2.5),b.push(M[1]-80+p*2.5);const a=new k.Mesh(await _t(x,b,y,(p,L,I)=>{const P=u(n.s,n.d);I[0]=1-P,I[1]=P,I[2]=0,I[3]=4},r.yield),qt(h,A));l.add(a),await r.yield();const i=await Ut(A,g,{from:-10,to:A.L+10,rng:m,heightAt:R,valid:(p,L,I,P)=>!u(I,P),yield:r.yield});l.add(i.object),await r.yield();const c=Kt(),d=ot(W),N=new k.InstancedMesh(c,d,7),E=new k.Matrix4,K=new k.Quaternion,V=new k.Euler,U=new k.Vector3,O=new k.Vector3;for(let p=0;p<7;p++){const L=A.at(18+p*7.2+H.range(-.6,.6),9+H.range(-.5,.5)),I=H.range(.92,1.1);E.compose(U.set(L[0],R(L[0],L[1]),L[1]),K.setFromEuler(V.set(0,H()*6.283,0)),O.set(I,I,I)),N.setMatrixAt(p,E)}N.instanceMatrix.needsUpdate=!0,N.computeBoundingSphere(),l.add(N);const q=Bt(r,W,s),j=A.L/2-4,z=A.at(j),F=Math.sin(z[2]),$=-Math.cos(z[2]),Z=A.yAt(j);q.object.position.set(z[0],Z,z[1]),q.object.rotation.set(Math.atan(A.slopeAt(j+fe.withers*.5)),Math.atan2(-F,-$),0,"YXZ"),q.object.updateMatrixWorld(!0);const Q=q.lamps[0].clone().applyMatrix4(q.object.matrixWorld),v=q.lamps[1].clone().applyMatrix4(q.object.matrixWorld);W.uLamp0.value.set(Q.x,Q.y,Q.z,1),W.uLamp1.value.set(v.x,v.y,v.z,1),W.uPair.value.set(z[0],z[1],F,$),l.add(q.object);const S=A.at(A.L/2);return{object:l,radius:9,height:4,center:new k.Vector3(S[0],A.yAt(A.L/2)+1.3,S[1]),ground:!1,anchors:{seat:new k.Vector3(z[0],Z+Ge,z[1]),lamps:[Q,v]},update(p,L){W.uTime.value=L},dispose(){B.tHours.dispose(),T.dispose()}}}export{ye as AFTERGLOW,Ze as BANK_Y,et as CLUMP,At as DAWN_PEARL,Ge as EYE,be as FIRST,Ae as FLOOD_Y,Oe as GLSL_CAST,Te as GLSL_HOURS,lt as GLSL_PAIRSHADE,mt as GLSL_ROAD,Re as GLSL_ROW,Je as HOLLOW,vt as HOURPLACES,wt as JOINS,He as LAMP_AMBER,Ee as MOON,ke as NCAST,ce as NS,Pt as POLE,ge as REACH_Y,qe as ROADHEIGHTS,pt as ROADLIST,je as SMAP,fe as STATION,Ne as SUN_BEARING,Be as S_HI,we as S_LO,oe as WHEAT,bt as bakeSmap,Mt as bankEdge,kt as bankRun,Me as bearingDir,eo as buildHero,Bt as buildPair,Qt as dealElms,Xt as dealLand,Jt as dealStanding,Et as finishHorse,_t as groundGrid,qt as groundMaterial,Gt as groundUniforms,Zt as hollowAt,Nt as horseGeometry,yt as hourUniforms,G as linear,ot as litMaterial,tt as makeGeo,xt as makeHours,zt as makeLand,Qe as makePlaces,Ce as makeRoad,Ut as makeWheat,Fe as roadHeight,Kt as shockGeometry,jt as shoreEdge,me as streamOf,It as wheatColours,Dt as wheatUniforms};
