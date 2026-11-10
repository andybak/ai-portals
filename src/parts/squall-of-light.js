import*as q from"three";const ct=(o,n,e)=>{const t=Math.min(1,Math.max(0,(e-o)/(n-o)));return t*t*(3-2*t)},Dt={fire:{core:"#FFF6D8",lemon:"#FFDD6E",gold:"#F7AC3C",fire:"#E66A30",red:"#B23A26",rose:"#D9998A",cream:"#F2D49C",dusk:"#8F8AA8",slate:"#3F5679",zen:"#6F8DB2",umber:"#2E211B",pearl:"#E6DDCB",sea:"#2C3A3E",ghost:"#EFE3C4",sunEl:6.4,sunAz:12}};function Et(){const n=new Uint8Array(65536),e=new Uint8Array(256*256),t=new Uint8Array(256*256*4);let l=49734321;const d=()=>(l=Math.imul(l,1664525)+1013904223>>>0,l>>>24);for(let u=0;u<256*256;u++)n[u]=d(),e[u]=d();for(let u=0;u<256;u++)for(let x=0;x<256;x++){const z=u*256+x;t[z*4]=n[z],t[z*4+1]=n[(u+239&255)*256+(x+37&255)],t[z*4+2]=e[z],t[z*4+3]=255}const c=new q.DataTexture(t,256,256,q.RGBAFormat);return c.wrapS=c.wrapT=q.RepeatWrapping,c.minFilter=c.magFilter=q.LinearFilter,c.generateMipmaps=!1,c.colorSpace=q.NoColorSpace,c.needsUpdate=!0,c}function Tt(o,n,e){const t=Dt[o]||Dt.fire,l=g=>({value:new q.Color(g)}),d=t.sunAz*Math.PI/180,c=(e||t.sunEl)*Math.PI/180,u=new q.Vector3(Math.sin(d)*Math.cos(c),Math.sin(c),Math.cos(d)*Math.cos(c)).normalize(),x=new q.Vector3().crossVectors(new q.Vector3(0,1,0),u).normalize(),z=new q.Vector3().crossVectors(u,x).normalize(),E=new q.Vector2(u.x,u.z).normalize();return{uT:{value:0},uSun:{value:u},uSunR:{value:x},uSunU:{value:z},uSunH:{value:E},uRes:{value:new q.Vector2(1280,720)},uNoise:{value:Et()},uSeed:{value:n||new q.Vector3(3.1,7.7,1.3)},cCore:l(t.core),cLemon:l(t.lemon),cGold:l(t.gold),cFire:l(t.fire),cRed:l(t.red),cRose:l(t.rose),cCream:l(t.cream),cDusk:l(t.dusk),cSlate:l(t.slate),cZen:l(t.zen),cUmber:l(t.umber),cPearl:l(t.pearl),cSea:l(t.sea),cGhost:l(t.ghost),uHaze:{value:new q.Vector4(1/340,.012,0,0)},uSq:{value:new q.Vector4(0,0,120,0)},uSwell:{value:new q.Vector4(.14,1.9,0,0)},uCalm:{value:new q.Vector4(1e9,2e9,0,0)},uFol:{value:new q.Vector3},uVes:{value:Array.from({length:14},()=>new q.Vector4)},uVesS:{value:Array.from({length:14},()=>new q.Vector4)},uBxC:{value:Array.from({length:32},()=>new q.Vector4)},uBxH:{value:Array.from({length:32},()=>new q.Vector4)},uBxCol:{value:Array.from({length:32},()=>new q.Vector3)}}}const zt=`
uniform float uT; uniform vec3 uSun, uSunR, uSunU, uSeed; uniform vec2 uSunH, uRes; uniform sampler2D uNoise;
uniform vec3 cCore, cLemon, cGold, cFire, cRed, cRose, cCream, cDusk, cSlate, cZen, cUmber, cPearl, cSea, cGhost;
uniform vec4 uHaze, uSq, uSwell, uCalm;
uniform vec4 uVes[14], uVesS[14], uBxC[32], uBxH[32]; uniform vec3 uBxCol[32];
float tN2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return textureLod(uNoise, (mod(i, 256.) + f + .5) / 256., 0.).b; }
float tN3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  vec2 uv = mod(i.xy + vec2(37., 239.) * i.z, 256.) + f.xy; vec2 rg = textureLod(uNoise, (uv + .5) / 256., 0.).rg; return mix(rg.x, rg.y, f.z); }
float tFbm2(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++){ s += a * tN2(p); p = p * 2.03 + vec2(17.1, 3.7); a *= .5; } return s / .9375; }
float tFbm3(vec3 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++){ s += a * tN3(p); p = p * 2.03 + vec3(17.1, 3.7, 9.2); a *= .5; } return s / .9375; }
float tFbm3b(vec3 p){ float a = .5, s = 0.; for (int i = 0; i < 3; i++){ s += a * tN3(p); p = p * 2.11 + vec3(5.3, 13.7, 2.9); a *= .5; } return s / .875; }
float tHash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 tHash2(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }

// The lay-in: the sky with no brushwork in it. It is also the colour of the haze in a direction and what the water mirrors.
vec3 tLay(vec3 d){
  float el = clamp(d.y, 0., 1.);
  float th = acos(clamp(dot(d, uSun), -1., 1.));
  vec2 dh = d.xz * inversesqrt(max(dot(d.xz, d.xz), 1e-6));
  float sw = dot(dh, uSunH) * .5 + .5;                                    // 1 toward the sun's bearing, 0 away from it
  vec3 low = mix(cDusk, cCream, sw * sw * sw), high = mix(cSlate, cZen, sw * sw);
  vec3 col = mix(low, high, 1. - exp(-el * 4.2));
  float t2 = th * th;
  col = mix(col, cFire, .62 * exp(-t2 / .34) * exp(-el * 1.6));
  col = mix(col, cGold, .9 * exp(-t2 / .085));
  col = mix(col, cLemon, .95 * exp(-t2 / .022));
  col = mix(col, cCore, exp(-t2 / .0042));
  return col;
}

vec3 tHazeCol(vec3 rd){ vec3 h = normalize(vec3(rd.x, max(rd.y, 0.) * .6 + .03, rd.z)); return tLay(h); }

// The painted sky. Under everything a soft picture: the lay-in, veils of cloud wound in a slow whirl about the sun, banks lying
// along the horizon further off. Over it the brush: strokes that each carry ONE colour, taken from the soft picture at the
// stroke's own middle, laid along the whirl near the sun and level away from it; each has a ridge and the bristle's drag.
vec3 tTwist(vec3 d, float a){ float c = cos(a), s = sin(a); return d * c + cross(uSun, d) * s + uSun * dot(uSun, d) * (1. - c); }
vec3 tVeilCol(vec3 col, vec2 dl, float th, float tone){
  float t2 = th * th, near = exp(-t2 / .5), off = 1. - exp(-t2 / .012);
  vec3 dfar = mix(cSlate * .74, cDusk * .8, tone), dnear = mix(cRed, cFire, tone * .9);
  col = mix(col, mix(dfar, dnear, smoothstep(.06, .62, near)), dl.x * off * (.84 - .3 * near));
  vec3 lc = mix(mix(cPearl, cRose, .45 * (1. - tone)), mix(cLemon, cCore, tone), smoothstep(.12, .8, near));
  return mix(col, lc, dl.y * off * .8);
}
// The colour of the squall's vapour in a direction: a blaze toward the sun, slate rain on its lee, darker as one looks up into it.
vec3 tSquallCol(vec3 d){
  vec2 hn = d.xz * inversesqrt(max(dot(d.xz, d.xz), 1e-6)); float sd = dot(hn, uSunH), sunward = smoothstep(.8, .995, sd);
  vec3 lee = mix(cSlate * .5 + cUmber * .16, mix(cSlate, cDusk, .42) * .7, smoothstep(.3, .98, sd));
  vec3 c = mix(lee, mix(tHazeCol(d), mix(cLemon, cCore, .5), .3), sunward);
  return mix(c, c * vec3(.42, .47, .66), smoothstep(.05, .38, d.y) * (1. - .55 * sunward));
}
// The squall against the sky: a pillar of rain with the light in it and the dark cloud that carries it. It is a body in the
// world (the very column the air knows), reckoned from where the eye stands, so it keeps its place as we come up and go through.
float tErf(float x){ float s = sign(x), a = abs(x); float t = 1. / (1. + .3275911 * a); float y = 1. - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - .284496736) * t + .254829592) * t * exp(-a * a); return s * y; }
vec3 tSquallOn(vec3 col, vec3 d){
  if (uSq.w <= 0.) return col;
  vec2 oh = cameraPosition.xz - uSq.xy, dh = d.xz; float a = max(dot(dh, dh), 1e-4), b = dot(dh, oh), c = dot(oh, oh), R = uSq.z, sa = sqrt(a);
  float tc = max(-b / a, 0.), yc = cameraPosition.y + max(d.y, 0.) * tc, miss = max(c - b * b / a, 0.);
  float lat = (oh.x * dh.y - oh.y * dh.x) / sa;
  vec2 hn = dh / sa; float sunward = smoothstep(-.2, .95, dot(hn, uSunH));
  // the pillar: rain falling in long slant streaks, thick low and thinning as the sight line climbs
  float yEff = cameraPosition.y + max(d.y, 0.) * (tc + .5 * R / sa);
  float rag = tN2(vec2(yc * .011 + uSeed.x, lat * .006 + uSeed.z)), latS = lat - (yc - 25.) * .3;      // its flanks are ragged, and it leans down the wind
  float tauP = uSq.w * .5 / sa * exp(-latS * latS / (R * R * (.4 + 1.2 * rag))) * (1. - tErf((b / sa) / R)) * exp(-yEff / 120.);
  float streak = tN2(vec2((lat - yc * .4) * .07, yc * .007) + uSeed.xy);
  // seen from outside, its rain falls in slant streaks; from within there is no column to see, and the rain goes round with the whirl
  float th = acos(clamp(dot(d, uSun), -1., 1.)), t2 = th * th, inS = exp(-c / (R * R * 1.15));
  vec3 dW = tTwist(d, 2.1 * log(min(th, 1.5) + .1) + uT * .01);
  float farS = smoothstep(.12, .6, th);                                    // far from the sun nothing of it is wound, seen from within: broken cloud, soft at the edge (wound that far out, its arms would stand as straight rays)
  streak = mix(streak, mix(.25 + .5 * tN3(dW * 3.7 + uSeed.zxy * 2.3), .5, farS), smoothstep(.06, .4, inS));
  tauP *= .55 + .9 * streak;
  vec3 pc = tSquallCol(d);
  pc = mix(pc, pc * vec3(.7, .74, .86), (1. - streak) * .5);
  float veil = 1. - exp(-tauP);
  col = mix(col, pc, veil);
  // the cloud that carries it: dark arms wound about the sun (their winding is the sky's own, at infinity) and standing where the squall
  // stands (a lid some way up, reckoned from the eye). The eye of it, about the sun, is open; the arms nearest the sun take fire.
  float t1 = (85. - cameraPosition.y) / max(d.y, .02); vec2 pa = oh + dh * t1; float RA = R * 3.0;
  float arm = tFbm3b(dW * 2.0 + uSeed.yzx * 1.3);
  inS *= smoothstep(.1, .45, inS);                                         // how deep the eye stands in it: from within, the whole sky is its whirl, down to the sea; a little way out of it none of that is left
  float wS = 1. - smoothstep(.3, .75, inS);                                // deep in it the arms are sharp; toward its edge they are broad and soft
  float inF = farS * smoothstep(0., .5, inS);
  float armR = arm;
  if (inS > .002) armR = mix(arm, tFbm3b(d * 1.7 + uSeed.yzx * 1.3 + 4.3), farS) + (tN3(mix(dW, d, farS) * 6.1 + uSeed.xzy * 1.9) - .5) * (.1 + .16 * farS);
  float tauA = 7.5 * (exp(-dot(pa, pa) / (RA * RA)) * min(.4 / max(d.y, .08), 2.4) * mix(1., .6, inF) * smoothstep(.25 - .08 * inF, .5 + .18 * inF, mix(arm, armR, inF)) + inS * mix(1.5, .45, farS) * smoothstep(.47 - .1 * wS - .1 * farS, .56 + .16 * wS + .2 * farS, armR)) * (1. - exp(-t2 / .026));
  float tn = tN3(d * 7.3 + uSeed.zxy), tb = tN3(d * 2.7 + uSeed.yxz * 1.7);  // no two strokes of it the same dark, and broad lights lie in it
  vec3 cc = mix(mix(cSlate * .34, mix(cUmber, cSlate, .5) * .8, armR), mix(cSlate, cDusk, .4) * .62, tn * .7);
  cc = mix(cc, mix(cDusk, cRose, .4) * .78, smoothstep(.52, .8, tb) * .42);  // where the low light finds its under side
  cc = mix(cc, mix(cRed, cFire, .5) * .92, exp(-t2 / .085) * .85 * smoothstep(.66, .42, arm));
  col = mix(col, cc, (1. - exp(-tauA)) * (1. - .3 * veil));                 // the rain hangs before the cloud, and takes some of its dark
  // and from within, between the dark arms the light pours down the whirl: pale arcs of lit rain wound with them
  float lg = smoothstep(.47 + .06 * farS, .38 - .14 * farS, armR) * inS * exp(-t2 / .7) * (1. - exp(-t2 / .02));
  return mix(col, mix(mix(cPearl, cCream, .55), mix(cLemon, cCore, .5), exp(-t2 / .22)), lg * (.5 + .2 * exp(-t2 / .4)));
}
vec3 tField(vec3 d, float soft){
  vec3 col = tLay(d);
  float th = acos(clamp(dot(d, uSun), -1., 1.)), t2 = th * th;
  float wW = exp(-t2 / .7);                                               // how far the whirl reaches
  vec3 p1 = tTwist(d, 1.15 * log(min(th, 1.2) + .08) - uT * .008);
  float v1 = tFbm3(p1 * 2.4 + uSeed);
  float vH = tFbm3b(vec3(d.x * 2.6, d.y * 9., d.z * 2.6) + uSeed.zxy * 1.7 + vec3(uT * .004, 0., 0.));   // banks lying level
  float e = mix(vH, v1, .25 + .75 * wW);
  float tone = tN3(p1 * 5.1 + uSeed.yzx);
  vec2 dl = vec2(smoothstep(.46 + soft, .39 - soft, e), smoothstep(.57 - soft, .66 + soft, e));
  return tSquallOn(tVeilCol(col, dl, th, tone), d);
}
vec3 tSkySoft(vec3 d){ return tField(d, .05); }
// a cell of strokes. p in cells (x along the stroke, y across). x: the bristle here, y: across, z: how much paint, w: its dice; pc: its middle
vec4 tCell(vec2 p, float lvl, out vec2 pc){
  float row = floor(p.y), o = tHash(vec2(row, lvl)) * 7.31, A = p.x + o;
  vec2 id = vec2(floor(A), row), f = vec2(A - id.x, p.y - row) - .5;
  vec2 hs = tHash2(id + lvl * 17.3);
  vec2 jit = (hs - .5) * vec2(.16, .14), g = f - jit;
  // loaded at its middle, dragged thin to its ends; its sides are broken by the bristle (a dry brush leaves hairs, not a blur)
  float body = 1. - smoothstep(.45, 1., length(vec2(g.x / (.36 + .14 * hs.y), g.y / .44)));
  float hair = tN2(vec2(A * 1.3 + hs.x * 9., p.y * 26.) + lvl * 5.7);
  float m = smoothstep(hair * .7, hair * .7 + .2, body * 1.3);
  m *= smoothstep(.5, .45, abs(f.x)) * smoothstep(.5, .47, abs(f.y));
  pc = vec2(id.x + .5 + jit.x - o, row + .5 + jit.y);
  return vec4(hair, g.y, m, hs.x);
}
// the sky's own cell of strokes: as tCell, but laid by hand: no two strokes one size, each a little off its row and out of its
// place, loaded at one end and dragged dry toward the other; and (soft, 0 to 1) how far it is a scumble and not a dab: about
// the sun the paint is laid thick in crisp touches, away from it it is dragged thin and worked into the ground
vec4 tCellW(vec2 p, float lvl, float soft, float bare, out vec2 pc){
  float row = floor(p.y), o = tHash(vec2(row, lvl)) * 7.31, A = p.x + o;
  vec2 id = vec2(floor(A), row), f = vec2(A - id.x, p.y - row) - .5;
  vec2 hs = tHash2(id + lvl * 17.3), h2 = tHash2(id + lvl * 5.9 + 41.3);
  float sc = .78 + .36 * h2.x;
  vec2 jit = (hs - .5) * (vec2(.16, .14) + vec2(.66, .52) * (1.14 - sc)), g = f - jit;
  float an = (h2.y - .5) * .5, ca = cos(an), sa = sin(an); g = vec2(g.x * ca - g.y * sa / 1.7, g.x * sa * 1.7 + g.y * ca);
  vec2 ge = abs(vec2(g.x / ((.36 + .14 * hs.y) * sc), g.y / (.44 * sc)));
  float body = 1. - smoothstep(.45 * (1. - .8 * soft), 1., pow(ge.x * ge.x * ge.x + ge.y * ge.y * ge.y, .3333));     // a touch of the brush is blunt where it is set down: no leaf
  float hair = tN2(vec2(A * 1.3 + hs.x * 9., p.y * 26.) + lvl * 5.7), dry = (.7 + .3 * h2.y) * (1. - .5 * soft);
  dry *= 1. + .4 * smoothstep(-.25, .5, g.x * (hs.x < .5 ? 1. : -1.) / sc);
  float m = smoothstep(hair * dry, hair * dry + .2 + .75 * soft, body * 1.3);
  m *= smoothstep(.5, .45, abs(f.x)) * smoothstep(.5, .47, abs(f.y)) * step(bare, fract(h2.x * 7.7 + h2.y * 3.1));
  pc = vec2(id.x + .5 + jit.x - o, row + .5 + jit.y);
  return vec4(hair, g.y / sc, m, hs.x);
}
// strokes laid along the whirl's own arms: ph round the sun (0 straight up; the seam is straight down, out of sight), lg the log of the angle from it
vec3 tWhirl(float ph, float lg, float n, float hl, float k, float lvl, float soft, float bare, out vec4 s){
  vec2 pc; s = tCellW(vec2(lg / hl, (ph + k * lg) * n / 6.2832), lvl, soft, bare, pc);
  float lgc = pc.x * hl, phc = pc.y * 6.2832 / n - k * lgc, thc = max(exp(lgc) - .07, 0.);
  return tField(cos(thc) * uSun + sin(thc) * (sin(phc) * uSunR + cos(phc) * uSunU), .1 * soft);          // a scumbled stroke carries a broken tone, not the veil's pure one
}
// level strokes: az round the horizon, el up from it
vec3 tLevel(float az, float el, float n, float h, float lvl, float soft, float bare, out vec4 s){
  vec2 pc; s = tCellW(vec2(az / 6.2832 * n, el / h), lvl, soft, bare, pc);
  float azc = pc.x / n * 6.2832, elc = clamp(pc.y * h, 0., 1.5);
  return tField(vec3(sin(azc) * cos(elc), sin(elc), cos(azc) * cos(elc)), 0.);
}
vec3 tLayOn(vec3 col, vec3 c, vec4 s, float op, float vary){               // one stroke over what is there: its colour, its ridge, its bristle
  float edge = s.z * (1. - s.z) * 4., d2 = fract(s.w * 7.31 + .37);
  c = mix(c, col, .22);                                                    // a stroke takes up a little of what it is laid into
  c *= 1. + (s.w - .5) * (.13 + .2 * vary);
  c *= mix(vec3(1.), d2 < .5 ? vec3(.9, .98, 1.1) : vec3(1.12, .98, .92), vary * abs(d2 - .5) * 1.7);   // away from the sun no two strokes are one blue
  c *= 1. - .3 * s.y * edge;
  c *= .93 + .14 * s.x;
  return mix(col, c, s.z * op);
}
vec3 tTame(vec3 c, vec3 col, float k){ float dl = dot(c - col, vec3(.3, .5, .2)); return mix(c, col, smoothstep(.08, .34, abs(dl)) * k); }   // a stroke over a far lighter or darker ground is worked into it
vec2 tDepth(vec3 ro, vec3 rd, float D);
vec3 tSky(vec3 d){
  float th = acos(clamp(dot(d, uSun), -1., 1.)), t2 = th * th;
  vec3 col = tField(d, .04);
  float wW = smoothstep(1.05, .6, th);
  vec4 s; vec3 c;
  if (wW > .002) {
    float x = dot(d, uSunR), y = dot(d, uSunU);
    float ph = atan(x, abs(x) + abs(y) < 1e-6 ? 1e-6 : y), lg = log(th + .07);
    float far = 1. - exp(-t2 / .5);                                        // away from the sun no stroke stands out of its ground like a stamp
    float scum = smoothstep(.22, .7, th);                                  // about the sun the paint is laid thick in crisp touches; away from it it is scumbled: dragged thin and soft into the ground
    float tk = max(.7 * far, .55 * smoothstep(.25, .55, th));              // and no pale touch stands whole on a dark ground but hard by the sun
    c = tWhirl(ph, lg, 15., .7, 1.15, 1., scum, 0., s); col = tLayOn(col, tTame(c, col, tk), s, (.8 + .15 * s.w) * wW, 0.);
    c = tWhirl(ph + .37, lg + .11, 26., .42, .85, 2., scum * .8, 0., s); col = tLayOn(col, tTame(c, col, tk * .93), s, (.6 + .35 * s.w) * wW, 0.);
    c = tWhirl(ph + .9, lg + .05, 46., .23, 1.45, 5., scum * .5, 0., s); col = tLayOn(col, tTame(c, col, .8 * far), s, (.5 + .4 * s.w) * wW * step(.45, s.w), 0.);
  }
  if (wW < .998) {
    float az = atan(d.x, abs(d.x) + abs(d.z) < 1e-6 ? 1e-6 : d.z), el = asin(clamp(d.y, 0., 1.));
    c = tLevel(az, el, 20., .1, 3., .55, 0., s); col = tLayOn(col, c, s, (.8 + .15 * s.w) * (1. - wW), 1.);
    c = tLevel(az + .11, el + .019, 40., .05, 4., .4, 0., s); col = tLayOn(col, tTame(c, col, .6), s, (.6 + .35 * s.w) * (1. - wW), 1.);
  }
  // the low air takes the sky's foot into the light, so no line stands where the sea ends
  float lowK = exp(-max(d.y, 0.) * 30.) * .94;
  if (lowK > .01) {                                                        // (the squall stands on the sea: where it stands, the foot is its vapour)
    vec3 dlow = normalize(vec3(d.x, .03, d.z)); vec2 tl = tDepth(cameraPosition, normalize(vec3(d.x, 0., d.z)), 2400.);
    col = mix(col, mix(tLay(dlow), tSquallCol(dlow), tl.y / (tl.x + tl.y + 1e-4)), lowK);
  }
  // the sun: a rimless clot of white, laid on thick (above 1: the glow pass takes it from there)
  float clot = smoothstep(.036, .012, th + (tN2(d.xy * 90.) - .5) * .014);
  col += cCore * clot * 1.7;
  return col;
}

// Air. Everything far goes into the colour of the light behind it; the squall is a column of lit vapour standing on the sea.
vec2 tDepth(vec3 ro, vec3 rd, float D){                                    // optical depth along a sight line of D metres: x of the air, y of the squall's column
  float k = uHaze.y, dy = abs(rd.y) < 1e-4 ? 1e-4 : rd.y;
  float base = uHaze.x * exp(-k * max(ro.y, 0.)) * (1. - exp(-k * dy * D)) / (k * dy);     // thinning with height
  vec2 oh = ro.xz - uSq.xy, dh = rd.xz; float a = max(dot(dh, dh), 1e-6), b = dot(dh, oh), c = dot(oh, oh), R = uSq.z, sa = sqrt(a);
  float col = uSq.w / (1.7725 * R) * exp(-max(c - b * b / a, 0.) / (R * R)) * (R / sa) * .8862 * (tErf((D * sa + b / sa) / R) - tErf((b / sa) / R));
  return vec2(base, col);
}
vec3 tAirK(vec3 col, vec3 P, float k){                                     // k: how much of the squall's vapour counts (the water under it is lost in it; a hull standing in it is not)
  vec3 v = P - cameraPosition; float D = length(v); vec3 rd = v / max(D, 1e-3);
  vec2 tau = tDepth(cameraPosition, rd, D); tau.y *= k; float f = 1. - exp(-tau.x - tau.y);
  f = pow(f, 1.35); f = f * f * (3. - 2. * f);                            // near darks keep their strength; far things go wholly into the light
  return mix(col, mix(tHazeCol(rd), tSquallCol(rd), tau.y / (tau.x + tau.y + 1e-4)), f);
}
vec3 tAir(vec3 col, vec3 P){ return tAirK(col, P, 1.); }

// The sea's long swell: height and slope at a place. Calm in the estuary; got up where the squall stands.
float tSwellAmp(vec2 p){ vec2 o = p - uSq.xy; return uSwell.x + uSwell.y * exp(-dot(o, o) / (uSq.z * uSq.z * 1.6)); }
vec3 tSwell(vec2 p){                                                       // x: height, yz: d/dx, d/dz
  float A = tSwellAmp(p), h = 0.; vec2 g = vec2(0.);
  vec2 d1 = vec2(.34, .94), d2 = vec2(-.5, .866), d3 = vec2(.8, .6);
  float k1 = .105, k2 = .17, k3 = .29;
  float a1 = dot(p, d1) * k1 - uT * .62, a2 = dot(p, d2) * k2 - uT * .8 + 1.7, a3 = dot(p, d3) * k3 - uT * 1.05 + 4.1;
  h += A * sin(a1); g += A * k1 * cos(a1) * d1;
  h += A * .55 * sin(a2); g += A * .55 * k2 * cos(a2) * d2;
  h += A * .3 * sin(a3); g += A * .3 * k3 * cos(a3) * d3;
  return vec3(h, g);
}
`;function Lt(o){const n=new q.ShaderMaterial({uniforms:o,side:q.BackSide,depthWrite:!1,depthTest:!1,vertexShader:"varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix * viewMatrix * vec4(cameraPosition + position * 1800., 1.); gl_Position = p; }",fragmentShader:`varying vec3 vDir;
      ${zt}
      void main(){
        vec3 d = normalize(vDir);
        vec3 col = tSky(normalize(vec3(d.x, max(d.y, 0.), d.z)));
        gl_FragColor = vec4(col, 1.);
      }`}),e=new q.Mesh(new q.IcosahedronGeometry(1,4),n);return e.frustumCulled=!1,e.renderOrder=-100,e.name="sky",e}function Ot(o,n=1){const e=Math.round(84*(.7+.3*n)),t=Math.round(144*(.7+.3*n)),l=[],d=[];l.push(0,0,0);const c=1.2,u=Math.pow(2600/c,1/(e-1));for(let g=0;g<e;g++){const y=c*Math.pow(u,g);for(let B=0;B<t;B++){const G=(B+g%2*.5)/t*Math.PI*2;l.push(Math.cos(G)*y,0,Math.sin(G)*y)}}for(let g=0;g<t;g++)d.push(0,1+(g+1)%t,1+g);for(let g=0;g<e-1;g++)for(let y=0;y<t;y++){const B=1+g*t+y,G=1+g*t+(y+1)%t,X=1+(g+1)*t+y,$=1+(g+1)*t+(y+1)%t;g%2===0?d.push(B,G,X,G,$,X):d.push(B,$,X,B,G,$)}const x=new q.BufferGeometry;x.setAttribute("position",new q.Float32BufferAttribute(l,3)),x.setIndex(d);const z=new q.ShaderMaterial({uniforms:o,vertexShader:`varying vec3 vW;
      ${zt}
      void main(){ vec2 p = position.xz + cameraPosition.xz; vW = vec3(p.x, tSwell(p).x, p.y); gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.); }`,fragmentShader:`varying vec3 vW;
      ${zt}
      // one layer of dabs: lozenges of loaded paint lying across the light, each with one tilt of its own (so each mirrors one colour)
      vec4 tDabs(vec2 p, float cell, float lvl, vec2 dx){                  // xy: slope, z: how much of a dab stands here, w: its dice
        vec2 q = vec2(dot(p, dx), dot(p, vec2(-dx.y, dx.x))) / (cell * vec2(4.6, 1.));            // x along the dab, y across it
        float row = floor(q.y); q.x += tHash(vec2(row, lvl * 7.3)) * 13.7 + uT * .04 * (tHash(vec2(row, 3.1 + lvl)) - .5);
        vec2 id = vec2(floor(q.x), row), f = fract(q) - .5;
        vec2 h = tHash2(id + lvl * 19.7), h2 = tHash2(id + 31.7 + lvl * 3.3);
        float body = 1. - smoothstep(.45, 1., length(vec2(f.x / (.36 + .13 * h.y), f.y / .42)));
        float hair = tN2(vec2(q.x * 1.2 + h.x * 9., q.y * 17.) + lvl * 9.1);     // the dab's edge is the bristle's, not ruled
        float m = smoothstep(hair * .7, hair * .7 + .22, body * 1.3) * step(.24, h.x);
        float ph = h.y * 6.283 + uT * (.5 + 1.2 * h2.x);
        vec2 tilt = vec2((h2.y - .5) * .4, sin(ph) * .62 + (h.x - .65) * .5);
        return vec4(tilt, m, h2.x);
      }
      // one lay of dabs at three sizes laid over one another (the smallest comes in as we near, the largest goes); k says which way the lay lies:
      // 0 across the sun's bearing, 1 and 2 a fifth of a turn to either hand. xy: the tilt it gives the water (world x, z), z: how much of a dab stands here.
      vec3 tDabLay(vec2 p, float l0, float fr, float k){
        float an = k < .5 ? 0. : (k < 1.5 ? 1.257 : -1.257), cs = cos(an), sn = sin(an);
        vec2 dx = vec2(uSunH.y, -uSunH.x) * cs - uSunH * sn, dy = vec2(-dx.y, dx.x);
        float lv = l0 + k * 37.;
        vec4 a = tDabs(p, exp2(l0), lv, dx), b = tDabs(p, exp2(l0 + 1.), lv + 1., dx), c = tDabs(p, exp2(l0 + 2.), lv + 2., dx);
        vec2 tl = c.xy * c.z * fr; float cov = c.z * fr;
        tl = mix(tl, b.xy, b.z); cov = max(cov, b.z);
        tl = mix(tl, a.xy, a.z * (1. - fr)); cov = max(cov, a.z * (1. - fr));
        return vec3(dx * tl.x + dy * tl.y, cov);
      }
      void main(){
        vec3 P = vW; vec3 v = P - cameraPosition; float D = length(v); vec3 rd = v / max(D, 1e-3);
        vec3 sw = tSwell(P.xz);
        vec2 sqo = P.xz - uSq.xy; float rough = uSq.w > 0. ? exp(-dot(sqo, sqo) / (uSq.z * uSq.z * 1.6)) : 0.;
        float hb = uCalm.z * smoothstep(uCalm.x, uCalm.y, P.z);              // sheltered water (the world says where): it lies stiller, in longer and fewer strokes
        float fp = max(length(dFdx(P.xz)), length(dFdy(P.xz))) * (uRes.y / 450.);    // metres a design pixel covers here
        float want = max(fp * 7., .3) * (1. + .7 * hb), l = log2(want), l0 = floor(l), fr = l - l0;
        vec2 ax = vec2(uSunH.y, -uSunH.x), ay = uSunH;
        // A painter lays water in strokes that lie across the sight. Three lays of dabs stand in the sea, each fixed in the water: one across the sun's
        // bearing, which is all that shows for fifty degrees to either hand of the sun (and of its opposite), and two for the water seen far off that
        // bearing. Which shows at a place is a matter of the bearing it is seen on, as with any gleam on water.
        vec2 rh = rd.xz * inversesqrt(max(dot(rd.xz, rd.xz), 1e-6));
        float pb = atan(dot(rh, ax), dot(rh, ay)); pb = pb > 1.5708 ? pb - 3.1416 : (pb < -1.5708 ? pb + 3.1416 : pb);
        float ab = abs(pb), w0 = 1. - smoothstep(.873, 1.082, ab), wE = smoothstep(1.45, 1.5708, ab) * .5, ks = pb < 0. ? 2. : 1.;
        vec3 lay = w0 > .001 ? tDabLay(P.xz, l0, fr, 0.) : vec3(0.);
        if (w0 < .999) {
          vec3 sd = tDabLay(P.xz, l0, fr, ks);
          if (wE > .001) sd = mix(sd, tDabLay(P.xz, l0, fr, 3. - ks), wE);
          lay = mix(sd, lay, w0);
        }
        float cov = lay.z * (1. - .35 * hb);                                // fewer dabs stand in still water: more of it is one glass
        // long smooth undulation under the dabs (the glassy water's own slow tilt)
        float und = tN2(P.xz * vec2(.021, .034) + uT * .02) - .5;
        vec2 slope = sw.yz + (lay.xy * mix(1. + .6 * rough, .45, hb) + ay * und * .5) * .3;   // every dab's tilt: steep where the squall breaks the water, slight where it is sheltered
        vec3 n = normalize(vec3(-slope.x, 1., -slope.y));
        vec3 r = reflect(rd, n); r.y = abs(r.y) + .015; r = normalize(r);
        float cosi = max(dot(-rd, n), 0.);
        float fres = .03 + .97 * pow(1. - cosi, 4.2);
        vec3 mir = tSkySoft(r);
        mir = mix(mir, mir * vec3(.5, .56, .68), rough * .55);              // under the squall the water is heavy: it gives back less of the sky
        // what stands in the water is mirrored in it, broken by every dab's own tilt
        float best = 1e9, chord = 0.; vec3 oc = vec3(0.);
        vec3 rj = normalize(r + vec3(ax.x, 0., ax.y) * (tN2(vec2(dot(P.xz, ax) * .35, dot(P.xz, ay) * 2.4) + 9.) - .5) * .5);   // each streak of water throws the thing a little to one hand
        for (int i = 0; i < 32; i++){
          vec4 bc = uBxC[i], bh = uBxH[i];
          vec3 o = P - bc.xyz;
          vec3 ol = vec3(o.x * bc.w - o.z * bh.w, o.y, o.x * bh.w + o.z * bc.w), dl = vec3(rj.x * bc.w - rj.z * bh.w, rj.y, rj.x * bh.w + rj.z * bc.w);
          vec3 inv = 1. / (dl + (1. - step(1e-5, abs(dl))) * 1e-5);
          vec3 t1 = (-bh.xyz - ol) * inv, t2 = (bh.xyz - ol) * inv, tmn = min(t1, t2), tmx = max(t1, t2);
          float tn = max(max(tmn.x, tmn.y), tmn.z), tf = min(min(tmx.x, tmx.y), tmx.z);
          if (bh.x > 0. && tf > max(tn, 0.) && tn < best) { best = max(tn, 0.); oc = uBxCol[i]; chord = tf - best; }
        }
        if (best < 1e8) {                                                   // soft where the sight only grazes it, and broken into streaks the further the thing stands off: no ruled edge lies on the water
          float brk = tN2(vec2(dot(P.xz, ax) * .08, dot(P.xz, ay) * .6) + 3.);
          mir = mix(mir, tAirK(oc, P + r * best, .5), .88 * smoothstep(0., 2.6, chord) * smoothstep(best / 60. - .2, best / 60. + .15, brk));
        }
        // the bearing of the sun over the water: the track
        float track = exp(-(1. - dot(rh, uSunH)) * 26.);
        // the sun's own clot in the water: thick white where a dab mirrors it
        float th = acos(clamp(dot(r, uSun), -1., 1.));
        float glint = smoothstep(.2, .03, th) * cov;
        // the water's own body: a warm dark glaze, seen where we look down into it and between the dabs; the light soaks into it under the sun
        float bn = tN2(P.xz * .06 + 7.);
        vec3 body = mix(cSea, mix(cUmber, cRed, .25), .25 + .45 * bn);
        body = mix(body, mix(cRed, cFire, .5) * .62, track * .55);
        float k = clamp(fres * (.55 + .45 * cov) + .2 * cov, 0., 1.);
        vec3 col = mix(body, mir, k);
        col = mix(col, mix(cLemon, cCore, .6), glint * .9);
        col += cCore * glint * track * .55;                                 // the hottest dabs of the track go over the top: the glow takes them
        // the water about a hull: dark under her side, a broken line of white where she meets it; the tug's wheels leave two roads of foam
        float foam = 0., sheet = 0.;
        for (int i = 0; i < 14; i++){
          vec4 ve = uVes[i], vs = uVesS[i];
          if (vs.x <= 0.) continue;
          vec2 o = P.xz - ve.xy, l = vec2(o.x * ve.z - o.y * ve.w, o.x * ve.w + o.y * ve.z);          // x to her port, y along her
          float dH = pow(pow(abs(l.x) / vs.x, 2.6) + pow(abs(l.y) / vs.y, 2.6), .3846), off = (dH - 1.) * vs.x;   // metres off her side, near enough
          col *= 1. - .34 * smoothstep(1.4 * vs.x, 0., off);
          float fn = tN2(vec2(l.x * .7, l.y * .5 + uT * .3) + float(i) * 7.);
          foam = max(foam, smoothstep(1.1, .15, off) * smoothstep(.35, .6, fn) * (vs.z > 1.5 ? .9 : .5));
          if (vs.z > 1.5 && vs.z < 2.5) {
            float aft = -1.5 - l.y;                                                                     // metres astern of her wheels
            float wn = tN2(vec2(l.x * .8, (l.y + uT * 2.6) * .3)), wn2 = tN2(vec2(l.x * 2.1, (l.y + uT * 2.6) * 1.1) + 5.);
            float wd = 1.0 + max(aft, 0.) * .03;
            float wv = (tN2(vec2(l.y * .09 + uT * .2, float(i))) - .5) * (1.2 + max(aft, 0.) * .05);                          // the roads wander as they go
            float road = (1. - smoothstep(wd * .35, wd * 1.25, abs(abs(l.x) - vs.w + max(aft, 0.) * .008 + wv))) * smoothstep(-2.5, 1.5, aft) * exp(-max(aft, 0.) / 30.) * smoothstep(.25, .6, tN2(vec2(l.x * .3, l.y * .11 + uT * .35) + 11.));
            foam = max(foam, road * smoothstep(.2, .55, wn * .6 + wn2 * .5 + road * .3));
            float mid = (1. - smoothstep(vs.w * .4, vs.w + .6 + max(aft, 0.) * .025, abs(l.x))) * smoothstep(vs.y - 4., vs.y + 3., aft + 1.5) * exp(-max(aft - vs.y, 0.) / 50.);
            col = mix(col, mix(col, mix(cDusk, cPearl, .5), .4), mid * (.3 + .7 * wn));                 // her churned water lies flat and pale astern
            float bow = vs.y - l.y, vee = abs(abs(l.x) - 1. - bow * .34);
            foam = max(foam, smoothstep(1.3, .2, vee) * smoothstep(-1., 2., bow) * exp(-max(bow, 0.) / 22.) * smoothstep(.3, .6, wn2));
          }
          if (vs.z > 3.5) {                                                                              // a boat with way on her: a wave at her bow, a short broken wake
            float bow = vs.y - l.y, wn2 = tN2(vec2(l.x * 1.6, (l.y + uT * 2.) * .9) + 5.);
            float vee = abs(abs(l.x) - .4 - bow * .42);
            foam = max(foam, smoothstep(1.5, .2, vee) * smoothstep(-1.5, 1., bow) * exp(-max(bow, 0.) / (vs.y * 1.3)) * smoothstep(.3, .6, wn2));
            float aft = -vs.y - l.y;
            foam = max(foam, (1. - smoothstep(vs.x * .3, vs.x * 1.2 + max(aft, 0.) * .08, abs(l.x))) * smoothstep(-1., 2., aft) * exp(-max(aft, 0.) / (vs.y * 2.2)) * smoothstep(.42, .7, wn2));
          }
        }
        // where the squall has got the sea up, the crests break
        if (rough > .02) {
          float crest = sw.x / max(tSwellAmp(P.xz) * 1.85, .01) * .5 + .5;
          float cn = tN2(P.xz * vec2(.09, .16) + vec2(uT * .11, uT * .07)), cn2 = tN2(P.xz * .55 + uT * .2);
          float lace = tN2(vec2(dot(P.xz, vec2(-.94, .34)) * .05, dot(P.xz, vec2(.34, .94)) * .42 + uT * .25));          // foam lies in lines along the crests
          float cf = rough * smoothstep(.6, .86, crest * .72 + cn * .45) * smoothstep(.4, .66, lace) * smoothstep(.2, .55, cn2 + cov * .4);
          foam = max(foam, cf); sheet = smoothstep(.45, .9, cf) * smoothstep(.3, .62, tN2(P.xz * vec2(.9, 1.7) + uT * .3 + 2.)) * .8;   // where a crest breaks hard its white runs together, torn; at its fringes it stays single dabs
        }
        vec3 fc = mix(mix(cDusk, cPearl, .7), mix(cPearl, cCore, .5), .45 + .55 * track);
        col = mix(col, fc, clamp(foam, 0., 1.) * mix(.06 + .94 * cov, 1., sheet));
        // a dry drag of the brush across the dabs: bristle streaks along the crests
        float br = tN2(vec2(dot(P.xz, ax) * .5, dot(P.xz, ay) * 5.) / max(want * 1.6, .3));
        col *= .93 + .14 * br;
        col = tAirK(col, P, .62);                                            // the water is lost in the squall's vapour, but not at once
        gl_FragColor = vec4(col, 1.);
      }`}),E=new q.Mesh(x,z);return E.frustumCulled=!1,E.renderOrder=-90,E.name="sea",E}function Ht(o,n={}){return new q.ShaderMaterial({uniforms:{...o,uGlow:{value:1},...n},side:q.DoubleSide,vertexColors:!0,vertexShader:`attribute vec4 aM; varying vec3 vW, vN, vC, vO; varying vec4 vM; uniform float uT;
      void main(){
        vec3 p = position;
        if (aM.x > 3.5 && aM.x < 4.5) { float ph = aM.y * 1.25 - uT * 3.4; p += normal * (sin(ph) + .45 * sin(ph * 2.3 + 1.7 + uT * .6)) * aM.w; p.y += cos(ph * .7) * aM.w * .35; }   // cloth in the wind
        vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; vN = mat3(modelMatrix) * normal; vC = color; vM = aM; vO = position; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`varying vec3 vW, vN, vC, vO; varying vec4 vM; uniform float uGlow;
      ${zt}
      float box1(float x, float c, float h, float e){ return smoothstep(h + e, h - e, abs(x - c)); }
      void main(){
        vec3 n = normalize(vN) * (gl_FrontFacing ? 1. : -1.);
        vec3 v = vW - cameraPosition; float D = length(v); vec3 rd = v / max(D, 1e-3);
        vec3 alb = vC; float kind = vM.x, fire = 0., water = 0., glowUp = 0.;
        float br = tFbm2(vec2(vO.x + vO.z, vO.y * 1.7) * .3), br2 = tN2(vec2((vO.z + vO.x) * .33, vO.y * 1.7) + 3.);
        float e = max(fwidth(vM.y), 1e-3);
        if (kind > .5 && kind < 1.5) {                                      // the side of a ship of the line: tarred dark, a pale band along each gun deck, her ports shut
          float up = vM.z, al = vM.y, ports = 0., band = 0., lamp = 0., run = 0., tone = 0.;
          float wob = tN2(vec2(al * .4, up * .8)) - .5;                     // nothing on her is ruled
          for (int i = 0; i < 3; i++){
            float y0 = 2.5 + float(i) * 2.25 + wob * .2; band += box1(up, y0, .62, .2);
            float pn = al / 3.05 + .17 * float(i), cx = (fract(pn) - .5) * 3.05, pid = floor(pn), dn = y0 - .43 - up;
            vec2 ph = tHash2(vec2(pid + 1., float(i) + 2.));
            float pt = smoothstep(1.24, .8, max(abs(cx) / (.44 + .06 * ph.x), abs(up - y0) / (.4 + .06 * ph.y)) + wob * .7);
            ports += pt; tone += pt * (.72 + .5 * ph.y); lamp += pt * step(.86, tHash(vec2(pid, float(i) + 9.))) * (.4 + .6 * tHash(vec2(pid + 5., float(i))));   // a lamp burning behind a port here and there
            run += smoothstep(.62, .15, abs(cx)) * smoothstep(0., .12, dn) * smoothstep(1.15, .1, dn);                               // the weather run down from each sill
          }
          ports = clamp(ports, 0., 1.); band = clamp(band, 0., 1.);
          vec3 tar = mix(cUmber * 1.55, cSlate * .55, .22), paint = alb * vec3(.97, .86, .62);
          paint *= .8 + .34 * tN2(vec2(al * .09, up * 3.1) + 3.);            // old paint, gone thin in long patches
          alb = mix(tar, paint, band * (.82 + .18 * smoothstep(.2, .6, tN2(vec2(al * .5, up * 1.4) + 11.))));
          alb *= 1. - .24 * clamp(run, 0., 1.);
          alb = mix(alb, tar * clamp(tone, .6, 1.3), ports * .88);            // each lid a dab of dark, no two alike
          alb = mix(alb, cGold * .55, box1(up, 8.45 + wob * .1, .07, .05) * .6);   // a worn gilt moulding along her bulwark
          alb *= .86 + .28 * tN2(vec2(al * .07, up * 4.6));                  // planking, long ways
          alb = mix(alb, vec3(.3, .34, .28), smoothstep(1.5, .9, up + wob * .5) * .8);                        // her copper, green and dark at the water
          alb *= 1. - .3 * smoothstep(1.2, .0, up);                         // wet at the water
          alb = mix(alb, cUmber * 1.5, smoothstep(.55, .38, vM.w) * .75);   // the black rail and the hammock nettings along her top
          fire += lamp * .62;
          water = smoothstep(7., .6, up) * .75;                             // the water's light plays along her lower side
        } else if (kind > 1.5 && kind < 2.5) {                              // the stern: three tiers of windows, lamps behind some
          for (int i = 0; i < 3; i++){
            float y0 = .3 + float(i) * .22, wx = vM.y * (7. - float(i)), fx = fract(wx) - .5, fy = (vM.z - y0) / .068;
            float win = smoothstep(.43, .36, abs(fx)) * smoothstep(1., .84, abs(fy)) * step(.04, vM.y) * step(vM.y, .96);
            float gb = max(smoothstep(.12, .05, abs(fract(fx * 3. + .5) - .5)), smoothstep(.16, .07, abs(fract(fy * 1.5 + .5) - .5)));
            fire += win * (1. - .55 * gb) * (.3 + .7 * tHash(vec2(floor(wx), float(i) + 3.)));
            alb = mix(alb, cGold * .8, smoothstep(.016, .006, abs(vM.z - y0 + .1)) * .7);    // a gilt moulding under each tier
          }
          fire = clamp(fire, 0., 1.);
          alb = alb * vec3(.92, .8, .55) * (.9 + .2 * br2);
        } else if (kind > 4.5 && kind < 5.5) {                              // a paddle box: a fan of slats
          float r = length(vM.yz), a = atan(vM.z, abs(vM.y) + abs(vM.z) < 1e-4 ? 1e-4 : vM.y);
          float slat = smoothstep(.25, .45, abs(fract(a * 3.2) - .5)) * smoothstep(.22, .3, r) * smoothstep(1., .9, r);
          alb = mix(alb, alb * 2.6 + cRed * .2, slat * .5);
        } else if (kind > 3.5 && kind < 4.5) {                              // canvas: cloths sewn side by side, no two weathered alike
          float sw2 = tN2(vec2(vM.y * 3.1, vO.y * .23) + 2.) - .5, cl = vM.y + sw2 * .07, nearC = smoothstep(.45, .1, fwidth(vM.y));
          alb *= .9 + .18 * tHash(vec2(floor(cl), 7.));
          alb *= 1. - .13 * smoothstep(.42, .48, abs(fract(cl) - .5)) * nearC;                 // the seams: none ruled, lost with distance
          alb *= .8 + .4 * tFbm2(vec2(vM.y * .23, vO.y * .11) + 5.);                         // the cloth's own lights and stains, broad
          vec2 pq = vec2(cl * .5, vO.y * .31 + tHash(vec2(floor(cl * .5), 3.)) * 5.), pf = abs(fract(pq) - .5);   // a patch let in here and there, newer or older than the cloth about it
          alb *= 1. + (tHash(floor(pq) + 21.) - .45) * .26 * step(.84, tHash(floor(pq) + 5.)) * (1. - smoothstep(.34, .4, max(pf.x, pf.y))) * nearC;
          if (vM.z > .001) {                                                // a working sail: two reef bands across it, their points hanging; its head and foot roped
            for (int i = 0; i < 2; i++) {
              float rb = vM.z - (.3 + .17 * float(i)) + sw2 * .012;
              alb *= 1. - .12 * (1. - smoothstep(.006, .02, abs(rb)));
              alb *= 1. - .15 * nearC * (1. - smoothstep(.04, .1, abs(fract(cl) - .5))) * (1. - smoothstep(-.008, 0., rb)) * smoothstep(-.05, -.035, rb);
            }
            alb *= 1. - .3 * smoothstep(.9, 1., abs(vM.z * 2. - 1.));
          }
        } else if (kind > 6.5 && kind < 7.5) {                              // a house front: an arcade at its foot, rows of windows, a cornice; a lamp lit here and there
          float al = vM.y, up = vM.z, H = vM.w, wob = tN2(vec2(al * .3, up * .5)) - .5, bay = 3.4, ax = (fract(al / bay) - .5) * bay;
          float arch = up < 3. ? abs(ax) : length(vec2(ax, up - 3.));
          float dark = smoothstep(1.3, 1., arch + wob * .3) * step(up, 4.4) * step(.4, up);
          float row = floor((up - 5.6) / 3.5), fy = up - 5.6 - row * 3.5 - 1.5;
          float win = smoothstep(1.15, .8, max(abs(ax) / .55, abs(fy) / 1.05) + wob * .45) * step(5.6, up) * step(up, H - 1.);
          fire = win * step(.86, tHash(vec2(floor(al / bay) + 7., row + 3.))) * .7;
          alb = mix(alb, cUmber * 1.6, max(dark, win) * .85);
          alb *= 1. + .14 * (smoothstep(.2, .08, abs(up - 5.)) + smoothstep(.34, .14, abs(up - (H - .4))));
          alb *= .88 + .24 * tN2(vec2(al * .12, up * .6));
          glowUp = .5 * (1. - smoothstep(-2., 16., up));
        } else if (kind > 7.5 && kind < 8.5) {                              // a tower's shaft: slits one over another
          float fy = fract(vM.z / 7.) * 7. - 3.5;
          alb = mix(alb, cUmber * 1.6, smoothstep(1.2, .8, max(abs(vM.y) / .38, abs(fy) / 1.15)) * step(4., vM.z) * .85);
          alb *= .88 + .24 * tN2(vec2(vM.y * .3, vM.z * .5));
          float rowT = floor(vM.z * .8), stT = tHash(vec2(floor(vM.y / 1.7 + rowT * .5), rowT + 31.));        // stone in courses, quietly
          alb *= (1. - .14 * smoothstep(.06, .0, abs(fract(vM.z * .8) - .5) - .44)) * (.9 + .2 * stT);
        } else if (kind > 8.5 && kind < 9.5) {                              // a belfry: two open arches a side
          float ax = (abs(vM.y) - vM.w * .46) / (vM.w * .27), ay = (vM.z - .6) / .22;
          float open = vM.z < .6 ? abs(ax) : length(vec2(ax, ay));
          alb = mix(alb, cUmber * 1.4, smoothstep(1.1, .9, open) * step(.14, vM.z) * .88);
        } else if (kind > 9.5 && kind < 10.5) {                             // the lighthouse: whitewashed stone, slits toward the harbour, a red band under its gallery, the weather run down it
          float qc = (vM.y - 10.4) / 5.184 + .5, qi = mod(floor(qc), 4.), qx = (fract(qc) - .5) * 5.184, zs = vM.z + qi;   // slits on four sides, each side's a little lower than the last: they go round with the stair
          float wy = min(min(abs(zs - 15.), abs(zs - 21.)), abs(zs - 27.));
          float slit = smoothstep(1.2, .8, max(abs(qx) / .35, wy / .9));
          alb *= 1. + .12 * smoothstep(1.9, 1.3, max(abs(qx) / .35, wy / .9)) * (1. - slit);          // each in a dressed surround, paler than the wash
          alb = mix(alb, cUmber * 1.6, slit * .85);
          alb *= 1. - .1 * smoothstep(.07, .0, abs(fract(vM.z / 1.3) - .5) - .43) * smoothstep(.6, .15, fwidth(vM.z));   // courses, faint under the wash
          alb = mix(alb, alb * vec3(.66, .3, .24), box1(vM.z, 31.5, .95, .12) * .85);
          alb = mix(alb, alb * vec3(.8, .78, .74), smoothstep(14., 9.4, vM.z) * .6);
          alb *= 1. - .2 * smoothstep(.5, .75, tN2(vec2(vM.y * .9, vM.z * .06) + 5.)) * smoothstep(12., 30., vM.z);
          alb *= .92 + .16 * tN2(vec2(vM.y * .25, vM.z * .9));
        } else if (kind > 5.5 && kind < 6.5) {                              // stone in courses
          float rowS = floor(vM.z * .8), sx = vM.y / 1.7 + rowS * .5 + (tHash(vec2(rowS, 9.)) - .5) * .3, fz = fract(vM.z * .8), fx = fract(sx);
          float st = tHash(vec2(floor(sx), rowS)), st2 = tHash(vec2(floor(sx) + 7., rowS + 3.));
          float wz = fwidth(vM.z) * .8, jw = max(wz, .035), jx = max(fwidth(vM.y) / 1.7, .022), far = smoothstep(.5, .1, wz);
          float joint = max(smoothstep(jw * 1.7, jw * .4, min(fz, 1. - fz)), .8 * smoothstep(jx * 1.7, jx * .4, min(fx, 1. - fx)));   // bed joints and perpends
          alb *= (1. - .25 * joint * far) * (.86 + .26 * st); alb = mix(alb, alb * vec3(1.07, .97, .87), st2 * .7);                       // each stone its own tone, some warmer
          alb *= 1. - .2 * step(.88, st2) + .14 * step(st2, .1);                                      // one here and there much darker, or new and pale: the wall is told by its blocks, not by ruled joints
          alb *= .9 + .2 * tN2(vec2(vM.y * .13, vM.z * .21) + 11.);                                   // and broad lights and stains lie over whole runs of it
          alb *= 1. + .09 * smoothstep(.72, .93, fz) * far;                                           // the light catches each stone's upper edge
          alb *= .93 + .14 * tN2(vec2(vM.y * 2.3, vM.z * 2.9));                                       // the mason's tooling
          alb *= 1. - .15 * smoothstep(.5, .78, tN2(vec2(vM.y * .7, vM.z * .09) + 3.));               // the weather run down it
          alb *= .9 + .16 * smoothstep(1., 9., vM.z);                                                 // the sky's light finds the upper courses
          float tide = 1.45 + .4 * (tN2(vec2(vM.y * .31, 3.)) - .5);                                  // the tide's mark: weed and wet below it, a pale line of salt above
          alb = mix(alb, vec3(.19, .22, .16), (1. - smoothstep(tide - .4, tide + .2, vM.z)) * .62);
          alb *= 1. + .13 * (1. - smoothstep(.0, .3, abs(vM.z - tide - .42)));
          float rgx = (fract(vM.y / 9. + .37) - .5) * 9.;                                             // an iron ring every few fathoms, its rust run down the wall
          alb = mix(alb, alb * vec3(.84, .58, .42), (1. - smoothstep(.1, .55, abs(rgx))) * (1. - smoothstep(3., 3.2, vM.z)) * smoothstep(.6, 2.8, vM.z) * .5);
          alb = mix(alb, cUmber * 1.3, (1. - smoothstep(.05, .1, abs(length(vec2(rgx, vM.z - 3.25)) - .2))) * .85 * (1. - smoothstep(.04, .2, fwidth(vM.z))));
          water = smoothstep(7.5, .3, vM.z); glowUp = 1. - smoothstep(1., 17., vM.z);
        } else if (kind > 11.5 && kind < 12.5) {                            // a planked side (aM: metres along, metres up): strakes, wet at the water, the water's light on her
          alb *= .82 + .36 * tN2(vec2(vM.y * .13, vM.z * 3.6)); alb *= 1. - .35 * smoothstep(.8, .0, vM.z);
          float sk = vM.z / .3, nearH = 1. - smoothstep(.06, .3, fwidth(vM.z));                          // close to, each strake shows: a seam under it, a butt here and there, its own tone
          float seam = smoothstep(.36, .5, abs(fract(sk) - .5)), butt = smoothstep(.46, .5, abs(fract(vM.y / 2.6 + tHash(vec2(floor(sk), 5.)) * 7.) - .5));
          alb *= 1. - nearH * (.24 * seam + .16 * butt * (1. - seam) + .14 * (tHash(vec2(floor(sk), 3.)) - .5));
          alb *= 1. - .22 * smoothstep(.55, .8, tN2(vec2(vM.y * .8, vM.z * .12) + 7.)) * smoothstep(-.2, 1.2, vM.z);   // tar and weather run down her
          water = smoothstep(4.2, .1, vM.z) * .9;
        } else if (kind > 12.5 && kind < 13.5) {                            // a roof: courses of tile (aM: metres along the eave, metres up the slope)
          float rowR = floor(vM.z / .55), tl = tHash(vec2(floor(vM.y / .42 + rowR * .5), rowR + 3.)), near = smoothstep(.7, .2, fwidth(vM.z));
          alb *= 1. - near * (.2 * smoothstep(.14, .0, fract(vM.z / .55)) + .28 * (tl - .5));
          alb *= .88 + .24 * tN2(vec2(vM.y * .07, vM.z * .25) + 2.);       // moss and weather in broad patches
        } else if (kind > 10.5 && kind < 11.5) {                            // the ring of an arch: wedge stones, a joint between each (aM: arc metres, metres across the ring, height)
          float jn = smoothstep(.07, .0, abs(fract(vM.y / 1.15) - .5) - .43), st = tHash(vec2(floor(vM.y / 1.15), 5.));
          alb *= (1. - .28 * jn) * (.88 + .24 * st); alb = mix(alb, alb * vec3(1.08, .97, .86), st);
          alb *= 1. - .3 * smoothstep(1.6, .0, vM.w);
          water = smoothstep(6.5, .3, vM.w); glowUp = 1. - smoothstep(1., 17., vM.w);
        }
        alb *= .88 + .24 * br;                                              // the brush is in everything
        // ... and it is laid in strokes: a few pixels broad at any distance, lying along the form, each with its own weight of colour and of light
        vec2 sc = kind > .5 && kind < 1.5 ? vM.yz : (abs(n.y) > .75 ? vO.xz : vec2(dot(vO.xz, normalize(vec2(-n.z, n.x) + 1e-5)), vO.y));
        float fpx = max(length(dFdx(sc)), length(dFdy(sc))) * (uRes.y / 450.);
        float lq = log2(clamp(fpx * 5., .03, 40.)), l0 = floor(lq), fq = lq - l0, c0 = exp2(l0);
        vec2 sw = sc + (vec2(tN2(sc / c0 * .31), tN2(sc / c0 * .31 + 17.)) - .5) * c0 * 1.5;       // no stroke has a ruled edge
        float k1 = step(.5, kind) * step(kind, 1.5), k4 = step(3.5, kind) * step(kind, 4.5);   // a ship's side: its strokes run long, as planking does; canvas takes the brush softly
        vec2 qa = sw / (c0 * vec2(3.2 + 6.5 * k1, 1.)), qb = sw / (c0 * vec2(6.4 + 13. * k1, 2.));
        qa.x += tHash(vec2(floor(qa.y), 1.)) * 7.3; qb.x += tHash(vec2(floor(qb.y), 2.)) * 7.3;
        float dice = mix(tHash(floor(qa) + 3.), tHash(floor(qb) + 11.), fq);
        if (k4 > .5) dice = mix(tN2(qa * vec2(.3, .45) + 7.), tN2(qb * vec2(.3, .45) + 19.), fq);   // on cloth the brush is dragged soft and long: never tiles of paint
        float km = step(5.5, kind) * step(kind, 11.5);                         // masonry: a wall is a great plain thing, and the brush must be seen in it
        alb *= .89 - .04 * km + (.22 - .09 * k1 - .08 * k4 + .09 * km) * dice; alb = mix(alb * vec3(.96, .99, 1.05), alb * vec3(1.08, .99, .88), dice);
        // ... and over them broad dabs of loaded paint, as on the sky and the water: each of ONE tone, its edges the bristle's (on cloth they run down the drape)
        vec2 dq = (k4 > .5 ? sw.yx : sw) / c0, dpc;
        vec4 d1 = tCell(dq / vec2(7.5, 2.3), 31., dpc), d2 = tCell(dq / vec2(15., 4.6) + 3.7, 37., dpc);
        float dm = mix(d1.z, d2.z, fq), dw = mix(step(.5, d1.w), step(.5, d2.w), fq);
        alb = mix(alb, alb * mix(vec3(.86 - .1 * km, .9 - .08 * km, 1. - .02 * km), vec3(1.12 + .09 * km, 1.04 + .04 * km, .92 - .04 * km), dw), dm * (.85 - .35 * k1 - .45 * k4 + .1 * km));
        // a sail's edge is the brush's, not a ruled line: the bristle breaks it (the grid's outermost cells carry how far in we are)
        if (k4 > .5 && kind > 4.02) {
          float ed = (4.4 - kind) * 2.5, epx = ed / max(fwidth(ed), 1e-5) * (450. / uRes.y);
          float hr = mix(tN2(sw / c0 * vec2(1.6, .2) + 3.), tN2(sw / c0 * vec2(.8, .1) + 9.), fq);
          if (epx < 3.4 * hr - .5) discard;
        }
        // the form turns from the light to the shade, the turn dragged by the brush
        float nl = dot(n, uSun);
        float lit = smoothstep(-.18, .5, nl + (br2 - .5) * .16 + (dice - .5) * .24 * (1. - .7 * k1) * (1. - .7 * k4) + (dw - .5) * dm * .22);
        vec3 lightC = mix(cGold, mix(cLemon, cCore, .55), .7) * 1.04, shadeC = mix(cSlate, cDusk, .55) * .92 + cRed * .1;   // a low sun's light is gold
        shadeC += cGold * .22 * smoothstep(.2, -.8, n.y);                   // the water's gold comes up under things
        vec3 col = alb * mix(shadeC, lightC, lit);
        col += alb * mix(cFire, cGold, .55) * glowUp * (1. - lit) * .26;    // the molten water's light comes up the stone that stands in it
        if (water > 0.) {                                                   // the water's light plays on stone that stands in it
          float r1 = tN2(vec2(vM.y * .3 + uT * .2, vM.z * 2.6 - uT * .55)), r2 = tN2(vec2(vM.y * .21 - uT * .17, vM.z * 1.9 + uT * .2) + 9.);   // long ripples of light, climbing
          col += alb * mix(cGold, cLemon, .5) * smoothstep(.34, .7, r1 * r2 * 2.) * water * water * (1. - .75 * lit) * .34;
        }
        if (kind > 3.5 && kind < 4.5) {                                     // canvas: the low sun comes through it
          float thru = smoothstep(.0, .9, dot(rd, uSun)) * (1. - lit) * (.5 + .5 * smoothstep(.1, .8, abs(nl)));
          col = mix(col, alb * mix(cGold, cLemon, .4) * 1.02, thru * .66);
        }
        // against the light a form is eaten at its edges
        float rim = pow(1. - clamp(dot(n, -rd), 0., 1.), 3.) * smoothstep(.35, .98, dot(rd, uSun));
        col = mix(col, mix(cGold, cLemon, .6), rim * .65 * clamp(dot(alb, vec3(.3, .5, .2)) * 2.2, 0., 1.));   // soot takes no sheen
        col = mix(col, mix(cGold, cLemon, .35) * 1.3, fire * .88);
        col = tAirK(col, vW, .38 * (1. - .75 * smoothstep(.93, .999, dot(rd, uSun))));   // a form standing right against the sun keeps its dark: the vapour before it is thin beside that light
        if (kind > 2.5 && kind < 3.5) { vec3 fc = mix(cFire, cLemon, vM.y) * (1. + 2.4 * vM.z * uGlow); col = mix(fc, tAirK(fc, vW, .5), .65); }   // fire: over the top, for the glow; the air takes only some of it
        gl_FragColor = vec4(col, 1.);
      }`})}class Ft{constructor(){this.pos=[],this.col=[],this.aux=[],this.idx=[],this.n=0}vert(n,e,t){return this.pos.push(n[0],n[1],n[2]),this.col.push(e.r,e.g,e.b),this.aux.push(t?t[0]:0,t?t[1]:0,t?t[2]:0,t&&t[3]||0),this.n++}grid(n,e,t){const l=this.n;for(let d=0;d<=e;d++)for(let c=0;c<=n;c++){const u=t(c/n,d/e);this.vert(u.p,u.c,u.a)}for(let d=0;d<e;d++)for(let c=0;c<n;c++){const u=l+d*(n+1)+c,x=u+n+1;this.idx.push(u,u+1,x,u+1,x+1,x)}}tube(n,e,t,l,d,c=7,u=null,x=null){const z=new q.Vector3(e[0]-n[0],e[1]-n[1],e[2]-n[2]),E=z.length()||1;z.multiplyScalar(1/E);const g=new q.Vector3(0,1,0);Math.abs(z.y)>.9&&g.set(1,0,0);const y=new q.Vector3().crossVectors(z,g).normalize(),B=new q.Vector3().crossVectors(z,y);this.grid(c,1,(G,X)=>{const $=G*Math.PI*2,V=X?l:t,k=X?e:n,I=Math.cos($)*V,v=Math.sin($)*V;return{p:[k[0]+y.x*I+B.x*v,k[1]+y.y*I+B.y*v,k[2]+y.z*I+B.z*v],c:X&&x?x:d,a:u}})}box(n,e,t,l,d=null,c=1){const u=Math.cos(t),x=Math.sin(t),z=(g,y,B)=>{const G=y>0?c:1;return g*=G,B*=G,[n[0]+g*u+B*x,n[1]+y,n[2]-g*x+B*u]},E=[[[-1,-1,1],[1,-1,1],[-1,1,1],[1,1,1]],[[1,-1,-1],[-1,-1,-1],[1,1,-1],[-1,1,-1]],[[1,-1,1],[1,-1,-1],[1,1,1],[1,1,-1]],[[-1,-1,-1],[-1,-1,1],[-1,1,-1],[-1,1,1]],[[-1,1,1],[1,1,1],[-1,1,-1],[1,1,-1]],[[-1,-1,-1],[1,-1,-1],[-1,-1,1],[1,-1,1]]];for(const g of E){const y=this.n;for(const B of g)this.vert(z(B[0]*e[0],B[1]*e[1],B[2]*e[2]),l,d);this.idx.push(y,y+1,y+2,y+1,y+3,y+2)}}quad(n,e,t,l,d,c=null,u=null,x=null,z=null){const E=this.n;this.vert(n,d,c),this.vert(e,d,u||c),this.vert(t,d,x||c),this.vert(l,d,z||c),this.idx.push(E,E+1,E+2,E+1,E+3,E+2)}geometry(){const n=new q.BufferGeometry;return n.setAttribute("position",new q.Float32BufferAttribute(this.pos,3)),n.setAttribute("color",new q.Float32BufferAttribute(this.col,3)),n.setAttribute("aM",new q.Float32BufferAttribute(this.aux,4)),n.setIndex(this.idx),n.computeVertexNormals(),n.computeBoundingSphere(),n}}function Ut(o){return new q.ShaderMaterial({uniforms:o,transparent:!0,depthWrite:!1,side:q.DoubleSide,vertexShader:`attribute vec3 aDir; attribute vec4 aL; attribute vec3 aCol; varying vec3 vW, vC; varying float vA, vPx, vH;
      uniform vec2 uRes;
      void main(){
        vec4 w = modelMatrix * vec4(position, 1.); vec3 dir = normalize(mat3(modelMatrix) * aDir);
        vec3 toC = cameraPosition - w.xyz; float dist = max(length(toC), .05);
        vec3 side = cross(dir, toC / dist); float sl = length(side); side = sl > 1e-4 ? side / sl : vec3(1., 0., 0.);
        float pxm = projectionMatrix[1][1] * uRes.y * .5 / dist;              // pixels a metre covers here
        float wd = aL.y, wpx = wd * pxm, k = max(wpx, 1.35);                   // a hairline never thins under a pixel and a third: it pales instead
        w.xyz += side * aL.x * .5 * k / pxm;
        vA = aL.z * clamp(wpx / 1.35, .0, 1.); vW = w.xyz; vC = aCol; vPx = wpx; vH = aL.w;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:`varying vec3 vW, vC; varying float vA, vPx, vH;
      ${zt}
      void main(){
        vec3 v = vW - cameraPosition; vec3 rd = normalize(v);
        vec3 col = vC * mix(mix(cSlate, cDusk, .5) * .95, mix(cLemon, cCore, .5), .5);
        col = mix(col, mix(cGold, cLemon, .6), smoothstep(.5, .98, dot(rd, uSun)) * .6 * smoothstep(4., 1.5, vPx) * (1. - vH));   // against the sun a far rope is a thread of light
        col = tAirK(col, vW, .5);
        gl_FragColor = vec4(col, vA);
      }`})}class Bt{constructor(){this.pos=[],this.dir=[],this.l=[],this.col=[],this.idx=[],this.n=0}line(n,e,t,l=1,d=0){for(let c=0;c<n.length;c++){const u=n[Math.max(0,c-1)],x=n[Math.min(n.length-1,c+1)],z=[x[0]-u[0],x[1]-u[1],x[2]-u[2]];for(const E of[-1,1])this.pos.push(n[c][0],n[c][1],n[c][2]),this.dir.push(z[0],z[1],z[2]),this.l.push(E,e,l,d),this.col.push(t.r,t.g,t.b);if(c){const E=this.n+(c-1)*2;this.idx.push(E,E+1,E+2,E+1,E+3,E+2)}}this.n+=n.length*2}rope(n,e,t,l,d,c=1,u=8){const x=[];for(let z=0;z<=u;z++){const E=z/u;x.push([n[0]+(e[0]-n[0])*E,n[1]+(e[1]-n[1])*E-t*4*E*(1-E),n[2]+(e[2]-n[2])*E])}this.line(x,l,d,c)}geometry(){const n=new q.BufferGeometry;return n.setAttribute("position",new q.Float32BufferAttribute(this.pos,3)),n.setAttribute("aDir",new q.Float32BufferAttribute(this.dir,3)),n.setAttribute("aL",new q.Float32BufferAttribute(this.l,4)),n.setAttribute("aCol",new q.Float32BufferAttribute(this.col,3)),n.setIndex(this.idx),n.computeBoundingSphere(),n}}const w=o=>new q.Color(o),gt=(o,n,e)=>[o[0]+(n[0]-o[0])*e,o[1]+(n[1]-o[1])*e,o[2]+(n[2]-o[2])*e];function jt(o,n,e){const t=w("#F1E8D2"),l=w("#E9DAB6"),d=w("#C9B995"),c=w("#F6F0DF"),u=w("#B9A784"),x=w("#3A3430"),z=w("#E9B95C"),E=w("#E7D8B2"),g=w("#4A3D31"),y=w("#F4EEDF"),B=w("#3B2F28"),G=s=>9.2+1.3*ct(.44,.4,s)+1.9*ct(.2,.16,s)+.9*ct(.78,.82,s),X=s=>-29-.16*Math.max(0,s-3)+(s<4.6?.12*(4.6-s)*(4.6-s):0),$=s=>29+.06*s,V=(s,p)=>{const A=G(s),_=.74+.26*ct(0,.3,s),ht=2+1.2*Math.max(0,p)/A,Mt=s<.76?1:Math.pow(Math.max(0,1-Math.pow((s-.76)/.24,ht)),.55),Q=p<2.2?.9+.1*ct(-1.5,2.2,p):1-.17*Math.pow((p-2.2)/(A-2.2),1.3);return 7.8*_*Mt*Q},k=(s,p)=>X(p)+s*($(p)-X(p)),I=(s,p)=>(s-X(p))/($(p)-X(p)),v=(s,p)=>V(I(s,p),p);for(const s of[1,-1])o.grid(56,12,(p,A)=>{const _=G(p),ht=-1.5+A*(_+1.5);return{p:[s*V(p,ht),ht,k(p,ht)],c:t,a:[1,k(p,ht)+30,ht,_-ht]}});const N=G(0),S=N+.9,H=s=>S+.9*Math.cos((s-.5)*Math.PI);o.grid(12,12,(s,p)=>{const A=.4+p*(H(s)-.4),_=V(0,Math.min(A,N));return{p:[(s*2-1)*_,A,X(A)-.02],c:E,a:[2,s,(A-3)/(S-3),0]}});for(const s of[7.42,9.68]){const p=V(0,s)+.25,A=X(s);o.box([0,s,A-.5],[p,.08,.55],0,E),o.box([0,s+.42,A-1.02],[p,.4,.04],0,d)}for(const s of[1,-1])o.grid(5,6,(p,A)=>{const _=4.7+A*6.9,ht=X(_)+p*6.4,Mt=.95*(1-Math.pow(p,2.5))*Math.pow(Math.sin(Math.PI*A),.5);return{p:[s*(v(Math.max(ht,X(_)),_)+Mt),_,ht],c:E,a:[2,p,(_-3)/(S-3),0]}});for(const s of[-3.3,0,3.3]){const p=S+1.1+(s===0?1.1:.25),A=X(S)-.55;o.tube([s,S-.2,A+.3],[s,p-.34,A],.06,.06,x,5),o.box([s,p,A],[.2,.32,.2],0,z,[3,.45,.22,0],.72)}o.box([0,1.2,X(1.2)-.55],[.2,2.8,.62],0,u),o.grid(40,2,(s,p)=>{const A=G(s)-1.3;return{p:[(p*2-1)*(V(s,A)-.2),A,k(s,A)],c:u}});const L=s=>{const p=(s+1.5)/11.9;return $(s)+.2+6*Math.pow(p,1.5)*(1-.25*ct(.8,1,p))};o.grid(1,9,(s,p)=>{const A=-1.5+p*11.9;return{p:[0,A,s?L(A):$(A)-.3],c:w(p>.72?"#B9925A":"#6B5844")}}),o.tube([0,8.7,34],[0,11.2,35.5],.5,.32,z,6),o.box([0,11.55,35.7],[.3,.34,.3],0,z);for(const s of[1,-1])o.tube([s*4.3,9.7,27.5],[s*2.5,9,31.4],.13,.11,t,5),o.tube([s*2.5,9,31.4],[s*.2,9.5,34.6],.11,.09,t,5),o.tube([s*4.9,7.3,27.2],[s*1.9,7.6,31.2],.13,.11,t,5),o.tube([s*1.9,7.6,31.2],[s*.2,8.5,34.2],.11,.09,t,5),o.tube([s*5.2,10.7,24.3],[s*8.5,11,26.6],.3,.26,B,5);o.tube([0,10.6,27.2],[0,17.5,42.5],.55,.4,l,8),o.tube([0,16.7,40.4],[0,21.4,53.6],.25,.14,l,6),o.box([0,17.45,42.4],[.34,.5,.22],0,l),o.tube([0,17.2,42.5],[0,12.7,43.2],.11,.08,l,5),n.line([[0,17,41.8],[0,2.6,30.4]],.1,g,.9),n.line([[0,15.4,38.2],[0,4.4,31.2]],.1,g,.9),n.line([[0,21.3,53.4],[0,12.8,43.2],[0,8.2,30.9]],.06,g,.85);for(const s of[1,-1])n.line([[0,17.3,42.3],[s*5.4,10.4,26]],.07,g,.8);const Y=[{z:17,top:27,head:42.5,truck:53,yard:[27,20,13],r:.52,rake:0,n:7},{z:-1.5,top:30,head:46.5,truck:58,yard:[30,22,14.5],r:.56,rake:-.02,n:7},{z:-19.5,top:23.5,head:36.5,truck:45.5,yard:[20,15.5,10.5],r:.42,rake:-.045,n:5}],T=[];Y.forEach((s,p)=>{const A=Q=>s.z+s.rake*(Q-9),_=s.r/.56,ht=G(I(s.z,9))-1.3;o.tube([0,ht,A(ht)],[0,s.top+2.6,A(s.top+2.6)],s.r,s.r*.78,l,8),o.box([0,s.top,A(s.top)+.2],[2.5*_,.1,2*_],0,d),o.tube([0,s.top-1.6,A(s.top-1.6)+.62*_],[0,s.head+1.8,A(s.head+1.8)+.4*_],s.r*.62,s.r*.46,l,7),o.box([0,s.head,A(s.head)+.3],[1.15*_,.07,.9*_],0,d),o.tube([0,s.head-1.2,A(s.head-1.2)+.75*_],[0,s.truck,A(s.truck)+.5*_],s.r*.4,s.r*.18,l,6),T.push([0,s.truck,A(s.truck)+.5*_]),[s.top-3.3,s.top+4.6,s.head+3.4].forEach((Q,J)=>{const at=s.yard[J]*.5,ut=(e.range(-1,1)*5+(p-1)*3)*Math.PI/180,xt=e.range(-1,1)*.022,et=A(Q)+(.75+.1*J)*_*(1+.3*J),Z=(it,yt=1)=>[it*at*yt*Math.cos(ut),Q+it*at*yt*xt,et+it*at*yt*Math.sin(ut)],kt=(.3-.06*J)*_;for(const it of[1,-1])o.tube(Z(it,0),Z(it),kt,kt*.45,d,6);o.grid(10,5,(it,yt)=>{const mt=it*2-1,bt=Z(Math.sign(mt)||1,Math.abs(mt)*.94),qt=kt*(1.55-.75*Math.abs(mt))*(.9+.2*Math.sin(it*37+p*3+J)),a=yt*Math.PI*2;return{p:[bt[0],bt[1]+kt*.7+Math.sin(a)*qt*.9,bt[2]+Math.cos(a)*qt],c}});const wt=J===0?s.top+2.2:J===1?s.head+1.2:s.truck-1;for(const it of[1,-1])n.line([[0,wt,A(wt)+.4],Z(it,.97)],.05,g,.7);if(J<2&&p<2)for(const it of[1,-1])n.line([Z(it,.98),[it*1.2,Y[p+1].top-6-J*-9,Y[p+1].z+.6]],.045,g,.6)});for(const Q of[1,-1]){const J=v(s.z-4,8.7)+.95,at=s.n,ut=et=>[Q*1.5*_,s.top-.25,A(s.top)-.5+et*.16],xt=et=>[Q*J,8.75,s.z-.9-et*1.02];o.box([Q*(J-.35),8.6,s.z-.9-(at-1)*.51],[.6,.11,(at-1)*.51+.7],0,B);for(let et=0;et<at;et++)n.line([ut(et),xt(et)],.085,g,.9);for(let et=1;et<=13;et++){const Z=et/14.5;n.line([gt(xt(0),ut(0),Z),gt(xt(at-1),ut(at-1),Z)],.035,g,.62)}for(let et=0;et<4;et++)n.line([[Q*.8*_,s.head-.2,A(s.head)+.1],[Q*2.3*_,s.top+.12,A(s.top)-.4-et*.42*_]],.055,g,.8);for(let et=0;et<2;et++)n.line([[Q*.3,s.head+.4,A(s.head)+.3],[Q*J,8.75,s.z-.9-at*1.02-.9-et*1.1]],.065,g,.8);n.line([[Q*.15,s.truck-1.2,A(s.truck)+.5],[Q*J,8.75,s.z-.9-at*1.02-3.4]],.05,g,.7)}});const f=Y[0],M=Y[1],C=Y[2],D=(s,p,A=.1,_=.9)=>n.line([s,p],A,g,_);D([0,f.top+1.6,f.z+.4],[0,14.4,35.6]),D([0,f.head+1,f.z+.6],[0,17.6,42.4],.08),D([0,f.truck-1.5,f.z+.5],[0,21.3,53.3],.06,.8),D([0,M.top+1.6,M.z+.3],[0,11.6,f.z-1.4]),D([0,M.head+1,M.z+.3],[0,f.top+1,f.z-.5],.08),D([0,M.truck-1.5,M.z+.3],[0,f.head+1,f.z-.2],.06,.8),D([0,C.top+1.4,C.z+.2],[0,14.5,M.z-1.2]),D([0,C.head+.8,C.z+.1],[0,M.top+.8,M.z-.6],.07),D([0,C.truck-1.2,C.z],[0,M.head+.6,M.z-.4],.055,.8);const b=s=>C.z+C.rake*(s-9);o.tube([0,20.2,b(20.2)-.5],[0,26.4,-28.2],.2,.1,d,6),o.tube([0,13.2,b(13.2)-.5],[0,14,-29.6],.22,.13,d,6),D([0,C.top+1.8,b(C.top)],[0,26.4,-28.2],.05,.7),D([0,26.4,-28.2],[0,14,-29.6],.04,.6);const R=[-.34,0,-.94],K=T[1];return o.grid(16,1,(s,p)=>{const A=s*15,_=.55*(1-.8*s);return{p:[K[0]+R[0]*A,K[1]+.2-(p-.5)*_*2-.05*A,K[2]+R[2]*A],c:w("#EBD9B4"),a:[4,A,0,.6*Math.pow(s,.8)]}}),{hawse:[1.3,7.3,29.3],trucks:T,length:62,railAt:G,sideX:v,boxes:[{c:[0,5.2,-5],h:[7.3,5.6,24],col:t},{c:[0,5.2,24.2],h:[3.6,5.6,5.2],col:t},...Y.map(s=>({c:[0,(s.truck+10)/2,s.z],h:[1,(s.truck-10)/2,1],col:l}))]}}function Vt(o,n,e,t,l=0){const d=l>0,c=w("#2A201B"),u=w("#3E3026"),x=w(d?"#6A553C":"#44301F"),z=w("#1F1A18"),E=w("#6B5844"),g=w(d?"#B23A26":"#F3ECD8"),y=w("#232733"),B=w("#3A3028"),G=w(d?"#B5A47E":"#8C3323"),X=f=>1.2+1*ct(.66,1,f)+.35*ct(.22,0,f),$=(f,M)=>{const C=Math.pow(Math.sin(Math.min(1,f/.24)*Math.PI/2),.6),D=f<.6?1:Math.pow(Math.max(0,1-Math.pow((f-.6)/.4,2)),.6);return 2.6*(.3+.7*C)*D*(.8+.2*ct(-1,1.2,M))},V=(f,M)=>-13+26*f+.3*Math.max(0,M)*ct(.75,1,f)-.35*Math.max(0,M)*ct(.2,0,f);for(const f of[1,-1])o.grid(30,5,(M,C)=>{const D=X(M),b=-1+C*(D+1);return{p:[f*$(M,b),b,V(M,b)],c:b>D-.32?G:c,a:d?[12,M*26,b,0]:null}});if(o.grid(2,3,(f,M)=>{const C=-1+M*(X(0)+1);return{p:[(f*2-1)*$(0,C),C,V(0,C)],c,a:d?[12,f*4,C,0]:null}}),d)for(const f of[1,-1])for(const M of[.09,.145,.2,.255,.31,.365,.6,.655,.71]){const D=.005769230769230769,b=(R,K)=>[f*($(R,K)+.035),K,V(R,K)];o.quad(b(M-D,.74-.1),b(M+D,.74-.1),b(M-D,.74+.1),b(M+D,.74+.1),w("#E9B95C"),[3,.35+.3*t(),.1,0])}o.grid(24,2,(f,M)=>{const C=X(f)-.4;return{p:[(M*2-1)*($(f,C)-.1),C,V(f,C)],c:u}});const k=1.25,I=-1.5,v=2.5,N=2.35,S=4.1;for(const f of[1,-1])o.grid(14,1,(M,C)=>{const D=M*Math.PI;return{p:[f*S,k+v*C*Math.sin(D),I+v*C*Math.cos(D)],c:x,a:[5,C*Math.cos(D),C*Math.sin(D),0]}}),o.grid(14,1,(M,C)=>{const D=M*Math.PI;return{p:[f*(N+(S-N)*C),k+v*Math.sin(D),I+v*Math.cos(D)],c:x}}),o.box([f*(N+S)/2,k-.12,I],[(S-N)/2+.1,.12,v+.5],0,c);o.box([0,3.85,I],[S-.2,.07,.45],0,u);for(const f of[1,-1])for(const M of[-.45,.45])n.line([[f*(S-.3),4.8,I+M],[-f*(S-.3),4.8,I+M]],.04,B,.8);for(const f of[1,-1]){const M=f*(N+.25),C=f*(S-.3),D=10,b=2.15;for(let R=0;R<D;R++){const K=R/D*Math.PI*2,s=(R+1)/D*Math.PI*2,p=Math.cos(K),A=Math.sin(K);for(const _ of[M,C])e.tube([_,0,0],[_,A*b,p*b],.05,.05,B,4),e.tube([_,A*b,p*b],[_,Math.sin(s)*b,Math.cos(s)*b],.06,.06,B,4);e.quad([M,A*(b-.55),p*(b-.55)],[C,A*(b-.55),p*(b-.55)],[M,A*(b+.1),p*(b+.1)],[C,A*(b+.1),p*(b+.1)],w("#6A503A"))}}e.tube([-S+.2,0,0],[S-.2,0,0],.14,.14,B,6);const H=2.3,L=[0,11.7,H-.6],Y=[0,11.1,H-.57];o.tube([0,1.2,H],Y,.52,.47,z,10),o.tube(Y,L,.47,.5,z,10,[3,.12,0,0],null),o.grid(10,1,(f,M)=>{const C=f*Math.PI*2,D=.5;return{p:[L[0]+Math.cos(C)*D,Y[1]+(L[1]-Y[1])*M+.001,L[2]+Math.sin(C)*D*1+(Y[2]-L[2])*(1-M)],c:z,a:[3,.1+.25*M,.25+.75*M,0]}}),o.box([0,7.4,H-.33],[.55,.22,.55],0,G);for(const f of[1,-1])for(const M of[-3.2,2.6])n.line([[0,8.6,H-.4],[f*2.2,1.3,H+M]],.035,B,.7);o.tube([0,1.3,8.3],[0,12.6,8],.17,.08,E,6),n.line([[0,11.6,8],[0,2.4,12.9]],.04,B,.75);for(const f of[1,-1])n.line([[0,11.2,8],[f*2.3,1.6,6.3]],.04,B,.75);o.box([0,7.2,8.42],[.14,.2,.14],0,w("#E9B95C"),[3,.6,.4,0]);const T=[-.34,0,-.94];if(o.grid(8,4,(f,M)=>{const C=f*2.6;return{p:[T[0]*C,12.5-M*1.5-.2*C*f,8+T[2]*C],c:g,a:[4,C*2.2,0,.24*Math.pow(f,.7)]}}),o.box([0,1.75,-5.6],[.95,.7,1.7],0,x),o.box([0,1.5,5.2],[.8,.45,1.1],0,x),d){const M=w("#A8482A");o.tube([0,1.2,-8],[0,11.3,-8-.25],.16,.07,E,6);for(const K of[1,-1])n.line([[0,10.6,-8-.2],[K*2.1,1.5,-8-1.9]],.04,B,.75);n.line([[0,11,-8-.2],[0,12.2,8]],.035,B,.6);const C=[0,7.7,-8-.3],D=[-.45,9,-8-3.7],b=[0,3.1,-8-.28],R=[-.75,3.3,-8-4.3];o.tube(C,D,.08,.05,E,5),o.grid(7,7,(K,s)=>{const p=gt(gt(b,R,K),gt(C,D,K),s);return p[0]-=.4*Math.sin(Math.PI*K)*Math.sin(Math.PI*s),{p,c:M.clone().multiplyScalar(Rt(K,s)),a:[Ct(K,s),K*4.2,.02+.96*s,.05*K]}}),n.line([R,[-1.3,1.5,-8-4.6]],.04,B,.8),o.box([0,1.35,-10.4],[.5,.3,.7],0,x);for(const[K,s,p,A]of[[.3,1,-11.6,"#232733"],[-1.1,3.92,I,"#3E4A5E"],[.9,.8,6.9,"#5A2A20"],[-.7,.8,3.4,"#232733"]])At(o,K,s,p,1.7/l,w(A),.04/l)}else{o.tube([0,1,-9.3],[0,2.35,-9.3],.16,.16,u,6),o.tube([-.6,2.1,-9.3],[.6,2.1,-9.3],.09,.09,u,5);for(const f of[[.5,-10.9],[-.9,3.6]])o.box([f[0],1.95,f[1]],[.2,.62,.15],.3,y),o.box([f[0],2.72,f[1]],[.12,.13,.12],.3,w("#B98C6A"))}return o.box([0,.6,-13.1],[.07,1.6,.42],0,c),{funnel:L,shaft:[0,k,I],tow:[0,2.2,-9.3],stern:[0,1.75,-13.3],wheelX:(N+S)/2,wheelR:2.15,boxes:[{c:[0,.8,0],h:[4.2,1.4,12.8],col:c},{c:[0,6.2,H-.3],h:[.5,5.5,.5],col:z}]}}function Gt(o,n){const e=n.slice().sort((y,B)=>(y.mode||0)-(B.mode||0)||B.phase-y.phase),t=e.length*2,l=new q.InstancedBufferGeometry;l.setAttribute("position",new q.Float32BufferAttribute([-1,-1,0,1,-1,0,-1,1,0,1,1,0],3)),l.setIndex([0,1,2,1,3,2]);const d=new Float32Array(t*3),c=new Float32Array(t*3),u=new Float32Array(t*4),x=new Float32Array(t*4),z=new Float32Array(t);for(let y=0;y<t;y++){const B=e[y%e.length];d.set(B.p0,y*3),c.set(B.v,y*3),u.set([B.phase%1,B.rate,B.r0,B.r1],y*4),x.set([B.mode||0,B.rise||0,B.wob||0,B.seed],y*4),z[y]=y<e.length?0:1}l.setAttribute("aP0",new q.InstancedBufferAttribute(d,3)),l.setAttribute("aV",new q.InstancedBufferAttribute(c,3)),l.setAttribute("aS",new q.InstancedBufferAttribute(u,4)),l.setAttribute("aC",new q.InstancedBufferAttribute(x,4)),l.setAttribute("aG",new q.InstancedBufferAttribute(z,1)),l.instanceCount=t;const E=new q.ShaderMaterial({uniforms:o,transparent:!0,depthWrite:!1,vertexShader:`attribute vec3 aP0, aV; attribute vec4 aS, aC; attribute float aG; uniform float uT; uniform vec3 uFol;
      varying vec2 vUv; varying vec4 vI; varying vec3 vCtr, vR, vUp; varying float vA;
      void main(){
        float a0 = aS.x + fract(uT * aS.y), a = fract(a0), sd = aC.w;
        if (abs(step(1., a0) - aG) > .5) { vUv = vec2(0.); vI = vec4(0.); vCtr = vec3(0.); vR = vec3(0.); vUp = vec3(0.); vA = 0.; gl_Position = vec4(2., 2., 2., 1.); return; }   // this copy's turn is not now
        vec3 c = aP0 + aV * pow(a, 1.15);
        if (fract(aC.x) > .1) c += uFol * exp(-a * 9.);                                               // smoke from a funnel that rides the sea leaves it where it is just now
        c.y += aC.x > .5 && aC.x < 1.5 ? aC.y * 4. * a * (1. - a) : aC.y * (1. - exp(-3.2 * a));    // spray is thrown and falls; smoke climbs
        c += aC.z * (.2 + a) * vec3(sin(sd * 37. + uT * .31 + a * 9.), sin(sd * 51. + uT * .27 + a * 7.), cos(sd * 23. + uT * .23 + a * 8.));
        float r = mix(aS.z, aS.w, pow(a, .8));
        vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        float ang = sd * 6.2832 + uT * .06 * (sd - .5), cs = cos(ang), sn = sin(ang);
        vec2 q = vec2(position.x * cs - position.y * sn, position.x * sn + position.y * cs);
        vec3 w = c + (right * q.x + up * q.y) * r;
        vUv = position.xy; vI = vec4(a, aC.x, sd, r); vCtr = c; vR = right * cs + up * sn; vUp = up * cs - right * sn;
        float dist = length(c - cameraPosition);
        float fade = aC.x < .5 ? exp(-a * a / .19) * sqrt(1. - a) : pow(1. - a, 1.3);                     // coal smoke is thick at the funnel and soon a thin haze: no column of it stands far from its source
        vA = smoothstep(0., .03, a) * fade * smoothstep(1.2 + r * .6, 3.5 + r * 1.6, dist);               // thin near the lens
        if (aC.x > .5 && aC.x < 1.5) vA *= .08 + .92 * smoothstep(8., 28., dist);                          // thrown water seen close is a fine mist, not white wool
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
      }`,fragmentShader:`varying vec2 vUv; varying vec4 vI; varying vec3 vCtr, vR, vUp; varying float vA;
      ${zt}
      void main(){
        float rr = length(vUv), age = vI.x, mode = vI.y;
        float n = tN2(vUv * (1.9 + (mode < .5 ? vI.w * .2 : 0.)) + vI.z * 31.), n2 = tN2(vUv * 4.3 + vI.z * 17. + 9.);     // a great old puff of smoke is torn as finely as a young one
        float body = 1. - smoothstep(.3, 1., rr);
        float m = mode > .5 && mode < 1.5 ? smoothstep(n * .9 + .1, n * .9 + .3, body * 1.2 * (.6 + .8 * n2)) * (.22 + .78 * smoothstep(.36, .6, tN2(vUv * 6.7 + vI.z * 43. + 3.))) : smoothstep(n * .8 + n2 * .12, n * .8 + n2 * .12 + .26, body * (1.32 - .5 * age));   // a dab of the brush, not a disc: smoke tears into wisps as it ages
        float al = m * vA;
        if (al < .004) discard;
        vec3 rd = normalize(vCtr - cameraPosition);
        vec3 nb = normalize((vR * vUv.x + vUp * vUv.y) * (mode < .5 ? .55 : 1.) - rd * (sqrt(max(1. - rr * rr, 0.)) + .25));   // the puff as a ball (smoke: a flatter one, so the stream reads as one body)
        float l = dot(nb, uSun) * .5 + .5, toSun = smoothstep(.1, .97, dot(rd, uSun)), edge = smoothstep(.25, .95, rr + (n2 - .5) * .3), fringe = smoothstep(.5, 1., rr + (n2 - .5) * .3);
        vec3 col;
        if (mode < .5) {                                                     // coal smoke: soot at its heart, the light in its skirts
          vec3 dark = mix(cUmber * 1.15, mix(cDusk, cUmber, .5) * 1.05, age), lit = mix(mix(cFire, cRed, .6) * .85, mix(cRose, cDusk, .45), age);   // soot at the funnel, a grey brown as it thins
          col = mix(dark, lit, l * l * (.4 + .4 * age));
          col = mix(col, mix(cFire, cLemon, fringe * .7) * 1.05, toSun * fringe * (.5 - .2 * age) * smoothstep(.03, .3, age));    // against the sun it stands dark, and only its fringes take fire (the young soot at the funnel not even those: it is too thick)
          col = mix(col, mix(cRed, cFire, .7) * 1.25, smoothstep(.035, .0, age) * .75 * (1. - .75 * smoothstep(.15, .7, rr + (n2 - .5) * .3)));   // the furnace lights the youngest smoke at its heart
          col *= .9 + .2 * n2;
          al *= .92;
        } else if (mode < 1.5) {                                             // spray and foam: thrown water, white in the light
          col = mix(mix(cDusk, cPearl, .55), mix(cPearl, cCore, .5), l);
          col = mix(col, mix(cLemon, cCore, .5) * 1.15, toSun * (.4 + .5 * edge));
          al *= .8;
        } else {                                                             // steam: thin and pale
          col = mix(mix(cDusk, cPearl, .7), cCore, l * .8);
          col = mix(col, cLemon * 1.1, toSun * edge * .7);
          al *= .55;
        }
        col = tAirK(col, vCtr, mode < .5 ? .4 : 1.);                         // coal smoke stands dark in the squall's vapour a while (thrown water and steam are of it, and go into it)
        gl_FragColor = vec4(col, al);
      }`}),g=new q.Mesh(l,E);return g.frustumCulled=!1,g.renderOrder=8,g.name="puffs",g}function Kt(o,n,e,t){const l=o.uSq.value,d=o.uSwell.value,c=n-l.x,u=e-l.y,x=d.x+d.y*Math.exp(-(c*c+u*u)/(l.z*l.z*1.6)),z=(n*.34+e*.94)*.105-t*.62,E=(n*-.5+e*.866)*.17-t*.8+1.7,g=(n*.8+e*.6)*.29-t*1.05+4.1;return x*(Math.sin(z)+.55*Math.sin(E)+.3*Math.sin(g))}const Ct=(o,n)=>o<1e-6||o>1-1e-6||n<1e-6||n>1-1e-6?4.4:4,Rt=(o,n)=>1-.18*Math.pow(Math.abs(o*2-1),2.2)+.07*Math.sin(Math.PI*o)*Math.sin(Math.PI*n)-.09*ct(.75,1,n);function Yt(o,n,e,t=1,l=1){const d=w("#2B2320"),c=w("#B9A27A"),u=w("#5A4636"),x=w("#7A664A"),z=w("#3A3028"),E=w("#6A5A44"),g=[w("#262A36"),w("#5A2A20"),w("#3E4A5E"),w("#B9A27A")],y=e.pick([["#B8502A","#C97A3C","#9C3F26"],["#A8432A","#B8502A","#C2622E"],["#C2622E","#D08A45","#B8502A"],["#D9C9A0","#B8502A","#C97A3C"]]).map(w),B=v=>(1.15+.7*ct(.6,1,v)+.35*ct(.25,0,v))*t,G=(v,N)=>{const S=Math.pow(Math.sin(Math.min(1,v/.3)*Math.PI/2),.7),H=v<.55?1:Math.pow(Math.max(0,1-Math.pow((v-.55)/.45,2)),.6);return 1.85*t*(.45+.55*S)*H*(.72+.28*ct(-.8,1,N/t))},X=(v,N)=>(-6+12*v)*t+.35*Math.max(0,N)*ct(.7,1,v);for(const v of[1,-1])o.grid(22,5,(N,S)=>{const H=B(N),L=-.8*t+S*(H+.8*t);return{p:[v*G(N,L),L,X(N,L)],c:L>H-.28*t?c:d,a:[12,N*12*t,L,0]}});o.grid(2,5,(v,N)=>{const S=B(0),H=-.8*t+N*(S+.8*t);return{p:[(v*2-1)*G(0,H),H,X(0,H)],c:H>S-.28*t?c:d,a:[12,v*3*t,H,0]}});const $=v=>B(v)-.45*t;o.grid(16,2,(v,N)=>{const S=$(v);return{p:[(N*2-1)*(G(v,S)-.08),S,X(v,S)],c:u}});const V=(v,N,S,H,L,Y,T,f,M)=>{v*=t,N*=t,S*=t,H*=t,L*=t,Y*=t,o.tube([0,.6*t,v],[0,N,v-.2*t],.13*t,.07*t,x,6);const C=Math.sin(f),D=Math.cos(f),b=Math.sign(f)||1,R=(Q,J,at)=>[Q*C-b*at*D,J,v+Q*D+b*at*C],K=[S+.4*t,L],s=[H+.7*t,Y],p=[S,1.5*t],A=[H,1.9*t],_=T.clone().multiplyScalar(.72);o.grid(M,M,(Q,J)=>{const at=[K[0]+(s[0]-K[0])*Q,K[1]+(s[1]-K[1])*Q],ut=[p[0]+(A[0]-p[0])*Q,p[1]+(A[1]-p[1])*Q-.35*t*Math.sin(Math.PI*Q)],xt=ut[0]+(at[0]-ut[0])*J,et=ut[1]+(at[1]-ut[1])*J,Z=1.25*t*Math.sin(Math.PI*Q)*Math.sin(Math.PI*Math.min(1,.12+.88*J)*.92);return{p:R(xt,et,Z),c:T.clone().lerp(_,.75*(1-J)*(1-J)).multiplyScalar(Rt(Q,J)),a:[Ct(Q,J),Q*7,.02+.96*J,.05*t*Math.sin(Math.PI*Q)*Math.sin(Math.PI*J)]}});const ht=R(K[0]+.3*t,K[1]-.2*t,0),Mt=R(s[0]-.3*t,s[1]+.25*t,0);o.tube(ht,Mt,.09*t,.06*t,x,5),n.line([[0,N-.3*t,v-.2*t],gt(ht,Mt,.38)],.04,z,.8),n.line([R(A[0],A[1],0),[-b*1*t,1.3*t,v-2.2*t]],.045,z,.85),n.line([R(p[0],p[1],0),[b*.5*t,1.2*t,v+1.4*t]],.045,z,.85)};V(2.6,9.8,3,-4.4,5.2,10.9,y[0],1.22,10),V(-3.9,6.8,1.6,-3.3,3.9,7.5,y[1],l?-1.12:1.05,8),o.tube([0,1.5*t,5.2*t],[0,2.1*t,9.4*t],.08*t,.05*t,x,5),o.grid(6,6,(v,N)=>{const S=[0,8.9*t,2.7*t],H=[0,2.1*t,9.2*t],L=[-1.6*t,1.9*t,4.4*t],Y=gt(H,L,v),T=gt(Y,S,N);return T[0]-=.5*t*Math.sin(Math.PI*v)*Math.sin(Math.PI*N*.9),{p:T,c:y[2],a:[Ct(v,N),v*3,0,.04*t*v*(1-N)]}});for(const v of[1,-1])n.line([[0,9.2*t,2.4*t],[v*1.6*t,1.3*t,1.2*t]],.035,z,.75),n.line([[0,6.3*t,-4.1*t],[v*1.4*t,1.3*t,-5*t]],.035,z,.75);n.line([[0,9.3*t,2.5*t],[0,2.1*t,9.3*t]],.04,z,.8);const k=v=>$((v/t+6)/12);At(o,.35*t,k(-4.9*t),-4.9*t,1.7,g[0],-.1,w("#2A2622"));const I=Math.round(2+1.5*t);for(let v=0;v<I;v++){const N=e.range(-3,4.4)*t,S=e.range(-.75,.75)*t;At(o,S,k(N),N,e.range(1.55,1.75)*(e.chance(.3)?.62:1),e.pick(g),e.range(-.12,.12),e.chance(.5)?w("#2A2622"):null)}return o.box([.1*t,k(-1.2*t)+.22,-1.2*t],[.75*t,.22,1.1*t],.2,E),o.box([-.5*t,k(1.2*t)+.2,1.3*t],[.3,.2,.3],.5,c),o.box([.55*t,k(.4*t)+.2,.5*t],[.28,.2,.28],.1,c),o.box([.16*t,2.6*t,-4*t],[.11,.15,.11],0,w("#E9B95C"),[3,.55,.3,0]),o.box([0,.5*t,-6.15*t],[.05*t,1.2*t,.3*t],0,d),{bow:[0,.2,6.1*t],half:[1.9*t,6.2*t],boxes:[{c:[0,.6*t,0],h:[1.7*t,1*t,5.6*t],col:d},{c:[-.6*t,5.6*t,3.4*t],h:[3.4*t,4.2*t,.6*t],col:y[0]}]}}function Wt(o,n,e,t,l){const d=[w("#EADBB8"),w("#DCC79E"),w("#DDB9A0"),w("#CFC8BA"),w("#F0E8D8"),w("#D2BE9C")],c=w("#B9AD98"),u=w("#C4B79E"),x=[w("#B36A45"),w("#8A8F98"),w("#A65A3C"),w("#9A8F84")],z=w("#3A3028"),E=w("#AEB6BD"),g=w("#E9B95C"),y=w("#F2EBDD"),B=[w("#2B2A33"),w("#6B2E22"),w("#3E4A5E"),w("#C9B995")],G=(a,r,i,h,m,P,F,O,W=0,U=1)=>{const ot=Math.hypot(i-a,h-r);o.grid(U,1,(st,j)=>({p:[a+(i-a)*st,m+(P-m)*j,r+(h-r)*st],c:F,a:[O,st*ot,m+(P-m)*j-(O===7?l.quayY:0),W]}))},X=(a,r,i,h,m,P)=>o.quad([a,m,i],[r,m,i],[a,m,h],[r,m,h],P),$=(a,r,i,h,m,P,F,O=6)=>{G(a,i,r,i,m,P,F,O),G(r,i,r,h,m,P,F,O),G(r,h,a,h,m,P,F,O),G(a,h,a,i,m,P,F,O),X(a,r,i,h,P,F)},V=(a,r,i,h,m,P,F,O=6,W=22)=>o.grid(W,2,(U,ot)=>{const st=U*Math.PI*2,j=i+(h-i)*ot;return{p:[a+Math.cos(st)*j,m+(P-m)*ot,r+Math.sin(st)*j],c:F,a:[O,U*Math.PI*2*i,m+(P-m)*ot,0]}}),k=(a,r,i,h,m,P=22)=>o.grid(P,1,(F,O)=>{const W=F*Math.PI*2;return{p:[a+Math.cos(W)*i*O,h,r+Math.sin(W)*i*O],c:m}}),I=(a,r,i,h,m)=>{const P=r[0]-a[0],F=r[1]-a[1],O=r[2]-a[2],W=Math.hypot(P,F,O)||1,U=P/W,ot=F/W,st=O/W,j=tt=>{const rt=tt[0]-a[0],ft=tt[1]-a[1],nt=tt[2]-a[2],lt=rt*U+ft*ot+nt*st;return[13,lt,Math.sqrt(Math.max(0,rt*rt+ft*ft+nt*nt-lt*lt)),0]};o.quad(a,r,i,h,m,j(a),j(r),j(i),j(h))},v=(a,r,i,h,m)=>{o.box([a,r+.25,i],[.45,.25,.45],0,m),o.tube([a,r+.5,i],[a,r+.5+h*.78,i],.3*h/2.4,.2*h/2.4,m,6),o.tube([a,r+.5+h*.8,i],[a,r+.5+h,i],.15*h/2.4,.13*h/2.4,m,5)},N=(a,r,i,h,m,P,F,O=3)=>{const W=l.quayY,U=W+m;G(a,i,r,i,W,U,P,7,m),G(r,i,r,h,W,U,P,7,m),G(r,h,a,h,W,U,P,7,m),G(a,h,a,i,W,U,P,7,m);const ot=(a+r)/2,st=(i+h)/2,j=Math.min((r-a)/2,(h-i)/2)*.75,tt=.5,rt=[a-tt,U,i-tt],ft=[r+tt,U,i-tt],nt=[r+tt,U,h+tt],lt=[a-tt,U,h+tt],pt=r-a>h-i?[a+j,U+O,st]:[ot,U+O,i+j],vt=r-a>h-i?[r-j,U+O,st]:[ot,U+O,h-j];r-a>h-i?(I(rt,ft,pt,vt,F),I(nt,lt,vt,pt,F),I(ft,nt,vt,vt,F),I(lt,rt,pt,pt,F)):(I(rt,ft,pt,pt,F),I(ft,nt,pt,vt,F),I(nt,lt,vt,vt,F),I(lt,rt,vt,pt,F))},S=(a,r,i,h,m,P,F)=>{const O=l.quayY+1,W=4.2,U=a-F*W;for(let dt=0;dt<m;dt++){const Pt=r+.9+(i-r-1.8)*dt/(m-1);o.tube([a-F*.7,O,Pt],[a-F*.7,O+h,Pt],.62,.52,P,8),o.box([a-F*.7,O+h+.2,Pt],[.8,.2,.8],0,P)}const ot=Math.min(a,U),st=Math.max(a,U);$(ot-.3,st+.3,r,i,O+h+.4,O+h+2,P,0);const j=O+h+2,tt=(i-r)*.15,rt=(r+i)/2,ft=P.clone().multiplyScalar(.82),nt=.7,lt=a+F*.6,pt=a-F*.4,vt=U-F*.4;$(Math.min(lt,a),Math.max(lt,a),r-.5,i+.5,j-.4,j,P,0),o.quad([pt,j,r+.3],[pt,j,i-.3],[pt,j+tt-.2,rt],[pt,j+tt-.2,rt],ft),o.quad([vt,j,r-.3],[vt,j,i+.3],[vt,j+tt+nt,rt],[vt,j+tt+nt,rt],P);for(const dt of[r-.5,i+.5])o.quad([lt,j,dt],[lt,j+tt,rt],[lt,j+nt,dt],[lt,j+tt+nt,rt],P),o.quad([lt,j,dt],[lt,j+tt,rt],[pt,j,dt],[pt,j+tt,rt],ft),I([lt,j+nt,dt],[vt,j+nt,dt],[lt,j+tt+nt,rt],[vt,j+tt+nt,rt],x[1]);v(lt-F*.5,j+tt+nt-.1,rt,2.6,P),v(lt-F*.5,j+nt-.1,r+.4,2.2,P),v(lt-F*.5,j+nt-.1,i-.4,2.2,P);for(let dt=0;dt<5;dt++){const Pt=a+F*(.2+dt*.75),St=a+F*(.95+dt*.75),It=O-dt*.22;$(Math.min(Pt,St),Math.max(Pt,St),r-.5,i+.5,It-.22,It,P,0)}$(ot,st,r,i,l.quayY,O,P,0)},H=(a,r,i,h,m,P,F,O)=>{V(a,r,h,h,i,i+m,F,7,20);for(let U=0;U<14;U++){const ot=U/14*Math.PI*2;o.tube([a+Math.cos(ot)*(h+.7),i,r+Math.sin(ot)*(h+.7)],[a+Math.cos(ot)*(h+.7),i+m-.6,r+Math.sin(ot)*(h+.7)],.42,.36,F,6)}k(a,r,h+1.3,i+m-.5,F,20),V(a,r,h+1.3,h+1.3,i+m-.5,i+m+.3,F,0,20),o.grid(20,8,(U,ot)=>{const st=U*Math.PI*2,j=ot*Math.PI/2,tt=h*.98*Math.cos(j),rt=i+m+.3+P*Math.pow(Math.sin(j),.82);return{p:[a+Math.cos(st)*tt,rt,r+Math.sin(st)*tt],c:O}});const W=i+m+.3+P;return V(a,r,h*.17,h*.15,W-.4,W+h*.5,F,0,10),o.grid(10,4,(U,ot)=>{const st=U*Math.PI*2,j=ot*Math.PI/2;return{p:[a+Math.cos(st)*h*.17*Math.cos(j),W+h*.5+h*.2*Math.sin(j),r+Math.sin(st)*h*.17*Math.cos(j)],c:O}}),o.box([a,W+h*.78,r],[.32,.32,.32],.6,g),o.tube([a,W+h*.7,r],[a,W+h*.7+2.2,r],.07,.04,g,4),W+h*.7+2.2},L=(a,r,i,h,m,P,F=9)=>{const O=l.quayY,W=O+h;for(const[st,j,tt,rt]of[[a-i,r-i,a+i,r-i],[a+i,r-i,a+i,r+i],[a+i,r+i,a-i,r+i],[a-i,r+i,a-i,r-i]])o.grid(1,1,(ft,nt)=>({p:[st+(tt-st)*ft,O+(W-O)*nt,j+(rt-j)*ft],c:m,a:[8,(ft-.5)*2*i,nt*h,h]}));o.box([a,W+.25,r],[i+.45,.25,i+.45],0,m);const U=i*.86,ot=6.5;for(const[st,j,tt,rt]of[[a-U,r-U,a+U,r-U],[a+U,r-U,a+U,r+U],[a+U,r+U,a-U,r+U],[a-U,r+U,a-U,r-U]])o.grid(1,1,(ft,nt)=>({p:[st+(tt-st)*ft,W+.5+ot*nt,j+(rt-j)*ft],c:m,a:[9,(ft-.5)*2*U,nt,U]}));return o.box([a,W+.75+ot,r],[U+.4,.25,U+.4],0,m),o.box([a,W+1+ot+F/2,r],[U*.92,F/2,U*.92],0,P,null,.04),o.tube([a,W+1+ot+F,r],[a,W+3+ot+F,r],.06,.03,g,4),W+3+ot+F},Y=(a,r,i,h,m)=>{for(let P=0;P<m;P++)At(o,t.range(a,r),l.quayY,t.range(i,h),t.range(1.5,1.75),t.pick(B),t.range(-.08,.08))},T=l.bastion[0],f=l.bastion[1],M=l.head[0],C=l.head[1];$(T+4,T+700,f-6.5,f+6.5,-1.2,4.6,c),$(T+4,T+700,f-6.5,f-5.6,4.6,5.7,c),$(M-700,M-3,C-5.5,C+5.5,-1.2,4.2,c),$(M-700,M-3,C-5.5,C-4.7,4.2,5.2,c),V(T,f,10.5,9.3,.8,9.3,c,6,44),k(T,f,9.3,9.2,u,44),V(T,f,9.3,9.3,9.6,10.5,c,6,44),V(T,f,8.7,8.7,9.2,10.5,c,6,44),V(T,f,11.1,10.9,-1.2,.8,c,6,44),V(T,f,10.9,10.5,.8,1,c,0,44),V(T,f,9.86,10.12,5.3,5.5,y,0,44),V(T,f,10.12,9.8,5.5,5.75,y,0,44);for(let a=0;a<11;a++){const r=(a+.5)/11*Math.PI*2,i=.075,h=P=>10.5-1.2*(P-.8)/8.5+.05,m=(P,F)=>[T+Math.cos(P)*h(F),F,f+Math.sin(P)*h(F)];o.quad(m(r-i,6.95),m(r+i,6.95),m(r-i,7.7),m(r+i,7.7),z),o.quad(m(r-i*1.25,7.7),m(r+i*1.25,7.7),m(r-i*1.25,7.9),m(r+i*1.25,7.9),y)}V(T,f,9.3,9.75,9.3,9.45,y,0,44),V(T,f,9.75,9.3,9.45,9.6,y,0,44),V(M,C,6.8,6.3,.6,4.6,c,6,32),V(M,C,7.25,7.1,-1.2,.6,c,6,32),V(M,C,7.1,6.8,.6,.8,c,0,32),V(M,C,6.3,6.7,4.6,4.75,y,0,32),V(M,C,6.7,6.3,4.75,4.9,y,0,32),V(M,C,6.3,6.3,4.9,5.8,c,6,32),V(M,C,5.8,5.8,5.4,5.8,c,6,32),k(M,C,6,5.4,u,32),V(T,f,3.3,2.25,9.2,33.4,y,10,24),V(T,f,4,3.7,9.2,10.7,y,0,24),V(T,f,3.7,3.25,10.7,11.1,y,0,24),V(T,f,2.3,3.45,32.4,33.4,y,0,24),k(T,f,3.5,33.4,z,24),V(T,f,3.5,3.5,33.4,33.8,z,0,24);for(let a=0;a<10;a++){const r=a/10*Math.PI*2;n.line([[T+Math.cos(r)*3.4,33.8,f+Math.sin(r)*3.4],[T+Math.cos(r)*3.4,34.9,f+Math.sin(r)*3.4]],.05,z,.9)}e.grid(14,1,(a,r)=>{const i=a*Math.PI*2;return{p:[T+Math.cos(i)*1.55,34+r*2.5,f+Math.sin(i)*1.55],c:g,a:[3,.5+.3*r,.55,0]}});for(let a=0;a<7;a++){const r=a/7*Math.PI*2;o.tube([T+Math.cos(r)*1.6,33.8,f+Math.sin(r)*1.6],[T+Math.cos(r)*1.6,36.6,f+Math.sin(r)*1.6],.06,.06,z,4)}V(T,f,1.9,.12,36.5,39,z,0,14),o.tube([T,39,f],[T,40.6,f],.06,.03,z,4),o.box([T-3.2,10.6,f-.2],[.12,1.1,.55],0,z),V(M,C,1.1,.8,5.4,11,y,10,10),e.grid(8,1,(a,r)=>{const i=a*Math.PI*2;return{p:[M+Math.cos(i)*.62,11+r*1.1,C+Math.sin(i)*.62],c:g,a:[3,.2,.3,0]}}),V(M,C,.8,.06,12.1,13.2,z,0,8);const D=l.quayL,b=l.quayR,R=l.mouthZ+14,K=1700;$(D,D+60,R,K,-1.2,l.quayY,u),$(b-60,b,R,K,-1.2,l.quayY,u),$(D,T+6,f+6.5,R+.5,-1.2,l.quayY,u),$(M-6,b,C+5.5,R+.5,-1.2,l.quayY,u);const s=D+8,p=b-8,A=16;N(s,s+A,664,698,12.5,d[1],x[0]),N(s,s+A+4,704,758,17,d[0],x[2],3.6),S(s-.2,720,742,10.5,6,d[4],-1);const _=L(s+7,786,4.4,41,d[2],x[0],11);N(s+3,s+28,806,846,15,d[4],x[1]);const ht=H(s+15.5,826,l.quayY+15,8.2,6.5,10.5,d[4],E);N(p-A,p,662,690,10,d[5],x[3]),N(p-A-6,p-4.5,700,756,16,d[0],x[1],3.2),S(p+.2,703,753,12.5,9,d[4],1),N(p-A-2,p,766,838,19,d[2],x[0],3.8),N(p-34,p-2,858,922,17,d[0],x[1]);const Mt=H(p-18,890,l.quayY+17,12.5,10,17,d[0],d[4]);L(p-6,846,3.2,30,d[4],x[1],8);let Q=866,J=936;for(let a=0;a<16;a++){const r=t.range(26,60),i=t.range(11,24),h=t.range(14,24);N(s+t.range(0,3),s+h,Q,Q+r,i,t.pick(d),t.pick(x),t.range(2.4,4)),t.chance(.3)&&L(s+t.range(8,20),Q+r*.5,t.range(2.6,3.8),t.range(26,46),t.pick(d),t.pick(x),t.range(6,12)),Q+=r+t.range(4,10)}for(let a=0;a<15;a++){const r=t.range(26,60),i=t.range(11,24),h=t.range(14,24);N(p-h,p-t.range(0,3),J,J+r,i,t.pick(d),t.pick(x),t.range(2.4,4)),t.chance(.3)&&L(p-t.range(8,20),J+r*.5,t.range(2.6,3.8),t.range(26,46),t.pick(d),t.pick(x),t.range(6,12)),J+=r+t.range(4,10)}H(s+30,1120,l.quayY+20,13,9,18,d[3],E);const at=l.gate[0],ut=l.gate[1],xt=l.gate[2],et=l.gate[3],Z=ut-.6,kt=ut+8.6,wt=d[1],it=a=>17.4-4.6*Math.pow(Math.min(1,Math.abs(a-at)/45),1.6),yt=[[at,xt,et]];for(const a of[1,-1])yt.push([at+a*(xt+3.4+7),7,2.5]),yt.push([at+a*(xt+3.4+14+3+7),7,2.5]);const mt=[b];yt.slice().sort((a,r)=>a[0]-r[0]).forEach(([a,r])=>{mt.push(a-r,a+r)}),mt.push(D);for(const a of[Z,kt]){for(let r=0;r<mt.length;r+=2){const i=mt[r],h=mt[r+1];o.grid(2,1,(m,P)=>{const F=i+(h-i)*m,O=it(F);return{p:[F,-1.2+(O+1.2)*P,a],c:wt,a:[6,F-b,-1.2+(O+1.2)*P,0]}})}for(const[r,i,h]of yt)o.grid(16,1,(m,P)=>{const F=r-i+2*i*m,O=h+Math.sqrt(Math.max(0,i*i-(F-r)*(F-r))),W=it(F);return{p:[F,O+(W-O)*P,a],c:wt,a:[6,F-b,O+(W-O)*P,0]}})}for(const[a,r,i]of yt){o.grid(16,1,(h,m)=>{const P=Math.PI*h;return{p:[a-r*Math.cos(P),i+r*Math.sin(P),Z+(kt-Z)*m],c:wt,a:[6,m*9,h*r*3.14+30,0]}});for(const h of[1,-1])o.grid(1,1,(m,P)=>({p:[a+h*r,-1.2+(i+1.2)*P,Z+(kt-Z)*m],c:wt,a:[6,m*9,-1.2+(i+1.2)*P,0]}))}const bt=d[4];for(const[a,r,i]of yt){const h=r<6.9?1.15:.85,m=Z-.24;o.grid(20,1,(P,F)=>{const O=Math.PI*P,W=r+F*h;return{p:[a-W*Math.cos(O),i+W*Math.sin(O),m],c:bt,a:[11,P*Math.PI*r,F*h,i+W*Math.sin(O)]}});for(const P of[r,r+h])o.grid(20,1,(F,O)=>{const W=Math.PI*F;return{p:[a-P*Math.cos(W),i+P*Math.sin(W),m+(Z-m)*O],c:bt,a:[11,F*Math.PI*r,P-r,i+P*Math.sin(W)]}});for(const P of[1,-1])o.box([a+P*(r+h*.5),i-.28,Z-.2],[h*.5+.12,.28,.32],0,bt)}o.box([at,et+xt+.62,Z-.34],[.5,1,.3],0,bt,null,1.3);const qt=[];for(let a=2;a<mt.length-2;a+=2)qt.push([(mt[a]+mt[a+1])/2,(mt[a+1]-mt[a])/2]);for(const[a,r]of qt){const i=Math.abs(a-at)<12,h=i?et-.4:3.4,m=Z-2.6;G(a-r,Z,a,m,-1.2,h,wt,6),G(a,m,a+r,Z,-1.2,h,wt,6),o.quad([a-r,h,Z],[a,h,m],[a,h+1.5,Z],[a,h+1.5,Z],bt),o.quad([a,h,m],[a+r,h,Z],[a,h+1.5,Z],[a,h+1.5,Z],bt)}for(const[a,r]of qt){const i=Math.abs(a-at)<12,h=(i?et-.4:3.4)+1.5,m=it(a)-.5;o.box([a,(h+m)/2,Z-.13],[Math.min(r,1.1),(m-h)/2,.13],0,wt.clone().lerp(bt,.3),[6,a-b,(h+m)/2,0]),i||v(a,it(a)+1.1,Z-.3,2.7,bt)}o.grid(30,1,(a,r)=>{const i=b+(D-b)*a;return{p:[i,it(i)-.5,Z-.5+.5*r],c:wt}});for(let a=b+1.2;a<D-.6;a+=1.5)o.box([a,it(a)-.78,Z-.2],[.2,.28,.2],0,bt,null,1);o.grid(30,1,(a,r)=>{const i=b+(D-b)*a;return{p:[i,it(i),Z-.5+(kt-Z+1)*r],c:u}});for(const a of[Z-.5,kt+.5])for(const r of[0,.35])o.grid(30,1,(i,h)=>{const m=b+(D-b)*i;return{p:[m,it(m)-.5+1.6*h,a+r*(a<ut?1:-1)],c:wt,a:[6,m-b,h*1.6+30,0]}});for(const a of[1,-1]){const r=at+a*(xt+1.7),i=it(r)+1.1;o.box([r,i+2.4,Z-.3],[.5,2.4,.5],0,wt,null,.45),e.box([r,i+5.3,Z-.3],[.3,.42,.3],0,g,[3,.5,.5,0],.7)}for(let a=0;a<9;a++){const r=t.range(b+4,D-4);At(o,r,it(r),Z+t.range(.4,1.6),t.range(1.5,1.75),t.pick(B),0)}Y(D+1.5,s-1,668,850,26),Y(p+1,b-1.5,668,850,26),Y(T+12,T+60,f-4,f+5,6);for(let a=672;a<900;a+=12)o.tube([D+.7,l.quayY,a],[D+.7,l.quayY+.9,a],.2,.17,z,5),o.tube([b-.7,l.quayY,a+5],[b-.7,l.quayY+.9,a+5],.2,.17,z,5);return{campanile:[s+7,_,786],domeR:[p-18,Mt,890],domeL:[s+15.5,ht,826],lamp:[T,35.2,f],boxes:[{c:[T,4.4,f],h:[8.6,5.6,8.6],col:c},{c:[T,22,f],h:[2.6,12,2.6],col:y},{c:[D+16,9,712],h:[10,8,46],col:d[0]},{c:[b-16,9,750],h:[10,9,88],col:d[0]}]}}function At(o,n,e,t,l,d,c=0,u=null){const x=l*.8;o.tube([n,e,t],[n+c*.8,e+x,t],.2*l/1.7,.15*l/1.7,d,6),o.tube([n+c*.8,e+x,t],[n+c,e+x+.07,t],.15*l/1.7,.06,d,6),o.tube([n+c,e+x+.04,t],[n+c,e+l,t],.1,.085,u||w("#B98C6A"),5),u&&o.tube([n+c,e+l-.07,t],[n+c,e+l-.03,t],.2,.2,u,6)}const Nt=(o,n)=>1-.2*Math.pow(Math.abs(o*2-1),2.2)+.07*Math.sin(Math.PI*o)*Math.sin(Math.PI*n)-.1*ct(.72,1,n)-.05*ct(.25,0,n);function _t(o,n,e=1,t=null,l=0){const d=l?-.58:0,c=Math.cos(d),u=Math.sin(d),x=w(t?"#4A3A2E":"#3A2E26"),z=w("#A8946E"),E=w(t?"#7A2E22":"#3A2E26"),g=w("#6B5844"),y=w("#8A7556"),B=w("#3A3028"),G=w("#E6DCC6"),X=k=>(1.5+.8*ct(.62,1,k)+.9*ct(.24,0,k))*e,$=(k,I)=>{const v=Math.pow(Math.sin(Math.min(1,k/.26)*Math.PI/2),.6),N=k<.6?1:Math.pow(Math.max(0,1-Math.pow((k-.6)/.4,2)),.6);return 2.9*e*(.5+.5*v)*N*(.78+.22*ct(-1,1.2,I/e))},V=(k,I)=>(-10+20*k)*e+.3*Math.max(0,I)*ct(.75,1,k);for(const k of[1,-1])o.grid(22,6,(I,v)=>{const N=X(I),S=-1*e+v*(N+1*e);return{p:[k*$(I,S),S,V(I,S)],c:S>N-.4*e?z:S>N-.95*e&&S<N-.6*e?E:x,a:[12,I*20*e,S,0]}});if(o.grid(4,6,(k,I)=>{const v=-1*e+I*(X(0)+1*e);return{p:[(k*2-1)*$(0,v),v,V(0,v)],c:v>X(0)-.4*e?z:x,a:[12,k*4*e,v,0]}}),t)for(const k of[1,-1])o.quad([k*.5*e,.85*e,-10*e-.04],[k*.82*e,.85*e,-10*e-.04],[k*.5*e,1.16*e,-10*e-.04],[k*.82*e,1.16*e,-10*e-.04],w("#E9B95C"),[3,.35,.05,0]);if(o.grid(16,2,(k,I)=>{const v=X(k)-.5*e;return{p:[(I*2-1)*($(k,v)-.1),v,V(k,v)],c:g}}),[[4.2,21,13],[-4.6,17.5,10.5]].forEach(([k,I,v],N)=>{k*=e,I*=e,v*=e,o.tube([0,1*e,k],[0,I,k-.3*e],.24*e,.1*e,y,6);const S=[[I*.52,v*.5],[I*.8,v*.36]];if(t){const H=(L,Y,T,f,M,C,D)=>o.grid(12,8,(b,R)=>{const K=b*2-1,s=(f+(Y-f)*R)*(1-.07*Math.sin(Math.PI*R)),p=T+M*Math.sin(Math.PI*b)*(1-R)+(L-T)*R,A=D*Math.sin(Math.PI*b)*Math.sin(Math.PI*Math.min(1,.1+.9*R)*.95),_=C.clone().multiplyScalar(Nt(b,R)*(l?1-.17*Math.exp(-Math.pow(K*s/(.7*e),2)):1));if(l)return{p:[K*s*c-A*u,p+K*.1*R,k+.42*e+K*s*u+A*c],c:_,a:[Ct(b,R),K*s*.9,.02+.96*R,.03*e*(1-R)*(1-R)]};const ht=k+.3*e+K*s*.1-A-.12*e;return{p:[K*s,p+K*.1*R,ht],c:_,a:[Ct(b,R),K*s*.9,.02+.96*R,.1*e*(1-R)*(1-R)]}});H(S[0][0]-.25*e,S[0][1]*.93,3.6*e,S[0][1]*.82,(l?.55:1.1)*e,t[N*2],(l?1.5:.7)*e),H(S[1][0]-.2*e,S[1][1]*.93,S[0][0]+.55*e,S[0][1]*.86,(l?.45:.9)*e,t[N*2+1],(l?1.1:.5)*e)}for(const[H,L]of S){for(const Y of[1,-1])o.tube([0,H,k+.3*e],l?[Y*L*c,H+Y*.1,k+.3*e+Y*L*u]:[Y*L,H+Y*.1,k+.3*e+Y*L*.1],.12*e,.06*e,y,5);t||o.grid(6,4,(Y,T)=>{const f=Y*2-1,M=T*Math.PI*2,C=.2*e*(1.4-.6*Math.abs(f));return{p:[f*L*.92,H+.2*e+Math.sin(M)*C,k+.3*e+f*L*.092+Math.cos(M)*C],c:G}});for(const Y of[1,-1])n.line([[0,H+2.4*e,k],l?[Y*L*.96*c,H+Y*.1,k+.3*e+Y*L*.96*u]:[Y*L*.96,H+Y*.1,k+.3*e+Y*L*.096]],.04,B,.7)}for(const H of[1,-1])for(let L=0;L<3;L++)n.line([[H*.3*e,I*.6,k],[H*2.75*e,1.6*e,k-(.6+L*.8)*e]],.05,B,.8);n.line([[0,I*.95,k],[0,(N?6:2.6)*e,k+(N?8.2:6.5)*e]],.05,B,.8)}),o.tube([0,2.2*e,9.2*e],[0,4.6*e,14.5*e],.16*e,.08*e,y,5),t){if(l||n.line([[.5*e,2*e,9.6*e],[.9*e,.4,13*e],[1.2*e,-.6,15.5*e]],.09,B,.95),l){const k=(I,v,N,S)=>o.grid(6,6,(H,L)=>{const Y=gt(gt(v,N,H),I,L);return Y[0]+=.55*e*Math.sin(Math.PI*H)*Math.sin(Math.PI*L*.9),{p:Y,c:S.clone().multiplyScalar(Nt(H,.5)-.1*L),a:[Ct(H,L),H*4,0,.03*e*H*(1-L)]}});k([0,19.5*e,4*e],[0,4.5*e,14.2*e],[.9*e,3.2*e,6.6*e],t[1]),k([0,15.5*e,4.1*e],[0,3.6*e,11.8*e],[.8*e,3*e,5.6*e],t[0]),o.tube([0,4.2*e,-4.9*e],[1.6*e,4.6*e,-11.6*e],.11*e,.07*e,y,5),o.tube([0,11.6*e,-4.9*e],[1.3*e,14.4*e,-9.8*e],.09*e,.05*e,y,5),o.grid(8,8,(I,v)=>{const N=gt(gt([0,4.4*e,-4.9*e],[1.6*e,4.8*e,-11.5*e],I),gt([0,11.5*e,-4.9*e],[1.3*e,14.3*e,-9.7*e],I),v);return N[0]+=.6*e*Math.sin(Math.PI*I)*Math.sin(Math.PI*v),{p:N,c:t[2].clone().multiplyScalar(Nt(I,v)),a:[Ct(I,v),I*5,0,.03*e*I]}})}o.grid(10,2,(k,I)=>({p:[0,21*e-.25*k*e-(I-.5)*.5*e*(1-k),4.2*e-.4-k*7.5*e],c:w("#B23A26"),a:[4,k*7.5*e,0,.28*k]}));for(const[k,I,v,N]of[[.9,-6.5,1.7,"#2B2A33"],[-1.2,-1.5,1.65,"#6B2E22"],[.4,6.2,1.7,"#3E4A5E"]])At(o,k*e,X(.4)-.5*e,I*e,v,w(N),.05);return{boxes:[{c:[0,.9*e,0],h:[2.7*e,1.5*e,9.6*e],col:x},{c:[0,11.5*e,0],h:[5.6*e,8.5*e,5.2*e],col:G}]}}return{boxes:[{c:[0,.9*e,0],h:[2.7*e,1.5*e,9.6*e],col:x}]}}function $t(o,n=2){const e=w("#3E3026"),t=w("#B48D56"),l=w("#A58A62"),d=[w("#D8CCB2"),w("#8E3122"),w("#3E4A5E")],c=u=>.85*Math.pow(Math.sin(Math.min(1,u/.3)*Math.PI/2),.7)*(u<.55?1:Math.pow(Math.max(0,1-Math.pow((u-.55)/.45,2)),.6));for(const u of[1,-1])o.grid(10,2,(x,z)=>({p:[u*c(x)*(.7+.3*z),-.25+z*.85,-2.6+5.2*x],c:z>.75?t:e}));o.grid(8,1,(u,x)=>({p:[(x*2-1)*c(u)*.8,.12,-2.6+5.2*u],c:l}));for(let u=0;u<n;u++)At(o,u?0:.05,.28,-1.4+u*1.5,1.02,d[u%3],u?.1:-.06,u?null:w("#2A2622"));for(const u of[1,-1])o.tube([u*.7,.6,.1],[u*2.5,.15,-.5],.035,.05,l,4);return{}}function Zt(o,n){const e=n.length,t=new q.InstancedBufferGeometry,l=[],d=[],c=[[-1,0,.03],[-.62,.1,.2],[-.22,0,.3],[0,0,.42],[.22,0,.3],[.62,.1,.2],[1,0,.03]];c.forEach(([g,y,B])=>{l.push(g,0,y+B,g,0,y-B)});for(let g=0;g<c.length-1;g++){const y=g*2;d.push(y,y+1,y+2,y+1,y+3,y+2)}t.setAttribute("position",new q.Float32BufferAttribute(l,3)),t.setIndex(d);const u=new Float32Array(e*4),x=new Float32Array(e*4);n.forEach((g,y)=>{u.set([g.c[0],g.c[1],g.c[2],g.r],y*4),x.set([g.speed,g.phase,g.flap,g.size],y*4)}),t.setAttribute("aC",new q.InstancedBufferAttribute(u,4)),t.setAttribute("aK",new q.InstancedBufferAttribute(x,4)),t.instanceCount=e;const z=new q.ShaderMaterial({uniforms:o,side:q.DoubleSide,vertexShader:`attribute vec4 aC, aK; uniform float uT; varying vec3 vW; varying float vUp, vTip;
      void main(){
        float a = aK.y + uT * aK.x / aC.w, cs = cos(a), sn = sin(a), dir = sign(aK.x);
        vec3 ctr = aC.xyz + vec3(cs * aC.w, sin(uT * .5 + aK.y * 3.) * .8, sn * aC.w);
        vec3 fwd = vec3(-sn, 0., cs) * dir, out_ = vec3(cs, 0., sn), up = vec3(0., 1., 0.);
        float beat = sin(uT * aK.z + aK.y * 7.), glide = smoothstep(-.2, .5, sin(uT * .37 + aK.y * 5.));      // beats a while, then holds its wings out
        float ang = mix(beat * .75, .12, glide), ax = abs(position.x);
        vec3 right = out_ * dir * -1.;
        vec3 bank = normalize(up + out_ * -.35);                                                               // leaning into the turn
        vec3 w = ctr + (right * position.x * cos(ang * ax) + bank * (ax * sin(ang * ax) * 1.1 - .06 * ax * ax) + fwd * position.z * .55) * aK.w;
        vW = w; vUp = sin(ang * ax); vTip = ax;
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
      }`,fragmentShader:`varying vec3 vW; varying float vUp, vTip;
      ${zt}
      void main(){
        vec3 rd = normalize(vW - cameraPosition);
        vec3 col = mix(mix(cDusk, cSlate, .3) * .9, mix(cPearl, cCore, .5), gl_FrontFacing ? .75 : .3);
        col = mix(col, cUmber * 1.6, smoothstep(.8, 1., vTip) * .7);                                           // dark wing tips
        col = mix(col, mix(cGold, cLemon, .5), smoothstep(.55, .98, dot(rd, uSun)) * .55);                     // against the sun they are flecks of light
        gl_FragColor = vec4(tAirK(col, vW, .5), 1.);
      }`}),E=new q.Mesh(t,z);return E.frustumCulled=!1,E.name="gulls",E}function Xt(o,n){const e=w("#8E2F22"),t=w("#221C1A"),l=w("#3A3430");o.grid(18,6,(d,c)=>{const u=d*Math.PI*2,x=1.35-.75*c*c;return{p:[Math.cos(u)*x,-.6+c*2.3,Math.sin(u)*x],c:c>.34&&c<.67?t:e,a:[12,d*8.5,-.6+c*2.3,0]}}),o.grid(12,1,(d,c)=>{const u=d*Math.PI*2;return{p:[Math.cos(u)*.6*c,1.7,Math.sin(u)*.6*c],c:e}});for(let d=0;d<4;d++){const c=d/4*Math.PI*2+.4;o.tube([Math.cos(c)*.55,1.7,Math.sin(c)*.55],[Math.cos(c)*.2,3.7,Math.sin(c)*.2],.05,.04,l,4)}return o.box([0,2.65,0],[.2,.24,.2],.3,w("#B08D4A"),null,.55),o.box([0,4,0],[.26,.26,.26],.78,e),{boxes:[{c:[0,1.3,0],h:[.9,2.4,.9],col:e}]}}async function Qt(o,n={}){const e=o.rng,t=Math.min(1,Math.max(.6,n.detail??o.quality?.detail??1)),l=Tt("fire",new q.Vector3(e.range(0,40),e.range(0,40),e.range(0,40)));l.uSq.value.set(0,0,100,0),l.uSwell.value.set(.14,0,0,0);const d=new q.Group;d.name="squall-of-light-hero";const c=Ht(l),u=Ut(l),x=[],z=(b,R,K,s=0)=>{const p=new q.Mesh(R,K);return p.frustumCulled=!1,p.renderOrder=s,b.add(p),x.push(R),p},E=new q.Group;d.add(E);const g=new Ft,y=new Bt,B=jt(g,y,e.fork?e.fork("ship"):e);await o.yield(),z(E,g.geometry(),c),z(E,y.geometry(),u,5),await o.yield();const G=new q.Group;G.position.set(17,0,82),G.rotation.y=.17,d.add(G);const X=new Ft,$=new Bt,V=new Ft,k=Vt(X,$,V,e.fork?e.fork("tug"):e);z(G,X.geometry(),c),z(G,$.geometry(),u,5);const I=z(G,V.geometry(),c);I.position.set(k.shaft[0],k.shaft[1],k.shaft[2]),await o.yield();const v=(b,R)=>{const K=Math.cos(b.rotation.y),s=Math.sin(b.rotation.y);return[b.position.x+R[0]*K+R[2]*s,R[1],b.position.z-R[0]*s+R[2]*K]},N=new Bt,S=v(E,B.hawse),H=v(G,k.tow),L=[];for(let b=0;b<=30;b++){const R=b/30;L.push([S[0]+(H[0]-S[0])*R,S[1]+(H[1]-S[1])*R-4.2*4*R*(1-R),S[2]+(H[2]-S[2])*R])}N.line(L,.11,w("#7A664A"),1),z(d,N.geometry(),u,5);const Y=[],T=e.fork?e.fork("puffs"):e,f=v(G,k.funnel),M=Math.round(80*t);for(let b=0;b<M;b++)Y.push({p0:[f[0],f[1]+.2,f[2]],v:[-.45*120,4,-.89*120],phase:(b+T())/M,rate:1/26,r0:.75,r1:T.range(8,13),rise:T.range(24,32),wob:T.range(1.2,3),seed:T(),mode:0});const C=Gt(l,Y);d.add(C);const D=new q.Vector2;return{object:d,radius:78,height:62,center:new q.Vector3(5,20,34),anchors:{hawse:B.hawse.slice(),tow:H,funnel:f,trucks:B.trucks},update(b,R){l.uT.value=R,o.renderer&&(o.renderer.getDrawingBufferSize(D),l.uRes.value.copy(D)),E.rotation.z=Math.sin(R*.52)*.006,G.rotation.z=Math.sin(R*1.5)*.02,G.position.y=Math.sin(R*1.9)*.1,I.rotation.x=R*2.3},dispose(){for(const b of x)b.dispose();C.geometry.dispose(),C.material.dispose(),c.dispose(),u.dispose(),l.uNoise.value.dispose()},ground:!0,groundY:0}}export{Dt as LOOKS,Bt as Liner,Ft as Mesher,zt as TURNER_GLSL,Zt as buildGulls,Qt as buildHero,Gt as buildPuffs,Ot as buildSea,Lt as buildSky,Xt as drawBuoy,_t as drawCoaster,Wt as drawHarbour,Yt as drawLugger,jt as drawShip,$t as drawSkiff,Vt as drawTug,At as figure,Ut as lineMaterial,Et as makeNoiseTexture,Tt as makeUniforms,ct as sm,Ht as solidMaterial,Kt as swellAt};
