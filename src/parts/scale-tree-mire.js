import*as i from"three";import{mergeGeometries as Ft}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as re,lerp as ce,smoothstep as ye,makeRng as ke}from"../kit/core.js";const At=["#1A1208","#5F6B4C","#3E6A2F","#C9D6A0","#E0D4AE","#BCD2BA","#E8A23A"],A=(t=0,o=0,n=0)=>new i.Vector3(t,o,n),G=Math.PI*2;function ue(t,o=2.6,n=.62){const r=re(t/o,0,1.6);return n*Math.exp(-r*r*1.9)-.34*ye(.75,1.6,r)}function Ct(t,o={}){const n=o.height??35,r=!!o.juvenile,d=r?n:n*.8,S=[],y=[],M=o.girth??.75,v=M*.53,k=[-.9,-.2,.25,.7,1.3,2.2,3.6,6,9.5,14,19,24,d],u=t()*G,p=t()*G,z=[],b=[];for(const h of k){const w=re(h/d,0,1),x=.1*Math.sin(w*2.6+u)*w;z.push(A(x*Math.cos(p),h,x*Math.sin(p))),b.push(v+(M*.96-v)*Math.pow(1-w,1.25)+M*.5*Math.exp(-Math.max(h,-.2)/.75))}S.push({P:z,R:b,kind:0,level:0});const m=t()*G,P=(h,w)=>Math.max(ue(h)+w*.55,0-Math.max(0,h-5)*.16),K=(h,w,x,H,N,R,W)=>{const O=[],Z=[],U=W===2?2:3;for(let L=0;L<=U;L++){const T=L/U,V=ce(w,x,T),_=h+R*T*T,D=ce(H,N,T);O.push(A(Math.cos(_)*V,P(V,D)+(W===0&&L===0?.5:0),Math.sin(_)*V)),Z.push(D)}return S.push({P:O,R:Z,kind:1,level:W}),h+R},F=[];for(let h=0;h<4;h++){const w=m+h*G/4+t.range(-.22,.22);F.push(w);const x=2.3+t()*.5,H=K(w,M*.55,x,M*.5,M*.3,t.range(-.08,.08),0);for(const N of[-1,1]){const R=x+1.6+t()*.7,W=K(H,x-.1,R,M*.27,M*.18,N*t.range(.24,.4),1);for(const O of[-1,1])K(W,R-.1,R+1.5+t()*1.3,M*.16,.03,O*t.range(.14,.26),2)}}const s=z[z.length-1].clone(),a=A(0,1,0);if(r){for(let h=1.6,w=0;h<n;h+=.42,w++){const x=w*2.4,H=h/n,N=v+(M-v)*(1-H),R=A(Math.cos(x),.55+H*.9,Math.sin(x)).normalize();y.push({p:A(Math.cos(x)*N*.8,h,Math.sin(x)*N*.8),d:R,cone:!1})}return y.push({p:s.clone(),d:a.clone(),cone:!1}),{tubes:S,tips:y,height:n,fork:d,spokes:F,juvenile:r}}const l=[3.3,2.5,1.9,1.45,1.05],f=[.52,.5,.46,.42,.38],c=(h,w,x,H,N)=>{const R=l[N]*t.range(.85,1.15)*(n/35),W=A(h.x,0,h.z);W.lengthSq()<.01&&W.copy(x),W.normalize();const O=w.clone().applyAxisAngle(x,f[N]*t.range(.85,1.15)).normalize(),Z=W.multiplyScalar(.82).add(A(0,.57,0)),U=O.clone().lerp(Z,.16+.05*N).normalize(),L=U.clone().lerp(a,.2).normalize(),T=h.clone().addScaledVector(O,R*.5),V=T.clone().addScaledVector(U,R*.5),_=H*.8;if(S.push({P:[h.clone(),T,V],R:[H,(H+_)*.5,_],kind:2,level:N}),N===4){y.push({p:V,d:L}),y.push({p:h.clone().addScaledVector(O,.25),d:V.clone().sub(h).normalize(),cone:!1,cards:2,len:R/1.75,wid:.9,side:!0});return}N===3&&y.push({p:h.clone().addScaledVector(O,.3),d:V.clone().sub(h).normalize(),cone:!1,cards:2,len:R/1.75,wid:.8,side:!0});const D=U.clone().cross(x).normalize().applyAxisAngle(U,t.range(-.45,.45));c(V,L,D,_*.95,N+1),c(V,L,D.clone().negate(),_*.95,N+1)},C=A(Math.cos(m+.6),0,Math.sin(m+.6));return c(s,a,C,v*.9,0),c(s,a,C.clone().negate(),v*.9,0),{tubes:S,tips:y,height:n,fork:d,spokes:F,juvenile:r}}function Lt(t,o){const n=t.tubes[0];for(let r=1;r<n.P.length;r++)if(o<=n.P[r].y)return ce(n.R[r-1],n.R[r],re((o-n.P[r-1].y)/(n.P[r].y-n.P[r-1].y),0,1));return n.R[n.R.length-1]}function Re(t,o=0){const n=[],r=[],d=[],S=[],y=[],M=[],v=A(),k=A(),u=A(),p=A(),z=A();for(const m of t.tubes){if(o&&m.kind===1||o&&m.kind===2&&m.level>2)continue;const P=m.P.length>4,K=m.P.length,F=o?P?6:3:P?m.kind===3?14:t.fine?24:16:m.kind===1?(t.fine?[14,9,5]:[8,5,3])[m.level]:m.kind===3?10:[8,6,5,4,3][m.level],s=m.kind===3?Math.round(G*m.R[0]/.17):Math.max(6,3*Math.round(G*m.R[0]/((m.kind===0?t.cell||.2:.13)*3))),a=G*m.R[0]/s,l=o?P?[1,K/3|0,2*K/3|0,K-1]:[0,K-1]:m.kind===2&&m.level>=3?[0,2]:null;let f=l?l.map(x=>m.P[x]):m.P,c=l?l.map(x=>m.R[x]):m.R;if(t.fine&&!o&&m.kind===1){const x=new i.CatmullRomCurve3(m.P),H=m.P.length-1,N=H*3;f=[],c=[];for(let R=0;R<=N;R++){const W=R/N*H,O=Math.min(Math.floor(W),H-1);f.push(x.getPoint(R/N)),c.push(ce(m.R[O],m.R[O+1],W-O))}}let C=0;const h=n.length/3;p.set(1,0,0);for(let x=0;x<f.length;x++){const H=f[Math.max(0,x-1)],N=f[Math.min(f.length-1,x+1)];v.subVectors(N,H).normalize(),Math.abs(v.dot(p))>.95&&p.set(0,0,1),k.copy(p).addScaledVector(v,-p.dot(v)).normalize(),p.copy(k),u.crossVectors(v,k),x>0&&(C+=f[x].distanceTo(f[x-1])/(a*1.55));for(let R=0;R<=F;R++){const W=R/F*G,O=Math.cos(W),Z=Math.sin(W);let U=c[x];m.kind===0&&!o&&(U*=1+.085*Math.cos(4*(W-(t.spokes[0]||0)))*Math.exp(-Math.max(f[x].y,0)/1.1)),z.set(0,0,0).addScaledVector(k,O).addScaledVector(u,Z),n.push(f[x].x+z.x*U,f[x].y+z.y*U,f[x].z+z.z*U),r.push(z.x,z.y,z.z),d.push(R/F*s,C,s),S.push(v.x,v.y,v.z),y.push(m.kind,c[x])}}const w=F+1;for(let x=0;x<f.length-1;x++)for(let H=0;H<F;H++){const N=h+x*w+H,R=N+1,W=N+w,O=W+1;M.push(N,R,W,R,O,W)}}const b=new i.BufferGeometry;return b.setAttribute("position",new i.Float32BufferAttribute(n,3)),b.setAttribute("normal",new i.Float32BufferAttribute(r,3)),o||(b.setAttribute("aUV",new i.Float32BufferAttribute(d,3)),b.setAttribute("aAxis",new i.Float32BufferAttribute(S,3)),b.setAttribute("aInfo",new i.Float32BufferAttribute(y,2))),b.setIndex(M),b}function Ze(t,o,n=0){const r=[],d=[],S=[],y=[],M=[],v=A(),k=A(),u=A(),p=A();for(const b of t.tips){const m=b.d,P=(t.juvenile?.9:1.75)*o.range(.85,1.15)*(b.len??1),K=(t.juvenile?.3:.58)*o.range(.9,1.1)*(b.wid??1),F=o()*G;if(v.set(-m.z,0,m.x),v.lengthSq()<1e-4&&v.set(1,0,0),v.normalize(),k.crossVectors(m,v),n&&b.side)continue;const s=n||b.flat?1:b.cards??3,a=b.p.clone().addScaledVector(m,-.15);for(let w=0;w<s;w++){const x=b.flat?0:F+w/s*Math.PI,H=Math.cos(x),N=Math.sin(x),R=r.length/3;u.set(0,0,0).addScaledVector(v,H).addScaledVector(k,N),p.crossVectors(u,m).multiplyScalar(.35).add(m).addScaledVector(A(0,1,0),.6).normalize();for(const[W,O]of[[-1,0],[1,0],[1,1],[-1,1]]){const Z=K*(n?.75:1);r.push(a.x+u.x*W*Z+m.x*O*P,a.y+u.y*W*Z+m.y*O*P,a.z+u.z*W*Z+m.z*O*P),d.push(p.x,p.y,p.z),S.push(W,O,0),y.push(a.x,a.y,a.z,F)}M.push(R,R+1,R+2,R,R+2,R+3)}if(n||b.cone===!1)continue;const l=b.p.clone().addScaledVector(m,P*.82),f=r.length/3,c=.34*o.range(.85,1.2),C=.06,h=[[1,0],[0,1],[-1,0],[0,-1]];r.push(l.x,l.y+.02,l.z),d.push(0,1,0),S.push(0,0,1),y.push(a.x,a.y,a.z,F);for(const[w,x]of h)r.push(l.x+w*C,l.y-c*.38,l.z+x*C),d.push(w,.1,x),S.push(w,.4,1),y.push(a.x,a.y,a.z,F);r.push(l.x,l.y-c,l.z),d.push(0,-1,0),S.push(0,1,1),y.push(a.x,a.y,a.z,F);for(let w=0;w<4;w++){const x=(w+1)%4;M.push(f,f+1+x,f+1+w,f+5,f+1+w,f+1+x)}}const z=new i.BufferGeometry;return z.setAttribute("position",new i.Float32BufferAttribute(r,3)),z.setAttribute("normal",new i.Float32BufferAttribute(d,3)),n||(z.setAttribute("aCard",new i.Float32BufferAttribute(S,3)),z.setAttribute("aPivot",new i.Float32BufferAttribute(y,4))),z.setIndex(M),z}function Je(t,o,n=8,r=18){const d=n>8?1:0,S=[],y=[],M=[],v=t()*50,k=t()*50;S.push(0,ue(0)+.02,0),y.push(.3,t(),0);for(let p=1;p<=n;p++)for(let z=0;z<r;z++){const b=z/r*G+p*.17,m=p/n*4.1*(1+.16*o.n2(v+Math.cos(b)*1.3,k+Math.sin(b)*1.3)),P=Math.cos(b)*m,K=Math.sin(b)*m,F=o.n2(v+P*.9,k+K*.9)*.09+o.n2(v+P*2.7,k+K*2.7)*.035,s=ue(m)+(d?F*.6+o.n2(v+P*5.5,k+K*5.5)*.025:F)*ye(4.1,2,m);S.push(P,s,K),y.push(re(.5+o.n2(v+P*.6+9,k+K*.6)*.7,0,1),t(),1-ye(0,.16,s))}for(let p=0;p<r;p++)M.push(0,1+(p+1)%r,1+p);for(let p=1;p<n;p++)for(let z=0;z<r;z++){const b=1+(p-1)*r+z,m=1+(p-1)*r+(z+1)%r,P=b+r,K=m+r;M.push(b,m,P,m,K,P)}const u=new i.BufferGeometry;return u.setAttribute("position",new i.Float32BufferAttribute(S,3)),u.setAttribute("color",new i.Float32BufferAttribute(y,3)),u.setIndex(M),u.computeVertexNormals(),u}const de=`
float h31(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1,0)), f.x), mix(h21(i + vec2(0,1)), h21(i + vec2(1,1)), f.x), f.y); }
`,Ve=26,Qe=15.789,Tt=168,Pt=140,dt=-75.4,Ye=-227,Ne=`
uniform vec4 uShaftP[${Ve}]; uniform vec2 uSunG; uniform float uShaftMod; uniform vec4 uKeyBar;
float keyBar(vec3 P){ vec2 kd = (P.xz - uKeyBar.xy) / max(uKeyBar.z, .1); return uKeyBar.w * (1. - smoothstep(.35, 1., length(kd))); }
float shaftField(vec3 P){ vec2 g = P.xz - uSunG * max(P.y, 0.);
  int k = int(clamp(floor((150. + ${Qe/2} - g.y) / ${Qe}), 0., ${Ve-1}.)); vec4 sp = uShaftP[k];
  return (1. - smoothstep(sp.z * .55, sp.z, abs(g.x - sp.x))) * (1. - smoothstep(sp.w * .55, sp.w, abs(g.y - sp.y))); }
`,Xe=`#include <lights_fragment_end>
        { vec3 sfP = SHAFT_POS; float sfk = mix(1., mix(.3, 1.5, shaftField(sfP)), uShaftMod) + keyBar(sfP) SHAFT_HIGH; reflectedLight.directDiffuse *= sfk; reflectedLight.directSpecular *= sfk; }`;function Wt(t,o){const n=new i.MeshStandardMaterial({color:"#ffffff",roughness:.85,metalness:0});return n.onBeforeCompile=r=>{r.uniforms.uBark={value:new i.Color(o[1])},r.uniforms.uMoss={value:new i.Color(o[2])},r.uniforms.uWaterY=t.uWaterY,r.uniforms.uBounce=t.uBounce,r.uniforms.uBounceCol=t.uBounceCol,r.uniforms.uFill=t.uFill,r.uniforms.uShaftP=t.uShaftP,r.uniforms.uSunG=t.uSunG,r.uniforms.uShaftMod=t.uShaftMod,r.uniforms.uKeyBar=t.uKeyBar,r.uniforms.uLog=t.uLog||{value:0},r.uniforms.uWetSheen=t.uWetSheen,r.uniforms.uWetDir=t.uWetDir,r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
        attribute vec3 aUV; attribute vec3 aAxis; attribute vec2 aInfo;
        varying vec3 vBUV; varying vec3 vAxisV; varying vec2 vBInfo; varying vec3 vBW;`).replace("#include <project_vertex>",`#include <project_vertex>
        vec4 bw = vec4(transformed, 1.); vec3 bax = aAxis;
        #ifdef USE_INSTANCING
          bw = instanceMatrix * bw; bax = mat3(instanceMatrix) * bax;
        #endif
        vBW = (modelMatrix * bw).xyz; vAxisV = mat3(modelViewMatrix) * bax; vBUV = aUV; vBInfo = aInfo;`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
        uniform vec3 uBark, uMoss, uBounceCol, uFill, uWetSheen, uWetDir; uniform float uWaterY, uBounce, uLog;
        varying vec3 vBUV; varying vec3 vAxisV; varying vec2 vBInfo; varying vec3 vBW;
        ${de}${Ne}`).replace("#include <lights_fragment_end>",Xe.replace("SHAFT_POS","vBW").replace("SHAFT_HIGH","")).replace("#include <color_fragment>",`#include <color_fragment>
        float bFw = fwidth(vBUV.x) + fwidth(vBUV.y), bFade = (1. - smoothstep(.22, .62, bFw)) * (1. - smoothstep(40., 90., length(vViewPosition)));
        float bN = max(vBUV.z, 1.), bSig = step(2.5, vBInfo.x);
        float ba = vBUV.x + vBUV.y, bb = vBUV.x - vBUV.y;
        if (bSig > .5) { ba = vBUV.x; bb = vBUV.y * .9 + floor(vBUV.x) * .5; }
        vec2 bc = vec2(fract(ba), fract(bb)) - .5;
        float bh = h31(vec3(mod(floor(vec2(ba, bb)), bN), bN));
        float be = .5 - max(abs(bc.x), abs(bc.y));
        if (bSig > .5) be = min(.5 - abs(bc.x), .22);                         // ribs: only the flanks fall away
        float macro = vn3(vBW * vec3(.8, .22, .8)), fine = vn3(vBW * 9.), hy = vBW.y - uWaterY;
        float bRoot = step(.5, vBInfo.x) * (1. - step(1.5, vBInfo.x));                                  // roots are Stigmaria: smooth, small round pits
        // old bark: the leaf cushions are lost at the foot of a scale tree (its lowest two metres are furrowed, stained and mossy)
        // and weather away in patches higher up, so the snakeskin is broken and never one lattice from top to bottom
        float bPole = (1. - bSig) * (1. - uLog) * (1. - bRoot);
        float bFoot = (1. - smoothstep(2.6, 4.2, hy + (macro - .5) * 1.2)) * bPole;
        float bPatch = smoothstep(.55, .7, vn3(vBW * vec3(.45, .2, .45) + 13.)) * bPole;
        float bOld = max(bFoot, bPatch * .9);
        float bSoft = max(max(bRoot, uLog * .93), bOld);                                                 // a fallen log is sodden
        float fur = vn2(vec2(vBUV.x * 1.9 + macro * 2., mix(vBW.y * .3, vBUV.y * .07, bRoot)));
        float cush = smoothstep(.0, .3, be);
        float rimP = smoothstep(.03, .06, be) * (1. - smoothstep(.08, .15, be));
        vec2 dl = mix(vec2(bc.x + bc.y, bc.x - bc.y), bc * 2., bSig);
        float dotS = (1. - smoothstep(mix(.1, .05, bRoot), mix(.2, .13, bRoot), length(dl - vec2(0., .1)))) * (1. - .3 * bRoot) * (1. - .8 * uLog) * (1. - .85 * bOld) * mix(1., .55 * step(.6, bh), bRoot);
        vec2 bg = abs(bc.x) > abs(bc.y) || bSig > .5 ? vec2(-sign(bc.x), 0.) : vec2(0., -sign(bc.y));
        float slope = smoothstep(0., .04, be) * (1. - smoothstep(.12, .32, be)) * (1. - .92 * bSoft);
        vec2 gxy = mix(vec2(bg.x + bg.y, bg.x - bg.y), vec2(bg.x * 1.4, 0.), bSig) * slope * (1. - uLog) * (1. - bRoot);
        vec3 colr = mix(vec3(dot(uBark, vec3(.3, .55, .15))), uBark, .62) * (.74 + .5 * macro);
        colr = mix(colr, vec3(.078, .07, .052) * (.7 + .6 * macro), uLog * .92) * (1. - .08 * bRoot);
        colr = mix(colr, vec3(.115, .1, .068) * (.75 + .5 * macro), bRoot * .5);                    // Stigmaria: brown-olive limbs, never the green of the fronds
        { float furK = smoothstep(.36, .62, fur); colr *= 1. - bFoot * (.12 + .34 * furK) - bPatch * (1. - bFoot) * (.28 * furK - .1) - bRoot * (.1 + .3 * furK); }
        colr *= 1. - bFoot * min(uWetSheen.g * 1.4, .5);                              // in rain the wet foot goes darker still                // furrows in the old bark
        float bPlain = max(uLog * .8, bRoot);                                           // a sodden log and a Stigmaria root carry no lattice at all
        vec3 det = colr * (mix(.42, .86, bSoft) + mix(.78, .16, bSoft) * (1. - bPlain) * cush + .1 * bPlain);
        det = mix(det, colr * 1.45 + .012, rimP * .13 * (1. - bSoft));
        det *= (1. - .58 * dotS) * mix(.7 + .56 * bh, 1., max(max(uLog * .75, bOld * .7), bRoot * .85));
        // relief that holds in any light: every cushion carries a lit flank toward the sun and a shadowed one away from it, and
        // the lattice between cushions is a dark wet groove (it was a pale rim, which read as a wire grid)
        { vec3 bNn = normalize(vNormal), bTa0 = vAxisV - bNn * dot(vAxisV, bNn); bTa0 = bTa0 / max(length(bTa0), 1e-4); vec3 bTc0 = cross(bTa0, bNn);
          vec2 bLt = vec2(.5, .8);
          #if NUM_DIR_LIGHTS > 0
            bLt = mix(bLt, vec2(dot(directionalLights[0].direction, bTc0), dot(directionalLights[0].direction, bTa0) + .35), .75);
          #endif
          bLt = bLt / max(length(bLt), .3);
          float bRel = clamp(-(gxy.x * bLt.x + gxy.y * bLt.y), -1., 1.);
          det *= 1. + (bRel > 0. ? .7 : .5) * bRel;
          det *= 1. - .5 * (1. - smoothstep(0., .07, be)) * (1. - bSoft); }
        // a three-cell lattice carries the snakeskin three times further than the diamonds themselves
        vec2 bc3 = vec2(fract(ba / 3.), fract(bb / 3.)) - .5;
        float groove3 = (1. - smoothstep(0., .1, .5 - max(abs(bc3.x), abs(bc3.y)))) * (1. - bSig) * (1. - bOld) * (1. - .8 * uLog);
        float coarse = (1. - smoothstep(.22, .62, bFw / 3.)) * (1. - bFade);
        // beyond the reach of the diamonds the bark is a mottle of patches three cushions across with a faint lattice, not a grid
        float b3h = h31(vec3(floor(ba / 3.), floor(bb / 3.), 7.)), b3m = mix(1., .8 + .36 * b3h, coarse * (1. - bSig) * (1. - bOld));
        vec3 bcol = mix(colr * .97 * b3m * (1. - .2 * groove3 * coarse), det, bFade);
        bcol *= mix(1., (.6 + .8 * vn2(vec2(vBUV.x * 2.9 + macro * 3., vBUV.y * .21))) * (.8 + .4 * vn2(vec2(vBUV.x * 7.3, vBUV.y * .6 + 5.))), bPlain);
        // a fallen log: sodden and dark whatever the light, split by long cracks, with paler weathered patches where the bark has gone
        { float crk = 1. - smoothstep(.0, .09, abs(vn2(vec2(vBUV.x * 4.3 + macro * 2., vBUV.y * .16 + 3.)) - .5));
          float bare = smoothstep(.58, .7, vn2(vec2(vBUV.x * .9 + 4., vBUV.y * .23)) + .2 * fine);
          bcol *= mix(1., (.62 - .34 * crk) * (1. + .75 * bare), uLog); }          // long wet fibres down a log, furrows down a root
        float lichen = smoothstep(.56, .8, vn3(vBW * vec3(.9, .33, .9) + 3.) + .12 * bPatch * (1. - bFoot));
        float streak = vn2(vec2(vBUV.x * .4, vBW.y * .07));
        bcol = mix(bcol, bcol * 1.55 + vec3(.025, .027, .02), lichen * .55) * (.6 + .75 * streak) * (.84 + .32 * vn2(vec2(vBW.y * .9, vBUV.x * .06)));
        float mossN = vn3(vBW * vec3(1.4, .45, 1.4) + 7.);
        float moss = smoothstep(.6, .84, mossN + .42 * exp(-max(hy, 0.) / 2.5) - .3 * smoothstep(8., 22., hy) - .04 * bRoot + .1 * bOld);
        moss *= mix(1., 1. - .55 * cush * (1. - bRoot) * (1. - bOld), bFade);
        vec3 bUp = normalize((viewMatrix * vec4(0., 1., 0., 0.)).xyz); float bTop = dot(normalize(vNormal), bUp);
        moss = mix(moss, smoothstep(.5, .78, mossN * .7 + vn3(vBW * 3.1) * .5) * smoothstep(.15, .8, bTop), uLog);
        vec3 bMossC = mix(uMoss, vec3(dot(uMoss, vec3(.3, .55, .15))) * vec3(1.08, 1., .7), .42);
        bcol = mix(bcol, bMossC * (.45 + .6 * fine) * (1. - .25 * bRoot) * (1. - .4 * bFoot), moss * mix(.8, .5, bRoot));
        bcol *= mix(1., mix(.5, 1.25, smoothstep(-.3, .75, bTop)), max(bRoot, uLog * .6));     // a root is a rounded limb: lit top, wet dark underside
        float stain = 1. - smoothstep(.7, 1.2, hy + .3 * mossN);
        bcol *= 1. - .42 * stain * (1. - .45 * uLog);
        float bWet = max(stain * .8, .45 * step(.5, vBInfo.x) * (1. - step(1.5, vBInfo.x)));
        diffuseColor.rgb = bcol;`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        roughnessFactor = mix(.86, mix(.42, .66, bFoot), bWet) + .1 * fine * (1. - bWet);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        { vec3 bTa = vAxisV - normal * dot(vAxisV, normal); bTa = bTa / max(length(bTa), 1e-4);
          vec3 bTc = cross(bTa, normal);
          normal = normalize(normal - (bTc * gxy.x + bTa * gxy.y) * (.95 * bFade) + (vec3(fine) - .5) * .12 * bFade); }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        // light thrown up from the silted water: strongest on faces that look down, fading up the pole
        { vec3 upV = normalize((viewMatrix * vec4(0., 1., 0., 0.)).xyz);
          float under = .35 + .65 * clamp(.5 - .5 * dot(normal, upV), 0., 1.);
          float bTopK = max(dot(normal, upV), 0.), bRim = 1. - abs(dot(normal, normalize(vViewPosition))); bRim = bRim * bRim * (.4 + .6 * bRim * bRim);
          vec3 keyTop = vec3(0.);
          #if NUM_DIR_LIGHTS > 0
            keyTop = directionalLights[0].color * (keyBar(vBW) * .32 * (.2 + .8 * bTopK));        // the staged pool of sun lies on whatever is under it
          #endif
          // rain: wet bark carries a cool sheen down the side that faces the break in the cloud
          vec3 wetS = uWetSheen * bRim * (.35 + .65 * clamp(dot(normal, normalize((viewMatrix * vec4(uWetDir, 0.)).xyz)) * .7 + .5, 0., 1.)) * (1. - .6 * moss);
          totalEmissiveRadiance += diffuseColor.rgb * (uBounceCol * (uBounce * under * exp(-max(hy, 0.) / 14.) * (1. - .9 * uLog) * (1. - .75 * bFoot)) + uFill * (.5 + .3 * bFoot) * (1. - .4 * uLog) + keyTop) + wetS * (1. - .85 * bFoot); }`)},n.customProgramCacheKey=()=>"stm-bark",n}function _t(t,o){const n=new i.MeshLambertMaterial({color:"#ffffff",side:i.DoubleSide});return n.onBeforeCompile=r=>{r.uniforms.uTime=t.uTime,r.uniforms.uLeaf={value:new i.Color(o[2])},r.uniforms.uLeafHi={value:new i.Color(o[3])},r.uniforms.uBounce=t.uBounce,r.uniforms.uBounceCol=t.uBounceCol,r.uniforms.uShaftP=t.uShaftP,r.uniforms.uSunG=t.uSunG,r.uniforms.uShaftMod=t.uShaftMod,r.uniforms.uKeyBar=t.uKeyBar,r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
        attribute vec3 aCard; attribute vec4 aPivot; uniform float uTime; varying vec3 vCard; varying float vFPh; varying vec3 vFW;`).replace("#include <project_vertex>",`#include <project_vertex>
        { vec4 fw = vec4(transformed, 1.);
          #ifdef USE_INSTANCING
            fw = instanceMatrix * fw;
          #endif
          vFW = (modelMatrix * fw).xyz; }`).replace("#include <begin_vertex>",`#include <begin_vertex>
        { float al = clamp(length(transformed - aPivot.xyz) / 1.3, 0., 1.);
          float sw = sin(uTime * 1.1 + aPivot.w + aPivot.x * .4) * .07 + sin(uTime * 2.3 + aPivot.w * 2.) * .03;
          transformed.x += sw * al; transformed.z += cos(uTime * .9 + aPivot.w) * .05 * al; transformed.y -= abs(sw) * al * .5;
          vCard = aCard; vFPh = aPivot.w; }`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
        uniform vec3 uLeaf, uLeafHi, uBounceCol; uniform float uBounce; varying vec3 vCard; varying float vFPh; varying vec3 vFW;
        ${de}${Ne}`).replace("#include <lights_fragment_end>",Xe.replace("SHAFT_POS","vFW").replace("SHAFT_HIGH","; sfk = mix(sfk, 1.15, smoothstep(12., 24., vFW.y))")).replace("#include <color_fragment>",`#include <color_fragment>
        float fRowW = fwidth(vCard.y * 44. - abs(vCard.x) * 10.), fFrW = fwidth(vCard.y * 15. - abs(vCard.x) * 2.6);
        if (vCard.z < .5) {
          float au = abs(vCard.x), v = vCard.y;
          float row = v * 44. - au * 10. + vFPh;
          float nh = h21(vec2(floor(row), floor(vFPh * 40.)));
          float tipR = max(v - .72, 0.) / .28;
          float env = min(1., v * 7. + .25) * (1. - tipR * tipR) * (.72 + .28 * nh);
          float wid = mix(.3, .5, smoothstep(.1, .4, fRowW));
          float needle = step(abs(fract(row) - .5), wid * (1. - .45 * au));
          float stem = step(au, .07);
          if (max(needle * step(au, env), stem * step(v, .9)) < .5) discard;
          vec3 lc = mix(uLeaf * .5, mix(uLeaf * 1.15, uLeafHi, .22), smoothstep(.0, .95, au)) * (.8 + .4 * nh);
          diffuseColor.rgb = mix(lc, vec3(.09, .075, .04), stem * .8);
        } else if (vCard.z > 1.5) {
          // a tree-fern frond: lance-shaped, cut into pinnae swept toward the tip, every pinna scalloped into pinnules; solid when too far to resolve
          float au = abs(vCard.x), v = vCard.y, sv = sin(clamp(v, 0., 1.) * 3.1416);
          float outline = (.16 + .84 * sqrt(max(sv, 0.))) * (1. - .45 * v * v), rel = au / max(outline, .05);
          float pr = v * 15. - au * 2.6 + vFPh, pf = abs(fract(pr) - .5) * 2.;
          float lace = (.82 - .5 * rel) * (.6 + .4 * abs(sin(au * 27.)));
          float rachis = step(au, .045);
          if ((rel > 1. || pf > mix(lace, 1.1, smoothstep(.3, .9, fFrW))) && rachis < .5) discard;
          vec3 ol = uLeaf * vec3(1.02, .9, .6);
          diffuseColor.rgb = mix(ol * .5, ol * 1.2 + uLeafHi * .08, rel) * (.78 + .44 * h21(vec2(floor(pr), floor(vFPh * 40.))));
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.1, .08, .04), rachis * .7);
        } else {
          float sc = fract(vCard.y * 6. + abs(vCard.x) * .5);
          diffuseColor.rgb = mix(vec3(.16, .13, .06), vec3(.36, .33, .16), smoothstep(.15, .6, sc));
        }`).replace("#include <normal_fragment_begin>",`#include <normal_fragment_begin>
        normal = normalize(vNormal);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        { vec3 fV = normalize(vViewPosition); float back = 0.; vec3 lcol = vec3(0.);
          #if NUM_DIR_LIGHTS > 0
            back = max(dot(-fV, directionalLights[0].direction), 0.); lcol = directionalLights[0].color;
          #endif
          totalEmissiveRadiance += diffuseColor.rgb * lcol * (back * back * .3) * (vCard.z > 1.5 ? .7 : max(1. - vCard.z, 0.))
            + diffuseColor.rgb * uBounceCol * uBounce * .8; }`)},n.customProgramCacheKey=()=>"stm-leaf",n}const vt=5.6713,Rt=5.7588,et=`
