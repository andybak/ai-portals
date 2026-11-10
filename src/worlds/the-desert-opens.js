import*as f from"three";import{makePath as Xn}from"../kit/core.js";import*as Pe from"../kit/fauna.js";import*as es from"../kit/fx.js";import{buildHero as Yn}from"../parts/the-desert-opens.js";const Jn=["#9C4A2E","#F28A1C","#F4EFE2","#C2247E","#D9A441","#4A3328","#7E9463"],Is=40,Ft=Math.PI/180,Tt=(z,U,G)=>Math.min(G,Math.max(U,z)),N=(z,U,G)=>{const K=Tt((G-z)/(U-z),0,1);return K*K*(3-2*K)},wt=(z,U,G)=>z+(U-z)*G,he=(z,U)=>{if(z<=U[0][0])return U[0][1];for(let G=1;G<U.length;G++)if(z<=U[G][0]){const K=U[G-1],Z=U[G];return wt(K[1],Z[1],(z-K[0])/Math.max(1e-6,Z[0]-K[0]))}return U[U.length-1][1]},Xt=z=>z-Math.floor(z),Ae=(z,U)=>{let G=Xt(z*.1031),K=Xt(U*.103),Z=Xt(z*.0973);const H=G*(K+33.33)+K*(Z+33.33)+Z*(G+33.33);return G+=H,K+=H,Z+=H,Xt((G+K)*Z)},$n=(z,U)=>{let G=Xt(z*.1031),K=Xt(U*.103),Z=Xt(z*.0973);const H=G*(K+33.33)+K*(Z+33.33)+Z*(G+33.33);return G+=H,K+=H,Z+=H,[Xt((G+K)*Z),Xt((G+Z)*K)]},He=(z,U)=>{const G=Math.floor(z),K=Math.floor(U);let Z=z-G,H=U-K;return Z=Z*Z*(3-2*Z),H=H*H*(3-2*H),wt(wt(Ae(G,K),Ae(G+1,K),Z),wt(Ae(G,K+1),Ae(G+1,K+1),Z),H)},wo=new f.Vector3(Math.sin(10*Ft),0,Math.cos(10*Ft)),os=new f.Vector3(Math.cos(10*Ft),0,-Math.sin(10*Ft)),t0=new f.Vector3().copy(wo).multiplyScalar(Math.cos(30*Ft)).add(new f.Vector3(0,-Math.sin(30*Ft),0)),e0=new f.Vector3().copy(wo).multiplyScalar(Math.sin(30*Ft)).add(new f.Vector3(0,Math.cos(30*Ft),0)),Ws=18*Ft;function o0(z,U){const G=z*Ft,K=Math.cos(Ws),Z=Math.sin(Ws);return U.set(0,0,0).addScaledVector(e0,K*Math.cos(G)).addScaledVector(os,K*Math.sin(G)).addScaledVector(t0,Z).normalize()}const s0=[[0,.125,64,83],[.153,.315,-84,84],[.365,.468,-84,84],[.482,.575,-84,84],[.59,.708,-84,84],[.728,1.0001,-42,-24]],n0=`
varying vec3 vDir;
void main(){ vDir = position; vec4 mv = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mv; gl_Position.z = gl_Position.w * .99999; }`,a0=`
varying vec3 vDir;
uniform vec3 uFogC, uSunE, uLidCol, uPole, uE1, uE2, uVeilCol, uMtn;
uniform vec4 uLid, uVeil;
uniform float uStarRot, uTrail, uLidLead, uMtA;
uniform vec3 uMwN;
void main(){
  vec3 d = normalize(vDir + vec3(0., 1e-6, 0.));
  float el = d.y, elc = max(el, 0.);
  vec3 col = mix(uHor, uZen, pow(elc + 1e-4, .42));
  float sd = max(dot(d, uSunD), 0.); float s2 = sd * sd, s4 = s2 * s2, s8 = s4 * s4, s32 = s8 * s8 * s8 * s8, s128 = s32 * s32 * s32 * s32;
  vec2 dxz = d.xz / max(length(d.xz), 1e-4), sxz = uSunD.xz / max(length(uSunD.xz), 1e-4);
  float azf = .5 + .5 * dot(dxz, sxz);
  col += uGlow * (s2 * .1 + s8 * .22 + s128 * .7);
  col += uGlow * exp(-abs(el) * 8.) * azf * azf * .62;
  // the anti-twilight arch: opposite a sun on the horizon a rose band stands over the blue shadow of the earth (every dawn of the
  // flight is seen this way round: the sun comes up behind the lens)
  float anti = .5 - .5 * dot(dxz, sxz); anti *= anti;
  float bb = (el - .11) / .08; col += uBelt.rgb * uBelt.a * anti * exp(-bb * bb);
  col *= mix(vec3(1.), vec3(.6, .7, .96), uBelt.a * anti * (1. - smoothstep(.0, .075, elc)) * .55);
  float az = atan(d.z, d.x + 1e-6);
  // stars wheel about the south celestial pole; short trails along their circles; the Milky Way turns with them
  if (uNight > .01) {
    vec3 ds = vec3(dot(d, uE1), dot(d, uPole), dot(d, uE2));
    float lat = asin(clamp(ds.y, -1., 1.)); float lon = atan(ds.z, ds.x + 1e-6) + uStarRot;
    float K = 64.; float row = floor(lat * K); float nl = max(1., floor(6.2832 * K * cos((row + .5) / K)));
    float lx = fract(lon / 6.2832) * nl; float ci = floor(lx);
    vec2 hh = h22(vec2(ci, row) + 13.); float pr = step(.76, h21(vec2(ci, row) + 3.3));
    vec2 dd = vec2(lx - ci, lat * K - row) - (.22 + .56 * hh); dd.x = max(abs(dd.x) - uTrail, 0.);
    float mag = h21(vec2(ci, row) + 9.1); mag *= mag; mag = .12 + 3.4 * mag * mag * mag;
    vec3 sc = mix(vec3(.75, .85, 1.), vec3(1., .86, .7), step(.7, hh.x));
    // the Milky Way: a band of light along one great circle of the turning sky, clotted with star clouds, split by a dark lane
    // and thick with faint stars
    vec3 dr = vec3(cos(lon) * cos(lat), sin(lat), sin(lon) * cos(lat));
    float mb = dot(dr, uMwN); vec2 mq = vec2(lon * 2.6, lat * 4.);
    float mc = fbm(mq + 3.), mw = exp(-mb * mb * 16.) * (.25 + 1.5 * mc * mc) + exp(-mb * mb * 90.) * .5;
    mw *= 1. - .75 * exp(-(mb - .03) * (mb - .03) * 420.) * smoothstep(.3, .6, fbm(mq * 2.3 + 11.));
    // (the faint stars: each a point at its own place in its cell and of its own brightness, most of them dim, so no lattice shows)
    vec2 fq = vec2(lx, lat * K) * 3.3; vec2 fi = floor(fq); vec2 fj = h22(fi + 5.); float fm = h21(fi + 21.7);
    float fs = step(.9 - .34 * min(mw, 1.), fm) * (1. - smoothstep(.03, .17, length(fract(fq) - .2 - .6 * fj))) * (.16 + 1.5 * fj.x * fj.x * fj.y);
    col += (sc * exp(-dot(dd, dd) * 95.) * mag * pr * 1.7 + vec3(.4, .47, .74) * mw * .4 + vec3(.7, .78, 1.) * fs * (.3 + .8 * min(mw, 1.)) * .75) * uNight * smoothstep(.0, .1, el);
  }
  // cumulus streets streaming in on the north-west wind
  vec2 cp = d.xz / (elc + .06);
  vec2 cc = vec2(dot(cp, uWind.xy) * .42, dot(cp, vec2(-uWind.y, uWind.x)) * 1.7) + uCloudP.xy;
  float n = fbm(cc) + (vn(cc * 3.3 + 7.) - .5) * .14 + (vn(cc * .23 + 2.) - .5) * .3;
  vec2 so = vec2(dot(sxz, uWind.xy) * .42, dot(sxz, vec2(-uWind.y, uWind.x)) * 1.7) * .22;
  float n2 = fbm(cc + so);
  float cov = smoothstep(uCloudP.z, uCloudP.z + .16, n) * smoothstep(.01, .1, el) * (1. - smoothstep(7., 14., length(cp))) * uCloudP.w * (1. - .9 * uNight);
  float clit = clamp((n - n2) * 3.5 + .55, 0., 1.) * (1. - smoothstep(uCloudP.z + .1, uCloudP.z + .42, n) * .6);
  vec3 ccol = mix(uCloudSh, uCloudCol, clit) + uGlow * (s8 * .35 + azf * azf * exp(-el * 5.) * .3);
  col = mix(col, ccol, cov);
  // rain veils dragging away ahead, lit by the low sun
  if (uVeil.z > .003) {
    float c = vn(vec2(az * 6.5 + 2., 1.7 + uTime * .02));
    float curtain = smoothstep(.36, .66, c) * smoothstep(.1, .7, dot(dxz, uVeil.xy));
    float fine = vn(vec2(az * 95. + el * 30., el * 7. + uTime * 1.3 + c * 3.));
    float veil = curtain * (1. - smoothstep(.03, .26 + .14 * c, el)) * (.55 + .45 * fine);
    col = mix(col, uVeilCol * (.75 + .5 * fine), veil * uVeil.z);
  }
  // the fog lid (or cloud bank): a low ceiling whose ragged near edge is the same line that opens the flowers. It has form: soft
  // rolls lying across the wind, dark in their bellies and paler between; for a hundred metres in from its edge it is thin, torn
  // into rags and lit through by the sun; and it is a bank, not the whole sky: far out it ends, and under its far edge a band
  // of the open sky of the coming day stands along the horizon (uBand), lighting the bellies of the last rolls from below
  float lid = 0., bandK = 0.;
  if (uLid.x > .003) {
    float t = max(uLid.y - uCam.y, 6.) / max(el, .014);
    vec2 hit = uCam.xz + d.xz * t;
    float distf = 1. - exp(-t * uLid.w);
    // > 0 where the lid has already peeled away; its edge runs uLidLead metres ahead of the line on the ground, so the
    // edge hangs high ahead while the line lies across the flowers before the lens
    float dl = uFront + uLidLead - dot(hit, uTideDir) + tideRag(hit) * 1.3 + (vn(hit * .09 + 3.) - .5) * 9.;
    float tex = fbm(hit * .016 + uCloudP.xy * .2) * .6 + fbm(hit * .0045 + 7.) * .4;
    float roll = fbm(vec2(dot(hit, uWind.xy) * .0125, dot(hit, vec2(-uWind.y, uWind.x)) * .0031) + uCloudP.xy * .15);
    float form = smoothstep(.3, .7, roll * .78 + tex * .22);
    // (the rags: toward the edge the lid is open wherever it is thin)
    float dlr = dl + exp(min(dl, 0.) / 75.) * max(tex * .7 + roll * .3 - .4, 0.) * 210.;
    // (the far edge of the bank, a few degrees over the horizon, uneven)
    float farE = smoothstep(.03, .1, el + (vn(vec2(az * 6. + 3., 1.3)) - .5) * .05 + (vn(vec2(az * 23., 7.1)) - .5) * .016);
    bandK = uLid.x * (1. - smoothstep(.0, .13, elc)) * (1. - smoothstep(-5., 5., dl)) * step(0., el);
    col = mix(col, uBand.rgb * (1.02 - .5 * elc), bandK);
    lid = (1. - smoothstep(-5., 5., dlr)) * farE * uLid.x * step(0., el);
    // (the sun burns through the last of it)
    float thin = exp(min(dlr, 0.) / 60.);
    vec3 lc = uLidCol * (.2 + .52 * form + .36 * tex * (1. - distf * .6))
      + uBand.rgb * (1. - smoothstep(.03, .15, el)) * (.03 + .13 * form)
      + uSunCol * vec3(1., .8, .62) * thin * thin * uLid.z * (.02 + .1 * tex) * (1. - distf * .5)
      + uSunCol * vec3(1., .7, .45) * exp(min(dlr, 0.) / 26.) * uLid.z * .05;
    col = mix(col, mix(lc, uFogC, distf * .22), lid);
    // the lit edge: a cream rim, bright enough to bloom, soft into the lid and crisp against the blue (the rags' own rims are fainter)
    float rim = exp(-max(-dl, 0.) / 13. - max(dl, 0.) / 3.5) * (.5 + 1. * tex) * .55 + exp(-max(-dlr, 0.) / 7. - max(dlr, 0.) / 3.) * (.3 + .6 * tex) * .2;
    col += uSunCol * rim * (1. - distf * .8) * uLid.z * uLid.x * farE * step(0., el);
  }
  // the sun
  col += uSunE * smoothstep(.99982, .99993, dot(d, uSunD)) * (1. - cov * .92) * (1. - lid) * (1. - .7 * bandK) * step(0., el);
  // the Kamiesberg, 15 km off: a flat blue band two degrees high along the horizon, a paler band behind it; its top is level (it
  // wavers by a tenth of a degree, no summits) and soft with 15 km of air; haze pales its foot, the low sun warms the flank
  // turned to it. (The noise is taken on the unit circle: no seam.)
  float r1 = .037 + .003 * vn(dxz * 4.3 + 4.);
  float r2 = .031 + .003 * vn(dxz * 9. + 5.) + .0015 * vn(dxz * 29. + 1.);
  vec3 mcol = uMtn + uGlow * azf * azf * .1;
  col = mix(col, mix(uFogC, mcol, .4), (1. - smoothstep(r1 - .005, r1 + .005, el)) * uMtA);
  col = mix(col, mix(uFogC, mcol * (.8 + .3 * vn(dxz * 40. + el * 90.)), .5 + .38 * smoothstep(0., r2 + 1e-4, el)), (1. - smoothstep(r2 - .005, r2 + .005, el)) * uMtA);
  col = mix(col, uFogC, 1. - smoothstep(-.012, .002, el));
  col = mix(col, uFogC * vec3(.5, .3, .26), 1. - smoothstep(-.1, -.03, el));
  gl_FragColor = vec4(col, 1.);
}`;function i0(){const z=[],U=[],G=[],K=[],Z=(ft,ot,nt,ue)=>{const to=z.length/3,Se=ft.length;for(let E=0;E<Se;E++){const St=ft[Math.max(0,E-1)],Dt=ft[Math.min(Se-1,E+1)],_t=ft[E];let Oe=Dt[0]-St[0],yt=Dt[1]-St[1];const oe=Math.hypot(Oe,yt)||1;Oe/=oe,yt/=oe;for(let vt=0;vt<ot;vt++){const fe=vt/ot*6.2832,dt=Math.cos(fe),Yt=Math.sin(fe);z.push((_t[4]||0)+Yt*_t[2],_t[0]+dt*_t[3]*yt,_t[1]-dt*_t[3]*Oe),U.push(nt,E/(Se-1),.5-.5*dt,0),G.push(ue[0],ue[1],ue[2],ue[3])}}for(let E=0;E<Se-1;E++)for(let St=0;St<ot;St++){const Dt=to+E*ot+St,_t=to+E*ot+(St+1)%ot;K.push(Dt,Dt+ot,_t,_t,Dt+ot,_t+ot)}},H=[0,1.1,.47,0],ut=[0,1.5,.79,0];Z([[1.02,-.8,.02,.03],[1.02,-.74,.15,.18],[1,-.6,.215,.25],[.98,-.38,.235,.275],[.955,-.1,.225,.27],[.95,.2,.235,.29],[.985,.42,.215,.285],[1.03,.57,.15,.22],[1.07,.67,.05,.08]],12,0,[0,0,0,0]),Z([[1,.42,.16,.2],[1.17,.55,.125,.165],[1.33,.67,.1,.13],[1.5,.79,.085,.11]],10,1,H),Z([[1.6,.7,.02,.03],[1.575,.76,.08,.09],[1.54,.84,.085,.1],[1.47,.95,.07,.085],[1.4,1.06,.05,.06],[1.365,1.13,.045,.05],[1.35,1.16,.015,.02]],8,2,ut);for(const ft of[-1,1]){Z([[1.6,.775,.025,.025,ft*.05],[1.83,.6,.02,.02,ft*.085],[2.06,.425,.013,.013,ft*.125],[2.2,.32,.003,.003,ft*.15]],5,3,ut);const ot=z.length/3;for(const nt of[[ft*.07,1.585,.735,0],[ft*.12,1.575,.7,.4],[ft*.13,1.66,.74,.4],[ft*.215,1.675,.69,1]])z.push(nt[0],nt[1],nt[2]),U.push(4,nt[3],.5,0),G.push(ut[0],ut[1],ut[2],0);K.push(ot,ot+1,ot+2,ot+1,ot+3,ot+2)}for(const ft of[-1,1]){const ot=ft*.125,nt=ft*.13;Z([[.98,.42,.07,.1,ot],[.74,.41,.062,.075,ot],[.53,.4,.04,.045,ot],[.3,.395,.028,.032,ot],[.09,.4,.034,.038,ot],[0,.42,.04,.05,ot]],6,5,[ot,.95,.41,ft<0?.25:.75]),Z([[1,-.52,.1,.17,nt],[.76,-.5,.075,.12,nt],[.54,-.6,.042,.052,nt],[.3,-.585,.028,.034,nt],[.09,-.57,.034,.038,nt],[0,-.55,.04,.05,nt]],6,5,[nt,.97,-.52,ft<0?0:.5])}return Z([[1.08,-.78,.022,.022],[.9,-.85,.018,.018],[.68,-.86,.02,.02],[.52,-.86,.045,.045],[.36,-.855,.012,.012]],5,6,[0,1.08,-.78,0]),{pos:z,aP:U,piv:G,idx:K}}const r0=`
attribute vec4 aP, aPiv, iPos, iPose; attribute vec2 iRnd;
varying vec3 vP, vN, vL; varying vec3 vK;
vec3 rx(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(v.x, v.y * c - v.z * s, v.y * s + v.z * c); }
vec3 ry(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(v.x * c + v.z * s, v.y, -v.x * s + v.z * c); }
void main(){
  vec3 q = position, n = normal; float part = aP.x, h = iRnd.x;
  if (part > 4.5 && part < 5.5) {
    // a leg: the cannon folds at the knee as the leg comes forward, the whole leg swings about the hip
    float ph = (iPose.y + aPiv.w) * 6.2832, sw = sin(ph) * .4 * iPose.z, fold = max(cos(ph), 0.) * .55 * iPose.z * (1. - smoothstep(.45, .58, position.y));
    vec3 kp = vec3(aPiv.x, .53, aPiv.z - .02);
    q = rx(q - kp, fold) + kp; n = rx(n, fold);
    q = rx(q - aPiv.xyz, -sw) + aPiv.xyz; n = rx(n, -sw);
  } else if (part > .5 && part < 4.5) {
    // neck and head: the neck swings down from its root to graze, the head turns back up a little on the poll; a head held up
    // turns a little to one side
    float g = iPose.x, w = part < 1.5 ? smoothstep(0., .5, aP.y) : 1.;
    if (part > 1.5) { q = rx(q - aPiv.xyz, -g * .8) + aPiv.xyz; n = rx(n, -g * .8); }
    vec3 np = vec3(0., 1.1, .47); float yw = iRnd.y * (1. - g) * w;
    q = rx(q - np, g * 1.72 * w) + np; n = rx(n, g * 1.72 * w);
    q = ry(q - np, yw) + np; n = ry(n, yw);
  } else if (part > 5.5) {
    float tl = 1. - aP.y, sw = sin(uTime * 5.3 + h * 40.) * .4 * aP.y * aP.y;
    q.x += sw * (aPiv.y - position.y); q.y += abs(sw) * .1 * tl;
  }
  // breathing
  if (part < .5) q.x *= 1. + .012 * sin(uTime * 3.1 + h * 20.) * smoothstep(-.5, .1, position.z);
  float s = iPose.w;
  vec3 P = iPos.xyz + ry(q, iPos.w) * s;
  vP = P; vN = ry(n, iPos.w); vL = position; vK = vec3(aP.x, aP.y, aP.z);
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,l0=`
varying vec3 vP, vN, vL; varying vec3 vK;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.));
  if (vK.x > 3.5 && vK.x < 4.5 && dot(N, V) < 0.) N = -N;
  float part = vK.x, t = vK.y, v = vK.z;
  float hair = .9 + .2 * (vn(vL.zy * 31. + vL.x * 17.) * .6 + vn(vL.zy * 9. + 3.) * .4);
  vec3 fawn = vec3(.4, .345, .285) * hair, white = vec3(.68, .66, .6), black = vec3(.022, .019, .017);
  vec3 alb = fawn; float ao = 1.;
  if (part < .5) {
    alb = mix(fawn, fawn * 1.16, smoothstep(.25, .5, v) * (1. - smoothstep(.5, .58, v)));
    alb = mix(alb, white, smoothstep(.73, .79, v));
    alb = mix(alb, black, smoothstep(.57, .615, v) * (1. - smoothstep(.71, .755, v)) * smoothstep(.1, .22, t) * (1. - smoothstep(.8, .9, t)));
    alb = mix(alb, black, (1. - smoothstep(.02, .07, v)) * smoothstep(.05, .3, t) * (1. - smoothstep(.7, .9, t)) * .75);
    alb = mix(alb, black, (1. - smoothstep(.05, .13, t)) * (1. - smoothstep(.3, .5, v)));
    ao = mix(.5, 1., smoothstep(-.9, -.1, N.y));
  } else if (part < 1.5) {
    alb = mix(fawn, black, smoothstep(.8, .9, v) * smoothstep(.0, .25, t));
  } else if (part < 2.5) {
    alb = mix(white, fawn, (1. - smoothstep(.16, .3, t)) * (1. - smoothstep(.45, .7, v)));
    float nose = (1. - smoothstep(.2, .3, v)) * smoothstep(.34, .44, t) * (1. - smoothstep(.74, .84, t));
    float eye = (1. - smoothstep(.09, .15, abs(v - mix(.4, .86, smoothstep(.24, .62, t))))) * smoothstep(.1, .2, t) * (1. - smoothstep(.62, .72, t));
    alb = mix(alb, black, max(max(nose, eye), smoothstep(.9, .96, t) * .8));
  } else if (part < 3.5) {
    alb = vec3(.035, .032, .03) * (.75 + .5 * sin(t * 60.) * (1. - t));
  } else if (part < 4.5) {
    alb = mix(fawn, black, smoothstep(.7, .9, t));
  } else if (part < 5.5) {
    alb = mix(white, black, smoothstep(.16, .23, vL.y));
    alb = mix(alb, fawn, smoothstep(.74, .88, vL.y));
    alb = mix(alb, black, 1. - smoothstep(.035, .05, vL.y));
    ao = mix(.7, 1., smoothstep(.3, .9, abs(vL.x) * 6.));
  } else alb = black * 1.3;
  float lit = sunLine(vP.xz) * domeShadow(vP);
  vec3 col = shadeS(alb * ao, N, vP, .3, 1., 0.);
  float f1 = 1. - clamp(dot(N, V), 0., 1.), fr = f1 * f1 * f1;
  // the sun's rim on the back, the neck and the horns (strongest seen against the light), the sky's sheen on the coat, and the
  // warm light the sunlit flowers throw up under the belly
  col += uSunCol * (alb * .7 + .04) * fr * smoothstep(-.35, .35, dot(N, uSunDir)) * (.3 + .7 * smoothstep(-.3, .7, dot(-V, uSunDir))) * lit * .55;
  col += uSkyCol * (alb * .5 + .02) * fr * .2;
  col += alb * uSunCol * vec3(.4, .27, .12) * max(uSunDir.y, 0.) * (.5 - .5 * N.y) * .22 * sunLine(vP.xz);
  // (by starlight the pale coat is held under the stars, so the animal is a shape with a rim and never a white glow)
  col *= 1. - .38 * uNite;
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`;var f0={id:"the-desert-opens",name:"The Desert Opens",category:"wilderness",weirdness:.1,media:["open","air"],async build(z){const U=z.rng,G=z.vary||{},K=z.quality?.detail??1,Z=Tt(G.density??1,.7,1.3),H=new f.Scene,ut=t=>z.core.makeRng(z.core.hashSeed(t+":"+z.seed)),ft=U.fork("visit"),ot=G.hour||"any",nt=ot==="golden"?"golden":ot==="dawn"?"fog":ot==="day"?ft.pick(["fog","berg"]):ft.pick(["fog","fog","golden","berg"]),ue=ft.pick(["orange","orange","white","thin","flax"]),to=2,Se=!!G.rare,E=s0.map(t=>t.slice());nt==="golden"&&(E[5][2]=40,E[5][3]=52),nt==="berg"&&(E[5][2]=-34,E[5][3]=-12);const St=(()=>{const t=ut("the plain");return[t.range(0,6.28),t.range(0,6.28),t.range(0,6.28),t.range(0,6.28)]})(),Dt=[],_t=(t,e)=>N(150,420,Math.hypot(t,e))*(1.25*Math.sin(t*.0105+St[0])*Math.cos(e*.0087+St[1])+.8*Math.sin(t*.021+e*.016+St[2])+.45*Math.sin(e*.037-t*.012+St[3])),Oe=(t,e)=>{let s=_t(t,e);for(const o of Dt){const n=Math.hypot(t-o.x,e-o.z);n<o.r&&(s+=o.h*(1-N(0,o.r,n)))}return s+Qs(t,e)},yt=760,oe=180,vt=Math.PI/3,fe=t=>[-yt+yt*Math.cos(t),oe+yt*Math.sin(t)],dt=[];{const[t,e]=fe(vt),s=Math.sin(vt),o=-Math.cos(vt);for(const n of[110,74,37])dt.push([t-s*n,e-o*n])}for(let t=0;t<=80;t++)dt.push(fe(vt*(1-t/80)));const Yt=t=>{const e=110+yt*vt;if(t=Tt(t,0,e+170),t<110){const[n,c]=fe(vt);return[n-Math.sin(vt)*(110-t),c+Math.cos(vt)*(110-t),Math.sin(vt),-Math.cos(vt)]}if(t>e)return[0,oe-(t-e),0,-1];const s=vt*(1-(t-110)/(yt*vt)),o=fe(s);return[o[0],o[1],Math.sin(s),-Math.cos(s)]},qs=[[110,1,200,0],[345,-1,62,.86],[470,1,95,.88],[640,1,400,0],[730,-1,380,0],[900,1,430,0]],Ge=ut("the ring koppies");for(const[t,e,s,o]of qs){const n=Ge.range(-25,25),c=Ge.range(.88,1.15),g=Ge.range(100,120),m=Ge.range(8,13),y=Ge.range(.8,1.25),[d,i,h,v]=Yt(t+(o?n*.2:n)),x=s*(o?.98+(c-.88)*.3:c);Dt.push({x:d-v*e*x,z:i+h*e*x,r:o?g*.56:g,h:o?m*.45:m,big:o?o*(.97+(y-.8)*.15):y,near:!!o,far:s>300})}const Ht=[562,52,8],Wt=[650,700,70,60],gt={x:0,z:9e3,r:9,h:0},qt=[566,600,752,790],bo=13,xt=[Ht[0]+Ht[1],(qt[2]+qt[3])/2,-(bo+2.5/2),20],ss=.5,ns=(t,e)=>Math.hypot(Math.max(xt[0]-t,t-xt[1],0),e-xt[2]),Ke=(t,e)=>{const s=t+yt,o=e-oe;return[110+yt*(vt-Math.atan2(o,s+1e-4)),Math.hypot(s,o)-yt]},as=(t,e)=>{const s=Math.max(Wt[0]-t,0),o=Math.max(t-Wt[1],0);return e-(o*o/Wt[3]-s*s/Wt[2])},zo=[[792,30,1.5,0],[858,38,1.4,0],[970,24,1.3,1]],js=(t,e)=>{const s=Math.abs(e);let o=0;for(let n=0;n<3;n++){const c=zo[n],g=t+.28*e+5*Math.sin(e*.055+n*2.1),m=Tt(Math.abs(g-c[0])/Math.max(c[1],1),0,1),y=wt(1-.4*N(50,130,s),.22+.78*N(3,11,s)*(1-N(20,38,s)),c[3]);o+=c[2]*(.5+.5*Math.cos(Math.PI*m))*y}return o*(1-N(120,260,s))},Qs=(t,e)=>{const s=Ke(t,e),o=s[0],n=s[1];let c=js(o,n);const g=Math.hypot(t,e);if(g<305)return c;const m=Math.abs(o-Ht[0])/Ht[1];m<1&&(c+=Ht[2]*(1-N(0,1,m))*(1-N(10,48,-n))*(1-N(70,150,n))),c-=ss*(1-N(xt[3]*.3,xt[3],ns(o,n)))*N(310,345,g);const y=N(qt[0],qt[1],o)*(1-N(qt[2],qt[3],o))*N(310,345,g);y>0&&(c-=1.05*(1-N(3.2,8.5,Math.abs(as(o,n))))*y);const d=Math.hypot(t-gt.x,e-gt.z);return d<gt.r&&(c+=gt.h*(1-N(0,1,d/gt.r))),c};{const[t,e,s,o]=Yt(385);gt.x=t+o*8,gt.z=e-s*8,gt.h=1.8}const Us=(t,e)=>{const s=Math.hypot(t,e);if(s<305)return 0;const o=Ke(t,e);return 2.2*N(350,362,o[0])*(1-N(778,790,o[0]))*(1-N(30,40,Math.abs(o[1])))*N(310,330,s)},Y=await Yn(z,{palette:Jn,season:ue,density:Tt(Z*(ue==="thin"?.9:1.05),.5,1.5),apron:300,field:1e5,plain:Oe,progress:0,fill:1.5});H.add(Y.object);const F=Y.uniforms,de=Y.anchors,R=Y.heightAt,Ce=de.tideDir,Mo=Y.tiers,pe=[196,-9];F.uPlan.value.set(vt,110,0,0),F.uRise.value.set(Ht[0],Ht[1],Ht[2],0),F.uW2.value.set(Wt[0],Wt[1],Wt[2],Wt[3]),F.uMound.value.set(gt.x,gt.z,gt.r,gt.h),F.uPan.value.set(pe[0],pe[1],1,1),F.uArc.value.set(-yt,oe,yt,1),zo.forEach((t,e)=>F.uSw.value[e].set(t[0],t[1],t[2],t[3])),F.uBias.value=.75,F.uHol.value.set(xt[0],xt[1],xt[2],xt[3]),F.uHolK.value.set(ss,1),await z.yield();const Zs=[[185,2.8],[210,3],[228,3.1],[245,3],[262,2.7],[280,2.2],[300,1.7],[330,1.6],[385,1.6],[400,2],[436,2],[450,1.6],[640,1.6],[700,1.7],[735,1.7],[790,2.4],[900,2.7],[925,3.3],[950,4.8],[981,7.4],[1018,8.1],[1055,8.4],[1091,8.6]],Po=[];{let t=0;for(let e=0;e<dt.length;e++){e&&(t+=Math.hypot(dt[e][0]-dt[e-1][0],dt[e][1]-dt[e-1][1]));const s=110+yt*vt-t+185,o=he(s,Zs);let n=-1e9;for(const c of[-6,-3,0,3,6]){const g=Tt(e+Math.sign(c),0,dt.length-1),m=Math.min(1,Math.abs(c)/Math.max(1,Math.hypot(dt[g][0]-dt[e][0],dt[g][1]-dt[e][1]))),y=wt(dt[e][0],dt[g][0],m),d=wt(dt[e][1],dt[g][1],m);n=Math.max(n,R(y,d))}Po.push(new f.Vector3(dt[e][0],n+o,dt[e][1]))}for(const e of de.flyThrough)e.z<160&&Po.push(e.clone())}await z.yield();const B=Xn(Po);await z.yield();const I=B.length,Xs=t=>{const e=B.pointAt(t);return e.x*Ce.x+e.z*Ce.z},Ao=.757,Ys=Xs(Ao),Js=(()=>{const t=B.tangentAt(Ao);return 3*I*Math.max(.5,t.x*Ce.x+t.z*Ce.z)})(),$s=t=>Ys+Js*(t-Ao);await z.yield();const So=ut("the sky"),is=295*Ft+So.range(-.25,.25),se=new f.Vector2(Math.sin(is),-Math.cos(is)),jt=new f.DirectionalLight("#fff1d6",3);H.add(jt,jt.target);const ve=new f.HemisphereLight("#9fbde6","#3a2c26",1);H.add(ve);const Co=new f.FogExp2("#b9cbdc",5e-4);H.fog=Co;{const e=[],s=[],o=[],n=[],c=(x,l,a)=>{const u=e.length/3;for(let p=0;p<l;p++){const r=(p+a)/l*Math.PI*2,w=Math.sin(r)*x,M=Math.cos(r)*x,C=R(w,M)-Us(w,M);e.push(w,C,M);const V=R(w+1.5,M)-R(w-1.5,M),b=R(w,M+1.5)-R(w,M-1.5),P=1/Math.hypot(V,3,b);s.push(-V*P,3*P,-b*P),o.push(1)}return u};let g=c(Y.apron,132,0),m=Y.apron*(1+.6*Math.PI*2/264),y=c(m,264,0);for(let x=0;x<132;x++){const l=g+x,a=g+(x+1)%132,u=y+2*x,p=y+2*x+1,r=y+(2*x+2)%264;n.push(l,p,u,l,a,p,a,r,p)}const d=264;let i=0;for(;m<3300;){m*=1+Math.PI*2/d*(m<620?1:m<1500?2.4:5),i++;const x=c(m,d,i%2*.5);g=y,y=x;for(let l=0;l<d;l++){const a=g+l,u=g+(l+1)%d,p=y+l,r=y+(l+1)%d;i%2?n.push(a,p,u,u,p,r):n.push(a,r,u,a,p,r)}await z.yield()}const h=new f.BufferGeometry;h.setAttribute("position",new f.Float32BufferAttribute(e,3)),h.setAttribute("normal",new f.Float32BufferAttribute(s,3)),h.setAttribute("aOcc",new f.Float32BufferAttribute(o,1)),h.setIndex(n);const v=new f.Mesh(h,Y.groundMaterial);v.frustumCulled=!1,H.add(v)}await z.yield();{const t=[0,1.5,3,4.5,6,7.5,9,10.5,12,14,16,18.5,21.5,25,29,34,40],e=[];for(let h=t.length-1;h>0;h--)e.push(-t[h]);for(const h of t)e.push(h);const s=e.length,o=350,n=790,c=Math.round((n-o)/2),g=new Float32Array((c+1)*s*3),m=new Float32Array((c+1)*s*3),y=[];for(let h=0;h<=c;h++){const v=o+(n-o)*h/c,x=vt-(v-110)/yt,l=Math.cos(x),a=Math.sin(x);for(let u=0;u<s;u++){const p=-yt+(yt+e[u])*l,r=oe+(yt+e[u])*a,w=h===0||h===c||u===0||u===s-1,M=(h*s+u)*3;g[M]=p,g[M+1]=R(p,r)+(w?-.55:.04),g[M+2]=r;const C=R(p+.6,r)-R(p-.6,r),V=R(p,r+.6)-R(p,r-.6),b=1/Math.hypot(C,1.2,V);m[M]=-C*b,m[M+1]=1.2*b,m[M+2]=-V*b}(h&3)===3&&await z.yield()}for(let h=0;h<c;h++)for(let v=0;v<s-1;v++){const x=h*s+v,l=x+1,a=x+s,u=a+1;y.push(x,a,l,l,a,u)}await z.yield();const d=new f.BufferGeometry;d.setAttribute("position",new f.BufferAttribute(g,3)),d.setAttribute("normal",new f.BufferAttribute(m,3)),d.setAttribute("aOcc",new f.BufferAttribute(new Float32Array((c+1)*s).fill(1),1)),d.setIndex(y);const i=new f.Mesh(d,Y.groundMaterial);i.frustumCulled=!1,H.add(i)}await z.yield();const tn=new f.Vector3().copy(wo).negate(),eo=new f.Vector3().copy(tn).multiplyScalar(Math.cos(30*Ft)).add(new f.Vector3(0,Math.sin(30*Ft),0)).normalize(),rs=new f.Vector3().crossVectors(eo,os).normalize(),en=new f.Vector3().crossVectors(rs,eo).normalize(),W={...F,uFogC:{value:new f.Color},uSunE:{value:new f.Color},uLidCol:{value:new f.Color(.36,.39,.45)},uPole:{value:eo},uE1:{value:rs},uE2:{value:en},uVeilCol:{value:new f.Color},uMtn:{value:new f.Color},uLid:{value:new f.Vector4(0,46,1,.0011)},uVeil:{value:new f.Vector4(B.startTangent.x,B.startTangent.z,0,0)},uStarRot:{value:0},uTrail:{value:.1},uLidLead:{value:70},uMtA:{value:1},uMwN:{value:new f.Vector3(.36,.48,.8)}};W.uCloudP.value.set(So.range(0,40),So.range(0,40),.5,1),W.uWind.value.set(se.x,se.y,0,0),W.uBelt.value.set(.42,.2,.25,0),W.uSunD.value.set(0,1,0);{const t=new f.Vector2(W.uVeil.value.x,W.uVeil.value.y).normalize();W.uVeil.value.x=t.x,W.uVeil.value.y=t.y}const on=Y.makeMat(W,n0,a0,{fog:!1,depthWrite:!1,depthTest:!0,side:f.BackSide}),oo=new f.Mesh(new f.SphereGeometry(3800,48,24),on);oo.renderOrder=-1,oo.frustumCulled=!1,H.add(oo),await z.yield();const ls=W.uCloudP.value.clone();W.uMwN.value.set(.36,.48,.8).normalize();const Ne=`
uniform vec4 uPl; uniform vec4 uKop[6];
float groundH(vec2 p){
  float k = smoothstep(150., 420., length(p));
  float h = k * (1.25 * sin(p.x * .0105 + uPl.x) * cos(p.y * .0087 + uPl.y) + .8 * sin(p.x * .021 + p.y * .016 + uPl.z) + .45 * sin(p.y * .037 - p.x * .012 + uPl.w));
  for (int i = 0; i < 6; i++) h += uKop[i].w * (1. - smoothstep(0., uKop[i].z, length(p - uKop[i].xy)));
  h += featH(p);
  float wd = abs(p.y - (uWash.x + uWash.y * sin(p.x * uWash.z + uWash.w)));
  return h - .8 * (1. - smoothstep(4., 12., wd)) * smoothstep(78., 100., length(p * vec2(.8, 1.)));
}`,Fe={value:new f.Vector4(St[0],St[1],St[2],St[3])},De={value:Dt.map(t=>new f.Vector4(t.x,t.z,t.r,t.h))},cs=Ne+`
attribute vec3 iOff; attribute vec4 iRnd;
uniform vec4 uWin; uniform float uHead;
varying vec2 vUv; varying vec3 vP, vHn, vFace, vBack; varying float vOpen, vEye;
void main(){
  vec2 rel = fract(iOff.xy - uWin.xy * uWin.w) - .5;
  vec2 pxz = uWin.xy + rel * uWin.z;
  float edge = 1. - smoothstep(.36, .5, max(abs(rel.x), abs(rel.y)));
  edge *= smoothstep(93., 106., length(pxz * vec2(.8, 1.)));
  vec3 ip = vec3(pxz.x, groundH(pxz), pxz.y);
  vec4 sp = daisyMix(speciesAt(pxz));
  float pres = step(iRnd.x, sp.w * 1.05 * uFrac);
  float o = openAt(pxz, iRnd.y);
  float k = fract(iRnd.x * 7.31 + iRnd.y * 3.17);
  headColours(sp, k, iRnd.z, yellowAt(pxz), vFace, vBack);
  vEye = step(sp.z, k); vOpen = o;
  // among the orange daisies a few deep red gazanias and purple ragworts (pale-eyed)
  float kd = fract(iRnd.y * 17.3 + iRnd.z * 5.7) + step(k, sp.z + sp.y);
  if (kd < .07) { vFace = vec3(.8, .21, .03) * (.85 + .3 * iRnd.z); vBack = vec3(.42, .2, .1); }
  else if (kd < .075 + .2 * smoothstep(.56, .74, vn(pxz * .13 + 3.3))) { vFace = vec3(.42, .08, .4) * (.8 + .4 * iRnd.z); vBack = vec3(.3, .17, .33); vEye = 0.; }
  float a0 = iRnd.z * 6.283;
  // (under a low sun the heads lean less, so from the lens they are still discs and not slivers)
  vec3 Hn = normalize(mix(vec3(0., 1., 0.), uSunDir, .6 * o * mix(.3, 1., smoothstep(.2, .55, uSunDir.y))) + vec3(cos(a0), 0., sin(a0)) * (1. - o) * .35
    + vec3(sin(uTime * 8. + a0 * 5.), 0., cos(uTime * 6.7 + a0 * 3.)) * .08);
  float dist = length(uCam - ip);
  // (and the open heads turn their faces part of the way to the lens: seen from 1.6 m up they are discs, not edge-on slivers)
  Hn = normalize(Hn + (uCam - ip) / max(dist, 1e-3) * uBias * o);
  vec3 T = normalize(cross(vec3(.3, 0., 1.), Hn)); vec3 Bv = cross(Hn, T);
  float size = (.03 + .1 * iRnd.z * iRnd.z * iRnd.z + .012 * iRnd.x) * mix(1., .82, 1. - vEye) * (1. + .3 * step(k, sp.y)) * uHead * pres * mix(.72, 1., o) * smoothstep(.45, 1., uGrowth) * edge;
  size *= 1. + dist * .022;
  float hgt = (.15 + .17 * fract(iRnd.z * 5.3)) * uGrowth * mix(1., .5, 1. - vEye);
  vec3 P = ip + vec3(0., hgt, 0.) + (Hn - vec3(0., 1., 0.)) * hgt * .4 + (T * position.x + Bv * position.y) * size;
  vUv = position.xy; vP = P; vHn = Hn;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,Ve=[],sn=Number((/step\(iRnd\.x, sp\.w \* ([0-9.]+) \* uFrac\)/.exec(cs)||[0,1/0])[1]),nn=1e-4,hs=(t,e,s,o)=>{const n=Math.round(t*K*Tt(Z,.85,1)),c=new Float32Array(n*3),g=new Float32Array(n*4),m=U.fork("tread"+e);for(let l=0;l<n;l++)c[l*3]=m(),c[l*3+1]=m(),c[l*3+2]=m(),g[l*4]=m(),g[l*4+1]=m(),g[l*4+2]=m(),g[l*4+3]=0;{const l=Array.from({length:n},(p,r)=>r).sort((p,r)=>g[p*4]-g[r*4]||p-r),a=c.slice(),u=g.slice();l.forEach((p,r)=>{c.set(a.subarray(p*3,p*3+3),r*3),g.set(u.subarray(p*4,p*4+4),r*4)})}const y=Float32Array.from({length:n},(l,a)=>g[a*4]),d=new f.InstancedBufferGeometry;d.setAttribute("position",new f.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),d.setIndex([0,1,2,0,2,3]),d.setAttribute("iOff",new f.InstancedBufferAttribute(c,3)),d.setAttribute("iRnd",new f.InstancedBufferAttribute(g,4)),d.instanceCount=n;const i={value:new f.Vector4(0,0,e,1/e)},h={value:s},v=Y.makeMat({...F,uWin:i,uHead:h,uPl:Fe,uKop:De},cs,Y.midFrag,{side:f.DoubleSide}),x=new f.Mesh(d,v);x.frustumCulled=!1,H.add(x),Ve.push({uWin:i,uHead:h,head:s,lead:o,mesh:x}),Ve[Ve.length-1].draws=y},an=(t,e)=>{const s=sn*e+nn;let o=0,n=t.length;for(;o<n;){const c=o+n>>1;t[c]<=s?o=c+1:n=c}return o};hs(12e3,30,.95,11),await z.yield(),hs(8e3,96,1.25,40),await z.yield();const us=`
  vec2 rel = fract(iOff.xy - uWin.xy * uWin.w) - .5;
  vec2 pxz = uWin.xy + rel * uWin.z;
  float edge = 1. - smoothstep(.4, .5, max(abs(rel.x), abs(rel.y)));
  edge *= smoothstep(93., 106., length(pxz * vec2(.8, 1.)));
  vec3 ip = vec3(pxz.x, groundH(pxz), pxz.y);
  vec4 sp = daisyMix(speciesAt(pxz));
  float hsh = fract(iRnd.x * 13.71 + iRnd.w * 5.13);
  float clump = smoothstep(.3, .62, vn(pxz * 1.37 + 12.3) * .5 + vn(pxz * .47 + 5.9) * .5);
  float dens = sp.w * 1.25 * (.4 + .9 * clump) * mix(1., .8, sp.y) * mix(1.6, 1., smoothstep(.45, .8, uGrowth));
  float here = step(hsh, dens) * edge;
  float flower = step(hsh, dens * uFrac);
  float sc = (.8 + .5 * iRnd.z) * uLensK;
`,rn=Ne+`
attribute vec3 iOff; attribute vec4 iRnd, aH; attribute float aPart, aJ;
uniform vec4 uWin; uniform float uLensK;
varying vec3 vP, vN, vT, vFace, vBack, vEyeC; varying float vPart, vOpen, vKind, vHash; varying vec2 vQ;
void main(){`+us+`
  float o = openAt(pxz, iRnd.y);
  float k = fract(iRnd.x * 7.31 + iRnd.y * 3.17);
  headColours(vec4(sp.x, sp.y, 0., 1.), k, iRnd.z, yellowAt(pxz), vFace, vBack);
  float kind = step(k, sp.y);
  vEyeC = mix(vec3(.05, .024, .012), vec3(.06, .035, .15), kind);
  // (gazanias anywhere among the orange; ragwort only in loose colonies)
  float kd = fract(iRnd.y * 17.3 + iRnd.z * 5.7) + kind;
  if (kd < .07) { kind = 2.; vFace = vec3(.8, .21, .03) * (.85 + .3 * iRnd.z); vBack = vec3(.42, .2, .1); }
  else if (kd < .075 + .2 * smoothstep(.56, .74, vn(pxz * .13 + 3.3))) { kind = 3.; vFace = vec3(.42, .08, .4) * (.8 + .4 * iRnd.z); vBack = vec3(.3, .17, .33); vEyeC = vec3(.95, .7, .1); }
  // cat's tails stand in loose groups, never in the lane right under the lens
  vec2 hd = uWin.xy - uCam.xz; hd /= max(length(hd), 1e-3);
  vec2 rc = pxz - uCam.xz; float latd = abs(rc.x * hd.y - rc.y * hd.x);
  float spk = step(.985 - .1 * smoothstep(.5, .72, vn(pxz * .11 + 7.7)), fract(iRnd.w * 9.7 + iRnd.z * 3.3)) * smoothstep(1.6, 2.6, latd);
  float hgtK = smoothstep(.3, .95, uGrowth), headK = smoothstep(.5, .9, uGrowth) * flower * (1. - spk);
  float a0 = iRnd.x * 6.2832;
  vec3 up = vec3(0., 1., 0.);
  vec3 toC = uCam - ip; float dc = length(toC);
  vec3 Vh = vec3(toC.x, 0., toC.z); Vh /= max(length(Vh), 1e-3);
  vec3 Rv = vec3(Vh.z, 0., -Vh.x);
  vec3 P = ip; vec3 N = up; vec3 Tn = Rv; vQ = vec2(0.); float hj = 0.;
  if (aPart < 2.5) {
    // a head (0) or its stem (2)
    float j = aJ; hj = h21(vec2(j * 7.3 + 1.7, iRnd.w * 91. + 3.1)); float hj2 = h21(vec2(j * 3.1 + 5.9, iRnd.x * 77. + 1.3));
    float nH = 2. + floor(iRnd.y * 4.999);
    float show = step(j, nH - .5) * headK;
    float ang = aH.x + a0, rad = aH.y * (.5 + .7 * hj) * .2 * sc;
    float hgt = (.1 + .26 * aH.z * (.6 + .8 * hj2)) * sc * hgtK * mix(1., 1.55, step(2.5, kind));
    vec3 out2 = vec3(cos(ang), 0., sin(ang));
    vec3 wind = vec3(sin(uTime * 8. + a0 * 5. + j), 0., cos(uTime * 6.7 + a0 * 3. + j * 2.)) * .05;
    vec3 base = ip + out2 * rad * .3;
    vec3 hp = ip + out2 * rad + up * hgt + wind * hgt;
    if (aPart < .5) {
      vec3 Hn = normalize(mix(up, uSunDir, .6 * o * mix(.3, 1., smoothstep(.2, .55, uSunDir.y))) + out2 * .25 + wind);
      vec3 Vc = (uCam - hp) / max(length(uCam - hp), 1e-3);
      Hn = normalize(Hn + Vc * uBias * mix(.4, 1., o));
      float oo = smoothstep(.2, .5, o);
      Hn = normalize(mix(Vh + up * .15, Hn, oo));
      vec3 Bv = cross(Hn, Rv); Bv /= max(length(Bv), 1e-3);
      Tn = cross(Bv, Hn);
      float kindK = mix(mix(mix(1., .9, step(.5, kind)), 1.12, step(1.5, kind)), .62, step(2.5, kind));
      float Rh = .075 * sc * (.55 + .75 * aH.w * (.7 + .6 * hj)) * kindK * show * mix(.8, 1., oo);
      P = hp + (Tn * position.x + Bv * position.y) * Rh + Hn * .004;
      N = Hn; vQ = position.xy;
    } else {
      float w = max(.007 * sc, dc * .0013) * show;
      P = mix(base, hp, position.y) + Rv * position.x * w * (1. - position.y);
      N = normalize(Vh + up * .4); vQ = position.xy;
    }
  } else if (aPart < 4.5) {
    // a leaf: base, two shoulders, tip; arching out of the tuft (long, narrow and upright on a cat's tail)
    float l = aJ - 10.; hj = h21(vec2(l * 5.3 + 2.2, iRnd.z * 83. + 7.7));
    float ang = aH.x + a0 * 3., t = position.y, side = position.x;
    float len = (.11 + .1 * aH.y * (.6 + .8 * hj)) * sc * smoothstep(.06, .45, uGrowth) * mix(1., 1.8, spk);
    vec2 d2 = vec2(cos(ang), sin(ang));
    vec2 l2 = d2 * t * len * mix(1., .55, spk) + vec2(-d2.y, d2.x) * side * len * mix(.24, .07, spk);
    P = ip + vec3(l2.x, .012 + sin(t * 2.3) * len * (.3 + .35 * aH.z) * mix(1., 2.4, spk), l2.y);
    N = normalize(vec3(-d2.x * .5, 1., -d2.y * .5) + vec3(-d2.y, 0., d2.x) * side * .5);
    vQ = vec2(side, t);
  } else {
    // the spike: one card turned to the lens, swaying; the raceme is cut and painted in the fragment shader
    float Hs = (.5 + .4 * iRnd.y) * sc * hgtK * smoothstep(.8, .97, uGrowth) * spk * flower;
    vec3 sway = vec3(sin(uTime * 5. + a0 * 7.), 0., cos(uTime * 4.3 + a0 * 5.)) * .05 + vec3(cos(a0 * 3.), 0., sin(a0 * 3.)) * .08;
    float t = position.y;
    P = ip + up * t * Hs + sway * t * t * Hs + Rv * position.x * max(.05 * sc, dc * .004) * step(1e-3, Hs);
    N = normalize(Vh + up * .3); vQ = position.xy;
  }
  P = ip + (P - ip) * here;
  vP = P; vN = N; vT = Tn; vPart = aPart; vOpen = o; vKind = mix(kind, 4., step(.5, spk)); vHash = hj;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,ln=`
varying vec3 vP, vN, vT, vFace, vBack, vEyeC; varying float vPart, vOpen, vKind, vHash; varying vec2 vQ;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.));
  float lit = sunLine(vP.xz) * domeShadow(vP);
  vec3 alb = vec3(.1); float wrap = .5, sunK = 1.; vec3 add = vec3(0.);
  if (vPart < .5) {
    float r = length(vQ), a = atan(vQ.y, vQ.x + 1e-5);
    if (vOpen < .35) {
      // shut: a furled goblet in the colour of the rays' backs, paler at its tip, on a green calyx
      float y = vQ.y * .5 + .5;
      float w = (.2 + .26 * sin(clamp(y, 0., 1.) * 2.5)) * (1. - .85 * smoothstep(.7, 1., y));
      if (abs(vQ.x) > w) discard;
      alb = mix(mix(cGreen, vec3(.16, .36, .08), .45) * .6, vBack * (1. + .5 * smoothstep(.55, 1., y)), smoothstep(.15, .32, y));
      alb *= .82 + .18 * cos(vQ.x / max(w, 1e-3) * 5.);
      alb = mix(alb, vec3(.62, .68, .86) * (.5 + .7 * y), uNite * .6 * smoothstep(.2, .5, y));          // by night the pale tips catch the starlight
    } else {
      float n = vKind > 2.5 ? 9. : vKind > 1.5 ? 17. : 13.;
      float pm = abs(fract(a * n / 6.2832 + vHash) - .5) * 2.;
      if (r > mix(1., .62, pm * pm) * mix(.72, 1., vOpen)) discard;
      float front = step(0., dot(N, V));
      vec3 T = normalize(vT + vec3(1e-5, 0., 0.)), B = cross(N, T);
      // the rays stand in a shallow cup, deeper under a low sun: the far side of the head turns its face to the lens
      float cup = .25 + .5 * (1. - smoothstep(.2, .55, uSunDir.y));
      vec3 Nc = normalize(N - (T * vQ.x + B * vQ.y) * cup);
      // (a rain daisy is cream, never white: its rays darken to mauve toward the eye and each ray has its own crease and shade)
      float wk = step(.5, vKind) * step(vKind, 1.5);
      alb = mix(vBack, vFace * mix(1.06, 1., wk) + .03 * (1. - wk), mix(.55, 1., front));
      alb *= mix(.84 + .16 * cos(pm * 3.1416), (.72 + .28 * cos(pm * 3.1416)) * (.86 + .14 * cos(a * 5. + vHash * 40.)), wk);
      alb = mix(alb, alb * vec3(.62, .52, .78), wk * (1. - smoothstep(.3, .8, r)) * .8);
      float eyeR = vKind > 2.5 ? .2 : .26;
      float ring = 1. - smoothstep(eyeR, eyeR + .17, r);
      if (vKind < .5) alb = mix(alb, vFace * .36, ring * .7 * front);
      else if (vKind < 1.5) alb = mix(alb, vec3(.26, .17, .42), ring * .8 * front);
      else if (vKind < 2.5) alb = mix(alb, vec3(.04, .03, .02), max(ring * .6, (1. - smoothstep(.07, .13, abs(r - .45))) * (1. - smoothstep(.25, .6, pm))) * front);
      alb = mix(alb, vEyeC * (.7 + .7 * smoothstep(0., eyeR, r)), (1. - smoothstep(eyeR - .05, eyeR, r)) * front);
      float n0s = clamp(dot(N, uSunDir), -1., 1.);
      add = (vFace * uSunCol * lit * vOpen * ((1. - front) * max(n0s, 0.) * .42 + front * max(-n0s, 0.) * .3) + alb * uSunCol * lit * .08) * mix(1., .3, wk);
      N = front > .5 ? Nc : -Nc;
    }
  } else if (vPart < 2.5) {
    alb = mix(cGreen, vec3(.16, .36, .08), .45) * mix(.4, .72, vQ.y); if (dot(N, V) < 0.) N = -N;
  } else if (vPart < 4.5) {
    if (dot(N, V) < 0.) N = -N;
    vec3 lc = mix(mix(cGreen, vec3(.14, .34, .07), .5), vec3(.17, .43, .08), step(.5, vKind) * step(vKind, 1.5));
    lc = mix(lc, vec3(.2, .4, .12), step(3.5, vKind));
    alb = lc * mix(.5, .92, vQ.y) * (.82 + .3 * vHash) * (1. - .22 * (1. - smoothstep(0., .3, abs(vQ.x)))); wrap = .35;
  } else {
    float x = vQ.x, t = vQ.y;
    float w = mix(.92, .15, smoothstep(.45, 1., t)) * smoothstep(.36, .47, t);
    vec2 cg = vec2(x * 3.3 + .5 * floor(mod(t * 26., 2.)), t * 26.); vec2 cf = fract(cg) - .5;
    float fl = (1. - smoothstep(.34, .5, length(cf))) * step(abs(x), w);
    float stem = step(abs(x), .1) * step(t, .98);
    if (max(fl, stem) < .5) discard;
    vec3 fc = mix(vec3(.93, .7, .07), vec3(.2, .3, .85), uSeason.w) * (.75 + .5 * h21(floor(cg) + 3.3));
    fc = mix(fc, mix(vec3(.5, .6, .12), vec3(.95, .45, .05), .5), smoothstep(.8, 1., t));
    alb = mix(vec3(.2, .4, .12) * mix(.45, .8, t), fc, fl);
    add = alb * uSunCol * lit * .1 * fl; if (dot(N, V) < 0.) N = -N; wrap = .6;
  }
  vec3 col = shadeS(alb, N, vP, wrap, sunK, 0.) + add;
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`,ct={uWin:{value:new f.Vector4(0,0,20,1/20)},uLensK:{value:1},mesh:null};{const t=[],e=[],s=[],o=[],n=[],c=(w,M,C,V,b,P)=>(t.push(w,M,C),e.push(V),s.push(b),o.push(P[0],P[1],P[2],P[3]),t.length/3-1);[[0,.12,1,1],[2.4,.62,.78,.8],[4.8,.85,.6,.92],[.9,1,.42,.6],[3.3,.9,.52,.72],[5.7,.7,.86,.55]].forEach((w,M)=>{const C=c(-1,-1,0,0,M,w);c(1,-1,0,0,M,w),c(1,1,0,0,M,w),c(-1,1,0,0,M,w),n.push(C,C+1,C+2,C,C+2,C+3);const V=c(-1,0,0,2,M,w);c(1,0,0,2,M,w),c(0,1,0,2,M,w),n.push(V,V+1,V+2)}),[[.4,1,.5,0],[1.45,.7,.9,0],[2.5,.9,.3,0],[3.55,.6,.7,0],[4.6,.85,.4,0],[5.65,.75,.8,0]].forEach((w,M)=>{const C=c(0,0,0,4,10+M,w);c(-1,.55,0,4,10+M,w),c(1,.55,0,4,10+M,w),c(0,1,0,4,10+M,w),n.push(C,C+1,C+2,C+1,C+3,C+2)});const y=[0,0,0,0];{const w=c(-1,0,0,5,0,y);c(1,0,0,5,0,y),c(-1,1,0,5,0,y),c(1,1,0,5,0,y),n.push(w,w+1,w+2,w+1,w+3,w+2)}const d=Math.round(2200*K*Tt(Z,.85,1.1)),i=new Float32Array(d*3),h=new Float32Array(d*4),v=z.core.makeRng(((z.seed|0)^1988563)>>>0);for(let w=0;w<d;w++)i[w*3]=v(),i[w*3+1]=v(),i[w*3+2]=0,h[w*4]=v(),h[w*4+1]=v(),h[w*4+2]=v(),h[w*4+3]=v();const x=new f.InstancedBufferGeometry;x.setAttribute("position",new f.Float32BufferAttribute(t,3)),x.setAttribute("aPart",new f.Float32BufferAttribute(e,1)),x.setAttribute("aJ",new f.Float32BufferAttribute(s,1)),x.setAttribute("aH",new f.Float32BufferAttribute(o,4)),x.setIndex(n);const l=new f.InstancedBufferAttribute(i,3),a=new f.InstancedBufferAttribute(h,4);x.setAttribute("iOff",l),x.setAttribute("iRnd",a),x.instanceCount=d,ct.mesh=new f.Mesh(x,Y.makeMat({...F,uWin:ct.uWin,uLensK:ct.uLensK,uPl:Fe,uKop:De},rn,ln,{side:f.DoubleSide})),ct.mesh.frustumCulled=!1,ct.mesh.visible=!1,H.add(ct.mesh),ct.n=d,ct.n0=Math.round(d*.6);const u=Ne+`
attribute vec3 iOff; attribute vec4 iRnd;
uniform vec4 uWin; uniform float uLensK;
varying vec2 vQ; varying float vA;
void main(){`+us+`
  float hl = max(length(uSunDir.xz), 1e-3); vec2 sd = -uSunDir.xz / hl;
  float rs = (.2 + .12 * iRnd.y) * sc * smoothstep(.06, .45, uGrowth) * here;
  float sun = smoothstep(.03, .14, uSunDir.y) * sunLine(pxz);
  float st = min(.45 * hl / max(uSunDir.y, .15), 2.) * sun;
  vec2 q = pxz + sd * rs * st * .6 + (sd * position.x * (1. + st * .6) + vec2(-sd.y, sd.x) * position.z) * rs;
  vec3 P = vec3(q.x, ip.y + .03 + .04 * length(q - pxz), q.y);
  vQ = position.xz; vA = (.3 + .3 * sun) * (1. - .5 * uNite);
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,p=`
varying vec2 vQ; varying float vA;
void main(){
  float a = (1. - smoothstep(.25, 1., length(vQ))) * vA;
#ifdef USE_FOG
  a *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
#endif
  gl_FragColor = vec4(mix(vec3(1.), vec3(.3, .38, .5), a), 1.);
}`,r=new f.InstancedBufferGeometry;r.setAttribute("position",new f.Float32BufferAttribute([-1,0,-1,1,0,-1,1,0,1,-1,0,1],3)),r.setIndex([0,2,1,0,3,2]),r.setAttribute("iOff",l),r.setAttribute("iRnd",a),r.instanceCount=d,ct.shade=new f.Mesh(r,Y.makeMat({...F,uWin:ct.uWin,uLensK:ct.uLensK,uPl:Fe,uKop:De},u,p,{transparent:!0,depthWrite:!1,blending:f.CustomBlending,blendEquation:f.AddEquation,blendSrc:f.DstColorFactor,blendDst:f.ZeroFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),ct.shade.frustumCulled=!1,ct.shade.visible=!1,ct.shade.renderOrder=1,H.add(ct.shade)}await z.yield();const Qt={uWin:{value:new f.Vector4(0,0,18,1/18)},uFly:{value:0},mesh:null};{const t=Ne+`
attribute vec3 iOff; attribute vec4 iRnd;
uniform vec4 uWin; uniform float uFly;
varying vec3 vP, vN; varying vec2 vQ; varying float vK;
void main(){
  vec2 rel = fract(iOff.xy - uWin.xy * uWin.w) - .5;
  vec2 c = uWin.xy + rel * uWin.z;
  float edge = 1. - smoothstep(.36, .5, max(abs(rel.x), abs(rel.y)));
  float ph = iRnd.x * 6.2832, sp = .6 + .8 * iRnd.y, amp = .7 + .9 * iRnd.z;
  float t1 = uTime * .9 * sp + ph, t2 = uTime * 2.3 * sp + ph * 2., t3 = uTime * .7 * sp + ph * 1.7, t4 = uTime * 1.9 * sp + ph;
  vec2 pxz = c + vec2(sin(t1) + .5 * sin(t2), cos(t3) + .5 * cos(t4)) * amp;
  vec2 dw = vec2(.9 * cos(t1) + 1.15 * cos(t2), -.7 * sin(t3) - .95 * sin(t4));
  vec2 hd = dw / max(length(dw), 1e-3);
  float cov = daisyMix(speciesAt(c)).w;
  vec3 body = vec3(pxz.x, groundH(pxz) + .5 + .55 * iRnd.w + .14 * sin(uTime * 3.1 * sp + ph * 3.), pxz.y);
  float sz = (.075 + .045 * iRnd.y) * uFly * edge * smoothstep(1.6, 3.2, length(uCam - body)) * smoothstep(.3, .6, cov);
  float beat = sin(uTime * (12. + 6. * iRnd.z) + ph * 5.);
  float flap = mix(.2 + 1.05 * beat, .5, smoothstep(.55, .8, sin(uTime * 1.3 * sp + ph * 4.)));
  vec3 fwd = vec3(hd.x, 0., hd.y), rt = vec3(-hd.y, 0., hd.x);
  vec3 wdir = rt * position.z * cos(flap) + vec3(0., sin(flap), 0.);
  vec3 P = body + (fwd * position.y + wdir * position.x) * sz;
  vP = P; vN = cross(fwd, wdir) * position.z; vQ = position.xy; vK = iRnd.w;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,e=`
varying vec3 vP, vN; varying vec2 vQ; varying float vK;
void main(){
  float d1 = length((vQ - vec2(.5, .38)) / vec2(.52, .42)), d2 = length((vQ - vec2(.38, -.3)) / vec2(.4, .42)), dm = min(d1, d2);
  float bodyK = (1. - smoothstep(.05, .09, vQ.x)) * step(abs(vQ.y), .5);
  if (dm > 1. && bodyK < .5) discard;
  vec3 base = vK < .5 ? vec3(.86, .4, .06) : vK < .8 ? vec3(.86, .84, .74) : vec3(.9, .72, .1);
  float dk = max(smoothstep(.74, .92, dm) * (vK < .5 ? 1. : .55), smoothstep(.66, .8, vQ.x) * step(.15, vQ.y) * (vK < .8 ? 1. : .6));
  vec3 alb = mix(base, vec3(.04, .03, .03), max(dk, bodyK));
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.)); if (dot(N, V) < 0.) N = -N;
  vec3 col = shade(alb, N, vP, .6) + alb * uSunCol * sunLine(vP.xz) * .1;
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`,s=[],o=[];for(const d of[-1,1]){const i=s.length/3;s.push(0,.8,d,0,-.72,d,1.02,.8,d,1.02,-.72,d),o.push(i,i+1,i+2,i+1,i+3,i+2)}const n=Math.round(110*K),c=new Float32Array(n*3),g=new Float32Array(n*4),m=z.core.makeRng(((z.seed|0)^2850585)>>>0);for(let d=0;d<n;d++)c[d*3]=m(),c[d*3+1]=m(),c[d*3+2]=0,g[d*4]=m(),g[d*4+1]=m(),g[d*4+2]=m(),g[d*4+3]=m();const y=new f.InstancedBufferGeometry;y.setAttribute("position",new f.Float32BufferAttribute(s,3)),y.setIndex(o),y.setAttribute("iOff",new f.InstancedBufferAttribute(c,3)),y.setAttribute("iRnd",new f.InstancedBufferAttribute(g,4)),y.instanceCount=n,Qt.mesh=new f.Mesh(y,Y.makeMat({...F,uWin:Qt.uWin,uFly:Qt.uFly,uPl:Fe,uKop:De},t,e,{side:f.DoubleSide})),Qt.mesh.frustumCulled=!1,Qt.mesh.visible=!1,H.add(Qt.mesh)}await z.yield();const O=[],et=[],Ie=[],bt=U.fork("props"),pt=[],No=(t,e,s)=>B.nearestXZ(t,e).dist>9+s,ne=(t,e)=>B.nearestXZ(t,e).dist,Ot=new f.Vector3,me=new f.Vector3,ae=(t,e)=>{B.posAtDist(t,Ot),B.tangentAtDist(t,me);const s=Math.hypot(me.x,me.z)||1;return[Ot.x-me.z/s*e,Ot.z+me.x/s*e,me.x/s,me.z/s]},Gt=(t,e,s)=>{for(let o=t;o<O.length;o++)O[o].st=s;for(let o=e;o<et.length;o++)et[o].st=s},ye=.84*I+16,Ct=[],so=Math.round(Tt(16*Z,10,20)),fs=.55*I+18,Jt=[[-30,104],[-24,70],[-15,42],[-7,18],[0,0],[1.5,-13],[12,-32],[36,-66],[76,-124],[120,-220]].map(([t,e])=>ae(fs+t,e)),Ut=[0];for(let t=1;t<Jt.length;t++)Ut.push(Ut[t-1]+Math.hypot(Jt[t][0]-Jt[t-1][0],Jt[t][1]-Jt[t-1][1]));const Fo=Ut[4],ds=Ut[Ut.length-1],Do=(t,e)=>{const s=Tt(t+Fo,0,ds);let o=1;for(;o<Ut.length-1&&Ut[o]<s;)o++;const n=(s-Ut[o-1])/Math.max(.001,Ut[o]-Ut[o-1]);return e[0]=wt(Jt[o-1][0],Jt[o][0],n),e[1]=wt(Jt[o-1][1],Jt[o][1],n),e};{const t=ae(fs+8,-2);F.uOrange.value.set(t[0],t[1],32,1)}const We=[];for(let t=-Fo;t<=ds-Fo;t+=4){const e=Do(t,[0,0]);We.push([e[0],e[1],4.5])}const cn=16/(I/Is),hn=t=>.63+21/I+cn*(t-.63);await z.yield();const ht=1.15,ps=B.posAtDist(106),no=B.tangentAtDist(106),ao=new f.Vector2(no.x,no.z).normalize(),io=new f.Vector2(-ao.y,ao.x),$={x:ps.x+io.x*13.3,z:ps.z+io.y*13.3};$.y=R($.x,$.z);const ie=(t,e)=>[$.x+(ao.x*t+io.x*e)*ht,$.z+(ao.y*t+io.y*e)*ht];{const t=ie(.5,-.6),e=ie(-2.9,1),s=ie(-5.8,-2),o=ie(5.2,-1.6),n=ie(-1.6,5.1),c=ie(3.6,2.6);O.push({x:$.x,y:$.y+2*ht,z:$.z,r:4.9*ht,sy:.84,sx:1,sz:1.04,detail:7,facets:4,tone:1},{x:t[0],y:$.y+5.9*ht,z:t[1],r:3.3*ht,sy:.76,detail:6,facets:4,tone:1.06},{x:e[0],y:$.y+4.6*ht,z:e[1],r:1.9*ht,sy:.8,detail:5,facets:4,tone:.95},{x:s[0],y:$.y+.9*ht,z:s[1],r:2.3*ht,sy:.8,detail:5,facets:3,tone:.92},{x:o[0],y:$.y+.6*ht,z:o[1],r:1.8*ht,sy:.75,detail:4,facets:3,tone:1.1},{x:n[0],y:$.y+.35*ht,z:n[1],r:1.05*ht,sy:.8,detail:3,facets:3,tone:1},{x:c[0],y:$.y+.5*ht,z:c[1],r:1.5*ht,sy:.72,detail:4,facets:3,tone:1.04})}const Vo={x:ie(.3,-.5)[0],y:$.y+7.9*ht,z:ie(.3,-.5)[1],H:10.4*ht,levels:5,hero:!0,nest:!0,lean:.05,yaw:.6};et.push(Vo),Gt(0,0,"the Sentinel"),Ie.push([$.x,$.y+3.9*ht,$.z,5*ht],[Vo.x,$.y+15.6*ht,Vo.z,4.1*ht]),await z.yield();for(const t of Dt){const e=R(t.x,t.z),s=27*t.big,o=bt.range(.95,1.3),n=bt.int(2,3),c=O.length,g=et.length;O.push({x:t.x,y:e+s*o*.42,z:t.z,r:s,sy:o,detail:t.near?7:t.far?5:6,facets:5,tone:bt.range(.92,1.06)}),Ie.push([t.x,e+s*o*.5,t.z,s*1.15]),t.top=e+s*o*1.4,t.ball=[t.x,e+s*o*.5,t.z,s*1.06],t.foot=s*2.6;for(let y=0;y<n;y++){const d=bt.range(0,6.28),i=s*bt.range(.8,1.15),h=s*bt.range(.5,.75),v=bt.range(.8,1.1),x=t.x+Math.cos(d)*i,l=t.z+Math.sin(d)*i;No(x,l,h)&&O.push({x,y:R(x,l)+h*v*.35,z:l,r:h,sy:v,detail:t.near?5:t.far?3:4,facets:4,tone:bt.range(.88,1.1)})}if(t.big>.95||t.near){const y=s*(t.near?.36:.42),d=t.near?s*.3:3;O.push({x:t.x+bt.range(-d,d),y:e+s*o*(t.near?1.22:1.34)+y*.5,z:t.z+bt.range(-d,d),r:y,sy:.8,detail:t.near?5:4,facets:4,tone:1.05}),t.top+=y*1.2}for(let y=0;y<9;y++){const d=bt.range(0,6.28),i=s*bt.range(.9,2.6),h=bt.range(2.2,5.5),v=t.x+Math.cos(d)*i,x=t.z+Math.sin(d)*i,l=bt.range(.6,.9);No(v,x,h*1.3)&&(O.push({x:v,y:R(v,x)+h*.3,z:x,r:h*1.3,sy:l,detail:t.near?3:t.far?1:2,facets:4,tone:bt.range(.85,1.12)}),t.near&&pt.push([v,x,h*1.3,h*1.3*l*1.5,0]))}const m=Math.round(bt.int(9,13));for(let y=0;y<m;y++){const d=bt.range(0,6.28),i=s*bt.range(1.15,3.6),h=t.x+Math.cos(d)*i,v=t.z+Math.sin(d)*i,x=bt.range(5,9);No(h,v,1)&&(et.push({x:h,y:R(h,v)-.2,z:v,H:x,levels:t.near&&B.nearestXZ(h,v).dist<40?4:t.near?3:2,hero:t.near&&B.nearestXZ(h,v).dist<26}),t.near&&pt.push([h,v,x*.3,x,1]))}Gt(c,g,"the ring koppies")}await z.yield();const $t=[[$.x,$.z,5.2*ht]],Et=(()=>{const[t,e,s,o]=Yt(pe[0]);return[t-o*pe[1],e+s*pe[1]]})(),vs=(()=>{const[t,e,s,o]=Yt(188);return[t+o*7.5,0,e-s*7.5]})(),ms=(t,e)=>{const s=Ke(t,e);return Math.hypot((s[0]-pe[0])/12.5,(s[1]-pe[1])/7.4)<1};{const t=ut("the outliers"),e=O.length,s=et.length;for(const[o,n,c,g]of[[198,1,12.5,1.5],[300,1,16.5,1.4],[367,1,36,1],[562,1,27,1]]){const m=B.posAtDist(o),y=B.tangentAtDist(o),d=m.x-y.z*n*c,i=m.z+y.x*n*c,h=R(d,i),v=t.range(2.3,3)*g,x=t.range(6.2,7.6)*(g>1?1.2:1);O.push({x:d,y:h+v*.36,z:i,r:v,sy:.8,detail:g>1?6:5,facets:4,tone:1},{x:d+v*.95*n,y:h+v*.2,z:i+t.range(-1.5,1.5),r:v*.62,sy:.75,detail:4,facets:3,tone:.92},{x:d-v*.35*n,y:h+v*1.02,z:i+.5,r:v*.52,sy:.72,detail:3,facets:3,tone:1.08}),$t.push([d,i,v]);const l=d-y.x*v*1.5-y.z*n*-v*.9,a=i-y.z*v*1.5+y.x*n*-v*.9;et.push({x:l,y:R(l,a)-.15,z:a,H:x,levels:4,hero:!0}),pt.push([d,i,v*1.1,v*1.9,0],[l,a,x*.3,x,1])}Gt(e,s,"the outliers")}await z.yield();const ys=(t,e,s,o,n,c,g,m)=>{const y=B.posAtDist(t),d=m?m.t:B.tangentAtDist(t),i=m?m.x:y.x-d.z*e*s,h=m?m.z:y.z+d.x*e*s,v=R(i,h),x=i-d.z*e*o*.12+d.x*.4,l=h+d.x*e*o*.12+d.z*.4,a=s<20?0:1;O.push({x:i,y:v+o*.4,z:h,r:o,sy:.82,sx:1,sz:1.05,detail:7-a,facets:4,tone:1},{x,y:v+o*1.12,z:l,r:o*.64,sy:.76,detail:6-a,facets:4,tone:1.06},{x:i-d.z*e*o*1.05-d.x*o*.5,y:v+o*.22,z:h+d.x*e*o*1.05-d.z*o*.5,r:o*.52,sy:.8,detail:5-a,facets:3,tone:.92},{x:i+d.x*o*1.1,y:v+o*.15,z:h+d.z*o*1.1,r:o*.4,sy:.75,detail:4-a,facets:3,tone:1.1},{x:i-d.x*o*1.25+g.range(-1,1),y:v+o*.1,z:h-d.z*o*1.25,r:o*.3,sy:.8,detail:3,facets:3,tone:1}),$t.push([i,h,o]);const u=v+o*1.12+o*.64*.76*.72;et.push({x,y:u,z:l,H:n,levels:c,hero:!0,lean:.04,yaw:g.range(0,3)}),pt.push([i,h,o*1.15,o*1.6,0],[x,l,n*.32,u-v+n,1]),Ie.length<10&&Ie.push([i,v+o*.8,h,o*1.05])};{const t=ut("the tall stacks"),e=O.length,s=et.length;for(const[o,n,c,g,m,y]of[[488,-1,10.8,4,8.4,5],[531,1,24,3.3,8.2,4],[553,1,12.4,3.8,9,4],[396,1,10.5,4,9.4,5]])ys(o,n,c,g,m,y,t);Gt(e,s,"the tall stacks")}{const t=ut("the knolls"),e={x:0,z:-1},s=O.length,o=et.length;for(const n of[[-10.5,117,-1,2.4,4.8],[11.5,113,1,3,3.6]])ys(0,n[2],0,n[3],n[4],4,t,{x:n[0],z:n[1],t:e});Gt(s,o,"the knolls")}const un=.12*I+28,ge=ae(un,10.5);{const t=ut("the dusk boulders"),e=O.length,[s,o,n,c]=ge;for(const[g,m,y,d]of[[0,0,3.1,.8],[3.4,2.6,1.9,.72],[-3,-1.6,1.5,.7],[1.2,-3.6,1,.66]]){const i=s+n*g-c*m,h=o+c*g+n*m;O.push({x:i,y:R(i,h)+y*d*.32,z:h,r:y,sy:d,detail:y>2.5?6:y>1.6?5:4,facets:4,tone:t.range(.9,1.1)}),pt.push([i,h,y*1.08,y*d*1.6,0])}Gt(e,et.length,"the dusk boulders")}await z.yield();const xe=(t,e,s)=>{const o=Ke(t,e);if(N(qt[0],qt[1],o[0])*(1-N(qt[2],qt[3],o[0]))*N(310,345,Math.hypot(t,e))>.05&&Math.abs(as(o[0],o[1]))<8.5+s||ns(o[0],o[1])<xt[3]*.55+s)return!0;const c=F.uWash.value;return Math.hypot(t*.8,e)>84&&Math.abs(e-(c.x+c.y*Math.sin(t*c.z+c.w)))<9+s},ro=(()=>{const t=B.pointAt(.5),e=B.tangentAt(.5);return[t.x+e.z*45,t.z-e.x*45]})(),Bo=[[ye,9,-2.2,1.15,1],[ye+8,19.5,-1,.98,1],[ye+11.5,22.1,2.5,.93,0]].map(t=>[ae(t[0],t[1]),t]),fn=(t,e)=>{const s=F.uSeed.value,o=He(t*.013+s.x,e*.013+s.y),n=He(t*.037+s.y*1.7,e*.037+s.x*1.7),c=He(t*.12+3.1,e*.12+3.1),g=He(t*.31+8.7,e*.31+8.7),m=Math.hypot(t*.8,e),y=Math.sin((m*.05+(o-.5)*5.5+(n-.5)*1.5)*6.2832),d=1-N(70,104,Math.hypot(t*.72,e-138));return N(.27,.41,c*.4+g*.24+o*.3+y*.075+.03+d*.09)},gs=9,lo=(t,e,s,o)=>ne(t,e)>=(s>1.5?gs+s*1.2:o+s),co=(()=>{const t=Yt(Ht[0]+Ht[1]);return B.nearestXZ(t[0],t[1]).u*I})(),dn=(t,e)=>{let s=1-N(140,520,Math.hypot(t*.8,e));for(const o of Dt)s=Math.max(s,1-N(o.foot,o.foot+160,Math.hypot(t-o.x,e-o.z)));return s},pn=(t,e,s)=>!lo(t,e,s,7)||xe(t,e,s*1.4)||Math.hypot(t-Et[0],e-Et[1])<16+s*1.6||Math.hypot(t-gt.x,e-gt.z)<9+s*1.6||Math.hypot(t-ro[0],e-ro[1])<10+s*1.6||Math.hypot(t-ge[0],e-ge[1])<12+s*1.6||Bo.some(([o])=>Math.hypot(t-o[0],e-o[1])<12+s*1.6)||$t.some(o=>Math.hypot(t-o[0],e-o[1])<14+s+o[2])||We.some(o=>Math.hypot(t-o[0],e-o[1])<7+s*1.6)?!1:!O.some(o=>Math.hypot(t-o.x,e-o.z)<o.r+s*1.5+2),vn=[];{const t=ut("the stacks of the plain"),e=O.length,s=et.length,o=t.int(0,3);for(let n=0,c=146;;n++){B.posAtDist(c,Ot);const g=c>=co&&c<ye,m=dn(Ot.x,Ot.z),y=g?45:66-28*m;let d=c+.45*y*t();if(c+=y,d>I-150)break;const i=n%4===o,h=i?t.range(5.4,7.2):t.range(3.2,4.4)*(1+.45*m*t()),v=t.sign(),x=i?t.range(30,56):Math.max(g?10+8*t():12+13*t()*t(),gs+h*1.2+.2);let l=null;for(let a=0;a<5&&!l&&d<I-150;a++){for(const[u,p]of[[v,x],[-v,x],[v,x+6],[-v,x+6]]){const[r,w]=ae(d,u*p);if(pn(r,w,h)){l=[r,w,u,p];break}}l||(d+=14)}if(l){const[a,u,p,r]=l,w=R(a,u),M=t.range(0,6.2832),C=Math.cos(M),V=Math.sin(M),b=r<19?0:r<24?1:r<32?2:4,P=(J,lt)=>[a+(C*J-V*lt)*h,u+(V*J+C*lt)*h],S=P(.12,-.1);O.push({x:a,y:w+h*.38,z:u,r:h,sy:.86,sx:1,sz:1.06,detail:7-b,facets:4,tone:1},{x:S[0],y:w+h*1.1,z:S[1],r:h*.62,sy:.78,detail:Math.max(2,5-b),facets:4,tone:1.06});const k=t.int(3,4),Q=t.range(0,6.2832);for(let J=0;J<k;J++){const lt=[.56,.42,.3,.24][J]*t.range(.9,1.12),Pt=Q+J*6.2832/k+t.range(-.45,.45),it=(.62+lt)*t.range(1,1.16)+J*.15*t(),tt=P(Math.cos(Pt)*it,Math.sin(Pt)*it);lo(tt[0],tt[1],h*lt,7.4)&&O.push({x:tt[0],y:R(tt[0],tt[1])+h*lt*.4,z:tt[1],r:h*lt,sy:t.range(.74,.84),sx:1,sz:1.05,detail:Math.max(1,4-J-b),facets:3,tone:t.range(.9,1.1)})}$t.push([a,u,h]),vn.push({s:d,x:a,z:u,Rk:h,d:r,side:p}),pt.push([a,u,h*1.15,h*1.7,0]);const q=r<26,j=w+h*1.1+h*.62*.78*.7;if(r<20||t()<.85){const J=t.range(8,10.6);et.push({x:S[0],y:j,z:S[1],H:J,levels:r<20?h>5?5:4:3,hero:q,lean:.05,yaw:t.range(0,3)}),pt.push([S[0],S[1],J*.32,j-w+J,1])}for(let J=0,lt=t.int(0,2);J<lt;J++){const Pt=t.range(0,6.2832),it=t.range(1.45,1.9),tt=P(Math.cos(Pt)*it,Math.sin(Pt)*it),mt=t.range(5,7.4);ne(tt[0],tt[1])<9.5||O.some(At=>Math.hypot(tt[0]-At.x,tt[1]-At.z)<At.r*.95+.6)||(et.push({x:tt[0],y:R(tt[0],tt[1])-.15,z:tt[1],H:mt,levels:q?3:2,hero:ne(tt[0],tt[1])<18,yaw:t.range(0,3)}),pt.push([tt[0],tt[1],mt*.3,mt,1]))}}}Gt(e,s,"the stacks of the plain")}await z.yield();{let t=Dt[0];for(const n of Dt)Math.hypot(n.x-Et[0],n.z-Et[1])<Math.hypot(t.x-Et[0],t.z-Et[1])&&(t=n);F.uRefl.value[0].set(t.ball[0],t.ball[1],t.ball[2],t.ball[3]);const e=n=>[n.x,n.y,n.z,n.r*.95],s=O.filter(n=>n.r>=2&&n.r<20).map(n=>[n.r/Math.max(1,Math.hypot(n.x-Et[0],n.z-Et[1])),n]).filter(n=>n[0]>2/170).sort((n,c)=>c[0]-n[0]);for(let n=0;n<3;n++)if(s[n]){const c=e(s[n][1]);F.uRefl.value[1+n].set(c[0],c[1],c[2],c[3])}const o=O.filter(n=>n.r>=1.4&&n.r<20).map(n=>[n,B.nearestXZ(n.x,n.z)]).filter(n=>n[1].dist<26&&n[1].u*I<240).sort((n,c)=>c[0].r-n[0].r);for(let n=0;n<4;n++)if(o[n]){const c=e(o[n][0]);F.uRefl.value[4+n].set(c[0],c[1],c[2],c[3])}}await z.yield();for(const[t,[e,s,o,n,c]]of Bo){const g=t[2]*Math.cos(o)-t[3]*Math.sin(o),m=t[3]*Math.cos(o)+t[2]*Math.sin(o);Ct.push({sd:e,x:t[0],z:t[1],y:R(t[0],t[1]),th:Math.atan2(g,m),sc:n,g:c,pan:!1,h:Ae(e,s),yw:(Ae(s,e)-.5)*1.3})}{const t=ut("the standing gemsbok"),e=[],s=(l,a)=>{const[u,p,r,w]=Yt(l);return[u-w*a,p+r*a]},o=(l,a,u,p,r)=>{const w=B.nearestXZ(l[0],l[1]);e.push({c:l,r:a,n:u,lee:p||0,rim:!!r,sd:w.u*I,d:w.dist})},n=Math.atan2(se.y,se.x),c=l=>{if(l.rim)return s(t.range(xt[0],xt[1]),xt[2]-xt[3]*t.range(.85,1.1));if(l.lee){const p=n+t.range(-1.45,1.45),r=l.lee*t.range(.85,1.25);return[l.c[0]+Math.cos(p)*r,l.c[1]+Math.sin(p)*r]}const a=t.range(0,6.2832),u=l.r*Math.sqrt(t());return[l.c[0]+Math.cos(a)*u,l.c[1]+Math.sin(a)*u]};for(let l=-12;l<=12;l++)for(let a=-8;a<=14;a++){const u=$n(l+61.7,a+61.7),p=Ae(l+7.7,a+7.7),r=(l+.5+(u[0]-.5)*.55)*85,w=(a+.5+(u[1]-.5)*.55)*85;if(p<.03||p>.44||Math.hypot(r*.8,w)<190)continue;const M=Ke(r,w);M[0]<60||M[0]>900||Math.abs(M[1])>35||o([r,w],(10+6*u[0])*.5,2)}for(const l of F.uHeu.value)ne(l.x,l.y)<35&&Math.hypot(l.x*.72,l.y-138)>110&&o([l.x,l.y],l.z*.5,2);o([gt.x,gt.z],3.5,2),o(s(Ht[0],t.sign()*13),3,2);for(let l=0;l<2;l++){const a=t.sign()*13;o(s(zo[l][0]-.28*a-5*Math.sin(a*.055+l*2.1),a),2.5,1)}o(s((Wt[0]+Wt[1])*.5,11),3,2),o(s((xt[0]+xt[1])*.5,xt[2]-xt[3]),(xt[1]-xt[0])*.5,2,0,!0);for(const[l,a,u]of $t)o([l,a],(u*2.2+3)*1.25,0,u*2.2+3);await z.yield(),e.sort((l,a)=>l.sd-a.sd);const g=(l,a,u)=>ne(l,a)<u||ms(l,a)||xe(l,a,-4)||O.some(p=>Math.hypot(l-p.x,a-p.z)<p.r*1.05+1.3)||et.some(p=>Math.hypot(l-p.x,a-p.z)<1.6)?!1:!(Ct.some(p=>Math.hypot(l-p.x,a-p.z)<2.3)||We.some(p=>Math.hypot(l-p[0],a-p[1])<6)),m=[0,0,0,0,0,0],y=l=>{const a=l/I;let u=0;for(;u<5&&a>=E[u+1][0];)u++;return u},d=(l,a,u,p,r,w)=>{const M=B.nearestXZ(l,a).u*I,C=y(M);return m[C]>=so?!1:(m[C]++,Ct.push({sd:M,x:l,z:a,y:R(l,a),th:u,sc:p,g:r,pan:w,h:t(),yw:(t()-.5)*1.3}),!0)};d(vs[0],vs[2],t.range(0,6.2832),1.18,0,!0);let i=Ct.find(l=>l.pan).sd+t.range(90,130);const h=ye-60,v=new f.Vector3;for(const l of e){if(l.rim||l.sd<i||l.sd>h||l.d<9-l.r||l.d>14+l.r)continue;let a=null,u=-1;for(let b=0;b<12&&u<.6;b++){const[P,S]=c(l),k=ne(P,S);if(k<9||k>14||!g(P,S,9))continue;const Q=fn(P,S);Q>u&&(u=Q,a=[P,S])}if(!a)continue;B.pointAt(B.nearestXZ(a[0],a[1]).u,v);const p=Math.hypot(a[0]-v.x,a[1]-v.z)||1,r=(a[0]-v.x)/p,w=(a[1]-v.z)/p,M=t.int(2,4),C=t.range(0,6.2832),V=t.range(2.2,3.6);for(let b=0;b<M;b++){let P=a[0],S=a[1],k=b===0;for(let Q=0;Q<6&&!k;Q++){const q=1.5+(b-1)*1.4+1.5*t(),j=(t()-.5)*2*V;P=a[0]+r*q-w*j,S=a[1]+w*q+r*j,k=g(P,S,9)}k&&d(P,S,C+t.range(-.3,.3),t.range(.97,1.13),b>0&&t()<.45?1:0,!1)}l.used=!0,i=l.sd+t.range(90,130)}await z.yield();for(const l of e)if(!(l.used||!l.rim&&(l.d<=14+l.r||l.d>35+l.r)))for(let a=0,u=l.n||t.int(1,2);a<u;a++){const p=t.range(0,6.2832),r=t.range(.95,1.13),w=t()<.42?1:0;let[M,C]=c(l);B.pointAt(B.nearestXZ(M,C).u,Ot);const V=Math.hypot(M-Ot.x,C-Ot.z)||1,b=(M-Ot.x)/V,P=(C-Ot.z)/V;for(let S=0;S<20&&!g(M,C,10);S++)M+=b*1.2,C+=P*1.2;g(M,C,10)&&d(M,C,p,r,w,!1)}Ct.sort((l,a)=>a.sd-l.sd);const x=Ct.find(l=>l.pan);x&&F.uBull.value.set(x.x,x.y,x.z,x.th)}await z.yield();const Be=$t.map(t=>[t[0],t[1],t[2]*2.1]);for(const t of Ct)Be.push([t.x,t.z,4]);for(const t of We)Be.push(t);Be.push([gt.x,gt.z,7],[Et[0],Et[1],14],[F.uOrange.value.x,F.uOrange.value.y,17],[ge[0],ge[1],7]);{const t=ut("the clusters"),e=O.length;for(let s=404;s<880;s+=30){const o=s+t.range(-9,9),n=t.sign(),c=10+t.range(0,8),[g,m]=ae(o,n*c);if(!(xe(g,m,2)||Be.some(y=>Math.hypot(g-y[0],m-y[1])<y[2]+3))){for(let y=0,d=t.int(2,3);y<d;y++){const i=y?t.range(.7,1.3):t.range(1.4,2.3),h=t.range(0,6.28),v=y?t.range(1.5,3.2):0,x=g+Math.cos(h)*v,l=m+Math.sin(h)*v,a=t.range(.5,.78),u=t.range(.85,1.15);lo(x,l,i,7.4)&&(O.push({x,y:R(x,l)+i*a*.28,z:l,r:i,sy:a,sx:1,sz:1.08,detail:i>1.6?4:3,facets:4,tone:u}),pt.push([x,l,i*1.05,i*a*1.5,0]))}Be.push([g,m,3.5])}}Gt(e,et.length,"the clusters")}await z.yield();{const t=ut("the scatter"),e=O.length;for(let s=0,o=0;s<100&&o<900;o++){const n=t.range(-20,I-300)*(s<60?.5:1),c=t.sign(),g=7.5+Math.pow(t(),1.8)*70,[m,y]=ae(n,c*g);if(n<30&&g<18)continue;const d=t.range(.45,1.5)*(g>20?1.5:1);if(!lo(m,y,d,7)||Math.hypot(m-$.x,y-$.z)<10.6||Be.some(h=>Math.hypot(m-h[0],y-h[1])<h[2]+d))continue;const i=t.range(.55,.85);O.push({x:m,y:R(m,y)+d*i*.3,z:y,r:d,sy:i,sx:1,sz:1.08,detail:g<13?3:g<24?2:1,facets:4,tone:t.range(.85,1.15)}),s++,pt.push([m,y,d*1.05,d*i*1.5,0])}Gt(e,et.length,"the scatter")}await z.yield();{const t=ut("the butter trees"),e=et.length;for(const[s,o,n]of $t)for(let c=0,g=t.int(1,3),m=0;c<g&&m<12;m++){const y=t.range(0,6.28),d=n*t.range(1.12,1.7)+.6,i=s+Math.cos(y)*d,h=o+Math.sin(y)*d;if(ne(i,h)<8.5||O.some(x=>Math.hypot(i-x.x,h-x.z)<x.r*.95+.5))continue;const v=t.range(1.3,2);et.push({x:i,y:R(i,h)-.05,z:h,H:v,levels:ne(i,h)<25?2:1,butter:!0,hero:!1,lean:t.range(0,.12)}),c++,pt.push([i,h,v*.35,v*.9,0])}Gt(O.length,e,"the butter trees")}await z.yield();{const t=ut("the massifs"),e=O.length,s=et.length,o=[];for(let n=0;n<2;n++){let c=0,g=0,m=!1;for(let h=0;h<6&&!m;h++){const[v,x,l,a]=Yt(t.range(0,110+yt*vt)),u=t.sign(),p=t.range(150,600);c=v-a*u*p,g=x+l*u*p,m=Math.hypot(c,g)>190&&!Dt.some(r=>Math.hypot(c-r.x,g-r.z)<r.foot+80)&&!o.some(r=>Math.hypot(c-r[0],g-r[1])<170)}if(!m)continue;o.push([c,g]);const y=R(c,g),d=t.range(1.15,1.3),i=66/(d*1.34+.375);O.push({x:c,y:y+i*d*.42,z:g,r:i,sy:d,detail:5,facets:5,tone:t.range(.94,1.04)});for(let h=0;h<3;h++){const v=t.range(0,6.28),x=i*t.range(.75,1.05),l=i*t.range(.5,.72),a=t.range(.85,1.1),u=c+Math.cos(v)*x,p=g+Math.sin(v)*x;O.push({x:u,y:R(u,p)+l*a*.36,z:p,r:l,sy:a,detail:3,facets:4,tone:t.range(.9,1.08)})}for(let h=0;h<3;h++){const v=t.range(0,6.28),x=i*t.range(.2,.3);O.push({x:c+Math.cos(v)*i*.3,y:y+i*d*1.34+x*.45,z:g+Math.sin(v)*i*.3,r:x,sy:.8,detail:2,facets:4,tone:1.05})}for(let h=0;h<5;h++){const v=t.range(0,6.28),x=i*t.range(1.2,2.3),l=c+Math.cos(v)*x,a=g+Math.sin(v)*x,u=t.range(4,9);O.push({x:l,y:R(l,a)+u*.3,z:a,r:u,sy:t.range(.6,.9),detail:1,facets:4,tone:t.range(.86,1.1)})}{const h=t.range(0,6.28),v=i*t.range(1.2,2.3),x=c+Math.cos(h)*v,l=g+Math.sin(h)*v;et.push({x,y:R(x,l)-.2,z:l,H:t.range(7,9),levels:2,hero:!1})}}Gt(e,s,"the massifs")}await z.yield();{const t=Math.ceil(I)+1,e=new Float32Array(t),s=new Float32Array(t),o=new f.Vector3;for(let n=0;n<t;n++)B.posAtDist(Math.min(n,I),o),e[n]=o.x,s[n]=o.z;await z.yield();for(const n of et){if(n.butter||n.y>R(n.x,n.z)+.6)continue;let c=1e9,g=0;for(let l=0;l<t;l++){const a=n.x-e[l],u=n.z-s[l],p=a*a+u*u;p<c&&(c=p,g=l)}if(c=Math.sqrt(c),c>=9)continue;let m=n.x-e[g],y=n.z-s[g];if(Math.hypot(m,y)<.001){const l=Math.min(g+1,t-1),a=Math.max(g-1,0);m=-(s[l]-s[a]),y=e[l]-e[a]}const i=Math.hypot(m,y)||1,h=e[g]+m/i*9.5,v=s[g]+y/i*9.5,x=pt.find(l=>l[4]===1&&l[0]===n.x&&l[1]===n.z);x&&(x[0]=h,x[1]=v),n.x=h,n.z=v,n.y=R(h,v)-.15}}await z.yield();const Re=55,we=Math.ceil((I-160)/Re)+1;{const t=e=>{const s=B.nearestXZ(e.x,e.z),o=s.u*I;e.g=o>I-160?we-1:Math.min(we-1,Math.floor((o+30+.5*s.dist)/Re))};for(let e=0;e<O.length;e++)t(O[e]),(e&63)===63&&await z.yield();for(let e=0;e<et.length;e++)t(et[e]),(e&63)===63&&await z.yield()}await z.yield();const Ro=await Y.makeProps(O,et);H.add(Ro);const ko=Ro.userData.groups,To=Ro.userData.info.nests[0]||new f.Vector3($.x,$.y+9,$.z);Ie.slice(0,10).forEach((t,e)=>F.uCast.value[e].set(t[0],t[1],t[2],t[3]));const mn=F.uCast.value[9].clone();await z.yield();const _o=`
attribute vec3 color; attribute float aT; attribute vec4 iPos; attribute vec3 iRnd;
varying vec3 vP, vN, vC; varying float vT;
void main(){
  float c = cos(iRnd.x * 6.283), s = sin(iRnd.x * 6.283);
  vec3 q = vec3(position.x * c - position.z * s, position.y * (.7 + .5 * iRnd.y), position.x * s + position.z * c) * iPos.w;
  float ph = iRnd.x * 40. + position.x * 5.;
  q.xz += aT * aT * iPos.w * .16 * vec2(sin(uTime * 9. + ph), cos(uTime * 7.3 + ph * 1.3));
  vec3 P = iPos.xyz + q;
  vP = P; vN = vec3(normal.x * c - normal.z * s, normal.y, normal.x * s + normal.z * c); vT = aT;
  vC = color * mix(vec3(.82, .92, .95), vec3(1.2, 1.0, .74), iRnd.z * iRnd.z) * (.75 + .4 * iRnd.y);
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,yn=`
varying vec3 vP, vN, vC; varying float vT;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  vec3 alb = vC * mix(.22, 1.05, vT) * (.7 + .6 * vn(vP.xz * 23. + vP.y * 17.)) * (.55 + .9 * vn(vP.xz * 7.3 + vP.y * 9. + 4.));
  vec3 col = shade(alb, mix(N, vec3(0., 1., 0.), .35), vP, .6);
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`,gn=_o.replace("  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);",`  vC = mix(vC, vec3(dot(vC, vec3(.45))) * vec3(1.3, 1.12, .95) + .015, step(.84, fract(iRnd.x * 7.7)));
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);`),xn=`
varying vec3 vP, vN, vC; varying float vT;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  float fwp = length(fwidth(vP.xz)) + abs(fwidth(vP.y));
  float nearK = 1. - smoothstep(.012, .06, fwp);
  float tw = vn(vP.xz * 19. + vP.y * 14.) * .6 + vn(vP.zx * 43. + vP.y * 29. + 3.) * .4;
  if (tw < .5 * nearK * (1. - smoothstep(.4, .95, vT))) discard;
  vec3 alb = vC * mix(.2, 1.08, min(vT, 1.)) * (.5 + 1. * smoothstep(.3, .78, tw)) * (.7 + .5 * vn(vP.xz * 7.3 + vP.y * 9. + 4.));
  vec3 col = shade(alb, mix(N, vec3(0., 1., 0.), .35), vP, .6);
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`,Eo=[],xs=100,wn=260;{const t=U.fork("bossies"),e=z.core.makeRng(((z.seed|0)^7013857)>>>0),s=[],o=[],n=[],c=[],g=[],m=Y.palette.green,y=(u,p,r,w)=>{for(let M=0;M<u;M++){const C=(M+w)/u*6.2832,V=p*e.range(.72,1.25),b=r*e.range(.75,1.3),P=e.range(.7,1.1);s.push(Math.cos(C)*V,b,Math.sin(C)*V),o.push(Math.cos(C)*.75,.66,Math.sin(C)*.75),n.push(m.r*.62*P,m.g*.6*P,m.b*.66*P),c.push(Math.min(1,b/.6))}};s.push(.06,.62,-.04),o.push(0,1,0),n.push(m.r*.66,m.g*.64,m.b*.68),c.push(1),y(7,.6,.42,0),y(7,1,.03,.5);for(let u=0;u<7;u++){const p=(u+1)%7;g.push(0,1+p,1+u,1+u,1+p,8+u,1+p,8+p,8+u)}for(let u=0;u<9;u++){const p=u/9*6.2832+e.range(-.3,.3),r=e.range(.12,.62),w=.5-r*.3,M=e.range(.4,.78),C=e.range(.1,.6),V=e.range(.06,.1),b=s.length/3,P=Math.cos(p),S=Math.sin(p),k=e.range(.9,1.25);s.push(P*r-S*V,w,S*r+P*V,P*r+S*V,w,S*r-P*V,P*(r+C*M),w+M*(1-C*.45),S*(r+C*M));for(let Q=0;Q<3;Q++){o.push(P*.5,.8,S*.5);const q=Q===2?1.25*k:.7*k;n.push(m.r*.7*q+(Q===2?.03:0),m.g*.68*q+(Q===2?.03:0),m.b*.7*q+(Q===2?.02:0)),c.push(Q===2?1.3:.75)}g.push(b,b+1,b+2)}const d=Math.round(1250*K),i=d+Math.round(420*K),h=[],v=z.core.makeRng(((z.seed|0)^3782593)>>>0),x=O.filter(u=>u.r>1);for(let u=0;h.length<i&&u<i*4;u++){const p=h.length>=d,r=p?v:t,w=p?r.range(110,420):r.range(-40,I-150),M=B.posAtDist(w),C=B.tangentAtDist(w),V=r.sign(),b=p?4+Math.pow(r(),1.3)*24:3.3+Math.pow(r(),1.7)*75,P=M.x-C.z*V*b,S=M.z+C.x*V*b;if(Math.hypot(P*.8,S)<96||Math.hypot(P-$.x,S-$.z)<8||ms(P,S))continue;let k=!1;for(const j of x)if(Math.abs(P-j.x)<j.r&&Math.hypot(P-j.x,S-j.z)<j.r*.98){k=!0;break}if(k||Ct.some(j=>Math.hypot(P-j.x,S-j.z)<1.5))continue;const Q=r.range(.3,.58)*(b<6?.85:1)*(b>30?1.5:1),q=r();h.push([w,P,R(P,S)-.03,S,Q,r(),q,r()]),b<42&&pt.length<(p?2100:1700)&&pt.push([P,S,Q*.8,Q*.62*(.8+.5*q)*1.3,0]),h.length%200===199&&await z.yield()}await z.yield(),h.sort((u,p)=>p[0]-u[0]);const l=new f.BufferGeometry;l.setAttribute("position",new f.Float32BufferAttribute(s,3)),l.setAttribute("normal",new f.Float32BufferAttribute(o,3)),l.setAttribute("color",new f.Float32BufferAttribute(n,3)),l.setAttribute("aT",new f.Float32BufferAttribute(c,1)),l.setIndex(g);const a=Y.makeMat(F,gn,xn,{side:f.DoubleSide});await z.yield();for(let u=0;u<h.length;){const p=Math.floor((h[u][0]+40)/xs);let r=u;for(;r<h.length&&Math.floor((h[r][0]+40)/xs)===p;)r++;const w=r-u,M=new Float32Array(w*4),C=new Float32Array(w*3),V=new Float32Array(w);for(let S=0;S<w;S++){const k=h[u+S];V[S]=k[0],M.set([k[1],k[2],k[3],k[4]],S*4),C.set([k[5],k[6],k[7]],S*3)}const b=new f.InstancedBufferGeometry;for(const S of["position","normal","color","aT"])b.setAttribute(S,l.attributes[S]);b.setIndex(l.index),b.setAttribute("iPos",new f.InstancedBufferAttribute(M,4)),b.setAttribute("iRnd",new f.InstancedBufferAttribute(C,3)),b.instanceCount=w;const P=new f.Mesh(b,a);P.frustumCulled=!1,H.add(P),Eo.push({g:b,m:P,sA:V,n:w}),u=r,await z.yield()}}await z.yield();const ws=[3.2,3.9],bs=[5.4,7.2],Lo=[146,I-150],Ho=[66,45,30],ho=[.5,1],Oo=5,zs=14,qe=9.5,Ms=[9.3,10.6],bn=[1,2],Go=[5,7.4],Ko=[1.3,2],Ps=[],uo=[],be=[];{const t=ut("the near rock"),e="the near rock",s=new f.Vector3,o=(a,u)=>{const p=B.nearestXZ(a,u).u*I;let r=1e9;for(let w=p-4;w<=p+4;w+=.5)B.posAtDist(w,s),r=Math.min(r,Math.hypot(a-s.x,u-s.z));return r},n=[],c=et.filter(a=>!a.butter);for(const a of Eo){const u=a.g.attributes.iPos.array;for(let p=0;p<a.n;p++)n.push([u[p*4],u[p*4+2]])}const g=a=>a*1.2,m=[];for(const[a,u,p]of $t)if(c.some(r=>Math.hypot(r.x-a,r.z-u)<p&&r.y>R(a,u)+p)){let r=1e9;for(const w of O)Math.hypot(w.x-a,w.z-u)<p*2.3&&(r=Math.min(r,o(w.x,w.z)-g(w.r)));m.push([a,u,B.nearestXZ(a,u).u*I,r])}await z.yield();const y=a=>a.H*(a.butter?.35:.32),d=(a,u,p)=>!et.some(r=>Math.hypot(a-r.x,u-r.z)<Math.max(p,y(r)))&&!be.some(r=>Math.hypot(a-r.x,u-r.z)<Math.max(p,y(r))),i=(a,u,p)=>et.some(r=>Math.hypot(a-r.x,u-r.z)<p+.8)||be.some(r=>Math.hypot(a-r.x,u-r.z)<p+.8)||n.some(r=>Math.hypot(a-r[0],u-r[1])<p*.98)||O.some(r=>Math.hypot(a-r.x,u-r.z)<(r.r+p)*.8),h=(a,u,p)=>o(a,u)<qe+g(p)||xe(a,u,g(p))||Math.hypot(a-Et[0],u-Et[1])<16+p*1.6||Math.hypot(a-gt.x,u-gt.z)<9+p*1.6||Math.hypot(a-ro[0],u-ro[1])<10+p*1.6||Math.hypot(a-ge[0],u-ge[1])<12+p*1.6||Bo.some(([r])=>Math.hypot(a-r[0],u-r[1])<12+p*1.6)||n.some(r=>Math.hypot(a-r[0],u-r[1])<p*.98)||We.some(r=>Math.hypot(a-r[0],u-r[1])<7+p*1.6)||Math.hypot(a-F.uOrange.value.x,u-F.uOrange.value.y)<17+p*1.6||$t.some(r=>Math.hypot(a-r[0],u-r[1])<14+p+r[2])||Ps.some(r=>Math.hypot(a-r.x,u-r.z)<14+p+r.Rk)||O.some(r=>Math.hypot(a-r.x,u-r.z)<r.r+(r.r>1.5?p*1.5+2:p*1.2+.5))||Ct.some(r=>Math.hypot(a-r.x,u-r.z)<5+p*1.6)?!1:!et.some(r=>Math.hypot(a-r.x,u-r.z)<p*1.3+1.5)&&!be.some(r=>Math.hypot(a-r.x,u-r.z)<p*1.3+1.5),v=(a,u,p)=>{let r=R(a,u);for(let w=0;w<6.28;w+=.5236){const M=Math.cos(w)*g(p),C=Math.sin(w)*g(p);r=Math.min(r,R(a+M,u+C),R(a+M*.5,u+C*.5))}return r},x=(a,u,p,r,w)=>{const M=B.nearestXZ(a,u),C=M.u*I,V=v(a,u,r),b=t.range(0,6.2832),P=Math.cos(b),S=Math.sin(b),k=w||p<19?0:p<24?1:p<32?2:4,Q=w?bn:[0,0],q=C>I-160?we-1:Math.min(we-1,Math.floor((C+30+.5*M.dist)/Re)),j=(D,T)=>[a+(P*D-S*T)*r,u+(S*D+P*T)*r],J=t.range(.54,.68),lt=j(t.range(-.16,.16),t.range(-.16,.16)),Pt=t.range(.8,.9),it={x:a,y:V+r*.38,z:u,r,sy:Pt,sx:1,sz:1.06,detail:7-k,facets:4,tone:1,st:e,g:q,seat:V};uo.push(it,{x:lt[0],y:V+r*(.24+Pt),z:lt[1],r:r*J,sy:.78,detail:Math.max(2,5+Q[0]-k),facets:4,tone:1.06,st:e,g:q,on:it});const tt=t.int(3,4),mt=t.range(0,6.2832);for(let D=0;D<tt;D++){const T=[.56,.42,.3,.24][D]*t.range(.9,1.12),A=mt+D*6.2832/tt+t.range(-.45,.45),_=(.62+T)*t.range(1,1.16)+D*.15*t(),L=j(Math.cos(A)*_,Math.sin(A)*_),X=r*T;if(o(L[0],L[1])<qe+g(X)||xe(L[0],L[1],0)||i(L[0],L[1],X))continue;const rt=v(L[0],L[1],X);uo.push({x:L[0],y:rt+X*.4,z:L[1],r:X,sy:t.range(.74,.84),sx:1,sz:1.05,detail:Math.max(1,4+Q[1]-D-k),facets:3,tone:t.range(.9,1.1),st:e,g:q,seat:rt})}Ps.push({s:C,x:a,z:u,Rk:r,d:p}),m.push([a,u,C,p-g(r)]),pt.push([a,u,r*1.15,r*1.7,0]);const At=V+r*(.24+Pt)+r*J*.78*.7,Kt=w?t.range(Ms[0],Ms[1]):t.range(7.6,10.6);be.push({x:lt[0],y:At,z:lt[1],H:Kt,levels:w?5:p<20?4:3,hero:p<26,lean:.05,yaw:t.range(0,3),st:e,g:q,on:it}),pt.push([lt[0],lt[1],Kt*.32,At-V+Kt,1]);const It=(D,T)=>O.some(A=>Math.hypot(D-A.x,T-A.z)<A.r*.95+.6)||uo.some(A=>Math.hypot(D-A.x,T-A.z)<A.r*.95+.6);if(t()<.5){const D=t.range(0,6.2832),T=t.range(1.45,1.9),A=j(Math.cos(D)*T,Math.sin(D)*T);if(o(A[0],A[1])>=qe&&!It(A[0],A[1])&&!xe(A[0],A[1],0)&&d(A[0],A[1],Go[1]*.3)){const _=t.range(Go[0],Go[1]);be.push({x:A[0],y:R(A[0],A[1])-.15,z:A[1],H:_,levels:3,hero:o(A[0],A[1])<18,yaw:t.range(0,3),st:e,g:q}),pt.push([A[0],A[1],_*.3,_,1])}}for(let D=0,T=t.int(1,2),A=0;D<T&&A<12;A++){const _=t.range(0,6.28),L=r*t.range(1.12,1.7)+.6,X=a+Math.cos(_)*L,rt=u+Math.sin(_)*L;if(o(X,rt)<qe||It(X,rt)||xe(X,rt,0)||!d(X,rt,Ko[1]*.35))continue;const Nt=t.range(Ko[0],Ko[1]);be.push({x:X,y:R(X,rt)-.05,z:rt,H:Nt,levels:2,butter:!0,hero:!1,lean:t.range(0,.12),st:e,g:q}),D++,pt.push([X,rt,Nt*.35,Nt*.9,0])}},l=a=>(B.posAtDist(a,s),1-N(140,520,Math.hypot(s.x*.8,s.z)));for(let a=Lo[0];a<Lo[1];){const u=a<co?co:Lo[1],p=l(a),r=a<co?Ho[0]:Ho[1],w=r-(r-Ho[2])*p,M=m.filter(j=>j[3]<=zs&&j[2]>a+.01&&j[2]<u).map(j=>j[2]).sort((j,J)=>j-J)[0]??u;if(M-a<=w){a=M;continue}const C=t()<p,V=t(),b=t.sign(),P=t.range(qe,zs),S=a+w*ho[0],k=M-w*ho[0],Q=Math.min(k,a+w*t.range(ho[0],ho[1]));let q=null;for(const j of C?[!0,!1]:[!1]){const J=j?wt(bs[0],bs[1],V):wt(ws[0],ws[1],V),lt=P+g(J),Pt=it=>{for(const tt of[b,-b]){const[mt,At]=ae(it,tt*lt);if(h(mt,At,J)){q=[mt,At,it,lt,J,j];break}}};for(let it=Q;it<=k&&!q;it+=Oo)Pt(it);for(let it=Q-Oo;it>=S&&!q;it-=Oo)Pt(it);if(q)break}await z.yield(),q?(x(q[0],q[1],q[3],q[4],q[5]),a=q[2]):a=M}}await z.yield();const As=await Y.makeProps(uo,be);H.add(As);const Io=As.userData.groups;await z.yield();const Ss=1,ke=[400,25,25,1,.5];{const t=[],e=[],s=new f.Vector3,o=B.tangentAtDist(0,new f.Vector3),n=Math.hypot(o.x,o.z)||1,c=o.x/n,g=o.z/n;for(let m=0;m<I;m+=Ss)B.posAtDist(m,s),t.push(s.x,s.y,s.z);B.posAtDist(I,s),t.push(s.x,s.y,s.z),B.posAtDist(0,s);for(const m of[0,ke[0]])for(const y of[-1,1])for(const d of[-ke[2],ke[2]+ke[4]*m]){const i=y*(ke[1]+ke[3]*m);e.push(s.x-c*m-g*i,s.y+d,s.z-g*m+c*i)}await z.yield(),await Y.seenFrom(t.concat(e));for(const m of[ko,Io])for(let y=0;y<m.length;y++)for(const d of m[y]){if(d.geometry.attributes.aSway)continue;const i=y>=we-1?t.length:Math.min(t.length,3*(Math.ceil((y+1)*Re/Ss)+2));await Y.seenFrom(t.slice(0,i).concat(e),d.geometry)}}await z.yield();const Cs={value:1};{const t=Ne+`
attribute vec4 iBase; attribute float iKind;
uniform float uShAmt;
varying vec3 vQ; varying vec3 vP; varying float vS;
void main(){
  float hl = max(length(uSunDir.xz), 1e-3); vec2 sd = -uSunDir.xz / hl;
  // (vS: how much sun the thing stands in; out of it, under the lid, in the dusk shadow or by night, the strip draws in to a
  // soft patch of shade round the thing's foot)
  vS = uShAmt * sunLine(iBase.xy); float k = smoothstep(0., .25, vS);
  float L = min(iBase.w * hl / max(uSunDir.y, .03), iBase.w * 12.) * k;
  vec2 pxz = iBase.xy + sd * (position.y * (L + iBase.z * 1.2) - iBase.z * mix(.6, .25, k)) + vec2(-sd.y, sd.x) * position.x * iBase.z * mix(1.3, 1., k);
  vec3 P = vec3(pxz.x, groundH(pxz) + .05, pxz.y);
  vQ = vec3(position.xy, iKind); vP = P;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,e=`
uniform float uShAmt;
varying vec3 vQ; varying vec3 vP; varying float vS;
void main(){
  // a boulder or shrub throws a tapering tongue; a quiver tree a thin trunk line that swells into its crown
  float wv = mix(1. - .4 * vQ.y, mix(.14, 1., smoothstep(.4, .58, vQ.y)), step(.5, vQ.z));
  float a = (1. - smoothstep(wv * .5, wv, abs(vQ.x))) * (1. - smoothstep(.74, 1., vQ.y)) * smoothstep(0., .05, vQ.y);
  a *= uShAmt * sunLine(vP.xz) * (1. - .8 * cloudCov(vP.xz)) * (1. - .85 * isleAt(vP.xz));
  // out of the sun every thing still stands on a soft patch of its own shade (the sky's light is cut off under it)
  float k = clamp(vS * 4., 0., 1.);
  a = mix((1. - smoothstep(.12, 1., length(vec2(vQ.x, vQ.y * 2. - 1.)))) * .52 * (1. - .35 * uNite), a, k);
#ifdef USE_FOG
  a *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
#endif
  gl_FragColor = vec4(mix(vec3(1.), vec3(.33, .42, .64), a * .88), 1.);
}`,s=[],o=[],n=3;for(let i=0;i<=n;i++)s.push(-1,i/n,0,1,i/n,0);for(let i=0;i<n;i++)o.push(i*2,i*2+1,i*2+2,i*2+1,i*2+3,i*2+2);const c=new Float32Array(pt.length*4),g=new Float32Array(pt.length);pt.forEach((i,h)=>{c.set([i[0],i[1],i[2],i[3]],h*4),g[h]=i[4]});const m=new f.InstancedBufferGeometry;m.setAttribute("position",new f.Float32BufferAttribute(s,3)),m.setIndex(o),m.setAttribute("iBase",new f.InstancedBufferAttribute(c,4)),m.setAttribute("iKind",new f.InstancedBufferAttribute(g,1)),m.instanceCount=pt.length;const y=Y.makeMat({...F,uPl:Fe,uKop:De,uShAmt:Cs},t,e,{transparent:!0,depthWrite:!1,blending:f.CustomBlending,blendEquation:f.AddEquation,blendSrc:f.DstColorFactor,blendDst:f.ZeroFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),d=new f.Mesh(m,y);d.frustumCulled=!1,d.renderOrder=1,H.add(d)}await z.yield();const fo=new f.Group;let Te=null,je=null;{const t=B.pointAt(.5),e=B.tangentAt(.5),s=t.x+e.z*45,o=t.z-e.x*45,n=R(s,o),c=[],g=[],m=[],y=[],d=[],i=new f.Color(.42,.44,.46),h=new f.Color(.36,.22,.15),v=new f.Color(.46,.36,.3),x=new f.Vector3,l=new f.Vector3,a=new f.Vector3,u=new f.Vector3,p=new f.Vector3,r=(D,T,A,_,L)=>{x.set(D[0],D[1],D[2]),l.set(T[0],T[1],T[2]),p.copy(l).sub(x).normalize(),a.set(1,0,0),Math.abs(p.x)>.8&&a.set(0,0,1),a.addScaledVector(p,-a.dot(p)).normalize(),u.crossVectors(p,a);const X=(L?L.pos:c).length/3,rt=L?L.pos:c,Nt=L?L.nor:g,ce=L?L.col:m,ee=L?L.aT:y,$e=L?L.idx:d;for(const Rt of[x,l])for(let Lt=0;Lt<4;Lt++){const kt=Lt*Math.PI/2+.785,Zt=Math.cos(kt),Le=Math.sin(kt);rt.push(Rt.x+(a.x*Zt+u.x*Le)*A,Rt.y+(a.y*Zt+u.y*Le)*A,Rt.z+(a.z*Zt+u.z*Le)*A),Nt.push(a.x*Zt+u.x*Le,a.y*Zt+u.y*Le,a.z*Zt+u.z*Le);const ts=.8+.4*((Lt*7+X)%5)/5;ce.push(_.r*ts,_.g*ts,_.b*ts),ee.push(1)}for(let Rt=0;Rt<4;Rt++){const Lt=(Rt+1)%4;$e.push(X+Rt,X+Lt,X+4+Rt,X+Lt,X+4+Lt,X+4+Rt)}},w=8.6,M=1.35,C=.28,V=[[-1,-1],[1,-1],[1,1],[-1,1]],b=(D,T)=>{const A=wt(M,C,T);return[V[D][0]*A,T*w,V[D][1]*A]};for(let D=0;D<4;D++){r(b(D,0),b(D,1),.085,i);for(let T=0;T<4;T++){const A=T/4,_=(T+1)/4,L=(D+1)%4;r(b(D,_),b(L,_),.05,i),r(b(D,A),b(L,_),.045,T%2?h:i)}}r([0,w,0],[0,w+.55,0],.16,h),r([0,.2,0],[0,w,0],.04,h);const P=3.4,S=1.05,k=5.2,Q=22;for(let D=0;D<Q;D++){const T=D/Q*6.2832,A=(D+1)/Q*6.2832,_=c.length/3;for(const[L,X,rt]of[[T,P,0],[A,P,0],[T,P,S],[A,P,S],[T,P-.42,S],[A,P-.42,S],[T,P-.42,.5],[A,P-.42,.5]]){c.push(k+Math.cos(L)*X,rt,Math.sin(L)*X);const Nt=rt===S?1:0,ce=X<P?-1:1;g.push(Math.cos(L)*ce*(1-Nt*.6),Nt*.8,Math.sin(L)*ce*(1-Nt*.6));const ee=.7+.5*(D*13%7/7)*(rt>.3?1:.7);m.push(v.r*ee,v.g*ee,v.b*ee),y.push(rt>.3?1:.5)}d.push(_,_+2,_+1,_+1,_+2,_+3,_+2,_+4,_+3,_+3,_+4,_+5,_+4,_+6,_+5,_+5,_+6,_+7)}const q=D=>{const T=new f.InstancedBufferGeometry;return T.setAttribute("position",new f.Float32BufferAttribute(D.pos,3)),T.setAttribute("normal",new f.Float32BufferAttribute(D.nor,3)),T.setAttribute("color",new f.Float32BufferAttribute(D.col,3)),T.setAttribute("aT",new f.Float32BufferAttribute(D.aT.map(()=>0),1)),T.setIndex(D.idx),T},j=q({pos:c,nor:g,col:m,aT:y,idx:d});j.setAttribute("iPos",new f.InstancedBufferAttribute(new Float32Array([s,n,o,1]),4)),j.setAttribute("iRnd",new f.InstancedBufferAttribute(new Float32Array([0,.6,.35]),3)),j.instanceCount=1;const J=yn.replace("mix(.22, 1.05, vT)","1.").replace(" * (.55 + .9 * vn(vP.xz * 7.3 + vP.y * 9. + 4.))","").replace("mix(N, vec3(0., 1., 0.), .35)","N").replace(", .6);",", .15);"),lt=new f.Mesh(j,Y.makeMat(F,_o,J,{side:f.DoubleSide}));lt.frustumCulled=!1,H.add(lt);const Pt=`
varying vec3 vP, vN; varying vec2 vUv2;
uniform float uSpin;
void main(){
  float r = length(vUv2), a = atan(vUv2.y, vUv2.x + 1e-5);
  float blades = .62 + .38 * sin(a * 18. + uSpin) * (1. - smoothstep(.0, 1., fract(uSpin * .05)) * .3);
  float ring = smoothstep(.2, .26, r) * (1. - smoothstep(.94, 1., r));
  float rim = smoothstep(.9, .94, r) * (1. - smoothstep(.97, 1., r)) + (1. - smoothstep(.1, .14, r));
  float al = max(ring * blades * .78, rim);
  if (al < .04) discard;
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  vec3 col = shade(vec3(.5, .52, .55) * (.7 + .5 * blades), N, vP, .7) + uSunCol * sunLine(vP.xz) * .05 * blades;
  gl_FragColor = vec4(col, al);
#include <fog_fragment>
}`,it=`
varying vec3 vP, vN; varying vec2 vUv2;
void main(){ vUv2 = position.xy; vec4 wp = modelMatrix * vec4(position * vec3(1.55, 1.55, 1.), 1.); vP = wp.xyz; vN = normalize(mat3(modelMatrix) * vec3(0., .25, 1.));
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,tt={value:0};Te=new f.Mesh(new f.PlaneGeometry(2,2),Y.makeMat({...F,uSpin:tt},it,Pt,{side:f.DoubleSide,transparent:!0,depthWrite:!1})),Te.position.set(0,0,.55),Te.userData.spin=tt,Te.renderOrder=2;const mt={pos:[],nor:[],col:[],aT:[],idx:[]};r([0,0,.5],[0,0,-2.6],.05,i,mt);{const D=mt.pos.length/3;for(const T of[[0,.1,-1.9],[0,.75,-3.5],[0,-.75,-3.5],[0,-.1,-1.9]])mt.pos.push(T[0],T[1],T[2]),mt.nor.push(1,.2,0),mt.col.push(h.r*1.2,h.g*1.2,h.b*1.2),mt.aT.push(1);mt.idx.push(D,D+1,D+2,D,D+2,D+3)}const At=q(mt);At.setAttribute("iPos",new f.InstancedBufferAttribute(new Float32Array([0,0,0,1]),4)),At.setAttribute("iRnd",new f.InstancedBufferAttribute(new Float32Array([0,.6,.35]),3)),At.instanceCount=1;const Kt=_o.replace("vec3 P = iPos.xyz + q;","vec3 P = (modelMatrix * vec4(position, 1.)).xyz;").replace("vN = vec3(normal.x * c - normal.z * s, normal.y, normal.x * s + normal.z * c);","vN = mat3(modelMatrix) * normal;").replace("modelViewMatrix * vec4(P, 1.)","viewMatrix * vec4(P, 1.)"),It=new f.Mesh(At,Y.makeMat(F,Kt,J,{side:f.DoubleSide}));It.frustumCulled=!1,fo.add(Te,It),fo.position.set(s,n+w+.45,o),H.add(fo),je=new f.Mesh(new f.CircleGeometry(P-.3,20).rotateX(-Math.PI/2),new f.MeshBasicMaterial({color:"#6a88a8",fog:!0})),je.position.set(s+k,n+.82,o),H.add(je)}await z.yield();const Ns={value:new f.Vector4(0,-50,0,0)};let Qe=null;{const t=[],e=[],s=[],o=[],n=(y,d,i,h,v,x,l,a,u,p=Math.PI)=>{const r=t.length/3;for(let w=0;w<=a;w++){const M=w/a*p,C=Math.sin(M),V=Math.cos(M);for(let b=0;b<l;b++){const P=b/l*6.2832,S=Math.cos(P)*C,k=Math.sin(P)*C;t.push(y+S*h,d+V*v,i+k*x);const Q=1/Math.hypot(S/h,V/v,k/x);e.push(S/h*Q,V/v*Q,k/x*Q),s.push(u)}}for(let w=0;w<a;w++)for(let M=0;M<l;M++){const C=(M+1)%l,V=r+w*l+M,b=r+w*l+C,P=V+l,S=b+l;w>0&&o.push(V,b,S),o.push(V,S,P)}};n(0,.075,-.02,.27,.33,.39,12,5,0,Math.PI*.5),n(0,.17,.455,.05,.047,.115,6,4,1),[[-.2,.25],[.2,.25],[-.2,-.27],[.2,-.27]].forEach(([y,d],i)=>n(y,.085,d,.055,.09,.06,5,3,2+.25*[0,2,2,0][i]+.05));const c=new f.BufferGeometry;c.setAttribute("position",new f.Float32BufferAttribute(t,3)),c.setAttribute("normal",new f.Float32BufferAttribute(e,3)),c.setAttribute("aPart",new f.Float32BufferAttribute(s,1)),c.setIndex(o);const g=`
attribute float aPart; uniform vec4 uTort;
varying vec3 vP, vN, vL; varying float vPart;
void main(){
  vec3 q = position; float ph = fract(aPart) * 4.;
  if (aPart > 1.5) { float sw = sin(uTime * 23. + floor(ph) * 1.5708); q.z += sw * .075 * (1. - smoothstep(.02, .17, position.y)); q.y += max(sw, 0.) * .014 * (1. - smoothstep(.02, .17, position.y)); }
  else if (aPart > .5) { q.y += sin(uTime * 23.) * .006; q.x += sin(uTime * 11.5) * .008 * smoothstep(.36, .55, position.z); }
  q.y += .007 * sin(uTime * 46.);
  float c = cos(uTort.w), s = sin(uTort.w);
  vec3 P = uTort.xyz + vec3(q.x * c + q.z * s, q.y, -q.x * s + q.z * c);
  vN = vec3(normal.x * c + normal.z * s, normal.y, -normal.x * s + normal.z * c); vP = P; vL = position; vPart = aPart;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,m=`
varying vec3 vP, vN, vL; varying float vPart;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); vec3 alb;
  if (vPart < .5) {
    // scutes: polygonal plates seen from above, each pale with dark flecks toward its seams
    float jd = joints(vL.xz * vec2(6.4, 5.6) + 2.7);
    float seam = 1. - smoothstep(.03, .16, jd), fleck = smoothstep(.4, .56, vn(vL.xz * 41. + 3.) * .6 + vn(vL.zx * 17.) * .4) * (1. - smoothstep(.25, .75, jd));
    alb = mix(vec3(.4, .29, .11) * (.75 + .4 * vn(vL.xz * 9.)), vec3(.035, .028, .02), max(seam * .94, fleck * .85));
    alb *= mix(.45, 1., smoothstep(.07, .2, vL.y));
    N = normalize(N + vec3(vn(vL.xz * 30.) - .5, 0., vn(vL.xz * 30. + 5.) - .5) * .25);
  } else alb = vec3(.25, .21, .15) * (.55 + .7 * vn(vL.xy * 37. + vL.z * 29.)) * mix(.5, 1., smoothstep(.0, .12, vL.y));
  vec3 col = shade(alb, N, vP, .3);
  vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.)); float fr = 1. - clamp(dot(N, V), 0., 1.);
  col += uSkyCol * fr * fr * .05 + alb * uSunCol * sunLine(vP.xz) * pow(max(dot(reflect(-V, N), uSunDir), 0.), 12.) * .12 * step(vPart, .5);
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`;Qe=new f.Mesh(c,Y.makeMat({...F,uTort:Ns},g,m,{side:f.DoubleSide})),Qe.frustumCulled=!1,Qe.visible=!1,H.add(Qe)}const Fs=t=>F.uTrack.value.x-Math.pow(Math.max(t-180,0),2)/1520+(He(t*.021,7.3)-.5)*9+(He(t*.083,2.1)-.5)*2.2;await z.yield();const Ds=Pe.makeFauna(H,{light:Pe.lightFrom(H),rng:U.fork("fauna")}),Vs=U.fork("cast"),po=[],Bs=(t,e)=>(Ds.add(t,e),po.push(t),t),zn=t=>(H.add(t.object),po.push(t),t);{const t=B.posAtDist(ye),e=B.tangentAtDist(ye),s=[t.x-e.z*9,0,t.z+e.x*9],o=B.posAtDist(.84*I),n=s[0]-o.x,c=s[2]-o.z,g=Math.hypot(n,c)||1;F.uTongue.value.set(s[0]+n/g*13,s[2]+c/g*13,9.5,0)}const Mn=t=>{const e=new Pe.Geo,s=a=>new f.Color(a),o=s(t?"#0b0a0a":"#55463a"),n=s(t?"#060606":"#42372e"),c=s(t?"#e9e5da":"#7d6e5e"),g=s(t?"#b98f86":"#9a8a78"),m=s("#d8b070"),y=e.loft([{z:-.66,y:1.2,rx:0,ry:0},{z:-.52,y:1.3,rx:.2,ry:.22},{z:-.2,y:1.36,rx:.37,ry:.4},{z:.16,y:1.3,rx:.36,ry:.36},{z:.44,y:1.27,rx:.22,ry:.24},{z:.6,y:1.34,rx:0,ry:0}],{sides:10,top:o,belly:n});e.glow(y,1),e.fan([[0,1.5,-.42],[.3,1.42,-.86],[0,1.1,-1.02],[-.3,1.42,-.86]],c,c),e.fan([[0,1.56,-.5],[.16,1.66,-.9],[0,1.4,-1],[-.16,1.66,-.9]],c,c);for(const a of[-1,1])e.fan([[a*.37,1.5,.22],[a*.46,1.1,0],[a*.45,1.08,-.46],[a*.39,1.4,-.56]],o,o),e.fan([[a*.46,1.12,0],[a*.47,.94,-.12],[a*.45,.9,-.5],[a*.45,1.1,-.48]],c,c);for(const[a,u]of[[-1,0],[1,.5]]){const p=a*.17,r=1.12,w=e.tube([[p,r+.12,-.04],[p,.9,.08],[p,.62,-.13],[p,.34,-.07],[p,.07,-.03],[p,0,.14]],[.13,.115,.05,.036,.036,.03],6,g,g);e.anim(w,(M,C)=>[u,Math.min(1,Math.max(0,(r-C)/r)),1,0]),e.pivot(w,p,r,-.04)}const d=e.n,i=[0,1.42,.44],h=[],v=[];for(let a=0;a<=6;a++){const u=a/6;h.push([0,i[1]+u*.86,i[2]+.2*Math.sin(u*Math.PI)*(1-u*.4)+u*.12]),v.push(wt(.085,.04,Math.pow(u,.6)))}e.tube(h,v,6,g,g);const x=i[1]+.9,l=i[2]+.17;return e.blob(0,x,l,.06,.055,.1,g,null,6,3),e.tube([[0,x-.01,l+.08],[0,x-.035,l+.21]],[.035,0],4,m),e.anim([d,e.n],(a,u)=>[Math.min(1,Math.max(0,(u-i[1])/.9)),0,2,0]),e.pivot([d,e.n],0,i[1]-.1,i[2]),e.build()},Pn={h:1.36,bodyLen:.9,width:.52,depth:.5,coat:"#0d0c0c",belly:"#070707",legs:"#c9a49a",sock:"#c9a49a",accent:"#f2efe6",horn:"#000",pattern:"none",speed:5,stride:2.1,graze:0,count:1},An=.5,Sn=.86,Rs=(t,e,s,o,n)=>zn(Pe.makeHerd({rng:ut(n),geometry:Mn(t),preset:Pn,count:e,sizes:o,mode:"migrate",heightAt:R,swing:.6,fill:.3,rim:.45,spread:[1.5,e>1?5:.1],shadowSize:[.5,.7,0],along:{path:B,side:s,from:An,to:Sn,lead:0}})),ks=Rs(!0,1,-bo,[1.44],"the ostrich cock");await z.yield();const Ts=Rs(!1,to,-(bo+2.5),[.95,.9,.98],"the ostrich hens");await z.yield(),F.uTrack.value.set(2.3,96,330,1);const _s=(t,e,s)=>Pe.makeFlock({rng:s,species:"crows",count:e,size:.62,speed:8,flap:7.5,glide:.15,center:[t.x,t.y,t.z],radius:5.5,wobble:.5,spread:[3.2,2.4,6],wander:[2.2,1.6,2.2,1.3],body:"#5b4632",belly:"#d9c8a6",wingC:"#3c2e22",head:"#2a2019",tailC:"#3c2e22"}),Cn=2,Nn=.25,Fn=.125,zt=[],re=new f.Vector3;for(let t=0;t<B.length;t+=Nn)B.posAtDist(t,re),zt.push(re.x,re.y,re.z);B.posAtDist(B.length,re),zt.push(re.x,re.y,re.z);let vo=0;for(let t=3;t<zt.length;t+=3){const e=zt[t]-zt[t-3],s=zt[t+1]-zt[t-2],o=zt[t+2]-zt[t-1];vo=Math.max(vo,Math.sqrt(e*e+s*s+o*o))}const mo=(t,e,s,o,n,c)=>{const g=Math.max(Math.abs(t)-o,0),m=Math.max(Math.abs(e)-n,0),y=Math.max(Math.abs(s)-c,0);return Math.sqrt(g*g+m*m+y*y)};await z.yield();const Es=(t,e)=>{const s=Vs.fork("weav"+e),o=[];let n=_s(t,e,()=>{const A=s();return o.push(A),A});const c=n.route.data,g=n.route.N,m=n.geometry.attributes.iA.array,y=n.geometry.attributes.iB.array,d=n.uniforms.uWander.value,i=(1+.5)*d.x,h=d.y,v=d.z;let x=0;for(let A=0;A<g;A++){const _=(A+1)%g,L=c[_*4]-c[A*4],X=c[_*4+1]-c[A*4+1],rt=c[_*4+2]-c[A*4+2];x=Math.max(x,Math.sqrt(L*L+X*X+rt*rt))}const l=Pe.BIRD_PRESETS.crows,a=[];let u=0,p=0,r=0,w=0;for(let A=0;A<n.count;A++)a.push((l.len+l.span)*y[A*4]+x*2/3+Cn+vo/2),u=Math.max(u,Math.abs(m[A*4])),p=Math.max(p,Math.abs(m[A*4+1])),r=Math.max(r,Math.abs(y[A*4+3])),w=Math.max(w,a[A]);let M=1/0,C=1/0,V=1/0,b=-1/0,P=-1/0,S=-1/0;for(let A=0;A<g;A++)M=Math.min(M,c[A*4]),b=Math.max(b,c[A*4]),C=Math.min(C,c[A*4+1]),P=Math.max(P,c[A*4+1]),V=Math.min(V,c[A*4+2]),S=Math.max(S,c[A*4+2]);const k=(M+b)/2,Q=(C+P)/2,q=(V+S)/2,j=(b-M)/2,J=(P-C)/2,lt=(S-V)/2;let Pt=1/0,it=0;for(let A=0;A<zt.length;A+=3){const _=zt[A]-t.x,L=zt[A+1]-t.y,X=zt[A+2]-t.z,rt=_*_+L*L+X*X;rt<Pt&&(Pt=rt,it=A)}const tt=t.x-zt[it],mt=t.z-zt[it+2],At=Math.sqrt(tt*tt+mt*mt),Kt=tt/At,It=mt/At;let D=0,T=!1;for(;!T;){T=!0;let A=0;for(;A<zt.length;){const _=zt[A],L=zt[A+1],X=zt[A+2],rt=mo(_-Kt*D-k,L-Q,X-It*D-q,j+i+u,J+h+p,lt+v+r)-w;if(rt>=0){A+=3*(1+Math.floor(rt/vo));continue}let Nt=0;for(;Nt<g;){const ce=_-c[Nt*4],ee=L-c[Nt*4+1],$e=X-c[Nt*4+2],Rt=mo(ce-Kt*D,ee,$e-It*D,i+u,h+p,v+r)-w;if(Rt>=0){Nt+=1+Math.floor(Rt/x);continue}let Lt=1/0;for(let kt=0;kt<n.count;kt++){let Zt=mo(ce-Kt*D-m[kt*4],ee-m[kt*4+1],$e-It*D-y[kt*4+3],i,h,v);for(;Zt<a[kt];)D+=Fn,T=!1,Zt=mo(ce-Kt*D-m[kt*4],ee-m[kt*4+1],$e-It*D-y[kt*4+3],i,h,v);Lt=Math.min(Lt,Zt-a[kt])}Nt+=1+Math.floor(Lt/x)}A+=3}}if(D>0){let A=0;n=_s(new f.Vector3(t.x+Kt*D,t.y,t.z+It*D),e,()=>o[A++])}return Bs(n,{always:!0})};Es(new f.Vector3(To.x+no.z*2,To.y+.6,To.z-no.x*2),44),await z.yield();const Ls=de.nestTree?Es(new f.Vector3(de.nestTree.x*1.25,de.nestTree.y+1.2,de.nestTree.z-2),40):null;await z.yield();const Dn=Bs(Pe.makeFlock({rng:Vs.fork("eagle"),species:"eagles",count:2,size:2.6,center:[4,74,-8],radius:62,soarRadius:44,soarLift:7,body:"#12100f",belly:"#12100f",wingC:"#171412",tip:"#0b0a09",tailC:"#12100f",head:"#12100f"}),{always:!0});await z.yield();const _e=Ct.length+so,Vn=4.6,Bn=7.5,Ee=new Float32Array(_e*4),le=new Float32Array(_e*4),Wo=new Float32Array(_e*2),Hs=[];let Ue=null,Ze=null;const qo=[];{const t=ut("the herd"),e=i0(),s=new f.BufferGeometry;s.setAttribute("position",new f.Float32BufferAttribute(e.pos,3)),s.setIndex(e.idx),s.computeVertexNormals();const o=new f.InstancedBufferGeometry;o.setAttribute("position",s.attributes.position),o.setAttribute("normal",s.attributes.normal),o.setIndex(s.index),o.setAttribute("aP",new f.Float32BufferAttribute(e.aP,4)),o.setAttribute("aPiv",new f.Float32BufferAttribute(e.piv,4)),Ct.forEach((v,x)=>{Ee.set([v.x,v.y,v.z,v.th],x*4),le.set([v.g,0,0,0],x*4),Wo.set([v.h,v.yw],x*2)});for(let v=0;v<so;v++){const x=Ct.length+v,l=[[0,-1.6,1.1],[1.6,1.7,1.03],[3.2,-.2,1.07]][v],a=l?{h:t(),dd:l[0],dl:l[1],sc:l[2],g:0}:{h:t(),dd:v*Vn+(t()-.5)*2.2,dl:(t()-.5)*5,sc:.9+.22*t(),g:t()<.2?.25:0};Hs.push(a),Wo.set([a.h,(t()-.5)*.5],x*2)}Ue=new f.InstancedBufferAttribute(Ee,4),Ze=new f.InstancedBufferAttribute(le,4),Ue.setUsage(f.DynamicDrawUsage),Ze.setUsage(f.DynamicDrawUsage),o.setAttribute("iPos",Ue),o.setAttribute("iPose",Ze),o.setAttribute("iRnd",new f.InstancedBufferAttribute(Wo,2)),o.instanceCount=_e,qo.push(o);const n=new f.Mesh(o,Y.makeMat(F,r0,l0,{side:f.DoubleSide}));n.frustumCulled=!1,H.add(n);const c=Ne+`
attribute vec4 iPos, iPose;
varying vec2 vQ; varying vec3 vP; varying float vL;
void main(){
  float hl = max(length(uSunDir.xz), 1e-3); vec2 sd = -uSunDir.xz / hl; float s = iPose.w;
  float L = min(1.3 * s * hl / max(uSunDir.y, .05), 15. * s) * smoothstep(.0, .08, uSunDir.y);
  vec2 fw = vec2(sin(iPos.w), cos(iPos.w));
  float wd = (.3 + .55 * abs(dot(fw, vec2(-sd.y, sd.x)))) * s;
  vec2 pxz = iPos.xz + sd * (position.y * (L + 1.1 * s) - .55 * s) + vec2(-sd.y, sd.x) * position.x * wd * 1.5;
  vec3 P = vec3(pxz.x, groundH(pxz) + .06, pxz.y);
  vQ = position.xy; vP = P; vL = L / max(s, 1e-3);
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,g=`
varying vec2 vQ; varying vec3 vP; varying float vL;
void main(){
  float a = (1. - smoothstep(.35, 1., abs(vQ.x))) * smoothstep(0., .08, vQ.y) * (1. - smoothstep(.6, 1., vQ.y));
  float sunny = sunLine(vP.xz) * (1. - .8 * cloudCov(vP.xz));
  a *= mix(.34 * (1. - smoothstep(.0, 1.6 / (vL + 1.1), vQ.y)), .8, sunny * smoothstep(.02, .12, uSunDir.y)) * (1. - .5 * uNite);
#ifdef USE_FOG
  a *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
#endif
  gl_FragColor = vec4(mix(vec3(1.), vec3(.3, .38, .6), a), 1.);
}`,m=[],y=[],d=3;for(let v=0;v<=d;v++)m.push(-1,v/d,0,1,v/d,0);for(let v=0;v<d;v++)y.push(v*2,v*2+1,v*2+2,v*2+1,v*2+3,v*2+2);const i=new f.InstancedBufferGeometry;i.setAttribute("position",new f.Float32BufferAttribute(m,3)),i.setIndex(y),i.setAttribute("iPos",Ue),i.setAttribute("iPose",Ze),i.instanceCount=_e,qo.push(i);const h=new f.Mesh(i,Y.makeMat({...F,uPl:Fe,uKop:De},c,g,{transparent:!0,depthWrite:!1,blending:f.CustomBlending,blendEquation:f.AddEquation,blendSrc:f.DstColorFactor,blendDst:f.ZeroFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));h.frustumCulled=!1,h.renderOrder=1,H.add(h)}const Xe=[0,0],jo=[0,0],Qo=Ct.find(t=>t.pan)||null,Rn=(E[2][1]+E[3][0])/2,Os=(E[3][1]+E[4][0])/2,kn=(E[4][1]+E[5][0])/2,Tn=(t,e)=>{const s=t*I,o=t>.728?e:Math.floor(e*3+1e-4)/3;let n=0;for(let y=0;y<Ct.length;y++){const d=Ct[y],i=y*4,h=Math.max(0,Math.sin(o*(.5+.5*d.h)+d.h*40));le[i]=d.g?1-.3*h*h:.1*h,le[i+3]=d.sd>s-26?d.sc:0,d.sd>s-26&&(n=y+1)}Qo&&(F.uBull.value.x=Qo.sd>s-26?Qo.x:9e3);const c=t>=Rn&&t<Os,g=Math.floor(t*120+.5),m=(g-Math.floor(.55*120+.5))*Bn+4;for(let y=0;y<so;y++){const d=Hs[y],i=(Ct.length+y)*4,h=m+d.dd;Do(h,Xe),Do(h+2.5,jo);const v=jo[0]-Xe[0],x=jo[1]-Xe[1],l=Math.hypot(v,x)||1,a=Xe[0]+x/l*d.dl,u=Xe[1]-v/l*d.dl;Ee[i]=a,Ee[i+1]=R(a,u),Ee[i+2]=u,Ee[i+3]=Math.atan2(v,x),le[i]=d.g,le[i+1]=Xt(d.h*7.3+g*.37),le[i+2]=1,le[i+3]=c?d.sc:0}for(const y of qo)y.instanceCount=c?_e:n;Ue.needsUpdate=!0,Ze.needsUpdate=!0};await z.yield();const Uo={value:0},yo=es.fxGroup();H.add(yo.object);const Zo=yo.add(es.makeParticles({rng:U.fork("rain"),preset:"rain",time:Uo,count:Math.round(3200*K),box:[46,30,46],colors:["#ffd9a8","#cfd8e6","#ffe9c8"],intensity:.9})),Xo=yo.add(es.makeParticles({rng:U.fork("beetle"),preset:"dust",time:Uo,follow:"xz",center:[0,1,0],count:Math.round(1500*K),box:[42,1.5,42],size:[.022,.055],colors:["#ffd76a","#b6f06a","#ff9a3c"],twinkle:1,intensity:2.2}));Zo.setOpacity(0),Xo.setOpacity(0);const at=(t,e,s)=>new f.Color(t,e,s),st={zenDay:at(.055,.19,.53),zenNight:at(.016,.034,.1),zenStorm:at(.06,.07,.15),zenGold:at(.15,.25,.52),horGold:at(.95,.63,.37),zenBerg:at(.2,.3,.5),horDay:at(.56,.68,.78),horDusk:at(.86,.47,.25),horNight:at(.05,.09,.2),horBerg:at(.8,.6,.42),nightKey:at(.32,.5,1),cream:at(1,.93,.8),amber:at(1,.6,.3),fillDay:at(.62,.74,.9),fillNight:at(.3,.5,1.05),fillDusk:at(.62,.48,.66),gndDay:at(.2,.16,.13),gndNight:at(.14,.2,.4),cloudNight:at(.05,.07,.13),cloudShDay:at(.42,.47,.6),cloudShNight:at(.02,.03,.07),rose:at(.86,.56,.6),lidFog:at(.36,.39,.45),lidBank:nt==="berg"?at(.3,.25,.22):at(.2,.18,.25),mtnDay:at(.3,.42,.6),mtnNight:at(.03,.045,.09)},_n=[[0,0],[E[1][0],.03],[E[1][1],.46],[.37,.82],[.468,.88],[.482,.93],[.575,.95],[.59,.98],[.708,.99],[.728,1]],En=[[.36,.5],[.468,.64],[.482,.82],[.575,.88],[.59,.96],[.708,.97],[.728,1]],Ln=[[0,1],[.085,.72],[.125,.68],[.17,.4],[.26,.06],[.3,0]],Hn=[[0,1],[.06,.62],[.1,.56],[.125,.46],[.15,0]],On=[[0,1],[.1,.75],[.125,.59],[.153,.2],[.2,0]],Gn=[[0,1],[.09,.75],[.125,.42],[.153,0]],Kn=[[0,1],[.172,1],[.215,.4],[.26,0]],go=new f.Vector3,ze=new f.Vector3,Ye=new f.Vector3,Vt=new f.Vector3,Mt=new f.Color,Me=new f.Color,te=new f.Color,xo=new f.Color,Yo=new f.Color;for(const t of po)t._dot=null;Dn._dot=0,Ls&&(Ls._dot=0);const In=new f.Vector3,Wn=new f.Vector3,qn=Math.atan2(-se.x,-se.y),jn=eo.clone(),Gs=(t,e)=>{let s=0,o=-1;for(let b=0;b<6;b++)if(t>=E[b][0]&&t<E[b][1]){o=b;const P=(t-E[b][0])/(E[b][1]-E[b][0]);if(b>=2&&b<=4){const S=2*P-1;s=84*(.3*S+.7*S*S*S)}else s=wt(E[b][2],E[b][3],P)}if(o<0){for(let b=0;b<5;b++)if(t>=E[b][1]&&t<E[b+1][0]){const P=E[b+1][0]-E[b][1],S=(t-E[b][1])/P,k=b<2?30:1.2;s=S<.5?wt(E[b][3],E[b][3]+k,S*2):wt(-(84+k),E[b+1][2],(S-.5)*2)}}o0(s,go);const n=Math.asin(Tt(go.y,-1,1))/Ft,c=N(.708,.728,t),g=t>=.708,m=N(-7,7,n),y=N(-4,6,n),d=1.6*(1-N(-5,3,n)),i=he(t,On);F.uNite.value=1-N(-10,-3,n),F.uPan.value.z=he(t,Kn);let h=1-N(3,26,n);nt==="golden"&&(h=Math.max(h,.7*c));const v=nt==="berg"?c:0,x=nt==="golden"?c:0;xo.copy(st.zenNight).lerp(Mt.copy(st.zenDay).lerp(st.zenStorm,i*.8).lerp(st.zenBerg,v*.8).lerp(st.zenGold,x*.7),m),te.copy(st.horNight).lerp(Mt.copy(st.horDay).lerp(st.horBerg,v).lerp(st.horDusk,h*.8*(1-x)).lerp(st.horGold,x*.85),m),te.lerp(Mt.setRGB(.2,.17,.26),i*.42*m),Me.copy(st.cream).lerp(st.amber,h*.92),ze.copy(go),ze.y<.05&&(ze.y=.05,ze.normalize());const l=3.15*y*(1-v*.12),a=d/(l+d+1e-4);ze.lerp(jn,a).normalize(),jt.position.copy(ze).multiplyScalar(200),jt.target.position.set(0,0,0),jt.target.updateMatrixWorld(),jt.updateMatrixWorld(),jt.color.copy(Me).lerp(st.nightKey,a),jt.intensity=l+d;const u=(1-N(1,11,n))*N(-13,-5,n);ve.color.copy(st.fillNight).lerp(Mt.copy(st.fillDay).lerp(st.fillDusk,h*.45).lerp(st.horBerg,v*.35),m).lerp(st.rose,.4*u),ve.intensity=(1-i*.18*m+.42*u)*(1-.5*F.uNite.value),ve.groundColor.copy(st.gndNight).lerp(st.gndDay,m),B.pointAt(t,Ye),B.tangentAt(t,Vt);const p=Ye.x*Ce.x+Ye.z*Ce.z;let r=5e3,w=s<0?N(11,21,n):N(8,18,n);g?(r=$s(t),w=1):s>0&&(r=p+wt(1700,-600,N(o===0?71:o===1?67:56,79,s))+9e3*N(-.5,-3.5,n)),F.uTune.value.set(wt(20,1.5,c),wt(.3,nt==="fog"?1:.85,c),wt(.35,.7,c)),Y.setFront(r),Y.setOpen(w),Y.setGrowth(he(t,_n)),F.uFrac.value=he(t,En),F.uWet.value=he(t,Ln),F.uRain.value=he(t,Hn);const M=nt==="fog"?c*(1-N(-20,70,r-p)):0;F.uCloud.value.set(se.x*e*42,se.y*e*42,.78*y*(1-i*.5)*(g?.45*N(.83,.9,t):1),0);{const b=.4*I+152+(t-.4)*I*.55,P=B.posAtDist(b,In),S=B.tangentAtDist(b,Wn),k=Math.max(1e-4,Math.hypot(S.x,S.z));F.uCb.value.set(P.x,P.z,520,.8*y*N(.36,.385,t)*(1-N(.45,.472,t)));{const Q=-S.z/k,q=S.x/k,j=S.x/k,J=S.z/k;F.uCbAx.value.set(Q*.92-j*.39,q*.92-J*.39,5.2,0)}}if(Se){const b=30-(t-.81)*I*2.3,P=Math.max(1e-4,Math.hypot(Vt.x,Vt.z));F.uIsle.value.set(Ye.x+Vt.x/P*b,Ye.z+Vt.z/P*b,21,N(.772,.794,t)*(1-N(.862,.886,t))),F.uIsleAx.value.set(Vt.x/P,Vt.z/P,.26,8)}const C=c*(1-.35*N(.84,.97,t));Mt.copy(te).lerp(Me,.5).multiplyScalar(1.2*(.25+.75*m)),F.uBand.value.set(Mt.r,Mt.g,Mt.b,C),Yo.copy(te).multiplyScalar(.9).lerp(xo,.12).lerp(Mt.multiplyScalar(.58),M*.85),Co.color.copy(Yo),Co.density=(75e-5+i*7e-4*m+M*5e-4+v*6e-4)*(1-.45*F.uNite.value),W.uMtA.value=1-.3*M,W.uZen.value.copy(xo),W.uHor.value.copy(te),W.uFogC.value.copy(Yo),W.uSunD.value.copy(go),W.uSunE.value.copy(Me).multiplyScalar(26*N(-1.2,1.5,n)),W.uGlow.value.copy(Me).multiplyScalar((.22+.78*h)*N(-15,-3,n)*.85*(1+1.1*(1-N(-3,1,n))*N(-13,-5,n))),W.uCloudCol.value.copy(st.cloudNight).lerp(Mt.copy(Me).multiplyScalar(.92-i*.56),m),W.uCloudSh.value.copy(st.cloudShNight).lerp(Mt.copy(st.cloudShDay).multiplyScalar(1-i*.8).lerp(st.amber,h*.16*(1-i*.6)),m);const V=t>=E[3][0]&&t<E[3][1]?1:t>=E[4][0]&&t<E[4][1]?-1:0;V>0&&W.uZen.value.lerp(Mt.setRGB(.03,.14,.5),.5*m),W.uCloudP.value.set(ls.x-e*.2,ls.y+e*.02,.5-i*.17+(g?.07:0)-v*.05+(V>0?.11:V<0?-.055:0),1),W.uVeil.value.z=he(t,Gn)*m*.92,W.uVeilCol.value.copy(Me).multiplyScalar(.7+.8*y).lerp(te,.18),W.uMtn.value.copy(st.mtnNight).lerp(st.mtnDay,m).lerp(Mt.setRGB(.3,.29,.44).multiplyScalar(.2+.8*m).lerp(te,.45),Math.min(.8,.7*i+.5*h)),W.uNight.value=(1-m)*N(-7,-13,n),W.uStarRot.value=t*9.5,W.uBelt.value.w=(1-N(1.5,13,n))*N(-13,-2.5,n)*(1-i),W.uLid.value.set(C,nt==="fog"?46:50,nt==="fog"?1.5:1.3,nt==="fog"?.0012:9e-4),W.uLidCol.value.copy(nt==="fog"?st.lidFog:st.lidBank).multiplyScalar(.25+.75*m),F.uSkyRef.value.copy(te).lerp(xo,.45).add(Mt.copy(W.uGlow.value).multiplyScalar(.3)).lerp(W.uVeilCol.value,.3*W.uVeil.value.z),F.uSkyRef.value.add(Mt.setRGB(.42,.2,.25).multiplyScalar(.7*W.uBelt.value.w)).add(Mt.setRGB(.1,.15,.3).multiplyScalar(F.uNite.value)),F.uGlowRef.value.copy(W.uGlow.value).multiplyScalar(1.7).lerp(Mt.copy(te).multiplyScalar(1.3),.3),F.uVeilM.value.set(W.uVeil.value.x,W.uVeil.value.y,W.uVeil.value.z,0),F.uVeilC.value.copy(W.uVeilCol.value),Cs.value=y,je&&je.material.color.copy(F.uSkyRef.value).multiplyScalar(.75);for(const b of po){const P=b.uniforms,S=b._dot==null?g?N(-10,10,r-p):1:N(-10,10,r-b._dot);P.uSunDir.value.copy(ze),P.uSunColor.value.copy(jt.color).multiplyScalar(jt.intensity*.52*(.12+.88*S)),P.uSkyColor.value.copy(ve.color).multiplyScalar(ve.intensity*.75),P.uGroundColor.value.copy(ve.groundColor).multiplyScalar(1)}return{open:w,sunK:y,front:r,cd:p}};Gs(0,0);const Qn=new f.Vector3().copy(os).multiplyScalar(Math.cos(13*Ft)).addScaledVector(wo,Math.sin(13*Ft)),Jo=new f.Vector3,Bt=new f.Vector3,Ks=(t,e)=>(B.pointAt(e,Jo),Jo.y+=30,Jo.addScaledVector(Qn,900)),Je=new f.Vector3,$o=new f.Vector3,Un=(t,e)=>(B.posAtDist(e*I+34,$o),$o.y+=24,$o),Zn=(t,e)=>{const s=e*I+46;return B.posAtDist(s,Je),Je.y=R(Je.x,Je.z)-1.5,Je};return{scene:H,path:B,duration:Is,pace:t=>1-.1*(1-N(.085,.12,t))+.3*N(.17,.205,t)*(1-N(.285,.32,t))-.26*N(.69,.735,t)*(1-N(.86,.9,t)),camera:{fov:62,near:.3,far:5200,lookAhead:34,sway:.45,bank:.35},pois:[{at:new f.Vector3($.x,$.y+16,$.z),from:0,to:.1,fade:.25,weight:.34},{at:Ks,from:.07,to:.15,weight:.24},{at:Ks,from:.215,to:.345,weight:.42},{at:new f.Vector3(0,25,0),from:.315,to:.52,weight:.5},{at:new f.Vector3(0,25,0),from:.36,to:.9,weight:.62},{at:Zn,from:.468,to:.585,weight:.72},{at:Un,from:.385,to:.468,weight:.26}],portal:{shape:"circle",radius:de.portalSeat.radius||7,color:"#fff0c8",glow:1.1,revealDistance:340,tilt:!0},post:{exposure:1,bloom:{strength:.3,radius:.6,threshold:.95},grade:{saturation:1.1,contrast:1.05,tint:"#fffaf2",shadowTint:"#070a16",vignette:.3,grain:.02,aberration:0}},ride:"none",heightAt:R,update(t,e,s,o){Uo.value=e;const n=Gs(o,e);Bt.setFromMatrixPosition(s.matrixWorld),oo.position.copy(Bt);const c=1+.14*Tt(Bt.y-R(Bt.x,Bt.z)-2.2,0,4),g=N(.735,.762,o)*(1-N(.8,.83,o));for(const i of Ve)i.uWin.value.set(Bt.x+Vt.x*i.lead,Bt.z+Vt.z*i.lead,i.uWin.value.z,i.uWin.value.w),i.uHead.value=i.head*c;ct.uWin.value.set(Bt.x+Vt.x*(8.5+1.5*g),Bt.z+Vt.z*(8.5+1.5*g),20,1/20),ct.uLensK.value=1+.3*g,ct.mesh.visible=ct.shade.visible=o>.15&&o<.93,ct.mesh.geometry.instanceCount=ct.shade.geometry.instanceCount=o<.336?ct.n0:ct.n,F.uReal.value.x=N(.3,.36,o)*(1-N(.875,.9,o)),Qt.uWin.value.set(Bt.x+Vt.x*7,Bt.z+Vt.z*7,18,1/18),Qt.uFly.value=n.open*n.sunK*N(.37,.4,o)*N(-25,15,n.front-n.cd),Qt.mesh.visible=Qt.uFly.value>.02;for(const i of Ve)i.mesh.visible=o>.285;for(const i of Ve)i.mesh.geometry.instanceCount=an(i.draws,F.uFrac.value);Mo.mid.visible=o>.75,Mo.near.visible=!1;for(const i of Mo.cush)i.visible=o>.838;for(let i=0;i<ko.length;i++){const h=i>=we-1||o*I<(i+1)*Re;for(const v of ko[i])v.visible=h}for(let i=0;i<Io.length;i++){const h=i>=we-1||o*I<(i+1)*Re;for(const v of Io[i])v.visible=h}{const i=o*I-30;for(const h of Eo){const v=h.sA[0]>=i&&h.sA[h.n-1]<i+30+wn;if(h.m.visible=v,!v)continue;let x=0,l=h.n;for(;x<l;){const a=x+l>>1;h.sA[a]>=i?x=a+1:l=a}h.g.instanceCount=x}}Y.update(t,e,s);const m=Math.floor(e*3+1e-4)/3;Tn(o,e);const y=Math.floor(o*240+1e-4)/240,d=hn(y);ks.object.visible=Ts.object.visible=o>Os&&o<kn,ks.update(t,m,s,d),Ts.update(t,m,s,d+3.5/I),Ds.update(t,e,s,o),Zo.setOpacity(F.uRain.value*.85),Zo.object.visible=F.uRain.value>.004,Xo.setOpacity(n.open*n.sunK*F.uFrac.value*(o>.36?.9:0)*N(-25,15,n.front-n.cd)),Xo.uniforms.uCenter.value.y=R(Bt.x+Vt.x*12,Bt.z+Vt.z*12)+.95,yo.update(t,e,s);{const i=o>.775&&o<.868,h=161.7-(Tt(o,.77,.87)-.84)*I*.2,v=Fs(h),x=R(v,h);Qe.visible=i,Ns.value.set(v,x-.012,h,Math.atan2(Fs(h-.6)-v,-.6)),i?F.uCast.value[9].set(v,x+.17,h,.33):F.uCast.value[9].copy(mn)}fo.rotation.y=qn+.45*Math.sin(e*.9)+.18*Math.sin(e*2.7+1),Te.userData.spin.value=e*37},dispose(){Y.dispose()}}}};export{f0 as default};
