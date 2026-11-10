import*as o from"three";import{mergeGeometries as re}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as cr,clamp as q,lerp as E,smoothstep as z}from"../kit/core.js";import{buildHero as ur,PALETTE as va,STYLE as dr,woolMaterial as $,fabricMaterial as nt,yarnTubeGeometry as de,yarnMaterial as ha,fuzzGeometry as Dt,fuzzMaterial as vr,woodMaterial as fa}from"../parts/cast-off-sound.js";const po="#2A2522",Mn="#D9C7A0",Sn="#9C8358",Cn=1,pa=42,ma=new o.Vector3(240,0,790),hr=10,Z=1.5,ga=[[-150,120,40,150],[-165,300,118,205],[-185,450,128,215],[-168,548,96,190],[-175,645,97,170],[-80,690,84,115],[20,715,62,95],[120,735,30,70]],wa=.62;function zn(p,g,ve){let ie=1e9,D=0,ge=1;for(let N=0;N<ga.length-1;N++){const G=ga[N],K=ga[N+1],se=K[0]-G[0],we=K[1]-G[1],Ie=q(((p-G[0])*se+(g-G[1])*we)/(se*se+we*we),0,1),W=p-G[0]-se*Ie,xe=g-G[1]-we*Ie,Le=W*W+xe*xe;Le<ie&&(ie=Le,D=G[2]+(K[2]-G[2])*Ie,ge=G[3]+(K[3]-G[3])*Ie)}return ve.r=Math.sqrt(ie)/ge,ve.h=D,ve}function fr(p){return p<=36||p>=64?p:p<48?36+8*z(36,48,p):p<52?44+12*(p-48)/4:56+8*z(52,64,p)}const An=`
  vec3 gBand(float ridge, float n, float L, float odd, vec3 dp, vec3 lt, vec3 fm, vec3 avg){
    float g = floor(ridge/n), m9 = mod(g + 1., L < 0.5 ? 5. : 9.), h = hash11(g*1.37 + L*7.31);      // near the eye every fifth ridge is the cream one
    vec3 c = L < 0.5 ? (h < 0.15 ? lt : (h > 0.9 ? mix(dp, lt, 0.4) : (mod(g, 2.) < 0.5 ? dp*0.9 : mix(dp, lt, 0.26)))) : (mod(g, 2.) < 0.5 ? dp*0.92 : mix(dp, lt, h > 0.8 ? 0.85 : 0.45));
    if (m9 < 0.5) c = mix(dp, fm, L < 0.5 ? odd : 0.72);
    return mix(c, avg, min(0.1*L, 0.3));
  }
  vec3 garterCol(vec2 st, float fwx, float fwy, vec3 dp, vec3 lt, vec3 fm, out float pill){
    vec3 avg = dp*0.76 + lt*0.21 + fm*0.03;
    float graze = smoothstep(3., 12., fwy/max(fwx, 1e-4));            // seen along the water the rows crowd: gather them sooner, into bands 3 to 9 px tall
    float lod = clamp(log2(max(fwy*mix(1.3, 4.4, graze), 1.))/1.585, 0., 5.99), L0 = floor(lod), n0 = pow(3., L0), fr = lod - L0;
    float lw = log2(max(9.*fwx, 1.)), w0 = exp2(floor(lw));
    float bx = mix(abs(sin(3.14159265*st.x/w0)), abs(sin(1.5707963*st.x/w0)), smoothstep(0.3, 1., fract(lw)));
    float sy = st.y + (bx - 0.5)*max(mix(0.9, 1.3, graze)*n0, min(3.*fwy, 1.6*n0));
    float row = floor(sy), ridge = floor(row*0.5), odd = step(0.5, mod(row, 2.));
    vec3 c = mix(gBand(ridge, n0, L0, odd, dp, lt, fm, avg), gBand(ridge, n0*3., L0 + 1., odd, dp, lt, fm, avg), smoothstep(0.45, 1., fr));
    float flatS = smoothstep(0.16, 0.36, max(fwx, fwy));
    pill = (1. - bx*sin(3.14159265*fract(sy/(2.*n0))))*flatS*(1. - smoothstep(0.5, 1., fr))*(1. - smoothstep(4.5, 5.5, lod));
    return mix(c, avg, smoothstep(5., 5.9, lod));
  }`,pr=`
  uniform float uPx, uMinPx, uGrowMax, uMaxPx; uniform vec2 uNearFade, uFarFade; varying vec3 vC; varying vec4 vT; varying float vD;
  void main(){
    vec3 root, d, col; vec2 cr; float seed, aMul;
    tuft(root, d, col, cr, seed, aMul);
    float len = max(length(d), 1e-4); vec3 toCam = cameraPosition - root; float dist = max(length(toCam), 1e-3);
    float grow = clamp(dist*uPx*uMinPx/(len*uFuzz), 1., uGrowMax);
    float g = gust(root + seed*40.);
    vec3 nh = d/len, lee = uWind - nh*min(dot(uWind, nh), 0.);               // the gale lays a hair over along its yarn, never into it
    vec3 tip = (d + lee*len*(0.3 + 0.6*g)*uGale)*uFuzz*grow; tip += nh*sin(uTime*7. + seed*40.)*0.1*len*grow;
    float tl = max(length(tip), 1e-4); tip *= min(1., dist*uPx*uMaxPx/tl); tl = max(length(tip), 1e-4);      // no hair is longer than about 24 px: near the eye a tuft is short hairs, never streamers
    aMul *= 1. - smoothstep(0.35, 0.8, abs(dot(tip, toCam))/(tl*dist));      // seen end-on a tuft thins to nothing instead of filling in
    vec3 side = cross(tip, toCam); side = side/max(length(side), 1e-4);
    float w = min(max(abs(cr.x)*2., dist*uPx*22.), dist*uPx*44.);      // a card is always wide enough for six hairs or more
    vec3 wp = root + tip*cr.y + side*(cr.x < 0. ? -0.5 : 0.5)*w*(1. + 0.7*cr.y);
    vC = col; vD = dist; vT = vec4(step(0., cr.x), cr.y, seed, aMul*smoothstep(uNearFade.x, uNearFade.y, dist)*(1. - smoothstep(uFarFade.x, uFarFade.y, dist)));
    gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.);
  }`,mr=`
  uniform float uHairs, uAlpha, uHairW; varying vec3 vC; varying vec4 vT; varying float vD;
  void main(){
    float v = vT.y, fu = max(fwidth(vT.x), 1e-4), fv = max(fwidth(vT.y), 1e-4);
    float N = clamp(floor((uHairW < 0.5 ? 0.3 : 0.23)/fu), 1., uHairs), px = fu*N;                // hairs at least 4 px apart (3 for fine hair); px = one pixel, in hair spacings
    float spread = 0.22 + 0.78*v, x = N*0.5 + (vT.x*N - N*0.5)/spread, k0 = floor(x), hw = uHairW*px, sd = floor(vT.z*64.)*7.;      // the hairs of a tuft part from one root
    float a = 0., kb = 0., tall = min(px/fv, 9.);                          // tall: the card's height in hair spacings
    for (int j = -2; j <= 2; j++) {                                        // each hair: its own root, its own lean, its own length, and a curve that is a share of that length (a short hair bends as a long one does)
      float k = k0 + float(j), id = k + sd;
      float h1 = hash11(id*1.31 + 3.), h2 = hash11(id*2.17 + 11.), h3 = hash11(id*0.73 + 29.);
      float lenK = 0.3 + 0.7*hash11(id*3.3 + 7.), vn = clamp(v/lenK, 0., 1.), splay = clamp((k + 0.5 - N*0.5)/max(N*0.5, 1.), -1., 1.);
      float bend = (h3 < 0.5 ? -1. : 1.)*(0.2 + 0.5*abs(h3 - 0.5)) + 0.25*splay;
      float c = k + 0.5 + (h1 - 0.5)*1.2 + ((h2 - 0.5)*0.5*vn + bend*vn*vn)*lenK*tall/spread;
      float hair = (1. - smoothstep(hw, hw + px, abs(x - c)*spread))*(1. - smoothstep(lenK*0.8, lenK, v))*step(-0.5, k)*step(k, N - 0.5)*step(0.14, hash11(id*5.9 + 41.));
      if (hair > a) { a = hair; kb = id; }
    }
    a *= (1. - 0.4*v)*uAlpha*vT.w*(1. - smoothstep(0.3, 0.6, fv))*step(4.5, N);      // five hairs or none: never a lone bar or a pair
    if (a < 0.02) discard;
    // two lots of fibre in every tuft: the pale halo (it shows against wool and sea) and the wool's own deeper lot (it shows against the pale sky); pale at the tip
    vec3 c = hash11(kb*2.3 + 17.) < 0.38 ? mix(vC*0.5, vC*0.8, v) : mix(vC, uCream, 0.25 + 0.45*v);
    c = mix(c, uCream, uPale.x*(1. - exp(-vD/max(uPale.y, 1.))));
    gl_FragColor = vec4(toScene(c), a);
  }`,gr=`
  attribute vec3 aDir, aCol; attribute vec4 aCorner;
  void tuft(out vec3 root, out vec3 d, out vec3 col, out vec2 cr, out float seed, out float aMul){
    root = position; d = aDir; col = aCol; cr = aCorner.xy; seed = aCorner.z;
    vec3 tc = cameraPosition - root; aMul = (1. - 0.7*smoothstep(0.15, 0.55, abs(dot(aDir, tc))/max(length(aDir)*length(tc), 1e-3)))*(1. - 0.4*smoothstep(60., 220., length(tc))); }`,wr=`
  attribute vec3 aDir, aCol; attribute vec4 aCorner;
  void tuft(out vec3 root, out vec3 d, out vec3 col, out vec2 cr, out float seed, out float aMul){
    root = (modelMatrix*vec4(position, 1.)).xyz; d = mat3(modelMatrix)*aDir; col = aCol; cr = aCorner.xy; seed = aCorner.z; aMul = 1.; }`;function bt(p,g,{near:ve=[0,.001],far:ie=[1e5,2e5],minPx:D=4.5,grow:ge=4,hairW:N=.8,maxPx:G=24,hairs:K=9,alpha:se=.8,uniforms:we={}}={}){return $({transparent:!0,depthWrite:!1,side:o.DoubleSide,vertexShader:p+pr,fragmentShader:mr,uniforms:{uPx:g,uMinPx:{value:D},uGrowMax:{value:ge},uHairW:{value:N},uMaxPx:{value:G},uNearFade:{value:new o.Vector2(ve[0],ve[1])},uFarFade:{value:new o.Vector2(ie[0],ie[1])},uHairs:{value:K},uAlpha:{value:se},...we}})}const _t=`
  vec3 fatYarn(vec3 base, vec3 N, vec3 up, vec3 V, vec2 uvT, float seed, float dist){
    float ph = uvT.y*4. + uvT.x*2.4 + seed, fw = fwidth(uvT.x)*2.4 + fwidth(uvT.y)*4.;
    float thin = smoothstep(0.08, 0.3, fwidth(uvT.y)), fine = 1. - smoothstep(0.25, 0.6, fw);
    float s = abs(sin(ph*3.14159265)), groove = (1. - smoothstep(0.0, 0.34, s))*fine;
    float nu = dot(N, up), under = 1. - smoothstep(-0.7, 0.2, nu);
    vec3 nr = mix(N, V, max(thin, 0.55)); nr = nr/max(length(nr), 1e-4);
    vec3 nd = mix(N, uSunDir, thin*0.65); nd = nd/max(length(nd), 1e-4);
    vec3 b = base*mix(1., 0.8 + 0.26*s, fine)*(1. + 0.06*clamp(nu, 0., 1.));              // each ply lighter along its own back, the deeper lot in the groove between two
    return woolShadeR(b, nd, nr, V, max(groove*0.92, under*0.95)*(1. - thin), dist);
  }`;function Nn(p,g,ve){const ie=[],D=[],ge=[],N=[],G=[];for(const se of[0,1]){const W=se?.87:.13,xe=.86,Le=Math.hypot(W-.5,xe- -.32),ee=(W-.5)/Le,Q=(xe- -.32)/Le,I=ie.length/3;g.forEach(([H,Y,Te],Ve)=>{for(let Oe=0;Oe<=p;Oe++){const Ee=Oe/p*Math.PI*2,rt=Math.cos(Ee)*Y,it=Math.sin(Ee)*Y;if(ie.push(.5+(W-.5)*H,-.32+(xe- -.32)*H,Te),D.push(Q*rt,-ee*rt,it),N.push(H,rt),ge.push(H*Le*1.5/(ve*2)+se*.37,Oe/p),Ve<g.length-1&&Oe<p){const te=I+Ve*(p+1)+Oe,oe=te+p+1;se?G.push(te,te+1,oe,te+1,oe+1,oe):G.push(te,oe,te+1,te+1,oe,oe+1)}}})}const K=new o.InstancedBufferGeometry;return K.setAttribute("position",new o.Float32BufferAttribute(ie,3)),K.setAttribute("aOff",new o.Float32BufferAttribute(D,3)),K.setAttribute("aT",new o.Float32BufferAttribute(N,2)),K.setAttribute("uv",new o.Float32BufferAttribute(ge,2)),K.setIndex(G),K}const xr=[[-.07,.3,.24],[0,.82,.3],[.12,1,.35],[.4,1,.35],[.68,1,.3],[.86,.9,.14],[1,.55,-.1]],yr=[[0,.88,.27],[.28,1,.35],[.72,1,.29],[1,.76,-.05]];function Fn(p){const g=z;return 1.45-.45*g(.22,.3,p)+.05*g(.4,.46,p)-.5*g(.6,.66,p)+.55*g(.77,.83,p)-.1*g(.86,.9,p)}const br={sheep:["..####..##",".########.","##########","##########",".########.",".#.#..#.#.",".#.#..#.#.",".........."],sheep2:["..####..##",".########.","##########","##########",".########.","..##..##..",".#..#.#..#",".........."],pony:[".......##.","......####","#.######..",".########.",".########.",".#.#..#.#.",".#.#..#.#.",".........."],pony2:[".......##.","......####","#.######..",".########.",".########.","..##..##..",".#..#.#..#",".........."],gannet:["..........","#........#",".##....##.","..######..","...####...","....##....","..........",".........."],gannet2:["..........","..........","..##..##..",".########.","#..####..#","....##....","..........",".........."]},Mr={waves:["#...#...",".#.#.#.#","..#...#.","........"],diamonds:["...#....","..#.#...",".#.#.#..","..#.#..."],anchors:["..#.....",".###....","..#.....","#.#.#..."]};var Ar={id:"cast-off-sound",name:"Cast Off",category:"ocean",weirdness:.4,media:["water","open"],async build(p){const g=p.rng,ve=p.noise,ie=p.vary||{},D=q(p.quality?.detail??1,.5,1),ge=q(ie.density??1,.7,1.3),N=new o.Scene,G=g.int(0,2),K=g.int(0,2),se=g.int(0,2),we=ie.hour==="golden"||ie.hour!=="day"&&g.chance(.25),Ie=!!ie.rare,W=va.slice();let xe=W[6],Le=W[0];G===1&&(W[4]="#3F5F58",W[5]="#86A294",xe="#A8532A"),G===2&&(W[4]="#5F88B6",W[5]="#B4C6D6",xe=po,Le=W[6]),we&&(W[0]="#F2E2B8");const ee=e=>new o.Color(e),Q=ee(W[0]),I=ee(W[1]),H=ee(W[2]),Y=ee(W[3]),Te=ee(W[4]),Ve=ee(W[5]),Oe=ee(W[6]),Ee=ee(po),rt=se===1?.55:1,it=se===2,te=dr.uniforms,oe={value:.0027};te.uExposure.value=Cn,te.uGale.value=rt,te.uFuzz.value=it?3:1,te.uPale.value.set(it?.3:.2,it?1100:1700),te.uCool.value.set(we?"#E9E2DA":"#DCE6EE");const xa=165*Math.PI/180,mo=(we?12:26)*Math.PI/180;te.uSunDir.value.set(Math.sin(xa)*Math.cos(mo),Math.sin(mo),Math.cos(xa)*Math.cos(mo)).normalize(),te.uWind.value.set(.34,0,.94).normalize();const qt=hr*(se===1?.6:1),k=cr([[0,3,0],[0,3,70],[-3,3,160],[-12,3,270],[-21,3.5,362],[-40,9,400],[-72,31,436],[-110,58,477],[-150,91,520],[-168,101,548],[-174,106.5,577],[-156,110.5,603],[-120,101,612],[-61.3,90,639.3],[-2.7,74,666.7],[56,58,694]]),Mt={r:0,h:0},go=new o.Vector3,Ue=new o.Vector3,wo=e=>3.5*z(.375,.425,e)*(1-z(.69,.74,e)),st=[[.672,27,5,1.8,-.55],[.7,34,13,2.2,-.95]],Fe=st.map(([e,t,n])=>{const a=k.pointAt(e),r=k.tangentAt(e),i=-r.z,u=r.x,s=Math.hypot(i,u)||1;return new o.Vector3(a.x+i/s*t,a.y+n,a.z+u/s*t)}),ya=e=>{const t=st[e][3];return[(13-e*1.5)*t/2,3.2*t,Math.cos(st[e][4]),Math.sin(st[e][4])]},Pn=(e,t,n)=>{const[a,r,i,u]=ya(e),s=t-Fe[e].x,h=n-Fe[e].z;return Math.hypot(Math.max(Math.abs(s*i-h*u)-a,0),Math.max(Math.abs(s*u+h*i)-r,0))},Ot=(e,t,n)=>{const[a,r]=ya(e),i=Math.abs(Math.cos(t)),u=Math.abs(Math.sin(t)),s=(a+n)/Math.max(i,1e-6),h=(r+n)/Math.max(u,1e-6);if(s*u<=r)return s;if(h*i<=a)return h;const v=a*i+r*u;return v+Math.sqrt(Math.max(v*v-(a*a+r*r-n*n),0))},Wn=(e,t)=>{if(zn(e,t,Mt),Mt.r>=1.15)return-12;const n=ve.fbm2(e*.006+3.1,t*.006-1.7,3),a=Mt.r*(1+.07*ve.n2(e*.011,t*.011));let r=Mt.h*(1-a*a)*(1+.12*n)+7*n;r*=.3+.7*z(25,135,Math.hypot(e+38,t-402)),r=fr(r);const i=z(wa-.13,wa-.06,a);return E(r,-12,i)};let xo=0,yo=0,bo=0,Mo=30;const De=(e,t)=>{let n=Wn(e,t);if(xo=0,yo=0,bo=0,Mo=30,n>-4&&t>330&&t<760&&e>-260&&e<110){const a=k.nearestXZ(e,t);let r=a.dist;bo=z(.405,.43,a.u)*(1-z(.69,.73,a.u))*(1-z(E(14,9,z(.5,.54,a.u)),E(24,17,z(.5,.54,a.u)),a.dist));const i=r<45?wo(a.u):0;i>.05&&(k.pointAt(a.u,go),k.tangentAt(a.u,Ue),r=Math.abs(((e-go.x)*-Ue.z+(t-go.z)*Ue.x)/(Math.hypot(Ue.x,Ue.z)||1)-i));const u=a.y-7.5-2.5*z(7,3,r)+Math.max(0,Math.min(r,10)-5.5)+Math.max(0,r-10)*(.26+.46*z(.44,.53,a.u));u<n&&(n=u),r<7.2&&a.u>.36&&a.u<.652&&(xo=1),a.u>.36&&a.u<.652&&(Mo=Math.min(r+26*z(.64,.652,a.u)-1.6*(1-z(.43,.52,a.u)),30));const s=z(.645,.7,a.u);if(a.u>.655&&a.dist<75&&(yo=1),s>0&&a.dist<60){const h=a.y-3.9-5*z(.79,.86,a.u)-9*z(.87,.95,a.u)-.5*Math.max(0,a.dist-4);h>n&&(n=E(n,h,s))}}for(let a=0;a<2;a++){if(Math.abs(e-Fe[a].x)+Math.abs(t-Fe[a].z)>60)continue;const r=Pn(a,e,t);r<16&&(n=E(Fe[a].y,n,z(1.5,16,r)))}return n};await p.yield();const Ln=ee(G===1?xe:W[6]),So={uPxDeg:{value:.14},uGrey:{value:Y},uGold:{value:we?1:0},uMadder:{value:Ln},uFawnS:{value:I},uUnder:{value:1},uRowS:{value:qt},uDeepS:{value:Te},uLightS:{value:Ve}};await p.yield();const Co=new o.Mesh(new o.SphereGeometry(1,40,24),$({side:o.BackSide,depthWrite:!1,depthTest:!1,uniforms:So,vertexShader:`
        varying vec3 vD;
        void main(){ vD = position; vec4 p = projectionMatrix*viewMatrix*vec4(cameraPosition + position*100., 1.);
          if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fragmentShader:`
        uniform float uPxDeg, uGold, uUnder, uRowS; uniform vec3 uGrey, uDeepS, uLightS, uMadder, uFawnS; varying vec3 vD;
        ${An}
        float ringN(float r){ return r < 7.5 ? 288. : (r < 12.5 ? 192. : (r < 21.5 ? 128. : (r < 27.5 ? 64. : (r < 31.5 ? 32. : 16.)))); }
        vec3 yokeCol(float r, float c, float walk){
          if (r < 5.5) return uCream;
          if (r < 6.5) return mod(c, 4.) < 0.5 ? uLightS : uCream;
          if (r < 7.5) return mod(c + r, 2.) < 0.5 ? uLightS : uCream;
          if (r < 12.5) return uLightS;
          if (r < 13.5 || (r > 20.5 && r < 21.5)) return uMadder;
          if (r < 20.5) { float m = mod(c - walk, 8.), k = r - 14., dm = abs(m - 3.);
            bool on = (k < 0.5 || k > 5.5) ? (m > 6.5) : (dm < 2.51 - abs(k - 3.) && !(k > 2.5 && k < 3.5 && dm < 0.5));
            return on ? uMadder : uCream; }
          if (r < 22.5) return uLightS;
          if (r < 23.5) return mod(c + r, 2.) < 0.5 ? uLightS : uDeepS;
          return (mod(r, 3.) < 0.5 && mod(c + 2.*floor(r/3.), 4.) < 0.5) ? uLightS : uDeepS*(r > 27.5 ? 0.9 : 1.);
        }
        void main(){
          vec3 d = vD/max(length(vD), 1e-4);
          // Before we arrive (seen through the previous portal the engine clips everything behind the entry, sea included)
          // the sky below the horizon carries the Sound's own garter bands, so the opening shows sea and not a blank.
          vec2 sp = cameraPosition.xz + d.xz*(max(cameraPosition.y, 0.2)/max(-d.y, 0.002));
          float sy = (sp.y - uRowS*uTime)/${Z.toFixed(2)}, fwy = min(fwidth(sp.y)/${Z.toFixed(2)}, 4000.), fwxS = min(fwidth(sp.x)/${Z.toFixed(2)}, 4000.), pillS;
          vec3 seaC = garterCol(vec2(sp.x/${Z.toFixed(2)}, sy), fwxS, fwy, uDeepS, uLightS, uCream, pillS)*(0.94 - 0.16*pillS);
          seaC *= mix(1., 0.86 + 0.2*smoothstep(0.15, 0.85, abs(fract(sy*0.5) - 0.5)*2.), 1. - smoothstep(0.35, 0.9, fwy));      // the ridge and the furrow
          float el = asin(clamp(d.y, -1., 1.))*57.2958, az = atan(d.x, d.z + 1e-6)*57.2958;
          az += 0.7*sin(uTime*0.23 + el*0.05) + 0.3*sin(uTime*0.41); el += 0.35*sin(uTime*0.19 + az*0.03);
          float v = 20.*log(1. + max(el, 0.)/20.), r = floor(v), N = ringN(r), cx = (az/360. + 0.5)*N, c = floor(cx);
          float walk = floor(uTime*0.8);
          float rc = floor(v - 1.7*abs(fract(cx) - 0.5) + 0.42);                  // the colour of a stitch has the stitch's own shape: a V, point down
          vec3 base = yokeCol(rc, c, walk);
          // the sun, knitted in: stitch by stitch
          float elC = 20.*(exp((r + 0.5)/20.) - 1.)*0.0174533, azC = ((c + 0.5)/N - 0.5)*TAU;
          float sun = dot(vec3(sin(azC)*cos(elC), sin(elC), cos(azC)*cos(elC)), uSunDir);
          vec3 sunC = mix(uCream, vec3(0.97, 0.9, 0.7), 0.35 + 0.4*uGold);
          if (sun > 0.982) base = sunC; else if (sun > 0.95 && mod(c + r, 2.) < 0.5) base = sunC;
          vec4 sf = stitchField(vec2(cx, v), 0., 0.27);
          vec3 wool = mix(base, base*base*0.55 + base*0.22, clamp(sf.y, 0., 1.)*0.6)*(0.95 + 0.07*sf.x);
          wool = mix(wool, uCream, 0.1*smoothstep(0.6, 1., max(dot(d, uSunDir), 0.)));                 // the wool a little paler toward the light
          // below the horizon there is nothing knitted yet: cool bright cream
          vec3 col = mix(mix(mix(uCream, vec3(0.93), 0.35), seaC, uUnder*step(d.y, -0.002)), wool, smoothstep(-2.5 + 2.3*uUnder, 0.5 - 0.3*uUnder, el));
          gl_FragColor = vec4(toScene(col), 1.);
        }`}));Co.frustumCulled=!1,Co.renderOrder=-10,N.add(Co),await p.yield();const Pe={uRowSpeed:{value:qt},uOrigin:{value:new o.Vector3},uNearS:{value:new o.Vector3},uNearK:{value:1},uPatch:{value:0},uDeep:{value:Te},uLight:{value:Ve},uFoam:{value:Q},uDive:{value:[new o.Vector4(0,0,-9,0),new o.Vector4(0,0,-9,0),new o.Vector4(0,0,-9,0)]}},ba=e=>$({uniforms:{...Pe,uPatch:{value:e}},vertexShader:`
        uniform float uRowSpeed, uPatch; uniform vec3 uOrigin; varying vec3 vW; varying float vSl;
        void main(){
          vec3 p = position; p.xz += uOrigin.xz*uPatch;
          float sy = (p.z - uRowSpeed*uTime)/${Z.toFixed(2)};
          vec2 dq = p.xz - uOrigin.xz; if (dq.y > 0.) dq.y *= 0.66;
          float fade = uPatch*(1. - smoothstep(16., 27., length(dq)));
          float amp = 0.34*fade*(0.75 + 0.25*sin(p.x*0.21 + floor(sy*0.5)*2.1));
          p.y = amp*(0.5 - 0.5*sin(3.14159265*sy)); vSl = -amp*0.5*3.14159265*cos(3.14159265*sy)/${Z.toFixed(2)};
          vW = p; gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.);
        }`,fragmentShader:`
        uniform float uRowSpeed, uPatch, uNearK; uniform vec3 uOrigin, uNearS, uDeep, uLight, uFoam; uniform vec4 uDive[3];
        varying vec3 vW; varying float vSl;
        ${An}
        void main(){
          vec2 q = abs(vW.xz - uOrigin.xz);
          float dzq = vW.z - uOrigin.z;
          if (uPatch < 0.5 && q.x < 27.5 && dzq > -27.5 && dzq < 42.5) discard;         // the fine patch covers this rectangle
          vec2 st = vec2(vW.x, vW.z - uRowSpeed*uTime)/${Z.toFixed(2)};
          float fwx = fwidth(vW.x)/${Z.toFixed(2)}, fwy = fwidth(vW.z)/${Z.toFixed(2)};
          float pill;
          vec3 base = garterCol(st, fwx, fwy, uDeep, uLight, uFoam, pill);
          // far out the Sound has a quiet satin sheen: there, some bands of rows are knitted in the lighter lot (stepped, band by band)
          float dS = distance(vW.xz, uOrigin.xz), shK = floor(3.*smoothstep(260., 560., dS)*(1. - smoothstep(1500., 2800., dS)) + 0.5)/3.;
          base = mix(base, mix(uLight, uFoam, 0.2), 0.34*shK*step(0.42, hash11(floor(st.y/18.)*1.7 + 2.)));
          // where a gannet went in: a purl bump of cream carried shoreward with its row
          for (int i = 0; i < 3; i++) { vec2 dv = (vW.xz - uDive[i].xy - vec2(0., uRowSpeed*uDive[i].z))/${Z.toFixed(2)};
            float rr = length(dv), age = uDive[i].z;
            if (age > 0. && age < 6. && abs(rr - age*1.2) < 0.6 + 0.2*age && mod(floor(st.y), 2.) > 0.5) base = uFoam; }
          vec3 N = normalize(vec3(0., 1., -vSl));
          vec4 sf = stitchField(st, 1., 0.21);
          vec3 dp1 = dFdx(vW), dp2 = dFdy(vW); vec2 d1 = dFdx(st), d2 = dFdy(st);
          vec3 T = dp1*d2.y - dp2*d1.y, B = dp2*d1.x - dp1*d2.x; float inv = 1./max(sqrt(max(dot(T, T), dot(B, B))), 1e-6); T *= inv; B *= inv;
          vec3 n = N*max(sf.x, 0.3) + (T*sf.z + B*sf.w)*0.9; n = n/max(length(n), 1e-4);
          vec3 V = cameraPosition - vW; float dist = length(V); V = V/max(dist, 1e-4);
          vec3 nr = mix(N, V, 0.6); nr = nr/max(length(nr), 1e-4);
          vec3 c = woolShadeR(base, n, nr, V, clamp(sf.y + pill*0.5, 0., 1.), dist);
          // under the real strands round the bow the fabric is only the deeper lot between them
          float und = uPatch*uNearK*(1. - smoothstep(9., 12., distance(vW.xz, uNearS.xz)));
          if (und > 0.001) c = mix(c, mix(uDeep, uDeep*uDeep*0.55 + uDeep*0.22, 0.85), und);      // flat: the indigo two shades deeper, no light on it and no halo
          gl_FragColor = vec4(toScene(c), 1.);
        }`});await p.yield();const zo=new o.PlaneGeometry(9e3,9e3,60,60);zo.rotateX(-Math.PI/2),zo.translate(200,0,600),await p.yield();const Ma=new o.Mesh(zo,ba(0));Ma.frustumCulled=!1,N.add(Ma),await p.yield();const Ao=new o.PlaneGeometry(60,75,60,150);await p.yield(),Ao.rotateX(-Math.PI/2),Ao.translate(0,0,7.5),await p.yield();const No=new o.Mesh(Ao,ba(1));No.frustumCulled=!1,N.add(No),await p.yield();const Tn=["sheep","pony","gannet"][K],Sa=Mr[["waves","diamonds","anchors"][K]];await p.yield();const Et=document.createElement("canvas");Et.width=64,Et.height=128;const jt=document.createElement("canvas");jt.width=4,jt.height=128;{const e=Et.getContext("2d"),t=e.createImageData(64,128),n=c=>[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)],a={c:n(W[0]),f:n(W[1]),m:n(W[2]),g:n(W[3]),k:n(po)},r=(c,l,d)=>{const y=((127-l)*64+c)*4;t.data[y]=d[0],t.data[y+1]=d[1],t.data[y+2]=d[2],t.data[y+3]=255};for(let c=0;c<4;c++){const l=br[Tn+(c%2?"2":"")].map(d=>d.split(""));if(c>=2&&K<2){for(let d=6;d<10;d++)l[0][d]=".",l[1][d]=".";l[1][7]=l[1][8]=l[1][9]="#",l[2][7]=l[2][9]="#",l[2][8]=".",l[3][8]="#"}for(let d=0;d<32;d++)for(let y=0;y<64;y++){let M=a.g;if(d<2||d>=30)M=a.m;else if(d<6)M=Sa[d-2][y%8]==="#"?a.c:a.m;else if(d>=26)M=Sa[29-d][y%8]==="#"?a.c:a.m;else if(d===6||d===25)M=a.c;else if(d===7||d===24)M=y%2?a.k:a.f;else if(d>=12&&d<20){const P=y%16,F=(y>>4)%2;P<10&&l[19-d][P]==="#"&&(M=F?a.k:a.c)}else(d===9||d===22)&&(M=y%4===0?a.f:a.g);r(y,c*32+d,M)}}e.putImageData(t,0,0);const i=jt.getContext("2d"),u=i.createImageData(4,128),s=new Float32Array(256).map((c,l)=>Math.pow(l/255,2.2)),h=c=>s[c],v=c=>Math.round(255*Math.pow(c,1/2.2)),m=new Map,b=(c,l)=>{const d=[0,0,0];let y=0;for(let M=c;M<l;M++)for(let P=0;P<64;P++,y++){const F=(M*64+P)*4;for(let x=0;x<3;x++)d[x]+=h(t.data[F+x])}return d.map(M=>v(M/y))};for(let c=0;c<128;c++){const l=Math.floor(c/4)*4,d=Math.floor(c/32)*32,y=(F,x)=>{const w=F*1e3+x;return m.has(w)||m.set(w,b(F,x)),m.get(w)},M=c%32,P=[b(c,c+1),y(l,l+4),y(d,d+32),M>=12&&M<20?a.g:b(c,c+1)];for(let F=0;F<4;F++){const x=(c*4+F)*4;u.data[x]=P[F][0],u.data[x+1]=P[F][1],u.data[x+2]=P[F][2],u.data[x+3]=255}}i.putImageData(u,0,0)}const lt=new o.CanvasTexture(Et);lt.colorSpace=o.SRGBColorSpace,lt.wrapS=o.RepeatWrapping,lt.magFilter=lt.minFilter=o.NearestFilter,lt.generateMipmaps=!1;const St=new o.CanvasTexture(jt);St.colorSpace=o.SRGBColorSpace,St.magFilter=St.minFilter=o.NearestFilter,St.generateMipmaps=!1,await p.yield();const ye={uChart:{value:lt},uChartAvg:{value:St},uStep:{value:0},uTurn:{value:0},uFawn:{value:I},uMoorit:{value:H},uGrey:{value:Y},uBlack:{value:Ee},uCreamL:{value:Q},uLandTex:{value:null},uWinC:{value:new o.Vector3},uWinK:{value:0},uWinGrow:{value:0},uPxL:oe},je=-430,$e=60,he=5,O=136,J=164,Ca=Math.round(28*Math.sqrt(Math.max(D,.6))),$t=`
      uniform sampler2D uLandTex; uniform vec3 uFawn, uMoorit, uGrey, uBlack, uCreamL;
      const vec2 LR = vec2(-0.4210, 0.9071), LC = vec2(0.9071, 0.4210);
      const float STEEP_NY = 0.62;
      float lh1(float n){ return fract(sin(n*127.1 + 3.7)*43758.5453); }
      float lh2(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
      float lvn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
        return mix(mix(lh2(i), lh2(i + vec2(1., 0.)), f.x), mix(lh2(i + vec2(0., 1.)), lh2(i + vec2(1., 1.)), f.x), f.y); }
      float gSpur = 0.;      // set by landAt: 1 on the spur under the keel (no band is knitted there)
      // the knitted ground at world xz: x height (exactly the mesh's triangle), y turf, zw slope
      vec4 landAt(vec2 xz){
        vec2 g = (xz - vec2(${je}., ${$e}.))/${he}., i = clamp(floor(g), vec2(0.), vec2(${O-1}., ${J-1}.)), f = clamp(g - i, 0., 1.);
        ivec2 ii = ivec2(i);
        vec3 a = texelFetch(uLandTex, ii, 0).rga, b = texelFetch(uLandTex, ii + ivec2(1, 0), 0).rga, c = texelFetch(uLandTex, ii + ivec2(0, 1), 0).rga, d = texelFetch(uLandTex, ii + ivec2(1, 1), 0).rga;      // height, turf (+4 by the cable), metres from the cable's middle
        float h; vec2 gr;
        if (f.x + f.y < 1.) { gr = vec2(b.x - a.x, c.x - a.x); h = a.x + gr.x*f.x + gr.y*f.y; }
        else { gr = vec2(d.x - c.x, d.x - b.x); h = d.x - gr.x*(1. - f.x) - gr.y*(1. - f.y); }
        vec4 mk = step(2.5, vec4(a.y, b.y, c.y, d.y)), tf = vec4(a.y, b.y, c.y, d.y) - 4.*mk;      // + 8 where the cable lies
        vec4 sp = step(50., vec4(a.z, b.z, c.z, d.z)), ce = vec4(a.z, b.z, c.z, d.z) - 100.*sp;      // (+ 100 on the spur)
        gSpur = step(0.5, mix(mix(sp.x, sp.y, f.x), mix(sp.z, sp.w, f.x), f.y));
        return vec4(h, mix(mix(tf.x, tf.y, f.x), mix(tf.z, tf.w, f.x), f.y) + 8.*step(mix(mix(ce.x, ce.y, f.x), mix(ce.z, ce.w, f.x), f.y), 5.5), gr/${he}.);      // + 8 where the cable lies
      }
      float landNy(vec2 xz){                                                  // how steep the knitted ground is there (smooth)
        vec2 g = clamp((xz - vec2(${je}., ${$e}.))/${he}., vec2(0.), vec2(${O}. - 0.001, ${J}. - 0.001)), i = floor(g), f = g - i; ivec2 ii = ivec2(i);
        return mix(mix(texelFetch(uLandTex, ii, 0).b, texelFetch(uLandTex, ii + ivec2(1, 0), 0).b, f.x), mix(texelFetch(uLandTex, ii + ivec2(0, 1), 0).b, texelFetch(uLandTex, ii + ivec2(1, 1), 0).b, f.x), f.y);
      }
      // one stitch of the hill: its wool and its pattern (0 stocking, 1 the garter hem, 2 rib on a shoulder, 3 moss turf). Stripes are whole
      // rows; every 64 columns a seam where the stripe sits one row off (the hand's fault)
      vec3 landCell(vec2 cell, float hc, float turf, float ny, out float pat){
        if (hc < 5.5) { pat = 1.; return uCreamL; }
        if (ny < 0.66) { pat = 2.; return mix(uGrey, uGrey*0.86, step(0.7, lh1(floor(cell.y/7.) + 3.))); }      // shoulders: k2-p2 rib in the hill's own stitches
        float r = cell.y + floor(cell.x/64.), m = mod(r, 17.);
        pat = turf > 0.5 ? 3. : 0.;                                             // moss stitch on the tops, stocking stitch on the slopes
        if (m < 2.) return uMoorit; if (m > 2.5 && m < 3.5) return uCreamL; if (m > 9.5 && m < 10.5) return uGrey;
        if (turf > 0.5) return mix(uFawn, uMoorit, (m > 5.5 && m < 8.5) || m > 13.5 ? 0.5 : 0.14);      // heathery rows on the turf
        return mix(uFawn, uFawn*0.9, step(0.6, lh1(floor(r/5.))));
      }`,Ht=$t+`
      float shoreK(vec2 xz){ return 1. - smoothstep(-0.9, 0.05, landAt(xz).x); }`,Fo=$t+`
      uniform sampler2D uChart, uChartAvg; uniform float uStep, uTurn, uWinK, uWinGrow, uPxL; uniform vec3 uWinC; float gLatt = 0.;
      vec3 gTrueW = vec3(0.); float gBandS = 0.;            // set by a caller that hands landWool a re-scaled band (the ledge): the true world point and metres per band metre
      // colour, stitch coordinates and pattern for a point of knitted land. Returns the base colour.
      vec3 landWool(vec3 wp, vec3 N, float turf, float force, out vec2 st, out float pat, out float rec){
        float ny = max(N.y, 0.05); rec = 0.;
        bool ax = force > 0.5 || abs(N.x) > abs(N.z); float cont = ax ? wp.z : wp.x;
        vec2 sb = vec2(cont, wp.y - 44.)/0.375;
        // fq: stitches to a pixel, across the band's columns and up its rows, each measured along its own coordinate only (the
        // screen gradient of that coordinate), so a band seen at a grazing angle is not counted finer than it is
        vec2 fq = vec2(length(vec2(dFdx(cont), dFdy(cont))), length(vec2(dFdx(wp.y), dFdy(wp.y))))/0.375;
        if (force > -0.5 && wp.y > 44. && wp.y < 56. && ny < 0.86) {    // the Fair Isle band, 0.375 m stitches (not on the spur under the keel)
          st = sb; float row = floor(st.y), col = floor(st.x);
          float walk = step(11.5, row)*step(row, 19.5), sh = uStep*walk*(ax ? 1. : -1.);
          float frame = mod(uStep, 2.) + 2.*uTurn;
          // Stepped at every size, never soft. The border rows: a stitch is its own colour while it is two pixels or so; smaller
          // than that across, the row is one flat tint (its own average); smaller up the band too, rows are gathered in fours, then
          // the whole band is one tint; each switch is made stitch by stitch (a hash), so its border is stitch-stepped as well.
          // THE WALKERS are whole or not there: one decision for each motif (its sixteen columns), made from how large its
          // stitches stand on screen at the motif's own middle (no screen derivative: every pixel of a walker agrees). Under about
          // 2 px a stitch the walker is not knitted and its rows are the plain ground.
          float hs = lh2(vec2(col, row) + 0.37), hg = lh2(vec2(floor(col/6.), floor(row/4.)) + 5.1), ty = (row + 0.5 + frame*32.)/128.;
          vec3 bc = textureLod(uChart, vec2((col + 0.5 - sh)/64., ty), 0.).rgb;
          if (walk > 0.5) {
            float mc = floor((col - sh)/16.), cM = (mc*16. + 5. + sh)*0.375, sc = gBandS > 0.5 ? gBandS : 1.;
            vec3 tw = gBandS > 0.5 ? gTrueW : wp, mp = tw; float dc = (cM - cont)*sc;
            if (ax) mp.z += dc; else mp.x += dc;
            mp.y += (50. - wp.y)*sc;
            vec3 dv = mp - cameraPosition; float dm = max(length(dv), 1e-3), along = (ax ? dv.z : dv.x)/dm;
            float pxSt = 0.375*sc*sqrt(max(1. - along*along, 0.))/(dm*max(uPxL, 1e-6));       // pixels to a stitch, across the motif
            if (pxSt < 2.1 + 0.5*lh1(mc*3.7 + 1.3)) bc = fq.y > 1.7 + 0.8*hg ? textureLod(uChartAvg, vec2(0.625, ty), 0.).rgb : textureLod(uChartAvg, vec2(0.875, ty), 0.).rgb;
          }
          else if (fq.y > 1.7 + 0.8*hg) bc = textureLod(uChartAvg, vec2(0.625, ty), 0.).rgb;
          else if (fq.y > 0.5 + 0.2*hg) bc = textureLod(uChartAvg, vec2(0.375, ty), 0.).rgb;
          else if (fq.x > 0.42 + 0.2*hs) bc = textureLod(uChartAvg, vec2(0.125, ty), 0.).rgb;
          pat = 0.; return bc;
        }
        vec2 stL = vec2(dot(wp.xz, LR), dot(wp.xz, LC))/1.5, cellL = floor(stL);
        float nyS = ny;                                                // the hill decides steep or not per stitch, so the rib's border steps stitch by stitch
        if (turf < -0.5) nyS = landNy((LR*(cellL.x + 0.5) + LC*(cellL.y + 0.5))*1.5) + (lh2(cellL + 0.7) - 0.5)*0.05;
        if (turf < -0.5) {                                             // too steep for the plan lattice (a stitch would be stretched into a blade): clean k2-p2 columns, half-metre stitches, in the bank's own wool
          vec4 Lq = landAt((LR*(cellL.x + 0.5) + LC*(cellL.y + 0.5))*1.5); float nyT = 1./sqrt(1. + dot(Lq.zw, Lq.zw)) + (lh2(cellL + 0.7) - 0.5)*0.05;
          if (nyT < STEEP_NY && nyS >= 0.42 && Lq.x > 5.5 && Lq.y < 4.) {
            st = vec2(cont, wp.y)/0.5; pat = 2.; rec = step(2., mod(floor(st.x), 4.))*0.45;
            float lot = hash11(floor(st.y/9.) + 3.); vec3 wl = nyS < 0.66 ? uGrey : uFawn; return mix(wl, wl*0.88, step(0.6, lot));
          }
        }
        if (nyS < 0.42) {                                              // true steeps (gorge walls): k2-p2 rib, 2 m stitches, grey
          st = vec2(cont, wp.y)/2.; pat = 2.; rec = step(2., mod(floor(st.x), 4.))*0.3;
          float lot = hash11(floor(st.y/7.) + 3.); return mix(uGrey, uGrey*0.86, step(0.7, lot));
        }
        st = vec2(dot(wp.xz, LR), dot(wp.xz, LC))/1.5; vec2 cell = floor(st), cc = (LR*(cell.x + 0.5) + LC*(cell.y + 0.5))*1.5;
        float hc = wp.y - (N.x*(cc.x - wp.x) + N.z*(cc.y - wp.z))/ny, tf = turf;      // colours change stitch by stitch
        if (turf < -0.5) { vec4 L = landAt(cc); hc = L.x + 6.*step(1./sqrt(1. + dot(L.zw, L.zw)), 0.78); tf = L.y - 8.*step(4., L.y); }
        vec3 lc = landCell(cell, hc, tf, nyS, pat); if (pat > 1.5 && pat < 2.5) rec = step(2., mod(cell.x, 4.))*0.3;
        gLatt = 1.; return lc;
      }`,U=new Float32Array((O+1)*(J+1)*3),He=new Float32Array((O+1)*(J+1)),Po=new Uint8Array((O+1)*(J+1)),Wo=new Float32Array((O+1)*(J+1)),za=new Float32Array((O+1)*(J+1)),Aa=new Float32Array((O+1)*(J+1));for(let e=0,t=0;e<=J;e++){for(let n=0;n<=O;n++,t++){const a=je+n*he,r=$e+e*he;U[t*3]=a,U[t*3+1]=De(a,r),U[t*3+2]=r,Po[t]=xo,Wo[t]=yo,za[t]=bo,Aa[t]=Mo}e%4===3&&await p.yield()}const Na=[];for(let e=0;e<J;e++)for(let t=0;t<O;t++){const n=e*(O+1)+t,a=n+1,r=n+O+1,i=r+1;Math.max(U[n*3+1],U[a*3+1],U[r*3+1],U[i*3+1])<-6||Na.push(n,r,a,a,r,i)}const _e=new o.BufferGeometry;_e.setAttribute("position",new o.BufferAttribute(U,3)),_e.setIndex(Na),_e.setAttribute("aSpur",new o.BufferAttribute(Wo,1)),await p.yield(),_e.computeVertexNormals(),await p.yield();{const e=_e.getAttribute("normal");for(let t=0;t<He.length;t++)He[t]=z(.86,.97,e.getY(t))*(.55+.6*ve.n2(U[t*3]*.013,U[t*3+2]*.013))+z(84,100,U[t*3+1])*.5,t%3e3===2999&&await p.yield()}await p.yield();{const e=new Uint16Array(He.length*4),t=o.DataUtils.toHalfFloat,n=_e.getAttribute("normal");let a=new Float32Array(He.length);for(let i=0;i<a.length;i++)a[i]=n.getY(i);for(let i=0;i<0;i++){const u=a;a=u.slice();const s=O+1;for(let h=1;h<J;h++)for(let v=1;v<O;v++){const m=h*s+v;a[m]=(u[m-s-1]+u[m-s]+u[m-s+1]+u[m-1]+u[m]+u[m+1]+u[m+s-1]+u[m+s]+u[m+s+1])/9}await p.yield()}for(let i=0;i<He.length;i++)e[i*4]=t(U[i*3+1]),e[i*4+1]=t(q(He[i],0,2)+4*Po[i]),e[i*4+2]=t(E(a[i],Math.max(a[i],.9),za[i])),e[i*4+3]=t(Aa[i]+100*Wo[i]),i%3e3===2999&&await p.yield();const r=new o.DataTexture(e,O+1,J+1,o.RGBAFormat,o.HalfFloatType);r.minFilter=r.magFilter=o.NearestFilter,r.generateMipmaps=!1,r.needsUpdate=!0,ye.uLandTex.value=r}await p.yield();const Vn=$({uniforms:ye,vertexShader:`
        attribute float aSpur; varying vec3 vW, vN; varying float vSp;
        void main(){ vW = position; vN = normal; vSp = aSpur; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.); }`,fragmentShader:Fo+`
        varying vec3 vW, vN; varying float vSp;
        void main(){
          vec3 N = vN/max(length(vN), 1e-4); vec2 st; float pat, rec;
          vec3 base = landWool(vW, N, -1., -vSp, st, pat, rec);
          vec3 c = fabricShade(base, st, pat, 0.2, N, vW, rec);
          // where the real yarn stitches lie (the window round the eye) the ground under them is only the deeper lot between the strands
          vec2 cl = floor(vec2(dot(vW.xz, LR), dot(vW.xz, LC))/1.5), ccl = (LR*(cl.x + 0.5) + LC*(cl.y + 0.5))*1.5;      // (stitch by stitch, as the window's own edge is)
          float under = uWinK*gLatt*(1. - step(1.5, pat)*step(pat, 2.5)*step(36. + 6.*lh2(cl + 8.3), distance(ccl, cameraPosition.xz)))*step(distance(ccl, uWinC.xz), (${(Ca-2.5).toFixed(1)} - 9.*lh2(cl + 4.4))*uWinGrow - 0.8);
          if (under > 0.001) { vec3 V = cameraPosition - vW; float dist = length(V); c = mix(c, woolShadeR(base*(0.9 + 0.2*lvn(vW.xz*3.1)), N, N, V/max(dist, 1e-4), 1., dist)*0.92, under); }
          gl_FragColor = vec4(toScene(c), 1.);
        }`}),Rn=new o.Mesh(_e,Vn);N.add(Rn),await p.yield();const Bn=(e,t)=>zn(e,t,Mt).r*(1+.07*ve.n2(e*.011,t*.011));let Fa=()=>{};const Pa={value:300},kn=300,Wa=327.6,be=128,La=404,Ce=.5,fe=Math.round((La-be)/Ce),pe=14,Ct=286,ae=new Float32Array((fe+1)*(pe+2)*3),Me=new Float32Array((fe+1)*(pe+2)),Ta=[],qe=new Float32Array(fe+1),zt=new Float32Array(fe+1);for(let e=0;e<=fe;e++){const t=be+e*Ce;let n=-150,a=60;for(let r=0;r<13;r++){const i=(n+a)/2;Bn(i,t)<wa-.03?n=i:a=i}qe[e]=n,zt[e]=Math.max(Math.min(De(n-30,t)+.4,2+.7*(388-t)),-3),e%80===79&&await p.yield()}for(let e=0,t=0;e<=fe;e++){const n=be+e*Ce,a=zt[e],r=z(-.45,.45,Math.cos(Math.PI*2*(n/2-1)/4))-.5;for(let i=0;i<=pe;i++,t++){const u=i/pe,s=-3+(a+3)*u,h=2.6*Math.sin(Math.min(1,s/30)*Math.PI*.5)-5*u*u+1.6*z(8,0,s);ae[t*3]=qe[e]+1.2*r*z(-3,4,a)+h,ae[t*3+1]=s,ae[t*3+2]=n,Me[t]=i===0?-3:Me[t-1]+Math.hypot(ae[t*3]-ae[t*3-3],s-ae[t*3-2]);{const v=t,m=t+pe+2;e<fe&&Ta.push(v,v+1,m,v+1,m+1,m)}}ae[t*3]=qe[e]-31,ae[t*3+1]=a-.3,ae[t*3+2]=n,Me[t]=a,t++}await p.yield();const ct=new o.BufferGeometry;ct.setAttribute("position",new o.BufferAttribute(ae,3)),ct.setIndex(Ta),ct.computeVertexNormals(),ct.setAttribute("aArc",new o.BufferAttribute(Me,1));{const e=new Float32Array(Me.length);for(let t=0;t<=fe;t++)for(let n=0;n<pe+2;n++)e[t*(pe+2)+n]=Me[t*(pe+2)+pe];ct.setAttribute("aTop",new o.BufferAttribute(e,1))}await p.yield();const Gn=new o.Mesh(ct,$({uniforms:{...ye,uLadder:{value:Ct},uRealZ:Pa},vertexShader:`
        attribute float aArc, aTop; varying vec3 vW, vN; varying float vArc, vTop;
        void main(){ vW = position; vN = normal; vArc = aArc; vTop = aTop; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.); }`,fragmentShader:Fo+`
        uniform float uLadder, uRealZ; varying vec3 vW, vN; varying float vArc, vTop;
        void main(){
          if (vW.z > uLadder && vW.z < uLadder + 6. && vW.y > 2. && vN.y < 0.7) discard;          // the ladder: only its rungs are left
          vec3 N = vN/max(length(vN), 1e-4); vec2 st; float pat, rec;
          bool cap = N.y > 0.7;
          // a second band, low on the Banks, in a gauge the eye can count from the yoal: 0.6 m stitches, the walkers five metres tall
          bool ledge = !cap && vArc > 9. && vArc < 28.2 && vW.z > 150. && vW.z < 327.6;
          if (ledge) { gTrueW = vW; gBandS = 1.6; }
          vec3 base = landWool(cap ? vW : (ledge ? vec3(vW.x, 44. + (vArc - 9.)*0.625, vW.z*0.625) : vec3(vW.x, vArc, vW.z)), cap ? N : vec3(1., 0., 0.), cap ? 0.8 : 0., cap ? 0. : 1., st, pat, rec);
          bool realZ = vW.z > uRealZ;                                    // (three whole garter rows where the hem is real yarn)
          float hemTop = 4.5 + (mod(floor(vW.z*0.5), 2.) < 0.5 ? 0.55 : 0.) + 0.4*sin(3.14159265*fract(vW.z*0.5));      // (a stepped row of stitch tops, never a ruled line)
          bool hem = !cap && (realZ ? vArc < hemTop : vW.y < 4. + sin(vW.z*0.8));
          if (hem) { base = uCream; pat = 1.; st = vec2(vW.z, vArc)/1.5; }      // the cast-on hem in the surf
          vec3 c = fabricShade(base, st, pat, 0.2, N, vW, rec);
          // under the real yarn of the low end the face is only the deeper lot between the strands
          if (realZ && !cap && !ledge && (hem ? (floor(st.y) + 0.9)*1.5 < min(vTop - 0.2, 7.) : (floor(st.y) > 1.5 && (floor(st.y) + 1.)*2. < (vW.z > ${Wa} ? vTop - 0.5 : min(vTop - 0.5, 9.))))) { if (hem && vArc >= 4.5) c = c; else c = hem ? mix(c, c*c*0.55 + c*0.22, 0.85) : mix(c, c*c*0.55 + c*0.22, 0.5)*(mod(floor(st.x), 4.) < 2. ? 1. : 0.92); }
          gl_FragColor = vec4(toScene(c), 1.);
        }`}));N.add(Gn),await p.yield();{const e=pe+2,t=new o.Vector3,n=new o.Vector3,a=[],r=(w,f,S)=>{const C=w*e;let A=0;for(;A<pe-1&&Me[C+A+1]<f;)A++;const L=q((f-Me[C+A])/Math.max(Me[C+A+1]-Me[C+A],1e-4),0,1),T=(C+A)*3;return S.set(E(ae[T],ae[T+3],L),E(ae[T+1],ae[T+4],L),E(ae[T+2],ae[T+5],L))},i=(w,f,S)=>{const C=q((w-be)/Ce,0,fe-.001),A=Math.floor(C);return r(A,f,t),r(A+1,f,n),S.copy(t).lerp(n,C-A)},u=new o.Vector3,s=new o.Vector3,h=new o.Vector3,v=new o.Vector3,m=new o.Vector3,b=new o.Vector3,c=[.5,.9,1,1,.9,.5],l=(w,f,S,C,A,L,T,R=8)=>{const ce=[],X=new o.Vector3;for(let V=0;V<=5;V++){const ue=V===0?0:V===5?1:(V-.5)/4,Ae=E(f,C,ue)*w,ot=E(S,A,ue)*w;i(Ae,ot,u),i(Ae+.4,ot,s),i(Ae,ot+.4,h),m.subVectors(s,u),b.subVectors(h,u),v.crossVectors(b,m).normalize(),v.x<0&&v.negate(),X.add(v),ce.push(u.clone().addScaledVector(v,T*(.8+.4*Math.sin(Math.PI*ue))))}X.normalize();const ke=de(ce,T,R),Se=ke.getAttribute("position"),ze=Se.count,me=new Float32Array(ze*3),tt=new Float32Array(ze*3);for(let V=0;V<ze;V++){const ue=ce[Math.floor(V/(R+1))],Ae=c[Math.floor(V/(R+1))];Se.setXYZ(V,ue.x+(Se.getX(V)-ue.x)*Ae,ue.y+(Se.getY(V)-ue.y)*Ae,ue.z+(Se.getZ(V)-ue.z)*Ae)}for(let V=0;V<ze;V++)me[V*3]=L.r,me[V*3+1]=L.g,me[V*3+2]=L.b,tt[V*3]=X.x,tt[V*3+1]=X.y,tt[V*3+2]=X.z;if(ke.setAttribute("color",new o.BufferAttribute(me,3)),ke.setAttribute("aUp",new o.BufferAttribute(tt,3)),a.push(ke),a.length>=120){d.push(re(a));for(const V of a)V.dispose();a.length=0}},d=[],y=w=>{const f=Math.sin((Math.floor(w/7)+3)*127.1+3.7)*43758.5453;return f-Math.floor(f)>.7?Y.clone().multiplyScalar(.86):Y},M=kn,P=La-1;let F=0,x=0;for(const w of[0,1]){for(let f=Math.floor(M/2);f*2<P;f++){if((f+.5)*2<336!=(w===1))continue;const S=(f%4+4)%4<2,C=Math.round(((f+.5)*2-be)/Ce),A=Me[C*e+pe],L=(f+.5)*2>Wa?A-.5:Math.min(A-.5,9),T=f*2<352?7:6;for(let R=2;(R+1)*2<L;R++){const ce=R>8?5:T;if(S)l(2,f+.5,R-.32,f+.14,R+.78,y(R),.56,ce),l(2,f+.5,R-.32,f+.86,R+.78,y(R),.56,ce);else if(f*2<368)l(2,f+0,R+.55,f+1,R+.55,y(R).clone().multiplyScalar(.88),.36,5);else{const X=y(R).clone().multiplyScalar(.88);l(2,f+.05,R+.3,f+.95,R+.3,X,.43,5),l(2,f+.05,R+.8,f+.95,R+.8,X,.43,5)}F++,F>8&&(F=0,await p.yield())}}for(let f=Math.floor(M/1.5);f*1.5<P;f++){if((f+.5)*1.5<336!=(w===1))continue;const S=q(Math.round(((f+.5)*1.5-be)/Ce),0,fe),C=Me[S*e+pe];for(let A=0;A<3&&(A+.9)*1.5<Math.min(C-.2,7);A++){const T=f*1.5<352?8:6;A%2===0?(l(1.5,f+.5,A-.32,f+.14,A+.78,Q,.41,T),l(1.5,f+.5,A-.32,f+.86,A+.78,Q,.41,T)):l(1.5,f+.09,A+.5,f+.91,A+.5,Q,.41*1.2,T),F++,F>8&&(F=0,await p.yield())}}if(a.length){d.push(re(a));for(const f of a)f.dispose();a.length=0}w===0&&(x=d.reduce((f,S)=>f+S.index.count,0)),await p.yield()}if(d.length){const w=Math.ceil(d.length/2),f=re(d.slice(0,w));await p.yield();const S=d.length>w?re(d.slice(w)):null;await p.yield();const C=S?re([f,S]):f;for(const L of d)L.dispose();S&&(f.dispose(),S.dispose()),await p.yield();const A=C.index.count;Fa=L=>C.setDrawRange(0,L?A:x),N.add(new o.Mesh(C,$({vertexShader:`
            attribute vec3 color, aUp; varying vec3 vW, vN, vC, vUp; varying vec2 vUv;
            void main(){ vW = position; vN = normal; vC = color; vUp = aUp; vUv = uv; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.); }`,fragmentShader:_t+`
            varying vec3 vW, vN, vC, vUp; varying vec2 vUv;
            void main(){
              vec3 N = vN/max(length(vN), 1e-4), V = cameraPosition - vW; float dist = length(V); V = V/max(dist, 1e-4);
              vec3 up = vUp/max(length(vUp), 1e-4) + V*0.7; up = up/max(length(up), 1e-4);      // seen along the face a strand is light on the side it shows and deep where it goes into the cloth
              gl_FragColor = vec4(toScene(fatYarn(vC, N, up, V, vUv, 0.3, dist)), 1.);
            }`})))}}await p.yield();const Va=Math.round((Ct+3-be)/Ce),Ra=qe[Va],At=zt[Va];{const e=new o.PlaneGeometry(14,At+4,1,1);e.rotateY(Math.PI/2),e.translate(Ra-5.6,(At-4)/2+1,Ct+3);const t=e.getAttribute("uv");for(let n=0;n<t.count;n++)t.setXY(n,t.getX(n)*9,t.getY(n)*(At+4));N.add(new o.Mesh(e,nt({pattern:5,stitch:[2,2],color:"#"+H.clone().lerp(Ee,.55).getHexString(),side:o.DoubleSide})))}const Lo=[],Ba=Math.floor((At-3)/2);for(let e=0;e<Ba;e++){const t=3.2+e*2,n=g.range(.35,1),a=g.range(.4,1.5),r=[],i=t/Math.max(At,1),u=2.6*Math.sin(Math.min(1,t/30)*Math.PI*.5)-5*i*i+1.6*z(8,0,t);for(let m=0;m<=12;m++){const b=m/12,c=4*b*(1-b);r.push(new o.Vector3(Ra+u+a*c,t-n*c,Ct-.4+6.8*b))}const s=de(r,.36,5),h=s.getAttribute("position").count,v=new Float32Array(h).fill(e);s.setAttribute("aRung",new o.BufferAttribute(v,1)),Lo.push(s),e%8===7&&await p.yield()}await p.yield();const In=new o.Mesh(re(Lo),$({uniforms:{uColor:{value:Y},uFall:{value:Q},uN:{value:Ba}},vertexShader:`
        attribute float aRung; varying vec3 vW, vN; varying vec2 vUv; varying float vR;
        void main(){ vec3 p = position; float mid = sin(clamp((p.z - ${Ct.toFixed(1)})/6., 0., 1.)*3.14159265);
          p.x += mid*(0.5*sin(uTime*2.3 + aRung*1.3) + 0.6*gust(p))*uGale; p.y += mid*0.2*sin(uTime*3.1 + aRung*2.1);
          vW = p; vN = normal; vUv = uv; vR = aRung; gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.); }`,fragmentShader:`
        uniform vec3 uColor, uFall; uniform float uN; varying vec3 vW, vN; varying vec2 vUv; varying float vR;
        void main(){
          vec3 N = vN/max(length(vN), 1e-4), V = cameraPosition - vW; float dist = length(V); V = V/max(dist, 1e-4);
          float ph = fract((uN - vR)*0.09 - uTime*0.55), run = smoothstep(0.0, 0.06, ph)*(1. - smoothstep(0.16, 0.34, ph));   // cream pouring rung to rung
          gl_FragColor = vec4(toScene(yarnShade(mix(uColor, uFall, run), N, V, vUv, 3., dist)), 1.);
        }`}));N.add(In);for(const e of Lo)e.dispose();await p.yield();const To=.4,Vo=.675,Nt=Math.round((Vo-To)*k.length/1),Ro=[],Ft=[],Un=[0,1,2].map(e=>Math.sin(.435*k.length/84*Math.PI*2+e*Math.PI*2/3)).map((e,t,n)=>n.filter(a=>a<e).length-1),Dn=3.2,_n=1.55,Yt=1.2,Bo=15,ka=[];let Ga=48271;const Pt=()=>(Ga=Ga*16807%2147483647)/2147483647,le=new o.Vector3,Re=new o.Vector3,Wt=new o.Vector3,Ia=new o.Vector3,ko=new o.Vector3(0,1,0);for(let e=0;e<3;e++){const t=[],n=[],a=[];for(let l=0;l<=Nt;l++){const d=To+(Vo-To)*l/Nt,y=d*k.length,M=y/84*Math.PI*2+e*Math.PI*2/3;k.pointAt(d,le),k.tangentAt(d,Re),Wt.crossVectors(Re,ko).normalize(),Ia.crossVectors(Wt,Re);const P=z(0,.055,Vo-d),F=z(.415,.458,d),x=8*Math.pow(1-z(.405,.44,d),2),w=wo(d),f=-5.3,S=1-z(.43,.52,d);le.addScaledVector(Ia,f-7*(1-P)-x+F*_n*(1+.3*S)*Math.sin(2*M)).addScaledVector(Wt,E(Un[e]*3.1,Dn*(1+.5*S)*Math.sin(M),F)+w),Ft.length===e&&le.y>.15&&Ft.push(le.clone()),t.push(le.clone()),n.push(y/10*Math.PI*2+e*2.1),a.push(S*F),(l&31)===31&&await p.yield()}await p.yield();const r=de(t,Yt,Bo),i=r.getAttribute("position"),u=r.getAttribute("normal"),s=i.count,h=Bo+1;await p.yield();const v=new Float32Array(s),m=new Float32Array(s*3),b=new Float32Array(s*3),c=[Te,Ve,Te.clone().lerp(Ve,.5)][e];for(let l=0;l<s;l++){const d=Math.floor(l/h),y=l%h,M=y/Bo*Math.PI*2-n[d],P=Yt*.12*a[d];i.setXYZ(l,i.getX(l)+u.getX(l)*P,i.getY(l)+u.getY(l)*P,i.getZ(l)+u.getZ(l)*P),v[l]=M,Re.subVectors(t[Math.min(d+1,Nt)],t[Math.max(d-1,0)]).normalize(),m[l*3]=Re.x,m[l*3+1]=Re.y,m[l*3+2]=Re.z,b[l*3]=c.r,b[l*3+1]=c.g,b[l*3+2]=c.b,(l&1023)===1023&&await p.yield()}r.setAttribute("color",new o.BufferAttribute(b,3)),r.setAttribute("aLobe",new o.BufferAttribute(v,1)),r.setAttribute("aTan",new o.BufferAttribute(m,3)),Ro.push(r),await p.yield();for(let l=6;l<(Nt-6)*2;l++){if(Pt()>.75*D||t[l>>1].y<1.5)continue;const d=l>>1,y=new o.Vector3().subVectors(t[Math.min(d+1,Nt)],t[Math.max(d-1,0)]).normalize();Pt(),Pt(),ka.push({p:t[d].clone().addScaledVector(y,(l&1)*.5),n:y,len:.3+.3*Pt(),w:.7+.6*Pt(),color:c})}await p.yield()}await p.yield();const qn=new o.Mesh(re(Ro),$({uniforms:{uIndD:{value:Te},uIndL:{value:Ve}},vertexShader:`
        attribute vec3 color, aTan; varying vec3 vW, vN, vC, vT; varying vec2 vUv;
        void main(){
          float ph = uv.y*3. + (uv.x - uTime*1.6)*0.5 + color.b*7.;                 // three plies, real in the outline too: each a lobe of the section, turning as it slides uphill
          vec3 p = position + normal*${Yt.toFixed(2)}*(0.2*abs(sin(ph*3.14159265)) - 0.12);
          vW = p; vN = normal; vC = color; vUv = uv; vT = aTan; gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.); }`,fragmentShader:`
        uniform vec3 uIndD, uIndL; varying vec3 vW, vN, vC, vT; varying vec2 vUv;
        void main(){
          vec3 N = vN/max(length(vN), 1e-4), T = vT/max(length(vT), 1e-4), V = cameraPosition - vW; float dist = length(V); V = V/max(dist, 1e-4);
          float x = vUv.x - uTime*1.6, seed = vC.b*7.;
          // (a long lay: a groove comes round every two diameters, so seen along the rope from the bow, foreshortened, the plies still cross it on the slant)
          float ph = vUv.y*3. + x*0.5 + seed, fw = fwidth(vUv.x)*0.5 + fwidth(vUv.y)*3., fine = 1. - smoothstep(0.25, 0.6, fw);
          float id = floor(ph), fr = ph - id, sn = abs(sin(ph*3.14159265)), p = mod(id, 3.);
          float e = (fr - 0.5)*1.5*fine, groove = (1. - smoothstep(0.0, 0.2, sn))*fine;
          vec3 Nc = N*cos(e) + cross(T, N)*sin(e) + T*(fr - 0.5)*0.3*fine; Nc = Nc/max(length(Nc), 1e-4);      // each ply has a round back of its own
          vec3 lot = p < 0.5 ? vC : (p < 1.5 ? mix(vC, uIndL, 0.85) : mix(vC, uIndD, 0.85));      // marled: each ply its own lot, a hard step of the two indigos
          // ... and each ply is four strands laid side by side along it (a groove of the deeper lot between two, each strand lighter along its
          // back and a step of its own in the lot), and each strand is fibre, seen when the rope is at arm's length: all of it runs with the lay
          float ph2 = ph*4., fw2 = fw*4., fine2 = (1. - smoothstep(0.3, 0.7, fw2))*fine;
          float s2 = abs(sin(ph2*3.14159265)), g2 = (1. - smoothstep(0.0, 0.3, s2))*fine2, hl = hash11(mod(floor(ph2), 57.)*1.7 + seed);
          float fine3 = (1. - smoothstep(0.3, 0.7, fw*12.))*fine2, s3 = abs(sin(ph*12.*3.14159265));
          vec3 base = mix(mix(vC, uIndL, 0.05), lot, fine)*mix(1., 0.9 + 0.13*sn, fine)*mix(1., (0.84 + 0.22*s2)*(0.93 + 0.14*hl), fine2)*mix(1., 0.94 + 0.09*s3, fine3);
          groove = max(groove, max(g2*0.8, (1. - smoothstep(0.0, 0.35, s3))*fine3*0.3));
          float under = 1. - smoothstep(-0.75, 0.05, N.y);
          vec3 nr = mix(N, V, 0.6); nr = nr/max(length(nr), 1e-4);                       // (no pale film at the outline: the fringe is real hairs)
          gl_FragColor = vec4(toScene(woolShadeR(base, Nc, nr, V, max(groove*0.92, under*0.9), dist)), 1.);
        }`}));N.add(qn);{const e=new o.Mesh(Dt(ka),bt(`
      attribute vec3 aDir, aCol; attribute vec4 aCorner;                              // position = a point of the rope's centre line, aDir = its tangent x the hair's length
      void tuft(out vec3 root, out vec3 d, out vec3 col, out vec2 cr, out float seed, out float aMul){
        float len = max(length(aDir), 1e-4), h = fract(aCorner.z*7.31); vec3 T = aDir/len, tc = cameraPosition - position;
        vec3 sd = cross(T, tc); float sl = length(sd); sd = sd/max(sl, 1e-4); if (sd.y < 0.) sd = -sd;      // the rope's upper outline, as the eye sees it
        root = position + sd*${(Yt*.99).toFixed(3)}; d = (sd + T*(h - 0.5)*0.8)*len; col = aCol; cr = aCorner.xy; seed = aCorner.z;
        aMul = smoothstep(0.2, 0.5, sl/max(length(tc), 1e-3));                          // (a rope seen end-on has no outline to fringe)
      }`,oe,{near:[2.5,6],far:[70,120],minPx:3,grow:2,hairW:.3,maxPx:10,hairs:7,alpha:.85}));e.frustumCulled=!1,e.renderOrder=3,N.add(e)}for(const e of Ro)e.dispose();await p.yield();const Go=new o.Group;N.add(Go);{le.set(0,0,0);for(const u of Ft)le.addScaledVector(u,1/Ft.length);le.y=.42;const e=[],t=u=>{const s=[];for(let h=0;h<=5;h++){const v=h/5;s.push(new o.Vector3((-.78+1.56*v)*u,(.42*Math.sin(v*Math.PI)-.1)*u,.16*Math.sin(v*Math.PI*2)*u))}return s};let n=7193;const a=()=>(n=n*16807%2147483647)/2147483647;for(const u of Ft)for(const[s,h,v]of[[8,1.9,1],[9,3.3,.8]])for(let m=0;m<s;m++){const b=(m+a()*.5)/s*Math.PI*2,c=de(t(v*(.85+.3*a())),.3*v,5);c.rotateY(b+Math.PI/2+(a()-.5)*.5),c.translate(u.x+Math.cos(b)*h*(.9+.2*a()),.16+.1*a(),u.z+Math.sin(b)*h*(.9+.2*a())),e.push(c)}if(e.length){Go.add(new o.Mesh(re(e),ha({color:W[0],plies:2})));for(const u of e)u.dispose()}const r=new o.PlaneGeometry(22,22);r.rotateX(-Math.PI/2),r.translate(le.x,le.y,le.z);const i=new o.Mesh(r,$({uniforms:{uC:{value:le.clone()}},vertexShader:`
          varying vec3 vW;
          void main(){ vW = position; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.); }`,fragmentShader:`
          uniform vec3 uC; varying vec3 vW;
          void main(){
            vec2 q = vW.xz - uC.xz; float rad = length(q)/11., ang = atan(q.y, q.x + 1e-5);
            float ring = rad*3.4 - fract(uTime*0.3), bump = abs(fract(ring) - 0.5)*2.;      // the rings spread and are replaced from the middle
            float seg = abs(sin(ang*11.));
            float wd = (0.5 - 0.28*rad)*(0.5 + 0.5*seg);
            if (rad > 0.97 || rad < 0.3 || bump > wd) discard;
            vec3 V = cameraPosition - vW; float dist = length(V);
            float rnd = sqrt(max(1. - (bump/wd)*(bump/wd), 0.));
            gl_FragColor = vec4(toScene(woolShade(uCream, normalize(vec3(0., 1., 0.) + vec3(q.x, 0., q.y)/max(length(q), 1e-3)*(fract(ring) - 0.5)), V/max(dist, 1e-4), 1. - rnd, dist)), 1.);
          }`}));N.add(i)}await p.yield();const j=await ur(p,{palette:W,detail:D});j.object.position.copy(ma),j.object.rotation.y=j.anchors.rotationY,N.add(j.object),j.object.updateMatrixWorld(!0),await p.yield();const Ua=[];for(let e=0;e<=5;e++){const t=e/5;Ua.push(new o.Vector3(-.78+1.56*t,.42*Math.sin(t*Math.PI)-.12,.16*Math.sin(t*Math.PI*2)))}const Io=de(Ua,.3,5),ut=new o.InstancedBufferGeometry;ut.index=Io.index;for(const e of["position","normal","uv"])ut.setAttribute(e,Io.getAttribute(e));const Da={value:1},Lt=30,Kt=Math.round(18*Math.max(D,.7)),Uo=new Float32Array(Lt*Kt*2);for(let e=0,t=0;e<Kt;e++)for(let n=0;n<Lt;n++,t++)Uo[t*2]=n-Lt/2,Uo[t*2+1]=e-4;ut.setAttribute("aCell",new o.InstancedBufferAttribute(Uo,2)),ut.instanceCount=Lt*Kt,ut.setAttribute("aRing",new o.InstancedBufferAttribute(new Float32Array(Lt*Kt*4).map((e,t)=>t%4<2?1:0),4));const _a=[];for(let e=0;e<=4;e++){const t=e/4;_a.push(new o.Vector3(-.78+1.56*t,.42*Math.sin(t*Math.PI)-.12,.16*Math.sin(t*Math.PI*2)))}const Do=de(_a,.3,3),dt=new o.InstancedBufferGeometry,_o=[],qa=[];dt.index=Do.index;for(const e of["position","normal","uv"])dt.setAttribute(e,Do.getAttribute(e));for(const[e,t,n,a]of[[1.4,2,1.3,72],[3,3,2.6,165],[7,9,5.4,380]]){const r=Math.ceil(a*.72/(1.5*e)),i=Math.ceil(a/(3*t)),u=Math.max(D,.7);for(let s=Math.floor(a*.36/(3*t))-1;s<=i;s++)for(let h=-r;h<=r;h++){const v=Math.abs(h)*1.5*e,m=s*3*t;Math.hypot(v,m)>a*1.03||v>1.15*m+22||u<1&&(h*7+s*13&3)===0||(_o.push(h,s),qa.push(e,t,n,a))}}dt.setAttribute("aCell",new o.InstancedBufferAttribute(new Float32Array(_o),2)),dt.setAttribute("aRing",new o.InstancedBufferAttribute(new Float32Array(qa),4)),dt.instanceCount=_o.length/2;const Oa=e=>$({uniforms:{...Pe,...ye,uRingK:Da,uSel:{value:e}},vertexShader:Ht+`
        attribute vec2 aCell; attribute vec4 aRing; uniform float uRowSpeed, uRingK, uSel, uNearK; uniform vec3 uOrigin, uNearS, uDeep, uLight, uFoam; varying vec3 vW, vN, vC; varying vec3 vUs;
        void main(){
          // aRing = (column width in stitches, every n-th ridge, size, the ring's outer edge in metres; 0 = the rows round the keel)
          vec2 ctr = uSel > 0.5 ? uOrigin.xz : uNearS.xz;                    // the round near gauge counts its cells from just ahead of the bow
          float S = ${Z.toFixed(2)}, G = aRing.x, nR = aRing.y, camRow = (ctr.y - uRowSpeed*uTime)/S;
          float col = G*(floor(ctr.x/(S*G)) + aCell.x), row = 2.*nR*(floor(camRow*0.5/nR) + aCell.y) + 1.;
          vec3 c = vec3(col*S + 0.5*S*G, 0., (row + 0.66)*S + uRowSpeed*uTime);
          vec2 dq = c.xz - uOrigin.xz; if (dq.y > 0.) dq.y *= 0.66;
          float dist = length(dq), fade = 1. - smoothstep(17., 26., dist);
          if (aRing.w > 0.5) { dist = length(c.xz - uOrigin.xz); fade = uRingK*aRing.z*smoothstep(aRing.w*0.38, aRing.w*0.52, dist)*(1. - smoothstep(aRing.w*0.8, aRing.w, dist)); }
          else { float nearSel = uNearK*step(distance(c.xz, uNearS.xz), 10.5); fade *= mix(nearSel, 1. - nearSel, uSel)*shoreK(c.xz); }
          float amp = 0.34*(1. - smoothstep(16., 27., dist))*(0.75 + 0.25*sin(c.x*0.21 + floor(row*0.5)*2.1));
          c.y = amp*(0.5 - 0.5*sin(3.14159265*(row + 0.66)));
          vec3 p = c + position*fade*(0.9 + 0.2*hash11(col*7.3 + row));
          float ridge = floor(row*0.5/nR), m9 = mod(ridge + 1., nR < 1.5 ? 5. : 9.), h = hash11(ridge*1.37 + (nR - 1.)*7.31);
          vC = m9 < 0.5 ? uFoam : (h < 0.15 ? uLight : (h > 0.9 ? mix(uDeep, uLight, 0.4) : (mod(ridge, 2.) < 0.5 ? uDeep*0.9 : mix(uDeep, uLight, 0.26))));
          vW = p; vN = normal; vUs = vec3(uv, hash11(col*3.1 + row*1.7)); gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.);
        }`,fragmentShader:_t+`
        varying vec3 vW, vN, vC; varying vec3 vUs;
        void main(){
          vec3 N = vN/max(length(vN), 1e-4), V = cameraPosition - vW; float dist = length(V); V = V/max(dist, 1e-4);
          gl_FragColor = vec4(toScene(fatYarn(vC, N, vec3(0., 1., 0.), V, vUs.xy, vUs.z, dist)), 1.);
        }`}),Xt=new o.Mesh(ut,Oa(1));Xt.frustumCulled=!1,N.add(Xt);const qo=new o.Mesh(dt,Xt.material);qo.frustumCulled=!1,N.add(qo);const Ea=7,ja=4,Ye=[];for(let e=-ja;e<=ja;e++)for(let t=-Ea;t<=Ea;t++)Ye.push(t,e);const Zt=new o.InstancedBufferAttribute(new Float32Array(Ye),2),$a=[];for(let e=0;e<=8;e++){const t=e/8;$a.push(new o.Vector3(-.82+1.64*t,.66*Math.sin(t*Math.PI)-.14,.16*Math.sin(t*Math.PI*2)))}const Ha=de($a,.25,6),vt=new o.InstancedBufferGeometry;vt.index=Ha.index;for(const e of["position","normal","uv"])vt.setAttribute(e,Ha.getAttribute(e));vt.setAttribute("aCell",Zt),vt.instanceCount=Ye.length/2,vt.setAttribute("aRing",new o.InstancedBufferAttribute(new Float32Array(Ye.length*2).map((e,t)=>t%4<2?1:0),4));const Oo=new o.Mesh(vt,Oa(0));Oo.frustumCulled=!1,N.add(Oo);const Eo=`
      uniform float uRowSpeed, uNearK; uniform vec3 uOrigin, uNearS, uDeep, uLight, uFoam;
      float seaY(vec2 xz, out float sl){                                      // the swell under a point of the Sound (as the near sea's own vertex shader has it)
        float sy = (xz.y - uRowSpeed*uTime)/${Z.toFixed(2)};
        vec2 dq = xz - uOrigin.xz; if (dq.y > 0.) dq.y *= 0.66;
        float amp = 0.34*(1. - smoothstep(16., 27., length(dq)))*(0.75 + 0.25*sin(xz.x*0.21 + floor(sy*0.5)*2.1));
        sl = -amp*0.5*3.14159265*cos(3.14159265*sy)/${Z.toFixed(2)};
        return amp*(0.5 - 0.5*sin(3.14159265*sy));
      }
      vec3 ridgeWool(float ridge, float purl){
        float m5 = mod(ridge + 1., 5.), h = hash11(ridge*1.37);
        return m5 < 0.5 ? mix(uDeep, uFoam, purl) : (h < 0.15 ? uLight : (h > 0.9 ? mix(uDeep, uLight, 0.4) : (mod(ridge, 2.) < 0.5 ? uDeep*0.9 : mix(uDeep, uLight, 0.26))));
      }`,Ya=[];for(let e=0;e<=8;e++){const t=e/8,n=Math.sin(t*Math.PI);Ya.push(new o.Vector3(-.82+1.64*t,.2*n-.06,-.62*n))}const Ka=de(Ya,.25,6),Tt=new o.InstancedBufferGeometry;Tt.index=Ka.index;for(const e of["position","normal","uv"])Tt.setAttribute(e,Ka.getAttribute(e));Tt.setAttribute("aCell",Zt),Tt.instanceCount=Ye.length/2;const jo=new o.Mesh(Tt,$({uniforms:{...Pe,...ye},vertexShader:Ht+Eo+`
        attribute vec2 aCell; varying vec3 vW, vN, vC; varying vec3 vUs;
        void main(){
          float S = ${Z.toFixed(2)}, nearRow = (uNearS.z - uRowSpeed*uTime)/S;
          float col = floor(uNearS.x/S) + aCell.x, row = 2.*(floor(nearRow*0.5) + aCell.y) + 1.;
          vec2 cc = vec2((col + 1.)*S, (row + 0.52)*S + uRowSpeed*uTime);
          float sc = uNearK*step(distance(vec2(cc.x - 0.5*S, cc.y + 0.14*S), uNearS.xz), 10.5)*shoreK(vec2(cc.x - 0.5*S, cc.y + 0.14*S)), sl;
          vec3 p = vec3(cc.x, seaY(cc, sl), cc.y) + position*sc*(0.9 + 0.2*hash11(col*4.7 + row*1.3));
          vC = ridgeWool(floor(row*0.5), 1.)*0.94;
          vW = p; vN = normal; vUs = vec3(uv, hash11(col*2.3 + row*5.1)); gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.);
        }`,fragmentShader:_t+`
        varying vec3 vW, vN, vC; varying vec3 vUs;
        void main(){
          vec3 N = vN/max(length(vN), 1e-4), V = cameraPosition - vW; float dist = length(V); V = V/max(dist, 1e-4);
          gl_FragColor = vec4(toScene(fatYarn(vC, N, vec3(0., 1., 0.), V, vUs.xy, vUs.z, dist)), 1.);
        }`}));jo.frustumCulled=!1,N.add(jo);const $o=Nn(6,[[-.07,.3,.24],[0,.82,.3],[.4,1,.35],[.86,.9,.14],[1,.55,-.1]],.26);$o.setAttribute("aCell",Zt),$o.instanceCount=Ye.length/2;const Ho=new o.Mesh($o,$({uniforms:{...Pe,...ye},side:o.DoubleSide,vertexShader:Ht+Eo+`
        attribute vec2 aCell, aT; attribute vec3 aOff; varying vec3 vW, vN, vC, vUp; varying vec3 vUs;
        void main(){
          float S = ${Z.toFixed(2)}, nearRow = (uNearS.z - uRowSpeed*uTime)/S;
          float col = floor(uNearS.x/S) + aCell.x, row = 2.*(floor(nearRow*0.5) + aCell.y);
          vec2 cc = vec2((col + 0.5)*S, (row + 0.5)*S + uRowSpeed*uTime);
          float sc = uNearK*(1. - smoothstep(9., 11.5, distance(cc, uNearS.xz)))*shoreK(cc);
          vec2 xz = vec2((col + position.x)*S, (row + position.y)*S + uRowSpeed*uTime);
          float sl, y = seaY(xz, sl);
          vec3 nrm = normalize(vec3(0., 1., -sl)), Tb = normalize(vec3(0., sl, 1.));
          vec3 n = vec3(aOff.x, 0., 0.) + Tb*aOff.y + nrm*aOff.z;
          vec3 p = vec3(xz.x, y, xz.y) + nrm*(position.z - 0.2) + n*0.26*(0.92 + 0.2*hash11(col*7.3 + row));
          p = mix(vec3(cc.x, -0.4, cc.y), p, sc);
          vC = ridgeWool(floor(row*0.5), 0.)*0.9;
          vW = p; vN = n; vUp = nrm; vUs = vec3(uv, hash11(col*2.3 + row*5.1)); gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.);
        }`,fragmentShader:_t+`
        varying vec3 vW, vN, vC, vUp; varying vec3 vUs;
        void main(){
          vec3 N = vN/max(length(vN), 1e-4), V = cameraPosition - vW; float dist = length(V); V = V/max(dist, 1e-4);
          gl_FragColor = vec4(toScene(fatYarn(vC, N, vUp/max(length(vUp), 1e-4), V, vUs.xy, vUs.z, dist)), 1.);
        }`}));Ho.frustumCulled=!1,N.add(Ho);const Vt=new o.InstancedBufferGeometry;Vt.setAttribute("position",new o.Float32BufferAttribute([-.5,0,0,.5,0,0,-.5,1,0,.5,1,0],3)),Vt.setIndex([0,1,2,2,1,3]),Vt.setAttribute("aCell",Zt),Vt.instanceCount=Ye.length/2;const Qt=new o.Mesh(Vt,bt(Ht+Eo+`
      attribute vec2 aCell;
      void tuft(out vec3 root, out vec3 d, out vec3 col, out vec2 cr, out float seed, out float aMul){
        float S = ${Z.toFixed(2)}, nearRow = (uNearS.z - uRowSpeed*uTime)/S;
        float c0 = floor(uNearS.x/S) + aCell.x, row = 2.*(floor(nearRow*0.5) + aCell.y) + 1.;
        float h = hash11(c0*5.3 + row*2.9), sl;
        vec2 xz = vec2((c0 + 0.5)*S + (h - 0.5)*0.5, (row + 0.66)*S + uRowSpeed*uTime);      // rooted on the crest of its bump
        root = vec3(xz.x, seaY(xz, sl) + 0.62, xz.y);
        d = vec3((h - 0.5)*0.4, 0.34 + 0.3*hash11(c0*1.9 + row), 0.08);
        col = ridgeWool(floor(row*0.5), 1.);
        cr = vec2(position.x*(1.0 + 0.6*h), position.y); seed = h;
        aMul = uNearK*step(0.3, hash11(c0*9.1 + row*4.3))*(1. - smoothstep(10., 13., distance(xz, uNearS.xz)))*step(0.5, shoreK(xz));
      }`,oe,{near:[4.5,8],minPx:3,grow:1.5,hairW:.3,maxPx:15,hairs:9,alpha:.85,uniforms:{...Pe,...ye}}));Qt.frustumCulled=!1,Qt.renderOrder=3,N.add(Qt),await p.yield();const Xa=e=>$({uniforms:{uKind:{value:e},uRowSpeed:Pe.uRowSpeed},vertexShader:`
        attribute vec3 iPos, iCol; attribute vec4 iPar; uniform float uKind, uRowSpeed; varying vec3 vW, vN, vC; varying vec2 vUv;
        void main(){
          float cy = cos(iPar.x), sy = sin(iPar.x); vec3 p = position*iPar.y, n = normal;
          p = vec3(p.x*cy + p.z*sy, p.y, -p.x*sy + p.z*cy); n = vec3(n.x*cy + n.z*sy, n.y, -n.x*sy + n.z*cy);
          vec3 w = iPos + p;
          if (uKind < 0.5) { float hgt = clamp(position.y/1.6, 0., 1.), g = gust(iPos + iPar.z*9.);
            float lean = hgt*hgt*(0.35 + 0.9*g)*uGale*iPar.y*1.1 + hgt*0.12*sin(uTime*5. + iPar.z*40.);
            w += uWind*lean; w.y -= lean*0.45*hgt; }
          else { float al = clamp(position.x/8., 0., 1.);
            w.y += al*(0.9*sin(uTime*0.9 + iPar.z*6.283 + position.x*0.5) + 0.5) + 0.3*sin(3.14159265*(w.z - uRowSpeed*uTime)/1.5)*al;
            w.z += al*al*1.6*sin(uTime*0.6 + iPar.z*17.); }
          vW = w; vN = n; vC = iCol; vUv = uv; gl_Position = projectionMatrix*viewMatrix*vec4(w, 1.);
        }`,fragmentShader:`
        varying vec3 vW, vN, vC; varying vec2 vUv;
        void main(){
          vec3 N = vN/max(length(vN), 1e-4), V = cameraPosition - vW; float dist = length(V); V = V/max(dist, 1e-4);
          gl_FragColor = vec4(toScene(yarnShade(vC, N, V, vUv, 2., dist)), 1.);
        }`}),Za=[],Yo=(e,t)=>{Za.push(e);const n=new o.InstancedBufferGeometry;n.index=e.index;for(const s of["position","normal","uv"])n.setAttribute(s,e.getAttribute(s));const a=t.length,r=new Float32Array(a*3),i=new Float32Array(a*3),u=new Float32Array(a*4);return t.forEach((s,h)=>{r.set([s.p.x,s.p.y,s.p.z],h*3),i.set([s.c.r,s.c.g,s.c.b],h*3),u.set([s.yaw,s.s,s.ph,0],h*4)}),n.setAttribute("iPos",new o.InstancedBufferAttribute(r,3)),n.setAttribute("iCol",new o.InstancedBufferAttribute(i,3)),n.setAttribute("iPar",new o.InstancedBufferAttribute(u,4)),n.instanceCount=a,n},Jt=(e,t,n)=>(k.pointAt(e,le),k.tangentAt(e,Re),Wt.crossVectors(Re,ko).normalize(),n.copy(le).addScaledVector(Wt,t>0?t+1.6+2*wo(e):t-1.6),n.y=De(n.x,n.z),n),Qa=(e,t)=>Math.hypot(De(e+1.5,t)-De(e-1.5,t),De(e,t+1.5)-De(e,t-1.5))/3>.75,Ja=[];for(let e=0;e<=5;e++){const t=Math.PI*(e/5);Ja.push(new o.Vector3(-.42*Math.cos(t),1.6*Math.sin(t)*(.75+.25*Math.sin(t)),0))}const en=[],On=Math.round(1200*D*ge),En=[I,I,H,I.clone().lerp(Q,.4),I.clone().lerp(H,.4)];for(let e=0;e<On;e++){const t=g.range(.43,.955),n=(g.chance(.5)?1:-1)*(5.5+13*Math.pow(g(),1.6)),a=Jt(t,n,new o.Vector3),r={p:a,c:g.pick(En),yaw:g.range(0,Math.PI),s:g.range(.6,1.05),ph:g()};Qa(a.x,a.z)||en.push(r),e%60===59&&await p.yield()}const tn=new o.Mesh(Yo(de(Ja,.16,4),en),Xa(0));tn.frustumCulled=!1,N.add(tn);const on=[];for(let e=0;e<=10;e++)on.push(new o.Vector3(e*.8,-.2,.25*Math.sin(e*.9)));const an=[],jn=Math.round(100*Math.max(D,.7));for(let e=0;e<jn;e++){const t=g.int(20,fe-60),n=be+t*Ce;an.push({p:new o.Vector3(qe[t]+3.2,.1,n),c:e%5===0?H.clone().lerp(I,.35):H,yaw:g.range(-.5,.5),s:g.range(.8,1.25),ph:g()})}const nn=new o.Mesh(Yo(de(on,.33,5),an),Xa(1));nn.frustumCulled=!1,N.add(nn),await p.yield();const ne=new o.Group;ne.name="carried",ne.matrixAutoUpdate=!1,N.add(ne);const $n=new o.Vector3(0,-1,3.3),ht=.12;{const n=new Float32Array(1215),a=new Float32Array(405*2),r=[],i=[],u=[];for(let x=0,w=0;x<=26;x++){const f=x/26,S=.9-7.3*f,C=1.22*Math.pow(Math.sin(Math.PI*q(.2+.8*f,0,1)),.62)*(1-z(.86,1,f)*.92),A=-2+1.25*f*f*f,L=-1.08+.78*Math.pow(f,2.4);for(let T=0;T<=14;T++,w++){const R=-1+2*T/14,ce=Math.abs(R),X=Math.sign(R)*C*Math.pow(ce,.62),ke=E(A,L,Math.pow(ce,1.9));if(n[w*3]=X,n[w*3+1]=ke,n[w*3+2]=S,a[w*2]=R*1.9,a[w*2+1]=f*7.3,x<26&&T<14){const Se=w,ze=w+14+1;r.push(Se,ze,Se+1,Se+1,ze,ze+1)}}i.push(new o.Vector3(-C-.02,L+.03,S)),u.push(new o.Vector3(C+.02,L+.03,S))}const s=new o.BufferGeometry;s.setAttribute("position",new o.BufferAttribute(n,3)),s.setAttribute("uv",new o.BufferAttribute(a,2)),s.setIndex(r),s.computeVertexNormals(),ne.add(new o.Mesh(s,nt({pattern:0,stitch:[ht,ht],color:W[2],stripe:[7,2],stripeColor:W[0],side:o.DoubleSide})));const h=[de(i,.075,6),de(u,.075,6)],v=(x,w)=>{const f=x.getAttribute("position").count,S=new Float32Array(f*3);for(let C=0;C<f;C++)S[C*3]=w.r,S[C*3+1]=w.g,S[C*3+2]=w.b;return x.setAttribute("color",new o.BufferAttribute(S,3)),x};h.forEach(x=>v(x,Q));const m=(x,w,f)=>new o.Vector3(x,w,f),b=m(-.3,0,-3),c=(x,w,f,S=10)=>{const C=[];for(let A=0;A<=S;A++){const L=A/S;C.push(x.clone().lerp(w,L).add(m(0,-f*4*L*(1-L),0)))}return C};for(const[x,w,f]of[[m(-.3,5.6,-3),m(1.25,-.9,.6),.1],[m(-.3,5.6,-3),m(-1.2,-.9,.6),.1],[m(-3.75,.95,-4.1),m(-1.15,-.9,-1.2),.3]])h.push(v(de(c(x,w,f),.022,4),I));ne.add(new o.Mesh(re(h),ha({vertexColors:!0,plies:2}))),h.forEach(x=>x.dispose());{const x=[];let w=5531;const f=()=>(w=w*16807%2147483647)/2147483647;for(const[C,A]of[[i,-1],[u,1]])for(let L=1;L<C.length-1;L++)for(let T=0;T<3;T++){const R=C[L].clone().lerp(C[L+1],f());x.push({p:R.add(m(A*.03,.055,0)),n:m(A*.45,.89,0),len:.012+.014*f(),w:.16+.1*f(),color:Q})}const S=new o.Mesh(Dt(x),bt(wr,oe,{near:[.5,1.4],minPx:2.5,hairs:16,alpha:.5}));S.frustumCulled=!1,S.renderOrder=3,ne.add(S)}const l=[];for(const x of[-2.35,-4.3]){const w=(.9-x)/7.3,f=1.22*Math.pow(Math.sin(Math.PI*(.2+.8*w)),.62),S=-1.08+.78*Math.pow(w,2.4)-.2,C=new o.BoxGeometry(f*2-.1,.07,.34);C.translate(0,S,x);const A=C.getAttribute("uv"),L=C.getAttribute("position");for(let T=0;T<A.count;T++)A.setXY(T,L.getX(T),L.getZ(T)+L.getY(T));l.push(C)}ne.add(new o.Mesh(re(l),nt({pattern:1,stitch:[ht,ht*.8],color:W[1]}))),l.forEach(x=>x.dispose());const d=(x,w)=>{const f=[[0,0],[w*.5,x*.01],[w,x*.07],[w,x*.94],[w*.7,x*.95],[w*1.9,x*.965],[w*2.1,x*.98],[w*1.5,x*.995],[.001,x]].map(C=>new o.Vector2(C[0],C[1])),S=new o.LatheGeometry(f,10);return S.rotateZ(-Math.PI/2),S},y=fa({}),M=new o.Mesh(d(7.9,.07),y);M.rotation.z=-Math.PI/2,M.position.set(b.x,5.9,b.z),ne.add(M);const P=new o.Mesh(d(4.6,.045),y);P.position.set(-4.1,4.62,-3.72),P.rotation.y=-.215,ne.add(P);const F=new o.Mesh(d(.62,.05),y);F.rotation.z=-Math.PI/2,F.position.set(0,-.16,-6.44),ne.add(F)}const rn=`uniform float uFull;
        vec3 sailP(vec2 q){
          vec3 a = mix(vec3(-3.75, 0.95, -4.1), vec3(0.12, 1.12, -2.92), q.x), b = mix(vec3(-3.95, 4.55, -3.7), vec3(0.2, 4.6, -2.8), q.x);
          vec3 p = mix(a, b, q.y); float bel = sin(q.x*3.14159265)*sin(clamp(q.y*1.15, 0., 1.)*3.14159265*0.9 + 0.15);
          float g = gust((modelMatrix*vec4(p, 1.)).xyz);
          p.z -= bel*(0.85 + 0.22*g + 0.05*sin(uTime*5.3 + q.y*9.))*uFull; p.y += bel*0.12;
          p.z -= (1. - q.y)*sin(q.x*3.14159265)*0.12*sin(uTime*7. + q.x*11.);      // the foot shivers
          return p; }`,Hn=new o.PlaneGeometry(1,1,18,14),sn={uSail:{value:ee(xe)},uEdgeC:{value:ee(Le)},uEdgeOn:{value:G===2?1:0},uFull:{value:se===1?1.25:1}},Ko=new o.Mesh(Hn,$({side:o.DoubleSide,uniforms:sn,vertexShader:`
        varying vec3 vW, vN; varying vec2 vUv;
        ${rn}
        void main(){ vec2 q = uv; vec3 p = sailP(q), dx = sailP(q + vec2(0.02, 0.)) - p, dy = sailP(q + vec2(0., 0.02)) - p;
          vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz; vN = mat3(modelMatrix)*cross(dx, dy); vUv = uv*vec2(4.0, 3.6);
          gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
        uniform vec3 uSail, uEdgeC; uniform float uEdgeOn; varying vec3 vW, vN; varying vec2 vUv;
        void main(){
          vec3 N = vN/max(length(vN), 1e-4); if (dot(N, cameraPosition - vW) < 0.) N = -N;
          vec2 st = vUv/vec2(${ht.toFixed(2)}, ${(ht*.8).toFixed(3)});
          float e = min(min(vUv.x, 4.0 - vUv.x), min(vUv.y, 3.6 - vUv.y));
          vec3 base = mix(mix(uSail, uSail*uSail*1.25, 0.3 + 0.25*step(0.6, hash11(floor(st.y/9.)))), uEdgeC, uEdgeOn*step(e, 0.3));      // deep-dyed, lot by lot
          gl_FragColor = vec4(toScene(fabricShade(base, st, 1., 0.22, N, vW, 0.1)), 1.);
        }`}));Ko.frustumCulled=!1,ne.add(Ko);{const e=[],t=ee(xe);let n=7741;const a=()=>(n=n*16807%2147483647)/2147483647,r=new o.Vector3(0,-1,.2).normalize(),i=new o.Vector3(1,0,.2).normalize();for(let s=0;s<64;s++)e.push({p:new o.Vector3(.02+.96*a(),.004,0),n:r,len:.018+.02*a(),w:.2+.14*a(),color:t});for(let s=0;s<40;s++)e.push({p:new o.Vector3(.997,.02+.96*a(),0),n:i,len:.016+.018*a(),w:.2+.14*a(),color:t});const u=new o.Mesh(Dt(e),bt(rn+`
        attribute vec3 aDir, aCol; attribute vec4 aCorner;
        void tuft(out vec3 root, out vec3 d, out vec3 col, out vec2 cr, out float seed, out float aMul){
          root = (modelMatrix*vec4(sailP(position.xy), 1.)).xyz; d = mat3(modelMatrix)*aDir; col = aCol; cr = aCorner.xy; seed = aCorner.z; aMul = 1.; }`,oe,{near:[.5,1.4],minPx:2.5,hairs:16,alpha:.6,uniforms:{uFull:sn.uFull}}));u.frustumCulled=!1,u.renderOrder=3,ne.add(u)}await p.yield();const Rt=[],eo=new Float32Array(129);{let e=0;for(let t=1;t<=128;t++)e+=1/q(Fn((t-.5)/128),.35,2.5),eo[t]=e;for(let t=1;t<=128;t++)eo[t]*=pa/e}const Yn=e=>{const t=q(e,0,1)*128,n=Math.min(127,Math.floor(t));return E(eo[n],eo[n+1],t-n)},ft=new o.Group;N.add(ft);{const e=new o.Group;e.scale.set(-2,2,2),e.position.y=3.55,ft.add(e);for(const t of ne.children){let n=t.material;if(t===Ko&&G===2){n=t.material.clone();for(const r in t.material.uniforms)n.uniforms[r]=t.material.uniforms[r];n.uniforms.uSail={value:ee(W[6])},n.uniforms.uEdgeOn={value:0}}const a=new o.Mesh(t.geometry,n);a.position.copy(t.position),a.quaternion.copy(t.quaternion),a.scale.copy(t.scale),a.frustumCulled=!1,a.renderOrder=t.renderOrder,e.add(a)}}const to=e=>qe[q(Math.round((e-be)/Ce),0,fe)],Ke=[[0,5,112],[.08,4,121],[.16,-13,172],[.25,to(276)+15,276],[.33,to(350)+13,350],[.385,to(371)+9,371],[.45,to(377)+7,377]],oo=(e,t)=>{const n=Ke.length;e=q(e,0,Ke[n-1][0]);let a=0;for(;a<n-2&&e>Ke[a+1][0];)a++;const r=Ke[a],i=Ke[a+1],u=i[0]-r[0],s=(e-r[0])/u,h=s*s,v=h*s,m=Ke[Math.max(a-1,0)],b=Ke[Math.min(a+2,n-1)];for(let c=1;c<=2;c++){const l=(i[c]-m[c])/(i[0]-m[0]),d=a+2>n-1?0:(b[c]-r[c])/(b[0]-r[0]),y=(2*v-3*h+1)*r[c]+(v-2*h+s)*u*l+(-2*v+3*h)*i[c]+(v-h)*u*d;c===1?t.x=y:t.z=y}return t};{const e=new o.Vector3,t=new o.Vector3,n=new o.Vector3;Rt.push((a,r,i,u)=>{if(ft.visible=u<.52,!ft.visible)return;const s=q(u,.004,.43);oo(u,e),oo(s+.004,t),oo(s-.004,n);const h=Math.PI*(e.z-qt*r)/Z,v=1-z(.385,.45,u);ft.position.set(e.x,.12*Math.sin(h),e.z),ft.rotation.set(.018*Math.cos(h)*(.5+.5*v),Math.atan2(-(t.x-n.x),-(t.z-n.z)),.04+.02*Math.sin(r*.9),"YXZ")})}const ao=[],Kn=Math.round(300*ge*Math.max(D,.7)),pt=[],Xo=new o.Vector3(0,1,0);for(let e=0;e<Kn;e++){const t=g.range(.44,.97),n=(g.chance(.5)?1:-1)*(7+30*Math.pow(g(),1.4)),a=Jt(t,n,new o.Vector3),r=g.range(.5,1.05);a.y+=r*.35;const i={p:a,c:g.chance(.8)?I:I.clone().lerp(H,.5),yaw:g.range(0,6.28),s:r,ph:g()};Qa(a.x,a.z)||ao.push(i),e%3===0&&pt.push({p:a.clone().setY(a.y+r*.8),n:Xo,len:g.range(.5,.9),w:g.range(1,1.8),color:I}),e%25===24&&await p.yield()}for(let e=0,t=Math.round(220*ge*Math.max(D,.7));e<t;e++){const n=g.range(.66,.965),a=(g.chance(.72)?1:-1)*(5.5+20*Math.pow(g(),1.5)),r=Jt(n,a,new o.Vector3),i=g.range(.45,.95);r.y+=i*.35,ao.push({p:r,c:g.chance(.7)?I:g.chance(.5)?I.clone().lerp(H,.5):I.clone().lerp(Q,.45),yaw:g.range(0,6.28),s:i,ph:g()}),e%100===99&&await p.yield()}await p.yield();for(let e=0;e<11;e++){const t=e<6,n=k.pointAt((t?30+e*23:215+(e-6)*20)/k.length,new o.Vector3),a=n.x+(t?8.6:-8.2)+.6*Math.sin(e*2.4);ao.push({p:new o.Vector3(a,.5,n.z),c:Q,yaw:e*1.3,s:.85,ph:e*.37%1},{p:new o.Vector3(a,1.05,n.z),c:H,yaw:e,s:.36,ph:e*.37%1})}const ln=new o.Mesh(Yo(new o.IcosahedronGeometry(1,1),ao),$({vertexShader:`
        attribute vec3 iPos, iCol; attribute vec4 iPar; varying vec3 vW, vN, vC, vO;
        void main(){ vec3 p = position*iPar.y*vec3(1., 0.8, 1.); float g = gust(iPos);
          vec3 w = iPos + p + uWind*max(p.y, 0.)*(0.12 + 0.3*g)*uGale + vec3(0., 0.06*sin(uTime*3. + iPar.z*30.)*max(p.y, 0.), 0.);
          vW = w; vN = normal; vC = iCol; vO = position; gl_Position = projectionMatrix*viewMatrix*vec4(w, 1.); }`,fragmentShader:`
        varying vec3 vW, vN, vC, vO;
        void main(){ vec3 N = vN/max(length(vN), 1e-4); vec3 n = vO/max(length(vO), 1e-4);
          vec2 st = vec2(atan(n.z, n.x + 1e-5)*2.2, asin(clamp(n.y, -1., 1.))*2.6);
          gl_FragColor = vec4(toScene(fabricShade(vC, st, 0., 0.22, N, vW, 0.1)), 1.); }`}));ln.frustumCulled=!1,N.add(ln);{const e=k.pointAt(214/k.length,new o.Vector3),t=[],n=new o.Matrix4,a=new o.Quaternion,r=new o.Euler,i=(v,m,b,c,l,d,y,M,P,F)=>{const x=new o.SphereGeometry(1,F,Math.max(5,Math.round(F*.6)));r.set(0,y,M,"YXZ"),x.applyMatrix4(n.compose(new o.Vector3(v,m,b),a.setFromEuler(r),new o.Vector3(c,l,d)));const w=x.getAttribute("position").count,f=new Float32Array(w*3);for(let S=0;S<w;S++)f[S*3]=P.r,f[S*3+1]=P.g,f[S*3+2]=P.b;x.setAttribute("color",new o.BufferAttribute(f,3)),x.computeVertexNormals(),t.push(x)},u=Y.clone().multiplyScalar(.8),s=[H.clone().multiplyScalar(.9),Y.clone().lerp(Te,.35),H.clone().lerp(I,.45)];i(0,-.25,0,6.4,2.6,3.6,.4,0,u,22),i(-3.4,-.3,1.6,3.2,1.9,2.4,-.3,0,u,16),i(3.9,-.4,-1.5,2.6,1.5,1.9,.9,0,u,14),[[-1.6,2.6,.2,.5],[1.7,2.56,-.5,2.5],[-3.6,1.93,1.7,-.7]].forEach(([v,m,b,c],l)=>{const d=Math.cos(c),y=Math.sin(c),M=1.5-.2*l;i(v,m,b,M,.5,.56,c,0,s[l],12),i(v+d*M*.92,m+.34,b-y*M*.92,.42,.36,.36,c,.5,s[l],8),i(v-d*M*.98,m+.22,b+y*M*.98,.5,.14,.34,c,-.6,s[l],8)});const h=new o.Mesh(re(t),$({uniforms:{uFoam:{value:Q}},vertexShader:`
          attribute vec3 color; varying vec3 vW, vN, vC;
          void main(){ vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vN = mat3(modelMatrix)*normal; vC = color; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
          uniform vec3 uFoam; varying vec3 vW, vN, vC;
          void main(){ vec3 N = vN/max(length(vN), 1e-4); bool ax = abs(N.x) > abs(N.z);
            vec2 st = vec2(ax ? vW.z : vW.x, vW.y*1.25 + (ax ? vW.x : vW.z)*0.6)/0.62; float row = floor(st.y);
            bool hem = vW.y < 0.75 + 0.15*sin(vW.x*1.7 + vW.z*1.3);
            vec3 base = hem ? uFoam : vC*(mod(row, 5.) < 1. ? 0.84 : 1.);
            gl_FragColor = vec4(toScene(fabricShade(base, st, hem ? 1. : 3., 0.22, N, vW, 0.)), 1.); }`}));for(const v of t)v.dispose();h.scale.setScalar(1.35),h.position.set(e.x+11.8,.1,e.z),N.add(h)}for(let e=0;e<=fe;e+=2)zt[e]>1.5&&pt.push({p:new o.Vector3(qe[e]-4.4+2.6,zt[e]+.2,be+e*Ce),n:Xo,len:g.range(.6,1.2),w:g.range(1.6,2.6),color:Y});const Xn=Math.round(2600*D);for(let e=0;e<Xn;e++){const t=g.range(.42,.98),n=(g.chance(.5)?1:-1)*(5.5+34*Math.pow(g(),1.3)),a=Jt(t,n,new o.Vector3);pt.push({p:a,n:Xo,len:g.range(.45,1),w:g.range(1.2,2.4),color:a.y>44&&a.y<56?Y:I}),e%200===199&&await p.yield()}await p.yield();{let e=90817;const t=()=>(e=e*16807%2147483647)/2147483647,n=O+1,a=(u,s)=>{const h=q((u-je)/he,0,O-.001),v=q((s-$e)/he,0,J-.001),m=Math.floor(h),b=Math.floor(v),c=h-m,l=v-b,d=b*n+m;return E(E(U[d*3+1],U[(d+1)*3+1],c),E(U[(d+n)*3+1],U[(d+n+1)*3+1],c),l)},r=I.clone().lerp(H,.5),i=_e.getAttribute("normal");for(const u of pt){if(u.color!==I)continue;const s=q(Math.round((u.p.x-je)/he),0,O),h=q(Math.round((u.p.z-$e)/he),0,J),v=h*n+s,m=i.getY(v);u.n=new o.Vector3(i.getX(v),m,i.getZ(v)),m<.8||u.p.y>42&&u.p.y<58?u.skip=!0:He[v]>.5&&t()<.4&&(u.color=r)}for(let u=1;u<J;u++){for(let s=1;s<O;s++){const h=u*n+s,v=U[h*3+1];if(v<.5||Po[h])continue;const m=i.getY(h)<.66,b=new o.Vector3(i.getX(h),i.getY(h),i.getZ(h)),c=v-.25*(U[(h-1)*3+1]+U[(h+1)*3+1]+U[(h-n)*3+1]+U[(h+n)*3+1]);if(c<.16||v>43&&v<55.5)continue;const l=Math.min(3,Math.floor((.7+c*1.6)*D*(m?c>.5?.6:0:1)+t()));for(let d=0;d<l;d++){const y=U[h*3]+(t()-.5)*he,M=U[h*3+2]+(t()-.5)*he,P=a(y,M);pt.push({p:new o.Vector3(y,P+.25,M),n:b,len:.5+.5*t(),w:1.5+1.2*t(),color:P<6?Q:m?Y:t()<.3?r:I})}}u%12===11&&await p.yield()}}await p.yield();const Zo=new o.Mesh(Dt(pt.filter(e=>!e.skip)),bt(gr,oe,{near:[7,15],minPx:4,grow:2,hairW:.3,maxPx:18,hairs:9,alpha:.85}));Zo.frustumCulled=!1,Zo.renderOrder=3,N.add(Zo),await p.yield();{const e=[],t=(r,i,u,s,h)=>{const b=[],c=[],l=[],d=[],y=g.range(-.3,.3);for(let P=0;P<=5;P++)for(let F=0;F<=20;F++){const x=F/20*Math.PI*2,w=P/5,f=u*(1-w)*(.8+.2*Math.sin(x*2+r)+.12*Math.sin(x*5+i)),S=s*(1-(1-w)*(1-w))-4;if(b.push(r+Math.cos(x)*f+y*S,S,i+Math.sin(x)*f*.7),c.push(x*u*.8,w*s*1.6),l.push(h.r,h.g,h.b),F<20&&P<5){const C=P*21+F,A=C+20+1;d.push(C,A,C+1,C+1,A,A+1)}}const M=new o.BufferGeometry;M.setAttribute("position",new o.Float32BufferAttribute(b,3)),M.setAttribute("uv",new o.Float32BufferAttribute(c,2)),M.setAttribute("color",new o.Float32BufferAttribute(l,3)),M.setIndex(d),M.computeVertexNormals(),e.push(M)},n=[Te.clone().lerp(Y,.45),Y,H.clone().lerp(Y,.35),Ve.clone().lerp(Y,.35),I.clone().lerp(H,.3)];for(let r=0;r<11;r++){const i=r<4?1:r<8?3:6,u=g.range(-.25,.25)+[-1.9,-1.2,1.5,2.6,-2.4,-.75,.5,2.2,-1.5,.1,1.2][r],s=i*g.range(950,1150);t(Math.sin(u)*s,400+Math.cos(u)*s,g.range(160,300)*Math.sqrt(i)*1.3,g.range(50,110)*Math.sqrt(i)*1.25,g.pick(n))}const a=new o.Mesh(re(e),nt({pattern:2,stitch:[16,11],vertexColors:!0,stripe:[7,2],stripeColor:W[0]}));N.add(a),e.forEach(r=>r.dispose())}await p.yield();const Qo=K===2,Zn=Qo?.6:.85,Jo=(()=>{const e=[],t=[],n=[];for(let i=-4;i<=4;i++)for(let u=0;u<4;u++)e.push((u&1)-.5,0,(u>>1)-.5),t.push(u&1,u>>1),n.push(i);const a=[];for(let i=0;i<9;i++)a.push(i*4,i*4+2,i*4+1,i*4+1,i*4+2,i*4+3);const r=new o.BufferGeometry;return r.setAttribute("position",new o.Float32BufferAttribute(e,3)),r.setAttribute("uv",new o.Float32BufferAttribute(t,2)),r.setAttribute("aK",new o.Float32BufferAttribute(n,1)),r.setIndex(a),r})(),Xe=Math.round(60*ge*Math.max(D,.7)),mt=new o.InstancedBufferGeometry;mt.index=Jo.index;for(const e of["position","uv","aK"])mt.setAttribute(e,Jo.getAttribute(e));{const e=new Float32Array(Xe*4),t=new Float32Array(Xe*4);for(let n=0;n<Xe;n++){const a=n<Xe*.36,r=a?g.range(30,420):g.range(-100,700),i=a?g.range(-64,60):g.range(-240,420);e.set([i,a?g.range(6,15):g.range(18,70),r,a?g.range(14,30):g.range(30,90)],n*4),t.set([g.range(0,6.28),(g.chance(.5)?1:-1)*g.range(.7,1.2),g(),0],n*4)}for(const[n,a,r,i,u]of[[0,-12,7,2,7],[1,-5.5,14.5,3,3],[2,-32,7,40,11]])n<Xe&&(e.set([a,r,i,u],n*4),t[n*4+2]=.1+.1*n,t[n*4+3]=1);Xe>1&&(t[4]=0,t[5]=.004),mt.setAttribute("iA",new o.InstancedBufferAttribute(e,4)),mt.setAttribute("iB",new o.InstancedBufferAttribute(t,4)),mt.instanceCount=Xe}const ea={value:new o.Vector3(0,0,40)},cn={value:new o.Vector3(ma.x-40,1,ma.z-90)},un={value:0},dn=[0,1,2].map(()=>({uDive:{value:new o.Vector4(0,60,0,0)}})),vn=e=>$({side:o.DoubleSide,uniforms:{uS:{value:Zn},uPx:oe,uThin:un,uEsc:ea,uHeroAt:cn,uHead:{value:Qo?Ee:I},uBody:{value:Q},uTip:{value:Qo?Y:Ee},uIsDive:{value:e?1:0},...e||{uDive:{value:new o.Vector4}}},vertexShader:`
        attribute vec4 iA, iB; attribute float aK; uniform float uS, uIsDive, uPx, uThin; uniform vec4 uDive; uniform vec3 uEsc, uHeroAt; varying vec3 vW, vN, vC; varying vec2 vUv; uniform vec3 uHead, uBody, uTip;
        void main(){
          float ak = abs(aK), fold = uIsDive*uDive.w;
          vec3 c; float hd; float flap, sz = 1., lead = iB.w*step(abs(iB.z - 0.2), 0.01);      // lead: the one gannet that flies on ahead of the bow
          if (uIsDive > 0.5) { c = uDive.xyz; hd = 1.2; flap = 0.3*sin(uTime*9.)*(1. - fold); }
          else { float a = iB.x + uTime*iB.y*12./iA.w; c = iA.xyz + uEsc*iB.w + vec3(cos(a), 0., sin(a))*iA.w; c.y += 2.5*sin(uTime*0.6 + iB.z*30.);
            vec2 dc = mod(c.xz - cameraPosition.xz + 260., 520.) - 260.; sz = (1. - smoothstep(170., 215., length(dc)))*(1. - uThin*step(iB.z, 0.85))*(1. - smoothstep(95., 135., length(dc))*step(0.4, iB.z));      // the air is a block 520 m square round the eye; a bird is knitted on as it comes within 215 m
            float dl = length(dc), dn = sqrt(dl*dl + 676.);
            vec2 hv = uHeroAt.xz - cameraPosition.xz; sz *= 1. - smoothstep(0.9, 0.955, dot(dl > 1e-3 ? dc/dl : vec2(0., 1.), hv/max(length(hv), 1e-3)))*uHeroAt.y*(1. - lead);      // none wheels in front of the Needles and the ball while they are far off
            sz *= smoothstep(22., 34., distance(c.xz, cameraPosition.xz));      // and none flaps in the bow's face: a bird is let go as the yoal comes within about 30 m of it
            c.y = max(c.y, cameraPosition.y + 9.*(1. - smoothstep(30., 48., dn)));
            hd = a + 1.5708*sign(iB.y); float gl = smoothstep(0.2, 0.8, sin(uTime*0.5 + iB.z*40.)); flap = mix(0.5*sin(uTime*7. + iB.z*50.), 0.12, gl); }
          // chevron: wings swept back, flapping; folded: one column of stitches, head down
          vec3 fw = vec3(cos(hd), 0., sin(hd)), sd = vec3(-fw.z, 0., fw.x);
          vec3 cr = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), cu = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
          float span = 0.6 + 0.4*abs(dot(sd, cr));                              // the chevron narrows as the bird turns away
          float S = max(uS, distance(c, cameraPosition)*uPx*3.0/span)*sz*(1. + 0.15*lead);        // a stitch is never under about 3 px: far birds are small flecks, and the bay has its depth
          vec2 l = vec2((aK + position.x)*S*span, (-ak*(0.5 + flap) - position.z)*S);
          vec2 fl = vec2(position.x*S, (-aK - position.z)*S);
          vec2 q = mix(l, fl, fold);
          vec3 w = c + cr*q.x + cu*q.y;
          vC = ak > 3.5 ? uTip : (ak < 0.5 ? uHead : uBody); vW = w; vN = cameraPosition - c; vUv = vec2(uv.x, 1. - uv.y);
          gl_Position = projectionMatrix*viewMatrix*vec4(w, 1.);
        }`,fragmentShader:`
        varying vec3 vW, vN, vC; varying vec2 vUv;
        void main(){
          // one stitch: the two legs of a knit V drawn as yarn (apex down), the deeper lot in the gap between them, nothing outside
          vec4 s1 = yarnSeg(vUv, vec2(0.5, 0.1), vec2(0.23, 0.92), 0.19), s2 = yarnSeg(vUv, vec2(0.5, 0.1), vec2(0.77, 0.92), 0.19);
          vec4 b = s1.z > s2.z ? s1 : s2; float d2 = min(dot(s1.xy, s1.xy), dot(s2.xy, s2.xy));
          if (d2 > 2.6 && !(vUv.y > 0.35 && abs(vUv.x - 0.5) < 0.27*vUv.y)) discard;
          float fw = fwidth(vUv.y), ply = smoothstep(0.55, 0.95, abs(sin((b.w*2.2 + b.x*0.3)*TAU)))*(1. - smoothstep(0.03, 0.08, fw))*step(0.001, b.z);
          vec3 N = vN/max(length(vN), 1e-4), V = N; float dist = length(cameraPosition - vW);
          N = mix(N, uSunDir, 0.5); N = N/max(length(N), 1e-4);                                // small bright things: mostly their pigment
          float rec = max(1. - smoothstep(0., 0.55, b.z), ply*0.45);
          gl_FragColor = vec4(toScene(woolShadeR(vC*(0.82 + 0.18*b.z), N, N, V, rec, dist)), 1.);
        }`}),hn=new o.Mesh(mt,vn(null));hn.frustumCulled=!1,N.add(hn);const ta=[.057,.125,.205],Qn=ta.map((e,t)=>{const n=new o.Mesh(Jo,vn(dn[t]));return n.frustumCulled=!1,N.add(n),n}),no=ta.map((e,t)=>k.pointAt(e+.062,new o.Vector3).add(new o.Vector3(t===1?15:-10-t*2,0,0)));Rt.push((e,t,n,a)=>{un.value=z(.42,.52,a),cn.value.y=1-z(.3,.4,a),k.pointAt(Math.min(a+.034,1),ea.value),ea.value.y=220*z(.31,.39,a);for(let r=0;r<3;r++){const i=(a-ta[r])/.03,u=dn[r].uDive.value,s=Pe.uDive.value[r],h=z(.25,1,i);u.set(no[r].x-14*(1-z(0,1,i)),E(26,-3,h*h),no[r].z-10*(1-z(0,1,i)),z(.15,.45,i)),Qn[r].visible=i>-1.5&&i<1.02,s.set(no[r].x,no[r].z,i>1?(i-1)*.03*pa/1.45:-9,0)}}),await p.yield();const Bt=Math.round(16*Math.max(D,.7)),Ze=new o.InstancedBufferGeometry,ro=new o.PlaneGeometry(1,1,6,1);Ze.index=ro.index,Ze.setAttribute("position",ro.getAttribute("position")),Ze.setAttribute("uv",ro.getAttribute("uv"));const oa=new Float32Array((Bt+12)*4),aa=new Float32Array((Bt+12)*4);for(let e=0;e<Bt;e++)oa.set([g.range(-260,260),g.range(38,110),g.range(0,900),g.range(60,140)],e*4),aa.set([g.range(34,52)*rt,g(),0,g.range(.035,.07)],e*4);const na=new o.Mesh(Ze,$({transparent:!0,depthWrite:!1,side:o.DoubleSide,uniforms:{uOrigin:Pe.uOrigin},vertexShader:`
        attribute vec4 iA, iB; uniform vec3 uOrigin; varying vec2 vUv; varying float vSeed, vA;
        void main(){
          vec3 c = iA.xyz; float len = iA.w; vA = 1.;
          if (iB.z < 0.5) { c.z = uOrigin.z - 350. + mod(iA.z + uTime*iB.x - uOrigin.z + 350., 900.); c.x += uOrigin.x*0.6 + 0.36*(c.z - uOrigin.z); c.y = max(c.y + uOrigin.y*0.9, uOrigin.y + 24.);
            vA = 0.; len = 0.; }
          else { float t = fract(uTime*0.22*uGale + iB.y); c += uWind*t*26. + vec3(0., 1.5*t*(1. - 0.5*t), 0.); len *= 0.4 + 1.6*t; vA = (1. - t)*smoothstep(0., 0.1, t)*1.6; }
          vec3 along = normalize(uWind + vec3(0., 0.08*sin(uTime*0.7 + iB.y*20.), 0.)), toC = cameraPosition - c;
          vec3 up = normalize(cross(along, toC) + vec3(0., 1e-3, 0.));
          float wob = sin(position.x*5. + uTime*1.3 + iB.y*30.)*0.12;
          vec3 w = c + along*position.x*len + up*(position.y + wob)*len*iB.w;
          vUv = uv; vSeed = iB.y; gl_Position = projectionMatrix*viewMatrix*vec4(w, 1.);
        }`,fragmentShader:`
        varying vec2 vUv; varying float vSeed, vA;
        void main(){
          float x = vUv.x, y = vUv.y - 0.5;
          float env = max(sin(x*3.14159265), 0.02)*(0.35 + 0.65*vnoise(vec2(x*5. + vSeed*31., vSeed*7.))), yy = y + 0.22*(vnoise(vec2(x*3.3 + vSeed*11., 2.)) - 0.5);
          float body = (1. - smoothstep(0.1, 0.5, abs(yy)/env*0.5))*smoothstep(0., 0.2, x)*(1. - smoothstep(0.7, 1., x));
          float fib = vnoise(vec2(x*3. + vSeed*17., y*26. + vSeed*9.))*0.6 + vnoise(vec2(x*9. - uTime*0.15, y*70.))*0.4;
          float a = body*(0.2 + 0.8*smoothstep(0.3, 0.8, fib + body*0.3))*0.5*vA;
          gl_FragColor = vec4(toScene(mix(uCream, vec3(0.93, 0.94, 0.95), 0.25 + 0.3*fib)), a);
        }`}));na.frustumCulled=!1,na.renderOrder=4,N.add(na);const fn=e=>{const t=e.getAttribute("position"),n=e.getAttribute("normal"),a=e.getAttribute("uv");for(let r=0;r<t.count;r++)a.setXY(r,Math.abs(n.getX(r))>.6?t.getZ(r):t.getX(r),Math.abs(n.getY(r))>.9?t.getZ(r):t.getY(r)*1.2);return e};{const e=new o.Vector3,t=[],n=[],a=[],r=[],i=(s,h,v)=>{const m=new o.BufferGeometry;return m.setAttribute("position",new o.Float32BufferAttribute(s,3)),m.setAttribute("uv",new o.Float32BufferAttribute(h,2)),m.setIndex(v),m.computeVertexNormals(),m};for(let s=0;s<2;s++){const h=Fe[s].clone(),v=st[s][3],m=st[s][4],b=(13-s*1.5)*v,c=6.4*v,l=4.6*v,d=3.6*v,y=.7*v,M=d/(c/2);h.y-=.4;const P=fn(new o.BoxGeometry(b,l+1.5,c));P.translate(0,(l-1.5)/2,0);const F=fn(new o.BoxGeometry(1.5*v,d+1.6*v,1.5*v));F.translate(b/2-1.3*v,l+(d+1.6*v)/2,0);const x=b/2,w=i([-x,l,-c/2,-x,l,c/2,-x,l+d,0,x,l,-c/2,x,l+d,0,x,l,c/2],[-c/2,l*1.2,c/2,l*1.2,0,(l+d)*1.2,-c/2,l*1.2,0,(l+d)*1.2,c/2,l*1.2],[0,1,2,3,4,5]),f=x+y,S=l-y*M,C=l+d+.05,A=c/2+y,L=Math.hypot(A,C-S),T=i([-f,S,A,f,S,A,-f,C,0,f,C,0,-f,S,-A,f,S,-A,-f,C,0,f,C,0],[-f,0,f,0,-f,L,f,L,-f,0,f,0,-f,L,f,L],[0,1,3,0,3,2,4,7,5,4,6,7]),R=new o.BoxGeometry(1.4*v,2.7*v,.4);R.translate(.5*v,1.35*v-.3,-c/2);const ce=[R];for(const B of[-1,1]){const _=new o.BoxGeometry(1.3*v,1.3*v,.4);_.translate(B*b*.31,2.6*v,-c/2),ce.push(_)}{const B=new o.BoxGeometry(.4,1.2*v,1.2*v);B.translate(-x,2.7*v,0),ce.push(B)}for(const B of[P,F,w,T,...ce])B.rotateY(m),B.translate(h.x,h.y,h.z);t.push(P,F,w),n.push(T),a.push(...ce);for(let B=0;B<6;B++){const _=(Bt+s*6+B)*4;e.set(b/2-1.3*v,l+d+1.9*v,0).applyAxisAngle(ko,m).add(h),oa.set([e.x,e.y,e.z,8*v],_),aa.set([0,B/6+s*.07,1,.3],_)}const X=Fe[s],ke=Math.cos(m),Se=Math.sin(m),ze=[0],me=[0];for(let B=1;B<=720;B++){const _=(B-1)/720*Math.PI*2,Ge=B/720*Math.PI*2,It=Ot(s,_,6),xt=Ot(s,Ge,6);me.push(me[B-1]+Math.hypot(xt*Math.cos(Ge)-It*Math.cos(_),xt*Math.sin(Ge)-It*Math.sin(_)))}const tt=4*Math.round(me[720]/3.6),V=tt*3,ue=10;for(let B=1,_=1;B<=V;B++){const Ge=me[720]*B/V;for(;_<720&&me[_]<Ge;)_++;ze.push((_-(me[_]-Ge)/Math.max(me[_]-me[_-1],1e-6))/720*Math.PI*2)}const Ae=[],ot=[],la=[],bn=[],ca=ue+2;for(let B=0;B<=V;B++){const _=ze[B],Ge=Math.cos(_),It=Math.sin(_),xt=Ge*ke+It*Se,ua=-Ge*Se+It*ke,Ut=Ot(s,_,1.8),vo=Ot(s,_,9.5),da=B/V*tt,ir=z(-.45,.45,Math.cos(Math.PI*2*(da-1)/4))-.5,ho=X.y+.12,sr=Math.min(De(X.x+xt*vo,X.z+ua*vo)-1.5,ho-.2),fo=ho-sr;Ae.push(X.x+xt*Ut*.6,ho+.02,X.z+ua*Ut*.6),ot.push(da,-4),la.push(fo);for(let at=0;at<=ue;at++){const Ne=at/ue,yt=Ut+(vo-Ut)*Ne+.4*ir*Math.min(1,.25+Ne*2),lr=ho-fo*Ne*Ne*Ne;Ae.push(X.x+xt*yt,lr,X.z+ua*yt),ot.push(da,Ne*Math.hypot(vo-Ut,fo)/.9),la.push(fo)}if(B<V)for(let at=0;at<ca-1;at++){const Ne=B*ca+at,yt=Ne+ca;bn.push(Ne,Ne+1,yt,Ne+1,yt+1,yt)}B%30===29&&await p.yield()}const wt=new o.BufferGeometry;wt.setAttribute("position",new o.Float32BufferAttribute(Ae,3)),wt.setAttribute("aSt",new o.Float32BufferAttribute(ot,2)),wt.setAttribute("aH",new o.Float32BufferAttribute(la,1)),wt.setIndex(bn),wt.computeVertexNormals(),r.push(wt)}N.add(new o.Mesh(re(t),nt({pattern:3,stitch:[.9,.9],color:W[3],stripe:[4,0],stripeColor:"#"+Y.clone().lerp(Q,.55).getHexString()}))),N.add(new o.Mesh(re(n),nt({pattern:0,stitch:[.9,.9],color:W[1],stripe:[3,1],stripeColor:W[2],side:o.DoubleSide}))),N.add(new o.Mesh(re(a),nt({pattern:1,stitch:[.45,.45],color:po})));const u=new o.Mesh(re(r),$({uniforms:ye,side:o.DoubleSide,vertexShader:`
          attribute vec2 aSt; attribute float aH; varying vec3 vW, vN; varying vec2 vSt; varying float vH;
          void main(){ vW = position; vN = normal; vSt = aSt; vH = aH; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.); }`,fragmentShader:Fo+`
          varying vec3 vW, vN; varying vec2 vSt; varying float vH;
          void main(){
            vec3 N = vN/max(length(vN), 1e-4); if (!gl_FrontFacing) N = -N;
            float col = floor(vSt.x), pat = 2., rec = 0.; vec2 st = vSt; vec3 base;
            if (vSt.y > 0.) {
              if (vH + (hash11(col*3.7) - 0.5)*1.6 < 2.8) discard;                  // the bluff ends column by column where the hill comes up to the door
              if (floor(vW.y/0.9)*0.9 < landAt(vW.xz).x + 0.15) discard;           // and meets the hill row by row
              rec = step(2., mod(col, 4.))*0.3;
              base = mix(uGrey, uGrey*0.86, step(0.7, hash11(floor(st.y/6.) + 3.)));
              if (st.y < 1.) base = uCreamL;                                       // one cream row under the doorstep
            } else { pat = 3.; st = vW.xz/1.1; base = mix(uFawn, uMoorit, 0.3); }
            gl_FragColor = vec4(toScene(fabricShade(base, st, pat, 0.2, N, vW, rec)), 1.);
          }`}));N.add(u);for(const s of[...t,...n,...a,...r])s.dispose()}Ze.setAttribute("iA",new o.InstancedBufferAttribute(oa,4)),Ze.setAttribute("iB",new o.InstancedBufferAttribute(aa,4)),Ze.instanceCount=Bt+12,await p.yield();const gt=new o.Group;gt.matrixAutoUpdate=!1,k.frameAt(1,gt.matrix,!0),N.add(gt);{const t=[],n=c=>[[c*1.5,-18,-c*.7],[c*1.3,-14.5,-c*.7],[c*2.2,-11.6,-c*.6],[c*3.6,-9.6,-c*.4]];for(const c of n(-1))t.push(new o.Vector3(c[0],c[1],c[2]));for(let c=0;c<=44;c++){const l=(-152+304*c/44)*Math.PI/180;t.push(new o.Vector3(9.4*Math.sin(l),9.4*Math.cos(l),.5*Math.sin(l*.5)))}for(const c of n(1).reverse())t.push(new o.Vector3(c[0],c[1],c[2]));const a=new o.CatmullRomCurve3(t).getPoints(96),r=new o.Mesh(de(a,.8,8),ha({color:va[6],plies:3,slide:.12}));gt.add(r);const i=[],u=ee(va[6]);for(let c=0;c<Math.round(70*D);c++){const l=a[g.int(8,88)],d=new o.Vector3(l.x,l.y,0).normalize().multiplyScalar(g.chance(.75)?1:-1);d.z=g.range(-.5,.5),d.normalize(),i.push({p:l.clone().addScaledVector(d,.75),n:d,len:g.range(.5,1.1),w:g.range(1,1.9),color:u})}const s=new o.Mesh(Dt(i),vr());s.frustumCulled=!1,s.renderOrder=3,gt.add(s);const h=[[0,0],[.25,.4],[.62,3.5],[.7,8],[.7,32],[.62,36.5],[.25,39.6],[.001,40]].map(c=>new o.Vector2(c[0],c[1])),v=new o.LatheGeometry(new o.SplineCurve(h).getPoints(40),12);v.rotateZ(-Math.PI/2),v.translate(-20,0,0);const m=v.getAttribute("position");for(let c=0;c<m.count;c++){const l=m.getX(c),d=Math.exp(-l*l/40);m.setY(c,m.getY(c)+2.4*(1-d)-.0025*l*l)}v.computeVertexNormals();const b=new o.Mesh(v,fa({color:Mn,dark:Sn}));b.rotation.y=Math.PI/2+.2,b.position.set(0,9.4-1.5,2),gt.add(b)}await p.yield();const Qe=new o.Group;Qe.visible=!1,N.add(Qe);{const e=[[.01,0],[1.8,1.5],[2.5,6],[1.9,12],[2.5,20],[3.1,60],[3.1,112],[4.2,116],[1.9,119.6],[.01,120]].map(a=>new o.Vector2(a[0],a[1])),t=new o.LatheGeometry(new o.SplineCurve(e).getPoints(50),12);t.rotateZ(-Math.PI/2);const n=t.getAttribute("position");for(let a=0;a<n.count;a++){const r=n.getX(a),i=n.getY(a);if(r<10){const u=(10-r)/10*2.5,s=5.5-i;n.setXY(a,10-Math.sin(u)*s,5.5-Math.cos(u)*s)}}t.computeVertexNormals(),Qe.add(new o.Mesh(t,fa({color:Mn,dark:Sn})))}const pn=8,io=new o.Vector3,so=new o.Vector3,mn=new o.Quaternion,Jn=new o.Vector3(1,0,0);Ie&&Rt.push((e,t,n,a)=>{const r=z(.665,.725,a),i=z(.75,.97,a),u=a>.66?172*r*(1-i):0;j.setDrop(pn,u);const s=z(.7,.755,a),h=1-s;Qe.visible=a>.69&&a<.995,j.ribPoint(pn,Math.max(u,6),io),io.z+=5+3*Math.sin(t*2.1)*s,j.object.localToWorld(io),so.set(.62+.9*h,.4+.4*h,.68).normalize().transformDirection(j.object.matrixWorld),Qe.quaternion.setFromUnitVectors(Jn,so),mn.setFromAxisAngle(so,.5*Math.sin(t*2.1)),Qe.quaternion.premultiply(mn),Qe.position.copy(io).addScaledVector(so,150*h*h)});let kt=null;const gn=.32,wn=13,lo=Ca,Be={...ye,uNearC:{value:new o.Vector3},uTubeR:{value:gn},uNearOn:{value:1}};{const e=m=>{const b=[];for(let c=-m;c<=m;c++)for(let l=-m;l<=m;l++)l*l+c*c<=m*m&&b.push([l,c]);return b.sort((c,l)=>c[0]*c[0]+c[1]*c[1]-(l[0]*l[0]+l[1]*l[1])),new Float32Array(b.flat())},t=e(Math.ceil(lo/1.5)),n=e(Math.ceil(wn/1.5)+1),a=`
            vec2 cell = floor(vec2(dot(uCtr.xz, LR), dot(uCtr.xz, LC))/1.5) + aCell;
            vec2 cc = (LR*(cell.x + 0.5) + LC*(cell.y + 0.5))*1.5;
            vec4 Lc = landAt(cc); float ny = 1./sqrt(1. + dot(Lc.zw, Lc.zw)), pat, nyC = landNy(cc) + (lh2(cell + 0.7) - 0.5)*0.05;
            float under = step(4., Lc.y), spur = gSpur; vec3 col = landCell(cell, Lc.x + 6.*step(ny, 0.78), Lc.y - 8.*under, nyC, pat);      // (the cream hem lies on the strand only: up a bank its stitches would stand as cream blades)
            float show = (1. - under)*step(0.42, nyC)*step(STEEP_NY, ny + (lh2(cell + 0.7) - 0.5)*0.05)*(1. - (1. - spur)*step(43., Lc.x)*step(Lc.x, 57.)*step(ny, 0.9));
            float knit = pat < 0.5 ? 1. : (pat > 2.5 ? step(mod(cell.x + cell.y, 2.), 0.5) : (pat > 1.5 ? step(mod(cell.x, 4.), 1.5) : step(mod(cell.y, 2.), 0.5)));
            float purl = 1. - knit, rib = step(1.5, pat)*step(pat, 2.5);                    // a purl bump: the same yarn lying across the stitch (sunk, in a rib's groove)
            vec2 gq = (cc - vec2(${je}., ${$e}.))/${he}.; show *= step(1., gq.x)*step(gq.x, ${O-1}.)*step(1., gq.y)*step(gq.y, ${J-1}.);
            show *= 1. - step(1.5, pat)*step(pat, 2.5)*smoothstep(-0.8, 0., distance(cc, cameraPosition.xz) - 36. - 6.*lh2(cell + 8.3));      // (rib on a shoulder is real yarn only near the eye; beyond, the shader's clean columns)
            float nearSel = uNearOn*step(distance(cc, uNearC.xz), ${wn.toFixed(1)});
            float edge = (${(lo-2.5).toFixed(1)} - 9.*lh2(cell + 4.4))*uWinGrow;      // the window's edge is ragged stitch by stitch: a stitch is whole or it is not there yet
            float sc = show*(1. - smoothstep(edge - 1.6, edge, distance(cc, uWinC.xz)));`,r=(m,b,c,l)=>{const d=Nn(b,c,gn);d.setAttribute("aCell",new o.InstancedBufferAttribute(l,2)),d.instanceCount=l.length/2;const y=new o.Mesh(d,$({uniforms:{...Be,uCtr:m?Be.uWinC:Be.uNearC,uSel:{value:m}},side:o.DoubleSide,vertexShader:$t+`
          attribute vec2 aCell, aT; attribute vec3 aOff; uniform vec3 uWinC, uNearC, uCtr; uniform float uTubeR, uSel, uNearOn, uWinGrow; varying vec3 vW, vN, vC, vUp; varying vec3 vUs;
          void main(){
            ${a}
            sc *= max(knit, purl)*mix(nearSel, 1. - nearSel, uSel);
            float t = aT.x;
            vec2 pq = mix(position.xy, vec2(0.5 + (position.x - 0.5)*1.3, 0.56), purl); float lift = mix(position.z, 0.05 - 0.22*rib + (0.5 - 0.12*rib)*(1. - t*t), purl);
            vec2 ab = cell + pq, xz = (LR*ab.x + LC*ab.y)*1.5;
            vec4 L = landAt(xz);
            vec3 nrm = normalize(vec3(-L.z, 1., -L.w));
            vec3 Ta = normalize(vec3(LR.x, dot(L.zw, LR), LR.y)), Tb = normalize(vec3(LC.x, dot(L.zw, LC), LC.y));
            vec3 n = mix(Ta*aOff.x + Tb*aOff.y, Tb*aT.y, purl) + nrm*aOff.z;
            float fat = (0.92 + 0.2*lh2(cell + 3.7))*(1. + 0.15*purl)*min(pow(1. + dot(Lc.zw, Lc.zw), 0.4), 1.8);      // on a steep bank the rows stand further apart: fatter yarn closes them
            vec3 p = vec3(xz.x, L.x, xz.y) + nrm*lift + n*uTubeR*fat;
            p = mix(vec3(cc.x, Lc.x - 0.3, cc.y), p, sc);
            vW = p; vN = n; vC = col; vUp = nrm; vUs = vec3(uv, lh2(cell + 1.9)); gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.);
          }`,fragmentShader:_t+`
          varying vec3 vW, vN, vC, vUp; varying vec3 vUs;
          void main(){
            vec3 N = vN/max(length(vN), 1e-4), V = cameraPosition - vW; float dist = length(V); V = V/max(dist, 1e-4);
            gl_FragColor = vec4(toScene(fatYarn(vC, N, vUp/max(length(vUp), 1e-4), V, vUs.xy, vUs.z, dist)), 1.);
          }`}));return y.frustumCulled=!1,N.add(y),y},i=r(1,6,yr,t),u=r(0,8,xr,n),s=i.geometry;let h=1;const v=new o.InstancedBufferGeometry;v.setAttribute("position",new o.Float32BufferAttribute([-.5,0,0,.5,0,0,-.5,1,0,.5,1,0],3)),v.setIndex([0,1,2,2,1,3]),v.setAttribute("aCell",s.getAttribute("aCell")),v.instanceCount=s.instanceCount,kt=new o.Mesh(v,bt($t+`
        attribute vec2 aCell; uniform vec3 uWinC; uniform float uWinGrow;
        void tuft(out vec3 root, out vec3 d, out vec3 col, out vec2 cr, out float seed, out float aMul){
          vec2 cell = floor(vec2(dot(uWinC.xz, LR), dot(uWinC.xz, LC))/1.5) + aCell;
          vec2 cc = (LR*(cell.x + 0.5) + LC*(cell.y + 0.5))*1.5;
          vec4 Lc = landAt(cc); float ny = 1./sqrt(1. + dot(Lc.zw, Lc.zw)), pat, nyC = landNy(cc) + (lh2(cell + 0.7) - 0.5)*0.05;
          float under = step(4., Lc.y), spur = gSpur; col = landCell(cell, Lc.x + 6.*step(ny, 0.78), Lc.y - 8.*under, nyC, pat);
          float show = (1. - under)*step(0.42, nyC)*step(STEEP_NY, ny + (lh2(cell + 0.7) - 0.5)*0.05)*(1. - (1. - spur)*step(43., Lc.x)*step(Lc.x, 57.)*step(ny, 0.9));
          show *= pat < 0.5 ? 1. : (pat > 2.5 ? step(mod(cell.x + cell.y, 2.), 0.5) : (pat > 1.5 ? step(mod(cell.x, 4.), 1.5)*step(distance(cc, cameraPosition.xz), 35. + 6.*lh2(cell + 8.3)) : step(mod(cell.y, 2.), 0.5)));
          vec2 gq = (cc - vec2(${je}., ${$e}.))/${he}.; show *= step(1., gq.x)*step(gq.x, ${O-1}.)*step(1., gq.y)*step(gq.y, ${J-1}.);
          float h = lh2(cell + 9.1);
          vec2 ab = cell + vec2(h < 0.5 ? 0.17 : 0.83, 0.8), xz = (LR*ab.x + LC*ab.y)*1.5;
          vec4 L = landAt(xz); vec3 nrm = normalize(vec3(-L.z, 1., -L.w));
          root = vec3(xz.x, L.x, xz.y) + nrm*0.6;
          d = nrm*(0.34 + 0.34*lh2(cell + 1.3)) + (LR*(lh2(cell + 4.3) - 0.5) + LC*(lh2(cell + 6.1) - 0.5)).xyy*vec3(0.5, 0., 0.5);
          vec3 tc = cameraPosition - root; float face = dot(nrm, tc)/max(length(tc), 1e-3);
          show *= step(0.12, lh2(cell + 2.9))*(1. - smoothstep(0.12, 0.34, face));      // (a bank that faces the eye still has a lip against the sky)
          cr = vec2(position.x*(1.1 + 0.6*h), position.y); seed = lh2(cell + 5.7);
          aMul = show*step(distance(cc, uWinC.xz), (${(lo-2.5).toFixed(1)} - 9.*lh2(cell + 4.4))*uWinGrow - 1.6);
        }`,oe,{near:[3,6.5],far:[20,34],minPx:3,grow:1.5,hairW:.3,maxPx:18,hairs:9,alpha:.85,uniforms:Be})),kt.frustumCulled=!1,kt.renderOrder=3,N.add(kt),Rt.push((m,b,c,l)=>{const d=l>.352,y=l<.455,M=l>.17&&l<.5;Fa(M),Pa.value=M?300:336,i.visible=kt.visible=d,u.visible=l>.415,Be.uNearOn.value=l>.415?1:0,ye.uWinK.value=Be.uWinGrow.value=z(.352,.385,l);{const P=((lo-2.5)*Be.uWinGrow.value+2.6)/1.5,F=P*P,x=t.length/2;let w=h;for(;w<x&&t[w*2]*t[w*2]+t[w*2+1]*t[w*2+1]<=F;)w++;for(;w>1&&t[w*2-2]*t[w*2-2]+t[w*2-1]*t[w*2-1]>F;)w--;h=w,i.geometry.instanceCount=v.instanceCount=w}Go.position.y=.07*Math.sin(b*1.9),Oo.visible=jo.visible=Ho.visible=Qt.visible=Xt.visible=y,qo.visible=l<.36,Da.value=1-z(.325,.358,l)})}await p.yield();const We=new o.Vector3,Je=new o.Vector3,ra=new o.Vector2,co=new o.Matrix4,er=new o.Euler,uo=new o.Vector3;let ia=5;const xn=new o.Frustum,tr=new o.Matrix4,or=new o.Matrix4,ar=[[0,100,0,150],[-193,40,6,95],...[-320,-240,-160,-80,0,80,160,240,320].map(e=>[e,160,0,75])].map(([e,t,n,a])=>new o.Sphere(new o.Vector3(e,t,n).applyMatrix4(j.object.matrixWorld),a));function yn(e,t,n,a){We.setFromMatrixPosition(n.matrixWorld),p.renderer.getDrawingBufferSize(ra);const r=Math.max(n.projectionMatrix.elements[5],.1);So.uPxDeg.value=2*Math.atan(1/r)*57.2958/Math.max(ra.y,64),oe.value=te.uPxS.value=2/(r*Math.max(ra.y,64)),Pe.uOrigin.value.copy(We),Pe.uNearS.value.copy(We).addScaledVector(Je,6),No.material.uniforms.uOrigin.value.copy(We),So.uUnder.value=1-z(0,.06,a),ye.uStep.value=Math.floor(t*2),ye.uTurn.value=a>.455&&a<.56||a>.2&&a<.33?1:0,j.setClock(1+.42*Yn(a)),j.update(e,t,n);const i=n.viewCamera||n;if(a>.415&&a<.6)j.object.visible=!1;else if(a>.3&&a<.7){xn.setFromProjectionMatrix(tr.multiplyMatrices(i.projectionMatrix,or.copy(i.matrixWorld).invert()));let u=!1;for(const s of ar)if(xn.intersectsSphere(s)){u=!0;break}j.object.visible=u}else j.object.visible=!0;{const u=z(.38,.43,a)*(1-z(.61,.67,a)),s=1-z(.37,.42,a),h=Math.PI*(We.z-qt*t)/Z,v=a*k.length/13.5*Math.PI*2,m=.022*s*Math.cos(h)+.012*u*Math.sin(v*2),b=.012*s*Math.sin(h*.5+1)+.05*u*Math.sin(v)+.01*Math.sin(t*.9),c=.07*s*Math.sin(h)+.05*u*Math.sin(v*2+1);let l=0;if(a>0){k.tangentAt(a,Ue);const y=n.matrixWorld.elements;let M=Math.atan2(Ue.x,Ue.z)-Math.atan2(-y[8],-y[10]);M=Math.atan2(Math.sin(M),Math.cos(M)),l=.8*q(M,-.32,.32)}const d=!!p.through;ia=d?0:Math.min(ia+e,5),co.makeRotationFromEuler(er.set(m,l,b)),uo.copy($n).applyMatrix4(co),co.setPosition(uo.x,uo.y+c-1.3*(1-z(0,.9,ia)),uo.z),d?ne.matrix.makeScale(1e-4,1e-4,1e-4).setPosition(We.x,-400,We.z):ne.matrix.multiplyMatrices(n.matrixWorld,co),ne.matrixWorldNeedsUpdate=!0}Je.set(-n.matrixWorld.elements[8],0,-n.matrixWorld.elements[10]),Je.lengthSq()<1e-6&&Je.set(0,0,1),Je.normalize(),Be.uNearC.value.copy(We).addScaledVector(Je,11),Be.uWinC.value.copy(We).addScaledVector(Je,E(44,18,z(.405,.47,a)));for(const u of Rt)u(e,t,n,a,We)}yn(0,0,{matrixWorld:new o.Matrix4().setPosition(0,3,0),projectionMatrix:new o.Matrix4().makePerspective(-1,1,.6,-.6,1,100)},0);const sa=new o.Vector3,nr=new o.Vector3,rr=new o.Vector3,Gt=new o.Vector3,et=new o.Vector3;return{scene:N,path:k,duration:pa,pace:Fn,title:Ie?"Cast Off: The Dropped Stitch":it?"Cast Off: A Mohair Day":G===2?"Cast Off: Winter Colourway":"Cast Off",ride:"none",style:"none",companion:"none",camera:{fov:62,near:.3,nearThrough:.3,far:9e3,lookAhead:34,sway:.5,bank:.2},pois:[{at:(e,t)=>{const n=z(.28,.34,t),a=q(k.pointAt(q(t,0,1),sa).z+E(38,32,n),be+12,372);return sa.set(qe[Math.round((a-be)/Ce)]+1,E(20,9,n),a),oo(t,et).setY(8),sa.lerp(et,z(.345,.385,t))},from:.18,to:.428,weight:.92,fade:.2},{at:[Fe[0].x,Fe[0].y+5,Fe[0].z],from:.48,to:.6,weight:.4},{at:()=>nr.set(-70,95,0).applyMatrix4(j.object.matrixWorld),from:.62,to:.88,weight:.8},{at:()=>rr.copy(j.crossing).lerp(j.anchors.ball,.4).setY(170).applyMatrix4(j.object.matrixWorld),from:.82,to:.95,weight:.2},{at:(e,t)=>{k.pointAt(q(t,0,1),Gt),k.tangentAt(q(t,0,1),et);const n=Math.hypot(et.x,et.z)||1;return Gt.set(Gt.x+et.x/n*100,Gt.y+37,Gt.z+et.z/n*100)},from:.86,to:1,weight:.45}],portal:{shape:"circle",radius:7,color:W[0],glow:.25,revealDistance:260,tilt:!0,blendDistance:25},post:{exposure:Cn,flat:1,bloom:{strength:0},grade:{saturation:1,contrast:1,tint:"#ffffff",shadowTint:"#000000",vignette:.06,grain:0,aberration:0}},update:yn,dispose(){j.dispose(),Io.dispose(),Do.dispose(),ro.dispose();for(const e of Za)e.dispose()}}}};export{Ar as default};
