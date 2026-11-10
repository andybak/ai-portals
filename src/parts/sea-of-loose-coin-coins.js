import*as i from"three";const ae=Math.PI*2,ye=.075,L=ye.toFixed(4),P=t=>Math.min(1,Math.max(0,t)),m=(t,a,e)=>{const r=P((e-t)/(a-t));return r*r*(3-2*r)};function oe(t,a){return m(.8,.87,t)*(1-m(.965,1,t))*(.85+.15*Math.cos(a*54)*m(.9,.96,t))}function ge(t,a){const e=Math.hypot(t,a),r=Math.atan2(a,t);let o=oe(e,r);o=Math.max(o,.6*m(.07,.03,Math.abs(e-.62)));const s=.155,l=t/s,n=a/s,c=Math.floor(l),h=Math.floor(n),v=(c+h&1)===0?1:0,u=m(.5,.36,Math.max(Math.abs(l-c-.5),Math.abs(n-h-.5)));return o=Math.max(o,.5*v*u*(1-m(.5,.54,e))),o}function re(t,a,e,r,o,s){const l=o-e,n=s-r,c=P(((t-e)*l+(a-r)*n)/(l*l+n*n));return Math.hypot(t-e-l*c,a-r-n*c)}function we(t,a){const e=Math.hypot(t,a),r=Math.atan2(a,t);let o=oe(e,r);for(let s=-2;s<=2;s++){const l=s*.17,n=.42-Math.abs(s)*.05;o=Math.max(o,.5*m(.045,.015,re(t,a,s*.03,-.56,l,n)));const c=(t-l*1.06)/.065,h=(a-n-.1)/.15;o=Math.max(o,.62*m(1,.55,Math.hypot(c,h)))}return o=Math.max(o,.58*m(.05,.02,re(t,a,-.16,-.2,.16,-.2))),o}function ze(t=64){const a=[];for(const e of[ge,we]){const r=new Float32Array(t*t),o=new Float32Array(t*t),s=new Float32Array(t*t),l=1.5/t;for(let n=0;n<t;n++)for(let c=0;c<t;c++){const h=(c+.5)/t*2-1,v=(n+.5)/t*2-1,u=n*t+c;r[u]=e(h,v),o[u]=(e(h+l,v)-e(h-l,v))/(2*l),s[u]=(e(h,v+l)-e(h,v-l))/(2*l)}a.push({H:r,GU:o,GV:s,n:t})}return a}function ke(t){const a=t[0].n,e=new Uint8Array(a*2*a*4);for(let o=0;o<2;o++)for(let s=0;s<a;s++)for(let l=0;l<a;l++){const n=s*a+l,c=(s*a*2+o*a+l)*4,h=t[o],v=-h.GU[n]*.11,u=-h.GV[n]*.11,z=Math.hypot(v,u,1);e[c]=Math.round(255*(.5+.5*v/z)),e[c+1]=Math.round(255*(.5+.5*u/z)),e[c+2]=Math.round(255*h.H[n]),e[c+3]=255}const r=new i.DataTexture(e,a*2,a,i.RGBAFormat,i.UnsignedByteType);return r.magFilter=i.LinearFilter,r.minFilter=i.LinearMipmapLinearFilter,r.generateMipmaps=!0,r.wrapS=r.wrapT=i.ClampToEdgeWrapping,r.needsUpdate=!0,r}async function Ae(t,a,e,r=512){const o=r,s=o/40,l=new Float32Array(o*o).fill(-1e9),n=new Uint8Array(o*o*4),c=e[0].n,h=1150,v=250,u=[];for(let f=0;f<h;f++){let d=a()*o,p=a()*o;const x=f>=h-v;if(x){for(let b=0;b<14;b++){let S=!0;for(const C of u){let g=Math.abs(C[0]-d),w=Math.abs(C[1]-p);if(g>o/2&&(g=o-g),w>o/2&&(w=o-w),g*g+w*w<2.9*s*s){S=!1;break}}if(S)break;d=a()*o,p=a()*o}u.push([d,p])}const B=x?54+a()*5:f/h*46+a()*6,F=a()*ae,V=a()<.5?0:1,T=1+Math.floor(a()*254),G=a(),I=x?.04+a()*(G<.75?.3:.6):G<.6?.05+a()*.5:G<.92?.45+a()*.5:1.2+a()*.3,O=a()*ae,N=Math.cos(O),R=Math.sin(O),_=Math.max(Math.cos(I),.13),j=Math.min(Math.tan(I),3.2),W=Math.cos(F),U=Math.sin(F),A=e[V],ie=Math.floor(d-s-1),le=Math.ceil(d+s+1),ne=Math.floor(p-s-1),ce=Math.ceil(p+s+1);for(let b=ne;b<=ce;b++)for(let S=ie;S<=le;S++){const C=S+.5-d,g=b+.5-p,w=C*W+g*U,M=(-C*U+g*W)/s,D=w/(s*_),Z=M*M+D*D;if(Z>1)continue;const he=M*N-D*R,fe=M*R+D*N,ve=Math.min(c-1,Math.floor((he*.5+.5)*c)),ue=Math.min(c-1,Math.floor((fe*.5+.5)*c)),q=ue*c+ve,Y=B+w*j+A.H[q]*1.2,de=(S%o+o)%o,pe=(b%o+o)%o,H=pe*o+de;if(Y<=l[H])continue;l[H]=Y;const me=A.GU[q]*N+A.GV[q]*R,xe=-A.GU[q]*R+A.GV[q]*N,$=m(.74,1,Z)*1.1,X=j+xe*1.2/(s*_)*1.3-$*D,J=me*1.2/s*1.3-$*M,Q=-(X*W-J*U),ee=-(X*U+J*W),te=Math.hypot(Q,ee,1),E=H*4;n[E]=Math.round(255*(.5+.5*Q/te)),n[E+1]=Math.round(255*(.5+.5*ee/te)),n[E+3]=T}f%40===39&&await t.yield()}let z=-1e9;for(let f=0;f<o*o;f++)l[f]>z&&(z=l[f]);const se=[[3,0],[-3,0],[0,3],[0,-3],[2,2],[-2,2],[2,-2],[-2,-2]];for(let f=0;f<o;f++){for(let d=0;d<o;d++){const p=f*o+d,x=p*4;if(l[p]<-1e8){n[x]=128,n[x+1]=128,n[x+2]=0,n[x+3]=0;continue}let B=0;for(const[F,V]of se){const T=l[(f+V+o)%o*o+(d+F+o)%o]-l[p]-1.5;T>0&&(B+=Math.min(1,T/5))}n[x+2]=Math.round(255*P((l[p]-(z-62))/62)*(1-.72*Math.min(1,B/3)))}f%24===23&&await t.yield()}await t.yield();const y=new i.DataTexture(n,o,o,i.RGBAFormat,i.UnsignedByteType);return y.wrapS=y.wrapT=i.RepeatWrapping,y.magFilter=i.LinearFilter,y.minFilter=i.LinearMipmapLinearFilter,y.generateMipmaps=!0,y.anisotropy=Math.min(8,t.renderer.capabilities.getMaxAnisotropy?t.renderer.capabilities.getMaxAnisotropy():1),y.needsUpdate=!0,y}const k=`
uniform vec3 uStripE, uStripW, uSteel, uBounce, uLampCol, uDoorCol, uHaze, uKeyDir, uKeyCol;
uniform float uHazeK, uTime;
// the way to the sun as x and z per metre of height, the crane's z, the dust in the shafts
uniform vec4 uSun;
// where the crab rides on the bridge
uniform float uGrabX;
// the feet of the great falls: place, and how much warm light the lit coin there throws back
uniform vec4 uWarm[3];
float gSun = 1.0;
float gFlash = 0.0;
float mirrorPow(float c) { c *= c; c *= c; c *= c; c *= c; c *= c; c *= c; c *= c; return c; }
float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 hash22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
// THE SUN THROUGH THE TWO ROOF STRIPS, by place. A place sees the sun where the ray to it crosses the glazing (two
// strips 5 m wide either side of the crown) through a pane that is clear, between the trusses (one every 12 m), and
// past the crane's two girders and its crab. (r6) The glazing is clear or frosted a whole bay at a time (the four
// panes between two trusses; about two bays in five are clear, the others are frosted with grime and give skylight
// only), so the sun lies on the gold in pools a bay long. roofZ: the glazing along the hall; craneZ: the crane.
float paneAt(float i, float side) {
  float h = hash12(vec2(floor(i / 4.0), 3.0 + side)), g = hash12(vec2(i, 11.0 + side));
  // the panes over the door's end of the hall (north of z -134, the 114th on) are all clear: daylight falls on the ring
  // and the plug
  return max(step(0.6, h), step(113.5, i)) * (0.78 + 0.22 * g);
}
float roofZ(float zs, float side) {
  float q = (209.0 - zs) / 3.0 - 0.5, i = floor(q);
  float zt = abs(fract((q + 0.5) / 4.0 + 0.5) - 0.5) * 12.0;
  // from one pane to the next the light goes over softly (0.9 m)
  return mix(paneAt(i, side), paneAt(i + 1.0, side), smoothstep(0.35, 0.65, q - i)) * smoothstep(0.42, 0.8, zt) * step(-150.0, zs) * step(zs, 214.0);
}
float craneZ(vec3 p) {
  float tc = 28.3 - p.y, zc = p.z + uSun.y * tc - uSun.z, xc = p.x + uSun.x * tc;
  float g = smoothstep(0.45, 0.85, abs(abs(zc) - 1.8));
  g *= 1.0 - step(abs(xc - uGrabX), 1.9) * step(abs(zc), 2.5);
  return tc > 0.0 ? g : 1.0;
}
float sunAt(vec3 p) {
  float t = 45.6 - p.y, xs = p.x + uSun.x * t, pen = 0.3 + 0.03 * t;
  float band = 1.0 - smoothstep(-pen, pen, abs(abs(xs) - 4.0) - 2.5);
  return band < 0.003 ? 0.0 : band * roofZ(p.z + uSun.y * t, sign(xs)) * craneZ(p);
}
float stripBox(float hx, float c, float blur) { return smoothstep(-blur, blur, 2.5 - abs(hx - c)); }
vec3 hallStrips(vec3 p, vec3 r, float rough) {
  float t = (45.0 - p.y) / max(r.y, 0.05);
  float hx = p.x + r.x * t, hz = p.z + r.z * t;
  float blur = 0.3 + t * (0.012 + rough * 0.3);
  float k = 2.5 / max(2.5, blur * 0.85);
  float ends = smoothstep(-153.0, -146.0, hz) * (1.0 - smoothstep(209.0, 216.0, hz));
  float mull = mix(1.0, 0.7 + 0.3 * smoothstep(0.06, 0.2, abs(fract(hz / 3.0) - 0.5)), clamp(1.0 - blur * 0.7, 0.0, 1.0));
  return (uStripE * stripBox(hx, 4.0, blur) + uStripW * stripBox(hx, -4.0, blur)) * (smoothstep(0.03, 0.14, r.y) * ends * k * mull);
}
vec3 hallSky(vec3 p, vec3 r, float rough) {
  float w = 0.06 + rough * 0.45;
  vec3 low = uBounce * (0.2 + 0.8 * smoothstep(-0.8, 0.0, r.y));
  vec3 steel = uSteel * (1.3 + 1.2 * clamp(r.y, 0.0, 1.0)) + uBounce * 0.1;
  vec3 wall = mix(uBounce * 0.45, steel, smoothstep(-0.02, 0.16, r.y));
  float t = (45.0 - p.y) / max(r.y, 0.05);
  float hx = p.x + r.x * t;
  vec3 glow = (uStripE + uStripW) * 0.004 * exp(-hx * hx / 200.0) * smoothstep(0.05, 0.4, r.y);
  vec3 col = mix(low, wall + glow, smoothstep(-w, w, r.y));
  // the lamps along the catwalks: a row on each wall at y 23.3, one at every rib (12 m)
  float tw = (32.0 - sign(r.x) * p.x) / max(abs(r.x), 0.05);
  float wy = p.y + r.y * tw, wz = p.z + r.z * tw;
  float lb = 0.5 + tw * (0.02 + rough * 0.4);
  float lamp = (1.0 - smoothstep(0.0, lb, abs(wy - 23.3))) * (1.0 - smoothstep(0.0, lb + 0.6, abs(fract((wz - 5.0) / 12.0 + 0.5) - 0.5) * 12.0)) / (1.0 + lb * lb);
  col += uLampCol * lamp;
  // the round doorway's light
  vec3 dd = vec3(0.0, 12.0, -150.0) - p; float d2 = dot(dd, dd); dd *= inversesqrt(max(d2, 1.0));
  col += uDoorCol * pow(clamp(dot(r, dd), 0.0, 1.0), mix(40.0, 5.0, rough)) * min(1.0, 220.0 / (d2 + 30.0));
  return col + hallStrips(p, r, rough);
}
// one coin's metal: what it mirrors, and the pile's own twice-reflected light (deeper in colour) under the hall's key:
// daylight down through the roof strips and a little from the west. open: how much of the hall this place sees
// (a crest all of it, a trough's floor little).
vec3 hallWarm(vec3 p) {
  vec3 w = vec3(0.0);
  for (int i = 0; i < 3; i++) { vec3 d = uWarm[i].xyz - p; w += uBounce * (uWarm[i].w / (1.0 + dot(d, d) * 0.02)); }
  return w;
}
vec3 coinShade(vec3 p, vec3 n, vec3 v, vec3 f0, float rough, float ao, float body, float specK, float open) {
  float ndv = clamp(dot(n, v), 0.0, 1.0);
  vec3 r = reflect(-v, n);
  float fr = 1.0 - ndv; fr = fr * fr * fr * fr * fr;
  vec3 F = f0 + (1.0 - f0) * fr * 0.4;
  float sun = sunAt(p); gSun = sun;
  // (r6) LIGHT AND SHADE: out of the sun the gold stands deeper (0.42 of what it mirrors, it was 0.5), in the sun's
  // pools brighter (1.3); a place that sees little of the hall, or is turned from its light, keeps 0.34 (it was 0.42)
  vec3 spec = F * hallSky(p, r, rough) * specK * mix(0.34, 1.0, open) * mix(0.42, 1.3, sun);
  float e = clamp(dot(n, uKeyDir), 0.0, 1.0); e *= sqrt(e);
  vec3 hk = normalize(uKeyDir + v + vec3(0.0, 1e-4, 0.0));
  float gl = pow(clamp(dot(n, hk), 0.0, 1.0), mix(40.0, 6.0, rough));
  vec3 dd = vec3(0.0, 12.0, -150.0) - p; float d2 = dot(dd, dd);
  // a coin is a small mirror: it flashes where it throws a roof strip, the sun or the bright doorway to the eye
  gFlash = smoothstep(2.5, 6.0, hallStrips(p, r, 0.03).g) * mix(0.4, 1.0, open) * mix(0.5, 1.0, sun) + 3.0 * mirrorPow(clamp(dot(n, hk), 0.0, 1.0)) * sun
    + pow(clamp(dot(r, dd) * inversesqrt(max(d2, 1.0)), 0.0, 1.0), 120.0) * min(1.0, 400.0 / (d2 + 30.0));
  // (r6) the sun on the gold's own body (1.0, it was 0.55); in a hollow the pile's own warm light counts for more
  vec3 irr = uKeyCol * (1.0 * e * sun * mix(0.6, 1.0, open)) + uBounce * (0.08 * open + 0.5 * (1.0 - open)) + uLampCol * 0.01 + hallWarm(p);
  // the shade's own light: the cool sky of the two strips and the doorway's pale light, on the gold's paler tone
  vec3 cool = (uStripE + uStripW) * (0.012 * (0.35 + 0.65 * clamp(n.y, 0.0, 1.0)) * mix(0.3, 1.0, open))
    + uDoorCol * (0.2 + 0.4 * clamp(dot(n, dd) * inversesqrt(max(d2, 1.0)), 0.0, 1.0)) * min(1.0, 150.0 / (d2 + 30.0));
  // the pile's own colour: light that has gone from coin to coin before it leaves (gold deepens, silver stays)
  vec3 pile = f0 * mix(vec3(1.0), f0, vec3(0.9, 0.5, 1.0));
  return (spec + F * uKeyCol * (gl * sun * 1.2) + pile * (irr + cool * vec3(0.92, 0.92, 1.0)) * body) * ao;
}
vec3 hallHaze(vec3 col, float dist) { return mix(col, uHaze, 1.0 - exp(-dist * uHazeK)); }
// the air: the hall's thin haze, and the sun in the coin dust as beams: the length of the sight line that lies inside
// the light under the clear panes of the two roof strips, with the trusses', the frosted panes' and the crane's gaps in
// it. A beam brightens what lies behind it, warm, and a little; however long a sight line runs in the light the dust
// adds no more than uSun.w (r6: 0.06 by day, it was 0.03: a shaft is told against the dark steel and is lost against
// the gold), so no beam lies on the gold as a film.
vec3 hallAir(vec3 col, vec3 p) {
  vec3 E = cameraPosition, d = p - E; float dist = length(d); d /= max(dist, 1e-3);
  col = mix(col, uHaze, 1.0 - exp(-dist * uHazeK));
  float te = 45.6 - E.y, xe = E.x + uSun.x * te, ze = E.z + uSun.y * te;
  float gx = d.x - uSun.x * d.y, gz = d.z - uSun.y * d.y;
  gx = abs(gx) < 1e-4 ? 1e-4 : gx;
  float lit = 0.0;
  for (int j = 0; j < 2; j++) {
    float c = j == 0 ? 4.0 : -4.0;
    float ta = (c - 2.5 - xe) / gx, tb = (c + 2.5 - xe) / gx;
    float t0 = clamp(min(ta, tb), 0.0, dist), t1 = clamp(max(ta, tb), 0.0, dist), len = t1 - t0;
    if (len > 0.01) {
      float m = 0.0;
      for (int i = 0; i < 3; i++) { float tt = t0 + len * (float(i) + 0.5) / 3.0; m += roofZ(ze + gz * tt, c) * craneZ(E + d * tt); }
      lit += len * mix(m / 3.0, 0.32, smoothstep(2.0, 7.0, abs(gz) * len / 3.0));
    }
  }
  float beam = 1.0 - exp(-lit * 0.07);
  return col * (1.0 + 0.2 * beam) + uKeyCol * vec3(1.0, 0.84, 0.56) * (uSun.w * beam);
}
// gold stays gold: one soft ceiling on lit coin everywhere (silver keeps a neutral one). What flashes whiter than this
// is added after it, as single small glints.
vec3 goldCap(vec3 col, vec3 f0) {
  float silv = clamp((f0.b / max(f0.r, 0.01) - 0.35) / 0.5, 0.0, 1.0);
  vec3 cap = mix(vec3(0.95, 0.5, 0.07), vec3(1.3), silv);
  return cap * (1.0 - exp(-max(col, 0.0) / cap));
}
// a coin that mirrors a roof strip, the sun or the doorway stands white-gold: by hot, the ceiling rises to a pale gold
vec3 coinCap(vec3 col, vec3 f0, float hot) {
  const vec3 hcap = vec3(1.9, 1.3, 0.5);
  return mix(goldCap(col, f0), hcap * (1.0 - exp(-max(col, 0.0) / hcap)), clamp(hot, 0.0, 1.0));
}
`;function be(t,a={}){const e=a.sunDay,r=(n,c=1)=>{const h=new i.Color(n);return new i.Vector3(h.r*c,h.g*c,h.b*c)},s={day:{e:r("#eef4ff",6.8),w:r("#f2f4ff",8.6),key:r("#fff1d8",1.05),kd:e?[e[0],1,e[1]]:[.2,1,.3],dust:.06,steel:r("#3a4856",.5),bounce:r("#d2a24a",.3),lamp:r("#ffb868",6),haze:r("#a9c2e6",.5),hazeK:9e-4},dawn:{e:r("#ffb9b0",8.5),w:r("#aebfe6",2.6),key:r("#ffc4b4",1.3),kd:[.56,.68,-.2],dust:.05,steel:r("#463f52",.5),bounce:r("#d49a4c",.36),lamp:r("#ffb868",6),haze:r("#d8b8c0",.36),hazeK:.0011},golden:{e:r("#b9c4e0",2.4),w:r("#ffc27a",9.5),key:r("#ffc27a",1.5),kd:[-.64,.6,-.22],dust:.06,steel:r("#4a4238",.5),bounce:r("#d8a040",.45),lamp:r("#ffb868",6),haze:r("#e0b880",.36),hazeK:.0011},night:{e:r("#9fb8ff",2.6),w:r("#9fb8ff",2.6),key:r("#a8bcff",.4),kd:[-.3,.9,-.2],dust:.02,steel:r("#2a3446",.85),bounce:r("#b08a48",.22),lamp:r("#ffc27a",16),haze:r("#5a6c90",.2),hazeK:9e-4}}[t]||null||be("day",a).__p,l={uStripE:{value:s.e},uStripW:{value:s.w},uSteel:{value:s.steel},uBounce:{value:s.bounce},uLampCol:{value:s.lamp},uDoorCol:{value:r("#eaf2ff",2.6)},uKeyCol:{value:s.key},uKeyDir:{value:new i.Vector3(s.kd[0],s.kd[1],s.kd[2]).normalize()},uHaze:{value:s.haze},uHazeK:{value:s.hazeK},uTime:{value:0},uSun:{value:new i.Vector4(s.kd[0]/s.kd[1],s.kd[2]/s.kd[1],0,s.dust)},uGrabX:{value:a.grabX??0},uWarm:{value:[new i.Vector4(0,-99,0,0),new i.Vector4(0,-99,0,0),new i.Vector4(0,-99,0,0)]}};return Object.defineProperty(l,"__p",{value:s,enumerable:!1}),l}function Ce(t,a,e){const r={...t,tFace:{value:a},uGold:{value:e.gold},uSilver:{value:e.silver},uSilverShare:{value:e.silverShare},uSink:{value:new i.Vector4(e.sink.x,e.sink.z,e.sink.rim,e.sink.throat)},uFan:{value:e.fan||new i.Vector4(0,0,1,0)},uArm:{value:e.arm??0},uSlipA:{value:[0,1,2,3].map(()=>new i.Vector4(0,0,1,0))},uSlipB:{value:[0,1,2,3].map(()=>new i.Vector4(0,1,8,0))}};return new i.ShaderMaterial({uniforms:r,vertexShader:`
      attribute float aCrest; attribute vec2 aLit;
      varying vec3 vW; varying vec3 vN; varying float vCrest; varying vec2 vLit;
      void main() { vW = (modelMatrix * vec4(position, 1.0)).xyz; vN = normal; vCrest = aCrest; vLit = aLit; gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.0); }`,fragmentShader:`
      varying vec3 vW; varying vec3 vN; varying float vCrest; varying vec2 vLit;
      uniform sampler2D tFace; uniform vec3 uGold, uSilver; uniform float uSilverShare; uniform vec4 uSink, uFan; uniform vec4 uSlipA[4], uSlipB[4]; uniform float uArm;
      const float CR = ${L};
      const float CELL = CR / 0.6;
      ${k}
      // THE FAR COIN, a scale: one layer of cells on the plan, a coin a cell, its disc 0.7 of a cell in radius so that
      // each lies over its neighbours; the uppermost over this place among the four nearest. come: how far this layer
      // has come in (a disc is there once come passes 0.8 of its own number; 2: all are). d: the place in that disc
      // (its radius 1); h: its four random numbers. Returns the shade of the discs that lie over it at their edges,
      // or 2 where no disc lies (a gap).
      float scaleAt(vec2 g, float salt, float come, out vec2 d, out vec4 h) {
        vec2 c0 = floor(g - 0.5); float best = -1.0, under = 0.0; float rk[4]; float od[4]; d = vec2(0.0); h = vec4(0.5);
        for (int k = 0; k < 4; k++) {
          vec2 id = c0 + vec2(float(k & 1), float(k >> 1));
          vec2 h1 = hash22(id + salt), h2 = hash22(id * 1.7 + salt + 3.1);
          vec2 dd = (g - id - 0.5 - (h1 - 0.5) * 0.5) / 0.7; float rr = dot(dd, dd);
          float there = step(0.8 * fract(h2.y * 13.7 + h1.x * 5.1), come - 1e-4);
          rk[k] = mix(-1.0, h2.x, there); od[k] = rr;
          if (rr < 1.0 && rk[k] > best) { best = rk[k]; d = dd; h = vec4(h1, h2); }
        }
        for (int k = 0; k < 4; k++) if (rk[k] > best) under = max(under, 1.0 - smoothstep(1.0, 2.0, od[k]));
        return best > 0.0 ? under : 2.0;
      }
      // one scale's light: a flat mirror at its own tilt with its own tone, the shade at its edge (the dark gap where
      // none lies), and on its rim an arc of light (a pixel and a half broad) on the side ad that throws the roof's
      // light to the eye. pxr: its radius in pixels
      vec3 scaleShade(vec2 d, vec4 h, float under, float pxr, vec2 ad, vec3 Nm, vec3 T, vec3 B, vec3 V, vec3 tone, float fan, float cr, float op) {
        float gap = step(1.5, under), rr = sqrt(max(dot(d, d), 0.0));
        float th = h.w < 0.85 ? 0.05 + 0.47 * h.w : 0.45 + 3.3 * (h.w - 0.85), az = 6.2832 * fract(h.x * 57.0 + h.y * 131.0);
        vec3 ng = normalize(Nm + (T * cos(az) + B * sin(az)) * (tan(th) * (1.0 - gap)));
        float rnd = fract(h.x * 3.7 + h.z * 7.3);
        vec3 f0i = mix(mix(uGold, uSilver, step(1.0 - uSilverShare, fract(rnd * 3.77 + h.y))) * mix(0.62 + 0.62 * rnd, 0.6, gap), uSilver * (0.9 + 0.1 * rnd), fan) * tone;
        float ao = mix((1.0 - 0.75 * min(under, 1.0)) * mix(0.66, 1.0, smoothstep(0.05, 0.6, h.z)), 0.1, gap);
        float arc = smoothstep(1.0 - 2.2 / pxr, 1.0 - 0.7 / pxr, rr) * smoothstep(0.1, 0.8, dot(d, ad) / max(rr, 0.05)) * (1.0 - gap) * (0.3 + 0.7 * fract(rnd * 5.3));
        vec3 c = coinShade(vW, ng, V, f0i, 0.06 + 0.2 * rnd, ao, 1.7 * (1.0 + 0.4 * cr), 1.0 + 0.5 * cr, op);
        return coinCap(c, f0i, max(gFlash, 0.3 * gSun)) + vec3(1.9, 1.35, 0.5) * ((gFlash * 0.3 + arc * (0.25 + 0.6 * gSun)) * ao * mix(0.3, 1.0, op));
      }
      void main() {
        vec3 N = normalize(vN);
        vec3 toEye = cameraPosition - vW; float dist = length(toEye); vec3 V = toEye / max(dist, 1e-3);
        vec2 q = vW.xz;
        vec2 dqx = dFdx(q), dqy = dFdy(q);
        float fw = max(length(dqx), length(dqy));
        // the pixel's footprint on the surface as a square of the same area: what the grain is sized by
        float fg = sqrt(max(abs(dqx.x * dqy.y - dqx.y * dqy.x), 1e-10));
        // ---- slips on the steep faces
        float slope = length(N.xz) / max(N.y, 0.05);
        float faceK = smoothstep(0.4, 0.52, slope) * step(0.4, vCrest);
        float ax = step(abs(N.z), abs(N.x));
        vec2 down = ax > 0.5 ? vec2(N.x < 0.0 ? -1.0 : 1.0, 0.0) : vec2(0.0, N.z < 0.0 ? -1.0 : 1.0);
        float across = ax > 0.5 ? q.y : q.x;
        float lane = floor(across / 4.4 + 0.37 * ax);
        float lr = hash12(vec2(lane, 7.0 + ax * 13.0 + down.x * 3.0 + down.y * 5.0));
        float lr2 = hash12(vec2(lane, 31.0 + ax * 5.0));
        float period = 11.0 + 15.0 * lr;
        float tau = mod(uTime + lr2 * period, period);
        float runL = 7.0 + 15.0 * lr2, spd = 3.4 + 2.2 * lr;
        float head = 1.2 + runL * (1.0 - exp(-tau * spd / runL));
        float len = 4.5 + 3.0 * lr;
        float hw = 0.8 + 0.9 * lr2;
        float ac = (fract(across / 4.4 + 0.37 * ax) - 0.5) * 4.4 / hw;
        float sdown = vCrest / 0.53;
        float bn = (sdown - (head - len)) / len;
        float front = 1.0 - 0.3 * ac * ac;
        ac /= mix(0.35, 1.0, smoothstep(0.0, 0.6, bn));
        float rest = 1.0 - smoothstep(period - 2.5, period - 0.5, tau);
        float inT = step(abs(ac), 1.0) * step(0.0, bn) * step(bn, front) * faceK * rest;
        // ---- the slips of real discs: at the head a broad ragged scarp, many coins wide, shallow and warm in its shade,
        // under a bright lip where the coin breaks away; below it the run, streaked, and a lobed fan of fresh coin
        float scarp = 0.0, sheet = 0.0, fresh = 0.0, lipHi = 0.0, lev = 0.0, streak = 0.5; vec2 sDir = vec2(0.0), sVel = vec2(0.0);
        for (int i = 0; i < 4; i++) {
          vec4 SA = uSlipA[i], SB = uSlipB[i];
          vec2 rel = q - SA.xy; float sl = dot(rel, SA.zw), sw = dot(rel, vec2(-SA.w, SA.z));
          if (SB.x < 0.5 || sl < -2.0 || sl > SB.x + 5.0 || abs(sw) > SB.y * 2.8 + 0.5) continue;
          float sn = clamp(sl / SB.x, 0.0, 1.0), hwS = SB.y * (0.55 + 0.6 * sn * sn * (3.0 - 2.0 * sn));
          float wv = abs(sw) + 0.22 * sin(sl * 1.7 + sw * 2.3 + float(i)), wn = sw / (SB.y * 0.55);
          float body = smoothstep(0.3, 1.6, sl) * (1.0 - smoothstep(SB.x - 1.0, SB.x + 1.2, sl));
          float inW = 1.0 - smoothstep(hwS * 0.8, hwS * 1.05, wv);
          float cs = sl + 0.5 * wn * wn - 0.3 + 0.15 * sin(sw * 3.1);
          float top = step(abs(wn), 1.2) * (1.0 - smoothstep(0.9, 1.2, abs(wn)));
          float cg = cs + 0.2 * sin(sw * 5.3 + float(i) * 1.7) + 0.12 * sin(sw * 11.0 + sl * 2.3);
          scarp = max(scarp, top * smoothstep(-0.15, 0.3, cg) * (1.0 - smoothstep(0.5, 1.6, cg)));
          lipHi = max(lipHi, top * smoothstep(-0.7, -0.35, cs) * (1.0 - smoothstep(-0.3, -0.12, cs)));
          lev = max(lev, smoothstep(hwS * 0.72, hwS * 0.9, wv) * (1.0 - smoothstep(hwS * 0.95, hwS * 1.15, wv)) * body);
          float sh = inW * body;
          vec2 fq = vec2((sl - SB.x - 0.4) / 3.0, sw / (SB.y * 2.4));
          fresh = max(fresh, 1.0 - smoothstep(0.5, 1.0, length(fq) + 0.14 * sin(sw * 2.1 + sl * 1.3) + 0.1 * sin(atan(fq.y, fq.x) * 9.0)));
          if (sh > sheet) { sheet = sh; sDir = SA.zw; sVel = SA.zw * 1.9 * smoothstep(0.2, 0.6, sh); streak = 0.5 + 0.5 * sin(sw * 4.6 + 3.0 * sin(sl * 0.6 + sw * 0.8) + float(i) * 2.1); }
          if (scarp > 0.01 && sheet < 0.01) sDir = SA.zw;
        }
        inT *= 1.0 - step(0.3, sheet);
        vec2 offA = -down * head * step(0.5, inT), offB = offA;
        float wA = 1.0, wB = 1.0;
        float f1 = fract(uTime / 2.6), f2 = fract(uTime / 2.6 + 0.5);
        if (sheet > 0.01) {
          offA -= sVel * (f1 - 0.5) * 2.6; offB -= sVel * (f2 - 0.5) * 2.6;
          wA = mix(1.0, 1.0 - abs(2.0 * f1 - 1.0), sheet); wB = mix(1.0, 1.0 - abs(2.0 * f2 - 1.0), sheet);
        }
        // ---- every steep face creeps downhill: the lying coin's own flow, in two phases that hand over
        float creep = faceK * (1.0 - step(0.01, sheet)) * (1.0 - step(0.5, inT));
        if (creep > 0.01) {
          vec2 cv = down * 0.3 * creep;
          offA -= cv * (f1 - 0.5) * 2.6; offB -= cv * (f2 - 0.5) * 2.6;
          wA = mix(1.0, 1.0 - abs(2.0 * f1 - 1.0), creep); wB = mix(1.0, 1.0 - abs(2.0 * f2 - 1.0), creep);
        }
        // ---- the sink: inward and round, faster toward the throat, in two phases that hand over
        vec2 sd = q - uSink.xy; float rho = length(sd);
        float inS = 1.0 - smoothstep(uSink.z - 1.5, uSink.z + 2.5, rho);
        if (inS > 0.001) {
          vec2 er = sd / max(rho, 0.01), et = vec2(-er.y, er.x);
          // (r6) no faster than 1.45 m/s (the coin near the throat was drawn out into streaks)
          float vr = 0.12 + 4.0 / max(rho, 3.0);
          vec2 vel = (-er * vr + et * vr * 1.1) * inS;
          offA -= vel * (f1 - 0.5) * 2.6; offB -= vel * (f2 - 0.5) * 2.6;
          wA = mix(1.0, 1.0 - abs(2.0 * f1 - 1.0), inS); wB = mix(1.0, 1.0 - abs(2.0 * f2 - 1.0), inS);
        }
        float arms = 0.0, armK = inS * smoothstep(1.5, 4.0, rho) * (1.0 - smoothstep(uSink.z - 1.5, uSink.z + 1.0, rho));
        if (inS > 0.001) { float thS = atan(sd.y, sd.x + 1e-5); arms = sin(6.0 * thS + 9.0 * log(max(rho, 0.5)) + uTime * 1.3 + uArm); }
        // soft ripples on the gentle backs, as wind draws them on a dune: wandering lines a little over a metre apart that
        // break and fade in patches. Light and shade only: in the mirror they stood as a ladder of bright bars
        float rph = 5.2 * (q.y * 0.94 + q.x * 0.34) + 2.4 * sin(q.x * 0.47 + 1.3 * sin(q.y * 0.23)) + 1.8 * sin(q.x * 0.19 - q.y * 0.31 + 2.0);
        float rip = sin(rph) * smoothstep(0.08, 0.18, slope) * (1.0 - smoothstep(0.36, 0.5, slope)) * (1.0 - inS) * (1.0 - smoothstep(0.2, 0.55, fw))
          * smoothstep(-0.25, 0.45, sin(q.x * 0.083 + 1.7) * sin(q.y * 0.061 + 0.4) + 0.35 * sin(q.x * 0.21 + q.y * 0.17));
        vec3 T = normalize(vec3(1.0, 0.0, 0.0) - N * N.x), B = normalize(vec3(0.0, 0.0, 1.0) - N * N.z);
        vec3 Nm = normalize(N + vec3(-sd.y, 0.0, sd.x) / max(rho, 0.5) * arms * armK * 0.07);
        // the tongue's lip and levees
        float lip = smoothstep(0.75, 1.0, bn / max(front, 0.3)) * inT, side = ac * smoothstep(0.6, 1.0, abs(ac)) * inT;
        vec3 acV = ax > 0.5 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
        Nm = normalize(Nm + vec3(down.x, 0.0, down.y) * lip * 0.12 + acV * side * 0.06);
        T = normalize(vec3(1.0, 0.0, 0.0) - Nm * Nm.x); B = normalize(vec3(0.0, 0.0, 1.0) - Nm * Nm.z);
        // (r6) how open and how turned to the hall's light this place is (laid into the mesh by the part): the shade is
        // told apart sooner (0.45 to 0.95, it was 0.3 to 1)
        float op = smoothstep(0.45, 0.95, vLit.x), cr = vLit.y;
        // the rare visit: a new pour of bright silver lying as a pale fan across one dune
        float fanD = length(q - uFan.xy) + 1.2 * sin(q.x * 0.9 + q.y * 0.6) * sin(q.y * 0.7 - q.x * 0.4);
        float fan = uFan.w * (1.0 - smoothstep(uFan.z * 0.75, uFan.z, fanD));
        // fresh coin at a slip's lip and fan, the run's streaks; the scarp's shade: broad, ragged, soft and warm
        vec3 tone = mix(vec3(1.0), vec3(0.88, 0.82, 0.72), scarp) * ((1.0 + 0.3 * fresh + 0.3 * lipHi) * (1.0 + 0.07 * (streak - 0.5) * sheet * (1.0 - fresh)));
        // a coin's breadth in pixels; cK: how much of each coin's own light and shade is drawn
        float px = 2.0 * CR / max(fg, 1e-5), cK = smoothstep(4.0, 6.5, px);
        const vec2 RC = vec2(0.7986, 0.6018);
        vec3 colN = vec3(0.0), colF = vec3(0.0);
        // the way (on the plan) from a coin's middle to the part of its rim that throws the roof's light to the eye
        vec2 arcD = (V + normalize(vec3(-vW.x, 45.0 - vW.y, 0.0))).xz; arcD /= max(length(arcD), 1e-3);
        if (cK > 0.004) {
          // ---- THE LYING COIN, disc by disc: the uppermost coin over this place among the two layers' nearest cells
          vec2 qa = q + offA, qb0 = q + offB, qb = vec2(RC.x * qb0.x - RC.y * qb0.y, RC.y * qb0.x + RC.x * qb0.y) + vec2(0.74, 0.22);
          float best = -1.0, bL = 0.0, bW = 1.0, bR = 0.0, under = 0.0; vec3 bU = vec3(0.0); vec4 bT = vec4(1.0, 0.0, 0.0, 0.0);
          float rk[8]; float od[8];
          for (int l = 0; l < 2; l++) {
            vec2 g = (l == 0 ? qa : qb) / CELL, c0 = floor(g - 0.5); float w = l == 0 ? wA : wB, salt = l == 0 ? 0.0 : 41.7;
            for (int k = 0; k < 4; k++) {
              vec2 id = c0 + vec2(float(k & 1), float(k >> 1));
              vec2 h1 = hash22(id + salt), h2 = hash22(id * 1.7 + salt + 3.1);
              vec2 d = (g - id - 0.5 - (h1 - 0.5) * 0.7) * CELL;
              // most lie nearly flat, some well tilted (the outline an ellipse then)
              float th = h2.y < 0.85 ? 0.05 + 0.47 * h2.y : 0.45 + 3.3 * (h2.y - 0.85), az = 6.2832 * fract(h1.x * 57.0 + h1.y * 131.0);
              vec2 e1 = vec2(cos(az), sin(az));
              float u = dot(d, e1) / CR, v = dot(d, vec2(-e1.y, e1.x)) / (CR * cos(th)), rr = sqrt(max(u * u + v * v, 0.0));
              // a layer that is handing over (a flowing face, the sink) sinks under the other
              float rank = (0.08 + 0.92 * h2.x) * (0.02 + 0.98 * w);
              rk[l * 4 + k] = rank; od[l * 4 + k] = rr - 1.0;
              if (rr < 1.0 && rank > best) { best = rank; bU = vec3(u, v, rr); bT = vec4(e1, th, h1.x * 3.7 + h2.x * 7.3); bL = float(l); bW = w; bR = h2.x; }
            }
          }
          // the shade of the coins above at their edges: the dark gap under a rim
          for (int k = 0; k < 8; k++) if (rk[k] > best) under = max(under, 1.0 - smoothstep(0.0, 0.3, od[k]));
          vec3 n = Nm; float rnd = 0.5, rough = 0.3, ao = 0.1, arcN = 0.0; vec3 f0 = mix(uGold, uSilver, uSilverShare) * 0.6;
          if (best > 0.0) {
            float seed = bT.w, spin = 6.2832 * fract(seed * 13.7), cs = cos(spin), sn = sin(spin);
            // the struck face, at the coin's own turn (the two faces side by side in the texture)
            vec2 fu = vec2(cs * bU.x - sn * bU.y, sn * bU.x + cs * bU.y);
            float face = step(0.5, fract(seed * 7.31)), gl = fw / (2.0 * CR);
            vec4 ft = textureGrad(tFace, vec2((clamp(fu.x * 0.5 + 0.5, 0.02, 0.98) + face) * 0.5, fu.y * 0.5 + 0.5), vec2(gl * 0.5, 0.0), vec2(0.0, gl));
            vec2 sf = ft.rg * 2.0 - 1.0, su = vec2(cs * sf.x + sn * sf.y, -sn * sf.x + cs * sf.y);
            vec2 e1 = bT.xy, e2 = vec2(-e1.y, e1.x);
            // the rim's outer bevel (a bright arc where it throws light to the eye), the relief, the coin's tilt
            // (a coin under a dozen pixels broad is a flat mirror at its tilt with an arc of light on its rim: relief
            // and bevel would stand as single bright pixels there)
            float rimK = smoothstep(0.84, 0.93, bU.z), big = smoothstep(6.0, 12.0, px);
            vec2 outw = (e1 * bU.x + e2 * bU.y) / max(bU.z, 0.05);
            vec2 pl = (e1 * su.x + e2 * su.y) * (1.3 * big) + outw * (rimK * 0.9 * big) + e2 * tan(bT.z);
            if (bL > 0.5) { pl = vec2(RC.x * pl.x + RC.y * pl.y, -RC.y * pl.x + RC.x * pl.y); outw = vec2(RC.x * outw.x + RC.y * outw.y, -RC.y * outw.x + RC.x * outw.y); }
            arcN = (1.0 - big) * smoothstep(1.0 - 4.4 / px, 1.0 - 1.4 / px, bU.z) * smoothstep(0.1, 0.8, dot(outw, arcD)) * (0.3 + 0.7 * fract(seed * 5.3));
            n = normalize(Nm + T * pl.x + B * pl.y);
            rnd = fract(seed * 10.31);
            f0 = mix(uGold, uSilver, step(1.0 - uSilverShare, fract(seed * 3.77))) * (0.74 + 0.46 * rnd);
            rough = 0.05 + 0.2 * rnd;
            ao = (1.0 - 0.75 * under) * mix(0.66, 1.0, smoothstep(0.05, 0.6, bR)) * mix(0.72, 1.0, ft.b) * (1.0 - 0.6 * smoothstep(2.5, 6.0, px) * smoothstep(1.0 - min(1.5 * fw / CR, 0.3), 1.0, bU.z)) * smoothstep(0.0, 0.2, bW);
          }
          f0 = mix(f0, uSilver * (0.9 + 0.1 * rnd), fan) * tone;
          colN = coinShade(vW, n, V, f0, rough, ao, 1.7 * (1.0 + 0.4 * cr), 1.0 + 0.5 * cr, op);
          // white-gold where the coin mirrors a roof strip, the sun or the doorway; in the sun's patches every lit coin
          // keeps its own tone, rim and face under a higher ceiling
          // (r6) out of the sun a flash is pale gold, white only in the sun's pools
          colN = coinCap(colN, f0, max(gFlash, 0.3 * gSun)) + mix(vec3(1.7, 1.3, 0.62), vec3(2.4, 2.2, 1.7), gSun) * ((gFlash * 0.55 + arcN * (0.35 + 0.65 * gSun)) * ao * mix(0.3, 1.0, op));
        }
        if (cK < 0.996) {
          // ---- further off the same discs as scales, kept a few pixels broad: world-anchored cells that double with
          // the distance. The larger scales lie over the smaller and come in one by one as the smaller shrink (every
          // other size on the turned plan); in the larger's gaps the smaller go dark as they shrink away
          float Lg = log2(max(2.0 * fg / CR, 1.0)), l0 = floor(Lg), lf = Lg - l0;
          float c0 = CR / 0.7 * exp2(l0), turned = mod(l0, 2.0);
          vec2 qr = vec2(RC.x * q.x - RC.y * q.y, RC.y * q.x + RC.x * q.y), adr = vec2(RC.x * arcD.x - RC.y * arcD.y, RC.y * arcD.x + RC.x * arcD.y);
          vec2 d2; vec4 h2; float u2 = scaleAt((turned > 0.5 ? q : qr) / (2.0 * c0), 7.0 + 13.0 * (l0 + 1.0), lf, d2, h2);
          float pres = u2 > 1.5 ? 0.0 : smoothstep(0.0, 0.2, lf - 0.8 * fract(h2.w * 13.7 + h2.x * 5.1));
          vec3 cBig = vec3(0.0), cSmall = vec3(0.0);
          if (pres > 0.001) cBig = scaleShade(d2, h2, u2, 1.4 * c0 / max(fg, 1e-5), turned > 0.5 ? arcD : adr, Nm, T, B, V, tone, fan, cr, op);
          if (pres < 0.999) {
            vec2 d1; vec4 h1; float u1 = scaleAt((turned > 0.5 ? qr : q) / c0, 7.0 + 13.0 * l0, 2.0, d1, h1);
            cSmall = scaleShade(d1, h1, u1, 0.7 * c0 / max(fg, 1e-5), turned > 0.5 ? adr : arcD, Nm, T, B, V, tone, fan, cr, op) * mix(1.0, 0.15, smoothstep(0.5, 1.0, lf));
          }
          colF = mix(cSmall, cBig, pres);
          // the ripples' light and shade; crests stand a little paler (a sheen line that tells them far off)
          colF *= 1.0 + 0.15 * rip;
          colF += vec3(0.9, 0.72, 0.36) * (smoothstep(0.25, 0.85, cr) * mix(0.2, 1.0, gSun) * op * 0.3);
        }
        vec3 col = mix(colF, colN, cK);
        // the sink: lanes of coin circling in and down, darker furrows between them, the throat going dark
        col *= mix(1.0, mix(0.5, 1.45, smoothstep(-0.5, 0.5, arms)), armK) * mix(1.0, 0.25 + 0.75 * smoothstep(-7.0, 2.0, vW.y), step(rho, uSink.z))
          * (1.0 + 0.45 * smoothstep(uSink.z - 3.0, uSink.z - 0.6, rho) * (1.0 - smoothstep(uSink.z + 0.4, uSink.z + 2.6, rho)));
        gl_FragColor = vec4(hallAir(col, vW), 1.0);
      }`})}function Me(){const t=new i.BufferGeometry;return t.setAttribute("position",new i.Float32BufferAttribute([-1,0,-1,1,0,-1,1,0,1,-1,0,1],3)),t.setAttribute("normal",new i.Float32BufferAttribute([0,1,0,0,1,0,0,1,0,0,1,0],3)),t.setAttribute("uv",new i.Float32BufferAttribute([0,0,1,0,1,1,0,1],2)),t.setIndex([0,2,1,0,3,2]),t}const K=t=>`
  varying vec3 vW, vAx, vAy, vAz; varying vec2 vUv; varying float vId, vOpen;
  uniform sampler2D tFace; uniform vec3 uGold, uSilver; uniform float uSilverShare, uAo, uAir;
  ${t}
  void main() {
    // the round of the coin
    vec2 rd = vUv - 0.5; float rr = length(rd) * 2.0;
    if (rr > 1.0) discard;
    vec3 toEye = cameraPosition - vW; float dist = length(toEye); vec3 V = toEye / max(dist, 1e-3);
    float front = gl_FrontFacing ? 1.0 : -1.0;
    float face = step(0.5, fract(vId * 7.31)); face = front > 0.0 ? face : 1.0 - face;
    vec4 t = texture2D(tFace, vec2((clamp(vUv.x, 0.02, 0.98) + face) * 0.5, vUv.y));
    vec3 ax = normalize(vAx), ay = normalize(vAy) * front, az = normalize(vAz);
    vec3 n = normalize(ay + (ax * (t.r * 2.0 - 1.0) + az * (t.g * 2.0 - 1.0)) * 1.4);
    // the milled rim: a bright bevelled band round the edge of the face
    float rimK = smoothstep(0.84, 0.92, rr);
    n = normalize(mix(n, normalize(ay + (ax * rd.x + az * rd.y) * 2.0), rimK * 0.8));
    float rnd = fract(vId * 13.7);
    vec3 f0 = mix(uGold, uSilver, step(1.0 - uSilverShare, fract(vId * 3.77))) * (0.74 + 0.46 * rnd);
    // the edge itself goes dark over the last pixel: the line that draws the disc
    float edge = 1.0 - 0.55 * smoothstep(1.0 - 3.0 * fwidth(rr), 1.0, rr);
    vec3 col = coinShade(vW, n, V, f0, 0.06 + 0.22 * rnd, uAo * mix(0.7, 1.0, t.b) * edge, mix(2.0, 3.0, uAir), 1.0, vOpen);
    col += f0 * vec3(0.3, 0.27, 0.22) * uAir * 0.6 * min(1.0, uKeyCol.g * 2.3) * edge;
    col *= 1.0 + 0.45 * rimK;
    // white-gold where the coin mirrors a roof strip, the sun or the doorway
    col = mix(coinCap(col, f0, max(gFlash, 0.3 * gSun)), col, uAir) + vec3(2.2, 2.0, 1.5) * gFlash * (0.4 + 0.6 * step(0.5, rnd));
    gl_FragColor = vec4(hallAir(col, vW), 1.0);
  }`;function De(t,a,e){return new i.ShaderMaterial({uniforms:{...t,tFace:{value:a},uGold:{value:e.gold},uSilver:{value:e.silver},uSilverShare:{value:e.silverShare},uAo:{value:.92},uAir:{value:0}},side:i.DoubleSide,vertexShader:`
      attribute float aId; attribute float aOpen;
      varying vec3 vW, vAx, vAy, vAz; varying vec2 vUv; varying float vId, vOpen;
      void main() {
        mat4 m = modelMatrix * instanceMatrix;
        vec4 w = m * vec4(position, 1.0);
        vW = w.xyz; vAx = m[0].xyz; vAy = m[1].xyz; vAz = m[2].xyz; vUv = uv; vId = aId; vOpen = aOpen;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:K(k)})}function qe(t,a,e){return new i.ShaderMaterial({uniforms:{...t,tFace:{value:a},uGold:{value:e.gold},uSilver:{value:e.silver},uSilverShare:{value:e.silverShare},uAo:{value:1},uAir:{value:1},uV0:{value:e.v0??2}},side:i.DoubleSide,vertexShader:`
      attribute vec4 aA, aB, aC, aD;
      uniform float uTime, uV0;
      varying vec3 vW, vAx, vAy, vAz; varying vec2 vUv; varying float vId, vOpen;
      vec3 turn(vec3 v, vec3 k, float a) { float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c); }
      void main() {
        float per = aB.z + aB.w, tau = mod(uTime + aA.w * per, per), tf = min(tau, aB.z);
        vec3 c = aA.xyz + vec3(aB.x, 0.0, aB.y) * tf + vec3(0.0, -uV0 * tf - 4.9 * tf * tf, 0.0);
        float tr = max(tau - aB.z, 0.0), x2 = clamp(tr / max(aB.w, 0.01), 0.0, 1.0), landed = step(0.0001, tr);
        float roll = aC.w * (1.0 - (1.0 - x2) * (1.0 - x2));
        c.xz += aC.xy * roll; c.y -= aC.z * roll;
        float hx = clamp(x2 * 2.5, 0.0, 1.0);
        c.y += landed * (4.0 * aD.w * hx * (1.0 - hx) + 0.02);
        vec3 k = normalize(vec3(cos(aD.x * 40.0), 0.35 * sin(aD.x * 91.0), sin(aD.x * 40.0)));
        float ang = aD.y * (tf + 0.4 * min(tr, 0.5)) + aD.x * 6.2832;
        vec3 up = turn(vec3(0.0, 1.0, 0.0), k, ang), ax = turn(vec3(1.0, 0.0, 0.0), k, ang);
        vec3 nf = normalize(vec3(aC.x * aC.z, 1.0, aC.y * aC.z));
        float settle = smoothstep(0.15, 0.6, x2) * landed;
        up = normalize(mix(up, nf, settle)); ax = normalize(ax - up * dot(ax, up)); vec3 az = cross(ax, up);
        float sc = ${L} * aD.z * (1.0 - smoothstep(0.86, 1.0, x2));
        vec3 w = (modelMatrix * vec4(c, 1.0)).xyz + (ax * position.x + up * position.y + az * position.z) * sc;
        vW = w; vAx = ax; vAy = up; vAz = az; vUv = uv; vId = aD.x; vOpen = 1.0;
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
      }`,fragmentShader:K(k)})}function Be(t,a,e){return new i.ShaderMaterial({uniforms:{...t,tFace:{value:a},uGold:{value:e.gold},uSilver:{value:e.silver},uSilverShare:{value:e.silverShare},uAo:{value:1},uAir:{value:.8}},side:i.DoubleSide,vertexShader:`
      attribute float aP; attribute vec4 aA, aB, aC, aD;
      uniform float uTime;
      varying vec3 vW, vAx, vAy, vAz; varying vec2 vUv; varying float vId, vOpen;
      vec3 turn(vec3 v, vec3 k, float a) { float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c); }
      void main() {
        float tau = mod(uTime - aA.w, aP);
        float e = clamp(tau / aC.w, 0.0, 1.0), f = e * e * (3.0 - 2.0 * e);
        vec3 c = vec3(aA.x + aB.x * f + aB.z * f * f, aA.y + f * (aC.x + f * (aC.y + f * aC.z)), aA.z + aB.y * f + aB.w * f * f);
        float run = max(length(aB.xy), 0.01); vec2 d = aB.xy / run;
        float m = (aC.x + f * (2.0 * aC.y + 3.0 * f * aC.z)) / run;
        vec3 nf = normalize(vec3(-m * d.x, 1.0, -m * d.y));
        c += nf * (0.07 + aD.w * (1.0 - e) * abs(sin(3.1416 * e * (3.0 + 5.0 * fract(aD.x * 17.0)))));
        vec3 acr = normalize(cross(nf, vec3(d.x, 0.0, d.y)));
        // two in three ride flat and rock as the sheet carries them, the others go end over end
        float ang = fract(aD.x * 5.3) > 0.66 ? 3.1416 * aD.y * f : 0.55 * sin(3.1416 * aD.y * f);
        vec3 up = turn(nf, acr, ang), ax = turn(turn(acr, nf, aD.x * 6.2832 + 2.5 * f * sign(aD.y)), acr, ang);
        // its own small tilt, as it lies among the others
        vec3 tk = vec3(cos(aD.x * 71.0), 0.0, sin(aD.x * 71.0)); float tl = 0.3 * fract(aD.x * 53.0);
        up = turn(up, tk, tl); ax = turn(ax, tk, tl); vec3 az = cross(ax, up);
        float sc = ${L} * aD.z * smoothstep(0.0, 0.3, tau) * (1.0 - smoothstep(aP - 1.0, aP - 0.15, tau));
        vec3 w = c + (ax * position.x + up * position.y + az * position.z) * sc;
        vW = w; vAx = ax; vAy = up; vAz = az; vUv = uv; vId = aD.x; vOpen = 1.0;
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
      }`,fragmentShader:K(k)})}function Fe(t,a,e){return new i.ShaderMaterial({uniforms:{...t,tFace:{value:a},uGold:{value:e.gold},uSilver:{value:e.silver},uSilverShare:{value:e.silverShare},uAo:{value:1},uAir:{value:.7},uSink:{value:new i.Vector4(e.sink.x,e.sink.z,e.sink.rim,e.sink.throat)},uSinkY:{value:new i.Vector2(e.sink.rimY,e.sink.depth)},uTilt:{value:new i.Vector3(e.sink.tx||0,e.sink.tz||0,e.sink.tilt||0)}},side:i.DoubleSide,vertexShader:`
      attribute vec4 aA; attribute vec3 aD;
      uniform float uTime; uniform vec4 uSink; uniform vec2 uSinkY; uniform vec3 uTilt;
      varying vec3 vW, vAx, vAy, vAz; varying vec2 vUv; varying float vId, vOpen;
      vec3 turn(vec3 v, vec3 k, float a) { float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c); }
      void main() {
        float R0 = aA.z, P = (R0 * R0 - 5.3) / 14.0 + 1.0, a = mod(uTime + aA.y * P, P);
        float r2 = R0 * R0 - 14.0 * a, tf = max((5.3 - r2) / 14.0, 0.0);
        float r = sqrt(max(r2, 5.3)) - min(tf * 1.4, 1.4);
        float th = aA.x + 1.1 * log(R0 / max(r, 0.5));
        vec2 er = vec2(cos(th), sin(th));
        float rim = uSink.z + 0.9 * abs(sin(th * 3.5 + 1.3)) - 0.5, ry = uSinkY.x + uTilt.z * (er.x * uTilt.x + er.y * uTilt.y), dp = ry - uSinkY.x + uSinkY.y, sl = dp / (rim - uSink.w);
        vec3 c = vec3(uSink.x + er.x * r, ry - dp * (1.0 - (r - uSink.w) / (rim - uSink.w)) - 7.0 * tf * tf, uSink.y + er.y * r);
        vec3 nf = normalize(vec3(-er.x * sl, 1.0, -er.y * sl));
        c += nf * (0.08 + aD.z * abs(sin(a * (2.0 + 3.0 * fract(aA.w * 9.0)) + aA.w * 30.0)));
        // most shuffle and rock as they slide, a share turn right over
        vec3 k = normalize(vec3(cos(aA.w * 40.0), 0.3 * sin(aA.w * 91.0), sin(aA.w * 40.0)));
        float ph = aD.x * a + aA.w * 6.2832, ang = 0.9 * sin(ph) + step(0.7, fract(aA.w * 5.3)) * ph * 0.5;
        vec3 up = turn(nf, k, ang), ax = turn(normalize(cross(nf, vec3(er.x, 0.0, er.y))), k, ang), az = cross(ax, up);
        float sc = ${L} * aD.y * smoothstep(0.0, 0.8, a) * (1.0 - smoothstep(0.25, 0.75, tf));
        vec3 w = c + (ax * position.x + up * position.y + az * position.z) * sc;
        vW = w; vAx = ax; vAy = up; vAz = az; vUv = uv; vId = aA.w; vOpen = mix(0.3, 1.0, smoothstep(-5.0, 6.5, c.y));
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
      }`,fragmentShader:K(k)})}function Te(t,a,e){return new i.ShaderMaterial({uniforms:{...t,tPack:{value:a},uGold:{value:e.gold},uSpeed:{value:e.speed??9},uSeed:{value:e.seed??0},uDens:{value:new i.Vector3(e.top??.8,e.bottom??.3,e.height??20)},uHalf:{value:e.half??0}},side:i.DoubleSide,vertexShader:`
      varying vec3 vW; varying vec3 vN; varying vec2 vUv;
      void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vUv = uv; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
      varying vec3 vW; varying vec3 vN; varying vec2 vUv;
      uniform sampler2D tPack; uniform vec3 uGold, uDens; uniform float uSpeed, uSeed, uHalf;
      ${k}
      void main() {
        vec3 toEye = cameraPosition - vW; float dist = length(toEye); vec3 V = toEye / max(dist, 1e-3);
        vec2 uv = vec2(vUv.x + uSeed * 3.7, vUv.y - uTime * uSpeed) / 3.0 + uSeed;
        vec4 t = texture2D(tPack, uv);
        float fall = clamp(vUv.y / max(uDens.z, 1.0), 0.0, 1.0);
        float dens = mix(uDens.x, uDens.y, fall);
        // thinner toward the stream's edges (a cone fall); a curtain keeps its sheet to the ends
        float wHalf = uHalf > 0.0 ? mix(uHalf * 0.3, uHalf, fall) : 1e6;
        float edge = clamp(abs(vUv.x) / wHalf, 0.0, 1.0);
        dens *= 1.0 - edge * edge;
        float keep = step(0.42, t.b) * step(fract(t.a * 255.0 * 0.6180339 + uSeed), dens);
        vec3 Ns = normalize(vN) * (gl_FrontFacing ? 1.0 : -1.0);
        vec3 T = normalize(cross(vec3(0.0, 1.0, 0.0), Ns));
        vec3 n = normalize(Ns + (T * (t.r * 2.0 - 1.0) - vec3(0.0, 1.0, 0.0) * (t.g * 2.0 - 1.0)) * 1.7);
        float rnd = fract(t.a * 255.0 * 0.3819);
        vec3 col = coinShade(vW, n, V, uGold * (0.74 + 0.46 * rnd), 0.06 + 0.22 * rnd, 1.0, 3.0, 1.0, 1.0) + uGold * vec3(0.3, 0.27, 0.22) * 0.6 * min(1.0, uKeyCol.g * 2.3);
        col = hallAir(col, vW);
        if (keep < 0.5) discard;
        gl_FragColor = vec4(col, 1.0);
      }`})}export{ye as COIN_R,k as HALL_GLSL,ke as makeCoinFaceTexture,Me as makeDiscGeometry,qe as makeFallMaterial,be as makeHallUniforms,De as makeLyingMaterial,Ae as makePackTexture,ze as makeReliefTables,Te as makeSheetMaterial,Fe as makeSinkDiscMaterial,Ce as makeSkinMaterial,Be as makeSlipMaterial};
