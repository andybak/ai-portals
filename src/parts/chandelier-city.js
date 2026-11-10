import*as t from"three";import{mergeGeometries as Xe}from"three/addons/utils/BufferGeometryUtils.js";const C=Math.PI*2,rt=["#FBF1E1","#F3B9A6","#E8C7D6","#B9B4E6","#8E8CC9","#FFE2A6","#FF7A59"],Ze=600,re=410,Je=190,W=[{radius:250,y:590,scale:1.7},{radius:200,y:545,scale:1.5},{radius:150,y:500,scale:1.25},{radius:104,y:460,scale:1}],De=7*Math.PI/180,nt=9*Math.PI/180,O=`
uniform float uTime, uSway, uProgress, uGlow;
uniform vec3 uSunDir, uSunCol, uSkyUp, uSkyDn, uHaze;
// slow sway + twist about the ceiling pivot; lower tiers lag; fades out toward the portal so the seat is fixed
vec3 swayP(vec3 p, float lag){
  float d = 600.0 - p.y;
  float w = smoothstep(418.0, 452.0, p.y);
  float ph = d*0.006 + lag;
  float ax = uSway*sin(uTime*0.262 - ph)*w;
  float az = uSway*0.7*sin(uTime*0.217 + 1.3 - ph)*w;
  float tw = uSway*1.4*sin(uTime*0.171 + 0.6 - ph*1.5)*w;
  p.x += d*ax; p.z += d*az;
  p.xz += vec2(-p.z, p.x)*tw;
  return p;
}
float hash1(float n){ return fract(sin(n*12.9898)*43758.5453); }
vec3 envCol(vec3 d){
  vec3 c = mix(uHaze, uSkyUp, smoothstep(0.0, 0.55, d.y));
  c = mix(c, uSkyDn, smoothstep(0.0, -0.45, d.y));
  float s = max(dot(d, uSunDir), 0.0);
  c += uSunCol*(pow(s, 6.0)*0.35 + pow(s, 48.0)*1.6);
  return c;
}
// high-key pastel shading: hemisphere bounce + wrapped coral key + pastel reflections + warm rim
vec3 shade(vec3 alb, vec3 N, vec3 V, float metal, float gloss){
  vec3 amb = mix(uSkyDn, uSkyUp, N.y*0.5 + 0.5);
  float wrap = clamp((dot(N, uSunDir) + 0.45)/1.45, 0.0, 1.0);
  vec3 dif = alb*(amb*0.78 + uSunCol*wrap*wrap*0.5);
  vec3 R = reflect(-V, N);
  float fr = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
  vec3 env = envCol(R);
  vec3 col = dif*(1.0 - 0.5*metal) + env*alb*metal*0.62*gloss;
  col += env*fr*(0.06 + 0.16*gloss);
  col += uSunCol*pow(max(dot(R, uSunDir), 0.0), 24.0)*gloss*(0.25 + 0.75*metal)*0.55;
  return col;
}
`,st=(n,i)=>{let a=Math.abs(n-i)%C;return a>Math.PI?C-a:a},ne=(n,i,a)=>{const u=Math.min(1,Math.max(0,(a-n)/(i-n)));return u*u*(3-2*u)};function Fe(n){let i=1;for(let a=0;a<4;a++)i=Math.min(i,ne(De,De+nt,st(n,a*Math.PI/2)));return i}const j=(n,i,a,u=new t.Vector3)=>u.set(n*Math.sin(i),a,n*Math.cos(i));function ge(n,i,a,u){const f=[],s=[0];let c=0;for(let h=0;h<=48;h++){const y=h/48,d=new t.Vector3().lerpVectors(n,i,y);d.y-=a*4*y*(1-y),h&&(c+=d.distanceTo(f[h-1]),s.push(c)),f.push(d)}const b=Math.max(2,Math.round(c/u)),g=[];let v=0;for(let h=0;h<=b;h++){const y=h/b*c;for(;v<47&&s[v+1]<y;)v++;const d=(y-s[v])/Math.max(1e-6,s[v+1]-s[v]);g.push({p:new t.Vector3().lerpVectors(f[v],f[v+1],d),t:h/b})}return g}function se(n,i,a){const u=n.attributes.position.count,w=new Float32Array(u*4),f=n.attributes.uv;for(let s=0;s<u;s++)w[s*4]=f?f.getX(s):0,w[s*4+1]=f?f.getY(s):0,w[s*4+2]=i,w[s*4+3]=a;return n.setAttribute("aData",new t.BufferAttribute(w,4)),n.deleteAttribute("uv"),n}const Ke=[[7,5,7.7,4.1,0],[7.7,4.1,6.2,3,0],[6.2,3,6.2,-3,1],[6.2,-3,7,-3.7,0],[7,-3.7,5,-6,3],[5,-6,0,-7,3],[0,-7,-5,-6,3],[-5,-6,-7,-3.7,3],[-7,-3.7,-6.2,-3,0],[-6.2,-3,-6.2,3,1],[-6.2,3,-7.7,4.1,0],[-7.7,4.1,-7,5,0],[-7,5,-3.6,5,8],[-3.6,5,0,7.6,2],[0,7.6,3.6,5,2],[3.6,5,7,5,8],[7,5,7,7.4,4],[-7,5,-7,7.4,4],[7,-3.7,7,-8,5],[-7,-3.7,-7,-8,5]];function it(n,i,a){const{radius:u,y:w,scale:f}=n,s=Ke.length,c=s*2*(i+1),b=new Float32Array(c*3),g=new Float32Array(c*3),v=new Float32Array(c*4),h=[],y=C*u/i;let d=0;for(let G=0;G<s;G++){const[T,E,B,ie,R]=Ke[G];let N=ie-E,D=-(B-T);const de=Math.hypot(N,D)||1;N/=de,D/=de;const Me=(T+B)/2,fe=(E+ie)/2+.5;R===4||R===5?(N=Math.sign(T),D=0):N*Me+D*fe<0&&(N=-N,D=-D);let le=0,me=1,S=0;R===1?S=6*f/y+10*(a*2+(T>0?0:1)):R===3?(le=(T+7)/14,me=(B+7)/14,S=a):R===2?S=T+B>0?1:0:R===0&&(S=a);const U=d;for(let z=0;z<=i;z++){const x=z/i*C,k=Math.sin(x),Q=Math.cos(x);for(let _=0;_<2;_++){const H=u+(_?B:T)*f,ce=w+(_?ie:E)*f;b[d*3]=H*k,b[d*3+1]=ce,b[d*3+2]=H*Q,g[d*3]=N*k,g[d*3+1]=D,g[d*3+2]=N*Q,v[d*4]=z,v[d*4+1]=_?me:le,v[d*4+2]=R,v[d*4+3]=S,d++}}for(let z=0;z<i;z++){const x=U+z*2;h.push(x,x+1,x+2,x+1,x+3,x+2)}}const A=new t.BufferGeometry;return A.setAttribute("position",new t.BufferAttribute(b,3)),A.setAttribute("normal",new t.BufferAttribute(g,3)),A.setAttribute("aData",new t.BufferAttribute(v,4)),A.setIndex(h),A}const ye=`#include <common>
#include <fog_pars_vertex>
`,be=`#include <common>
#include <fog_pars_fragment>
`,lt=ye+O+`
attribute vec4 aData;
varying vec3 vWorld, vN; varying vec4 vData;
void main(){
  vec3 p = swayP(position, 0.0);
  vec4 wp = modelMatrix*vec4(p, 1.0);
  vWorld = wp.xyz; vN = normalize(mat3(modelMatrix)*normal); vData = aData;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ct=be+O+`
