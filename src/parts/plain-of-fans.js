import*as i from"three";import{clamp as $,lerp as G,smoothstep as R,makeRng as ye}from"../kit/core.js";const le=["#2A2F3A","#0FA3A3","#2B2F8F","#F2C230","#F7EDB0","#FBFBF5","#E9A7A0"],ee=30,Me=120,U=10.4;function Se(){return{pos:[],col:[],aux:[],idx:[]}}async function ae(o,n){return Y(o,n,!0)}function Y(o,n,s=!1){if(s)return(async()=>{const m=ce(o,n);let f=m.next();for(;!f.done;)n.Y&&await n.Y(),f=m.next()})();const r=ce(o,n);for(;!r.next().done;);}function*ce(o,n){const s=n.curve||new i.CatmullRomCurve3(n.pts,!1,"centripetal"),r=n.keep?1:o.lod||1,m=r<1?Math.max(3,Math.round(n.n*r)):n.n,f=r<1?Math.max(6,Math.round(n.sides*r)):n.sides,A=n.ref||new i.Vector3(0,1,0),b=o.pos.length/3,d=new i.Vector3,u=new i.Vector3,h=new i.Vector3,w=new i.Vector3,p=new i.Vector3,y=Math.max(2,Math.round(260/(f+1)));for(let t=0;t<=m;t++){t%y===y-1&&(yield);const l=t/m;s.getPoint(l,d),s.getTangent(l,u),h.crossVectors(A,u),h.lengthSq()<1e-6&&h.set(1,0,0),h.normalize(),w.crossVectors(u,h).normalize();for(let v=0;v<=f;v++){const g=-Math.PI+v/f*Math.PI*2,M=n.shape(l,g),k=Math.sin(g)*M[0],z=Math.cos(g)*M[1];p.copy(d).addScaledVector(h,k).addScaledVector(w,z),n.warp&&n.warp(p,l,g),n.floor!==void 0&&p.y<n.floor&&(p.y=n.floor+(p.y-n.floor)*.12),o.pos.push(p.x,p.y,p.z);const E=n.color(l,g,p);o.col.push(E[0],E[1],E[2]);const C=n.aux?n.aux(l,g):[0,0,0];o.aux.push(C[0],C[1],C[2])}}const F=f+1,N=Math.floor(m/2),I=Math.floor(f/4),c=b+N*F+I,P=c+1,_=c+F,L=new i.Vector3().fromArray(o.pos,c*3),V=new i.Vector3().fromArray(o.pos,P*3),T=new i.Vector3().fromArray(o.pos,_*3),a=new i.Vector3().crossVectors(V.clone().sub(L),T.clone().sub(L));s.getPoint(N/m,d);const e=a.dot(L.clone().sub(d))<0;for(let t=0;t<m;t++)for(let l=0;l<f;l++){const v=b+t*F+l,g=v+1,M=v+F,k=M+1;e?o.idx.push(v,M,g,g,M,k):o.idx.push(v,g,M,g,k,M)}}async function ue(o,n){const s=new i.BufferGeometry,r=new Float32Array(o.pos),m=new Float32Array(r.length),f=o.idx,A=f.length;for(let b=0;b<A;b+=3){n&&b%3e4===29997&&await n();const d=f[b]*3,u=f[b+1]*3,h=f[b+2]*3,w=r[u]-r[d],p=r[u+1]-r[d+1],y=r[u+2]-r[d+2],F=r[h]-r[d],N=r[h+1]-r[d+1],I=r[h+2]-r[d+2],c=p*I-y*N,P=y*F-w*I,_=w*N-p*F;m[d]+=c,m[d+1]+=P,m[d+2]+=_,m[u]+=c,m[u+1]+=P,m[u+2]+=_,m[h]+=c,m[h+1]+=P,m[h+2]+=_}for(let b=0;b<m.length;b+=3){const d=Math.hypot(m[b],m[b+1],m[b+2])||1;m[b]/=d,m[b+1]/=d,m[b+2]/=d}return n&&await n(),s.setAttribute("position",new i.BufferAttribute(r,3)),s.setAttribute("normal",new i.BufferAttribute(m,3)),s.setAttribute("aColor",new i.Float32BufferAttribute(o.col,3)),s.setAttribute("aAux",new i.Float32BufferAttribute(o.aux,3)),s.setIndex(o.idx),s}const B=(o,n,s)=>{const r=(o-n)/s;return Math.exp(-r*r)},O=(o,n,s)=>[o[0]+(n[0]-o[0])*s,o[1]+(n[1]-o[1])*s,o[2]+(n[2]-o[2])*s],W=(o,n)=>[o[0]*n,o[1]*n,o[2]*n],de=`
uniform float uUnfurl, uTime, uSpread, uNR, uFlex;
uniform vec2 uStripe;                       // centre x (m), half width (m)
const float HUB_Y = ${ee.toFixed(1)};
float easeBack(float p){ float q = p - 1.; return 1. + 1.9*q*q*q + 0.9*q*q; }
float ribOpen(float i){
  float s = i/uNR*2. - 1.;
  float p = clamp(uUnfurl*1.6 - 0.6*(1. - abs(s)), 0., 1.);
  return easeBack(p);
}
float ribAngle(float i, float rho){
  float s = i/uNR*2. - 1.;
  float e = ribOpen(i);
  float a = s*uSpread*mix(0.042, 1., e);
  float rr = rho/120.;
  a += uFlex*rr*rr*(sin(uTime*0.55 + i*0.37) + 0.5*sin(uTime*0.93 - i*0.21))*(0.25 + 0.75*clamp(e, 0., 1.));
  return a;
}
float ribZ(float i){ float s = i/uNR*2. - 1.; return s*3.4*(1. - clamp(ribOpen(i), 0., 1.)); }
float pleatFlip(float j){
  float s = (j + 0.5)/uNR*2. - 1.;
  float x = 120.*sin(s*uSpread);
  return 1. - smoothstep(uStripe.y - 9., uStripe.y + 9., abs(x - uStripe.x));
}
`,oe=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol;
vec3 hemi(vec3 N){ return mix(uGndCol, uSkyCol, N.y*0.5 + 0.5); }
float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y);
}
// antialiased periodic line: 1 on the line. x in periods, w = half width in periods.
float lineAA(float x, float w){
  float fw = fwidth(x);
  float d = abs(fract(x) - 0.5);
  float l = 1. - smoothstep(w, w + fw*1.5 + 1e-4, d);
  return l*(1. - smoothstep(0.25, 0.6, fw));
}
`;function fe(o,n=!1){const s=new Set;if(n){for(const c of[U-1.2,U+1.4,U+4,113,115.5,118,121,123])s.add(c);for(const c of o.knuckles)for(const P of[-2.4,0,2.4])s.add(+(c+P).toFixed(2))}else{for(let c=U-1.2;c<113;c+=5)s.add(+c.toFixed(2));for(const c of o.knuckles)for(const P of[-2.6,-1.5,-.7,0,.7,1.5,2.6])s.add(+(c+P).toFixed(2));for(const c of[.6,1.4,2.4,3.6])s.add(+(U+c).toFixed(2));for(let c=113;c<=123.01;c+=1)s.add(+c.toFixed(2))}s.add(123.5);const r=[...s].filter(c=>c>=U-1.2).sort((c,P)=>c-P),m=c=>{const P=$((c-U)/(Me-U),0,1);let _=G(1,.2,Math.pow(P,.72)),L=B(c,U+1.4,1.5)*.9;for(const l of o.knuckles)L+=B(c,l,1.1),_*=1-.16*B(c,l-2.3,.8)-.16*B(c,l+2.3,.8);L=Math.min(L,1),_*=1+.6*L;let V=1.5*_,T=.95*_,a=_;const e=$((c-113.5)/10,0,1);let t=0;if(e>0){t=R(0,.25,e);const l=o.spatW*Math.pow(Math.sin(Math.PI*Math.min(.5+e*.5,.999)),.6)*R(0,.3,e)*(e>.97?.35:1);a=G(_,l,t),V=G(V,.16,t),T=G(T,.12,t)}return n?{pts:[[0,V],[a,-.06*T],[0,-T],[-a,-.06*T]],w:a,kn:L,sp:t}:{pts:[[0,V],[a,.3*V],[a,-.42*T],[0,-T],[-a,-.42*T],[-a,.3*V]],w:a,kn:L,sp:t}},f=r.map(m),A=[],b=[],d=[],u=[],h=new i.Vector3,w=new i.Vector3,p=new i.Vector3,y=new i.Vector3,F=n?4:6;for(let c=0;c<F;c++){const P=(c+1)%F,_=A.length/3;for(let L=0;L<r.length;L++){const V=f[L],T=Math.max(L-1,0),a=Math.min(L+1,r.length-1),e=V.pts[c],t=V.pts[P],l=f[T].pts,v=f[a].pts;h.set(t[0]-e[0],0,t[1]-e[1]),w.set((v[c][0]+v[P][0]-l[c][0]-l[P][0])*.5,r[a]-r[T],(v[c][1]+v[P][1]-l[c][1]-l[P][1])*.5),y.crossVectors(h,w),p.set((e[0]+t[0])*.5,0,(e[1]+t[1])*.5),y.dot(p)<0&&y.negate(),y.lengthSq()<1e-10&&y.set(0,0,1),y.normalize(),A.push(e[0],r[L],e[1],t[0],r[L],t[1]),b.push(y.x,y.y,y.z,y.x,y.y,y.z);const g=Math.max(V.w,.001);d.push(V.kn,V.sp,e[0]/g,V.kn,V.sp,t[0]/g)}for(let L=0;L<r.length-1;L++){const V=_+L*2;u.push(V,V+2,V+1,V+1,V+2,V+3)}}const N=new i.InstancedBufferGeometry;N.setAttribute("position",new i.Float32BufferAttribute(A,3)),N.setAttribute("normal",new i.Float32BufferAttribute(b,3)),N.setAttribute("aInfo",new i.Float32BufferAttribute(d,3)),N.setIndex(u);const I=new Float32Array(o.nRibs);for(let c=0;c<o.nRibs;c++)I[c]=c;return N.setAttribute("aRib",new i.InstancedBufferAttribute(I,1)),N.instanceCount=o.nRibs,N.boundingSphere=new i.Sphere(new i.Vector3(0,ee+40,0),140),N}function he(o){return new i.ShaderMaterial({uniforms:o,fog:!0,side:i.DoubleSide,vertexShader:`
      attribute vec3 aInfo; attribute float aRib;
      varying vec3 vN, vWPos, vInfo; varying float vRho, vRib, vNz;
      #include <fog_pars_vertex>
      ${de}
      void main(){
        float rho = position.y;
        float th = ribAngle(aRib, rho);
        float c = cos(th), s = sin(th);
        vec3 p = vec3(rho*s + position.x*c, HUB_Y + rho*c - position.x*s, position.z + ribZ(aRib));
        vec3 n = vec3(normal.x*c + normal.y*s, -normal.x*s + normal.y*c, normal.z);
        vec4 wp = modelMatrix*vec4(p, 1.);
        vWPos = wp.xyz; vN = mat3(modelMatrix)*n; vInfo = aInfo; vRho = rho; vRib = aRib; vNz = normal.z;
        vec4 mvPosition = viewMatrix*wp;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSlate, uIndigo, uTeal, uGold, uLemon, uRose, uBone, uBounce;
      varying vec3 vN, vWPos, vInfo; varying float vRho, vRib, vNz;
      #include <fog_pars_fragment>
      ${oe}
      void main(){
        vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
        vec3 V = normalize(cameraPosition - vWPos);
        float rr = clamp(vRho/120., 0., 1.);
        float grain = vnoise(vec2(vRho*0.9, vInfo.z*3. + vRib*7.));
        float stria = lineAA(vInfo.z*2.5 + 0.5, 0.12);
        float rings = lineAA(vRho/1.6, 0.08);
        vec3 dark = mix(uSlate*0.55, uIndigo*0.42, 0.45 + 0.3*grain);
        dark *= 0.8 + 0.4*grain;
        dark = mix(dark, dark*0.55, stria*0.5 + rings*0.35);
        dark = mix(dark, uSlate*2.4, smoothstep(0.55, 1., vNz)*0.35);          // paler worn keel
        dark *= 2.7;
        // the packed spars round the collar: deep indigo with a slate sheen, never black
        dark = mix(dark, (uIndigo*1.5 + uSlate*5.5)*(0.7 + 0.5*grain)*(1. - 0.4*stria), 1. - smoothstep(0.16, 0.42, rr));
        vec3 bone = mix(uBone*0.56, uSlate*2.6, rr*0.8)*(0.8 + 0.3*grain);
        vec3 alb = mix(dark, bone, smoothstep(0.25, 0.8, vInfo.x));
        // spatula: rose pad with a pale lemon edge, the fan's only accent
        float edge = smoothstep(0.55, 0.95, abs(vInfo.z));
        vec3 spat = mix(uRose*vec3(0.66, 0.54, 0.54), uLemon*0.6, edge);
        alb = mix(alb, spat, smoothstep(0.35, 0.9, vInfo.y));
        float ndl = dot(N, uSunDir);
        float dif = max(ndl, 0.);
        vec3 col = alb*(uSunCol*dif + hemi(N)*0.9 + uGndCol*0.9 + uBounce*0.6);
        float fres = 1. - max(dot(N, V), 0.); col += uSkyCol*fres*fres*mix(0.10, 0.05, smoothstep(0.16, 0.5, rr));
        vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.));
        float sp = pow(max(dot(N, H), 0.), 18.)*step(0., ndl);
        col += uSunCol*sp*0.06*(0.4 + vInfo.x);
        // thin pad lets a little sun through
        col += spat*uSunCol*max(-ndl, 0.)*0.3*smoothstep(0.5, 1., vInfo.y);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function ve(o,n=4,s=40){const r=[],m=[];for(let d=0;d<2;d++){const u=r.length/3;for(let h=0;h<=s;h++){const w=1-Math.pow(1-h/s,1.25);for(let p=0;p<=n;p++)r.push(d*.5+p/n*.5,w,d)}for(let h=0;h<s;h++)for(let w=0;w<n;w++){const p=u+h*(n+1)+w,y=p+n+1;m.push(p,p+1,y,p+1,y+1,y)}}const f=new i.InstancedBufferGeometry;f.setAttribute("position",new i.Float32BufferAttribute(r,3)),f.setIndex(m);const A=new Float32Array(o.nRibs-1),b=new Float32Array(o.nRibs-1);for(let d=0;d<A.length;d++)A[d]=d,b[d]=o.pleatSeeds[d];return f.setAttribute("aPleat",new i.InstancedBufferAttribute(A,1)),f.setAttribute("aSeed",new i.InstancedBufferAttribute(b,1)),f.instanceCount=o.nRibs-1,f.boundingSphere=new i.Sphere(new i.Vector3(0,ee+40,0),140),f}function me(o){return new i.ShaderMaterial({uniforms:o,fog:!0,side:i.DoubleSide,vertexShader:`
      attribute float aPleat, aSeed;
      uniform float uDepth, uRim, uScallop, uWind;
      varying vec3 vN, vWPos; varying float vA, vR, vRho, vPleat, vSeed, vSpacing, vOpen;
      #include <fog_pars_vertex>
      ${de}
      vec3 memPos(float a, float r){
        float j = aPleat;
        float sc = 4.*a*(1. - a);
        float rim = uRim - uScallop*(0.55*sc + 0.45*sqrt(max(sc, 0.)));
        float rho = mix(${U.toFixed(1)}, rim, r);
        float A0 = ribAngle(j, rho), A1 = ribAngle(j + 1., rho);
        float am = 0.5*(A0 + A1);
        float hc = max(0.5*(A1 - A0)*rho, 0.);                 // half chord now
        float ho = uSpread/uNR*rho;                            // half chord when open
        float dO = uDepth*(0.25 + 0.75*rho/120.)*smoothstep(0., 14., rho - ${U.toFixed(1)});
        float d = sqrt(max(ho*ho + dO*dO - hc*hc, 0.));
        float tr = 1. - abs(2.*a - 1.);
        float t = (2.*a - 1.)*hc;
        float e = clamp(0.5*(ribOpen(j) + ribOpen(j + 1.)), 0., 1.);
        float z = -d*tr;
        float sail = sin(6.2832*a); sail *= sail;
        float wind = sin(uTime*1.3 - rho*0.11 + j*0.9) + 0.6*sin(uTime*2.1 - rho*0.05 - j*1.7);
        float rr = rho/120.;
        z += sail*rr*(0.30 + 0.34*uWind*wind)*e;
        z += tr*rr*rr*0.5*uWind*sin(uTime*0.8 - j*0.35 + rho*0.03)*e;
        float f = pleatFlip(j)*e;
        float c = cos(3.14159*f), s = sin(3.14159*f);
        float t2 = t*c - z*s, z2 = t*s + z*c;
        float ang = am + t2/max(rho, 1.);
        return vec3(rho*sin(ang), HUB_Y + rho*cos(ang), z2 + mix(ribZ(j), ribZ(j + 1.), a));
      }
      void main(){
        float a = position.x, r = position.y, fc = position.z;
        vec3 p = memPos(a, r);
        float ea = 0.02, er = 0.012;
        float ac = clamp(a, fc*0.5 + ea, fc*0.5 + 0.5 - ea);
        float rc = clamp(r, er, 1. - er);
        vec3 da = memPos(ac + ea, rc) - memPos(ac - ea, rc);
        vec3 dr = memPos(ac, rc + er) - memPos(ac, rc - er);
        vec3 n = cross(da, dr);
        vec4 wp = modelMatrix*vec4(p, 1.);
        vWPos = wp.xyz; vN = mat3(modelMatrix)*n;
        vA = a; vR = r; vPleat = aPleat; vSeed = aSeed;
        float sc = 4.*a*(1. - a);
        float rim = uRim - uScallop*(0.55*sc + 0.45*sqrt(max(sc, 0.)));
        vRho = mix(${U.toFixed(1)}, rim, r);
        vSpacing = 2.*uSpread/uNR*vRho;
        vOpen = clamp(0.5*(ribOpen(aPleat) + ribOpen(aPleat + 1.)), 0., 1.);
        vec4 mvPosition = viewMatrix*wp;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSlate, uIndigo, uTeal, uGold, uLemon, uRose, uBounce;
      uniform float uVeins, uRings, uEyeEvery, uEyeRho, uGlow;
      varying vec3 vN, vWPos; varying float vA, vR, vRho, vPleat, vSeed, vSpacing, vOpen;
      #include <fog_pars_fragment>
      ${oe}
      void main(){
        float face = gl_FrontFacing ? 1. : -1.;
        vec3 N = normalize(vN + vec3(0., 0., 1e-5))*face;
        vec3 V = normalize(cameraPosition - vWPos);
        float rr = clamp(vRho/120., 0., 1.);
        float tr = 1. - abs(2.*vA - 1.);
        // ---- veins: radial mains, finer ones toward the rim, feather barbs running out from each rib
        float wob = vnoise(vec2(vPleat*3.1 + vSeed*9., vRho*0.06)) - 0.5;
        float vMain = lineAA(vA*uVeins + 0.5 + wob*0.22, 0.045);
        float vFine = lineAA(vA*uVeins*3. + 0.5 + wob*0.5, 0.07)*smoothstep(0.3, 0.65, rr);
        float vBarb = lineAA(vRho*0.42 - tr*2.2 + wob*0.6, 0.09);
        float vein = max(vMain, max(vFine*0.6, vBarb*0.4));
        // ---- growth rings follow the scalloped rim
        float g = vR + 0.010*sin(vA*18.85 + vSeed*6.) + 0.004*wob;
        g = g*(0.55 + 0.45*g)*uRings;
        float band = 0.5 + 0.5*sin(g*6.2832 + vSeed*0.7);
        float ringL = lineAA(g + 0.25, 0.05);
        float grain = vnoise(vec2(vA*vSpacing*2.2 + vPleat*13., vRho*2.2));
        grain = mix(0.5, grain, 1. - smoothstep(0.25, 0.9, fwidth(vRho*2.2)));
        // ---- ocellus near the rim, sitting across the crease
        vec2 ep = vec2((vA - 0.5)*vSpacing/1.7, (vRho - uEyeRho)/3.0);
        float e = length(ep);
        float eyeOn = step(mod(vPleat + 0.5, max(uEyeEvery, 1.)), 1.)*step(0.5, uEyeEvery);
        float eyeM = (1. - smoothstep(0.92, 1.0, e))*eyeOn;
        vec3 alb, tcol;
        if (face > 0.) {
          // teal face: near-black indigo round the collar, indigo, then peacock teal to the rim
          vec3 cRoot = uIndigo*0.9 + uSlate*5.0;
          vec3 c = mix(cRoot, uIndigo*1.3 + uTeal*0.3 + uSlate*3.0, smoothstep(0.13, 0.33, rr));
          c = mix(c, uTeal*0.9, smoothstep(0.3, 0.78, rr));
          c = mix(c, mix(uTeal, uLemon, 0.4)*0.95, smoothstep(0.86, 1., vR)*0.55);
          c *= mix(1., 0.66, band*smoothstep(0.15, 0.45, rr));
          c *= 0.86 + 0.28*grain;
          c = mix(c, (uIndigo*0.07 + uSlate*0.05)*1.6, vein*0.62);
          c *= 1. - 0.3*ringL;
          vec3 ec = mix(uIndigo*0.12, uTeal*1.05 + uLemon*0.12, smoothstep(0.26, 0.34, e));
          ec = mix(ec, uIndigo*0.5, smoothstep(0.5, 0.56, e));
          ec = mix(ec, uGold*0.8, smoothstep(0.62, 0.68, e));
          ec = mix(ec, uRose*0.8, smoothstep(0.84, 0.88, e));
          c = mix(c, ec, eyeM);
          c = mix(c, uLemon*0.8, smoothstep(0.984, 0.994, vR));
          alb = c;
          // what the sun pushes through from behind: teal deepening inward, lemon at the thin rim
          vec3 t = mix(uTeal*1.25 + vec3(0., 0.02, 0.03), uLemon*1.05, smoothstep(0.68, 1.02, rr)*0.62);
          t = mix(uIndigo*1.3 + uTeal*0.35, t, smoothstep(0.26, 0.6, rr));
          t *= max(smoothstep(0.1, 0.34, rr), 0.3)*(1. - 0.78*vein)*mix(1., 0.6, band)*(1. - 0.35*ringL)*(0.8 + 0.4*grain);
          vec3 et = mix(uIndigo*0.15, uTeal*1.4, smoothstep(0.26, 0.34, e));
          et = mix(et, uIndigo*0.8, smoothstep(0.5, 0.56, e));
          et = mix(et, uGold*1.2, smoothstep(0.62, 0.68, e));
          et = mix(et, uRose*1.1, smoothstep(0.84, 0.88, e));
          tcol = mix(t, et, eyeM);
        } else {
          // gold reverse: matte overlapping scales
          vec2 sc = vec2(vA*vSpacing/0.85, vRho/0.85);
          float fy = fwidth(sc.y);
          sc.x += 0.5*floor(sc.y);
          vec2 f = fract(sc);
          float scale = mix(0.72 + 0.4*f.y - 0.25*abs(f.x - 0.5), 0.9, smoothstep(0.2, 0.7, fy));
          vec3 amber = uGold*vec3(0.62, 0.42, 0.5) + uRose*0.05;
          vec3 c = mix(uGold*0.1 + uIndigo*0.1, amber, smoothstep(0.1, 0.36, rr));
          c = mix(c, uGold*0.74, smoothstep(0.3, 0.7, rr));
          c = mix(c, mix(uGold, uLemon, 0.45)*0.74, smoothstep(0.78, 1., vR));
          c *= 1. - 0.3*ringL;
          c *= scale*mix(1., 0.62, band)*(0.84 + 0.32*grain);
          c = mix(c, uLemon*0.72, vein*0.28 + smoothstep(0.984, 0.994, vR)*0.6);
          c = mix(c, c*vec3(0.55, 0.45, 0.6), eyeM*(1. - smoothstep(0.3, 0.6, e))*0.6);
          alb = c;
          tcol = uGold*0.4*smoothstep(0.1, 0.5, rr)*(1. - 0.6*vein);
        }
        float ndl = dot(N, uSunDir);
        float dif = max(ndl, 0.), tra = max(-ndl, 0.);
        float fwd = max(dot(-V, uSunDir), 0.); fwd *= fwd;
        float ao = face > 0. ? 1. - 0.38*tr*vOpen : 0.62 + 0.38*tr;
        vec3 col = alb*(uSunCol*dif + (hemi(N) + uGndCol*1.5 + uBounce*0.7)*ao);
        col += tcol*uSunCol*tra*uGlow*(0.75 + 0.6*fwd*fwd);
        vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.));
        float sp = pow(max(dot(N, H), 0.), 26.)*step(0., ndl)*step(0., face);
        col += uSunCol*mix(vec3(1.), uTeal*1.5, 0.6)*sp*0.22;
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function Q(o,n){if(o<=n[0][0])return n[0][1];for(let s=1;s<n.length;s++)if(o<=n[s][0]){const r=(o-n[s-1][0])/(n[s][0]-n[s-1][0]);return G(n[s-1][1],n[s][1],r*r*(3-2*r))}return n[n.length-1][1]}const Ae=(o,n)=>Math.sqrt(Math.max(1-Math.pow(1-Math.min(o/n,(1-o)/n,1),2),4e-4)),x=(o,n,s)=>new i.Vector3(o,n,s);async function pe(o,n,s,r=0){const m=async()=>{o.yield&&await o.yield()},f=Se(),A=o.noise,b=n.noiseSeed;r&&(f.lod=r);const d=(a,e,t)=>{const l=A.fbm3(a.x*.05+b,a.y*.07,a.z*.05,3),v=A.n3(a.x*.33,a.y*.33+b,a.z*.33);let g=O(W(s.slate,3.8),W(s.indigo,.5),$(.3+.45*l,0,1));return g=W(g,(.85+.22*v)*e),O(g,W(s.bone,.36),$(t*(.1+.5*l),0,.22))},u=(a,e)=>W(O(W(s.bone,.52),W(s.slate,3.2),$(.3+.5*A.n3(a.x*.4,a.y*.4,a.z*.4+b),0,1)*.55),e),h=n.bodyLen,w=n.bodyW,p=new i.CatmullRomCurve3([x(0,7.5,6),x(0,11,-12),x(0,10.6,-.42*h),x(0,8.2,-.72*h),x(0,5.2,-h)],!1,"centripetal"),y=[[0,7],[.18,17*w],[.34,15.5*w],[.55,16.5*w],[.8,9.5*w],[1,3.6]],F=[[0,6.5],[.18,11],[.34,9.6],[.55,10.2],[.8,6.6],[1,3]];await ae(f,{curve:p,n:72,sides:44,floor:.25,Y:m,shape:(a,e)=>{const t=Ae(a,.07),l=Math.cos(e),v=Math.sin(e),g=A.fbm3(l*1.4+b,v*1.4,a*9,3),M=.035*Math.sin(a*70+2.5*A.n2(a*6,e))*Math.abs(v),k=t*(1+.09*g+M),z=1+.16*Math.pow(Math.max(l,0),9)*(.6+.4*Math.sin(a*46));return[Q(a,y)*k*(1.08-.1*l),Q(a,F)*k*z*(l<0?.9:1)]},color:(a,e,t)=>{const l=Math.cos(e),v=.82+.18*Math.sin(a*46+1.2*Math.sin(e*2));let g=d(t,(.72+.28*R(-.7,.5,l))*v,R(.45,.95,l));const M=Math.pow(Math.max(l,0),14)*R(.2,.6,Math.sin(a*46));return O(g,u(t,.9),M*.8)},aux:(a,e)=>[Math.abs(Math.sin(e))*R(.08,.3,a)*(1-R(.6,.9,a)),0,Math.pow(Math.max(Math.cos(e),0),14)*.6]}),await m(),Y(f,{pts:[x(0,15,-7),x(0,18.5,-3.5),x(0,20.6,-.6),x(0,22.2,0)],n:10,sides:16,ref:x(0,0,1),shape:a=>[G(8,4.4,a),G(6.5,2.9,a)],color:(a,e,t)=>O(d(t,.9,0),u(t,.85),R(.35,.9,a)),aux:a=>[0,0,a]});for(const a of[-1,1])Y(f,{pts:[x(a*7.9,24.6,-.4),x(a*10.5,22.5,-5),x(a*12.5,19.5,-11),x(a*12,15,-18)],n:12,sides:8,shape:e=>{const t=G(1.5,2.9,e*e)*(1+.35*B(e,.38,.1));return[t,t*1.2]},color:(e,t,l)=>O(u(l,.9),d(l,.9,0),R(.5,.95,e)),aux:e=>[0,0,1-e]}),Y(f,{pts:[x(a*7.6,35.2,-1.8),x(a*5.5,30.5,-9),x(a*2.4,25.5,-18),x(a*.8,20.5,-27)],n:12,sides:6,shape:e=>{const t=G(.95,1.5,e)*(1+.4*B(e,.5,.08));return[t,t]},color:(e,t,l)=>O(u(l,.8),d(l,.85,0),R(.6,1,e)),aux:e=>[0,0,1-e]});await m();const N=9.3,I=n.bosses*3;await ae(f,{curve:{getPoint(a,e){const t=a*Math.PI*2;return e.set(N*Math.sin(t),ee+N*Math.cos(t),0)},getTangent(a,e){const t=a*Math.PI*2;return e.set(Math.cos(t),-Math.sin(t),0)}},n:r?64:300,sides:r?7:12,ref:x(0,0,1),keep:!0,Y:m,shape:(a,e)=>{const t=a*Math.PI*2,l=.5-.5*Math.cos(t),v=.5+.5*Math.cos(t*I),g=Math.pow(v,10),M=(1+.08*(1-v)-.17*g)*(1+.2*l*l),k=1/Math.pow(Math.pow(Math.abs(Math.sin(e)),4)+Math.pow(Math.abs(Math.cos(e)),4),.25),z=1+.13*B(e,.95,.3)+.1*B(e,2.2,.3);return[1.85*M*k*z,2.5*M*k*z]},color:(a,e,t)=>{const l=a*Math.PI*2,v=.5+.5*Math.cos(l*I),g=Math.pow(v,10),M=R(.5,1.25,-e)*(1-R(2.3,2.9,-e)),k=B(e,.25,.22)*Math.pow(1-v,6);let z=u(t,.92+.14*B(e,.95,.3));return z=O(z,W(s.slate,1.6),$(.8*g+.7*k,0,.85)),O(z,W(s.indigo,.1),M*.9)},aux:()=>[0,0,1]}),await m(),r||Y(f,{curve:{getPoint(a,e){const t=a*Math.PI*2;return e.set(7.72*Math.sin(t),ee+7.72*Math.cos(t),.2)},getTangent(a,e){const t=a*Math.PI*2;return e.set(Math.cos(t),-Math.sin(t),0)}},n:96,sides:8,ref:x(0,0,1),shape:()=>[.5,1.5],color:(a,e,t)=>W(O(s.indigo,s.slate,.3),.3+.08*A.n3(t.x,t.y,t.z)),aux:()=>[0,0,1]}),await m();const _=async(a,e,t,l,v,g=!0,M=13)=>{const z=(C,H)=>{const D=Math.cos(H),J=Math.pow(Math.max(D,0),3.2),j=C*M+.35,Z=j-Math.floor(j);let K=R(.02,.2,Z)*(1-R(.86,.98,Z))*(.45+.55*Z);return K*=R(.03,.1,C)*(1-R(.9,.96,C)),J*K},E=C=>{let H=0;for(const D of v)H+=B(C,D,.04);return Math.min(H,1)};await ae(f,{pts:a,n:f.lod||!g?t:t*3,sides:f.lod||!g?l:l+6,ref:void 0,Y:m,shape:(C,H)=>{let D=Q(C,e);for(const Z of v)D*=1+.3*B(C,Z,.04)-.13*B(C,Z-.085,.035)-.13*B(C,Z+.085,.035);D*=1+.05*A.n3(C*12+b,Math.cos(H)*2,Math.sin(H)*2);const J=.045*Math.pow(Math.abs(Math.sin(H*3)),3)*(1-E(C))*(1-R(-.5,.1,Math.cos(H))),j=z(C,H);return[D*(1+J+.1*j),D*1.12*(1+J+.42*j)]},color:(C,H,D)=>{const J=Math.cos(H),j=z(C,H),Z=E(C);let K=d(D,(.62+.3*R(-.8,.6,J))*(1-.3*R(.02,.3,j)*(1-R(.3,.6,j))),0);return K=O(K,u(D,.8),Z*.75*R(-.2,.7,J)),O(K,u(D,.98),R(.25,.6,j)*.92)},aux:(C,H)=>[0,0,Math.max(E(C),R(.25,.6,z(C,H)))]})},L=(a,e,t)=>{for(let l=-1;l<=1;l++){const v=e+l*.62,g=Math.sin(v),M=Math.cos(v),k=t*(l===0?1.15:.92);Y(f,{pts:[x(a.x-g*1.2,a.y+.9,a.z-M*1.2),x(a.x+g*k*.4,2.3,a.z+M*k*.4),x(a.x+g*k*.8,1,a.z+M*k*.8),x(a.x+g*k,.25,a.z+M*k)],n:12,sides:8,floor:.05,shape:z=>{const E=G(1.35,.42,z)*(1+.3*B(z,.42,.07))*(z>.82?G(1,.12,(z-.82)/.18):1);return[E,E*.9]},color:(z,E,C)=>O(d(C,.8,0),u(C,.95),Math.max(R(.74,.86,z),B(z,.42,.06)*.6)),aux:z=>[0,0,R(.74,.86,z)]})}},V=n.footX,T=n.footZ;for(const a of[-1,1])await _([x(a*11,12,-11),x(a*25,17.5,-6),x(a*(V-8),21.5,3),x(a*(V-1),11,T-9),x(a*V,2.2,T-1)],[[0,8.2],[.3,5.4],[.55,4.2],[.8,2.9],[1,2.3]],30,14,[.52,.8,.97]),await m(),L(x(a*V,1.4,T),a*.22,7.6),Y(f,{pts:[x(a*(V-8.5),22.5,2.5),x(a*(V-6.5),25.6,3.6),x(a*(V-3.2),27.6,5.4)],n:8,sides:7,shape:e=>{const t=G(2.3,.12,Math.pow(e,.8));return[t,t*1.2]},color:(e,t,l)=>O(d(l,.9,0),u(l,.95),R(.1,.5,e)),aux:e=>[0,0,e]});await m(),await _([x(0,6.5,-h+8),x(0,11.5,-h-7),x(0,13.5,-h-15),x(0,6,-h-21),x(0,1.9,-h-24.5)],[[0,6],[.4,4],[.6,3.4],[1,2.4]],26,14,[.55,.97],!1),await m();for(let a=0;a<n.plates;a++){const e=G(.24,.9,a/(n.plates-1)),t=p.getPoint(e),l=t.y+Q(e,F)*1.08,v=(.75+.5*Math.sin(a*1.9+b))*G(1.25,.6,a/n.plates);Y(f,{pts:[x(0,l-1.2,t.z+1.2),x(0,l+1.8*v,t.z+.2),x(0,l+4.6*v,t.z-2.6*v)],n:7,sides:8,ref:x(0,0,1),shape:g=>[G(.75,.08,g),G(2.6*v,.15,Math.pow(g,.7))],color:(g,M,k)=>O(d(k,.9,0),u(k,.9),R(.15,.6,g)),aux:g=>[0,0,g]})}return L(x(0,1.4,-h-25),Math.PI,6.6),f}function ge(o,n,s,r){const m=o.noise,f=n.noiseSeed,A=n.headX,b=n.headZ,d=n.headLen,u=n.headYaw,h=x(-Math.sin(u),0,Math.cos(u)),w=x(Math.cos(u),0,Math.sin(u)),p=(e,t)=>{const l=m.fbm3(e.x*.07+f,e.y*.09,e.z*.07,3),v=m.n3(e.x*.45,e.y*.45+f,e.z*.45);return W(O(W(s.slate,3.8),W(s.indigo,.5),$(.3+.45*l,0,1)),(.85+.22*v)*t)},y=W(s.bone,.5),F=[[0,2.5],[.22,2.9],[.5,2.05],[.82,1.1],[1,.18]],N=[[0,2.5],[.22,2.65],[.5,1.75],[.82,.9],[1,.16]],I=x(A,0,b),c=I.clone().addScaledVector(h,-.6);c.y=2.7,Y(r,{pts:[x(3,9,3),x(13,14.6,12),x(A*.68,13.8,b*.56),x(A*.93,8,b*.83),c],n:46,sides:18,floor:.2,shape:(e,t)=>{const l=Math.cos(t);let v=Q(e,[[0,5.4],[.3,4.3],[.7,3.1],[1,2.25]]);v*=1+.045*m.n3(e*14+f,l*2,Math.sin(t)*2)+.03*Math.sin(e*90)*Math.abs(Math.sin(t));const g=1+.22*Math.pow(Math.max(l,0),14)*Math.pow(.5+.5*Math.sin(e*62),2);return[v,v*1.08*g]},color:(e,t,l)=>{const v=Math.cos(t),g=(1-R(-.75,-.1,v))*R(.5,.64,e)*(1-R(.93,1,e));let M=p(l,(.74+.26*R(-.6,.6,v))*(.85+.15*Math.sin(e*90)));M=O(M,y,Math.pow(Math.max(v,0),22)*Math.pow(.5+.5*Math.sin(e*62),3)*.6);const k=.78+.22*Math.sin(t*14);return O(M,W(s.rose,.6*k),g)},aux:(e,t)=>{const l=Math.cos(t),v=(1-R(-.75,-.1,l))*R(.5,.64,e)*(1-R(.93,1,e));return[.35*R(.1,.4,e)*(1-R(.8,1,e)),v,Math.pow(Math.max(l,0),10)*.5]}});const P=[];for(let e=0;e<=6;e++){const t=e/6,l=I.clone().addScaledVector(h,t*d);l.y=Q(t,N)*.96+.12,P.push(l)}Y(r,{pts:P,n:30,sides:22,floor:.05,shape:(e,t)=>{const l=Math.cos(t),v=Math.sin(t),g=e<.06?.85+.15*(e/.06):1;let M=Q(e,F)*(.76+.24*(1-l))*g,k=Q(e,N)*g;k*=1+.2*Math.pow(Math.max(l,0),10)*B(e,.2,.2);const z=B(e,.3,.09)*B(Math.abs(t),.85,.3);M*=1+.2*z,k*=1+.16*z;const E=B(e,.16,.12)*B(Math.abs(t),1.9,.4);return M*=1+.12*E,M*=1-.07*B(Math.abs(t),2.15,.1)*R(.25,.4,e),[M*(1+.02*m.n3(e*9,l*2+f,v*2)),k]},color:(e,t,l)=>{const v=Math.cos(t);let g=p(l,.72+.3*R(-.6,.7,v));const M=B(Math.abs(t),2.15,.08)*R(.22,.4,e);g=W(g,1-.6*M),g=O(g,y,Math.max(Math.pow(Math.max(v,0),12)*B(e,.2,.2),R(.86,1,e))*.75);const k=B(e,.9,.02)*B(Math.abs(t),.6,.18);return W(g,1-.75*k)},aux:(e,t)=>[0,0,R(.86,1,e)]});const _=n.crest,L=I.clone().addScaledVector(h,.13*d);L.y=Q(.13,N)*1.9;for(let e=0;e<_;e++){const t=(e-(_-1)/2)*(1.5/_),l=(4.6-1.4*Math.abs(t))*(.9+.2*Math.sin(e*2.3+f)),v=w.clone().multiplyScalar(Math.sin(t)*.95).addScaledVector(h,-.7);v.y=Math.cos(t)*.85,v.normalize();const g=L.clone().addScaledVector(w,Math.sin(t)*1.5);g.y-=.7+.5*Math.abs(Math.sin(t));const M=g.clone().addScaledVector(v,l*.5);M.y+=.25;const k=g.clone().addScaledVector(v,l).addScaledVector(h,-l*.18);Y(r,{pts:[g,M,k],n:8,sides:6,shape:z=>{const E=G(.42,.14,z)*(1+.9*B(z,.93,.07));return[E*1.5,E]},color:z=>O(O(y,W(s.slate,3),.5*(1-z)),W(s.rose,.6),R(.78,.92,z)),aux:z=>[0,0,1]})}const V=[],T=.3,a=I.clone().addScaledVector(h,T*d);for(const e of[-1,1]){const t=a.clone().addScaledVector(w,e*Q(T,F)*.9);t.y=Q(T,N)*1.22;const l=w.clone().multiplyScalar(e*.86).addScaledVector(h,.2);l.y=.42,l.normalize(),V.push({c:t,n:l})}return{eyes:V,headDir:h,headBase:I}}function ke(o){const n=[],s=[],r=[],m=[],f=(w,p)=>{const y=n.length/3,F=w.attributes.position,N=w.attributes.normal;for(let c=0;c<F.count;c++)n.push(F.getX(c),F.getY(c),F.getZ(c)),s.push(N.getX(c),N.getY(c),N.getZ(c)),r.push(p[0],p[1]);const I=w.index;for(let c=0;c<I.count;c++)m.push(y+I.getX(c));w.dispose()},A=new i.Quaternion,b=new i.Matrix4,d=x(1,1,1),u=x(0,0,1);o.forEach((w,p)=>{A.setFromUnitVectors(u,w.n);const y=new i.TorusGeometry(1.06,.27,10,40);y.applyMatrix4(b.compose(w.c,A,d)),f(y,[0,p]);const F=new i.TorusGeometry(1.42,.2,8,40);F.applyMatrix4(b.compose(w.c.clone().addScaledVector(w.n,-.12),A,d)),f(F,[2,p]);const N=new i.SphereGeometry(1,24,16);N.applyMatrix4(b.compose(w.c.clone().addScaledVector(w.n,-.42),A,d)),f(N,[1,p])});const h=new i.BufferGeometry;return h.setAttribute("position",new i.Float32BufferAttribute(n,3)),h.setAttribute("normal",new i.Float32BufferAttribute(s,3)),h.setAttribute("aKind",new i.Float32BufferAttribute(r,2)),h.setIndex(m),h}function Re(o){return new i.ShaderMaterial({uniforms:o,fog:!0,vertexShader:`
      attribute vec2 aKind;
      varying vec3 vN, vWPos, vLN; varying vec2 vKind;
      #include <fog_pars_vertex>
      void main(){
        vec4 wp = modelMatrix*vec4(position, 1.);
        vWPos = wp.xyz; vN = mat3(modelMatrix)*normal; vLN = normal; vKind = aKind;
        vec4 mvPosition = viewMatrix*wp;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSlate, uIndigo, uGold, uLemon, uRose;
      uniform vec3 uLook0, uLook1; uniform float uTime;
      varying vec3 vN, vWPos, vLN; varying vec2 vKind;
      #include <fog_pars_fragment>
      ${oe}
      void main(){
        vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
        vec3 V = normalize(cameraPosition - vWPos);
        vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.));
        float ndl = dot(N, uSunDir), nh = max(dot(N, H), 0.);
        vec3 col;
        if (vKind.x < 0.5) {                      // rose eye-ring, wrinkled
          float w = 0.85 + 0.15*sin(atan(vLN.y, vLN.x + 1e-4)*22.);
          vec3 alb = uRose*vec3(0.62, 0.5, 0.5)*w;
          col = alb*(uSunCol*max(ndl, 0.) + hemi(N)) + uSunCol*pow(nh, 20.)*0.08;
        } else if (vKind.x > 1.5) {               // bony orbit
          vec3 alb = uSlate*2.2 + uIndigo*0.1;
          col = alb*(uSunCol*max(ndl, 0.) + hemi(N));
        } else {                                  // the eye: dark globe, gold iris, pupil that follows the camera
          vec3 look = vKind.y < 0.5 ? uLook0 : uLook1;
          vec3 ln = normalize(vLN + vec3(0., 1e-5, 0.));
          float c = dot(ln, look);
          float fib = 0.75 + 0.25*sin(atan(ln.y - look.y, ln.x - look.x + 1e-4)*40.);
          vec3 alb = uIndigo*0.05 + uSlate*0.04;
          alb = mix(alb, mix(uGold*0.85, uLemon*0.8, smoothstep(0.80, 0.93, c))*fib, smoothstep(0.76, 0.80, c));
          alb = mix(alb, vec3(0.004, 0.004, 0.008), smoothstep(0.925, 0.94, c));
          col = alb*(uSunCol*max(ndl, 0.) + hemi(N));
          float fr = 1. - max(dot(N, V), 0.); fr = fr*fr*fr;
          vec3 R = reflect(-V, N);
          col += hemi(R)*(0.05 + 0.5*fr);
          col += uSunCol*pow(nh, 140.)*step(0., ndl)*1.6;
        }
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function xe(o){return new i.ShaderMaterial({uniforms:o,fog:!0,vertexShader:`
      attribute vec3 aColor, aAux;
      uniform float uTime, uThroat;
      varying vec3 vN, vWPos, vOP, vON, vCol, vAux, vM0, vM1, vM2;
      #include <fog_pars_vertex>
      void main(){
        float breath = 0.5 + 0.5*sin(uTime*0.42);
        float swell = aAux.x*(0.25 + 0.75*breath)*0.9 + aAux.y*(0.25 + uThroat*(1.15 + 0.3*sin(uTime*1.6)));
        vec3 p = position + normal*swell;
        vec4 wp = modelMatrix*vec4(p, 1.);
        vWPos = wp.xyz; vN = mat3(modelMatrix)*normal; vOP = position; vON = normal; vCol = aColor; vAux = aAux;
        vM0 = modelMatrix[0].xyz; vM1 = modelMatrix[1].xyz; vM2 = modelMatrix[2].xyz;
        vec4 mvPosition = viewMatrix*wp;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSlate, uIndigo, uLemon, uRose, uBounce; uniform float uThroat, uHideGain, uElder;
      varying vec3 vN, vWPos, vOP, vON, vCol, vAux, vM0, vM1, vM2;
      #include <fog_pars_fragment>
      ${oe}
      float tri(vec3 p, vec3 w, float s){ return vnoise(p.yz*s)*w.x + vnoise(p.xz*s)*w.y + vnoise(p.xy*s)*w.z; }
      float plateH(vec3 p, vec3 w){
        return 0.5*smoothstep(0.0, 0.075, abs(tri(p, w, 0.42) - 0.5)) + 0.2*smoothstep(0.0, 0.11, abs(tri(p + 31.7, w, 1.9) - 0.5));
      }
      void main(){
        vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
        vec3 V = normalize(cameraPosition - vWPos);
        vec3 w = normalize(vON + vec3(0., 1e-5, 0.)); w = w*w;
        float g1 = tri(vOP, w, 0.42), g2 = tri(vOP + 31.7, w, 1.9), g3 = tri(vOP - 12.3, w, 6.5);
        float crack = 1. - smoothstep(0.0, 0.045, abs(g1 - 0.5));       // plate boundaries
        float crack2 = 1. - smoothstep(0.0, 0.06, abs(g2 - 0.5));
        // the hide is broken into raised plates: the seams are grooves with a lit and a shaded lip, not drawn lines
        float px = length(fwidth(vOP));
        float relief = (1. - smoothstep(0.12, 0.7, px))*(1. - 0.75*vAux.z)*(1. - vAux.y);
        // heights are sampled a pixel apart along the surface (not taken from screen derivatives, which come in 2x2 blocks)
        vec3 nO = normalize(vON + vec3(0., 1e-5, 0.));
        vec3 t1 = normalize(cross(nO, abs(nO.y) < 0.9 ? vec3(0., 1., 0.) : vec3(1., 0., 0.)));
        vec3 t2 = cross(nO, t1);
        float e = max(px*0.9, 0.03);
        float h0 = plateH(vOP, w);
        vec3 gradO = ((plateH(vOP + t1*e, w) - h0)*t1 + (plateH(vOP + t2*e, w) - h0)*t2)/e;
        N = normalize(mat3(vM0, vM1, vM2)*normalize(nO - gradO*relief) + vec3(0., 1e-6, 0.));
        vec3 alb = vCol*mix(0.66 + 0.36*g2 + 0.36*g3, 0.88 + 0.08*g2 + 0.14*g3, vAux.z);
        alb *= 1. - 0.56*crack*(1. - vAux.z) - 0.3*crack2*(1. - vAux.y);
        alb *= 1. + 0.16*(smoothstep(0.03, 0.12, abs(g1 - 0.5)) - 0.5)*(1. - vAux.z);        // plate crowns worn paler than their edges
        alb = mix(alb, uRose*mix(0.62, 0.8, uElder)*(0.8 + 0.3*g3), vAux.y*uThroat*mix(0.45, 0.9, uElder));   // an elder's throat (uElder 1): the rose slot at 0.8 over nine tenths of the patch; the Great Fan's (0) is live's
        float ndl = dot(N, uSunDir);
        float dif = max(ndl, 0.);
        float wrap = clamp(ndl*0.5 + 0.5, 0., 1.);
        // hide is pale slate, not ink: lift it. The Great Fan's (uElder 0) is pulled toward grey so the shaded side stays blue-slate: live's line whole. On an elder (uElder 1) "bare" is 1 on bare hide and 0 on bone, told by the base colour the builder wrote: the share of it that lies outside the slate and indigo slots, counted in the lemon slot (the dusted hide of the back holds under 0.09 of it, every plate, knuckle, claw and crest over 0.12; the throat patch counts as hide from 0.07 of its mask). Bare hide is pulled, by the same weight, toward the slate and indigo slots in equal parts (the suitors' hide) at the same strength and lifted 0.93 of the Great Fan's; bone keeps live's grey pull and live's lift of 0.72; the rose throat is left whole, outside the pull and the lift
        float bare = uElder*max(1. - smoothstep(0.09, 0.12, abs(dot(vCol, cross(uSlate, uIndigo)))/max(abs(dot(uLemon, cross(uSlate, uIndigo))), 1e-6)), smoothstep(0., 0.07, vAux.y)); alb = mix(alb, mix(vec3(dot(alb, vec3(0.3, 0.5, 0.2)))*vec3(0.96, 1., 1.1), mix((uSlate*0.5 + uIndigo*0.5)*(dot(alb, vec3(0.3, 0.5, 0.2))/max(dot(uSlate*0.5 + uIndigo*0.5, vec3(0.3, 0.5, 0.2)), 1e-4)), alb, vAux.y), bare), 0.6*(1. - vAux.z))*mix(mix(uHideGain*mix(1., 0.93/0.72, bare), 1.7, vAux.z), 1., vAux.y*uElder);
        // the sun stands behind the fan, so the animal is lit by what surrounds it: the bright sun-side sky
        // (a broad warm source high on the left), the lit plain bouncing up from below, the sky above
        vec3 L2 = normalize(vec3(uSunDir.x, uSunDir.y + 0.62, -0.3*uSunDir.z) + vec3(0., 1e-4, 0.));
        float glow = clamp((dot(N, L2) + 0.35)/1.35, 0., 1.); glow *= glow;
        float under = clamp(0.6 - 0.6*N.y, 0., 1.);
        vec3 col = alb*(uSunCol*dif + uSunCol*0.5*glow + hemi(N)*(0.8 + 0.3*wrap) + uGndCol*1.1 + uBounce*under);
        vec3 H = normalize(uSunDir + V + vec3(0., 1e-4, 0.));
        float gloss = mix(0.05, 0.16, vAux.z);
        col += uSunCol*pow(max(dot(N, H), 0.), mix(14., 34., vAux.z))*step(0., ndl)*gloss;
        float fr = 1. - max(dot(N, V), 0.); fr *= fr; fr *= fr;
        col += uSkyCol*fr*0.32;                                           // sky sheen on the turned-away hide
        // rose skin glows faintly when the sun is behind it
        col += uRose*uSunCol*max(-ndl, 0.)*0.12*vAux.y;
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function ze(o,n,s){const r=new i.InstancedBufferGeometry;r.setAttribute("position",new i.Float32BufferAttribute([-1,0,0,0,-.7,0,1,0,0,0,.7,0],3)),r.setIndex([0,1,2,0,2,3]);const m=new Float32Array(s*4),f=new Float32Array(s*4),A=[];for(let u=0;u<7;u++)A.push([o.sign()*o.range(26,95),o.range(-30,60),o.range(5,10)]);for(let u=0;u<s;u++){const h=A[u%A.length],w=o()*Math.PI*2,p=h[2]*Math.sqrt(o());m.set([h[0]+Math.cos(w)*p,o()*90,h[1]+Math.sin(w)*p,o()*6.283],u*4),f.set([o.range(.6,1.5),o.range(.25,.6),o.range(.7,2.1),o()],u*4)}r.setAttribute("aSeed",new i.InstancedBufferAttribute(m,4)),r.setAttribute("aRnd",new i.InstancedBufferAttribute(f,4)),r.instanceCount=s,r.boundingSphere=new i.Sphere(new i.Vector3(0,45,0),150);const b=new i.ShaderMaterial({uniforms:n,fog:!0,side:i.DoubleSide,vertexShader:`
      attribute vec4 aSeed, aRnd; uniform float uTime;
      varying vec3 vN, vWPos; varying float vFade, vTone;
      #include <fog_pars_vertex>
      void main(){
        float y = mod(aSeed.y + uTime*aRnd.x*1.4, 90.);
        float fade = smoothstep(0., 8., y)*(1. - smoothstep(70., 90., y));
        float a = uTime*aRnd.z + aSeed.w, b = uTime*aRnd.z*0.63 + aSeed.w*2.;
        vec3 ax = vec3(cos(a), 0., sin(a)), up = vec3(sin(b)*0.6*-sin(a), cos(b*0.7)*0.8 + 0.2, sin(b)*0.6*cos(a));
        vec3 c = vec3(aSeed.x + sin(uTime*0.31 + aSeed.w)*2.2 + y*0.05, y, aSeed.z + cos(uTime*0.27 + aSeed.w*1.7)*2.2);
        vec3 p = c + (ax*position.x + up*position.y)*aRnd.y*fade;
        vec3 n = cross(ax, up);
        vec4 wp = modelMatrix*vec4(p, 1.);
        vWPos = wp.xyz; vN = mat3(modelMatrix)*n; vFade = fade; vTone = aRnd.w;
        vec4 mvPosition = viewMatrix*wp;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uGold, uLemon;
      varying vec3 vN, vWPos; varying float vFade, vTone;
      #include <fog_pars_fragment>
      ${oe}
      void main(){
        vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
        float ndl = dot(N, uSunDir);
        vec3 alb = mix(uGold*0.8, uLemon*0.72, vTone*0.5);
        vec3 col = alb*(uSunCol*(abs(ndl)*0.8 + 0.1) + hemi(N*sign(ndl + 1e-4)));
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),d=new i.Mesh(r,b);return d.frustumCulled=!1,d}function Ve(o){return`
float greatFanShadow(vec3 p, vec3 sunL, float unfurl){
  float lz = abs(sunL.z) < 1e-3 ? -1e-3 : sunL.z;
  float t = -p.z/lz;
  vec2 q = p.xy + sunL.xy*t - vec2(0., ${ee.toFixed(1)});
  float rho = length(q);
  float ang = atan(q.x, q.y + 1e-4);
  float halfA = ${o.spread.toFixed(4)}*mix(0.042, 1., clamp(unfurl, 0., 1.));
  float inside = step(0., t)*step(9., rho)*(1. - smoothstep(${(o.rim-6).toFixed(1)}, ${o.rim.toFixed(1)}, rho))*(1. - smoothstep(halfA, halfA + 0.01, abs(ang)));
  float a = fract((ang/max(halfA, 1e-3)*0.5 + 0.5)*${(o.nRibs-1).toFixed(1)});
  return inside*mix(0.42, 0.85, smoothstep(0.42, 0.58, a));
}`}async function Fe(o,n={}){const s=o.rng.fork?o.rng.fork("great-fan"):o.rng,r=(n.palette&&n.palette.length>=7?n.palette:le).map(S=>new i.Color(S)),m=$(n.detail??o.quality?.detail??1,.6,1),f=S=>[S.r,S.g,S.b],A={slate:f(r[0]),teal:f(r[1]),indigo:f(r[2]),gold:f(r[3]),lemon:f(r[4]),white:f(r[5]),rose:f(r[6])};A.bone=O(A.lemon,A.white,.5);const b=s.pick([57,61,61,65]),d=s.range(18.5,22),u={nRibs:b,spread:i.MathUtils.degToRad(s.range(82,87)),depth:s.range(2.3,3),rim:117,scallop:s.range(4.2,7),veins:s.pick([3,4,4,5]),rings:s.range(9,14),eyeEvery:s.pick([1,1,2,3]),eyeRho:s.range(93,100),knuckles:[1,2,3,4,5].map(S=>U+S*d).filter(S=>S<110),spatW:s.range(1.35,1.8),bodyLen:s.range(86,95),bodyW:s.range(.93,1.07),footX:s.range(44,50),footZ:s.range(27,33),headX:s.range(38,42),headZ:s.range(43,48),headLen:s.range(9.6,10.6),headYaw:s.range(.25,.45),bosses:s.pick([9,11,13]),plates:s.int(8,12),crest:s.pick([5,7]),flex:s.range(.004,.0075),wind:s.range(.8,1.25),noiseSeed:s.range(0,50),pleatSeeds:[]};for(let S=0;S<b-1;S++)u.pleatSeeds.push(s());const h=new i.Vector3(-.89,.191,-.415);n.sunDir&&h.copy(n.sunDir),h.normalize();const w=(S,q)=>S?new i.Color(S):q,p=i.UniformsUtils.merge([i.UniformsLib.fog,{uUnfurl:{value:1},uTime:{value:0},uSpread:{value:u.spread},uNR:{value:b-1},uFlex:{value:u.flex},uStripe:{value:new i.Vector2(-1e4,60)},uDepth:{value:u.depth},uRim:{value:u.rim},uScallop:{value:u.scallop},uWind:{value:u.wind},uVeins:{value:u.veins},uRings:{value:u.rings},uEyeEvery:{value:u.eyeEvery},uEyeRho:{value:u.eyeRho},uGlow:{value:n.glow??.8},uThroat:{value:1},uHideGain:{value:n.hideGain??2.9},uElder:{value:0},uBounce:{value:w(n.bounceColor,r[4].clone().multiplyScalar(.3))},uSunDir:{value:h.clone()},uSunCol:{value:w(n.sunColor,new i.Color(2,1.74,1.24))},uSkyCol:{value:w(n.skyColor,r[4].clone().multiplyScalar(.55))},uGndCol:{value:w(n.groundColor,new i.Color("#3A4763").multiplyScalar(.9))},uSlate:{value:r[0]},uTeal:{value:r[1]},uIndigo:{value:r[2]},uGold:{value:r[3]},uLemon:{value:r[4]},uRose:{value:r[6]},uBone:{value:r[4].clone().lerp(r[5],.5)},uLook0:{value:new i.Vector3(0,0,1)},uLook1:{value:new i.Vector3(0,0,1)}}]),y=new i.Group;y.name="great-fan";const F=new i.Mesh(fe(u),he(p));F.frustumCulled=!1,y.add(F),await o.yield?.();const N=new i.Mesh(ve(u),me(p));N.frustumCulled=!1,y.add(N),await o.yield?.();const I=await pe(o,u,A);await o.yield?.();const c=ge(o,u,A,I);await o.yield?.();const P=await ue(I,async()=>{await o.yield?.()});await o.yield?.();const _=new i.Mesh(P,xe(p));y.add(_),await o.yield?.();const L=new i.Mesh(ke(c.eyes),Re(p));y.add(L);const V=ze(s,p,Math.round(320*m));y.add(V);for(const S of[F,N,_,L,V])S.material.uniforms=p;let T=n.autoplay===!1,a=T?0:1,e=-1e4,t=120,l=1,v=null;const g=new i.Quaternion,M=new i.Vector3,k=new i.Vector3,z=new i.Vector3,E=[p.uLook0.value,p.uLook1.value];c.eyes.forEach((S,q)=>E[q].copy(S.n));const C=Math.cos(i.MathUtils.degToRad(52)),H=Math.sqrt(1-C*C);let D=!1,J=!1,j=a;const Z=new i.Vector3,K={object:y,radius:128,height:153,center:new i.Vector3(0,62,0),ground:!0,groundY:0,uniforms:p,params:u,shadowGLSL:Ve(u),anchors:{portalSeat:{position:new i.Vector3(0,ee,0),normal:new i.Vector3(0,0,1),radius:7},hub:new i.Vector3(0,ee,0),flyThrough:[[0,8,216],[0,8.5,170],[0,14,128],[0,26,92],[0,30,80],[0,30,40],[0,30,0]].map(S=>new i.Vector3(...S)),head:new i.Vector3(u.headX,2.2,u.headZ+3),eye:c.eyes[0].c.clone(),mastTop:new i.Vector3(0,153,0),viewpoints:{front:new i.Vector3(0,8,216),frontHigh:new i.Vector3(-60,70,260),sunSide:new i.Vector3(-190,40,150),back:new i.Vector3(120,50,-230)},footprints:[[0,-u.bodyLen*.45,62],[u.footX,u.footZ+2,14],[-u.footX,u.footZ+2,14],[0,-u.bodyLen-26,13],[u.headX*.7,u.headZ*.65,22],[u.headX-1,u.headZ+5,9]],sunDir:h.clone()},setUnfurl(S){T=!0,a=$(S,0,1)},setStripe(S,q=120){T=!0,e=S,t=q},setProgress(S){T=!0,a=$((S-.7)/.14,0,1),e=S>.868&&S<.932?G(-200,200,(S-.87)/.06):-1e4,t=120},setSun(S,q){v=(v||new i.Vector3).copy(S).normalize(),q&&p.uSunCol.value.copy(q)},setBounce(S){S&&p.uBounce.value.copy(S)},setFill(S,q){S&&p.uSkyCol.value.copy(S),q&&p.uGndCol.value.copy(q)},update(S,q,ne){if(p.uTime.value=q,!T){const X=(q%44+44)%44;a=X<4?0:X<12?(X-4)/8:X<36?1:X<42?1-(X-36)/6:0,e=X>19&&X<27?G(-200,200,(X-19.5)/7):-1e4}p.uUnfurl.value=a,p.uStripe.value.set(e,t*.5);const we=1-Math.exp(-Math.min(S,.1)*2.5),re=R(.3,1,a);if(!D||Math.abs(a-j)>.2?l=re:S>0&&(l+=(re-l)*we),j=a,S>0&&(D=!0),p.uThroat.value=l,y.updateWorldMatrix(!0,!1),v?p.uSunDir.value.copy(v):p.uSunDir.value.copy(h).applyQuaternion(y.getWorldQuaternion(g)).normalize(),ne){M.setFromMatrixPosition(ne.matrixWorld),y.worldToLocal(M);const X=1-Math.exp(-Math.min(S,.1)*4),be=!J||M.distanceToSquared(Z)>19600;Z.copy(M),S>0&&(J=!0),c.eyes.forEach((te,se)=>{k.copy(M).sub(te.c),k.lengthSq()<1e-6&&k.copy(te.n),k.normalize();const ie=k.dot(te.n);ie<C&&(z.copy(k).addScaledVector(te.n,-ie),z.lengthSq()<1e-8&&z.set(0,1,0).addScaledVector(te.n,-te.n.y),z.normalize(),k.copy(te.n).multiplyScalar(C).addScaledVector(z,H)),be?E[se].copy(k).normalize():S>0&&E[se].lerp(k,X).normalize()})}},dispose(){}};return K.update(0,0,null),K}async function Le(o,n,s={}){const r=ye((o.seed|0)*7919+4099*((s.seed|0)+1)>>>0),m=(s.palette&&s.palette.length>=7?s.palette:le).map(c=>new i.Color(c)),f=c=>[c.r,c.g,c.b],A={slate:f(m[0]),teal:f(m[1]),indigo:f(m[2]),gold:f(m[3]),lemon:f(m[4]),white:f(m[5]),rose:f(m[6])};A.bone=O(A.lemon,A.white,.5);const b=r.pick([23,25,25,27]),d={nRibs:b,spread:i.MathUtils.degToRad(r.range(79,85)),depth:r.range(3.6,4.6),rim:117,scallop:r.range(9,13),veins:r.pick([5,6,7]),rings:r.range(9,13),eyeEvery:r.pick([1,1,2]),eyeRho:r.range(88,95),knuckles:[1,2].map(c=>U+c*r.range(33,37)),spatW:r.range(2.8,3.6),bodyLen:r.range(68,78),bodyW:r.range(.95,1.1),footX:r.range(40,46),footZ:r.range(26,31),headX:r.range(36,40),headZ:r.range(40,45),headLen:r.range(13,15),headYaw:r.range(.25,.45),bosses:5,plates:r.int(5,7),crest:5,flex:r.range(.006,.01),wind:r.range(.9,1.35),noiseSeed:r.range(0,50),pleatSeeds:[]};for(let c=0;c<b-1;c++)d.pleatSeeds.push(r());const u=n.uniforms,h=Object.assign({},u,{uUnfurl:{value:1},uSpread:{value:d.spread},uNR:{value:b-1},uFlex:{value:d.flex},uStripe:{value:new i.Vector2(-1e4,60)},uDepth:{value:d.depth},uRim:{value:d.rim},uScallop:{value:d.scallop},uWind:{value:d.wind},uVeins:{value:d.veins},uRings:{value:d.rings},uEyeEvery:{value:d.eyeEvery},uEyeRho:{value:d.eyeRho},uThroat:{value:1},uHideGain:{value:(u.uHideGain?.value??2.9)*.72},uElder:{value:1}}),w=new i.Group;w.name="elder";const p=new i.Mesh(fe(d,!0),he(h));w.add(p);const y=new i.Mesh(ve(d,2,9),me(h));w.add(y),await o.yield?.();const F=await pe(o,d,A,s.lod??.34);await o.yield?.(),ge(o,d,A,F),await o.yield?.();const N=new i.Mesh(await ue(F),xe(h));w.add(N);for(const c of[p,y,N])c.material.uniforms=h;const I=s.scale??.4;return w.scale.setScalar(I),{object:w,uniforms:h,params:d,scale:I,height:153*I,hubY:ee*I,clear:58*I,setUnfurl(c){h.uUnfurl.value=$(c,0,1)},setStripe(c,P=120){h.uStripe.value.set(c,P*.5)}}}export{Le as buildElder,Fe as buildHero};
