import*as t from"three";const Ee=["#F7F1E3","#C79A63","#7A4A2A","#2E1D14","#D9822B","#6FA9D8","#4E7A3A"],fe=210,me=280,we=.052,Oe=300,Ze=.375,te=-452,oe=-452,Se=956,Pe=904,de=`
uniform float uHbTime, uHbFrontZ, uHbShadowZ, uHbTearZ, uHbGust, uHbThin, uHbNear;   // uHbNear: 0 until the front stands over the town, 1 in the arrival (hero.setArrival)
uniform vec3 uHbDust, uHbUmber, uHbBounce;
uniform vec4 uHbSpot;
uniform vec4 uHbRents[3];                                      // rents in the wall in the arrival: x, z of the pool of sun on the ground, radius, strength
uniform vec2 uHbRentDir;                                       // the sun's run per metre of height, so the pool climbs a tower along the beam
uniform mat4 uHbInv;
uniform sampler2D uHbShMap;
uniform vec4 uHbShBox;
float hbSg = 0.;                                               // the storm shadow at this fragment, kept by the lit patch for its fog step
float hbHash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float hbN2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hbHash(i), hbHash(i + vec2(1., 0.)), f.x), mix(hbHash(i + vec2(0., 1.)), hbHash(i + vec2(1., 1.)), f.x), f.y); }
// lobed edge of the front and of its shadow, metres along the storm axis as a function of the lateral coordinate
float hbLobe(float x){ return 44. * sin(x * 0.0125 + 1.3) + 20. * sin(x * 0.037 + uHbTime * 0.05) + 8. * sin(x * 0.113 + 2.1 - uHbTime * 0.08); }
// 1 inside the storm shadow. The edge is a plane sloping back toward the crest, so the line climbs each tower.
float hbBow(float x){ return 0.00018 * x * x; }
float hbShadow(vec3 p){
  float e = p.z + p.y * ${Ze.toFixed(3)} - uHbShadowZ - hbLobe(p.x) + hbBow(p.x);
  float sp = uHbSpot.w * (1. - smoothstep(uHbSpot.z * 0.72, uHbSpot.z, distance(p.xz, uHbSpot.xy)));
  { vec2 rq = p.xz - uHbRentDir * max(p.y, 0.); float rn = 9. * (hbN2(rq * 0.11 + uHbTime * 0.06) - .5);
    for (int i = 0; i < 3; i++) { vec4 R = uHbRents[i]; sp = max(sp, R.w * (1. - smoothstep(R.z * 0.45, R.z, distance(rq, R.xy) + rn))); } }
  float ck = smoothstep(250., 330., abs(p.x)), gk = max(1. - smoothstep(2.5, 7., p.y), ck);   // on the ground the edge is 60 m of drifting dust shade, torn by two scales of moving noise; on a tower it stays the hard line that climbs. Outside the town (the cliffs) it is torn too, by height as well
  vec2 gq = p.xz + vec2(0., 1.6 * max(p.y - 7., 0.));
  e += gk * (34. * (hbN2(gq * 0.018 + uHbTime * 0.03) - .5) + 14. * (hbN2(gq * 0.06 - uHbTime * 0.05) - .5)) * (1. + 0.5 * uHbNear);
  e += ck * 110. * (hbN2(vec2(p.x * 0.006 + uHbTime * 0.02, p.y * 0.013 - uHbTime * 0.03)) - .5) * smoothstep(0., 40., p.y);   // up a cliff the line bellies in and out with the lobes that cast it
  float ew = mix(6., mix(30., 12., uHbNear), gk);              // in the arrival the dark front has an edge again: 24 m of soft shade along bigger lobes, not 60 m of veil
  return (1. - smoothstep(-ew, ew, e)) * (1. - sp);
}
// 1 where the towers, the town wall and the palms shade p (hero space). The map holds, for every square metre, the
// height below which the sun is hidden; n is the surface normal, so a wall is tested just outside itself.
float hbTown(vec3 p, vec3 n){
  vec2 q = (p.xz + n.xz * 1.25 - uHbShBox.xy) * uHbShBox.zw;
  float inb = step(0., q.x) * step(q.x, 1.) * step(0., q.y) * step(q.y, 1.);
  float s = textureLod(uHbShMap, clamp(q, 0., 1.), 0.).r * 48.;
  return smoothstep(0.1, 1.0, s - max(p.y, 0.)) * smoothstep(0.05, 0.4, s) * inb;     // a texel of 0 is 'no shadow', and ground below zero (the riverbed) is tested as if at zero
}
float hbTownW(vec3 hp){
  vec3 g = cross(dFdx(hp), dFdy(hp)); g = g / max(length(g), 1e-7);
  if (dot(g, (uHbInv * vec4(cameraPosition, 1.)).xyz - hp) < 0.) g = -g;
  return hbTown(hp, g);
}
// 0..1 dust between the camera and p: exponential density rising toward the front, integrated along the ray
float hbFog(vec3 p, vec3 cam){
  float cu1 = hbN2(vec2(p.x * 0.011 + uHbTime * 0.03, p.y * 0.017 - uHbTime * 0.045)), cu2 = hbN2(vec2(p.x * 0.037 - uHbTime * 0.05, p.y * 0.05 + 7. + uHbTime * 0.02));
  float cur = 0.45 + 1.15 * (0.62 * cu1 + 0.38 * cu2);          // curtains: the veil is thick here and thin there, and they drift
  float zf = uHbFrontZ + 150. + 0.55 * hbLobe(p.x * 1.7 + 300.) - hbBow(p.x) + 90. * (cu1 - 0.5) + 30. * (cu2 - 0.5);
  float e0 = exp(clamp(-(cam.z - zf) / 55., -40., 5.)), e1 = exp(clamp(-(p.z - zf) / 55., -40., 5.));
  float k = (p.z - cam.z) / 55.;
  float f = abs(k) > 1e-3 ? (e0 - e1) / k : e0;
  f = max(f, min(e0, e1));
  return 1. - exp(-0.028 * cur * mix(1., 0.45, uHbThin) * distance(p, cam) * f * exp(-max(0.5 * (p.y + cam.y), 0.) / 240.));   // a thin front (uHbThin 1) only veils: towers stay as silhouettes inside it
}
`;function Qe(r){return f=>{if(f<=r[0][0])return r[0][1];for(let n=1;n<r.length;n++)if(f<=r[n][0]){const T=r[n-1],B=r[n];return T[1]+(B[1]-T[1])*(f-T[0])/(B[0]-T[0])}return r[r.length-1][1]}}const Be=(r,f,n)=>{const T=Math.min(1,Math.max(0,(n-r)/(f-r)));return T*T*(3-2*T)},be=r=>new t.Color(r);function Le(r,f,n,T){const B=r.onBeforeCompile;return r.onBeforeCompile=(p,_)=>{B&&B(p,_);for(const S in f)p.uniforms[S]=f[S];if(T?.uniforms)for(const S in T.uniforms)p.uniforms[S]=T.uniforms[S];p.vertexShader=p.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vHbW;`+(T?.vertPars||"")).replace("#include <project_vertex>",`#include <project_vertex>
        { vec4 hbw = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          hbw = instanceMatrix * hbw;
        #endif
          vHbW = (modelMatrix * hbw).xyz; }`),T?.vert&&(p.vertexShader=T.vert(p.vertexShader)),p.fragmentShader=p.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vHbW;
`+de+(T?.fragPars||"")).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
        { vec3 hbP = (uHbInv * vec4(vHbW, 1.0)).xyz;
          float hbS = hbShadow(hbP), hbT = hbTownW(hbP);
          hbSg = hbS;
          reflectedLight.directDiffuse *= (1.0 - 0.95 * hbS) * (1.0 - 0.88 * hbT) * mix(vec3(1.0), vec3(1.16, 1.05, 0.86), uHbNear * (1.0 - hbS));   // in the arrival what the sun still reaches is warm against the dark wall
          reflectedLight.directSpecular *= (1.0 - hbS) * (1.0 - hbT);
          reflectedLight.indirectDiffuse *= mix(vec3(1.0), max(uHbUmber, vec3(0.5, 0.42, 0.36)), hbS) * mix(vec3(1.0), vec3(0.8, 0.94, 1.22), hbT * (1.0 - hbS));
          reflectedLight.indirectDiffuse += diffuseColor.rgb * uHbBounce * (hbT * (1.0 - hbS));       // sun thrown back off the lit ground and walls fills the town's own shadows
          ${T?.lit||""} }`).replace("#include <fog_fragment>",`#include <fog_fragment>
        { float hbF = hbFog((uHbInv * vec4(vHbW, 1.0)).xyz, (uHbInv * vec4(cameraPosition, 1.0)).xyz);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, uHbDust * (1.0 - 0.3 * uHbNear * hbSg), hbF); }`),T?.frag&&(p.fragmentShader=T.frag(p.fragmentShader))},r.customProgramCacheKey=()=>"hb-"+n,r.needsUpdate=!0,r}const Ge=[[1,0],[0,1],[-1,0],[0,-1]];function $e(r){const f=[],n=[],T=[],B=[],p=z=>[z[0]*14+z[3],z[1]*32+z[4],z[2]*14+z[5]],_=(z,D,E,c,h)=>{for(const s of[z,D,E])f.push(s[0],s[1],s[2]),n.push(s[3],s[4],s[5]),T.push(c[0],c[1],c[2]),B.push(s[6]??h)},S=(z,D,E,c,h,s)=>{let P=s;if(!P){const l=p(z),g=p(D),I=p(c),Z=g[0]-l[0],O=g[1]-l[1],G=g[2]-l[2],ne=I[0]-l[0],J=I[1]-l[1],ie=I[2]-l[2];P=[O*ie-G*J,G*ne-Z*ie,Z*J-O*ne];const re=Math.hypot(P[0],P[1],P[2])||1;P=[P[0]/re,P[1]/re,P[2]/re]}_(z,D,E,P,h),_(z,E,c,P,h)},Y=(z,D,E,c,h,s,P=!1)=>{const l=(g,I,Z)=>[z,D,E,c[0]+g*h[0],c[1]+I*h[1],c[2]+Z*h[2]];S(l(1,-1,1),l(1,-1,-1),l(1,1,-1),l(1,1,1),s),S(l(-1,-1,-1),l(-1,-1,1),l(-1,1,1),l(-1,1,-1),s),S(l(-1,-1,1),l(1,-1,1),l(1,1,1),l(-1,1,1),s),S(l(1,-1,-1),l(-1,-1,-1),l(-1,1,-1),l(1,1,-1),s),S(l(-1,1,-1),l(-1,1,1),l(1,1,1),l(1,1,-1),s),P&&S(l(-1,-1,1),l(-1,-1,-1),l(1,-1,-1),l(1,-1,1),s)},R=(z,D,E,c,h,s,P)=>{const l=(Z,O)=>[z,D,E,c[0]+Z*h,c[1],c[2]+O*h],g=[z,D,E,c[0],c[1]+s,c[2]],I=(Z,O)=>{const G=p(Z),ne=p(O),J=p(g),ie=ne[0]-G[0],re=ne[2]-G[2],$=J[0]-G[0],he=J[1]-G[1],ye=J[2]-G[2];let se=[-re*he,re*$-ie*ye,ie*he];const ce=Math.hypot(se[0],se[1],se[2])||1;se=[se[0]/ce,se[1]/ce,se[2]/ce],_(Z,O,g,se,P)};I(l(-1,1),l(1,1)),I(l(1,1),l(1,-1)),I(l(1,-1),l(-1,-1)),I(l(-1,-1),l(-1,1))};for(const[z,D]of Ge){const E=D,c=-z,h=(s,P,l=1,g=0)=>[.5*z+.5*s*E,l,.5*D+.5*s*c,-g*(z+s*E),P,-g*(D+s*c)];if(S(h(-1,0,0),h(1,0,0),h(1,-1),h(-1,-1),0),S(h(-1,-1),h(1,-1),h(1,.12),h(-1,.12),1),S(h(1,-1.6,1,.45),h(-1,-1.6,1,.45),h(-1,.12,1,.45),h(1,.12,1,.45),1),z+D>0){const s=.5*z+.28*E,P=.5*D+.28*c;Y(s,1,P,[z*.62,-1.75,D*.62],[Math.abs(z)*.7+.1,.085,Math.abs(D)*.7+.1],4,!0)}}S([-.5,1,-.5,0,-1.6,0],[-.5,1,.5,0,-1.6,0],[.5,1,.5,0,-1.6,0],[.5,1,-.5,0,-1.6,0],2);for(const z of[-1,1])for(const D of[-1,1])Y(.5*z,1,.5*D,[-z*.5,-.25,-D*.5],[.72,.95,.72],3),R(.5*z,1,.5*D,[-z*.5,.7,-D*.5],.46,1.25,3);const U=(z,D,E,c)=>{const[h,s]=Ge[z],P=s,l=-h,g=(Z,O,G,ne)=>[.5*h+D*P,1,.5*s+D*l,Z*E*.5*P+O*h,G,Z*E*.5*l+O*s,5+.9*ne],I=[h,.2,s];S(g(-1,.1,-c*.5,.4),g(1,.1,-c*.5,.4),g(1,.08,.16,0),g(-1,.08,.16,0),5,I),S(g(-1,.13,-c,1),g(1,.13,-c,1),g(1,.1,-c*.5,.4),g(-1,.1,-c*.5,.4),5,I),S(g(-1,.08,.16,0),g(1,.08,.16,0),g(1,-.52,.16,0),g(-1,-.52,.16,0),5,[0,1,0]),S(g(-1,-.52,.16,0),g(1,-.52,.16,0),g(1,-.55,-.9,.2),g(-1,-.55,-.9,.2),5,[-h,.2,-s])};if(r===0)Y(-.2,1,-.18,[0,-.25,0],[1.7,1.35,2.1],3.3),U(1,.12,2.1,2.8);else if(r===1){const c=(l,g,I)=>[l,1,g,-Math.sign(l)*1.5,I,-Math.sign(g)*1.5*(g>0?.2:1)],h=[-.5,.5],s=-.5,P=.08;S(c(h[1],P,-1.6),c(h[1],s,-1.6),c(h[1],s,2.5),c(h[1],P,2.5),3.3),S(c(h[0],s,-1.6),c(h[0],P,-1.6),c(h[0],P,2.5),c(h[0],s,2.5),3.3),S(c(h[0],P,-1.6),c(h[1],P,-1.6),c(h[1],P,2.5),c(h[0],P,2.5),3.3),S(c(h[1],s,-1.6),c(h[0],s,-1.6),c(h[0],s,2.5),c(h[1],s,2.5),3.3),S(c(h[0],s,2.5),c(h[0],P,2.5),c(h[1],P,2.5),c(h[1],s,2.5),3.3);for(const l of h)for(const g of[s,P]){const I=c(l,g,2.5);R(I[0],1,I[2],[I[3],2.5,I[5]],.4,1,3)}U(0,.22,2,2.6)}else Y(.22,1,.16,[0,-.2,0],[1.25,.75,.95],4,!0),Y(.22,1,.16,[0,-1.25,0],[.9,.35,.6],4),Y(-.24,1,-.2,[0,-.45,0],[1.4,1.15,1.6],3.3),U(1,-.18,2.2,3),U(2,.1,1.8,2.4);const ae=new t.InstancedBufferGeometry;return ae.setAttribute("position",new t.Float32BufferAttribute(f,3)),ae.setAttribute("aOff",new t.Float32BufferAttribute(n,3)),ae.setAttribute("normal",new t.Float32BufferAttribute(T,3)),ae.setAttribute("aPart",new t.Float32BufferAttribute(B,1)),ae}function Ye(){const r=[],f=[];for(let p=0;p<=7;p++)for(let _=0;_<=2;_++)r.push(_/2-.5,p/7,0);for(let p=0;p<7;p++)for(let _=0;_<2;_++){const S=p*3+_,Y=S+1,R=S+2+1,U=R+1;f.push(S,R,Y,Y,R,U)}const B=new t.InstancedBufferGeometry;return B.setAttribute("position",new t.Float32BufferAttribute(r,3)),B.setIndex(f),B}function Xe(){const r=[],f=[],n=[],T=[[0,.12],[0,.62],[.44,.14],[0,-.7],[-.44,.14]];for(const _ of T)r.push(0,0,0),f.push(_[0],_[1]);n.push(0,1,4,0,2,1,0,3,2,0,4,3);const B=(_,S)=>{const Y=r.length/3;for(let R=0;R<=S;R++)for(const U of[-1,1])r.push(_,R/S,U),f.push(0,0);for(let R=0;R<S;R++){const U=Y+R*2;n.push(U,U+1,U+2,U+1,U+3,U+2)}};B(1,12),B(2,22);const p=new t.InstancedBufferGeometry;return p.setAttribute("position",new t.Float32BufferAttribute(r,3)),p.setAttribute("aQ",new t.Float32BufferAttribute(f,2)),p.setIndex(n),p}const Je=`
