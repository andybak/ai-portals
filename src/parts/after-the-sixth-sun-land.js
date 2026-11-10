import*as i from"three";const B=e=>Math.min(1,Math.max(0,e)),b=(e,t,o)=>{const s=B((o-e)/(t-e));return s*s*(3-2*s)},T=(e,t,o)=>e+(t-e)*o,R=0,L=-1.1,A=-345,C=[66,-345],U=[140,290],P=96;function Y(e,t){for(const o of t)o.set(1e9,1e9,-1e9,-1e9);for(const o of e){if(!(o.z>0)||!(o.w>0))continue;const s=1/Math.sqrt(o.w),n=t[o.y>D[3][1]?0:1];n.x=Math.min(n.x,o.x-s),n.y=Math.min(n.y,o.y-s),n.z=Math.max(n.z,o.x+s),n.w=Math.max(n.w,o.y+s)}}const I=e=>`(all(greaterThan(${e}, uPoolBox[0].xy)) && all(lessThan(${e}, uPoolBox[0].zw))) || (all(greaterThan(${e}, uPoolBox[1].xy)) && all(lessThan(${e}, uPoolBox[1].zw)))`,D=[[0,900],[0,250],[0,50],[0,-100],[14,-131],[80,-164],[150,-200],[100,-234],[50,-262],[84,-290],[112,-312],[88,-327],[72,-331]],S=40,H=66,Q=e=>-2300+420*Math.exp(-((e-1250)/700)*((e-1250)/700));function F(e,t){let o=.9*Math.sin(e*.011+1.3)*Math.sin(t*.009+.4)+.5*Math.sin(e*.031+t*.023);const s=t+35-7*Math.sin(e*.0075+.6);o=T(o,-3.4,1-b(19,31,Math.abs(s)));const n=70+11*(1-b(-40,22,e))+5*Math.sin(e*.011+2)*(1-b(-220,-70,e)),l=(1-b(125,290,e))*b(-440,-290,e),x=t>A?B((t-A)/225):B((A-t)/150),h=.5+.5*Math.cos(Math.PI*x);let f=n*l*h;f+=2.2*Math.sin(e*.043+t*.021)*Math.sin(t*.052-e*.012)*h*(1-h)*4*l;const m=Math.hypot(e-C[0],t-C[1]);f+=4*(1-b(16,62,m)),o+=f;const k=Q(e),y=(1-b(-535,-472,t))*b(k-35,k+35,t);o=T(o,-5,y);const a=Math.hypot(e-1250,t+2100);o+=12*(1-b(120,520,a))*(1-y),o+=b(40,620,k-t)*b(380,760,a)*(62+46*Math.sin(e*.0037+1.1)*Math.sin(e*.0013+.4)+24*Math.sin(e*.0091+2.3)+14*Math.sin(e*.021+t*.004));const c=b(2600,5600,Math.hypot(e,t+300))*(1-y);return o+=c*(70+55*Math.sin(e*.0011+1)*Math.sin(t*.0013+2)+35*Math.sin(e*.0023+t*.0017)),o}const V=`
float landH(vec2 p){
  float x = p.x, z = p.y;
  float h = 0.9*sin(x*0.011 + 1.3)*sin(z*0.009 + 0.4) + 0.5*sin(x*0.031 + z*0.023);
  float rz = z + 35.0 - 7.0*sin(x*0.0075 + 0.6);
  h = mix(h, -3.4, 1.0 - smoothstep(19.0, 31.0, abs(rz)));
  float hc = 70.0 + 11.0*(1.0 - smoothstep(-40.0, 22.0, x)) + 5.0*sin(x*0.011 + 2.0)*(1.0 - smoothstep(-220.0, -70.0, x));
  float east = (1.0 - smoothstep(125.0, 290.0, x))*smoothstep(-440.0, -290.0, x);
  float t = z > -345.0 ? clamp((z + 345.0)/225.0, 0.0, 1.0) : clamp((-345.0 - z)/150.0, 0.0, 1.0);
  float prof = 0.5 + 0.5*cos(3.14159265*t);
  float ridge = hc*east*prof;
  ridge += 2.2*sin(x*0.043 + z*0.021)*sin(z*0.052 - x*0.012)*prof*(1.0 - prof)*4.0*east;
  float kd = length(p - vec2(66.0, -345.0));
  ridge += 4.0*(1.0 - smoothstep(16.0, 62.0, kd));
  h += ridge;
  float fx = (x - 1250.0)/700.0;
  float zf = -2300.0 + 420.0*exp(-fx*fx);
  float lake = (1.0 - smoothstep(-535.0, -472.0, z))*smoothstep(zf - 35.0, zf + 35.0, z);
  h = mix(h, -5.0, lake);
  float cd = length(p - vec2(1250.0, -2100.0));
  h += 12.0*(1.0 - smoothstep(120.0, 520.0, cd))*(1.0 - lake);
  h += smoothstep(40.0, 620.0, zf - z)*smoothstep(380.0, 760.0, cd)*(62.0 + 46.0*sin(x*0.0037 + 1.1)*sin(x*0.0013 + 0.4) + 24.0*sin(x*0.0091 + 2.3) + 14.0*sin(x*0.021 + z*0.004));
  float far = smoothstep(2600.0, 5600.0, length(p + vec2(0.0, 300.0)))*(1.0 - lake);
  h += far*(70.0 + 55.0*sin(x*0.0011 + 1.0)*sin(z*0.0013 + 2.0) + 35.0*sin(x*0.0023 + z*0.0017));
  return h;
}`;function J(e,t={}){const o=e.length,s=new i.Vector3,n=v=>{let g=0,w=o;for(let M=0;M<40;M++){const z=(g+w)/2;e.posAtDist(z,s).z>v?g=z:w=z}return(g+w)/2},l=(v,g)=>{for(let w=v;w<o;w+=.5)if(e.posAtDist(w,s),F(s.x,s.z)<g)return w;return o},x=(v,g)=>{for(let w=v;w<o;w+=.5)if(e.posAtDist(w,s),F(s.x,s.z)>=g)return w;return o},h=t.avenue||[243,47],f=n(h[0]),m=n(h[1]),k=l(m,L+.4),y=x(k+1,L+.4),a=n(D[4][1]),c=n(A),u=l(c,R+.3),r=n(D[6][1]),d=n(D[8][1]);let p=c;for(let v=a;v<c;v+=.5)if(e.posAtDist(v,s),$(Math.atan2(E[0]-s.x,s.z-E[1])*180/Math.PI,s)<=0){p=v;break}return{L:o,mAtZ:n,AH:f,AM:(f+m)/2,AE:m,B1:k,B2:y,FT:a,H1:r,H2:d,CV:p,CR:c,SH:u}}const E=[1250,-2100],W=e=>(15+4*(1-b(-30,10,e)))*Math.max(1-b(8,22,e)*(1-b(96,122,e)),0)*(1-b(150,250,e))*b(-420,-330,e);function ee(e){for(let t=A;t>A-400;t-=.5)if(F(e,t)<R+.3)return t;return A-400}const te=(()=>{const e=C[0]-27;let t=e;for(;t>e-100&&W(t-1)<1;)t-=1;return(t+e)/2})();function $(e,t){const o=t.z-A;if(o<30||Math.abs(e)>75)return 0;const s=t.x+Math.tan(e*Math.PI/180)*o,n=o/Math.cos(e*Math.PI/180),l=F(s,A)+W(s);return Math.max(0,Math.atan2(l-t.y,n)*180/Math.PI)}const _="0.05",N="0.2";function oe(e,t){const o=new Float32Array(S+1),s=new Float32Array(S),n=new Float32Array(S);for(let r=0;r<=S;r++)o[r]=r<=19?(r-19)*H-16+(r<19?(e()-.5)*34:0):(r-20)*H+16+(r>20?(e()-.5)*34:0);for(let r=0;r<S;r++)s[r]=150+110*e(),n[r]=e()*s[r];const l=new Uint8Array(4096*4),x=[[.58,.8,.95,1,1],[0,.05,.3,.52,1],[.12,.72,.84,1,1]][t];for(let r=0;r<64;r++)for(let d=0;d<64;d++){const p=e();let v=0;for(;v<4&&p>x[v];)v++;const g=(r*64+d)*4;l[g]=v*40,l[g+1]=Math.floor(e()*256),l[g+2]=e()<.22?255:0,l[g+3]=Math.floor(e()*256)}const h=new i.DataTexture(l,64,64,i.RGBAFormat);h.magFilter=h.minFilter=i.NearestFilter,h.wrapS=h.wrapT=i.RepeatWrapping,h.needsUpdate=!0;const f=r=>{let d=Math.floor((r+33)/H)+19;return d=Math.max(0,Math.min(S-1,d)),r<o[d]&&d>0?d--:r>o[d+1]&&d<S-1&&d++,d},m=(r,d)=>{const p=f(r),v=(d+n[p])/s[p],g=Math.floor(v),w=((g%64+64)%64*64+p%64)*4,M=Math.min(r-o[p],o[p+1]-r),z=Math.min(v-g,1-(v-g))*s[p];return{i:p,j:g,kind:Math.round(l[w]/40),tint:l[w+1]/255,cross:l[w+2]>127,edge:Math.min(M,z),wall:l[w+3]/255}},k=Number(_),y=Number(N),a=Math.asin(y);return{xb:o,len:s,off:n,tex:h,at:m,stripOf:f,season:t,NSTRIP:S,STRIP:H,reapedAt:(r,d)=>{const p=m(r,d);return p.kind===1&&t===0||p.kind===0&&Math.sin((p.cross?d:r)*k+p.tint*40)>y+.025},edgeNear:(r,d)=>{const p=m(r,d);if(p.kind!==0)return null;const v=p.cross?d:r,g=v*k+p.tint*40,w=Math.round(g/6.2832);let M=null;for(let z=w-1;z<=w+1;z++)for(const[K,q]of[[a+6.2832*z,1],[Math.PI-a+6.2832*z,-1]])(!M||Math.abs(K-g)<Math.abs(M.e-g))&&(M={e:K,side:q});return{rc:(M.e-p.tint*40)/k,side:M.side,cross:p.cross}}}}function ae(e){return{uHemiSky:{value:new i.Color(1,1,1)},uHemiGround:{value:new i.Color(.3,.3,.3)},uDirDir:{value:[0,1,2].map(()=>new i.Vector3(0,1,0))},uDirCol:{value:[0,1,2].map(()=>new i.Color(0,0,0))},uFogCol:{value:new i.Color(.8,.8,.8)},uFogDen:{value:35e-5},uTime:{value:0},uPx:{value:.0025},uWind:{value:new i.Vector4(.8,.6,.6,1)},uSeason:{value:e.season},uNight:{value:0},uRim:{value:.25},uXB:{value:Array.from(e.xb)},uSL:{value:Array.from(e.len)},uSO:{value:Array.from(e.off)},tField:{value:e.tex},uRoad:{value:D.map(t=>new i.Vector2(t[0],t[1]))},uTorch:{value:Array.from({length:P},()=>new i.Vector4(0,0,0,0))},uPoolBox:{value:[new i.Vector4(1e9,1e9,-1e9,-1e9),new i.Vector4(1e9,1e9,-1e9,-1e9)]},uBlaze:{value:new i.Vector4(0,0,0,.002)}}}const j=`
varying vec3 vW;
void main(){ vW = position; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.0); }`,G=`
${V}
uniform vec3 uHemiSky, uHemiGround, uFogCol;
uniform vec3 uDirDir[3];
uniform vec3 uDirCol[3];
uniform float uFogDen, uTime, uPx, uSeason, uNight, uRim;
uniform vec4 uWind;
uniform float uXB[41];
uniform float uSL[40];
uniform float uSO[40];
uniform sampler2D tField;
uniform vec2 uRoad[13];
uniform vec4 uTorch[${P}];
uniform vec4 uPoolBox[2];
uniform vec4 uBlaze;         // a big fire: x, z, strength, 1 / reach^2
varying vec3 vW;
float gH(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.x); }
float gN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(gH(i), gH(i + vec2(1.0, 0.0)), f.x), mix(gH(i + vec2(0.0, 1.0)), gH(i + vec2(1.0, 1.0)), f.x), f.y); }
float roadDist(vec2 p){
  float d = 1e5;
  for (int i = 0; i < 12; i++) { vec2 a = uRoad[i], ba = uRoad[i + 1] - a, pa = p - a; float h = clamp(dot(pa, ba)/max(dot(ba, ba), 1e-4), 0.0, 1.0); d = min(d, length(pa - ba*h)); }
  return d;
}
void main(){
  vec2 p = vW.xz;
  vec3 V = vW - cameraPosition; float dist = length(V); V /= max(dist, 1e-3);
  float e = 0.5 + dist*0.004;
  float h0 = landH(p), hx = landH(p + vec2(e, 0.0)), hz = landH(p + vec2(0.0, e));
  vec3 N = normalize(vec3(h0 - hx, e, h0 - hz));
  float fpx = dist*uPx/max(abs(V.y), 0.05);                    // metres of ground one pixel covers
  float n1 = gN(p/37.0), n2 = gN(p/8.3 + 11.0), n3 = gN(p/1.9 + 3.0);

  // ---- which field
  float gi = clamp(floor((p.x + 33.0)/66.0) + 19.0, 0.0, 39.0);
  int i = int(gi);
  float b0 = uXB[i], b1 = uXB[i + 1];
  if (p.x < b0 && i > 0) { i -= 1; b1 = b0; b0 = uXB[i]; } else if (p.x > b1 && i < 39) { i += 1; b0 = b1; b1 = uXB[i + 1]; }
  float L = uSL[i], fz = (p.y + uSO[i])/L, j = floor(fz);
  float edge = min(min(p.x - b0, b1 - p.x), min(fz - j, 1.0 - (fz - j))*L);
  vec4 fd = textureLod(tField, (vec2(float(i), mod(j, 64.0)) + 0.5)/64.0, 0.0);
  float kind = floor(fd.r*255.0/40.0 + 0.5), tint = fd.g;
  vec3 alb = vec3(0.45, 0.3, 0.085); float rowC = 0.12, crop = 1.0, sheenK = 1.0;
  if (kind > 3.5) { alb = vec3(0.19, 0.34, 0.075); rowC = 0.2; sheenK = 0.8; }
  else if (kind > 2.5) { alb = vec3(0.17, 0.105, 0.065); rowC = 0.4; crop = 0.0; sheenK = 0.0; }
  else if (kind > 1.5) { alb = vec3(0.1, 0.175, 0.06); rowC = 0.07; crop = 0.6; sheenK = 0.5; }
  else if (kind > 0.5) { alb = vec3(0.47, 0.4, 0.23); rowC = 0.13; crop = 0.4; sheenK = 0.0; }
  alb *= 0.82 + 0.36*tint;
  float rc = fd.b > 0.5 ? p.y : p.x;
  float fw = fwidth(rc) + 1e-4;                                 // metres across the rows that one pixel covers
  float rk = 6.9813/(0.82 + 0.4*tint);                          // every field is drilled at a spacing of its own
  float rw = rc + 0.15*(n3 - 0.5) + 0.4*(n2 - 0.5);             // and no row is ruled: they wander a little
  float rf = 1.0 - smoothstep(0.1, 0.3, fw*rk/6.2832), rm = 1.0 - smoothstep(0.12, 0.34, fw/7.5), rs = 1.0 - smoothstep(0.12, 0.34, fw/4.4);
  float row = sin(rw*rk), land8 = sin(rc*0.8378 + 2.0*n1);
  alb *= 1.0 + rowC*(row*0.5 - 0.1)*rf + 0.04*land8*rm;
  float rowN = cos(rw*rk)*rowC*1.6*rf;
  // Where the reapers have been the corn is down. They cut along the rows, a swathe at a time, so the standing corn ends in a straight wall: bands
  // across the rows, 126 m from one to the next, about two fifths of each band cut (REAP_K, REAP_AT: the same rule in JavaScript, reapedAt(), puts
  // the stooks on the stubble and the gangs at the wall). The cut part is pale stubble with the straw lying in windrows; the standing part is deep
  // gold, mottled with its ears, and its wall throws a dark line on the stubble.
  float rb = sin(rc*${_} + tint*40.0), wheat = step(kind, 0.5);
  float reaped = smoothstep(${N}, ${N} + 0.05, rb)*wheat;
  float wallSh = (smoothstep(${N}, ${N} + 0.03, rb) - smoothstep(${N} + 0.05, ${N} + 0.13, rb))*wheat;
  float windrow = smoothstep(0.55, 0.95, sin(rc*1.428 + 1.1*n2 + 6.0*tint))*rs;
  float ears = gN(p*2.3 + 7.0), earK = (1.0 - smoothstep(0.12, 0.5, fpx))*wheat*(1.0 - reaped);
  alb *= 1.0 + 0.3*(ears - 0.5)*earK + 0.16*(n3 - 0.5)*wheat*(1.0 - reaped);
  alb = mix(alb, vec3(0.5, 0.43, 0.25)*(0.85 + 0.3*n3), reaped*0.9);
  alb = mix(alb, vec3(0.66, 0.55, 0.3), reaped*windrow*0.5);
  alb *= 1.0 - 0.42*wallSh;
  sheenK *= 1.0 - 0.9*reaped; crop *= 1.0 - 0.5*reaped; rowN *= 1.0 - 0.6*reaped;
  alb *= 0.84 + 0.2*n1 + 0.14*n2 + 0.1*(n3 - 0.5)*rf;
  alb = mix(alb, alb.grb*vec3(0.9, 1.0, 0.8), 0.18*(n2 - 0.5)*crop);
  // verges along every boundary: rough grass
  float verge = 1.0 - smoothstep(0.8, 2.4 + 0.8*n2, edge);
  vec3 grass = vec3(0.115, 0.17, 0.055)*(0.7 + 0.5*n2 + 0.25*n3);
  alb = mix(alb, grass, verge); crop *= 1.0 - verge; rowN *= 1.0 - verge;

  // ---- meadow by the river, pasture beyond it, the ridge, the shores
  float rz = p.y + 35.0 - 7.0*sin(p.x*0.0075 + 0.6);
  float fieldZone = smoothstep(22.0, 34.0, rz + 6.0*(n1 - 0.5));
  vec3 pasture = mix(vec3(0.12, 0.19, 0.06), vec3(0.22, 0.24, 0.085), n1)*(0.75 + 0.5*n2);
  float ridgeK = 1.0 - smoothstep(-175.0, -112.0, p.y);
  vec3 rough = mix(vec3(0.12, 0.16, 0.06), vec3(0.3, 0.27, 0.13), n1*0.7 + 0.3*n2)*(0.7 + 0.5*n3);
  vec3 rock = vec3(0.24, 0.215, 0.185)*(0.7 + 0.5*n2);
  pasture = mix(pasture, mix(rough, rock, 1.0 - smoothstep(0.72, 0.86, N.y)), ridgeK);
  float nearK = 1.0 - smoothstep(0.25, 0.9, fpx);               // detail that only the near ground shows
  vec2 tw2 = vec2(dot(p, uWind.xy), dot(p, vec2(-uWind.y, uWind.x)));
  float tus = gN(vec2(tw2.x*0.55, tw2.y*1.9)), tus2 = gN(vec2(tw2.x*0.16, tw2.y*0.6) + 9.0);      // tussocks, combed along the wind
  pasture *= 1.0 + (0.5*(tus - 0.5)*nearK + 0.45*(tus2 - 0.5))*(0.4 + 0.6*ridgeK);
  vec2 sc = floor(p/3.3), sf = fract(p/3.3) - 0.5; float sh = gH(sc);
  vec2 sq = sf - (vec2(gH(sc + 3.1), gH(sc + 7.7)) - 0.5)*0.5; sq = vec2(sq.x + 0.35*sq.y, sq.y*(1.2 + 0.8*gH(sc + 5.5)));      // (no two the same shape)
  float stone = step(0.8, sh)*(1.0 - smoothstep(0.05 + 0.1*sh, 0.1 + 0.13*sh, length(sq) + 0.03*gN(p*2.3)))*nearK*ridgeK;
  pasture = mix(pasture, vec3(0.3, 0.29, 0.275)*(0.55 + 0.6*gH(sc + 1.3))*(0.75 + 0.5*smoothstep(-0.1, 0.1, sq.y - sq.x)), stone);
  alb = mix(pasture, alb, fieldZone); crop = mix(0.5, crop, fieldZone); rowN *= fieldZone; sheenK = mix(0.5, sheenK, fieldZone);
  float wet = 1.0 - smoothstep(-1.3, 0.2, h0);
  alb = mix(alb, vec3(0.13, 0.105, 0.075)*(0.7 + 0.6*n3), wet*step(-200.0, p.y));
  float shore = (1.0 - smoothstep(0.3, 1.6, h0))*(1.0 - step(-430.0, p.y));
  alb = mix(alb, mix(vec3(0.1, 0.11, 0.07), vec3(0.4, 0.37, 0.31), smoothstep(-1500.0, -800.0, p.y))*(0.75 + 0.5*n3), shore);
  alb *= 1.0 - 0.45*(1.0 - smoothstep(-2600.0, -2000.0, p.y));      // the far hills are dark heath and wood
  float cd = length(p - vec2(1250.0, -2100.0));
  alb = mix(alb, vec3(0.42, 0.4, 0.36), 1.0 - smoothstep(250.0, 560.0, cd));

  // ---- the road, and the pale floor of the avenue
  float grassK = 1.0;
  if (abs(p.x - 60.0) < 130.0 && p.y > -345.0) {
    float rd = roadDist(p), w = p.y > -76.0 ? 3.5 : 2.5;
    float allee = (1.0 - smoothstep(9.0, 11.5 + 1.5*n2, abs(p.x)))*smoothstep(40.0, 52.0, p.y)*(1.0 - smoothstep(250.0, 264.0, p.y));
    vec3 earth = vec3(0.47, 0.4, 0.29)*(0.78 + 0.3*n2 + 0.2*n3);
    alb = mix(alb, mix(earth, grass*1.2, smoothstep(0.55, 0.8, n2*0.6 + n3*0.4)*0.6), allee*0.9);
    float vg = (1.0 - smoothstep(w + 0.8, w + 3.2, rd))*(1.0 - allee);
    alb = mix(alb, grass*1.1, vg*0.85);
    float rmk = 1.0 - smoothstep(w - 0.7 + 0.5*n3, w + 0.2 + 0.5*n3, rd);
    vec3 road = vec3(0.7, 0.62, 0.48)*(0.8 + 0.25*n2 + 0.2*n3);
    road *= 1.0 - 0.22*(1.0 - smoothstep(0.25, 0.6, abs(abs(rd) - 1.15)))*(1.0 - smoothstep(0.3, 1.2, fpx));      // ruts
    alb = mix(alb, road, rmk);
    grassK = 1.0 - max(allee, rmk);
    float cl = max(max(allee, vg), rmk); crop *= 1.0 - cl; rowN *= 1.0 - cl; sheenK *= 1.0 - cl;
  }

  // ---- gusts: bands of pale sheen travelling over the crop
  float gt = uTime*uWind.w, ph = dot(p, uWind.xy)*0.05 - gt*1.3, cr = dot(p, vec2(-uWind.y, uWind.x))*0.05;
  float gust = 0.5*sin(ph + 1.3*sin(cr*0.7 + gt*0.31)) + 0.28*sin(ph*2.7 + cr*1.9 + 1.3) + 0.07*sin(ph*6.1 - cr*3.3 + gt*0.9)*rm;
  float paws = gN((p - uWind.xy*(gt*7.0))/64.0 + 3.0)*0.65 + gN((p - uWind.xy*(gt*9.0))/23.0)*0.35;      // each gust is a patch that runs with the wind, not a ruled band
  float sheen = smoothstep(0.05, 0.7, gust)*smoothstep(0.38, 0.62, paws)*min(uWind.z, 1.8)*sheenK*1.25;
  // (standing corn MOVES: where a gust runs the ears bow and the field flashes pale, and the trough behind it is dark; stubble and bare earth do not)
  alb = mix(alb, alb*1.5 + vec3(0.08, 0.075, 0.05), 0.6*sheen);
  alb *= 1.0 - 0.24*(1.0 - smoothstep(-0.7, -0.1, gust))*sheenK*(0.35 + 0.65*smoothstep(0.3, 0.6, paws));

  // By starlight the eye sees no colour and little contrast: grass, stubble and corn are dark, close in value (no mottle), the road and bare stone
  // paler; everything about half of what it was before fix round 2 and well under the white dome.
  vec3 albL = alb;      // (second hand mend, N2a) what the ground is under a lamp: its own colour at every hour, whatever the sky does
  { float lum = clamp(dot(alb, vec3(0.3, 0.55, 0.15)), 0.0, 1.0); alb = mix(alb, (0.06 + 0.12*lum)*vec3(0.9, 0.97, 1.14), 0.94*uNight); }
  // ---- light: hemisphere and three directionals, as the trees get them; crops glow when seen against a low sun
  if (fd.b > 0.5) N.z += rowN; else N.x += rowN;
  N.xz += (vec2(tus, tus2) - 0.5)*(0.55*(1.0 - fieldZone) + 0.45*ridgeK)*(0.4 + 0.6*nearK)*(1.0 - 0.8*uNight);      // rough ground has relief (by starlight the eye cannot make it out)
  N = normalize(N);
  vec3 light = mix(uHemiGround, uHemiSky, N.y*0.5 + 0.5), back = vec3(0.0), rim = vec3(0.0);
  float graze = 1.0 - clamp(dot(N, -V), 0.0, 1.0); graze *= graze; graze *= graze;
  vec2 vh = V.xz/max(length(V.xz), 1e-4);
  for (int k = 0; k < 3; k++) {
    vec3 Ld = uDirDir[k];
    light += uDirCol[k]*max(dot(N, Ld), 0.0);
    float tow = max(dot(vh, Ld.xz/max(length(Ld.xz), 1e-4)), 0.0);
    back += uDirCol[k]*(tow*tow*tow*(1.0 - abs(V.y))*smoothstep(-0.02, 0.06, Ld.y));
    rim += uDirCol[k]*(tow*tow*graze*smoothstep(-0.02, 0.06, Ld.y));      // ground seen edge-on against a low sun takes a rim of its light
  }
  vec3 col = alb*light*0.3183 + alb*back*(crop*0.085) + alb*rim*uRim;
  vec3 tl = vec3(0.0);
  // (second hand mend, N2a; the last thing, Q1) EVERY lamp lights the ground round it, and only a little of it: a torch is a small flame that lights
  // the steps round its bearer and no more. A pool reaches 2 m at the most (down to a fifth by 1.5 m) and never half-way to the next lamp, so two
  // pools do not meet (w: 1 / the pool's reach squared, set by whoever places the lamp). The pool is the lamp's own at every hour: light added to
  // the ground's own colour, with no share of the sky's state, the clock or the eye in it (under the suns it is drowned).
  // (cost only, C1) outside the two boxes that hold every lit pool with its reach the sum is nothing, so it is not made there (see poolBoxes)
  if (${I("p")}) {
    for (int k = 0; k < ${P}; k++) { vec2 dd = p - uTorch[k].xy; float a = max(0.0, 1.0 - dot(dd, dd)*uTorch[k].w); tl += vec3(1.0, 0.5, 0.14)*(uTorch[k].z*a*a); }
  }
  // and it is weak: under a lamp the pale road stays well under the observatory's lit stone, which is the brightest thing on the ground in the dark
  { vec3 fl = albL*tl*0.8; float fm = max(fl.r, max(fl.g, fl.b)); col += fl*(0.1/(0.1 + fm)); }
  { vec2 dd = p - uBlaze.xy; col += alb*vec3(1.0, 0.4, 0.09)*(uBlaze.z*exp(-dot(dd, dd)*uBlaze.w)*1.5); }
  // the cold sheen of starlight on the blades of the nearer grass
  { float bl = gN(vec2(tw2.x*1.3, tw2.y*7.5) + 5.0); col += vec3(0.55, 0.7, 1.0)*(0.016*uNight*smoothstep(0.55, 0.92, bl)*(0.3 + 0.7*graze)*(0.3 + 0.7*nearK)*grassK); }
  float f = 1.0 - exp(-uFogDen*uFogDen*dist*dist);
  gl_FragColor = vec4(mix(col, uFogCol, clamp(f, 0.0, 1.0)), 1.0);
}`;function O(e,t,o,s,n){const l=[];for(let f=e;f<=t+.001;f+=o)l.push(f);let x=o,h=t;for(;h<n;)x*=1.2,h+=x,l.push(Math.min(h,n));for(x=o,h=e;h>s;)x*=1.2,h-=x,l.unshift(Math.max(h,s));return l}async function re(e,t){const o=O(-140,140,5,-7e3,7e3),s=O(-540,600,5.2,-7500,6500),n=o.length,l=s.length,x=new Float32Array(n*l*3),h=new Uint32Array((n-1)*(l-1)*6);for(let a=0;a<l;a++){for(let c=0;c<n;c++){const u=(a*n+c)*3;x[u]=o[c],x[u+1]=F(o[c],s[a]),x[u+2]=s[a]}a%40===39&&await t()}let f=0;for(let a=0;a<l-1;a++)for(let c=0;c<n-1;c++){const u=a*n+c,r=u+1,d=u+n,p=d+1;h[f++]=u,h[f++]=d,h[f++]=r,h[f++]=r,h[f++]=d,h[f++]=p}await t();const m=new i.BufferGeometry;m.setAttribute("position",new i.BufferAttribute(x,3)),m.setIndex(new i.BufferAttribute(h,1)),m.boundingSphere=new i.Sphere(new i.Vector3(0,0,0),12e3);const k=new i.ShaderMaterial({uniforms:e,vertexShader:j,fragmentShader:G,fog:!1}),y=new i.Mesh(m,k);return y.frustumCulled=!1,{object:y,triangles:h.length/3}}const Z=`
${V}
attribute vec4 aBase;       // x, z, crown centre height, crown radius
attribute vec4 aQ;          // sun, trunk radius, kind, seed
uniform vec2 uAway[6];
uniform float uCot[6];
uniform float uStr[6];
uniform vec3 uShare[6];
varying vec2 vAB; varying vec4 vP; varying vec3 vShare; varying vec3 vQ; varying vec2 vHD;
void main(){
  int si = int(aQ.x + 0.5);
  vec3 sh = uShare[si];
  float ac = min(aBase.z*uCot[si], 112.0), st = uStr[si];
  float len = ac + aBase.w*st*1.15 + 2.0, hw = aBase.w*1.25 + 0.7;
  float a = -1.5 + position.x*len;
  vec2 aw = uAway[si];
  vec2 xz = aBase.xy + aw*a + vec2(-aw.y, aw.x)*(position.y*hw);
  float h = landH(xz);
  vec3 wp = vec3(xz.x, h + 0.12, xz.y);
  float dist = distance(wp, cameraPosition);
  wp.y += 0.0012*dist;
  vAB = vec2(a, position.y*hw); vP = vec4(ac, aBase.w, st, aQ.y); vShare = sh; vQ = vec3(aQ.x, aQ.z, aQ.w); vHD = vec2(h, dist);
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
  if (max(sh.r, max(sh.g, sh.b)) < 0.004) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`,X=`
uniform float uFogDen, uTime, uHard;
uniform vec4 uFleck;        // the dark body's offset from the sun in the fleck's frame (sun radii), strength, -
varying vec2 vAB; varying vec4 vP; varying vec3 vShare; varying vec3 vQ; varying vec2 vHD;
float dH(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.x); }
float dN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(dH(i), dH(i + vec2(1.0, 0.0)), f.x), mix(dH(i + vec2(0.0, 1.0)), dH(i + vec2(1.0, 1.0)), f.x), f.y); }
void main(){
  float a = vAB.x, b = vAB.y, ac = vP.x, r = max(vP.y, 0.1), st = clamp(vP.z, 1.0, 4.0);
  float soft = (0.1 + 0.004*a)*mix(1.0, 0.4, uHard*step(4.5, vQ.x)), m;
  if (vQ.y > 0.5) {      // a solid block: a bar from its foot to where its top falls
    m = (1.0 - smoothstep(r - 0.3, r + 0.3 + 0.02*a, abs(b)))*smoothstep(-0.6, 0.3, a)*(1.0 - smoothstep(ac - 0.5, ac + 1.0 + 0.03*a, a));
  } else {
    vec2 e = vec2((a - ac)/(r*st), b/r);
    float rr = length(e) + 0.3*(dN(vec2(a/st, b)*0.55 + vQ.z*31.0) - 0.5) + 0.12*(dN(vec2(a/st, b)*1.7 + vQ.z*7.0) - 0.5);
    float crown = 1.0 - smoothstep(1.0 - soft, 1.0 + soft, rr);
    float tw = vP.w*0.7;
    float trunk = (1.0 - smoothstep(tw, tw + 0.22 + 0.012*a, abs(b)))*smoothstep(-0.4, 0.2, a)*(1.0 - smoothstep(ac - 1.0, ac + 0.5, a));
    if (vQ.x > 4.5 && uFleck.z > 0.001) {      // under the red sun the crown's shade is pierced by images of the sun: coins, bitten coins, parings
      vec2 g = vec2((a - ac)/st, b)/1.15 + vQ.z*17.0;
      vec2 ci = floor(g), cf = fract(g) - 0.5;
      float hh = dH(ci);
      vec2 off = (vec2(dH(ci + 3.3), dH(ci + 8.1)) - 0.5)*0.38 + 0.03*vec2(sin(uTime*2.3 + hh*40.0), cos(uTime*1.9 + hh*23.0));
      vec2 q = (cf - off)/(0.22 + 0.12*hh);
      float sun = 1.0 - smoothstep(0.82, 1.06, length(q));
      float body = 1.0 - smoothstep(4.86, 5.1, length(q - uFleck.xy));
      crown *= 1.0 - 0.95*sun*(1.0 - body)*step(0.22, hh)*uFleck.z*(1.0 - smoothstep(0.75, 1.08, rr));
    }
    m = max(crown*0.94, trunk);
  }
  m *= smoothstep(-1.7, -0.9, vHD.x);                           // nothing lies on the river
  m *= exp(-uFogDen*uFogDen*vHD.y*vHD.y);
  gl_FragColor = vec4(1.0 - vShare*m, 1.0);
}`;function se(e,t){const o=e.length*6,s=new Float32Array(o*4),n=new Float32Array(o*4);e.forEach((a,c)=>{for(let u=0;u<6;u++){const r=(c*6+u)*4;s[r]=a.x,s[r+1]=a.z,s[r+2]=a.hc,s[r+3]=a.r,n[r]=u,n[r+1]=a.tr??.5,n[r+2]=a.kind??0,n[r+3]=c*.6180339%1}});const l=8,x=[],h=[];for(let a=0;a<=l;a++)x.push(a/l,-1,0,a/l,1,0);for(let a=0;a<l;a++){const c=a*2;h.push(c,c+2,c+1,c+1,c+2,c+3)}const f=new i.InstancedBufferGeometry;f.setAttribute("position",new i.Float32BufferAttribute(x,3)),f.setIndex(h),f.setAttribute("aBase",new i.InstancedBufferAttribute(s,4)),f.setAttribute("aQ",new i.InstancedBufferAttribute(n,4)),f.instanceCount=o;const m={uAway:{value:[0,1,2,3,4,5].map(()=>new i.Vector2(0,1))},uCot:{value:[3,3,3,3,3,3]},uStr:{value:[2,2,2,2,2,2]},uShare:{value:[0,1,2,3,4,5].map(()=>new i.Vector3)},uFogDen:t.uFogDen,uTime:t.uTime,uFleck:{value:new i.Vector4(3,-3,0,0)},uHard:{value:0}},k=new i.ShaderMaterial({uniforms:m,vertexShader:Z,fragmentShader:X,transparent:!0,depthWrite:!1,fog:!1,side:i.DoubleSide,blending:i.CustomBlending,blendEquation:i.AddEquation,blendSrc:i.ZeroFactor,blendDst:i.SrcColorFactor,blendSrcAlpha:i.ZeroFactor,blendDstAlpha:i.OneFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4}),y=new i.Mesh(f,k);return y.frustumCulled=!1,y.renderOrder=-2,{object:y,uniforms:m,count:o,triangles:o*l*2,update(a){for(let u=0;u<6;u++)m.uAway.value[u].copy(a.away[u]),m.uCot.value[u]=a.cot[u],m.uShare.value[u].copy(a.share[u]),m.uStr.value[u]=Math.min(4,1/Math.sin(Math.max(u===5?a.el5:a.suns[u].el,8)*Math.PI/180));m.uHard.value=a.hard*(1-a.night);const c=(7.2+a.thick)/1.8;m.uFleck.value.set(.694*c,-.72*c,b(12.5,15.5,a.turn)*b(0,.02,a.thick),0)}}}export{E as CITY,A as CREST_Z,U as FARM,te as GAP_X,I as IN_POOL_BOX,C as KNOLL,R as LAKE_Y,V as LAND_GLSL,P as NPOOL,L as RIVER_Y,D as ROAD,W as beltH,ee as lakeShoreZ,F as landH,ae as landUniforms,se as makeDecals,oe as makeFields,re as makeGround,Y as poolBoxes,J as routePlaces,$ as skylineEl};