uniform float uTime, uFront; uniform sampler2D uObst; uniform vec4 uObstBox;
const vec2 FLOW = vec2(.9848, -.1736);             // the way the sheet travels (local x, z)
float obstDist(vec2 p){ vec2 uv = (p - uObstBox.xy) * uObstBox.zw; return textureLod(uObst, uv, 0.).r * 12.; }
// metres behind the front, measured square to it (> 0 flooded)
float floodBehind(vec2 p, float od){
  float F = -p.y + p.x * ${vt.toFixed(4)};
  float lobes = (vn2(p * .085 + vec2(uTime * .02, 0.)) - .5) * 30. + (vn2(p * .36 - vec2(0., uTime * .07)) - .5) * 9. + (vn2(p * 1.15 + vec2(3., uTime * .11)) - .5) * 4.2;
  float held = (1. - smoothstep(0., 5., od)) * 12.;
  return (uFront - F + lobes - held) / ${Rt.toFixed(4)};
}`;function pt(t,o,n,r,d,S,y,M,v){const k=Math.max(0,Math.floor((y-v-12-S.x0)/r)),u=Math.min(o-1,Math.ceil((y+v+12-S.x0)/r)),p=Math.max(0,Math.floor((M-v-12-S.z0)/d)),z=Math.min(n-1,Math.ceil((M+v+12-S.z0)/d));for(let b=p;b<=z;b++)for(let m=k;m<=u;m++){const P=S.x0+(m+.5)*r-y,K=S.z0+(b+.5)*d-M,F=Math.round(re((Math.hypot(P,K)-v)/12,0,1)*255),s=b*o+m;F<t[s]&&(t[s]=F)}}function xt(t,o,n){const r=new i.DataTexture(t,o,n,i.RedFormat,i.UnsignedByteType);return r.minFilter=r.magFilter=i.LinearFilter,r.wrapS=r.wrapT=i.ClampToEdgeWrapping,r.needsUpdate=!0,r}function eo(t,o){const d=new Uint8Array(131072).fill(255),S=(o.x1-o.x0)/256,y=(o.z1-o.z0)/512;for(const[M,v,k]of t)pt(d,256,512,S,y,o,M,v,k);return xt(d,256,512)}async function Vt(t,o,n){const S=new Uint8Array(131072).fill(255),y=(o.x1-o.x0)/256,M=(o.z1-o.z0)/512;for(let v=0;v<t.length;v++){const[k,u,p]=t[v];pt(S,256,512,y,M,o,k,u,p),v%8===7&&n&&await n()}return xt(S,256,512)}const Nt=`
#include <common>
#include <fog_pars_vertex>
varying vec3 vL;
void main(){
  vL = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Dt=`
#include <common>
#include <fog_pars_fragment>
${de}
${et}
${Ne}
uniform vec3 uCamL, uSunDir, uSunCol, uSkyFill, uPeat, uCream, uJade, uSkyZen, uSkyHor, uWall, uGapDir, uGapCol;
uniform float uRain;
uniform vec4 uTrunk[60];
varying vec3 vL;
vec3 skyRefl(vec3 R, vec2 p){
  vec3 s = mix(uSkyHor, uSkyZen, smoothstep(0., .55, R.y));
  { float gd = max(dot(R, uGapDir), 0.), gd2 = gd * gd, gd8 = gd2 * gd2 * gd2 * gd2; s += uGapCol * (gd8 * gd8 * gd8 * .26 + gd8 * .08); }   // the break in the cloud (rain)
  float trav = 30. / max(R.y, .04); vec2 h = p + R.xz * trav;            // where the reflected ray meets the canopy
  float wall = smoothstep(150., 300., trav) * max(smoothstep(.04, .3, abs(R.x)), 1. - smoothstep(-330., -290., h.y));
  float slot = smoothstep(10., 24., abs(h.x) + (vn2(h * .12) - .5) * 16.);
  float can = slot * smoothstep(.3, .56, vn2(h * .075)) * (1. - smoothstep(200., 320., trav));
  float farK = smoothstep(60., 220., trav);
  can = mix(can, .55 * slot * (1. - smoothstep(200., 320., trav)), farK);
  return mix(s, uWall * (.8 + .5 * vn2(h * .31) * (1. - farK)), max(wall * .9, can * .82)) * .86;
}
// one trunk: x = bright crests of the V (a short train of ripples that wanders, breaks into dashes and dies within a dozen
// metres: never a ruled bar), y = calm lee inside the V, z = the dark trough inside each arm
vec3 wake(vec2 p, vec4 tr, float dist){
  vec2 rel = p - tr.xy; float al = dot(rel, FLOW), cr = dot(rel, vec2(-FLOW.y, FLOW.x)), r = max(tr.z, .05);
  float d = length(rel) - r, a0 = max(al, 0.), sd = cr < 0. ? -1. : 1.;
  float arm = r * .85 + a0 * .5 + min(2.2, r * 1.1) * (1. - exp(-a0 / 4.));             // a short steep V close behind the trunk, then the long slant
  arm += (vn2(vec2(al * .33 - uTime * .12, sd * 3.7 + tr.x * .9)) - .5) * (.3 + a0 * .11) + (vn2(vec2(al * 1.3 - uTime * .5, sd * 9.1 + tr.y)) - .5) * .22;
  float wdt = .13 + a0 * .028, wl = wdt + min(.0006 * dist * dist, .3), dd = abs(cr) - arm, x = dd / wl;
  float env = smoothstep(-r * .2, r * .6, al) * exp(-a0 / 9.5);
  float brk = .25 + .75 * smoothstep(.34, .62, vn2(vec2(al * .55 - uTime * .7, sd * 5.3 + tr.x)));     // the crest stands in pieces
  float chev = .5 + .5 * sin(al * 3.2 - uTime * 3. + abs(cr) * 2.) * vn2(vec2(al * .8 - uTime, cr * 2.));
  float x1 = x - 2.6, x2 = x - 5.;
  float line = (exp(-x * x * 1.4) + .42 * exp(-x1 * x1 * 1.6) + .2 * exp(-x2 * x2 * 1.8)) * env * brk;
  float xt = x + 1.7; float trough = exp(-xt * xt * .9) * env * (.4 + .6 * brk);          // dark water inside each arm
  float bow = (1. - smoothstep(0., .5, d)) * (1. - smoothstep(-.6, .3, al / max(r, .2)));
  float lee = (1. - smoothstep(arm - wl - wdt * 3., arm - wl, abs(cr))) * step(0., al) * exp(-a0 / 10.) * smoothstep(0., .6, d);
  lee *= .4 + .6 * smoothstep(-.2, .2, sin(cr * 9. / (1. + a0 * .05) + 2. * sin(al * .7 - uTime * .9)));      // streaks drawn out down the lee
  return vec3(line * (.6 + .4 * chev) + bow * .8, lee, trough) * step(.06, tr.z);
}
void main(){
  vec2 p = vL.xz; vec3 toC = uCamL - vL; float dist = length(toC); vec3 V = -toC / max(dist, 1e-3);
  float t = uTime, od = obstDist(p), dm = floodBehind(p, od), fl = smoothstep(0., .22, dm);
  // --- ripples, rings from falling cones and marsh gas
  float nearK = 1. - smoothstep(30., 160., dist);
  vec2 rp = p * .55 + vec2(t * .05, t * .035);
  float n0 = vn2(rp), nx = vn2(rp + vec2(.3, 0.)), nz = vn2(rp + vec2(0., .3));
  vec2 rp2 = p * 2.3 - vec2(t * .11, -t * .07);
  float m0 = vn2(rp2), mx = vn2(rp2 + vec2(.3, 0.)), mz = vn2(rp2 + vec2(0., .3));
  vec2 g = vec2(n0 - nx, n0 - nz) * .5 + vec2(m0 - mx, m0 - mz) * .22 * nearK;
  vec2 cell = floor(p / 7.); float ch = h21(cell), ch2 = h21(cell + 17.3);
  vec2 cp = (cell + .5 + (vec2(ch, ch2) - .5) * .4) * 7.; float rd = length(p - cp), ph = fract(t * .11 + ch * 7.);
  float ring = sin((rd - ph * 3.) * 8.) * exp(-abs(rd - ph * 3.) * 2.2) * (1. - ph) * step(ch2, .7) * (1. - fl);
  g += (p - cp) / max(rd, 1e-3) * ring * .5 * nearK * (1. - .75 * uRain);
  float rainK = 1. - smoothstep(10., 30., dist);                // rain rings: soft, of mixed sizes, near us; a fine stipple beyond
  for (int k = 0; k < 2; k++) {                                   // rain (opts.rain): two turned layers of small quick rings, each cell
    float sc = k == 0 ? .9 : 2.9;                               // with its own place, size and beat, four in ten left empty
    vec2 pr = k == 0 ? p : vec2(p.x * .8 + p.y * .6, p.y * .8 - p.x * .6) + 31.7;
    vec2 c2 = floor(pr / sc); float r1 = h21(c2 + 5.1), r2 = h21(c2 + 11.7), r3 = h21(c2 + 23.9);
    vec2 q2 = (c2 + .5 + (vec2(r1, r2) - .5) * .5) * sc; float d2 = length(pr - q2), ph2 = fract(t * (.5 + .7 * r3) + r1 * 9.), rad = ph2 * sc * (.07 + .3 * r2 * r2);
    float ring2 = sin((d2 - rad) * (13. + 16. * r3)) * exp(-abs(d2 - rad) * 6.) * (1. - ph2) * step(r3, .5) * (.5 + .9 * r1);
    vec2 dr = (pr - q2) / max(d2, 1e-3); if (k == 1) dr = vec2(dr.x * .8 - dr.y * .6, dr.y * .8 + dr.x * .6);
    g += dr * ring2 * 2.3 * uRain * rainK; }
  g += (vec2(vn2(p * 5.3 + t * 2.1), vn2(p * 5.3 - t * 1.7 + 9.)) - .5) * .3 * uRain * smoothstep(8., 30., dist) * nearK;
  g *= 1. + 3. * (1. - smoothstep(0., 1.6, abs(dm)));               // the water shivers at the lip
  vec3 N = normalize(vec3(g.x * (.16 + 1.2 * fl), 1., g.y * (.16 + 1.2 * fl)));
  float c = clamp(dot(-V, N), 0., 1.), fr = .25 + .75 * pow(1. - c, 3.5);
  vec3 R = reflect(V, N); R.y = abs(R.y);
  vec3 sky = skyRefl(R, p);
  float sd = max(dot(R, uSunDir), 0.), sd2 = sd * sd, sd8 = sd2 * sd2 * sd2 * sd2, sd32 = sd8 * sd8 * sd8 * sd8, glint = sd32 * sd32 * (.25 + .75 * smoothstep(.45, .75, vn2(p * 2.6 + vec2(t * .7, -t * .4))));
  // --- light on the surface: bars of sun between the crowns, olive shade elsewhere
  float bars0 = smoothstep(.42, .66, vn2(vec2(p.x * .045 + 3., p.y * .16)) * .75 + vn2(p * .31) * .25);
  float bars = mix(bars0, max(shaftField(vec3(p.x, 0., p.y)) * (.8 + .4 * vn2(p * .9 + t * .1)), bars0 * .4 * smoothstep(9., 18., abs(p.x))), uShaftMod);
  vec3 lightD = uSunCol * .62 * bars + uSkyFill * .95;
  // --- black mirror with floating litter and cones
  vec2 lc = floor(p * 11.); vec2 lj = vec2(h21(lc + 3.), h21(lc + 9.)) - .5;
  // loose flecks lying every way, each its own size, two in three cells empty (they were a ruled grid of dots)
  float la = h21(lc + 13.) * 6.283; vec2 lq = fract(p * 11.) - .5 - lj * .7; lq = vec2(lq.x * cos(la) + lq.y * sin(la), lq.y * cos(la) - lq.x * sin(la));
  float lsh = 1. - smoothstep(.1, .24, length(lq * vec2(1., 1.9 + 1.6 * lj.x)) / (.55 + .7 * h21(lc + 29.)));
  float lit = lsh * max(smoothstep(.6, .78, vn2(p * .3 + 11.)) * step(.66, h21(lc + 5.)), step(.975, h21(lc + 41.))) * nearK;
  vec3 body = uPeat * (.9 + .7 * lightD);
  vec3 dark = mix(body, sky, fr) + uSunCol * glint * 3. * nearK;
  dark = mix(dark, mix(vec3(.11, .09, .04), vec3(.26, .28, .13), h21(lc + 7.)) * (lightD + .15), lit);
  // --- silt: three tones (cream, jade, the jade shadow) in feathered bands drawn out along the flow, at four scales, each
  // carried by the one before it. No iso-lines and no cells: every edge is a soft threshold of stretched noise.
  vec2 q = vec2(dot(p, FLOW), dot(p, vec2(-FLOW.y, FLOW.x))); q.x -= t * 1.6;
  float w1 = vn2(q * vec2(.06, .15) + 2.), w2 = vn2(q * vec2(.13, .31) - 5.);
  float nearF = 1. - smoothstep(10., 60., dist);
  vec2 wq = q + (vec2(w1, w2) - .5) * vec2(10., 3.2);
  // polish 2: swirls, not ruled streaks (the bands were six to ten times longer than wide and read as a smear): each scale is
  // about three times longer than wide and is turned by the one before it, like milk stirred into tea
  float b1 = vn2(wq * vec2(.05, .16));
  vec2 sw = wq + vec2(sin(b1 * 6.283 + wq.y * .21), cos(b1 * 6.283 + wq.x * .13)) * 2.4;
  float b2 = vn2(sw * vec2(.12, .36) + 7. + b1 * 1.6);
  float b3 = vn2(vec2(sw.x * .3 - t * .22, sw.y * .95) + 3. + b2 * 1.9);
  float b4 = vn2(vec2(sw.x * .8 - t * .5, sw.y * 2.6) + b3 * 1.6);
  float b5 = vn2(vec2(sw.x * 2.2 - t * .9, sw.y * 6.5) + b4 * 1.2);
  float tone = .5 + (b1 * .46 + b2 * .34 + b3 * .2 - .5) * 1.75 + (b4 - .5) * .1 * nearF;
  vec3 deep = uJade * vec3(.26, .43, .4), jade = uJade * vec3(.62, .86, .8);
  vec3 silt = mix(uCream * .96, jade, smoothstep(.36, .54, tone));
  silt = mix(silt, deep, smoothstep(.54, .68, tone + (b3 - .5) * .14) * .9);
  silt = mix(silt, deep * .7, smoothstep(.7, .9, tone) * .6);
  silt = mix(silt, uCream * 1.1, smoothstep(.56, .8, b3) * smoothstep(.35, .65, b2) * .7);          // cream ribbons riding the jade
  silt = mix(silt, deep * 1.15, smoothstep(.52, .78, b4) * (1. - smoothstep(.35, .65, b2)) * .6 * nearF);  // jade feathers in the cream
  silt *= 1. + ((b4 - .5) * .3 + (b5 - .5) * .16) * nearF + (b3 - .5) * .24;
  // the last dark threads of peat water: long lanes, feathered and broken along their length
  float lane = smoothstep(.5, .7, vn2(vec2(sw.x * .05, sw.y * .26) + 11.));
  float feath = smoothstep(.3, .7, vn2(vec2(sw.x * .22, sw.y * 1.3) + 4. + b2 * 1.4));
  float thr = lane * feath * (.6 + .4 * smoothstep(.3, .7, b4)) * (1. - .35 * smoothstep(4., 60., dm));
  silt = mix(silt, uPeat * 1.7 + deep * .2, thr * .9);
  vec3 wk = vec3(0.);
  float zc = p.y + .1763 * p.x;
  for (int s = 0; s < 2; s++) {
    float xr = s == 0 ? uTrunk[0].x : uTrunk[20].x, z0 = s == 0 ? uTrunk[0].y : uTrunk[20].y, z1 = s == 0 ? uTrunk[19].y : uTrunk[39].y;
    float fi = clamp((z0 - (zc - .1763 * xr)) / max(z0 - z1, 1.) * 19., 0., 19.);
    int i0 = int(floor(fi)), i1 = min(i0 + 1, 19);
    wk += wake(p, uTrunk[s * 20 + i0], dist); wk += wake(p, uTrunk[s * 20 + i1], dist);
  }
  for (int k = 40; k < 60; k++) wk += wake(p, uTrunk[k], dist);
  wk = min(wk, vec3(1.3, 1., 1.));
  float ringF = (1. - smoothstep(.0, .7, od)) * (.5 + .5 * sin(od * 14. - t * 4.));
  silt = mix(silt, deep * .62, wk.y * .7);                              // the darker lee streak inside each V
  silt = mix(silt, mix(silt, deep, .6) * .62, min(wk.z, 1.) * .8);
  silt = mix(silt, uCream * 1.55 + .03, min(wk.x * .85 + ringF * .3, 1.));
  float wkGlit = wk.x * step(.8, h21(floor(p * 9.))) * (1. - smoothstep(.15, .45, length(fract(p * 9.) - .5))) * (.5 + .5 * sin(t * 6. + h21(floor(p * 9.) + 3.) * 40.));     // the bright standing arms and the bow pillow
  // sun glitter: flecks drawn out along the flow where the cream ribbons run, twinkling
  float glit = smoothstep(.7, .9, vn2(vec2(wq.x * 2.1 - t * 1.4, wq.y * 15.) + b3 * 2.)) * smoothstep(.5, .75, b3) * (.45 + .55 * sin(t * 5. + b5 * 40.)) * nearF;
  vec3 wetS = mix(silt * (uSunCol * .6 * mix(.42, 1.0, bars) + uSkyFill * .9), sky * .9, clamp(fr * .62 - .1, 0., .5)) + uSunCol * (glint * 1.1 + max(glit, 0.) * (.35 + 1.5 * bars) + wkGlit * (.25 + .9 * bars));
  // --- the lip: a hard bright curl with glitter, a dark line under it
  float lipW = .16 + .5 * vn2(p * .9 + vec2(t * .3, 0.));
  float lip = smoothstep(0., .05, dm) * (1. - smoothstep(.06, lipW, dm)) * (.3 + .7 * smoothstep(.32, .62, vn2(p * 1.9 - FLOW * t * .5 + 7.)));
  lip += smoothstep(.5, .78, vn2(p * 3.1 - FLOW * t * .8)) * smoothstep(.56, .7, vn2(p * 9.7 + t * .4)) * (1. - smoothstep(.2, 2.6, dm)) * step(0., dm) * .5;      // lace of foam trailing behind the curl
  float sparkle = step(.86, h21(floor(p * 7.))) * (.5 + .5 * sin(t * 5. + h21(floor(p * 7.) + 5.) * 40.)) * (1. - smoothstep(.12, .4, length(fract(p * 7.) - .5)));
  float underLip = (1. - smoothstep(0., .5, -dm)) * step(dm, 0.);
  float tg1 = vn2(p * .42 + vec2(-t * .25, t * .08)), tg2 = vn2(p * 1.5 + vec2(-t * .5, 3.));
  float fing = vn2(vec2(dot(p, FLOW) * .22 - t * .35, dot(p, vec2(-FLOW.y, FLOW.x)) * 1.6));
  float thin = smoothstep(0., 1., (dm - .1) / (.7 + 2.6 * tg1 * fing + .7 * tg2));
  vec3 tea = mix(dark, wetS * vec3(.66, .54, .4), .3 + .35 * fing);
  vec3 col = mix(dark * (1. - .5 * underLip), mix(tea, wetS, thin), fl);
  col += uCream * uSunCol * lip * (.7 + 4.5 * sparkle * (.4 + .6 * bars));
  gl_FragColor = vec4(min(col, vec3(2.4)), 1.);
  #include <fog_fragment>
}`;function Ht(t){return new i.ShaderMaterial({uniforms:{...i.UniformsUtils.clone(i.UniformsLib.fog),...t},vertexShader:Nt,fragmentShader:Dt,fog:!0,transparent:!0,depthWrite:!1})}function Kt(t){return new i.ShaderMaterial({uniforms:{...i.UniformsUtils.clone(i.UniformsLib.fog),...t},fog:!0,transparent:!0,depthWrite:!1,side:i.DoubleSide,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec3 aCol; varying vec3 vL; varying vec3 vN; varying vec3 vC; varying float vAbove;
      uniform float uTime; uniform vec3 uCamL;
      void main(){
        vec4 lp = vec4(position, 1.); vec3 n = normal;
        #ifdef USE_INSTANCING
          lp = instanceMatrix * lp; n = mat3(instanceMatrix) * n;
        #endif
        float dep = clamp(-lp.y, 0., 40.), amp = .035 + .02 * min(dep, 12.);
        lp.x += sin(dep * 1.9 + uTime * 1.4 + lp.z * .6) * amp;
        lp.z += sin(dep * 1.3 - uTime * 1.1 + lp.x * .5) * amp * .7;
        vAbove = lp.y; lp.y = min(lp.y, -.002);
        vec4 mvPosition = modelViewMatrix * lp;
        // lay the double on the surface where its sight line crosses it: same picture, but nothing under the
        // water can hide it and anything above the water still can
        vec3 S = uCamL + (lp.xyz - uCamL) * (uCamL.y / max(uCamL.y - lp.y, 1e-3)); S.y = .004;
        vL = S; vN = n; vC = aCol;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(S, 1.);
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      ${de}
      ${et}
      uniform vec3 uCamL, uSunDir, uSunCol, uSkyFill, uPeat; varying vec3 vL; varying vec3 vN; varying vec3 vC; varying float vAbove;
      void main(){
        if (vAbove > 0.) discard;
        vec3 S = vL, toC = uCamL - S; float dist = length(toC);
        float c = clamp(toC.y / max(dist, 1e-3), 0., 1.), fr = .16 + .84 * pow(1. - c, 3.5);
        float od = obstDist(S.xz), dm = floodBehind(S.xz, od), fl = smoothstep(-.3, .22, dm);
        vec3 n = vN / max(length(vN), 1e-4);
        float sun = max(dot(n, vec3(uSunDir.x, -uSunDir.y, uSunDir.z)), 0.);
        vec3 col = mix(uPeat * (.6 + .5 * uSkyFill), vC * (uSkyFill * 1.1 + uSunCol * sun * .9), fr);
        gl_FragColor = vec4(col, (1. - .5 * fl) * .96 * (1. - .35 * smoothstep(40., 160., dist)) * smoothstep(.15, 1.7, -vAbove));
        #include <fog_fragment>
      }`})}function Ot(t,o,n,r){const d=[],S=[],y=[],M=[],k=A(r.x,r.y,r.z).multiplyScalar(34/Math.max(r.y,.2));for(let b=0;b<Ve;b++){const m=b%2?-1:1,P=150-b*Qe+t.range(-1,1),K=m*t.range(2.6,3.8),F=t.range(2.4,3.4),s=t.range(3.4,4.6),a=t()*100;if(b>22){o.uShaftP.value[b].set(0,P,.01,.01);continue}o.uShaftP.value[b].set(m*6.4,P,6.6,s);for(let l=0;l<2;l++){const f=l===0?A(F,0,0):A(0,0,s*.8),c=f.clone().cross(k).normalize(),C=d.length/3;for(const[h,w]of[[-1,0],[1,0],[1,1],[-1,1]])d.push(K+f.x*h+k.x*w,k.y*w-.3,P+f.z*h+k.z*w),S.push(c.x,c.y,c.z),y.push(h,w,a,l);M.push(C,C+1,C+2,C,C+2,C+3)}}const u=new i.BufferGeometry;u.setAttribute("position",new i.Float32BufferAttribute(d,3)),u.setAttribute("normal",new i.Float32BufferAttribute(S,3)),u.setAttribute("aShaft",new i.Float32BufferAttribute(y,4)),u.setIndex(M);const p=new i.ShaderMaterial({uniforms:{uTime:o.uTime,uCamL:o.uCamL,uCol:{value:new i.Color(n[3])},uShaftK:o.uShaftK},transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,side:i.DoubleSide,fog:!1,vertexShader:`
      attribute vec4 aShaft; varying vec4 vS; varying vec3 vL; varying vec3 vN;
      void main(){ vS = aShaft; vL = position; vN = normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,fragmentShader:`
      ${de}
      uniform float uTime, uShaftK; uniform vec3 uCamL, uCol; varying vec4 vS; varying vec3 vL; varying vec3 vN;
      void main(){
        vec3 toC = uCamL - vL; float dist = length(toC); vec3 V = toC / max(dist, 1e-3);
        float e = 1. - vS.x * vS.x; e = e * (.45 + .55 * e);
        float rays = .62 + .38 * vn2(vec2(vS.x * 5. + vS.z, uTime * .04)) + .25 * vn2(vec2(vS.x * 17. - vS.z, uTime * .07));
        float prof = smoothstep(0., .1, vS.y) * (1. - smoothstep(.72, 1., vS.y)) * (.55 + .45 * (1. - vS.y));
        float steam = vn3(vec3(vL.x * .22, vL.y * .16 - uTime * .12, vL.z * .22) + vS.z);
        float curl = vn3(vec3(vL.x * .7 + uTime * .05, vL.y * .5 - uTime * .22, vL.z * .7));
        float mist = 1. + .55 * exp(-max(vL.y, 0.) / 3.5);
        float breath = .8 + .2 * sin(uTime * .45 + vS.z);
        float face = smoothstep(.06, .5, abs(dot(V, vN))), nearF = smoothstep(6., 24., dist);
        float a = e * prof * rays * (.4 + .85 * steam * (.6 + .4 * curl)) * mist * breath * face * nearF * uShaftK;
        gl_FragColor = vec4(uCol * min(a, .95) * .66 * exp(-min(dist, 400.) / 85.), 1.);
      }`}),z=new i.Mesh(u,p);return z.frustumCulled=!1,z.renderOrder=4,z}function jt(t,o=16){const n=[],r=[],d=[],S=[];for(const y of[-.8,0,.8,2.5,6,10,13.5,o])d.push(A(0,y,0)),S.push(.42+.2*(1-y/o)+.3*Math.exp(-Math.max(y,0)/.6));n.push({P:d,R:S,kind:3,level:0});for(const y of[-1,1]){const M=A(0,o-.3,0),v=A(.1*y,o+1.3,.95*y),k=A(.2*y,o+2.9,1.5*y);n.push({P:[M,v,k],R:[.4,.34,.27],kind:3,level:0});for(let u=0;u<16;u++){const p=u/16*G+t()*.3,z=u%2?t.range(-1,-.3):t.range(-.1,.7);r.push({p:k.clone().add(A(0,-.1,0)),d:A(Math.cos(p),z,Math.sin(p)).normalize(),cone:!1,len:.85,wid:1})}}return{tubes:n,tips:r,height:o+3,fork:o,spokes:[0],juvenile:!1}}function bt(t,o,n,r){const d=Re(t,1),S=Ze(t,ke(o),1),y=(v,k)=>{const u=v.attributes.position.count,p=new Float32Array(u*3);for(let z=0;z<u;z++)p.set([k.r,k.g,k.b],z*3);v.setAttribute("aCol",new i.BufferAttribute(p,3))};y(d,n),y(S,r);const M=Ft([d,S]);return d.dispose(),S.dispose(),M}const Gt=[[0,-2e3],[.34,-820],[.4,-460],[.44,-52],[.52,42],[.585,142],[.62,172],[.83,330],[1,500]];function tt(t){const o=Gt;t=re(t,0,1);for(let n=1;n<o.length;n++)if(t<=o[n][0])return ce(o[n-1][1],o[n][1],(t-o[n-1][0])/(o[n][0]-o[n-1][0]));return o[o.length-1][1]}async function to(t,o={}){const n=t.rng,r=t.noise,d=(o.palette&&o.palette.length>=7?o.palette:At).slice(),S=re(o.detail??t.quality?.detail??1,.6,1),y=new i.Group;y.name="scale-tree-mire-hero";const M=A(...o.sunDir||[.352,.927,-.128]).normalize(),v=e=>new i.Color(e),k=(e,g)=>e?new i.Vector3(e[0],e[1],e[2]):g,u={uTime:{value:0},uWaterY:{value:0},uBounce:{value:0},uBounceCol:{value:v(d[4])},uCamL:{value:A(0,3,200)},uShaftK:{value:1},uFill:{value:k(o.skyFill,A(.3,.335,.28))},uShaftP:{value:Array.from({length:Ve},()=>new i.Vector4(0,0,1,1))},uSunG:{value:new i.Vector2(M.x,M.z).divideScalar(Math.max(M.y,.2))},uKeyBar:{value:new i.Vector4(0,0,1,0)},uWetSheen:{value:A(0,0,0)},uWetDir:{value:A(0,.3,-1).normalize()},uShaftMod:{value:o.shaftMod??1}},p=[];for(let e=0;e<60;e++)p.push(new i.Vector4(0,0,0,0));let z=null;const b={uTime:u.uTime,uFront:{value:tt(.5)},uObst:{value:null},uObstBox:{value:new i.Vector4},uCamL:u.uCamL,uSunDir:{value:M},uSunCol:{value:k(o.sunColor,A(1.02,.97,.86))},uSkyFill:u.uFill,uPeat:{value:v(d[0])},uCream:{value:v(d[4])},uJade:{value:v(d[5])},uSkyZen:{value:v(o.sky?.zenith||"#E6EAD2")},uSkyHor:{value:v(o.sky?.horizon||"#BFD3DC")},uWall:{value:v(o.sky?.wall||"#2C3320")},uTrunk:{value:p},uRain:{value:o.rain??0},uGapDir:{value:k(o.gap?.dir,A(0,.2,-1)).normalize()},uGapCol:{value:k(o.gap?.color,A(0,0,0))},uShaftP:u.uShaftP,uSunG:u.uSunG,uShaftMod:u.uShaftMod,uKeyBar:u.uKeyBar},m=Wt(u,d),P=_t(u,d),K=Kt(b),F=v(d[1]).multiplyScalar(.8),s=v(d[2]).multiplyScalar(.75),a=20,l=150,f=300/(a-1),c=[];for(let e=0;e<2;e++)for(let g=0;g<a;g++){const B=e===0?-1:1;c.push({x:B*(7+n.range(-1.1,2)),z:l-g*f+n.range(-2.6,2.6),rot:n()*G,lean:n.range(0,.011),leanDir:n()*G,s:n.range(.93,1.07),variant:n.int(0,2),row:e,i:g})}const C=(e,g,B)=>{const E=c[e*a+g];return E.x=B,E.z=l-g*f,E.lean=0,E.s=1,E};C(0,1,-7).z=Pt,C(1,5,8),C(1,6,8);const h=C(1,14,7.4);h.variant=0,h.z=dt,c[a+13].x=Math.max(c[a+13].x,8.3),c[a+15].x=Math.max(c[a+15].x,7.6),c[a+15].z=Math.min(c[a+15].z,dt-11.5),c[15].x=-6.4,c[a+17].x=6.4,c[19].x=-6.4;const w={x:-2.7,z:Tt,rot:n()*G,lean:.004,leanDir:n()*G,s:1.24,variant:n.int(0,2)};c.push(w);const x={foot:A(-12,.25,Ye),fork:A(8,16,Ye)},H=x.fork.clone().sub(x.foot).normalize(),N={variant:n.int(0,2),s:1,fallen:!0,rot:n()*G};c.push(N);const R=Math.round(n.int(3,6)*S),W=[];for(let e=0;e<R;e++){const g=n.sign(),B=n.int(1,a-2);W.push({x:g*n.range(11.5,15),z:l-(B+.5)*f+n.range(-3,3),rot:n()*G,lean:n.range(0,.03),leanDir:n()*G,s:n.range(.85,1.15)})}const O=[0,1,2,3,4].map(()=>Math.floor(n()*1e9)),Z=n.fork("extra"),U=[];for(const e of o.extraTrees||[]){const g={x:e.x,z:e.z,rot:e.rot??Z()*G,lean:e.lean??Z.range(0,.012),leanDir:Z()*G,s:e.s??Z.range(.9,1.08),variant:Z.int(0,2),extra:!0};e.juvenile?W.push(g):c.push(g)}for(const e of o.extraSigillaria||[])U.push({x:e.x,z:e.z,rot:e.rot??Z()*G,lean:0,leanDir:0,s:e.s??Z.range(.85,1.1)});const L=n.fork("shafts"),T=n.fork("creatures"),V=n.fork("skeletons");await t.yield();const _=new i.Matrix4,D=new i.Quaternion,j=new i.Quaternion,J=A(),q=A(),$=new i.Matrix4().makeScale(1,-1,1),Y=(e,g)=>e.fallen?(D.setFromUnitVectors(A(0,1,0),H),j.setFromAxisAngle(A(0,1,0),e.rot),D.multiply(j),g.compose(x.foot,D,J.set(1,1,1))):(D.setFromAxisAngle(q.set(Math.cos(e.leanDir),0,Math.sin(e.leanDir)),e.lean),j.setFromAxisAngle(A(0,1,0),e.rot),D.multiply(j),g.compose(q.set(e.x,0,e.z),D,J.set(e.s,e.s,e.s))),I=(e,g,B,E)=>{const Q=new i.InstancedMesh(e,g,Math.max(1,B.length));return B.forEach((te,ie)=>{Y(te,_),E&&_.premultiply($),Q.setMatrixAt(ie,_)}),Q.count=B.length,Q.instanceMatrix.needsUpdate=!0,Q.frustumCulled=!1,E&&(Q.renderOrder=-19),y.add(Q),Q},fe=[];for(let e=0;e<4;e++){const g=e===3,B=Ct(V,g?{juvenile:!0,height:13,girth:.36}:{height:33.5+e*1.4,girth:.72+.04*e});fe.push(B),await t.yield(),e===0&&(h.rot=B.spokes[0]-Et);const E=g?W:c.filter(ee=>ee.variant===e&&ee!==h),Q=Re(B,0);await t.yield();const te=Ze(B,ke(O[e]),0);await t.yield();const ie=bt(B,O[e],F,s);if(await t.yield(),I(Q,m,E),I(te,P,E),I(ie,K,E,!0),await t.yield(),e===0){B.fine=!0;const ee=Re(B,0);B.fine=!1,await t.yield(),I(ee,m,[h]),I(te,P,[h]),I(ie,K,[h],!0),await t.yield()}}const pe=jt(V,x.fork.y-.55),oe={x:x.fork.x,z:x.fork.z,rot:0,lean:0,leanDir:0,s:1},ae=[oe,...U];I(Re(pe,0),m,ae),I(Ze(pe,ke(O[4]),0),P,ae),I(bt(pe,O[4],F,s),K,ae,!0),await t.yield();const Se=new i.MeshStandardMaterial({color:"#ffffff",roughness:.95,vertexColors:!0});Se.onBeforeCompile=e=>{e.uniforms.uMoss={value:v(d[2])},e.uniforms.uBounce=u.uBounce,e.uniforms.uBounceCol=u.uBounceCol,e.uniforms.uFill=u.uFill,e.uniforms.uShaftP=u.uShaftP,e.uniforms.uSunG=u.uSunG,e.uniforms.uShaftMod=u.uShaftMod,e.uniforms.uKeyBar=u.uKeyBar,e.uniforms.uTime=u.uTime,e.uniforms.uFront=b.uFront,e.uniforms.uObst=b.uObst,e.uniforms.uObstBox=b.uObstBox,e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vMW;`).replace("#include <project_vertex>",`#include <project_vertex>
        vec4 mw = vec4(transformed, 1.);
        #ifdef USE_INSTANCING
          mw = instanceMatrix * mw;
        #endif
        vMW = (modelMatrix * mw).xyz;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
        uniform vec3 uMoss, uBounceCol, uFill; uniform float uBounce; varying vec3 vMW;
        ${de}${et}${Ne}`).replace("#include <lights_fragment_end>",Xe.replace("SHAFT_POS","vMW").replace("SHAFT_HIGH","")).replace("#include <color_fragment>",`
        float mD = length(vViewPosition), mNear = 1. - smoothstep(6., 18., mD);
        float mn = vn2(vMW.xz * 1.7), mf = vn2(vMW.xz * 9.), mg = vn2(vMW.xz * 31.);
        float dome = smoothstep(.22, .8, vn2(vMW.xz * 11. + mn * 2.5) * .6 + vn2(vMW.xz * 23. + 5.) * .25 + mg * .15);
        vec3 peat = mix(vec3(.085, .064, .036), vec3(.19, .15, .085), mf) * (.8 + .4 * mg);
        float mossK = smoothstep(.36, .72, vColor.r * .7 + mn * .5);
        float cover = mossK * mix(.8, .62 + .38 * smoothstep(-.05, .35, dome + (mossK - .55) * .9), mNear);
        vec3 mossC = mix(vec3(dot(uMoss, vec3(.3, .55, .15))), uMoss, .4) * vec3(1.12, 1., .62) * (.54 + .5 * mf) * mix(1., .84 + .26 * dome, mNear) * (.85 + .3 * mg * mNear);
        vec3 mc = mix(peat, mossC, cover);
        vec2 lp = vMW.xz * 12., lc = floor(lp); float lh1 = h21(lc + 3.1), lh2 = h21(lc + 8.7), la = lh2 * 6.283;
        vec2 lr = fract(lp) - .5 - (vec2(lh1, lh2) - .5) * .36; lr = vec2(lr.x * cos(la) + lr.y * sin(la), lr.y * cos(la) - lr.x * sin(la));
        float scaleK = (1. - smoothstep(.15, .21, length(lr * vec2(1., 1.8)))) * step(.74, lh1);
        float needle = (1. - smoothstep(.018, .045, abs(lr.y))) * step(abs(lr.x), .44) * step(lh1, .24);
        float lFine = 1. - smoothstep(.25, .7, fwidth(lp.x) + fwidth(lp.y));                        // litter goes out before it falls under a pixel
        mc = mix(mc, mix(vec3(.27, .23, .12), vec3(.19, .16, .075), lh2) * (.75 + .5 * mg), scaleK * mNear * .5 * lFine);
        mc = mix(mc, mc * 1.5 + vec3(.03, .027, .014), needle * mNear * .4 * lFine);                   // needles a shade paler than what they lie on: never black or white specks
        float mWet = max(1. - smoothstep(.01, .07 + .06 * mn, vMW.y), vColor.b * .35);
        mc *= 1. - .66 * mWet;
        float mFl = smoothstep(0., .4, floodBehind(vMW.xz, obstDist(vMW.xz)));
        vec3 mUp = normalize((viewMatrix * vec4(0., 1., 0., 0.)).xyz); float mNu = clamp(dot(normalize(vNormal), mUp), .2, 1.), mSl = sqrt(max(1. - mNu * mNu, 0.)) / mNu;
        float mFoam = (1. - smoothstep(.0, max(.045 * mSl, .004), abs(vMW.y - .012 - .008 * sin(uTime * 2.1 + mn * 9.)))) * mFl * smoothstep(.3, .6, vn2(vMW.xz * 5. + vec2(uTime * .8, 0.)));
        float mBump = dome * cover * .009 * mNear;                 // (litter carries no relief: its sharp edges were turning single pixels black or white)
        diffuseColor.rgb = mc;`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
 roughnessFactor = mix(.95, .38, mWet);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        { vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition), r1 = cross(sy, normal), r2 = cross(normal, sx); float dt = dot(sx, r1);
          vec3 gr = sign(dt) * (dFdx(mBump) * r1 + dFdy(mBump) * r2); normal = normalize(abs(dt) * normal - gr * 1.6 + normal * 1e-6); }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance += diffuseColor.rgb * (uBounceCol * uBounce * .6 + uFill * .5) + uBounceCol * mFoam * (.22 + .22 * uBounce);`)},Se.customProgramCacheKey=()=>"stm-mound";const xe=c.filter(e=>!e.fallen).concat([{x:x.foot.x-.8,z:x.foot.z,rot:1,lean:0,leanDir:0,s:1.05},{...oe,s:.8}],U.map(e=>({...e,s:.8*e.s})),W.map(e=>({...e,s:.5*Math.min(e.s,1.2),lean:0}))),be={x:h.x+ve[0],z:h.z+ve[1],rot:2.2,lean:0,leanDir:0,s:ve[2]};xe.push(be);const Be=[h,be],gt=xe.filter(e=>!Be.includes(e)&&Math.abs(e.x)<=16),at=xe.filter(e=>!Be.includes(e)&&Math.abs(e.x)>16);I(Je(n.fork("mound"),r),Se,gt),at.length&&I(Je(ke(4242),r,5,12),Se,at),await t.yield(),I(Je(ke(9173),r,16,48),Se,Be),await t.yield();const se=n.fork("ferns"),nt=e=>{const g=[],B=[],E=[],Q=[],te=[];for(const[le,he,Ie]of e)for(let qe=0;qe<he;qe++){const ct=qe/he*G+se()*.6,ut=se.range(.7,1.25),ft=se.range(1,1.7),Ee=1.5*Ie*se.range(.75,1.15),Ue=.27*Ee,kt=se()*G,Pe=Math.cos(ct),We=Math.sin(ct),Bt=g.length/3;let $e=0,mt=0;for(let ge=0;ge<=2;ge++){const _e=ge/2,ht=ut-ft*_e;if(ge>0){const X=ut-ft*(_e-.25);$e+=Math.cos(X)*Ee/2,mt+=Math.sin(X)*Ee/2}for(const X of[-1,1])g.push(le.x+Pe*$e-We*X*Ue,le.y+mt-.1*Ue*(1-_e),le.z+We*$e+Pe*X*Ue),B.push(-Pe*Math.sin(ht)*.6-We*X*.25,.8,-We*Math.sin(ht)*.6+Pe*X*.25),E.push(X,_e,2),Q.push(le.x,le.y,le.z,kt);if(ge<2){const X=Bt+ge*2;te.push(X,X+1,X+2,X+1,X+3,X+2)}}}const ee=new i.BufferGeometry;return ee.setAttribute("position",new i.Float32BufferAttribute(g,3)),ee.setAttribute("normal",new i.Float32BufferAttribute(B,3)),ee.setAttribute("aCard",new i.Float32BufferAttribute(E,3)),ee.setAttribute("aPivot",new i.Float32BufferAttribute(Q,4)),ee.setIndex(te),ee},rt=[];for(let e=0;e<5;e++){const g=se()*G,B=se.range(1.1,2.7);rt.push([A(Math.cos(g)*B,ue(B)+.02,Math.sin(g)*B),se.int(5,7),se.range(.55,1)])}const yt=xe.filter(e=>!Be.includes(e));I(nt(rt),P,yt),await t.yield();const wt=(e,g)=>Math.max(ue(Math.hypot(e-h.x,g-h.z)),be.s*ue(Math.hypot(e-be.x,g-be.z)/be.s),0);I(nt([[-3.9,-1.25,.5],[-2.5,-1.45,.62],[-4.4,-1,.42]].map(([e,g,B])=>[A(h.x+e,wt(h.x+e,h.z+g)+.02,h.z+g),6,B])),P,[{x:0,z:0,rot:0,lean:0,leanDir:0,s:1}]),await t.yield();const St=xe.map(e=>[e.x,e.z,2.5*e.s]).concat(o.obstacles||[]),me={x0:-80,x1:80,z0:-280,z1:232};b.uObst.value=await Vt(St,me,t.yield?()=>t.yield():null),await t.yield?.(),b.uObstBox.value.set(me.x0,me.z0,1/(me.x1-me.x0),1/(me.z1-me.z0));const st=[0,1].map(e=>c.filter(g=>g.row===e).sort((g,B)=>g.i-B.i));st.forEach((e,g)=>e.forEach((B,E)=>p[g*20+E].set(B.x,B.z,2.5*B.s,0))),p[40].set(w.x,w.z,2.5*w.s,0),p[41].set(x.foot.x-.8,x.foot.z,2.6,0),p[42].set(oe.x,oe.z,2,0),c.filter(e=>e.extra).sort((e,g)=>Math.abs(e.x)-Math.abs(g.x)).slice(0,9).forEach((e,g)=>p[44+g].set(e.x,e.z,2.5*e.s,0)),z=e=>e.slice(0,7).forEach((g,B)=>p[53+B].set(g[0],g[1],g[2],0)),await t.yield();const He=new i.BufferGeometry,Fe=450,ne=30,it=[],lt=[];for(let e=0;e<=ne;e++)for(let g=0;g<=ne;g++)it.push(-Fe+2*Fe*g/ne,0,-Fe-40+2*Fe*e/ne);for(let e=0;e<ne;e++)for(let g=0;g<ne;g++){const B=e*(ne+1)+g;lt.push(B,B+ne+1,B+1,B+1,B+ne+1,B+ne+2)}He.setAttribute("position",new i.Float32BufferAttribute(it,3)),He.setIndex(lt);const Ae=new i.Mesh(He,Ht(b));Ae.renderOrder=-20,Ae.frustumCulled=!1,y.add(Ae);let Ke=null;o.shafts!==!1&&(Ke=Ot(L,u,d,M),y.add(Ke)),await t.yield();const Ce=[];let Le=null;if(o.creatures!==!1){const e=await $t(fe[h.variant],h,()=>t.yield());await t.yield();const g=It(T,{edge:"#C9A24A"});await t.yield(),g.scale(1.1,1.1,1.1),g.userData.length*=1.1;const B=T.chance(.3)?2:1;Le=e;for(let E=0;E<B;E++){const Q=qt(g,e,u),te=E*2.9;y.add(Q.mesh),await t.yield();let ie=!1,ee=.5;const le=he=>re(e.pose+(he-ot)*46,2.8,e.length-3.2);Ce.push({mesh:Q.mesh,setProgress(he){ee=he},drive(){ie=!0},update(he,Ie){Q.setHead((ie?le(ee):e.pose-2+Ie*.45%7)+(E===0?te*(B-1):0))}})}await t.yield()}const Oe=[3,6,9,13].map((e,g)=>{const B=st[g%2][e],E=B.x<0?1:-1,Q=3+g%3*.6,te=Lt(fe[B.variant],Q/B.s)*B.s;return{position:[B.x+E*te,Q,B.z],normal:[E,0,0],tree:[B.x,B.z]}});let Me=null;if(o.creatures!==!1){const e=Math.max(0,o.spareGriffinflies|0);Me=Jt(Oe.length+e,u,d,b),Oe.forEach((g,B)=>Me.place(B,g.position,g.normal,T.range(-.5,.5))),y.add(Me.body,Me.wings),await t.yield()}const Mt={entry:{position:[0,3,220],direction:[0,0,-1]},portalSeat:{position:[0,8,-260],facing:[0,-.1045,.9945],radius:7},flyThrough:[[0,3,220],[0,3,160],[.5,3,124],[-.8,7.5,95],[.3,12,66],[.8,7,36],[-.5,3,9],[0,2.4,-20],[1.4,2,-48],[.6,1.3,-80],[-.6,1.2,-140],[0,1.2,-193],[0,5.46,-235],[0,8,-260]],viewpoints:{entryFrame:{from:[0,3,220],lookAt:[w.x,12,w.z]},crownLook:{from:[.3,12,66],lookAt:[0,30,20]},floodFront:{from:[0,2.4,-20],lookAt:[0,.5,-60],progress:.5},arthropleura:{from:[h.x-4.9,1.7,h.z+4.2],lookAt:[h.x-2.5,.45,h.z-.5],progress:ot},doorway:{from:[0,3.8,-219],lookAt:[0,8,-260],progress:.95}},loneTree:[w.x,0,w.z],fallenTree:{foot:x.foot.toArray(),fork:x.fork.toArray(),direction:H.toArray(),perch:[0,10.3,Ye]},sigillaria:[oe.x,0,oe.z],arthropleuraMound:[h.x,0,h.z],arthropleura:Le?{center:Le.center.toArray(),head:Le.head.toArray(),progress:ot}:null,breach:[-80,0,10],perches:Oe,trunks:c.filter(e=>!e.fallen).map(e=>[e.x,e.z,.75*e.s,35*e.s]).concat(W.map(e=>[e.x,e.z,.36*e.s,13*e.s])),mounds:xe.map(e=>[e.x,e.z,2.6*e.s]),extent:{xMin:-17,xMax:17,zMin:-262,zMax:222,naveHalfWidth:5.4,crownBase:28,top:37},flood:{fieldKx:vt,flow:[.9848,0,-.1736],speedSideways:3.5}};let Te=.5,je=null;const ze=A(),zt=e=>.34*(o.bounce??1)*ye(.45,.62,e),Ge=()=>{b.uFront.value=je??tt(Te),u.uBounce.value=zt(Te);for(const e of Ce)e.setProgress?.(Te)};return Ge(),{object:y,radius:62,height:37,center:A(0,9,-40),anchors:Mt,ground:!1,groundY:0,water:Ae,shafts:Ke,griffinflies:Me,uniforms:{...u,...b},floodFrontAt:tt,setProgress(e){Te=re(e,0,1),je=null;for(const g of Ce)g.drive?.();Ge()},setFront(e){je=-e,Ge()},setWakes(e){z(e)},update(e,g,B){u.uTime.value=g,B&&(B.getWorldPosition(ze),y.worldToLocal(ze),ze.y=Math.max(ze.y,.05),u.uCamL.value.copy(ze));for(const E of Ce)E.update?.(e,g)},dispose(){b.uObst.value?.dispose()}}}function It(t,o={}){const n=new i.Color(o.body||"#6B3A22"),r=new i.Color(o.edge||"#C9A24A"),d=new i.Color(o.belly||"#b99a5a"),S=[],y=[],M=[],v=[],k=[],u=new i.Color,p=n.clone().multiplyScalar(.55),z=[[0,1],[.16,.97],[.28,.86],[.36,.5],[.47,.54],[.74,.44],[.94,.3],[1.06,.14]],b=.295,m=.15,P=30,K=2.3/P,F=G/.52,s=L=>.62+.38*ye(-1,5,L)-.42*ye(23,30,L),a=(L,T,V,_,D=[0,0,0,0],j=0)=>(S.push(L,T,V),y.push(_.r,_.g,_.b),M.push(D[0],D[1],D[2],D[3]),v.push(j,V),S.length/3-1),l=(L,T,V,_,D,j)=>{const J=S.length/3;for(let q=-7;q<=7;q++){const $=z[Math.abs(q)],Y=$[0]*Math.sign(q),I=Math.abs(q);u.copy(n).multiplyScalar(D*(I<=2?.86:.66)),I===3&&u.lerp(p,.85),I>=6&&u.lerp(r,(I===7?.95:.6)*Math.min(1,D*1.6)),u.lerp(r,j*(.4+.6*I/7)),a(Y*T,_+$[1]*V,L,u,[0,0,0,0],Y)}return J},f=(L,T,V=14)=>{for(let _=0;_<V;_++)k.push(L+_,L+_+1,T+_+1,L+_,T+_+1,T+_)};let c=0;const C=l(0,.035,.05,.05,.8,.2),h=l(-.045,.1,.1,.045,.85,.1),w=l(-.13,.135,.13,.045,.9,.3);f(C,h),f(h,w),c=-.125;for(let L=0;L<P;L++){const T=s(L)*b,V=m*(.8+.2*s(L)),_=.86+.28*t(),D=c+.014,j=c-K,J=l(D,T*.8,V*.84,.045,_*.34,0),q=l((D+j)*.5-.012,T*1.06,V,.05,_,.03),$=l(j,T*.97,V*1.05,.05,_*1.12,.3),Y=l(j+.004,T*.86,V*.78,.045,_*.22,0);f(J,q),f(q,$),f($,Y),c=j}const x=l(c+.012,b*.5,m*.72,.045,.85,0),H=l(c-.07,b*.46,m*.6,.045,.95,.15),N=l(c-.13,b*.26,m*.3,.045,1,.5);f(x,H),f(H,N);const R=c-.13;for(let L=0;L<16;L++){const T=-.02-L/16*(.1-R),V=-.02-(L+1)/16*(.1-R),_=.17*s(L*2-1),D=.17*s(L*2+1),j=a(-_,.05,T,d),J=a(_,.05,T,d),q=a(D,.05,V,d),$=a(-D,.05,V,d);k.push(j,q,J,j,$,q)}const W=(L,T,V,_)=>{const D=[];L.forEach((j,J)=>{const q=L[Math.max(0,J-1)],$=L[Math.min(L.length-1,J+1)],Y=A($[0]-q[0],$[1]-q[1],$[2]-q[2]).normalize(),I=A(0,0,1).addScaledVector(Y,-Y.z).normalize(),fe=A().crossVectors(Y,I),pe=[];u.copy(T).lerp(V,J/(L.length-1));for(let oe=0;oe<3;oe++){const ae=oe/3*G;pe.push(a(j[0]+(I.x*Math.cos(ae)+fe.x*Math.sin(ae))*j[3],j[1]+(I.y*Math.cos(ae)+fe.y*Math.sin(ae))*j[3],j[2]+(I.z*Math.cos(ae)+fe.z*Math.sin(ae))*j[3],u,[_[0],j[4],_[1],_[2]]))}D.push(pe)});for(let j=0;j<D.length-1;j++)for(let J=0;J<3;J++){const q=(J+1)%3;k.push(D[j][J],D[j][q],D[j+1][q],D[j][J],D[j+1][q],D[j+1][J])}},O=n.clone().multiplyScalar(.4),Z=n.clone().multiplyScalar(.8).lerp(r,.3);for(let L=0;L<40;L++)for(const T of[-1,1]){const V=-.17-L*.05500000000000001,_=b*s(L*.75)*T,D=-V*F+(T>0?0:.5);W([[.3*_,.07,V,.018,0],[.74*_,.092,V,.016,.3],[1*_,.058,V-.006,.014,.8],[1.13*_,.004,V-.014,.008,1]],O,Z,[D,T,1])}for(const L of[-1,1]){W([[.035*L,.085,-.01,.014,0],[.095*L,.12,.09,.011,.5],[.15*L,.1,.2,.006,1]],Z,r,[0,L,2]),W([[.07*L,.11,-.06,.012,0],[.115*L,.16,-.05,.011,0]],O,O,[0,L,0]);const T=[.122*L,.17,-.048],V=.024,_=new i.Color(.012,.009,.006),D=new i.Color(1.5,1.4,1.2);{const $=a(T[0]+.004,T[1]+V*.75,T[2]+.014,D),Y=a(T[0]+.014,T[1]+V*.45,T[2]+.02,D),I=a(T[0]-.004,T[1]+V*.4,T[2]+.024,D);k.push($,I,Y,$,Y,I)}const j=a(T[0],T[1]+V,T[2],_),J=a(T[0],T[1]-V,T[2],_),q=[[V,0],[0,V],[-V,0],[0,-V]].map(([$,Y])=>a(T[0]+$,T[1],T[2]+Y,_));for(let $=0;$<4;$++){const Y=($+1)%4;k.push(j,q[Y],q[$],J,q[$],q[Y])}}const U=new i.BufferGeometry;return U.setAttribute("position",new i.Float32BufferAttribute(S,3)),U.setAttribute("color",new i.Float32BufferAttribute(y,3)),U.setAttribute("aLeg",new i.Float32BufferAttribute(M,4)),U.setAttribute("aAB",new i.Float32BufferAttribute(v,2)),U.setIndex(k),U.computeVertexNormals(),U.userData.length=-R,U}const we=72;function qt(t,o,n,r={}){const d=[],S=[];for(let u=0;u<we;u++){const p=Math.min(u,o.points.length-1);d.push(o.points[p].clone()),S.push(o.normals[p].clone())}const y={uPath:{value:d},uPathN:{value:S},uHead:{value:2.7},uSpacing:{value:o.spacing},uWalk:{value:0}},M=new i.MeshStandardMaterial({color:"#ffffff",vertexColors:!0,roughness:.42,metalness:0});M.onBeforeCompile=u=>{Object.assign(u.uniforms,y,{uTime:n.uTime,uBounce:n.uBounce,uBounceCol:n.uBounceCol,uFill:n.uFill}),u.vertexShader=u.vertexShader.replace("#include <common>",`#include <common>
        attribute vec4 aLeg; attribute vec2 aAB; varying vec2 vAB; varying float vLegK;
        uniform vec3 uPath[${we}]; uniform vec3 uPathN[${we}]; uniform float uHead, uSpacing, uWalk, uTime;
        vec3 arthPath(float f, out vec3 nrm){ f = clamp(f, 0., ${(we-1).toFixed(1)} - .001); int i = int(floor(f)); float t = f - float(i); int i1 = min(i + 1, ${we-1});
          nrm = mix(uPathN[i], uPathN[i1], t); return mix(uPath[i], uPath[i1], t); }`).replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
        float aS = uHead + position.z, aF = aS / max(uSpacing, 1e-3); vec3 nA, nB;
        vec3 pA = arthPath(aF - .5, nA), pB = arthPath(aF + .5, nB);
        vec3 aT = normalize(pB - pA + vec3(0., 0., 1e-5));
        vec3 aN = nA + nB; aN = aN - aT * dot(aN, aT); aN = aN / max(length(aN), 1e-4);
        vec3 aBi = cross(aN, aT);
        objectNormal = aBi * objectNormal.x + aN * objectNormal.y + aT * objectNormal.z;`).replace("#include <begin_vertex>",`
        vec3 lp = vec3(position.xy, 0.); float ph = uWalk - aLeg.x;
        float isLeg = step(.5, aLeg.w) * (1. - step(1.5, aLeg.w)), isAnt = step(1.5, aLeg.w);
        lp.z += isLeg * aLeg.y * .05 * sin(ph); lp.y += isLeg * aLeg.y * .03 * max(cos(ph), 0.); lp.x += isLeg * aLeg.y * aLeg.z * .022 * cos(ph);
        lp.x += isAnt * aLeg.y * .03 * sin(uTime * 2.6 + aLeg.z * 1.7); lp.y += isAnt * aLeg.y * .02 * sin(uTime * 3.3 + aLeg.z);
        lp.y *= 1. + .035 * sin(aS * 3.1 + uTime * 1.3) * (1. - step(.5, aLeg.w));                 // plates breathe
        float flex = sin(aS * 2.2 - uWalk * .2) * .03;
        vec3 transformed = (pA + pB) * .5 + aBi * (lp.x + flex) + aN * lp.y + aT * lp.z;
        vAB = aAB; vLegK = aLeg.w;`),u.fragmentShader=u.fragmentShader.replace("#include <common>",`#include <common>
        varying vec2 vAB; varying float vLegK; uniform vec3 uBounceCol, uFill; uniform float uBounce;
        ${de}`).replace("#include <color_fragment>",`#include <color_fragment>
        float aFade = 1. - smoothstep(7., 26., length(vViewPosition));
        vec2 tc = vAB * vec2(3.6, 52.); float tub = vn2(tc), tub2 = vn2(tc * 3.1);
        float bodyK = (1. - step(.5, vLegK)) * aFade;
        diffuseColor.rgb *= mix(1., .66 + .44 * tub + .16 * tub2, bodyK);
        float knob = smoothstep(.8, .92, abs(vAB.x)) * smoothstep(.2, .55, abs(fract(vAB.y * 39.1) - .5) * 2.);
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.45 + vec3(.06, .04, .012), knob * bodyK * .7);
        diffuseColor.rgb *= 1. - .5 * bodyK * smoothstep(.3, .36, abs(vAB.x)) * (1. - smoothstep(.38, .47, abs(vAB.x)));`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        roughnessFactor = .34 + .3 * tub * bodyK;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        totalEmissiveRadiance += diffuseColor.rgb * (uBounceCol * uBounce * 1.1 + uFill * .5);`)},M.customProgramCacheKey=()=>"stm-arth";const v=new i.Mesh(t,M);v.frustumCulled=!1;const k=.16;return{mesh:v,length:t.userData.length||2.55,routeLength:(o.points.length-1)*o.spacing,setHead(u){y.uHead.value=u,y.uWalk.value=u/k*G}}}const ot=.61,Et=Math.atan2(-.55,-.83),De=[-1.7,1.25],ve=[-3.05,.35,.8],Ut=[[-9.5,-.6],[-7,-.3],[-5.4,0],[-4.4,.2],[-3.3,.45],[-2.4,.8],[-1.7,1.25],[-.9,1.95],[.3,2.2],[1.4,1.6],[2,.4],[1.7,-1],[.6,-1.9],[-.8,-1.9],[-1.9,-.9],[-2,.6],[-1.3,1.7],[0,2.1]];async function $t(t,o,n){const r=Math.cos(o.rot),d=Math.sin(o.rot),S=[];for(const s of t.tubes)if(s.kind===1)for(let a=0;a<s.P.length-1;a++)S.push([s.P[a],s.P[a+1],s.R[a],s.R[a+1]]);const y=(s,a)=>{const l=s*r-a*d,f=s*d+a*r;let c=Math.max(ue(Math.hypot(l,f)),ve[2]*ue(Math.hypot(s-ve[0],a-ve[1])/ve[2]),0)+.03;for(const[C,h,w,x]of S){const H=h.x-C.x,N=h.z-C.z,R=re(((l-C.x)*H+(f-C.z)*N)/Math.max(H*H+N*N,1e-6),0,1),W=Math.hypot(l-C.x-H*R,f-C.z-N*R),O=ce(w,x,R)*1.25;W<O&&(c=Math.max(c,ce(C.y,h.y,R)+Math.sqrt(O*O-W*W)*.8-.03))}return c},M=(s,a)=>{const l=y(s,a),f=Math.max(l,y(s+.15,a),y(s-.15,a),y(s,a+.15),y(s,a-.15));return l*.5+f*.5},v=new i.CatmullRomCurve3(Ut.map(([s,a])=>A(s,0,a)),!1,"centripetal"),k=Math.round(v.getLength()/.34),u=v.getLength()/k,p=v.getSpacedPoints(k).slice(0,we);let z=0;p.forEach((s,a)=>{Math.hypot(s.x-De[0],s.z-De[1])<Math.hypot(p[z].x-De[0],p[z].z-De[1])&&(z=a)});{let s=0,a=0;for(const c of p)s+=(c.x*r-c.z*d)/p.length,a+=(c.x*d+c.z*r)/p.length;let l=0;for(const c of p)l=Math.max(l,Math.hypot(c.x*r-c.z*d-s,c.x*d+c.z*r-a));l+=.6;const f=S.filter(([c,C,h,w])=>Math.hypot((c.x+C.x)/2-s,(c.z+C.z)/2-a)<l+Math.hypot(C.x-c.x,C.z-c.z)/2+Math.max(h,w)*1.25);S.length=0;for(const c of f)S.push(c)}n&&await n();const b=[];for(let s=0;s<p.length;s++)b.push(M(p[s].x,p[s].z)),n&&s%16===15&&await n();const m=p.map((s,a)=>A(o.x+s.x,(b[Math.max(a-1,0)]+2*b[a]+b[Math.min(a+1,p.length-1)])/4,o.z+s.z)),P=.22,K=[];for(let s=0;s<p.length;s++){const a=p[s];K.push(A(-(M(a.x+P,a.z)-M(a.x-P,a.z))/(2*P),1,-(M(a.x,a.z+P)-M(a.x,a.z-P))/(2*P)).normalize()),n&&s%8===7&&await n()}const F=Math.max(0,z-5);return{points:m,normals:K,spacing:u,pose:z*u,length:(m.length-1)*u,head:m[z].clone(),center:m[F].clone()}}function Zt(){const t=[],o=[],n=[],r=new i.Color,d=new i.Color("#20230f"),S=new i.Color("#b4b85a"),y=new i.Color("#6b7a22"),M=new i.Color("#8a5a1c"),v=(s,a,l,f)=>(t.push(s,a,l),o.push(f.r,f.g,f.b),t.length/3-1),k=(s,a)=>{const l=s.map(([f,c,C,h,w])=>{const x=t.length/3;for(let H=0;H<a;H++){const N=H/a*G;v(Math.sin(N)*C,c+Math.cos(N)*h,f,w)}return x});for(let f=0;f<l.length-1;f++)for(let c=0;c<a;c++){const C=(c+1)%a;n.push(l[f]+c,l[f]+C,l[f+1]+c,l[f]+C,l[f+1]+C,l[f+1]+c)}},u=[];for(let s=0;s<=10;s++){const a=-.035-s*.029,l=ce(.018,.011,s/10)*(s===10?.5:1),f=s%2?S:d;u.push([a+.003,.004-s*8e-4,l*.8,l*.8,d],[a-.012,.004-s*8e-4,l*1.15,l*1.1,f],[a-.024,.004-s*8e-4,l,l,f])}k(u.slice(0,31),6),k([[.058,.004,.014,.014,d],[.045,.014,.029,.031,d],[.02,.023,.037,.043,S],[-.01,.019,.034,.037,d],[-.036,.006,.019,.019,S]],8),k([[.086,.004,.006,.006,d],[.074,.006,.016,.013,S],[.058,.006,.014,.013,d]],6);for(const s of[-1,1]){const a=[.018*s,.015,.071],l=.0215,f=[];for(let c=0;c<=4;c++){const C=c/4*Math.PI,h=[];for(let w=0;w<6;w++){const x=w/6*G;r.copy(y).multiplyScalar(c===1&&w===(s>0?1:5)?9:.6+.6*Math.cos(C)),h.push(v(a[0]+Math.sin(C)*Math.cos(x)*l,a[1]+Math.cos(C)*l,a[2]+Math.sin(C)*Math.sin(x)*l*1.15,r))}f.push(h)}for(let c=0;c<4;c++)for(let C=0;C<6;C++){const h=(C+1)%6;n.push(f[c][C],f[c][h],f[c+1][C],f[c][h],f[c+1][h],f[c+1][C])}}const p=s=>{const a=s.map(l=>[v(l[0],l[1]+l[3],l[2],d),v(l[0]-l[3],l[1]-l[3]*.6,l[2],d),v(l[0]+l[3],l[1]-l[3]*.6,l[2]+l[3],S)]);for(let l=0;l<a.length-1;l++)for(let f=0;f<3;f++){const c=(f+1)%3;n.push(a[l][f],a[l+1][f],a[l][c],a[l][c],a[l+1][f],a[l+1][c])}};for(const s of[-1,1])for(let a=0;a<3;a++){const l=.04-a*.026,f=.05+a*.012;p([[.014*s,-.012,l,.004],[.05*s,-.004,l+.02+f*.3,.0035],[.075*s,-.03,l+.03+f*.8,.0028],[.085*s,-.045,l+.035+f,.0012]])}const z=new i.BufferGeometry;z.setAttribute("position",new i.Float32BufferAttribute(t,3)),z.setAttribute("color",new i.Float32BufferAttribute(o,3)),z.setIndex(n),z.computeVertexNormals();const b=[],m=[],P=[],K=7;for(let s=0;s<2;s++)for(const a of[-1,1]){const l=s===0?.03:-.012,f=s===0?.035:-.03,c=s===0?.345:.325,C=b.length/3;for(let h=0;h<=K;h++){const w=h/K,x=(.012+c*w)*a,H=(.012+.066*Math.pow(Math.sin(Math.PI*Math.min(.06+w*.9,1)),.55))*(s?1.12:1),N=l+f*w+H*.36,R=N-H*(1-.25*w*w);if(b.push(x,.026,N,x,.026,R),m.push(w,0,s,a,w,1,s,a),h<K){const W=C+h*2;P.push(W,W+1,W+2,W+1,W+3,W+2)}}}const F=new i.BufferGeometry;return F.setAttribute("position",new i.Float32BufferAttribute(b,3)),F.setAttribute("aWing",new i.Float32BufferAttribute(m,4)),F.setIndex(P),{body:z,wings:F,amber:M}}function Jt(t,o,n,r){const d=Zt(),S=new Float32Array(t*2);for(let F=0;F<t;F++)S[F*2]=F*2.399;const y=new i.InstancedBufferAttribute(S,2);d.body.setAttribute("iFly",y),d.wings.setAttribute("iFly",y);const M=new i.MeshStandardMaterial({color:"#ffffff",vertexColors:!0,roughness:.32,metalness:0,side:i.DoubleSide});M.onBeforeCompile=F=>{Object.assign(F.uniforms,{uTime:o.uTime,uBounce:o.uBounce,uBounceCol:o.uBounceCol,uFill:o.uFill}),F.vertexShader=F.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 iFly; uniform float uTime;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        { float tail = clamp((-.03 - position.z) / .3, 0., 1.);                          // the abdomen pumps and dips
          transformed.y += tail * tail * (.012 * sin(uTime * 2.1 + iFly.x) - .006);
          transformed.xy *= 1. + .06 * sin(uTime * 5.5 + iFly.x + position.z * 30.) * tail; }`),F.fragmentShader=F.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uBounceCol, uFill; uniform float uBounce;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance += diffuseColor.rgb * (uBounceCol * uBounce + uFill * .7);`)},M.customProgramCacheKey=()=>"stm-gbody";const v=new i.ShaderMaterial({uniforms:{...i.UniformsUtils.clone(i.UniformsLib.fog),uTime:o.uTime,uAmber:{value:new i.Color(n[6])},uSunCol:r.uSunCol,uFill:o.uFill,uSunDir:r.uSunDir},transparent:!0,depthWrite:!1,side:i.DoubleSide,fog:!0,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 aWing; attribute vec2 iFly; uniform float uTime; varying vec4 vW; varying vec3 vVW;
      void main(){
        vec3 p = position; float pair = aWing.z;
        float shiver = smoothstep(.75, 1., sin(uTime * .7 + iFly.x)) * sin(uTime * 23. + pair * 2.) * .05;
        float ang = iFly.y * sin(uTime * 34. + iFly.x + pair * 1.1) * .7 + (1. - iFly.y) * (.04 * sin(uTime * 1.3 + iFly.x + pair) + shiver);
        float a = ang * aWing.w, cs = cos(a), sn = sin(a); vec2 rel = p.xy - vec2(.012 * aWing.w, .026);
        p.xy = vec2(.012 * aWing.w, .026) + vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs);
        vec4 lp = vec4(p, 1.);
        #ifdef USE_INSTANCING
          lp = instanceMatrix * lp;
        #endif
        vW = aWing; vec4 wp = modelMatrix * lp; vVW = wp.xyz - cameraPosition;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uAmber, uSunCol, uFill, uSunDir; varying vec4 vW; varying vec3 vVW;
      void main(){
        float t = vW.x, c = vW.y;
        float det = 1. - smoothstep(.3, .9, fwidth(t) * 34.);
        float lon = min(min(abs(c - .2 - .05 * t), abs(c - .42 - .08 * t)), abs(c - .66 - .05 * t));
        float vein = 1. - smoothstep(.012, .03, lon);
        vein = max(vein, 1. - smoothstep(.03, .075, min(c, 1. - c) + .02));                          // stout leading and trailing edges
        float cross = 1. - smoothstep(.07, .14, abs(fract(t * 30. + floor(c * 4.) * .37) - .5));
        float net = (1. - smoothstep(.06, .13, abs(fract(c * 8. + sin(t * 21.) * .12) - .5))) * step(.45, c);
        vein = mix(.22, max(vein, max(cross * .75, net * .55)), det);
        float baseT = 1. - smoothstep(0., .34, t);
        vec3 V = vVW / max(length(vVW), 1e-4); float back = max(dot(V, uSunDir), 0.); back *= back;
        vec3 col = uAmber * (vein + baseT * .7 + .12) * (uSunCol * (.55 + 2.4 * back) + uFill * 1.2) + vec3(.9, 1., .85) * .05;
        gl_FragColor = vec4(col, clamp(vein * .82 + .07 + baseT * .4, 0., .94));
        #include <fog_fragment>
      }`}),k=new i.InstancedMesh(d.body,M,t),u=new i.InstancedMesh(d.wings,v,t);k.frustumCulled=u.frustumCulled=!1,u.renderOrder=3;const p=new i.Matrix4().makeScale(0,0,0),z=new i.Matrix4,b=A(),m=A(),P=A();for(let F=0;F<t;F++)k.setMatrixAt(F,p),u.setMatrixAt(F,p);const K=(F,s)=>{k.setMatrixAt(F,s),u.setMatrixAt(F,s),k.instanceMatrix.needsUpdate=u.instanceMatrix.needsUpdate=!0};return{body:k,wings:u,count:t,setMatrix:K,setFlap(F,s){S[F*2+1]=s,y.needsUpdate=!0},place(F,s,a,l=0,f=1){m.set(a[0],a[1],a[2]).normalize(),P.set(0,1,0).addScaledVector(m,-m.y).normalize().applyAxisAngle(m,l),b.crossVectors(m,P),z.makeBasis(b,m,P).scale(A(f,f,f)).setPosition(s[0]+m.x*.05,s[1]+m.y*.05,s[2]+m.z*.05),K(F,z)}}}export{ve as ARTH_HUMMOCK,ot as ARTH_U,dt as ARTH_Z,Ye as FALL_Z,Ne as GLSL_SHAFT,Tt as LONE_Z,Pt as PERCH_Z,It as arthropleuraGeometry,to as buildHero,tt as floodFrontAt,Zt as griffinflyGeometry,qt as makeArthropleura,Wt as makeBarkMaterial,_t as makeFoliageMaterial,Jt as makeGriffinflies,eo as makeObstacleTexture,Je as moundGeometry,ue as moundHeight,Ze as scaleTreeFoliage,Ct as scaleTreeSkeleton,Re as tessellateTree,Lt as trunkRadiusAt};