attribute vec3 aOff; attribute float aPart; attribute vec4 iA; attribute vec4 iB; attribute vec4 iC;
uniform float uHbTime, uHbTearZ, uHbGust;
varying vec3 vLoc; varying float vPart; flat varying vec3 vN0; flat varying vec4 vB; flat varying vec4 vC;
`,et=`vec3 objectNormal = vec3(normal.x * iA.z + normal.z * iA.w, normal.y, -normal.x * iA.w + normal.z * iA.z);
  if (aPart > 4.5) { objectNormal = objectNormal + vec3(0.0, 1.3, 0.0); objectNormal = objectNormal / max(length(objectNormal), 1e-4); }`,tt=`
  vec3 hbO = aOff;
  if (abs(aPart - 3.0) < 0.05 && iB.y < 12.0) {      // a low house: small corner blocks that step above the merlons, not a tower's tall finials
    hbO.xz *= 0.55;
    hbO.y = min(aOff.y, 0.0) + clamp(aOff.y, 0.0, 0.7) * 0.75 + max(aOff.y - 0.7, 0.0) * 0.06;
  }
  float hbY = position.y * iB.y + hbO.y;
  float hbBat = ${(we*2).toFixed(4)} * clamp(hbY, 0.0, iB.y);
  vec3 hbL = vec3(position.x * (iB.x - hbBat) + hbO.x, hbY, position.z * (iB.z - hbBat) + hbO.z);
  float hbFlap = aPart > 4.5 ? (aPart - 5.0) / 0.9 : 0.0;
  // four cloths in ten are torn off when the tear line passes; the rest only thrash
  float hbD = max(uHbTearZ - iA.y + (fract(iB.w * 7.31) - 0.5) * 50.0, 0.0) * step(fract(iB.w * 53.7 + position.x * 3.1), 0.4);
  if (aPart > 4.5) {
    float w = sin(uHbTime * (1.6 + 8.0 * uHbGust) + iB.w * 40.0 + position.x * 9.0 + position.z * 7.0 + hbY * 1.3);
    hbL.xz += normal.xz * hbFlap * (0.12 + 1.5 * uHbGust) * (0.65 + 0.35 * w);
    hbL.y += hbFlap * uHbGust * (0.9 + 0.5 * w);
  }
  vLoc = hbL; vN0 = normal; vPart = aPart; vB = iB; vC = iC;
  vec3 transformed = vec3(hbL.x * iA.z + hbL.z * iA.w + iA.x, hbL.y, -hbL.x * iA.w + hbL.z * iA.z + iA.y);
  if (aPart > 4.5 && hbD > 0.0) {       // the cloth is torn off the parapet and carried downwind
    float lift = smoothstep(0.0, 25.0, hbD);
    vec3 fly = vec3(sin(hbD * 0.06 + iB.w * 30.0) * 5.0 * lift, 7.0 * lift + hbD * 0.07 - hbD * hbD * 0.0005, hbD * 0.8);
    fly.y += sin(hbD * 0.33 + position.x * 12.0 + hbFlap * 2.5) * 0.9 * lift;
    vec3 hbA = vec3(position.x * (iB.x - hbBat), iB.y, position.z * (iB.z - hbBat));
    vec3 aW = vec3(hbA.x * iA.z + hbA.z * iA.w + iA.x, hbA.y, -hbA.x * iA.w + hbA.z * iA.z + iA.y);
    vec3 rel = transformed - aW;
    float ang = hbD * 0.13 * lift + 0.6 * sin(hbD * 0.21 + iB.w * 50.0) * lift, ca = cos(ang), sa = sin(ang);
    rel = vec3(rel.x, rel.y * ca - rel.z * sa, rel.y * sa + rel.z * ca);        // it tumbles end over end
    transformed = aW + fly + rel * (1.0 - smoothstep(190.0, 260.0, hbD));
  }
