import*as o from"three";import{mergeVertices as zt}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as be,lerp as O,smoothstep as F,makeNoise as Pt}from"../kit/core.js";const Mt=["#16A0F0","#0B3FA8","#5FD6E4","#DDEBF3","#3E3A38","#FFC878","#FF5E1A"],me=Math.PI/180,ue=Math.tan(22*me),j=Math.cos(22*me),se=Math.sin(22*me),X=12,K=14,Me=68*me,de=X+K*(1-Math.cos(Me)),Ce=-K*Math.sin(Me),Ct=7.5/j,Se=Ce-Ct+de*ue,Te=325,Ie=273,Nt=X+40/Me*(1-Math.cos(Me))+(34.5/40*880-581-40)*Math.sin(Me),We=7,Ee=1,Qe=14,Je=42,_e=150*me,et=-11,tt=70,ot=12,$e=Math.cos(_e),Ge=Math.sin(_e),at=4,Le=e=>3*Math.sin(e*.45+.6)+1.4*Math.sin(e*1.3+2)+at*(1-F(-12.5,-11,e))-3*Math.exp(-(((e+9.7)/1.3)**2)),Ve=e=>`(3.0*sin(${e}*0.45 + 0.6) + 1.4*sin(${e}*1.3 + 2.0) + ${at}.0*(1.0 - smoothstep(-12.5, -11.0, ${e})) - 3.0*exp(-(${e} + 9.7)*(${e} + 9.7)/1.69))`,st=8,nt=110,it=e=>st*F(3,11,e),rt=e=>(1.9*Math.abs(Math.sin(e*.62+.8*Math.sin(e*.27+1)))-.8)*F(1,4,e),lt=(e,t)=>Le(e)+it(t)+rt(t),Ft=(e,t)=>`(${Ve(e)} + ${st}.0*smoothstep(3.0, 11.0, ${t}) + (1.9*abs(sin(${t}*0.62 + 0.8*sin(${t}*0.27 + 1.0))) - 0.8)*smoothstep(1.0, 4.0, ${t}))`,At=(e,t,i)=>F(Ee,Ee+2.4,t+lt(e,i))*(1-F(Qe,Je,t))*Math.exp(-(i*i)/(i>0?nt:tt)),pe=30,ie=5,je=.18,ne=e=>Se-e*ue;function ht(e,t){if(e<=t[0][0])return t[0][1];for(let i=1;i<t.length;i++)if(e<=t[i][0]){const w=t[i-1],r=t[i];return O(w[1],r[1],F(w[0],r[0],e))}return t[t.length-1][1]}function Dt(e){const t=e.cd,i=s=>ht(s,[[0,19*e.mouthX],[30,16.5],[93,15],[240,12],[Te,10.5]]),w=s=>ht(s,[[0,25*e.mouthZ],[30,19],[93,15],[240,12],[Te,10.5]]),r=s=>O(20,i(s),F(0,45,s)),b=(s,n=0)=>{if(s<X)return(X-s)*.1;if(s<de){const d=(K-(s-X))/K;return-K*Math.sqrt(Math.max(0,1-d*d))}return Ce-(s-de)*ue+(s>t-38?9*F(t,t+We,s+Le(n)):0)};return{Rx:i,Rfar:w,Rnear:r,fwZ:b,flare:s=>s<6?3.6*(1-s/6)*(1-s/6):0,point:(s,n,d=0,l=0,a={})=>{const x=Math.cos(s),c=Math.sin(s),m=i(n)+d,z=(c>=0?r(n):w(n))+d;let u=m*x,k=ne(n)+z*c,v=x/m,A=c/z;const R=Math.hypot(v,A)||1;v/=R,A/=R;const C=b(n,u)+d,N=2.2,P=be(.5+.5*(C-k)/N,0,1),T=O(C,k,P)-N*P*(1-P),p=1-P;v=v*(1-p),A=A*(1-p)+p;const M=Math.hypot(v,A)||1;v/=M,A/=M;const S=n>t-28?Math.atan2(Math.sin(s-_e),Math.cos(s-_e))*m:99,I=n>t-28?At(u,n-t,S):0;return a.x=u+v*l+I*ot*$e,a.z=T+A*l+I*ot*Ge,a.y=-n,a.w=p,a.nx=v,a.nz=A,a.cd=I,a.x0=u,a.arc=S,a.mouthUp=n>t-28?t-lt(u,S)-n:99,a},nearZ:(s,n)=>{const d=i(n),l=be(s/d,-.98,.98),a=Math.sqrt(1-l*l),x=ne(n)+r(n)*a,c=b(n,s),m=2.2,z=be(.5+.5*(c-x)/m,0,1);return O(c,x,z)-m*z*(1-z)},cd:t}}const ve=e=>-X+.02*Math.max(e,0),Ne=e=>.01*Math.max(e,0),Oe=[[6.3,-1.6,.9,0],[6.9,-.3,1,0],[7.35,.02,1,0],[7.85,.05,1,0],[8,.09,.95,0],[7.7,.135,.9,0],[7.15,.18,.75,0],[6.9,.3,.6,0],[6.55,.45,.52,0],[6.2,.6,.46,0],[5.85,.75,.42,0],[5.55,.87,.4,0],[5.3,.94,.45,1],[5.05,.985,.5,1],[5.2,1.35,.2,2],[5.9,1.75,.06,2],[7.2,1.8,.03,2],[9,1.45,0,2],[11.5,.7,0,2]],ke=`
float smHash(vec2 p){ vec3 q = fract(vec3(p.xyx)*vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y)*q.z); }
vec2 smHash2(vec2 p){ vec3 q = fract(vec3(p.xyx)*vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz)*q.zy); }
float smNoise(vec2 x){
  vec2 i = floor(x), f = fract(x); f = f*f*(3.0 - 2.0*f);
  return mix(mix(smHash(i), smHash(i + vec2(1.0, 0.0)), f.x), mix(smHash(i + vec2(0.0, 1.0)), smHash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float smFbm(vec2 p){ return 0.5*smNoise(p) + 0.3*smNoise(p*2.07 + 13.1) + 0.2*smNoise(p*4.3 + 5.7); }
`,Fe=`
#ifdef USE_FOG
  uniform vec3 fogColor; varying float vFogDepth;
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear; uniform float fogFar;
  #endif
#endif
uniform vec3 uInk; uniform float uShaftFog; uniform float uCamDepth; uniform vec2 uCd;      // uCd: the conduit's depth, the shaft's half-width there
vec3 smFog(vec3 col, float localY, float dist){
  // haze up top; below the surface a short ink fog whose reach shrinks as the camera descends
  float below = smoothstep(4.0, 30.0, -localY);
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float f = 1.0 - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
      float f = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    col = mix(col, fogColor, f*(1.0 - below));
  #endif
  float deep = smoothstep(18.0, 150.0, max(-localY, uCamDepth));
  float fi = 1.0 - exp(-dist*uShaftFog*mix(0.25, 1.0, deep));
  return mix(col, uInk, fi*below);
}
`,It=`
attribute vec2 aSurf; attribute vec3 aIce;
varying vec3 vP; varying vec3 vW; varying vec3 vN; varying vec2 vSurf; varying vec3 vIce; varying vec3 vSunW; varying vec3 vPL; varying vec3 vLoc; varying vec2 vCd;
uniform vec3 uSun; uniform vec3 uPortalPos;
#ifdef IS_SHAFT
  attribute vec2 aCd;
#endif
#ifdef IS_BLOCK
  attribute vec4 aSeed; uniform float uTime; uniform vec4 uFlow;   // reach, speed, lipLen, fallLen
  ICE_BLOCK_PARS
#endif
#ifdef IS_ICICLE
  attribute vec2 aInst; uniform float uTime, uPx;
#endif
#include <common>
#include <fog_pars_vertex>
void main(){
  vec3 p = position; vec3 n = normal;
  #ifdef IS_BLOCK
    smBlock(p, n);
  #endif
  vP = p; vSurf = aSurf; vIce = aIce; vLoc = position; vCd = vec2(0.0);
  #ifdef IS_SHAFT
    vCd = aCd;
  #endif
  #ifdef IS_RAFT
    // rigid chunks posed on the CPU by the world (rafts, floes, the toppling slab, falling blocks)
    {
      mat3 im = mat3(instanceMatrix);
      vec3 s2 = max(vec3(dot(im[0], im[0]), dot(im[1], im[1]), dot(im[2], im[2])), vec3(1e-6));
      p = (instanceMatrix*vec4(p, 1.0)).xyz; n = normalize(im*(n/s2));
      vP = p; vSurf = aSurf*sqrt(s2.x) + float(gl_InstanceID)*7.31; vIce = vec3(aIce.x, 0.0, 2.6);
      vLoc = position*sqrt(s2) + vec3(float(gl_InstanceID)*3.7, 0.0, float(gl_InstanceID)*1.9);   // metres on the chunk, its own patch of crust
    }
  #endif
  #ifdef IS_ICICLE
    // a slow sway of the tip, then the instance transform; aInst = (sun-lit 0..1, seed)
    // (aInst.x = -1, a fringe under a snow bridge: a thin spike with an even taper from the ice down to its point, no
    // carrot shoulder and no bulb at the root. It is its own size at every range; only a floor of one pixel either side
    // of its axis, tapering to the tip, keeps a far fringe from shimmering)
    if (aInst.x < -0.5) {
      float it = clamp(-position.y, 0.0, 1.0);
      vec2 iax = vec2(0.12*sin(it*5.0), 0.0), idr = position.xz - iax;
      vec3 icw = (modelMatrix*instanceMatrix*vec4(0.0, 0.0, 0.0, 1.0)).xyz;
      float pxR = length(icw - cameraPosition)*uPx*(1.0 - 0.7*it)/max(length(instanceMatrix[0].xyz), 1e-4);
      p.xz = iax*0.4 + idr/max(length(idr), 1e-4)*max(0.52*pow(1.0 - it, 1.2) + 0.03, pxR);
    }
    p.x += 0.02*sin(uTime*1.3 + aInst.y*40.0)*(-p.y);
    p = (instanceMatrix*vec4(p, 1.0)).xyz; n = normalize(mat3(instanceMatrix)*n);
    vP = p; vSurf = aSurf + aInst.y*37.0; vIce = vec3(aIce.x, aInst.x, 3.0 + aSurf.y);
  #endif
  vec4 wp = modelMatrix*vec4(p, 1.0);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix)*n); vSunW = normalize(mat3(modelMatrix)*uSun);
  vPL = mat3(modelMatrix)*(uPortalPos - p);
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Et=`
varying vec3 vP; varying vec3 vW; varying vec3 vN; varying vec2 vSurf; varying vec3 vIce; varying vec3 vSunW; varying vec3 vPL; varying vec3 vLoc; varying vec2 vCd;
uniform float uTime, uSeason, uPortalI, uBandSeed, uLate, uLitY, uWarm, uUpGlow;
uniform vec3 uSun, uSunCol, uSkyCol, uSnow, uTurq, uCobalt, uElectric, uCryo, uGold, uPortalCol, uMauve;
uniform vec2 uDip; uniform vec4 uMouth;      // axis z at y=0, lean, Rx, Rz
#include <common>
${ke}
${Fe}
// irregular level bands: returns (clear turquoise, cobalt lens, cryoconite stripe)
vec3 smBands(float yb, float along, float aa){
  float n1 = smNoise(vec2(yb*0.31 + uBandSeed, 3.7)), n2 = smNoise(vec2(yb*0.83 + 9.1, uBandSeed)), n3 = smNoise(vec2(yb*2.3, 1.3 + uBandSeed));
  float strat = n1*0.6 + n2*0.28 + n3*0.12;
  float clear = smoothstep(0.42, 0.6, strat);
  float lens = smoothstep(0.6, 0.74, strat)*smoothstep(0.3, 0.6, smNoise(vec2(along*0.045, yb*0.2 + 4.0)));
  float yc = yb*1.15 + 0.35*n2;
  float cell = floor(yc), fr = fract(yc), r = smHash(vec2(cell, 7.0 + uBandSeed));
  float th = (0.035 + 0.07*smHash(vec2(cell, 21.0)))*1.15, w = max(th, aa*1.15);
  float d = abs(fr - (0.3 + 0.4*smHash(vec2(cell, 3.0))));
  float stripe = (1.0 - smoothstep(w, w + aa*1.15 + 0.004, d))*step(1.0 - uSeason, r)*(th/w);
  stripe *= 0.55 + 0.45*smNoise(vec2(along*0.21, cell));
  return vec3(clear, lens, stripe);
}
void main(){
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vW);
  float dist = length(cameraPosition - vW);
  float depthIn = vIce.z;
  float D = max(-vP.y, 0.0);
  vec3 cobD = uCobalt*(1.0 + 1.5*smoothstep(70.0, 165.0, D));      // COBALT DEEPENS WITH DEPTH: the blue of a point of ice, water or spray is two and a half times as strong by 165 m down as above 70 m, by its own depth (cobD)
  #ifdef IS_SHAFT
    // THE FALL'S REACHES (depth is read as colour: aqua, cobalt, ink). A wall point's reach is its own depth below the
    // surface, whoever looks at it: AQUA to about 60 m (pale turquoise ice, the wall of white water), COBALT to 130 m
    // (zCob: saturated blue, the flutes lit ribs over dark troughs, the dipping bands crossing them), INK from 200 m
    // (zInk: deep indigo on the same sculpted flutes, nothing bright but the ring and its cyan crescents). So a frame
    // shows the gradient ahead: aqua above the eye, cobalt round it, ink below.
    float zCob = smoothstep(48.0, 86.0, D), zInk = smoothstep(130.0, 200.0, D);
    float rib = smoothstep(0.2, 0.9, vIce.x);                    // 1 on a flute's arete, 0 in its trough
    // the side conduit's throat and its lip, worked out per fragment from the wall's own coordinates (vCd = x before the
    // flutes, metres of arc from the throat's middle): pk = how far into the scoop 0..1, cUp = metres above the mouth's edge,
    // cGd = how deep the scoop goes at this place along the lip 0..1 (pk reaches it 2.4 m below the edge)
    // (cSide: only on the throat's own side of the axis; across the shaft the arc wraps round inside one facet)
    float cSide = step(0.0, vP.x*${$e.toFixed(4)} + (vP.z - (${Se.toFixed(4)} - D*${ue.toFixed(5)}))*${Ge.toFixed(4)});
    float cdl = D - uCd.x, cOn = step(-30.0, cdl)*cSide, cLift = ${Ft("vCd.x","vCd.y")};
    float cGd = cOn*(1.0 - smoothstep(${Qe}.0, ${Je}.0, cdl))*exp(-vCd.y*vCd.y/(vCd.y > 0.0 ? ${nt}.0 : ${tt}.0));
    float pk = cGd*smoothstep(${Ee}.0, ${Ee}.0 + 2.4, cdl + cLift);
    float cUp = ${Ee}.0 - (cdl + cLift);
    float cArcK = cOn*(1.0 - smoothstep(vCd.y > 0.0 ? 12.0 : 7.0, vCd.y > 0.0 ? 18.0 : 12.0, abs(vCd.y)));
  #endif
  // ---- cotangent frame from the surface coordinates (derivatives taken once, outside every loop)
  #ifdef IS_SHAFT
    vec2 q = vSurf*vec2(0.6, 0.5);          // cups 1.7 m by 2 m: they have to read from the axis, 13 m away
  #else
    vec2 q = vSurf*vec2(1.75, 2.1);
  #endif
  vec3 dp1 = dFdx(vW), dp2 = dFdy(vW); vec2 du1 = dFdx(q), du2 = dFdy(q);
  vec3 dp2p = cross(dp2, N), dp1p = cross(N, dp1);
  vec3 T = dp2p*du1.x + dp1p*du2.x, B = dp2p*du1.y + dp1p*du2.y;
  float inv = inversesqrt(max(max(dot(T, T), dot(B, B)), 1e-12)); T *= inv; B *= inv;
  float fw = max(length(du1), length(du2));
  float ybAA = fwidth(vP.y) + 0.176*(fwidth(vP.x) + fwidth(vP.z));
  float lod = 1.0 - smoothstep(0.3, 1.1, fw);
  // ---- scallops: Voronoi cups with sharp crests
  q += 0.45*vec2(smNoise(vSurf*0.55 + 3.0), smNoise(vSurf*0.55 + 17.0))*vec2(1.6, 1.0) + 0.25*vec2(smNoise(vSurf*1.7), smNoise(vSurf*1.7 + 8.0));
  vec2 ic = floor(q), fc = fract(q); float f1 = 9.0, f2 = 9.0; vec2 gv = vec2(0.0); vec2 idc = vec2(0.0);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j)); vec2 c = o + 0.15 + 0.7*smHash2(ic + o) - fc; float d = dot(c, c);
    if (d < f1) { f2 = f1; f1 = d; gv = c; idc = ic + o; } else if (d < f2) { f2 = d; }
  }
  float crest = (1.0 - smoothstep(0.0, 0.11, sqrt(f2) - sqrt(f1)))*lod;
  #ifdef IS_APRON
    float cup = 0.0; crest = 0.0;
  #else
    float cup = lod*smoothstep(0.4, 2.0, depthIn + 0.6*smNoise(vSurf*0.6));
  #endif
  #ifdef IS_SHAFT
    // the cups soften with depth but never die: the walls round the ring are still scalloped ice
    float pdK = dot(vPL, vPL); pdK = pdK/(pdK + 6400.0);      // 0 at the ring, 0.5 at 80 m from it
    float inkK = 1.0 - 0.4*smoothstep(170.0, 250.0, D)*pdK;      // (and they come back to full depth in the ring's light)
    cup *= inkK; crest *= inkK;
    // (and calmer where the blocks tumble beside the lens, in the aqua and the first cobalt: they must read against the wall)
    float calm = 1.0 - 0.38*smoothstep(18.0, 40.0, D)*(1.0 - smoothstep(120.0, 170.0, D))*(1.0 - zCob);
    cup *= calm*(1.0 + 0.3*zCob);      // (in the cobalt reach the cups are at full depth and more: the ribs are scalloped ice)
  #endif
  #if defined(IS_RAFT) || defined(IS_BLOCK)
    // rafts, floes and blocks carry a snow crust on top; only their broken sides are cupped
    float topK = smoothstep(0.2, 0.65, N.y);
    float wetB = 1.0 - smoothstep(0.03, 0.3, vLoc.y);
    cup *= (1.0 - topK)*0.6; crest *= 1.0 - topK;
  #endif
  vec3 Np = normalize(N + (T*gv.x + B*gv.y)*2.1*cup);
  #if defined(IS_RAFT) || defined(IS_BLOCK)
    float cr0 = smFbm(vLoc.xz*3.1), cr1 = smFbm(vLoc.xz*3.1 + vec2(0.3, 0.0)), cr2 = smFbm(vLoc.xz*3.1 + vec2(0.0, 0.3));
    float pit = smoothstep(0.62, 0.78, smNoise(vLoc.xz*5.3 + 9.0));
    Np = normalize(Np + vec3(cr0 - cr1, 0.0, cr0 - cr2)*3.4*topK*lod);
  #endif
  float cupAO = mix(1.0, 0.9 + 0.2*smoothstep(0.0, 0.3, f1), cup);
  // ---- bands and albedo
  float along = vSurf.x;
  float yb = vP.y + dot(vP.xz, uDip) + 0.7*(smNoise(vec2(along*0.05, vP.y*0.07)) - 0.5);
  #ifdef IS_SHAFT
    yb = vP.y*0.8 + dot(vP.xz, uDip)*2.2 + 5.0*(smNoise(vec2(along*0.06, vP.y*0.018)) - 0.5) + 1.6*(smNoise(vec2(along*0.21, vP.y*0.06 + 5.0)) - 0.5);
    ybAA *= 1.6;
  #endif
  #ifdef IS_SHAFT
    vec3 bands = smBands(yb*0.42, along, ybAA*0.42);      // broad bands, readable from the axis and too slow to strobe
  #else
    vec3 bands = smBands(yb, along, ybAA);
  #endif
  float iceMix = smoothstep(0.5, 2.4, depthIn + 0.8*smNoise(vSurf*0.35));
  float bub = smNoise(vSurf*vec2(5.0, 9.0));
  vec3 snow = uSnow*0.78;
  vec3 alb = mix(snow, mix(uSnow, uTurq, 0.16)*(0.66 + 0.08*bub), iceMix);
  #ifdef IS_SHAFT
    bands *= vec3(0.6, 0.8, 0.45)*(1.0 + 0.75*zCob*(1.0 - zInk));      // (the dipping bands cross the cobalt ribs plainly)
  #endif
  alb = mix(alb, uTurq*0.62 + 0.05, bands.x*0.62*iceMix);
  alb = mix(alb, cobD*0.85 + vec3(0.0, 0.03, 0.08), bands.y*0.8*iceMix);
  alb = mix(alb, uMauve, uLate*0.35*smoothstep(0.45, 0.75, smNoise(vSurf*0.18 + 7.0))*(1.0 - bands.x));
  alb = mix(alb, uCryo*0.6, bands.z*0.8*iceMix);
  #ifdef IS_SHAFT
    // white bubbly bands between the clear blue ones, and healed fractures running aslant through them
    float bubB = smoothstep(0.5, 0.68, smNoise(vec2(yb*0.3 + 31.0, uBandSeed)))*(0.5 + 0.5*smNoise(vSurf*vec2(1.9, 2.7)))*smoothstep(14.0, 30.0, D);
    alb = mix(alb, uSnow*0.86, bubB*0.5);
    vec2 cq = vec2(along*0.085 + vP.y*0.047, vP.y*0.058 - along*0.031);
    float cn = smNoise(cq) + 0.35*smNoise(cq*2.3 + 7.0);
    float cwid = max(0.011, fwidth(cn)*1.3);
    float crack = (1.0 - smoothstep(cwid*0.5, cwid, abs(cn - 0.74)))*(0.011/cwid)*smoothstep(18.0, 34.0, D);
    alb = mix(alb, uSnow*0.95, crack*0.75);
  #endif
  // ---- light
  float ndlG = dot(N, vSunW);
  float ndl = max(dot(Np, vSunW), 0.0);
  float lit = 1.0, day = 1.0; vec3 amb = uSkyCol;
  #ifdef IS_WALL
    lit = 1.0 - smoothstep(vIce.y - 0.9, vIce.y + 0.9, depthIn + 1.4*(smNoise(vec2(along*0.22, 1.0)) - 0.5) + 0.5*(sqrt(f1) - 0.3)*cup);
    amb = uSkyCol*(1.25 + 0.45*N.y) + uElectric*0.3*smoothstep(1.0, 9.0, depthIn)*(0.6 - 0.4*N.y);
    amb *= mix(1.0, 0.7, smoothstep(0.0, 10.0, depthIn));
    // TWILIGHT (uUpGlow > 0): the faintly luminous water lights the canyon from below (teal on undersides, in the notch
    // and up the first metres of the walls) and the aurora lays a thin green rim on what faces the sky
    amb += (uTurq*0.75 + uElectric*0.5)*uUpGlow*(0.6 - 0.4*N.y)*exp(-max(vSurf.y, 0.0)/5.5) + vec3(0.1, 0.5, 0.3)*uUpGlow*0.55*smoothstep(0.3, 0.85, N.y);
    // a decided key: where the sun reaches, the wall is cream snow-ice; where it does not, it sinks into blue
    float keyK = smoothstep(0.35, 0.8, dot(uSunCol, vec3(0.3333)));
    alb = mix(alb, snow*mix(vec3(1.0), vec3(1.05, 1.0, 0.92), uWarm), lit*0.6*keyK);
    amb *= mix(1.0, mix(0.74, 0.4, lit), keyK);
    // LATE SEASON: bare old ice (laid on after the key's cream, so it shows on the sun-lit wall too). Two more sets of
    // cryoconite stripes between the first, a mauve-grey algal stain down the cornice and the top four metres of the
    // face, the whole wall a shade darker, and two old melt notches the lower water has left a metre and two metres
    // above the river (dark lines with a pale lip under each).
    float lateAA = fwidth(vSurf.y);
    if (uLate > 0.0) {
      vec3 b2 = smBands(yb + 0.47, along + 40.0, ybAA), b3 = smBands(yb*1.31 + 0.2, along + 90.0, ybAA*1.31);
      alb = mix(alb, uCryo*0.55, uLate*max(b2.z, b3.z*0.8)*0.8*smoothstep(0.3, 1.5, depthIn));
      float stainK = (1.0 - smoothstep(0.6, 4.2, depthIn + 1.6*(smNoise(vSurf*vec2(0.3, 0.9)) - 0.5)))*(0.45 + 0.5*smNoise(vSurf*0.45 + 11.0));
      alb = mix(alb, uMauve*0.62, uLate*stainK*0.85);
      alb *= 1.0 - 0.16*uLate;
      float hN = vSurf.y + 0.12*(smNoise(vec2(along*0.6, 3.0)) - 0.5), nw = max(0.1, lateAA*1.2);
      float n1 = (1.0 - smoothstep(nw*0.5, nw, abs(hN - 1.15)))*(0.1/nw), n2 = (1.0 - smoothstep(nw*0.5, nw, abs(hN - 2.05)))*(0.1/nw)*0.75;
      float lipL = (1.0 - smoothstep(0.0, 0.24, abs(hN - 0.92)))*0.5 + (1.0 - smoothstep(0.0, 0.22, abs(hN - 1.84)))*0.38;
      alb = mix(alb, uSnow*0.85, uLate*lipL*0.45);
      alb = mix(alb, cobD*0.3, uLate*max(n1, n2)*0.85);
    }
  #endif
  #ifdef IS_SHAFT
    {
      float slotT = (vP.y + ${X}.0)/${X}.0;
      float slotHalf = mix(7.15, 5.05, clamp((slotT - 0.18)/0.8, 0.0, 1.0)) + 0.8*smoothstep(0.0, 0.05, slotT)*(1.0 - smoothstep(0.1, 0.18, slotT)) - 0.3;
      if (vP.y > -${X}.0 + 0.1 && vP.z > -2.5 && abs(vP.x) < slotHalf) discard;
      float ts = D/max(uSun.y, 0.05);
      vec2 e = vec2(vP.x + uSun.x*ts, vP.z + uSun.z*ts - uMouth.x)/uMouth.zw;
      lit = (1.0 - smoothstep(0.72, 1.02, dot(e, e) + 0.12*smNoise(vSurf*0.2)))*step(0.0, D);
      // THE FAR WALL'S CRESCENT, as the river sees it down the last reach: the top of the wall that faces the canyon is lit
      // right across the slot (deepest on the right, where the sun reaches furthest), not only its right-hand half
      lit = max(lit, smoothstep(0.35, 0.8, N.z)*(1.0 - smoothstep(9.5, 16.0, D + 0.3*max(-vP.x - 2.0, 0.0) + 2.0*smNoise(vSurf*0.25)))*step(0.0, D)*step(vP.z, uMouth.x));
      alb = mix(alb, snow, lit*0.45);
      // DAYLIGHT FROM THE MOUTH. The mouth is a window of sky far overhead: its light thins with the square of the depth
      // but never goes out (the ice passes blue on), and it comes down the shaft tipped toward the sun's side, so shelf
      // tops, the upper lip of every cup and the wall across from the sun are bright and undercuts are deep.
      day = 1.0/(1.0 + D*D/3200.0);
      vec3 tint = mix(uSkyCol, uTurq*0.9, smoothstep(6.0, 45.0, D));
      tint = mix(tint, mix(uElectric, cobD, 0.6)*1.3, max(0.5*smoothstep(45.0, 125.0, D), zCob));
      // a tenth of the aqua daylight holds to 150 m and dies by 215 m: the cobalt keeps a second hue
      day = max(day, 0.1*(1.0 - smoothstep(150.0, 215.0, D)));
      tint = mix(tint, uTurq*0.85 + uElectric*0.25, 0.35*smoothstep(70.0, 110.0, D)*(1.0 - smoothstep(150.0, 215.0, D))*(1.0 - 0.8*zCob));
      tint = mix(tint, cobD*0.8 + vec3(0.02, 0.0, 0.07), zInk);          // toward ink: indigo, the last of the daylight
      vec2 sh = normalize(uSun.xz + vec2(1e-4, 0.0));
      vec3 Ls = normalize(vec3(sh.x*0.42, ${j.toFixed(4)}, ${se.toFixed(4)} + sh.y*0.42));
      float up = dot(Np, Ls), upG = dot(N, Ls);
      float form = 0.45 + 0.45*max(upG, 0.0) + 0.9*max(up, 0.0) + 0.55*max(Np.y, 0.0) + 0.1*up;
      // the footwall beside and under the falling water is wet, water-polished ice with films running on it: glassy
      // turquoise, darker than the white water, never rime-white (fz = where the footwall lies at this depth)
      float arcC = ${K}.0 - max(D - ${X}.0, 0.0);
      float fz = D < ${de.toFixed(3)} ? -sqrt(max(${K*K}.0 - arcC*arcC, 0.0)) : ${Ce.toFixed(3)} - (D - ${de.toFixed(3)})*${ue.toFixed(5)};
      float onFoot = (1.0 - smoothstep(0.5, 2.4, fz - vP.z))*smoothstep(${X}.0 - 0.4, ${X}.0 + 1.2, D)*(1.0 - smoothstep(uCd.x, uCd.x + ${We}.0, D));
      float film = smoothstep(0.5, 0.78, smNoise(vec2(vP.x*1.4, D*0.07 - uTime*0.8))*0.6 + smNoise(vec2(vP.x*4.1 + 9.0, D*0.2 - uTime*1.9))*0.4);
      alb = mix(alb, uTurq*0.4 + cobD*0.2 + 0.03 + uSnow*0.3*film, onFoot*0.82);
      form = mix(form, 0.6 + 0.5*max(up, 0.0), onFoot);
      float shelfTop = vIce.y*smoothstep(20.0, 40.0, D);          // the top of a ledge: rime and spray frost, facing the sky
      alb = mix(alb, uSnow*0.88, shelfTop*0.55);
      form *= 1.0 + 0.7*shelfTop;
      float arete = vIce.x;
      // (the first metres under the rim keep the sun-side shading they always had: the mouth seen from the canyon)
      float sideT = dot(N, normalize(vec3(uSun.x, 0.3, uSun.z)))*0.5 + 0.5;
      vec3 ambTop = tint*(0.3 + 0.9*exp(-D/60.0))*(0.35 + 1.05*sideT*sideT)*mix(0.62, 1.3, arete*arete);
      amb = mix(ambTop, tint*(0.19 + 1.1*day)*form*mix(0.84, 1.16, arete), smoothstep(8.0, 30.0, D));
      alb = mix(alb, uSnow*0.8, arete*arete*0.3);
      amb *= mix(1.0, 0.45, lit*uWarm);
      // COBALT: every flute is a lit rib over a dark trough (the geometry is half as deep again here), a shade deeper overall
      form = mix(form, (0.22 + 0.4*max(upG, 0.0) + 1.5*max(up, 0.0) + 0.85*max(Np.y, 0.0))*(1.0 + 0.7*shelfTop), zCob*(1.0 - 0.5*zInk));      // (and every cup has a lit upper lip over a deep hollow)
      amb = mix(amb, tint*(0.19 + 1.1*day)*form*mix(0.84, 1.16, arete), zCob*(1.0 - 0.5*zInk)*smoothstep(8.0, 30.0, D));
      amb *= mix(1.0, mix(0.56, 1.36, rib)*0.94, zCob*(1.0 - 0.4*zInk));
      // INK: the daylight is a trace of indigo on the same forms (never out: the cups and ribs still read in it)
      // (the upper lip of every cup and every rib keeps twice the light of the hollows: form, not a flat dimming)
      amb *= mix(1.0, mix(0.3, 0.62, clamp(0.55*rib + 0.9*max(up, 0.0)*cup + 0.5*crest*cup, 0.0, 1.0)), zInk);
      // and one shaft of it stands in the well: a wedge of direct light that slides down the wall across from the sun
      // and narrows to nothing far below
      vec3 Lb = normalize(vec3(sh.x*0.15, ${j.toFixed(4)}, ${se.toFixed(4)} + sh.y*0.15));
      float tb = D/max(Lb.y, 0.3);
      vec2 eb = vec2(vP.x + Lb.x*tb, vP.z + Lb.z*tb - uMouth.x)/(uMouth.zw*0.62);
      float beam = (1.0 - smoothstep(0.5, 1.0 + D*0.003, dot(eb, eb) + 0.3*(smNoise(vSurf*0.11) - 0.5)))*smoothstep(10.0, 26.0, D)*smoothstep(-0.05, 0.14, dot(N, Lb));
      // (the mouth's own daylight, sky-blue then turquoise: the SUN's gold lies only where the sun's ray reaches through
      // the mouth, "lit" above, the crescent on the far wall's top, as deep as the sun's height and the mouth's width give)
      vec3 beamCol = mix(uSkyCol*1.1 + uSnow*0.45, uTurq*1.25, smoothstep(20.0, 110.0, D));
      amb += beamCol*beam*1.5*exp(-D/95.0)*(0.3 + 1.7*max(dot(Np, Lb), 0.0))*(1.0 - 0.75*zCob);
      // THE SKYLIGHT. The mouth stands over the hanging wall (the wall across from the falling water, the top of the
      // frame for an eye looking down the axis), so that wall keeps a long tongue of aqua daylight: broad all the way down
      // and dying out near 250 m, brightest on the aretes, the shelf tops and the upper lips of the cups, torn at its edges.
      // It is what the waterfall ropes run down, and it is the second hue of the cobalt reach.
      float skW = mix(17.0, 12.0, smoothstep(60.0, 220.0, D));
      float skX = abs(vP.x + 2.5*(smNoise(vec2(D*0.03, 7.0)) - 0.5)) + 3.0*(smNoise(vSurf*vec2(0.3, 0.07)) - 0.5);
      float skyl = (1.0 - smoothstep(skW*0.55, skW, skX))*smoothstep(0.1, 0.5, N.z)*smoothstep(38.0, 70.0, D)*(1.0 - smoothstep(200.0, 250.0, D));
      vec3 skCol = mix(uTurq*1.05 + uSnow*0.3, uTurq*1.25 + uSnow*0.14, smoothstep(60.0, 170.0, D));
      skyl *= mix(1.0, 0.45, smoothstep(105.0, 185.0, D))*(1.0 - 0.62*zCob)*(1.0 - 0.6*zInk);          // (it thins by half below 185 m, and in the cobalt reach it is a trace)
      amb += skCol*skyl*(0.5 + 0.3*exp(-D/120.0))*(0.3 + 0.8*max(up, 0.0) + 0.5*arete*arete + 0.6*shelfTop);
      iceMix = max(iceMix, smoothstep(3.0, 9.0, D));
    }
  #endif
  #ifdef IS_ICICLE
    lit = max(vIce.y, 0.0); cup = 0.0; crest = 0.0; Np = N;
    amb = (uSkyCol*0.7 + uElectric*0.12)*mix(1.0, 0.86, step(vIce.y, -0.5));      // aInst.x = -1: under a bridge, in its shade
  #endif
  #ifdef IS_BLOCK
    lit = (1.0 - smoothstep(-2.0, 6.0, vP.z))*(1.0 - smoothstep(14.0, 30.0, D));
    day = exp(-max(D - 12.0, 0.0)/60.0);
    amb = mix(uSkyCol*0.8 + uElectric*0.25, cobD*1.2, smoothstep(40.0, 120.0, D))*(0.3 + 0.9*day)*(1.0 - smoothstep(120.0, 240.0, D));
    amb += (uTurq*0.5 + uSnow*0.34)*(0.55 + 0.45*Np.y)*smoothstep(20.0, 45.0, D)*(1.0 - smoothstep(150.0, 215.0, D));
    alb = mix(alb, snow, 0.55 + 0.45*smoothstep(-0.1, 0.25, N.y));
    amb *= 0.72 + 0.4*Np.y;
    alb *= mix(1.0, (0.6 + 0.75*cr0)*(1.0 - 0.45*pit)*(0.86 + 0.28*smNoise(vLoc.xz*11.0 + 3.0)), topK);
    alb = mix(alb, uTurq*0.5 + cobD*0.12, wetB*(1.0 - topK)*0.75*(1.0 - smoothstep(13.0, 20.0, D)));
  #endif
  #ifdef IS_RAFT
    lit = smoothstep(uLitY - 1.0, uLitY, vW.y);
    day = exp(-max(D - 12.0, 0.0)/60.0);
    amb = mix(uSkyCol*(0.95 + 0.3*N.y) + uElectric*0.25*(1.0 - lit), cobD*1.2, smoothstep(40.0, 120.0, D))*(0.3 + 0.9*day)*(1.0 - smoothstep(120.0, 240.0, D));
    // in the fall a block keeps a pale aqua of its own (snow crust in the mouth's light), so it reads against the cobalt wall
    amb += (uTurq*0.5 + uSnow*0.34)*(0.55 + 0.45*Np.y)*smoothstep(20.0, 45.0, D)*(1.0 - smoothstep(150.0, 215.0, D));
    alb = mix(alb, snow, 0.5 + 0.5*smoothstep(-0.1, 0.25, N.y));
    alb *= mix(1.0, (0.6 + 0.75*cr0)*(1.0 - 0.45*pit), topK*(1.0 - 0.75*smoothstep(15.0, 40.0, D)));      // wind crust and melt pits on top (washed off in the fall)
    alb = mix(alb, uTurq*0.5 + cobD*0.12, wetB*(1.0 - topK)*0.75);              // the wet, darker band at the waterline
  #endif
  #ifdef IS_APRON
    {
      vec2 em = vec2(vP.x, vP.z - uMouth.x)/(uMouth.zw + 4.4);
      float e = dot(em, em);
      if (e < 1.0 && vP.z < 5.6) discard;
      if (abs(vP.x) < 5.5 && vP.z > 0.0 && vP.z < uMouth.y) discard;
      // sastrugi, crust, rills, cryoconite country
      vec2 ws = vP.xz*vec2(0.11, 0.5) + vec2(0.0, 0.3*smNoise(vP.xz*0.05));
      float s0 = smFbm(ws), s1 = smFbm(ws + vec2(0.035, 0.0)), s2 = smFbm(ws + vec2(0.0, 0.25));
      float far = 1.0 - smoothstep(60.0, 320.0, dist);
      Np = normalize(N + vec3((s0 - s1)*3.2, 0.0, (s0 - s2)*1.2)*far*(1.0 - smoothstep(0.15, 0.7, fwidth(vP.z)*0.55)));
      ndl = max(dot(Np, vSunW), 0.0);
      float country = smFbm(vP.xz*0.011 + 3.0);
      float edge = max(1.0 - smoothstep(1.0, 1.7, e), (1.0 - smoothstep(6.0, 16.0, abs(vP.x)))*step(0.0, vP.z)*step(vP.z, uMouth.y));
      alb = snow*(0.9 + 0.1*s0);
      alb = mix(alb, mix(uSnow, uCryo, 0.38)*0.74, smoothstep(0.5, 0.72, country)*(0.3 + 0.4*uSeason));
      alb = mix(alb, uMauve, uLate*0.3*smoothstep(0.4, 0.7, smFbm(vP.xz*0.03 + 9.0)));
      alb = mix(alb, mix(uSnow, uTurq, 0.45)*0.7, edge*0.55*smoothstep(0.3, 0.7, smNoise(vP.xz*0.25) + edge*0.4));
      float rw = fwidth(vP.x) + fwidth(vP.z);
      // blue rills: tributaries running into the canyon like the barbs of a feather
      float tr = (vP.z + abs(vP.x)*0.55 + 9.0*smNoise(vP.xz*0.03) + 2.5*smNoise(vP.xz*0.13))/31.0;
      float tcell = floor(tr), tf = abs(fract(tr) - 0.5)*31.0;
      float rh = smHash(vec2(tcell, sign(vP.x)*3.0 + 5.0));
      float rw0 = 0.22 + 0.4*rh, rwid = max(rw0, rw*0.9);
      float rill = (1.0 - smoothstep(rwid, rwid + rw*0.9 + 0.05, tf))*(rw0/rwid)*step(0.3, rh)
        *smoothstep(5.0, 9.0, abs(vP.x))*(1.0 - smoothstep(40.0 + 120.0*rh, 60.0 + 150.0*rh, abs(vP.x)))*step(4.0, vP.z);
      alb = mix(alb, uElectric*0.8, rill*0.8);
      vec2 pc = vP.xz*1.6; vec2 pi = floor(pc); vec2 ph = smHash2(pi);
      float pd = length(fract(pc) - 0.2 - 0.6*ph), pr = 0.06 + 0.16*smHash(pi + 5.0);
      float paa = rw*0.9;
      float pock = (1.0 - smoothstep(pr, pr + 0.03 + paa, pd))*(pr/(pr + paa))*step(0.8 - 0.2*uSeason, ph.x)
        *(1.0 - smoothstep(0.06, 0.3, rw))*smoothstep(0.45, 0.7, smNoise(vP.xz*0.07 + 4.0));
      alb = mix(alb, uCryo*0.5, pock*0.8);
      amb = uSkyCol*(0.75 + 0.25*Np.y);
      depthIn = 0.0; iceMix = 0.0; bands = vec3(0.0);
    }
  #endif
  #ifdef IS_WALL
    float wrap = max(ndl*0.55 + 0.45*max(ndlG, 0.0), 0.0);   // the lit wall reads as one cream plane, not as half-blue cups
  #else
    float wrap = max(ndl*0.85 + 0.15*max(ndlG, 0.0), 0.0);
  #endif
  vec3 key = uSunCol;
  #ifdef IS_WALL
    key *= mix(vec3(1.0), uGold*1.35, 0.42*uWarm);
  #endif
  #ifdef IS_SHAFT
    key *= mix(vec3(1.0), uGold*1.5, 0.8*uWarm)*1.15;          // the gold crescent on the far wall
  #endif
  vec3 col = alb*(key*wrap*lit*0.95 + amb)*cupAO;
  // ---- light through the ice: turquoise near the surface, electric cobalt low down, strongest in the notch
  vec3 glowCol = mix(uTurq*0.8, mix(cobD, uElectric, 0.55)*1.25, smoothstep(0.8, 7.0, depthIn));
  float glow = vIce.x*vIce.x*(0.22 + 0.95*bands.x + 0.8*bands.y)*mix(1.0, 0.3, lit*smoothstep(0.0, 0.4, ndlG));
  #ifdef IS_SHAFT
    glowCol = mix(uTurq, mix(uElectric, cobD, 0.6)*1.4, smoothstep(20.0, 110.0, D));
    glow = (0.2 + 0.34*bands.x + 0.34*bands.y)*(0.2 + 0.9*exp(-D/55.0))*(1.0 - 0.6*lit)*iceMix*(1.0 - 0.6*smoothstep(130.0, 240.0, D))*mix(1.0, 0.45 + 0.85*rib, zCob)*(1.0 - 0.7*zInk);
  #endif
  #if defined(IS_RAFT) || defined(IS_BLOCK)
    glow *= day;
  #endif
  col += glowCol*glow*0.85;
  // ---- crests: gold on the lit side, pale blue in shadow
  float rim = (1.0 - smoothstep(0.0, 0.3, sqrt(f2) - sqrt(f1)))*lod;                // a wider, softer band along each crest
  col += uGold*min(uSunCol*1.1, vec3(1.3))*(crest*0.5 + rim*0.5)*cup*lit*smoothstep(-0.1, 0.5, ndlG)*mix(0.25, 0.85, uWarm);   // gold only as far as the key is
  #if defined(IS_RAFT) || defined(IS_BLOCK)
    col += uTurq*0.22*wetB*(1.0 - topK)*day;
  #endif
  col += uSkyCol*crest*cup*(1.0 - lit)*0.05*day;
  // ---- running melt threads and creeping films
  float thr = smoothstep(0.64, 0.8, smNoise(vec2(along*1.9, 2.0)))*smoothstep(1.0, 3.0, depthIn)*(1.0 - smoothstep(0.2, 0.7, fw));
  float run = smNoise(vec2(along*5.7, vSurf.y*0.9 + uTime*2.4));
  float glint = thr*smoothstep(0.5, 0.85, run);
  col *= 1.0 - 0.14*thr;
  // ---- wet speculars, sky fresnel, sparkle
  vec3 Hh = normalize(V + vSunW);
  float spec = pow(max(dot(Np, Hh), 0.0), 70.0)*lit;
  float fres = pow(clamp(1.0 - dot(Np, V), 0.0, 1.0), 4.0);
  col += uSunCol*spec*1.6*(0.35 + 0.65*iceMix) + uSkyCol*fres*0.3*day;
  col += (uSkyCol*0.3*day + uSunCol*lit*0.9)*glint;
  #ifdef IS_SHAFT
    // wet films keep glinting as they creep down the flutes, cyan from the ring, long after the daylight has gone
    col += (uTurq*0.04 + uPortalCol*0.03)*glint*smoothstep(45.0, 95.0, D)*(1.0 - 0.7*smoothstep(165.0, 200.0, D))*(0.35 + 0.65*vIce.x);
  #endif
  float hs = smHash(idc + 3.0), hs2 = smHash(idc + 11.0);
  float tw = pow(max(sin(uTime*(1.5 + 3.5*hs) + hs*40.0), 0.0), 18.0)*step(0.72, hs2)*lod*cup*exp(-f1*90.0);
  col += uSunCol*tw*(lit*smoothstep(-0.2, 0.4, ndlG)*4.0 + 0.5*day);
  #ifdef IS_APRON
    float gs = smHash(floor(vP.xz*9.0)), gt = pow(max(sin(uTime*(2.0 + 3.0*gs) + gs*50.0), 0.0), 20.0);
    col += uSunCol*gt*step(0.9, smHash(floor(vP.xz*9.0) + 2.0))*(1.0 - smoothstep(0.05, 0.3, fwidth(vP.x)*9.0))*2.2;
  #endif
  #ifdef IS_ICICLE
    // glass, not a blade: a darker core, a bright rim where the surface turns away, and one long highlight down its length
    // (the light behind comes through the body, a dark band of bent light runs just inside each edge, rings of growth
    // cross it every few centimetres, and the root is frosted white where it joins the snow)
    float icC = abs(dot(N, V));
    float icR = pow(clamp(1.0 - icC, 0.0, 1.0), 1.6);
    float icT = clamp((vIce.z - 3.0)/1.4, 0.0, 1.0);
    // (under a bridge it hangs in the bridge's shade: a pale blue-white spike against the dark roof, a little brighter
    // seen from below with the sky behind it; and it has no frosted root: it comes out of the ice as ice)
    float icBr = step(vIce.y, -0.5);
    float icSh = mix(1.0, mix(0.82, 1.0, smoothstep(0.14, 0.4, -V.y)), icBr);
    float icBand = smoothstep(0.22, 0.42, icC)*(1.0 - smoothstep(0.5, 0.8, icC));
    float icRib = 0.84 + 0.16*sin(vSurf.y*24.0 + 2.0*sin(vSurf.x*10.0));
    vec3 icH = normalize(V + normalize(vec3(vSunW.x, 0.25, vSunW.z) + vec3(1e-4, 0.0, 0.0)));
    float icL = min(1.0, dot(uSkyCol, vec3(1.1)));      // (its own whites follow the sky's brightness: quiet at twilight)
    col = mix(col, (uSkyCol*0.5 + (uTurq*0.3 + uSnow*0.08)*icL)*day*icSh, 0.5)*icRib*(1.0 - 0.38*icBand);
    col = mix(col, (uSnow*0.5*icL + uSkyCol*0.3)*day*icSh, 0.6*(1.0 - smoothstep(0.0, 0.22, icT))*(1.0 - icBr));
    col += (uSkyCol*0.4 + uSnow*0.14*icL)*icR*icR*day*icSh +(uSkyCol*0.5 + uSunCol*0.7*lit)*pow(max(dot(vec3(N.x, 0.0, N.z), icH), 0.0), 20.0);
  #endif
  // ---- the portal's light on the flutes, breathing
  float pd2 = dot(vPL, vPL);
  vec3 pL = vPL*inversesqrt(max(pd2, 1e-4));
  #ifdef IS_SHAFT
    // THE RING'S LIGHT. It fills the bottom of the well as a glow more than a lamp (the mist carries it), so every cup,
    // shelf and rib for 60 m above the ring stands in rich blue, and only the shaft beyond the ring is ink.
    // It comes from below, so the upper lip of every cup catches it as a crescent and the cup under it stays deep cobalt.
    // The 2 m cups melt into the distance a little way down the well, so the ring also lights a second, larger generation
    // of scallops (5 by 6 m, this term only): cups read all the way down to the ring, and the flutes' rays stay fainter.
    vec2 q2 = vSurf*vec2(0.2, 0.17) + 0.35*vec2(smNoise(vSurf*0.13 + 5.0), smNoise(vSurf*0.13 + 23.0));
    vec2 ic2 = floor(q2), fc2 = fract(q2); float g1 = 9.0, g2 = 9.0; vec2 gv2 = vec2(0.0);
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j)); vec2 c = o + 0.15 + 0.7*smHash2(ic2 + o + 37.0) - fc2; float d = dot(c, c);
      if (d < g1) { g2 = g1; g1 = d; gv2 = c; } else if (d < g2) { g2 = d; }
    }
    float lod2 = 1.0 - smoothstep(0.22, 0.8, fw*0.34);
    float rimB = (1.0 - smoothstep(0.0, 0.13, sqrt(g2) - sqrt(g1)))*lod2;
    vec3 Nr = normalize(Np + (T*gv2.x + B*gv2.y)*1.25*lod2);
    float pf = max(dot(Nr, pL), 0.0);
    float pwrap = 0.27 + 1.5*pf*pf;
    float breathe = 0.88 + 0.12*sin(uTime*0.9), pFall = 1.0/(1.0 + pd2/900.0);
    vec3 pTint = mix(mix(uElectric*1.15, uPortalCol, 0.16), uPortalCol*0.9, 0.45*smoothstep(0.45, 0.95, pf));
    // (TOWARD INK the fill draws in to the last 40 m and is three fifths as strong, and it models the flutes: ribs lit,
    // troughs deep; what the outer frame keeps is the crescents below and the trace of indigo daylight)
    float pFill = 1.0/(1.0 + pd2/mix(900.0, 460.0, zInk));
    col += pTint*(alb*0.9 + 0.08)*uPortalI*0.34*mix(1.0, 0.62, zInk)*pwrap*mix(mix(0.94, 1.04, vIce.x), mix(0.55, 1.5, rib), zInk)*pFill*breathe;
    // THE CRESCENTS REACH FURTHER UP THE WELL THAN THE FILL, and how far is a matter of the wall point's own distance
    // from the ring, whoever looks: within 30 m of it every lip is the ring's own cyan at full strength; further up the
    // strength falls off slowly (still a quarter at 80 m, a tenth at 150 m) and the tone deepens to sapphire-cyan (farW),
    // so the ring stays the brightest thing in the well and the deep reach is never as pale as the mouth.
    float farW = smoothstep(30.0, 85.0, sqrt(pd2));
    float pFallR = max(pFall, 0.6/(1.0 + pd2/5200.0));
    float pfR = smoothstep(0.05, 0.5, max(dot(Nr, pL), 0.0) + 0.25*max(dot(N, pL), 0.0)*farW);
    vec3 ringCol = mix(uPortalCol, mix(uElectric, uPortalCol, 0.3)*1.05, 0.75*farW);
    // (toward ink the cups keep their crescents: thin cyan upper lips are what the ink is drawn with)
    col += ringCol*(rimB*mix(0.6, 0.75, farW) + crest*cup*0.42)*(0.2 + 0.8*pfR)*uPortalI*0.41*pFallR*(1.0 - 0.56*smoothstep(0.4, 0.9, pFall))*breathe*mix(1.0, min(0.74 + 0.7*smoothstep(0.14, 0.5, pFall), 1.0), zInk);
    // the cups melt into the distance down the well (they must, or they would alias), so far from the ring it is the
    // geometry that carries its light: the lip of every ledge is a broken cyan arc and every arete a cyan thread
    col += ringCol*(vIce.y*0.6 + vIce.x*vIce.x*0.16)*uPortalI*0.4*pFallR*(1.0 - 0.7*smoothstep(0.35, 0.9, pFall))*breathe*farW;
    // from far above, a thin cyan rim on every arete: a trace only, laid over the lit ice (and fainter than the cups' rims near the ring)
    float farP = smoothstep(60.0, 110.0, D)*(1.0 - 0.5/(1.0 + pd2/3600.0));
    col += uPortalCol*vIce.x*vIce.x*(0.35 + 0.65*max(dot(N, pL), 0.0))*0.1*farP/(1.0 + pd2/9000.0)*(0.86 + 0.14*sin(uTime*0.9));
  #else
    float pnl = 0.3 + 0.7*max(dot(Np, pL), 0.0);
    col += uPortalCol*(alb*0.6 + 0.4*crest + 0.1)*uPortalI*pnl/(1.0 + pd2/420.0)*(0.86 + 0.14*sin(uTime*0.9));
    #if defined(IS_RAFT) || defined(IS_BLOCK)
      // blocks tumbling in the fall: under-faces and edges rim-lit cyan by the ring from far above it
      float farB = smoothstep(40.0, 90.0, D)*(1.0 - smoothstep(175.0, 205.0, D))/(1.0 + pd2/9000.0);
      col += uPortalCol*((alb*0.9 + 0.08)*(0.14 + 0.86*pow(max(dot(Np, pL), 0.0), 1.5))*1.5 + 0.35*pow(clamp(1.0 - dot(Np, V), 0.0, 1.0), 3.0))*farB;
    #endif
  #endif
  #ifdef IS_SHAFT
    // THE CONDUIT: its throat is ink, a hole darker than anything round it, by how far into the scoop the wall point
    // lies (pk), whoever looks: three quarters of the way to black at its mouth, nine tenths at its deepest, every cup's
    // upper lip a step above black on the way in. Its edge is wet and catches what light there is, cup by cup (a
    // scalloped edge, not a ruled one), and so do the throat's sides.
    // THE WALL BEHIND THE EDGE IS INK AT ONCE. From the edge the wall turns in under the lip: 12 m of it in 2.4 m of
    // depth, a few long facets on which a cup's lit lip is drawn metres wide. A hand below the edge (cIn) it already
    // has the darkness of the scoop it leads into (cGd), nine tenths while it is still turning in (cTurn), and nothing
    // on it is lit: seen from beside the mouth it is the black of the throat, never a pale facet.
    float cTopL = clamp(-cUp/2.4, 0.0, 1.0), cIn = smoothstep(0.0, 0.06, cTopL), cTurn = cIn*(1.0 - smoothstep(0.6, 1.0, cTopL));
    float thrK = max(smoothstep(0.03, 0.5, pk), cIn*smoothstep(0.03, 0.5, cGd)), thrD = max(smoothstep(0.3, 0.85, pk), cTurn*smoothstep(0.03, 0.3, cGd));
    col = mix(col, uInk*0.5, (0.72 + 0.2*thrD)*thrK) + (cobD*0.03 + uElectric*0.016)*thrK*mix(2.0, 0.6, thrD)*(0.3 + 1.1*max(Np.y, 0.0) + 1.2*crest*cup + 0.6*rimB + 0.5*rib)*(1.0 - 0.8*cTurn);
    float sideE = smoothstep(0.02, 0.1, cGd)*(1.0 - smoothstep(0.1, 0.36, cGd))*cIn*(1.0 - cTurn);
    // (the half metre of wet wall above the edge: lit only on its cups' lips and its ribs, never a pale band)
    float cuq = cUp/(cUp > 0.0 ? 0.6 : 0.1);
    float lipIce = max(exp(-cuq*cuq)*cArcK, 0.2*sideE)*(1.0 - 0.7*smoothstep(0.3, 0.7, pk));
    col += (uTurq*0.46 + uPortalCol*0.2 + uSnow*0.1)*lipIce*(0.03 + 0.5*crest + 0.3*rimB + 0.08*rib)*0.6;
    // (and the very edge is a thin wet line that follows the scallops, a hand wide and never thinner than two pixels:
    // brightest where a cup's lip or a rib meets it)
    float eW = max(0.14, 1.5*fwidth(cUp));
    float edgeL = (1.0 - smoothstep(0.45*eW, eW, abs(cUp - 0.14)))*cArcK;
    col += (uTurq*0.34 + uPortalCol*0.2 + uSnow*0.14)*edgeL*(0.4 + 0.45*crest + 0.3*rib)*0.9;
  #endif
  gl_FragColor = vec4(smFog(col, vP.y, dist), 1.0);
}`,Lt=`
vec3 smFlowPos(float s, float lane, out vec3 tang){
  // s: metres along the flow line from the upstream end. uFlow = (reach, speed, arcLen, fallLen)
  float sz = uFlow.x - s;                               // canyon: z = reach - s
  if (s < uFlow.x) { tang = vec3(0.0, -0.02, -1.0); return vec3(lane, -${X}.0 + 0.02*sz, sz); }
  float a = s - uFlow.x;
  if (a < uFlow.z) { float ph = a/${K}.0; tang = vec3(0.0, -sin(ph), -cos(ph)); return vec3(lane*(1.0 + 0.25*a/uFlow.z), -${X}.0 - ${K}.0*(1.0 - cos(ph)), -${K}.0*sin(ph)); }
  float b = a - uFlow.z;
  tang = vec3(0.0, -${j.toFixed(5)}, -${se.toFixed(5)});
  return vec3(lane*(1.25 + 0.3*b/uFlow.w), -${de.toFixed(4)}, ${Ce.toFixed(4)}) + tang*b;
}
void smBlock(inout vec3 p, inout vec3 n){
  float total = uFlow.x + uFlow.z + uFlow.w;
  // time warp: constant speed in the canyon, accelerating once over the brink
  float ph = fract(aSeed.x + uTime*uFlow.y/ (total*1.18));
  float s = ph*total*1.18; float over = max(s - uFlow.x - 2.0, 0.0); s += over*over*0.0035; s = min(s, total);
  vec3 tang; vec3 c = smFlowPos(s, aSeed.y, tang);
  float fall = smoothstep(uFlow.x, uFlow.x + uFlow.z, s);
  float spin = uTime*(0.25 + 1.6*fall)*(aSeed.z - 0.5)*2.0 + aSeed.z*20.0;
  float bob = sin(uTime*1.7 + aSeed.x*60.0)*0.12*(1.0 - fall);
  // rotate about a per-block axis (yaw in the river, tumble in the fall)
  if (aSeed.z > 0.55) { p.y *= 0.5; p.xz *= 1.45; n = normalize(n*vec3(0.5, 1.45, 0.5)); }
  vec3 ax = normalize(mix(vec3(0.0, 1.0, 0.0), vec3(sin(aSeed.w*9.0), 0.3, cos(aSeed.w*9.0)), fall));
  float cs = cos(spin), sn = sin(spin);
  p = p*cs + cross(ax, p)*sn + ax*dot(ax, p)*(1.0 - cs);
  n = n*cs + cross(ax, n)*sn + ax*dot(ax, n)*(1.0 - cs);
  float gone = 1.0 - smoothstep(total - 14.0, total - 2.0, s);
  float born = smoothstep(0.0, 6.0, s);
  p *= aSeed.w*gone*born;
  vec3 up = normalize(cross(vec3(1.0, 0.0, 0.0), tang));
  p += c + up*(0.1 + bob + fall*(1.2 + 2.2*aSeed.z));
}`;function ze(e,t="wall",i={}){const w={};return w["IS_"+t.toUpperCase()]="",new o.ShaderMaterial({defines:w,fog:!0,side:i.side??o.FrontSide,uniforms:Object.assign({},o.UniformsUtils.clone(o.UniformsLib.fog),e,i.uniforms||{}),vertexShader:It.replace("ICE_BLOCK_PARS",Lt),fragmentShader:Et})}function Xe(e,t,i){const w=new Uint32Array(e*t*6);let r=0;for(let b=0;b<t;b++)for(let h=0;h<e;h++){const y=b*(e+1)+h,f=y+1,s=y+e+1,n=s+1;i?(w[r++]=y,w[r++]=f,w[r++]=s,w[r++]=f,w[r++]=n,w[r++]=s):(w[r++]=y,w[r++]=s,w[r++]=f,w[r++]=f,w[r++]=s,w[r++]=n)}return w}function ct(e){let t=e.next();for(;!t.done;)t=e.next();return t.value}async function He(e,t){let i=e.next();for(;!i.done;)t&&await t(),i=e.next();return i.value}function*ut(e,t,i,w=24,r=null){const b=t+1,h=new Float32Array(e.length),y=(f,s,n)=>{const d=f*3,l=s*3,a=n*3,x=e[d]-e[l],c=e[d+1]-e[l+1],m=e[d+2]-e[l+2],z=e[a]-e[l],u=e[a+1]-e[l+1],k=e[a+2]-e[l+2],v=u*m-k*c,A=k*x-z*m,R=z*c-u*x;h[d]+=v,h[d+1]+=A,h[d+2]+=R,h[l]+=v,h[l+1]+=A,h[l+2]+=R,h[a]+=v,h[a+1]+=A,h[a+2]+=R};for(let f=0;f<i;f++){for(let s=0;s<t;s++){const n=f*b+s,d=n+1,l=n+b,a=l+1;r&&!r(n,d,l,a)||(y(n,l,d),y(d,l,a))}f%w===w-1&&(yield)}for(let f=0;f<h.length;f+=3){const s=Math.hypot(h[f],h[f+1],h[f+2])||1;h[f]/=s,h[f+1]/=s,h[f+2]/=s}return h}function*Ye(e,t,i,w,r,b){const h=yield*ut(e,w,r),y=e.length/3,f=Math.max(1,Math.floor(y/400));let s=0;for(let l=0;l<y;l+=f){const a=b(e[l*3],e[l*3+1],e[l*3+2]);s+=(a[0]-e[l*3])*h[l*3]+(a[1]-e[l*3+1])*h[l*3+1]+(a[2]-e[l*3+2])*h[l*3+2]}const n=s<0;if(n)for(let l=0;l<h.length;l++)h[l]=-h[l];yield;const d=new o.BufferGeometry;return d.setAttribute("position",new o.BufferAttribute(e,3)),d.setAttribute("normal",new o.BufferAttribute(h,3)),d.setAttribute("aSurf",new o.BufferAttribute(t,2)),d.setAttribute("aIce",new o.BufferAttribute(i,3)),d.setIndex(new o.BufferAttribute(Xe(w,r,n),1)),d}function Rt(e){return ct(dt(e))}function ft(e,t){return He(dt(e),t)}function*dt(e){const t=e.stations,i=t.length,w=Oe.length,r=e.side,b=e.noise,h=e.sunDir,y=new Float32Array(i*w*3),f=new Float32Array(i*w*2),s=new Float32Array(i*w*3),n=Math.hypot(h.x,h.z)||.001,d=h.y/n;let l=e.alongStart||0;const a={x:0,y:0,z:0};let x=0;for(let c=1;c<i;c++)x+=Math.hypot(t[c].x-t[c-1].x,t[c].z-t[c-1].z);for(let c=0;c<i;c++){const m=t[c];c>0&&(l+=Math.hypot(m.x-t[c-1].x,m.z-t[c-1].z));const z=-m.tz*r,u=m.tx*r,k=m.rim-m.water,v=m.half/7,A=(-z*h.x-u*h.z)/n,R=A>.05?Math.min(40,2*5.3*v*d/A):0,C=e.fadeEnd?F(0,e.fadeEnd,x-(l-(e.alongStart||0))):1,N=l*r+(r>0?0:517),P=1+.9*Math.max(0,b.n2(N*.025,77));for(let T=0;T<w;T++){const p=Oe[T],M=p[1];let S,I;M<0?(S=m.water+M,I=M):M<=1?(S=m.water+M*k,I=M*k):(S=m.rim+(M-1),I=k+(M-1));let L=p[0]*v;const _=p[3]===0?1:p[3]===1?.6:0,D=.75*b.fbm2(N*.045,S*.05+3,3)+.38*b.n2(N*.16,S*.22)+.2*b.n2(N*.55,S*.7+9);if(L+=D*C*_*(.45+.55*F(0,.25,M)),p[3]===2){const re=b.fbm2(N*.07,40+T*.3,2);L+=re*.5*C,S=m.rim+(M-1)*(.75+.5*re)*(p[0]<9?P:1)*(e.cornice??1)*(.35+.65*C),T===w-5&&(L-=.35*(P-1)*C)}a.x=m.x+z*L,a.y=S,a.z=m.z+u*L;const U=m.rim-a.y;e.clip&&e.clip(a,U);const $=c*w+T;y[$*3]=a.x,y[$*3+1]=a.y,y[$*3+2]=a.z,f[$*2]=N,f[$*2+1]=I,s[$*3]=p[2],s[$*3+1]=R,s[$*3+2]=p[3]===2?Math.min(U,.3):U}c%10===9&&(yield)}return yield*Ye(y,f,s,w-1,i-1,(c,m,z)=>{let u=1e9,k=0;for(let v=0;v<i;v+=4){const A=(t[v].x-c)**2+(t[v].z-z)**2;A<u&&(u=A,k=v)}return[t[k].x,m+6,t[k].z]})}const qt=e=>e>=1.3?3.6*Math.max(0,1-e/6)**2:O(7.6,2.2,F(-.55,1.3,e));function*Bt(e,t,i,w){const r=pe*ie,b=[[-.6,10,.6],[.55,7.6,-.55],[.6,5.6,-.6],[.15,4.3,-.15],[-.55,3.2,.55]];let h=1.3;for(;h<Te;){b.push([-h,e.flare(h),h]);const C=Math.exp(-((h-13.5)*(h-13.5))/30);h+=O(O(.9,1.4,F(8,40,h))+1.8*F(278,292,h),.3,C)/(w<1?.8:1)*O(1,.34,F(e.cd-18,e.cd-14,h)*(1-F(e.cd+6,e.cd+10,h)))}b.push([-Te,0,Te]);const y=b.length-1,f=(r+1)*(y+1),s=new Float32Array(f*3),n=new Float32Array(f*2),d=new Float32Array(f*3),l=new Float32Array(f*2),a=t.rng,x=[];let c=0;for(let C=0;C<pe;C++){const N=.6+a()*.9;x.push(N),c+=N}const m=[0];for(let C=0;C<pe;C++)m.push(m[C]+x[C]/c*Math.PI*2);const z=[];for(let C=0;C<pe;C++)z.push(.7+a()*.6);z.push(z[0]);const u={},k=(C,N,P,T)=>C+t.spiral*(Math.PI/2)*T/300+(.04*i.n2(N*1.6,T*.02+P*1.6)+i.n2(N*2.3+9,T*.075+P*2.3)*(.035*F(25,50,T)+.015*F(70,100,T))+.026*i.n2(N*3.1+17,T*.21+P*3.1)*F(25,50,T))*F(2.5,11,T),v=C=>{const N=Math.min(Math.floor(C/ie),pe-1),P=C===r?1:C%ie/ie;return O(m[N],m[N+1],P)},A=new Float32Array(r+1);for(let C=0;C<=r;C++){const N=v(C),P=Math.cos(N),T=Math.sin(N);let p=0;for(let M=0;M<3;M++){const S=e.cd-p+2;e.point(k(N,P,T,S),Math.max(S,e.cd-27),0,0,u),p=be(Le(u.x0)+(it(u.arc)+rt(u.arc))*(1-F(20,32,u.arc)),-6,18)}A[C]=p}for(let C=0;C<=y;C++){const N=b[C],P=Math.max(N[2],0),T=F(e.cd-50,e.cd-12,P)*(1-F(e.cd+10,e.cd+48,P));for(let p=0;p<=r;p++){const M=Math.min(Math.floor(p/ie),pe-1),S=p===r?1:p%ie/ie,I=v(p),L=Math.cos(I),_=Math.sin(I),D=P-T*A[p],U=T>0?-D:N[0],$=F(2.5,11,D),re=k(I,L,_,D),ye=O(z[M],z[M+1],S),le=Math.sin(Math.PI*S);let Ae=0,g=0,E=(.62*Math.pow(le,.8)-.3)*ye*$*(1+.55*F(84,112,D)*(1-F(205,245,D)));E+=.22*i.n2(L*3+5,D*.11+_*3)*$+.5*i.n2(L*.9,D*.02+_*.9+20)*F(0,8,D),e.point(re,D,N[1],0,u),E*=(1-.6*u.w*(1-F(88,112,D)))*(1-.4*F(.05,.4,u.cd));const B=F(.03,.3,u.cd);{const G=8*i.n2(L*1.1+31,_*1.1)+4*i.n2(L*2.9,_*2.9+13),te=(D+G)/16.5,V=Math.floor(te),H=te-V,Q=F(-.25,.2,i.n2(L*1.7+V*7.3,_*1.7-V*3.1))*F(24,42,D),oe=Math.max(F(0,.6,u.w)*(1-F(e.cd+We,e.cd+We+14,D)),(1-F(15,23,Math.abs(u.arc)))*(1-F(9,16,u.mouthUp))*F(-9,-3,u.mouthUp));Ae=F(0,.09,H)*Math.pow(1-H,1.6)*Q*(.75+.5*Math.abs(i.n2(V*3.7,5.5)))*(1-oe)*(1-.5*B),E-=1.5*Ae,g=F(-.02,.05,H)*(1-F(.08,.2,H))*Q*(1-oe)*(1-.5*B)}e.point(re,D,N[1],E,u);const W=C*(r+1)+p;s[W*3]=u.x,s[W*3+1]=U,s[W*3+2]=u.z,n[W*2]=p/r*88,n[W*2+1]=-D,d[W*3]=1-le,d[W*3+1]=g,d[W*3+2]=C<5?0:D,l[W*2]=u.x0,l[W*2+1]=u.arc}C%3===2&&(yield)}t.fluteTh0=m;const R=yield*Ye(s,n,d,r,y,(C,N,P)=>[0,N,ne(-N)]);return R.setAttribute("aCd",new o.BufferAttribute(l,2)),R}function Wt(e,t,i){const h=new Float32Array(10767),y=new Float32Array(3589*2),f=new Float32Array(3589*3);for(let s=0;s<=36;s++){const n=s/36,d=3+(t-3)*Math.pow(n,1.9);for(let l=0;l<=96;l++){const a=l/96*Math.PI*2,x=Math.sin(a)*d,c=e.mouthCz+20+Math.cos(a)*d,m=s*97+l,z=.35*i.fbm2(x*.02,c*.02,3)*F(14,60,d)+1.6*i.fbm2(x*.004+9,c*.004,2)*F(60,240,d);h[m*3]=x,h[m*3+1]=Ne(c)+z-.06-3*F(t*.8,t,d),h[m*3+2]=c,y[m*2]=x,y[m*2+1]=c,f[m*3]=0,f[m*3+1]=99,f[m*3+2]=0}}return ct(Ye(h,y,f,96,36,(s,n,d)=>[s,n+10,d]))}const xe=K*Me,Ke=4.2,fe=16;function*_t(e,t){const w=[];for(let a=0;a<t-6;a+=.8)w.push(a);for(let a=t-6;a<t+xe+4;a+=.4)w.push(a);const r=e.cd,b=(r+7-de)/j;for(let a=4.6;a<=b;a+=O(.8,1.7,F(4,40,a)))w.push(t+xe+a);const h=w.length-1,y=45*(h+1),f=new Float32Array(y*3),s=new Float32Array(y*4);for(let a=0;a<=h;a++){const x=w[a];let c,m,z,u,k,v=1,A=0,R=0;if(x<t)m=t-x,c=ve(m),z=8.4,u=0,k=x/fe;else if(x<t+xe){const P=(x-t)/K;m=-K*Math.sin(P),c=-X-K*(1-Math.cos(P)),u=(x-t)/xe,z=O(8.4,9,u),v=Math.cos(P),A=-Math.sin(P);const T=Math.sqrt(fe*fe+2*Ke*(x-t));k=t/fe+(T-fe)/Ke}else{const P=x-t-xe;c=-de-P*j,m=Ce-P*se,u=1+P/b,z=O(9,11.5,F(0,45,P)),v=se,A=-j;const T=Math.sqrt(fe*fe+2*Ke*(x-t));k=t/fe+(T-fe)/Ke}R=-c;const C=F(r-42,r-11,R),N=e.Rx(Math.min(R,r))-1.6;for(let P=0;P<=44;P++){const T=P/44*2-1;let p=T*z,M=c,S=m;const I=u>0?O(.12,.5,F(0,1,u))*(u>1?O(1,.22,F(88,112,R)):1):0;if(u>1){p=be(O(p,-8.95+T*2.35,C),-N,N);const _=R>r-38?Le(p):0,D=Math.min(R,r-1.5-_);S=e.nearZ(p,D)-(R-D)*ue+A*I,M+=v*I}else M+=v*I,S+=A*I;const L=a*45+P;f[L*3]=p,f[L*3+1]=M,f[L*3+2]=S,s[L*4]=T,s[L*4+1]=x,s[L*4+2]=u,s[L*4+3]=k}a%30===29&&(yield)}const n=yield*ut(f,44,h),d=n[16]<0;if(d)for(let a=0;a<n.length;a++)n[a]=-n[a];const l=new o.BufferGeometry;return l.setAttribute("position",new o.BufferAttribute(f,3)),l.setAttribute("normal",new o.BufferAttribute(n,3)),l.setAttribute("aFlow",new o.BufferAttribute(s,4)),l.setIndex(new o.BufferAttribute(Xe(44,h,d),1)),l}function mt(e){const t=[],i=[],w=r=>e*Math.exp(-(((1.2-r)/1.6)**2));for(let r=40;r>0;r-=.2)t.push(r),i.push(ve(r)+w(r));for(let r=0;r<=xe;r+=.2){const b=r/K,h=O(.12,.5,F(0,1,r/xe));t.push(-(K+h)*Math.sin(b)),i.push(-X-K*(1-Math.cos(b))+h*Math.cos(b)+w(-r)*Math.cos(b))}for(let r=.5;r<40;r+=.5)t.push(Ce-r*se-j*.5),i.push(-de-r*j+se*.5);return r=>{if(r>=t[0])return ve(r);for(let b=1;b<t.length;b++)if(t[b]<=r)return O(i[b-1],i[b],(r-t[b-1])/Math.min(t[b]-t[b-1],-1e-6));return i[i.length-1]}}const no={surfaceY:mt(je),brinkRadius:K,axisTop:[0,0,Se],axisDir:[0,-j,-se],portalSeat:[0,-Ie,ne(Ie)]},pt=`
attribute vec4 aFlow;
varying vec3 vP; varying vec3 vW; varying vec3 vN; varying vec4 vFlow; varying float vWave; varying float vSlope; varying vec3 vSunW; varying vec3 vPL; varying float vLobe; varying float vLobeS;
uniform float uTime, uReach, uHump; uniform vec3 uSun; uniform vec3 uPortalPos;
#include <common>
#include <fog_pars_vertex>
void main(){
  vec3 p = position; float s = aFlow.y, u = aFlow.x;
  float glassy = 1.0 - smoothstep(uReach - 15.0, uReach - 3.0, s);     // the last metres before the brink run smooth
  float river = 1.0 - smoothstep(0.0, 0.5, aFlow.z);
  // trains of standing waves (they stand; the water runs through them), plus a little live chop
  float env = smoothstep(0.15, 0.8, 0.5 + 0.5*sin(s*0.071 + 1.3))*(0.7 + 0.3*sin(s*0.023 + 4.0));
  float lane = exp(-(u - 0.25*sin(s*0.05))*(u - 0.25*sin(s*0.05))*2.2);
  float st = sin(s*1.15 + 0.6*sin(u*2.4))*env*lane;
  float chop = sin(s*2.7 + u*5.0 - uTime*5.5)*0.035 + sin(s*1.3 - u*7.0 + uTime*3.7)*0.03;
  float edge = smoothstep(0.55, 0.95, abs(u));
  float h = (st*0.26*glassy + chop*(0.35 + 0.65*glassy) + 0.06*sin(uTime*1.3 + s*0.4)*edge)*river;
  // the water humps up a hand before it bends over: from upstream the river ends in a bright curved line
  float hb = (s - uReach + 1.2)/1.6;
  h += uHump*exp(-hb*hb)*(1.0 - 0.5*u*u);
  // the brink: a smooth hump that sags and breathes slightly
  h += 0.06*sin(uTime*0.8 + u*2.0)*smoothstep(0.0, 0.5, aFlow.z)*(1.0 - smoothstep(0.6, 1.2, aFlow.z));
  // the sheet: thin ripples crawling down
  h += 0.07*sin(aFlow.w*26.0 - uTime*26.0 + u*9.0)*smoothstep(1.0, 1.15, aFlow.z);
  // THE TORN LIP: past the brink line the water leaves in lobes and thick ropes, so the edge of the sheet against the
  // shaft is ragged from wherever it is seen, never a ruled line (vLobeS: the lobes' slope across the flow, for the fragment shader)
  // (ropes stand up from the film, never down into the ice under it: the lobes only add height)
  float tornK = smoothstep(0.1, 0.42, aFlow.z)*(1.0 - smoothstep(1.06, 1.2, aFlow.z));
  float uw = u*9.0, a1 = uw*1.25 + 0.7 + 0.5*sin(uTime*0.9), a2 = uw*2.9 + 2.1 - uTime*1.7, a3 = uw*4.3 + uTime*2.3 + s*0.8;
  vLobe = 0.34*sin(a1) + 0.4*sin(a2) + 0.26*sin(a3);
  float amp = tornK*(0.5 + 0.4*smoothstep(0.3, 0.9, aFlow.z));
  h += amp*(0.5 + 0.5*vLobe);
  vLobeS = amp*0.5*(0.34*1.25*cos(a1) + 0.4*2.9*cos(a2) + 0.26*4.3*cos(a3));      // its slope across the flow
  p += normal*h;
  vWave = st*river*glassy; vFlow = aFlow; vP = p;
  vSlope = cos(s*1.15 + 0.6*sin(u*2.4))*env*lane*river*glassy;
  vec4 wp = modelMatrix*vec4(p, 1.0); vW = wp.xyz;
  vN = normalize(mat3(modelMatrix)*normal); vSunW = normalize(mat3(modelMatrix)*uSun);
  vPL = mat3(modelMatrix)*(uPortalPos - p);
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,vt=`
varying vec3 vP; varying vec3 vW; varying vec3 vN; varying vec4 vFlow; varying float vWave; varying float vSlope; varying vec3 vSunW; varying vec3 vPL; varying float vLobe; varying float vLobeS;
uniform float uTime, uPortalI, uReach;
uniform vec3 uSun, uSunCol, uSkyCol, uSnow, uTurq, uCobalt, uElectric, uPortalCol, uFoamTint; uniform vec4 uMouth;
uniform vec4 uPools[3]; uniform vec2 uPoolDir[3];      // foam aprons: (x, z, radius m, strength), and the flow direction there
#include <common>
${ke}
${Fe}
void main(){
  float u = vFlow.x, s = vFlow.y, zone = vFlow.z;
  float run = (vFlow.w - uTime)*${fe}.0;                 // metres in the water's own frame
  float river = 1.0 - smoothstep(0.0, 0.6, zone), sheet = smoothstep(1.0, 1.2, zone), brink = 1.0 - river - sheet;
  float W = mix(8.4, 11.0, sheet);
  float past = smoothstep(uReach - 2.5, uReach + 2.5, s);              // 0 in the river, 1 from the first metre over the brink
  float D = max(-vP.y, 0.0);
  vec3 cobD = uCobalt*(1.0 + 1.5*smoothstep(70.0, 165.0, D));
  float dist = length(cameraPosition - vW);
  vec3 V = normalize(cameraPosition - vW);
  // ---- fraying edges and tears of the sheet (alpha test, widened by fwidth so it does not sparkle)
  float fb = max(zone - 1.0, 0.0);
  float torn = smoothstep(0.2, 0.9, zone);                      // 0 on the brink line, 1 where the curve has become the sheet
  // (deepK: the cobalt reach, where the sheet has frayed into separate threads; lipK: the conduit's lip, where what is
  // left gathers, turns white and goes over; gone: past the lip it is torn away within a few metres)
  float De = D - uCd.x + ${Ve("vP.x")}*step(uCd.x - 38.0, D);          // metres below the lip, as the scalloped lip sees it                       // (the lip is scalloped: depth as the lip sees it)
  float deepK = smoothstep(92.0, 128.0, D)*(1.0 - 0.25*smoothstep(-22.0, -3.0, De));      // (it stays threads to the lip: never a slab)
  float lipK = smoothstep(-12.0, -3.0, De), gone = smoothstep(-7.0, 0.5, De);
  float fray = smoothstep(0.0, 0.25, fb)*0.42 + deepK*0.3 + torn*0.1 + gone*0.5;
  float tear = smNoise(vec2(u*W*0.55, run*0.035)) *0.6 + smNoise(vec2(u*W*1.7 + 4.0, run*0.06))*0.4;
  if (abs(u) > 1.0 - fray*(0.25 + tear)) discard;
  if (sheet > 0.5 && tear < smoothstep(0.35, 1.0, fb)*0.3*(1.0 - lipK)) discard;
  // THE END OF THE SHEET: over the last seven metres above the conduit's lip it is torn away in clots a metre or two
  // across (two octaves of noise in metres across and metres of fall, so no mesh row and no straight slit ever shows);
  // nothing of it is left past the lip, where 'conduit-fall' takes the water over
  float tearE = smNoise(vec2(vP.x*0.8 + 3.0, run*0.085))*0.62 + smNoise(vec2(vP.x*2.3 + 11.0, run*0.21))*0.38;
  if (tearE < gone*1.3 - 0.12) discard;
  // THE FIBRES of the falling water: strands a hand to a forearm wide, drawn out along the fall, on a faint metre-wide
  // swell (each fine layer fades before it can alias). fibN is high in a white fibre and low in a gap. The broad layer
  // is kept weak: with more of it whole lobes of the lip turn to one white sheet.
  // TORN, NOT RULED (the sheet below the brink curve): every strand wanders a metre across the fall as it drops and is
  // cut into lengths of three to eight metres with ragged ends, so from above the falling water is short torn threads
  // and clots, never a fan of straight lines converging on the ring.
  float tornS = smoothstep(1.02, 1.3, zone);
  // (from 40 m above the conduit the sheet is gathered sideways toward it: its strands are laid in metres across the wall
  // there, not in the sheet's own squeezed width, or they would close up into a fan of ruled bands)
  float uwm = mix(u*W, vP.x*0.957, smoothstep(uCd.x - 48.0, uCd.x - 40.0, D)), fwU = fwidth(uwm), fwR = fwidth(run);
  float ux = uwm + tornS*((smNoise(vec2(uwm*0.3, run*0.07)) - 0.5)*2.2 + (smNoise(vec2(uwm*0.9 + 5.0, run*0.19)) - 0.5)*0.7);
  // (the pattern is laid in the water's own time, and the water is three times as fast at the bottom as at the brink:
  // without the last factor a strand 4 m long at the top was 12 m long, a ruled line, in the cobalt reach)
  float lenK = (1.0 + 1.6*tornS)*mix(1.0, sqrt(1.0 + 0.0328*max(s - uReach, 0.0)), tornS);
  float fA = smNoise(vec2(ux*0.62, run*0.028*lenK));
  float fB = smNoise(vec2(ux*2.8 + 1.2*fA, run*0.075*lenK));
  float fC = mix(0.5, smNoise(vec2(ux*7.0, run*0.24*lenK + 3.0*fB)), 1.0 - smoothstep(0.45, 1.1, fwU*7.0));
  float fD = mix(0.5, smNoise(vec2(ux*16.0, run*0.55*lenK)), 1.0 - smoothstep(0.45, 1.1, fwU*16.0));
  float fibN = 0.5 + (fA*0.14 + fB*0.36 + fC*0.3 + fD*0.2 - 0.5)*1.8;      // (spread out: four noises summed crowd round 0.5)
  // clots: the strands are cut across, raggedly, into lengths (fading before the cut can alias)
  // (while it is the pale wall of water, to 90 m down, the cuts are twice as far apart: strands three to eight metres
  // long with soft turquoise between them, drawn out down the fall, never a stipple of flecks)
  float aquaK = sheet*(1.0 - smoothstep(60.0, 100.0, D));
  float cK = lenK/2.6*mix(1.0, 0.45, aquaK);
  float clot = mix(0.5, smNoise(vec2(ux*0.8 + 9.0, run*0.21*cK)), 1.0 - smoothstep(0.5, 1.6, fwR*0.21*cK))*0.65 + mix(0.5, smNoise(vec2(ux*2.1, run*0.5*cK + 4.0)), 1.0 - smoothstep(0.5, 1.6, fwR*0.5*cK))*0.35;
  fibN -= tornS*(1.0 - smoothstep(0.3, 0.56, clot))*mix(0.22, 0.5, deepK)*mix(1.0, 0.7, aquaK);
  float fibM = max(sheet, past*(0.55 + 0.45*torn));
  // slits torn right through the sheet: the wet blue ice of the footwall shows in them
  // (only past the brink: in the river the threshold is 0 and the spread fibN dips below 0 near the lens, which would
  // open holes to the void, since nothing lies under the river)
  float slitT = 0.27*smoothstep(0.55, 1.08, zone)*(1.0 - 0.45*smoothstep(0.5, 1.0, fb)*(1.0 - deepK)) + 0.3*deepK + 0.3*gone;
  slitT *= 1.0 - 0.55*aquaK;      // (the wall of water is nearly whole: few slits, and those long)
  if (zone > 0.55 && fibN < slitT) discard;      // (in the cobalt reach half of it is gone: threads in the flutes)
  float slitE = zone > 0.55 ? 1.0 - smoothstep(slitT, slitT + 0.07, fibN) : 0.0;      // the thin wet edge of a slit: it deepens to the ice's own blue before the water ends
  fibN = clamp(fibN, 0.0, 1.0);
  // ---- colour: electric over the white bed, turquoise in the shallows, cobalt in the deep thread
  float thread = exp(-(u - 0.25*sin(s*0.05))*(u - 0.25*sin(s*0.05))*3.2);
  vec3 base = mix(uElectric, uTurq*0.82, smoothstep(0.45, 1.0, abs(u)));
  base = mix(base, mix(cobD, uElectric, 0.22), thread*0.85*(1.0 - 0.5*brink));
  // once it has gone over, the water has no shallows: the whole width deepens toward cobalt, so its white fibres stand out
  base = mix(base, mix(cobD, uElectric, 0.42), smoothstep(uReach + 1.0, uReach + 6.0, s)*(1.0 - sheet)*0.62);
  // bed glow mottling drifting slower than the surface
  base *= 0.8 + 0.3*smNoise(vec2(u*W*0.35, s*0.12 + run*0.02));
  base *= 0.82 + 0.34*smNoise(vec2(u*W*2.3, run*0.085));
  base *= 1.0 + 0.3*vWave;
  // over the brink the glass is drawn out into long streaks, so the water under the nose is never a blank slab
  base *= mix(1.0, 0.5 + 1.0*smNoise(vec2(u*W*1.3, run*0.02)), past*(1.0 - sheet));
  float cw = smNoise(vec2(u*W*1.5, run*0.27) + 0.6*smNoise(vec2(u*W*0.7, run*0.11 + 3.0)));
  float caust = 1.0 - abs(cw - 0.5)*2.0; caust *= caust*caust;
  base *= 0.78 + 0.6*caust*(1.0 - sheet);
  base = mix(base, base*0.5 + cobD*0.25, sheet*0.8);
  // the gaps between the fibres are thin dark water: cobalt, not pale blue
  float gap = (1.0 - smoothstep(mix(0.34, 0.26, aquaK), mix(0.52, 0.6, aquaK), fibN))*fibM;      // (soft-edged gaps in the wall of water)
  // (in the aqua reach the wall of water is pale: its gaps are turquoise shadow, not navy stripes)
  base = mix(base, mix(base*0.3 + mix(cobD, uElectric, 0.25)*0.3, base*0.55 + uTurq*0.3 + uElectric*0.12, sheet*(1.0 - smoothstep(60.0, 105.0, D))), gap*0.85);
  // ---- surface normal from flowing ripples
  vec2 rc = vec2(u*W*0.9, run*0.33);
  float r0 = smFbm(rc), r1 = smFbm(rc + vec2(0.12, 0.0)), r2 = smFbm(rc + vec2(0.0, 0.12));
  vec3 N = normalize(vN);
  vec3 Tx = vec3(1.0, 0.0, 0.0), Tz = normalize(cross(Tx, N));
  float rough = mix(1.0, 0.25, brink) + sheet*0.6;
  vec3 Np = normalize(N + (Tx*(r0 - r1) + Tz*(r0 - r2))*3.4*rough + Tz*vSlope*0.3 - Tx*vLobeS*0.8);
  base *= 1.0 - 0.3*clamp(vLobeS*sign(uSun.x + 1e-4), -1.0, 1.0);      // each rope of the lip has a lit flank and a shaded one
  base *= 1.0 + 2.2*(r0 - r1)*rough + 1.6*(r0 - r2)*rough;
  // ---- foam: braided lines along the flow, wall eddies, wave crests, fibres on the sheet
  float b1 = smNoise(vec2(u*W*0.55 + 1.3*sin(run*0.04 + u*2.0), run*0.05));
  float b2 = smNoise(vec2(u*W*0.7 - 1.1*sin(run*0.033 + 2.0), run*0.06 + 9.0));
  float fine = smNoise(vec2(u*W*3.1, run*0.42));
  float w1 = max(0.03, fwidth(b1)*1.3), w2 = max(0.03, fwidth(b2)*1.3);
  float foam = (1.0 - smoothstep(w1*0.4, w1, abs(b1 - 0.5)))*(0.03/w1) + (1.0 - smoothstep(w2*0.4, w2, abs(b2 - 0.42)))*(0.03/w2)*0.8;
  float lace = smoothstep(0.32, 0.62, smNoise(vec2(u*W*5.5, run*1.4)));
  foam *= (0.25 + 0.75*lace)*0.8;
  foam += smoothstep(0.82, 0.92, smNoise(vec2(u*W*4.0, run*0.9)))*lace*0.45;
  foam += smoothstep(0.84, 0.97, abs(u) + 0.09*smNoise(vec2(s*0.6, uTime*0.7)))*(0.35 + 0.65*fine)*0.8;
  foam += smoothstep(0.45, 0.95, vWave)*smoothstep(0.3, 0.7, fine)*0.85;
  // FOAM APRONS where a tributary fall lands: churned white at the foot, drawn out downstream and torn into flecks with
  // blue water between them. It is part of the river's own surface, so it rides the waves (a flat foam sheet laid over
  // the water was cut by every crest into a comb) and thins toward the lens so the water shows through.
  float ap = 0.0;
  for (int i = 0; i < 3; i++) {
    vec2 dq = vW.xz - uPools[i].xy; float al = dot(dq, uPoolDir[i]), ac = dq.x*uPoolDir[i].y - dq.y*uPoolDir[i].x;
    float rr = length(vec2(ac, al/(al > 0.0 ? 2.8 : 1.0)))/max(uPools[i].z, 0.01);
    ap = max(ap, (1.0 - smoothstep(0.15, 1.0, rr))*uPools[i].w);
  }
  float churn = smNoise(vec2(u*W*1.9, run*0.55))*0.55 + fine*0.3 + lace*0.25;
  foam += smoothstep(0.9 - 0.78*ap, 1.1 - 0.68*ap, churn)*smoothstep(0.0, 0.12, ap)*mix(0.5, 1.0, smoothstep(3.0, 9.0, dist))*0.95;
  foam *= river + brink*0.25;
  float fibres = smoothstep(0.58 - 0.1*sheet*(1.0 - smoothstep(60.0, 105.0, D)), 0.72 + 0.1*aquaK, fibN + 0.05*smoothstep(0.0, 0.5, fb))*fibM;      // (whiter while it is the wall of water)
  // the brink itself: a crisp bright arc where the water bends over, flecked with foam
  float bq = (s - uReach + 0.7)/1.0; float brinkLine = exp(-bq*bq)*mix(0.25, 1.0, smoothstep(4.0, 16.0, dist));
  foam += brinkLine*smoothstep(0.5, 0.78, fine)*0.5;
  foam = clamp(foam + fibres*(0.78 + 0.22*smoothstep(0.0, 0.4, fb)), 0.0, 1.0);
  // ---- light: sun only where the mouth lets it in; daylight dies with depth
  float ts = D/max(uSun.y, 0.05);
  vec2 e = vec2(vP.x + uSun.x*ts, vP.z + uSun.z*ts - uMouth.x)/uMouth.zw;
  float lit = (1.0 - smoothstep(0.72, 1.02, dot(e, e)))*smoothstep(-6.0, 1.0, -vP.z + 1.0);
  float day = exp(-max(D - 12.0, 0.0)/58.0);
  vec3 deepTint = mix(vec3(1.0), mix(uTurq*1.5, cobD*2.2, smoothstep(45.0, 125.0, D)), smoothstep(14.0, 50.0, D));
  float ambI = (0.3 + 0.9*day)*(1.0 - 0.55*smoothstep(120.0, 240.0, D));
  // white water stays white as it falls: the fibres take only part of the depth's blue
  deepTint = mix(deepTint, mix(deepTint, vec3(0.62, 0.9, 1.2), 0.62), foam*sheet);
  vec3 col = base*(0.78 + 0.5*lit)*mix(1.0, 1.12, brink);
  col = mix(col, (uSnow*0.85*(0.62 + 0.5*lit) + uSkyCol*0.1)*uFoamTint, foam*0.9);
  col *= 1.0 + 0.5*sheet*smoothstep(20.0, 60.0, D);
  col *= deepTint*mix(1.0, ambI, smoothstep(12.0, 30.0, D));
  float fres = pow(clamp(1.0 - dot(Np, V), 0.0, 1.0), 3.0);
  vec3 R = reflect(-V, Np);
  float sk = smoothstep(0.1, 0.65, R.y - 0.35*abs(R.x)*river);
  vec3 refl = mix(cobD*0.45 + uTurq*0.12, uSkyCol*1.5 + uSnow*0.3, sk);
  col = mix(col, refl*day, fres*0.62*(1.0 - foam*0.7)*(1.0 - 0.8*past));      // falling water is torn, not a mirror
  col += (uTurq*0.16 + uSnow*0.05)*brink*(0.6 + 0.4*lit);
  col += (uSkyCol*1.2 + uSnow*0.5*(0.6 + 0.6*lit))*uFoamTint*brinkLine*1.6;
  vec3 Hh = normalize(V + vSunW);
  col += uSunCol*pow(max(dot(Np, Hh), 0.0), 120.0)*lit*3.0 + uSunCol*pow(max(dot(Np, Hh), 0.0), 14.0)*lit*0.25*(brink + 0.3);
  // sparkle on the chop
  float gs = smHash(floor(vec2(u*W*5.0, run*2.0)));
  col += uSunCol*step(0.975, gs)*lit*(0.5 + 0.5*sin(uTime*9.0 + gs*90.0))*1.6*(1.0 - smoothstep(20.0, 70.0, dist));
  float pd2 = dot(vPL, vPL);
  col += uPortalCol*(0.25 + 0.6*foam)*uPortalI/(1.0 + pd2/420.0);
  // THE CONDUIT'S LIP: the one bright thing in the deep reach besides the ring: churned white water going over an edge,
  // pale cyan-white, torn (it is laid on after the depth's blue so it stays white)
  // (only its strands: between them the water is thin and dark; the last three metres before the edge are solid churn)
  // (wet cyan-white with form, never paper white: held under 0.6 whatever the mood's foam tint; the crest itself, the
  // clots and the strands that go over, are 'conduit-fall')
  vec3 lipCol = (uSnow*0.42 + uTurq*0.34 + uPortalCol*0.1)*min(uFoamTint, vec3(1.0))*(0.5 + 0.5*fibN);
  col = mix(col, lipCol*0.6, deepK*smoothstep(0.6, 0.8, fibN)*0.55);      // (and in the cobalt reach its threads stay pale: falling water, not dark lines)
  col = mix(col, lipCol, lipK*smoothstep(0.5, 0.8, fibN)*0.7);
  col = mix(col, (uTurq*0.4 + cobD*0.2 + 0.03)*deepTint*mix(1.0, ambI, smoothstep(12.0, 30.0, D)), slitE*aquaK*0.8);
  gl_FragColor = vec4(smFog(col, vP.y, dist), 1.0);
}`,Ot=`
attribute vec4 aC; attribute vec3 aN;
varying vec4 vC; varying vec3 vP; varying vec3 vW; varying vec3 vPL; varying float vHump;
uniform float uTime; uniform vec3 uPortalPos;
#include <common>
#include <fog_pars_vertex>
void main(){
  float xm = aC.x, bm = aC.y;
  vec3 p = position;
  // the welt on the lip boils: lumps that swell and travel along it
  float boil = 0.5 + 0.5*sin(xm*1.7 + uTime*2.3 + 1.3*sin(xm*0.6 - uTime*1.1));
  float boil2 = 0.5 + 0.5*sin(xm*4.1 - uTime*3.4 + bm*1.3);
  float hump = exp(-(bm - 0.4)*(bm - 0.4)/3.4);
  p += aN*hump*(0.5 + 0.45*boil + 0.2*boil2);
  // the strands sway apart as they drop
  float fl = max(bm - 1.2, 0.0);
  p.x += 0.045*fl*sin(xm*2.1 + bm*0.35 - uTime*1.6);
  p += aN*(0.04*fl*sin(xm*1.3 + 2.0 + uTime*0.9));
  vC = aC; vP = p; vHump = hump*(0.4 + 0.6*boil);
  vec4 wp = modelMatrix*vec4(p, 1.0); vW = wp.xyz;
  vPL = mat3(modelMatrix)*(uPortalPos - p);
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ht=`
varying vec4 vC; varying vec3 vP; varying vec3 vW; varying vec3 vPL; varying float vHump;
uniform float uTime, uPortalI, uBandSeed; uniform vec3 uSnow, uTurq, uCobalt, uElectric, uPortalCol, uFoamTint;
#include <common>
${ke}
${Fe}
// ROPES of falling water: one family of strands, about 1/f metres apart but never evenly (each stands anywhere in its
// own stretch, so two may run side by side and the next gap be twice as wide), a few thick and most thin (half its
// width is wa to wa + wb of that spacing). Each wanders off its own line (slowly by a fifth of its spacing, quickly by
// a fourteenth), swells into a knot every metre or so and thins between two knots, and is cut into lengths that taper
// to a point at both ends; cut = 0 at the lip, where nearly every rope is whole, to 1 far down the fall, where they
// are thinner, fewer and shorter. No rope is drawn thinner than a pixel and a half can hold (fw = the pixel's footprint
// in metres), so a thread is a line and never a row of dots.
// Returns its profile: 1 on a strand's centre line, 0 at its edge and in the dark between two strands.
float smRopes(float sx, float run, float f, float seed, float cut, float fw, float wa, float wb){
  float c = sx*f, id = floor(c), fr = c - id, best = 0.0;
  for (int k = -1; k <= 1; k++) {
    float i = id + float(k), h = smHash(vec2(i, seed)), h2 = smHash(vec2(i + 31.0, seed));
    float cx = float(k) + 0.5 + 0.7*(h2 - 0.5) + 0.4*(smNoise(vec2(run*(0.19 + 0.2*h), i*1.7 + seed)) - 0.5) + 0.14*(smNoise(vec2(run*(0.7 + 0.5*h2), i*2.9 + seed)) - 0.5);
    float len = smNoise(vec2(run*(0.3 + 0.35*h2) + h2*30.0, i*3.1 + seed));
    float kn = smNoise(vec2(run*(0.7 + 0.6*h) + h*17.0, i + seed));
    float w = (wa + wb*h*h)*smoothstep(0.12 + 0.32*cut, 0.3 + 0.32*cut, len)*(0.5 + kn)*(1.0 - 0.45*cut);
    w *= smoothstep(0.012, 0.04, w);
    w = max(w, 0.8*fw*f*min(w*40.0, 1.0));
    best = max(best, 1.0 - abs(fr - cx)/max(w, 1e-3));
  }
  return best;
}
void main(){
  float xm = vC.x, bm = vC.y, ac = vC.z;
  float run = bm - uTime*13.0;                                  // metres in the water's own frame
  // EACH SEED ITS OWN WATER: every noise below is read wS metres further across its field (xw for xm, and wS on the typed
  // offsets of the lookups that run with the water alone), wS from the hero's band seed (0 to 60, already dealt: no new
  // draw): 0 to 222 m, more than a hundred knots' widths. The same water in kind, another stretch of it. What belongs
  // to the place stays on xm and ac: the lip's climb, the mesh's sides, the pixel's footprint.
  float wS = uBandSeed*3.7, xw = xm + wS;
  float dc = length(cameraPosition - vW);
  vec3 cobD = uCobalt*(1.0 + 1.5*smoothstep(70.0, 165.0, max(-vP.y, 0.0)));
  // (each layer of detail is drawn as soon as a pixel can hold it, and not before: by the pixel's footprint in the
  // water's own metres, so at arm's length the finest fibres are there and from far above they have melted away)
  float fwX = fwidth(xm), fwM = max(fwX, fwidth(bm));
  float lodF = 1.0 - smoothstep(0.25, 0.9, fwM*5.5), lod0 = 1.0 - smoothstep(0.3, 0.9, fwX*11.0), lodN = 1.0 - smoothstep(0.3, 0.9, fwX*26.0), lodV = 1.0 - smoothstep(0.3, 0.9, fwX*60.0);
  float up = 1.0 - smoothstep(-2.4, -0.3, bm);                  // 1 upstream of the crest
  float fallK = smoothstep(1.4, 5.0, bm);                       // 1 well down the fall
  // CLOTS: knots of foam one to two metres across, smaller ones on them, froth a thumb across on those
  float n1 = smNoise(vec2(xw*0.75 + 0.3*sin(run*0.2), run*0.34));
  float n2 = smNoise(vec2(xw*1.9 + 5.0, run*0.8 + 2.0*n1));
  float n3 = mix(0.5, smNoise(vec2(xw*5.5 + 1.0, run*2.1)), lodF);
  float n4 = mix(0.5, smNoise(vec2(xw*14.0 + 3.0, run*5.0)), lodN);
  float clot = n1*0.34 + n2*0.22 + n3*0.24 + n4*0.2;
  // ROPES of the fall: they wander across the drop (a metre and a half slowly, a quarter of a metre quickly), so no two
  // run parallel for long, and they stand unevenly: thick ones a forearm wide well apart, thin ones only in bunches
  // (clump), drops flung clear between them (bead). Each rope is a BUNDLE OF FIBRES: streaks a hand, two fingers and a
  // finger wide run down it (each kind drawn as soon as a pixel can hold it), and where they are thin the dark shows
  // through, so a rope is split into fibres along its length and frayed at both edges.
  float sx = xw + ((smNoise(vec2(xw*0.4 + 2.0, run*0.1)) - 0.5)*1.6 + (smNoise(vec2(xw*1.3 + 9.0, run*0.45)) - 0.5)*0.25)*fallK;      // (across the seed's own stretch of water, like xw)
  float cut = smoothstep(1.5, 11.0, bm);
  float clump = smoothstep(0.2, 0.5, smNoise(vec2(sx*0.8 + 3.0, run*0.22 + 4.0)));
  float rA = max(smRopes(sx, run, 1.6, 3.0, cut, fwX, 0.1, 0.25), 0.0), rB = max(smRopes(sx + 0.37, run*1.2 + 5.0, 3.4, 11.0, cut, fwX, 0.08, 0.2), 0.0)*lodF*clump;
  float bead = smoothstep(0.82, 0.96, smNoise(vec2(sx*6.0 + 7.0, run*1.9 + 3.0)))*lod0;
  float f0 = mix(0.5, smNoise(vec2(sx*11.0 + 1.5*n2, run*0.8)), lod0);
  float f1 = mix(0.5, smNoise(vec2(sx*26.0, run*1.4)), lodN), f2 = mix(0.5, smNoise(vec2(sx*60.0 + 5.0, run*3.2)), lodV);
  float fib = (f0 - 0.5)*0.56 + (f1 - 0.5)*0.4 + (f2 - 0.5)*0.22;
  float rope = max(rA, 0.85*rB);
  float strand = min(rope*1.7, 0.68)*(0.8 + 0.2*n2) + (clot - 0.5)*0.3 + fib*(0.1 + 1.7*smoothstep(0.0, 0.35, rope)) + 0.62*bead;      // (knots ride down the ropes)
  // (upstream and on the crest the water is knots of froth, streaked the way it runs)
  float body = mix(clot + fib*0.6, strand, fallK);
  body += 0.09*clamp(vHump, 0.0, 1.0);                         // (the water piles up on the lip: the knots stand closest there)
  // how much of it there is: knots with dark water between upstream, closest on the crest, ropes with dark between
  // them from the crest on, fewer and thinner as they drop
  float thr = mix(mix(0.46, 0.57, up), 0.38 + 0.14*smoothstep(3.0, 18.0, bm), fallK);
  // RAGGED ON EVERY SIDE. Toward its sides and both its ends the water does not fade: there is less and less of it (the
  // threshold rises), so ropes and knots end one by one, each at its own place. The sides wander by metres as the water
  // runs and by a quarter of the width over a metre; the ropes end at different heights.
  float acw = ac + 0.25*(smNoise(vec2(run*0.9, xw*0.7 + 3.0)) - 0.5) + 0.12*(smNoise(vec2(run*2.3 + 7.0, xw*1.9)) - 0.5);
  float side = smoothstep(0.08, 0.3 + 0.1*smNoise(vec2(run*0.17, 7.0 + wS)), acw)*(1.0 - smoothstep(0.66 - 0.12*smNoise(vec2(run*0.23, 31.0 + wS)), 0.92, acw));
  float fadeUp = smoothstep(-5.0, -2.6, bm + 1.6*(n1 - 0.5) + 0.8*(n2 - 0.5));
  float fadeDn = 1.0 - smoothstep(9.5, 17.5, bm + 5.0*(n1 - 0.5) + 7.0*(smNoise(vec2(sx*1.3, 5.0)) - 0.5));      // (sx carries wS)
  thr += 0.55*(1.0 - side) + 0.5*(1.0 - fadeUp) + 0.62*(1.0 - fadeDn);
  // (and none of it on the lip's climb: left of the notch it pours through, the lip rises four metres in a metre and a
  // half, and water does not run up that; knots drawn there stood over the fall as a pale patch of their own)
  thr += 0.8*(1.0 - smoothstep(-11.9, -10.9, xm + 0.5*(n2 - 0.5)));
  float aw = clamp(1.2*fwidth(body), 0.004, 0.12);              // an edge as sharp as the pixel allows, at any range
  float cov = smoothstep(thr - aw, thr + aw, body);
  cov *= smoothstep(0.0, 0.03, ac)*(1.0 - smoothstep(0.97, 1.0, ac))*(1.0 - smoothstep(22.5, 24.0, bm))*smoothstep(-5.0, -4.6, bm);      // (nothing is left by the mesh's own border)
  if (cov < 0.004) discard;
  // form: each knot and rope is brightest on its crown and blue-shadowed at its edge; the welt on the lip is the brightest
  float crown = smoothstep(thr - 0.01, thr + 0.13, body);
  vec3 foam = (uSnow*0.4 + uTurq*0.4 + uPortalCol*0.12)*min(uFoamTint, vec3(1.0))*0.9;
  vec3 shade = (uElectric*0.2 + cobD*0.16 + uTurq*0.08)*min(uFoamTint, vec3(1.0));
  vec3 col = mix(shade, foam, crown*mix(0.62 + 0.38*clamp(vHump, 0.0, 1.0), 0.86, fallK)*(0.72 + 0.28*n3));
  col *= 0.74 + 0.2*f0 + 0.2*f1 + 0.12*f2;                      // (wet cyan-white with form: fibres and knots, not paper)
  col *= 1.0 - 0.3*smoothstep(10.0, 21.0, bm);                  // it dims as it drops into the dark
  col += uPortalCol*uPortalI*0.1*(0.3 + 0.7*crown)/(1.0 + dot(vPL, vPL)/2600.0);
  cov *= smoothstep(1.2, 3.0, dc);                              // (do not slap the lens)
  gl_FragColor = vec4(smFog(col, vP.y, dc)*cov, cov);
}`;function Kt(e){const r=[],b=e.cd;for(let l=-5;l<-1.61;l+=.85)r.push(l);for(let l=-1.6;l<2.39;l+=.4)r.push(l);for(let l=2.4;l<=24.01;l+=.8)r.push(l);const h=r.length-1,y=45*(h+1),f=new Float32Array(y*3),s=new Float32Array(y*4),n=new Float32Array(y*3);for(let l=0;l<=h;l++){const a=r[l];for(let x=0;x<=44;x++){const c=x/44,m=O(-12.8,-5.6,c),z=l*45+x,u=b-.8-Le(m),k=e.nearZ(m,u);let v=-m,A=ne(u)-k;const R=Math.hypot(v,A)||1;v/=R,A/=R;let C,N,P;if(a<=0){const p=u+a*j;C=m,N=-p,P=e.nearZ(m,p)}else{const p=Math.max(a-.8,0),M=12*(1-Math.exp(-p*p*.013)),S=(c-.5)*.14*a;C=m+S-.9*M,N=-u-a*j-.008*a*a,P=k-a*se-.436*M}const T=.7;f[z*3]=C+v*T*.94,f[z*3+1]=N+T*.34,f[z*3+2]=P+A*T*.94,s[z*4]=m,s[z*4+1]=a,s[z*4+2]=c,s[z*4+3]=0,n[z*3]=v*.94,n[z*3+1]=.34,n[z*3+2]=A*.94}}const d=new o.BufferGeometry;return d.setAttribute("position",new o.BufferAttribute(f,3)),d.setAttribute("aC",new o.BufferAttribute(s,4)),d.setAttribute("aN",new o.BufferAttribute(n,3)),d.setIndex(new o.BufferAttribute(Xe(44,h,!1),1)),d}const ge=11,Ut=`
attribute vec4 aSeed;
varying vec2 vUv; varying vec4 vSeed; varying vec3 vW; varying vec3 vP; varying float vA; varying float vPh; varying vec3 vSunV; varying vec3 vPL; varying vec4 vOv;
uniform float uTime, uPlumeH, uLean, uPx, uPlumeSide; uniform vec3 uSun, uPortalPos; uniform vec4 uMouth; uniform vec2 uCd;
#include <common>
#include <fog_pars_vertex>
void main(){
  vec3 c; float size, alpha, ph = 0.0;
  vOv = vec4(0.0, 1.0, 0.0, 1.0);
  #if MODE == 0
    // THE PLUME IS A TOWER OF BILLOWS: ${ge} heads of vapour rise out of the mouth one after another, a dozen metres apart,
    // each a ball of puffs (aSeed.x = (which billow + how far out from its centre) / ${ge}; aSeed.w = where on the head,
    // crown to belly). A head swells as it climbs, steps a little to one side or the other of the leaning axis, and
    // stands on the crown of the one below; its puffs breathe and sway on it. The puffs are drawn belly first and crown
    // last (makeSprites), so the crown of each head lies over the belly of the head above: from the river the column is
    // three or four stacked lumps, each bright on its crown with a hollow beneath, never one even band. A seventh of
    // the puffs are wisps, larger and thinner: half are flung past the head and feather its outline into the sky, half
    // hang in the neck between two heads.
    float bi = floor(aSeed.x*${ge}.0), be = fract(aSeed.x*${ge}.0);
    float b1 = fract(bi*0.618 + 0.21), b2 = fract(bi*0.382 + 0.63);
    ph = fract((bi + 0.6*b1)/${ge}.0 + uTime*0.034);      // (irregular spacing: never a string of evenly spaced beads)
    float hb = pow(ph, 1.35)*(uPlumeH + 12.0) - 12.0;      // (closer together and slower where they leave the mouth: the foot is a solid column)
    float hh = max(hb, 0.0), hp = hh/uPlumeH;
    // ONE PLUME FOR EVERY EYE, shaped by height above the mouth alone: a jet where it leaves the hole, 7 m wide and
    // dense, so it stands on the hole as a column and the far wall's crescent shows beside it; it swells to its girth in
    // the first 25 m and goes on widening as it climbs, to the brief's 30 to 45 m across at the top. Its heads are of
    // unequal size, two to one, and each steps further to one side of the leaning axis the higher it stands, so the
    // tower's outline keeps its notches; lilac vapour fills every neck.
    float Rb = (3.4 + 3.6*(1.0 - exp(-hh/12.0)) + 0.11*hh)*(0.6 + 0.72*b2);
    vec3 bc = vec3(uLean*(2.0 + 26.0*pow(hp, 1.2)) + (b1 - 0.5)*(3.2 + 0.11*hh) + 1.2*sin(uTime*0.27 + bi*2.4)*hp, hb, uMouth.x - 2.0 - 4.0*hp + (b2 - 0.5)*3.0);
    float pth = acos(clamp(mix(1.0, -0.6, pow(aSeed.w, 0.85)), -1.0, 1.0)) + 0.16*sin(uTime*0.5 + aSeed.w*40.0), ang = aSeed.z*6.2832 + 0.22*sin(uTime*0.13 + aSeed.w*9.0);
    vec3 po = vec3(sin(pth)*cos(ang), cos(pth), sin(pth)*sin(ang));
    float wisp = step(0.8, aSeed.y), shell = mix(0.3, 1.0, sqrt(be));
    // (a head is a fifth taller than it is wide, so each stands on the crown of the one below and the tower has no gaps;
    // and half of the wisps are not flung out but hang in the NECK between two heads: the lilac vapour in the creases)
    float neck = wisp*step(0.25, fract(aSeed.w*7.0));      // (three in four: lilac vapour fills every neck; the rest feather the outline)
    po = normalize(mix(po, vec3(0.5*cos(ang), -1.0, 0.5*sin(ang)), neck));
    c = bc + po*vec3(1.0, 1.25, 0.9)*Rb*mix(shell*(1.0 + 0.5*wisp), 0.55 + 0.75*be, neck);      // (neck wisps hang from the belly to the crown below)
    size = Rb*(0.4 + 0.3*aSeed.y)*(1.0 + 0.25*wisp + 0.2*neck);
    float lowFade = smoothstep(-9.0, -1.5, c.y);               // thin deep inside the mouth; solid from just under the rim up: it stands in the hole
    alpha = smoothstep(0.0, 0.07, ph)*(1.0 - smoothstep(0.74, 1.0, ph))*mix(0.86 + 0.14*sin(uTime*0.7 + aSeed.z*30.0), 0.98, neck)*0.94*lowFade*(1.0 - 0.62*wisp*(1.0 - neck));
    vOv = vec4(mat3(viewMatrix)*mat3(modelMatrix)*po, shell);
  #elif MODE == 1
    // mist hanging in the shaft, breathing slowly
    float Dm = mix(16.0, 236.0, aSeed.x) + 5.0*sin(uTime*0.11 + aSeed.y*30.0);
    float am = aSeed.z*6.2832; float rm = 2.0 + 7.0*aSeed.w;
    float bz = sin(am)*rm; bz = bz > 0.0 ? bz*0.5 : bz;
    c = vec3(cos(am)*rm + 0.8*sin(uTime*0.07 + aSeed.w*20.0), -Dm, ${Se.toFixed(4)} - Dm*${ue.toFixed(5)} + bz);
    size = 8.0 + 7.0*aSeed.y; alpha = 0.16 + 0.1*aSeed.w;
  #elif MODE == 3
    // MIST ROLLING OUT OF THE CONDUIT. A third of the puffs sit on the lip where the water goes over. The rest are born a
    // metre or two inside the mouth under the lip, roll out and climb 12 to 30 m up the shaft along the left wall,
    // swelling and thinning: a pale breath standing off the wall over the conduit, which tells from far above where the
    // water is going. None is drawn within 14 m of the lens (it would be a smear).
    float pm = fract(aSeed.x + uTime*(0.035 + 0.02*aSeed.y));
    float onLip = step(0.66, aSeed.y);
    float mx = mix(-12.0, -6.6, aSeed.z);
    float Dc = uCd.x - ${Ve("mx")} + mix(0.5 + 2.5*aSeed.w, -0.5 + 1.5*aSeed.w, onLip);
    vec3 c0 = vec3(mx, -Dc, ${Se.toFixed(4)} - Dc*${ue.toFixed(5)} + min(8.1, sqrt(max(uCd.y*uCd.y*0.95 - mx*mx, 0.0))) - 0.8) + vec3(${$e.toFixed(4)}, 0.0, ${Ge.toFixed(4)})*1.5*(1.0 - onLip);
    float rise = 12.0 + 27.0*aSeed.y;
    vec3 roll = mix(vec3(0.5 + 1.5*aSeed.w, rise, ${ue.toFixed(5)}*rise - 1.0 - 1.5*aSeed.z), vec3(1.5 + 2.0*aSeed.w, 3.0 + 5.0*aSeed.y, -2.0 - 2.0*aSeed.z)*0.4, onLip);
    c = c0 + roll*pm + vec3(0.5*sin(uTime*0.23 + aSeed.z*30.0), 0.0, 0.4*cos(uTime*0.19 + aSeed.y*40.0));
    size = mix(mix(1.4, 6.2, pm), mix(1.1, 2.8, pm)*0.7, onLip)*(0.7 + 0.6*aSeed.w); alpha = smoothstep(0.0, 0.16, pm)*(1.0 - smoothstep(0.45, 1.0, pm))*mix(0.3, 0.2, onLip);
  #else
    // drops and small clumps falling with the camera
    float Dd = mod(aSeed.x*205.0 + uTime*(19.0 + 9.0*aSeed.y), 205.0) + 13.0;
    float ad = aSeed.z*6.2832; float rd = 1.6 + 6.4*sqrt(aSeed.w);
    float bd = sin(ad)*rd; bd = bd > 0.0 ? bd*0.75 : bd;
    c = vec3(cos(ad)*rd, -Dd, ${Se.toFixed(4)} - Dd*${ue.toFixed(5)} + bd);
    size = 0.05 + 0.13*aSeed.y*aSeed.y; alpha = 0.7;
    // every third one is a rope of spray: a soft streak a metre or two long, falling with us
    float rope = step(0.66, aSeed.w);
    size *= 1.0 + 0.9*rope;
    float slen = (0.3 + 0.6*aSeed.y)*(1.0 + 0.25*rope);
    c += vec3(0.0, -${j.toFixed(4)}, -${se.toFixed(4)})*position.y*slen;      // the quad's long axis lies down the fall line
  #endif
  vec4 wc = modelMatrix*vec4(c, 1.0);
  vec4 mv = viewMatrix*wc;
  float dist = length(mv.xyz);
  #if MODE == 2
    size = max(size, dist*uPx*1.3);                       // never thinner than ~1.6 px
    alpha *= smoothstep(0.4, 1.5, dist)*(1.0 - 0.6*rope)*mix(1.0, smoothstep(9.0, 20.0, dist), rope);      // a rope beside the lens was a smear, at 8 m a ruled hairline
  #else
    alpha *= smoothstep(size*0.25, size*1.1, dist);        // do not slap the lens
    #if MODE == 3
      alpha *= smoothstep(14.0, 30.0, dist);
    #endif
  #endif
  vUv = position.xy; vSeed = aSeed; vA = alpha; vPh = ph; vP = c;
  #if MODE == 2
    {
      vec3 fv = mat3(viewMatrix)*mat3(modelMatrix)*vec3(0.0, -${j.toFixed(4)}, -${se.toFixed(4)});
      vec2 sd = fv.xy*(-mv.z) + mv.xy*fv.z;                 // the fall line as it lies on the screen here (it points at the vanishing point)
      vec2 fd = sd/max(length(sd), 1e-4);
      mv.xy += vec2(fd.y, -fd.x)*position.x*size + fd*position.y*size;
    }
  #else
    mv.xy += position.xy*size;
  #endif
  vW = wc.xyz + (vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0])*position.x + vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1])*position.y)*size;
  #if MODE == 2
    vW = wc.xyz;
  #endif
  vSunV = normalize(mat3(viewMatrix)*mat3(modelMatrix)*uSun);
  #if MODE == 0
    {
      // the plume's key: the sun, lifted toward the zenith (a crown is bright whatever the hour) and, in a low sun, turned
      // toward left and right as the lens sees it (uPlumeSide), so the shade flank shows beside the lit one
      vec3 sT = normalize(uSun); float sl = length(sT.xz);
      vec2 sx = mix(sT.xz, vec2(sT.x < 0.0 ? -sl : sl, 0.0), 0.6*uPlumeSide);
      vSunV = normalize(mat3(viewMatrix)*mat3(modelMatrix)*vec3(sx.x, sT.y + 0.5, sx.y));
    }
  #endif
  vPL = uPortalPos - c;
  vec4 mvPosition = mv;
  gl_Position = projectionMatrix*mv;
  #include <fog_vertex>
}`,$t=`
varying vec2 vUv; varying vec4 vSeed; varying vec3 vW; varying vec3 vP; varying float vA; varying float vPh; varying vec3 vSunV; varying vec3 vPL; varying vec4 vOv;
uniform float uTime, uPortalI, uWarm, uPlumeSide, uDrift, uPlumeKnee; uniform vec3 uSun, uSunCol, uSkyCol, uSnow, uTurq, uCobalt, uElectric, uGold, uPortalCol, uPlumeTint, uPlumeShade;
#include <common>
${ke}
${Fe}
void main(){
  float r2 = dot(vUv, vUv);
  if (r2 > 1.0) discard;
  float dist = length(cameraPosition - vW);
  float D = max(-vP.y, 0.0);
  vec3 cobD = uCobalt*(1.0 + 1.5*smoothstep(70.0, 165.0, D));
  float pd2 = dot(vPL, vPL);
  vec3 portal = uPortalCol*uPortalI/(1.0 + pd2/420.0);
  #if MODE == 2
    float core = (1.0 - r2); core *= core;
    // a rope of spray is a string of falling clots, not a ruled streak
    core *= mix(1.0, smoothstep(0.3, 0.62, 0.5 + 0.5*sin(vUv.y*6.5 + vSeed.x*60.0) + 0.25*(smNoise(vec2(vUv.y*3.0 + vSeed.y*40.0, vSeed.x*9.0)) - 0.5)), step(0.66, vSeed.w));
    float day = exp(-D/60.0);
    vec3 col = (mix(uSkyCol + uSnow*0.5, mix(cobD, uTurq, 0.35)*1.5, smoothstep(40.0, 130.0, D))*(0.2 + 1.1*day)*(1.0 - 0.6*smoothstep(120.0, 240.0, D)) + portal*5.0)*(0.6 + 0.8*core);
    col += uSunCol*2.5*core*step(0.9, fract(vSeed.w*17.0))*(1.0 - step(0.66, vSeed.w))*day*(0.5 + 0.5*sin(uTime*7.0 + vSeed.x*80.0));
    gl_FragColor = vec4(smFog(col, vP.y, dist), core*vA);
  #else
    float r = sqrt(r2);
    vec2 nu = vUv*1.6 + vSeed.xy*17.0;
    float n = smFbm(nu + vec2(0.0, -uTime*0.11)) *0.65 + smNoise(nu*2.7 + uTime*0.07)*0.35;
    #if MODE == 3
      float a = (1.0 - smoothstep(0.0, 0.95, r + (0.5 - n)*0.95))*vA;      // (torn all round: a breath of mist, never a disc)
    #elif MODE == 1
      float a = (1.0 - smoothstep(0.05, 0.95, r + (0.5 - n)*0.5))*vA;
    #else
      // (a torn edge that feathers out: soft where a head meets the sky, and softer still on the wisps)
      float a = (1.0 - smoothstep(mix(0.32, 0.08, step(0.8, vSeed.y)), 0.98, r + (0.5 - n)*1.1))*vA;
    #endif
    // fake volume: a sphere normal in view space lit by the sun, blue in the shadow, never grey
    vec3 nrm = normalize(vec3(vUv*0.9 + (n - 0.5)*0.5, sqrt(max(1.0 - r2, 0.0)) + 0.25));
    float l = dot(nrm, vSunV)*0.5 + 0.5;
    #if MODE == 0
      // THREE TONES, AND ALL OF THEM A CLOUD'S. Each puff knows where it sits on its billow (vOv: the direction out from the
      // head's centre, in view space, and how near the shell it is), so the light models whole heads, not sprites: a
      // CROWN that is white to cream, a HOLLOW under it and in the creases between two heads that is lilac, a clear step
      // darker, and a SHADE flank (the side turned from the sun) that runs on through lilac into the sky's blue-violet.
      // SPRAY IS WHITE whatever the hour (the key's colour is taken most of the way to white at its own brightness: a rose
      // or amber sun does not dye a cloud of water tan); the hour shows only as a thin warm rim on the sunward lumps.
      vec3 shade = (uSnow*0.3 + uSkyCol*0.42 + uTurq*0.04)*uPlumeShade*mix(1.0, 0.9, uPlumeSide);
      vec3 s0 = mix(uSunCol, vec3(1.12), 0.45); float sM = max(s0.r, max(s0.g, s0.b));
      vec3 sunny = uSnow*0.95*mix(vec3(sM), s0, 0.22);
      vec3 lilac = mix(shade, sunny*vec3(0.9, 0.88, 1.0), 0.24);
      vec3 upV = normalize(viewMatrix[1].xyz);
      vec3 Nb = normalize(vOv.xyz*(0.3 + 0.9*vOv.w) + nrm*0.7 + vec3(1e-4, 0.0, 0.0));
      float lc = dot(Nb, vSunV)*0.5 + 0.5;
      float crown = dot(vOv.xyz, upV) + 0.4*dot(nrm, upV) + 0.35*(n - 0.5);      // where on its head (1 crown .. -0.6 belly), and the puff's own top
      float hollow = (1.0 - smoothstep(0.15, 0.85, crown))*(0.45 + 0.55*vOv.w);      // (a hollow by its height on its own head and how near the head's shell it lies: the same for every eye)
      float litK = smoothstep(0.42, 0.68, lc)*(1.0 - 0.95*hollow)*(0.5 + 0.5*smoothstep(-0.05, 0.25, vPh));
      // (the darkest tone is a third of the way from the shade to the lilac: no navy bellies, no smoky flank)
      vec3 col = mix(mix(mix(shade, lilac, 0.35), lilac, smoothstep(0.2, 0.52, lc)*(1.0 - 0.5*hollow)), sunny, litK);
      col *= (0.86 + 0.24*n)*(0.94 + 0.1*smoothstep(0.1, 0.9, crown))*(1.0 - 0.14*smoothstep(0.5, 0.95, r));
      col += mix(sunny, uGold*s0*1.25, 0.75*uWarm)*0.32*smoothstep(0.35, 0.8, r)*smoothstep(0.42, 0.7, n)*smoothstep(0.6, 0.86, lc)*(1.0 - hollow);      // the thin warm rim, sun side only
      float fsc = max(dot(normalize(vW - cameraPosition), normalize(uSun)), 0.0);
      col += mix(uGold, vec3(1.0), 0.75)*pow(fsc, 4.0)*0.3*(1.0 - a*0.5);
      // a truthful piece of rainbow: 42 degrees from the antisolar point, where the spray is
      vec3 vd = normalize(vW - cameraPosition);
      float ca = clamp(dot(vd, -normalize(uSun)), -1.0, 1.0);
      float deg = acos(ca)*57.2958;
      float tb = (deg - 40.2)/2.4;
      vec3 bow = clamp(vec3(1.5 - abs(tb*4.0 - 3.2), 1.5 - abs(tb*4.0 - 2.0), 1.5 - abs(tb*4.0 - 0.8)), 0.0, 1.0);
      col += bow*smoothstep(0.0, 0.2, tb)*(1.0 - smoothstep(0.8, 1.0, tb))*0.8*(1.0 - smoothstep(0.45, 0.9, vPh));
      // NEVER FLAT WHITE: a soft knee holds the brightest lumps under 0.9, so form shows inside the lit flank
      col *= uPlumeTint;
      // (in a ground blizzard the knee is let out, by the drift alone: the tower stands in bright gold murk and must not be
      // darker than the haze behind it)
      float kTop = uPlumeKnee + 0.45*smoothstep(1.4, 2.4, uDrift);
      float cm = max(col.r, max(col.g, col.b)), ck = cm > 0.6 ? 0.6 + kTop*(1.0 - exp(-(cm - 0.6)/kTop)) : cm;
      col *= ck/max(cm, 1e-3);
      // (its haze is the air's: the fog that lies between the eye and the plume, as on everything else (smFog); nothing
      // else in the plume reads how far the eye is)
      gl_FragColor = vec4(smFog(col, max(vP.y, 0.0), dist), a);
    #else
      float day = exp(-D/60.0);
      vec3 col = mix(uSkyCol*0.8 + uSnow*0.3, cobD*1.5, smoothstep(30.0, 120.0, D))*(0.12 + 0.9*day)*(1.0 - smoothstep(130.0, 240.0, D))*(0.6 + 0.6*l);
      // (the mist in the deep reach catches the ring's light from 60 m above it)
      col += uPortalCol*uPortalI*0.5/(1.0 + pd2/1100.0)*(0.7 + 0.5*l);
      #if MODE == 3
        // pale against the indigo wall and the ink throat: spray, lit by what daylight is left and by the ring
        col = (uTurq*0.2 + uSnow*0.16 + uElectric*0.12 + uPortalCol*0.08)*(0.5 + 0.6*l)*(0.8 + 0.4*n);
      #endif
      gl_FragColor = vec4(smFog(col, vP.y, dist), a);
    #endif
  #endif
}`,Gt=`
attribute vec4 aT; attribute float aK;
varying vec4 vT; varying vec3 vP; varying vec3 vW; varying vec3 vPL; varying float vK;
uniform vec3 uPortalPos;
#include <common>
#include <fog_pars_vertex>
void main(){
  vT = aT; vK = aK; vP = position; vPL = uPortalPos - position;
  vec4 wp = modelMatrix*vec4(position, 1.0); vW = wp.xyz;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Vt=`
varying vec4 vT; varying vec3 vP; varying vec3 vW; varying vec3 vPL; varying float vK;
uniform float uTime, uPortalI; uniform vec3 uSkyCol, uSnow, uTurq, uCobalt, uElectric, uPortalCol, uFoamTint;
#include <common>
${ke}
${Fe}
// a thin side strand: it wanders, swells and thins, and is broken into lengths that taper at both ends
float smStrand(float x, float D, float run, float id, float seed, float c0){
  // (a fast sideways wander and short lengths: seen close it is torn water, never a ruled hairline)
  float cx = c0 + (id - 0.5)*0.9 + 0.3*(smNoise(vec2(D*0.09 + id*7.3, seed*31.0)) - 0.5)*2.0 + 0.1*sin(run*0.21 + id*2.0) + 0.25*(smNoise(vec2(D*0.6 + id*3.1, seed*13.0)) - 0.5);
  float gate = smoothstep(0.5, 0.7, smNoise(vec2(id*5.1 + seed*17.0, run*0.16)));
  float w = (0.07 + 0.11*smNoise(vec2(run*0.034 + id*3.0, seed*9.0)))*(0.35 + 0.65*gate);
  return (1.0 - smoothstep(w*0.3, w, abs(x - cx)))*gate;
}
void main(){
  float x = vT.x, D = vT.y, sd = vT.z;
  vec3 cobD = uCobalt*(1.0 + 1.5*smoothstep(70.0, 165.0, D));
  float run = D - uTime*27.0;
  float aa = fwidth(x), lodR = 1.0 - smoothstep(0.3, 1.0, fwidth(run)*0.2), nearK = 1.0 - smoothstep(0.07, 0.22, aa);
  float dc = length(cameraPosition - vW);
  // which fall of the chain, and how far down it (lf 0 .. 0.09 is the ledge's top, 0.09 its lip)
  float seg = floor(vT.w), lf = vT.w - seg;
  float h1 = smHash(vec2(seg*1.7 + 3.0, sd*91.0)), h2 = smHash(vec2(seg*2.3 + 11.0, sd*53.0)), h3 = smHash(vec2(seg + 29.0, sd*37.0));
  float len = 0.34 + 0.24*h1;                                    // this fall's length as a share of the ledge spacing: 5 to 9 m
  float wet = step(0.12, h3);                                   // now and then the water runs behind a ledge
  float q = clamp((lf - 0.09)/(len - 0.09), 0.0, 1.0);          // 0 at the lip, 1 where the fall has blown out
  float tail = smoothstep(0.05, 0.1, lf)*(1.0 - smoothstep(len*0.55, len, lf));
  // THE ROPE of one fall: it leaves the ledge at its own place across the flute, wanders as it drops, thins to a third,
  // has ragged edges, and is torn into lumps and then into drops. Never drawn thinner than two pixels (it fades instead).
  float c0 = (h2 - 0.5)*0.9;
  float cx = c0 + 0.24*(smNoise(vec2(D*0.2, sd*31.0)) - 0.5)*2.0 + 0.08*sin(D*0.7 + sd*40.0);
  float w = (0.3 + 0.22*smNoise(vec2(run*0.055, sd*9.0)))*mix(1.0, 0.38, q), wm = max(w, aa*2.0);
  float xr = x - cx + 0.14*(smNoise(vec2(x*3.0 + sd*5.0, run*0.11)) - 0.5)*nearK;
  float body = 1.0 - smoothstep(wm*0.4, wm, abs(xr));
  float lumpN = 0.62*smNoise(vec2(sd*9.0, run*0.13)) + 0.38*mix(smNoise(vec2(sd*3.0 + 7.0, run*0.27)), smNoise(vec2(x*2.6 + sd, run*0.2)), nearK);
  float lump = smoothstep(0.14 + 0.42*q, 0.36 + 0.42*q, lumpN);
  float fib = mix(0.8, 0.66 + 0.34*smNoise(vec2(x*9.0 + sd*31.0, run*0.9)), lodR*nearK);      // short lengths: long fibres were ruled hairlines beside the lens
  float rope = body*lump*fib*(w/wm)*tail;
  // THE KNOT: where the water strikes the ledge it bursts white, boiling: 1 to 1.8 m wide (half the flute) and about
  // 1.6 m high, its own size in metres at every range; a little spray stands over it
  float dk = (lf - 0.055)/0.05, up = exp(-(1.0 - lf)/0.035);
  float boil = 0.5 + 0.5*smNoise(vec2(x*4.0 + sd*3.0 + seg, uTime*2.6 + lf*30.0));
  float knot = (exp(-dk*dk) + 0.45*up)*(1.0 - smoothstep(0.15, 0.4 + 0.16*boil, abs(x - c0*0.7)))*(0.5 + 0.5*boil);      // a burst, not a cloud
  // near the eye: two thin strands beside the rope, a torn veil of spray, and beads flung clear
  float st = max(smStrand(x, D, run + 37.0, 0.0, sd, c0), smStrand(x, D, run + 91.0, 1.0, sd, c0))*nearK*lump;
  float veil = exp(-xr*xr*5.0)*smoothstep(0.45, 0.8, smNoise(vec2(x*2.6 + sd*13.0, run*0.09)))*0.16*lump;
  // (beads are drops a hand long, one to a cell 0.43 m long down the fall and 0.25 to 0.3 m across it: two metres long,
  // they were ruled pale hairlines)
  vec2 bc = vec2(x*5.0 + sd*7.0, run*2.3); float bh = smHash(floor(bc)); vec2 bo = (smHash2(floor(bc) + 3.0) - 0.5)*0.5;
  // (a bead is drawn only where its cell is a dozen pixels across: smaller, they were a patch of pixel stipple)
  float bead = step(0.9 - 0.12*q, bh)*(1.0 - smoothstep(0.08, 0.16 + 0.2*bh, length(fract(bc) - 0.5 - bo)))*lodR*nearK*(1.0 - smoothstep(0.05, 0.11, max(fwidth(bc.x), fwidth(bc.y))));
  float a = clamp(rope*0.95 + min(knot*0.9, 0.5) + (st*0.35 + veil + bead*0.7)*tail, 0.0, 1.0)*(1.0 - smoothstep(0.78, 1.0, abs(x)))*wet;
  a *= smoothstep(12.0, 34.0, D)*(1.0 - smoothstep(205.0, 244.0, D))*vK;      // by the water's own depth: in over 12 to 34 m, out over 205 to 244 m (vK: where its own chain runs out)
  a *= mix(0.72, 0.95, nearK)*smoothstep(7.0, 15.0, dc);      // a guard only: nothing is drawn within 7 m of the lens (a knot there was a smear)
  float day = 1.0/(1.0 + D*D/3200.0);
  vec3 deep = mix(uTurq*1.3, mix(uElectric, cobD, 0.3)*2.1, smoothstep(45.0, 125.0, D));
  // white water stays white: it keeps half as much light again below 120 m as the ice does, and takes the ring's cyan near it
  // (in the deep reach it gives two thirds of that back and turns bluer: the ring is the brightest thing in the well)
  vec3 col = (uSnow*0.8 + uSkyCol*0.2)*mix(vec3(1.0), deep, 0.3*smoothstep(14.0, 60.0, D) + 0.3*smoothstep(140.0, 210.0, D))*(0.22 + 0.72*day + 0.3*smoothstep(70.0, 125.0, D)*(1.0 - 0.65*smoothstep(150.0, 215.0, D)))*uFoamTint;
  col *= 0.8 + 0.4*fib + 0.3*lump + 0.5*knot;
  col += uPortalCol*uPortalI*0.2/(1.0 + dot(vPL, vPL)/2600.0);
  gl_FragColor = vec4(smFog(col, vP.y, dc)*a, a);
}`,jt=`
attribute vec2 aB; varying vec2 vB;
uniform vec3 uB0, uB1;
void main(){
  vec3 c = (modelMatrix*vec4(mix(uB0, uB1, aB.x), 1.0)).xyz, ax = normalize(mat3(modelMatrix)*(uB1 - uB0));
  vec3 sd = cross(ax, cameraPosition - c); sd = sd/max(length(sd), 1e-4);
  vB = aB;
  gl_Position = projectionMatrix*viewMatrix*vec4(c + sd*aB.y*mix(5.2, 2.6, aB.x), 1.0);
}`,Xt=`
varying vec2 vB;
uniform float uTime, uWarm, uBeamA; uniform vec3 uGold, uSunCol, uSkyCol, uSnow;
${ke}
void main(){
  float x = vB.y, t = vB.x;
  float prof = exp(-x*x*3.2)*(1.0 - smoothstep(0.75, 1.0, abs(x)));
  float lanes = smoothstep(0.3, 0.72, smNoise(vec2(x*2.6 + 3.0 + 0.3*sin(uTime*0.11), t*1.3 + uTime*0.012)))*0.7 + 0.3*smNoise(vec2(x*6.5 + uTime*0.05, t*3.0));
  float dust = 0.75 + 0.5*smNoise(vec2(x*5.0 + 11.0, t*42.0 - uTime*0.7));
  lanes = mix(lanes, 0.6, smoothstep(0.1, 0.35, t));      // (rays only where it enters: further down it is one soft slant, never a ruled ray)
  float a = prof*(0.3 + 0.7*lanes)*dust*smoothstep(0.02, 0.3, t)*(1.0 - smoothstep(0.5, 0.97, t))*uBeamA*(0.45 + 0.55*smoothstep(0.3, 0.7, uWarm));
  float wK = smoothstep(0.3, 0.7, uWarm);
  vec3 col = mix(uSkyCol*0.5 + uSnow*0.3, mix(uGold, uGold*uSunCol/max(max(uSunCol.r, max(uSunCol.g, uSunCol.b)), 1e-3), 0.3)*vec3(1.35, 1.0, 0.7), wK);
  gl_FragColor = vec4(col*a, a*mix(0.2, 0.75, wK));      // (laid over the aqua behind it as well as added: gold on pale blue only whitens)
}`;function Yt(e,t,i,w,r){const b=e.attributes.position,h=e.attributes.aSurf,y=pe*ie+1,f=b.count/y,s=[],n=[],d=[],l=[],a=ie+1;let x=0;for(;x<f-1&&-h.getY(x*y)<30;)x++;for(const[m,z]of t){let u=9,k=0;for(let p=0;p<pe;p++){const M=x*y+p*ie+2,S=Math.atan2(b.getZ(M)-ne(30),b.getX(M)),I=Math.abs(Math.atan2(Math.sin(S-m*me),Math.cos(S-m*me)));I<u&&(u=I,k=p)}const v=O(w[k],w[k+1],.5),A=Math.cos(v),R=Math.sin(v),C=8*r.n2(A*1.1+31,R*1.1)+4*r.n2(A*2.9,R*2.9+13),N=s.length/3,P=i();let T=0;for(let p=0;p<f;p++){const M=-h.getY(p*y);if(!(M<9||M>z-4)){for(let S=0;S<a;S++){const I=p*y+k*ie+S,L=b.getX(I),_=b.getZ(I),D=-L,U=ne(M)-_,$=Math.hypot(D,U)||1;s.push(L+D/$*.34,b.getY(I)+.12,_+U/$*.34),n.push(S/(a-1)*2-1,M,P,(M+C)/16.5+40),d.push(1-F(z-36,z-6,M))}T++}}for(let p=0;p<T-1;p++)for(let M=0;M<a-1;M++){const S=N+p*a+M,I=S+1,L=S+a,_=L+1;l.push(S,L,I,I,L,_)}}const c=new o.BufferGeometry;return c.setAttribute("position",new o.Float32BufferAttribute(s,3)),c.setAttribute("aT",new o.Float32BufferAttribute(n,4)),c.setAttribute("aK",new o.Float32BufferAttribute(d,1)),c.setIndex(l),c}function Ue(e,t,i,w,r={}){const b=new o.InstancedBufferGeometry;b.setAttribute("position",new o.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),b.setIndex([0,1,2,0,2,3]);let h=new Float32Array(i*4);for(let s=0;s<i*4;s++)h[s]=w();if(t===0)for(let s=0;s<i;s++)h[s*4]=(s+w())/i;if(t===0){const s=r.puffs||i,n=Ze(h[1]*40+h[2]),d=[];for(let l=0;l<s;l++){const a=be(n(),.002,.998),x=n(),c=n(),m=n();d.push([(l%ge+a)/ge,x,c,m,O(1,-.6,Math.pow(m,.85))+.5*Math.sin(c*6.2832)*O(.3,1,Math.sqrt(a))-(x>.8?2:0)])}d.sort((l,a)=>l[4]-a[4]),h=new Float32Array(s*4),d.forEach((l,a)=>h.set(l.slice(0,4),a*4)),i=s,r=Object.assign({},r),delete r.puffs}b.setAttribute("aSeed",new o.InstancedBufferAttribute(h,4)),b.instanceCount=i;const y=new o.ShaderMaterial({defines:{MODE:t},fog:!0,transparent:!0,depthWrite:!1,blending:t===2?o.AdditiveBlending:o.NormalBlending,uniforms:Object.assign({},o.UniformsUtils.clone(o.UniformsLib.fog),e,r),vertexShader:Ut,fragmentShader:$t}),f=new o.Mesh(b,y);return f.frustumCulled=!1,f}const wt=2.4,bt=2.4,xt=1.7,gt=3.2,yt=1.2,Zt=.52,Re=e=>e.toFixed(2),St=`
attribute vec4 aRib;     // u along the wind 0..1, v along the rim (m), seed, strength (1 when the geometry carries only three)
varying vec4 vRib; varying vec3 vW; varying vec3 vP;
uniform float uTime, uDriftH, uDrift;
#include <common>
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  {
    // STREAMERS IN A GROUND BLIZZARD (aRib.y < -900): the wind takes each one as it falls, so it leans out into the slot
    // by 2.4 to 4.8 m at its tail and curls, each to its own measure: a comma blown across the slot, never a straight thread
    // (SW_*: the same numbers driftCurtainSteps measures every streamer's body by, so that it keeps clear of the route)
    float blzV = smoothstep(1.4, 2.4, uDrift)*step(aRib.y, -900.0), uw = max(aRib.x - 0.2, 0.0)/0.8;
    p.x += blzV*((${Re(wt)} + ${Re(bt)}*fract(aRib.z*7.3))*pow(uw, 1.4) + ${Re(xt)}*uw*sin(uTime*0.9 + aRib.z*40.0 + uw*5.5));      // (it bends like a comma, from the lip on)
    p.z += blzV*${Re(gt)}*uw*uw*sin(aRib.z*23.0 + 1.0);
    p.y += blzV*${Re(yt)}*uw*uw*(1.0 + sin(aRib.z*31.0));          // (and its tail lifts on the wind instead of hanging plumb)
  }
  p.y += uDriftH*sin(3.14159*min(aRib.x*1.25, 1.0));        // a ground blizzard stands taller over the rims
  // and its ribbons hang further down the windward wall (the ribbons only: a streamer is blown out, never dragged down
  // toward the route; its fall is what driftCurtainSteps measured)
  p.y -= uDriftH*2.2*step(aRib.y, 0.0)*step(-900.0, aRib.y)*pow(max(aRib.x - 0.5, 0.0)*2.0, 1.5);
  p.y += (0.3*sin(uTime*1.9 + aRib.y*0.23 + aRib.x*5.0) + 0.22*sin(uTime*3.1 + aRib.y*0.61))*aRib.x;
  vRib = aRib; vP = p;
  vec4 wp = modelMatrix*vec4(p, 1.0); vW = wp.xyz;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Tt=`
varying vec4 vRib; varying vec3 vW; varying vec3 vP;
uniform float uTime, uDrift, uWarm, uVeil; uniform vec3 uGold, uSunCol, uSnow;
#include <common>
${ke}
${Fe}
void main(){
  float u = vRib.x, v = vRib.y;
  float lodv = 1.0 - smoothstep(0.25, 1.0, fwidth(v)*1.6);
  float gust = smoothstep(0.25, 0.75, smNoise(vec2(v*0.035 + vRib.z, uTime*0.22 - u*0.6)));
  float n1 = smNoise(vec2(u*3.2 - uTime*1.3, v*0.42 + vRib.z*9.0));
  float n2 = mix(0.5, smNoise(vec2(u*11.0 - uTime*3.4, v*1.6 + vRib.z*3.0)), lodv);
  float a = smoothstep(0.3, 0.9, n1*0.65 + n2*0.5)*(0.15 + 0.85*gust);
  // v < 0 marks the windward ribbons, whose sagging end shows against the wall: in a blizzard it stays thick to the end
  float hang = smoothstep(1.4, 2.4, uDrift)*step(v, 0.0);
  // (in a ground blizzard the hanging end is a veil that thins to nothing over its lowest third, well above the water)
  a *= smoothstep(0.0, 0.12, u)*(1.0 - smoothstep(mix(0.6, 0.88, step(v, -900.0)*0.6), mix(1.0, 0.94, hang), u));
  a = min(a*uDrift, 1.3);
  float dist = length(cameraPosition - vW);
  {
    // a hanging ribbon seen edge-on (the eye looking along the sheet where it sags into the slot) must not add up to a
    // ruled pillar: in a ground blizzard it thins as it turns its edge to the lens
    vec3 rdx = dFdx(vW), rdy = dFdy(vW), rn = cross(rdx, rdy);
    float face = abs(dot(rn/max(length(rn), 1e-6), (cameraPosition - vW)/max(dist, 1e-3)));
    a *= mix(1.0, 0.05 + 0.95*smoothstep(0.1, 0.62, face), hang);
  }
  a *= smoothstep(1.0, 5.0, dist);
  float cur = step(v, -900.0);
  a *= mix(vRib.w, 1.0, cur);      // ribbons: the fourth component fades them out (the world: over its snow bridges); 1 when the geometry carries three
  // (and it pales from gold to snow as it falls: a pale gold veil, never a tan pillar from rim to water)
  vec3 col = (mix(uSnow*uSunCol*0.8, mix(uGold*uSunCol*1.3, uSnow*uSunCol*0.9 + uGold*0.12, hang*smoothstep(0.4, 0.85, u)), uWarm) + uSnow*0.15)*a;
  // laid over what is behind it, not only added: a lit veil shows against the bright sky of the slot as well as the walls
  float fd = 1.0 - smoothstep(600.0, 1500.0, dist);
  // (a thin veil on an ordinary day, so the sky of the slot stays clean; a thick one in a ground blizzard)
  float thick = smoothstep(1.4, 2.4, uDrift);
  float vk = mix(1.0, uVeil, step(v, 0.0)*(1.0 - thick));      // uVeil > 1: the windward ribbons of this mesh are laid on thicker
  // v < -900 marks the CURTAINS: veils of snow smoke that pour off the windward cornice and hang across the slot, facing
  // the eye that looks down the canyon (the ribbons along the rims are seen edge-on from the water). vRib.w fades their
  // upper and lower edges. They are laid on at one strength whatever the weather, so a blizzard does not wall the slot up.
  // (in a warm low sun they are laid on twice as strong: gold curtains across the upper third of the slot)
  // (and in amber rather than pale gold: they hang in front of the white plume and must read against it)
  // STREAMERS: each is combed by the wind into threads that run with it over the cornice lip and pour down the wall,
  // dense and bright at the lip, torn to nothing at the tail. They are laid over the wall, not added to it (gold added
  // to blue ice is only a pale glow): in a warm low sun each is a gold drape on the blue shadow wall. A streamer thins
  // along its own length and is the same for every eye; only within 4 to 11 m of the lens does it fade, and that fade
  // acts on every pass: by the rule of the place the streamers hang 4.5 to 6.3 m from the route's line, none nearer
  // (driftCurtainSteps).
  // (v runs 0..9 across a streamer; its streaks are drawn along the flow, so near and far they stay combed threads)
  // (and never a bar with ruled edges: the whole veil wavers sideways as it falls, by up to a third of its width, its
  // two edges are torn by the same gusts, more and more toward the tail, and its body is thin enough to see the wall through)
  float vv0 = fract(-v/40.0)*40.0;                                  // 0..9 across this streamer's own strip
  float wander = (smNoise(vec2(u*2.3 - uTime*0.45, vRib.z*29.0 + 3.0)) - 0.5)*smoothstep(0.12, 0.7, u);
  // (in a ground blizzard every streamer leans and curls downwind as it falls: no straight vertical thread)
  float blz = smoothstep(1.4, 2.4, uDrift);
  float vv = vv0 + 5.5*wander - blz*(3.4*u*u + 1.3*u*sin(u*5.5 - uTime*0.7 + vRib.z*40.0));
  // (and its tail frays: a second sideways gust that differs across the strip, so its two edges never stay parallel)
  vv += blz*3.0*(smNoise(vec2(u*3.1 + vRib.z*11.0, vv0*0.45 - uTime*0.3)) - 0.5)*smoothstep(0.3, 1.0, u);
  float comb = 0.62*smNoise(vec2(u*2.4 - uTime*1.0, vv*0.8 + vRib.z*17.0)) + 0.38*smNoise(vec2(u*6.5 - uTime*2.3, vv*2.3 + vRib.z*5.0));
  float tailK = smoothstep(0.35, 1.0, u);                           // from a third of the way down the streamer is torn into threads, and then gone
  float strk = smoothstep(0.2 + 0.36*tailK, 0.46 + 0.36*tailK, comb);
  float head = 1.0 - smoothstep(0.2, 0.75, u);                      // dense and bright where it leaves the cornice lip
  // a drape with a body (half opaque between its threads, the threads nearly solid), all threads at the tail
  float envS = pow(max(sin(3.14159*clamp(vv/9.0, 0.0, 1.0)), 0.0), 0.6)*smoothstep(0.0, 0.3, vRib.w);
  float torn = smoothstep(0.08, 0.5, envS - (0.2 + (0.5 + 0.25*blz)*tailK)*smNoise(vec2(u*5.0 - uTime*1.2, vv0*1.1 + vRib.z*7.0)));
  float acur = mix(0.3 + 0.5*strk, strk*0.9, tailK)*(0.8 + 0.2*gust)*smoothstep(0.0, 0.1, u)*(1.0 - smoothstep(0.86, 1.0, u))*envS*mix(1.0, torn, 0.85);
  // (in a ground blizzard each streamer is torn along its length too: two or three detached veils, not one stroke)
  acur *= mix(1.0, smoothstep(0.24, 0.5, smNoise(vec2(u*4.4 - uTime*0.4 + vRib.z*50.0, vRib.z*13.0 + vv0*0.12))), blz*smoothstep(0.12, 0.34, u));
  acur = min(acur, 1.0)*smoothstep(4.0, 11.0, dist);
  // gold in a warm low sun (a bright drape, a stop over the blue shadow wall behind it); pale snow smoke otherwise
  // (the key's colour is taken half way to white at its own brightness: a rose midnight sun still gilds them)
  vec3 sc = min(mix(uSunCol, vec3(max(uSunCol.r, max(uSunCol.g, uSunCol.b))), 0.45)*0.98, vec3(1.25));
  vec3 colS = mix(uSnow*uSunCol*0.8 + uSnow*0.15, (uGold*0.86 + vec3(0.14, 0.12, 0.04))*sc*(0.86 + 0.3*strk*head), uWarm);
  float aS = acur*mix(0.5, 0.82, uWarm);
  gl_FragColor = mix(vec4(col*mix(0.8, 1.0, thick)*fd*vk, min(min(a, 1.0)*mix(0.24, 0.8, thick)*vk, 1.0)*fd), vec4(colS*aS, aS)*fd, cur);
}`;function Qt(e,t,i,w){const r=[],b=[],h=[],y=(s,n)=>{const d=r.length/3,l=s[0].length-1;for(const a of s)for(const x of a)r.push(x[0],x[1],x[2]),b.push(x[3],x[4],n);for(let a=0;a<s.length-1;a++)for(let x=0;x<l;x++){const c=d+a*(l+1)+x,m=c+1,z=c+l+1,u=z+1;h.push(c,z,m,m,z,u)}};for(let s=0;s<2;s++){const n=s*.7,d=w(),l=[],a=[];for(let c=t;c>=2;c-=2.5){const m=[],z=[],u=Ne(c);for(let k=0;k<=7;k++){const v=k/7;m.push([-14+16.5*v,u+.8+n+.7*Math.sin(Math.PI*v*.75)-5.2*Math.pow(Math.max(v-.55,0)/.45,1.8),c,v,-(c+s*31)]),z.push([5.5+13*v,u+.9+n+1.6*v,c,v*.9,c+200+s*31])}l.push(m),a.push(z)}y(l,d),y(a,d+.37);const x=[];for(let c=0;c<=34;c++){const m=(118+c/34*150)*me,z=[],u={};for(let k=0;k<=7;k++){const v=k/7;i.point(m,0,12-17*v,0,u),z.push([u.x,.9+n+.6*Math.sin(Math.PI*v*.75)-5.5*Math.pow(Math.max(v-.55,0)/.45,1.8),u.z,v,c*2.6+400+s*31])}x.push(z)}y(x,d+.71)}const f=new o.BufferGeometry;return f.setAttribute("position",new o.Float32BufferAttribute(r,3)),f.setAttribute("aRib",new o.Float32BufferAttribute(b,3)),f.setIndex(h),f}const Jt=4.5;function*eo(e,t){const i=[],w=[],r=[],f=t.length/3,s=[],n=new Float32Array(357),d=k=>k-Math.floor(k),l=(k,v,A)=>{const R=Ne(v),C=.55+.15*Math.sin(k*3.1),N=T=>{const p=Math.max(T-.2,0)/.8;return T<.2?-7.9+3.4*(T/.2):-4.5-C*p},P=T=>{const p=Math.max(T-.2,0)/.8;return T<.2?R+1.75-.55*(T/.2)**2:R+1.2-.9*p-(A+.3)*p*p};for(let T=0,p=0;T<=6;T++)for(let M=0;M<=16;M++,p+=3){const S=M/16,I=T/6,L=N(S+.02)-N(S-.02),_=P(S+.02)-P(S-.02),D=Math.hypot(L,_)||1,U=(.9+1.9*S)*(I-.5);n[p]=N(S)+-_/D*U,n[p+1]=P(S)+L/D*U,n[p+2]=v-1.2*S*Math.sin(k*1.7+.5)+.4*Math.sin(I*3+k)}},a=.05,x=Jt+a,c=[],m={d:0},z=function*(k,v,A){l(k,v,A);const R=Math.fround(.13+k*.171),C=wt+bt*d(R*7.3),N=gt*Math.sin(R*23+1),P=yt*(1+Math.sin(R*31)),T=Ne(v);c.length=0;for(let S=0;S<f-1;S++){const I=t[S*3]+4.5,L=t[S*3+1]-T,_=t[S*3+2]-v;I*I+L*L+_*_<484&&c.push(S*3)}let p=1e12,M=1e12;for(let S=0;S<=6;S+=2)for(let I=0;I<=16;I++){const L=(S*17+I)*3,_=I/16,D=Math.max(_-.2,0)/.8,U=C*Math.pow(D,1.4),$=xt*D,re=P*D*D,ye=N*D*D;for(let le=0,Ae=D>0?8:0;le<=Ae;le++)for(let g=le>0?-2:2;g<=2;g++)for(let E=-1;E<=1;E++){const B=le/8,W=n[L]+B*(U+$*g*.5),G=n[L+1]+B*re+E*Zt*_,te=n[L+2]+B*ye;for(let V=0;V<c.length;V++){const H=c[V],Q=t[H],oe=t[H+1],J=t[H+2],Y=t[H+3]-Q,ae=t[H+4]-oe,Z=t[H+5]-J,q=W-Q,ee=G-oe,he=te-J,we=Y*Y+ae*ae+Z*Z,ce=we>0?be((q*Y+ee*ae+he*Z)/we,0,1):0,De=q-Y*ce,Pe=ee-ae*ce,qe=he-Z*ce,Be=De*De+Pe*Pe+qe*qe;Be<p&&(p=Be),le===0&&Be<M&&(M=Be)}}I%4===3&&(yield)}return m.d=Math.sqrt(M),Math.sqrt(p)};for(let k=0;k<9;k++){const v=Math.min(e-4,7+k*11.3+2.2*Math.sin(k*2.4));let A=5.9+1.2*Math.sin(k*1.9+1)+.5*Math.sin(k*4.3),R=yield*z(k,v,A);if(R<x){let P=0,T=A,p=-1,M=0;for(let S=0;S<8;S++){const I=(P+T)/2,L=yield*z(k,v,I);L>=x?(P=I,p=L,M=m.d):T=I}A=P,p<0?p=yield*z(k,v,0):m.d=M,R=p}l(k,v,A),s.push({z:v,fall:1.2+A,near:R,calm:m.d});const C=i.length/3,N=.13+k*.171;for(let P=0,T=0;P<=6;P++)for(let p=0;p<=16;p++,T+=3){const M=p/16,S=P/6;i.push(n[T],n[T+1],n[T+2]),w.push(M,-(1e3+k*40+S*9),N,Math.pow(Math.sin(Math.PI*S),.6))}for(let P=0;P<6;P++)for(let T=0;T<16;T++){const p=C+P*17+T,M=p+1,S=p+16+1,I=S+1;r.push(p,S,M,M,S,I)}yield}const u=new o.BufferGeometry;return u.setAttribute("position",new o.Float32BufferAttribute(i,3)),u.setAttribute("aRib",new o.Float32BufferAttribute(w,4)),u.setIndex(r),u.userData.streamers=s,u}function to(e){const t=[];for(let w=0;w<e.length-1;w++){const r=e[w],b=e[w+1],h=Math.max(1,Math.ceil(r.distanceTo(b)));for(let y=0;y<h;y++)t.push(O(r.x,b.x,y/h),O(r.y,b.y,y/h),O(r.z,b.z,y/h))}const i=e[e.length-1];return t.push(i.x,i.y,i.z),new Float32Array(t)}function kt(e){const i=[0,.1,.3,.55,.8,.95,1],w=[],r=[],b=[],h=[];for(let f=0;f<i.length;f++){const s=i[f],n=Math.pow(1-s,.75)*(1+.22*Math.sin(s*9+1))+.05;for(let d=0;d<=5;d++){const l=d/5*Math.PI*2;w.push(Math.cos(l)*n+.12*Math.sin(s*5),-s,Math.sin(l)*n),r.push(d/5*.6,s*1.4),b.push(.75+.25*s,0,0)}}for(let f=0;f<i.length-1;f++)for(let s=0;s<5;s++){const n=f*6+s,d=n+1,l=n+5+1,a=l+1;h.push(n,d,l,d,a,l)}const y=new o.BufferGeometry;return y.setAttribute("position",new o.Float32BufferAttribute(w,3)),y.setAttribute("aSurf",new o.Float32BufferAttribute(r,2)),y.setAttribute("aIce",new o.Float32BufferAttribute(b,3)),y.setIndex(h),y.computeVertexNormals(),y}function oo(e,t,i,w){const r=new o.IcosahedronGeometry(1,2);r.deleteAttribute("uv"),r.deleteAttribute("normal");const b=zt(r,1e-4),h=b.attributes.position,y=h.count;r.dispose();const f=new o.InstancedBufferGeometry,s=new Float32Array(y*3),n=new Float32Array(y*2),d=new Float32Array(y*3);for(let a=0;a<y;a++){let x=h.getX(a),c=h.getY(a),m=h.getZ(a);const z=.8+.3*e.n3(x*1.1+3,c*1.1,m*1.1)+.12*e.n3(x*2.6,c*2.6+7,m*2.6)-.1*Math.abs(e.n3(x*1.9+11,c*1.9,m*1.9));x*=z*1.15,c*=z*.7,m*=z,s[a*3]=x,s[a*3+1]=c,s[a*3+2]=m,n[a*2]=Math.atan2(x,m)*.6+c,n[a*2+1]=c,d[a*3]=.55,d[a*3+1]=0,d[a*3+2]=2.6}f.setIndex(b.index.clone()),b.dispose(),f.setAttribute("position",new o.BufferAttribute(s,3)),f.setAttribute("aSurf",new o.BufferAttribute(n,2)),f.setAttribute("aIce",new o.BufferAttribute(d,3)),f.computeVertexNormals();const l=new Float32Array(t*4);for(let a=0;a<t;a++){const x=i()<.4;l[a*4]=(a+i()*.8)/t,l[a*4+1]=i.sign()*i.range(2.3,w),l[a*4+2]=x?i.range(.56,1):i.range(0,.54),l[a*4+3]=x?i.range(.7,1.25):i.range(.35,1.25);const c=l[a*4+1],m=l[a*4+3]*(x?1.7:1.2);x&&(l[a*4+3]*=.78),l[a*4+1]=Math.sign(c)*Math.min(Math.max(Math.abs(c),2.3+m*(x?.78:1)),w+.6)}return f.setAttribute("aSeed",new o.InstancedBufferAttribute(l,4)),f.instanceCount=t,f}function Ze(e){let t=Math.floor(e*1e4)+17;return()=>(t=t*16807%2147483647,(t&65535)/65536)}async function io(e,t={}){const i=e.rng,w=e.quality?.detail??1,r=e.noise||Pt(e.seed??1),b=t.palette&&t.palette.length>=7?t.palette:Mt,h=g=>new o.Color(g),y={electric:h(b[0]),cobalt:h(b[1]),turq:h(b[2]),snow:h(b[3]),cryo:h(b[4]),gold:h(b[5]),orange:h(b[6])},f=t.reach??113,s=t.season||i.pick(["early","peak","peak","late"]),n={rng:i,mouthX:i.range(.93,1.08),mouthZ:i.range(.92,1.08),spiral:i.sign(),lean:i.range(.7,1.25),plumeH:i.range(84,98),bandSeed:i.range(0,60),dipA:i.range(-.9,.9),cornice:s==="early"?1.5:s==="late"?.6:1,cd:be(t.conduitDepth??Nt,120,225)},d=Dt(n),l=[[0,ve(f)+.9,f],[0,ve(60)+.9,60],[0,ve(20)+.9,20],[0,-10.9,4],[0,-12.4,-7],[0,-19,-17.5],[0,-31,ne(31)-.4],...[46,100,180,Ie].map(g=>[0,-g,ne(g)])].map(g=>new o.Vector3(g[0],g[1],g[2])),a=Se-25*n.mouthZ,x=1.2;n.mouthCz=(a+x)/2;const c=(t.sunDir?t.sunDir.clone():new o.Vector3(-.8,.41,.44)).normalize(),m=new o.Vector3(0,-j,-se),z=new o.Vector3(0,-Ie,ne(Ie)),u={uTime:{value:0},uSun:{value:c},uSunCol:{value:h(t.sunColor||"#FFE6C2").multiplyScalar(1.15)},uSkyCol:{value:h(t.skyColor||"#3F7FCF").multiplyScalar(.8)},uSnow:{value:y.snow},uTurq:{value:y.turq},uCobalt:{value:y.cobalt},uElectric:{value:y.electric},uCryo:{value:y.cryo},uGold:{value:y.gold},uMauve:{value:h("#8E86A0")},uInk:{value:h(t.inkColor||"#030B22")},uPortalPos:{value:z},uPortalCol:{value:h(t.portalColor||"#A8F0FF")},uPortalI:{value:3.4},uSeason:{value:s==="early"?.4:s==="late"?.95:.62},uLate:{value:s==="late"?1:0},uBandSeed:{value:n.bandSeed},uDip:{value:new o.Vector2(Math.sin(n.dipA),Math.cos(n.dipA)).multiplyScalar(.176)},uMouth:{value:new o.Vector4(n.mouthCz,f+.5,19*n.mouthX,(x-a)/2)},uShaftFog:{value:.0058},uCamDepth:{value:0},uLitY:{value:1e5},uCd:{value:new o.Vector2(n.cd,d.Rx(n.cd))},uPlumeH:{value:n.plumeH},uLean:{value:n.lean},uPx:{value:.003},uDrift:{value:s==="early"?1.25:1},uWarm:{value:1},uFoamTint:{value:h("#ffffff")},uPlumeTint:{value:h("#ffffff")},uPlumeShade:{value:h("#ffffff")},uPlumeSide:{value:0},uPlumeKnee:{value:.3},uDriftH:{value:0},uReach:{value:f},uHump:{value:je},uUpGlow:{value:0},uPools:{value:[new o.Vector4(0,0,1,0),new o.Vector4(0,0,1,0),new o.Vector4(0,0,1,0)]},uPoolDir:{value:[new o.Vector2(0,-1),new o.Vector2(0,-1),new o.Vector2(0,-1)]}},k=e.yield?()=>e.yield():null,v=new o.Group;v.name="sapphire-moulin-hero";const A=[];for(let g=f;g>-.01;g-=.6)A.push({x:0,z:Math.max(g,0),tx:0,tz:-1,water:ve(g),rim:Ne(g),half:7});const R=g=>{const E=-g.y,B=d.fwZ(Math.max(E,0))+qt(E)-.05;g.z<B&&(g.z=B)},C=ze(u,"wall"),N=[];for(const g of[1,-1]){const E=await ft({stations:A,side:g,noise:r,sunDir:c,fadeEnd:9,clip:R,cornice:n.cornice},k),B=new o.Mesh(E,C);B.name=g>0?"wall-right":"wall-left",v.add(B),N.push(E),await e.yield?.()}const P=await He(Bt(d,n,r,w),k),T=new o.Mesh(P,ze(u,"shaft"));T.name="shaft",T.frustumCulled=!1,v.add(T),await e.yield?.();const p=new o.Mesh(new o.CircleGeometry(16,24),new o.MeshBasicMaterial({color:u.uInk.value,fog:!1}));if(p.position.set(0,-Te+.5,ne(Te)),p.rotation.x=-Math.PI/2,v.add(p),t.apron!==!1){const g=new o.Mesh(Wt(n,260,r),ze(u,"apron"));g.name="apron",v.add(g),await e.yield?.()}const M=await He(_t(d,f),k);await e.yield?.();const S=new o.Mesh(M,new o.ShaderMaterial({fog:!0,uniforms:Object.assign({},o.UniformsUtils.clone(o.UniformsLib.fog),u),vertexShader:pt,fragmentShader:vt}));S.name="water",S.frustumCulled=!1,v.add(S),await e.yield?.();{const g=new o.Mesh(Kt(d),new o.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:o.DoubleSide,blending:o.CustomBlending,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor,uniforms:Object.assign({},o.UniformsUtils.clone(o.UniformsLib.fog),u),vertexShader:Ot,fragmentShader:Ht}));g.renderOrder=3.6,g.frustumCulled=!1,g.name="conduit-fall",v.add(g)}await e.yield?.();{const g=Oe.length,E=13,B=[];for(let q=0;q<2;q++){const ee=N[q].attributes.position,he=q===0?1:-1,we=-he*c.x;for(let ce=2;ce<A.length-6;ce++){const De=ce*.6*he+q*300;if(r.n2(De*.09,12)<-.15||i()>.62*w)continue;const Pe=ce*g+E,qe=Math.min(2.4,.35+Math.abs(i.gauss())*.75)*(.7+.5*Math.max(0,r.n2(De*.05,30)));B.push([ee.getX(Pe)+he*i.range(.02,.3),ee.getY(Pe)+.12,ee.getZ(Pe)+i.range(-.25,.25),qe,we>0?1:0])}}const W=P.attributes.position,G=pe*ie,te=6;for(let q=0;q<G;q++){const ee=te*(G+1)+q,he=W.getX(ee),we=W.getZ(ee);if(!(we>-6||i()>.8*w))for(let ce=0;ce<2;ce++)B.push([he+i.range(-.3,.3),W.getY(ee)+.5,we+i.range(-.3,.3),.5+Math.abs(i.gauss())*.9,we<n.mouthCz?1:0])}await e.yield?.();const V=kt(i),H=new o.InstancedMesh(V,ze(u,"icicle"),B.length),Q=new Float32Array(B.length*2),oe=new o.Matrix4,J=new o.Quaternion,Y=new o.Euler,ae=new o.Vector3,Z=new o.Vector3;B.forEach((q,ee)=>{const he=.05+.065*q[3];Y.set(i.range(-.07,.07),i.range(0,6.28),i.range(-.07,.07)),J.setFromEuler(Y),oe.compose(ae.set(q[0],q[1],q[2]),J,Z.set(he,q[3],he)),H.setMatrixAt(ee,oe),Q[ee*2]=q[4],Q[ee*2+1]=i()}),V.setAttribute("aInst",new o.InstancedBufferAttribute(Q,2)),H.instanceMatrix.needsUpdate=!0,H.frustumCulled=!1,H.name="icicles",v.add(H)}await e.yield?.();const I=(n.cd-18-de)/j;if(t.rafts!==!1){const g=Math.round((s==="early"?60:44)*w),E=new o.Mesh(oo(r,g,i,5.6),ze(u,"block",{uniforms:{uFlow:{value:new o.Vector4(f,fe,xe,I)}}}));E.frustumCulled=!1,E.name="river-ice",v.add(E)}if(await e.yield?.(),t.spindrift!==!1){const g=new o.Mesh(Qt(n,f,d,i),new o.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,blending:o.CustomBlending,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor,side:o.DoubleSide,uniforms:Object.assign({},o.UniformsUtils.clone(o.UniformsLib.fog),u,{uVeil:{value:2.4}}),vertexShader:St,fragmentShader:Tt}));g.renderOrder=3,g.frustumCulled=!1,g.name="spindrift",v.add(g),await e.yield?.();const E=new o.Mesh(await He(eo(f,t.route||to(l)),k),g.material);E.renderOrder=7,E.frustumCulled=!1,E.name="spindrift-curtains",v.add(E)}await e.yield?.();{const g=Yt(P,n.spiral>0?[[262,250],[160,250],[5,112]]:[[278,250],[20,250],[175,112]],Ze(n.bandSeed),n.fluteTh0,r),E=new o.Mesh(g,new o.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:o.DoubleSide,blending:o.CustomBlending,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8,uniforms:Object.assign({},o.UniformsUtils.clone(o.UniformsLib.fog),u),vertexShader:Gt,fragmentShader:Vt}));E.renderOrder=3.5,E.frustumCulled=!1,E.name="shaft-threads",v.add(E)}await e.yield?.();{const E=new Float32Array(174),B=new Float32Array(116),W=[];for(let Z=0;Z<=28;Z++)for(let q=0;q<2;q++)B[(Z*2+q)*2]=Z/28,B[(Z*2+q)*2+1]=q*2-1;for(let Z=0;Z<28;Z++){const q=Z*2;W.push(q,q+1,q+2,q+1,q+3,q+2)}const G=new o.BufferGeometry;G.setAttribute("position",new o.BufferAttribute(E,3)),G.setAttribute("aB",new o.BufferAttribute(B,2)),G.setIndex(W);const te=Math.hypot(c.x,c.z)||.001,V=c.x/te,H=c.z/te,Q=1/Math.hypot(V/(19*n.mouthX),H/((x-a)/2)),oe=new o.Vector3(V*Q,0,n.mouthCz+H*Q),J=oe.clone().addScaledVector(c,-2*Q/te);u.uBeamA={value:.4*F(.03,.12,c.y)};const Y=new o.Mesh(G,new o.ShaderMaterial({transparent:!0,depthWrite:!1,side:o.DoubleSide,blending:o.CustomBlending,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor,uniforms:{uTime:u.uTime,uWarm:u.uWarm,uGold:u.uGold,uSunCol:u.uSunCol,uSkyCol:u.uSkyCol,uSnow:u.uSnow,uBeamA:u.uBeamA,uB0:{value:oe},uB1:{value:J}},vertexShader:jt,fragmentShader:Xt}));Y.renderOrder=4,Y.frustumCulled=!1,Y.name="shaft-beam",v.add(Y);const ae=Ue(u,3,Math.round(26*(.5+.5*w)),Ze(n.bandSeed+3.3));ae.renderOrder=4,ae.name="conduit-mist",v.add(ae)}await e.yield?.();const L=Ue(u,1,Math.round(30*w),i);L.renderOrder=4,L.name="mist",v.add(L),await e.yield?.();const _=Ue(u,2,Math.round(320*w),i);if(_.renderOrder=5,_.name="drops",v.add(_),await e.yield?.(),t.plume!==!1){const g=Ue(u,0,Math.round(260*(.5+.5*w)),i,{puffs:ge*Math.round(50*(.5+.5*w))});g.renderOrder=6,g.name="plume",v.add(g)}await e.yield?.();const D=(g,E,B)=>new o.Vector3(g,E,B),U=g=>D(0,-g,ne(g)),$={lip:D(0,-X,0),portalSeat:{position:z.clone(),normal:m.clone().negate(),up:D(0,se,-j),radius:7},axisTop:U(0),axisDir:m.clone(),flyThrough:l,viewpoints:{canyonStart:D(0,ve(f)+.9,f),brink:D(0,-10.6,14),shaftAqua:U(40),shaftCobalt:U(95),portalApproach:U(205),plumeFar:D(60,14,420)},plumeBase:D(0,0,n.mouthCz),plumeTop:D(n.lean*22,n.plumeH,n.mouthCz-6),conduit:D(et,-(n.cd-4),d.nearZ(et,n.cd-10)),farWallCrescent:D(0,-9,a+3),mouth:{center:D(0,0,n.mouthCz),halfX:19*n.mouthX,halfZ:(x-a)/2}};let re=null;const ye=new o.Vector3,le=new o.Vector2;return{object:v,radius:150,height:100,center:D(0,10,10),anchors:$,ground:!1,groundY:0,uniforms:u,season:s,conduitDepth:n.cd,kit:{makeIceMaterial:(g,E)=>ze(u,g,E),buildCanyonWall:Rt,buildCanyonWallAsync:ft,profile:Oe,waterLevel:ve,rimLevel:Ne,shaftPoint:(g,E)=>d.point(g,E,0,0,{}),pal:y,axisZ:ne,surfaceY:mt(je),lean:ue,makeWaterMaterial:()=>new o.ShaderMaterial({fog:!0,uniforms:Object.assign({},o.UniformsUtils.clone(o.UniformsLib.fog),u),vertexShader:pt,fragmentShader:vt}),makeDriftMaterial:()=>new o.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,blending:o.CustomBlending,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor,side:o.DoubleSide,uniforms:Object.assign({},o.UniformsUtils.clone(o.UniformsLib.fog),u,{uVeil:{value:1}}),vertexShader:St,fragmentShader:Tt}),makeIcicles:(g,E=i)=>{const B=kt(E),W=new o.InstancedMesh(B,ze(u,"icicle"),g.length),G=new Float32Array(g.length*2),te=new o.Matrix4,V=new o.Quaternion,H=new o.Euler,Q=new o.Vector3,oe=new o.Vector3;return g.forEach((J,Y)=>{const ae=.05+.065*J[3];H.set(E.range(-.07,.07),E.range(0,6.28),E.range(-.07,.07)),V.setFromEuler(H),te.compose(Q.set(J[0],J[1],J[2]),V,oe.set(ae,J[3],ae)),W.setMatrixAt(Y,te),G[Y*2]=J[4],G[Y*2+1]=E()}),B.setAttribute("aInst",new o.InstancedBufferAttribute(G,2)),W.instanceMatrix.needsUpdate=!0,W.frustumCulled=!1,W.name="icicles",W}},setProgress(g){re=g==null?null:Math.max(0,g*880-585)*.9},setCameraDepth(g){re=g},update(g,E,B){u.uTime.value=E;let W=re;if(B){W==null&&(B.getWorldPosition(ye),v.worldToLocal(ye),W=Math.max(0,-ye.y)),e.renderer?.getDrawingBufferSize(le);const G=(B.fov||60)*me;u.uPx.value=2*Math.tan(G/2)/Math.max(le.y||720,1)}u.uCamDepth.value=W||0},dispose(){}}}export{Rt as buildCanyonWall,ft as buildCanyonWallAsync,io as buildHero,ut as gridNormalSteps,ze as makeIceMaterial,no as moulinRoute,Oe as profile,Ne as rimLevel,ct as runSteps,He as runStepsAsync,ve as waterLevel};
