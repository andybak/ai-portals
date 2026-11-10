import*as l from"three";const dt=["#E8DCC0","#14233B","#1B3A66","#2B5C8A","#8DB0C7","#B4502F","#D8B56E"],rt={paper:0,key:1,dark:2,mid:3,pale:4,red:5,yellow:6},Wt={claw:[.03,.01],boat:[.06,.02],wave:[.14,.06]};function Bt(t,e,n=1){const h=new l.Color(t),i=new l.Color(e);return new l.Color(h.r*(1+(i.r-1)*n),h.g*(1+(i.g-1)*n),h.b*(1+(i.b-1)*n))}function Gt(t=dt){const e=n=>({value:new l.Color(t[n]||dt[n])});return{uPaper:e(0),uKey:e(1),uDark:e(2),uMid:e(3),uPale:e(4),uRed:e(5),uYel:e(6),uTime:{value:0},uFlown:{value:0}}}const Z=`
uniform vec3 uPaper, uKey, uDark, uMid, uPale, uRed, uYel;
uniform float uTime, uFlown;
float hwHash(float n){ return fract(sin(n * 127.1) * 43758.5453); }
float hwHash2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float hwNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hwHash2(i), hwHash2(i + vec2(1., 0.)), f.x), mix(hwHash2(i + vec2(0., 1.)), hwHash2(i + vec2(1., 1.)), f.x), f.y); }
// ink by index 0..6 (paper, key, dark, mid, pale, red, yellow)
vec3 hwInk(float i){ return i < .5 ? uPaper : i < 1.5 ? uKey : i < 2.5 ? uDark : i < 3.5 ? uMid : i < 4.5 ? uPale : i < 5.5 ? uRed : uYel; }
// overprint: ink laid over base at strength k (multiply, as on paper)
vec3 hwOver(vec3 base, vec3 ink, float k){ return base * mix(vec3(1.), ink, k); }
// WOOD GRAIN: a 3 percent streak in a printed block. along / across are metres on the surface, along the
// authored grain direction and across it; fw is the pixel footprint of 'across' (fwidth, taken by the caller).
// Streaks finer than 3 px fall to their flat average, so nothing shimmers. Paper carries no grain: one hex.
vec3 hwGrain(vec3 ink, float along, float across, float fw){
  float g = hwNoise(vec2(across * 9., along * .22)) * .65 + hwNoise(vec2(across * 31., along * .5)) * .35;
  float vis = 1. - smoothstep(.035, .11, fw);
  return ink * (1. + .06 * (g - .5) * vis);
}
// CUT KEY LINE from an authored edge coordinate e (metres from the edge): hard, width w metres, never under
// 1.5 px (fw = fwidth(e), taken once by the caller outside any branch), never over cap metres (a quarter of the body).
float hwLine(float e, float w, float fw, float cap){
  float W = min(max(w, 1.5 * fw), max(cap, 1.5 * fw));
  return 1. - smoothstep(W - .6 * fw, W + .6 * fw, e);
}
// SILHOUETTE LINE of a curved body (shading of the surface's own material, the one reading of the eye's place
// besides the pixel footprint): ndv = |dot(normal, direction to eye)|, r = the body's radius there (m),
// w = line width (m), pxm = metres per pixel at the fragment, fn = fwidth(ndv).
float hwRim(float ndv, float r, float w, float pxm, float fn){
  float W = min(max(w, 1.5 * pxm), .5 * r), op = clamp(W / (1.5 * pxm), 0., 1.);
  W = max(W, min(1.5 * pxm, r));
  float t = sqrt(clamp(2. * W / max(r, 1e-3), 0., 1.));
  return (1. - smoothstep(t - .7 * fn, t + .7 * fn, ndv)) * op * op;
}
`,it=10,qt=560,c=(t,e,n)=>{const h=Math.min(1,Math.max(0,(n-t)/(e-t)));return h*h*(3-2*h)},G=(t,e,n)=>t+(e-t)*n,Nt=t=>(40*c(205,300,t)+35*c(280,400,t)-30*c(395,490,t))*Math.PI/180,lt=[[0,17],[110,17],[122,25],[146,19],[170,23.6],[205,24],[290,8],[392,8],[440,15],[485,18],[505,19],[560,19]],_t=t=>{let e=0;for(;e<lt.length-2&&t>lt[e+1][0];)e++;const n=lt[e],h=lt[e+1];return G(n[1],h[1],c(n[0],h[0],t))},et={x:0,z:0,set:!1};function $t(t){const e=[];let n=0,h=0;for(let i=0;i<=qt+1e-6;i+=t){e.push([n,_t(i),h,i]);const r=Nt(i+t*.5);n-=Math.sin(r)*t,h-=Math.cos(r)*t}return e}function Ot(){const t=$t(1);if(!et.set){const n=t[300],h=t[301],i=h[0]-n[0],r=h[2]-n[2];et.x=n[0]+-r*26,et.z=n[2]+i*26,et.set=!0}const e=[];for(let n=0;n<=qt;n+=20){const h=t[n];e.push([h[0]-et.x,h[1],h[2]-et.z])}return e}const vt=`
float hwRise(float m, float w){ return mix(31. + 5. * smoothstep(0., 187., m) + 10. * smoothstep(187., 290., m), 42. + 4. * smoothstep(0., 290., m), 1. - smoothstep(190., 215., w)); }
vec2 hwCurl(float d, float e){ return vec2(e * smoothstep(-150., -70., d), smoothstep(.85, 1., e) * smoothstep(20., 70., d)); }
float hwFan(float w){ return pow(abs(sin(w * .19635)), .7); }
float hwEase(float w){ return smoothstep(262., 292., w) * (1. - smoothstep(414., 430., w)); }
vec3 hwProfile(float v, float H, float C, float F, float G){
  float k = 1. - (1. - C) * (1. - C), Cs = C * sqrt(C);
  float ry0 = max(H - 2., 2.) / 1.848, cy0 = .848 * ry0, dy = .07 * H * pow(G, 2.857) * (1. - Cs);
  float cx = mix(8., 1., k), cy = mix(cy0, 11., Cs), rx = mix(9., 11.5, k), ry = mix(ry0, 13., Cs);
  float C2 = C * C, pb = mix(1.9199, 3.14159, C2 * C2), pa = -1.0123, pe = 1.3963;
  float Ll = 11. * F, L = Ll + 3.2 * G * (1. - C) * (1. - C), R = .5 * (rx + ry);
  vec2 c = vec2(cx, cy), up = vec2(0., dy);
  vec2 pin = c + vec2(rx * cos(pb), ry * sin(pb));
  vec2 pout = c + vec2((rx + 1.5) * cos(pb), (ry + 1.5) * sin(pb));
  vec2 td = normalize(vec2(-rx * sin(pb), ry * cos(pb)));
  if (v < .42) { float q = v / .42, ph = mix(pa, pb, q); return vec3(c + vec2(rx * cos(ph), ry * sin(ph)) + up * smoothstep(.5, 1.5, ph), (pb - ph) * R + Ll + 1.2); }
  if (v < .47) { float q = (v - .42) / .05; return vec3(pin + td * L * q + up, Ll * (1. - q) + 1.2); }
  if (v < .53) { float q = (v - .47) / .06; vec2 u = .5 * (pout - pin); float s = sin(3.14159 * q);
    return vec3(pin + u + td * L - u * cos(3.14159 * q) + td * length(u) * s + up, 1.2 * (1. - s)); }
  if (v < .58) { float q = (v - .53) / .05; return vec3(pout + td * L * (1. - q) + up, Ll * q + 1.2); }
  vec2 p0 = c + vec2((rx + 3.) * cos(pe), (ry + 3.) * sin(pe));
  float lE = (pb - pe) * (R + 2.2) + Ll + 1.2;
  if (v < .8) { float q = (v - .58) / .22, ph = mix(pb, pe, q), t = mix(1.5, 3., q);
    return vec3(c + vec2((rx + t) * cos(ph), (ry + t) * sin(ph)) + up, (pb - ph) * (R + 2.2) + Ll + 1.2); }
  float s = (v - .8) / .2; vec2 pz = vec2(cx + 20. + 1.3 * H, -3.);
  return vec3(mix(p0.x, pz.x, s), p0.y + (pz.y - p0.y) * mix(s, s * s * (3. - 2. * s), .6) + dy * (1. - s), lE + s * 1.05 * distance(p0, pz));
}
// THE RIDGE'S END (the wave's metres 518 to 540, behind the spit, beside the wheel): the lip is FOLDED AWAY. fo 0 is the
// section above; at fo 1 it is a plain ridge with no eave: the face from its foot (2 m left of the reference line, on
// the flown line's side) up to a round crest 8 m right of it and H - 2 m high (the roll's nose lies on the crest), the
// back down to its old foot.
float hwFold(float w){ return smoothstep(518., 540., w); }
vec3 hwSection(float v, float H, float C, float F, float G, float fo){
  vec3 p = hwProfile(v, H, C, F, G * (1. - fo));
  if (fo <= 0.) return p;
  float Hc = max(H - 2., 2.); vec2 r;
  if (v < .5) { float q = v / .5; r = vec2(mix(-2., 8., q), Hc * (.5 - .5 * cos(3.14159 * q))); }
  else { float q = (v - .5) / .5; r = vec2(mix(8., 28. + 1.3 * H, q), mix(Hc, -3., q * q * (3. - 2. * q))); }
  p.xy = mix(p.xy, r, fo); return p;
}
`;function Kt(t,e=300){return G(31+5*c(0,187,t)+10*c(187,290,t),42+4*c(0,290,t),1-c(190,215,e))}function jt(t,e){return[e*c(-150,-70,t),c(.85,1,e)*c(20,70,t)]}function Yt(t){return Math.pow(Math.abs(Math.sin(t*.19635)),.7)}function Ut(t){return c(262,292,t)*(1-c(414,430,t))}function Xt(t,e,n,h,i=0,r=[0,0,0]){const v=1-(1-n)*(1-n),b=n*Math.sqrt(n),S=Math.max(e-2,2)/1.848,y=.848*S,z=.07*e*Math.pow(i,2.857)*(1-b),f=G(8,1,v),s=G(y,11,b),x=G(9,11.5,v),w=G(S,13,b),W=n*n,p=G(1.9199,3.14159,W*W),m=-1.0123,M=1.3963,d=11*h,A=d+3.2*i*(1-n)*(1-n),k=.5*(x+w),g=f+x*Math.cos(p),u=s+w*Math.sin(p),L=f+(x+1.5)*Math.cos(p),P=s+(w+1.5)*Math.sin(p);let F=-x*Math.sin(p),I=w*Math.cos(p);const O=Math.hypot(F,I);if(F/=O,I/=O,t<.42){const o=t/.42,a=G(m,p,o);return r[0]=f+x*Math.cos(a),r[1]=s+w*Math.sin(a)+z*c(.5,1.5,a),r[2]=(p-a)*k+d+1.2,r}if(t<.47){const o=(t-.42)/.05;return r[0]=g+F*A*o,r[1]=u+I*A*o+z,r[2]=d*(1-o)+1.2,r}if(t<.53){const o=(t-.47)/.06,a=.5*(L-g),C=.5*(P-u),T=Math.hypot(a,C),R=Math.sin(3.14159*o),E=Math.cos(3.14159*o);return r[0]=g+a+F*A-a*E+F*T*R,r[1]=u+C+I*A-C*E+I*T*R+z,r[2]=1.2*(1-R),r}if(t<.58){const o=(t-.53)/.05;return r[0]=L+F*A*(1-o),r[1]=P+I*A*(1-o)+z,r[2]=d*o+1.2,r}const H=f+(x+3)*Math.cos(M),N=s+(w+3)*Math.sin(M),_=(p-M)*(k+2.2)+d+1.2;if(t<.8){const o=(t-.58)/.22,a=G(p,M,o),C=G(1.5,3,o);return r[0]=f+(x+C)*Math.cos(a),r[1]=s+(w+C)*Math.sin(a)+z,r[2]=(p-a)*(k+2.2)+d+1.2,r}const D=(t-.8)/.2,q=f+20+1.3*e,K=-3;return r[0]=G(H,q,D),r[1]=N+(K-N)*G(D,D*D*(3-2*D),.6)+z*(1-D),r[2]=_+D*1.05*Math.hypot(H-q,N-K),r}function Lt(t){return c(518,540,t)}function Zt(t,e,n,h,i,r,v=[0,0,0]){const b=Xt(t,e,n,h,i*(1-r),v);if(r<=0)return b;const S=Math.max(e-2,2);let y,z;if(t<.5){const f=t/.5;y=G(-2,8,f),z=S*(.5-.5*Math.cos(3.14159*f))}else{const f=(t-.5)/.5;y=G(8,28+1.3*e,f),z=G(S,-3,f*f*(3-2*f))}return b[0]=G(b[0],y,r),b[1]=G(b[1],z,r),b}function Jt(t,e,n,h=[0,0,0]){const i=jt(n-t.w,t.e),r=Zt(e,Kt(n,t.w)*t.hs,i[0],i[1],Yt(t.w),Lt(t.w),h),v=r[0],b=r[1];return h[0]=t.rx+t.nx*v,h[1]=t.foot+b,h[2]=t.rz+t.nz*v,h}function Qt(t,e=300){const n=t.length,h=n-6,i=new l.Vector3,r=new l.Vector3,v=(s,x)=>{const w=Math.max(270,s);t.posAtDist(w,i),t.tangentAtDist(w,r);let W=Math.hypot(r.x,r.z)||1;const p=r.x/W,m=r.z/W,M=34*c(425,475,s)-22*c(n-75,n-10,s);return x[0]=i.x+p*(s-w)+-m*M,x[1]=i.z+m*(s-w)+p*M,x},b=s=>1+2.6*c(246,264,s)*(1-c(424,448,s)),S=[120];{let s=0;const x=4e3,w=[];let W=0;for(let m=0;m<x;m++)W+=b(120+(h-120)*(m+.5)/x),w.push(W);let p=0;for(let m=1;m<e;m++){const M=W*m/e;for(;w[p]<M;)p++;S.push(120+(h-120)*(p+1)/x)}S.push(h),s=0}const y=[],z=[0,0],f=[0,0];for(const s of S){v(s,z);const x=[z[0],z[1]];v(s-.5,z),v(s+.5,f);let w=f[0]-z[0],W=f[1]-z[1];const p=Math.hypot(w,W)||1;w/=p,W/=p;const m=G(.3,1,c(120,205,s))*G(1,.44,c(405,445,s))*G(1,.45,c(440,h,s)),M=8*(1-c(140,235,s))+it*c(398,440,s),d=Ut(s),A=Math.sqrt(c(120,134,s))*(1-c(h-16,h,s));y.push({w:s,rx:x[0],rz:x[1],nx:-W,nz:w,hs:m,foot:M,e:d,k:A})}return y}function te(){const t=[[0,.42,34],[.42,.47,4],[.47,.53,10],[.53,.58,4],[.58,.8,26],[.8,1,18]],e=[];for(const[n,h,i]of t)for(let r=0;r<i;r++)e.push(n+(h-n)*r/i);return e.push(1),e}const ee=`
attribute vec4 aRef, aCol;
varying vec3 vW; varying vec4 vS; varying vec4 vN;
${Z}
${vt}
void main(){
  float v = position.x;
  float G = hwFan(aCol.x), H = hwRise(uFlown, aCol.x) * aCol.y;
  vec2 cf = hwCurl(uFlown - aCol.x, aCol.w);
  float fo = hwFold(aCol.x), far = step(300., aCol.x);
  vec3 p = hwSection(v, H, cf.x, cf.y, G, fo);
  // the two ends: the tail's is drawn to a point under the water, the far one sinks by its height alone
  p.xy = mix(mix(vec2(9., -1.), vec2(p.x, -1.2), far), p.xy, position.z);
  vec2 tg = hwSection(min(v + .004, 1.), H, cf.x, cf.y, G, fo).xy - hwSection(max(v - .004, 0.), H, cf.x, cf.y, G, fo).xy;
  tg.y *= mix(1., position.z, far);       // the normal is the sunk section's own
  vec2 n2 = vec2(-tg.y, tg.x) / max(length(tg), 1e-4);
  vec3 wp = vec3(aRef.x + aRef.z * p.x, position.y + p.y, aRef.y + aRef.w * p.x);
  vec4 wpos = modelMatrix * vec4(wp, 1.);
  vW = wpos.xyz; vS = vec4(p.z, aCol.x, v, cf.x); vN = vec4(n2, aRef.zw);
  gl_Position = projectionMatrix * viewMatrix * wpos;
}`,oe=`
varying vec3 vW; varying vec4 vS; varying vec4 vN;
uniform float uSeed; uniform vec2 uVar, uVein;
${Z}
// one layer of foam veins: metres outside its nearest island (99 where none). x the ribs' own sliding coordinate, w metres
// along the wave, st the ribs' stretch there (1 + l / 25), cx the cell across the ribs (cells 14 to 24 m long, row by row);
// an island is 1.75 m by a third of its cell and more, has its place and size from its cell alone, and grows (g 1) or dwindles (g -1) between 24 and 40 m from the lip
float hwVein(float x, float w, float st, float cx, float salt, float g){
  float rh = hwHash(mod(floor(x / cx), 16.) * 3.71 + salt + 1.3), rl = 19. * (.75 + .5 * rh), r0 = hwHash(rh * 57.3);   // each row of cells: its own measure along the wave, its own start
  vec2 q = vec2(x / cx, w / rl + r0);
  vec2 qc = floor(q), qf = fract(q) - .5;
  float qh = hwHash(mod(qc.x, 16.) * 7.31 + qc.y * 13.7 + salt), qs = .7 + .3 * hwHash(qh * 91.7 + 3.), wc = (qc.y + .5 - r0) * rl;
  qf.y -= (hwHash(qh * 53.1 + 7.) - .5) * 2. * (.36 - .337 * qs);
  float lc = 25. * (st * exp(-qf.x * cx / 25.) - 1.), gr = smoothstep(24., 40., lc); gr = g > 0. ? gr : 1. - gr;
  float on = step(qh, uVein.x * smoothstep(180., 215., wc) * (1. - uVein.y * smoothstep(335., 410., wc))) * step(.08, gr);
  float hm = min(1.75 * pow(st, .6), .31 * cx * st) * qs * max(gr, .08);
  float qr = length(vec2(qf.x * cx * st / max(hm, 1e-3), qf.y / (.337 * qs * sqrt(max(gr, .08))))) + .1 * sin(w * .8 + x * 1.1 + qh * 40.);
  return on > .5 ? (qr - 1.) * hm : 99.;
}
void main(){
  float l = vS.x, w = vS.y, v = vS.z;
  vec3 ddx = dFdx(vW), ddy = dFdy(vW);
  float pxm = sqrt(max(min(dot(ddx, ddx), dot(ddy, ddy)), 1e-10));
  // ribs: bands .5 to .9 m, dark and mid by turns, slanting up into the lip, sliding toward it
  float x = 25. * log(1. + max(l, 0.) / 25.) + uVar.x * w + .3 * sin(w * .21 + l * .13 + uSeed) + 2.2 * uTime;
  float per = 1.5, f = fract(x / per), fw = fwidth(x) / per;
  float outer = step(.5, v);
  float fb = mix(mix(7. + 4. * abs(sin(w * .21 * uVar.y + uSeed)), 2. + 1.2 * abs(sin(w * .37 + uSeed)), vS.w), 3.4 + 3. * abs(sin(w * .23 * uVar.y + 1.7 * sin(w * .031 + uSeed))), outer);
  fb *= 1. - .45 * smoothstep(518., 540., w);          // the folded ridge's end (hwFold) carries a narrower cap of foam
  float e = l - fb, fe = fwidth(e);
  // silhouette in the section's own plane (the wave is a swept body: only its section curves)
  vec3 V = cameraPosition - vW;
  vec2 v2 = vec2(dot(V.xz, vN.zw), V.y); float along = length(v2) / max(length(V), 1e-4); v2 /= max(length(v2), 1e-4);
  vec2 n2 = vN.xy / max(length(vN.xy), 1e-4);
  float ndv = abs(dot(n2, v2)), fn = fwidth(ndv);
  float aw = clamp(fw, 1e-4, 1.);
  float kl = smoothstep(0., aw, f) * (1. - smoothstep(.093, .093 + aw, f));              // the cut line, 14 cm
  float slip = smoothstep(.093, .093 + aw, f) * (1. - smoothstep(.133, .133 + aw, f));   // the ink a finger short
  float dk = smoothstep(.133, .133 + aw, f) * (1. - smoothstep(.56, .56 + aw, f));
  vec3 mid = hwGrain(uMid, w, x, fw * per), dark = hwGrain(uDark, w, x, fw * per);
  vec3 col = mid; col = mix(col, dark, dk); col = mix(col, uPaper, slip); col = mix(col, uKey, kl);
  vec3 avg = uMid * .5 + uDark * .4 + uKey * .07 + uPaper * .03;
  col = mix(col, avg, smoothstep(.22, .5, fw));
  // FOAM VEINS (fix round 2: the trough's count of plain ribs forced it; the wave's law, section and claws are untouched):
  // long islands of lace lie in the ribs of the hollow's face from w 190 on and are drawn up into the lip with the ribs
  // (a loop on the clock: the pattern repeats every 16 cells of 5.25 m at 2.2 m/s), gathering toward the lip and
  // thinning toward the foot and along the hollow; paper to a scalloped edge, its cut line, its pale shadow, pale holes
  float st = 1. + max(l, 0.) / 25., fv = sqrt(dot(ddx, ddx)) + sqrt(dot(ddy, ddy)), far = (1. - outer) * (1. - smoothstep(1.2, 3., fv));
  float vz = min(hwVein(x, w, st, 5.25, 0., -1.), hwVein(x, w, st, 2.625, 5.3, 1.)); vz = mix(99., vz, far); fv = min(fv, max(fwidth(vz), 1e-4));
  col = mix(col, uPale, 1. - smoothstep(.4 - fv, .4 + fv, vz - .12));
  col = mix(col, uKey, hwLine(max(vz, 0.), .12, fv, 1.));
  vec2 hp = vec2(x * 1.2, w * 1.2); hp.x += .5 * mod(floor(hp.y), 2.); vec2 hc = floor(hp), hf = fract(hp) - .5;
  float hw2 = max(fwidth(hp.x) + fwidth(hp.y), 1e-4) * .7, hh = hwHash(mod(hc.x, 63.) * 7.31 + hc.y * 13.7), hd = length(hf) - (.1 + .2 * hh) * step(.3, hh);
  col = mix(col, mix(uPaper, uPale, (1. - smoothstep(-hw2, hw2, hd)) * smoothstep(.3, .55, -vz) * (1. - smoothstep(.25, .6, hw2))), 1. - smoothstep(-fv, fv, vz));
  // foam: bare paper to a scalloped edge, the cut line, the one printed shadow (pale blue) under it
  float sw = .14 * mix(3., 1., smoothstep(0., 7., l));
  float shadow = 1. - smoothstep(.75 - fe, .75 + fe, e - sw);
  col = mix(col, uPale, shadow);        // one printed shadow, a whole block: no rib shows through it
  col = mix(col, uKey, hwLine(max(e, 0.), sw, fe, 1.));
  col = mix(col, uPaper, 1. - smoothstep(-fe, fe, e));
  float fa = max(fwidth(along), 1e-4);   // the silhouette line ends in a cut, not a fade, where the eye looks along the wave
  col = mix(col, uKey, hwRim(ndv, 12., sw, pxm, fn) * smoothstep(.32 - fa, .32 + fa, along) * step(1.2, l));
  // THE LIP'S EDGE: one cut key line round the tip of the roll's nose (a half round of .75 m: v .47 to .53, so 39.27 m
  // of its arc to one of v). On the THROWN lip (the section's own curl, vS.w, over a half) it takes the tip and 60
  // degrees of the round to either side: from within or without the hollow that is .375 m of the lip's hanging edge.
  // On a STANDING section, whose nose looks down at the comer, it is a line .28 m wide along the tip and the rest of
  // the nose is the foam's paper. By the rule of every cut line.
  float tl = abs(v - .5) * 39.27;
  col = mix(col, uKey, hwLine(tl, mix(.14, .785, smoothstep(.5, 1., vS.w)), max(fwidth(tl), 1e-4), 1.));
  gl_FragColor = vec4(col, 1.);
}`;async function ae(t,e,n,h,i){const r=te(),v=r.length,b=e.length,S=new Float32Array(v*b*3),y=new Float32Array(v*b*4),z=new Float32Array(v*b*4);for(let p=0;p<b;p++){const m=e[p];for(let M=0;M<v;M++){const d=p*v+M;S[d*3]=r[M],S[d*3+1]=m.foot,S[d*3+2]=m.k,y[d*4]=m.rx,y[d*4+1]=m.rz,y[d*4+2]=m.nx,y[d*4+3]=m.nz,z[d*4]=m.w,z[d*4+1]=m.hs,z[d*4+2]=m.foot,z[d*4+3]=m.e}p%60===59&&await t.yield()}const f=new Uint32Array((v-1)*(b-1)*6);let s=0;for(let p=0;p<b-1;p++){for(let m=0;m<v-1;m++){const M=p*v+m,d=M+v;f[s++]=M,f[s++]=d,f[s++]=M+1,f[s++]=M+1,f[s++]=d,f[s++]=d+1}p%60===59&&await t.yield()}const x=new l.BufferGeometry;x.setAttribute("position",new l.BufferAttribute(S,3)),x.setAttribute("aRef",new l.BufferAttribute(y,4)),x.setAttribute("aCol",new l.BufferAttribute(z,4)),x.setIndex(new l.BufferAttribute(f,1));const w=new l.ShaderMaterial({uniforms:{...n,uSeed:{value:h},uVar:{value:i},uVein:{value:new l.Vector2(.95,.6)}},vertexShader:ee,fragmentShader:oe,side:l.DoubleSide}),W=new l.Mesh(x,w);return W.frustumCulled=!1,W.name="wave-sheet",W}const Pt=.3;function Ft(t=0){t===!0&&(t=1),t===!1&&(t=0);const e=[],n=[],h=[],i=[],r=(s,x,w,W,p,m,M,d,A)=>{const k=H=>{let N=s,_=x;const D=24;for(let q=0;q<D;q++){const K=(q+.5)/D*H,o=w+p*Math.pow(K,1.6);N+=Math.sin(o)*W*H/D,_+=Math.cos(o)*W*H/D}return[N,_,w+p*Math.pow(H,1.6)]},g=H=>m*Math.pow(1-H,.5)*(.78+.22*Math.min(1,H*5)),u=e.length/3;for(let H=0;H<M.length;H++){const N=M[H],[_,D,q]=k(N),K=g(N),o=Math.cos(q),a=-Math.sin(q),C=d+A*N;e.push(_-o*K,D-a*K,0,_+o*K,D+a*K,0,_,D,K*Pt),n.push(o,a,0,o,a,0,o,a,0),h.push(C,K,-1,C,K,1,C,K,0)}const[L,P,F]=k(1);e.push(L,P,0),n.push(Math.cos(F),-Math.sin(F),0),h.push(d+A,.004,0);const I=e.length/3-1;for(let H=0;H<M.length-1;H++)for(let N=0;N<3;N++){const _=u+H*3+N,D=u+H*3+(N+1)%3;i.push(_,D,_+3,D,D+3,_+3)}const O=u+(M.length-1)*3;for(let H=0;H<3;H++)i.push(O+H,O+(H+1)%3,I);return{at:k,rad:g}},v=[10,6,4][t],b=[.95,.86,.75][t],S=Array.from({length:v},(s,x)=>{const w=x/(v-1);return b*(1.15*w-.15*w*w)}),y=r(0,0,-.25,1,1.9,.235,S,0,1),z=[[[.36,.33,.092],[.55,.28,.08],[.72,.22,.065]],[[.4,.33,.092],[.62,.26,.075]],[[.5,.32,.09]]][t];for(const[s,x,w]of z){const[W,p,m]=y.at(s),M=y.rad(s);r(W-Math.cos(m)*M*.45,p+Math.sin(m)*M*.45,m-.5,x,1.6,w,t===0?[0,.45,.8]:[0,.55],s,.5)}const f=new l.BufferGeometry;return f.setAttribute("position",new l.Float32BufferAttribute(e,3)),f.setAttribute("normal",new l.Float32BufferAttribute(n,3)),f.setAttribute("aHook",new l.Float32BufferAttribute(h,3)),f.setIndex(i),f}const ne=`
varying vec3 vB;                         // signed metres across the body as seen, half-width as seen (m), ink index
uniform float uLineW, uLine;
${Z}
void main(){
  float fe = fwidth(vB.x), e = vB.y - abs(vB.x);
  vec3 col = hwInk(vB.z);
  float W = min(max(uLineW, 1.8 * fe), .5 * vB.y), op = clamp(W / max(1.8 * fe, 1e-5), .4, 1.);
  W = max(W, min(1.8 * fe, vB.y));
  col = mix(col, uKey, (1. - smoothstep(W - .6 * fe, W + .6 * fe, e)) * op * uLine);
  gl_FragColor = vec4(col, 1.);
}`,Ht=`
// (signed metres across the claw as seen from the eye, half-width as seen: the outline lies at +- that). Vg: direction to
// the eye in the claw's own space, nh the in-plane normal, ca the corner (-1 | 1 edge, 0 ridge), r the half-width (m).
vec2 hwClawEdge(vec3 Vg, vec3 nh, float ca, float pz, float r){
  float h = r * ${Pt.toFixed(2)};
  vec2 q = vec2(dot(Vg, nh), Vg.z); q /= max(length(q), 1e-4);
  return vec2((1. - abs(ca)) * sign(pz) * h * q.x - ca * r * q.y, max(r * abs(q.y), h * abs(q.x)));
}`,It=`
varying vec3 vB; varying vec2 vS;
uniform float uLineW;
${Z}
void main(){
  float fe = max(fwidth(vB.x), 1e-5), e = vB.y - abs(vB.x), fs = max(fwidth(vS.x), 1e-4);
  vec3 col = mix(uPaper, uPale, smoothstep(.66 - fs, .66 + fs, vS.x) * smoothstep(3., 7., vB.y / fe));   // the shadow is left out of a claw under a few pixels wide
  float W = min(max(uLineW, 1.5 * fe), .2 * vB.y);
  col = mix(col, uKey, 1. - smoothstep(W - .6 * fe, W + .6 * fe, e));
  gl_FragColor = vec4(col, 1.);
}`,se=`
attribute vec4 aRef, aCol, aClaw;      // aClaw: length m, splay rad (its place in the hand), pitch rad, phase
attribute vec2 aClaw2;                 // turn of the flat about the claw's length rad, how far it swings down with the throw rad
attribute vec3 aHook;
varying vec3 vB; varying vec2 vS;
${Z}
${vt}
${Ht}
void main(){
  float G = hwFan(aCol.x), H = hwRise(uFlown, aCol.x) * aCol.y;
  vec2 cf = hwCurl(uFlown - aCol.x, aCol.w);
  float fo = hwFold(aCol.x);
  vec2 a = hwSection(.47, H, cf.x, cf.y, G, fo).xy, b = hwSection(.53, H, cf.x, cf.y, G, fo).xy, m = hwSection(.5, H, cf.x, cf.y, G, fo).xy;
  vec2 td = m - .5 * (a + b); td /= max(length(td), 1e-4);
  vec2 inw = vec2(-td.y, td.x);          // square to the throw, toward the section's middle
  float pit = aClaw.z - aClaw2.y * cf.x;    // standing on the crest, hanging from the thrown lip
  float cp = cos(pit), sp = sin(pit);
  vec2 t2 = td * cp - inw * sp, i2 = inw * cp + td * sp;
  vec3 Nw = vec3(aRef.z, 0., aRef.w), Sw = vec3(-aRef.w, 0., aRef.z);
  vec3 Tw = Nw * t2.x + vec3(0., t2.y, 0.), Iw = Nw * i2.x + vec3(0., i2.y, 0.);
  // the hand: the claw leans along the crest by its place in the fan; then its flat turns about its own length
  float cs = cos(aClaw.y), ss = sin(aClaw.y);
  vec3 T1 = Tw * cs + Sw * ss, S1 = Sw * cs - Tw * ss;
  float ct = cos(aClaw2.x), st = sin(aClaw2.x);
  vec3 Ix = Iw * ct + S1 * st, Sx = S1 * ct - Iw * st;
  // the medium moves: curl and uncurl by a fifth of the length, in a ripple along the crest
  float t = aHook.x, ang = mix(.32, .58, cf.x) * sin(uTime * 1.3 + aCol.x * .35 + aClaw.w) * t * sqrt(t);   // the hanging claws of the thrown lip curl and uncurl more
  float ca = cos(ang), sa = sin(ang);
  vec3 p = vec3(position.x * ca + position.y * sa, -position.x * sa + position.y * ca, position.z);
  vec2 root = mix(.5 * (a + b), m, .6);
  vec3 wp = vec3(aRef.x + aRef.z * root.x, aCol.z + root.y, aRef.y + aRef.w * root.x) + (Ix * p.x + T1 * p.y + Sx * p.z) * aClaw.x;
  vec4 wpos = modelMatrix * vec4(wp, 1.);
  vec3 Vw = (cameraPosition - wpos.xyz) * mat3(modelMatrix);
  vec3 Vl = vec3(dot(Vw, Ix), dot(Vw, T1), dot(Vw, Sx));
  vB = vec3(hwClawEdge(vec3(Vl.x * ca - Vl.y * sa, Vl.x * sa + Vl.y * ca, Vl.z), normal, aHook.z, position.z, aHook.y * aClaw.x), 0.);
  vS = vec2(aHook.z, aHook.x);
  gl_Position = projectionMatrix * viewMatrix * wpos;
}`;function re(t,e,n,h){const i=Ft(0),r=e[0].w,v=e[e.length-1].w,b=[],S=[],y=d=>{let A=0,k=e.length-1;for(;k-A>1;){const I=A+k>>1;e[I].w<=d?A=I:k=I}const g=e[A],u=e[k],L=Math.min(1,Math.max(0,(d-g.w)/Math.max(u.w-g.w,1e-6))),P={};for(const I of["w","rx","rz","nx","nz","hs","foot","e"])P[I]=G(g[I],u[I],L);const F=Math.hypot(P.nx,P.nz)||1;return P.nx/=F,P.nz/=F,P};let z=0;for(let d=8+16*Math.ceil((r+8)/16);d<v-10;d+=16){const A=y(d).e>.5,k=t.range(-.12,.12);for(let g=0;g<2;g++){const u=g?8:A?11:9;for(let L=0;L<u;L++,z++){const P=(L+(g?.5:0)+t.range(-.18,.18))/(g?u:u-1)-.5,F=y(d+P*14.6),I=1-Math.pow(Math.min(1,Math.abs(2*P)),1.3),O=.55+.45*Math.min(1,F.hs*1.15),H=t.range(.86,1),N=t(),_=t(),D=t.range(0,6.283);let q=A?(g?G(2,3.2,N):G(2.3,5,I))*H:(g?G(3,4.4,N):G(3.2,7,I))*H*O;q=A?Math.max(2,q):F.hs>=.4?Math.max(3,q):q,q*=1-.4*Lt(F.w),F.w>228&&F.w<268&&(q=Math.min(q,5)),F.w>r+12&&(z*.61803%1<h||!g&&L===u>>1)&&(b.push([F,q,g?P*.7+k:P*1.5+k,g?G(.95,1.45,_):G(2,2.45,_)-.25*Math.abs(P),D,A?-.85+(N-.5)*.7:1.5708+(N-.5)*.9,g?1.15:1.95]),S.push({col:F,len:q,splay:b[b.length-1][2],pitch:b[b.length-1][3]}))}}}const f=b.length,s=new Float32Array(f*4),x=new Float32Array(f*4),w=new Float32Array(f*4),W=new Float32Array(f*2);b.forEach(([d,A,k,g,u,L,P],F)=>{s.set([d.rx,d.rz,d.nx,d.nz],F*4),x.set([d.w,d.hs,d.foot,d.e],F*4),w.set([A,k,g,u],F*4),W.set([L,P],F*2)});const p=new l.InstancedBufferGeometry;p.index=i.index,p.attributes.position=i.attributes.position,p.attributes.aHook=i.attributes.aHook,p.attributes.normal=i.attributes.normal,p.setAttribute("aRef",new l.InstancedBufferAttribute(s,4)),p.setAttribute("aCol",new l.InstancedBufferAttribute(x,4)),p.setAttribute("aClaw",new l.InstancedBufferAttribute(w,4)),p.setAttribute("aClaw2",new l.InstancedBufferAttribute(W,2)),p.instanceCount=f;const m=new l.ShaderMaterial({uniforms:{...n,uLineW:{value:.07}},vertexShader:se,fragmentShader:It,side:l.DoubleSide}),M=new l.Mesh(p,m);return M.frustumCulled=!1,M.name="wave-claws",{mesh:M,list:S}}const ie=`
attribute vec4 aRef, aCol, aDot;       // aDot: reach along the throw m, drift out m, drift along m, phase
attribute vec3 aDot2;                  // radius m, period s, 1 where the section may shed while standing
varying vec3 vB;
${Z}
${vt}
void main(){
  float G = hwFan(aCol.x), H = hwRise(uFlown, aCol.x) * aCol.y;
  vec2 cf = hwCurl(uFlown - aCol.x, aCol.w);
  float fo = hwFold(aCol.x);
  vec2 a = hwSection(.47, H, cf.x, cf.y, G, fo).xy, b = hwSection(.53, H, cf.x, cf.y, G, fo).xy, m = hwSection(.5, H, cf.x, cf.y, G, fo).xy;
  vec2 td = m - .5 * (a + b); td /= max(length(td), 1e-4);
  float gate = max(smoothstep(.9, 1., cf.x), (1. - smoothstep(0., .05, cf.x)) * aDot2.z);
  float tau = fract(uTime / max(aDot2.y, .5) + aDot.w);
  float sz = aDot2.x * sqrt(max(sin(3.14159 * tau), 0.)) * gate;
  vec2 tip = m + td * aDot.x;
  float y = max(tip.y, 0.) + 3. * tau - (max(tip.y, 0.) + 3.) * tau * tau;
  float aa = min(tip.x, m.x) - aDot.y * tau;
  vec3 wp = vec3(aRef.x + aRef.z * aa, aCol.z + y, aRef.y + aRef.w * aa) + vec3(-aRef.w, 0., aRef.z) * aDot.z * tau + position * sz;
  vec4 wpos = modelMatrix * vec4(wp, 1.);
  vB = vec3(0., 9., 0.);
  gl_Position = projectionMatrix * viewMatrix * wpos;
}`,le=80;function ce(t,e,n,h){const i=Math.round(600*h),r=[[],[]],v=[];for(let y=0;y<i;y++){const z=e[Math.floor(t()*e.length)%e.length],f=z.col,s=[z.len*t.range(.5,.9),t.range(.3,2.6),t.range(-1.5,1.5),t()];let x=t.range(.03,.15)*(t.chance(.25)?1:.6);const w=f.w<226||f.w>456?1:0,W=t.range(4,7.5),p=x>.08&&r[0].length<le;p||(x=Math.min(x,.08)),r[p?0:1].push({c:f,d:s,r:x,per:W,free:w}),v.push({col:f,reach:s[0],out:s[1],along:s[2],r:x,free:w})}const b=new l.ShaderMaterial({uniforms:{...n,uLineW:{value:.01},uLine:{value:0}},vertexShader:ie,fragmentShader:ne});return{meshes:r.map((y,z)=>{const f=z?new l.IcosahedronGeometry(1,0):new l.SphereGeometry(1,12,6),s=Math.max(y.length,1),x=new Float32Array(s*4),w=new Float32Array(s*4),W=new Float32Array(s*4),p=new Float32Array(s*3);y.forEach((d,A)=>{const k=d.c;x.set([k.rx,k.rz,k.nx,k.nz],A*4),w.set([k.w,k.hs,k.foot,k.e],A*4),W.set(d.d,A*4),p.set([d.r,d.per,d.free],A*3)}),y.length||p.set([0,5,0]);const m=new l.InstancedBufferGeometry;m.index=f.index,m.attributes.position=f.attributes.position,m.setAttribute("aRef",new l.InstancedBufferAttribute(x,4)),m.setAttribute("aCol",new l.InstancedBufferAttribute(w,4)),m.setAttribute("aDot",new l.InstancedBufferAttribute(W,4)),m.setAttribute("aDot2",new l.InstancedBufferAttribute(p,3)),m.instanceCount=s;const M=new l.Mesh(m,b);return M.frustumCulled=!1,M.name=z?"wave-dots":"wave-dots-ball",M}),lanes:v}}function he(t,e={}){const n=e.top||t.uMid.value,h=e.low||Bt(t.uPaper.value,t.uYel.value,.5),i={...t,uTop:{value:new l.Color(n)},uLow:{value:new l.Color(h)}},r=new l.ShaderMaterial({uniforms:i,side:l.BackSide,depthWrite:!1,depthTest:!1,vertexShader:`varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.);
      if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fragmentShader:`varying vec3 vD; uniform vec3 uTop, uLow;
${Z}
void main(){
  vec3 d = vD / max(length(vD), 1e-4);
  float el = degrees(asin(clamp(d.y, -1., 1.)));
  float az = atan(d.z, abs(d.x) + 1e-4);
  // level streaks of the block's grain; they breathe a little, as a wipe does from pull to pull
  float g = hwNoise(vec2(az * 3., el * 2.2 + 17.)) * .6 + hwNoise(vec2(az * 9., el * 7. + 3.)) * .4;
  float br = .6 * sin(uTime * .21 + az * 2.);
  float t = smoothstep(18., 40., el + (g - .5) * 5. + br);
  float l = 1. - smoothstep(1.5, 9., el + (g - .5) * 2.5 + .5 * br);
  vec3 col = uPaper;
  col = mix(col, uLow, l);                 // uLow is the low wipe's ink already laid over paper
  col = hwOver(col, uTop / max(uPaper, vec3(.05)), t);  // the top wipe: mid blue reached at full strength
  gl_FragColor = vec4(col, 1.);
}`}),v=new l.Mesh(new l.SphereGeometry(1,24,16),r);return v.renderOrder=e.renderOrder??-10,v.frustumCulled=!1,v.name="paper-sky",v.userData.uniforms=i,v}const fe=`
varying vec3 vW, vN, vL;
void main(){ vL = position; vec4 wpos = modelMatrix * vec4(position, 1.); vW = wpos.xyz; vN = mat3(modelMatrix) * normal;
  gl_Position = projectionMatrix * viewMatrix * wpos; }`,ue=`
varying vec3 vW, vN, vL;
uniform float uSeed;
${Z}
void main(){
  float r = length(vL.xy), th = atan(vL.y, vL.x + step(r, 1e-4));
  vec3 ddx = dFdx(vW), ddy = dFdy(vW);
  float pxm = sqrt(max(min(dot(ddx, ddx), dot(ddy, ddy)), 1e-10));
  // spiral ribs: 15 bands to the turn; the seam of atan is hidden by taking the footprint from r alone
  float per = 1.5, x = (r - 11.) + abs(vL.z) * .6 + 3.58099 * th + 2.2 * uTime;
  float f = fract(x / per), fw = clamp(1.6 * pxm / per, 1e-4, 1.);
  float isEye = step(r, 11.45) * step(abs(vL.z), .2);
  float fb = .9 + 1.1 * abs(sin(th * 11. + uSeed));
  float e = (r - 11.) + abs(vL.z) * .5 - fb, fe = max(1.6 * pxm, 1e-4);
  vec3 V = cameraPosition - vW; V /= max(length(V), 1e-4);
  vec3 n = vN / max(length(vN), 1e-4);
  float ndv = abs(dot(n, V)), fn = fwidth(ndv);
  float kl = smoothstep(0., fw, f) * (1. - smoothstep(.093, .093 + fw, f));
  float slip = smoothstep(.093, .093 + fw, f) * (1. - smoothstep(.133, .133 + fw, f));
  float md = smoothstep(.62, .62 + fw, f);
  vec3 dark = hwGrain(uDark, th * r, x, fw * per), mid = hwGrain(uMid, th * r, x, fw * per);
  vec3 col = mix(dark, mid, md); col = mix(col, uPaper, slip); col = mix(col, uKey, kl);
  col = mix(col, uDark * .62 + uMid * .28 + uKey * .07 + uPaper * .03, smoothstep(.22, .5, fw));
  col = mix(col, uPale, 1. - smoothstep(.6 - fe, .6 + fe, e - .14));
  col = mix(col, uKey, hwLine(max(e, 0.), .14, fe, 1.));
  col = mix(col, uPaper, 1. - smoothstep(-fe, fe, e));
  // the rim's own foam: paper to a scalloped edge, the cut line, the printed shadow
  float eo = (22. - r) - abs(vL.z) * .15 - (.5 + 1.1 * abs(sin(th * 9. + uSeed * 2.)));
  col = mix(col, uPale, 1. - smoothstep(.5 - fe, .5 + fe, eo - .14));
  col = mix(col, uKey, hwLine(max(eo, 0.), .14, fe, 1.));
  col = mix(col, uPaper, 1. - smoothstep(-fe, fe, eo));
  col = mix(col, uKey, hwRim(ndv, 3., .3, pxm, fn));
  // the eye: bare paper, a cut line round the opening
  vec3 eye = mix(uPaper, uKey, hwLine(max(r - 7., 0.), .14, fe, .5));
  gl_FragColor = vec4(mix(col, eye, isEye), 1.);
}`,pe=`
attribute vec4 aW;                     // angle, phase, length m, 0 fixed round the eye | 1 running inward
attribute vec3 aHook;
varying vec3 vB; varying vec2 vS;
${Z}
${Ht}
void main(){
  float run = step(.5, aW.w) * (1. - step(1.5, aW.w)), outr = step(1.5, aW.w), tau = fract(uTime / 9. + aW.y);
  float r = mix(mix(11.5, mix(21.2, 11.8, tau), run), 21.4, outr), th = aW.x + 2.65 * tau * run;
  float len = aW.z * mix(1., sin(3.14159 * tau), run);      // born small at the rim, gone to nothing at the eye
  float rr = clamp((r - 16.5) / 5.5, -1., 1.), z = mix(mix(1.3, 3. * sqrt(max(1. - rr * rr, 0.)) + .1, run), .7, outr) * sign(aW.z);
  vec3 rh = vec3(cos(th), sin(th), 0.), thh = vec3(-rh.y, rh.x, 0.), zh = vec3(0., 0., sign(aW.z));
  vec3 T = normalize(mix(-rh * .85 + thh * .4, rh * .8 - thh * .55, outr) + zh * .28 * run), hd = mix(thh, -thh, outr), X = normalize(hd - T * dot(hd, T)), S = cross(T, X);
  float t = aHook.x, ang = .32 * sin(uTime * 1.3 + aW.x * 5. + aW.y * 6.283) * t * sqrt(t);
  float ca = cos(ang), sa = sin(ang);
  vec3 p = vec3(position.x * ca + position.y * sa, -position.x * sa + position.y * ca, position.z);
  vec3 lp = rh * r + vec3(0., 0., z) + (X * p.x + T * p.y + S * p.z) * abs(len);
  vec4 wpos = modelMatrix * vec4(lp, 1.);
  vec3 Vw = (cameraPosition - wpos.xyz) * mat3(modelMatrix);
  vec3 Vl = vec3(dot(Vw, X), dot(Vw, T), dot(Vw, S));
  vB = vec3(hwClawEdge(vec3(Vl.x * ca - Vl.y * sa, Vl.x * sa + Vl.y * ca, Vl.z), normal, aHook.z, position.z, aHook.y * abs(len)), 0.);
  vS = vec2(aHook.z, aHook.x);
  gl_Position = projectionMatrix * viewMatrix * wpos;
}`;function we(t,e,n,h){const i=new l.Group;i.name="wheel";const r=[],v=[],b=[],S=96,y=20;for(let g=0;g<=S;g++){const u=g/S*Math.PI*2,L=Math.cos(u),P=Math.sin(u);for(let F=0;F<=y;F++){const I=F/y*Math.PI*2,O=Math.cos(I),H=Math.sin(I),N=Math.sign(O)*Math.pow(Math.abs(O),.75),_=Math.sign(H)*Math.pow(Math.abs(H),.75),D=16.5+5.5*N;r.push(L*D,P*D,3*_);const q=Math.hypot(O/5.5,H/3)||1;v.push(L*O/5.5/q,P*O/5.5/q,H/3/q)}}for(let g=0;g<S;g++)for(let u=0;u<y;u++){const L=g*(y+1)+u,P=L+y+1;b.push(L,P,L+1,L+1,P,P+1)}const z=r.length/3;for(let g=0;g<=S;g++){const u=g/S*Math.PI*2,L=Math.cos(u),P=Math.sin(u);r.push(L*7,P*7,0,L*11.4,P*11.4,0),v.push(0,0,1,0,0,1)}for(let g=0;g<S;g++){const u=z+g*2;b.push(u,u+1,u+2,u+1,u+3,u+2)}const f=new l.BufferGeometry;f.setAttribute("position",new l.Float32BufferAttribute(r,3)),f.setAttribute("normal",new l.Float32BufferAttribute(v,3)),f.setIndex(b);const s=new l.Mesh(f,new l.ShaderMaterial({uniforms:{...e,uSeed:{value:h}},vertexShader:fe,fragmentShader:ue,side:l.DoubleSide}));s.frustumCulled=!1,i.add(s);const x=Ft(1),w=Math.round(64*n),W=Math.round(40*n),p=Math.round(56*n),m=w+W+p,M=new Float32Array(m*4),d=[];for(let g=0;g<m;g++){const u=g<w,L=g>=w+W,P=u?g/w*Math.PI*2+t.range(-.03,.03):L?(g-w-W)/p*Math.PI*2+t.range(-.04,.04):t.range(0,Math.PI*2),F=(u?t.range(1.4,2):L?t.range(3,5):t.range(1.6,2.5))*((u||L)&&g%3===2?-1:1);M.set([P,t(),F,u?0:L?2:1],g*4),d.push({th:P,len:F,kind:u?0:L?2:1})}const A=new l.InstancedBufferGeometry;A.index=x.index,A.attributes.position=x.attributes.position,A.attributes.aHook=x.attributes.aHook,A.attributes.normal=x.attributes.normal,A.setAttribute("aW",new l.InstancedBufferAttribute(M,4)),A.instanceCount=m;const k=new l.Mesh(A,new l.ShaderMaterial({uniforms:{...e,uLineW:{value:Wt.claw[0]}},vertexShader:pe,fragmentShader:It,side:l.DoubleSide}));return k.frustumCulled=!1,i.add(k),{group:i,list:d}}const me=`
attribute vec4 aPrint;
varying vec3 vW, vN; varying vec4 vP;
void main(){
  vec4 lp = vec4(position, 1.);
  #ifdef USE_INSTANCING
  lp = instanceMatrix * lp;
  #endif
  vec4 wpos = modelMatrix * lp; vW = wpos.xyz; vP = aPrint;
  #ifdef USE_INSTANCING
  vN = mat3(modelMatrix) * (mat3(instanceMatrix) * normal);
  #else
  vN = mat3(modelMatrix) * normal;
  #endif
  gl_Position = projectionMatrix * viewMatrix * wpos;
}`,de=`
varying vec3 vW, vN; varying vec4 vP;
uniform float uLineW, uSlip, uRibs, uRibInk, uPer, uSpeed, uRimR, uOverInk, uOver, uHatch, uThin;
${Z}
void main(){
  vec3 ddx = dFdx(vW), ddy = dFdy(vW);
  float pxm = sqrt(max(min(dot(ddx, ddx), dot(ddy, ddy)), 1e-10));
  float e = vP.y, fe = fwidth(e);
  float per = max(uPer, .05), x = vP.z + uSpeed * uTime, fx = clamp(fwidth(vP.z) / per, 1e-4, 1.), f = fract(x / per);
  float fg = fwidth(vP.w);
  vec3 V = cameraPosition - vW; V /= max(length(V), 1e-4);
  vec3 n = vN / max(length(vN), 1e-4);
  float ndv = abs(dot(n, V)), fn = fwidth(ndv);
  vec3 a = hwInk(vP.x), b = hwInk(uRibInk);
  float band = smoothstep(.5, .5 + fx, f) * (1. - smoothstep(1. - fx, 1., f));
  vec3 col = mix(a, mix(mix(a, b, band), .5 * (a + b), smoothstep(.22, .5, fx)), uRibs);
  col = hwOver(col, hwInk(uOverInk), uOver);
  col = mix(col, hwGrain(col, vP.z, vP.w, fg), step(.5, vP.x));        // paper carries no grain
  // hatching (rock): short cut strokes down the face, in patches; strokes finer than 3 px are left out
  float hx = vP.w * 1.9, hc = floor(hx), hfw = clamp(fwidth(hx), 1e-4, 1.);
  float hon = step(.42, hwHash(hc)) * step(fract(vP.z * .21 + hwHash(hc + 7.)), .36);
  col = mix(col, uKey, (1. - smoothstep(.11, .11 + hfw, abs(fract(hx) - .5))) * hon * (1. - smoothstep(.3, .6, hfw)) * uHatch);
  float W = max(uLineW, 1.5 * fe);
  col = mix(col, uPaper, (1. - smoothstep(W + uSlip - fe, W + uSlip + fe, e)) * step(fe, uSlip * 2.));   // the slip
  col = mix(col, uKey, hwLine(e, uLineW, fe, 4.) * mix(1., clamp(uLineW / max(1.5 * fe, 1e-5), .22, 1.), uThin));
  col = mix(col, uKey, hwRim(ndv, max(uRimR, .01), uLineW, pxm, fn) * step(.001, uRimR));
  gl_FragColor = vec4(col, 1.);
}`;function ve(t,e={}){const n=Wt[e.size||"boat"];return new l.ShaderMaterial({vertexShader:me,fragmentShader:de,side:e.side??l.DoubleSide,uniforms:{...t,uLineW:{value:e.lineWidth??n[0]},uSlip:{value:e.slip??n[1]},uRibs:{value:e.ribs?1:0},uRibInk:{value:e.ribInk??rt.dark},uPer:{value:e.period??1.4},uSpeed:{value:e.speed??0},uRimR:{value:e.rim??0},uOverInk:{value:e.overInk??rt.key},uOver:{value:e.over??0},uHatch:{value:e.hatch??0},uThin:{value:e.thin??0}}})}function xe(t,e){const n=[],h=[],i=[],r=[],v=[-46,-24,-6,14];let b=0;for(let z=0;z<t.length;z+=3){const f=t[z];if(!(f.w<215||f.w>436)){for(const s of v)n.push(f.rx+f.nx*s,f.foot+.02,f.rz+f.nz*s),h.push(0,1,0),i.push(rt.mid,46+s,s,f.w);if(b>0){const s=(b-1)*4,x=b*4;for(let w=0;w<3;w++)r.push(s+w,x+w,s+w+1,s+w+1,x+w,x+w+1)}b++}}const S=new l.BufferGeometry;S.setAttribute("position",new l.Float32BufferAttribute(n,3)),S.setAttribute("normal",new l.Float32BufferAttribute(h,3)),S.setAttribute("aPrint",new l.Float32BufferAttribute(i,4)),S.setIndex(r);const y=new l.Mesh(S,ve(e,{size:"wave",ribs:1,ribInk:rt.dark,period:2.6,speed:1.2,lineWidth:0,slip:0}));return y.name="trough-floor",y.frustumCulled=!1,y}async function be(t,e={}){const n=t.rng.fork?t.rng.fork("hollow-hero"):t.rng,h=Math.min(1,Math.max(.6,e.detail??t.quality?.detail??1)),i=e.uniforms||Gt(e.palette||dt),r=Ot(),v=e.path||t.core.makePath(r),b=Qt(v),S=n.range(0,6.283),y=new l.Group;y.name="hollow-of-the-wave-hero";const z=e.flown??0,f=e.zoom??1,s=e.look??0;i.uFlown.value=z,await t.yield();const x=new l.Vector2(n.range(.42,.68),n.range(.8,1.25)),w=await ae(t,b,i,S,x);y.add(w),await t.yield();const W=re(n,b,i,h);y.add(W.mesh),await t.yield();const p=ce(n,W.list,i,h);for(const u of p.meshes)y.add(u);(e.sky??!e.path)&&y.add(he(i,{renderOrder:-.5})),await t.yield();const m=we(n,i,h,S);{const u=v.frameAt(1,new l.Matrix4);m.group.applyMatrix4(u)}m.group.updateMatrixWorld(!0),y.add(m.group),await t.yield(),(e.apron??!0)&&y.add(xe(b,i));const M=u=>v.posAtDist(u,new l.Vector3),d=s?M(s):new l.Vector3(0,20,0),A=v.tangentAtDist(v.length,new l.Vector3),k=u=>({metre:u,position:M(u)}),g={entry:{position:M(0),course:v.tangentAtDist(0,new l.Vector3)},flyThrough:r.map(u=>new l.Vector3(u[0],u[1],u[2])),portalSeat:{position:M(v.length),facing:A.clone().negate(),radius:7},wheel:{center:M(v.length),axis:A.clone(),outerRadius:22,eyeRadius:11,thickness:6},viewpoints:{swells:k(60),crest:k(120),faceOn:k(187),trough:k(250),hollow:k(340),lee:k(440),wheel:k(500)},hollow:{from:290,to:414,face:12.5,crown:24,lipEdge:[-10.5,11]},spit:{from:400,to:500,right:[2,36]},sea:it};return{object:y,radius:200*f,height:50*(s?f*3:1),center:d,anchors:g,uniforms:i,path:v,cols:b,parts:{claws:W.list,dots:p.lanes,wheel:m.list},setFlown(u){i.uFlown.value=u},setProgress(u){i.uFlown.value=u*v.length},lineAt(u,L=new l.Vector3){return v.posAtDist(u,L)},sectionAt(u,L,P,F=[0,0,0]){let I=0;for(;I<b.length-2&&b[I+1].w<u;)I++;return Jt(b[I],L,P,F)},update(u,L,P){i.uTime.value=L},dispose(){},ground:!1,groundY:0}}function Me(t){const e=t.posAtDist(0,new l.Vector3),n=t.length,h=new l.Vector3,i=new l.Vector3,r=o=>t.posAtDist(Math.min(Math.max(o,0),n),h).y,v=(o,a,C=[0,0])=>{t.posAtDist(o,h),t.tangentAtDist(o,i);const T=Math.hypot(i.x,i.z)||1;return C[0]=h.x+-i.z/T*a,C[1]=h.z+i.x/T*a,C},b=(o,a)=>a-.22*o+5*(Math.sin(o*.023+1.1)-Math.sin(1.1)),S=(o,a,C)=>{const T=(o-a)/C;return Math.exp(-T*T)},y={},z={X:5.8,k:2,amp:2.7,sig:3},f=[[1,1,1],[1,1,1],[1,1,1],[.75,.6,.8],[1.35,1,1],[.35,.5,.4],[1.15,.85,1],[.8,.7,.8],[1,1,1]],s=o=>f[o]||f[0],x=(o,a,C,T)=>{const R=c(9,34,Math.abs(T)),E=Math.max(0,Math.sin(o*.071+a*2.4))*Math.max(0,Math.sin(o*.029-a*1.3+.6)),B=s(a)[0];let V=(3+3.6*R*E*E-.5*R)*(B>1?1+(B-1)*c(4,14,Math.abs(T)):B);return a===z.k&&(V+=z.amp*S(o,z.X,z.sig)),V},w=[[229,3.4],[252,3.2],[273,2.8]],W=[[217,-16,2.6,9,0],[219,5,2.2,6,0],[240,-24,2.8,11,0],[241,2,2.4,7,0],[262,-14,2.8,10,0],[263,-38,2.6,8,0],[262.5,6,2.2,5,0],[284,-9,9,2.4,1],[287,-24,11,3,1],[291,5.5,8,2,1],[309,-16,10,2.6,1],[313,3.5,8,2,1],[207,-12,2.4,8,0],[228.5,-44,2.4,7,0],[250,-48,2.6,7,0],[274,3,2.2,5,0],[300,-32,10,3,1],[322,-8,8,2.2,1],[325.5,-26,4.5,2.6,1],[240.5,11,2.2,4,0],[218.5,12.5,2,3,0],[239.5,-46,2.6,8,0],[297,10.5,9,2.2,1],[317,11.5,8,2,1],[299,-7,6,2,1]],p=[[462,-9,8,2.2,1],[488,-14,9,2.6,1],[503,6.8,8,2,1],[512,-8,9,2.4,1],[527,-17,8,2.4,1],[534,7.6,7,2,1],[546,-7.6,6,2,1],[528,15.5,7,2.2,1],[545,10.4,6,1.8,1]],m=(o,a)=>{let C=99;const T=o>440&&o<562&&a>-24&&a<22;if(!T&&(o<196||o>330||a<-56||a>16))return C;const R=T?p:W;for(let E=0;E<R.length;E++){const B=R[E],V=((B[4]?o:o+.45*a)-B[0])/B[2],Y=(a-B[1]-(B[4]?1.2*Math.sin(o*.21+E):0))/B[3],U=Math.sqrt(V*V+Y*Y)+.16*Math.sin(a*.9+o*.6+E*1.7);C=Math.min(C,(U-1)*Math.min(B[2],B[3]))}return C},M=[[-1,10.4,1.2,.13,.6,12.6,.5,9,33,47],[1,10.9,1.1,.075,-1.2,13.2,.5,9,22,35]],d=(o,a,C)=>{let T=0,R=0,E=99,B=99;for(const V of M){if(o*V[0]<-2||a<V[6]||a>V[9])continue;const Y=V[1]+V[2]*Math.sin(V[3]*a+V[4]),U=Y-o*V[0],X=U>0?1-c(0,7.8,U):1-c(0,15,-U),$=V[5]*c(V[6],V[7],a)*(1-c(V[8],V[9],a))*(1+.07*Math.sin(.31*a+1));$*X>T&&(T=$*X,R=X,E=$*(1-X)+Math.max(0,4-$)*4,B=U)}return C&&(C.vy=T,C.vpf=R,C.vfoam=E,C.vd=B),T},A={X:-31,M:80,h:7.6,rx:15,rm:10},k=[[66,-24,3.2,9],[70,-6,3.6,10],[64.5,8,2.6,7],[74,9,2.8,6.5],[75.5,-20,2.6,8],[62,-9,2.2,6],[108,-15,2.4,8],[111.5,4,2.4,7.5],[105.5,20,2.2,6.5],[113,-34,2.4,7],[104,-3,1.8,4.5],[112,27,2,5]],g=(o,a)=>{let C=99;if(a<54||a>122||o<-48||o>38)return C;for(let T=0;T<k.length;T++){const R=k[T],E=(a-R[0]-.22*(o-R[1]))/R[2],B=(o-R[1])/R[3],V=Math.sqrt(E*E+B*B)+.16*Math.sin(o*.9+a*.6+T*1.7);C=Math.min(C,(V-1)*Math.min(R[2],R[3]))}return C},u=(o,a)=>c(196,236,o)*(1-c(394,436,o))*c(-150,-100,a)*(1-c(70,110,a)),L=(o,a)=>c(394,436,o)*c(-90,-40,a),P=(o,a,C,T,R)=>{const E=C-e.x,B=e.z-T,V=b(E,B),Y=1-c(84,126,Math.abs(E)),U=u(o,a),X=L(o,a),$=(V-10)/12,J=Math.floor($),at=$-J,ct=at<.6?1-at/.6:(at-.6)/.4,xt=ct*ct*(3-2*ct),yt=at<.6?J:J+1,Vt=Y*c(98,110,V)*(1-c(250,290,V)*(1-c(-140,-90,a))),nt=x(E,yt,o,a)*(1-.55*Vt)*(1-U)*(1-X)*(1-c(96,127,-a))*(1-c(66,98,a)),gt=d(E,B,y),bt=Math.max(nt,3)*(1-xt)+Math.max(0,1.25-nt)*4+6*y.vpf;let Q=it+nt*xt*(1-.8*y.vpf)+gt,j=bt;const tt=S(E,A.X,A.rx)*S(B,A.M,A.rm);Q+=A.h*tt,tt>.02&&(j=Math.min(j+30*c(.1,.5,tt),A.h*(1-tt)));const ht=9.3*((1+.16*c(8,30,Math.abs(E))*Math.sin(E*.05+.7))*(1-.42*c(10,44,E)))*Y,ft=c(106,120,V)*(1-c(120,149,V)),Mt=ht*(1-ft)+Math.max(0,4-ht)*4;Q+=ht*ft-2.6*Y*S(V,151,13),j=Math.min(j+6*c(.75,.92,ft),Mt);const ut=7.6*(1+.14*c(8,30,Math.abs(E))*Math.sin(E*.043+2.1))*Y,zt=c(156,192,V)*(1-c(192,246,V)),At=ut*(1-zt)+Math.max(0,4-ut)*4+30*c(192,200,V);Q+=ut*zt*(1-.6*U*c(-60,-20,a)),j=Math.min(j,At);const Ct=c(222,292,o)*(1-c(402,448,o))*c(-80,-44,a)*(1-c(60,100,a));Q-=it*Ct;const pt=9.5*c(212,245,o)*(1-c(318,362,o)),St=c(-128,-68,a)*(1-c(-68,-40,a));Q+=pt*St,j=Math.min(j,pt*(1-St)+Math.max(0,4-pt)*4);const Tt=o+.45*a,Et=c(-64,-40,a)*(1-c(9,24,a));let kt=0;for(let ot=0;ot<3;ot++){const wt=Tt-w[ot][0],mt=wt<0?c(-4.5,0,wt):1-c(0,7.5,wt),st=w[ot][1]*Et*(1+.22*Math.sin(a*.13+ot*2.1));Q+=st*mt,kt+=st*mt,j=Math.min(j,Math.max(1.25*st,3)*(1-mt)**3+Math.max(0,2.2-st)*4)}const Rt=.25*X*Math.sin(a*.9+o*.11)*(1-c(60,98,Math.abs(a)));Q+=Rt;const Dt=j;return j=Math.min(j,y.vfoam),R&&(R.foam=j,R.foamNoV=Dt,R.hill=Math.min(Mt,y.vfoam,tt>.02?A.h*(1-tt):99)<3||At<=j+1e-9?1:0,R.rip=Rt,R.vfoam=y.vfoam,R.sfoam=bt,R.lace=Math.min(m(o,a),g(E,B)),R.vy=gt,R.vd=y.vd,R.tc=kt,R.lane=Math.max(Ct*c(250,285,o),X),R.amp=nt,R.k=yt,R.q=V,R.X=E,R.M=B),Q},F=(o,a,C)=>{const T=v(o,a);return P(o,a,T[0],T[1],C)},I=Math.ceil(n),O=new Float64Array(I+1),H=new Float64Array(I+1);for(let o=0;o<=I;o++)t.posAtDist(o*n/I,h),O[o]=h.x,H[o]=h.z;const N=(o,a)=>{let C=0,T=1e18;for(let $=0;$<=I;$+=4){const J=(O[$]-o)**2+(H[$]-a)**2;J<T&&(T=J,C=$)}for(let $=Math.max(0,C-4);$<=Math.min(I,C+4);$++){const J=(O[$]-o)**2+(H[$]-a)**2;J<T&&(T=J,C=$)}let R=C*n/I;t.tangentAtDist(R,i);const E=Math.hypot(i.x,i.z)||1,B=i.x/E,V=i.z/E,Y=o-O[C],U=a-H[C];let X=Y*B+U*V;return C>0&&C<I&&(X=Math.max(-1,Math.min(1,X))),{m:R+X,a:Y*-V+U*B}},_=67*Math.PI/180,D={x:e.x-Math.sin(_)*3200,z:e.z-Math.cos(_)*3200,height:580,base:620},q=o=>{const a=String(+o.toFixed(5));return/[.e]/.test(a)?a:a+"."};return{lawGLSL:`
vec2 seaValley(float X, float M){ vec2 r = vec2(0., 99.);
${M.map(o=>`  if (X * ${q(o[0])} > -2. && M > ${q(o[6])} && M < ${q(o[9])}) { float d = ${q(o[1])} + ${q(o[2])} * sin(${q(o[3])} * M + ${q(o[4])}) - X * ${q(o[0])}, pr = d > 0. ? 1. - smoothstep(0., 7.8, d) : 1. - smoothstep(0., 15., -d);
    float A = ${q(o[5])} * smoothstep(${q(o[6])}, ${q(o[7])}, M) * (1. - smoothstep(${q(o[8])}, ${q(o[9])}, M)) * (1. + .07 * sin(.31 * M + 1.));
    if (A * pr > r.x) r = vec2(A * pr, A * (1. - pr) + max(0., 4. - A) * 4.); }`).join(`
`)}
  return r; }
float seaTrough(float m, float a){ float sC = m + .45 * a, wC = smoothstep(-64., -40., a) * (1. - smoothstep(9., 24., a)), tc = 0., d, pr;
${w.map((o,a)=>`  d = sC - ${q(o[0])}; pr = d < 0. ? smoothstep(-4.5, 0., d) : 1. - smoothstep(0., 7.5, d); tc += ${q(o[1])} * wC * (1. + .22 * sin(a * .13 + ${q(a*2.1)})) * pr;`).join(`
`)}
  return tc; }
float seaRipple(float m, float a){ return .25 * smoothstep(394., 436., m) * smoothstep(-90., -40., a) * sin(a * .9 + m * .11) * (1. - smoothstep(60., 98., abs(a))); }
`,p0:e,L:n,lineY:r,toWorld:v,qOf:b,seaY:P,seaAt:F,routeOf:N,swellAmp:x,HORN:z,cone:D,basinMask:u,leeMask:L,TROUGH_CRESTS:w,laceAt:m,LEE:p,CRESTS:f,crestOf:s,VALLEY:M,valleyAt:d,HIGH:A,FIELD:k,fieldAt:g}}export{ne as BODY_FRAG,Ht as CLAW_EDGE_GLSL,It as CLAW_FRAG,Pt as CLAW_THICK,le as DOT_BALLS,rt as INK,dt as PALETTE,de as PRINT_FRAG,Z as PRINT_GLSL,me as PRINT_VERT,qt as ROUTE_LENGTH,it as SEA,Wt as SIZE,vt as WAVE_GLSL,be as buildHero,Ft as clawGeometry,Qt as layoutWave,he as makePaperSky,Me as makePlace,Gt as makePrintUniforms,Bt as overprint,ve as printMaterial,Ot as routeKnots,jt as waveCurl,Ut as waveEase,Yt as waveFan,Lt as waveFold,Jt as wavePoint,Xt as waveProfile,Kt as waveRise,Zt as waveSection};
