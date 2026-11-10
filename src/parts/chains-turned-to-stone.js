import*as i from"three";import"three/addons/utils/BufferGeometryUtils.js";import{clamp as O,lerp as E,smoothstep as st}from"../kit/core.js";const It={rowsX:[-45,-15,15,45],nZ:9,pitchZ:36,z0:-144,thrX:[-56,-30,0,30,56],thrZ0:-126,nThrZ:8,aGreat:6.5,aLess:4,bLow:2.2,bLowLess:1.75,bUp:8,neckY:66,collarY:72,halfX:64,halfZ:162,fork1:30,fork2:44,deep:-66},zt=["#C9B28A","#F2EEE3","#1E4FA3","#2FA6A0","#E3A72F","#C8452B","#23201E"],n=It,ct=t=>O(Math.round(t/30),-2,2),nt=t=>Math.abs(t)===2?Math.sign(t)*56:t*30,ft=t=>O(Math.round((t-n.thrZ0)/36),0,n.nThrZ-1),at=t=>n.thrZ0+36*t,Vt=(t,e,o,h)=>{const a=Math.abs(t)>50,c=a?n.aLess:n.aGreat,s=a?n.bLowLess:n.bLow,l=((o-t)*(o-t)+(h-e)*(h-e))/(c*c);return n.neckY-s*Math.sqrt(Math.max(l-1,0))};function it(t,e){const o=ct(t),h=ft(e);let a=-1e9;for(let c=Math.max(-2,o-1);c<=Math.min(2,o+1);c++)for(let s=Math.max(0,h-1);s<=Math.min(n.nThrZ-1,h+1);s++)a=Math.max(a,Vt(nt(c),at(s),t,e));return a}function lt(t,e){const o=67.3+1.5*Math.sin(t*.19+.7)*Math.cos(e*.115)+.9*Math.sin(e*.27+t*.06)+.6*Math.cos(t*.41-e*.05),h=nt(ct(t)),a=at(ft(e)),c=Math.abs(h)>50?n.aLess:n.aGreat,s=Math.hypot(t-h,e-a)/c,l=E(n.collarY,o+.9*Math.exp(-Math.pow(Mt(t,e)/1.5,2)),st(1.3,2.3,s)),u=Math.min(n.halfX-Math.abs(t),n.halfZ-Math.abs(e));return E(it(t,e)+1.4,l,st(0,9,u))}function Mt(t,e){const o=Math.abs(t),h=Math.min(Math.abs(o-15),Math.abs(o-45)),a=e-n.thrZ0-18,c=Math.abs(a-36*O(Math.round(a/36),0,n.nThrZ-2));return Math.min(h+.8*Math.sin(e*.21),c+.8*Math.sin(t*.17))}const Ft=[.59719,.076,.0284,.35458,.90834,.13383,.04823,.01566,.83777],Bt=[1.60475,-.10208,-.00327,-.53108,1.10813,-.07276,-.07367,-.00605,1.07602],kt=t=>new i.Matrix3().fromArray(t).invert().elements,St=kt(Ft),Pt=kt(Bt),At=t=>t.map(e=>e.toFixed(6)).join(",");function Gt(t,e=1){const o=(s,l)=>[s[0]*l[0]+s[3]*l[1]+s[6]*l[2],s[1]*l[0]+s[4]*l[1]+s[7]*l[2],s[2]*l[0]+s[5]*l[1]+s[8]*l[2]],a=o(Pt,[t.r,t.g,t.b].map(s=>O(s,0,.95))).map(s=>O(s,4e-4,.97)).map(s=>{const l=.983729*s-1,u=.432951*s-.0245786,d=.238081*s+90537e-9;return(-u-Math.sqrt(Math.max(u*u-4*l*d,0)))/(2*l)}),c=o(St,a).map(s=>Math.max(s,0)*.6/e);return new i.Color(c[0],c[1],c[2])}function Wt(t=zt){const e=t.map(o=>new i.Color(o));return{uTime:{value:0},uU:{value:0},uSun:{value:new i.Vector3(.6489,.7037,-.2895).normalize()},uSunOn:{value:1},uOrigin:{value:new i.Vector3},uCamL:{value:new i.Vector3(0,30,-300)},uExposure:{value:1},uShade:{value:.55},uSand:{value:e[0]},uWhite:{value:e[1]},uCobalt:{value:e[2]},uGreen:{value:e[3]},uOchre:{value:e[4]},uRed:{value:e[5]},uIron:{value:e[6]},uGlazeMix:{value:new i.Vector4(1,1,1,1)},uLamp:{value:.6},uSteep:{value:0},uMir:{value:1},uSkyZen:{value:e[2].clone()},uSkyHor:{value:e[2].clone().lerp(e[1],.5)},uShift:{value:new i.Vector4(0,0,0,144)},uClear:{value:new i.Vector4(n.halfX+12,-320,290,26)}}}const ot=`
  uniform float uTime, uU, uSunOn, uExposure, uShade, uMir, uSteep, uLamp;
  // THE MIRROR: the water is a dark mirror. Each mesh is drawn a second time upside down under the surface (uMir -1,
  // flipped in the vertex shader after the light is worked out, so the image is lit exactly as the thing), sunk toward
  // the iron black the deeper it lies; the chains hang through the heart of each mirrored trunk.
  uniform vec3 uSun, uOrigin, uCamL, uSand, uWhite, uCobalt, uGreen, uOchre, uRed, uIron;
  uniform vec4 uGlazeMix, uClear;
  vec3 mirTone(vec3 D, float y){ return uMir > 0. ? D : mix(mix(uIron*1.15, uCobalt, 0.22*uSteep), D, mix(0.74, 0.5, smoothstep(0., 66., y))*(1. - 0.62*uSteep)); }
  float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
  vec2 hash22(vec2 p){ float n = hash21(p); return vec2(n, hash21(p + n*17.13 + 3.7)); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
    return mix(mix(hash21(i), hash21(i + vec2(1, 0)), f.x), mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), f.x), f.y); }
  vec3 toScene(vec3 D){
    vec3 y = clamp(mat3(${At(Pt)})*clamp(D, 0., 0.95), 0.0004, 0.97);
    vec3 A = 0.983729*y - 1., B = 0.432951*y - 0.0245786, Cc = 0.238081*y + 0.000090537;
    vec3 v = (-B - sqrt(max(B*B - 4.*A*Cc, 0.)))/(2.*A);
    return max(mat3(${At(St)})*v, 0.)*(0.6/max(uExposure, 0.05));
  }
  // nearest throat of the lattice: xy = axis (x, z), z = neck radius, w = 1 for a lesser throat
  vec4 throatAt(vec2 q){
    float i = clamp(floor(q.x/30. + 0.5), -2., 2.), k = clamp(floor((q.y + 126.)/36. + 0.5), 0., 7.);
    float less = step(1.5, abs(i));
    return vec4(mix(i*30., sign(i)*56., less), -126. + 36.*k, mix(${n.aGreat.toFixed(1)}, ${n.aLess.toFixed(1)}, less), less);
  }
  float sunDisc(vec3 p){                      // only the light that comes down a star throat
    vec2 q = p.xz + uSun.xz*((${n.neckY.toFixed(1)} - p.y)/max(uSun.y, 0.05));
    vec4 th = throatAt(q);
    vec2 e = abs(q) - vec2(${(n.halfX+2).toFixed(1)}, ${(n.halfZ+2).toFixed(1)});
    return uSunOn*(1. - smoothstep(th.z - 0.22, th.z + 0.22, length(q - th.xy)))*step(max(e.x, e.y), 0.);
  }
  float sunVis(vec3 p){
    float sy = max(uSun.y, 0.05);
    vec2 q = p.xz + uSun.xz*((${n.neckY.toFixed(1)} - p.y)/sy);
    vec4 th = throatAt(q);
    float inHole = 1. - smoothstep(th.z - 0.22, th.z + 0.22, length(q - th.xy));
    // the hall is open sided: a ray that leaves the footprint below the vault edge is in sun
    vec2 e = abs(p.xz + uSun.xz*(clamp(60. - p.y, 0., 12.)/sy)) - vec2(${n.halfX.toFixed(1)}, ${n.halfZ.toFixed(1)});
    float outside = smoothstep(-0.3, 0.3, max(e.x, e.y));
    float above = step(${(n.neckY-.5).toFixed(1)}, p.y);
    float cl = 1. - 0.45*smoothstep(0.46, 0.62, vnoise(p.xz*0.024 + vec2(uTime*0.17, uTime*0.04)));   // cloud shadows cross the hall, the roof and the discs
    return uSunOn*cl*max(above, max(inHole, outside*(1. - step(60., p.y))));
  }
  vec3 gaudiLight(vec3 alb, vec3 n, vec3 p, float ao){
    float ndl = dot(n, uSun);
    float lit = smoothstep(0.02, 0.26, ndl)*sunVis(p);
    vec3 fillD = vec3(-uSun.x, 0.25, -uSun.z); fillD /= max(length(fillD), 1e-3);
    vec3 shade = mix(alb*uShade, uCobalt, 0.2)*(0.76 + 0.1*n.y + 0.36*dot(n, fillD));
    // light thrown up from the water: slow bright nets that climb the stone and die out by the forks
    float cz = vnoise(vec2(p.x + p.z, p.y*1.6)*0.55 + vec2(uTime*0.5, -uTime*0.33)), cy = vnoise(vec2(p.x - p.z, p.y*1.6)*0.6 + vec2(-uTime*0.41, uTime*0.27) + 9.);
    float net = (1. - smoothstep(0.02, 0.1, abs(cz - cy)))*(1. - smoothstep(4., 30., p.y))*smoothstep(-0.2, 0.3, 0.25 - n.y)*uSunOn;
    shade += alb*vec3(1.05, 1., 0.86)*0.13*net;
    vec3 sunC = alb*vec3(1.06, 1., 0.9)*(0.9 + 0.22*ndl);
    // a lantern hangs from an iron palm leaf on every trunk, 3.7 m toward the aisle, 13 m up: its pool on the stone
    float ax = abs(p.x), lx = ax < 30. ? 12.5 : 39.0, lz = -144. + 36.*clamp(floor((p.z + 144.)/36. + 0.5), 0., 8.);
    vec3 ld = vec3(sign(p.x)*lx, 11.8, lz) - p; float l2 = dot(ld, ld);
    float pool = uLamp*exp(-l2/22.)*(0.35 + 0.65*clamp(dot(n, ld)/sqrt(max(l2, 1e-4)), 0., 1.));
    return mix(shade*mix(0.72, 1., ao), sunC, lit*mix(0.8, 1., ao)) + alb*vec3(1.1, 0.86, 0.5)*pool;
  }
  // ruled brick: both families of straight generators of the hyperboloid round the nearest throat axis. Three
  // levels so the ruling is countable at every distance: single courses (0.3 m), then every 4th line of both
  // families (diamonds in two tones), then every 16th; each hands over to the next before it nears 3 pixels.
  vec3 brickLvl(float g1, float g2, float w, vec2 seed, vec3 a, vec3 b, vec3 mor){
    vec2 c = floor(vec2(g1, g2));
    float chk = mod(c.x + c.y, 2.), h = hash21(c*0.73 + seed);
    vec3 col = mix(a, b, mix(chk, step(0.5, h), 0.35))*(0.95 + 0.1*h);
    float d = 0.5 - max(abs(fract(g1) - 0.5), abs(fract(g2) - 0.5));
    return mix(col, mor, (1. - smoothstep(0.03, 0.031 + w*1.5, d))*0.8);
  }
  vec3 brickAt(vec3 p){
    vec4 th = throatAt(p.xz); vec2 d = p.xz - th.xy;
    float r = max(length(d), th.z), t = sqrt(max(r*r/(th.z*th.z) - 1., 0.));
    float phi = atan(d.y, d.x + 1e-5), up = sign(p.y - ${n.neckY.toFixed(1)});
    float hsh = hash21(th.xy*0.37);
    float band = t < 1.25 ? 1. : (t < 2.7 ? 2. : 4.);                       // more courses as the skirt widens
    float N = 16.*floor(mix(7.8, 9.4, hsh)*mix(1., 0.62, th.w) + 0.5)*band;
    float tw = atan(t)*up;
    float f1 = N*(phi - tw)/6.2831853 + floor(hsh*16.), f2 = N*(phi + tw)/6.2831853 + floor(hsh*48.);
    f1 += 0.18*sin(phi*7. + tw*3. + hsh*40.); f2 += 0.18*sin(phi*5. - tw*2.);   // the hand drifts
    float w1 = fwidth(f1), w2 = fwidth(f2);
    w1 = w1 > 0.4*N ? 0.02 : w1; w2 = w2 > 0.4*N ? 0.02 : w2;              // the atan seam
    float k2 = 4.;
    float l1 = smoothstep(0.86 - w1*2., 0.86, abs(fract(f1) - 0.5)*2.);
    float l2 = 0.7*smoothstep(0.95 - w2*2./k2, 0.95, abs(fract(f2/k2) - 0.5)*2.);
    float tone = hash21(vec2(floor(f1), floor(f2/k2)) + th.xy);
    vec3 a = mix(uSand, uRed, 0.30), b = mix(uSand, uRed, 0.10)*1.04, mor = mix(uSand, uWhite, 0.5);
    vec3 brick = mix(a, b, step(0.5, tone))*(0.93 + 0.14*hash21(vec2(floor(f1), floor(f2/k2))*1.7));
    vec3 mean = mix(mix(a, b, 0.5), mor, 0.15);
    float sold = (1. - smoothstep(0.03, 0.05, abs(t - 1.25)))+(1. - smoothstep(0.04, 0.07, abs(t - 2.7)));
    brick = mix(brick, a*0.9, clamp(sold, 0., 1.));
    vec3 c = mix(brick, mor, max(l1, l2)*0.8);
    float w = max(w1, w2);
    vec3 L1 = brickLvl(f1/4., f2/4., w/4., th.xy, a, b, mor), L2 = brickLvl(f1/16., f2/16., w/16., th.xy + 3.1, a, b, mor);
    c = mix(c, L1, smoothstep(0.16, 0.34, w));
    c = mix(c, L2, smoothstep(0.7, 1.4, w));
    return mix(c, mean, smoothstep(4.5, 9., w));
  }
  // trencadis. uv in chip units (one chip about 1 across), fw = fwidth(uv) taken by the caller, sel picks the
  // colourway of the band (0 all five glazes, 1 green and ochre rim). Returns colour, a = glaze (1) or grout (0);
  // tilt is the chip's own lean for the highlight.
  vec3 shardCol(float h, float sel){
    vec4 gm = uGlazeMix;
    if (sel < 0.5) return h < 0.34 ? uWhite : h < 0.54 ? mix(uWhite, uCobalt, gm.x) : h < 0.73 ? mix(uWhite, uGreen, gm.y) : h < 0.92 ? mix(uWhite, uOchre, gm.z) : mix(uWhite, uRed, gm.w);
    return h < 0.42 ? mix(uWhite, uGreen, gm.y) : h < 0.78 ? mix(uWhite, uOchre, gm.z) : h < 0.92 ? uWhite : mix(uWhite, uRed, gm.w);
  }
  vec4 shardAt(vec2 uv, vec2 fw, float sel, out vec3 tilt){
    vec2 ip = floor(uv), fp = fract(uv); float d1 = 9., d2 = 9.; vec2 id = vec2(0.);
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j)), o = hash22(ip + g); o = 0.5 + 0.46*(o - 0.5)*2.*0.9;
      vec2 r = g + o - fp; float d = dot(r, r);
      if (d < d1) { d2 = d1; d1 = d; id = ip + g; } else if (d < d2) { d2 = d; }
    }
    float edge = sqrt(d2) - sqrt(d1);
    float h = hash21(id + 5.3), h2 = hash21(id*1.31 + 9.1);
    vec4 gm = uGlazeMix;
    vec3 col = shardCol(h, sel);
    col *= 0.9 + 0.2*h2;
    // one chip in twenty keeps a stripe from the plate it was
    float stripe = step(0.95, h2)*step(0.5, fract((uv.x*cos(h*6.28) + uv.y*sin(h*6.28))*3.2));
    col = mix(col, mix(uWhite, uCobalt, step(0.5, h)), stripe*0.8);
    float px = max(fw.x, fw.y);
    float grout = 1. - smoothstep(0.07, 0.07 + px*1.5 + 0.03, edge);
    vec3 groutC = uWhite*0.80;
    tilt = (vec3(hash22(id + 2.), h2) - 0.5)*0.22;
    vec3 mean = (sel < 0.5 ? (uWhite*0.34 + mix(uWhite, uCobalt, gm.x)*0.2 + mix(uWhite, uGreen, gm.y)*0.19 + mix(uWhite, uOchre, gm.z)*0.19 + mix(uWhite, uRed, gm.w)*0.08)
                           : (mix(uWhite, uGreen, gm.y)*0.42 + mix(uWhite, uOchre, gm.z)*0.36 + uWhite*0.14 + mix(uWhite, uRed, gm.w)*0.08))*0.93;
    float far = smoothstep(0.3, 0.62, px);
    // far off the chips are gone but the crest keeps its patches: handfuls from the same broken plate lie together
    vec2 cu = uv*0.3 + 0.8*vec2(vnoise(uv*0.4), vnoise(uv*0.4 + 7.3));
    mean = mix(mean, shardCol(hash21(floor(cu) + 11.7), sel)*0.95, 0.5*(1. - smoothstep(1.2, 2.4, px)));
    // and farther still the crest is banded in armfuls of one colour, so tile reads as tile from across the water
    vec2 cv = uv*0.07 + 0.5*vec2(vnoise(uv*0.09 + 3.1), vnoise(uv*0.09 + 9.7));
    mean = mix(mean, shardCol(hash21(floor(cv) + 4.3), sel)*0.95, 0.5*smoothstep(0.5, 1.2, px)*(1. - smoothstep(5., 10., px)));
    tilt *= 1. - far;
    return vec4(mix(mix(col, groutC, grout), mean, far), (1. - grout)*(1. - far) + far*0.7);
  }
  // glaze over the light rule: broad sun lobe, narrowing close by; returns display colour
  vec3 glazeLight(vec4 sh, vec3 tilt, vec3 n, vec3 p, float ao){
    vec3 nn = n + tilt; nn /= max(length(nn), 1e-3);
    vec3 c = gaudiLight(min(sh.rgb*1.22, vec3(0.95)), nn, p, ao)/1.22 + sh.rgb*0.2*sh.a;   // glaze keeps its colour in shade
    vec3 v = uCamL - p; float dist = max(length(v), 1e-3); v /= dist;
    vec3 hv = v + uSun; hv /= max(length(hv), 1e-3);
    float nh = max(dot(nn, hv), 0.), e = mix(60., 14., smoothstep(10., 40., dist));
    float spec = pow(nh, e)*sunVis(p)*sh.a;
    return c + uWhite*spec*mix(0.5, 0.18, smoothstep(10., 60., dist));
  }
`,ut=2.2,Q=1.6,mt=1;function Dt(t){const e=[];for(let o=0;o<4;o++)for(let h=0;h<n.nZ;h++){const a=n.rowsX[o]+t.range(-.6,.6),c=n.z0+n.pitchZ*h+t.range(-.6,.6),s=o===0||o===3,l=Math.sign(n.rowsX[o]),u=(s?t.range(9,12):t.range(5.6,8.6))*Math.PI/180,d=((h+o)%2?1:-1)*t.range(.35,.9);let M=s?-l:l,z=d;const x=Math.hypot(M,z);M/=x,z/=x;const g=n.fork1*Math.tan(u)/.655,y={x:a+M*g,z:c+z*g},m=t.range(-.2,.2),f=[],p=[];for(let w=0;w<4;w++){const k=Math.PI/4+w*Math.PI/2+m+t.range(-.16,.16),$=[];for(let C=-1;C<=1;C++){const T=k+C*t.range(.42,.6),W=C===0?t.range(11,13):t.range(7.5,9.5);let I=O(y.x+Math.cos(T)*W,-n.halfX+2.5,n.halfX-2.5),L=O(y.z+Math.sin(T)*W,-n.halfZ+2.5,n.halfZ-2.5);{const D=nt(ct(I)),q=at(ft(L)),v=(Math.abs(D)>50?n.aLess:n.aGreat)*1.8,A=Math.hypot(I-D,L-q);if(A<v){const G=v/Math.max(A,.01);I=O(D+(I-D)*G,-n.halfX+2.5,n.halfX-2.5),L=O(q+(L-q)*G,-n.halfZ+2.5,n.halfZ-2.5)}}$.push(new i.Vector3(I,it(I,L)+.25,L))}f.push($),p.push(new i.Vector3(y.x,n.fork2+t.range(-1.6,1.6),y.z))}e.push({r:o,c:h,foot:new i.Vector3(a,0,c),f1:new i.Vector3(y.x,n.fork1+t.range(-1.5,1.5),y.z),f2:p,heads:f,phase:t.range(0,6.283),seed:t()})}for(let o=0;o<150;o++)for(const h of e){let a=ut*h.foot.x,c=ut*h.foot.z;for(const s of h.f2)a+=Q*s.x,c+=Q*s.z;h.f1.x=a/(ut+4*Q),h.f1.z=c/(ut+4*Q);for(let s=0;s<4;s++){let l=Q*h.f1.x,u=Q*h.f1.z;for(const d of h.heads[s])l+=mt*d.x,u+=mt*d.z;h.f2[s].x=l/(Q+3*mt),h.f2[s].z=u/(Q+3*mt)}}for(const o of e){let h=o.f1.x-o.foot.x,a=o.f1.z-o.foot.z,c=Math.hypot(h,a);const s=o.f1.y*Math.tan(5*Math.PI/180);if(c<s){const l=s/Math.max(c,.001),u=c<.001?s:h*l,d=c<.001?0:a*l;o.f1.x=o.foot.x+u,o.f1.z=o.foot.z+d}o.lean=Math.atan2(Math.hypot(o.f1.x-o.foot.x,o.f1.z-o.foot.z),o.f1.y)*180/Math.PI,o.trunk=[];for(let l=0;l<=22;l++){const u=l/22,d=E(0,o.f1.y,u),M=O(d/o.f1.y,0,1),z=.72*M+.28*M*M;o.trunk.push(new i.Vector3(E(o.foot.x,o.f1.x,z),d,E(o.foot.z,o.f1.z,z)))}}return e}const X=new i.Vector3,J=new i.Vector3,dt=new i.Vector3,xt=new i.Vector3,Ct=t=>1-Math.abs(t-Math.floor(t)-.5)*2;function gt(t,e,o,h,a,c,s,l){const u=e.length,d=[];let M=0;for(let f=1;f<u;f++)M+=e[f].distanceTo(e[f-1]);const z=a?Math.min(Math.round(M*4),999)+1e3*Math.round(Math.abs(a.twist(1))*8/Math.PI*10):0;let x=0;J.set(1,0,1e-4);for(let f=0;f<u;f++){const p=e[Math.max(f-1,0)],w=e[Math.min(f+1,u-1)];X.subVectors(w,p).normalize(),J.addScaledVector(X,-J.dot(X)).normalize(),dt.crossVectors(X,J),f>0&&(x+=e[f].distanceTo(e[f-1]));const k=f/(u-1),$=o(k,x),C=a?a.depth(k):0,T=a?a.twist(k):0,W=[];for(let I=0;I<h;I++){const L=I/h,D=L*Math.PI*2+T;let q=$;a&&(q=$*Math.min(1-C*Ct(L*8),1-C*Ct((D+T)*8/(Math.PI*2))));const v=Math.cos(D)*q,A=Math.sin(D)*q;W.push(e[f].x+J.x*v+dt.x*A,e[f].y+J.y*v+dt.y*A,e[f].z+J.z*v+dt.z*A)}d.push({ring:W,s:x,ao:z+.5*O(s?s(e[f],k):1,0,1)})}const g=t.pos,y=t.att,m=Math.floor(c*100)*8+(h>=16?6:h>=8?3:2);for(let f=0;f<u-1;f++){const p=d[f],w=d[f+1];for(let k=0;k<h;k++){const $=(k+1)%h,C=k*3,T=$*3;g.push(p.ring[C],p.ring[C+1],p.ring[C+2],p.ring[T],p.ring[T+1],p.ring[T+2],w.ring[T],w.ring[T+1],w.ring[T+2],p.ring[C],p.ring[C+1],p.ring[C+2],w.ring[T],w.ring[T+1],w.ring[T+2],w.ring[C],w.ring[C+1],w.ring[C+2]);const W=m+(l&&f>=l[0]&&f<l[1]?l[2]:0),I=W+k/h*.999,L=W+(k+1)/h*.999;y.push(p.s,I,p.ao,p.s,L,p.ao,w.s,L,w.ao,p.s,I,p.ao,w.s,L,w.ao,w.s,I,w.ao)}}}function Qt(t){const e=new i.BufferGeometry;return e.setAttribute("position",new i.Float32BufferAttribute(t.pos,3)),e.setAttribute("aS",new i.Float32BufferAttribute(t.att,3)),e.computeVertexNormals(),e}const wt=(t,e,o)=>{const h=[];for(let a=0;a<=o;a++)h.push(t.clone().lerp(e,a/o));return h},tt=(t,e,o)=>Math.exp(-((t-e)/o)*((t-e)/o));function Tt(t){const e=new Float32Array(t.pos),o=new Float32Array(t.att),h=new Float32Array(e.length);for(let a=0;a<e.length;a+=9){const c=e[a+3]-e[a],s=e[a+4]-e[a+1],l=e[a+5]-e[a+2],u=e[a+6]-e[a],d=e[a+7]-e[a+1],M=e[a+8]-e[a+2];let z=s*M-l*d,x=l*u-c*M,g=c*d-s*u;const y=Math.hypot(z,x,g)||1;z/=y,x/=y,g/=y;for(let m=0;m<9;m+=3)h[a+m]=z,h[a+m+1]=x,h[a+m+2]=g}return{pos:e,att:o,nor:h}}async function Nt(t,e,o){const h=[],a=x=>1-.5*st(40,61,x.y);for(const x of e){if(o&&o(x))continue;const g={pos:[],att:[]},y=x.f1.y;gt(g,x.trunk,(m,f)=>E(2.65,1.8,m)+.35*tt(f,0,2.2)+.55*tt(f,y,2.4)-.2*tt(f,y-4.6,1.6),32,{depth:m=>.4*(1-st(.84,.99,m)),twist:m=>m*Math.PI/4*(x.seed>.5?1:-1)},x.seed,m=>1-.3*st(22,31,m.y),[20,22,1]),h.push(Tt(g)),g.pos.length=0,g.att.length=0,await t.yield();for(let m=0;m<4;m++){const f=x.f2[m],p=f.distanceTo(x.f1);gt(g,wt(x.f1,f,7),(w,k)=>E(1.25,.92,w)+.42*tt(k,0,2.4)+.34*tt(k,p,1.5)-.1*tt(k,p-3,1.2),8,null,x.seed+m*.07,a,[6,7,1]);for(let w=0;w<3;w++){const k=x.heads[m][w],$=k.distanceTo(f);gt(g,wt(f,k,4),(C,T)=>E(.7,.46,C)+.2*tt(T,0,1.4)+.32*tt(T,$,1.5),6,null,x.seed+m*.07+w*.013,a)}}h.push(Tt(g)),await t.yield()}let c=0;for(const x of h)c+=x.pos.length;const s=new Float32Array(c),l=new Float32Array(c),u=new Float32Array(c);let d=0,M=0;for(const x of h)s.set(x.pos,d),l.set(x.att,d),u.set(x.nor,d),d+=x.pos.length,++M%8===0&&await t.yield();const z=new i.BufferGeometry;return z.setAttribute("position",new i.BufferAttribute(s,3)),z.setAttribute("aS",new i.BufferAttribute(l,3)),z.setAttribute("normal",new i.BufferAttribute(u,3)),z.boundingSphere=new i.Sphere(new i.Vector3(0,30,0),190),await t.yield(),z}function vt(t,e,o,h){const a=t.pos.length/3,c=e[0].length;for(let g=0;g<e.length;g++)for(let y=0;y<c;y++){const m=e[g][y];t.pos.push(m[0],m[1],m[2]),t.am.push(o,m[3]??g/(e.length-1))}const s=e[0][0],l=e[0][1],u=e[1][0],d=(l[1]-s[1])*(u[2]-s[2])-(l[2]-s[2])*(u[1]-s[1]),M=(l[2]-s[2])*(u[0]-s[0])-(l[0]-s[0])*(u[2]-s[2]),z=(l[0]-s[0])*(u[1]-s[1])-(l[1]-s[1])*(u[0]-s[0]),x=d*h[0]+M*h[1]+z*h[2]<0;for(let g=0;g<e.length-1;g++)for(let y=0;y<c-1;y++){const m=a+g*c+y,f=m+1,p=m+c,w=p+1;x?t.idx.push(m,p,f,f,p,w):t.idx.push(m,f,p,f,w,p)}}async function Zt(t,e){const o=t.getAttribute("position").array,h=t.index.array,a=new Float32Array(o.length);for(let c=0;c<h.length;c+=3e4){const s=Math.min(c+3e4,h.length);for(let l=c;l<s;l+=3){const u=h[l]*3,d=h[l+1]*3,M=h[l+2]*3,z=o[M]-o[d],x=o[M+1]-o[d+1],g=o[M+2]-o[d+2],y=o[u]-o[d],m=o[u+1]-o[d+1],f=o[u+2]-o[d+2],p=x*f-g*m,w=g*y-z*f,k=z*m-x*y;a[u]+=p,a[u+1]+=w,a[u+2]+=k,a[d]+=p,a[d+1]+=w,a[d+2]+=k,a[M]+=p,a[M+1]+=w,a[M+2]+=k}await e()}for(let c=0;c<a.length;c+=9e4){const s=Math.min(c+9e4,a.length);for(let l=c;l<s;l+=3){const u=Math.hypot(a[l],a[l+1],a[l+2])||1;a[l]/=u,a[l+1]/=u,a[l+2]/=u}await e()}t.setAttribute("normal",new i.BufferAttribute(a,3))}async function $t(t,e){const o={pos:[],am:[],idx:[]},h=[-n.halfX,-45,-15,15,45,n.halfX];for(let c=0;c<5;c++)for(let s=0;s<n.nThrZ;s++){const l=c-2,u=nt(l),d=at(s),M=Math.abs(l)===2,z=M?n.aLess:n.aGreat;if(e&&e(l,s))continue;const x=h[c],g=h[c+1],y=s===0?-n.halfZ:d-18,m=s===n.nThrZ-1?n.halfZ:d+18,f=[],p=M?22:28;for(let v=0;v<p;v++)f.push(-Math.PI+(v+.5)/p*Math.PI*2);for(const[v,A]of[[x,y],[g,y],[g,m],[x,m]])f.push(Math.atan2(A-d,v-u));f.sort((v,A)=>v-A),f.push(f[0]+Math.PI*2);const w=v=>{const A=Math.cos(v),G=Math.sin(v);return Math.min(A>1e-6?(g-u)/A:A<-1e-6?(x-u)/A:1e9,G>1e-6?(m-d)/G:G<-1e-6?(y-d)/G:1e9)},k=v=>f.map(A=>v(A,Math.cos(A),Math.sin(A),w(A))),$=[0,.1,.24,.42,.62,.82,1],C=$.map(v=>k((A,G,N,Z)=>{const Y=Math.sqrt(Math.max(Z*Z/(z*z)-1,0)),j=Y*v,H=v===1?Z:z*Math.sqrt(1+j*j),S=u+G*H,U=d+N*H;return[S,v===0?n.neckY:it(S,U),U]}));vt(o,C,0,[0,-1,0]);const T=[0,.25,.5,.75].map(v=>k((A,G,N)=>{const Z=z*Math.sqrt(1+v*v);return[u+G*Z,n.neckY+n.bUp*v,d+N*Z]}));vt(o,T,1,[u-T[0][0][0],.3,d-T[0][0][2]]);const W=[-2,-1,1.3,1.62,2,2.4],I=[];for(const v of W)I.push(k((A,G,N)=>{const Z=z*(v===-2?1.25:v===-1?1.28:v),Y=u+G*Z,j=d+N*Z;return[Y,v===-2?n.collarY:v===-1?n.collarY+.32:lt(Y,j),j]}));for(const v of[.4,.8,1])I.push(k((A,G,N,Z)=>{const Y=E(2.4*z,Z,v),j=u+G*Y,H=d+N*Y;return[j,lt(j,H),H]}));vt(o,I,2,[0,1,0]);const L=C[C.length-1],D=I[I.length-1],q=v=>Math.abs(v[0])>n.halfX-.01||Math.abs(v[2])>n.halfZ-.01;for(let v=0;v<f.length-1;v++){if(!q(L[v])||!q(L[v+1]))continue;const A=(L[v][0]+L[v+1][0])/2,G=(L[v][2]+L[v+1][2])/2,N=Math.abs(A)>n.halfX-.01?Math.sign(A):0,Z=N===0?Math.sign(G):0,Y=S=>[0,.3,.7,1].map(U=>{const r=L[S],b=D[S],P=Math.sin(U*Math.PI)*.9;return[r[0]+N*P,E(r[1],b[1],U),r[2]+Z*P,U]}),j=Y(v),H=Y(v+1);vt(o,[0,1,2,3].map(S=>[j[S],H[S]]),3,[N,0,Z])}s%2&&await t.yield()}const a=new i.BufferGeometry;return await t.yield(),a.setAttribute("position",new i.Float32BufferAttribute(o.pos,3)),await t.yield(),a.setAttribute("aM",new i.Float32BufferAttribute(o.am,2)),a.setIndex(o.idx),await t.yield(),await Zt(a,()=>t.yield()),a}const pt=`
  uniform vec3 uOrigin;
  varying vec3 vP, vN;
  uniform float uMir, uTime;
  void stdVert(){ vec4 w = modelMatrix*vec4(position, 1.); vP = w.xyz - uOrigin; vN = normalize(mat3(modelMatrix)*normal + vec3(0., 1e-6, 0.));
    if (uMir < 0.) { float h = max(vP.y, 0.);                              // the image under the water, trembling a little more the deeper it lies
      w.y = uOrigin.y - vP.y;
      w.xz += (0.05 + 0.006*h)*vec2(sin(h*1.9 + uTime*1.7 + w.z*0.21), sin(h*1.3 - uTime*1.3 + w.x*0.17)); }
    gl_Position = projectionMatrix*viewMatrix*w; }
`;function Lt(t,e){return new i.ShaderMaterial({uniforms:e?{...t,uMir:{value:-1}}:t,side:e?i.BackSide:i.FrontSide,vertexShader:pt+`
      attribute vec3 aS; varying vec3 vS;
      void main(){ vS = aS; stdVert(); }`,fragmentShader:`
      varying vec3 vP, vN, vS;
      ${ot}
      void main(){
        vec3 n = vN/max(length(vN), 1e-3);
        float d = vS.x/1.2, w = fwidth(d), jd = abs(fract(d + 0.5) - 0.5);
        float joint = (1. - smoothstep(0.012, 0.014 + w, jd))*(1. - smoothstep(0.2, 0.45, w));
        float sI = floor(vS.y), th = fract(vS.y)/0.999, nB = mod(sI, 8.), drum = floor(d + 0.5);
        float bv = th*nB + hash21(vec2(drum, sI))*3., wv = fwidth(bv); wv = wv > 1. ? 0.01 : wv;
        float jv = (1. - smoothstep(0.012, 0.016 + wv, abs(fract(bv + 0.5) - 0.5)))*(1. - smoothstep(0.2, 0.45, wv));
        joint = max(joint, 0.2*jv*step(2.5, nB));
        float tone = mix(hash21(vec2(drum, sI)), hash21(vec2(drum*7. + floor(bv + 0.5), sI)), 0.15);
        float grain = vnoise(vP.xz*2.3 + vP.y*vec2(1.7, 2.9)) - 0.5;
        float bed = sin((vS.x + grain*0.6)*26.)*0.5;                       // sedimentary bedding, a few cm
        float px = length(fwidth(vP));
        float sgn = mod(drum, 2.) < 0.5 ? 1. : -1.;
        float tool = sin((th*11.3 + sgn*vS.x)*120. + grain*3.)*(1. - smoothstep(0.012, 0.035, px));   // chisel strokes, turned drum by drum
        vec3 alb = uSand*(0.95 + 0.07*tone + 0.07*grain + 0.03*bed*(1. - smoothstep(0.03, 0.09, px)) + 0.035*tool);
        alb = mix(alb, uSand*vec3(1.04, 0.97, 0.9), step(0.8, tone)*0.5);
        alb *= 1. - 0.24*joint;
        // the arrises, ruled: the two star prisms of the double twist cut a groove each way round the column, and the
        // flanks either side of a groove take the light differently
        float aoS = fract(vS.z)*2., kk = floor(vS.z), Lm = mod(kk, 1000.)*0.25, shf = floor(kk/1000.)*0.1;
        if (Lm > 0.5) {
          float u01 = clamp(vS.x/Lm, 0., 1.), sg = floor(sI/8.) >= 50. ? 1. : -1.;
          float a1 = th*8., a2 = th*8. + sg*shf*u01, w1 = fwidth(a1), w2 = fwidth(a2);
          w1 = w1 > 0.5 ? 0.02 : w1; w2 = w2 > 0.5 ? 0.02 : w2;
          float g1 = (1. - smoothstep(0.045, 0.05 + w1*1.5, abs(fract(a1) - 0.5)))*(1. - smoothstep(0.25, 0.6, w1));
          float g2 = (1. - smoothstep(0.045, 0.05 + w2*1.5, abs(fract(a2) - 0.5)))*(1. - smoothstep(0.25, 0.6, w2));
          float fade = 1. - smoothstep(0.72, 0.97, u01);
          float flank = mix(0.5, step(0.5, fract(a1)), 1. - smoothstep(0.25, 0.6, w1))*0.6 + mix(0.5, step(0.5, fract(a2)), 1. - smoothstep(0.25, 0.6, w2))*0.4;
          alb *= (1. - 0.42*max(g1, g2)*fade)*(1. + (flank - 0.5)*0.26*fade);
        }
        alb *= mix(0.6, 1., smoothstep(0.15, 0.85, vP.y + grain*0.5));     // wet at the waterline
        if (uMir < 0. && vP.y < 0.02) discard;
        vec3 D = gaudiLight(alb, n, vP, aoS);
        // broken tile where he put it on a column: a skirt at the water under a green and ochre hem, and the knot
        // under each fork (nB 7 the trunk's, 4 a branch's), so the colour of the roof comes down into the hall
        float circ = nB > 5.5 ? 12.5 : nB < 0.5 ? 6.5 : 5.6;
        float sgnH = mod(floor(sI/8.), 2.) < 0.5 ? 1. : -1.;
        float via = step(1.5, shf)*step(shf, 1.7);                          // a viaduct column keeps its shard skirt; a trunk only a hem at the water
        float hem = (nB > 5.5 ? mix(0.9, 4.2, via) : 3.2) + (nB > 5.5 ? mix(0.3, 0.8, via) : 0.8)*sin(th*18.85 + sI) + 0.2*sin(th*44. + sI*1.7);
        float skirt = 1. - smoothstep(hem + 0.7, hem + 0.76, vP.y);
        float knotB = (abs(nB - 7.) < 0.5 || abs(nB - 4.) < 0.5) ? 1. : 0.;
        // and two ribbons of it wound up each column the way its arrises turn: the double twist, in colour
        float hel = fract(th*2. + vS.x*0.09*sgnH + 0.25);
        float ribbon = 0.*hel;
        if (max(max(skirt, knotB), ribbon) > 0.5) {
          float selS = knotB > 0.5 ? (nB < 5. ? 1. : 0.) : skirt > 0.5 ? step(hem, vP.y) : step(0.5, fract(th + vS.x*0.045*sgnH + 0.125));
          vec2 suv = vec2(th*circ, vS.x)/0.24;
          vec3 tilt; vec4 sh = shardAt(suv, vec2(w*6.5), selS, tilt);
          sh.rgb *= mix(0.72, 1., smoothstep(0.1, 0.9, vP.y + grain*0.5));
          D = glazeLight(sh, tilt, n, vP, aoS);
        }
        gl_FragColor = vec4(toScene(mirTone(D, vP.y)), 1.);
      }`})}function qt(t){return new i.ShaderMaterial({uniforms:t,vertexShader:pt+`
      attribute vec2 aM; varying vec2 vM;
      void main(){ vM = aM; stdVert(); }`,fragmentShader:`
      varying vec3 vP, vN; varying vec2 vM;
      ${ot}
      float ridgeD(vec2 q){
        float ax = abs(q.x), dx = min(abs(ax - 15.), abs(ax - 45.));
        float zz = q.y + 108., dz = abs(zz - 36.*clamp(floor(zz/36. + 0.5), 0., 6.));
        return min(dx + 0.8*sin(q.y*0.21), dz + 0.8*sin(q.x*0.17));
      }
      void main(){
        vec3 n = vN/max(length(vN), 1e-3);
        vec4 th = throatAt(vP.xz); vec2 dd = vP.xz - th.xy;
        float r = length(dd), ra = r/th.z, phi = atan(dd.y, dd.x + 1e-5);
        float px = length(fwidth(vP))/0.2;
        float mat = floor(vM.x + 0.5);
        vec3 alb; float band = 0., sel = 0., ao = 1., roofLit = -1.; vec2 suv = vP.xz/0.2;
        if (mat < 1.5) {                                   // soffit and upper throat: ruled brick, shard rims
          alb = brickAt(vP);
          float y = vP.y + 0.25*sin(phi*5. + th.x);
          float rim = smoothstep(${(n.neckY-1.4).toFixed(1)}, ${(n.neckY-1.2).toFixed(1)}, y)*(1. - smoothstep(${(n.neckY+.6).toFixed(1)}, ${(n.neckY+.8).toFixed(1)}, y));
          float col = smoothstep(${(n.collarY-1.7).toFixed(1)}, ${(n.collarY-1.4).toFixed(1)}, y);
          rim = max(rim, (1. - step(0.5, mat))*(1. - smoothstep(1.17, 1.19, ra + 0.035*sin(phi*9. + th.y) + 0.02*sin(phi*23.))));      // green and ochre at the neck, all five glazes round it
          band = max(rim, col); sel = (rim > col && ra < 1.2) ? 1. : 0.;
          suv = vec2(phi*th.z, vP.y - (r - th.z)*(1. - step(0.5, mat)))/0.2;
          ao = mix(0.55, 1.15, smoothstep(57., 66., vP.y));                 // sky pours in at the throats
        } else if (mat < 2.5) {                            // roof: lime wash; shards on collars and crest lines
          float wash = vnoise(vP.xz*0.7)*0.6 + vnoise(vP.xz*3.1)*0.4;
          // sand brick in ruled courses, as the vault under it (the two families of straight lines round each star), the
          // old lime wash worn back to patches in the hollows
          alb = mix(brickAt(vP), uSand, 0.42)*(1.0 + 0.06*wash);
          alb = mix(alb, uWhite*0.94, 0.42*smoothstep(0.5, 0.78, vnoise(vP.xz*0.13 + 7.) + 0.25*(wash - 0.5)));
          float crest = 1. - smoothstep(0.78, 0.98, abs(ridgeD(vP.xz)) + 0.3*vnoise(vP.xz*0.9));
          float col = 1. - smoothstep(1.86, 1.98, ra + 0.06*sin(phi*7.));
          band = max(crest*smoothstep(2.0, 2.3, ra), col);
          suv = vP.xz/0.3; px *= 0.667;
          // the humps' own slope, exact per pixel, so each hump shows one hard edge of sun and shade
          float x = vP.x, z = vP.z;
          vec2 g = vec2(0.285*cos(x*0.19 + 0.7)*cos(z*0.115) + 0.054*cos(z*0.27 + x*0.06) - 0.246*sin(x*0.41 - z*0.05),
                        -0.1725*sin(x*0.19 + 0.7)*sin(z*0.115) + 0.243*cos(z*0.27 + x*0.06) + 0.03*sin(x*0.41 - z*0.05));
          vec3 nA = vec3(-g.x, 1., -g.y); nA /= max(length(nA), 1e-3);
          float dP = min(${n.halfX.toFixed(1)} - abs(x), ${n.halfZ.toFixed(1)} - abs(z));
          n = mix(n, nA, smoothstep(2.3, 2.9, ra)*smoothstep(4., 9., dP));
          roofLit = smoothstep(0.842*uSun.y, 0.9*uSun.y, dot(n, uSun))*sunVis(vP);
                } else {                                           // fascia: brick with a shard crest
          alb = brickAt(vP);
          band = smoothstep(0.72, 0.78, vM.y + 0.04*sin((vP.x + vP.z)*0.9));
          suv = vec2(vP.x + vP.z, vP.y)/0.2;
          ao = 0.9;
        }
        vec3 D;
        if (band > 0.5) { vec3 tilt; vec4 sh = shardAt(suv, vec2(px), sel, tilt); D = glazeLight(sh, tilt, n, vP, min(ao, 1.)); }
        else if (roofLit >= 0.) D = mix(mix(alb*(uShade + 0.09), uCobalt, 0.12), alb*vec3(1.04, 1., 0.93), roofLit);        // lime wash: two tones, sun and sky
        else D = gaudiLight(alb, n, vP, min(ao, 1.))*max(ao, 1.)*(mat < 0.5 ? 1.22 : 1.);          // the soffit takes the water's light
        gl_FragColor = vec4(toScene(D), 1.);
      }`})}const yt=`
  uniform float uTime; uniform vec3 uCamL; uniform vec4 uShift;
  vec3 swayAt(vec3 p, float treePhase, float dirAng){
    float depth = max(-p.y, 0.), f = depth/66.;
    float amp = mix(0.22, 0.9, 1. - smoothstep(18., 70., length(p.xz - uCamL.xz)));
    vec2 dir = vec2(cos(dirAng), sin(dirAng));
    float a = sin(uTime*(0.80 + 0.35*fract(treePhase*3.7)) + treePhase), b = sin(uTime*(0.6 + 0.3*fract(treePhase*5.1)) + treePhase*1.7);
    vec3 web = vec3(uShift.x, 0., uShift.y)*(f*(1. - smoothstep(30., 150., length(p.xz - uShift.zw))));   // the rare event: one more sack, the whole web shifts
    return vec3(dir.x*a - dir.y*b*0.5, 0., dir.y*a + dir.x*b*0.5)*(amp*f) + web;
  }
  vec3 ropeAt(vec3 p, float s01, float strandPhase, float dirAng){
    float amp = mix(0.22, 0.9, 1. - smoothstep(18., 70., length(p.xz - uCamL.xz)));
    return vec3(-sin(dirAng), 0., cos(dirAng))*(sin(3.14159*clamp(s01, 0., 1.))*amp*0.5*sin(uTime*1.9 + strandPhase));
  }
`;function _t(t,e){const o=[],h=[],a=[],c=[],s=[];for(const u of t){const d=u.pts,M=d.length,z=e.range(0,6.283),x=o.length/3;let g=0,y=0;for(let m=1;m<M;m++)y+=d[m].distanceTo(d[m-1]);for(let m=0;m<M;m++){m>0&&(g+=d[m].distanceTo(d[m-1])),X.subVectors(d[Math.min(m+1,M-1)],d[Math.max(m-1,0)]).normalize();for(const f of[-1,1])o.push(d[m].x,d[m].y,d[m].z),h.push(X.x,X.y,X.z),a.push(f*(u.w??1),g,z,u.tree),c.push(u.pin===!1?0:g/Math.max(y,.001),u.dir);if(m<M-1){const f=x+m*2;s.push(f,f+1,f+2,f+1,f+3,f+2)}}}const l=new i.BufferGeometry;return l.setAttribute("position",new i.Float32BufferAttribute(o,3)),l.setAttribute("aT",new i.Float32BufferAttribute(h,3)),l.setAttribute("aC",new i.Float32BufferAttribute(a,4)),l.setAttribute("aD",new i.Float32BufferAttribute(c,2)),l.setIndex(s),l.boundingSphere=new i.Sphere(new i.Vector3(0,-33,0),400),l}const bt=`
  // the style's distance rule under water: a pale thing blues, then sinks toward the iron black, fathom by fathom
  // (white at the surface, cobalt by 30 m, nearly gone by 66 m), so the eye reads how deep it hangs
  vec3 sink(vec3 c, float y){ float d = clamp(-y/66., 0., 1.);
    c = mix(c, mix(c, uCobalt, 0.6)*0.86, smoothstep(0., 0.45, d));
    return mix(c, mix(uIron, uCobalt, 0.3), 0.82*smoothstep(0.18, 1., d)); }
`;function jt(t){return new i.ShaderMaterial({uniforms:t,side:i.DoubleSide,vertexShader:`
      ${yt}
      attribute vec3 aT; attribute vec4 aC; attribute vec2 aD;
      varying vec3 vUV; varying vec3 vP; varying float vStar;
      void main(){
        vStar = step(30., aD.y);
        vec3 p = position + swayAt(position, aC.w, aD.y) + ropeAt(position, aD.x, aC.z, aD.y);
        vec4 w = modelMatrix*vec4(p, 1.);
        vec3 v = cameraPosition - w.xyz; float dist = max(length(v), 1e-3);
        vec3 side = cross(aT, v/dist); side /= max(length(side), 1e-3);
        float wgt = abs(aC.x);
        float real = 0.085*wgt, drawn = max(real, dist*mix(0.0037, 0.0027, smoothstep(90., 340., dist))*(0.55 + 0.45*wgt));
        w.xyz += side*sign(aC.x)*drawn;
        vUV = vec3(sign(aC.x), aC.y/(0.34*max(wgt, 1.)), real/drawn); vP = p;
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:`
      varying vec3 vUV; varying vec3 vP; varying float vStar;
      ${ot}
      ${bt}
      void main(){
        float fy = fwidth(vUV.y), x = vUV.x, y = fract(vUV.y), odd = step(1., mod(vUV.y, 2.));
        // links: flat oval rings alternate with links seen edge-on
        vec2 q = vec2(x, (y - 0.5)*2.);
        float ring = abs(length(q*vec2(1., 0.92)) - 0.72);
        float flat_ = 1. - smoothstep(0.2, 0.3, ring), edge = (1. - smoothstep(0.24, 0.34, abs(x)))*step(abs(q.y), 0.98);
        float link = mix(flat_, edge, odd);
        float far = smoothstep(0.18, 0.4, fy);
        float cover = mix(link, 0.62, far);
        if (cover < 0.35 && far < 0.5) discard;
        float tone = 0.86 + 0.14*mix(1. - abs(x)*0.6, 1., far) - 0.1*odd*(1. - far);
        float sunny = 0.80 + 0.2*sunVis(vec3(vP.x, 0., vP.z));
        float disc = sunDisc(vec3(vP.x, 0.01, vP.z)), dp = clamp(-vP.y/66., 0., 1.);
        dp *= mix(1., 0.6, disc)*mix(1., 0.62, vStar);                      // under a sun ellipse the chains are lit deeper; the stars found by hanging keep some light
        vec3 c = uWhite*tone*sunny;
        c = mix(c, mix(uCobalt, uWhite, 0.3)*tone, smoothstep(0.02, 0.42, dp));     // white at the surface, paling to cobalt,
        c = mix(c, mix(uIron, uCobalt, 0.34), 0.86*smoothstep(0.24, 1., dp));        // then into the black by 66 m
        c = mix(c, mix(uSand, uWhite, 0.6), 0.5*disc*(1. - dp));
        c = mix(uIron, c, mix(1., vUV.z*0.22 + 0.78, far));                 // a widened far ribbon keeps its true weight
        gl_FragColor = vec4(toScene(c), 1.);
      }`})}function Ot(){const e=[[.03,0],[.16,-.08],[.09,-.18],[.36,-.48],[.43,-.9],[.25,-1.26],[0,-1.34]].map(([h,a])=>new i.Vector2(Math.max(h,.001),a));return new i.LatheGeometry(e,6)}function Yt(t){return new i.ShaderMaterial({uniforms:t,vertexShader:`
      ${yt}
      attribute vec4 aI; attribute vec4 aJ;      // aI: attach point xyz, size; aJ: tree phase, tree dir, own phase, tint
      varying vec3 vL, vN, vP; varying float vTint;
      void main(){
        float amp = mix(0.22, 0.9, 1. - smoothstep(18., 70., length(aI.xz - uCamL.xz)));
        float th = amp*0.6*sin(uTime*(1.5 + 0.5*fract(aJ.z*2.3)) + aJ.z), ph = aJ.z*3.1;
        vec3 ax = vec3(cos(ph), 0., sin(ph));
        vec3 l = position*aI.w;
        // swing about the attach point (Rodrigues, axis horizontal)
        vec3 r = l*cos(th) + cross(ax, l)*sin(th) + ax*dot(ax, l)*(1. - cos(th));
        vec3 nn = normal*cos(th) + cross(ax, normal)*sin(th) + ax*dot(ax, normal)*(1. - cos(th));
        vec3 p = aI.xyz + swayAt(aI.xyz, aJ.x, aJ.y) + r;
        vL = position; vN = nn; vP = p; vTint = aJ.w;
        gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(p, 1.);
      }`,fragmentShader:`
      varying vec3 vL, vN, vP; varying float vTint;
      ${ot}
      ${bt}
      void main(){
        vec3 n = vN/max(length(vN), 1e-3);
        float string_ = 0., tie = step(-0.2, vL.y);
        float px = fwidth(vL.y);
        float weave = 0.5 + 0.5*sin(vL.y*70.)*(1. - smoothstep(0.02, 0.06, px));
        vec3 canvas = mix(uOchre, uSand, 0.25 + 0.3*vTint)*(0.9 + 0.1*weave);
        vec3 alb = mix(canvas, uWhite*0.9, max(string_, tie*0.0));
        alb = mix(alb, uIron, tie*0.7);
        float lightTop = 0.62 + 0.38*clamp(n.y*0.5 + 0.5 + 0.35*n.x, 0., 1.);
        float sunny = 0.82 + 0.18*sunVis(vec3(vP.x, 0., vP.z));
        gl_FragColor = vec4(toScene(sink(alb*lightTop*sunny*(1. + 0.25*sunDisc(vec3(vP.x, 0.01, vP.z))), vP.y*0.8)), 1.);
      }`})}function Et(t){return new i.ShaderMaterial({uniforms:t,side:i.DoubleSide,vertexShader:`
      ${yt}
      attribute vec3 aK; varying vec3 vP; varying float vR;
      void main(){ vec3 p = position + swayAt(position, aK.x, aK.y); vP = p; vR = aK.z;
        gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(p, 1.); }`,fragmentShader:`
      varying vec3 vP; varying float vR;
      ${ot}
      ${bt}
      void main(){
        float wr = fwidth(vR) + 1e-4;
        vec3 c = mix(uCobalt*1.12, uWhite, 0.06 + 0.2*smoothstep(0.35, 1., vR));
        c = mix(c, uWhite, 0.6*smoothstep(0.86 - wr, 0.86 + wr, vR));           // the glazed rim, found too
        c *= 0.94 + 0.06*vnoise(vP.xz*0.8 + uTime*0.05);
        gl_FragColor = vec4(toScene(sink(c, vP.y*0.16)), 1.);
      }`})}function Xt(t){return new i.ShaderMaterial({uniforms:t,transparent:!0,depthWrite:!1,vertexShader:pt+"void main(){ stdVert(); }",fragmentShader:`
      varying vec3 vP, vN;
      uniform vec3 uSkyZen, uSkyHor;
      ${ot}
      // the wind's strokes at scale s: cells 0.55 m across the wind and 7 m along it, drifting to starboard
      float windN(vec2 p, float s, float k){ return vnoise(vec2(p.x*0.2, p.y*1.8)/s + vec2(uTime*0.21/s + k, -uTime*0.035 + s*7.3 + k*1.7)); }
      float glitN(vec2 p, float s){ return vnoise(vec2(p.x*2.4, p.y*5.2)/s + vec2(uTime*0.9, -uTime*0.6) + s*3.1); }
      void main(){
        vec3 v = uCamL - vP; float dist = max(length(v), 1e-3); v /= dist;
        float c = clamp(abs(v.y), 0., 1.), fres = (1. - c)*(1. - c)*(1. - c);
        float ex = abs(vP.x) - uClear.x, ez = max(uClear.y - vP.z, vP.z - uClear.z);
        float outside = smoothstep(0., max(uClear.w, 0.1), max(ex, ez));
        vec2 wob = 0.8*(vec2(vnoise(vP.xz*0.6 + uTime*0.9), vnoise(vP.zx*0.6 - uTime*0.77)) - 0.5);   // the disc's edge trembles on the water
        // the ellipse's edge on the water is not a line: the ripples break it into slivers lying along the wind
        float rag = vnoise(vec2(vP.x*0.16 + uTime*0.3, vP.z*2.3 - uTime*0.2)) - 0.5, rag2 = vnoise(vec2(vP.x*0.5 - uTime*0.4, vP.z*5.1)) - 0.5;
        float sunny = sunDisc(vec3(vP.x + wob.x + 5.5*rag + 1.6*rag2, 0.01, vP.z + wob.y + 0.5*rag2))*(1. - outside);
        float core = sunDisc(vec3(vP.x + wob.x, 0.01, vP.z + wob.y))*(1. - outside);
        // THE SHEEN: the sky's colour and nothing else (no cloud, no hall, no trunk). Looked down into, the water is the
        // iron black and clear to the model; seen along, from some 30 m off, it rises to the dome's cobalt at half strength
        float graze = 1. - smoothstep(0.03, 0.42, c);
        float sheen = max(graze*smoothstep(6., 30., dist), 0.10*smoothstep(10., 60., dist));
        vec3 skyC = mix(uSkyZen, uSkyHor, 0.55*graze*graze);
        vec3 sheenC = mix(uIron, skyC, 0.5 + 0.14*graze);
        vec3 col = mix(uIron, sheenC, smoothstep(0., 0.3, sheen));
        float a = max(mix(0.07, 0.2, fres), 0.86*sheen);
        // THE WIND: short strokes lying along it, pale cobalt and black, each drawn at the scale that keeps it some
        // 3 pixels thick (two neighbouring scales cross-faded), so they are strokes at every distance and never shimmer
        vec2 fz = fwidth(vP.xz); float fp = max(max(fz.y, fz.x*0.12), 1e-4);
        float lod = clamp(log2(fp/0.065), 0., 8.), l0 = floor(lod), lf = lod - l0, s0 = exp2(l0), s1 = s0*2.;
        float th = mix(0.73, 0.6, smoothstep(20., 320., dist));
        float lull = 0.3 + 0.7*smoothstep(0.3, 0.62, vnoise(vP.xz*0.03 + uTime*vec2(0.02, 0.013)));      // wind lanes
        float pale = mix(smoothstep(th - 0.045, th + 0.045, windN(vP.xz, s0, 0.)), smoothstep(th - 0.045, th + 0.045, windN(vP.xz, s1, 0.)), lf);
        float dark = mix(smoothstep(th - 0.045, th + 0.045, windN(vP.xz, s0, 37.3)), smoothstep(th - 0.045, th + 0.045, windN(vP.xz, s1, 37.3)), lf);
        float along = mix(0.6, 1., graze)*smoothstep(5., 16., dist);
        pale *= lull*along; dark *= (1.3 - lull)*along*(1. - pale);
        col = mix(col, mix(uIron, uCobalt, 0.12)*0.9, 0.8*dark*smoothstep(0.1, 0.5, sheen));
        col = mix(col, mix(skyC, uWhite, 0.12 + 0.3*graze), 0.8*pale);
        a = max(a, 0.72*pale);
        // THE SUN ON THE WATER: not a tan patch but glitter, dense short strokes of sand-white, and the water under
        // them left clear so the chains show lit beneath
        float gth = 0.52 + 0.1*c;
        float gl = mix(smoothstep(gth - 0.08, gth + 0.08, glitN(vP.xz, s0)), smoothstep(gth - 0.08, gth + 0.08, glitN(vP.xz, s1)), lf);
        gl *= 0.7 + 0.3*smoothstep(0.35, 0.6, windN(vP.xz*1.7, s1*2., 11.));
        float warm = max(0.45*core, 0.3*sunny);
        col = mix(col, mix(uIron, mix(uSand, uOchre, 0.2), 0.6), warm);
        col = mix(col, mix(uSand, uWhite, 0.72), sunny*gl);
        a = max(a, max(warm*(0.5 + 0.3*graze), sunny*gl));
        col = mix(col, mix(uIron*1.15, uSkyHor, 0.7), outside);
        gl_FragColor = vec4(toScene(col), clamp(mix(a, 1., outside), 0., 1.));
      }`})}function Ht(t,e){return new i.ShaderMaterial({uniforms:{...t,uOpen:{value:e?1:0}},side:i.DoubleSide,vertexShader:pt+"void main(){ stdVert(); }",fragmentShader:`
      varying vec3 vP, vN;
      uniform float uOpen;
      ${ot}
      void main(){
        vec3 p = vec3(vP.x, 59., vP.z);
        vec4 th = throatAt(p.xz); vec2 dd = p.xz - th.xy;
        float ra = length(dd)/max(th.z, 0.1), phi = atan(dd.y, dd.x + 1e-5);
        if (ra < 1.02) discard;
        if (uOpen > 0.5 && abs(p.x) < 15. && p.z > 108.) discard;
        // scalloped edge, as the hall's own
        vec2 e = vec2(${n.halfX.toFixed(1)}, ${n.halfZ.toFixed(1)}) - abs(p.xz);
        if (min(e.x + 1.6*cos(p.z*0.1745), e.y + 1.6*cos(p.x*0.2094)) < 0.) discard;
        vec3 alb = brickAt(p);
        float rim = 1. - smoothstep(1.46, 1.5, ra + 0.07*sin(phi*9. + th.y) + 0.04*sin(phi*23.));
        float hsh = hash21(floor(vec2(phi*5.5, ra*9.)) + th.xy);
        vec3 rimC = ra < 1.2 ? (hsh < 0.42 ? mix(uWhite, uGreen, uGlazeMix.y) : hsh < 0.78 ? mix(uWhite, uOchre, uGlazeMix.z) : uWhite) : shardCol(hsh, 0.);
        float px = length(fwidth(vP));
        rimC = mix(rimC, mix(uWhite, mix(uGreen, uOchre, 0.45), 0.8*uGlazeMix.y), smoothstep(0.25, 0.7, px));
        vec3 D = mix(mix(alb*uShade, uCobalt, 0.06)*1.12, rimC*0.8, rim);
        D *= 0.8 + 0.2*sunVis(vec3(p.x, 30., p.z));
        gl_FragColor = vec4(toScene(mix(mix(uIron*1.15, uCobalt, 0.22*uSteep), D, 0.56*(1. - 0.72*uSteep))), 1.);
      }`})}function Rt(t){const e=[],o=[],h=[],a=[];for(let s=-1;s<=1;s++)for(let l=0;l<n.nThrZ;l++){const u=s*30,d=at(l),M=-n.neckY+2.5+t.range(-.8,.8),z=t.range(0,6.283),x=t.range(0,6.283),g=e.length/3,y=t.range(-.04,.04),m=t.range(-.04,.04),f=[];e.push(u,M,d),o.push(z,x,0);for(let p=0;p<=24;p++){const w=p/24*Math.PI*2,k=Math.cos(w)*n.aGreat,$=Math.sin(w)*n.aGreat,C=M+k*y+$*m;e.push(u+k,C,d+$),o.push(z,x,1),f.push(new i.Vector3(u+k,C+.05,d+$)),p<24&&h.push(g,g+1+p,g+2+p)}a.push({pts:f,tree:z,dir:x,pin:!1,w:1.5})}const c=new i.BufferGeometry;return c.setAttribute("position",new i.Float32BufferAttribute(e,3)),c.setAttribute("aK",new i.Float32BufferAttribute(o,3)),c.setIndex(h),c.boundingSphere=new i.Sphere(new i.Vector3(0,-63,0),200),{geometry:c,rings:a}}async function te(t,e={}){const o=t.rng,h=O(e.detail??t.quality?.detail??1,.6,1),a=e.shared??Wt(e.palette??zt),c=e.colourway??"all";a.uGlazeMix.value.set(c==="white"?0:1,c==="all"?1:0,c==="all"?1:0,c==="all"?1:0);const s=new i.Group;s.name="hall-and-hanging-model";const l=Dt(o.fork?o.fork("trees"):o);await t.yield();const u=!!e.unbuilt,d=r=>u&&r.c===n.nZ-1&&(r.r===1||r.r===2),M=new i.Mesh(await Nt(t,l,d),Lt(a));M.name="stone",s.add(M);const z=new i.Mesh(M.geometry,Lt(a,!0));z.name="stone-mirror",z.frustumCulled=!1,e.mirror!==!1&&s.add(z),await t.yield();const x=new i.Mesh(await $t(t,u?(r,b)=>r===0&&b===n.nThrZ-1:null),qt(a));x.name="vault",s.add(x),await t.yield();const g=o.fork?o.fork("chains"):o,y=[],m=[],f=[],p=r=>new i.Vector3(r.x,-Math.max(r.y,0),r.z),w=(r,b,P,F)=>wt(r,b,P).map((V,B)=>(V.y-=F*Math.sin(Math.PI*B/P),V));for(const r of l){const b=g.range(0,6.283),P=(V,B,_)=>y.push({pts:V,tree:r.phase,dir:b,w:B,pin:_});P(r.trunk.filter((V,B)=>B%2===0).map(p),4,!1);const F=p(r.f1);for(let V=0;V<4;V++){const B=p(r.f2[V]);P(w(F,B,5,.5),2.4,!0);for(let K=0;K<3;K++){const et=p(r.heads[V][K]),rt=w(B,et,4,.35),ht=new i.Vector3(et.x,et.y-.8,et.z);rt.push(ht),P(rt,1.5,!0),m.push(ht.x,ht.y,ht.z,g.range(2.4,3.4)),f.push(r.phase,b,g.range(0,6.283),g())}const _=r.heads[V].map(p),R=p(r.heads[(V+1)%4][0]);P(w(_[0],_[1],5,1.4),.8,!0),P(w(_[1],_[2],5,1.4),.8,!0),(h>.7||V%2===0)&&P(w(_[2],R,5,1.8),.8,!0)}}await t.yield();for(const r of e.extraStrands??[])y.push(r);for(const r of e.extraSacks??[])m.push(r.x,r.y,r.z,r.size??3),f.push(r.phase??0,r.dir??0,r.own??0,r.tint??.5);const k=Rt(g);for(const r of k.rings)y.push({...r,dir:r.dir+62.83185307});for(const r of k.rings){const b=new i.Vector3;for(let B=0;B<24;B++)b.add(r.pts[B]);b.multiplyScalar(1/24);const P=h>.7?20:14,F=2.3,V=n.aGreat*Math.sqrt(1+F*F);for(let B=0;B<P;B++)for(const _ of[-1,1]){const R=(B+(_>0?.5:0))/P*Math.PI*2,K=R+_*Math.atan(F),et=new i.Vector3(b.x+Math.cos(R)*n.aGreat,b.y,b.z+Math.sin(R)*n.aGreat),rt=new i.Vector3(b.x+Math.cos(K)*V,b.y+4.6,b.z+Math.sin(K)*V);y.push({pts:[et,et.clone().lerp(rt,.5),rt],tree:r.tree,dir:r.dir+62.83185307,pin:!1,w:.75})}}await t.yield();const $=jt(a),C=Math.max(1,Math.ceil(y.length/450));for(let r=0;r<C;r++){const b=new i.Mesh(_t(y.slice(Math.floor(r*y.length/C),Math.floor((r+1)*y.length/C)),g),$);b.name="chains",b.frustumCulled=!1,s.add(b),await t.yield()}await t.yield();const T=Ot(),W=new i.InstancedBufferGeometry;W.index=T.index,W.setAttribute("position",T.getAttribute("position")),W.setAttribute("normal",T.getAttribute("normal")),W.setAttribute("aI",new i.InstancedBufferAttribute(new Float32Array(m),4)),W.setAttribute("aJ",new i.InstancedBufferAttribute(new Float32Array(f),4)),W.instanceCount=m.length/4;const I=new i.Mesh(W,Yt(a));I.name="sacks",I.frustumCulled=!1,s.add(I);const L=new i.Mesh(k.geometry,Et(a));L.name="discs",L.frustumCulled=!1,s.add(L),e.clear&&a.uClear.value.set(e.clear.x??n.halfX+12,e.clear.z0??-320,e.clear.z1??290,e.clear.fade??26);const D=a.uClear.value,q=new i.Mesh(new i.BoxGeometry(2*(D.x+D.w+2),78,D.z-D.y+2*(D.w+2)),e.abyssMaterial??new i.MeshBasicMaterial({color:Gt(a.uIron.value.clone().multiplyScalar(.97)),side:i.BackSide,fog:!1}));if(q.frustumCulled=!1,e.mirror!==!1){const r=new i.Mesh(new i.PlaneGeometry(2*n.halfX+4,2*n.halfZ+4).rotateX(-Math.PI/2),Ht(a,u));r.position.y=-64.3,r.name="vault-mirror",r.frustumCulled=!1,s.add(r)}q.position.set(0,-39.4,(D.y+D.z)/2),q.name="abyss",s.add(q);let v=null;e.water!==!1&&(v=new i.Mesh(new i.PlaneGeometry(e.waterSize??5e3,e.waterSize??5e3).rotateX(-Math.PI/2),Xt(a)),v.name="water",v.renderOrder=3,s.add(v)),await t.yield();const A=[];for(const r of l)if(!d(r)){A.push([r.foot,r.f1,2.85]);for(let b=0;b<4;b++){A.push([r.f1,r.f2[b],1.5]);for(const P of r.heads[b])A.push([r.f2[b],P,.9])}}const G=(r,b,P)=>{let F=1e9;xt.set(r,b,P);for(const[V,B,_]of A){X.subVectors(B,V);const R=X.lengthSq(),K=O(J.subVectors(xt,V).dot(X)/R,0,1);F=Math.min(F,J.copy(V).addScaledVector(X,K).distanceTo(xt)-_)}if(Math.abs(r)<n.halfX&&Math.abs(P)<n.halfZ){const V=nt(ct(r)),B=at(ft(P)),_=Math.abs(V)>50?n.aLess:n.aGreat,R=Math.hypot(r-V,P-B);R<_*1.25&&b>56?F=Math.min(F,_-R):F=Math.min(F,b<64?it(r,P)-b:b-lt(r,P))}return F},N=l[1*n.nZ+1],Z=(r,b)=>{const P=O(b/r.f1.y,0,1),F=.72*P+.28*P*P;return new i.Vector3(E(r.foot.x,r.f1.x,F),b,E(r.foot.z,r.f1.z,F))},Y=a.uSun.value.clone(),j=new i.Vector3,H=new i.Vector3,S=(r,b,P)=>new i.Vector3(r,b,P),U={worldOffset:S(0,0,310),entry:S(0,8,-160),exitGap:S(0,8,162),portalSeat:{position:S(0,8,270),facing:S(0,0,-1)},heroTrunk:{foot:N.foot.clone(),fork:N.f1.clone(),lean:N.lean,axisAt:r=>Z(N,r)},upThroat:{axis:S(-30,n.neckY,-90),radius:n.aGreat},downThroat:{axis:S(0,n.neckY,18),radius:n.aGreat},flyThrough:[S(0,8,-160),S(5,10,-125),S(4,12,-92),S(0,40,-76),S(0,66,-54),S(0,76,-34),S(-7,75,-8),S(0,78,6),S(0,66,18),S(0,30,37),S(0,5,62),S(0,5,150),S(0,8,270)],viewpoints:{level:{from:S(4,10,-128),to:S(4,14,-40)},helix:{from:Z(N,22).add(S(-10,0,0)),to:Z(N,24)},dive:{from:S(0,60,22),to:S(0,0,42)}},throats:[],roofCrests:{ridgeDist:Mt,roofY:lt},trees:l,clearance:G,soffitY:it,roofY:lt,shared:a};for(let r=-2;r<=2;r++)for(let b=0;b<n.nThrZ;b++)U.throats.push({x:nt(r),z:at(b),radius:Math.abs(r)===2?n.aLess:n.aGreat,neckY:n.neckY,collarY:n.collarY,great:Math.abs(r)<2});return{object:s,radius:178,height:72,center:S(0,14,0),anchors:U,shared:a,trees:l,ground:!1,groundY:0,setProgress(r){a.uU.value=r,a.uSun.value.copy(Y).applyAxisAngle(i.Object3D.DEFAULT_UP,-r*7*Math.PI/180)},update(r,b,P){if(a.uTime.value=b,s.getWorldPosition(j),a.uOrigin.value.copy(j),P){H.setFromMatrixPosition(P.matrixWorld),a.uCamL.value.copy(H).sub(j);const F=-P.matrixWorld.elements[9];a.uSteep.value=st(.42,.85,-F)}},dispose(){}}}export{It as HALL,zt as PALETTE,ot as STYLE_GLSL,yt as SWAY_GLSL,te as buildHero,Ht as ceilingMirrorMaterial,_t as chainGeometry,jt as chainMaterial,Et as discMaterial,Wt as makeShared,Mt as ridgeDist,lt as roofY,Yt as sackMaterial,it as soffitY,Dt as solveTrees,Lt as stoneMaterial,Qt as sweepGeometry,gt as sweepMember,Gt as toScene,qt as vaultMaterial,Xt as waterMaterial};
