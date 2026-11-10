import*as S from"three";const yt=Math.PI*2,Ut=Math.PI/180,Po=-4,Oe=[-800,-1100],We=800,Xe=-47*Ut,Re=[Math.sin(47*Ut),Math.cos(47*Ut)],Je=[Oe[0]+We*Math.cos(Xe),Oe[1]+We*Math.sin(Xe)],kt=480,$t=158,Bt=124,d0=84,U0={half:30,off:.4},Qt=[90,300],ct=[Je[0]-Re[0]*kt,Je[1]-Re[1]*kt],_t=[Oe[0]+672*Math.cos(-38.5*Ut),Oe[1]+672*Math.sin(-38.5*Ut)],he=(()=>{const Q=ct[0]+Re[0]*150,C=ct[1]+Re[1]*150,L=_t[0]-Q,z=_t[1]-C,I=Math.hypot(L,z);return[L/I,z/I]})(),Mt=[_t[0]+he[0]*70,_t[1]+he[1]*70],bt=21,La=20,b0=(d0-bt)/1100,zo=Q=>Q*(1.75-.75*Q),Ne=[-8,-1319],Fo=-328,St=100;function Va(Q,C){const L=Q-ct[0],z=C-ct[1],I=Math.min(kt,Math.max(0,L*Re[0]+z*Re[1])),j=Math.hypot(L-Re[0]*I,z-Re[1]*I),N=Q-Oe[0],ne=C-Oe[1],ce=Math.min(0,Math.max(Xe,Math.atan2(ne,N))),ee=Math.hypot(N-Math.cos(ce)*We,ne-Math.sin(ce)*We),Ae=Math.hypot(Q,C-Math.min(Fo,Math.max(-1100,C)));return Math.min(j,ee,Ae)}const oe=[44,-479],Ea=2,$0=213,Zt=40,Bo=12,Q0=76,Z0=60,Co=-366,Yt=48,m0=34,Ta=["#a9a498","#8fae9c","#c59a8c","#cdbd8e","#8ea6b8","#e9500f","#efe9da","#40583a","#7a4636","#6f8794"];function Lo(Q=64){const C=[],L=kt,z=We*-Xe,I=1100,j=L+z+I;for(let N=0;N<Q;N++){const ne=N/(Q-1)*j;if(ne<L){const ce=ne/L;C.push([ct[0]+Re[0]*ne,$t-($t-Bt)*zo(ce),ct[1]+Re[1]*ne])}else if(ne<L+z){const ce=(ne-L)/z,ee=Xe*(1-ce);C.push([Oe[0]+We*Math.cos(ee),Bt-(Bt-d0)*ce,Oe[1]+We*Math.sin(ee)])}else{const ce=-1100+(ne-L-z);C.push([0,bt-b0*ce,ce])}}return C}const At=Lo(72);function lt(Q,C){let L=1e18,z=0,I=0,j=1,N=0,ne=0;for(let ce=0;ce<At.length-1;ce++){const ee=At[ce],Ae=At[ce+1],G=Ae[0]-ee[0],se=Ae[2]-ee[2],ue=G*G+se*se;let U=((Q-ee[0])*G+(C-ee[2])*se)/ue;U=U<0?0:U>1?1:U;const le=ee[0]+G*U,be=ee[2]+se*U,J=(Q-le)*(Q-le)+(C-be)*(C-be);if(J<L){L=J,z=ee[1]+(Ae[1]-ee[1])*U;const Ue=Math.sqrt(ue);I=G/Ue,j=se/Ue,N=ce+U,ne=(Q-le)*j-(C-be)*I}}return{d:Math.sqrt(L),y:z,tx:I,tz:j,s:N/(At.length-1),side:ne}}const je=(Q,C,L)=>{const z=Math.min(1,Math.max(0,(L-Q)/(C-Q)));return z*z*(3-2*z)},K={a:70,h:55,slope:.97,half:50},at={laneB:69.5,houseB:74.6,treeB:66.6,a0:17,a1:106,headA:17,headB:72,headRowA:11,step:9.5};function u0(Q,C){const L=Q-Mt[0],z=C-Mt[1];return[-(L*he[0]+z*he[1]),L*he[1]-z*he[0]]}function Se(Q,C){return[Mt[0]-Q*he[0]+C*he[1],Mt[1]-Q*he[1]-C*he[0]]}function Da(Q){const C=Math.cos(Math.atan(K.slope))*K.half;return(L,z)=>{const[I,j]=u0(L,z);if(I>190||I<-170||Math.abs(j)>240)return 0;const N=I/150,ne=j/215,ce=Math.hypot(N,ne);let ee=0;if(ce<1){const se=1-ce,ue=se*se*(3-2*se);ee=100*ue*(1+.2*Q.fbm2(L/110,z/110,3)*(1-ue))+10*Q.n2(L/38,z/38)*se*(1-ue),ee*=1-je(-1368,-1334,z)}const Ae=K.h-(I-K.a)*K.slope,G=je(K.a-C-14,K.a-C,I)*(1-je(K.a+C,K.a+C+14,I))*je(-K.half-12,-K.half,j)*(1-je(K.half,K.half+12,j));return Math.max(0,ee+(Ae-ee)*G)}}class Vo{constructor(C){const L=C*4;this.max=L,this.p=new Float32Array(L*3),this.n=new Float32Array(L*3),this.c=new Float32Array(L*3),this.f=new Float32Array(L*4),this.g=new Float32Array(L*2),this.i=new Uint32Array(C*6),this.nv=0,this.ni=0,this.vOff=0}get full(){return this.nv+64>this.max}v(C,L,z,I,j,N,ne,ce,ee,Ae,G,se,ue){const U=this.nv,le=U*3,be=U*4,J=U*2;return this.p[le]=C,this.p[le+1]=L,this.p[le+2]=z,this.n[le]=I,this.n[le+1]=j,this.n[le+2]=N,this.c[le]=ne.r,this.c[le+1]=ne.g,this.c[le+2]=ne.b,this.f[be]=ce,this.f[be+1]=ee,this.f[be+2]=Ae,this.f[be+3]=G,this.g[J]=se,this.g[J+1]=ue,this.nv++}q(C){const L=this.i,z=this.ni;L[z]=C,L[z+1]=C+1,L[z+2]=C+2,L[z+3]=C,L[z+4]=C+2,L[z+5]=C+3,this.ni+=6}t(C,L,z){const I=this.i,j=this.ni;I[j]=C,I[j+1]=L,I[j+2]=z,this.ni+=3}wall(C,L,z,I,j,N,ne,ce,ee,Ae,G,se,ue,U){if(this.full)return;const le=Math.hypot(z-C,I-L),be=this.vOff,J=this.v(C,j,L,ce,0,ee,Ae,ue,be,G,se,le,U+be);this.v(z,j,I,ce,0,ee,Ae,ue+le,be,G,se,le,U+be),this.v(z,ne,I,ce,0,ee,Ae,ue+le,be+ne-j,G,se,le,U+be),this.v(C,N,L,ce,0,ee,Ae,ue,be+N-j,G,se,le,U+be),this.q(J)}box(C,L,z,I,j,N,ne,ce,ee,Ae=2,G=2,se=0){if(this.full)return;const ue=N-j+se,U=ee*97;this.wall(C,I,L,I,j,N,N+se,0,1,ne,ee,Ae,U,ue),this.wall(L,I,L,z,j,N+se,N+se,1,0,ne,ee,Ae,U+31,ue),this.wall(L,z,C,z,j,N+se,N,0,-1,ne,ee,Ae,U+57,ue),this.wall(C,z,C,I,j,N,N,-1,0,ne,ee,Ae,U+83,ue);const le=(L-C)/2,be=(I-z)/2,J=Math.hypot(se,L-C),Ue=-se/J,$e=(L-C)/J,Jt=this.v(C,N,I,Ue,$e,0,ce,-le,be,ee,G,le,be);this.v(L,N+se,I,Ue,$e,0,ce,le,be,ee,G,le,be),this.v(L,N+se,z,Ue,$e,0,ce,le,-be,ee,G,le,be),this.v(C,N,z,Ue,$e,0,ce,-le,-be,ee,G,le,be),this.q(Jt)}tank(C,L,z,I,j,N,ne,ce){if(this.full)return;const ee=ce*5;for(let G=0;G<6;G++){const se=ee+G/6*yt,ue=ee+(G+1)/6*yt,U=(se+ue)/2;this.wall(C+Math.sin(se)*z,L+Math.cos(se)*z,C+Math.sin(ue)*z,L+Math.cos(ue)*z,I,j,j,Math.sin(U),Math.cos(U),N,ce,2,G,j-I)}const Ae=G=>[C+Math.sin(ee+G/6*yt)*z,L+Math.cos(ee+G/6*yt)*z];for(let G=0;G<2;G++){const se=G*3,ue=Ae(se),U=Ae(se+1),le=Ae(se+2),be=Ae(se+3),J=this.v(ue[0],j,ue[1],0,1,0,ne,0,0,ce,2,1,1);this.v(U[0],j,U[1],0,1,0,ne,0,0,ce,2,1,1),this.v(le[0],j,le[1],0,1,0,ne,0,0,ce,2,1,1),this.v(be[0],j,be[1],0,1,0,ne,0,0,ce,2,1,1),this.q(J)}}quad(C,L,z,I,j,N=2,ne=0,ce=j){if(this.full)return;const ee=L[0]-C[0],Ae=L[1]-C[1],G=L[2]-C[2],se=I[0]-C[0],ue=I[1]-C[1],U=I[2]-C[2];let le=Ae*U-G*ue,be=G*se-ee*U,J=ee*ue-Ae*se;const Ue=Math.hypot(le,be,J)||1;le/=Ue,be/=Ue,J/=Ue;const $e=this.v(C[0],C[1],C[2],le,be,J,j,0,0,ne,N,1,1);this.v(L[0],L[1],L[2],le,be,J,j,1,0,ne,N,1,1),this.v(z[0],z[1],z[2],le,be,J,ce,1,1,ne,N,1,1),this.v(I[0],I[1],I[2],le,be,J,ce,0,1,ne,N,1,1),this.q($e)}build(){const C=new S.BufferGeometry,L=this.nv;return C.setAttribute("position",new S.BufferAttribute(this.p.slice(0,L*3),3)),C.setAttribute("normal",new S.BufferAttribute(this.n.slice(0,L*3),3)),C.setAttribute("color",new S.BufferAttribute(this.c.slice(0,L*3),3)),C.setAttribute("aF",new S.BufferAttribute(this.f.slice(0,L*4),4)),C.setAttribute("aG",new S.BufferAttribute(this.g.slice(0,L*2),2)),C.setIndex(new S.BufferAttribute(this.i.slice(0,this.ni),1)),C}}class Xt{constructor(C,L){this.max=C,this.nq=0,this.spec=L,this.a={};for(const z in L)this.a[z]=new Float32Array(C*4*L[z])}get full(){return this.nq>=this.max}put(C,L,...z){const I=this.spec[C],j=(this.nq*4+L)*I,N=this.a[C];for(let ne=0;ne<I;ne++)N[j+ne]=z[ne]}all(C,...L){for(let z=0;z<4;z++)this.put(C,z,...L)}next(){this.nq++}build(){const C=new S.BufferGeometry,L=this.nq,z=new Uint32Array(L*6);for(const I in this.spec)C.setAttribute(I,new S.BufferAttribute(this.a[I].slice(0,L*4*this.spec[I]),this.spec[I]));for(let I=0;I<L;I++){const j=I*4,N=I*6;z[N]=j,z[N+1]=j+1,z[N+2]=j+2,z[N+3]=j,z[N+4]=j+2,z[N+5]=j+3}return C.setIndex(new S.BufferAttribute(z,1)),C}}const Ra=`
uniform float uTime, uLit, uLitGain, uWet, uNeon, uHead, uDark, uPudR, uShade, uFarE, uNearE, uRoofK, uGrey, uBandPh;
uniform vec3 uSky, uHz, uPoolCol, uSunDir, uFill, uPortal;
uniform vec4 uPool[3];
uniform vec4 uHill;
varying vec3 vP; varying vec3 vN0;
float cbH11(float p){ p = fract(p*.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float cbH21(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y)*p3.z); }
float cbVn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(cbH21(i), cbH21(i + vec2(1., 0.)), f.x), mix(cbH21(i + vec2(0., 1.)), cbH21(i + vec2(1., 1.)), f.x), f.y); }
float cbBox(vec2 p, vec2 a, vec2 b, vec2 fw){ fw = max(fw, vec2(1e-4)); vec2 s = smoothstep(a - fw, a + fw, p)*(1. - smoothstep(b - fw, b + fw, p)); return s.x*s.y; }
float cbPool1(vec2 p, vec4 k){ vec2 d = (p - k.xy)/max(k.z, 1.); float q = dot(d, d); return k.w*exp(-q*q*1.3); }
float cbPool(vec2 p){ return cbPool1(p, uPool[0]) + cbPool1(p, uPool[1]) + cbPool1(p, uPool[2]); }
// cloud shadow drifting over the city with the wind: 1 in the open, down to 1 - uShade under the scud
// metres from the approach line's ground track: the first straight, the turn's arc, the final down the avenue as far as the airfield's fence (routeDist in the part)
uniform vec4 uWake, uLand;
// The landing lamps of the aircraft we ride in (uWake: where it is; uLand: its heading in plan, the tangent of its bank, 1). They are fixed to the airframe and aimed
// ahead and down; their pool lies where their axis meets whatever stands under it: further ahead and wider the higher the aircraft is over that surface, thrown to the
// outside of a banked turn, gone above eighty metres. One law for the whole flight, called by every surface it falls on, the airfield too (FRAG_AIRFIELD); it rides with the eye.
float cbLand(vec3 P) {
  float lh = clamp(uWake.y - P.y, 4., 200.), lsec = sqrt(1. + uLand.z*uLand.z);
  vec2 lq = P.xz - uWake.xz;
  float lal = dot(lq, uLand.xy) - (3.2*lh*lsec + 30.), lac = dot(lq, vec2(uLand.y, -uLand.x)) - lh*uLand.z;
  float lsz = 1.6*lh + 25., lsx = 0.9*lh + 13.;
  return exp(-lac*lac/(lsx*lsx) - lal*lal/(lsz*lsz))*(1. - smoothstep(34., 80., lh))*step(P.y, uWake.y - 4.)*uLand.w;
}
float cbRoute(vec2 p){
  vec2 e = p - vec2(${ct[0].toFixed(2)}, ${ct[1].toFixed(2)}), h = vec2(${Re[0].toFixed(5)}, ${Re[1].toFixed(5)});
  float d1 = length(e - h*clamp(dot(e, h), 0., ${kt.toFixed(1)}));
  vec2 c = p - vec2(${Oe[0].toFixed(1)}, ${Oe[1].toFixed(1)});
  float an = clamp(atan(c.y, c.x + (abs(c.x) + abs(c.y) < 1e-3 ? 1. : 0.)), ${Xe.toFixed(5)}, 0.);
  float d2 = length(c - vec2(cos(an), sin(an))*${We.toFixed(1)});
  float d3 = length(p - vec2(0., clamp(p.y, -1100., ${Fo.toFixed(1)})));
  return min(d1, min(d2, d3));
}
float cbShade(vec2 p){ float n = cbVn(p*0.0031 - uTime*vec2(0.08, 0.104))*0.65 + cbVn(p*0.0083 - uTime*vec2(0.124, 0.088) + 4.7)*0.35; return 1. - uShade*smoothstep(0.42, 0.6, n); }          // round six: the squall's broken cloud runs before the wind at 25 m/s, and its shadows sweep the roofs
`,_a="attribute vec4 aF; attribute vec2 aG; varying vec3 vP; varying vec3 vN0; varying vec4 vF; varying vec2 vG;",Ha="vP = position; vN0 = normal; vF = aF; vG = aG;",Ga=`
vec3 cbAlb = diffuseColor.rgb; float cbRough = 0.86; vec3 cbEmi = vec3(0.);
float cbKind = vF.w, cbSeed = vF.z;
float cbFres = pow(1. - clamp(abs(dot(normalize(vViewPosition), normalize(vNormal))), 0., 1.), 4.);
vec2 cbPx = fwidth(vP.xz) + fwidth(vP.yy);
float cbPix = max(max(cbPx.x, cbPx.y), 1e-3);
// round thirteen: light is capped at its source by its distance from the eye: a lit wall within 70 m burns at two fifths of its far strength (a tower passed close
// washed a third of the frame white under bloom), full from 260 m
float cbNearK = mix(0.42, 1., smoothstep(70., 260., length(vViewPosition)));
// round nine: round the beacon tower the lit rooms thin out and gather into dark floors and lit bands, so that the eye rests on the tower
float cbZone = 1. - smoothstep(190., 470., length(vP.xz - vec2(${oe[0].toFixed(1)}, ${oe[1].toFixed(1)})));
if (cbKind < 0.5) {
  float bay = 2.9 + fract(cbSeed*7.31)*0.9;
  vec2 g = vec2(vF.x/bay, (vF.y - 4.6)/3.0);
  vec2 fw = vec2(cbPix/bay, cbPix/3.0);
  float lod = 1. - smoothstep(0.2, 0.55, max(fw.x, fw.y));
  vec2 id = floor(g), f = fract(g);
  float hc = cbH21(id + cbSeed*71.3), hcol = cbH11(id.x*3.7 + cbSeed*311.);
  float streak = cbVn(vec2(vF.x*1.1 + cbSeed*50., vF.y*0.22));
  float mott = cbVn(vF.xy*0.23 + cbSeed*9.);
  vec3 wall = cbAlb*(0.74 + 0.3*mott)*(1. - (0.06 + 0.14*(1. - smoothstep(0.25, 1.2, cbPix)))*smoothstep(0.5, 0.9, streak));
  wall *= 0.52 + 0.48*smoothstep(0., 34., vF.y);
  wall = mix(wall, wall*vec3(0.5, 0.58, 0.46), 0.5*smoothstep(vG.y - 6., vG.y, vF.y)*cbVn(vec2(vF.x*0.4, cbSeed*30.)));
  if (vF.y > 4.6) {
    float cage = step(hcol, 0.3)*step(0.45, fract(cbSeed*3.7));
    vec2 wa = mix(vec2(0.2, 0.36), vec2(0.06, 0.08), cage), wb = mix(vec2(0.8, 0.86), vec2(0.94, 0.9), cage);
    float win = cbBox(f, wa, wb, fw);
    // round nine: not an even speckle. Every building has its own share of lit rooms and its own lamp; some floors are dark from end to end, a few are lit from end
    // to end in one colour (the white tubes of a workshop, the red and gold of a restaurant), and one bay in eleven is the stair, lit all the way up.
    // Round eleven: the rooms are lit in GROUPS, not one by one (the even speckle read as noise from the avenue and from the scud alike). A building keeps its own share
    // of lit rooms (sB), but spends it by the floor and by the flat: about a quarter of its floors are dark from end to end but for a stray room, a tenth to a quarter are
    // lit from end to end, and on the floors between a flat of three to five bays (in half the buildings two storeys of it) is lit or dark as one. The mean is the same.
    float fh = cbH11(id.y*7.31 + cbSeed*517.3), fh2 = cbH11(id.y*3.17 + cbSeed*211.7);
    float sB = uLit*(0.3 + 1.4*fract(cbSeed*13.7))*(1. - 0.45*cbZone);
    float tallK = step(60., vG.y);          // round thirteen: on a tower (over 60 m) a flat is five to eight bays by two or three storeys, a third of the floors are dark and no stray room is dark in a lit flat: seen from the avenue its lights stand in blocks, not in a speckle
    float dF = 0.26 + 0.1*cbZone + 0.08*tallK, bF = min(0.07 + 0.18*sB + 0.04*tallK, 0.55*sB);
    float darkF = step(fh, dF), bandF = step(1. - bF, fh);
    float stair = step(mod(id.x + floor(cbSeed*89.), 11.), 0.5);
    float nrun = mix(3. + floor(3.*fract(cbSeed*57.3)), 5. + floor(4.*fract(cbSeed*57.3)), tallK), vrun = 1. + step(0.5, fract(cbSeed*23.9)) + 2.*tallK;
    vec2 apt = vec2(floor((id.x + floor(fract(cbSeed*7.7)*5.))/nrun), floor(id.y/vrun));
    float hrun = cbH21(apt*1.7 + cbSeed*71.3);
    float p0 = clamp((sB*1.12 - 0.03*dF - 0.97*bF)/max(1. - dF - bF, 0.2), 0.04, 0.92);
    float litB0 = sB;
    float pRun = mix(mix(p0, 0.97, bandF), 0.03, darkF);
    float lit = mix(step(hrun, pRun)*step((0.1 - 0.08*bandF)*(1. - tallK), hc), step(hc, uLit*1.7 + 0.06), stair);          // one room in ten of a lit flat is dark; the stair is lit all the way up
    float lodC = 1. - smoothstep(0.45, 1.1, max(fw.x, fw.y));
    // the lamps behind the glass: tungsten amber for most, cream, a few fluorescent mint and a few rose shades, the odd television blue
    float hq = cbH21(id*1.3 + cbSeed*17.);
    float bq9 = fract(cbSeed*29.3), own = bq9 < 0.5 ? 0.25 : bq9 < 0.78 ? 0.6 : bq9 < 0.92 ? 0.85 : 0.95;
    hq = mix(own, hq, step(0.86, cbH21(apt*1.9 + cbSeed*3.1))*(1. - bandF));          // six flats in seven burn the building's own lamp (round eleven: by the flat, not by the room; a lit floor is all one lamp)
    vec3 litc = hq < 0.5 ? vec3(1.0, 0.58, 0.24) : hq < 0.76 ? vec3(1.0, 0.8, 0.5) : hq < 0.9 ? vec3(0.56, 0.95, 0.78) : vec3(1.0, 0.5, 0.52);
    litc = mix(litc, vec3(0.74, 0.87, 1.0)*0.9, 0.85*step(0.76, fract(cbSeed*41.7)));          // round eleven: one building in four is lit by cold white tubes from top to bottom: warm blocks and cool blocks
    litc = mix(litc, vec3(0.35, 0.55, 1.0), step(0.95, cbH21(apt + 3.3)));
    litc = mix(litc, fh2 > 0.9 ? vec3(0.9, 0.36, 0.23) : vec3(0.6, 0.74, 0.8), step(0.62, fh2)*bandF*(1. - stair));
    litc *= 1. - 0.22*bandF*(1. - stair);
    litc = mix(litc, vec3(0.66, 0.9, 0.82)*0.45, stair);
    // after dark a fifth of the lit rooms have a television on: their light wavers, a little bluer, two to five times a second (their mean stays where it was)
    float tvn = cbVn(vec2(uTime*(2. + 3.*cbH21(id + 9.1)), hc*91. + cbSeed*13.));
    litc = mix(litc, mix(litc, vec3(0.5, 0.66, 1.0), 0.4)*(0.45 + 1.1*tvn), step(0.8, cbH21(id*2.7 + cbSeed*23.))*uDark);
    vec3 glass = mix(vec3(0.04, 0.05, 0.06), uSky, 0.1 + 0.7*cbFres);
    vec2 wq = (f - wa)/(wb - wa);
    vec2 m = abs(fract(wq*mix(vec2(3., 2.), vec2(7., 5.), cage)) - 0.5);
    float pane = 1. - smoothstep(0.36, 0.46, max(m.x, m.y));
    float blind = step(0.3 + 0.7*cbH21(id*2.1 + cbSeed), wq.y);
    // the room behind the glass: the ceiling lit, a curtain drawn part of the way across, things standing on the sill
    float hw2 = cbH21(id*3.7 + cbSeed*5.1);
    float cur = step(0.45, hw2)*step(abs(wq.x - step(0.72, hw2)), 0.18 + 0.3*fract(hw2*7.3));
    vec3 curt = vec3(0.86, 0.66, 0.5) + 0.3*cos(6.2832*(fract(hw2*3.1) + vec3(0., 0.33, 0.67)));          // lit from behind, a curtain glows in its own colour
    float sill = step(wq.y, 0.07 + 0.2*cbVn(vec2(wq.x*5. + id.x*3.3, id.y*1.7 + cbSeed*9.)));
    vec3 inner = litc*mix(1.0, 0.4, blind)*(0.76 + 0.48*wq.y)*mix(vec3(1.), curt, cur*lod)*(1. - 0.6*sill*lod)*uNearE;
    vec3 wcol = mix(wall*0.4, glass, pane);
    vec3 junk = mix(vec3(0.22), 0.3 + 0.3*cos(6.2832*(cbH21(floor(wq*vec2(3., 4.)) + id) + vec3(0., 0.33, 0.67))), 0.4);
    wcol = mix(wcol, junk, cage*pane*step(0.5, cbH21(floor(wq*vec2(3., 4.)) + id*1.7))*0.75);
    float ac = (1. - cage)*step(0.42, cbH21(id + 7.7 + cbSeed))*cbBox(f, vec2(0.5, 0.1), vec2(0.8, 0.3), fw);
    float drip = (1. - cage)*step(0.42, cbH21(vec2(id.x, id.y + 1.) + 7.7 + cbSeed))*cbBox(f, vec2(0.58, -0.1), vec2(0.72, 1.1), fw)*f.y;
    vec3 det = wall*(1. + 0.18*(1. - smoothstep(0.02, 0.07, f.y)));
    det *= 1. - 0.3*drip;
    det *= 1. - 0.3*cbBox(f, vec2(wa.x, wa.y - 0.14), vec2(wb.x, wa.y), fw);
    det = mix(det, wcol, win);
    det = mix(det, vec3(0.5, 0.52, 0.5)*(0.5 + 1.6*f.y), ac);
    vec3 avg = mix(wall*0.97, glass*0.8 + wall*0.2, 0.3);
    // round thirteen: too far for a window, a wall is not one flat tone even so: ribbons of glazing a floor and a half deep while they are two pixels, and panels five
    // bays by three floors, each its own shade, until those too are under a pixel (the towers behind the airfield read as buildings, not as beige boxes)
    float farP = cbH21(floor(vec2(g.x/5., g.y/3.)) + cbSeed*31.);
    avg *= 1. - 0.2*step(0.5, fract(g.y/3.))*(1. - smoothstep(0.75, 1.5, fw.y));
    avg *= mix(1., 0.84 + 0.32*farP, 1. - smoothstep(1.3, 2.8, fw.y));
    cbAlb = mix(avg, det, lod);
    float fwm = max(fw.x, fw.y);
    // round fourteen: on a tower, while a bay is under about six pixels wide, a lit flat is one ribbon of light the height of its windows (bay after bay with no pier
    // between, no cage bars or mullions): from the roll-out the nearest towers carry bands of lit floors, not a lattice of dots
    float bigP = tallK*(1. - smoothstep(4., 8., 1./max(fw.x, 1e-3)));
    float winE = mix(win, cbBox(f, vec2(-0.2, wa.y), vec2(1.2, wb.y), fw), bigP), paneE = mix(mix(0.3, pane, lod), 0.5, bigP);
    float lodF = 1. - smoothstep(0.6, 1.7, fwm);
    float wmask = mix(1., winE, 1. - smoothstep(0.6, 1.4, fwm));
    vec3 avgE = vec3(1.0, 0.72, 0.42)*litB0*(0.95 - 0.3*cbZone)*uFarE*(0.5 + cbVn(vec2(g.x*0.31, g.y*0.57) + cbSeed*40.));          // too far for a floor to be a row of pixels: the building's mean
    avgE *= mix(1., 0.38 + 1.2*step(0.42, cbH21(floor(vec2(g.x/4., g.y/2.)) + cbSeed*17.)), 1. - smoothstep(1.6, 3.2, fw.y));          // round thirteen: and after dark its glow is spent by the flat: lit blocks and dark ones, not one even wash
    vec3 farE = mix(avgE, litc*lit*mix(0.62, 1., max(bandF, stair))*wmask*0.4, lodF);
    cbEmi += uLitGain*mix(farE, inner*lit*winE*paneE, lodC)*cbNearK;
    cbRough = mix(0.86, 0.2, win*pane*lod*(1. - cage));
  } else {
    float sw = bay*1.5;
    vec2 sf = vec2(fract(vF.x/sw), vF.y/4.6); float sid = floor(vF.x/sw);
    float open = cbBox(sf, vec2(0.06, -0.1), vec2(0.94, 0.68), vec2(cbPix/sw, cbPix/4.6));
    float sh = cbH11(sid*5.3 + cbSeed*201.);
    vec3 awn = 0.4 + 0.3*cos(6.2832*(sh + vec3(0., 0.35, 0.6)));
    awn *= 0.75 + 0.25*step(0.5, fract(vF.x*1.6));
    cbAlb = mix(mix(wall*0.8, awn, step(0.68, sf.y)*step(sf.y, 0.9)), vec3(0.05), open);
    cbEmi += open*mix(vec3(1.0, 0.7, 0.38), vec3(0.75, 1.0, 0.9), step(0.5, sh))*(0.25 + 0.75*step(sh, 0.35 + uLit))*uLitGain*0.5*(0.4 + 0.6*sf.y);
  }
} else if (cbKind < 1.5) {
  vec2 q = vF.xy; float e = min(vG.x - abs(q.x), vG.y - abs(q.y));
  float par = 1. - smoothstep(0.3, 0.3 + cbPix + 0.05, e);
  float sh = smoothstep(0.4, 1.8, e);
  vec3 r = cbAlb*(0.72 + 0.34*cbVn(q*0.35 + cbSeed*40.));
  r = mix(r, vec3(dot(r, vec3(0.3, 0.6, 0.1))), 0.5*uGrey);          // under the squall the painted roofs go toward wet grey
  vec2 pc = floor(q/(2.6 + 3.*fract(cbSeed*5.)) + cbSeed*9.);
  r *= 0.82 + 0.34*cbH21(pc + cbSeed*3.);
  r = mix(r, r*vec3(0.5, 0.64, 0.42), 0.55*smoothstep(0.6, 0.8, cbVn(q*0.13 + cbSeed*7.)));
  float rl = 1. - smoothstep(0.3, 1.2, cbPix);
  r *= 1. + (cbH21(floor(q/0.5 + cbSeed*3.)) - 0.5)*0.22*(1. - smoothstep(0.07, 0.3, cbPix));          // paving slabs, half a metre each, once the wheels are low enough to see them
  r *= 1. - 0.1*rl*step(0.5, fract((fract(cbSeed*3.) < 0.5 ? q.x : q.y)/1.2));
  vec2 vc = floor(q/2.4 + cbSeed*5.), vf = fract(q/2.4 + cbSeed*5.);
  r = mix(r, vec3(0.05), rl*step(0.9, cbH21(vc + cbSeed*13.))*cbBox(vf, vec2(0.35), vec2(0.62), vec2(cbPix/2.4)));
  r *= 1. - 0.45*rl*(1. - smoothstep(0.06, 0.12, abs(fract((q.x + q.y*0.3)/7.3 + cbSeed) - 0.5)*7.3))*step(0.4, fract(cbSeed*17.));
  float pd = smoothstep(0.78 - 0.16*uWet, 0.85 - 0.16*uWet, cbVn(q*0.5 + cbSeed*77.))*sh;
  r = mix(r, r*0.55, pd);
  cbRough = mix(0.82 - 0.36*uWet, uPudR, pd);
  cbEmi += (uSky*0.06 + uHz*0.9*cbFres)*pd*0.6 + uSky*cbFres*0.5*uWet;
  r *= 1. - 0.35*(1. - smoothstep(0.45, 0.95, e))*step(0.45, e);
  // what lies about on a roof: a tarpaulin weighted down at its corners, a pipe run from the tank room to the parapet
  // (the tarpaulin's place is also where things are laid out to dry on mats, or where somebody keeps a row of planters)
  float tv = fract(cbSeed*61.);
  vec2 tc = (vec2(cbH11(cbSeed*91.7), cbH11(cbSeed*57.3)) - 0.5)*vG*1.1;
  vec2 th = vec2(1.6 + 1.8*fract(cbSeed*29.), 1.2 + 1.2*fract(cbSeed*43.))*(tv < 0.4 ? 1. : 1.5);
  vec2 tl = q - tc;
  float tarp = cbBox(tl, -th, th, vec2(cbPix))*step(0.4, fract(cbSeed*19.))*step(th.x + 1.5, vG.x)*step(th.y + 1.5, vG.y);
  vec3 tcol;
  if (tv < 0.4) {
    tcol = tv < 0.2 ? vec3(0.07, 0.2, 0.5) : tv < 0.32 ? vec3(0.42, 0.44, 0.4) : vec3(0.45, 0.3, 0.08);
    tcol *= 0.8 + 0.25*sin(tl.x*5. + sin(tl.y*3.)*1.5)*rl;
  } else if (tv < 0.72) {
    vec2 cid = floor(tl/0.9), cf = fract(tl/0.9);
    float sq = cbBox(cf, vec2(0.12), vec2(0.88), vec2(cbPix/0.9))*step(0.25, cbH21(cid*1.7 + cbSeed));
    vec3 dc = 0.36 + 0.3*cos(6.2832*(cbH21(cid + cbSeed*7.)*0.3 + 0.03 + vec3(0., 0.18, 0.42)));
    tcol = mix(r*0.9, dc, sq);
  } else {
    float row = fract(tl.y/1.1);
    tcol = mix(vec3(0.16, 0.12, 0.09), vec3(0.06, 0.14, 0.05)*(0.7 + 0.6*cbVn(tl*3.)), smoothstep(0.25, 0.32, row)*(1. - smoothstep(0.78, 0.85, row)));
  }
  tcol = mix(tcol, vec3(dot(tcol, vec3(0.3, 0.6, 0.1))), 0.6*uGrey);          // under the squall the tarpaulins and mats lose their colour: the board's orange is the one saturated thing
  r = mix(r, tcol, tarp*0.9);
  // the parapet on the sun's side lays its shadow across the roof (by day)
  vec2 sxz = uSunDir.xz; float shl = clamp(1.1*length(sxz)/max(uSunDir.y, 0.15), 0., 5.)/max(length(sxz), 1e-3);
  float wxs = shl*abs(sxz.x) + 0.02, wzs = shl*abs(sxz.y) + 0.02;
  float dxs = vG.x - q.x*(sxz.x < 0. ? -1. : 1.), dzs = vG.y - q.y*(sxz.y < 0. ? -1. : 1.);
  float psh = max(1. - smoothstep(wxs*0.7, wxs, dxs - 0.3), 1. - smoothstep(wzs*0.7, wzs, dzs - 0.3));
  r *= 1. - 0.34*psh*(1. - uDark)*(1. - par);
  float py = (fract(cbSeed*23.) - 0.5)*vG.y*1.3;
  float pipe = (1. - smoothstep(0.09, 0.09 + cbPix, abs(q.y - py)))*step(0.4, fract(cbSeed*37.))*(1. - smoothstep(0.25, 0.8, cbPix))*(1. - tarp);
  r = mix(r, vec3(0.3, 0.17, 0.1), pipe*0.85);
  r *= 1. - 0.3*rl*(1. - tarp)*(1. - smoothstep(0.0, 0.3, abs(q.y - py - 0.22)));
  r *= uRoofK;
  // the roofs under the approach line after dark: a string of bare bulbs runs down the middle of each (the part hangs the bulbs: roofStrings), a pool of warm light
  // lies under every bulb and a softer wash between them, and the standing water mirrors the colours of the street's neon
  { float dk = uDark*step(vP.y, 58.)*(1. - smoothstep(${(St-3).toFixed(1)}, ${(St+3).toFixed(1)}, cbRoute(vP.xz - q)))*step(11., vP.y)*step(4.4, min(vG.x, vG.y));
    if (dk > 0.001) {
      float lx = vG.x >= vG.y ? q.x : q.y, sx = vG.x >= vG.y ? q.y : q.x, hl = max(vG.x, vG.y), hs = min(vG.x, vG.y);
      float nb = max(2., floor(hl/3.5 + 0.5)), sp = 2.*hl/nb, da = (fract((lx + hl)/sp) - 0.5)*sp;
      float pool = exp(-(da*da + sx*sx)/16.), wash = exp(-sx*sx/(0.5*hs*hs + 4.));
      // (a deck is lit in its own colour, a little deeper than by day, and held well under white: a soft knee from 0.26, never over 0.45, whatever its skin)
      vec3 dl = (mix(vec3(dot(r, vec3(0.3, 0.6, 0.1))), r, 1.45) + 0.02)*vec3(1.0, 0.8, 0.56)*(3.2*pool + 0.9*wash)*(0.75 + 0.5*fract(cbSeed*9.7));
      float dm = max(max(dl.r, dl.g), max(dl.b, 1e-4)), dn = dm > 0.26 ? 0.26 + 0.19*(1. - exp(-(dm - 0.26)/0.19)) : dm;
      cbEmi += max(dl, vec3(0.))*(dn/dm)*dk*(1. - par);
      cbEmi += (0.5 + 0.5*cos(6.2832*(fract(cbSeed*7.9) + vec3(0., 0.33, 0.67))))*pd*0.09*dk*uNeon;
    } }
  cbAlb = mix(r*(0.68 + 0.32*sh), diffuseColor.rgb*0.9 + 0.1, par);
} else if (cbKind < 2.5) {
  cbAlb = mix(cbAlb, vec3(dot(cbAlb, vec3(0.3, 0.6, 0.1))), 0.72*uGrey);
  float n = cbVn(vP.xz*0.9 + vP.y*1.7);
  cbAlb *= 0.72 + 0.4*n; cbAlb = mix(cbAlb, vec3(0.3, 0.16, 0.09), 0.35*smoothstep(0.62, 0.9, cbVn(vP.xz*0.4 + cbSeed*60.)));
  float up2 = step(0.5, abs(vN0.y));
  float rib = sin((up2 > 0.5 ? vP.z : vP.x + vP.z)*17.)*(1. - smoothstep(0.06, 0.22, cbPix));
  cbAlb *= 1. + 0.16*rib;
  cbAlb *= mix(0.62 + 0.38*smoothstep(0., 1.1, vF.y), 1., up2);        // walls darken toward their foot: every shack and tank stands on its roof
  cbRough = 0.55;
} else if (cbKind < 3.5) {
  vec2 g = vec2(vF.x/0.7, vF.y/3.0); vec2 f = fract(g); vec2 id = floor(g);
  float lod = 1. - smoothstep(0.25, 0.7, cbPix/0.7);
  float bars = max(1. - smoothstep(0.08, 0.16, abs(f.x - 0.5)), 1. - smoothstep(0.03, 0.08, min(f.y, abs(f.y - 0.5))));
  float fl = floor(g.y);
  vec3 inside = 0.1 + 0.1*cos(6.2832*(cbH21(vec2(id.x*0.5, fl) + cbSeed*31.) + vec3(0., 0.33, 0.67)))*step(0.4, cbH21(id + cbSeed));
  // lit flat by flat (two bays wide), dimmer by day and once the bars drop below a pixel; the floor slabs stay readable long after the bars have gone
  float lit = step(cbH21(vec2(floor(id.x*0.25), fl) + cbSeed*91.), uLit*1.2);
  float flod = 1. - smoothstep(0.35, 1.0, cbPix/3.0);
  float slab = (1. - smoothstep(0.04, 0.12, min(f.y, 1. - f.y)))*flod;
  float fk = cbH21(vec2(floor(id.x*0.25), fl)*1.7 + cbSeed*17.);
  vec3 cagec = fk < 0.5 ? vec3(1.0, 0.6, 0.27) : fk < 0.76 ? vec3(1.0, 0.78, 0.48) : fk < 0.9 ? vec3(0.56, 0.95, 0.78) : vec3(1.0, 0.5, 0.52);
  cagec *= (0.55 + 0.45*fract(fk*7.3))*mix(1., 0.6 + 0.7*f.y, flod);
  // far away the cage is what it averages to close up (two fifths bars, the rest the dark of the balcony), flat by flat a little different: a shadowed column, not a strip of bare plaster
  vec3 cfar = mix(vec3(0.07), cbAlb, 0.3)*(1. - 0.45*slab)*(0.7 + 0.6*cbH21(vec2(floor(id.x*0.25), fl)*1.3 + cbSeed*47.));
  cbAlb = mix(cfar, mix(max(inside, vec3(0.03)), cbAlb*0.75, bars), lod);
  cbEmi += (lit + 0.07*uDark*(1. - lit))*(1. - bars*lod)*(1. - 0.85*slab)*cagec*uLitGain*mix(0.45, 0.58, uDark)*mix(mix(0.3, 1., lod), 1., uDark)*(0.45 + 0.55*uDark)*(1. - 0.4*cbZone)*cbNearK;          // by day a far stack is a shadowed column; after dark the lit balconies carry as far as the windows do, and their bloom is half the glow of the city
} else if (cbKind < 4.5) {
  cbAlb *= 0.7 + 0.7*cbVn(vP.xz*0.7 + vP.y*0.9); cbRough = 0.9; cbEmi += cbAlb*(uSky*0.3 + vec3(0.42, 0.34, 0.26)*uDark);          // after dark foliage takes the glow of the streets: a dark green mass, not a black one
} else if (cbKind < 5.5) {
  cbAlb *= 0.9 + 0.15*cbVn(vP.xz*0.5); cbRough = 0.32;
  cbAlb = mix(cbAlb, vec3(dot(cbAlb, vec3(0.3, 0.6, 0.1))), 0.65*uGrey);          // round nine: under the squall the fins and trim go toward grey too: the board's orange is the one saturated colour
  cbEmi += uSky*cbFres*0.25 + cbAlb*vec3(1.0, 0.8, 0.56)*(0.05 + 0.45*uDark)*step(-325., vP.z);          // on the airfield: under the apron floodlights
} else if (cbKind < 6.5) {
  // obstacle paint: the vertex colour in bands with white (round eleven: bands, not checks: there is one checkerboard only, the hill's)
  float ck = mod(floor(vF.y/0.75 + 0.001), 2.);
  float ckl = 1. - smoothstep(0.35, 1.1, cbPix/0.75);
  cbAlb = mix(mix(cbAlb, vec3(0.78, 0.76, 0.7), 0.5), mix(cbAlb, vec3(0.78, 0.76, 0.7), ck), ckl)*(0.8 + 0.25*cbVn(vP.xz*0.9 + vP.y));
  cbRough = 0.5; cbEmi += cbAlb*vec3(1.0, 0.85, 0.65)*0.4*uDark;          // obstacle paint is floodlit after dark
} else if (cbKind < 7.5) {
  // a market tarpaulin: a quarter of them the red, white and blue striped canvas in broad bands, the rest one faded colour; each sags between its poles
  float st = fract(vF.x/2.6 + cbSeed*7.), tk = fract(cbSeed*3.7);
  vec3 rwb = st < 0.34 ? vec3(0.4, 0.09, 0.08) : st < 0.5 ? vec3(0.55, 0.54, 0.5) : st < 0.84 ? vec3(0.09, 0.15, 0.36) : vec3(0.55, 0.54, 0.5);
  float stl = 1. - smoothstep(0.3, 1.0, cbPix/2.6);
  vec3 plain = tk < 0.3 ? vec3(0.1, 0.24, 0.2) : tk < 0.5 ? vec3(0.3, 0.26, 0.17) : tk < 0.64 ? vec3(0.12, 0.18, 0.32) : vec3(0.34, 0.33, 0.3);
  cbAlb = mix(mix(cbAlb, plain, 0.7), mix(vec3(0.36, 0.25, 0.3), rwb, stl), step(0.76, tk));
  vec2 tq = vF.xy/max(vG, vec2(0.5));
  cbAlb *= (0.74 + 0.26*cbVn(vP.xz*1.3))*(0.8 + 0.16*dot(tq, tq))*(1. + 0.1*sin(vF.y*9.)*(1. - smoothstep(0.05, 0.2, cbPix)));
  cbRough = 0.45;
} else if (cbKind < 8.5) {
  // a park on a block the hill took (cbSeed in thirds): a football pitch, hard courts, or a garden with paths and a pond; some are floodlit after dark
  vec2 q = vF.xy, hh = vG; float ty = cbSeed*3., sub = fract(cbSeed*37.);
  float e = min(hh.x - abs(q.x), hh.y - abs(q.y));
  float lw = max(0.16, 0.7*cbPix), lf = 1. - smoothstep(1.2, 3., cbPix);
  float n = cbVn(vP.xz*0.19), nfi = cbVn(vP.xz*2.3)*(1. - smoothstep(0.1, 0.6, cbPix));
  vec3 turf = vec3(0.075, 0.132, 0.06)*(0.78 + 0.4*n)*(0.9 + 0.3*nfi);
  vec3 c = turf; float lines = 0., glowK = 0.;
  if (ty < 1.) {
    vec2 ph = hh - vec2(5., 4.5);
    float inp = cbBox(q, -ph, ph, vec2(cbPix));
    c = turf*(0.86 + 0.26*step(0.5, fract(q.x/5.5)))*mix(0.8, 1.15, inp);
    float dr = max(abs(q.x) - ph.x, abs(q.y) - ph.y);
    lines = 1. - smoothstep(lw, lw + cbPix, abs(dr));
    lines = max(lines, (1. - smoothstep(lw, lw + cbPix, abs(q.x)))*step(dr, 0.));
    lines = max(lines, 1. - smoothstep(lw, lw + cbPix, abs(length(q) - 5.)));
    float db = max(abs(abs(q.x) - (ph.x - 4.5)) - 4.5, abs(q.y) - min(9., ph.y - 2.));
    lines = max(lines, (1. - smoothstep(lw, lw + cbPix, abs(db)))*step(dr, 0.));
    c = mix(c, vec3(0.3, 0.2, 0.12), 0.5*smoothstep(0.55, 0.8, cbVn(vP.xz*0.33 + 3.))*inp*exp(-abs(q.y)*0.2));
    glowK = step(0.5, sub)*inp;
  } else if (ty < 2.) {
    float cw = hh.x*2./3.; float cx = (fract((q.x + hh.x)/cw) - 0.5)*cw;
    vec2 ch = vec2(min(cw*0.5 - 3., 6.5), min(hh.y - 4., 12.5)); vec2 cq = vec2(cx, q.y);
    float dr = max(abs(cq.x) - ch.x, abs(cq.y) - ch.y);
    float inc = 1. - smoothstep(0., cbPix, dr);
    vec3 surf = fract(sub*2.) < 0.5 ? vec3(0.36, 0.13, 0.08) : vec3(0.08, 0.2, 0.3);
    c = mix(vec3(0.07, 0.2, 0.12)*(0.8 + 0.3*n), surf*(0.8 + 0.3*n), inc);
    lines = 1. - smoothstep(lw, lw + cbPix, abs(dr));
    lines = max(lines, (1. - smoothstep(lw, lw + cbPix, abs(cq.y)))*step(abs(cq.x), ch.x + 0.9));
    lines = max(lines, (1. - smoothstep(lw, lw + cbPix, abs(abs(cq.y) - ch.y*0.52)))*inc);
    lines = max(lines, (1. - smoothstep(lw, lw + cbPix, abs(cq.x)))*step(abs(cq.y), ch.y*0.52));
    glowK = step(0.5, sub)*step(dr, 2.);
  } else {
    // three gardens: crossed paths round a pond, an oval walk with the pond to one side, planted beds between paved walks
    float k = hh.y/max(hh.x, 1.), gv = fract(sub*3.), rr = length(q), pathm = 0.;
    vec3 lawn = turf*(0.9 + 0.3*smoothstep(0.4, 0.7, cbVn(vP.xz*0.07 + 9.)));
    if (gv < 0.34) {
      float pd2 = min(abs(q.x*k - q.y), abs(q.x*k + q.y))*0.8;
      pathm = max(1. - smoothstep(1.1, 1.1 + cbPix, pd2), 1. - smoothstep(0.9, 0.9 + cbPix, abs(rr - 8.)));
    } else if (gv < 0.67) {
      vec2 oh = max(hh - vec2(8., 7.), vec2(4.)); float ov = length(q/oh);
      pathm = max(1. - smoothstep(1.0, 1.0 + cbPix, abs(ov - 1.)*min(oh.x, oh.y)), (1. - smoothstep(0.8, 0.8 + cbPix, abs(q.x)))*step(ov, 1.));
      rr = length(q - vec2(oh.x*0.5, 0.));
    } else {
      vec2 cs = vec2(9.5, 7.6); vec2 bq2 = abs(fract(q/cs + 0.5) - 0.5)*cs; vec2 bid = floor(q/cs + 0.5);
      float bed = (1. - smoothstep(0., cbPix + 0.05, max(bq2.x - 3.6, bq2.y - 2.7)))*step(3.2, e);
      vec3 flw = mix(vec3(0.3, 0.2, 0.16), 0.3 + 0.24*cos(6.2832*(cbH21(bid + cbSeed*9.) + vec3(0., 0.33, 0.67))), 0.6);
      lawn = mix(lawn, mix(lawn*0.75, flw, smoothstep(0.55, 0.8, cbVn(vP.xz*1.9))*0.7), bed);
      pathm = 1. - bed; rr = 99.;
    }
    c = mix(lawn, vec3(0.3, 0.27, 0.22)*(0.8 + 0.3*n), pathm);
    float pond = 1. - smoothstep(4.2, 4.2 + cbPix, rr);
    c = mix(c, vec3(0.03, 0.045, 0.05), pond);
    cbRough = mix(0.9, 0.08, pond); cbEmi += pond*(uSky*0.05 + uHz*0.7*cbFres);
    c = mix(c, vec3(0.34, 0.33, 0.3), 1. - smoothstep(0.35, 0.35 + cbPix, abs(rr - 4.6)));
  }
  c = mix(c, vec3(0.62, 0.62, 0.58), lines*lf*0.85);
  float hedge = smoothstep(0.9, 1.2, e)*(1. - smoothstep(2.0, 2.4, e));
  c = mix(c, vec3(0.035, 0.08, 0.035)*(0.7 + 0.6*cbVn(vP.xz*1.1)), hedge);
  c = mix(vec3(0.3, 0.29, 0.27)*(0.8 + 0.25*cbH21(floor(vP.xz/1.2))), c, smoothstep(0.75, 0.9, e));
  cbAlb = c;
  cbEmi += c*vec3(0.95, 1.0, 0.86)*uDark*glowK*1.5*(1. - hedge)*(1. - 0.5*step(8., vP.y));          // round thirteen: a yard on a roof is lit by four small lamps, not by a stadium's: half
} else if (cbKind > 10.5) {
  // a small house's wall (kind 11): painted plaster, a window to every bay of every storey, most of them lit after dark (a few by day), a dark base course.
  // vF.x runs along the wall, vF.y up from its floor, vG = (the wall's length, its height)
  float nbh = max(floor(vG.x/1.9 + 0.5), 1.), bwh = max(vG.x, 0.1)/nbh, nsh = max(floor(vG.y/2.6 + 0.5), 1.), shh = max(vG.y, 0.5)/nsh;
  vec2 wq = vec2(fract(vF.x/bwh), fract(vF.y/shh)), wid = vec2(floor(vF.x/bwh), floor(vF.y/shh));
  float lodH = 1. - smoothstep(0.3, 1.0, cbPix/bwh);
  float win = cbBox(wq, vec2(0.24, 0.34), vec2(0.76, 0.8), vec2(cbPix/bwh, cbPix/shh));
  float hw = cbH21(wid + cbSeed*31.);
  float litW = mix(0.55, step(hw, 0.12 + 0.6*uDark + uLit), lodH);
  float bars = smoothstep(0.03, 0.07, abs(wq.x - 0.5))*smoothstep(0.02, 0.05, abs(wq.y - 0.57));
  vec3 wallC = diffuseColor.rgb*(0.8 + 0.3*cbVn(vec2(vF.x*0.9 + cbSeed*17., vF.y*0.6)))*(0.75 + 0.25*smoothstep(0., 0.5, vF.y));
  // the roof's overhang lays a band of shadow along the wall's head; one bay of the ground storey is a door, darker than the wall, in a frame, a worn step under it
  wallC *= 1. - 0.5*smoothstep(vG.y - 0.75, vG.y - 0.2, vF.y);
  float dbay = floor(fract(cbSeed*13.7)*nbh), isD = (1. - step(0.5, wid.y))*(1. - step(0.5, abs(wid.x - dbay)));
  float door = isD*cbBox(wq, vec2(0.2, -0.2), vec2(0.8, 0.84), vec2(cbPix/bwh, cbPix/shh));
  float dfrm = door*(1. - cbBox(wq, vec2(0.27, -0.2), vec2(0.73, 0.79), vec2(cbPix/bwh, cbPix/shh)));
  win *= 1. - isD;
  cbAlb = mix(wallC, vec3(0.04, 0.045, 0.05), win*lodH);
  cbAlb = mix(cbAlb, mix(vec3(0.085, 0.06, 0.045) + 0.07*(0.5 + 0.5*cos(6.2832*(fract(cbSeed*5.3) + vec3(0., 0.3, 0.6)))), wallC*0.45, dfrm), door*mix(0.6, 1., lodH));
  vec3 lampH = mix(vec3(1.0, 0.6, 0.27), vec3(1.0, 0.8, 0.52), fract(hw*7.3));
  cbEmi += lampH*litW*mix(0.22, win*(0.4 + 0.6*bars), lodH)*(0.12 + 1.5*uDark)*uLitGain*0.34*(1. - isD*(1. - lodH));
  cbRough = 0.85;
} else if (cbKind > 9.5) {
  // round nine: the beacon tower (kind 10). vF.x runs along the face from its corner, vF.y is the height, vG = (the face's length, the height of the tier's foot),
  // the seed says which tier: 0.1 uplit stone with piers and slot windows, 0.5 the crown of tall lit windows (it was painted in the board's squares until round eleven), 0.9 the lantern.
  float tx = vF.x, ty = vF.y, tl = max(vG.x, 1.), hgt = max(vF.y - vG.y, 0.);
  float nb = max(floor(tl/3.4 + 0.5), 1.), bw = tl/nb, bx = fract(tx/bw), by = fract(hgt/3.8);
  float lodT = 1. - smoothstep(0.22, 0.8, cbPix/bw);
  vec3 stone = vec3(0.6, 0.41, 0.22)*(0.76 + 0.3*cbVn(vec2(tx*0.33 + cbSeed*40., ty*0.06)))*(0.9 + 0.2*cbVn(vec2(tx*1.9, ty*1.4))*lodT);
  stone *= 1. - 0.3*smoothstep(0.55, 0.85, cbVn(vec2(tx*0.9 + 3., ty*0.045)))*(0.5 + 0.5*lodT);          // rain has run down it
  float pier = smoothstep(0.26, 0.33, abs(bx - 0.5));
  float slot = cbBox(vec2(bx, by), vec2(0.3, 0.16), vec2(0.7, 0.88), vec2(cbPix/bw, cbPix/3.8));
  float sfl = floor(hgt/3.8), sgrp = cbH11(floor(sfl/4.)*3.3 + 1.7);          // round eleven: its storeys are lit four at a time (offices in use, offices dark), no even grid
  float slotLit = step(cbH21(vec2(floor(tx/bw), sfl) + cbSeed*7.), mix(0.04, 0.04 + 1.6*uLit, step(0.42, sgrp)));
  float recess = step(mod(floor(tx/bw) + 2., 5.), 0.5);                         // one bay in five is set back: a dark groove up the face
  // round thirteen: the passing wall is a building. Every eighth storey is a plant floor (louvres, no windows, a string course over it and its shadow under it), the
  // storeys between are offices lit by the suite (two to four bays, lit or dark as one, a few with blinds half down), pipes run up the grooves
  float fz8 = hgt/30.4 + 0.07, mech = step(fract(fz8), 0.125), crs = step(0.125, fract(fz8))*step(fract(fz8), 0.14);
  float louvre = 0.55 + 0.45*step(0.5, fract(hgt/0.42));
  float suite = cbH21(vec2(floor((floor(tx/bw) + floor(sfl*1.7))/3.), sfl) + cbSeed*19.);
  slotLit = max(slotLit*step(0.3, suite), step(0.82, suite)*uDark)*(1. - mech);
  slot *= 1. - mech;
  { float solid = step(0.255, cbSeed)*step(cbSeed, 0.295); slot *= 1. - solid; slotLit *= 1. - solid; recess *= 1. - solid; mech *= 1. - solid; }
  float blindT = step(0.55 + 0.4*cbH21(vec2(floor(tx/bw), sfl)*1.3 + 2.2), by);
  vec3 body = mix(stone*0.8, stone*(0.82 + 0.3*pier), lodT)*(1. - 0.4*recess*(0.4 + 0.6*lodT));
  body = mix(body, vec3(0.03, 0.034, 0.04), slot*lodT);
  body = mix(body, stone*0.5*louvre, mech*mix(0.6, 1., lodT));
  body = mix(body, stone*1.28, crs);
  body *= 1. - 0.3*smoothstep(0.14, 0.141, fract(fz8))*(1. - smoothstep(0.14, 0.2, fract(fz8)));
  float pipeT = recess*(1. - smoothstep(0.1, 0.16, abs(bx - 0.5)))*lodT;
  body = mix(body, vec3(0.2, 0.17, 0.14)*(0.8 + 0.4*step(0.5, fract(hgt/5.7))), pipeT*0.85);
  float up = 0.32 + 1.2*exp(-hgt/30.);                                    // lamps on the setback below wash each tier from its foot
  float swp = (fract(ty/205. - uTime*0.085 - uBandPh) - 0.5)*205./11.;              // a band of brighter light climbs the tower, eleven metres deep, once in twelve seconds
  float band = exp(-swp*swp);
  float flank = 1. - 0.42*step(0.62, fract(cbSeed*25.));                 // seeds 0.11, 0.51, 0.91: the faces along the avenue
  up *= flank;
  vec3 wash = vec3(1.0, 0.58, 0.25)*up*(1. + 1.2*band)*mix(0.55, 1., smoothstep(90., 320., length(vViewPosition)));          // round thirteen: close up the wash is at half strength: lit stone, no orange slab
  if (cbSeed < 0.3) {
    cbAlb = body;
    if (cbSeed > 0.15 && cbSeed < 0.25) {
      // the lift shaft (seed 0.2): a glass shaft up the tower's flank, cool white inside, floor lines, mullions, and a lit car that rides it
      float gx = abs(fract(tx/1.1) - 0.5), flr = fract(ty/3.8);
      float carY = 17. + 94.*(0.5 - 0.5*cos(uTime*0.23 + 6.2832*uBandPh)), car = (1. - smoothstep(1.6, 2.2, abs(ty - carY)));
      vec3 glassL = vec3(0.56, 0.74, 0.86)*(0.1 + 0.26*uDark)*(0.7 + 0.3*step(0.12, flr))*(0.6 + 0.4*smoothstep(0.05, 0.12, gx));
      cbAlb = mix(vec3(0.05, 0.06, 0.07), vec3(0.2, 0.2, 0.21), 1. - smoothstep(0.03, 0.08, min(gx, min(flr, 1. - flr)*3.8)));
      cbEmi += (glassL + car*vec3(1.0, 0.86, 0.6)*(0.25 + 0.6*uDark))*cbNearK*1.3;
    } else {
    cbEmi += slot*slotLit*lodT*vec3(1.0, 0.82, 0.55)*uLitGain*0.3*mix(1., 0.35, blindT) + slotLit*(1. - lodT)*vec3(1.0, 0.8, 0.5)*uLitGain*0.03;
    cbEmi += step(0.875, cbH11(floor(hgt/3.8)*1.7 + 3.1))*mix(1., slot, lodT)*vec3(1.0, 0.8, 0.5)*uLitGain*0.3*uDark*(1. - step(0.255, cbSeed)*step(cbSeed, 0.295));          // one floor in eight is lit from end to end: bands of light up the shaft, no even grid in the close pass
    cbEmi += cbAlb*wash*(0.1 + 1.25*uDark);
    }
  } else if (cbSeed < 0.7) {
    // round eleven (ONE checkerboard, the hill's): the middle tier is the tower's own. A crown of tall lit windows between stone piers: five storeys 11.5 m high, each a
    // band of warm amber and orange light behind glass with a dark spandrel under it, every storey its own lamp, the tier's corners solid stone. As large as the paint
    // was, in the same place, and brighter after dark; by day the glass is dark and the stone takes the sky (no glow in the afternoon looks).
    float nbay = max(floor(tl/2.3 + 0.5), 1.), bwid = tl/nbay, wx = fract(tx/bwid), fl = hgt/11.5, wy = fract(fl), fid = floor(fl), bid = floor(tx/bwid);
    float lodW = 1. - smoothstep(0.25, 0.9, cbPix/bwid);
    float inner = step(0.5, bid)*step(bid, nbay - 1.5);                                      // the corner bays are stone
    float glassM = cbBox(vec2(wx, wy), vec2(0.17, 0.13), vec2(0.83, 0.9), vec2(cbPix/bwid, cbPix/11.5))*inner;
    float trans = smoothstep(0.03, 0.07, abs(fract(wy*3. + 0.2) - 0.5));                      // two transoms across each tall window
    vec3 lampC = mix(vec3(1.0, 0.48, 0.15), vec3(1.0, 0.66, 0.3), cbH11(fid*5.1 + 2.3));        // amber and orange, storey by storey
    float roomK = (0.76 + 0.24*cbH11(fid*3.7 + 1.3))*(0.78 + 0.36*cbH21(vec2(bid, fid) + 4.4))*(0.66 + 0.34*wy);
    roomK *= mix(0.14, 1., step(0.24, cbH21(vec2(floor((bid + fid)*0.5), fid) + 9.7)));          // round thirteen: a quarter of its halls are dark, two bays at a time: a crown with rooms, no even grid
    vec3 glassE = lampC*roomK*mix(0.75, trans, lodW);
    vec3 farW = lampC*0.6*step(0.13, wy)*step(wy, 0.9)*inner;                                  // too far for a bay: the storey is one band of light
    cbAlb = mix(mix(stone*0.8, stone*(0.86 + 0.3*pier), lodT), vec3(0.045, 0.05, 0.055), glassM*lodW);
    cbEmi += mix(farW, glassE*glassM*0.8, lodW)*(0.05 + 1.5*uDark)*(1. + 0.35*band)*cbNearK;          // round thirteen: 2.3 -> 1.5 and the band's lift 0.5 -> 0.35: the crown glows, it does not bloom into a gold column
    cbEmi += cbAlb*wash*(0.1 + 1.25*uDark);
  } else {
    float mull = smoothstep(0.05, 0.11, abs(fract(tx/2.25) - 0.5))*smoothstep(0.04, 0.1, abs(fract(hgt/6.) - 0.5));
    cbAlb = mix(vec3(0.16, 0.13, 0.09), vec3(0.07, 0.06, 0.05), mull);
    cbEmi += vec3(1.0, 0.7, 0.34)*mull*(0.2 + 0.62*uDark)*(0.8 + 0.2*sin(uTime*2.3))*(0.6 + 0.4*smoothstep(0., 0.5, fract(hgt/6.)));          // round thirteen: 2.4 -> 0.62: the lantern's glass stays under the bloom's threshold (its lamp is the glow)
  }
  cbRough = 0.7;
} else {
  // the open front of a market stall: goods piled on the counter, a dark back, a valance under the tarpaulin; most are lit by a bare bulb
  float fy = vF.y/max(vG.y, 0.5);
  vec2 gid = floor(vec2(vF.x/0.45, vF.y/0.35));
  float gh = cbH21(gid + cbSeed*13.), gh2 = cbH21(gid*1.9 + cbSeed*5.);
  vec3 goods = (gh < 0.5 ? vec3(0.34, 0.2, 0.08) : gh < 0.8 ? vec3(0.2, 0.3, 0.1) : gh < 0.93 ? vec3(0.42, 0.3, 0.07) : vec3(0.4, 0.1, 0.06))*(0.7 + 0.6*gh2);
  float shelf = step(fy, 0.55)*(1. - 0.5*smoothstep(0.3, 1.0, cbPix));
  vec3 fr = mix(vec3(0.04, 0.04, 0.045), goods*(0.6 + 0.4*cbVn(vF.xy*3.)), shelf);
  float val = step(0.86, fy);
  float on = step(fract(cbSeed*5.3), 0.45 + uLit + 0.3*uDark);
  cbEmi += (fr + 0.03)*vec3(1.0, 0.75, 0.45)*on*(0.45 + 1.9*uDark)*(1. - val)*(0.5 + 0.5*fy);
  cbAlb = mix(fr, diffuseColor.rgb*0.6, val);
  cbRough = 0.8;
}
cbEmi += cbAlb*uSky*0.5;
{ // round thirteen: what stands beside the squatters' lane on the hill takes its lamps' light, as the slope under it does (the lane's line in the hill's own coordinates)
  vec2 dpl = vP.xz - uHill.xy; vec2 abl = vec2(-(dpl.x*uHill.z + dpl.y*uHill.w), dpl.x*uHill.w - dpl.y*uHill.z);
  float lndl = abs(abl.y - (78. + 22.*sin(abl.x*0.021 + 1.0)));
  cbEmi += cbAlb*vec3(1.0, 0.66, 0.36)*exp(-lndl*lndl/420.)*step(-146., abl.x)*step(abl.x, 46.)*step(3., vP.y)*(0.08 + 1.5*uDark); }
{ // and what stands beside the lanes of the village round the board takes their lamps' light (the lanes' lines in the hill's own coordinates: VILLAGE)
  vec2 dpv = vP.xz - uHill.xy; vec2 abv = vec2(-(dpv.x*uHill.z + dpv.y*uHill.w), dpv.x*uHill.w - dpv.y*uHill.z);
  float vl = min(abs(abs(abv.y) - ${at.laneB.toFixed(1)}) + 40.*(1. - step(${at.a0.toFixed(1)}, abv.x)*step(abv.x, ${at.a1.toFixed(1)})), abs(abv.x - ${at.headA.toFixed(1)}) + 40.*step(${at.headB.toFixed(1)}, abs(abv.y)));
  cbEmi += cbAlb*vec3(1.0, 0.66, 0.36)*exp(-vl*vl/60.)*step(3., vP.y)*(0.06 + 1.3*uDark)*(1. - 0.6*step(10.5, cbKind));
  // what stands on a roof under the approach line (tin rooms, tanks, planters: the plain and the planted kinds, off the hill) stands in the light of that roof's bulbs after dark
  if ((cbKind > 1.5 && cbKind < 2.5 || cbKind > 3.5 && cbKind < 4.5) && vP.y > 11.) cbEmi += cbAlb*vec3(1.0, 0.8, 0.56)*0.6*uDark*(1. - smoothstep(${(St-6).toFixed(1)}, ${(St+2).toFixed(1)}, cbRoute(vP.xz)))*step(1., length(abv/vec2(150., 215.))); }
cbEmi += cbAlb*uPoolCol*cbPool(vP.xz)*(0.22 + 0.78*max(dot(normalize(vN0), uSunDir), 0.));
cbEmi += (cbAlb + 0.012)*vec3(1.0, 0.95, 0.84)*cbLand(vP)*step(0.5, normalize(vN0).y)*(0.2 + 1.3*uDark)*1.7;          // our landing lamps on the roofs and whatever lies open to the sky on them
diffuseColor.rgb = cbAlb*cbShade(vP.xz);
`,Oa=`
vec3 cbStreet(float ac, float al, float hw, float pix){
  float n = cbVn(vec2(ac, al)*0.35);
  vec3 asph = vec3(0.05, 0.053, 0.058)*(0.7 + 0.6*n);
  float pave = smoothstep(hw - 2.9, hw - 2.6, abs(ac));
  vec3 c = mix(asph, vec3(0.2, 0.19, 0.175)*(0.75 + 0.35*cbH21(floor(vec2(ac, al)/0.9))), pave);
  float fade = 1. - smoothstep(0.25, 0.9, pix);
  float dash = step(fract(al/9.), 0.4)*(1. - smoothstep(0.12, 0.12 + pix, abs(ac)));
  c = mix(c, vec3(0.55), dash*(1. - pave)*fade);
  float kerb = 1. - smoothstep(0.1, 0.1 + pix, abs(abs(ac) - (hw - 2.75)));
  c = mix(c, vec3(0.5, 0.42, 0.12), kerb*fade*0.7);
  return c;
}
vec4 cbLane(float ac, float al, float lane, float dirn, float spd, float dens, float L, vec2 half2, float pix, out vec3 emi){
  float s = al*dirn/L - uTime*spd/L + cbH11(lane*7.13)*37.;
  float i = floor(s), f = fract(s);
  float on = step(cbH11(i*1.37 + lane*19.1), dens);
  float y = (f - 0.5)*L;
  float body = cbBox(vec2(ac, y), -half2, half2, vec2(pix*0.7))*on;
  float hk = cbH11(i*3.1 + lane*5.7);
  vec3 col = hk < 0.42 ? vec3(0.62, 0.05, 0.04) : hk < 0.62 ? vec3(0.66) : hk < 0.8 ? vec3(0.08, 0.09, 0.1) : vec3(0.72, 0.68, 0.48);
  vec3 top = hk < 0.42 ? vec3(0.6, 0.62, 0.64) : hk > 0.8 ? vec3(0.08, 0.36, 0.18) : col*0.55;
  col = mix(col, top, cbBox(vec2(ac, y), vec2(-half2.x*0.75, -half2.y*0.6), vec2(half2.x*0.75, half2.y*0.35), vec2(pix*0.7)));
  float yh = y - half2.y - 1.3, yt = y + half2.y;
  emi = on*sign(spd)*(vec3(1.0, 0.9, 0.7)*exp(-(yh*yh*1.2 + ac*ac*2.5))*0.6*(1. + 1.5*uDark) + vec3(1.0, 0.04, 0.02)*exp(-(yt*yt*3. + ac*ac*1.1))*1.6);
  return vec4(col, body);
}
`,Na=`
vec2 p = vP.xz; vec2 pxv = fwidth(p); float pix = max(max(pxv.x, pxv.y), 1e-3);
vec3 cbAlb; float cbRough = 0.9; vec3 cbEmi = vec3(0.);
float cbFres = pow(1. - clamp(abs(dot(normalize(vViewPosition), normalize(vNormal))), 0., 1.), 4.);
float ax = abs(p.x) - 12.; float lx = mod(max(ax, 0.), 76.); float sgn = p.x < 0. ? -1. : 1.;
float inX = step(0., ax)*step(lx, 60.);
float zs = -366. - p.y; float lz = mod(max(zs, 0.), 48.);
float zw = p.y + 330.; float lzw = mod(max(zw, 0.), 48.);
float wf = step(p.x, -150.)*step(0., zw);
float inZ = mix(step(0., zs)*step(lz, 34.), step(14., lzw)*step(zw, 144.), wf);
float boul = step(zs, 0.)*step(-36., zs);
float quay = wf*step(144., zw);
float ac, al, hw, lid;
if (boul > 0.5) { ac = p.y + 348.; al = p.x; hw = 18.; lid = 500.; }
else if (inX < 0.5) { ac = ax < 0. ? p.x : (lx - 68.)*sgn; al = p.y; hw = ax < 0. ? 12. : 8.; lid = (ax < 0. ? 0. : floor(ax/76.) + 1.)*sgn*3.1; }
else { ac = wf > 0.5 ? lzw - 7. : lz - 41.; al = p.x; hw = 7.; lid = 100. + (wf > 0.5 ? 60. + floor(zw/48.) : floor(zs/48.)); }
float street = max(boul, 1. - inX*inZ)*(1. - quay);
vec3 road = cbStreet(ac, al, hw, pix);
float lodc = 1. - smoothstep(0.45, 1.5, pix);
lodc *= 1. - max(boul*(1. - smoothstep(404., 420., abs(p.x))), (1. - boul)*(1. - inX)*step(abs(p.x), 12.)*smoothstep(-1096., -1080., p.y));
float s1 = ac > 0. ? 1. : -1.; float aa = abs(ac);
float big = step(10., hw), isB = boul, ns = (1. - boul)*(1. - inX);
vec3 e1, e2, e3, e4; vec2 car = vec2(0.95, 2.2);
float spd = mix(mix(3.5, 12., ns), 14., isB);
vec4 l1 = cbLane(aa - mix(2.1, 5.0, isB), al, lid + s1*0.37, s1, spd, mix(0.35, 0.55, ns), 8.5, car, pix, e1);
vec4 l2 = cbLane(aa - mix(5.6, 8.4, isB), al, lid + s1*0.61, s1, spd*0.8*big, 0.5*big + 0.75*(1. - big), 8.5, car, pix, e2);
vec4 l3 = cbLane(aa - 11.8, al, lid + s1*0.83, s1, 11., 0.5*isB, 8.5, car, pix, e3);
vec4 l4 = cbLane(aa - 1.6, al, lid + s1*0.19, s1, 8., 0.4*isB, 64., vec2(1.15, 5.4), pix, e4);
l4.rgb = mix(vec3(0.05, 0.24, 0.12), vec3(0.6, 0.58, 0.45), step(0.6, abs(aa - 1.6)));
road = mix(road, l1.rgb, l1.a*lodc); road = mix(road, l2.rgb, l2.a*lodc); road = mix(road, l3.rgb, l3.a*lodc); road = mix(road, l4.rgb, l4.a*lodc);
cbEmi += (e1 + e2*big + e3 + e4*0.6)*lodc*uHead*street;
// crossings at the block corners, shop light spilling on the wet road
float edge = hw - aa; float n9 = cbVn(p*1.7);
cbEmi += street*vec3(1.0, 0.6, 0.28)*exp(-edge*0.4)*(0.3 + 0.7*cbVn(vec2(al*0.2, lid)))*(0.1 + uLit)*uLitGain*0.2;
vec3 pave = vec3(0.17, 0.165, 0.155)*(0.75 + 0.35*cbVn(p*0.5));
pave = mix(pave, vec3(0.2, 0.2, 0.19)*(0.7 + 0.4*cbH21(floor(p/6.))), quay);
// the tram's rails down the middle of the boulevard, crossings where the last avenue meets it
float gfade = 1. - smoothstep(0.3, 1.0, pix);
float rail = (1. - smoothstep(0.05, 0.05 + pix, abs(abs(aa - 1.6) - 0.72)))*boul*gfade;
road = mix(road, vec3(0.34, 0.35, 0.36), rail*0.8*(1. - max(l4.a, l1.a)*lodc));
float zb = boul*step(abs(abs(p.x) - 15.5), 2.2)*step(aa, 14.8)*step(0.5, fract(ac/1.3));
zb = max(zb, ns*step(ax, 0.)*step(abs(p.y + 369.5), 1.8)*step(abs(p.x), 8.8)*step(0.5, fract(p.x/1.3)));
road = mix(road, vec3(0.5, 0.5, 0.47)*(0.75 + 0.25*n9), zb*gfade*0.8);
// sodium lamps along the boulevard and the last avenue: pools of orange on the wet road, faint by day
float lzA = (fract((p.y + 1080.)/36. + 0.5) - 0.5)*36., lxB = (fract((p.x + 405.)/30. + 0.5) - 0.5)*30.;
float sodA = exp(-(lzA*lzA + (abs(p.x) - 8.)*(abs(p.x) - 8.))*0.016)*ns*step(ax, 0.)*smoothstep(-1110., -1085., p.y);
float sodB = exp(-(lxB*lxB + (aa - 14.)*(aa - 14.))*0.016)*boul*step(abs(p.x), 420.)*step(13., abs(p.x));
cbEmi += vec3(1.0, 0.58, 0.2)*(sodA + sodB)*(0.015 + 0.2*uDark)*(0.5 + 0.5*uWet)*street;
cbAlb = mix(pave, road, street);
// the playground inside the turn
vec2 pk = (p - vec2(${Ne[0].toFixed(1)}, ${Ne[1].toFixed(1)}))/vec2(68., 41.);
float inPk = cbBox(pk, vec2(-1.), vec2(1.), pxv/vec2(68., 41.));
float od = length(pk*vec2(1., 0.92));
vec2 pm = pk*vec2(68., 41.); float plw = max(0.35, 0.8*pix);
vec3 pitch = vec3(0.06, 0.17, 0.06)*(0.82 + 0.3*step(0.5, fract(pm.x/7.)))*(0.85 + 0.3*cbVn(p*0.6));
vec2 fh = vec2(42., 24.);
float fdr = max(abs(pm.x) - fh.x, abs(pm.y) - fh.y);
float fl = 1. - smoothstep(plw, plw + pix, abs(fdr));
fl = max(fl, (1. - smoothstep(plw, plw + pix, abs(pm.x)))*step(fdr, 0.));
fl = max(fl, 1. - smoothstep(plw, plw + pix, abs(length(pm) - 7.)));
fl = max(fl, (1. - smoothstep(plw, plw + pix, abs(max(abs(abs(pm.x) - (fh.x - 7.)) - 7., abs(pm.y) - 14.))))*step(fdr, 0.));
pitch = mix(pitch, vec3(0.6, 0.62, 0.56), fl*(1. - smoothstep(1.5, 4., pix)));
float lanes = 0.8 + 0.2*step(0.5, fract(od*41./1.25));
pitch = mix(pitch, vec3(0.4, 0.15, 0.09)*lanes, smoothstep(0.7, 0.72, od)*(1. - smoothstep(0.92, 0.94, od)));
pitch = mix(pitch, vec3(0.2, 0.2, 0.19)*(0.7 + 0.3*step(0.5, fract(od*41./2.2))), smoothstep(0.94, 0.96, od));
cbAlb = mix(cbAlb, pitch, inPk); street *= 1. - inPk; cbEmi *= 1. - inPk;
cbEmi += pitch*vec3(0.85, 1.0, 0.8)*inPk*uDark*(0.35 + 0.4*exp(-od*od*1.2));           // floodlit after dark
float wetm = (0.25 + 0.75*street)*(0.5 + 0.5*cbVn(p*0.11))*uWet;
cbRough = mix(0.92, max(0.16, uPudR + 0.05), wetm);
cbEmi += wetm*(uSky*0.02 + uHz*0.6*cbFres);
cbEmi += cbAlb*uPoolCol*cbPool(p)*mix(0.7, 0.3, street);
cbEmi += (cbAlb + 0.012)*vec3(1.0, 0.95, 0.84)*cbLand(vP)*(0.2 + 1.3*uDark)*0.9;          // our landing lamps on the streets
diffuseColor.rgb = cbAlb*cbShade(p);
`,Ka=`
vec2 p = vP.xz; vec2 pxv = fwidth(p); float pix = max(max(pxv.x, pxv.y), 1e-3);
vec3 cbAlb; float cbRough = 0.9; vec3 cbEmi = vec3(0.);
float cbFres = pow(1. - clamp(abs(dot(normalize(vViewPosition), normalize(vNormal))), 0., 1.), 4.);
float axx = abs(p.x); vec2 fw2 = vec2(pix);
float n1 = cbVn(p*0.22), n2 = cbVn(p*0.031);
float n3 = cbVn(p*0.008 + 3.7);
float gustw = smoothstep(0.4, 0.85, cbVn(p*0.03 - uTime*vec2(0.28, 0.36)));     // gusts combing the wet grass
// the undershoot is mown in bands that run with the approach; the rest of the field keeps its diagonal cut
float under = (1. - smoothstep(118., 126., axx))*(1. - smoothstep(-74., -66., p.y));
float mow = smoothstep(0.5 - pix/9., 0.5 + pix/9., abs(fract(p.x/18.) - 0.5)*2.);
float mow2 = smoothstep(0.5 - pix/12., 0.5 + pix/12., abs(fract(p.y/24.) - 0.5)*2.);          // and crossed once the other way: bands 12 m wide that pass under the wheels
float cut = mix(0.93 + 0.1*step(0.5, fract((p.y + p.x*0.5)/16.)), (0.86 + 0.22*mow)*(0.93 + 0.14*mow2), under);
vec3 grass = mix(vec3(0.095, 0.125, 0.065), vec3(0.15, 0.145, 0.075), smoothstep(0.35, 0.8, n3)*0.7 + 0.2*n1)*(0.85 + 0.2*n2)*cut*(0.86 + 0.3*gustw);
float bladeK = 1. - smoothstep(0.08, 0.7, pix);                                 // blades and tussocks near the wheels
float blade = cbVn(p*vec2(6., 1.5)), tuft = cbVn(p*0.9 + 31.);
grass *= mix(1., (0.62 + 0.76*blade)*(0.78 + 0.44*smoothstep(0.3, 0.75, tuft)), bladeK);
grass = mix(grass, vec3(0.2, 0.17, 0.085)*(0.7 + 0.5*blade), 0.35*smoothstep(0.62, 0.8, cbVn(p*0.37 + 5.))*(0.4 + 0.6*bladeK));
vec3 conc = vec3(0.3, 0.29, 0.27)*(0.72 + 0.3*cbH21(floor(p/7.5)))*(0.85 + 0.2*n1);
vec2 jt = abs(fract(p/7.5) - 0.5)*7.5;
conc *= 1. - 0.45*(1. - smoothstep(0.06, 0.06 + pix, 3.75 - max(jt.x, jt.y)))*(1. - smoothstep(0.3, 1.2, pix));
vec3 asph = vec3(0.075, 0.078, 0.084)*(0.7 + 0.5*n1)*(0.85 + 0.3*n2);
// round seven: the undershoot is paved. The runway's stopway runs back to the fence under the approach lights, with an apron either side of it (parked wide-bodies,
// floodlight masts, service roads) and a strip of grass between: wet pavement that carries every lamp, the gate's rings and the portal as reflections.
float usZ = step(-322., p.y)*step(p.y, -44.);
float rw = step(axx, 30.5)*step(-322., p.y)*step(p.y, 3300.);
float sho = step(axx, 38.)*step(-322., p.y)*step(p.y, 3310.);
float taxi = step(abs(p.x - 110.), 15.)*step(-322., p.y);
float apU = min(step(50., p.x) + step(p.x, -50.)*step(p.y, -100.), 1.)*usZ;
float srv = min(step(abs(p.x - 59.75), 3.6) + step(abs(p.x + 130.75), 3.6)*step(p.y, -100.), 1.)*usZ;
float link = step(30., p.x)*step(p.x, 125.)*(step(abs(p.y - 30.), 14.) + step(abs(p.y - 900.), 14.) + step(abs(p.y - 1900.), 14.) + step(abs(p.y - 3240.), 14.));
// the perimeter road inside the fence, a gravel track beside the approach lights, two concrete drains that run in toward the threshold
float peri = step(abs(p.y + 318.), 4.)*step(-150., p.x);
float track = (1. - smoothstep(1.0, 1.0 + pix, abs(p.x - 8.5)))*step(-314., p.y)*step(p.y, -70.);
float drain = 0., lips = 0.;
float apron = max(max(step(215., p.x), step(190., p.x)*step(p.y, 470.)), apU);
float rim = max(step(202., p.x), step(p.x, -52.))*step(-40., p.y);
cbAlb = grass;
cbAlb = mix(cbAlb, conc*0.8, max(rim, apron));
cbAlb = mix(cbAlb, asph*1.25, max(taxi, min(link, 1.)));
cbAlb = mix(cbAlb, asph*1.45, srv*(1. - taxi));
cbAlb = mix(cbAlb, vec3(0.5, 0.5, 0.47), srv*(1. - taxi)*(1. - smoothstep(0.1, 0.1 + pix, abs(abs(abs(p.x - (p.x > 0. ? 59.75 : -130.75)) - 1.75) - 1.6)))*(1. - smoothstep(0.5, 2.2, pix))*0.7);
cbAlb = mix(cbAlb, asph*1.3, peri);
cbAlb = mix(cbAlb, vec3(0.6, 0.47, 0.08), peri*(1. - smoothstep(0.12, 0.12 + pix, abs(abs(p.y + 318.) - 3.5)))*(1. - smoothstep(0.5, 2.2, pix))*0.8);
cbAlb = mix(cbAlb, vec3(0.19, 0.18, 0.15)*(0.7 + 0.5*cbH21(floor(p/0.35))*bladeK + 0.25*(1. - bladeK)), track*(1. - peri)*0.85);
cbAlb = mix(cbAlb, conc*0.95, lips*(1. - peri));
cbAlb = mix(cbAlb, vec3(0.035, 0.04, 0.042), drain*(1. - peri));
cbAlb = mix(cbAlb, asph*1.5, sho);
float fade = 1. - smoothstep(0.5, 2.2, pix);
// rubber and wear
float rub = (1. - smoothstep(4., 15., axx))*smoothstep(60., 220., p.y)*(1. - smoothstep(700., 1100., p.y));
vec3 rwc = asph*(1. - 0.45*rub*(0.6 + 0.4*cbVn(vec2(p.x*2.2, p.y*0.02))));
float stopK = 1. - smoothstep(-74., -66., p.y);                                 // the stopway: older, paler asphalt in slabs, tar lines between them
vec2 sj = abs(fract(vec2(p.x/12.66 + 0.5, p.y/22.)) - 0.5)*vec2(12.66, 22.);
rwc = mix(rwc, vec3(0.115, 0.118, 0.125)*(0.72 + 0.4*n1)*(0.85 + 0.3*n2)*(0.9 + 0.2*cbH21(floor(vec2(p.x/12.66 + 0.5, p.y/22.)))), stopK);
rwc *= 1. - 0.4*stopK*(1. - smoothstep(0.1, 0.1 + pix, min(sj.x, sj.y)))*(1. - smoothstep(0.4, 1.6, pix));
float mk = 0.;
mk = max(mk, 1. - smoothstep(0.45, 0.45 + pix, abs(axx - 28.6)));
mk = max(mk, (1. - smoothstep(0.45, 0.45 + pix, axx))*step(fract((p.y - 70.)/50.), 0.6)*step(70., p.y));
mk = max(mk, cbBox(vec2(fract((axx - 2.)/3.6), p.y), vec2(0.12, 6.), vec2(0.62, 36.), vec2(pix/3.6, pix))*step(2., axx)*step(axx, 27.));
float tz = floor((p.y - 127.5)/150.); float tl = p.y - 127.5 - tz*150.;
float tn = step(0., tz)*step(tz, 5.5);
float bars = cbBox(vec2(fract((axx - 9.)/3.), tl), vec2(0.1, 0.), vec2(0.62, 22.5), vec2(pix/3., pix))*step(9., axx)*step(axx, 9. + 3.*max(1., 3. - floor(tz*0.5)));
mk = max(mk, bars*tn*(1. - step(1.5, tz)*step(tz, 2.5)));
mk = max(mk, cbBox(vec2(axx, p.y), vec2(9., 400.), vec2(19., 445.), fw2));
float worn = 0.55 + 0.45*cbVn(p*vec2(1.3, 0.25));
rwc = mix(rwc, vec3(0.62, 0.61, 0.57)*worn, mk*fade*(1. - 0.5*rub));
float chev = step(p.y, -4.)*(1. - smoothstep(0.5, 0.5 + pix, abs(fract((p.y - axx*0.9)/16.) - 0.5)*16.));
rwc = mix(rwc, vec3(0.6, 0.47, 0.08)*worn, chev*fade);
rwc = mix(rwc, vec3(0.62, 0.61, 0.57), (1. - smoothstep(1.5, 1.5 + pix, abs(p.y - 2.)))*fade);
cbAlb = mix(cbAlb, rwc, rw);
float ty = (1. - smoothstep(0.25, 0.25 + pix, abs(p.x - 110.)))*taxi + (1. - smoothstep(0.25, 0.25 + pix, abs(mod(p.y + 250., 85.) - 42.5)))*step(215., p.x)*step(p.x, 400.)*step(p.y, 300.);
ty += (1. - smoothstep(0.25, 0.25 + pix, abs(mod(p.y + 300., 100.) - 50.)))*step(-128., p.x)*step(p.x, -52.)*usZ*step(p.y, -100.);
ty += (1. - smoothstep(0.25, 0.25 + pix, min(abs(p.y + 130.), abs(p.y + 245.))))*step(126., p.x)*step(p.x, 214.);
cbAlb = mix(cbAlb, vec3(0.6, 0.47, 0.08), min(ty, 1.)*fade*(1. - rw));
cbAlb = mix(cbAlb, vec3(0.5, 0.09, 0.05), (1. - smoothstep(0.3, 0.3 + pix, abs(axx - 51.5)))*usZ*apU*fade*0.8);
float hard = max(max(max(rw, sho), max(peri, max(track, lips))), max(max(taxi, min(link, 1.)), max(apron, rim)));
float pud = smoothstep(0.66, 0.8, cbVn(p*0.09 + 11.3)*0.55 + 0.3*cbVn(p*0.45) + 0.15*mix(0.5, cbVn(p*2.1), bladeK))*mix(0.8, 0.55 + 0.45*cbVn(p*3.1), bladeK)*(1. - hard)*uWet;     // standing water on the grass
cbAlb = mix(cbAlb, vec3(0.045, 0.05, 0.05), pud*0.75);
float film = 0.25 + 0.75*smoothstep(0.2, 0.8, cbVn(p*0.07)*0.6 + cbVn(p*vec2(0.21, 0.035) + 7.)*0.4);      // the wet film on concrete and asphalt lies in patches and wind streaks
float wetm = max(max(hard*film*uWet*(1. - 0.5*uDark), pud), drain*(1. - peri));
cbRough = mix(0.92, max(0.14, uPudR + 0.05), wetm);
cbEmi += wetm*(uSky*0.02 + uHz*mix(0.7, 0.5, pud)*cbFres) + (uSky + uFill*1.6)*(1. - hard)*(1. - pud)*(0.03 + 0.3*cbFres)*uWet*(0.6 + 0.6*gustw);
float lzr = mod(p.y + 30., 60.) - 30., lxr = axx - 31.5, lzc = mod(p.y + 15., 30.) - 15.;
float gE = exp(-(lxr*lxr + lzr*lzr)*0.04)*step(-1., p.y)*step(p.y, 3301.);
float gC = exp(-(p.x*p.x + lzc*lzc)*0.1)*step(15., p.y)*step(p.y, 3290.);
float gT = exp(-(p.y + 1.)*(p.y + 1.)*0.05)*step(8.5, axx)*step(axx, 43.);
cbEmi += (0.3 + 0.7*wetm)*(vec3(1.0, 0.9, 0.74)*(gE*0.28 + gC*0.12) + vec3(0.08, 1.0, 0.3)*gT*0.2);
// round five: the wet runway mirrors its lights. Every lamp lays a streak toward the eye, and the portal on the threshold a long one.
vec2 eyeV = cameraPosition.xz - p; vec2 eDir = eyeV/max(length(eyeV), 1.);
float fwdK = smoothstep(0.05, 0.3, -eDir.y);
float slp = eDir.x/max(-eDir.y, 0.25);
float spE = p.y < 1185. ? 30. : 60.;
float tE = spE - mod(p.y, spE), tC = 30. - mod(p.y, 30.);
float fE = smoothstep(0., 2., tE)*exp(-tE/11.), fC = smoothstep(0., 2., tC)*exp(-tC/11.);
float wE = 0.5 + pix*1.5 + 0.035*tE, wC = 0.45 + pix*1.5 + 0.03*tC;
float dR = p.x - 31.5 - tE*slp, dL = p.x + 31.5 - tE*slp, dC = p.x - tC*slp;
float sE = (exp(-dR*dR/(wE*wE)) + exp(-dL*dL/(wE*wE)))*fE*step(-28., p.y)*step(p.y, 3300.);
float sC = exp(-dC*dC/(wC*wC))*fC*step(1., p.y)*step(p.y, 3290.);
float dT1 = dC - 10.5, dT2 = dC + 10.5;
float sT = (exp(-dT1*dT1/(3.2 + wC*wC)) + exp(-dT2*dT2/(3.2 + wC*wC)))*fC*step(31., p.y)*step(p.y, 900.);
float tG = -1. - p.y; float xG = abs(p.x - tG*slp);
float sG = smoothstep(0., 1.5, tG)*exp(-max(tG, 0.)/9.)*step(8.5, xG)*step(xG, 43.)*(0.7 + 0.3*cos(xG*2.094));
float tP = -p.y; float dP = p.x - tP*slp;
float sP = exp(-dP*dP/(150. + 0.03*tP*tP))*smoothstep(0., 8., tP)*exp(-max(tP, 0.)/110.);
float wetS = clamp(hard*(0.3 + 0.7*film)*uWet + pud, 0., 1.)*(0.8 + 0.2*sin(p.y*2.7 + uTime*2.3 + p.x*1.3));
cbEmi += fwdK*wetS*(0.3 + 0.7*uDark)*(vec3(1.0, 0.9, 0.74)*(sE*1.25 + sC*0.7 + sT*0.6) + vec3(0.08, 1.0, 0.3)*sG*0.6) + fwdK*wetS*uPortal*sP*mix(0.28, 0.2, uDark);
// round seven: the approach lights' bars and the stopway's amber edge lights lay their streaks on the wet stopway too
float tB = mod(-60. - p.y, 33.), tA = 15. - mod(p.y + 315., 15.);
float fB = smoothstep(0., 2., tB)*exp(-tB/9.)*step(-345., p.y)*step(p.y, -60.);
float fA = smoothstep(0., 1.5, tA)*exp(-tA/7.)*step(-330., p.y)*step(p.y, -15.);
float dB = p.x - tB*slp, dAR = p.x - 31.5 - tA*slp, dAL = p.x + 31.5 - tA*slp;
float sB = exp(-dB*dB/(20. + wC*wC))*fB;
float sA = (exp(-dAR*dAR/(wE*wE)) + exp(-dAL*dAL/(wE*wE)))*fA;
cbEmi += fwdK*wetS*(0.3 + 0.7*uDark)*(vec3(1.0, 0.8, 0.52)*sB*0.8 + vec3(1.0, 0.6, 0.18)*sA*1.1);
// and the gate itself: the two rings of lit rain and the portal's disc, mirrored in the film of water on the pavement. The eye's ray is carried on through the ground to the
// gate's plane (z = 2.5) and read there at its mirrored height; wind on the film stretches the picture toward the eye, as a wet road does.
float gzd = max(2.5 - p.y, 0.);
float gt = (2.5 - cameraPosition.z)/max(p.y - cameraPosition.z, 0.5);
float gx = cameraPosition.x + (p.x - cameraPosition.x)*gt;
float gy = max(cameraPosition.y, 0.)*(gt - 1.)*(0.8 + 0.4*cbVn(p*vec2(1.9, 0.31) + vec2(0., uTime*0.35)));
float grr = length(vec2(gx, gy - 21.));
float gw = 5. + 0.03*gzd;
float gd1 = grr - 54., gd2 = grr - 111.6;
float gmir = (exp(-gd1*gd1/(gw*gw))*0.6 + exp(-gd2*gd2/(2.*gw*gw))*0.3 + exp(-gd1*gd1/(60.*gw))*0.1 + (1. - smoothstep(17., 22. + 0.04*gzd, grr))*0.36)
  *step(p.y, 2.4)*step(cameraPosition.z + 0.5, p.y)*smoothstep(0., 5., gy);
gmir *= 0.55 + 0.45*cbVn(p*vec2(0.9, 0.16) + vec2(0., uTime*0.3));          // broken by the film's own patches: the chevrons and the bars' streaks stay readable through it
cbEmi += wetS*uPortal*gmir*(0.4 + 0.6*uDark)*smoothstep(0.02, 0.2, -eDir.y);
// the floodlights of the apron and the pier lay pools of sodium light on the concrete; every bar of the approach lights lights the grass round its feet
float lzM = mod(p.y - 95., 110.) - 55., lzN = mod(p.y + 315., 110.) - 55.;
float pM = exp(-((p.x - 142.)*(p.x - 142.) + lzM*lzM)/1700.)*step(95., p.y)*step(p.y, 975.) + exp(-((p.x - 412.)*(p.x - 412.) + lzN*lzN)/1700.)*step(-315., p.y)*step(p.y, 345.);
float lzU = mod(p.y + 347.5, 95.) - 47.5, lzV = mod(p.y + 350., 100.) - 50.;                 // the masts of the two aprons beside the stopway
pM += (exp(-((p.x - 148.)*(p.x - 148.) + lzU*lzU)/1500.) + exp(-((p.x + 140.)*(p.x + 140.) + lzV*lzV)/1500.))*step(-345., p.y)*step(p.y, -55.) + 0.8*exp(-((p.x + 72.)*(p.x + 72.) + (p.y + 78.5)*(p.y + 78.5))/420.);
float lzB = mod(-43.5 - p.y, 33.) - 16.5;
float pB = exp(-(p.x*p.x*0.5 + lzB*lzB)/70.)*step(p.y, -44.)*step(-341., p.y) + exp(-(p.y + 291.)*(p.y + 291.)/60.)*(1. - smoothstep(20., 30., axx))
  + exp(-(p.y + 225.)*(p.y + 225.)/60.)*(1. - smoothstep(16., 25., axx)) + exp(-(p.y + 159.)*(p.y + 159.)/60.)*(1. - smoothstep(12., 21., axx)) + exp(-(p.y + 93.)*(p.y + 93.)/60.)*(1. - smoothstep(8., 16., axx));
pB += 0.5*exp(-(axx - 31.5)*(axx - 31.5)/14.)*step(-322., p.y)*step(p.y, -8.)*(0.6 + 0.4*cos(6.2832*(p.y + 315.)/15.));          // the pools of the stopway's edge lights
cbEmi += cbAlb*vec3(1.0, 0.74, 0.42)*pM*(0.15 + 1.9*uDark) + (cbAlb + pud*0.07)*vec3(1.0, 0.8, 0.52)*pB*(0.25 + 2.4*uDark);
// and all of them together a corridor of lit grass through the dark field, seen from the boulevard on
float pC = exp(-p.x*p.x/2200.)*smoothstep(-345., -300., p.y)*(1. - smoothstep(-60., -20., p.y));
cbEmi += (cbAlb + pud*0.05)*vec3(1.0, 0.8, 0.52)*pC*(0.04 + 0.5*uDark);
// the far shore across the typhoon shelter: wet asphalt yards under sodium light
float shoreK = step(385., p.x)*step(400., p.y);
cbAlb = mix(cbAlb, asph*1.4, shoreK*0.85);
cbEmi += shoreK*vec3(1.0, 0.58, 0.2)*(0.01 + 0.1*uDark)*smoothstep(0.45, 0.8, cbVn(p*0.045 + 2.));
cbEmi += cbAlb*(uSky*0.4 + uFill)*(1. + 0.45*uDark*(1. - hard));               // the sky fill the city takes, and under a low sun the glow of the horizon as well: the field is not a black floor
// the running strobes of the lead-in gantries on the stopway (one every 33 m from the fence to 60 m short of the bar): each flash lays its light on the wet pavement
// under its gantry for the moment it burns, so a pulse of light runs down the stopway toward the threshold with the lamps themselves, on their own rhythm
// (uChain.x: how many strobes the whole chain has; the lamp shader's own timing)
{ float gi = clamp(floor((-60. - p.y)/33. + 0.5), 0., 8.), gz = -60. - gi*33.;
  float gf = fract(uTime*0.8 - 0.9*(1. - gi/max(uChain.x - 1., 1.)));
  float gb = smoothstep(0., 0.05, gf)*(1. - smoothstep(0.05, 0.3, gf));
  cbEmi += (cbAlb + 0.01 + pud*0.06)*vec3(0.82, 0.9, 1.0)*gb*uStrobe*exp(-p.x*p.x/110. - (p.y - gz)*(p.y - gz)/70.)*step(-345., p.y)*1.5; }
// round six: the landing lights. A long pool of white light runs ahead of the aircraft over the undershoot and the threshold, nearer and brighter as it comes down.
// The pool is cbLand's, the law the roofs, the streets and the slope call, at the airfield's own level: one law from the first roof to the threshold.
float land = cbLand(vec3(p.x, 0., p.y));
cbEmi += (cbAlb + 0.012 + pud*0.09)*vec3(1.0, 0.95, 0.84)*land*(0.2 + 1.3*uDark)*(1. - 0.45*hard);          // standing water glints in them; on the wet pavement the pool is dimmer and the lamps' own reflections carry the picture
cbEmi += cbAlb*uPoolCol*cbPool(p)*0.75;
diffuseColor.rgb = cbAlb*cbShade(p);
`,Ia="uniform vec3 uBoard; uniform vec3 uScrub, uChkA, uChkB, uBoardK, uBoardL, uBSun; uniform float uFlood; uniform vec4 uCreep[12];",Wa=`
vec2 p = vP.xz; float cbRough = 0.95; vec3 cbEmi = vec3(0.);
float sl = clamp(normalize(vN0).y, 0., 1.);
vec2 dp = p - uHill.xy;
vec2 ab = vec2(-(dp.x*uHill.z + dp.y*uHill.w), dp.x*uHill.w - dp.y*uHill.z);
float n1 = cbVn(p*0.045), n2 = cbVn(p*0.21 + 7.), n3 = cbVn(p*1.3), n4 = cbVn(p*1.9 + 3.1), n5 = cbVn(p*5.3);
vec2 hfw = fwidth(p); float hpx = max(hfw.x, hfw.y);
float fine = 1. - smoothstep(0.1, 0.9, hpx);
vec3 scrub = mix(uScrub*0.75, uScrub*1.25 + vec3(0.03, 0.045, 0.), n1*0.55 + n2*0.45)*(0.68 + 0.42*n2)*(0.75 + 0.4*n3);
scrub *= mix(1., 0.6 + 1.6*n4*n5, fine);
scrub *= 0.8 + 0.42*smoothstep(0.3, 0.75, cbVn(p*0.8 + 17.));
vec3 dry = vec3(0.25, 0.225, 0.12)*(0.7 + 0.4*n2)*mix(1., 0.7 + 0.6*n5, fine);
vec3 rock = vec3(0.31, 0.29, 0.27)*(0.55 + 0.55*n2)*(0.75 + 0.35*cbVn(vec2(p.x*0.3 + vP.y*0.4, vP.y*0.9)))*(1. - 0.55*uDark);          // round nine: after dark the bare rock of the skirt was the palest thing under the turn (a grey blob in the corner of the frame)
vec3 cbAlb = mix(scrub, dry, smoothstep(0.55, 0.8, n1*0.45 + n2*0.4 + n3*0.25));
cbAlb = mix(cbAlb, uScrub*0.5*(0.55 + 0.9*n3), 0.55*smoothstep(0.34, 0.8, cbVn(p*0.17 + 3.))*smoothstep(0.55, 0.8, sl));          // thicket in soft drifts (the dark patches had outlines)
cbAlb = mix(rock, cbAlb, smoothstep(0.7, 0.86, sl + 0.14*n2));
float crag = smoothstep(0.62, 0.9, cbVn(p*0.55 + 5.))*smoothstep(0.45, 0.7, cbVn(p*0.085 + 9.));      // boulders, in clusters, each a metre or two
cbAlb = mix(cbAlb, mix(rock, cbAlb*1.3, 0.55)*(0.62 + 0.5*n5*fine), 0.42*crag);          // stones in the colour of the ground they lie on, no pale core with a dark rim (it read as camouflage paint)
cbAlb = mix(vec3(0.2, 0.2, 0.19)*(0.7 + 0.4*n3)*(1. - 0.5*uDark), cbAlb, smoothstep(0.4, 5., vP.y + 2.*n2));
cbAlb *= mix(1., 0.72 + 0.56*cbVn(p*1.9)*cbVn(p*7.3 + 3.) + 0.22*smoothstep(0.86, 0.93, cbVn(p*6.5 + 9.)), 1. - smoothstep(0.05, 0.5, hpx));          // round eight: grain, stones and litter that come in close up: the nearest ground of the flight is not the smoothest
vec2 bq = vec2(ab.y/uBoard.y, (ab.x - uBoard.x)/uBoard.z);
vec2 bfw = max(fwidth(bq), vec2(1e-4));
float inb = cbBox(bq, vec2(-1.), vec2(1.), bfw);
vec2 cg = (bq + 1.)*3.; vec2 cell = floor(cg), cf = fract(cg);
float chk = mod(cell.x + cell.y, 2.);
vec2 ee = smoothstep(vec2(0.), bfw*1.6, cf)*(1. - smoothstep(vec2(1.) - bfw*1.6, vec2(1.), cf));          // crisp squares (the edge was four pixels of blend)
// THE PAINT. The orange is a pigment, not a signal lamp: under a low warm sun it keeps its yellow (warmL: how far the day's light, uPoolCol, leans to red). Every
// square was painted on its own day: some are fresh, some chalked and faded (sqOld), some dirtier than their neighbours (sqB); the whites are bone, never paper, and
// greyer where they are old. Everything about the paint is the board's own, in the board's coordinates: nothing here reads where the eye stands.
float warmL = clamp(1.4 - 2.*uPoolCol.g/max(uPoolCol.r, 1e-3), 0., 1.)*(1. - uFlood);
vec3 chkO = uChkA + vec3(0., uChkA.r*0.34*warmL, 0.); chkO *= mix(1., 0.9*dot(uChkA, vec3(0.3, 0.6, 0.1))/max(dot(chkO, vec3(0.3, 0.6, 0.1)), 1e-3), warmL);
float sqm = ee.x*ee.y, sqB = cbH21(cell*1.7 + 11.3), sqOld = smoothstep(0.45, 0.95, cbH21(cell + 3.7));
vec3 pO = mix(chkO, chkO*vec3(0.9, 1.1, 1.12), sqOld)*(0.86 + 0.2*sqB);
vec3 pW = uChkB*mix(vec3(0.97, 0.97, 0.96), vec3(0.78, 0.79, 0.79), sqOld)*(0.88 + 0.16*sqB);
vec3 paint = mix(mix(pO, pW, 0.4), mix(pO, pW, chk), sqm);
paint *= mix(uBoardK.y, 1., uFlood);
// round six: the board close up. It is painted on concrete panels 5.25 m square (two to a painted square), their joints dark; rain has streaked the paint down the slope and it has flaked off in chips.
vec2 bm = bq*uBoard.y; float bpx = max(bfw.x, bfw.y)*uBoard.y;
float bfine = 1. - smoothstep(0.12, 0.7, bpx);
float bpn = uBoard.y/9.; vec2 jq = abs(fract(bm/bpn + 0.5) - 0.5)*bpn;          // panels three to a painted square
float joint = (1. - smoothstep(0.05, 0.05 + bpx, min(jq.x, jq.y)))*(1. - smoothstep(0.25, 1.1, bpx));
float wear = cbVn(p*0.6)*0.55 + cbVn(vec2(bm.x*1.3, bm.y*0.1))*0.5;
float streak = cbVn(vec2(bm.x*2.6, bm.y*0.09 + 3.));
float chip = smoothstep(0.62, 0.7, cbVn(bm*2.3 + 11.)*0.6 + cbVn(bm*6.1)*0.4)*bfine;
float bmid = 1. - smoothstep(0.5, 2.2, bpx);          // round thirteen: seams, streaks and wear carry to the middle distance (they stopped at 0.7 m a pixel: from the run-in the board was a flat floor)
paint *= (0.92 + 0.1*wear)*(1. - 0.1*smoothstep(0.5, 0.8, streak)*bfine);
float runs = smoothstep(0.52, 0.86, cbVn(vec2(bm.x*0.85 + 1.7, bm.y*0.035 + 4.)))*(0.55 + 0.45*cbVn(vec2(bm.x*3.1, bm.y*0.12)));          // rain has run down the slope from the berms and the head wall
paint *= 1. - 0.13*runs*bmid;          // round eleven: the rain's streaks are a close-up detail only (from the approach they read as a smeared board)
// The broad weathering, at the scale of the squares. Three berms cross the board (bz: 0 at the head wall, 4 at the foot, a berm at 1, 2 and 3) and the rain that
// collects on each runs on down the paint below it: a band of grime right under every berm and under the head wall, and grey tears two or three metres wide that
// reach ten to twenty metres down the slope from it; each of the four terraces between them has weathered at its own rate. A third of the squares have flaked back
// to grey concrete along their lower edge, where the water stands longest. (bbig: these are metres wide and stay until a pixel is wider than they are.)
float bz = (bq.y + 1.)*2., bterr = floor(clamp(bz, 0., 3.99));
float below = fract(clamp(bz, 0., 3.99))*uBoard.y*0.5;
float bbig = 1. - smoothstep(1.2, 3.5, bpx);
float rcol = cbVn(vec2(bm.x*0.42 + bterr*7.3, 2.1)), rcol2 = cbVn(vec2(bm.x*1.15 + bterr*3.1, 9.4));
float tears = smoothstep(0.5, 0.78, rcol*0.65 + rcol2*0.35)*exp(-below/(5. + 14.*rcol));
tears = max(tears, 0.55*exp(-below/2.4));
paint = mix(paint, paint*vec3(0.58, 0.6, 0.6) + vec3(0.02), 0.62*tears*bbig*(1. - 0.4*uFlood));
paint *= 0.9 + 0.17*cbH11(bterr*5.7 + 2.3);
{ float flk = step(0.62, cbH21(cell*2.3 + 7.1)), fdep = 0.07 + 0.2*cbH21(cell*3.1 + 2.), few = max(0.025, bfw.y*4.5);
  float fedge = cf.y + 0.16*(cbVn(bm*0.4 + 31.) - 0.5) + 0.07*(cbVn(bm*1.6 + 3.) - 0.5);
  float flake = flk*smoothstep(1. - fdep - few, 1. - fdep + few, fedge)*smoothstep(0.3, 0.5, cbVn(bm*0.8 + 5.) + 0.5*smoothstep(1. - fdep*0.5, 1., fedge))*bbig;
  paint = mix(paint, vec3(0.3, 0.29, 0.27)*(0.8 + 0.35*cbVn(bm*1.3 + 2.)), 0.85*flake); }
// round seven: it is a painted hillside, not a sign. Damp stands in it in big patches, soot and moss creep in from its upper edge and its sides, and the white has weathered to bone.
float damp = cbVn(bm*0.075 + 5.)*0.6 + cbVn(bm*0.21 + 9.)*0.4;
paint *= 0.94 + 0.08*smoothstep(0.25, 0.75, damp);          // bright fresh paint: no grey in the squares
paint = mix(paint, paint*vec3(0.62, 0.66, 0.52), 0.42*smoothstep(0.8, 1.02, max(abs(bq.x), 0.06 - bq.y*0.94) + 0.22*(damp - 0.5)));
{ float dcor = length((1. - abs(bq))*uBoard.y);          // the four corners, where the kerb's gutters meet, are stained
  paint = mix(paint, paint*vec3(0.5, 0.52, 0.42), 0.62*exp(-dcor/11.)*(0.55 + 0.45*cbVn(bm*0.3 + 21.))); }
paint = mix(paint, vec3(0.33, 0.31, 0.29), max(smoothstep(0.92, 1.0, wear)*0.2, chip*0.3)*bfine);
paint *= 1. - 0.22*joint;
// round thirteen: the cast panels are seen from the run-in too: every panel a little lighter or darker than its neighbour (weathered at its own rate), the pour seams
// between them a dark line half a metre wide once it is a line at all (mean kept: no grey veil from far off)
vec2 pid = floor(bm/bpn + 0.5);
paint *= 1. + (cbH21(pid*1.37 + 5.1) - 0.5)*0.13*bmid;
float seam = (1. - smoothstep(0.1, 0.1 + max(bpx, 0.12), min(jq.x, jq.y)))*bmid;
paint *= 1. - 0.2*seam*(1. - smoothstep(0.25, 1.1, bpx)*0.5);
// two maintenance ladders are bolted up the board (b = +-0.64): rails and rungs close up, a thin dark line from the approach
float ldx = abs(abs(bq.x) - 0.64)*uBoard.y;
float lrail = (1. - smoothstep(0.07, 0.07 + bpx, abs(ldx - 0.28)));
float lrung = (1. - smoothstep(0.05, 0.05 + bpx, abs(fract(bm.y/0.45) - 0.5)*0.45))*step(ldx, 0.28)*(1. - smoothstep(0.08, 0.3, bpx));
float ladder = max(lrail, lrung)*(1. - smoothstep(0.3, 1.5, bpx)*0.7);
paint = mix(paint, vec3(0.2, 0.2, 0.21), ladder*0.85);
paint *= 1. - 0.25*(1. - smoothstep(0., 0.5, ldx - 0.3))*step(0.3, ldx)*bfine;          // each lays a shadow beside it
{ float lfy = fract(bm.y/6.25)*6.25;          // each ladder is bolted to the slab every 6.25 m, and every fixing weeps rust down the paint below it
  float rust = exp(-lfy/2.6)*(1. - smoothstep(0.25, 0.55 + 0.14*lfy, ldx))*(0.6 + 0.4*cbVn(vec2(bm.x*4., bm.y*0.3)));
  rust = max(rust, 0.3*(1. - smoothstep(0.3, 1.1, ldx)));
  paint = mix(paint, paint*vec3(0.62, 0.36, 0.2) + vec3(0.05, 0.02, 0.), 0.75*rust*(1. - smoothstep(1.5, 5., bpx))); }
float sur = cbBox(bq, vec2(-1.3), vec2(1.3), bfw*2.);
// the apron round it: cast slabs with their joints, rain streaks running down the slope
vec2 aj = abs(fract(bm/4.2 + 0.5) - 0.5)*4.2;
float ajl = (1. - smoothstep(0.06, 0.06 + bpx, min(aj.x, aj.y)))*(1. - smoothstep(0.25, 1.1, bpx));
vec3 apr = vec3(0.36, 0.35, 0.33)*(0.62 + 0.4*n2)*(0.82 + 0.28*cbH21(floor(bm/4.2)))*(1. - 0.3*ajl);
apr *= 1. - 0.24*smoothstep(0.5, 0.8, cbVn(vec2(bm.x*1.9 + 7., bm.y*0.11)));
// the apron's drains: an open channel crosses it two metres below the foot kerb, where the board's water is caught (a dark slot with a pale worn lip), and where each
// berm's gutter comes through the side wall a damp streak runs on down the apron below the outlet
{ float drn = abs(bq.y - 1.058)*uBoard.y, dlod = 1. - smoothstep(1.2, 4., bpx);
  apr = mix(apr, vec3(0.07, 0.07, 0.075), (1. - smoothstep(0.32, 0.32 + bpx, drn))*step(abs(bq.x), 1.22)*dlod);
  apr *= 1. + 0.3*(1. - smoothstep(0.4, 1.3, drn))*step(0.32 + bpx, drn)*step(abs(bq.x), 1.22)*dlod;
  float osx = abs(abs(bq.x) - 1.075)*uBoard.y;
  apr *= 1. - 0.42*exp(-below/8.)*(1. - smoothstep(0.5, 1.5 + 0.1*below, osx))*step(1., bz)*step(bz, 4.)*(1. - smoothstep(2., 6., bpx)); }
float fd = max(1. - bq.y, 0.)*uBoard.y;
// round eight: four masts stand before its foot (b = -45, -15, 15, 45) and throw fans of light up the slope (after round eleven a faint trace on the paint, no more).
float fanW = 0.5 + 0.5*cos(6.2832*(ab.y/uBoard.y*1.4 + 1.5));
// round eleven: the board is floodlit by its own lamps on the kerb wall, one every twelve metres down both sides, along its head and along its foot: the paint is lit
// evenly from edge to edge (it was hot along its foot and went to a dim grey at its head) and each lamp lays a warm pool on the paint's rim, the apron and the wall
float dSide = abs(1. - abs(bq.x))*uBoard.y, dHead = abs(bq.y + 1.)*uBoard.y, dFoot = abs(1. - bq.y)*uBoard.y;
float pSide = exp(-dSide/8.)*(0.55 + 0.45*cos(6.2832*(bq.y + 1.)*4.));
float pHead = exp(-dHead/8.)*(0.55 + 0.45*cos(6.2832*(bq.x + 1.)*4.));
float pFoot = exp(-dFoot/10.)*(0.55 + 0.45*cos(6.2832*(bq.x + 0.8333)*4.2));
float pools = min(pSide + pHead + pFoot, 1.3);
// AFTER DARK LIGHT FALLS ACROSS THE PAINT from the lamps that stand round it, and lies on the paint only. Eight floodlamps on low posts along the foot (footL): a
// scallop of light over each, widening and merging up the slope, half of it gone 20 m up; nine lamps on the kerb wall down each side (sideL) and seven along the
// head (headL), each a smaller scallop reaching ten or twelve metres in; the gantry on the four masts before the foot washes the lower middle (mastL). The foot is
// the brightest of it, the middle and the head stand in what is left: still the brightest surface on the hill. Near a lamp the light is the lamp's own warm colour,
// further off it is the whiter mix of all of them (bWarm).
float lxF = (fract((bq.x + 0.8333)*4.2 + 0.5) - 0.5)*uBoard.y/4.2, wF = 2.6 + 0.42*fd, scF = exp(-lxF*lxF/(wF*wF));
float footL = mix(scF, 0.62, 1. - exp(-fd/16.))/(1. + pow(max(fd, 1e-3)/20., 1.7))*(1. - 0.5*smoothstep(0.86, 1.02, abs(bq.x)));
float lyS = (fract((bq.y + 1.)*4. + 0.5) - 0.5)*uBoard.y*0.25, wS = 2.4 + 0.5*dSide, scS = exp(-lyS*lyS/(wS*wS));
float sideL = mix(scS, 0.6, 1. - exp(-dSide/12.))/(1. + pow(max(dSide, 1e-3)/11., 1.8));
float lxH = (fract((bq.x + 1.)*4. + 0.5) - 0.5)*uBoard.y*0.25, wH = 2.4 + 0.5*dHead, scH = exp(-lxH*lxH/(wH*wH));
float headL = mix(scH, 0.6, 1. - exp(-dHead/12.))/(1. + pow(max(dHead, 1e-3)/10., 1.8));
float mastL = (0.6 + 0.4*fanW)*exp(-(fd - 26.)*(fd - 26.)/1150.);
float bL = 0.58 + 1.75*footL + 1.0*sideL + 1.15*headL + 0.55*mastL;
float bWarm = clamp(scF*exp(-fd/7.) + scS*exp(-dSide/6.) + scH*exp(-dHead/6.), 0., 1.);
float flood = mix(0.5 + 1.3*pools, bL, inb);
flood = mix(1., flood, uFlood*sur);
// three berms cross it, 25 m apart up the slope (drain channels with a kerb 0.8 m high). After dark each kerb's rise catches the foot lamps and throws a band of
// shadow seven metres up the slope behind it; by day its shadow lies where the look's sun puts it (uBSun: the sun in the board's own axes: across, down the slope,
// along the normal), the kerb's top takes the sky and its face is in shade
float bsd = (fract(bz + 0.5) - 0.5)*uBoard.y*0.5;
float bOnZ = step(0.5, bz)*step(bz, 3.5)*inb, bOn = bOnZ*(1. - smoothstep(1.2, 3.5, bpx));
float lipW = max(1.0, 1.3*bpx);
float bLip = smoothstep(-bpx, 0., bsd)*(1. - smoothstep(lipW, lipW + bpx, bsd))*bOnZ*(1. - 0.55*smoothstep(1.2, 3.5, bpx));
float shLen = mix(clamp(0.8*abs(uBSun.y)/max(uBSun.z, 0.12), 0.5, 9.), 7., uFlood);
float sdd = mix(uBSun.y >= 0. ? 1. : 0., 1., uFlood) > 0.5 ? -bsd : bsd - 1.;          // metres into the shadow, on the side of the kerb away from the light
float bSh = smoothstep(-max(bpx, 0.1), 0., sdd)*(1. - smoothstep(shLen*0.3, shLen, sdd))*bOnZ*(1. - smoothstep(1.5, 4., bpx));
paint = mix(paint, vec3(0.4, 0.39, 0.36)*(0.8 + 0.3*cbH21(floor(vec2(bm.x/3.5, bz + 0.5)))), bLip*0.75);
paint *= (1. - 0.3*bSh*(1. - uFlood))*(1. - 0.4*bLip*(1. - uFlood));
flood *= (1. + 0.7*bLip*inb)*(1. - 0.5*bSh*inb);
// by day the kerb wall on the sun's side lays its shadow along that edge of the paint, the trees of the margin throw their dark over the edges (it moves as they
// do), a line of damp shade lies at the foot of every wall, the cast slabs have settled unevenly and take the light a little differently, and the squall's broken
// cloud shadow stays off the paint as it always did: the shaft of storm light stands on it (bDay: all of the day's shaping of the light on the paint)
float kwS = 1.5*abs(uBSun.x)/max(uBSun.z, 0.12), dSun = (uBSun.x >= 0. ? 1. - bq.x : 1. + bq.x)*uBoard.y;
float kSh = 1. - smoothstep(kwS*0.6, kwS + 0.3 + bpx, dSun);
float dEdge = min(dSide, dHead);
float tsh = smoothstep(0.4, 0.7, cbVn(bm*0.2 + 13.))*(0.75 + 0.25*cbVn(bm*0.9 + uTime*vec2(0.21, 0.13)))*exp(-dEdge/6.)*(bq.x*uBSun.x > 0. || dHead < dSide ? 1. : 0.4);
float bDay = (1. - 0.42*kSh)*(1. - 0.4*tsh)*(1. + 0.16*(cbVn(bm*0.055 + 3.) - 0.5) + 0.07*(cbH21(floor(bm/bpn + 0.5)*2.1 + 1.3) - 0.5)*bmid);
paint *= 1. - 0.3*exp(-min(dEdge, dFoot)/0.9)*bfine;
// where the board's bank is steep it is a retaining wall of concrete blocks in courses (drawn in height and along the wall, so nothing smears down the slope)
float steepK = 1. - smoothstep(0.5, 0.82, sl);
vec2 wq = vec2((abs(bq.x) > abs(bq.y) ? ab.x : ab.y)/4.5, vP.y/2.4);
vec3 wallc = vec3(0.33, 0.32, 0.3)*(0.7 + 0.3*cbH21(floor(wq)))*(1. - 0.32*step(0.9, fract(wq.y)))*(1. - 0.22*step(0.93, fract(wq.x + 0.5*floor(wq.y))));
// rock flecks a metre or two across, and the paths worn down the slope from the board's lower corners
float fleck = smoothstep(0.7, 0.8, cbVn(p*0.7 + 23.))*(1. - smoothstep(0.3, 1.6, hpx));
cbAlb = mix(cbAlb, mix(rock, cbAlb, 0.5)*1.25*(0.75 + 0.5*n5*fine), 0.3*fleck*smoothstep(8., 16., vP.y));
float cpl = abs(abs(ab.y) - uBoard.y*1.16 - 6.*sin(ab.x*0.06) - max(ab.x - uBoard.x, 0.)*0.22);
float cpath = (1. - smoothstep(1.1, 1.1 + hpx, cpl))*step(uBoard.x - uBoard.z, ab.x)*(1. - smoothstep(1.6, 5., hpx));          // worn pale by feet, a little over two metres wide
cbAlb = mix(cbAlb, vec3(0.43, 0.38, 0.28)*(0.75 + 0.4*n3), cpath*0.85);
cbAlb = mix(cbAlb, mix(apr, wallc, steepK), sur);
cbAlb = mix(cbAlb, paint, inb);
// scrub and creeper come over the kerb at places along the sides and the head (uCreep: where each has its root on the kerb, in the board's own coordinates, and how
// many metres it reaches; the world stands shrubs on the kerb at the same places): ragged mats of leaves on the paint, the apron and the wall's foot
float creep = 0.;
{ float cnz = cbVn(bm*0.33 + 40.) - 0.5, cnz2 = cbVn(bm*1.4 + 7.) - 0.5;
  for (int i = 0; i < 12; i++) { vec4 cs = uCreep[i]; float cr = max(cs.z, 1.), cdm = length((bq - cs.xy)*uBoard.y) + cr*(1.1*cnz + 0.5*cnz2); creep = max(creep, (1. - smoothstep(cr*0.6, cr, cdm))*step(0.5, cs.z)); }
  creep *= cbBox(bq, vec2(-1.25), vec2(1.25), bfw*2.);
  cbAlb = mix(cbAlb, uScrub*(0.45 + 0.7*cbVn(bm*2.6 + 3.))*(0.7 + 0.6*cbVn(bm*7.)), creep*0.92); }
float gloss = smoothstep(0.3, 0.75, damp)*(1. - 0.6*chip)*(1. - creep);          // round thirteen: wet paint: where damp stands in it the board is glossy, and the sky's light slides over it as the eye moves
cbRough = mix(0.95, mix(0.62, 0.3, gloss), inb);
float swp = sin(bq.x*1.9 + bq.y*0.7 - uTime*0.9 + 1.3*sin(uTime*0.11));
float trl = abs(ab.y - 26. - 46.*sin(ab.x*0.013 + 0.6) - 9.*sin(ab.x*0.071));
float trail = (1. - smoothstep(0.9, 0.9 + hpx, trl))*step(ab.x, -18.)*step(-140., ab.x)*(1. - smoothstep(0.6, 2.4, hpx))*(1. - sur);
cbAlb = mix(cbAlb, vec3(0.3, 0.25, 0.17)*(0.75 + 0.4*n3), trail*0.85);
// round thirteen: the squatters' lane along the flank the turn looks down on (the part's laneB): trodden earth three metres wide, a lamp every thirteen metres
float lnd = abs(ab.y - (78. + 22.*sin(ab.x*0.021 + 1.0)));
float lnk = step(-141., ab.x)*step(ab.x, 41.)*(1. - sur);
cbAlb = mix(cbAlb, vec3(0.34, 0.28, 0.2)*(0.75 + 0.4*n3), (1. - smoothstep(1.5, 1.5 + hpx, lnd))*lnk*(1. - smoothstep(1.5, 5., hpx))*0.85);
cbEmi += cbAlb*vec3(1.0, 0.62, 0.3)*exp(-lnd*lnd/200.)*lnk*(0.6 + 0.4*cos(6.2832*ab.x/13.))*(0.06 + 2.6*uDark);
// the village round the board (the part's VILLAGE): a stepped lane climbs each side of the board beyond its margin of trees, winding from landing to landing, and a
// lane runs along its head; a lamp stands at every landing (nine and a half metres apart on the sides, twelve along the head) and lays its pool on the steps
float vza = 2.6*(abs(fract(ab.x/19.) - 0.5)*4. - 1.);
float vls = abs(abs(ab.y) - ${at.laneB.toFixed(1)} - vza) + 40.*(1. - step(${at.a0.toFixed(1)}, ab.x)*step(ab.x, ${at.a1.toFixed(1)}));
float vlh = abs(ab.x - ${at.headA.toFixed(1)}) + 40.*step(${at.headB.toFixed(1)}, abs(ab.y));
float vld = min(vls, vlh);
float vstep = step(0.78, fract((vls < vlh ? ab.x : ab.y)/0.9))*(1. - smoothstep(0.1, 0.5, hpx));
cbAlb = mix(cbAlb, vec3(0.37, 0.33, 0.27)*(0.75 + 0.4*n3)*(1. - 0.4*vstep), (1. - smoothstep(1.0, 1.0 + hpx, vld))*(1. - smoothstep(1.5, 5., hpx))*(1. - sur)*0.9);
cbEmi += cbAlb*vec3(1.0, 0.63, 0.31)*(exp(-vls*vls/70.)*(0.5 + 0.5*cos(6.2832*(ab.x - 22.)/${at.step.toFixed(1)})) + exp(-vlh*vlh/70.)*(0.5 + 0.5*cos(6.2832*ab.y/12.)))*(0.06 + 3.0*uDark)*(1. - 0.7*sur);
cbEmi += cbAlb*(uSky*0.55 + uDark*vec3(0.125, 0.1, 0.095))*(1. + 0.3*(1. - smoothstep(110., 260., length(vViewPosition)))*(1. - uDark));          // by day the slope under the close pass takes a third more of the sky's fill
cbEmi += cbAlb*uDark*vec3(0.25, 0.34, 0.54)*(1. - smoothstep(110., 330., length(vViewPosition)))*(1. - inb);          // round thirteen: after dark the slope within 300 m of the eye stands in our own lights and the moon's: a hillside, not a black mass
// after dark the floodlit board throws its orange onto the slope round it
vec2 bod = max(abs(vec2(ab.y, (ab.x - uBoard.x)*uBoard.y/uBoard.z)) - uBoard.y, 0.);
cbEmi += cbAlb*vec3(1.0, 0.46, 0.15)*uFlood*(1. - inb)*exp(-length(bod)/30.)*2.6*(1. - 0.55*sur);          // (round eleven: less of it on the apron and the wall, which have the lamps' own pools: they were a flat pink)
// seen from the scud, a kilometre and a half of wet air lies in front of the board: the shaft that stands on it keeps its orange alive
cbEmi += inb*chkO*(1. - mix(0.4, chk, sqm))*(uBoardK.z + 0.06*(1. - warmL))*(1. - uFlood)*bDay*(1. - creep);          // by day the orange squares glow a little of themselves (the white ones do not: no glare, no wash of white over the orange)
cbEmi += cbAlb*uPoolCol*cbPool(p)*mix(0.22 + 0.78*max(dot(normalize(vN0), uSunDir), 0.), 1., uFlood)*(1. - (1. - 0.4*uBoardK.x)*inb*(1. - uFlood))*mix(flood, (1. + 0.16*swp*swp*swp*inb)*mix(1., bDay, inb), 1. - uFlood)*mix(1., 0.4*(1. - inb), uFlood);
// round thirteen: the sheen. At a grazing angle the wet paint mirrors the sky at the horizon (the afterglow, the moonlit haze, the storm's pale edge), strongest where damp
// stands; a reflection, so it moves as the eye does (never a mirror: no image in it). Its level and its curve of angle are the same at every distance.
// And the floodlights (after dark) or the shaft of storm light (by day) sweep slowly over the board: a band of brighter light crossing it.
float bFres = pow(1. - clamp(abs(dot(normalize(vViewPosition), normalize(vNormal))), 0., 1.), 3.);
cbEmi += inb*(uHz*0.55 + uSky*0.25)*bFres*(0.35 + 0.65*gloss);
flood *= 1. + 0.12*swp*swp*swp*inb;
cbEmi += cbAlb*mix(uBoardL, uBoardL*vec3(1.14, 0.88, 0.6), 0.75*bWarm)*mix(vec3(1.22, 0.84, 0.55), vec3(1.), mix(0.4, chk, sqm))*flood*inb*uFlood;          // (in the lamps' light the orange burns a little hotter than the white beside it)          // round eleven: after dark the paint stands in the light of its own lamps (whiter than the street's sodium, so the orange stays orange and the white stays white), held under the bloom's threshold: no glare bleaches the squares          // round eight: after dark the board is a deep orange (two thirds of the light it had: brighter, the tone map bleaches it to salmon) and the apron round it is in half-light
cbEmi += cbAlb*vec3(1.0, 0.6, 0.28)*pools*0.5*sur*(1. - inb)*uFlood;          // and each kerb lamp's pool is warm on the apron and the wall
cbEmi += (cbAlb + 0.012)*vec3(1.0, 0.95, 0.84)*cbLand(vP)*(0.2 + 1.3*uDark)*0.8;          // our landing lamps on the slope
diffuseColor.rgb = cbAlb*mix(mix(1., cbShade(p), 0.75), mix(bDay, 1., uFlood), inb);
`,ja=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fogFactor = 1.0 - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #else
    float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
  #endif
  { float bm0 = max(max(gl_FragColor.r, gl_FragColor.g), gl_FragColor.b), kn = 0.6, top = 0.8;          // round thirteen: a soft knee on the paint: full brightness up to 0.6, never over 0.8 (the lowest bloom threshold of the looks is 0.86)
    float bm1 = bm0 > kn ? kn + (top - kn)*(1. - exp(-(bm0 - kn)/(top - kn))) : bm0;
    gl_FragColor.rgb *= mix(1., bm1/max(bm0, 1e-4), inb); }
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor*(1. - 0.4*inb));
#endif
`,Ua="uniform float uTime; attribute vec2 aUv; attribute vec4 aT; attribute vec3 aCc; varying vec2 vUvm; varying vec4 vT; varying vec3 vCc; varying vec3 vP; varying vec3 vN0;",$a="vUvm = aUv; vT = aT; vCc = aCc; if (aT.x > 5.5) transformed += vec3(normal.x, normal.y - 1., normal.z)*(sin(uTime*0.3 + aT.y*37.)*5.); vP = transformed; vN0 = normal;",Qa=`
varying vec2 vUvm; varying vec4 vT; varying vec3 vCc;
float cbLn(float d, float lw, float pix){ return 1. - smoothstep(lw, lw + pix, abs(d)); }
float cbYagi(vec2 q, float yb, float sd, float lw, float pix){
  float bl = 0.85 + 0.5*fract(sd*7.), ox = (fract(sd*3.3) - 0.5)*0.5, x = q.x - ox, dy = q.y - yb;
  float inb = step(abs(x), bl);
  float el = mix(0.42, 0.18, clamp((x + bl)/(2.*bl), 0., 1.));
  float ex = (fract(x/0.42 + 0.5) - 0.5)*0.42;
  return inb*max(cbLn(dy, lw, pix), cbLn(ex, lw, pix)*step(abs(dy), el));
}
`,Za=`
vec2 q = vUvm; float cw = vT.z, ch = vT.w, ty = vT.x, sd = vT.y;
vec2 pxv = fwidth(q); float pix = max(max(pxv.x, pxv.y), 1e-3);
float lw = max(0.022, 0.5*pix); float a = 0.; vec3 col = vec3(0.15, 0.155, 0.17); vec3 cbEmi = vec3(0.); float far = 0., fs = 0.3;
if (ty < 0.5) {
  a = cbLn(q.x, lw, pix);
  a = max(a, cbYagi(q, ch*0.94, sd, lw, pix));
  a = max(a, cbYagi(q, ch*(0.7 + 0.1*fract(sd*13.)), sd + 0.37, lw, pix)*step(0.25, fract(sd*5.)));
  a = max(a, cbYagi(q, ch*(0.48 + 0.1*fract(sd*29.)), sd + 0.71, lw, pix)*step(0.6, fract(sd*11.)));
  a = max(a, cbLn(abs(q.x) - (ch*0.6 - q.y)*0.3, lw*0.5, pix)*step(q.y, ch*0.6)*step(0.72, fract(sd*3.)));
  far = 0.1*step(abs(q.x), 1.2)*step(ch*0.45, q.y) + 0.3*step(abs(q.x), pix*0.5);
} else if (ty < 1.5) {
  vec2 gq = vec2(q.x + cw*0.5, q.y);
  a = max(cbLn((fract(gq.x/1.4) - 0.5)*1.4, lw, pix), cbLn((fract(gq.y/1.75) - 0.5)*1.75, lw, pix));
  a = max(a, cbLn((fract((gq.x*1.25 + gq.y)/7.) - 0.5)*4.2, lw, pix));
  col = vec3(0.2, 0.17, 0.11)*(0.6 + 0.5*cbH21(floor(gq/vec2(1.4, 1.75))));
  float net = step(0.12, cbVn(gq*0.07 + sd*20.));
  float poles = a*(1. - smoothstep(0.2, 0.7, pix));
  vec3 nc = mix(vec3(0.2, 0.42, 0.32), vec3(0.4, 0.48, 0.58), step(0.7, fract(sd*9.)))*(0.62 + 0.38*cbVn(gq*vec2(0.5, 0.12)))*(0.85 + 0.15*sin(gq.x*1.05 + sd*40. + 0.6*sin(gq.y*0.21)));
  // round thirteen: a wrapped face is not one green slab. The net hangs in drops 5.6 m wide, each its own shade (new, sun-bleached, one in five a faded tarpaulin
  // blue-grey); one drop in four stops short of the top and the frame shows over it; a darker line every 10.5 m is a working platform
  float drop = cbH21(vec2(floor(gq.x/5.6), sd*91.));
  nc *= 0.62 + 0.7*drop;
  nc = mix(nc, vec3(0.34, 0.4, 0.44)*(0.7 + 0.5*drop), step(0.8, fract(drop*7.3)));
  nc *= 1. - 0.3*step(0.86, fract(gq.y/10.5));
  net *= step(gq.y, ch*(1. - step(0.75, fract(drop*5.1))*(0.08 + 0.3*fract(drop*11.3))));
  // where the net is torn away only the poles are left: once they are thinner than a pixel the hole lets the wall behind through (widened to stay visible they closed it into a brown disc)
  nc = mix(nc, vec3(dot(nc, vec3(0.3, 0.6, 0.1))), 0.6*uGrey);          // under the squall the nets go the way of the roofs: the board's orange is the one saturated colour
  col = mix(col, nc, net*(1. - poles*0.6)); a = max(a*0.5*(1. - smoothstep(0.16, 0.5, pix)), net);          // small holes, quiet poles: a torn net, not a stain
  // after dark the flats behind glow through the net, bay by bay
  vec2 wg = gq/vec2(2.9, 3.), wf = fract(wg);
  float wl = step(0.6, cbH21(floor(wg) + sd*31.))*smoothstep(0.0, 0.3, wf.x)*(1. - smoothstep(0.7, 1.0, wf.x))*smoothstep(0.04, 0.36, wf.y)*(1. - smoothstep(0.62, 0.96, wf.y));
  cbEmi += net*uDark*mix(vec3(1., 0.68, 0.36), vec3(0.62, 0.95, 0.82), step(0.84, cbH21(floor(wg)*1.7 + sd*13.)))*0.075*uLitGain*wl;
  far = max(0.06, net); fs = 0.9;
} else if (ty < 3.5) {
  float leg = ty < 2.5 ? 0.3 : 0.;
  vec2 pp = vec2(q.x + cw*0.5, q.y - ch*leg), ps = vec2(cw, ch*(1. - leg));
  float border = min(min(pp.x, ps.x - pp.x), min(pp.y, ps.y - pp.y));
  float inside = step(0., border);
  float grid = min(abs(fract(pp.x/1.3) - 0.5)*1.3, abs(fract(pp.y/1.3) - 0.5)*1.3);
  a = inside*max(cbLn(grid, lw*0.5, pix), cbLn(border, lw*1.6, pix));
  float hs = min(ps.x, ps.y)*0.5; vec2 c = (pp - ps*0.5)/hs; float pn = pix/hs; float tw = max(0.05, 1.3*pn);          // round thirteen: tubes never thinner than a pixel and a third (0.9: far signs broke into dots)
  float shp = fract(sd*7.7);
  float d1 = abs(max(abs(c.x)*hs*2./ps.x*1.25, abs(c.y)) - 0.72);
  float d2 = abs(abs(c.x)*0.75 + abs(c.y) - 0.7)*0.75;
  // round thirteen: no figure that can be read as a letter: the wave of one and a half periods is a band of seven or more small peaks, the double wave three bars
  float d3 = max(abs(c.y - 0.15*sin(c.x*21. + sd*20.)), abs(c.x) - 0.6);
  float d5 = max(min(abs(c.y), abs(abs(c.y) - 0.36)), abs(c.x) - 0.6);
  float d4 = abs(length(c*vec2(0.72, 1.)) - 0.5);
  // round fourteen: a board under about a dozen pixels high carries one plain figure (the ring, the diamond): the band of small peaks and the three bars broke into
  // rows of dashes there, which read as lines of writing
  { float small = smoothstep(0.1, 0.17, pn); d3 = mix(d3, d4, small); d5 = mix(d5, d2, small); }
  float dt = shp < 0.3 ? min(d1, d2) : shp < 0.55 ? min(d1, d5) : shp < 0.8 ? min(d4, d1) : min(d1, d3);
  float tube = inside*(1. - smoothstep(tw, tw + pn, dt));
  col = mix(col, mix(vec3(0.2, 0.19, 0.18), vCc*0.22 + 0.1, uNeon), tube); a = max(a, tube);          // unlit tubes are grey glass, not a dim copy of their colour
  // round thirteen: capped at its source by distance from the eye (a sign at arm's length bloomed over the frame's edge), and the board behind the tubes takes a little
  // of their light, so that from far off a sign is a small coloured shape, not a dot
  float nearN = mix(0.4, 1., smoothstep(60., 240., length(vViewPosition)));
  cbEmi = vCc*uNeon*(tube*5. + inside*0.13*(1. - tube))*nearN*(0.86 + 0.14*sin(uTime*(9. + 20.*fract(sd*3.1)) + sd*90.));
  float lg = step(q.y, ch*leg)*step(abs(q.x), cw*0.32);
  a = max(a, lg*max(cbLn(abs(q.x) - cw*0.3, lw*1.3, pix), cbLn((fract((q.y + abs(q.x))/1.6) - 0.5)*1.1, lw, pix)));
  col = mix(col, vec3(0.26, 0.26, 0.28), 0.6); far = mix(0.1, 0.35, uNeon*step(0.02, vCc.r + vCc.g + vCc.b))*inside + mix(0.3, 0.8, uNeon)*tube; fs = 0.32;
} else if (ty < 4.5) {
  a = max(cbLn(q.x, lw*1.6, pix), cbLn(q.y - ch + 0.25, lw*1.4, pix));
  a = max(a, cbLn(abs(q.x) - (ch - 0.25 - q.y)*0.9, lw, pix)*step(ch - 2., q.y));
  col = mix(vec3(0.5), vec3(0.45, 0.1, 0.06), step(0.5, fract(q.y/3.))); far = a; fs = 2.;
} else if (ty < 5.5) {
  // the airfield fence: posts, a top rail, chain link that thins to a haze, three strands of wire leaning out above
  float gx = q.x + cw*0.5;
  float post = cbLn((fract(gx/3.) - 0.5)*3., lw*1.5, pix);
  float rails = max(cbLn(q.y - (ch - 0.55), lw*1.2, pix), cbLn(q.y - 0.12, lw*1.2, pix));
  a = max(max(post, rails), 0.24*step(q.y, ch - 0.55));          // the chain link itself is never wider than a pixel from the air: a quarter coverage, dithered below
  col = vec3(0.32, 0.34, 0.35); far = a; fs = 0.04;
} else {
  // round thirteen: a figure. Head, body in its own colour, two legs that scissor while it walks (no walk, no scissor: length(vN0.xz) is its pace)
  vec2 fq = q/max(ch, 0.5); float pf = pix/max(ch, 0.5), mv = min(length(vN0.xz)*2., 1.);
  float swing = 0.12*sin(uTime*(5. + 2.*fract(sd*5.3)) + sd*40.)*mv;
  float lt = clamp((0.47 - fq.y)/0.47, 0., 1.);
  float dHead = length(fq - vec2(0.015*mv, 0.9)) - 0.078;
  float dBody = max(abs(fq.x) - (0.085 + 0.035*smoothstep(0.6, 0.8, fq.y)), abs(fq.y - 0.645) - 0.185);
  float dLeg = max(min(abs(fq.x - swing*lt - 0.04), abs(fq.x + swing*lt + 0.04)) - 0.04, max(fq.y - 0.47, -fq.y));
  float dArm = max(abs(fq.x + swing*0.9*clamp((0.8 - fq.y)/0.3, 0., 1.)) - 0.03, abs(fq.y - 0.63) - 0.17) ;
  a = 1. - smoothstep(0., pf, min(min(dHead, dBody), min(dLeg, dArm)));
  col = dHead < min(dBody, dLeg) ? vec3(0.5, 0.36, 0.27) : dLeg < dBody ? vCc*0.3 + 0.03 : vCc;
  col *= 2.;                                           // (the card's colour is halved below)
  cbEmi += col*(0.1 + 0.5*uDark)*vec3(1.0, 0.8, 0.58);          // people stand where lamps are
  far = 0.6*step(abs(fq.x), 0.2)*step(fq.y, 0.98); fs = 0.3;
}
float lk = smoothstep(fs*0.6, fs*1.7, pix);
a = mix(a, far, lk);
a = mix(a, step(cbH21(gl_FragCoord.xy), a), lk);
diffuseColor.rgb = col*0.5; diffuseColor.a = a;
cbEmi += col*(uPoolCol*cbPool(vP.xz)*0.7 + uSky*1.1 + vec3(0.22, 0.2, 0.19)*uDark);
`,Ya="attribute vec3 aC; attribute vec4 aL; attribute vec4 aD; uniform float uTime; uniform vec4 uWake; varying vec3 vP; varying vec3 vN0;",Xa=`
{
  float cw = aL.y;
  vec2 dw = uWake.xz - aC.xz; float cs = dot(dw, aD.xy); vec2 l2 = dw - aD.xy*cs;
  float reach = exp(-dot(l2, l2)/(120.*120.))*uWake.w;
  float gust = reach*smoothstep(-280., -60., cs)*(1. - smoothstep(150., 800., cs));
  float ph = aL.x*6.2832 + uTime*(2.2 + 2.*aL.w + 5.*gust);
  float sway = sin(ph + position.y*1.7)*(0.2 + 0.45*gust)*cw + cw*(0.3 + 0.9*gust);
  transformed.xz += aD.zw*sway;
  transformed.y += cw*(0.1 + 0.55*gust)*(0.5 + 0.5*sin(ph*1.3));
  float tt = (cs + 150. + 60.*aL.w)/75.;
  float loose = aL.z*step(0., tt)*step(0.3, reach);
  vec3 rel = transformed - aC;
  float ang = tt*(4. + 5.*aL.w);
  float ca = cos(ang), sa = sin(ang);
  vec3 side = vec3(aD.z, 0., aD.w);
  float rs = dot(rel, side), ry = rel.y;
  vec3 tum = rel + side*((rs*ca - ry*sa) - rs) + vec3(0., (rs*sa + ry*ca) - ry, 0.);
  float tc = max(tt, 0.);
  vec3 fly = vec3(aD.x, 0., aD.y)*(34.*(1. - exp(-tc*0.8))) + side*(9.*sin(aL.x*40.)*tc) + vec3(0., 30.*(1. - exp(-tc*0.7)) - 1.6*tc*tc*0.5 + 2.*sin(tc*3. + aL.x*9.), 0.);
  transformed = mix(transformed, aC + tum*(1. - smoothstep(6., 9., tc)) + fly, loose);
  vP = transformed; vN0 = normal;
}
`,Y0={storm:{lit:.1,gain:1.8,neon:0,board:[1,.86,.1],shaft:1,pool:"#ffd9a8",poolI:2.2,sky:"#8d98a3",hz:"#98a3aa",head:.3,strobe:1,shade:.6,drift:1.5,grey:1},golden:{lit:.3,gain:2.8,neon:0,shaft:1.15,pool:"#ffb86e",poolI:2.6,sky:"#b9a48e",hz:"#d6ab80",head:.6,strobe:1,shade:.46,fill:["#d6ab80",.16]},dawn:{lit:.24,gain:2.6,neon:0,shaft:.8,pool:"#ffb690",poolI:2.3,sky:"#8f9cbe",hz:"#dcaa9a",head:.7,strobe:1,shade:.3,fill:["#dcaa9a",.36]},dusk:{lit:.42,gain:3,neon:1,boardL:[.62,.58,.5],shaft:.8,pool:"#ffb070",poolI:1.6,sky:"#3b4763",hz:"#b5633f",head:1.6,strobe:1.3,dark:1,pudR:.3,fill:["#b5633f",.55]},night:{lit:.44,gain:3.2,neon:1,boardL:[.7,.66,.57],shaft:.8,pool:"#ffd0a0",poolI:1.3,sky:"#10182a",hz:"#171f36",head:2,strobe:1.5,dark:1,pudR:.45,fill:["#2c3656",.7]}},Ja=["#ff2a55","#19e0b0","#ffb020","#3aa0ff","#ff5ad0","#e8f04a","#ff5a20"],es=["#e9e6dc","#e9e6dc","#dcdad2","#9db7d6","#d98a8a","#c8433a","#e0c35a","#2f3f63","#7fae9a","#f0f0ee"],ts=["#7a4a35","#7d9a86","#5f7f95","#8d9296","#b9ae8f","#4a4d50","#8a5a40","#6d7f6a"],os=["#9aa0a2","#6f8794","#8a4a3a","#bdb9ae","#7e8a80"],as=["#77756f","#7a4636","#4f6b55","#8a8f92","#3c3c3f","#6d675c"];async function rs(Q,C={}){const L=Q.rng,z={city:L.fork("city"),roof:L.fork("roof"),hill:L.fork("hill"),air:L.fork("air"),life:L.fork("life"),look:L.fork("look")},I=Q.core?.makeRng?Q.core.makeRng(Q.core.hashSeed("cb-polish:"+(Q.seed??0))):L.fork("polish"),j=(t,r)=>{const c=Math.sin(t*127.1+r*311.7)*43758.5453;return c-Math.floor(c)},N=t=>Q.core?.makeRng?Q.core.makeRng(Q.core.hashSeed(t+":"+(Q.seed??0))):L.fork(t),ne={city:z.city,roof:z.roof,sign:N("cb-sign:walled")},ce=t=>{z.city=N("cb-city:"+t),z.roof=N("cb-roof:"+t),z.sign=N("cb-sign:"+t)},ee=(t,r,c)=>N(t+":"+Math.round(r*10)+":"+Math.round(c*10)),Ae=Q.noise,G=()=>Q.yield(),se=Q.quality?.detail??1,ue=Math.min(1.3,Math.max(.6,C.density??Q.vary?.density??1)),U=Ta.map((t,r)=>new S.Color(C.palette?.[r]??t)),le=C.debug||null,be=Y0[C.hour]?C.hour:Y0[le?.get("heroHour")]?le.get("heroHour"):"storm",J=Y0[be],Ue={lit:J.lit,neon:C.neon??J.neon,wet:C.wet??.8,shaft:C.shaft??J.shaft,strobe:J.strobe},$e=new S.Vector3(...C.sunDir||[-.8,.42,-.42]).normalize(),Jt=new S.Color(J.pool).multiplyScalar(J.poolI),Ct=t=>new S.Color(t),Le=ts.map(Ct),_e=os.map(Ct),Pe=as.map(Ct),qt=es.map(Ct),tt=Ja.map(Ct);Pe[1]=U[8].clone(),Le[2]=U[9].clone(),_e[1]=U[9].clone();const qe={uTime:{value:0},uLit:{value:Ue.lit},uLitGain:{value:J.gain},uWet:{value:Ue.wet},uNeon:{value:Ue.neon},uHead:{value:J.head},uFarE:{value:J.farE??.1},uNearE:{value:J.near??1},uRoofK:{value:J.roof??1},uFill:{value:new S.Color(J.fill?J.fill[0]:"#000000").multiplyScalar(J.fill?J.fill[1]:0)},uDark:{value:J.dark||0},uFlood:{value:J.dark||0},uPudR:{value:J.pudR??.05},uShade:{value:J.shade||0},uGrey:{value:J.grey||0},uBoardK:{value:new S.Vector3(...J.board||[1,1,.1])},uBoardL:{value:new S.Color(...J.boardL||[0,0,0])},uBeam:{value:J.dark?0:1},uSky:{value:new S.Color(J.sky)},uHz:{value:new S.Color(J.hz||J.sky)},uPoolCol:{value:Jt.clone().multiplyScalar(Ue.shaft)},uSunDir:{value:$e},uPool:{value:[new S.Vector4(0,0,150,1),new S.Vector4(0,0,200,.7),new S.Vector4(0,0,240,.6)]},uChain:{value:new S.Vector2(30,0)},uWake:{value:new S.Vector4(0,0,0,1)},uLand:{value:new S.Vector4(0,1,0,1)},uHill:{value:new S.Vector4(Mt[0],Mt[1],he[0],he[1])},uBoard:{value:new S.Vector3(K.a,K.half,Math.cos(Math.atan(K.slope))*K.half)},uBSun:{value:(()=>{const t=Math.atan(K.slope),r=Math.cos(t),c=Math.sin(t),i=-($e.x*he[0]+$e.z*he[1]);return new S.Vector3($e.x*he[1]-$e.z*he[0],i*r-$e.y*c,i*c+$e.y*r)})()},uCreep:{value:Array.from({length:12},()=>new S.Vector4(0,0,0,0))},uScrub:{value:U[7].clone().lerp(new S.Color("#6a6a2c"),z.look.range(0,.45))},uChkA:{value:U[5]},uChkB:{value:U[6]},uBandPh:{value:Q.core?.makeRng?Q.core.makeRng(Q.core.hashSeed("cb-band:"+(Q.seed??0)))():.41},uStrobe:{value:Ue.strobe},uLamp:{value:1},uPortal:{value:new S.Color(.75,.86,1)},uRes:{value:new S.Vector2(1280,720)}};await G();const Pt=(t,r,c)=>(t.onBeforeCompile=i=>{Object.assign(i.uniforms,qe),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
`+c.vdecl).replace("#include <begin_vertex>",`#include <begin_vertex>
`+c.vmain),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
`+Ra+(c.fdecl||"")).replace("#include <color_fragment>",`#include <color_fragment>
`+c.fcol).replace("#include <roughnessmap_fragment>","float roughnessFactor = clamp(cbRough, 0.04, 1.0);").replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += cbEmi;`).replace("#include <opaque_fragment>",`outgoingLight = min(outgoingLight, vec3(12.));
#include <opaque_fragment>`),c.fog&&(i.fragmentShader=i.fragmentShader.replace("#include <fog_fragment>",c.fog))},t.customProgramCacheKey=()=>"cb-approach-"+r,t),v0="varying vec3 vP; varying vec3 vN0;",x0="vP = position; vN0 = normal;",e0=Pt(new S.MeshStandardMaterial({vertexColors:!0,roughness:.85}),"facade",{vdecl:_a,vmain:Ha,fdecl:"varying vec4 vF; varying vec2 vG;",fcol:Ga}),Eo=Pt(new S.MeshStandardMaterial({roughness:.9}),"ground",{vdecl:v0,vmain:x0,fdecl:Oa,fcol:Na}),To=Pt(new S.MeshStandardMaterial({roughness:.9}),"field",{vdecl:v0,vmain:x0,fdecl:"uniform vec2 uChain; uniform float uStrobe;",fcol:Ka});await G();const Do=Pt(new S.MeshStandardMaterial({roughness:.95}),"hill",{vdecl:v0,vmain:x0,fdecl:Ia,fcol:Wa,fog:ja}),Ro=Pt(new S.MeshLambertMaterial({side:S.DoubleSide,alphaTest:.4,alphaToCoverage:!0}),"card",{vdecl:Ua,vmain:$a,fdecl:Qa,fcol:Za}),_o=Pt(new S.MeshLambertMaterial({side:S.DoubleSide,vertexColors:!0}),"cloth",{vdecl:Ya,vmain:Xa,fcol:`vec3 cbEmi = diffuseColor.rgb*(uPoolCol*cbPool(vP.xz)*0.8 + uSky*0.6 + vec3(1.0, 0.8, 0.56)*0.5*uDark*step(11., vP.y)*(1. - smoothstep(${(St-6).toFixed(1)}, ${(St+2).toFixed(1)}, cbRoute(vP.xz))) + vec3(1.0, 0.95, 0.84)*cbLand(vP)*(0.2 + 1.3*uDark)*0.8);`});await G();const X=Da(Ae),g0=7600,w0=2300,y0=2500,k=new Vo(63400+g0);k.max-=g0*4;const De=new Xt(Math.round(8500*Math.max(.6,se))+1540+w0,{position:3,normal:3,aUv:2,aT:4,aCc:3}),ye=new Xt(Math.round(8e3*Math.max(.6,se))+2600+y0,{position:3,normal:3,aC:3,aL:4,aD:4,color:3});De.max-=w0,ye.max-=y0;const X0=[],E=[],k0=[],J0=[],Ht=[],Gt=[],M0=[],t0=t=>78+22*Math.sin(t*.021+1),Ot=[],Lt=[.6,.8],Ho=new S.Color(0,0,0),Z=(t,r,c,i,f,b,e,s,o,u)=>{if(De.full)return;const m=i*b*.5,l=f*b*.5,n=u||Ho;De.put("position",0,t-m,r,c-l),De.put("position",1,t+m,r,c+l),De.put("position",2,t+m,r+e,c+l),De.put("position",3,t-m,r+e,c-l),De.put("aUv",0,-b/2,0),De.put("aUv",1,b/2,0),De.put("aUv",2,b/2,e),De.put("aUv",3,-b/2,e),De.all("normal",0,1,0),De.all("aT",s,o,b,e),De.all("aCc",n.r,n.g,n.b),De.next()},Vt=(t,r,c,i,f,b,e,s=1.75,o=1,u=0)=>{if(De.full)return;const m=Math.hypot(i,f)||1,l=i/m,n=f/m;Z(t,r,c,l,n,1.1,s,6,b,e);const h=(De.nq-1)*12,w=De.a.normal;for(let g=0;g<4;g++)w[h+g*3]=l*o,w[h+g*3+1]=1+u*o,w[h+g*3+2]=n*o},mt=(t,r,c,i,f,b,e,s,o,u,m,l=2)=>{if(ye.full)return;let n=-f,h=i;n*Lt[0]+h*Lt[1]<0&&(n=-n,h=-h);const w=m.pick(qt),g=m(),y=m(),a=i*b*.5,x=f*b*.5,d=.62+.25*m();for(let v=0;v<l;v++){const p=r-e/l*v,M=p-e/l,A=v/l,P=A+1/l;ye.put("position",0,t-a,p,c-x),ye.put("position",1,t+a,p,c+x),ye.put("position",2,t+a,M,c+x),ye.put("position",3,t-a,M,c-x),ye.put("aL",0,g,A,u,y),ye.put("aL",1,g,A,u,y),ye.put("aL",2,g,P,u,y),ye.put("aL",3,g,P,u,y),ye.all("normal",n*.5,.86,h*.5),ye.all("aC",t,r,c),ye.all("aD",s,o,n,h),ye.all("color",w.r*d,w.g*d,w.b*d),ye.next()}};await G();const eo=[];{const t=new S.Color("#9a6c3c"),r=new S.Color("#3a332c"),c=(e,s,o,u,m)=>{const l=oe[0]-e,n=oe[0]+e,h=oe[1]-s,w=oe[1]+s;return k.vOff=o,k.wall(l,w,n,w,o,u,u,0,1,t,m,10,0,0),k.wall(n,w,n,h,o,u,u,1,0,t,m+.01,10,0,0),k.wall(n,h,l,h,o,u,u,0,-1,t,m,10,0,0),k.wall(l,h,l,w,o,u,u,-1,0,t,m+.01,10,0,0),k.vOff=0,k.quad([l,u,w],[n,u,w],[n,u,h],[l,u,h],r,2,.3),[l,n,h,w]},i=(e,s,o,u)=>{for(const[m,l]of[[-1,-1],[1,-1],[1,1],[-1,1],[0,-1],[1,0],[0,1],[-1,0]])E.push([oe[0]+m*(e+1.2),o+1.2,oe[1]+l*(s+1.2),1,.66,.3,u,3,(m+2)*.13+(l+2)*.29,1.9])};c(22,16,0,14,.1),c(15,15,14,116,.1),i(15,15,14,1.6),c(11.5,11.5,116,173.5,.5),i(11.5,11.5,116,1.4),c(7.5,7.5,173.5,206,.1),i(7.5,7.5,173.5,1.2),c(5,5,206,220,.9),c(6.3,6.3,220,222,.1);const f=(e,s,o,u,m,l)=>{k.vOff=m,k.wall(e,u,s,u,m,l,l,0,1,t,.26,10,0,0),k.wall(s,u,s,o,m,l,l,1,0,t,.27,10,0,0),k.wall(s,o,e,o,m,l,l,0,-1,t,.26,10,0,0),k.wall(e,o,e,u,m,l,l,-1,0,t,.27,10,0,0),k.vOff=0,k.quad([e,l,u],[s,l,u],[s,l,o],[e,l,o],r,2,.3)},b=(e,s,o,u)=>E.push([e,s,o,1,.07,.03,.9,2,u,1.6]);for(const[e,s]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const o=oe[0]+e*15,u=oe[1]+s*15;f(o-2.6,o+2.6,u-2.6,u+2.6,0,121);const m=oe[0]+e*9.8,l=oe[1]+s*9.8;f(m-1.7,m+1.7,l-1.7,l+1.7,173.5,180.5);const n=oe[0]+e*6.5,h=oe[1]+s*6.5;f(n-1,n+1,h-1,h+1,206,211),b(n,211.8,h,.2+e*.17+s*.31)}for(const[e,s]of[[15,116],[11.5,173.5],[7.5,206]])f(oe[0]-e-1.1,oe[0]+e+1.1,oe[1]-e-1.1,oe[1]+e+1.1,s-1.6,s);{const e=t.clone().multiplyScalar(.8),s=t.clone().multiplyScalar(.5),o=oe[0]-15,u=oe[1]-15;for(const h of[-8.4,3])k.box(o-1.15,o,oe[1]+h,oe[1]+h+5.6,17.6,110.6,e,s,.37+h*.01,3,2),k.box(oe[0]+h,oe[0]+h+5.6,u-1.15,u,17.6,110.6,e,s,.61+h*.01,3,2);const m=o-1.5,l=oe[1]-11.6,n=l+4.4;k.vOff=14,k.wall(m,l,m,n,14,114.4,114.4,-1,0,t,.21,10,0,0),k.wall(o,l,m,l,14,114.4,114.4,0,-1,t,.21,10,0,0),k.wall(m,n,o,n,14,114.4,114.4,0,1,t,.21,10,0,0),k.vOff=0,k.quad([m,114.4,n],[o,114.4,n],[o,114.4,l],[m,114.4,l],r,2,.3)}for(const[e,s]of[[1,0],[0,1]])for(const o of[-1,1])Z(oe[0]+(e?0:o*7.4),206,oe[1]+(s?0:o*7.4),e,s,14.8,1.5,5,.5);Z(oe[0],222,oe[1],1,0,5.5,Zt,4,.43),Z(oe[0],222,oe[1],0,1,5.5,Zt,4,.47),E.push([oe[0],222.6+Zt,oe[1],1,.07,.03,2.8,2,.1,3.2],[oe[0],222+Zt*.5,oe[1],1,.07,.03,1.7,2,.6,2.2]);for(const[e,s]of[[-1,-1],[1,-1],[1,1],[-1,1]])E.push([oe[0]+e*11.5,174.7,oe[1]+s*11.5,1,.07,.03,1.2,2,.3+e*.1+s*.2,1.9],[oe[0]+e*15,117.2,oe[1]+s*15,1,.07,.03,1.2,2,.8+e*.1-s*.2,1.9]);E.push([oe[0],$0,oe[1],1,.76,.4,6.5,3,.37,5])}await G();const S0=[1.2,z.look.range(.3,1.6),z.look.range(.3,1.6),z.look.range(.3,1.6),z.look.range(.3,1.4)],Go=S0.reduce((t,r)=>t+r,0),it=t=>{let r=t()*Go,c=0;for(;c<4&&r>S0[c];)r-=S0[c],c++;const i=U[c].clone().lerp(U[0],t.range(.05,.55)),f=t.range(.9,1.3);return i.r*=f,i.g*=f,i.b*=f,i},A0=z.look.range(.6,1.15),Oo=z.look.range(.75,1.3),No=z.look.range(.6,1.4),to=z.look.range(.6,1.5),q0=lt(Oe[0]+We*Math.cos(Xe*.75),Oe[1]+We*Math.sin(Xe*.75)).s,P0=lt(0,-620).s,Ko=lt(Je[0],Je[1]).s,Io=lt(_t[0],_t[1]).s,oo=N("cb-neon"),Wo=oo.int(0,2),jo=oo.int(0,1),o0=(t,r)=>{const c=(Co-m0-7-r)/Yt,i=Math.round(c);if(Math.abs(c-i)*Yt<12.5&&(i%3+3)%3===Wo)return 1;const f=Math.abs(t);if(f<14)return 2;const b=(f-(Bo+Z0+8))/Q0,e=Math.round(b);return Math.abs(b-e)*Q0<10.5&&(e&1)===jo?2:0},z0=(t,r)=>r>-1100||o0(t,r)>0||j(t*.71+3.3,r*.37+9.1)<.3,Uo=(t,r,c,i,f,b,e,s)=>{const o=z.roof,u=r-t,m=i-c,l=b*ue;if(u<5||m<5)return;const n=d=>o.range(t+d,r-d),h=d=>o.range(c+d,i-d);let w=f;if(o.chance(.85)){const d=Math.min(u-2,o.range(3,4.6)),v=Math.min(m-2,o.range(4,6.5)),p=o.range(t+.8,r-.8-d),M=o.chance(.5)?c+.8:i-.8-v,A=o.range(2.6,3.6),P=U[0].clone().multiplyScalar(o.range(.55,.95));k.box(p,p+d,M,M+v,f,f+A,P,o.pick(Pe),o(),2,2),w=f+A,o.chance(.4)&&k.tank(p+d/2,M+v/2,Math.min(d,v)*.4,w,w+o.range(1.4,2.2),o.pick(_e),_e[0],o())}const g=Math.round(o.range(0,1.8)*l+(s?.3:0));for(let d=0;d<g;d++){const v=o.range(.9,1.6),p=n(2),M=h(2),A=f+(o.chance(.5)?.9:0);k.tank(p,M,v,A,A+o.range(1.6,2.6),o.pick(_e),o.pick(_e),o())}const y=o.chance(.18)?2.6:1,a=Math.round(o.range(0,3.4)*l*No*y);for(let d=0;d<a;d++){const v=o.range(2.6,6),p=o.range(2.4,4.6),M=o.range(t+.6,Math.max(t+.7,r-.6-v)),A=o.range(c+.6,Math.max(c+.7,i-.6-p)),P=o.pick(Le).clone().multiplyScalar(o.range(.7,1.15)),B=o.pick(Le).clone().multiplyScalar(o.range(.7,1.2));k.box(M,Math.min(r-.3,M+v),A,Math.min(i-.3,A+p),f,f+o.range(2.1,2.8),P,B,o(),2,2,o.range(-.6,.6))}if(o.chance(.3*l)){const d=n(3),v=h(3);k.box(d-o.range(1,3),d+o.range(1,3),v-.8,v+.8,f,f+o.range(.7,1.6),U[7].clone().multiplyScalar(o.range(.7,1.4)),U[7].clone().multiplyScalar(o.range(.9,1.6)),o(),4,4)}const x=Math.round(o.range(2,9)*(.25+.75*b)*ue*Oo*se*(s?1.5:1)*Math.min(1.6,u*m/500));for(let d=0;d<x;d++){const v=o.int(0,3)*.785+o.range(-.2,.2),p=o.range(3.2,7.5);Z(n(.8),o.chance(.2)?w:f,h(.8),Math.cos(v),Math.sin(v),2.8,p,0,o())}if(b>.15&&o.chance(.45*l*A0)){const d=o.int(1,2);for(let v=0;v<d;v++){const p=u>m?o.chance(.7):o.chance(.3),M=Math.min((p?u:m)-2.5,o.range(5,11)),A=n(p?M/2+1:1.5),P=h(p?1.5:M/2+1),B=Math.max(2,Math.floor(M/1.45)),F=e.d<170&&e.s>q0&&e.s<P0;for(let D=0;D<B;D++){const q=(D+.5)/B-.5,V=.35*(1-4*q*q);mt(A+(p?q*M:0),f+2.25-V,P+(p?0:q*M),p?1:0,p?0:1,o.range(.6,1.05),o.range(.7,1.5),e.tx,e.tz,F&&o.chance(.4)?1:0,o)}}}if(u>9&&!(e.d<50&&e.y-(f+10.5)<40)){const d=(t+r)/2,v=[c+.7,i-.7].filter(M=>z0(d,M)),p=z.sign;if(v.length&&p.chance(.075*to*(.4+b))){const M=Math.min(u-1.5,p.range(8,16)),A=p.range(6.5,10.5),P=p.pick(v),B=1-.6*je(e.y-30,e.y-5,f+A)*(1-je(110,260,e.d)),F=p();Z(d,f,P,1,0,M,A,2,F,p.pick(tt).clone().multiplyScalar(B))}}},$o=(t,r,c,i,f,b,e,s,o)=>{const u=z.roof,m=z.sign,l=r-t,n=Math.floor((f-4.6)/3),h=(t+r)/2;if(n<3||l<8)return;const w=b.clone().multiplyScalar(.82),g=b.clone().multiplyScalar(.55);for(let y=0;y<2;y++){const a=y?i:c,x=y?1:-1,d=u.int(0,1);for(let p=0;p<d;p++){const M=u.pick([2.8,3.5,5.6]),A=u.range(t+.6,r-.6-M),P=4.6+3*(n-u.int(0,2));k.box(A,A+M,Math.min(a,a+x*1.1),Math.max(a,a+x*1.1),4.6,P,w,g,u(),3,2)}const v=Math.round(u.range(0,2)*e*ue*A0);for(let p=0;p<v;p++){const M=u.range(t+1,r-1),A=4.6+3*u.int(1,n-1)+1.1,P=2;for(let B=0;B<P;B++)mt(M,A,a+x*(.8+B*.95),0,1,.85,u.range(.7,1.3),s.tx,s.tz,0,u,1)}if(z0(h,a+x*3)&&m.chance(.3*to*e)){const p=m.range(4,6.5),M=m.range(t+1,r-1),A=m.range(7,Math.min(f-5,26)),P=m.range(2.4,4.2),B=m();Z(M,A,a+x*(p/2+.3),0,1,p,P,3,B,m.pick(tt))}if(a<-1100&&o0(h,a+x*3)===1){const p=2+Math.floor(m()*3);for(let M=0;M<p;M++){const A=m.range(4.5,8),P=m.range(2.6,5.4),B=m.range(t+1,r-1),F=m.range(6,Math.max(7,Math.min(f-4,34))),D=m(),q=m.pick(tt);Z(B,F,a+x*(A/2+.3),0,1,A,P,3,D,q)}}u.chance(.035)&&Z((t+r)/2,0,a+x*1.4,1,0,l+1.5,f+1.8,1,u())}if(o){const y=o>0?r:t,a=o,x=i-c;if(z0(y+a*4,(c+i)/2)){const p=m.int(1,3);for(let M=0;M<p;M++){const A=m.range(5,8.5),P=m.range(7,Math.min(f-5,30)),B=m.range(c+1,i-1),F=m.range(2.6,4.6),D=m();Z(y+a*(A/2+.3),P,B,1,0,A,F,3,D,m.pick(tt))}}if(i<-1100&&o0(y+a*4,(c+i)/2)===2){const p=2+Math.floor(m()*3);for(let M=0;M<p;M++){const A=m.range(5,8.5),P=m.range(2.8,5.6),B=m.range(c+1,i-1),F=m.range(6,Math.max(7,Math.min(f-4,34))),D=m(),q=m.pick(tt);Z(y+a*(A/2+.3),F,B,1,0,A,P,3,D,q)}}const d=u.int(1,3);for(let p=0;p<d;p++){const M=u.pick([2.8,3.5,5.6]),A=u.range(c+.6,i-.6-M);k.box(Math.min(y,y+a*1.1),Math.max(y,y+a*1.1),A,A+M,4.6,4.6+3*(n-u.int(0,2)),w,g,u(),3,2)}const v=Math.round(u.range(0,3.4)*e*ue*A0);for(let p=0;p<v;p++){const M=u.range(c+1,i-1),A=4.6+3*u.int(1,n-1)+1.1,P=2;for(let B=0;B<P;B++)mt(y+a*(.8+B*.95),A,M,1,0,.85,u.range(.7,1.3),s.tx,s.tz,0,u,1)}u.chance(.05)&&Z(y+a*1.4,0,(c+i)/2,0,1,x+1.5,f+1.8,1,u())}},ao=(t,r,c)=>{let i=0;for(let f=0;f<60;f++){i=Math.fround((t+.08+.84*((c*7.13+f*.137)%1))/3);const b=Math.fround(i*37)%1;if(r?b>.56&&b<.94:b>.06&&b<.44)break}return i},Qo=(t,r,c,i,f,b,e,s)=>{if(s.wc||b<.3||r-t<13||i-c<13||f>e.y-8||f<12)return 0;const o=j(Math.round(t)*.37+11.3,Math.round(c)*.53+4.1);return o<.15?1:o<.32?2:o<.55?3:0},a0=(t,r,c,i,f,b,e,s)=>{for(let o=0;o<b;o++){const u=s.range(t,r),m=s.range(c,i),l=s.range(0,6.2832),n=s(),h=s.pick(qt).clone().multiplyScalar(s.range(.65,1)),w=s.chance(e?.85:.5),g=e?s.range(1.15,1.45):s.range(1.6,1.8),y=Math.max(0,Math.min(u-t,r-u,m-c,i-m)-.6);Vt(u,f,m,Math.cos(l),Math.sin(l),n,h,g,w?Math.min(e?.6:.4,y/5):0)}},Zo=(t,r,c,i,f,b,e,s)=>{const o=c-r,u=f-i,m=(r+c)/2,l=(i+f)/2,n=1.1,h=s(),w=U[0].clone().multiplyScalar(s.range(.55,.9)),g=s.chance(.5)?r+.5:c-3.9,y=s.chance(.5)?i+.5:f-4.9;if(k.box(g,g+3.4,y,y+4.4,b,b+3.1,w,s.pick(Pe),s(),2,2),E.push([g+1.7,b+2.5,y+(y<l?4.7:-.3),1,.74,.42,.6,3,h,1.4]),t===1){const a=o-2*n>32?1:o-2*n>16&&u-2*n>14?0:1,x=ao(a,!0,h),d=b+.3;k.box(r+n,c-n,i+n,f-n,b,d,B0,C0,x,2,8),Z(m,d,i+n,1,0,o-2*n,4.2,5,.3),Z(m,d,f-n,1,0,o-2*n,4.2,5,.3),Z(r+n,d,l,0,1,u-2*n,4.2,5,.3),Z(c-n,d,l,0,1,u-2*n,4.2,5,.3);for(const[v,p]of[[r+n,i+n],[c-n,i+n],[r+n,f-n],[c-n,f-n]])Z(v,d,p,.7,.7,1.3,7.5,4,.2+.6*h),E.push([v,d+7.8,p,.92,.97,1,1.25,3,h+v*.01,1.9]);a0(r+n+1.5,c-n-1.5,i+n+1.5,f-n-1.5,d,5+Math.floor(s()*6),!0,s)}else if(t===2){const a=ao(2,!1,h),x=b+.3,d=5+Math.floor(s()*5);k.box(r+n,c-n,i+n,f-n,b,x,B0,C0,a,2,8);for(let v=0;v<d;v++){const p=v/d*6.2832+s.range(-.3,.3),M=m+Math.cos(p)*(o/2-n-2.2),A=l+Math.sin(p)*(u/2-n-2.2),P=v%3===0,B=P?s.range(1.5,2.3):s.range(.9,1.9),F=P?s.range(3.2,5):s.range(.9,1.7),D=U[7].clone().multiplyScalar(s.range(.55,1));k.box(M-B,M+B,A-B*.8,A+B*.8,P?x+1.2:x,x+F,D,D.clone().multiplyScalar(1.15),s(),4,4),P&&k.box(M-.2,M+.2,A-.2,A+.2,x,x+1.3,w,w,.4,2,2)}for(let v=0;v<3;v++){const p=m+(v-1)*(o/2-n-3)*.8,M=l+s.range(-.3,.3)*u;k.box(p-.1,p+.1,M-.1,M+.1,x,x+2.7,w,w,.5,5,5),E.push([p,x+2.9,M,1,.8,.5,.7,3,h+v*.3,1.5])}a0(r+n+2,c-n-2,i+n+2,f-n-2,x,2+Math.floor(s()*3),!1,s)}else{const a=o>u,x=(a?o:u)-5,d=Math.max(3,Math.min(6,Math.floor(x/4.2))),v=s.range(-.22,.22)*(a?u:o),p=Le[4].clone().multiplyScalar(.7),M=a?m-x/2:m+v-1.9,A=a?m+x/2:m+v+1.9,P=a?l+v-1.9:l-x/2,B=a?l+v+1.9:l+x/2;k.box(M,A,P,B,b,b+1.3,p,p,s(),3,2);for(let R=0;R<d;R++){const H=(R+.5)/d-.5,T=a?m+H*x:m+v,$=a?l+v:l+H*x;k.tank(T,$,s.range(1.3,1.75),b+1.3,b+1.3+s.range(2,3),s.pick(_e),s.pick(_e),s())}const F=s.range(r+1,c-6.5),D=v>0?i+.8:f-5;a&&k.box(F,F+5.5,D,D+4.2,b,b+2.8,w,s.pick(Le),s(),3,2);const q=Math.round((12+s()*12)*Math.max(.6,se));for(let R=0;R<q;R++){const H=s.int(0,3)*.785+s.range(-.2,.2);Z(s.range(r+.8,c-.8),b,s.range(i+.8,f-.8),Math.cos(H),Math.sin(H),3.2,s.range(5.5,12.5),0,s())}const V=e.d<170&&e.s>q0&&e.s<P0;for(let R=0;R<3;R++){const H=Math.min(x,s.range(7,12)),T=(R-1)*2.2-v*.9,$=Math.max(3,Math.floor(H/1.4));for(let W=0;W<$;W++){const te=(W+.5)/$-.5,pe=.35*(1-4*te*te);mt(a?m+te*H:m+T,b+2.3-pe,a?l+T:l+te*H,a?1:0,a?0:1,s.range(.6,1.05),s.range(.7,1.5),e.tx,e.tz,V&&s.chance(.4)?1:0,s)}}a0(r+2,c-2,i+2,f-2,b,1+Math.floor(s()*2),!1,s)}},s0=(t,r,c,i,f,b,e={})=>{const s=z.city,o=s(),u=e.col||it(s),m=s.pick(Pe).clone().multiplyScalar(s.range(.7,1.1)),l=Math.max(1-je(90,300,b.d),e.wc?.5:0),n=s(),h=s.range(2,3.6),w=s.int(1,3);let g=c,y=i,a=f;l>.2&&!e.wc&&!e.col&&f>30&&n<.45&&i-c>18?(a=f-3*w,n<.3&&(g=c+h),n>.12&&(y=i-h),k.box(t,r,c,i,0,a,u,m,o,0,1),k.vOff=a,k.box(t,r,g,y,a,f,u,m,o,0,1),k.vOff=0):k.box(t,r,c,i,0,f,u,m,o,0,1),b.d<85&&f>12&&!e.wc&&k0.push([(t+r)/2,f,(g+y)/2]);const x=Qo(t,r,g,y,f,l,b,e);if(X0.push([t,r,g,y,f,x,b,e.wc?1:0]),x)Zo(x,t,r,g,y,f,b,ee("cb-roof-own",t,g));else if(l>.02&&(Uo(t,r,g,y,f,l,b,e.wc),l>.35&&!e.wc&&f<b.y-8&&r-t>9&&j(t*.91+2.7,c*.63+8.2)<.4)){const d=ee("cb-roof-folk",t,g);a0(t+1.5,r-1.5,g+1.5,y-1.5,f,1+Math.floor(d()*2.4),!1,d)}if(l>.1&&!e.wc&&i<-1100&&r-t>9)for(const[d,v]of[[c-5,g+.7],[i+5,y-.7]]){if(o0((t+r)/2,d)!==1)continue;const p=z.sign;if(p()<.55){const M=Math.min(r-t-1.5,p.range(9,17)),A=p.range(6.5,10.5),P=p(),B=p.pick(tt);Z((t+r)/2,f,v,1,0,M,A,2,P,B.clone().multiplyScalar(1-.6*je(b.y-30,b.y-5,f+A)*(1-je(110,260,b.d))))}}l>.45&&!e.wc&&$o(t,r,c,i,a,u,l,b,e.xFace||0),l>.5&&b.s>Io&&b.d>30&&b.d<170&&b.side<0&&f>20&&Ot.push([(t+r)/2,f,(c+i)/2,b.tx,b.tz,b.s])},Yo=(t,r,c,i,f,b)=>{const e=z.city,s=it(e).lerp(U[0],.3);s0(t-c/2,t+c/2,r-i/2,r+i/2,f,b,{col:s}),eo.push([t,r,c,i,f]);const o=c*e.range(.3,.5),u=i*e.range(.3,.5),m=e.range(4,8);k.box(t-o/2,t+o/2,r-u/2,r+u/2,f,f+m,s.clone().multiplyScalar(.7),Pe[4],e(),2,2);const l=f+m+1.2,n=je(150,420,Math.hypot(b.d,l-b.y));E.push([t,l,r,1,.07,.03,.45+1.05*n,2,e(),1.2+n])},Xo=lt(0,-1100).s;De.max-=40;const F0=[],B0=new S.Color("#6b6860"),C0=new S.Color("#2c4a24"),Jo=(t,r,c,i)=>{const f=[X(t,c),X(r,c),X(t,i),X(r,i),X((t+r)/2,(c+i)/2)],b=Math.min(...f),e=Math.max(...f);if(b>.4||k.full)return;const s=j(t,c),o=j(c,t+7),u=e>1.5?2:s<.4?0:s<.68?1:2,m=u<2&&o<.62;let l=0;for(let y=0;y<60;y++){l=Math.fround((u+.08+.84*((o*7.13+y*.137)%1))/3);const a=Math.fround(l*37)%1;if(m?a>.56&&a<.94:a>.06&&a<.44)break}const n=t+1.5,h=r-1.5,w=c+1.5,g=i-1.5;if(k.box(n,h,w,g,0,.45,B0,C0,l,2,8),F0.push([n,h,w,g,u,m?1:0]),m)for(const[y,a]of[[n+2.2,w+2.2],[h-2.2,w+2.2],[n+2.2,g-2.2],[h-2.2,g-2.2]])Z(y,.45,a,.7,.7,1.8,15,4,.2+.6*s),E.push([y,15.8,a,.92,.97,1,1.9,3,o+y*.01,2.3])},ea=(t,r)=>t>-306&&t<-82&&r>-1318&&r<-1176,ta=(t,r)=>t>Ne[0]-72&&t<Ne[0]+72&&r>Ne[1]-45&&r<Ne[1]+45,so=(t,r,c,i,f)=>{const b=z.city,e=(t+r)/2,s=(c+i)/2,o=lt(e,s),u=b()>1-je(430,620,o.d),m=b.int(2,4),l=[0];for(let A=1;A<m;A++)l.push(b.range(.12,.88));l.push(1),l.sort((A,P)=>A-P);const n=b(),h=b(),w=b();if(ea(e,s)||ta(e,s))return;if(X(e,s)>1.2||X(t,c)>2.5||X(r,c)>2.5||X(t,i)>2.5||X(r,i)>2.5){Jo(t,r,c,i);return}if(u){w>.08&&k.box(t+l[1]*5,r-4*n,c+3*h,i-1,0,h>.94?60+40*n:4.6+3*Math.round(7+8*n*n+3*h),it(b),b.pick(Pe),n,0,1);return}const g=o.s>Xo;let y=999;o.d<64?y=o.y-30:o.d<140&&!g&&(y=o.y-46);const a=u0(e,s),x=a[0]>Qt[0]&&a[0]<Qt[1]&&Math.abs(a[1])<90;x&&(y=Math.min(y,20+(a[0]-90)*.16));const d=Math.abs(e-Ne[0])<100&&s<Ne[1]-45&&s>Ne[1]-150;d&&(y=Math.min(y,17));const v=!g&&o.s<Ko&&o.d<St,p=g&&o.d>=64&&o.d<150&&s>-1090&&s<-380,M=g&&o.d>=150&&o.d<230&&s>-1090&&s<-380;if(!x&&!d&&n<(p?.66:M?.3:o.d>150?.06:0)){const A=p||M?Math.min(122,Math.max(72,o.y+16+h*46)):62+h*40,P=22+h*8,B=(r-t-P)*(n*7%1);Yo(t+P/2+B,s,P,26,A,o);const F=B>30?t:t+P+B+4,D=B>30?t+B-4:r;D-F>10&&s0(F,D,c+2,i-2,4.6+3*b.int(2,5),o);return}for(let A=0;A<m;A++){let P=t+(r-t)*l[A],B=t+(r-t)*l[A+1];const F=b.chance(.3)?b.range(1.5,3):0,D=w<.14?b.int(4,8):b.int(11,15),q=b.range(0,3.5),V=b.range(0,3.5);if(B-=F,B-P<7)continue;const R=Math.min(v?Math.max(D,16-D%3):D,Math.floor((y-4.6)/3));if(R<1)continue;const H=A===0,T=A===m-1;s0(P,B,c+q,i-V,4.6+3*R,o,{xFace:H?-1:T?1:0})}},no=[],oa=(t,r,c,i)=>{const f=N("cb-crane"),b=(t+r)/2,e=(c+i)/2,s=92,o=13,u=it(f).lerp(U[0],.4),m=U[0].clone().multiplyScalar(.6),l=new S.Color("#2f6a4a");k.box(t+1,r-1,c+1,i-1,0,7.6,m,Pe[3],.47,0,1),k.vOff=7.6,k.box(b-o,b+o,e-o,e+o,7.6,62,u,m,.37,0,1),k.vOff=62,k.box(b-o+.5,b+o-.5,e-o+.5,e+o-.5,62,s,m,m,.61,3,2),k.vOff=0;for(const[p,M]of[[1,0],[-1,0],[0,1],[0,-1]])Z(b+M*(o+1.3),7.6,e+p*(o+1.3),p,M,2*o+2.6,s-3.6,1,f(),l);k.box(b+o+1.4,b+o+4.6,e-2,e+2,0,s+4,Le[1].clone().multiplyScalar(.8),Le[1],.3,3,2);const n=b-5,h=e+4,w=s+27,g=f.range(2.2,2.9),y=Math.cos(g),a=Math.sin(g),x=new S.Color("#c9a227");Z(n,s,h,1,0,2.6,27,4,.31),Z(n,s,h,0,1,2.6,27,4,.31),Z(n+y*15,w,h+a*15,y,a,56,2.3,5,.6),Z(n+y*4,w+2.3,h+a*4,y,a,30,5.5,5,.6),k.box(n-1.2,n+1.2,h-1.2,h+1.2,w-3.4,w-.8,x,x,.5,5,2),k.box(n-y*12-1.6,n-y*12+1.6,h-a*12-1.6,h-a*12+1.6,w-1.6,w+.4,m,m,.5,2,2);const d=n+y*31,v=h+a*31;k.box(d-.09,d+.09,v-.09,v+.09,w-19,w,m,m,.5,5,5),k.box(d-1.3,d+1.3,v-.9,v+.9,w-21,w-19,x,Le[2],.5,2,2),E.push([n+y*43,w+2.8,h+a*43,1,.07,.03,1.2,2,.2,1.9],[n,w+8.4,h,1,.07,.03,1.3,2,.7,2],[n-y*13,w+2.8,h-a*13,1,.07,.03,.9,2,.45,1.6]);for(let p=1;p<=4;p++)E.push([n+y*p*9.5,w-.4,h+a*p*9.5,1,.9,.7,.75,3,p*.23,1.4]);for(let p=0;p<5;p++)for(const[M,A]of[[1,1],[-1,1],[1,-1],[-1,-1]]){const P=f(),B=f();P<.6&&E.push([b+M*(o-1),64.5+p*6,e+A*(o-1),1,.92,.75,.8,3,B,1.5])}for(let p=0;p<4;p++){const M=f.range(b-o+2,b+o-2),A=f.range(e-o+2,e+o-2),P=f.range(0,6.2832),B=f();Vt(M,s,A,Math.cos(P),Math.sin(P),B,x,1.75,.3)}},aa=(t,r,c,i)=>{const f=N("cb-stacks"),b=(t+r)/2,e=(c+i)/2,s=U[8].clone().multiplyScalar(.8),o=U[0].clone().multiplyScalar(.7),u=new S.Color("#a3301c"),m=new S.Color("#d8d2c4");k.box(t+2,r-2,c+3,i-3,0,23,s,Pe[3],.63,0,1),k.box(t+8,r-8,e-4,e+4,23,27,s.clone().multiplyScalar(.85),Pe[0],.21,2,1);for(let l=0;l<4;l++)k.tank(t+9+l*14,c+7.5,2.4,23,26+f.range(0,1.5),_e[1],_e[0],f());for(const l of[-13,13]){const n=b+l,h=e+6.5,w=f();k.tank(n,h,4.7,0,32,o,o,.07),k.tank(n,h,4.1,32,54,o.clone().multiplyScalar(1.08),o,.07);for(let g=0;g<4;g++)k.tank(n,h,3.6-g*.1,54+g*6,60+g*6,g&1?m:u,g===3?new S.Color("#1c1a18"):o,.07);k.tank(n,h,5.4,53.2,54,o,Le[2],.07);for(let g=0;g<3;g++){const y=g*2.094+w*6;E.push([n+Math.cos(y)*3.7,78.6,h+Math.sin(y)*3.7,1,.07,.03,1.2,2,w+g*.33,1.9],[n+Math.cos(y)*5.3,55,h+Math.sin(y)*5.3,1,.07,.03,.8,2,w+.5+g*.33,1.4])}for(let g=0;g<6;g++)E.push([n+4.9,6+g*8,h,1,.86,.66,.7,3,w+g*.17,1.5]);for(let g=0;g<6;g++){const y=g*1.047+w*3;E.push([n+Math.cos(y)*5.5,55.6,h+Math.sin(y)*5.5,1,.9,.72,.8,3,w+g*.11,1.6])}no.push([n,78,h])}for(let l=t+6;l<=r-6;l+=12)E.push([l,21.5,i-2.4,1,.78,.46,1,3,l*.03,1.6],[l,21.5,c+2.4,1,.78,.46,1,3,l*.03+.4,1.6])};for(let t=-1;t<=1;t+=2)for(let r=0;r<(t>0?17:22);r++){const c=Bo+r*Q0,i=t>0?c:-(c+Z0),f=i+Z0;for(let b=0;b<53;b++){const e=Co-b*Yt,s=t>0&&r===0&&b===23,o=t<0&&r===1&&b===16;s?oa(i,f,e-m0,e):o?aa(i,f,e-m0,e):t>0&&r===0&&b===Ea||(ce(t+":"+r+":"+b),so(i,f,e-m0,e,t)),b&1&&await G()}if(t<0&&r>=2)for(let b=0;b<3;b++)ce("shore:"+r+":"+b),so(i,f,-316+b*Yt,-282+b*Yt,t);await G()}{z.city=ne.city,z.roof=ne.roof,z.sign=ne.sign;const t=z.city,r=lt(-194,-1247);for(let c=0;c<16;c++){for(let i=0;i<10;i++){const f=-300+c*13.25+t.range(-1.5,1.5),b=-1312+i*13+t.range(-1.5,1.5),e=t.range(10,14.5),s=t.range(10,14),o=t.chance(.1)?t.int(6,9):t.int(10,14),u=it(t).lerp(U[0],.55).multiplyScalar(t.range(.6,.95));s0(f,f+e,b,b+s,4.6+3*o+t.range(0,2),r,{col:u,wc:!0})}c%4===3&&await G()}}await G(),De.max+=40;{const t=[tt[1],tt[3],tt[4],tt[0],tt[3],tt[1]];let r=0;for(const c of eo){const i=Math.hypot(c[0]-oe[0],c[1]-oe[1]);if(i>430||i<40||r>=14)continue;const f=ee("cb-tower-sign",c[0],c[1]);if(f()>.75)continue;const b=f.range(8,12),e=f.range(13,20),s=f.range(.34,.62),o=f.range(-.2,.2),u=f(),m=f.pick(t);if(Z(c[0]+o*c[2],Math.min(c[4]-e-3,c[4]*s),c[1]-c[3]/2-.5,1,0,b,e,3,u,m),r++,Math.abs(c[0])<170){const l=c[0]>0?-1:1;Z(c[0]+l*(c[2]/2+.5),Math.min(c[4]-e-3,c[4]*(1-s)),c[1]+o*c[3],0,1,b*.8,e,3,u+.31,f.pick(t)),r++}}}await G();{const t=I;for(const i of[-1,1])for(let f=0;f<6;f++){const b=-397.6+f*5.3;for(let e=0;e<16;e++){const s=13.2+e*3.6,o=t.range(2.9,3.4),u=t.range(2.2,2.7),m=t.chance(.14),l=t.pick(Le).clone().multiplyScalar(t.range(.5,.8)),n=t.pick(qt).clone().multiplyScalar(t.range(.45,.8)),h=t(),w=t.range(-.45,.45),g=t.chance(.42);if(m)continue;const y=i>0?s:-(s+o);k.box(y,y+o,b,b+2.7,0,u,l,n,h,9,7,w),g&&E.push([y+o/2,u+.6,b+(f%2?-.6:3.3),1,.74,.4,.55,3,h,1.3])}}const r=new S.Color("#4a5054"),c=(i,f,b,e)=>{k.box(i-.14,i+.14,f-.14,f+.14,0,9,r,r,.5,5,5),E.push([i+b,9.2,f+e,1,.62,.24,1.15,3,j(i,f),1.6])};for(let i=-405;i<=405;i+=30)Math.abs(i)>20&&(c(i,-364.4,0,1.6),c(i,-331.6,0,-1.6));for(let i=-1080;i<=-384;i+=36)c(-9.9,i,1.4,0),c(9.9,i,-1.4,0)}await G();const lo=await(async()=>{const e=new Float32Array(8601),s=new Float32Array(2867),o=[];for(let m=0;m<=46;m++)for(let l=0;l<=60;l++){const n=-170+360*m/46,h=-235+470*l/60,[w,g]=Se(n,h),y=X(w,g),a=m*61+l;e[a*3]=w,e[a*3+1]=y>.02?y:-.6,e[a*3+2]=g,s[a]=y,l===60&&m%12===11&&await G()}for(let m=0;m<46;m++)for(let l=0;l<60;l++){const n=m*61+l,h=n+60+1;s[n]+s[n+1]+s[h]+s[h+1]<.05||o.push(n,n+1,h+1,n,h+1,h)}const u=new S.BufferGeometry;return u.setAttribute("position",new S.BufferAttribute(e,3)),await G(),u.setIndex(o),await G(),u.computeVertexNormals(),u})();await G();const Ze=(()=>{let t=[0,0,0];for(let r=-40;r<=40;r+=8)for(let c=-40;c<=40;c+=8){const[i,f]=Se(r,c),b=X(i,f);b>t[1]&&(t=[i,b,f])}return t})();{const t=z.hill,r=qe.uBoard.value.z,c=Math.round(300*Math.max(.6,se));for(let i=0;i<c;i++){const f=t.range(-160,160),b=t.range(-225,225),[e,s]=Se(f,b),o=X(e,s);if(o<3||Math.abs(f-K.a)<r+16&&Math.abs(b)<K.half+14||Math.hypot(X(e+4,s)-X(e-4,s),X(e,s+4)-X(e,s-4))/8>.8||k.full||lt(e,s).d<300)continue;const m=N("cb-bush:"+i),l=m.range(2.6,5.5),n=m.range(.7,1.1),h=m(),w=U[7].clone().lerp(new S.Color("#1f3a1c"),m.range(0,.7)).multiplyScalar(m.range(.7,1.5)),g=o+l*n*.6,y=k.nv,a=w.clone().multiplyScalar(.55);k.v(e,g+l*n,s,0,1,0,w,0,0,h,4,1,1),k.v(e,g-l*n,s,0,-1,0,a,0,0,h,4,1,1);for(let x=0;x<4;x++){const d=h*6+x*Math.PI/2,v=Math.sin(d),p=Math.cos(d),M=l*m.range(.8,1.25);k.v(e+v*M,g+m.range(-.3,.3)*l,s+p*M,v,.2,p,x%2?w:a,0,0,h,4,1,1)}for(let x=0;x<4;x++){const d=y+2+x,v=y+2+(x+1)%4;k.t(y,d,v),k.t(y+1,v,d)}}for(let i=0;i<8;i++){const[f,b]=Se(K.a+r+5,(-35+i*10)*K.half/42);E.push([f,X(f,b)+2.2,b,1,.8,.52,1.2,3,i*.17,1.6]),Z(f,X(f,b)-.2,b,he[1],-he[0],1.5,2.6,4,.31+i*.07)}for(let i=0;i<3;i++){const[f,b]=Se(K.a-r-5.5,(-30+i*30)*K.half/42);Z(f,X(f,b)-.1,b,he[1],-he[0],30*K.half/42,2.6,5,.5)}{const i=U[0].clone().multiplyScalar(.9),f=i.clone().multiplyScalar(.6),b=K.a-r,e=K.a+r,s=K.half,o=(l,n,h)=>{const[w,g]=Se(l,n);return[w,K.h-(l-K.a)*K.slope+h,g]},u=(l,n,h,w,g,y)=>{(n[2]-l[2])*(w[0]-l[0])-(n[0]-l[0])*(w[2]-l[2])>=0?k.quad(l,n,h,w,g,2,.4,y||g):k.quad(l,w,h,n,g,2,.4,y||g)},m=(l,n,h,w)=>{k.quad([l[0],l[1]-h,l[2]],[n[0],n[1]-h,n[2]],n,l,f,2,.4,w),k.quad([n[0],n[1]-h,n[2]],[l[0],l[1]-h,l[2]],l,n,f,2,.4,w)};for(const l of[-1,1]){const n=o(b-1.5,l*(s+.2),1.5),h=o(e+1.5,l*(s+.2),1.5),w=o(b-1.5,l*(s+1.7),1.5),g=o(e+1.5,l*(s+1.7),1.5);u(n,h,g,w,i),m(n,h,1.7,i),m(w,g,4.5,i);for(let y=0;y<=8;y++){const a=o(b+(e-b)*y/8,l*(s+.95),2.3);E.push([a[0],a[1],a[2],1,.74,.42,.8,3,y*.13+l,1.7])}for(let y=e+14;y<176;y+=13){const a=l*(s*1.16+6*Math.sin(y*.06)+Math.max(y-K.a,0)*.22),[x,d]=Se(y,a),v=X(x,d);v>1.5&&E.push([x,v+2.4,d,1,.7,.36,.7,3,y*.07,1.5])}}{const l=o(b,-s-1.7,1.5),n=o(b,s+1.7,1.5),h=o(b-1.5,-s-1.7,1.5),w=o(b-1.5,s+1.7,1.5);u(l,n,w,h,i),m(l,n,1.7,i),m(h,w,3.5,i);for(let d=1;d<8;d++){const v=o(b-.75,-s+2*s*d/8,2.3);E.push([v[0],v[1],v[2],1,.74,.42,.8,3,d*.11,1.7])}const g=o(e+.2,-s-1.7,.7),y=o(e+.2,s+1.7,.7),a=o(e+1.5,-s-1.7,.7),x=o(e+1.5,s+1.7,.7);u(g,y,x,a,i),m(g,y,.9,i),m(a,x,2.5,i)}for(const l of[-45,-15,15,45].map(n=>n*K.half/42)){const[n,h]=Se(e+10,l),w=X(n,h);Z(n,w-.3,h,he[1],-he[0],3.6,20.3,4,.37+l*.003);for(const g of[-1.2,1.2])E.push([n+he[1]*g,w+20.2,h-he[0]*g,1,.84,.56,2.5,3,l*.01+g,3]);Ht.push([n,w+20,h,l])}}{const i=N("cb-board-creeper"),f=K.half,b=[];for(let e=0;e<8;e++)b.push([-1,-1+(e+.5)*.25,0],[1,-1+(e+.5)*.25,0]),e>0&&b.push([-1+e*.25+.125,-1,1]);i.shuffle(b);for(let e=0;e<11;e++){const[s,o,u]=b[e],m=i.range(3.6,8.2);qe.uCreep.value[e].set(s,o,m,0);{const l=i.range(-.2,.2)*m,n=i.range(.7,1.3),h=i.range(.9,1.25)*(.75+m/10),w=K.a+o*r+(u?-n:l*Math.cos(Math.atan(K.slope))),g=s*f+(u?l:Math.sign(s)*n),[y,a]=Se(w,g);M0.push([y,K.h-(w-K.a)*K.slope+1.5,a,h])}if(m>6.4){const l=i.range(-.3,.3)*m,n=K.a+o*r+(u?2.2:l*.7),h=s*f+(u?l:-Math.sign(s)*2.4),[w,g]=Se(n,h);M0.push([w,K.h-(n-K.a)*K.slope,g,i.range(.7,1)])}}}{const i=N("cb-board-crew"),f=he[1],b=-he[0];for(let m=0;m<Ht.length-1;m++){const l=Ht[m],n=Ht[m+1],h=Math.hypot(n[0]-l[0],n[2]-l[2]),w=Math.min(l[1],n[1])-3.4;Z((l[0]+n[0])/2,w,(l[2]+n[2])/2,f,b,h,2.4,5,.5);for(let g=1;g<=4;g++){const y=g/5;E.push([l[0]+(n[0]-l[0])*y,w-.3,l[2]+(n[2]-l[2])*y,1,.86,.6,1.25,3,m*.31+g*.17,2])}}const e=K.a+r;for(let m=0;m<9;m++){const l=e+i.range(3.2,8.5),n=i.range(-.92,.92)*K.half,h=i(),w=i.pick(qt).clone().multiplyScalar(i.range(.7,1)),g=i.chance(.6)?i.range(.35,.8):0,[y,a]=Se(l,n),x=X(y,a),d=(X(y+f*3,a+b*3)-X(y-f*3,a-b*3))/6;Vt(y,x,a,f,b,h,w,1.75,Math.abs(d)<.12?g:0,d)}const[s,o]=Se(e+12.5,K.half*1.22),u=X(s,o);k.box(s-2.6,s+2.6,o-1.9,o+1.9,u-.8,u+2.7,Le[3].clone().multiplyScalar(.8),Le[5],.43,2,2,.4),E.push([s,u+3.2,o,1,.78,.46,.8,3,.6,1.6])}{const i=[[1,6.5,.9],[-1,6.5,.82],[1,15.5,.6],[-1,15.5,.5],[1,24.5,.3]],f=new S.Color(.07,.055,.045);let b=0;for(let o=-138;o<=38;o+=6.5,b++)for(let u=0;u<i.length;u++){const[m,l,n]=i[u],h=N("cb-hut:"+b+":"+u);if(h()>n*Math.min(1.15,ue))continue;const w=h.range(3.6,6.2),g=h.range(3.2,4.8),y=h.range(-1.5,1.5),a=h.range(-1.2,1.2),x=o+y,[d,v]=Se(x,t0(x)+m*(l+a)),p=[X(d-w/2,v-g/2),X(d+w/2,v-g/2),X(d-w/2,v+g/2),X(d+w/2,v+g/2)],M=Math.min(...p),A=Math.max(...p);if(M<4||A>84||A-M>5.5||k.full||Gt.some(Ce=>Math.abs(Ce[0]-d)<(Ce[2]+w)/2+.7&&Math.abs(Ce[1]-v)<(Ce[3]+g)/2+.7))continue;const P=[d,v,w,g];Gt.push(P);const B=h.range(2.1,2.7),F=h.pick(Le).clone().multiplyScalar(h.range(.6,1)),D=h.pick(Le).clone().multiplyScalar(h.range(.55,.95)),q=h.pick(Le).clone().multiplyScalar(h.range(.6,1.1)),V=h(),R=h(),H=h(),T=h.range(.17,.25),$=h(),W=h.range(.12,.3),te=X(d+2,v)-X(d-2,v),pe=X(d,v+2)-X(d,v-2),fe=Math.hypot(te,pe)||1,ke=Math.abs(te)>Math.abs(pe),Te=ke?te>0?-1:1:pe>0?-1:1,Y=(M+A)/2,O=d-w/2,_=d+w/2,ae=v-g/2,de=v+g/2,ie=Y+B*.5,Me=Y+B,ve=Me+T*(ke?w:g),we=(Ce,Ve)=>{const xe=ke?(Ce-O)/w:(Ve-ae)/g;return Te>0?ve+(Me-ve)*xe:Me+(ve-Me)*xe};k.box(O,_,ae,de,M-.5,ie,F,F,V,2,2);{const Ve=O-.06,xe=_+.06,re=ae-.06,ge=de+.06,me=V*53,Ee=ve-ie;k.vOff=1.2,k.wall(Ve,ge,xe,ge,ie,we(O,de),we(_,de),0,1,D,V,2,me,Ee),k.wall(xe,ge,xe,re,ie,we(_,de),we(_,ae),1,0,D,V,2,me+31,Ee),k.wall(xe,re,Ve,re,ie,we(_,ae),we(O,ae),0,-1,D,V,2,me+57,Ee),k.wall(Ve,re,Ve,ge,ie,we(O,ae),we(O,de),-1,0,D,V,2,me+83,Ee),k.vOff=0}{const Ve=(xe,re)=>we(xe,re)+.05;k.quad([O-.5,Ve(O-.5,de+.5),de+.5],[_+.5,Ve(_+.5,de+.5),de+.5],[_+.5,Ve(_+.5,ae-.5),ae-.5],[O-.5,Ve(O-.5,ae-.5),ae-.5],q,2,V+.2)}const ze=(Ce,Ve,xe,re,ge,me,Ee,Ie,rt,Rt)=>{if(Ce){const jt=d+Ve*(w/2+.13),W0=ae+g*xe,j0=ae+g*re;return Ve>0?k.wall(jt,j0,jt,W0,ge,me,me,1,0,Ee,rt,Ie,rt*97,Rt):k.wall(jt,W0,jt,j0,ge,me,me,-1,0,Ee,rt,Ie,rt*97,Rt),[jt,(W0+j0)/2]}const Ft=v+Ve*(g/2+.13),p0=O+w*xe,I0=O+w*re;return Ve>0?k.wall(p0,Ft,I0,Ft,ge,me,me,0,1,Ee,rt,Ie,rt*97,Rt):k.wall(I0,Ft,p0,Ft,ge,me,me,0,-1,Ee,rt,Ie,rt*97,Rt),[(p0+I0)/2,Ft]},Fe=ze(ke,Te,.06,.94,Y-.1,Y+B-.25,q,9,V,B);R<.75&&E.push([Fe[0]+(Fe[0]-d)*.15,Y+B*.82,Fe[1]+(Fe[1]-v)*.15,1,.72,.38,.85,3,V,1.8]);const Ge=-m*he[1],Qe=m*he[0],Ke=Math.abs(Ge)>Math.abs(Qe),Be=Ke?Math.sign(Ge)||1:Math.sign(Qe)||1,ot=Ke===ke&&Be===Te,wt=Ke===ke&&Be===-Te,nt=ot||wt?!ke:Ke,Dt=ot||wt?1:Be,Wt=nt?g:w;if(ze(nt,Dt,W,W+.95/Wt,Y-.1,Y+1.85,f,2,V+.3,2),ze(nt,Dt,.62,.62+1/Wt,Y+.95,Y+1.75,q.clone().multiplyScalar(.75),2,V+.5,1),$<.34){const Ce=Math.min((ke?w:g)-.6,3),Ve=Y+B*.62,xe=D.clone().multiplyScalar(.85);if(ke){k.box(d-Ce/2,d+Ce/2,de,de+1.8,M-.5,Ve,xe,q,V+.4,2,2,.3*Te*-1),P[1]=v+.9,P[3]=g+1.8;const re=d+Ce/2+.75,ge=de+.6,me=X(re,ge);k.tank(re,ge,.45,me-.3,me+.9,_e[1],_e[0],V)}else{k.box(_,_+1.8,v-Ce/2,v+Ce/2,M-.5,Ve,xe,q,V+.4,2,2,-.35),P[0]=d+.9,P[2]=w+1.8;const re=_+.6,ge=v+Ce/2+.75,me=X(re,ge);k.tank(re,ge,.45,me-.3,me+.9,_e[1],_e[0],V)}}if(H<.45){const Ce=-pe/fe,Ve=te/fe,xe=lt(d,v),re=4+Math.floor(H*9),ge=d-te/fe*(ke?w/2+1.6:0),me=v-pe/fe*(ke?0:g/2+1.6);for(let Ee=0;Ee<re;Ee++){const Ie=(Ee+.5)/re-.5;mt(ge+Ce*Ie*re*1.1,X(ge+Ce*Ie*re*1.1,me+Ve*Ie*re*1.1)+2.2-.3*(1-4*Ie*Ie),me+Ve*Ie*re*1.1,Ce,Ve,h.range(.6,1),h.range(.7,1.3),xe.tx,xe.tz,xe.d<170&&h.chance(.35)?1:0,h)}}}const e=o=>{const u=.462*Math.cos(o*.021+1),m=-he[0]+u*he[1],l=-he[1]-u*he[0],n=Math.hypot(m,l);return[m/n,l/n]};for(let o=-130;o<=39;o+=13){const[u,m]=Se(o,t0(o)+2.4),l=X(u,m),n=e(o);l<3||(Z(u,l-.1,m,n[0],n[1],1.3,3.5,4,.33+o*.003),E.push([u,l+3.5,m,1,.7,.36,.8,3,o*.07,1.7]))}const s=N("cb-lane-folk");for(let o=0;o<26;o++){const u=s.range(-132,36),m=s.range(-.9,.9),[l,n]=Se(u,t0(u)+m),h=X(l,n),w=e(u);if(h<3)continue;const g=s(),y=s.pick(qt).clone().multiplyScalar(s.range(.6,1)),a=s.chance(.72)?s.range(.3,.7):0,x=s.chance(.2),d=(X(l+w[0]*3,n+w[1]*3)-X(l-w[0]*3,n-w[1]*3))/6;Vt(l,h,n,w[0],w[1],g,y,x?1.25:1.72,a,d)}}k.box(Ze[0]-3,Ze[0]+3,Ze[2]-2.5,Ze[2]+2.5,Ze[1]-1.5,Ze[1]+2.8,U[6].clone().multiplyScalar(.7),Pe[4],.3,2,2),Z(Ze[0]+5,Ze[1]-.5,Ze[2],Re[1],-Re[0],4,17,4,.4),E.push([Ze[0]+5,Ze[1]+17,Ze[2],1,.07,.03,1.8,2,.2,2.5])}await G();const ro=new Vo(200),n0=[],sa=.86,co=t=>{const r=new S.Shape(t.map(i=>new S.Vector2(i[0],-i[1]))),c=new S.ShapeGeometry(r);return c.rotateX(-Math.PI/2),c},na=co([[-1700,-2910],[1300,-2910],[1300,-330],[-150,-330],[-150,-95],[-1700,-95]]),la=co([[-150,-330],[1300,-330],[1300,1500],[400,1500],[400,430],[360,380],[300,380],[215,470],[215,3340],[-62,3340],[-62,-40],[-110,-95],[-150,-95]]);{const t=z.air,r=[[-1700,-95],[-110,-95],[-62,-40],[-62,3340],[215,3340],[215,470],[300,380],[360,380],[400,430],[400,1500],[1300,1500]],c=new S.Color("#5c5a55"),i=new S.Color("#25282a");for(let a=0;a<r.length-1;a++){const x=r[a],d=r[a+1],v=Math.hypot(d[0]-x[0],d[1]-x[1]),p=Math.max(1,Math.round(v/30)),M=(d[0]-x[0])/v,A=(d[1]-x[1])/v,P=-A,B=M;let F=[t.range(-1,1),t.range(-1.2,1.2)];for(let D=0;D<p;D++){const q=[t.range(-1,1),t.range(-1.2,1.2)],V=D/p,R=(D+1)/p,H=x[0]+(d[0]-x[0])*V,T=x[1]+(d[1]-x[1])*V,$=x[0]+(d[0]-x[0])*R,W=x[1]+(d[1]-x[1])*R,te=c.clone().multiplyScalar(t.range(.7,1.15)),pe=[H+P*1.4,-.35,T+B*1.4],fe=[$+P*1.4,-.35,W+B*1.4],ke=[H+P*(9+F[1]),-7.5,T+B*(9+F[1])],Te=[$+P*(9+q[1]),-7.5,W+B*(9+q[1])];k.quad(pe,fe,[$,.02,W],[H,.02,T],te,2,D*.37),k.quad(ke,Te,fe,pe,i,2,D*.37,te),F=q}}const f=U[0].clone().multiplyScalar(.95),b=lt(450,0);k.box(428,474,-300,330,0,13.6,f,Pe[3],.37,0,1),k.box(436,466,-120,140,13.6,19.6,f.clone().multiplyScalar(.9),Pe[0],.71,0,1);for(let a=0;a<3;a++)k.box(396,428,-214+a*170,-202+a*170,3,8.5,f,Pe[3],.2+a*.1,3,2);k.box(520,530,-262,-252,0,34,f.clone().multiplyScalar(.85),Pe[4],.5,2,2),k.box(517,533,-265,-249,34,38.5,new S.Color("#1c2428"),Pe[3],.5,5,2),E.push([525,41,-257,1,.07,.03,1.6,2,.6,2.2]);for(let a=0;a<3;a++){const x=-250+a*190;k.box(610,720,x,x+150,0,20,t.pick(Le).clone().multiplyScalar(.9),t.pick(Le),t(),2,2,t.range(3,6))}for(let a=0;a<6;a++){const x=-260+a*110;Z(412,0,x,0,1,6,28,4,t()),E.push([412,28.3,x,1,.72,.38,1.7,0,t(),2.2])}let e=k,s=E;const o=(a,x,d,v,p,M,A,P)=>{const B=x[0]-a[0],F=x[1]-a[1],D=x[2]-a[2],q=v[0]-a[0],V=v[1]-a[1],R=v[2]-a[2];(F*R-D*V)*M+(D*q-B*R)*A+(B*V-F*q)*P>=0?e.quad(a,x,d,v,p,5,.5):e.quad(a,v,d,x,p,5,.5)},u=(a,x,d,v,p,M)=>{const A=new S.Color("#d9dad6"),P=new S.Color("#8f959a"),B=new S.Color("#3c4146"),F=(q,V,R)=>[a-d*q*p-v*R*p,V*p,x-v*q*p+d*R*p],D=[[0,.35,4.4],[2.5,2.1,4.9],[8,3.15,5.3],[46,3.15,5.3],[57,1.7,6.1],[64,.45,6.9]];for(let q=0;q<D.length-1;q++)for(let V=0;V<8;V++){const R=(V+.5)/8*yt,H=(V+1.5)/8*yt,T=(R+H)/2,$=D[q],W=D[q+1],te=Math.cos(T)<-.3?P:Math.abs(Math.cos(T))<.3&&q>0&&q<4?M:A;o(F($[0],$[2]+$[1]*Math.cos(R),$[1]*Math.sin(R)),F(W[0],W[2]+W[1]*Math.cos(R),W[1]*Math.sin(R)),F(W[0],W[2]+W[1]*Math.cos(H),W[1]*Math.sin(H)),F($[0],$[2]+$[1]*Math.cos(H),$[1]*Math.sin(H)),te,-v*Math.sin(T),Math.cos(T),d*Math.sin(T))}for(let q=-1;q<=1;q+=2){const V=[F(21,4.3,q*3),F(34,4.3,q*3),F(46,6.2,q*29.5),F(42,6.2,q*29.5)];o(V[0],V[1],V[2],V[3],A,0,1,0),o(...V.map(T=>[T[0],T[1]-.5*p,T[2]]),P,0,-1,0);const R=[F(55,6.6,q*1.5),F(61.5,6.6,q*1.5),F(64.5,7.6,q*11),F(62,7.6,q*11)];o(R[0],R[1],R[2],R[3],A,0,1,0),o(...R.map(T=>[T[0],T[1]-.3*p,T[2]]),P,0,-1,0);const H=[F(52,8.2,q*.25),F(61,8.2,q*.25),F(65.5,19,q*.25),F(60.5,19,q*.25)];o(H[0],H[1],H[2],H[3],M,-v*q,0,d*q);for(let T=0;T<2;T++){const $=25+T*9,W=q*(10.5+T*9.5),te=F($,0,W),pe=F($+5,0,W),fe=Math.min(te[0],pe[0])-1.2*p*Math.abs(v),ke=Math.max(te[0],pe[0])+1.2*p*Math.abs(v),Te=Math.min(te[2],pe[2])-1.2*p*Math.abs(d),Y=Math.max(te[2],pe[2])+1.2*p*Math.abs(d);e.box(fe,ke,Te,Y,1.7*p,4.1*p,P,B,.5,5,5),o([fe,1.7*p,Te],[ke,1.7*p,Te],[ke,1.7*p,Y],[fe,1.7*p,Y],P,0,-1,0)}}};for(let a=-150;a<420;a+=30)Z(a+15,0,-328,1,0,30,2.9,5,.5);const m=U[5].clone().multiplyScalar(.9);k.box(41,46.5,-246,-241,0,3.2,m,Pe[3],.6,6,2),Z(43.7,3.2,-243.5,1,0,2.4,9,4,.8),E.push([43.7,12.4,-243.5,1,.07,.03,1.4,2,.35,2.2]);for(let a=-66;a<=-6;a+=12)for(const x of[-1,1])E.push([x*39.6,.35,a,.1,.32,1,.55,0,a*.05,1.4]);for(let a=0;a<4;a++)E.push([44+a*3,.7,318,1,a<2?.92:.1,a<2?.8:.06,1,0,a*.2,1.9]);const l=(a,x,d)=>{const v=Lt[0],p=Lt[1],M=-p,A=v,P=lt(a,d),B=5,F=4.6,D=I(),q=new S.Color("#d8581a"),V=new S.Color("#d9d5c8");Z(a,0,d,M,A,1.4,x+.5,4,.9);for(let R=0;R<B&&!ye.full;R++){const H=R/B,T=(R+1)/B,$=.6-.32*H,W=.6-.32*T,te=R%2?V:q,pe=[a+v*F*H,x-.3*H,d+p*F*H],fe=[a+v*F*T,x-.3*T,d+p*F*T];for(let ke=0;ke<2;ke++){const Te=ke?M:0,Y=ke?0:1,O=ke?A:0;ye.put("position",0,pe[0]-Te*$,pe[1]+Y*$,pe[2]-O*$),ye.put("position",1,pe[0]+Te*$,pe[1]-Y*$,pe[2]+O*$),ye.put("position",2,fe[0]+Te*W,fe[1]-Y*W,fe[2]+O*W),ye.put("position",3,fe[0]-Te*W,fe[1]+Y*W,fe[2]-O*W),ye.put("aL",0,D-H*.12,H*2.6,0,.5),ye.put("aL",1,D-H*.12,H*2.6,0,.5),ye.put("aL",2,D-T*.12,T*2.6,0,.5),ye.put("aL",3,D-T*.12,T*2.6,0,.5),ye.all("normal",.3*M,.9,.3*A),ye.all("aC",a,x,d),ye.all("aD",P.tx,P.tz,M,A),ye.all("color",te.r,te.g,te.b),ye.next()}}};l(47,8.4,-118),l(150,8.4,700),l(-58,8.4,-62);const n=["#1f4d3a","#9a2222","#1f3a70","#c7a23a","#5a2a6a","#d0d0cc"].map(Ct);for(let a=0;a<6;a++){const x=t.pick(n),d=t.range(.72,1);t.chance(.78)&&u(392-t.range(0,6),-207.5+a*85,1,0,d,x)}t.chance(.7)&&u(110,t.range(500,1500),0,-1,.9,t.pick(n));const h=Q.core?.makeRng?Q.core.makeRng(Q.core.hashSeed("cb-shore:"+(Q.seed??0))):L.fork("shore"),w=(a,x,d,v,p)=>{const M=(P,B,F)=>[a-d*P*p-v*F*p,B*p,x-v*P*p+d*F*p],A=(P,B,F,D,q,V)=>s.push([P[0],P[1],P[2],B[0],B[1],B[2],F,D,q,V]);A(M(30,9.2,0),[1,.07,.03],1.5,2,h(),2.2),A(M(30,1.6,0),[1,.07,.03],1.2,2,h(),1.8),A(M(44,6.6,29.5),[1,.1,.06],.7,0,.3,1.5),A(M(44,6.6,-29.5),[.1,1,.3],.7,0,.6,1.5),A(M(65,9,0),[1,1,1],.6,0,.9,1.4),A(M(7.5,1.9,0),[1,.93,.8],1.5,0,.1,2.2),A(M(22,4,3.4),[1,.93,.8],1.1,0,.4,1.8),A(M(22,4,-3.4),[1,.93,.8],1.1,0,.7,1.8);for(let P=0;P<20;P++)if(P%7!==6)for(const B of[-1,1])A(M(9+P*2.1,5.75,B*3.2),[1,.82,.55],.26,3,P*.13,.9);A(M(60,16,.5),[1,.9,.7],.5,3,.2,1.2),A(M(60,16,-.5),[1,.9,.7],.5,3,.5,1.2)};u(47,30,-1,0,1,h.pick(n)),w(47,30,-1,0,1);for(let a=0;a<2;a++){const x=128+a*92,d=h.range(.84,.95);u(110,x,0,-1,d,h.pick(n)),w(110,x,0,-1,d)}await G();const g=new S.Color("#31404a");k.box(152,200,112,470,0,15.5,f,Pe[3],.43,0,1),k.box(158,196,180,262,15.5,27,f.clone().multiplyScalar(.92),Pe[0],.77,0,1),k.box(158,196,372,432,15.5,23,f.clone().multiplyScalar(.92),Pe[0],.27,0,1),k.box(180,190,488,498,0,46,f.clone().multiplyScalar(.85),Pe[4],.5,2,2),k.box(176,194,484,502,46,51.5,g,Pe[3],.5,5,2);for(let a=0;a<4;a++)for(const x of[-1,1])E.push([185+x*9.3,48.8,486+a*4.6,.75,1,.86,.7,3,a*.21,1.4]);E.push([185,55,493,1,.07,.03,1.6,2,.15,2.2]),k.box(142,205,560,730,0,31,Le[3].clone().multiplyScalar(.8),Le[5],.61,2,2,5);for(let a=572;a<=720;a+=18.5)E.push([140.5,29.5,a,1,.78,.46,1.5,3,a*.017,2]);for(let a=0;a<8;a++){const x=150+a*110;Z(142,0,x,0,1,6,28,4,h()),E.push([142,28.3,x,1,.72,.38,1.7,0,h(),2.2])}for(const a of[-1,1]){const x=Ne[1]+a*41.5;k.box(Ne[0]-52,Ne[0]+52,Math.min(x,x+a*5),Math.max(x,x+a*5),0,6.5,f.clone().multiplyScalar(.7),Pe[3],.31,2,2);for(let d=-48;d<=48;d+=12)E.push([Ne[0]+d,7.4,x,.92,.97,1,.9,3,d*.02,1.5])}const y=[];for(let a=0;a<8;a++)for(let x=0;x<10;x++){const d=414+a*100+h.range(0,14),v=446+x*104+h.range(0,12),p=h.range(58,78),M=h.range(52,84),A=h(),P=h(),B=it(h),F=h.pick(Pe),D=h();if(A<.1)continue;const q=A>(a===0?.7:.5),V=q?76+P*74:22+3*Math.round(P*9);if(y.push(q?[d,d+(24+P*10),v,v+28,V,1]:[d,d+p,v,v+M,V,0]),q){const R=24+P*10;k.box(d,d+R,v,v+28,0,V,B.lerp(U[0],.3),F,D,0,1),E.push([d+R/2,V+1.5,v+14,1,.07,.03,1.5,2,D,2.2]),k.box(d+R+5,d+p+12,v,v+M*.8,0,16+3*Math.round(P*4),it(h),F,D*.7+.1,0,1)}else k.box(d,d+p,v,v+M,0,V,B,F,D,0,1)}for(let a=440;a<=1490;a+=35)E.push([404,8.5,a,1,.62,.24,1.2,3,a*.031,1.6]);{const a=N("cb-shore-roofs");for(const[x,d,v,p,M,A]of y){const P=A?2:2+Math.floor(a()*3),B=d-x,F=p-v,D=U[0].clone().multiplyScalar(a.range(.5,.85));for(let $=0;$<P;$++){const W=a.range(.14,.34)*B,te=a.range(.16,.4)*F,pe=a.range(x+1,d-1-W),fe=a.range(v+1,p-1-te),ke=a.range(3,A?9:6.5),Te=a(),Y=a.pick(Pe);k.box(pe,pe+W,fe,fe+te,M,M+ke,D.clone().multiplyScalar(.8+.4*Te),Y,Te,2,1),a.chance(.5)&&k.tank(pe+W/2,fe+te/2,Math.min(W,te)*.3,M+ke,M+ke+a.range(1.6,3),a.pick(_e),_e[0],a())}const q=a(),V=a.range(12,24),R=a.range(x+4,d-4),H=a.range(v+4,p-4),T=a();if(A?(Z(R,M,H,.7,.7,2.2,V,4,.2+.6*T),Z(R,M,H,-.7,.7,2.2,V,4,.2+.6*T),E.push([R,M+V+.6,H,1,.07,.03,1.1,2,T,1.8])):q<.34&&(k.tank(R,H,1.9,M,M+V+6,D,D,T),E.push([R,M+V+7,H,1,.07,.03,1.2,2,T,1.9])),x<520)for(let $=v+3;$<p-2;$+=9)E.push([x-.6,Math.min(M-1,14+9*T),$,1,.8,.5,1,3,$*.013+T,1.5])}}for(const[a,x]of[[-64,-37],[64,-37],[-64,37],[64,37]])Z(Ne[0]+a,.2,Ne[1]+x,.7,.7,1.8,17,4,.37),E.push([Ne[0]+a,17.8,Ne[1]+x,.92,.97,1,2,3,a*.01+x*.003,2.3]);await G();for(const[a,x,d,v,p]of[[110,-62,0,1,.92],[110,-170,0,1,.86],[214,-130,1,0,.8],[214,-245,1,0,.8],[-57,-150,1,0,.84],[-57,-250,1,0,.84]]){if(a===110&&x===-170){e=ro,s=n0,u(0,0,0,1,p,h.pick(n)),w(0,0,0,1,p);const M=new S.Color("#8f959a"),A=new S.Color("#15171a"),P=new S.Color("#d9dad6");for(const B of[-1,1]){for(let D=0;D<2;D++){const q=(-B*(10.5+D*9.5)-1.2)*p,V=q+2.4*p,R=-(25+D*9)*p,H=R-5*p,T=1.7*p,$=4.1*p;o([q,T,H],[V,T,H],[V,T,R],[q,T,R],M,0,-1,0),o([q+.3*p,T+.3*p,R+.03],[V-.3*p,T+.3*p,R+.03],[V-.3*p,$-.3*p,R+.03],[q+.3*p,$-.3*p,R+.03],A,0,0,1),o([q+.5*p,T+.5*p,H-.03],[V-.5*p,T+.5*p,H-.03],[V-.5*p,$-.5*p,H-.03],[q+.5*p,$-.5*p,H-.03],A,0,0,-1)}const F=(D,q,V)=>[-B*V*p,q*p,-D*p];o(F(21,4.3,3),F(42,6.2,29.5),F(42,5.7,29.5),F(21,3.8,3),P,0,0,1),o(F(34,4.3,3),F(46,6.2,29.5),F(46,5.7,29.5),F(34,3.8,3),M,0,0,-1),o(F(42,6.2,29.5),F(46,6.2,29.5),F(46,5.7,29.5),F(42,5.7,29.5),P,-B,0,0),o(F(55,6.6,1.5),F(62,7.6,11),F(62,7.3,11),F(55,6.3,1.5),P,0,0,1),o(F(61.5,6.6,1.5),F(64.5,7.6,11),F(64.5,7.3,11),F(61.5,6.3,1.5),M,0,0,-1)}e=k,s=E}else u(a,x,d,v,p,h.pick(n)),w(a,x,d,v,p);await G()}k.box(222,262,-312,-84,0,14,f,Pe[3],.53,0,1),k.box(228,256,-250,-150,14,19,f.clone().multiplyScalar(.9),Pe[0],.21,0,1);for(let a=-304;a<=-92;a+=17.6)E.push([221.2,12.6,a,1,.78,.46,1.4,3,a*.017,1.9]);for(const a of[-300,-205,-110])Z(148,0,a,0,1,6,28,4,.41-a*.001),E.push([148,28.3,a,1,.72,.38,1.7,0,.3-a*.003,2.2]);k.box(-84,-76,-82,-75,0,3.4,m,Pe[3],.6,6,2),Z(-80,3.4,-78.5,1,0,2.4,9,4,.8),E.push([-80,12.6,-78.5,1,.07,.03,1.4,2,.75,2.2]),E.push([-75.6,3,-78.5,1,.78,.46,1.2,3,.4,1.8]);for(const a of[-300,-200,-100])Z(-140,0,a,0,1,6,28,4,.47-a*.001),E.push([-140,28.3,a,1,.72,.38,1.7,0,.6-a*.003,2.2])}await G();{const t=N("cb-ramp"),r=new S.Color("#c9a227"),c=new S.Color("#d8d6cc"),i=new S.Color("#2a2d30"),f=[1,.5,.06];for(const[b,e,s,o,u]of[[214,-130,1,0,.8],[214,-245,1,0,.8],[-57,-150,1,0,.84],[-57,-250,1,0,.84]]){const m=(h,w)=>[b-s*h*u-o*w*u,e-o*h*u+s*w*u],l=t.chance(.5)?1:-1,n=(h,w,g,y,a,x,d)=>{const[v,p]=m(h,w);return k.box(v-g/2,v+g/2,p-y/2,p+y/2,0,a,x,d,t(),5,2),E.push([v,a+.5,p,...f,1.3,2,t(),2.5]),[v,p]};n(-7,0,4.2,2.6,1.9,r,i),n(20,l*7.5,7.5,2.8,2.6,c,c),n(47,l*8,6.2,2.6,3.1,c,r);for(let h=0;h<4;h++){const[w,g]=m(22+h*3.6,l*13);k.box(w-1.5,w+1.5,g-1,g+1,.3,1.7,h%2?r:i,t.pick(qt),t(),5,2)}for(let h=0;h<4;h++){const[w,g]=m(t.range(-4,50),l*t.range(5,15)),y=t.range(0,6.2832),a=t();Vt(w,0,g,Math.cos(y),Math.sin(y),a,r,1.75,t.chance(.6)?.4:0)}}}await G();{const t=[1,.92,.78],r=[1,.62,.2];for(let e=0;e<=3300;e+=60)for(let s=-1;s<=1;s+=2)E.push([s*31.5,.6,e,...e>2700?r:t,1.1,0,e*.013,2.1]);for(let e=30;e<3300;e+=30)E.push([0,.25,e,...t,.6,0,e*.017,1.5]);for(let e=-42;e<=42;e+=3)Math.abs(e)>8.5&&E.push([e,.5,-1,.1,1,.32,Math.abs(e)>30?1.2:.9,0,e*.1,1.8]);for(let e=-30;e<=30;e+=6)E.push([e,.5,3302,1,.05,.03,1,0,e*.1,1.8]);for(let e=0;e<=1900;e+=60)for(let s=-1;s<=1;s+=2)E.push([110+s*15.5,.4,e,.08,.25,1,.5,0,e*.02,1.2]);for(let e=30;e<=1170;e+=60)for(let s=-1;s<=1;s+=2)E.push([s*31.5,.6,e,...t,1,0,e*.013,2]);for(let e=60;e<=900;e+=30)for(let s=-1;s<=1;s+=2)for(let o=0;o<3;o++)E.push([s*(9+o*1.5),.2,e,...t,.42,0,e*.011+o,1.1]);for(let e=30;e<=1170;e+=60)for(let s=-1;s<=1;s+=2)E.push([110+s*15.5,.4,e,.08,.25,1,.5,0,e*.02,1.2]);for(let e=40;e<=94;e+=9)E.push([e,.25,30,.1,1,.3,.45,0,e*.07,1.2]);for(let e=17;e<=43;e+=3.25)E.push([40.5,.3,e,1,.06,.03,.55,0,e*.09,1.3]);for(let e=-30;e<=330;e+=15)E.push([-58.5,.5,e,.1,.3,1,.6,0,e*.027,1.5]);const c=[];for(let e=-60;e>=-324;e-=33){const s=1.5+(-e-60)*.025;for(let o=-4.5;o<=4.5;o+=1.5)E.push([o,s,e,1,.82,.54,.95,0,o*.2+e,1.5]);Z(0,0,e,1,0,9,s+.25,4,.3),c.push([0,s+.7,e])}for(let e=-21;e<=21;e+=3)E.push([e,8.2,-291,.86,.68,.42,.5,0,e*.2,1]);for(let e=-13.5;e<=13.5;e+=3)Math.abs(e)>5&&E.push([e,4,-159,.86,.68,.42,.8,0,e*.2,1.4]);for(let e=-60;e>=-258;e-=33)for(const s of[-1,1])for(let o=0;o<3;o++)E.push([s*(9.5+o*1.5),1.2+(-e-60)*.02,e,1,.07,.04,.6,0,e*.03+o,1.35]);Z(0,0,-291.3,1,0,44,8.4,4,.6);for(const[e,s]of[[-93,7.5],[-225,16.5]]){const o=1.5+(-e-60)*.025;for(let u=-s;u<=s;u+=3)Math.abs(u)>5&&E.push([u,o,e,.86,.68,.42,.8,0,u*.2,1.4]);Z(0,0,e-.3,1,0,s*2+2,o+.2,4,.6)}for(let e=-315;e<=-15;e+=15)for(const s of[-1,1])E.push([s*31.5,.5,e,1,.6,.18,.85,0,e*.013,1.7]);for(let e=-310;e<=-40;e+=30)for(const s of[-1,1])E.push([110+s*15.5,.4,e,.08,.25,1,.5,0,e*.02,1.2]);for(let e=-310;e<=-10;e+=15)E.push([110,.25,e,.1,1,.3,.45,0,e*.07,1.2]);for(let e=-310;e<=-56;e+=23)E.push([51.5,.4,e,.08,.25,1,.5,0,e*.02,1.2]),e<-104&&E.push([-51.5,.4,e,.08,.25,1,.5,0,e*.02+.5,1.2]);for(let e=-390;e>=-1100;e-=47.5){for(let s=-2.5;s<=2.5;s+=2.5)E.push([s,9.4,e,1,.8,.52,.8,0,s*.2+e,1.1]);Z(0,0,e,1,0,6,9.6,4,.5),c.push([0,10.2,e])}const i=(e,s)=>{let o=null,u=3600;for(const m of k0){const l=(m[0]-e)*(m[0]-e)+(m[2]-s)*(m[2]-s);l<u&&(u=l,o=m)}return o},f=1e3,b=We*-Xe;for(let e=b-30;e>-260;e-=48){let s,o;if(e>=0){const m=Xe*(1-e/b);s=Oe[0]+We*Math.cos(m),o=Oe[1]+We*Math.sin(m)}else s=Je[0]+Re[0]*e,o=Je[1]+Re[1]*e;const u=i(s,o);u&&(Z(u[0],u[1],u[2],Re[1],-Re[0],5,6.5,4,.7),c.push([u[0],u[1]+7.1,u[2]]))}c.forEach((e,s)=>E.push([e[0],e[1],e[2],.82,.9,1,2.2,1,.9*(1-s/(c.length-1)),2.4])),qe.uChain.value.x=c.length,J0.push(...c.reverse().map(e=>[e[0],e[1],e[2]]))}await G(),k.max+=g0*4,De.max+=w0,ye.max+=y0;const Nt=[];{const t=new S.Color(.07,.055,.045),r=Le[5].clone().multiplyScalar(.8);let c=0;for(const i of X0){const[f,b,e,s,o,u,m,l]=i,n=(b-f)/2,h=(s-e)/2,w=(f+b)/2,g=(e+s)/2;if(o<12||o>58||Math.min(n,h)<4.4||Va(w,g)>=St)continue;const y=n>=h,a=y?n:h,x=y?h:n,d=y?1:0,v=y?0:1,p=(O,_)=>[w+d*O+v*_,g+v*O+d*_],M=Math.max(2,Math.floor(a/3.5+.5)),A=2*a/M,P=j(f*.13,e*.29);if(u!==1){for(let O=0;O<M;O++){const[_,ae]=p(-a+(O+.5)*A,0);E.push([_,o+3,ae,1,.82,.56,.5,3,P+O*.37,1.25])}for(const O of[-1,1]){const[_,ae]=p(O*(a-.7),0);Z(_,o,ae,v,d,.5,3.1,4,.3+.4*P)}}const B=u0(w,g),F=B[0]>Qt[0]&&B[0]<Qt[1]&&Math.abs(B[1])<90,D=O=>{const _=ee("cb-deck2",f,e),ae=O||(_.chance(.5)?1:-1),de=ae*x*.21,ie=F?.5:_(),Me=Math.min(2*a-4,5+6*_());if(ie<.42){const ve=Math.max(3,Math.min(5,Math.floor(Me/1.6))),we=ve*1.6;for(let ze=0;ze<ve;ze++){const Fe=(ze+.5)/ve-.5,[Ge,Qe]=p(Fe*we,de);mt(Ge,o+2.25-.3*(1-4*Fe*Fe),Qe,d,v,_.range(.8,1.3),_.range(.8,1.5),m.tx,m.tz,0,_,1)}for(const ze of[-1,1]){const[Fe,Ge]=p(ze*(we/2+.3),de);Z(Fe,o,Ge,v,d,.4,2.5,4,.5)}}else if(ie<.8){const[ve,we]=p(_.range(-.15,.15)*a,de),ze=Me/2,Fe=d?ze:.5,Ge=d?.5:ze,Qe=U[7].clone().multiplyScalar(_.range(.6,1.1));k.box(ve-Fe,ve+Fe,we-Ge,we+Ge,o,o+_.range(.7,1.3),new S.Color(.16,.11,.08),Qe,_(),2,4)}else{const ve=_.range(-.3,.3)*a,[we,ze]=p(ve,de),Fe=_.pick(Le).clone().multiplyScalar(_.range(.6,1)),Ge=_.pick(Le).clone().multiplyScalar(_.range(.6,1.05)),Qe=_.range(1.4,2),Ke=Math.min(_.range(.8,1),x*.16);k.box(we-(d?Qe:Ke),we+(d?Qe:Ke),ze-(d?Ke:Qe),ze+(d?Ke:Qe),o,o+2.3,Fe,Ge,_(),2,2,.2);const[Be,ot]=p(ve,de-ae*(Ke+.3));E.push([Be,o+2.1,ot,1,.74,.4,.6,3,_(),1.4])}};if(u===0&&!l&&(F||x<5.5)&&!k.full&&D(0),u!==0||l||F||x<5.5||k.full)continue;const q=ee("cb-skim",f,e),V=q.chance(.5)?1:-1,R=Math.max(1,Math.min(2+Math.floor(q()*2.4),Math.floor(2*a/4.4))),H=2*a/R,T=m.d<170&&m.s>q0&&m.s<P0;let $=o,W=0;for(let O=0;O<R;O++){const _=q.range(3,Math.max(3.1,Math.min(5.8,H-.9))),ae=q.range(2.6,Math.min(3.8,x-1.6)),de=q.chance(.28),ie=de?q.range(4.9,5.5):q.range(2.3,2.9),Me=-a+(O+.5)*H+q.range(-.2,.2)*(H-_-.6),ve=V*(x-.55-ae/2),we=q(),ze=q(),Fe=q.pick(Le).clone().multiplyScalar(q.range(.6,1.05)),Ge=q.pick(Le).clone().multiplyScalar(q.range(.6,1.1)),Qe=it(q).multiplyScalar(.8),Ke=(xe,re)=>p(Me+xe*_/2,ve+re*ae/2),Be=o+ie,ot=(xe,re,ge,me,Ee,Ie)=>k.wall(xe[0],xe[1],re[0],re[1],o,Be,Be,d*ge+v*me,v*ge+d*me,Ee,we,Ie,Ie===11?0:we*97,ie),wt=Ke(-1,-1),nt=Ke(1,-1),Dt=Ke(1,1),Wt=Ke(-1,1),Ce=(xe,re,ge,me,Ee,Ie)=>{const rt=d*ge+v*me,Rt=v*ge+d*me,Ft=re[0]-xe[0];-(re[1]-xe[1])*rt+Ft*Rt>0?ot(xe,re,ge,me,Ee,Ie):ot(re,xe,ge,me,Ee,Ie)};Ce(wt,nt,0,-1,V>0?Qe:Fe,V>0?11:2),Ce(Wt,Dt,0,1,V>0?Fe:Qe,V>0?2:11),Ce(wt,Wt,-1,0,Fe,2),Ce(nt,Dt,1,0,Fe,2);{const re=p(Me-_/2-.25,ve-ae/2-.25),ge=p(Me+_/2+.25,ve-ae/2-.25),me=p(Me+_/2+.25,ve+ae/2+.25),Ee=p(Me-_/2-.25,ve+ae/2+.25);(ge[1]-re[1])*(Ee[0]-re[0])-(ge[0]-re[0])*(Ee[1]-re[1])>=0?k.quad([re[0],Be+.05,re[1]],[ge[0],Be+.05,ge[1]],[me[0],Be+.05,me[1]],[Ee[0],Be+.05,Ee[1]],Ge,2,we+.2):k.quad([re[0],Be+.05,re[1]],[Ee[0],Be+.05,Ee[1]],[me[0],Be+.05,me[1]],[ge[0],Be+.05,ge[1]],Ge,2,we+.2)}if(ze<.8){const[xe,re]=p(Me+_*.22,ve-V*(ae/2+.35));E.push([xe,o+Math.min(ie,2.9)*.86,re,1,.72,.38,.6,3,we,1.4])}Be>$&&($=Be,W=Me);const Ve=1+Math.floor(q()*3.2);for(let xe=0;xe<Ve;xe++){const re=q.int(0,3)*.785+q.range(-.2,.2),[ge,me]=p(Me+q.range(-.4,.4)*_,ve+q.range(-.35,.35)*ae);Z(ge,Be,me,Math.cos(re),Math.sin(re),3,q.range(4.5,10.5),0,q())}}const te=q(),pe=q(),fe=q.range(1.9,2.6),ke=q(),Te=q(),Y=1+Math.floor(q()*2.5);if(te<.62){const[O,_]=p((pe<.5?-1:1)*(a-2.4),-V*(x-2.2));k.box(O-1.5,O+1.5,_-1.5,_+1.5,o,o+2.1,r,r,pe,3,2),k.tank(O,_,1.35,o+2.1,o+2.1+fe,q.pick(_e),_e[0],pe)}{const O=Math.min(2*a-3.5,6+6*ke),_=Math.max(3,Math.floor(O/1.45)),ae=-V*x*.42;for(let de=0;de<_;de++){const ie=(de+.5)/_-.5,[Me,ve]=p(ie*O,ae);mt(Me,o+2.3-.35*(1-4*ie*ie),ve,d,v,q.range(.6,1.05),q.range(.7,1.5),m.tx,m.tz,T&&q.chance(.4)?1:0,q)}for(const de of[-1,1]){const[ie,Me]=p(de*(O/2+.3),ae);Z(ie,o,Me,v,d,.4,2.5,4,.5)}}if(Te<.24&&$>o+4){const[O,_]=p(W,V*(x-.55)-V*4.1);Z(O,o,_,d,v,7.5,$-o+2.6,1,Te*4)}for(let O=0;O<Y;O++){const[_,ae]=p(q.range(-.7,.7)*a,-V*q.range(.05,.3)*x),de=q(),ie=q.pick(qt).clone().multiplyScalar(q.range(.65,1)),Me=q.chance(.6);Vt(_,o,ae,d,v,de,ie,q.range(1.6,1.8),Me?Math.min(.5,Math.max(0,a-Math.abs((_-w)*d+(ae-g)*v)-1)/5):0)}x>=6&&!k.full&&D(-V),++c%12===0&&await G()}}await G();{const t=at,r=-he[0],c=-he[1],i=he[1],f=-he[0],b=Math.cos(Math.atan(K.slope))*K.half,e=U[0].clone().multiplyScalar(.62),s=[new S.Color("#6b3a2c"),new S.Color("#4f5658"),new S.Color("#5d6a52"),new S.Color("#7a4a35")],o=(l,n,h,w)=>{const g=N("cb-village:"+l),y=g.range(2.5,3.2),a=g.range(2.2,2.7),x=g.chance(.45),d=x?5.3:2.75,v=g.range(-.8,.8),p=g(),M=it(g).multiplyScalar(.6),A=g.pick(s).clone().multiplyScalar(g.range(.7,1.05)),P=g(),B=g.range(.5,.9),F=(Y,O)=>Se(n+v+Y*a,h+O*y),D=F(0,0);if(Gt.some(Y=>Math.abs(Y[0]-D[0])<Y[2]/2+4.6&&Math.abs(Y[1]-D[1])<Y[3]/2+4.6)||k.full)return;const q=F(-1,-1),V=F(-1,1),R=F(1,-1),H=F(1,1),T=[q,V,R,H].map(Y=>X(Y[0],Y[1])),$=Math.min(...T),W=Math.max($+.4,(T[0]+T[1])/2-.5),te=W+d,pe=(Y,O,_,ae,de,ie,Me,ve,we,ze)=>k.wall(Y[0],Y[1],O[0],O[1],de,ie,Me,_,ae,ve,p,we,we===11?0:p*97,ze);pe(H,R,r,c,$-.6,W,W,e,2,3),pe(V,H,i,f,$-.6,W,W,e,2,3),pe(R,q,-i,-f,$-.6,W,W,e,2,3),pe(H,R,r,c,W,te,te,M,11,d),pe(V,H,i,f,W,te+B,te,M,11,d),pe(R,q,-i,-f,W,te,te+B,M,11,d),pe(q,V,-r,-c,W,te+B,te+B,M,2,d);{const O=(ve,we)=>{const ze=Se(n+v+ve*(a+.45),h+we*(y+.45));return[ze[0],te+.06+B*(1-ve)/2*(1+.45/a),ze[1]]},_=O(-1,-1),ae=O(1,-1),de=O(1,1),ie=O(-1,1);(ae[2]-_[2])*(ie[0]-_[0])-(ae[0]-_[0])*(ie[2]-_[2])>=0?k.quad(_,ae,de,ie,A,2,p+.2):k.quad(_,ie,de,ae,A,2,p+.2)}if(P<.85){const Y=Se(n+v+a+.45,h+(p-.5)*y);E.push([Y[0],W+2,Y[1],1,.72,.38,1.25,3,p,2.3])}if(x&&P>.2){const Y=Se(n+v+a+.3,h-(p-.5)*y);E.push([Y[0],W+4.3,Y[1],1,.8,.5,.8,3,p+.4,1.7])}const fe=N("cb-village-dress:"+l),ke=fe.chance(.45),Te=ke?new S.Color(fe.pick(["#2b5a94","#3d6e58","#8c8f88","#a9652c","#34495e"])).multiplyScalar(fe.range(.7,1)):fe.pick(Le).clone().multiplyScalar(fe.range(.55,1.05));{const O=fe.range(-1,.1),_=Math.min(1,O+fe.range(.7,1.4)),ae=fe.range(-1,0),de=Math.min(1,ae+fe.range(.8,1.5)),ie=(ve,we,ze)=>{const Fe=Se(n+v+ve*(a+.45),h+we*(y+.45));return[Fe[0],te+ze+B*(1-ve)/2*(1+.45/a),Fe[1]]};((ve,we,ze,Fe,Ge,Qe,Ke)=>{const Be=ie(ve,ze,Ge),ot=ie(we,ze,Ge),wt=ie(we,Fe,Ge),nt=ie(ve,Fe,Ge);(ot[2]-Be[2])*(nt[0]-Be[0])-(ot[0]-Be[0])*(nt[2]-Be[2])>=0?k.quad(Be,ot,wt,nt,Qe,2,Ke):k.quad(Be,nt,wt,ot,Qe,2,Ke)})(O,_,ae,de,.11,Te,p+.55)}if(w)if(fe.chance(.5)){const Y=Se(n+v+a+.75,h+(fe.chance(.5)?1:-1)*y*.75),O=X(Y[0],Y[1]);k.tank(Y[0],Y[1],.42,O-.3,O+.95,fe.pick(_e),_e[0],fe())}else{const Y=n+v+a+1.5,O=Se(Y,h-y-.3),_=Se(Y,h+y+.3),ae=Math.max(X(O[0],O[1]),X(_[0],_[1]))+2.2,de=3+Math.floor(fe()*2.5);for(const ie of[O,_])Z(ie[0],X(ie[0],ie[1])-.1,ie[1],r,c,.4,ae-X(ie[0],ie[1])+.3,4,.5);for(let ie=0;ie<de;ie++){const Me=(ie+.5)/de;mt(O[0]+(_[0]-O[0])*Me,ae-.25*(1-(2*Me-1)*(2*Me-1)),O[1]+(_[1]-O[1])*Me,i,f,fe.range(.7,1.1),fe.range(.7,1.3),he[0],he[1],0,fe,1)}}},u=(l,n,h)=>{const[w,g]=Se(l,n),y=X(w,g);Z(w,y-.1,g,i,f,1.3,3.5,4,.33+h*.2),E.push([w,y+3.5,g,1,.7,.36,.85,3,h,1.8])};for(const l of[-1,1]){for(let n=0;30+n*t.step<=t.a1-8;n++){const h=30+n*t.step;o((l>0?"r":"l")+n,h,l*t.houseB,n%2===1);const[w,g]=Se(h+t.step/2,l*t.treeB);Nt.push([w,g,.62+.2*j(w*.3,g*.7)])}for(let n=0;22+n*t.step<=t.a1;n++){const h=22+n*t.step;u(h,l*(t.laneB+1.7+2.6*(Math.abs(h/19%1-.5)*4-1)),n*.31+l)}{const[n,h]=Se(t.headA+6.5,l*(t.treeB-1));Nt.push([n,h,.7])}}for(let l=-2;l<=2;l++){l!==0&&o("h"+l,t.headRowA-1,l*26+(l>0?-6:6),Math.abs(l)===1);for(const n of[-13,13]){if(Math.abs(l*26+n)<8)continue;const[h,w]=Se(t.headA+4.2,l*26+n);Nt.some(g=>Math.hypot(g[0]-h,g[1]-w)<5)||Nt.push([h,w,.55+.2*j(h*.3,w*.7)])}}for(let l=-60;l<=60;l+=12)u(t.headA-1.6,l,l*.07+.2);{const[l,n]=Se(t.headA+2.6,0),h=X(l,n),w=new S.Color("#a3301c"),g=new S.Color("#c9a227");k.box(l-1.3,l+1.3,n-1.1,n+1.1,h-.8,h+2.3,w,w,.31,5,5),k.box(l-1.9,l+1.9,n-1.7,n+1.7,h+2.3,h+2.75,g,e,.33,5,2),E.push([l+r*1.6,h+1.6,n+c*1.6,1,.3,.12,1.5,3,.4,2.4],[l+r*1.5+i*1.2,h+.7,n+c*1.5+f*1.2,1,.66,.3,.5,3,.1,1.3],[l+r*1.5-i*1.2,h+.7,n+c*1.5-f*1.2,1,.66,.3,.5,3,.7,1.3])}const m=new S.Color(.035,.036,.04);for(let l=0;l<8;l++){const[n,h]=Se(K.a+b+5,(-35+l*10)*K.half/42),w=X(n,h);k.box(n-.55,n+.55,h-.4,h+.4,w+1.45,w+2.05,m,m,.5,5,5)}}await G();const ht=new Xt(Math.round(520*Math.max(.6,se))*3,{position:3,aHome:3,aB:4,aD:4}),ra=[[[-.07,.26],[-1,-.04],[-.9,-.2],[-.07,-.16]],[[.07,.26],[1,-.04],[.9,-.2],[.07,-.16]],[[0,.44],[-.1,.1],[0,-.38],[.1,.1]]];{const t=z.life;Ot.sort((i,f)=>i[5]-f[5]);const r=Math.min(Ot.length,18),c=[];for(let i=0;i<r;i++)c.push(Ot[Math.floor((i+t())/r*Ot.length)]);c.push([-194,44,-1247,.2,.98,0],[Ze[0],Ze[1]+4,Ze[2],.6,.8,0]);for(const i of c){const f=t.int(16,30),b=t.range(8,20);for(let e=0;e<f&&ht.nq+3<=ht.max;e++){const s=t(),o=t(),u=t.chance(.45)?1:0,m=t.range(.7,1),l=b*t.range(.6,1.3),n=t.range(3,15);for(const h of ra){for(let w=0;w<4;w++)ht.put("position",w,h[w][0],0,h[w][1]);ht.all("aHome",i[0],i[1]+.6,i[2]),ht.all("aB",s,l,n,o),ht.all("aD",i[3],i[4],u,m),ht.next()}}}}await G();const ca=(t,r)=>{const c=[],i=[],f=[],b=[],e=[],s=(y,a,x,d,v,p,M)=>{const A=c.length/3;for(const P of[y,a,x,d])c.push(P[0],P[1],P[2]),i.push(v[0],v[1],v[2]),f.push(p[0],p[1],p[2]),b.push(M);e.push(A,A+1,A+2,A,A+2,A+3)},o=(y,a,x,d,v,p,M)=>{s([-x,y,v],[x,y,v],[x,a,v],[-x,a,v],[0,0,1],p,M),s([x,y,d],[-x,y,d],[-x,a,d],[x,a,d],[0,0,-1],p,M),s([x,y,v],[x,y,d],[x,a,d],[x,a,v],[1,0,0],p,M),s([-x,y,d],[-x,y,v],[-x,a,v],[-x,a,d],[-1,0,0],p,M)},u=(y,a,x,d,v,p)=>s([-a,y,d],[a,y,d],[a,y,x],[-a,y,x],[0,1,0],v,p),m=[1,1,1],l=[.03,.032,.035],n=[.06,.08,.09],h=[.45,.45,.45],w=(y,a)=>{for(const x of[-1,1])s([x*.36-.1,y,.504],[x*.36+.1,y,.504],[x*.36+.1,a,.504],[x*.36-.1,a,.504],[0,0,1],h,2),s([x*.36+.1,y,-.504],[x*.36-.1,y,-.504],[x*.36-.1,a,-.504],[x*.36+.1,a,-.504],[0,0,-1],h,3)};t?(o(0,.07,.46,-.47,.47,l,0),o(.07,.25,.5,-.5,.5,m,1),o(.25,.43,.49,-.495,.495,n,5),o(.43,.57,.5,-.5,.5,m,4),o(.57,.83,.49,-.495,.495,n,5),o(.83,1,.5,-.5,.5,m,1),u(1,.5,-.5,.5,m,4),w(.1,.18)):(o(0,.16,.46,-.46,.46,l,0),o(.16,.6,.5,-.5,.5,m,1),u(.6,.5,-.5,.5,m,1),o(.6,.96,.43,-.3,.2,n,5),u(.96,.43,-.3,.2,m,4),w(.36,.52));const g=new S.InstancedBufferGeometry;return g.setAttribute("position",new S.Float32BufferAttribute(c,3)),g.setAttribute("normal",new S.Float32BufferAttribute(i,3)),g.setAttribute("color",new S.Float32BufferAttribute(f,3)),g.setAttribute("aM",new S.Float32BufferAttribute(b,1)),g.setIndex(e),g.setAttribute("aO",new S.InstancedBufferAttribute(new Float32Array(r.O),4)),g.setAttribute("aV",new S.InstancedBufferAttribute(new Float32Array(r.V),4)),g.setAttribute("aSz",new S.InstancedBufferAttribute(new Float32Array(r.S),3)),g.setAttribute("aCa",new S.InstancedBufferAttribute(new Float32Array(r.A),3)),g.setAttribute("aCb",new S.InstancedBufferAttribute(new Float32Array(r.B),3)),g.instanceCount=r.n,{geo:g,triangles:e.length/3*r.n}},et=[{O:[],V:[],S:[],A:[],B:[],n:0},{O:[],V:[],S:[],A:[],B:[],n:0}];{const t=z.life.fork("traffic"),r=Math.min(1.25,ue)*Math.max(.6,se),c=(d,v=1)=>{const p=new S.Color(d);return[p.r*v,p.g*v,p.b*v]},i=c("#a8160f"),f=c("#b9bdc0"),b=c("#d8cda4"),e=c("#1f5a34"),s=c("#1c4a2c"),o=c("#b3261e"),u=c("#27508a"),m=["#c9ccce","#e6e4dc","#2a2d33","#1d2f55","#7d1a1a","#8a8f92","#3f5a48","#b59a52"],l=(d,v,p,M,A,P,B,F,D,q,V,R,H,T)=>{d.O.push(v,p,M,A),d.V.push(P,B,F,D),d.S.push(q,V,R),d.A.push(H[0],H[1],H[2]),d.B.push(T[0],T[1],T[2]),d.n++},n=(d,v,p,M,A,P,B,F)=>{const D=Math.floor(A/8.5);for(let q=0;q<D;q++){const V=t(),R=t(),H=t.range(.75,1.1),T=t.range(0,1.6),$=t.pick(m);if(V>B*r)continue;const W=q*8.5+T;if(F&&R<.13&&q<D-1)l(et[1],d,v,p,M,W+3,P,A,1,2.5,4.4,10.4,R<.07?o:u,b),q++;else if(R<.5)l(et[0],d,v,p,M,W,P,A,0,1.75,1.45,4.5,i,f);else if(R<.62)l(et[0],d,v,p,M,W,P,A,.5,2,2.35,5.6,b,e);else{const te=c($,H);l(et[0],d,v,p,M,W,P,A,0,1.8,1.5,4.4,te,[te[0]*.85,te[1]*.85,te[2]*.85])}}},h=-1090,w=-372,g=w-h,y=420,a=y*2,x=-348;n(2.1,h,0,1,g,12,.55,!1),n(5.6,h,0,1,g,9.6,.5,!0),n(-2.1,w,0,-1,g,12,.55,!1),n(-5.6,w,0,-1,g,9.6,.5,!0);for(const[d,v,p,M]of[[5,14,.4,!1],[8.4,11.2,.5,!0],[11.8,11,.5,!0]])n(-y,x+d,1,0,a,v,p,M),n(y,x-d,-1,0,a,v,p,M);for(let d=-1;d<=1;d+=2)for(let v=0;v<13;v++){const p=t(),M=t.range(0,20);p<.5&&l(et[1],-y*d,x+1.6*d,d,0,v*64+M,8,a,1,2.1,4.5,9.4,s,b)}n(58,-320,0,1,274,7,.36,!1),n(61.5,-46,0,-1,274,7,.36,!1),n(-129,-320,0,1,218,6,.36,!1),n(-132.5,-102,0,-1,218,6,.36,!1),n(-150,-316.3,1,0,570,10,.3,!1),n(420,-319.7,-1,0,570,10,.3,!1);{const d=N("cb-service"),v=c("#c9a227"),p=c("#d8d6cc"),M=et[0],A=(P,B,F,D,q,V,R)=>{const H=[];for(let T=0;T<M.n;T++)M.O[T*4]===P&&M.O[T*4+1]===B&&M.O[T*4+2]===F&&M.O[T*4+3]===D&&H.push(M.V[T*4]);for(let T=0;T<R;T++){const $=(T+.1+.8*d())/R*q,W=d()<.5,te=d();H.some(pe=>Math.abs(pe-$)<7||Math.abs(Math.abs(pe-$)-q)<7)||(H.push($),l(M,P,B,F,D,$,V,q,2+.9*te,W?2:1.7,W?2.2:1.5,W?5.4:3.6,W?p:v,v))}};A(58,-320,0,1,274,7,7),A(61.5,-46,0,-1,274,7,7),A(-129,-320,0,1,218,6,6),A(-132.5,-102,0,-1,218,6,6),A(-150,-316.3,1,0,570,10,12),A(420,-319.7,-1,0,570,10,12)}}const ia=Pt(new S.MeshStandardMaterial({vertexColors:!0,roughness:.4}),"vehicle",{vdecl:"attribute vec4 aO; attribute vec4 aV; attribute vec3 aSz; attribute vec3 aCa; attribute vec3 aCb; attribute float aM; uniform float uTime, uHead, uDark; varying vec3 vP; varying vec3 vN0; varying vec3 vVE; varying vec2 vWn;",vmain:`
{
  float cbS = mod(aV.x + uTime*aV.y, aV.z);
  float cbK = smoothstep(0., 9., cbS)*(1. - smoothstep(aV.z - 9., aV.z, cbS));
  vec3 q = position*aSz*cbK;
  vec2 dr = aO.zw, sd = vec2(dr.y, -dr.x);
  float al = cbS + q.z;
  transformed = vec3(aO.x + dr.x*al + sd.x*q.x, q.y + 0.03, aO.y + dr.y*al + sd.y*q.x);
  vec3 nr = vec3(dr.x*normal.z + sd.x*normal.x, normal.y, dr.y*normal.z + sd.y*normal.x);
  vNormal = normalize(normalMatrix*nr);
  vColor.rgb = (aM > 0.5 && aM < 1.5 ? aCa : aM > 3.5 && aM < 4.5 ? aCb : color)*0.8;
  vVE = aM > 1.5 && aM < 2.5 ? vec3(1.0, 0.9, 0.68)*(0.4 + 2.4*uHead) : aM > 2.5 && aM < 3.5 ? vec3(1.0, 0.05, 0.02)*(0.4 + 1.6*uHead) : aM > 4.5 ? vec3(1.0, 0.7, 0.38)*(0.6*uDark*min(aV.w, 1.)) : vec3(0.);
  if (aV.w > 1.5 && aM > 3.5 && aM < 4.5) { float cbB = 0.5 + 0.5*sin(uTime*5.2 + aV.w*40.); vVE = vec3(1.0, 0.5, 0.04)*(0.5 + 2.6*cbB*cbB*cbB); }          // a service vehicle's beacon: its roof bar pulses amber, once in a little over a second
  vWn = vec2(abs(normal.z) > 0.5 ? position.x*aSz.x : position.z*aSz.z, aM > 4.5 ? 1. : 0.);
  vP = transformed; vN0 = nr;
}
`,fdecl:"varying vec3 vVE; varying vec2 vWn;",fcol:"vec3 cbAlb = diffuseColor.rgb; float cbPil = mix(1., smoothstep(0.07, 0.13, abs(fract(vWn.x/1.3) - 0.5)), vWn.y); float cbRough = mix(0.38, 0.12, vWn.y*cbPil); cbAlb = mix(vec3(0.16), cbAlb, cbPil); vec3 cbEmi = vVE*cbPil + cbAlb*uSky*0.5 + cbAlb*uPoolCol*cbPool(vP.xz)*0.6; diffuseColor.rgb = cbAlb*cbShade(vP.xz);"}),ha=(()=>{const t=new S.InstancedBufferGeometry,r=[],c=[],i=[],f=(b,e)=>new S.InstancedBufferAttribute(new Float32Array(et[0][b].concat(et[1][b])),e);for(let b=0;b<3;b++){const e=b*4;r.push(b,0,0,b,0,0,b,0,0,b,0,0),c.push(-1,0,1,0,1,1,-1,1),i.push(e,e+1,e+2,e,e+2,e+3)}return t.setAttribute("position",new S.Float32BufferAttribute(r,3)),t.setAttribute("aQ",new S.Float32BufferAttribute(c,2)),t.setIndex(i),t.setAttribute("aO",f("O",4)),t.setAttribute("aV",f("V",4)),t.setAttribute("aSz",f("S",3)),t.instanceCount=et[0].n+et[1].n,t})(),L0=et.map((t,r)=>ca(r===1,t));await G();const Kt=`
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float cbFog = 1.0 - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
      float cbFog = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #else
    float cbFog = 0.0;
  #endif`,fa="uniform vec4 uPool[3]; float cbPool1(vec2 p, vec4 k){ vec2 d = (p - k.xy)/max(k.z, 1.); float q = dot(d, d); return k.w*exp(-q*q*1.3); } float cbPool(vec2 p){ return cbPool1(p, uPool[0]) + cbPool1(p, uPool[1]) + cbPool1(p, uPool[2]); }",Et=t=>{const r=new S.ShaderMaterial({...t,fog:!0,uniforms:S.UniformsUtils.merge([S.UniformsLib.fog])});return Object.assign(r.uniforms,qe),r},pa=Et({transparent:!0,depthWrite:!1,blending:S.AdditiveBlending,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8,vertexShader:`
      attribute vec4 aO; attribute vec4 aV; attribute vec3 aSz; attribute vec2 aQ; uniform float uTime;
      varying vec2 vQ; varying vec3 vK;
      #include <fog_pars_vertex>
      void main(){
        float cbS = mod(aV.x + uTime*aV.y, aV.z);
        float kind = position.x, hl = aSz.z*0.5;
        float k01 = min(kind, 1.), cbB = 0.5 + 0.5*sin(uTime*5.2 + aV.w*40.);
        vec2 q = vec2(aQ.x*mix(2.6, 1.5, k01), mix(mix(hl - 0.5, hl + 13., aQ.y), mix(0.3 - hl, -hl - 3.4, aQ.y), k01));
        if (kind > 1.5) q = vec2(aQ.x, aQ.y*2. - 1.)*6.5*step(1.5, aV.w);
        vec2 dr = aO.zw, sd = vec2(dr.y, -dr.x);
        float al = cbS + q.y;
        vQ = aQ; vK = vec3(kind, smoothstep(0., 9., cbS)*(1. - smoothstep(aV.z - 9., aV.z, cbS)), 0.3 + 0.7*cbB*cbB*cbB);
        vec4 mvPosition = modelViewMatrix*vec4(aO.x + dr.x*al + sd.x*q.x, 0.1, aO.y + dr.y*al + sd.y*q.x, 1.);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uHead; varying vec2 vQ; varying vec3 vK;
      #include <fog_pars_fragment>
      void main(){
        float x = vQ.x, t = vQ.y, w = 0.26 + 0.6*t;
        float head = exp(-x*x/(w*w))*smoothstep(0., 0.07, t)*(1. - t)*(1. - t);
        float tail = exp(-x*x*3.)*smoothstep(0., 0.12, t)*(1. - t)*(1. - t);
        vec3 c = vK.x < 0.5 ? vec3(1.0, 0.86, 0.6)*head*0.42 : vec3(1.0, 0.06, 0.03)*tail*0.3;
        c *= 1. - smoothstep(0.7, 1., abs(x));
        if (vK.x > 1.5) { float r2 = x*x + (2.*t - 1.)*(2.*t - 1.); c = vec3(1.0, 0.5, 0.06)*exp(-r2*3.2)*(1. - smoothstep(0.7, 1., r2))*0.8*vK.z; }
        ${Kt}
        gl_FragColor = vec4(c*uHead*vK.y*(1. - 0.85*cbFog), 1.);
      }`}),da=Et({side:S.DoubleSide,vertexShader:`
      attribute vec3 aHome; attribute vec4 aB; attribute vec4 aD; uniform float uTime; uniform vec4 uWake;
      varying float vSeed; varying float vWing; varying float vHead; varying vec3 vP;
      #include <fog_pars_vertex>
      void main(){
        vec2 dw = uWake.xz - aHome.xz; float cs = dot(dw, aD.xy); vec2 l2 = dw - aD.xy*cs;
        float reach = exp(-dot(l2, l2)/(180.*180.))*uWake.w;
        float tt = (cs + 240. + 70.*aB.w)/75.;
        float up = smoothstep(0., 0.5 + aB.w, tt)*(1. - smoothstep(9., 15., tt))*reach;
        float perched = aD.z*(1. - smoothstep(0., 0.15, up));
        float dirn = aB.w > 0.5 ? 1. : -1.;
        float ang = aB.x*6.2832 + (uTime*(0.3 + 0.35*aB.w) + clamp(tt, 0., 12.)*1.2*reach)*dirn;
        float rad = aB.y*(1. + 1.7*up)*(1. - 0.78*perched);
        float fl = 1. - perched;
        vec3 c = aHome + vec3(cos(ang)*rad, aB.z*fl + up*(8. + 12.*aB.w) + sin(ang*2.3 + aB.x*40.)*1.8*fl, sin(ang)*rad);
        vec2 hd = vec2(-sin(ang), cos(ang))*dirn; vec2 sd = vec2(hd.y, -hd.x);
        float flap = sin(uTime*(9. + 7.*up + 4.*aB.w) + aB.x*50.)*fl;
        vec3 lp = position*aD.w*0.85;
        vec3 wp = c + vec3(sd.x*lp.x + hd.x*lp.z, abs(lp.x)*(flap*0.75 + 0.12), sd.y*lp.x + hd.y*lp.z);
        vSeed = aB.x; vWing = abs(position.x); vHead = position.z; vP = wp;
        vec4 mvPosition = modelViewMatrix*vec4(wp, 1.);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSky, uPoolCol; varying float vSeed; varying float vWing; varying float vHead; varying vec3 vP;
      ${fa}
      #include <fog_pars_fragment>
      void main(){
        vec3 base = mix(vec3(0.13, 0.14, 0.16), vec3(0.62), step(0.6, fract(vSeed*7.3)))*(1. - 0.35*vWing);
        base *= 1. - 0.5*smoothstep(0.18, 0.4, vHead)*(1. - smoothstep(0.08, 0.2, vWing));          // the head end of the body is darker
        gl_FragColor = vec4(base*(uSky*1.6 + 0.2) + base*uPoolCol*cbPool(vP.xz)*0.8, 1.);
        #include <fog_fragment>
      }`}),ft=new Xt(E.length,{position:3,aCorner:2,aCol:3,aS:4});for(const t of E)ft.all("position",t[0],t[1],t[2]),ft.all("aCol",t[3],t[4],t[5]),ft.all("aS",t[6],t[7],t[8],t[9]),ft.put("aCorner",0,-1,-1),ft.put("aCorner",1,1,-1),ft.put("aCorner",2,1,1),ft.put("aCorner",3,-1,1),ft.next();const l0=Et({transparent:!0,depthWrite:!1,blending:S.AdditiveBlending,vertexShader:`
      attribute vec2 aCorner; attribute vec3 aCol; attribute vec4 aS; uniform float uTime, uStrobe, uLamp, uDark; uniform vec2 uRes;
      varying vec2 vC; varying vec3 vCol;
      #include <fog_pars_vertex>
      void main(){
        vec4 mvPosition = modelViewMatrix*vec4(position, 1.);
        float size = aS.x*2.4;
        float px = size*projectionMatrix[1][1]*uRes.y*0.5/max(-mvPosition.z, 0.1);
        float capK = min(1., 0.028*uRes.y/max(px, 1e-3)); size *= capK; px *= capK;          // a lamp close to the eye stays a lamp: never a disc wider than a fifteenth of the frame
        float k = max(1., aS.w*2.4/max(px, 1e-3));
        float I = max(1./(k*k), 0.04);
        float b = 0.9 + 0.1*sin(uTime*7. + aS.z*40.);
        if (aS.y > 0.5 && aS.y < 1.5) { float f = fract(uTime*0.8 - aS.z); b = (smoothstep(0., 0.05, f)*(1. - smoothstep(0.05, 0.3, f))*1.7 + 0.05)*uStrobe; }
        else if (aS.y > 2.5) { b *= 0.15 + 0.85*uDark; }
        else if (aS.y > 1.5) { b = 0.55 + 0.45*sin(uTime*2.1 + aS.z*6.2832); }
        else { b *= uLamp; }
        vCol = aCol*b*I*(0.3 + 0.7*capK); vC = aCorner;
        mvPosition.xy += aCorner*size*k;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vC; varying vec3 vCol;
      #include <fog_pars_fragment>
      void main(){
        float r2 = dot(vC, vC);
        float I = exp(-r2*8.)*0.4 + exp(-r2*45.)*4.;
        I *= 1. - smoothstep(0.7, 1., r2);
        ${Kt}
        gl_FragColor = vec4(vCol*I*(1. - 0.85*cbFog), 1.);
      }`}),ba=(()=>{const c=[],i=[],f=[];for(let e=0;e<3;e++){const s=c.length/3;for(let o=0;o<=6;o++)for(let u=0;u<=28;u++){const m=u/28*yt;c.push(Math.cos(m),o/6,Math.sin(m)),i.push(e)}for(let o=0;o<6;o++)for(let u=0;u<28;u++){const m=s+o*29+u;f.push(m,m+28+1,m+1,m+1,m+28+1,m+28+2)}}const b=new S.BufferGeometry;return b.setAttribute("position",new S.Float32BufferAttribute(c,3)),b.setAttribute("aBeam",new S.Float32BufferAttribute(i,1)),b.setIndex(f),b})(),ma=Et({transparent:!0,depthWrite:!1,blending:S.AdditiveBlending,side:S.DoubleSide,vertexShader:`
      attribute float aBeam; uniform vec4 uPool[3]; uniform vec3 uSunDir;
      varying vec3 vNv; varying vec3 vVv; varying float vT; varying float vI; varying vec2 vA; varying float vBm;
      #include <fog_pars_vertex>
      void main(){
        vec4 k = aBeam < 0.5 ? uPool[0] : aBeam < 1.5 ? uPool[1] : uPool[2];
        float y0 = aBeam < 0.5 ? 30. : 0.;
        float t = position.y; vec3 rd = vec3(position.x, 0., position.z);
        vec3 lp = vec3(k.x, y0, k.y) + uSunDir*(t*700.) + rd*k.z*(0.55 + 0.8*t);
        vec4 mvPosition = modelViewMatrix*vec4(lp, 1.);
        // the cone's own normal (it flares from 0.55 to 1.35 of the pool over 700 m): at the true silhouette the beam fades to nothing
        vec3 dT = uSunDir*700. + rd*(k.z*0.8); vec3 dA = vec3(-position.z, 0., position.x);
        vNv = normalMatrix*normalize(cross(dA, dT)); vVv = -mvPosition.xyz; vT = t; vI = k.w; vA = position.xz; vBm = step(0.5, aBeam);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uPoolCol; uniform float uTime, uBeam; varying vec3 vNv; varying vec3 vVv; varying float vT; varying float vI; varying vec2 vA; varying float vBm;
      #include <fog_pars_fragment>
      void main(){
        float f = abs(dot(vNv/max(length(vNv), 1e-5), vVv/max(length(vVv), 1e-5)));
        float st = 0.72 + 0.28*sin(vA.x*7. + vA.y*11. + sin(vA.y*5. + uTime*0.06)*2.);
        float I = smoothstep(0.0, 0.55, f)*f*pow(max(1. - vT, 0.), 1.3)*smoothstep(0., 0.14, vT)*vI*st;
        I *= mix(1., smoothstep(150., 500., length(vVv)), vBm);          // the two drifting beams thin out near the eye: we never look through a wall of light from close by
        ${Kt}
        gl_FragColor = vec4(uPoolCol*I*0.15*uBeam*(1. - 0.6*cbFog), 1.);
      }`});await G();const ua=(()=>{const t=[],r=[],c=[],i=qe.uBoard.value.z,f=Math.cos(Math.atan(K.slope));for(const e of Ht)for(const[s,o]of[[52,13],[30,20]]){const u=K.a+i-s*f,m=t.length/3;t.push(e[0],e[1],e[2]);for(const l of[-1,1]){const[n,h]=Se(u,e[3]+l*o);t.push(n,K.h-(u-K.a)*K.slope+.6,h)}r.push(0,0,1,-1,1,1),c.push(m,m+1,m+2)}const b=new S.BufferGeometry;return b.setAttribute("position",new S.Float32BufferAttribute(t,3)),b.setAttribute("aQ",new S.Float32BufferAttribute(r,2)),b.setIndex(c),b})(),va=Et({transparent:!0,depthWrite:!1,blending:S.AdditiveBlending,side:S.DoubleSide,vertexShader:`
      attribute vec2 aQ; varying vec2 vQ;
      #include <fog_pars_vertex>
      void main(){
        vQ = aQ;
        vec4 mvPosition = modelViewMatrix*vec4(position, 1.);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime, uFlood; varying vec2 vQ;
      #include <fog_pars_fragment>
      void main(){
        float t = clamp(vQ.x, 0., 1.), x = vQ.y/max(vQ.x, 1e-3);
        float I = pow(1. - t, 1.3)*smoothstep(0.0, 0.05, t)*(1. - smoothstep(0.2, 1., abs(x)));
        I *= 0.72 + 0.28*sin(t*46. + x*7. + uTime*5.) * sin(x*23. + t*9. - uTime*1.7);
        ${Kt}
        gl_FragColor = vec4(vec3(1.0, 0.74, 0.44)*I*0.85*uFlood*(1. - 0.6*cbFog), 1.);
      }`}),xa=(()=>{const t=[],r=[],c=[];for(let b=0;b<2;b++)for(let e=0;e<2;e++){const s=t.length/3;for(let o=0;o<=6;o++)if(t.push(b,e,0,b,e,0),r.push(o/6,-1,o/6,1),o<6){const u=s+o*2;c.push(u,u+1,u+2,u+1,u+3,u+2)}}const f=new S.BufferGeometry;return f.setAttribute("position",new S.Float32BufferAttribute(t,3)),f.setAttribute("aQ",new S.Float32BufferAttribute(r,2)),f.setIndex(c),f})(),ga=(Q.core?.makeRng?Q.core.makeRng(Q.core.hashSeed("cb-beam:"+(Q.seed??0)))():.37)*6.2832,wa=Et({transparent:!0,depthWrite:!1,blending:S.AdditiveBlending,side:S.DoubleSide,vertexShader:`
      attribute vec2 aQ; uniform float uTime; varying vec2 vQ; varying float vK;
      #include <fog_pars_vertex>
      void main(){
        float ang = uTime*0.52 + ${ga.toFixed(3)} + position.x*3.14159265;
        vec3 dir = vec3(sin(ang)*0.9985, -0.055, cos(ang)*0.9985);
        vec3 side = position.y < 0.5 ? vec3(dir.z, 0., -dir.x) : vec3(0., 1., 0.);
        vec3 lp = vec3(${oe[0].toFixed(1)}, ${$0.toFixed(1)}, ${oe[1].toFixed(1)}) + dir*(5. + aQ.x*600.) + side*(aQ.y*(4.5 + aQ.x*34.));
        vec4 wp = modelMatrix*vec4(lp, 1.);
        vec3 te = cameraPosition - wp.xyz; te /= max(length(te), 1e-3);
        float al = abs(dot(te, dir)); al *= al;
        // each beam is two crossed sheets of lit air; a sheet seen on its edge is a hair line, not light, so each shows by as much as it faces the eye
        float fc = smoothstep(0.05, 0.4, abs(dot(te, position.y < 0.5 ? vec3(0., 1., 0.) : vec3(dir.z, 0., -dir.x)/0.9985)));
        vK = 0.45*mix(fc, 1., al) + 1.5*al*al; vQ = aQ;
        vec4 mvPosition = viewMatrix*wp;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime, uDark; varying vec2 vQ; varying float vK;
      #include <fog_pars_fragment>
      void main(){
        float t = clamp(vQ.x, 0., 1.), x = vQ.y;
        // a beam is lit air, and lit air is brightest at its lamp: a short soft flare at the lantern that fades along the beam's own length (a third of its
        // strength 11 m out, a tenth at 23 m, nothing to see beyond 50 m) with a broad core, never a line: wherever any of it shows it hangs on the lantern that throws it
        float I = min(3.0*exp(-t*60.)*(exp(-x*x*3.2) + 0.8*exp(-x*x*12.)), 3.4)*smoothstep(0., 0.006, t)*(1. - t);
        I *= 0.86 + 0.14*sin(t*70. - uTime*4. + x*3.);
        ${Kt}
        gl_FragColor = vec4(vec3(1.0, 0.8, 0.5)*I*vK*(0.1 + 0.9*uDark)*0.5*(1. - 0.6*cbFog), 1.);
      }`}),zt=new S.Group;zt.name="checkerboard-approach";const ya=new S.Sphere(new S.Vector3(0,0,0),5e3),He=(t,r,c=0)=>{t.boundingSphere=ya;const i=new S.Mesh(t,r);return i.frustumCulled=!1,i.renderOrder=c,i.matrixAutoUpdate=!1,zt.add(i),i};He(na,Eo),He(la,To),He(lo,Do),await G();const V0=new S.BufferGeometry;for(const[t,r,c]of[["position",k.p,3],["normal",k.n,3],["color",k.c,3],["aF",k.f,4],["aG",k.g,2]])V0.setAttribute(t,new S.BufferAttribute(r.subarray(0,k.nv*c),c)),await G();V0.setIndex(new S.BufferAttribute(k.i.subarray(0,k.ni),1));const ls=He(V0,e0);await G(),He(De.build(),Ro),await G(),He(ye.build(),_o),await G(),He(ht.build(),da),He(ba,ma,3),He(ua,va,3),He(xa,wa,3),He(ft.build(),l0,4);for(const t of L0)He(t.geo,ia);He(ha,pa,2),await G();const E0=t=>{const r=new Xt(t.length,{position:3,aCorner:2,aCol:3,aS:4});for(const c of t)r.all("position",c[0],c[1],c[2]),r.all("aCol",c[3],c[4],c[5]),r.all("aS",c[6],c[7],c[8],c[9]),r.put("aCorner",0,-1,-1),r.put("aCorner",1,1,-1),r.put("aCorner",2,1,1),r.put("aCorner",3,-1,1),r.next();return r.build()},ut=ro.build(),Ye=sa,io=n0.concat([[4.2*Ye,3.9*Ye,-20.5*Ye,1,.96,.86,3.4,0,.2,3.2],[-4.2*Ye,3.9*Ye,-20.5*Ye,1,.96,.86,3.4,0,.6,3.2],[0,2*Ye,-6.5*Ye,1,.96,.86,2.2,0,.4,2.6],[29.5*Ye,6.4*Ye,-45*Ye,1,1,1,1.5,1,.1,2.2],[-29.5*Ye,6.4*Ye,-45*Ye,1,1,1,1.5,1,.1,2.2]]),ho=He(ut,e0),fo=He(E0(n0),l0,4);await G();const po=He(ut,e0),bo=He(E0(io),l0,4),mo=He(ut,e0),uo=He(E0(n0.concat(io.slice(-2))),l0,4),st=new S.Matrix4,Tt=new S.Vector3,vt=new S.Vector3,xt=new S.Vector3,r0=new S.Vector3,c0=new S.Vector3(1.25,1.25,1.25),vo=t=>{const r=Math.min(1,Math.max(0,(t+900)/900));st.makeTranslation(110,0,-262+92*r),ho.matrix.copy(st),fo.matrix.copy(st),ho.matrixWorldNeedsUpdate=!0,fo.matrixWorldNeedsUpdate=!0};ut.computeBoundingBox();const xo=U0.half*(1-2*U0.off)+(ut.boundingBox.max.z-ut.boundingBox.min.z)*c0.z,go=kt+We*-Xe+1100,ka=(kt+We*-Xe+xo)/go,Ma=-1100+xo,Sa=1.35,T0=t=>-30-20*je(-200,-500,t)+30*je(-760,-1030,t),D0=t=>9+47*je(399,-366,t)+Math.max(0,-366-t)*.116,wo=t=>{const r=Ma-Sa*go*(t-ka);r0.set(T0(r),D0(r),r),xt.set(T0(r-4)-T0(r+4),D0(r-4)-D0(r+4)+.5,-8).normalize(),vt.set(.05,1,0),Tt.crossVectors(vt,xt).normalize(),vt.crossVectors(xt,Tt),st.makeBasis(Tt,vt,xt).scale(c0),st.setPosition(r0),po.matrix.copy(st),bo.matrix.copy(st),po.matrixWorldNeedsUpdate=!0,bo.matrixWorldNeedsUpdate=!0},yo=1200,i0=3300/2,Aa=(Oe[1]-Je[1])/-Je[1],ko=(ut.boundingBox.max.z-ut.boundingBox.min.z)*c0.z,Mo=t=>{const r=Math.min(1,Math.max(0,(t-Je[1])/-Je[1])),c=r/Aa,i=yo+(i0-yo)*(c<1?c*c:2*c-1),f=Math.max(0,i-i0),b=je(i0-2*ko,i0+2*ko,i);r0.set(-42e-5*f*f,.125*f*je(0,260,f),i),xt.set(-84e-5*f,.02+.2*b,1).normalize(),vt.set(-.25*je(200,700,f),1,0),Tt.crossVectors(vt,xt).normalize(),vt.crossVectors(xt,Tt),st.makeBasis(Tt,vt,xt).scale(c0),st.setPosition(r0),mo.matrix.copy(st),uo.matrix.copy(st),mo.matrixWorldNeedsUpdate=!0,uo.matrixWorldNeedsUpdate=!0};vo(-2e3),wo(0),Mo(-2e3);const So=Se(K.a,0),R0=new S.Vector3(-he[0]*K.slope,1,-he[1]*K.slope).normalize(),_0=(t,r)=>[Oe[0]+We*Math.cos(Xe*(1-t)),r,Oe[1]+We*Math.sin(Xe*(1-t))],H0=t=>Bt-(Bt-d0)*t,pt=[[ct[0],$t,ct[1]],[Je[0]-Re[0]*220,$t-($t-Bt)*zo(1-220/kt),Je[1]-Re[1]*220],[Je[0],Bt,Je[1]],_0(.25,H0(.25)),_0(.5,H0(.5)),_0(.75,H0(.75)),[0,d0,-1100],[0,bt+b0*700,-700],[0,bt+b0*350,-350],[0,bt+b0*110,-110],[0,bt,0]],dt=[So[0],K.h,So[1]],qa={portalSeat:{position:[0,bt,0],facing:[0,0,-1],radius:La},flyThrough:pt,flyLine:(t=64)=>Lo(t),viewpoints:{scudBreak:{position:pt[0],look:dt},hillAhead:{position:pt[2],look:dt},turnApex:{position:pt[5],look:[-194,40,-1247]},rollOut:{position:pt[6],look:[0,10,-200]},avenueGate:{position:pt[7],look:[0,bt,0]},shortFinal:{position:pt[9],look:[0,bt,400]}},bank:U0,hill:{summit:Ze,board:dt,boardNormal:[R0.x,R0.y,R0.z],centre:[Mt[0],0,Mt[1]],radius:220,heightAt:X,heading:[he[0],he[1]],boardHalf:K.half,lowQuarter:Qt,boardAlong:[K.a,Math.cos(Math.atan(K.slope))*K.half],laneDist:(t,r)=>{const[c,i]=u0(t,r);return c>-146&&c<46?Math.abs(i-t0(c)):1e9},huts:Gt,village:{trees:Nt},creepers:M0},stacks:no,turn:{centre:[Oe[0],Oe[1]],radius:We,from:pt[2],to:pt[6],degrees:47},runway:{start:[0,0,-70],threshold:[0,0,0],end:[0,0,3300],width:61,taxiwayX:110},fenceZ:-328,strobes:J0,sunDir:[$e.x,$e.y,$e.z],waterY:Po,harbour:[{min:[-1800,-40],max:[-120,3e3]},{min:[240,500],max:[385,1480]},{min:[240,1560],max:[1500,3e3]},{min:[-1800,3400],max:[1500,5e3]}],walledCity:{min:[-300,-1312],max:[-88,-1182],height:48},playground:[Ne[0],0,Ne[1]],beaconTower:{position:[oe[0],0,oe[1]],height:222+Zt,lamp:[oe[0],$0,oe[1]]},parks:F0,parkY:.45,market:{min:[-72,-400],max:[72,-366]},fieldFill:[qe.uSky.value.r*.4+qe.uFill.value.r,qe.uSky.value.g*.4+qe.uFill.value.g,qe.uSky.value.b*.4+qe.uFill.value.b],extent:{min:[-1700,-8,-2910],max:[1300,125,3340],carpet:"within about 600 m of flyThrough, z < -366"},wind:[Lt[0],0,Lt[1]],speed:75};let h0=null,f0=null;le&&(h0=le.get("heroView"),le.get("heroU")!=null&&(f0=+le.get("heroU")));const Pa={hill:{c:[dt[0],50,dt[2]],r:150,h:130},roofs:{c:[-70,48,-1330],r:62,h:70},turn:{c:[-120,45,-1290],r:140,h:190},final:{c:[0,30,-600],r:150,h:300},runway:{c:[40,6,40],r:110,h:110}},za=[[dt[0]-300,dt[2]-280,2.52],[-70,-1330,0],[-194,-1247,0],[0,-600,-.26],[0,60,0]],It=h0==="tour"?{c:[0,50,0],r:90,h:80}:Pa[h0]||{c:[-60,40,-1150],r:620,h:300},gt=new S.Vector3,Ao=new S.Vector2,G0=z.look.range(0,6),O0=z.look.range(0,6),N0=J.dark?0:J.drift||1,qo=J.drift?1.25:1,Fa=J.dark?112:160,K0=qe.uSky.value.clone(),Ba=(t={})=>{t.lit!=null&&(qe.uLit.value=t.lit),t.neon!=null&&(qe.uNeon.value=t.neon),t.wet!=null&&(qe.uWet.value=t.wet),t.shaft!=null&&qe.uPoolCol.value.copy(Jt).multiplyScalar(t.shaft),t.strobe!=null&&(qe.uStrobe.value=t.strobe),t.portal!=null&&qe.uPortal.value.copy(t.portal),t.heading&&qe.uLand.value.set(t.heading[0],t.heading[1],t.bank||0,1),t.u!=null&&wo(t.u),t.flash!=null&&qe.uSky.value.setRGB(K0.r+.1*t.flash,K0.g+.13*t.flash,K0.b+.22*t.flash)},Ca=t=>{const r=Math.min(1,Math.max(0,t))*(At.length-1),c=Math.min(At.length-2,Math.floor(r)),i=r-c,f=At[c],b=At[c+1];qe.uWake.value.set(f[0]+(b[0]-f[0])*i,f[1]+(b[1]-f[1])*i,f[2]+(b[2]-f[2])*i,1)};return{object:zt,radius:It.r,height:It.h,center:new S.Vector3(It.c[0],It.c[1],It.c[2]),anchors:qa,ground:!0,groundY:Po,setProgress(t){f0=t??null},setLook:Ba,update(t,r,c){if(qe.uTime.value=r,h0==="tour"&&c){gt.setFromMatrixPosition(c.matrixWorld);const f=Math.atan2(gt.x,gt.z),b=f<-.6?f+yt:f,e=za[b<.45?0:b<1.5?1:b<2.45?2:b<3.3?3:4],s=Math.cos(e[2]),o=Math.sin(e[2]);zt.rotation.y=e[2],zt.position.set(-(e[0]*s+e[1]*o),0,-(-e[0]*o+e[1]*s)),zt.updateMatrixWorld(!0)}const i=qe.uPool.value;i[0].set(dt[0]-he[0]*6,dt[2]-he[1]*6,Fa,.92+.08*Math.sin(r*.23)*N0),i[1].set(-90+120*Math.sin(r*.11+G0),-860+170*Math.cos(r*.083+G0),190*qo,(.5+.12*Math.sin(r*.17+G0))*N0),i[2].set(390+110*Math.sin(r*.09+O0),60+200*Math.sin(r*.064+O0*2),235*qo,(.45+.1*Math.sin(r*.13+O0))*N0),f0!=null?Ca(f0):c&&(gt.setFromMatrixPosition(c.matrixWorld),zt.worldToLocal(gt),qe.uWake.value.set(gt.x,gt.y,gt.z,1)),vo(qe.uWake.value.z),Mo(qe.uWake.value.z),Q.renderer&&(Q.renderer.getDrawingBufferSize(Ao),qe.uRes.value.copy(Ao))},dispose(){},stats:{solids:k.ni/3,cards:De.nq*2,cloth:ye.nq*2,birds:ht.nq*2,lamps:E.length*2,hill:lo.index.count/3,slabsNearPath:k0.length,parks:F0.length,quads:k.nv/4,quadsMax:k.max/4,cardsMax:De.max,clothMax:ye.max,huts:Gt.length,vehicles:et[0].n+et[1].n,vehicleTriangles:L0[0].triangles+L0[1].triangles}}}export{rs as buildHero};
