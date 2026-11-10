import*as a from"three";import{makePath as Ra,makeRng as va,hashSeed as Va,clamp as ue,lerp as C,smoothstep as B}from"../kit/core.js";import{makeSky as Ga}from"../kit/sky.js";import*as Ia from"../kit/fx.js";import{buildHero as Oa,makeTheropod as Rt,makeRoute as ja,makeTiming as qa,theropodCycle as Na,makeRunMarks as Ha}from"../parts/fire-in-the-sand-sea.js";const me=Math.PI*2,Ea={blue:{zenith:"#1a2650",mid:"#3a4a7e",horizon:"#56648f",ground:"#141b33",band:"#F3C9A0",scatter:.28,stars:.42,starDensity:.22,milky:0,bandGain:1.15,sheen:1.15,skin:1,fume:"#7384ad",up:[.155,.33,1],low:1.5,rake:.34,lava:1,exposure:1,fog:"#1d2644",fogD:16e-5},night:{zenith:"#070b1c",mid:"#121a3a",horizon:"#1d2a52",ground:"#080c1a",band:"#a07a86",scatter:.1,bandGain:.3,sheen:1,skin:1,stars:1,starDensity:1,milky:.55,fume:"#3d4a72",up:[.11,.2,.66],low:1.15,rake:.1,lava:1.4,exposure:1.2,fog:"#101730",fogD:14e-5},firstsun:{zenith:"#1b2748",mid:"#3d4a74",horizon:"#56608a",ground:"#141a30",band:"#FFD3A2",scatter:.45,bandGain:1.5,sheen:1.15,skin:.82,stars:.12,starDensity:.2,milky:0,fume:"#9a96b4",up:[.2,.37,1],low:1.7,rake:.5,lava:.9,exposure:.96,fog:"#28304f",fogD:17e-5}};var Qa={id:"fire-in-the-sand-sea",name:"The Sand Sea Drowns",category:"prehistoric",media:["air","open"],weirdness:.35,async build(m){const ae=m.rng,we=m.vary||{},fe=ue(m.quality?.detail??1,.5,1),Je=ue(we.density??1,.7,1.3),ge=ae.fork("look"),Ie=ge();let se=Ie<.2?"firstsun":Ie<.7?"blue":"night";we.hour==="night"?se="night":(we.hour==="dawn"||we.hour==="golden"||we.hour==="day")&&(se="firstsun");const S=Ea[se],Y=ge()<.3,ie=ge()<.4,et=ge()<1/6,Fe=!!we.rare,xe=Y?.12:C(.75,1.15,ge()),U=new a.Scene;U.fog=new a.FogExp2(S.fog,S.fogD*1.3);const j=new a.Color(S.fog).lerp(new a.Color(S.horizon),.8),ee=new a.Color(se==="night"?"#4a3f5e":se==="firstsun"?"#c39a92":"#b08a8e"),q={value:0},k=await Oa(m,{detail:fe});U.add(k.object);const _=k.anchors,u=k.lights,p=k.heightAt,F=k.dunes;u.uSkyUp.value.setRGB(S.up[0],S.up[1],S.up[2]),u.uSkyLow.value.multiplyScalar(S.low/1.5),u.uRakeCol.value.multiplyScalar(S.rake/.34);const be=u.uRakeCol.value.clone();u.uLavaGain.value=S.lava,u.uWind&&(u.uWind.value=Y?.85:xe),u.uVeilSpeed&&(u.uVeilSpeed.value=Y?3.2:6.5);{const e=k.parts.lava.material.uniforms;e.uZen.value.multiplyScalar(S.sheen),e.uHor.value.multiplyScalar(S.sheen),e.uSkin.value.multiplyScalar(S.skin),e.uDawn.value.multiplyScalar(.6*S.bandGain)}u.uSunCol&&u.uSunCol.value.set(se==="firstsun"?"#ffb87a":"#000000").multiplyScalar(1.5),await m.yield();const st=3.2,ke=Ga({rng:ae,preset:"blueHour",zenith:S.zenith,mid:S.mid,horizon:S.horizon,ground:S.ground,horizonPow:5,midPow:1.3,groundFalloff:9,scatterColor:S.band,scatter:S.scatter,scatterPow:st,scatterHigh:0,scatterFall:9,sunElevation:se==="firstsun"?-1.5:-5,sunAzimuth:90,sunIntensity:0,sunGlow:se==="firstsun"?.5:.22,sunColor:"#ffb98a",stars:S.stars,starDensity:S.starDensity,twinkle:.5,starColor:.4,milkyWay:S.milky,milkyAngle:40,bodies:[],clouds:!1,clouds2:!1,fogColor:S.fog,bake:S.milky>0,renderer:m.renderer});U.add(ke.object),await m.yield();const Z=await ja(k,()=>m.yield()),L=Ra(Z),ve=qa(k,L),le=_.portalSeat.position,W=L.nearestXZ(Z.marks.lip.x,Z.marks.lip.z).u,ce=L.nearestXZ(Z.marks.shore.x,Z.marks.shore.z).u,$=L.nearestXZ(Z.marks.print.x,Z.marks.print.z).u,it=(e,t,n)=>{if(e<=t[0])return n[0];for(let o=1;o<t.length;o++)if(e<=t[o])return C(n[o-1],n[o],(e-t[o-1])/(t[o]-t[o-1]));return n[n.length-1]},Oe=L.nearestXZ(_.crossing.x,_.crossing.z).u,Ae=L.nearestXZ(Z.marks.turn.x,Z.marks.turn.z).u,je=L.nearestXZ(le.x-F.HD[0]*160,le.z-F.HD[1]*160).u,Ue={duration:50},lt=e=>1.2-.66*(1-B(W-.03,W+.04,e))-.3*B(W-.03,W+.02,e)*(1-B(W+.03,W+.09,e))+.12*B(W+.05,W+.1,e)*(1-B(Ae-.05,Ae,e))-.34*B($-.06,$-.02,e)*(1-B($+.01,$+.05,e)),Se=F.HD,De=[.94,.342],qe=(e,t)=>[le.x-Se[0]*e+De[0]*t,le.z-Se[1]*e+De[1]*t],ct=(e,t)=>{const n=qe(e,t);return p(n[0],n[1])},Be=(e,t)=>-((e-le.x)*Se[0]+(t-le.z)*Se[1]),Mt=e=>{const t=qe(e,0);return L.nearestXZ(t[0],t[1]).u},Ct=e=>{let t=120;for(;t<260&&ct(t+.5,e)>=4.3;)t+=.5;return t},Vt=Ct(0),ha=22,da=19,pa=Mt(Vt+45),Lt=Mt(Vt-5);let Gt=.045;const ut=e=>{const t=B(pa,Lt,e);return t<=0?lt(e):C(lt(e),C(ha,da,ue((e-Lt)/(1-Lt),0,1))*Gt,t)};for(let e=0;e<8;e++){let t=0,n=ue(ut(0),.35,2.5);for(let o=1;o<=64;o++){const i=ue(ut(o/64),.35,2.5);t+=2/(n+i),n=i}Gt=Ue.duration/(L.length*t/64)}const Pt=(()=>{const t=new Float32Array(65),n=1024,o=new Float32Array(n+1);let i=0;for(let r=0;r<=64;r++){const s=+ut(r/64);t[r]=Number.isFinite(s)?ue(s,.35,2.5):1}for(let r=0;r<64;r++)i+=2/(t[r]+t[r+1]);for(let r=1;r<=n;r++){const s=(r-.5)/n*64,l=Math.min(63,Math.floor(s));o[r]=o[r-1]+Ue.duration/n/((t[l]+(t[l+1]-t[l])*(s-l))*i/64)}return r=>{const s=ue(r,0,1)*n,l=Math.min(n-1,Math.floor(s));return o[l]+(o[l+1]-o[l])*(s-l)}})();await m.yield();const ye=[],It=[],ma=new a.Vector2,wa=new a.Vector3,ft=new a.Vector3,Ot=new a.Vector3().copy(_.runnerStand),jt=Ot.clone(),N={},qt=[k.runner.uniforms];{const e=new a.CylinderGeometry(1,1,.62,48,10,!0,0,Math.PI);e.translate(0,.25,0);const t=new a.ShaderMaterial({transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.BackSide,fog:!1,uniforms:{uPeach:{value:new a.Color(S.band)},uRose:{value:new a.Color("#B9788A")},uGain:{value:S.bandGain}},vertexShader:`
          varying vec3 vDir;
          void main(){
            vDir = position;
            vec4 p = projectionMatrix * (viewMatrix * vec4(cameraPosition + position * 6000., 1.));
            if (abs(p.w) < 1e-4) p.w = 1e-4;
            gl_Position = p.xyww;
          }`,fragmentShader:`
          uniform vec3 uPeach, uRose; uniform float uGain;
          varying vec3 vDir;
          void main(){
            float el = degrees(atan(vDir.y, max(length(vDir.xz), 1e-4)));
            float az = max(vDir.x, 0.) / max(length(vDir.xz), 1e-4);
            float azW = az * az * (0.35 + 0.65 * az * az);
            float up = max(el, 0.), dn = max(-el, 0.);
            vec3 c = uPeach * 1.05 * exp(-up / 6.) + uRose * 0.5 * exp(-up / 13.) * (1. - exp(-up / 4.));   // (polish 5: peach, never a white-out behind the crest)
            c *= azW * exp(-dn / 1.2) * uGain * (1. - smoothstep(16., 31., up));
            gl_FragColor = vec4(c, 1.);
          }`}),n=new a.Mesh(e,t);n.frustumCulled=!1,n.renderOrder=-.5,n.name="dawn-band",U.add(n),ye.push((o,i,r,s)=>{t.uniforms.uGain.value=S.bandGain*(.82+.3*s)})}await m.yield();const Ne=`
      float wh1(float n){ return fract(sin(n * 127.1) * 43758.5453); }
      float wn1(float x){ float i = floor(x), f = fract(x); f = f * f * (3. - 2. * f); return mix(wh1(i), wh1(i + 1.), f); }
      float wh2(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      float wn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(wh2(i), wh2(i + vec2(1., 0.)), f.x), mix(wh2(i + vec2(0., 1.)), wh2(i + vec2(1., 1.)), f.x), f.y); }
      float wfbm(vec2 p){ float s = 0.5 * wn2(p); p = mat2(0.8, -0.6, 0.6, 0.8) * p * 2.03 + 17.1; s += 0.25 * wn2(p); p = mat2(0.8, -0.6, 0.6, 0.8) * p * 2.01 + 5.3; s += 0.125 * wn2(p); return s * 1.143; }`,ze=()=>a.UniformsUtils.merge([a.UniformsLib.fog]),vt=()=>{const e=new a.InstancedBufferGeometry;return e.setAttribute("position",new a.Float32BufferAttribute([0,-1,0,1,-1,0,1,1,0,0,1,0],3)),e.setIndex([0,1,2,0,2,3]),e.boundingSphere=new a.Sphere(new a.Vector3,1e5),e},ht=new a.Color("#C98B6B"),tt=new a.Color("#E2B58C");{const e=ae.fork("streamers"),t=Math.round(1500*fe*(.8+.2*Je)),n=Math.round(520*fe),o=t+n,i=new Float32Array(o*3),r=new Float32Array(o*4),s=new Float32Array(o*4),l=new a.Vector3;for(let c=t;c<o;c++){const h=e()<.45,f=h?C(je-.03,1.02,e()):C(-.01,W+.03,e());L.pointAt(f,l);const A=h?.42:.985,y=h?-.9:-.17,b=e.range(-30,30)+(h?0:-14),P=Math.min(l.x-y*b-A*6,h?1e9:F.crestX(l.z+A*b)-7),D=l.z+A*b-y*6,z=p(P,D);i[c*3]=P,i[c*3+1]=z+.1,i[c*3+2]=D,r[c*4]=A,r[c*4+1]=(p(P+A*6,D+y*6)-z)/6,r[c*4+2]=y,r[c*4+3]=0,s[c*4]=e(),s[c*4+1]=C(.45,.8,e()),s[c*4+2]=C(2.5,5,e()),s[c*4+3]=C(.3,.6,e()),c%200===199&&await m.yield()}for(let c=0;c<t;c++){const h=e();let f,A,y,b=.985,P=-.17,D=1;if(h<.62)y=C(150,-215,e()),f=F.crestX(y),A=p(f-.3,y);else if(h<.8){const z=e();f=z<.25?C(156,174,z*4):z<.5?C(206,224,(z-.25)*4):C(70,330,(z-.5)*2),Math.abs(f-190)<16&&(f+=f<190?-18:18),y=F.spurZ(f),A=p(f,y+.3),b=.5,P=-.866,z<.5&&(b=.94,P=-.34,D=f<190?1.5:2.8)}else if(h<.9){const z=Math.floor(e()*5);if(z===0)y=F.ISLET.z+C(18,-17,e()),f=F.ISLET.x;else{const M=F.ISLETS[z-1],g=C(-.7,.7,e());f=M.x+M.ax[0]*g*M.L+M.lee[0]*(M.bow*g*g+.5),y=M.z+M.ax[1]*g*M.L+M.lee[1]*(M.bow*g*g+.5)}A=p(f,y),D=.7}else{y=C(350,-900,e());let z=760,M=-99;for(let g=0;g<26;g++){const H=760+g*11,K=p(H,y);K>M&&(M=K,z=H)}f=z,A=M,D=4.5}i[c*3]=f,i[c*3+1]=A,i[c*3+2]=y,r[c*4]=b,r[c*4+1]=0,r[c*4+2]=P,r[c*4+3]=1,s[c*4]=e(),s[c*4+1]=C(.32,.6,e())/Math.sqrt(D),s[c*4+2]=C(2.2,5.5,e())*D,s[c*4+3]=C(.5,1.2,e())*D,c%300===299&&await m.yield()}const v=vt();v.setAttribute("aBase",new a.InstancedBufferAttribute(i,3)),v.setAttribute("aDir",new a.InstancedBufferAttribute(r,4)),v.setAttribute("aSeed",new a.InstancedBufferAttribute(s,4)),v.instanceCount=o;const d=new a.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,side:a.DoubleSide,uniforms:Object.assign(ze(),{uTime:q,uWind:{value:xe},uSand:{value:tt.clone().lerp(ht,.4)},uSkyUp:u.uSkyUp,uLavaLit:u.uLavaLit,uLavaGain:u.uLavaGain}),vertexShader:`
          attribute vec3 aBase; attribute vec4 aDir, aSeed;
          uniform float uTime, uWind; uniform vec3 uSand, uSkyUp, uLavaLit; uniform float uLavaGain;
          varying vec2 vUv; varying float vA; varying vec3 vCol; varying float vS;
          #include <common>
          #include <fog_pars_vertex>
          ${Ne}
          void main(){
            float ph = uTime * aSeed.y + aSeed.x * 7.;
            float life = fract(ph), cyc = floor(ph);
            float h = wh1(cyc * 0.37 + aSeed.x * 91.7);
            vec3 wd = vec3(aDir.x, 0., aDir.z);
            float air = aDir.w;                                             // 1: flung off a crest, 0: hugging a windward flank
            float len = aSeed.z * (0.35 + 0.65 * uWind) * mix(0.5, 1., aDir.w);   // flank-hugging veils are short low wisps
            float travel = life * len * 3.4;
            vec3 c = aBase + wd * (travel - len * 0.25);
            c += vec3(-wd.z, 0., wd.x) * (h - 0.5) * 2.4 * life;
            c.y += 0.12 + aSeed.w * (0.5 + 1.1 * h) * life * (0.25 + 0.75 * air) - 0.011 * travel * travel * air + aDir.y * (travel - len * 0.25);
            vec3 toCam = cameraPosition - c; float dist = length(toCam);
            vec3 along = normalize(vec3(wd.x, aDir.y - 0.022 * travel * air, wd.z));
            vec3 across = normalize(cross(along, toCam / max(dist, 1e-3)) + vec3(0., 1e-4, 0.));
            float w = max(aSeed.w * (0.16 + 0.75 * life) * mix(1.1, 1., air), dist * 0.0012);
            vec3 p = c + along * (position.x - 0.5) * len * (0.7 + 0.9 * life) + across * position.y * w;
            float gust = smoothstep(0.3, 0.7, wn1(dot(aBase.xz, vec2(0.021, 0.027)) - uTime * 0.23) * 0.7 + 0.3 * wn1(dot(aBase.xz, vec2(0.11, 0.07)) + uTime * 0.5));
            vA = smoothstep(0., 0.12, life) * (1. - smoothstep(0.35, 1., life)) * (0.25 + 0.75 * gust) * max(uWind, 0.45 * (1. - air)) * mix(smoothstep(1.5, 5., dist), smoothstep(7., 26., dist), air) * mix(0.42, 1., air);   // (polish 2: sand flung off the crest thins out near the eye: close, it hung as pink puffs)
            float hl = max(c.y - (aBase.x < 20. ? 18. : 0.), 0.);
            float lava = (0.2 + 0.8 * smoothstep(0., 0.5, life)) * (exp(-hl / 26.) * 0.9 + 0.34) * (0.04 + 0.96 * air);   // (polish 4: sand flung off a high crest still takes the fire from below: seen against the night sky it was a row of dark beads)
            // (veils that hug a flank are lit like the flank they cross, a little paler; they used to read as dark dashes)
            float horn = step(0.93, wd.x) * step(wd.x, 0.95);              // the plumes of the two horns catch the warm low light
            vCol = uSand * (uSkyUp * mix(1.3, 0.62, air) + uLavaLit * uLavaGain * mix(0.3 * (exp(-hl / 13.) * 0.8 + exp(-hl / 2.4) * 0.5), lava * 1.9, air) + vec3(1., 0.56, 0.3) * 0.12 * horn);
            vA *= 1. - 0.6 * horn;
            vA *= 1. - 0.92 * smoothstep(0.55, 0.9, abs(dot(along, toCam / max(dist, 1e-3))));   // (polish 5) seen end-on a streamer is a faint breath: drawn, it stood on the skyline as a pale vertical streak                                         // (the horns' plumes are thin: bright, they read as pink flames beside the ring)
            vUv = position.xy; vS = aSeed.x * 37. + cyc;
            vec4 mvPosition = viewMatrix * vec4(p, 1.);
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          varying vec2 vUv; varying float vA; varying vec3 vCol; varying float vS;
          #include <common>
          #include <fog_pars_fragment>
          ${Ne}
          void main(){
            float e = 1. - vUv.y * vUv.y;
            float a = e * sqrt(max(e, 0.)) * smoothstep(0., 0.25, vUv.x) * (1. - vUv.x * vUv.x);
            a *= 0.45 + 0.75 * wn2(vec2(vUv.x * 5. + vS, vUv.y * 2.2 + vS * 0.3));
            gl_FragColor = vec4(vCol * 1.15, clamp(a * vA * 0.62, 0., 1.));
            #include <fog_fragment>
          }`}),w=new a.Mesh(v,d);w.frustumCulled=!1,w.renderOrder=3,w.name="streamers",U.add(w)}await m.yield();{const e=ae.fork("fume"),t=Math.round(44*fe),n=0,o=t+n,i=new Float32Array(o*3),r=new Float32Array(o*2),s=new Float32Array(o*2);let l=0,v=0;for(;l<o&&v<4e3;){v++;const h=l>=t,f=h?e.range(-60,520):e.range(-2700,5200),A=h?e.range(-470,140):e.range(-3400,2200),y=k.levelAt(f,A);if(p(f,A)>y-3)continue;const b=L.nearestXZ(f,A).dist,P=Math.hypot(f-60,A+200);if(h?b<34:P<520)continue;let D=h?e.range(46,90):150+P*.13,z=h?e.range(13,20):20+P*.012;const M=Y&&P<2400?1:0;M&&(z=105+P*.05,D=36+P*.036),i[l*3]=f,i[l*3+1]=y+.4,i[l*3+2]=A,r[l*2]=D,r[l*2+1]=z,s[l*2]=e(),s[l*2+1]=M,l++,v%200===0&&await m.yield()}const d=vt();d.setAttribute("aPos",new a.InstancedBufferAttribute(i,3)),d.setAttribute("aSize",new a.InstancedBufferAttribute(r,2)),d.setAttribute("aSeed",new a.InstancedBufferAttribute(s,2)),d.instanceCount=l;const w=new a.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,side:a.DoubleSide,uniforms:Object.assign(ze(),{uTime:q,uCalm:{value:Y?1:0},uFume:{value:new a.Color(S.fume)},uSkyUp:u.uSkyUp,uLava:u.uLava,uLavaGain:u.uLavaGain}),vertexShader:`
          attribute vec3 aPos; attribute vec2 aSize, aSeed;
          uniform float uTime, uCalm;
          varying vec2 vUv; varying float vA, vS, vC;
          #include <common>
          #include <fog_pars_vertex>
          void main(){
            vec3 c = aPos; vC = aSeed.y;
            c.x += sin(uTime * 0.07 + aSeed.x * 40.) * aSize.x * 0.12 * (1. - uCalm);
            vec2 tc = cameraPosition.xz - c.xz; float dist = length(tc);
            vec2 r = tc / max(dist, 1e-3);
            float sway = sin(uTime * 0.31 + aSeed.x * 17. + position.y * 1.3) * 0.02 * aSize.y * (0.3 + 0.7 * aSeed.y);   // a slow heat waver
            float yy = position.y * 0.5 + 0.5;
            vec3 p = c + vec3(r.y, 0., -r.x) * ((position.x - 0.5) * aSize.x + sway * yy) + vec3(0., yy * aSize.y, 0.);
            vA = smoothstep(aSize.x * 0.6, aSize.x * 1.6, dist);   // (over the home lake only a breath of it: the flood stays black from the crest)
            vUv = vec2(position.x, yy); vS = aSeed.x * 53.;
            vec4 mvPosition = viewMatrix * vec4(p, 1.);
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          uniform float uTime, uCalm, uLavaGain; uniform vec3 uFume, uSkyUp, uLava;
          varying vec2 vUv; varying float vA, vS, vC;
          #include <common>
          #include <fog_pars_fragment>
          ${Ne}
          void main(){
            float x = vUv.x * 2. - 1., y = vUv.y, kC = clamp(vC, 0., 1.);
            vec2 q = mix(vec2(vUv.x * 3.2 + uTime * 0.018, y * 1.4), vec2(vUv.x * 1.6, y * 4.5 - uTime * 0.06), kC) + vS;
            float nz = wn2(q) * 0.62 + wn2(q * 2.3 + 7.) * 0.38;
            float side = 1. - x * x; side *= side;
            float prof = mix((1. - y) * (1. - y), (1. - y) * (0.35 + 0.65 * (1. - y)), kC) * smoothstep(0., 0.05, y);
            float a = side * prof * smoothstep(0.2, 0.75, nz + 0.35 * (1. - y)) * vA;
            float under = exp(-y * mix(4.5, 9., kC));
            vec3 col = uFume * (0.6 + 0.5 * nz) + uLava * under * (0.55 + 0.5 * nz) * uLavaGain;
            gl_FragColor = vec4(col, clamp(a * mix(0.34, 0.5, kC), 0., 1.));
            #include <fog_fragment>
          }`}),c=new a.Mesh(d,w);c.frustumCulled=!1,c.renderOrder=2,c.name="fume",U.add(c)}await m.yield();const dt=new a.Group;dt.name="rig",U.add(dt);const Nt=Ia.makeParticles({rng:ae.fork("grains"),preset:"dust",time:q,count:Math.round(1100*fe),box:[34,7,34],velocity:[11*xe+.4,.15,-2.2*xe],velocityRandom:[3*xe+.3,.5,1.2],turbulence:[.5,.35,.4],size:[.006,.012],colors:["#d8b6a0","#c9a590","#e2c4ae"],intensity:.6,opacity:.05,additive:0,twinkle:.1,mode:"streak",shape:"streak",stretch:.018,near:[2.2,7]});dt.add(Nt.object),ye.push((e,t,n,o)=>{dt.visible=o>0&&!m.through,Nt.update(e,t,n)}),await m.yield();{const e=ae.fork("hoppers"),t=12,n=.4,o=Math.round(.0765*L.length),i=new Float32Array(t*4),r=new Float32Array(t*4),s=new Float32Array(t*2),l=new Float32Array(t*4),v=va(Va("fire-in-the-sand-sea:hopper-wander:"+(m.seed??0))),d=(x,O)=>{const T=l[x*4],V=l[x*4+1],re=l[x*4+2],pe=l[x*4+3];return T*(Math.sin(V*O+re)-Math.sin(re))+.3*T*(Math.sin(2.7*V*O+pe)-Math.sin(pe))},w=(x,O)=>{const T=l[x*4],V=l[x*4+1],re=l[x*4+2],pe=l[x*4+3];return T*V*Math.cos(V*O+re)+.81*T*V*Math.cos(2.7*V*O+pe)},c=(x,O)=>.16*Math.sin(2.3*O+l[x*4+2]*3.1)+.08*Math.sin(1.13*O+l[x*4+3]),h=[],f=[],A=[],y=[],b=[],P=new a.Vector3,D=new a.Vector3,z=Oe*L.length,M=5;let g=0;for(;g<z&&(L.pointAt(g/L.length,P),!(p(P.x,P.z)>k.levelAt(P.x,P.z)+.6));)g+=n;const H=(g+12)/L.length,K=(z-M)/L.length;for(let x=0;x<t;x++){const O=C(H,K,(x+e())/t);L.pointAt(O+M/L.length,P),L.tangentAt(O+M/L.length,D);const T=Math.max(Math.hypot(D.x,D.z),1e-4),V=-D.z/T,re=D.x/T,pe=(x%2?1:-1)*e.range(.35,1.5),ea=e.range(-.3,.3)+(pe>0?-.1:.1),We=P.x+V*pe,Re=P.z+re*pe,Ta=p(We,Re),bt=(p(We+1,Re)-p(We-1,Re))/2,kt=(p(We,Re+1)-p(We,Re-1))/2,ta=Math.max(Math.hypot(bt,kt),1e-4),aa=Math.cos(ea),oa=Math.sin(ea),At=(-bt*aa+kt*oa)/ta,zt=(-kt*aa-bt*oa)/ta,Dt=e();{const Ve=v.range(9,16);l.set([Ve*v.range(.03,.05),me/Ve,v.range(0,me),v.range(0,me)],x*4)}i.set([We,Re,At,zt],x*4),r.set([Ta,bt,kt,O],x*4),s.set([Dt,e.range(1.4,1.75)*.44],x*2);const _a=e.range(13,24),na=zt,ra=-At;for(let Ve=Math.ceil(-34/n);Ve*n<_a;Ve++){let Ge=-(Ve+Dt)*n;for(let Qe=0;Qe<4;Qe++)Ge=-(Ve+Dt+c(x,Ge))*n;const sa=d(x,Ge),Bt=w(x,Ge),ia=Math.hypot(1,Bt),la=(At+na*Bt)/ia,ca=(zt+ra*Bt)/ia,Tt=We+At*Ge+na*sa,_t=Re+zt*Ge+ra*sa,Ke=h.length/3,Wa=O+Ge/o;for(const[Qe,Wt]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const ua=Tt+la*Wt*.11+ca*Qe*.09,fa=_t+ca*Wt*.11-la*Qe*.09;h.push(ua,p(ua,fa)+.014,fa),f.push(Qe,Wt),A.push(Wa),b.push(Tt,p(Tt,_t)+.014,_t)}y.push(Ke,Ke+1,Ke+2,Ke,Ke+2,Ke+3)}x%3===2&&await m.yield()}const G={value:0},E=Xa(),I=new a.InstancedBufferGeometry;I.index=E.index;for(const x of["position","normal","color","aPart"])I.setAttribute(x,E.getAttribute(x));I.setAttribute("aTrack",new a.InstancedBufferAttribute(i,4)),I.setAttribute("aPlane",new a.InstancedBufferAttribute(r,4)),I.setAttribute("aMisc",new a.InstancedBufferAttribute(s,2)),I.setAttribute("aWand",new a.InstancedBufferAttribute(l,4)),I.instanceCount=t,I.boundingSphere=new a.Sphere(new a.Vector3,1e5);const oe=`
        attribute vec4 aTrack, aPlane, aWand; attribute vec2 aMisc;
        uniform float uU;
        float hopS(){ return ${o.toFixed(1)} * (uU - aPlane.w); }
        float hopWarp(float s){ return 0.16 * sin(2.3 * s + aWand.z * 3.1) + 0.08 * sin(1.13 * s + aWand.w); }
        float hopPhase(float s){ return (s + 400.) / ${n.toFixed(2)} + aMisc.x + hopWarp(s); }
        float hopLanding(float n){ float s = (n - aMisc.x) * ${n.toFixed(2)} - 400.; for (int k = 0; k < 4; k++) s = (n - aMisc.x - hopWarp(s)) * ${n.toFixed(2)} - 400.; return s; }   // where phase n falls
        float hopOff(float s){ return aWand.x * (sin(aWand.y * s + aWand.z) - sin(aWand.z)) + 0.3 * aWand.x * (sin(2.7 * aWand.y * s + aWand.w) - sin(aWand.w)); }
        float hopSlope(float s){ return aWand.x * aWand.y * cos(aWand.y * s + aWand.z) + 0.81 * aWand.x * aWand.y * cos(2.7 * aWand.y * s + aWand.w); }
        vec3 hopGround(float s){ vec2 q = aTrack.xy + aTrack.zw * s + vec2(aTrack.w, -aTrack.z) * hopOff(s); return vec3(q.x, aPlane.x + aPlane.y * (q.x - aTrack.x) + aPlane.z * (q.y - aTrack.y), q.y); }`,de=new a.ShaderMaterial({fog:!0,side:a.DoubleSide,uniforms:Object.assign(ze(),{uU:G,uTime:q,uSkyUp:u.uSkyUp,uSkyLow:u.uSkyLow,uRakeDir:u.uRakeDir,uRakeCol:u.uRakeCol,uLavaLit:u.uLavaLit}),vertexShader:`
          attribute vec3 color; attribute vec2 aPart;
          uniform float uTime;
          varying vec3 vCol; varying vec3 vN;
          #include <common>
          #include <fog_pars_vertex>
          ${oe}
          vec2 rot(vec2 v, float a){ float c = cos(a), s = sin(a); return vec2(v.x * c - v.y * s, v.x * s + v.y * c); }
          void main(){
            float s = hopS(), ph = hopPhase(s), f = fract(ph);
            vec3 p = position, n = normal;
            float part = aPart.x;
            if (part > 0.5 && part < 1.5) { p.yz -= vec2(0.04, -0.012); p.yz = rot(p.yz, -1.0 * sin(6.2832 * f) - 0.25); p.yz += vec2(0.04, -0.012); }   // hind foot: kicks back, tucks, reaches
            if (part > 1.5 && part < 2.5) { p.y += aPart.y * aPart.y * 0.045 * sin(6.2832 * f + 1.2); p.x += aPart.y * 0.012 * sin(uTime * 3. + aMisc.x * 40.); } // tail counter-swings
            if (part > 2.5 && part < 3.5) { p.z -= (p.y - 0.09) * 0.5 * (0.5 + 0.5 * sin(6.2832 * f)); }                                                      // ears lay back in the leap
            float pitch = 0.42 * cos(3.1416 * f);                                    // nose up at take-off, down into the landing
            p.yz -= vec2(0.05, 0.); p.yz = rot(p.yz, pitch); n.yz = rot(n.yz, pitch); p.yz += vec2(0.05, 0.);
            p.y *= 1. - 0.18 * (1. - smoothstep(0., 0.14, f)) ;                      // squash on landing
            vec3 g = hopGround(s);
            // (k1c, thin-line rule, as its landings have) the maker of a trail keeps about two pixels at range: beyond 15 m it is drawn
            // larger, up to three times at 46 m, so the head of every fresh trail has its animal
            float grow = clamp(length(cameraPosition - g) * 0.065, 1., 3.);
            p *= aMisc.y * grow;
            vec2 hd = normalize(aTrack.zw + vec2(aTrack.w, -aTrack.z) * hopSlope(s));
            vec3 fw = vec3(hd.x, 0., hd.y), rt = vec3(hd.y, 0., -hd.x);
            vec3 w = g + rt * p.x + vec3(0., p.y + 0.15 * grow * 4. * f * (1. - f), 0.) + fw * p.z;
            vN = normalize(rt * n.x + vec3(0., n.y, 0.) + fw * n.z); vCol = color;
            vec4 mvPosition = viewMatrix * vec4(w, 1.);
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          uniform vec3 uSkyUp, uSkyLow, uRakeDir, uRakeCol, uLavaLit;
          varying vec3 vCol; varying vec3 vN;
          #include <common>
          #include <fog_pars_fragment>
          void main(){
            vec3 n = normalize(vN);
            vec3 col = vCol * (mix(uSkyLow, uSkyUp, n.y * 0.5 + 0.5) * 1.45 + uRakeCol * 2.6 * max(dot(n, uRakeDir), 0.));
            col += vCol * uLavaLit * 0.75 * max(dot(n, vec3(-0.5, 0.1, 0.86)), 0.);     // the bay's fire, from behind and below
            gl_FragColor = vec4(col, 1.);
            #include <fog_fragment>
          }`}),Q=new a.Mesh(I,de);Q.frustumCulled=!1,Q.name="hoppers",U.add(Q),It.push(E);const J=new a.BufferGeometry;J.setAttribute("position",new a.Float32BufferAttribute(h,3)),J.setAttribute("uv",new a.Float32BufferAttribute(f,2)),J.setAttribute("aRev",new a.Float32BufferAttribute(A,1)),J.setAttribute("aCen",new a.Float32BufferAttribute(b,3)),J.setIndex(y);const te=new a.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,side:a.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:Object.assign(ze(),{uU:G,uSand:{value:ht},uSkyUp:u.uSkyUp,uSkyLow:u.uSkyLow}),vertexShader:`
          attribute float aRev; attribute vec3 aCen; uniform float uU;
          varying vec2 vUv; varying float vShow, vD;
          #include <common>
          #include <fog_pars_vertex>
          void main(){
            vUv = uv; vShow = step(aRev, uU) * (0.55 + 0.45 * (1. - smoothstep(0., 0.12, uU - aRev)));
            float dC = length(cameraPosition - aCen);
            float grow = clamp(dC * 0.0065 / 0.1, 1., 3.);                  // (thin-line rule) a landing keeps about a pixel and a half at range
            vec4 mvPosition = viewMatrix * vec4(aCen + (position - aCen) * grow, 1.);
            vD = -mvPosition.z;
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          uniform vec3 uSand, uSkyUp, uSkyLow;
          varying vec2 vUv; varying float vShow, vD;
          #include <common>
          #include <fog_pars_fragment>
          void main(){
            vec2 q = vec2(abs(vUv.x) - 0.27, vUv.y - 0.3);
            float d = length(q / vec2(0.19, 0.3));
            float pit = 1. - smoothstep(0.55, 1., d);
            float rim = (1. - smoothstep(0.25, 1., length(vec2(vUv.x, vUv.y + 0.4) / vec2(0.85, 0.5)))) * (1. - pit);
            float a = max(pit * 0.92, rim * 0.72) * vShow * (1. - smoothstep(45., 90., vD));
            vec3 col = mix(uSand * uSkyUp * 1.55, uSand * uSkyLow * 0.14, pit);
            gl_FragColor = vec4(col, a);
            #include <fog_fragment>
          }`}),ne=new a.Mesh(J,te);ne.name="hopper-trails",ne.renderOrder=1,U.add(ne);const X=vt(),Pe=(x,O)=>{const T=new Float32Array(x.length*2);return T.set(x),T.set(x,x.length),new a.InstancedBufferAttribute(T,O)};X.setAttribute("aTrack",Pe(i,4)),X.setAttribute("aPlane",Pe(r,4)),X.setAttribute("aMisc",Pe(s,2)),X.setAttribute("aWand",Pe(l,4));const rt=new Float32Array(t*2);rt.fill(1,t),X.setAttribute("aK",new a.InstancedBufferAttribute(rt,1)),X.instanceCount=t*2;const St=new a.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,uniforms:Object.assign(ze(),{uU:G,uSand:{value:tt},uSkyUp:u.uSkyUp}),vertexShader:`
          attribute float aK;
          varying vec2 vUv; varying float vA;
          #include <common>
          #include <fog_pars_vertex>
          ${oe}
          void main(){
            float s = hopS(), ph = hopPhase(s), n = floor(ph) - aK, age = ph - n;
            vec3 g = hopGround(hopLanding(n));
            float size = 0.05 + 0.055 * age;                                   // (polish k1) the brief's puff: 0.2 m across when it is fullest
            vUv = vec2(position.x * 2. - 1., position.y); vA = (1. - age * 0.5) * (1. - age * 0.5) * smoothstep(0., 0.1, age);
            vec4 mvPosition = viewMatrix * vec4(g + vec3(0., 0.02 + 0.05 * age, 0.), 1.);
            mvPosition.xy += vUv * size;
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          uniform vec3 uSand, uSkyUp;
          varying vec2 vUv; varying float vA;
          #include <common>
          #include <fog_pars_fragment>
          void main(){
            float r = dot(vUv, vUv), a = max(1. - r, 0.); a *= a;
            gl_FragColor = vec4(uSand * uSkyUp * 1.3, a * vA * 0.6);
            #include <fog_fragment>
          }`}),_e=new a.Mesh(X,St);_e.frustumCulled=!1,_e.renderOrder=3,_e.name="hopper-puffs",U.add(_e),ye.push((x,O,T,V)=>{G.value=V})}await m.yield();const ga=e=>new a.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,side:a.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1,uniforms:Object.assign(ze(),{uTime:q,uFront:{value:-50},uShore:{value:e.shore},uScroll:{value:e.scroll},uRaft:{value:e.raft?1:0},uPale:{value:ht.clone().lerp(tt,.5)},uSkyUp:u.uSkyUp,uSkyLow:u.uSkyLow,uLavaLit:u.uLavaLit,uLavaGain:u.uLavaGain,uRakeCol:u.uRakeCol,uSunCol:u.uSunCol,uSunY:u.uSunY}),vertexShader:`
        attribute vec2 aSV; attribute float aW;
        varying vec2 vSV; varying float vW, vY, vD;
        #include <common>
        #include <fog_pars_vertex>
        void main(){
          vSV = aSV; vW = aW; vY = position.y;
          vec4 mvPosition = viewMatrix * vec4(position, 1.);
          vD = -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        uniform float uTime, uFront, uShore, uScroll, uLavaGain, uRaft, uSunY; uniform vec3 uPale, uSkyUp, uSkyLow, uLavaLit, uRakeCol, uSunCol;
        varying vec2 vSV; varying float vW, vY, vD;
        #include <common>
        #include <fog_pars_fragment>
        ${Ne}
        void main(){
          float s = vSV.x, v = vSV.y, x = v * vW;
          float flow = s - uTime * uScroll;
          float onLava = smoothstep(uShore - 1., uShore + 5., s) * uRaft;
          // the toe: rounded lobes rolling ahead of the sheet
          float lobe = abs(sin(x * 0.19 + wn2(vec2(x * 0.07, 3.)) * 4.));
          float front = uFront - lobe * 9. - wn2(vec2(x * 0.4, 4.)) * 3.;
          float behind = 1. - smoothstep(front - 1.5, front, s);
          float side = 1. - smoothstep(0.3 + 0.3 * wn2(vec2(s * 0.05, 9.)), 1., abs(v));
          // the moving sand: soft threads of grains and slow surges, no hard edges
          float thread = wn2(vec2(x * 6.5 + wn2(vec2(x * 0.7, flow * 0.1)) * 1.5, flow * 0.11));     // threads of grains a hand wide
          float band = wfbm(vec2(x * 1.6, flow * 0.07));
          float wv = 0.5 + 0.5 * sin(flow * 1.35 + wfbm(vec2(x * 0.22, flow * 0.07)) * 8.);            // roll waves 4-5 m apart, bowed and broken
          // (polish k1) each surge is a wedge of sliding sand: it thickens and pales toward its nose, which is a sharp lobed front lying
          // across the fall line, with the face in its shade just below it (even soft bands read as pale smudges on the wall)
          float tvS = fract((flow * 1.35 + wfbm(vec2(x * 0.22, flow * 0.07)) * 8.) / 6.2832 + 0.35 * wn2(vec2(x * 0.45, 7.)));
          float crest = tvS * tvS * (1. - smoothstep(0.93, 0.99, tvS)), trough = (1. - smoothstep(0., 0.09, tvS)) * 1.2;
          float spark = smoothstep(0.86, 0.97, wn2(vec2(x * 9., flow * 2.6)));
          float lip = smoothstep(front - 7., front - 0.5, s) * behind;
          float nearF = 1. - smoothstep(0.75, 1., abs(v));
          float fine = sin(flow * 10.5 + x * 0.9 + band * 9.) * (1. - smoothstep(5., 26., vD));           // small ripples riding the sheet, close to the eye
          float tone = 0.98 + 0.12 * (thread - 0.5) + 0.2 * (band - 0.5) + 0.55 * crest - 0.3 * trough + 0.25 * spark + 0.05 * fine + 0.22 * lip - 0.16 * (1. - nearF);
          // out on the skin the sheet rides away as a raft and breaks into floes
          float far = smoothstep(uShore + 20., uShore + 300., s);
          float fl = wfbm(vec2(x * 0.045 + uTime * 0.01, (s - uTime * 0.6) * 0.045));
          float floe = smoothstep(0.34 + 0.2 * far, 0.39 + 0.2 * far, fl);
          float crk = wfbm(vec2(x * 0.11 + 7., (s - uTime * 0.6) * 0.11));
          floe *= smoothstep(0.02, 0.085 + 0.06 * far, abs(crk - 0.5)) * smoothstep(0.015, 0.07, abs(wfbm(vec2(x * 0.05 + 31., (s - uTime * 0.6) * 0.05 + 9.)) - 0.5));                   // cracks open as it rides away
          // on the face the sheet pours in separate tongues a few metres wide, the face showing between them
          float finger = mix(smoothstep(0.42, 0.7, wn2(vec2(x * 0.13 + 2., s * 0.012)) + 0.25 * lip), 1., uRaft);
          float faceK = 1. - onLava;
          float a = behind * side * smoothstep(0., 5., s) * mix(finger * (0.2 + 0.8 * crest + 0.45 * lip) + 0.5 * trough * finger, floe * 0.95, onLava);   // (polish k1: the sheet's body is a breath over the face; its surge noses and their shade are the picture. As one pale sheet it lay on the wall as a pane with an outline)
          a *= mix(smoothstep(0.15, 1.1, vY), 1., uRaft);
          float hA = max(vY, 0.);
          // lit exactly like the slip face it rides on (sky, the low rake from the east, first sun on the heights, lava from below)
                    vec3 light = mix(uSkyLow, uSkyUp, 0.92) * (1. + 0.7 * onLava) * mix(vec3(1.), vec3(0.66, 0.78, 1.06), faceK) + (uRakeCol * 0.67 + uSunCol * 0.78 * smoothstep(uSunY, uSunY + 7., vY)) * faceK + uLavaLit * (exp(-hA / 13.) * 0.8 + exp(-hA / 2.4) * 0.5) * uLavaGain * (1. - 0.45 * onLava);
          vec3 col = uPale * tone * light * mix(1., 1.6 * (0.5 + 0.5 * smoothstep(0.44 + 0.3 * far, 0.58 + 0.3 * far, fl)), onLava);
          gl_FragColor = vec4(col, a);
          #include <fog_fragment>
        }`});async function Ht(e,t,n,o,i,r){const s=[],l=[],v=[],d=[],w=[],c=[],h=[];let f=0,A=0,y=0,b=1e9;for(let g=0;g<=e;g++){const[H,K,G,E]=n(g/e,0);g&&(f+=Math.hypot(H-A,K-y)),A=H,y=K,E&&b>1e8&&(b=f);for(let I=0;I<=t;I++){const oe=I/t*2-1,[de,Q]=n(g/e,oe),J=Math.max(p(de,Q)+.2,k.levelAt(de,Q)+(r.raft?.75:.12));if(s.push(de,J,Q),l.push(f,oe),v.push(G),g<e&&I<t){const te=g*(t+1)+I,ne=te+t+1;d.push(te,ne,te+1,te+1,ne,ne+1)}}g%12===11&&await m.yield()}for(let g=0;g<o;g++){const H=Math.pow(i(),.8)*(r.dustTo||1),K=i.range(-.8,.8),[G,E]=n(H,K),[I,oe]=n(Math.min(1,H+.01),K);let de=I-G,Q=oe-E;const J=Math.hypot(de,Q)||1;de/=J,Q/=J;const te=Math.max(p(G,E),k.levelAt(G,E)+.6),ne=Math.max(p(G+de*2,E+Q*2),k.levelAt(G,E)+.6);w.push(G,te,E),c.push(de,(ne-te)/2,Q),h.push(H*1,i(),i.range(.7,1.5),0)}const P=f;for(let g=0;g<o;g++)h[g*4]*=P;const D=new a.BufferGeometry;D.setAttribute("position",new a.Float32BufferAttribute(s,3)),D.setAttribute("aSV",new a.Float32BufferAttribute(l,2)),D.setAttribute("aW",new a.Float32BufferAttribute(v,1)),D.setIndex(d);const z=ga({shore:Math.min(b,P+50),scroll:r.scroll,raft:r.raft}),M=new a.Mesh(D,z);return M.renderOrder=1,M.name=r.name,U.add(M),{mesh:M,front:z.uniforms.uFront,total:P,shore:b,dP:w,dD:c,dS:h}}const ya=(e,t,n,o,i,r)=>[e-o*i*r,t+n*i*r],at=new a.Vector3,Ya=new a.Vector3,He=Z.marks,Ee=new a.Vector2(He.slide.x-He.lip.x,He.slide.z-He.lip.z),Et=Ee.length()+26;Ee.normalize();const Xt=await Ht(64,12,(e,t)=>{const n=21+15*B(0,.8,e),o=He.lip.x+2.8+Ee.x*Et*e,i=He.lip.z+Ee.y*Et*e,[r,s]=ya(o,i,Ee.x,Ee.y,t,n);return[Math.max(r,F.crestX(s)+.9),s,n,p(o,i)<.2]},Math.round(480*fe),ae.fork("slideA"),{name:"avalanche",scroll:5.5,dustTo:.9});await m.yield();const xa=-108,Ft=96,pt=Fe?await Ht(60,44,(e,t)=>{const n=xa+t*Ft,o=F.crestX(n)+1.2,i=F.shore(o+150,n,o+12,n,0)[0],r=e<.45?C(o,i,e/.45):i+(e-.45)/.55*120,s=Math.max(0,(e-.45)/.55);return[r,n-110*B(.06,.4,s)-40*s+.3*t*Ft*s,Ft,e>=.45]},Math.round(520*fe),ae.fork("slideB"),{name:"slip-face-slide",scroll:7,dustTo:.45,raft:!0}):null;await m.yield();{const e=[Xt,pt].filter(Boolean),t=e.reduce((c,h)=>c+h.dS.length/4,0),n=new Float32Array(t*3),o=new Float32Array(t*3),i=new Float32Array(t*4);let r=0;e.forEach((c,h)=>{n.set(c.dP,r*3),o.set(c.dD,r*3),i.set(c.dS,r*4);for(let f=0;f<c.dS.length/4;f++)i[(r+f)*4+3]=h;r+=c.dS.length/4});const s=vt();s.setAttribute("aP0",new a.InstancedBufferAttribute(n,3)),s.setAttribute("aDir",new a.InstancedBufferAttribute(o,3)),s.setAttribute("aS",new a.InstancedBufferAttribute(i,4)),s.instanceCount=t;const l=new a.Vector2(-50,-50),v=W*L.length,d=new a.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,uniforms:Object.assign(ze(),{uTime:q,uFronts:{value:l},uPale:{value:tt},uSkyUp:u.uSkyUp,uLavaLit:u.uLavaLit,uLavaGain:u.uLavaGain}),vertexShader:`
          attribute vec3 aP0, aDir; attribute vec4 aS;
          uniform float uTime; uniform vec2 uFronts;
          varying vec2 vUv; varying float vA, vS; varying vec3 vCol;
          uniform vec3 uPale, uSkyUp, uLavaLit; uniform float uLavaGain;
          #include <common>
          #include <fog_pars_vertex>
          void main(){
            float big = aS.w, front = mix(uFronts.x, uFronts.y, big);
            float act = smoothstep(aS.x - 6., aS.x + 5., front) * (1. - smoothstep(aS.x + mix(45., 400., big), aS.x + mix(110., 900., big), front));
            float life = fract(uTime * (0.45 - 0.2 * big) * aS.z + aS.y * 9.);
            float sc = aS.z * (1. + 2.4 * big);
            vec3 c = aP0 + aDir * life * 6. * sc + vec3(0., (0.25 + 2.3 * life * life) * sc, 0.);
            float size = (0.9 + 2.8 * life) * sc;
            vUv = vec2(position.x * 2. - 1., position.y);
            vec4 mvPosition = viewMatrix * vec4(c, 1.);
            float dist = -mvPosition.z;
            vA = act * sin(3.1416 * life) * smoothstep(2., 9., dist) * mix(0.05, 0.13, big);
            mvPosition.xy += vUv * size * vec2(1.5, 0.75);
            float hA = max(c.y, 0.);
            vCol = uPale * (uSkyUp * 0.7 + uLavaLit * (exp(-hA / 14.) * 0.75 + 0.06) * uLavaGain);
            vS = aS.y * 31.;
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          varying vec2 vUv; varying float vA, vS; varying vec3 vCol;
          #include <common>
          #include <fog_pars_fragment>
          ${Ne}
          void main(){
            float r = dot(vUv, vUv), a = max(1. - r, 0.);
            a = a * a * (0.55 + 0.6 * wn2(vUv * 1.7 + vS));
            gl_FragColor = vec4(vCol * (0.85 + 0.3 * vUv.y), clamp(a * vA, 0., 1.));
            #include <fog_fragment>
          }`}),w=new a.Mesh(s,d);w.frustumCulled=!1,w.renderOrder=3,w.name="slide-dust",U.add(w),ye.push((c,h,f,A)=>{const y=(A*L.length-(v-45))*1.5;if(Xt.front.value=y,l.x=y,pt){const b=it(A,[W-.05,W+.005,W+.06,ce+.05],[-20,62,168,pt.total+10]);pt.front.value=b,l.y=b}})}await m.yield();{const e=[],t=[],n=[],o=[];let i=0;const r=new a.Vector3;for(let h=190;h>=-236;h-=2.5,i++){const f=F.crestX(h),A=p(f-.3,h),y=B(-236,-205,h);if(e.push(f+.5,A-.25,h,f+1.6,A+3*y+.3,h),t.push(h,0,h,1),r.set(F.crestX(h-2.5)-F.crestX(h+2.5),p(F.crestX(h-2.5)-.3,h-2.5)-p(F.crestX(h+2.5)-.3,h+2.5),-5).normalize(),n.push(r.x,r.y,r.z,r.x,r.y,r.z),i){const b=(i-1)*2;o.push(b,b+1,b+2,b+1,b+3,b+2)}}const s=new a.BufferGeometry;s.setAttribute("position",new a.Float32BufferAttribute(e,3)),s.setAttribute("uv",new a.Float32BufferAttribute(t,2)),s.setAttribute("aAlong",new a.Float32BufferAttribute(n,3)),s.setIndex(o);const l=new a.Color(S.band),v=.2126*l.r+.7152*l.g+.0722*l.b,d=14,w=new a.ShaderMaterial({transparent:!0,depthWrite:!1,blending:a.NormalBlending,premultipliedAlpha:!0,side:a.DoubleSide,fog:!1,uniforms:{uTime:q,uLavaLit:u.uLavaLit,uGain:{value:(Y?.62:.65+.5*xe)*S.lava*.55},uDawn:{value:d*S.scatter*v},uDawnDir:{value:ke.sunDirection.clone().normalize()},uBandPow:{value:st},uSand:{value:tt.clone().lerp(ht,.4)},uSkyUp:u.uSkyUp},vertexShader:`
          attribute vec3 aAlong;
          uniform vec3 uDawnDir;
          varying vec2 vUv; varying float vD, vF, vS;
          void main(){
            vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.), mv = viewMatrix * wp; vD = length(mv.xyz);
            vec3 sight = (cameraPosition - wp.xyz) / max(length(cameraPosition - wp.xyz), 1e-3);
            vF = abs(dot(normalize(mat3(modelMatrix) * aAlong), sight));   // 1: seen along the crest's run, 0: square across it
            vS = 0.5 - 0.5 * dot(sight, uDawnDir);                         // the sky's own 'side': 1 looking through the veil straight at the dawn, 0 with the dawn behind us
            gl_Position = projectionMatrix * mv;
          }`,fragmentShader:`
          uniform float uTime, uGain, uDawn, uBandPow; uniform vec3 uLavaLit, uSand, uSkyUp;
          varying vec2 vUv; varying float vD, vF, vS;
          ${Ne}
          void main(){
            float v = clamp(vUv.y, 0., 1.), z = clamp(vUv.x, -236., 190.);
            float n = wn2(vec2(z * 0.21 + uTime * 0.5, v * 2.4 - uTime * 0.7)) * 0.6 + wn2(vec2(z * 0.05 - uTime * 0.08, 3.)) * 0.6;
            float top = 0.45 + 0.55 * clamp(wn2(vec2(z * 0.33 - uTime * 0.6, 7.)) * 0.6 + wn2(vec2(z * 0.9 - uTime * 0.9, 11.)) * 0.5, 0., 1.);   // how high the glow reaches here: 0.45 to 1 of the sheet
            float vv = clamp(v / top, 0., 1.);
            float a = (1. - vv) * (1. - vv) * smoothstep(0., 0.06, v) * (0.35 + 0.9 * n) * smoothstep(22., 70., clamp(vD, 0., 1e5));
            a *= (1. - smoothstep(0.55, 0.9, clamp(vF, 0., 1.))) * smoothstep(-236., -205., z) * (1. - smoothstep(150., 190., z));
            float o = clamp(a * 2., 0., 0.9);                                // how much of the sky behind it the sand hides
            gl_FragColor = vec4(uSand * uSkyUp * 0.62 * o + uLavaLit * a * (uGain + uDawn * pow(clamp(vS, 0., 1.), uBandPow)), o);
          }`}),c=new a.Mesh(s,w);c.name="crest-rim",c.renderOrder=2,U.add(c)}await m.yield();let mt=null;const Xe=[N,{x:_.twin.x,z:_.twin.z,yaw:Math.atan2(-.7666,-.6429)}];if(ie){mt=Rt(k.runner.mesh.geometry,["#C98B6B","#E2B58C","#2B3350","#121A33","#18110F","#F3C9A0","#FF6A1F"],u,{name:"runner2",pale:.16,hue:.01}),qt.push(mt.uniforms),U.add(mt.mesh);const e={},t={};Xe.push(t);const n=o=>p(t.x+Math.cos(t.yaw)*.118*o,t.z-Math.sin(t.yaw)*.118*o)-t.y;ye.push((o,i)=>{k.script.at(N.s+9,e);const r=B(.05,1.2,N.speed),s=e.yaw<0?e.yaw+me:e.yaw;t.x=e.x,t.z=e.z,t.y=p(e.x,e.z),t.yaw=C(Math.PI*.2,s,Math.max(r,B(1,12,N.s)))-(N.turn||0)*Math.PI*.38,t.speed=N.speed,t.phase=N.phase+.37,t.time=i+2.1,t.alert=N.alert||0,t.look=(1-r)*(N.s>1?.3:.35)*Math.sin(i*.7+1.3),t.groundL=n(1),t.groundR=n(-1),mt.pose(t)})}await m.yield();const Ye=va((Math.imul(Number(m.seed)|0,2654435761)^5369127)>>>0),he=Math.ceil((1-$)/5e-4),Yt=new Float32Array(he+1),Sa=new Float32Array(he+1),ba=new Float32Array(he+1),Me=new Float32Array(he+1),Ce=new Float32Array(he+1);for(let e=0;e<=he;e++){const t=$+(1-$)*e/he;L.pointAt(t,at),Yt[e]=t,Sa[e]=at.x,ba[e]=at.z,Me[e]=Be(at.x,at.z),Ce[e]=Pt(t),e%220===219&&await m.yield()}const ka=e=>{let t=0;for(;t<he&&Me[t]>e;)t++;return t},Zt=e=>{const t=ka(e);return t<=0||t>=he||Me[t-1]<=Me[t]?Ce[t]:C(Ce[t-1],Ce[t],(Me[t-1]-e)/(Me[t-1]-Me[t]))},wt=9,gt=2.5,Aa=wt*gt*.5,za=Be(_.twin.x,_.twin.z),$t=za+4,ot={name:"shore-watcher",lat:5.6,pale:.12,hue:.004,ph:.7,pos:new a.Vector3};ot.dd=Ct(ot.lat)-Ye.range(3,9);const Ma=12,Kt=.15,Qt=e=>e<0?-e:e>1?2-e:e,R=[];for(let e=0;e<3;e++)R.push({name:"spur-runner-"+"abc"[e],draw:Ye(),lat:(e%2?1:-1)*Ye.range(4.7,6.2),wph:Ye.range(0,me),pale:[.05,.2,.1][e],hue:[.006,-.008,.002][e],pos:new a.Vector3});R[0].start=Ct(R[0].lat)-Ye.range(3,9);{const e=R[0].start-Ma,t=$t+.09375*wt*gt,n=(e-t)/3,o=R[1].draw;R[0].pass=e-n*Qt(o+Kt*(2*R[0].draw-1)),R[1].pass=e-n*(1+o),R[2].pass=e-n*(2+Qt(o+Kt*(2*R[2].draw-1)))}await m.yield();const Ca=e=>1.6*B(0,.2,e)+(wt-1.6)*B(.6,1.6,e),yt=e=>{const t=r=>Math.max(0,Ca(r)-wt*B(e,e+gt,r)),n=Math.ceil((Math.min(e,40)+gt+.1)*60),o=new Float32Array(n+1),i=new Float32Array(n+1);for(let r=1;r<=n;r++){const s=t((r-.5)/60);o[r]=o[r-1]+s/60,i[r]=i[r-1]+s/60/Na(s)}return{N:n,S:o,PH:i,speed:t,sAt:r=>{const s=ue(r*60,0,n),l=Math.min(n-1,Math.floor(s));return C(o[l],o[l+1],s-l)}}},Jt=yt(40);let Le=Zt(R[0].pass);{const e=R[0].start-R[0].pass;let t=0;for(;t<30&&Jt.sAt(t)<e;)t+=1/120;Le-=t}let xt=0;for(;xt<he&&Ce[xt]<Le;)xt++;for(let e=1;e<3;e++)R[e].start=R[e].pass+Jt.sAt(Zt(R[e].pass)-Le);await m.yield();for(const e of R){let t=yt(40),n=40;{let w=0;for(;w<40&&e.start-t.sAt(w)>$t+Aa;)w+=1/60;n=w}t=yt(n);let o=xt;for(;o<he&&Me[o]>e.start-t.sAt(Ce[o]-Le);)o++;e.uAbeam=Yt[o],e.tDec=Math.min(Ce[o]-Le+.3,n),e.waits=Ce[o]-Le>n,e.tDec<n&&(t=yt(e.tDec));const{N:i,S:r,PH:s,speed:l}=t,v=w=>e.lat+.35*(Math.sin(w/7+e.wph)-Math.sin(e.wph));e.place=(w,c)=>{const h=ue(w*60,0,i),f=Math.min(i-1,Math.floor(h)),A=h-f,y=C(r[f],r[f+1],A),b=qe(e.start-y,v(y)),P=.05*Math.cos(y/7+e.wph),D=Math.atan2(Se[0]+De[0]*P,Se[1]+De[1]*P);return c.x=b[0],c.z=b[1],c.y=p(b[0],b[1]),c.s=y,c.phase=C(s[f],s[f+1],A),c.speed=l(ue(w,0,i/60)),c.yaw=D+Math.sign(e.lat)*.4*Math.PI*(1-B(0,.95,w)),c},e.st=e.place(0,{}),Xe.push(e.st),e.feet=[];const d={};for(let w=1,c=1;w<=i;w++)for(;s[w]>=c*.5;){const h=(c*.5-s[w-1])/Math.max(1e-6,s[w]-s[w-1]),f=(w-1+h)/60;e.place(f,d),e.feet.push({n:c,t:f,v:l(f),x:d.x,z:d.z,yaw:d.yaw}),c++}await m.yield()}const Ut=Ha(F,["#C98B6B","#E2B58C","#2B3350","#121A33","#18110F","#F3C9A0","#FF6A1F"],u,R.map(e=>e.feet),Ye);U.add(Ut.prints,Ut.puffs),await m.yield();for(const e of[...R,ot]){const t=Rt(k.runner.mesh.geometry,["#C98B6B","#E2B58C","#2B3350","#121A33","#18110F","#F3C9A0","#FF6A1F"],u,{name:e.name,pale:e.pale,hue:e.hue});t.uniforms.uLavaDir.value.set(-.25,-.7,.66).normalize(),t.uniforms.uLavaI.value=.55,U.add(t.mesh);const n=R.indexOf(e),o=n<0?e.st={}:e.st;n<0&&Xe.push(o);const i=r=>p(o.x+Math.cos(o.yaw)*.118*r,o.z-Math.sin(o.yaw)*.118*r)-o.y;if(n<0){const r=qe(e.dd,e.lat);o.x=r[0],o.z=r[1],o.y=p(r[0],r[1]),o.yaw=Math.atan2(.94,.342)+.35,o.speed=0,o.phase=e.ph,o.alert=0,e.pos.set(o.x,o.y+.8,o.z)}ye.push((r,s,l,v)=>{if(n>=0){const d=Math.max(0,Pt(v)-Le);e.place(d,o);const w=1-B(.1,1.5,o.speed);o.time=s+4.2+n*2.9,o.alert=B(0,.4,d),o.look=w*.3*Math.sin(s*.45+.8+n*2.1),Ut.set(n,o.phase,d),e.pos.set(o.x,o.y+.8,o.z)}else o.time=s+4.2+e.ph*7,o.look=.3*Math.sin(s*.45+.8+e.ph*5);o.groundL=i(1),o.groundR=i(-1),t.pose(o)}),await m.yield()}const nt=new a.Vector3,Ze=new a.Vector3,$e=new a.Vector3,Te=new a.Vector3,La=new a.Vector3,Pa={},Fa=[...R.map(e=>t=>e.place(t,Pa)),()=>ot.st,()=>_.twin],Ua=(e,t)=>{L.pointAt(t,nt),L.tangentAt(t,Ze).normalize();const n=Math.max(0,Pt(t)-Le);Te.copy(Ze);for(const r of Fa){const s=r(n);$e.set(s.x-nt.x,s.y+.8-nt.y,s.z-nt.z);const l=$e.dot(Ze),v=Math.max($e.length(),.001);Te.addScaledVector($e,4*B(60,12,l)*B(-1,3,l)/v)}Te.normalize();const o=ue(Te.dot(Ze),-1,1),i=Math.acos(o);if(i>1e-4){const r=38*Math.PI/180,s=i/r,l=s*s,v=l*l,d=i/Math.sqrt(Math.sqrt(Math.sqrt(1+v*v)));$e.copy(Te).addScaledVector(Ze,-o).normalize(),Te.copy(Ze).multiplyScalar(Math.cos(d)).addScaledVector($e,Math.sin(d))}return La.copy(nt).addScaledVector(Te,20)},Da=Mt(ot.dd+70),Ba=1-2*_.portalSeat.radius/L.length;await m.yield();{const e=_.lastPrint,t={x:e.x-5.2,z:e.z+6.4,yaw:Math.PI-.35,speed:0,phase:.3,alert:0};t.y=p(t.x,t.z);const n=Rt(k.runner.mesh.geometry,["#C98B6B","#E2B58C","#2B3350","#121A33","#18110F","#F3C9A0","#FF6A1F"],u,{name:"witness",pale:.1,hue:-.004});n.uniforms.uLavaDir.value.set(.72,-.6,-.3).normalize(),n.uniforms.uLavaI.value=.95,U.add(n.mesh),Xe.push(t);const o=i=>p(t.x+Math.cos(t.yaw)*.118*i,t.z-Math.sin(t.yaw)*.118*i)-t.y;t.groundL=o(1),t.groundR=o(-1),ye.push((i,r)=>{t.time=r+2.7,t.look=.22+.3*Math.sin(r*.5+2.1),n.pose(t)})}await m.yield();{const e=new a.PlaneGeometry(1,1).rotateX(-Math.PI/2),t=new a.ShaderMaterial({transparent:!0,depthWrite:!1,blending:a.MultiplyBlending,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3,vertexShader:`
          varying vec2 vQ;
          void main(){ vQ = position.xz * 2.; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,fragmentShader:`
          varying vec2 vQ;
          void main(){
            // a body's pool (round, under the hips and chest) and the long thin shade of neck and tail
            float body = 1. - smoothstep(0.1, 1., length((vQ - vec2(0., 0.08)) / vec2(0.95, 0.42)));
            float tail = 1. - smoothstep(0.2, 1., length(vQ / vec2(0.34, 1.)));
            float a = clamp(body * body * 0.62 + tail * tail * 0.3, 0., 0.7);
            gl_FragColor = vec4(mix(vec3(1.), vec3(0.3, 0.33, 0.48), a), 1.);
          }`}),n=new a.Vector3,o=new a.Vector3,i=new a.Vector3,r=new a.Matrix4,s=Xe.map((l,v)=>{const d=new a.Mesh(e,t);return d.name="shadow-"+v,d.renderOrder=2,d.frustumCulled=!1,d.scale.set(1.25,1,2.9),U.add(d),d});ye.push(()=>{for(let l=0;l<s.length;l++){const v=Xe[l],d=s[l];if(v.x!==v.x||v.yaw===void 0){d.position.set(0,-500,0);continue}F.normal(v.x,v.z,n),o.set(Math.sin(v.yaw),0,Math.cos(v.yaw)),i.crossVectors(n,o).normalize(),o.crossVectors(i,n),d.quaternion.setFromRotationMatrix(r.makeBasis(i,n,o)),d.position.set(v.x-o.x*.15,p(v.x,v.z)+.03,v.z-o.z*.15).addScaledVector(n,.02)}})}if(await m.yield(),et){const e=ae.fork("shrubs"),t=[],n=[],o=[],i=[],r=[],s=new a.Color("#6f8f76"),l=new a.Color("#a8bf9a"),v=new a.Color("#6a564c"),d=new a.Color,w=(z,M,g,H,K,G,E,I,oe)=>{const Q=t.length/3;let J=z,te=M,ne=g;for(let X=0;X<=4;X++){const Pe=X/4,rt=I*(1-.75*Pe)*(X%2?1.25:1),St=H,_e=K+Pe*.6,x=G,O=Math.hypot(St,_e,x);for(let T=0;T<4;T++){const V=T*Math.PI/2+oe,re=Math.cos(V),pe=Math.sin(V);t.push(J+re*rt,te,ne+pe*rt),n.push(re,.3,pe),d.copy(oe?s:v).lerp(oe?l:s,Pe),o.push(d.r,d.g,d.b),i.push(Math.max(0,te))}if(X<4){for(let T=0;T<4;T++){const V=Q+X*4+T,re=Q+X*4+(T+1)%4;r.push(V,V+4,re,re,V+4,re+4)}J+=St/O*E/4,te+=_e/O*E/4,ne+=x/O*E/4}if(oe<1&&X>0&&X<4)for(let T=0;T<2;T++){const V=e.range(0,me);w(J,te,ne,Math.cos(V)*.8+H*.5,.5,Math.sin(V)*.8+G*.5,E*.45,I*.6,oe+1)}}};for(let z=0;z<11;z++){const M=z/11*me+e.range(-.3,.3),g=e.range(.35,.95);w(0,0,0,Math.cos(M)*g,1,Math.sin(M)*g,e.range(.38,.62),.022,0)}const c=new a.BufferGeometry;c.setAttribute("position",new a.Float32BufferAttribute(t,3)),c.setAttribute("normal",new a.Float32BufferAttribute(n,3)),c.setAttribute("color",new a.Float32BufferAttribute(o,3)),c.setAttribute("aW",new a.Float32BufferAttribute(i,1)),c.setIndex(r);const h=new a.ShaderMaterial({fog:!0,side:a.DoubleSide,uniforms:Object.assign(ze(),{uTime:q,uWind:{value:xe},uSkyUp:u.uSkyUp,uSkyLow:u.uSkyLow,uRakeDir:u.uRakeDir,uRakeCol:u.uRakeCol}),vertexShader:`
          attribute vec3 color; attribute float aW; uniform float uTime, uWind;
          varying vec3 vCol; varying vec3 vN;
          #include <common>
          #include <fog_pars_vertex>
          void main(){
            vec4 w = instanceMatrix * vec4(position, 1.);
            float sw = aW * aW * (0.5 + uWind) * 0.22;
            w.x += sw * (0.6 + 0.4 * sin(uTime * 2.3 + w.z * 1.7 + w.x)) ; w.z += sw * 0.3 * sin(uTime * 1.7 + w.x * 2.1);
            vN = normalize(mat3(instanceMatrix) * normal); vCol = color;
            vec4 mvPosition = viewMatrix * w;
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          uniform vec3 uSkyUp, uSkyLow, uRakeDir, uRakeCol;
          varying vec3 vCol; varying vec3 vN;
          #include <common>
          #include <fog_pars_fragment>
          void main(){
            vec3 n = normalize(vN);
            vec3 col = vCol * (mix(uSkyLow, uSkyUp, n.y * 0.5 + 0.5) * 1.5 + uRakeCol * 2.5 * max(dot(n, uRakeDir), 0.));
            gl_FragColor = vec4(col, 1.);
            #include <fog_fragment>
          }`}),f=new a.InstancedMesh(c,h,20);f.name="scale-leaved-shrubs",f.frustumCulled=!1;const A=new a.Matrix4,y=new a.Quaternion,b=new a.Vector3,P=new a.Vector3,D=new a.Vector3(0,1,0);for(let z=0;z<20;z++){const M=e.range(0,me),g=Math.sqrt(e())*10,H=-98+Math.cos(M)*g*1.5,K=17+Math.sin(M)*g*.7+3,G=e.range(.95,1.7);P.set(H,p(H,K)-.03,K),y.setFromAxisAngle(D,e.range(0,me)),b.set(G,G*e.range(.85,1.15),G),f.setMatrixAt(z,A.compose(P,y,b))}U.add(f)}return await m.yield(),k.setProgress(0),k.update(0,0,null),await ke.prewarm(m.renderer,null,U),{scene:U,path:L,duration:Ue.duration,pace:ut,title:"The Sand Sea Drowns \xB7 134 million years ago",ride:"none",companion:"none",camera:{fov:62,near:.3,far:14e3,lookAhead:16,sway:.5,bank:.08,nearThrough:.3},pois:[{at:()=>jt,from:0,to:W-.012,weight:.9},{at:new a.Vector3(125,4,-300),from:W-.01,to:W+.1,weight:.85},{at:new a.Vector3(F.ISLETS[0].x+6,7,F.ISLETS[0].z),from:Ae-.062,to:Ae-.008,weight:.5},{at:_.tongueLip.clone().lerp(_.tongueFoot,.5).setY(12),from:Ae+.045,to:ce-.01,weight:.8},{at:_.lastPrint.clone().setY(.3),from:ce-.005,to:$-.012,weight:.62},{at:_.tongueLip.clone().lerp(_.tongueFoot,.6).setY(7),from:$-.012,to:$+.045,weight:.78},{at:_.whaleback.clone().setY(1.5),from:$+.045,to:$+.1,weight:.4},{at:Ua,from:Da,to:Ba,weight:.9,fade:.15}],portal:{shape:"circle",radius:7,color:"#CFE0FF",glow:.42,revealDistance:260},post:{exposure:S.exposure,bloom:{strength:.7,radius:.6,threshold:1},grade:{saturation:1.05,contrast:1.1,tint:"#fff4ea",shadowTint:"#060a1c",vignette:.25,grain:.03}},update(e,t,n,o){q.value=t;const i=ve.heroProgress(o),r=ve.runTime(o);k.setProgress(i),k.setRunTime(r),k.update(e,t,n),k.script.stateAt(r,N),Ot.set(N.x,N.y+.9,N.z);{const s=B(.035,.07,o)*(1-B(.1,.15,o));jt.set(N.x,N.y+.9+.5*s,N.z)}{const s=k.script.sJoin,l=1-B(4,40,N.s),v=1-B(s-40,s-4,N.s);for(const d of qt)d.uLavaDir.value.set(C(.62,C(-.85,-.25,l),v),C(-.78,-.42,v),C(.05,C(.3,.83,l),v)).normalize(),d.uLavaI.value=C(.6,C(.5,1.1,l),v)}u.uRakeCol.value.copy(be).multiplyScalar(1+.35*o+1.2*B(je-.08,je+.04,o)),n.getWorldPosition(wa),n.getWorldDirection(ft);{const s=Math.max(ft.x,0)/Math.max(Math.hypot(ft.x,ft.z),.001);U.fog.color.copy(j).lerp(ee,.85*s*Math.sqrt(s))}m.renderer.getDrawingBufferSize(ma),ke.update(e,t,n);for(let s=0;s<ye.length;s++)ye[s](e,t,n,o,i)},dispose(){ke.dispose();for(const e of It)e.dispose()}}}};function Xa(){const m=[],ae=[],we=[],fe=[],Je=[],ge=new a.Color("#B98A6E"),Ie=new a.Color("#F3C9A0"),se=new a.Color("#2a1c1a"),S=new a.Color("#c99a8c"),Y=new a.Color;function ie(j,ee,q,k,_,u,p={}){const F=p.lon||7,be=p.lat||5,st=m.length/3,ke=p.pitch||0,Z=Math.cos(ke),L=Math.sin(ke);for(let ve=0;ve<=be;ve++){const le=ve/be,W=le*Math.PI,ce=Math.cos(W),$=Math.sin(W),it=1-(p.taper||0)*ce*.5;for(let Oe=0;Oe<=F;Oe++){const Ae=Oe/F*me,je=Math.cos(Ae)*$,Ue=Math.sin(Ae)*$;let lt=je*k*it,Se=Ue*_*it,De=ce*u;const qe=Se*Z-De*L,ct=Se*L+De*Z;m.push(j+lt,ee+qe,q+ct);const Be=new a.Vector3(je/k,Ue*Z/_-ce*L/u,Ue*L/_+ce*Z/u).normalize();ae.push(Be.x,Be.y,Be.z),p.color?Y.copy(p.color):Y.copy(Ie).lerp(ge,B(-.35,.3,Be.y)).multiplyScalar(.9+.1*Math.sin(Oe*2.1+ve*1.3)),we.push(Y.r,Y.g,Y.b),fe.push(p.part||0,p.weight!=null?p.weight:p.part===2?ue((q-ct*1-.05)/-.14,0,1):1)}}for(let ve=0;ve<be;ve++)for(let le=0;le<F;le++){const W=st+ve*(F+1)+le,ce=W+F+1;Je.push(W,W+1,ce,W+1,ce+1,ce)}}ie(0,.058,-.004,.031,.034,.056,{taper:.35,lon:8,lat:6,pitch:-.18}),ie(0,.079,.058,.02,.021,.03,{taper:.75,part:4,lon:8,lat:5,pitch:.12}),ie(0,.071,.088,.005,.005,.005,{color:S,part:4,lon:4,lat:3});for(const j of[-1,1])ie(j*.016,.111,.044,.013,.024,.0045,{part:3,lon:6,lat:4,pitch:-.35,color:(j<0,ge)}),ie(j*.016,.111,.0475,.008,.017,.002,{part:3,lon:5,lat:3,pitch:-.35,color:S}),ie(j*.0185,.084,.066,.0062,.0062,.0062,{color:se,part:4,lon:5,lat:3}),ie(j*.027,.045,-.012,.013,.025,.024,{part:0,lon:6,lat:4}),ie(j*.023,.009,.012,.007,.006,.036,{part:1,lon:5,lat:4,color:Ie}),ie(j*.012,.041,.047,.004,.012,.004,{part:0,lon:4,lat:3,color:Ie,pitch:.5});const et=7,Fe=5,xe=m.length/3;for(let j=0;j<=et;j++){const ee=j/et,q=-.052-ee*.135,k=.05+ee*ee*.05,_=C(.0055,.003,ee);for(let u=0;u<=Fe;u++){const p=u/Fe*me,F=Math.cos(p),be=Math.sin(p);m.push(F*_,k+be*_,q),ae.push(F,be,0),Y.copy(ge).lerp(se,B(.7,.9,ee)),we.push(Y.r,Y.g,Y.b),fe.push(2,ee)}}for(let j=0;j<et;j++)for(let ee=0;ee<Fe;ee++){const q=xe+j*(Fe+1)+ee,k=q+Fe+1;Je.push(q,k,q+1,q+1,k,k+1)}ie(0,.101,-.195,.008,.009,.021,{color:se,part:2,weight:1,lon:5,lat:4,pitch:-.5});const U=new a.BufferGeometry;return U.setAttribute("position",new a.Float32BufferAttribute(m,3)),U.setAttribute("normal",new a.Float32BufferAttribute(ae,3)),U.setAttribute("color",new a.Float32BufferAttribute(we,3)),U.setAttribute("aPart",new a.Float32BufferAttribute(fe,2)),U.setIndex(Je),U}export{Qa as default};