`,ot=`
uniform vec3 uPLime, uPMud, uPUmber, uPDark, uPOchre, uPSky, uPGreen, uBounce;
uniform float uLamp;
float gHbLamp = 0.0;
varying vec3 vLoc; varying float vPart; flat varying vec3 vN0; flat varying vec4 vB; flat varying vec4 vC;
vec3 hbClothCol(float k){
  vec3 c = k < 0.22 ? vec3(0.5, 0.05, 0.04) : k < 0.44 ? uPOchre * 0.9 : k < 0.62 ? vec3(0.1, 0.19, 0.55) : k < 0.82 ? uPLime * 0.8 : uPGreen * 0.9;
  return mix(c, vec3(dot(c, vec3(0.333))), 0.25) * 0.9;
}
vec3 hbTowerColor(){
  float seed = vB.w, h = vB.y, y = vLoc.y;
  vec3 mud = uPMud * (0.76 + 0.42 * vC.x); mud = mix(mud, mud * vec3(1.1, 0.95, 0.8), vC.z);
  mud = mix(mud, vec3(dot(mud, vec3(0.3, 0.5, 0.2))), 0.12);
  vec3 lime = uPLime * 0.76;
  float px = fwidth(vLoc.x) + fwidth(vLoc.y) + fwidth(vLoc.z);
  if (vPart > 4.5) {                                   // hung carpets and sheets
    float st = fract(y * 1.7 + seed * 3.0);
    vec3 c1 = hbClothCol(fract(vC.w * 3.0 + floor(dot(vLoc.xz, vec2(0.11, 0.07)) + seed * 9.0) * 0.37));
    vec3 c2 = hbClothCol(fract(vC.w * 7.0 + 0.5));
    return mix(c1, c2, step(0.72, st)) * (0.8 + 0.2 * hbN2(vLoc.xy * 3.0));
  }
  if (vPart > 3.5) return mix(uPDark * 1.5, uPUmber * 0.5, hbN2(vLoc.xz * vec2(9.0, 1.5) + y * 3.0));
  if (vPart > 2.5) {                                   // lime-washed finials, stair-houses, penthouses
    float up = y - (h - 1.6);
    vec3 c = lime * (0.84 + 0.16 * hbN2(vLoc.xz * 1.3 + y * 0.8 + seed));
    c = mix(c, mud * 1.05, (1.0 - smoothstep(0.0, 1.4, up)) * 0.4 * hbN2(vLoc.xz * 2.0 + seed));
    if (abs(vN0.y) < 0.5) c *= 1.0 - 0.24 * pow(hbN2(vec2(dot(vLoc.xz, vec2(2.9, 2.3)), seed * 9.0)), 2.0) * (0.5 + 0.5 * hbN2(vec2(dot(vLoc.xz, vec2(7.0, 5.0)), y * 0.4))) - 0.16 * (1.0 - smoothstep(0.0, 0.45, up));
    if (vPart > 3.15 && abs(vN0.y) < 0.5) {
      float hu = dot(vLoc.xz, vec2(vN0.z, -vN0.x));
      float op = (1.0 - smoothstep(0.26, 0.3, abs(fract(hu / 2.3 + seed) - 0.5) * 2.3)) * (1.0 - smoothstep(0.5, 0.54, abs(up - 1.35)));
      float fan = (1.0 - smoothstep(0.26, 0.3, abs(fract(hu / 2.3 + seed) - 0.5) * 2.3)) * (1.0 - smoothstep(0.1, 0.13, abs(up - 2.35)));
      float cu = (fract(hu / 2.3 + seed) - 0.5) * 2.3;
      float sur = (1.0 - smoothstep(0.42, 0.46, abs(cu))) * (1.0 - smoothstep(0.66, 0.7, abs(up - 1.42))) + (1.0 - smoothstep(0.38, 0.42, abs(cu))) * (1.0 - smoothstep(0.2, 0.24, abs(up - 2.35)));
      c = mix(c, lime * 1.12, clamp(sur, 0.0, 1.0) * 0.8);
      vec2 lq = vec2(cu + up, cu - up) * 7.0;
      float lat = smoothstep(0.2, 0.32, abs(fract(lq.x) - 0.5)) * smoothstep(0.2, 0.32, abs(fract(lq.y) - 0.5));
      lat = mix(lat, 0.45, clamp(px * 10.0, 0.0, 1.0));
      vec3 leaf = uPUmber * 0.55 * (0.7 + 0.3 * step(0.07, abs(fract(cu * 4.0) - 0.5)));
      float isDoor = step(0.5, hbHash(vec2(floor(hu / 2.3 + seed), seed * 31.0)));
      vec3 opc = mix(mix(uPUmber * 0.75, uPDark * 0.6, lat), leaf, isDoor);
      c = mix(c, opc, op);
      c = mix(c, mix(uPUmber * 0.7, uPDark * 0.5, lat), fan);
    }
    return c;
  }
  if (vPart > 1.5) {                                   // roof terrace with drying dates and airing carpets
    vec3 c = mix(mud * 1.2, lime, 0.25) * (0.8 + 0.25 * hbN2(vLoc.xz * 0.9 + seed * 5.0));
    vec2 cell = floor(vLoc.xz / 3.4 + seed * 13.0), f = fract(vLoc.xz / 3.4 + seed * 13.0) - 0.5;
    float hh = hbHash(cell + seed * 3.1);
    float rect = (1.0 - smoothstep(0.30, 0.33, abs(f.x))) * (1.0 - smoothstep(0.38, 0.41, abs(f.y)));
    if (hh < 0.12) c = mix(c, mix(uPOchre * 0.5, uPUmber * 0.6, hbHash(floor(vLoc.xz * 7.0))), rect);
    else if (hh < 0.2) c = mix(c, mix(hbClothCol(fract(hh * 31.0)), hbClothCol(fract(hh * 57.0)), step(0.6, fract(f.y * 7.0))), rect);
    { float rk = fract(seed * 91.7);                      // one roof in four carries colour that shows from the rim: a big airing carpet, or a mat of dates as wide as the terrace
      if (rk < 0.27) {
        vec2 q = vLoc.xz / max(0.5 * vB.xz - ${we.toFixed(3)} * h - 1.2, vec2(1.0)) - (vec2(fract(seed * 37.3), fract(seed * 53.1)) - 0.5) * 0.4;
        float big = (1.0 - smoothstep(0.50, 0.54, abs(q.x))) * (1.0 - smoothstep(0.62, 0.66, abs(q.y)));
        vec3 k1 = hbClothCol(fract(rk * 43.0)) * 1.35, k2 = hbClothCol(fract(rk * 71.0 + 0.3)) * 1.35;
        vec3 mat_ = mix(k1, k2, step(0.66, fract(q.y * 3.5 + 0.2)) * step(abs(q.x), 0.42));
        mat_ = mix(mat_, uPLime * 0.7, step(0.56, abs(q.y)) * 0.6);
        if (rk < 0.1) mat_ = mix(uPOchre * 0.62, uPUmber * 0.8, 0.5 * hbN2(vLoc.xz * 4.0)) * (0.85 + 0.3 * step(0.5, fract(q.x * 6.0)));
        c = mix(c, mat_, big);
      } }
    vec2 e = 0.5 * vB.xz - ${we.toFixed(3)} * h - abs(vLoc.xz);
    return c * (0.6 + 0.4 * smoothstep(0.4, 1.8, min(e.x, e.y)));
  }
  float xFace = step(0.5, abs(vN0.x));
  if (vPart > 0.5) {                                   // parapet: stepped merlons cut out of the band
    float yb = y - (h - 1.0), u = mix(vLoc.x, vLoc.z, xFace);
    float m = abs(fract(u / 1.9 + 0.5) - 0.5) * 2.0;
    float top = m < 0.34 ? 1.2 : (m < 0.64 ? 0.66 : 0.22);
    if (yb > top) discard;
    vec3 c = lime * (0.82 + 0.18 * hbN2(vec2(u * 1.7, y * 0.7) + seed));
    return c * (0.8 + 0.2 * smoothstep(-1.6, -0.6, yb)) * (0.86 + 0.14 * step(0.34, m));
  }
  // ---- mud wall ----
  vec2 tng = vec2(vN0.z, -vN0.x);
  float fu = dot(vLoc.xz, tng);
  float wd = mix(vB.x, vB.z, xFace), halfTop = 0.5 * wd - ${we.toFixed(3)} * h;
  float face = vN0.x > 0.5 ? 0.0 : (vN0.z > 0.5 ? 1.0 : (vN0.x < -0.5 ? 2.0 : 3.0));
  float fs = seed * 17.0 + face * 3.7, hw = h - 1.0;
  float nS = max(floor(hw / 4.0 + 0.5), 3.0), sH = hw / nS, si = min(floor(y / sH), nS - 1.0), fy = y - si * sH;
  float bayW = 2.3 + 0.6 * hbHash(vec2(fs, 1.3));
  float nb = max(floor((2.0 * halfTop - 1.2) / bayW), 1.0);
  float cx = fu / bayW + 0.5 * nb, ci = floor(cx), fx = (cx - ci - 0.5) * bayW;
  float inb = step(-0.5, ci) * step(ci, nb - 0.5);
  float hsh = hbHash(vec2(ci + fs, si * 1.91 + fs * 0.37)), hs2 = hbHash(vec2(ci * 3.3 + fs, si + 9.1));
  float n1 = hbN2(vec2(fu, y) * 0.22 + fs), n2 = hbN2(vec2(fu, y) * 2.3 + fs);
  vec3 col = mud * (0.86 + 0.18 * n1) * (0.92 + 0.16 * n2);
  col *= 0.9 + 0.2 * hbN2(vec2(fu * 1.6 + fs, y * 0.08));                         // rain-wash running down the plaster
  float nearK = clamp(1.0 - px * 3.0, 0.0, 1.0);
  { float lq = y / 3.0 + 0.4 * hbHash(vec2(fs, 5.1)) + 0.05 * (n1 - 0.5), lf = fract(lq);      // the plaster was laid in lifts of about 3 m: a faint joint, each lift a shade apart, a paler lip under the joint
    col *= 1.0 - 0.1 * (1.0 - smoothstep(0.01, 0.03, min(lf, 1.0 - lf))) * (0.55 + 0.45 * n2) * clamp(1.3 - px * 5.0, 0.0, 1.0);
    col *= 0.95 + 0.1 * hbHash(vec2(floor(lq), fs)) + 0.05 * smoothstep(0.8, 0.98, lf) * nearK; }
  col *= 1.0 - 0.12 * nearK * smoothstep(0.40, 0.48, abs(fract(y / 0.42 + 0.08 * n2) - 0.5)) * (0.55 + 0.45 * hbHash(vec2(floor(y / 0.42), fs))) * smoothstep(0.3, 0.6, hbN2(vec2(fu * 0.7 + fs, y * 0.9)));          // brick courses showing here and there through the plaster
  float pfN = hbN2(vec2(fu, y) * 1.8 + fs * 1.7) + 0.1 * (n2 - 0.5), pfall = smoothstep(0.6, 0.8, pfN);   // fallen plaster: small soft-edged patches
  col = mix(col, mix(col * 0.78, uPUmber * (0.9 + 0.5 * n2), 0.45), pfall * 0.35);
  col += vec3(0.06, 0.045, 0.015) * smoothstep(0.75, 0.8, pfN) * nearK * step(0.92, hbHash(floor(vec2(fu * 14.0, y * 40.0))));   // straw
  // lime-washed top storeys with a dripping lower edge, and thin lime bands on the storeys below
  float wl = hw - sH * vC.y;
  float drip = (hbN2(vec2(fu * 0.9, fs)) - 0.5) * 1.3 + pow(hbN2(vec2(fu * 4.3, fs + 7.0)), 4.0) * 2.6;
  float wm = smoothstep(0.0, 0.14, y - wl + drip);
  col = mix(col, lime * (0.86 + 0.14 * n2) * (0.9 + 0.1 * n1), wm);
  col *= 1.0 - 0.2 * wm * pow(hbN2(vec2(fu * 2.7, fs + 3.0)), 3.0) * smoothstep(0.0, 3.5, hw - y) * (0.5 + 0.5 * hbN2(vec2(fu * 9.0, y * 0.35)));   // grey rain streaks down the lime
  col *= 1.0 - 0.3 * (1.0 - smoothstep(0.05, 0.22, abs(y - (hw - 0.3)))) - 0.14 * (1.0 - smoothstep(0.0, 1.8, hw - y));       // a string course under the parapet and the shade of the merlons
  float band = (1.0 - smoothstep(0.07, 0.12, abs(fy - 0.14))) * step(nS - 3.5, si);
  col = mix(col, lime * 0.9, band * 0.6 * (0.55 + 0.45 * n1));
  // windows: lime surround, carved lattice, fanlight above; a plank door on the front face
  float top2 = step(nS - 2.5, si);
  float ww = mix(0.36, 0.47, top2), wh = mix(0.56, 0.8, top2), cy = sH * 0.5 + 0.05;
  float door = 0.0;
  if (si < 0.5) { ww = 0.13; wh = 0.3; cy = sH * 0.62;
    if (face == 1.0 && abs(ci - floor(nb * 0.5)) < 0.5) { door = 1.0; ww = 0.78; wh = 1.3; cy = 1.3; } }
  else if (si < 1.5) { ww = 0.2; wh = 0.34; }
  else if (hsh < 0.22) { ww *= 0.7; wh *= 0.7; }
  float show = inb * max(step(0.09, hsh), door);
  float d = max(abs(fx) - ww, abs(fy - cy) - wh);
  if (top2 > 0.5) { float ay = fy - (cy + wh - ww); if (ay > 0.0) d = length(vec2(fx, ay)) - ww; }
  float d2 = max(abs(fx) - 0.2, abs(fy - (cy + wh + 0.5)) - 0.13);
  if (si > 1.5) d = min(d, d2);
  float sur = (1.0 - smoothstep(0.11, 0.16, d + (n2 - 0.5) * 0.06)) * show;
  col = mix(col, lime * 0.95, sur);
  float inside = (1.0 - smoothstep(-0.02, 0.02, d)) * show;
  vec2 q = vec2(fx + fy, fx - fy) * 8.0;
  float lp = smoothstep(0.22, 0.32, abs(fract(q.x) - 0.5)) * smoothstep(0.22, 0.32, abs(fract(q.y) - 0.5));
  lp = mix(lp, 0.4, clamp(px * 14.0, 0.0, 1.0));
  vec3 wcol = mix(mix(uPUmber * 0.62, uPDark * 1.3, 0.3 + 0.5 * hs2), uPUmber * 0.16, lp * 0.85);
  if (hs2 > 0.8) wcol = mix(uPGreen, uPSky, fract(hs2 * 17.0)) * 0.5 * (0.75 + 0.25 * step(0.12, abs(fract(fx * 3.0) - 0.5)));
  if (door > 0.5) wcol = uPUmber * 0.42 * (0.7 + 0.3 * step(0.08, abs(fract(fx * 3.2) - 0.5)))
    + vec3(0.05, 0.04, 0.03) * step(0.8, hbHash(floor(vec2(fx * 6.4, fy * 3.0))));
  wcol *= 0.5 + 0.5 * smoothstep(0.0, 0.3, (cy + wh) - fy);
  { float jamb = (1.0 - smoothstep(0.03, 0.09, fx + ww)) * step(door, 0.5), sillK = (1.0 - smoothstep(0.03, 0.08, fy - (cy - wh))) * step(door, 0.5);
    wcol = mix(wcol, mix(mud, lime, 0.55) * 0.8, max(jamb * 0.85, sillK)); }      // the reveal: one jamb and the sill catch the light, the lattice sits back in the wall
  col = mix(col, wcol, inside);
  gHbLamp = inside * step(0.78, hsh) * step(1.5, si) * step(door, 0.5) * (0.35 + 0.65 * lp);
  float sill = (1.0 - smoothstep(ww * 0.8, ww * 1.4, abs(fx))) * smoothstep(cy - wh - 1.7, cy - wh - 0.2, fy) * step(fy, cy - wh - 0.2);
  col *= 1.0 - 0.16 * sill * show;
  // grey streak under the drain spout, eroded foot, dusty skirt, lane occlusion
  float below = (h - 1.75) - y;
  float streak = exp(-abs(fu - 0.56 * halfTop) / (0.22 + 0.035 * max(below, 0.0))) * (1.0 - smoothstep(0.0, 17.0, below)) * step(0.0, below) * step(face, 1.5);
  col = mix(col, col * vec3(0.4, 0.39, 0.4), streak * 0.8 * (0.45 + 0.55 * hbN2(vec2(fu * 6.0, y * 0.4) + fs)));
  col = mix(col, uPUmber * 0.6, (1.0 - smoothstep(0.3, 3.4, y + (n1 - 0.5) * 2.4)) * 0.5);
  col = mix(col, mud * 1.25, (1.0 - smoothstep(0.0, 0.9, y)) * 0.5);
  return col * mix(0.68, 1.0, smoothstep(0.0, 18.0, y));
}
`;function at(r,f,n,T){const B=new t.MeshStandardMaterial({color:16777215,roughness:.94,metalness:0,side:t.DoubleSide});return Le(B,{...r,...f,uBounce:n,uLamp:T},"tower",{vertPars:Je,vert:p=>p.replace("#include <beginnormal_vertex>",et).replace("#include <begin_vertex>",tt),fragPars:ot,frag:p=>p.replace("#include <color_fragment>",`#include <color_fragment>
  diffuseColor.rgb = hbTowerColor();`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
  { vec3 hbE = (uHbInv * vec4(vHbW, 1.0)).xyz; totalEmissiveRadiance += diffuseColor.rgb * uBounce * (1.0 - hbShadow(hbE)) * (1.0 - 0.75 * hbTownW(hbE)) + vec3(1.0, 0.55, 0.2) * (2.6 * uLamp * gHbLamp); }`)})}const Ce=`
vec3 hg(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx) * 2. - 1.; }
float gn(vec3 p){ vec3 i = floor(p), f = fract(p); vec3 u = f * f * f * (f * (f * 6. - 15.) + 10.);
  return mix(mix(mix(dot(hg(i), f), dot(hg(i + vec3(1., 0., 0.)), f - vec3(1., 0., 0.)), u.x),
                 mix(dot(hg(i + vec3(0., 1., 0.)), f - vec3(0., 1., 0.)), dot(hg(i + vec3(1., 1., 0.)), f - vec3(1., 1., 0.)), u.x), u.y),
             mix(mix(dot(hg(i + vec3(0., 0., 1.)), f - vec3(0., 0., 1.)), dot(hg(i + vec3(1., 0., 1.)), f - vec3(1., 0., 1.)), u.x),
                 mix(dot(hg(i + vec3(0., 1., 1.)), f - vec3(0., 1., 1.)), dot(hg(i + vec3(1., 1., 1.)), f - vec3(1.)), u.x), u.y), u.z); }
// billows: rounded puffs with sharp creases between them (cauliflower)
float bil(vec3 p){ float g = gn(p); return min(sqrt(g * g + 0.003) * 2.7, 1.); }     // the creases are rounded off: dust, not rock
`,Ke=`
vec3 wallPos(vec2 st, out float cav){
  float s = st.x, t = st.y;
  float x = 1750. * (0.42 * s + 0.58 * s * s * s);
  x *= 1. + 0.5 * (1. - smoothstep(-0.6, 0., s));                          // the shell reaches half as far again to the north: its shoulder stands over the far cliff in the first view from the rim
  float xb = max(x, -1100.);                                               // and up there it no longer bows away from the town
  float tf = min(t / 0.84, 1.);
  float y = 700. * (0.42 * tf + 0.58 * tf * tf);
  float e1 = (y - 150.) / 120.;
  float fwd = 0.27 * y + 55. * exp(-e1 * e1) + 55. * exp(-y / 26.);       // 15 degree lean, nose, foot skirt
  float cf = max(t - 0.84, 0.) / 0.16, a = cf * 1.5708;
  y += 100. * sin(a); fwd -= 100. * (1. - cos(a));                         // the crest rolls back over the top
  float ang = mix(-0.26, 1.4, cf);
  vec3 dir = vec3(0., sin(ang), cos(ang));
  float r = uHbTime, o = uWallSeed;
  float b1 = bil(vec3(x, y + r * 7., r * 2.) / 430. + 3.1 + o);
  float b2 = bil(vec3(x * 0.8 + y * 0.6, y * 0.8 - x * 0.6 + r * 11., r * 4.) / 170. + 7.7 + o);
  float b3 = bil(vec3(x * 0.8 - y * 0.6, y * 0.8 + x * 0.6 + r * 15., r * 6.) / 66. + 1.9 + o);
  cav = b1 * 0.5 + b2 * 0.3 + b3 * 0.2;
  float D = (120. * b1 + 66. * b2 + 25. * b3) * (0.3 + 0.7 * smoothstep(0., 110., y));
  return vec3(x, y, uHbFrontZ + fwd - 0.00018 * xb * xb + 45. * sin(x * 0.0041 + 0.7 + o)) + dir * D;
}
`,nt=`
uniform float uHbTime, uHbFrontZ, uWallSeed;
varying vec3 vP; varying vec3 vN; varying float vT; varying float vCav;
#include <fog_pars_vertex>
${Ce}
${Ke}
void main(){
  float c0, c1;
  vec3 p = wallPos(position.xy, c0);
  vec3 ps = wallPos(position.xy + vec2(0.004, 0.), c1), pt = wallPos(position.xy + vec2(0., 0.006), c1);
  vec3 n = cross(ps - p, pt - p);
  vN = n / max(length(n), 1e-5);
  vP = p; vT = position.y; vCav = c0;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,st=`
