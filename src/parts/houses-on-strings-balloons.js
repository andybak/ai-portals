import*as A from"three";const Y=`
uniform float uTime;
vec3 hsSway(vec3 p, vec3 pv, vec4 mv){
  float t = uTime*6.2831853/max(mv.z, 1.) + mv.x;
  float yaw = 1.2*mv.w*sin(t*.37 + mv.x*1.7), sx = mv.w*sin(t*.61 + mv.x*2.3), sz = mv.w*sin(t*.53 + mv.x*.9);
  vec3 d = p - pv;
  float c = cos(yaw), s = sin(yaw);
  d = vec3(c*d.x + s*d.z, d.y, c*d.z - s*d.x);
  c = cos(sx); s = sin(sx); d = vec3(d.x, c*d.y - s*d.z, s*d.y + c*d.z);
  c = cos(sz); s = sin(sz); d = vec3(c*d.x - s*d.y, s*d.x + c*d.y, d.z);
  return pv + d + vec3(0., mv.y*sin(t), 0.);
}`,lt=(n,t)=>t[1]+n*t[3]*(1.2+1.4143)+.12,J=n=>{const t=new A.Color(n);return[t.r,t.g,t.b]},N=[["#d3241b","#ee6a50"],["#eb9a1c","#f0cc2c"],["#93c92a","#3c9434"],["#128c86","#2cc2ba"],["#4fa6e4","#1f4cbc"],["#7436c4","#b48ae4"],["#dc3a74","#f394b4"],["#ece6d8","#f0deb0"],["#ec741c","#f6ae82"]].map(n=>n.map(J)),ot=J("#f0ede4");function ht(n){const t={z:[]};for(let e=0;e<n;e++)t.z.push({b:[],l:[],nb:0,nl:0});return t}function O(n,t,e,o,l){const a=n.cs,M=n.sn,b=n.sc||1;return l[0]=n.x+t*a*b+o*M*b,l[1]=n.y+e*b,l[2]=n.z-t*M*b+o*a*b,l}const C=[0,0,0],E=[0,0,0];function W(n,t,e,o,l,a,M,b,T,s,x,h,u,p=0,S=0){O(t,e,o,l,C);const r=1+.3*M;if(t.guard&&!t.guard(C[0],C[1],C[2],r*.6))return!1;const c=N[a],i=Math.sin(e*.43+o*.29+a)*Math.sin(l*.47-o*.21)+(b-.5)*1,d=b*613%1<1/15?ot:c[i>0?0:1],m=.76+.36*(b*977%1),f=Math.hypot(x,h,u)||1,y=(x*t.cs+u*t.sn)/f,z=(-x*t.sn+u*t.cs)/f,g=n.z[t.zone];return g.b.push(C[0],C[1],C[2],r,Math.min(d[0]*m,.8),Math.min(d[1]*m,.8),Math.min(d[2]*m,.8),T,y,h/f,z,s,t.pivot[0],t.pivot[1],t.pivot[2],t.mv[0],t.mv[1],t.mv[2],t.mv[3],p,S,(c[0][0]+c[1][0])*.46,(c[0][1]+c[1][1])*.46,(c[0][2]+c[1][2])*.46),g.nb++,!0}const K=24,at=14;function I(n,t,e,o,l,a,M,b,T=.03){O(t,e,o,l,C),O(t,a,M,b,E);const s=n.z[t.zone];s.l.push(C[0],C[1],C[2],E[0],E[1],E[2],T,t.pivot[0],t.pivot[1],t.pivot[2],t.mv[0],t.mv[1],t.mv[2],t.mv[3]),s.nl++}const D=n=>{let t=0,e=1e9,o=-1e9,l=0;for(const a of n)t=Math.max(t,Math.abs(a[0])),e=Math.min(e,a[2]),o=Math.max(o,a[2]),l=Math.max(l,a[1]);return{bx:t,z0:e,z1:o,y:l}},G=(n,t,e,o)=>[Math.max(-n.bx,Math.min(n.bx,t*n.bx/o)),n.y,e>=(n.z0+n.z1)/2?n.z1:n.z0],ut=(n,t,e)=>{let o=n[0],l=1e9;for(const a of n){const M=(a[0]-t)**2+(a[2]-e)**2;M<l&&(l=M,o=a)}return o};function vt(n,t,e,o){const{len:l,wid:a,y:M,fam:b}=o,T=o.sp||.95,s=o.layers||3,x=M+(s-1)*.8,h=Math.max(2,Math.round(l/6.5)),u=Math.max(2,Math.round(a/6.5)),p=l/h,S=a/u,r=Math.floor(l/T),c=Math.floor(a/(T*.87)),i=(v,w)=>(Math.abs(v)/(l/2))**4.6+(Math.abs(w)/(a/2))**4.6<=1+.13*Math.sin(v*.9+1.3)*Math.sin(w*1.1+.4),d=v=>l/2*Math.max(0,1-(Math.abs(v)/(a/2))**3.2)**.3125*.93,m=v=>a/2*Math.max(0,1-(Math.abs(v)/(l/2))**3.2)**.3125*.93;for(let v=0;v<s;v++)for(let w=0;w<c;w++)for(let P=0;P<r;P++){const L=e(),k=e(),j=e(),R=e(),V=e(),F=e(),_=(P+.5+w%2*.5+(L-.5)*.45+v*.33)*T-l/2,U=(w+.5+(k-.5)*.45+v*.29)*T*.87-a/2;if(!i(_,U))continue;const Z=Math.abs(Math.sin(Math.PI*(_+l/2)/p)*Math.sin(Math.PI*(U+a/2)/S))**.6,Q=Math.max(Math.abs(_)/(l/2),Math.abs(U)/(a/2)),q=Q>.9?1:0,H=M+v*.8+Z*(.35+.3*v)+(j-.5)*.25,$=s>2&&v>0&&v<s-1&&!q;if($&&F<.5)continue;const tt=v===s-1?1:v===0?-1:0,X=q?Math.sign(_)*(Math.abs(_)/(l/2)>Math.abs(U)/(a/2)?1:0):0,et=q&&!X?Math.sign(U):0;W(n,t,_,H,U,b,R,V,F,$?.8:.12*(1-Z),X*1.2,tt,et*1.2)}for(let v=1;v<h;v++){const w=-l/2+v*p,P=m(w);I(n,t,w,x+.42,-P,w,x+.42,P,.05)}for(let v=1;v<u;v++){const w=-a/2+v*S,P=d(w);I(n,t,-P,x+.42,w,P,x+.42,w,.05)}const f=D(o.ends),y=Math.round(2*(l+a)/2.5),z=v=>Math.sign(v)*Math.abs(v)**.625,g=o.disc,B=(v,w,P,L,k,j)=>{if(!g)return!1;for(let R=0;R<=32;R++){const V=R/32;if(Math.abs(P+(j-P)*V-g[2])<1.05&&Math.hypot(v+(L-v)*V-g[0],w+(k-w)*V-g[1])<g[3]+1)return!0}return!1};for(let v=0;v<y;v++){const w=(v+.5)/y*6.2832,P=z(Math.cos(w))*l/2*.9,L=z(Math.sin(w))*a/2*.9,k=G(f,P,L,l/2);B(P,M-.3,L,k[0],k[1],k[2])&&(k[2]=k[2]===f.z1?f.z0:f.z1,B(P,M-.3,L,k[0],k[1],k[2]))||I(n,t,P,M-.3,L,k[0],k[1],k[2],v%4===0?.05:.022)}}function ft(n,t,e,o){const l=D(o.ends),{len:a,rad:M,y:b,fam:T}=o,s=o.z||0,x=o.x||0,h=(o.sp||.95)*.97,u=Math.max(4,Math.round(a/4)),p=a/u,S=r=>{const c=(r+a/2)/p,i=Math.max(0,Math.abs(r)-(a/2-M*.9))/(M*.9);return M*(.8+.2*Math.abs(Math.sin(Math.PI*c))**.55)*Math.sqrt(Math.max(.02,1-i*i))};for(let r=-a/2+.3;r<a/2-.2;r+=h*.86)for(let c=0;c<2;c++){const i=S(r)-.42-c*.8;if(i<.5)continue;const d=Math.max(3,Math.floor(6.2832*i/h)),m=e()*6.2832;for(let f=0;f<d;f++){const y=e(),z=e(),g=e(),B=e(),v=e();if(c&&v<.45)continue;const w=m+(f+(y-.5)*.5)/d*6.2832,P=r+(z-.5)*.4;W(n,t,x+P,b+Math.sin(w)*i*.62,s+Math.cos(w)*i*1.6,T,g,B,v,c?.78:.1,.5*P/(a/2),Math.sin(w),Math.cos(w))}}for(let r=0;r<=u;r++){const c=-a/2+r*p,i=(r===0||r===u?S(c*.985):M*.8)+.06;if(r>0&&r<u)for(let y=0;y<10;y++){const z=y/10*6.2832,g=(y+1)/10*6.2832;I(n,t,x+c,b+Math.sin(z)*i*.62,s+Math.cos(z)*i*1.6,x+c,b+Math.sin(g)*i*.62,s+Math.cos(g)*i*1.6,.045)}const d=r===0||r===u?M*.5:i,m=s>.1?1:s<-.1?-1:r%2?1:-1,f=G(l,x+c,m,a/2);I(n,t,x+c,b-d*.45,s+m*d*1.1,f[0],f[1],f[2],r%2?.024:.045)}}const nt=(n,t,e,o)=>{const l=o[3]-o[0],a=o[4]-o[1],M=o[5]-o[2],b=Math.max(0,Math.min(1,((n-o[0])*l+(t-o[1])*a+(e-o[2])*M)/(l*l+a*a+M*M)));return Math.hypot(n-o[0]-l*b,t-o[1]-a*b,e-o[2]-M*b)};function dt(n,t,e,o){const l=D(o.ends),{radii:a,y:M,fam:b}=o,T=o.gap||4.5,s=o.sp||.95,x=[];for(let h=a.length-1;h>=0;h--){const u=a[h],p=h?(h&1?.62:-.62)*a[0]:0,S=M+(h?T:0),r=e()*6.2832,c=Math.floor(u/s)+1;for(let d=0;d<2;d++)for(let m=-c;m<=c;m++)for(let f=-c;f<=c;f++){const y=e(),z=e(),g=e(),B=e(),v=e(),w=e(),P=(f+(m&1)*.5+(y-.5)*.45+d*.4)*s,L=(m+(z-.5)*.45+d*.3)*s*.87,k=Math.hypot(P,L),j=Math.atan2(L,P),R=u*(1+.05*Math.sin(3*j+r)+.03*Math.sin(7*j+r*2));if(k>R)continue;const V=S+d*.8+(g-.5)*.25+.5*Math.cos(k/R*1.5708);let F=!1;for(const U of x)if(nt(P+p,V,L,U)<.55){F=!0;break}if(F||o.thin2&&d&&w<.5)continue;const _=k>R-1.1?1:0;W(n,t,P+p,V,L,b,B,v,w,_?.05:.15,_?Math.cos(j)*1.3:0,d?1:-1,_?Math.sin(j)*1.3:0)}const i=Math.max(8,Math.round(6.2832*u/3));for(let d=0;d<i;d++){const m=(d+.5*(h&1))/i*6.2832,f=Math.cos(m)*u*.94,y=Math.sin(m)*u*.94,z=G(l,f,y,u);I(n,t,f+p,S-.3,y,z[0],z[1],z[2],d%4===0?.045:.022),x.push([f+p,S-.3,y,z[0],z[1],z[2]])}for(let d=0;d<6;d++){const m=d/6*3.1416;I(n,t,p+Math.cos(m)*u,S+1.5,Math.sin(m)*u,p-Math.cos(m)*u,S+1.5,-Math.sin(m)*u,.04)}}}function mt(n,t,e,o){const l=[],a=o.count,{fam:M}=o,b=D(o.ends),T=Math.ceil(a/3),s=3.55*(o.bag||1),x=T*s*.78+s;for(let h=0;h<a;h++){const u=e(),p=e(),S=e(),r=h%3-1,c=Math.floor(h/3),i=(2.9+1.3*S)*(o.bag||1),d=(c-(T-1)/2)*s*1.55+(u-.5)*.8+(r?0:s*.45),m=r*s*1.4,f=o.y0+i*.72+p*1.2;O(t,d,f,m,C),!(t.guard&&!t.guard(C[0],C[1],C[2],i+2.5))&&l.push({x:d,y:f,z:m,R:i,e:G(b,d,r||(c%2?1:-1),x)})}if(l.length<5)return 0;for(const h of l){const u=3+Math.floor(e()*3),p=[];for(let r=0;r<u;r++){const c=e()*6.2832,i=e()*1-.5,d=h.R*(.42+.3*e()),m=h.R*(.44+.16*e());p.push([h.x+Math.cos(c)*Math.cos(i)*d,h.y+Math.sin(i)*d*.6,h.z+Math.sin(c)*Math.cos(i)*d*.8,m])}for(let r=0;r<u;r++){const c=p[r],i=Math.round(12.566*c[3]*c[3]/(.66*(o.sp||.95)**2));for(let d=0;d<i;d++){const m=e()*2-1,f=e()*6.2832,y=e(),z=e(),g=e(),B=e(),v=Math.sqrt(1-m*m),w=c[3]-.4-(y<.25?.8:0),P=c[0]+v*Math.cos(f)*w,L=c[1]+m*w*.72,k=c[2]+v*Math.sin(f)*w;let j=!1;for(let R=0;R<u;R++)if(R!==r&&Math.hypot(P-p[R][0],(L-p[R][1])/.72,k-p[R][2])<p[R][3]-.75){j=!0;break}j||W(n,t,P,L,k,M,z,g,B,y<.25?.75:.1,P-h.x,L-h.y,k-h.z)}}const S=h.e[2]>=(b.z0+b.z1)/2?1:-1;for(let r=0;r<5;r++){const c=h.x+(r-2)*h.R*.36,i=G(b,c,S,x);I(n,t,c,h.y-h.R*.5,h.z+S*h.R*.45,i[0],i[1],i[2],r%2?.02:.04)}}return l.length}async function xt(n,t,e,o,l){const{r:a,cy:M,to:b}=o,T=o.sp||1.7;for(let s=0;s<2;s++){const x=a-s*1.5,h=T*(s?1.45:1),u=Math.round(4*Math.PI*x*x/(h*h*.87));for(let p=0;p<u;p++){const S=e(),r=e(),c=e(),i=e(),d=e(),m=e();l&&p%100===99&&await l();const f=Math.acos(1-2*(p+.5)/u),y=p*2.39996+(S-.5)*.03,z=x*(1+.035*Math.sin(y*3+f*5)+.03*(r-.5)),g=Math.sin(f)*Math.cos(y),B=Math.cos(f),v=Math.sin(f)*Math.sin(y);W(n,t,g*z,M+B*z,v*z,Math.floor(m*N.length)%N.length,c,i,d,s?.7:.1,g,B,v)}}for(let s=0,x=o.lines||110;s<x;s++){const h=e()*6.2832,u=Math.PI*(.62+.36*e()),p=a*.985;I(n,t,Math.sin(u)*Math.cos(h)*p,M+Math.cos(u)*p,Math.sin(u)*Math.sin(h)*p,b[0],b[1],b[2],s%5===0?.05:.025)}}function pt(n,t,e,o,l,a,M,b,T){for(let s=0;s<b;s++){const x=e(),h=e(),u=e(),p=e(),S=e(),r=e();W(n,t,o+(x-.5)*9,l,a+(h-.5)*9,M,2.2+2.2*u,p,(s+.9*S)/b,0,0,1,0,1.3+1.5*r,T)}}const st=`
attribute vec4 aPS, aTint, aBN, aMove; attribute vec3 aPivot, aMean; attribute vec2 aRise;
uniform float uViewH; uniform vec3 uSun;
varying vec2 vUv; varying vec4 vTint; varying vec3 vSunV, vUpV; varying float vPx, vBL, vOcc, vBh;
#include <fog_pars_vertex>
${Y}
void main(){
  vec3 c = hsSway(aPS.xyz, aPivot, aMove);
  float s = aTint.w*6.2831853, grow = 1.;
  c += .05*vec3(sin(uTime*1.3 + s*7.), sin(uTime*1.1 + s*13.), sin(uTime*.9 + s*29.));
  c.y += .1*sin(uTime*.55 + dot(aPS.xz, vec2(.23, .17)));
  if(aRise.x > 0.){
    float h = mod(uTime*aRise.x + aTint.w*aRise.y, aRise.y), ph = dot(aPivot.xz, vec2(.37, .23)) + aTint.w*40.;   // each on its own wandering way up
    c += vec3(4.*sin(h*.05 + ph) + h*.18, h, 4.*sin(h*.041 + ph*1.7));
    grow = smoothstep(0., 5., h)*(1. - smoothstep(aRise.y - 14., aRise.y, h));
  }
  vec4 mvPosition = viewMatrix*vec4(c, 1.);
  float r = .5*aPS.w*grow;
  float px = r*projectionMatrix[1][1]*uViewH*.5/max(-mvPosition.z, .1);
  float k = min(max(1., 1.25/max(px, .01)), 14.)*step(.001, grow);
  vBh = clamp(dot(mvPosition.xyz/max(length(mvPosition.xyz), .001), normalize((viewMatrix*vec4(uSun, 0.)).xyz)), 0., 1.);   // the sun beyond THIS balloon, by the ray from the eye to it (not by where the lens points)
  mvPosition.xy += position.xy*r*k;
  gl_Position = projectionMatrix*mvPosition;
  vUv = position.xy; vTint = vec4(mix(aTint.rgb, aMean, .3*(1. - smoothstep(.7, 2.4, px))), aTint.w); vPx = px; vOcc = aBN.w; vBL = dot(aBN.xyz, uSun);
  vSunV = normalize((viewMatrix*vec4(uSun, 0.)).xyz); vUpV = (viewMatrix*vec4(0., 1., 0., 0.)).xyz;
  #include <fog_vertex>
}`,it=`
uniform vec3 uSunCol, uSkyCol, uGroundCol; uniform float uDeep, uThru;
varying vec2 vUv; varying vec4 vTint; varying vec3 vSunV, vUpV; varying float vPx, vBL, vOcc, vBh;
#include <fog_pars_fragment>
void main(){
  vec2 e = vec2(vUv.x, (vUv.y - .05)/1.1);
  e.x *= 1. + .25*max(-e.y, 0.);                                  // a little taller than wide, narrower to the knot
  float r2 = dot(e, e), fw = max(fwidth(r2), 1e-4);
  float cov = 1. - smoothstep(1. - fw*1.2, 1., r2);               // the edge, as wide as the pixel's footprint
  float small = 1. - smoothstep(.9, 2.6, vPx);                   // a ball of a pixel or two: one flat shade
  float nz = sqrt(clamp(1. - r2, .0004, 1.));
  vec3 n = normalize(mix(vec3(e, nz), vec3(0., 0., 1.), small*.7));
  float ndl = dot(n, vSunV), slant = 1. - n.z, occ = clamp(vOcc, 0., 1.);
  vec3 tint = mix(vTint.rgb, vTint.rgb*vTint.rgb*1.3, uDeep), deep = tint*tint*1.3;   // more skin in the way: deeper (uDeep: a hard white sun pales them)
  vec3 skin = mix(tint, deep, clamp(slant*slant*1.25 + occ*.6, 0., 1.));
  float sunSide = smoothstep(-.6, .4, vBL);                       // a bunch shades its own far side
  float front = clamp(ndl*.62 + .38, 0., 1.)*sunSide;
  float behind = vBh;                                             // the sun beyond the ball, by the ray to it
  float thru = (.2 + .55*clamp(-ndl, 0., 1.) + .8*behind*behind)*(1. - .5*occ)*mix(.7, 1., sunSide);
  vec3 amb = mix(uGroundCol, uSkyCol, dot(n, vUpV)*.5 + .5)*(1. - .45*occ);
  vec3 col = skin*(uSunCol*front + amb)*.3183;
  col += mix(skin, deep, .45)*uSunCol*(thru*uThru);                // lit from within
  vec3 hv = normalize(vSunV + vec3(0., 0., 1.0001));
  float nh = clamp(dot(n, hv), 1e-4, 1.);
  col += uSunCol*(.12*pow(nh, 14.) + .55*pow(nh, 110.))*sunSide*(1. - small)*(1. - occ);
  float ky = vUv.y + 1.03;
  float knot = (1. - smoothstep(0., .05, abs(vUv.x) - .03 + ky*.4))*step(ky, .03)*step(-.24, ky)*(1. - small);
  col = mix(col, deep*.25*(uSkyCol + uSunCol*.3)*.3183, knot*(1. - cov));
  cov = max(cov, knot);
  gl_FragColor = vec4(col, cov);
  #include <fog_fragment>
  if(cov <= 0.) discard;
}`,ct=`
attribute vec3 aOther, aPivot, aLW; attribute vec4 aMove;
uniform float uViewH; uniform vec3 uSun;
varying float vSide, vA, vLit;
#include <fog_pars_vertex>
${Y}
void main(){
  vec3 a = hsSway(position, aPivot, aMove), b = hsSway(aOther, aPivot, aMove);
  vec4 mvPosition = viewMatrix*vec4(a, 1.), mb = viewMatrix*vec4(b, 1.);
  vec2 d = (mb.xy/max(-mb.z, .1) - mvPosition.xy/max(-mvPosition.z, .1))*aLW.y;
  float l = length(d); d = l > 1e-7 ? d/l : vec2(1., 0.);
  float sc = projectionMatrix[1][1]*uViewH*.5/max(-mvPosition.z, .1);       // pixels to a metre here
  float pxw = aLW.z*sc, w = max(pxw, 1. + 6.*aLW.z);                        // a ribbon never under a pixel wide; a rope a little wider
  mvPosition.xy += vec2(-d.y, d.x)*aLW.x*w/sc*.5;
  vec3 ab = b - a; float ds = dot(ab/max(length(ab), 1e-4), uSun);
  vSide = aLW.x; vA = clamp(1.6*pxw/w, .2, 1.); vLit = sqrt(clamp(1. - ds*ds, .0004, 1.));        // a cord across the sun's light is lit most
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,rt=`
uniform vec3 uSunCol, uSkyCol, uGroundCol, uHemp;
varying float vSide, vA, vLit;
#include <fog_pars_fragment>
void main(){
  float a = vA*(1. - smoothstep(.6, 1., abs(vSide)));
  gl_FragColor = vec4(uHemp*(uSunCol*(.3 + .7*vLit)*(.85 + .15*vSide) + .6*(uSkyCol + uGroundCol))*.3183, a);
  #include <fog_fragment>
}`;async function Mt(n,t,e=async()=>{}){const o=A.UniformsUtils.merge([A.UniformsLib.fog,{}]);Object.assign(o,{uTime:{value:0},uDeep:{value:0},uThru:{value:.52},uViewH:{value:450},uSun:{value:t.sun},uSunCol:{value:t.sunCol},uSkyCol:{value:t.sky},uGroundCol:{value:t.ground},uHemp:{value:new A.Color("#e4d8b8")}});const l=new A.ShaderMaterial({name:"hosBalloons",uniforms:o,vertexShader:st,fragmentShader:it,fog:!0,alphaToCoverage:!0}),a=new A.ShaderMaterial({name:"hosLines",uniforms:o,vertexShader:ct,fragmentShader:rt,fog:!0,transparent:!0,depthWrite:!0,side:A.DoubleSide}),M=new A.Group;M.name="bunches";let b=0,T=0;for(const s of n.z){if(s.nb){const x=new A.InstancedBufferGeometry;x.setAttribute("position",new A.Float32BufferAttribute([-1.06,-1.3,0,1.06,-1.3,0,1.06,1.2,0,-1.06,1.2,0],3)),x.setIndex([0,1,2,0,2,3]);const h=new A.InstancedInterleavedBuffer(new Float32Array(s.b),K),u=(c,i,d)=>x.setAttribute(c,new A.InterleavedBufferAttribute(h,i,d));u("aPS",4,0),u("aTint",4,4),u("aBN",4,8),u("aPivot",3,12),u("aMove",4,15),u("aRise",2,19),u("aMean",3,21),x.instanceCount=s.nb;const p=new A.Box3,S=new A.Vector3;for(let c=0;c<s.nb;c++){const i=c*K;p.expandByPoint(S.set(s.b[i],s.b[i+1],s.b[i+2])),s.b[i+20]>0&&p.expandByPoint(S.set(s.b[i]+12,s.b[i+1]+s.b[i+20],s.b[i+2]))}x.boundingSphere=p.getBoundingSphere(new A.Sphere),x.boundingSphere.radius+=8;const r=new A.Mesh(x,l);r.name="balloons",M.add(r),b+=s.nb,await e()}if(s.nl){const x=s.nl,h=new Float32Array(x*12),u=new Float32Array(x*12),p=new Float32Array(x*12),S=new Float32Array(x*12),r=new Float32Array(x*16),c=new Uint32Array(x*6);for(let m=0;m<x;m++){const f=m*at,y=s.l;for(let z=0;z<4;z++){const g=z>1,B=(m*4+z)*3,v=g?3:0,w=g?0:3;h[B]=y[f+v],h[B+1]=y[f+v+1],h[B+2]=y[f+v+2],u[B]=y[f+w],u[B+1]=y[f+w+1],u[B+2]=y[f+w+2],p[B]=y[f+7],p[B+1]=y[f+8],p[B+2]=y[f+9],S[B]=z&1?1:-1,S[B+1]=g?-1:1,S[B+2]=y[f+6],r.set([y[f+10],y[f+11],y[f+12],y[f+13]],(m*4+z)*4)}c.set([m*4,m*4+1,m*4+2,m*4+1,m*4+3,m*4+2],m*6)}const i=new A.BufferGeometry;i.setAttribute("position",new A.BufferAttribute(h,3)),i.setAttribute("aOther",new A.BufferAttribute(u,3)),i.setAttribute("aPivot",new A.BufferAttribute(p,3)),i.setAttribute("aLW",new A.BufferAttribute(S,3)),i.setAttribute("aMove",new A.BufferAttribute(r,4)),i.setIndex(new A.BufferAttribute(c,1)),i.computeBoundingSphere(),i.boundingSphere.radius+=8;const d=new A.Mesh(i,a);d.name="lines",d.renderOrder=.5,M.add(d),T+=x,await e()}}return{object:M,uniforms:o,balloons:b,lines:T}}export{K as BSTRIDE,N as FAMILIES,at as LSTRIDE,Y as SWAY_GLSL,W as ball,xt as bunchBall,ft as bunchBolster,mt as bunchClusters,vt as bunchRaft,dt as bunchTiers,I as line,pt as looseThread,Mt as makeBalloonMeshes,ht as makeStore,lt as swayReach,O as toWorld};
