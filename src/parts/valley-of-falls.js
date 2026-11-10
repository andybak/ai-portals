import*as n from"three";import{clamp as Re,lerp as I,smoothstep as g}from"../kit/core.js";const fo=["#3f78c9","#cfe2f2","#8d949c","#f4f7fa","#3f7a3a","#d9c24a","#ff6fa8"],qe=330,ae=500,Kt=9.81,Be=`
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
float fb(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
float rstep(float hi, float lo, float x){ return 1.0 - smoothstep(lo, hi, x); }   // a falling smoothstep (edges in the wrong order are undefined in GLSL and break on Direct3D)
`,jo=`
float gnWarp(float al, float y){ return 20.0 * sin(al * 0.0113 + 1.7) + 12.0 * sin(al * 0.0271 + y * 0.0043 + 0.6) + 5.0 * sin(al * 0.063 + 4.1) + al * 0.05; }
float gnStr(float bi, float al){ return smoothstep(-0.25, 0.35, sin(al * 0.019 + bi * 2.4) + 0.5 * sin(al * 0.047 + bi * 5.3))
    * smoothstep(-0.55, -0.15, sin(al * 0.13 + bi * 3.7) + 0.6 * sin(al * 0.29 + bi * 1.9)); }   // (a break runs 20-50 m, then dies out: broken ledges, not contour lines)
float gnKind(float bi){ float c = cos(bi * 2.399 + 0.7); return step(0.25, c) - step(c, -0.35); }
// 3D value noise for the fine mottling: a 2D pattern laid along the wall has one direction in which it stands still, and a
// face that runs that way (the far side of a slot, a buttress flank) is combed with sideways strokes; in 3D no face is
float gnH3(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float gnN3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(gnH3(i), gnH3(i + vec3(1.0, 0.0, 0.0)), f.x), mix(gnH3(i + vec3(0.0, 1.0, 0.0)), gnH3(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
             mix(mix(gnH3(i + vec3(0.0, 0.0, 1.0)), gnH3(i + vec3(1.0, 0.0, 1.0)), f.x), mix(gnH3(i + vec3(0.0, 1.0, 1.0)), gnH3(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z); }
float gnF3(vec3 p){ return (0.5 * gnN3(p) + 0.25 * gnN3(p * 2.03 + 17.1) + 0.125 * gnN3(p * 4.12 + 51.8)) * 1.0714; }
vec3 gnGranite(vec3 base, float al, float alF, vec3 wp, float y, float px, float geo, float skK, out float hOut){
  float yb = y + gnWarp(al, y);
  float by = yb / 15.0, bi = floor(by), bf = by - bi;
  float kA = gnKind(bi), kB = gnKind(bi + 1.0), sA = gnStr(bi, al), sB = gnStr(bi + 1.0, al);
  float roofA = max(kA, 0.0) * sA, ledgeA = max(-kA, 0.0) * sA, roofB = max(kB, 0.0) * sB, ledgeB = max(-kB, 0.0) * sB;
  float f1 = 1.0 - smoothstep(1.5, 5.0, px), f2 = 1.0 - smoothstep(0.3, 1.1, px), f3 = 1.0 - smoothstep(0.07, 0.3, px);
  float e = clamp(px * 0.2, 0.12, 0.35), b1 = 1.0 - bf;
  float prof = roofA * b1 * sqrt(b1) * smoothstep(0.0, e, bf) + ledgeB * bf * sqrt(bf) * rstep(1.0, 1.0 - e, bf);
  float fw = smoothstep(0.4, 2.0, px);                                              // far away a shadow is a broad soft band, never a hairline
  float under = smoothstep(0.68 - 0.3 * fw, 1.0, bf); under *= under * roofB;       // the soft shadow a roof throws on the bed below it
  float lip = (1.0 - smoothstep(0.0, 0.12, bf)) * roofA;                            // the lit lower edge of an overhanging shell
  float top = smoothstep(0.86, 1.0, bf) * ledgeB;                                   // pale debris on a ledge
  float foot = (1.0 - smoothstep(0.0, 0.2, bf)) * ledgeA;                           // the wall just above a ledge
  // jointed blocks, two beds tall, staggered course by course
  float course = floor(bi * 0.5), bw = 24.0 * (1.0 + 0.35 * sin(course * 1.7 + 0.4));
  float jx = (al + 17.0 * sin(course * 2.399) + 3.5 * sin(y * 0.045 + course) + 1.3 * sin(y * 0.19 + course * 1.3) + 0.55 * sin(y * 0.47 + course * 4.1)) / bw, ji = floor(jx), jf = jx - ji;   // (a joint wanders a metre or two as it climbs: never a ruled line. The JS twin carries the same sines, so a real block's side wanders with its paint)
  float jb = ji + step(0.5, jf);
  float jd = min(jf, 1.0 - jf) * bw + (vn(vec2(y * 0.5, jb * 3.1)) - 0.5) * 0.7 * (1.0 - geo);   // (a ragged crack only where the joint is paint: where the blocks are real the side of a niche lies in the joint, and the ragged edge striped it like a comb)
  float jw = 0.3 + px * 1.3;
  float joint = (1.0 - smoothstep(jw * 0.3, jw, jd)) * step(0.4, h21(vec2(jb, course + 5.0))) * min(1.0, 0.45 / jw) * f1;
  float bt = h21(vec2(ji, course)) - 0.5, bh = h21(vec2(ji + 3.7, course + 1.3)) - 0.5;
  float big = fb(vec2(alF * 0.011 + 3.0, y * 0.013)), mid = fb(vec2(alF * 0.045 + 9.0, y * 0.06));
  float m6 = gnF3(wp * 0.17 + 11.0) - 0.5, m1 = gnF3(wp * vec3(0.7, 0.84, 0.7) + 5.0) - 0.5;
  float sp = gnN3(wp * 3.3) * gnN3(wp * 5.9 + 9.0);
  float gr = gnF3(wp * vec3(0.9, 0.1, 0.9) + 31.0) - 0.5;                             // weathering grain: fine, and it runs down the face
  // exfoliation arches: a wide soft shadow under each arc and a paler, fresher scar below it
  float ay = (y + 46.0 * cos(alF * 0.0105 + big * 5.0) + big * 120.0) / 74.0, ai = floor(ay), af = ay - ai;
  float aOn = step(0.45, h21(vec2(ai, 2.3))) * smoothstep(0.35, 0.55, vn(vec2(alF * 0.006 + ai * 5.1, ai * 2.3))) * (1.0 - smoothstep(3.0, 9.0, px));
  float aSh = smoothstep(0.8, 1.0, af); aSh *= aSh * aOn;
  float scar = smoothstep(0.25, 0.9, af) * (1.0 - aSh) * aOn;
  // water streaks: each hangs from a real break above this point and tapers to nothing below it
  float streak = 0.0, alw = alF + (vn(vec2(alF * 0.3, y * 0.08)) - 0.5) * 1.6;
  for (int k = 0; k < 4; k++) {
    float b = bi + 1.0 + float(k);
    float dn = b * 15.0 - yb, cx = alw / 6.5 + b * 0.37, ci = floor(cx), cf = cx - ci;
    float r1 = h21(vec2(ci, b * 1.3 + 2.0)), r2 = h21(vec2(ci + 9.0, b));
    float t = dn / (16.0 + 80.0 * r2 * r2), w = (0.14 + 0.3 * r2) * max(1.0 - t, 0.0);
    float d = abs(cf - 0.5 - (r1 - 0.5) * 0.4);
    streak = max(streak, step(0.42, r1) * abs(gnKind(b)) * gnStr(b, al) * (1.0 - smoothstep(w * 0.3, w + 0.02, d)) * clamp(1.0 - t, 0.0, 1.0) * step(t, 1.0));
  }
  float farS = smoothstep(0.55, 0.8, vn(vec2(alF * 0.11, y * 0.004 + 5.0)) * 0.65 + vn(vec2(alF * 0.27 + 3.0, y * 0.009)) * 0.35) * smoothstep(0.3, 0.62, mid);
  float sk = max(streak * (1.0 - smoothstep(1.2, 3.5, px)), farS * 0.6 * smoothstep(0.8, 3.0, px)) * skK;
  float lichen = smoothstep(0.56, 0.74, mid + 0.25 * m6) * f1;
  float m = 1.0 + (0.36 * bt * (1.0 - smoothstep(0.5, 1.6, px)) + 0.07 * sin(bi * 2.1 + 0.3) * (1.0 - smoothstep(0.8, 2.4, px)) + 0.26 * (big - 0.5) + 0.2 * (mid - 0.5)) * f1 + (0.34 * m6 + 0.28 * m1 + 0.3 * gr) * f2 + 0.5 * (sp - 0.25) * f3;
  m *= (1.0 - (0.46 - 0.14 * fw) * (1.0 - 0.6 * geo) * under * f1) * (1.0 + 0.2 * lip * f1 * (1.0 - 0.6 * geo)) * (1.0 + 0.16 * top * f1) * (1.0 - 0.22 * foot * f1) * (1.0 - mix(0.35, 0.5, smoothstep(0.2, 0.6, px)) * joint) * (1.0 - 0.36 * aSh);   // (a joint seen from under 80 m, a fifth of a metre to the pixel, is a soft seam: at full strength it was an ink line)
  vec3 c = base * max(m, 0.2);
  c *= mix(vec3(1.0), mix(vec3(0.92, 1.0, 1.1), vec3(1.09, 1.0, 0.89), clamp(0.5 + 1.2 * bh * (1.0 - smoothstep(0.5, 1.6, px)) + 1.5 * (big - 0.5), 0.0, 1.0)), 0.8 * f1);   // (a block's own tone only close up: from across the valley it tiles the wall into panels)
  c = mix(c, c * vec3(1.2, 1.17, 1.12) + 0.02, scar * 0.5);
  c *= mix(vec3(1.0), vec3(0.74, 0.78, 0.76), lichen * 0.55);
  c *= mix(vec3(1.0), vec3(0.42, 0.45, 0.53), sk * 0.8 * (1.0 - 0.6 * scar));
  hOut = 3.2 * prof * f1 * (1.0 - geo) - 0.9 * joint - 1.4 * aSh + (0.8 * m6 + 0.24 * m1) * f2;
  return c;
}`,Ko={H:15,D:3.2,warp:(u,w)=>20*Math.sin(u*.0113+1.7)+12*Math.sin(u*.0271+w*.0043+.6)+5*Math.sin(u*.063+4.1)+u*.05,str:(u,w)=>g(-.25,.35,Math.sin(w*.019+u*2.4)+.5*Math.sin(w*.047+u*5.3))*g(-.55,-.15,Math.sin(w*.13+u*3.7)+.6*Math.sin(w*.29+u*1.9)),kind:u=>{const w=Math.cos(u*2.399+.7);return w>=.25?1:w<=-.35?-1:0},block(u,w,f,p){const ie=Math.floor(f*.5),Pe=24*(1+.35*Math.sin(ie*1.7+.4)),Te=(u+17*Math.sin(ie*2.399)+3.5*Math.sin(w*.045+ie)+1.3*Math.sin(w*.19+ie*1.3)+.55*Math.sin(w*.47+ie*4.1))/Pe,ee=Math.floor(Te),he=Te-ee;return p.ji=ee,p.course=ie,p.jd=Math.min(he,1-he)*Pe,p.jb=ee+(he>=.5?1:0),p}},Do=`
float gfComet(vec2 q, float seed){
  float ci = floor(q.x), cf = q.x - ci;
  float r1 = h21(vec2(ci, seed)), r2 = h21(vec2(ci, seed + 7.3));
  float ph = q.y * (0.7 + 0.6 * r1) + r2 * 9.0;
  float pi = floor(ph), pf = ph - pi;
  float on = step(0.3, h21(vec2(ci * 1.7 + pi, seed + 3.1)));
  float len = 0.35 + 0.5 * h21(vec2(pi, ci + seed));
  float k = clamp(pf / len, 0.0, 1.0);
  float head = smoothstep(0.0, 0.05, pf) * (1.0 - k) * sqrt(max(1.0 - k, 0.0));
  float wd = mix(1.0, 0.35, k);
  float xs = (cf - 0.5) * 2.0 + (r2 - 0.5) * 0.3;
  return head * on * rstep(wd * 0.7, wd * 0.2, abs(xs));
}
vec4 gfWater(vec3 A, vec4 B, float sun, float t, float dist, vec3 sunCol, vec3 skyCol, float solid){
  float e = t - A.z;
  A.x = clamp(A.x, -1.0, 1.0);                                    // (antialiasing can carry the across coordinate past the ribbon's edge)
  float edge = 1.0 - abs(A.x);
  float fray = clamp(B.x / 140.0, 0.0, 1.0);                     // water breaks up as it falls
  float nearK = 1.0 - smoothstep(180.0, 520.0, dist);
  float nE = fb(vec2(A.y * 0.09 + 3.0, e * 0.8));                 // slow surges, ten metres across
  float nT = fb(vec2(A.y * 0.55 + 7.0, e * 2.6));                 // threads
  float cA = gfComet(vec2(A.y / 7.5 + 11.0, e * 0.55), 1.0);
  float cB = gfComet(vec2(A.y / 3.3 + 5.0, e * 0.8), 2.0) * nearK;
  float rim = edge - (0.02 + 0.1 * fray) + (nE - 0.5) * (0.2 + 0.3 * fray) + cA * 0.15;     // the rim moves in and out with the surges
  float body = smoothstep(0.0, 0.24, rim);
  float dens = body * (mix(1.05, 0.68, fray) + 0.7 * cA + 0.4 * cB + (nT - 0.5) * 0.6 * nearK + (nE - 0.5) * 0.65);
  float a = smoothstep(0.2, 0.72, dens);
  float core = smoothstep(0.02, 0.42, edge);
  float farA = smoothstep(0.0, 0.75, edge) * mix(0.5, 0.85, sun) * smoothstep(160.0, 560.0, dist) * clamp(0.62 + 1.3 * (nE - 0.4) + 0.5 * cA, 0.12, 1.0);   // from across the valley: a soft thread with gaps in it, rounded across its width, dimmer in shade
  a = max(a, farA);
  a = mix(a, max(a, smoothstep(-0.03, 0.2, rim) * (0.9 + 0.1 * cA)), solid);
  float runnel = 0.1 + 0.9 * smoothstep(0.42, 0.62, vn(vec2(A.y * 0.21 + 40.0, 3.3)) + 0.3 * (nE - 0.5));
  a *= mix(1.0, runnel, B.w) * B.z * (0.62 + 0.38 * B.y);        // on a bench, and just below its lip: separate strands; water that slides on rock is a thin film
  float white = max(clamp(dens * 0.95 + cA * 0.35, 0.0, 1.0), farA) * mix(0.45, 1.0, core) * (1.0 - 0.3 * smoothstep(-0.3, 1.0, A.x));   // the side away from the key is in shade
  float thr = clamp(0.6 * cA + 0.45 * cB + (nT - 0.32) * 0.9 * nearK + 0.34 * (1.0 - nearK) + (nE - 0.5) * 0.6, 0.0, 1.0);
  white = mix(white, max(white, (0.6 + 0.4 * thr) * mix(0.5, 1.0, core) * (1.0 - 0.24 * smoothstep(-0.2, 1.0, A.x))), solid);
  float cF = gfComet(vec2(A.y / 16.0 + 3.0, e * 0.3), 5.0);       // from 300 m and more the fine comets are under a pixel: broad pulses, fifty metres and more long, ride down the column instead
  white *= mix(1.0, 0.87 + 0.3 * cF, solid * smoothstep(250.0, 500.0, dist));
  white *= mix(1.0, 0.4 + 0.6 * smoothstep(0.0, 9.0, B.x + 3.0 * (nE - 0.5)), solid);   // over the brink the water is still glassy and blue-grey: the white column grows out of it and has no hard top edge
  vec3 cShade = vec3(0.52, 0.66, 0.86) * (skyCol * 0.95 + sunCol * 0.2 * sun);
  vec3 cLit = skyCol * 0.66 + sunCol * (0.08 + 0.84 * sun);        // white water in shade is still pale under the sky: a fall on the shaded wall reads as a blue-white ribbon
  vec3 c = mix(cShade, cLit, white);
  float n3 = vn(vec2(A.y * 1.3 + 3.0, e * 5.5));
  c += sunCol * sun * n3 * n3 * n3 * n3 * n3 * 0.8 * nearK;      // sparkle in the threads
  c *= mix(0.6, 1.0, smoothstep(0.0, 0.7, sun));                 // a fall in shade is never the brightest thing on its wall
  return vec4(c, a);
}`,Ho=`
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
}`;function uo(u){const w=u.rng,f=u.noise,p=u.wet??.8,ie=new n.Color(u.base??"#555a5f"),Pe=new n.Color(u.moss??"#2c4a26"),Te=new n.Color(u.dark??"#1b222b"),ee=new n.IcosahedronGeometry(1,u.detail??2).attributes.position.array,he=ee.length/3,Me=new Uint16Array(he),r=[],Ue=new Map;for(let j=0;j<he;j++){const K=Math.round(ee[j*3]*200)+","+Math.round(ee[j*3+1]*200)+","+Math.round(ee[j*3+2]*200);Ue.has(K)||(Ue.set(K,r.length/3),r.push(ee[j*3],ee[j*3+1],ee[j*3+2])),Me[j]=Ue.get(K)}const ne=r.length/3,D=new Float32Array(ne*3),_=new Float32Array(ne*3),de=new Float32Array(ne*3),U=u.P||[],Oe=u.C||[],ke=u.N||[],te=u.I||[],pe=new n.Color,We=new n.Color,_e={count:0,P:U,C:Oe,N:ke,I:te,add(j,K,re,H,me=1.5){const Qe=w()*50,$=w.range(.6,.9),Ke=w.range(.8,1.35),k=w()*6.28,se=Math.cos(k),$e=Math.sin(k),Ee=w.range(.25,.8);We.copy(ie).multiplyScalar(w.range(.78,1.12)),We.r*=w.range(.97,1.06),We.b*=w.range(.95,1.04);for(let d=0;d<ne;d++){const E=r[d*3],C=r[d*3+1],G=r[d*3+2],le=f.n3(E*2.9+Qe,C*2.9+7,G*2.9),X=1+.38*f.n3(E*1.2+Qe,C*1.2,G*1.2)+.2*le,ce=E*X*H*Ke,je=Math.max(C*X,-.4)*H*$,De=G*X*H;D[d*3]=j+ce*se-De*$e,D[d*3+1]=K+je,D[d*3+2]=re+ce*$e+De*se,_[d*3]=_[d*3+1]=_[d*3+2]=0,pe.copy(We).multiplyScalar((.6+.4*g(-.6,.7,C))*(.86+.5*(X-1))),pe.lerp(Pe,g(.35,.9,C*X)*Ee*(.6+.4*le)),pe.lerp(Te,p*g(me,me*.35,je+H*$*.4)),de[d*3]=pe.r,de[d*3+1]=pe.g,de[d*3+2]=pe.b}for(let d=0;d<he;d+=3){const E=Me[d]*3,C=Me[d+1]*3,G=Me[d+2]*3,le=D[C]-D[E],X=D[C+1]-D[E+1],ce=D[C+2]-D[E+2],je=D[G]-D[E],De=D[G+1]-D[E+1],xe=D[G+2]-D[E+2],He=X*xe-ce*De,Ve=ce*je-le*xe,L=le*De-X*je;_[E]+=He,_[E+1]+=Ve,_[E+2]+=L,_[C]+=He,_[C+1]+=Ve,_[C+2]+=L,_[G]+=He,_[G+1]+=Ve,_[G+2]+=L}for(let d=0;d<ne;d++){const E=Math.hypot(_[d*3],_[d*3+1],_[d*3+2])||1;_[d*3]/=E,_[d*3+1]/=E,_[d*3+2]/=E}const Se=U.length/3;for(let d=0;d<ne*3;d+=3)U.push(D[d],D[d+1],D[d+2]),ke.push(_[d],_[d+1],_[d+2]),Oe.push(de[d],de[d+1],de[d+2]);for(let d=0;d<he;d++)te.push(Se+Me[d]);_e.count++},geometry(){const j=new n.BufferGeometry;return j.setAttribute("position",new n.Float32BufferAttribute(U,3)),j.setAttribute("color",new n.Float32BufferAttribute(Oe,3)),j.setAttribute("normal",new n.Float32BufferAttribute(ke,3)),j.setIndex(te),j}};return _e}function Go(u={}){const w=new n.MeshStandardMaterial({vertexColors:!0,roughness:.94,metalness:0,...u});return w.onBeforeCompile=f=>{f.vertexShader=f.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vDp;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vDp = position;`),f.fragmentShader=f.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vDp;
`+Be).replace("#include <color_fragment>",`#include <color_fragment>
        {
          float rockK = 1.0 - smoothstep(0.015, 0.06, diffuseColor.g - max(diffuseColor.r, diffuseColor.b));   // trees and moss keep their own colour
          float lod = clamp(max(fwidth(vDp.y), max(fwidth(vDp.x), fwidth(vDp.z))) * 4.0, 0.0, 1.0);
          vec2 pa = vDp.xz * 0.9 + vDp.y * vec2(0.37, 0.53), pb = vDp.xy * 0.9 + vDp.z * vec2(0.41, 0.29);
          float g1 = vn(pa) * 0.6 + vn(pa * 2.3 + 4.0) * 0.4, g2 = vn(pb * 2.2 + 9.0) * 0.6 + vn(pb * 4.7) * 0.4, sp = vn(pa * 3.6) * vn(pb * 4.4);
          float crack = rstep(0.04, 0.0, abs(vn(pa * 0.7 + 3.0) * 0.7 + vn(pa * 1.6) * 0.3 - 0.5)) * smoothstep(0.3, 0.6, g2);
          diffuseColor.rgb *= mix(1.0, (0.76 + 0.5 * g1) * (0.86 + 0.3 * g2) * (1.0 - 0.5 * crack) * (0.9 + 0.5 * sp), rockK * (1.0 - lod));
        }`)},w}async function Eo(u,w={}){const f=u.rng.fork("great-fall"),p=u.noise,ie=(w.palette&&w.palette.length>=5?w.palette:fo).map(e=>new n.Color(e));for(;ie.length<7;)ie.push(new n.Color(fo[ie.length]));const[Pe,Te,ee,he,Me]=ie,r={y1:150+f.range(-14,14),y2:330+f.range(-18,18),s1:f.range(38,50),s2:f.range(32,42),wing:f.range(165,205),lean:f.range(.035,.06),strataH:f.range(19,27),crestAmp:f.range(40,70),tilt:f.range(-.6,.6),fx0:f.range(-10,10),fx1:0,fx2:0,wTop:25,wMid:f.range(54,64),wBot:f.range(84,98),twin:f.chance(.45),warm:f.range(0,1),o:[f.range(0,90),f.range(0,90),f.range(0,90),f.range(0,90),f.range(0,90)]};r.fx1=r.fx0+f.range(-9,9),r.fx2=r.fx1+f.range(-10,10);function Ue(e){const t=e*qe,o=Math.abs(e),a=r.wing*Math.pow(o,2.1),s=r.wing*2.1*Math.pow(o,1.1)*Math.sign(e),l=Math.hypot(qe,s),c=-s/l,h=qe/l;let y=550+r.crestAmp*p.fbm2(e*2.1+r.o[0],3.3,4)+45*o*(1+r.tilt*Math.sign(e))+22*p.ridged2(e*9+r.o[1],1.7,3);y=I(y,ae+30,.78*Math.exp(-((t/125)**2))),y=I(y,ae,Math.exp(-(((t-r.fx0)/38)**4)));const S=y*(1-Math.pow(g(.62,1,o),1.25)),x=Math.exp(-((t/175)**2)),F=1-Math.exp(-((t/75)**2));return{s:e,x:t,zc:a,nx:c,nz:h,crest:S,y1s:r.y1+30*F*p.fbm2(e*3+11,5.5,2),y2s:r.y2+34*F*p.fbm2(e*3+31,7.5,2),b1:r.s1*(.3+.7*x)*(1+.3*p.n2(e*4,2.2)),b2:r.s2*(.3+.7*x)*(1+.3*p.n2(e*4,6.2)),side:1-Math.exp(-((t/100)**2)),mid:.35+.65*(1-Math.exp(-((t/62)**2)))}}const ne=(e,t,o)=>{const a=Math.sin(e*127.1+t*311.7+o*74.7+r.o[3])*43758.5453;return a-Math.floor(a)},D={d:0,ao:0,tal:0,tone:0},_=40,de=28,U=new Float64Array((_*de+1)*6).fill(NaN),Oe=(e,t)=>{const o=e+20,a=t+10,s=o>=0&&o<_&&a>=0&&a<de,l=s?(a*_+o)*6:_*de*6;return s&&U[l]===U[l]||(U[l]=e+.5+.8*(ne(e,t,1)-.5),U[l+1]=t+.5+.8*(ne(e,t,2)-.5),U[l+2]=ne(e,t,3),U[l+3]=26*(ne(e,t,4)-.5),U[l+4]=44*.75*(ne(e,t,5)-.5),U[l+5]=150*.14*(ne(e,t,6)-.5)),l};function ke(e,t){const o=e.s,a=t<75?(1-Math.max(t,0)/75)**2:0,s=o+.045*p.n2(o*2.6+50,t*.0042),l=44*p.fbm2(s*2.4+r.o[2],t*.0012,2)*e.mid,c=s*(qe/44),h=t/150+s*.9,y=Math.floor(c),S=Math.floor(h);let x=1e9,F=0,B=0,v=0,z=0,M=0,q=0;for(let V=-1;V<=1;V++)for(let Q=-1;Q<=1;Q++){const oe=Oe(y+V,S+Q),ze=U[oe],Fe=U[oe+1],dt=(c-ze)*(c-ze)+(h-Fe)*(h-Fe);dt<x&&(x=dt,F=ze,B=Fe,v=U[oe+2],z=U[oe+3],M=U[oe+4],q=U[oe+5])}const W=1-g(.62,.9,Math.abs(o)),R=(z+(c-F)*M+(h-B)*q+5*(p.ridged2(s*5.6+r.o[3],t*.0026,2)-.4))*e.mid*I(.2,1,W),T=(t+16*p.n2(o*5,t*.004+9))/r.strataH,P=Math.floor(T),ue=T-P,Ie=6*(Math.pow(ue,1.6)-.4)*(.5+.5*p.n2(o*7,P*1.7)),fe=Math.floor(s*21+.4*p.n2(P*.9,3.1)),Le=1.6*p.n2(fe*1.37+20,P*2.31)+.8*p.n2(Math.floor(s*55+P*.37)*1.91,Math.floor(T*2)*1.13),qt=1*p.fbm2(o*42,t*.035,2),tt=(R+(Ie+Le)*W)*(1-a*.85)+qt*W,b=e.b1*g(e.y1s-7,e.y1s+7,t)+e.b2*g(e.y2s-7,e.y2s+7,t)+r.lean*t;return D.d=l+tt+a*62*e.side-b,D.ao=Re(z/26+(Ie/10+Le/12)*W,-1,1),D.tone=v,D.tal=a,D}let te=null;const pe={},We=["x","zc","nx","nz","crest","y1s","y2s","b1","b2","side","mid"];function _e(e){const t=Re((e/qe+1)*.5,0,1)*(te.length-1),o=Math.min(Math.floor(t),te.length-2),a=t-o,s=te[o],l=te[o+1];for(const c of We)pe[c]=s[c]+(l[c]-s[c])*a;return pe.s=e/qe,pe}const j=(e,t)=>{const o=_e(e);return o.zc+o.nz*ke(o,t).d},K=new n.Group;K.name="great-fall";const re=144,H=112,me=22,Qe=430,$=(re+1)*(H+1),Ke=(re/4+1)*(me+1),k=new Float32Array(($+Ke)*3),se=new Float32Array(($+Ke)*3),$e=new Float32Array($),Ee=new Float32Array($),Se=new Float32Array($),d=new Float32Array($);te=[];for(let e=0;e<=re;e++)te.push(Ue(e/re*2-1));await u.yield();for(let e=0,t=0;e<=re;e++){const o=te[e];for(let a=0;a<=H;a++,t++){const s=-8+(o.crest+8)*(a/H),l=ke(o,s);k[t*3]=o.x+o.nx*l.d,k[t*3+1]=s,k[t*3+2]=o.zc+o.nz*l.d,$e[t]=l.ao,Ee[t]=l.tal,Se[t]=l.d,d[t]=l.tone}await u.yield()}const E=re/4;for(let e=0,t=$;e<=E;e++){const o=te[e*4],a=e*4*(H+1)+H,s=Math.exp(-(((o.x-r.fx0)/40)**4));for(let l=0;l<=me;l++,t++){const c=l/me,h=Math.pow(g(I(0,.22,s),1,c),1.35),y=l===0?0:26*p.fbm2(o.s*4+40,c*3,3)*(1-s)*Math.sin(c*Math.PI);k[t*3]=k[a*3]-o.nx*c*Qe*.6,k[t*3+1]=(k[a*3+1]+8)*(1-h)-8+y,k[t*3+2]=k[a*3+2]-c*Qe*(.75+.25*o.nz)}}await u.yield();const C=new Uint32Array((re*H+E*me)*6);let G=0;for(let e=0;e<re;e++){for(let t=0;t<H;t++){const o=e*(H+1)+t,a=o+H+1;C[G++]=o,C[G++]=a,C[G++]=o+1,C[G++]=a,C[G++]=a+1,C[G++]=o+1}e%40===39&&await u.yield()}for(let e=0;e<E;e++)for(let t=0;t<me;t++){const o=$+e*(me+1)+t,a=o+me+1;C[G++]=o,C[G++]=a,C[G++]=o+1,C[G++]=a,C[G++]=a+1,C[G++]=o+1}const le=new n.BufferGeometry;le.setAttribute("position",new n.BufferAttribute(k,3)),le.setIndex(new n.BufferAttribute(C,1)),await u.yield();{const e=new Float32Array(k.length);for(let t=0;t<C.length;t+=3){const o=C[t]*3,a=C[t+1]*3,s=C[t+2]*3,l=k[s]-k[a],c=k[s+1]-k[a+1],h=k[s+2]-k[a+2],y=k[o]-k[a],S=k[o+1]-k[a+1],x=k[o+2]-k[a+2],F=c*x-h*S,B=h*y-l*x,v=l*S-c*y;e[o]+=F,e[o+1]+=B,e[o+2]+=v,e[a]+=F,e[a+1]+=B,e[a+2]+=v,e[s]+=F,e[s+1]+=B,e[s+2]+=v,t%6e3===5997&&await u.yield()}for(let t=0;t<e.length;t+=3){const o=Math.hypot(e[t],e[t+1],e[t+2])||1;e[t]/=o,e[t+1]/=o,e[t+2]/=o}le.setAttribute("normal",new n.BufferAttribute(e,3))}await u.yield();const X=le.attributes.normal.array,ce=ee.clone().lerp(Te,.03).multiply(new n.Color(.93,.875,.8)),je=ce.clone().multiply(new n.Color(1.16,1.02,.84)).lerp(new n.Color("#b9a58c"),.25*r.warm),De=ce.clone().lerp(he,.14),xe=ce.clone().multiplyScalar(.34).lerp(new n.Color("#141c26"),.42),He=Me.clone().multiplyScalar(.62),Ve=ce.clone().lerp(new n.Color("#a39a8c"),.5).multiplyScalar(.92),L=new n.Color,at=e=>e>r.y2+7?r.fx0:e>r.y1+7?I(r.fx1,r.fx0,g(r.y2-8,r.y2+7,e)):I(r.fx2,r.fx1,g(r.y1-8,r.y1+7,e)),vt=e=>e>r.y2+6?I(r.wTop*1.35,r.wTop,g(r.y2,ae,e)):e>r.y1+6?I(r.wMid*1.15,r.wTop*1.25,g(r.y1,r.y2,e)**.75):I(r.wBot,r.wMid*.9,g(0,r.y1,e)**1.3);for(let e=0,t=0;e<=re;e++){const o=te[e];for(let a=0;a<=H;a++,t++){const s=k[t*3],l=k[t*3+1],c=X[t*3+1],h=Math.max(e-2,0),y=Math.min(e+2,re),S=Math.max(a-2,0),x=Math.min(a+2,H),F=Re((Se[t]-.25*(Se[h*(H+1)+a]+Se[y*(H+1)+a]+Se[e*(H+1)+S]+Se[e*(H+1)+x]))/5,-1,1),B=p.fbm2(o.s*2.6+r.o[4],l*.004,2);L.copy(ce).lerp(je,g(-.5,.5,B)).lerp(De,g(0,.7,p.n2(o.s*9+5,l*.011))*.85);const v=g(.12,.6,p.fbm2(o.s*58+3,l*.0035,2))*g(.25,-.35,p.n2(o.s*6,l*.006+20));L.lerp(xe,.66*v),L.lerp(xe,.42*g(.15,.6,p.n2(o.s*6.5+80,l*.009)));const z=Math.abs(s-at(l))/(vt(l)*.5+16),M=p.n2(o.s*46+9,l*.003);L.lerp(xe,.92*g(3.1,.75,z+.9*M)*g(ae+10,ae-10,l)),L.lerp(xe,.55*g(95,18,l+30*M)*(1-Ee[t]*.5)),L.lerp(xe,.56*g(230,80,Math.abs(s-at(l))+70*M)*g(ae+40,ae-30,l)),L.lerp(Ve,Ee[t]*.85);const q=g(.42,.78,c);L.lerp(He,q*(.55+.35*p.n2(o.s*30,l*.05))*g(1.2,2.2,z+.6)),L.multiplyScalar(Re(.74+.2*$e[t]+(F<0?.4:.16)*F+.22*d[t]*(1-Ee[t]),.36,1.15)),se[t*3]=L.r,se[t*3+1]=L.g,se[t*3+2]=L.b,a===56&&await u.yield()}await u.yield()}await u.yield();for(let e=$;e<$+Ke;e++){const t=k[e*3+1],o=X[e*3+1];L.copy(ce).lerp(He,g(.55,.9,o)*.8).lerp(Ve,g(120,0,t)*.5).multiplyScalar(.8+.2*p.n2(k[e*3]*.02,k[e*3+2]*.02)),se[e*3]=L.r,se[e*3+1]=L.g,se[e*3+2]=L.b}le.setAttribute("color",new n.BufferAttribute(se,3)),await u.yield();const Et=new n.MeshStandardMaterial({vertexColors:!0,roughness:.93,metalness:0});Et.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vHp;
varying float vSteep;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vHp = position;
vSteep = 1.0 - smoothstep(0.45, 0.75, abs(normal.y));`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vHp;
varying float vSteep;
float gfH;
`+Be+jo).replace("#include <color_fragment>",`#include <color_fragment>
        {
          float along = vHp.x + vHp.z * 0.6 * clamp(vHp.x / 70.0, -1.0, 1.0);   // (mirrored about the fall: on either wing, which runs toward the camera, the paint keeps moving along the face and never smears)
          float lod = clamp(max(fwidth(vHp.y) * 0.22, fwidth(along) * 0.1), 0.0, 1.0);   // fade detail that would alias, up the wall or along it (a wing seen at a grazing angle)
          float warp = fb(vec2(along * 0.006, vHp.y * 0.01)) * 34.0;
          float by = (vHp.y + warp) / 7.5, bi = floor(by), bf = by - bi;      // bedding: sawtooth ledges
          float bedTone = h21(vec2(bi, 3.0));
          float course = floor(by / 3.0);
          float jx = (along + h21(vec2(course, 9.0)) * 40.0 + warp * 0.3) / 12.0, ji = floor(jx), jf = jx - ji;
          float blockTone = h21(vec2(ji, course)) * (1.0 - lod);              // jointed blocks
          float jl = rstep(0.07, 0.0, min(jf, 1.0 - jf)) * step(0.35, h21(vec2(ji, course + 5.0))) * (1.0 - lod);
          float bedMask = step(0.42, h21(vec2(bi, 7.0)));                        // only some beds form a real ledge
          float under = (1.0 - smoothstep(0.0, 0.14, bf)) * bedMask * (1.0 - lod);         // shadow line under each ledge
          float grain = fb(vec2(along, vHp.y) * 0.8) * 0.6 + fb(vec2(along * 0.21 + 31.0, vHp.y * 0.09)) * 0.4;
          float nearK = 0.45 + 0.55 * smoothstep(120.0, 420.0, length(vViewPosition));        // bedding and joints fade at close range (no brick courses)
          float stain = fb(vec2(along * 0.045, vHp.y * 0.0028 + 5.0));                         // vertical mineral stains
          float fx_ = along / 37.0 + fb(vec2(along * 0.012, vHp.y * 0.017)) * 1.6;
          float frac = rstep(0.06, 0.0, abs(fract(fx_) - 0.5)) * step(0.4, h21(vec2(floor(fx_), 4.0))) * (1.0 - lod);   // wandering vertical fractures
          float detail = (0.95 + 0.05 * bedTone * nearK) * (0.98 + 0.03 * blockTone * nearK) * (1.0 - 0.1 * under * nearK) * (1.0 - 0.07 * jl * nearK)
            * (0.88 + 0.24 * grain) * (0.8 + 0.34 * stain) * (1.0 - 0.3 * frac);
          float ledgeH = smoothstep(0.0, 0.16, bf) - smoothstep(0.78, 1.0, bf);    // continuous, so the bump has no spikes
          gfH = (ledgeH * bedMask * 0.4 * nearK + grain * 0.45 + stain * 0.3) * (1.0 - lod) * vSteep;      // bedding only on cliff faces, not on benches, talus or the back slope
          diffuseColor.rgb *= mix(0.95, detail, (1.0 - lod) * (0.25 + 0.75 * vSteep)) * mix(vec3(0.5, 0.56, 0.66), vec3(1.0), smoothstep(-10.0, 150.0, vHp.y + warp));   // spray-wet foot
          // the valley's granite (roofs, ledges, streaks, warm and cool blocks) carried onto the head wall, so the three walls are one rock
          float gnPx = max(length(vec2(dFdx(along), dFdx(vHp.y))), length(vec2(dFdy(along), dFdy(vHp.y)))), gnHh = 0.0;
          vec3 gnC = gnGranite(vec3(1.0), along, along, vHp, vHp.y, gnPx, 0.0, 1.0, gnHh);
          float gnK = vSteep * (1.0 - smoothstep(4.0, 9.0, gnPx)) * smoothstep(0.0, 60.0, vHp.y);
          diffuseColor.rgb *= mix(vec3(1.0), gnC, 0.85 * gnK);
          gfH += 0.3 * gnHh * gnK;
        }`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        {
          vec3 dpx = dFdx(-vViewPosition), dpy = dFdy(-vViewPosition);
          float hx = dFdx(gfH), hy = dFdy(gfH);
          vec3 r1 = cross(dpy, normal), r2 = cross(normal, dpx);
          float det = dot(dpx, r1);
          vec3 grad = sign(det) * (hx * r1 + hy * r2);
          float fadeB = 1.0 - smoothstep(140.0, 600.0, length(vViewPosition));
          vec3 nb = abs(det) * normal - 1.0 * fadeB * grad;
          if (dot(nb, nb) > 1e-16) normal = normalize(nb);
        }`)};const Vt=new n.Mesh(le,Et);Vt.name="head-wall",K.add(Vt);const nt=[],gt=[],wt=[],yt=[],ho=(e,t,o,a,s,l,c,h,y,S,x,F)=>{const B=a-e,v=s-t,z=l-o,M=c-e,q=h-t,W=y-o;let R=v*W-z*q,Y=z*M-B*W,T=B*q-v*M;const P=Math.hypot(R,Y,T)||1;R/=P,Y/=P,T/=P;const ue=nt.length/3;yt.push(ue,ue+1,ue+2),nt.push(e,t,o,a,s,l,c,h,y),gt.push(S.r,S.g,S.b,x.r,x.g,x.b,F.r,F.g,F.b),wt.push(R,Y,T,R,Y,T,R,Y,T)},It=new n.Color("#2f5a33").multiplyScalar(.34).lerp(new n.Color("#0d2417"),.4),Lt=new n.Color("#2f5a33").multiplyScalar(.8).lerp(Me,.2),xt=new n.Color,Rt=new n.Color,be=f.fork("bench-trees");function po(e,t,o,a){const c=be()*6.28,h=be(),y=be.range(.13,.17);xt.copy(It).lerp(Lt,.1+.25*h),Rt.copy(It).lerp(Lt,.5+.4*h);for(let S=0;S<3;S++){const x=t+a*(.08+.27*S),F=t+a*(.5+.25*S),B=a*y*(1-.26*S);for(let v=0;v<5;v++){const z=c+v/5*6.2832+S*.7,M=z+6.2832/5,q=1+.3*Math.sin(v*2.4+S*1.7+h*9),W=1+.3*Math.sin((v+1)*2.4+S*1.7+h*9);ho(e+Math.cos(z)*B*q,x-(q-1)*a*.1,o+Math.sin(z)*B*q,e,F,o,e+Math.cos(M)*B*W,x-(W-1)*a*.1,o+Math.sin(M)*B*W,xt,Rt,xt)}}}const mo=(e,t,o)=>Math.abs(e-at(t))<vt(t)*.5+o;let bt=0;for(let e=0;e<9e3&&bt<560;e++){e%80===79&&await u.yield();const t=be.chance(.2),o=t?$+be.int(0,Ke-1):be.int(0,$-1),a=k[o*3],s=k[o*3+1],l=k[o*3+2],c=X[o*3+1];if(s<4||c<(t?.6:.56)||!t&&mo(a,s,30)||!t&&s<60&&Math.hypot(a,l-40)<150||p.n2(a*.012+3,l*.012+s*.01)<-.05)continue;const h=be.range(10,17)*(s>420?.8:1);po(a+be.range(-3,3),s-1.2,l+be.range(-3,3),h),bt++,bt%5===4&&await u.yield()}await u.yield();{const t=X.slice(0,$*3),o=se.slice(0,$*3);for(let a=0;a<=re;a++){const s=g(.52,.72,Math.abs(te[a].s));if(!(s<=0)){for(let l=0;l<=H;l++){let c=0,h=0,y=0,S=0,x=0,F=0,B=0;for(let Y=-5;Y<=5;Y++){const T=(Math.min(re,Math.max(0,a+Y))*(H+1)+l)*3,P=6-Math.abs(Y);c+=t[T]*P,h+=t[T+1]*P,y+=t[T+2]*P,S+=o[T]*P,x+=o[T+1]*P,F+=o[T+2]*P,B+=P}const v=(a*(H+1)+l)*3,z=Math.sqrt(c*c+h*h+y*y)||1,M=I(t[v],c/z,s),q=I(t[v+1],h/z,s),W=I(t[v+2],y/z,s),R=Math.sqrt(M*M+q*q+W*W)||1;X[v]=M/R,X[v+1]=q/R,X[v+2]=W/R,se[v]=I(o[v],S/B,s),se[v+1]=I(o[v+1],x/B,s),se[v+2]=I(o[v+2],F/B,s)}a%8===7&&await u.yield()}}}await u.yield();const Ut={rng:f,noise:p,base:ee.clone().multiplyScalar(.8).lerp(new n.Color("#b9a58c"),.12),moss:He,dark:xe.clone().lerp(ee,.22),wet:.6,P:nt,C:gt,N:wt,I:yt},vo=uo(Ut),go=uo({...Ut,detail:1}),m={x:r.fx2*.6,z:44,rx:f.range(96,112),rz:f.range(70,84)},Mt=[];let wo=0;const kt={add:async(e,t,o,a,s,l)=>{const c=Math.abs(e-m.x)<75&&o>m.z+10;(a>(c?2.4:5.5)?vo:go).add(e,t,o,a,s),l&&Mt.push([e,o,a]),++wo%2===1&&await u.yield()}};let Ot=0;for(let e=0;e<1500&&Ot<105;e++){const t=f()*6.2832,o=f.range(.92,1.5)**1.5,a=m.x+Math.cos(t)*m.rx*o+f.range(-8,8),s=m.z+Math.sin(t)*m.rz*o+f.range(-8,8);if(Math.abs(a)<34&&s>60||Math.abs(a)>300)continue;const l=j(a,2);if(s<l-6)continue;let c=f.range(2.2,6.5)*(f.chance(.08)?2.1:1);Math.abs(a-m.x)<80&&s>m.z&&(c=Math.min(c,4.6));const h=Math.max(0,s<l+30?(1-(s-l)/30)*14:0);await kt.add(a,h-c*.15,s,c,1.6,h<.5&&Math.hypot((a-m.x)/m.rx,(s-m.z)/m.rz)<.84),Ot++}for(let e=0;e<7;e++)await kt.add(r.fx2+f.range(-45,45),-.5,j(r.fx2,1)+f.range(14,40),f.range(3,7),3.5,!0);for(let e=0;e<46;e++){const t=f()**1.4,o=I(m.z+m.rz*.8,330,t),a=f.sign(),s=I(62,30,Math.sqrt(t))*.5,l=f.range(-2,9);await kt.add(m.x*(1-t)+a*(s+l),-.3,o,f.range(1.2,3.6)*(f.chance(.1)?1.8:1),1.3,l<-.4&&t<.8)}await u.yield();const Ye=new n.BufferGeometry;Ye.setAttribute("position",new n.Float32BufferAttribute(nt,3)),await u.yield(),Ye.setAttribute("color",new n.Float32BufferAttribute(gt,3)),await u.yield(),Ye.setAttribute("normal",new n.Float32BufferAttribute(wt,3)),Ye.setIndex(yt),await u.yield();const Qt=new n.Mesh(Ye,Go({side:n.DoubleSide}));Qt.name="trees-and-boulders",K.add(Qt),await u.yield();const $t=new n.Vector3(-Math.sin(.262)*Math.cos(.384),Math.sin(.384),Math.cos(.262)*Math.cos(.384)).normalize();let St=!1;const A={time:{value:0},bow:{value:1},second:{value:.02},gust:{value:1},ceil:{value:150},veil:{value:1},reach:{value:1},near:{value:0},sunDir:{value:$t.clone()},sunColor:{value:new n.Color(w.sunColor||"#fff1d6")},skyColor:{value:w.skyColor?new n.Color(w.skyColor):Pe.clone().lerp(Te,.6)},inv:{value:new n.Matrix4}};if(w.sunDir){const e=w.sunDir;A.sunDir.value.set(e.x??e[0],e.y??e[1],e.z??e[2]).normalize(),St=!0}const Xe=()=>n.UniformsUtils.clone(n.UniformsLib.fog),At=[],Ct=[],zt=[],Yt=[];let Ft=0;async function Bt({xAt:e,wAt:t,yTop:o,yBot:a,v0:s,vLip:l=3.4,ncol:c,benches:h=[],river:y=0,tau0:S=0,thin:x=1}){const F=Ft,B=new Float32Array(c+1),v=new Float32Array(c+1),z=new Float32Array(c+1),M=[];for(let b=o;b>a;){M.push(b);let V=4;for(const Q of h)Math.abs(b-Q)<12&&(V=1.6);b-=V}M.push(a);const q=a>20?24:0,W=(b,V)=>_e(e(b)+(V/c*2-1)*t(b)*.5);let R=0;for(let b=y;b>=1;b--){for(let V=0;V<=c;V++){const Q=W(o,V),oe=ke(Q,o).d,ze=V/c*2-1,Fe=b*9;At.push(Q.x+Q.nx*oe,o+1.4,Q.zc+Q.nz*oe-Fe),Ct.push(ze,ze*t(o)*.5,S-Fe/7),zt.push(0,0,g(y,y-4,b),0),Ft++}R++,b%3===0&&await u.yield()}let Y=o,T=S,P=0,ue=0,Ie=!0,fe=!1,Le=0,qt=0,tt=99;for(const b of M){!fe&&P<h.length&&b<h[P]+7&&(fe=!0,Le=b,T+=Math.sqrt(2*(Y-b)/Kt),z.set(v)),fe&&b<h[P]-8&&(fe=!1,T+=2.6,Y=b,P++,ue++,Ie=!0,tt=0);const V=fe?0:Y-b,Q=Math.sqrt(2*V/Kt),oe=(ue===0?s:l)*Q,ze=fe?T+2.6*(Le-b)/Math.max(1,Le-(h[P]-8)):T+Q,Fe=!fe&&P<h.length?.6*g(h[P]+24,h[P]+7,b):0,dt=fe?1:Math.max(Fe,ue>0?.9*Math.exp(-V/38):0),Bo=x*(q?g(a,a+q,b):1),io=c>=8?1:0;for(let ye=0;ye<=c;ye++){const ot=W(b,ye),pt=ke(ot,b).d,lo=ye/c*2-1,Po=io*(.5+.5*p.n2(ye*.83+3.1,ue*7.3+11.9)),Wt=io*p.n2(ye*.71+9.7,ue*5.1+2.3),co=Wt>0?6*Wt:10*Wt,To=Bo*(fe?g(h[P]-7+co,h[P]+1+co,b):g(-.4,4.5,tt-7*Po));Ie&&(B[ye]=pt);const mt=fe?Math.max(pt+2.4,z[ye]):Math.max(pt+2.4,B[ye]+oe);v[ye]=mt;const _o=b===o?1.4:b<1?.6:0;At.push(ot.x+ot.nx*mt,b+_o,ot.zc+ot.nz*mt),Ct.push(lo,lo*t(b)*.5,ze),zt.push(V,g(0,8,mt-pt-2.4),To,dt),Ft++}tt++,Ie=!1,R++,++qt%3===2&&await u.yield()}for(let b=0;b<R-1;b++)for(let V=0;V<c;V++){const Q=F+b*(c+1)+V,oe=Q+c+1;Yt.push(Q,Q+1,oe,Q+1,oe+1,oe)}await u.yield()}if(await Bt({xAt:at,wAt:vt,yTop:ae,yBot:0,v0:4.2,ncol:16,benches:[r.y2,r.y1],river:11}),await u.yield(),r.twin){const e=r.fx0+f.sign()*f.range(20,27),t=f.range(4,7);await Bt({xAt:()=>e,wAt:o=>t*(1+(ae-o)/260),yTop:_e(e).crest-1,yBot:r.y2-4,v0:2.6,ncol:4,tau0:3})}const Pt=[];for(let e=f.int(1,3),t=0;Pt.length<e&&t<30;t++){const o=f.sign()*f.range(85,250);if(Pt.some(x=>Math.abs(x-o)<45))continue;Pt.push(o);const a={..._e(o)},s=f.range(2.2,4.2),l=a.crest-f.range(2,60),c=f.chance(.5)?a.y1s-6:6,h=f.range(-5,5),y=f()*9,S=f.range(.42,.6);await Bt({xAt:x=>o+h*Math.sin(x*.006)+2.5*p.n2(x*.012,o),wAt:x=>s*(1+(l-x)/650),yTop:l,yBot:c,v0:1.2,vLip:1.2,ncol:3,benches:[a.y2s,a.y1s].filter(x=>x<l-20&&x>c+20),tau0:y,thin:S})}await u.yield();const Ze=new n.BufferGeometry;Ze.setAttribute("position",new n.Float32BufferAttribute(At,3)),Ze.setAttribute("aA",new n.Float32BufferAttribute(Ct,3)),Ze.setAttribute("aB",new n.Float32BufferAttribute(zt,4)),Ze.setIndex(Yt);const yo=new n.ShaderMaterial({transparent:!0,depthWrite:!1,side:n.DoubleSide,fog:!0,uniforms:{...Xe(),uTime:A.time,uSun:A.sunDir,uSunCol:A.sunColor,uSkyCol:A.skyColor},vertexShader:`
      attribute vec3 aA; attribute vec4 aB;
      varying vec3 vA; varying vec4 vB; varying float vSun, vDist, vFoot;
      uniform vec3 uSun; uniform float uTime;
      #include <fog_pars_vertex>
      void main(){
        vA = aA; vB = aB;
        vec3 n = normalize(mat3(modelMatrix) * vec3(0.0, 0.3, 0.95));
        vSun = clamp(dot(n, uSun) * 1.5 + 0.2, 0.0, 1.0);
        vec3 p = position;
        vFoot = smoothstep(0.0, 20.0, p.y);                                 // the foot of the fall dissolves: the spray cloud takes over
        float swy = aB.y * min(aB.x, 170.0) * 0.02;                       // free-falling water sways in the wind
        p.x += sin(uTime * 0.45 + aB.x * 0.02 + aA.z * 0.3) * swy;
        p.z += (0.5 + 0.5 * sin(uTime * 0.31 + aB.x * 0.013)) * swy * 0.6;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        vDist = length(mvPosition.xyz);
        vec4 mvNear = mvPosition; mvNear.xyz *= 1.0 - min(0.4, 9.0 / max(vDist, 1.0));   // depth only: rock that stands a few metres proud of the sheet must not punch dark shards through it
        gl_Position = projectionMatrix * mvPosition;
        vec4 clipNear = projectionMatrix * mvNear; gl_Position.z = clipNear.z / clipNear.w * gl_Position.w;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime; uniform vec3 uSunCol, uSkyCol;
      varying vec3 vA; varying vec4 vB; varying float vSun, vDist, vFoot;
      #include <fog_pars_fragment>
      ${Be}
      ${Do}
      void main(){
        vec4 w = gfWater(vA, vB, vSun, uTime, vDist, uSunCol, uSkyCol, smoothstep(0.62, 0.9, vB.z));   // the Great Fall and its twin are heavy water; the thin strands on the wall stay threads
        w.a *= vFoot;
        if (w.a < 0.01) discard;
        gl_FragColor = w;
        #include <fog_fragment>
      }`}),Tt=new n.Mesh(Ze,yo);Tt.name="falls",Tt.renderOrder=2,K.add(Tt),await u.yield();const O=j(r.fx2,2),Je=[],rt=[],st=[],it=10,ve=56;Je.push(m.x,.45,m.z),rt.push(1);for(let e=1;e<=it;e++)for(let t=0;t<ve;t++){const o=t/ve*6.2832,a=e/it,s=1+.16*p.n2(Math.cos(o)*1.6+9,Math.sin(o)*1.6)*a;Je.push(m.x+Math.cos(o)*m.rx*a*s,.45,m.z+Math.sin(o)*m.rz*a*s),rt.push(e===it?0:1)}for(let e=0;e<ve;e++)st.push(0,1+(e+1)%ve,1+e);for(let e=1;e<it;e++)for(let t=0;t<ve;t++){const o=1+(e-1)*ve+t,a=1+(e-1)*ve+(t+1)%ve,s=o+ve,l=a+ve;st.push(o,a,s,a,l,s)}const Z={z0:m.z+m.rz*.72,z1:340,w0:62,w1:30,amp:f.range(4,9),ph:f()*6},_t=e=>{const t=(e-Z.z0)/(Z.z1-Z.z0);return m.x*(1-t)+Z.amp*Math.sin(t*3.3+Z.ph)*t},xo=Je.length/3,jt=40,Ge=8;for(let e=0;e<=jt;e++)for(let t=0;t<=Ge;t++){const o=e/jt,a=I(Z.z0,Z.z1,o),s=I(Z.w0,Z.w1,Math.sqrt(o))*(1+.12*p.n2(o*5,3.3));Je.push(_t(a)+(t/Ge*2-1)*s*.5,.4,a),rt.push((t===0||t===Ge?0:t===1||t===Ge-1?.55:1)*g(1,.86,o))}for(let e=0;e<jt;e++)for(let t=0;t<Ge;t++){const o=xo+e*(Ge+1)+t,a=o+Ge+1;st.push(o,a,o+1,o+1,a,a+1)}const lt=new n.BufferGeometry;lt.setAttribute("position",new n.Float32BufferAttribute(Je,3)),lt.setAttribute("aE",new n.Float32BufferAttribute(rt,1)),lt.setIndex(st);const bo=new n.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,uniforms:{...Xe(),uTime:A.time,uSun:A.sunDir,uSunCol:A.sunColor,uSkyCol:A.skyColor,uFoot:{value:new n.Vector2(r.fx2,O+10)},uDeep:{value:Pe.clone().multiplyScalar(.22).lerp(new n.Color("#0a3338"),.55)}},vertexShader:`
      attribute float aE; varying float vE; varying vec3 vHp; varying vec3 vW;
      #include <fog_pars_vertex>
      void main(){
        vE = aE; vHp = position; vW = (modelMatrix * vec4(position, 1.0)).xyz;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime; uniform vec3 uSun, uSunCol, uSkyCol, uDeep; uniform vec2 uFoot;
      varying float vE; varying vec3 vHp; varying vec3 vW;
      #include <fog_pars_fragment>
      ${Be}
      void main(){
        vec2 p = vHp.xz; vec2 rel = p - uFoot; float r = length(rel * vec2(0.8, 1.25));
        float near = min(rstep(95.0, 8.0, r), mix(0.45, 0.6, rstep(60.0, 30.0, r)));   // (capped: the boil at the foot is torn foam, not a solid white bar across the far shore)
        float w1 = fb(p * 0.07 + vec2(0.0, uTime * 0.22));
        float ph = r * 0.3 - uTime * 1.9 + w1 * 6.0;
        float rip = sin(ph) * 0.5 + 0.5;
        float flow = fb(vec2(p.x * 0.16, p.y * 0.05 - uTime * 0.38));
        vec3 V = normalize(cameraPosition - vW);
        float fres = pow(max(1.0 - clamp(V.y, 0.0, 1.0), 0.0), 3.0);
        vec3 c = mix(uDeep, uDeep * 2.1 + vec3(0.02, 0.12, 0.11), flow * 0.75 + rip * 0.25 * near);
        // the mirror: dark wet wall low down, sky higher, broken by the swell that the fall drives outward
        float slope = (rip - 0.5) * (0.25 + 0.6 * near) + (fb(p * 0.33 + vec2(uTime * 0.3, -uTime * 0.5)) - 0.5) * 0.7;
        vec3 refl = mix(uSkyCol * vec3(0.3, 0.36, 0.46), uSkyCol * 0.9, smoothstep(-0.25, 0.3, slope));
        c = mix(c, refl, clamp(fres * 0.62 + 0.05, 0.0, 1.0));
        float foamN = fb(p * 0.11 + vec2(w1 * 1.5, uTime * 0.5)) * 0.65 + rip * 0.2 * near + flow * 0.25;
        float foam = smoothstep(0.92 - near * 0.8, 1.02 - near * 0.62, foamN + near * 0.32);
        foam = max(foam, smoothstep(0.62, 0.8, flow) * 0.45 * (0.3 + 0.7 * near));
        // concentric foam rings riding the swell away from the foot of the fall, torn into arcs
        float ringK = rstep(190.0, 30.0, r) * smoothstep(0.3, 0.62, fb(p * 0.06 + vec2(3.0, uTime * 0.1)) + 0.25 * near);
        float ring = smoothstep(0.82, 0.98, rip) * smoothstep(0.32, 0.6, fb(p * 0.45 + vec2(0.0, uTime * 0.25)));
        foam = max(foam, ring * ringK * 0.8);
        // sheets of blown spray scudding over the surface
        float sheet = smoothstep(0.56, 0.8, fb(vec2(p.x * 0.035 + uTime * 0.05, p.y * 0.012 - uTime * 0.16))) * rstep(210.0, 60.0, r);
        foam = max(foam, sheet * 0.3);
        // churned white water streaming out from the foot in long streaks, down the pool and into the outflow (they thin with distance from the foot)
        // (lanes that wander with the swell, torn along their length into rafts a few metres long and frothy inside: foam, not painted strokes)
        float lane = fb(vec2(p.x * 0.42 + w1 * 2.6 + 0.9 * sin(p.y * 0.07 + w1 * 5.0), p.y * 0.06 - uTime * 0.6)), lane2 = fb(vec2(p.x * 0.8 + 7.0, p.y * 0.22 - uTime * 1.3));
        float streaks = smoothstep(0.5, 0.86, lane) * smoothstep(0.34, 0.7, lane2) * (0.45 + 0.55 * fb(p * 1.3 + vec2(w1, -uTime * 0.9))) * rstep(250.0, 50.0, r);
        foam = max(foam, streaks * 0.5);
        float sunUp = clamp(uSun.y * 3.0, 0.0, 1.0);
        vec3 foamC = vec3(0.95, 0.98, 1.0) * (uSkyCol * 0.5 + uSunCol * (0.2 + 0.8 * sunUp));
        c = mix(c, foamC, foam * smoothstep(0.0, 0.55, vE));
        // sun glints: facets of the chop that happen to face the sun (it stands behind the viewer, so no single glitter path)
        float gd = length(cameraPosition - vW), gs = mix(7.0, 2.2, smoothstep(30.0, 300.0, gd));          // finer close up, so a glint is a spark and never a flake
        float gl = vn(p * gs + vec2(uTime * 0.9, -uTime * 2.1)) * vn(p * gs * 0.47 + vec2(-uTime * 0.6, 3.0 + uTime * 0.8));
        float glN = rstep(90.0, 40.0, gd);                               // close to the camera: half as many, so they are sparks on the chop, not scattered salt
        float glK = smoothstep(0.6 + 0.11 * glN, 0.72 + 0.11 * glN, gl) * smoothstep(0.55, 0.9, rip + flow * 0.4) * sunUp * (1.0 - 0.5 * glN);
        c += uSunCol * 1.5 * glK;
        gl_FragColor = vec4(c, smoothstep(0.0, 0.75, vE) * 0.94);
        #include <fog_fragment>
      }`}),Dt=new n.Mesh(lt,bo);Dt.name="plunge-pool",Dt.renderOrder=1,K.add(Dt),await u.yield();const Mo=w.mist??1,ko=new n.Vector3(m.x,12,O+90),i=f.fork("plume");function So(){const e=[],t=[],o=[],a=[],s=[],l=[];let c=0;return{puff(h,y,S,x,F,B,v,z,M,q,W,R=i()){const Y=i();for(let T=0;T<4;T++)e.push(T===0||T===3?-1:1,T<2?-1:1,0),t.push(h,y,S),o.push(x,F,B),a.push(v,z,R,1/M),s.push(q,Y,W);l.push(c,c+1,c+2,c,c+2,c+3),c+=4},geometry(){const h=new n.BufferGeometry;return h.setAttribute("position",new n.Float32BufferAttribute(e,3)),h.setAttribute("aBase",new n.Float32BufferAttribute(t,3)),h.setAttribute("aVel",new n.Float32BufferAttribute(o,3)),h.setAttribute("aP",new n.Float32BufferAttribute(a,4)),h.setAttribute("aQ",new n.Float32BufferAttribute(s,3)),h.setIndex(l),h}}}const Xt=So(),ge=Xt.puff,Ae=r.fx2,J=()=>i.gauss(),ct=Re(w.detail??1,.5,1);for(let e=0;e<Math.round(90*ct);e++)ge(Ae+J()*60,i.range(10,50),O+i.range(14,62),J()*86,i.range(50,130),i.range(40,140),i.range(30,46),i.range(70,110),i.range(16,28),-i.range(.03,.055),1);for(let e=0;e<Math.round(150*ct);e++)ge(Ae+J()*30,i.range(2,14),O+i.range(9,34),J()*26,i.range(20,54),i.range(10,46),i.range(11,17),i.range(26,38),i.range(5,9),i.range(.34,.46),1.1);await u.yield();for(let e=0;e<Math.round(140*ct);e++){const t=e%2?1:-1;ge(Ae+t*(30+Math.abs(J())*30),i.range(3,26),O+i.range(8,42),t*i.range(8,52),i.range(44,112),i.range(12,66),i.range(15,22),i.range(32,48),i.range(8,14),i.range(.22,.32),t<0?1.1:1)}for(let e=0;e<20;e++){const t=e%2?1:-1;ge(Ae+t*i.range(26,70),i.range(24,44),O+i.range(8,36),J()*14,i.range(84,146),i.range(8,40),i.range(15,21),i.range(30,44),i.range(10,15),i.range(.22,.3),1.14)}for(let e=0;e<Math.round(60*ct);e++)ge(Ae+J()*66,i.range(4,14),O+i.range(30,100),J()*30,i.range(5,24),i.range(80,190),i.range(26,40),i.range(50,76),i.range(20,32),2+i.range(.06,.1),.98);for(let e=0;e<44;e++){const t=e%2?1:-1,o=i.range(-.5,.85),a=i.range(.95,1.4);ge(m.x+t*Math.cos(o)*m.rx*a,i.range(3,12),m.z+Math.sin(o)*m.rz*a,t*i.range(5,20),i.range(8,24),i.range(16,56),i.range(26,36),i.range(46,66),i.range(18,28),2+i.range(.07,.11),1)}await u.yield();const Zt=j(r.fx0,r.y2+10)+22,Jt=j(r.fx1,r.y1+10)+20;for(let e=0;e<34;e++)ge(I(r.fx0,r.fx1,.3)+J()*11,r.y2+i.range(-2,12),Zt+i.range(-6,12),J()*16,i.range(14,38),i.range(10,26),i.range(7,11),i.range(16,27),i.range(4,8),i.range(.16,.26),1.1);for(let e=0;e<34;e++)ge(I(r.fx1,r.fx2,.3)+J()*18,r.y1+i.range(-2,12),Jt+i.range(-6,12),J()*18,i.range(14,40),i.range(12,30),i.range(9,14),i.range(20,32),i.range(4,8),i.range(.16,.26),1.08);for(let e=0;e<30;e++){const t=i.range(r.y2+30,ae-20),o=Math.sqrt(2*(ae-t)/Kt);ge(r.fx0+J()*9,t,j(r.fx0,ae)+4.2*o+i.range(0,6),J()*7,-i.range(30,55),i.range(6,16),i.range(7,11),i.range(18,28),i.range(4,7),i.range(.1,.17),1.05)}for(let e=0;e<34;e++){const t=i.range(40,r.y1-10);ge(r.fx2+J()*26,t,j(r.fx2,t)+i.range(10,24),J()*12,-i.range(18,40),i.range(14,34),i.range(14,22),i.range(36,56),i.range(5,9),i.range(.1,.16),1.05)}await u.yield();const Ao=Xt.geometry(),Co=new n.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,uniforms:{...Xe(),uTime:A.time,uSun:A.sunDir,uSunCol:A.sunColor,uSkyCol:A.skyColor,uGust:A.gust,uCeil:A.ceil,uGain:{value:Mo},uPortal:{value:ko},uVeil:A.veil,uReach:A.reach,uNear:A.near,uFall:{value:new n.Vector3(Ae,O,r.wBot)}},vertexShader:`
      attribute vec3 aBase, aVel; attribute vec4 aP; attribute vec3 aQ;
      uniform float uTime, uGust, uGain, uCeil, uVeil, uReach, uNear; uniform vec3 uSun, uPortal, uFall;
      varying vec2 vUv, vQ; varying vec4 vS;   // vS: alpha, seed, light, local y of centre
      varying float vY, vSize, vShade; varying vec3 vL, vWp, vCn;
      #include <fog_pars_vertex>
      void main(){
        float p = fract(uTime * aP.w + aP.z);
        float e = 1.0 - pow(max(1.0 - p, 0.0), 1.7);
        float low = 1.0 - step(55.0, aBase.y);                                                                  // the cloud at the foot (the bench bursts higher up are left alone)
        // uNear: 0 with the traveller far down the valley, 1 (and on to 2) close under the fall (the world sets it from the traveller's place on the
        // route). Close up the same cloud is seen from below and from inside its drift: it then climbs a little less and swells less,
        // so the foot is a dense, lumpy boil, and the lane of clear air in front of the column is wider and starts lower
        float nr = min(uNear, 1.0), nr2 = clamp(uNear - 1.0, 0.0, 1.0);                                          // (uNear runs on from 1 to 2 over the last hundred metres to the portal: the boil is then seen from its own edge and is held lower still)
        float squat = mix(1.0, 0.64, nr * low) * mix(1.0, 0.72, nr2 * low);
        vec3 c = aBase + aVel * vec3(1.0, squat, mix(0.5, 1.0, uReach)) * e;           // uReach: how far the cloud rolls down-valley
        c.x += sin(uTime * 0.21 + aQ.y * 40.0) * 5.0 * e;
        float hi = (1.0 - low) * step(aBase.y, 148.0);                                                         // the spray that streams off the bottom tier, in front of the column
        float size = mix(aP.x, aP.y, sqrt(max(p, 0.0))) * mix(1.0, 0.84, nr * low) * mix(1.0, 0.84, nr2 * low) * mix(1.0, 0.62, nr * hi);
        vec4 wc = modelMatrix * vec4(c, 1.0);
        vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
        vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        float ang = aQ.y * 6.2832 + (aQ.y - 0.5) * uTime * 0.12, ca = cos(ang), sa = sin(ang);
        vec2 q = vec2(position.x * ca - position.y * sa, position.x * sa + position.y * ca);
        vUv = position.xy; vQ = q;
        vec3 wp = wc.xyz + (right * q.x + up * q.y) * size;
        vY = c.y + up.y * q.y * size; vSize = size; vWp = c + (right * q.x + up * q.y) * size;
        vec3 toCam = cameraPosition - wc.xyz; float dist = max(length(toCam), 0.01);
        float life = smoothstep(0.0, 0.16, p) * (1.0 - smoothstep(0.42, 1.0, p));
        float nearF = smoothstep(size * 0.35, size * 1.6 + 20.0, dist);
        float cf = fract(aQ.y * 7.31);
        float ceilP = uCeil * (0.8 + 0.3 * cf);                                                               // every puff has its own ceiling, so the top of the cloud is lumpy
        float ceilK = 1.0 - low * smoothstep(ceilP * 0.62, ceilP, c.y + size * 0.35);                         // the plume is held under a ceiling so the wall above it stays dark
        // the lane of clear air in front of the falling column and of the wet rock that flanks it: the cloud climbs either side of it as two
        // shoulders, the white water comes down between them into the boil
        float ax = abs(c.x - uFall.x);
        float colK = 1.0 - mix(0.94, 1.0, nr2) * low * (1.0 - smoothstep(uFall.z * (mix(0.32, 0.85, nr) + 0.25 * nr2), uFall.z * (mix(0.66, 1.25, nr) + 0.3 * nr2), ax)) * smoothstep(mix(24.0, 15.0, nr) - 7.0 * nr2, mix(58.0, 38.0, nr) - 16.0 * nr2, c.y + size * 0.25);
        float hiK = 1.0 - 0.85 * nr * hi;                                                                   // ... is thinner and tighter from below: it must not veil the rock beside the column
        float veilK = aQ.x < 0.0 ? uVeil : aQ.x > 1.5 ? mix(0.4, 1.0, uReach) : 1.0;
        float alpha0 = aQ.x > 1.5 ? aQ.x - 2.0 : abs(aQ.x);
        // clear air in front of the ring: a cone that opens from the portal's face at 20 degrees to its axis (the widest angle the opening is
        // ever looked into from), whoever comes and from wherever; the cloud stands behind the ring and round the cone, never in it
        float coneR = 7.0 + 0.36 * max(c.z - uPortal.z, 0.0);
        float lane = smoothstep(coneR + size * 0.5, coneR + size + 16.0, length(c.xy - uPortal.xy));
        lane = mix(1.0, lane, smoothstep(uPortal.z - 8.0, uPortal.z + 6.0, c.z));
        vS = vec4(alpha0 * life * nearF * uGust * uGain * ceilK * colK * hiK * veilK * lane, aQ.y, aQ.z, clamp(c.y / 150.0, 0.0, 1.0));
        vec3 key = normalize(uSun + vec3(-0.5, 0.45, 0.0));                                                    // the key comes from the upper left of the sun
        vL = (viewMatrix * vec4(key, 0.0)).xyz;
        // the cloud as one body: its outward normal at this corner, from a point low in its heart (taller than wide, so the top takes the light)
        vec3 cn = (vWp - vec3(uFall.x, 14.0, uFall.y + 34.0)) * vec3(1.0, 1.5, 1.0);
        vec3 cnn = cn / max(length(cn), 1.0);
        vCn = (viewMatrix * vec4(mat3(modelMatrix) * cnn, 0.0)).xyz;
        // the cloud is seen from in front with the sun behind the camera, and every face of it would be lit: the side away from the key
        // (+X, the right shoulder) stands in the cloud's own shade, and so does its underside
        vShade = low * mix(0.6, 1.0, nr) * (0.46 * smoothstep(-0.15, 0.55, cnn.x) + 0.2 * (1.0 - smoothstep(4.0, 20.0, vWp.y)));
        vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime; uniform vec3 uSunCol, uSkyCol;
      varying vec2 vUv, vQ; varying vec4 vS; varying float vY, vSize, vShade; varying vec3 vL, vWp, vCn;
      #include <fog_pars_fragment>
      ${Be}
      void main(){
        float r2 = dot(vUv, vUv);
        if (r2 > 1.0) discard;
        vec2 q = vUv * 1.7 + vS.y * 31.0 + vec2(0.0, -uTime * 0.035);
        float n = vn(q) * 0.55 + vn(q * 2.1 + 9.0) * 0.3 + vn(q * 4.3 + 3.0) * 0.15;
        // one field of billows shared by every puff (it rises and rolls toward +Z), so overlapping puffs agree on where the cloud is thick and lit
        vec2 wq = vec2(vWp.x * 0.021 + vWp.z * 0.013, vWp.y * 0.024 - uTime * 0.11);
        float wn = vn(wq) * 0.6 + vn(wq * 2.3 + vec2(5.0, -uTime * 0.07)) * 0.4;
        float sh = 1.0 - r2; sh = sh * sh * smoothstep(0.4, 0.84, n + sh * 0.42) * smoothstep(0.12, 0.55, wn + sh * 0.3);   // eroded hard enough that the cloud is billows with gaps, not an airbrushed oval
        float a = vS.x * sh * smoothstep(-3.0, 16.0, vY) * (1.0 - 0.5 * smoothstep(46.0, 130.0, vWp.y));        // thinner upward: the column shows through and above it
        if (a < 0.004) discard;
        // lit as ONE volume: the cloud's own normal carries the big light and shade, the puff's ball only the billow on top of it
        vec3 nb = normalize(vec3(vQ * 1.15, sqrt(max(1.0 - r2, 0.0)) + 0.25));
        vec3 nn = normalize(mix(nb, vCn, 0.62) + vec3(0.0, 0.0, 1e-4));
        float l = (0.5 + 0.5 * dot(nn, normalize(vL))) * (0.8 + 0.34 * n) * (0.66 + 0.6 * wn) * vS.z * (1.0 - vShade);
        vec3 shade = uSkyCol * vec3(0.6, 0.7, 0.86) + vec3(0.03, 0.04, 0.06), lit = (uSunCol * 0.42 + 0.58) * 0.98;   // a sunlit side, and slate blue where the cloud shades itself
        vec3 c = mix(shade, lit, smoothstep(0.4, 0.9, l));
        gl_FragColor = vec4(c, a);
        #include <fog_fragment>
      }`}),ft=new n.Mesh(Ao,Co);ft.name="spray-plume",ft.frustumCulled=!1,ft.renderOrder=3,K.add(ft);const Ne={c:new n.Vector3(Ae*.5,44,O+70),r:new n.Vector3(205,190,160)},et=22,Ht=110,eo=[],to=[];for(let e=0;e<=Ht;e++)for(let t=0;t<=et;t++)eo.push(36+t/et*21,(e/Ht*2-1)*2.3,0);for(let e=0;e<Ht;e++)for(let t=0;t<et;t++){const o=e*(et+1)+t,a=o+et+1;to.push(o,a,o+1,o+1,a,a+1)}const ut=new n.BufferGeometry;ut.setAttribute("position",new n.Float32BufferAttribute(eo,3)),ut.setIndex(to);const oo=e=>new n.ShaderMaterial({transparent:!0,depthWrite:!1,side:n.DoubleSide,fog:!0,blending:n.CustomBlending,blendEquation:n.AddEquation,blendSrc:n.OneFactor,blendDst:n.OneMinusSrcAlphaFactor,uniforms:{...Xe(),uTime:A.time,uSun:A.sunDir,uBow:e.bow,uSecond:e.second,uInv:A.inv,uGain:{value:e.gain},uPlumeW:{value:e.c.clone()},uPc:{value:e.c},uPr:{value:e.r},uCurtain:{value:e.curtain},uFeet:{value:e.feet}},vertexShader:`
      uniform vec3 uSun, uPlumeW, uCurtain; uniform mat4 uInv; varying vec3 vDir; varying float vTh;
      #include <fog_pars_vertex>
      void main(){
        vec3 A = -normalize(uSun);
        vec3 Uu = normalize(vec3(0.0, 1.0, 0.0) - A * A.y), Rr = cross(A, Uu);
        float th = radians(position.x);
        vec3 dir = A * cos(th) + sin(th) * (Uu * cos(position.y) + Rr * sin(position.y));
        float R = clamp(distance(cameraPosition, uPlumeW) - 110.0, 30.0, 520.0);
        // the curtain z = z0 + k * |x - xc| (two planes): the ray meets one of them
        vec3 o = (uInv * vec4(cameraPosition, 1.0)).xyz, d = mat3(uInv) * dir;
        o.x -= uCurtain.z;
        float dA = d.z - uCurtain.y * d.x, dB = d.z + uCurtain.y * d.x;
        float tA = (uCurtain.x + uCurtain.y * o.x - o.z) / min(dA, -1e-3), tB = (uCurtain.x - uCurtain.y * o.x - o.z) / min(dB, -1e-3);
        if (dA < -0.02 && tA > 0.0 && o.x + d.x * tA >= 0.0) R = clamp(tA, 30.0, 900.0);
        else if (dB < -0.02 && tB > 0.0 && o.x + d.x * tB <= 0.0) R = clamp(tB, 30.0, 900.0);
        vDir = dir; vTh = position.x;
        vec4 mvPosition = viewMatrix * vec4(cameraPosition + dir * R, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime, uBow, uGain, uSecond; uniform mat4 uInv; uniform vec3 uPc, uPr, uSun; uniform vec2 uFeet;
      varying vec3 vDir; varying float vTh;
      #include <fog_pars_fragment>
      ${Be}
      ${Ho}
      vec3 spec(float t){ float h = (1.0 - t) * 0.76;
        vec3 c = clamp(abs(fract(h + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0) - 1.0, 0.0, 1.0);
        c = mix(vec3(1.0), c, 0.86); return c * c; }
      void main(){
        vec3 o = (uInv * vec4(cameraPosition, 1.0)).xyz;
        vec3 d = normalize(mat3(uInv) * normalize(vDir));
        vec3 oo = (o - uPc) / uPr, dd = d / uPr;
        float a = dot(dd, dd), b = dot(oo, dd), c = dot(oo, oo) - 1.0;
        float disc = b * b - a * c;
        if (disc <= 0.0) discard;
        float sq = sqrt(max(disc, 0.0)), t0 = max((-b - sq) / a, 0.0), t1 = (-b + sq) / a;
        if (t1 <= t0) discard;
        vec3 pf = o + d * mix(t0, t1, 0.72);                      // well into the spray along this ray: where the colour seems to stand
        float core = disc / a;                                   // 1 through the middle of the spray, 0 at its edge
        float dens = (1.0 - exp(-(t1 - t0) / 60.0)) * smoothstep(0.0, 0.7, core) * smoothstep(0.0, 0.4, core);
        float brk = 0.62 + 0.38 * smoothstep(0.25, 0.7, fb(vec2(atan(d.x, -d.z) * 6.0, d.y * 8.0) + vec2(uTime * 0.012, -uTime * 0.02)));
        // the feet come down into the mist on the shores and thin out there: never a painted band on dry rock beyond the spray
        float hor = smoothstep(uFeet.x, uFeet.y, pf.y) * (1.0 - 0.8 * smoothstep(uPr.x * 0.5, uPr.x * 0.85, abs(pf.x - uPc.x)));
        vec3 col = vec3(0.0); float dark = 0.0;
        float t = (vTh - 39.6) / 3.3;
        if (t > 0.0 && t < 1.0) col += spec(t) * pow(max(sin(3.14159 * t), 0.0), 0.7);
        // the outer bow is a ghost: wider than the inner one, its colours reversed and paler, a few hundredths of its strength (uSecond), and it
        // stands only where the line of sight runs through the thick of the spray and ends low in it: over the rock above the boil there is none
        float sec = uSecond * smoothstep(0.35, 0.85, core) * (1.0 - smoothstep(0.45, 0.8, (pf.y - uPc.y) / uPr.y));
        float t2 = (vTh - 49.6) / 5.6;
        if (t2 > 0.0 && t2 < 1.0) col += mix(vec3(0.5), spec(1.0 - t2), 0.8) * pow(max(sin(3.14159 * t2), 0.0), 0.7) * sec;
        dark = smoothstep(42.9, 44.0, vTh) * (1.0 - smoothstep(48.8, 49.9, vTh)) * min(sec * 1.6, 0.5);      // the darker band of sky between the two bows
        col += vec3(0.05, 0.055, 0.06) * smoothstep(36.2, 39.5, vTh) * (1.0 - smoothstep(40.2, 41.6, vTh));  // the sky inside the bow is a little brighter
        float k = uBow * uGain * dens * brk * hor * fogFade() * smoothstep(0.0, 0.08, uSun.y);
        float lum = max(col.r, max(col.g, col.b));
        gl_FragColor = vec4(col * k * 1.4, clamp(k * (0.62 * lum + 0.3 * dark), 0.0, 0.8));
      }`}),ao=oo({bow:A.bow,second:A.second,gain:w.rainbow??1,c:Ne.c,r:Ne.r,curtain:new n.Vector3(O+50,.55,Ae*.5),feet:new n.Vector2(6,40)}),ht=new n.Mesh(ut,ao);ht.name="rainbow",ht.frustumCulled=!1,ht.renderOrder=5,K.add(ht);const no=[];function zo(e){const t=new n.Vector3().fromArray(e.center),o=new n.Vector3().fromArray(e.radius),a=oo({bow:{value:e.strength??1},second:{value:0},gain:e.gain??1,c:t,r:o,curtain:new n.Vector3(t.z,0,-1e4),feet:new n.Vector2(t.y-o.y*.8,t.y-o.y*.2)}),s=new n.Mesh(ut,a);return s.name="rainbow-scrap",s.frustumCulled=!1,s.renderOrder=5,K.add(s),no.push({mat:a,c:t}),s}await u.yield();{const e=[],t=[],o=[];for(const[h,y,S]of Mt){const x=e.length/3,F=ne(h,y,9)*50,B=S*.7,v=S*1.14+.4;for(let z=0;z<=14;z++){const M=z/14*6.2832,q=Math.cos(M),W=Math.sin(M),R=1+.22*Math.sin(M*3+F);e.push(h+q*B,.52,y+W*B,h+q*v*R,.5,y+W*v*R),t.push(0,M,F,1,M,F)}for(let z=0;z<14;z++){const M=x+z*2;o.push(M,M+1,M+2,M+1,M+3,M+2)}}const s=new n.BufferGeometry;s.setAttribute("position",new n.Float32BufferAttribute(e,3)),s.setAttribute("aC",new n.Float32BufferAttribute(t,3)),s.setIndex(o);const l=new n.ShaderMaterial({transparent:!0,depthWrite:!1,side:n.DoubleSide,fog:!0,uniforms:{...Xe(),uTime:A.time,uSun:A.sunDir,uSunCol:A.sunColor,uSkyCol:A.skyColor},vertexShader:`
        attribute vec3 aC; varying vec3 vC;
        #include <fog_pars_vertex>
        void main(){ vC = aC; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        uniform float uTime; uniform vec3 uSun, uSunCol, uSkyCol; varying vec3 vC;
        #include <fog_pars_fragment>
        ${Be}
        void main(){
          float n = fb(vec2(vC.y * 2.4 + vC.z, vC.x * 2.2 - uTime * 0.3));
          float a = rstep(1.0, 0.3, vC.x) * smoothstep(0.42, 0.7, n + 0.3 * (1.0 - vC.x)) * 0.7;
          if (a < 0.01) discard;
          gl_FragColor = vec4(vec3(0.95, 0.98, 1.0) * (uSkyCol * 0.5 + uSunCol * (0.2 + 0.8 * clamp(uSun.y * 3.0, 0.0, 1.0))), a);
          #include <fog_fragment>
        }`}),c=new n.Mesh(s,l);c.name="foam-collars",c.renderOrder=1.5,Mt.length&&K.add(c)}const N=(e,t,o)=>new n.Vector3(e,t,o),Ce=O+90,we=m.x;let Gt=0;for(const e of te)Gt=Math.max(Gt,e.crest);const Fo={portalSeat:{position:N(we,12,Ce),facing:N(0,0,1),radius:7},flyThrough:[N(we+34,30,Ce+560),N(we+14,40,Ce+390),N(we+2,27,Ce+240),N(we,14,Ce+150),N(we,12,Ce+120),N(we,12,Ce+60),N(we,12,Ce)],viewpoints:{far:N(20,18,O+690),mid:N(10,40,O+420),close:N(we,14,O+240)},lookAt:N(r.fx1,210,O-10),lip:N(r.fx0,ae,j(r.fx0,ae)),ledgeUpper:N(r.fx0,r.y2+6,Zt),ledgeLower:N(r.fx1,r.y1+6,Jt),foot:N(r.fx2,0,O+10),poolCenter:N(m.x,.45,m.z),poolRadius:Math.max(m.rx,m.rz),riverStart:{position:N(_t(Z.z1-40),.4,Z.z1-40),direction:N(0,0,1),width:Z.w1},plumeCenter:Ne.c.clone(),plumeSize:N(220,140,200),tiers:{lip:ae,upper:r.y2,lower:r.y1},sprayReach:{veil:202,skirt:290},rainbowApex:N(we+40,118,O+60),sunDirDefault:$t.clone(),pool:{x:m.x,z:m.z,rx:m.rx,rz:m.rz,level:.45},riverCourse:{xAt:_t,z0:Z.z0,z1:Z.z1,w0:Z.w0,w1:Z.w1,level:.4},footZ:O,wing:r.wing,halfWidth:qe},No=new n.Matrix4,Nt=new n.Vector3,ro=new n.Vector3;let so=0;return{object:K,radius:300,height:Gt,center:N(0,150,O+20),anchors:Fo,uniforms:A,ground:!0,groundY:0,setProgress(e){A.bow.value=g(.35,.55,e)},addBow:zo,update(e,t){A.time.value=t,K.updateWorldMatrix(!0,!1),A.inv.value.copy(K.matrixWorld).invert(),Ne.r.y=Re(90+(A.ceil.value-78)*1.92,112,190),Ne.c.y=Ne.r.y*.38,ao.uniforms.uPlumeW.value.copy(Ne.c).applyMatrix4(K.matrixWorld);for(const o of no)o.mat.uniforms.uPlumeW.value.copy(o.c).applyMatrix4(K.matrixWorld);if(!St&&so<5){so++;let o=K;for(;o.parent;)o=o.parent;let a=null;o.traverse(s=>{!a&&s.isDirectionalLight&&(a=s)}),a&&(a.getWorldPosition(Nt),a.target.getWorldPosition(ro),Nt.sub(ro).lengthSq()>1e-6&&(A.sunDir.value.copy(Nt).normalize(),St=!0))}},dispose(){}}}export{jo as GLSL_GRANITE,Be as GLSL_NOISE,Do as GLSL_WATER,Ko as GRANITE,uo as boulderBuilder,Go as boulderMaterial,Eo as buildHero};
