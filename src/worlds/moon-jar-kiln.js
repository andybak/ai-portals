import*as U from"three";import{makePath as n0,clamp as dt,lerp as tt,smoothstep as Y,hashSeed as r0}from"../kit/core.js";import{makeSky as i0,skyDirection as It}from"../kit/sky.js";import*as bt from"../kit/fx.js";import{buildHero as c0,latheGeometry as l0,jarProfile as h0}from"../parts/moon-jar-kiln.js";const yt=Math.PI,At=yt*2,K=U.Vector3,f0=["#EDF3F9","#8097B4","#1A1210","#FFF2C4","#FF9B30","#A6261A","#6E4B38"],_=s=>{const o=new U.Color(s);return[o.r,o.g,o.b]},D=(s,o)=>[s[0]*o,s[1]*o,s[2]*o],Le=(s,o,n)=>[tt(s[0],o[0],n),tt(s[1],o[1],n),tt(s[2],o[2],n)],u0=[{name:"snowfall",snow:1,sky:{preset:"overcast",zenith:"#dfe8f2",mid:"#bccbdd",horizon:"#8da3bf",ground:"#8097B4",sunIntensity:0,sunGlow:0,veil:0,scatter:0,clouds:!1,clouds2:!1},fog:"#b9c8da",fogD:.004,skyC:[.8,.88,1],gndC:[.44,.52,.66],sunC:[.1,.1,.09],sunDir:It(55,-150),fire:[3.4,1.6,.52],shadow:0,sparkle:.15,drift:[.12,1],flue:"#a4c0ec",jets:0,sparrows:5,fruit:6,exposure:1,portal:"#d8e8ff",warmth:0,haze:1,reach:160},{name:"morning",snow:1,sky:{preset:"day",zenith:"#4f86c8",mid:"#9cc0e6",horizon:"#f2dcc0",ground:"#c9d6e6",sunElevation:19,sunAzimuth:-150,sunColor:"#ffe2b0",sunIntensity:9,sunGlow:.6,scatterColor:"#ffd9a8",scatter:.4,clouds:!1,clouds2:{coverage:.3,stretch:1,opacity:.5}},fog:"#d3deeb",fogD:.0024,skyC:[.42,.56,.86],gndC:[.36,.42,.56],sunC:[1,.8,.52],sunDir:It(19,-150),fire:[2.2,1.05,.36],shadow:1,sparkle:1,drift:[.45,.55],flue:"#d6e6ff",jets:0,sparrows:5,fruit:6,exposure:.96,portal:"#cfe6ff",warmth:-.5,haze:.8,reach:185},{name:"dusk",snow:.16,sky:{preset:"sunset",zenith:"#5d6688",mid:"#9a8798",horizon:"#dba392",ground:"#6b6470",sunElevation:-5,sunAzimuth:30,sunIntensity:0,sunGlow:.25,scatterColor:"#ff9e86",scatter:.5,clouds:!1,clouds2:{coverage:.42,stretch:1,opacity:.7,lit:"#f6b9a6",shade:"#7a6c86"}},fog:"#a98f97",fogD:.0034,skyC:[.5,.44,.56],gndC:[.32,.25,.26],sunC:[.3,.16,.12],sunDir:It(8,30),fire:[2.9,1.35,.45],shadow:0,sparkle:.3,drift:[.5,0],flue:"#c394d6",jets:.35,sparrows:5,fruit:40,exposure:1.05,portal:"#ffd6c8",warmth:.75,haze:1.4,reach:160},{name:"night",snow:1,sky:{preset:"night",zenith:"#040917",mid:"#0a1430",horizon:"#1a2a4c",ground:"#0d1526",bodies:[],stars:1.15,twinkle:.9,milkyWay:.55,clouds:!1,clouds2:!1},fog:"#0c1426",fogD:.003,skyC:[.085,.13,.26],gndC:[.035,.05,.1],sunC:[.05,.07,.13],sunDir:It(40,-120),fire:[4.2,1.9,.6],shadow:0,sparkle:.8,drift:[.5,.85],flue:"#3d62e6",jets:1,sparrows:0,fruit:6,exposure:1.08,portal:"#9fb8ff",warmth:-.85,haze:.66,reach:270}],Ee={day:0,dawn:1,golden:2,night:3};class Xt{constructor(o=!1){this.p=[],this.n=[],this.uv=[],this.c=[],this.a=[],this.i=[],this.c2=o?[]:null,this.count=0,this.fr=[0,0,0,1,0],this.col2=[0,0,0]}at(o=0,n=0,f=0,m=0){return this.fr=[o,n,f,Math.cos(m),Math.sin(m)],this}v(o,n,f,m,h,g,t,c,v,C,M=1,b=0){const d=this.fr,z=d[3],l=d[4];return this.p.push(d[0]+o*z+f*l,d[1]+n,d[2]-o*l+f*z),this.n.push(m*z+g*l,h,-m*l+g*z),this.uv.push(t,c),this.c.push(v[0],v[1],v[2]),this.a.push(C,M,b),this.c2&&this.c2.push(this.col2[0],this.col2[1],this.col2[2]),this.count++}quad(o,n,f,m){this.i.push(o,n,f,o,f,m)}face(o,n,f,m,h=1,g=0){const t=o[1][0]-o[0][0],c=o[1][1]-o[0][1],v=o[1][2]-o[0][2],C=o[3][0]-o[0][0],M=o[3][1]-o[0][1],b=o[3][2]-o[0][2];let d=c*b-v*M,z=v*C-t*b,l=t*M-c*C;const y=Math.hypot(d,z,l)||1;d/=y,z/=y,l/=y;const a=o.map((i,e)=>this.v(i[0],i[1],i[2],d,z,l,n[e][0],n[e][1],Array.isArray(f[0])?f[e]:f,m,Array.isArray(h)?h[e]:h,Array.isArray(g)?g[e]:g));this.quad(a[0],a[1],a[2],a[3])}box(o,n,f,m,h,g,t,c,v,C=1,M=1,b=v){const d=Math.cos(t),z=Math.sin(t),l=m/2,y=h/2,a=g/2,i=o*3.7+f*1.9+n,e=(q,G,E)=>{const V=G>0?M:1;return[o+q*V*d+E*V*z,n+G,f-q*V*z+E*V*d]},x=m>=g,W=D(c,.62),S=(q,G,E,V,I,nt,$=c)=>this.face([q,G,E,V],I,$,nt,C),N=x?m:g,F=x?g:m,st=x?[[i,0],[i+N,0],[i+N,F],[i,F]]:[[i,0],[i,F],[i+N,F],[i+N,0]];S(e(-l,y,a),e(l,y,a),e(l,y,-a),e(-l,y,-a),x?st:[[i,0],[i,F],[i+N,F],[i+N,0]],v),S(e(-l,-y,-a),e(l,-y,-a),e(l,-y,a),e(-l,-y,a),st,v,W);const ft=[[i,F],[i+N,F],[i+N,F+h],[i,F+h]],L=[[-F/2,-y],[F/2,-y],[F/2,y],[-F/2,y]];S(e(-l,-y,a),e(l,-y,a),e(l,y,a),e(-l,y,a),x?ft:L,x?v:b),S(e(l,-y,-a),e(-l,-y,-a),e(-l,y,-a),e(l,y,-a),x?ft:L,x?v:b),S(e(l,-y,a),e(l,-y,-a),e(l,y,-a),e(l,y,a),x?L:ft,x?b:v),S(e(-l,-y,-a),e(-l,-y,a),e(-l,y,a),e(-l,y,-a),x?L:ft,x?b:v)}tube(o,n,f,m,h,g,t,c=1,v=0,C=0,M=!1,b=g){const d=n[0]-o[0],z=n[1]-o[1],l=n[2]-o[2],y=Math.hypot(d,z,l)||1,a=[d/y,z/y,l/y];let i=a[1],e=-a[0],x=0;(Math.abs(a[2])>.9||Math.hypot(i,e)<.2)&&(i=0,e=a[2],x=-a[1]);const W=Math.hypot(i,e,x)||1;i/=W,e/=W,x/=W;const S=a[1]*x-a[2]*e,N=a[2]*i-a[0]*x,F=a[0]*e-a[1]*i,st=this.count,ft=o[0]*1.3+o[2]*.7;for(let L=0;L<2;L++)for(let q=0;q<=h;q++){const G=q/h*At,E=Math.cos(G),V=Math.sin(G),I=L?m:f,nt=L?n:o,$=i*E+S*V,Q=e*E+N*V,Ct=x*E+F*V;this.v(nt[0]+$*I,nt[1]+Q*I,nt[2]+Ct*I,$,Q,Ct,ft+L*y,G*Math.max(f,m),L?b:g,t,c,L?C:v)}for(let L=0;L<h;L++){const q=st+L,G=q+h+1;this.i.push(q,G,q+1,q+1,G,G+1)}if(M)for(let L=0;L<2;L++){const q=L?n:o,G=L?m:f,E=L?1:-1,V=this.count;this.v(q[0],q[1],q[2],a[0]*E,a[1]*E,a[2]*E,0,0,L?b:g,M===!0?t:M,c,L?C:v);for(let I=0;I<=h;I++){const nt=I/h*At,$=Math.cos(nt),Q=Math.sin(nt);this.v(q[0]+(i*$+S*Q)*G,q[1]+(e*$+N*Q)*G,q[2]+(x*$+F*Q)*G,a[0]*E,a[1]*E,a[2]*E,$*G,Q*G,L?b:g,M===!0?t:M,c,L?C:v)}for(let I=0;I<h;I++)L?this.i.push(V,V+1+I,V+2+I):this.i.push(V,V+2+I,V+1+I)}}blob(o,n,f,m,h,g,t,c,v,C,M=1,b=0,d=null){const z=this.count;for(let l=0;l<=c;l++)for(let y=0;y<=t;y++){const a=l/c*yt,i=y/t*At,e=Math.cos(a),x=Math.sin(a),W=x*Math.cos(i),S=x*Math.sin(i),N=d?d(W,e,S):1,F=typeof v=="function"?v(W,e,S):v;this.v(o+W*m*N,n+e*h*N,f+S*g*N,W/m,e/h,S/g,i*m,a*h,F,C,M,b)}for(let l=0;l<c;l++)for(let y=0;y<t;y++){const a=z+l*(t+1)+y,i=a+t+1;this.i.push(a,a+1,i,a+1,i+1,i)}}steps(o){return[()=>o.setAttribute("position",new U.Float32BufferAttribute(this.p,3)),()=>o.setAttribute("normal",new U.Float32BufferAttribute(this.n,3)),()=>o.setAttribute("uv",new U.Float32BufferAttribute(this.uv,2)),()=>o.setAttribute("color",new U.Float32BufferAttribute(this.c,3)),()=>{o.setAttribute("aAux",new U.Float32BufferAttribute(this.a,3)),this.c2&&o.setAttribute("color2",new U.Float32BufferAttribute(this.c2,3))},()=>o.setIndex(this.i),()=>o.computeBoundingSphere()]}build(){const o=new U.BufferGeometry;for(const n of this.steps(o))n();return o}async buildSlowly(o){const n=new U.BufferGeometry;for(const f of this.steps(n))f(),await o.yield();return n}get triangles(){return this.i.length/3}}const je=`
uniform vec3 uSkyC, uGndC, uSunC, uSunDir, uFogC, uFireC, uSnowC;
uniform float uFogD, uTime, uSnow, uSpark;
uniform vec2 uDrift;             // depth of the smoke's wandering shadow, amount of spindrift
float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p+34.345); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash21(i), hash21(i+vec2(1.,0.)), f.x), mix(hash21(i+vec2(0.,1.)), hash21(i+vec2(1.,1.)), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++){ s += a*vnoise(p); p = p*2.03+vec2(17.1, 9.2); a *= .5; } return s; }
float fireFlicker(){ return .84+.16*sin(uTime*7.3)*sin(uTime*4.1+1.)+.06*sin(uTime*13.7); }
// the fire mouth as a light: an apricot fan thrown out over the yard
vec3 fireLight(vec3 P, vec3 N){
  vec3 tf = vec3(0., 8., 1.)-P; float df = max(length(tf), 1e-3);
  float fan = smoothstep(-4., 8., P.z)*smoothstep(-.25, .55, -tf.z/df);
  // and a glow that hugs the kiln front: embers, sparks and hot clay light whatever stands against the face
  float hug = .11*exp(-max(abs(P.x)-8., 0.)/17.)*smoothstep(19., 4., P.z)*step(-1., P.z)*smoothstep(44., 8., P.y)*(.6+.4*N.z);
  return uFireC*fireFlicker()*(fan*max(dot(N, tf/df)*.75+.25, 0.)/(1.+df*df/620.)+hug);
}
// the kiln's smoke going over on the wind: its shadow wanders across everything the sun (or moon) reaches
float smokeShade(vec3 P){
  vec2 q = P.xz-uSunDir.xz/max(uSunDir.y, .2)*P.y;
  float s = fbm(vec2(q.x*.021-uTime*.24, q.y*.027+uTime*.05));
  return 1.-uDrift.x*smoothstep(.36, .66, s);
}
vec3 yardFog(vec3 col, float dist){ return mix(col, uFogC, 1.-exp(-uFogD*uFogD*dist*dist)); }
`,Pe=`
attribute vec3 color; attribute vec3 aAux;
#ifdef BIRD
attribute vec3 color2; attribute vec4 aBird;
#endif
uniform float uTime;
varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec3 vCol; varying vec3 vAux; varying vec2 vUv; varying float vDist;
void main(){
  vec3 p = position, n = normal, col = color, aux = aAux;
  #ifdef BIRD
    float wing = aAux.y, tail = aAux.z, spread = aBird.y;
    col = mix(color, color2, aBird.x);
    if (abs(wing) > .5){
      vec3 sh = vec3(wing*.13, .07, .08), r = p-sh;
      float a = wing*1.42*(1.-spread), ca = cos(a), sa = sin(a);
      r = vec3(r.x*ca+r.z*sa, r.y, -r.x*sa+r.z*ca)*mix(.8, 1., spread);
      float b = wing*aBird.z*spread, cb = cos(b), sb = sin(b);
      r = vec3(r.x*cb-r.y*sb, r.x*sb+r.y*cb, r.z);
      p = sh+r; n = vec3(0., 1., 0.);
    }
    if (tail > .5){ float back = max(-.24-p.z, 0.); p.z -= back*.85*aBird.x; p.y += back*(1.+.85*aBird.x)*aBird.w; }
    aux = vec3(6., 0., 0.);
  #endif
  vL = p;
  vec4 wp = vec4(p, 1.);
  #ifdef USE_INSTANCING
    wp = instanceMatrix*wp; n = mat3(instanceMatrix)*n;
  #endif
  wp = modelMatrix*wp;
  float sw = aux.z;
  wp.x += sw*(sin(uTime*2.1+wp.x*.31+wp.z*.17)*.6+sin(uTime*5.3+wp.z*.9+wp.y*.4)*.3);
  wp.z += sw*sin(uTime*1.7+wp.x*.23+wp.y*.3)*.45;
  vW = wp.xyz; vN = n; vCol = col; vAux = aux; vUv = uv;
  vec4 mv = viewMatrix*wp; vDist = length(mv.xyz);
  gl_Position = projectionMatrix*mv;
}`,qe=`
${je}
varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec3 vCol; varying vec3 vAux; varying vec2 vUv; varying float vDist;
void main(){
  vec3 N = normalize(vN+vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
  float mat = vAux.x, emis = 0., gloss = 0., dimK = 1., fireK = 1.;
  vec3 glowAdd = vec3(0.);
  vec3 alb = vCol;
  if (mat < .5){
    alb *= .78+.44*fbm(vW.xz*.45+vW.y*.37);
  } else if (mat < 1.5){
    // sawn pine: grain along uv.x, plank seams, knots
    float g = vnoise(vec2(vUv.x*.16, vUv.y*4.2)), g2 = vnoise(vec2(vUv.x*.7, vUv.y*15.));
    vec2 kc = vec2(vUv.x*.09, vUv.y*.55); float knot = smoothstep(.16, .05, length(fract(kc)-.5))*step(.72, hash21(floor(kc)));
    float seam = smoothstep(.07, .0, abs(fract(vUv.y/3.3)-.5));
    alb *= (.6+.5*g+.22*g2)*(1.-.55*seam)*(1.-.5*knot);
    alb = mix(alb, alb*vec3(.72, .78, .9), smoothstep(.55, .8, fbm(vUv*.08))*.5);      // weathered grey
  } else if (mat < 2.5){
    // a raw, unfired jar: matt chalk with throwing rings, the seam at the waist, damp patches near the foot
    float t = vL.y; vec2 dir = normalize(vL.xz+vec2(1e-5, 0.));
    float n1 = vnoise(dir*2.6+vW.xz*.11), n2 = vnoise(vec2(dir.x*9.+dir.y*5., t*14.));
    float rings = sin(t*150.+n1*4.)*.55+sin(t*61.+n1*9.)*.45;
    N = normalize(N+vec3(0., rings*.07*smoothstep(90., 12., vDist)*smoothstep(.02, .2, t), 0.));
    float seam = smoothstep(.016, .0, abs(t-.5+.004*(n2-.5)));
    float damp = smoothstep(.34, .0, t+(n1-.5)*.3);
    alb *= (.9+.14*n2)*(1.-.16*seam)*(1.-.07*rings*smoothstep(60., 10., vDist))*mix(vec3(1.), vec3(.78, .76, .74), damp*.7);
    alb *= 1.-.10*smoothstep(.55, .9, vnoise(vec2(dir.x*5.+dir.y*3., t*7.)+vW.xz*.2));
    alb *= mix(.7, 1., smoothstep(.0, .42, t));
  } else if (mat < 3.5){
    // end grain of split pine: rings round the heart, checks, a bark rim
    float r = length(vUv), an = atan(vUv.y, vUv.x+1e-4);
    float ring = .5+.5*sin(r*11.+vnoise(vUv*1.7+vW.yz*.3)*5.);
    float chk = smoothstep(.9, 1., sin(an*7.+hash21(floor(vW.yz*.4))*6.))*smoothstep(.2, 1.2, r);
    alb *= (.74+.3*ring)*(1.-.45*chk)*(.85+.3*vnoise(vW.yz*.9));
    alb = mix(alb, alb*vec3(1.1, .78, .5), smoothstep(.0, .7, r)*.25);
  } else if (mat < 4.5){
    // thatch: straw running down the slope (uv.y), laid in courses
    float s1 = vnoise(vec2(vUv.x*4.5, vUv.y*.3)), s2 = vnoise(vec2(vUv.x*13., vUv.y*.9+3.));
    float course = fract(vUv.y/3.4);
    alb *= (.5+.45*s1+.3*s2)*(.55+.45*smoothstep(.0, .3, course))*(1.-.3*smoothstep(.9, 1., course));
  } else if (mat < 5.5){
    // bark: furrows along the limb, plates across
    float f = vnoise(vec2(vUv.x*.14, vUv.y*2.4)), pl = vnoise(vec2(vUv.x*.55, vUv.y*5.5)), fib = vnoise(vec2(vUv.x*.05, vUv.y*11.));
    float fur = smoothstep(.42, .5, f)*(1.-smoothstep(.5, .6, f));
    alb *= (.42+.8*f)*(.74+.4*pl)*(.8+.35*fib)*(1.-.5*fur);
    N = normalize(N+vec3(0., (pl-.5)*.5, 0.)+N*(f-.5)*.6);
  } else if (mat < 6.5){
    gloss = .35;
  } else if (mat < 7.5){
    emis = .55; gloss = .5;
  } else if (mat < 8.5){
    gloss = 1.4; emis = .25;
  } else if (mat < 9.5){
    alb = uSnowC;
  } else {
    // the kiln's clay skin: hand-daubed lumps, drying cracks, streaks; the fire licks the arch's edge
    float lump = fbm(vUv*.42), fine = vnoise(vUv*2.3);
    // pats of clay pressed on by hand: pillowed cells; the drying cracks open along some of their joints
    vec2 cu = vUv*.24+vec2(fbm(vUv*.11)*1.3, fbm(vUv*.11+9.)*1.3), ci = floor(cu), cf = fract(cu);
    float m1 = 9., m2 = 9.;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
      vec2 g = vec2(float(i), float(j)), o = vec2(hash21(ci+g), hash21(ci+g+7.3));
      vec2 r = g+o-cf; float dd = dot(r, r);
      if (dd < m1){ m2 = m1; m1 = dd; } else if (dd < m2){ m2 = dd; }
    }
    float ed = sqrt(m2)-sqrt(m1);
    float open_ = smoothstep(.38, .62, vnoise(vUv*.085+vec2(3., 7.)));
    float crack = smoothstep(.05+.10*open_, .0, ed)*(.35+.65*open_);
    float pat = smoothstep(.0, .45, ed);
    float streak = vnoise(vec2(vUv.x*.7, vUv.y*.045));
    alb *= (.55+.55*lump+.16*fine)*(.72+.28*pat)*(1.-.8*crack)*(.80+.3*streak)*.95;
    dimK = .5;
    if (vW.z > .6){
      // the face round the fire mouth: soot-black at the arch and in a fan climbing above it; the fire is inside,
      // so the face itself takes none of its light, only a thin lick at the arch's edge
      float ad = (vW.y < 12. ? abs(vW.x)-8. : length(vec2(vW.x, vW.y-12.))-8.);
      float upK = smoothstep(8., 30., vW.y);
      float reach = 3.2+upK*(15.+7.*fbm(vec2(vW.x*.16, vW.y*.05)))*smoothstep(15., 3., abs(vW.x)-upK*5.);
      float soot = smoothstep(1., .15, max(ad, 0.)/reach);
      // under its daub the face is laid in clay brick: the courses show where the daub has fallen away
      vec2 bu = vW.xy/vec2(3.4, 1.3); bu.x += .5*mod(floor(bu.y), 2.); vec2 bf = fract(bu);
      float bm = smoothstep(.0, .05, bf.x)*smoothstep(1., .95, bf.x)*smoothstep(.0, .11, bf.y)*smoothstep(1., .89, bf.y);
      float bh = hash21(floor(bu)), bt = .62+.7*bh, bn = fbm(vW.xy*.07+3.), bare = smoothstep(.44, .60, bn);
      // bricks of every firing: plum, tan, a few burnt blue-black, their faces pitted
      vec3 brick = mix(vec3(.30, .17, .11), vec3(.34, .23, .15), step(.72, hash21(floor(bu)+5.)))*bt*(.3+.7*bm)*(.7+.6*lump);
      brick = mix(brick, vec3(.07, .065, .075)*(.6+.8*fine), step(.88, hash21(floor(bu)+9.))*bm);
      // the daub that still clings is paler than the brick under it, and throws a line of shadow where it has broken away
      alb = mix(alb*vec3(1.25, 1.18, 1.05), brick, .10+.86*bare)*(1.-.5*smoothstep(.04, .0, abs(bn-.50)));
      alb = mix(alb*.9, vec3(.022, .018, .016)*(.6+.8*lump)*(.5+.5*bm), soot*.96);
      // the mouth's light lies on the jambs and the arch ring and dies away within a few metres: beyond it the face keeps the sky's light
      float spill = exp(-max(ad, 0.)/4.6)*smoothstep(40., 8., vW.y)+.16*exp(-max(ad, 0.)/15.)*smoothstep(30., 0., vW.y);
      glowAdd = (vec3(1., .40, .10)*.30*exp(-max(ad, 0.)/.9)+alb*uFireC*spill*.85)*fireFlicker();
      dimK = 1.25; fireK = .12;
    }
  }
  float sn = fbm(vW.xz*.23+vW.y*.11);
  float cap = vAux.y*uSnow*smoothstep(.36, .68, N.y+(sn-.5)*.5);
  if (mat > 8.5 && mat < 9.5) cap = max(cap, uSnow);
  alb = mix(alb, uSnowC*(.9+.12*sn), cap);
  // light: sky above, snow bounce below, a weak or low sun, the fire mouth
  float up = N.y*.5+.5;
  vec3 L = mix(uGndC, uSkyC, up)*(.55+.45*smoothstep(-.2, .5, N.y+.3*cap))*dimK;
  float nl = max(dot(N, uSunDir), 0.);
  L += uSunC*nl*smokeShade(vW);
  L += fireLight(vW, N)*fireK;
  vec3 V = normalize(cameraPosition-vW);
  float ndv = clamp(dot(N, V), 0., 1.);
  vec3 col = alb*L+glowAdd;
  col += alb*emis*(uSkyC*.6+uSunC*.5+vec3(.12, .06, .02));
  col += (uSkyC*.5+uSunC*pow(max(dot(reflect(-V, N), uSunDir), 0.), 24.)*1.6)*gloss*pow(1.-ndv, 3.)*.5;
  // sparkle on snow
  vec2 sc = floor(vW.xz*3.+vW.y*2.); float sp = step(.985, hash21(sc))*step(.5, cap);
  col += (uSunC+uSkyC*.3)*sp*uSpark*pow(max(sin(uTime*2.+hash21(sc+7.)*40.+dot(V.xz, vec2(9., 7.))), 0.), 6.)*smoothstep(70., 15., vDist)*1.4;
  gl_FragColor = vec4(yardFog(col, vDist), 1.);
}`,Ge=7,ne=14,d0=`
varying vec3 vW; varying vec3 vN; varying float vDist;
void main(){
  vW = position; vN = normal;
  vec4 mv = modelViewMatrix*vec4(position, 1.); vDist = length(mv.xyz);
  gl_Position = projectionMatrix*mv;
}`,p0=`
${je}
uniform vec4 uBoard[${Ge}];      // centre x, centre z, half length, yaw
uniform vec4 uJar[${ne}];        // x, z, foot height, top height (the fourteen jars of the aisle)
uniform vec2 uTrail[5];
uniform vec3 uShOff;             // shadow offset in x and z per metre of height, strength of cst shadows
uniform float uLeaves;
varying vec3 vW; varying vec3 vN; varying float vDist;
float segDist(vec2 p, vec2 a, vec2 b, out float along){
  vec2 ab = b-a; float l = max(length(ab), 1e-3); vec2 d = ab/l; along = clamp(dot(p-a, d), 0., l);
  return dot(p-a, vec2(-d.y, d.x));
}
void main(){
  vec2 p = vW.xz;
  float n1 = fbm(p*.028), n2 = fbm(p*.17+7.), n3 = vnoise(p*1.4), n4 = fbm(p*.17+31.);
  // where the snow lies: not under the shed roof, not in the wet band the kiln has melted
  float roofed = smoothstep(58., 48., abs(p.x)+(n2-.5)*9.)*smoothstep(24., 12., p.y+(n1-.5)*16.);
  float snowK = clamp(mix(smoothstep(1.-uSnow*1.6, 1.15-uSnow, n2*.6+n3*.4), 1., step(.99, uSnow)), 0., 1.)*(1.-roofed);
  // the trodden line: a trough of packed snow with oval prints left and right
  float lat = 99., s = 0., acc = 0., al;
  for (int i = 0; i < 4; i++){
    float d = segDist(p, uTrail[i], uTrail[i+1], al);
    float seg = length(uTrail[i+1]-uTrail[i]);
    float e = length(p-(uTrail[i]+normalize(uTrail[i+1]-uTrail[i]+vec2(1e-4, 0.))*al));
    if (e < abs(lat)){ lat = sign(d+1e-4)*e; s = acc+al; }
    acc += seg;
  }
  float k = floor(s/7.), side = mod(k, 2.)*2.-1.;
  vec2 q = vec2(fract(s/7.)*7.-3.5, lat-side*2.1);
  float pr = length(q/vec2(3.3, 1.4));
  float print = smoothstep(1., .7, pr);
  float trough = smoothstep(8., 3., abs(lat))*.22;
  // stray prints round the boards
  vec2 cg = floor(p/9.); vec2 cq = fract(p/9.)*9.-4.5-vec2(hash21(cg)-.5, hash21(cg+3.)-.5)*4.;
  float ca = hash21(cg+9.)*6.28; cq = vec2(cq.x*cos(ca)+cq.y*sin(ca), -cq.x*sin(ca)+cq.y*cos(ca));
  float stray = smoothstep(1., .6, length(cq/vec2(2.6, 1.05)))*step(.62, hash21(cg+5.))*smoothstep(75., 30., abs(p.x))*smoothstep(-5., 20., p.y);
  print = max(print*step(abs(lat), 6.), stray);
  // drifts
  vec3 N = normalize(vN+vec3((n2-.5)*.5+(n3-.5)*.12, 0., (n4-.5)*.5)*snowK+vec3(0., 1e-4, 0.));
  N = normalize(N+vec3(0., -.35, 0.)*print*snowK);
  float hol = smoothstep(.6, .28, n2)*(.6+.4*smoothstep(.35, .6, n1));
  vec3 snowAlb = uSnowC*(.93+.09*n3)*mix(vec3(1.), vec3(.56, .68, .9), clamp(hol*.7+trough+print*.9, 0., .95))*(1.-.22*print);
  // earth: trodden clay and sand, wet and dark close to the kiln
  float wet = smoothstep(26., 2., p.y)*smoothstep(60., 30., abs(p.x));
  vec3 earth = mix(vec3(.21, .15, .105), vec3(.30, .235, .16), smoothstep(.4, .7, n2))*(.62+.6*n3)*mix(1., .45, wet*(.5+.5*n1));
  earth = mix(earth, earth*vec3(.75, .9, 1.25)+.035, uSnow*.25*smoothstep(.5, .8, n3));    // frost on the clods
  vec2 eg = floor(p/1.3); vec2 eq = fract(p/1.3)-.5-(vec2(hash21(eg+11.), hash21(eg+12.))-.5)*.5; float ea = hash21(eg+13.)*6.28;
  eq = vec2(eq.x*cos(ea)+eq.y*sin(ea), -eq.x*sin(ea)+eq.y*cos(ea)); float eh = hash21(eg+14.);
  float chip = smoothstep(.5, .38, max(abs(eq.x)*(1.2+2.*eh), abs(eq.y)*3.4))*step(.62, eh);
  earth = mix(earth, mix(vec3(.46, .33, .2), vec3(.62, .5, .34), hash21(eg+15.))*(.7+.4*n3), chip*.85);       // bark and wood chips
  float peb = smoothstep(.3, .18, length(fract(p/.8+vec2(hash21(eg), .3))-.5))*step(.8, hash21(floor(p/.8)+3.));
  earth = mix(earth, vec3(.2, .19, .18)*(.6+.8*eh), peb*.7);
  earth *= 1.-.45*print*(1.-.6*smoothstep(.55, .75, pr));
  // fallen leaves (late autumn)
  vec2 lg = floor(p/2.6); vec2 lq = fract(p/2.6)-.5-(vec2(hash21(lg+1.), hash21(lg+2.))-.5)*.5;
  float leaf = smoothstep(.34, .22, length(lq*vec2(1., 1.7+hash21(lg+4.))))*step(1.-uLeaves*(.25+.5*smoothstep(110., 30., length(p-vec2(66., 44.)))), hash21(lg));
  vec3 alb = mix(earth, snowAlb, snowK);
  alb = mix(alb, mix(vec3(.62, .22, .05), vec3(.75, .42, .08), hash21(lg+8.))*(.7+.5*n3), leaf);
  // shade under the drying boards (and their cst shadows when the sun is low), the jars' long shadows
  float shade = 0.;
  for (int i = 0; i < ${Ge}; i++){
    vec4 b = uBoard[i]; vec2 r = p-b.xy-uShOff.xy*4.2; float c = cos(b.w), sn = sin(b.w);
    vec2 l = vec2(r.x*c-r.y*sn, r.x*sn+r.y*c);
    shade = max(shade, smoothstep(6.5, 3.2, abs(l.x))*smoothstep(b.z+2., b.z-2., abs(l.y)));
  }
  float cst = 0.;
  #ifdef JAR_SHADOWS
  for (int i = 0; i < ${ne}; i++){
    vec4 j = uJar[i]; vec2 a = j.xy+uShOff.xy*(j.z+1.5), b = j.xy+uShOff.xy*j.w; float al2;
    vec2 ab = b-a; float h = clamp(dot(p-a, ab)/max(dot(ab, ab), 1e-3), 0., 1.);
    float d = length(p-a-ab*h);
    cst = max(cst, smoothstep(4.7, 3.3, d+h*.8)*(1.-.35*h));
  }
  cst *= uShOff.z;
  #endif
  shade = max(shade*mix(.62, .9, uShOff.z), cst*.85);
  // posts of the shed front
  shade = max(shade, .6*exp(-min(min(dot(p-vec2(13., 16.), p-vec2(13., 16.)), dot(p-vec2(-13., 16.), p-vec2(-13., 16.))), min(dot(p-vec2(39., 16.), p-vec2(39., 16.)), dot(p-vec2(-39., 16.), p-vec2(-39., 16.))))/26.));
  float up = N.y*.5+.5;
  vec3 amb = mix(uGndC, uSkyC, up);
  vec3 sun = uSunC*max(dot(N, uSunDir), 0.)*smokeShade(vW);
  vec3 L = amb*mix(1., .44, shade)*mix(vec3(1.), vec3(.66, .8, 1.1), shade)+sun*(1.-shade)*(1.-roofed*.9);
  L *= 1.-.55*roofed*smoothstep(30., -40., p.y);
  L += fireLight(vW, N)*1.25;
  vec3 col = alb*L;
  // spindrift: snow dust snaking low over the snow on the wind, left to right
  float sdr = fbm(vec2(p.x*.05-uTime*.62, p.y*.21+uTime*.07)+n1*2.);
  float veil = smoothstep(.47, .7, sdr)*snowK*uDrift.y*smoothstep(150., 40., vDist);
  col = mix(col, uSnowC*(amb*1.12+sun+fireLight(vW, vec3(0., 1., 0.))), veil*.62);
  vec3 V = normalize(cameraPosition-vW);
  vec2 sc = floor(p*2.6); float sp = step(.988, hash21(sc))*snowK;
  col += (uSunC*(1.-shade)+uSkyC*.35)*sp*uSpark*pow(max(sin(uTime*1.7+hash21(sc+7.)*40.+dot(V.xz, vec2(11., 8.))), 0.), 8.)*smoothstep(90., 12., vDist)*1.6;
  gl_FragColor = vec4(yardFog(col, vDist), 1.);
}`,rt=_("#8f6f4c"),Ie=_("#b89468"),_t=_("#dcbd8e"),it=_("#4a3628"),at=_("#6b5848"),St=_("#a68c5e"),v0=[.74,.7,.645],re=_("#77726c"),m0=_("#b48a3a"),b0=_("#1c3226"),Xe=[[-11.5,70,42,0,7],[11.5,70,42,0,7],[-48,84,31,.6,5],[-74,30,26,-.35,4],[58,122,31,-.5,5],[-96,96,25,1.35,4],[88,66,25,1.2,4]],ot=4.5,_e=9,Ot=[{z0:20,z1:-40,h:30},{z0:-36,z1:-124,h:54},{z0:-120,z1:-204,h:78},{z0:-200,z1:-290,h:110}],pt=52,wt=32,B=5,Z=(s,o)=>o+wt*(1-Math.abs(s)/pt),et={x0:26,x1:40,z0:34,z1:94,cell:2.6,rowH:2.5},Dt=[66,44];function y0(s,o,n,f){Xe.forEach((m,h)=>{const[g,t,c,v,C]=m,M=Math.cos(v),b=Math.sin(v);s.at(g,0,t,v);for(let z=-1;z<=1;z++){const l=o.range(.82,1.12);s.box(z*3.35,ot-.36,o.range(-.8,.8),3.2,.72,c*2+o.range(-1.6,1.6),0,D(z?rt:Ie,l),1,1,1,3)}const d=Math.max(3,Math.round(c*2/13));for(let z=0;z<d;z++){const l=-c+3.5+z*(c*2-7)/(d-1),y=o.range(.8,1.05);s.box(0,ot-1.05,l,10.6,.7,1.1,0,D(rt,y*.9),1,1,1,3);for(const a of[1,-1])for(const i of[1,-1])s.tube([a*5.6,0,l+i*2.2],[a*3.6,ot-1.3,l+i*.25],.5,.4,6,D(rt,y*.8),1,.4);for(const a of[1,-1])s.tube([a*4.9,1.5,l+1.5],[a*4.9,1.5,l-1.5],.26,.26,5,D(rt,y*.7),1,.4);s.tube([-4.6,1.9,l],[4.6,1.9,l],.3,.3,5,D(rt,y*.7),1,.4)}for(let z=0;z<C;z++){const l=-c+8+z*(c*2-16)/(C-1),y=o.range(-.35,.35),a=_e*o.range(.95,1.03);(h<2?n:f).push({x:g+y*M+l*b,y:ot,z:t-y*b+l*M,S:a,yaw:o()*At,tx:o.range(-.035,.035),tz:o.range(-.035,.035),sx:o.range(.975,1.025),sy:o.range(.94,1.04),sz:o.range(.975,1.025)})}}),s.at()}function w0(s,o,n,f,m){const h=f.snow>.5,g=D(St,.22);Ot.forEach((t,c)=>{const C=c===0?6:5,M=pt+3;for(const d of[1,-1]){const z=s.count,l=wt/pt,y=Math.hypot(1,l);for(let a=0;a<=C;a++)for(let i=0;i<=8;i++){const e=d*M*i/8,x=tt(t.z0+2.5,t.z1,a/C),W=n.n2(e*.06+c*9,x*.06),S=Z(e,t.h)+(h?1.6+1.3*W:.25*W)-(a===0?1.1:0)-(i===8?1:0),N=.85+.25*n.n2(e*.2,x*.2+5);s.v(e,S,x,d*l/y,1/y,a===0?.5:0,x,Math.abs(e)*y,h?[.9,.93,.98]:D(St,N),h?9:4,1)}for(let a=0;a<C;a++)for(let i=0;i<8;i++){const e=z+a*9+i,x=e+8+1;d>0?s.i.push(e,x,e+1,e+1,x,x+1):s.i.push(e,e+1,x,e+1,x+1,x)}for(let a=0;a<8;a++){const i=d*M*a/8,e=d*M*(a+1)/8,x=Z(i,t.h),W=Z(e,t.h),S=t.z0+2.5,N=a===7?.6:0;h&&s.face([[i,x-.6,S+.5],[e,W-.6-N,S+.5],[e,W+1.4-N,S-.4],[i,x+1.4,S-.4]],[[i,0],[e,0],[e,2],[i,2]],[.86,.9,.96],9,1),s.face([[i,x-B,S],[e,W-B,S],[e,W-(h?.5:0),S],[i,x-(h?.5:0),S]],[[i*3,0],[e*3,0],[e*3,40],[i*3,40]],D(St,.8),4,0)}s.face([[0,t.h+wt-B,t.z0+2.5],[d*M,Z(M,t.h)-B,t.z0+2.5],[d*M,Z(M,t.h)-B,t.z1],[0,t.h+wt-B,t.z1]],[[0,0],[0,60],[80,60],[80,0]],g,4,0),s.face([[d*M,Z(M,t.h)-B,t.z0+2.5],[d*M,Z(M,t.h)-B,t.z1],[d*M,Z(M,t.h)+(h?.4:0),t.z1],[d*M,Z(M,t.h)+(h?.4:0),t.z0+2.5]],[[0,0],[90,0],[90,40],[0,40]],D(St,.7),4,0);for(const a of[14,27,39])s.tube([d*a,Z(a,t.h)-B-.9,t.z0+3.2],[d*a,Z(a,t.h)-B-.9,t.z1],1,1,6,D(at,.55),5,0,0,0,3);if(c<3)for(let a=t.z0-4;a>t.z1+6;a-=26){if(c===0&&a>10)continue;const i=m(d*39,a),e=Z(39,t.h)-B-1.6;s.tube([d*39,i-1,a],[d*39,e,a],2,1.6,9,D(at,.8),5,0)}}const b=t.z0+1.2;for(const d of[1,-1])s.tube([0,t.h+wt-B-1.4,b],[d*(pt+1),t.h-B-.6,b],1.3,1.1,7,D(at,.7),5,0);s.tube([-pt+1,t.h-1.2,b-.4],[pt-1,t.h-1.2,b-.4],1.7,1.7,8,D(at,.75),5,0,0,0,3),s.tube([0,t.h,b-.4],[0,t.h+wt-B-2,b-.4],1.4,1.2,7,D(at,.7),5,0);for(const d of[1,-1])s.tube([d*4,t.h,b-.4],[d*26,t.h+wt*.5-B-1,b-.4],1,.9,6,D(at,.65),5,0)});for(const t of[-39,-13,13,39]){s.tube([t,1.2,16],[t,Ot[0].h-2.6,16],2.05,1.7,12,at,5,0),s.blob(t,.5,16,3.6,1.5,3.6,10,4,D(re,o.range(.8,1.1)),0,1,0,(c,v,C)=>1+.12*n.n3(c*2+t,v*2,C*2));for(const c of[9,20])s.tube([t,c,16],[t,c+.8,16],2.02-c*.012,2-c*.012,12,D(St,.7),4,0);s.tube([t-4.5,Ot[0].h-5.5,16.2],[t+4.5,Ot[0].h-5.5,16.2],.9,.9,6,D(at,.8),5,0,0,0,3)}if(f.name==="morning")for(let t=0;t<46;t++){const c=o.range(-pt,pt),v=Z(c,Ot[0].h)-B+.3,C=o.range(2,7)*(.6+.4*o());s.tube([c,v,22.6+o.range(-.3,.3)],[c+o.range(-.2,.2),v-C,22.6],.42,.03,5,[.75,.86,.98],8,0)}}async function x0(s,o,n){const f=et,m=Math.round((f.z1-f.z0)/f.cell),h=2.52,g=[];for(let t=0;t<m;t++){const c=12-(n.chance(.3)?1:0)-(t<2||t>m-3?n.int(1,3):0);for(let v=0;v<c;v++){const C=f.z0+(t+.5)*f.cell+(v&1?f.cell*.5:0),M=.2+v*f.rowH,b=n.int(0,3)*yt/2+n.range(-.09,.09),d=n.range(.75,1.1),z=f.x0+n.range(-.55,.5),l=f.x1+n.range(-.5,.55),y=[[0,0]];for(let i=0;i<=4;i++){const e=i/4*yt/2;y.push([Math.pow(Math.cos(e),.62)*h,Math.pow(Math.sin(e),.62)*h])}const a=y.map(i=>{const e=Math.cos(b),x=Math.sin(b),W=i[0]-h*.5,S=i[1]-h*.5;return[C+W*e-S*x,M+1.25+W*x+S*e,i[0],i[1]]});for(let i=0;i<a.length;i++){const e=a[i],x=a[(i+1)%a.length],W=i>=1&&i<=4;o.face([[z,e[1],e[0]],[l,e[1],e[0]],[l,x[1],x[0]],[z,x[1],x[0]]],[[z+t*3,i*2],[l+t*3,i*2],[l+t*3,i*2+2],[z+t*3,i*2+2]],W?D(it,d):D(_t,d*.6),W?5:1,1)}for(const i of[z,l])for(let e=1;e<a.length-1;e++)o.face([[i,a[0][1],a[0][0]],[i,a[e][1],a[e][0]],[i,a[e+1][1],a[e+1][0]],[i,a[e+1][1],a[e+1][0]]],[[0,0],[a[e][2],a[e][3]],[a[e+1][2],a[e+1][3]],[a[e+1][2],a[e+1][3]]],D(_t,d),3,.3)}o.box((f.x0+f.x1)/2,c*f.rowH/2-.3,f.z0+(t+.5)*f.cell+f.cell*.25,f.x1-f.x0-1.5,c*f.rowH-.6,f.cell*1.5+.05,0,[.085,.058,.04],0,0),g.push(.2+c*f.rowH),await s.yield()}for(const t of[f.z0-1.2,f.z1+1.2])for(const c of[f.x0+2,f.x1-2])o.tube([c,0,t],[c+n.range(-.6,.6),33,t],.9,.7,7,D(at,.8),5,.6);return g}async function g0(s,o,n,f){const m=[],h=new K,g=new K,t=new K,c=async(M,b,d,z,l)=>{const y=M.clone().addScaledVector(b,d*.5).add(h.set(n.range(-1,1),n.range(-.3,.6),n.range(-1,1)).multiplyScalar(d*.07)),a=M.clone().addScaledVector(b,d).add(h.set(n.range(-1,1),n.range(0,1),n.range(-1,1)).multiplyScalar(d*.08)),i=l<2?9:l<4?6:5,e=.03*l*l,x=.03*(l+.5)*(l+.5),W=.03*(l+1)*(l+1),S=.8+.3*n();if(o.tube(M.toArray(),y.toArray(),z,z*.84,i,D(it,S),5,1,e,x),o.tube(y.toArray(),a.toArray(),z*.84,z*.68,i,D(it,S),5,1,x,W),l>=5){m.push(a);return}const N=l<2?3:2;for(let F=0;F<N;F++)t.set(n.range(-1,1),n.range(-.2,.2),n.range(-1,1)).cross(b).normalize(),g.copy(b).applyAxisAngle(t,n.range(.45,.95)).applyAxisAngle(b,F*At/N+n.range(-.5,.5)),g.x-=.16,g.y+=.22-.05*l,g.z-=.1,g.normalize(),await c(a,g.clone(),d*n.range(.64,.82),z*.66,l+1),l<4&&await s.yield()};await c(new K(Dt[0],-1,Dt[1]),new K(-.1,1,-.05).normalize(),36,5.2,0);for(let M=0;M<7;M++){const b=M/7*At+n.range(-.3,.3);o.tube([Dt[0]+Math.cos(b)*11,-.6,Dt[1]+Math.sin(b)*11],[Dt[0]+Math.cos(b)*3,5,Dt[1]+Math.sin(b)*3],1,3.2,6,it,5,1)}m.sort((M,b)=>b.y-M.y);const v=Math.min(f.fruit,m.length),C=_("#f07c12");for(let M=0;M<v;M++){(M&3)===3&&await s.yield();const b=f.fruit>10?m[Math.floor(M*m.length/v)]:m[M*2],d=n.range(.7,.82);o.tube([b.x,b.y,b.z],[b.x+n.range(-.5,.5),b.y-1.4,b.z+n.range(-.5,.5)],.22,.18,4,it,5,0,.7,.75),o.blob(b.x,b.y-2,b.z,d,d*.86,d,9,6,(z,l)=>Le(D(C,.75+.3*l),_("#ffb24a"),Math.max(l,0)*.4),7,1,.75),o.blob(b.x,b.y-2+d*.8,b.z,d*.5,d*.16,d*.5,6,3,D(it,.7),5,1,.75)}return m}function k0(s,o,n,f){const m=Math.round(18*f);for(let h=0;h<m;h++){const g=h%2?1:-1,t=g*o.range(125,340),c=o.range(-300,150),v=o.range(170,300),C=n(t,c)-4,M=v*o.range(.16,.2);s.tube([t,C,c],[t+o.range(-4,4),C+v*.5,c],v*.022,v*.012,6,D(it,.8),5,0);const b=7;for(let d=0;d<b;d++){const z=d/(b-1),l=C+v*(.22+.66*z),y=M*(1-.8*z)*o.range(.85,1.1),a=v*.2*(1-.45*z);s.tube([t+o.range(-2,2),l-a*.12,c+o.range(-2,2)],[t,l+a,c],y,y*.08,9,D(b0,o.range(.7,1.1)),0,.62,.1*z,.5*z)}}}async function z0(s,o,n,f,m){const h=[];for(let t=0;t<46;t++){const c=t%2?1:-1;h.push([c*n.range(55,63),n.range(-34,24)])}for(let t=0;t<16;t++)h.push([et.x0-n.range(.6,3),n.range(et.z0,et.z1)]);for(let t=0;t<10;t++)h.push([n.range(et.x0,et.x1),et.z1+n.range(1.5,5)]);for(const t of[-39,39])for(let c=0;c<5;c++)h.push([t+n.range(-6,6),16+n.range(2,7)]);for(let t=0;t<60;t++){const c=n.range(-130,130),v=n.range(-10,150);Math.abs(c)>21&&!(c>22&&c<44&&v>30&&v<98)&&!(Math.abs(c)<54&&v<24)&&h.push([c,v])}const g=Math.round(h.length*dt(m,.6,1.3));for(let t=0;t<g;t++){(t&7)===7&&await s.yield();const[c,v]=h[t%h.length],C=f(c,v)-.2,M=n.int(4,7);for(let b=0;b<M;b++){const d=c+n.range(-1.6,1.6),z=v+n.range(-1.6,1.6),l=n.range(3.5,8),y=n.range(-1.6,1.6),a=n.range(-1.2,1.2),i=n()*yt,e=Math.cos(i)*.3,x=Math.sin(i)*.3,W=D(Le(m0,_("#8a6a34"),n()),n.range(.7,1.15)),S=[d+y*.35,C+l*.55,z+a*.35],N=[d+y,C+l,z+a];o.face([[d-e,C,z-x],[d+e,C,z+x],[S[0]+e*.7,S[1],S[2]+x*.7],[S[0]-e*.7,S[1],S[2]-x*.7]],[[0,0],[1,0],[1,1],[0,1]],[D(W,.6),D(W,.6),W,W],0,0,[0,0,.2,.2]),o.face([[S[0]-e*.7,S[1],S[2]-x*.7],[S[0]+e*.7,S[1],S[2]+x*.7],[N[0]+e*.35,N[1],N[2]+x*.35],[N[0]-e*.35,N[1],N[2]-x*.35]],[[0,1],[1,1],[1,2],[0,2]],W,0,0,[.2,.2,.6,.6]),n.chance(.55)&&o.face([[N[0]-e*2.2,N[1]-.3,N[2]-x*2.2],[N[0]+e*2.2,N[1]-.3,N[2]+x*2.2],[N[0]+e*.5+y*.25,N[1]+2.3,N[2]+x*.5],[N[0]-e*.5+y*.25,N[1]+2.3,N[2]-x*.5]],[[0,0],[1,0],[1,1],[0,1]],D(W,.8),0,.5,[.6,.6,.85,.85])}}}function M0(s,o,n){for(const t of[-2.6,2.6])s.tube([16.6+5.2,0,16+t*1.5],[16.6-.9,23,16+t*.45],.5,.36,6,rt,1,.5);for(const t of[6,11.5,17]){const c=t/23,v=16.6+5.2-6.1*c,C=tt(3.9,1.17,c);s.tube([v,t,16-C],[v,t,16+C],.3,.3,5,D(rt,.8),1,.5)}for(const t of[-2.1,2.1])s.tube([16.6+3.2,7.4,16+t],[16.6+8.6,9.6,16+t*1.1],.36,.26,5,D(rt,.9),1,.5);s.box(16.6+2.4,13.5,16,.5,6.5,4.2,.26,D(St,.9),4,.3);for(let t=0;t<2;t++)s.box(16.6+6.4+t*.4,9.6+t*1.5,16,1.6,1.4,12.5,.08*(t?1:-1),D(_t,.85),1,1,.85,3);const m=61,h=n[Math.round((m-et.z0)/et.cell)]||30,g=et.x0+1.6;return s.tube([g,h+.1,m],[g,h+.35,m],.75,.8,12,[.78,.8,.82],6,0),s.tube([g,h+.35,m],[g,h+1.35,m],.8,1.65,12,[.8,.82,.84],6,0),s.tube([g,h+1.05,m],[g,h+1.06,m],1.3,.01,12,[.36,.2,.1],6,0),[g,h+1.6,m]}function A0(s,o){const n=_("#8a5237");for(const f of[-1,1]){const m=f<0?17:24.5,h=f<0?7:4,g=f<0?5:3;for(let t=0;t<h;t++){const c=Math.max(1,g-(t===h-1?2:0)-(o.chance(.3)?1:0));for(let v=0;v<c;v++){const C=f*(m+t*2.5+(v&1?1.25:0)+o.range(-.2,.2)),M=1.25+v*2.2,b=o.range(.75,1.1),d=4.4+o.range(0,.6),z=12.2+o.range(-1.2,.8);s.tube([C,M,d],[C,M,z],1.2,1.2,9,D(it,b*1.15),5,.8,0,0,3,D(_t,b))}}s.tube([f*(m-1.6),0,6],[f*(m-1.9),g*2.2+3,6],.5,.4,6,D(at,.8),5,.6),s.tube([f*(m-1.6),0,10.6],[f*(m-1.9),g*2.2+2.2,10.6],.5,.4,6,D(at,.8),5,.6);for(let t=0;t<13;t++){const c=t<6?0:t<10?1:2,v=c===0?t:c===1?t-6:t-10,C=o.range(.7,1.15);s.box(f*(10.4+v%3*1.25+c*.5+o.range(-.12,.12)),.5+c*1,4.6+Math.floor(v/3)*2.5+c*.7+o.range(-.15,.15),1.15,.95,2.3,o.range(-.12,.12),D(n,C),0,.5)}}s.box(0,.3,6.2,21,.6,5.2,0,D(re,.8),0,.6),s.box(0,.75,4.6,18,.5,2.4,0,D(re,.95),0,.5),s.tube([-12.6,0,7.5],[-10.2,23,3.4],.3,.24,6,D(rt,.7),1,.3)}function S0(){const s=new Xt(!0),o={back:_("#7a5230"),buff:_("#d6c8b0"),cap:_("#6b3418"),cheek:_("#ece6da"),black:_("#16110e"),bar:_("#e8dcc6")},n={black:[.012,.013,.02],white:[.92,.93,.95],gloss:_("#0e4a4c"),blue:_("#1a3a8a")};s.blob(0,0,0,.15,.15,.3,9,7,(f,m,h)=>(s.col2=m<-.12&&h<.4||Math.abs(f)>.5&&m>-.1&&h<.35&&h>-.45?n.white:n.black,h>.55&&m<.25?o.black:m<-.05?o.buff:D(o.back,.8+.4*(Math.round(f*9)&1?.4:1))),6,0,0),s.blob(0,.1,.3,.115,.11,.125,8,6,(f,m,h)=>(s.col2=n.black,m>.35?o.cap:Math.abs(f)>.45&&m>-.3?m<.05&&h<.4?o.black:o.cheek:h>.4&&m<0?o.black:o.cheek),6,0,0),s.col2=n.black,s.tube([0,.09,.4],[0,.07,.53],.036,.004,5,_("#2a2420"),6,0,0),s.col2=n.gloss;for(const f of[1,-1]){const m=.02*f,h=[[-.045,-.24],[.045,-.24],[.07,-.62],[-.07,-.62]].map(g=>s.v(g[0],.01+m*.2,g[1],0,f,0,0,0,D(o.back,.55),6,0,1));s.quad(h[0],h[1],h[2],h[3])}for(const f of[1,-1]){const m=[[.13,.22,-.2],[.44,.2,-.17],[.74,.05,-.1]],h=[];m.forEach((g,t)=>{for(const c of[0,1])s.col2=t===0?n.blue:t===2&&c===0?n.black:n.white,h.push(s.v(f*g[0],.075,c?g[2]:g[1],0,1,0,0,0,t===1?c?o.bar:o.back:D(o.back,c?.6:.9),6,f,0))}),s.quad(h[0],h[1],h[3],h[2]),s.quad(h[2],h[3],h[5],h[4])}return s.build()}function D0(s){const o=new Xt;return o.blob(0,0,0,1,.8,1,8,6,[.9,.93,.98],9,1,0,(n,f,m)=>1+.28*s.n3(n*1.7,f*1.7+3,m*1.7)),o.build()}var W0={id:"moon-jar-kiln",name:"Fire of the Moon Jars",category:"interior",weirdness:.15,media:["air","tiny","interior","snow"],async build(s){const o=s.rng.fork("moon-jar-world"),n=s.noise,f=s.vary||{},m=s.quality?.detail??1,h=dt(f.density??1,.7,1.3),g=!!f.rare,t=u0[f.hour&&Ee[f.hour]!==void 0?Ee[f.hour]:r0("kiln-look:"+s.seed)%4],c={value:0},v=new U.Scene,C=new U.Color(t.fog);v.fog=new U.FogExp2(C,t.fogD),v.background=C.clone();const M=i0({rng:o.fork("sky"),...t.sky,bake:t.name==="night",renderer:s.renderer});v.add(M.object),await s.yield();const b=await c0(s,{palette:f0,rare:g,spyJets:t.jets,flueLight:t.flue,flueReach:t.reach,warmth:t.warmth,haze:t.haze,exteriorBack:!1});v.add(b.object),await s.yield();const d=b.anchors,z=n0(d.flyThrough),l=z.length;await s.yield();const y=new K,a=[];{const p=new Float32Array(1801),w=new Float32Array(1801),k=new Float32Array(1801);for(let u=0;u<=1800;u++)z.pointAt(u/1800,y),p[u]=y.x,w[u]=y.y,k[u]=y.z,(u&255)===255&&await s.yield();let A=0;for(const u of d.flyThrough){let R=1e9,X=A;for(let j=A;j<=Math.min(1800,A+260);j++){const O=p[j]-u.x,J=w[j]-u.y,H=k[j]-u.z,T=O*O+J*J+H*H;T<R&&(R=T,X=j)}a.push(X/1800),A=X}}const i=d.marks,e=i.walls.map(r=>a[r]),x=a[i.mouth],W=a[i.orbit[0]],S=a[i.orbit[1]],N=a[i.throat],F=r=>tt(W,S,r),st=(r,p)=>(e[r]+e[p])/2,ft=[[0,30],[x*.75,34],[x,44],[e[0],96],[e[1],116],[e[2],131],[st(2,3),146],[e[3],165],[st(3,4),185],[e[4],211],[st(4,5),258],[e[5],286],[e[6],300],[W,310],[F(.5),332],[S,362],[e[7],398],[st(7,8),414],[e[8],428],[st(8,9),434],[e[9],446],[e[9]+.02,460],[1,464]],L=[[e[6]-.02,0],[e[6],.2],[W,.42],[F(.2),.52],[F(.4),.64],[F(.6),.82],[F(.75),1]];v.userData.marks={uM:x,uW:e,uO0:W,uO1:S,uT:N,L:l},b.setKeys({frontKeys:ft,greatMeltKeys:L,coneAt:[F(.2),F(.32),F(.44)],collapseAt:F(.58)});const q=[e[2]-.026,e[4]-.03],G=(r,p)=>{const w=Math.abs(r),k=b.floorY(Math.max(-p,0)),A=Y(4,-12,p),u=Y(62,46,w),R=dt(Y(125,210,w)+Y(165,240,p),0,1);return k*A-3*A*u+(1-u)*A*(5+.05*Math.max(w-60,0))+R*(7*n.fbm2(r*.006,p*.006,3)+.045*Math.max(w-125,0)+4)},E=new U.Group;E.name="yard",v.add(E);const V={uSkyC:{value:new K(...t.skyC)},uGndC:{value:new K(...t.gndC)},uSunC:{value:new K(...t.sunC)},uSunDir:{value:t.sunDir.clone().normalize()},uFogC:{value:new K(C.r,C.g,C.b)},uFireC:{value:new K(...t.fire)},uSnowC:{value:new K(.86,.9,.96)},uFogD:{value:t.fogD},uTime:c,uSnow:{value:t.snow},uSpark:{value:t.sparkle},uDrift:{value:new U.Vector2(t.drift[0],t.drift[1])}},I=new U.ShaderMaterial({uniforms:V,vertexShader:Pe,fragmentShader:qe,side:U.DoubleSide}),nt=new U.ShaderMaterial({uniforms:V,vertexShader:Pe,fragmentShader:qe,side:U.DoubleSide,defines:{BIRD:1}});{const w=new Float32Array(36963),k=[];for(let O=0;O<=110;O++){for(let J=0;J<=110;J++){const H=-440+880*J/110,T=-440+700*O/110,zt=(O*111+J)*3;w[zt]=H,w[zt+1]=G(H,T),w[zt+2]=T}await s.yield()}for(let O=0;O<110;O++)for(let J=0;J<110;J++){const H=O*111+J,T=H+110+1;k.push(H,T,H+1,H+1,T,T+1)}await s.yield();const A=new U.BufferGeometry;A.setAttribute("position",new U.BufferAttribute(w,3)),A.setIndex(k),await s.yield(),A.computeVertexNormals(),await s.yield(),A.computeBoundingSphere(),await s.yield();const u=t.sunDir,R=Xe.map(O=>new U.Vector4(O[0],O[1],O[2],O[3])),X=new U.ShaderMaterial({uniforms:{...V,uBoard:{value:R},uJar:{value:[]},uTrail:{value:[[2.5,128],[-1.5,84],[1.8,44],[10,18],[34,2]].map(O=>new U.Vector2(O[0],O[1]))},uShOff:{value:t.shadow?new K(-u.x/u.y,-u.z/u.y,1):new K(0,0,0)},uLeaves:{value:t.name==="dusk"?1:0}},vertexShader:d0,fragmentShader:p0,defines:t.shadow?{JAR_SHADOWS:1}:{}}),j=new U.Mesh(A,X);j.name="snow-ground",E.add(j),E.userData.groundMat=X}await s.yield();const $=b.object.getObjectByName("kiln-exterior");if($){const r=$.geometry,p=r.getAttribute("position").count,w=new Float32Array(p*3);for(let k=0;k<p;k++)w[k*3]=10;r.deleteAttribute("aAux"),r.deleteAttribute("aMat"),r.setAttribute("aAux",new U.BufferAttribute(w,3)),$.material.dispose(),$.material=I}const Q=[],Ct=[],ct=new Xt,vt=o.fork("yard");y0(ct,vt,Q,Ct),await s.yield();for(const r of[-1,1]){const p=r*10.7,w=24.6;ct.tube([p,-.6,w],[p,ot-.5,w],3.5,3.15,14,D(it,1.15),5,.5,0,0,3,D(it,.95)),ct.tube([p,ot-.5,w],[p,ot,w],2.5,2.35,12,D(Ie,.9),1,.4,0,0,3);for(let k=0;k<3;k++){const A=k*2.1+r;ct.box(p+Math.cos(A)*2.9,ot-.28,w+Math.sin(A)*2.9,1.5,.5,.8,-A,D(rt,.8),1,.4,1,3)}Q.push({x:p,y:ot,z:w,S:_e*1.03,yaw:1.3+r,tx:.015*r,tz:-.01,sx:1.01,sy:1,sz:.99})}const ie=await x0(s,ct,vt);await s.yield();const lt=M0(ct,vt,ie);await s.yield(),A0(ct,o.fork("front")),await s.yield(),await z0(s,ct,vt,G,h*m),await s.yield();const Rt=new Xt;w0(Rt,vt,n,t,G),await s.yield();const C0=await g0(s,Rt,vt,t);await s.yield(),k0(Rt,vt,G,h),await s.yield();const ce=new U.Mesh(await ct.buildSlowly(s),I),le=new U.Mesh(await Rt.buildSlowly(s),I);ce.name="yard-near",le.name="yard-far",E.add(ce,le),await s.yield();const Vt=new U.Matrix4,xt=new U.Quaternion,gt=new U.Euler(0,0,0,"YXZ"),Ht=new K,Yt=new K,he=(r,p)=>{const w=l0(h0(r,2,!1),p),k=w.getAttribute("position").count,A=new Float32Array(k*3),u=new Float32Array(k*3);for(let R=0;R<k;R++)A.set(v0,R*3),u.set([2,1,0],R*3);return w.setAttribute("color",new U.BufferAttribute(A,3)),w.setAttribute("aAux",new U.BufferAttribute(u,3)),w.setAttribute("uv",new U.BufferAttribute(new Float32Array(k*2),2)),w.deleteAttribute("aPart"),w},fe=(r,p,w)=>{const k=new U.InstancedMesh(p,I,r.length);return r.forEach((A,u)=>{gt.set(A.tx,A.yaw,A.tz),xt.setFromEuler(gt),k.setMatrixAt(u,Vt.compose(Ht.set(A.x,A.y,A.z),xt,Yt.set(A.S*A.sx,A.S*A.sy,A.S*A.sz)))}),k.instanceMatrix.needsUpdate=!0,k.computeBoundingSphere(),k.name=w,E.add(k),k};fe(Q,he(10,Math.round(40*(.7+.3*m))),"raw-jars-aisle"),await s.yield(),fe(Ct,he(5,20),"raw-jars-far"),E.userData.groundMat.uniforms.uJar.value=Q.slice(0,ne).map(r=>new U.Vector4(r.x,r.z,ot,ot+.985*r.S*r.sy)),await s.yield();const ue=8,de=S0(),Nt=new Float32Array(ue*4),Jt=new U.InstancedBufferAttribute(Nt,4);Jt.setUsage(U.DynamicDrawUsage),de.setAttribute("aBird",Jt);const kt=new U.InstancedMesh(de,nt,ue);kt.name="birds",kt.frustumCulled=!1,kt.instanceMatrix.setUsage(U.DynamicDrawUsage),E.add(kt);const Ft=(r,p,w,k,A,u,R,X,j,O,J,H)=>{gt.set(u,A,R),xt.setFromEuler(gt),kt.setMatrixAt(r,Vt.compose(Ht.set(p,w,k),xt,Yt.set(X,X,X))),Nt[r*4]=j,Nt[r*4+1]=O,Nt[r*4+2]=J,Nt[r*4+3]=H},Ve=[19.4,29.6,21.7,32.4,39.8],Tt=[7,7,7,7,6],He=68/6,pe=(r,p,w)=>{const k=r%2?1:-1,A=p>6?Q[k<0?14:15]:Q[(k<0?0:7)+(6-p)],u=(r-2)*.55;return w.set(A.x-k*1.75*Math.cos(u),ot+.985*A.S*A.sy+.55,A.z+1.75*Math.sin(u))},Ye=ie[Math.round((66-et.z0)/et.cell)]||30,P=[new K(et.x0+1.4,Ye+1.5,66),new K(0,6,30),new K(-62,36,8)],Je=[[-10,Z(10,30)+(t.snow>.5?2.9:.6)+1.3,19,.6],[15,Z(15,30)+(t.snow>.5?2.9:.6)+1.3,17.5,-.9]],Bt=44,mt=new U.InstancedMesh(D0(n),I,Bt),ve=[],ut=o.fork("lumps");mt.name="eave-snow",mt.frustumCulled=!1,mt.instanceMatrix.setUsage(U.DynamicDrawUsage),E.add(mt);for(let r=0;r<Bt;r++){const p=(r%2?1:-1)*ut.range(9,47),w=r>=26;ve.push({x:p,y:Z(p,30)+.6,z:22.4+ut.range(-.6,.4),r:w?ut.range(.5,1.1):ut.range(1.4,3.2),delay:ut.range(0,.42)+(w?.1:0),vx:ut.range(-1,1),vz:ut.range(.5,2.5),spin:ut.range(-2,2)})}mt.visible=t.snow>.5,await s.yield();const ht=m*h,me={snowfall:{preset:"snow",count:Math.round(5200*ht),box:[84,52,84],size:[.12,.34],velocity:[1.7,-2.6,.3],opacity:.95},morning:{preset:"snow",count:Math.round(800*ht),box:[80,50,80],size:[.07,.2],velocity:[.25,-.3,.1],velocityRandom:[.3,.2,.3],shape:"sparkle",twinkle:1,colors:["#fff4d8","#ffffff","#ffe0a8"],intensity:2.4,additive:1},dusk:{preset:"leaves",count:Math.round(900*ht),box:[90,50,90],size:[.8,1.7],velocity:[2.2,-2.4,.6],colors:["#c2501a","#e08a1e","#8a3a12"],lightDir:t.sunDir.toArray()},night:{preset:"snow",count:Math.round(2600*ht),box:[90,54,90],size:[.08,.3],velocity:[.3,-.35,.1],velocityRandom:[.5,.3,.5],turbulence:[1.2,.5,.6],shape:"sparkle",twinkle:1,colors:["#cfe0ff","#ffffff","#ffc890"],intensity:2.6,additive:1}}[t.name],Zt=bt.makeParticles({rng:o.fork("fall"),time:c,...me});v.add(Zt.object);const be={snowfall:"#e9eff6",morning:"#ffe9c4",dusk:"#dcbfb8",night:"#56607c"}[t.name],ye=bt.makeMist({rng:o.fork("steam"),time:c,count:Math.round(34*ht),center:[0,50,-24],area:[124,22,96],size:[15,32],color:be,opacity:.2,drift:[1.5,0,.35]}),we=bt.makeMist({rng:o.fork("bowl"),time:c,positions:[[lt[0],lt[1]+.6,lt[2]],[lt[0]+.5,lt[1]+2.6,lt[2]-.3],[lt[0]+1.3,lt[1]+5,lt[2]-.8]],size:[2.2,4.2],color:be,opacity:.3});E.add(ye.object,we.object);const Kt=bt.makeParticles({rng:o.fork("embers"),time:c,preset:"embers",count:Math.round(1e3*ht),box:[52,36,64],velocity:[0,3.2,-5.5],size:[.1,.38],intensity:2.6,fog:!1}),Lt=bt.makeParticles({rng:o.fork("sparks"),time:c,preset:"sparks",count:Math.round(320*ht),box:[46,32,60],velocity:[0,6,-11],velocityRandom:[4,4,6],size:[.035,.08],intensity:2.8,fog:!1}),Et=bt.makeParticles({rng:o.fork("motes"),time:c,preset:"embers",count:Math.round(520*ht),box:[44,30,52],velocity:[0,3.4,-4.2],velocityRandom:[1.4,1.2,1.6],turbulence:[1.6,.8,.5],size:[.16,.42],near:[2,8],intensity:2.4,fadeUp:0,twinkle:.6,fog:!1});Kt.setOpacity(0),Lt.setOpacity(0),Et.setOpacity(0),v.add(Kt.object,Lt.object,Et.object);const xe=bt.makeParticles({rng:o.fork("mouth"),time:c,preset:"embers",follow:!1,center:[0,24,13],box:[34,48,26],count:Math.round(420*ht),velocity:[.5,5,1.2],velocityRandom:[1.6,2,1.4],size:[.12,.4],intensity:2.8,fadeUp:.7});E.add(xe.object),await s.yield();const Te=r=>.6+.62*Y(x-.035,e[0]+.01,r)-.68*Y(e[6]-.012,W+.012,r)+.68*Y(S,S+.055,r)-.22*Y(N-.06,N-.02,r),jt=d.greatJar,ge=jt.center.clone().setY(jt.center.y+.2),$t=g&&d.collapseJar?d.collapseJar.clone():null,Be=new K,Ze=$t?(r,p)=>Be.copy($t).setY($t.y-3*Y(F(.62),F(.86),p)):new K(1,jt.floorY+12,jt.center.z+13),$e=d.arches[9],Ut=new K,Qe=new K,Qt=new K,ke=new K,t0=new K,e0=new K,ze=new K,o0=r=>{z.pointAt(r,ze);let p=99;for(const w of d.arches)p=Math.min(p,Math.abs(-ze.z-w.d));return Y(5,17,p)},Wt=(r,p,w,k)=>{z.pointAt(r,k);const A=Math.cos(w);return k.set(k.x-30*Math.sin(p)*A,k.y+30*Math.sin(w),k.z-30*Math.cos(p)*A)},a0=[{at:(r,p)=>{const w=o0(p);return z.pointAt(Math.min(p+.05,1),Ut),Ut.set(13*w,Ut.y+(Ut.z>-92?25+3*w:8+20*w),Ut.z)},from:x+.004,to:e[1]+.004,weight:.7},{at:(r,p)=>Wt(p,.06,.93,Qe),from:e[1]-.03,to:e[1]+.024,weight:.86},{at:(r,p)=>{const w=Y(e[2]+.002,e[2]+.014,p)*(1-Y(e[2]+.02,e[2]+.03,p)),k=Y(e[2]-.017,e[2]-.001,p);return Wt(p,tt(tt(.22,.5,k),.95,w),tt(tt(.33,.37,k),.2,w),e0)},from:e[1]+.012,to:e[3]-.017,weight:.86,fade:.25},{at:(r,p)=>Wt(p,-.36,.1,ke),from:e[3]-.021,to:e[3]+.022,weight:.8},{at:ge,from:e[5]-.034,to:F(g?.48:.9),weight:.85,fade:.12},{at:Ze,from:F(g?.34:.46),to:F(g?1.03:.72),weight:g?.85:.22},{at:ge,from:F(g?.96:.42),to:S+.045,weight:.85,fade:g?.3:.2},{at:new K(0,d.arches[7].sillY+13,-d.arches[7].d),from:S+.03,to:e[7]-.004,weight:.75,fade:.25},{at:d.portalSeat.position.clone(),from:e[7]-.02,to:.9,weight:.4},{at:(r,p)=>Wt(p,-1,.3,t0),from:e[7]+.002,to:e[8]-.011,weight:.84},{at:(r,p)=>Wt(p,.62,.27,ke),from:e[8]-.006,to:e[9]-.012,weight:.84,fade:.3},{at:(r,p)=>{z.pointAt(Math.min(p+.014,1),Qt);const w=Math.min(Qt.z,-($e.d+11));return Qt.set(-17,b.floorY(-w)+7,w)},from:e[9]-.012,to:e[9]+.036,weight:.7}].filter(r=>r.weight>0);await M.prewarm(s.renderer,null,v);const Pt=new K,qt=new K,Gt=new K;let Me=!0,Ae=!0,Se=-1;const De=(r,p,w)=>r+(p-r)*w,Ce=(r,p)=>{const w=p*862.4,k=t.sparrows;for(let u=0;u<5;u++){if(u>=k){Ft(u,0,-50,0,0,0,0,.001,0,0,0,0);continue}const R=u%2?1:-1,X=(Ve[u]+w-16)/He,j=Math.floor(X),O=dt(j,0,Tt[u]),J=j<Tt[u]?Y(.68,1,X-j):0;pe(u,O,Pt),pe(u,Math.min(O+1,Tt[u]),qt);const H=Math.sin(yt*J),T=Math.pow(Math.abs(Math.sin(r*1.3+u*2.1)),14);let zt=tt(Pt.x,qt.x,J),Fe=tt(Pt.y,qt.y,J)+H*3.4+T*.7*(1-H),Ue=tt(Pt.z,qt.z,J),te=De(-R*1+.5*Math.sin(r*.8+u*1.9)+.4*Math.sin(r*2.9+u),-R*2.7,H),ee=-.25*H+.2*T,oe=Math.pow(H,.6)+T*.6,We=Math.sin(r*36+u*1.7),Oe=2.8;const Mt=Y(.098+.007*u,.155+.007*u,p);if(Mt>0){const Re=-72-7*u,s0=44+5*u,Ke=-22+9*u,ae=Math.pow(Mt,1.25);zt+=Re*ae,Fe+=s0*ae+9*Math.sin(yt*Mt),Ue+=Ke*ae+Math.sin(r*3+u)*1.5*Mt;const se=Y(0,.12,Mt);te=De(te,Math.atan2(Re,Ke),se),ee=tt(ee,-.5,se),oe=Math.max(oe,se),We=Math.sin(r*30+u*2.3),Mt>=1&&(Oe=.001)}Ft(u,zt,Fe,Ue,te,ee,0,Oe,0,dt(oe,0,1),We,.3*Math.pow(Math.max(Math.sin(r*2.3+u*1.7),0),6))}for(let u=0;u<2;u++){const R=Je[u];Ft(5+u,R[0],R[1]+.25*Math.pow(Math.abs(Math.sin(r*.7+u*2)),10),R[2],R[3]+.5*Math.sin(r*.31+u*4),.13*Math.sin(r*1.4+u*2.2),0,9,1,.06*Math.pow(Math.max(Math.sin(r*.53+u),0),8),Math.sin(r*9),.35*Math.pow(Math.max(Math.sin(r*.9+u*3),0),4))}const A=dt((p-.05)/.045,0,1);if(A<=0)Ft(7,P[0].x,P[0].y+.3*Math.pow(Math.abs(Math.sin(r*1.1)),8),P[0].z,-1.9+.4*Math.sin(r*.5),.16*Math.sin(r*1.9),0,9,1,.1*Math.pow(Math.max(Math.sin(r*.8),0),6),Math.sin(r*9),.4*Math.pow(Math.max(Math.sin(r*1.3),0),4));else{const u=A*A*(3-2*A)*.35+A*.65,R=(1-u)*(1-u),X=2*(1-u)*u,j=u*u;Gt.set(R*P[0].x+X*P[1].x+j*P[2].x,R*P[0].y+X*P[1].y+j*P[2].y,R*P[0].z+X*P[1].z+j*P[2].z);const O=2*(1-u)*(P[1].x-P[0].x)+2*u*(P[2].x-P[1].x),J=2*(1-u)*(P[1].y-P[0].y)+2*u*(P[2].y-P[1].y),H=2*(1-u)*(P[1].z-P[0].z)+2*u*(P[2].z-P[1].z),T=Math.sin(r*13);Ft(7,Gt.x,Gt.y+.5*T,Gt.z,Math.atan2(O,H),-Math.atan2(J,Math.hypot(O,H))*.8,.25,A>=1?.001:9,1,Y(0,.08,A),T*.95,.05)}kt.instanceMatrix.needsUpdate=!0,Jt.needsUpdate=!0},Ne=r=>{const p=dt((r-.066)/.052,-.01,1.8);if(p!==Se){Se=p;for(let w=0;w<Bt;w++){const k=ve[w],A=dt((p-k.delay)/.55,0,1.6),u=Math.max(A-.2,0)*2.6;let R=k.y-4.9*u*u,X=.8,j=1;const O=k.r*.3;R<O&&(R=O,X=.42,j=1.35),gt.set(k.spin*u,k.spin*.7*u+w,0),xt.setFromEuler(gt),mt.setMatrixAt(w,Vt.compose(Ht.set(k.x+k.vx*u,R,k.z+Math.min(A/.2,1)*2.6+k.vz*u),xt,Yt.set(k.r*j,k.r*X,k.r*j)))}mt.instanceMatrix.needsUpdate=!0}};return Ce(0,0),Ne(0),{scene:v,path:z,duration:44,pace:Te,camera:{fov:62,near:.4,far:3200,lookAhead:30,sway:.8,bank:.06},pois:a0,portal:{shape:"rect",width:14,height:14,color:t.portal,glow:1,tilt:!0,revealDistance:300},post:{exposure:t.exposure,bloom:{strength:.13,radius:.55,threshold:1.22},grade:{saturation:1.06,contrast:1.05,tint:"#ffffff",shadowTint:"#06080e",vignette:.3,grain:.02}},ride:"none",update(r,p,w,k){c.value=p;const A=k*l/862.4;b.setProgress(k);for(let O=0;O<q.length;O++)b.setLogDrop(O,(k-q[O])/.036);b.update(r,p,w);const u=k<.3,R=k<.2||k>.6;u!==Me&&(Me=u,E.visible=u),R!==Ae&&(Ae=R,M.object.visible=R),u&&(Ce(p,A),Ne(A),ye.update(r,p,w),we.update(r,p,w),xe.update(r,p,w));const X=Y(N-.02,N+.008,k)*(t.name==="dusk"?.8:1);Zt.setOpacity(Math.max(1-Y(.096,.121,A),X)*(me.opacity??1));const j=Y(.125,.16,A);Kt.setOpacity(j),Lt.setOpacity(j),Et.setOpacity(Y(.62,.7,k)),Zt.update(r,p,w),Kt.update(r,p,w),Lt.update(r,p,w),Et.update(r,p,w),R&&M.update(r,p,w)},dispose(){b.dispose(),M.dispose()}}}};export{W0 as default};