uniform vec3 uSunDir, uSunCol, uWDark, uWMid, uWTan, uWOchre, uGlow;
uniform float uWLit, uWGild, uWGildLow;
varying vec3 vP; varying vec3 vN; varying float vT; varying float vCav;
#include <fog_pars_fragment>
${de}
${Ce}
void main(){
  vec3 N = vN / max(length(vN), 1e-5);
  vec3 cam = (uHbInv * vec4(cameraPosition, 1.)).xyz;
  vec3 V = (cam - vP) / max(distance(cam, vP), 1e-3);
  float farK = smoothstep(350., 1500., distance(cam, vP));                    // 0 where the face stands over us in the last third, 1 from the rim
  float r = uHbTime;
  vec3 q1 = vec3(vP.x * 0.9 + vP.y * 0.44, vP.y * 0.9 - vP.x * 0.44 + r * 17., r * 5.) / 31.;
  vec3 q2 = vec3(vP.x, vP.y + r * 22., r * 8.) / 11.5 + 4.;
  float f1 = bil(q1), f2 = bil(q2);
  float g1 = bil(q1 + vec3(0.44, 0.9, 0.) * (4. / 31.)), g2 = bil(q2 + vec3(0., 4. / 11.5, 0.));
  float det = f1 * 0.62 + f2 * 0.38;
  float slope = ((g1 - f1) * 9. + (g2 - f2) * 3.) / 4.;                       // the fine puffs as a height field
  { float nearD = 1. - smoothstep(260., 700., distance(cam, vP));             // close to (the face over us in the last third) a third octave, 4 m across, grains the puffs
    vec3 q3 = vec3(vP.x * 0.8 - vP.y * 0.6, vP.y * 0.8 + vP.x * 0.6 + r * 9., vP.z * 0.35 + r * 3.) / 6.5 + 9.;
    float f3 = bil(q3), g3 = bil(q3 + vec3(0.6, 0.8, 0.) * (2. / 6.5));
    det = mix(det, det * 0.86 + f3 * 0.14, nearD); slope += (g3 - f3) * 0.5 * nearD; }
  float big = bil(vec3(vP.x, vP.y * 1.3 + r * 9., r * 3.) / 250. + 5.3);       // towers of cloud 250 m across, each with a lit head and a dark throat
  vec3 Nd = N + vec3(0., -slope * 0.55, 0.); Nd /= max(length(Nd), 1e-4);
  float cav = vCav * 0.9 + det * 0.1;
  float crease = smoothstep(0.0, 0.45, cav);
  vec3 col = mix(uWDark * 0.8, uWMid * 0.94, 0.16 + 0.76 * crease);
  col = mix(col, col * 0.62 + uWOchre * 0.035, (1. - smoothstep(0.2, 0.7, det)) * (1. - 0.6 * farK) * 0.7);   // close to, the fine puffs have dark throats of their own
  float shade = 0.5 + 0.5 * Nd.y;                                             // undersides dark, tops catch the sky
  col = mix(col * 0.58, col + uWTan * 0.12, smoothstep(0.15, 0.9, shade));
  #ifdef USE_FOG
  col += fogColor * (0.07 * smoothstep(0.45, 0.95, shade) * (0.4 + 0.6 * crease));   // the open sky fills the tops of the lobes
  #endif
  { float cn = hbN2(vec2(vP.x * 0.07, vP.y * 0.011 + r * 0.35)); col *= mix(0.86 + 0.28 * cn, 0.7 + 0.5 * cn, uHbThin); }   // falling curtains of grit, plainer in a thin front
  float sunHigh = smoothstep(0.1, 0.5, uSunDir.y);                            // a low sun behind the wall cannot spill over its top: it would only draw lines on the folds
  col += uWTan * uSunCol * 0.3 * smoothstep(0.1, 0.8, dot(Nd, uSunDir)) * crease * smoothstep(0.3, 0.9, vT) * sunHigh;   // sun spilling over the crest
  col *= mix(0.6, 1., smoothstep(0., 0.55, vT));
  { // a high sun to one side of the wall gilds the flank of every billow that is turned to it: lit heads over brown-black throats
    // (the light is taken from a direction turned a little toward the face: the true sun stands too far behind the wall to reach any but the steepest flank)
    vec3 gDir = uSunDir + vec3(0., 0.5 * uWGildLow, 0.75 + 0.9 * uWGildLow); gDir /= max(length(gDir), 1e-4);    // (under a low sun it is turned further: the heads take the light, not the folds)
    float sunN = dot(Nd, gDir), gK = uWGild * max(sunHigh, uWGildLow) * max(1. - uWLit, 0.);
    float gild = smoothstep(0.0, 0.65, sunN) * (0.25 + 0.75 * smoothstep(0.2, 0.7, cav)) * (0.55 + 0.45 * smoothstep(0.25, 0.8, det)) * (0.45 + 0.55 * smoothstep(0.1, 0.7, big));
    col *= 1. - 0.32 * gK * (1. - smoothstep(0.1, 0.55, cav));                                           // and the throats go deeper beside them
    col += mix(uWTan * 0.9 + uWOchre * 0.25, uWOchre * 0.8 + uWTan * 0.3, uWGildLow) * uSunCol * (gild * gK); }
  col += uWOchre * uSunCol * (0.085 * crease * smoothstep(0.12, 0.7, vT) * (0.4 + 0.6 * det) * max(1. - uWLit, 0.));   // amber soaking through the heads of the lobes: brown-black in the throats, amber where the dust is thin
  { // face lit directly when the sun is behind the camera: creases, undersides and the lee of every lobe fall back to the dark and mid colours
    float litK = (0.08 + 0.92 * smoothstep(0.25, 0.9, cav)) * (0.10 + 0.90 * smoothstep(0.2, 0.95, dot(Nd, uSunDir))) * mix(0.4, 1.0, smoothstep(0.2, 0.85, shade)) * (0.7 + 0.6 * det);
    litK *= 0.45 + 0.75 * smoothstep(0.12, 0.8, big);
    col *= mix(1., 0.7 + 0.3 * smoothstep(0.1, 0.7, big), min(uWLit, 1.));
    col += (uWTan * 0.75 + uWOchre * 0.35) * uSunCol * uWLit * litK; }
  float rim = 1. - abs(dot(N, V)), thin = rim * rim * rim;
  vec3 Ns = N * 0.4 + vec3(0., 0.26, 0.97) * 0.6; Ns /= max(length(Ns), 1e-4);  // the shell's own facing, with the lobes smoothed away: only the outer silhouette is an edge
  float thinS = 1. - abs(dot(Ns, V));
  float fwd = max(dot(-V, uSunDir), 0.); fwd *= fwd;
  vec3 hz = uHbDust * 1.7;
  #ifdef USE_FOG
  hz = mix(hz, fogColor, 0.4);
  #endif
  col = mix(col, hz, smoothstep(0.25, 0.9, thinS) * 0.9 * mix(0.22, 1., farK));                      // the wall's outer edge melts toward the haze (not every fold inside it)
  float hgt = 0.05 + 0.95 * smoothstep(0.35, 0.95, vT);
  float thinL = mix(thin, thinS * thinS, 0.98) * crease * mix(0.45, 1., farK);                      // lit through at the outer silhouette and the puff tops, never as a line on every fold
  col += uWOchre * uSunCol * thinL * (0.12 + 1.7 * fwd) * hgt * 1.4;
  float rimB = min(rim, 0.62);                                                  // capped, so the fold itself is no brighter than the flank beside it
  col += uWOchre * uSunCol * (0.12 * rimB * rimB * smoothstep(0.0, 1.0, crease) * (1. - sunHigh) * max(1. - uWLit, 0.) * (0.35 + 0.65 * hgt));   // first light soaks broadly through the flanks of the lobes
  float crest = smoothstep(0.76, 0.97, vT);
  col = mix(col, uWOchre * uSunCol * (0.75 + 1.1 * det) * 1.5, crest * 0.88);  // the burning rim
  col = mix(col, uHbDust * (1. - 0.42 * uHbNear * (1. - farK)), (1. - smoothstep(0., mix(55., 125., farK), vP.y)) * mix(0.6, 0.8, farK));   // (in the arrival the foot over the town is darker dust: the core comes down to the ground)
  vec2 gd = (vP.xy - uGlow.xy) / 210.;
  col += vec3(1.0, 0.4, 0.09) * uGlow.z * exp(-dot(gd, gd)) * (1.25 - 0.95 * crease);   // dull amber glow in the depths
  col = mix(col, uHbDust, hbFog(vP, cam) * mix(0.3, 0.12, min(uWLit, 1.)));
  gl_FragColor = vec4(col, 1.);
  vec3 pre = col;
  #include <fog_fragment>
  gl_FragColor.rgb = mix(pre, gl_FragColor.rgb, 0.42);
}`,it=`
attribute vec4 iP; attribute vec2 iQ;                 // shell s, shell t, metres ahead of the shell, radius | seed, strength
uniform float uHbTime, uHbFrontZ, uWallSeed, uNearK;
uniform vec3 uSunDir;
varying vec2 vUv; varying vec3 vC; varying vec3 vQ; varying float vY; varying vec4 vS;
#include <fog_pars_vertex>
${Ce}
${Ke}
void main(){
  float life = fract(uHbTime * (0.016 + 0.014 * fract(iQ.x * 7.31)) + iQ.x);      // each puff is born small against the wall, rolls out and up, and thins away
  float rad = iP.w * (0.6 + 0.55 * life), cav;
  vec3 c = wallPos(vec2(iP.x, iP.y + 0.05 * life), cav);                            // on the shell's own boiling surface
  c += vec3(0., 0.2, 0.98) * (iP.z + rad * (0.55 + 0.45 * life));                   // and far enough ahead of it that the disc is not cut through its middle
  c.y = max(c.y, rad * 0.22);
  vec4 mvPosition = modelViewMatrix * vec4(c, 1.);
  mvPosition.xy += position.xy * rad;
  float nearB = step(1.5, iQ.y), str = (iQ.y - 2. * nearB) * mix(1., uNearK, nearB);     // the near billows (strength + 2) come up with the gust, over the last third
  vUv = position.xy; vC = c; vQ = vec3(iQ.x, str * 4. * life * (1. - life), life); vY = c.y + position.y * rad;
  vec3 sv = (viewMatrix * modelMatrix * vec4(uSunDir, 0.)).xyz;
  vS = vec4(sv / max(length(sv), 1e-4), -mvPosition.z);                                 // where the sun stands, seen from the puff; how far off it is
  gl_Position = str < 0.004 ? vec4(2., 2., 2., 1.) : projectionMatrix * mvPosition;
  if (str >= 0.004) {                                                                   // the disc's depth is pulled toward the eye by most of its radius: the opaque shell behind it cannot slice it along a contour
    vec4 pb = projectionMatrix * vec4(mvPosition.xy, min(mvPosition.z + rad * 0.9, -1.), 1.);
    gl_Position.z = pb.z / max(pb.w, 1e-4) * gl_Position.w;
  }
  #include <fog_vertex>
}`,rt=`
uniform vec3 uSunCol, uSunDir, uWTan, uWOchre, uWDark, uWMid;
uniform float uWLit, uWGild, uWGildLow;
varying vec2 vUv; varying vec3 vC; varying vec3 vQ; varying float vY; varying vec4 vS;
#include <fog_pars_fragment>
${de}
void main(){
  float r2 = dot(vUv, vUv);
  if (r2 > 1.) discard;
  float fall = 1. - r2; fall *= fall;
  float r = uHbTime;
  float nearK = 1. - smoothstep(450., 1500., vS.w), rr = r * mix(1., 3., nearK);          // close to, the billows roll visibly
  float n = hbN2(vUv * 2.2 + vQ.x * 31. + vec2(0., -rr * 0.05)) * 0.62 + hbN2(vUv * 5.6 + vQ.x * 57. + vec2(rr * 0.04, -rr * 0.1)) * 0.38;
  float fq = n * 0.75 + fall * 0.5;
  float a = mix(fall, 1. - r2, 0.6 * nearK) * mix(smoothstep(0.12, 0.7, fq), smoothstep(0.3, 0.52, fq), 0.7 * nearK) * vQ.y * smoothstep(-6., 24., vY) * mix(1., 0.55, min(uWLit, 1.));   // on a lit face the pale puffs are thinner: they do not plaster it. Close to, a billow has an edge
  a = min(a * mix(1., 1.6, nearK), 0.97);
  a *= 1. - nearK * mix(0.7 + 0.2 * smoothstep(45., 150., vY), 1., uHbNear);                             // close to, the puffs above the skirt thin to a veil: the wall's own lit billows are the picture, not a haze of discs in front of them. In the arrival (uHbNear) the near discs go altogether: the wall stands dark and sculpted over its own shadow
  float sh = 0.5 + 0.5 * vUv.y;                                                 // tops catch the sky, undersides stay dark
  vec3 pale = uHbDust * 1.5;
  #ifdef USE_FOG
  pale = mix(uHbDust * 1.2, fogColor * 0.8, 0.35 + 0.3 * sh);                 // paler than the wall behind: the profile reads soft and ragged
  #endif
  pale *= mix(1., 0.6, uHbThin);
  vec3 col = pale * (0.72 + 0.5 * sh + 0.36 * (n - 0.5)) + uWTan * 0.08 * sh;
  { // each puff modelled as a ball of dust: lobes from the noise, a brown-black throat, a warm limb on the side the sun stands
    float limb = sqrt(r2), toSun = dot(vUv, vS.xy / max(length(vS.xy), 1e-3)), lobes = smoothstep(0.3, 0.72, n);
    vec3 body = mix(uWDark * 0.9, uWMid * 1.15, 0.2 + 0.8 * lobes);
    body = mix(body * 0.6, body + uWTan * 0.16, smoothstep(0.1, 0.9, 0.5 + 0.3 * vUv.y + 0.3 * toSun));
    body *= 0.62 + 0.38 * smoothstep(0., 0.7, limb);
    float rimK = smoothstep(0.35, 0.95, limb) * smoothstep(-0.15, 0.75, toSun) * (0.45 + 0.9 * n);
    body += uWOchre * uSunCol * (0.5 * rimK * max(1. - uWLit, 0.));
    body += uWOchre * uSunCol * (0.3 * rimK * nearK * max(1. - uWLit, 0.));
    { // lit as a ball: the side turned to the sun is gilded, its throat and its lee stay brown-black (view space; the light is turned a little toward the eye, as on the wall)
      vec3 nb = vec3(vUv, sqrt(max(1. - r2, 0.))), lg = vS.xyz + vec3(0., 0.1, 0.55); lg /= max(length(lg), 1e-4);
      float litP = smoothstep(0.2, 0.85, dot(nb, lg) + 0.5 * (n - 0.5)) * (0.3 + 0.7 * lobes);
      float gKP = uWGild * max(smoothstep(0.1, 0.5, uSunDir.y), uWGildLow) * max(1. - uWLit, 0.);
      body *= 1. - 0.3 * gKP * (1. - litP);
      body += mix(uWTan * 0.9 + uWOchre * 0.25, uWOchre * 0.8 + uWTan * 0.3, uWGildLow) * uSunCol * (0.8 * litP * gKP); }
    col = mix(col, body, mix(0.8, 1., nearK) * mix(1., 0.5, uHbThin)); }
  col += (uWTan * 0.75 + uWOchre * 0.35) * uSunCol * uWLit * (0.16 + 0.5 * sh) * (0.6 + 0.8 * n) * (0.35 + 0.65 * sh);
  vec3 cam = (uHbInv * vec4(cameraPosition, 1.)).xyz;
  col = mix(col, uHbDust, hbFog(vC, cam) * 0.3);
  gl_FragColor = vec4(col, a);
  vec3 pre = col;
  #include <fog_fragment>
  gl_FragColor.rgb = mix(pre, gl_FragColor.rgb, 0.42);
}`,lt=`
attribute vec4 iA; attribute vec4 iB;
uniform float uHbTime, uHbTearZ, uHbShadowZ;
varying vec3 vP; varying vec2 vUv; varying float vOn; varying float vSeed;
#include <fog_pars_vertex>
void main(){
  float on = smoothstep(0., 80., uHbTearZ - iA.y) * 0.22 + smoothstep(-25., 45., uHbShadowZ - iA.y) * 0.78;
  float al = position.y, w = iB.x - ${(we*2).toFixed(4)} * iB.y;
  float len = iB.z * 0.7 + 6. + 13. * on;
  vec3 p = vec3(iA.x + position.x * (w + 0.6 + al * 3.), iB.y + 0.3 + 0.9 * sin(al * 3.1416) * on - 6. * al * al, iA.y - iB.z * 0.5 + 0.4 + al * len);
  p.y += sin(uHbTime * 5.3 + al * 7. + iB.w * 31. + position.x * 4.) * 0.5 * al;
  vP = p; vUv = vec2(position.z > 0.5 ? position.x * 0.4 : position.x, al); vOn = on; vSeed = iB.w;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = on < 0.01 ? vec4(2., 2., 2., 1.) : projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ct=`
uniform vec3 uSunCol, uSandLit;
varying vec3 vP; varying vec2 vUv; varying float vOn; varying float vSeed;
#include <fog_pars_fragment>
${de}
void main(){
  float s = hbN2(vec2(vP.x * 2.7 + vSeed * 7., (vP.z - uHbTime * 24.) * 0.1)) * (0.4 + 0.9 * hbN2(vec2(vP.x * 0.33 + vSeed * 37., (vP.z - uHbTime * 15.) * 0.045 + vP.y * 0.3 + vSeed * 11.)));
  float edge = 1. - abs(vUv.x * 2.); edge = 1. - (1. - edge) * (1. - edge) * (1. - edge);
  float a = vOn * smoothstep(0., 0.1, vUv.y) * (1. - smoothstep(0.4, 1., vUv.y)) * (0.03 + 1.3 * s * s) * edge * (0.55 + 0.45 * fract(vSeed * 91.7));
  vec3 cam = (uHbInv * vec4(cameraPosition, 1.)).xyz;
  float fg = hbFog(vP, cam);
  a = min(a, 0.38) * (1. - 0.85 * fg);
  if (a < 0.004) discard;
  float sh = hbShadow(vP);
  vec3 col = mix(uSandLit * uSunCol * (0.55 + 0.7 * s), uHbDust * 1.35, sh);
  col = mix(col, uHbDust, fg);
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`,ht=`
attribute vec2 aQ; attribute vec4 iK0; attribute vec4 iK1; attribute vec4 iK2;
uniform float uHbTime, uHbTearZ, uHbGust, uPxAng;
uniform mat4 uHbInv;
varying vec3 vP; varying vec3 vCol; varying vec3 vUvw; varying float vA;
#include <fog_pars_vertex>
// where the kite is once the tear line has run d metres past its roof (d = 0: still flying on its string)
vec3 kitePos(float d){
  float ph = iK0.w, g = uHbGust, t = uHbTime * (0.7 + 1.7 * g);
  vec3 dance = vec3(sin(t * 0.9 + ph) * 2.6 + sin(t * 2.3 + ph * 1.7) * g, sin(t * 1.7 + ph * 2.) * 1.4 * (1. + g), cos(t * 0.6 + ph) * 1.8);
  vec3 k = iK0.xyz + iK1.xyz * vec3(1., 1. - 0.2 * g, 1. + 0.3 * g) + dance * (1. + 1.2 * g);
  float lift = smoothstep(0., 20., d);
  return k + vec3(sin(d * 0.045 + ph) * 9. * lift, 12. * (1. - exp(-d / 35.)) - d * d * 0.00042, d * 0.82);
}
void main(){
  float part = position.x, s = position.y, side = position.z, ph = iK0.w, g = uHbGust;
  float d = max(uHbTearZ + iK2.w - iK0.z, 0.);
  float r = smoothstep(0., 22., d), vis = 1. - smoothstep(330., 420., d);
  vec3 K = kitePos(d);
  vec3 cam = (uHbInv * vec4(cameraPosition, 1.)).xyz;
  float sz = iK1.w * vis;
  float a1 = mix(0.6 + 0.25 * sin(uHbTime * 1.3 + ph), d * 0.11 + ph, r);
  float a2 = mix(0.22 * sin(uHbTime * (0.9 + 3. * g) + ph * 3.), d * 0.07, r);
  vec3 right = vec3(cos(a2), sin(a2), 0.);
  vec3 up = vec3(-sin(a2) * cos(a1), cos(a2) * cos(a1), sin(a1));
  vec3 nrm = cross(right, up);
  vec3 p, T = vec3(0., 1., 0.); float w0 = 0.; vec3 col = iK2.rgb; float alpha = 1.;
  if (part < 0.5) {
    p = K + (right * aQ.x + up * aQ.y + nrm * (1. - abs(aQ.x) * 2.2) * 0.09) * sz;
    vUvw = vec3(aQ, 0.);
  } else if (part < 1.5) {
    vec3 dirT = mix(vec3(0., -1., 0.3), vec3(0., 0.3, -1.), max(r, 0.5 * g)); dirT = dirT / max(length(dirT), 1e-4);
    p = K - up * 0.7 * sz + dirT * s * sz * 2.8
      + vec3(sin(s * 9. - uHbTime * (6. + 6. * g) + ph), 0.3 * cos(s * 8. - uHbTime * 7. + ph), cos(s * 7. - uHbTime * 5. + ph)) * 0.16 * sz * s * (1. + r);
    T = dirT; w0 = 0.042 * sz * (1. - 0.5 * s);
    col = mix(col, vec3(0.75, 0.72, 0.64), step(0.5, fract(s * 4.5)));
    vUvw = vec3(0., 0., 1.);
  } else {
    vec3 A = iK0.xyz, B = K;
    float L = distance(A, B);
    vec3 pc = mix(A, B, s); pc.y -= sin(s * 3.1416) * L * 0.11 * (1. - 0.7 * g); pc.z += sin(s * 3.1416) * L * 0.05 * g;
    vec3 pt = kitePos(max(d - (1. - s) * 46., 0.));
    pt += vec3(sin(s * 13. - d * 0.3 + ph), cos(s * 11. - d * 0.23), 0.) * (1. - s) * 3. * r - vec3(0., (1. - s) * 9. * r, 0.);
    p = mix(pc, pt, r);
    T = mix((B - A) / max(L, 1e-3), vec3(0., 0.35, 0.94), r); T = T / max(length(T), 1e-4);
    w0 = 0.03 * vis; col = vec3(0.5, 0.46, 0.4);
    vUvw = vec3(0., 0., 2.);
  }
  if (part > 0.5) {
    float dist = distance(cam, p);
    vec3 sd = cross(T, cam - p) + vec3(1e-4, 2e-4, 0.);
    float wMin = dist * uPxAng * 0.8;
    p += sd / max(length(sd), 1e-4) * side * max(w0, wMin) * step(0.001, vis);
    alpha = clamp(w0 / max(wMin, 1e-5), part > 1.5 ? 0.14 : 0.35, 1.) * (part > 1.5 ? 1. - 0.75 * smoothstep(200., 600., dist) : 1.);
  }
  vP = p; vCol = col; vA = alpha * step(0.001, vis);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ft=`
uniform vec3 uSunCol;
varying vec3 vP; varying vec3 vCol; varying vec3 vUvw; varying float vA;
#include <fog_pars_fragment>
${de}
void main(){
  if (vA < 0.01) discard;
  vec3 col = vCol;
  if (vUvw.z < 0.5) {      // paper with a bamboo cross and a darker glued border
    float cross_ = min(abs(vUvw.x), abs(vUvw.y - 0.14));
    col *= 0.45 + 0.55 * smoothstep(0.012, 0.03, cross_);
    col *= 1.15;
  }
  float sh = hbShadow(vP);
  col *= mix(vec3(1.25) * uSunCol, uHbUmber * 0.5, sh);
  vec3 cam = (uHbInv * vec4(cameraPosition, 1.)).xyz;
  col = mix(col, uHbDust, hbFog(vP, cam));
  gl_FragColor = vec4(col, vA);
  #include <fog_fragment>
}`;function Me(r,f,n,T,B={}){return new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...r,...f},vertexShader:n,fragmentShader:T,fog:!0,...B})}function ue(r,f,n){let T=1/0;for(let B=1;B<n.length;B++){const p=n[B-1][0],_=n[B-1][2],S=n[B][0],Y=n[B][2],R=S-p,U=Y-_,ae=R*R+U*U||1,z=Math.min(1,Math.max(0,((r-p)*R+(f-_)*U)/ae));T=Math.min(T,Math.hypot(r-p-R*z,f-_-U*z))}return T}async function vt(r,f={}){const n=r.rng.fork?r.rng.fork("haboob"):r.rng,T=(f.palette&&f.palette.length>=7?f.palette:Ee).map(be),[B,p,_,S,Y,R,U]=T,ae=r.quality&&r.quality.detail||1,z=f.frontX||Qe([[0,2400],[.53,1100],[.67,530],[.83,320],[1,240]]),D=f.tearX||(e=>300-600*(e-.62)/.3),E=f.gust||(e=>Be(.6,.66,e)),c=new t.Vector3().fromArray(f.sunDir||[.164,.899,-.406]).normalize(),h=be(f.sunColor||"#FFF6E0"),s={uHbTime:{value:0},uHbFrontZ:{value:-400},uHbShadowZ:{value:-100},uHbTearZ:{value:0},uHbGust:{value:1},uHbThin:{value:f.thin?1:0},uHbNear:{value:0},uHbRents:{value:[new t.Vector4,new t.Vector4,new t.Vector4]},uHbRentDir:{value:new t.Vector2},uHbDust:{value:_.clone().lerp(p,.2).multiplyScalar(.62).lerp(new t.Color(.1,.085,.07),.25)},uHbUmber:{value:new t.Color(.5,.33,.22)},uHbBounce:{value:new t.Color(0,0,0)},uHbSpot:{value:new t.Vector4(0,0,60,0)},uHbInv:{value:new t.Matrix4},uHbShMap:{value:null},uHbShBox:{value:new t.Vector4(te,oe,1/Se,1/Pe)}},P=new Uint8Array(Se*Pe),l=new t.DataTexture(P,Se,Pe,t.RedFormat,t.UnsignedByteType);l.magFilter=l.minFilter=t.LinearFilter,l.generateMipmaps=!1,l.needsUpdate=!0,s.uHbShMap.value=l;const g=f.wallColors||{};g.dust&&s.uHbDust.value.set(g.dust);const I={uPLime:{value:B},uPMud:{value:p},uPUmber:{value:_},uPDark:{value:S},uPOchre:{value:Y},uPSky:{value:R},uPGreen:{value:U}},Z={uSunDir:{value:c},uSunCol:{value:h.clone()}},O=new t.Group;O.name="haboob-shadow-line";const G=10,ne=[[210,5,0],[123,5,0],[110,5,G*.5],[97,5,G],[22,5,G]],J=[[22,5,G],[0,11,G],[-30,28,G],[-58,44,G+2],[-120,44,30],[-210,40,55],[-300,22,100],[-360,9,110],[-440,9,110]],ie=J.slice(3,7),re=e=>G*(1-Be(97,123,e)),$=[];if(f.towers!==!1){const e=[],y=n.int(5,9);for(let x=0;x<y;x++)e.push([n.range(-190,190),n.range(-260,260),n.range(13,24)]);const A=f.street!==!1;for(const x of[-1,1]){let u=A?4.5:2.5;for(let d=0;d<16;d++){const q=n.range(13,16),k=n.range(4.6,6.2);if(u+q>me-4)break;let j=-fe+6+n.range(0,6);for(;j<fe-16;){const F=n.range(12,16),L=d===0?n.range(12,15.5):Math.min(q,n.range(12,16)),m=j+F/2,o=re(m)+x*(u+L/2+(d===0?0:n.range(0,q-L)));if(j+=F+(n.chance(.5)?n.range(4.5,6):n.range(1.2,3.2)),Math.abs(o)+L/2>me||m+F/2>94&&m-F/2<126&&o+L/2>-9&&o-L/2<41||e.some(i=>Math.hypot(m-i[0],o-i[1])<i[2])||f.keepOut&&f.keepOut(m,o,F/2,L/2))continue;let W=n.range(28,36.5);n.chance(.08)&&(W=n.range(19,25));const a=ue(m,o,ie)<14+Math.max(F,L)/2;a&&(W=Math.min(W,n.range(33,35.5))),$.push({x:m,z:o,w:F,d:L,h:W,yaw:n.range(-.035,.035)*(d===0?.25:1),seed:n(),variant:n.int(0,2),row:d,tint:n(),white:n.chance(.6)?1:n.chance(.6)?.35:2,warm:n(),cloth:n(),nearRun:a})}u+=q+k,await r.yield?.()}}const b=f.maxTowers??500,N=n.shuffle($.filter(x=>x.row>0&&!x.nearRun));for(let x=0;$.length-x>b&&x<N.length;x++)N[x].drop=!0;for(let x=$.length-1;x>=0;x--)$[x].drop&&$.splice(x,1);{const x=f.landmarks??7,u=k=>k-Math.floor(k),d=[],q=$.filter(k=>k.row>0&&!k.nearRun&&Math.abs(k.x)<fe-24&&Math.abs(k.z)<me-24&&ue(k.x,k.z,J)>58&&ue(k.x,k.z,ne)>34).sort((k,j)=>u(k.seed*977.3)-u(j.seed*977.3));for(const k of q){if(d.length>=x)break;d.some(j=>Math.hypot(j.x-k.x,j.z-k.z)<80)||(k.h=55+11*u(k.seed*313.7),k.white=d.length%2===0?30:9,k.landmark=!0,d.push(k))}}{const x=u=>u-Math.floor(u);for(const u of $)u.row===0||u.nearRun||u.landmark||(u.x>64&&u.z>104+.25*(u.x-64)?u.h=18+5*x(u.seed*517.3):Math.hypot(u.x-110,u.z-5)<78&&ue(u.x,u.z,J)>40&&(u.h=Math.min(41,u.h*1.14)))}A&&!(f.keepOut&&f.keepOut(3,G,6.5,4.5))&&$.push({x:3,z:G,w:13,d:9,h:8.6,yaw:0,seed:n(),variant:0,tint:.7,white:.35,warm:.3,cloth:n(),low:!0});for(const x of f.extraTowers||[])$.push({yaw:0,seed:.5,variant:0,row:1,tint:.5,white:1,warm:.5,cloth:.5,...x,extra:!0})}await r.yield?.();const he={value:h.clone().multiplyScalar(f.bounce??.24)},ye={value:0};s.uHbBounce.value.copy(he.value).multiplyScalar(.6);const se=at(s,I,he,ye),ce=[],De=[];for(let e=0;e<3;e++){const y=$.filter(d=>d.variant===e);if(!y.length)continue;const A=$e(e),b=new Float32Array(y.length*4),N=new Float32Array(y.length*4),x=new Float32Array(y.length*4);y.forEach((d,q)=>{b.set([d.x,d.z,Math.cos(d.yaw),Math.sin(d.yaw)],q*4),N.set([d.w,d.h,d.d,d.seed],q*4),x.set([d.tint,d.white,d.warm,d.cloth],q*4),d.low||(ce.push(d.x,d.z,1,0),De.push(d.w,d.h,d.d,d.seed))}),A.setAttribute("iA",new t.InstancedBufferAttribute(b,4)),A.setAttribute("iB",new t.InstancedBufferAttribute(N,4)),A.setAttribute("iC",new t.InstancedBufferAttribute(x,4)),A.instanceCount=y.length,A.boundingSphere=new t.Sphere(new t.Vector3(0,20,0),420);const u=new t.Mesh(A,se);u.frustumCulled=!1,u.name="towers-"+e,O.add(u)}let pe=null;if(ce.length){const e=Ye();e.setAttribute("iA",new t.InstancedBufferAttribute(new Float32Array(ce),4)),e.setAttribute("iB",new t.InstancedBufferAttribute(new Float32Array(De),4)),e.instanceCount=ce.length/4;const y=Me(s,{...Z,uSandLit:{value:p.clone().lerp(B,.35).multiplyScalar(1.5)}},lt,ct,{transparent:!0,depthWrite:!1,side:t.DoubleSide});pe=new t.Mesh(e,y),pe.frustumCulled=!1,pe.renderOrder=2,pe.name="parapet-sand",O.add(pe)}await r.yield?.();const Ae=Math.max(0,Math.round(f.kites??40)),ee=[];if(Ae>0){const e=$.filter(m=>!m.low&&!m.extra&&m.h>26),y=e.length?e:[{x:0,z:0,w:14,d:14,h:0}],A=n(),b=[[.78,.035,.03],[.95,.47,.03],[.86,.83,.74],[.06,.08,.5]],N=A<.1?[b[2]]:A<.2?[b[1]]:b,x=y.filter(m=>{const o=ue(m.x,m.z,ie);return o>20&&o<60});let u=0;for(;ee.length<Ae&&u++<4e3;){const m=ee.length<Math.min(14,Ae*.35)&&x.length>0,o=n.pick(m?x:y);if(ee.some(H=>H.host===o))continue;const W=[n.range(-7,7),n.range(20,42),n.range(4,18)],a=o.x+n.range(-.25,.25)*o.w,i=o.z+n.range(-.25,.25)*o.d,v=o.h>0?o.h-.4:0;ue(a+W[0],i+W[2],J)<12||ue(a,i,ie)<12||ee.push({host:o,anchor:[a,v,i],off:W,size:n.range(2.5,3.6),phase:n.range(0,6.283),col:n.pick(N),jit:n.range(-28,28)})}(f.kitesAt||[]).forEach((m,o)=>{let W=null,a=22;for(const i of $){if(i.low||i.h<18||ee.some(C=>C.host===i))continue;const v=i.h-.4,H=Math.max(-12,Math.min(12,m.x-i.x)),w=Math.max(16,Math.min(44,m.y-v)),M=Math.max(3,Math.min(20,m.z-i.z)),K=Math.hypot(i.x+H-m.x,v+w-m.y,i.z+M-m.z)+.1*Math.hypot(H,w-28,M-10);K<a&&(a=K,W={host:i,anchor:[i.x,v,i.z],off:[H,w/.8,M/1.3]})}W&&ee.push({...W,size:m.size??4,phase:m.phase??o*2.1,col:N[(m.col??o)%N.length],jit:-900})});const d=Xe(),q=new Float32Array(ee.length*4),k=new Float32Array(ee.length*4),j=new Float32Array(ee.length*4);ee.forEach((m,o)=>{q.set([m.anchor[0],m.anchor[1],m.anchor[2],m.phase],o*4),k.set([m.off[0],m.off[1],m.off[2],m.size],o*4),j.set([m.col[0],m.col[1],m.col[2],m.jit],o*4)}),d.setAttribute("iK0",new t.InstancedBufferAttribute(q,4)),d.setAttribute("iK1",new t.InstancedBufferAttribute(k,4)),d.setAttribute("iK2",new t.InstancedBufferAttribute(j,4)),d.instanceCount=ee.length;const F=Me(s,{...Z,uPxAng:{value:.0012}},ht,ft,{transparent:!0,depthWrite:!1,side:t.DoubleSide}),L=new t.Mesh(d,F);L.frustumCulled=!1,L.renderOrder=3,L.name="kites",O.add(L),O.userData.kiteMat=F}await r.yield?.();const ve=Math.round(180*(ae<1?.8:1)),He=52;let ze=null;const _e={value:0};{const e=new Float32Array((ve+1)*(He+1)*3),y=[];for(let a=0,i=0;a<=He;a++)for(let v=0;v<=ve;v++)e[i++]=v/ve*2-1,e[i++]=a/He,e[i++]=0;for(let a=0;a<He;a++)for(let i=0;i<ve;i++){const v=a*(ve+1)+i,H=v+1,w=v+ve+1,M=w+1;y.push(v,H,w,H,M,w)}const A=new t.BufferGeometry;A.setAttribute("position",new t.BufferAttribute(e,3)),A.setIndex(y),A.boundingSphere=new t.Sphere(new t.Vector3(0,400,-800),4e3);const b={uWallSeed:{value:n.range(0,40)},uWTan:{value:g.tan?be(g.tan):p.clone()},uWOchre:{value:g.ochre?be(g.ochre):Y.clone()},uWLit:{value:0},uWGild:{value:f.gild??.85},uWGildLow:{value:f.gildLow??0},uWDark:{value:g.dark?be(g.dark):S.clone().lerp(_,.3)},uWMid:{value:g.mid?be(g.mid):_.clone().multiplyScalar(.85)},uNearK:_e};ze=Me(s,{...Z,...b,uGlow:{value:new t.Vector3(0,250,0)}},nt,st,{side:t.DoubleSide});const N=new t.Mesh(A,ze);N.frustumCulled=!1,N.name="dust-wall",O.add(N),await r.yield?.();const x=Math.round(140*(ae<1?.75:1)),u=22,d=36,q=x+u+d,k=Math.round(x*.57),j=a=>{const i=Math.sin(a*91.7+b.uWallSeed.value*3.1)*43758.5453;return i-Math.floor(i)},F=new t.InstancedBufferGeometry;F.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),F.setIndex([0,1,2,0,2,3]);const L=new Float32Array(q*4),m=new Float32Array(q*2);for(let a=0;a<q;a++){const i=a<k,v=j(a+.13),H=j(a+5.71),w=j(a+9.37),M=j(a+13.9);if(a>=x){const C=a>=x+u,V=a>=x+u+36,Q=V?(a-x-u-36+v)/(d-36):C?(a-x-u+v)/36:(a-x+v)/u;L[a*4]=V?-.5+.4*Q:C?-.56+.48*Q:-.63+.24*Q,L[a*4+1]=V?.2+.36*w:C?.03+.39*w:.02+.44*w,L[a*4+2]=C?6+30*M:10*M,L[a*4+3]=V?55+55*H:C?40+50*H:60+50*H,m[a*2]=j(a+21.3),m[a*2+1]=C?2+.85+.15*M:.8+.15*M;continue}const K=i?38+46*H*H:90+70*H;L[a*4]=i?-.78+1.42*((a+v)/k):-.88+.74*((a-k+v)/Math.max(1,x-k)),L[a*4+1]=i?.015+.2*w*w:.2+.44*w,L[a*4+2]=i?22*M:-8+16*M,L[a*4+3]=K,m[a*2]=j(a+21.3),m[a*2+1]=i?.62+.3*M:.7+.2*M}F.setAttribute("iP",new t.InstancedBufferAttribute(L,4)),F.setAttribute("iQ",new t.InstancedBufferAttribute(m,2)),F.instanceCount=q,F.boundingSphere=new t.Sphere(new t.Vector3(0,200,-800),4e3);const o=Me(s,{...Z,...b},it,rt,{transparent:!0,depthWrite:!1}),W=new t.Mesh(F,o);W.frustumCulled=!1,W.renderOrder=1,W.name="dust-puffs",O.add(W)}await r.yield?.();const Ue=(e,y="ext",A=null)=>Le(e,s,y+":"+(e.type||"m"),A);if(f.ground!==!1){const e=new t.PlaneGeometry(5200,5200,1,1);e.rotateX(-Math.PI/2);const y=new t.MeshStandardMaterial({color:16777215,roughness:1,metalness:0});Le(y,{...s,uGPale:{value:B.clone().lerp(p,.5).multiplyScalar(.72)},uGTown:{value:p.clone().lerp(B,.22).multiplyScalar(.8)},uGSand:{value:p.clone().lerp(B,.3)}},"ground",{fragPars:`uniform vec3 uGPale, uGTown, uGSand;
`,frag:b=>b.replace("#include <color_fragment>",`#include <color_fragment>
        { vec3 hp = (uHbInv * vec4(vHbW, 1.0)).xyz;
          float town = (1.0 - smoothstep(${fe}.0, ${fe+22}.0, abs(hp.x))) * (1.0 - smoothstep(${me}.0, ${me+22}.0, abs(hp.z)));
          vec3 c = mix(uGPale, uGTown, town) * (0.78 + 0.3 * hbN2(hp.xz * 0.045)) * (0.9 + 0.2 * hbN2(hp.xz * 0.8));
          c *= 0.9 + 0.1 * hbN2(hp.xz * vec2(0.012, 0.11) + 9.0);
          float fl = hbN2(vec2(hp.x * 0.45, (hp.z - uHbTime * 17.0) * 0.055)) * hbN2(vec2(hp.x * 0.13 + 4.0, (hp.z - uHbTime * 11.0) * 0.02));
          float run = smoothstep(-40.0, 60.0, uHbTearZ - hp.z) * 0.5 + hbShadow(hp) * 0.5;
          c = mix(c, uGSand, clamp(fl * fl * 3.2 * run, 0.0, 0.85));       // sand snaking along the ground and down the lanes
          diffuseColor.rgb = c; }`)});const A=new t.Mesh(e,y);A.name="haboob-ground",A.frustumCulled=!1,O.add(A)}let xe=f.progress??.8,Te=null;const Ne=()=>{const e=Te||{front:z(xe),shadow:z(xe)-Oe,tear:D(xe),gust:E(xe)};s.uHbFrontZ.value=-e.front,s.uHbShadowZ.value=-(e.shadow??e.front-Oe),s.uHbTearZ.value=-(e.tear??e.front-450),s.uHbGust.value=e.gust??1};Ne();const Fe=async(e,y=[],A={})=>{const b=Se,N=Pe,x=new Float32Array(b*N),u=new Float32Array(b*N),d=new Float32Array(b*N),q=(o,W,a,i,v)=>{const H=Math.max(0,Math.ceil(o-a-te-.5)),w=Math.min(b-1,Math.floor(o+a-te-.5)),M=Math.max(0,Math.ceil(W-i-oe-.5)),K=Math.min(N-1,Math.floor(W+i-oe-.5));for(let C=M;C<=K;C++)for(let V=H;V<=w;V++){const Q=C*b+V;x[Q]<v&&(x[Q]=v)}};await r.yield?.();for(const o of $)q(o.x,o.z,Math.max(1,o.w/2-1.6),Math.max(1,o.d/2-1.6),o.h-.6);let k=0;for(const o of y){if((++k&1023)===0&&await r.yield?.(),o.thin)continue;if(o.r===void 0){q(o.x,o.z,o.hx,o.hz,o.h);continue}const W=Math.max(0,Math.floor(o.x-o.r-te)),a=Math.min(b-1,Math.ceil(o.x+o.r-te)),i=Math.max(0,Math.floor(o.z-o.r-oe)),v=Math.min(N-1,Math.ceil(o.z+o.r-oe));for(let H=i;H<=v;H++)for(let w=W;w<=a;w++){const M=w+.5+te-o.x,K=H+.5+oe-o.z,C=H*b+w;M*M+K*K<=o.r*o.r&&x[C]<o.h&&(x[C]=o.h)}}const j=Math.hypot(e.x,e.z)||1e-6,F=e.x/j,L=e.z/j,m=Math.max(e.y,.02)/j;if(u.set(x),await r.yield?.(),Math.abs(L)>=Math.abs(F)){const o=L>=0?1:-1,W=F/Math.abs(L),a=Math.hypot(1,W)*m;for(let i=0;i<N-1;i++){const v=o>0?N-2-i:i+1,H=(v+o)*b,w=v*b;for(let M=0;M<b;M++){const K=M+W,C=Math.floor(K),V=K-C,Q=C>=0&&C<b?u[H+C]:0,X=C+1>=0&&C+1<b?u[H+C+1]:0,le=Q+(X-Q)*V-a;le>0&&(d[w+M]=le,le>u[w+M]&&(u[w+M]=le))}(i&63)===63&&await r.yield?.()}}else{const o=F>=0?1:-1,W=L/Math.abs(F),a=Math.hypot(1,W)*m;for(let i=0;i<b-1;i++){const v=o>0?b-2-i:i+1,H=v+o;for(let w=0;w<N;w++){const M=w+W,K=Math.floor(M),C=M-K,V=K>=0&&K<N?u[K*b+H]:0,Q=K+1>=0&&K+1<N?u[(K+1)*b+H]:0,X=V+(Q-V)*C-a;X>0&&(d[w*b+v]=X,X>u[w*b+v]&&(u[w*b+v]=X))}(i&63)===63&&await r.yield?.()}}await r.yield?.();{const o=(a,i,v,H)=>{const w=Math.max(0,Math.floor(a-v-te)),M=Math.min(b-1,Math.ceil(a+v-te)),K=Math.max(0,Math.floor(i-v-oe)),C=Math.min(N-1,Math.ceil(i+v-oe));for(let V=K;V<=C;V++)for(let Q=w;Q<=M;Q++){const X=Q+.5+te-a,le=V+.5+oe-i,ge=V*b+Q;X*X+le*le<=v*v&&d[ge]<H&&(d[ge]=H)}};let W=0;for(const a of y){if(!a.thin)continue;(++W&255)===0&&await r.yield?.();const i=a.r??.7,v=a.h/m;if(a.post){const H=Math.max(1,Math.ceil(v/.7));for(let w=0;w<=H;w++){const M=v*w/H;o(a.x-F*M,a.z-L*M,i,Math.max(a.h-M*m,2))}}else o(a.x-F*v,a.z-L*v,i,2.4)}}if(await r.yield?.(),A.sunSlots){const o=Math.max(14*Math.abs(L),5),W=v=>{const H=Math.sin(v*127.1+3.7)*43758.5453;return H-Math.floor(H)},a=Math.max(0,Math.floor(22-te)),i=Math.min(b-1,Math.ceil(207-te));for(let v=a;v<=i;v++){const H=v+.5+te,w=re(H),M=Math.max(0,Math.floor(w-5.9-oe)),K=Math.min(N-1,Math.ceil(w+5.9-oe));for(let C=M;C<=K;C++){const V=C+.5+oe,Q=(H*L-V*F)/o,X=Math.floor(Q),le=(Q-X-.5)*o+(W(X)-.5)*.3*o,ge=Math.abs(le)-(1+.9*W(X+.37));ge<1.2&&(d[C*b+v]*=Math.max(0,ge)/1.2)}}}for(let o=0;o<b*N;o++)P[o]=Math.min(255,Math.round(d[o]*(255/48)));l.needsUpdate=!0};f.bake!==!1&&await Fe(c);const ke=e=>new t.Vector3(e[0],e[1],e[2]),Ie={portalSeat:{position:new t.Vector3(-440,9,110),facing:new t.Vector3(1,0,0),radius:7},flyThrough:J.map(ke),lane:ne.map(ke),laneHalfWidth:4.5,gate:new t.Vector3(fe,0,0),square:{position:new t.Vector3(110,0,G*.5+0),size:26,mosquePlot:new t.Vector3(110,0,29)},lowHouse:new t.Vector3(3,8.6,G),revealLook:new t.Vector3(-120,60,-260),viewpoints:[{name:"reveal",position:new t.Vector3(-58,44,G+2),target:new t.Vector3(-130,70,-300)},{name:"threeBands",position:new t.Vector3(-40,46,330),target:new t.Vector3(-20,110,-300)},{name:"rimOverview",position:new t.Vector3(800,309,40),target:new t.Vector3(0,20,0)}],towers:$.map(e=>({x:e.x,z:e.z,w:e.w,d:e.d,h:e.h,yaw:e.yaw,low:!!e.low,extra:!!e.extra})),kites:ee.map(e=>({anchor:ke(e.anchor),kite:new t.Vector3(e.anchor[0]+e.off[0],e.anchor[1]+e.off[1],e.anchor[2]+e.off[2])})),stormAxis:new t.Vector3(0,0,1),windDir:new t.Vector3(0,0,1)},je=(r.core?.makeRng?r.core.makeRng(Math.floor(n()*1e9)):n)()*100,We=e=>{const y=Math.sin(e*127.1+je)*43758.5453;return y-Math.floor(y)},Re=new t.Vector2,qe=new t.Matrix4,Ve=new t.Vector3(0,50,-60);return{object:O,radius:190,height:110,center:Ve,anchors:Ie,ground:f.ground===!1,groundY:0,extent:{townHalfX:fe,townHalfZ:me,wallWidth:3500,wallHeight:800,towerCount:$.length},uniforms:s,glsl:de,patchMaterial:Ue,setProgress(e){xe=e,Te=null,Ne()},setStorm(e){Te=e,Ne()},setSun(e,y,A=1){e&&c.copy(e).normalize(),y&&Z.uSunCol.value.set(y).multiplyScalar(A)},setWallLit(e){ze.uniforms.uWLit.value=e},setNearBillows(e){_e.value=e},setArrival(e){s.uHbNear.value=e},setRent(e,y,A,b,N){s.uHbRents.value[e].set(y,A,b,N),s.uHbRentDir.value.set(c.x,c.z).multiplyScalar(1/Math.max(c.y,.12))},setLamps(e){ye.value=e},setBounce(e,y=1,A=.6){he.value.set(e).multiplyScalar(y),s.uHbBounce.value.copy(he.value).multiplyScalar(A)},setSpot(e,y,A,b){s.uHbSpot.value.set(e,y,A,b)},bakeShadows:Fe,sunUniforms:Z,storm:()=>({front:-s.uHbFrontZ.value,shadow:-s.uHbShadowZ.value,tear:-s.uHbTearZ.value,gust:s.uHbGust.value}),update(e,y,A){if(s.uHbTime.value=y,O.updateWorldMatrix(!0,!1),s.uHbInv.value.copy(qe.copy(O.matrixWorld).invert()),A&&O.userData.kiteMat){let u=1080;r.renderer?.getDrawingBufferSize&&(u=r.renderer.getDrawingBufferSize(Re).y||1080),O.userData.kiteMat.uniforms.uPxAng.value=2/(Math.max(A.projectionMatrix.elements[5],.1)*u)}const b=Math.floor(y/5),N=y-b*5-We(b)*2.2,x=N<0?0:N<.6?Be(0,.6,N):Math.exp(-(N-.6)/.65);ze.uniforms.uGlow.value.set((We(b+.37)-.5)*1300,110+We(b+.71)*330,x*.8)},dispose(){l.dispose()}}}export{vt as buildHero};
