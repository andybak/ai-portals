import*as i from"three";import{clamp as ot,lerp as J,smoothstep as $,makePath as fe}from"../kit/core.js";const St=["#121833","#26407F","#8FB0D6","#6E4425","#EFE3C6","#B3362B","#E3A72A"],he=["#121833","#1B2A57","#26407F","#3560A6","#5C87C4","#8FB0D6","#C3D6E6"],Kt=.86,wt=36,Rt=(t,r,d)=>"#"+new i.Color(t).lerp(new i.Color(r),d).getHexString(),ut=(t,r=Kt)=>{const d=new i.Color(t),u=new i.Vector3(d.r*r,d.g*r,d.b*r),c=.04*Math.pow(1-Math.min(1,Math.max(u.x,u.y,u.z)*4),3);return u.x+=c*.5,u.y+=c*.7,u.z+=c*1.7,u};function Yt(t=St,r="day"){const d=St.map((C,z)=>t&&t[z]||C),c=d[0].toLowerCase()===St[0].toLowerCase()&&d[1].toLowerCase()===St[1].toLowerCase()&&d[2].toLowerCase()===St[2].toLowerCase()?he.slice():[d[0],Rt(d[0],d[1],.5),d[1],Rt(d[1],d[2],.33),Rt(d[1],d[2],.66),d[2],Rt(d[2],d[4],.55)];let p=d[4],R=d[4],o=null;return r==="golden"?p="#8A2A24":r==="night"?p="#0E1226":r==="dawn"&&(p="#CFE0CF",o="#D9A5A0"),c.push(R),{colourway:r,hex:{ramp:c,cloth:p,line:R,soga:d[3],madder:d[5],gold:d[6],wax:"#C8923A",overdye:"#1E1A24",haze:o},ramp:c.map(C=>ut(C)),cloth:ut(p,r==="golden"?.7:Kt),line:ut(R),soga:ut(d[3]),madder:ut(d[5]),gold:ut(d[6],1),wax:ut("#C8923A"),overdye:ut("#1E1A24"),haze:ut(o||p)}}function $t(t){return{uRamp:{value:t.ramp},uCloth:{value:t.cloth},uLine:{value:t.line},uWax:{value:t.wax},uGold:{value:t.gold},uSoga:{value:t.soga},uOverdye:{value:t.overdye},uTime:{value:0},uU:{value:0},uDur:{value:wt},uFlash:{value:new i.Vector4(0,0,0,0)},uPrada:{value:new i.Vector4(0,0,0,0)},uFadeMax:{value:3e-4}}}const Pt=`
uniform vec3 uRamp[8]; uniform vec3 uCloth, uLine, uWax, uGold, uSoga, uOverdye;
uniform float uTime, uFadeMax; uniform vec4 uFlash, uPrada;
vec3 bkHash3(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.xxy+p.yxx)*p.zyx); }
vec2 bkVor(vec3 x){
  vec3 n=floor(x), f=fract(x), r1=vec3(8.), r2=vec3(8.), c1=vec3(0.); float d1=64., d2=64.;
  for(int k=-1;k<=1;k++) for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
    vec3 g=vec3(float(i),float(j),float(k)); vec3 r=g+bkHash3(n+g)-f; float d=dot(r,r);
    if(d<d1){ d2=d1; r2=r1; d1=d; r1=r; c1=n+g; } else if(d<d2){ d2=d; r2=r; } }
  vec3 dr=r2-r1; float e=dot(.5*(r1+r2), dr/max(length(dr),1e-4));
  return vec2(max(e,0.), bkHash3(c1+3.7).x); }
float bkVeinAt(vec3 P, float size, float px, out vec2 v){
  v=bkVor(P/size+vec3(7.3,1.9,4.1)); float hw=max(.0065*size, .8*px);
  return (1.-smoothstep(hw, hw+max(px,.02*hw), v.x*size))*(1.-smoothstep(.03*size,.09*size,px)); }
float bkVeins(vec3 P, float px, float floodSize, out float vd, out float ch){
  vec2 v; float m=bkVeinAt(P,70.,px,v); vd=clamp(v.x*2.6,0.,1.); ch=v.y;
  if(px<1.26 || floodSize<40.){ float m2=bkVeinAt(P,14.,px,v); m=max(m,m2*.9); if(floodSize<40.){ vd=clamp(v.x*2.6,0.,1.); ch=v.y; } }
  if(px<.27){ m=max(m,bkVeinAt(P,3.,px,v)*.75); }
  return m; }
vec2 bkLine(float edge, float capW, float arcM, float pxE){
  float ls=max(capW*.085, .3)/.3;
  float lw=(.3+.05*(sin(arcM*.7/ls)+.6*sin(arcM*1.93/ls+1.7)))*ls;
  float lwp=max(lw, 1.1*pxE), aa=max(pxE, .1*ls);
  float line=1.-smoothstep(lwp-.5*aa, lwp+.5*aa, edge);
  line=mix(line, min(.11, lw/max(capW,1e-3)), smoothstep(.22,.55,pxE/max(capW,1e-3)));
  float halo=1.-.13*(1.-smoothstep(lwp, lwp+.5*ls, edge));
  return vec2(line, halo); }
float bkCloth(vec3 P, float px){
  float wv=sin((P.x+P.z*.37)*157.)*sin((P.y+P.z*.21)*157.)*(1.-smoothstep(.007,.015,px));
  float mo=sin(P.x*.83+1.7*sin(P.z*.61+P.y*.4))*sin(P.y*.71+1.3*sin(P.x*.47-P.z*.5));
  return 1.+.04*wv+.035*mo*(1.-smoothstep(.4,1.2,px)); }
vec3 bkGild(vec3 lineCol, vec3 P){
  float fl=uFlash.w*(1.-smoothstep(110.,200.,distance(P,uFlash.xyz)));
  float pd=distance(P,uPrada.xyz), pk=step(pd,uPrada.w)*step(.5,uPrada.w);
  lineCol=mix(lineCol, uGold*(1.25+1.6*exp(-max(uPrada.w-pd,0.)*.02)), pk);
  return lineCol+uGold*2.6*fl; }
`,Lt=`
#ifdef USE_FOG
varying float vFogDepth;
#ifdef FOG_EXP2
uniform float fogDensity;
#else
uniform float fogNear; uniform float fogFar;
#endif
#endif
vec3 bkFade(vec3 col, float depth){
#ifdef USE_FOG
  #ifdef FOG_EXP2
  float fd=min(fogDensity,uFadeMax)*depth*2.27; return mix(col, uCloth, 1.-exp(-fd*fd));
  #else
  return mix(col, uCloth, smoothstep(fogNear, fogFar, depth));
  #endif
#else
  return col;
#endif
}
`,ue=`
attribute vec4 aData; attribute vec2 aAux; attribute vec4 aInst;
uniform float uTime, uU, uDur, uBreathe, uRock, uBillow;
varying vec3 vP; varying vec4 vData; varying vec4 vAux; varying vec3 vLoc;
#ifdef HORN
attribute vec4 aHornA; attribute vec2 aHornB;   // A = (unit radial direction, lobe phase at rest), B = (lobe depth m, phase rate rad/s)
#endif
#ifdef USE_FOG
varying float vFogDepth;
#endif
void main(){
  mat4 im = instanceMatrix;
  float s = length(im[1].xyz);
  vec3 p = position;
  vP = (im*vec4(p,1.)).xyz;
  #ifdef HORN
  // THE IRIS: the scallops of each lip of the great curl travel round it, alternate lips against each other. The
  // outline is re-evaluated at the turned phase (cusps a little rounded so they do not tick past the vertices) and
  // the vertex moves along its own radius; the dye stays with the cloth (vP is the rest pose).
  { float sn = sin(aHornA.w - aHornB.y*uTime);
    p += aHornA.xyz*(aHornB.x*(pow(sn*sn + .004, .4) - pow(abs(sin(aHornA.w)), .8))); }
  #endif
  float mo = aInst.w, ph = aInst.y, ter = min(aData.x, 7.);
  p += normal*(uBreathe*mo*sin(uTime*.9 - ter*.8 + ph)*(.2+ter/7.));
  float a = uRock*mo*sin(uTime*.42 + ph*1.7), ca = cos(a), sa = sin(a);
  vec2 q = p.xy - vec2(0.,-.55); p.xy = vec2(ca*q.x - sa*q.y, sa*q.x + ca*q.y) + vec2(0.,-.55);
  vec3 w = (im*vec4(p,1.)).xyz;
  vec3 az = im[2].xyz; az /= max(length(az), 1e-4);
  w += az*(uBillow*mo*sin(dot(vP.xz, vec2(.6,.8))*.0314 - uTime*.628));
  vData = vec4(aData.x, aData.y*s, aData.z*s, aAux.y*s);
  vAux = vec4(aData.w, aAux.x, aInst.x < 0. ? 99. : (uU - aInst.x)*uDur, s);
  vLoc = vec3(position.xy, aInst.z);
  vec4 mv = modelViewMatrix*vec4(w,1.);
  #ifdef USE_FOG
  vFogDepth = -mv.z;
  #endif
  gl_Position = projectionMatrix*mv;
}`,pe=`
${Pt}
${Lt}
varying vec3 vP; varying vec4 vData; varying vec4 vAux; varying vec3 vLoc; uniform float uDot, uGoldTer, uStair;
#ifdef HORN
// THE WINDOWS of the great curl: three cloud-shaped openings onto the sky in the caps of its outer lips (a small
// mega-mendung silhouette: five lobes toward the rim over a flat base toward the lip), hemmed in the gold wax line.
// wn = (lip index, angle of the centre, the lip's mean radius m, lengthwise stretch). Returns metres to the opening's
// edge (negative inside it).
uniform vec4 uWin[4]; uniform vec4 uWinBolt;   // uWinBolt.x = age in seconds of the bolt drawn inside the third opening (uWin[2]); y belongs to the fourth slot, which is empty
float hornWin(vec4 wn, float ter, float kind, float arcF, float foot, float capW){
  float h = max(capW*.34, 1e-3);
  vec2 q = vec2(abs((fract(arcF - wn.y/6.2831853 + .5) - .5)*6.2831853*wn.z)/wn.w, capW*.46 - foot)/h;
  float d = length(q - vec2(0., .1)) - .95;
  d = min(d, length(q - vec2(1.15, -.2)) - .62);
  d = min(d, length(q - vec2(2., -.38)) - .4);
  vec2 b = abs(q - vec2(0., -.5)) - vec2(1.9, .07);
  d = min(d, length(max(b, 0.)) + min(max(b.x, b.y), 0.) - .2);
  return (abs(ter - wn.x) < .5 && kind < .5) ? d*h : 1e3;
}
// the opening's own coordinates (x along the lip, y toward the rim, in units of its height; x signed)
vec2 hornWinQ(vec4 wn, float arcF, float foot, float capW){
  float h = max(capW*.34, 1e-3);
  return vec2((fract(arcF - wn.y/6.2831853 + .5) - .5)*6.2831853*wn.z/wn.w, capW*.46 - foot)/h;
}
// A BOLT SEEN THROUGH AN OPENING: a drawn zigzag with one branch, grown from the rim side in 0.33 s (pxq = one pixel in q)
float winBolt(vec2 q, float pxq, float age, float flip){
  q.x *= flip;
  float y = q.y, t = (1.05 - y)/1.8;
  float xz = .3*(abs(fract(y*1.3 + .2) - .5)*4. - 1.) + .1*sin(y*8.);
  float hw = max(.07, 1.3*pxq);
  float m = 1. - smoothstep(hw, hw + pxq, abs(q.x - xz));
  float xb = -.208 + (.25 - y)*1.1 + .08*sin(y*14.);
  float mb = (1. - smoothstep(hw*.7, hw*.7 + pxq, abs(q.x - xb)))*step(y, .25)*step(-.45, y);
  return max(m, mb*.9)*step(t, age/.33)*step(0., age);
}
#endif
void main(){
  float pxa = length(dFdx(vP)), pxb = length(dFdy(vP)), px = max(pxa, pxb), pxg = sqrt(max(pxa*pxb, 1e-8));
  float dE = fwidth(vData.y), dT = fwidth(vData.x);
  float kind = vAux.y, ter = vData.x, edge = vData.y, foot = vData.z, capW = vData.y + vData.z, pxE = dE;
  if(kind > 1.5){ float tc = clamp(ter, 0., 7.999); capW = max(vData.z, 1e-3); ter = floor(tc); edge = fract(tc)*capW; foot = capW - edge; pxE = dT*capW; }
  else ter = floor(ter + .5);
  float riser = step(.5, kind)*step(kind, 1.5);
  #ifdef HORN
  float winA = min(hornWin(uWin[0], ter, kind, vAux.x, foot, capW), hornWin(uWin[1], ter, kind, vAux.x, foot, capW));
  float winB = hornWin(uWin[2], ter, kind, vAux.x, foot, capW), winC = hornWin(uWin[3], ter, kind, vAux.x, foot, capW);
  float winD = min(winA, min(winB, winC));
  #endif
  float age = vAux.z, R = vAux.w, rev = step(.95, vLoc.z), lift = floor(fract(vLoc.z)*10. + .5);   // aInst.z = rev + lift/10
  float dk = step(7.5, lift), dk2 = step(8.5, lift), bd = step(6.5, lift)*(1. - dk);   // lift 8 = the deep dye (core stops at mid
  lift *= (1. - dk)*(1. - bd);                                       // indigo), 9 = the deepest (core stops at indigo), 7 = the plain body
  float idx = mix(mix(mix(lift + ter*(7. - lift)/7., ter, bd), mix(floor(ter*.58 + .5), floor(ter*.36 + .5), dk2), dk), 6. - ter, rev) - riser*(1. - bd);
  float under = step(idx, -.5); idx = clamp(idx, 0., 7.);
  int ii = int(idx + .5);
  vec3 fill = uRamp[ii]*(1. - .16*under*rev)*(1. - .05*riser);
  // depth between the great curl's rings: each riser steps darker in three flat bands as it runs back to the next lip
  fill *= 1. - .2*rev*riser*floor(clamp(edge/max(capW, 1e-3), 0., .999)*3.);
  float vd, ch;
  float vein = bkVeins(vP, px, R > 110. ? 70. : 14., vd, ch)*(1. - .45*bd)*(1. - .6*uStair);   // (the staircase is drawn, not crackled: see uStair below)
  // THE GOLD WAX LINE: the outermost lip of every curl (every lip of the great curl, the first of each plate of the
  // staircase) keeps its wax, so one gold line runs through the whole flight; it is drawn 1.6 times as wide
  float gw = (1. - riser)*step(ter, uGoldTer);
  vec2 lh = bkLine(edge*mix(1., .62, gw), riser > .5 ? capW*.6 : capW, vData.w, pxE*mix(1., .62, gw));
  float line = lh.x;
  // THE STAIRCASE AS CLOUD TOPS (uStair): its treads step darker in three flat bands toward the next face, each band
  // hemmed with a cream echo of the lip, and each face stands on a row of half-round scales (sisik), so the plates
  // under the lens read as drawn, lobed cloud and never as a pale crackled sheet
  fill *= 1. - .13*uStair*riser*floor(clamp(edge/max(capW, 1e-3), 0., .999)*3.);
  if(riser > .5 && (capW > 10. || uStair > .5)){ float sw = capW/3.; float qd = abs(fract(edge/sw + .5) - .5)*sw; float hw = max(capW*.011, .8*pxE);
    line = max(line, (1. - smoothstep(hw, hw + max(pxE, .05), qd))*.85*(1. - smoothstep(.2, .5, pxE/sw))); }
  if(riser < .5 && kind < 1.5 && capW > 1.6){   // cecek: two rows of resist dots tracing each lip, only where the cap is seen close
    float csp = max(capW*.11*uDot, .3), crr = csp*.21, pxs = max(px, 1e-4);
    float cu = (fract(vData.w/csp) - .5)*csp, cu2 = (fract(vData.w/csp + .5) - .5)*csp;
    float cd = min(length(vec2(cu, edge - max(capW*.3, .75))), length(vec2(cu2, edge - max(capW*.62, 1.3))));
    line = max(line, .9*(1. - smoothstep(crr - min(pxs, crr), crr + pxs, cd))*(1. - smoothstep(crr*.6, crr*1.6, pxg)));
  }
  if(uStair > .5 && riser < .5){
    float cw = max(capW*.45, .9), pxs = max(px, 1e-4), su = (fract(vData.w/cw) - .5)*cw, su2 = (fract(vData.w/cw + .5) - .5)*cw;
    float d1 = length(vec2(su, foot)), d2 = length(vec2(su2, foot - cw*.42)), sl = max(capW*.016, .8*pxs);
    float sd = min(abs(d1 - cw*.42), d1 > cw*.42 ? abs(d2 - cw*.42) : 1e3);            // two overlapping rows of scales
    line = max(line, .85*(1. - smoothstep(sl, sl + pxs, sd))*(1. - smoothstep(.12, .3, pxs/cw)));
  }
  float hfil = 0., hrib = 0.;
  #ifdef HORN
  // THE GREAT CURL'S CAPS NEAR THE LENS: wherever a cap comes within about 60 m of the lens (a rule in the world: the
  // distance to the camera, whichever lip it is) it carries filler in cream under its gold line (a cap sweeping past
  // a few metres off was the largest plain fill of the flight): two overlapping rows of half-round scales standing
  // on its foot and a cream echo line over them; beyond 80 m the far rings stay clean. THE OUTER LIPS (caps over
  // 14 m wide: lips 1 to 3) carry the same band a second time in the MIDDLE of the cap, between the two rows of
  // dots, standing on a cream echo line of its own: their feet lie out of sight when the cap sweeps past the lens.
  // On the two PALE caps (the rim and lip 1), where cream on the palest wash does not show, the band lies on a
  // ribbon dyed two steps darker (hrib), so the scales and echo lines read as cream lace on blue, like the
  // staircase's treads (on the rim's cap, which has a line on both edges, the scales stand either side of its middle).
  if(riser < .5 && kind < .5 && capW > 4.){
    // (the two pale caps, the rim's and lip 1's, are the widest fills of the sweep and come into view edge-first from
    // far off: they carry their ribbon and scales from 150 m, in full within 95 m; the inner rings from 80 m, in full within 42)
    float pale = step(4.5, idx);
    float hk = 1. - smoothstep(mix(42., 95., pale), mix(80., 150., pale), distance(vP, cameraPosition));
    float ff = ter < .5 ? abs(capW*.5 - edge) : foot;
    float cw = max(capW*.2, .9), pxs = max(px, 1e-4), su = (fract(vData.w/cw) - .5)*cw, su2 = (fract(vData.w/cw + .5) - .5)*cw;
    float d1 = length(vec2(su, ff)), d2 = length(vec2(su2, ff - cw*.42)), sl = max(capW*.01, .8*pxs);
    float sd = min(min(abs(d1 - cw*.42), d1 > cw*.42 ? abs(d2 - cw*.42) : 1e3), abs(ff - cw*1.02));
    float rb = ter < .5 ? 1. - smoothstep(cw*1.02, cw*1.02 + pxs, ff) : 0.;
    if(ter > .5 && capW > 14.){
      float fm = foot - capW*.43;
      float e1 = length(vec2(su2, fm)), e2 = length(vec2(su, fm - cw*.42));
      float sm = fm > 0. ? min(min(abs(e1 - cw*.42), e1 > cw*.42 ? abs(e2 - cw*.42) : 1e3), abs(fm - cw*1.02)) : 1e3;
      sd = min(sd, min(sm, abs(fm)));
      rb = smoothstep(-pxs, 0., fm)*(1. - smoothstep(cw*1.02, cw*1.02 + pxs, fm));
    }
    float clearW = smoothstep(.5, 3., winD);                            // (the band stops short of a window's hem)
    hfil = hk*.85*(1. - smoothstep(sl, sl + pxs, sd))*(1. - smoothstep(.12, .3, pxs/cw))*clearW;
    hrib = hk*rb*step(4.5, idx)*clearW;
  }
  #endif
  float pool = 1. - .2*(1. - smoothstep(0., max(capW*.17, .6), foot))*(1. - under);
  vec3 veinCol = ii > 1 ? uRamp[ii - 1] : uRamp[2]*.8;
  vec3 dye = mix(fill*lh.y*pool, veinCol, vein*.62);
  #ifdef HORN
  { int ir = int(max(idx - 2., 0.) + .5); dye = mix(dye, mix(uRamp[ir], uRamp[ir > 0 ? ir - 1 : 0], vein*.62)*lh.y, hrib*.85); }
  #endif
  dye = mix(dye, mix(uLine, uRamp[2], vein*.75), hfil);
  vec3 lineCol = mix(mix(uLine, uRamp[2], vein*.75), uGold*.9, gw);
  lineCol = bkGild(lineCol, vP);
  float cov = 1.; vec3 glow = vec3(0.);
  if(age < 5.2){
    if(age <= 0.) discard;
    float up = clamp(vLoc.y*.5 + .5, 0., 1.);
    float tv = .8*(.6*up + .4*ch);
    float vs = smoothstep(tv, tv + .12, age)*vein;
    float t0 = .8 + ter*.175, head = (age - t0)/.175;
    float drawn = step(0., head)*step(vAux.x, head);
    float lwp = max(max(capW*.085, .3), 1.6*pxE);                    // a pen line on the cap side of each lip, never a band
    float wl = (1. - smoothstep(lwp, lwp + max(pxE, .05), edge))*drawn*(1. - riser);
    float bw = max(3.2*max(capW*.085, .3), 7.*pxE);
    float bead = (1. - smoothstep(bw*.6, bw, edge))*drawn*step(head - .05, vAux.x)*step(head, 1.05);
    float tf = 2.2 + 1.8*(.62*ter/7. + .16*ch), rr = (age - tf)/.42;
    float filled = 1. - smoothstep(rr - .12, rr, vd*.999 + .001);
    filled *= step(0., rr);
    float waxK = smoothstep(4., 4.8, age);
    vec3 wcol = mix(uWax*.85, lineCol, waxK);
    float lineNow = max(wl, line*filled);
    vec3 c = mix(uCloth, mix(uRamp[2], dye, filled), max(filled, vs));
    dye = c; lineCol = wcol; line = lineNow;
    cov = max(max(filled, vs), wl);
    glow = uGold*2.5*bead;
    if(cov < .03 && bead < .03) discard;
  }
  glow += uGold*2.1*rev*gw*line*(1. - smoothstep(.006, .016, abs(fract(vAux.x*3. - uTime*.045 + ter*.29) - .5)));
  vec3 col = mix(dye, lineCol, line)*bkCloth(vP, px) + glow;
  #ifdef HORN
  { float hem = max(1., 1.7*px);                                       // the opening's hem: gold wax, with dye pooled beside it
    col *= 1. - .22*(1. - smoothstep(hem, hem*2.6, winD));
    col = mix(col, bkGild(uGold*.9, vP), 1. - smoothstep(hem, hem + px, winD)); }
  #endif
  #ifdef USE_FOG
  col = bkFade(col, vFogDepth);
  #endif
  #ifdef HORN
  if(winD < 0.){
    // through the opening: the cloth dome itself, drawn as the dome draws it (its crackle lives in view-direction
    // space, so it holds still behind the turning lips exactly as a hole onto the sky would show it). It is drawn and
    // not cut, because the dark body sheet of the towers lies behind the lips and would fill a real hole.
    vec3 wd = vP - cameraPosition; float wl = max(length(wd), 1e-3); wd /= wl;
    float pxd = px/wl; vec2 sv = bkVor(wd*13. + 3.1);
    float shw = max(.0018, pxd*13.*.22), svein = 1. - smoothstep(shw, shw + pxd*13.*.8, sv.x);
    float dark = 1. - step(.3, uCloth.r + uCloth.g);
    col = mix(uCloth, mix(uSoga*1.25, uRamp[4], dark), mix(.17, .14, dark)*svein*.8);
    // a tower bolt seen through the third opening (keyed to the route by uWinBolt.x; the fourth slot is empty)
    float hq = max(capW*.34, 1e-3), bAge = winB < 0. ? uWinBolt.x : uWinBolt.y;
    vec2 bq = winB < 0. ? hornWinQ(uWin[2], vAux.x, foot, capW) : hornWinQ(uWin[3], vAux.x, foot, capW);
    float bm = (winB < 0. || winC < 0.) ? winBolt(bq, px/hq, bAge, winB < 0. ? 1. : -1.) : 0.;
    vec3 bc = mix(vec3(1., .82, .4)*3.2, uGold*1.7, smoothstep(.05, .6, bAge));
    col = mix(col, mix(bc, uSoga*.85, smoothstep(.8, 3., bAge)), bm);
  }
  #endif
  gl_FragColor = vec4(col, 1.);
}`;function Ct({shared:t,breathe:r=.016,rock:d=.07,billow:u=1.5,dot:c=1,goldTer:p=.5,side:R=i.DoubleSide,horn:o=!1,windows:C=null,stair:z=0}={}){const k=t||$t(Yt()),G={...i.UniformsUtils.clone(i.UniformsLib.fog),...k,uBreathe:{value:r},uRock:{value:d},uBillow:{value:u},uDot:{value:c},uGoldTer:{value:p},uStair:{value:z}};return o&&(G.uWin={value:C||[new i.Vector4(-9,0,1,1),new i.Vector4(-9,0,1,1),new i.Vector4(-9,0,1,1),new i.Vector4(-9,0,1,1)]},G.uWinBolt={value:new i.Vector4(-1,-1,0,0)}),new i.ShaderMaterial({uniforms:G,vertexShader:ue,fragmentShader:pe,fog:!0,side:R,defines:o?{HORN:1}:{}})}const ft=.0667,zt=.07;function me(t,r,d,u=0,c=!1){const p=t.range(0,Math.PI*2/r),R=t.range(.54,.68),o=t.range(.2,.28),C=t.range(.06,.11),z=[];for(let h=0;h<=r;h++)z.push(t.range(.5,1.3));const k=t.range(-.1,.1),G=t.range(.1,.2),N=t.range(-.5,-.22),K=t.range(.17,.23),T=t.range(.42,.62),g=t.range(.45,.7),W=(h,F)=>{const I=Math.cos(h),X=Math.sin(h),j=R/Math.sqrt(R*R*I*I+X*X),a=Math.pow(Math.abs(Math.sin(r*(h-p)*.5)),.8),l=J(C,o,$(-.35,.3,X))*z[F];let f=h-N;f=Math.atan2(Math.sin(f),Math.cos(f));const v=Math.exp(-(f/K)*(f/K));if(c){const Y=j*(1-l*(1-a));return[Y*Math.cos(h),Y*Math.sin(h),v]}const E=j*(1-l*(1-a)*(1-v))*(1+T*v),U=h-g*v*v;return[E*Math.cos(U),E*Math.sin(U),v]},n=(h,F)=>{let I=h-N;I=Math.atan2(Math.sin(I),Math.cos(I))/(2.4*K);const X=Math.exp(-I*I*I*I),j=W(h-.004,F),a=W(h+.004,F);return 1+X*Math.max(0,Math.min(6,Math.hypot(a[0]-j[0],a[1]-j[1])/.008/.8)-1)},x=[],b=[],m=Math.PI*2/r,s=48,M=[],y=[];let S=0;for(let h=0;h<r;h++){const F=new Float32Array(s+1);for(let I=0;I<s;I++)F[I+1]=F[I]+n(p+(h+(I+.5)/s)*m,h);y.push(F),M.push(F[s]-s),S+=F[s]-s}{let h=0;const F=M.map(j=>u*j/Math.max(S,1e-6)),I=F.map(j=>{const a=Math.floor(j);return h+=a,a}),X=F.map((j,a)=>a).sort((j,a)=>F[a]%1-F[j]%1);for(let j=0;h<u;j++,h++)I[X[j%r]]++;for(let j=0;j<r;j++){const a=d+I[j],l=y[j];for(let f=0,v=0;f<a;f++){const E=f/a*l[s];for(;l[v+1]<E;)v++;x.push(p+(j+(v+(E-l[v])/(l[v+1]-l[v]))/s)*m),b.push(j)}}}const A=x.length,H=[],Z=[];let w=0,B=-1;for(let h=0;h<A;h++){const F=W(x[h],b[h]);H.push(F[0]),Z.push(F[1]),F[2]>B&&(B=F[2],w=h)}let L=0;for(let h=0;h<A;h++)L=Math.max(L,Math.abs(H[h]));const P={N:A,x:new Float32Array(A+1),y:new Float32Array(A+1),r:new Float32Array(A+1),arc:new Float32Array(A+1),af:new Float32Array(A+1),perim:0,ry:R,ex:k,ey:G};for(let h=0;h<=A;h++){const F=(h+w)%A;P.x[h]=H[F]/L,P.y[h]=Z[F]/L,P.r[h]=Math.hypot(P.x[h],P.y[h]),P.af[h]=h===A?1:(x[F]-x[w]+(F<w?Math.PI*2:0))/(Math.PI*2)}for(let h=1;h<=A;h++)P.arc[h]=P.arc[h-1]+Math.hypot(P.x[h]-P.x[h-1],P.y[h]-P.y[h-1]);return P.perim=P.arc[A],P}class Wt{constructor(){this.pos=[],this.nor=[],this.data=[],this.aux=[],this.idx=[],this.n=0}v(r,d,u,c,p,R,o,C,z,k,G,N){return this.pos.push(r,d,u),this.nor.push(c,p,R),this.data.push(o,C,z,k),this.aux.push(G,N),this.n++}quadStrip(r,d,u){for(let c=0;c<u;c++)this.idx.push(r+c,d+c,r+c+1,d+c,d+c+1,r+c+1)}build(){const r=new i.BufferGeometry;return r.setAttribute("position",new i.Float32BufferAttribute(this.pos,3)),r.setAttribute("normal",new i.Float32BufferAttribute(this.nor,3)),r.setAttribute("aData",new i.Float32BufferAttribute(this.data,4)),r.setAttribute("aAux",new i.Float32BufferAttribute(this.aux,2)),r.setIndex(this.n>65535?new i.Uint32BufferAttribute(this.idx,1):new i.Uint16BufferAttribute(this.idx,1)),r}}function we(t,r){const d=new Wt,u=t.N,c=(o,C,z,k,G,N)=>{const K=d.n;for(let T=0;T<=u;T++)d.v(t.x[T]*o+t.ex*(1-o),t.y[T]*o+t.ey*(1-o),C,0,0,1,z,G(T),N(T),t.af[T],k,t.arc[T]*Math.max(o,.3));return K},p=o=>t.r[o]/8;if(r)for(let o=0;o<8;o++){const C=1-o/8,z=o===0?-zt:o*ft,k=(o+1)*ft,G=k-z,N=c(C,z,o,1,()=>G,()=>0),K=c(C,k,o,1,()=>0,()=>G);if(d.quadStrip(N,K,u),o<7){const T=c(C,k,o,0,()=>0,p),g=c(1-(o+1)/8,k,o,0,p,()=>0);d.quadStrip(T,g,u)}else{const T=c(C,k,o,0,()=>0,()=>9);for(let g=0;g<u;g++){const W=d.v(t.ex,t.ey,k,0,0,1,o,p(g),9,(t.af[g]+t.af[g+1])*.5,0,0);d.idx.push(T+g,W,T+g+1)}}}else{const o=c(1,-zt,0,1,()=>ft+zt,()=>0),C=c(1,ft,0,1,()=>0,()=>ft+zt);d.quadStrip(o,C,u);const z=c(1,ft,0,2,()=>0,p);for(let k=0;k<u;k++){const G=d.v(t.ex,t.ey,8*ft,0,0,1,8,0,(p(k)+p(k+1))*.5,(t.af[k]+t.af[k+1])*.5,2,0);d.idx.push(z+k,G,z+k+1)}}const R=d.build();return R.boundingSphere=new i.Sphere(new i.Vector3(0,0,.2),1.6),R}function Ft(t,r,d){const u=new i.InstancedMesh(t,r,d.length),c=new Float32Array(d.length*4);return d.forEach((p,R)=>{u.setMatrixAt(R,p.m),c[R*4]=p.birth??-1,c[R*4+1]=p.phase??0,c[R*4+2]=(p.rev??0)+.1*(p.lift||0),c[R*4+3]=p.motion??1}),t.setAttribute("aInst",new i.InstancedBufferAttribute(c,4)),u.instanceMatrix.needsUpdate=!0,u.frustumCulled=!1,u}const xe=[[0,5,420],[0,6,300],[0,8,120],[0,24,40],[0,62,-40],[0,113,-140],[0,164,-240],[0,203,-316],[0,216,-362],[0,211,-410],[0,205,-460],[0,202,-500],[0,200,-540],[-5.9,200,-594.1],[-23.4,200,-645.7],[-51.7,200,-692.2],[-89.3,200,-731.5],[-120,200,-757.2],[-150.6,200,-782.9]],Qt=new i.Vector3(0,200,-540),gt=45,Gt=220,xt=-340,Xt=.515,Dt=13,Nt=13.2,Jt=96,ve=(t,r)=>{const d=ot((40-t)/356,0,1);return r*d*d*(3-2*d)},ge=t=>xe.map(r=>[r[0]+ve(r[2],t),r[1],r[2]]),nt=[118,95,75,58,43,30,19,9.5],te=[95,132,166,196,222,246,268],ee=[75,50,28,10,0,0,0],ae=[14,9,5,2,0,0,0],Bt=.39,Et=.69,oe=Et+1.5/wt;function ye(t,r){const d=Math.ceil(t.length/3),u=new Float32Array((d+1)*3),c=new i.Vector3;for(let g=0;g<=d;g++)t.posAtDist(g/d*t.length,c),u[g*3]=c.x,u[g*3+1]=c.y,u[g*3+2]=c.z;const p=(g,W,n)=>{let x=1e12;for(let b=0;b<=d;b++){const m=u[b*3]-g,s=u[b*3+1]-W,M=u[b*3+2]-n,y=m*m+s*s+M*M;y<x&&(x=y)}return Math.sqrt(x)};let R=0,o=1e12;for(let g=0;g<=d;g++){const W=Math.hypot(u[g*3]-Qt.x-r,u[g*3+2]-Qt.z);W<o&&(o=W,R=g)}const C=[],z=[],k=[];for(let g=0;g<=t.length&&(t.posAtDist(g,c),!(C.length&&c.z>C[C.length-1]-.05||(C.push(c.z),z.push(c.x),k.push(c.y),c.z<-540)));g+=2);const G=g=>{let W=0,n=C.length-1;if(g>=C[0])return{x:z[0],y:k[0]};if(g<=C[n])return{x:z[n],y:k[n]};for(;n-W>1;){const b=W+n>>1;C[b]>g?W=b:n=b}const x=(C[W]-g)/(C[W]-C[n]);return{x:J(z[W],z[n],x),y:J(k[W],k[n],x)}};return{dist:p,near:(g,W,n,x)=>{const b=[];for(let m=0;m<=d;m++){const s=u[m*3]-g,M=u[m*3+1]-W,y=u[m*3+2]-n;s*s+M*M+y*y<x*x&&b.push(m)}return b},distIn:(g,W,n,x)=>{let b=1e12;for(let m=0;m<g.length;m++){const s=g[m],M=u[s*3]-W,y=u[s*3+1]-n,S=u[s*3+2]-x,A=M*M+y*y+S*S;A<b&&(b=A)}return Math.sqrt(b)},nearest:(g,W,n,x)=>{let b=1e12,m=0;for(let s=0;s<=d;s++){const M=u[s*3]-g,y=u[s*3+1]-W,S=u[s*3+2]-n,A=M*M+y*y+S*S;A<b&&(b=A,m=s)}return x.set(u[m*3],u[m*3+1],u[m*3+2]),Math.sqrt(b)},arcStart:R/d*t.length,atZ:G}}async function be(t,r,d){const u=new Wt,c=96,p=[],R=[2,3,4,5],o=[.26,.22,.22,.3],C=R.length;for(let m=0;m<=c;m++){const s=m/c*2-1;p.push(Jt*Math.sign(s)*Math.pow(Math.abs(s),1.25))}const z=[],k=r.range(26,31),G=r.range(0,1);let N=60;for(;t.atZ(N+4).y-Nt-1.7<7.5&&N>0;)N-=2;const K=-326;for(let m=0;N>K;m++){const s=r.range(32,38),M=G+m%2*.5+r.range(-.08,.08),y=r.range(3.2,4.4)*1.55,S=r.range(1.2,1.7),A=r.range(-.05,.05);for(let H=0;H<C&&N>K;H++){const Z=t.atZ(N+y),w=Z.y-Nt-S,B=J(45,125,$(30,-120,N)),L=Math.min(16,Math.max(w,0)*.4),P={ter:R[H],y:new Float32Array(c+1),x:new Float32Array(c+1),z:new Float32Array(c+1),arc:new Float32Array(c+1)};for(let h=0;h<=c;h++){const F=p[h],I=(1-.15*H)*Math.pow(Math.abs(Math.sin(Math.PI*(F/k+M))),.8);P.x[h]=Z.x+F,P.z[h]=N-F*F/(2*B)+F*A+y*I,P.y[h]=w+S*I-L*$(58,Jt,Math.abs(F)),h&&(P.arc[h]=P.arc[h-1]+Math.hypot(P.x[h]-P.x[h-1],P.z[h]-P.z[h-1]))}z.push(P),N-=s*o[H]}}await d.yield();const T=.5,g=.87,W=(m,s,M,y,S,A)=>{const H=u.n;for(let Z=0;Z<=c;Z++)u.v(m.x[Z],s(Z),m.z[Z],0,T,g,M,S(Z),A(Z),Z/c,y,m.arc[Z]);return H};for(let m=0;m<z.length;m++){const s=z[m],M=z[m-1],y=z[m+1];m%4===3&&await d.yield();const S=A=>M?Math.max(s.y[A]-M.y[A],.5):4.5;if(u.quadStrip(W(s,A=>s.y[A]-S(A),s.ter,0,S,()=>0),W(s,A=>s.y[A],s.ter,0,()=>0,S),c),y){const A=H=>Math.max(Math.hypot(y.x[H]-s.x[H],y.z[H]-s.z[H]),.5);u.quadStrip(W(s,H=>s.y[H],s.ter,1,()=>0,A),W(y,H=>s.y[H],s.ter,1,A,()=>0),c)}else{const A={x:s.x,z:s.z.map(H=>H-7),arc:s.arc};u.quadStrip(W(s,H=>s.y[H],s.ter,1,()=>0,()=>7),W(A,H=>s.y[H],s.ter,1,()=>7,()=>0),c),u.quadStrip(W(A,H=>s.y[H],s.ter,1,()=>0,()=>34),W(A,H=>s.y[H]-34,s.ter,1,()=>34,()=>0),c)}}await d.yield();let n=1e9,x=0;for(const m of z){const s=c>>1,M=t.near(m.x[s],m.y[s],m.z[s],210);for(let y=0;y<=c;y++)n=Math.min(n,t.distIn(M,m.x[y],m.y[y],m.z[y]));++x%5===0&&await d.yield()}await d.yield();const b=u.build();return b.computeBoundingSphere(),{geometry:b,tris:u.idx.length/3,clear:n,lips:z.length}}async function Me(t,r,d,u){const c=new Wt,p=192,R=new i.Vector3(0,1,0),o=d.int(9,13),C=d.range(.25,.45)*d.sign(),z=Math.PI-d.range(-.9,-.45),k=[],G=[],N=w=>J(.105,.045,w/7),K=.05,T=(w,B,L,P,h=1)=>{const F=Math.cos(B),I=Math.sin(B);k.push(w.right.x*F,I,w.right.z*F,o*(L-P*C)*.5),G.push(P>0?nt[P]*N(P)*h:0,P>0?o*.5*K*(P%2?1:-1):0)},g=w=>{let B=w-z;return B=Math.atan2(Math.sin(B),Math.cos(B)),Math.exp(-(B/.26)*(B/.26))},W=(w,B)=>{const L=g(w);return w+.42*B*L*L},n=[];for(let w=0;w<7;w++){const B=r.arcStart+te[w],L=t.posAtDist(B),P=t.tangentAtDist(B);P.y=0,P.normalize();const h=new i.Vector3(-P.z,0,P.x),F=L.clone().addScaledVector(h,-ee[w]);F.y-=ae[w],n.push({s:B,P:L,H:P,right:h,C:F})}const x=t.posAtDist(t.length),b=n[6].H,m={H:b,right:n[6].right,C:x.clone().addScaledVector(b,6)},s=(w,B)=>{const L=J(.105,.045,w/7),P=Math.pow(Math.abs(Math.sin(o*(B-w*C)*.5)),.8);let h=nt[w]*(1-L*(1-P));return w===0&&(h*=1+.36*g(B)),h},M=new i.Vector3,y=(w,B,L,P,h,F,I=0,X=nt[B])=>{const j=c.n;for(let a=0;a<=p;a++){const l=(a/p-.5)*Math.PI*2,f=s(B,l),v=B===0?W(l,1):l;M.copy(w.C).addScaledVector(w.right,Math.cos(v)*f).addScaledVector(R,Math.sin(v)*f).addScaledVector(w.H,I),c.v(M.x,M.y,M.z,w.H.x,0,w.H.z,L,h,F,a/p-.5,P,l*X),T(w,v,l,B)}return j};c.quadStrip(y(n[0],0,0,1,0,42),y(n[0],0,0,1,42,0,42),p);for(let w=0;w<7;w++){const B=n[w],L=nt[w]-nt[w+1];if(w===0){const F=c.n,I=(nt[0]+nt[1])*.5;for(let a=0;a<=p;a++){const l=(a/p-.5)*Math.PI*2,f=(s(0,l)+s(1,l))*.5,v=W(l,.5);M.copy(B.C).addScaledVector(B.right,Math.cos(v)*f).addScaledVector(R,Math.sin(v)*f),c.v(M.x,M.y,M.z,B.H.x,0,B.H.z,0,L*.5,L*.5,a/p-.5,0,l*I),T(B,v,l,1,.5)}const X=y(B,0,0,0,0,L,0,I),j=y(B,1,0,0,0,L,0,I);c.quadStrip(X,F,p),c.quadStrip(F,j,p)}else c.quadStrip(y(B,w,w,0,L,0,0,nt[w+1]),y(B,w+1,w,0,0,L),p);const P=w<6?n[w+1]:m,h=B.C.distanceTo(P.C);c.quadStrip(y(B,w+1,w,1,0,h),y(P,w+1,w,1,h,0),p),w%2===1&&await u.yield()}const S=y(m,7,7,0,30,30),A=c.v(m.C.x,m.C.y,m.C.z,0,0,1,7,30,30,0,0,0);k.push(0,0,0,0),G.push(0,0);for(let w=0;w<p;w++)c.idx.push(S+w,A,S+w+1);let H=1e9;await u.yield();for(let w=0;w<7;w++)for(let B=0;B<p;B+=3){const L=B/p*Math.PI*2,P=nt[w+1]*(1-N(w+1)),h=n[w];M.copy(h.C).addScaledVector(h.right,Math.cos(L)*P).addScaledVector(R,Math.sin(L)*P),H=Math.min(H,r.dist(M.x,M.y,M.z))}await u.yield();const Z=c.build();return Z.computeBoundingSphere(),Z.setAttribute("aHornA",new i.Float32BufferAttribute(k,4)),Z.setAttribute("aHornB",new i.Float32BufferAttribute(G,2)),{geometry:Z,stations:n,end:x,axis:b.clone(),clear:H,lobes:o,tris:c.idx.length/3}}function Se(t,r,d,u,c,p){const R=[],o=(a,l,f)=>new i.Vector3(a,l,f),C=t.range(0,6.28),z=t.range(0,6.28),k=t.range(-8,2),G=t.range(40,54),N=t.range(0,50),K=t.range(0,50),T=a=>-(a/3e3)*(a/3e3)*520+22*Math.sin(a/170+C)+12*Math.sin(a/61+z)-G*Math.exp(-((a-k)/36)*((a-k)/36))+16*Math.exp(-((a-30)/16)*((a-30)/16)),g=a=>J(38,165,$(110,1150,Math.abs(a))),W=(a,l)=>{const f=ot((xt-l)/2640,0,1);return(Gt+980*Math.pow(f,.75)*(.8+.2*r.n2(a/620+N,l/620+K)))*(1-.3*$(1700,3200,Math.abs(a)))},n=(a,l,f,v,E={})=>{const U=E.rng||t,Y={c:a,n:l.normalize(),up:f,R:v,hz:E.hz??U.range(.6,.88),ax:E.ax??U.range(1,1.3),mirror:E.mirror??U.sign(),birth:E.birth??-1,variant:U.int(0,2),phase:U.range(0,6.28),keep:!!E.keep,tag:E.tag||"",lift:E.lift||0};return R.push(Y),Y},x=(a,l=0)=>{const f=a*Math.PI/180;return o(Math.sin(f)*Math.sin(l),Math.cos(f),Math.sin(f)*Math.cos(l))};for(let a=-3250;a<3250;){let l=g(a)*t.range(.85,1.5);Math.abs(a)<230&&(l=Math.min(l,36)),a+=l*.66;const f=-a/5200,v=Math.abs(a-d.atZ(T(a)).x)<100,E=Math.abs(a-d.atZ(T(a)).x),U=E>170?9:8,Y=1-$(240,300,E),rt=Math.sign(a-d.atZ(T(a)).x),at=n(o(a,gt+l*.2,T(a)-l*.1),x(t.range(66,74)+18*Y,f-rt*.6*Y),o(t.range(-.2,.2),1,0),l,{tag:"nose",hz:t.range(.42,.6),lift:U});if(v&&R.pop(),t.chance(.75)&&!v){const tt=l*t.range(.6,.85);n(o(a+l*t.range(.5,.8)*t.sign(),gt+l*.2+tt*t.range(.75,1),T(a)-l*.45),x(t.range(56,66)+28*Y,f-rt*.6*Y),o(t.range(-.25,.25),1,0),tt,{tag:"nose",hz:t.range(.42,.6),lift:U})}a+=l*.66}for(let a=-3250;a<3250;){const l=g(a);let f=l*.75,v=0;for(;f<345;){let E=l*t.range(.9,1.15);const U=a+(v%2?l*.75:0)+t.range(-.12,.12)*l,Y=T(U)-f,rt=gt+Xt*f,at=d.atZ(Y),tt=Math.abs(U-at.x);if(tt<150){f+=l*t.range(.74,.86),v++;continue}const it=$(160,230,tt),yt=E/l;E=l*J(yt,.4+1.25*Math.pow(ot((yt-.9)/.25,0,1),1.7),it);const kt=it*(1-$(250,310,tt));Y>xt+E*.15&&n(o(U,Math.min(rt,at.y+(tt-190)*.3)-E*.12,Y),x(t.range(36,46)-13*it+25*kt,-U/5200+t.range(-.15,.15)-Math.sign(U-at.x)*.45*kt),o(0,.3,-1),E,{tag:"face",hz:Math.abs(U)>230?t.range(.45,.62)+.36*it:t.range(.62,.9)+.1*it,lift:it>.85?9:it>.08?8:0}),f+=l*t.range(.74,.86),v++}a+=l*1.5}for(let a=0;a<300;a+=t.range(15,19))for(const l of[-1,1])for(let f=0;f<2;f++){const v=-40-a+t.range(-4,4),E=d.atZ(v),U=t.range(22,30),Y=l*(f?t.range(110,138):t.range(76,96));n(o(E.x+Y,E.y-Nt-(f?t.range(1,8):t.range(9,15)),v),x(t.range(34,44),-l*t.range(.1,.45)),o(0,.3,-1),U,{tag:"bank",hz:t.range(.62,.9),lift:f?8:1})}for(let a=-3250;a<3250;){const l=g(a)*t.range(1,1.25);a+=l*.6,(a-p<-270||a-p>336)&&n(o(a,Gt+l*.08,T(a)*.5+xt-8),x(66,-a/5200),o(0,1,0),l,{tag:"lip",lift:8}),a+=l*.6}const b=[-250,255,-146,140,252],m=[72,66,90,84,68],s=[Bt-.122,Bt-.1],M=t.shuffle([1,2,3]).slice(0,3);b.forEach((a,l)=>{const f=l>=2,v=m[l]*t.range(.96,1.06);n(o(p+a+t.range(-4,4),Gt+(f?v*.8+(l<4?26:0):180-l*15),xt-(f?6+l%2*8+(l===4?30:0):50+l*30)),x(t.range(96,104)+(f?l<4?10:0:20),-a/(f?l<4?420:700:440)),o(0,1,.2),v,{tag:f?"arrival":"herald",birth:f?Bt-.055+.024*M.indexOf(l-1):s[l],keep:!0,hz:.6,ax:1.15,mirror:a<0?-1:1})});const y=t.range(27,32),S=t.fork("canyon-walls");for(let a=0;a<6;a++){const l=-390-a*34+S.range(-5,5);for(const f of[-1,1])for(let v=0;v<2;v++){if(f<0&&(a>0||v===0))continue;const E=S.range(27,35),U=v?226+S.range(-4,8):180+S.range(-5,5);n(o(p+f*(y*.55+E*1.22+22+v*9),U,l+v*17),o(-f*.9,v?-.25:.1,1+S.range(.05,.3)+(a===0?.3:0)),o(0,1,0),E,{tag:"canyon",lift:2,mirror:f,rng:S}).bare=!!v}n(o(p+t.range(-16,16),159-t.range(0,6),l-10),o(t.range(-.15,.15),1,.25),o(0,0,-1),t.range(28,36),{tag:"floor"}),n(o(p+t.range(-12,12)+(a%2?26:-26),150-t.range(0,8),l-28),o(t.range(-.2,.2),1,.3),o(0,0,-1),t.range(30,40),{tag:"floor"})}const A=new i.Vector3,H=new i.Vector3;for(let a=0;a<4;a++){const l=d.arcStart+8+a*30;u.path.posAtDist(l,A),u.path.tangentAtDist(l,H);for(let f=0;f<2;f++){const v=S.range(30,38),E=y*.55+22+a*3+v*1.22+f*10;n(o(A.x-H.z*E,f?228+S.range(0,8):182+S.range(-4,4),A.z+H.x*E),o(H.z*.9-H.x*1.1,f?-.25:.1,-H.x*.9-H.z*1.1),o(0,1,0),v,{tag:"canyon",lift:2,mirror:1,rng:S}).bare=!!f}}const Z=u.stations[0].C;for(let a=0;a<22;a++){const l=(a+.5)/22,f=a%3-1,v=J(p-30,Z.x-30,l)+f*62+t.range(-20,20),E=J(-455,Z.z+30,l)+f*34+t.range(-18,18);n(o(v,J(152,92,l)-Math.abs(f)*12+t.range(-8,8),E),o(t.range(-.1,.3)-f*.15,1,t.range(.2,.5)),o(0,0,-1),t.range(38,62),{tag:"bowl"}).bare=!0}const w=u.stations[0],B=10;for(let a=0;a<B;a++){const l=a/B*Math.PI*2+t.range(-.12,.12),f=t.range(52,74),v=nt[0]+f*.42,E=w.C.clone().addScaledVector(w.right,Math.cos(l)*v).addScaledVector(o(0,1,0),Math.sin(l)*v).addScaledVector(w.H,30+t.range(0,14));if(E.y<60)continue;const U=w.H.clone().multiplyScalar(-1).addScaledVector(w.right,Math.cos(l)*.45).addScaledVector(o(0,1,0),Math.sin(l)*.45+.1);n(E,U,o(Math.cos(l)*.6,1,0),f,{tag:"wreath"}).bare=Math.sin(l)<.4}const L=w.C,P=u.end,h=(a,l)=>{const f=P.x-L.x,v=P.z-L.z,E=ot(((a-L.x)*f+(l-L.z)*v)/(f*f+v*v),-.3,1);return Math.hypot(a-L.x-f*E,l-L.z-v*E)};let F=170,I=-435,X=0;for(;I>-3150;){const a=F*.8/(.55+.45*c);for(let l=-3300+X%2*a*.5;l<3300;l+=a){const f=l+t.range(-.15,.15)*a,v=I+t.range(-.1,.1)*F-f/3e3*(f/3e3)*420,E=F*.5*t.range(.9,1.18);if(v>-640&&Math.abs(f-p)<62+E||v>P.z-40&&h(f,v)<150+E*.6||v>-700&&f<p+40&&f>L.x-120&&v<-430)continue;const U=t.chance(.13),Y=U?E*t.range(1.5,1.9):E,rt=v>-780&&Math.abs(f-p-40)<400?75:0,at=f-p,tt=X<2&&!U?Math.max($(330,370,at)*(1-$(450,490,at)),.9*$(640,680,at)*(1-$(760,800,at))):0,it=Y*(1+tt);n(o(f,W(f,v)-rt*(1-tt)-E*.3+(U&&!rt?Y*.22:0)+(it*.5+30+30*X)*tt,v-(U?25:0)),x(t.range(64,76),-f/5200+t.range(-.12,.12)),o(t.range(-.2,.2),1,0),it,{tag:"tower",hz:t.range(.34,.5),lift:9})}I-=F*(X<2?.92:1),F=Math.min(500,F*1.19),X++}for(const[a,l]of[[t.range(980,1100),t.range(-950,-1050)],[t.range(-1e3,-860),t.range(-1150,-1e3)],[t.range(-1750,-1500),t.range(-1500,-1300)]]){const f=t.range(250,330);n(o(p+a,W(a,l)+t.range(150,250)-f*.25,l),x(t.range(70,80),-a/5200),o(t.range(-.2,.2),1,0),f,{tag:"tower",hz:t.range(.34,.45),lift:9})}const j=[[-380,-2950,225,.14],[650,-2700,200,.3],[-900,-2250,190,.5],[330,-2050,170,.6],[-150,-2500,210,.78]];for(const[a,l,f,v]of j){const E=a+t.range(-120,120);n(o(E,W(E,l)+f*.42,l),x(72,-E/5200),o(0,1,0),f,{tag:"sky",birth:v,keep:!0,hz:.6,ax:1.15})}{const a=p+230,l=-1150,f=735;for(const[v,E,U,Y,rt]of[[20,-95,-40,170,80],[-150,-235,0,200,76],[165,-270,10,190,78],[0,-430,40,260,74],[-270,-470,60,220,72],[285,-500,60,230,73]])n(o(a+v,f+E,l+U),x(rt,-a/5200),o(v>0?.15:-.15,1,0),Y,{tag:"tower",hz:.42,ax:1.15,mirror:v>0?1:-1,lift:9}).mid=!0}return{curls:R,noseZ:T,towerTop:W,half:y}}function ze(t,r,d){const u=[],c=(p,R,o)=>new i.Vector3(p,R,o);for(const p of[-1,1])for(let R=0;R<3;R++){let o=[78,128,140][R]+t.range(0,9);const C=[268,286,300][R];for(;o<C;){const z=t.range(22,30),k=o-1.15*z,G=p*o,N=d(G),K=k<100?46-k*k/90+12:-1e9,T=R===0?Math.max(N+8,K)+t.range(-3,3):N+8-R*30+t.range(-5,5),g=r.atZ(T).x+G,W=t.range(72,82)*Math.PI/180,n=-p*(t.range(.08,.34)+.5*(1-$(170,250,o)));u.push({c:c(g,t.range(33,38)+R*2.5+.02*Math.max(0,o-200),T),n:c(Math.sin(W)*Math.sin(n),Math.cos(W),Math.sin(W)*Math.cos(n)).normalize(),up:c(t.range(-.28,.28),-1,0),R:z,hz:t.range(.5,.66),ax:t.range(1,1.25),mirror:t.sign(),birth:-1,variant:t.int(0,2),phase:t.range(0,6.28),keep:!1,tag:"hang",lift:8,lod:R<2&&o<178?"full":"mid"}),o+=z*t.range(1.25,1.5)}}return u}const At=6;function Ae(t,r,d){const u=[],c=[],p=[],R=[],o=[],C=[];let z=0;const k=(g,W,n,x,b,m)=>{for(let s=0;s<g.length;s++){const M=g[Math.max(s-1,0)],y=g[Math.min(s+1,g.length-1)],S=g[s],A=s/(g.length-1),H=y.x-M.x,Z=y.y-M.y,w=y.z-M.z;for(const B of[-1,1])u.push(S.x,S.y,S.z),c.push(H,Z,w),p.push(B,J(W,n,A)),R.push(x,J(b,m,A));s&&o.push(z-2,z-1,z,z-1,z+1,z),z+=2}};r.forEach((g,W)=>{const n=g.height,x=g.top,b=[],m=26,s=t.fork("bolt"+W);let M=0,y=0;for(let S=0;S<=m;S++){const A=S/m;S&&(M+=s.range(-1,1)*n*.035+(S%3===0?s.range(-1,1)*n*.05:0),y+=s.range(-1,1)*n*.02,M*=.86),b.push(new i.Vector3(x.x+M+g.lean.x*A*n,x.y-A*n,x.z+y+g.lean.z*A*n))}k(b,0,1,W,1,.55),C.push(b);for(let S=0;S<5;S++){const A=3+S*4+s.int(0,2),H=A/m,Z=g.branchSign?g.branchSign:S%2?1:-1,w=n*s.range(.22,.38),B=[b[A].clone()];let L=0,P=0,h=0;for(let F=1;F<=8;F++)L+=Z*w*.11*s.range(.5,1.5),P-=w*.085*s.range(.2,1.6),h+=s.range(-1,1)*w*.03,B.push(new i.Vector3(b[A].x+L,b[A].y+P,b[A].z+h+g.lean.z*(F/8)*w));k(B,H,Math.min(1,H+.4),W,.6,.25)}});const G=new i.BufferGeometry;G.setAttribute("position",new i.Float32BufferAttribute(u,3)),G.setAttribute("aTan",new i.Float32BufferAttribute(c,3)),G.setAttribute("aSO",new i.Float32BufferAttribute(p,2)),G.setAttribute("aBW",new i.Float32BufferAttribute(R,2)),G.setIndex(o);const N={...i.UniformsUtils.clone(i.UniformsLib.fog),...d,uAge:{value:new Float32Array(At).fill(-1)},uPix:{value:.0027},uWidth:{value:.9},uKeep:{value:0}},K=new i.ShaderMaterial({uniforms:N,fog:!0,side:i.DoubleSide,vertexShader:`
      attribute vec3 aTan; attribute vec2 aSO; attribute vec2 aBW; uniform float uPix, uWidth;
      varying float vOrd; varying float vSlot; varying float vSide;
      #ifdef USE_FOG
      varying float vFogDepth;
      #endif
      void main(){
        vec4 mv = modelViewMatrix*vec4(position,1.);
        vec3 t = mat3(modelViewMatrix)*aTan; vec2 d = t.xy; float l = length(d); d = l > 1e-4 ? d/l : vec2(0.,1.);
        float w = max(uWidth*aBW.y, -mv.z*uPix*2.2*sqrt(aBW.y))*.5;
        mv.xy += vec2(-d.y, d.x)*aSO.x*w;
        vOrd = aSO.y; vSlot = aBW.x; vSide = aSO.x;
        #ifdef USE_FOG
        vFogDepth = -mv.z;
        #endif
        gl_Position = projectionMatrix*mv; }`,fragmentShader:`
      ${Pt}
      ${Lt}
      uniform float uAge[${At}]; uniform float uKeep; varying float vOrd; varying float vSlot; varying float vSide;
      void main(){
        int s = int(vSlot + .5); float age = uAge[s];
        float grow = age/.33;
        if(age < 0. || vOrd > grow) discard;
        float h = age - vOrd*.33;
        float keep = (s == 0) ? uKeep : 0.;
        vec3 hot = vec3(1., .82, .4)*4.2, gold = uGold*1.7, trace = uSoga*.85;
        vec3 col = mix(hot, gold, smoothstep(.05, .6, h));
        col = mix(col, mix(trace, gold, keep), smoothstep(.6, 2.5, h));
        col *= 1. + .5*(1. - smoothstep(0., .08, grow - vOrd))*step(grow, 1.3);
        #ifdef USE_FOG
        col = bkFade(col, vFogDepth);
        #endif
        gl_FragColor = vec4(col, 1.); }`}),T=new i.Mesh(G,K);return T.frustumCulled=!1,T.renderOrder=2,{mesh:T,uniforms:N,tris:o.length/3,channels:C}}function ke(t,r){const d={...t,uCam:{value:new i.Vector3(0,5,420)},uStain:{value:0},uSea:{value:1},uHaze:{value:r.haze},uFade:{value:22e-5},uShelf:{value:60},uVeinK:{value:r.colourway==="golden"?2.4:1},uVeinC:{value:r.colourway==="night"?r.ramp[4].clone():r.soga.clone().multiplyScalar(r.colourway==="golden"?.5208333333333334:1.25)},uVeinW:{value:r.colourway==="night"?.85:1},uVeinA:{value:r.colourway==="night"?.14:r.colourway==="golden"?.384:.16},uStainC:{value:r.colourway==="golden"?[r.cloth.clone().lerp(r.ramp[3],.6),r.cloth.clone().lerp(r.ramp[2],.65),r.cloth.clone().lerp(r.ramp[1],.7)]:r.colourway==="night"?[r.cloth.clone().lerp(r.ramp[2],.7),r.cloth.clone().lerp(r.ramp[3],.7),r.cloth.clone().lerp(r.ramp[3],.7)]:[r.ramp[6],r.ramp[5],r.ramp[5]]},uStainA:{value:r.colourway==="golden"?new i.Vector3(.55,.5,.4):r.colourway==="night"?new i.Vector3(.75,.45,.3):new i.Vector3(.8,.6,.35)}},u=new i.ShaderMaterial({uniforms:d,side:i.BackSide,depthWrite:!1,depthTest:!1,fog:!1,vertexShader:"varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }",fragmentShader:`
      ${Pt}
      uniform vec3 uCam, uHaze, uVeinC, uStainC[3], uStainA; uniform float uStain, uSea, uFade, uShelf, uVeinK, uVeinA, uVeinW; varying vec3 vDir;
      void main(){
        vec3 d = normalize(vDir);
        float pxd = max(length(dFdx(d)), length(dFdy(d)));
        vec3 col = uCloth;
        if(d.y >= 0. || uSea < .5){
          // sky: crackle fixed to the dome, the stain wicking up from the storm's crest (north = -Z)
          vec2 v = bkVor(d*13. + 3.1); vec2 v2 = bkVor(d*44. + 9.7);
          float hw = max(.0018, pxd*13.*.22)*uVeinW, hw2 = max(.004, pxd*44.*.22)*uVeinW;
          float vein = 1. - smoothstep(hw, hw + pxd*13.*.8, v.x);
          float vein2 = (1. - smoothstep(hw2, hw2 + pxd*44.*.8, v2.x))*(1. - smoothstep(.0006, .002, pxd));
          float el = degrees(asin(clamp(d.y, -1., 1.)));
          float az = atan(d.x, -d.z + 1e-5);
          float north = 1. - smoothstep(.9, 1.75, abs(az));
          float sc = abs(sin(az*9. + 1.3)); 
          float front = (15. + 30.*uStain + 3.5*sc)*north - 12.*(1. - north);
          float cf = front + (v.y - .5)*9.;
          float wash = 1. - smoothstep(cf - .75, cf + .75, el), wash2 = 1. - smoothstep(cf - 9.75, cf - 8.25, el), wash3 = 1. - smoothstep(cf - 19.75, cf - 18.25, el);
          float lead = step(el, front + 5. + 7.*v2.y)*max(vein, vein2*.7);
          // (dawn only) the rose band: full to 30 degrees, gone by 46, so about ten degrees of it stand above the crest
          col = mix(col, uHaze, .78*(1. - smoothstep(30., 46., el))*north*step(.001, distance(uHaze, uCloth)));
          col = mix(col, uVeinC, uVeinA*max(vein*.8, vein2*.5));
          col = mix(col, uStainC[0], wash*uStainA.x); col = mix(col, uStainC[1], wash2*uStainA.y); col = mix(col, uStainC[2], wash3*uStainA.z);
          col = mix(col, uRamp[4], lead*(1. - wash)*.5);
          col = mix(col, uRamp[5], vein*wash*.35*step(.3, uCloth.r + uCloth.g));
          // the unseen wax pen: an amber scalloped line just ahead of the stain
          float wl = abs(el - (front + 2.2)); float aw = max(.07, degrees(pxd)*.75);
          col = mix(col, uWax, (1. - smoothstep(aw, aw + degrees(pxd), wl))*north*smoothstep(.02, .1, uStain));
          col *= 1. + .03*uVeinK*sin(d.x*900. + d.y*300.)*sin(d.y*900. - d.z*300.)*(1. - smoothstep(.0008, .002, pxd));
        } else {
          // far sea plate at y = 0
          float t = uCam.y/max(-d.y, 1e-4); vec3 P = uCam + d*t; P.y = 0.;
          float px = t*pxd/max(-d.y, .02);
          float bc = (P.x + P.z)*.7071/18. + uTime*.33; float bf = fract(bc);
          float blade = smoothstep(.0, .5*px/18. + .02, .5 - abs(bf - .5) - .27 - .1*sin((P.x - P.z)*.7071*.21 + floor(bc)*2.4));
          float flat1 = 1. - smoothstep(.12, .45, px/18.);
          float cream = mix(.34, blade, flat1);
          float dots = step(.72, fract((P.x - P.z)*.7071*.45 - uTime*1.1 + floor(bc)*.37))*step(abs(bf - .12), .06)*flat1;
          float od = 1. - smoothstep(uShelf - 30., uShelf + 26.*bkVor(vec3(P.xz/55., 0.)).y, P.z);
          vec3 ground = mix(uSoga, uOverdye, od);
          col = mix(ground, uLine, max(cream*.9, dots));
          float fd = uFade*t; col = mix(col, uCloth, 1. - exp(-fd*fd*6.));
        }
        gl_FragColor = vec4(col, 1.); }`}),c=new i.Mesh(new i.SphereGeometry(2600,48,24),u);return c.renderOrder=-.5,c.frustumCulled=!1,{mesh:c,uniforms:d}}function Ve(t,r){const d=[],u=[];let c=0;for(let C=-3400;C<=3400;C+=170){const z=t(C)-395;d.push(C,-3,z,C,78+Math.abs(C)*.012,z),c&&u.push(c-2,c,c-1,c-1,c,c+1),c+=2}const p=new i.BufferGeometry;p.setAttribute("position",new i.Float32BufferAttribute(d,3)),p.setIndex(u);const R=new i.ShaderMaterial({uniforms:{...i.UniformsUtils.clone(i.UniformsLib.fog),...r},fog:!0,side:i.DoubleSide,vertexShader:`varying vec3 vP;
      #ifdef USE_FOG
      varying float vFogDepth;
      #endif
      void main(){ vP = position; vec4 mv = modelViewMatrix*vec4(position,1.);
      #ifdef USE_FOG
      vFogDepth = -mv.z;
      #endif
      gl_Position = projectionMatrix*mv; }`,fragmentShader:`
      ${Pt}
      ${Lt}
      varying vec3 vP;
      void main(){
        float px = max(max(length(dFdx(vP)), length(dFdy(vP))), 1e-4);
        float q = (vP.x + vP.y*.364)/26.; float band = floor(q), bf = fract(q);
        float h = bkHash3(vec3(band, 3., 7.)).x;
        vec3 col = mix(uRamp[0], uRamp[1], step(.5, h))*.9;
        // udan liris: three lanes of long slanted strokes to a band (64-110 m long, 85% of each period drawn), scrolling
        // down. A stroke is never under 1.3 px wide, and past about a kilometre the lanes melt into their own average,
        // so the wall is neither a barcode of short dashes nor a blank sheet.
        float lane = floor(bf*3.), lf = (fract(bf*3.) - .5)*8.667;
        vec3 h2 = bkHash3(vec3(band, lane, 11.));
        float per = 64. + 46.*h2.x, ay = px*1.064/per + .003;
        float fy = fract((vP.y*1.064 + uTime*25.*(.7 + .6*h))/per + h2.y*7.);
        float on = smoothstep(.15 - ay, .15 + ay, fy)*(1. - smoothstep(1. - 2.*ay, 1., fy));
        float wd = max(.42, .65*px);
        float core = 1. - smoothstep(wd - .5*px, wd + .5*px, abs(lf));
        float far = smoothstep(1.6, 3., px);
        float stroke = mix(core*on, min(2.*wd/8.667, 1.)*.85, far)*step(.2, h2.z);
        col = mix(col, uRamp[5], stroke*.46);
        float edge = 1. - smoothstep(.03, .03 + px/26., min(bf, 1. - bf));
        col = mix(col, uRamp[4], edge*(1. - smoothstep(.12, .45, px))*.3);
        #ifdef USE_FOG
        col = bkFade(col, vFogDepth);
        #endif
        gl_FragColor = vec4(col, 1.); }`}),o=new i.Mesh(p,R);return o.frustumCulled=!1,o}async function Ce(t,r={}){const d=t.rng.fork("mega-mendung"),u=t.quality?.detail??1,c=t.vary?.hour,p=r.colourway||(["golden","night","dawn"].includes(c)?c:"day"),R=Yt(r.palette,p),o=$t(R),C=r.prada??!!t.vary?.rare,z=new i.Group;z.name="batik-monsoon-front";const k=r.shift??Math.round(d.fork("notch").range(-110,110)),G=d.fork("horn"),N=d.fork("layout"),K=ge(k),T=fe(K),g=new i.Vector3(k,208,-352),W=new i.Vector3(k,200,-540);await t.yield();const n=ye(T,k);await t.yield();const x=await Me(T,n,G,t);x.path=T,await t.yield();const b=Se(N,t.noise,n,x,u,k);await t.yield();const s=d.shuffle([[8,10],[9,9],[10,8],[7,11]]).slice(0,3).map(([e,V])=>{const D=d.int(1,1e9),O=(_,q,Q)=>me(t.core.makeRng(D),e,_,q,Q);return{full:O(V,6),mid:O(8,4),far:O(4,2),bare:O(V,0,!0),bmid:O(8,0,!0)}});await t.yield();const M=new i.Vector3,y=new i.Vector3,S=new i.Vector3,A=e=>{M.crossVectors(e.up,e.n).normalize(),y.crossVectors(e.n,M).normalize()},H=e=>{const V=s[e.variant].full;let D=1e9;A(e);const O=n.near(e.c.x,e.c.y,e.c.z,e.R*1.6+60);if(!O.length)return 1e9;for(let q=0;q<8;q++){const Q=1-q/8;for(let et=0;et<2;et++){const lt=(et?(q+1)*ft:q===0?-zt:q*ft)*e.R*e.hz;for(let ct=0;ct<V.N;ct++){S.copy(e.c).addScaledVector(M,(V.x[ct]*Q+V.ex*(1-Q))*e.R*e.ax*e.mirror).addScaledVector(y,(V.y[ct]*Q+V.ey*(1-Q))*e.R).addScaledVector(e.n,lt);const ht=n.distIn(O,S.x,S.y,S.z);ht<D&&(D=ht)}}}const _=(n.dist(e.c.x,e.c.y,e.c.z)-e.R<60?.6:1)*(.085*e.R+1.5+.02*e.R*e.hz);return Math.min(D,D-_+2.5)};await t.yield();const Z=[];{const e=x.stations[0];Z.push([e.C.clone().addScaledVector(e.H,-80),e.C,nt[1]+4]);for(let V=0;V<7;V++)Z.push([x.stations[V].C,V<6?x.stations[V+1].C:x.end.clone().addScaledVector(x.axis,6),nt[V+1]+3])}const w=new i.Vector3,B=new i.Vector3,L=e=>{for(const[V,D,O]of Z){w.subVectors(D,V),B.subVectors(e,V);const _=ot(B.dot(w)/w.lengthSq(),0,1);if(B.addScaledVector(w,-_).lengthSq()<O*O)return!0}return!1},P=e=>{if(e.c.distanceTo(x.stations[2].C)>330+e.R)return!1;const V=s[e.variant].full,D=Math.max(1,Math.floor(V.N/14));A(e);for(const O of[1,.6,.2])for(let _=0;_<V.N;_+=D)if(S.copy(e.c).addScaledVector(M,(V.x[_]*O+V.ex*(1-O))*e.R*e.ax*e.mirror).addScaledVector(y,(V.y[_]*O+V.ey*(1-O))*e.R).addScaledVector(e.n,(1-O)*8*ft*e.R*e.hz),L(S))return!0;return!1};{const e=new i.Vector3;let V=0;for(const D of b.curls){if(D.tag!=="face"&&D.tag!=="wreath")continue;const O=n.nearest(D.c.x,D.c.y,D.c.z,e);if(O>330+D.R||O<1)continue;e.sub(D.c).multiplyScalar(1/O);const _=Math.acos(ot(D.n.dot(e),-1,1));if(_>1.047){const Q=Math.sin(_);D.n.multiplyScalar(Math.sin(_-.436)/Q).addScaledVector(e,Math.sin(.436)/Q).normalize()}++V%15===0&&await t.yield()}}{const e=new i.Vector3,V=new i.Vector3().subVectors(W,g),D=V.lengthSq();for(const O of b.curls){if(O.tag!=="tower"||O.c.x-k<80)continue;const _=ot(e.subVectors(O.c,g).dot(V)/D,0,1);e.copy(g).addScaledVector(V,_).sub(O.c);const q=e.length();if(q>720||q<1)continue;e.multiplyScalar(1/q),q<520&&(O.wing=!0);const Q=Math.acos(ot(O.n.dot(e),-1,1));if(Q>.7){const et=Math.min(Q-.6,.6),lt=Math.sin(Q);O.n.multiplyScalar(Math.sin(Q-et)/lt).addScaledVector(e,Math.sin(et)/lt).normalize()}}}await t.yield();let h=1e9,F=0;const I=[];for(const e of b.curls){const V=n.dist(e.c.x,e.c.y,e.c.z);if(V<70&&e.R>40&&(e.tag==="face"||e.tag==="nose"||e.tag==="bank")&&(e.R=40),e.dPath=V-e.R,V-e.R*1.6<24){let D=H(e);for(let O=0;O<12&&D<Dt;O++)e.c.addScaledVector(e.n,-(Dt-D+1.5)),O>=5&&(e.R*=.88),D=H(e);if(D<Dt-.25)continue;h=Math.min(h,D),e.dPath=n.dist(e.c.x,e.c.y,e.c.z)-e.R,++F,await t.yield()}!e.keep&&P(e)||I.push(e)}await t.yield(),I.sort((e,V)=>e.dPath-V.dPath);const X=92;let j=0,a=0;for(const e of I)!(e.tag==="tower"||e.tag==="sky")&&e.dPath<160&&j<X?(e.lod="full",j++):e.wing?e.lod="full":e.dPath<560&&a<190||e.mid?(e.lod="mid",a++):e.lod="far",e.bare&&(e.lod==="full"||e.tag==="wreath")?e.lod="bare":e.bare&&e.lod==="mid"&&(e.lod="bmid"),A(e),e.m=new i.Matrix4().makeBasis(M.clone().multiplyScalar(e.R*e.ax*e.mirror),y.clone().multiplyScalar(e.R),e.n.clone().multiplyScalar(e.R*e.hz)).setPosition(e.c),e.motion=e.dPath<60?.6:1;let l=0;for(const e of ze(t.core.makeRng((Math.floor(b.half*1e6)^49734321)>>>0),n,b.noseZ))n.dist(e.c.x,e.c.y,e.c.z)-e.R*1.6<Dt+12||(A(e),e.m=new i.Matrix4().makeBasis(M.clone().multiplyScalar(e.R*e.ax*e.mirror),y.clone().multiplyScalar(e.R),e.n.clone().multiplyScalar(e.R*e.hz)).setPosition(e.c),e.motion=.8,e.dPath=n.dist(e.c.x,e.c.y,e.c.z)-e.R,I.push(e),l++);await t.yield();const f=Ct({shared:o});let v=0;const E=[];for(let e=0;e<3;e++)for(const V of["full","bare","mid","bmid","far"]){const D=I.filter(q=>q.variant===e&&q.lod===V);if(!D.length)continue;const O=we(s[e][V],V==="full"||V==="bare"),_=Ft(O,f,D);_.name="curls-"+e+"-"+V,v+=O.index.count/3*D.length,z.add(_),E.push(_),await t.yield()}const U=[new i.Vector4(1,2.5,85,1.3),new i.Vector4(2,3.12,66,1.1),new i.Vector4(3,2.2,50,1),new i.Vector4(-9,0,1,1)],Y=Ct({shared:o,breathe:0,rock:0,billow:1.1,goldTer:8,horn:!0,windows:U}),rt=Ct({shared:o,breathe:0,rock:0,billow:1.1,goldTer:8}),at=Ft(x.geometry,Y,[{m:new i.Matrix4,rev:1,motion:1}]);at.name="great-curl",z.add(at),v+=x.tris,await t.yield();const tt=await be(n,d.fork("stairs"),t);await t.yield();const it=Ct({shared:o,breathe:.45,rock:0,billow:1.1,dot:2.2,goldTer:2.5,stair:1}),yt=Ft(tt.geometry,it,[{m:new i.Matrix4,rev:0,motion:.6}]);if(yt.name="staircase",z.add(yt),v+=tt.tris,await t.yield(),r.body!==!1){const e=await Re(b,x,n,k,t),V=Ft(e.geometry,rt,[{m:new i.Matrix4,rev:0,motion:0,lift:7}]);V.name="body",z.add(V),v+=e.tris}await t.yield();const kt=(()=>{const e=[],V=[],D=[];for(let q=0;q<=120;q++){const Q=q/120*Math.PI*2,et=Math.cos(Q),lt=Math.sin(Q),ct=8.55+.6*Math.abs(Math.sin(Q*6));if(e.push(et*7.55,lt*7.55,0,et*ct,lt*ct,0),V.push(q/120,0,q/120,1),q){const ht=q*2;D.push(ht-2,ht-1,ht,ht-1,ht+1,ht)}}const _=new i.BufferGeometry;return _.setAttribute("position",new i.Float32BufferAttribute(e,3)),_.setAttribute("uv",new i.Float32BufferAttribute(V,2)),_.setIndex(D),_})(),ne=new i.ShaderMaterial({uniforms:{uGold:o.uGold,uTime:o.uTime},side:i.DoubleSide,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }",fragmentShader:"uniform vec3 uGold; uniform float uTime; varying vec2 vUv; void main(){ float k = .8 + .2*sin(vUv.x*75.4 + uTime*1.5); gl_FragColor = vec4(uGold*2.*k*(1. - .35*smoothstep(.55, 1., vUv.y)), 1.); }"}),bt=new i.Mesh(kt,ne);bt.name="portal-ring";const _t=new i.Quaternion().setFromUnitVectors(new i.Vector3(0,0,1),x.axis.clone().multiplyScalar(-1));bt.position.copy(x.end).addScaledVector(x.axis,.6),bt.quaternion.copy(_t),z.add(bt),await t.yield();const vt=d.fork("bolts"),Vt={top:new i.Vector3(k+18,322,-592),height:176,lean:new i.Vector3(-.02,0,.04),branchSign:1},Tt=[Vt];for(let e=1;e<At;e++){const V=e%2?1:-1,D=V>0?vt.range(260,1100):vt.range(-1300,-520),O=vt.range(-900,-1900),_=vt.range(230,330);Tt.push({top:new i.Vector3(D,b.towerTop(D,O)+30,O+40),height:_,lean:new i.Vector3(vt.range(-.1,.1),0,.55),branchSign:0})}const pt=Ae(vt,Tt,o);z.add(pt.mesh),v+=pt.tris,await t.yield();let Ht=null;r.rainWall!==!1&&(Ht=Ve(b.noseZ,o),z.add(Ht),v+=80),await t.yield();let dt=null;r.dome!==!1&&(dt=ke(o,R),dt.uniforms.uSea.value=r.farSea===!1?0:1,z.add(dt.mesh),v+=2200),await t.yield();const Ut=e=>new i.Vector3(e[0],e[1],e[2]),st=Vt.top.clone().addScaledVector(Vt.lean,97);st.y=225;const ie={entry:Ut(K[0]),flyThrough:K.map(Ut),portalSeat:{position:x.end.clone(),normal:x.axis.clone().multiplyScalar(-1),radius:7},nose:new i.Vector3(30,gt,b.noseZ(30)),lipNotch:new i.Vector3(k,199,xt),shift:k,canyon:{from:g.clone(),to:W.clone(),halfWidth:b.half,floorY:160},greatCurl:{mouth:x.stations[0].C.clone(),core:x.end.clone(),axis:x.axis.clone(),lips:x.stations.map(e=>e.C.clone()),radii:nt.slice(),arcStart:n.arcStart,lipDist:te.slice(),lipOff:ee.slice(),lipDrop:ae.slice()},heroBolt:{top:Vt.top.clone(),strike:st,u:Et,life:.33+2.5,channel:pt.channels[0].map(e=>e.clone())},boltSlots:Tt.slice(1).map(e=>e.top.clone()),arrivals:I.filter(e=>e.birth>=0).map(e=>({position:e.c.clone(),radius:e.R,u:e.birth,kind:e.tag})),pois:{faceAhead:new i.Vector3(k,215,-330),greatCurlCore:x.end.clone()},viewpoints:[{position:new i.Vector3(0,5,420),target:new i.Vector3(0,60,0),note:"entry: the wall"},{position:T.posAtDist(590),target:new i.Vector3(k+10,250,-340),note:"the blue staircase and the arrival at the lip"},{position:new i.Vector3(k,205,-450),target:x.end.clone(),note:"canyon: bolt right, whorl ahead-left"},{position:T.posAtDist(T.length-95),target:x.end.clone(),note:"the funnel"}],timeline:{duration:wt,arrival:Bt,bolt:Et,skyCurls:[.14,.3,.5,.6,.78]},bounds:{halfWidth:3300,front:70,back:-3250,crest:1300}},mt={u:0,manual:!1},jt=ot(r.boltEvery??(p==="night"?2:4),1.2,8),re=e=>1+(Math.imul(e+7,2654435761)>>>8)%(At-1),Mt=new i.Vector3,Ot=new i.Vector3,Zt=new i.Vector2,se=new i.Quaternion,le=new i.Vector3(0,0,1),It=new i.Vector3(0,240,60),ce=Object.keys(r).length===0&&Number(t.seed)>=9e3&&Number(t.seed)<1e4,de=(e,V)=>{o.uU.value=e;const D=(e-Et)*wt,O=pt.uniforms.uAge.value;O[0]=D>=0?D:-1;const _=Math.floor(V/jt);for(let et=1;et<At;et++){O[et]=-1;for(let lt=0;lt<8;lt++){const ct=_-lt;if(ct>=0&&re(ct)===et){O[et]=V-ct*jt;break}}}const q=D>=0?$(0,.1,D)*(1-$(.1,.4,D)):0;o.uFlash.value.set(st.x,st.y,st.z,q),C&&(o.uPrada.value.set(st.x,st.y,st.z,Math.max(0,D)*300),pt.uniforms.uKeep.value=1),dt&&(dt.uniforms.uStain.value=e);const Q=Y.uniforms.uWinBolt.value;Q.x=e>=oe?(e-oe)*wt:-1,Q.y=-1},qt={object:z,radius:260,height:100,center:It,anchors:ie,ground:!1,groundY:0,uniforms:o,palette:R,material:f,greatCurlMaterial:Y,dome:dt?dt.mesh:null,rainWall:Ht,bolts:pt.mesh,path:T,duration:wt,curls:I,stats:{curls:I.length,near:j,mid:a,hang:l,triangles:Math.round(v),clearance:Math.min(h,x.clear,tt.clear),stairLips:tt.lips,shift:k,colourway:p,prada:C},setProgress(e){mt.u=ot(e,0,1),mt.manual=!0},setPrada(e){o.uPrada.value.set(st.x,st.y,st.z,e),pt.uniforms.uKeep.value=e>0?1:0},update(e,V,D){if(o.uTime.value=V,ce&&!mt.manual){let O=Math.atan2(D.position.x-It.x,D.position.z-It.z);O<-.8&&(O+=Math.PI*2);const _=ot((O+.3)/4.712,0,1),q=_*T.length;T.posAtDist(q,D.position),T.posAtDist(q+30,Ot);const Q=.6*$(.64,.7,_)*(1-$(.9,.95,_));Ot.sub(D.position).normalize().lerp(Mt.copy(x.end).sub(D.position).normalize(),Q).add(D.position),D.lookAt(Ot),D.updateMatrixWorld(!0),mt.u=_}else mt.manual||(mt.u=V/wt%1);de(mt.u,V),z.updateMatrixWorld(),Mt.setFromMatrixPosition(D.matrixWorld),z.worldToLocal(Mt),dt&&(dt.mesh.position.copy(Mt),dt.uniforms.uCam.value.copy(Mt)),t.renderer.getDrawingBufferSize(Zt),pt.uniforms.uPix.value=2*Math.tan((D.fov||62)*Math.PI/360)/Math.max(Zt.y,1),bt.quaternion.copy(_t).multiply(se.setFromAxisAngle(le,V*.22))},dispose(){}};return z.userData.hero=qt,qt}async function Re(t,r,d,u,c){const p=new Wt,R=r.stations[0].C,o=r.end,C=[[u,-330],[u,-540],[R.x,R.z],[o.x,o.z]],z=(n,x)=>{let b=1e9;for(let m=0;m<3;m++){const s=C[m][0],M=C[m][1],y=C[m+1][0]-s,S=C[m+1][1]-M,A=ot(((n-s)*y+(x-M)*S)/(y*y+S*S),0,1);b=Math.min(b,Math.hypot(n-s-y*A,x-M-S*A))}return b},k=n=>J(33,165,$(110,1150,Math.abs(n))),G=d.atZ(0).x,N=[];for(let n=-3420;n<=3420;)N.push(n),n+=Math.abs(n+7.5-G)<315?15:120;const K=(n,x)=>{const b=Math.abs(n-d.atZ(x).x);return 118*(1-$(105,250,b))+8*Math.abs(Math.sin(n*Math.PI/52+1.3))*(1-$(255,300,b))},T=(n,x)=>{const b=gt-12-k(n)*.14;return b+J(34,76+Math.abs(n)*.012-b,1-$(330,520,Math.abs(n-G)))*x/396},g=(n,x,b)=>{const m=p.n,s=N.length;for(let M=0;M<n;M++)for(let y=0;y<s;y++){const S=x(N[y],M/(n-1));p.v(S[0],S[1],S[2],0,1,0,b,50,50,0,0,0)}for(let M=0;M<n-1;M++)for(let y=0;y<s-1;y++){const S=m+M*s+y;p.idx.push(S,S+s,S+1,S+1,S+s,S+s+1)}};g(8,(n,x)=>{const b=t.noseZ(n),m=K(n,b),s=m+x*(b-m-xt+14),M=b-s;let y=gt+Xt*s-12-k(n)*.14;const S=d.atZ(M);return y=Math.min(y,S.y-62+.27*Math.abs(n-S.x)),y=Math.max(y,T(n,s)+1.5*$(0,30,m)-60*(1-$(0,4,m))),[n,y,M]},1),await c.yield(),g(3,(n,x)=>{const b=t.noseZ(n),m=J(K(n,b),396,x);return[n,T(n,m),b-m]},0),await c.yield(),g(11,(n,x)=>{const b=xt-14+t.noseZ(n)*.5,m=J(b,-3300,Math.pow(x,1.5)),s=J(80,250,ot((-435-m)/1800,0,1));let M=t.towerTop(n,m)-s*.95-10;return M=J(42,M,$(250,420,z(n,m))),[n,M,m]},1),await c.yield();const W=p.build();return W.computeBoundingSphere(),{geometry:W,tris:p.idx.length/3}}export{Lt as BATIK_FADE_GLSL,Pt as BATIK_GLSL,Yt as batikPalette,$t as batikUniforms,Ce as buildHero,ve as shiftAt,Ct as styleMaterial};
