import*as t from"three";import{mergeGeometries as pe}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as Z,lerp as O,smoothstep as H}from"../kit/core.js";import{GLSL_HASH as Q,GLSL_VALUE_NOISE as ne,GLSL_FBM as ue,GLSL_FOG_PARS_VERT as J,GLSL_FOG_VERT as ee,GLSL_FOG_PARS_FRAG as te}from"../kit/fx.js";const ye=Math.PI*2,re=Math.PI/180,Ve=["#04080B","#0E2A33","#7FD6E8","#EAF6FF","#5BE6B4","#FFB45A","#C8324A"],fe=150,Re=300,ft=10,Te=410,K=60,E=[320,215,110],Ge=40.5,I=-129,be=1,Oe=[[.1,.27,7.6],[.24,.36,4.4],[.49,.6,1.4],[.62,.8,1],[.8,1,.6]];function Se(e){let l=0;for(const s of Oe)l+=s[2]*H(s[0],s[1],e);return l}const He=[[.103,1],[.245,.7],[.495,.75],[.545,.6],[.625,.5],[.71,.4],[.805,.4],[.9,.3]];function Be(e,l,s,c,f){let r=0;for(const i of He){const d=(e-i[0])*l;d>0&&(r+=i[1]*Math.exp(-d*c)*Math.sin(d*s*ye+f))}return r}const de=[.162,.49],_e=e=>{const l=Z((e-de[0])/(de[1]-de[0]),0,1);return l*(.55+.45*l)*(1+.5*(1-l)*l)},Pe=[[.3,.47],[.37,.52],[.41,.56]],U=`
uniform float uBulb, uWarm, uDiode, uDoor, uTime;
uniform vec3 uBulbPos, uDiodePos, uOrigin, uBulbCol, uWarmCol, uDiodeCol, uShadowCol, uDarkCol, uGreenCol;
uniform vec4 uBar;   // x: spread of the bar per metre of depth, y: peel-front height (local), z: ambient lift, w: slot open 0..1
uniform vec4 uKey;   // x: share of the bulb's light that leaks toward the door, y: ambient gain, z: top light in the shade, w: bar haze gain
uniform vec4 uDark;  // x: the hairline of kitchen light that leaks round the seal before the bulb, y: the held picture's backlight 0..1, z: the dark's own ambient
const vec3 LC_KITCHEN = vec3(-0.3015, 0.1005, -0.9482);
// the ribbed housing throws the bulb's light back into the box: 1 on the terraces and the back plate, uKey.x on the door
float lcHood(vec3 Pw){
  vec3 d = Pw - uBulbPos; float l = max(length(d), 1.);
  return mix(uKey.x, 1., smoothstep(-.44, .04, d.z/l));
}
float lcDoorPlane(float x){ return -(150. - x)*(sin(uDoor)/max(cos(uDoor), .2)); }
// 1 inside the wedge of kitchen light (P in hero-local metres)
float lcBar(vec3 P){
  vec2 E = vec2(150. - 300.*cos(uDoor), -300.*sin(uDoor));
  float dz = P.z - E.y;
  float edge = E.x + dz*uBar.x;
  float soft = 4. + max(dz, 0.)*.06;
  float m = 1. - smoothstep(edge - soft, edge + soft, P.x);
  m *= smoothstep(uBar.y - 10., uBar.y + 6., P.y);
  m *= smoothstep(-2., 4., P.z - lcDoorPlane(P.x));
  return m*uBar.w;
}
// 1 on the kitchen side of the door
float lcOutside(vec3 P){ return smoothstep(2., 10., lcDoorPlane(P.x) - 4. - P.z)*uBar.w; }
float lcBulbAtt(float d){ return 1.35/(1.35 + d*d/(200.*200.)); }
// a surface's own light held under the bloom pass: below six tenths of the ceiling nothing changes, above it the luminance
// bends over and never reaches the ceiling; the hue is kept. (The ceiling used is .9: nine tenths of the lowest bloom
// threshold of the three looks, 1.0, so a body shaded through this never feeds the bloom; glints are added after it.)
vec3 lcCap(vec3 c, float cap){
  float l = dot(c, vec3(.2126, .7152, .0722)), k = cap*.6, w = max(cap - k, 1e-3);
  float m = k + w*(1. - exp(-max(l - k, 0.)/w));
  return l > k ? c*(m/max(l, 1e-4)) : c;
}
// the look's shade as a shadow shows it: at its root (the design's deep teal at midnight, three stops under lit ice) and at
// its tip (blue, two stops under)
vec3 lcShadeRoot(){ return uShadowCol*(uKey.y*1.8); }
vec3 lcShadeTip(){ return uShadowCol*(uKey.y*1.3) + uBulbCol*vec3(.045, .105, .17); }
// before the bulb a hairline of kitchen light leaks round the door's seal: how much of it reaches P (hero-local)
float lcLeak(vec3 P){
  float z = max(P.z, 0.);
  return exp(-length(vec2(P.x + 146., z))/56.) + .45*exp(-length(vec2(P.y - 404., z))/46.) + .3*exp(-length(vec2(P.y - 16., z))/46.);
}
// a liquid's hue as the dark shows it: cyan goes cobalt, ruby magenta, milk a pale mint; the rest keep their colour, deepened
vec3 lcDarkHue(vec3 liq, float milk){
  float mx = max(liq.r, max(liq.g, liq.b)), mn = min(liq.r, min(liq.g, liq.b));
  vec3 h = (liq - mn*.8)/max(mx - mn*.8, .05);
  h = mix(h, vec3(.08, .3, 1.), step(liq.r, .5)*step(liq.g, liq.b));
  h = mix(h, vec3(1., .1, .52), step(.6, liq.r)*step(liq.g, .3));
  return mix(h, vec3(.62, 1., .86), milk);
}
// bulb light that has come through the glass on the terraces: long pools of lime, amber, cyan and (rarely) ruby on
// whatever lies beyond, rippling like light through liquid. Returns a tint for the bulb's light (white outside the pools).
vec3 lcThrown(vec3 Pw){
  vec3 d = Pw - uBulbPos; float l = max(length(d), 1.);
  float el = -d.y/l;
  float az = atan(d.z, d.x + (abs(d.x) + abs(d.z) < 1e-3 ? 1e-3 : 0.));
  float gate = smoothstep(.07, .2, el)*(1. - smoothstep(.8, .96, el))*smoothstep(60., 150., l);
  vec3 acc = vec3(0.); float cov = 0.;
  for (int k = 0; k < 2; k++) {
    float fk = float(k), w = .2 + .09*fk, c = az/w + fk*3.37;
    float id = floor(c), f = fract(c) - .5, h = hash11(id*1.73 + fk*17.1 + 4.2), h2 = hash11(id*3.19 + fk*5.3 + 9.7);
    float wd = .3 + .2*h2, off = (h2 - .5)*.2;
    float m = (1. - smoothstep(wd*.2, wd, abs(f - off)))*step(.36, h);
    m *= .62 + .38*sin(el*(26. + 20.*h2) + az*9. + uTime*(.35 + .5*h) + h*40.);          // the liquid's ripple
    m *= smoothstep(.0, .12, el - .06 - .2*h2*fk);
    vec3 tc = h < .56 ? vec3(.36, 1., .1) : (h < .76 ? vec3(1., .42, .03) : (h < .92 ? vec3(.03, .68, 1.) : vec3(.3, .9, .95)));
    acc += tc*m; cov += m;
  }
  cov = min(cov, 1.);
  return mix(vec3(1.), acc/max(cov, 1e-3)*1.3, cov*gate);
}
vec3 lcShade(vec3 Pw, vec3 N, vec3 V, vec3 alb, float gloss, float specAmt){
  vec3 P = Pw - uOrigin;
  vec3 Lb = uBulbPos - Pw; float d = max(length(Lb), 1.); Lb /= d;
  float nl = dot(N, Lb), hood = lcHood(Pw), att = lcBulbAtt(d);
  float wrap = clamp(nl*.8 + .2, 0., 1.);
  vec3 Hb = normalize(Lb + V + vec3(0., 1e-3, 0.));
  float sp = pow(max(dot(N, Hb), 0.), gloss)*specAmt*smoothstep(-.1, .2, nl);
  vec3 thr = lcThrown(Pw);
  vec3 col = alb*uBulbCol*thr*(wrap*wrap*att*hood*1.5*uBulb) + uBulbCol*thr*(sp*att*(.3 + .7*hood)*uBulb);
  // in the shade: teal ambient with a bounce off the lit back of the box, and a little light from above on every ledge
  col += alb*mix(uDarkCol*.5, uShadowCol*uKey.y, uBulb)*clamp(.58 + .3*N.y + .22*N.z, .3, 1.);
  // the tray of fog on the floor glows: a dim teal lift on whatever stands low in the canyon, so mist never ends against black
  col += alb*uBulbCol*vec3(.42, .78, .9)*(uBulb*.17*exp(-max(P.y, 0.)/105.)*(.75 - .25*N.y));
  // across the canyon the burning shelf lips and the falls light the door: a green-white glow on what faces them and on every underside
  col += alb*mix(uGreenCol, uBulbCol, .45)*(uBulb*.24*smoothstep(75., 45., P.z)*clamp(.3 + .5*N.z - .4*N.y, 0., 1.));
  // kitchen light spills in through the slot: a soft glow on whatever faces the opening, brightest beside it and
  // gone a shelf's depth into the box, so enamel there is white washed with amber and falls away to teal
  vec3 toS = vec3(-146. - P.x, 0., -24. - P.z); float dS = max(length(toS), 1.);
  float spill = clamp(dot(N, toS)/dS*.75 + .25, 0., 1.)/(1. + dS*dS/(64.*64.));
  col += alb*uWarmCol*(uWarm*uBar.w*.45*(1. - hood)*spill);
  col += alb*uBulbCol*(uBulb*att*(1. - hood)*uKey.z*smoothstep(.2, .85, N.y));
  float nk = clamp(dot(N, LC_KITCHEN)*.8 + .2, 0., 1.);
  col += alb*uWarmCol*(uWarm*nk*(lcBar(P)*1.05 + lcOutside(P)*.55));
  vec3 Ld = uDiodePos - Pw; float dd = max(length(Ld), 1.); Ld /= dd;
  vec3 Hd = normalize(Ld + V + vec3(0., 1e-3, 0.));
  col += uDiodeCol*(uDiode*(1. - .6*uBulb))*(pow(max(dot(N, Hd), 0.), gloss*1.4)*min(specAmt, 1.3)*2.2 + alb.g*max(dot(N, Ld), 0.)*.012);
  // before the bulb the dark has depth: a dim pool of the diode's green on whatever faces it, a breath of cobalt in every
  // shadow, and the seal's hairline of kitchen light lying warm on what stands by the door
  float dk = (1. - uBulb)*uDark.z;
  col += alb*(dk*(vec3(.011, .021, .05)*clamp(.7 + .3*N.y, 0., 1.) + uDiodeCol*(uDiode*.09*clamp(dot(N, Ld)*.75 + .25, 0., 1.)/(1. + dd*dd/(160.*160.)))));
  col += alb*uWarmCol*(uDark.x*lcLeak(P)*clamp(dot(N, toS)/dS*.6 + .4, 0., 1.)*.55);
  return col;
}
`,ge=`
float lcBn(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(hash12(i), hash12(i + vec2(1., 0.)), f.x), mix(hash12(i + vec2(0., 1.)), hash12(i + vec2(1., 1.)), f.x), f.y);
}
// small lenses, not dots: they gather in patches, come in every size, a few run; each is clear with a dark lower edge
// (shade) and one point of light (highlight)
vec3 lcBeads(vec2 uv, float density, float t, float aa){
  float col = floor(uv.x);
  float run = step(hash11(col*7.31 + 3.), .1);
  uv.y += run*t*(.25 + .5*hash11(col*3.7 + 11.));
  vec2 id = floor(uv), f = fract(uv) - .5;
  vec2 rnd = hash22(id + 17.3);
  float clump = smoothstep(.36, .7, lcBn(id*.19 + 3.7)*.62 + lcBn(id*.061 + 9.1)*.38);
  float on = step(hash12(id*1.37 + 5.1), density*(.1 + 1.6*clump) + run*.25)*(1. - smoothstep(.12, .3, aa));
  float r = mix(.06, .44, rnd.x*rnd.x*rnd.x)*(1. + run*.35);
  vec2 q = f - (rnd - .5)*(.9 - 1.8*r); q.y *= 1. - run*.3;
  float d = length(q);
  aa = clamp(aa, 1e-3, .2);
  float m = (1. - smoothstep(r - aa, r + aa, d))*on;
  float hl = (1. - smoothstep(0., r*.26 + aa, length(q - vec2(-.3, .32)*r)))*m;
  float sh = smoothstep(-r*.3, r*.9, -q.y)*smoothstep(r*.35, r, d)*m;
  return vec3(m, hl, sh);
}
`,ze=`
float lcFoot(vec3 P){ return (1. - smoothstep(-100., -50., P.x))*(1. - smoothstep(125., 162.5, P.y)); }
float lcRoll(vec2 q, float t){
  vec2 w = q + .35*vec2(vnoise(q*.7 + vec2(0., t*.21)), vnoise(q*.7 + vec2(5.2, -t*.17)));
  float n = vnoise(w + vec2(t*.13, -t*.31))*.65 + vnoise(w*2.1 + vec2(-t*.22, -t*.47) + 3.7)*.35;
  return smoothstep(0., .7, abs(2.*n - 1.));
}
`,ke=new t.Color;function xe(e,l,s=0,c=null){const f=e.attributes.position.count,r=new Float32Array(f*3),i=new Float32Array(f),d=e.attributes.position,x=l.isColor?l:ke.set(l);for(let P=0;P<f;P++){const h=c?c(d.getX(P),d.getY(P),d.getZ(P)):1;r[P*3]=x.r*h,r[P*3+1]=x.g*h,r[P*3+2]=x.b*h,i[P]=s}return e.setAttribute("color",new t.BufferAttribute(r,3)),e.setAttribute("aMat",new t.BufferAttribute(i,1)),e.attributes.uv&&e.deleteAttribute("uv"),e}function M(e,l,s,c,f,r,i,d=1){const x=2*d+1,P=new t.BoxGeometry(2,2,2,x,x,x),h=P.attributes.position,A=P.attributes.normal,C=[c/2,f/2,r/2],o=Math.min(i,C[0]*.98,C[1]*.98,C[2]*.98),a=[0,0,0],z=[0,0,0];for(let b=0;b<h.count;b++){a[0]=h.getX(b),a[1]=h.getY(b),a[2]=h.getZ(b);let q=0;for(let S=0;S<3;S++){const L=Math.round((a[S]+1)*.5*x),D=L<=d?-1:1,F=L<=d?L:x-L,V=F>=d?0:Math.tan((1-F/d)*Math.PI/4);a[S]=D*(C[S]-o),z[S]=D*V,q+=z[S]*z[S]}q=Math.sqrt(q)||1;const y=z[0]/q,w=z[1]/q,k=z[2]/q;h.setXYZ(b,e+a[0]+y*o,l+a[1]+w*o,s+a[2]+k*o),A.setXYZ(b,y,w,k)}return P}function $e(e,l,s=6,c=!1,f=.3){const r=new t.CatmullRomCurve3(e.map(i=>new t.Vector3(i[0],i[1],i[2])),c,"catmullrom",f);return new t.TubeGeometry(r,Math.max(4,Math.round(r.getLength()/(l*2.2))),l,s,c)}function Me(e){const l=[];for(let c=0;c<e.length-1;c++){const f=e[c],r=e[c+1],i=r[2]||1;for(let d=0;d<i;d++){const x=d/i,P=x*x*(3-2*x);l.push(new t.Vector2(Math.max(O(f[1],r[1],P),1e-4),O(f[0],r[0],x)))}}const s=e[e.length-1];return l.push(new t.Vector2(Math.max(s[1],1e-4),s[0])),l}function ie(e,l,s,c=6){const f=new t.Vector3(l[0]-e[0],l[1]-e[1],l[2]-e[2]),r=f.length(),i=new t.CylinderGeometry(s,s,r,c,1,!0);return i.applyQuaternion(new t.Quaternion().setFromUnitVectors(new t.Vector3(0,1,0),f.normalize())),i.translate((e[0]+l[0])/2,(e[1]+l[1])/2,(e[2]+l[2])/2),i}function me(e,l,s,c){const f=new t.IcosahedronGeometry(c,1);return f.translate(e,l,s),f.index||f.setIndex([...Array(f.attributes.position.count).keys()]),f}const Ce={milk:{capY:.946,crimp:0,knots:[[0,0,2],[0,.78,2],[.03,1,2],[.5,1,4],[.58,.98,4],[.74,.5,3],[.9,.47,2],[.925,.56,1],[.945,.56,1],[.946,.58,1],[.962,.6,2],[.992,.55,2],[1,0,1]]},swing:{capY:.925,crimp:0,knots:[[0,0,2],[0,.8,2],[.03,1,2],[.42,1,5],[.72,.4,3],[.88,.36,2],[.9,.46,1],[.924,.46,1],[.925,.5,2],[.955,.52,2],[.99,.34,2],[1,0,1]]},soda:{capY:.955,crimp:.09,knots:[[0,0,2],[0,.74,2],[.035,.96,3],[.16,1,3],[.36,.8,3],[.54,1,4],[.8,.36,3],[.93,.33,1],[.945,.41,1],[.954,.41,1],[.955,.47,1],[.985,.45,2],[1,.36,1],[1,0,1]]},sauce:{capY:.875,crimp:.03,knots:[[0,0,2],[0,.82,2],[.03,1,2],[.56,1,3],[.66,.62,3],[.86,.5,1],[.874,.56,1],[.875,.63,1],[.98,.63,2],[1,.55,1],[1,0,1]]},carafe:{capY:.9,crimp:0,knots:[[0,0,2],[0,.7,2],[.04,.96,3],[.3,1,5],[.72,.5,3],[.86,.47,2],[.899,.62,1],[.9,.67,1],[.97,.67,2],[1,.58,1],[1,0,1]]},jam:{capY:.86,crimp:.02,knots:[[0,0,2],[0,.84,2],[.04,1,2],[.64,1,3],[.76,.9,2],[.8,.82,1],[.859,.82,1],[.86,.9,1],[.975,.9,2],[1,.82,1],[1,0,1]]},jamopen:{capY:2,crimp:0,knots:[[0,0,2],[0,.84,2],[.04,1,2],[.7,1,3],[.82,.9,2],[.88,.82,1],[.96,.82,2],[1,.86,1],[.985,.79,1]]},pickle:{capY:.9,crimp:.025,knots:[[0,0,2],[0,.84,2],[.03,1,2],[.76,1,3],[.85,.8,2],[.899,.78,1],[.9,.86,1],[.985,.86,2],[1,.78,1],[1,0,1]]},honey:{capY:.84,crimp:0,knots:[[0,0,2],[0,.6,2],[.05,.8,2],[.4,1,4],[.72,.8,3],[.8,.6,2],[.839,.6,1],[.84,.68,1],[.965,.68,2],[1,.58,1],[1,0,1]]},tumbler:{capY:2,crimp:0,knots:[[0,0,2],[0,.7,2],[.03,.8,2],[.97,1,4],[1,.985,1],[.99,.93,1]]},cloche:{capY:2,crimp:0,knots:[[0,1,1],[.3,1,2],[.55,.9,2],[.75,.66,2],[.87,.38,2],[.92,.12,1],[.925,.1,1],[.96,.17,2],[.99,.12,1],[1,0,1]]},bowl:{capY:2,crimp:0,knots:[[0,0,2],[0,.42,2],[.07,.5,2],[.5,.86,4],[.96,1,3],[1,.985,1],[.97,.94,1]]},champagne:{capY:.86,crimp:0,knots:[[0,0,2],[0,.8,2],[.03,1,2],[.46,1,5],[.74,.36,3],[.859,.33,1],[.86,.4,2],[.93,.43,2],[.985,.5,1],[1,.44,1],[1,0,1]]}};function Ee(e,l){const s=new t.LatheGeometry(Me(e.knots),l),c=s.attributes.position,f=new Float32Array(c.count);for(let r=0;r<c.count;r++){const i=c.getY(r);if(i>=e.capY-1e-5&&(f[r]=1,e.crimp&&i<.992)){const d=c.getX(r),x=c.getZ(r),P=Math.atan2(x,d),h=1+e.crimp*Math.cos(P*l*.5);c.setXYZ(r,d*h,i,x*h)}}return s.setAttribute("aPart",new t.BufferAttribute(f,1)),s.deleteAttribute("uv"),s}function Ke(e){const l=[{p:"milk",R:[11.5,13.5],H:[62,80],fill:[.5,.7],fizz:0,liq:[[.86,.9,.9,1]],cap:[[.55,.68,.78],[.82,.62,.3],[.7,.74,.76]]},{p:"swing",R:[9.5,11.5],H:[76,90],fill:[.52,.68],fizz:0,liq:[[.62,.86,.3,.15],[.98,.6,.16,.05]],cap:[[.8,.82,.8]]},{p:"soda",R:[9,10.5],H:[70,86],fill:[.6,.78],fizz:1,liq:[[.2,.78,.92,0]],cap:[[.7,.76,.78],[.3,.72,.56]]},{p:"sauce",R:[8.5,10.5],H:[60,74],fill:[.38,.62],fizz:0,liq:[[.8,.33,.05,.25]],cap:[[.78,.8,.8],[.2,.5,.55]]},{p:"carafe",R:[13,15.5],H:[64,82],fill:[.42,.66],fizz:0,liq:[[1,.62,.16,.1],[.7,.88,.36,.2],[.86,.9,.9,1]],cap:[[.74,.8,.82]]}];return e==="party"&&(l[3]={p:"champagne",R:[11,12.5],H:[82,90],fill:[.6,.72],fizz:1,liq:[[.98,.8,.36,0]],cap:[[.86,.66,.28]]}),e==="morning"&&(l[1].liq=[[.62,.86,.3,.15],[1,.66,.2,.1]]),l}const Ae=[[.1,.34,.96,0],[1,.62,.16,.08],[.92,.13,.5,.04],[.56,.64,.12,.08],[.95,.1,.17,.03],[.62,.86,.3,.15]],Ie=[[.95,.1,.17,.03],[1,.62,.16,.08],[.1,.34,.96,0],[.56,.64,.12,.08]];function Ue(e,l,s,c,f){const r=Ke(l),i=[],d=l==="party"?[2,1,2,5,1]:l==="morning"?[4,2,2,1,3]:[3,2,3,2,2],x=()=>{let h=0;for(const C of d)h+=C;let A=e()*h;for(let C=0;C<5;C++)if(A-=d[C],A<=0)return C;return 0},P=[.7,.76,.86,1];for(let h=0;h<4;h++){const A=(h<3?s[h+1]-s[h]:Te-14-s[h])-9,C=h===be?c.bottleSpans:[[-118,118]];for(const o of C){const a=[];let z=o[0]+e.range(.5,2),b=x(),q=e.int(1,3);for(let L=0;L<40;L++){q--<=0&&(b=x(),q=e.int(1,3)),h===3&&z>16&&(b===0||b===3)&&(b=a.length%2?2:1);const D=r[b],F=e.range(D.R[0],D.R[1]);if(z+2*F>o[1]){if(o[1]-z>18.5){b=3-(l==="party"?1:0);const V=r[b],T=Math.min((o[1]-z)/2-.3,V.R[1]);T>=8.4&&a.push({ti:b,R:T})}break}a.push({ti:b,R:F}),z+=2*F+e.range(1.2,3.6)/Z(f,.7,1.3)}let y=0;for(const L of a)y+=2*L.R;const w=(o[1]-o[0]-y)/(a.length+1);let k=o[0];const S=a.map(L=>{const D=r[L.ti];return Math.min(e.range(D.H[0],D.H[1]),A)});if(h===0){S.sort((L,D)=>L-D);for(let L=0;L<S.length;L++)S[L]+=L%2*2.5}a.forEach((L,D)=>{const F=r[L.ti];k+=w+L.R;let V=e.pick(F.liq),T=e.range(F.fill[0],F.fill[1]);h===3&&k>16&&(V[3]>.9&&(V=F.liq[0]),T=Math.max(T,.64)),h<3&&V[3]>.9&&(V=Ae[(D*2+h*3+(k>0?1:0))%Ae.length]);const v=h===0&&D<4;v&&(V=Ie[D],T=Math.max(T,.8)),i.push({type:L.ti,profile:F.p,x:k,y:s[h]+.2,z:19+e.range(-1.5,1.5)+(16-L.R)*.25,R:L.R,H:S[D],fill:T,liq:V,cap:e.pick(F.cap),fizz:F.fizz,phase:e(),lit:P[h]*e.range(.9,1.1)*(v?2:h<3?1.25:1),rack:h}),k+=L.R})}}return i.push({type:3,profile:"sauce",x:I,y:s[0]+.2,z:23,R:6.4,H:55,fill:.84,liq:[.92,.13,.5,.04],cap:[.78,.8,.8],fizz:0,phase:.37,lit:1.6,rack:0}),i}async function je(e,l,s,c,f,r){const i=[],d=new t.Color(.76,.81,.84),x=new t.Color(.72,.79,.83),P=new t.Color(.7,.73,.74),h=new t.Color(.62,.7,.74),A=new t.Color(.8,.77,.72),C=new t.Color(.5,.68,.74),o=(v,m,N,n)=>i.push(xe(v,m,N,n)),a=(v,m,N)=>{let n=0;for(let g=0;g<4;g++){const p=s[g];if(m>p-1)continue;const W=m+(r[1]-m)*((35-N)/Math.max(r[2]-N,1));n=Math.max(n,H(p-14,p+6,W))}return n},z=[1,1,1];let b=0;const q=(v,m)=>{let N=0;z[0]=z[1]=z[2]=1;for(const n of f){const g=n.z/r[2],p=v+(r[0]-v)*g,W=m+(r[1]-m)*g;if(W<n.y-2||W>n.y+n.H+2)continue;const G=(W-n.y)/n.H,B=n.R*(G<.55?1:O(1,.42,H(.55,.78,G))),se=Math.abs(p-n.x),X=(1-H(B-2.5,B+2.5,se))*H(n.y-2,n.y+2,W)*(1-H(n.y+n.H-3,n.y+n.H+2,W));if(X>N){N=X;const we=Math.max(n.liq[0],n.liq[1],n.liq[2],.001),Le=G<n.fill?1:.25;for(let u=0;u<3;u++)z[u]=O(1,O(Math.pow(n.liq[u]/we,1.5),1,n.liq[3]),Le)}}return N},y=(v,m,N)=>{const n=a(v,m,N)*.9,g=q(v,m);b=g*(1-.5*n);let p=1;for(let G=0;G<4;G++)p*=1-.45*Math.exp(-Math.abs(m-s[G]+1.5)/4);const W=1-.3*Math.exp(-(122-Math.abs(v))/7);return O(1,.6,Math.max(n,g*.45))*p*W},w=(v,m,N)=>O(1,.5,a(v,m,Math.min(N,34))*.85);o(M(0,210,-19.5,Re,400,29,7,2),P,4),o(M(-128,222,-44,9,150,8,3.6,2),h,1),o(M(-128,160,-37,7,11,9,2,1),h,1),o(M(-128,284,-37,7,11,9,2,1),h,1),await e.yield?.();const k=new t.PlaneGeometry(246,358,60,110);k.translate(0,210,0),await e.yield?.();{const v=k.attributes.position;for(let m=0;m<v.count;m++){const N=v.getY(m),n=v.getX(m),g=((N-23)%26+26)%26,p=Math.exp(-((g-13)*(g-13))/5.5)*1.5*H(122,104,Math.abs(n));v.setZ(m,-.6+p+2.2*Math.exp(-(122-Math.abs(n))/4))}await e.yield?.(),k.computeVertexNormals()}{const v=k.attributes.position,m=new Float64Array(v.count),N=new Float32Array(v.count*3);for(let p=0;p<v.count;p++){(p&1023)===0&&await e.yield?.(),m[p]=y(v.getX(p),v.getY(p),v.getZ(p));for(let W=0;W<3;W++)N[p*3+W]=O(1,z[W]*1.7,b*.9)}let n=0;o(k,x,0,()=>m[n++]);const g=k.attributes.color;for(let p=0;p<v.count;p++)g.setXYZ(p,g.getX(p)*N[p*3],g.getY(p)*N[p*3+1],g.getZ(p)*N[p*3+2])}await e.yield?.();for(const v of[-1,1]){v>0?o(M(v*128,210,14.5,12,370,39,4.5,2),d,0,w):o(M(v*128,210,2,10,370,14,3.5,2),d,0,w),o(M(v*143.5,210,-4.4,9,388,2.2,.8,1),x,0);for(let m=0;m<4;m++)v>0?(o(M(v*121,s[m]-6,20,5,7,30,1.6,1),d,0,w),o(M(v*122.6,s[m]+46,22,2.4,3,20,1,1),x,0,w)):(o(M(v*119,s[m]-6.4,16,4.4,6.4,36,1.6,1),d,0,w),o(M(v*119,s[m]-13,5,4.4,9,12,1.6,1),d,0,w));await e.yield?.()}o(M(0,389,3.5,246,12,17,3.5,2),d,0),o(M(0,31,3.5,246,12,17,3.5,2),d,0,w),o(M(0,403.5,-4.4,296,9,2.2,.8,1),x,0),o(M(0,16.5,-4.4,296,9,2.2,.8,1),x,0);for(let v=0;v<4;v++){await e.yield?.();const m=s[v];o(M(.5,m-1.6,19.5,242,3.2,33,1.3,1),d,0,(n,g,p)=>(g>m-1?.55:.8)*w(n,g-3,p)),o(M(.5,m+4,35,242,11.5,2.6,1.2,2),d,0,(n,g,p)=>w(n,g,p)*(.82+.18*H(m-2,m+9,g))),o(M(-119.3,m+4,19.5,2.4,11.5,33,1.1,1),d,0,(n,g,p)=>w(n,g,p)*(.82+.18*H(m-2,m+9,g)));for(let n=0;n<2;n++){const g=m+(n?37:22),p=n?1:.85,W=37.2,G=(B,se,X)=>O(1,.55,a(B,se,34)*.8);o(ie([-117,g,W],[117,g,W],p,7),h,1,G);for(const B of[-1,1])o(ie([B*117,g,W],B>0?[B*123,g,27]:[-121,g,8.6],p,7),h,1,G),o(me(B*117,g,W,p*1.12),h,1,G)}for(let n=0;n<20;n++)o(M(-110+n*11.6,m-4.3,19.5,2,2.6,30,.8,1),d,0,(g,p,W)=>.74*w(g,p-3,W));if(o(M(.5,m-3.9,34.6,240,1.8,1.8,.7,1),d,0,(n,g,p)=>.9*w(n,g-3,p)),v===0){const n=(g,p,W)=>w(g,p,W)*(.82+.18*H(m-2,m+9,p));o(M(I-.5,m-1.6,21,22,3.2,30,1.3,1),d,0,(g,p,W)=>(p>m-1?.55:.8)*w(g,p-3,W)),o(M(I-.5,m+4,35,22,11.5,2.6,1.2,2),d,0,n),o(M(I-11,m+4,21,2.4,11.5,30,1.1,1),d,0,n),o(ie([I-11,m+22,37.2],[-117,m+22,37.2],.85,7),h,1),o(ie([I-11,m+22,37.2],[I-10,m+22,8],.85,7),h,1),o(me(I-11,m+22,37.2,.95),h,1),o(ie([I-11,m+9,36.6],[I-11,m+22,37.2],.75,6),h,1)}await e.yield?.();const N=8+v%2;for(let n=0;n<=N;n++){const g=-112+224*n/N;o(ie([g,m+9,36.6],[g,m+37,37.2],.75,6),h,1,(p,W,G)=>O(1,.55,a(p,W,34)*.8)),o(me(g,m+37,37.2,1.15),h,1),o(me(g,m+22,37,1),h,1)}}await e.yield?.();const S=s[be],L=c.butterX,D=c.eggX;o(M(L,S+8,19,66,16,29,2.2,2),d,0),o(M(L,S+27,19,63,23,27.5,7,2),C,3),o(M(L,S+18.5,33.8,16,4.2,2.6,1.1,1),d,0),o(M(L,S+17,19,65.4,2.2,29.4,1,1),d,0);for(let v=-2;v<=2;v++)o(M(L+v*11,S+38.4,19,2.2,1.6,20,.7,1),C,3);o(M(L,S+30,33.2,40,1.6,1.4,.6,1),C,3);for(const v of[-1,1])o(M(L+v*24,S+20,5.6,7,6,2.4,1,1),h,1);o(M(D,S+3.6,19,100,7.2,29,1.8,2),d,0,(v,m,N)=>{let n=1e9;for(let g=0;g<6;g++)for(let p=0;p<2;p++)n=Math.min(n,Math.hypot(v-(D-40+g*16),N-(12+p*14)));return m>S+6?.5+.5*H(6,9.5,n):.9}),await e.yield?.();const F=[];for(let v=0;v<=11;v++){const m=v/11*Math.PI,N=8.6*(1-Math.cos(m));F.push(new t.Vector2(Math.max(6.7*Math.sin(m)*(1-.014*N),.001),N))}const V=new t.LatheGeometry(F,20);for(let v=0;v<6;v++)for(let m=0;m<2;m++){const N=V.clone();N.rotateY(l()*ye),N.rotateZ(l.range(-.06,.06)),N.translate(D-40+v*16+l.range(-.3,.3),S+2.4,12+m*14);const n=ke.copy(A).multiplyScalar(l.range(.92,1.05)).clone();o(N,n,2,(g,p)=>.6+.4*H(S+5,S+13,p))}await e.yield?.();const T=pe(i,!1);for(const v of i)v.dispose();return T}function Ye(){const e=[],l=new t.Color(.76,.81,.84),s=(f,r=1)=>e.push(xe(f,l,0,r===1?null:()=>r));s(M(-145.6,210,9,8.8,420,18,2.6,2)),s(M(144.5,210,9,11,420,18,2.6,2)),s(M(0,410.5,9,278,19,18,2.6,2)),s(M(0,9.5,9,278,19,18,2.6,2));for(let f=36;f<400;f+=26)s(M(-145.6,f,9,9.3,1.7,18.5,.7,1),.9);s(M(-142.6,210,17,2.8,386,3.2,1.3,1),.92),s(M(140.2,210,17,3.2,386,3.2,1.4,1),.92),s(M(0,402.4,17,282,3.2,3.2,1.4,1),.92),s(M(0,17.6,17,282,3.2,3.2,1.4,1),.92);const c=pe(e,!1);for(const f of e)f.dispose();return c}const oe=()=>t.UniformsUtils.clone(t.UniformsLib.fog);function Ne(e,l){return new t.ShaderMaterial({fog:!0,vertexColors:!0,uniforms:{...oe(),...e,uFrost:{value:l}},vertexShader:`
      attribute float aMat; varying vec3 vW, vN, vCol; varying float vMat;
      ${J}
      void main(){
        vCol = color; vMat = aMat;
        vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vN = mat3(modelMatrix)*normal;
        vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
        ${ee}
      }`,fragmentShader:`
      varying vec3 vW, vN, vCol; varying float vMat; uniform float uFrost;
      ${Q}${ne}${ue}${U}${ge}${te}
      void main(){
        vec3 N = vN/max(length(vN), 1e-4);
        vec3 Vv = cameraPosition - vW; float dist = max(length(Vv), 1e-3); vec3 V = Vv/dist;
        vec3 P = vW - uOrigin;
        float isWire = step(.5, vMat)*step(vMat, 1.5), isEgg = step(1.5, vMat)*step(vMat, 2.5), isLid = step(2.5, vMat)*step(vMat, 3.5), isSkin = step(3.5, vMat);
        float enamel = 1. - isWire - isEgg - isLid;
        vec3 an = abs(N);
        vec2 uv = (an.z > an.x && an.z > an.y) ? P.xy : (an.x > an.y ? P.zy : P.xz);
        float mpp = max(length(fwidth(vW)), 1e-4);
        float near = 1. - smoothstep(110., 300., dist);
        float fr = smoothstep(.5, .78, fbm(uv*.035 + 3.7))*uFrost*enamel*(1. - isSkin);
        // (a varying can overshoot at a sliver's edge: the paint's colour is never below black)
        vec3 alb = mix(clamp(vCol, 0., 1.7), vec3(.84, .9, .94), fr*.55);
        float grain = vnoise(uv*2.3)*.55 + vnoise(uv*8.7)*.45;
        alb *= 1. - fr*.3*grain*near;
        // in the door's shade the enamel is never a blank: fine moulded reeding, a film of condensation that gathers and runs,
        // and (below) every bead of it holds a point of the light from across the canyon
        float shade_ = enamel*(1. - isSkin)*(1. - lcHood(vW))*uBulb*near;
        float reed = smoothstep(.5, 1., cos(uv.y*6.2832/6.5))*step(an.y, .5);
        float film = vnoise(uv*.07 + 5.1)*.6 + vnoise(uv*.23 + 1.3)*.4;
        float runs = smoothstep(.62, .9, vnoise(vec2(uv.x*.42, uv.y*.012 + 3.)))*smoothstep(.3, .7, vnoise(vec2(uv.x*.06 + 9., uv.y*.02)))*step(an.y, .5);
        alb *= 1. - shade_*(.22*reed + .3*(film - .5) + .14*runs);
        // rime: by the back plate and in the frosted corner every ledge carries a crust on its upper side
        float zone = max(smoothstep(186., 230., P.z), (1. - smoothstep(-143., -124., P.x))*smoothstep(70., 170., P.z)*smoothstep(225., 300., P.y));
        // the post beside the way out (the latch-side edge of the cabinet's mouth, its whole height): 1 on it, 0 elsewhere.
        // -140.6..-139.6 lies between the post's ribs (out to x -140.95) and the ends of the top and bottom bars (from x -139);
        // 19..21 is just past the moulded bead on its box side (to z 18.6); -2 is in front of its face (z 0)
        float post = (1. - smoothstep(-140.6, -139.6, P.x))*(1. - smoothstep(19., 21., P.z))*step(-2., P.z)*enamel*(1. - isSkin);
        // the ends of the bars beside it keep their patches of rime; the post itself carries none (see below)
        zone = max(zone, .9*(1. - post)*(1. - smoothstep(-141., -136., P.x))*(1. - smoothstep(19., 25., P.z))*step(-2., P.z)*smoothstep(.34, .6, fbm(vec2(P.y*.035, (P.x + P.z)*.15) + 5.3)));
        float rime = zone*enamel*(1. - isSkin)*clamp(.38 + .62*smoothstep(-.3, .45, N.y) + (fbm(uv*.23 + 11.3) - .5)*1.5, 0., 1.)*(.7 + .3*uFrost);
        float crust = smoothstep(.25, .75, vnoise(uv*.8 + 3.1)*.6 + vnoise(uv*2.9)*.4);
        alb = mix(alb, vec3(.88, .94, .97)*(.5 + .5*crust)*(.8 + .2*grain), rime);
        N = N + (rime*.55)*(vec3(vnoise(uv*1.4 + 1.7), vnoise(uv*1.4 + 8.3), vnoise(uv*1.4 + 15.1)) - .5); N = N/max(length(N), 1e-3);
        vec3 bd = lcBeads(uv/1.7, .36*(1. - fr), uTime*.3, mpp/1.7)*(enamel + isLid)*(1. - isSkin)*step(an.y, .8)*near;
        float gloss = 36., spec = .3;
        gloss = mix(gloss, 150., isWire); spec = mix(spec, 1.8, isWire);
        gloss = mix(gloss, 12., isEgg); spec = mix(spec, .1, isEgg);
        spec = mix(spec, .9, isLid);
        vec3 col = lcShade(vW, N, V, alb*(1. - bd.z*.3), gloss, spec + bd.y*1.4);
        col += uWarmCol*(uWarm*(lcBar(P) + lcOutside(P)*.5)*bd.y*.5);
        col += mix(uGreenCol, uBulbCol, .5)*(shade_*(bd.y*1.1 + bd.x*.05 + .05*runs*film));
        // eggs are pale things: in the door's shade they keep a warm bloom of their own, lighter on top
        col += alb*vec3(1., .86, .66)*(isEgg*uBulb*(.1 + .2*smoothstep(-.2, .9, N.y)));
        float fres = pow(max(1. - abs(dot(N, V)), 0.), 2.5);
        vec3 Lb = uBulbPos - vW; float att = lcBulbAtt(length(Lb));
        col += uBulbCol*(uBulb*att*fres*(isLid*.55 + isWire*.75 + isEgg*.16 + enamel*.07));
        col += uBulbCol*(uBulb*att*rime*(1.5*smoothstep(.87, .97, vnoise(uv*4.3 + V.xy*5.)) + .45*fres + .22*crust)) + uDiodeCol*(uDiode*(1. - uBulb)*rime*.5*smoothstep(.9, .98, vnoise(uv*4.3 + V.xy*5. + 3.)));
        col += uWarmCol*(uWarm*uBar.w*fres*isWire*.5*clamp(dot(N, LC_KITCHEN) + .4, 0., 1.));
        // THE CABINET'S EDGE BESIDE THE WAY OUT. The last stretch of the flight passes this post close by, so here the enamel is
        // shaded the way the rest of the box shades glass: a clean backlit shape. Across its 18 m, from the edge turned to the
        // box and its bulb to the edge turned to the slot: a white rim, white enamel, enamel going blue, deep teal shade, and then
        // the kitchen's colour laid on the bevel and the strip that face the slot (as much of it as lcBar lets through there:
        // none below the gasket's peel front). The moulded ribs are thin lines of light with teal under each; a crust of frost
        // needles grows in from the box side at the three shelf levels; beads of condensation gather under the ribs and a few
        // run. No speckle. It is a rule of the surface (where on the cabinet, which way it is turned, how much of the bar
        // reaches it) and knows nothing of the eye or of the flight.
        if (post > .001) {
          float gz = clamp(P.z/18., 0., 1.);                                           // 18 m: the post's depth in z
          float turn = clamp(N.z*1.2 + (1. - abs(N.z))*(gz*2. - 1.), -1., 1.);         // -1 turned to the slot .. +1 turned to the box
          float wWarm = 1. - smoothstep(-.98, -.55, turn), wLit = smoothstep(-.35, .45, turn), rimK = smoothstep(.8, .9, turn);
          float attP = lcBulbAtt(length(uBulbPos - vW)), kB = uBulb*(.5 + .9*attP);
          vec3 shadeC = mix(uDarkCol*.5, uShadowCol*uKey.y, uBulb);
          vec3 teal = shadeC*1.15 + uBulbCol*vec3(.42, .78, .9)*(uBulb*.1*exp(-max(P.y, 0.)/105.));   // the shade, lifted a little by the fog on the floor as everything low in the canyon is
          vec3 blue = uBulbCol*vec3(.2, .46, .78)*(kB*.42) + shadeC*.6;
          vec3 white = uBulbCol*vec3(.9, .95, 1.)*(kB*.9);
          vec3 pc = mix(mix(teal, blue, smoothstep(-.62, -.15, turn)), white, wLit);
          // the ribs: one every 26 m from y 36 (buildFrameGeometry), each 1.7 m tall; its shadow lies under it for a few metres
          float ph = mod(P.y - 23., 26.) - 13.;
          float onRib = 1. - smoothstep(.6, 1., abs(ph)), under = smoothstep(.8, 1.3, -ph)*(1. - smoothstep(1.3, 7.5, -ph));
          pc = mix(pc, teal*.85, under*.8);
          // frost where the post stands level with the shelves (SHELF_TOPS): needles radiating from its box-side edge, the enamel
          // between them in their blue shade
          float y0 = P.y < 162.5 ? 110. : (P.y < 267.5 ? 215. : 320.);
          vec2 fq = vec2(19.5 - P.z, P.y - y0 + 2.); float fl = max(length(fq), .05), fa = atan(fq.y, max(fq.x, 1e-3));
          float c1 = fa*10. + y0*.37, h1 = hash11(floor(c1)*1.7 + 3.1), reach1 = 8. + 8.*h1*h1, w1 = .42*max(1. - fl/reach1, 0.), a1 = clamp(mpp*10./fl, 1e-3, .5);
          float c2 = fa*23. + y0*.91 + 4., h2 = hash11(floor(c2)*2.3 + 7.7), reach2 = 6. + 6.*h2, w2 = .36*max(1. - fl/reach2, 0.), a2 = clamp(mpp*23./fl, 1e-3, .5);
          float needle = (1. - smoothstep(w1 - a1, w1 + a1, abs(fract(c1) - .5)))*step(fl, reach1)*step(.15, h1)
                       + .8*(1. - smoothstep(w2 - a2, w2 + a2, abs(fract(c2) - .5)))*step(fl, reach2)*step(.2, h2);
          // a solid crust at the root of the needles (to 4-8 m) and on up and down the box-side edge for a dozen metres, and
          // round it the crust's blue shade on the enamel, which is what shows white frost on white enamel
          float lump = vnoise(vec2(P.y, P.z)*.6) - .5;
          float crustK = max(1. - smoothstep(3.5, 7.5, fl + lump*3.5), (1. - smoothstep(.8, 3. + 2.5*lump, 19.5 - P.z))*(1. - smoothstep(8., 20., abs(P.y - y0 + 2.))));
          float frostK = clamp(needle + crustK, 0., 1.), envK = (1. - smoothstep(7.5, 12.5, fl + lump*3.5))*(1. - frostK);
          pc *= mix(vec3(1.), vec3(.34, .54, .82), envK*.85);
          vec3 warm = uWarmCol*(uWarm*(lcBar(P)*1.05 + lcOutside(P)*.55));
          float cry = vnoise(vec2(P.z, P.y)*2.1 + 3.)*.6 + vnoise(vec2(P.z, P.y)*5.7)*.4;
          pc = mix(pc, uBulbCol*vec3(.92, .97, 1.)*(kB*(.8 + .45*wLit)*(.72 + .5*cry)*(.84 + .3*smoothstep(-1., 1., fq.y/fl))) + shadeC*.8, frostK*.94);   // lit from above: the crust's upper half is the brighter
          pc += uBulbCol*(kB*1.3*frostK*smoothstep(.88, .97, vnoise(vec2(P.z, P.y)*3.3 + V.xy*5.)));
          // the rim down the edge that faces the bulb, and the kitchen's colour on the side that faces the slot
          pc = mix(pc, uBulbCol*(kB*1.4), rimK*(1. - .5*under));
          pc = mix(pc, pc*.3 + warm*vec3(.84, .82, .8), wWarm);
          pc = mix(pc, pc + uBulbCol*(kB*(.2 + .75*wLit)) + warm*(wWarm*.5), onRib);
          // condensation: a row of beads gathered under each rib, and the few that run
          float gather = smoothstep(.8, 1.2, -ph)*(1. - smoothstep(2.4, 4.4, -ph));
          vec3 bdp = lcBeads(uv/1.5, .6*gather, uTime*.3, mpp/1.5)*(near*step(an.y, .8));
          pc = pc*(1. - bdp.z*.25) + (uBulbCol*(kB*(.45 + .8*wLit)) + warm*wWarm)*(bdp.y*1.3);
          col = mix(col, pc, post*uBulb);
        }
        gl_FragColor = vec4(fxApplyFog(max(col, vec3(0.))), 1.);
      }`})}function qe(e){return new t.ShaderMaterial({fog:!0,transparent:!0,premultipliedAlpha:!0,depthWrite:!0,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:{...oe(),...e},vertexShader:`
      attribute float aPart; attribute vec3 aBase; attribute vec4 aDim, aLiq, aCap; attribute vec2 aFx;
      uniform vec4 uSlosh; uniform float uTime;
      varying vec3 vW, vN, vO; varying float vPart;
      flat varying vec4 vDim, vLiq, vCap, vTilt; flat varying vec3 vAxis; flat varying vec2 vLean;
      ${J}
      void main(){
        float R = max(aDim.x, .1), H = max(aDim.y, .1), ph = aDim.w;
        float ca = cos(ph*6.2832), sa = sin(ph*6.2832);
        vec3 p = vec3(position.x*R, position.y*H, position.z*R);
        vec3 n = vec3(normal.x/R, normal.y/H, normal.z/R);
        n = n/max(length(n), 1e-6);
        vO = p; vPart = aPart;
        p.xz = mat2(ca, sa, -sa, ca)*p.xz; n.xz = mat2(ca, sa, -sa, ca)*n.xz;
        vec2 lean = uSlosh.z*vec2((fract(ph*3.71) - .5)*.7, .6 + .8*fract(ph*7.13));
        p.xz += p.y*lean;
        vec4 w = modelMatrix*vec4(aBase + p, 1.);
        mat3 m3 = mat3(modelMatrix);
        vW = w.xyz; vN = m3*n;
        vAxis = (modelMatrix*vec4(aBase, 1.)).xyz;
        vLean = (m3*vec3(lean.x, 0., lean.y)).xz;
        float s = mix(uSlosh.x, uSlosh.y, fract(ph*5.3));
        vec2 dir = normalize(vec2((fract(ph*9.7) - .5)*1.3, 1.));
        vec2 tilt = dir*s*.2 + uSlosh.w*vec2(sin(uTime*(2.1 + 2.*fract(ph*11.3)) + ph*50.), cos(uTime*(1.7 + 2.*fract(ph*13.1)) + ph*31.));
        vTilt = vec4((m3*vec3(tilt.x, 0., tilt.y)).xz, aFx.y, aFx.x);
        vDim = aDim; vLiq = aLiq; vCap = aCap;
        vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
        ${ee}
      }`,fragmentShader:`
      varying vec3 vW, vN, vO; varying float vPart;
      flat varying vec4 vDim, vLiq, vCap, vTilt; flat varying vec3 vAxis; flat varying vec2 vLean;
      ${Q}${U}${ge}${te}
      void main(){
        vec3 N = vN/max(length(vN), 1e-4);
        vec3 Vv = cameraPosition - vW; float dist = max(length(Vv), 1e-3); vec3 V = Vv/dist;
        vec3 P = vW - uOrigin;
        float lit = vTilt.z, fizz = vTilt.w, R = vDim.x, H = vDim.y;
        vec3 Lb = uBulbPos - vW; float db = max(length(Lb), 1.); Lb /= db; float att = lcBulbAtt(db)*lit;
        vec3 Ld = uDiodePos - vW; Ld = Ld/max(length(Ld), 1.);
        float mpp = max(length(fwidth(vW)), 1e-4);
        vec3 col, glow = vec3(0.); float alpha; float dio = uDiode*(1. - .85*uBulb);
        if (vPart > .5) {
          // pressed metal: a crimped skirt, a rolled edge, the dark box mirrored below and the lit ceiling above
          float angc = atan(vO.z, vO.x + ((abs(vO.x) + abs(vO.z)) < 1e-4 ? 1e-3 : 0.));
          vec3 Tc = cross(vec3(0., 1., 0.), N); Tc = Tc/max(length(Tc), 1e-3);
          float skirt = 1. - smoothstep(.3, .65, abs(N.y));
          float nC = max(floor(R*3.), 16.);
          float cfade = 1. - smoothstep(.2, .6, mpp*nC/max(R, 1.));
          N = normalize(N + Tc*(sin(angc*nC)*.26*skirt*cfade));
          vec3 capc = vCap.rgb*(.42 + .58*lit);
          // the flat of the lid is stamped: two shallow rings and a dished middle
          float rr = length(vO.xz)/max(R, .1), flatTop = smoothstep(.86, .97, N.y);
          vec2 rd2 = vO.xz/max(length(vO.xz), 1e-3);
          N = normalize(N + vec3(rd2.x, 0., rd2.y)*(flatTop*(.15*sin(rr*34.)*smoothstep(.12, .2, rr) + .12)));
          vec3 Rf = reflect(-V, N);
          float sky = smoothstep(-.4, .6, Rf.y), toBulb = max(dot(Rf, Lb), 0.);
          float tb2 = toBulb*toBulb, tb8 = tb2*tb2*tb2*tb2;
          // bright metal is dark where it mirrors the shade and burns where it mirrors the light. Round the skirt: the lit side
          // of the box as one soft band and the bulb as one hard line down it. On the turned flat of the top: the bulb drawn out
          // into two bright wedges across the disc, as on any lathe-turned lid
          vec3 Rh = vec3(Rf.x, 0., Rf.z); Rh = Rh/max(length(Rh), 1e-3);
          vec3 Lh0 = vec3(Lb.x, 0., Lb.z); Lh0 = Lh0/max(length(Lh0), 1e-3);
          float rb = max(dot(Rh, Lh0), 0.), rb2 = rb*rb, rb8 = rb2*rb2*rb2*rb2, rb64 = rb8*rb8*rb8*rb8*rb8*rb8*rb8*rb8;
          vec3 Hb0 = normalize(Lb + V + vec3(0., 1e-3, 0.));
          float th = dot(vec3(-rd2.y, 0., rd2.x), Hb0), bow = pow(max(1. - th*th, 0.), 90.)*smoothstep(.1, .24, rr)*(1. - smoothstep(.86, .96, rr))*max(dot(N, Hb0), 0.);
          vec3 shade = mix(uDarkCol*.4, uShadowCol*(uKey.y*.5), uBulb);
          vec3 env = shade*(.2 + .5*sky) + uBulbCol*(uBulb*att*(skirt*(.16*sky + 1.1*rb8*rb2 + 7.*rb64*rb64) + flatTop*(.22*sky + 2.4*bow) + .5*tb8 + 5.*tb8*tb8*tb8*tb8));
          col = lcShade(vW, N, V, capc*.1, 220., 5.*lit) + mix(capc, vec3(.85, .9, .92), .3)*env; alpha = 1.;
          float fr = pow(max(1. - abs(dot(N, V)), 0.), 3.);
          float roll = smoothstep(.34, .55, abs(N.y))*(1. - smoothstep(.55, .8, abs(N.y)));
          col *= 1. - .55*smoothstep(.8, .9, abs(N.y))*(1. - smoothstep(.9, .97, abs(N.y)));          // a dark seam inside the rolled edge
          col += uBulbCol*(uBulb*att*(fr*.8 + roll*.6*(.4 + .6*sky))) + uWarmCol*(uWarm*uBar.w*(fr*.45 + roll*.2)*(1. + uDark.y)*clamp(dot(N, LC_KITCHEN) + .5, 0., 1.));
          col += uDiodeCol*(dio*(fr*.2 + (1. - uBulb)*(.05*sky*sky + .12*roll))) + uWarmCol*(uDark.x*(fr*.3 + roll*.12)*lcLeak(P));
        } else {
          float hN = vO.y/H;
          float ang = atan(vO.z, vO.x + ((abs(vO.x) + abs(vO.z)) < 1e-4 ? 1e-3 : 0.));
          float band = smoothstep(.53, .565, hN)*(1. - smoothstep(.69, .735, hN));
          vec3 T = cross(vec3(0., 1., 0.), N); T = T/max(length(T), 1e-3);
          float nRib = max(floor(R*1.5), 8.);
          float ribFade = 1. - smoothstep(.25, .7, mpp*nRib/max(R, 1.));
          vec3 Ng = N;                                           // the smooth wall, before the flutes
          N = normalize(N + T*(sin(ang*nRib)*.15*band*ribFade));   // (shallow: a deep flute splits the bulb's streak into the tines of a fork)
          // the flutes catch small lights of their own, but the body, its rim and its edges are those of the smooth wall:
          // no closed white outlines inside the glass
          float ndv = abs(dot(Ng, V)), fres = pow(max(1. - mix(ndv, abs(dot(N, V)), .22), 0.), 2.4);
          vec2 rel = vW.xz - (vAxis.xz + (vW.y - vAxis.y)*vLean);
          float planeY = vAxis.y + vDim.z*H + dot(vTilt.xy, rel);
          float below = planeY - vW.y;
          float inLiq = smoothstep(-mpp, mpp, below);
          vec3 D = -V; float den = D.y - dot(vTilt.xy, D.xz); den = abs(den) < 1e-3 ? 1e-3 : den;
          float t = below/den;
          float surf = step(0., t)*(1. - smoothstep(R*.84, R*.93, length(rel + D.xz*t)));
          vec3 liq = max(vLiq.rgb, vec3(1e-3)); float milk = vLiq.a;
          float depth = max(below, 0.);
          float topGlow = exp(-depth/(H*.3));
          // across the bottle: side is +1 where the wall faces the bulb, -1 where it is turned away
          vec3 Nh = vec3(N.x, 0., N.z); Nh = Nh/max(length(Nh), 1e-3);
          vec3 Lh = vec3(Lb.x, 0., Lb.z); Lh = Lh/max(length(Lh), 1e-3);
          float side = dot(Nh, Lh), toward = smoothstep(-.95, .5, side);
          // absorption by thickness: thin liquid at the flanks is pale and full of light, the thick middle deep and saturated,
          // and deeper still far below the surface; a dark line of bent light runs just inside each edge
          float thick = smoothstep(0., .95, ndv);
          vec3 trans = pow(liq, vec3(.62 + 1.7*thick + .5*(1. - topGlow)));
          vec3 clearT = trans*(mix(1.6, .8, thick)*(.62 + .78*toward));
          vec3 milkT = liq*((.62 + .26*ndv)*(.7 + .6*toward));
          vec3 tint = mix(clearT, milkT, milk)*mix(.3, 1., smoothstep(.02, .24, ndv));
          // within 30 m of the eye no veil of bloom lies on a jar (see the end of this shader), so its liquid carries that
          // light itself, in its own colour: half as much again at 30 m and nearer, as live from 75 m (half the avenue)
          float nearG = uBulb*(1. - smoothstep(30., 75., dist));
          tint *= 1. + .5*nearG;
          // what stands behind a bottle is bent into upright bands that waver as the liquid trembles
          float wav = sin(ang*5. + 2.2*sin(vO.y*.21 + uTime*.35 + vDim.w*40.) + vDim.w*9.)*.5 + .5;
          tint *= mix(1., .72 + .5*wav*wav, (1. - milk)*smoothstep(.25, .8, ndv));
          // and its neighbours show through it as soft upright bands of their own colours
          float bx = ang*1.3 + vDim.w*7. + .22*sin(vO.y*.13 + uTime*.3 + vDim.w*20.), bh = hash11(floor(bx)*3.7 + vDim.w*23.);
          float bm = (1. - smoothstep(.1, .38, abs(fract(bx) - .5)))*step(.4, bh);
          vec3 nb = bh < .62 ? vec3(.55, 1., .2) : (bh < .82 ? vec3(1., .55, .1) : vec3(.12, .8, 1.));
          tint = mix(tint, nb*(max(liq.r, max(liq.g, liq.b))*.8), bm*.22*(1. - milk)*smoothstep(.3, .8, ndv)*step(liq.r, liq.g + liq.b));
          float bar = lcBar(P);
          float slot = uBar.w*min(exp(-(P.x + 150.)/170.), 1.);
          float floorGlow = uBulb*exp(-max(P.y, 0.)/150.);          // the tray of fog on the canyon floor lights the glass above it
          vec3 E = uBulbCol*(uBulb*att*(.5 + .82*topGlow)) + mix(uDarkCol*.4, uShadowCol*(1.1*uKey.y), uBulb)
                 + uBulbCol*vec3(.45, .8, .92)*(floorGlow*.34) + mix(uGreenCol, uBulbCol, .45)*(uBulb*.16*smoothstep(75., 45., P.z)) + uWarmCol*(uWarm*(bar*1.2 + .22*slot));
          vec3 surfCol = liq*E*1.35 + uBulbCol*(uBulb*att*.22);
          // the empty glass above the liquid: clear in the middle, a dark line inside each edge, and the room's light and
          // shade drawn out into upright streaks that slide round it as the eye moves
          float e1 = 1. - ndv, vang = atan(V.z, V.x + ((abs(V.x) + abs(V.z)) < 1e-4 ? 1e-3 : 0.));
          float st1 = smoothstep(.72, .97, sin((ang - vang)*2. + vDim.w*17.)*.5 + .5), st2 = smoothstep(.8, .98, sin((ang - vang)*5. + vDim.w*29. + 1.3)*.5 + .5);
          float edgeDark = smoothstep(.45, .8, e1)*(1. - smoothstep(.86, .97, e1));
          vec3 roomLight = uBulbCol*(uBulb*att*(.5 + .5*toward)) + uWarmCol*(uWarm*(bar*.8 + .3*slot)) + uDiodeCol*(dio*.05);
          vec3 emptyCol = mix(vec3(.4, .72, .8)*E*.12, roomLight*vec3(.82, .95, 1.), clamp(st1*.38 + st2*.16, 0., 1.))*(1. - .85*edgeDark);
          float emptyA = clamp(.06 + .1*e1 + .6*edgeDark + .13*st1 + .06*st2, 0., 1.);
          col = mix(emptyCol, tint*E, inLiq);
          // the dark line inside the edge that is turned from the bulb takes the look's shade: deep teal, not black
          col += lcShadeRoot()*(uBulb*inLiq*(1. - toward)*(1. - smoothstep(.02, .3, ndv))*(1. - milk));
          alpha = mix(emptyA, mix(.95, 1., milk), inLiq);
          float above = 1. - inLiq;
          col = mix(col, surfCol, surf*above*.92); alpha = max(alpha, surf*above*.9);
          col = mix(col, surfCol*1.15 + uBulbCol*(uBulb*att*.15), surf*inLiq*.55);
          // the meniscus: one bright line where the liquid climbs the glass, a darker band just under it
          float men = 1. - smoothstep(.12, .42 + mpp, abs(below));
          float menShade = smoothstep(.3, .9, below)*(1. - smoothstep(1.2, 3.2, below));
          col *= 1. - .3*menShade*(1. - milk);
          glow += uBulbCol*(uBulb*att*men*(.55 + .7*toward)) + liq*uBulbCol*(uBulb*att*men*.5) + uDiodeCol*(dio*men*.06);
          if (fizz > .5 && fizz < 1.5) {
            // fizz: a few chains of bubbles of every size, swelling as they climb; each a dark ring with a point of light
            float nB = max(floor(R*.9), 5.);
            float cx = ang/6.2832*nB, id = floor(cx), cw = 6.2832*R/nB, fxx = (fract(cx) - .5)*cw;
            float hCol = hash11(id + vDim.w*91.), fillH = max(vDim.z*H, 1.), ringB = 0., pinB = 0., coreB = 0.;
            for (int i = 0; i < 9; i++) {
              float fi = float(i), hb = hash11(id*3.1 + fi*7.7 + vDim.w*13.);
              float yb = fract(uTime*(.03 + .035*hCol) + fi*.111 + hb*.07 + hCol*3.1);
              float rb = (.13 + .36*yb)*(.5 + 1.1*hb*hb);
              vec2 q = vec2(fxx - (hCol - .5)*cw*.3 - sin(yb*17. + fi*2.1 + hCol*40.)*(.2 + .55*yb), depth - (1. - yb)*fillH);
              float dd = length(q);
              ringB += (1. - smoothstep(rb, rb + mpp, dd))*smoothstep(rb*.4, rb*.85, dd);
              coreB += 1. - smoothstep(rb*.5, rb + mpp, dd);
              pinB += 1. - smoothstep(rb*.08, rb*.3 + mpp*.6, length(q + vec2(.36, .36)*rb));
            }
            float onB = step(.38, hCol)*(1. - smoothstep(150., 330., dist))*inLiq*(1. - smoothstep(.5, 1.6, mpp));
            col = col*(1. - .6*min(ringB, 1.)*onB) + tint*E*(.3*min(coreB, 1.)*onB);
            glow += (uBulbCol*(uBulb*att*1.6) + uWarmCol*(uWarm*bar*.8) + uDiodeCol*(dio*.05))*(min(pinB, 1.)*onB);
          }
          if (fizz > 1.5) {
            // things hanging in the liquid: 2 = curls of peel, 3 = cherries, 4 = a slab of comb
            float nC = max(floor(R*.62), 5.), cw = 6.2832*R/nC, caa = clamp(mpp/cw, 1e-3, .3);
            vec2 g = vec2(ang/6.2832*nC, depth/cw);
            g.y += hash11(floor(g.x) + vDim.w*13.)*.8;
            vec2 gid = floor(g), gf = fract(g) - .5, rnd = hash22(gid + vDim.w*37.);
            float fillH2 = max(vDim.z*H, 1.), inc = 0., hl2 = 0.;
            vec3 incCol = liq*liq*.16;
            if (fizz < 2.5) {
              float a0 = rnd.y*6.2832; vec2 q = mat2(cos(a0), sin(a0), -sin(a0), cos(a0))*(gf - (rnd - .5)*.2);
              float bend = .1*sin(q.x*(5. + 5.*rnd.x) + rnd.y*20.) + (rnd.x - .5)*1.6*q.x*q.x;
              float tw = .5 + .5*sin(q.x*(8. + 9.*rnd.y) + rnd.x*30.);
              float hw = mix(.012, .085, tw*tw)*(.55 + .9*rnd.y);
              inc = (1. - smoothstep(hw, hw + .025 + caa, abs(q.y - bend)))*(1. - smoothstep(.24 + .1*rnd.x, .32 + .1*rnd.x, abs(q.x)))*step(.3, rnd.x);
              incCol = mix(liq*liq*.1, liq*vec3(.75, .45, .2)*.5, tw*tw*.6);
            } else if (fizz < 3.5) {
              vec2 q = gf - (rnd - .5)*.22; float dq = length(q);
              inc = (1. - smoothstep(.33, .37 + caa, dq))*step(.2, rnd.x);
              hl2 = (1. - smoothstep(.02, .1 + caa, length(q - vec2(-.11, -.12))))*inc;
              incCol = vec3(.36, .012, .03);
            } else if (fizz < 4.5) {
              vec2 hx = g*vec2(1.6, 1.85); hx.x += .5*mod(floor(hx.y), 2.);
              vec2 hf = abs(fract(hx) - .5);
              inc = smoothstep(.3, .42, max(hf.x, hf.y*1.1))*smoothstep(.12, .2, depth/fillH2)*(1. - smoothstep(.72, .8, depth/fillH2));
              incCol = liq*vec3(.5, .34, .2);
            } else {
              // 5 = preserved lemons: whole ones (a rind with its point of light) and cut ones (pale pith, a wheel of segments), packed close
              float a0 = rnd.y*6.2832; vec2 q = mat2(cos(a0), sin(a0), -sin(a0), cos(a0))*(gf - (rnd - .5)*.14);
              q.y *= 1.24;
              float dq = length(q), cut = step(.52, rnd.x);
              inc = 1. - smoothstep(.43, .47 + caa, dq);
              float sa = atan(q.y, q.x + ((abs(q.x) + abs(q.y)) < 1e-4 ? 1e-3 : 0.));
              float spoke = smoothstep(.0, .3, abs(sin(sa*4. + rnd.x*9.)))*smoothstep(.04, .1, dq);
              vec3 rind = vec3(1.25, .92, .1)*(.62 + .38*(1. - smoothstep(.05, .45, dq)));
              vec3 face = mix(vec3(1.35, 1.25, .78), vec3(1.3, 1.02, .2), spoke);
              face = mix(face, vec3(1.4, 1.34, 1.), smoothstep(.3, .34, dq));
              face = mix(face, rind*.8, smoothstep(.37, .4, dq));
              incCol = mix(rind, face, cut)*1.5;
              hl2 = (1. - smoothstep(.02, .1 + caa, length(q - vec2(-.14, -.16))))*inc*(1. - cut)*2.;
            }
            inc *= inLiq*(1. - smoothstep(170., 380., dist));
            col = mix(col, incCol*E, inc*.86);
            glow += uBulbCol*(uBulb*att*hl2*.5);
          }
          float sB = 2., nA = max(floor(6.2832*R/sB), 6.);
          // beads gather on the shoulder and thin away down the body
          vec3 bd = lcBeads(vec2(ang/6.2832*nA, vO.y/sB), .2 + .5*smoothstep(.3, .62, hN), uTime*.5, mpp/sB)
                  *(smoothstep(.1, .3, hN)*(1. - smoothstep(.7, .8, hN))*(1. - smoothstep(110., 260., dist)));
          col *= 1. - bd.z*.6; alpha = max(alpha, bd.x*.12 + bd.z*.4);
          glow += (uBulbCol*(uBulb*att*.55) + uDiodeCol*(dio*.12*clamp(dot(N, Ld)*2., 0., 1.)) + uWarmCol*(uWarm*bar))*bd.y;
          // the rim is not one even outline: hard and white on the flank toward the bulb, a thin cold line on the other
          float rimK = fres*fres*fres*(.28 + 1.15*smoothstep(-.5, .75, side));
          glow += uBulbCol*(uBulb*(att*.7 + .3*lit)*2.6*rimK) + uBulbCol*vec3(.6, .9, 1.)*(floorGlow*.3*fres*fres);
          float dkn = 1. - uBulb;
          vec3 hue = lcDarkHue(liq, milk);
          glow += mix(uDiodeCol, hue, .7*dkn)*(dio*pow(fres, 3. + 3.*dkn)*(.35 + .65*clamp(dot(N, Ld)*.5 + .5, 0., 1.))*(.9 + .5*dkn));
          // before the bulb: the liquid holds what little light there is, brightest under its surface and toward the diode
          float towardD = clamp(dot(Nh, Ld)*.5 + .5, 0., 1.);
          glow += hue*(dkn*uDark.z*inLiq*(.035 + .13*topGlow)*(.35 + .65*smoothstep(0., .9, ndv))*(.55 + .45*towardD)*mix(1., .6, milk));
          glow += vec3(.25, .5, 1.)*(dkn*uDark.z*(1. - inLiq)*.03*(.4 + .6*fres));
          // the door's seal, a hairline of kitchen light behind us: a warm edge on the flank turned to it and one thin line mirrored down the glass
          vec3 toSeam = vec3(-146. - P.x, 0., -P.z); toSeam = toSeam/max(length(toSeam), 1.);
          vec3 Hk = toSeam + vec3(V.x, 0., V.z); Hk = Hk/max(length(Hk), 1e-3);
          vec3 Ngh = vec3(Ng.x, 0., Ng.z); Ngh = Ngh/max(length(Ngh), 1e-3);
          float shoulder = exp(-(hN - .6)*(hN - .6)*90.), offLine = smoothstep(.6, 2.6, abs(below));
          float seamLine = pow(max(dot(Ngh, Hk), 0.), 260.)*smoothstep(.2, .6, 1. - abs(Ng.y))*shoulder*offLine;
          float seamSide = clamp(dot(Ngh, toSeam), 0., 1.);
          glow += uWarmCol*(uDark.x*(fres*fres*seamSide*seamSide*.55*exp(-(hN - .58)*(hN - .58)*22.)*offLine + seamLine*.5));
          glow += uWarmCol*(uWarm*slot*fres*clamp(dot(N, LC_KITCHEN)*.7 + .5, 0., 1.)*1.6*(1. + 1.4*uDark.y));
          vec3 Hb = normalize(Lb + V + vec3(0., 1e-3, 0.));
          float ndh = max(dot(N, Hb), 0.);
          // one hard highlight: the bulb drawn out into a streak down the shoulder and body
          vec3 Hh = vec3(Hb.x, 0., Hb.z); Hh = Hh/max(length(Hh), 1e-3);
          float streakH = pow(max(dot(Nh, Hh), 0.), 260.)*smoothstep(.1, .5, 1. - abs(N.y))*(.35 + .65*smoothstep(.3, .75, hN))*step(1e-3, dot(N, Hb));
          glow += uBulbCol*(uBulb*att*(pow(ndh, 120.)*4.5 + streakH*1.5 + pow(ndh, 14.)*.06));
          vec3 Hd = normalize(Ld + V + vec3(0., 1e-3, 0.));
          glow += uDiodeCol*(dio*pow(max(dot(N, Hd), 0.), 90.)*4.);
          alpha = max(alpha, clamp(fres*fres*1.6, 0., 1.));
        }
        vec3 outc = max(col*alpha + glow, vec3(0.));
        // near the eye a jar's own lights (rim, the bulb's streak, bead points, the lid's mirror of the bulb) are held under the
        // bloom pass, which would spread them over the liquid as a white veil: full within 30 m, as live from 75 m. Where the
        // glass is clear the wall behind shows through and adds to it, so the ceiling is lower there (.45: the liner's level)
        float nearC = uBulb*(1. - smoothstep(30., 75., dist));
        outc = mix(outc, lcCap(outc, .9 - .45*(1. - alpha)), nearC);
        gl_FragColor = vec4(fxFogPremult(outc, alpha), alpha);
      }`})}const j=143.5,ae=16.5,he=403.5,le=9;function Xe(e){const l=[],s=ae+le,c=he-le,f=-j+le,r=j-le,i=(A,C,o,a,z,b,q)=>{const y=Math.max(1,Math.round(Math.hypot(o-A,a-C)/e));for(let w=0;w<y;w++){const k=w/y,S=O(A,o,k),L=O(C,a,k);l.push({x:S,y:L,nx:z,ny:b,q:q(S,L)})}},d=(A,C,o,a,z)=>{for(let b=0;b<5;b++){const q=O(o,a,b/5),y=Math.cos(q),w=Math.sin(q);l.push({x:A+y*le,y:C+w*le,nx:y,ny:w,q:z(A+y*le,C+w*le)})}},x=(A,C)=>.06+.9*(1-Z((C-ae)/(he-ae),0,1)),P=A=>.06*Z((j-A)/(2*j),0,1),h=A=>.96*(1-H(0,95,A+j));return i(r,he,f,he,0,1,P),d(f,c,Math.PI/2,Math.PI,()=>.06),i(-j,c,-j,s,-1,0,x),d(f,s,Math.PI,Math.PI*1.5,()=>.96),i(f,ae,r,ae,0,-1,h),d(r,s,Math.PI*1.5,ye,()=>-1),i(j,s,j,c,1,0,()=>-1),d(r,c,0,Math.PI/2,()=>-1),l}function Ze(){const e=Xe(3.2),l=e.length,s=[],c=-3.4,f=3.2,r=[0,1.6,-1.1,1.5,-1.1,1.1];for(let a=0;a<6;a++)s.push([5.3+r[a],O(c,f,a/6),a/6,r[a],1]);s.push([6.4,f+.2,1,0,1],[-6.4,f+.2,1,0,-1]);for(let a=5;a>=0;a--)s.push([-5.3-r[a],O(c,f,a/6),a/6,r[a],-1]);const i=s.length,d=new Float32Array(l*i*3),x=new Float32Array(l*i*3),P=new Float32Array(l*i*3),h=new Float32Array(l*i*4),A=new Float32Array(l*i*2);for(let a=0;a<l;a++)for(let z=0;z<i;z++){const b=e[a],q=s[z],y=a*i+z;d[y*3]=b.x+b.nx*q[0],d[y*3+1]=b.y+b.ny*q[0],d[y*3+2]=q[1],x[y*3]=b.x+b.nx*5.3*q[4],x[y*3+1]=b.y+b.ny*5.3*q[4],x[y*3+2]=c,P[y*3]=b.x+b.nx*6.4*q[4],P[y*3+1]=b.y+b.ny*6.4*q[4],P[y*3+2]=0,h[y*4]=q[2],h[y*4+1]=b.q,h[y*4+2]=q[3],h[y*4+3]=q[4],A[y*2]=b.nx,A[y*2+1]=b.ny}const C=[];for(let a=0;a<l;a++)for(let z=0;z<i-1;z++){const b=a*i+z,q=(a+1)%l*i+z;C.push(b,q,b+1,q,q+1,b+1)}const o=new t.BufferGeometry;return o.setAttribute("position",new t.BufferAttribute(d,3)),o.setAttribute("aAttach",new t.BufferAttribute(x,3)),o.setAttribute("aSeal",new t.BufferAttribute(P,3)),o.setAttribute("aG",new t.BufferAttribute(h,4)),o.setAttribute("aNrm",new t.BufferAttribute(A,2)),o.setIndex(C),o.boundingSphere=new t.Sphere(new t.Vector3(0,210,-30),270),o}function Qe(e){return new t.ShaderMaterial({fog:!0,side:t.DoubleSide,uniforms:{...oe(),...e},vertexShader:`
      attribute vec3 aAttach, aSeal; attribute vec4 aG; attribute vec2 aNrm;
      uniform float uDoor; uniform vec2 uPeel;
      varying vec3 vW, vNo; varying vec4 vG; varying float vF;   // vG: across, stretch, recency, fold; vF: 1 once it is back on the door
      ${J}
      vec3 swing(vec3 p){ float c = cos(uDoor), s = sin(uDoor); vec2 r = vec2(p.x - 150., p.z); return vec3(150. + r.x*c - r.y*s, p.y, r.x*s + r.y*c); }
      void main(){
        float a = aG.x, q = aG.y;
        vec3 n3 = vec3(aNrm.x, aNrm.y, 0.);
        vec3 relaxed = swing(position + n3*(2.*a*sin((position.x + position.y)*.42))), A = swing(aAttach), S = aSeal;
        float gap = length(S - A);
        vec3 stuck = mix(A, S, a) + n3*(aG.z*(.35 + .65/(1. + gap*.07))*(1. + gap*.045)/(1. + gap*.12) + sin(a*3.1416)*gap*.03);   // stretched, it is taut
        float tau = max(uPeel.x - q, 0.)*uPeel.y;
        float w = q < 0. ? 1. : (tau <= 0. ? 0. : 1. - exp(-tau*.85)*cos(tau*4.6));
        vec3 p = mix(stuck, relaxed, w);
        p += n3*(exp(-tau*.6)*sin(tau*9. + q*105.)*min(gap*.1, 6.5)*(.35 + .65*a)*step(1e-5, tau)*step(0., q));
        vG = vec4(a, gap*(1. - clamp(w, 0., 1.)), step(0., q)*exp(-abs(uPeel.x - q)*uPeel.y*1.3)*smoothstep(0., 12., gap), aG.z);
        vF = clamp(w, 0., 1.);
        vNo = vec3(aNrm.x*cos(uDoor), aNrm.y, aNrm.x*sin(uDoor))*(.8*aG.w) + vec3(-sin(uDoor), 0., cos(uDoor))*.6;   // the strip's own smooth facing: out from the loop and in toward the box
        vec4 wp = modelMatrix*vec4(p, 1.); vW = wp.xyz;
        vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
        ${ee}
      }`,fragmentShader:`
      varying vec3 vW, vNo; varying vec4 vG; varying float vF;
      ${Q}${U}${te}
      void main(){
        vec3 Vv = cameraPosition - vW; vec3 V = Vv/max(length(Vv), 1e-3);
        vec3 n = cross(dFdx(vW), dFdy(vW)); n = n/max(length(n), 1e-9);
        if (dot(n, V) < 0.) n = -n;
        // the bellows are few and large: their flat faces are rounded off toward the strip's own facing, and the folds are shaded in
        vec3 ns = vNo/max(length(vNo), 1e-3); if (dot(ns, V) < 0.) ns = -ns;
        n = normalize(n*.55 + ns);
        // grey rubber in soft folds: deep valleys, pale ridges, fine ribs along its length
        float fc = cos(vG.x*18.85 + .45*sin(vW.y*.19)), fold = .42 + .58*smoothstep(-1., 1., fc);
        vec3 alb = vec3(.3, .33, .35)*fold*(.9 + .1*sin(vW.y*2.6 + vG.x*9.));
        vec3 col = lcShade(vW, n, V, alb, 14., .16);
        vec3 Lb = uBulbPos - vW; float att = lcBulbAtt(length(Lb));
        float fres = pow(max(1. - abs(dot(n, V)), 0.), 3.);
        // the box's own light on the rubber: the bulb is hooded from the door, so this is bounce off the white walls
        col += alb*uBulbCol*(uBulb*(.07 + .26*att)*(.55 + .45*fold)) + uBulbCol*(uBulb*.1*fres);
        // where it is still stretched from the door to the cabinet the kitchen shines through it: an even, dim amber
        // membrane with its folds a shade deeper, brightest where the zip has just let go
        float stretch = smoothstep(5., 36., vG.y);
        float wr = .5 + .5*sin(vW.y*1.7 + 2.5*sin(vW.y*.31) + vG.x*4.);          // tension wrinkles run along the pull
        col = mix(col, col*.3 + uWarmCol*vec3(1., .82, .62)*(uWarm*uBar.w*(.5 + .22*wr)), stretch*.9);
        col += uWarmCol*(uWarm*uBar.w*vG.z*.9*sin(vG.x*3.1416));
        // freed, it stands at the edge of the slot: a warm rim along every ridge on the kitchen side
        float nearSlot = min(exp(-(vW.x - uOrigin.x + 150.)/45.), 1.);
        // (seen from inside it is a dark shape against the kitchen: the light only catches the ridges turned to the slot and its edge)
        col += alb*uWarmCol*(uWarm*uBar.w*vF*nearSlot*(.3 + 1.8*smoothstep(.2, 1., fc))*clamp(.6 - n.x*.6, 0., 1.)) + uWarmCol*(uWarm*uBar.w*vF*nearSlot*fres*1.2);
        col += uWarmCol*(uDark.x*(1. - vF)*smoothstep(.7, 1., vG.x)*1.3);                          // before the bulb: the seal itself is a hairline of light
        gl_FragColor = vec4(fxApplyFog(max(col, vec3(0.))), 1.);
      }`})}function Je(e){const l=[];for(const c of E)l.push(xe(M(0,c-2,K+e/2,296,4,e,1.3,2),ke.set(1,1,1),0));const s=pe(l,!1);for(const c of l)c.dispose();return s}function We(e,l,s=!1,c=null){return new t.ShaderMaterial({fog:!0,transparent:!0,premultipliedAlpha:!0,depthWrite:!s,defines:s?{LC_CLEAR:1}:{},blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:{...oe(),...e,uFrost:{value:l},uLane:{value:c?new t.Vector4(c[0],c[1],c[2],c[3]):new t.Vector4(0,0,1,0)},uLaneW:{value:c?new t.Vector2(c[4],c[5]):new t.Vector2(-1e3,0)}},vertexShader:`
      varying vec3 vW, vN;
      ${J}
      void main(){
        vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vN = mat3(modelMatrix)*normal;
        vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
        ${ee}
      }`,fragmentShader:`
      varying vec3 vW, vN; uniform float uFrost; uniform vec4 uLane; uniform vec2 uLaneW;
      ${Q}${ne}${ue}${U}${te}
      void main(){
        vec3 N = vN/max(length(vN), 1e-4);
        vec3 Vv = cameraPosition - vW; float dist = max(length(Vv), 1e-3); vec3 V = Vv/dist;
        vec3 P = vW - uOrigin;
        float dz = max(P.z - ${K.toFixed(1)}, 0.);
        // a lane of bare glass the world may ask for: less mist on it, so what lies below shows through
        vec2 lr = P.xz - uLane.xy; float lt = dot(lr, uLane.zw), lw0 = uLaneW.x + uLaneW.y*max(lt, 0.);
        float lane = (1. - smoothstep(lw0 - 6., lw0 + 8., abs(lr.x*uLane.w - lr.y*uLane.z)))*step(-24., lt);
        float flat_ = smoothstep(.5, .9, abs(N.y));
        // frost ferns creeping in from the front edge, finer crystals inside them
        float fern = fbm(vec2(P.x*.045, P.z*.11) + 2.3);
        float fr = smoothstep(.62 - .22*uFrost, .86, fern + .3*exp(-dz/5.))*flat_;
        float crystal = vnoise(P.xz*1.9)*.6 + vnoise(P.xz*6.3)*.4;
        // the top is a sheet of frosted glass: a breath of mist all over it, feathered ferns of rime, and the pale rings
        // where cold jars have stood
        float top = flat_*step(0., N.y);
        float haze = top*(.3 + .7*fbm(P.xz*.017 + 7.3));
        // cold air creeping over the sheet toward the lip: a slow drifting breath, so the floor is never still
        float creep = top*smoothstep(.34, .74, fbm(P.xz*.042 + vec2(uTime*.07, uTime*.28)));
        haze = clamp(haze*.8 + creep*.6, 0., 1.)*(1. - .7*lane);
        vec2 fq = P.xz + 9.*vec2(fbm(P.xz*.035 + 1.3), fbm(P.xz*.035 + 6.1));
        float feather = top*smoothstep(.5, .78, fbm(vec2(fq.x*.05, fq.y*.19) + 4.))*smoothstep(.35, .6, fbm(P.xz*.011 + 2.));
        vec2 rc = P.xz/44., rid = floor(rc), rf = fract(rc) - .5, rr = hash22(rid + 3.1);
        float rd = abs(length(rf - (rr - .5)*.36) - (.14 + .12*rr.y))*44.;
        float ring = top*(1. - smoothstep(.4, 1.9, rd))*step(.42, rr.x)*(.35 + .65*vnoise(P.xz*.21 + 5.));
        float ndv = abs(dot(N, V)), milk = top*pow(max(1. - ndv, 0.), 1.5);
        float rime = clamp(max(fr, max(feather*.75, ring*.8)), 0., 1.);
        vec3 alb = mix(mix(vec3(.05, .12, .135), vec3(.42, .58, .62), haze*.62), vec3(.7, .82, .86)*(.7 + .3*crystal), rime);
        vec3 col = lcShade(vW, N, V, alb, 90., 1.2 - rime);
        float fres = pow(max(1. - ndv, 0.), 3.);
        vec3 Lb = uBulbPos - vW; float db = max(length(Lb), 1.); Lb /= db; float att = lcBulbAtt(db);
        col += uBulbCol*(uBulb*fres*.25) + uDiodeCol*(uDiode*fres*.05);
        // the bulb's long soft sheen on the misted sheet, and the sheet's own milk at a glancing angle
        vec3 Hs = normalize(Lb + V + vec3(0., 1e-3, 0.));
        col += uBulbCol*(uBulb*att*top*(.5*pow(max(dot(N, Hs), 0.), 7.)*(.4 + .6*haze) + .16*milk));
        // the light pipe: bulb light travels inside the glass and leaves at the edge
        float edge = (1. - flat_) + flat_*exp(-dz/2.6)*.55 + flat_*exp(-(148. - abs(P.x))/2.6)*.4;
        float streak = .75 + .25*vnoise(vec2(P.x*.35, 3.));
        col += uGreenCol*uGreenCol*(uBulb*edge*streak*3.2) + uGreenCol*(uBulb*edge*streak*.5) + uDiodeCol*((1. - uBulb)*uDiode*edge*.045);
        // what the sheet mirrors, laid over it as light. Lit: the pale box at a glancing angle, in broad soft bands, and the
        // kitchen's bar drawn out toward the eye as a long warm streak, broken by the frost. Before the bulb: the diode's gleam
        float gl = pow(max(1. - ndv, 0.), 2.);
        float bands = .5 + .5*vnoise(vec2(P.x*.028 + V.x*2.5, P.z*.011 + V.z*2.5 + 3.));
        vec3 refl = uBulbCol*(uBulb*att*top*(.07 + .55*gl)*bands*.8*(1. - .6*lane));
        vec3 camL = cameraPosition - uOrigin;
        vec2 dE = vec2(150. - 300.*cos(uDoor), -300.*sin(uDoor)), sA = vec2(-150., 0.), sm = (dE + sA)*.5;
        vec2 cs = sm - camL.xz; float csl = max(length(cs), 1.); cs /= csl;
        vec2 rp = P.xz - camL.xz; float al = dot(rp, cs), pd = abs(rp.x*cs.y - rp.y*cs.x);
        float hw = .5*abs((dE.x - sA.x)*cs.y - (dE.y - sA.y)*cs.x)*clamp(al/csl, 0., 1.) + 1.2 + max(al, 0.)*.025;
        float hS = P.y + (camL.y - P.y)*(csl - al)/max(al, 1.);                       // the height at which this point's mirrored ray meets the slot
        float brk = .35 + .65*smoothstep(.25, .75, vnoise(vec2(P.x*.9 + P.z*.4, P.z*.22 + 1.7)));
        float streakK = (1. - smoothstep(hw*.6, hw*1.5 + 1., pd))*smoothstep(uBar.y - 20., uBar.y + 30., hS)*(1. - smoothstep(380., 425., hS))*step(1., al)*step(al, csl);
        refl += (uWarmCol*uWarmCol*.6 + uWarmCol*.5)*(uWarm*uBar.w*top*streakK*brk*(.3 + .7*gl)*(.55 + .5*uDark.y));
        vec3 Ld = uDiodePos - vW; Ld = Ld/max(length(Ld), 1.);
        vec3 Hd = normalize(Ld + V + vec3(0., 1e-3, 0.));
        vec3 Nr = normalize(N + vec3(crystal - .5, 0., vnoise(P.xz*1.9 + 4.) - .5)*.07);
        refl += uDiodeCol*((1. - uBulb)*uDiode*top*(.3*pow(max(dot(Nr, Hd), 0.), 40.) + .08*pow(max(dot(Nr, Hd), 0.), 8.) + .02*gl)*(.6 + .4*haze));
        // and, at a glancing angle, the far haze of the box itself: the sheet is never a black floor
        #ifdef USE_FOG
          refl += fogColor*((1. - uBulb)*top*(.2 + 1.5*gl)*(.75 + .25*bands));
        #endif
        refl += uWarmCol*(uDark.x*lcLeak(P)*top*(.12 + .4*gl)*(.6 + .4*crystal)*.35);
        // clear glass: looked down through, the terrace below and the racks of the door show; it clouds toward a glancing angle
        float under = flat_*(1. - step(0., N.y));
        float alpha = clamp(.1 + under*.07 + top*(.05 + .2*haze + .34*milk) + rime*.8 + edge + fres*.5, 0., 1.);
        #ifdef LC_CLEAR
          if (alpha >= .55) discard;
        #else
          if (alpha < .55) discard;
        #endif
        gl_FragColor = vec4(fxFogPremult(max(col*alpha + refl, vec3(0.)), alpha), alpha);
      }`})}const Y=[264,165,42];function et(e,l,s,c){const f=[],r=4+2*s,i=e+1.5+1.3*s,d=K+1-r,x=i+1.5-r,P=l+6,h=c?14+6*s:7+3*s;for(let o=0;o<4;o++){const a=o/4;f.push([O(K+30-s*4,K+1,a),i+1.5*a,1+1.2*a])}for(let o=0;o<4;o++){const a=o/4*Math.PI/2;f.push([K+1-r*Math.sin(a),i+1.5-r*(1-Math.cos(a)),2.2+o*.3])}const A=o=>3*Math.pow(o,.8)+s*1.6*o+3*o*o;for(let o=0;o<12;o++){const a=o/12;f.push([d-A(a),O(x,P,a),3+2.5*a])}const C=d-A(1);for(let o=0;o<=6;o++){const a=o/6*Math.PI/2;f.push([C-h*Math.sin(a),P-6*(1-Math.cos(a)),5.5+(c?5:2)*(o/6)])}return f}async function tt(e,l){const s=[],c=[],f=[],r=[],i=[],d=Math.round(64*(l<.9?.75:1));for(let z=0;z<E.length;z++){const b=E[z],q=Y[z];for(let y=0;y<3;y++){await e.yield?.();const w=et(b,q,y,z===2),k=w.length-1,S=s.length/3;let L=0;const D=[0];for(let F=1;F<=k;F++)L+=Math.hypot(w[F][0]-w[F-1][0],w[F][1]-w[F-1][1]),D.push(L);for(let F=0;F<=k;F++){const V=w[Math.max(F-1,0)],T=w[Math.min(F+1,k)];let v=T[0]-V[0],m=T[1]-V[1];const N=Math.hypot(v,m)||1;v/=N,m/=N;for(let n=0;n<=d;n++)s.push(O(-147.5,147.5,n/d),w[F][1],w[F][0]),c.push(n/d,F/k),f.push(0,-v,m),r.push(z,y,D[F],w[F][2])}for(let F=0;F<k;F++)for(let V=0;V<d;V++){const T=S+F*(d+1)+V,v=T+d+1;i.push(T,v,T+1,v,v+1,T+1)}}}await e.yield?.();const x=new t.CatmullRomCurve3([[80,13,30],[10,14,31],[-50,15,29],[-100,18,23],[-134,23,6],[-157,25,-18],[-186,19,-46],[-216,4,-72],[-242,-26,-90],[-264,-66,-102]].map(z=>new t.Vector3(z[0],z[1],z[2])),!1,"catmullrom",.5),P=34,h=6,A=x.getLength(),C=new t.Vector3,o=new t.Vector3;for(let z=0;z<1;z++){const b=s.length/3,q=25;for(let y=0;y<=P;y++){const w=y/P;x.getPointAt(w,C),x.getTangentAt(w,o);const k=-o.z,S=o.x,L=Math.hypot(k,S)||1,D=Math.exp(-Math.pow((w-.6)/.2,2));for(let F=0;F<=h;F++){const V=(F/h-.5)*2,T=1-V*V;s.push(C.x+k/L*V*q,C.y-4+T*(2+3*D),C.z+S/L*V*q),c.push(F/h,w),f.push(0,1,0),r.push(3,z,w*A,3.5+3*D)}}for(let y=0;y<P;y++)for(let w=0;w<h;w++){const k=b+y*(h+1)+w,S=k+h+1;i.push(k,S,k+1,S,S+1,k+1)}}await e.yield?.();const a=new t.BufferGeometry;return a.setAttribute("position",new t.Float32BufferAttribute(s,3)),a.setAttribute("aUV",new t.Float32BufferAttribute(c,2)),await e.yield?.(),a.setAttribute("aOut",new t.Float32BufferAttribute(f,3)),a.setAttribute("aK",new t.Float32BufferAttribute(r,4)),a.setIndex(i),a.computeBoundingSphere(),a.boundingSphere.radius+=20,a}function ot(e,l){return new t.ShaderMaterial({fog:!0,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:t.DoubleSide,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:{...oe(),...e,uFogAmt:{value:l}},vertexShader:`
      attribute vec2 aUV; attribute vec3 aOut; attribute vec4 aK;
      uniform float uTime;
      varying vec3 vW; varying vec2 vUV; varying vec4 vK; varying vec3 vNo; varying float vFold;
      ${J}
      void main(){
        vec3 p = position;
        float b = sin(p.x*.052 + aK.z*.09 - uTime*.55 + aK.y*2.1) + .8*sin(p.x*.023 - aK.z*.047 - uTime*.33 + aK.x*1.7) + .5*sin(p.x*.11 + aK.z*.2 - uTime*.9 + aK.y);
        // drapery: slow folds that travel along the curtain, so that it reads when it is looked along
        float arg = p.x*.15 + aK.y*2.3 + aK.x*1.1 + .7*sin(aK.z*.045 - uTime*.35 + p.x*.031);
        float fold = sin(arg);
        float hang = smoothstep(26., 48., aK.z)*step(aK.x, 2.5);
        p += aOut*(aK.w*(.35 + .42*b) + hang*2.4*fold);
        // the face of the sheet turns with its folds: where it turns edge-on to the eye it thins away, so no fold shows a hard outline
        vNo = mat3(modelMatrix)*(aOut - vec3(1., 0., 0.)*(hang*.36*cos(arg)));
        vUV = aUV; vK = aK; vFold = hang*fold;
        vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz;
        vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
        ${ee}
      }`,fragmentShader:`
      varying vec3 vW; varying vec2 vUV; varying vec4 vK; varying vec3 vNo; varying float vFold;
      uniform vec3 uFalls; uniform float uFogAmt;
      ${Q}${ne}${ue}${U}${ze}${te}
      void main(){
        vec3 P = vW - uOrigin;
        float idx = vK.x, layer = vK.y, s = vK.z, t = uTime;
        float foot = lcFoot(P);                              // at the foot of the slot the fog shows its rolling (see GLSL_FOOT)
        float dist = length(cameraPosition - vW);
        vec3 Vd = (cameraPosition - vW)/max(dist, 1e-3);
        float facing = abs(dot(vNo/max(length(vNo), 1e-4), Vd));
        float bar = lcBar(P);
        float att = lcBulbAtt(length(uBulbPos - vW));
        vec3 amb = mix(uDarkCol, uShadowCol*(1.1*uKey.y), uBulb)*.7;
        vec3 c; float a;
        if (idx > 2.5) {
          // the river on the canyon floor: a low, slow sheet under the puffs
          float prog = clamp(uFalls.z*1.6 - .5, 0., 1.);
          float ax = vUV.x*46.;
          vec2 q = vec2(ax*.034 + layer*3.7 + idx*1.3, s*.0085);
          float n1 = fbm(vec2(q.x, q.y - t*.1));
          float n2 = fbm(vec2(q.x*2.4 + 5., q.y*2.7 - t*.2) + n1*.7);
          float dens = n1*.62 + n2*.46;
          float tongue = fbm(vec2(ax*.028 + idx*9., t*.02));
          float front = prog*1.42 - .38*tongue;
          float fm = 1. - smoothstep(front - .09, front, vUV.y);
          float vfade = smoothstep(0., .1, vUV.y)*(1. - smoothstep(.5, 1., vUV.y));
          float ufade = smoothstep(0., .48, vUV.x)*(1. - smoothstep(.52, 1., vUV.x));
          a = smoothstep(.37 + .1*vUV.y*vUV.y, .67 + .05*vUV.y, dens + .06)*fm*vfade*ufade*.34;
          float low = mix(.5, 1., smoothstep(10., 230., P.y));
          c = uBulbCol*(uBulb*(.52 + .55*att)*1.1*low)*mix(vec3(.66, .9, 1.), vec3(1.), dens*low) + amb;
          c = mix(c, uWarmCol*(uWarm*.8) + c*.1, bar*.9);
          c *= .6 + .5*dens;
          // the river rolls as it leaves: billows a dozen metres across travelling with the flow, their crowns catching the bulb's cold light
          float lobe = lcRoll(vec2(ax*.08 + 3., s*.065 - t*.12), t);
          a *= mix(1., .65 + .6*lobe, foot);
          c = mix(c*mix(1., .7 + .42*lobe, foot), uBulbCol*vec3(.8, .93, 1.)*(uBulb*(.42 + .5*att)), foot*.3*lobe*lobe);
        } else {
          float top = idx < .5 ? ${E[0].toFixed(1)} : (idx < 1.5 ? ${E[1].toFixed(1)} : ${E[2].toFixed(1)});
          float bottom = idx < .5 ? ${Y[0].toFixed(1)} : (idx < 1.5 ? ${Y[1].toFixed(1)} : ${Y[2].toFixed(1)});
          float prog = idx < .5 ? uFalls.x : (idx < 1.5 ? uFalls.y : uFalls.z);
          float low = step(1.5, idx);                                    // the bottom fall is the thinnest: the crispers are seen through it
          float hh = clamp((top - P.y)/(top - bottom), 0., 1.3);          // 0 at the shelf top, 1 where the foot dissolves
          float fall = smoothstep(.2, .34, vUV.y);                        // 0 on the shelf, 1 from the lip down
          float xs = P.x + layer*37. + idx*91.;
          float yy = P.y + t*(7.5 + layer*1.8);                           // the pattern falls with the fog
          float veil = fbm(vec2(xs*.022, yy*.012));                       // broad veils
          float big = fbm(vec2(xs*.009 + 4., yy*.021 - t*.03));           // slow billows tens of metres across
          float thr = fbmLo(vec2(xs*.07 + veil*1.4, yy*.034 + 3.));       // rolls a dozen metres wide
          float fine = vnoise(vec2(xs*.21, yy*.09));
          float creep = fbm(vec2(xs*.04, s*.07 - t*.12));
          float d = mix(creep, veil*.42 + big*.3 + thr*.34 + fine*.06, fall);
          // dense under the lip, breaking into threads with air between as it falls
          float lo = mix(.42, mix(.17, .52, smoothstep(.1, 1., hh)), fall) + layer*.04 + low*.05;
          float body = smoothstep(lo, lo + .26, d);
          // the ragged end: tongues of different lengths that dissolve before the next terrace
          float tongue = fbm(vec2(xs*.05, t*.03 + idx*9.));
          float end = 1. - smoothstep(.56 + .36*tongue, .86 + .36*tongue, hh);
          // growing down from the lip when the door first opens
          float front = prog*1.5 - .4*tongue - layer*.03;
          float fm = 1. - smoothstep(front - .1, front, vUV.y);
          float ufade = smoothstep(0., .03, vUV.x)*(1. - smoothstep(.97, 1., vUV.x));
          float vfade = smoothstep(0., .1, vUV.y)*(1. - smoothstep(.86, 1., vUV.y));
          // only a thin roll goes over the edge of the glass, so the edge burns through it; the curtain gathers a few metres below
          float dense = 1. - smoothstep(top - 13., top - 5., P.y);
          float thin = mix(.42 - low*.26 - .2*(1. - step(.5, idx)), .46 - low*.08, fall);          // (and on the top terrace: the glass and what the jars throw on it show through)                // on the bottom terrace the creep is a breath: the glass and what stands on it stay dark
          float a0 = body*end*fm*ufade*vfade*mix(thin, .93 - layer*.1 - low*.12, dense*fall);
          // looked along, a curtain is deeper, not thinner; but where a fold turns edge-on it fades, so nothing has a hard outline
          a = 1. - pow(max(1. - a0, 1e-3), 1./clamp(facing, .26, 1.));
          // far off a fold only fades where it turns edge-on; near the eye a sheet looked along thins right away, so the air beside the route is clear
          a *= mix(smoothstep(.16, .62, facing), smoothstep(.0, .1, facing), smoothstep(34., 96., dist));
          a = min(a*mix(1., 1.4, smoothstep(40., 120., dist)), .96);                 // and from across the canyon each fall is a white sheet, not a wisp
          // lit from above and behind: the rolled top is the brightest, thick fog is white, thin fog takes the teal of the shade
          float rr = (P.y - (top - 15.))/8., roll = exp(-rr*rr);
          float lightK = (1.02 - .42*smoothstep(0., 1., hh) + .22*roll)*mix(.5, 1.1, body*body);
          c = uBulbCol*(uBulb*(.5 + .6*att)*lightK)*mix(vec3(.62, .88, 1.), vec3(1.), body) + amb;
          // the green of the glass edge in the fog that goes over it
          float glow = exp(-max(top - 3. - P.y, 0.)/9.)*smoothstep(.1, .3, vUV.y);
          c = mix(c, uGreenCol*(uBulb*1.2) + c*.3, glow*.6);
          c = mix(c, uWarmCol*(uWarm*.85)*(.62 + .5*body) + c*.12, bar*.9);
          c *= .84 + .36*vFold;
          // by the slot the fall is seen from close: it comes over the lip and down in rolls (about 13 m wide, 17 m tall, falling
          // with the pattern) with thin air in the creases, the crown of each roll cold where the bulb reaches it
          float lobe = lcRoll(vec2(xs*.075, yy*.06), t);
          a = min(a*mix(1., .6 + .55*lobe, foot), .96);
          c = mix(c*mix(1., .7 + .42*lobe, foot), uBulbCol*vec3(.8, .93, 1.)*(uBulb*(.42 + .5*att)), foot*.3*lobe*lobe*(1. - .5*min(hh, 1.)));
        }
        a *= smoothstep(20., 84., dist)*mix(.62, 1., smoothstep(70., 180., dist))*uFogAmt;                 // the sheets thin where the route runs close under them: clear air round the camera
        gl_FragColor = vec4(fxFogPremult(max(c, vec3(0.))*a, a), a);
      }`})}function at(){const e=new t.PlaneGeometry(1,1,14,8),l=e.attributes.position.count,s=[];for(const f of[.1,.3,.5,.7,.9]){const r=e.clone();r.setAttribute("aF",new t.BufferAttribute(new Float32Array(l).fill(f),1)),s.push(r)}const c=pe(s,!1);for(const f of s)f.dispose();return e.dispose(),c.boundingSphere=new t.Sphere(new t.Vector3(-100,210,90),300),c}function lt(e){return new t.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneFactor,uniforms:{...oe(),...e},vertexShader:`
      attribute float aF; uniform float uDoor; uniform vec4 uBar; uniform vec3 uOrigin;
      varying vec3 vW; varying vec3 vL; varying vec3 vNs;
      ${J}
      void main(){
        vec2 E = vec2(150. - 300.*cos(uDoor), -300.*sin(uDoor));
        float z = mix(E.y + 6., 238., uv.x), y = mix(12., 410., uv.y);
        float xr = E.x + (z - E.y)*uBar.x, xl = -150.;
        vec3 p = vec3(mix(xl, xr, aF), y, z);
        vL = vec3(uv.x, uv.y, aF); vNs = normalize(vec3(1., 0., -uBar.x*aF));
        vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz;
        vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
        ${ee}
      }`,fragmentShader:`
      varying vec3 vW; varying vec3 vL; varying vec3 vNs;
      ${Q}${ne}${ue}${U}${te}
      void main(){
        vec3 P = vW - uOrigin;
        vec3 Vv = cameraPosition - vW; float dist = max(length(Vv), 1e-3); vec3 V = Vv/dist;
        float n = fbm(vec2(P.z*.012 - uTime*.03, P.y*.02 + vL.z*7.));
        // shafts: the door's racks and bottles stand in the light's way, so it comes in as bands that drift as the door swings
        float shaft = .3 + .7*smoothstep(.3, .7, vnoise(vec2(P.y*.05 + vL.z*3.1 + uDoor*9., P.z*.004 - uTime*.015)));
        float a = (.012 + .05*n*n)*shaft*smoothstep(0., .1, vL.x)*(1. - smoothstep(.4, 1., vL.x))*smoothstep(0., .08, vL.y)*(1. - smoothstep(.85, 1., vL.y));
        a *= smoothstep(uBar.y - 12., uBar.y + 10., P.y)*uBar.w*uWarm;
        a *= smoothstep(14., 70., dist)*smoothstep(.05, .45, abs(dot(vNs, V)));
        gl_FragColor = vec4(uWarmCol*(a*2.*uKey.w*(1. - fxFog())), 0.);
      }`})}function st(){const e=[],l=[],s=[],c=(r,i,d,x,P)=>{const h=e.length/3;e.push(...r,...i,...d,...x),l.push(0,P,0,P,1,P,1,P),s.push(h,h+1,h+2,h+1,h+3,h+2)};for(const r of E){const i=K-.35;c([-147.5,r-4.3,i],[147.5,r-4.3,i],[-147.5,r+.3,i],[147.5,r+.3,i],0),c([-147.5,r+.14,i],[147.5,r+.14,i],[-147.5,r+.14,i+6],[147.5,r+.14,i+6],1)}const f=new t.BufferGeometry;return f.setAttribute("position",new t.Float32BufferAttribute(e,3)),f.setAttribute("aV",new t.Float32BufferAttribute(l,2)),f.setIndex(s),f.computeBoundingSphere(),f}function rt(e){return new t.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneFactor,uniforms:{...oe(),...e},vertexShader:`
      attribute vec2 aV; varying vec3 vW; varying vec2 vV;
      ${J}
      void main(){
        vV = aV; vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz;
        vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
        ${ee}
      }`,fragmentShader:`
      varying vec3 vW; varying vec2 vV;
      ${Q}${ne}${U}${te}
      void main(){
        vec3 P = vW - uOrigin;
        float t = vV.x - .5;
        float core = vV.y < .5 ? (.3 + .7*exp(-t*t*22.))*(1. - smoothstep(.36, .5, abs(t))) : exp(-vV.x*mix(9., 4.5, uDark.y))*mix(.55, .8, uDark.y)*(1. - smoothstep(.7, 1., vV.x));
        float streak = .72 + .28*vnoise(vec2(P.x*.35, 3.));
        float ends = smoothstep(0., 5., 147.5 - abs(P.x));
        // a green-white line of light; the two lower lips burn a little harder, so all three read from the canyon
        vec3 col = (uGreenCol*uGreenCol*2.1 + uGreenCol*.55 + uBulbCol*(core*core*(.25 + .75*uDark.y)))*(uBulb*core*streak*ends*(1. + .35*smoothstep(300., 240., P.y) + .5*uDark.y));
        gl_FragColor = vec4(col*(1. - fxFog()), 0.);
      }`})}function it(e,l,s,c){const f=Math.round(150*l),r=Math.round(170*l),i=f*3+r,d=new t.InstancedBufferGeometry;d.setAttribute("position",new t.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),d.setIndex([0,1,2,0,2,3]);const x=new Float32Array(i*4),P=new Float32Array(i*4);for(let C=0;C<i;C++){const o=C<f*3?Math.floor(C/f):3;x.set([e.range(-146,146),e(),e.range(.75,1.3),o],C*4),P.set([e(),e(),e(),e()],C*4)}d.setAttribute("aSeed",new t.InstancedBufferAttribute(x,4)),d.setAttribute("aRnd",new t.InstancedBufferAttribute(P,4)),d.instanceCount=i,d.boundingSphere=new t.Sphere(new t.Vector3(-20,170,20),330);const h=new t.ShaderMaterial({fog:!0,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:{...oe(),...s,uFogAmt:{value:c}},vertexShader:`
      attribute vec4 aSeed, aRnd; uniform vec3 uFalls; uniform float uTime, uFogAmt;
      varying vec2 vUv; varying vec3 vW; varying vec4 vP; varying float vUp;   // vP: alpha, seed, t, river; vUp: -1 underside .. 1 top, on screen
      ${J}
      void main(){
        float idx = aSeed.w, river = step(2.5, idx), pool = step(1.5, idx)*(1. - river);
        float t = fract(aSeed.y + uTime*mix(.06 + .025*aRnd.x, .085 + .04*aRnd.x, river));
        float top = idx < .5 ? ${E[0].toFixed(1)} : (idx < 1.5 ? ${E[1].toFixed(1)} : ${E[2].toFixed(1)});
        float bottom = idx < .5 ? ${Y[0].toFixed(1)} : (idx < 1.5 ? ${Y[1].toFixed(1)} : ${Y[2].toFixed(1)});
        // a quarter of its life rolling over the lip, a quick thin drop close to the shelf front, a long billow at the foot
        float t1 = clamp(t/.24, 0., 1.), t2 = clamp((t - .24)/.4, 0., 1.), t3 = clamp((t - .64)/.36, 0., 1.);
        vec3 c = vec3(aSeed.x + sin(uTime*.3 + aRnd.w*6.2832)*3.,
                      top + 2.5 + aRnd.y*2. + 1.5*sin(t1*3.1416) - (top - bottom - 7.)*pow(t2, 1.3) - (3. + 4.*pool)*t3,
                      ${K.toFixed(1)} + 18.*(1. - t1)*(1. - t1) - 2.5*t1 - (3.5 + aRnd.y*4.)*pow(t2, .6) - 3.*t2*t2 - (6. + aRnd.y*7. + 12.*pool)*t3);
        float k = 1. - t;
        vec3 rv = k*k*k*vec3(70., 15., 30.) + 3.*k*k*t*vec3(-95., 22., 28.) + 3.*k*t*t*vec3(-168., 38., -22.) + t*t*t*vec3(-262., -44., -100.);
        rv += vec3(0., aRnd.y*9. - 5., 0.) + (aRnd.w - .5)*vec3(14., 0., 44.)*(1. - .4*t);
        c = mix(c, rv, river);
        float size = mix(6.5 + 3.*t1 + 2.*t2 + (9. + 10.*pool)*t3, mix(17., 30., aRnd.z), river)*aSeed.z;
        float prog = idx < .5 ? uFalls.x : (idx < 1.5 ? uFalls.y : uFalls.z);
        prog = mix(prog, clamp(uFalls.z*1.6 - .5, 0., 1.), river);
        float front = prog*1.3 - .15*aRnd.z;
        float a = smoothstep(0., .08, t)*(1. - smoothstep(.82, 1., t))*(1. - smoothstep(front - .08, front, t));
        // a wisp while it drops (long, thin, faint), a billow at the foot
        float drop = sin(t2*3.1416)*(1. - river);
        a *= 1. - .5*drop;
        vec4 wc = modelMatrix*vec4(c, 1.);
        vec4 mvPosition = viewMatrix*wc;
        float rot = mix((aRnd.z - .5)*1.4*(1. - .8*drop), aRnd.z*6.2832, river) + uTime*.2*(aRnd.x - .5)*(1. - drop);
        vec2 q = mat2(cos(rot), sin(rot), -sin(rot), cos(rot))*(position.xy*vec2(mix(1., 1.5, river) - .3*drop, 1. + 1.5*drop))*size;
        vUp = q.y/max(size*.5, 1e-3);
        a *= smoothstep(12., 48., -mvPosition.z)*uFogAmt;
        vW = wc.xyz + (vec3(q, 0.)*mat3(viewMatrix));
        mvPosition.xy += q;
        vUv = position.xy*2.; vP = vec4(a, aRnd.w, t, river);
        gl_Position = a < .003 ? vec4(2., 2., 2., 1.) : projectionMatrix*mvPosition;
        ${ee}
      }`,fragmentShader:`
      varying vec2 vUv; varying vec3 vW; varying vec4 vP; varying float vUp;
      ${Q}${ne}${ue}${U}${ze}${te}
      void main(){
        vec3 P = vW - uOrigin;
        float r = length(vUv);
        float n = fbmLo(vUv*1.4 + vP.y*23. + vec2(0., uTime*.06));
        float d = (1. - r*r)*(.28 + 1.35*n) - .22 - .16*vnoise(vUv*4.6 + vP.y*51. - vec2(0., uTime*.1));
        float a = smoothstep(0., .95, d)*vP.x*mix(.6, .5, vP.w);
        float att = lcBulbAtt(length(uBulbPos - vW));
        float low = mix(.5, 1., smoothstep(10., 230., P.y));
        // lit from above: a bright crown, a teal underside
        float crown = smoothstep(-.75, .65, vUp + (n - .5)*.9);
        vec3 c = uBulbCol*(uBulb*(.42 + .58*att)*low*mix(.5, 1.16, crown))*mix(vec3(.55, .84, 1.), vec3(1.), n*low*crown);
        c += mix(uDarkCol, uShadowCol*(1.1*uKey.y), uBulb)*.7;
        c = mix(c, uGreenCol*(uBulb*1.4) + c*.15, (1. - vP.w)*exp(-abs(vP.z - .2)/.08)*.6);
        c = mix(c, uWarmCol*(uWarm*.85)*mix(.34, 1.1, crown) + c*mix(.55, .1, crown), lcBar(P)*.9*mix(.5, 1., crown));
        c *= .8 + .28*n;
        // at the foot of the slot every billow shows its lobes, turning over: thin in the creases, the crowns cold where the bulb reaches them
        float foot = lcFoot(P), roll = lcRoll(vUv*1.5 + vP.y*37., uTime);
        a *= mix(1., .66 + .48*roll, foot);
        c = mix(c*mix(1., .7 + .42*roll, foot), uBulbCol*vec3(.8, .93, 1.)*(uBulb*(.42 + .5*att)), foot*.3*roll*roll*smoothstep(.2, .9, crown));
        gl_FragColor = vec4(fxFogPremult(c*a, a), a);
      }`}),A=new t.Mesh(d,h);return A.renderOrder=5.5,A.frustumCulled=!0,A}function De(e,l,s,c){const f=Ee(Ce[e],c),r=new t.InstancedBufferGeometry,i=l.length;r.index=f.index,r.setAttribute("position",f.attributes.position),r.setAttribute("normal",f.attributes.normal),r.setAttribute("aPart",f.attributes.aPart);const d=new Float32Array(i*3),x=new Float32Array(i*4),P=new Float32Array(i*4),h=new Float32Array(i*4),A=new Float32Array(i*2);l.forEach((o,a)=>{d.set([o.x,o.y,o.z],a*3),x.set([o.R,o.H,o.fill,o.phase],a*4),P.set(o.liq,a*4),h.set([o.cap[0],o.cap[1],o.cap[2],1],a*4),A.set([o.fizz,Math.min(o.lit,2)],a*2)}),r.setAttribute("aBase",new t.InstancedBufferAttribute(d,3)),r.setAttribute("aDim",new t.InstancedBufferAttribute(x,4)),r.setAttribute("aLiq",new t.InstancedBufferAttribute(P,4)),r.setAttribute("aCap",new t.InstancedBufferAttribute(h,4)),r.setAttribute("aFx",new t.InstancedBufferAttribute(A,2)),r.instanceCount=i,r.boundingSphere=new t.Sphere(new t.Vector3(0,210,20),265);const C=new t.Mesh(r,s);return C.renderOrder=2,C}function nt(e,l){const s=e&&e.hour;if(s==="dawn"||s==="day")return"morning";if(s==="golden")return"party";if(s==="night")return l.chance(.4)?"party":"midnight";const c=l();return c<.4?"midnight":c<.7?"morning":"party"}async function dt(e,l={}){const s=e.rng.fork?e.rng.fork("the-light-comes-on-door"):e.rng,c=(l.palette&&l.palette.length>=7?l.palette:Ve).map(u=>new t.Color(u)),f=e.quality&&e.quality.detail||1,r=e.vary||{},i=l.variant||nt(r,s),d=l.density??r.density??1,x=l.duration||Ge,P=l.frost??s.range(.25,1),h=new t.Vector3().fromArray(l.bulbPos||[95,408,90]),A=new t.Vector3().fromArray(l.diodePos||[0,414,180]),C=i==="morning"?new t.Color(1,.9,.68):c[5].clone(),o=[new t.Color("#FF7FA8"),new t.Color("#FFC45A"),new t.Color("#A78BFF")],a={uTime:{value:0},uBulb:{value:1},uWarm:{value:1},uDiode:{value:1},uDoor:{value:0},uBulbPos:{value:h.clone()},uDiodePos:{value:A.clone()},uOrigin:{value:new t.Vector3},uBulbCol:{value:c[3].clone()},uWarmCol:{value:C.clone()},uDiodeCol:{value:c[4].clone()},uShadowCol:{value:c[1].clone()},uDarkCol:{value:c[0].clone()},uGreenCol:{value:c[4].clone()},uBar:{value:new t.Vector4(.3,430,i==="morning"?.9:0,0)},uKey:{value:i==="morning"?new t.Vector4(.24,1,.3,.5):i==="party"?new t.Vector4(.05,2.3,.2,2.2):new t.Vector4(.04,2.5,.2,2.6)},uDark:{value:new t.Vector4(0,0,1,0)},uSlosh:{value:new t.Vector4(0,0,0,.012)},uPeel:{value:new t.Vector2(0,(de[1]-de[0])*x)},uFalls:{value:new t.Vector3}};i==="morning"?a.uShadowCol.value.setRGB(.07,.15,.125):i==="party"&&a.uShadowCol.value.setRGB(.0075,.0125,.04);const z=i==="morning"?.85:i==="party"?.95:1,b=[34,130,224,316].map((u,R)=>u+(R===0?s.range(-1,3):s.range(-3,3)));s.pick([["b","e","s"],["s","e","b"],["e","b","s"],["s","b","e"],["b","s","e"],["e","s","b"]]);const q=["s","e","b"],y={butterX:0,eggX:0,bottleSpans:[]};{let u=-118;const R={b:66,e:100,s:62};for(const _ of q)_==="b"?y.butterX=u+33:_==="e"?y.eggX=u+50:y.bottleSpans.push([u,u+R.s]),u+=R[_]+4}const w=Ue(s,i,b,y,d),k=new t.Group;k.name="the-light-comes-on:door";const S=new t.Group;S.position.set(fe,0,0),k.add(S);const L=u=>(u.position.x=-fe,S.add(u),u),D=Ne(a,P);await e.yield?.(),L(new t.Mesh(await je(e,s,b,y,w,h.toArray()),D)),await e.yield?.(),l.frame!==!1&&k.add(new t.Mesh(Ye(),D)),await e.yield?.();const F=new t.Mesh(Ze(),Qe(a));k.add(F),await e.yield?.();const V=qe(a),T=28;for(const u of Object.keys(Ce)){const R=w.filter(_=>_.profile===u);R.length&&(L(De(u,R,V,T)),await e.yield?.())}await e.yield?.();const v=l.shelfDepth??34;if(v>0){const u=new t.Mesh(Je(v),We(a,P,!1,l.lane));u.renderOrder=1,k.add(u);const R=new t.Mesh(u.geometry,We(a,P,!0,l.lane));R.renderOrder=2.5,k.add(R)}await e.yield?.();let m=null,N=null;if(l.fogFalls!==!1&&(m=new t.Mesh(await tt(e,f),ot(a,i==="morning"?.72:1)),m.renderOrder=5,k.add(m)),await e.yield?.(),l.fogFalls!==!1&&k.add(it(s,f,a,i==="morning"?.72:1)),l.barGlow!==!1&&(N=new t.Mesh(at(),lt(a)),N.renderOrder=6,k.add(N)),v>0){const u=new t.Mesh(st(),rt(a));u.renderOrder=5.8,k.add(u)}await e.yield?.();const n={bulb:null,warm:null,diode:null,door:null,peel:null,falls:null};let g=l.progress!=null,p=l.progress??.33;const W=u=>u>=.975?-100:u<=.06?430:ae+(1-(u-.06)/.9)*(he-ae);function G(u){p=u;const R=(n.door??Se(u))*re;a.uDoor.value=R,S.rotation.y=-R;const _=n.peel??_e(u);a.uPeel.value.x=_,a.uBar.value.y=W(_),a.uBar.value.w=H(.25*re,2.5*re,R);for(let $=0;$<3;$++)a.uFalls.value.setComponent($,n.falls?n.falls[$]:Z((u-Pe[$][0])/(Pe[$][1]-Pe[$][0]),0,1));a.uSlosh.value.x=Be(u,x,.42,.4,.3),a.uSlosh.value.y=Be(u,x,.31,.3,1.5),a.uSlosh.value.z=.032*Be(u,x,.5,1.3,0),a.uBulb.value=n.bulb??H(.1,.1+.35/x,u),a.uWarm.value=(n.warm??H(.1,.2,u))*z}G(p);const B=(u,R,_)=>new t.Vector3(u,R,_),se=B(-95,92,-8),X=B(-150,72,-21),we={hinge:B(fe,210,0),latchShut:B(-150,210,0),latchAt12:B(150-300*Math.cos(12*re),210,-300*Math.sin(12*re)),latchAt15:B(150-300*Math.cos(15*re),210,-300*Math.sin(15*re)),portalSeat:{position:X,facing:se.clone().sub(X).normalize(),radius:7,slotWidth:43},exitLine:[se,X],flyThrough:[B(70,345,110),B(34,343,46),B(4,338,24),B(-24,312,28),B(-52,250,31),B(-76,170,28),B(-90,118,14),se,X],viewpoints:{remember:B(-12,346,172),hairpin:B(14,341,24),dive:B(-58,236,31),canyonFloor:B(-84,124,18),exit:B(-116,84,-13),whole:B(0,240,236)},lookAt:{door:B(-30,300,0),topRack:B(0,b[3]+32,18),hairpinRack:B(84,b[3]+31,20),slot:B(-146,250,-30),slotFoot:B(-150,80,-22),falls:B(0,215,48)},bulb:h.clone(),diode:A.clone(),shelfEdges:E.map(u=>({from:B(-148,u,K),to:B(148,u,K)})),fallFeet:[B(0,Y[0]+3,50),B(0,Y[1]+3,50),B(0,18,40)],river:[B(80,14,30),B(-50,16,29),B(-134,28,6),B(-157,32,-18),B(-216,8,-72)],rackFloors:b.slice(),rackFrontZ:38,bottles:w.map(u=>({position:B(u.x,u.y,u.z),radius:u.R,height:u.H,rack:u.rack,kind:u.profile,fizz:!!u.fizz})),butterBox:B(y.butterX,b[be]+20,19),eggTray:B(y.eggX,b[be]+12,19),keepOut:[{min:B(-150,10,-36),max:B(150,410,39),note:"door volume when shut; it rotates about the hinge by hero.doorAngle()"}]};return{object:k,radius:235,height:420,center:B(0,215,10),anchors:we,ground:!1,groundY:0,variant:i,uniforms:a,glsl:{light:U,beads:ge},pivot:S,setProgress(u){g=!0,G(Z(u,0,1))},setBulb(u){n.bulb=u,a.uBulb.value=u??a.uBulb.value},setWarm(u){n.warm=u,u!=null&&(a.uWarm.value=u*z)},setDiode(u){n.diode=u},setDoor(u){n.door=u,G(p)},setPeel(u){n.peel=u,G(p)},setFalls(u,R,_){n.falls=u==null?null:[u,R,_],G(p)},doorAngle(){return a.uDoor.value},peelPoint(u=new t.Vector3){return u.set(-146,Z(a.uBar.value.y,ae,he),-4)},doorPoint(u,R=new t.Vector3){const _=a.uDoor.value,$=Math.cos(_),ce=Math.sin(_),ve=u.x-fe,Fe=u.z;return R.set(fe+ve*$-Fe*ce,u.y,ve*ce+Fe*$)},update(u,R,_){if(a.uTime.value=R,k.updateWorldMatrix(!0,!1),a.uOrigin.value.setFromMatrixPosition(k.matrixWorld),a.uBulbPos.value.copy(h).applyMatrix4(k.matrixWorld),a.uDiodePos.value.copy(A).applyMatrix4(k.matrixWorld),g||G(Z(.1+(R-4)*.022,0,1)),a.uDiode.value=n.diode??.8+.2*Math.sin(R*.8),i==="party"){const $=R/6,ce=Math.floor($)%3,ve=H(.2,.8,$-Math.floor($));a.uWarmCol.value.copy(o[ce]).lerp(o[(ce+1)%3],ve)}},dispose(){}}}export{ge as GLSL_BEADS,ze as GLSL_FOOT,U as GLSL_LIGHT,Ce as PROFILES,De as bottleMesh,dt as buildHero,Se as doorAngleDeg,Ne as enamelMaterial,qe as glassMaterial,me as knob,Me as latheProfile,xe as paint,nt as pickVariant,M as rbox,ie as rod,$e as tube};
