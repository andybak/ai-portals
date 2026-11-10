import*as a from"three";import{clamp as Fe,lerp as le,smoothstep as P}from"../kit/core.js";const Ge=["#07040a","#2a0f1e","#5a1a1a","#12101a","#ff5a1f","#ffc21a","#7fe0ff"],je=9.81,Q=46,D=-90,E=-430,ke=300,$=30,te=`
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 h22(vec2 p){ float n = h21(p); return vec2(n, h21(p + n * 37.1 + 11.7)); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
float fb(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
// cellular: x = F1, y = F2 - F1 (0 on cell borders)
vec2 voro(vec2 p){ vec2 i = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 g = vec2(float(x), float(y)); vec2 r = g + h22(i + g) - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
  d1 = sqrt(d1); return vec2(d1, sqrt(d2) - d1); }
// black crust -> deep red -> orange -> yellow-white, linear HDR
vec3 lavaRamp(float h){
  vec3 c = mix(vec3(0.012, 0.006, 0.008), vec3(0.55, 0.015, 0.0), smoothstep(0.08, 0.34, h));
  c = mix(c, uLavaCol * 2.3, smoothstep(0.3, 0.6, h));
  c = mix(c, uHotCol * 3.4, smoothstep(0.6, 0.88, h));
  return mix(c, vec3(5.5, 3.9, 1.6), smoothstep(0.9, 1.0, h)); }
`,ge=`
float fogFade(){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      return 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #else
    return 1.0;
  #endif
}`,Ke=T=>`
uniform vec3 uEA[${T}]; uniform vec3 uEB[${T}]; uniform vec4 uEP[${T}];
uniform vec3 uMoonDir, uMoonCol, uAmbLo, uAmbHi, uLavaCol, uHotCol; uniform float uGlow;
float gLava = 1.0, gMoonSpec = 1.0;      // set before calling forgeShade: lava-light gain, moon-glint gain
vec3 forgeShade(vec3 P, vec3 N, vec3 V, vec3 alb, float gloss, float ao){
  vec3 E = vec3(0.0), S = vec3(0.0);
  for (int i = 0; i < ${T}; i++) {
    vec3 ab = uEB[i] - uEA[i]; float t = clamp(dot(P - uEA[i], ab) / max(dot(ab, ab), 1e-4), 0.0, 1.0);
    vec3 L = uEA[i] + ab * t - P; float d2 = dot(L, L), q2 = d2 / (uEP[i].x * uEP[i].x);
    if (q2 > 64.0) continue;                                   // out of reach: skip (the falloff is windowed to zero there)
    float d = sqrt(d2); L /= max(d, 1e-3);
    float w = uEP[i].z, nl = dot(N, L), ndl = max((nl + w) / (1.0 + w), 0.0);
    float at = uGlow * uEP[i].y / (1.0 + q2) * smoothstep(64.0, 30.0, q2);
    vec3 c = mix(uLavaCol, uHotCol, uEP[i].w);
    E += c * at * ndl * gLava;
    S += c * at * pow(max(dot(N, normalize(L + V)), 0.0), mix(8.0, 90.0, gloss)) * gloss * 0.09 * smoothstep(-0.1, 0.2, nl) * gLava;
  }
  float mn = dot(N, uMoonDir);
  E += uMoonCol * max(mn, 0.0);
  S += uMoonCol * pow(max(dot(N, normalize(uMoonDir + V)), 0.0), mix(24.0, 220.0, gloss)) * gloss * 0.8 * smoothstep(-0.1, 0.2, mn) * gMoonSpec;
  E += mix(uAmbLo, uAmbHi, N.y * 0.5 + 0.5);
  return (alb * E + S) * ao;
}`,ce=`
uniform mat4 uInv;
varying vec3 vP; varying vec3 vN; varying vec3 vCam;
#include <fog_pars_vertex>
`,he=`
  vP = P; vN = N; vCam = (uInv * vec4(cameraPosition, 1.0)).xyz;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
`;async function Xe(T,I={}){const S=T.rng.fork("obsidian-forge-hero"),R=T.core.makeNoise(Math.floor(S()*1e9)),Ae=(e,i,C)=>T.core.makeRng(T.core.hashSeed(e+":"+T.seed+":"+Math.round(i*50)+":"+Math.round(C*50))),j=(I.palette&&I.palette.length>=7?I.palette:Ge).map(e=>new a.Color(e)),y=(e,i,C)=>new a.Vector3(e,i,C),He=Fe(T.quality&&T.quality.detail||1,.5,1),U=new a.Group;U.name="obsidian-forge-hero";const F={meander:S.sign()*S.range(22,46),uMeander:S.range(-1,1)*26,uPhase:S.range(0,6.28),wing:S.range(55,85),sag:S.range(-1.2,1.2),deck:S.range(37.5,40.5),lean:S.range(-.5,.5),coneH:S.range(138,158),coneSkew:S.range(0,6.28),fountH:S.range(285,320),spread:S.range(.13,.19),tilt:S.range(-.035,.035),wind:S.range(-.9,.9),fallGaps:S.int(1,3),heatHue:S.range(-.035,.03),streams:S.int(3,5)},Y=j[4].clone().offsetHSL(F.heatHue,0,0),de=j[5].clone().offsetHSL(F.heatHue*.5,0,0),q=e=>e>140?F.meander*((e-140)/160)**2:0,K=e=>15+30*P(-35,-76,e)+3*P(150,300,e),oe=e=>D+F.wing*Math.pow(P(50,285,Math.abs(e)),1.2),xe=e=>F.uMeander*Math.sin((e-D)*.021+F.uPhase)*P(D-6,D-70,e)*P(E+40,E+130,e),Ve=e=>le(40,7,Math.pow(P(D,D-110,e),.7)),we=e=>e>=0?5+25*Math.exp(-((e/72)**2)):le(30,Q,P(-15,-80,e)),We=F.coneH*Math.pow(1-$/ke,1.75);function Ue(e,i){const C=e,u=i-E,x=Math.atan2(C,u),v=Math.hypot(C,u)*(1+.1*Math.cos(x-F.coneSkew)),r=Fe(1-Math.max(v,$)/ke,0,1);if(r<=0)return 0;let l=F.coneH*Math.pow(r,1.75);const h=r*(1-r)*4;return l+=h*9*R.fbm3(Math.cos(x)*3.2,Math.sin(x)*3.2,v*.004,3),l+=h*2.5*R.fbm2(e*.03,i*.03,3),l+=5*Math.exp(-(((v-$*1.1)/9)**2)),l-=17*P($,$*.4,v),l-=15*Math.exp(-((x/.3)**2))*P($*2.6,$*.9,v)*P(0,$*.7,v),l}function O(e,i){const C=Math.hypot(e,i-E),u=1-P(240,325,i<E?C:Math.abs(e)),x=R.fbm2(e*.012+7.3,i*.012-3.1,4),v=R.fbm2(e*.07,i*.07,3),r=oe(e),l=P(r+2.5,r-2.5,i);let h=0,b=0;if(l<1){const p=Math.abs(e-q(i))-K(i),M=3+x*2.2+v*.7+(we(i)-3)*(1-.84*P(30,125,p)),f=P(8,14,we(i));h=le(-4,M,Math.pow(P(-3+5*f,9+8*f,p),.8+.4*f)),p>-2&&p<34&&(h+=((R.ridged2(e*.105+9,i*.05,2)-.42)*2.6*P(-1.5,3.5,p)*(1-P(12,34,p))+Math.round(R.n2(e*.06+31,i*.035)*2)*.45*P(0,5,p)*(1-P(16,34,p)))*(1-.75*f))}if(l>0){const p=Math.abs(e-xe(i))-Ve(i);b=3+(Q-3+x*3.5)*u+v*.8-1.8*(1-P(-3,3,p))*P(E+20,E+60,i)+Ue(e,i)*u}return le(h,b,l)}const B=y(0,O(0,E)+1.5,E),Be=B.y+F.fountH,_e=(I.moonDir?I.moonDir.isVector3?I.moonDir.clone():y(...I.moonDir):y(.62,.66,.42)).normalize(),pe=[],ye=[],ae=[],ee=(e,i,C,u,x,v)=>{pe.push(e),ye.push(i),ae.push(new a.Vector4(C,u,x,v))};ee(y(q(300),0,300),y(q(170),0,170),20,5.2,.3,.3),ee(y(q(170),0,170),y(0,0,45),20,8,.3,.3),ee(y(0,0,45),y(0,0,-40),22,9,.6,.32),ee(y(-26,.5,-64),y(26,.5,-64),30,11,.3,.4),ee(y(-34,24,D+5),y(34,24,D+5),32,9.5,.35,.5),ee(y(0,Q,D-14),y(xe(-200),Q+6,-230),34,6,.3,.35),ee(y(0,B.y+12,E),y(0,B.y+F.fountH*.72,E),230,6.5,.4,.6);const be={rx:q,hw:K,cliffZ:oe,groundH:O,meander:F.meander};await T.yield();for(const e of(typeof I.emitters=="function"?I.emitters(be):I.emitters)||[])ee(y(e[0],e[1],e[2]),y(e[3],e[4],e[5]),e[6],e[7],e[8]??.3,e[9]??.3);const fe=Ke(pe.length),Le=ae.map(e=>e.y),d={time:{value:0},surge:{value:.35},inv:{value:new a.Matrix4},EA:{value:pe},EB:{value:ye},EP:{value:ae},moonDir:{value:_e},moonCol:{value:j[6].clone().lerp(new a.Color("#ffffff"),.25).multiplyScalar(.85*(I.moon??1))},ambLo:{value:j[2].clone().multiplyScalar(.3)},ambHi:{value:j[1].clone().lerp(j[6],.2).multiplyScalar(.35)},lavaCol:{value:Y},hotCol:{value:de},glow:{value:I.glow??1},vent:{value:B.clone()},fountH:{value:F.fountH},shield:{value:new a.Vector4(0,-1700,0,0)},falls:{value:[new a.Vector4(0,9999,0,0),new a.Vector4(0,9999,0,0)]}},Me={},se=()=>a.UniformsUtils.clone(a.UniformsLib.fog),ve=()=>({...se(),uInv:d.inv,uEA:d.EA,uEB:d.EB,uEP:d.EP,uMoonDir:d.moonDir,uMoonCol:d.moonCol,uAmbLo:d.ambLo,uAmbHi:d.ambHi,uLavaCol:d.lavaCol,uHotCol:d.hotCol,uGlow:d.glow,uTime:d.time}),X=[j[3].clone().multiplyScalar(6.5),j[3].clone().lerp(j[1],.4).multiplyScalar(5.5),j[2].clone().multiplyScalar(.55)];await T.yield();const Se=`
  // x: the heat of the crust (seams, thin skin over the hot reaches); y: the seams between the plates alone, 1 down the middle of a seam
  vec2 lavaCells(vec2 p){
    vec2 w = vec2(vn(p * 0.33), vn(p * 0.33 + 7.7)) * 0.7 + vec2(vn(p * 0.8 + 3.0), vn(p * 0.8 + 11.0)) * 0.3;
    vec2 v = voro(p * 0.17 + w * 1.3);
    float crack = pow(smoothstep(0.27, 0.0, v.y), 1.7);
    float hz = smoothstep(0.46, 0.8, vn(p * 0.075 + 1.7) * 0.65 + vn(p * 0.19) * 0.35);
    float thin = hz * (0.1 + 0.3 * vn(p * 0.7 + 3.1)) * smoothstep(0.75, 0.2, v.x);
    return vec2(clamp(crack * (0.46 + 0.4 * hz) + thin + 0.03, 0.0, 1.0), crack); }
  // two-phase advection along +y of p so the pattern flows forever without stretching
  vec2 lavaFlow2(vec2 p, float t, float sp){
    float a = fract(t * 0.045), b = fract(t * 0.045 + 0.5);
    vec2 ha = lavaCells(p - vec2(0.0, sp * 22.0 * (a - 0.5)));
    vec2 hb = lavaCells(p + 31.7 - vec2(0.0, sp * 22.0 * (b - 0.5)));
    return mix(hb, ha, 1.0 - abs(2.0 * a - 1.0)); }
  float lavaFlow(vec2 p, float t, float sp){ return lavaFlow2(p, t, sp).x; }`;{const C=[],u=[];for(let t=0;t<=120;t++){const o=t/120*2-1;C.push(330*(.22*o+.78*o*o*o))}for(let t=0;t<=130;t++){const o=t/130*2-1;u.push(-20+(o>0?320:280)*(.25*o+.75*o*o*o))}const x=async(t,o)=>{const c=t.length/2,s=new Float32Array(c*3),m=new Float32Array(c*3);for(let z=0;z<c;z++){const N=t[z*2],A=t[z*2+1],_=Math.hypot(N,A-E),Z=o.polar?4*P(250,272,_):4*P(262,240,_),L=oe(N),W=P(L+2.5,L-2.5,A),G=Math.abs(N-q(A))-K(A),J=Math.abs(N-xe(A))-Ve(A);s[z*3]=N,s[z*3+1]=O(N,A)-Z,s[z*3+2]=A,m[z*3]=Math.max((1-W)*(1-P(-2,30,G)),W*(1-P(0,34,J))*P(E,E+80,A),1-P($,$*2.2,_)),m[z*3+1]=le(.55+.45*P(-4,16,G),1,W),m[z*3+2]=W,(z&127)===127&&await T.yield()}const k=new Float32Array(c*3),H=o.list;for(let z=0;z<H.length;z+=3){const N=H[z]*3,A=H[z+1]*3,_=H[z+2]*3,Z=s[A]-s[N],L=s[A+1]-s[N+1],W=s[A+2]-s[N+2],G=s[_]-s[N],J=s[_+1]-s[N+1],re=s[_+2]-s[N+2],ie=L*re-W*J,me=W*G-Z*re,Te=Z*J-L*G;k[N]+=ie,k[N+1]+=me,k[N+2]+=Te,k[A]+=ie,k[A+1]+=me,k[A+2]+=Te,k[_]+=ie,k[_+1]+=me,k[_+2]+=Te,z%12e3===11997&&await T.yield()}for(let z=0;z<c;z++){const N=z*3,A=Math.hypot(k[N],k[N+1],k[N+2])||1;k[N]/=A,k[N+1]/=A,k[N+2]/=A}return await T.yield(),{pos:s,dat:m,nrm:k,list:H,n:c}},v=[],r=[];for(let t=0;t<=130;t++)for(let o=0;o<=120;o++)v.push(C[o],u[t]);for(let t=0;t<130;t++)for(let o=0;o<120;o++){const c=t*121+o,s=c+1,m=c+120+1,k=m+1;r.push(c,m,s,s,m,k)}const l=await x(v,{list:r});await T.yield();const h=44,b=96,p=[0,E],M=[];for(let t=1;t<=h;t++){const o=t/h,c=330*(.3*o+.7*o*o);for(let s=0;s<b;s++){const m=s/b*Math.PI*2;p.push(Math.sin(m)*c,E+Math.cos(m)*c)}}for(let t=0;t<b;t++)M.push(0,1+t,1+(t+1)%b);for(let t=1;t<h;t++)for(let o=0;o<b;o++){const c=1+(t-1)*b+o,s=1+(t-1)*b+(o+1)%b,m=c+b,k=s+b;M.push(c,m,s,s,m,k)}await T.yield();const f=await x(p,{list:M,polar:!0});await T.yield();const w=new a.BufferGeometry;{const t=c=>{const s=new Float32Array((l.n+f.n)*3);return s.set(l[c],0),s.set(f[c],l.n*3),s};w.setAttribute("position",new a.BufferAttribute(t("pos"),3)),w.setAttribute("normal",new a.BufferAttribute(t("nrm"),3)),w.setAttribute("aData",new a.BufferAttribute(t("dat"),3)),await T.yield();const o=new Uint32Array(l.list.length+f.list.length);o.set(l.list,0);for(let c=0,s=l.list.length,m=l.n;c<f.list.length;c++)o[s+c]=f.list[c]+m;w.setIndex(new a.BufferAttribute(o,1))}await T.yield();const V=[];for(let t=0;t<5;t++){const o=t<F.streams,c=.75+t/5*4.9+S.range(-.3,.3);V.push(new a.Vector4(c,o?S.range(110,250):0,S.range(3.5,7),S.range(0,6.28)))}const n=new a.ShaderMaterial({fog:!0,uniforms:{...ve(),uStr:{value:V},uUM:{value:new a.Vector2(F.uMeander,F.uPhase)},uT0:{value:X[0]},uT1:{value:X[1]},uT2:{value:X[2]},uVent:d.vent,uShield:d.shield},vertexShader:`
        attribute vec3 aData; varying vec3 vD;
        ${ce}
        void main(){ vec3 P = position, N = normal; vD = aData; ${he} }`,fragmentShader:`
        varying vec3 vP; varying vec3 vN; varying vec3 vCam; varying vec3 vD;
        uniform float uTime; uniform vec4 uStr[5], uShield; uniform vec2 uUM; uniform vec3 uT0, uT1, uT2, uVent;
        #include <fog_pars_fragment>
        ${fe}
        ${te}
        ${Se}
        void main(){
          vec3 P = vP; float dist = length(vCam - P); vec3 V = (vCam - P) / dist;
          vec2 q = P.xz;
          // crust relief: ropey pahoehoe + pits, fading with distance
          float fw = length(fwidth(q));                                // pixel footprint on the ground: fine relief fades before it can alias
          float bs = smoothstep(380.0, 80.0, dist) / (1.0 + dist * 0.006) * (1.0 - smoothstep(0.35, 2.2, fw));
          // relief = slabs + pahoehoe ropes in lobes; the normal comes from finite differences of the same band-limited function
          vec2 wq = q + 3.0 * vec2(vn(q * 0.085), vn(q * 0.085 + 7.3));
          float rm = smoothstep(0.42, 0.66, vn(q * 0.041 + 8.0)) * (1.0 - smoothstep(0.25, 0.8, fw)) * 0.4;
          float fA = 0.45 * (1.0 - smoothstep(0.15, 0.7, fw));
          float nearK = 1.0 - smoothstep(22.0, 55.0, dist);                                   // close to the eye: glassy ropes and blisters
          float fB = 0.3 * nearK * (1.0 - smoothstep(0.04, 0.22, fw));
          #define RELIEF(o) (0.62 * vn((q + o) * 0.33) + fA * vn((q + o) * 1.1 + 5.0) + fB * (vn((q + o) * 2.6 + 3.0) + 0.6 * (1.0 - abs(sin((wq.x + (o).x) * 4.1 + 3.0 * vn((q + o) * 0.6))))) + rm * (1.0 - abs(sin((wq.x + (o).x) * 1.25 + 2.0 * sin((wq.y + (o).y) * 0.31)))))
          vec2 o0 = vec2(0.0), ox = vec2(0.3, 0.0), oz = vec2(0.0, 0.3);
          float b0 = RELIEF(o0);
          vec3 N = normalize(vN);
          if (bs > 0.01) { float hx = RELIEF(ox) - b0, hz = RELIEF(oz) - b0;
            N = normalize(N - vec3(hx, 0.0, hz) * (5.0 * bs)); }
          b0 = b0 * 0.8 + 0.2;
          float slope = 1.0 - N.y;
          float big = vn(q * 0.02 + 3.0) * 0.7 + vn(q * 0.057) * 0.3;
          vec3 alb = mix(uT0, uT1, smoothstep(0.3, 0.75, big));
          alb *= 0.55 + 0.9 * b0;
          if (nearK > 0.0) alb *= mix(1.0, 0.55 + 0.9 * vn(q * 2.9 + 1.3) * (0.6 + 0.8 * vn(q * 7.3)), nearK * (1.0 - smoothstep(0.05, 0.3, fw)));
          alb = mix(alb, uT0 * 0.6, smoothstep(0.25, 0.6, slope));
          // cracked crust glowing near lava
          vec2 vc = vD.x > 0.03 ? voro(q * 0.13 + vec2(vn(q * 0.07), vn(q * 0.07 + 9.0)) * 1.6) : vec2(1.0);
          float crack = smoothstep(0.1, 0.0, vc.y);
          float hm = vD.x * (0.35 + 1.1 * vn(q * 0.05 + uTime * 0.012)) * (0.8 + 0.2 * sin(uTime * 0.9 + vc.x * 19.0));
          float heat = crack * smoothstep(0.2, 0.75, hm) * 0.62, shieldHot = 0.0;
          alb = mix(alb, uT2, 0.3 * smoothstep(0.3, 0.9, vD.x));
          // upper river, crater lake, flank streams (drawn, not modelled)
          float up = smoothstep(0.5, 1.0, vD.z);
          if (up > 0.0) {
            float z = P.z, cz = ${E.toFixed(1)}, zt = ${D.toFixed(1)};
            float urx = uUM.x * sin((z - zt) * 0.021 + uUM.y) * smoothstep(zt - 6.0, zt - 70.0, z) * smoothstep(cz + 40.0, cz + 130.0, z);
            float uw = mix(40.0, 7.0, pow(smoothstep(zt, zt - 110.0, z), 0.7));
            float du = abs(P.x - urx) - uw + 5.0 * (vn(q * 0.12) - 0.5);
            float band = smoothstep(1.2, -1.8, du) * step(cz + 6.0, z);
            vec2 fl2 = band > 0.001 ? lavaFlow2(vec2((P.x - urx) * 0.9, z * 0.55), uTime, 1.0 + 1.5 * smoothstep(cz + 200.0, cz + 60.0, z)) : vec2(0.0); float fl = fl2.x;
            float cool = smoothstep(-uw, 0.0, du);                       // cooler toward the banks
            float hr = band * clamp(fl * (1.15 - 0.45 * cool) + 0.1, 0.0, 1.0);
            // the same deep line as the river below the fall has: a gold core down the middle of the upper river, from the vent to the brink
            float deepU = 1.0 - smoothstep(0.1, 0.5, cool + 0.3 * (vn(vec2(z * 0.013, 4.7)) - 0.5));
            hr = max(hr, band * deepU * mix(0.3, 0.82, smoothstep(0.05, 0.4, fl2.y)));
            vec2 dv = P.xz - uVent.xz; float rho = length(dv), th = atan(dv.x, dv.y);
            float lake = smoothstep(${($*.72).toFixed(1)}, ${($*.5).toFixed(1)}, rho);
            hr = max(hr, lake * (0.65 + 0.35 * vn(q * 0.4 + uTime * 0.3)));
            if (rho < 290.0) {
              float bm = 0.0; vec2 bq = vec2(0.0);
              for (int i = 0; i < 5; i++) {
                vec4 s = uStr[i]; float dth = th - s.x; dth = atan(sin(dth), cos(dth));
                float lat = (dth + 0.09 * sin(rho * 0.035 + s.w) + 0.03 * sin(rho * 0.11 + s.w * 2.0)) * rho;
                float m = (1.0 - smoothstep(s.z * 0.25, s.z, abs(lat))) * step(1.0, s.y) * (1.0 - smoothstep(s.y * 0.7, s.y + 0.01, rho))
                  * smoothstep(${($*.8).toFixed(1)}, ${($*1.3).toFixed(1)}, rho) * mix(1.0, 0.5, rho / max(s.y, 1.0));
                if (m > bm) { bm = m; bq = vec2(lat * 1.4, rho * 0.6 + s.w * 9.0); }
              }
              if (bm > 0.01) hr = max(hr, bm * clamp(lavaFlow(bq, uTime, 2.2) * 0.9 + 0.3, 0.0, 1.0));
            }
            heat = max(heat, hr * up);
          }
          // lava streams running down the great shield behind the vent (the world places it: uShield = x, z, on, phase)
          if (uShield.z > 0.5 && P.y > 95.0) {
            vec2 dv = (P.xz - uShield.xy) * vec2(0.5, 1.0); float rho = length(dv), th = atan(dv.x, dv.y);
            float a = th * 17.0 + uShield.w + 0.3 * sin(rho * 0.009 + th * 3.0) + 0.1 * sin(rho * 0.037 + th * 9.0);
            float id = floor(a / 6.2832), hs = h21(vec2(id, 3.7)), hs2 = h21(vec2(id, 9.1));
            float lat = abs(fract(a / 6.2832) - 0.5) * 0.37 * rho;
            float w = max(mix(4.0, 9.0, hs2) * (0.65 + 0.35 * sin(rho * 0.017 + id * 2.3)), min(fw, 22.0) * 0.95);
            lat = abs(lat - w * 1.7 * max(sin(rho * 0.0085 + id * 4.1), 0.0));                 // braids: the stream parts round a kipuka and rejoins
            float m = (1.0 - smoothstep(w * 0.35, w, lat)) * step(0.42, hs) * smoothstep(mix(700.0, 1650.0, hs2), mix(400.0, 900.0, hs2), rho) * smoothstep(40.0, 130.0, rho) * smoothstep(95.0, 170.0, P.y);
            float fl = vn(vec2(lat * 0.12 + id * 5.0, rho * 0.03 - uTime * 0.22)) * 0.6 + vn(vec2(id * 3.0, rho * 0.009 - uTime * 0.05)) * 0.4;
            shieldHot = m * (0.34 + 0.46 * fl);
            heat = max(heat, shieldHot);
          }
          gMoonSpec = 0.45 * mix(1.0, 0.12, smoothstep(35.0, 90.0, dist)); gLava = mix(0.62, 0.45, nearK);
          vec3 col = forgeShade(P, N, V, alb, 0.03 + (0.08 + 0.14 * b0) * smoothstep(150.0, 25.0, dist), vD.y) * (1.0 - smoothstep(0.25, 0.6, heat));
          col += uMoonCol * alb * 2.3 * max(dot(N, uMoonDir) * 0.5 + 0.5, 0.0) * vD.y * (1.0 - smoothstep(0.25, 0.6, heat));      // cold moon fill: the plains keep their form in the dark
          // the mountain: ridged flanks catch the moon on their moon-side slopes, and the vent warms the rock around it
          float farM = smoothstep(350.0, 800.0, dist) * smoothstep(60.0, 140.0, P.y);
          if (farM > 0.0) {
            float rg = 1.0 - abs(2.0 * vn(q * 0.011 + 3.0) - 1.0), rg2 = 1.0 - abs(2.0 * vn(q * 0.031 + 9.0) - 1.0);
            vec3 Nr = normalize(normalize(vN) + vec3(uMoonDir.x, 0.0, uMoonDir.z) * (rg * 0.9 + rg2 * 0.5 - 0.7) * 0.9);
            float mr = smoothstep(0.0, 0.7, dot(Nr, uMoonDir));
            col += uMoonCol * vec3(0.6, 0.68, 1.0) * (0.04 + 0.15 * mr * (0.5 + 0.5 * rg)) * farM * (1.0 - smoothstep(0.25, 0.6, heat));
          }
          vec3 dvn = uVent + vec3(0.0, 90.0, 0.0) - P; float dv2 = dot(dvn, dvn);
          col += mix(uLavaCol, vec3(0.9, 0.08, 0.02), 0.5) * alb * 6.0 * (62500.0 / (62500.0 + dv2)) * max(dot(normalize(vN), dvn / sqrt(max(dv2, 1.0))) * 0.6 + 0.4, 0.0) * smoothstep(250.0, 420.0, dist);
          col += lavaRamp(heat) * step(0.02, heat) * (1.0 + 2.2 * smoothstep(0.02, 0.2, shieldHot));
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`}),g=new a.Mesh(w,n);g.name="forge-terrain",U.add(g),Me.terrain=n}await T.yield();const De=28+F.sag,Ee=e=>Math.max(-2,De-16*((e+F.lean*3)/34)**2),qe=e=>le(F.deck-7*(e/50)**2+1.2*R.n2(e*.05,4.2),23,P(44,66,Math.abs(e))),Ie=e=>7.5+5.5*(Math.abs(e)/50)**2+1.2*R.n2(e*.07,9.1);{const e=[],i=[],C=(n,g)=>[Math.cos(n*Math.PI/3)*g,Math.sin(n*Math.PI/3)*g],u=(n,g,t,o)=>{e.push(...n,...g,...t),i.push(...o,...o,...o)};for(let n=0;n<6;n++){const[g,t]=C(n,1),[o,c]=C(n+1,1),[s,m]=C(n,.62),[k,H]=C(n+1,.62),z=Math.cos((n+.5)*Math.PI/3),N=Math.sin((n+.5)*Math.PI/3);u([g,0,t],[o,1,c],[o,0,c],[z,0,N]),u([g,0,t],[g,1,t],[o,1,c],[z,0,N]),u([g,1,t],[k,2,H],[o,1,c],[z*.8,.6,N*.8]),u([g,1,t],[s,2,m],[k,2,H],[z*.8,.6,N*.8]),u([0,2,0],[k,2,H],[s,2,m],[0,1,0])}const x=[],v=[],r=(n,g,t,o,c,s,m)=>{x.push(n,g,t,o),v.push(c,S(),s,m)},l=[];for(let n=0,g=0;n<7&&g<200;g++){const t=n%2?1:-1,o=t*S.range(62,235),c=S.range(-45,235),s=S.range(13,25);Math.abs(o-q(c))<48+s||c<oe(o)+s+16||l.some(m=>Math.hypot(m.x-o,m.z-c)<m.R+s+12)||(l.push({x:o,z:c,R:s,peak:S.range(18,58)*(1-.3*P(120,240,Math.abs(o)))}),n++)}const h=2,b=Math.sqrt(3);for(let n=-108;n<=108;n++){for(let g=-31;g<=74;g++){const t=1.5*h*n,o=b*h*(g+.5*(n&1)),c=oe(t),s=o-c;if(s<-3)continue;const m=Math.abs(t-q(o))-K(o);if(m<.6)continue;let k=s<15||m<18&&o<150,H=null;if(!k){for(const L of l)if(Math.hypot(L.x-t,L.z-o)<L.R){H=L;break}if(!H)continue}const z=O(t,o),N=R.n2(t*.045,o*.045),A=R.n2(t*.83+5,o*.83);let _=-1e9;if(s<15){const L=1-P(240,325,Math.abs(t));_=Math.max(_,3+(Q-3)*L*(1-.86*Math.pow(P(1,15,s),.7))+N*4.5+A*4.2*P(0,5,s)+(s<1.5?1.5:0))}if(m<18&&o<150){const L=we(o);L>8&&(_=Math.max(_,L*Fe(.36+.72*P(0,9,m),0,1.06)*(1-.25*P(11,17,m))+N*3+A*4.5))}if(H){const L=Math.hypot(H.x-t,H.z-o)/H.R;R.n2(t*1.7+40,o*1.7)>.42-.5*L?H=null:_=Math.max(_,z+H.peak*Math.pow(1-L*L,.45)*(.5+.5*(A*.5+.5))+N*4+A*5)}if(_<z+1.4)continue;const Z=Math.min(z,m<4?-3:z)-4;(Math.abs(t)>15||o>30)&&(_=Math.max(z+1.4,_+Math.round(R.n2(t*1.9+60,o*1.9)*2.6)*1.5*(H?.6:1)*(m<6&&o<150?.5:1))),r(t+A*.12,Z,o,h*.965,_-Z,1,(1-P(0,24,m))*(s>4?1:.6))}(n&1)===0&&await T.yield()}const p=1.25;for(let n=-22;n<=22;n++)for(let g=-10;g<=10;g++){const t=1.5*p*n,o=b*p*(g+.5*(n&1)),c=Ie(t)-1.4;if(Math.abs(o)>c)continue;const s=o/c,m=R.n2(t*.6+31,o*.6),k=R.n2(t*.11,o*.11+17),H=Ee(t)+1.6+s*s*3.2;let z=(1.4+9.5*P(4,27,Math.abs(t))*(.55+.45*(k*.5+.5))+2.2*(m*.5+.5))*(1-.45*s*s)+1.6;z=Math.min(z,H-(O(t,o)+2.5));const N=14.2,A=Math.abs(t);A<N&&(z=Math.min(z,H-(11+Math.sqrt(N*N-A*A)))),!(z<.9)&&r(t,H,o,p*.95,z,-1,.25)}const M=(n,g,t,o,c,s,m)=>{x.push(n,g,t,o),v.push(c,Ae("forge-pipe",n,t)(),s,m)};I.columns&&await I.columns(M,be);const f=new a.InstancedBufferGeometry;f.setAttribute("position",new a.Float32BufferAttribute(e,3)),f.setAttribute("normal",new a.Float32BufferAttribute(i,3)),f.setAttribute("aI",new a.InstancedBufferAttribute(new Float32Array(x),4)),f.setAttribute("aJ",new a.InstancedBufferAttribute(new Float32Array(v),4)),f.instanceCount=x.length/4,f.boundingSphere=new a.Sphere(y(0,20,60),420);const w=new a.ShaderMaterial({fog:!0,side:a.DoubleSide,uniforms:{...ve(),uT0:{value:X[0]},uT1:{value:X[1]},uT2:{value:X[2]}},vertexShader:`
        attribute vec4 aI; attribute vec4 aJ; varying vec4 vH; varying float vFootY; varying vec2 vHex;
        ${ce}
        void main(){
          float r = aI.w, h = aJ.x, fl = aJ.z, yf = position.y;
          float y = yf < 0.5 ? 0.0 : (yf < 1.5 ? h - min(0.62 * r, 0.4 * h) : h);
          vec2 tilt = (vec2(fract(aJ.y * 7.13), fract(aJ.y * 13.7)) - 0.5) * 0.55;
          if (yf > 0.5) y += dot(position.xz, tilt) * r;
          vec3 P = vec3(aI.x + position.x * r, aI.y + fl * y, aI.z + position.z * r);
          vec3 N = normalize(vec3(normal.x, normal.y * fl, normal.z));
          vHex = position.xz; vH = vec4(y / max(h, 0.01), aJ.y, aJ.w, fl); vFootY = y - 6.0;      // height above the lava the column stands by (bases are sunk ~6 m)
          ${he} }`,fragmentShader:`
        varying vec3 vP; varying vec3 vN; varying vec3 vCam; varying vec4 vH; varying float vFootY; varying vec2 vHex;
        uniform float uTime; uniform vec3 uT0, uT1, uT2;
        #include <fog_pars_fragment>
        ${fe}
        ${te}
        void main(){
          vec3 P = vP, N = normalize(vN); float dist = length(vCam - P); vec3 V = (vCam - P) / dist;
          float seed = vH.y, side = 1.0 - smoothstep(0.3, 0.7, abs(N.y)), up = step(0.0, vH.w);
          // cooling joints: two or three irregular dark cross-fractures to a pipe, never a regular banding
          float jy = (P.y + seed * 53.0) / (7.0 + 9.0 * fract(seed * 5.7));
          float drum = h21(vec2(floor(jy), seed * 91.0));
          float joint = smoothstep(0.0, 0.012, abs(fract(jy) - 0.5) - 0.488) * side * step(0.4, drum) * (1.0 - smoothstep(60.0, 160.0, dist));
          // each face is fluted: long vertical ribs (noise drawn out 20:1 in y), fading with distance; no cross grain at all
          float fid = floor(atan(vHex.y, vHex.x + 1e-5) / 1.0472 + 3.0);
          float ha = dot(vHex, vec2(-sin((fid - 2.5) * 1.0472), cos((fid - 2.5) * 1.0472)));          // -0.5 .. 0.5 across this face
          float nearF = 1.0 - smoothstep(18.0, 46.0, dist);
          float flA = vn(vec2(ha * 5.0 + fid * 3.7 + seed * 19.0, P.y * 0.07 + seed * 5.0)), flB = vn(vec2(ha * 13.0 + fid * 7.1 + seed * 31.0, P.y * 0.19));
          float flute = mix(0.5, 0.62 * flA + 0.38 * flB, nearF), streak = mix(0.5, vn(vec2(seed * 23.0 + fid, P.y * 0.045)), 1.0 - smoothstep(80.0, 220.0, dist));
          vec3 alb = mix(uT0, uT1, smoothstep(0.35, 0.9, fract(seed * 3.3) * 0.6 + streak * 0.5));
          alb *= (0.62 + 0.5 * fract(seed * 17.3)) * (0.9 + 0.2 * drum) * (0.72 + 0.56 * flute);
          alb *= 1.0 - 0.5 * joint;
          // the creases where neighbouring prisms meet stay dark: every pipe reads as a prism
          float crease = smoothstep(0.885, 1.0, length(vHex)) * side;
          alb *= 1.0 - 0.85 * crease;
          // the six faces are six fracture planes: alternate ones a quarter darker, each a little its own, so the section reads hexagonal
          alb *= mix(1.0, (0.76 + 0.24 * mod(fid, 2.0)) * (0.82 + 0.36 * h21(vec2(fid, seed * 37.0))), side);
          alb = mix(alb, alb * 0.8, 1.0 - side);                                     // lids and shoulders: dark, they only take the moon
          N = normalize(N + vec3(-N.z, 0.0, N.x) * (flA - 0.5) * 0.5 * nearF * side);                // the ribs turn the light a little from side to side
          float ao = (0.42 + 0.58 * smoothstep(0.0, 0.55, vH.x)) * (1.0 - 0.3 * joint) * (1.0 - 0.45 * crease);
          // lava is an up-light: it reaches the lower faces of standing columns, and never their lids
          float reach = mix(0.12, 0.8, smoothstep(30.0, 2.0, vFootY)) * (1.0 - 0.74 * smoothstep(0.06, 0.9, vH.x));     // the up-light climbs the pipe and dies away smoothly
          float topK = 1.0 - smoothstep(0.0, 9.0, (vFootY + 6.0) * (1.0 / max(vH.x, 0.02) - 1.0));                     // the last metres under each lid: out of the glow, in the moonlight
          reach *= 1.0 - 0.6 * topK;
          float gorge = smoothstep(175.0, 140.0, P.z) * smoothstep(-30.0, -8.0, P.z);
          reach *= mix(1.0, 0.88, gorge);                                                                              // the bridge gorge keeps darker upper walls
          gLava = mix(1.0, mix(0.05, reach, side), up);
          gLava *= mix(1.0, 0.35, smoothstep(120.0, 350.0, dist) * up);                                                 // far fields: dark silhouettes over a base glow
          gMoonSpec = 0.6;
          vec3 col = forgeShade(P, N, V, alb, 0.35 + 0.3 * drum, ao);
          float rimF = 1.0 - max(dot(N, V), 0.0);
          float mnC = dot(N, uMoonDir);
          col += uMoonCol * 0.2 * rimF * rimF * smoothstep(-0.2, 0.4, mnC) * side * ao;                                // cold moon rim against the lava key
          float fill = max(smoothstep(0.05, 0.55, vH.x), topK) * (ao + 0.5 * topK);
          col += uMoonCol * alb * 1.6 * max(mnC * 0.32 + 0.68, 0.0) * side * up * fill;       // and a cold sky fill on the shafts above the feet (the moon stands ahead: wrapped, or the faces we see stay black)
          col += uMoonCol * alb * 0.3 * side * (0.6 + 0.4 * ao);                                                        // a floor: no side face of any pipe is ever flat black
          col += mix(uLavaCol, vec3(0.9, 0.08, 0.02), 0.4) * dot(alb, vec3(0.42)) * 1.5 * side * up * smoothstep(20.0, 0.0, vFootY) * (0.4 + 0.6 * vH.z);   // the glowing crust warms every foot, river or no river
          col += uMoonCol * alb * 4.0 * max(mnC, 0.0) * (1.0 - side) * up;                                             // the lids take the moon: cold tops over warm feet
          float lr = length(vHex);
          col += uMoonCol * 0.12 * smoothstep(0.52, 0.62, lr) * (1.0 - smoothstep(0.62, 0.74, lr)) * (1.0 - side) * up * smoothstep(-0.2, 0.6, dot(uMoonDir, vec3(vHex.x, 0.6, vHex.y))) * (1.0 - smoothstep(70.0, 200.0, dist));   // a thin moon-blue line on the lid's edge
          // feet standing in the heat glow dull red
          float foot = vH.z * smoothstep(14.0, -1.0, vFootY) * up * side; foot *= foot;
          col += lavaRamp(0.2 + 0.25 * foot * (0.6 + 0.4 * streak)) * foot * 0.3;
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`}),V=new a.Mesh(f,w);V.name="forge-columns",V.frustumCulled=!1,U.add(V)}await T.yield();{const C=[],u=[],x=(h,b)=>Math.sign(h)*Math.pow(Math.abs(h),b);for(let h=0;h<=76;h++){const b=-67+134*h/76,p=qe(b),M=Ee(b),f=(p+M)/2,w=Math.max(1.5,(p-M)/2),V=Ie(b)+.6;for(let n=0;n<=24;n++){const g=n/24*Math.PI*2,t=x(Math.sin(g),.55),o=x(Math.cos(g),.5);let c=f+t*w,s=o*V;const m=R.fbm3(b*.07,c*.07,s*.07,3),k=Math.round(R.n3(b*.16,c*.1,s*.16)*2.5)/2.5,H=1.6*(.4+.6*Math.abs(o));s+=o*(m*1.6+k*1.1)*H+(t<-.2?-o*1.2*P(-.2,-1,t):0),c+=(t>0?1:.4)*(m*.9+k*.5),C.push(b+R.n3(b*.2,c*.2,s*.2)*.8,c,s)}(h&15)===15&&await T.yield()}for(let h=0;h<76;h++)for(let b=0;b<24;b++){const p=h*25+b,M=p+1,f=p+24+1,w=f+1;u.push(p,f,M,M,f,w)}const v=new a.BufferGeometry;v.setAttribute("position",new a.Float32BufferAttribute(C,3)),v.setIndex(u),v.computeVertexNormals();const r=new a.ShaderMaterial({fog:!0,uniforms:{...ve(),uT0:{value:X[0]},uT1:{value:X[1]},uT2:{value:X[2]}},vertexShader:`
        ${ce}
        void main(){ vec3 P = position, N = normal; ${he} }`,fragmentShader:`
        varying vec3 vP; varying vec3 vN; varying vec3 vCam;
        uniform float uTime; uniform vec3 uT0, uT1, uT2;
        #include <fog_pars_fragment>
        ${fe}
        ${te}
        void main(){
          vec3 P = vP; float dist = length(vCam - P); vec3 V = (vCam - P) / dist;
          vec3 Nf = normalize(cross(dFdx(P), dFdy(P))); if (dot(Nf, V) < 0.0) Nf = -Nf;
          vec3 N = normalize(mix(normalize(vN), Nf, 0.5));
          float side = 1.0 - smoothstep(0.35, 0.8, abs(N.y));
          // entablature: irregular, narrow, mostly vertical fracture cells on the flanks; crust on the deck
          vec2 cu = mix(P.xz * 0.35, vec2(P.x * 0.55 + P.z * 0.2, P.y * 0.2), side);
          vec2 vc = voro(cu + vec2(fb(cu * 0.6), fb(cu * 0.6 + 4.0)) * 0.7);
          float crack = smoothstep(0.09, 0.0, vc.y), cell = h21(floor(cu * 1.0) + vc.x);
          float n = fb(P.xy * 0.4 + P.z * 0.31);
          vec3 alb = mix(uT0, uT1, smoothstep(0.3, 0.8, n)) * (0.6 + 0.6 * fb(cu * 2.3)) * (0.8 + 0.35 * cell);
          alb *= 1.0 - 0.7 * crack;
          N = normalize(N + (vec3(vc.x, 0.0, vc.y) - 0.3) * 0.5 * side);
          float ao = 0.6 + 0.4 * smoothstep(8.0, 30.0, P.y) - 0.3 * crack;
          gLava = mix(1.0, 1.7, smoothstep(0.1, -0.5, N.y));                                   // the soffit is lit hard from below
          vec3 col = forgeShade(P, N, V, alb * 0.85, 0.12 + 0.15 * n, ao);
          float rimB = 1.0 - max(dot(N, V), 0.0);
          col += uMoonCol * (0.05 + 0.16 * rimB * rimB) * smoothstep(0.15, 0.75, N.y) * (0.6 + 0.8 * n);   // moon along the deck's top edge
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`}),l=new a.Mesh(v,r);l.name="forge-bridge",U.add(l)}await T.yield();const ze=()=>({...se(),uInv:d.inv,uTime:d.time,uLavaCol:d.lavaCol,uHotCol:d.hotCol,uMoonDir:d.moonDir,uMoonCol:d.moonCol,uVent:d.vent,uFountH:d.fountH,uSurge:d.surge,uFalls:d.falls});{const i=[],C=[],u=[],x=[];for(let h=300;h>D+1;h-=h>60?6:3.5)x.push(h);x.push(D+1),x.forEach((h,b)=>{const p=q(h),M=K(h)+4.5;for(let f=0;f<=10;f++){const w=f/10*2-1;i.push(p+w*M,0,h),C.push(w*M,h,w,1)}if(b>0)for(let f=0;f<10;f++){const w=(b-1)*11+f,V=w+1,n=w+10+1,g=n+1;u.push(w,V,n,V,g,n)}});const v=new a.BufferGeometry;v.setAttribute("position",new a.Float32BufferAttribute(i,3)),v.setAttribute("aUV",new a.Float32BufferAttribute(C,4)),v.setIndex(u);const r=new a.ShaderMaterial({fog:!0,uniforms:ze(),vertexShader:`
        attribute vec4 aUV; varying vec4 vUV;
        ${ce}
        void main(){ vec3 P = position, N = vec3(0.0, 1.0, 0.0); vUV = aUV; ${he} }`,fragmentShader:`
        varying vec3 vP; varying vec3 vN; varying vec3 vCam; varying vec4 vUV;
        uniform float uTime, uFountH, uSurge; uniform vec3 uLavaCol, uHotCol, uMoonDir, uMoonCol, uVent; uniform vec4 uFalls[2];
        #include <fog_pars_fragment>
        ${te}
        ${Se}
        // close to the eye the plates are crazed with hairline seams (x) and their skin is rough (y)
        vec2 fineCells(vec2 p){ vec2 v = voro(p * 0.95 + vec2(vn(p * 0.5), vn(p * 0.5 + 4.0)) * 0.8);
          return vec2(smoothstep(0.075, 0.0, v.y), 0.5 * vn(p * 2.9 + v.x * 3.0) + 0.5 * vn(p * 6.7)); }
        void main(){
          vec3 P = vP; float dist = length(vCam - P); vec3 V = (vCam - P) / dist;
          float edge = abs(vUV.z), z = vUV.y, zt = ${D.toFixed(1)};
          float pool = smoothstep(-30.0, -78.0, z);
          float sp = (1.7 + 1.2 * pool) * (1.0 - 0.65 * edge * edge);
          vec2 p = vec2(vUV.x, z) * 0.85;
          vec2 fl2 = lavaFlow2(p, uTime, sp); float fl = fl2.x, seam = fl2.y;
          float temp = 0.85 + 0.35 * pool - 0.4 * edge * edge * edge;
          float heat = clamp(fl * temp * mix(1.0, 0.82, smoothstep(40.0, 200.0, dist)) + 0.05, 0.0, 1.0);
          // the deep line of the river: down its middle (wandering a little from bank to bank as it goes) the melt is deepest, runs fastest and never
          // skins over: a gold core, orange shoulders beside it, and the red and black crust left to the shallows at the banks. vUV.w says how deep
          // this channel is (1: the river, the whole way from the upper fall down to the lowest terrace; a braid is shallow and keeps its crust)
          // The deep line is as wide in metres wherever the river goes (am: metres from it): where the river spreads, more of it is crust
          float am = abs(vUV.x + 5.0 * (vn(vec2(z * 0.013, 4.7)) - 0.5) + 2.4 * (vn(vec2(z * 0.047, 9.1)) - 0.5));
          float deep = clamp(vUV.w, 0.0, 1.0) * (1.0 - smoothstep(0.6, 0.95, edge)), run = fb(vec2(vUV.x * 0.3, z * 0.045 - uTime * 0.16));
          float core = deep * (1.0 - smoothstep(1.5, 5.5, am)) * (0.75 + 0.5 * run), shoulder = deep * (1.0 - smoothstep(4.5, 12.0, am)), h0 = heat;
          heat = mix(heat, max(heat, 0.6 * smoothstep(0.2, 0.65, seam)), shoulder);      // shoulders: the plates keep their black crust, the seams between them run orange
          heat = mix(heat, max(heat, mix(0.13, 0.77, smoothstep(0.1, 0.5, seam)) + 0.04 * (run - 0.5)), clamp(core, 0.0, 1.0));      // the core: dark red rafts adrift, gold melt in the seams between them
          float lift = heat - h0;
          // churn at the foot of the fall
          float churn = smoothstep(zt + 20.0, zt + 9.0, z) * smoothstep(48.0, 36.0, abs(P.x));
          for (int i = 0; i < 2; i++) { vec4 f = uFalls[i]; float dzf = P.z - f.y;
            churn = max(churn, f.w * smoothstep(1.0, 4.5, dzf) * smoothstep(19.0, 8.0, dzf) * smoothstep(f.z + 2.0, f.z - 5.0, abs(P.x - f.x))); }
          if (churn > 0.0) heat = mix(heat, 0.5 + 0.4 * fb(P.xz * 0.35 + vec2(0.0, uTime * 1.3)), churn);
          float nearK = (1.0 - smoothstep(26.0, 62.0, dist)) * (1.0 - smoothstep(0.08, 0.35, length(fwidth(p)))), rough = 0.5;
          if (nearK > 0.0) {
            float fa = fract(uTime * 0.045), fb2 = fract(uTime * 0.045 + 0.5);
            vec2 ca = fineCells(p - vec2(0.0, sp * 22.0 * (fa - 0.5))), cb = fineCells(p + 31.7 - vec2(0.0, sp * 22.0 * (fb2 - 0.5)));
            vec2 fc = mix(cb, ca, 1.0 - abs(2.0 * fa - 1.0));
            float cool = 1.0 - smoothstep(0.14, 0.4, heat);                                   // only the cooled plates craze
            heat = max(heat, fc.x * cool * nearK * (0.27 + 0.2 * vn(p * 0.3 + uTime * 0.05)) * (1.0 - churn) * smoothstep(0.25, 0.6, vn(p * 0.23 + 5.0)));
            rough = mix(0.5, fc.y, nearK);
          }
          vec3 col = lavaRamp(heat) * 0.8;
          // cooled plates: dark glassy crust with a soft moon sheen; they mirror the fall and the fountain
          float crust = 1.0 - smoothstep(0.16, 0.42, heat);
          float pfw = length(fwidth(p));
          vec2 bn = vec2(vn(p * 0.6) - 0.5, vn(p * 0.6 + 5.3) - 0.5) * (1.0 - smoothstep(0.3, 1.5, pfw));   // broad swells only: nothing here can alias
          bn += vec2(vn(p * 3.1 + 2.0) - 0.5, vn(p * 3.1 + 8.0) - 0.5) * 0.7 * nearK;
          vec3 N = normalize(vec3(bn.x * 0.22, 1.0, bn.y * 0.22));
          vec3 R = reflect(-V, N);
          float fres = 0.04 + 0.96 * pow(1.0 - max(dot(N, V), 0.0), 4.0);
          vec3 refl = vec3(0.0);
          vec3 R0 = reflect(-V, normalize(vec3(bn.x * 0.03, 1.0, bn.y * 0.03)));
          if (R0.z < -0.01) { float t = (zt + 6.0 - P.z) / R0.z; vec3 hit = P + R0 * t;
            float shim = (0.55 + 0.45 * sin(P.x * 1.9 + 5.0 * vn(vec2(P.x * 0.6, P.z * 0.05 - uTime * 0.25)))) * smoothstep(0.25, 0.7, fb(vec2(P.x * 0.22, P.z * 0.025 - uTime * 0.06))) * 1.7 * smoothstep(0.0, 0.1, V.y);      // long soft streaks lying toward the fall
            refl += mix(uLavaCol, vec3(1.0, 0.16, 0.02), 0.45) * 1.2 * shim * smoothstep(46.0, 30.0, abs(hit.x)) * smoothstep(54.0, 30.0, hit.y) * smoothstep(-2.0, 4.0, hit.y) * step(0.0, t) * smoothstep(250.0, 110.0, P.z); }      // only the gorge below the fall mirrors it: further down the river it is hidden behind the bridge
          refl += uMoonCol * vec3(0.82, 0.74, 1.12) * (0.28 * pow(max(dot(R, uMoonDir), 0.0), 14.0) + 0.035);      // a violet-blue sheen: a cyan one over dim orange melt read olive green
          col += crust * (refl * fres * (0.6 + 0.8 * rough) + vec3(0.0058, 0.0048, 0.0095) * (0.6 + 0.8 * vn(p * 0.45 + 2.0)) * (0.3 + 1.4 * rough));
          // the fountain's glitter path: a broken streak of its light lying on the lava toward the vent
          vec2 cv = uVent.xz - vCam.xz; float cl = max(length(cv), 1.0); cv /= cl;
          vec2 pc = P.xz - vCam.xz; float along = dot(pc, cv), off = pc.x * cv.y - pc.y * cv.x;
          float gw = 2.2 + along * 0.075;
          float dash = fb(vec2(off * 0.5, along * 0.11 - uTime * 0.22));                    // one continuous shimmer drawn out toward the vent: no cells, no steps
          float glit = exp(-(off * off) / (gw * gw)) * smoothstep(0.3, 0.75, dash + 0.12 * uSurge) * smoothstep(4.0, 14.0, along) * (1.0 - smoothstep(60.0, 170.0, along))
            * smoothstep(1100.0, 600.0, cl) * (1.0 - 0.97 * (1.0 - smoothstep(0.16, 0.42, heat - lift * (1.0 - churn)))) * (0.55 + 0.75 * uSurge) * (0.85 + 0.15 * sin(uTime * 5.1));
          col += mix(uLavaCol, uHotCol, 0.5) * 1.5 * glit;                                                        // it brightens the molten cracks; the plates stay dark
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`}),l=new a.Mesh(v,r);l.name="forge-river",U.add(l),Me.river=r}await T.yield();{const u=[],x=[],v=[],r=[];for(let M=0;M<5;M++)r.push({z:D-16+17*M/5,y:Q-.9,tau:-1+M/5});for(let M=0;M<=26;M++){const f=M/26;r.push({z:D+1+12.5*f,y:Q-.9-(Q+.4)*f*f-1.2*f,tau:f})}r.forEach((M,f)=>{for(let w=0;w<=56;w++){const V=-43+86*w/56;u.push(V,M.y+(M.tau>0?0:.5),M.z+(M.tau>0?1.6*R.n2(V*.12,3.3)*(1-M.tau*.5):0)),x.push(V,M.tau)}if(f>0)for(let w=0;w<56;w++){const V=(f-1)*57+w,n=V+1,g=V+56+1,t=g+1;v.push(V,g,n,n,g,t)}});const l=[];for(let M=0;M<3;M++)l.push(new a.Vector3(M<F.fallGaps?S.range(-30,30):999,S.range(1.8,4.2),S.range(.35,.9)));const h=new a.BufferGeometry;h.setAttribute("position",new a.Float32BufferAttribute(u,3)),h.setAttribute("aUV",new a.Float32BufferAttribute(x,2)),h.setIndex(v);const b=new a.ShaderMaterial({fog:!0,side:a.DoubleSide,uniforms:{...ze(),uGap:{value:l}},vertexShader:`
        attribute vec2 aUV; varying vec2 vUV; uniform float uTime;
        #include <fog_pars_vertex>
        void main(){ vUV = aUV; vec3 P = position; float t = max(aUV.y, 0.0);
          P.z += (sin(P.x * 0.31 + t * 7.0 - uTime * 2.3) * 0.7 + sin(P.x * 0.83 - uTime * 1.7 + t * 11.0) * 0.3) * t;
          vec4 mvPosition = modelViewMatrix * vec4(P, 1.0); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec2 vUV; uniform float uTime; uniform vec3 uLavaCol, uHotCol; uniform vec3 uGap[3];
        #include <fog_pars_fragment>
        ${te}
        void main(){
          float x = vUV.x, tau = vUV.y, t = max(tau, 0.0);
          // ragged edges and rock teeth that split the curtain at the lip
          float wn = fb(vec2(x * 0.5, t * 2.0 - uTime * 0.4));
          float m = smoothstep(41.5, 38.0, abs(x) + (wn - 0.5) * 5.0 * (0.4 + t));
          for (int i = 0; i < 3; i++) { vec3 g = uGap[i]; m *= smoothstep(g.y * (1.0 - t / g.z) , g.y * (1.0 - t / g.z) + 1.4, abs(x - g.x) + (wn - 0.5) * 1.5); }
          // threads thinning as the sheet accelerates
          float thr = fb(vec2(x * 1.7, t * 1.4 - uTime * 0.55));
          m *= smoothstep(0.02, 0.2, thr + 0.55 - 0.42 * t);
          if (m < 0.5) discard;
          float fall = t * 3.1 - uTime;                                        // pattern rides the falling melt
          float streak = fb(vec2(x * 1.3, fall * 0.9)) * 0.6 + fb(vec2(x * 4.1, fall * 0.5)) * 0.4;
          float clot = smoothstep(0.5, 0.8, fb(vec2(x * 4.0, fall * 0.25)));        // long thin cooling skins
          float heat = 0.9 - 0.26 * t - 0.2 * clot * (0.3 + t) + (streak - 0.5) * 0.6;
          heat += 0.14 * smoothstep(0.25, 0.0, t) * smoothstep(-0.2, 0.0, tau);    // the brink is the hottest
          heat = mix(heat, 0.5 + 0.4 * streak, step(tau, 0.0) * 0.6);          // the river arriving at the lip is cooler
          heat = max(heat, (0.8 + 0.2 * fb(vec2(x * 0.7, uTime * 1.6))) * smoothstep(0.88, 1.0, t));   // impact
          heat -= 0.09 * exp(-x * x / 260.0) * smoothstep(-0.2, 0.3, tau);    // a cooler curtain right behind the portal: its rim separates
          gl_FragColor = vec4(lavaRamp(clamp(heat, 0.0, 0.95)) * (1.0 - 0.25 * exp(-x * x / 260.0)), 1.0);
          #include <fog_fragment>
        }`}),p=new a.Mesh(h,b);p.name="forge-fall",U.add(p)}await T.yield();const ue=new a.Vector2(S.sign()*Math.cos(F.wind),Math.sin(F.wind)),Ce=()=>{const e=new a.InstancedBufferGeometry;return e.setAttribute("position",new a.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),e.setIndex([0,1,2,0,2,3]),e};{const v=new Float32Array(72400);for(let n=0;n<18100*4;n++)v[n]=S();const r=Math.round(14500*He),l=Math.round(4200*He),h=r+l+500+700,b=new Float32Array(h*4),p=new Float32Array(h),M=T.core.makeRng(((T.seed|0)+1)*5081+77);for(let n=0;n<h;n++){const g=n<r?0:n<r+l?1:n<r+l+500?2:3,t=g===0?n:g===1?n-r:g===2?n-r-l:n-r-l-500,o=g===0?t:g===1?t<2400?14500+t:-1:g===2?16900+t:17400+t;for(let c=0;c<4;c++)b[n*4+c]=o>=0?v[o*4+c]:M();p[n]=g}await T.yield();const f=Ce();f.setAttribute("aS",new a.InstancedBufferAttribute(b,4)),f.setAttribute("aK",new a.InstancedBufferAttribute(p,1)),f.instanceCount=h,f.boundingSphere=new a.Sphere(y(0,200,-200),700);const w=new a.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide,uniforms:{...se(),uTime:d.time,uVent:d.vent,uFountH:d.fountH,uSurge:d.surge,uLavaCol:d.lavaCol,uHotCol:d.hotCol,uShape:{value:new a.Vector3(F.spread,F.tilt,F.meander)},uWind:{value:ue}},vertexShader:`
        attribute vec4 aS; attribute float aK;
        uniform float uTime, uFountH, uSurge; uniform vec3 uVent, uShape; uniform vec2 uWind;
        varying vec2 vQ; varying vec3 vC;
        #include <fog_pars_vertex>
        const float G = ${je.toFixed(2)};
        void main(){
          vec3 c, vel; float w, len, heat, bright, T, t;
          if (aK < 1.5) {                                         // fountain: ballistic, launched in pulses
            float v0 = sqrt(2.0 * G * uFountH);
            float sp = v0 * (0.5 + 0.5 * sqrt(aS.x));
            float ang = uShape.x * (0.07 + 0.96 * aS.y * aS.y) * (1.0 + 0.7 * step(0.5, aK) * (0.4 + 0.6 * aS.w)), az = aS.z * 6.2832;       // a narrow jet: ~10 degrees at the widest; the veil opens wider
            vec3 dir = normalize(vec3(sin(ang) * cos(az) + uShape.y, cos(ang), sin(ang) * sin(az)));
            T = 2.0 * sp * dir.y / G + 2.2;
            float cyc = uTime / T + aS.w; t = fract(cyc) * T;
            float born = (floor(cyc) - aS.w) * T;
            float pulse = 0.86 + 0.09 * sin(born * 0.83) + 0.05 * sin(born * 2.1 + 1.3);
            vec3 v0v = dir * sp * pulse;
            vec3 wnd = vec3(uWind.x, 0.0, uWind.y) * (0.5 + aS.x);
            float hs = 1.04;                                                   // the clots' paths are the same all through the visit: the surge lights more of them, it does not throw them higher (1.04 is midway between the 1.00 and 1.08 this used to move between)
            c = uVent + (v0v * t + vec3(0.0, -0.5 * G * t * t, 0.0)) * hs + wnd * t * t * 0.3;
            vel = (v0v + vec3(0.0, -G * t, 0.0)) * hs + wnd * t * 0.6;
            float k = t / T, fallk = smoothstep(0.0, -14.0, vel.y);
            heat = 1.0 - 0.68 * k;
            float fl = uVent.y + 14.0 - 0.72 * max(length(c.xz - uVent.xz) - 28.0, 0.0);       // cone flank
            float on = smoothstep(fl - 6.0, fl + 6.0, c.y) * step(aS.w * 0.999, 0.55 + 0.65 * uSurge + 0.3 * step(0.5, aK));
            on *= mix(0.6, 1.0, smoothstep(6.0, 42.0, length(c.xz - uVent.xz))) / (0.75 + 0.7 * uSurge);          // inside the jet the clots do not pile up to white: the jet itself is drawn there
            if (aK < 0.5) {                                       // clots and bombs: short trails, they leave the jet and arc over
              w = mix(1.2, 3.4, aS.z * aS.z); len = w + length(vel) * 0.62;                   // long trails along the flight
              bright = on * 2.0 * smoothstep(0.03, 0.2, k) * (1.0 - 0.5 * smoothstep(0.85, 1.0, k));
            } else {                                              // the falling veil: wide soft streaks, only on the way down
              w = mix(5.0, 11.0, aS.x); len = w * 1.3 + length(vel) * 0.55;
              bright = on * 1.1 * (0.9 + 0.15 * uSurge) * fallk * (1.0 - 0.45 * smoothstep(0.82, 1.0, k)); heat *= 0.88;
            }
          } else if (aK < 2.5) {                                  // spatter where the fall hits the pool
            vec3 p0 = vec3((aS.x * 2.0 - 1.0) * 37.0, 0.5, ${(D+13).toFixed(1)});
            vec3 v0v = vec3((aS.y - 0.5) * 12.0, 9.0 + 17.0 * aS.z * aS.z, 2.0 + 9.0 * aS.y);
            T = 2.0 * v0v.y / G + 0.2; t = fract(uTime / T + aS.w) * T;
            c = p0 + v0v * t + vec3(0.0, -0.5 * G * t * t, 0.0); vel = v0v + vec3(0.0, -G * t, 0.0);
            heat = 1.0 - 0.5 * t / T; bright = 0.9; w = mix(0.45, 1.1, aS.x); len = w + length(vel) * 0.09;
          } else {                                                // embers lifting off the river in the heat
            float z0 = mix(-84.0, 270.0, aS.y), rxz = z0 > 140.0 ? uShape.z * pow((z0 - 140.0) / 160.0, 2.0) : 0.0;
            float hwz = 13.0 + 26.0 * smoothstep(-35.0, -76.0, z0);
            T = mix(6.0, 11.0, aS.z); t = fract(uTime / T + aS.w) * T;
            float up = mix(2.5, 6.5, aS.w);
            c = vec3(rxz + (aS.x * 2.0 - 1.0) * hwz, 0.3 + up * t + 0.12 * t * t, z0);
            c.xz += uWind * t * 1.4 + vec2(sin(t * 1.3 + aS.x * 40.0), cos(t * 1.1 + aS.y * 40.0)) * (0.6 + 0.35 * t);
            vel = vec3(cos(t * 1.3 + aS.x * 40.0), up, -sin(t * 1.1 + aS.y * 40.0));
            float k = t / T; heat = 0.9 - 0.6 * k;
            bright = 1.3 * smoothstep(0.0, 0.08, k) * (1.0 - smoothstep(0.55, 1.0, k)) * (0.55 + 0.45 * sin(uTime * 7.0 + aS.z * 90.0));
            w = mix(0.16, 0.38, aS.z); len = w * 2.2;
          }
          vec4 mv = modelViewMatrix * vec4(c, 1.0);
          vec2 d2 = (mat3(modelViewMatrix) * vel).xy; float dl = length(d2); d2 = dl > 1e-4 ? d2 / dl : vec2(0.0, 1.0);
          float px = -mv.z * 0.0022;                               // never thinner than ~1.2 px (and no brighter for it)
          float farK = smoothstep(250.0, 900.0, -mv.z) * step(aK, 1.5);          // from afar the fountain is drawn in arcs, not in sparks
          bright *= clamp(w / px, aK < 0.5 ? 0.22 : 0.5, 1.0) * mix(1.0, aK < 0.5 ? 0.5 : 0.8, farK);
          w = max(w, px); len = max(len, px * mix(1.0, aK < 0.5 ? 4.5 : 7.0, farK));
          mv.xy += d2 * position.y * len + vec2(-d2.y, d2.x) * position.x * w;
          vQ = position.xy * 2.0;
          vec3 hot = mix(vec3(0.9, 0.09, 0.005), vec3(1.0, 0.24, 0.03), smoothstep(0.2, 0.55, heat));
          hot = mix(hot, vec3(1.0, 0.56, 0.12), smoothstep(0.55, 0.85, heat)); hot = mix(hot, vec3(1.0, 0.68, 0.2), smoothstep(0.85, 1.0, heat));      // fresh clots leave the vent yellow
          vC = hot * bright * mix(0.7, 1.6, heat * heat);
          vec4 mvPosition = mv; gl_Position = projectionMatrix * mv;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec2 vQ; varying vec3 vC;
        #include <fog_pars_fragment>
        ${ge}
        void main(){
          float a = (1.0 - vQ.x * vQ.x) * smoothstep(-1.0, 0.45, vQ.y) * (1.0 - smoothstep(0.55, 1.0, vQ.y));
          gl_FragColor = vec4(vC * a * a * fogFade(), 1.0);
        }`}),V=new a.Mesh(f,w);V.name="forge-sparks",V.frustumCulled=!1,V.renderOrder=4,U.add(V)}await T.yield();{const i=[],C=[];for(let r=0;r<=14;r++)if(i.push(-1,r/14,0,1,r/14,0),r<14){const l=r*2;C.push(l,l+1,l+2,l+1,l+3,l+2)}const u=new a.BufferGeometry;u.setAttribute("position",new a.Float32BufferAttribute(i,3)),u.setIndex(C),u.boundingSphere=new a.Sphere(B.clone().add(y(0,150,0)),260);const x=new a.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide,uniforms:{...se(),uInv:d.inv,uTime:d.time,uVent:d.vent,uFountH:d.fountH,uSurge:d.surge,uLavaCol:d.lavaCol,uHotCol:d.hotCol,uTilt:{value:F.tilt}},vertexShader:`
        uniform mat4 uInv; uniform vec3 uVent; uniform float uFountH, uTilt, uSurge; varying vec2 vQ; varying float vFar;
        #include <fog_pars_vertex>
        void main(){
          vec3 cam = (uInv * vec4(cameraPosition, 1.0)).xyz; vec3 toC = cam - uVent; toC.y = 0.0;
          vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), toC));
          float y = position.y * 1.18 - 0.18, hgt = uFountH * (0.86 + 0.1 * uSurge);      // the strip starts below the vent: the curtain lands on the cone
          float wd = 250.0;                                             // wide enough for the falling curtain; the jet is shaped in the fragment shader
          vec3 P = uVent + vec3(uTilt * y * hgt * 0.8, y * hgt - 4.0, 0.0) + right * position.x * wd;
          vQ = vec2(position.x, y); vFar = smoothstep(520.0, 1100.0, length(toC));
          vec4 mvPosition = modelViewMatrix * vec4(P, 1.0); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec2 vQ; varying float vFar; uniform float uTime, uSurge; uniform vec3 uLavaCol, uHotCol;
        #include <fog_pars_fragment>
        ${te}
        ${ge}
        void main(){
          float x = vQ.x, y = vQ.y, xm = x * 250.0;                                       // xm: metres off the axis
          float cw = mix(8.0, 31.0, pow(max(y, 0.0), 1.6)), xc = xm / cw;                             // a tapered jet: 16 m at the vent, 60 m at the crown
          float n1 = fb(vec2(xm * 0.07 + 9.0, y * 5.0 - uTime * 1.25));
          float n2 = fb(vec2(xm * 0.22, y * 11.0 - uTime * 2.1));
          float core = exp(-xc * xc * 1.2);
          float body = core * smoothstep(1.0, 0.0, y + 0.5 * (n1 - 0.5)) * (0.2 + 1.5 * n1 * n1) * (0.35 + 1.3 * n2 * n2);
          float sx = (xm + 3.0 * (n1 - 0.5)) / (cw * 0.55);
          float spine = exp(-sx * sx) * pow(max(1.0 - y, 0.0), 0.5) * (0.55 + 0.75 * n2) * (0.6 + 0.6 * n1);   // the dense unbroken column
          // the curtain: what went up comes down as a weeping dome of cooling streaks, widest at the cone
          float ro = 230.0 * pow(max(1.0 - y / 0.97, 0.0), 0.62), edge = abs(xm) / max(ro, 1.0);
          float s1 = fb(vec2(xm * 0.085, y * 1.5 + uTime * 0.33)), s2 = fb(vec2(xm * 0.3 + 7.0, y * 3.0 + uTime * 0.6));
          float streak = smoothstep(0.36, 0.6, s1) * (0.6 + 1.0 * s2) + 0.4;
          float dome = smoothstep(1.0, 0.55, edge + 0.3 * (s1 - 0.5));
          float veil = dome * (1.0 + 0.7 * smoothstep(0.45, 0.9, edge)) * smoothstep(0.5, 1.7, abs(xc)) * (0.4 + 0.6 * y) * smoothstep(-0.18, -0.06, y) * streak * (1.0 - x * x);
          float gush = 0.85 + 0.15 * sin(uTime * 0.83 - y * 6.0);
          float h = clamp((body * (1.5 - 0.7 * y) + spine * 1.25) * gush, 0.0, 1.5) * smoothstep(0.0, 0.03, y);
          vec3 hotC = mix(uHotCol, vec3(1.0, 0.92, 0.7), 0.25);
          vec3 col = mix(uLavaCol * 1.2, hotC * 1.5, smoothstep(0.2, 0.85, h)) * min(h, 1.2) * (1.15 / (1.0 + 0.6 * uSurge));
          col += mix(vec3(0.9, 0.1, 0.0), uLavaCol * 1.25, clamp(0.2 + 0.7 * y, 0.0, 1.0)) * min(veil, 1.6) * 2.3 * (0.85 + 0.12 * uSurge) * (1.0 + 2.2 * vFar);
          gl_FragColor = vec4(min(col, hotC * 1.65) * fogFade(), 1.0);                      // the column's core burns yellow-white, as bright at the far end of the river as under the bridge
        }`}),v=new a.Mesh(u,x);v.name="forge-jet",v.frustumCulled=!1,v.renderOrder=3,U.add(v)}await T.yield();{const e=[],i=[],C=[],u=(h,b,p,M,f,w,V=1,n=.15)=>{e.push(h,b,p,M),i.push(f.r*w,f.g*w,f.b*w,S()*10),C.push(V,n)},x=Y.clone().lerp(de,.35);u(B.x,B.y+14,B.z,110,Y.clone().lerp(de,.6),.1,1,.3),u(B.x,B.y+F.fountH*.42,B.z,900,Y,.04,1.1,.12),u(B.x,B.y+F.fountH*.36,B.z,300,x,.1,1.9,.2),u(B.x,B.y+F.fountH*.42,B.z,620,x,.075,.85,.16),u(B.x,B.y+F.fountH*.62,B.z,330,Y,.04,.8,.2),u(0,21,D+12,150,Y,.12,.62,.12),u(-18,4,D+16,62,x,.22,.6,.3),u(16,4,D+15,66,x,.22,.6,.3),u(0,3,-62,120,Y,.09,.5,.1);for(let h=-10;h<=270;h+=56)u(q(h),2.5,h,74,Y,.05,.42,.1);e.push(B.x,B.y+F.fountH*.52,B.z,270),i.push(.32,.028,.004,3.3),C.push(.7,.2);const v=Ce();v.setAttribute("aG",new a.InstancedBufferAttribute(new Float32Array(e),4)),v.setAttribute("aC",new a.InstancedBufferAttribute(new Float32Array(i),4)),v.setAttribute("aB",new a.InstancedBufferAttribute(new Float32Array(C),2)),v.instanceCount=e.length/4;const r=new a.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,uniforms:{...se(),uTime:d.time,uSurge:d.surge},vertexShader:`
        attribute vec4 aG; attribute vec4 aC; attribute vec2 aB; uniform float uTime, uSurge; varying vec2 vQ; varying vec3 vC;
        #include <fog_pars_vertex>
        void main(){
          vec4 mvPosition = modelViewMatrix * vec4(aG.xyz, 1.0);
          mvPosition.xy += position.xy * aG.w * vec2(1.0, aB.x);
          float f = 1.0 + aB.y * (sin(uTime * 2.3 + aC.w) * 0.6 + sin(uTime * 5.9 + aC.w * 3.0) * 0.4);
          vQ = position.xy * 2.0; vC = aC.rgb * f * (0.9 + 0.15 * uSurge);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec2 vQ; varying vec3 vC;
        #include <fog_pars_fragment>
        ${ge}
        void main(){ float r2 = dot(vQ, vQ); float a = exp(-r2 * 5.5) * pow(max(1.0 - r2, 0.0), 2.0);
          gl_FragColor = vec4(vC * a * fogFade(), 1.0); }`}),l=new a.Mesh(v,r);l.name="forge-glow",l.frustumCulled=!1,l.renderOrder=2,U.add(l)}if(I.plume!==!1){const i=new Float32Array(336),C=T.core.makeRng(((T.seed|0)+1)*3251+19);for(let r=0;r<84;r++){const l=r<46?S:C;i[r*4]=l(),i[r*4+1]=l(),i[r*4+2]=l(),i[r*4+3]=(r+l()*.6)/84}const u=Ce();u.setAttribute("aS",new a.InstancedBufferAttribute(i,4)),u.instanceCount=84;const x=new a.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...se(),uTime:d.time,uVent:d.vent,uFountH:d.fountH,uWind:{value:ue},uLavaCol:d.lavaCol,uMoonDir:d.moonDir,uMoonCol:d.moonCol,uAsh:{value:j[1].clone().lerp(j[0],.2).lerp(new a.Color("#4a4258"),.5).multiplyScalar(2.2)}},vertexShader:`
        attribute vec4 aS; uniform float uTime, uFountH; uniform vec3 uVent, uMoonDir; uniform vec2 uWind;
        varying vec2 vQ; varying vec4 vS; varying float vPh; varying vec3 vW;
        #include <fog_pars_vertex>
        void main(){
          float ph = fract(uTime / 52.0 + aS.w);
          vec3 c = uVent + vec3(0.0, uFountH * 0.42 + 330.0 * pow(ph, 0.8), 0.0);
          c.xz += uWind * (pow(ph, 1.5) * 300.0) + (aS.xy - 0.5) * mix(46.0, 170.0, ph);
          c.y += (aS.z - 0.5) * 60.0 * ph;
          float size = mix(80.0, 270.0, ph) * (0.75 + 0.5 * aS.z);
          vec4 mvPosition = modelViewMatrix * vec4(c, 1.0);
          float rot = (aS.x - 0.5) * 6.0 + uTime * 0.03 * (aS.y - 0.5); vec2 q = position.xy; q = vec2(q.x * cos(rot) - q.y * sin(rot), q.x * sin(rot) + q.y * cos(rot));
          mvPosition.xy += q * size;
          vec2 ml = (viewMatrix * modelMatrix * vec4(uMoonDir, 0.0)).xy;                    // the moon's side of every puff, on screen
          vW = vec3(q * 2.0, 0.0); vW.z = dot(vW.xy, ml / max(length(ml), 1e-3));
          vQ = position.xy * 2.0; vS = aS; vPh = ph;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        varying vec2 vQ; varying vec4 vS; varying float vPh; varying vec3 vW; uniform float uTime; uniform vec3 uLavaCol, uAsh, uMoonCol;
        #include <fog_pars_fragment>
        float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
        float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
        void main(){
          float r = length(vQ);
          float n = vn(vQ * 1.6 + vS.xy * 30.0 + uTime * 0.02) * 0.6 + vn(vQ * 3.7 + vS.yz * 17.0 - uTime * 0.03) * 0.4;
          float a = smoothstep(1.0, 0.0, r + (n - 0.5) * 0.9), a0 = a; a *= a;
          a *= 0.92 * smoothstep(0.0, 0.16, vPh) * (1.0 - smoothstep(0.6, 1.0, vPh));
          if (a < 0.004) discard;
          // lit red from the vent beneath, rimmed cold by the moon on the moon's side of each billow
          float under = pow(max(1.0 - vPh, 0.0), 1.8) * (0.25 + 0.75 * smoothstep(0.6, -0.9, vW.y)) * (0.5 + n);
          float rim = smoothstep(-0.1, 0.9, vW.z) * smoothstep(0.75, 0.2, a0) * (0.4 + 1.2 * n);
          vec3 col = uAsh * (0.45 + 0.9 * n) * (0.55 + 0.75 * smoothstep(-0.8, 0.8, vW.z)) + uLavaCol * under * 1.7 + uMoonCol * 0.3 * rim;
          gl_FragColor = vec4(col, a);
          #include <fog_fragment>
        }`}),v=new a.Mesh(u,x);v.name="forge-plume",v.frustumCulled=!1,v.renderOrder=1,U.add(v)}const Pe=[];if(I.blades!==!1){const e=[],i=[],C=(r,l,h,b,p=S)=>{const M=(b??O(r,l))-1.2,f=p.range(0,Math.PI),w=h*p.range(.26,.4),V=w*p.range(.07,.11),n=p.range(-.5,.5),g=Math.cos(f),t=Math.sin(f),o=6,c=e.length/3;for(let m=0;m<=o;m++){const k=m/o,H=w*(1-.86*Math.pow(k,1.5)),z=V*(1-.8*k),N=n*w*k*k*1.3,A=M+h*k,_=p.range(-.07,.07)*w,Z=p.range(-.1,.1)*w,L=p.range(-.2,.2),W=(G,J)=>e.push(r+g*(N+G)-t*J,A+p.range(-.3,.3),l+t*(N+G)+g*J);if(W(H*.5+_,0),W(H*L,z),W(-H*.5+Z,0),W(H*(L-.1),-z),m>0)for(let G=0;G<4;G++){const J=c+(m-1)*4+G,re=c+(m-1)*4+(G+1)%4,ie=J+4,me=re+4;i.push(J,ie,re,re,ie,me)}}const s=e.length/3;e.push(r+g*n*w*1.45,M+h*1.07,l+t*n*w*1.45);for(let m=0;m<4;m++)i.push(c+o*4+m,s,c+o*4+(m+1)%4);Pe.push(y(r,M+h,l))};for(let r=0,l=0;r<11&&l<300;l++){const h=r%2?1:-1,b=r<2,p=b?S.range(70,150):S.range(-40,250),M=b?S.range(26,40):S.range(24,95),f=q(p)+h*(K(p)+M);if(!(Math.abs(p)<26||p<oe(f)+18)&&!Pe.some(w=>Math.hypot(w.x-f,w.z-p)<16)){C(f,p,b?S.range(26,36):S.range(11,30)),r++;for(let w=S.int(0,2);w>0;w--)C(f+S.range(-7,7),p+S.range(-7,7),S.range(5,12))}}for(const r of I.bladeSpots?I.bladeSpots(be):[])C(r[0],r[2],r[3],r[1],Ae("forge-sail",r[0],r[2]));const u=new a.BufferGeometry;u.setAttribute("position",new a.Float32BufferAttribute(e,3)),u.setIndex(i),u.computeVertexNormals();const x=new a.ShaderMaterial({fog:!0,side:a.DoubleSide,uniforms:ve(),vertexShader:`
        ${ce}
        void main(){ vec3 P = position, N = normal; ${he} }`,fragmentShader:`
        varying vec3 vP; varying vec3 vN; varying vec3 vCam;
        #include <fog_pars_fragment>
        ${fe}
        ${te}
        void main(){
          vec3 P = vP; float dist = length(vCam - P); vec3 V = (vCam - P) / dist;
          vec3 N = normalize(cross(dFdx(P), dFdy(P))); if (dot(N, V) < 0.0) N = -N;
          // conchoidal fracture ripples
          vec2 q = vec2(dot(P.xz, vec2(0.71, 0.71)), P.y) * 0.3; vec2 vc = voro(q);
          float rip = sin(vc.x * 24.0) * smoothstep(0.0, 0.3, vc.y);
          N = normalize(N + vec3(rip, rip * 0.6, -rip) * 0.03);
          vec3 R = reflect(-V, N);
          float fres = 0.05 + 0.95 * pow(1.0 - max(dot(N, V), 0.0), 4.0);
          vec3 toF = normalize(uEB[6] - P);
          vec3 env = uAmbHi * 1.2 * smoothstep(0.0, 0.7, R.y) + mix(uLavaCol, uHotCol, 0.3) * (0.4 * smoothstep(0.02, -0.3, R.y) + 2.5 * smoothstep(0.93, 0.995, dot(R, toF)));
          fres = max(fres, 0.1);
          float edge = 1.0 - max(dot(N, V), 0.0);
          vec3 col = forgeShade(P, N, V, vec3(0.03, 0.025, 0.04), 0.95, 1.0) + uMoonCol * (0.012 + 0.07 * edge * edge) + env * fres + uMoonCol * fres * (0.1 + 0.9 * pow(max(dot(R, uMoonDir), 0.0), 8.0)) * smoothstep(0.0, 0.6, dot(N, uMoonDir) + 0.3);   // black glass: moon sheen only near the mirror direction
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`}),v=new a.Mesh(u,x);v.name="forge-blades",U.add(v)}await T.yield();const ne=(e,i)=>y(q(e),i,e),$e={portalSeat:{position:y(0,11,2),facing:y(0,0,1),radius:7},flyThrough:[ne(420,26),ne(330,20),ne(250,15),ne(190,12.5),y(0,11.5,132),y(0,11,90),y(0,11,45),y(0,11,2)],viewpoints:{far:ne(520,34),mid:ne(260,16),close:y(0,11,110),deck:y(-70,F.deck+16,46)},lookAt:y(0,60,D),archApex:y(-F.lean*3,De,0),bridgeDeck:y(0,qe(0)+1,0),fallLip:y(0,Q,D+1),fallFoot:y(0,0,D+13.5),poolCenter:y(0,0,-62),poolRadius:45,vent:B.clone(),fountainTop:y(B.x+F.tilt*F.fountH,Be,E),terraceY:Q,coneCenter:y(0,Q,E),coneRadius:ke,plumeBase:y(B.x,B.y+F.fountH*.42,E),plumeDrift:y(ue.x,0,ue.y),riverStart:{position:ne(300,0),direction:y(q(300)-q(290),0,10).normalize(),width:K(300)*2},banks:{left:y(-(K(165)+34)+q(165),O(q(165)-K(165)-34,165),165),right:y(q(205)+K(205)+34,O(q(205)+K(205)+34,205),205)},blades:Pe,emitters:pe.map((e,i)=>({position:e.clone().lerp(ye[i],.5),color:Y.clone().lerp(de,ae[i].w),intensity:Le[i],radius:ae[i].x})),moonDirDefault:_e.clone()};let Ne=.35,Re=-1;return{object:U,radius:300,height:Be,center:y(0,120,-210),anchors:$e,uniforms:d,ground:!0,groundY:-.5,materials:Me,glsl:{noise:te,light:fe,fogFade:ge,lavaFlow:Se,vertHead:ce,vertTail:he},lightUniforms:ve,lavaUniforms:ze,rockTint:X,layout:{rx:q,hw:K,cliffZ:oe,groundH:O,meander:F.meander,wind:ue,terraceY:Q,coneZ:E},setProgress(e){Ne=.35+.4*P(.72,.97,e),Math.abs(e-Re)>.04&&(d.surge.value=Ne),Re=e},update(e,i,C){d.time.value=i,e>0&&(d.surge.value+=(Ne-d.surge.value)*Math.min(1,e*1.5)),U.updateWorldMatrix(!0,!1),d.inv.value.copy(U.matrixWorld).invert();const u=.85+.15*Math.sin(i*.83)+.06*Math.sin(i*5.3)*Math.sin(i*1.9);for(let x=0;x<ae.length;x++){const v=x===6?u*(.75+.7*d.surge.value):.93+.07*Math.sin(i*(1.7+x*.37)+x*2.1);ae[x].y=Le[x]*v}},dispose(){}}}export{Xe as buildHero};
