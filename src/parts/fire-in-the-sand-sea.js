import*as f from"three";import{clamp as se,lerp as K,smoothstep as I,makeRng as Oe,hashSeed as Ze}from"../kit/core.js";const je=["#C98B6B","#E2B58C","#2B3350","#121A33","#18110F","#F3C9A0","#FF6A1F"],J=Math.PI*2,we=.625,Me=.194,We=-45,ze=900,ge=0,le=18;function Ye(t,o){const s={scA:t.range(20,34),scPh:t.range(-.5,.5),sc2A:t.range(5,10),sc2L:t.range(190,260),sc2Ph:t.range(0,J),und:t.range(1,1.8),isletL:t.range(17,22),isletH:t.range(8.5,9.5),hornW:t.range(-1.5,1.5),hornE:t.range(-1.5,1.5),spurBow:t.range(70,95),ridges:[]};for(let n=-6;n<=13;n++)s.ridges.push({k:n,ph:t.range(0,J),a:t.range(18,40),top:t.range(44,62),sad:t.range(22,36),sz:t.range(-300,300),ph2:t.range(0,J)});const x=s.ridges,z=n=>Math.exp(-n*n),g=n=>s.scA*.8*Math.cos(J*(n+235)/600+s.scPh*.5)+s.sc2A*Math.sin(J*n/s.sc2L+s.sc2Ph)+6.5*Math.sin(J*n/86+s.sc2Ph*1.7)*I(20,90,Math.abs(n+250)),h=g(0),i=n=>g(n)-h,c=n=>{const w=((n+250)%600+900)%600-300,q=Math.abs(n+250)<300?38:29,P=1.6*Math.sin(n*.021)+3.6*Math.sin(n*.0127+s.sc2Ph)+2*Math.sin(n*.0346+s.scPh*5)-3.6*Math.sin(s.sc2Ph)-2*Math.sin(s.scPh*5);return 55-q*z(w/78)+P*I(0,200,Math.abs(n+250))},b=(n,w)=>n<0?Math.max(We,w+n*Me):Math.max(We,w-n*we),A=(n,w)=>n.k*ze+n.a*Math.cos(J*w/640+n.ph)+9*Math.sin(J*w/230+n.ph2),v=(n,w)=>{const q=((w+n.sz)%700+1050)%700-350;return n.top-(n.top-n.sad)*z(q/90)+3*Math.sin(w*.004+n.ph)+6*Math.sin(w*.0021+n.ph2)+3.5*Math.sin(w*.0083+n.ph*2)},d=n=>-585+s.spurBow*I(40,185,n)+26*I(230,520,n),k=n=>44+(8+s.hornW)*z((n-167)/12.5)+(8+s.hornE)*z((n-213)/12.5)-22*I(560,760,n),p=190,T=(n,w)=>{const q=w-d(n),P=11.5*z((n-p)/12.5)*(q>0?Math.exp(-q/120):1),R=k(n)-P,_=q*Me,W=-q*we;return R-(.5*(_+W+Math.sqrt((_-W)*(_-W)+40))-3.162)},N={x:141.3,z:-315},M=(n,w)=>{const q=n-N.x,P=(w-N.z)/s.isletL,R=-q*.42,_=q*we;return s.isletH-(.5*(R+_+Math.sqrt((R-_)*(R-_)+4))-1)-P*P*s.isletH},S=[{x:214,z:-117,L:41,H:10.6,bow:-7,ax:[1,0],lee:[0,-1]},{x:150,z:-223,L:15,H:6.4,bow:7,ax:[0,1],lee:[1,0]},{x:334,z:-34,L:46,H:11.5,bow:10,ax:[.97,.24],lee:[.24,-.97]},{x:322,z:-214,L:24,H:7.2,bow:6,ax:[.89,-.45],lee:[.45,.89]}],B=(n,w)=>{let q=-99;for(const P of S){const R=n-P.x,_=w-P.z;if(R*R+_*_>(P.L+45)*(P.L+45))continue;const W=(R*P.ax[0]+_*P.ax[1])/P.L,D=R*P.lee[0]+_*P.lee[1]-P.bow*W*W,V=-D*.36,G=D*we,F=Math.min(W*W,4),O=P.H*(1-F*(1+.3*F))*(1+.1*Math.sin(W*5.3+P.x))-(.5*(V+G+Math.sqrt((V-G)*(V-G)+.5))-.354);O>q&&(q=O)}return q},y=d(p),r=k(p)-11.5,a=[p,r+7.2,y+3],e=[.342,-.94];function l(n,w){const q=i(w),P=n-q;let R=b(P,c(w));const _=Math.floor(n/ze);for(let W=_;W<=_+1;W++){const D=x[W+6],V=n-W*ze;if(!D||W===0||V<-615||V>235)continue;const G=b(n-A(D,w),v(D,w));G>R&&(R=G)}if(n>-200&&n<900&&w<-235&&w>-675){const W=T(n,w);W>R&&(R=W)}if(P<0&&P>-400&&(R-=22*z((w-58)/34)*(1-I(-128,-38,P))),w<-280&&n>40&&n<260){const W=n-a[0],D=w-a[2],V=-(W*e[0]+D*e[1]),G=Math.abs(W*.94+D*.342);if(V>90&&V<300&&(R-=11.8*z((V-184)/32)*z((W*.94+D*.342-10)/45)),V>-5&&V<260&&G<36){const F=Math.max(12,a[1]-.2126*V)-6.8,O=R-F;O>0&&(R-=O*O/(O+1.2)*(1-I(9,36,G)));const te=W*.94+D*.342;R+=3.1*z((V-28.5)/11)*z((te-6.5)/4.2)}}if(n>60&&n<220&&w<-230&&w>-360){const W=M(n,w);W>R&&(R=W)}if(n>110&&n<430&&w<40&&w>-270){const W=B(n,w);W>R&&(R=W)}if(R>We+1){const W=I(0,60,-P)+(n>ze*.5||n<-ze*.5?.6:0);if(W>0&&(R+=s.und*Math.min(1,W)*o.n2(n*.011,w*.008)*I(-40,5,R)),P<0&&P>-520){const D=I(6,80,-P)*(1-I(330,520,-P));R+=3*(1-Math.exp(P/20))*(1-I(110,300,-P)),R+=D*(3.4*o.n2(n*.0058+w*.0031+9.3,w*.0043-n*.0012-4.1)+1.5*Math.sin((n*.82+w*.57)*.045+2.2*o.n2(n*.004,w*.004+7)))}}return R}const u=(n,w)=>n<i(w)?le:ge;function m(n,w,q,P,R){let _=0,W=1;const D=l(n,w)-R;for(let V=0;V<26;V++){const G=(_+W)/2;l(K(n,q,G),K(w,P,G))-R>0==D>0?_=G:W=G}return[K(n,q,_),K(w,P,_)]}return{P:s,h:l,level:u,crestX:i,crestY:c,ridgeX:A,ridgeY:v,spurZ:d,spurTop:k,shore:m,normal:(n,w,q=new f.Vector3)=>q.set(l(n-.4,w)-l(n+.4,w),.8,l(n,w-.4)-l(n,w+.4)).normalize(),NOTCH_X:p,ISLET:N,ISLETS:S,SEAT:a,HD:e,ridges:s.ridges}}const re={dW:-350,dE:650,zS:250,zN:-700};function Qe(){const t=[],o=[];let s=0,x=.6;for(;s<-re.dW;)s+=x,t.push(-Math.min(s,-re.dW)),x=Math.min(s<215?5:14,x*1.2);for(s=0,x=.6;s<110;)s+=x,o.push(s),x=Math.min(4.5,x*1.15);for(;s<318;)s+=s>=148&&s<262?1.8:2.6,o.push(s);for(x=6;s<re.dE;)s+=x,o.push(Math.min(s,re.dE)),x=Math.min(24,x*1.2);return{cols:[...t.reverse(),0,0,...o],crestI:t.length}}function $e(){const t=[];let o=re.zS;for(;o>re.zN;)t.push(o),o-=o<=34&&o>-440?3.5:o<=-440&&o>-602?o<=-476?1.8:2.6:6;return t.push(re.zN),t}async function Je(t,o){const{cols:s,crestI:x}=Qe(),z=$e(),g=s.length,h=z.length,i=[],c=[],b=[],A=[],v=new Float32Array(g*h*3);for(let S=0;S<h;S++){const B=z[S],y=o.crestX(B);for(let r=0;r<g;r++){const a=y+s[r],e=(S*g+r)*3;v[e]=a,v[e+1]=o.h(a,B),v[e+2]=B}S%6===0&&await t.yield()}const d=new f.Vector3,k=new f.Vector3,p=new f.Vector3;for(let S=0;S<h;S++){const B=Math.max(0,S-1),y=Math.min(h-1,S+1);for(let r=0;r<g;r++){let a=Math.max(0,r-1),e=Math.min(g-1,r+1);r===x&&(e=r),r===x+1&&(a=r);const l=(S*g+e)*3,u=(S*g+a)*3,m=(y*g+r)*3,L=(B*g+r)*3;d.set(v[l]-v[u],v[l+1]-v[u+1],v[l+2]-v[u+2]),k.set(v[m]-v[L],v[m+1]-v[L+1],v[m+2]-v[L+2]),p.crossVectors(d,k),p.y<0&&p.negate(),p.normalize();const n=(S*g+r)*3;i.push(v[n],v[n+1],v[n+2]),c.push(p.x,p.y,p.z),b.push(r<=x?le:ge)}S%40===0&&await t.yield()}for(let S=0;S<h-1;S++)for(let B=0;B<g-1;B++){if(B===x)continue;const y=S*g+B;A.push(y,y+1,y+g,y+1,y+g+1,y+g)}await t.yield();const T=[-335,-205,-105,-36,0,0,30,108],N=6600;for(const S of[{k:0},...o.ridges]){if(S.k===0&&S.ph!==void 0)continue;const B=S.k>=-1&&S.k<=2?66:200,y=Math.round(2*N/B)+1,r=i.length/3,a=new Uint8Array(y);for(let e=0;e<y;e++){e%50===49&&await t.yield();const l=-N+e*B-150,u=S.k===0?o.crestX(l):o.ridgeX(S,l),m=o.crestX(l);a[e]=(S.k===0?l>re.zN&&l<re.zS:l>re.zN+B&&l<re.zS-B&&u+T[0]>m+re.dW+20&&u+T[7]<m+re.dE-20)?0:1;for(let L=0;L<T.length;L++){const n=u+T[L]+(L===4?-.05:L===5?.05:0),w=o.h(n,l);if(Math.abs(l)<1700&&S.k>=-1&&S.k<=2){const q=L<=4?-3:3;p.set(-(o.h(n+q,l)-w)/q,1,-(o.h(n,l+6)-o.h(n,l-6))/12).normalize()}else p.set(L<=4?-Me:we,1,0).normalize();i.push(n,w-.6,l),c.push(p.x,p.y,p.z),b.push(o.level(n,l))}}for(let e=0;e<y-1;e++)if(!(!a[e]&&!a[e+1]))for(let l=0;l<T.length-1;l++){if(l===4)continue;const u=r+e*T.length+l;A.push(u,u+T.length,u+1,u+1,u+T.length,u+T.length+1)}await t.yield()}{const S=[[-1650,-2300,3300,34,40],[-2500,-3300,4200,46,50],[-3500,-4200,5200,56,60],[-4800,-5200,6200,70,70],[1500,-2500,3200,36,44],[2700,-3600,4300,52,56],[-20,420,1010,27,30],[-345,450,1e3,33,30]],B=[1,.4,.14,0,0,.14,.45,1];S.forEach(([y,r,a,e,l],u)=>{const m=i.length/3,L=Math.round((a-r)/l)+1;for(let n=0;n<L;n++){const w=r+(a-r)*n/(L-1),q=n/(L-1),P=y+220*Math.sin(w*.0017+u*2.1)+70*Math.sin(w*.0061+u),R=(w-(190+.364*(-585-P)))/330,_=Math.exp(-R*R),W=.5+.5*Math.sin(w*.0052+u*1.7+2*Math.sin(w*.0019+u)),D=(e*(.42+.58*W*Math.sqrt(W))+9*Math.sin(w*.013+u*4))*Math.sqrt(Math.sin(Math.PI*q))*(1-.5*_)+2;for(let V=0;V<8;V++){const G=B[V],F=V<4;i.push(w,D-G*(D+8),P+(F?G*(D+8)/Me:-G*(D+8)/we)+(V===3?.05:V===4?-.05:0)),p.set(0,1,F?Me:-we).normalize(),c.push(p.x,p.y,p.z),b.push(ge)}}for(let n=0;n<L-1;n++)for(let w=0;w<7;w++){if(w===3)continue;const q=m+n*8+w;A.push(q,q+8,q+1,q+1,q+8,q+9)}}),await t.yield()}const M=new f.BufferGeometry;return M.setAttribute("position",new f.Float32BufferAttribute(i,3)),M.setAttribute("normal",new f.Float32BufferAttribute(c,3)),M.setAttribute("aLevel",new f.Float32BufferAttribute(b,1)),M.setIndex(A),M.boundingSphere=new f.Sphere(new f.Vector3(0,0,0),9500),M}const ye=`
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y); }
float fbm3(vec2 p){ float s = 0.5 * vnoise(p); p = p * 2.03 + 17.1; s += 0.25 * vnoise(p); p = p * 2.01 + 5.3; s += 0.125 * vnoise(p); return s * 1.143; }
`;function et(t){return{uSkyUp:{value:new f.Color(.155,.33,1)},uSkyLow:{value:new f.Color(t[2]).multiplyScalar(1.5)},uRakeDir:{value:new f.Vector3(.985,.17,.05).normalize()},uRakeCol:{value:new f.Color(t[5]).multiplyScalar(.34)},uLava:{value:new f.Color(t[6])},uLavaLit:{value:new f.Color(t[6]).multiplyScalar(.72).add(new f.Color(t[5]).multiplyScalar(.3))},uLavaGain:{value:1},uVeilSpeed:{value:6.5},uWind:{value:1},uSunCol:{value:new f.Color(0,0,0)},uSunY:{value:46},uTime:{value:0}}}const xe=(t,o)=>Object.assign(f.UniformsUtils.merge([f.UniformsLib.fog]),t,o);function tt(t,o,s){return new f.ShaderMaterial({fog:!0,uniforms:xe(o,{uSeat:{value:new f.Vector2(s.SEAT[0],s.SEAT[2])},uTongue:{value:new f.Vector3(s.crestX(oe),s.shore(s.crestX(oe)+150,oe,s.crestX(oe)+5,oe,-.2)[0],oe)},uSand:{value:new f.Color(t[0])},uPale:{value:new f.Color(t[1])},uStreak:{value:new f.Color("#8A5E50")}}),vertexShader:`
      attribute float aLevel;
      varying vec3 vW; varying vec3 vN; varying float vLevel;
      #include <common>
      #include <fog_pars_vertex>
      void main(){
        vec4 w = modelMatrix * vec4(position, 1.);
        vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vLevel = aLevel;
        vec4 mvPosition = viewMatrix * w;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSand, uPale, uStreak, uSkyUp, uSkyLow, uRakeDir, uRakeCol, uLava, uLavaLit;
      uniform float uTime, uLavaGain, uWind, uVeilSpeed, uSunY; uniform vec3 uSunCol; uniform vec2 uSeat; uniform vec3 uTongue;
      varying vec3 vW; varying vec3 vN; varying float vLevel;
      #include <common>
      #include <fog_pars_fragment>
      ${ye}
      float flickG(vec3 w, float t){ return 0.75 + 0.25 * vnoise(vec2((w.x + w.z) * 0.22, t * 0.6)); }
      // (polish 4) one avalanche tongue per cell along the face: a narrow head below the brink widening to a rounded toe.
      // tc: cells along the face, h: metres above the lake. -> (inside, lit toe front, signed side edge, dark outline)
      vec4 avLobe(float tc, float h, float sd){
        float ti = floor(tc), tf = (fract(tc) - 0.5) * 2.;
        float r1 = hash21(vec2(ti, sd)), r2 = hash21(vec2(ti, sd + 3.7));
        float foot = mix(1.2, 46., r1 * sqrt(r1)), len = mix(5., 14., r2);   // (polish k1: a tongue is three to six times as long as it is wide; at 36 m they were pale streaks from brink to foot, a stretched texture)
        float hT = h - foot, k = clamp(hT / len, 0., 1.);
        float wid = (0.26 + 0.24 * r2) * sqrt(clamp(k * (1. - k) * 4., 0., 1.)) * step(0., hT) * step(0.48, hash21(vec2(ti, sd + 9.2)));   // (polish 5: two cells in five carry one: a face is mostly clean)   // (polish 5: no bulb at the toe: wide and bulbed, they read as drips of paint)
        float e = wid - abs(tf);
        float aa = min(fwidth(tc) * 2., 0.5) + 0.03;
        float inside = smoothstep(0., aa, e);
        float edge = inside * (1. - smoothstep(aa, aa + 0.24, e));
        float low = 1. - smoothstep(1.5, 5., hT);
        return vec4(inside * (0.55 + 0.45 * r2), edge * low, edge * (1. - low) * sign(tf), (1. - inside) * smoothstep(-0.14 - aa, 0., e) * (0.25 + 0.75 * low));
      }
      vec4 avLobes(float al, float h){
        vec4 a = avLobe(al * 0.21 + (vnoise(vec2(al * 0.05, 3.3)) - 0.5) * 1.4, h, 5.1);   // (polish 5) tongues a metre or two wide, as grain flows are
        vec4 b = avLobe(al * 0.12 + 31.7, h * 0.8 + 1., 8.3);
        return vec4(max(a.x, b.x * (1. - a.x)), a.y + b.y * (1. - a.x), a.z + b.z * (1. - a.x), a.w + b.w * (1. - a.x));
      }
      void main(){
        vec3 n = normalize(vN);
        vec3 n0 = n;                                              // (polish 4) the face itself, before ripples: which way the lake lies
        float dist = length(cameraPosition - vW);
        float steep = 1. - n.y;                                   // 0.018 on the windward flank, 0.152 on a slip face
        float slip = smoothstep(0.128, 0.15, steep);                 // true slip faces only (0.152)
        // the wind-scoured corridor up to the ring is firm sand: no grain flows on its sides
        vec2 rs = vW.xz - uSeat; float cdd = -(rs.x * 0.342 - rs.y * 0.94), clat = abs(rs.x * 0.94 + rs.y * 0.342);
        slip *= 1. - (1. - smoothstep(38., 52., clat)) * smoothstep(-12., -6., cdd) * (1. - smoothstep(240., 270., cdd));
        float bayK = step(9.25, vLevel) * smoothstep(-430., -380., vW.x);
        slip *= 1. - bayK;      // (polish 4) nor is the wall of the west lake's bay: a wind-scoured blowout, firm and rippled
        // --- wind ripples: crests run across the wind (wind blows toward +x). Two trains of slightly different
        //     wavelength and heading are cross-faded by a slow noise, so crests waver, fork where the trains meet and
        //     die out in patches; each train fades to its average as it nears one crest per pixel (no moire, no rings).
        float kSp = 1. - smoothstep(-358., -338., vW.z);
        vec2 wdr = normalize(mix(vec2(1., 0.), vec2(0.42, -0.9), kSp));        // over the spur the wind blows up the corridor
        vec2 q = vec2(dot(vW.xz, wdr), dot(vW.xz, vec2(-wdr.y, wdr.x)));
        float warp = vnoise(q * vec2(0.9, 0.22)) * 2.6 + vnoise(q * vec2(0.13, 0.05)) * 5.;
        float phA = (q.x + 0.15 * q.y + warp * 0.11) * 46.5;      // 0.135 m ripples, crests swung 9 degrees
        float phB = (q.x - 0.11 * q.y + warp * 0.07) * 57.1;      // 0.11 m ripples, swung the other way
        float fwA = fwidth(phA), fwB = fwidth(phB);
        float wAB = smoothstep(0.43, 0.57, vnoise(q * vec2(0.6, 0.17) + 7.3));   // (polish 4: a narrower seam between the two trains: where both showed they wove a plaid)
        float rPatch = 0.3 + 0.7 * smoothstep(0.22, 0.7, vnoise(q * vec2(0.19, 0.06) + 21.));
        float keep = (1. - slip) * rPatch;
        float aA = (1. - wAB) * (1. - smoothstep(0.55, 1.6, fwA)) * keep;
        float aB = wAB * (1. - smoothstep(0.55, 1.6, fwB)) * keep;
        float f1 = aA + aB;                                        // how much ripple relief is left at this pixel
        float sA = sin(phA), sB = sin(phB);
        float r1 = sA * aA + sB * aB;
        // crests a little sharper than troughs (a second harmonic), like real ripples
        float tilt = (cos(phA) + 0.3 * cos(2. * phA + 0.6)) * aA * 0.17 + (cos(phB) + 0.3 * cos(2. * phB + 0.6)) * aB * 0.17;
        // --- the middle scales, so no stretch of sand is a bare plane: larger ripples about 1.4 m apart (crests waver,
        //     fork and die out in patches; they melt away before they near a crest per pixel), and broad low swells
        //     10 to 25 m across. Both tilt the normal and take a lit (east) and a shaded (west) side. ---
        float warpM = vnoise(q * vec2(0.21, 0.06) + 31.) * 4.2 + vnoise(q * vec2(0.05, 0.02) + 5.) * 9.;
        warpM += vnoise(q * vec2(0.27, 0.31) + 17.) * 3.4 + vnoise(q * vec2(0.6, 0.7) + 5.) * 1.1;   // (polish 3) their crests wind and fork every few metres: straight, they drew dark rays down the flank
        float phM = (q.x + 0.2 * q.y + warpM * 0.5) * 4.6;
        float aM = (1. - smoothstep(0.6, 1.9, fwidth(phM))) * (0.45 + 0.55 * smoothstep(0.38, 0.7, vnoise(q * vec2(0.05, 0.03) + 44.))) * (1. - slip);
        // (polish 2) they fork and die out every few metres, and seen along their own length (down a crest) they are held back: there they drew a fan of dark rays
        vec2 vdr = (cameraPosition.xz - vW.xz) / max(length(cameraPosition.xz - vW.xz), 1e-3);
        aM *= (0.3 + 0.7 * smoothstep(0.3, 0.58, vnoise(q * vec2(0.2, 0.17) + 63.))) * mix(0.3, 1., smoothstep(0.25, 0.75, abs(dot(vdr, wdr))));
        float hM = sin(phM) * aM;
        float tiltM = (cos(phM) + 0.35 * cos(2. * phM + 0.7)) * aM * 0.13;
        // (polish 4) and a family between them, 3.2 m apart, which is the one that reads on a flank or an islet 30 to 90 m off
        float warpN = vnoise(q * vec2(0.09, 0.03) + 83.) * 5. + vnoise(q * vec2(0.16, 0.21) + 57.) * 2.6;
        warpN = warpN * 1.5 + vnoise(q * vec2(0.3, 0.37) + 19.) * 1.6;
        float phN = (q.x - 0.24 * q.y + warpN) * 1.95;
        float aN = (1. - smoothstep(0.5, 1.6, fwidth(phN))) * (0.15 + 0.85 * smoothstep(0.36, 0.62, vnoise(q * vec2(0.085, 0.07) + 67.))) * (1. - slip) * mix(0.35, 1., smoothstep(0.25, 0.75, abs(dot(vdr, wdr)))) * smoothstep(14., 38., dist);   // (not under the eye: there the 1.4 m ripples and the fine ones are the picture)
        float tiltN = (cos(phN) + 0.4 * cos(2. * phN + 0.9)) * aN * 0.1;
        float warpL = vnoise(q * vec2(0.035, 0.012) + 71.) * 7. + vnoise(q * vec2(0.011, 0.006) + 13.) * 16.;
        warpL += vnoise(q * vec2(0.05, 0.075) + 37.) * 5.5 + vnoise(q * vec2(0.12, 0.2) + 3.) * 1.6;   // (polish 3) their crests wind every dozen metres: straight, they drew dark rays to the vanishing point
        float phL = (q.x * 0.84 + 0.55 * q.y + warpL) * 0.86;          // (polish 2: swung 33 degrees off the small ripples, so along a crest they cross the view instead of fanning out of its vanishing point)                // low transverse ridges 7 m apart: a long windward back, a short steep lee
        float aL = (1. - smoothstep(0.5, 1.7, fwidth(phL))) * (0.35 + 0.65 * smoothstep(0.3, 0.62, vnoise(q * vec2(0.012, 0.008) + 91.))) * (1. - slip) * (0.25 + 0.75 * smoothstep(0.36, 0.62, vnoise(q * vec2(0.05, 0.035) + 17.)));
        aL *= mix(0.3, 1., smoothstep(0.2, 0.7, abs(dot(vdr, normalize(wdr * 0.84 + vec2(-wdr.y, wdr.x) * 0.55)))));
        float sawL = cos(phL) + 0.5 * cos(2. * phL + 1.1) + 0.2 * cos(3. * phL + 2.0);
        float tiltL = sawL * aL * 0.062 * mix(1. - smoothstep(0.06, 0.125, steep), 1., bayK);
        // (polish 4) the scale that still reads across a whole flank: megaripples some 19 m apart, a long windward back and a
        // short lee, winding and forking; with the lava's light now coming FROM the lake they take an orange side and a blue side
        float warpX = vnoise(q * vec2(0.016, 0.006) + 51.) * 9. + vnoise(q * vec2(0.035, 0.05) + 77.) * 4.;
        float phX = (q.x * 0.93 - 0.37 * q.y + warpX) * 0.33;
        float aX = (1. - smoothstep(0.45, 1.5, fwidth(phX))) * (0.4 + 0.6 * smoothstep(0.3, 0.6, vnoise(q * vec2(0.006, 0.004) + 29.))) * (1. - slip);
        aX *= mix(1., 0.42, smoothstep(170., 420., dist));   // (polish k1) across a far flank they are soft swells: at full strength they stood on the far ridges as stepped dark slabs
        float sawX = cos(phX) + 0.45 * cos(2. * phX + 1.0) + 0.15 * cos(3. * phX + 1.9);
        float tiltX = sawX * aX * 0.085 * mix(1. - smoothstep(0.07, 0.125, steep), 1., bayK);
        float fS = (1. - smoothstep(140., 460., dist)) * (1. - slip);
        // (polish 2: the swells lie obliquely and are as long as they are wide; laid north-south they drew dark tram lines along every crest)
        vec2 qs = vec2(q.x * 0.77 - q.y * 0.64, q.x * 0.64 + q.y * 0.77);
        float sw0 = vnoise(qs * vec2(0.075, 0.05) + 3.1), swx = vnoise((qs + vec2(1.155, 0.96)) * vec2(0.075, 0.05) + 3.1);
        float tiltS = (swx - sw0) / 1.5 * 1.5 * fS;
        float east = clamp(-(0.4 * tilt + tiltM + 0.8 * tiltN + 0.7 * tiltL + tiltX + tiltS), -0.4, 0.5);          // + on faces that lean toward the dawn
        n = normalize(n + vec3(wdr.x, 0., wdr.y) * (-(tilt + tiltM + tiltN + tiltL + tiltX + tiltS)) * (0.6 + 0.4 * n.y));
        // --- albedo: rose quartz, dark mineral streaks in some troughs, broad pale and dark drifts ---
        float drift = fbm3(q * vec2(0.012, 0.004) + 3.);
        float fine = (vnoise(q * 23.) - 0.5) * (1. - smoothstep(2.5, 11., dist));
        vec3 alb = mix(uSand, uPale, 0.18 + 0.34 * drift);
        float streakN = smoothstep(0.42, 0.8, vnoise(q * vec2(0.05, 0.4) + 9.));
        alb = mix(alb, uStreak, (0.5 - 0.5 * r1 / max(f1, 0.05)) * f1 * (0.07 + 0.38 * streakN));
        // long faint mineral streaks that stay when the ripples are too fine to see
        alb = mix(alb, uStreak, 0.07 * smoothstep(0.4, 0.95, vnoise(q * vec2(0.012, 0.1) + 14.)) * (1. - slip));
        alb *= (1. + 0.1 * fine) * (1. + 0.07 * hM + 0.14 * (sw0 - 0.5) * fS);
        // --- grain flows: pale tongues of fresh sand sliding down every slip face ---
        // (the coordinate along the face is world z on the north-south ridges and world x on the spur, cross-faded, so
        //  a curved face such as the islet's never turns the streaks into rings)
        // (polish 2: chosen by place, not by the face's heading: the ridges round the flight run north-south and only the spur
        //  and the far arms run east-west; cross-fading by the normal drew rings wherever a face curved)
        float wEW = max(1. - smoothstep(-440., -400., vW.z), step(1400., abs(vW.z)) * smoothstep(0.3, 0.7, n.z * n.z / max(dot(n.xz, n.xz), 1e-4)));
        vec2 fy = vec2(vW.y * 0.085 + uTime * 0.045, vW.y * 0.3 + uTime * 0.16);   // (polish k1: trickles two or three times as long as they are wide; six and eight times, they were soft streaks down the whole wall, a stretched texture)
        float flowA = mix(vnoise(vec2(vW.z * 0.22, fy.x)), vnoise(vec2(vW.x * 0.22 + 7., fy.x)), wEW);
        float flowB = mix(vnoise(vec2(vW.z * 0.9 + 4., fy.y)), vnoise(vec2(vW.x * 0.9 + 11., fy.y)), wEW);
        float flow = smoothstep(0.5, 0.85, flowA) * (0.25 + 0.45 * (1. - smoothstep(60., 500., dist))) * (0.3 + 0.7 * smoothstep(20., 70., dist)) + smoothstep(0.55, 0.9, flowB) * 0.34 * (1. - smoothstep(30., 160., dist)) * smoothstep(12., 40., dist);
        alb = mix(alb, uPale * 1.04, slip * flow * 0.4);
        float tc = mix(vW.z, vW.x + 7., wEW) * 0.17 + (vnoise(vec2(mix(vW.z, vW.x, wEW) * 0.05, 3.3)) - 0.5) * 1.4;
        float ti = floor(tc), tf = (fract(tc) - 0.5) * 2.;
        float tEnd = mix(3., 34., hash21(vec2(ti, 5.1))) + 9. * tf * tf + 1.5 * vnoise(vec2(tc * 6., 1.7));   // height above the lake where this tongue's foot lies
        float hT = vW.y - vLevel - tEnd;
        float inT = smoothstep(-0.4, 0.6, hT) * (1. - smoothstep(0.82, 1., abs(tf)));
        float rimT = smoothstep(-1.2, 0., hT) * (1. - smoothstep(0., 1.6, hT)) + smoothstep(0.7, 0.86, abs(tf)) * (1. - smoothstep(0.86, 1., abs(tf))) * step(0., hT);
        float tFar = 1. - smoothstep(110., 340., dist);
        // (polish 2) tongues only on the tall straight faces east of the home crest: on the bay's curved wall and round the saddle their feet closed into rings
        tFar *= (1. - smoothstep(9., 9.5, vLevel)) * smoothstep(85., 135., abs(vW.z + 250.)) * (1. - wEW);
        // (polish 5: the older family of tongues with parabolic feet is no longer drawn: on the tall wall its feet were U-shaped loops, drips of paint)
        // (polish 4) avalanche tongues on every slip face and steep wall, drawn as shapes: fresh pale sand inside, a dark line
        // round each, the bulging toe lit from below by the lava, one side of each tongue brighter than the other
        float wN = smoothstep(0.3, 0.7, n0.z * n0.z / max(dot(n0.xz, n0.xz), 1e-4));
        float hAb = max(vW.y - vLevel, 0.);
        vec4 lb = mix(avLobes(vW.z, hAb), avLobes(vW.x + 13., hAb), wN);
        float alF = mix(vW.z, vW.x + 13., wN);
        float lobeK = slip * (1. - smoothstep(380., 900., dist)) * (0.5 + 0.5 * smoothstep(0.3, 0.62, vnoise(vec2(alF * 0.021, 7.7)))) * (0.12 + 0.88 * smoothstep(16., 60., dist));   // (close to the eye they are fainter: long thin lines there read as a blur)   // in clusters: some stretches of a face have slid tonight, some have not
        float lobeN = slip * (0.5 + 0.5 * smoothstep(0.3, 0.62, vnoise(vec2(alF * 0.021, 7.7)))) * (1. - smoothstep(16., 60., dist)) * 0.5;   // (polish k1) near the eye a tongue keeps its pale body and lit toe; only its thin outline fades
        alb *= 1. + (lobeK + lobeN) * 0.24 * lb.x - lobeK * 0.1 * lb.w;
        // close to the eye a slip face is combed: fine lines of grains down the fall line, and the pocks of older slides
        float nearS = slip * (1. - smoothstep(40., 170., dist));
        alb *= 1. + nearS * (0.17 * (vnoise(vec2(alF * 0.9, hAb * 0.5)) - 0.5) + 0.15 * (vnoise(vec2(alF * 0.31 + 9., hAb * 0.2)) - 0.5) + 0.1 * (vnoise(vec2(alF * 4., hAb * 2.2 + 3.)) - 0.5) * (1. - smoothstep(6., 30., dist)));   // (polish 5: soft dimples, as long as they are wide: the fine lines down the fall line read as a smear)
        // --- blown sand: pale veils snaking downwind over the ripples (saltation streamers), in gusts ---
        vec2 wdv = normalize(mix(vec2(1., 0.), vec2(0.5, -0.866), (1. - smoothstep(-345., -285., vW.z))));   // over the spur the wind swings north-east
        vec2 sp = vec2(dot(vW.xz, wdv) - uTime * uVeilSpeed, dot(vW.xz, vec2(-wdv.y, wdv.x)));
        // streamers: long thin ribbons of blown sand snaking downwind in lanes, each with a sharp head and a soft tail
        float gustS = 0.6 + 0.4 * vnoise(vec2(vW.x * 0.012 - uTime * 0.21, vW.z * 0.017));
        float lane = sp.y / 14. + (vnoise(vec2(sp.x * 0.035, sp.y * 0.02)) - 0.5) * 0.8;
        float li = floor(lane), lf = fract(lane) - 0.5;
        float hA1 = hash21(vec2(li, 3.7)), hA2 = hash21(vec2(li, 9.1));
        float wR = 0.013 + 0.013 * hA2 + dist * 0.0004;                   // half width in lanes: 0.3 to 0.6 m, never under a pixel
        float lat = (lf - (hA1 - 0.5) * 0.5) / wR;
        float tt = sp.x / mix(24., 44., hA2) + hA1 * 13.;
        float tv = fract(tt);
        float on = step(0.7, hash21(vec2(li * 1.37 + 0.3, floor(tt))));
        float ribbon = exp(-min(lat * lat * lat * lat, 30.)) * tv * sqrt(tv) * (1. - smoothstep(0.965, 1., tv)) * on;
        float veil = ribbon * 0.0 * gustS * (1. - smoothstep(60., 160., dist)) * (1. - slip) * uWind;
        // and, nearer, quicker threads of sand running between them (soft, a metre or two wide)
        float thr = vnoise(vec2((sp.x - uTime * uVeilSpeed * 0.6) * 0.16, sp.y * 0.75));
        veil += smoothstep(0.5, 0.95, thr) * 0.2 * gustS * (1. - smoothstep(30., 120., dist)) * (1. - slip) * uWind;
        alb = mix(alb, uPale * 1.22, min(veil, 1.) * 0.6);
        // single grains skittering along the ripples close to the eye
        float grain = smoothstep(0.9, 0.99, vnoise(vec2((dot(vW.xz, wdv) - uTime * 7.) * 2.2, dot(vW.xz, vec2(-wdv.y, wdv.x)) * 9.))) * (1. - smoothstep(6., 24., dist)) * (1. - slip) * uWind;
        alb += uPale * 0.09 * grain;
        // --- light 1: the sky ---
        vec3 col = alb * mix(uSkyLow, uSkyUp, n.y * 0.5 + 0.5) * (1. + 0.9 * east);
        // (polish 5) a slip face is steep and in the lee: it sees less of the sky and little of the dawn's rake, so it is the lava that
        // lights it, rose-orange at the foot and cooling to the sky's blue at the brink (it was one pale pink from top to bottom)
        col *= mix(vec3(1.), vec3(0.5, 0.6, 0.84), slip);
        col *= mix(vec3(1.), vec3(0.8, 0.9, 1.14), clamp((0.4 * tilt + tiltM + 0.7 * tiltN + 0.4 * tiltL + 0.6 * tiltX + tiltS) * 2.6, 0., 1.));   // (polish 2) two tones: the windward side of every ripple goes blue,
        col += alb * uRakeCol * max(east + 0.3 * tiltL, 0.) * 4.2;                    // and its lee side leans to the dawn and takes its peach
        // (polish 2) slip faces are fluted: broad chutes some 20 m across and the rounded backs of the avalanche tongues,
        // each with a lit and a shaded side, so a face is never one flat pink plane
        float fAl = mix(vW.z, vW.x + 7., wEW);
        float fcP = fAl * 0.047 + (vnoise(vec2(fAl * 0.021, 1.3)) - 0.5) * 1.7 + (vnoise(vec2(fAl * 0.045, vW.y * 0.016 + 3.)) - 0.5) * 0.8 + (vnoise(vec2(fAl * 0.12, vW.y * 0.03 + 8.)) - 0.5) * 0.3;
        float fluSeg = smoothstep(0.28, 0.62, vnoise(vec2(fAl * 0.06, vW.y * 0.05 + 11.)));          // (polish k1) a chute begins and ends on the face: ruled from brink to foot they read as a stretched texture
        float flute = sin(fcP * 6.2832) * (0.55 + 0.45 * vnoise(vec2(fAl * 0.013, vW.y * 0.02 + 5.))) * (0.45 + 0.55 * fluSeg) + 0.3 * sin(fcP * 15.1 + 2.) * (1. - smoothstep(60., 220., dist)) * fluSeg * smoothstep(0.3, 0.6, vnoise(vec2(fAl * 0.11 + 5., vW.y * 0.09)));
        float mott = fbm3(vec2(fAl * 0.033, vW.y * 0.011) + 23.) - 0.5;                      // broad soft drifts across the face
        float fluteK = slip * (1. - smoothstep(500., 1500., dist));
        col *= 1. + fluteK * (0.09 * flute + 0.14 * mott);
        col += alb * uRakeCol * fluteK * max(0.5 * flute + 1.2 * mott, 0.) * 0.9;
        col += uPale * uRakeCol * min(veil, 1.) * 0.5;                 // sand in the air takes the warm low light
        col += alb * uRakeCol * max(dot(n, uRakeDir), 0.) * (1. - 0.6 * slip);
        col += alb * uSunCol * (0.35 + 0.65 * max(dot(n, uRakeDir), 0.)) * smoothstep(uSunY, uSunY + 7., vW.y);
        // (polish 5) as the dawn grows (the world raises uRakeCol on the spur) it becomes a decided light: every face and ripple that
        // leans to the east takes rose-gold and every one that leans away falls into a cool blue shade
        float dawnK = clamp((uRakeCol.r - 0.36) * 2.3, 0., 1.), eR = dot(n, uRakeDir);
        col *= 1. - 0.36 * dawnK * (1. - smoothstep(-0.3, 0.12, eR)) * (1. - slip);
        col += alb * vec3(1., 0.56, 0.36) * 0.52 * dawnK * smoothstep(0.02, 0.45, eR) * (1. - slip);
        // --- light 2: the lava, from below: strongest on faces that look at the lake, dying with height ---
        float hA = max(vW.y - vLevel, 0.);
        // (polish 4) the lava's light has a direction: it comes from the lake, low, so a face that leans toward the flood is
        // orange and one that leans away keeps only the sky's blue (every ripple, swell and ridge: one orange side, one blue)
        vec2 lk = n0.xz / max(length(n0.xz), 0.06);
        float lam = max(dot(n, normalize(vec3(lk.x, 0.15, lk.y))), 0.);
        float facing = min(0.03 + 2.7 * lam * lam, 1.08);
        // and every ripple, at every scale, has a side that takes the fire and a side that keeps the sky: windward backs orange, lees blue (and peach from the dawn)
        facing *= clamp(1. + 3.2 * (0.2 * tilt + tiltM + tiltN + tiltL + tiltX) + 1.5 * tiltS, 0.3, 1.9);
        // (polish 4) the west lake is a bay, not a sea: its light dies sooner with height, so the wall above it goes from fire at
        // the foot through rose to the sky's violet-blue at the crest instead of one pink from top to bottom
        float lavaL = facing * (exp(-hA / mix(13., 8.5, bayK)) * mix(0.8, 0.95, slip) + exp(-hA / 2.4) * 0.5 - 0.035 * slip * smoothstep(8., 40., hA));
        float shim = 0.85 + 0.15 * sin(uTime * 0.7 + vW.z * 0.05 + vW.x * 0.031);
        col += alb * uLavaLit * lavaL * shim * uLavaGain;
        // (polish 5) and on the spur, whatever looks back down at the lake (the flank, the corridor's floor, the near side of every
        // ripple there) keeps some of its fire a long way up: one orange side, one blue
        float lk2 = max(dot(n, vec3(-0.302, 0.302, 0.905)), 0.); lk2 *= lk2;
        col += alb * uLavaLit * uLavaGain * 0.7 * lk2 * exp(-hA / 34.) * kSp * shim;
        col += alb * uLavaLit * uLavaGain * (exp(-hA / 22.) * 0.85 + 0.08) * lb.y * 0.62 * (lobeK + lobeN);      // the toes of the avalanche tongues
        col *= 1. + 0.2 * lb.z * (lobeK + lobeN);
        // (polish 4) the saddle tongue lights the sand beside it (it lay on the face like a decal: nothing glowed round it)
        float tGlow = exp(-max(abs(vW.z - uTongue.z) - 11., 0.) / 9.) * smoothstep(uTongue.x - 8., uTongue.x + 3., vW.x) * (1. - smoothstep(uTongue.y - 4., uTongue.y + 8., vW.x));
        col += alb * uLavaLit * uLavaGain * tGlow * 1.3 * shim;
        col += uLava * (0.5 * exp(-hA / 0.55) + 0.16 * exp(-hA / 1.6)) * flickG(vW, uTime) * uLavaGain * (1. - smoothstep(9., 9.5, vLevel) * 0.4);   // (polish 3)
        // --- the fire line where lava touches sand (kept at least a pixel tall at any range) ---
        float band = 0.22 + dist * 0.0016;
        float fl = 1. - smoothstep(0., band, hA);
        float flick = 0.6 + 0.4 * vnoise(vec2((vW.x + vW.z) * 0.35, uTime * 0.8));
        float nearFl = 0.5 + 0.5 * smoothstep(3., 22., dist);              // right under the eye the line is a glowing seam, not a white beam
        col += (uLava * (fl * fl) * 3.6 + vec3(1., 0.75, 0.3) * (fl * fl * fl * fl) * 1.2 * nearFl) * flick * uLavaGain * nearFl;
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}const fe={x0:-400,z0:-720,w:1120,d:1e3,nx:256,nz:224,range:8};async function ot(t,o){const{nx:s,nz:x}=fe,z=new Uint8Array(s*x);for(let h=0;h<x;h++){const i=fe.z0+(h+.5)/x*fe.d;for(let c=0;c<s;c++){const b=fe.x0+(c+.5)/s*fe.w,A=o.h(b,i)-o.level(b,i);z[h*s+c]=Math.round(se(A/fe.range*.5+.5,0,1)*255)}h%6===0&&await t.yield()}const g=new f.DataTexture(z,s,x,f.RedFormat,f.UnsignedByteType);return g.magFilter=g.minFilter=f.LinearFilter,g.wrapS=g.wrapT=f.ClampToEdgeWrapping,g.generateMipmaps=!1,g.needsUpdate=!0,g}function ue(t,o,s,x,z){const g=[],h=Math.sign(o-t);let i=t,c=s;for(;(o-i)*h>1e-6;)i+=c*h,(o-i)*h<0&&(i=o),g.push(i),c=Math.min(z,c*x);return g}function at(t){const o=[],s=[],x=[],z=[...ue(60,-100,6,1.3,30).reverse(),...ue(57,262,3,1,3),...ue(262,7400,4,1.27,2200)],g=[...ue(-120,6600,4,1.27,2200).reverse(),...ue(-123,-363,3,1,3),...ue(-363,-6800,4,1.27,2200)],h=z.length,i=g.length;for(let d=0;d<i;d++)for(let k=0;k<h;k++)o.push(z[k],ge,g[d]),s.push(1-I(380,1400,Math.hypot(z[k]-160,g[d]+240)));for(let d=0;d<i-1;d++)for(let k=0;k<h-1;k++){const p=d*h+k;x.push(p,p+h+1,p+1,p,p+h,p+h+1)}const c=[2,-14,-38,-80,-140,-230,-400,-900,-2500,-7400],b=[...ue(260,6600,40,1.5,2500).reverse(),...ue(276,-700,16,1,16),...ue(-700,-6800,40,1.5,2500)],A=o.length/3;for(let d=0;d<b.length;d++)for(let k=0;k<c.length;k++)o.push(t.crestX(b[d])+c[k],le,b[d]),s.push(0);for(let d=0;d<b.length-1;d++)for(let k=0;k<c.length-1;k++){const p=A+d*c.length+k;x.push(p,p+1,p+c.length+1,p,p+c.length+1,p+c.length)}const v=new f.BufferGeometry;return v.setAttribute("position",new f.Float32BufferAttribute(o,3)),v.setAttribute("aAmp",new f.Float32BufferAttribute(s,1)),v.setIndex(x),v.boundingSphere=new f.Sphere(new f.Vector3(0,0,0),10500),v}const qe=`
uniform sampler2D uH; uniform vec4 uHBox;
// sand height above the local lava level in metres (-8..8); 8 (= far from any mapped shore) outside the map
float sandRel(vec2 xz){
  vec2 uv = (xz - uHBox.xy) * uHBox.zw;
  float inside = step(0.004, uv.x) * step(uv.x, 0.996) * step(0.004, uv.y) * step(uv.y, 0.996);
  return mix(-8., (textureLod(uH, uv, 0.).r * 2. - 1.) * 8., inside);
}`,Ee=`
uniform vec2 uWhaleP, uWhaleD; uniform float uWhaleU;
float swell(vec2 p, float t){
  return 0.5 * sin(p.x * 0.045 + sin(p.y * 0.03 + t * 0.1) * 1.3 + t * 0.21) * sin(p.y * 0.038 - t * 0.17 + 1.7) + 0.22 * sin(p.x * 0.11 - p.y * 0.09 + t * 0.3);
}
vec2 whaleCo(vec2 p){ vec2 r = p - uWhaleP; return vec2(dot(r, uWhaleD), dot(r, vec2(-uWhaleD.y, uWhaleD.x))); }
float whale(vec2 p){ vec2 c = whaleCo(p); return 3.0 * uWhaleU * exp(-(c.x * c.x) / 240. - (c.y * c.y) / 34.); }
`;function st(t,o,s){return new f.ShaderMaterial({fog:!0,side:f.DoubleSide,uniforms:xe(o,{uH:{value:s},uHBox:{value:new f.Vector4(fe.x0,fe.z0,1/fe.w,1/fe.d)},uSkin:{value:new f.Color(t[4])},uSandCol:{value:new f.Color(t[0])},uZen:{value:new f.Color(t[3]).multiplyScalar(2.2)},uHor:{value:new f.Color("#66708C").multiplyScalar(.8)},uDawn:{value:new f.Color(t[5]).multiplyScalar(.6)},uWhaleP:{value:new f.Vector2(102,-290)},uWhaleD:{value:new f.Vector2(.342,-.94)},uWhaleU:{value:0},uWhaleGlow:{value:0},uOff:{value:new f.Vector2},uDelta:{value:new f.Vector3(1e5,1e5,0)}}),vertexShader:`
      attribute float aAmp;
      uniform float uTime;
      varying vec3 vW; varying vec3 vN; varying float vRel;
      #include <common>
      #include <fog_pars_vertex>
      ${qe}
      ${Ee}
      float bump(vec2 p, float k){ return (swell(p, uTime) * 0.55 + whale(p)) * k; }
      void main(){
        vec4 w = modelMatrix * vec4(position, 1.);
        float rel = sandRel(w.xz);
        float k = aAmp * (1. - smoothstep(-5., -0.5, rel));          // the skin lies still where it meets sand
        float b0 = bump(w.xz, k);
        vN = normalize(vec3(b0 - bump(w.xz + vec2(1.5, 0.), k), 1.5, b0 - bump(w.xz + vec2(0., 1.5), k)));
        w.y += b0; vW = w.xyz; vRel = rel;
        vec4 mvPosition = viewMatrix * w;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSkin, uSandCol, uZen, uHor, uDawn, uLava, uSkyUp, uSkyLow;
      uniform float uTime, uLavaGain, uWhaleGlow; uniform vec2 uOff; uniform vec3 uDelta;
      varying vec3 vW; varying vec3 vN; varying float vRel;
      #include <common>
      #include <fog_pars_fragment>
      ${ye}
      ${qe}
      ${Ee}
      float folds(vec2 p){ vec2 q = p * 0.034; return fbm3(q + vec2(vnoise(q * 1.7 + 3.1), vnoise(q * 1.7 + 7.7)) * 1.7); }
      // nearest point of a jittered grid: xy = offset from it (in cells), z = its id, w = how far inside its patch
      vec4 cell(vec2 p){
        vec2 i = floor(p), f = fract(p), bo = vec2(0.); float best = 9., sec = 9., id = 0.;
        for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
          vec2 gq = vec2(float(x), float(y)); float h = hash21(i + gq);
          vec2 o = gq + vec2(h, fract(h * 57.31)) * 0.8 + 0.1 - f; float d = dot(o, o);
          if (d < best) { sec = best; best = d; bo = o; id = h; } else if (d < sec) sec = d;
        }
        return vec4(-bo, id, sqrt(sec) - sqrt(best));
      }
      // (polish k1) FRESH SHEETS. Sheet lava grows by new sheets creeping out over the older skin: each is a low terrace of flow
      // bands (festoons a couple of metres wide, laid one behind the other as the front advanced), the seams between the newest
      // bands still open and glowing, the bands behind them cooled to dark satin, and along its front a bright creeping edge that
      // buds in lobes. One smooth field in the skin's own frame (it creeps north with the skin) says where the fresh sheets lie,
      // on both lakes, everywhere; one more fans out over the east lake from the foot of the saddle's pour (uDelta: x, z, reach).
      float tF(vec2 q){ return vnoise(q * 0.017 + 21.) * 0.62 + vnoise(q * 0.047 + 5.) * 0.38; }
      vec3 skyCol(vec3 r){
        float up = clamp(r.y, 0., 1.);
        vec3 c = mix(uHor, uZen, sqrt(up));
        float e = max(r.x, 0.); float low = 1. - up; low *= low; low *= low;
        return c + uDawn * (e * e * e) * low;
      }
      void main(){
        vec3 toCam = cameraPosition - vW; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-3);
        vec2 p = vW.xz + uOff + vec2(0., uTime * 1.0);                       // the whole skin creeps north at 1 m/s
        float rel0 = sandRel(vW.xz);
        // --- the crust: one warped field (the billows of the skin, swelling like rising bread). Its contour lines are
        //     drawn at two scales, as relief in the albedo AND the normal so they read at any view angle: draped pleats
        //     2-3 m apart and, on them, rope folds 0.3 m apart; each melts into a smooth tone before it can alias. ---
        float fB = 1. - 0.75 * smoothstep(150., 1500., dist), fM = 1. - smoothstep(30., 260., dist);
        float w0 = folds(p), wx = folds(p + vec2(0.35, 0.)), wz = folds(p + vec2(0., 0.35));
        vec2 gw = vec2(wx - w0, wz - w0) / 0.35;                       // slope of the broad billows
        float m0 = vnoise(p * 0.31 + 40.), mx = vnoise((p + vec2(0.4, 0.)) * 0.31 + 40.), mz = vnoise((p + vec2(0., 0.4)) * 0.31 + 40.);
        // the crust is laid in patches, each with its own heading: rope folds 0.3 m apart festooned across a patch
        // some 5 m wide, and draped pleats 2 m apart across fans some 17 m wide (most flow north with the skin)
        vec4 cA = cell(p * 0.2), cB = cell(p * 0.058 + 7.);
        float thA = -1.5708 + (cA.z - 0.5) * 2.8, thB = -1.5708 + (cB.z - 0.5) * 2.3;
        vec2 dA = vec2(cos(thA), sin(thA)), dB = vec2(cos(thB), sin(thB));
        vec2 lA = cA.xy * 5., lB = cB.xy / 0.058;
        float acA = dot(lA, vec2(-dA.y, dA.x)), acB = dot(lB, vec2(-dB.y, dB.x));
        float ph1 = (dot(lA, dA) + 0.17 * acA * acA) * 21. + m0 * 3.;
        float ph2 = (dot(lB, dB) + 0.035 * acB * acB) * 3.0 + m0 * 1.1 + w0 * 5. + vnoise(p * 0.5 + 12.) * 1.1 + vnoise(p * 0.13 + 7.) * 2.4;   // (polish 3: festoons bowed across each fan; the heavy warp drew smeared swirls)
        float a1 = step(0.5, fract(cA.z * 7.31)) * smoothstep(0.02, 0.22, cA.w) * (1. - smoothstep(0.3, 1.0, fwidth(ph1))) * (1. - step(9., vW.y));   // (polish 3: none on the west lake: at the entry a patch of them cut by the frame corner read as a comb)
        float a2 = (0.4 + 0.6 * step(0.4, fract(cB.z * 5.7))) * smoothstep(0.02, 0.14, cB.w) * (1. - smoothstep(0.45, 1.3, fwidth(ph2))) * (0.6 + 0.4 * smoothstep(0.3, 0.6, vnoise(p * 0.21 + 50.)));
        float s1 = sin(ph1 + 0.7), s2 = sin(ph2 + 0.7);
        // --- fresh sheets: dT = metres behind the creeping front (negative: old skin ahead of it) ---
        float t0 = tF(p); vec2 tg = vec2(tF(p + vec2(1.5, 0.)) - t0, tF(p + vec2(0., 1.5)) - t0);
        float tgl = max(length(tg), 0.006);
        float budT = vnoise(p * 0.21 + vec2(0., uTime * 0.11)) - 0.5;                          // the front buds in lobes a few metres wide
        float d1 = clamp((t0 - 0.6 + 0.03 * budT + 0.01 * sin(uTime * 0.05 + t0 * 20.)) * 1.5 / tgl, -40., 40.);
        vec2 rdl = vW.xz - uDelta.xy; float rdL = max(length(rdl), 0.5);
        float d2 = clamp(uDelta.z - rdL - 11. * (vnoise(vW.xz * 0.045 + 3.) - 0.5) - 2.6 * (vnoise(vW.xz * 0.21 + vec2(0., uTime * 0.1)) - 0.5), -40., 40.);
        float dT = max(d1, d2), isD = step(d1, d2);
        float wT = mix(1. - smoothstep(120., 380., dist), 1., isD) * (1. - smoothstep(-2.6, -1.2, rel0));   // (not on the last metre of a shore: that is the shoreline's own fire)
        vec2 tdir = mix(tg / tgl, -rdl / rdL, isD);
        float fwT = clamp(fwidth(dT), 0., 8.);
        // a free sheet is banded for its newest dozen metres (behind that it is the ordinary skin again); the pour's fan is banded all the way to its source
        float inS = smoothstep(0., 0.5 + fwT, dT) * wT * mix(1. - smoothstep(6.5, 11., dT), 1., isD);
        // flow bands some 2 to 4 m wide, never ruled: they widen and pinch along the front and bow in festoons (even rings read as a contour map)
        float bwT = 2.2 + 1.7 * vnoise(p * 0.06 + 71.);
        float bq = dT / bwT + 0.5 * vnoise(p * 0.12 + 9.) + 0.2 * vnoise(p * 0.37 + 9.), tb = fract(bq), sdT = min(tb, 1. - tb) * bwT;    // sdT: metres to the nearest seam
        float aB = (1. - smoothstep(0.25, 0.9, fwT / 2.8)) * inS;
        vec2 g = dA * cos(ph1) * 0.2 * a1 * (1. - 0.7 * inS) + dB * cos(ph2) * 0.3 * a2 * (1. - 0.7 * inS) + gw * 2.2 * fB + vec2(mx - m0, mz - m0) * 0.3 * fM - tdir * cos(6.2832 * tb) * 0.26 * aB;
        vec3 n = normalize(normalize(vN) + vec3(-g.x, 0., -g.y));
        float crease = (0.5 - 0.5 * sin(ph1)) * a1 * 0.5;                    // dark in the furrow between two ropes
        float cr2 = 0.5 - 0.5 * s2; cr2 = cr2 * cr2 * cr2;                   // (polish 3) drapery, not ripples: broad smooth crowns and narrow dark creases between them
        float shade = clamp(0.96 + 0.15 * a1 * s1 + a2 * (0.12 * s2 - 0.48 * cr2), 0.3, 1.7);
        // broad tone: patch by patch a little greyer or blacker, so the make of the skin still shows from the crest
        float blot = 0.6 + 0.45 * vnoise(p * 0.02 + 5.) + 0.5 * vnoise(p * vec2(0.0045, 0.0022) + 9.);
        float tone = (0.58 + 0.3 * blot) * (0.8 + 0.44 * vnoise(p * 0.045 + 61.)) * (0.88 + 0.24 * vnoise(p * 0.16 + 13.) * fM);   // (smooth: never a field of plates)
        // (polish 2) seen from the crest or the glide the skin is a calm satin sheet: its blotches fade with range, and its
        // make shows instead as flow lines, the contours of the billows drawn as long clean folds some 12 m apart
        float midK = smoothstep(45., 260., dist);
        tone = mix(tone, 0.8, 0.7 * midK);
        float ph3 = w0 * 52. + vnoise(p * 0.02 + 3.) * 9.;
        float a3 = (1. - smoothstep(0.3, 1.0, fwidth(ph3))) * midK * (0.4 + 0.6 * smoothstep(0.35, 0.6, vnoise(p * 0.011 + 80.)));
        shade *= 1. + 0.3 * a3 * (sin(ph3) + 0.35 * sin(2. * ph3 + 1.));
        // a fresh sheet is smoother and glassier than the old crust: each band a satin crown, a dark crease at each seam; the old skin lies in its shade just ahead of the front
        shade = mix(shade, 0.58 + 0.5 * sin(3.1416 * tb) * mix(1., 0.75 + 0.5 * vnoise(p * 0.9 + 3.), fM), 0.85 * aB) * (1. - 0.34 * smoothstep(-1.5, 0., dT) * (1. - smoothstep(0., 0.4, dT)) * wT);
        tone = mix(tone, 0.8, 0.5 * inS);
        // --- the skin: black-brown, the darkest large thing in any frame, with a dull pewter sheen only. It is rough,
        //     so it never mirrors the horizon: at a grazing angle it takes a capped share of a blur of the sky. ---
        vec3 nS = normalize(mix(normalize(vN), n, 0.45));
        float ndv = clamp(dot(nS, V), 0., 1.);
        float fr = (1. - ndv); fr = fr * fr * fr;
        vec3 col = uSkin * mix(uSkyLow, uSkyUp, n.y * 0.5 + 0.5) * 1.6 * tone * shade;
        float lean = smoothstep(0.1, 1., dot(nS, vec3(0.83, 0.5, 0.25)));   // faces of a swell that lean east take a little of the warm horizon
        vec3 pew = mix(vec3(0.036, 0.036, 0.046), vec3(0.068, 0.066, 0.08) + uDawn * 0.035, lean) * (0.45 + 0.55 * uSkyUp.b);
        float sk = clamp(uSkin.r * 110., 0.3, 1.5);                    // the world darkens the skin by scaling uSkin (first-sun look)
        float waver = mix(0.5 + 1.0 * vnoise(vW.xz * 0.03 + vec2(uTime * 0.45, -uTime * 0.3)), 1., 0.75 * smoothstep(45., 260., dist));   // a slow heat waver over the skin: its sheen comes and goes in drifting patches
        col += pew * tone * shade * sk * waver * (1. - 0.3 * midK) * 0.96 * (1. + 0.12 * inS);
        vec3 R = reflect(-V, nS); R.y = abs(R.y);
        vec3 skyR = mix(uHor, uZen, sqrt(clamp(R.y, 0., 1.))); skyR = mix(skyR, vec3(dot(skyR, vec3(0.3, 0.5, 0.2))), 0.45);   // pewter, not navy
        float e = max(R.x, 0.), e2 = e * e, low = 1. - clamp(R.y, 0., 1.); low *= low; low *= low;
        col += sk * (skyR * (0.085 + 0.3 * fr) + uDawn * (e2 * e2 * e) * low * fr * 0.45) * (0.55 + 0.45 * tone) * (0.5 + 0.5 * shade) * mix(waver, 1., 0.5) * (1. + 0.2 * inS);   // (polish 3: a dull pewter sheen on every side; looking west or north the lake was a black slab)
        float rel = rel0;                                              // per pixel: a smooth shore, not one stepped by the lake's cells
        // --- pale rafts of avalanched sand riding the skin ---
        float rf = fbm3(p * 0.05 + 11.) + 0.2 * mix(0.5, vnoise(p * 0.5), fM) - 0.1 - 0.25 * (1. - smoothstep(0.35, 0.6, vnoise(p * 0.006 + 2.)));
        float raft = smoothstep(0.735, 0.79, rf);
        vec3 raftCol = uSandCol * (mix(uSkyLow, uSkyUp, 0.9) * (0.8 + 0.3 * mix(0.5, vnoise(p * 2.1), fM)) + uLava * 0.22 * uLavaGain);   // pale sand, lit like the shore
        col = mix(col, mix(raftCol, vec3(dot(raftCol, vec3(0.33))), 0.45) * 0.6, raft * (0.2 + 0.3 * mix(0.5, smoothstep(0.3, 0.7, vnoise(p * 1.1 + 3.)), fM)));   // a dusting of sand going dark on the skin, not a pink plate
        float raftEdge = smoothstep(0.72, 0.745, rf) * (1. - smoothstep(0.745, 0.77, rf));
        // --- clefts: a few long sinuous splits that open, glow and skin over ---
        vec2 pc = p * 0.0105; pc += vec2(vnoise(pc * 2.3 + 1.7), vnoise(pc * 2.3 + 8.3)) * 0.55;
        float c = abs(fbm3(pc) - 0.5);
        float wc = 0.0035 + dist * 0.00002;
        float act = smoothstep(0.44, 0.7, vnoise(p * 0.0045 + vec2(3., uTime * 0.012)));
        float pulse = 0.55 + 0.45 * sin(uTime * 0.8 + vnoise(p * 0.012) * 14.);
        float fwc = fwidth(c);                                          // (polish 2) far off a thread thinner than a pixel dims instead of breaking into sparks
        float core = (1. - smoothstep(0., wc + fwc, c)) * wc / (wc + 0.6 * fwc);
        float halo = exp(-c / (wc * 2.5 + fwc));
        float cleft = (core * 3.4 + halo * 0.12) * act * pulse * (1. - raft);
        // (polish 2) and a finer family of the same long sinuous splits, so the skin seen from the crest is a clean dark
        // sheet drawn with a few bright threads (lines, never a field of plates); the speckle of short seams is kept to close range
        vec2 pd = p * 0.023 + 17.; pd += vec2(vnoise(pd * 1.9 + 4.), vnoise(pd * 1.9 + 9.)) * 0.6;
        float c2 = abs(fbm3(pd) - 0.5), wc2 = 0.0052 + dist * 0.00005;
        float act2 = smoothstep(0.56, 0.74, vnoise(p * 0.0085 + vec2(11., uTime * 0.014))) * (1. - smoothstep(170., 420., dist));
        float pulse2 = 0.6 + 0.4 * sin(uTime * 0.6 + vnoise(p * 0.02 + 3.) * 11.);
        float fwc2 = fwidth(c2);
        cleft += ((1. - smoothstep(0., wc2 + fwc2, c2)) * wc2 / (wc2 + 0.6 * fwc2) * 2.6 + exp(-c2 / (wc2 * 2.5 + fwc2)) * 0.1) * act2 * pulse2 * (1. - raft);
        // the whaleback splits along its spine
        vec2 wcd = whaleCo(vW.xz);
        float spine = (1. - smoothstep(0., 0.3 + dist * 0.0012 + 0.5 * vnoise(vec2(wcd.x * 0.4, 2.)), abs(wcd.y + sin(wcd.x * 0.3) * 1.2))) * (1. - smoothstep(11., 19., abs(wcd.x)));
        cleft += (spine * 2.8 + exp(-abs(wcd.y) / 1.1) * (1. - smoothstep(11., 19., abs(wcd.x))) * 0.3) * uWhaleGlow;
        // --- the shore: where lava touches sand it is always freshly open ---
        float bud = 0.5 + 0.5 * vnoise(p * 0.45 + vec2(0., uTime * 0.5));
        // (near the eye the open edge is a seam a hand wide, not a beam; far off it is kept a pixel tall)
        float ew = clamp(0.16 + dist * 0.022, 0.2, 0.95);
        float edge = smoothstep(-ew, -0.04, rel) * bud;
        float heat = smoothstep(-0.9, 0., rel) * 0.15;   // (polish 5: narrower again: over the drowned foot of the spur the skin was pink satin, like sand)   // (polish 3: a narrower hot margin; over the shallow bay by the spur the whole skin glowed pink like sand)
        // a few of the pleats are split along their furrow and glow: fire in the seams of the drapery
        float sv = 0.5 - 0.5 * sin(ph2);
        float seamM = step(0.7, fract(cB.z * 13.7)) * smoothstep(0.52, 0.72, vnoise(p * 0.3 + 31.)) * a2 * (1. - raft);
        float seam = smoothstep(0.95, 1., sv) * seamM * (0.6 + 0.4 * pulse) * (1. - smoothstep(70., 240., dist));
        float nearK = 1. - smoothstep(22., 120., dist);
        float seamN = a2 * smoothstep(0.56, 0.74, vnoise(p * 0.3 + 31.)) * (1. - raft) * nearK;
        { float oldK = 1. - 0.85 * inS; seam *= oldK; seamN *= oldK; seamM *= oldK; }        // the old crust's own furrows lie under a fresh sheet
        col *= 1. + 0.3 * nearK * (0.4 + 0.6 * shade);                                   // the folds catch the sky
        // the fresh sheet's fire: open seams between its newest bands (glowing in stretches, cooling with every band behind the front),
        // the bright creeping edge (open and yellow where it is budding, a dull red seam where it has crusted), the red flank of the newest band
        float wS = 0.055 + 0.75 * fwT;
        float heatIn = max(exp(-max(dT, 0.) / 2.4) * (1. - smoothstep(50., 150., dist)), isD * (0.3 + 0.7 * exp(-rdL / 30.)));   // (a free sheet: only its newest seam or two, and only near the eye: rings of fire inside every lobe read as a contour map)   // seams cool band by band behind a front; the pour's fan stays hot toward its source
        float segT = smoothstep(0.34, 0.6, vnoise(p * 0.19 + 44.) * 0.7 + 0.3 * vnoise(p * 0.07 + 13.)) * (0.45 + 0.75 * vnoise(p * 0.11 + 27.));   // a seam is open in stretches, shut and dark between them
        float seamT = (1. - smoothstep(0., wS, sdT)) * (0.055 + 0.2 * fwT) / wS * (3.2 * heatIn + 0.08) * segT * inS * (0.7 + 0.3 * pulse);
        float actE = 0.12 + 0.88 * smoothstep(0.36, 0.62, vnoise(p * 0.035 + vec2(7., uTime * 0.02)));
        float wE = 0.3 + 0.6 * min(fwT, 2.5);
        float edgeT = (1. - smoothstep(0., wE, abs(dT - 0.2))) * min(1., 0.5 / wE) * actE * wT * (0.75 + 0.5 * (budT + 0.5));
        float flankT = smoothstep(-0.1, 0.3, dT) * (1. - smoothstep(0.3, 2.8, dT)) * wT * actE;
        float fire = cleft + edge * edge * mix(2.6, 3.8, smoothstep(4., 30., dist)) + heat + seam * 2.7 + smoothstep(0.55, 1., sv) * seamM * 0.1;
        fire += (smoothstep(0.94, 1., sv) * 1.3 + smoothstep(0.55, 1., sv) * 0.08) * seamN * (0.55 + 0.45 * pulse) + crease * nearK * 0.12;
        col += uLava * uSkin * 7. * smoothstep(0.25, 1., sv) * seamN * (0.5 + 0.5 * s2);     // and the glow of a furrow on the pleat beside it
        col += (uLava * fire + vec3(1., 0.8, 0.35) * max(fire - 2.6, 0.) * 0.5 * smoothstep(3., 25., dist)) * uLavaGain;
        // the glow of a cleft on the skin beside it
        col += uLava * uSkin * 8. * (halo * act * pulse + heat * 2.) * tone;
        col += uLava * ((edgeT * 3.3 + seamT + flankT * 0.2) * (1. - raft * 0.7)) * uLavaGain + vec3(1., 0.8, 0.35) * max(edgeT * 3.3 - 2.3, 0.) * 0.45 * uLavaGain;
        col += uLava * uSkin * 10. * exp(min(dT, 0.) / 1.7) * (1. - smoothstep(0., 0.6, dT)) * wT * actE * tone;   // and its light on the old skin just ahead of it
        col += uLava * 0.035 * exp(-c / (wc * 5. + fwc)) * act * pulse * shade * tone * (1. - raft) * uLavaGain;   // (polish 3) the folds beside a cleft catch its light
        gl_FragColor = vec4(clamp(col, 0., 40.), 1.);
        #include <fog_fragment>
      }`})}const H={hip:[.118,.88,0],knee:[.125,.7,.21],ankle:[.12,.34,-.035],foot:[.12,.036,.04],neck:[[0,.97,.58],[0,1.085,.685],[0,1.19,.72]],head:[0,1.262,.762],tail:[0,1,2,3,4,5].map(t=>[0,.935,-.2-t*.195]),eye:[.043,1.297,.842]};class nt{constructor(){this.pos=[],this.skin=[],this.part=[],this.finUV=[],this.idx=[],this.groups=[]}get count(){return this.pos.length/3}v(o,s,x,z=0,g=0){return this.pos.push(o[0],o[1],o[2]),this.skin.push(s[0],s[1],s[2]),this.part.push(x),this.finUV.push(z,g),this.count-1}loft(o,s,x=[1,0,0],z=!0,g=!0){const h=this.count,i=o.length,c=new f.Vector3(...x),b=new f.Vector3,A=new f.Vector3,v=new f.Vector3,d=new f.Vector3;for(let k=0;k<i;k++){const p=o[Math.max(0,k-1)].p,T=o[Math.min(i-1,k+1)].p,N=o[k];b.set(T[0]-p[0],T[1]-p[1],T[2]-p[2]).normalize(),A.crossVectors(b,c).normalize(),v.crossVectors(A,b).normalize();for(let M=0;M<s;M++){const S=M/s*J,B=Math.cos(S),y=Math.sin(S),r=Math.sign(B)*Math.pow(Math.abs(B),.85),a=Math.sign(y)*Math.pow(Math.abs(y),.85);d.set(N.p[0],N.p[1],N.p[2]).addScaledVector(v,a*N.rx).addScaledVector(A,r*(B>0?N.rt:N.rb)),this.v([d.x,d.y,d.z],N.skin,N.part??0)}}for(let k=0;k<i-1;k++)for(let p=0;p<s;p++){const T=h+k*s+p,N=h+k*s+(p+1)%s,M=T+s,S=N+s;this.idx.push(T,M,N,N,M,S)}if(z){const k=this.v(o[0].p,o[0].skin,o[0].part??0);for(let p=0;p<s;p++)this.idx.push(k,h+p,h+(p+1)%s)}if(g){const k=h+(i-1)*s,p=this.v(o[i-1].p,o[i-1].skin,o[i-1].part??0);for(let T=0;T<s;T++)this.idx.push(p,k+(T+1)%s,k+T)}}tube(o,s,x,z,g=[1,0,0],h=1){this.loft(o.map((i,c)=>({p:i,rt:i[3]*h,rb:i[3]*h,rx:i[3],skin:Array.isArray(x[0])?x[c]:x,part:z})),s,g)}fin(o,s=4){const x=this.count;let z=0;for(let g=0;g<o.length;g++){const h=o[g];g&&(z+=Math.hypot(h.p[0]-o[g-1].p[0],h.p[1]-o[g-1].p[1],h.p[2]-o[g-1].p[2])),this.v(h.p,h.skin,s,z,0),this.v([h.p[0]+h.out[0]*h.len,h.p[1]+h.out[1]*h.len,h.p[2]+h.out[2]*h.len],h.skin,s,z,1)}for(let g=0;g<o.length-1;g++){const h=x+g*2;this.idx.push(h,h+1,h+2,h+1,h+3,h+2)}this.finRanges=this.finRanges||[],this.finRanges.push([x,this.count])}build(){const o=new f.BufferGeometry;o.setAttribute("position",new f.Float32BufferAttribute(this.pos,3)),o.setIndex(this.idx),o.computeVertexNormals();const s=o.attributes.normal;for(const[x,z]of this.finRanges||[])for(let g=x;g<z;g+=2){const h=new f.Vector3(this.pos[g*3+3]-this.pos[g*3],this.pos[g*3+4]-this.pos[g*3+1],this.pos[g*3+5]-this.pos[g*3+2]).normalize();s.setXYZ(g,h.x,h.y,h.z),s.setXYZ(g+1,h.x,h.y,h.z)}return o.setAttribute("aSkin",new f.Float32BufferAttribute(this.skin,3)),o.setAttribute("aPart",new f.Float32BufferAttribute(this.part,1)),o.setAttribute("aFin",new f.Float32BufferAttribute(this.finUV,2)),o}}const de=[[-1.38,.962,.006,.006,.005],[-1.26,.96,.016,.015,.012],[-1.1,.957,.026,.024,.019],[-.94,.953,.037,.034,.027],[-.78,.949,.049,.045,.036],[-.62,.944,.062,.057,.046],[-.47,.939,.076,.071,.058],[-.33,.933,.092,.09,.073],[-.2,.927,.112,.115,.094],[-.08,.922,.138,.15,.122],[.04,.92,.152,.168,.14],[.15,.922,.146,.142,.126],[.24,.92,.142,.132,.117],[.34,.912,.15,.2,.136],[.44,.908,.152,.245,.15],[.53,.92,.135,.225,.135],[.6,.955,.108,.17,.104],[.655,1.015,.082,.105,.076],[.69,1.085,.064,.074,.058],[.708,1.15,.054,.06,.049],[.722,1.205,.05,.052,.045],[.742,1.25,.052,.05,.046],[.775,1.278,.056,.05,.05],[.83,1.288,.054,.05,.05],[.885,1.282,.043,.046,.041],[.94,1.272,.031,.039,.03],[.99,1.262,.021,.03,.021],[1.03,1.254,.012,.02,.013],[1.048,1.25,.004,.008,.005]];function it(t,o){if(t<9){const s=(-.2-o)/.195+.5,x=Math.min(5,Math.floor(s));return x<0?[0,0,0]:[x===0?0:5+x,6+x,I(.2,.8,s-x)]}return t<15.5?[0,0,0]:t<17?[0,2,I(15.5,16.8,t)]:t<19?[2,3,I(17.4,18.6,t)]:t<20.8?[3,4,I(19.2,20.3,t)]:[4,5,I(20.9,22,t)]}function Fe(){const t=new nt,o=[],s=(i,c,b,A,v)=>.5*(2*c+(-i+b)*v+(2*i-5*c+4*b-A)*v*v+(-i+3*c-3*b+A)*v*v*v);for(let i=0;i<de.length-1;i++)for(let c=0;c<2;c++){const b=c*.5,A=de[Math.max(0,i-1)],v=de[i],d=de[i+1],k=de[Math.min(de.length-1,i+2)],p=[0,1,2,3,4].map(T=>s(A[T],v[T],d[T],k[T],b));o.push({r:i+b,p:[0,p[1],p[0]],rt:Math.max(.003,p[2]),rb:Math.max(.003,p[3]),rx:Math.max(.003,p[4])})}{const i=de[de.length-1];o.push({r:de.length-1,p:[0,i[1],i[0]],rt:i[2],rb:i[3],rx:i[4]})}for(const i of o)i.skin=it(i.r,i.p[2]);t.loft(o,16);const x=[],z=[];for(let i=0;i<o.length;i++){const c=o[Math.max(0,i-1)].p,b=o[Math.min(o.length-1,i+1)].p,A=o[i],v=b[1]-c[1],d=b[2]-c[2],k=Math.hypot(v,d)||1,p=[0,v/k,d/k],T=[0,p[2],-p[1]];x.push({r:A.r,p:[0,A.p[1]+T[1]*A.rt*.9,A.p[2]+T[2]*A.rt*.9],up:T,t:p,skin:A.skin}),z.push({r:A.r,p:[0,A.p[1]-T[1]*A.rb*.9,A.p[2]-T[2]*A.rb*.9],up:[0,-T[1],-T[2]],t:p,skin:A.skin})}const g=(i,c,b,A,v)=>t.fin(i.filter(d=>d.r>=c&&d.r<=b).map(d=>{const k=[0,d.up[1]-d.t[1]*v,d.up[2]-d.t[2]*v],p=Math.hypot(k[1],k[2]);return{p:d.p,out:[0,k[1]/p,k[2]/p],len:A(d.r),skin:d.skin}}));g(x,15,22.5,i=>.05+.055*Ie(i,15.5,22.5),.75),g(x,9,15,()=>.042,1.2),g(x,0,9,i=>.03+.07*I(3.5,0,i),1.5),g(z,0,9,i=>.032+.075*I(3.5,0,i),1.5),g(z,12,19.5,i=>.03+.02*Ie(i,13,17),1);for(const i of[1,-1]){const c=i>0?12:16,b=y=>[y[0]*i,y[1],y[2]],A=b(H.hip),v=b(H.knee),d=b(H.ankle),k=b(H.foot),p=(y,r,a)=>[K(y[0],r[0],a),K(y[1],r[1],a),K(y[2],r[2],a)];t.loft([[-.25,.09,.105],[.1,.128,.14],[.5,.11,.118],[.85,.074,.076],[1.02,.056,.056]].map(([y,r,a])=>({p:p(A,v,y),rt:r,rb:a,rx:.074-.03*y,skin:[c,c,1]})),10),t.loft([[-.04,.05,.052,.05],[.14,.058,.074,.054],[.34,.05,.068,.047],[.58,.035,.044,.034],[.82,.024,.028,.023],[1,.021,.024,.02]].map(([y,r,a,e])=>({p:p(v,d,y),rt:r,rb:a,rx:e,skin:[c+1,c+1,1]})),10),t.loft([[-.05,.02,.02],[.02,.027,.033],[.12,.02,.023],[.5,.0165,.02],[.86,.018,.021],[1,.025,.024]].map(([y,r,a])=>({p:p(d,k,y),rt:r,rb:a,rx:r*.95,skin:[c+2,c+2,1],part:1})),8);for(const[y,r]of[[0,.2],[.47*i,.15],[-.47*i,.145]]){const a=[Math.sin(y),0,Math.cos(y)],e=(l,u,m)=>[k[0]+a[0]*r*l,u,k[2]+a[2]*r*l,m];t.loft([e(-.08,.034,.02),e(.3,.021,.0175),e(.55,.019,.016),e(.8,.014,.0115),e(.9,.012,.008),e(1,.003,.002)].map((l,u)=>({p:l,rt:l[3],rb:l[3]*.8,rx:l[3]*1.1,skin:[c+3,c+3,1],part:u>=4?3:1})),6,[a[2],0,-a[0]])}t.tube([[d[0]-.012*i,.115,d[2]+.03,.011],[d[0]-.03*i,.09,d[2]+.012,.009],[d[0]-.042*i,.066,d[2]+.004,.003]],5,[c+2,c+2,1],3,[0,0,1]),t.fin([[A,-.2,.1,c],[A,.3,.115,c],[A,.75,.085,c],[v,.14,.07,c+1],[v,.4,.06,c+1],[v,.62,.04,c+1]].map(([y,r,a,e],l)=>{const u=y===A?v:d,m=p(y,u,r),L=u[1]-y[1],n=u[2]-y[2],w=Math.hypot(L,n),q=[0,-n/w,L/w];return{p:[m[0],m[1]+q[1]*a*.8,m[2]+q[2]*a*.8],out:[0,q[1]*.75-.66,q[2]*.75],len:.05-.004*l,skin:[e,e,1]}}));const T=[.132*i,.8,.47],N=[.152*i,.672,.385],M=[.126*i,.662,.528];t.tube([[...T,.036],[...p(T,N,.5),.032],[...N,.027]],7,[0,0,0],0,[1,0,0]),t.tube([[...N,.027],[...p(N,M,.5),.024],[...M,.017]],7,[0,0,0],0,[1,0,0]);for(const[y,r,a]of[[.012,.085,1],[-.03,.08,1.1],[-.062,.058,.9]])t.tube([[...M,.012],[M[0]-.012*i,M[1]+y*.6*a,M[2]+r*.6*a,.0085],[M[0]-.022*i,M[1]+y*a-.006,M[2]+r*a,.0025]],5,[0,0,0],3,[1,0,0]);t.fin([0,.33,.66,1].map(y=>({p:p(N,M,y),out:[.3*i,-.93,-.2],len:.085-.02*y,skin:[0,0,0]})));const S=.0225,B=(H.eye[0]-.003)*i;t.loft([-1,-.6,0,.6,1].map(y=>({p:[B+y*S*.8,H.eye[1],H.eye[2]],rt:S*Math.sqrt(1.02-y*y),rb:S*Math.sqrt(1.02-y*y),rx:S*Math.sqrt(1.02-y*y),skin:[5,5,1],part:2})),8,[0,0,1])}const h=t.build();return h.boundingSphere=new f.Sphere(new f.Vector3(0,.8,-.1),1.6),h}const Ie=(t,o,s)=>{const x=se((t-o)/(s-o),0,1);return Math.sin(x*Math.PI)};function rt(t,o,s={}){const x=[];for(let i=0;i<20;i++)x.push(new f.Matrix4);const z=new f.Color(t[0]),g=new f.Color(t[5]);return s.pale&&z.lerp(g,s.pale),s.hue&&z.offsetHSL(s.hue,0,s.light||0),{mat:new f.ShaderMaterial({fog:!0,side:f.DoubleSide,uniforms:xe(o,{uBones:{value:x},uBreath:{value:0},uBlink:{value:0},uRuffle:{value:.3},uCoat:{value:z},uBelly:{value:g},uBand:{value:new f.Color("#5A3A30")},uSpeck:{value:new f.Color("#A06C54")},uBare:{value:new f.Color("#3A2A26")},uLavaDir:{value:new f.Vector3(.75,-.6,.1).normalize()},uLavaI:{value:.9}}),vertexShader:`
      attribute vec3 aSkin; attribute float aPart; attribute vec2 aFin;
      uniform mat4 uBones[20]; uniform float uTime, uBreath, uRuffle;
      varying vec3 vRest, vRestN, vW, vN; varying float vPart; varying vec2 vFin;
      #include <common>
      #include <fog_pars_vertex>
      void main(){
        vec3 p = position;
        // breathing: the flanks swell and the belly drops a little
        float chest = smoothstep(0.08, 0.3, p.z) * (1. - smoothstep(0.5, 0.64, p.z)) * (1. - step(1.02, p.y)) * (1. - step(0.5, aPart) * step(aPart, 3.5));
        p.x *= 1. + 0.05 * uBreath * chest; p.y -= 0.012 * uBreath * chest * (1. - smoothstep(0.8, 0.95, p.y));
        // filaments lift and shiver in the wind (tips only)
        float tip = aFin.y * step(3.5, aPart);
        p += tip * vec3(0.012 * sin(uTime * 9. + aFin.x * 40.), 0.02 * uRuffle * (0.6 + 0.4 * sin(uTime * 5.3 + aFin.x * 23.)), -0.02 * uRuffle * sin(uTime * 3.1 + aFin.x * 9.));
        mat4 A = uBones[int(aSkin.x + 0.5)], B = uBones[int(aSkin.y + 0.5)];
        vec4 w = modelMatrix * mix(A * vec4(p, 1.), B * vec4(p, 1.), aSkin.z);
        vec3 n = mix(mat3(A) * normal, mat3(B) * normal, aSkin.z);
        vN = mat3(modelMatrix) * n; vRest = position; vRestN = normal; vW = w.xyz; vPart = aPart; vFin = aFin;
        vec4 mvPosition = viewMatrix * w;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uCoat, uBelly, uBand, uSpeck, uBare, uSkyUp, uSkyLow, uRakeDir, uRakeCol, uLavaLit, uLavaDir;
      uniform float uBlink, uLavaI, uLavaGain;
      varying vec3 vRest, vRestN, vW, vN; varying float vPart; varying vec2 vFin;
      #include <common>
      #include <fog_pars_fragment>
      ${ye}
      void main(){
        vec3 r = vRest; vec3 rn = vRestN / max(length(vRestN), 1e-4);
        float isFin = step(3.5, vPart), isBare = step(0.5, vPart) * step(vPart, 1.5), isEye = step(1.5, vPart) * step(vPart, 2.5), isClaw = step(2.5, vPart) * step(vPart, 3.5);
        // ragged filament edge
        float strand = 0.7 * vnoise(vec2(vFin.x * 210., 3.)) + 0.3 * vnoise(vec2(vFin.x * 700., 7.));
        if (isFin > 0.5 && vFin.y > 0.22 + 0.78 * strand) discard;
        // --- coat: rose above, pale throat and belly ---
        float neckK = smoothstep(0.99, 1.1, r.y) * (1. - smoothstep(1.2, 1.26, r.y)) * step(0.5, r.z);
        vec3 upAx = normalize(mix(vec3(0., 1., 0.), vec3(0., 0.25, -0.97), neckK));
        float under = 1. - smoothstep(-0.6, 0.05, dot(rn, upAx));
        under = max(under, (1. - smoothstep(1.245, 1.262, r.y - (r.z - 0.82) * 0.09)) * step(0.76, r.z) * step(1.2, r.y));   // lower jaw
        vec3 alb = mix(uCoat, uBelly, under * 0.9);
        // fine speckle over back and thighs
        float sp = vnoise(vec2(r.z * 120. + r.x * 53., r.y * 120. - r.x * 31.));
        alb = mix(alb, uSpeck * 0.85, smoothstep(0.6, 0.76, sp) * 0.6 * (1. - under));
        alb *= 0.9 + 0.2 * vnoise(vec2(r.z * 9. + r.x * 5., r.y * 11.));
        // six dark bands on the tail
        float bf = fract((-r.z - 0.3) / 0.168);
        float band = smoothstep(0.46, 0.56, bf) * (1. - smoothstep(0.9, 1.0, bf)) * step(r.z, -0.3) * (1. - 0.5 * under);
        alb = mix(alb, uBand, band * 0.9);
        // head: a dark stripe through the eye, the mouth line, a nostril
        float head = step(0.74, r.z) * step(1.2, r.y);
        float eyeLine = (1. - smoothstep(0.010, 0.019, abs(r.y - (1.297 + (r.z - 0.842) * 0.06)))) * smoothstep(0.75, 0.79, r.z) * (1. - smoothstep(0.95, 1.0, r.z)) * step(0.018, abs(r.x));
        float mouth = (1. - smoothstep(0.0028, 0.0062, abs(r.y - (1.2545 - (r.z - 0.82) * 0.07)))) * smoothstep(0.805, 0.83, r.z) * step(0.006, abs(r.x));
        float nostril = 1. - smoothstep(0.005, 0.009, length(vec2(r.z - 1.003, r.y - 1.266)));
        alb = mix(alb, uBand * 0.8, head * max(eyeLine * 0.9, max(mouth, nostril)));
        float eyeD = length(vec2(r.z - 0.842, r.y - 1.297));
        alb = mix(alb, uBand * 0.7, head * (1. - smoothstep(0.026, 0.036, eyeD)) * step(0.02, abs(r.x)) * (1. - isEye));   // the bead sits in a dark socket (no pale ring)
        // bare scaly shanks and toes, horn claws
        float scute = 0.8 + 0.2 * sin(r.y * 330. + r.z * 250.);
        alb = mix(alb, uBare * scute * 2.7, isBare);
        alb = mix(alb, uBare * 1.5, isClaw);
        alb = mix(alb, mix(vec3(0.012, 0.009, 0.008), uCoat * 0.8, uBlink), isEye);
        alb *= 1. - 0.25 * isFin * vFin.y;
        // --- the two lights ---
        vec3 n = normalize(vN); vec3 V = normalize(cameraPosition - vW);
        if (!gl_FrontFacing) n = -n;
        vec3 col = alb * mix(uSkyLow, uSkyUp, n.y * 0.5 + 0.5) * 1.75;
        col += alb * uRakeCol * max(dot(n, uRakeDir), 0.) * 1.6;
        float ll = clamp(dot(n, uLavaDir) * 0.8 + 0.2, 0., 1.);
        col += alb * uLavaLit * ll * ll * uLavaI * uLavaGain * 2.2;
        // soft rim of the filament coat against the sky
        float rim = 1. - clamp(dot(n, V), 0., 1.); rim = rim * rim * rim;
        col += alb * uSkyUp * rim * 0.45 * (1. - isEye);
        float rl = 1. - clamp(dot(n, V), 0., 1.);
        col += alb * uLavaLit * rl * rl * clamp(dot(n, uLavaDir) + 0.75, 0., 1.) * uLavaI * uLavaGain * 1.7 * (1. - isEye);   // the fire's rim round the far side
        // one glint in the eye
        vec3 Hh = normalize(V + normalize(vec3(0.5, 0.75, 0.2)));
        float g = clamp(dot(n, Hh), 0., 1.); g *= g; g *= g; g *= g; g *= g;
        col += vec3(0.7, 0.8, 1.0) * g * 2.2 * isEye * (1. - uBlink) + vec3(0.25, 0.3, 0.42) * rim * isEye * 0.3;
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),bones:x}}const Be=t=>K(1,3.4,I(.3,9,t)),Re=new f.Matrix4,_e=new f.Matrix4,xt=new f.Matrix4,be=new f.Matrix4,Ae=new f.Matrix4,Pe=(t,o,s,x)=>(t.makeTranslation(o[0],o[1],o[2]),x&&t.multiply(Ae.makeRotationY(x)),s&&t.multiply(Ae.makeRotationX(s)),t.multiply(Ae.makeTranslation(-o[0],-o[1],-o[2]))),Se=(t,o)=>Math.atan2(o,-t),Ne=Se(H.knee[1]-H.hip[1],H.knee[2]-H.hip[2]),De=Math.hypot(H.knee[1]-H.hip[1],H.knee[2]-H.hip[2]),lt=Se(H.ankle[1]-H.knee[1],H.ankle[2]-H.knee[2]),ke=Math.hypot(H.ankle[1]-H.knee[1],H.ankle[2]-H.knee[2]),ht=Se(H.foot[1]-H.ankle[1],H.foot[2]-H.ankle[2]),Le=Math.hypot(H.foot[1]-H.ankle[1],H.foot[2]-H.ankle[2]);function ct(t,o){const s=o.speed||0,x=I(.05,.6,s),z=I(1.5,7,s),g=o.time||0,h=o.phase||0,i=K(.62,.26,z),c=Be(s),b=Math.min(c*i*.5,.45),A=K(.09,.3,z),v=x*K(.012,.04,z)*Math.cos(2*J*h+.9),d=.055*z,k=x*.06*Math.sin(J*h),p=.07*z+.012*Math.sin(g*4.2)*(1-x),T=(1-x)*.014*Math.sin(g*.43);Re.makeTranslation(o.x,o.y,o.z).multiply(Ae.makeRotationY(o.yaw));const N=H.hip[1]+v-d;_e.makeTranslation(T,v-d,0).multiply(Pe(be,[0,.9,0],p,k)),t[0].multiplyMatrices(Re,_e),t[1].copy(t[0]);const M=o.look||0,S=.3*z+.1*(o.alert||0),B=[S*.9,S*.45,-S*.25],y=[M*.2,M*.25,M*.2];let r=t[0],a=p;for(let e=0;e<3;e++)t[2+e].multiplyMatrices(r,Pe(be,H.neck[e],B[e],y[e])),r=t[2+e],a+=B[e];t[5].multiplyMatrices(r,Pe(be,H.head,-a+.04*Math.sin(g*.9),M*.35-k));for(let e=0;e<4;e++){const l=-v*[.25,.5,.7,.85][e];t[2+e].premultiply(be.makeTranslation(0,l,0))}r=t[0];for(let e=0;e<6;e++){const l=-k*.35+x*(.035+.012*e)*Math.sin(J*h-.75-e*.55)+(1-x)*.03*Math.sin(g*.8-e*.6),u=(e===0?p*.8:0)+.012*Math.sin(g*1.3-e*.7)+v*.5*(e<3?1:.4);t[6+e].multiplyMatrices(r,Pe(be,H.tail[e],u,l)),r=t[6+e]}for(let e=0;e<2;e++){const l=e===0?1:-1,u=12+e*4,m=((h+e*.5)%1+1)%1,L=(e===0?o.groundL:o.groundR)||0;let n,w,q,P;if(m<i){const ee=m/i;n=.05+b*(1-2*ee),w=0,q=0,P=K(1.2,.42,ee)}else{const ee=(m-i)/(1-i),he=.5-.5*Math.cos(Math.PI*ee);n=.05+b*(2*he-1),w=A*Math.pow(Math.sin(Math.PI*ee),.8)+.04*z*Math.sin(Math.PI*Math.min(1,ee*2.2)),q=1.15*Math.sin(Math.PI*Math.min(1,ee*1.6))*(.5+.5*z)-.25*I(.7,1,ee),P=K(.42,1.2,he)+.22*Math.sin(Math.PI*ee)*z}n=K(l*.05+H.foot[2],n,x),w*=x,q*=x,P=K(Ne,K(Ne,P,.35+.65*z),x);const R=N,_=H.hip[2],W=R-De*Math.cos(P),D=_+De*Math.sin(P),V=H.foot[1]+w+L,G=V-W,F=n-D,O=se(Math.hypot(G,F),.16,ke+Le-.004),ae=Se(G,F)-Math.acos(se((ke*ke+O*O-Le*Le)/(2*ke*O),-1,1)),C=W-ke*Math.cos(ae),U=D+ke*Math.sin(ae),j=Math.hypot(V-C,n-U)||1,Z=Se((V-C)/j,(n-U)/j),Y=C-Le*Math.cos(Z),$=U+Le*Math.sin(Z),ne=H.hip[0]*l+T*.5,ce=(ee,he,ve,me,pe,E)=>ee.copy(Re).multiply(be.makeTranslation(ne-E[0]*l,he,ve)).multiply(Ae.makeRotationX(pe-me)).multiply(be.makeTranslation(0,-E[1],-E[2]));ce(t[u],R,_,P,Ne,H.hip),ce(t[u+1],W,D,ae,lt,H.knee),ce(t[u+2],C,U,Z,ht,H.ankle),ce(t[u+3],Y,$,-q,0,H.foot)}}function He(t,o,s,x={}){const{mat:z,bones:g}=rt(o,s,x),h=new f.Mesh(t,z);h.frustumCulled=!1,h.name=x.name||"theropod";const i={x:0,y:0,z:0,yaw:0,speed:0,phase:0,time:0,look:0};return{mesh:h,bones:g,uniforms:z.uniforms,state:i,pose(c){Object.assign(i,c),ct(g,i);const b=i.time;z.uniforms.uBreath.value=Math.sin(b*J/K(1.5,.5,I(1,8,i.speed))),z.uniforms.uBlink.value=b%4<.13?1:0,z.uniforms.uRuffle.value=.35+.65*I(0,8,i.speed)+.25*Math.sin(b*.6)}}}import{makePath as ft}from"../kit/core.js";async function kt(t,o){const s=t.anchors,x=t.dunes,z=t.heightAt,g=t.script,h={},i=(C,U,j)=>new f.Vector3(C,U,j),c=(C,U,j)=>Math.max(z(C,U),t.levelAt(C,U))+j,b=(C,U,j)=>{g.at(C,h);const Z=h.x-Math.cos(h.yaw)*U,Y=h.z+Math.sin(h.yaw)*U;return i(Z,c(Z,Y,j),Y)},A=C=>x.shore(x.crestX(C)+150,C,x.crestX(C)+15,C,0)[0],v=s.portalSeat.position,d=x.HD,k=(C,U)=>{const j=v.x-d[0]*C,Z=v.z-d[1]*C;return i(j,U??Math.max(v.y-.2126*C,c(j,Z,6.5)),Z)},p=g.sJoin,T=g.total,N=le+4.6,M=[b(-27,12,0).setY(N),b(-9,9,0).setY(N),b(9,5.5,3.5),b(30,-1.4,3.3),b(50,-4.6,2.9),b(72,-4.4,2.3),b(p-30,-2.3,1.6),b(p-6,-2.8,2.3),b(p+15,-2.5,2.6)],S=M[2].y-c(M[2].x,M[2].z,0);for(const C of[M[0],M[1]])C.setY(Math.max(C.y,c(C.x,C.z,S)));const B=Math.max(2,Math.round((T-p-14)/13));for(let C=1;C<=B;C++)M.push(b(p+15+(T-p-15)*C/B,C===B?-3:-2.4,2.3));const y=b(T+14,-1.2,3.2),r=A(y.z),a=s.lastPrint,e=i(y.x+38,0,y.z-9);e.y=c(e.x,e.z,9.5);const l=i(r+6,23,y.z-15),u=i(r+68,15,y.z-27),m=i(r+107,17.5,y.z-58),L=i(r+98,21.5,y.z-90),n=i(a.x+64,13.5,a.z+33),w=i(a.x+38,9,a.z+30),q=i(a.x+12.5,5.8,a.z+20),P=i(a.x+3.4,4.8,a.z+1.5),R=(C,U)=>{const j=v.x-d[0]*C,Z=v.z-d[1]*C;return i(j,Math.min(v.y-.2126*C,c(j,Z,U)),Z)};M.push(y,e,l,u,m,L,n,w,q,P,i(a.x+25,8.2,a.z-22),k(240,7.5),k(190,5.2),R(150,4.2),R(122,2.3),R(96,2.4),R(74,2.6),R(56,3),k(0,v.y));const _=M.indexOf(P)+1,W=M[_],D=M[_+1],V=Math.hypot(D.x-W.x,D.z-W.z);let G=-1/0;for(let C=0;;C+=.5){const U=Math.min(1,C/V);if(G=Math.max(G,c(W.x+(D.x-W.x)*U,W.z+(D.z-W.z)*U,S)),U>=1)break}W.setY(Math.max(W.y,G)),D.setY(Math.max(D.y,G));const F=2*.3,O=1.5,te=i(0,0,0),ae=C=>{const U=C.y-c(C.x,C.z,0);if(U<=0||U>=O)return U;let j=C.x,Z=C.z,Y=U*U;for(let $=U/2;$>.001;$/=2)for(let ne=!0;ne;){ne=!1;const ce=j,ee=Z;for(let he=-1;he<=1;he++)for(let ve=-1;ve<=1;ve++){const me=ce+he*$,pe=ee+ve*$,E=C.y-c(me,pe,0),X=(me-C.x)*(me-C.x)+(pe-C.z)*(pe-C.z)+E*E;X<Y&&(Y=X,j=me,Z=pe,ne=!0)}}return Math.sqrt(Y)};for(let C=0;C<3;C++){o&&await o();const U=ft(M),j=M.length-1,Z=M.map(()=>0);for(let Y=0;;Y+=.25){o&&Y%200===0&&await o();const $=Math.min(Y,U.length),ne=Math.min(j-1,Math.floor(U.curve.getUtoTmapping($/U.length)*j));if(Z[ne]=Math.max(Z[ne],F-ae(U.posAtDist($,te))),Y>=U.length)break}if(!Z.some(Y=>Y>0))break;M.forEach((Y,$)=>{const ne=Math.max(Z[$],$?Z[$-1]:0);ne>0&&Y.setY(Y.y+ne)})}return o&&await o(),M.marks={lip:y,shore:w,print:P,whale:s.whaleback,turn:m,slide:i(r,0,y.z)},M}function Mt(t,o){const s=t.script,x=(M,S,B)=>{if(M<=S[0])return B[0];for(let y=1;y<S.length;y++)if(M<=S[y])return K(B[y-1],B[y],(M-S[y-1])/(S[y]-S[y-1]));return B[B.length-1]},z=s.sJoin,g=[-40,-8,-2,20,50,z-30,z,z+25,s.total-26,s.total-9,s.total+30],h=[40,8,8,6.5,3.6,2,4.4,4.8,5,9,9],i=new f.Vector3,c={},b=[],A=[];let v=-23;for(let M=0;M<=220;M++){const S=M/220*.5;o.pointAt(S,i);let B=v,y=1e9;for(let e=v-1;e<v+14;e+=.25){s.at(e,c);const l=(c.x-i.x)*(c.x-i.x)+(c.z-i.z)*(c.z-i.z);l<y&&(y=l,B=e)}v=Math.min(B,s.sEnd);const r=v+x(v,g,h),a=r<=.02?ie*I(-18,-8,v):s.timeAtS(r);b.push(S),A.push(Math.max(a,M?A[M-1]:0))}const d=M=>o.nearestXZ(M.x,M.z).u,k=d(t.anchors.lastPrint),p=d(t.anchors.whaleback),T=[0,k-.1,k,k+.03,p+.06,1],N=[0,.5,.62,.705,.77,1];return{runTime:M=>x(se(M,0,1),b,A),heroProgress:M=>x(se(M,0,1),T,N),U:b,T:A}}const Te=[0,.08,.21,.39,.555,.62,.815,1],Ve=[0,3.5,9.5,22,27,31,38.5,45];function zt(t){t=se(t,0,1);for(let o=1;o<Te.length;o++)if(t<=Te[o])return K(Ve[o-1],Ve[o],(t-Te[o-1])/(Te[o]-Te[o-1]));return 45}const ie=1;function pt(t){const s=t.crestX(27)-137,x=se(t.shore(s,46,s,8,le)[1]-3.8,15,34),z=s-(t.crestX(x)-.3),g=e=>{const l=t.crestX(e)-.3;if(e<=8)return l;const u=(x-e)/(x-8),m=1-u;return l+z*m*Math.sqrt(m)*(1+.5*u)},h=[];for(let e=0;e<=420;e++)h.push(x-(x-8)*e/420);for(let e=8-.4;e>-236;e-=.4)h.push(e);const i=h.length-1,c=new Float32Array(i+1),b=new Float32Array(i+1),A=new Float32Array(i+1);for(let e=0;e<=i;e++)b[e]=h[e],c[e]=g(b[e]),e&&(A[e]=A[e-1]+Math.hypot(c[e]-c[e-1],b[e]-b[e-1]));let v=0;for(;v<i&&b[v]>8;)v++;let d=v;for(;d<i&&b[d]>-60;)d++;const k=2.6+(A[d]-15.05)/9,p=k+2.7,T=e=>Math.max(0,1.6*I(1,1.2,e)+7.4*I(1.6,2.6,e)-9*I(k,k+2.5,e)),N=Math.ceil((p-ie)*60),M=new Float32Array(N+1),S=new Float32Array(N+1);for(let e=1;e<=N;e++){const l=T(ie+(e-.5)/60);M[e]=M[e-1]+l/60,S[e]=S[e-1]+l/60/Be(l)}const B=(e,l)=>{const u=se(e,0,A[i]-.01);let m=Math.min(i-1,Math.floor(u/A[i]*i));for(;m<i-1&&A[m+1]<u;)m++;for(;m>0&&A[m]>u;)m--;const L=(u-A[m])/Math.max(1e-5,A[m+1]-A[m]);return l.x=K(c[m],c[m+1],L),l.z=K(b[m],b[m+1],L),l.yaw=Math.atan2(c[m+1]-c[m],b[m+1]-b[m]),e<0&&(l.x+=Math.sin(l.yaw)*e,l.z+=Math.cos(l.yaw)*e),l},y={x:0,z:0,yaw:0},r=[];for(let e=1,l=1;e<=N;e++)for(;S[e]>=l*.5;){const u=(l*.5-S[e-1])/Math.max(1e-6,S[e]-S[e-1]);r.push({n:l,t:ie+(e-1+u)/60,s:K(M[e-1],M[e],u),v:T(ie+(e-1+u)/60)}),l++}const a=B(.5,y).yaw-Math.PI*.3;return{total:M[N],at:B,footfalls:r,sJoin:A[v],sEnd:A[i],RUN_T1:p,timeAtS(e){if(e<=0)return ie;if(e>=M[N])return p;let l=0,u=N;for(;u-l>1;){const m=l+u>>1;M[m]<e?l=m:u=m}return ie+(l+(e-M[l])/Math.max(1e-6,M[u]-M[l]))/60},stateAt(e,l={}){const u=se((e-ie)*60,0,N),m=Math.min(N-1,Math.floor(u)),L=u-m,n=K(M[m],M[m+1],L);B(n,y),l.s=n,l.phase=K(S[m],S[m+1],L),l.speed=T(se(e,ie,p)),l.x=y.x,l.z=y.z,l.y=t.h(y.x,y.z);const w=y.yaw<0?y.yaw+J:y.yaw;return l.turn=I(p-1.5,p-.1,e),l.yaw=K(a<0?a+J:a,w,I(ie,ie+.95,e))-l.turn*Math.PI*.44,l}}}function Ce(t,o,s){const z=Math.floor(t/1.35),g=t/1.35-z,h=i=>{const c=Math.sin(i*127.1+o*311.7)*43758.5453;return(c-Math.floor(c))*2-1};return K(h(z),h(z+1),I(.86,1,g))*s}async function ut(t,o,s,x){const z=[],g=new f.Vector3,h=(v,d,k,p)=>{o.normal(v,d,g);const T=Math.hypot(g.x,g.z)||1;z.push({x:v,z:d,y:k,ang:Math.atan2(-g.x/T,-g.z/T)+s.range(-.35,.35),size:p})},i=Math.round(x*.36),c=Math.round(x*.3),b=Math.round(x*.1),A=x-i-c-b;for(let v=0;v<i;v++){const d=(v+s())/i,k=d<.55?K(-178,-272,d/.55):K(-105,-338,(d-.55)/.45),p=o.crestX(k),[T]=o.shore(p+150,k,p+15,k,0);h(T,k,0,s.range(1,1.9)),v%25===24&&await t.yield()}for(let v=0;v<c;v++){v%25===24&&await t.yield();const d=K(70,330,(v+s())/c);let k=o.spurZ(d)+60;for(;k<-240&&o.h(d,k)>0;)k+=3;const p=o.shore(d,k,d,k-3,0);h(p[0],p[1],0,s.range(1.3,2.7))}for(let v=0;v<b;v++){const d=(v+s())/b*J,k=o.ISLET.x+Math.cos(d)*34,p=o.ISLET.z+Math.sin(d)*34;if(o.h(k,p)>0){h(o.ISLET.x+Math.cos(d)*60,o.ISLET.z+40,0,1),z[z.length-1].size=0;continue}const T=o.shore(k,p,o.ISLET.x,o.ISLET.z,0);h(T[0],T[1],0,s.range(.8,1.8))}for(let v=0;v<A;v++){const d=K(125,-70,(v+s())/A),k=o.crestX(d),[p]=o.shore(k-330,d,k-30,d,le);h(p,d,le,s.range(1,2.6)),v%25===24&&await t.yield()}return z}async function dt(t,o,s,x,z,g,h){const b=[],A=[];for(let a=0;a<=5;a++)for(let e=0;e<14;e++){const l=a/5*Math.PI*.5,u=e/14*J,m=Math.cos(l),L=m*Math.cos(u);b.push(m*Math.sin(u)*.8*(1-.22*L),Math.pow(Math.sin(l),.62)*.46-.05,L*(L>0?.78:.55))}for(let a=0;a<5;a++)for(let e=0;e<14;e++){const l=a*14+e,u=a*14+(e+1)%14;A.push(l,u,l+14,u,u+14,l+14)}const v=new f.BufferGeometry;v.setAttribute("position",new f.Float32BufferAttribute(b,3)),v.setIndex(A),v.computeVertexNormals();const d=await ut(t,o,s,g),k=a=>Math.abs(a-oe)<23;for(const a of d)a.y===0&&a.x<120&&k(a.z)&&(a.size=0);if(h)for(const a of d)Math.abs(a.z-h.z-3)<7.5&&Math.abs(a.x-h.x)<14&&(a.size=0);const p=new f.Vector3,T=(a,e,l,u)=>{o.normal(a,e,p);const m=Math.hypot(p.x,p.z)||1,L=.4*u;d.push({x:a+p.x/m*L,z:e+p.z/m*L,y:l,ang:Math.atan2(-p.x/m,-p.z/m)+s.range(-.3,.3),size:u,old:!0})};let N=0;for(let a=-100;a>-345;a-=s.range(1.15,1.6)){if(k(a)||h&&Math.abs(a-h.z)<1.5)continue;const e=o.crestX(a),[l]=o.shore(e+150,a,e+15,a,0);T(l,a,0,s.range(1.5,2.3)),++N%30===0&&await t.yield()}for(let a=70;a<330;a+=s.range(1.8,2.5)){let e=o.spurZ(a)+60;for(;e<-240&&o.h(a,e)>0;)e+=3;const l=o.shore(a,e,a,e-3,0);T(l[0],l[1],0,s.range(1.8,3)),++N%30===0&&await t.yield()}for(let a=0;a<38;a++){const e=(a+s())/38*J,l=o.ISLET.x+Math.cos(e)*34,u=o.ISLET.z+Math.sin(e)*34;if(o.h(l,u)>0)continue;const m=o.shore(l,u,o.ISLET.x,o.ISLET.z,0);T(m[0],m[1],0,s.range(1.2,2))}for(const a of o.ISLETS){const e=Math.round(a.L*2.6);for(let l=0;l<e;l++){const u=(l+s())/e*J,m=Math.cos(u)*(a.L*1.15+14),L=Math.sin(u)*44,n=a.x+a.ax[0]*m+a.lee[0]*L,w=a.z+a.ax[1]*m+a.lee[1]*L,q=s.range(1.3,2.4),P=a.x+a.ax[0]*m*.55,R=a.z+a.ax[1]*m*.55;if(o.h(n,w)>0||o.h(P,R)<=0)continue;const _=o.shore(n,w,P,R,0);T(_[0],_[1],0,q)}await t.yield()}{const a=o.crestX(27)-152,e=30;for(const l of d)l.y===le&&Math.hypot(l.x-a,l.z-e)<15&&(l.size=0)}h&&d.push({...h,special:!0}),await t.yield();const M=new f.InstancedBufferGeometry;M.index=v.index,M.attributes.position=v.attributes.position,M.attributes.normal=v.attributes.normal;const S=new Float32Array(d.length*4),B=new Float32Array(d.length*3);d.forEach((a,e)=>{S.set([a.x,a.y,a.z,a.ang],e*4),B.set([a.size,s(),a.special?-1:a.old?0:s.range(9,16)],e*3)}),M.setAttribute("aA",new f.InstancedBufferAttribute(S,4)),M.setAttribute("aB",new f.InstancedBufferAttribute(B,3)),M.instanceCount=d.length,M.boundingSphere=new f.Sphere(new f.Vector3(100,10,-150),500);const y=new f.ShaderMaterial({fog:!0,uniforms:xe(z,{uSkin:{value:new f.Color(x[4])},uHor:{value:new f.Color("#66708C").multiplyScalar(.62)},uToeU:{value:0}}),vertexShader:`
      attribute vec4 aA; attribute vec3 aB;
      uniform float uTime, uToeU;
      varying vec3 vW, vN, vL; varying float vHeat, vSeed;
      #include <common>
      #include <fog_pars_vertex>
      void main(){
        float old = 1. - step(0.001, abs(aB.z));                       // 1 = a lobe of the standing rank
        float ph = aB.z < 0. ? 0.12 + uToeU * 0.4 : fract(uTime / max(aB.z, 1.) + aB.y);
        ph = mix(ph, 0.8, old);
        float grow = smoothstep(0., 0.5, ph), die = mix(1. - smoothstep(0.88, 1., ph), 1., old);
        vec3 p = position; vL = p;
        p.z += (grow - 1.0) * 0.5;
        float tall = mix(1.1, 1.2 + 0.5 * aB.y, old) * (1. + 0.05 * old * sin(uTime * 0.5 + aB.y * 40.));   // old lobes stand high and breathe
        p *= aB.x * (0.3 + 0.7 * grow) * vec3(1., die * (0.75 + 0.25 * grow) * tall, 1.);
        float c = cos(aA.w), s = sin(aA.w);
        vec3 w = vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z) + aA.xyz;
        w.y -= (1. - die) * 0.3;
        vN = vec3(c * normal.x + s * normal.z, normal.y * 1.2, -s * normal.x + c * normal.z);
        vHeat = aB.z < 0. ? mix(1., 0.66, uToeU) : mix((1. - smoothstep(0.1, 0.85, ph)) * die, 0.04 + 0.1 * aB.y, old);
        vSeed = aB.y;
        vec4 wp = modelMatrix * vec4(w, 1.); vW = wp.xyz;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSkin, uHor, uLava, uSkyUp, uSkyLow; uniform float uLavaGain, uTime;
      varying vec3 vW, vN, vL; varying float vHeat, vSeed;
      #include <common>
      #include <fog_pars_fragment>
      ${ye}
      void main(){
        vec3 n = normalize(vN); vec3 V = normalize(cameraPosition - vW);
        float heat = clamp(vHeat, 0., 1.), sd = clamp(vSeed, 0., 1.) * 37.;
        vec2 q = vL.xz;
        // the crust: rope wrinkles bowed toward the nose, and two or three cracks
        float wob = vnoise(q * 4.2 + sd);
        // (polish k1) no two pillows wear the same rings: each has its own rope spacing and its own centre, its ropes lie in patches
        // with smooth skin between, and its crown has broad dents (every one wore the same 44 rings: a repeated texture on a plain blob)
        float sdn = clamp(vSeed, 0., 1.), sd2 = fract(sdn * 7.31);
        float ph = length(vec2(q.x * 0.85 + (sd2 - 0.5) * 0.5, q.y + 0.62 + (sdn - 0.5) * 0.4)) * mix(27., 50., sd2) + wob * mix(5., 10., sdn) + sd;
        float aR = (1. - smoothstep(0.5, 1.6, fwidth(ph))) * smoothstep(0.34, 0.6, vnoise(q * 1.9 + sd * 1.7 + 3.));
        float sR = sin(ph);
        float up = clamp(n.y, 0., 1.);
        float top = smoothstep(0.3, 0.85, n.y);
        float shade = (1. + 0.32 * aR * sR * (0.4 + 0.6 * top)) * (0.86 + 0.3 * vnoise(q * 1.5 + sd * 2.3 + 11.));
        float ck = abs(vnoise(q * 2.7 + sd + 9.) - 0.5);
        float cw = 0.005 + 0.75 * fwidth(ck);
        float crack = (1. - smoothstep(0., cw, ck)) * smoothstep(0.03, 0.15, vL.y);
        float ndv = clamp(dot(n, V), 0., 1.), fr = (1. - ndv); fr = fr * fr * fr;
        // black-brown skin with the lake's dull pewter on what faces the sky; no mirror
        vec3 col = (uSkin * mix(uSkyLow, uSkyUp, n.y * 0.5 + 0.5) * 1.6 + vec3(0.062, 0.062, 0.074) * (0.16 + 1.1 * up * up) * uSkyUp.b + uHor * (0.07 + 0.2 * fr) * up) * shade;
        // what glows: the nose and the underside of a young lobe, dull red round the flank of an old one; the crown
        // skins over first and only its furrows and cracks stay lit
        float nose = smoothstep(-0.15, 0.6, vL.z);
        float low = 1. - smoothstep(0.03, 0.2, vL.y);
        float h2 = heat * heat;
        float flank = 1. - smoothstep(0.2, 0.72, n.y);                 // the sides of a pillow stay dull red long after its crown is black
        float crust = top * (1. - 0.3 * h2);
        float body = 0.03 + 0.3 * flank + 0.2 * low + 3.0 * h2 * (0.25 + 0.75 * nose) * (0.3 + 0.7 * (1. - up));
        float glow = body * (1. - 0.94 * crust) * (0.8 + 0.25 * wob);
        glow += (0.5 - 0.5 * sR) * aR * top * heat * 0.3;                    // fire in the furrows between the ropes
        glow += crack * (0.12 + 0.5 * step(0.6, fract(sd * 3.3)) + 2.6 * heat) * (0.55 + 0.45 * sin(uTime * 0.4 + sd));
        float seam = (1. - smoothstep(0.0, 0.07, vL.y + 0.03)) * (0.45 + 0.55 * heat) * 2.4;
        float fire = glow + seam;
        vec3 hotCol = mix(vec3(0.8, 0.07, 0.0), uLava, clamp(heat * 1.2 + 0.3 * crack + 0.2 * (1. - top), 0., 1.));
        col += (mix(hotCol, uLava, clamp(seam, 0., 1.)) * fire + vec3(1., 0.8, 0.35) * max(fire - 2.2, 0.) * 0.6) * uLavaGain;
        gl_FragColor = vec4(clamp(col, 0., 40.), 1.);
        #include <fog_fragment>
      }`}),r=new f.Mesh(M,y);return r.name="toes",r.frustumCulled=!1,r}const oe=-250,Ge=`
// (polish 5) SLOW GLOWING CLOTH: smooth drapery, festooned, each lane of the pour folding on its own beat, the folds of
// several lengths and heights, over the broad swellings of the pour itself. No cubed crowns (they stood on the 32 degree face
// as ruled terraces). -> (relief in metres, c: 0 in the crease .. 1 on the crown, rope sheaf 0..1)
vec3 tFold(float a, float s, float fine, float kf, float hw){
  float w = vnoise(vec2(a * 1.6, s * 0.09)) * 2.4 + vnoise(vec2(a * 4., s * 0.23)) * 0.8;
  float lane = vnoise(vec2(a * 2.1 + 5., 1.7)) * 6. + vnoise(vec2(a * 5.3 + 1., s * 0.04)) * 2.5;
  float ph = s * 1.5 * kf + w * 2.0 + lane;
  float c = 0.5 + 0.5 * sin(ph + 0.5 * sin(ph + 0.8));                 // a rounded crown a little broader than the crease
  float amp = 0.3 + 0.7 * vnoise(vec2(a * 1.3 + 3., s * 0.07));       // some folds stand tall, some lie flat
  float grp = smoothstep(0.3, 0.62, vnoise(vec2(a * 1.5 + 9., s * 0.21)));
  float mid = 0.5 + 0.5 * sin(s * 4.4 * kf + w * 4. + lane * 1.7 + 2.4 * a * a);
  float rope = (0.5 + 0.5 * sin(s * 13. + w * 9. + lane * 3. + 5. * a * a)) * grp;
  float bil = vnoise(vec2(a * 1.25 + 2., s * 0.055)) + 0.5 * vnoise(vec2(a * 2.7 + 8., s * 0.13));
  return vec3((0.4 * c * amp + 0.06 * mid * (0.4 + 0.6 * grp)) / sqrt(kf) + 0.4 * bil + 0.008 * rope * fine * c, c, rope);
}
// a: across -1..1, d: metres down the flow, hw: half width here, dn: 0 lake .. 1 foot
// (polish 5) Transverse folds on a 32 degree face read as terraces, so the steep part of the pour is shaped ALONG the flow, as
// a real overflow is: a stream down its middle, sunk between two raised levees of older crust, fluted lengthwise; the folds
// (festoons across the flow) come only where the pour slows and spreads at the foot. -> (relief m, c, rope)
float tStream(float a, float d){ float ac = a - (vnoise(vec2(d * 0.045, 3.1)) - 0.5) * 0.8 * clamp(1. - a * a, 0., 1.); return ac; }
vec3 tRelief(float a, float d, float t, float rel, float fine, float hw, float dn){
  float edge = clamp(1. - a * a, 0., 1.);
  float foot = smoothstep(0.76, 0.93, dn);                             // (the face ends and the fan on the lake begins at about 0.86)
  float kf = mix(0.6, 1.3, foot);
  vec3 f = tFold(a, d - t * 0.55 - min(0.7 * hw, 9.) * edge, fine, kf, hw);
  float ac = tStream(a, d), ch = exp(-ac * ac / 0.15), lv = abs(ac) - 0.66;
  float flute = vnoise(vec2(a * 7., (d - t * 0.55) * 0.045)) - 0.5;
  float along = (-0.85 * ch + 0.75 * exp(-lv * lv / 0.035) + 0.4 * flute) * (1. - foot) * smoothstep(-8., 5., d - uLip);
  return vec3((f.x * mix(0.1, 1., foot) + along) * edge * rel, f.y, f.z);
}`;async function vt(t,o,s,x){const h=[],i=[],c=[],b=[],A=o.crestX(oe),v=A-24,d=o.shore(A+150,oe,A+5,oe,-.2)[0]+9,k=d-A;let p=0,T=v,N=le,M=0;for(let u=0;u<=280;u++){u%20===19&&await t.yield();const m=u/280,L=K(v,d,m*m*.3+m*.7),n=L-A,w=se(n/k,0,1),q=9+2.6*(1-I(-3,19,n))*I(-26,-12,n)+5.5*I(.1,.45,w)-2*Math.sin(Math.PI*se(w*1.5,0,1))+11*I(.62,1,w)+2*(1-I(-24,-10,n)),P=F=>.1*Math.abs(Math.sin(p*.55+F))+.03*Math.abs(Math.sin(p*1.3+F*2)),R=I(2,9,n),_=q*(1+R*(.27*Math.sin(m*11.3+1.3)+.11*Math.sin(m*27+.4)+P(.7))),W=q*(1+R*(.27*Math.sin(m*9.1+4.1)+.11*Math.sin(m*23+2.2)+P(2.9))),D=oe+(2.5*Math.sin(m*2.4)+3.6*Math.sin(n*.21+.6))*I(0,9,n),V=Math.max(o.h(L,D),L<A?le-.5:ge-.3);u&&(p+=Math.hypot(L-T,V-N)),T=L,N=V,n<0&&(M=p);const G=2*Math.exp(-(n-1)*(n-1)/34)+1*Math.exp(-(n+9)*(n+9)/70);for(let F=0;F<=44;F++){const O=F/44*2-1,te=D+O*(O<0?_:W),ae=Math.max(o.h(L,te),L<A?le-.5:ge+.34),C=Math.pow(Math.max(0,1-O*O),.45),U=.72+.2*Math.sin(O*6.3+1.1+n*.35)+.16*Math.sin(O*13.7+4.2-n*.5)+.1*Math.sin(O*23+n*.8),j=(1.15-.6*I(.75,1,w))*C*I(0,.06,m)+G*U*Math.max(0,1-O*O);h.push(L,ae+j-.12,te),i.push(O,p),b.push(O<0?_:W,I(.02,.12,m)*(1-.75*I(.8,1,w)))}}for(let u=0;u<280;u++)for(let m=0;m<44;m++){const L=u*45+m;c.push(L,L+1,L+44+1,L+1,L+44+2,L+44+1)}const S=new Float32Array(h.length),B=new Float32Array(h.length),y=45,r=new f.Vector3;await t.yield();for(let u=0;u<=280;u++)for(let m=0;m<=44;m++){const L=(u*y+m)*3,n=Math.max(0,u-1),w=Math.min(280,u+1),q=Math.max(0,m-1),P=Math.min(44,m+1),R=(w*y+m)*3,_=(n*y+m)*3,W=(u*y+P)*3,D=(u*y+q)*3;r.set(h[R]-h[_],h[R+1]-h[_+1],h[R+2]-h[_+2]),r.lengthSq()<1e-8&&r.set(1,0,0),r.normalize(),S[L]=r.x,S[L+1]=r.y,S[L+2]=r.z,r.set(h[W]-h[D],h[W+1]-h[D+1],h[W+2]-h[D+2]),r.lengthSq()<1e-8&&r.set(0,0,1),r.normalize(),B[L]=r.x,B[L+1]=r.y,B[L+2]=r.z}const a=new f.BufferGeometry;a.setAttribute("position",new f.Float32BufferAttribute(h,3)),a.setAttribute("uv",new f.Float32BufferAttribute(i,2)),a.setAttribute("aAl",new f.BufferAttribute(S,3)),a.setAttribute("aAc",new f.BufferAttribute(B,3)),a.setAttribute("aHw",new f.Float32BufferAttribute(b,2)),await t.yield(),a.setIndex(c),a.computeVertexNormals(),await t.yield();const e=new f.ShaderMaterial({fog:!0,side:f.DoubleSide,transparent:!0,uniforms:xe(x,{uSkin:{value:new f.Color(s[4])},uHor:{value:new f.Color("#66708C").multiplyScalar(.62)},uLen:{value:p},uLip:{value:M}}),vertexShader:`
      attribute vec3 aAl, aAc; attribute vec2 aHw;
      uniform float uTime, uLen, uLip;
      varying vec3 vW, vN, vAl, vAc; varying vec2 vUv, vHw;
      #include <common>
      #include <fog_pars_vertex>
      ${ye}
      ${Ge}
      void main(){
        vUv = uv; vHw = aHw;
        vN = normalize(mat3(modelMatrix) * normal); vAl = mat3(modelMatrix) * aAl; vAc = mat3(modelMatrix) * aAc;
        vec3 p = position + normal * tRelief(uv.x, uv.y, uTime, aHw.y, 0., max(aHw.x, 1.), clamp(uv.y / max(uLen, 1.), 0., 1.)).x;
        vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz;
        vec4 mvPosition = viewMatrix * w;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSkin, uHor, uLava, uSkyUp, uSkyLow, uRakeDir, uRakeCol; uniform float uLavaGain, uTime, uLen, uLip;
      varying vec3 vW, vN, vAl, vAc; varying vec2 vUv, vHw;
      #include <common>
      #include <fog_pars_fragment>
      ${ye}
      ${Ge}
      void main(){
        float a = clamp(vUv.x, -1., 1.), d = max(vUv.y, 0.), rel = clamp(vHw.y, 0., 1.), hw = max(vHw.x, 1.);
        vec3 V = normalize(cameraPosition - vW);
        float dist = length(cameraPosition - vW);
        // the folds' own slopes -> normal (the same function that displaced the vertices)
        float fineK = 1. - smoothstep(25., 70., dist);
        float dn = clamp(d / max(uLen, 1.), 0., 1.);
        vec3 f0 = tRelief(a, d, uTime, rel, fineK, hw, dn);
        float h0 = f0.x, hA = tRelief(a + 0.012, d, uTime, rel, fineK, hw, dn).x, hD = tRelief(a, d + 0.06, uTime, rel, fineK, hw, dn).x;
        float lodN = 1. - 0.6 * smoothstep(60., 200., dist);
        vec3 n = normalize(normalize(vN) - normalize(vAl + vec3(1e-5, 0., 0.)) * ((hD - h0) / 0.06) * lodN - normalize(vAc + vec3(0., 0., 1e-5)) * ((hA - h0) / (0.012 * hw)) * lodN);
        float s = d - uTime * 0.55 - min(0.7 * hw, 9.) * clamp(1. - a * a, 0., 1.);
        float c = f0.y, rope = f0.z;                                     // c: 0 in the crease, 1 on the crown
        float grp = smoothstep(0.3, 0.62, vnoise(vec2(a * 1.5 + 9., s * 0.21)));
        float ndv = clamp(dot(n, V), 0., 1.), fr = 1. - ndv; fr = fr * fr * fr;
        float up = clamp(n.y, 0., 1.);
        float below = max(d - uLip, 0.);                                 // metres down the face from the brink
        // (polish 5) SLOW GLOWING CLOTH. The crust is black-brown satin: a pewter sheen on whatever looks at the sky, the dawn's
        // rake on east-leaning crowns, fine ropes close to the eye. The fire is no longer a ruled line in every crease (that
        // drew a contour map): the pour has a HEAT of its own, highest where it comes over the brink and down its fast middle,
        // in drifting patches, and where it is hot the creases gape: a wide soft glow up the flanks of the fold, deep red at
        // its edge through orange to a yellow core. Where it is cool a crease is only a dull red breath, or dark.
        vec3 sky = mix(uSkyLow, uSkyUp, n.y * 0.5 + 0.5);
        vec3 crustC = uSkin * sky * 1.7 + vec3(0.04, 0.05, 0.085) * (0.1 + 1.3 * up * up) * uSkyUp.b + uHor * 0.3 * fr;
        crustC += vec3(0.05, 0.045, 0.05) * uRakeCol * 0.9 * max(dot(n, uRakeDir), 0.);
        crustC *= mix(1., 0.45 + 0.55 * smoothstep(0.0, 0.5, c), smoothstep(0.76, 0.93, dn)) * (0.92 + 0.14 * rope * fineK);
        // the stream: open lava running down the sunk middle of the steep part, brightest where it comes over the brink,
        // dark rafts of skin drawn out along it and gathering downstream until it closes over at the foot
        float foot = smoothstep(0.76, 0.93, dn);
        float ac = tStream(a, d), chan = exp(-ac * ac / 0.15);
        float over = smoothstep(-13., 1., d - uLip);                     // welling up through the heap at the lip
        float heat = (0.36 + 0.44 * exp(-below / 26.) + 0.35 * exp(-below / 6.)) * over;
        float raftN = vnoise(vec2(ac * 6. + 2., s * 0.065)) * 0.6 + vnoise(vec2(ac * 15. + 9., s * 0.2)) * 0.4;
        float skin = smoothstep(0.4, 0.5, raftN + 0.3 * smoothstep(3., 34., below) - 0.3 * exp(-below / 12.) + 0.5 * smoothstep(0.35, 0.8, abs(ac)));
        float stri = 0.7 + 0.6 * vnoise(vec2(ac * 21., s * 0.3));       // fine streaks drawn out down the flow
        float stream = smoothstep(0.4, 0.85, chan) * (1. - smoothstep(0.8, 0.95, dn));
        float T = stream * heat * (1. - 0.96 * skin) * stri * (0.6 + 0.5 * exp(-ac * ac / 0.018));   // a hotter thread down the very middle
        // on the levees: a few long tears where the old crust is pulled thin; at the foot: fire in the creases of the folds,
        // in broken lines, dying as the pour fans into the lake's skin
        float crack = (1. - smoothstep(0.012, 0.05, abs(vnoise(vec2(a * 5. + 3., d * 0.07)) - 0.5))) * smoothstep(2., 8., below) * (1. - smoothstep(0.55, 0.8, dn)) * (0.3 + 0.7 * vnoise(vec2(d * 0.4, a * 3.)));
        float brk = smoothstep(0.3, 0.66, vnoise(vec2(a * 3.3, s * 0.27)));
        float crease = (1. - smoothstep(0., 0.22, c)) * brk * foot * (1. - smoothstep(0.9, 0.99, dn)) * over;
        T = max(T, max(crack * 0.5, crease * (0.42 + 0.3 * chan)));
        crustC *= 1. - 0.35 * (1. - foot) * smoothstep(0.2, 0.6, chan);   // the walls of the stream's bed are in their own shadow
        // the margin: where the pour touches sand it is freshly open, in beads, along the steep part
        float lobeE = smoothstep(0.93, 0.995, abs(a)) * (0.3 + 0.7 * smoothstep(0.35, 0.7, vnoise(vec2(d * 0.45, a * 2.)))) * (1. - smoothstep(0.72, 0.92, dn)) * smoothstep(1., 6., d - uLip);
        T = max(T, lobeE * 0.6);
        vec3 glow = vec3(0.42, 0.03, 0.008) * smoothstep(0., 0.22, T) + uLava * 1.25 * smoothstep(0.14, 0.5, T) + vec3(1., 0.62, 0.2) * 1.1 * smoothstep(0.5, 1.0, T);   // (never a white-out: the newest lava is HDR 3)
        vec3 col = crustC * (1. - 0.8 * smoothstep(0.1, 0.5, T)) + glow * uLavaGain;
        col += vec3(0.6, 0.09, 0.02) * 0.14 * heat * exp(-max(abs(ac) - 0.3, 0.) / 0.16) * (1. - foot) * (1. - smoothstep(0.1, 0.5, T)) * uLavaGain;   // the stream's light on the walls of its bed
        col += vec3(0.5, 0.06, 0.015) * 0.1 * foot * (1. - c) * (1. - smoothstep(0.8, 0.97, dn)) * uLavaGain;      // and the creases' light on the flanks of the folds
        float alpha = (1. - smoothstep(0.92, 0.995, dn)) * (1. - smoothstep(0.8, 1., abs(a)) * smoothstep(0.8, 0.93, dn));
        gl_FragColor = vec4(clamp(col, 0., 40.), alpha);
        #include <fog_fragment>
      }`}),l=new f.Mesh(a,e);return l.name="tongue",{mesh:l,foot:new f.Vector3(d-9,0,oe),lip:new f.Vector3(A,o.h(A,oe)+.9,oe)}}const Ue=`
      varying vec2 vQ; varying float vSoft, vDist;
      float toe(vec2 p, float ang, float len){
        vec2 d = vec2(sin(ang), cos(ang)), h = vec2(0., -0.34);
        float t = clamp(dot(p - h, d), 0.1, len);
        return length(p - h - d * t) - mix(0.075, 0.03, t / len);
      }
      void main(){
        vec2 p = vQ;
        float d = min(min(toe(p, 0., 0.82), toe(p, 0.47, 0.62)), min(toe(p, -0.47, 0.6), length(p - vec2(0., -0.27)) - 0.085));
        float fade = 1. - smoothstep(70., 150., vDist);
        if (vSoft > 1.5) {                                              // a slump below a fresh print: a soft spindle of loosened grains down the fall line
          float e = length(vec2(p.x * 3.4, p.y * 2.05)); float sc = (1. - smoothstep(0.35, 1., e)) * (0.5 + 0.5 * smoothstep(-0.5, 0.2, p.x * 2. + p.y)) * (1. - smoothstep(110., 260., vDist));
          gl_FragColor = vec4(mix(vec3(1.), vec3(0.6, 0.6, 0.7), sc * 0.75), 1.); return; }
        float dent = (1. - smoothstep(-0.025, 0.02 + vSoft * 0.07, d)) * (1. - 0.45 * vSoft) * fade;
        float rim = smoothstep(0.0, 0.05, d) * (1. - smoothstep(0.05, 0.14, d)) * (1. - vSoft) * fade;
        vec3 c = mix(vec3(1.), vec3(0.46, 0.5, 0.62), dent) * (1. + 0.16 * rim);
        gl_FragColor = vec4(c, 1.);
      }`,Ke=`
      uniform vec3 uSand, uSkyUp, uLavaLit; varying vec2 vQ; varying float vAge;
      #include <common>
      #include <fog_pars_fragment>
      ${ye}
      void main(){
        float r = length(vQ);
        float a = (1. - smoothstep(0.25, 1., r)) * (0.55 + 0.45 * vnoise(vQ * 3. + vAge * 2.)) * (1. - vAge) * (1. - vAge) * 0.5;
        vec3 col = uSand * (uSkyUp * 0.75 + uLavaLit * 0.12 * (0.5 - 0.5 * vQ.y));
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`;function mt(t,o,s,x,z,g){const h=[],i=[],c=[],b=new f.Vector3,A=(r,a,e,l,u,m)=>{t.normal(r,a,b),h.push(r,t.h(r,a),a,e),i.push(b.x,b.y,b.z,m),c.push(l,u)},v=.27,d=(r,a,e,l,u,m,L,n=v,w={})=>{const q=Math.hypot(e-r,l-a),P=Math.floor(q/u),R=Math.atan2(e-r,l-a),_=Math.cos(R),W=-Math.sin(R),D=w.lat||0,V=w.ph||0,G=w.own?0:w.was?Math.min(P+1,Math.floor(q/w.was)+1):P+1;for(let F=0;F<=P;F++){const O=(F+(w.t0||0))*u/q,te=F%2?1:-1,ae=L*Math.sin(F*.31+V)+D;if(w.t0&&O>1)break;const C=K(r,e,O)+_*(.1*te+ae),U=K(a,l,O)+W*(.1*te+ae),j=Math.floor((F+1)*G/(P+1))>Math.floor(F*G/(P+1));if(A(C,U,R+(j?s:g).range(-.08,.08)+te*.05,n,m,-1),w.scar){t.normal(C,U,b);const Z=Math.hypot(b.x,b.z);if(Z>.25){const Y=b.x/Z,$=b.z/Z;A(C+Y*.5,U+$*.5,Math.atan2(Y,$)+g.range(-.12,.12),.95,2.5,-1)}}}},k=(r,a,e,l,u,m,L,n)=>{d(r,a,e,l,u,m,L,v,n),d(r,a,e,l,u*1.07,m+.08,L*1.6,v,{lat:.85,ph:1.9,t0:.4,own:!0}),d(r,a,e,l,u*.96,m+.12,L*1.4,v*.93,{lat:-1.05,ph:4.2,t0:.7,own:!0})};{const r={};let a=0;const e=g.range(0,J),l=g.range(0,J),u=m=>2.4+.5*Math.sin(m*.07)+1.1*Math.sin(m/6.5+e)+.5*Math.sin(m/2.3+l);for(let m=1.5;m<o.sJoin-3;m+=.74,a++){const L=m+g.range(-.09,.09);o.at(L,r);const n=a%2?1:-1,w=u(L)+.118*n,q=Math.atan(u(L+.5)-u(L-.5));A(r.x+Math.cos(r.yaw)*w,r.z-Math.sin(r.yaw)*w,r.yaw+q+s.range(-.08,.08)+n*.05,.27,.3,-1)}}const p={};for(const r of o.footfalls){const a=o.stateAt(r.t,p),e=r.n%2===0?1:-1,l=I(1.5,7,r.v),u=.05+Math.min(Be(r.v)*K(.62,.26,l)*.5,.45);A(a.x+Math.cos(a.yaw)*.118*e+Math.sin(a.yaw)*u,a.z-Math.sin(a.yaw)*.118*e+Math.cos(a.yaw)*u,a.yaw,.27,.05,r.n*.5+.03),r.x=h[h.length-4],r.y=h[h.length-3],r.z=h[h.length-2]}for(let r=o.total+2.2,a=0;r<o.sEnd;r+=.8,a++){const e=o.at(r,p),l=a%2?1:-1;if(e.z<-238)break;A(e.x-.5+Math.cos(e.yaw)*.09*l,e.z-Math.sin(e.yaw)*.09*l,e.yaw+s.range(-.1,.1),.26,.7,-1)}const T=x.x-.9,N=x.z;{const r=N+34,a=t.crestX(r),e=t.shore(a+150,r,a+15,r,0)[0]-6.5;k(e,r,T-3.6,N+6.5,.6,.14,.05,{was:.78}),k(T-3.1,N+5.8,T+2.6,N-1.6,.6,.1,.03,{was:.78})}{const r=N+112,a=t.crestX(r)+4,e=T-5.2,l=N+6.4;for(let u=0;u<4;u++){const m=u/4,L=(u+1)/4,n=w=>7*Math.sin(Math.PI*w);d(K(a,e,m)+n(m),K(r,l,m),K(a,e,L)+n(L),K(r,l,L),.62,.06,.12,v,{scar:!0,was:.95})}}{const r=t.ISLETS[0],a=[r.x-44,r.z+13],e=[r.x-4,r.z-22],l=t.shore(a[0],a[1],r.x-20,r.z-3,.25),u=t.shore(e[0],e[1],r.x-20,r.z-3,.25);k(l[0],l[1],u[0],u[1],.6,.2,.25,{was:.9})}if(z){const r=t.SEAT[0]-t.HD[0]*150+1.41,a=t.SEAT[2]-t.HD[1]*150+.342*1.5;d(r,a,z.x-.3,z.z+.4,.74,.25,.3);const e=t.SEAT[0]-t.HD[0]*172-.94*3.1,l=t.SEAT[2]-t.HD[1]*172-.342*3.1;d(e,l,e+t.HD[0]*150,l+t.HD[1]*150,.6,.22,.2,.24);for(let u=0;u<5;u++){const m=150-u*24+g.range(-4,4),L=m-g.range(20,34),n=u%2?1:-1,w=-n*g.range(11,17),q=n*g.range(10,16),P=(W,D)=>[t.SEAT[0]-t.HD[0]*W+.94*D,t.SEAT[2]-t.HD[1]*W+.342*D],R=P(m,w),_=P(L,q);t.h(R[0],R[1])<1.5||t.h(_[0],_[1])<1.5||k(R[0],R[1],_[0],_[1],.64,.32+.06*u,.35,{own:!0})}}const M=new f.PlaneGeometry(1,1).rotateX(-Math.PI/2),S=new f.InstancedBufferGeometry;S.index=M.index,S.attributes.position=M.attributes.position,S.setAttribute("aA",new f.InstancedBufferAttribute(new Float32Array(h),4)),S.setAttribute("aN",new f.InstancedBufferAttribute(new Float32Array(i),4)),S.setAttribute("aK",new f.InstancedBufferAttribute(new Float32Array(c),2)),S.instanceCount=c.length/2;const B=new f.ShaderMaterial({transparent:!0,depthWrite:!1,blending:f.MultiplyBlending,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:{uRunPh:{value:0}},vertexShader:`
      attribute vec4 aA, aN; attribute vec2 aK; uniform float uRunPh;
      varying vec2 vQ; varying float vSoft, vDist;
      void main(){
        float on = (aN.w < 0. || uRunPh >= aN.w) ? 1. : 0.;
        vec3 n = normalize(aN.xyz), f0 = vec3(sin(aA.w), 0., cos(aA.w));
        vec3 rt = normalize(cross(n, f0)), fw = cross(rt, n);
        float dC = length(cameraPosition - (modelMatrix * vec4(aA.xyz, 1.)).xyz);
        float grow = aK.y > 1.5 ? 1. : clamp(dC * 0.0042 / max(aK.x, 0.05), 1., 1.7);   // (thin-line rule) a print keeps about a pixel and a half at range
        vec3 w = aA.xyz + (rt * position.x + fw * position.z) * aK.x * grow * on + n * 0.015;
        vQ = position.xz; vSoft = aK.y;
        vec4 wp = modelMatrix * vec4(w, 1.); vDist = length(cameraPosition - wp.xyz) * 0.27 / clamp(aK.x, 0.2, 0.3);   // (polish 4) larger prints are seen from further off
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:Ue}),y=new f.Mesh(S,B);return y.name="prints",y.frustumCulled=!1,y.renderOrder=2,y}function wt(t,o,s){const x=t.footfalls,z=new Float32Array(x.length*4);x.forEach((b,A)=>z.set([b.x,b.y,b.z,b.t],A*4));const g=new f.PlaneGeometry(1,1),h=new f.InstancedBufferGeometry;h.index=g.index,h.attributes.position=g.attributes.position,h.setAttribute("aA",new f.InstancedBufferAttribute(z,4)),h.instanceCount=x.length;const i=new f.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,uniforms:xe(s,{uRunT:{value:0},uSand:{value:new f.Color(o[1])}}),vertexShader:`
      attribute vec4 aA; uniform float uRunT;
      varying vec2 vQ; varying float vAge;
      #include <common>
      #include <fog_pars_vertex>
      void main(){
        float age = uRunT - aA.w; vAge = age / 0.9;
        float on = step(0., age) * step(age, 0.9);
        vec4 c = modelMatrix * vec4(aA.xyz + vec3(0.9 * age, 0.1 + 0.45 * sqrt(max(age, 0.)), 0.), 1.);
        vec4 mvPosition = viewMatrix * c;
        mvPosition.xy += position.xy * (0.16 + 0.75 * sqrt(max(age, 0.))) * on * length(modelMatrix[0].xyz);
        vQ = position.xy * 2.;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:Ke}),c=new f.Mesh(h,i);return c.name="puffs",c.frustumCulled=!1,c.renderOrder=3,c}function At(t,o,s,x,z){const g=[],h=[],i=[],c=[],b=[],A=new f.Vector3;x.forEach((r,a)=>{for(const e of r){const l=e.n%2===0?1:-1,u=I(1.5,7,e.v),m=.05+Math.min(Be(e.v)*K(.62,.26,u)*.5,.45),L=e.x+Math.cos(e.yaw)*.118*l+Math.sin(e.yaw)*m,n=e.z-Math.sin(e.yaw)*.118*l+Math.cos(e.yaw)*m,w=t.h(L,n);t.normal(L,n,A),g.push(L,w,n,e.yaw+(z()-.5)*.1+l*.04),h.push(A.x,A.y,A.z,e.n*.5+.03),i.push(.27,.05,a),c.push(L,w,n,e.t),b.push(a)}});const v=new f.PlaneGeometry(1,1).rotateX(-Math.PI/2),d=new f.InstancedBufferGeometry;d.index=v.index,d.attributes.position=v.attributes.position,d.setAttribute("aA",new f.InstancedBufferAttribute(new Float32Array(g),4)),d.setAttribute("aN",new f.InstancedBufferAttribute(new Float32Array(h),4)),d.setAttribute("aK",new f.InstancedBufferAttribute(new Float32Array(i),3)),d.instanceCount=i.length/3;const k={value:new f.Vector4(-1,-1,-1,-1)},p={value:new f.Vector4(-1,-1,-1,-1)},T=new f.ShaderMaterial({transparent:!0,depthWrite:!1,blending:f.MultiplyBlending,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:{uRunPh:k},vertexShader:`
      attribute vec4 aA, aN; attribute vec3 aK; uniform vec4 uRunPh;
      varying vec2 vQ; varying float vSoft, vDist;
      void main(){
        float ph = aK.z < 0.5 ? uRunPh.x : aK.z < 1.5 ? uRunPh.y : aK.z < 2.5 ? uRunPh.z : uRunPh.w;
        float on = ph >= aN.w ? 1. : 0.;
        vec3 n = normalize(aN.xyz), f0 = vec3(sin(aA.w), 0., cos(aA.w));
        vec3 rt = normalize(cross(n, f0)), fw = cross(rt, n);
        float dC = length(cameraPosition - (modelMatrix * vec4(aA.xyz, 1.)).xyz);
        float grow = clamp(dC * 0.0042 / max(aK.x, 0.05), 1., 1.7);     // (thin-line rule, as the hero's prints) a print keeps about a pixel and a half at range
        vec3 w = aA.xyz + (rt * position.x + fw * position.z) * aK.x * grow * on + n * 0.015;
        vQ = position.xz; vSoft = aK.y;
        vec4 wp = modelMatrix * vec4(w, 1.); vDist = length(cameraPosition - wp.xyz) * 0.27 / clamp(aK.x, 0.2, 0.3);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:Ue}),N=new f.Mesh(d,T);N.name="spur-prints",N.frustumCulled=!1,N.renderOrder=2;const M=new f.PlaneGeometry(1,1),S=new f.InstancedBufferGeometry;S.index=M.index,S.attributes.position=M.attributes.position,S.setAttribute("aA",new f.InstancedBufferAttribute(new Float32Array(c),4)),S.setAttribute("aWho",new f.InstancedBufferAttribute(new Float32Array(b),1)),S.instanceCount=b.length;const B=new f.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,uniforms:xe(s,{uRunT:p,uSand:{value:new f.Color(o[1])}}),vertexShader:`
      attribute vec4 aA; attribute float aWho; uniform vec4 uRunT;
      varying vec2 vQ; varying float vAge;
      #include <common>
      #include <fog_pars_vertex>
      void main(){
        float rt = aWho < 0.5 ? uRunT.x : aWho < 1.5 ? uRunT.y : aWho < 2.5 ? uRunT.z : uRunT.w;
        float age = rt - aA.w; vAge = clamp(age / 0.9, 0., 1.);
        float on = step(0., age) * step(age, 0.9);
        vec4 c = modelMatrix * vec4(aA.xyz + vec3(0.9 * age, 0.1 + 0.45 * sqrt(max(age, 0.)), 0.), 1.);
        vec4 mvPosition = viewMatrix * c;
        mvPosition.xy += position.xy * (0.16 + 0.75 * sqrt(max(age, 0.))) * on * length(modelMatrix[0].xyz);
        vQ = position.xy * 2.;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:Ke}),y=new f.Mesh(S,B);return y.name="spur-puffs",y.frustumCulled=!1,y.renderOrder=3,{prints:N,puffs:y,set(r,a,e){k.value.setComponent(r,a),p.value.setComponent(r,e)}}}async function St(t,o={}){const s=o.palette&&o.palette.length>=7?o.palette:je,x=se(o.detail??t.quality?.detail??1,.6,1),z=t.rng,g=t.noise,h=new f.Group;h.name="fire-in-the-sand-sea";const i=()=>{},c=Ye(z,g),b=et(s);await t.yield();const A=new f.Mesh(await Je(t,c),tt(s,b,c));A.name="sand",h.add(A),i("sand"),await t.yield();const v=await ot(t,c),d=st(s,b,v),k=new f.Mesh(at(c),d);k.name="lava",h.add(k),i("lava"),d.uniforms.uOff.value.set(z.range(-900,900),z.range(-900,900)),await t.yield();const p=pt(c);await t.yield();const T=Fe();await t.yield();const N=He(T,s,b,{name:"runner",hue:z.range(-.012,.012),light:z.range(-.02,.02)}),M=He(T,s,b,{name:"twin",pale:z.range(.32,.48),hue:z.range(-.012,.012)});h.add(N.mesh,M.mesh),i("animals"),N.uniforms.uLavaDir.value.set(.62,-.78,.05).normalize(),N.uniforms.uLavaI.value=.5,M.uniforms.uLavaDir.value.set(-.2,-.75,.62).normalize(),M.uniforms.uLavaI.value=.45;const S=6,B=new f.Vector3(c.SEAT[0]-c.HD[0]*28.5+.94*S,0,c.SEAT[2]-c.HD[1]*28.5+.342*S);B.y=c.h(B.x,B.z);const y=Math.atan2(-.94*.94+.342*.342,-.342*.94-.94*.342)+z.range(-.25,.25)*.4,r={},a=(E,X)=>c.h(E.x+Math.cos(E.yaw)*.118*X,E.z-Math.sin(E.yaw)*.118*X)-E.y;let e=-1,l=!1,u=-1;function m(E){const X=e>=0?e:.175+E*.011%.2,Q=u>=0?u:e>=0?ie:ie+E*.9%20;p.stateAt(Q,r),r.time=E,r.groundL=a(r,1),r.groundR=a(r,-1);const Xe=1-I(.1,1.5,r.speed);r.look=Xe*(Q<ie?Ce(E,1.7,.55):Ce(E,4.1,.4)),r.alert=I(.2,1,Q),l&&(r.speed=9,r.phase=E*2.647,r.look=0),N.pose(r),P.material.uniforms.uRunPh.value=l?0:r.phase,R.material.uniforms.uRunT.value=l?0:Q,n.material.uniforms.uToeU.value=e>=0?I(.5,.63,e):.5+.5*Math.sin(E*.3),M.pose({x:B.x,y:B.y,z:B.z,yaw:y,speed:0,phase:0,time:E+1.3,look:Ce(E,9.2,.8)-.3,groundL:c.h(B.x+Math.cos(y)*.118,B.z-Math.sin(y)*.118)-B.y,groundR:c.h(B.x-Math.cos(y)*.118,B.z+Math.sin(y)*.118)-B.y})}const L=(()=>{const X=c.crestX(-224),[Q]=c.shore(X+150,-224,X+15,-224,0);return{x:Q+.9,z:-224,y:0,ang:-Math.PI/2,size:2}})(),n=await dt(t,c,z.fork("toes"),s,b,Math.round(400*x),L);h.add(n),i("toes"),await t.yield();const w=await vt(t,c,s,b);h.add(w.mesh),d.uniforms.uDelta.value.set(w.foot.x-12,oe,50),await t.yield(),await t.yield();const q=Oe(Ze("fire-in-the-sand-sea:trackways-k1c:"+(t.seed??0))),P=mt(c,p,z.fork("prints"),L,B,q),R=wt(p,s,b);h.add(P,R),i("prints"),await t.yield();let _=new f.Vector3(70,66,-215),W=200,D=44;const V=o.focus||null;V==="runner"&&(e=.3,u=20,l=!0,p.stateAt(20,r),_=new f.Vector3(r.x,r.y+.75,r.z),W=.2,D=3.2),V==="shore"&&(_=new f.Vector3(L.x-2,1.5,L.z),W=2,D=9),V==="tongue"&&(_=new f.Vector3(w.foot.x-8,7,oe),W=14,D=26),V==="twin"&&(_=new f.Vector3(B.x,B.y+.75,B.z),W=.2,D=5),(V==="runner"||V==="twin")&&(h.scale.setScalar(3.2),_.multiplyScalar(3.2));const G=c.h,F=(E,X,Q)=>new f.Vector3(E,X,Q),O=(E,X,Q)=>F(E,G(E,X)+Q,X),te=p.at(0,{}),ae=p.at(p.total,{}),C=F(...c.SEAT),U=G(C.x,C.z),j=F(c.HD[0],0,c.HD[1]),Z=(E,X,Q)=>Math.max(G(E,X),c.level(E,X))+Q,Y=E=>{const X=C.x-j.x*E,Q=C.z-j.z*E;return F(X,Math.max(12,C.y-.2126*E,E>135?Z(X,Q,6):0),Q)},$=(E,X,Q)=>F(c.crestX(E)+X,c.crestY(E)+Q,E),ne=E=>c.shore(c.crestX(E)+150,E,c.crestX(E)+15,E,0)[0],ce=$(-131,-2,2.2),ee=F(ne(-200)+4,5,-200),he=E=>{const X=K(ce.x,ee.x,E),Q=K(ce.z,ee.z,E);return F(X,Math.max(Z(X,Q,4),5),Q)},ve=d.uniforms.uWhaleP.value,me={crossing:F(c.crestX(0),G(c.crestX(0),0),0),entry:{position:F(-153,38,0),heading:F(1,0,0)},flyThrough:[F(-153,38,0),F(-95,Math.max(38,Z(-95,0,3)),0),F(-50,Z(-50,0,2.6),0),F(-18,Z(-18,0,2.6),0),F(0,G(0,0)+3,-3),$(-22,-3,2),$(-60,-3,2),$(-100,-3,2),ce,he(.3),he(.65),ee,Y(277),Y(240),Y(190),Y(135),Y(70),Y(0)],portalSeat:{position:C,facing:F(-j.x,0,-j.z),radius:7,floorY:U},horns:[O(168,c.spurZ(168),0),O(212,c.spurZ(212),0)],runnerStand:F(te.x,G(te.x,te.z),te.z),runnerStop:F(ae.x,G(ae.x,ae.z),ae.z),twin:B.clone(),tongueLip:w.lip,tongueFoot:w.foot,islet:F(c.ISLET.x,G(c.ISLET.x,c.ISLET.z),c.ISLET.z),lastPrint:F(L.x-.9,0,L.z),whaleback:F(ve.x,0,ve.y),westBay:O(c.crestX(58)-100,58,0),viewpoints:{crest:{position:F(0,G(0,0)+3,0),lookAt:F(260,0,-120)},shore:{position:F(ne(-208)+3,5,-208),lookAt:w.foot},lake:{position:Y(240,12),lookAt:C}},lakeLevels:{east:ge,west:le}};function pe(E){const X=e,Q=X>=0?I(.585,.65,X):.5-.5*Math.cos(E*.2);d.uniforms.uWhaleU.value=Q,d.uniforms.uDelta.value.z=46+18*(X>=0?X:.5),d.uniforms.uWhaleGlow.value=X>=0?I(.625,.67,X)*(1-.8*I(.74,.83,X)):I(.55,.95,Q)}return m(0),pe(0),i("end"),{object:h,radius:W,height:D,center:_,anchors:me,heightAt:c.h,levelAt:c.level,dunes:c,runner:N,twin:M,script:p,lights:b,parts:{sand:A,lava:k,toes:n,tongue:w.mesh,prints:P,puffs:R},setProgress(E){e=se(E,0,1)},setRunTime(E){u=E},update(E,X,Q){b.uTime.value=X,m(X),pe(X)},dispose(){},ground:!1,groundY:0}}export{ge as LAKE_EAST,le as LAKE_WEST,St as buildHero,Fe as buildTheropodGeometry,Ye as makeDunes,kt as makeRoute,At as makeRunMarks,He as makeTheropod,Mt as makeTiming,ct as poseTheropod,zt as secondsAtU,Be as theropodCycle};
