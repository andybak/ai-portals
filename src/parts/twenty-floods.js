import*as r from"three";import{clamp as V,lerp as le,smoothstep as te}from"../kit/core.js";const de=["#6FB4E0","#F6EFE0","#D9A95B","#8C5A32","#2FA36B","#4B3A7A","#FFD25A"],k=115,O=146,ue=13,pe=`
uniform float uCourse, uLineY, uRampHead, uTime, uFlow, uSmear, uCap, uSite, uSide, uRoadW, uDustY, uWind;
uniform vec4 uDim;      // half width, height, capstone base y, course height
uniform vec3 uMirror;   // unused, plane y, ripple
uniform vec3 uRamp[${ue}];
attribute vec4 aD;
varying vec3 vLp; varying vec4 vD; varying vec3 vNl;
vec3 rampAt(float s){ s = clamp(s, 0.0, 11.999); int k = int(s); return mix(uRamp[k], uRamp[k + 1], s - float(k)); }
`,ve=`
vec3 objectNormal = vec3(normal);
#ifdef K_TEAM
  float tUp = step(0.0, aD.y);
  float tPh = fract(aD.x + uFlow*(0.016 + 0.008*aD.z)*(tUp*2.0 - 1.0));
  float tS = clamp(tPh*uRampHead, 0.0, 11.999);
  int tK = int(tS);
  vec3 tA = uRamp[tK], tB = uRamp[tK + 1];
  vec3 tDir = normalize(tB - tA + vec3(1e-4, 0.0, 0.0));
  vec3 tAx = tK == 0 ? vec3(uSide, 0.0, 0.0) : vec3(0.0, 0.0, 1.0);
  objectNormal = normalize(tDir*normal.x + vec3(0.0, 1.0, 0.0)*normal.y + tAx*normal.z);
#endif
vNl = objectNormal;
#ifdef K_MIRROR
  objectNormal = -objectNormal;
#endif
`,he=`
vec3 transformed = vec3(position);
vD = aD;
#ifdef K_CORE
  float cRise = smoothstep(0.0, 1.0, clamp((uCourse - aD.x)*2.2 - aD.z*1.2, 0.0, 1.0));
  transformed.y -= aD.y*(1.0 - cRise);
  if (cRise < 1e-3) transformed = vec3(0.0, 0.2, 0.0);
  vD = vec4(aD.x, aD.y > 1e-4 ? 1.0 : 0.0, cRise, aD.w);
#endif
#ifdef K_CASING
  float cy = aD.z > 0.5 ? clamp(uLineY, 0.0, uDim.z) : uDim.z;
  float chw = uDim.x*(1.0 - cy/uDim.y) - aD.w*3.0*smoothstep(0.0, 2.0, uDim.z - cy);
  transformed = vec3(aD.x*chw, cy - aD.w*0.05, aD.y*chw);
#endif
#ifdef K_RAMP
  transformed += rampAt(min(aD.x, uRampHead)) - rampAt(aD.x);
#endif
#ifdef K_SITE
  float sk = aD.w > 0.5 ? smoothstep(aD.z, aD.z + 0.12, uSite) : 1.0;
  transformed.xz = aD.xy + (transformed.xz - aD.xy)*sk; transformed.y *= sk;
#endif
#ifdef K_CAP
  transformed.xz *= smoothstep(0.0, 0.25, uCap);
  transformed.y += (1.0 - uCap)*(1.0 - uCap)*16.0;
#endif
#ifdef K_TEAM
  vec3 tC = mix(tA, tB, tS - float(tK));
  float tW = uRoadW*mix(1.0, 0.5, clamp(tC.y/uDim.y, 0.0, 1.0));
  float tLane = tUp > 0.5 ? 0.30 + 0.16*aD.z : 0.70 + 0.10*aD.z;
  float tLen = (tUp > 0.5 ? 3.6 : 2.6)*(1.0 + uSmear*2.5);
  // seen from far off a team is widened so the column never thins below a pixel or two: it reads as a thread of ants
  float tWide = clamp(length((modelViewMatrix*vec4(tC, 1.0)).xyz)/300.0, 1.0, 3.0);
  transformed = tC + tDir*(position.x*tLen) + vec3(0.0, position.y*(tUp > 0.5 ? 1.7 : 1.0)*tWide + 0.05, 0.0)
              + tAx*(tLane*tW + position.z*(tUp > 0.5 ? 2.2 : 1.3)*tWide);
  if (aD.w*12.0 > uRampHead) transformed = vec3(0.0, -4.0, 0.0);
  vD = vec4(position.x, tUp, aD.z, position.y);
#endif
#ifdef K_DUST
  float du = position.x, dv = position.y;
  float dW = mix(6.0, 34.0, pow(max(du, 0.0), 0.7));
  float dLift = 20.0*du*du + 5.0*sin(du*7.0 - uTime*0.6)*du;
  transformed = vec3(uWind*du*130.0, uDustY + 2.0 + dLift + dv*dW, sin(du*5.0 - uTime*0.4)*8.0*du);
  vD = vec4(du, dv, 0.0, 0.0);
#endif
vLp = transformed;
#ifdef K_MIRROR
  transformed.y = 2.0*uMirror.y - transformed.y;
  float mDep = uMirror.y - transformed.y;
  float mAmp = uMirror.z*smoothstep(0.0, 50.0, mDep);
  transformed.x += sin(mDep*0.23 + uTime*1.7)*mAmp;
  transformed.z += cos(mDep*0.19 + uTime*1.3)*mAmp;
#endif
`,xe=`
uniform float uCourse, uLineY, uTime, uGlint, uSmear, uGranite, uSeed, uBlaze, uDust;
uniform vec4 uDim;
uniform vec3 uMirrorTint, cCasing, cHoney, cMud, cShade, cGold;
varying vec3 vLp; varying vec4 vD; varying vec3 vNl;
float h21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + 1.0), f.x), f.y); }
float fbm(vec2 p){ return vn(p)*0.5 + vn(p*2.03 + 7.1)*0.3 + vn(p*4.1 + 3.7)*0.2; }
`,ye=`
#include <color_fragment>
{
  vec3 nl = normalize(vNl);
  float fu = abs(nl.x) > abs(nl.z) ? vLp.z : vLp.x;
  vec3 c = vec3(1.0);
#ifdef K_CORE
  float ci = vD.x, rowH = uDim.w*0.5, row = floor(vLp.y/rowH);
  float bx = fu/2.7 + h21(vec2(row, ci))*7.0;
  float aa = clamp(1.0 - fwidth(fu)/1.2, 0.0, 1.0);
  float tone = h21(vec2(floor(bx), row + uSeed));
  float joint = max(smoothstep(0.43, 0.5, abs(fract(bx) - 0.5)), smoothstep(0.42, 0.5, abs(fract(vLp.y/rowH) - 0.5)));
  float stain = fbm(vec2(fu*0.021 + uSeed, vLp.y*0.034));
  float streak = fbm(vec2(fu*0.12, vLp.y*0.013 + uSeed*3.0));
  c = cHoney*mix(0.66, 1.08, stain);
  c = mix(c, cMud, 0.3*smoothstep(0.5, 0.85, streak));
  c *= 1.0 + aa*((tone - 0.5)*0.24 - 0.28*joint*step(nl.y, 0.5));
  float fresh = 1.0 - clamp((uCourse - ci)/7.0, 0.0, 1.0);
  c = mix(c, cCasing*0.86, 0.62*fresh + 0.15*step(0.5, nl.y));
  c *= mix(cShade, vec3(1.0), mix(0.55, 1.0, smoothstep(0.0, 0.6, vD.y)));
#endif
#ifdef K_CASING
  float rowH = 1.46, row = floor(vLp.y/rowH);
  float bx = fu/3.1 + h21(vec2(row, 3.0))*5.0;
  float aa = clamp(1.0 - fwidth(vLp.y)/0.6, 0.0, 1.0);
  float tone = h21(vec2(floor(bx), row + uSeed));
  float joint = max(smoothstep(0.46, 0.5, abs(fract(bx) - 0.5)), smoothstep(0.45, 0.5, abs(fract(vLp.y/rowH) - 0.5)));
  float sheen = fbm(vec2(fu*0.014 + uSeed, vLp.y*0.021))*0.6 + fbm(vec2(fu*0.06, vLp.y*0.09 + uSeed))*0.4;
  // albedo stays near 0.75 so only the blaze exceeds 1; broad weathering bands, a haze-ward gradient
  // and wind-scour streaks keep the far face from reading as a paper cut-out
  float bandT = h21(vec2(floor(vLp.y/(rowH*6.0)), uSeed));
  float scour = fbm(vec2(fu*0.03 + vLp.y*0.012 + uSeed, vLp.y*0.004));
  c = cCasing*0.78*mix(0.84, 1.0, sheen)*(0.92 + 0.12*bandT)*mix(0.8, 1.05, smoothstep(0.0, uDim.y, vLp.y));
  c *= mix(vec3(0.9, 0.86, 0.8), vec3(1.0), smoothstep(0.3, 0.7, scour));
  c *= 1.0 - 0.13*smoothstep(0.42, 0.5, abs(fract(vLp.y/(rowH*6.0)) - 0.5));
  c *= 1.0 + aa*((tone - 0.5)*0.08 - 0.12*joint);
  c = mix(c, vec3(0.45, 0.2, 0.15)*mix(0.8, 1.1, sheen), step(vLp.y, uGranite));
  float band = (1.0 - smoothstep(0.0, 7.0, vLp.y - uLineY))*smoothstep(0.0, 4.0, uLineY);
  c = mix(c, cHoney*0.85, band*(0.35 + 0.4*h21(vec2(floor(fu/2.2), floor(vLp.y/2.0)))));
  c = mix(c, vec3(1.2, 1.17, 1.08), 0.85*(1.0 - smoothstep(0.0, 2.6, vLp.y - uLineY))*smoothstep(0.0, 4.0, uLineY));   // the working edge: fresh-cut stone, bright
  c = mix(c, cHoney*0.3, smoothstep(0.02, 0.2, vD.w));
#endif
#ifdef K_RAMP
  float top = smoothstep(0.6, 0.8, nl.y);
  float st = fbm(vec2(vLp.x*0.05 + uSeed, vLp.y*0.09 + vLp.z*0.05));
  vec3 wall = mix(cMud, cHoney, 0.08)*mix(0.85, 1.25, st);
  wall *= 0.88 + 0.12*step(0.5, fract(vLp.x/6.0));
  wall *= 1.0 - 0.1*step(0.5, fract(vLp.y/1.1))*clamp(1.0 - fwidth(vLp.y)/0.5, 0.0, 1.0);
  wall *= mix(0.74, 1.0, smoothstep(0.0, 0.5, vD.z));
  vec3 road = mix(cMud, cHoney, 0.3)*mix(0.95, 1.2, st);
  road *= 1.0 + 0.25*(1.0 - smoothstep(0.0, 0.12, vD.y)) + 0.35*smoothstep(0.9, 1.0, vD.y);
  c = mix(wall, road, top);
#endif
#ifdef K_TEAM
  float isBlock = step(vD.x, 0.1)*vD.y;
  vec3 haul = mix(vec3(0.1, 0.065, 0.05), cMud*0.8, step(0.5, fract(vD.x*7.0 + 0.2))*(1.0 - uSmear));
  c = mix(haul, cCasing*0.98, isBlock);
  c = mix(c, mix(cMud*0.35, cCasing*0.95, vD.y), uSmear*0.7);
#endif
#ifdef K_SITE
  vec2 g = vLp.xz/5.0; float tone = h21(floor(g) + uSeed);
  float aa = clamp(1.0 - fwidth(vLp.x)/2.0, 0.0, 1.0), pv = 1.0 - step(0.5, vD.w);
  float jt = max(smoothstep(0.45, 0.5, abs(fract(g.x) - 0.5)), smoothstep(0.45, 0.5, abs(fract(g.y) - 0.5)));
  c = mix(cHoney, cCasing, 0.55)*0.8*(1.0 + pv*aa*((tone - 0.5)*0.18 - 0.16*jt))*mix(0.8, 1.0, fbm(vLp.xz*0.03 + uSeed));
#endif
#ifdef K_DUST
  float dn = fbm(vec2(vD.x*mix(6.0, 2.6, uSmear) - uTime*0.45 + uSeed, vD.y*2.2 + vD.x*3.0));
  float da = smoothstep(0.3, 0.75, dn + 0.25*(1.0 - vD.x))*pow(clamp(1.0 - vD.x, 0.0, 1.0), 0.8)*smoothstep(0.0, 0.06, vD.x)*clamp(1.0 - vD.y*vD.y, 0.0, 1.0);
  diffuseColor.a *= da*uDust;
  c = mix(cCasing, cHoney, 0.3)*0.9;
#endif
#ifdef K_CAP
  c = cGold*0.85*(0.9 + 0.1*step(0.5, fract(vLp.y*0.9)));
#endif
#ifdef K_MIRROR
  c *= uMirrorTint;
#endif
  diffuseColor.rgb *= c;
}
`,we=`
#include <emissivemap_fragment>
#ifdef K_CAP
  totalEmissiveRadiance += cGold*(0.3 + 5.0*uGlint);
#endif
`,ge=`
#include <lights_fragment_end>
#if ( defined( K_CASING ) || defined( K_CAP ) ) && NUM_DIR_LIGHTS > 0
{
  float bl = max(dot(normal, directionalLights[0].direction), 0.0);
  bl *= bl; bl *= bl; bl *= bl;
  reflectedLight.directDiffuse *= 1.0 + uBlaze*bl;
}
#endif
`;function oe(e,s,i={}){const c=new r.MeshStandardMaterial({color:16777215,roughness:i.rough??.92,metalness:0,vertexColors:i.vc??!0});return c.defines={...c.defines,["K_"+s]:1},i.mirror&&(c.defines.K_MIRROR=1,c.side=r.BackSide,c.transparent=!0,c.depthWrite=!1),c.onBeforeCompile=l=>{Object.assign(l.uniforms,e),l.vertexShader=l.vertexShader.replace("#include <common>",`#include <common>
`+pe).replace("#include <beginnormal_vertex>",ve).replace("#include <begin_vertex>",he),l.fragmentShader=l.fragmentShader.replace("#include <common>",`#include <common>
`+xe).replace("#include <color_fragment>",ye).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
#ifdef K_DUST
  normal = normalize((viewMatrix*vec4(0.0, 1.0, 0.0, 0.0)).xyz);
#endif`).replace("#include <emissivemap_fragment>",we).replace("#include <lights_fragment_end>",ge)},c}function se(){return{p:[],n:[],c:[],d:[],i:[]}}function B(e,s,i,c,l,C,z,G,x,M,p){const f=e.p.length/3;e.p.push(s[0],s[1],s[2],i[0],i[1],i[2],c[0],c[1],c[2],l[0],l[1],l[2]);const u=Math.hypot(C[0],C[1],C[2])||1,y=C[0]/u,w=C[1]/u,A=C[2]/u;for(let m=0;m<4;m++)e.n.push(y,w,A),e.c.push(z[0],z[1],z[2]);e.d.push(G[0],G[1],G[2],G[3],x[0],x[1],x[2],x[3],M[0],M[1],M[2],M[3],p[0],p[1],p[2],p[3]);const o=i[0]-s[0],v=i[1]-s[1],h=i[2]-s[2],g=l[0]-s[0],b=l[1]-s[1],d=l[2]-s[2];(v*d-h*b)*y+(h*g-o*d)*w+(o*b-v*g)*A>=0?e.i.push(f,f+1,f+2,f,f+2,f+3):e.i.push(f,f+2,f+1,f,f+3,f+2)}function ce(e){const s=new r.BufferGeometry;return s.setAttribute("position",new r.Float32BufferAttribute(e.p,3)),s.setAttribute("normal",new r.Float32BufferAttribute(e.n,3)),s.setAttribute("color",new r.Float32BufferAttribute(e.c,3)),s.setAttribute("aD",new r.Float32BufferAttribute(e.d,4)),s.setIndex(e.p.length/3>65535?new r.Uint32BufferAttribute(e.i,1):new r.Uint16BufferAttribute(e.i,1)),s.boundingSphere=new r.Sphere(new r.Vector3(0,60,0),400),s}const ae=[[0,1],[1,0],[0,-1],[-1,0]];async function me(e,s,i,c,l){const C=se(),{N:z,Nc:G,h:x}=s,M=[0,1,0];for(let p=0;p<G;p++){l&&(p&3)===3&&await l();const f=p*x,u=k*(1-(p+1)/z)-.35,y=Math.max(1,Math.round(2*u/i)),w=Math.min(3,u),A=e(),o=.88+e()*.18;for(let d=0;d<4;d++){const T=ae[d][0],m=ae[d][1],a=-m,I=T,n=(L,R,W)=>[T*R+a*L,W,m*R+I*L];let D=-u;for(let L=0;L<y;L++){const R=L===y-1?u:-u+(L+1+(c?0:e.range(-.28,.28)))*(2*u/y),W=c?0:e()*e()*.5,J=x*(c?.98:e.range(.94,1)),_=u-W,N=_+.16,P=f+J,q=e(),E=(A+(d+(L+.5)/y)/4)%1,j=o*(.88+.2*q),re=e.range(-.04,.04),Q=[j*(1+re),j,j*(1-re*1.5)],X=[p,0,E,q],U=[p,J,E,q];B(C,n(D,N,f),n(R,N,f),n(R,_,P),n(D,_,P),[T,.1,m],Q,X,X,U,U),B(C,n(D,_,P),n(R,_,P),n(R,_-w,P),n(D,_-w,P),M,Q,U,U,U,U),c||(B(C,n(D,N,f),n(D,_,P),n(D,_-w,P),n(D,_-w,f),[-a,0,-I],Q,X,U,U,X),B(C,n(R,N,f),n(R,_,P),n(R,_-w,P),n(R,_-w,f),[a,0,I],Q,X,U,U,X)),D=R}}const v=Math.max(u-w+.4,.2),h=f+x*.96,g=[p,x*.96,1,.5],b=[o,o,o];B(C,[-v,h,-v],[v,h,-v],[v,h,v],[-v,h,v],M,b,g,g,g,g)}return l&&await l(),ce(C)}function be(){const e=se(),s=[1,1,1],i=Math.cos(Math.atan2(O,k)),c=Math.sin(Math.atan2(O,k));for(let l=0;l<4;l++){const C=ae[l][0],z=ae[l][1],G=-z,x=C,M=o=>[C+G*o,z+x*o],p=M(-1),f=M(1),u=[0,0,0],y=[C*c,i,z*c];B(e,u,u,u,u,y,s,[p[0],p[1],1,0],[f[0],f[1],1,0],[f[0],f[1],0,0],[p[0],p[1],0,0]);const w=e.i.length-6,A=e.i[w];e.i.splice(w,6,A,A+2,A+1,A,A+3,A+2),B(e,u,u,u,u,[0,-1,0],s,[p[0],p[1],1,0],[f[0],f[1],1,0],[f[0],f[1],1,1],[p[0],p[1],1,1])}return ce(e)}function De(e,s){const i=se(),{pts:c,side:l,roadW:C}=s,z=[1,1,1],G=x=>C*le(1,.5,V(x/O,0,1));for(let x=0;x<ue-1;x++){const M=c[x],p=c[x+1],f=M.distanceTo(p),u=Math.max(1,Math.ceil(f/7)),y=x===0?[l,0,0]:[0,0,1],w=p.clone().sub(M).normalize(),A=new r.Vector3(y[0],y[1],y[2]).cross(w);A.y<0&&A.negate();let o=null;for(let v=0;v<=u;v++){const h=v/u,g=x+h,b=M.clone().lerp(p,h),d=G(b.y),T=x===0?b.y:Math.min(d/.647,b.y),m=e(),a=[b.x,b.y,b.z],I=[b.x+y[0]*d,b.y,b.z+y[2]*d],n=[b.x+y[0]*(d+T*.14),b.y-T,b.z+y[2]*(d+T*.14)],D=[b.x,b.y-T,b.z],L={I:a,O:I,OB:n,IB:D,s:g,r:m};if(o&&(B(i,o.I,o.O,L.O,L.I,[A.x,A.y,A.z],z,[o.s,0,1,o.r],[o.s,1,1,o.r],[g,1,1,m],[g,0,1,m]),B(i,o.O,o.OB,L.OB,L.O,[y[0],.14,y[2]],z,[o.s,1,1,o.r],[o.s,1,0,o.r],[g,1,0,m],[g,1,1,m]),x===0&&B(i,o.I,o.IB,L.IB,L.I,[-y[0],.1,-y[2]],z,[o.s,0,1,o.r],[o.s,0,0,o.r],[g,0,0,m],[g,0,1,m])),v===u||v===0){const R=v===0?-1:1;B(i,a,I,n,D,[w.x*R,0,w.z*R],z,[g,0,1,m],[g,1,1,m],[g,1,0,m],[g,0,0,m])}o=L}}for(let x=1;x<ue;x++){const M=c[x],p=G(M.y),f=Math.min(p/.647*1.08,M.y),u=p*.95,y=e(),w=M.x-u,A=M.x+u,o=M.z-.3,v=M.z+p*1.3,h=M.y+.08,g=M.y-f,b=v+f*.14,d=(T,m)=>[x,T,m,y];B(i,[w,h,o],[A,h,o],[A,h,v],[w,h,v],[0,1,0],z,d(0,1),d(0,1),d(1,1),d(1,1)),B(i,[w,h,v],[A,h,v],[A,g,b],[w,g,b],[0,.14,1],z,d(1,1),d(1,1),d(1,0),d(1,0)),B(i,[w,h,o],[w,h,v],[w,g,b],[w,g,o],[-1,.1,0],z,d(0,1),d(1,1),d(1,0),d(0,0)),B(i,[A,h,o],[A,h,v],[A,g,b],[A,g,o],[1,.1,0],z,d(0,1),d(1,1),d(1,0),d(0,0))}return ce(i)}function Me(e,s,i){const c=se(),l=k+13,C=.45,z=[0,0,0,0],G=[1,1,1];B(c,[-l,C,-l],[l,C,-l],[l,C,l],[-l,C,l],[0,1,0],G,z,z,z,z);for(let u=0;u<4;u++){const y=ae[u][0],w=ae[u][1],A=-w,o=y,v=l+1.6,h=(g,b,d)=>[y*b+A*g,d,w*b+o*g];B(c,h(-l,l,C),h(l,l,C),h(v,v,-.5),h(-v,v,-.5),[y,.9,w],[.9,.9,.9],z,z,z,z)}const x=(u,y,w,A,o,v,h,g,b)=>{const d=Math.cos(h),T=Math.sin(h),m=[u,y,Math.min(b,.85),1],a=(L,R,W)=>[u+L*d-W*T,w+R,y+L*T+W*d],I=(L,R)=>[L*d-R*T,0,L*T+R*d],n=A/2,D=v/2;B(c,a(-n,o,-D),a(n,o,-D),a(n,o,D),a(-n,o,D),[0,1,0],g,m,m,m,m),B(c,a(-n,0,D),a(n,0,D),a(n,o,D),a(-n,o,D),I(0,1),g,m,m,m,m),B(c,a(-n,0,-D),a(n,0,-D),a(n,o,-D),a(-n,o,-D),I(0,-1),g,m,m,m,m),B(c,a(n,0,-D),a(n,0,D),a(n,o,D),a(n,o,-D),I(1,0),g,m,m,m,m),B(c,a(-n,0,-D),a(-n,0,D),a(-n,o,D),a(-n,o,-D),I(-1,0),g,m,m,m,m)},M=s.pts[0],p=s.pts[1],f=Math.round(e.range(6,9)*i);for(let u=0,y=0;u<f&&y<80;y++){const w=e.range(-105,105),A=e.range(k+34,k+92),o=le(p.x,M.x,V((A-p.z)/(M.z-p.z),0,1))+s.side*s.roadW*.5,v=e.int(3,5),h=e.int(5,10),g=e.range(3,3.6);if(Math.abs(w-o)<h*g*.5+9)continue;u++;const b=e.range(-.12,.12),d=e.range(.05,.75),T=Math.cos(b),m=Math.sin(b);for(let a=0;a<v;a++)for(let I=0;I<h;I++){if(e.chance(.22))continue;const n=(I-(h-1)/2)*g,D=(a-(v-1)/2)*g,L=e.range(.8,1.02),R=e.range(-.04,.04),W=[L*(1+R),L,L*(1-R)],J=w+n*T-D*m,_=A+n*m+D*T,N=e.range(1.2,1.7);x(J,_,0,e.range(2,2.5),N,e.range(2,2.5),b+e.range(-.05,.05),W,d+e.range(0,.15)),e.chance(.3)&&x(J+e.range(-.3,.3),_,N,2,e.range(1.1,1.5),2,b+e.range(-.2,.2),W,d+e.range(.1,.2))}}return ce(c)}function Se(e){const s=se(),i=e.yc,c=k*(1-i/O)+.25,l=[0,0,0,0],C=[1,1,1],z=new r.Vector3;for(let G=0;G<4;G++){const x=ae[G][0],M=ae[G][1],p=-M,f=x,u=[x*c-p*c,i,M*c-f*c],y=[x*c+p*c,i,M*c+f*c],w=[0,O+.3,0];z.set(x*O,k,M*O).normalize(),B(s,u,y,w,w,[z.x,z.y,z.z],C,l,l,l,l),B(s,[u[0]*1.06,i-.9,u[2]*1.06],[y[0]*1.06,i-.9,y[2]*1.06],y,u,[x,.3,M],[.8,.8,.8],l,l,l,l)}return ce(s)}const ze=`
uniform float uSize;
varying vec2 vUv;
#include <fog_pars_vertex>
void main(){
  vUv = uv*2.0 - 1.0;
  vec4 mvPosition = modelViewMatrix*vec4(0.0, 0.0, 0.0, 1.0);
  mvPosition.xy += position.xy*uSize; mvPosition.z += 14.0;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ae=`
uniform float uI; uniform vec3 uCol;
varying vec2 vUv;
#include <fog_pars_fragment>
void main(){
  vec2 p = abs(vUv); float r = length(vUv);
  float core = exp(-r*r*45.0);
  float star = exp(-p.y*55.0)*exp(-p.x*3.5) + exp(-p.x*55.0)*exp(-p.y*3.5);
  vec3 col = uCol*(core*6.0 + star*2.5 + exp(-r*5.0)*0.3)*uI*(1.0 - smoothstep(0.6, 1.0, r));
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float ff = 1.0 - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
      float ff = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    col *= 1.0 - ff;
  #endif
  gl_FragColor = vec4(col, 1.0);
}`;async function Le(e,s={}){const i=e.rng.fork("twenty-floods-hero"),c=(s.palette&&s.palette.length>=7?s.palette:de).map(t=>new r.Color(t)),l=e.quality?.detail??1,C=s.density??1,z=null,G=!1,x=i.int(50,60),M=x-Math.max(2,Math.round(x*.05)),p=O/x,f=M*p,u=s.rampSide??i.sign(),y=i.range(6.5,8),w=i.range(.4,.7),A=.75,o=t=>k*(1-t/O),v=[],h=[];for(let t=0;t<ue-1;t++){const S=Math.max((f-1)*(w*(t/11)+(1-w)*(1-A**t)/(1-A**11)),.6);v.push(S),h.push(new r.Vector3(-u*(t%2===0?1:-1)*Math.max(o(S)-7,1.5),S,o(S)+.15))}h.unshift(new r.Vector3(h[0].x+u*i.range(-12,36),.6,k+i.range(88,100)));const g=t=>{if(t<=v[0])return 1;for(let S=0;S<11;S++)if(t<v[S+1])return 1+S+(t-v[S])/(v[S+1]-v[S]);return 12},b={N:x,Nc:M,h:p,yc:f,pts:h,side:u,roadW:y},d=G&&z.get("heroM")!==null,T=G?d?-.5:-4:s.mirrorY??-30,m=c[2].clone().offsetHSL(i.range(-.012,.012),i.range(-.05,.05),i.range(-.03,.03)),a={uCourse:{value:M+1},uLineY:{value:-1.5},uRampHead:{value:0},uTime:{value:0},uFlow:{value:0},uSmear:{value:0},uCap:{value:1},uSite:{value:0},uSide:{value:u},uRoadW:{value:y},uDim:{value:new r.Vector4(k,O,f,p)},uMirror:{value:new r.Vector3(0,T,s.mirrorRipple??.5)},uRamp:{value:h},uGlint:{value:0},uGranite:{value:i.chance(.3)?i.range(3,7):-10},uSeed:{value:i.range(0,50)},uDustY:{value:0},uDust:{value:0},uWind:{value:s.wind??i.sign()},uBlaze:{value:s.blaze??3},uMirrorTint:{value:new r.Color(s.mirrorTint??"#8fb0c0")},cCasing:{value:c[1]},cHoney:{value:m},cMud:{value:c[3]},cShade:{value:c[5].clone().lerp(new r.Color(1,1,1),.45)},cGold:{value:c[6]}},I=new r.Group;I.name="twenty-floods-hero";const n=(t,S,F=I,H=0)=>{const K=new r.Mesh(t,S);return K.renderOrder=H,F.add(K),K},D=()=>e.yield(),L=await me(i.fork("core"),b,6.5,!1,D);n(L,oe(a,"CORE")),await e.yield();const R=be();await e.yield();const W=De(i.fork("ramp"),b);await e.yield();const J=Se(b);n(R,oe(a,"CASING",{rough:.5})),n(W,oe(a,"RAMP")),n(J,oe(a,"CAP",{rough:.35})),await e.yield(),n(Me(i.fork("site"),b,C),oe(a,"SITE")),await e.yield();{const t=i.fork("teams"),S=Math.max(200,Math.round(3e3*C*l)),F=new r.BoxGeometry(1,1,1).translate(0,.5,0),H=new r.InstancedBufferGeometry;H.index=F.index,H.setAttribute("position",F.attributes.position),H.setAttribute("normal",F.attributes.normal);const K=new Float32Array(S*4),$=[...Array(70)].map(()=>t());for(let ee=0;ee<S;ee++){const Y=t.chance(.72);K[ee*4]=Y?(t.pick($)+t.gauss()*.0035+1)%1:t(),K[ee*4+1]=Y?1:-1,K[ee*4+2]=Y?.5+t.gauss()*.08:t(),K[ee*4+3]=t()}H.setAttribute("aD",new r.InstancedBufferAttribute(K,4)),H.instanceCount=S;const Z=n(H,oe(a,"TEAM",{vc:!1}));Z.frustumCulled=!1}await e.yield();{const F=[],H=[],K=[];for(let Y=0;Y<=8;Y++)for(let ne=0;ne<=40;ne++)F.push(ne/40,Y/8*2-1,0),H.push(0,1,0);for(let Y=0;Y<8;Y++)for(let ne=0;ne<40;ne++){const ie=Y*41+ne;K.push(ie,ie+1,ie+40+2,ie,ie+40+2,ie+40+1)}const $=new r.BufferGeometry;$.setAttribute("position",new r.Float32BufferAttribute(F,3)),$.setAttribute("normal",new r.Float32BufferAttribute(H,3)),$.setAttribute("aD",new r.Float32BufferAttribute(new Float32Array(F.length/3*4),4)),$.setIndex(K);const Z=oe(a,"DUST",{vc:!1});Z.transparent=!0,Z.depthWrite=!1,Z.side=r.DoubleSide;const ee=n($,Z,I,4);ee.frustumCulled=!1}let _=null;const N=[];if(s.mirror!==!1){_=new r.Group,_.name="mirror",I.add(_);const t=(S,F)=>{const H=oe(a,S,{...F,mirror:!0});return H.opacity=s.mirrorOpacity??.6,N.push(H),H};n(await me(i.fork("lod"),b,20,!0,D),t("CORE"),_,-4).frustumCulled=!1,n(R,t("CASING",{rough:.5}),_,-3).frustumCulled=!1,n(W,t("RAMP"),_,-2).frustumCulled=!1,n(J,t("CAP",{rough:.35}),_,-1).frustumCulled=!1}await e.yield();const P=r.UniformsUtils.merge([r.UniformsLib.fog,{uI:{value:0},uSize:{value:70},uCol:{value:c[6].clone()}}]),q=new r.Mesh(new r.PlaneGeometry(2,2),new r.ShaderMaterial({uniforms:P,vertexShader:ze,fragmentShader:Ae,fog:!0,transparent:!0,depthWrite:!1,blending:r.AdditiveBlending}));if(q.position.set(0,O-2,0),q.frustumCulled=!1,q.renderOrder=6,I.add(q),G){const t=new r.Mesh(new r.CylinderGeometry(224,236,4,72),new r.MeshStandardMaterial({color:"#b39468",roughness:1}));t.position.y=-2.03,d||I.add(t);const S=new r.Mesh(new r.CircleGeometry(2400,64),new r.MeshStandardMaterial({color:"#2a5870",roughness:.25,transparent:!0,opacity:d?.35:.5,depthWrite:!1}));S.rotation.x=-Math.PI/2,S.position.y=T,S.renderOrder=5,I.add(S)}let E=2,j=0,re=0,Q=!1;const X=G&&z.get("heroB")!==null?parseFloat(z.get("heroB")):null,U=new r.Vector3;function fe(t){const S=V(E,0,1);a.uCourse.value=3+(M-3)*S+(S>=1?1:0),a.uCap.value=te(1,1.07,E);const F=V((E-1.05)/.09,0,1),H=Math.sin(Math.PI*F)**2,K=V((E-1.12)/.88,0,1);a.uLineY.value=K<=0?f:le(f,-1.5,K);const $=Math.min(V((a.uCourse.value-1)*p,.6,f-1),a.uLineY.value-4);a.uRampHead.value=g(Math.max($,.6))*(1-te(.94,1,K)),a.uSite.value=1-te(.5,.98,K),a.uSmear.value=j,a.uDustY.value=E<1.12?Math.min(a.uCourse.value,M)*p:a.uLineY.value,a.uDust.value=(s.dust??.9)*(.5+.5*te(.02,.12,E))*(1-.45*te(1,1.15,E))*(1-te(1.85,1.98,E));const Z=a.uCap.value*.06*(.5+.5*Math.sin(t*1.3));a.uGlint.value=H+re+Z,P.uI.value=H+re*.8,q.visible=P.uI.value>.003,_&&(_.visible=N[0].opacity>.003)}return fe(0),{object:I,radius:165,height:O,center:new r.Vector3(0,58,0),ground:!1,groundY:0,mirror:_,mirrorMaterials:N,uniforms:a,anchors:{apex:new r.Vector3(0,O,0),capstone:new r.Vector3(0,(f+O)/2,0),lookAt:new r.Vector3(0,62,0),corners:[[-k,0,k],[k,0,k],[k,0,-k],[-k,0,-k]].map(t=>new r.Vector3(...t)),apexShadow:new r.Vector3(0,O,0),rampPoints:h.map(t=>t.clone()),rampFoot:h[1].clone(),trackStart:h[0].clone(),southNormal:new r.Vector3(0,k,O).normalize(),eastNormal:new r.Vector3(O,k,0).normalize(),viewpoints:{entry:new r.Vector3(339.4,T+3.4,650.5),exit:new r.Vector3(84.8,T+3.4,395.9)},bargeHeading:new r.Vector3(-Math.SQRT1_2,0,-Math.SQRT1_2),mirrorY:T},setBuild(t){Q=!0,E=V(t,0,2)},schedule:{courses:.6},setProgress(t,S){if(t==null){Q=!1,E=2,j=0;return}if(Q=!0,t=V(t,0,1),t<.6){const F=V(S??t/.6,0,1);E=.035+.965*le(F,F*F*(3-2*F),.35)}else t<.645?E=1+(t-.6)/.045*.12:E=1.12+V((t-.645)/.185,0,1)*.88;j=te(.1,.2,t)*(1-te(.78,.86,t))},setSmear(t){j=V(t,0,1)},setGlint(t){re=V(t,0,2)},setMirror(t,S){for(const F of N)F.opacity=V(t,0,1);S!==void 0&&(a.uMirror.value.y=S)},update(t,S,F){if(G&&!Q){if(X!==null)E=X;else if(F){I.worldToLocal(U.copy(F.position));const H=(Math.atan2(U.x,U.z)+.35)/1.3;E=V((H-Math.floor(H))*2.15,0,2)}j=E>.02&&E<1.98?1:0}a.uTime.value=S,a.uFlow.value+=Math.min(t,.1)*(.25+j*1.2),fe(S)},dispose(){}}}export{Le as buildHero};
