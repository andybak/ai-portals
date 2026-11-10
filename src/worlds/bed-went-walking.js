import*as r from"three";import{mergeGeometries as Re}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as Qt,clamp as H,lerp as J,smoothstep as y}from"../kit/core.js";import{buildHero as Et,PALETTE as Ue,makeStyle as Wt,STYLE_GLSL as _,tintMaterial as Qe,hullMaterial as Ee,latheGeo as Z}from"../parts/bed-went-walking.js";const T=[{z:260,x:0,w:44,h:90},{z:760,x:0,w:60,h:210},{z:1150,x:81.4,w:207.8,h:330}],C=24,R=66,ye=90,ee=58,ce=17,ge=3.7,wt=[[-94,70,5],[266,69.7,7],[766,75.6,5],[1156,70,10]],Q={z0:900,z1:1340,x0:30,x1:116,domeX:78,colY:30,roofY:36,spireZ:1330,spireH:190},Fe=[0,1,2,3,4,5,6].map(u=>({z:930+u*58,h:[112,128,118,140,122,138,154][u],r:27})),E=1352,Kt=[0,0,1560],We=[0,0,1565],b={x:44,z:1672},yt=u=>u<T[0].z?0:u<T[1].z?1:u<T[2].z?2:3;function Dt(){const u=[];wt.forEach(([P,g,F],ve)=>{for(let O=0;O<F;O++)for(let B=0;B<8;B++)for(const Y of[-1,1]){const be=Y*(C+R/2+B*ye),I=P+g*O+ee/2;Y>0&&B===0&&I+ee/2>Q.z0-6||Y>0&&B===1&&I>E||u.push({x:be,z:I,w:R,d:ee,panel:ve,col:Y*(B+1),row:O})}});const[x,N,G]=wt[3];for(let P=0;P<G;P++){const g=x+N*P+ee/2;g>E&&u.push({x:C+R/2+ye,z:g,w:R,d:ee,panel:3,col:2,row:P,extra:!0}),g-ee/2>b.z+30&&u.push({x:C+R/2,z:g,w:R,d:ee,panel:3,col:1,row:P,extra:!0})}return u}const Xt=(u,x)=>{let N=0;const G=()=>{const P=Math.sin(u*12.9898+x*78.233+N++*37.719)*43758.5453;return P-Math.floor(P)};return G.int=(P,g)=>P+Math.floor(G()*(g-P+1)),G.range=(P,g)=>P+G()*(g-P),G},jt=[[-10,16,0],[-10,16,34],[-10,16.5,66],[-11,26,98],[-11.5,30.5,128],[-9.5,25,176],[-3,10.5,232],[0,9,262],[0,8.5,330],[0,9,400],[3,9,442],[4.5,9.5,474],[2,25,492],[-5.5,47,513],[-9.5,60,537],[-1,72,557],[0,90,596],[0,114,628],[-2.5,142,658],[-8.5,164,694],[-12.5,178,734],[-11.5,185,776],[-5,189.5,808],[0,188,836],[0,188,870],[0,189.5,904],[-6,178,950],[5,158,1012],[30,198,1080],[38,200,1150],[36,186,1205],[42,173,1258],[38,176,1302],[20,154,1344],[5,119,1388],[0,83,1432],[0,44,1499.4],[0,26.5,1529.7],[0,9,1560]],gt=.95;var oa={id:"bed-went-walking",name:"The Bed Went Walking",category:"artists",placeKind:"city",after:"Winsor McCay, about 1869 to 1934",weirdness:.7,media:["air","open"],async build(u){const x=u.rng,N=H(u.quality?.detail??1,.5,1),G=u.vary||{},P=H(G.density??1,.7,1.3),g=new r.Scene,F=Qt(jt);await u.yield();const ve=x(),O=G.hour==="night"?"late":ve<.34?"sunday":ve<.56?"late":ve<.78?"snow":"mirror",B=!!G.rare,Y=O==="snow",be=O==="mirror",I=Ue.map(e=>new r.Color(e)),l={paper:I[0],lemon:I[1],salmon:I[2],green:I[3],powder:I[4],night:I[5],ink:I[6]},te=O==="late"?[l.salmon,l.powder,l.night,l.lemon]:[l.lemon,l.salmon,l.powder,l.night],pe=te.indexOf(l.night),Ke=e=>e===pe?[l.night,l.night,l.night,l.powder]:[l.lemon,l.salmon,l.powder,l.green,l.paper].filter(t=>t!==te[e]),$=Wt(Ue),L={...$,uCamZ:{value:0},uU:{value:0},uSnow:{value:Y?1:0},uMirror:{value:be?1:0},uWalk:{value:new r.Vector4(0,0,0,0)}},M={v:new r.Vector3,v2:new r.Vector3,m:new r.Matrix4,q:new r.Quaternion,s:new r.Vector3(1,1,1)},bt=[];await u.yield();const De=T.map(e=>new r.Vector4(e.z,e.x,e.w/2,e.h)),Xe=new r.ShaderMaterial({uniforms:{...L,uGate:{value:De},uSky:{value:te},uPanel:{value:0},uNight:{value:pe},uLemon:{value:l.lemon},uMoon:{value:new r.Vector3(.5,.52,.75).normalize()}},depthWrite:!1,depthTest:!1,side:r.BackSide,vertexShader:`
        varying vec3 vDir;
        void main(){
          vDir = position;
          vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.0);
          if (abs(p.w) < 1e-4) p.w = 1e-4;
          gl_Position = p.xyww;
        }`,fragmentShader:`
        ${_}
        uniform vec4 uGate[3]; uniform vec3 uSky[4]; uniform float uPanel, uNight; uniform vec3 uLemon, uMoon;
        varying vec3 vDir;
        // one gate: does the ray leave the panel it is in through this opening?  cur and alive are carried along
        void gate(vec4 g, float from, float stepTo, vec3 ro, vec3 rd, inout float cur, inout float alive){
          float act = alive * step(abs(cur - from), 0.5);
          float t = (g.x - ro.z) / (abs(rd.z) > 1e-5 ? rd.z : 1e-5);
          vec3 h = ro + rd * t;
          float inside = step(abs(h.x - g.y), g.z) * step(h.y, g.w) * step(0.0, h.y) * step(0.0, t);
          cur += act * inside * stepTo; alive *= 1.0 - act * (1.0 - inside);
        }
        void main(){
          vec3 rd = normalize(vDir + vec3(0.0, 1e-6, 0.0)), ro = cameraPosition;
          float cur = uPanel, alive = 1.0;
          if (rd.z > 0.0) { gate(uGate[0], 0.0, 1.0, ro, rd, cur, alive); gate(uGate[1], 1.0, 1.0, ro, rd, cur, alive); gate(uGate[2], 2.0, 1.0, ro, rd, cur, alive); }
          else { gate(uGate[2], 3.0, -1.0, ro, rd, cur, alive); gate(uGate[1], 2.0, -1.0, ro, rd, cur, alive); gate(uGate[0], 1.0, -1.0, ro, rd, cur, alive); }
          vec3 c = cur < 0.5 ? uSky[0] : cur < 1.5 ? uSky[1] : cur < 2.5 ? uSky[2] : uSky[3];
          float night = step(abs(cur - uNight), 0.5), ink = 0.0;
          // the moon: a flat lemon disc 8 degrees wide in a pen ring, its tint a hair off register
          float ang = acos(clamp(dot(rd, uMoon), -1.0, 1.0)), fa = max(fwidth(ang), 1e-6);
          float dm = (ang - 0.07) / fa;
          vec3 mside = normalize(cross(uMoon, vec3(0.0, 1.0, 0.0)));
          vec3 mup = cross(mside, uMoon);
          float tin = step(length(vec2(dot(rd, mside), dot(rd, mup)) - fa * vec2(2.2, 1.6)), 0.07);
          c = mix(c, mix(uPaper, uLemon, tin), night * step(dm, 0.0));
          ink = max(ink, night * (1.0 - smoothstep(uLine - 0.5, uLine + 0.5, abs(dm))));
          // forty small pen asterisks
          vec2 sp = vec2(atan(rd.x, abs(rd.z) + abs(rd.x) < 1e-5 ? 1.0 : rd.z), asin(clamp(rd.y, -1.0, 1.0))) / 0.15;
          vec2 id = floor(sp), f = fract(sp) - 0.5;
          float hsh = fract(sin(dot(id, vec2(127.1, 311.7))) * 43758.5453), h2 = fract(hsh * 57.31);
          vec2 q = f - (vec2(hsh, h2) - 0.5) * 0.5;
          float fq = max(fwidth(sp.y), 1e-6), r = length(q), star = 0.0;
          for (int k = 0; k < 3; k++) { float a = 1.0472 * float(k) + hsh * 3.0 + uTime * 0.3 * (h2 - 0.8); star = max(star, 1.0 - smoothstep(uLine - 0.5, uLine + 0.5, abs(dot(q, vec2(cos(a), sin(a)))) / fq)); }
          star *= step(r, 0.085 + 0.05 * h2) * step(0.62, h2) * step(0.06, rd.y) * step(ang, 3.0) * step(0.11, ang);
          ink = max(ink, night * star);
          gl_FragColor = vec4(mix(c, uInk, ink), 1.0);
        }`}),Le=new r.Mesh(new r.IcosahedronGeometry(50,3),Xe);Le.frustumCulled=!1,Le.renderOrder=-10,g.add(Le);const zt=new r.ShaderMaterial({uniforms:{...L,uGateZ:{value:new r.Vector3(T[0].z,T[1].z,T[2].z)},uGreen:{value:l.green},uCheck:{value:l.salmon}},vertexShader:`varying vec3 vW; varying float vVz;
        void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vec4 mv = viewMatrix * w; vVz = -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`
        ${_}
        uniform vec3 uGateZ, uGreen, uCheck; varying vec3 vW; varying float vVz;
        const float COURT_X = ${b.x.toFixed(1)}, COURT_Z = ${b.z.toFixed(1)};
        // a square wave of period 2 that fades to its mean before it can alias
        float sq(float v){ float f = max(fwidth(v), 1e-6); float s = clamp((abs(fract(v * 0.5) - 0.5) - 0.25) / f * 2.0, -0.5, 0.5) * 2.0; return s * (1.0 - smoothstep(0.3, 0.7, f)); }
        float gl(float v){ return mcLine(v) * (1.0 - smoothstep(0.055, 0.1, fwidth(v))); }   // joints only while a flag is over about 12 px: further off the checks alone carry it
        float edge(float d){ float f = max(fwidth(d), 1e-6); return 1.0 - smoothstep(uLine - 0.5, uLine + 0.5, abs(d) / f); }
        void main(){
          vec2 p = vW.xz;
          vec2 pt = p - (dFdx(p) * uReg.x - dFdy(p) * uReg.y);       // where the tint plate reads: a hair up and right
          float ax = abs(p.x), axt = abs(pt.x);
          float gut = min(min(abs(p.y - uGateZ.x), abs(p.y - uGateZ.y)), abs(p.y - uGateZ.z)) - 6.0;
          float gutT = min(min(abs(pt.y - uGateZ.x), abs(pt.y - uGateZ.y)), abs(pt.y - uGateZ.z)) - 6.0;
          float fore = step(${E.toFixed(1)}, p.y) * step(-${C.toFixed(1)}, p.x) * step(p.x, COURT_X) * step(p.y, COURT_Z);
          float foreT = step(${E.toFixed(1)}, pt.y) * step(-${C.toFixed(1)}, pt.x) * step(pt.x, COURT_X) * step(pt.y, COURT_Z);
          // tint plate
          vec3 c = uPaper;
          float av = step(axt, ${ce.toFixed(1)}) * step(0.0, gutT) * (1.0 - foreT);
          c = mix(c, mix(uPaper, uGreen, 0.5 + 0.5 * sq(pt.x / 4.0 + 0.5) * sq(pt.y / 4.0)), av);
          vec2 d8 = vec2(pt.x + pt.y, pt.x - pt.y) / 8.485;
          c = mix(c, mix(uPaper, uCheck, 0.5 + 0.5 * sq(d8.x) * sq(d8.y)), foreT);
          // line plate
          float ink = 0.0, open = step(0.0, gut);
          float inAv = step(ax, ${ce.toFixed(1)}) * open * (1.0 - fore);
          ink = max(ink, inAv * max(gl(p.x / 4.0 + 0.5), gl(p.y / 4.0)));
          vec2 e8 = vec2(p.x + p.y, p.x - p.y) / 8.485;
          ink = max(ink, fore * max(gl(e8.x), gl(e8.y)));
          float pave = step(${ce.toFixed(1)}, ax) * step(ax, ${C.toFixed(1)}) * open * (1.0 - fore);
          ink = max(ink, pave * gl(p.y / 2.0));
          ink = max(ink, open * (1.0 - fore) * max(edge(ax - ${ce.toFixed(1)}), edge(ax - ${(ce+.5).toFixed(1)})));
          // the side streets between the columns of blocks: paving ruled, left untinted
          float sx = mod(ax - ${C.toFixed(1)}, ${ye.toFixed(1)});
          float street = step(${C.toFixed(1)}, ax) * step(${R.toFixed(1)}, sx) * open * (1.0 - fore);
          ink = max(ink, street * max(gl(p.y / 8.0), max(edge(sx - ${(R+4).toFixed(1)}), edge(sx - ${(ye-4).toFixed(1)}))));
          ink = max(ink, edge(gut) * (1.0 - fore));                    // the gutter of the page, ruled off
          ink = max(ink, edge(p.y - ${E.toFixed(1)}) * step(-${C.toFixed(1)}, p.x) * step(p.x, COURT_X));
          ink *= 1.0 - smoothstep(900.0, 1500.0, vVz);
          gl_FragColor = vec4(mix(c, uInk, clamp(ink, 0.0, 1.0)), 1.0);
        }`}),je=new r.Mesh(new r.PlaneGeometry(9e3,9e3).rotateX(-Math.PI/2),zt);je.position.set(0,0,1e3),g.add(je);const fe=new r.MeshBasicMaterial({color:l.ink}),Te=new r.BoxGeometry(1,1,1).translate(0,.5,0),kt=T.map(e=>{const t=new r.Group;t.position.set(e.x,0,e.z);const a=[-1,1].map(i=>{const o=new r.Mesh(Te,fe);return o.position.x=i*(e.w/2+.75),o.scale.set(1.5,e.h,1.5),t.add(o),o}),n=new r.Mesh(Te,fe);n.scale.set(e.w+3,1.5,1.5),n.position.y=e.h,t.add(n);const s=new r.Mesh(Te,fe);return s.scale.set(e.w+3,.12,1.5),t.add(s),g.add(t),{g:e,posts:a,top:n}});await u.yield();const me=(()=>{const e=[],t=(n,s)=>{const i=n.attributes.position.count;return n.setAttribute("part",new r.BufferAttribute(new Float32Array(i).fill(s),1)),n.deleteAttribute("uv"),n.index?n.toNonIndexed():n};e.push(t(new r.BoxGeometry(1,1,1,1,6,1).translate(0,.5,0),0)),e.push(t(new r.BoxGeometry(1,1,1).translate(0,.5,0),1)),e.push(t(new r.CylinderGeometry(1,1,1,8,1,!1).translate(0,.5,0),2)),e.push(t(new r.ConeGeometry(1.12,.45,8,1,!0).translate(0,1.22,0),2));const a=Re(e,!1);return e.forEach(n=>n.dispose()),a})();await u.yield();const He=Dt(),ze=He.filter(e=>e.col===-1&&e.panel>=1&&!(e.panel===1&&e.row<6)).sort((e,t)=>e.z-t.z),D=B?ze.slice(0,6):[],Mt=B?ze[4].z-ze[0].z:0,Pt=B?new Set(ze.slice(6,10)):new Set,Je=He.filter(e=>!Pt.has(e)),ae=Je.length,et=new Float32Array(ae*4),tt=new Float32Array(ae*4),at=new Float32Array(ae*3),ot=new Float32Array(ae*4),Be=[];for(let e=0;e<ae;e++){const t=Je[e],a=t.extra?Xt(t.x,t.z):x,n=[[8,12],[12,20],[20,30],[20,30]][t.panel],s=Math.abs(t.col)===1,i=Math.round(J(9,29,y(40,790,t.z)));let o=H(i+a.int(-2,2)-(s?0:a.int(0,3)),n[0],30);s&&t.panel===2&&(o=55+o%3),t.panel===3&&t.col>=2&&t.col<=3&&t.z>1200&&t.z<1500&&(o=62+(t.row*5+t.col*3)%4*5),t.panel===3&&t.col===-1&&t.z>1220&&t.z<1440&&(o=44+t.row*7%5*6);const v=Ke(t.panel);let p=v[a.int(0,v.length-1)];s&&t.z>470&&p===l.paper&&(p=v[(t.row+(t.col>0?1:0))%(v.length-1)]);const m=D.indexOf(t)+1;et.set([t.x,t.z,t.w,t.d],e*4),tt.set([m?24:o,a.int(19,23),a.int(17,20),t.panel],e*4),at.set([p.r,p.g,p.b],e*3),ot.set([a(),m?1:0,a.range(-.3,.3),t.panel===2&&be?1:0],e*4),t.h=(m?24:o)*ge,t.walker=m,Be.push(t)}me.setAttribute("iPos",new r.InstancedBufferAttribute(et,4)),me.setAttribute("iInfo",new r.InstancedBufferAttribute(tt,4)),me.setAttribute("iCol",new r.InstancedBufferAttribute(at,3)),me.setAttribute("iAux",new r.InstancedBufferAttribute(ot,4));const Ge=`
      // how many storeys a block has by now: the page stretches ahead of us, a storey at a time
      float storeysNow(float S, float z){ float g = smoothstep(z - 560.0, z - 150.0, uCamZ); return S * (0.58 + 0.42 * g); }
      float heightOf(float sNow){ return ${ge.toFixed(2)} * (floor(sNow) + smoothstep(0.0, 0.3, fract(sNow))); }`,At=new r.ShaderMaterial({uniforms:{...L,uNightP:{value:pe},uNightC:{value:l.night}},vertexShader:`
        attribute float part; attribute vec4 iPos, iInfo, iAux; attribute vec3 iCol;
        uniform float uCamZ, uMirror, uSnow; uniform vec4 uWalk;
        varying vec2 vUV, vSize; varying vec4 vInfo; varying vec3 vCol, vNw, vVp; varying float vPart, vGrow;
        ${Ge}
        void main(){
          float sNow = storeysNow(iInfo.x, iPos.y), H = heightOf(sNow);
          vec3 p = position, n = normal; vec2 uv, size; float bays = iInfo.y;
          float w = iPos.z, d = iPos.w;
          if (part < 0.5) {
            float bow = 1.0 + iAux.w * uMirror * 0.36 * sin(position.y * 5.6 + uCamZ * 0.012 + iPos.y * 0.01);
            p = vec3(position.x * w * bow, position.y * H, position.z * d);
            if (abs(normal.x) > 0.5) { uv = vec2((position.z * sign(normal.x) + 0.5) * d, p.y); size = vec2(d, H); bays = iInfo.z; }
            else if (abs(normal.z) > 0.5) { uv = vec2((0.5 - position.x * sign(normal.z)) * w, p.y); size = vec2(w, H); }
            else { uv = (position.xz + 0.5) * vec2(w, d); size = vec2(w, d); }
          } else if (part < 1.5) {
            float bowTop = 1.0 + iAux.w * uMirror * 0.36 * sin(5.6 + uCamZ * 0.012 + iPos.y * 0.01);
            p = vec3(position.x * (w * bowTop + 2.4), H + position.y * 1.7 - 0.2, position.z * (d + 2.4));
            if (abs(normal.x) > 0.5) { uv = vec2((position.z + 0.5) * (d + 2.4), position.y * 1.7); size = vec2(d + 2.4, 1.7); }
            else if (abs(normal.z) > 0.5) { uv = vec2((position.x + 0.5) * (w + 2.4), position.y * 1.7); size = vec2(w + 2.4, 1.7); }
            else { uv = (position.xz + 0.5) * vec2(w + 2.4, d + 2.4); size = vec2(w + 2.4, d + 2.4); }
          } else {
            p = vec3(position.x * 3.2 + iAux.z * w, H + 1.5 + position.y * 5.0, position.z * 3.2 + iAux.z * d * 0.8);
            uv = vec2(atan(position.z, position.x + 1e-5) * 1.2732, position.y); size = vec2(8.0, 1.0);
          }
          p.xz += iPos.xy;
          p.y += iAux.y * uWalk.x; p.z += iAux.y * uWalk.y; p.x += iAux.y * uWalk.x * 0.04 * sin(uWalk.z * 6.283 + iPos.y);
          vec4 mv = viewMatrix * vec4(p, 1.0);
          vUV = uv; vSize = size; vInfo = vec4(floor(sNow), bays, iInfo.w, fract(sNow)); vCol = iCol; vNw = n; vVp = mv.xyz; vPart = part; vGrow = fract(sNow);
          gl_Position = projectionMatrix * mv;
        }`,fragmentShader:`
        ${_}
        uniform float uNightP, uSnow; uniform vec3 uNightC;
        varying vec2 vUV, vSize; varying vec4 vInfo; varying vec3 vCol, vNw, vVp; varying float vPart, vGrow;
        float pen(float dpx){ return 1.0 - smoothstep(uLine - 0.5, uLine + 0.5, abs(dpx)); }
        // ruled shade whose lines sit about px pixels apart ON SCREEN (so a wall seen steeply is not ruled black): lines are added or dropped in powers of two
        float ruleFw(float v, float px){ float f = max(fwidth(v), 1e-7); return mcLine(v * exp2(floor(log2(clamp(1.0 / (px * f), 1.0, 4096.0)) + 0.5))); }
        void main(){
          vec2 fw = max(fwidth(vUV), vec2(1e-6));
          float viewZ = max(-vVp.z, 0.05), shade = mcShadeOf(vNw), ink = 0.0, reg = 1.0;
          float night = step(abs(vInfo.z - uNightP), 0.5);
          vec3 tint = vCol;
          vec2 eb = min(vUV, vSize - vUV) / fw;                         // pixels to the nearest edge of this face
          if (vPart < 0.5 && abs(vNw.y) < 0.5) {
            // a wall: the same window in every bay of every storey, arched on the top storey
            float bw = vSize.x / max(vInfo.y, 1.0), sh = ${ge.toFixed(2)};
            vec2 cell = vec2(vUV.x / bw, vUV.y / sh), id = floor(cell), f = fract(cell) - vec2(0.5, 0.5);
            vec2 m = f * vec2(bw, sh), half_ = vec2(bw * 0.27, sh * 0.31);
            float top = step(vInfo.x - 1.5, id.y);
            float born = 1.0 - top * step(vInfo.w * (vInfo.y + 1.0) * 1.3, id.x + 0.5) * step(vInfo.w, 0.76);   // the newest row, a window at a time
            vec2 q = (abs(m) - half_) / fw;
            float sd = max(q.x, q.y);
            vec2 am = vec2(m.x, m.y - (half_.y - half_.x)); float al = max(length(am), 1e-4);
            float sdArc = (al - half_.x) / max(length(am / al * fw), 1e-6);
            sd = mix(sd, max(q.x, max((-m.y - half_.y) / fw.y, sdArc)), top * step(0.0, am.y));
            // what a bay shows by its size on screen, each step lighter than the last, so a wall always reads first as its
            // tint: frame, sash, sill and every storey course (big); a plain hairline rectangle of paper; the same with only
            // its left and lower side inked; every fourth storey line; flat tint.
            float bayPx = min(bw / fw.x, sh / fw.y), shPx = sh / fw.y;
            float v0 = mix(5.0, 4.0, night), vis = smoothstep(v0, v0 + mix(2.5, 1.0, night), bayPx) * born, det = smoothstep(21.0, 30.0, bayPx);
            float full = smoothstep(12.0, 16.0, bayPx), ell = q.x > q.y ? step(m.x, 0.0) : step(m.y, 0.0);
            float pane = step(sd, 0.0) * vis;
            ink = max(ink, pen(sd) * vis * max(full, ell));
            ink = max(ink, det * pane * max(pen(m.y / fw.y), pen(m.x / fw.x) * step(m.y, 0.0)));          // sash bars
            ink = max(ink, det * vis * pen((m.y + half_.y + 0.22) / fw.y) * step(abs(m.x), half_.x + 0.3));  // sill
            float nearest = floor(cell.y + 0.5), fourth = mod(nearest + 2.0, 4.0) < 0.5 ? 1.0 : 0.0;
            ink = max(ink, mcLine(cell.y) * (1.0 - pane) * max(det, fourth * smoothstep(4.5, 6.5, shPx)));   // storey course
            // ornament in the same pen: a band course under the top storey and over the ground floor, quoins up the corners
            float band = max(step(abs(id.y - (vInfo.x - 2.0)), 0.5), step(id.y, 0.5)) * det;
            ink = max(ink, band * (1.0 - pane) * pen((f.y + 0.08) * shPx));
            float cornerD = min(vUV.x, vSize.x - vUV.x), quoin = step(cornerD, 0.9) * det;
            ink = max(ink, max(quoin * mcLine(cell.y * 2.0), det * pen((cornerD - 0.9) / fw.x)));
            float ruleVis = smoothstep(15.0, 22.0, bayPx);                                             // ruled shade only where a bay is big enough to carry it
            ink = max(ink, shade * (1.0 - pane) * ruleVis * ruleFw(vUV.y / (sh * 8.0), 12.5 * uLine));
            tint = mix(tint, uPaper, pane);
            reg = mcEdgeReg(vUV, vSize);
            ink = max(ink, max(pen(eb.x - uLine), pen(eb.y - uLine) * step(sh, vUV.y)));
          } else if (vPart < 1.5) {
            // roof (flat tint, a parapet line) or cornice (bare paper, dentils, ruled underneath)
            float roof = step(vPart, 0.5), flatTop = step(0.5, vNw.y);
            tint = mix(uPaper, mix(vCol, uPaper, uSnow), flatTop);
            ink = max(ink, pen(min(eb.x, eb.y) - uLine));
            ink = max(ink, roof * pen(min(eb.x, eb.y) - 1.4 / max(fw.x, fw.y)));
            float side = (1.0 - roof) * step(abs(vNw.y), 0.5);
            ink = max(ink, side * mcLine(vUV.x / 1.3) * step(vUV.y, 0.9) * smoothstep(3.0, 5.0, 1.3 / fw.x));
            ink = max(ink, side * pen((vUV.y - 0.9) / fw.y));
            ink = max(ink, (1.0 - roof) * shade * mcRule(vUV.x / 16.0, 16.0, viewZ) * step(vNw.y, -0.5));
            reg = mix(mcEdgeReg(vUV, vSize), 1.0, roof * 0.0);
            if (flatTop > 0.5) {
              // skylights: he never left a roof bare. A paper light in a pen frame with one glazing bar, on or off by its size on screen
              vec2 cs = vec2(11.0, 9.5), sc = vUV / cs, si = floor(sc), sm = (fract(sc) - 0.5) * cs, cc = (si + 0.5) * cs;
              float on = step(0.4, fract(sin(dot(si + vec2(vInfo.y, vInfo.x), vec2(12.9898, 78.233))) * 43758.5453));
              vec2 mg = step(vec2(5.0, 4.4), min(cc, vSize - cc));
              vec2 sq = (abs(sm) - vec2(2.9, 1.9)) / fw; float ssd = max(sq.x, sq.y);
              float sPx = min(cs.x / fw.x, cs.y / fw.y), sv = smoothstep(6.5, 7.5, sPx) * on * mg.x * mg.y;
              tint = mix(tint, uPaper, step(ssd, 0.0) * sv);
              ink = max(ink, sv * max(pen(ssd), step(ssd, 0.0) * pen(sm.x / fw.x) * step(16.0, sPx)));
            }
          } else {
            // the water tank: staves, a hoop, a contour
            tint = mix(mix(vCol, uPaper, 0.0), uPaper, max(uSnow, night));
            vec3 N = normalize(vNw + vec3(0.0, 1e-5, 0.0));
            ink = max(ink, mcLine(vUV.x * 1.0) * step(vUV.y, 1.0) * smoothstep(3.0, 6.0, 1.0 / fw.x));
            ink = max(ink, mcLine(vUV.y * 2.0) * step(vUV.y, 1.01));
            ink = max(ink, shade * mcRule(vUV.x / 8.0, 20.0, viewZ));
          }
          gl_FragColor = vec4(mcFinish(tint, ink, reg), 1.0);
        }`});await u.yield();const nt=new r.InstancedMesh(me,At,ae);nt.frustumCulled=!1,g.add(nt),await u.yield();const X=[],it=e=>F.pointAt(e,M.v).z,oe=[[0,40],[.03,38],[.07,15],[.1,22],[.15,40],[.25,36],[.3,-12],[.31,-11.5],[.318,-8],[.325,3],[.335,20],[.342,30.5],[.355,34],[.4,31],[.43,24],[.47,15],[.5,5],[.535,5],[.565,5],[.578,20],[.59,30],[.64,70],[.7,62],[.75,60],[.79,34],[.82,42],[.86,30],[.9,30],[.925,58]].map(([e,t])=>[e,it(e)+t]);oe.push([gt,We[2]],[1,We[2]]);for(let e=1;e<oe.length;e++)oe[e][1]=Math.max(oe[e][1],oe[e-1][1]+.5);const St=(e,t)=>{if(t<=e[0][0])return e[0][1];for(let a=1;a<e.length;a++)if(t<=e[a][0])return J(e[a-1][1],e[a][1],(t-e[a-1][0])/(e[a][0]-e[a-1][0]));return e[e.length-1][1]},Vt=(e,t,a,n,s)=>y(e,t,s)*(1-y(a,n,s)),Ct=e=>y(.575,.64,e)*(1-y(.826,.868,e)),Ut=e=>[Q.domeX*Ct(e),St(oe,e)],Ft=(e,t)=>.985*t+3.5-.36*t*y(.315,.345,e)*(1-y(.355,.43,e))-6*Vt(.552,.566,.574,.59,e)+140*y(.578,.615,e)*(1-.76*y(.635,.69,e)-.1*y(.725,.79,e))*(1-y(.83,.868,e)),ne=[[0,12],[.1,30],[.24,90],[.45,180],[.82,180],[.856,116],[.895,80],[.925,48],[.95,15],[1,15]],Lt=e=>{for(let t=1;t<ne.length;t++)if(e<=ne[t][0])return J(ne[t-1][1],ne[t][1],y(ne[t-1][0],ne[t][0],e));return 15},ie=new r.Vector3,Tt=(e,t,a,n)=>{const s=e===0?17+23*y(.82,1,a):e===1?12:10;F.posAtDist(Math.min(t*F.length+s,F.length),ie),e===0?(ie.x+=-6.5*Math.cos(a*4),ie.y+=-3.2+2.2*Math.sin(a*9)):(ie.x+=(e===1?5.4:-6.5)*(1-.6*a),ie.y+=(e===1?2.5:2)*Math.cos(a*4));const i=e===0?y(.04,.32,a):y(.05,.36,a)*(1-y(.82,1,a));n.lerp(ie,i)},Bt=(e,t,a,n)=>{if(n>.572&&n<.836&&a>Q.z0-4&&a<Q.z1+6&&t>36){let s=Fe[0];for(const i of Fe)Math.abs(i.z-a)<Math.abs(s.z-a)&&(s=i);return[Q.domeX+(e<2?-2.6:2.6),s.h,s.z+(e%2?2.4:-2.4)]}Math.abs(a-469.2)<12&&(a=469.2+(a<469.2?-14:14));for(const s of T)Math.abs(a-s.z)<4&&(a=s.z+(a<s.z?-5:5));return[t,0,a]},Ie=[Q.domeX,Q.spireH,Q.spireZ],S=await Et(u,{preview:!1,palette:Ue,detail:N,course:Ut,bodyY:Ft,groundAt:Bt,uLand:gt,landing:We,landHalf:7.4,snagU:.82,snagPoint:Ie,snow:Y,style:$,lengthAt:Lt,loose:Tt});g.add(S.object),await u.yield();const st=(e,t="",a="")=>(e.vertexShader=a+e.vertexShader.replace("vec3 p = position;","vec3 p = position;"+t).replace("modelViewMatrix * vec4(p, 1.0)","modelViewMatrix * instanceMatrix * vec4(p, 1.0)").replace("vNv = normalMatrix * normal; vNw = mat3(modelMatrix) * normal;","vNv = normalMatrix * (mat3(instanceMatrix) * normal); vNw = mat3(modelMatrix) * (mat3(instanceMatrix) * normal);").replace("vec4(normalMatrix * normal, 0.0)","vec4(normalMatrix * (mat3(instanceMatrix) * normal), 0.0)"),e),Gt=st(Qe({style:$})),It=st(Ee({style:$})),qt=Qe({style:$}),Nt=Ee({style:$}),rt=(e,t,a,n=g)=>{const s=new r.Mesh(e,t),i=new r.Mesh(e,a);return s.frustumCulled=i.frustumCulled=!1,n.add(s,i),[s,i]},lt=(e,t)=>{const a=new r.InstancedMesh(e,Gt,t.length),n=new r.InstancedMesh(e,It,t.length);return t.forEach((s,i)=>{a.setMatrixAt(i,s),n.setMatrixAt(i,s)}),a.frustumCulled=n.frustumCulled=!1,g.add(a,n),[a,n]},q=(e,t,a,n=1,s=1,i=1,o=0)=>new r.Matrix4().compose(new r.Vector3(e,t,a),new r.Quaternion().setFromAxisAngle(new r.Vector3(0,1,0),o),new r.Vector3(n,s,i)),qe=(e,t)=>{const a=e.attributes.crease,n=e.attributes.rule;for(let s=0;s<a.count;s++)a.setX(s,n.getX(s)*t);return e},_t=new r.ShaderMaterial({uniforms:{...L},side:r.DoubleSide,vertexShader:`
        attribute vec3 sCol; attribute vec2 sPat;
        varying vec2 vUV, vSize, vPat; varying vec3 vCol, vNw, vVp;
        void main(){
          vec3 sc = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
          vec3 q = (position + 0.5) * sc;
          if (abs(normal.x) > 0.5) { vUV = q.zy; vSize = sc.zy; } else if (abs(normal.z) > 0.5) { vUV = q.xy; vSize = sc.xy; } else { vUV = q.xz; vSize = sc.xz; }
          vec3 n = mat3(modelMatrix) * (mat3(instanceMatrix) * normal);
          vNw = n / max(length(n), 1e-5); vCol = sCol; vPat = sPat;
          vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0); vVp = mv.xyz;
          gl_Position = projectionMatrix * mv;
        }`,fragmentShader:`
        ${_}
        varying vec2 vUV, vSize, vPat; varying vec3 vCol, vNw, vVp;
        float pen(float dpx){ return 1.0 - smoothstep(uLine - 0.5, uLine + 0.5, abs(dpx)); }
        void main(){
          vec2 fw = max(fwidth(vUV), vec2(1e-6)), eb = min(vUV, vSize - vUV) / fw;
          float viewZ = max(-vVp.z, 0.05), wall = step(abs(vNw.y), 0.5), pitch = max(vPat.y, 0.05);
          float ink = pen(min(eb.x, eb.y) - uLine), keep = 1.0, pane = 0.0;
          float shade = mcShadeOf(vNw) * mcRule(vUV.y / 8.0, 8.0, viewZ);
          vec3 tint = vCol;
          if (vPat.x > 0.5 && vPat.x < 1.5) ink = max(ink, wall * mcLine(vUV.x / pitch));
          else if (vPat.x < 2.5 && vPat.x > 1.5) {
            float chord = step(min(vUV.y, vSize.y - vUV.y), 0.5);
            float lat = max(mcLine((vUV.x + vUV.y) / pitch), max(mcLine((vUV.x - vUV.y) / pitch), mcLine(vUV.x / pitch)));
            ink = max(ink, wall * lat); keep = max(max(chord, 1.0 - wall), step(0.3, ink));
            ink = max(ink, wall * chord * pen((min(vUV.y, vSize.y - vUV.y) - 0.5) / fw.y));
          } else if (vPat.x < 3.5 && vPat.x > 2.5) {
            vec2 c = vec2(fract(vUV.x / pitch) - 0.5, vUV.y / vSize.y - 0.64) * vec2(pitch, vSize.y);
            vec2 q = (abs(c) - vec2(pitch * 0.34, vSize.y * 0.17)) / fw; float sd = max(q.x, q.y), vis = wall * smoothstep(4.0, 6.0, pitch / fw.x);
            pane = step(sd, 0.0) * vis; ink = max(ink, pen(sd) * vis); ink = max(ink, wall * pen((vUV.y - vSize.y * 0.36) / fw.y));
          } else if (vPat.x > 3.5) {
            vec2 c = vec2((fract(vUV.x / pitch) - 0.5) * pitch, vUV.y - vSize.y * 0.56);
            float hw = pitch * 0.3, al = max(length(c), 1e-4);
            float sd = c.y > 0.0 ? (al - hw) / max(length(c / al * fw), 1e-6) : (abs(c.x) - hw) / fw.x;
            float vis = wall * smoothstep(4.0, 6.0, pitch / fw.x);
            pane = step(sd, 0.0) * vis; ink = max(ink, pen(sd) * vis);
            ink = max(ink, pane * mcRule(vUV.x / 8.0, 8.0, viewZ)); pane = 0.0;
            ink = max(ink, wall * pen((vUV.y - vSize.y * 0.9) / fw.y));
          }
          if (keep < 0.5) discard;
          ink = max(ink, shade * (1.0 - pane));
          gl_FragColor = vec4(mcFinish(mix(tint, uPaper, pane), ink, mcEdgeReg(vUV, vSize)), 1.0);
        }`}),ct=new r.BoxGeometry(1,1,1);ct.deleteAttribute("uv");const Ne=(e,t=g)=>{const a=ct.clone(),n=e.length,s=new Float32Array(n*3),i=new Float32Array(n*2),o=new r.InstancedMesh(a,_t,n);return e.forEach((v,p)=>{o.setMatrixAt(p,v.m),s.set([v.c.r,v.c.g,v.c.b],p*3),i.set([v.pat||0,v.pitch||1],p*2)}),a.setAttribute("sCol",new r.InstancedBufferAttribute(s,3)),a.setAttribute("sPat",new r.InstancedBufferAttribute(i,2)),o.frustumCulled=!1,t.add(o),o},vt=[],V=(e,t,a,n,s,i,o,v=0,p=1,m=0)=>vt.push({m:q(e,t+s/2,a,n,s,i,m),c:o,pat:v,pitch:p});await u.yield();const c=Q,ue=O==="late"?l.salmon:l.lemon,se=c.z1-c.z0,re=(c.z0+c.z1)/2;V((c.x0+c.x1)/2,0,re,c.x1-c.x0+6,1,se+6,l.paper,1,3),V((c.x0+c.x1)/2,1,re,c.x1-c.x0+2,1,se+2,l.paper,1,3),V((c.x0+c.x1)/2+5,2,re,c.x1-c.x0-12,c.colY,se-8,ue,4,12),V((c.x0+c.x1)/2,2+c.colY,re,c.x1-c.x0,c.roofY-c.colY-2,se,l.paper,1,1.6);for(const[e,t,a,n]of[[c.x0+.4,re,.6,se],[c.x1-.4,re,.6,se],[(c.x0+c.x1)/2,c.z0+.4,c.x1-c.x0,.6],[(c.x0+c.x1)/2,c.z1-.4,c.x1-c.x0,.6]])V(e,c.roofY,t,a,2.4,n,l.paper,1,.9);{const e=[];for(let i=0;i<=9;i++){const o=i/9;e.push([1.25*(1-.14*o*o),2.2+o*(c.colY-4.4),0])}const a=[qe(Z(e,10,l.paper),5),Z([[0,0,0],[1.9,0,1],[1.9,.8,1],[1.5,1,1],[1.7,1.5,0],[1.4,2.2,1]],10,l.paper),Z([[1.08,c.colY-2.2,1],[1.3,c.colY-1.8,0],[1.2,c.colY-1.3,1],[1.9,c.colY-.7,1],[1.9,c.colY,1],[0,c.colY,0]],10,l.paper)],n=Re(a,!1);a.forEach(i=>i.dispose()),await u.yield();const s=[];for(let i=c.z0+5;i<c.z1-2;i+=12)for(const o of[-1.9,1.9])s.push(q(c.x0+2.6,2,i+o));for(let i=c.x0+14;i<c.x1-6;i+=12)for(const o of[-1.9,1.9])s.push(q(i+o,2,c.z1-2.6));for(let i=E+12;i<b.z-4;i+=12)for(const o of[-1.9,1.9])s.push(q(b.x+3.6,2,i+o));for(let i=-C+8;i<b.x-4;i+=12)for(const o of[-1.9,1.9])s.push(q(i+o,2,b.z+3.6));lt(n,s)}{const e=b.z-E-3,t=E+3+e/2,a=(b.x+22-C+1)/2,n=b.x+22+C-1;V(b.x+11,0,t,22,1,e,l.paper,1,3),V(b.x+11,1,t,20,1,e,l.paper,1,3),V(b.x+14,2,t,12,c.colY,e-6,ue,4,12),V(b.x+11,2+c.colY,t,20,c.roofY-c.colY-2,e,l.paper,1,1.6),V(b.x+1.4,c.roofY,t,.6,2.4,e,l.paper,1,.9),V(a,0,b.z+11,n,1,22,l.paper,1,3),V(a,1,b.z+11,n-2,1,20,l.paper,1,3),V(a,2,b.z+14,n-10,c.colY,12,ue,4,12),V(a,2+c.colY,b.z+11,n-2,c.roofY-c.colY-2,20,l.paper,1,1.6),V(a,c.roofY,b.z+1.4,n-2,2.4,.6,l.paper,1,.9)}await u.yield();{const e=[],t=(s,i,o,v,p,m=28)=>{const d=o*1.3,w=v-d-12,f=q(s,0,i),A=[[0,c.roofY,0],[o+4,c.roofY,1],[o+4,c.roofY+5,1],[o+1,c.roofY+6,1]],h=Math.min(c.roofY+16,w-14);A.push([o+1,h,1],[o+2.2,h+.8,1],[o+2.2,h+2,1],[o-.5,h+2.6,1]),e.push(Z(A,m,l.paper,f)),e.push(qe(Z([[o-.5,h+2.6,0],[o-.5,w-4.4,0]],m,ue,f),m)),e.push(Z([[o-.5,w-4.4,1],[o+2.6,w-3.6,1],[o+2.6,w-.8,1],[o,w,1]],m,l.paper,f));const k=[];for(let K=0;K<=12;K++){const Ce=K/12*1.44;k.push([o*Math.cos(Ce),w+d*Math.sin(Ce)/Math.sin(1.44),K===0?1:0])}e.push(qe(Z(k,m,p,f),16));const U=w+d,W=o*Math.cos(1.44);return e.push(Z([[W+.8,U-.4,1],[W+.8,U+.6,1],[W-.3,U+.9,1],[W-.3,U+6.5,1],[W+.9,U+7,1],[W+.9,U+7.8,1],[1,U+10.4,1],[.7,U+10.6,0],[1.3,v-1.5,0],[1.2,v-.5,0],[0,v,0]],14,l.paper,f)),U},a=(s,i)=>Y?l.paper:s===pe?l.powder:[l.powder,l.green,l.salmon].filter(o=>o!==te[s]&&o!==ue)[i%2];for(let s=0;s<Fe.length;s++){const i=Fe[s];await u.yield(),i.lantern=t(c.domeX,i.z,i.r,i.h,a(yt(i.z),s))}await u.yield(),t(b.x+14,1512,9.5,86,a(3,0),20),await u.yield(),t((b.x-C)/2,b.z+14,11,96,a(3,1),20),await u.yield();const n=Re(e,!1);e.forEach(s=>s.dispose()),rt(n,qt,Nt)}await u.yield();const _e={value:new r.Vector2},pt=e=>(e.vertexShader=`uniform vec2 uBend;
`+e.vertexShader.replace("vec3 p = position;","vec3 p = position; p.xz += uBend * (p.y / 190.0) * (p.y / 190.0);"),e.uniforms.uBend=_e,e);{const e=[[0,c.roofY,0],[9,c.roofY,1],[9,58,1],[10.2,59,1],[10.2,62,1],[7,64,1],[7,86,1],[8,87,1],[8,90,1],[5.2,93,1]];for(let n=99;n<184;n+=6)e.push([.5+4.7*(186-n)/93,n,n%12<6?1:0]);e.push([.5,186,1],[1.2,187,0],[1.2,188.6,0],[0,189.4,0]),rt(Z(e,14,l.paper,q(c.domeX,0,c.spireZ)),pt(Qe({style:$})),pt(Ee({style:$})));let t=0,a=0;X.push(n=>{const s=y(.806,.818,n)*(1-y(.84,.846,n));if(n<.846){let i=S.feet[2].x-c.domeX,o=S.feet[2].z-c.spireZ;const v=Math.hypot(i,o);v>46&&(i*=46/v,o*=46/v),_e.value.set(i*s,o*s),n>.83&&(t=i,a=o)}else{const i=n-.846,o=Math.exp(-i*42)*Math.cos(i*300)*.8;_e.value.set(t*o,a*o)}})}await u.yield();const le=469.2,xe=18;for(const e of[-3.6,3.6])V(0,xe-3.4,le+e,1500,3.4,.3,l.paper,2,6.8);V(0,xe-3.9,le,1500,.5,7.5,l.paper,1,2);for(let e=21;e<740;e+=30)for(const t of[-1,1])for(const a of[-3,3])V(t*e,0,le+a,1.6,xe-3.9,1.6,l.paper,2,3.2);const Zt=l.salmon,ke=new r.Group;ke.position.set(-400,xe,le),g.add(ke);{const e=[],t=(a,n,s,i,o,v,p=0,m=1)=>e.push({m:q(a,n+i/2,0,s,i,o),c:v,pat:p,pitch:m});t(30,.5,8.5,2.5,2.5,l.ink),t(24.6,.5,3.4,3.7,3,l.ink),t(33,3,.9,1.9,.9,l.ink),t(30.5,3,1.3,.8,1.3,l.ink),t(35,.1,1.6,1.1,2.9,l.ink);for(const a of[27.2,30,32.8])t(a,.45,.45,2.6,2.62,l.lemon);t(28.6,3,1.3,1,1.3,l.lemon),t(24.6,2.5,2,1.1,3.06,l.paper),t(24.6,4.2,4.2,.3,3.4,l.paper);for(let a=0;a<5;a++)t(16.6-a*11.6,.6,10.6,3,2.9,Zt,3,1.5),t(16.6-a*11.6,3.6,11,.35,3.2,l.paper);for(let a=-32;a<=34;a+=3.3)t(a,0,1.2,.6,2.7,l.ink);Ne(e,ke)}const Ot=[[13.5,120,1500],[13.5,700,-900],[-13.5,800,500],[-13.5,1500,-700]],Yt=[l.lemon,l.green,l.salmon,l.powder],Me=(()=>{const e=[];for(let t=0;t<4;t++)e.push({m:q(0,0,0),c:Yt[t],pat:3,pitch:1.3},{m:q(0,0,0),c:l.paper,pat:1,pitch:.6},{m:q(0,0,0),c:l.ink});return Ne(e)})();X.push(e=>{ke.position.x=(e-.25)*2600;for(let t=0;t<4;t++){const[a,n,s]=Ot[t],i=n+e*s;Me.setMatrixAt(t*3,M.m.compose(M.v.set(a,2.1,i),M.q.identity(),M.v2.set(2.5,2.8,9.5))),Me.setMatrixAt(t*3+1,M.m.compose(M.v.set(a,3.7,i),M.q.identity(),M.v2.set(2.8,.4,10.2))),Me.setMatrixAt(t*3+2,M.m.compose(M.v.set(a,.45,i),M.q.identity(),M.v2.set(1.9,.5,7)))}Me.instanceMatrix.needsUpdate=!0}),await u.yield();const $t=(()=>{const e=new r.InstancedBufferGeometry;return e.setAttribute("position",new r.Float32BufferAttribute([0,0,0,1,0,0,0,1,0,1,1,0],3)),e.setIndex([0,1,2,2,1,3]),e})(),de=(e,t,a,n=0)=>{const s=$t.clone();for(const o in e)s.setAttribute(o,new r.InstancedBufferAttribute(e[o],e[o].length/t));s.instanceCount=t;const i=new r.Mesh(s,a);return i.frustumCulled=!1,i.renderOrder=n,g.add(i),i},Ze=`
      // a quad standing at 'base': plumb and turned about the vertical when face is 0, square to the lens when face is 1
      vec3 bill(vec3 base, vec2 size, vec2 uv, float face){
        vec2 t = cameraPosition.xz - base.xz; float l = length(t);
        vec2 r = l > 1e-4 ? vec2(t.y, -t.x) / l : vec2(1.0, 0.0);
        vec3 right = mix(vec3(r.x, 0.0, r.y), vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), face);
        vec3 up = mix(vec3(0.0, 1.0, 0.0), vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]), face);
        right /= max(length(right), 1e-4); up /= max(length(up), 1e-4);
        return base + right * ((uv.x - 0.5) * size.x) + up * (uv.y * size.y);
      }
      // 0 while the eye is level, 1 when it looks steeply down (or up): then the small things are drawn as he drew them from above
      float steep(){ return smoothstep(0.35, 0.8, abs(viewMatrix[1][2])); }`;{const e=[],t=[[19.6,1],[-19.6,1],[94.5,.6],[-94.5,.6],[109.5,.6],[-109.5,.6]];for(const[s,i]of t)for(let o=-72;o<1348;o+=16)T.some(v=>Math.abs(o-v.z)<9)||Math.abs(o-le)<7||s>60&&o>c.z0-10||i<1&&x()>.25+.75*N||e.push(s,0,o,x());for(const s of[-19.6,36.5])for(let i=E+14;i<b.z-8;i+=16)e.push(s,0,i,(i*.3719+s*.113)%1);const a=e.length/4,n=new r.ShaderMaterial({uniforms:{...L,uGreen:{value:l.green},uTub:{value:l.lemon}},vertexShader:`${Ze}
          attribute vec4 iT; varying vec2 vP; varying float vZ, vS;
          void main(){ vS = iT.w; vec3 w = bill(iT.xyz, vec2(7.0, 10.5), position.xy, 0.85 * steep()); vP = (position.xy - vec2(0.5, 0.0)) * vec2(7.0, 10.5);
            vec4 mv = viewMatrix * vec4(w, 1.0); vZ = -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`
          ${_}
          uniform vec3 uGreen, uTub; uniform float uSnow; varying vec2 vP; varying float vZ, vS;
          float crown(vec2 p){ return min(min(length(p - vec2(-1.25, 6.6)) - 1.75, length(p - vec2(1.25, 6.6)) - 1.75), min(length(p - vec2(0.0, 8.0)) - 1.9, length(p - vec2(0.0, 6.3)) - 1.6)); }
          float seg(vec2 p, vec2 a, vec2 b){ vec2 d = b - a; return length(p - a - d * clamp(dot(p - a, d) / dot(d, d), 0.0, 1.0)); }
          void main(){
            float px = max(fwidth(vP.y), 1e-5), lw = uLine * px;
            vec2 pt = vP - vec2(uReg.x, uReg.y) * px;
            float tub = max(abs(vP.x) - (0.75 + 0.12 * vP.y), abs(vP.y - 0.6) - 0.6);
            float trunk = max(abs(vP.x) - 0.17, abs(vP.y - 3.2) - 2.2);
            vec2 sw = vec2(0.24 * sin(uTime * 1.4 + vS * 6.283) * smoothstep(4.0, 8.5, vP.y), 0.0);   // the ball crowns nod, each in its own time
            float cr = crown(vP - sw), twig = 9.0;
            twig = min(min(seg(vP, vec2(0.0, 5.0), vec2(-1.7, 7.6)), seg(vP, vec2(0.0, 5.0), vec2(1.5, 7.9))), min(seg(vP, vec2(0.0, 5.0), vec2(0.1, 8.8)), min(seg(vP, vec2(-0.9, 6.4), vec2(-0.6, 8.3)), seg(vP, vec2(0.8, 6.5), vec2(2.2, 6.9)))));
            cr = mix(cr, 9.0, uSnow);
            float solid = min(min(tub, trunk), cr);
            float tw = uSnow * step(twig, lw);
            if (solid > lw && tw < 0.5) discard;
            float ink = max(step(abs(solid), lw), tw);
            vec3 c = uPaper;
            c = mix(c, uGreen, step(crown(pt - sw), 0.0) * step(cr, 0.0));
            c = mix(c, uTub, step(tub, 0.0) * step(max(abs(pt.x) - (0.75 + 0.12 * pt.y), abs(pt.y - 0.6) - 0.6), 0.0));
            float far = smoothstep(2.0, 4.0, 1.0 / px);                 // ruling and hoops only while a metre is a few pixels
            ink = max(ink, far * step(cr, 0.0) * step(0.5, vP.x) * mcRule(vP.y / 4.0, 4.0, vZ));
            ink = max(ink, far * step(tub, 0.0) * step(abs(vP.y - 0.75), lw * 0.7));
            gl_FragColor = vec4(mix(c, uInk, clamp(ink, 0.0, 1.0)), 1.0);
          }`});de({iT:new Float32Array(e)},a,n)}await u.yield();{const e=[],t=[],a=Be.filter(o=>Math.abs(o.col)<=2&&!o.walker&&!o.extra&&o.z>-40&&o.z<1700),n=Math.min(a.length,Math.round(120*N*P));for(let o=0;o<n;o++){const v=a[Math.floor((o+.5)*a.length/n)];e.push(v.x+x.range(-.3,.3)*v.w,0,v.z+x.range(-.3,.3)*v.d,0),t.push(13,44,x()*50,v.h/ge)}for(let o=0;o<4;o++)for(let v=0;v<6;v++){const p=o===0?300:T[o-1].z+260,m=v%2?1:-1,d=v<3;e.push(m*(d?x.range(0,190):x.range(230,640)),d?x.range(370,560):x.range(150,330),p+x.range(0,700),1),t.push(x.range(130,210),x.range(48,70),x()*50,0)}const s=e.length/4,i=new r.ShaderMaterial({uniforms:{...L},vertexShader:`${Ze}
          attribute vec4 iA, iB; uniform float uCamZ, uTime; varying vec2 vP; varying vec4 vK;
          ${Ge}
          void main(){
            vec3 base = iA.xyz;
            if (iA.w < 0.5) base.y = heightOf(storeysNow(iB.w, iA.z)) + 6.0; else base.x += mod(uTime * 10.0 + iB.z * 40.0, 160.0) - 80.0;
            vec3 w = bill(base, iB.xy, position.xy, iA.w > 0.5 ? 1.0 : 0.6 * steep()); vP = (position.xy - vec2(0.5, 0.0)) * iB.xy; vK = vec4(iB.x, iB.y, iB.z, iA.w);
            gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
          }`,fragmentShader:`
          ${_}
          varying vec2 vP; varying vec4 vK;
          void main(){
            float px = max(fwidth(vP.y), 1e-5), lw = uLine * px, sd = 1e3, curl = 0.0;
            if (vK.w < 0.5) {
              for (int k = 0; k < 7; k++) {
                float t = fract(float(k) / 7.0 + uTime * 0.08 + vK.z), y = t * (vK.y - 9.0) + 1.0;
                float r = (0.9 + 5.2 * t) * smoothstep(1.0, 0.86, t);
                vec2 c = vec2(sin(y * 0.16 + vK.z + float(k) * 2.4) * (0.6 + 3.0 * t) + 4.0 * t * t, y);
                float d = length(vP - c) - r; sd = min(sd, d);
                vec2 q = vP - c; float a = atan(q.y, q.x + 1e-5) + uTime * 0.6 + float(k);
                curl = max(curl, step(abs(length(q) - r * (0.3 + 0.07 * a)), lw) * step(d, -lw * 2.0) * step(0.5, r) * step(abs(a), 2.6));
              }
            } else {
              for (int k = 0; k < 7; k++) {
                float f = float(k) / 6.0, h = fract(sin(float(k) * 12.9898 + vK.z) * 43758.5453);
                float r = vK.y * (0.2 + 0.2 * sin(f * 3.1416) + 0.08 * h) * (1.0 + 0.07 * sin(uTime * 1.3 + float(k) * 1.7 + vK.z));   // the scallops breathe
                vec2 c = vec2((f - 0.5) * (vK.x - vK.y * 1.2), r + vK.y * 0.02);
                sd = min(sd, length(vP - c) - r);
              }
              sd = max(sd, vK.y * 0.13 - vP.y);                       // a flat base
            }
            float d = sd / px;                                         // one clean even contour: inked from the edge inward, smooth on its inner side
            if (d > uLine) discard;
            float ink = max(d > -0.5 ? 1.0 : 1.0 - smoothstep(0.0, 1.0, -d - 2.0 * uLine + 1.0), curl);
            gl_FragColor = vec4(mix(uPaper, uInk, ink), 1.0);
          }`});de({iA:new Float32Array(e),iB:new Float32Array(t)},s,i)}await u.yield();const ft=S.anchors.footfalls,Oe=9,mt=28,ut=22,Pe={value:new r.Vector3};let Ae=null;{const e=[],t=[],a=(f,A)=>{for(const h of ft)if(h.u>.012&&Math.hypot(h.x-f,h.z-A)<70)return h.u;return 9},n=[];for(const f of Be)Math.abs(f.col)===1&&!f.walker&&!f.extra&&f.z<1500&&n.push({x:Math.sign(f.col)*(C-.7),y:1.6,z:f.z+x.range(-.3,.3)*f.d,S:f.h/ge,zb:f.z,n:x.int(4,7)});for(const f of[-1,1])n.push({x:f*10,y:xe+.15,z:le+f*3.6,S:0,zb:0,n:9,alongX:!0});n.push({x:c.x0+.4,y:c.roofY+2.5,z:1010,S:0,zb:0,n:8},{x:c.x0+.4,y:c.roofY+2.5,z:1190,S:0,zb:0,n:8});const s=Math.round(291*(.5+.5*N));let i=0;for(const f of n)i+=f.n;for(const f of n){const A=Math.max(2,Math.round(f.n*Math.min(1.6,s/i)));for(let h=0;h<A;h++){const k=f.alongX?f.x+(h-A/2)*1.5:f.x,U=f.alongX?f.z:f.z+(h-A/2)*1.5;e.push(k,f.y,U,0),t.push(f.S,f.zb,a(k,U)+x()*.004,x())}}for(let f=0;f<Oe;f++)e.push(0,0,0,2),t.push(0,0,9,x());for(let f=0;f<mt;f++)e.push(0,0,0,3),t.push(0,0,9,x());for(let f=0;f<ut;f++)e.push(0,0,0,3),t.push(0,0,9,(f*.6180339+.137)%1);const o=e.length/4;await u.yield();const v=new r.ShaderMaterial({uniforms:{...L,uWing:{value:l.powder},uBed:{value:Pe.value}},vertexShader:`
          attribute vec4 iP, iQ; uniform float uCamZ, uU, uTime; uniform vec3 uBed; varying vec2 vP; varying vec2 vPose;
          ${Ge}
          void main(){
            vec3 c = iP.xyz; float fly = step(1.5, iP.w), sc = 1.5 + 0.5 * fly;
            if (iP.w < 0.5) {
              if (iQ.x > 0.5) c.y += heightOf(storeysNow(iQ.x, iQ.y));
              float t = uU - iQ.z;
              if (t > 0.0) {
                float a = iQ.w * 6.283, k = min(t, 0.12);
                c += vec3(cos(a) * 0.5 - sign(c.x) * 0.6, 0.9 + 0.5 * sin(a * 3.0), sin(a) * 0.5 + 0.5) * (k * 700.0) + vec3(sin(t * 160.0 + a), 0.0, cos(t * 130.0 + a)) * 4.0;
                fly = 1.0; sc *= 1.0 - smoothstep(0.08, 0.115, t);
              }
            }
            if (iP.w > 2.5) {
              float a = uTime * (0.35 + 0.3 * iQ.w) * (fract(iQ.w * 5.0) < 0.5 ? 1.0 : -1.0) + iQ.w * 40.0, R = 15.0 + 15.0 * fract(iQ.w * 7.0);
              c = uBed + vec3(cos(a) * R, -5.0 - 9.0 * fract(iQ.w * 13.0) + 1.5 * sin(a * 2.0), sin(a) * R * 1.25);
              if (fract(iQ.w * 3.0) < 0.5) c.y = min(c.y, 9.0 + 16.0 * fract(iQ.w * 13.0));      // half of them wheel low, among the legs
              sc *= smoothstep(3.0, 8.0, distance(c, cameraPosition));
            }
            vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
            vP = position.xy * 2.0 - 1.0;
            vPose = vec2(fly, floor(fract(uTime * 2.6 + iQ.w * 9.0) * 4.0));
            vec3 w = c + (right * vP.x + up * (vP.y + 0.55 * (1.0 - fly))) * sc * 0.5 * mix(0.75, 1.0, fly);
            gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
          }`,fragmentShader:`
          ${_}
          uniform vec3 uWing; varying vec2 vP; varying vec2 vPose;
          float wing(vec2 p, vec2 a, vec2 b){ vec2 d = b - a; float t = clamp(dot(p - a, d) / dot(d, d), 0.0, 1.0); return length(p - a - d * t) - mix(0.17, 0.03, t * t); }
          float ell(vec2 p, vec2 r){ return (length(p / r) - 1.0) * min(r.x, r.y); }
          void main(){
            float px = max(fwidth(vP.y), 1e-5), lw = uLine * px, body, wg, feather = 0.0;
            vec2 p = vP;
            if (vPose.x > 0.5) {
              float a = vPose.y < 0.5 ? -0.42 : vPose.y < 1.5 ? -0.08 : vPose.y < 2.5 ? 0.3 : 0.62;
              vec2 tip = vec2(cos(a), sin(a)) * 0.86; p.x = abs(p.x);
              wg = wing(p, vec2(0.1, 0.02), vec2(0.1, 0.02) + tip);
              vec2 ax = tip / 0.86, q = p - vec2(0.1, 0.02);
              feather = step(abs(dot(q, vec2(-ax.y, ax.x)) + 0.05), lw * 0.6) * step(0.2, dot(q, ax)) * step(dot(q, ax), 0.66);
              body = min(ell(p - vec2(0.0, -0.04), vec2(0.14, 0.15)), length(p - vec2(0.0, 0.1)) - 0.085);
              body = min(body, max(abs(p.x) - 0.1 * (-p.y - 0.08) * 3.0, abs(p.y + 0.24) - 0.1));
            } else {
              body = min(ell(p - vec2(0.0, -0.1), vec2(0.42, 0.24)), length(p - vec2(0.36, 0.2)) - 0.15);
              body = min(body, max(abs(p.y - 0.18 + (p.x - 0.5) * 0.5) - 0.05, abs(p.x - 0.56) - 0.08));
              body = min(body, max(abs(p.x + 0.52) - 0.2, abs(p.y + 0.02 - (p.x + 0.5) * 0.3) - 0.07));
              wg = ell(p - vec2(-0.1, -0.06), vec2(0.3, 0.15));
              feather = step(abs(p.y + 0.06 - (p.x + 0.1) * 0.1), lw * 0.6) * step(abs(p.x + 0.12), 0.2);
            }
            float sd = min(body, wg);
            if (sd > lw) discard;
            float ink = max(max(step(abs(body), lw), step(abs(wg), lw) * step(0.0, body)), feather * step(wg, 0.0) * step(0.0, body));
            float wingIn = vPose.x > 0.5 ? step(wg, 0.0) * step(0.0, body) : step(wg, 0.0);
            ink = max(ink, (1.0 - vPose.x) * step(abs(wg), lw));
            gl_FragColor = vec4(mix(mix(uPaper, uWing, wingIn), uInk, clamp(ink, 0.0, 1.0)), 1.0);
          }`});Ae=de({iP:new Float32Array(e),iQ:new Float32Array(t)},o,v,2).geometry.attributes.iP,Ae.setUsage(r.DynamicDrawUsage);const m=o-Oe-mt-ut,d=new r.Vector3,w=F.length;X.push((f,A)=>{F.posAtDist(Math.min(f*w+45,w),d),d.y-=4,Pe.value.copy(S.body.position),Pe.value.lerp(d,y(70,110,Pe.value.distanceTo(d)));const h=Math.max(0,f-.14);for(let k=0;k<Oe;k++){F.posAtDist(f*w+4.6+k*1.15,d);const U=h>.07?1e5:0;Ae.setXYZ(m+k,d.x-(1.9+.62*(k*3%5)+.2*k)-h*260,d.y-1+.75*(k*2%3)+.2*Math.sin(A*2+k)+h*700+U,d.z+h*300)}Ae.needsUpdate=!0})}await u.yield();const Ye=[0,1,2,3].map(()=>new r.Vector4(0,0,9,0));{const e=Math.round(6e3*N*P),t=new Float32Array(e*4),a=new Float32Array(e*4),n=[l.salmon,l.powder,l.lemon,l.green,l.paper];for(let o=0;o<e;o++){const v=x(),p=x()<.5?-1:1,m=v<.62?p*x.range(ce+.9,C-.8):p*x.range(C+R+1,C+ye-1),d=n[x.int(0,4)];t.set([m,x.range(-80,1350),(x()<.5?-1:1)*x.range(.9,1.7),x()],o*4),a.set([d.r,d.g,d.b,0],o*4)}await u.yield();const s=new r.ShaderMaterial({uniforms:{...L,uFall:{value:Ye}},vertexShader:`${Ze}
          attribute vec4 iA, iB; uniform float uTime, uPxAng; uniform vec4 uFall[4]; varying vec2 vP; varying vec3 vC;
          void main(){
            vec3 b = vec3(iA.x, 0.0, mod(iA.y + iA.z * uTime + 80.0, 1430.0) - 80.0);
            for (int k = 0; k < 4; k++) {                          // they scatter in a ring from each footfall
              vec2 d = b.xz - uFall[k].xy; float l = length(d), age = uFall[k].z;
              float amp = 15.0 * smoothstep(0.0, 0.004, age) * (1.0 - smoothstep(0.035, 0.07, age)) * (1.0 - smoothstep(6.0, 30.0, l));
              b.xz += (l > 1e-3 ? d / l : vec2(1.0, 0.0)) * amp;
            }
            float show = smoothstep(26.0, 40.0, distance(cameraPosition, b));
            float dot3 = 3.4 * uPxAng * distance(cameraPosition, b) * steep();      // from the high eye each is a dot of tint, never under 3 px
            vec3 w = bill(b, max(vec2(1.3, 2.1), vec2(dot3)) * show, position.xy, steep()); vP = (position.xy - vec2(0.5, 0.0)) * vec2(1.3, 2.1); vC = iB.rgb;
            gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
          }`,fragmentShader:`
          ${_}
          varying vec2 vP; varying vec3 vC;
          void main(){
            float px = max(fwidth(vP.y), 1e-5), lw = uLine * px;
            float coat = max(abs(vP.x) - (0.2 + 0.18 * (1.5 - vP.y)), abs(vP.y - 0.75) - 0.75);
            float hat = min(max(abs(vP.x) - 0.36, abs(vP.y - 1.62) - 0.05), max(abs(vP.x) - 0.2, abs(vP.y - 1.8) - 0.2));
            float sd = min(coat, hat), fine = smoothstep(9.0, 16.0, 2.1 / px);
            if (sd > lw * fine) discard;
            float ink = step(abs(sd), lw) * fine;
            gl_FragColor = vec4(mix(mix(vC, uPaper, step(hat, 0.0) * fine), uInk, ink), 1.0);
          }`});de({iA:t,iB:a},e,s,1);const i=ft.filter(o=>o.y<3);X.push(o=>{let v=0;for(;v<i.length&&i[v].u<=o;)v++;for(let p=0;p<4;p++){const m=i[v-1-p];m?Ye[p].set(m.x,m.z,o-m.u,0):Ye[p].set(0,-9999,9,0)}})}await u.yield();{const e=[],t=[],a=[];let n=0;const s=(p,m,d,w,f,A)=>{const h=Math.hypot(d-p,w-m);e.push(p,0,m,d,0,w,p,f,m,d,f,w),t.push(0,0,A,h,0,A,0,f,A,h,f,A),a.push(n,n+1,n+2,n+2,n+1,n+3),n+=4};for(const[p,m,d,w]of[[790,1960,170,0],[900,2070,290,1]])s(-p,-260,-p,m,d,w),s(p,-260,p,m,d,w),s(-p,m,p,m,d,w);const i=new r.BufferGeometry;i.setAttribute("position",new r.Float32BufferAttribute(e,3)),i.setAttribute("q",new r.Float32BufferAttribute(t,3)),i.setIndex(a);const o=[0,1,2,3].map(p=>Ke(p)),v=new r.Mesh(i,new r.ShaderMaterial({uniforms:{...L,uGateZ:{value:new r.Vector3(T[0].z,T[1].z,T[2].z)},uA:{value:o.map(p=>p[0])},uB:{value:o.map((p,m)=>m===pe?l.powder:p[1])}},side:r.DoubleSide,vertexShader:`attribute vec3 q; varying vec3 vQ; varying float vWz;
          void main(){ vQ = q; vec4 w = modelMatrix * vec4(position, 1.0); vWz = w.z; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
          ${_}
          uniform vec3 uGateZ; uniform vec3 uA[4]; uniform vec3 uB[4]; varying vec3 vQ; varying float vWz;
          float roofAt(float c, float band){ float h = fract(sin(c * 91.7 + band * 17.3) * 43758.5453); return (band < 0.5 ? 150.0 : 262.0) * (0.5 + 0.5 * h * h); }
          void main(){
            vec2 fw = max(fwidth(vQ.xy), vec2(1e-5));
            float w = vQ.z < 0.5 ? 19.0 : 27.0, c = floor(vQ.x / w), f = vQ.x - c * w;
            float h = roofAt(c, vQ.z), hl = roofAt(c - 1.0, vQ.z), hr = roofAt(c + 1.0, vQ.z);
            if (vQ.y > h + uLine * fw.y) discard;
            float ink = step(h - vQ.y, uLine * fw.y);
            ink = max(ink, step(f, uLine * fw.x) * step(min(h, hl), vQ.y));
            ink = max(ink, step(w - f, uLine * fw.x) * step(min(h, hr), vQ.y));
            float pn = step(uGateZ.x, vWz) + step(uGateZ.y, vWz) + step(uGateZ.z, vWz);
            vec3 a = pn < 0.5 ? uA[0] : pn < 1.5 ? uA[1] : pn < 2.5 ? uA[2] : uA[3];
            vec3 b = pn < 0.5 ? uB[0] : pn < 1.5 ? uB[1] : pn < 2.5 ? uB[2] : uB[3];
            // ranked windows, left as paper: on when a bay is 3 px or more on screen, off (flat tint) when it is less
            vec2 cw = vec2(w * 0.5, 12.0), wc = vec2(f, vQ.y) / cw, wm = abs(fract(wc) - 0.5);
            float wOn = step(3.2, min(cw.x / fw.x, cw.y / fw.y)) * step(wm.x, 0.27) * step(wm.y, 0.3) * step(floor(wc.y) + 1.0, (h - 5.0) / cw.y) * step(1.0, wc.y);
            gl_FragColor = vec4(mix(mix(vQ.z < 0.5 ? a : b, uPaper, wOn), uInk, ink), 1.0);
          }`}));v.frustumCulled=!1,g.add(v)}if(Y){const e=Math.round(1500*N),t=new Float32Array(e*4);for(let a=0;a<e;a++)t.set([x()*110,x()*90,x()*110,x()],a*4);de({iA:t},e,new r.ShaderMaterial({uniforms:{...L},vertexShader:`attribute vec4 iA; uniform float uTime; varying vec2 vP;
          void main(){
            vec3 box = vec3(110.0, 90.0, 110.0);
            vec3 p = iA.xyz + vec3(sin(uTime * 0.5 + iA.w * 20.0) * 1.5 + uTime * 1.2, -uTime * (3.5 + 2.5 * iA.w), 0.0);
            p = mod(p - cameraPosition, box) - box * 0.5 + cameraPosition;
            vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
            vP = position.xy * 2.0 - 1.0;
            float sz = (0.13 + 0.12 * iA.w) * smoothstep(2.5, 9.0, distance(p, cameraPosition));
            gl_Position = projectionMatrix * viewMatrix * vec4(p + (right * vP.x + up * vP.y) * sz, 1.0);
          }`,fragmentShader:`
          ${_}
          varying vec2 vP;
          void main(){ float px = max(fwidth(vP.y), 1e-5), r = length(vP) - (1.0 - 2.5 * px);
            if (abs(r) > uLine * px) { if (r > 0.0) discard; gl_FragColor = vec4(uPaper, 1.0); return; }
            gl_FragColor = vec4(uInk, 1.0); }`}),3)}if(await u.yield(),B&&D.length){const t=[[0,0,0],[1,0,1],[1.1,.5,0],[1,1.1,1],[.5,1.5,1]];for(let v=5;v<44;v+=5)t.push([.5,v-.5,1],[.8,v-.3,1],[.8,v+.3,1],[.5,v+.5,1]);t.push([.5,46,1]);const a=Z(t,10,l.lemon),n=D.flatMap(()=>[0,1,2,3].map(()=>new r.Matrix4().makeScale(0,0,0))),[s,i]=lt(a,n),o=new r.Vector3(1,0,0);X.push(v=>{const p=44*j(.545,.59,.735,.775,v),m=y(.59,.735,v),d=Mt*m,w=d/22,f=j(.585,.6,.725,.74,v);L.uWalk.value.set(p,d,w,1);let A=0;for(const h of D)for(let k=0;k<4;k++,A++){const U=k<2?-1:1,W=k%2?1:-1,K=8*f*Math.sin(w*6.283+(k===0||k===3?0:Math.PI)),Ce=Math.hypot(p,K),Rt=p*.04*Math.sin(w*6.283+h.z);M.q.setFromAxisAngle(o,Math.atan2(-K,Math.max(p,.01))),M.m.compose(M.v.set(h.x+U*(h.w/2-3)+Rt*.5,0,h.z+W*(h.d/2-3)+d+K),M.q,M.v2.set(p>.05?2.2:0,Ce/46,p>.05?2.2:0)),s.setMatrixAt(A,M.m),i.setMatrixAt(A,M.m)}s.instanceMatrix.needsUpdate=i.instanceMatrix.needsUpdate=!0})}await u.yield(),Ne(vt),await u.yield();const he=new r.Group;he.matrixAutoUpdate=!1,F.frameAt(1,he.matrix,!0),he.matrixWorldNeedsUpdate=!0,g.add(he);const xt=new r.BoxGeometry(1,1,1);for(const[e,t,a,n]of[[0,7.4,16.6,1.8],[0,-7.4,16.6,1.8],[-7.4,0,1.8,13],[7.4,0,1.8,13]]){const s=new r.Mesh(xt,fe);s.position.set(e,t,.3),s.scale.set(a,n,.6),he.add(s)}for(const e of[-1,1]){const t=new r.Mesh(xt,fe);t.position.set(e*7.1,9.2,Kt[2]+6.6),t.scale.set(.5,13.4,.5),t.rotation.x=.36,g.add(t)}const we=new r.Vector3,Se=new r.Vector3,dt=new r.Vector3,j=(e,t,a,n,s)=>y(e,t,s)*(1-y(a,n,s)),z=new r.Vector3,Jt=new r.Vector3;let $e=0;const Ve=e=>{Math.abs(e-$e)>.004&&S.setProgress(e),$e=e};function ht(e,t,a,n){$e=n,a.getWorldPosition(we);const s=a.projectionMatrix&&a.projectionMatrix.elements,i=s&&s[5]>.2?1.664/s[5]:1,o=it(n);L.uCamZ.value=o,L.uU.value=n,S.setProgress(n),S.update(e,t,a);const v=.22*Math.sin(t*1.5)+.1*Math.sin(t*2.7);S.materials.tint.uniforms.uSway.value+=v,S.materials.hull.uniforms.uSway.value+=v,F.tangentAt(Math.min(1,n+.006),Se),F.tangentAt(Math.max(0,n-.006),dt),Se.sub(dt),$.uReg.value.set(1.5+3*H(Se.x*9,-1,1)+.45*Math.sin(t*1.7),1+3*H(Se.y*9,-1,1)+.45*Math.sin(t*1.3+1)),Xe.uniforms.uPanel.value=yt(we.z);for(let p=0;p<3;p++){const m=kt[p],d=m.g.h*(.5+.5*y(m.g.z-520,m.g.z-60,o));m.posts[0].scale.y=m.posts[1].scale.y=d,m.top.position.y=d,De[p].w=d+.75;const w=Math.max(1.5,.018*i*Math.hypot(we.z-m.g.z,Math.max(0,Math.abs(we.x-m.g.x)-m.g.w/2)));m.posts[0].scale.x=m.posts[1].scale.x=w,m.top.scale.y=w,m.top.scale.x=m.g.w+1.5+w}for(let p=0;p<X.length;p++)X[p](n,t,a,e,we)}return ht(0,0,{getWorldPosition:e=>e.copy(F.start),projectionMatrix:null},0),{scene:g,path:F,duration:44,pace:e=>1-.3*j(.17,.21,.29,.33,e)+.4*j(.34,.38,.47,.5,e)-.38*j(.495,.525,.575,.605,e)-.3*j(.755,.785,.83,.86,e),camera:{fov:62,near:.5,far:6e3,lookAhead:26,sway:.25,bank:0},pois:[{at:(e,t)=>(S.anchors.bedAt(H(t,0,1),z),z.y+=3,z.z+=9*j(.03,.05,.09,.12,t),z),from:0,to:.22,weight:.5},{at:(e,t)=>(Ve(t),z.lerpVectors(S.feet[1],S.knees[1],.2+.8*y(.28,.315,t))),from:.27,to:.335,fade:.2,weight:.8},{at:(e,t)=>(Ve(t),z.copy(S.body.position),z.y-=6*(1-y(.43,.48,t)),z),from:.325,to:.525,fade:.1,weight:.8},{at:(e,t)=>(F.pointAt(H(t,0,1),z),z.y=0,z.z+=330,z),from:.525,to:.602,fade:.2,weight:.9},{at:(e,t)=>(Ve(t),z.addVectors(S.feet[1],S.feet[3]).multiplyScalar(.5),z.lerp(S.body.position,.88*y(.63,.68,t))),from:.615,to:B?.655:.755,weight:.8},...B&&D.length?[{at:()=>z.set(D[3].x+20,50+L.uWalk.value.x,D[3].z+L.uWalk.value.y),from:.645,to:.765,weight:.7}]:[],{at:(e,t)=>{Ve(t);const a=y(.828,.862,t);return z.copy(S.body.position),z.y=J(J(Ie[1],z.y,.45),z.y-5,a),z.x=J(J(Ie[0],z.x,.5),z.x,a),z},from:.765,to:.975,fade:.14,weight:.68}],portal:{shape:"rect",width:13,height:13,tilt:!0,frame:0,color:Ue[0],veil:"#"+(te[0]===l.salmon?l.powder:te[0]).getHexString(),glow:0,blendDistance:30},post:{flat:1,exposure:1,bloom:{strength:0},grade:{saturation:1,contrast:1,vignette:0,grain:0}},ride:"none",style:"none",companion:"none",update:ht,dispose(){for(const e of bt)e.dispose()}}}};export{oa as default};