uniform vec3 uGold, uCream, uRose, uLilac, uCoral, uWarm;
varying vec3 vWorld, vN; varying vec4 vData;
void main(){
  float k = vData.z; vec2 uv = vData.xy; float w = vData.w;
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 N = normalize(vN); if(dot(N, V) < 0.0) N = -N;
  vec3 alb = uGold; float metal = 0.8, gloss = 0.8; vec3 emi = vec3(0.0);
  float bx = fract(uv.x) - 0.5, bay = floor(uv.x);
  if(k < 0.5){                                   // gilt moulding with a bead-and-reel rhythm
    alb = uGold*(0.82 + 0.18*cos(uv.x*31.416))*(0.9 + 0.1*cos(uv.y*9.42));
  } else if(k < 1.5){                            // arcade wall: arched lit windows between pilasters
    float id = floor(w/10.0 + 0.001), asp = w - id*10.0;
    float py = uv.y*asp, hw = 0.30, sill = 0.13*asp, spring = asp*0.87 - hw, dx = abs(bx);
    float d = py > spring ? length(vec2(bx, py - spring)) - hw : max(dx - hw, sill - py);
    float band = 0.5 + 0.5*cos(6.2832*(uv.x*0.021 + uTime*0.012 + id*0.13));
    vec3 prism = 0.5 + 0.5*cos(6.2832*(uv.x*0.05 - uTime*0.02 + vec3(0.0, 0.33, 0.67)));
    alb = uCream*0.78*mix(vec3(1.0), 0.75 + 0.5*prism, 0.22*pow(band, 3.0)); metal = 0.05; gloss = 0.3;
    alb *= 0.9 + 0.1*smoothstep(0.0, 0.12, d);                       // soft shadow line round each opening
    if(dx > 0.43 || py < 0.07*asp || py > 0.95*asp){ alb = uGold*(0.85 + 0.15*cos(py*40.0)); metal = 0.8; gloss = 0.8; }
    if(d < 0.045 && d >= 0.0){ alb = uGold; metal = 0.8; gloss = 0.9; }
    if(d < 0.0){
      float h = hash1(bay*1.37 + id*17.13 + 3.1), lit = step(0.3, h);
      vec3 gc = mix(uWarm, uCoral, step(0.82, h)*0.55); gc = mix(gc, uCream, step(h, 0.45)*0.4);
      float mull = step(0.022, dx)*step(0.022, abs(py - spring));
      float tw = 0.86 + 0.14*sin(uTime*(0.5 + h*1.6) + h*50.0);
      float grad = 0.65 + 0.35*clamp((spring + hw - py)/(spring + hw - sill), 0.0, 1.0);
      alb = mix(uLilac, uRose, step(0.5, fract(h*7.0)))*0.5; metal = 0.3; gloss = 1.0;
      emi = gc*(1.9*lit + 0.12)*tw*grad*mix(0.3, 1.0, mull);
    }
  } else if(k < 2.5){                            // tiled roof with lit dormers
    float rv = w > 0.5 ? uv.y : 1.0 - uv.y, row = floor(rv*5.0);
    float t = fract(rv*5.0), tx = fract(uv.x*3.0 + row*0.5);
    alb = mix(uRose, uCoral, 0.22)*(0.72 + 0.2*t)*(0.9 + 0.1*step(0.1, tx)); metal = 0.05; gloss = 0.35;
    if(rv < 0.09){ alb = uGold; metal = 0.8; gloss = 0.8; }
    if(mod(bay, 3.0) < 0.5 && abs(bx) < 0.13 && rv > 0.38 && rv < 0.72){
      alb = uCream*0.7; if(abs(bx) < 0.085 && rv > 0.45 && rv < 0.66) emi = uWarm*1.8;
    }
  } else if(k < 3.5){                            // coffered soffit with a lamp in every other coffer
    float row = floor(uv.y*3.0); vec2 c = vec2(bx, fract(uv.y*3.0) - 0.5);
    float e = max(abs(c.x), abs(c.y)), rib = smoothstep(0.37, 0.43, e), l = length(c);
    alb = mix(mix(uRose, uLilac, 0.5 + 0.5*sin(row*2.1 + w*1.7))*0.85, uGold, rib); metal = mix(0.1, 0.8, rib); gloss = 0.7;
    alb = mix(alb, uGold, smoothstep(0.24, 0.2, l)*smoothstep(0.12, 0.16, l)); 
    float on = step(0.5, mod(bay + row, 2.0));
    emi = uWarm*3.2*smoothstep(0.14, 0.09, l)*on*(0.85 + 0.15*sin(uTime*1.3 + bay*2.4 + row));
  } else if(k < 4.5){                            // pierced cresting (v: 0 base .. 1 tips)
    float x2 = fract(uv.x*2.0) - 0.5, h = 0.2 + 0.8*pow(max(cos(x2*3.14159), 0.0), 0.6);
    if(uv.y > h) discard; if(length(vec2(x2*1.3, uv.y - 0.5)) < 0.2) discard;
    alb = uGold*(0.9 + 0.1*uv.y);
  } else if(k < 5.5){                            // lace valance (v: 0 top .. 1 scallop tips)
    float x2 = fract(uv.x*2.0) - 0.5, h = 0.25 + 0.75*sqrt(max(1.0 - 4.0*x2*x2, 0.0));
    if(uv.y > h) discard; if(length(vec2(x2*1.2, uv.y - 0.55)) < 0.17) discard;
    alb = mix(uCream*0.8, uGold, smoothstep(h - 0.22, h - 0.05, uv.y)); metal = 0.45;
  } else if(k < 6.5){                            // plain gilt / cream plaster (w = cream amount)
    alb = mix(uGold, uCream*0.8, w); metal = mix(0.8, 0.12, w); gloss = mix(0.8, 0.4, w);
  } else if(k < 7.5){                            // portal frame: engraved gold that wakes with uProgress
    float eng = 0.5 + 0.5*cos(uv.x*6.2832*48.0);
    alb = uGold*(0.85 + 0.15*eng);
    float fr = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.0);
    emi = uWarm*uGlow*(0.35 + 0.25*fr + uProgress*(1.6 + 0.6*sin(uv.x*6.2832*4.0 - uTime*2.0)));
  } else {                                       // terrace deck: cream paving, gold inlay
    alb = uCream*0.74*(0.92 + 0.08*step(0.06, abs(bx))); metal = 0.08; gloss = 0.3;
    alb = mix(alb, uGold, step(0.9, fract(uv.y*2.0 + 0.45))*0.8);
  }
  vec3 col = shade(alb, N, V, metal, gloss) + emi;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,ut=ye+O+`
attribute vec3 aTop; attribute vec4 aSc; attribute vec3 aTint;
varying vec3 vWorld, vN, vTint, vL; varying float vSeed;
void main(){
  float seed = aSc.z; vL = position;
  float ang = seed*40.0 + uTime*(0.22 + 0.5*fract(seed*7.0))*(fract(seed*13.0) < 0.5 ? -1.0 : 1.0);
  float c = cos(ang), s = sin(ang); mat2 rot = mat2(c, -s, s, c);
  vec3 lp = position; lp.xz = rot*lp.xz; vec3 n = normal; n.xz = rot*n.xz;
  vec3 sc = vec3(aSc.x, aSc.y, aSc.x);
  lp *= sc; n = normalize(n/sc);
  vec3 p = aTop + lp;
  float sp = dot(aTop.xz, vec2(0.131, 0.177));            // one phase per strand
  float dd = aSc.w - lp.y;                                 // metres below the ring it hangs from
  p.x += dd*0.02*sin(uTime*0.7 + sp); p.z += dd*0.02*cos(uTime*0.6 + sp*1.7);
  p = swayP(p, 0.35);
  vec4 wp = modelMatrix*vec4(p, 1.0);
  vWorld = wp.xyz; vN = normalize(mat3(modelMatrix)*n); vTint = aTint; vSeed = seed;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,vt=be+O+`
