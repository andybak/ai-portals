import*as i from"three";import{makePath as ae,clamp as R0,smoothstep as C0}from"../kit/core.js";import{buildHero as ne}from"../parts/night-shining.js";const G=Math.PI/180,z0=Math.PI*2,W=(a=0,r=0,o=0)=>new i.Vector3(a,r,o),R=a=>({value:a}),u0=(a,r=1)=>{const o=new i.Color(a);return new i.Vector3(o.r*r,o.g*r,o.b*r)},q0=a=>{const r=Math.sin(a*127.1+311.7)*43758.5453;return r-Math.floor(r)},h0=46,J0=460,tt=[0,278.5,0],F0=[0,130.3,59.7],vt=Math.hypot(tt[1]-F0[1],tt[2]-F0[2]),L0=[0,(tt[1]-F0[1])/vt,(tt[2]-F0[2])/vt],Bt=Math.asin(L0[1])/G,ft=1-vt/J0,ie=30.8/h0,se=25/J0,dt=ft*h0,Tt=5*G,et=8,mt=3,re=55,Et=106,Wt=[[0,5,.5],[1.6,5,.5],[3.7,7.4,1.5],[5.1,7.4,1.5],[7.7,11,2],[8,11,2],[11,16,12],[14,24,30],[19,48,58],[24,62,86],[28,62,113],[dt,F0[2],F0[1]]],le=[[0,-62],[1.6,-62],[3.7,-58],[5.4,-58],[6.2,-57.85],[6.42,-57.5],[6.53,-56.93],[6.65,-54.9],[6.75,-52.4],[6.9,-48.43],[7.05,-44.45],[7.2,-40.5],[7.3,-38.35],[7.45,-36.4],[7.7,-33.8],[8,-30.8],[8.4,-26.2],[9.3,-20.4],[10.6,-13.4],[11,-10],[11.5,1.2],[12,12],[12.4,14.4],[14,20],[19,22],[24,34],[28,52],[dt,Bt]],ce=[[0,Et],[1.6,Et],[3.7,90],[5.1,90],[5.4,87.2],[5.7,82],[6,76.3],[6.3,70.7],[6.55,67],[7.3,64],[7.55,61.2],[8,re],[8.35,48.9],[8.7,41.3],[9.05,33.7],[9.5,27],[11,25],[13.5,25],[15.5,21],[17.3,0],[dt,0]];function ot(a,r,o){const t=a.length,m=[],M=new Array(t);for(let f=0;f<t-1;f++)m.push((a[f+1][r]-a[f][r])/(a[f+1][0]-a[f][0]));M[0]=m[0],M[t-1]=o;for(let f=1;f<t-1;f++)M[f]=m[f-1]*m[f]<=0?0:2*m[f-1]*m[f]/(m[f-1]+m[f]);return f=>{let c=0;for(;c<t-2&&f>a[c+1][0];)c++;const A=a[c],E=a[c+1],S=E[0]-A[0],b=R0((f-A[0])/S,0,1),z=b*b,q=z*b;return(2*q-3*z+1)*A[r]+(q-2*z+b)*S*M[c]+(-2*q+3*z)*E[r]+(q-z)*S*M[c+1]}}const ue=ot(Wt,1,L0[2]*10),he=ot(Wt,2,L0[1]*10),ve=ot(le,1,0),fe=ot(ce,1,0),de=new i.Matrix4,It=W(),me=W(),pt=W(0,1,0),pe=new i.Quaternion,Rt=0,qt=a=>Rt+Tt*(h0*R0(a,0,1)-et);function ge(a){const r=a*h0;if(r>=et+mt)return 0;if(r<=et)return qt(a);const o=(r-et)/mt,t=o*o,m=t*o;return Rt*(1-3*t+2*m)+Tt*mt*(m-2*t+o)}function U0(a,r){a=R0(a,0,1);let o,t,m,M;if(a>=ft){const A=(a-ft)*J0;o=F0[2]+L0[2]*A,t=F0[1]+L0[1]*A,m=Bt,M=0}else{const A=a*h0;o=ue(A),t=he(A),m=ve(A),M=fe(A)}const f=Math.cos(m*G);It.set(Math.sin(M*G)*f,Math.sin(m*G),-Math.cos(M*G)*f),r.pos.set(0,t,o),r.quat.setFromRotationMatrix(de.lookAt(me,It,pt));const c=ge(a);return c!==0&&(r.pos.applyAxisAngle(pt,c),r.quat.premultiply(pe.setFromAxisAngle(pt,c))),r}const Lt=.02/h0,Dt=58*G,be=145*G,xe=5,we=.5,ye=1.5,Me=2,Ae={pos:W(),quat:new i.Quaternion},Ce={pos:W(),quat:new i.Quaternion};function Se(a,r,o,t){const m=a.last;if(!(o>0)&&m>=0&&r===m)return a.f;if(a.last=r,t>0||(t=1),!(o>0)||m<0||r<=a.f||r-m>ye*o*t/h0+1e-9)return a.f=r,r;const M=a.f+Me*o*t/h0,f=M<r?M:r;let c=a.f,A=o*(Dt+(be-Dt)*R0((t-xe)/we,0,1)),E=Ae,S=Ce;for(U0(c,E);c<f;){const b=f-c<=Lt?f:c+Lt,z=U0(b,S).quat.angleTo(E.quat);if(z>A){let j=c+(b-c)*(A/z);const V=U0(j,S).quat.angleTo(E.quat);V>A&&(j=c+(j-c)*(A/V)),c=j;break}A-=z,c=b;const q=E;E=S,S=q}return a.f=c,c}const gt=`
  uniform vec3 uEye, uMoon, uMoonCol, uTwiCol, uSheetCol, uIceCol, uShadow, uStrobePos, uStrobeCol, uFlashCol, uFlashDir;
  uniform float uTime, uStrobe, uFlash, uPix, uWash;
  float h31(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
  vec3 h33(vec3 p){ return vec3(h31(p), h31(p + 17.3), h31(p + 41.7)); }
  // how much of the arc a face takes: all of it turned north, a seventh side on, none turned south
  float arcW(vec3 n){ float k = clamp(.38 - n.z * .62, 0., 1.); return k * k * (1. - .35 * abs(n.y)); }
  // what a mirror facing r would show: the sheet overhead, the arc broad and low in the north, moonlit ice below, the moon
  vec3 envB(vec3 r, float arc){
    vec3 c = uShadow * .7 + uSheetCol * smoothstep(-.1, .75, r.y) * .8 + uIceCol * (1. - smoothstep(-.55, .02, r.y)) * .5;
    float north = smoothstep(-.15, .9, -r.z);
    c += uTwiCol * north * north * exp(-abs(r.y + .03) * 4.2) * 3. * arc;
    float m = max(dot(r, uMoon), 0.);
    return c + uMoonCol * (pow(m, 260.) * 5. + pow(m, 14.) * .3);
  }
  // matte surfaces: key, arc, fill, bounce, and an indigo floor so no shadow is grey or black
  vec3 lightB(vec3 n, vec3 alb, vec3 p){
    float kd = max(dot(n, uMoon), 0.);
    vec3 c = alb * (uMoonCol * kd + uTwiCol * arcW(n) * .5 + uSheetCol * (.5 + .5 * n.y) * .55 + uIceCol * (.5 - .5 * n.y) * .22);
    c += uShadow * (.5 + alb) * .55;
    vec3 L = uStrobePos - p; float d2 = dot(L, L);
    c += alb * uStrobeCol * uStrobe * max(dot(n, L / sqrt(max(d2, 1e-4))), 0.) / (1. + d2 * .5);
    return c + alb * uFlashCol * uFlash * (.35 + .65 * max(dot(n, uFlashDir), 0.));
  }
  // PALE THINGS (silk, cords, a sister's film) keep their own colours on the deep twilight look, whose arc is a thin
  // red line: uWash is how much of the arc's broad light they take (all of it on the other looks, a tenth on that
  // one); the ember is then only a rim on what faces north
  vec3 lightP(vec3 n, vec3 alb, vec3 p){ return lightB(n, alb, p) - alb * uTwiCol * arcW(n) * .5 * (1. - uWash); }
  // the arc along an edge: whatever is seen against the north glows along its rim
  vec3 rimB(vec3 n, float nv){ return uTwiCol * pow(1. - nv, 2.5) * smoothstep(-.6, .5, -n.z); }
`,V0=-1.5,K0=-1.25,D0=[3.9,V0,K0],Gt=-4.1*G,ke=0,k0=new i.Matrix4().makeRotationY(Gt).multiply(new i.Matrix4().makeRotationX(ke)).setPosition(D0[0],D0[1],D0[2]),Nt=[k0.elements[8],k0.elements[9],k0.elements[10]],Ot=[k0.elements[0],k0.elements[1],k0.elements[2]],Ut=(a,r,o)=>{const t=k0.elements;return[t[0]*a+t[4]*r+t[8]*o+t[12],t[1]*a+t[5]*r+t[9]*o+t[13],t[2]*a+t[6]*r+t[10]*o+t[14]]},G0=8.26,T0=[.5,.6,.78],H0=-1.1,Vt=k0.clone().multiply(new i.Matrix4().makeTranslation(0,H0,0)),E0=(a,r,o)=>Ut(a,r+H0,o),N0=E0(.7,-.4,G0+.25),Pe=2.65,at=new i.Matrix4().makeRotationY(36*G).multiply(new i.Matrix4().makeRotationX(12*G)).setPosition(N0[0],N0[1],N0[2]),ze=[at.elements[8],at.elements[9],at.elements[10]],Kt=a=>`vec3(${a.map(r=>r.toFixed(5)).join(", ")})`,Fe=`
  attribute vec3 aCol; attribute float aMat; attribute vec3 aWing;
  uniform mat4 uRigInv; uniform float uFeather, uTrack;
  varying vec3 vP, vN, vC, vO; varying float vMat;
  const vec3 WD = ${Kt(ze)}, WP = ${Kt(N0)};
  void main(){
    vec3 p = position, n = normal;
    if (abs(aWing.x) > 2.5) {     // 3: the rail's solar wing, feathering about its own long axis (the line along WD through WP)
      float c = cos(uFeather), s = sin(uFeather); vec3 q = p - WP;
      p = WP + q * c + cross(WD, q) * s + WD * dot(WD, q) * (1. - c); n = n * c + cross(WD, n) * s + WD * dot(WD, n) * (1. - c);
    } else
    if (abs(aWing.x) > .5) {      // 1: a solar wing feathering about its long axis (the X axis through y, z = aWing.yz); 2: the telescope's nod
      float a = abs(aWing.x) > 1.5 ? uTrack : uFeather * aWing.x, c = cos(a), s = sin(a); vec2 q = p.yz - aWing.yz;
      p.yz = aWing.yz + vec2(c * q.x - s * q.y, s * q.x + c * q.y); n.yz = vec2(c * n.y - s * n.z, s * n.y + c * n.z);
    }
    vec4 w = modelMatrix * vec4(p, 1.);
    vP = (uRigInv * w).xyz; vN = mat3(uRigInv) * (mat3(modelMatrix) * n); vC = aCol; vMat = aMat; vO = position;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`,_e=gt+`
  varying vec3 vP, vN, vC, vO; varying float vMat;
  void main(){
    vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
    vec3 v = normalize(uEye - vP); float nv = clamp(dot(n, v), 0., 1.);
    vec3 col; float rim = .35;
    if (vMat > .5 && vMat < 1.5) {
      // CRINKLED FOIL: the blanket's slow billows, facets a hand wide and facets a finger wide, each size on a skewed
      // grid of its own (so no facet is a square), every facet with its own tilt and a dark crease at its border. A
      // ripple runs through them, and now and then a fine facet turns its mirror to the moon, the arc or the sheet:
      // the running glitter. A size of facet is left out where it would be finer than two or three pixels.
      vec3 o = vO; float px = uPix * length(uEye - vP);
      float wa = clamp(.047 / px, 0., 1.), wb = clamp(.019 / px, 0., 1.);
      vec3 qa = vec3(dot(o, vec3(.82, .41, .39)), dot(o, vec3(-.36, .86, -.36)), dot(o, vec3(-.45, .11, .89))) * 8.5 + .5 * sin(o.yzx * 6.1 + 1.7);
      vec3 qb = vec3(dot(o, vec3(.59, -.64, .49)), dot(o, vec3(.72, .69, .04)), dot(o, vec3(-.36, .33, .87))) * 21. + .45 * sin(o.zxy * 17. + 4.);
      vec3 ia = floor(qa), ib = floor(qb), fa = abs(fract(qa) - .5), fb = abs(fract(qb) - .5);
      float ph = dot(o, vec3(2.1, 1.3, 1.7)) - uTime * 1.3;
      vec3 t = (h33(ia) - .5) * .8 * wa + (h33(ib) - .5) * .5 * wb + .16 * sin(o.zxy * 2.3 + vec3(0., 2.1, 4.2)) + .1 * vec3(sin(ph), sin(ph * 1.31 + 2.), sin(ph * .77 + 4.));
      float ck = smoothstep(.42, .5, max(max(fa.x, fa.y), fa.z)) * .5 * wa + smoothstep(.4, .5, max(max(fb.x, fb.y), fb.z)) * .25 * wb;
      vec3 nf = normalize(n + t - n * dot(t, n) * .6);
      vec3 r = reflect(-v, nf);
      vec3 e = envB(r, 1.);      // (the sky's blue is mostly lost in gold: what the foil gives back is the light, in its own colour)
      col = mix(e, vec3(dot(e, vec3(.3, .5, .2))), .6) * vC * 1.75 * (1. - .55 * ck) + lightB(nf, vC * .5, vP) * (1. - .3 * ck);
      float gl = pow(max(sin(uTime * (1.2 + 2.6 * h31(ib + 7.)) + 37. * h31(ib)), 0.), 24.) * step(.8, h31(ib + 3.)) * wb;
      col += vC * (uMoonCol * .9 + uTwiCol * 1.6 * arcW(n) + uSheetCol * .4) * gl * 1.3;
      col += vC * vC * uStrobe * pow(max(dot(r, normalize(uStrobePos - vP)), 0.), 24.) * .9;      // the strobe's glint, in the foil's own gold
      rim = .5;
    } else if (vMat > 2.5 && vMat < 3.5) {
      // SOLAR CELLS (vC: metres along the panel, metres across, the panel's length): cells of deep blue glass, each a
      // shade and a hair's tilt of its own, silver lines between them, the sheet's blue sheen, a bright edge all round
      vec2 pc = vC.xy, cq = vec2(pc.x / .25, (pc.y + .66) / .165), g = abs(fract(cq) - .5);
      float line = smoothstep(.43, .47, max(g.x, g.y)), id = h31(vec3(floor(cq), 3.));
      float edge = 1. - smoothstep(.0, .035, min(min(pc.x, vC.z - pc.x), .655 - abs(pc.y)));
      vec3 alb = mix(mix(vec3(.01, .028, .12), vec3(.03, .03, .19), id), vec3(.55, .6, .7), line);
      vec3 nc = normalize(n + (h33(vec3(floor(cq), 7.)) - .5) * .05), r = reflect(-v, nc);
      float fr = pow(1. - nv, 3.);
      // (on the deep twilight look the glass mirrors the sheet and the moon, not the arc: a wing is blue, never magenta)
      col = lightP(n, alb, vP) + envB(r, .6 * uWash) * vec3(.4, .62, 1.2) * (.2 + .8 * fr) * (1. - .6 * line) + uSheetCol * vec3(.25, .45, 1.) * (.1 + .25 * id) * (1. - nv);
      col = mix(col, lightP(n, vec3(.82, .86, .95), vP) + envB(reflect(-v, n), uWash) * (.3 + .7 * fr), edge);
      rim *= uWash;
    } else if (vMat > 4.5) {
      // SILK: lit as cloth, and the light on its far side comes through it (the arc's from the north, the moon's)
      col = lightP(n, vC * .7, vP) + vC * (uTwiCol * (arcW(-n) * 1.3 + .12) * uWash + uMoonCol * max(dot(-n, uMoon), 0.) * .3 + uSheetCol * .3 * (1. - uWash));
      rim = .35 * uWash;
      col += uTwiCol * pow(1. - nv, 2.5) * smoothstep(0., .7, -n.z) * .8 * (1. - uWash);      // (on that look: the ember only as a rim on what faces north)
    } else if (vMat > 3.5) {
      col = vC * (.2 + .7 * uStrobe);
    } else {
      float metal = vMat < .5 ? 1. : 0.;
      vec3 r = reflect(-v, n);
      // (on the deep twilight look bare metal and paint keep their own colours as the pale things do: the lattice is
      // metal, not magenta, and the arc is only a thin rim on what is turned north)
      col = lightP(n, vC, vP) + envB(r, .35 * uWash) * mix(vec3(.04), vC * .5 + .1, metal) * (.35 + .65 * pow(1. - nv, 3.));
      rim *= mix(.7 * smoothstep(.1, .7, -n.z) * pow(1. - nv, 1.5), 1., uWash);
    }
    col += rimB(n, nv) * rim;      // the arc along every edge that stands against the north
    // nothing clips to white: what is brighter than the cap is brought down whole, so it keeps its colour
    float top = max(col.r, max(col.g, col.b));
    gl_FragColor = vec4(col * (top > 1.25 ? (1.25 + (1. - exp(-(top - 1.25) * 1.4)) * .45) / top : 1.), 1.);
  }
`,Be=`
  attribute vec3 aDir, aCol; attribute vec3 aSide;      // aSide: (side -1/+1, width in metres, sway 0..1)
  uniform mat4 uRigInv; uniform float uPix, uTime;
  varying vec3 vC, vN, vP; varying float vK, vS;
  void main(){
    vec3 p = position;
    float sw = aSide.z * aSide.z;
    p += sw * vec3(sin(uTime * 2.3 + position.y * 1.7 + position.x * 3.), 0., cos(uTime * 1.9 + position.z * 2.3)) * .07;
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    vec3 t = normalize((modelViewMatrix * vec4(aDir, 0.)).xyz), e = normalize(-mv.xyz);
    vec3 s = cross(t, e); float sl = length(s); s = sl > 1e-4 ? s / sl : vec3(1., 0., 0.);
    float wMin = 1.5 * uPix * max(-mv.z, .05), w = max(aSide.y, wMin);
    mv.xyz += s * aSide.x * w * .5;
    vK = clamp(aSide.y / w, 0., 1.); vS = aSide.x; vC = aCol;
    vec4 wp = modelMatrix * vec4(p, 1.); vP = (uRigInv * wp).xyz;
    vN = mat3(uRigInv) * (mat3(modelMatrix) * aDir);      // (the cord's own direction, in balloon space)
    gl_Position = projectionMatrix * mv;
  }
`,Te=gt+`
  varying vec3 vC, vN, vP; varying float vK, vS;
  void main(){
    vec3 v = normalize(uEye - vP), t = normalize(vN);
    // a round cord: its normal sweeps from one edge to the other, facing the lens in the middle
    vec3 side = normalize(cross(t, v) + 1e-5), n = normalize(v * sqrt(max(1. - vS * vS, 0.)) + side * vS);
    vec3 col = lightP(n, vC, vP) + envB(reflect(-v, n), .2 * uWash) * .08;
    // the arc on the cord (one that runs north takes none; on the deep twilight look only the side turned north takes it)
    col += vC * uTwiCol * (.25 + .75 * smoothstep(-.9, .3, -n.z)) * sqrt(max(1. - t.z * t.z, 0.)) * 1.6 * mix(smoothstep(.25, .85, -n.z), 1., uWash);
    float a = mix(.35, 1., vK);
    gl_FragColor = vec4(col * a, a);
  }
`,Ht=`
  uniform vec3 uValve, uOut; uniform float uTime, uPix;
  vec3 streamAt(float tau, vec3 lat){
    float tr = uTime - tau;
    vec3 wav = vec3(sin(tr * 3.1) + .5 * sin(tr * 7.3 + 1.), 0., cos(tr * 2.3) + .5 * sin(tr * 5.9)) * .014;
    return uValve + lat * (.022 + .085 * tau + .02 * tau * tau) + wav * (1. + 2.5 * tau) + uOut * (1.0 * tau) - vec3(0., .25 * tau + 4.85 * tau * tau, 0.);
  }
`,Ee=Ht+`
  attribute vec4 aSeed;      // phase, angle, radius, kind
  varying vec2 vUv; varying float vA, vG;
  void main(){
    float life = aSeed.w < .68 ? 1.5 + aSeed.w : 7.;                 // most grains are followed for the first metres only
    float tau = fract(uTime / life + aSeed.x) * life, a = aSeed.y * 6.2832;
    vec3 p = streamAt(tau, vec3(cos(a), 0., sin(a)) * sqrt(aSeed.z));
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    float size = .008 + .01 * fract(aSeed.w * 7.3), s = max(size, 1.3 * uPix * max(-mv.z, .05));
    mv.xy += position.xy * s;
    vUv = position.xy;
    vG = pow(.5 + .5 * sin(uTime * (7. + 15. * fract(aSeed.w * 3.7)) + aSeed.x * 97. + tau * 5.), 10.);      // each grain tumbles and glints
    vA = min(1., size / s * 1.6) * (1. - smoothstep(life * .75, life, tau)) * smoothstep(0., .04, tau);      // (each is drawn as the brighter of grain and ground: what the widening adds is taken back by its width)
    gl_Position = projectionMatrix * mv;
  }
`,We=`
  uniform vec3 uCol, uGlint; varying vec2 vUv; varying float vA, vG;
  void main(){
    float r = length(vUv), a = (1. - smoothstep(.45, 1., r)) * vA; vec3 c = uCol + uGlint * vG * 3.4;
    gl_FragColor = vec4(c * min(1., 2. / max(c.r, max(c.g, c.b))) * a, 1.);      // (capped at 2; drawn as the brighter of grain and ground, so grains never add up)
  }
`,Ie=Ht+`
  attribute vec2 aK;      // (0..1 along, side)
  varying float vS, vA;
  void main(){
    float tau = aK.x * aK.x * 7.;
    vec4 a = modelViewMatrix * vec4(streamAt(tau, vec3(0.)), 1.), b = modelViewMatrix * vec4(streamAt(tau + .02 + .05 * tau, vec3(0.)), 1.);
    vec2 t = b.xy / max(-b.z, .05) - a.xy / max(-a.z, .05); float tl = length(t); t = tl > 1e-6 ? t / tl : vec2(0., -1.);
    float wTrue = .03 + .1 * tau, w = max(wTrue, 1.5 * uPix * max(-a.z, .05));
    a.xy += vec2(-t.y, t.x) * aK.y * w * .5;
    vS = aK.y; vA = (wTrue / w) * smoothstep(0., .05, aK.x) * (1. - smoothstep(.8, 1., aK.x)) / (1. + .12 * tau);
    gl_Position = projectionMatrix * a;
  }
`,Re=`
  uniform vec3 uCol; varying float vS, vA;
  void main(){ float e = 1. - vS * vS; gl_FragColor = vec4(uCol * e * e * vA * .5, 1.); }
`,P0=13,Yt=[26.2,29.6],qe=`
  attribute vec3 aK;      // (ribbon, 0..1 along, side)
  uniform vec3 uA[${P0}], uB[${P0}], uPar[${P0}]; uniform float uAge[${P0}], uPix;
  varying float vS, vI, vHead, vA;
  void main(){
    int i = int(aK.x + .5);
    float age = uAge[i], dur = uPar[i].x, life = uPar[i].y, z = uPar[i].z, on = step(0., age) * step(age, dur + life);
    float head = clamp(age / dur, 0., 1.), k = aK.y * head, old = max(age - k * dur, 0.);
    vec3 d0 = normalize(mix(uA[i], uB[i], k)), tv = uB[i] - uA[i], t = normalize(tv - d0 * dot(tv, d0)), n = cross(d0, t);
    // the winds bend it gently: one slow bow and a slight S, both growing with the age of each piece (nothing while it is fresh)
    float wr = 1. - exp(-old / 6.);
    vec3 d = normalize(d0 + n * (sin(k * 3.1 + aK.x * 1.9) * .012 + sin(k * 6.5 + aK.x * 5.1 - old * .1) * .005) * wr * z);
    vec4 mv = modelViewMatrix * vec4(d * 6000., 1.);
    vec3 tm = normalize((modelViewMatrix * vec4(t, 0.)).xyz), s = cross(tm, normalize(mv.xyz)); float sl = length(s); s = sl > 1e-4 ? s / sl : vec3(0., 1., 0.);
    float hk = smoothstep(.93, 1., aK.y) * step(age, dur + .15);                      // the head: a point at the stroke's end, while it runs
    // the streak's taper: a hair where the stroke began, full toward the head's end, closing softly at its very tip
    float tp = (.12 + .88 * smoothstep(0., .85, k)) * (1. - .75 * smoothstep(.9, 1., k));
    // its width, in angle: a hair when fresh, to three degrees of soft glow where the head went last
    float wa = (.0025 + .05 * (1. - exp(-old / (life * .45)))) * tp;
    float w = 6000. * max(uPix * (1.3 + 2.6 * hk), wa) * z;
    mv.xyz += s * aK.z * w * .5;
    // it fades from its old end: the piece at k lives (.6 + .4 k) of the train's life, so the end where the stroke began
    // goes first and the fade runs up the streak toward the head's end
    float a = clamp(old / (life * (.6 + .4 * k)), 0., 1.), fade = (1. - a) * (1. - a * .5);
    float tr = smoothstep(0., .3, k) * (.3 + .7 * k) * (1. - smoothstep(.96, 1., k)) * fade * 1.5 * pow(.0025 / max(wa / tp, .0025), .3);   // (what the widening adds is taken back, softly)
    vS = aK.z; vHead = hk; vA = clamp(old / life + (1. - k) * .12, 0., 1.);
    vI = on * step(1e-4, head) * z * (tr + hk * 3.);
    gl_Position = projectionMatrix * mv;
  }
`,Le=`
  uniform vec3 uHeadCol; varying float vS, vI, vHead, vA;
  void main(){
    float e = max(exp(-vS * vS * 3.4) - .034, 0.) * (1. - vS * vS * vS * vS);      // soft across: no edge
    vec3 c = mix(mix(vec3(1., .86, .56), vec3(.42, 1., .6), smoothstep(.04, .3, vA)), vec3(1., .46, .62), smoothstep(.45, .9, vA));
    gl_FragColor = vec4(mix(c, uHeadCol, vHead) * e * min(vI, 2.), 1.);
  }
`,Qt=3,De=`
  attribute float aI; uniform vec4 uLamp[${Qt}]; uniform float uPix;      // xyz in balloon space, w the eased flash
  varying vec2 vUv; varying float vI;
  void main(){
    vec4 L = uLamp[int(aI + .5)]; vec4 mv = modelViewMatrix * vec4(L.xyz, 1.);
    float s = max(.17, 4. * uPix * max(-mv.z, .05)) * (.4 + .6 * L.w);
    mv.xy += position.xy * s; vUv = position.xy; vI = L.w;
    gl_Position = projectionMatrix * mv;
  }
`,Ge=`
  uniform vec3 uCol; varying vec2 vUv; varying float vI;
  void main(){ float r2 = dot(vUv, vUv); gl_FragColor = vec4(uCol * vI * (exp(-r2 * 9.) * .5 + exp(-r2 * 60.) * .8) * (1. - smoothstep(.6, 1., r2)), 1.); }      // (1.3 at most, over a lamp glass of 0.9: the glare keeps its blue)
`,Ne=`
  attribute vec4 aA, aB;      // aA: bearing (0 is south), birth height, the film's radius there and a little, phase. aB: period s, fall m/s, size m, number
  uniform vec3 uEye, uMoon, uMoonCol, uSheetCol, uTwiCol; uniform float uTime, uShed, uPix, uWash;
  varying vec2 vUv; varying vec4 vC; varying vec3 vG; varying float vPh;
  void main(){
    float ph = fract(uTime / aB.x + aA.w), age = ph * aB.x, vr = .5 + 1.7 * fract(aA.w * 7.31);
    float r = aA.z + vr * age + .5 * sin(age * .5 + aA.w * 50.), th = aA.x + .5 * sin(age * .23 + aA.w * 30.) / max(aA.z, 8.);
    vec3 c = vec3(sin(th) * r, aA.y - aB.y * age + .3 * sin(age * .9 + aA.w * 70.), cos(th) * r);
    c.x += sign(c.x + 1e-4) * 2.5 * exp(-abs(c.x) / 2.5);
    float vis = smoothstep(aB.w, aB.w + .06, uShed * 1.06) * smoothstep(0., .05, ph) * (1. - smoothstep(.85, 1., ph));
    float spin = uTime * (1.5 + 4. * aB.w) + aA.w * 90.;
    vec3 V = normalize(c - uEye), n = normalize(vec3(sin(spin), cos(spin * .73 + 1.), sin(spin * 1.31 + 2.)));
    float sm = pow(abs(dot(n, normalize(uMoon - V))), 11.), ss = pow(abs(dot(n, normalize(vec3(0., 1., 0.) - V))), 10.), sa = pow(abs(dot(n, normalize(vec3(0., .12, -.99) - V))), 10.);
    vec4 mv = modelViewMatrix * vec4(c, 1.);
    float grow = max(1., 1.5 * uPix * max(-mv.z, .05) / aB.z), ang = spin * .37;
    vec2 q = vec2(position.x * cos(ang) - position.y * sin(ang), position.x * sin(ang) + position.y * cos(ang));
    mv.xy += q * vec2(1., .35 + .65 * abs(dot(n, V))) * aB.z * grow;
    vUv = position.xy; vPh = aA.w * 40.;
    vec3 col = vec3(.7, .84, 1.) * (dot(uSheetCol, vec3(.3, .5, .2)) * 1.0 + .14) + uMoonCol * (.28 * abs(dot(n, uMoon)) + .14) + uTwiCol * .25 * abs(n.z) * uWash;
    vec3 gl = uMoonCol * 7. * sm + uSheetCol * 3. * ss + uTwiCol * 2.5 * sa;
    float al = vis / (grow * grow);      // (a far fleck, widened to its pixel and a half, fades out)
    vC = vec4(col * min(1., 1.15 / max(col.r, max(col.g, col.b))), al);
    vG = gl * min(1., 1.8 / max(gl.r, max(gl.g, max(gl.b, 1e-3)))) * al;
    gl_Position = projectionMatrix * mv;
  }
`,Oe=`
  varying vec2 vUv; varying vec4 vC; varying vec3 vG; varying float vPh;
  void main(){
    vec2 a = abs(vUv); float h = max(a.x * .866 + a.y * .5, a.y) * (1. + .1 * sin(atan(vUv.y, vUv.x) * 3. + vPh) + .06 * sin(atan(vUv.y, vUv.x) * 7. - vPh * 1.7));      // a six-sided plate, chipped: each has an outline of its own
    float al = (1. - smoothstep(.5, .64, h)) * vC.a * .88;
    float ray = exp(-a.x * a.y * 70.) * exp(-dot(vUv, vUv) * 2.6) * (1. - smoothstep(.7, 1., max(a.x, a.y)));           // the spark's four rays
    // (the plate's rim a little brighter; colour times cover, drawn over; the spark is light added, on the plate and beyond it)
    gl_FragColor = vec4(vC.rgb * (.7 + .5 * smoothstep(.2, .52, h)) * al + vG * (ray + .5 * al), al);
  }
`,Ue=`
  attribute float aMat; uniform mat4 uRigInv; varying vec3 vP, vN; varying float vMat, vY;
  void main(){ vec4 w = modelMatrix * vec4(position, 1.); vP = (uRigInv * w).xyz; vN = mat3(uRigInv) * (mat3(modelMatrix) * normal); vMat = aMat; vY = position.y; gl_Position = projectionMatrix * viewMatrix * w; }
`,Ve=gt+`
  varying vec3 vP, vN; varying float vMat, vY;
  void main(){
    vec3 no = normalize(vN), n = gl_FrontFacing ? no : -no;      // no: the film's own outward side
    vec3 v = normalize(uEye - vP); float nv = clamp(dot(n, v), 0., 1.), rim = 1. - nv;
    if (vMat > .5) {      // its gondola: a fleck of gold foil
      vec3 gold = vec3(1., .66, .22), c = lightB(n, gold * .8, vP) + envB(reflect(-v, n), 1.) * gold * .9;
      gl_FragColor = vec4(c * min(1., 1.6 / max(c.r, 1e-3)), 1.); return;
    }
    float a = .3 + .62 * pow(rim, 1.6);      // the film: thin and clear in its middle, a bright edge
    vec3 col = uShadow * .9 + uSheetCol * (.5 + .5 * no.y) * .06;
    col += uTwiCol * (arcW(no) * .55 * uWash + pow(rim, 2.) * smoothstep(-.7 + .7 * (1. - uWash), .4 + .3 * (1. - uWash), -no.z) * .5);
    col += uSheetCol * (.5 + .5 * no.y) * .12 * (1. - uWash);
    col += uMoonCol * (pow(max(dot(no, uMoon), 0.), 2.) * .1 + pow(rim, 2.6) * smoothstep(-.1, .7, dot(n, uMoon)) * .9);
    col += uSheetCol * pow(rim, 3.) * .15;
    gl_FragColor = vec4(col * a, a);
  }
`,Y0=new i.Matrix4;function bt(){const a=[],r=[],o=[],t=[],m=[],M=new i.Matrix4,f=new i.Matrix3,c=W(),A=W(),E=W(),S=W(),b=W(),z=W(),q=W();let j=[0,0,0];const V=(h,p,_,D)=>{c.set(h[0],h[1],h[2]).applyMatrix4(M),A.set(p[0],p[1],p[2]).applyMatrix3(f).normalize(),a.push(c.x,c.y,c.z),r.push(A.x,A.y,A.z),o.push(_[0],_[1],_[2]),t.push(D),m.push(j[0],j[1],j[2])},k={count:()=>a.length/9,xf(h){return M.copy(h||Y0),f.getNormalMatrix(M),k},wing(h=0,p=0,_=0){return j=[h,p,_],k},tri(h,p,_,D,v,P,B,T){return P||(E.set(p[0]-h[0],p[1]-h[1],p[2]-h[2]),S.set(_[0]-h[0],_[1]-h[1],_[2]-h[2]),E.cross(S).normalize(),P=B=T=[E.x,E.y,E.z]),V(h,P,D,v),V(p,B,D,v),V(_,T,D,v),k},quad(h,p,_,D,v,P,B,T,n,s){return k.tri(h,p,_,v,P,B,T,n),k.tri(h,_,D,v,P,B,n,s),k},quadC(h,p,_){E.set(h[1][0]-h[0][0],h[1][1]-h[0][1],h[1][2]-h[0][2]),S.set(h[2][0]-h[0][0],h[2][1]-h[0][1],h[2][2]-h[0][2]),E.cross(S).normalize();const D=[E.x,E.y,E.z];for(const v of[0,1,2,0,2,3])V(h[v],D,p[v],_);return k},box(h,p,_,D,v,P,B,T=0){const n=D/2,s=v/2,l=P/2,d=(C,t0,Z)=>[h+C*n,p+t0*s,_+Z*l];return k.quad(d(1,-1,1),d(1,-1,-1),d(1,1,-1),d(1,1,1),B,T),k.quad(d(-1,-1,-1),d(-1,-1,1),d(-1,1,1),d(-1,1,-1),B,T),k.quad(d(-1,1,1),d(1,1,1),d(1,1,-1),d(-1,1,-1),B,T),k.quad(d(-1,-1,-1),d(1,-1,-1),d(1,-1,1),d(-1,-1,1),B,T),k.quad(d(-1,-1,1),d(1,-1,1),d(1,1,1),d(-1,1,1),B,T),k.quad(d(1,-1,-1),d(-1,-1,-1),d(-1,1,-1),d(1,1,-1),B,T),k},tube(h,p,_,D,v=0,P=6,B=_){b.set(p[0]-h[0],p[1]-h[1],p[2]-h[2]);const T=b.length();if(T<1e-6)return k;b.divideScalar(T),z.set(Math.abs(b.y)<.9?0:1,Math.abs(b.y)<.9?1:0,0).cross(b).normalize(),q.crossVectors(b,z);const n=[];for(let s=0;s<=P;s++){const l=s/P*z0,d=Math.cos(l),C=Math.sin(l);n.push([z.x*d+q.x*C,z.y*d+q.y*C,z.z*d+q.z*C])}for(let s=0;s<P;s++){const l=n[s],d=n[s+1];k.quad([h[0]+l[0]*_,h[1]+l[1]*_,h[2]+l[2]*_],[h[0]+d[0]*_,h[1]+d[1]*_,h[2]+d[2]*_],[p[0]+d[0]*B,p[1]+d[1]*B,p[2]+d[2]*B],[p[0]+l[0]*B,p[1]+l[1]*B,p[2]+l[2]*B],D,v,l,d,d,l)}return k},lathe(h,p,_,D=0){for(let v=0;v<h.length-1;v++){const[P,B]=h[v],[T,n]=h[v+1],s=T-P,l=n-B,d=Math.hypot(s,l)||1,C=l/d,t0=-s/d;for(let Z=0;Z<p;Z++){const I=Z/p*z0,s0=(Z+1)/p*z0,n0=Math.cos(I),$=Math.sin(I),d0=Math.cos(s0),g0=Math.sin(s0),e0=[n0*C,t0,$*C],b0=[d0*C,t0,g0*C];P>1e-5&&k.tri([n0*P,B,$*P],[d0*T,n,g0*T],[d0*P,B,g0*P],_,D,e0,b0,b0),T>1e-5&&k.tri([n0*P,B,$*P],[n0*T,n,$*T],[d0*T,n,g0*T],_,D,e0,e0,b0)}}return k},build(){const h=new i.BufferGeometry;return h.setAttribute("position",new i.Float32BufferAttribute(a,3)),h.setAttribute("normal",new i.Float32BufferAttribute(r,3)),h.setAttribute("aCol",new i.Float32BufferAttribute(o,3)),h.setAttribute("aMat",new i.Float32BufferAttribute(t,1)),h.setAttribute("aWing",new i.Float32BufferAttribute(m,3)),h}};return k}function xt(){const a=[],r=[],o=[],t=[],m=[];return{add(M,f,c,A=0,E=0){const S=a.length/3,b=M.length;for(let z=0;z<b;z++){const q=M[z],j=M[Math.max(z-1,0)],V=M[Math.min(z+1,b-1)];let k=V[0]-j[0],h=V[1]-j[1],p=V[2]-j[2];const _=Math.hypot(k,h,p)||1;k/=_,h/=_,p/=_;const D=A+(E-A)*(z/(b-1));for(const v of[-1,1])a.push(q[0],q[1],q[2]),r.push(k,h,p),o.push(c[0],c[1],c[2]),t.push(v,f,D);if(z<b-1){const v=S+z*2;m.push(v,v+1,v+2,v+1,v+3,v+2)}}return this},build(){const M=new i.BufferGeometry;return M.setAttribute("position",new i.Float32BufferAttribute(a,3)),M.setAttribute("aDir",new i.Float32BufferAttribute(r,3)),M.setAttribute("aCol",new i.Float32BufferAttribute(o,3)),M.setAttribute("aSide",new i.Float32BufferAttribute(t,3)),M.setIndex(m),M}}}const i0=(a,r,o)=>{const t=[];for(let m=0;m<=o;m++){const M=m/o;t.push([a[0]+(r[0]-a[0])*M,a[1]+(r[1]-a[1])*M,a[2]+(r[2]-a[2])*M])}return t},y=[.5,.54,.62],Y=[.09,.105,.16],Q=[1,.66,.22],U=[.72,.76,.84],r0=[.8,.83,.88],m0=[.012,.014,.022],Ke=[.42,.44,.5],He=[.75,.9,1],a0=[.5,.52,.56],v0=[-1.1,.05,G0-.45],_0=1.6,O0=E0(v0[0],v0[1],v0[2]),wt=[O0[0],O0[1]-.63*_0,O0[2]],yt=E0(-T0[0],.8,G0-T0[2]),jt=[Ot[0]*.2-Nt[0],0,Ot[2]*.2-Nt[2]];async function Ye(a,r,o){const t=bt(),m=xt(),M=new i.Quaternion,f=new i.Matrix4,c=W(0,1,0),A=W(),E=W(1,1,1);let S=Y0;const b=()=>t.xf(S),z=(e,u)=>t.xf(f.compose(W(e[0],e[1],e[2]),M.setFromUnitVectors(c,A.set(u[0],u[1],u[2]).normalize()),E).premultiply(S)),q=(e,u,w,g=0)=>{for(let x=0;x<e.length-1;x++)t.tube(e[x],e[x+1],u,w,g,5)},j=(e,u)=>{z(e,u),t.lathe([[.024,0],[.024,.016],[.012,.022],[0,.022]],6,y,0),b()},V=(e,u,w)=>{const g=(x,L,J)=>[e[0]+x*u[0],e[1]+L*u[1],e[2]+J*u[2]];for(const x of[-1,1])for(const L of[-1,1])t.tube(g(-1,x,L),g(1,x,L),w,y,0,8),t.tube(g(x,-1,L),g(x,1,L),w,y,0,8),t.tube(g(x,L,-1),g(x,L,1),w,y,0,8);for(const x of[-1,1])t.tube(g(x,-1,-1),g(x,1,1),w*.62,y,0,6),t.tube(g(-1,-1,x),g(1,1,x),w*.62,y,0,6),t.tube(g(-1,x,-1),g(1,x,1),w*.62,y,0,6),t.tube(g(-1,x,1),g(1,x,-1),w*.62,y,0,6)},k=(e,u,w,g,x)=>{const L=(J,O,x0)=>[e[0]+J*u[0],e[1]+O*u[1],e[2]+x0*u[2]];for(const J of[-1,1])for(const O of[-1,1]){const x0=L(x,J,O),X=[x,J,O];for(let F=0;F<3;F++){const w0=(F+1)%3,S0=(F+2)%3,c0=x0.slice(),y0=[0,0,0];y0[F]=X[F],c0[F]+=X[F]*(w+.007);const W0=c0.slice(),I0=c0.slice();W0[w0]-=X[w0]*g,I0[S0]-=X[S0]*g,t.tri(c0,W0,I0,Y,0,y0,y0,y0);for(const[Q0,M0]of[[.16,.16],[.62,.14],[.14,.62]]){const B0=c0.slice();B0[w0]-=X[w0]*g*Q0,B0[S0]-=X[S0]*g*M0,j(B0,y0)}}}},h=(e,u,w,g)=>{V(e,u,w),k(e,u,w,g,-1),k(e,u,w,g,1)},p=1.5;V([0,0,0],[p,p,p],.045),k([0,0,0],[p,p,p],.045,.34,-1),await o(),k([0,0,0],[p,p,p],.045,.34,1),await o(),t.box(0,-.15,0,2.5,2.3,2.5,Q,1);for(const e of[-1,1])for(const u of[-1,1])t.box(e*1.255,-.15,u*1.255,.05,2.32,.05,U,1),t.box(e*1.255,1,0,.05,.05,2.5,U,1),t.box(0,1,e*1.255,2.5,.05,.05,U,1);t.box(0,-.1,-1.29,1.7,1.5,.04,r0,2);for(let e=-3;e<=3;e++)t.box(e*.24,-.1,-1.325,.03,1.5,.05,r0,2);t.box(-1.29,.2,.3,.05,.6,.9,Y,0),t.box(-1.33,.2,.3,.03,.42,.7,U,1);for(let e=0;e<5;e++)t.tube([1.27+.03*(e%2),-1.2,-1+e*.07],[1.27+.03*(e%2),.95,-1+e*.07],.014,e%2?Y:a0,0,5);for(const e of[-1,1])t.box(e*1.256,.3,0,.012,.06,2.5,U,1),t.box(0,.3,e*1.256,2.5,.06,.012,U,1);t.box(.7,-.9,1.262,.52,.3,.024,Y,0);for(let e=0;e<5;e++){const u=.52+e*.09,w=-.94+e%2*.09;z([u,w,1.274],[0,0,1]),t.lathe([[.026,0],[.026,.05],[.017,.06],[.017,.09]],8,e%2?y:U,0),b(),q([[u,w,1.37],[u+.06,-1.2,1.46],[1+e*.07,-1.47,1.53]],.011,e===2?Q:m0,e===2?1:0)}for(const e of[-1,1])for(const u of[-1,1])z([e*1.25,-1.5,u*1.25],[0,-1,0]),t.lathe([[.1,0],[.24,.02],[.24,.1],[.2,.12],[.24,.14],[.24,.24],[.2,.26],[.24,.28],[.24,.4],[0,.42]],14,Ke,2);if(t.xf(),await o(),a==="telescope"){t.wing(2,.9,-.2),t.xf(f.makeRotationX(-10*G).setPosition(.3,.9,-.2)),t.lathe([[.3,-.9],[.44,-.8],[.44,2.15],[.47,2.17],[.47,2.25],[.44,2.27],[.44,2.3]],28,r0,2),t.lathe([[.415,2.3],[.415,.4],[0,.4]],28,m0,0);for(const e of[.1,.9,1.6])t.lathe([[.44,e],[.475,e+.015],[.475,e+.06],[.44,e+.075]],28,y,0);t.lathe([[.46,-.55],[.5,-.5],[.5,0],[.46,.05]],28,Q,1);for(let e=0;e<3;e++){const u=e*2.094+.4;t.tube([Math.cos(u)*.42,2.12,Math.sin(u)*.42],[0,2,0],.012,Y,0,4)}t.lathe([[0,1.9],[.11,1.92],[.11,2.02],[0,2.04]],12,Y,0),t.lathe([[.37,.44],[0,.41]],28,U,0),t.tube([.56,.75,.1],[.56,1.7,.1],.07,r0,2,12),t.tube([.56,1.7,.1],[.56,1.86,.1],.082,Y,0,12);for(const e of[.95,1.5])t.box(.49,e,.1,.09,.05,.05,y,0);t.box(-.6,-.3,0,.3,.44,.34,Q,1),t.box(-.76,-.3,0,.02,.34,.26,r0,2),t.box(-.6,-.07,0,.32,.03,.36,U,1),q([[-.6,-.52,.1],[-.55,-.72,.2],[-.3,-.86,.3]],.014,m0),t.xf().wing(),t.tube([.3,.2,.25],[.3,.9,-.2],.05,y,0,8),t.tube([-.2,1,-.2],[.8,1,-.2],.04,y,0,8)}else{t.lathe([[1.02,1.42],[1.08,1.44],[1.08,1.5],[1.02,1.52],[.96,1.5],[.96,1.44],[1.02,1.42]],36,y,0);for(let e=0;e<8;e++){const u=e/8*z0+.2,w=Math.cos(u),g=Math.sin(u),x=[w*1.02,1.5,g*1.02];z(x,[w*.55,.83,g*.55]),t.lathe([[.09,0],[.09,.3],[.13,.32],[.15,.52]],12,r0,2),t.lathe([[.135,.52],[.085,.3],[0,.3]],12,m0,0),t.lathe([[.1,.02],[.115,.04],[.115,.16],[.1,.18]],12,Q,1),t.xf(),q([[w*.94,1.56,g*.94],[w*.6,1.53,g*.6],[w*.31,1.2,g*.31]],.012,e%3?m0:Q,e%3?0:1)}t.xf(),t.lathe([[0,1],[.3,1],[.3,1.25],[.22,1.3],[0,1.42]],18,Y,0)}await o();const _=(e,u,w,g,x)=>{const L=(X,F,w0,S0,c0,y0)=>x?t.quad(S0,w0,F,X,c0,y0):t.quad(X,F,w0,S0,c0,y0),J=[e(u,g,.02),e(w,g,.02),e(w,-g,.02),e(u,-g,.02)],O=w-u,x0=[[0,g,O],[O,g,O],[O,-g,O],[0,-g,O]];x?t.quadC(J.slice().reverse(),x0.slice().reverse(),3):t.quadC(J,x0,3),L(e(u,-g,-.02),e(w,-g,-.02),e(w,g,-.02),e(u,g,-.02),U,1);for(const X of[-g-.02,g+.02])t.tube(e(u,X,0),e(w,X,0),.022,y,0,6);for(let X=0;X<=4;X++){const F=u+(w-u)*X/4;t.tube(e(F,-g-.02,0),e(F,g+.02,0),.02,y,0,6)}},D=1.15;for(const e of[-1,1])t.tube([e*1.5,D,0],[e*1.85,D,0],.04,y,0,8),t.wing(e,D,0),_((u,w,g)=>[u,D+g,w],e<0?-5.85:1.85,e<0?-1.85:5.85,.66,!1),t.wing();const v=.25,P=-.42,B=(e,u,w)=>{const g=(u-e)/w;for(const x of[-1,1])t.tube([x*v,0,e],[x*v,0,u],.026,y,0,8);t.tube([0,P,e],[0,P,u],.026,y,0,8);for(let x=0;x<=w;x++){const L=e+x*g,J=L+g,O=x%2;t.tube([-v,0,L],[v,0,L],.014,y,0,5),t.tube([-v,0,L],[0,P,L],.014,y,0,5),t.tube([v,0,L],[0,P,L],.014,y,0,5);for(const x0 of[-1,1])t.box(x0*v,0,L,.075,.075,.075,Y,0);x<w&&(t.tube([O?-v:v,0,L],[O?v:-v,0,J],.012,y,0,5),t.tube([-v,0,O?L:J],[0,P,O?J:L],.012,y,0,5),t.tube([v,0,O?J:L],[0,P,O?L:J],.012,y,0,5))}t.tube([-v-.05,.04,e],[-v-.05,.04,u],.018,Q,1,6);for(const x of[-.012,.085])t.tube([-v-.045,x,e],[-v-.045,x,u],.009,m0,0,5);for(let x=1;x<w;x+=2)t.box(-v-.045,.035,e+x*g+.09,.075,.14,.035,Y,0)};await o();const T=.32;S=new i.Matrix4().makeRotationY(90*G).setPosition(1.5,V0,K0),b(),B(.08,D0[0]-1.5-T,4),S=Y0,b(),h([D0[0],V0-.21,K0],[T,T,T],.03,.2);for(let e=0;e<3;e++)q([[1.27+.03*(e%2),-1.2,-1+e*.14],[1.4,-1.4,-1.02+e*.01],[1.6,V0+.04,K0+v+.05]],.012,e===1?Q:m0,e===1?1:0);await o(),S=k0,b();const[n,,s]=T0,l=G0,d=l+s,C=T,t0=14,Z=(d-C)/t0;B(C,d,t0);for(const e of[-1,1])for(const u of[-1,1])t.tube([e*v,0,l+u*(s-.07)],[e*n,.55+H0,l+u*s],.022,y,0,6);await o(),S=Vt,b();const I=.36,s0=n-.15,n0=s-.15;h([0,-.05,l],T0,.034,.26),await o(),t.box(0,-.1,l,2*s0,.92,2*n0,Q,1),t.box(0,-.1,l,2*s0+.02,.94,.06,U,1),t.box(0,-.1,l,.06,.94,2*n0+.02,U,1);for(const e of[-1,1])t.box(e*(s0-.005),I,l,.05,.014,2*n0,U,1),t.box(0,I,l+e*(n0-.005),2*s0,.014,.05,U,1);t.box(-.1,I,l+.26,.17,.012,.09,U,1),t.box(.14,I,l-.02,.07,.012,.2,U,1),t.box(-.15,I+.012,l-.38,.36,.024,.16,Y,0);for(let e=0;e<4;e++){const u=-.27+e*.08,w=l-.38;z([u,I+.024,w],[0,1,0]),t.lathe([[.025,0],[.025,.04],[.016,.05],[.016,.075]],8,e%2?y:U,0),b(),q([[u,I+.09,w],[u,I+.3,w-.04],[-v-.045+e*.014,-H0-.05,w-.12],[-v-.045+e*.014,.1-H0,w-.3]],.011,e===1?Q:m0,e===1?1:0)}t.tube([.2,I,l+.34],[.2,I+.13,l+.34],.014,y,0,5),z([.2,I+.13,l+.34],[0,1,0]),t.lathe([[0,0],[.115,0],[.115,.025],[0,.032]],14,r0,2),b(),t.box(.24,I+.04,l-.34,.1,.08,.1,Y,0),t.box(.24,I+.086,l-.34,.06,.012,.06,U,1),t.box(s0+.02,-.1,l,.03,.66,.9,r0,2);for(let e=-2;e<=2;e++)t.box(s0+.05,-.1,l+e*.19,.04,.66,.02,r0,2);t.tube([n,-.3,l+.5],[1.3,-.3,l+.5],.016,y,0,6),t.box(1.36,-.36,l+.5,.2,.26,.2,r0,2),z([n-.08,.2,l-.45],[.8,.5,-.3]),t.lathe([[.07,0],[.085,.02],[.17,.46],[.18,.47]],18,Q,1),t.lathe([[.165,.47],[.06,.02],[0,.02]],18,m0,0);for(const e of[.16,.3])t.lathe([[.07+e*.2,e],[.04+e*.2,e+.004]],18,m0,0);b(),await o();const $=.3*_0,d0=l-s;for(const e of[-1,1])for(const[u,w]of[[.55,.25],[-.65,-.25]])t.tube([-n,u,v0[2]+e*.5],[v0[0]+.8*$,v0[1]+w,v0[2]+e*.6*$],.02,y,0,6);q([[-n,-.3,v0[2]+.62],[-.62,-.62,v0[2]+.5],[v0[0]-.12*_0,v0[1]-.41*_0,v0[2]+.09*_0]],.011,Q,1),S=new i.Matrix4().makeTranslation(0,2.19,0).premultiply(f.makeScale(_0,_0,_0)).premultiply(f.makeRotationY(Gt)).premultiply(f.makeTranslation(O0[0],O0[1],O0[2])),b(),t.lathe([[.3,-2.02],[.3,-1.98],[.27,-1.95],[.12,-1.925],[0,-1.92]],22,Q,1),t.lathe([[.1,-1.93],[.1,-1.9],[0,-1.895]],12,y,0),t.lathe([[.295,-2.36],[.295,-2.02]],22,Q,1);for(const e of[-2.03,-2.19,-2.35])t.lathe([[.295,e-.012],[.312,e-.006],[.312,e+.006],[.295,e+.012]],22,y,0);t.lathe([[.055,-2.7],[.295,-2.37]],22,y,0),t.lathe([[.04,-2.78],[.065,-2.76],[.065,-2.69]],12,Y,0);for(let e=0;e<8;e++){const u=e/8*z0;j([Math.cos(u)*.245,-1.947,Math.sin(u)*.245],[0,1,0])}t.box(-.12,-2.6,.09,.07,.11,.08,Y,0),t.quad([-.05,-2.74,-.02],[.05,-2.74,-.02],[.04,-2.8,-.17],[-.04,-2.8,-.17],y,0),S=Vt,b(),t.tube([-n,.55,d0],[-n,.7,d0],.014,y,0,6),z([-n,.7,d0],[0,1,0]),t.lathe([[.045,0],[.045,.035],[.032,.045]],10,Y,0),t.lathe([[.032,.045],[.037,.09],[.028,.135],[0,.15]],10,He,4),b(),await o(),S=Y0,b(),t.tube(E0(n,-.65,l+.25),N0,.04,y,0,8),t.tube(E0(n,.1,l+s),N0,.02,y,0,6),S=at,b(),t.tube([0,0,0],[0,0,.14],.04,y,0,8),t.wing(3,0,0),_((e,u,w)=>[u,w,e],.14,.14+Pe,.65,!0),t.wing(),S=Y0,b(),z([-1.1,1.52,1.1],[-.25,.9,.3]),t.lathe([[.08,0],[.095,.02],[.2,.52],[.21,.53]],18,Q,1),t.lathe([[.195,.53],[.07,.02],[0,.02]],18,m0,0),t.xf();const e0=()=>r.range(-.06,.06);m.add(i0([1.5,1.5,-1.5],[2+e0(),3.6,-2+e0()],6),.012,a0,0,1),m.add(i0([-1.5,1.5,-1.5],[-1.9+e0(),3.2,-1.9+e0()],6),.012,a0,0,1),m.add(i0(E0(-T0[0],-.65,G0+T0[2]),E0(-.9+e0(),-2.3,G0+T0[2]+.3+e0()),6),.01,a0,0,1),m.add(i0([1.5,1.5,-1.5],[D0[0],V0+.12,K0],3),.014,a0);for(const e of[C+6*Z,d-.3])m.add(i0([1.5,1.5,1.5],Ut(-v,.04,e),3),.014,a0);for(const e of[-1,1])for(const u of[-1,1])m.add(i0([e*p,p,u*p],[e*.12,7.5,u*.12],4),.022,a0);t.lathe([[.2,7.46],[.24,7.5],[.2,7.54],[.16,7.5],[.2,7.46]],16,y,0),await o();const b0=t.build();return await o(),{solid:b0,lines:m.build(),tris:t.count()}}async function Qe(a,r){const o=bt(),t=xt(),m=new i.Matrix4,M=1.7,f=[0,1,2,3].map(n=>{const s=(20+90*n)*G;return[Math.cos(s)*M,Math.sin(s)*M]}),c=n=>{for(let s=0;s<4;s++){const l=f[s],d=f[(s+1)%4];o.tube([l[0],n,l[1]],[d[0],n,d[1]],.034,y,0,6),o.box(l[0],n,l[1],.14,.14,.14,Y,0)}for(let s=0;s<2;s++)o.tube([f[s][0],n,f[s][1]],[f[s+2][0],n,f[s+2][1]],.022,y,0,5)};o.lathe([[0,7.56],[.06,7.62],[.06,7.8],[.1,7.84],[.1,8.06],[.06,8.1],[.06,8.3],[0,8.36]],12,y,0),o.lathe([[.1,7.92],[.116,7.94],[.116,7.98],[.1,8]],12,Y,0),t.add(i0([0,8.36,0],[0,9.3,0],2),.04,a0);for(const n of f)t.add(i0([0,9.3,0],[n[0],11.2,n[1]],2),.03,a0);c(11.2),c(29.5),c(53);for(const n of f)t.add(i0([n[0],11.2,n[1]],[n[0],53,n[1]],12),.034,a0),t.add(i0([n[0],53,n[1]],[n[0]*.08,59.25,n[1]*.08],3),.034,a0);t.add(i0([0,11.2,0],[0,29.5,0],6),.02,a0),t.add(i0([0,52.4,0],[0,59.2,0],3),.02,a0),await r();const A=[(f[0][0]+f[1][0])/2,(f[0][1]+f[1][1])/2],E=[(f[1][0]-f[0][0])/(M*Math.SQRT2),(f[1][1]-f[0][1])/(M*Math.SQRT2)],S=[A[0]/Math.hypot(A[0],A[1]),A[1]/Math.hypot(A[0],A[1])],b=(n,s,l=.3,d=0)=>[A[0]+E[0]*l*n+S[0]*d,s,A[1]+E[1]*l*n+S[1]*d];for(const n of[-1,1])o.tube(b(n,11.2),b(n,29.5),.075,y,0,8);o.tube(b(0,11.2,0,.42),b(0,29.5,0,.42),.06,y,0,8);for(let n=0,s=11.7;s<29.3;s+=.5,n++){if(o.tube(b(-1,s),b(1,s),.05,y,0,6),n%2===0&&s+1<29.5)for(const l of[-1,1])o.tube(b(l,s),b(0,s+.5,0,.42),.032,y,0,5),o.tube(b(0,s+.5,0,.42),b(l,s+1),.032,y,0,5);if(n%4===0)for(const l of[-1,1]){const d=b(l,s);o.box(d[0],d[1],d[2],.2,.2,.2,Y,0),o.tube(d,[f[l<0?0:1][0],s,f[l<0?0:1][1]],.03,y,0,5)}}o.tube(b(1,11.3,.42),b(1,29.4,.42),.035,Q,1,6);for(let n=12.2;n<29.3;n+=2){const s=b(1,n,.4);o.box(s[0],s[1],s[2],.14,.16,.14,Y,0)}await r(),o.xf(m.makeRotationFromEuler(new i.Euler(.6155,.7854+a()*.6,.3)).setPosition(0,14.2,0));for(let n=0;n<3;n++){const s=(n+1)%3,l=(n+2)%3,d=(C,t0)=>{const Z=[0,0,0];return Z[s]=C*.55,Z[l]=t0*.55,Z};o.quad(d(-1,-1),d(1,-1),d(1,1),d(-1,1),Q,1);for(const[C,t0,Z,I]of[[-1,-1,1,-1],[1,-1,1,1],[1,1,-1,1],[-1,1,-1,-1]])o.tube(d(C,t0),d(Z,I),.024,y,0,5)}o.xf(),o.box(0,19.2,0,.9,.75,.9,Q,1),o.box(0,19.2,0,.93,.09,.93,U,1),o.box(0,19.2,0,.09,.78,.93,U,1),o.box(0,19.2,.465,.56,.46,.03,r0,2),o.box(.3,19.62,-.25,.16,.1,.16,Y,0),t.add(i0([.36,19.58,.36],[.6,21.2,.52],4),.014,a0,0,1),o.lathe([[.34,23.97],[.34,24.73]],18,Q,1),o.lathe([[0,23.9],[.3,23.93],[.35,23.97]],18,r0,2),o.lathe([[.35,24.73],[.3,24.77],[0,24.8]],18,r0,2),o.lathe([[.343,24.28],[.352,24.29],[.352,24.41],[.343,24.42]],18,U,1),await r();const z=[.92,.17,.02],q=[.86,.88,.92],j=[.035,.04,.09],V=12,k=60,h=32.6,p=51.6,_=n=>[n[0]*.4+.01,n[1]*.4+.015,n[2]*.4+.05],D=a()*z0,v=[];for(let n=0;n<8;n++)v.push(.85+.3*a());const P=n=>.6+.88*Math.sin(Math.PI*Math.min(n*1.08,1))**.8,B=(n,s)=>{const l=n/k,d=h+(p-h)*l,C=l*8,t0=Math.min(Math.floor(C),7),Z=C-t0,I=Math.sin(Math.PI*Z)**.6,n0=P(l)*(.62+.38*I*v[t0])*[1,.8,.5+.22*(1-I),.8][s%4],$=(s+.5*Math.sin(d*.9+(s>>2)%V))/(4*V)*z0+D+l*.9;return[Math.cos($)*n0,d,Math.sin($)*n0]};for(let n=0;n<k;n++){n===k/2&&await r();for(let s=0;s<4*V;s++){const l=(s+2>>2)%2?z:q;o.quad(B(n,s+1),B(n,s),B(n+1,s),B(n+1,s+1),s%4===1||s%4===2?_(l):l,5)}}await r();for(let n=0;n<=8;n++){const s=h+(p-h)*n/8,l=P(n/8)*.64;o.lathe([[l,s-.1],[l+.022,s-.05],[l+.022,s+.05],[l,s+.1]],14,j,0)}o.lathe([[.37,p],[.17,p+.45],[.08,p+.7]],12,q,5),o.lathe([[.17,p+.7],[.215,p+.745],[.17,p+.79],[.125,p+.745],[.17,p+.7]],14,y,0),o.lathe([[0,29.5],[.09,29.6],[.09,30.3],[.13,30.35],[.13,30.55],[.06,30.62]],10,y,0);for(let n=0;n<V;n++){const s=B(0,4*n),l=Math.atan2(s[2],s[0]);t.add(i0(s,[Math.cos(l)*.07,30.6,Math.sin(l)*.07],3),.014,a0)}o.box(0,55.6,0,.6,.52,.6,Q,1),o.box(0,55.6,0,.63,.08,.63,U,1),o.box(.31,55.6,0,.03,.32,.32,r0,2),o.lathe([[0,59.2],[.12,59.3],[.3,59.9],[.5,60]],16,y,0),await r();const T=o.build();return await r(),{solid:T,lines:t.build(),tris:o.count()}}const f0=[[900*Math.sin(22.5*G),0,-900*Math.cos(22.5*G)],[-2100*Math.sin(35*G),-70,-2100*Math.cos(35*G)]];async function je(a,r,o){const t=bt(),m=xt(),M=new i.Matrix4,f=[];for(let c=0;c<=36;c++){const A=60+130*c/36;f.push([Math.max(r(A),.4),A])}for(let c=0;c<a;c++)t.xf(M.makeTranslation(f0[c][0],f0[c][1],f0[c][2])),t.lathe(f,40,Y,0),t.box(0,0,0,3.4,3.4,3.4,Q,1),m.add(i0([f0[c][0],f0[c][1]+2,f0[c][2]],[f0[c][0],f0[c][1]+60,f0[c][2]],2),.35,a0),await o();return t.xf(),{solid:t.build(),lines:m.build(),tris:t.count()}}function Ze(a,r,o){const t=[],m=[],M=[];for(let c=0;c<a;c++){for(const A of[[-1,-1],[1,-1],[1,1],[-1,1]])t.push(A[0],A[1],0),m.push(...o(c));M.push(c*4,c*4+1,c*4+2,c*4,c*4+2,c*4+3)}const f=new i.BufferGeometry;return f.setAttribute("position",new i.Float32BufferAttribute(t,3)),f.setAttribute(r,new i.Float32BufferAttribute(m,m.length/(a*4))),f.setIndex(M),f}function $e(a,r){const o=new i.InstancedBufferGeometry,t=new Float32Array(a*4);o.setAttribute("position",new i.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),o.setIndex([0,1,2,0,2,3]);for(let m=0;m<a*4;m++)t[m]=r();return o.setAttribute("aSeed",new i.InstancedBufferAttribute(t,4)),o.instanceCount=a,o}function Zt(a,r,o,t){const m=[],M=[],f=[];for(let A=0;A<a;A++)for(let E=0;E<=r;E++){for(const S of[-1,1])m.push(0,0,0),M.push(...t(A,E/r,S));if(E<r){const S=(A*(r+1)+E)*2;f.push(S,S+1,S+2,S+1,S+3,S+2)}}const c=new i.BufferGeometry;return c.setAttribute("position",new i.Float32BufferAttribute(m,3)),c.setAttribute(o,new i.Float32BufferAttribute(M,M.length/(m.length/3))),c.setIndex(f),c}const p0=(a,r,o)=>{const t=Math.cos(r*G);return o.set(Math.sin(a*G)*t,Math.sin(r*G),-Math.cos(a*G)*t)},Mt=a=>C0(0,.1,a)*(1-C0(.1,.4,a));var eo={id:"night-shining",name:"The Night-Shining Clouds",category:"sky",weirdness:.2,media:["air"],async build(a){const{rng:r}=a,o=a.vary||{},t=a.quality?.detail??1,m=r.fork("ns-looks"),M=r.fork("ns-gondola"),f=r.fork("ns-train"),c=r.fork("ns-ballast"),A=r.fork("ns-meteors"),E=m.pick([9,9,6,13,9,6]),S={sunDepth:{dawn:6,golden:6,day:9,night:13}[o.hour]??E,display:m.pick(["bands","billows","whirls"]),moon:m.pick(["gibbous","gibbous","crescent","gibbous","none"]),below:m.pick(["pack","pack","edge","coast"]),film:m.pick(["clear","clear","gold"])},b=m.pick(["telescope","telescope","cameras"]),z=m.pick([1,1,2,0]),q=!!o.rare,j=A()*100,V=[0,1,2,3,4,5].map(K=>K*5+A.range(-.5,.5)),k=A.fork("ns-flecks"),h=new i.Scene;h.background=new i.Color(66056);const p=ae([[0,0,0],[0,0,-92],[0,0,-184],[0,0,-276],[0,0,-368],[0,0,-J0]]),_=p.pointAt(0).clone(),D=new i.Quaternion().setFromRotationMatrix(p.frameAt(0)),v=new i.Group;v.matrixAutoUpdate=!1,v.frustumCulled=!1,h.add(v);const P=await ne(a,{look:S});v.add(P.object),await a.yield();const B=P.anchors&&P.anchors.moonDir,T=W(.6,.53,.6);B&&(B.isVector3?T.copy(B):T.set(B[0],B[1],B[2])),T.normalize();const n={gibbous:1,crescent:.34,none:0}[S.moon],s=1-n,l={6:["#FFA366",1.25],9:["#FF7A3C",.95],13:["#E8482C",.5]}[S.sunDepth],d={6:["#BFE4FF",.5],9:["#2E8BFF",.62],13:["#4450E6",.46]}[S.sunDepth],C={uRigInv:R(new i.Matrix4),uEye:R(W()),uPix:R(.004),uTime:R(0),uFeather:R(0),uTrack:R(0),uMoon:R(T.clone()),uMoonCol:R(u0("#E9EEF7",1.3*n+.04)),uTwiCol:R(u0(l[0],l[1]*(1+.5*s))),uSheetCol:R(u0(d[0],d[1]*(1+1.1*s))),uIceCol:R(u0("#8FA2E0",.24*n+.07)),uShadow:R(u0("#0B1030",2.4)),uStrobePos:R(W()),uStrobeCol:R(u0("#CFE6FF",1.5)),uStrobe:R(0),uFlashCol:R(u0("#B8FFD8",1.3)),uFlashDir:R(W(.5,.5,-.7).normalize()),uFlash:R(0),uWash:R(S.sunDepth===13?.1:1)},t0=new i.ShaderMaterial({uniforms:{...C},vertexShader:Fe,fragmentShader:_e,side:i.DoubleSide}),Z=new i.ShaderMaterial({uniforms:{...C},vertexShader:Be,fragmentShader:Te,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:i.DoubleSide}),I=(K,H,l0,A0=0)=>{const o0=new i.Mesh(K,H);return o0.frustumCulled=!1,o0.renderOrder=A0,l0.add(o0),o0},s0=()=>a.yield(),n0=await Ye(b,M,s0);await a.yield();const $=new i.Group;v.add($),I(n0.solid,t0,$),I(n0.lines,Z,$,3.5);const d0=await Qe(f,s0);await a.yield();const g0=new i.Group;v.add(g0),I(d0.solid,t0,g0),I(d0.lines,Z,g0,3.5);const e0=new i.Group;if(v.add(e0),z>0){const K=await je(z,P.radiusAt,s0);I(K.solid,new i.ShaderMaterial({uniforms:{...C},vertexShader:Ue,fragmentShader:Ve,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:i.DoubleSide}),e0,-.45),I(K.lines,Z,e0,-.4)}await a.yield();const b0={uValve:R(W()),uOut:R(W(0,0,1)),uTime:C.uTime,uPix:C.uPix,uCol:R(u0("#BFD2F4",.5*n+.22).add(C.uSheetCol.value.clone().multiplyScalar(.35))),uGlint:R(u0("#E9EEF7",.9*n+.25).add(C.uSheetCol.value.clone().multiplyScalar(.6)))},e=new i.Group;v.add(e),I(Zt(1,64,"aK",(K,H,l0)=>[H,l0]),new i.ShaderMaterial({uniforms:b0,vertexShader:Ie,fragmentShader:Re,transparent:!0,blending:i.AdditiveBlending,depthWrite:!1,side:i.DoubleSide}),e,6),I($e(Math.round(3e3*t),c),new i.ShaderMaterial({uniforms:b0,vertexShader:Ee,fragmentShader:We,transparent:!0,blending:i.CustomBlending,blendEquation:i.MaxEquation,blendSrc:i.OneFactor,blendDst:i.OneFactor,depthWrite:!1}),e,7),await a.yield();const u=Math.max(300,Math.round(3e3*t)),w=new Float32Array(u*4),g=new Float32Array(u*4);for(let K=0;K<u;K++){const H=95+55*k();w.set([k.range(-.2,.2),H,P.radiusAt(H)+.2+1.8*k(),k()],K*4),g.set([k.range(13,22),k.range(1.4,3),k()<.3?k.range(.12,.22):k.range(.05,.1),k()],K*4)}const x=new i.InstancedBufferGeometry;x.setAttribute("position",new i.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),x.setIndex([0,1,2,0,2,3]),x.setAttribute("aA",new i.InstancedBufferAttribute(w,4)),x.setAttribute("aB",new i.InstancedBufferAttribute(g,4)),x.instanceCount=u;const L={uEye:C.uEye,uMoon:C.uMoon,uMoonCol:C.uMoonCol,uSheetCol:C.uSheetCol,uTwiCol:C.uTwiCol,uTime:C.uTime,uPix:C.uPix,uWash:C.uWash,uShed:R(0)},J=I(x,new i.ShaderMaterial({uniforms:L,vertexShader:Ne,fragmentShader:Oe,transparent:!0,blending:i.CustomBlending,blendEquation:i.AddEquation,blendSrc:i.OneFactor,blendDst:i.OneMinusSrcAlphaFactor,depthWrite:!1}),v,5.5);J.visible=!1,await a.yield();const O={uLamp:R([0,1,2].map(()=>new i.Vector4(0,0,0,0))),uPix:C.uPix,uCol:R(u0("#9CC8FF",1))},x0=I(Ze(Qt,"aI",K=>[K]),new i.ShaderMaterial({uniforms:O,vertexShader:De,fragmentShader:Ge,transparent:!0,blending:i.AdditiveBlending,depthWrite:!1}),v,8),X=new i.Group;v.add(X);const F={uA:R(Array.from({length:P0},()=>W(0,1,0))),uB:R(Array.from({length:P0},()=>W(.1,1,0).normalize())),uPar:R(Array.from({length:P0},()=>W(1,8,1))),uAge:R(new Array(P0).fill(-1)),uPix:C.uPix,uTrain:R(u0("#9FD8E8",1)),uHeadCol:R(u0("#F2FAFF",1))};I(Zt(P0,56,"aK",(K,H,l0)=>[K,H,l0]),new i.ShaderMaterial({uniforms:F,vertexShader:qe,fragmentShader:Le,transparent:!0,blending:i.AdditiveBlending,depthWrite:!1,side:i.DoubleSide}),X,-.5),p0(-62,51,F.uA.value[6]),p0(-36,33,F.uB.value[6]),F.uPar.value[6].set(.7,7.3,1.15),p0(56,52,F.uA.value[7]),p0(24,27,F.uB.value[7]),F.uPar.value[7].set(1.1,45,1.7),[[17,19],[24,18.5],[30,21.5]].forEach(([K,H],l0)=>{F.uA.value[8+l0].copy(F.uB.value[7]),p0(K,H,F.uB.value[8+l0]),F.uPar.value[8+l0].set(.45,2.6,1)}),p0(-88,41,F.uA.value[11]),p0(-52,62,F.uB.value[11]),F.uPar.value[11].set(.8,8,1.6),p0(-96.3,64.1,F.uA.value[12]),p0(112.4,67.3,F.uB.value[12]),F.uPar.value[12].set(.9,8,1.5);const w0=W(...L0),S0=new i.Color(.72,1,.84);await a.yield();const c0=W(),y0=W(),W0=W(),I0=W(),Q0=W(1,1,1),M0=W(),B0=W(),At=new i.Quaternion,nt=new i.Quaternion,$t=new i.Matrix4,Xt=new i.Matrix4,Jt=new i.Vector2,j0={pos:W(),quat:new i.Quaternion},it={f:0,last:-1};function Ct(K,H,l0,A0){A0=R0(A0||0,0,1);const o0=A0*h0,St=!!a.through;l0.matrixWorld.decompose(c0,At,y0),St?(W0.copy(_),nt.copy(D),it.f=0,it.last=-1,U0(0,j0)):(W0.copy(c0),nt.copy(D).slerp(At,C0(0,se,A0)),U0(Se(it,A0,K,a.flight?a.flight.rate:1),j0)),v.matrix.multiplyMatrices($t.compose(W0,nt,Q0),Xt.compose(j0.pos,j0.quat,Q0).invert()),C.uRigInv.value.copy(v.matrix).invert(),I0.copy(c0).applyMatrix4(C.uRigInv.value),C.uEye.value.copy(I0),X.position.copy(I0);const rt=!St;$.visible=g0.visible=e0.visible=e.visible=x0.visible=rt,P.craft&&(P.craft.visible=rt),$.rotation.set(.5*G*Math.sin(H*.71),qt(A0),.5*G*Math.sin(H*.53+1.3),"YXZ"),$.updateMatrix(),e0.position.y=4*Math.sin(H*.31);const te=Math.max(64,a.renderer.getDrawingBufferSize(Jt).y);C.uPix.value=2*Math.tan((l0.fov||72)*.5*G)/te,C.uTime.value=H,C.uFeather.value=14*G*Math.sin(H*.21),C.uTrack.value=3*G*Math.sin(H*.13);const kt=Mt(H%2.5);M0.set(yt[0],yt[1],yt[2]).applyMatrix4($.matrix),C.uStrobePos.value.copy(M0),C.uStrobe.value=kt,O.uLamp.value[0].set(M0.x,M0.y,M0.z,kt);for(let N=0;N<2;N++)O.uLamp.value[1+N].set(f0[N][0],f0[N][1]+e0.position.y-2.2,f0[N][2],N<z?Mt((H+1.1+N*.8)%2.5):0);b0.uValve.value.set(wt[0],wt[1],wt[2]).applyMatrix4($.matrix),b0.uOut.value.set(jt[0],0,jt[2]).normalize().applyQuaternion($.quaternion);const ee=1-C0(15,15.8,o0)*(1-C0(33,34,o0));for(let N=0;N<6;N++){const Ft=H-V[N]+3e3,Z0=Math.floor(Ft/30),oe=Ft-Z0*30;let lt=0,$0=0,ct=0,ut=0,_t=!1;for(let ht=0;ht<4;ht++){const X0=j+N*17.13+Z0*3.71+ht*.917;if(lt=-110+220*q0(X0),$0=15+55*q0(X0+1.3),ct=z0*q0(X0+2.9),ut=16+12*q0(X0+4.1),p0(lt,$0,M0),p0(lt+Math.sin(ct)*ut/Math.max(Math.cos($0*G),.3),R0($0-Math.abs(Math.cos(ct))*ut*.8,6,80),B0),M0.dot(w0)<.88&&B0.dot(w0)<.88){_t=!0;break}}F.uA.value[N].copy(M0),F.uB.value[N].copy(B0),F.uPar.value[N].set(.5+.3*q0(Z0*5.1+N),7.2,(.8+.5*q0(Z0*2.3+N*7.7))*ee),F.uAge.value[N]=_t?oe:-1}F.uAge.value[6]=o0-16,F.uAge.value[11]=o0-Yt[0],F.uAge.value[12]=o0-Yt[1],F.uAge.value[7]=q?o0-17:-1;for(let N=0;N<3;N++)F.uAge.value[8+N]=q?o0-18.1:-1;const Pt=q?Math.max(Mt(o0-18.05),.3*C0(17,17.5,o0)*(1-C0(18,18.4,o0))):0;C.uFlash.value=Pt;const zt=C0(24,26,o0)*(1-C0(29.8,30.8,o0));L.uShed.value=zt,J.visible=rt&&zt>0,P.setBurst((A0-ie)*h0),P.setShed(C0(21/h0,26/h0,A0)),P.setFlash(Pt,S0),v.matrixWorldNeedsUpdate=!0,v.updateMatrixWorld(!0),P.update(K,H,l0)}const st=new i.PerspectiveCamera(72,16/9,.2,9e3);return st.position.copy(_),st.updateMatrixWorld(!0),Ct(0,0,st,0),{scene:h,path:p,duration:46,camera:{fov:72,near:.2,far:9e3,sway:0,bank:0},portal:{shape:"circle",radius:7,color:"#FFC79A",glow:1,revealDistance:150,drawWithin:150},post:{exposure:1.3,bloom:{strength:.5,radius:.6,threshold:.92},grade:{saturation:1.06,contrast:1.04,tint:"#ffffff",shadowTint:"#070a22",vignette:.28,grain:.02,aberration:0}},ride:"none",companion:"none",look:{...S,cast:b,sisters:z,fireball:q},update:Ct,dispose(){P.dispose()}}}};export{eo as default};
