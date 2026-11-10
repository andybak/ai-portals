import*as n from"three";import{makePath as Pt,clamp as H,lerp as ue,smoothstep as he}from"../kit/core.js";import{mergeGeometries as Wt}from"three/addons/utils/BufferGeometryUtils.js";import{buildHero as Tt,makeStyle as Bt,PITCH as ve}from"../parts/frieze-without-end.js";const Z=1e3;var Nt={id:"frieze-without-end",name:"The Frieze Without End",category:"bizarre",weirdness:.8,media:["air","open"],async build(c){const{renderer:nt}=c,C=H(c.quality?.detail??1,.6,1),ie=c.vary||{},_=H(ie.density??1,.7,1.3),W=new n.Scene,pe=c.rng.fork("frieze-world"),_e=ie.hour==="day"?"day":ie.hour==="night"?"night":"afternoon",Ue=pe(),it=pe(),rt=pe(),lt=Ue<.66?"lapis":Ue<.84?"carnelian":"serpentine",U=["still","rain","breeze"][Math.floor(it*7.3)%3],ct=!!ie.rare,X={afternoon:{palette:["#7E6B55","#A68E6E","#D6C6A5","#E4D8BD","#1F3C88","#D1A640","#C9D8D6"],sun:12,cream:"#EDE4CF",glow:"#F8F2E2"},day:{palette:["#7F7060","#AA9A82","#DAD0BA","#EAE4D2","#1F3C88","#D1A640","#C2D6DE"],sun:30,cream:"#EEEBE0",glow:"#F7F6F0"},night:{palette:["#2C3446","#46536B","#6E7F99","#8799B2","#182A63","#9A854E","#1C2740"],sun:12,cream:"#A9BAD6",haze:"#3A4863",glow:"#5A6E90"}}[_e],m=Bt(c,{palette:X.palette,stone:lt,sunElevation:X.sun,cream:X.cream,haze:X.haze,glow:X.glow,night:_e==="night",weather:U,ghost:ct,creature:rt}),L=await Tt(c,{style:m,detail:C,repeats:3,nearPatch:2,sky:!0,plain:!0});L.object.position.set(0,0,Z),W.add(L.object),await c.yield();const Y=L.anchors,d=Y.figures,I=m.uniforms,je=m.materials,me=e=>new n.Vector3(e.x,e.y,e.z+Z),B=me(Y.portalSeat.position),Lt=me(Y.slip[1]),qe=me(Y.slip[0]),we=qe.x+61,ye=qe.z-626,dt=[[-205,96,-80],[-196,86,-35],[-187,84.5,10],[-190,89,50],[-212,94,90],[-236,100,128],[-232,104,162],[-205,106,184],[-160,106,196],[-110,105,203],[-65,103,212],[-28,102,225],[-8,100,255],[-20,98,290],[-50,96,318],[-86.5,93,345],[-101,88,385],[-94.8,77,420],[-75,62,452],[-97,54,492],[-90+we,44,544+ye],[-63+we,31,586+ye],[-66.5+we,34,628+ye],[-118,52,672],[-182,58,702],[-232,50,768],[-270,52,822],[-264,78,870],[-281,104,870],[-304,124,846],[-348,157,868],[-363,178,908],[-357,184,946],[-326,134,982],[-290,86,1e3],[B.x-78,B.y,B.z],[B.x-39,B.y,B.z],[B.x,B.y,B.z]],ge=Pt(dt),ft=e=>1-(1-e)*1764.4/1594.4;await c.yield();const re=c.rng.fork("frieze-plates"),xe=U==="rain"?.45:1,ut=m.makePlates(Math.round(700*C*_*xe),-560,-272,-1150,330,re,1,.22),ht=m.makePlates(Math.round(240*C*_*xe),308,520,-1150,200,re,1,.22);L.object.add(ut,ht);const It=[[26,-345,-262,-1090,-740],[12,-306,-262,-1045,-935],[9,-205,-176,-1150,-965]].map(([e,o,s,t,a])=>{const r=m.makePlates(Math.max(6,Math.round(e*C*_*xe)),o,s,t,a,re,1,.3,!0),i=r.geometry.attributes.aPlate.array;for(let p=2;p<i.length;p+=4)i[p]=7.5+(i[p]-2.2)*1.3;const l=m.makePlateShade(r,!0),v=m.makePlateShade(r);return l.renderOrder=-.3,v.renderOrder=-.2,L.object.add(l,v,r),r});await c.yield();const be=Math.round(22*C*(U==="breeze"?1.2:1)),R=new n.InstancedBufferGeometry,$e=new n.IcosahedronGeometry(1,2);{const e=$e.attributes.position,o=new Map;for(let a=0;a<e.count;a++){const r=[e.getX(a),e.getY(a),e.getZ(a)].map(l=>l.toFixed(3)).join(",");o.has(r)||o.set(r,.955+.09*Math.sin(e.getX(a)*2.3+.7)*Math.sin(e.getZ(a)*1.9+1));const i=o.get(r);e.setXYZ(a,e.getX(a)*i,e.getY(a)*i*.8,e.getZ(a)*i)}const s=$e.attributes.normal;for(let a=0;a<e.count;a++){const r=e.getX(a),i=e.getY(a)/.64,l=e.getZ(a),v=Math.hypot(r,i,l)||1;s.setXYZ(a,r/v,i/v,l/v)}R.setAttribute("position",e),R.setAttribute("normal",s);const t=new Float32Array(be*4);for(let a=0;a<be*4;a++)t[a]=re();R.setAttribute("aLp",new n.InstancedBufferAttribute(t,4)),R.instanceCount=be}const j=je.clayFreeBiased(3e3);j.uniforms.uFall={value:1},j.uniforms.uSpeed={value:10},j.vertexShader=`
      attribute vec4 aLp; uniform float uFall, uSpeed; varying vec3 vL; varying vec3 vW; varying vec3 vN;
      ${m.glsl.common}
      void main(){
        float s = aLp.w, T = 7. + 4. * fract(s * 5.3), ph = fract(uTime / T + aLp.x), t = ph * T;
        float endS = step(0.25, aLp.y), side = aLp.z < 0.5 ? -1. : 1.;                       // three in four come off the two ends
        float x0 = mix(20. + aLp.z * 140., side * (171. + 14. * fract(s * 9.7)), endS);      // the rest off the far half of the contact line
        float vy = 13. + 13. * fract(s * 3.1), vz = 3. + 7. * fract(s * 7.9), vx = mix(4. * (fract(s * 11.3) - 0.5), side * (3. + 7. * fract(s * 2.3)), endS);
        float tf = vy / 4.9, tt = min(t, tf);                                                  // lands at tf, then lies and slumps
        float y = max(vy * tt - 4.9 * tt * tt, 0.);
        float z = uContact - mix(26., 4., endS) * fract(s * 4.1) - (vz + uSpeed) * tt - uSpeed * (t - tt);   // it stays where it fell as the seal rolls on
        float lie = clamp((t - tf) / max(T - tf, 0.5), 0., 1.);
        float alive = step(fract(s * 13.7), uFall) * smoothstep(0., 0.02, ph) * (1. - smoothstep(0.75, 1., lie));
        float size = (1.7 + 2.6 * s * s) * alive;
        float a = tt * (1.1 + 2.2 * fract(s * 3.3)), ca = cos(a), sa = sin(a);
        vec3 p = position * size, n = normal;
        p = vec3(p.x, p.y * ca - p.z * sa, p.y * sa + p.z * ca); n = vec3(n.x, n.y * ca - n.z * sa, n.y * sa + n.z * ca);
        float sl = 1. - 0.45 * smoothstep(0., 0.25, lie);                                      // the slump on landing
        p.y *= sl; n.y /= sl;
        vec3 wp = uOrigin + vec3(x0 + vx * tt, y + 0.55 * size * sl, z) + p;
        vW = wp; vL = wp - uOrigin; vN = n;
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
      }`;const He=new n.Mesh(R,j);He.frustumCulled=!1,W.add(He),await c.yield();const vt=`
      varying vec3 vW; varying vec3 vN; varying vec3 vA; uniform vec3 uSunDir, uGold, uStone;
      ${m.glsl.common}
      void main(){
        vec3 N = vN * (gl_FrontFacing ? 1. : -1.); float ln = length(N); N = ln > 1e-5 ? N / ln : vec3(0., 1., 0.);
        float nl = dot(N, uSunDir), f = fwidth(nl) * 0.7 + 0.01;
        float sh = 1. - smoothstep(-0.03 - f, -0.03 + f, nl), lip = smoothstep(0.5 - f, 0.5 + f, nl);
        float ti = vA.x;
        vec3 palest = mix(uTone[3], uCream, 0.6);
        vec3 base = ti < 0.5 ? uTone[0] : (ti < 1.5 ? uTone[1] : (ti < 2.5 ? uTone[2] : uTone[3]));
        vec3 pale = ti < 0.5 ? uTone[1] : (ti < 1.5 ? uTone[2] : (ti < 2.5 ? uTone[3] : palest));
        if (vA.y > -0.5) {                                   // the stamped face: figure a tone paler, cut shade, lit lip
          vec2 uv = vA.yz; float du = 1. / ${ve}.;
          float h = fzH(textureLod(uPic, uv, 1.5)) * 5.;
          float s1 = fzH(textureLod(uPic, uv + vec2(2.5 * du, 0.), 1.5)) * 5. - h, s2 = fzH(textureLod(uPic, uv + vec2(6. * du, 0.), 2.)) * 5. - h;
          float s3 = fzH(textureLod(uPic, uv + vec2(11. * du, 0.), 2.5)) * 5. - h, s4 = fzH(textureLod(uPic, uv + vec2(17. * du, 0.), 3.)) * 5. - h;
          float cst = max(max(s1 - 0.62, s2 - 1.5), max(s3 - 2.75, s4 - 4.25));
          float fc = fwidth(cst) * 0.7 + 0.03, fh = fwidth(h) * 0.7 + 0.03;
          float cut = smoothstep(-fc, fc, cst);
          float lp = smoothstep(0.45 - fh, 0.45 + fh, -s1) * (1. - cut);
          base = mix(base, pale, smoothstep(0.9 - fh, 0.9 + fh, h));
          base = mix(base, palest, lp);
          sh = max(sh, cut); lip = 0.;
        }
        vec3 col = fzShade(mix(base, pale, lip), sh);
        if (ti > 3.5) {
          vec3 g = ti > 4.5 ? uStone : uGold;
          col = mix(mix(g * 0.52, g, 1. - sh), mix(g, uCream, 0.5), lip * step(ti, 4.5));
        }
        gl_FragColor = vec4(fzHazed(col, vW), 1.);
      }`,pt=new n.ShaderMaterial({uniforms:I,side:n.DoubleSide,fragmentShader:vt,vertexShader:`
        attribute vec3 aA; attribute float aSway; varying vec3 vW; varying vec3 vN; varying vec3 vA; uniform float uTime, uWind;
        void main(){
          vec4 wp = modelMatrix * vec4(position, 1.);
          wp.x += aSway * (sin(uTime * 0.7 + wp.z * 0.05) + 0.5 * sin(uTime * 1.3 + wp.x * 0.07)) * (0.6 + 0.4 * uWind);     // fronds nod downwind
          vW = wp.xyz; vN = mat3(modelMatrix) * normal; vA = aA;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`}),N=[],ze=new n.Matrix4,Ze=new n.Quaternion,Xe=new n.Euler,Me=new n.Vector3,Se=new n.Vector3,M=(e,o,s,t,a,r=0,i=1,l=1,v=1,p=0,x=0,y=0)=>{const u=e.index?e.toNonIndexed():e;u!==e&&e.dispose(),u.applyMatrix4(ze.compose(Me.set(s,t,a),Ze.setFromEuler(Xe.set(p,r,x,"YXZ")),Se.set(i,l,v))),u.computeVertexNormals();const h=u.attributes.position.count,w=new Float32Array(h*3),z=new Float32Array(h);for(let g=0;g<h;g++)w[g*3]=o,w[g*3+1]=-1,w[g*3+2]=0,z[g]=y;return u.setAttribute("aA",new n.BufferAttribute(w,3)),u.setAttribute("aSway",new n.BufferAttribute(z,1)),u.deleteAttribute("uv"),N.push(u),u},S=(e,o,s,t,a,r,i,l=0)=>M(new n.BoxGeometry(o,s,t),e,a,r+s/2,i,l),f=c.rng.fork("frieze-country"),K=[],Ye=(e,o,s,t)=>{ze.compose(Me.set(o,0,s),Ze.setFromEuler(Xe.set(0,t,0)),Se.set(1,1,1));for(let a=e;a<N.length;a++)N[a].applyMatrix4(ze)},mt=async(e,o,s,t)=>{const a=N.length,r=[[230,36],[168,30],[112,26]];let i=0;for(const[l,v]of r){S(1,l*t,v*t,l*t,0,i,0);const p=Math.round(l/28);for(let x=0;x<p;x++){const y=((x+.5)/p-.5)*l*t;for(const[u,h]of[[1,0],[-1,0],[0,1],[0,-1]])S(1,u?5*t:10*t,v*t,u?10*t:5*t,u?u*(l/2+2)*t:y,i,u?y:h*(l/2+2)*t)}S(2,(l+8)*t,3*t,(l+8)*t,0,i+v*t,0),S(5,(l+11)*t,8.5*t,(l+11)*t,0,i+v*t-9*t,0),S(4,(l+12.5)*t,3*t,(l+12.5)*t,0,i+v*t-12.6*t,0),i+=v*t,await c.yield()}S(2,58*t,26*t,44*t,0,i,0),S(4,2*t,17*t,16*t,-29.6*t,i,0),S(5,61*t,6*t,47*t,0,i+19*t,0),S(4,62*t,2*t,48*t,0,i+26*t,0),M(new n.BoxGeometry(150*t,5*t,20*t),2,-112*t,44*t,0,0,1,1,1,0,.64),Ye(a,e,o,s)};await c.yield(),await mt(560,650,.3,1),await c.yield();const Re=async(e,o,s,t,a)=>{const r=N.length,i=190*t,l=150*t,v=24*t;M(new n.SphereGeometry(1,16,4,0,Math.PI*2,0,Math.PI/2),2,0,0,0,0,i*1.25,v,l*1.25);for(let p=0;p<14;p++){const x=p/14*6.2832,y=(p+1)/14*6.2832,u=Math.cos(x)*i,h=Math.sin(x)*l,w=Math.cos(y)*i,z=Math.sin(y)*l,g=Math.hypot(w-u,z-h),P=-Math.atan2(z-h,w-u);M(new n.BoxGeometry(g,20*t,7*t),1,(u+w)/2,15*t,(h+z)/2,P),S(1,15*t,34*t,15*t,u,4*t,h,P),p%5===4&&await c.yield()}for(let p=0;p<a;p++){const x=f()*6.2832,y=Math.sqrt(f())*.78,u=Math.cos(x)*i*y,h=Math.sin(x)*l*y,w=(16+f()*26)*t,z=(16+f()*22)*t,g=(9+f()*20)*t;S(f()<.5?1:2,w,g,z,u,v*(1-y*y)*.9+4*t,h,f()*.5),p%8===7&&await c.yield()}S(1,80*t,26*t,60*t,0,v*.9,0,.2),S(2,46*t,20*t,34*t,0,v*.9+26*t,0,.2),Ye(r,e,o,s)};await Re(-640,560,.25,1,Math.round(26*(.6+.4*C))),await c.yield(),await Re(470,1290,-.4,.8,Math.round(16*(.6+.4*C))),await c.yield();for(const[e,o,s]of[[-420,700,15],[-452,806,17],[-478,925,14],[-505,1015,13],[-222,1172,15]])M(new n.SphereGeometry(1,10,4,0,Math.PI*2,0,Math.PI/2),1,e,0,o,f()*3,s,s*1.45,s),S(5,s*.5,s*.7,2,e-s*.93,0,o,Math.PI/2),S(4,s*.7,s*.13,2.6,e-s*.95,s*.7,o,Math.PI/2),M(new n.CylinderGeometry(s*.22,s*.3,s*.5,7,1,!0),1,e,s*1.55,o),K.push(e,s*1.8,o-Z),await c.yield();{const e=[[.1,0],[2.3,.3],[4.6,3.4],[5.2,7],[4.5,10.6],[2.6,13.2],[1.9,14.6],[2.7,15.8],[2.4,16.6],[.1,17.2]].map(([t,a])=>new n.Vector2(t,a)),o=Math.round(8*(.6+.4*C)),s=Math.round(15*(.6+.4*C));for(let t=0;t<o;t++){const a=t%2,r=Math.floor(t/2),i=.8+f()*.45;M(new n.LatheGeometry(e,9),a,-330-r*13+f()*3-a*4,0,722+a*18+f()*3,f()*6,i,i,i),t%3===2&&await c.yield()}for(let t=0;t<s;t++){const a=t%3,r=Math.floor(t/3),i=.85+f()*.5;M(new n.LatheGeometry(e,9),a,-236-r*17+f()*4-a*5,0,1126+a*20+f()*4,f()*6,i,i,i),t%3===2&&await c.yield()}}await c.yield();const wt=(e,o,s,t)=>{const a=(f()-.5)*.16,r=s*.98;M(new n.CylinderGeometry(.03*s,.05*s,s,6,1,!0),1,e,s/2,o,f()*6,1,1,1,a,a*.6);const i=e-Math.sin(a*.6)*s*.5,l=o+Math.sin(a)*s*.5;M(new n.IcosahedronGeometry(.07*s,0),2,i,r,l,f()*6);const v=8,p=f()*6.2832;for(let x=0;x<v;x++){const y=p+x/v*6.2832,u=.7+.45*f(),h=(.52+.14*f())*s,w=.062*s,z=Me.set(-Math.sin(u)*Math.cos(y),Math.cos(u),Math.sin(u)*Math.sin(y)).clone(),g=[],P=[0,.5,1];for(const A of P){const F=new n.Vector3(i,r,l).addScaledVector(z,h*A);F.y-=.55*h*A*A;const V=z.clone();V.y-=1.1*A,V.normalize();const T=new n.Vector3().crossVectors(V,Se.set(0,1,0)).normalize(),G=new n.Vector3().crossVectors(T,V),E=w*(1-A)*(.55+.9*A);g.push([F.clone().addScaledVector(T,E),F.clone().addScaledVector(G,E*.45),F.clone().addScaledVector(T,-E),F.clone().addScaledVector(G,-E*.45)])}const $=[];for(let A=0;A<P.length-1;A++)for(let F=0;F<4;F++){const V=g[A][F],T=g[A][(F+1)%4],G=g[A+1][F],E=g[A+1][(F+1)%4];$.push(V.x,V.y,V.z,T.x,T.y,T.z,G.x,G.y,G.z),A<P.length-2&&$.push(T.x,T.y,T.z,E.x,E.y,E.z,G.x,G.y,G.z)}const ne=new n.BufferGeometry;ne.setAttribute("position",new n.Float32BufferAttribute($,3)),M(ne,2,0,0,0,0,1,1,1,0,0,.02*s)}for(const x of[-1,1]){const y=i+x*.07*s,u=r-.11*s,h=l+(f()-.5)*.06*s,w=M(new n.IcosahedronGeometry(.05*s,t?1:0),4,y,u,h,f()*6,1,1.4,1);if(t){const z=w.attributes.position,g=w.attributes.normal;for(let P=0;P<z.count;P++){const $=z.getX(P)-y,ne=(z.getY(P)-u)/1.96,A=z.getZ(P)-h,F=Math.hypot($,ne,A)||1;g.setXYZ(P,$/F,ne/F,A/F)}}}},Ae=e=>-232+7*Math.sin(e*.011+1)+3*Math.sin(e*.029),Ce=e=>22+3*Math.sin(e*.017+2),Ke=e=>252+11*Math.sin(e*.0083+.4)+5*Math.sin(e*.021+2),Qe=e=>27+4*Math.sin(e*.013),O=[];for(let e=0;e<26;e++)O.push([306+f()*40+(e%5===0?40:0),-260+e*54+f()*34]);for(let e=0;e<20;e++){const o=f()*6.2832,s=1.18+f()*.5;O.push([-640+Math.cos(o)*190*s,560+Math.sin(o)*150*s])}{const e=new n.Vector3,o=[];for(let t=0;t<=220;t++)ge.posAtDist(t/220*ge.length,e),e.y<90&&o.push(e.x,e.z);const s=(t,a)=>{for(let r=0;r<o.length;r+=2)if(Math.hypot(o[r]-t,o[r+1]-a)<60)return!1;return!0};for(let t=0;t<58;t++){const a=-560+t*37+f()*16,r=t%2===0,i=r?Ae(a)-Ce(a)-8-f()*12:Ae(a)+Ce(a)+6+f()*5;s(i,a)&&(r||a<690||a>1040)&&O.push([r?i:Math.min(i,-197),a,1])}for(let t=0;t<34;t++){const a=-420+t*58+f()*24,r=Math.max(Ke(a)-Qe(a)-6-f()*5,196);O.push([r,a])}}for(const e of[[-430,250],[-455,290],[-505,760],[-528,800],[-498,985],[-540,1010],[-455,1050],[-250,1150],[-285,1190],[-205,1215]])O.push(e);const Je=Math.round(O.length*(.6+.4*C));for(let e=0;e<Je;e++){const o=O[Math.floor(e*O.length/Je)];wt(o[0],o[1],34+f()*20,o[2]===1),await c.yield()}for(const e of[-90,235,660]){M(new n.CylinderGeometry(1.7,2.6,40,6,1,!0),1,198,20,e),M(new n.CylinderGeometry(3.6,3.6,7,8,1,!1),5,198,34,e),M(new n.IcosahedronGeometry(5.6,1),4,198,44,e);for(const o of[-1,1])M(new n.ConeGeometry(2.6,24,5,1,!0),4,198,55,e+o*8.5,0,1,1,1,o*.62,0)}await c.yield();const Q=(e,o,s,t,a,r)=>{const i=new n.Shape;i.moveTo(-t/2,0),i.lineTo(t/2,0),i.lineTo(t/2,a-t/2),i.absarc(0,a-t/2,t/2,0,Math.PI,!1),i.lineTo(-t/2,0);const l=new n.ExtrudeGeometry(i,{depth:9,bevelEnabled:!1,curveSegments:9});l.translate(0,0,-4.5);const v=l.toNonIndexed();l.dispose(),v.computeVertexNormals();const p=v.attributes.position.array.slice(),x=v.attributes.normal.array.slice(),y=Math.cos(s)>0?-1:1;M(v,1,e,0,o,s),S(5,t+8,5,15,e,0,o,s),S(4,t+10,1.5,17,e,5,o,s);const u=v.attributes.aA.array;for(let h=0;h<p.length/3;h++)Math.abs(x[h*3+2])>.9&&(u[h*3+1]=(r[0]+y*p[h*3]*r[2])/ve+4,u[h*3+2]=(r[1]+(p[h*3+1]-a*.46)*r[2]+170)/340)},J=e=>e?e[0]:200;Q(-285,190,.32,56,78,[J(d.ibex&&d.ibex[0].head)-12,-50,1.9]),await c.yield(),Q(-395,335,.2,50,70,[J(d.bull&&d.bull.eye)-34,-62,1.75]),await c.yield(),Q(-600,300,.3,46,66,[J(d.file&&d.file[1].at)+6,86,1.5]),await c.yield(),Q(-545,890,1.25,52,72,[J(d.sun&&d.sun.at),2,1.3]),await c.yield(),Q(-300,690,-.25,50,70,[J(d.ibex&&d.ibex[1]&&d.ibex[1].head)+12,-50,1.7]),await c.yield();for(let e=0;e<N.length;e+=40){const o=N.slice(e,e+40),s=new n.Mesh(Wt(o),pt);s.frustumCulled=!1,W.add(s);for(const t of o)t.dispose();await c.yield()}{const e=[],o=[],s=[];let t=0;for(const[l,v,p,x]of[[Ae,Ce,-2600,4e3],[Ke,Qe,-2600,4e3]]){const y=Math.round((x-p)/20),u=t;for(let h=0;h<=y;h++){const w=p+(x-p)*h/y,z=l(w),g=v(w);e.push(z-g,.45,w,z+g,.45,w),o.push(-1,g,1,g),t+=2}for(let h=0;h<y;h++){const w=u+h*2;s.push(w,w+2,w+1,w+1,w+2,w+3)}}const a=new n.BufferGeometry;a.setAttribute("position",new n.Float32BufferAttribute(e,3)),a.setAttribute("aV",new n.Float32BufferAttribute(o,2)),a.setIndex(s);const r=new n.ShaderMaterial({uniforms:I,side:n.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4,vertexShader:`attribute vec2 aV; varying vec3 vW; varying vec2 vV;
          void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vV = aV; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`varying vec3 vW; varying vec2 vV; uniform vec3 uStone, uVein;
          ${m.glsl.common}
          void main(){
            float hw = max(vV.y, 1.), m = (vV.x + 1.) * hw, fm = fwidth(m) + 0.02, z = vW.z;
            float shade = 1. - smoothstep(8. - fm, 8. + fm, m + 1.6 * sin(z * 0.045));                 // the sunward bank's shade on the water
            float lip = smoothstep(2. * hw - 1.7 - fm, 2. * hw - 1.7 + fm, m);                          // the far bank's lit face
            float lane = vV.x * 4.4 + 0.3 * sin(z * 0.031 + vV.x * 2.), li = floor(lane + 0.5), dl = abs(lane - li) * hw / 4.4;
            float run = fzNoise(vec2((z + uTime * (5. + 2. * sin(li * 2.1))) * 0.03 + li * 7.3, li * 3.1));
            float wl = 0.2 + 0.65 * smoothstep(0.5, 0.8, run), fl = fwidth(dl) + 0.02;
            float line = (1. - smoothstep(wl - fl, wl + fl, dl)) * smoothstep(0.5, 0.53, run) * clamp(1.4 * wl / fl, 0., 1.);
            vec3 col = mix(uStone, uStone * 0.52, shade);
            col = mix(col, mix(uVein, uStone, 0.35 * shade), line * (1. - lip));
            col = mix(col, mix(uTone[3], uCream, 0.6), lip);
            gl_FragColor = vec4(fzHazed(col, vW), 1.);
          }`}),i=new n.Mesh(a,r);i.frustumCulled=!1,W.add(i)}await c.yield();const b=c.rng.fork("frieze-dust"),le=[];for(let e=1;e<=3;e++){const o=(s,t,a)=>le.push(s[1],t,d.toCourse(s[0],e),a);for(const s of d.ibex||[])o(s.head,5.5,b.range(90,150));d.mountain&&o(d.mountain.peak,5.5,b.range(110,170)),d.bull&&o(d.bull.eye,5.5,b.range(80,120)),d.palm&&o(d.palm.crown,5.5,b.range(100,150));for(let s=0,t=0;s<400&&t<Math.round(12*_);s++){const a=b.range(-166,60),r=b.range(0,ve),i=d.toCourse(r,e);m.heightAt(a,i)>3.3&&(o([r,a],m.heightAt(a,i)+.5,b.range(40,110)),t++)}await c.yield()}for(let e=0;e<K.length;e+=3)le.push(K[e],K[e+1],K[e+2],-b.range(80,110));const Fe=le.length/4,ce=18,q=new n.InstancedBufferGeometry;{const e=[],o=[];for(let t=0;t<=ce;t++)e.push(t/ce,0,0,t/ce,1,0);for(let t=0;t<ce;t++){const a=t*2;o.push(a,a+1,a+2,a+1,a+3,a+2)}q.setAttribute("position",new n.Float32BufferAttribute(e,3)),q.setIndex(o);const s=new Float32Array(Fe);for(let t=0;t<Fe;t++)s[t]=b();q.setAttribute("aAnchor",new n.InstancedBufferAttribute(new Float32Array(le),4)),q.setAttribute("aSeed",new n.InstancedBufferAttribute(s,1)),q.instanceCount=Fe}const yt=new n.ShaderMaterial({uniforms:Object.assign({},I,{uOp:{value:U==="breeze"?.55:.4},uNear:{value:30}}),transparent:!0,depthWrite:!1,side:n.DoubleSide,vertexShader:`
        attribute vec4 aAnchor; attribute float aSeed; varying vec2 vUv; varying vec3 vW; varying float vSeed, vLive, vKiln;
        ${m.glsl.common}
        void main(){
          float t = position.x, kiln = step(aAnchor.w, 0.), len = abs(aAnchor.w) * (0.8 + 0.4 * uWind);
          float live = max(kiln, clamp((uFronts.y - aAnchor.z) / 70., 0., 1.) * step(aAnchor.z, uContact - 40.));
          float wav = fzNoise(vec2(t * 3. - uTime * 0.22 * uWind + aSeed * 40., aSeed * 9.)) - 0.5;
          float wav2 = fzNoise(vec2(t * 2.2 - uTime * 0.17 * uWind + aSeed * 17., 4. + aSeed * 5.)) - 0.5;
          vec3 c = uOrigin + vec3(aAnchor.x + t * len * (1. - 0.45 * kiln), aAnchor.y + t * (5. + 16. * aSeed + 34. * kiln * (1. - 0.4 * t)) + wav * 9. * t, aAnchor.z + (wav2 * 26. + 10. * (aSeed - 0.5)) * t);
          vec3 toCam = uCamPos - c; float l = length(toCam); toCam = l > 1e-3 ? toCam / l : vec3(0., 1., 0.);
          vec3 side = cross(vec3(1., 0., 0.), toCam); float ls = length(side); side = ls > 1e-3 ? side / ls : vec3(0., 1., 0.);
          float wdt = (1.2 + 10. * sqrt(t)) * (0.7 + 0.6 * aSeed) * live * (1. + 0.5 * kiln);
          vec3 wp = c + side * (position.y - 0.5) * wdt;
          vUv = vec2(t, position.y); vW = wp; vSeed = aSeed; vLive = live; vKiln = kiln;
          gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
        }`,fragmentShader:`
        varying vec2 vUv; varying vec3 vW; varying float vSeed, vLive, vKiln; uniform float uOp, uNear;
        ${m.glsl.common}
        void main(){
          float n = fzNoise(vec2(vUv.x * 9. - uTime * 0.6 * uWind + vSeed * 31., vUv.y * 3.2 + vSeed * 7.)) * 0.65 + fzNoise(vec2(vUv.x * 23. - uTime * 1.1 * uWind, vUv.y * 6. + vSeed * 3.)) * 0.35;
          float a = sin(clamp(vUv.y, 0., 1.) * 3.14159) * smoothstep(0., 0.06, vUv.x) * (1. - vUv.x) * (0.45 + 1.1 * n);
          float f = fwidth(a) + 0.01;
          float lvl = 0.5 * smoothstep(0.2 - f, 0.2 + f, a) + 0.5 * smoothstep(0.42 - f, 0.42 + f, a);     // two flat densities, hard-edged
          float d = length(vW - uCamPos);
          gl_FragColor = vec4(mix(uHaze, mix(uHaze, uTone[1], 0.5), vKiln), lvl * mix(uOp, 0.85, vKiln) * vLive * smoothstep(uNear * 0.2, uNear, d));
        }`}),Pe=new n.Mesh(q,yt);Pe.frustumCulled=!1,Pe.renderOrder=3,W.add(Pe),await c.yield();const We=Math.round(1700*C*Math.min(1.2,_)*(U==="breeze"?1.25:1)),k=new n.InstancedBufferGeometry;{k.setAttribute("position",new n.Float32BufferAttribute([0,0,0,1,0,0,0,1,0,1,1,0,0,0,1,1,0,1,0,1,1,1,1,1],3)),k.setIndex([0,1,2,1,3,2,4,5,6,5,7,6]);const e=new Float32Array(We*4);for(let o=0;o<We*4;o++)e[o]=b();k.setAttribute("aWs",new n.InstancedBufferAttribute(e,4)),k.instanceCount=We}const Te=new n.ShaderMaterial({uniforms:I,transparent:!0,depthWrite:!1,side:n.DoubleSide,vertexShader:`
        attribute vec4 aWs; varying vec2 vUv; varying vec3 vW; varying float vLive, vSh;
        ${m.glsl.common}
        void main(){
          float s = aWs.w, len = 7. + 13. * s * s, spd = (8. + 10. * fract(s * 7.3)) * uWind, isSh = position.z;
          float hook = step(aWs.z, 0.3), bedg = step(0.3, aWs.z) * step(aWs.z, 0.52);        // bedg: over the smooth unprinted bed ahead of the seal (flat, so they keep their shade)
          float z = mix(mix(-1170. + 1260. * aWs.y, -310. + 520. * aWs.y, hook), uContact + 96. + 440. * aWs.y, bedg) + 6. * sin(uTime * 0.21 + s * 40.);
          float span = mix(mix(900., 340., hook), 560., bedg), x0 = mix(-520., -262., bedg) + mod(aWs.x * span + spd * uTime, span);
          float edge = mix(smoothstep(-520., -470., x0) * (1. - smoothstep(span - 600., span - 520., x0)) * (1. - hook * smoothstep(-215., -192., x0)),
                           smoothstep(-262., -230., x0) * (1. - smoothstep(262., 298., x0)), bedg);
          // round five: the strokes skim the ground (0.7 to 2 m up), so each lies right beside the shade it throws and the
          // pair reads as one mark, a low ridge of dust drawn like every other ridge here: never a shade without its stroke
          float y = 0.7 + 1.1 * fract(s * 3.9) + 0.25 * sin(uTime * 0.5 + s * 17.);
          float xs = x0 + y / max(uSunTan, 0.05);                                             // where its shade falls
          float onPlain = max(bedg, step(190., abs(x0 + 0.5 * len)) * step(190., abs(x0)) * step(190., abs(x0 + len)));
          float shOn = max(bedg, step(190., abs(xs)) * step(190., abs(xs + len)));
          vec3 c0 = uOrigin + vec3(x0 + 0.5 * len, y, z);
          float near = smoothstep(60., 85., length(c0 - uCamPos));
          float dryLand = (1. - step(-278., xs + len) * step(x0, -188.)) * (1. - step(198., xs + len) * step(x0, 304.) * step(0., x0));      // round seven: never over the river or the canal
          vLive = edge * onPlain * near * dryLand * mix(1., shOn, isSh);
          vec3 c = uOrigin + vec3(mix(x0, xs, isSh) + position.x * len, mix(y, 0.35, isSh), z + 1.6 * sin(position.x * 2.2 + uTime * 0.8 + s * 9.));
          vec3 toCam = uCamPos - c; float l = length(toCam); toCam = l > 1e-3 ? toCam / l : vec3(0., 1., 0.);
          vec3 side = cross(vec3(1., 0., 0.), toCam); float ls = length(side); side = ls > 1e-3 ? side / ls : vec3(0., 0., 1.);
          side = mix(side, vec3(0., 0., 1.), isSh);                                            // the shade lies flat on the plain
          float wdt = max(0.9 + 1.3 * fract(s * 5.1), l * uPixel * 1.8) * step(0.5, vLive);
          vec3 wp = c + side * (position.y - 0.5) * wdt;
          vUv = position.xy; vW = wp; vSh = isSh;
          gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
        }`,fragmentShader:`
        varying vec2 vUv; varying vec3 vW; varying float vLive, vSh;
        ${m.glsl.common}
        void main(){
          float taper = sin(clamp(vUv.x, 0., 1.) * 3.14159) * (0.45 + 0.55 * vUv.x);          // fat toward the head, like a wheel-cut
          float dd = taper - abs(vUv.y - 0.5) * 2., f = fwidth(dd) + 1e-3;
          float a = smoothstep(-f, f, dd - 0.08) * step(0.5, vLive);
          if (a < 0.02) discard;
          vec3 pale = mix(uTone[3], uCream, 0.6);
          gl_FragColor = vec4(fzHazed(mix(pale, fzShade(uTone[3], 1.), step(0.5, vSh)), vW), a);
        }`}),Be=new n.Mesh(k,Te);Be.frustumCulled=!1,Be.renderOrder=2,W.add(Be),await c.yield();const Ge=Math.round(4e3*C*Math.min(1.2,_)*(U==="breeze"?1.2:1)),ee=new n.InstancedBufferGeometry;{ee.setAttribute("position",new n.Float32BufferAttribute([0,0,0,1,0,0,0,1,0,1,1,0],3)),ee.setIndex([0,1,2,1,3,2]);const e=new Float32Array(Ge*4);for(let o=0;o<Ge*4;o++)e[o]=b();ee.setAttribute("aCs",new n.InstancedBufferAttribute(e,4)),ee.instanceCount=Ge}I.uMtn={value:new n.Vector2(d.seam0,d.mountain?d.mountain.peak[0]:-999)};const gt=new n.ShaderMaterial({uniforms:I,transparent:!0,depthWrite:!1,side:n.DoubleSide,fragmentShader:Te.fragmentShader,vertexShader:`
        attribute vec4 aCs; varying vec2 vUv; varying vec3 vW; varying float vLive, vSh; uniform vec2 uMtn;
        ${m.glsl.common}
        void main(){
          float s = aCs.w, xb = -104. + aCs.x * 266., zb = -1509. * aCs.y;      // the figure field and the far border, never the river band under the lens
          float hb = fzH(textureLod(uPic, fzPicUv(vec2(xb, zb)), 1.)) * 5.;
          float T = 2.4 + 2.2 * fract(s * 5.3), ph = fract(uTime * uWind / T + aCs.z);
          float dry = step(zb, uFronts.x - 30.) * step(uStart + 4., zb);
          float pzc = mod(zb + uMtn.x, ${ve}.);                               // round eight: none born on the mountain's drilled scales (the domes stay clear of marks)
          float alive = step(2.35, hb) * dry * smoothstep(0., 0.1, ph) * (1. - smoothstep(0.65, 1., ph)) * (1. - step(abs(pzc - uMtn.y), 60.) * step(xb, 32.));
          float len = (7. + 13. * s) * (0.35 + 0.65 * ph), x0 = xb + ph * (12. + 22. * s);
          float y = hb + 0.5 + ph * (1.2 + 2.8 * fract(s * 3.9));
          vec3 c0 = uOrigin + vec3(x0, y, zb);
          float cdist = length(c0 - uCamPos);
          alive *= smoothstep(115., 160., cdist) * (1. - smoothstep(380., 540., cdist));     // never over the figures under the lens, never a far speck
          vec3 c = uOrigin + vec3(x0 + position.x * len, y, zb + 1.1 * sin(position.x * 2.2 + uTime * 0.9 + s * 9.) * ph);
          vec3 toCam = uCamPos - c; float l = length(toCam); toCam = l > 1e-3 ? toCam / l : vec3(0., 1., 0.);
          vec3 side = cross(vec3(1., 0., 0.), toCam); float ls = length(side); side = ls > 1e-3 ? side / ls : vec3(0., 0., 1.);
          float wdt = max((0.8 + 1.1 * fract(s * 5.1)) * alive, l * uPixel * 2.4) * step(0.04, alive);
          vec3 wp = c + side * (position.y - 0.5) * wdt;
          vUv = position.xy; vW = wp; vLive = step(0.04, alive); vSh = 0.;
          gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
        }`}),Le=new n.Mesh(ee,gt);Le.frustumCulled=!1,Le.renderOrder=2,W.add(Le),await c.yield();const xt=c.rng.fork("frieze-wisps"),Ie=[];{const e=(s,t)=>{let a=s[1],r=s[0];for(let i=-46;i<=8;i+=2)for(let l=s[1]+34;l>a;l-=1)if(m.heightAt(l,d.toCourse(s[0]+t*i,1))>2.2){a=l,r=s[0]+t*i;break}return[r,a]},o=[];for(const s of d.ibex||[])o.push(e(s.head,s.dir));d.mountain&&o.push([d.mountain.peak[0],d.mountain.peak[1]+6]),d.palm&&o.push([d.palm.crown[0],d.palm.crown[1]+30]),d.bull&&d.bull.eye&&o.push(e(d.bull.eye,-1));for(let s=1;s<=3;s++)for(const t of o)for(let a=0;a<4;a++)Ie.push(t[1],m.heightAt(t[1],d.toCourse(t[0],s))+.4,d.toCourse(t[0],s),xt())}const te=new n.InstancedBufferGeometry;{const e=[],o=[];for(let t=0;t<=6;t++)e.push(t/6,0,0,t/6,1,0);for(let t=0;t<6;t++){const a=t*2;o.push(a,a+1,a+2,a+1,a+3,a+2)}te.setAttribute("position",new n.Float32BufferAttribute(e,3)),te.setIndex(o),te.setAttribute("aHw",new n.InstancedBufferAttribute(new Float32Array(Ie),4)),te.instanceCount=Ie.length/4}const bt=new n.ShaderMaterial({uniforms:I,transparent:!0,depthWrite:!1,side:n.DoubleSide,fragmentShader:Te.fragmentShader,vertexShader:`
        attribute vec4 aHw; varying vec2 vUv; varying vec3 vW; varying float vLive, vSh;
        ${m.glsl.common}
        void main(){
          float s = aHw.w, T = 4.2 + 2.4 * fract(s * 5.3), ph = fract(uTime * uWind / T + s * 7.);
          vec3 a0 = uOrigin + aHw.xyz; float cd = length(a0 - uCamPos);
          float alive = step(aHw.z, uFronts.x - 40.) * step(uStart + 4., aHw.z) * smoothstep(0., 0.12, ph) * (1. - smoothstep(0.72, 1., ph))
                      * smoothstep(150., 200., cd) * (1. - smoothstep(520., 640., cd));
          float len = (12. + 34. * ph) * (0.8 + 0.4 * fract(s * 3.1)), lead = 4. + ph * (42. + 20. * fract(s * 9.7));
          float t = position.x, along = max(lead - len * (1. - t), 0.);            // the tail stays on its crest
          vec2 wd = normalize(vec2(1., 0.8 + 0.1 * sin(s * 40.)));                 // downwind, leaning up the course (all nearly parallel: streamers, not rays)
          float bil = sin(t * 2.6 + uTime * 0.9 + s * 9.) * 1.4 * ph;
          vec3 c = a0 + vec3(wd.x * along - wd.y * bil, 0.6 + along * 0.12 + 1.5 * ph * t, wd.y * along + wd.x * bil);
          vec3 toCam = uCamPos - c; float l = length(toCam); toCam = l > 1e-3 ? toCam / l : vec3(0., 1., 0.);
          vec3 side = cross(vec3(wd.x, 0.12, wd.y), toCam); float ls = length(side); side = ls > 1e-3 ? side / ls : vec3(0., 1., 0.);
          float wdt = max((2.3 + 2. * fract(s * 5.1)) * (0.6 + 0.8 * ph), l * uPixel * 4.2) * step(0.04, alive);
          vec3 wp = c + side * (position.y - 0.5) * wdt;
          vUv = position.xy; vW = wp; vLive = step(0.04, alive); vSh = 0.;
          gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
        }`}),Oe=new n.Mesh(te,bt);Oe.frustumCulled=!1,Oe.renderOrder=2,W.add(Oe),await c.yield();const ke=Math.round(3600*C),et=Math.round(520*C),Ve=new n.BufferGeometry;{const e=new Float32Array(ke*4);for(let o=0;o<ke*4;o++)e[o]=b();Ve.setAttribute("position",new n.BufferAttribute(new Float32Array(et*3),3)),Ve.setAttribute("aMote",new n.BufferAttribute(e.slice(0,et*4),4))}const tt=new n.ShaderMaterial({uniforms:Object.assign({},I,{uPx:{value:225}}),transparent:!0,depthWrite:!1,vertexShader:`
        attribute vec4 aMote; uniform float uPx; varying float vSeed, vFade; varying vec3 vW;
        ${m.glsl.common}
        void main(){
          float s = aMote.w; vec3 box = vec3(190., 60., 190.);
          vec3 vel = vec3(6.5 * uWind * (0.6 + 0.8 * s), 0., 1.6 * (fract(s * 7.7) - 0.5));
          vec3 p = aMote.xyz * box + vel * uTime; p.y += sin(uTime * 0.6 + s * 40.) * 2.2; p.z += sin(uTime * 0.47 + s * 71.) * 3.;      // eddies
          vec3 rel = mod(p - uCamPos, box) - 0.5 * box;
          rel.y = -abs(rel.y) - 4.;                                    // below the eye: seen against the ground only
          vec3 wp = uCamPos + rel; vW = wp; vSeed = s;
          vec4 mv = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mv;
          float dist = max(-mv.z, 0.5), size = 0.55 + 0.9 * s * s;
          vec3 e = abs(rel) / (0.5 * box);
          vFade = (1. - smoothstep(0.7, 1., max(e.x, e.z))) * smoothstep(14., 30., dist) * step(0.6, wp.y);
          // A FLAKE IS OF THE CLAY IT FLIES OVER, by the drying lines alone: over the leather-hard stretch, between the leather
          // line (taken straight, the change eased across 32 m either way) and the wet line, the flakes are large chips and
          // fewer; over bone-dry and older ground they are small; the wet line, where the ground draws it, is their end
          float cz = wp.z - uOrigin.z, hard = smoothstep(uFronts.y - 32., uFronts.y + 32., cz);
          vec2 xz = vec2(wp.x - uOrigin.x, cz); float rag = (fzFbm(xz * 0.011) - 0.5) * 64. + (fzNoise(xz * 0.09) - 0.5) * 9.;      // the wet line where the ground draws it (the part's fzDry: its rag, at free clay's height 0), at the flake's own place: a flake comes in over the 9 m behind that line (the fine rag's own 9), so at the line and past it, over wet clay, no flake
          vFade *= (1. - smoothstep(uFronts.x - 9., uFronts.x, cz + rag)) * step(fract(s * 91.7), 0.25 - 0.06 * hard);
          gl_PointSize = clamp(2.2 * size * uPx * (1. + hard) * projectionMatrix[1][1] / dist, 8.5 + 7.5 * hard, 14. + 10. * hard) * step(0.01, vFade);
        }`,fragmentShader:`
        varying float vSeed, vFade; varying vec3 vW;
        ${m.glsl.common}
        void main(){
          vec2 q = gl_PointCoord - 0.5; float a = vSeed * 31.4, ca = cos(a), sa = sin(a);
          q = vec2(q.x * ca - q.y * sa, q.x * sa + q.y * ca);
          float tum = uTime * (0.3 + 0.5 * fract(vSeed * 5.3)) + vSeed * 50.;
          q.y /= 0.45 + 0.55 * abs(sin(tum));
          // round eight: a CHIP, not a disc: a straight-sided flake (six cut edges) in the clay's two tones, its lit face
          // and the shade under its curled lip parted by one hard line, tumbling
          float r = max(abs(q.x) * 1.1 + abs(q.y) * 0.6, abs(q.y) * 1.3), al = 1. - smoothstep(0.40, 0.46, r);
          if (al < 0.02) discard;
          vec3 pale = mix(uTone[3], uCream, 0.6);
          vec3 col = mix(pale, fzShade(uTone[2], 1.), smoothstep(-0.02, 0.02, q.y - 0.08 + 0.3 * q.x));
          gl_FragColor = vec4(fzHazed(col, vW), al * vFade * 0.9);
        }`}),Ee=new n.Points(Ve,tt);Ee.frustumCulled=!1,Ee.renderOrder=4,W.add(Ee),await c.yield();{const e=Math.round(2400*C);for(let o=0;o<e*4;o++)b()}await c.yield();const Ne=Math.round(44*C),ae=new n.InstancedBufferGeometry,De=new n.IcosahedronGeometry(1,1);ae.setAttribute("position",De.attributes.position),ae.setAttribute("normal",De.attributes.position);{const e=new Float32Array(Ne*4);for(let o=0;o<Ne;o++)e[o*4]=b()<.6?b.range(-169,-95):b.range(-95,168),e[o*4+1]=b.range(.32,1.45),e[o*4+2]=b(),e[o*4+3]=.9+1.3*b()*b();ae.setAttribute("aCr",new n.InstancedBufferAttribute(e,4)),ae.instanceCount=Ne}const de=je.clayFreeBiased(3e3);de.uniforms.uFall={value:1},de.vertexShader=`
      attribute vec4 aCr; uniform float uFall; varying vec3 vL; varying vec3 vW; varying vec3 vN;
      ${m.glsl.common}
      void main(){
        float T = 5.2, ph = fract(uTime / T * (0.8 + 0.4 * fract(aCr.z * 7.1)) + aCr.z), t = ph * T;
        float y0 = 80.05 - 80.05 * cos(aCr.y), z0 = uContact - 80.05 * sin(aCr.y) - 0.6;
        float y = y0 - 4.9 * t * t, z = z0 - 1.4 * t;
        float alive = step(0.3, y) * step(fract(aCr.z * 13.7), uFall) * smoothstep(0., 0.04, ph);
        float a = t * (1.5 + 3. * fract(aCr.z * 3.3)), ca = cos(a), sa = sin(a);
        vec3 p = position * aCr.w * alive, n = normal;
        p = vec3(p.x, p.y * ca - p.z * sa, p.y * sa + p.z * ca); n = vec3(n.x, n.y * ca - n.z * sa, n.y * sa + n.z * ca);
        vec3 wp = uOrigin + vec3(aCr.x, y, z) + p;
        vW = wp; vL = wp - uOrigin; vN = n;
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
      }`;const at=new n.Mesh(ae,de);at.frustumCulled=!1,W.add(at),De.dispose(),await c.yield();const zt=new n.Vector2,Mt=e=>ue(.9516*e,1-(1-e)*1.0858,he(.59,.69,e)),ot=e=>Mt(ft(H(e,0,1))),fe=e=>Z+m.sealZ(ot(e)),oe=[[.45,.485,e=>D[0].set(-50,40,fe(e)-20)],[.565,.63,e=>{const o=he(.57,.605,e);return D[2].set(ue(-11,10,o),ue(48,41,o),fe(e)+ue(21,8,o))}],[.685,.71,e=>D[3].set(-130,66,fe(e)-28)],[.735,.75,e=>D[4].set(-172,70,fe(e)-30)],[.775,.8,()=>D[5].set(-150,42,Z-58)],[.84,.872,()=>D[6].set(0,14,870)],[.892,1,()=>D[7].set(-172,80,Z)]],D=Array.from({length:8},()=>new n.Vector3),St=(e,o)=>{let s=0;for(;s<oe.length-1&&e>oe[s+1][0];)s++;const t=oe[s],a=oe[Math.min(s+1,oe.length-1)],r=he(t[1],a[0],e);return o.copy(t[2](e)).lerp(a[2](e),r)},At=[0,1].map(()=>new n.Vector3),Ct=[{at:[-20,5,195],from:.035,to:.125,weight:.88,fade:.3},{at:[-30,0,176],from:.118,to:.215,weight:.9,fade:.25},{at:[-35,0,460],from:.205,to:.3,weight:.9,fade:.25},{at:[110,0,356],from:.29,to:.39,weight:.95,fade:.25},{at:[-70,20,640],from:.385,to:.475,weight:.8,fade:.3},...[.45,.46].map((e,o)=>({at:(s,t)=>St(t,At[o]),from:e,to:.99,weight:.9,fade:.06}))],se=(e,o,s)=>he(e,o,s),Ft=e=>.78+.27*se(.3,.4,e)-.4*se(.46,.53,e)+.3*se(.69,.76,e)-.33*se(.79,.85,e)+.33*se(.89,.93,e);let st=!1;return{scene:W,path:ge,duration:49,pace:Ft,camera:{fov:62,near:.5,far:6e3,lookAhead:40,sway:.5,bank:.5},pois:Ct,portal:{shape:"circle",radius:Y.portalSeat.radius,color:"#"+m.palette.gold.getHexString(),glow:.3,revealDistance:300},post:{flat:1,exposure:1,bloom:{strength:0},grade:{saturation:1,contrast:1,vignette:0,grain:0}},ride:"none",style:"none",companion:"none",update(e,o,s,t){const a=ot(H(t,0,1));L.setProgress(a),L.update(e,o,s);const r=(m.sealZ(a+.004)-m.sealZ(a-.004))/(.008*42);de.uniforms.uFall.value=.3+.7*H(r/10,0,1),j.uniforms.uFall.value=.25+.75*H(r/10,0,1),j.uniforms.uSpeed.value=Math.max(r,0),tt.uniforms.uPx.value=nt.getDrawingBufferSize(zt).y*.5},dispose(){st||(st=!0,L.dispose())}}}};export{Nt as default};