uniform vec3 uCoral, uWarm, uViolet;
varying vec3 vWorld, vN, vTint, vL; varying float vSeed;
void main(){
  vec3 V = normalize(cameraPosition - vWorld), N = normalize(vN);
  // brilliant-cut sub-facets: each face is split into bands and sectors with slightly different tilts
  float cid = floor(vL.y*5.0)*7.0 + floor(atan(vL.z, vL.x)*2.5465) + floor(vSeed*89.0 + 0.5);
  float cut = clamp(1.0 - fwidth(vL.y)*12.0, 0.0, 1.0);
  N = normalize(N + (vec3(hash1(cid), hash1(cid + 1.7), hash1(cid + 3.1)) - 0.5)*0.55*cut);
  float tone = 1.0 + (hash1(cid + 5.3) - 0.5)*0.22*cut;
  vec3 R = reflect(-V, N);
  float ndv = abs(dot(N, V)), fr = pow(1.0 - ndv, 2.5);
  vec3 amb = mix(uSkyDn, uSkyUp, N.y*0.5 + 0.5);
  float wrap = clamp((dot(N, uSunDir) + 0.5)/1.5, 0.0, 1.0);
  vec3 irid = 0.5 + 0.5*cos(6.2832*(ndv*1.2 + vSeed*3.0 + R.y*0.35 + vec3(0.0, 0.33, 0.67)));
  vec3 base = vTint*tone*mix(vec3(1.0), 0.55 + 0.8*irid, 0.5);     // view-dependent hue shift
  vec3 col = base*(amb*0.72 + uSunCol*wrap*wrap*0.46);
  col += envCol(R)*(0.08 + 0.34*fr);
  // sparkle: three fake lights (sun, its glitter path on the sea, the bright cloud above)
  vec3 L2 = normalize(vec3(uSunDir.x, -0.55, uSunDir.z)), L3 = normalize(vec3(-uSunDir.x*0.6, 0.75, -uSunDir.z*0.6));
  float gain = 1.0 + 1.5*uProgress;
  float s1 = pow(max(dot(R, uSunDir), 0.0), 42.0), s2 = pow(max(dot(R, L2), 0.0), 60.0), s3 = pow(max(dot(R, L3), 0.0), 60.0);
  col += (mix(uCoral, uWarm, 0.3)*s1*10.0 + uWarm*s2*7.0 + uViolet*s3*7.0)*gain;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,dt=ye+O+`
attribute vec4 aPS; attribute vec4 aCol; attribute vec2 aAux;
uniform float uPix;
varying vec2 vQ; varying vec4 vCol; varying vec3 vWorld; varying float vT;
void main(){
  vec3 c = aPS.xyz; float kind = aCol.a;
  c.x += sin(uTime*0.5 + aAux.x*3.0)*aAux.y; c.z += cos(uTime*0.43 + aAux.x*3.0)*aAux.y;
  c = swayP(c, aAux.x*0.4);
  vec4 wp = modelMatrix*vec4(c, 1.0);
  vec4 mvPosition = viewMatrix*wp;
  float r = max(aPS.w*0.5, -mvPosition.z*uPix*0.8);          // never thinner than ~1.6 px
  vec2 q = position.xy; vT = aAux.x;
  if(kind > 1.5 && kind < 2.5){
    float fl = 0.88 + 0.12*sin(uTime*7.0 + aAux.x*31.0) + 0.06*sin(uTime*13.0 + aAux.x*17.0);
    mvPosition.x += sin(uTime*3.1 + aAux.x*9.0)*r*0.12*(q.y + 1.0);
    mvPosition.xy += q*r*vec2(0.9, 1.7*fl) + vec2(0.0, r*1.5);
  } else mvPosition.xy += q*r;
  vQ = q; vCol = aCol; vWorld = wp.xyz;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ft=be+O+`
uniform vec3 uWarm, uCoral;
varying vec2 vQ; varying vec4 vCol; varying vec3 vWorld; varying float vT;
void main(){
  vec3 col; float kind = vCol.a;
  if(kind > 1.5 && kind < 2.5){                                 // candle flame: HDR teardrop
    float yy = vQ.y*0.5 + 0.5, wd = 1.5*sqrt(yy)*(1.0 - yy)*1.7;
    float e = abs(vQ.x)/max(wd, 1e-3); if(e > 1.0) discard;
    col = mix(vec3(1.0, 0.86, 0.62)*6.0, uCoral*2.6, smoothstep(0.2, 1.0, e)*0.8 + yy*0.2);
  } else {
    float r2 = dot(vQ, vQ); if(r2 > 1.0) discard;
    vec3 nV = vec3(vQ, sqrt(1.0 - r2));
    vec3 N = normalize((vec4(nV, 0.0)*viewMatrix).xyz), V = normalize(cameraPosition - vWorld);
    bool gold = kind > 0.5;
    col = shade(vCol.rgb, N, V, gold ? 0.85 : 0.25, 1.0);
    if(!gold) col += vCol.rgb*0.12 + uSunCol*pow(max(dot(reflect(-V, N), uSunDir), 0.0), 30.0)*1.2;   // pearl lustre
    if(kind > 2.5){                                              // chain: a pulse runs down to the portal
      float wave = exp(-pow((vT - uProgress*1.25 + 0.12)*7.0, 2.0));
      col += uWarm*(wave*4.0*step(0.001, uProgress) + 0.25*uProgress)*uGlow;
    }
  }
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,mt=ye+O+`
attribute vec4 aBase; attribute vec3 aDir; attribute float aPart;
varying vec3 vWorld, vN; varying vec2 vP;
void main(){
  float s = aBase.w, seed = aDir.z;
  vec3 lp = position*s; vec3 n = normal;
  lp.y += sin(uTime*1.3 + seed*40.0)*0.035*lp.x;              // cups tremble on their arms
  lp.z += sin(uTime*0.9 + seed*23.0)*0.03*lp.x;
  vec3 o = vec3(aDir.x, 0.0, aDir.y), t = vec3(aDir.y, 0.0, -aDir.x);
  vec3 p = aBase.xyz + o*lp.x + vec3(0.0, lp.y, 0.0) + t*lp.z;
  n = o*n.x + vec3(0.0, n.y, 0.0) + t*n.z;
  p = swayP(p, 0.15);
  vec4 wp = modelMatrix*vec4(p, 1.0);
  vWorld = wp.xyz; vN = normalize(mat3(modelMatrix)*n); vP = vec2(aPart, seed);
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,pt=be+O+`
uniform vec3 uGold, uWarm, uCream, uCoral;
varying vec3 vWorld, vN; varying vec2 vP;
void main(){
  vec3 V = normalize(cameraPosition - vWorld), N = normalize(vN); if(dot(N, V) < 0.0) N = -N;
  float glass = clamp(vP.x, 0.0, 1.0);                        // 0 brass arm .. 1 glowing cup lip
  vec3 alb = mix(uGold, mix(uCream, uWarm, 0.75)*0.8, step(0.02, glass));
  vec3 col = shade(alb, N, V, glass > 0.02 ? 0.2 : 0.85, 0.9);
  float fl = 0.85 + 0.15*sin(uTime*5.0 + vP.y*61.0);
  col += mix(uCoral, uWarm, 0.35 + 0.65*glass)*(0.25*step(0.02, glass) + glass*glass*2.4)*fl;         // the cup is a lantern: lit from inside
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;function xe(n,i,a,u={}){return new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...n},vertexShader:i,fragmentShader:a,fog:!0,...u})}function ht(){const n=[0,0,0],i=[0,-1,0],a=-.3,u=[[.5,a,0],[0,a,.5],[-.5,a,0],[0,a,-.5]],w=[],f=[],s=new t.Vector3,c=new t.Vector3,b=new t.Vector3,g=new t.Vector3,v=(y,d,A)=>{s.fromArray(y),c.fromArray(d),b.fromArray(A),g.subVectors(c,s).cross(b.clone().sub(s)).normalize(),w.push(...y,...d,...A);for(let G=0;G<3;G++)f.push(g.x,g.y,g.z)};for(let y=0;y<4;y++){const d=u[y],A=u[(y+1)%4];v(n,A,d),v(i,d,A)}const h=new t.InstancedBufferGeometry;return h.setAttribute("position",new t.Float32BufferAttribute(w,3)),h.setAttribute("normal",new t.Float32BufferAttribute(f,3)),h}function wt(){const n=new t.CatmullRomCurve3([[0,.4,0],[1.5,-1.2,0],[3.3,-1.7,0],[4.6,-.8,0],[5,1.6,0]].map(c=>new t.Vector3(...c))),i=new t.TubeGeometry(n,7,.3,4,!1).toNonIndexed(),a=[[.03,-.5],[.5,-.1],[1.35,.2],[.55,.65],[.85,1.7],[1.3,3],[1.1,3.9]].map(c=>new t.Vector2(c[0],c[1])),u=new t.LatheGeometry(a,7).toNonIndexed();u.translate(5,2,0);const w=(c,b)=>{const g=c.attributes.position.count,v=new Float32Array(g);for(let h=0;h<g;h++)v[h]=b(c.attributes.position.getY(h));return c.setAttribute("aPart",new t.BufferAttribute(v,1)),c.deleteAttribute("uv"),c};w(i,()=>0),w(u,c=>Math.max(0,Math.min(1,(c-2.65)/3.2)));const f=Xe([i,u]);i.dispose(),u.dispose();const s=new t.InstancedBufferGeometry;return s.setAttribute("position",f.attributes.position),s.setAttribute("normal",f.attributes.normal),s.setAttribute("aPart",f.attributes.aPart),s}function gt(n){const i=[[.01,600],[1.2,600.3],[2.6,601.6],[1.8,603],[3.2,604],[7,604.6],[10,606.2],[14,606.8],[22,608.2],[34,609.6],[50,610.6],[66,611.4],[74,612]].map(s=>new t.Vector2(s[0],s[1])),a=new t.LatheGeometry(i,96),u=a.attributes.position,w=u.count,f=new Float32Array(w*4);for(let s=0;s<w;s++){let c=u.getX(s),b=u.getY(s),g=u.getZ(s);const v=Math.hypot(c,g),h=Math.atan2(c,g),y=Math.abs(Math.sin(h*n/2)),d=Math.abs(Math.cos(h*n/2)),A=ne(14,40,v),G=ne(4,8,v)*(1-ne(12,18,v));b-=A*2.4*Math.pow(y,.6)+G*1.1*Math.pow(d,.7);const T=1+.09*A*(Math.pow(y,.5)-.6);u.setXYZ(s,c*T,b,g*T);const E=ne(64,72,v),B=1-ne(0,.25,y);f[s*4]=0,f[s*4+1]=0,f[s*4+2]=6,f[s*4+3]=.75*A*(1-E)*(1-B)}return a.computeVertexNormals(),a.setAttribute("aData",new t.BufferAttribute(f,4)),a.deleteAttribute("uv"),a}function yt(){const n=new t.InstancedBufferGeometry;return n.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),n.setIndex([0,1,2,0,2,3]),n}async function xt(n,i={}){const a=n.rng.fork?n.rng.fork("grand-chandelier"):n.rng,u=(i.palette&&i.palette.length>=7?i.palette:rt).map(e=>new t.Color(e)),[w,f,s,c,b,g,v]=u,h=i.crystalDensity??1,y=i.sway??1,d=new t.Sphere(new t.Vector3(0,503,0),300),A=a.range(0,1),G=new t.Color("#DC9C40").lerp(new t.Color("#E8946A"),A*.45).lerp(g,.12),T=a.pick(["scallop","gothic","wave"]),E=[4*a.int(5,7),4*a.int(4,6),4*a.int(3,4),4*a.int(2,3)],B=a.sign()*a.range(.14,.26),ie=[4*a.int(4,5),4*a.int(3,5),4*a.int(3,4)],R=[a.pick([56,64,72]),a.pick([48,56]),a.pick([36,40,44]),a.pick([24,28])],N=a.pick([12,16,20]),D=[a.range(.6,1.4),a.range(.6,1.4),a.range(.6,1.4),a.range(.5,1.3),a.range(.3,.9)];D[a.int(0,4)]+=a.range(1.5,3);const de=[w,f,c,s,b],Me=D.reduce((e,o)=>e+o,0),fe=e=>{let o=a()*Me;for(let r=0;r<5;r++)if(o-=D[r],o<=0)return e.copy(de[r]);return e.copy(w)},le=new t.Vector3(-.5,.07,-.866).normalize();i.sunDir&&le.copy(i.sunDir).normalize();const me=i.sunIntensity??1.5,S={uTime:{value:0},uSway:{value:.004*y},uProgress:{value:0},uGlow:{value:1},uSunDir:{value:le},uSunCol:{value:new t.Color(i.sunColor||"#FFB48A").multiplyScalar(me)},uSkyUp:{value:w.clone().lerp(f,.25).multiplyScalar(.78)},uSkyDn:{value:c.clone().lerp(b,.2).multiplyScalar(.86)},uHaze:{value:g.clone().multiplyScalar(.9)},uGold:{value:G},uCream:{value:w},uRose:{value:f},uLilac:{value:c},uCoral:{value:v},uWarm:{value:g.clone().lerp(new t.Color("#FFB65C"),.6)},uViolet:{value:b.clone().lerp(new t.Color("#B48CFF"),.5)},uPix:{value:2/(1.7*1080)}},U=new t.Group;U.name="grand-chandelier";const z=[],x=[];W.forEach((e,o)=>{const r=Math.round(C*e.radius/(6*(.95+.05*e.scale))/8)*8;x.push(it(e,r,o)),z.push({radius:e.radius,y:e.y,scale:e.scale,halfWidth:7.7*e.scale,bottom:e.y-8*e.scale,top:e.y+7.6*e.scale,bays:r})}),await n.yield?.(),x.push(gt(N));const k=W[0],Q=611.5,_=k.y+7.6*k.scale,H=16;for(let e=0;e<H;e++){const o=(e+.5)/H*C,r=new t.CylinderGeometry(.9,.45,Q-_,6,1,!0);r.translate(k.radius*Math.sin(o),(Q+_)/2,k.radius*Math.cos(o)),x.push(se(r,6,0));const l=new t.LatheGeometry([[.01,0],[1.6,.5],[2.4,1.6],[3.4,2.2]].map(m=>new t.Vector2(m[0],m[1])),8);l.translate(k.radius*Math.sin(o),Q-2.2,k.radius*Math.cos(o)),x.push(se(l,6,.5))}const ce=i.portalFrame!==!1;if(ce){const e=new t.TorusGeometry(7.75,.75,10,72);e.translate(0,re,0),x.push(se(e,7,0));const o=new t.TorusGeometry(8.55,.22,5,72);o.translate(0,re,0),x.push(se(o,6,0));const r=new t.LatheGeometry([[.01,418],[1.5,418.3],[2.3,419.3],[1.1,420.3],[1.9,421.4],[.9,422.6],[.4,423.6],[.01,425]].map(m=>new t.Vector2(m[0],m[1])),12);x.push(se(r,6,0));const l=new t.LatheGeometry([[.01,400.2],[.9,400.6],[1.5,401.3],[.7,402],[.01,402.1]].map(m=>new t.Vector2(m[0],m[1])),10);x.push(se(l,6,0))}const Ae=Xe(x);x.forEach(e=>e.dispose()),Ae.boundingSphere=d;const $e=xe(S,lt,ct,{side:t.DoubleSide}),Ne=new t.Mesh(Ae,$e);Ne.name="rings",U.add(Ne),await n.yield?.();const Se=[],ke=[],Be=[],X=new t.Color,K=new t.Vector3,pe=(e,o,r,l,m,p,M)=>{Se.push(e,o,r),ke.push(l,m,a(),p),Be.push(M.r*.82,M.g*.82,M.b*.82)},Re=[33,33,35,22.5],qe=(e,o)=>{const r=.5-.5*Math.cos(e*o);return T==="gothic"?Math.pow(Math.abs(Math.sin(e*o/2)),.55):T==="wave"?Math.min(1,.72*r+.28*(.5-.5*Math.cos(e*o*3))+.12*r*r):Math.pow(r,.75)};W.forEach((e,o)=>{for(let r=0;r<2;r++){const l=e.radius+(r?-5.6:5.6)*e.scale,m=e.y-5.4*e.scale,p=(r?6.6:4.5)/h,M=Math.round(C*l/p);for(let P=0;P<M;P++){const V=(P+a.range(-.2,.2))/M*C,L=Fe(V);let F=Re[o]*(.3+.7*qe(V,E[o]))*(r?.6:1)*a.range(.94,1.04);F=2.6+(F-2.6)*L;const ve=l*Math.sin(V),ot=l*Math.cos(V);let ae=0;for(;F-ae>1.2;){let oe=(3+3.6*(ae/Re[o]))*a.range(.85,1.15);const He=F-ae;let we=!1;if(He-oe<2.6&&(oe=Math.min(He,10),we=!0),fe(X),we&&oe>4.5&&X.lerp(a.chance(.5)?v:g,.35),pe(ve,m-ae,ot,oe*(we?a.range(.44,.52):a.range(.36,.46)),oe,ae+5.4*e.scale,X),ae+=oe,we)break}}}}),W.forEach((e,o)=>{const r=E[o];for(let l=0;l<r;l++){const m=(l+.5)/r*C;if(Fe(m)<.999)continue;const p=(o===3?11:15)*a.range(.9,1.1);X.copy(a.chance(.5)?v:g).lerp(w,.35),pe(e.radius*Math.sin(m),e.y-7*e.scale,e.radius*Math.cos(m),p*.4,p,7*e.scale,X)}}),ce&&pe(0,400.3,0,2.9,6.4,0,X.copy(v).lerp(w,.4));const Pe=[],_e=[],Ie=[],Z=(e,o,r,l,m,p)=>{Pe.push(e.x,e.y,e.z,o),_e.push(r.r,r.g,r.b,l),Ie.push(m,p)},Ce=[],Le=[],We=[],Ee=(e,o,r,l,m)=>{const p=m?-1:1,M=Math.sin(o)*p,P=Math.cos(o)*p,V=a();Ce.push(e*Math.sin(o),r,e*Math.cos(o),l),Le.push(M,P,V),K.set(e*Math.sin(o)+M*5*l,r+6.2*l,e*Math.cos(o)+P*5*l),Z(K,1.5*l,g,2,V,0)};W.forEach((e,o)=>{const r=z[o].bays,l=R[o],m=.9*e.scale;for(let p=0;p<l;p++){const M=Math.round((p+.5)/l*r)/r*C;Ee(e.radius+7*e.scale,M,e.y-3.4*e.scale,m,!1)}if(o>=2){const p=Math.round(l*.6);for(let M=0;M<p;M++){const P=Math.round((M+.5)/p*r)/r*C;Fe(P)<.999&&o===3||Ee(e.radius-7*e.scale,P,e.y-3.4*e.scale,m*.85,!0)}}for(let p=0;p<8;p++)We.push({position:j(e.radius,(p+.5)/8*C,e.y-8*e.scale),color:"#FFD08A",intensity:1,radius:40*e.scale})});const Te=Ce.length/4,$=wt();$.setAttribute("aBase",new t.InstancedBufferAttribute(new Float32Array(Ce),4)),$.setAttribute("aDir",new t.InstancedBufferAttribute(new Float32Array(Le),3)),$.instanceCount=Te,$.boundingSphere=d;const Ue=new t.Mesh($,xe(S,mt,pt,{side:t.DoubleSide}));Ue.name="candle-arms",U.add(Ue);const Ve=w.clone().multiplyScalar(.8),Ye=s.clone().lerp(w,.4).multiplyScalar(.8),q=G.clone(),I=new t.Vector3,Y=new t.Vector3;for(let e=0;e<3;e++){const o=W[e],r=W[e+1],l=ie[e],m=a.range(0,C/l);for(let p=0;p<l;p++){const M=m+p/l*C,P=a.range(.8,2.2);j(o.radius-7.3*o.scale,M,o.y-3.9*o.scale,I),j(r.radius+7.9*r.scale,M+B*(1+.25*e),r.y+4.4*r.scale,Y);const V=a.range(11,15);ge(I,Y,V,2.35).forEach((L,F)=>{const ve=F%8===4;Z(L.p,ve?2.6:1.9,ve?q:F%2?Ve:Ye,ve?1:0,P,2.4*L.t*(1-L.t))}),ge(I,Y,V+a.range(8,11),2.6).forEach((L,F)=>Z(L.p,F%4===2?1.7:1.15,F%4===2?Ye:q,F%4===2?0:1,P+.5,3.2*L.t*(1-L.t)))}}for(let e=1;e<4;e++){const o=W[e],r=[0,-.21,.21,0][e];for(let l=0;l<8;l++){const m=Math.PI/8+l*Math.PI/4+r,p=a.range(.3,1.2);j(31,m,608.4,I),j(o.radius-7.8*o.scale,m,o.y+4.4*o.scale,Y),ge(I,Y,I.distanceTo(Y)*.085,3).forEach((P,V)=>Z(P.p,V%6===3?2.9:2.2,V%6===3?q:Ve,V%6===3?1:0,p,1.6*P.t*(1-P.t)))}}const he=W[3],Oe=[],J=[];for(let e=0;e<4;e++){const o=Math.PI/4+e*Math.PI/2;j(he.radius-6.4*he.scale,o,he.y-4.6*he.scale,I),j(1.7,o,421.4,Y),Oe.push(I.clone()),ge(I,Y,5,1.6).forEach((r,l)=>{K.copy(r.p),Z(K,l%2?1.2:1.9,q,3,r.t,0),l%5===2&&r.t<.95&&J.push(r.p.x,r.p.y-.9,r.p.z,a.range(2.4,3.8))})}for(let e=0;e<H;e++)Z(j(k.radius,(e+.5)/H*C,(Q+_)/2-1,K),3,q,1,0,0);if(ce)for(let e=0;e<40;e++){const o=e/40*C;Z(K.set(Math.cos(o)*9.15,re+Math.sin(o)*9.15,0),e%5?.8:1.3,e%5?Ve:q,e%5?0:1,0,0)}const ze=Pe.length/4,ee=yt();ee.setAttribute("aPS",new t.InstancedBufferAttribute(new Float32Array(Pe),4)),ee.setAttribute("aCol",new t.InstancedBufferAttribute(new Float32Array(_e),4)),ee.setAttribute("aAux",new t.InstancedBufferAttribute(new Float32Array(Ie),2)),ee.instanceCount=ze,ee.boundingSphere=d;const je=new t.Mesh(ee,xe(S,dt,ft,{side:t.DoubleSide}));je.name="pearls",U.add(je),await n.yield?.();for(let e=0;e<J.length;e+=4)pe(J[e],J[e+1],J[e+2],J[e+3]*.42,J[e+3],0,fe(X).lerp(v,.25));const Ge=Se.length/3,te=ht();te.setAttribute("aTop",new t.InstancedBufferAttribute(new Float32Array(Se),3)),te.setAttribute("aSc",new t.InstancedBufferAttribute(new Float32Array(ke),4)),te.setAttribute("aTint",new t.InstancedBufferAttribute(new Float32Array(Be),3)),te.instanceCount=Ge,te.boundingSphere=d;const Qe=new t.Mesh(te,xe(S,ut,vt));Qe.name="crystals",U.add(Qe),await n.yield?.();const ue=[];for(const e of[34,29,24,19,14,9,4.5,0]){const o=e*Math.PI/180;ue.push(new t.Vector3(0,Ze-Je*Math.cos(o),Je*Math.sin(o)))}ue.push(new t.Vector3(0,re,-30),new t.Vector3(0,re,-60));const et={portalSeat:{position:new t.Vector3(0,re,0),normal:new t.Vector3(0,0,1),travel:new t.Vector3(0,0,-1),radius:7},ropeAnchor:new t.Vector3(0,Ze,0),catchPlatform:ue[0].clone(),flyThrough:ue,approach:[new t.Vector3(0,432,420),new t.Vector3(0,428,300),new t.Vector3(0,432,190),ue[0].clone()],gates:[0,Math.PI/2,Math.PI,Math.PI*1.5],gateHalfAngle:De,clearBelow:445,rings:z,chainTops:Oe,viewpoints:{reveal:new t.Vector3(-150,438,520),under:new t.Vector3(40,425,185),inside:new t.Vector3(0,470,40),rim:new t.Vector3(262,560,262)},glowPoints:We},tt=Ae.index.count/3+Ge*8+Te*($.attributes.position.count/3)+ze*2,at=new t.Vector2;return{object:U,radius:262,height:218,center:new t.Vector3(0,490,0),anchors:et,ground:!1,groundY:0,uniforms:S,info:{rings:z,crystals:Ge,beads:ze,arms:Te,triangles:Math.round(tt),curtainStyle:T},setProgress(e){S.uProgress.value=Math.min(1,Math.max(0,e))},setSun(e,o,r=1.5){e&&S.uSunDir.value.copy(e).normalize(),o&&S.uSunCol.value.set(o).multiplyScalar(r)},update(e,o,r){if(S.uTime.value=o,r&&r.projectionMatrix){let l=1080;n.renderer&&n.renderer.getDrawingBufferSize&&(l=n.renderer.getDrawingBufferSize(at).y||1080),S.uPix.value=2/(r.projectionMatrix.elements[5]*l)}},dispose(){}}}export{xt as buildHero};
