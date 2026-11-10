import*as t from"three";import{mergeGeometries as L0}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as B0,makeRng as $a,clamp as ie,lerp as U,smoothstep as v}from"../kit/core.js";import{buildHero as q0,buildOrbit as H0}from"../parts/uphill-to-black.js";const D=Math.PI*2,H=6371e3,Xa=8,_=Math.PI/180,Qt=150,I0=58,Ya=46,jt=[23e4,15e4,-33e4,-125e4],R0=["#1F7FD6","#2FC4B8","#F3F1EA","#E9DDB8","#0F3D30","#03040A","#FF9A2E"];function Zt(s){const c=s.length,g=[],k=new Array(c).fill(0);for(let f=0;f<c-1;f++)g.push((s[f+1][1]-s[f][1])/(s[f+1][0]-s[f][0]));for(let f=1;f<c-1;f++)k[f]=g[f-1]*g[f]<=0?0:2*g[f-1]*g[f]/(g[f-1]+g[f]);return k[0]=g[0],k[c-1]=g[c-2],f=>{if(f<=s[0][0])return s[0][1];if(f>=s[c-1][0])return s[c-1][1];let P=0;for(;f>s[P+1][0];)P++;const K=s[P+1][0]-s[P][0],C=(f-s[P][0])/K,L=C*C,I=L*C;return(2*I-3*L+1)*s[P][1]+(I-2*L+C)*K*k[P]+(-2*I+3*L)*s[P+1][1]+(I-L)*K*k[P+1]}}const Ne=Zt([[0,0],[2,0],[5,80],[8,900],[9,1200],[12.5,6e3],[15,11e3],[18,3e4],[22,8e4],[40,15e4]]),$t=Zt([[0,0],[5,0],[9,250],[12.5,2600],[15,8e3],[18,3e4],[22,9e4],[27,17e4],[40,42e4]]),O0=Zt([[0,0],[5,0],[10,25],[15,50],[20,62],[24.5,64],[27.2,85],[40,87]]),_e=`
float h21(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + vec2(17.3, 9.1); a *= .5; } return s * 1.07; }
`,Xt=`
uniform vec3 uCamE, uZen, uHor; uniform float uAlt, uHaze, uHzHi;
vec3 aerial(vec3 col, vec3 pE){
  vec3 dv = uCamE - pE; float s = length(dv);
  vec3 up = normalize(vec3(pE.x, pE.y + ${H}., pE.z));
  float x = max(uAlt, 1.) / 10000., col0 = 1. - exp(-x);
  float mu = clamp(dot(up, dv / max(s, 1.)), 0., 1.), g = 1. - mu;
  float g2 = g * g, g8 = g2 * g2 * g2 * g2;
  float tau = max(s / 10000. * min(col0 / x, 1.) * uHzHi, col0 * g8 * g8 * 40.);
  float hz = 1. - exp(-tau * uHaze);
  return mix(col, mix(uZen * 1.15, uHor, .4 + .6 * (1. - exp(-tau * .14))), hz);
}
`,Xo=`
// size of a pixel on the ground: at a grazing view the footprint is a long sliver, and blurring by its length smears
// the whole Earth; take mostly its geometric mean so coasts and cloud stay crisp out to the limb
float footpr(vec2 g){ vec2 dx = dFdx(g), dy = dFdy(g); return mix(sqrt(abs(dx.x * dy.y - dx.y * dy.x)), max(length(dx), length(dy)), .1) + .01; }
float cloudN(vec2 g, vec4 dk, float t, float fp){
  vec2 p = g / dk.x; p.x *= dk.z; p.x += t * dk.w / dk.x;
  float k1 = 1. - clamp(fp / (dk.x * .4), 0., 1.), k2 = 1. - clamp(fp / (dk.x * 3.), 0., 1.);
  float k0 = 1. - clamp(fp / (dk.x * .03), 0., 1.);
  return .5 + (fbm(p) - .5) * .9 * k1 + (fbm(p * .16 + 3.7) - .5) * .9 * k2 + (fbm(p * 7.3 + 1.7) - .5) * .2 * k0;
}
float storm1(vec2 q, float R, float t, float sgn){
  float r = length(q) / R; if (r > 1.6) return 0.;
  float a = atan(q.y, q.x + step(length(q), 1e-3)) * sgn;
  float n = fbm(q / (R * .16) + 4.) - .5;
  float arm = sin(a * 2. + log(max(r, .02)) * 5.2 - t * .02 + n * 2.6) * .5 + .5;
  float body = (1. - smoothstep(.1, 1.3, r)) * (.22 + .78 * arm * arm) + (1. - smoothstep(.06, .34, r)) * .5 + n * .42;
  return smoothstep(.4, .6, body) * smoothstep(.03, .07, r) * (1. - smoothstep(1.2, 1.55, r));
}
uniform vec3 uCyc;      // a third, smaller system beside the line of flight: (x, z, radius) in metres
// a young cyclone seen from above the weather: a clear eye in a bright central overcast, feeder bands trailing out in an open
// spiral, every band torn into cells so that it is cloud and never a drawn shape
float cyc1(vec2 q, float R, float t){
  float r = length(q) / R; if (r > 1.55) return 0.;
  float a = atan(q.y, q.x + step(length(q), 1e-3));
  float n = fbm(q / (R * .13) + 4.) - .5, n2 = fbm(q / (R * .034) + 9.) - .5;
  float sp = a + log(max(r, .03)) * 3.1 - t * .03 + n * 1.5;
  float arm = .5 + .5 * sin(sp * 2.), band = .5 + .5 * sin(sp * 6. + n2 * 3. + 1.3), streak = .5 + .5 * sin(sp * 17. + n2 * 9.);
  float fall = 1. - smoothstep(.45, 1.45, r), core = 1. - smoothstep(.12, .42, r);
  float body = core * .85 + fall * (arm * arm * (.35 + .65 * band) + .2 * band * arm) + n * .2 + n2 * .3 * smoothstep(.1, .5, r);
  float m = smoothstep(.36, .7, body) * smoothstep(.06, .115, r + n2 * .05) * (1. - smoothstep(1.1, 1.5, r));
  // thin between the bands and along their grain, thick in the central overcast: the sea shows through the gaps
  return m * mix(.5 + .5 * streak * (.6 + .8 * (n2 + .5)), 1., core * .7);
}
float stormA(vec2 g, float t){
  return max(max(storm1(g - vec2(${jt[0]}., ${jt[1]}.), 190e3, t, 1.), storm1(g - vec2(${jt[2]}., ${jt[3]}.), 330e3, t, -1.)), cyc1(g - uCyc.xy, uCyc.z, t));
}
// density of a deck before its threshold. Far below the lens the deck's own cells are smaller than a pixel: there the
// same field carries on at the scales an orbit sees (cloud streets, cells, frontal bands), so it never melts to a blur
float cloudD(vec2 g, vec4 dk, float t, float fp){
  float big = vn(g / 70e3 + dk.x * .001) * .55 + .45 * vn(g / 300e3 + 3. + dk.x * .002);
  float lg = max(smoothstep(dk.x * 5., dk.x * 45., length(g)), step(1500., dk.x));
  float ko = smoothstep(dk.x * .25, dk.x * 1.5, fp), od = 0.;
  if (ko > 0.) {
    vec2 gd = g + vec2(t * dk.w, 0.);
    float f1 = fbm(gd / 26e3 + dk.x * .01);
    od = (f1 - .5) * (1. - smoothstep(12e3, 40e3, fp)) + (fbm(gd / 6e3 + f1 * 1.6 + 2.) - .5) * .55 * (1. - smoothstep(2.5e3, 8e3, fp))
      + (fbm(gd / 1400. + 9.) - .5) * .3 * (1. - smoothstep(600., 2000., fp));
    od *= ko;
  }
  return cloudN(g, dk, t, fp) + (big - .5) * .9 * lg - .13 * (1. - lg) + od * lg;
}
float cloudA(vec2 g, vec4 dk, float t, float fp){
  float thr = 1.08 - dk.y;
  return smoothstep(thr - .07, thr + .1, cloudD(g, dk, t, fp));
}
`,w=(s,c=1)=>{const g=new t.Color(s);return new t.Color(g.r*c,g.g*c,g.b*c)};function i(s,c,g,k,f,P,K,C=0,L=0,I=0){const R=new t.BoxGeometry(s,c,g).toNonIndexed();return R.deleteAttribute("uv"),R.applyMatrix4(new t.Matrix4().compose(new t.Vector3(k,f,P),new t.Quaternion().setFromEuler(new t.Euler(L,C,I,"YXZ")),new t.Vector3(1,1,1))),j(R,K)}function j(s,c){if(s.index){const f=s.toNonIndexed();s.dispose(),s=f}s.attributes.uv&&s.deleteAttribute("uv");const g=s.attributes.position.count,k=new Float32Array(g*3);for(let f=0;f<g;f++)k[f*3]=c.r,k[f*3+1]=c.g,k[f*3+2]=c.b;return s.setAttribute("color",new t.BufferAttribute(k,3)),s}const Ue=s=>{const c=L0(s);return s.forEach(g=>g.dispose()),c};function Yo(s,c=72,g=96){const k=H+s,f=[],P=[],K=[];for(let L=0;L<c;L++){const I=L===0?0:30*Math.pow(86666.66666666667,(L-1)/(c-2)),R=I/H;for(let Y=0;Y<=g;Y++){const m=Y/g*D,F=Math.cos(m),X=Math.sin(m);f.push(k*Math.sin(R)*F,k*Math.cos(R)-H,k*Math.sin(R)*X),P.push(I*F,I*X)}}for(let L=0;L<c-1;L++)for(let I=0;I<g;I++){const R=L*(g+1)+I,Y=R+1,m=R+g+1,F=m+1;K.push(R,Y,m,Y,F,m)}const C=new t.BufferGeometry;return C.setAttribute("position",new t.Float32BufferAttribute(f,3)),C.setAttribute("aG",new t.Float32BufferAttribute(P,2)),C.setIndex(K),C}var j0={id:"uphill-to-black",name:"Uphill to Black",category:"sky",media:["air","space"],weirdness:.05,async build(s){const c=s.rng,g=s.vary||{},k=s.quality?.detail??1,f=ie(g.density??1,.7,1.3),P=g.hour==="night"?"night":g.hour==="dawn"||g.hour==="golden"?"dawn":g.hour==="day"?"day":c.pick(["day","dawn","night","day","day","dawn"]),K=c.pick(["three","three","one","wall","fog"]),C=c.pick(["atoll","mangrove","mangrove","desert"]),L=c.chance(.3),I=!!g.rare,R=c.sign(),Y=c.sign(),m=P==="night",F=P==="dawn",X=R0,Yt=w(X[6]),b={day:{zen:w(X[0]),hor:w("#d4e9f2"),horSun:w("#e6f2f4"),sunCol:new t.Color(1,.98,.94),sunAmt:1,amb:new t.Color(.16,.22,.28),el:72,key:3.1,keyCol:"#ffffff",starK:420,cloud:w("#f3f1ea",.92),hemi:.9},dawn:{zen:w("#14285c"),hor:w("#e9b9a8"),horSun:w("#ffc9a0",1.25),sunCol:new t.Color(1,.74,.62),sunAmt:.2,amb:new t.Color(.13,.19,.33),el:6,key:2.9,keyCol:"#ffd6c4",starK:60,cloud:w("#f6cfc4",.9),hemi:.95},night:{zen:w("#070c1f"),hor:w("#13233f"),horSun:w("#182a4a"),sunCol:new t.Color(.55,.68,1),sunAmt:.2,amb:new t.Color(.02,.032,.066),el:50,key:.6,keyCol:"#9db8ff",starK:1.2,cloud:w("#8fa3c8",.2),hemi:.12}}[P],be=new t.Vector3(-R*Math.cos(b.el*_),Math.sin(b.el*_),.25*Math.cos(b.el*_)).normalize(),Z=new t.Scene;Z.background=new t.Color(X[5]);const Jo=B0([[0,0,0],[0,0,-200],[0,0,-400],[0,0,-600]]);await s.yield();const ht=new t.HemisphereLight(16777215,16777215,b.hemi);Z.add(ht);const Ke=new t.DirectionalLight(b.keyCol,b.key);Z.add(Ke,Ke.target);const ze=new t.DirectionalLight(Yt,0);Z.add(ze,ze.target);const J={uCamE:{value:new t.Vector3},uZen:{value:b.zen.clone()},uHor:{value:b.hor.clone()},uAlt:{value:60},uHaze:{value:m?.12:.24},uHzHi:{value:1}},ee={value:0},pt={value:be},e0={value:b.sunCol},Ja={value:b.sunAmt},t0={value:b.amb},eo={value:new t.Vector3(Y*1e5,26e3,72e3)},ue={value:Yt},ce={value:0},Jt={value:new t.Vector2},Me={value:new t.Vector3(0,1,0)},B={value:new t.Vector4(0,1,0,0)},We=[[1200,900,.4,.45,9],[6e3,2600,.42,1,14],[11e3,9e3,.34,.22,30]],fe=(K==="one"?[We[c.int(0,1)]]:K==="wall"?[We[1],We[2]]:We).map(e=>e.slice());K==="fog"&&fe.unshift([46,240,.93,1,2.5]),fe.forEach(e=>{e[2]=ie(e[2]*(.85+.3*c())*(e[0]<100?1:f),.2,.95)});const a0=e=>{let a=2,n=40;for(let r=0;r<40;r++){const o=(a+n)/2;Ne(o)+Xa+56<e?a=o:n=o}return a};fe.forEach(e=>{e.t=e[0]<100?-99:a0(e[0])});const de=fe.find(e=>e[0]>100)||We[0],to={value:new t.Vector4(de[1],de[2],de[3],de[4])},o0={value:de[0]},n0={value:m?.3:1},ne={uHorK:{value:.12},uW2E:{value:new t.Matrix3},uUpE:{value:new t.Vector3(0,1,0)},uHorSun:{value:b.horSun},uStarK:{value:b.starK},uSunV:B,uMoonE:{value:new t.Vector3(0,.3,-1).normalize()},uPre:{value:0},uMW:{value:new t.Vector3(-.86,.5,.1).normalize()}},ea=new t.Mesh(new t.IcosahedronGeometry(1,5),new t.ShaderMaterial({side:t.BackSide,depthTest:!1,depthWrite:!1,fog:!1,uniforms:{...ne,uZen:J.uZen,uHor:J.uHor,uAlt:J.uAlt,uSunE:pt,uTime:ee},vertexShader:"varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }",fragmentShader:`
        uniform mat3 uW2E; uniform vec3 uUpE, uZen, uHor, uHorSun, uSunE, uMoonE, uMW; uniform vec4 uSunV; uniform float uAlt, uStarK, uTime, uHorK, uPre; varying vec3 vD;
        float h31(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
        float n31(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
          return mix(mix(mix(h31(i), h31(i + vec3(1., 0., 0.)), f.x), mix(h31(i + vec3(0., 1., 0.)), h31(i + vec3(1., 1., 0.)), f.x), f.y),
                     mix(mix(h31(i + vec3(0., 0., 1.)), h31(i + vec3(1., 0., 1.)), f.x), mix(h31(i + vec3(0., 1., 1.)), h31(i + vec3(1., 1., 1.)), f.x), f.y), f.z); }
        // one layer of stars on a grid of cells: sc cells per radian, keep = share of cells that hold a star, r0 = radius in cells.
        // A star smaller than a pixel is drawn a pixel wide and dimmed by the same area, so the field neither sparkles nor vanishes.
        vec4 starL(vec3 d, float sc, float keep, float r0, float px){
          vec3 p = d * sc, c = floor(p), f = fract(p) - .5; float hs = h31(c + sc);
          if (hs > keep) return vec4(0.);
          float rr = max(r0, px * sc * .75), k = r0 / rr, m = hs / max(keep, 1e-4);
          float a = (1. - smoothstep(rr * .35, rr, length(f - (vec3(h31(c + 7.), h31(c + 13.), h31(c + 23.)) - .5) * (1. - 2. * min(rr, .4))))) * k * k;
          float hc = fract(hs * 91.7 + sc);
          vec3 tint = mix(vec3(.66, .8, 1.), vec3(1., .95, .84), smoothstep(.25, .7, hc)); tint = mix(tint, vec3(1., .62, .36), step(.9, hc));
          return vec4(tint * a * (.35 + 2.4 * m * m * m), a);
        }
        void main(){
          vec3 d = uW2E * normalize(vD); float px = length(fwidth(d));
          float mu = dot(d, uUpE), r = ${H}. + uAlt;
          float ht = r * sqrt(max(1. - mu * mu, 0.)) - ${H}.;
          float hmin = mu > 0. ? uAlt : max(ht, 0.);
          float tau = exp(-hmin / 10000.) / (max(mu, 0.) + .028);
          vec3 hd = d - uUpE * mu, sh = uSunE - uUpE * dot(uSunE, uUpE);
          float sa = dot(normalize(hd + vec3(1e-5, 0., 0.)), normalize(sh + vec3(0., 0., 1e-5)));
          vec3 hor = mix(uHor, uHorSun, pow(max(sa, 0.), 3.));
          vec3 col = mix(uZen, hor, 1. - exp(-tau * uHorK)) * (1. - exp(-tau * 3.));
          vec3 p = d * 85., c = floor(p), f = fract(p) - .5;
          float hs = h31(c), tw = .55 + .45 * sin(uTime * (2. + 5. * hs) + hs * 50.);
          float st = (1. - smoothstep(.02, .16, length(f - (vec3(h31(c + 7.), h31(c + 13.), h31(c + 23.)) - .5) * .6))) * step(.86, hs);
          // the low sun of the orbital leg: disc and glare, and the air's layers lit orange to blue along the limb
          float sdv = max(dot(d, uSunV.xyz), 1e-4), s4 = sdv * sdv * sdv * sdv, lay = clamp(ht / 70000., 0., 1.);
          vec3 layC = mix(mix(vec3(1., .26, .04), vec3(1., .7, .3), smoothstep(.02, .16, lay)), vec3(.3, .58, 1.), smoothstep(.14, .4, lay));
          vec3 sunC = vec3(1., .95, .88) * uSunV.w;
          vec3 sx3 = normalize(cross(uSunV.xyz, uUpE) + vec3(1e-5, 0., 0.)), sy3 = cross(sx3, uSunV.xyz);
          float sa3 = atan(dot(d, sy3), dot(d, sx3) + 1e-6), ray = pow(abs(cos(sa3 * 3. + .4)), 60.) + .6 * pow(abs(cos(sa3 * 3. + 1.3)), 200.);
          float glare = pow(sdv, 1500.) * 5. + pow(sdv, 240.) * 1.3 + ray * pow(sdv, 300.) * 3.;
          // the moon: a lit ball with maria, hung over the limb
          float moon = 0.;
          vec3 mx = normalize(cross(uMoonE, vec3(0., 1., 0.)) + vec3(1e-5, 0., 0.)), my = cross(mx, uMoonE);
          vec2 mq = vec2(dot(d, mx), dot(d, my)) / .07; float mr = dot(mq, mq);
          if (mr < 1. && dot(d, uMoonE) > 0.) {
            vec3 mn = mx * mq.x + my * mq.y - uMoonE * sqrt(max(1. - mr, 0.));
            vec3 mp = floor(mn * 5. + 9.); float mar = mix(h31(mp), h31(floor(mn * 11. + 3.)), .4) * .5 + .5 * h31(floor(mn * 2.3 + 5.));
            float ml = max(dot(mn, normalize(uSunV.xyz + vec3(0., .5, 0.))), 0.);
            col = vec3(.8, .78, .72) * (.55 + .45 * smoothstep(.25, .6, mar)) * (ml * 1.25 + .012) * (1. - .35 * mr) * (1. - exp(-12. * exp(-tau * .5)));
            moon = 1.;
          }
          float seen = exp(-tau * uStarK) * (1. - moon) / (1. + glare * uSunV.w * 3.);
          col += vec3(.8, .88, 1.) * st * tw * (.8 + 6. * pow(fract(hs * 37.), 4.)) * seen;
          // the sky above the weather: stars of several magnitudes, a few with colour, crowding into the faint band of the Milky Way
          float seen2 = exp(-tau * uStarK * .3) * (1. - moon) / (1. + glare * uSunV.w * 3.);     // the faint field comes out as the sky drains
          if (seen2 > .004) {
            float lat = dot(d, uMW), mw = exp(-lat * lat / .035);
            float dust = n31(d * 7. + 3.) * .6 + n31(d * 19. + 11.) * .4, lane = smoothstep(.3, .62, dust) * (1. - .75 * smoothstep(.5, .7, n31(d * 11. + 40.)) * exp(-lat * lat / .006));
            vec3 sf = starL(d, 150., .1 + .22 * mw * lane, .11, px).rgb * 1.5 + starL(d, 310., .07 + .5 * mw * lane, .14, px).rgb * .9 + starL(d + .37, 520., .03 + .6 * mw * lane, .2, px).rgb * .55;
            // where the band's stars are finer than a pixel their light is still there: a faint grainy river, split by dust lanes
            sf += vec3(.72, .8, 1.) * (mw * lane * .06 + exp(-lat * lat / .14) * .007) * (.75 + .5 * h31(floor(d * 700.))) * smoothstep(.0002, .002, px);
            col += sf * seen2 * (.75 + .25 * tw);
          }
          // sunrise on the way: the air's layers light up along the limb well before the disc, wider and brighter as it comes
          float lim = max(uSunV.w * 1.3, uPre);
          col += layC * exp(-max(ht, 0.) / 19000.) * step(0., ht) * (sdv * sdv * .28 * uPre + s4 * sdv * 1.4 + s4 * s4 * s4 * s4 * 12.) * step(mu, 0.) * lim;
          col += sunC * (smoothstep(.99988, .99996, sdv) * 12. + glare);
          gl_FragColor = vec4(col, 1.);
        }`}));ea.frustumCulled=!1,ea.renderOrder=-10,Z.add(ea),await s.yield();const T=new t.Group;T.matrixAutoUpdate=!1,Z.add(T);const r0=C==="atoll"?new t.Vector4(3200,Qt,270,3.3):new t.Vector4(44e3,Qt,5200,.27),ta={...J,uCyc:eo,uTime:ee,uSunE:pt,uSunCol:e0,uSunAmt:Ja,uAmb:t0,uDeck0:to,uDeck0H:o0,uDeck0On:n0,uFire:ue,uThr:ce,uHeadG:Jt,uRing:{value:r0},uArcEnd:{value:C==="atoll"?3.3:2.8},uDesert:{value:C==="desert"?1:0},uAtoll:{value:C==="atoll"?1:0},uNight:{value:m?1:0},uColT:{value:0},uSeedV:{value:new t.Vector2(c.range(0,60),c.range(0,60))},uDeep:{value:w("#0a3f86",.55)},uTurq:{value:w(X[1],.85)},uShal:{value:w("#bfeede",.8)},uSand:{value:w(C==="desert"?"#d9b27e":X[3],.78)},uVeg:{value:w(X[4],1.15)},uVeg2:{value:w("#2f6b3a",.9)},uDry:{value:w(C==="desert"?"#b67838":"#9a8454",.75)},uDelta:{value:new t.Vector2(c.range(-9e4,-4e4),78e3)},uOchre:{value:w("#bf9a52",.8)},uRedE:{value:w("#a2602f",.8)},uSunV:B,uIsl:{value:Array.from({length:Ya},()=>new t.Vector3(0,0,0))}};await s.yield();const s0=new t.ShaderMaterial({uniforms:ta,fog:!1,vertexShader:`attribute vec2 aG; varying vec2 vG; varying vec3 vE;
        void main(){ vG = aG; vE = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,fragmentShader:`
        uniform float uTime, uSunAmt, uArcEnd, uDesert, uAtoll, uNight, uColT, uDeck0H, uDeck0On, uThr;
        uniform vec3 uSunE, uSunCol, uAmb, uDeep, uTurq, uShal, uSand, uVeg, uVeg2, uDry, uFire, uOchre, uRedE; uniform vec4 uSunV;
        uniform vec4 uRing, uDeck0; uniform vec2 uDelta, uSeedV, uHeadG; uniform vec3 uIsl[${Ya}];
        varying vec2 vG; varying vec3 vE;
        ${_e}
        ${Xt}
        ${Xo}
        // signed metres from the shore (land > 0): sandbar on a hooked peninsula (or an atoll ring) in a round gulf
        float landF(vec2 g, out float lagoon){
          float dist = length(g), n = 0.;
          n += 32e3 * (vn(g / 200e3 + uSeedV) - .5) * clamp(dist / 120e3, 0., 1.);
          n += 12e3 * (vn(g / 60e3 + uSeedV + 7.7) - .5) * clamp(dist / 40e3, 0., 1.);
          n += 4e3 * (vn(g / 18e3 + uSeedV + 1.3) - .5) * clamp(dist / 14e3, 0., 1.);
          n += 1100. * (vn(g / 5e3 + uSeedV + 5.9) - .5) * clamp(dist / 5e3, 0., 1.);
          n += 300. * (vn(g / 1500. + uSeedV + 2.2) - .5) * clamp(dist / 1800., 0., 1.);
          n += 90. * (vn(g / 400. + uSeedV + 8.4) - .5) * clamp((dist - 250.) / 500., 0., 1.);
          n += 22. * (vn(g / 90. + uSeedV + 4.4) - .5) * clamp((dist - 200.) / 300., 0., 1.);
          vec2 q = g - vec2(0., uRing.x);
          float rq = length(q), al = atan(q.x, -q.y + step(rq, 1e-3));
          float w = uRing.y + (uRing.z - uRing.y) * smoothstep(.03, .6, mix(al, abs(al), uAtoll));
          w = mix(${I0}., w, smoothstep(50., 520., dist));        // the pad stands on a narrow neck: surf both sides
          float arc = smoothstep(-uRing.w, -uRing.w * .6, al) * (1. - smoothstep(uArcEnd, uArcEnd + .15, al));
          arc = mix(arc, 1. - smoothstep(2.55, 3., abs(al)), uAtoll);       // the atoll's pass lies opposite the pad, the same from both sides
          arc *= mix(1., smoothstep(.3, .45, vn(vec2(cos(al), sin(al)) * 2.2 + 3. + uSeedV) + exp(-al * al * 9.)), uAtoll);
          float dP = w * arc - abs(rq - uRing.x) - (1. - arc) * 300.;
          float dM = length(g - vec2(0., -250e3)) - 330e3;
          lagoon = 1. - smoothstep(.8, 1.02, rq / uRing.x);
          float e = max(dP, dM) + n;
          float bi = (vn(g / 3000. + uSeedV + 11.3) - .64) * 6000. - abs(rq - uRing.x - 4500.) * .6 - 3000. * (1. - clamp(dist / 4000. - .6, 0., 1.));
          return max(e, bi);
        }
        float hgt(vec2 g){
          float rd = 1. - abs(2. * vn(g / 130e3 + uSeedV + 21.) - 1.), rd2 = 1. - abs(2. * vn(g / 38e3 + uSeedV + 5.) - 1.);
          return rd * rd * .62 + rd2 * .3 * rd + .16 * vn(g / 11e3 + 3.);
        }
        void main(){
          float lag; float e = landF(vG, lag);
          float fp = footpr(vG);
          vec3 up = normalize(vec3(vE.x, vE.y + ${H}., vE.z));
          vec3 V = normalize(uCamE - vE);
          // sea: depth colour, sand banks, seagrass, reef rings, the delta's stain
          float sh = exp(min(e, 0.) / (160. + min(fp, 900.) * 3.));
          // shoals run in bars and channels parallel to the shore; fine banks melt into big ones with distance
          float kf = 1. - smoothstep(60., 400., fp), als = dot(vG, vec2(.6, .8)), rqm = abs(length(vG - vec2(0., uRing.x)) - uRing.x);
          float bFine = mix(fbm(vG / 700. + uSeedV + 2.), fbm(vec2(rqm / 620., als / 1700.) + uSeedV), .45);
          float bBig = vn(vec2(rqm / 5200., als / 17000.) + uSeedV) * .6 + .4 * vn(vG / 9000. + uSeedV);
          float bank = mix(bBig, bFine * .75 + bBig * .25, kf);
          float dk = clamp(sh + lag * smoothstep(.38, .78, bank) * .5 + (1. - lag) * exp(min(e, 0.) / 9000.) * smoothstep(.52, .8, bank) * .6, 0., 1.);
          vec3 sea = mix(uDeep, uTurq, smoothstep(0., .7, dk)); sea = mix(sea, uShal, smoothstep(.72, 1., dk));
          float sg = smoothstep(.55, .7, vn(vG / 160. + 31.)) * smoothstep(.3, .6, dk) * (1. - smoothstep(.8, 1., dk)) / (1. + fp * .01);
          sea *= 1. - .45 * sg;
          vec2 rc = vG / 7000., ri = floor(rc), rf = fract(rc) - .5; float hh = h21(ri + 5.);
          float rl = length(rf + (vec2(h21(ri), h21(ri + 9.)) - .5) * .4) + (vn(vG / 900. + 7.) - .5) * .11 + (vn(vG / 2600. + 3.) - .5) * .12, rad = .12 + .2 * hh;
          float rmask = step(.8, hh) * clamp(length(vG) / 9000. - 1., 0., 1.) * step(e, -1500.) * (1. - smoothstep(50e3, 100e3, length(vG))) * (1. - smoothstep(700., 2600., fp));
          float rsoft = .05 + fp / 7000.;
          sea = mix(sea, mix(uTurq, uShal, .25 + .35 * vn(vG / 1500.)), (1. - smoothstep(rad - .1 - rsoft, rad + rsoft, rl)) * rmask * .8);
          vec2 dq = (vG - uDelta) / 60e3; float dl = length(dq);
          sea = mix(sea, vec3(.36, .27, .1), (1. - smoothstep(.15, 1., dl)) * (.45 + .55 * fbm(dq * 5. + vec2(0., -dl * 3.))) * .75);
          sea *= .9 + .2 * vn(vG / (3. + fp * 2.) + vec2(uTime * .5, uTime * .23));
          float surfZone = smoothstep(-60., -4., e) * (1. - smoothstep(-2., 3., e));
          float sl = sin(e * .2 + uTime * 1.5 + 5. * vn(vG / 70.));
          float foam = surfZone * smoothstep(.5, .95, sl) * (.45 + .55 * vn(vG / 7. + uTime * .2)) / (1. + fp * .2);
          foam += (1. - smoothstep(0., 5. + fp * 1.3, abs(e + 2.))) * .6 / (1. + fp * .0015);
          // land: beach, mangrove green, dry interior, tidal creeks
          // the mainland is a real place: green lowlands, ochre savanna, red earth, a mountain spine with lit and shaded flanks, rivers
          float veg = fbm(vG / 900. + 13.) * .6 + .4 * vn(vG / 60e3 + 2.);
          vec3 land = mix(uVeg, uVeg2, smoothstep(.3, .7, veg));
          float inl = smoothstep(4e3, 60e3, e);
          vec2 sdr = normalize(uSunE.xz + vec2(1e-5, 0.));
          float h0 = hgt(vG), h1 = hgt(vG + sdr * 5e3);
          float mtn = smoothstep(.42, .8, h0) * inl, relf = clamp((h0 - h1) * 7., -1., 1.) * inl;
          float orb = smoothstep(150., 1500., fp), fz = fbm(vG / 8e3 + 5.) - .5;      // from orbit: provinces with edges, not washes
          float dryK = smoothstep(.42 + .1 * orb, .7 - .1 * orb, vn(vG / 150e3 + 9. + uSeedV) + .3 * vn(vG / 20e3) - .1 * h0 + .07 * fz * orb);
          vec3 savanna = mix(uOchre, uRedE, smoothstep(.45 + .06 * orb, .75 - .06 * orb, vn(vG / 45e3 + 17.) + (.25 - .1 * orb) * fbm(vG / 9e3)));
          land = mix(land, mix(vec3(.11, .23, .05), vec3(.035, .13, .04), fbm(vG / 14e3 + 5.)), max(inl * .85, smoothstep(60., 600., fp) * .7));
          land = mix(land, savanna, max(uDesert * (1. - .55 * smoothstep(60e3, 220e3, e)), dryK) * (.55 + .45 * inl));
          land = mix(land, mix(uDry, uOchre * 1.1, smoothstep(40., 700., fp)), uDesert * (1. - smoothstep(2e3, 30e3, e)));
          land = mix(land, mix(vec3(.3, .25, .2), vec3(.62, .6, .56), smoothstep(.7, .95, h0)), mtn * .85);
          land *= 1. + .55 * relf;
          // from orbit the land is dark beside the cloud and carved: ridge lines lit on the sunward side, dendritic valleys, mottled cover
          float rA = fbm(vG / 24e3 + uSeedV + 40.), rB = fbm((vG + sdr * 2500.) / 24e3 + uSeedV + 40.);
          float rdg = 1. - abs(2. * rA - 1.), rdgB = 1. - abs(2. * rB - 1.), lk = orb * smoothstep(500., 6000., e);
          land *= 1. + lk * (clamp((rdg - rdgB) * 8., -.5, .7) + .5 * fz - .3 * smoothstep(.82, .97, rdg) - .3 * (1. - smoothstep(0., .045, abs(fz))) * (1. - smoothstep(1500., 5000., fp)) - .3);
          land *= mix(1., .78 + .4 * (sin(vG.x * .02 + vG.y * .035 + 6. * vn(vG / 800.)) * .5 + .5), uDesert * (1. - smoothstep(2., 30., fp)));
          float ck = abs(fbm(vG / 2600. + 40.) - .5);
          land = mix(land, uTurq * .55, (1. - smoothstep(0., .014 + fp * 2e-5, ck)) * (1. - smoothstep(500., 9000., e)) * smoothstep(60., 200., e) * (1. - uDesert) * (1. - .8 * orb));
          float rv = abs(vn(vG / 70e3 + 60. + uSeedV) + .45 * vn(vG / 21e3 + 3.) - .72);
          float rvw = .012 + .02 * (1. - smoothstep(5e3, 90e3, e)) + min(fp, 1200.) * 1.4e-5;
          land = mix(land, mix(uDeep * 1.3, uTurq * .7, .35 * (1. - orb)), (1. - smoothstep(rvw * .5, rvw, rv)) * smoothstep(300., 2500., e) * (1. - mtn * .7));
          land = mix(land, uVeg * 1.5, (1. - smoothstep(rvw, rvw * 4., rv)) * .6 * smoothstep(300., 2500., e) * (1. - mtn));
          float fpb = min(fp, 60.) + .12 * min(fp, 1200.);       // the beach stays a rim: from height the land is its own colour, not sand
          land = mix(uSand, land, smoothstep(22. + fpb, 80. + fpb * 3., e) * mix(1., mix(.4, .9, smoothstep(30., 400., fp)), uAtoll));
          land = mix(land, uSand * (.78 + .26 * vn(vG / 45. + 3.)), (1. - smoothstep(1500., 7000., length(vG))) * mix(.95, .7, smoothstep(.5, .7, vn(vG / 130. + uSeedV))) * smoothstep(20., 60., e));
          // wind ripples and tyre tracks in the sand near the pad
          float nearK = (1. - smoothstep(1.2, 4., fp)) * (1. - smoothstep(500., 900., length(vG)));
          land *= 1. + nearK * (.1 * sin(dot(vG, vec2(.9, .45)) * 1.5 + 5. * vn(vG / 13.)) * vn(vG / 31. + 5.) - .05);
          float trk = abs(abs(vG.y - 10. * vn(vec2(vG.x / 80., 2.)) + 6.) - 17.);
          land *= 1. - .22 * nearK * (1. - smoothstep(.3, .9 + fp, abs(trk - 1.1))) * step(40., abs(vG.x));
          land *= .9 + .2 * vn(vG / (6. + fp * 3.)) / (1. + fp * .004);
          float isSea = 1. - smoothstep(-1. - fp * .3, 1. + fp * .3, e);
          vec3 col = mix(land, sea, isSea);
          // mangrove islets: dark green on a pale apron of root shadow, so the crowns stand on something
          if (dot(vG, vG) < 4.2e7) {
            float isl = -1.;
            for (int i = 0; i < ${Ya}; i++) { vec3 it = uIsl[i]; isl = max(isl, 1. - length(vG - it.xy) / max(it.z, 1.)); }
            isl += (vn(vG / 70. + 9.) - .5) * .7 + (vn(vG / 24.) - .5) * .3 + (vn(vG / 7.) - .5) * .12 / (1. + fp * .1);
            float isf = fp * .012;
            col = mix(col, uShal * .9, smoothstep(-.5 - isf, -.04, isl) * isSea * .7 / (1. + fp * .12));
            col = mix(col, mix(uVeg * 1.5, uVeg2 * .8, vn(vG / 17. + 4.)) * (.75 + .5 * vn(vG / (5. + fp))), smoothstep(-.02 - isf, .1 + isf, isl));
          }
          col = mix(col, vec3(.86), clamp(foam, 0., 1.));
          // shadows of the first cloud deck and of the exhaust column
          vec2 sx = uSunE.xz / max(uSunE.y, .2);
          float shade = 1. - .5 * uDeck0On * cloudA(vG + sx * uDeck0H, uDeck0, uTime, fp);
          shade *= 1. - .5 * stormA(vG + sx * 9000., uTime);
          vec2 sd = normalize(-uSunE.xz + vec2(1e-5, 0.)); float along = dot(vG, sd), len = uColT * length(sx);
          float perp = abs(dot(vG, vec2(-sd.y, sd.x)) + 40. * sin(along * .004) + .06 * along * sin(along * .0011));
          float cw = 70. + along * .05 + fp;
          shade *= 1. - .65 * (1. - smoothstep(cw * .35, cw, perp)) * step(0., along) * (1. - smoothstep(len * .9, len + 1., along));
          vec3 lit = col * (uSunCol * uSunAmt * shade + uAmb);
          // sun glint, fire glow on the ground, town lights at night
          vec3 N = normalize(up + .07 * vec3(vn(vG / (4. + fp) + uTime * .6) - .5, 0., vn(vG / (4. + fp) + 7. - uTime * .5) - .5));
          float sp = pow(max(dot(reflect(-V, N), uSunE), 0.), 80.), sp2 = pow(max(dot(reflect(-V, up), uSunE), 0.), 10.);
          lit += isSea * uSunCol * uSunAmt * shade * (sp * 3. + sp2 * .22);
          float spv = max(dot(reflect(-V, N), uSunV.xyz), 0.); spv *= spv; spv *= spv; spv *= spv;
          lit += isSea * vec3(1., .62, .3) * uSunV.w * (spv * spv * 2.2 + spv * .25);
          float hd = length(vG - uHeadG);
          float gr = 110. + uAlt * .3; lit += col * uFire * uThr * ((1.5 * exp(-hd * hd / (gr * gr)) + 6. * exp(-hd * hd / 2500.)) / (1. + uAlt * .012));
          vec2 tc = vG / 650., ti = floor(tc); float th = h21(ti + 2.);
          float band = smoothstep(0., 250., e) * (1. - smoothstep(1500., 7000., e)) * smoothstep(.45, .7, vn(vG / 12e3 + 50.)) * (.25 + .75 * smoothstep(.4, .75, vn(vG / 3500. + 9.)));
          float dotl = (1. - smoothstep(0., .1 + fp / 650., length(fract(tc) - .5 - (vec2(h21(ti + 3.), h21(ti + 8.)) - .5) * .7))) * step(.5, th);
          lit += uNight * band * vec3(.75, .9, 1.) * mix(dotl * 5., .2 + 1.6 * pow(vn(vG / (fp * 2.5)), 3.), clamp(fp / 400., 0., 1.)) * (.8 + .2 * sin(uTime * 3. + th * 40.));
          // from height at night: cities strung along the coasts and rivers; and the first low sun of the orbital leg on whatever faces it
          float cl = uNight * step(0., e) * (exp(-e / 25e3) * .8 + .6 * (1. - smoothstep(rvw, rvw * 7., rv))) * smoothstep(.3, .62, vn(vG / 30e3 + 70. + uSeedV)) * smoothstep(.5, .78, vn(vG / 6e3 + 31.)) * smoothstep(30., 300., fp);
          vec2 cc = vG / 2500.; float cdot = (1. - smoothstep(0., .3 + fp / 2500., length(fract(cc) - .5 - (vec2(h21(floor(cc) + 4.), h21(floor(cc) + 14.)) - .5) * .6))) * step(.4, h21(floor(cc) + 11.));
          lit += vec3(1., .7, .36) * cl * mix(cdot * 4., .6, clamp(fp / 2500., 0., 1.)) * (.85 + .15 * sin(uTime * 2. + vG.x * .01));
          lit += col * vec3(1., .66, .4) * uSunV.w * mix(.3, 1.6, uNight) * smoothstep(-.03, .22, dot(up, uSunV.xyz)) * shade;
          gl_FragColor = vec4(aerial(lit, vE), 1.);
        }`}),ao=new t.Mesh(Yo(0),s0);ao.frustumCulled=!1,T.add(ao),await s.yield();const l0=fe.map((e,a)=>{const n={...J,uCyc:eo,uTime:ee,uSunE:pt,uFire:ue,uThr:ce,uHeadG:Jt,uDk:{value:new t.Vector4(e[1],e[2],e[3],e[4])},uFade:{value:0},uLit:{value:b.cloud},uShade:{value:b.cloud.clone().multiply(new t.Color(.42,.5,.7))},uLantern:{value:m?1.6:F?.7:.4},uH:{value:e[0]},uStorm:{value:a===fe.length-1?1:0},uGlory:{value:m?0:F?.6:1},uSunV:B,uPierce:{value:new t.Vector2(0,-$t(Math.max(e.t,0)))}},r=new t.Mesh(Yo(e[0],40,64),new t.ShaderMaterial({uniforms:n,transparent:!0,depthWrite:!1,fog:!1,vertexShader:`attribute vec2 aG; varying vec2 vG; varying vec3 vE;
          void main(){ vG = aG; vE = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,fragmentShader:`
          uniform float uTime, uFade, uThr, uLantern, uH, uStorm, uGlory; uniform vec2 uPierce; uniform vec3 uSunE, uFire, uLit, uShade; uniform vec4 uDk, uSunV; uniform vec2 uHeadG;
          varying vec2 vG; varying vec3 vE;
          ${_e}
          ${Xt}
          ${Xo}
          float gs(float x){ return exp(-x * x); }
          void main(){
            float fp = footpr(vG);
            vec2 sd = normalize(uSunE.xz + vec2(1e-5, 0.));
            float thr = 1.08 - uDk.y, d0 = cloudD(vG, uDk, uTime, fp), a0 = smoothstep(thr - .07, thr + .1, d0), stm = uStorm > 0. ? stormA(vG, uTime) : 0.;
            a0 *= smoothstep(.9, 2.1, length(vG - uCyc.xy) / uCyc.z);      // the decks' own cloud stands back from the cyclone: the spiral is seen whole on open sea
            float a = max(a0, stm * uStorm) * uFade;
            if (a < .004) discard;
            float rel = clamp((d0 - cloudD(vG + sd * max(uDk.x * .22, fp * 1.6), uDk, uTime, fp)) * 5. + .52, 0., 1.);
            if (stm > a0) rel = clamp(mix(rel, (stm - stormA(vG + sd * 14e3, uTime)) * 1.6 + .62 + .25 * (fbm(vG / 9e3) - .5), .8), 0., 1.);
            // thick cloud is white on its sunward shoulders, blue in the hollows, thin at its ragged edge
            vec3 col = mix(uShade, uLit, rel * (.5 + .5 * a)) * (.86 + .2 * smoothstep(.3, 1., a));
            // on the deck below us: our own shadow in a glory at the antisolar point, and the smoke column's pencil shadow leading to it
            float gk = uGlory * step(uH + 60., uAlt) * a;
            vec3 vr = normalize(vE - uCamE + vec3(0., 1e-3, 0.)); float ang = acos(clamp(dot(vr, -uSunE), -1., 1.));
            col += (vec3(gs((ang - .092) / .013), gs((ang - .078) / .013), gs((ang - .064) / .013)) * .6 + vec3(gs((ang - .165) / .018), gs((ang - .148) / .018), gs((ang - .13) / .018)) * .22 + gs(ang / .035) * .3) * gk;
            col *= 1. - .7 * gs(ang / .012) * gk;
            vec2 sB = uHeadG - uSunE.xz / max(uSunE.y, .2) * max(uAlt - uH, 0.), pa = vG - uPierce, ba = sB - uPierce;
            float hh = clamp(dot(pa, ba) / max(dot(ba, ba), 1.), 0., 1.), dl = length(pa - ba * hh + 60. * sin(hh * 9.) * vec2(-ba.y, ba.x) / max(length(ba), 1.)), lw = mix(300., 45., hh);
            col *= 1. - .42 * (1. - smoothstep(lw * .35, lw, dl)) * gk * smoothstep(0., .04, hh);
            float fs = max(dot(vr, uSunV.xyz), 0.), fs2 = fs * fs; fs2 *= fs2;
            col += vec3(1., .58, .26) * uSunV.w * (fs2 * fs2 * .9 + fs2 * fs2 * fs2 * fs2 * 2.) * (.35 + .65 * rel);
            float hd = length(vG - uHeadG), rg = 600. + abs(uAlt - uH) * .5;
            col += uFire * uThr * uLantern * exp(-hd * hd / (rg * rg)) * (.6 + .4 * rel) / (1. + abs(uAlt - uH) * 2e-4);
            gl_FragColor = vec4(aerial(col, vE), a * .96);
          }`}));return r.frustumCulled=!1,r.renderOrder=1+a,r.visible=!1,T.add(r),{mesh:r,U:n,h:e[0],t:e.t,d4:e[4]}});await s.yield();const gt=R*30*_,Ve=new t.Color(.25,.25,.245),aa=new t.Color(.035,.035,.04),Qe=new t.Color(.17,.19,.22),E=new t.Color(.36,.38,.4),ve=new t.Color(.7,.7,.68),oa=new t.Color(.3,.3,.29),oo=new t.Color(.6,.63,.64),Ae=(e,a,n,r)=>{const o=a[0]-e[0],l=a[1]-e[1],d=a[2]-e[2],p=Math.hypot(o,l,d);return i(p,n,n,(e[0]+a[0])/2,(e[1]+a[1])/2,(e[2]+a[2])/2,r,Math.atan2(-d,o),0,Math.asin(l/p))},wt=[ie(be.x/Math.max(be.y,.3),-1,1)*4,ie(be.z/Math.max(be.y,.3),-1,1)*4],x=[],i0=new t.Color(.4,.37,.27),no=new t.Color(.1,.1,.1),O=new t.Color(.74,.74,.72),na=new t.Color(.2,.22,.25),Ce=-36,Te=[-150,-30],Ee=[75,8];for(let e=0;e<10;e++){const a=.2+.07*(e*7%10)/10;x.push(j(new t.CylinderGeometry(28,29,.7,5,1,!1,e/10*D,D/10),new t.Color(a,a,a*.97)).translate(0,.35,0))}x.push(j(new t.CylinderGeometry(13,13,.1,20),new t.Color(.11,.105,.1)).translate(0,.74,0)),x.push(i(13,.3,126,0,.82,0,aa),i(1.3,1.5,126,7.1,1,0,Ve),i(1.3,1.5,126,-7.1,1,0,Ve));for(let e=0;e<16;e++){const a=e/16*D+.35*Math.sin(e*2.4),n=12+e%3*2,r=9+e*5%7;x.push(i(1.1+e%4*.5,.06,r,Math.sin(a)*(n+r/2),.76,Math.cos(a)*(n+r/2),new t.Color(.1,.095,.09),a))}for(let e=0;e<24;e++){if(e%12===0)continue;const a=e/24*D;x.push(i(.5,.06,3.1,Math.sin(a)*21,.78,Math.cos(a)*21,O,a+Math.PI/2))}for(const e of[-1,1])for(let a=0;a<4;a++)x.push(i(3.2,.06,.9,e*(10.6+a%2*.01),.79,-5.4+a*3.6,a%2?aa:O,e*.5));await s.yield();for(const e of[-1,1])for(const a of[-1,1])x.push(i(1.3,7,1.3,e*3.6,3.9,a*3.6,E));for(const e of[-1,1])x.push(i(9.4,1,1.5,0,7.5,e*3.9,E),i(1.5,1,9.4,e*3.9,7.5,0,E));for(let e=0;e<10;e++){const a=e/10*D;x.push(i(.5,2.2,.5,Math.cos(a)*9,1.6,Math.sin(a)*9,E))}for(const e of[-1,1]){x.push(i(.7,.7,70,e*8.6,1.5,0,O));for(let a=-4;a<=4;a++)x.push(i(1.6,.5,.5,e*7.7,2,a*7.5,E));x.push(j(new t.CylinderGeometry(.9,1.1,3.4,8),O).translate(e*11,2.2,11),j(new t.CylinderGeometry(.9,1.1,3.4,8),O).translate(e*11,2.2,-11))}x.push(j(new t.CylinderGeometry(5.5,5.5,7,14),O).translate(-40,33,22),j(new t.CylinderGeometry(5.5,.8,4,14),O).translate(-40,27.5,22),i(1.4,26,1.4,-40,13,22,E),i(.7,.7,30,-40,1.2,8,O));for(let e=0;e<4;e++)x.push(Ae([-40+Math.cos(e*D/4+.8)*7,.5,22+Math.sin(e*D/4+.8)*7],[-40+Math.cos(e*D/4+.8)*4.6,29.5,22+Math.sin(e*D/4+.8)*4.6],.6,E));x.push(j(new t.CylinderGeometry(6.5,6.5,.06,14),no).translate(-40-wt[0]*2.4,.78,22-wt[1]*2.4)),await s.yield();const ra=[];for(const[e,a]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const n=e*45,r=a*41,o=92,l=(p,S)=>[n+p[0]*(3.6-3.2*S/o),S,r+p[1]*(3.6-3.2*S/o)],d=[[-1,-1],[1,-1],[1,1],[-1,1]];x.push(i(9.5,.8,9.5,n,.4,r,Ve),i(.35,12,.35,n,o+6,r,O)),ra.push([n,o+11,r]);for(let p=0;p<4;p++){x.push(Ae(l(d[p],.6),l(d[p],o),.5,na));for(let S=0;S<o-1;S+=11.5){const G=Math.min(o,S+11.5),V=(p+S/11.5)%2<1;x.push(Ae(l(d[p],V?S+.6:G),l(d[(p+1)%4],V?G:S+.6),.3,na)),x.push(Ae(l(d[p],G),l(d[(p+1)%4],G),.3,G>o-24?O:na))}}}await s.yield();for(let e=0;e<4;e++){const a=ra[e],n=ra[(e+1)%4];let r=a;for(let o=1;o<=10;o++){const l=o/10,d=[U(a[0],n[0],l),a[1]-12*Math.sin(l*Math.PI),U(a[2],n[2],l)];x.push(Ae(r,d,.32,E)),r=d}}await s.yield(),x.push(i(84,1.6,30,87,.8,Ce,i0),i(88,.7,.7,60,1.3,Ce+17.5,O),i(.7,.7,12,16.4,1.3,Ce+23.5,O),i(88,.5,.5,60,1.2,Ce+19,E));for(let e=0;e<3;e++){const a=62+e*25,n=Ce;x.push(j(new t.SphereGeometry(9,16,10),ve).translate(a,12.6,n),j(new t.CylinderGeometry(9.6,9.6,.06,16),no).translate(a-wt[0],1.64,n-wt[1])),x.push(j(new t.TorusGeometry(9.05,.25,4,20).rotateX(Math.PI/2),E).translate(a,12.6,n),i(.6,.6,17,a,1.9,n+9,O),i(1.2,9.5,1.2,a,21.5,n,E));for(let r=0;r<4;r++)x.push(i(.8,9,.8,a+Math.cos(r*D/4+.6)*6.5,5.6,n+Math.sin(r*D/4+.6)*6.5,E))}x.push(i(316,.5,14,188,.4,0,oa),i(300,.06,.4,196,.68,0,O),i(40,.5,9,75,.4,5,oa));const u0=c.int(5,8);for(let e=0;e<u0;e++){const a=300+e*c.range(55,75),n=(e%2?1:-1)*(36+(c.range(55,110)-55)*.4),r=c.range(40,70),o=c.range(14,30),l=24+(c.range(30,50)-30)*.6;x.push(i(r,o,l,a,o/2,n,ve),i(r+2,1.2,l+2,a,o+.6,n,oo),i(r*.5,o*.7,.6,a,o*.35,n+l/2+.2,E),i(r*.9,.5,1.4,a,o+1.4,n,E))}await s.yield();const me=.22*R,he=[Math.sin(me),Math.cos(me)],xt=12,pe=C==="atoll"?1500:3e3,De=(e,a)=>[Ee[0]+he[0]*e+he[1]*a,Ee[1]+he[1]*e-he[0]*a],yt=De(xt+pe/2,0);x.push(i(16,2.6,pe,yt[0],.9,yt[1],oa,me),i(.4,.08,pe,yt[0],2.22,yt[1],O,me));for(const e of[-1,1]){const a=De(xt+pe/2,e*8.4),n=De(xt+pe/2,e*6.6);x.push(i(1.2,3.1,pe,a[0],1,a[1],Ve,me),i(.3,.08,pe,n[0],2.22,n[1],O,me))}const ro=De(1150,40),so=De(1150,32);x.push(i(26,3,90,ro[0],1.2,ro[1],Ve,me),i(8,9,70,so[0],5,so[1],ve,me)),x.push(i(5,12,5,Te[0],6,Te[1],ve),i(11,.8,11,Te[0],.4,Te[1],Ve)),await s.yield();const je=new t.MeshLambertMaterial({vertexColors:!0});je.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`varying vec3 vOb, vON;
#include <common>`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vOb = position; vON = normal;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`varying vec3 vOb, vON;
        float ph21(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
        float pvn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(ph21(i), ph21(i + vec2(1., 0.)), f.x), mix(ph21(i + vec2(0., 1.)), ph21(i + vec2(1., 1.)), f.x), f.y); }
        #include <common>`).replace("#include <color_fragment>",`#include <color_fragment>
        { vec3 an = abs(vON); vec2 pp = an.y > .6 ? vOb.xz : an.x > an.z ? vOb.zy : vOb.xy;
          float fw = length(fwidth(pp)) + 1e-4;
          vec2 gq = abs(fract(pp / 4. + .5) - .5) * 4.;
          float joint = 1. - smoothstep(.03 + fw * .5, .07 + fw * 1.5, min(gq.x, gq.y));
          float stn = pvn(pp * .35) * .6 + pvn(pp * 1.9) * .4;
          diffuseColor.rgb *= (.74 + .46 * stn) * (1. - .5 * joint / (1. + fw * 2.));
          diffuseColor.rgb *= 1. - (1. - an.y) * .3 * pvn(vec2(pp.x * 2.5, pp.y * .13)); }`)};const lo=new t.Mesh(Ue(x),je);T.add(lo),await s.yield();const Ze=new t.Group;Ze.rotation.y=gt,T.add(Ze);const Fe=[],te=-17.5,$e=88;for(const e of[-1,1])for(const a of[-1,1])Fe.push(i(.7,$e,.7,te+e*4,$e/2,a*4,Qe));for(let e=0;e<$e;e+=8){const a=[[-4,-4],[4,-4],[4,4],[-4,4]];for(let n=0;n<4;n++){const r=a[n],o=a[(n+1)%4],l=(n+e/8)%2<1;Fe.push(Ae([te+r[0],e+8,r[1]],[te+o[0],e+8,o[1]],.4,Qe)),Fe.push(Ae([te+r[0],l?e:e+8,r[1]],[te+o[0],l?e+8:e,o[1]],.3,Qe))}e%16===0&&Fe.push(i(7.6,.3,7.6,te,e+8.2,0,E))}Fe.push(i(.5,26,.5,te,$e+13,0,ve),i(9.4,.5,9.4,te,$e+.4,0,E)),await s.yield(),Ze.add(new t.Mesh(Ue(Fe),je)),await s.yield();const St=new t.Group;St.position.set(te+4,0,4),Ze.add(St),St.add(new t.Mesh(Ue([i(11.2,2.2,1.6,5.6,36,-3.2,E),i(11.2,1.2,1.2,5.6,54,-3.2,E),i(1.6,3,2.4,10.6,36,-3.2,ve),i(1.2,1.8,1.8,10.8,54,-3.2,ve),i(11.2,.25,.25,5.6,55.4,-2.6,Qe),i(11.2,.25,.25,5.6,55.4,-3.8,Qe)]),je));const Pe=new t.Group;Pe.position.set(Te[0],13,Te[1]),T.add(Pe);const io=[];for(let e=0;e<=8;e++){const a=e/8*8;io.push(new t.Vector2(a,a*a*.045))}const uo=new t.MeshLambertMaterial({color:ve,side:t.DoubleSide}),co=new t.Mesh(new t.LatheGeometry(io,20).rotateX(Math.PI/2),uo);Pe.add(co),co.add(new t.Mesh(new t.CylinderGeometry(.2,.2,5,5).rotateX(Math.PI/2).translate(0,0,2.5),uo)),await s.yield();const vo={value:0},fo={value:1},bt=new t.MeshLambertMaterial({side:t.DoubleSide});bt.onBeforeCompile=e=>{e.uniforms.uTime=ee,e.uniforms.uBlast=vo,e.uniforms.uShrink=fo,e.vertexShader=e.vertexShader.replace("#include <common>",`uniform float uTime, uBlast, uShrink;
#include <common>`).replace("#include <begin_vertex>",`#include <begin_vertex>
        { vec3 ip = instanceMatrix[3].xyz; float ph = ip.x * .37 + ip.z * .53, dd = length(ip.xz);
          float amp = (.05 + uBlast * 1.1 * exp(-dd / 700.)) * max(position.y, 0.) * .35;
          transformed.x += amp * (sin(uTime * (1.3 + 6. * uBlast) + ph) + .5 * sin(uTime * 3.7 + ph * 1.7));
          transformed.z += amp * cos(uTime * (1.1 + 5. * uBlast) + ph * 1.3);
          transformed.xz += normalize(ip.xz + vec2(1e-3, 0.)) * uBlast * exp(-dd / 700.) * max(position.y, 0.) * .5;
          transformed *= uShrink; }`)};const mo=new t.IcosahedronGeometry(1,0);mo.scale(1,.55,1).translate(0,.4,0);const sa=Math.round((C==="mangrove"?5e3:C==="atoll"?1800:700)*f*k),Le=new t.InstancedMesh(mo,bt,sa),z=c.fork("flora"),la=new t.Matrix4,ia=new t.Quaternion,ua=new t.Vector3,Be=new t.Vector3,ho=new t.Color,Xe=[];for(let e=0;e<46;e++)Xe.push([z.range(-3600,3600),z.range(380,3400),z.range(35,170)]);const c0=(e,a)=>Math.abs((e-Ee[0])*he[1]-(a-Ee[1])*he[0])>16||(e-Ee[0])*he[0]+(a-Ee[1])*he[1]<0,d0=w(X[4],2.8),v0=w("#3a8048",1.1),f0=w("#5a5a30",.7);let Ye=0;for(let e=0;e<sa*3&&Ye<sa;e++){let a,n,r;if(C==="mangrove"){if(z.chance(.86)){const o=Xe[Math.floor(Math.pow(z(),1.3)*Xe.length)],l=z()*D,d=Math.sqrt(z())*o[2];a=o[0]+Math.cos(l)*d,n=o[1]+Math.sin(l)*d}else if(a=z.range(-3800,3800),n=Qt-85+(z.range(215,300)-215)*1.3,Math.abs(a)<420)continue;r=z.range(4,9)}else if(C==="atoll"){const o=z.range(-3.1,3.1),l=3200+z.range(-150,150);if(a=Math.sin(o)*l,n=3200-Math.cos(o)*l,r=z.range(4,8),Math.hypot(a,n)<330)continue}else if(a=z.range(-4200,4200),n=z.range(-240,240)*.5,r=z.range(1.5,3.2),Math.abs(a)<480)continue;c0(a,n)&&(Le.setMatrixAt(Ye,la.compose(ua.set(a,C==="desert"?0:1.5,n),ia.setFromAxisAngle(Be.set(0,1,0),z()*D),Be.set(r,r*z.range(.8,1.3),r))),Le.setColorAt(Ye,C==="desert"?ho.copy(f0).multiplyScalar(z.range(.7,1.2)):ho.copy(d0).lerp(v0,z()*.6).multiplyScalar(z.range(.75,1.2))),Ye++,(e&255)===0&&await s.yield())}Le.count=Ye,Le.frustumCulled=!1,T.add(Le),C==="mangrove"&&Xe.forEach((e,a)=>ta.uIsl.value[a].set(e[0],e[1],e[2]*1.12));const po=[i(.5,9,.5,.3,4.5,0,new t.Color(.3,.24,.17),0,0,-.06)];for(let e=0;e<12;e++){const a=new t.PlaneGeometry(.8,5.4,1,3),n=a.attributes.position,r=2.4+1.6*(e*5%4)/3;for(let o=0;o<n.count;o++){const l=(n.getY(o)+2.7)/5.4;n.setXYZ(o,n.getX(o)*(1-.85*l),1.5*l-(r+1.4)*l*l,l*(4.6+e%3*.5))}a.rotateY(e/12*D+.3+.2*Math.sin(e*3.1)).translate(.55,9,0),a.computeVertexNormals(),po.push(j(a,w("#2c5a22",.6+.25*(e*7%3)/2)))}await s.yield();const go=Math.round((pe-60)/24)*2,ca=bt.clone();ca.vertexColors=!0,ca.onBeforeCompile=bt.onBeforeCompile;const Mt=new t.InstancedMesh(Ue(po),ca,go);for(let e=0;e<go;e++){const a=xt+44+Math.floor(e/2)*24+z.range(-4,4),n=(e%2?1:-1)*11.5,r=z.range(.9,1.5),o=De(a,n);Mt.setMatrixAt(e,la.compose(ua.set(o[0],1.8,o[1]),ia.setFromAxisAngle(Be.set(0,1,0),z()*D),Be.set(r,r,r)))}Mt.frustumCulled=!1,T.add(Mt),await s.yield();const h=$a(String(s.seed)+":towers"),At=m?w("#93a0bd",.12):F?w("#aab4d6",.5):w("#f3f1ea",.8);function ke(e,a){const n=e.length,r=new t.InstancedBufferGeometry;r.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),r.setIndex([0,1,2,0,2,3]);const o=new Float32Array(n*3),l=new Float32Array(n*3),d=new Float32Array(n*4);e.forEach((G,V)=>{o.set(G.p,V*3),l.set(G.v||[0,0,0],V*3),d.set([G.s0,G.grow||0,G.t0||0,(a.rng||c)()],V*4)}),r.setAttribute("aP",new t.InstancedBufferAttribute(o,3)),r.setAttribute("aV",new t.InstancedBufferAttribute(l,3)),r.setAttribute("aS",new t.InstancedBufferAttribute(d,4)),r.instanceCount=n;const p={...J,uTime:ee,uFire:ue,uThr:ce,uClock:{value:0},uLoop:{value:a.loop||0},uLife:{value:a.life||1e9},uDrag:{value:a.drag||.4},uRise:{value:a.rise||0},uLit:{value:a.lit||At},uShade:{value:(a.lit||At).clone().multiply(new t.Color(.5,.58,.72))},uOp:{value:a.opacity??.8},uGlowK:{value:a.glow??0},uSunView:Me,uBall:{value:a.ball??0}};a.shade&&(p.uShade.value=a.shade);const S=new t.Mesh(r,new t.ShaderMaterial({uniforms:p,transparent:!0,depthWrite:!1,fog:!1,vertexShader:`
          attribute vec3 aP, aV; attribute vec4 aS; uniform float uClock, uLoop, uLife, uDrag, uRise, uGlowK;
          varying vec2 vQ; varying float vA, vSeed, vGl; varying vec3 vE;
          void main(){
            float age = uClock - aS.z; if (uLoop > 0.) age = mod(age + 1000. * uLoop, uLoop);
            float on = step(0., age); age = max(age, 0.);
            vec3 c = aP + aV * (1. - exp(-age * uDrag)) / uDrag + vec3(0., uRise * age, 0.);
            float sz = aS.x + aS.y * sqrt(age), end = uLoop > 0. ? uLoop : uLife;
            vA = on * smoothstep(0., .35, age) * (1. - smoothstep(end * .6, end, age));
            vQ = position.xy; vSeed = aS.w; vE = c; vGl = uGlowK * exp(-length(c.xz) / 110.);
            vec4 mv = modelViewMatrix * vec4(c, 1.);
            mv.xy += position.xy * sz * length(modelMatrix[0].xyz);
            gl_Position = projectionMatrix * mv;
          }`,fragmentShader:`
          uniform float uTime, uOp, uThr, uBall; uniform vec3 uLit, uShade, uFire, uSunView; varying vec2 vQ; varying float vA, vSeed, vGl; varying vec3 vE;
          ${_e}
          ${Xt}
          void main(){
            float r = length(vQ), n = vn(vQ * 2.3 + vSeed * 40. + uTime * .13), n2 = vn(vQ * 5.5 + vSeed * 17. - uTime * .2);
            float a = vA * (1. - smoothstep(.3 + .3 * n + .2 * uBall, 1. - .08 * uBall, r + .25 * n2)) * uOp;
            if (a < .004) discard;
            float lt = .55 + .45 * vQ.y;
            if (uBall > 0.) { vec3 bn = vec3(vQ, sqrt(max(1. - r * r, 0.))); lt = mix(lt, clamp(dot(bn, uSunView) * .8 + .4 + .4 * (n2 - .5), 0., 1.), uBall); }
            vec3 col = mix(uShade, uLit, clamp(lt + .3 * (n - .5), 0., 1.)) + uFire * uThr * vGl;
            col = mix(col, uShade * .8, uBall * .35 * smoothstep(.1, .6, r) * (1. - lt));
            gl_FragColor = vec4(aerial(col, vE), a);
          }`}));return a.additive&&(S.material.blending=t.AdditiveBlending),S.frustumCulled=!1,S.renderOrder=a.order??2,T.add(S),{mesh:S,U:p}}const M=c.fork("steam"),wo=[],Ct=e=>[e[2],e[1],e[0]];for(let e=0;e<Math.round(150*k);e++){const a=e%2?1:-1,n=M.range(40,95);wo.push({p:Ct([a*M.range(4,16),M.range(1,5),M.range(-5,5)]),v:Ct([a*n,M.range(4,16),M.range(-16,16)]),s0:M.range(4,8),grow:M.range(10,19),t0:-2.6+Math.pow(M(),1.5)*8.4})}const xo=ke(wo,{life:16,drag:.45,rise:2.2,opacity:.72,glow:m?2.2:.7,order:3});await s.yield();const yo=[];for(let e=0;e<Math.round(76*k);e++){const a=e/76*D*5.03+h.range(-.2,.2),n=h.range(18,52);yo.push({p:[Math.cos(a)*h.range(5,12),h.range(1,6),Math.sin(a)*h.range(5,12)],v:[Math.cos(a)*n,h.range(5,22),Math.sin(a)*n],s0:h.range(3,6),grow:h.range(7,12),t0:1.2+Math.pow(h(),1.4)*4.6})}const So=ke(yo,{life:15,drag:.6,rise:3.5,opacity:.9,glow:m?2.4:.6,order:3,ball:1,rng:h});await s.yield();const da=[];for(let e=0;e<3;e++)for(let a=0;a<9;a++)da.push({p:[62+e*25,26.5,Ce],v:[M.range(8,14),M.range(3,6),M.range(-3,3)],s0:1.2,grow:M.range(3,5),t0:a*.5+e*.17});for(let e=0;e<12;e++)da.push({p:[1.9,Xa+30+e%3*9,(e%2?1:-1)*.6],v:[M.range(5,9),M.range(-2.5,-1),M.range(-2,2)],s0:.5,grow:M.range(1.6,2.6),t0:e*.37});const va=ke(da,{loop:4.5,drag:.5,opacity:.5});await s.yield();const bo=[];for(let e=0;e<64;e++){const a=e%2?1:-1;bo.push({p:Ct([a*M.range(3,9),M.range(1,2.5),M.range(-3.5,3.5)]),v:Ct([a*M.range(70,150),M.range(0,9),M.range(-7,7)]),s0:M.range(2.5,4),grow:M.range(5,9),t0:e/64*.9})}const kt=ke(bo,{loop:.9,drag:1.3,opacity:0,lit:new t.Color(2.6,1.25,.4),shade:new t.Color(1.5,.45,.1),additive:!0,order:4});let fa=null;if(K==="wall"){const e=[],a=-R*c.range(2500,4500),n=c.range(4500,6500);for(let r=0;r<150;r++){const o=900+Math.pow(M(),.8)*7200,l=o/8100,d=900+1400*(1-l)+2600*v(.82,1,l),p=M()*D,S=Math.sqrt(M())*d;e.push({p:[a+Math.cos(p)*S*1.8,o,n+Math.sin(p)*S],s0:M.range(600,1150),t0:-5})}e.sort((r,o)=>r.p[1]-o.p[1]),fa=ke(e,{lit:b.cloud,opacity:.95,order:4})}await s.yield();const ma=[],Mo=K==="fog"?9:13;for(let e=0;e<Mo;e++){const a=e/Mo*D+h.range(-.2,.2),n=e%3===0?h.range(950,1500):h.range(2300,6200);let r=Math.sin(a)*n,o=Math.cos(a)*n*.9+(e%3===0?500:600);o<150&&Math.abs(r)<2200&&(e%3===0?o=300-o*.6:r=(r<0?-1:1)*(2200+Math.abs(r)));const l=1900+h()*2600*(n/6200+.35),d=10+Math.round(8*k),p=h.range(-.2,.2),S=h.range(-.2,.2);for(let G=0;G<d;G++){const V=G/(d-1),le=U(1150,l,Math.pow(V,.85)),$=U(1,.42,V)+.3*Math.exp(-(((V-.85)/.14)**2)),xe=(430+260*h())*$*(.7+.5*n/6200);ma.push({p:[r+(le-1150)*p+h.range(-1,1)*xe*.8,le,o+(le-1150)*S+h.range(-1,1)*xe*.8],s0:xe,t0:-5})}}ma.sort((e,a)=>e.p[1]-a.p[1]);const N0=ke(ma,{lit:b.cloud.clone().multiplyScalar(1.06),shade:b.cloud.clone().multiply(new t.Color(.36,.47,.74)),opacity:.97,order:1.5,ball:1,rng:h});await s.yield();const re=$a(String(s.seed)+":far"),ha=[],Ao=9;for(let e=0;e<Ao;e++){const a=(e+.5)/Ao*D+re.range(-.22,.22),n=re.range(9e3,27e3);let r=Math.sin(a)*n,o=Math.cos(a)*n;o<2e3&&Math.abs(r)<6500&&(r=(r<0?-1:1)*(6500+Math.abs(r)*.8));const l=re.range(7e3,12500),d=11+Math.round(7*k),p=re.range(-.18,.18),S=re.range(-.18,.18),G=re.range(.8,1.25);for(let V=0;V<d;V++){const le=V/(d-1),$=U(1300,l,Math.pow(le,.8)),xe=U(1.15,.5,le)+.75*Math.exp(-(((le-.93)/.1)**2)),ye=(1150+650*re())*xe*G;ha.push({p:[r+($-1300)*p+re.range(-1,1)*ye*.7,$,o+($-1300)*S+re.range(-1,1)*ye*.7],s0:ye,t0:-5})}}ha.sort((e,a)=>e.p[1]-a.p[1]);const _0=ke(ha,{lit:b.cloud.clone().multiplyScalar(1.06),shade:b.cloud.clone().multiply(new t.Color(.36,.47,.74)),opacity:.97,order:1.6,ball:1,rng:re});await s.yield();const pa=(e,a)=>{const n=$t(e)/H,r=H+Ne(e)+Xa;return a.set(0,r*Math.cos(n)-H,-r*Math.sin(n))},ga=110,Je=14,Co=[],ko=[],Go=[],zo=[],Gt=new t.Vector3;for(let e=0;e<=ga;e++){const a=5.2+16.9*Math.pow(e/ga,1.1);pa(a,Gt);for(let n=0;n<=Je;n++)Co.push(Gt.x,Gt.y,Gt.z),ko.push(a),Go.push(n/Je*D)}for(let e=0;e<ga;e++)for(let a=0;a<Je;a++){const n=e*(Je+1)+a,r=n+1,o=n+Je+1,l=o+1;zo.push(n,o,r,r,o,l)}const et=new t.BufferGeometry;et.setAttribute("position",new t.Float32BufferAttribute(Co,3)),et.setAttribute("aT",new t.Float32BufferAttribute(ko,1)),et.setAttribute("aAng",new t.Float32BufferAttribute(Go,1)),et.setIndex(zo);const wa={...J,uTime:ee,uSunE:pt,uFire:ue,uThr:ce,uT:{value:0},uHead:{value:new t.Vector3},uLit:{value:At},uShade:{value:At.clone().multiply(new t.Color(.45,.52,.66))}},xa=new t.Mesh(et,new t.ShaderMaterial({uniforms:wa,fog:!1,side:t.DoubleSide,vertexShader:`
        attribute float aT, aAng; uniform float uT, uTime; uniform vec3 uHead; varying vec3 vN, vE; varying float vAge, vAng, vT;
        ${_e}
        void main(){
          float age = uT - aT; vec3 c = position; float rad = 1.5;
          if (age < 0.) c = uHead;
          else {
            rad = min(10. + 40. * sqrt(age) * (1. + position.y / 6000.), 5200.) * smoothstep(0., 3.6, age);
            float ly = log2(1. + max(position.y, 0.) / 150.) * 2.1;      // the winds shear it into a zigzag whose reach grows with height
            c.xz += ((vec2(vn(vec2(ly, 3.)), vn(vec2(ly, 11.))) - .5) + .4 * (vec2(vn(vec2(ly * 2.7, 5.)), vn(vec2(ly * 2.7, 17.))) - .5)) * min(age * 90., position.y * .42 + 8.);
            rad *= .75 + .6 * vn(vec2(ly * 1.7, 23.));
            rad *= 1. + .28 * (vn(vec2(aAng * 1.4 + aT * 4., aT * 6. + uTime * .05)) - .5);
          }
          vN = vec3(cos(aAng), 0., sin(aAng)); vAge = age; vAng = aAng; vT = aT;
          vE = c + vN * rad;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(vE, 1.);
        }`,fragmentShader:`
        uniform float uTime, uThr; uniform vec3 uSunE, uLit, uShade, uFire; varying vec3 vN, vE; varying float vAge, vAng, vT;
        ${_e}
        ${Xt}
        void main(){
          float l = max(dot(normalize(vN), normalize(vec3(uSunE.x, 0., uSunE.z) + vec3(1e-4, 0., 0.))), 0.) * .7 + .3;
          float b = vn(vec2(vAng * 3., vT * 14. - uTime * .1)) * .6 + .4 * vn(vec2(vAng * 8., vT * 40.));
          vec3 col = mix(uShade, uLit, clamp(l * (.8 + .3 * b), 0., 1.));
          col = mix(col, uFire * (1.1 + .9 * b), min(uThr * 1.3, 1.) * exp(-max(vAge, 0.) * .9));       // the young smoke glows from inside
          gl_FragColor = vec4(aerial(col, vE), 1.);
        }`}));xa.frustumCulled=!1,T.add(xa),await s.yield();const zt=Math.round(300*k*f),ya=12,Vo=44,Vt=zt+ya+Vo,Tt=new Float32Array(Vt*3),Et=new Float32Array(Vt*4),Dt=new Float32Array(Vt*3),W=c.fork("birds"),Sa=C==="mangrove"?Xe.filter(e=>Math.hypot(e[0],e[1])<2600):[],To=L?new t.Color(.85,.36,.42):new t.Color(.9,.9,.88),Eo=new t.Color(.03,.03,.035);for(let e=0;e<zt;e++){let a,n;if(Sa.length&&W.chance(.8)){const l=Sa[W.int(0,Sa.length-1)];a=l[0]+W.range(-1,1)*l[2],n=l[1]+W.range(-1,1)*l[2]}else{const l=W.range(.15,Math.PI-.15),d=W.range(260,1500);a=Math.cos(l)*d,n=Math.sin(l)*d*(C==="mangrove"?1:W.sign()*.3)}Tt.set([a,4,n],e*3);const r=Math.atan2(n,a)+W.range(-.9,.9);Et.set([r,W.range(9,17),e%3===0?-200-W()*80:.15+Math.hypot(a,n)/340*.25+W.range(0,1.6),W()],e*4);const o=W.chance(.72)?To:Eo;Dt.set([o.r,o.g,o.b],e*3)}for(let e=0;e<ya;e++){const a=zt+e;Tt.set([-900-e*11,5+e%2,-(Qt+18)-e%3*2],a*3),Et.set([0,13,-1e3,W()],a*4),Dt.set([.5,.45,.38],a*3)}for(let e=0;e<Vo;e++){const a=zt+ya+e,n=e%4;let r,o,l;n<2?(r=te*Math.cos(gt)+h.range(-5,5),l=-te*Math.sin(gt)+h.range(-5,5),o=h.range(34,90)):n===2?(r=h.sign()*45+h.range(-3,3),l=h.sign()*41+h.range(-3,3),o=h.range(40,96)):(r=62+25*(e%3)+h.range(-8,8),l=Ce+h.range(-8,8),o=22),Tt.set([r,o-30,l],a*3),Et.set([Math.atan2(l,r)+h.range(-1.2,1.2),h.range(13,22),100.5+h()*2.2,h()*.35],a*4);const d=e%5===0?Eo:To;Dt.set([d.r,d.g,d.b],a*3)}const qe=new t.InstancedBufferGeometry;qe.setAttribute("position",new t.Float32BufferAttribute([0,0,.3,0,0,-.3,-1,0,-.1,0,0,.3,1,0,-.1,0,0,-.3,.12,0,.55,-.12,0,.55,0,0,-.55],3)),qe.setAttribute("aO",new t.InstancedBufferAttribute(Tt,3)),qe.setAttribute("aD",new t.InstancedBufferAttribute(Et,4)),qe.setAttribute("aC",new t.InstancedBufferAttribute(Dt,3)),qe.instanceCount=Vt;const Do={uTime:ee,uClock:{value:0},uLight:{value:new t.Color().copy(b.sunCol).multiplyScalar(b.sunAmt).add(b.amb).multiplyScalar(1.1)},uFire:ue,uThr:ce},ba=new t.Mesh(qe,new t.ShaderMaterial({uniforms:Do,side:t.DoubleSide,fog:!1,vertexShader:`
        attribute vec3 aO, aC; attribute vec4 aD; uniform float uTime, uClock; varying vec3 vC;
        void main(){
          float nearF = step(50., aD.z);
          float tt = aD.z < -500. ? mod(uTime, 140.) : max(uClock - aD.z + 100. * nearF, 0.);
          float wh = aD.z < -500. ? 0. : 1.;
          float hd = aD.x + wh * .7 * sin(tt * .35 + aD.w * 20.);
          vec2 dir = vec2(cos(hd), sin(hd));
          float go = aD.y * tt;
          vec3 c = aO + vec3(dir.x * go, wh * (30. + 50. * aD.w) * (1. - exp(-tt * .35)) + sin(uTime * .9 + aD.w * 30.) * 1.5, dir.y * go);
          c.xz += wh * vec2(-dir.y, dir.x) * sin(tt * .5 + aD.w * 40.) * 22.;
          float fl = sin(uTime * (7. + 4. * aD.w) + aD.w * 50.) * step(.001, tt);
          vec3 p = position * mix(2.6, 1., nearF); p.y += abs(position.x) * fl * 1.5;
          vec3 w = c + vec3(p.x * dir.y + p.z * dir.x, p.y, -p.x * dir.x + p.z * dir.y);
          vC = aC * (.8 + .2 * fl);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(w, 1.);
        }`,fragmentShader:"uniform vec3 uLight, uFire; uniform float uThr; varying vec3 vC; void main(){ gl_FragColor = vec4(vC * (uLight + uFire * uThr * .15), 1.); }"}));ba.frustumCulled=!1,T.add(ba),await s.yield(),await s.yield();const Ma=new t.Color(.8,.86,.86),m0=Ue([i(18,2.4,5,0,1,0,ve),i(6,2.6,3.6,-1,3.3,0,oo),i(5,.5,3,7.5,2.3,0,E),i(90,.12,2.2,-53,.2,7,Ma,.13),i(90,.12,2.2,-53,.2,-7,Ma,-.13),i(46,.12,3.2,-31,.22,0,Ma)]),Aa=Math.round(14*f),tt=new t.InstancedMesh(m0,je,Aa),Fo=[];for(let e=0;e<Aa;e++)Fo.push({x:c.range(-2600,2600),z:-c.range(620,1500)*(e%5===4?-2.4:1),v:c.range(5,11)*c.sign()});tt.frustumCulled=!1,T.add(tt);const Po=e=>{for(let a=0;a<Aa;a++){const n=Fo[a],r=((n.x+n.v*e+2600)%5200+5200)%5200-2600;tt.setMatrixAt(a,la.compose(ua.set(r,Math.sin(e*1.3+a)*.25,n.z),ia.setFromAxisAngle(Be.set(0,1,0),n.v>0?0:Math.PI),Be.set(1,1,1)))}tt.instanceMatrix.needsUpdate=!0};Po(0);const y=await q0(s,{palette:X}),se=y.object;se.matrixAutoUpdate=!1,Z.add(se),await s.yield();const Ca=Math.round(90*k),Lo=new Float32Array(Ca*4);for(let e=0;e<Ca*4;e++)Lo[e]=c();const at=new t.InstancedBufferGeometry;at.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),at.setIndex([0,1,2,0,2,3]),at.setAttribute("aSeed",new t.InstancedBufferAttribute(Lo,4)),at.instanceCount=Ca;const ot={uRun:{value:0},uAmt:{value:0},uThin:{value:1},uBright:{value:1},uCol:{value:m?w("#8fa0c0",.25):F?w("#f0d2cc",.8):new t.Color(.86,.88,.9)}},nt=new t.Mesh(at,new t.ShaderMaterial({uniforms:ot,transparent:!0,depthWrite:!1,fog:!1,vertexShader:`
        attribute vec4 aSeed; uniform float uRun, uAmt, uThin; varying vec2 vQ; varying float vA;
        void main(){
          float y = 112. - mod(aSeed.y * 100. + uRun * (.7 + .6 * aSeed.w), 100.);
          float ang = aSeed.x * 6.2832, rad = 3.4 + aSeed.z * aSeed.z * 11.;
          vec3 cv = (modelViewMatrix * vec4(sin(ang) * rad, y, cos(ang) * rad, 1.)).xyz;
          vec3 ax = normalize((modelViewMatrix * vec4(0., 1., 0., 0.)).xyz);
          vec3 sd = normalize(cross(ax, cv) + vec3(1e-5, 0., 0.));
          vec3 p = cv + ax * position.y * (5. + 12. * aSeed.w) * (.3 + .7 * uThin) + sd * position.x * (.5 + 1.3 * aSeed.z) * uThin;
          vQ = position.xy; vA = step(aSeed.w, uAmt * 1.2) * min(uAmt, 1.) * smoothstep(12., 30., y) * (1. - smoothstep(95., 112., y)) * smoothstep(.8, 2.5, -cv.z);
          gl_Position = projectionMatrix * vec4(p, 1.);
        }`,fragmentShader:`uniform vec3 uCol; uniform float uBright; varying vec2 vQ; varying float vA;
        void main(){ float a = min(vA * (1. - vQ.x * vQ.x) * (1. - vQ.y * vQ.y) * .5 * uBright, 1.); if (a < .004) discard; gl_FragColor = vec4(uCol * (.7 + .3 * uBright), a); }`}));nt.frustumCulled=!1,nt.renderOrder=3,nt.visible=!1,se.add(nt);const ka=Math.round(440*k),Bo=new Float32Array(ka*4);for(let e=0;e<ka*4;e++)Bo[e]=c();const Ga=new t.BufferGeometry;Ga.setAttribute("position",new t.BufferAttribute(new Float32Array(ka*3),3)),Ga.setAttribute("aSeed",new t.BufferAttribute(Bo,4));const Ft={uTime:ee,uAmt:{value:0},uPx:y.uniforms.uPx,uCamL:{value:new t.Vector3}},rt=new t.Points(Ga,new t.ShaderMaterial({uniforms:Ft,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,fog:!1,vertexShader:`
        attribute vec4 aSeed; uniform float uTime, uAmt, uPx; uniform vec3 uCamL; varying float vA;
        void main(){
          vec3 h = fract(aSeed.xyz * vec3(7.31, 3.17, 5.71) + aSeed.w);
          vec3 p0 = aSeed.xyz * 18. + (h - .5) * uTime * vec3(.5, .8, .5) + vec3(0., -uTime * .45, 0.);
          p0 += .25 * vec3(sin(uTime * .6 + aSeed.w * 40.), cos(uTime * .5 + aSeed.x * 40.), sin(uTime * .7 + aSeed.y * 40.));
          vec3 p = mod(p0 - uCamL + 9., 18.) - 9. + uCamL;
          vec4 mv = modelViewMatrix * vec4(p, 1.);
          float dist = max(-mv.z, .05) / max(length(modelMatrix[1].xyz), 1e-4);
          float s = sin(uTime * (1.5 + 6. * aSeed.w) + aSeed.z * 60.) * .5 + .5, tw = s * s * s * s;
          vA = uAmt * (.45 + 2.6 * tw) * smoothstep(.5, 1.6, dist) * (1. - smoothstep(6.5, 9., dist));
          gl_PointSize = clamp(uPx * (.012 + .03 * h.x) / dist, 1.6, uPx * .014);
          gl_Position = projectionMatrix * mv;
        }`,fragmentShader:`varying float vA;
        void main(){ vec2 c = gl_PointCoord - .5; float d = dot(c, c) * 4.; float a = 1. - smoothstep(0., 1., d); gl_FragColor = vec4(vec3(.82, .92, 1.) * 2.6 * vA * a * a, 1.); }`}));rt.frustumCulled=!1,rt.renderOrder=5,rt.visible=!1,se.add(rt);const za=Math.round(300*k),qo=new Float32Array(za*4);for(let e=0;e<za*4;e++)qo[e]=h();const st=new t.InstancedBufferGeometry;st.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),st.setIndex([0,1,2,0,2,3]),st.setAttribute("aSeed",new t.InstancedBufferAttribute(qo,4)),st.instanceCount=za;const lt={uClock:{value:0},uDim:{value:1},uShare:{value:1},uG:{value:7},uTime:ee,uSunView:Me,uLit:{value:m?new t.Color(.1,.12,.2):F?new t.Color(.6,.6,.75):new t.Color(.95,.97,1)},uFire:ue,uThr:ce},Ho=new t.Mesh(st,new t.ShaderMaterial({uniforms:lt,side:t.DoubleSide,fog:!1,vertexShader:`
        attribute vec4 aSeed; uniform float uClock, uShare, uG; varying vec2 vQ; varying float vSeed, vOn; varying vec3 vNv;
        void main(){
          float t0 = .1 + aSeed.x * aSeed.x * 4.4, age = uClock - t0; vOn = step(0., age) * step(age, 3.4) * step(fract(aSeed.w * 5.3 + aSeed.y * 3.1), uShare); age = clamp(age, 0., 3.4);
          float ang = (aSeed.y < .5 ? -1. : 1.) * (.7 + abs(aSeed.y - .5) * 2.3), rad = 2.05 + (.8 + 4.2 * aSeed.w) * age, y = 57.4 - aSeed.z * aSeed.z * 22. - (2.5 + 3. * aSeed.w) * age - uG * age * age;
          vec3 c = vec3(sin(ang) * rad, y, cos(ang) * rad);
          float f7 = fract(aSeed.w * 7.3), sz = (.07 + .25 * f7 * f7) * (1. - .6 * smoothstep(2.2, 3.4, age));
          float a1 = aSeed.x * 40. + age * (2.5 + 5. * aSeed.z), a2 = aSeed.y * 30. + age * (1.5 + 4. * aSeed.w);
          vec3 ex = vec3(cos(a1), sin(a1) * sin(a2), sin(a1) * cos(a2)), ey = vec3(0., cos(a2), -sin(a2));
          vec3 p = c + (ex * position.x * (1.1 + 1.3 * fract(aSeed.z * 13.7)) + ey * position.y) * sz * vOn;
          vQ = position.xy; vSeed = aSeed.z * 31. + aSeed.x * 17.; vNv = normalize(normalMatrix * cross(ex, ey) + vec3(0., 0., 1e-5));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
        }`,fragmentShader:`
        uniform vec3 uSunView, uLit, uFire; uniform float uThr, uTime, uDim; varying vec2 vQ; varying float vSeed, vOn; varying vec3 vNv;
        ${_e}
        void main(){
          if (vOn < .5) discard;
          // a shard of tank frost: a ragged splinter, blue in its body, white where rime clings, cracked, glinting as it turns
          float ng = 3. + floor(fract(vSeed * .37) * 3.), sg = 6.2832 / ng, a = atan(vQ.y, vQ.x + 1e-5) + vSeed;
          float k = floor(a / sg), dp = cos(3.14159 / ng) / max(cos(a - (k + .5) * sg), .2) * (.45 + .5 * h21(vec2(k + ng, vSeed)));
          float rr = length(vQ) / dp + (vn(vQ * 5. + vSeed) - .5) * .5;
          if (rr > 1.) discard;
          float nl = abs(dot(normalize(vNv), uSunView));
          float rime = smoothstep(.35, .7, vn(vQ * 9. + vSeed * 3.)), crack = 1. - smoothstep(0., .06, abs(vn(vQ * 3.5 + vSeed) - .5));
          vec3 col = mix(vec3(.2, .42, .8), vec3(.62, .8, 1.), nl) * uLit * (.55 + .45 * rime);
          col = mix(col, uLit, .55 * rime * (.3 + .7 * nl));
          col += uLit * (.5 * crack + .5 * smoothstep(.75, 1., rr) + 3. * pow(nl, 30.)) + uFire * uThr * .3;
          gl_FragColor = vec4(col * uDim, 1.);
        }`}));Ho.frustumCulled=!1,se.add(Ho),await s.yield();const ae=await H0(s,{rng:$a(String(s.seed)+":orbit"),uTime:ee,uPx:y.uniforms.uPx,iceR0:9.8,iceR1:27});se.add(ae.station),ae.ice.position.set(0,0,-600),Z.add(ae.ice),m&&ae.SU.uShine.value.multiplyScalar(.6),await s.yield();let Va=null;if(I){const e=y.variant.livery==="steel"?new t.Color(.44,.46,.49):new t.Color(.66,.66,.64),a=[[.9,0],[1.55,1.2],[1.6,2.2],[1.6,38],[1.2,42],[.5,45.5],[0,46.2]].map(d=>new t.Vector2(d[0],d[1])),n=Ue([j(new t.LatheGeometry(a,28),e),j(new t.CylinderGeometry(1.62,1.62,3,28,1,!0),aa).translate(0,30,0),i(.5,1.2,1.2,-1.7,34,0,E),i(.5,1.2,1.2,-1.7,8,0,E)]),r=new t.MeshStandardMaterial({vertexColors:!0,roughness:.4,metalness:0}),o=new t.CylinderGeometry(1,.08,1,20,12,!0).translate(0,-.5,0),l=new t.ShaderMaterial({transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,side:t.DoubleSide,fog:!1,uniforms:{uTime:y.uniforms.uTime,uPress:y.uniforms.uPress,uThrottle:y.uniforms.uThrottle,uFire:ue},vertexShader:`uniform float uPress, uThrottle, uTime; varying float vT; varying vec3 vNv, vPv;
          void main(){ float t = -position.y, ex = pow(clamp(1. - uPress, 0., 1.), 1.5);
            float r = mix(.95 * (1. + .5 * sin(t * 3.1416)) * sqrt(max(1. - t, 1e-4)), .9 + 60. * t, ex) * (1. + .06 * sin(uTime * 31. + t * 12.));
            vec3 p = vec3(normalize(position.xz + vec2(1e-5, 0.)) * r, -t * mix(70., 420., ex) * (.1 + .9 * uThrottle)).xzy;
            vT = t; vec4 mv = modelViewMatrix * vec4(p, 1.); vPv = mv.xyz; vNv = normalize(normalMatrix * vec3(position.x, 0., position.z) + vec3(0., 0., 1e-5));
            gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform float uPress, uThrottle; uniform vec3 uFire; varying float vT; varying vec3 vNv, vPv;
          void main(){ float ex = pow(clamp(1. - uPress, 0., 1.), 1.5), f = abs(dot(normalize(vNv), normalize(-vPv + vec3(0., 0., 1e-5))));
            vec3 col = mix(mix(vec3(1.6, 1.3, .85), uFire * .6, smoothstep(0., .6, vT)), vec3(.2, .2, .32), ex);
            gl_FragColor = vec4(col * (.35 + .65 * smoothstep(0., .4, f)) * (1. - vT) * smoothstep(0., .08, uThrottle) * 1.2, 1.); }`});Va=[-1,1].map(d=>{const p=new t.Group,S=new t.Mesh(n,r),G=new t.Mesh(o,l),V=y.makeNozzleGlow(.62);return d<0&&(S.rotation.y=Math.PI),G.frustumCulled=!1,G.renderOrder=4,p.add(S,G,V),se.add(p),p.position.set(d*3.5,1,0),{g:p,f:G,gl:V,sx:d}})}const ge={uW:{value:0},uFlash:{value:0},uGp:{value:new t.Vector2},uAspect:{value:s.aspect||1.78},uThr:ce,uFire:ue,uCol:{value:m?new t.Color(.035,.04,.06):F?new t.Color(.62,.56,.6):new t.Color(.86,.87,.88)},uLantern:{value:m?2.4:1.1}},He=new t.Mesh(new t.PlaneGeometry(2,2),new t.ShaderMaterial({uniforms:ge,transparent:!0,depthTest:!1,depthWrite:!1,fog:!1,premultipliedAlpha:!0,vertexShader:"varying vec2 vP; void main(){ vP = position.xy; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`uniform float uW, uFlash, uAspect, uThr, uLantern; uniform vec2 uGp; uniform vec3 uCol, uFire; varying vec2 vP;
        void main(){ vec2 d = (vP - uGp) * vec2(uAspect, 1.); float g = exp(-dot(d, d) * 2.2) * uThr * uLantern;
          vec3 col = uCol * (1. + .25 * g) + uFire * g * .55;
          gl_FragColor = vec4(col * uW + vec3(.9, .95, 1.) * uFlash, uW); }`}));He.frustumCulled=!1,He.renderOrder=60,He.visible=!1,Z.add(He);const we={uA:{value:0},uPhase:{value:0},uGp:ge.uGp,uAspect:ge.uAspect,uThr:ce,uFire:ue,uLantern:ge.uLantern,uZ:{value:0},uKind:{value:new t.Vector3(1,0,0)},uSeed:{value:0},uSunS:{value:new t.Vector2(.7,.7)},uLit:{value:b.cloud.clone().multiplyScalar(1.04)},uShade:{value:b.cloud.clone().multiply(new t.Color(.4,.5,.72))}},Ge=new t.Mesh(new t.PlaneGeometry(2,2),new t.ShaderMaterial({uniforms:we,transparent:!0,depthTest:!0,depthWrite:!1,fog:!1,premultipliedAlpha:!0,vertexShader:"uniform float uZ; varying vec2 vP; void main(){ vP = position.xy; gl_Position = vec4(position.xy, uZ, 1.); }",fragmentShader:`uniform float uA, uPhase, uAspect, uThr, uLantern, uSeed; uniform vec2 uGp, uSunS; uniform vec3 uKind, uLit, uShade, uFire; varying vec2 vP;
        float h31(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
        float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
          return mix(mix(mix(h31(i), h31(i + vec3(1., 0., 0.)), f.x), mix(h31(i + vec3(0., 1., 0.)), h31(i + vec3(1., 1., 0.)), f.x), f.y),
                     mix(mix(h31(i + vec3(0., 0., 1.)), h31(i + vec3(1., 0., 1.)), f.x), mix(h31(i + vec3(0., 1., 1.)), h31(i + vec3(1., 1., 1.)), f.x), f.y), f.z); }
        // cloud density in tunnel coordinates round the vanishing point: everything streams inwards and shrinks as it recedes aft
        float dens(vec2 d, float kA, float kZ){
          float r = max(length(d), 1e-3), lr = log(r); vec2 dir = d / r; float z = lr * kZ + uPhase;
          // sheets and streaks are never true rings or rays: the field is sheared round the axis, more the thinner the cloud
          float w = (uKind.y + .45 * uKind.z) * (.55 * sin(lr * 1.9 + uPhase * .35 + uSeed) + .9 * (vn3(vec3(dir * 1.3, z * .5 + uSeed)) - .5));
          dir = vec2(dir.x * cos(w) - dir.y * sin(w), dir.x * sin(w) + dir.y * cos(w));
          vec3 q = vec3(dir * kA, z) + uSeed;
          float n = vn3(q) * .5 + vn3(q * 2.03 + 7.1) * .27 + vn3(q * 4.1 + 3.3) * .15 + vn3(q * 8.3 + 1.7) * .08;
          return n;
        }
        void main(){
          vec2 d = (vP - uGp) * vec2(uAspect, 1.); float r = length(d);
          float kA = dot(uKind, vec3(1.5, 1.15, 4.2)), kZ = dot(uKind, vec3(1.25, 1.7, .8));
          float n = dens(d, kA, kZ), n2 = dens(d + uSunS * (.05 + .1 * r), kA, kZ);
          float thr = mix(.74, .505, uA) + dot(uKind, vec3(0., .035, .075)), soft = dot(uKind, vec3(.1, .1, .08));
          float a = smoothstep(thr - soft * .4, thr + soft, n) * dot(uKind, vec3(.93, .86, .66));
          a *= smoothstep(.03, .3, r);                                   // what has receded to the engines is the deck itself
          float haze = uA * uA * (.03 + .05 * vn3(vec3(d * 1.3, uPhase * .3)));
          float rel = clamp((n - n2) * dot(uKind, vec3(7., 5., 4.)) + .55, 0., 1.);
          float side = clamp(.5 + .45 * dot(d, uSunS), 0., 1.);
          vec3 col = mix(uShade * (.82 + .3 * side), uLit, smoothstep(.3, .92, rel * (.6 + .4 * a) + .22 * side));
          col *= .9 + .16 * smoothstep(thr, thr + .25, n);
          float g = exp(-r * r * 2.2) * uThr * uLantern;                 // the fire lights the cloud from inside
          col = col * (1. + .25 * g) + uFire * g * .55;
          float al = max(a, haze);
          gl_FragColor = vec4(col * al, al);
        }`}));Ge.frustumCulled=!1,Ge.renderOrder=4.5,Ge.visible=!1,Z.add(Ge);const h0=e=>e<0?Math.pow(v(-1.1,-.04,e),1.6):1-v(.08,.7,e);fe.forEach((e,a)=>{const n=e[0],r=1-v(2500,4500,n),o=v(8e3,1e4,n);e.kind=[r,1-r-o,o],e.sd=3.1+a*7.7}),await s.yield();const it=y.anchors,Pt=Math.cos(12*_),Lt=Math.sin(12*_),p0=new t.Quaternion().setFromRotationMatrix(new t.Matrix4().makeBasis(new t.Vector3(-1,0,0),new t.Vector3(0,Lt,Pt),new t.Vector3(0,Pt,-Lt))),Bt=new t.Vector3(1,0,0),g0=new t.Vector3(0,1,0),Ta=new t.Vector3(0,0,1),w0=new t.Vector3(1,1,1),ut=new t.Quaternion,Ea=new t.Quaternion,Da=new t.Matrix4,Fa=new t.Matrix4,qt=new t.Matrix4,Pa=new t.Matrix4,Io=new t.Matrix4,Ie=new t.Vector3,ct=new t.Vector3,dt=new t.Vector3,Re=new t.Vector3,La=new t.Vector3,Ba=new t.Vector3,N=new t.Vector3,Ro=new t.Vector3,oe=new t.Vector3,vt=new t.Vector3,Oo=new t.Quaternion,Ht=new t.Vector4,U0=e=>e<0?v(-.3,0,e):1-v(.12,.52,e),x0=new t.Color(.012,.016,.03),y0=w(X[1],.9),S0=new t.Color(.16,.26,.5),b0=new t.Color(.55,.72,1);let qa=0,It=null;const M0=new t.Color(.3,.55,1),Ha=new t.Matrix4,No=e=>e<100?1:e<3e3?13:e<8e3?18:20,A0=new t.Color(1,.74,.46),Ia=new t.Vector3(0,Pt,-Lt),Ra=new t.Vector3(0,Lt,Pt),Rt=new t.Matrix4,ft=new t.Matrix4,C0=new t.Euler,Ot=new t.Vector3,_o=new t.Vector3,Uo=new t.Vector3,k0=new t.Matrix4().makeScale(1e-5,1e-5,1e-5).setPosition(0,-4e3,0),G0=Zt([[0,0],[10,0],[14.2,.44],[17.6,.58],[21.2,.1],[24.4,-.4],[25.4,-.4],[40,-.4]]),z0=80*_,Ko=28*_,Wo=36*_,Oa=-Y,V0=new t.Color(.72,.84,1),T0=new Set(Z.children);function E0(e,a,n,r){const o=ie(r,0,1)*40;ee.value=a,y.setProgress(r);const l=o-22.6,d=l<=0?0:Math.pow(ie(l/5,0,1),.8);if(y.setStaging(d),l>0&&o<=27.2){const u=y.parts.booster,A=2.6*l+3*l*l,Q=v(1.5,10,A),Za=.42*Math.pow(l,1.5);u.position.set(Oa*.3*A*Q,20-A,.48*A*Q),u.rotation.set(.85*Za,.3*Za*Oa,Oa*.55*Za),y.uniforms.uDrift.value.set(u.position.x,u.position.y-20,u.position.z)}let p=0,S=0,G=0,V=null,le=0;for(const u of fe){if(u.t<0)continue;const A=o-u.t,Q=h0(A);p+=Math.exp(-(((A-.1)/.5)**2)),Q>S&&(S=Q,V=u,le=A),G+=Math.exp(-((A/1.2)**2))}y.setCloudGlow(.7*Math.min(1,p)*(V?1-.5*V.kind[2]:1)),o<2&&y.setThrottle(Math.max(y.state.throttle,.45+.04*Math.sin(a*9))),F&&(Ja.value=U(b.sunAmt,.8,v(1200,2e4,Ne(o))));const $=y.state.throttle,xe=y.state.vapour;if(Va)for(const u of Va){const A=22*d+1500*Math.pow(d,1.6),Q=Math.pow(d,1.15)*13;u.g.position.set(u.sx*(3.5+.5*A),1-A*.92,.3*A*v(5,70,A)),u.g.rotation.set(-Q*.5,0,u.sx*Q),u.g.visible=d<.999,u.f.visible=u.gl.visible=$>.002}const ye=O0(o)*_,Nt=$t(o)/H,_t=gt*(1-v(5,9,o))+z0*v(28.2,39.4,o);Ie.set(0,Math.cos(Nt),-Math.sin(Nt)),ct.set(0,-Math.sin(Nt),-Math.cos(Nt)),dt.copy(Ie).multiplyScalar(Math.cos(ye)).addScaledVector(ct,Math.sin(ye)),Re.copy(Ie).multiplyScalar(Math.sin(ye)).addScaledVector(ct,-Math.cos(ye)),La.crossVectors(dt,Re),N.copy(Re).multiplyScalar(Math.cos(_t)).addScaledVector(La,Math.sin(_t)),Ro.copy(La).multiplyScalar(Math.cos(_t)).addScaledVector(Re,-Math.sin(_t)),pa(o,Ba),Fa.makeBasis(Ro,dt,N).setPosition(Ba);const Qo=Math.acos(H/(H+Math.max(Ne(o),1))),Na=-Qo+(-3.2+5.6*v(28.6,34.5,o))*_,D0=v(27,30.5,o);B.value.set(-Math.sin(Ko)*Math.cos(Na),0,0,D0),N.copy(ct).multiplyScalar(Math.cos(Ko)*Math.cos(Na)).addScaledVector(Ie,Math.sin(Na)),B.value.x+=N.x,B.value.y=N.y,B.value.z=N.z,ne.uPre.value=v(23.4,28.6,o)*(m?.7:1);const _a=-Qo+14*_;ne.uMoonE.value.copy(ct).multiplyScalar(Math.cos(Wo)*Math.cos(_a)).addScaledVector(Ie,Math.sin(_a)),ne.uMoonE.value.x+=Math.sin(Wo)*Math.cos(_a);const mt=v(25,27.2,o),Ua=$*(.003+.0055*xe)*v(1.2,3,o),Ka=.011*v(22.6,25,o),jo=G0(o)*(1-mt);ut.setFromAxisAngle(Ta,Y*(Math.PI*mt+jo)).multiply(p0),ut.multiply(Ea.setFromAxisAngle(Bt,-12*_*mt-7*_*v(29.5,38,o)-10*_*Math.sin(Math.PI*mt)+Ua*Math.sin(a*69.1)*Math.sin(a*7.3+1)+Ka*Math.sin(a*.9+1))),ut.multiply(Ea.setFromAxisAngle(Ta,25*_*mt-Y*.3*jo+Ua*.7*Math.sin(a*61.7+2)+Ka*.8*Math.sin(a*.7))),ut.multiply(Ea.setFromAxisAngle(g0,Ua*.8*Math.sin(a*75.4+4)+Ka*Math.sin(a*1.1+2)));const Se=ie(n.near/.25,1,200),F0=Math.max(0,n.near-.25*Se);Da.compose(it.pod,ut,w0),qt.multiplyMatrices(Fa,Da),oe.setFromMatrixPosition(qt);const q=Math.max(1,Math.sqrt(oe.x*oe.x+(oe.y+H)*(oe.y+H)+oe.z*oe.z)-H),Wa=Math.max(1,q/1200),Qa=n.matrixWorld;Ha.makeTranslation(0,0,-F0).premultiply(Qa),se.matrix.multiplyMatrices(Ha,Io.makeScale(Se,Se,Se)).multiply(Pa.copy(Da).invert()),se.matrixWorldNeedsUpdate=!0,T.matrix.multiplyMatrices(Ha,Io.makeScale(Se/Wa,Se/Wa,Se/Wa)).multiply(Pa.copy(qt).invert()),T.matrixWorldNeedsUpdate=!0,Qa.decompose(vt,Oo,N),ne.uW2E.value.setFromMatrix4(Pa.copy(Qa).invert().premultiply(qt)),ne.uUpE.value.set(oe.x,oe.y+H,oe.z).normalize(),J.uCamE.value.copy(oe),J.uAlt.value=q,Ke.position.copy(N.set(-.3,.62,.72).applyQuaternion(Oo).multiplyScalar(50).add(vt)),Ke.target.position.copy(vt);const Oe=v(2e4,45e3,q);Ke.intensity=b.key*(F?U(.1,1,v(1200,3800,q)):1)*(1+(m?.6:.45)*Oe),N.copy(dt).multiplyScalar(-1).addScaledVector(Re,.5).transformDirection(T.matrix);const Ut=o>26.5?B.value.w:0;Ut>0&&N.set(B.value.x,B.value.y,B.value.z).transformDirection(T.matrix);const ja=d>0&&o<=26.5?v(22.7,23.4,o)*(1-v(25.6,26.5,o)):0;ja>0&&N.copy(dt).addScaledVector(Re,.45).transformDirection(T.matrix),ze.color.copy(o>26.5?A0:ja>0?V0:Yt),ze.position.copy(N).multiplyScalar(50).add(vt),ze.target.position.copy(vt),ze.intensity=Ut*(m?3.2:2.6)+$*(m?2.6:F?1.7:1.3)*(1+1.5*y.state.cloud)*(.85+.15*Math.sin(a*37)*Math.sin(a*23.1+1))*(d>0?0:1)+ja*(m?2.6:F?1.1:.3);const P0=Math.exp(-q/12e3);if(ht.position.copy(N.copy(ne.uUpE.value).transformDirection(T.matrix)),ht.color.copy(x0).lerp(b0,P0*(m?.3:1)),ht.groundColor.copy(y0).lerp(S0,v(1500,3e4,q)).multiplyScalar((m?.15:F?.55+.45*v(1200,9e3,q):1)*(1+.6*Oe)),y.setRimGlint(Oe*(m?.25:1)),_o.copy(ne.uUpE.value).negate().transformDirection(T.matrix).transformDirection(n.matrixWorldInverse),Ut>.5?Ot.set(B.value.x,B.value.y,B.value.z):Ot.copy(be),Ot.transformDirection(T.matrix).transformDirection(n.matrixWorldInverse),y.setSpaceLight(_o,Oe*(m?.5:.85),Ot,(m?.25:F?.6:.8)*v(9e3,26e3,q)*(o>26.5?Math.max(Ut,.35):1)),o>24.4&&r<1){const u=o-34.8,A=Math.max(0,u+1.2),Q=Math.max(0,u);Uo.copy(it.pod).addScaledVector(Ia,92+9*u*u-19*Q*Q).addScaledVector(Bt,-44+30*(u-.5*A*A)).addScaledVector(Ra,-6-10*u+3*A*A),Rt.makeBasis(Bt,Ra,N.copy(Ia).negate()).multiply(ft.makeRotationFromEuler(C0.set(1,.35+.05*u,.3))).setPosition(Uo),ae.station.matrix.copy(Rt),ft.multiplyMatrices(Fa,Rt).invert(),ae.SU.uSunL.value.set(B.value.x,B.value.y,B.value.z).transformDirection(ft),ae.SU.uEarthL.value.copy(Ie).negate().transformDirection(ft),ae.SU.uCamL.value.copy(it.pod).applyMatrix4(ft.copy(Rt).invert())}else ae.station.matrix.copy(k0);if(ae.station.matrixWorldNeedsUpdate=!0,ae.IU.uAmt.value=v(26.3,29.5,o),o>27.2&&o<34.5&&r<1){const u=o-28,A=y.parts.booster;A.visible=!0,A.position.copy(it.pod).addScaledVector(Ia,270+50*u+25*Math.max(u,0)**2).addScaledVector(Bt,-55-8*u).addScaledVector(Ra,-3-10*u),A.rotation.set(o*.8,o*.23,o*.5)}J.uHzHi.value=U(1,.3,v(4e3,26e3,q)),ne.uStarK.value=b.starK*U(1,.12,v(3e4,6e4,q)),ne.uHorK.value=U(.12,.05,Oe),J.uHor.value.copy(b.hor).lerp(M0,(m?0:F?.35:.75)*v(9e3,32e3,q)).multiplyScalar(1-.18*Oe),fo.value=1-v(1300,2600,q);const Kt=q<9e3;lo.visible=Ze.visible=Pe.visible=Le.visible=Mt.visible=ba.visible=tt.visible=xo.mesh.visible=So.mesh.visible=Kt,va.mesh.visible=Kt&&o<9,va.U.uOp.value=.5*(1-v(2.2,6,o)),fa&&(fa.mesh.visible=q<6e4),Me.value.copy(be).transformDirection(T.matrix).transformDirection(n.matrixWorldInverse),kt.U.uOp.value=.9*Math.min(1,$*2.2)*(1-v(40,380,Ne(o))),kt.mesh.visible=Kt&&kt.U.uOp.value>.01;const Zo=1+.9*y.state.pressure;y.parts.plume.scale.set(Zo,1,Zo),Kt&&(Po(a),St.rotation.y=1.25*v(.4,1.9,o),N.copy(Ba).sub(Pe.position).normalize(),Pe.quaternion.setFromUnitVectors(Ta,N),xo.U.uClock.value=o,So.U.uClock.value=o,va.U.uClock.value=a,Do.uClock.value=o,kt.U.uClock.value=a),vo.value=$*(1-v(300,2600,q)),ce.value=$*(m?1:F?.8:.7),Jt.value.set(0,-$t(o)),wa.uT.value=o,pa(Math.min(o,22.1),wa.uHead.value),ta.uColT.value=Ne(Math.min(o,22)),xa.visible=o>5.3;for(const u of l0){const A=u.t<0?1:v(u.t+.05,u.t+.5,o);u.U.uFade.value=A,u.mesh.visible=A>.002,u.U.uDk.value.w=u.d4*(u.t>0&&o>u.t+.03?No(u.h):1)}to.value.w=de[4]*(de.t>0&&o>de.t+.03?No(de[0]):1),qa=(qa+Math.min(e,.1)*260*v(3,13,o))%1e5,ot.uRun.value=(a*40+qa)%1e5;const $o=v(14e3,2e4,q);let Wt=Math.min(1,G+.8*xe+.14*v(800,1500,q)*(1-v(11e3,16e3,q)));if(Wt=o>22.3?0:Math.max(Wt,.35*$*v(3,7,o)),ot.uAmt.value=Wt,nt.visible=Wt>.01,ot.uThin.value=U(1,.12,$o),ot.uBright.value=U(1,1.5,$o),lt.uClock.value=o<8?o:(o-8)%7.9,lt.uShare.value=o<8?1:.7,lt.uDim.value=m?1-.6*v(8,9,o)*(1-B.value.w):1,lt.uG.value=o<8?7:U(7+11*v(8,13,o),.12,v(22.1,23.3,o)),o>13.5&&o<22.2&&y.setShed(U(.55,.95,v(13.5,17,o))),Ft.uAmt.value=v(22.7,24.2,o),Ft.uCamL.value.copy(it.pod),rt.visible=Ft.uAmt.value>.004,ge.uFlash.value=y.flash*.05,y.uniforms.uFlash.value=y.flash*.08,He.visible=ge.uFlash.value>.003,we.uA.value=r>0&&V?S:0,Ge.visible=we.uA.value>.003,Ge.visible){const u=n.projectionMatrix.elements,A=75*Se;we.uZ.value=ie((u[10]*-A+u[14])/A,-1,.99999),we.uPhase.value=le*2.3+a*.06,we.uKind.value.fromArray(V.kind),we.uSeed.value=V.sd;const Q=Math.hypot(Me.value.x,Me.value.y);we.uSunS.value.set(Me.value.x,Me.value.y).multiplyScalar(Q>1e-4?1/Q:0)}if(He.visible||Ge.visible){Ht.set(0,-40,0,1).applyMatrix4(se.matrix).applyMatrix4(n.matrixWorldInverse).applyMatrix4(n.projectionMatrix);const u=Math.max(Math.abs(Ht.w),.001);ge.uGp.value.set(ie(Ht.x/u,-2,2),ie(Ht.y/u,-2,2)),ge.uAspect.value=n.aspect||1.78}if(!It&&r>0){for(const u of Z.children)if(!T0.has(u)&&!u.isLight&&!u.matrixAutoUpdate&&Math.abs(u.matrix.elements[14]+600)<1&&Math.abs(u.matrix.elements[12])<1&&Math.abs(u.matrix.elements[13])<1){It=u;break}}It&&(It.visible=o>26.3||r>=1),y.update(e,a,n)}return{scene:Z,path:Jo,duration:40,ride:"none",companion:"none",camera:{fov:75,near:.25,far:6e4,lookAhead:30,sway:0,bank:0},pois:[],portal:{shape:"circle",radius:9,color:"#BFE9FF",glow:1,revealDistance:200},post:{exposure:m?1.05:1,bloom:{strength:m?.6:.42,radius:.6,threshold:.92},grade:{saturation:1.08,contrast:1.06,tint:"#ffffff",shadowTint:m?"#02040a":"#000308",vignette:.22,grain:.015,aberration:0}},update:E0,dispose(){y.dispose?.()}}}};export{j0 as default};
