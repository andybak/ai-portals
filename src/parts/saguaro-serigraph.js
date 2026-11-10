import*as F from"three";const _a=["#E3A23A","#C4603A","#3F7D5A","#4FA39B","#5A4689","#6B4630","#D93A2B"],xa=.42,ya=-.02,Xo=O=>new F.Color(O),q=(O,L,b)=>O.clone().lerp(L,b),_o=(O,L)=>O.clone().multiply(L),ro=`
uniform vec3 uSun; uniform vec4 uShadow; uniform vec4 uShadowB; uniform vec3 uPaper; uniform vec3 uOver; uniform float uTime;
float aastep(float e, float x){ float w = max(fwidth(x), 1e-5); return clamp((x - e) / w + .5, 0., 1.); }
vec3 tone3(vec3 L, vec3 M, vec3 D, float ndl){
  float w = max(fwidth(ndl), 1e-4);
  float a = clamp((ndl - ${xa.toFixed(2)}) / w + .5, 0., 1.), b = clamp((ndl - (${ya.toFixed(2)})) / w + .5, 0., 1.);
  return mix(D, mix(M, L, a), b);
}
float cellShade(vec2 p){
  float e = dot(uShadow.xy, p) + uShadow.z;
  float a = dot(vec2(-uShadow.y, uShadow.x), p);
  e += 9. * sin(a * .043 + 1.3) + 4. * sin(a * .117 + 4.1) + 1.6 * sin(a * .31);
  float w = max(fwidth(e), 1e-4);
  float e2 = dot(uShadowB.xy, p) + uShadowB.z;                    // optional second edge: the shadow ends beyond it
  float a2 = dot(vec2(-uShadowB.y, uShadowB.x), p);
  e2 += 7. * sin(a2 * .051 + 2.1) + 3. * sin(a2 * .137 + .7) + 1.2 * sin(a2 * .37);
  float w2 = max(fwidth(e2), 1e-4);
  return clamp(e / w + .5, 0., 1.) * uShadow.w * (1. - clamp(e2 / w2 + .5, 0., 1.) * uShadowB.w);
}
float h31(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float vn3(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z);
}
vec3 grain(vec3 c, vec3 op){
  vec3 fw = fwidth(op);
  float fade = clamp(1. - (fw.x + fw.y + fw.z) * 4., 0., 1.);
  float g = vn3(op * 5.), s = vn3(op * 17. + 7.3);
  c *= 1. + fade * .08 * (g - .5);
  return mix(c, uPaper, fade * .11 * smoothstep(.74, .82, s));
}
`,Ea=`
uniform vec4 uWash; uniform vec4 uWash2; uniform float uFront; uniform float uHump;
float washX(float z){ return uWash.x * sin(z * uWash.y + uWash.z) + uWash2.x * sin(z * uWash2.y + uWash2.z); }
float frontLag(float t){ return uWash2.w * t * t; }
float humpAt(float s, float t){ return uHump * smoothstep(2.6, 7., s) * (1. - smoothstep(9.5, 21., s)) * (1. - smoothstep(.5, .92, abs(t))); }
`,po=`#include <common>
#include <fog_pars_vertex>
`,so=`#include <common>
#include <fog_pars_fragment>
`;class to{constructor(L){this.spec=L,this.a={};for(const b in L)this.a[b]=[];this.idx=[],this.n=0}v(L){for(const b in this.spec){const t=L[b];for(let I=0;I<this.spec[b];I++)this.a[b].push(t[I]??0)}return this.n++}tri(L,b,t){this.idx.push(L,b,t)}quad(L,b,t,I){this.idx.push(L,b,t,L,t,I)}geo(){const L=new F.BufferGeometry;for(const b in this.spec)L.setAttribute(b,new F.BufferAttribute(new Float32Array(this.a[b]),this.spec[b]));return L.setIndex(this.n>65535?new F.BufferAttribute(new Uint32Array(this.idx),1):new F.BufferAttribute(new Uint16Array(this.idx),1)),L}get tris(){return this.idx.length/3}}async function Ga(O,L={}){const b=O.rng.fork?O.rng.fork("monsoon-flood"):O.rng,t=(o,a)=>b.range(o,a),I=L.hour==="noon"||L.hour==="night"?L.hour:"golden",Eo=L.weather==="haboob"||L.weather==="virga"?L.weather:"cell",Qo=L.season==="may"||L.season==="august"?L.season:"july",Zo=L.gain??1,wa=(L.palette&&L.palette.length>=7?L.palette:_a).map(Xo),Y=Xo(L.paper||"#F2E4C4");let[wo,Uo,Ma,co,X,lo,ka]=wa;const bo=new F.Color(1,1,1),ba=q(bo,X,.74),e={paper:Y,gold:wo,terra:Uo,green:Ma,turq:co,violet:X,cocoa:lo,scarlet:ka,groundL:wo.clone(),groundM:Uo.clone(),groundSh:q(X,Y,.27),sand:q(Y,wo,.34),sandSh:q(q(X,Y,.48),wo,.06),skyTop:co.clone(),skyBot:Y.clone(),sun:q(Y,bo,.25),flood:lo.clone(),floodDark:_o(lo,q(bo,X,.6)),floodPale:q(lo,Y,.5),cream:Y.clone(),creamMid:q(Y,lo,.3),over:ba};I==="noon"&&(e.groundL=q(wo,Y,.3),e.sand=q(Y,wo,.2),e.skyTop=q(co,Y,.15)),I==="night"&&(e.groundL=q(q(co,X,.45),Y,.12),e.groundM=q(X,co,.2),e.groundSh=q(X,lo,.25),e.sand=q(q(co,X,.25),Y,.27),e.sandSh=q(X,co,.35),e.skyTop=_o(X,q(bo,X,.5)),e.skyBot=q(co,X,.25),e.sun=Y.clone(),e.flood=_o(lo,q(bo,X,.45)),e.floodDark=_o(lo,X).multiplyScalar(1.6),e.floodPale=q(lo,co,.4));for(const o in e)o!=="over"&&(e[o]=e[o].clone().multiplyScalar(Zo));const _=Eo==="virga",Wo=I==="noon",fo=15,V=1.2,$o=_?4.6:fo-.35,mo=_?.32:Wo?.5:1,N=_?.38:Wo?.5:1,uo=-210,Mo=115,La=260,Jo=L.meander??1,Go=t(3.5,6)*Jo,oa=Math.PI*2/t(170,230),Lo=t(0,6.28),Io=t(.8,1.8)*Jo,aa=Math.PI*2/t(58,84),Oo=t(0,6.28),za=_?2.5:t(5.5,7),ta=Go*Math.sin(Lo)+Io*Math.sin(Oo),Do=o=>Go*Math.sin(o*oa+Lo)+Io*Math.sin(o*aa+Oo)-ta,zo=(()=>{let o=(Math.floor(Lo*1e7)^2654435769)>>>0;return()=>{o=o+1831565813|0;let a=Math.imul(o^o>>>15,1|o);return a=a+Math.imul(a^a>>>7,61|a)^a,((a^a>>>14)>>>0)/4294967296}})(),$=(o,a)=>o+(a-o)*zo(),Ko=O.noise,ea=(o,a)=>.9*Ko.n2(o*.045,a*7.3)+.38*Ko.n2(o*.21,a*3.1+9),So=o=>Do(o)-fo-ea(o,-1),Fo=o=>Do(o)+fo+ea(o,1),qo=o=>{if(o<=0)return V;const a=Math.max(0,1-o/.5),n=Math.max(0,1-o/2);return(V-.2)*Math.pow(a,.7)+.2*n*n},Sa=(o,a)=>qo(Math.min(o-So(a),Fo(a)-o)),J=new F.Vector3;L.sunDir?J.fromArray(L.sunDir).normalize():I==="noon"?J.set(-.26,.93,-.26).normalize():I==="night"?J.set(-.55,.62,-.56).normalize():J.set(-.612,.5,-.612).normalize();const K={uTime:{value:0},uSun:{value:J.clone()},uShadow:{value:new F.Vector4(0,-1,30,1)},uShadowB:{value:new F.Vector4(0,-1,0,0)},uPaper:{value:e.paper},uOver:{value:e.over},uFront:{value:0},uWash:{value:new F.Vector4(Go,oa,Lo,ta)},uWash2:{value:new F.Vector4(Io,aa,Oo,za)},uHump:{value:_?0:Wo?1.1:2.6},uCamL:{value:new F.Vector3},uCamY:{value:0},uFlash:{value:0},uBolt:{value:0},uRain:{value:L.rain??(L.weather==="virga"?0:.3)},uAnvil:{value:.5}},Fa=(o={},a=!0)=>{const n=a?F.UniformsUtils.clone(F.UniformsLib.fog):{};for(const r in K)n[r]=K[r];for(const r in o)n[r]={value:o[r]};return n},Q=(o,a,n,r={})=>new F.ShaderMaterial({uniforms:Fa(n,r.fog!==!1),vertexShader:o,fragmentShader:a,fog:r.fog!==!1,side:r.side??F.FrontSide,transparent:!!r.transparent,depthWrite:r.depthWrite??!r.transparent,depthTest:r.depthTest??!0}),eo=new F.Group;eo.name="monsoon-flood";const na=[];let Ho=0;const Z=(o,a,n)=>{const r=new F.Mesh(o,a);return r.frustumCulled=!1,n!==void 0&&(r.renderOrder=n),eo.add(r),na.push(o,a),Ho+=o.index?o.index.count/3:0,r},go=Ea.replace("uWash2.x * sin(z * uWash2.y + uWash2.z)","uWash2.x * sin(z * uWash2.y + uWash2.z) - uWash.w");if(L.ground!==!1){const o=new to({position:3,aAc:2}),a=[-105,-60,-32,-16,-7,-2.5,-.7,0,.14,.3,.5,.9,1.4,2.1,4,8],n=Math.round((Mo-uo)/2.5),r=a.length*2+1;for(let x=0;x<=n;x++){const m=uo+(Mo-uo)*x/n,P=So(m),z=Fo(m),A=[];for(const s of a)A.push(P+s);A.push((P+z)/2);for(let s=a.length-1;s>=0;s--)A.push(z-a[s]);for(const s of A){const h=s-P,p=z-s,M=Math.min(h,p),i=Math.max(0,-M-6);o.v({position:[s,qo(M)+(M<0?.1*Ko.n2(s*.05,m*.05)*Math.min(1,i/20):0),m],aAc:[h,p]})}}for(let x=0;x<n;x++)for(let m=0;m<r-1;m++){const P=x*r+m;o.quad(P,P+r,P+r+1,P+1)}const d=Math.hypot(J.x,J.z)||.001,w=Math.min(6,V*Math.abs(J.x)/Math.max(J.y,.15));Z(o.geo(),Q(po+`
      attribute vec2 aAc; varying vec3 vL; varying vec3 vW; varying vec2 vAc; varying vec3 vNb;
      void main(){
        vL = position; vAc = aAc;
        vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz;
        vNb = normalize(mat3(modelMatrix) * vec3(aAc.x < aAc.y ? 1. : -1., .3, 0.));
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,so+ro+`
      uniform vec3 uGL, uGM, uGSh, uSand, uSandSh, uCocoa; uniform float uBankH, uBar, uBarSide;
      varying vec3 vL; varying vec3 vW; varying vec2 vAc; varying vec3 vNb;
      void main(){
        float sh = cellShade(vW.xz);
        float y = vL.y; vec2 q = vL.xz;
        float top = aastep(uBankH - .07, y), bed = 1. - aastep(.07, y);
        float edge = max(abs(q.x) / 120., abs(q.y + 47.) / 162.);
        float keep = 1. - smoothstep(.55, .92, edge);
        // apron: gold with flat terracotta blots and pebbles
        float n = vn3(vec3(q * .15, 1.7)) + .5 * vn3(vec3(q * .41, 5.));
        float blot = aastep(1.04, n) * keep;
        float pf = clamp(1. - fwidth(q.x * 1.3) * 2.2, 0., 1.);
        float peb = aastep(.80, vn3(vec3(q * 1.3, 9.))) * pf * keep * (1. - aastep(1.10, n));
        vec3 gL = mix(uGL, uGSh, sh), gM = mix(uGM, mix(uGSh, uGSh * uOver, .6), sh);
        vec3 apron = mix(gL, gM, max(blot, peb * step(.93, n)));
        // bed: pale sand with flow streaks and the left bank's violet shadow bar
        float m = min(vAc.x, vAc.y);
        float r = vn3(vec3(m * .55, q.y * .06, 3.)) + .35 * vn3(vec3(m * 1.7, q.y * .2, 8.));
        float streak = aastep(.80, r) * (1. - aastep(.90, r)) + aastep(1.14, r);
        vec3 sand = mix(uSand, uSandSh, sh);
        vec3 bedc = mix(sand, gL, clamp(streak, 0., 1.) * (.5 - .32 * sh));
        float bd = uBarSide > 0. ? vAc.x : vAc.y;
        float barM = aastep(0.3, bd) * (1. - aastep(uBar + .3 * sin(q.y * .8) + .15 * sin(q.y * 2.3), bd)) * (1. - sh);
        bedc *= mix(vec3(1.), uOver, barM);
        // cut bank: lit terracotta or terracotta overprinted violet, with cocoa strata lines
        float ndl = dot(normalize(vNb), uSun);
        vec3 bank = tone3(mix(uGM, uGL, .28), uGM, uGM * uOver, ndl);
        bank = mix(bank, uGM * mix(vec3(1.), uOver, .75), sh);
        float yy = y / uBankH + .05 * sin(q.y * .7) + .03 * sin(q.y * 2.9);
        float strata = aastep(.34, yy) * (1. - aastep(.41, yy)) + aastep(.70, yy) * (1. - aastep(.75, yy));
        bank = mix(bank, uCocoa, strata * .85);
        vec3 c = mix(mix(bank, apron, top), bedc, bed);
        c = grain(c, vL);
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`,{uGL:e.groundL,uGM:e.groundM,uGSh:e.groundSh,uSand:e.sand,uSandSh:e.sandSh,uCocoa:e.cocoa,uBankH:V,uBar:w*(.7+.3*Math.abs(J.x)/d),uBarSide:J.x<0?1:-1}))}await O.yield();const xo=_?$o:fo+1.6;{const o=new to({position:3}),a=[-5,-3.6,-2.5,-1.6,-.9,-.35,0,.3,.7,1.2,1.8,2.6,3.6,5,7,9.5];for(;a[a.length-1]<La;)a.push(a[a.length-1]*1.16+1.5);const n=56;for(const r of a)for(let d=0;d<=n;d++)o.v({position:[-1+2*d/n,0,r]});for(let r=0;r<a.length-1;r++)for(let d=0;d<n;d++){const w=r*(n+1)+d;o.quad(w,w+1,w+n+2,w+n+1)}Z(o.geo(),Q(po+go+`
      uniform float uTime, uFW, uDepth, uZmin; varying vec3 vF; varying vec3 vW; varying float vTong;
      void main(){
        float t = position.x, s = position.z;
        float wob = .6 * sin(t * 9. + uTime * 2.3) + .4 * sin(t * 21. - uTime * 3.1);
        float ss = s < 0. ? s * (.75 + .3 * wob) * (1. - .5 * t * t) : s;
        float z = max(uFront - frontLag(t) - ss, uZmin);
        float d = uDepth * smoothstep(0., 2.4, s);
        float swell = .07 * sin(s * .8 + uTime * 3.6 + t * 6.) * smoothstep(2., 8., s) * (1. - smoothstep(60., 110., s));
        vec3 p = vec3(washX(z) + t * uFW, max(.035, d + humpAt(s, t) + swell * uDepth), z);
        vF = vec3(t * uFW, s, d); vTong = s < -.01 ? 1. : 0.;
        vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,so+ro+`
      uniform vec3 uFlood, uDark, uPale, uCream; uniform float uFlow, uFW, uEdge;
      varying vec3 vF; varying vec3 vW; varying float vTong;
      void main(){
        float sh = cellShade(vW.xz);
        float xm = vF.x, s = vF.y, a = s + uTime * uFlow;
        // ripple bands sliding toward the front, and flat cream foam flecks, densest just behind the scallops
        float wv = sin(a * 1.05 + 2.3 * sin(xm * .33 + a * .11) + 3. * vn3(vec3(xm * .12, a * .05, 4.)));
        float fa = clamp(1. - fwidth(a) * .9, 0., 1.);
        float band = aastep(.84, wv) * fa;
        float lite = aastep(.90, -wv) * fa;
        float fl = vn3(vec3(xm * .7, a * .30, 2.)) + .4 * vn3(vec3(xm * 2.1, a * .9, 6.));
        float near = 1. - smoothstep(1., 16., s);
        float fleck = aastep(1.13 - .30 * near, fl) * clamp(1. - fwidth(a) * .5, 0., 1.);
        float edge = aastep(uFW - 1.3 + .55 * sin(a * 1.7) + .3 * sin(a * 4.3), abs(xm)) * uEdge;
        vec3 c = mix(uFlood, uDark, band);
        c = mix(c, mix(uFlood, uPale, .55), lite);
        c = mix(c, uCream, max(fleck, edge));
        c *= mix(vec3(1.), uOver, .22 * sh);
        vec3 tongue = mix(uPale, uPale * mix(vec3(1.), uOver, .6), sh);
        c = mix(c, tongue, aastep(.5, vTong));
        c = grain(c, vec3(xm, 0., a));
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`,{uFlood:e.flood,uDark:e.floodDark,uPale:e.floodPale,uCream:e.cream,uFW:xo,uDepth:mo,uZmin:uo+4,uFlow:3.2,uEdge:_?1:0}))}const ia=21,ra=2*Math.PI/1.05,Ca=.72*1.22*N;{const o=eo.children[eo.children.length-1],a=Z(o.geometry,Q(o.material.vertexShader,so+ro+`
      uniform vec3 uFlood, uDark, uPale, uCream; uniform float uFlow, uHeapEnd, uBody, uLen, uPitch;
      varying vec3 vF; varying vec3 vW; varying float vTong;
      float strip(float f, float lo, float hi, float w){ float d = fract(f - .5 * (lo + hi) + .5) - .5, h = .5 * (hi - lo); return clamp((min(d + .5 * w, h) - max(d - .5 * w, -h)) / w, 0., 1.); }
      void main(){
        float sh = cellShade(vW.xz);
        float xm = vF.x, s = vF.y, a = s + uTime * uFlow;
        float tg = aastep(.5, vTong), body = uBody * clamp((s - uHeapEnd) / max(fwidth(s), 1e-5) + .5, 0., 1.);
        float al = max(tg, body);
        bool cut = al < .01;                               // the cut is decided here and made after the last filter width below: none is defined once a pixel is discarded
        float k = a / mix(uLen, uLen / 3., tg) + .366 * sin(xm * .33 + a * .11), wK = max(fwidth(k), 1e-5), f = fract(k);
        float grow = mix(smoothstep(uHeapEnd, uHeapEnd + uLen, s), 1., tg), fade = clamp(1.5 - wK * 3., 0., 1.);
        float pale = max(strip(f, .05, .05 + .12 * grow, wK), strip(f, .55, .55 + .06 * grow, wK));
        float dark = max(strip(f, .05 + .12 * grow, .05 + .30 * grow, wK), strip(f, .55 + .06 * grow, .55 + .15 * grow, wK));
        vec3 c = mix(uFlood, mix(uFlood, uPale, .55), pale * fade);
        c = mix(c, uDark, dark * fade);
        float col = xm / uPitch, su = fract(col) * 2. - 1., scal = sqrt(max(0., 1. - su * su));
        float dF = .5 * uPitch * (.6 + .4 * sin(uTime * 6.2832 * uFlow * 3. / uLen + floor(col) * 2.4)), eF = s + 5.;
        c = mix(c, uCream, (1. - clamp((eF - .15 - dF * scal) / (max(fwidth(eF), 1e-5) + dF * fwidth(scal)) + .5, 0., 1.)) * tg);
        c *= mix(vec3(1.), uOver, .22 * sh);
        c = grain(c, vec3(xm, 0., a));
        if (cut) discard;
        gl_FragColor = vec4(c, al);
        #include <fog_fragment>
      }`,{uFlood:e.flood,uDark:e.floodDark,uPale:e.floodPale,uCream:e.cream,uFW:xo,uDepth:mo,uZmin:uo+4,uFlow:3.2,uHeapEnd:ia,uBody:_?0:1,uLen:ra,uPitch:Ca},{transparent:!0}),-1);a.name="flood-water",a.material.polygonOffset=!0,a.material.polygonOffsetFactor=-1,a.material.polygonOffsetUnits=-1}if(!_){const o=new to({position:3,aE:2}),a=mo+.09,n=V/4;let r=0,d=2;for(let x=0;x<20;x++){const m=.5*(r+d);qo(m)>a?r=m:d=m}for(const x of[-1,1]){const m=o.n;let P=0;for(let z=uo+5;z<=Mo;z+=2.5,P++){const A=x<0?So(z):Fo(z);for(const s of[-.3,d+2*n])o.v({position:[A-x*s,a,z],aE:[s,x]})}for(let z=0;z<P-1;z++){const A=m+z*2;o.quad(A,A+1,A+3,A+2)}}const w=Z(o.geo(),Q(po+go+`
      attribute vec2 aE; uniform float uBankT; varying vec3 vE; varying vec3 vW;
      void main(){
        vE = vec3(aE.x, position.z, uFront - frontLag(uBankT) - position.z);
        vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,so+ro+`
      uniform vec3 uCream; uniform float uFlow, uM0, uLine, uWave, uHeapEnd; varying vec3 vE; varying vec3 vW;
      void main(){
        float w = uM0 + uLine * (1. + .5 * sin((vE.y - uTime * uFlow) * 6.2832 / uWave));
        float al = (1. - aastep(w, vE.x)) * aastep(uHeapEnd, vE.z);
        bool cut = al < .02;                               // decided here, made after the cell's shade has taken its filter widths
        gl_FragColor = vec4(uCream * mix(vec3(1.), uOver, .22 * cellShade(vW.xz)), al);
        if (cut) discard;
        #include <fog_fragment>
      }`,{uCream:e.cream,uFlow:3.2,uM0:d,uLine:n,uWave:ra/4,uHeapEnd:ia,uBankT:fo/xo},{transparent:!0,side:F.DoubleSide}),-1);w.name="flood-rub"}const ho=_?$o-.5:fo-1;{const o=new to({position:3,aL:4,aM:4}),a=[0,.42,.76,1],n=12,r=.34,d=(s,h,p,M,i,v,k,W)=>{const S=[s,h,p,M],l=[i,v,k,W??b()];for(let c=0;c<2;c++){const g=o.n,D=c?-1:1;for(let B=0;B<a.length;B++)for(let C=0;C<=n;C++){const y=Math.PI*C/n,f=a[B];o.v({position:[f*Math.cos(y),f*Math.sin(y),D*r*Math.sqrt(Math.max(0,1-f*f))],aL:S,aM:l})}for(let B=0;B<a.length-1;B++)for(let C=0;C<n;C++){const y=g+B*(n+1)+C,f=y+n+1;c?o.quad(y,y+1,f+1,f):o.quad(y,f,f+1,y+1)}}},w=[.1,1.45,3,4.7],x=[.72,1.12,1.45,1.85],m=[1,1.22,1.42,1.3],P=t(1.2,2.4)*b.sign();for(let s=0;s<4;s++){const h=x[s]*N*(s===3?1.05:1.22),p=Math.max(3,Math.round(2*ho/h));for(let M=0;M<p;M++){const i=-1+2*(M+.5+t(-.22,.22)+s%2*.5)/p;Math.abs(i)>1||d(i,w[s]*N+t(-.2,.2),x[s]*N*t(.82,1.18),i*P+b()*.45+s*.31,s===3?t(.26,.38):t(.36,.56),m[s]*t(.9,1.12),s===3?2:0)}}if(!_)for(let s=0;s<2;s++){const h=[2.3,2.8][s]*N,p=Math.max(3,Math.round(2*ho/(h*1.02)));for(let M=0;M<p;M++){const i=-1+2*(M+.5+$(-.2,.2)+s*.5)/p;Math.abs(i)>.97||d(i,[6.4,9][s]*N+$(-.3,.3),h*$(.88,1.12)*(1-.3*i*i),i*P+zo()*.5+s*.4,$(.2,.3),[1.3,1.4][s]*$(.94,1.08),3,zo())}}const z=_?8:26+b.int(0,8);for(let s=0;s<z;s++)d(t(-.9,.9),t(5,46)*(_?.6:1),t(.45,.95)*N,b(),t(.22,.4),t(.55,.85),1);const A=_?0:18;for(let s=0;s<A;s++)d((s%2?1:-1)*t(.97,1.02),t(1,70),t(.4,.75),b(),t(.3,.5),t(.7,1),1);Z(o.geo(),Q(po+go+`
      attribute vec4 aL; attribute vec4 aM; uniform float uTime, uLW, uLR, uDepth;
      varying vec3 vP; varying vec3 vN; varying vec3 vW; varying float vKind;
      void main(){
        vKind = aM.z;
        float kind = aM.z, ph = fract(uTime * aM.x + aL.w);
        float sw = sqrt(max(sin(ph * 3.14159), 0.));
        float e = ph * ph * (3. - 2. * ph);
        bool roller = kind < .5 || kind > 1.5;
        float ang = kind < .5 ? mix(-.7, 1.4, e) : kind > 1.5 ? mix(-.5, .95, e) : mix(-.35, .5, e);
        float sc = aL.z * (kind > 2.5 ? .42 + .58 * sw : .28 + .72 * sw);
        vec3 q = position * vec3(sc, sc * aM.y, sc);
        vec3 n = normalize(vec3(position.x, position.y / max(aM.y, .2), position.z / .1156 + sign(position.z) * 1e-3));
        float ca = cos(ang), sa = sin(ang);
        q = vec3(q.x, q.y * ca - q.z * sa, q.z * ca + q.y * sa);
        n = vec3(n.x, n.y * ca - n.z * sa, n.z * ca + n.y * sa);
        float adv = roller ? mix(-.55, .95, ph) * aL.z : 0.;
        float z = uFront - frontLag(aL.x * uLR) - aL.y + adv;
        float base = uDepth * smoothstep(0., 2.4, aL.y + .9) + humpAt(aL.y - adv, aL.x * uLR) - .16 * aL.z;
        vec3 p = vec3(washX(z) + aL.x * uLW + q.x, base + q.y, z + q.z);
        vP = position; vN = normalize(mat3(modelMatrix) * n);
        vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,so+ro+`
      uniform vec3 uCream, uMid, uFlood, uDark; varying vec3 vP; varying vec3 vN; varying vec3 vW; varying float vKind;
      void main(){
        float r = length(vP.xy), ndl = dot(normalize(vN + vec3(0., 1e-4, 0.)), uSun);
        float line = aastep(.585, r) * (1. - aastep(.665, r)) + aastep(.25, r) * (1. - aastep(.315, r));
        vec3 c = tone3(uCream, uMid, uFlood, ndl + .18);
        c = mix(c, uFlood, line);
        c = mix(c, uCream, aastep(.80, r));                // unprinted cream rim: the keyline of every scallop
        c = mix(c, uFlood, aastep(.885, r) * (1. - aastep(.93, r)));
        vec3 k = tone3(mix(uFlood, uMid, .22), uFlood, uDark, ndl + .1);   // the cocoa crest behind the cream rows
        k = mix(k, uMid, line * .8);
        k = mix(k, uCream, aastep(.905, r));
        c = mix(c, k, step(1.5, vKind));
        vec3 k3 = mix(tone3(uFlood, uFlood, uDark, ndl + .1), uCream, aastep(.93, r));   // the wall: solid cocoa, one cream rim
        c = mix(c, k3, step(2.5, vKind));
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`,{uCream:e.cream,uMid:e.creamMid,uFlood:e.flood,uDark:e.floodDark,uLW:ho,uLR:ho/xo,uDepth:mo},{side:F.DoubleSide}))}{const o=new to({position:3,aL:4,aM:4}),a=Math.round((_?40:170)*(O.quality?.detail??1));for(let n=0;n<a;n++){const r=[t(-1,1),t(-.3,3.2)*N,t(.09,.26)*(.6+.4*N),b()],d=[t(3.2,7.4)*Math.sqrt(N),t(.5,4.5),t(-1.2,1.2),t(.75,1.25)],w=o.n;o.v({position:[0,0,0],aL:r,aM:d});for(let x=0;x<9;x++)o.v({position:[Math.cos(x*.6981),Math.sin(x*.6981),0],aL:r,aM:d});for(let x=0;x<9;x++)o.tri(w,w+1+x,w+1+(x+1)%9)}Z(o.geo(),Q(po+go+`
      attribute vec4 aL; attribute vec4 aM; uniform float uTime, uLW, uLR, uDepth;
      void main(){
        float T = 2. * aM.x / 9.8;
        float ph = fract(uTime * aM.w / max(T, .2) + aL.w), tau = ph * T;
        float z = uFront - frontLag(aL.x * uLR) - aL.y + aM.y * tau;
        vec3 c = vec3(washX(z) + aL.x * uLW + aM.z * tau, uDepth + .5 + aM.x * tau - 4.9 * tau * tau, z);
        vec4 mvPosition = modelViewMatrix * vec4(c, 1.);
        float sz = aL.z * (1. - .55 * ph) * (1. + max(-mvPosition.z - 30., 0.) * .012);
        mvPosition.xy += position.xy * sz;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,so+`
      uniform vec3 uCream;
      void main(){ gl_FragColor = vec4(uCream, 1.);
        #include <fog_fragment>
      }`,{uCream:e.cream,uLW:ho,uLR:ho/xo,uDepth:mo},{side:F.DoubleSide}))}{const o=new to({position:3,aL:4,aM:4}),a=_?7:Wo?16:30;for(let n=0;n<a;n++){const r=_?$(-.8,.8):((n+.5)/a*2-1)*.92+$(-.05,.05),d=1-.5*r*r,w=[r,$(.5,5.5)*N,$(1.5,2.5)*(.45+.55*N)*(.75+.25*d),zo()],x=[$(.26,.42),(n%3===0?$(4.8,6.4):$(2.2,4.4))*d*(.3+.7*N),zo(),$(2.5,6)],m=[[-1,-1],[1,-1],[1,1],[-1,1]].map(P=>o.v({position:[P[0],P[1],0],aL:w,aM:x}));o.quad(m[0],m[1],m[2],m[3])}Z(o.geo(),Q(po+go+`
      attribute vec4 aL; attribute vec4 aM; uniform float uTime, uLW, uLR, uDepth; uniform vec3 uSun;
      varying vec2 vQ; varying vec2 vS; varying vec3 vK; varying vec3 vW;
      void main(){
        float ph = fract(uTime * aM.x + aL.w);
        float e = 1. - (1. - ph) * (1. - ph);
        float z = uFront - frontLag(aL.x * uLR) - aL.y - aM.w * ph;
        vec3 c = vec3(washX(z) + aL.x * uLW, uDepth * 3.4 + aM.y * e, z);
        float sz = aL.z * (.42 + .78 * sqrt(ph));
        float flip = aM.z > .5 ? 1. : -1.;
        vec4 w = modelMatrix * vec4(c, 1.); vW = w.xyz;
        vec4 mvPosition = viewMatrix * w;
        mvPosition.xy += position.xy * sz;
        vQ = position.xy * vec2(flip, 1.); vK = vec3(ph, aM.z, 0.);
        vec3 sv = mat3(viewMatrix) * uSun;
        vS = normalize(vec2(sv.x * flip, sv.y) + vec2(1e-4, 0.));
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,so+ro+`
      uniform vec3 uCream, uMid, uFlood;
      varying vec2 vQ; varying vec2 vS; varying vec3 vK; varying vec3 vW;
      float puffShape(vec2 q, float k){
        float d = length(q - vec2(-.42, -.16)) - .40;
        d = min(d, length(q - vec2(.40, -.22 + .1 * k)) - .42);
        d = min(d, length(q - vec2(-.06, .26)) - .50);
        d = min(d, length(q - vec2(.34, .34 - .12 * k)) - .30);
        d = min(d, length(q - vec2(.0, -.36)) - .44);
        return d;
      }
      void main(){
        float ph = vK.x, thinning = smoothstep(.5, 1., ph) * .46;
        float d = puffShape(vQ, vK.y) + thinning;
        float al = 1. - aastep(0., d);
        bool cut = al < .02;                                       // decided here, made after the last filtered edge below
        float sh = cellShade(vW.xz);
        float dS = puffShape(vQ + vS * .22, vK.y) + thinning;      // the side away from the sun
        vec3 c = mix(uCream, mix(uMid, uMid * uOver, .35 * sh), aastep(0., dS));
        float line = aastep(-.135, d) * (1. - aastep(-.06, d));
        if (cut) discard;
        c = mix(c, uFlood, line * .9);
        gl_FragColor = vec4(c, al);
        #include <fog_fragment>
      }`,{uCream:e.cream,uMid:e.creamMid,uFlood:e.flood,uLW:ho,uLR:ho/xo,uDepth:mo},{transparent:!0,side:F.DoubleSide}),3)}await O.yield();{const o=new to({position:3,normal:3,aPc:4,aRot:4,aInk:4}),a=F.Vector3,n=(i,v,k,W,S,l,c,g=1,D=1,B=.07)=>{const C=i.length,y=[];let f=new a(0,1,.13).normalize();for(let T=0;T<C;T++){const R=new a().subVectors(i[Math.min(C-1,T+1)],i[Math.max(0,T-1)]).normalize(),H=new a().crossVectors(R,f);H.lengthSq()<1e-6&&H.set(0,0,1),H.normalize(),f=new a().crossVectors(H,R).normalize(),y.push(o.n);for(let G=0;G<=k;G++){const E=G/k*Math.PI*2,U=v[T]*(W?1+B*Math.cos(W*E):1),ao=H.x*Math.cos(E)+f.x*Math.sin(E),ko=H.y*Math.cos(E)+f.y*Math.sin(E),io=H.z*Math.cos(E)+f.z*Math.sin(E),vo=g===2&&T===0?(G%2?-.22:.12)*(.6+b()):0;o.v({position:[i[T].x+ao*U+R.x*vo,i[T].y+ko*U+R.y*vo,i[T].z+io*U+R.z*vo],normal:[ao,ko,io],aPc:l,aRot:c,aInk:[W?G/k*W:0,T/(C-1),S,W?1:0]})}}for(let T=0;T<C-1;T++)for(let R=0;R<k;R++){const H=y[T]+R,G=y[T+1]+R;o.quad(H,G,G+1,H+1)}const j=(T,R,H)=>{if(!R)return;const G=new a().subVectors(i[T],i[T===0?1:T-1]).normalize(),E=new a().copy(i[T]).addScaledVector(G,R===1?v[T]*.75:-.05),U=o.v({position:[E.x,E.y,E.z],normal:[G.x,G.y,G.z],aPc:l,aRot:c,aInk:[0,T?1:0,R===2?3:S,0]});for(let ao=0;ao<k;ao++)H>0?o.tri(y[T]+ao,U,y[T]+ao+1):o.tri(y[T]+ao+1,U,y[T]+ao)};j(0,g,-1),j(C-1,D,1)},r=(i,v,k,W,S)=>{const l=o.n,c=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];for(const g of c)o.v({position:[i.x+g[0]*v,i.y+g[1]*v,i.z+g[2]*v],normal:g,aPc:W,aRot:S,aInk:[0,0,k,0]});for(const g of[[0,2,4],[2,1,4],[1,3,4],[3,0,4],[2,0,5],[1,2,5],[3,1,5],[0,3,5]])o.tri(l+g[0],l+g[1],l+g[2])},d=(i,v,k,W,S)=>{const l=[k,W,b(),.05],c=[t(.45,.8)*b.sign(),0,t(-.45,.45),.14],g=12,D=[],B=[];for(let y=0;y<=g;y++){const f=y/g;D.push(new a((f-.5)*i,0,0)),B.push(v*(.9+.14*Math.sin(f*3))*(y===g?.82:1))}n(D,B,26,13,0,l,c,2,1);const C=Qo==="may"?3:2;for(let y=0;y<7;y++){const f=y*.9+b();r(new a(i/2+v*.45,Math.cos(f)*v*.62,Math.sin(f)*v*.62),.11,C,l,c)}for(let y=0;y<S;y++){const f=t(0,6.28),j=t(-.15,.2)*i,T=v*.68,R=t(.75,1.05),H=t(1.3,2.3),G=Math.cos(f),E=Math.sin(f),U=[],ao=[];for(let io=0;io<=8;io++){const vo=io/8,pa=Math.min(1,vo*2.2),Aa=Math.sin(pa*Math.PI/2),Ba=1-Math.cos(pa*Math.PI/2),ga=R*Aa,Ra=j+R*.55*Ba+Math.max(0,vo-.45)*H*1.8;U.push(new a(Ra,G*ga,E*ga)),ao.push(T*(io===0?1.1:1))}n(U,ao,20,10,0,l,c,0,1);const ko=U[8];for(let io=0;io<4;io++){const vo=io*1.57+b();r(new a(ko.x+T*.5,ko.y+Math.cos(vo)*T*.6,ko.z+Math.sin(vo)*T*.6),.09,C,l,c)}}},w=(i,v)=>{const k=[i,v,b(),.55*N+.1],W=[t(.2,.5),t(.45,.85)*b.sign(),t(0,6.28),.3],S=b.int(8,11),l=b.chance(.75)?2:1,c=Qo==="august"?4:1;for(let g=0;g<S;g++){const D=t(0,6.28),B=t(.08,.42),C=t(3.2,5),y=new a(1,Math.cos(D)*B,Math.sin(D)*B).normalize(),f=[],j=[],T=t(-.25,.25),R=t(-.25,.25),H=b.chance(.3)?t(.5,.8):2;for(let G=0;G<=5;G++){const E=G/5,U=new a().copy(y).multiplyScalar(C*E-C*.3);U.y+=T*Math.sin(E*3.1)*.5+(E>H?(E-H)*-1.6:0),U.z+=R*Math.sin(E*2.4)*.5,f.push(U),j.push(.075-.035*E)}n(f,j,4,0,c,k,W,1,0),n([f[5].clone(),f[5].clone().addScaledVector(y,.42)],[.085,.05],4,0,l,k,W,0,1)}},x=(i,v)=>{const k=[i,v,b(),.1],W=[t(.3,.6)*b.sign(),0,t(0,6.28),.2],S=t(2.4,3.6),l=t(.35,.55);n([new a(-S/2,0,0),new a(0,.12,.05),new a(S/2,.05,-.1)],[.12,.1,.05],6,0,4,k,W),n([new a((l-.5)*S,.05,0),new a((l-.2)*S,.5,.45),new a((l+.1)*S,.75,1)],[.085,.065,.035],6,0,4,k,W,0,1),n([new a((l-.3)*S,.02,0),new a((l-.1)*S,-.3,-.5),new a((l+.15)*S,-.35,-.95)],[.07,.05,.03],6,0,4,k,W,0,1)},m=b.sign();_?x(t(4,7),t(-2,2)):(d(t(5.2,6.6),t(.3,.36),t(5.5,8),m*t(1.5,5.5),b.int(1,2)),d(t(2,2.8),.24,t(15,24),-m*t(3,9),0),x(t(9,14),-m*t(6,11)),x(t(22,34),m*t(2,10)));const P=_?1:b.int(3,4),z=fo-6,A=i=>Math.abs(i)>z?Math.sign(i)*(2*z-Math.abs(i)):i;for(let i=0;i<P;i++)w(t(.8,4.2)*N+i*.4,A(_?t(-2,2):-m*t(2,12)+i*m*t(5,8)));const s=o.geo(),h=po+go+`
      attribute vec4 aPc; attribute vec4 aRot; attribute vec4 aInk; uniform float uTime, uDepth, uHull, uLR, uRW;
      varying vec3 vN; varying vec3 vO; varying vec4 vInk; varying vec3 vW;
      vec3 rx(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(p.x, p.y * c - p.z * s, p.z * c + p.y * s); }
      vec3 ry(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(p.x * c + p.z * s, p.y, p.z * c - p.x * s); }
      vec3 rz(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(p.x * c - p.y * s, p.y * c + p.x * s, p.z); }
      void main(){
        float ph = aPc.z * 6.2832;
        float aR = uTime * aRot.x + ph, aT = aRot.y != 0. ? uTime * aRot.y + ph : .16 * sin(uTime * .9 + ph), aY = aRot.z + .3 * sin(uTime * .37 + ph * 3.);
        vec3 p = position, n = normal;
        vec3 po = p;
        p = ry(rz(rx(p, aR), aT), aY); n = ry(rz(rx(n, aR), aT), aY);
        float z = uFront - frontLag(aPc.y / uRW) - aPc.x + .5 * sin(uTime * .5 + ph);
        vec3 c = vec3(washX(z) + aPc.y, uDepth * smoothstep(0., 2.4, aPc.x) + humpAt(aPc.x, aPc.y / uRW) + aPc.w + aRot.w * sin(uTime * 1.7 + ph * 2.), z);
        vec4 w = modelMatrix * vec4(c + p, 1.);
        float dist = length(w.xyz - cameraPosition);
        w.xyz += normalize(mat3(modelMatrix) * n) * uHull * (.035 + dist * .0026);
        vN = normalize(mat3(modelMatrix) * n); vO = po; vInk = aInk; vW = w.xyz;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,p={uDepth:mo,uLR:1,uRW:xo,uHull:0};Z(s,Q(h,so+ro+`
      uniform vec3 uGreen, uGreenL, uStick, uStickL, uScar, uCream, uCocoa, uLimb;
      varying vec3 vN; varying vec3 vO; varying vec4 vInk; varying vec3 vW;
      void main(){
        float ndl = dot(normalize(vN), uSun), id = vInk.z;
        vec3 c;
        // every filtered step is taken here, before the inks part: across a trunk's ragged end id runs from 0 to 3 inside one
        // triangle, and a filter width taken in a branch that only some pixels of a block take is not defined
        float g = cos(vInk.x * 6.2832);
        float groove = (1. - aastep(-.45, g)) * vInk.w;
        vec3 green = tone3(uGreenL, uGreen, uGreen * uOver, ndl - .5 * groove), stick = tone3(uStickL, uStick, uStick * uOver, ndl);
        float rings = aastep(.5, sin(length(vO.yz) * 38.));
        vec3 limb = tone3(uLimb, uGreen, uGreen * uOver, ndl);
        if (id < .5) c = green;
        else if (id < 1.5) c = stick;
        else if (id < 2.5) c = uScar;
        else if (id < 3.5) c = mix(uCream, uCocoa, rings * .8);
        else c = limb;
        c = grain(c, vO);
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`,{...p,uGreen:e.green,uGreenL:q(e.green,e.paper,.48),uStick:e.floodDark,uStickL:q(e.violet,e.paper,.5),uScar:e.scarlet,uCream:e.cream,uCocoa:e.cocoa,uLimb:q(e.green,e.gold,.45)}));const M=Z(s,Q(h,so+`
      uniform vec3 uCream;
      void main(){ gl_FragColor = vec4(uCream, 1.);
        #include <fog_fragment>
      }`,{...p,uHull:1,uCream:e.cream},{side:F.BackSide}));M.renderOrder=0,Ho+=0}if(await O.yield(),!_){const o=new to({position:3,normal:3,aS:4});let a=uo+30,n=b.sign();for(;a<Mo-12;){const r=t(1.6,3.4),d=t(.55,.95),w=V+.03,x=n,m=x<0?So(a):Fo(a),P=[m,a,-x,t(.8,1.25)],z=-d*.7,A=d*.3,s=-r/2,h=r/2,p=t(-.25,.25),M=[[z,0,s],[A,0,s+.1],[A-.08,w,s+.15+p*.3],[z,w,s],[z,0,h],[A,0,h-.1],[A-.1,w,h-.2+p],[z,w,h]],i=(v,k,W,S,l)=>{const c=[v,k,W,S].map(g=>o.v({position:M[g],normal:l,aS:P}));x<0?o.quad(c[0],c[1],c[2],c[3]):o.quad(c[3],c[2],c[1],c[0])};i(1,5,6,2,[1,.1,0]),i(3,2,6,7,[0,1,0]),i(0,1,2,3,[0,0,-1]),i(5,4,7,6,[0,0,1]),i(4,0,3,7,[-1,0,0]),a+=t(7,13),n=b.chance(.7)?-n:n}Z(o.geo(),Q(po+go+`
      attribute vec4 aS; varying vec3 vN; varying vec3 vL; varying vec3 vW; varying float vTop;
      void main(){
        float k = clamp((uFront - frontLag(1.) - aS.y + 3.) / (8. * aS.w), 0., 1.); k = k * k * (3. - 2. * k);
        float a = k * 1.5, ca = cos(a), sa = sin(a), uh = .3;
        vec2 q = vec2(position.x - uh, position.y), nq = normal.xy;
        q = vec2(q.x * ca + q.y * sa, q.y * ca - q.x * sa); nq = vec2(nq.x * ca + nq.y * sa, nq.y * ca - nq.x * sa);
        vec3 p = vec3(aS.x + aS.z * (q.x + uh + k * .5), q.y - k * k * 1.3, aS.y + position.z);
        vN = normalize(mat3(modelMatrix) * vec3(aS.z * nq.x, nq.y, normal.z)); vL = position; vTop = normal.y;
        vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,so+ro+`
      uniform vec3 uGL, uGM, uGSh, uCocoa; uniform float uBankH;
      varying vec3 vN; varying vec3 vL; varying vec3 vW; varying float vTop;
      void main(){
        float sh = cellShade(vW.xz);
        vec3 bank = tone3(mix(uGM, uGL, .28), uGM, uGM * uOver, dot(normalize(vN), uSun));
        bank = mix(bank, uGM * mix(vec3(1.), uOver, .75), sh);
        float yy = vL.y / uBankH + .04 * sin(vL.z * 2.9);
        float strata = aastep(.34, yy) * (1. - aastep(.41, yy)) + aastep(.70, yy) * (1. - aastep(.75, yy));
        bank = mix(bank, uCocoa, strata * .85);
        vec3 c = mix(bank, mix(uGL, uGSh, sh), step(.5, vTop));
        c = grain(c, vL + vW * 0.);
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`,{uGL:e.groundL,uGM:e.groundM,uGSh:e.groundSh,uCocoa:e.cocoa,uBankH:V},{side:F.DoubleSide}))}const To=L.cellDistance??2400,Pa=Math.PI/180,sa=L.cellBearing??t(.1,.22),Ao=new F.Vector3(Math.sin(sa),0,-Math.cos(sa)),ca=I==="noon",u=o=>To*Math.tan(o*Pa);{const o=new to({position:3,aC:4,aH:2,color:3}),a=22,n=(h,p,M,i,v,k,W=b())=>{const S=[h,p,W,i],l=[0,v],c=[k.r,k.g,k.b],g=o.v({position:[h,p,0],aC:S,aH:l,color:c});for(let D=0;D<a;D++)o.v({position:[h+Math.cos(D/a*6.2832)*M,p+Math.sin(D/a*6.2832)*M,0],aC:S,aH:l,color:c});for(let D=0;D<a;D++)o.tri(g,g+1+D,g+1+(D+1)%a)},r=(h,p,M,i,v,k,W)=>{const S=[W.r,W.g,W.b],l=[0,k],c=[(h+p)/2,M,-1,v],g=[[h,M],[p,M],[p,i],[h,i]].map(D=>o.v({position:[D[0],D[1],0],aC:c,aH:l,color:S}));o.quad(g[0],g[1],g[2],g[3])},d=I==="night"?e.skyBot:e.paper,w=h=>q(e.violet,I==="night"?d:q(d,Xo("#D6CEF2").multiplyScalar(Zo),.7),h),x=I==="night"?q(e.violet,e.paper,.45):e.cream,m=u(.42),P=(h,p,M,i,v,k=1)=>{for(const[W,S,l]of p){const c=u(W),g=u(l),D=u(M),B=u(S),C=[];let y=D+g*.3;for(;y<B;){const f=(y-D)/Math.max(1,B-D),j=1-.45*f*f,T=f>.82?1:2;for(let R=0;R<T;R++)C.push([c+(T===1?t(-.2,.2):(R?1:-1)*t(.35,.62))*g*j,Math.min(y,B-g*.4*j)+t(-.1,.1)*g,g*j*t(.5,.72)]);y+=g*t(.42,.6)}for(const f of C)n(f[0]-m*k,f[1]+m*.62*k,f[2],h,v-12,x),n(f[0],f[1],f[2],h,v,i);r(c-g*.82,c+g*.82,D,B-g*.55,h,v,i)}},z=(h,p)=>h+t(-p,p),A=b.sign();if(!ca){const h=w(.47),p=u(40),M=u(26.5),i=u(36);r(-p,p,M,i,0,-40,h);for(let l=-p;l<=p;l+=u(t(3.2,5.2))){const c=u(t(1.6,2.9));n(l-m,M+c*.2+m*.6,c,0,-52,x),n(l,M+c*.2,c,0,-40,h)}for(let l=-p;l<=p;l+=u(t(4,7)))n(l,i,u(t(2.5,4.5)),0,-40,h);for(const l of[-1,1])for(let c=M;c<=i;c+=u(2.4))n(l*p,c,u(t(1.8,3)),0,-40,h);const v=w(.41),k=M+6,W=o.n,S=16;for(let l=0;l<=S;l++){const c=-p+2*p*l/S;for(const g of[0,1])o.v({position:[c,k,0],aC:[c,k,-1,0],aH:[g,-40],color:[v.r,v.g,v.b]})}for(let l=0;l<S;l++){const c=W+l*2;o.quad(c,c+2,c+3,c+1)}for(let l=0;l<=20;l++){const c=-p+2*p*l/20,g=u(t(2.6,4.2)),D=b(),B=o.v({position:[c,k,0],aC:[c,k,D,0],aH:[1,-40],color:[v.r,v.g,v.b]});for(let C=0;C<14;C++)o.v({position:[c+Math.cos(C/14*6.2832)*g,k,0],aC:[c,k,D,0],aH:[1,-40+Math.sin(C/14*6.2832)*g],color:[v.r,v.g,v.b]});for(let C=0;C<14;C++)o.tri(B,B+1+(C+1)%14,B+1+C)}for(const l of[-1,1])for(let c=0;c<9;c++){const g=(c+.5)/9,D=u(t(3,4.6)),B=b(),C=l*p,y=o.v({position:[C,k,0],aC:[C,k,B,0],aH:[g,-40],color:[v.r,v.g,v.b]});for(let f=0;f<14;f++)o.v({position:[C+Math.cos(f/14*6.2832)*D,k,0],aC:[C,k,B,0],aH:[g,-40+Math.sin(f/14*6.2832)*D],color:[v.r,v.g,v.b]});for(let f=0;f<14;f++)o.tri(y,y+1+(f+1)%14,y+1+f)}}const s=ca?.72:1;P(1,[[z(1,2),28*s,7.5],[z(-9*A,2),22.5*s,5],[z(10*A,2),25.5*s,5.5]],7.6,w(.36),0),P(2,[[z(-15*A,2),19*s,5.2],[z(17*A,2),21.5*s,4.6],[z(4,2),17.5*s,6]],7.6,w(.24),40),P(3,[[z(-21,2),14*s,4.4],[z(-8,2),16.2*s,4.2],[z(9,2),14.8*s,4.6],[z(22,2),13.2*s,4]],7.6,w(.12),80);{const h=w(.04),p=u(7.4);r(u(-25),u(25),p,u(9.4),4,120,h);for(let M=u(-25);M<=u(25);M+=u(t(2.4,4.2))){const i=u(t(2,3.8)),v=u(t(8.4,9.4))*(1-0*M);n(M-m*.8,v+m*.5,i,4,108,x),n(M,v,i,4,120,h)}for(const M of[-1,1])n(M*u(25),u(8.6),u(1.8),4,120,h)}if(Eo==="haboob"){const h=I==="night"?.5:0,p=i=>q(i,e.violet,h);[[9.5,p(q(e.terra,e.paper,.38)),420],[6.8,p(e.terra),560],[4,p(q(e.terra,e.cocoa,.42)),700]].forEach(([i,v,k],W)=>{r(u(-44),u(44),u(-1.2),u(i-1),5+W,k,v);for(let S=u(-44);S<=u(44);S+=u(t(2.4,3.8))){const l=u(t(1.9,3.1)),c=u(i-1)+t(-.2,.5)*l;n(S-m*1.2,c+m*.8,l,5+W,k-12,x),n(S,c,l,5+W,k,v)}})}Z(o.geo(),Q(`
      attribute vec4 aC; attribute vec2 aH; attribute vec3 color;
      uniform vec3 uCamL, uDir, uFlashInk; uniform float uTime, uDC, uAnvil, uFlash, uLit, uBaseY;
      varying vec3 vC;
      void main(){
        float L = aC.w;
        vec2 p = position.xy;
        float boil = aC.z >= 0. ? 1. + (L > 4.5 ? .10 : .05) * sin(uTime * (L > 4.5 ? .9 : .32) + aC.z * 6.2832) : 1.;
        p = aC.xy + (p - aC.xy) * boil;
        if (L > .5 && L < 4.5) p.y = max(p.y, uBaseY);
        p.x += (L > 4.5 ? 60. : 26.) * sin(uTime * .045 + L * 1.9) + (L > 4.5 ? uTime * 14. * (L - 5.5) : 0.);
        float depth = uDC * (1. - aH.x * (.55 + .5 * uAnvil)) - aH.y;
        vec3 right = vec3(-uDir.z, 0., uDir.x);
        vec3 pos = vec3(uCamL.x, 0., uCamL.z) + uDir * depth + right * p.x + vec3(0., p.y, 0.);
        vC = color + (uFlashInk - color) * uFlash * uLit * (L > .5 && L < 3.5 ? .55 : .12);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
      }`,`
      varying vec3 vC;
      void main(){ gl_FragColor = vec4(vC, 1.); }`,{uDir:Ao,uDC:To,uBaseY:u(7.4),uFlashInk:e.paper,uLit:I==="night"?1:.3},{fog:!1,side:F.DoubleSide}),-.5)}await O.yield();const la=`
    uniform vec3 uCamL, uDir; uniform float uDC;
    vec3 cellPos(vec2 p, float toward){ vec3 right = vec3(-uDir.z, 0., uDir.x); return vec3(uCamL.x, 0., uCamL.z) + uDir * (uDC - toward) + right * p.x + vec3(0., p.y, 0.); }`;{const o=new to({position:3,aK:4,aE:2}),a=(d,w,x,m,P,z,A)=>{const s=[[d,x,-1],[w,x,1],[w,m,1],[d,m,-1]].map(h=>o.v({position:[h[0],h[1],P],aK:z,aE:[h[2],A]}));o.quad(s[0],s[1],s[2],s[3])},n=t(.34,.5),r=u(7.5);a(u(-26),u(19),u(-.8),r,140,[n,.85,.5,u(1.25)],.52),a(u(-19),u(13),u(-.8),r,155,[n*1.12,1.3,.95,u(.95)],.2),Z(o.geo(),Q(la+`
      attribute vec4 aK; attribute vec2 aE; varying vec2 vA; varying vec4 vK; varying vec2 vE;
      void main(){ vA = position.xy; vK = aK; vE = aE; gl_Position = projectionMatrix * modelViewMatrix * vec4(cellPos(position.xy, position.z), 1.); }`,`
      uniform vec3 uInkA, uInkB; uniform float uTime, uStop;
      varying vec2 vA; varying vec4 vK; varying vec2 vE;
      void main(){
        float c = (vA.x + vA.y * vK.x) / vK.w;
        float id = floor(c), f = abs(fract(c) - .5) * 2.;
        float w = fwidth(c) * 2.;
        float line = 1. - smoothstep(.36 - w, .36 + w, f);
        float h1 = fract(sin(id * 12.9898) * 43758.5453), h2 = fract(h1 * 17.31);
        float l = vA.y / (vK.w * 4.2) + uTime * vK.y + h1 * 9.;
        float lw = min(fwidth(vA.y) / (vK.w * 4.2) * 2., .3);
        float g = abs(fract(l) - .5) * 2.;
        float dash = smoothstep(.26 - lw, .26 + lw, g);
        float on = step(h2, vK.z * (1.2 - vE.x * vE.x * 1.1)) * step(uStop * (.45 + h2), vA.y);
        float a = line * dash * on;
        gl_FragColor = vec4(mix(uInkA, uInkB, vE.y), a);
      }`,{uDir:Ao,uDC:To,uInkA:q(e.violet,e.cocoa,.15),uInkB:I==="night"?e.skyBot:e.paper,uStop:Eo==="virga"?u(3.2):-1e6},{fog:!1,transparent:!0,side:F.DoubleSide}),1)}const yo=4;{const o=new to({position:3,aO:3});for(let a=0;a<yo;a++){const n=(x,m,P,z,A,s)=>{let h=x,p=m;for(let M=0;M<A;M++){const i=m+(P-m)*(M+1)/A,v=x+s*(M+1)+(M%2?1:-1)*t(.5,1.5)*u(.75)*(M===A-1?.3:1),k=v-h,W=i-p,S=Math.hypot(k,W)||1,l=-W/S*z,c=k/S*z,g=k/S*z*.6,D=W/S*z*.6,B=1-.5*M/A;for(const[C,y]of[[196,2],[210,1]]){const f=[[h-g*y,p-D*y,1],[v+g*y,i+D*y,1],[v+g*y,i+D*y,-1],[h-g*y,p-D*y,-1]].map(j=>o.v({position:[j[0],j[1],C],aO:[l*j[2]*B*y,c*j[2]*B*y,a]}));o.quad(f[0],f[1],f[2],f[3])}h=v,p=i}return[h,p]},r=u(t(-13,9)),d=u(t(12.5,15)),w=n(r,d,u(4.2),u(.36),6,u(t(-.4,.4)));n(w[0],w[1],u(-.3),u(.27),4,u(t(-.6,.6))),n(w[0],w[1],u(t(1.2,2.2)),u(.17),3,u(t(.7,1.3))*b.sign())}Z(o.geo(),Q(la+`
      attribute vec3 aO; uniform float uFlash, uBolt; varying float vOut;
      void main(){
        vOut = step(position.z, 203.);
        float on = abs(aO.z - uBolt) < .5 ? uFlash : 0.;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(cellPos(position.xy + aO.xy * (.35 + .65 * on) * step(.001, on), position.z), 1.);
      }`,`
      uniform vec3 uInk, uInk2; varying float vOut;
      void main(){ gl_FragColor = vec4(mix(uInk, uInk2, step(.5, vOut)), 1.); }`,{uDir:Ao,uDC:To,uInk:e.cream,uInk2:q(e.violet,e.cocoa,.25)},{fog:!1,side:F.DoubleSide}),2)}let Wa=null;{const o=new to({position:3,aK:4});[[9,2.3,.066],[22,1.7,.052],[50,1.2,.042]].forEach(([a,n,r],d)=>{const x=o.n;for(let m=0;m<=28;m++){const P=m/28*Math.PI*2;for(const z of[-1.1,1.3])o.v({position:[Math.sin(P)*a,z*a,Math.cos(P)*a],aK:[P*a,n,r*a,d]})}for(let m=0;m<28;m++){const P=x+m*2;o.quad(P,P+2,P+3,P+1)}}),Wa=Z(o.geo(),Q(`
      attribute vec4 aK; uniform vec3 uCamL; uniform float uCamY; varying vec2 vA; varying vec3 vK;
      void main(){ vec3 p = position + vec3(uCamL.x, uCamY, uCamL.z); vA = vec2(aK.x, p.y); vK = aK.yzw;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }`,`
      uniform vec3 uInk; uniform float uTime, uRain;
      varying vec2 vA; varying vec3 vK;
      void main(){
        float c = (vA.x + vA.y * .36) / vK.y;
        float id = floor(c), f = abs(fract(c) - .5) * 2.;
        float w = fwidth(c) * 2.;
        float line = 1. - smoothstep(.085 - w, .085 + w, f);
        float h1 = fract(sin(id * 12.9898 + vK.z * 3.7) * 43758.5453), h2 = fract(h1 * 17.31);
        float per = vK.y * 6.;
        float l = vA.y / per + uTime * vK.x + h1 * 9.;
        float lw = min(fwidth(vA.y) / per * 2., .3);
        float dash = smoothstep(.55 - lw, .55 + lw, abs(fract(l) - .5) * 2.);
        float a = line * dash * step(h2, uRain * (.55 + .2 * vK.z)) * step(.001, uRain) * .92;
        gl_FragColor = vec4(uInk, a);
      }`,{uInk:e.cream},{fog:!1,transparent:!0,side:F.DoubleSide}),6)}await O.yield();let Vo=null;if(L.sky!==!1){const o=new F.SphereGeometry(3400,40,20),a=[t(0,1),t(0,1),t(0,1),t(0,1),t(0,1),t(0,1)];Vo=Z(o,Q(`
      varying vec3 vD;
      void main(){ vD = mat3(modelMatrix) * position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,ro+`
      uniform vec3 uTop, uBot, uSunInk, uGL, uGSh, uR1, uR2; uniform float uGroundY; uniform vec3 uRp, uRq;
      varying vec3 vD;
      float tri(float x){ return abs(fract(x) - .5) * 2.; }
      void main(){
        vec3 d = normalize(vD + vec3(0., 1e-6, 0.));
        float hl = max(length(d.xz), 1e-4), el = d.y / hl;
        vec2 n = d.xz / hl;
        vec3 c = mix(uBot, uTop, smoothstep(.0, .62, el));               // the only gradient in the world
        c = mix(c, uSunInk, aastep(.99915, dot(d, uSun)));
        float r2 = .020 + .034 * (.5 * tri(n.x * 2.3 + uRp.x) + .32 * tri(n.y * 4.1 + uRp.y) + .18 * tri((n.x + n.y) * 7.7 + uRp.z));
        float r1 = .007 + .030 * (.55 * tri(n.y * 1.7 + uRq.x) + .3 * tri(n.x * 3.3 + uRq.y) + .15 * tri((n.x - n.y) * 6.1 + uRq.z));
        c = mix(c, uR2, 1. - aastep(r2, el));
        c = mix(c, uR1, 1. - aastep(r1, el));
        float t = (cameraPosition.y - uGroundY) / max(-d.y, 1e-4);
        vec2 gp = cameraPosition.xz + d.xz * min(t, 60000.);
        float sh = cellShade(gp);
        c = mix(c, mix(uGL, uGSh, sh), 1. - aastep(0., el));
        gl_FragColor = vec4(c, 1.);
      }`,{uTop:e.skyTop,uBot:e.skyBot,uSunInk:e.sun,uGL:e.groundL,uGSh:e.groundSh,uR1:q(q(e.violet,e.terra,.3),e.skyBot,.42),uR2:q(q(e.violet,e.turq,.25),e.skyBot,.64),uGroundY:V,uRp:new F.Vector3(a[0],a[1],a[2]),uRq:new F.Vector3(a[3],a[4],a[5])},{fog:!1,side:F.BackSide,depthWrite:!1}),-.9)}const Da=L.uPass??.69,qa=L.uSpeed??480;let ua=!1,va=!1,Co=-1,fa=0,No=0,jo=-1,da=0;const oo=new F.Vector3,Bo=new F.Vector3,Ro=new F.Quaternion,ma=o=>o<=0?0:o<.1?o/.1*(o/.1)*(3-2*o/.1):o<.35?1:o<.75?1-((o-.35)/.4)**2:0,Yo=t(6.2,8),Ta=L.lightning!==!1,ha=o=>{const a=Math.sin(o*127.1+Lo*11.7)*43758.5453;return a-Math.floor(a)},Po={object:eo,radius:8,height:6,center:new F.Vector3(0,2,0),ground:!1,groundY:0,wash:{halfWidth:fo,bankHeight:V,zMin:uo,zMax:Mo,centerX:Do,profile:Sa,bankDist:(o,a)=>Math.min(o-So(a),Fo(a)-o),cut:qo},serigraph:{glsl:ro,inks:e,T1:xa,T2:ya},uniforms:K,stats:{triangles:Math.round(Ho),drawCalls:eo.children.length},setFrontZ(o){K.uFront.value=Math.max(uo+12,Math.min(Mo-6,o))},setProgress(o){Po.setFrontZ(qa*(o-Da))},setRain(o){K.uRain.value=Math.max(0,Math.min(1,o))},setAnvil(o){K.uAnvil.value=Math.max(0,Math.min(1,o))},setSun(o){K.uSun.value.copy(o).normalize(),ua=!0},setShadow(o,a,n,r=1){const d=Math.hypot(o,a)||1;K.uShadow.value.set(o/d,a/d,n/d,r),va=!0},strike(){Co=fa,No=(No+1)%yo},setShadowB(o,a,n,r=1){const d=Math.hypot(o,a)||1;K.uShadowB.value.set(o/d,a/d,n/d,r)},setBolt(o,a=0){jo=o,da=(a%yo+yo)%yo},update(o,a,n){if(fa=a,K.uTime.value=a,eo.updateWorldMatrix(!0,!1),n&&(oo.setFromMatrixPosition(n.matrixWorld),eo.worldToLocal(oo),K.uCamL.value.copy(oo),K.uCamY.value=oo.y,Vo&&Vo.position.copy(oo)),ua||(eo.getWorldQuaternion(Ro),K.uSun.value.copy(J).applyQuaternion(Ro).normalize()),!va){eo.getWorldQuaternion(Ro),oo.set(-.5,0,-.866).applyQuaternion(Ro),Bo.set(0,0,9),eo.localToWorld(Bo);const w=Math.hypot(oo.x,oo.z)||1;K.uShadow.value.set(oo.x/w,oo.z/w,-(oo.x*Bo.x+oo.z*Bo.z)/w,1)}let r=0,d=0;if(Ta){const w=Math.floor(a/Yo),x=w*Yo+.6+ha(w)*(Yo-4.2);r=ma(a-x),d=Math.floor(ha(w+.5)*yo)%yo}if(Co>=0){const w=ma(a-Co+.001);w>r&&(r=w,d=No),a-Co>.8&&(Co=-1)}jo>r&&(r=Math.min(1,jo),d=da),K.uFlash.value=r,K.uBolt.value=d},dispose(){for(const o of na)o.dispose()}};Po.setFrontZ(L.frontZ??0);const no=(o,a,n)=>new F.Vector3(Do(n)+o,a,n);return Po.anchors={flyThrough:[no(-30,V+1.6,96),no(-17.5,V+1.6,69),no(-12,1.6,57),no(-1,1.6,36),no(10,1.6,15),no(17.5,V+1.6,2),no(27,V+1.6,-20)],viewpoints:{headOn:no(-4,2.6,46),bankPass:no(25,V+1.8,8),behind:no(-22,V+3.5,-34)},frontCenter:new F.Vector3(0,mo+1.2*N,K.uFront.value),cellDir:Ao.clone(),sunDir:J.clone(),washDir:new F.Vector3(0,0,1),portalSeat:{position:no(64,V+5,-150),facing:new F.Vector3(-.3,0,.954).normalize()}},Po.update(0,0,null),Po}export{ro as SERI_GLSL,Ga as buildHero};
