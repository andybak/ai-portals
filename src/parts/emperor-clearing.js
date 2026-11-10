import*as d from"three";import{clamp as Y,lerp as j,smoothstep as E,makeRng as R0,hashSeed as B0}from"../kit/core.js";const T0=["#8E8CA6","#23233A","#D6D9EA","#3F6FA3","#F3A6C8","#8FE6C4","#4AB2FF"],e0=Math.PI/180,k0=e=>new d.Vector2(Math.sin(e*e0),-Math.cos(e*e0)),G=k0(150),V0=18,p0=.535;function t0(e,a,t,m,i,r=1.12){const v=e.pos.length/3;for(let n=0;n<a.length;n++){const[x,y,k,c]=a[n];for(let u=0;u<t;u++){const g=u/t*Math.PI*2,N=Math.cos(g);e.pos.push(Math.sin(g)*y,x,N*k*(N>0?r:.94)+c),e.part.push(i)}}for(let n=0;n<a.length-1;n++)for(let x=0;x<t;x++){const y=v+n*t+x,k=v+n*t+(x+1)%t,c=y+t,u=k+t;e.idx.push(y,k,u,y,u,c)}if(m){const n=e.pos.length/3;e.pos.push(m[0],m[1],m[2]),e.part.push(i);const x=v+(a.length-1)*t;for(let y=0;y<t;y++)e.idx.push(x+y,x+(y+1)%t,n)}}function X(e,a,t,m,i){const r=e.pos.length/3;for(const v of a)e.pos.push(v[0],v[1],v[2]),e.part.push(m);for(const v of t){const n=a[v[0]],x=a[v[1]],y=a[v[2]],k=x[0]-n[0],c=x[1]-n[1],u=x[2]-n[2],g=y[0]-n[0],N=y[1]-n[1],l=y[2]-n[2],p=c*l-u*N,f=u*g-k*l,h=k*N-c*g,C=(n[0]+x[0]+y[0])/3-i[0],b=(n[1]+x[1]+y[1])/3-i[1],M=(n[2]+x[2]+y[2])/3-i[2];p*C+f*b+h*M>=0?e.idx.push(r+v[0],r+v[1],r+v[2]):e.idx.push(r+v[0],r+v[2],r+v[1])}}function g0(e){const a=new d.BufferGeometry;return a.setAttribute("position",new d.Float32BufferAttribute(e.pos,3)),a.setAttribute("aPart",new d.Float32BufferAttribute(e.part,1)),a.setIndex(e.idx),a.computeVertexNormals(),a}function o0(e,a,t){const m=[a*.14,.8,0],i=[a*.214,.3,.016];if(t){const c=[a*.186,.57,.062],u=[a*.182,.59,-.05],g=[a*.224,.56,.006];X(e,[m,c,g,u,i],[[0,1,2],[0,2,3],[1,4,2],[2,4,3]],1,[0,.56,0]);return}const r=[a*.174,.665,.06],v=[a*.206,.66,.004],n=[a*.17,.675,-.05],x=[a*.198,.49,.058],y=[a*.23,.48,.008],k=[a*.195,.5,-.04];X(e,[m,r,v,n,x,y,k,i],[[0,1,2],[0,2,3],[1,4,5],[1,5,2],[2,5,6],[2,6,3],[4,7,5],[5,7,6]],1,[0,.56,0])}function n0(e=0){const a={pos:[],idx:[],part:[]};if(e===0){t0(a,[[.03,.145,.142,.004],[.3,.205,.201,.026],[.5,.202,.195,.024],[.68,.176,.168,.013],[.8,.146,.138,.004],[.875,.106,.101,0],[.935,.085,.086,.005],[1,.085,.094,.015],[1.07,.074,.083,.018],[1.125,.044,.052,.017]],10,[0,1.15,.016],0),X(a,[[0,1.052,.084],[.025,1.022,.084],[0,.994,.084],[-.025,1.022,.084],[0,1.036,.165],[.014,1.017,.165],[0,1.001,.165],[-.014,1.017,.165],[0,1,.238]],[[0,1,5],[0,5,4],[1,2,6],[1,6,5],[2,3,7],[2,7,6],[3,0,4],[3,4,7],[4,5,8],[5,6,8],[6,7,8],[7,4,8]],2,[0,1.02,.14]),o0(a,1,!1),o0(a,-1,!1);for(const t of[1,-1])X(a,[[t*.035,.03,.08],[t*.125,.03,.09],[t*.115,.012,.235],[t*.05,.012,.225]],[[0,1,2],[0,2,3]],3,[t*.08,-1,.15]);X(a,[[.07,.11,-.14],[-.07,.11,-.14],[0,.012,-.29],[0,.03,-.12]],[[0,1,2],[0,2,3],[1,3,2]],3,[0,0,-.1])}else e===1?(t0(a,[[.04,.15,.146,.004],[.34,.205,.2,.025],[.62,.188,.18,.017],[.8,.146,.138,.004],[.89,.098,.095,0],[.955,.084,.088,.008],[1.05,.08,.09,.018]],8,[0,1.15,.016],0),X(a,[[.027,1.046,.082],[-.027,1.046,.082],[0,.994,.082],[0,1.003,.232]],[[0,1,3],[1,2,3],[2,0,3]],2,[0,1.03,.1]),o0(a,1,!0),o0(a,-1,!0)):e===2?(t0(a,[[.2,.196,.192,.018],[.52,.2,.194,.024],[.79,.15,.141,.004],[.9,.095,.093,0],[1.03,.083,.092,.016]],6,[0,1.15,.016],0),X(a,[[.028,1.046,.08],[-.028,1.046,.08],[0,.994,.08],[0,1.003,.23]],[[0,1,3],[1,2,3],[2,0,3]],2,[0,1.03,.1])):t0(a,[[.28,.2,.196,.022],[.79,.154,.144,.004],[1.02,.084,.088,.018]],5,[0,1.09,.17],0);return g0(a)}function A0(){const e={pos:[],idx:[],part:[]};return t0(e,[[.1,.25,.25,0],[.42,.265,.26,.02],[.74,.15,.15,.01],[.95,.165,.175,.03]],6,[0,1.15,.03],4,1.05),g0(e)}const l0=[[6,3.2,52],[3,3.2,18],[0,3.2,0],[-5,3.4,-18],[-28,5.5,-16],[-42,8,0],[-38,11,27],[-16,14,45],[16,14,45],[73,12,21]];function F0(e,a,t){let m=1/0;for(let i=0;i<l0.length-1;i++){const r=l0[i],v=l0[i+1],n=v[0]-r[0],x=v[1]-r[1],y=v[2]-r[2],k=Y(((e-r[0])*n+(a-r[1])*x+(t-r[2])*y)/(n*n+x*x+y*y),0,1),c=e-r[0]-n*k,u=a-r[1]-x*k,g=t-r[2]-y*k;m=Math.min(m,c*c+u*u+g*g)}return Math.sqrt(m)}function b0(e,a,t){let m=1/0;for(let i=0;i<t.length-1;i++){const r=t[i][0],v=t[i][1],n=t[i+1][0],x=t[i+1][1],y=n-r,k=x-v,c=Y(((e-r)*y+(a-v)*k)/(y*y+k*k||1),0,1),u=e-r-y*c,g=a-v-k*c;m=Math.min(m,u*u+g*g)}return Math.sqrt(m)}async function N0(e,a,t,m){const i=[],r=e.range(0,50),v=l=>t.bodyR*(1+.055*a.n2(Math.cos(l)*1.25+r,Math.sin(l)*1.25)+.028*a.n2(Math.cos(l)*3.6-r,Math.sin(l)*3.6));t.rimR=v;const n=Math.PI*2,x=.05*t.hand;for(let l=1;l*p0<t.bodyR*1.13;l++){l%2===0&&await m();const p=l*p0,f=Math.max(3,Math.round(n*p/p0)),h=e()*n;for(let C=0;C<f;C++){let b=(C+.5+e.range(-.22,.22))/f*n+h;const M=p+e.range(-.1,.1);if(M>3.5){const L=t.lanes,H=((b+x*M)*L/n%1+1)%1,S=Math.min(.45,.36/(n*M/L));b+=(S*.5+H*(1-S)-H)*n/L}const V=v(b)-M;if(V<0)continue;const F=Math.sin(b),W=-Math.cos(b),D=F*M,$=W*M;let A=Math.cos(b)*t.hand*.7-F*.4+G.x*.5,O=Math.sin(b)*t.hand*.7-W*.4+G.y*.5;i.push({x:D,z:$,yaw:Math.atan2(A,O)+e.gauss()*.2,edge:V,spin:1,walk:-1,side:0})}}if(t.tail){const l=t.tailTip[0]-t.tailRoot[0],p=t.tailTip[1]-t.tailRoot[1],f=Math.hypot(l,p),h=l/f,C=p/f,b=C,M=-h,V=.6;for(let F=0;F<f+1.5;F+=V*.87){const W=Math.round(F/(V*.87));W%8===0&&await m();for(let D=-6;D<=6;D+=V){const $=Y(F/f,0,1),A=D+W%2*V*.5+e.range(-.17,.17),O=F+e.range(-.17,.17),H=j(t.tailW,1.25,Math.pow($,.8))*(1+.22*a.n2(O*.21+r,3.3+Math.sign(A)*2))*(1-E(.93,1.04,O/f))-Math.abs(A);if(H<0||e()>j(.97,.72,$))continue;const S=t.tailBow*Math.sin(Math.PI*$),R=t.tailRoot[0]+h*O+b*(A+S),J=t.tailRoot[1]+C*O+M*(A+S),I=Math.hypot(R,J),U=Math.atan2(R,-J);if(I<v(U)+.28)continue;const i0=G.x*.8-b*Math.sign(A)*.25,Q=G.y*.8-M*Math.sign(A)*.25;i.push({x:R,z:J,yaw:Math.atan2(i0,Q)+e.gauss()*.32,edge:H,spin:0,walk:-1,side:0,tail:!0})}}}await m();let y=i.length+t.walkers-t.count;if(y>0){const l=[];for(let f=0;f<i.length;f++)i[f].edge>2&&!i[f].tail&&l.push(f);e.shuffle(l);const p=new Set(l.slice(0,y));await m();for(let f=i.length-1;f>=0;f--)p.has(f)&&i.splice(f,1),f%256===0&&await m()}let k=0;for(;k<t.walkers;){const l=Math.min(t.walkers-k,e.int(3,6)),p=e.sign(),f=e();for(let h=0;h<l;h++)i.push({x:0,z:0,yaw:0,edge:0,spin:0,walk:(f+h*.0155+e.range(-.002,.002))%1,side:p,lane:e.range(.55,1)});k+=l}let c=0;for(const l of i)c++%256===0&&await m(),l.scale=Y(1+e.gauss()*.045,.88,1.1),l.girth=e.range(.9,1.13),l.r=[e(),e(),e(),e()],l.lean=e.range(.03,.16),l.open=l.walk>=0?1:1-E(.1,1.5,l.edge),l.headUp=e.chance(.06)?1:0,l.dTrack=l.walk>=0?99:b0(l.x,l.z,t.track);c=0;for(const l of i)c++%256===0&&await m(),l.dCam=l.walk>=0?0:t.customTrack?Math.hypot(l.dTrack,2.1):F0(l.x,1,l.z);await m();const u=i.map((l,p)=>p).sort((l,p)=>i[l].dCam-i[p].dCam);await m();const g=[[],[],[],[]];for(let l=0;l<u.length;l++){const p=i[u[l]];p.walk>=0?g[1].push(p):g[0].length<t.nA?g[0].push(p):g[1].length<t.nB+t.walkers?g[1].push(p):g[2].length<t.nC?g[2].push(p):g[3].push(p)}await m();const N=[];if(t.season==="august"){const l=i.filter(p=>p.walk<0&&(p.tail||p.edge<1.7));e.shuffle(l);for(let p=0;p<Math.min(t.chicks,l.length);p++){const f=l[p],h=.2*f.scale;N.push({x:f.x+Math.sin(f.yaw)*h,z:f.z+Math.cos(f.yaw)*h,yaw:f.yaw+e.range(-.5,.5),scale:e.range(.34,.44),girth:e.range(.92,1.1),r:[e(),e(),e(),e()],lean:.02,open:1,headUp:1,spin:f.spin,walk:-1,side:0})}}else if(t.season==="september"){const p=Math.ceil(t.chicks/30);for(let f=0;f<p;f++){const h=(f+e.range(.1,.9))/p*n,C=v(h)+e.range(2.2,4.5),b=Math.sin(h)*C,M=-Math.cos(h)*C;if(!(t.tail&&b0(b,M,[t.tailRoot,t.tailTip])<t.tailW+2.5))for(let V=0;V<30;V++){const F=V*2.39996,W=.2*Math.sqrt(V+.5)*e.range(.9,1.15);N.push({x:b+Math.cos(F)*W,z:M+Math.sin(F)*W,yaw:e.range(0,n),scale:e.range(.5,.62),girth:e.range(.95,1.15),r:[e(),e(),e(),e()],lean:.03,open:1,headUp:1,spin:1,walk:-1,side:0})}}}return{tiers:g,chicks:N,all:i}}function d0(e,a,t){const m=new d.InstancedBufferGeometry;m.index=e.index,m.setAttribute("position",e.getAttribute("position")),m.setAttribute("normal",e.getAttribute("normal")),m.setAttribute("aPart",e.getAttribute("aPart"));const i=a.length,r=new Float32Array(i*4),v=new Float32Array(i*4),n=new Float32Array(i*4),x=new Float32Array(i*4);for(let k=0;k<i;k++){const c=a[k],u=k*4;r[u]=c.x,r[u+1]=c.z,r[u+2]=c.yaw,r[u+3]=c.scale??1;const g=c.r||[.5,.5,.5,.5];v[u]=g[0],v[u+1]=g[1],v[u+2]=g[2],v[u+3]=g[3],n[u]=c.spin??0,n[u+1]=c.walk??-1,n[u+2]=(c.side||0)*(c.lane??1),n[u+3]=c.girth??1,x[u]=c.lean??.08,x[u+1]=c.open??1,x[u+2]=c.headUp??0,x[u+3]=c.waddle??0}m.setAttribute("aInst",new d.InstancedBufferAttribute(r,4)),m.setAttribute("aRnd",new d.InstancedBufferAttribute(v,4)),m.setAttribute("aKind",new d.InstancedBufferAttribute(n,4)),m.setAttribute("aMisc",new d.InstancedBufferAttribute(x,4)),m.instanceCount=i,m.boundingSphere=new d.Sphere(new d.Vector3(2,1,14),80);const y=new d.Mesh(m,t);return y.frustumCulled=!1,y.matrixAutoUpdate=!0,y}const K0={uniforms:null,parsVertex:"#include <fog_pars_vertex>",vertex:"#include <fog_vertex>",parsFragment:"#include <fog_pars_fragment>",fragment:"#include <fog_fragment>"},f0=`
uniform vec3 uKeyDir, uKeyCol, uSkyCol, uGroundCol, uRimCol, uEcMoonDir, uEcMoonCol;
uniform float uSat;
vec3 ecGrade(vec3 c){ float l = dot(c, vec3(0.2126, 0.7152, 0.0722)); return mix(l*vec3(0.97, 0.96, 1.09), c, uSat); }
`,D0=e=>`
attribute vec4 aInst, aRnd, aKind, aMisc;
attribute float aPart;
uniform float uTime, uSpin, uTuck, uBeakT, uBeakOn, uShuffle;
uniform vec2 uWind, uSpread;
uniform vec3 uBeakO;
uniform vec4 uPeel;
varying vec3 vWp, vN, vB, vBn;
varying vec4 vRnd, vFx;
${e.parsVertex}
void main(){
  vec2 xz = aInst.xy; float yaw = aInst.z; float waddle = aMisc.w;
  if (aKind.y >= 0.0) {
    float sd = aKind.z < 0.0 ? -1.0 : 1.0, lane = abs(aKind.z);
    float s = fract(aKind.y + uTime*uPeel.w);
    float th = uPeel.x + sd*s*uPeel.y;
    float r = uPeel.z - 0.5 + (0.9 + 2.3*lane)*sqrt(max(sin(3.14159*s), 0.0));
    xz = vec2(sin(th), -cos(th))*r;
    yaw = atan(cos(th)*sd, sin(th)*sd + 1e-5);
    waddle = 1.0;
  } else {
    float a = uSpin*aKind.x, c = cos(a), s = sin(a);
    xz = vec2(xz.x*c - xz.y*s, xz.x*s + xz.y*c); yaw -= a;
  }
  xz *= 1.0 + 0.5*uSpread.x*(0.8 + 0.4*aRnd.y);
  waddle = max(waddle, uSpread.y);
  vec2 face = vec2(sin(yaw), cos(yaw));
  // shuffle wave: a 3 m band every 9 m running downwind at 1.5 m/s; each bird steps 0.3 m and bobs
  float ph = dot(xz, uWind)/9.0 - uTime/6.0 + (aRnd.y - 0.5)*0.06;
  float k = fract(ph)*3.0, inb = step(k, 1.0);
  float stp = inb > 0.5 ? smoothstep(0.0, 1.0, k) : 1.0 - (k - 1.0)*0.5;
  xz += face*0.3*(stp - 0.5)*uShuffle;
  float bob = 0.04*inb*abs(sin(k*6.2832))*uShuffle;
  float roll = 0.12*inb*sin(k*6.2832)*uShuffle + 0.02*sin(uTime*0.9 + aRnd.z*40.0);
  float wph = uTime*5.6 + aRnd.x*6.2832;
  roll += 0.13*sin(wph)*waddle; bob += 0.022*abs(cos(wph))*waddle;
  // beak wave: a 6 m band running out from uBeakO at uBeakO.z m/s, every 20 m
  float isChick = step(3.5, aPart);
  float d = length(xz - uBeakO.xy) + aRnd.w*1.2;
  float q = (uBeakT*uBeakO.z - d)/20.0, fx = fract(q);
  float lift = step(0.0, q)*smoothstep(0.0, 0.07, fx)*(1.0 - smoothstep(0.2, 0.3, fx))*uBeakOn*(1.0 - isChick)*(1.0 - waddle);
  float tuck = uTuck*(0.65 + 0.35*aRnd.x)*(1.0 - aMisc.z)*(1.0 - 0.8*waddle);
  float pitch = mix(mix(0.06, 0.95, tuck), -1.0, lift);
  float hyaw = (1.0 - tuck)*(1.0 - lift)*(0.55 + 0.6*isChick)*sin(uTime*(0.25 + 0.35*aRnd.y + 0.5*isChick) + aRnd.z*50.0);

  vec3 p = position, n = normal;
  p.xz *= aKind.w;
  float hw = smoothstep(0.80, 0.98, position.y);
  p.y += 0.15*lift*smoothstep(0.45, 0.9, position.y) - 0.05*tuck*hw;
  vec3 pv = vec3(0.0, 0.88 + 0.14*lift, 0.01);
  vec3 h = p - pv;
  float a1 = hyaw*hw, c1 = cos(a1), s1 = sin(a1);
  h.xz = vec2(h.x*c1 + h.z*s1, -h.x*s1 + h.z*c1); n.xz = vec2(n.x*c1 + n.z*s1, -n.x*s1 + n.z*c1);
  float a2 = pitch*hw, c2 = cos(a2), s2 = sin(a2);
  h.yz = vec2(h.y*c2 - h.z*s2, h.y*s2 + h.z*c2); n.yz = vec2(n.y*c2 - n.z*s2, n.y*s2 + n.z*c2);
  p = pv + h;
  float a3 = aMisc.x*(1.0 - lift) + 0.1*waddle, c3 = cos(a3), s3 = sin(a3);
  p.yz = vec2(p.y*c3 - p.z*s3, p.y*s3 + p.z*c3); n.yz = vec2(n.y*c3 - n.z*s3, n.y*s3 + n.z*c3);
  float c4 = cos(roll), s4 = sin(roll);
  p.xy = vec2(p.x*c4 - p.y*s4, p.x*s4 + p.y*c4); n.xy = vec2(n.x*c4 - n.y*s4, n.x*s4 + n.y*c4);
  float c5 = cos(yaw), s5 = sin(yaw);
  p.xz = vec2(p.x*c5 + p.z*s5, -p.x*s5 + p.z*c5); n.xz = vec2(n.x*c5 + n.z*s5, -n.x*s5 + n.z*c5);
  p *= aInst.w;
  p.xz += xz; p.y += bob;
  vec4 wp = modelMatrix*vec4(p, 1.0);
  vec3 ecWorld = wp.xyz;
  vWp = wp.xyz; vN = mat3(modelMatrix)*n; vB = position; vBn = normal; vRnd = aRnd;
  vFx = vec4(lift, aMisc.y, aPart, tuck);
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  ${e.vertex}
}`,P0=e=>`
uniform vec2 uWind;
uniform float uRime;
uniform vec3 uBelly, uLemon, uGold, uRimeCol, uLilac;
${f0}
varying vec3 vWp, vN, vB, vBn;
varying vec4 vRnd, vFx;
${e.parsFragment}
float bHash(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.y); }
float bVN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(bHash(i), bHash(i + vec2(1.0, 0.0)), f.x), mix(bHash(i + vec2(0.0, 1.0)), bHash(i + vec2(1.0, 1.0)), f.x), f.y); }
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0)); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWp + vec3(0.0, 1e-4, 0.0));
  vec3 nb = normalize(vBn + vec3(0.0, 1e-4, 0.0));
  float y = vB.y, front = nb.z, side = abs(nb.x), part = vFx.z, lift = vFx.x;
  float fineB = 1.0 - smoothstep(0.006, 0.03, fwidth(vB.y) + fwidth(vB.x));
  // plumage, painted in bird space: slate-blue back, black head, white belly with a dark border down the flank
  float mott = mix(0.5, bVN(vec2(vB.x*26.0 + vRnd.x*30.0, y*11.0 + vRnd.y*30.0)), fineB);
  vec3 back = mix(vec3(0.115, 0.125, 0.168)*(0.82 + 0.36*mott), vec3(0.018, 0.018, 0.026), smoothstep(0.84, 0.925, y))*(0.8 + 0.4*vRnd.y);
  float belly = smoothstep(-0.14, 0.03, front)*(1.0 - smoothstep(0.885, 0.93, y));
  vec3 bellyCol = mix(uBelly*(0.9 + 0.1*vRnd.x), uLemon, smoothstep(0.6, 0.88, y)*0.85);
  bellyCol *= 0.82 + 0.18*smoothstep(0.05, 0.4, y);
  float throat = lift*smoothstep(-0.8, -0.15, front)*smoothstep(0.62, 0.84, y)*(1.0 - smoothstep(1.0, 1.08, y));
  belly = max(belly, throat);
  vec3 alb = mix(back, mix(bellyCol, uLemon*1.1, throat*0.6), belly);
  float bord = (1.0 - smoothstep(0.02, 0.17, abs(front + 0.06)))*smoothstep(0.3, 0.5, y)*(1.0 - throat);
  alb = mix(alb, vec3(0.02, 0.021, 0.03), bord*0.8);
  float ear = smoothstep(0.3, 0.6, side)*smoothstep(0.885, 0.92, y)*(1.0 - smoothstep(1.035, 1.08, y))*(1.0 - smoothstep(0.35, 0.75, front))*smoothstep(-0.85, -0.45, front);
  alb = mix(alb, uGold*1.5, ear*0.92*(1.0 - 0.5*throat));
  if (part < 0.5) {
    // the flipper's shape painted on the flank: a contact shade under the modelled flipper, the flipper itself on far birds
    float fy = clamp((y - 0.3)/0.5, 0.0, 1.0);
    float fw = 0.014 + 0.052*sin(fy*3.14159)*(0.55 + 0.45*fy);
    float flip = (1.0 - smoothstep(fw, fw + 0.02, abs(vB.z - 0.006)))*smoothstep(0.1, 0.14, abs(vB.x))*step(0.3, y)*(1.0 - smoothstep(0.77, 0.81, y));
    alb = mix(alb, vec3(0.03, 0.032, 0.045), flip*0.85);
  } else if (part < 1.5) alb = mix(vec3(0.021, 0.022, 0.032), vec3(0.06, 0.063, 0.085), smoothstep(0.4, 0.75, y)*0.7);
  else if (part < 2.5) alb = mix(vec3(0.022, 0.02, 0.028), uLilac, (1.0 - smoothstep(1.012, 1.026, y))*smoothstep(0.1, 0.13, vB.z)*(1.0 - smoothstep(0.17, 0.2, vB.z)));
  else if (part < 3.5) alb = vec3(0.028, 0.027, 0.034);
  else {
    // chick: silver down, black cap and collar, white mask
    float hd = smoothstep(0.68, 0.76, y);
    float mask = max(smoothstep(-0.05, 0.3, front), smoothstep(0.45, 0.8, side))*(1.0 - smoothstep(0.99, 1.05, y));
    vec3 down = vec3(0.30, 0.31, 0.35)*(0.85 + 0.3*vRnd.x)*(0.75 + 0.25*smoothstep(0.1, 0.6, y));
    alb = mix(down, mix(vec3(0.02, 0.02, 0.028), uBelly, mask), hd);
  }
  // rime: on the windward side, on anything that faces up, and on the shoulder that faces the key
  vec3 w3 = normalize(vec3(uWind.x, -0.4, uWind.y));
  float grain = mix(0.5, 0.65*bVN(vB.xy*34.0 + vRnd.xy*40.0) + 0.35*bVN(vB.zy*15.0 + vRnd.zw*23.0), fineB);
  float shoulder = smoothstep(0.5, 0.66, y)*(1.0 - smoothstep(0.85, 0.93, y));
  float ndk = dot(N, uKeyDir);
  float rimeW = smoothstep(0.2, 0.9, dot(N, -w3))*(0.3 + 0.7*vRnd.z);
  // the shoulder that looks at the key is frosted, and more plainly on the birds under the lens
  float camD = length(cameraPosition - vWp);
  float rimeK = smoothstep(0.0, 0.6, dot(N, normalize(uKeyDir + vec3(0.0, 0.95, 0.0))))*shoulder*(0.7 + 0.3*vRnd.x)*(1.0 - 0.6*belly)*(2.0 - smoothstep(3.0, 9.0, camD));
  float rime = (max(rimeW, rimeK*1.6) + smoothstep(0.5, 0.96, N.y)*(0.22 + 0.3*shoulder))*uRime;
  rime = clamp(rime*1.4 - 0.32 + (grain - 0.5)*1.3, 0.0, 1.0)*(part > 3.5 ? 0.4 : 1.0)*(part > 1.5 && part < 2.5 ? 0.2 : 1.0);
  rime *= (1.0 - 0.75*smoothstep(0.86, 0.95, y))*(0.55 + 0.45*smoothstep(0.25, 0.7, y));
  alb = mix(alb, uRimeCol, rime*0.8);
  // light: pearl key with a broad wrap on the dark plumage, violet sky, an indigo lee side, crowd occlusion
  // toward the feet, pearl rim
  float open = vFx.y;
  float ao = mix(mix(0.13, 0.6, open), 1.0, smoothstep(0.12, 1.05, y + 0.3*lift));
  ao = mix(ao, 1.0, lift*0.7);
  float kdl = clamp((ndk + 0.3)/1.3, 0.0, 1.0), kd = kdl*kdl;
  vec3 hemi = mix(uGroundCol*ao, uSkyCol, N.y*0.5 + 0.5);
  vec3 col = alb*(hemi*ao + uKeyCol*(kd + 0.5*kdl*(1.0 - belly))*mix(ao, 1.0, 0.3));
  col *= mix(vec3(1.0), vec3(0.5, 0.54, 0.9), (1.0 - smoothstep(-0.55, 0.3, ndk))*0.9);
  float fr1 = 1.0 - clamp(dot(N, V), 0.0, 1.0); float fr = fr1*fr1*fr1;
  float toward = clamp(dot(uKeyDir, -V)*0.6 + 0.65, 0.0, 1.0);
  col += uRimCol*fr*ao*toward*(0.07 + 0.75*rime + 0.22*belly + 0.2*step(3.5, part));
  col += uRimCol*fr1*fr1*kdl*ao*0.16;
  col += uRimCol*lift*0.15*smoothstep(0.55, 0.95, y);
  // a second, warm light (the world's low moon; black when the world sets none): gold on the side that faces it and
  // a warm rim on rime, bellies and down when it stands behind the bird
  float mdl = max(dot(N, uEcMoonDir), 0.0);
  float towardM = clamp(dot(uEcMoonDir, -V)*0.6 + 0.62, 0.0, 1.0);
  col += alb*uEcMoonCol*mdl*2.0*mix(ao, 1.0, 0.4);
  col += uEcMoonCol*fr*ao*towardM*(0.35 + 1.3*rime + 0.7*belly + 0.6*step(3.5, part));
  col += uGold*ear*dot(uEcMoonCol, vec3(0.6))*ao*(0.15 + 0.7*mdl);
  vec3 Hh = normalize(uKeyDir + V + vec3(0.0, 1e-4, 0.0));
  float sp = max(dot(N, Hh), 0.0); sp *= sp; sp *= sp; sp *= sp;
  col += uKeyCol*(sp*sp*0.12 + sp*0.035)*ao*(1.0 - rime);
  col = ecGrade(col);
  gl_FragColor = vec4(col, 1.0);
  ${e.fragment}
}`;function W0(e,a){return new d.ShaderMaterial({uniforms:e,vertexShader:D0(a),fragmentShader:P0(a),fog:!0,side:d.DoubleSide})}const O0=`
uniform vec4 uHud, uTailSeg;
float ecHash(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.y); }
float ecVN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(ecHash(i), ecHash(i + vec2(1.0, 0.0)), f.x), mix(ecHash(i + vec2(0.0, 1.0)), ecHash(i + vec2(1.0, 1.0)), f.x), f.y); }
float ecFbm(vec2 p){ return 0.5*ecVN(p) + 0.25*ecVN(p*2.03 + 7.1) + 0.125*ecVN(p*4.1 + 3.3) + 0.0625*ecVN(p*8.3 + 1.7); }
float ecCommaSd(vec2 p){
  float d = length(p) - uHud.x;
  vec2 pa = p - uTailSeg.xy, ba = uTailSeg.zw - uTailSeg.xy;
  float t = clamp(dot(pa, ba)/max(dot(ba, ba), 1e-4), 0.0, 1.0);
  float dt = length(pa - ba*t) - mix(uHud.z, 1.1, t);
  return mix(d, min(d, dt), uHud.y);
}
// one round pock per cell: a hashed centre and radius; lit is the share of cells that hold one
float ecPock(vec2 p, float px, float lit){
  vec2 i = floor(p), f = fract(p);
  float h = ecHash(i + 3.7);
  vec2 c = 0.32 + 0.36*vec2(ecHash(i + 11.1), ecHash(i + 23.9));
  float r = 0.14 + 0.16*fract(h*7.7);
  return (1.0 - smoothstep(r*0.45, r + px, length(f - c)))*step(1.0 - lit, h)*(0.6 + 0.4*fract(h*31.3));
}
vec3 ecStain(vec2 p, float px){
  float sd = ecCommaSd(p) + (ecFbm(p*0.22) - 0.5)*5.0;
  float mott = ecFbm(p*0.45 + 11.0);
  float stain = (1.0 - smoothstep(-3.0, 13.0, sd))*(0.55 + 0.6*mott);
  stain += (1.0 - smoothstep(0.0, 5.0, sd))*0.25;
  float r = length(p), th = atan(p.x, -p.y + 1e-4);
  float fine = 1.0 - smoothstep(0.06, 0.35, px);
  // tobogganing grooves: pale polished lines fanning out from the rim
  float u = th*7.3211 + 2.6*ecVN(vec2(r*0.06, 3.0)) + 0.5*ecVN(vec2(r*0.27, 9.0));
  float cell = floor(u), dm = abs(fract(u) - 0.5)*(r/7.3211);
  float hc = ecHash(vec2(cell, 5.0));
  float east = 0.5 + 0.5*p.x/max(r, 1.0);
  float reach = uHud.x + 4.0 + (8.0 + 26.0*east)*ecHash(vec2(cell, 8.0));
  float groove = (1.0 - smoothstep(0.1, 0.3 + px, dm))*step(0.72 - 0.4*east, hc)*smoothstep(uHud.x - 3.0, uHud.x + 1.0, r)*(1.0 - smoothstep(reach - 6.0, reach, r));
  // files of footprints between the grooves
  float u2 = th*4.7746 + 2.7 + 0.8*ecVN(vec2(r*0.09, 17.0));
  float c2 = floor(u2), d2 = (fract(u2) - 0.5)*(r/4.7746);
  float lr = step(0.5, fract(r*1.15));
  float fp = (1.0 - smoothstep(0.05, 0.11, abs(d2 - (lr - 0.5)*0.26)))*(1.0 - smoothstep(0.12, 0.2, abs(fract(r*2.3) - 0.5)));
  fp *= step(0.35, ecHash(vec2(c2, 2.0)))*smoothstep(uHud.x - 1.0, uHud.x + 2.0, r)*(1.0 - smoothstep(38.0, 52.0, r))*fine;
  // the trodden floor: small round foot pocks (one hashed dot to a cell, on two turned and warped lattices, so no
  // square edge and no row) over soft smears; denser toward the rim, and gone before a pock is under a pixel
  vec2 pw = p + 0.5*(vec2(ecVN(p*1.3 + 5.0), ecVN(p*1.3 + 31.0)) - 0.5);
  float pfade = 1.0 - smoothstep(0.05, 0.15, px);
  float rimK = 1.0 - smoothstep(0.0, 10.0, sd);
  float pocks = (1.1*ecPock(vec2(pw.x*0.8 - pw.y*0.6, pw.x*0.6 + pw.y*0.8)*4.6, px*4.6, 0.25 + 0.5*rimK)
               + 0.8*ecPock(vec2(pw.x*0.47 + pw.y*0.88, pw.y*0.47 - pw.x*0.88)*8.3 + 13.0, px*8.3, 0.2 + 0.45*rimK))*pfade*rimK;
  pocks += 0.45*smoothstep(0.5, 0.8, ecVN(vec2(pw.x*0.8 - pw.y*0.6, pw.x*0.6 + pw.y*0.8)*1.7 + 7.0))*fine*rimK;      // (the same in every direction: stretched 2.4 to 1 along one axis the smears were streaks, all one way)
  float contact = 1.0 - smoothstep(-1.2, 0.5, ecCommaSd(p) + (ecVN(p*1.3) - 0.5)*1.2);
  return vec3(clamp(stain + pocks*0.3, 0.0, 1.0), clamp(groove*0.5 + fp*0.6, 0.0, 1.0), contact);
}
`,H0=e=>`
varying vec3 vWp; varying vec2 vL;
${e.parsVertex}
void main(){
  vL = position.xz;
  vec4 wp = modelMatrix*vec4(position, 1.0); vec3 ecWorld = wp.xyz; vWp = wp.xyz;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  ${e.vertex}
}`,G0=e=>`
uniform vec2 uWind; uniform vec3 uSnow, uStainCol, uShadowCol, uDecal;
${f0}
${O0}
varying vec3 vWp; varying vec2 vL;
${e.parsFragment}
float ecRidge(vec2 p){ vec2 w = uWind, c = vec2(-w.y, w.x); vec2 q = vec2(dot(p, c), dot(p, w));
  return ecVN(vec2(q.x*1.3 + 0.6*ecVN(q*0.11), q.y*0.33)) + 0.5*ecVN(vec2(q.x*3.7 + 3.0, q.y*0.8)); }
void main(){
  float px = max(fwidth(vL.x), fwidth(vL.y));
  vec3 st = ecStain(vL, px);
  float fine = 1.0 - smoothstep(0.03, 0.22, px);
  // wind-packed snow: low ridges along the wind, lit from the key side
  vec2 kd = uKeyDir.xz/max(length(uKeyDir.xz), 1e-3);
  float r0 = ecRidge(vL), r1 = ecRidge(vL + kd*0.18);
  float slope = clamp((r0 - r1)*1.3, -1.0, 1.0)*fine;
  vec2 qd = vec2(dot(vL, vec2(-uWind.y, uWind.x)), dot(vL, uWind));
  float drift = ecVN(vec2(qd.x*0.23, qd.y*0.028)) - 0.5;
  float gl = ecVN(vL*0.13 + 4.0);
  vec3 alb = uSnow*(0.84 + 0.16*gl + 0.2*drift + 0.07*(r0 - 0.75)*fine);
  alb = mix(alb, uStainCol*(0.8 + 0.4*ecVN(vL*2.3)), st.x*0.85);
  alb = mix(alb, uSnow*1.08, st.y*0.75);
  alb = mix(alb, uShadowCol*0.5, st.z*0.9);
  float key = max(0.3 + uKeyDir.y*0.9 + slope*0.6, 0.0);
  vec3 col = alb*(uSkyCol*(0.75 + 0.15*slope) + uGroundCol*0.25 + uKeyCol*key);
  col += uRimCol*max(slope, 0.0)*0.10*(1.0 - st.x)*(1.0 - st.z);
  col = ecGrade(col);
  float dc = length(vL - uDecal.xy);
  float a = 1.0 - smoothstep(uDecal.z*0.7, uDecal.z, dc);
  float marks = clamp(max(max(st.x*1.3, st.y), st.z), 0.0, 1.0);
  a *= mix(1.0, marks, step(0.5, uHud.w));
  gl_FragColor = vec4(col, a);
  ${e.fragment}
}`,I0=e=>`
attribute vec4 aS, aS2;
uniform float uTime, uSpin, uCalm, uRise, uSteamClock, uBeakT, uBeakOn, uSteamAmt;
uniform vec2 uWind, uSpread;
uniform vec3 uBeakO, uKeyDir;
varying vec2 vUv, vKeyV; varying vec4 vS; varying vec3 vWp; varying float vY, vTorn;
${e.parsVertex}
void main(){
  float kind = aS2.y, rnd = aS2.z;
  float ca = cos(uSpin), sa = sin(uSpin);
  vec2 xz = vec2(aS.x*ca - aS.z*sa, aS.x*sa + aS.z*ca)*(1.0 + 0.5*uSpread.x);
  vec3 c; float size; float alpha; float stretch = 0.0; float lo; float tall = 1.0; float rag = 0.0;
  if (kind < 0.5) {
    rag = aS.y;
    float L = fract(aS2.x + uSteamClock*(0.7 + 0.6*rnd));
    float cl = smoothstep(rnd*0.4, rnd*0.4 + 0.6, uCalm);
    vec3 ps = vec3(xz.x, mix(1.45 + rnd*0.7 + L*1.3, 1.55 + rnd*0.5 + L*0.4, aS.y) + 0.25*sin(uTime*2.1 + rnd*60.0), xz.y) + vec3(uWind.x, 0.0, uWind.y)*(L*L*24.0 + L*5.0);
    float yy = uRise*L*sqrt(sqrt(L))*(0.7 + 0.3*rnd);
    vec2 sway = vec2(sin(uTime*0.31 + rnd*40.0 + yy*0.33), cos(uTime*0.27 + rnd*31.0 + yy*0.29))*(0.25 + 0.11*yy)*aS2.w;
    vec3 pc = vec3(xz.x + sway.x, 1.5 + yy, xz.y + sway.y);
    c = mix(ps, pc, cl);
    size = aS.w*mix(0.8 + 2.0*L, 0.75 + 1.7*L, cl);
    stretch = size*(1.5 + 3.0*aS.y)*(1.0 - cl); tall = mix(0.5, 1.8, cl);
    float e1 = 1.0 - L;
    alpha = mix(sin(3.14159*L)*0.52*(0.35 + 0.65*fract(rnd*7.31))*(0.6 + 0.4*sin(uTime*1.7 + rnd*40.0)), smoothstep(0.0, 0.05, L)*e1*(0.13 + 0.1*aS2.w), cl)*uSteamAmt*(1.0 + aS.y*(-0.3 - 0.7*cl));
    lo = 1.15;
  } else {
    float d = length(xz - uBeakO.xy) + rnd*1.2;
    float tt = uBeakT - d/uBeakO.z;
    float life = mod(max(tt, 0.0), 20.0/uBeakO.z);
    float l = clamp((life - 0.3)/2.3, 0.0, 1.0);
    c = vec3(xz.x, aS.y + 0.12 + 0.75*l, xz.y) + vec3(uWind.x, 0.0, uWind.y)*l*(0.35 + 2.5*(1.0 - uCalm));
    size = aS.w*(0.2 + 0.7*l);
    alpha = smoothstep(0.0, 0.1, l)*(1.0 - l)*(1.0 - l)*0.75*uBeakOn*step(0.0, tt);
    lo = 1.02;
  }
  vec3 wind3 = vec3(uWind.x, 0.0, uWind.y);
  float sgn = (viewMatrix*modelMatrix*vec4(wind3, 0.0)).x < 0.0 ? -1.0 : 1.0;
  vec4 wp = modelMatrix*vec4(c + wind3*position.x*stretch*sgn, 1.0);
  vec3 ecWorld = wp.xyz;
  vec4 mvPosition = viewMatrix*wp;
  mvPosition.xy += position.xy*size*2.0*vec2(1.0, tall);
  vY = c.y + position.y*size*2.0*tall;
  alpha *= smoothstep(0.7 + 3.3*rag, 4.0 + 5.0*rag, -mvPosition.z);   // rags thin out before they reach the lens: the nearest birds stay clear
  vUv = position.xy*2.0; vS = vec4(alpha, kind, rnd, lo); vTorn = kind < 0.5 ? (1.0 - uCalm)*(1.0 + rag) : 0.0;
  vKeyV = (viewMatrix*vec4(uKeyDir, 0.0)).xy;
  vWp = wp.xyz;
  gl_Position = projectionMatrix*mvPosition;
  ${e.vertex}
}`,U0=e=>`
uniform vec3 uSteamCol; uniform float uSteamRim, uTime;
${f0}
varying vec2 vUv, vKeyV; varying vec4 vS; varying vec3 vWp; varying float vY, vTorn;
${e.parsFragment}
float pHash(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.y); }
float pVN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(pHash(i), pHash(i + vec2(1.0, 0.0)), f.x), mix(pHash(i + vec2(0.0, 1.0)), pHash(i + vec2(1.0, 1.0)), f.x), f.y); }
void main(){
  float r2 = dot(vUv, vUv);
  if (r2 > 1.0 || vS.x < 0.003) discard;
  float n = pVN(vUv*1.7 + vS.z*37.0 + vec2(0.0, -uTime*0.12)) + 0.5*pVN(vUv*4.1 + vS.z*11.0);
  float g = exp(-r2*3.6)*(1.0 - smoothstep(0.55, 1.0, r2));
  // while it blows the steam is torn into rags: finer streaks along the wind and holes between them
  float tornK = min(vTorn, 1.0), ragK = clamp(vTorn - 1.0, 0.0, 1.0);
  n += tornK*0.6*(pVN(vec2(vUv.x*2.2 + vS.z*23.0, vUv.y*3.2 + vS.z*5.0)) - 0.5);
  float a = smoothstep(0.02 + 0.1*tornK, 0.75 - 0.2*tornK, g*(0.35 + 0.95*n) - 0.06)*vS.x;
  // a rag (vTorn = 2) is a bundle of thin strands drawn along the wind inside a soft envelope: its outline is
  // the strands' own, never the sprite's
  float strand = 0.6*pVN(vec2(vUv.x*2.2 + vS.z*23.0, vUv.y*5.5 + vS.z*5.0)) + 0.4*pVN(vec2(vUv.x*5.0 + vS.z*3.0, vUv.y*12.0 + vS.z*9.0));
  a = mix(a, min(g*2.2, 1.0)*smoothstep(0.22, 0.85, strand)*min(vS.x*1.2, 0.42), ragK);
  a *= smoothstep(vS.w, vS.w + 0.45 - 0.15*step(0.5, vS.y), vY);
  float lit = clamp(dot(vUv/max(sqrt(r2), 1e-3), vKeyV/max(length(vKeyV), 1e-3))*0.5 + 0.5, 0.0, 1.0);
  float rim = lit*lit*smoothstep(0.04, 0.4, r2)*(1.0 - smoothstep(0.4, 0.9, r2))*(1.0 - step(0.5, vS.y));
  vec3 col = uSteamCol*(uSkyCol*1.3 + uGroundCol*0.6 + uKeyCol*(0.5 + 0.45*lit))*(1.0 + 0.3*ragK);
  col += uRimCol*(rim*uSteamRim + 0.45*step(0.5, vS.y));
  col = ecGrade(col);
  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
  ${e.fragment}
}`,q=null;async function E0(e,a={}){const t=e.rng.fork("emperor-clearing-hero"),m=e.noise,i=Y(e.quality?.detail??1,.5,1),r=(a.palette&&a.palette.length>=7?a.palette:T0).map(o=>new d.Color(o)),v=a.duration??42,n=Object.assign({windStop:20,beakStart:19.8,pass:18,uncover:21.5},a.times||{}),x=a.season||(()=>{const o=t();return o<.62?"august":o<.86?"september":"july"})(),y=a.rareBreak??t.chance(.06),k=t.sign(),c={season:x,hand:k,lanes:t.int(10,16),bodyR:x==="july"?19.2:V0*t.range(.98,1.03),tail:x!=="july",tailRoot:[t.range(2.4,3.2),15.5],tailTip:[6+t.range(-.8,.8),51+t.range(0,2.5)],tailW:t.range(3.7,4.6),tailBow:t.range(-1.3,1.3),count:a.count??4e3,walkers:56,nA:Math.round(400*i),nB:Math.round(660*i),nC:Math.round(1150*i),customTrack:!!a.track,chicks:x==="july"?0:400,track:a.track||[[6,58],[6,52],[3,18],[0,0],[-5,-18],[-8,-27]]},u=Object.assign({},K0,a.fog||{}),g=(o,s)=>{const w=k0(o),B=Math.cos(s*e0);return new d.Vector3(w.x*B,Math.sin(s*e0),w.y*B)},N=(o,s=1)=>new d.Color(o).multiplyScalar(s),l={keyDir:g(50,12),keyColor:r[0].clone().multiplyScalar(1.5),skyColor:r[0].clone().multiplyScalar(.8),groundColor:r[0].clone().multiplyScalar(.42),rimColor:r[2].clone().multiplyScalar(.5)},p={keyDir:g(60,22),keyColor:N("#E9D8F0",1.3),skyColor:N("#3A2F6B",1.6).add(r[0].clone().multiplyScalar(.28)),groundColor:r[2].clone().multiplyScalar(.2),rimColor:r[2].clone().lerp(r[4],.4).multiplyScalar(1.55)},f={},h=d.UniformsUtils.merge([d.UniformsLib.fog,{uTime:{value:0},uSpin:{value:0},uCalm:{value:1},uTuck:{value:.3},uBeakT:{value:0},uBeakOn:{value:1},uShuffle:{value:1},uRime:{value:t.range(.8,1.05)},uSat:{value:1},uRise:{value:y?25:12},uSteamClock:{value:0},uSteamAmt:{value:1},uSteamRim:{value:1.5},uWind:{value:G.clone()},uSpread:{value:new d.Vector2(0,0)},uBeakO:{value:new d.Vector3(-4,-14,5)},uPeel:{value:new d.Vector4(330*e0,Math.PI,c.bodyR+.3,1/105)},uKeyDir:{value:p.keyDir.clone()},uKeyCol:{value:p.keyColor.clone()},uSkyCol:{value:p.skyColor.clone()},uGroundCol:{value:p.groundColor.clone()},uRimCol:{value:p.rimColor.clone()},uBelly:{value:r[2].clone().multiplyScalar(.86).lerp(new d.Color(.62,.61,.6),.35)},uLemon:{value:new d.Color(.62,.56,.3)},uGold:{value:N("#D2A040",.62)},uEcMoonDir:{value:new d.Vector3(0,1,0)},uEcMoonCol:{value:new d.Color(0,0,0)},uRimeCol:{value:r[2].clone().multiplyScalar(.84)},uLilac:{value:r[4].clone().lerp(r[6],.45).multiplyScalar(.55)},uSnow:{value:r[2].clone().multiplyScalar(.8)},uStainCol:{value:new d.Color(.2,.185,.19)},uShadowCol:{value:r[1].clone()},uSteamCol:{value:r[2].clone().multiplyScalar(.62)},uHud:{value:new d.Vector4(c.bodyR,c.tail?1:0,c.tailW,a.ground==="stain"?1:0)},uTailSeg:{value:new d.Vector4(c.tailRoot[0],c.tailRoot[1],c.tailTip[0],c.tailTip[1])},uDecal:{value:new d.Vector3(2,14,66)}}]);if(u.uniforms)for(const o of Object.keys(u.uniforms))h[o]=u.uniforms[o];const C=new d.Group;C.name="emperor-huddle",await e.yield?.();const b=await N0(t,m,c,()=>e.yield?.());await e.yield?.();const M=W0(h,u);await e.yield?.();const V=[n0(0),n0(1),n0(2),n0(3)],F=A0(),W=[];for(let o=0;o<4;o++){await e.yield?.();const s=d0(V[o],b.tiers[o],M);s.name="birds-tier"+o,C.add(s),W.push(s)}if(await e.yield?.(),b.chicks.length){const o=d0(F,b.chicks,M);o.name="chicks",C.add(o),W.push(o)}if(await e.yield?.(),a.ground!==!1){const o=new d.CircleGeometry(66,48);o.rotateX(-Math.PI/2),o.translate(2,.03,14);const s=new d.ShaderMaterial({uniforms:h,vertexShader:H0(u),fragmentShader:G0(u),fog:!0,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),w=new d.Mesh(o,s);w.name="colony-ground",w.renderOrder=1,C.add(w)}const D=[],$=t.int(7,10);for(let o=0;D.length<$&&o<400;o++){const s=t.range(0,Math.PI*2),w=Math.sqrt(t())*c.bodyR*.72,B=Math.sin(s)*w,z=-Math.cos(s)*w;D.every(_=>Math.hypot(_[0]-B,_[1]-z)>6.5)&&D.push([B,z,t.range(.8,1.2)])}const A=Math.round(300*i),O=Math.round(420*i),L=Math.round(40*i)+8,H=A+O+L,S=new Float32Array(H*4),R=new Float32Array(H*4),J=b.all.filter(o=>o.walk<0);for(let o=0;o<A+O;o++){const s=o*4;if(o<A){if(o<A*.72){const w=D[o%D.length],B=t.range(0,Math.PI*2),z=Math.abs(t.gauss())*1.1;S[s]=w[0]+Math.cos(B)*z,S[s+2]=w[1]+Math.sin(B)*z,S[s+3]=t.range(1,1.7)*w[2],R[s+3]=1}else{const w=t.pick(J);S[s]=w.x,S[s+2]=w.z,S[s+3]=t.range(.6,1.1),R[s+3]=.5}S[s+1]=0,R[s]=t(),R[s+1]=0,R[s+2]=t()}else{const w=t.pick(J);S[s]=w.x+Math.sin(w.yaw)*.2,S[s+1]=1.3*w.scale,S[s+2]=w.z+Math.cos(w.yaw)*.2,S[s+3]=t.range(.8,1.3),R[s]=t(),R[s+1]=1,R[s+2]=(w.spin>0,t()),R[s+3]=0}}const I=R0(B0("ec-rags:"+b.all.length+":"+c.lanes+":"+Math.round(c.tailW*1e4)));for(let o=A+O;o<H;o++){const s=o*4,w=I(),B=j(24,-22,w),z=B>0?B/6:B*.28,_=I.range(-6,6),Z=I.range(6.5,11);S[s]=z-G.x*Z-G.y*_,S[s+1]=1,S[s+2]=B-G.y*Z+G.x*_,S[s+3]=o>=H-8?I.range(1.4,1.8):I.range(.85,1.4),R[s]=I(),R[s+1]=0,R[s+2]=I(),R[s+3]=.5}const U=new d.InstancedBufferGeometry;U.setAttribute("position",new d.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),U.setIndex([0,1,2,0,2,3]),U.setAttribute("aS",new d.InstancedBufferAttribute(S,4)),U.setAttribute("aS2",new d.InstancedBufferAttribute(R,4)),U.instanceCount=H,U.boundingSphere=new d.Sphere(new d.Vector3(2,6,14),90);const i0=new d.ShaderMaterial({uniforms:h,vertexShader:I0(u),fragmentShader:U0(u),fog:!0,transparent:!0,depthWrite:!1}),Q=new d.Mesh(U,i0);Q.name="steam-breath",Q.frustumCulled=!1,Q.renderOrder=3,C.add(Q);const T=(o,s,w)=>new d.Vector3(o,s,w),S0=T(25.5,16,-10.5).normalize(),z0={gaze:T(1,1.2,c.tail?7:0),trackIn:[T(6,3.2,52),T(3,3.2,18),T(0,3.2,0),T(-5,3.4,-18)],flyThrough:l0.map(o=>T(o[0],o[1],o[2])),theImage:{position:T(-41,10,16),target:T(2,1.5,6)},portalSeat:{position:T(124,44,0),facing:S0.clone().negate()},beakOrigin:T(h.uBeakO.value.x,0,h.uBeakO.value.y),tailTip:T(c.tailTip[0],0,c.tailTip[1]),rimNorth:T(-5,0,-c.bodyR),windDir:T(G.x,0,G.y),steamColumns:D.map(o=>T(o[0],1.5+h.uRise.value,o[1]))};let s0=q&&q.u!=null?q.u:null;const K={calm:null,tuck:null,sat:null,beakT:null,spread:null,rime:null},m0=Math.PI*2/300,h0=new d.Vector3,v0={object:C,radius:q?q.radius:40,height:q?q.height:14,center:q?T(...q.center):T(2,2,14),anchors:z0,uniforms:h,season:x,rare:y,ground:!0,groundY:0,counts:{birds:b.all.length,tiers:b.tiers.map(o=>o.length),chicks:b.chicks.length,steam:A,breath:O,rags:L},setProgress(o){s0=o},setLight(o){Object.assign(f,o||{})},set(o){Object.assign(K,o||{})},makeBirds(o,s=0){const w=t.fork("extra-birds"),B=d0(V[Y(s|0,0,3)],o.map(z=>({x:z.x,z:z.z,yaw:z.yaw??0,scale:z.scale??1,lean:z.lean??.1,girth:z.girth??w.range(.92,1.1),r:[w(),w(),w(),w()],spin:0,walk:-1,side:0,open:1,headUp:z.headUp??1,waddle:z.walk?1:0})),M);return B.name="extra-birds",B},update(o,s,w){const B=Math.min(Math.max(o||0,0),.1);let z=1,_=.3,Z=1,r0=s,y0=k*m0*s,c0=1,u0=0,x0=0;if(s0!=null){const P=s0*v;z=E(n.windStop,n.windStop+1.6,P),_=j(1,.3,E(n.windStop,n.windStop+4,P)),Z=j(.13,1,E(n.windStop+.6,n.uncover+1.5,P)),r0=P-n.beakStart,y0=k*m0*(P-n.pass),c0=E(n.windStop+.5,n.uncover+1,P),y&&(u0=E(n.windStop+.3,n.windStop+6.3,P),x0=E(n.windStop+.3,n.windStop+1.2,P)*(1-E(n.windStop+5.4,n.windStop+6.6,P)))}K.calm!=null&&(z=K.calm),K.tuck!=null&&(_=K.tuck),K.sat!=null&&(Z=K.sat),K.beakT!=null&&(r0=K.beakT),K.spread!=null&&(u0=K.spread),K.rime!=null&&(h.uRime.value=K.rime),h.uTime.value=s,h.uSpin.value=y0,h.uCalm.value=z,h.uTuck.value=_,h.uSat.value=Z,h.uBeakT.value=r0,h.uSpread.value.set(u0,x0),h.uSteamClock.value+=B*j(.42,.105,z),h.uSteamRim.value=j(.3,1.5,z),h0.copy(l.keyDir).lerp(p.keyDir,c0).normalize(),h.uKeyDir.value.copy(f.keyDir||h0).normalize();const a0=(P,C0,M0,w0)=>{w0?P.set(w0):P.copy(C0).lerp(M0,c0)};a0(h.uKeyCol.value,l.keyColor,p.keyColor,f.keyColor),a0(h.uSkyCol.value,l.skyColor,p.skyColor,f.skyColor),a0(h.uGroundCol.value,l.groundColor,p.groundColor,f.groundColor),a0(h.uRimCol.value,l.rimColor,p.rimColor,f.rimColor)},dispose(){for(const o of V)o.dispose();F.dispose()}};return v0.update(0,0,null),v0}export{O0 as STAIN_GLSL,E0 as buildHero,A0 as chickGeometry,n0 as penguinGeometry};
