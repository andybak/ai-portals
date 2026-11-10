import*as v from"three";const O=6,ut=6,bt=["#F7EFE2","#FF8E7A","#FFC98A","#9ED9C3","#4FA58E","#8FD3F0","#2B3A67"];function yt(l,s,o){l/=.6,s/=.6,o/=.6;const z=.59719*l+.35458*s+.04823*o,d=.076*l+.90834*s+.01566*o,t=.0284*l+.13383*s+.83777*o,C=f=>(f*(f+.0245786)-90537e-9)/(f*(.983729*f+.432951)+.238081),b=C(z),k=C(d),T=C(t);return[1.60475*b-.53108*k-.07367*T,-.10208*b+1.10813*k-.00605*T,-.00327*b-.07276*k+1.07602*T]}function Ee(l,s=1.02){const o=new v.Color(l),z=F=>.2126*F[0]+.7152*F[1]+.0722*F[2],d=z([o.r,o.g,o.b]),t=(o.r+o.g+o.b)/3,C=1.22,b=[Math.max(.004,t+(o.r-t)*C),Math.max(.004,t+(o.g-t)*C),Math.max(.004,t+(o.b-t)*C)];let k=0,T=8;for(let F=0;F<28;F++){const B=(k+T)/2;z(yt(b[0]*B,b[1]*B,b[2]*B))<d?k=B:T=B}let f=(k+T)/2;const S=Math.max(b[0],b[1],b[2])*f;return S>s&&(f*=s/S),new v.Color(b[0]*f,b[1]*f,b[2]*f)}const re={gun:"24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!",eater:"2o$obo$2bo$2b2o!",block:"2o$2o!",beehive:"b2o$o2bo$b2o!",loaf:"b2o$o2bo$bobo$2bo!",boat:"2o$obo$bo!",tub:"bo$obo$bo!",pond:"b2o$o2bo$o2bo$b2o!",ship:"2o$obo$b2o!",pulsar:"2b3o3b3o2$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o2$2b3o3b3o$o4bobo4bo$o4bobo4bo$o4bobo4bo2$2b3o3b3o!",honeyfarm:"6bo$5bobo$5bobo$6bo2$b2o7b2o$o2bo5bo2bo$b2o7b2o2$6bo$5bobo$5bobo$6bo!"};function pe(l){const s=[];let o=0,z=0,d="";for(const t of l){if(t>="0"&&t<="9"){d+=t;continue}const C=d===""?1:parseInt(d,10);if(d="",t==="b")o+=C;else if(t==="o"){for(let b=0;b<C;b++)s.push([o+b,z]);o+=C}else if(t==="$")z+=C,o=0;else if(t==="!")break}return s}function Ne(l,s){const o=l.map(([t,C])=>{let b=t,k=C;if(s&4){const T=b;b=k,k=T}return s&1&&(b=-b),s&2&&(k=-k),[b,k]}),z=Math.min(...o.map(t=>t[0])),d=Math.min(...o.map(t=>t[1]));return o.map(([t,C])=>[t-z,C-d])}function Ue(l){const s=l*l,o={G:l,alive:new Uint8Array(s),next:new Uint8Array(s),age:new Uint8Array(s),heat:new Uint8Array(s),nbr:new Uint8Array(s),hist:new Uint8Array(s),role:new Uint8Array(s),cap:new Uint8Array(s).fill(3),cool:new Uint8Array(s).fill(25),fixed:new Uint8Array(s),step:0,x0:l,x1:-1,z0:l,z1:-1,pop:0};return o.stamp=(z,d,t,C=1,b=0)=>{for(const[k,T]of z){const f=d+k,S=t+T;if(f<4||S<4||f>=l-4||S>=l-4)continue;const F=S*l+f;o.alive[F]=1,o.age[F]=C,b&&(o.cap[F]=b),C>=255&&(o.fixed[F]=1),f<o.x0&&(o.x0=f),f>o.x1&&(o.x1=f),S<o.z0&&(o.z0=S),S>o.z1&&(o.z1=S)}},o.tick=()=>{const{alive:z,next:d,age:t,heat:C,nbr:b,hist:k,cool:T}=o,f=Math.max(4,o.x0-1),S=Math.min(l-5,o.x1+1),F=Math.max(4,o.z0-1),B=Math.min(l-5,o.z1+1);let q=l,a=-1,m=l,y=-1,x=0;for(let p=F;p<=B;p++)for(let A=f,c=p*l+f;A<=S;A++,c++){const L=z[c-l-1]+z[c-l]+z[c-l+1]+z[c-1]+z[c+1]+z[c+l-1]+z[c+l]+z[c+l+1],I=z[c],H=L===3||I&&L===2?1:0;d[c]=H,H&&(x++,A<q&&(q=A),A>a&&(a=A),p<m&&(m=p),p>y&&(y=p))}for(let p=F;p<=B;p++)for(let A=f,c=p*l+f;A<=S;A++,c++){const L=z[c],I=d[c];k[c]=(k[c]<<1|(I&&!L?1:0))&255,I?t[c]=L?t[c]<255?t[c]+1:255:1:(t[c]=0,C[c]=L?255:C[c]>T[c]?C[c]-T[c]:0),I&&C[c]>0&&(C[c]=C[c]>T[c]?C[c]-T[c]:0),z[c]=I}if(a>=l-9||y>=l-9||q<=8||m<=8){for(let p=F;p<=B;p++)for(let A=f;A<=S;A++)if(A<8||p<8||A>l-9||p>l-9){const c=p*l+A;z[c]&&(z[c]=0,t[c]=0,C[c]=255,x--)}}for(let p=F;p<=B;p++)for(let A=f,c=p*l+f;A<=S;A++,c++)b[c]=z[c-l-1]+z[c-l]+z[c-l+1]+z[c-1]+z[c+1]+z[c+l-1]+z[c+l]+z[c+l+1];o.px0=f,o.px1=S,o.pz0=F,o.pz1=B,a>=0&&(o.x0=Math.min(q,f+1),o.x1=Math.max(a,S-1),o.z0=Math.min(m,F+1),o.z1=Math.max(y,B-1)),o.pop=x,o.step++},o}function Ae(l,s){const{G:o,alive:z,role:d,fixed:t}=l,{gx:C,gz:b}=s,k=Math.max(1,l.px0??1),T=Math.min(o-2,l.px1??o-2),f=Math.max(1,l.pz0??1),S=Math.min(o-2,l.pz1??o-2),F=[];for(let y=f;y<=S;y++)for(let x=k,p=y*o+k;x<=T;x++,p++)d[p]=0;const B=s._seen||(s._seen=new Uint32Array(o*o)),q=++s._mark||(s._mark=1),a=[],m=[];for(let y=f;y<=S;y++)for(let x=k,p=y*o+k;x<=T;x++,p++){if(!z[p]||t[p])continue;const A=x-C,c=y-b;if(!d[p]&&A>=-3&&A<=38&&c>=-4&&c<=12&&(d[p]=3),!d[p]&&s.shipBand&&c>=s.shipBand[0]&&c<=s.shipBand[1]&&A>=s.shipBand[2]&&A<=s.shipBand[3]){d[p]=3;continue}if(!d[p]&&s.plazas){for(const n of s.plazas)A>=n[0]&&A<=n[2]&&c>=n[1]&&c<=n[3]&&(d[p]=5);if(d[p])continue}if(B[p]===q||A<19||c<6||s.eaterMask?.[p])continue;m.length=0,a.length=0,a.push(p),B[p]=q;let L=x,I=x,H=y,j=y,W=!1;for(;a.length;){const n=a.pop();m.push(n);const K=n%o,V=n/o|0;if(K<L&&(L=K),K>I&&(I=K),V<H&&(H=V),V>j&&(j=V),!(m.length>9))for(let E=-1;E<=1;E++)for(let Z=-1;Z<=1;Z++){const N=n+E*o+Z;if(!(N===n||!z[N])){if(t[N]||s.eaterMask?.[N]){W=!0;continue}B[N]!==q&&(B[N]=q,a.push(N))}}}if(m.length===5&&I-L===2&&j-H===2&&!W&&L-C>=19&&H-b>=6&&Math.abs(L-C-(H-b)-14)<=3){let n=m[0],K=-1;for(const V of m){const E=(V%o+(V/o|0))*4+((V/o|0)-H);E>K&&(K=E,n=V)}for(const V of m)d[V]=1;d[n]=2,F.push({x:L+1.5,z:H+1.5,head:n})}}return l.gliders=F,F}async function zt(l,s,o){const z=l<200?Math.floor(l/8):0,d={G:l,gx:(l>>1)-18-z,gz:(l>>1)-4-z,ok:!0};d.ox=d.gx+18,d.oz=d.gz+4.5;const t=pe(re.gun),C=([m,y])=>m<=1&&y>=4&&y<=5||m>=34&&y>=2&&y<=3,b=m=>{m.stamp(t.filter(y=>!C(y)),d.gx,d.gz,1,2),m.stamp(t.filter(C),d.gx,d.gz,255,s.gunStoreys??14)},k=Ue(l);b(k);const T=new Float32Array(30);let f=null;for(let m=1;m<=150;m++){if(m%4===0&&await o.yield?.(),k.tick(),m>60){let y=0;for(let x=d.gz-2;x<=d.gz+10;x++)for(let p=d.gx+14;p<=d.gx+22;p++)y+=k.alive[x*l+p];T[m%30]+=y}if(!f&&m>60){const y=Ae(k,d).filter(x=>x.x-d.gx>34&&x.z-d.gz>18);if(y.length){const x=y[0],p=[];for(let A=-1;A<=1;A++)for(let c=-1;c<=1;c++)k.alive[(x.z-.5+A)*l+(x.x-.5+c)]&&p.push([c+1,A+1]);f={n:m,x:x.x-1.5,z:x.z-1.5,cells:p}}}}let S=0;for(let m=1;m<30;m++)T[m]>T[S]&&(S=m);const F=((s.meetStep??30)%30+30)%30;let B=s.preRoll??240;for(;(B+F)%30!==S;)B++;d.s0=B,d.meetPhase=S;const q=pe(re.eater);let a=null;if(f&&s.eater!==!1)for(let m=0;m<8&&!a;m++){const y=Ne(q,m);for(let x=2;x<=9&&!a;x++)for(let p=2;p<=9&&!a;p++){await o.yield?.();const A=Ue(40);A.stamp(f.cells,10,10,1),A.stamp(y,10+p,10+x,200);const c=new Set(y.map(([j,W])=>(10+x+W)*40+10+p+j));let L=-1,I=-1,H=new Set;for(let j=1;j<=48;j++){A.tick();let W=A.pop===7;for(const n of c)A.alive[n]||(W=!1,H.add(n));if(!W&&L<0&&[...c].some(n=>!A.alive[n])&&(L=j),W&&L>=0&&I<0&&(I=j),!W&&I>=0){I=-2;break}}L>0&&I>0&&I-L<=8&&(a={o:m,ex:p,ez:x,start:L,cells:y,lip:[...H].map(j=>[j%40-10-p,(j/40|0)-10-x])})}}if(a){const m=s.eatStep??88,y=s.avenueCells??38;let x=0,p=1e9;for(let A=-8;A<=8;A++){const c=f.x+a.ex+(y-(f.x-d.gx-23))+A;if(c+6>l-10)continue;const L=c-f.x-a.ex,I=f.n+a.start-1+4*L-B;let H=((I-m)%30+30)%30;H>15&&(H=30-H);const j=H*10+Math.abs(A);j<p&&(p=j,x=L,d.eatStep=I)}d.eater={x:f.x+a.ex+x,z:f.z+a.ez+x,cells:a.cells,lip:a.lip},d.eatStep=m+((d.eatStep-m)%30+45)%30-15}return d.stampGun=b,d}function Ge(l=!1){const s=[],o=[],z=[],d=(f,S,F,B,q,a,m)=>{s.push(f,S,F),o.push(B,q,a),z.push(m[0],m[1],m[2])},t=(f,S,F,B,q)=>{d(...f,q),d(...S,q),d(...F,q),d(...f,q),d(...F,q),d(...B,q)},C=(f,S,F,B)=>{d(...f,B),d(...S,B),d(...F,B)},b=Math.SQRT1_2,k=1/Math.sqrt(3);t([-1,1,1,1,0,1],[1,1,1,1,0,1],[1,1,-1,1,0,1],[-1,1,-1,1,0,1],[0,1,0]),l&&t([-1,0,-1,0,0,0],[1,0,-1,0,0,0],[1,0,1,0,0,0],[-1,0,1,0,0,0],[0,-1,0]);for(let f=0;f<4;f++){const S=[[1,0],[0,-1],[-1,0],[0,1]][f],F=[-S[1],S[0]],B=(p,A,c,L,I)=>[S[0]+F[0]*p,A,S[1]+F[1]*p,c,L,I],q=S[0]!==0?[0,1]:[1,0];t(B(-1,0,q[0],0,q[1]),B(1,0,q[0],0,q[1]),B(1,1,q[0],1,q[1]),B(-1,1,q[0],1,q[1]),[S[0],0,S[1]]),t(B(-1,1,q[0],1,q[1]),B(1,1,q[0],1,q[1]),B(1,1,1,0,1),B(-1,1,1,0,1),[S[0]*b,b,S[1]*b]);const a=F,m=[S[0]+a[0],S[1]+a[1]],y=q,x=a[0]!==0?[0,1]:[1,0];t([m[0],0,m[1],y[0],0,y[1]],[m[0],0,m[1],x[0],0,x[1]],[m[0],1,m[1],x[0],1,x[1]],[m[0],1,m[1],y[0],1,y[1]],[m[0]*b,0,m[1]*b]),C([m[0],1,m[1],y[0],1,y[1]],[m[0],1,m[1],x[0],1,x[1]],[m[0],1,m[1],1,0,1],[m[0]*k,k,m[1]*k])}const T=new v.BufferGeometry;return T.setAttribute("position",new v.Float32BufferAttribute(s,3)),T.setAttribute("inset",new v.Float32BufferAttribute(o,3)),T.setAttribute("normal",new v.Float32BufferAttribute(z,3)),T}const xe=`
  uniform vec3 uCream, uCoral, uApricot, uMint, uMoss, uSky, uIndigo, uHorizon;
  uniform vec3 uSun;            // unit vector toward the sun
  uniform float uHaze;          // metres to the horizon tint (1400)
  uniform vec4 uTone;           // sunward sides: mix to apricot, shade sides: mix to indigo, shade tone, sunward tone
  uniform float uCloudT, uCloudK;
  // tone of a face from its normal. Tops take the glaze as it is; each of the four sides takes its own value from
  // how squarely it meets the sun (full key, grazing, shade, deep shade), so every block shows three values.
  // the hue of shade: the indigo glaze's own colour at full strength, thinned, so a shade face is lavender or plum, never grey
  vec3 shadeHue() { return mix(vec3(1.), uIndigo / max(max(uIndigo.r, uIndigo.g), max(uIndigo.b, 1e-3)), 0.34) * 1.12; }
  vec3 faceTone(vec3 col, vec3 n) {
    float wx = n.x * n.x, wz = n.z * n.z, wy = n.y * n.y;
    vec2 sh = uSun.xz / max(length(uSun.xz), 1e-3);
    float ex = smoothstep(0., 1., sign(n.x) * sh.x), ez = smoothstep(0., 1., sign(n.z) * sh.y);
    float lit = (wx * ex + wz * ez) / max(wx + wz, 1e-4);
    vec3 side = mix(mix(col, uIndigo, uTone.y) * uTone.z * shadeHue(), mix(col, uApricot, uTone.x) * uTone.w, lit);
    float up = clamp(wy / max(wx + wy + wz, 1e-4), 0., 1.) * step(0., n.y);
    vec3 c = mix(side, col, up);
    float bevel = 4. * max(wx * wz, max(wx * wy, wz * wy));          // 0 on flat faces, 1 on 45 degree bevels
    return mix(c, mix(side, col, 0.7) * 1.2, clamp(bevel, 0., 1.));
  }
  float hash21(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
  vec3 farTint(vec3 col, float d) { float x = d / max(uHaze, 1.); return mix(col, uHorizon, min(0.66, 1. - exp(-x * sqrt(x)))); }
  // drifting cloud shadows: soft-edged 60 m squares of shade sliding over the plain (0 lit .. 1 shaded)
  float cloudShade(vec2 p) {
    vec2 q = (p - vec2(8., 3.) * uCloudT) / 60., c = floor(q), w = smoothstep(0.36, 0.64, fract(q));
    float a = step(0.63, hash21(c)), b = step(0.63, hash21(c + vec2(1., 0.))), e = step(0.63, hash21(c + vec2(0., 1.))), g = step(0.63, hash21(c + vec2(1., 1.)));
    return mix(mix(a, b, w.x), mix(e, g, w.x), w.y) * uCloudK;
  }
`,De=`
  uniform sampler2D uCur, uPrev, uSoil;
  uniform float uF, uStep;      // easing phase inside the step (0..1), whole steps taken
  uniform vec4 uGun;            // the Gun's centre in cells (x, z), the pile-up height in metres, the shuttles' scale
  float cellHeight(vec4 t, vec4 soil, vec2 cell) {
    float age = t.r * 255.; if (age < 0.5) return 0.;
    float cap = max(1., floor(soil.r * 255. / 16. + 0.5)) * 6.;
    float bb = floor(t.b * 255. + 0.5), role = mod(bb, 16.), flut = t.a * 255. / 32.;
    float h = age <= 8. ? mix(2.4, 6., (age - 1.) / 7.) : min(cap, 6. + (age - 8.) * 0.75);
    if (role < 0.5 && flut >= 1.5) h = min(h, 1.2);
    // a plaza's dancers: a cell stands taller every step it lives (4, 7.5, 10 m), so its rings are caught at three heights
    if (role > 4.5 && role < 5.5) h = age < 1.5 ? 4. : (age < 2.5 ? 7.5 : 10.);
    // the machine's moving parts stand taller than the animals, and pile up where the two shuttles meet
    vec2 g = cell + 0.5 - uGun.xy;
    float inGun = step(2.5, role) * step(role, 3.5) * step(abs(g.x), 20.) * step(abs(g.y), 9.);
    float pile = exp(-g.x * g.x / 34.) * (0.5 + 0.13 * floor(bb / 16.));
    h += 4. * step(2.5, role) * step(role, 3.5) * (1. - inGun);            // a ship's cubes stand taller than a walker's
    return mix(h, h * uGun.w + uGun.z * pile, inGun);
  }
  vec3 glazeOfAge(float age) {
    vec3 c = mix(uCoral, uApricot, clamp((age - 1.) / 7., 0., 1.));
    return mix(c, uCream, smoothstep(8., 64., age));
  }
  float backOut(float t) { float u = t - 1.; return 1. + 2.9 * u * u * u + 1.9 * u * u; }
  // returns eased height; e = the easing weight toward the current texel
  float easedHeight(float hA, float hB, out float e) {
    float s = uF * uF * (3. - 2. * uF);
    e = (hB > hA && hA < 0.01) ? backOut(uF) : s;
    return max(0., mix(hA, hB, e));
  }
`,Mt=`
  #include <common>
  #include <fog_pars_vertex>
  attribute vec3 inset; attribute vec2 aCell;
  uniform vec2 uOrigin; uniform float uWidth;
  varying vec3 vLocal, vN, vWorld, vGlaze; varying vec4 vInfo; varying vec3 vMisc; varying float vIvy;
  ${xe}
  ${De}
  void main() {
    ivec2 ij = ivec2(aCell + 0.25);
    vec4 tB = texelFetch(uCur, ij, 0), tA = texelFetch(uPrev, ij, 0), soil = texelFetch(uSoil, ij, 0);
    float hA = cellHeight(tA, soil, aCell), hB = cellHeight(tB, soil, aCell), e;
    float H = easedHeight(hA, hB, e);
    float ageA = tA.r * 255., ageB = tB.r * 255.;
    float bA = floor(tA.b * 255. + 0.5), bB = floor(tB.b * 255. + 0.5);
    float roleA = mod(bA, 16.), roleB = mod(bB, 16.);
    float cm = ageA < 0.5 ? 1. : (ageB < 0.5 ? 0. : clamp(e, 0., 1.));
    float role = cm > 0.5 ? roleB : roleA;
    vec3 gA = glazeOfAge(ageA), gB = glazeOfAge(ageB);
    if (roleA < 0.5 && tA.a * 255. / 32. >= 1.5) gA = uApricot;
    if (roleB < 0.5 && tB.a * 255. / 32. >= 1.5) gB = uApricot;
    if (roleA > 4.5 && roleA < 5.5) gA = mix(uCoral, mix(uApricot, uCream, 0.45), clamp((ageA - 1.) * 0.5, 0., 1.));
    if (roleB > 4.5 && roleB < 5.5) gB = mix(uCoral, mix(uApricot, uCream, 0.45), clamp((ageB - 1.) * 0.5, 0., 1.));
    // shuttle and glider bodies keep an apricot top-glow as they age inside one stroke
    vGlaze = mix(gA, gB, cm);
    float roof = mix(smoothstep(104., 120., ageA), smoothstep(104., 120., ageB), cm);
    float headA = step(1.5, roleA) * step(roleA, 2.5), headB = step(1.5, roleB) * step(roleB, 2.5);
    float glider = step(0.5, role) * step(role, 2.5);
    float bob = glider * (0.25 + 0.25 * sin(6.2832 * (uStep + uF) * 0.25));
    H += bob * smoothstep(0.3, 1.5, H);
    float hw = uWidth * 0.5, bev = min(0.35, H * 0.45);
    vec3 p = vec3(position.x * (hw - inset.x * bev), position.y * (H - inset.y * bev), position.z * (hw - inset.z * bev));
    vLocal = p;
    p.xz += glider * p.y * 0.07 * vec2(0.7071);                      // lean 4 degrees into the heading
    vec3 w = vec3((aCell.x + 0.5 - uOrigin.x) * ${O}.0 + p.x, p.y, (aCell.y + 0.5 - uOrigin.y) * ${O}.0 + p.z);
    if (H < 0.03) w = vec3(0., -20., 0.);
    vN = normal;
    vInfo = vec4(H, roof, mix(floor(bA / 16.), floor(bB / 16.), clamp(e, 0., 1.)), mix(headA, headB, cm));
    vMisc = vec3(soil.g, glider, step(2.5, role) * step(role, 3.5)); vIvy = soil.b;
    vec4 wp = modelMatrix * vec4(w, 1.); vWorld = wp.xyz;
    vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,At=`
  #include <common>
  #include <fog_pars_fragment>
  uniform float uWidth, uGlow, uAO;
  varying vec3 vLocal, vN, vWorld, vGlaze; varying vec4 vInfo; varying vec3 vMisc; varying float vIvy;
  ${xe}
  float sdBox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
  // the net of a crazed glaze: distance between the two nearest of nine hashed points (no textures, no derivatives)
  float crackle(vec2 p) {
    vec2 c = floor(p), f = p - c; float f1 = 8., f2 = 8.;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j)), r = o + vec2(hash21(c + o), hash21(c + o + 19.7)) - f; float d = dot(r, r);
      if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) f2 = d;
    }
    return sqrt(max(f2, 0.)) - sqrt(max(f1, 0.));
  }
  void main() {
    vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
    float H = vInfo.x, hw = uWidth * 0.5; vec2 tp = vLocal.xz;
    float d = distance(cameraPosition, vWorld);
    float topF = step(0.9, n.y), sideF = 1. - step(0.2, n.y), topBevel = step(0.3, n.y) * (1. - topF);
    float flatSide = sideF * step(0.9, max(abs(n.x), abs(n.z)));
    float fy = fwidth(vLocal.y) + 1e-4, fxz = fwidth(vLocal.x) + fwidth(vLocal.z) + 1e-4;

    // glaze: age colour with a small per-cell jitter, moss roof under a mint lip, the head's indigo glaze
    vec3 col = vGlaze * (0.965 + 0.07 * vMisc.x);
    // each storey is its own fired block: a hashed step of value and a lean toward apricot or mint
    float sj = hash21(vec2(floor(vLocal.y / 6.) + 1., floor(vMisc.x * 251.))), sj2 = hash21(vec2(floor(vMisc.x * 251.), floor(vLocal.y / 6.) + 9.));
    float tallS = smoothstep(6.5, 8.5, vInfo.x) * (1. - topF);
    col *= 1. - tallS * 0.085 * sj;
    col = mix(col, mix(uApricot, uMint, step(0.6, sj2)), tallS * 0.2 * sj2);
    col = mix(col, mix(uApricot, uCoral, 0.25), tallS * 0.5 * step(vInfo.x - 6.2, vLocal.y) * (1. - step(0.3, n.y)) * step(0.45, vMisc.x));
    col = mix(col, uMoss * (0.95 + 0.1 * vMisc.x), vInfo.y * topF);
    col = mix(col, uMint, vInfo.y * topBevel);
    // the machine's own towers: storeys banded apricot and coral, so the Gun reads as one warm thing from end to end
    float ivy = step(0.75, vIvy), mach = step(0.25, vIvy) * (1. - ivy);
    vec3 band = mix(mix(uApricot, uCream, 0.3), mix(uApricot, uCoral, 0.55), step(0.5, mod(floor(vLocal.y / 6.), 2.)));
    col = mix(col, band * (0.94 + 0.1 * sj), mach * (1. - step(0.3, n.y)));
    // the avenue's towers (soil.b about 0.2): cream blocks with every third storey fired mint or sky, and an apricot course under the roof
    float street = step(0.1, vIvy) * (1. - step(0.25, vIvy)), stN = floor(vLocal.y / 6.), topS = step(vInfo.x - 6.2, vLocal.y);
    vec3 sband = mix(mix(uMint, uCream, 0.25), mix(uSky, uMint, 0.35), step(0.5, hash21(vec2(floor(vMisc.x * 251.), 7.))));
    col = mix(col, sband * (0.9 + 0.1 * sj), street * (1. - step(0.3, n.y)) * step(mod(stN + floor(vMisc.x * 3.), 3.), 0.5) * (1. - topS));
    col = mix(col, mix(uApricot, uCoral, 0.3) * (0.92 + 0.08 * sj), street * (1. - step(0.3, n.y)) * topS * 0.9);
    col = mix(col, mix(col, uApricot, 0.55), (vMisc.y + vMisc.z) * topF * (1. - vInfo.w));   // apricot tops of the animals
    col = mix(col, mix(vGlaze, uIndigo, 0.62) * 0.74, vInfo.w);

    // sides: storey grooves, one window tile a storey, a door notch, foot occlusion, crackle
    float tall = smoothstep(6.5, 8.5, H);
    float gy = abs(fract(vLocal.y / 6. + 0.5) - 0.5) * 6.;
    float groove = (1. - smoothstep(0.15 - fy, 0.15 + fy, gy)) * step(1.5, vLocal.y);
    groove = mix(0.05, groove, 1. - smoothstep(0.2, 0.7, fy));
    float pool = (1. - smoothstep(0.125, 1.1, gy)) * 0.5;                         // glaze pooling toward each groove
    col *= 1. - sideF * tall * (0.32 * groove + 0.09 * pool);
    float s = mix(vLocal.x, vLocal.z, step(0.5, abs(n.x)));
    float ly = fract(vLocal.y / 6.) * 6. - 3.15;
    float wd = sdBox(vec2(s, ly), vec2(0.8), 0.12);
    float win = 1. - smoothstep(-fy, fy, wd);
    float lintel = win * (1. - smoothstep(0.42, 0.62, 0.8 - ly));                 // shadow under the upper edge
    float sill = (1. - smoothstep(0., 0.09 + fy, abs(wd - 0.07))) * step(ly, -0.6);
    float winFade = 1. - smoothstep(0.1, 0.4, fy);
    col *= 1. - flatSide * tall * winFade * (0.13 * win + 0.17 * lintel - 0.10 * sill);
    float door = (1. - smoothstep(-fy, fy, sdBox(vec2(s, vLocal.y - 0.9), vec2(0.5, 1.1), 0.06))) * step(11., H) * flatSide * max(step(0.5, n.z), step(0.5, -n.x));
    col = mix(col, uIndigo * 0.9, 0.82 * door);
    // hedge cells (soil.b): the sides are clad in square moss leaves
    vec2 lcell = vec2(s, vLocal.y) / 1.2; float lf = hash21(floor(lcell) + 3.);
    vec2 lq = abs(fract(lcell) - 0.5); float ledge = smoothstep(0.36, 0.48, max(lq.x, lq.y)) * (1. - smoothstep(0.1, 0.5, fy));
    float flut = 0.11 * sin(uCloudT * (1.3 + 2.2 * lf) + lf * 40.);                     // the hedge's square leaves stir
    col = mix(col, mix(uMoss, uMint, 0.3 * lf + flut) * (0.74 + 0.26 * lf + flut) * (1. - 0.2 * ledge), ivy * sideF * 0.94);
    // moss down the cold sides: under every mossed roof on unflagged soil the same square leaves hang down the north and
    // east faces (typed compass: -z and +x), 6 to 36 m by the cell's glaze jitter, each leaf column up to two leaves longer
    // than the next, whole leaves only, the windows left open, and never into the lowest 6 m above the tiles. These
    // leaves hold still (the hedge's stir reads the clock; this reads none).
    float cold = flatSide * max(step(0.5, n.x), step(0.5, -n.z)) * (1. - step(0.1, vIvy)) * vInfo.y;
    float hang = 6. + 27.6 * vMisc.x + 2.4 * hash21(vec2(floor(lcell.x) + 11., floor(vMisc.x * 251.))), leafY = (floor(lcell.y) + 0.5) * 1.2;
    col = mix(col, mix(uMoss, uMint, 0.3 * lf) * (0.74 + 0.26 * lf) * (1. - 0.2 * ledge), 0.94 * cold * step(H - hang, leafY) * step(6., leafY) * (1. - win * winFade));
    float foot = 1. - clamp(vLocal.y / max(9., H * 0.36), 0., 1.); foot *= foot;
    col = mix(col, uIndigo * 0.8, min(0.8, (1. - topF) * foot * (0.34 * clamp(vInfo.z / 5., 0., 1.) + 0.2) * uAO));
    // fired glaze on the low cubes: it pools darker toward the foot and under the rim, and in a ring inside the top's edge
    float low = 1. - tall, yN = clamp(vLocal.y / max(H, 0.5), 0., 1.);
    col *= 1. - sideF * low * (0.2 * (1. - smoothstep(0., 0.5, yN)) + 0.15 * smoothstep(0.84, 0.97, yN));
    col *= 1. - topF * low * 0.13 * smoothstep(hw - 1.5, hw - 0.75, max(abs(tp.x), abs(tp.y)));
    // and each face of a low cube is pressed with one shallow panel: a darker line with the glaze a shade paler inside it
    float pd = sdBox(vec2(s, vLocal.y - H * 0.5), vec2(hw - 0.62, max(H * 0.5 - 0.5, 0.05)), 0.16);
    float pline = (1. - smoothstep(0.045, 0.045 + fy, abs(pd))) * (1. - smoothstep(0.1, 0.45, fy));
    col *= 1. + flatSide * low * step(1.4, H) * (0.05 * step(pd, 0.) - 0.17 * pline);
    // crackle, close to the lens only: fades before its lines are finer than a pixel
    float fcr = (fy + fxz) / 0.4;
    float ck = crackle(mix(vec2(s + vLocal.y * 0.31, vLocal.y), tp, topF) / 0.4 + vMisc.x * 37.);
    float cline = 1. - smoothstep(0.012 + fcr * 0.5, 0.03 + fcr * 1.2, ck);
    col *= 1. - 0.085 * cline * (1. - smoothstep(0.06, 0.22, fcr)) * (sideF + topF);

    // the head's marking: one cream tile folded over its forward edge
    // (a square cream tile in the middle of each of its two forward faces, and one on its top)
    float tile = flatSide * (1. - smoothstep(-fy, fy, sdBox(vec2(s, vLocal.y - H * 0.52), vec2(1.15, min(0.62, H * 0.3)), 0.1)));
    float topTile = topF * (1. - smoothstep(0.95 - fxz, 0.95 + fxz, max(abs(tp.x), abs(tp.y))));
    col = mix(col, uCream, max(tile, topTile) * vInfo.w);

    // tops: a rim line and the pooled-glaze highlight, a paler rounded square pushed toward the sun
    float rim = 1. - smoothstep(0.05, 0.05 + fxz, abs(max(abs(tp.x), abs(tp.y)) - (hw - 0.8)));
    col *= 1. - 0.14 * rim * topF * (1. - smoothstep(0.08, 0.3, fxz));
    vec3 vdir = normalize(cameraPosition - vWorld + vec3(0., 1e-3, 0.));
    vec2 hc = uSun.xz * 0.75 - vdir.xz * 0.2;
    float hl = (1. - smoothstep(-0.22, 0.22, sdBox(tp - hc, vec2(hw * 0.45), 0.5))) * topF;
    col = mix(col, mix(col, uCream * 1.08, 0.3), hl * (1. - 0.4 * vInfo.y) * (1. - vInfo.w));

    vec3 base = col;
    col = faceTone(col, n);
    // the machine's moving parts and the animals are fresh from the kiln: their shade sides stay a deep coral, never brown
    col = mix(col, max(col, base * 0.5), clamp(0.6 * vMisc.y + vMisc.z, 0., 1.) * (1. - vInfo.w));
    col = mix(col, max(col, base * 0.45), vInfo.w);                                // the head's shade side is plum, never a black hole
    // the glaze breaks pale along every edge
    float wx = n.x * n.x, wz = n.z * n.z, wy = n.y * n.y, bevelF = clamp(4. * max(wx * wz, max(wx * wy, wz * wy)), 0., 1.);
    col = mix(col, mix(col, uCream, 0.5) * 1.1, bevelF * 0.7 * (1. - 0.6 * ivy) * (1. - smoothstep(0.5, 1.6, fxz + fy)));
    col = mix(col, mix(col, uIndigo, 0.25) * 0.74, cloudShade(vWorld.xz));
    col += hl * uGlow * uApricot;                                                 // faint bloom seed on highlights
    col = farTint(col, d);
    gl_FragColor = vec4(col, 1.);
    #include <fog_fragment>
  }`,St=`
  #include <common>
  #include <fog_pars_vertex>
  varying vec3 vWorld; varying vec2 vLoc;
  void main() {
    vLoc = position.xz;
    vec4 wp = modelMatrix * vec4(position, 1.); vWorld = wp.xyz;
    vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,kt=`
  #include <common>
  #include <fog_pars_fragment>
  uniform sampler2D uHgt, uAoMap; uniform vec2 uOrigin; uniform float uGrid, uTanSun, uShadow, uAO, uRipple, uMeet; uniform vec4 uLane;
  varying vec3 vWorld; varying vec2 vLoc;
  ${xe}
  ${De}
  float inGrid(vec2 c) { return step(0., min(c.x, c.y)) * step(max(c.x, c.y), uGrid - 1.); }
  // eased height of the column standing on cell c (0 outside the grid)
  float heightAt(vec2 c, float sm, float bo) {
    vec4 h = texelFetch(uHgt, ivec2(clamp(c, vec2(0.), vec2(uGrid - 1.))), 0);
    float a = h.r * 102., b = h.g * 102.;
    return max(0., mix(a, b, (b > a && a < 0.01) ? bo : sm)) * inGrid(c);
  }
  // what the blue byte of the height texture says of tile c: x = 1 on a floor tile, y = 1 on its kerb (0, 0 elsewhere)
  vec2 floorAt(vec2 c) {
    float b = texelFetch(uHgt, ivec2(clamp(c, vec2(0.), vec2(uGrid - 1.))), 0).b * inGrid(c);
    return vec2(step(0.75, b), step(0.25, b) * (1. - step(0.75, b)));
  }
  void main() {
    float d = distance(cameraPosition, vWorld);
    vec2 g = vLoc / ${O}.0 + uOrigin, cell = floor(g), q = (g - cell - 0.5) * ${O}.0;      // q: metres from the tile centre
    float inside = inGrid(cell);
    vec2 fw2 = vec2(fwidth(g.x), fwidth(g.y)) * ${O}.0 + 1e-4;                                  // metres a pixel along each axis
    float fwSum = fw2.x + fw2.y, fw = mix(fw2.y, fw2.x, step(abs(q.y), abs(q.x)));               // fw: across the nearest edge of a square, so squares stay pixel-sharp at grazing angles
    float sm = uF * uF * (3. - 2. * uF), bo = backOut(uF);
    ivec2 ij = ivec2(clamp(cell, vec2(0.), vec2(uGrid - 1.)));
    vec4 tA = texelFetch(uPrev, ij, 0), tB = texelFetch(uCur, ij, 0), soil = texelFetch(uSoil, ij, 0);

    // tile glaze: mint 55 % toward cream, a whisper of per-tile jitter, a checker outside the grid
    vec3 tileC = mix(uMint, uMoss, 0.4) * 0.6;
    float chk = mod(cell.x + cell.y, 2.), tj = hash21(cell + 17.3), tk = hash21(cell.yx + 41.7);
    vec3 col = tileC * (0.9 + 0.17 * soil.g * inside);
    col = mix(col, mix(uMint, uSky, 0.5) * 0.6, 0.5 * step(0.74, tj));
    col = mix(col, mix(uMint, uCream, 0.4) * 0.7, 0.5 * step(tj, 0.74) * step(0.6, tj));
    col = mix(mix(tileC, uCream * 0.8, 0.1 + 0.2 * chk), col * (1. - 0.06 * chk), inside);
    // floors under what turns in place: the blue byte of the height texture says floor or kerb; a floor tile is glazed
    // indigo and its kerb cream, and the inlay, footprints, ripple and shadows below are laid over both. The edge between
    // two tiles is shared out over one pixel (this tile's share along each axis, the three tiles across its nearest edges)
    vec2 fAcross = sign(q), fShare = clamp(0.5 + (${O/2}.0 - abs(q)) / fw2, 0.5, 1.);
    vec2 fk = mix(mix(floorAt(cell + fAcross), floorAt(cell + vec2(0., fAcross.y)), fShare.x), mix(floorAt(cell + vec2(fAcross.x, 0.)), floorAt(cell), fShare.x), fShare.y);
    col = col * (1. - 0.8 * fk.x - 0.85 * fk.y) + uIndigo * (0.8 * fk.x) + uCream * (0.85 * 0.85 * fk.y);
    // inlay: each tile is laid from nine 2 m squares, each fired a shade apart; one tile in three carries a
    // motif of squares (a cream ring, an apricot stud, four corner studs)
    float nearK = 1. - smoothstep(0.12, 0.7, fwSum), mid = 1. - smoothstep(0.3, 1.3, fwSum), edgeT = max(abs(q.x), abs(q.y));
    vec2 sc3 = floor(q / 2. + 1.5), sq = abs(fract(q / 2. + 0.5) - 0.5) * 2.;
    float sh3 = hash21(cell * 3. + sc3 + 5.);
    col *= 1. + (sh3 - 0.5) * 0.18 * mid * inside;
    float sline = 1. - smoothstep(0.04, 0.04 + fw, 1. - max(sq.x, sq.y));
    col *= 1. - 0.16 * sline * nearK * inside;
    float motif = step(tk, 0.34) * inside * mid, kind = fract(tk * 37.);
    float ringM = 1. - smoothstep(0.16, 0.16 + fw, abs(edgeT - 1.55));
    float stud = 1. - smoothstep(0.55, 0.55 + fw, edgeT);
    vec2 cq = abs(abs(q) - 2.); float corner = 1. - smoothstep(0.4, 0.4 + fw, max(cq.x, cq.y));
    col = mix(col, uCream * 0.9, 0.62 * motif * ringM * step(kind, 0.6));
    col = mix(col, mix(uApricot, uCoral, 0.3) * 0.92, 0.75 * motif * stud * step(0.35, kind) * step(kind, 0.8));
    col = mix(col, mix(uMoss, uMint, 0.3) * 0.8, 0.7 * motif * corner * step(0.6, kind));
    vec2 ck = floor(vWorld.xz / 0.42);
    col *= 1. - 0.1 * (hash21(ck) * 0.6 + hash21(floor(vWorld.xz / 0.14) + 5.) * 0.4) * (1. - smoothstep(9., 30., d));

    // footprints: warm apricot where something died, cooling to a faint ring
    float heat = mix(tA.g, tB.g, sm) * inside;
    float edge = max(abs(q.x), abs(q.y));
    float ring = 1. - smoothstep(0.12, 0.12 + fw, abs(edge - 2.05));
    float fill = smoothstep(0.1, 0.55, heat) * (1. - smoothstep(2.6 - fw, 2.6 + fw, edge));
    vec3 warm = mix(mix(uCream, uApricot, smoothstep(0.1, 0.45, heat)), mix(uApricot, uCoral, 0.7), smoothstep(0.55, 1., heat)) * (0.82 + 0.3 * heat);
    col = mix(col, warm, 0.9 * fill + 0.4 * ring * smoothstep(0.0, 0.25, heat) * (1. - fill));

    // the machine's floor: every meeting sends a square ring of warm tiles out from the midpoint, most of a tile a
    // step, cooling behind its front, so the forecourts either side of the Gun are a mosaic that beats with it
    vec2 gm = cell + 0.5 - uGun.xy; float rr = max(abs(gm.x) * 0.55, abs(gm.y));
    float front = mod(uStep + uF - uMeet + 30., 30.) * 0.9;
    float wave = (1. - smoothstep(front - 0.6, front + 0.6, rr)) * exp(-max(front - rr, 0.) / 4.5);
    float reach = (1. - smoothstep(15., 26., rr)) * smoothstep(1.5, 4., rr) * uRipple * inside;
    col = mix(col, mix(uApricot, uCoral, 0.18 + 0.3 * tk), 0.72 * wave * reach * (0.35 + 0.65 * step(0.3, tj)) * (1. - smoothstep(2.6 - fw, 2.6 + fw, edge)));

    // kerb lights: studs inlaid along both edges of the gliders' lane, lit in a chase that runs ahead of the walkers
    // toward the eater, one tile a step (each stud brightens once in eight steps, eased)
    float dl = cell.x - cell.y - uLane.x, sl = cell.x + cell.y;
    float onKerb = step(abs(abs(dl) - 5.), 0.5) * step(uLane.y, sl) * step(sl, uLane.z) * inside * uLane.w;
    float wv = mod(floor(sl * 0.5 + 0.25) - (uStep + uF), 8.), lamp = 1. - smoothstep(0., 2.5, min(wv, 8. - wv));
    float studK = (1. - smoothstep(0.75, 0.75 + fw, edge)) * onKerb * (1. - smoothstep(0.6, 2.5, fwSum));
    col = mix(col, mix(uCream, uApricot, 0.5 + 0.5 * lamp) * (0.8 + 1.15 * lamp), studK);

    // grout 0.2 m, 12 % darker, with a paler lip; fades to its mean tone when finer than two pixels
    vec2 gd2 = ${O/2}.0 - abs(q);                                                               // per axis, so lines running away stay crisp
    vec2 gr2 = 1. - smoothstep(vec2(0.1), 0.1 + fw2, gd2), lp2 = 1. - smoothstep(vec2(0.06), 0.06 + fw2, abs(gd2 - 0.22));
    vec2 fd2 = 1. - smoothstep(vec2(0.2), vec2(1.1), fw2);
    vec2 ln2 = mix(vec2(0.02), 0.36 * gr2 - 0.2 * lp2 * (1. - gr2), fd2);
    col *= 1. - max(ln2.x, ln2.y);
    // each tile's glaze pools a little: a paler rounded square pushed toward the sun, gone with distance
    vec2 pc = q - uSun.xz * 0.5; vec2 pq = abs(pc) - 1.5; float pd = length(max(pq, 0.)) + min(max(pq.x, pq.y), 0.) - 0.6;
    col = mix(col, uCream * 0.9, 0.12 * (1. - smoothstep(-fw, fw, pd)) * (1. - smoothstep(0.1, 0.9, fwSum)) * (1. - fill));

    vec3 gbase = col;
    // occlusion: 5 % per living neighbour, plus a soft contact shadow against each standing neighbour
    float nb = mix(floor(tA.b * 255. / 16. + 0.03), floor(tB.b * 255. / 16. + 0.03), sm) * inside;
    float hE = heightAt(cell + vec2(1., 0.), sm, bo), hW = heightAt(cell - vec2(1., 0.), sm, bo);
    float hS = heightAt(cell + vec2(0., 1.), sm, bo), hN = heightAt(cell - vec2(0., 1.), sm, bo);
    float ct = 0.;
    ct = max(ct, min(1., hE / 2.4) * (1. - smoothstep(0., 2.6, 3. - q.x)));
    ct = max(ct, min(1., hW / 2.4) * (1. - smoothstep(0., 2.6, 3. + q.x)));
    ct = max(ct, min(1., hS / 2.4) * (1. - smoothstep(0., 2.6, 3. - q.y)));
    ct = max(ct, min(1., hN / 2.4) * (1. - smoothstep(0., 2.6, 3. + q.y)));
    col = mix(col, mix(col, uIndigo, 0.45) * 0.62, 0.7 * ct);
    col *= 1. - 0.085 * min(nb, 6.) * (1. - 0.5 * ct);
    // every old tower stands in a soft indigo pool two or three tiles wide (a blurred map of what has always stood)
    float pool = texture2D(uAoMap, g / uGrid).r * inside;
    col = mix(col, mix(col, uIndigo, 0.6) * 0.5, smoothstep(0., 0.3, pool) * min(1., 0.56 * uAO));

    // cast shadows: fixed taps toward the sun through the height field, soft wedges of sea-glass shade
    vec2 sd = uSun.xz / max(length(uSun.xz), 1e-3);
    float sh = 0., k = clamp(0.78 / max(uTanSun, 0.05), 1., 2.5);
    for (int i = 0; i < 20; i++) {
      float fi = float(i), t = (2.5 + fi * (3.5 + 0.125 * fi)) * k;
      float hh = heightAt(floor(g + sd * (t / ${O}.0)), sm, bo);
      sh = max(sh, smoothstep(-0.5, 1.6, hh - t * uTanSun));
    }
    col = mix(col, mix(col, uIndigo, 0.5) * 0.46, sh * uShadow * inside);
    col = mix(col, mix(col, uIndigo, 0.25) * 0.74, cloudShade(vWorld.xz) * (1. - 0.6 * sh * uShadow));
    col = max(col, mix(gbase, uIndigo, 0.3) * 0.4 * shadeHue());             // deep sea-glass, never navy black

    col = farTint(col, d);
    gl_FragColor = vec4(col, 1.);
    #include <fog_fragment>
  }`,dt=`
  #include <common>
  #include <fog_pars_fragment>
  varying vec3 vN, vWorld, vCol; varying vec3 vLoc; varying float vShow;
  ${xe}
  void main() {
    if (vShow < 0.01) discard;
    vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
    vec3 col = vCol;
    float m = max(abs(vLoc.x), abs(vLoc.z));
    col = mix(col, mix(col, uCream, 0.3), step(0.9, n.y) * (1. - smoothstep(0.42, 0.5, m)) * 0.6);   // pooled highlight
    vec3 base = col;
    col = faceTone(col, n);
    col = max(col, base * 0.4 * shadeHue());
    col = farTint(col, distance(cameraPosition, vWorld));
    gl_FragColor = vec4(col, 1.);
    #include <fog_fragment>
  }`,Ct=`
  #include <common>
  #include <fog_pars_vertex>
  attribute vec3 inset, aOff, aSize, aColor; attribute vec2 aCell; attribute vec4 aSway;   // aSway: pivot x, pivot z, height above roof of box base, phase
  uniform vec2 uOrigin; uniform float uTime;
  varying vec3 vN, vWorld, vCol; varying vec3 vLoc; varying float vShow;
  ${xe}
  ${De}
  void main() {
    ivec2 ij = ivec2(aCell + 0.25);
    vec4 tB = texelFetch(uCur, ij, 0), tA = texelFetch(uPrev, ij, 0), soil = texelFetch(uSoil, ij, 0);
    float e, H = easedHeight(cellHeight(tA, soil, aCell), cellHeight(tB, soil, aCell), e);
    vShow = smoothstep(104., 120., mix(tA.r, tB.r, clamp(e, 0., 1.)) * 255.);
    float bev = min(0.09, 0.2 * min(aSize.x, aSize.y));
    vec3 hs = aSize * vec3(0.5, 1., 0.5) * vShow;
    vec3 p = vec3(position.x * (hs.x - inset.x * bev), position.y * (hs.y - inset.y * bev), position.z * (hs.z - inset.z * bev));
    vLoc = vec3(position.x * (1. - inset.x * 0.15), position.y, position.z * (1. - inset.z * 0.15)) * 0.5;
    p += aOff;
    // sway: three degrees, growing with height above the trunk foot; flowers (phase < 0) nod instead
    float hgt = p.y;
    float ph = abs(aSway.w), w1 = sin(uTime * 1.3 + ph), w2 = sin(uTime * 0.83 + ph * 1.7);
    float nod = step(aSway.w, 0.);
    p.xz += (1. - nod) * hgt * 0.085 * vec2(w1 + 0.4 * w2, w2 - 0.3 * w1) * smoothstep(0., 1.5, hgt);
    p.y += nod * 0.1 * (w1 + 1.); p.xz += nod * 0.09 * vec2(w2, w1);
    vec3 w = vec3((aCell.x + 0.5 - uOrigin.x) * ${O}.0, H, (aCell.y + 0.5 - uOrigin.y) * ${O}.0) + p;
    vN = normal; vCol = aColor;
    vec4 wp = modelMatrix * vec4(w, 1.); vWorld = wp.xyz;
    vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,Bt=`
  #include <common>
  #include <fog_pars_vertex>
  attribute vec3 inset; attribute vec4 aA, aB;     // aA: loop centre xyz + radius; aB: phase, speed, part (-1 wing, 0 body, 1 wing), size
  uniform float uTime; uniform vec3 uBirdCol, uWingCol;
  varying vec3 vN, vWorld, vCol; varying vec3 vLoc; varying float vShow;
  void main() {
    float a = aB.x + uTime * aB.y, sz = aB.w, part = aB.z;
    vec3 c = aA.xyz + vec3(cos(a) * aA.w, 2.5 * sin(a * 2. + aB.x * 3.), sin(a) * aA.w * 0.72);
    vec3 fw = normalize(vec3(-sin(a) * aA.w, 0., cos(a) * aA.w * 0.72) * sign(aB.y) + vec3(1e-4, 0., 0.));
    vec3 rt = vec3(fw.z, 0., -fw.x);
    // body: a cube; wings: square plates hinged on the body's sides, flapping about the heading
    float wing = abs(part);
    vec3 hs = mix(vec3(0.5), vec3(0.5, 0.07, 0.42), wing) * sz;
    float bev = 0.06 * sz * (1. - 0.6 * wing);
    vec3 q = vec3(position.x * (hs.x - inset.x * bev), (position.y - 0.5) * 2. * (hs.y - inset.y * bev * 0.5), position.z * (hs.z - inset.z * bev));
    float flap = sin(uTime * 8.5 + aB.x * 5.) * 0.85 + 0.15;
    float cf = cos(flap), sf = sin(flap) * part;
    q.x = (q.x + hs.x) * wing + q.x * (1. - wing);                   // wing grows outward from its hinge
    vec2 rot = vec2(q.x * cf, q.x * abs(sf) + q.y);                   // lift the wing tip
    q.xy = mix(q.xy, rot, wing);
    q.x = q.x * mix(1., part, wing) + part * 0.5 * sz;
    q.y += 0.12 * sz * sin(uTime * 8.5 + aB.x * 5. + 1.6) * (1. - wing) + wing * 0.1 * sz;
    vec3 w = c + rt * q.x + vec3(0., q.y, 0.) + fw * q.z;
    vN = normalize(rt * normal.x * mix(1., part, wing) + vec3(0., normal.y, 0.) + fw * normal.z + vec3(0., 1e-4, 0.));
    vCol = mix(uBirdCol, uWingCol, wing); vLoc = position * 0.5; vShow = 1.;
    vec4 wp = modelMatrix * vec4(w, 1.); vWorld = wp.xyz;
    vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,Ft=l=>{let s=0;for(;l;)s+=l&1,l>>=1;return s};function qt(l,s,o,z,d=0,t=99,C=99,b=null){if(l<1)return 0;let k=l<=8?2.4+(6-2.4)*(l-1)/7:Math.min(s*ut,6+(l-8)*.75);return o===0&&z>=2&&(k=Math.min(k,1.2)),o===5&&(k=l<2?4:l<3?7.5:10),b&&o===3&&Math.abs(t)<=20&&Math.abs(C)<=9?k=k*b[1]+b[0]*Math.exp(-t*t/34)*(.5+.13*d):o===3&&(k+=4),k}async function $t(l,s={}){const o=l.rng.fork?l.rng.fork("glider-country-hero"):l.rng,z=Math.min(1,Math.max(.6,s.detail??l.quality?.detail??1)),d=(s.palette&&s.palette.length>=7?s.palette:bt).slice(0,7),t=s.gridSize??128,C=v.MathUtils.degToRad(s.sunAzimuth??250),b=v.MathUtils.degToRad(s.sunElevation??38),k=new v.Vector3(Math.sin(C)*Math.cos(b),Math.sin(b),-Math.cos(C)*Math.cos(b)),T=s.warmth??o.range(-.012,.012),f=d.map((e,i)=>{const r=Ee(e,i===0?.98:1.02);return r.r*=1+T,r.b*=1-T,r}),S=s.horizon?s.horizon(f):Ee(d[0],.9),F=new v.Vector4(...s.tone||[.1,.28,.54,.78]),B={value:0},q=()=>({uCream:{value:f[0]},uCoral:{value:f[1]},uApricot:{value:f[2]},uMint:{value:f[3]},uMoss:{value:f[4]},uSky:{value:f[5]},uIndigo:{value:f[6]},uHorizon:{value:S},uSun:{value:k},uHaze:{value:s.haze??1400},uTone:{value:F},uCloudT:B,uCloudK:{value:s.cloudShade??0}});let a=await zt(t,s,l);await l.yield?.();const m=(e,i)=>[Math.floor(e/O+a.ox),Math.floor(i/O+a.oz)],y=(e,i,r=0)=>new v.Vector3((e-a.ox)*O,r,(i-a.oz)*O),x={x:a.gx+26,z:a.gz+12},p=a.eater?a.eater.x-x.x:s.avenueCells??38,A=["block","beehive","loaf","boat","tub","pond","ship"],c=[];if(s.avenue!==!1)for(let e=5;e+3<p;e+=5)for(const i of[-1,1])c.push({cells:pe(re.block),x:x.x+e+i*5-(i<0?0:1),z:x.z+e-i*5-(i<0?1:0),age:255,cap:o.int(5,11)});const L=s.gardens??26,I=[];for(let e=0,i=0;e<400&&i<L;e++){const r=o.pick(A),u=Ne(pe(re[r]),o.int(0,7)),h=o.range(0,Math.PI*2),M=o.range(9,t*.42),w=Math.round(a.ox+Math.cos(h)*M*1.5),g=Math.round(a.oz+12+Math.sin(h)*M);if(w<10||g<10||w>t-16||g>t-16)continue;const $=w-a.gx,_=g-a.gz;if($>-10&&$<43&&_>-10&&_<17||Math.abs(w-g-(x.x-x.z))<19&&w+g>x.x+x.z-12||I.some(R=>Math.abs(R[0]-w)<9&&Math.abs(R[1]-g)<9))continue;I.push([w,g]),i++;const U=Math.hypot(w-a.ox,g-a.oz);c.push({cells:u,x:w,z:g,age:o.chance(.25)?o.int(20,90):o.int(120,255),cap:Math.max(1,Math.min(6,Math.round(o.range(.6,2.2)+Math.max(0,U-30)*.06*o.range(0,1))))})}const H={gx:a.gx,gz:a.gz,lane:{x:x.x-a.gx,z:x.z-a.gz},far:p,eater:a.eater?{x:a.eater.x-a.gx,z:a.eater.z-a.gz}:null},j=typeof s.stamps=="function"?await s.stamps(H):s.stamps||[];H.plazas&&(a.plazas=H.plazas);for(const e of j){const[i,r]=e.cx!==void 0?[a.gx+e.cx,a.gz+e.cz]:m(e.x,e.z);c.push({cells:e.cells||pe(re[e.pattern]||re.block),x:i,z:r,age:e.age??200,cap:e.cap??2,ivy:e.ivy})}if(s.clear)for(let e=c.length-1;e>=0;e--){const i=c[e];i.cells.some(([r,u])=>s.clear.some(h=>i.x+r-a.gx>=h[0]&&i.x+r-a.gx<=h[2]&&i.z+u-a.gz>=h[1]&&i.z+u-a.gz<=h[3]))&&c.splice(e,1)}const W=e=>{const i=Ue(t);if(a.stampGun(i),a.eater){i.stamp(a.eater.cells,a.eater.x,a.eater.z,255,s.eaterStoreys??9),a.eaterMask=new Uint8Array(t*t);for(const[u,h]of a.eater.cells)a.eaterMask[(a.eater.z+h)*t+a.eater.x+u]=1}if(e)for(const u of c)i.stamp(u.cells,u.x,u.z,u.age,u.cap);const r=s.wakeCool??9;for(let u=4;u<=p+2;u++)for(let h=-3;h<=3;h++)for(let M=0;M<=1;M++){const w=x.x+u+h,g=x.z+u+M;w>4&&g>4&&w<t-4&&g<t-4&&(i.cool[g*t+w]=r)}return i};let n=W(!0);const K=e=>{let i=0;for(let r=e.z0;r<=e.z1;r++)for(let u=e.x0;u<=e.x1;u++)e.alive[r*t+u]&&(i=Math.imul(i,31)+r*t+u|0);return i+e.pop*7919};await l.yield?.();for(let e=0;e<a.s0-30;e++)n.tick(),await l.yield?.();const V=K(n);for(let e=0;e<30;e++)n.tick(),e%2===1&&await l.yield?.();if(K(n)!==V){a.ok=!1,n=W(!1);for(let e=0;e<a.s0;e++)n.tick(),e%2===1&&await l.yield?.()}for(let e=0;e<t*t;e++)n.fixed[e]&&n.alive[e]&&(n.age[e]=255);await l.yield?.();for(const e of a.ok?c:[])for(const[i,r]of e.cells){const u=(e.z+r)*t+e.x+i;n.alive[u]&&e.age<255&&(n.age[u]=e.age)}const E=[];if(a.eater)for(const[e,i]of a.eater.lip){const r=(a.eater.z+i)*t+a.eater.x+e;n.fixed[r]=0,E.push(r)}const Z=n.step;await l.yield?.();{const e=new Uint8Array(t*t);for(let i=0;i<t*t;i++){if(!n.fixed[i]||!n.alive[i]||e[i]||n.cap[i]<5)continue;const r=[],u=[i];for(e[i]=1;u.length;){const w=u.pop();r.push(w);for(const g of[-1,1,-t,t,-t-1,-t+1,t-1,t+1]){const $=w+g;n.fixed[$]&&n.alive[$]&&!e[$]&&(e[$]=1,u.push($))}}const h=o.int(0,r.length-1),M=n.cap[i];r.forEach((w,g)=>{g!==h&&(n.cap[w]=Math.max(3,M-o.pick([0,1,1,2,3])))})}}const N=e=>{const i=new v.DataTexture(e,t,t,v.RGBAFormat,v.UnsignedByteType);return i.minFilter=i.magFilter=v.NearestFilter,i.generateMipmaps=!1,i.needsUpdate=!0,i},ie=new Uint8Array(t*t*4),_e=new Uint8Array(t*t*4),ve=new Uint8Array(t*t*4),le=new Uint8Array(t*t*4);await l.yield?.();for(let e=0;e<t*t;e++)le[e*4]=n.cap[e]*16,le[e*4+1]=o()*255|0,le[e*4+3]=255;for(const e of a.ok?c:[])if(e.ivy)for(const[i,r]of e.cells)le[((e.z+r)*t+e.x+i)*4+2]=Math.round(255*Math.min(1,+e.ivy));for(const[e,i]of[[0,4],[1,4],[0,5],[1,5],[34,2],[35,2],[34,3],[35,3]])le[((a.gz+i)*t+a.gx+e)*4+2]=128;if(a.eater&&(s.eaterBands??!0))for(const[e,i]of a.eater.cells)le[((a.eater.z+i)*t+a.eater.x+e)*4+2]=128;const Se=N(ie),ke=N(_e),Ce=N(ve),je=N(le),Ye={value:s.occlusion??1},Ke=new Uint8Array(t*t*4);{const e=new Float32Array(t*t),i=new Float32Array(t*t);for(let r=0;r<t*t;r++)n.alive[r]&&(n.fixed[r]||n.age[r]>=60)&&(e[r]=Math.min(1,.25+n.cap[r]*6/60));await l.yield?.();for(let r=0;r<t;r++){for(let u=3,h=r*t+3;u<t-3;u++,h++)i[h]=(e[h-3]+e[h+3]+2*(e[h-2]+e[h+2])+3*(e[h-1]+e[h+1])+4*e[h])/16;r%64===63&&await l.yield?.()}for(let r=3;r<t-3;r++){for(let u=0,h=r*t;u<t;u++,h++)Ke[h*4]=Math.min(255,Math.round((i[h-3*t]+i[h+3*t]+2*(i[h-2*t]+i[h+2*t])+3*(i[h-t]+i[h+t])+4*i[h])/16*255*2.2));r%64===63&&await l.yield?.()}}await l.yield?.();const ce=new v.DataTexture(Ke,t,t,v.RGBAFormat,v.UnsignedByteType);ce.minFilter=ce.magFilter=v.LinearFilter,ce.generateMipmaps=!1,ce.needsUpdate=!0;const Oe=[s.pileUp??26,s.shuttleScale??2.6],Be=()=>{_e.set(ie);const e=n.px0??0,i=n.px1??t-1,r=n.pz0??0,u=n.pz1??t-1;for(let h=r;h<=u;h++)for(let M=e,w=h*t+e;M<=i;M++,w++){const g=w*4,$=Math.min(7,Ft(n.hist[w]));ie[g]=n.age[w],ie[g+1]=n.heat[w],ie[g+2]=n.nbr[w]*16+n.role[w],ie[g+3]=$*32,ve[g]=ve[g+1],ve[g+1]=Math.min(255,Math.round(qt(n.age[w],n.cap[w],n.role[w],$,n.nbr[w],M+.5-a.ox,h+.5-a.oz,Oe)/.4))}Se.needsUpdate=ke.needsUpdate=Ce.needsUpdate=!0},Qe=s.maxColumns??1600,Pe=Ge(!1),fe=new v.InstancedBufferGeometry;fe.index=Pe.index;for(const e of["position","inset","normal"])fe.setAttribute(e,Pe.getAttribute(e));const Fe=new v.InstancedBufferAttribute(new Float32Array(Qe*2),2);Fe.setUsage(v.DynamicDrawUsage),fe.setAttribute("aCell",Fe),fe.instanceCount=0;const ge={uCur:{value:Se},uPrev:{value:ke},uSoil:{value:je},uF:{value:0},uStep:{value:0},uGun:{value:new v.Vector4(a.ox,a.oz,Oe[0],Oe[1])}},Xe={value:new v.Vector2(a.ox,a.oz)},Re=(e,i,r)=>new v.ShaderMaterial({vertexShader:e,fragmentShader:i,fog:!0,side:v.DoubleSide,uniforms:{...v.UniformsUtils.clone(v.UniformsLib.fog),...q(),...ge,uOrigin:Xe,...r}}),mt=Re(Mt,At,{uWidth:{value:5.6},uGlow:{value:s.highlightGlow??.05},uAO:Ye}),Ve=new v.Mesh(fe,mt);Ve.frustumCulled=!1,Ve.name="life-columns";const Je=()=>{let e=0;const i=Fe.array;for(let r=n.pz0??0;r<=(n.pz1??t-1);r++)for(let u=n.px0??0,h=r*t+u;u<=(n.px1??t-1);u++,h++)(ie[h*4]||_e[h*4])&&e<Qe&&(i[e*2]=u,i[e*2+1]=r,e++);fe.instanceCount=e,Fe.needsUpdate=!0},Ze=s.groundSize??9e3,et=new v.PlaneGeometry(Ze,Ze,1,1);et.rotateX(-Math.PI/2);const pt=Re(St,kt,{uHgt:{value:Ce},uAoMap:{value:ce},uGrid:{value:t},uTanSun:{value:Math.tan(b)},uShadow:{value:s.shadow??1},uAO:Ye,uMeet:{value:((s.meetStep??30)%30+30)%30},uRipple:{value:s.ripple??1},uLane:{value:new v.Vector4(x.x-x.z,x.x+x.z+4,x.x+x.z+2*p-8,s.kerbLights??1)}}),qe=new v.Mesh(et,pt);qe.frustumCulled=!1,qe.name="life-ground",qe.position.y=-.02;const we=new v.Group;we.name="glider-country-gun",we.add(qe,Ve),await l.yield?.();{const e=Ue(t),i=new Uint8Array(t*t),r=new Uint8Array(t*t);e.alive.set(n.alive),e.x0=n.x0,e.x1=n.x1,e.z0=n.z0,e.z1=n.z1;for(let u=0;u<30;u++){e.tick();for(let h=e.pz0;h<=e.pz1;h++)for(let M=e.px0,w=h*t+M;M<=e.px1;M++,w++)i[w]+=e.hist[w]&1;await l.yield?.()}for(let u=2;u<t-2;u++)for(let h=2,M=u*t+2;h<t-2;h++,M++)if(i[M]>=10)for(let w=-2;w<=2;w++)for(let g=-2;g<=2;g++)r[M+w*t+g]=1;await l.yield?.();for(let u=1;u<t-1;u++)for(let h=1,M=u*t+1;h<t-1;h++,M++)r[M]&&(ve[M*4+2]=r[M-t]&r[M-1]&r[M+1]&r[M+t]?255:128);await l.yield?.()}const tt=[];await l.yield?.();for(let e=0;e<t*t;e++)n.alive[e]&&(n.fixed[e]||n.age[e]>=20)&&!E.includes(e)&&tt.push(e);const G={cell:[],off:[],size:[],col:[],sway:[]},he=(e,i,r,u,h,M,w,g,$)=>{G.cell.push(e%t,e/t|0),G.off.push(i,r,u),G.size.push(h,M,w),G.col.push(g.r,g.g,g.b),G.sway.push(0,0,0,$)},be=new v.Color;let xt=0;for(const e of tt){++xt%150===0&&await l.yield?.();const i=s.roofDensity?s.roofDensity(e%t-a.gx,(e/t|0)-a.gz,n.cap[e]):1;if(i<=0)continue;const r=n.cap[e]>=5,u=Math.floor((r?o.int(1,3):o.int(0,2))*(z<.8?.67:1)*Math.min(1,i)+o()*.999*(i<1?1:0)*Math.min(1,i)),h=[];for(let w=0;w<u;w++){let g=0,$=0,_=!1;for(let D=0;D<8&&!_;D++)g=o.range(-1.6,1.6),$=o.range(-1.6,1.6),_=h.every(Y=>Math.abs(Y[0]-g)>1.5||Math.abs(Y[1]-$)>1.5);if(!_)continue;h.push([g,$]);const U=o.range(.72,1.3)*(n.cap[e]>=12?1.4:1),R=o.range(.1,6.2),J=2*U*o.range(.85,1.25),te=2*U,me=1.2*U;he(e,g,0,$,.5*U,J,.5*U,be.copy(f[2]).lerp(f[1],o.range(0,.25)),R),he(e,g,J,$,te,te,te,be.copy(f[4]).lerp(f[3],o.range(0,.22)).multiplyScalar(o.range(.92,1.05)),R),he(e,g+o.range(-.25,.25)*U,J+te,$+o.range(-.25,.25)*U,me,me,me,be.copy(f[4]).lerp(f[3],o.range(.2,.55)),R),o.chance(.3)&&he(e,g+o.range(-.2,.2),J+te+me,$+o.range(-.2,.2),.62*U,.62*U,.62*U,be.copy(f[3]),R)}const M=Math.round(o.int(1,4)*z*Math.min(1,i*i));for(let w=0;w<M;w++){const g=o.range(-2.2,2.2),$=o.range(-2.2,2.2);if(h.some(R=>Math.abs(R[0]-g)<.6&&Math.abs(R[1]-$)<.6))continue;const _=o.range(.32,.5),U=o.range(.25,.6);he(e,g,0,$,.1,U,.1,f[3],-o.range(.1,6.2)),he(e,g,U,$,_,_,_,be.copy(o.chance(.7)?f[1]:f[0]).lerp(f[2],o.range(0,.4)),-o.range(.1,6.2))}}const Te={value:0};let $e=null;if(G.cell.length){const e=new v.InstancedBufferGeometry;for(const i of["position","inset","normal"])e.setAttribute(i,Pe.getAttribute(i));for(const[i,r,u]of[["aCell",G.cell,2],["aOff",G.off,3],["aSize",G.size,3],["aColor",G.col,3],["aSway",G.sway,4]])await l.yield?.(),e.setAttribute(i,new v.InstancedBufferAttribute(new Float32Array(r),u));e.instanceCount=G.cell.length/2,$e=new v.Mesh(e,Re(Ct,dt,{uTime:Te})),$e.frustumCulled=!1,$e.name="roof-gardens",we.add($e)}await l.yield?.();const P=y(a.gx+1,a.gz+5,84),ye=y(a.gx+35,a.gz+3,84),se=y(a.gx+18.5,a.gz+4.5,0),ot=y(a.gx+26,a.gz+11.5,1.5),ne=new v.Vector3(Math.SQRT1_2,0,Math.SQRT1_2),at=new v.Vector3(-Math.SQRT1_2,0,Math.SQRT1_2),ue=y(x.x+.5,x.z+0,0),vt=(s.eaterStoreys??9)*ut,de=a.eater?y(a.eater.x+2,a.eater.z+2,vt):ue.clone().addScaledVector(ne,p*O*Math.SQRT2),it=E.length?y(E[0]%t+.5,(E[0]/t|0)+.5,6):de.clone().setY(6),oe=de.clone().setY(0).sub(ue).dot(ne),Q=(e,i)=>ue.clone().addScaledVector(ne,e).addScaledVector(at,21).setY(i),ze=Math.round((s.birds??42)*z);let Le=null;if(ze>0){const e=Ge(!0),i=new v.InstancedBufferGeometry;for(const M of["position","inset","normal"])i.setAttribute(M,e.getAttribute(M));const r=new Float32Array(ze*3*4),u=new Float32Array(ze*3*4),h=[P,ye,de,se.clone().setY(22),ot.clone().setY(14),ue.clone().addScaledVector(ne,oe*.5).setY(30)];for(const M of s.birdHomes||[])h.push(new v.Vector3(M[0],M[1]-6,M[2]));for(let M=0;M<ze;M++){const w=o.range(.25,.6)*(o.chance(.5)?1:-1),g=o.range(0,6.28),$=o.range(.8,1.3)*(s.birdSize??1);let _=h[M%h.length],U=20,R=0,J=0,te=0;for(let D=0;D<7&&(_=h[(M+D*5)%h.length],U=o.range(9,34),R=_.x+o.range(-10,10),J=_.y+o.range(3,14),te=_.z+o.range(-10,10),D===6&&(J=Math.max(J+30,62)),!(!s.birdOk||s.birdOk(R,J,te,U)));D++);const me=w*14/U;for(let D=0;D<3;D++){const Y=(M*3+D)*4;r[Y]=R,r[Y+1]=J,r[Y+2]=te,r[Y+3]=U,u[Y]=g,u[Y+1]=me,u[Y+2]=D-1,u[Y+3]=$}}i.setAttribute("aA",new v.InstancedBufferAttribute(r,4)),i.setAttribute("aB",new v.InstancedBufferAttribute(u,4)),i.instanceCount=ze*3,Le=new v.Mesh(i,new v.ShaderMaterial({vertexShader:Bt,fragmentShader:dt,fog:!0,side:v.DoubleSide,uniforms:{...v.UniformsUtils.clone(v.UniformsLib.fog),...q(),uTime:Te,uBirdCol:{value:f[0]},uWingCol:{value:f[0].clone().lerp(f[2],.35)}}})),Le.frustumCulled=!1,Le.name="cube-birds",we.add(Le)}const lt=s.stepsPerSecond??2.5;let X=0,Ie=null,st=!1,We=!1,He=[],ae=[];const nt=()=>{n.tick(),He=ae,ae=Ae(n,a),Be(),Je()},gt=e=>{for(;n.step-Z<e;)n.tick();ae=Ae(n,a),n.px0=0,n.px1=t-1,n.pz0=0,n.pz1=t-1,Be(),nt()};await l.yield?.(),ae=Ae(n,a),n.px0=0,n.px1=t-1,n.pz0=0,n.pz1=t-1,await l.yield?.(),Be(),await l.yield?.(),n.tick(),await l.yield?.(),He=ae,ae=Ae(n,a),await l.yield?.(),Be(),await l.yield?.(),Je(),await l.yield?.();const wt=(e,i)=>{const r=Math.max(0,Ie??(s.autoRun===!1?0:i*lt));!st||We?(st=!0,We=!1,Math.floor(r)+1>n.step-Z&&gt(Math.floor(r)),X=Math.max(X,r)):r>X&&(X=Math.min(r,X+Math.max(0,e)*4.2));let u=0;for(;n.step-Z<Math.floor(X)+1&&u++<2;)nt();const h=n.step-Z-1;Math.floor(X)>h&&(X=h+.999),ge.uF.value=Math.min(1,Math.max(0,X-h)),ge.uStep.value=h%120},ee=[];for(let e=0;e<24;e++)ee.push(new v.Vector3);let Me=0,rt=-1,ct=-1;const ft=()=>{const e=ge.uF.value;if(e===rt&&n.step===ct)return ee;rt=e,ct=n.step;const i=e*e*(3-2*e);Me=0;for(let r=0;r<ae.length&&Me<ee.length;r++){const u=ae[r];let h=u;for(let $=0;$<He.length;$++){const _=He[$];Math.abs(_.x-u.x)<=1.5&&Math.abs(_.z-u.z)<=1.5&&(h=_)}const M=(h.x+(u.x-h.x)*i-a.ox)*O,w=(h.z+(u.z-h.z)*i-a.oz)*O;let g=Me;for(;g>0&&ee[g-1].x+ee[g-1].z>M+w;)ee[g].copy(ee[g-1]),g--;ee[g].set(M,1.5,w),Me++}return ee},ht={westTower:P,eastTower:ye,meet:se,birth:ot,eater:de,eaterLip:it,lane:{start:ue,dir:ne.clone(),length:oe,starboard:at.clone(),cameraOffset:21},portalSeat:{position:Q(oe+80,8),facing:ne.clone().negate(),radius:7},flyThrough:[new v.Vector3(P.x-220,30,P.z+22),new v.Vector3(P.x-90,30,P.z+22),new v.Vector3(P.x,30,P.z+22),new v.Vector3(P.x+48,20,P.z+24),new v.Vector3(se.x-22,12.5,se.z+42),Q(-2,7),Q(22,4.5),Q(90,4.5),Q(oe*.6,6),Q(oe-25,8),Q(oe+30,8),Q(oe+80,8)],viewpoints:{entry:{position:new v.Vector3(P.x-190,30,P.z+22),target:new v.Vector3(ye.x,30,0)},meeting:{position:new v.Vector3(se.x-55,16,se.z+26),target:se.clone().setY(2)},besideGlider:{position:Q(30,4.5),target:ue.clone().addScaledVector(ne,42).setY(1.5)},eaterPass:{position:Q(oe-22,8),target:it.clone()}},steps:{meet:s.meetStep??30,eat:a.eatStep??null,period:30,perSecond:lt,flightSteps:105,ok:a.ok}};return ht.bounds={min:new v.Vector3(P.x-12,0,Math.min(P.z,ye.z)-36),max:new v.Vector3(Math.max(de.x,ye.x)+18,84,de.z+18)},{object:we,radius:160,height:84,center:new v.Vector3(60,20,60),anchors:ht,ground:!1,groundY:0,setStep(e){Ie=e},jumpStep(e){Ie=e,We=!0},shownStep:()=>n.step-Z-1,setProgress(e,i=105){Ie=Math.max(0,e)*i},getStep:()=>X,gliders:ft,gliderCount:()=>(ft(),Me),cellOf:m,localOf:y,layout:a,life:n,textures:{cur:Se,prev:ke,heights:Ce,soil:je},uniforms:{cell:ge,time:Te,origin:Xe},glazes:f,update(e,i){Te.value=i,B.value=i,wt(e,i)},dispose(){Se.dispose(),ke.dispose(),Ce.dispose(),je.dispose(),ce.dispose()}}}export{O as CELL,xe as GLSL_COMMON,re as RLE,Ge as bevelBoxGeometry,$t as buildHero,Ee as glaze,Ne as orient,pe as parseRLE};
