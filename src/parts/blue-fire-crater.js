import*as M from"three";const Ne=D=>Math.min(1,Math.max(0,D)),ke=(D,t,I)=>{const Y=Ne((I-D)/(t-D));return Y*Y*(3-2*Y)},Ge=(D,t,I)=>D+(t-D)*I,He=D=>{const t=Math.sin(D*12.9898+4.1414)*43758.5453;return t-Math.floor(t)},dt=D=>{const t=Math.floor(D),I=D-t;return Ge(He(t),He(t+1),I*I*(3-2*I))},et=(D,t)=>He(((D*73+t*151)%4096+4096)%4096),ht=(D,t)=>{const I=Math.floor(D),Y=Math.floor(t),ee=D-I,ae=t-Y,be=ee*ee*(3-2*ee),Le=ae*ae*(3-2*ae);return Ge(Ge(et(I,Y),et(I+1,Y),be),Ge(et(I,Y+1),et(I+1,Y+1),be),Le)},je=`
uniform sampler2D tNoise;
float nR(vec2 p){ return texture2D(tNoise, p).r; }
float nG(vec2 p){ return texture2D(tNoise, p).g; }
float nB(vec2 p){ return texture2D(tNoise, p).b; }
float nA(vec2 p){ return texture2D(tNoise, p).a; }
`;async function xt(D,t,I=4){const ee=Ae=>{const ve=new Float32Array(Ae*Ae);for(let ue=0;ue<ve.length;ue++)ve[ue]=D();return ve},ae=[ee(8),ee(16),ee(32),ee(64)],be=[ee(8),ee(16),ee(32),ee(64)],Le=[ee(8),ee(16),ee(32)],Ee=[ee(32),ee(64),ee(128)],$=(Ae,ve,ue,pe)=>{const Oe=ue*ve,Be=pe*ve,Ce=Math.floor(Oe),Re=Math.floor(Be);let Pe=Oe-Ce,xe=Be-Re;Pe=Pe*Pe*(3-2*Pe),xe=xe*xe*(3-2*xe);const _e=Ce%ve,Je=(Ce+1)%ve,Ve=Re%ve,Ie=(Re+1)%ve;return Ge(Ge(Ae[Ve*ve+_e],Ae[Ve*ve+Je],Pe),Ge(Ae[Ie*ve+_e],Ae[Ie*ve+Je],Pe),xe)},ze=new Uint8Array(256*256*4);for(let Ae=0;Ae<256;Ae++){for(let ve=0;ve<256;ve++){const ue=ve/256,pe=Ae/256,Oe=(Ae*256+ve)*4,Be=$(ae[0],8,ue,pe)*.5+$(ae[1],16,ue,pe)*.27+$(ae[2],32,ue,pe)*.15+$(ae[3],64,ue,pe)*.08,Ce=$(be[0],8,ue,pe)*.5+$(be[1],16,ue,pe)*.27+$(be[2],32,ue,pe)*.15+$(be[3],64,ue,pe)*.08,Re=1-Math.abs(2*$(Le[0],8,ue,pe)-1),Pe=1-Math.abs(2*$(Le[1],16,ue,pe)-1),xe=1-Math.abs(2*$(Le[2],32,ue,pe)-1),_e=$(Ee[0],32,ue,pe)*.5+$(Ee[1],64,ue,pe)*.3+$(Ee[2],128,ue,pe)*.2;ze[Oe]=255*Ne((Be-.5)*1.5+.5),ze[Oe+1]=255*Ne((Ce-.5)*1.5+.5),ze[Oe+2]=255*Ne(Re*Re*.55+Pe*Pe*.3+xe*xe*.15),ze[Oe+3]=255*Ne((_e-.5)*1.4+.5)}(Ae&1)===1&&t&&await t()}const le=new M.DataTexture(ze,256,256,M.RGBAFormat);return le.wrapS=le.wrapT=M.RepeatWrapping,le.magFilter=M.LinearFilter,le.minFilter=M.LinearMipmapLinearFilter,le.generateMipmaps=!0,le.anisotropy=I,le.needsUpdate=!0,le}function ft(D={}){const t={windPeriod:D.windPeriod??35,pourPeriod:D.pourPeriod??30,windStart:D.windStart??0,pourStart:D.pourStart??0,speed:30,cross:5,uniform:{value:new M.Vector4(0,D.windPeriod??35,0,D.pourPeriod??30)},set(I){const Y=(I-t.windStart)/t.windPeriod,ee=(I-t.pourStart)/t.pourPeriod;t.uniform.value.x=Y-Math.floor(Y),t.uniform.value.z=(ee-Math.floor(ee))*t.pourPeriod},lean(I){const Y=t.uniform.value.x-I*t.cross/t.windPeriod;return .5+.5*Math.cos(6.2832*Y)},burn(I){const Y=t.uniform.value.z-I/t.speed,ee=t.pourPeriod;return Y<0?0:ke(0,.5,Y)*(1-ke(ee*.34,ee*.6,Y))},pool(){const I=t.uniform.value.z,Y=t.pourPeriod;return I<3?1-ke(0,3,I):ke(3,Y,I)}};return t}const $e=`
uniform vec4 uLaw;
float windLean(float e){ return .5 + .5 * cos(6.2832 * (uLaw.x - e * 5. / uLaw.y)); }
float pourBurn(float m){ float t = uLaw.z - m / 30.; return smoothstep(0., .5, t) * (1. - smoothstep(uLaw.w * .34, uLaw.w * .6, t)); }
float pourPool(){ float t = uLaw.z; return t < 3. ? 1. - smoothstep(0., 3., t) : smoothstep(3., uLaw.w, t); }
`,ct=`
uniform vec4 uFire[10]; uniform float uFireR[10]; uniform vec3 uFireCol, uSkyCol, uMoonDir, uMoonCol, uLakeCol; uniform vec4 uLake, uRim;
// how much of the moon a place sees over the crater's rim: the rim is taken as a ring about the crater's middle (the
// world's origin), uRim.x m out round the lake and uRim.y m out behind the bay, uRim.z m high; a place is lit when the
// way from it toward the moon clears that ring
float moonSees(vec3 P){
  vec2 m = normalize(uMoonDir.xz + vec2(1e-5, 0.)); float r2 = dot(P.xz, P.xz), R = mix(uRim.x, uRim.y, smoothstep(uRim.x - 25., uRim.x + 40., sqrt(r2)));
  float pm = dot(P.xz, m), t = -pm + sqrt(max(pm * pm - r2 + R * R, 0.));
  return smoothstep(-8., 8., P.y + t * uMoonDir.y / max(length(uMoonDir.xz), 1e-3) - uRim.z); }
// the fire's light on a face at P that looks along N (wrap: how far round the face the light creeps, 0..1). It is
// strong and local: from each place it is full within that place's own breadth (uFireR), a tenth of that at three
// breadths, and gone by eight; a face turned from the fire stays dark, so the rock's relief shows
vec3 fireLight(vec3 P, vec3 N, float wrap){
  float sum = 0.;
  for (int i = 0; i < 10; i++) { vec3 L = uFire[i].xyz - P; float d2 = dot(L, L), r2 = uFireR[i] * uFireR[i];
    sum += uFire[i].w * r2 / (d2 + r2) * (1. - smoothstep(16. * r2, 64. * r2, d2)) * clamp((dot(N, L) * inversesqrt(max(d2, 1e-4)) + wrap) / (1. + wrap), 0., 1.); }
  return uFireCol * sum; }
// the fire's rim: an edge of a form that faces the fire, seen edge-on from V (the way to the eye's place), takes a thin
// line of its light; it carries far (to some sixty breadths of each place), so the rim and the dead trees are edged by it
vec3 fireRim(vec3 P, vec3 N, vec3 V){
  float sum = 0., f = 1. - clamp(dot(N, V), 0., 1.); f *= f * f;
  for (int i = 0; i < 10; i++) { vec3 L = uFire[i].xyz - P; float d2 = dot(L, L), r2 = uFireR[i] * uFireR[i] * 64.;
    sum += uFire[i].w * r2 / (d2 + r2) * clamp(dot(N, L) * inversesqrt(max(d2, 1e-4)) * 1.1 + .1, 0., 1.); }
  return uFireCol * sum * f; }
// the fire's far light: what of it reaches a face a long way off (the same reach as the rim's), on the side turned to it
vec3 fireFar(vec3 P, vec3 N){
  float sum = 0.;
  for (int i = 0; i < 10; i++) { vec3 L = uFire[i].xyz - P; float d2 = dot(L, L), r2 = uFireR[i] * uFireR[i] * 64.;
    sum += uFire[i].w * r2 / (d2 + r2) * clamp(dot(N, L) * inversesqrt(max(d2, 1e-4)), 0., 1.); }
  return uFireCol * sum; }
// the night sky's own light on a face that looks along N: starlight, dim and nearly grey, from above. Level ground
// takes it whole, ground that falls at forty degrees some nine tenths of it, a standing wall over half, the underside
// of an overhang nothing
vec3 skyLight(vec3 N){ float up = clamp(N.y * .5 + .5, 0., 1.), top = max(N.y, 0.); return uSkyCol * (.78 * sqrt(up) + .22 * top * sqrt(top)); }
// everything else that lights a face: the sky from above, the lake's steam, the moon
vec3 nightLight(vec3 P, vec3 N){
  vec3 L = uLake.xyz - P; float d2 = dot(L, L);
  // (the lake's glow: from its near water, and faintly from its whole face up the foot of every wall that stands round it)
  return skyLight(N) + uLakeCol * uLake.w * (9e4 / (d2 + 9e4) * clamp(dot(N, L) * inversesqrt(max(d2, 1e-4)) * .7 + .3, 0., 1.)
      + exp(-max(P.y, 0.) / 30.) * (1. - smoothstep(uRim.x - 50., uRim.x + 80., length(P.xz))) * (.6 - .4 * N.y))
    + uMoonCol * max(dot(N, uMoonDir), 0.) * moonSees(P); }
`,Ye=`
uniform vec4 uAir, uAirMap, uAirFloor, uAirTeal; uniform vec3 uAirCol, uAirFire; uniform sampler2D tAir, tAirRed;
vec2 airBay(vec2 xz){ vec2 q = xz - uAirMap.xy; return vec2(q.x + q.y, q.x - q.y) * .70711; }
vec2 airUV(vec2 ab){ return (ab - uAirMap.zw) / vec2(textureSize(tAir, 0)); }
float airFloor(float a){ return a > 0. ? uAirFloor.x + a * .09 : max(uAirFloor.x + a * uAirFloor.y, uAirFloor.z); }
vec4 airAt(vec3 P){
  vec3 E = cameraPosition, D = P - E; float L = length(D);
  float yE = max(E.y, 0.) * uAir.y, yP = max(P.y, 0.) * uAir.y, dy = yP - yE;
  float fume = uAir.x * L * (abs(dy) > 1e-3 ? (exp(-yE) - exp(-yP)) / dy : exp(-yE));
  float fire = 0., teal = 0.;
  for (int i = 0; i < 4; i++) { vec3 Q = E + D * (.125 + .25 * float(i)); vec2 ab = airBay(Q.xz), uv = airUV(ab);
    vec2 e = smoothstep(vec2(0.), vec2(.06), uv) * (1. - smoothstep(vec2(.94), vec2(1.), uv));
    float f = textureLod(tAir, uv, 2.).g; f *= f * e.x * e.y;
    fire += f * exp(-max(Q.y - airFloor(ab.x), 0.) / uAirFloor.w);
    teal += (1. - smoothstep(uAirTeal.w - 60., uAirTeal.w - 10., length(Q.xz))) * exp(-max(Q.y, 0.) / 9.); }
  fire *= L * .25; teal *= L * .25;
  float tau = fume + uAir.z * fire, T = exp(-tau);
  vec2 abP = airBay(P.xz); float red = textureLod(tAirRed, airUV(abP), 1.).g;
  red = red * red * red * exp(-max(P.y - airFloor(abP.x), 0.) / 5.) * (1. - exp(-L / 30.));
  vec3 glow = uAirFire * (1. - exp(-fire * uAir.w)) + uAirTeal.rgb * (1. - exp(-teal * .012)) + vec3(.04, .006, .001) * red;
  return vec4(uAirCol * (1. - T) + glow * sqrt(T), T); }
// how near molten sulphur a place lies (the world's map of the bay's floor keeps, in its third number, how far
// inside a river's bank a place is, a sixteenth to the metre, a half on the bank): the most on the molten bed and to
// half a metre outside its bank, 0 from 2.5 m outside it, and less the higher over the bay's floor the place stands.
// ITS MOST IS 0.12, NOT 1: it tells a tongue how far its form gives way by molten sulphur (a sharper body, less
// fringe, an edge that hides the ground early: see the tongue's law), and the bed under a burning stream is dark,
// skinned sulphur, over which a thin blue is still blue: at the whole strength the stream's fire, which stands
// on the bed from end to end, is a pale flat sheet with cut edges; at an eighth its edges are firm and its
// tongues keep their veil.
float moltenAt(vec3 P){
  vec2 ab = airBay(P.xz), uv = airUV(ab);
  return .12 * smoothstep(-2.5, -.5, (texture2D(tAirRed, uv).b - .5) * 16.) * step(0., min(uv.x, uv.y)) * step(max(uv.x, uv.y), 1.) * exp(-max(P.y - airFloor(ab.x), 0.) / 4.); }
`,mt=.95,st=`
// (one lick: a smooth drop h tall, in the tongue's own height, its foot at x0, W broad, its tip drawn b aside; a
// wave runs up its middle line on the world's clock; a: how soon it draws in)
float lickD(vec2 p, float x0, float b, float W, float h, float a, float ph, float hm, float tK){
  float y = p.y / h, xc = x0 + b * y * y + W * (.3 + .7 * min(tK, 1.)) * (.2 * y + .55 * y * y) * sin(y * (4.2 + hm * .5) - uTime * 4.6 + ph);
  return W * pow(max(1. - pow(max(y, 0.), a), 0.), 1.1) * (.74 + .26 * exp(-y * 9.) + .14 * exp(-(y - .34) * (y - .34) * 24.)) * sqrt(clamp(y * 12. + .1, 0., 1.)) - abs(p.x - xc) - max(y - 1., 0.) * 3.; }
// (THE COLOURS OF THE FIRE, linear light, and none of them has any red. The engine's tone map draws a strong blue
// toward violet and then to white by itself: blue 3 with nothing else shows 116 of 255 in red, blue 5 shows 165.
// So the body is held to 1.5 to 1.95 of blue with a fifth as much green, which shows as electric blue (81, 166,
// 238 of 255 at its deepest; 109, 184, 243 at its brightest) and in THE HUE OF THE FIRE'S OWN LIGHT ON THE
// GROUND: the world lays that light as 0.08, 0.38, 1 times its strength, which shows at hue 215 to 204 degrees
// from dim to bright; the body shows at 208 to 206. (The light's own numbers at a flame's strength would show
// pale, 151, 204, 237: the tone map again.) Toward its inside the body gains green and turns azure (123, 195,
// 244 at the most); the fringe is the same blue, 0.45 at the most (0, 80, 187); and the heart is what a thin
// line at the tongue's middle gains over the body: with it the line stands at 0, 1.15 to 1.5, 2.6 to 2.9, pale
// cyan (178 to 195, 231 to 238, 245), and it alone is bright enough for the engine's bloom)
const vec3 FIRE_FRINGE = vec3(0., .2, 1.), FIRE_BODY = vec3(0., .2, 1.), FIRE_INNER = vec3(0., .08, .2), FIRE_HEART = vec3(0., 1., .7);
const float FIRE_HIDES = ${mt.toFixed(3)};
vec4 tongueLight(vec2 p, float sd, float hm, float wm, float tK, float hot, float lit, float pale, float edge, float red){
  float r1 = fract(sd * 37.3), r2 = fract(sd * 11.7), r3 = fract(sd * 23.9), tk = min(tK, 1.);
  // (its round: a climbs from 0 to 1 in 1 to 2 seconds; hb: where its tip stands, in the sheet's height)
  float a = fract(uTime * (.5 + .5 * r3) + r1 * 7.), hb = mix(.84, mix(.56, .84, pow(a, .7)), tk);
  // (the tongue itself, full to past its middle and drawn out thin; one tongue in two has a lower lick at its
  // left side, one in four another at its right)
  float d = max(lickD(p, 0., (r1 - .5) * .9, .8, hb, 1.4 + .9 * r2, sd * 40., hm, tK),
    max(lickD(p, -.36 - .1 * r3, -.1 - .2 * r2, .44 * step(.5, r3), .26 + .26 * r3, 1.6, sd * 70., hm, tK), lickD(p, .36 + .1 * r2, .1 + .2 * r1, .42 * step(.75, r1), .22 + .26 * r1, 1.6, sd * 90., hm, tK)));
  // (eaten by noise that climbs on the world's clock, taken in metres: a broad tearing and a fine one, most toward the tip)
  float eat = ((nG(vec2(p.x * wm * .4 + sd * 5.1, p.y * hm * .16 - uTime * .7 + sd)) - .5) * .5 + (nA(vec2(p.x * wm * .4 + sd * 9.1, p.y * hm * .15 - uTime * 1.3)) - .5) * .16) * tK * (.2 + .8 * smoothstep(.05, .6, p.y));
  // (the light falls away to nothing over 0.38 of a half breadth at either side: a third of the tongue's whole
  // breadth at its belly, which is 1.14 half breadths; outside it the fringe)
  float body = smoothstep(0., .38 / (1. + .8 * red), d + eat), fringe = smoothstep(-.6, .1, d + eat); fringe *= fringe * (1. - body) * (1. - red);
  float inner = smoothstep(.22, .55, d + eat);
  // (THE HEART IS THIN: a lick a fifth as broad as the tongue, its light full only at its middle line: at half its
  // light it is a tenth of the tongue's breadth. A filter by the pixel's footprint: where that is under a pixel
  // (fp: a pixel's breadth in the tongue's half breadths) it is drawn half a pixel broad and as much the fainter)
  float fp = fwidth(p.x), hw = max(.16 + .04 * hot, .6 * fp);
  float heart = smoothstep(0., hw, lickD(p, 0., (r1 - .5) * .6, hw, hb * (.66 + .1 * hot), 1.2, sd * 40., hm, tK) + eat * .15) * min(1., .27 / max(fp, 1e-4));
  // (THE TORN-OFF TIP: it leaves from where the tip stood as the round began again, rises, shrinks and fades)
  float tipx = (r1 - .5) * .9 + .6 * (.3 + .7 * tk) * sin(4.2 + hm * .5 - uTime * 4.6 + sd * 40.);
  // (it is a wisp, not a ball: taller than broad, and eaten by the same noise as the tongue, hard)
  vec2 c = vec2(tipx * mix(.75, 1.1, a), mix(.74, .96, a)), rr = vec2(.32 - .16 * a, .17 - .07 * a);
  float torn = max(1. - length((p - c) / rr) + eat * 1.5, 0.) * (1. - a) * (1. - a) * tk * (1. - .7 * red);
  // (streaks of brighter gas climb through all of it; a soft glow lies about its foot, where it stands in the fire)
  float streak = nR(vec2(p.x * max(wm, .5) * .8 + sd * 3.3, p.y * max(hm, 1.5) * .08 - uTime * .6)) * .55 + nA(vec2(p.x * wm * .7 + sd * 9.1, p.y * hm * .1 - uTime * 1.)) * .45 * tk;
  float foot = exp(-p.y * hm / .35) * max(1. - abs(p.x) / 1.3, 0.);
  // (the body with the torn-off tip and the foot's glow is never more than one body's light; it is brightest
  // low in the tongue, where the gas burns hottest, and a deeper blue toward its tip: vg)
  float vg = 1. - smoothstep(.2, 1., p.y / hb);
  // (hid: how much of what lies behind it the body hides: near molten sulphur its thin edge hides more than its
  // own share, a little over twice it where the molten law answers its most, see below; and what the edge hides
  // beyond its own light it gives the fringe's deep blue: an edge that hides and gives no light is a dark line
  // round the tongue wherever it stands before other fire)
  float hid = min(body * (1. + 9. * red), 1.);
  vec3 col = FIRE_FRINGE * (.45 * fringe + .9 * (hid - body)) + FIRE_BODY * (min(body + .8 * torn + .4 * foot, 1.) * (1.5 + .22 * streak + .23 * vg - red * (.3 - .1 * streak - .25 * vg))) + FIRE_INNER * (min(inner + .5 * torn, 1.) * (.3 + .7 * vg))
    + FIRE_HEART * (heart * (.9 + .15 * hot) * (.75 + .25 * streak));
  float k = lit * edge * (1. - smoothstep(.93, 1., p.y)); col *= k;
  col = mix(col, vec3(.5, .55, .8) * dot(col, vec3(.1, .3, .4)), pale);   // (the hour's paleness)
  // (NEAR MOLTEN SULPHUR THE TONGUE'S FORM GIVES WAY A LITTLE. red is the molten law's answer, 0.12 at its most
  // (see moltenAt); where it is at that most the body's light comes up over nine tenths of the breadth it does
  // elsewhere, its thin edge hides a little over twice its own share, the fringe outside it is an eighth
  // fainter, the torn-off tip a twelfth fainter, and the body's own blue is all but the same (a fortieth deeper
  // at its tip). The reason: the bed's orange is many times brighter than the edge's blue, and what of it
  // shows through a soft edge and the fringe shows pink; so by the bed the edge is a little firmer and hides a
  // little sooner, and what it hides beyond its own light it gives the fringe's deep blue. The law is written
  // for red from nought to one and is handed no more than 0.12: at one the edge hides in full, there is no
  // fringe and the body comes up over five ninths of its breadth, and a stream's fire, which stands on the bed
  // from end to end, is then a pale flat sheet with cut edges)
  return vec4(col, FIRE_HIDES * min(hid + .8 * torn + .4 * fringe, 1.) * k * (1. - pale)); }
`,tt={blending:M.CustomBlending,blendSrc:M.OneFactor,blendDst:M.OneMinusSrcAlphaFactor,blendSrcAlpha:M.ZeroFactor,blendDstAlpha:M.OneFactor},ut={blending:M.CustomBlending,blendSrc:M.OneFactor,blendDst:M.OneFactor,blendSrcAlpha:M.ZeroFactor,blendDstAlpha:M.OneFactor};function wt(D){return new M.ShaderMaterial({uniforms:D,transparent:!0,depthWrite:!1,side:M.DoubleSide,fog:!1,...tt,vertexShader:`
      attribute vec4 iP, iQ; uniform float uTime, uPx; uniform vec4 uWind; uniform vec2 uFlame;
      ${$e}
      ${Ye}
      varying vec2 vUv; varying vec4 vS, vAir; varying vec3 vT; varying float vRed;
      void main(){
        vRed = moltenAt(iP.xyz);   // (how near molten sulphur its foot stands: for its edge, see the tongue's law)
        // (a tongue of a roaring vent or of a wall's seam burns hotter: a fifth brighter, its heart paler and taller)
        // (a tongue of a course, the build's mark, -1.2: told on as 1.1; it burns as every tongue that burns always)
        float sd = iQ.x, on = iQ.z < 0. ? 1. + .5 * step(iQ.z, -1.5) + .1 * step(iQ.z, -1.1) * step(-1.4, iQ.z) : .55 + .45 * pourBurn(iQ.z);
        float breathe = .78 + .16 * sin(uTime * (1.3 + sd * 1.1) + sd * 40.) + .1 * sin(uTime * (2.9 + sd * 1.7) + sd * 90.);
        // (A FRONT, a tongue broader than its height's own share (the build's mark: see A FRONT OF FIRE): its sheet
        // keeps one height, and the tongues in it breathe each on a round of its own)
        float front = step(1.05, iQ.w); breathe = mix(breathe, .92, front);
        // (h: the sheet's height: the tongue's own tip stands at 0.84 of it and its wisps rise through the rest; at
        // its tallest the sheet is 1.09 of the tongue's full height, inside the 1.1 the world keeps clear)
        float h = max(iP.w * breathe * uFlame.x * min(on, 1.) * 1.05, .05), y = position.y + .5;
        vec2 wd = mix(uWind.zw, uWind.xy, windLean(iQ.y));
        vec3 foot = iP.xyz, toEye = cameraPosition - foot; float dist = length(toEye); vec2 rt = normalize(vec2(toEye.z, -toEye.x) + vec2(1e-5, 0.));
        // (wm: its half breadth at the foot, metres: its foot is some half as broad as it is tall; a front's is
        // what the build gave it, up to 1.4 m; lean: how far down the wind its tip stands, metres: a tongue the weather
        // has beaten down leans by as many metres as it would standing tall; lx: that lean as it is seen across the
        // sheet, in half breadths)
        float wm = h * iQ.w * .19;
        float lean = h * (.14 + .1 * fract(sd * 13.7) + .06 * sin(uTime * 1.7 + sd * 60.)) / max(uFlame.x, .3), lx = dot(wd, rt) * lean / wm * (1. - front);
        // (the sheet is sheared by the lean and is broad enough to hold the tongue's bend and its fringe: 1.65
        // of its half breadth, 0.31 of its height: what the world counts for it; a front's, whose fire dies away
        // toward its two ends inside it, 1.15 of its half breadth; it is never narrower than three pixels at its
        // distance from the eye's place)
        float Q = max(mix(1.65 + .25 * abs(lx), 1.15, front), dist * uPx * 1.5 / wm);
        vec3 pos = foot + vec3(0., y * h, 0.) + vec3(wd.x, 0., wd.y) * (y * lean) + vec3(rt.x, 0., rt.y) * (position.x * 2. * wm * Q);
        // (vT.y: how much of the tongue's tearing its size on the screen can carry: none under six pixels of height,
        // all of it from twenty-eight; vT.z: the sheet's half breadth in the tongue's own)
        vUv = vec2(position.x * 2. * Q, y); vS = vec4(sd, on, h, wm); vT = vec3(lx, smoothstep(6., 28., h / max(dist * uPx, 1e-4)), Q);
        gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.); vAir = airAt(foot + vec3(0., h * .4, 0.));
        // A HALO (a breadth below nought is its mark; iP.w its radius, -iQ.w its strength): the air about a burning
        // line or a large tongue, lit by it: a round disc of light lying level a quarter of a metre over the line
        // (so, looked through from low over a field, the halos do not pile up into a haze); a wall seam's (100
        // more) stands upright before the wall, turned to the eye's place, its middle a third of its radius over
        // the seam. It swells and sinks a little on a slow round of its own. Its depth is taken one radius nearer
        // the eye's place than it stands (drawing: the ground it lies over does not cut it in a line)
        // A SLICK (200 more: the build's): the sulphur afloat under a front, burning: a level disc a tenth of a
        // metre over the front's foot, iP.w its radius, steady; its law is the fragment's. It carries its place
        // on the water (vS.zw): slicks that lie over one another show one sheet.
        if (iQ.w < 0.) { float slick = step(150., -iQ.w), wall = step(50., -iQ.w) * (1. - slick), r = iP.w * mix(.92 + .08 * sin(uTime * (.9 + sd) + sd * 40.), 1., slick);
          vec3 c = foot + vec3(0., mix(mix(.25, .1, slick), .35 * iP.w, wall), 0.), te = normalize(cameraPosition - c), rx = normalize(vec3(te.z, 0., -te.x) + vec3(1e-5, 0., 0.));
          pos = c + mix(vec3(position.x, 0., position.y), rx * position.x + cross(te, rx) * position.y, wall) * (2. * r);
          vec4 cn = projectionMatrix * viewMatrix * vec4(pos + te * r, 1.); gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.); gl_Position.z = cn.z * gl_Position.w / cn.w;
          // (near molten sulphur a halo is the fainter by the molten law's answer, an eighth at the most: blue light
          // added to the bed's orange shows pink)
          vUv = position.xy * 2.; vS = vec4(sd, mix(-iQ.w - 100. * wall, 1., slick) * min(on, 1.) * uFlame.x * (1. - vRed), mix(vec2(1.), pos.xz, slick)); vT = vec3(slick, 0., -1.); vAir = airAt(c); }
      }`,fragmentShader:`
      uniform float uTime; uniform vec2 uFlame;
      ${je}
      ${st}
      varying vec2 vUv; varying vec4 vS, vAir; varying vec3 vT; varying float vRed;
      // A FRONT'S LIGHT: fire that runs together. uv: across the front in its own half breadths and up its sheet
      // (0 its foot .. 1 the sheet's top); hm the sheet's height and wm the front's half breadth, metres; tK how much
      // tearing its size on the screen can carry; lit its strength; pale the hour's paleness; Qs the sheet's half
      // breadth in the front's own; red: how near molten sulphur it stands. It is the ribbon's near law on a
      // short line: A BED, a low bright layer an eighth to a third of the sheet high, azure, pale along its
      // foot, its top rising and sinking along it; and A ROW OF TONGUES rooted in the bed, one to every half
      // of the sheet's height across (0.28 to 0.6 m), each a lick of the one law of a height of its own,
      // between a fifth and the whole of what the sheet holds, broad for its height, soft, thinning away
      // toward its tip, climbing and tearing off on a round of its own. Toward its two ends the bed and the
      // tongues fall away, unevenly: it has no end wall. Front beside front, each laid over the other, they
      // are one fire with a wandering top. It answers as tongueLight does.
      vec4 frontLight(vec2 uv, float sd, float hm, float wm, float tK, float lit, float pale, float Qs, float red){
        float xm = uv.x * wm, ym = uv.y * hm, slow = nR(vec2(xm * .09 + sd * 5.3, sd * 3. + uTime * .03));
        float endK = 1. - smoothstep(.5, 1.05, abs(uv.x) + (nG(vec2(sd * 9. + uv.x * .3, uv.y * .7 + uTime * .1)) - .5) * .3);
        float bedH = hm * (.12 + .2 * slow) * endK, cw = clamp(.5 * hm, .28, .6), xs = xm / cw + fract(sd * 3.7), ci = floor(xs + .5);
        float eat = (nG(vec2(xm * .2 + sd * 7., ym * .45 - uTime * .9)) - .5) * .5 * tK, dT = -9., bT = 0., tT = 0.;
        for (int k = -1; k <= 1; k++) { float cj = ci + float(k), h1 = fract(sin(mod(cj, 1024.) * 12.9898 + floor(sd * 997.) * 4.1414) * 43758.5453), h2 = fract(h1 * 57.31);
          float a = fract(uTime * (.5 + .5 * h2) + h1 * 9.), hb = mix(.66, 1., pow(a, .7));
          float hg = max(hm * .76 * (.2 + .8 * h1 * h1) * (.7 + .3 * slow) * endK, .04), wT = min(.24 + .34 * hg, cw * .85);
          vec2 q = vec2((xs - cj - (h2 - .5) * .5) * cw / wT, (ym - bedH * .4) / hg);
          float dk = lickD(q, 0., (h1 - .5) * .8, .8, hb, 1.5 + h2, h1 * 40., hg, tK);
          vec2 c = vec2((h1 - .5) * .8 * mix(.8, 1.1, a), mix(.9, 1.22, a)), rr = vec2(.32 - .16 * a, .2 - .08 * a);
          // (a low tongue of a slick is soft and has no point: its light comes up over half of its half
          // breadth, and from a third of its height it thins away to four tenths at its tip: it stands up
          // plainly against the dark crust behind it)
          dT = max(dT, dk); bT = max(bT, smoothstep(-.05, .5 / (1. + .8 * red), dk + eat) * (1. - .6 * smoothstep(.35, 1., q.y / hb))); tT += max(1. - length((q - c) / rr) + eat * 1.5, 0.) * (1. - a) * (1. - a) * tK; }
        float bedTop = bedH * (.7 + .6 * nA(vec2(xm * .11 + sd * 3., uTime * .35 + sd))) * (1. + 1.4 * eat), bd = clamp(1. - ym / max(bedTop, 1e-3), 0., 1.);
        float fl = nB(vec2(xm * .16 + sd * 3., ym * .5 + sd * 9. + uTime * .2)), streak = nA(vec2(xm * .35 + sd, ym * .25 - uTime * 1.1));
        float fringe = smoothstep(-.3, .1, dT + eat) * (1. - bT) * (1. - red); tT *= 1. - .7 * red;
        float light = max(bT, sqrt(bd)), hid = min(light * (1. + 9. * red), 1.);
        // (the tongues are the body's deep blue, brightest where they leave the bed; THE FEET ARE BRIGHT: the bed's
        // lowest third is azure and its foot line pale)
        vec3 col = FIRE_FRINGE * (.45 * fringe + .9 * (hid - light)) + FIRE_BODY * (min(max(bT, .85 * sqrt(bd)) + .5 * tT, 1.) * (1.35 + .4 * streak + .3 * bd)) + FIRE_INNER * min(bd * 1.5 + .5 * tT, 1.)
          + FIRE_HEART * (bd * bd * bd * (.25 + .5 * fl * fl) * .9 * (.75 + .25 * streak));
        float k = lit * (1. - smoothstep(.85, 1., abs(uv.x) / Qs)) * (1. - smoothstep(.93, 1., uv.y)); col *= k;
        col = mix(col, vec3(.5, .55, .8) * dot(col, vec3(.1, .3, .4)), pale);
        return vec4(col, FIRE_HIDES * min(hid + .8 * tT + .4 * fringe, 1.) * k * (1. - pale)); }
      void main(){
        // (the tongue bends down the wind inside its sheared sheet: its middle line stands lx y (1 - y) half
        // breadths from the sheet's own; every tongue is turned left or right by its seed; a hotter tongue's heart
        // is broader, taller and brighter; its light dies away toward the sheet's sides)
        float y = vUv.y, sd = vS.x, flip = fract(sd * 91.7) < .5 ? -1. : 1.;
        if (vT.z < 0. && vT.x > .5) {
          // A SLICK: FIRE ALONG THE EDGES OF THE CRUST AFLOAT, AND ITS GLOW ON THE WATER. Not a sheet over the
          // whole: the crust stays dark and is seen. A slow field of the place on the water (W: the same for
          // every slick, so slick over slick the lines run on) parts crust from water in lobes a metre and a
          // half to three across, slowly changing: along that parting runs THE RIM, a thin bright line of low
          // flame a third of a metre across, electric blue, pale along its very middle, flickering along
          // itself; on the crust's side finer lines of the same fire follow its cracks; on the water's side lies
          // a deep blue glow, strongest against the rim. It hides what lies under it only along the lines
          // (nine tenths there), three tenths beside them and a tenth over the water: never a pale haze.
          vec2 W = vS.zw; float r = length(vUv), n1 = nR(W * .085 + vec2(uTime * .012, 0.)), n2 = nG(W * .21 - vec2(uTime * .05, uTime * .03));
          float f = .62 * n1 + .38 * n2 - .5, edge = smoothstep(0., .35, 1. - r - (n2 - .5) * .5) * vS.y;
          float rim = 1. - smoothstep(.02, .07, abs(f)), near = 1. - smoothstep(0., .22, abs(f)), wet = smoothstep(0., -.06, f);
          float cr = nB(W * .12 + vec2(uTime * .02, -uTime * .015) + (n2 - .5) * .25); cr *= cr;
          float fk = .55 + .45 * nA(vec2(W.x * .31 + W.y * .17, W.y * .29 - W.x * .13 + uTime * .4)), ln = max(rim, .7 * smoothstep(.55, .85, cr) * (1. - wet)) * fk;
          vec3 c = (FIRE_BODY * (1.75 * ln + (.34 * near + .16 * wet) * (1. - ln)) + FIRE_INNER * ln + FIRE_HEART * (.3 * rim * rim * fk)) * edge;
          gl_FragColor = vec4(mix(c, vec3(.5, .55, .8) * dot(c, vec3(.1, .3, .4)), uFlame.y), FIRE_HIDES * (.9 * ln + (.3 * near + .1 * wet) * (1. - ln)) * edge * (1. - uFlame.y)); }
        else if (vT.z < 0.) {   // (a halo: pure blue light added to what is behind it, strongest at its middle, nothing at its rim)
          float k = max(1. - dot(vUv, vUv), 0.); vec3 c = vec3(0., .16, .9) * (vS.y * k * k);
          gl_FragColor = vec4(mix(c, vec3(.5, .55, .8) * dot(c, vec3(.1, .3, .4)), uFlame.y), 0.); }
        // (its foot is soft and round: its light comes in from nothing over the lowest tenth of its height at its
        // middle line, and over three tenths more at one half breadth aside: a tongue that stands on the lip of a
        // step is seen from below, and a sheet's straight lower edge is a hard level cut there)
        else if (vS.w > .2 * vS.z) gl_FragColor = frontLight(vUv, sd, vS.z, vS.w, vT.y, min(vS.y, 1.), uFlame.y, vT.z, vRed) * smoothstep(0., .06, y);   // (a front: see the build's A FRONT OF FIRE)
        else { vec2 p = vec2((vUv.x + vT.x * y * (1. - y)) * flip, y); float edge = 1. - smoothstep(.7, 1., abs(vUv.x) / vT.z);
          vec4 t0 = tongueLight(p, sd, vS.z, vS.w, vT.y, step(1.2, vS.y), min(vS.y, 1.), uFlame.y, edge, vRed);
          // (A TONGUE OF A COURSE (told on as 1.1) IS A KNOT OF A RUN: beside it, in the same sheet, stand two
          // lower tongues of the one law, six tenths as broad, the one 0.42 to 0.67 of its height and the other
          // 0.36 to 0.66, each on a round of its own, their feet 0.8 of a half breadth to either side; the
          // tall one is laid over them. Knot beside knot, a metre apart or less, they are one run of fire.
          // Their feet come in over the lowest tenth of the sheet, a little more toward its sides)
          if (vS.y > 1.05 && vS.y < 1.15) { float ra = .42 + .25 * fract(sd * 17.3), rb = .36 + .3 * fract(sd * 29.1);
            vec4 t1 = tongueLight(vec2((p.x - .78) / .62, p.y / ra), sd + .37, vS.z * ra, vS.w * .62, vT.y, 0., 1., uFlame.y, edge, vRed);
            vec4 t2 = tongueLight(vec2((p.x + .8) / .58, p.y / rb), sd + .71, vS.z * rb, vS.w * .58, vT.y, 0., 1., uFlame.y, edge, vRed);
            t1 += t2 * (1. - t1.a); gl_FragColor = (t0 + t1 * (1. - t0.a)) * smoothstep(0., .1 + .1 * vUv.x * vUv.x, y); }
          else gl_FragColor = t0 * smoothstep(0., .1 + .3 * vUv.x * vUv.x, y); }
        gl_FragColor.rgb = gl_FragColor.rgb * vAir.a + vAir.rgb * gl_FragColor.a;   // (seen through the bowl's air, taken at the tongue's own place)
      }`})}function vt(D){return new M.ShaderMaterial({uniforms:D,transparent:!0,depthWrite:!1,side:M.DoubleSide,fog:!1,...tt,vertexShader:`
      attribute vec4 aT, aU, aD, aF; uniform float uTime, uPx; uniform vec4 uWind; uniform vec2 uFlame, uBay;
      ${$e}
      ${Ye}
      varying vec4 vC, vAir, vF; varying float vH, vRed, vFar; varying vec3 vP, vN, vB, vE, vR; varying vec2 vUp;
      void main(){
        vRed = moltenAt(position);   // (how near molten sulphur its foot stands: for its edge, see the tongue's law)
        float y = aT.w, on = aU.w < 0. ? 1. : .55 + .45 * pourBurn(aU.w);
        // (vFar: 1 on a wall's seam and on a fall of fire, whose ribbon is a stroke turned to the eye's place, nought
        // on every other line: see below; such a line's flame is taken even along it, by aD's fourth number)
        vec3 toE = cameraPosition - position; float dE = length(toE); vFar = min(aF.y, 1.);
        vec3 T = aT.xyz * (uFlame.x * on * mix(1., aD.w, vFar)); float h = length(T);
        // (a filter by the pixel's footprint: a burning ground line's ribbon is never drawn lower than six pixels at
        // its distance from the eye's place. A TURNED STROKE IS NOT MADE TALLER: its fire keeps its own metres at
        // every distance, and only its sheet is kept two and a half pixels to either side, for its soft edge to lie
        // in: what is thinner than a pixel is the fainter by as much, so a far seam is a thin faint line and a far
        // fall a blue body, neither a block of light)
        T *= mix(max(1., 6. * dE * uPx / max(h, .02)), 1., vFar) * step(1e-4, h); h = length(T);
        vec2 q = position.xz - uBay; float east = clamp(((q.x - q.y) * .7071 + 78.) / 120., 0., 1.);
        vec2 wd = mix(uWind.zw, uWind.xy, windLean(east));
        float sway = .1 * sin(uTime * 1.3 + aU.x * .7 + aU.y * 40.);
        // (A WALL'S SEAM AND A FALL OF FIRE ARE STROKES ABOUT THEIR LINE, TURNED TO THE EYE'S PLACE. A sheet that
        // stands out from the wall is seen from across the bowl along its thin way, as hairs, and from beside it as
        // a card standing off the rock. So the sheet lies across the line of sight about the line's own run (aD),
        // the line down its middle, bh to either side: 1.1 of the flame's height on a seam (the fire's own reach is
        // far less: see the fragment's law; the rest is for its light on the rock), 1.45 on a fall of fire (whose
        // own body reaches 1.3 at the most: the air the world keeps clear about it; and as far as the fall's next
        // line where the fall is filled: below), and never under two and a half pixels. IT LIES IN THE ROCK'S FACE: its corners are not moved toward the eye; only its depth is taken
        // a little nearer the eye's place (how far: below), so that the rock it lies in does not cut it and it
        // does not shift against the rock as the eye goes by.
        // THIS READS THE EYE'S PLACE, as a tongue's sheet does. vUp.x: how far the sheet's one side is the upper
        // one, -1 to 1: nought on a line that runs straight down, more on one that runs aslant: fire rises.
        // vUp.y: how much of the line's length the eye sees: 1 from broadside, nought looking along it.)
        float bh = max(mix(1.1, 1.45, smoothstep(3.5, 4., aF.y)) * h, 2.5 * dE * uPx) * step(1e-4, h);
        vec3 ac = cross(aD.xyz, toE);
        // (A FALL IS FILLED FROM LINE TO LINE: fl, the metres the body reaches toward the fall's next line on the
        // one side of the stroke and on the other: the build's two reaches (in aU's first number; see there),
        // by how much of the fall's breadth the eye sees from where it stands; the sheet is broad enough for them)
        // (vE: how far the fall's two sides stand from the line's point, metres across the fall, the one against
        // the plane's level way and the one along it (the build's: aF's third number, see there); and how much
        // of the fall's breadth the eye's place sees across the stroke: A SIZE WITH NO SIGN, never taken under
        // 0.15 at any point, so between two points it never comes near nought; it serves the fill's reach, how
        // far a side may be let out and the softening of the fall's sides. A stroke with no fall's plane stands
        // deep inside.
        // WHICH OF THE STROKE'S TWO SIDES LIES ALONG THE LEVEL WAY CHANGES ALONG A LINE: where its run passes the
        // level way as the eye's place sees it (a line that runs along a ledge, an end carried across one) the
        // sheet stands over and under the line and neither side is the one along the level way. There the
        // fill's two reaches change places, both small. And the place across the fall is worked out from no
        // side: vR is the way from the line's point to this corner of the sheet, and the fragment's law carries
        // it on along the line from the eye's place to the fall's plane: see the fall's sides there.
        // A RUN-OUT (the build's number below nought) has no side in the fall's count: its two distances are 240,
        // the mark by which the fragment's law leaves it the torn edge of a line alone)
        vec2 fl = vec2(0.); vE = vec3(60., 60., 1.);
        if (aF.y > 3.75 && abs(aF.x) < 1e8) { float ca = dot(ac, normalize(vec3(-aT.z, 0., aT.x) + vec3(1e-6, 0., 0.))) / max(length(ac), 1e-3 * dE);
          fl = vec2(floor(aU.x) / 32., fract(aU.x) * 25.) * (abs(ca) * step(1e-4, h)); vE = vec3(floor(aF.z) / 8., fract(aF.z) * 64., max(abs(ca), .15));
          if (aF.z < 0.) vE.xy = vec2(240.);
          if (ca < 0.) fl = fl.yx; bh = max(bh, 1.25 * max(fl.x, fl.y)); }
        vec3 turned = ac * ((2. * y - 1.) * bh / max(length(ac), 1e-3 * dE)); vUp = vec2(ac.y / max(length(ac), 1e-3 * dE), length(ac) / max(dE, 1e-3)); vR = turned;
        vec3 pos = position + mix(T * y + vec3(wd.x, 0., wd.y) * (y * y * h * (.22 + sway)), turned, vFar);
        // (vN: the sheet's face there: across the line's run and the flame's way; on a turned stroke the way the build
        // gave it, which on a fall of fire is the normal of the fall's own plane; vB: a turned stroke's half breadth, metres)
        vC = vec4(aU.x, y, aU.y, aU.z * (.4 + .6 * on)); vH = max(h, .05); vP = pos; vF = aF; vN = vFar > .5 ? aT.xyz : cross(aD.xyz, T / max(h, 1e-3)); vB = vec3(bh, fl);
        gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.); vAir = airAt(pos);
        // (a seam's depth is taken three tenths of its flame's height nearer, 1.2 m at the most: it is a narrow fire
        // and stays behind every nose of rock that stands before its crack; a fall's, by its half breadth, to 6 m)
        if (vFar > .5) { vec4 cn = projectionMatrix * viewMatrix * vec4(pos + toE * (mix(min(.3 * h, 1.2), min(bh, 6.), smoothstep(3.5, 4., aF.y)) / max(dE, 1e-3)), 1.); gl_Position.z = cn.z * gl_Position.w / cn.w; }
      }`,fragmentShader:`
      uniform float uTime; uniform vec2 uFlame;
      ${je}
      ${st}
      uniform float uPx;
      varying vec4 vC, vAir, vF; varying float vH, vRed, vFar; varying vec3 vP, vN, vB, vE, vR; varying vec2 vUp;
      void main(){
        float y = vC.y, sd = vC.z, ym = y * vH;
        if (vFar > .5) {
          // THE TURNED STROKE: FIRE IN A CRACK, AND FIRE THAT FALLS. All of it is in true metres about the line
          // (ymS: the metres out from the line; side: which side; fwm: the metres a pixel covers across it), the
          // same from every distance: what a pixel cannot hold is not made larger, it is the fainter.
          // mark: 1 on a low seam, to 5 where the flame stands tall (a fall of fire is 4 at the least; tall: 1 on one).
          // ITS BODY reaches wb to either side. A SEAM IS NARROW, fire in a crack: three tenths of its flame's
          // height, and never more than 0.45 m and a tenth of that height, however far the flame stands out from
          // the wall: a broad stroke stands off the face and makes a squiggle of every bend of the crack. A fall is
          // a broad sheet: nine tenths of its flame's height. Its edge swells and draws in in slow
          // lobes of some 3 m, each side's its own, and is torn into tongues half a metre broad that lean up the
          // rock and climb it on the world's clock (uu: the line's metres taken the further up the further out).
          // Lines that lie close run into one body: each is laid over the others as a tongue is, and none adds.
          // (us: the line's metres as they travel with the sulphur; on a fall of fire the world's own height, falling at 6 m a second)
          float mark = max(vF.y, 1.), tall = smoothstep(3.5, 4., mark), hR = vH * (.3 + .7 * min(vC.w, 1.)), us = tall > .5 ? vP.y + 6. * uTime : vF.z - vF.x * uTime;
          // (ON A FALL'S STROKE THE METRES OUT FROM THE LINE ARE THE SHEET'S OWN: the length of the way from the
          // line's point to this spot (vR). Where a line's run passes the line of sight between two points (it
          // runs out over a ledge toward an eye that stands below) the sheet about it turns over within that one
          // piece, and its one edge crosses the line; told off by the place, the fire is whole about the line
          // there too, and only the sheet's own edge fades. A seam's are its sheet's own count)
          float side = y > .5 ? 1. : -1., ymS = vF.y > 3.75 ? length(vR) : abs(2. * y - 1.) * vB.x, fwm = max(fwidth(ymS), 1e-4), wb = mix(min(.3 * hR, .45 + .1 * hR), .9 * hR, tall), a = ymS / max(wb, 1e-3);
          // (on a fall the tongues are a metre broad, lean less and tear the edge half as deep, and the edge is softer:
          // a line of a fall alone is a soft body of fire, not a spine with barbs)
          // (fs: how much of the line's length the eye sees. A tongue told off in the line's own metres is drawn thin
          // as a hair where the eye looks along the line: so the tearing of the edge is taken the coarser along
          // the line by as much, in steps of two that pass into one another, and keeps its breadth to the eye)
          float dn = vF.x < 0. ? -1. : 1., uu = vF.z + dn * (ymS * mix(1.2, .5, tall) + uTime * .5), fs = clamp(vUp.y, .125, 1.), oc = -log2(fs), fo = exp2(-floor(oc)) * mix(.22, .11, tall);
          float lobe = nR(vec2(us * .045 + sd * 5.3 + side * 3.1, sd * 3. + uTime * .03));
          float lick = mix(nG(vec2(uu * fo + sd * 7. + side * 5., a * .7 - uTime * .35 + sd)), nG(vec2(uu * fo * .5 + sd * 7. + side * 5., a * .7 - uTime * .35 + sd)), fract(oc));
          // (A FALL'S EDGE IS TORN INTO TONGUES THAT RISE: told off in the world's own height, 0.7 m broad and some 2 m
          // tall, they climb at 3.5 m a second while the fire falls behind them, and where one stands clear of the
          // edge it has let go)
          lick = mix(lick, nG(vec2(side * ymS * .18 + sd * 7., vP.y * .057 - uTime * .2 + sd)), tall);
          // (FIRE RISES: on a line that runs aslant, as down a slope at a fall's foot or along a slanting crack, the
          // side of the stroke that is the upper one (su: by how much, as the eye sees it) reaches up to 1.45 times
          // as far and is torn up to 1.8 times as deep; the lower side draws in to a third: a bed with
          // flames standing up from it, not a blade lying along the slope. A fall's body is the fuller)
          // (from near the edge is torn deeper and stands crisper: nr, all of it where a pixel covers under a fiftieth
          // of the reach, none from an eighth)
          float su = side * vUp.x, rs = 1. + (su > 0. ? .45 : .65) * su, nr = 1. - smoothstep(.02, .125, fwm / max(wb, 1e-3));
          // (and on a side on which the fall's next line stands the body reaches toward it, as far as the build
          // counted: there it is filled, not torn. The lower side of a fall's line that runs aslant has no edge:
          // it dies away from the line outward)
          // (a stroke of a fall that has a plane reaches its whole way on a side with no next line: the fall's
          // sides are torn by the fall's own law, on its plane: below. A RUN-OUT, which the fall's count of its
          // sides leaves out (vE's first number is 240 on it), is not torn by that law: it keeps the torn edge
          // a line alone has, its lobes and its tongues, and is no straight band beside the torn body)
          float topM = max(wb * rs * mix(clamp(mix(.28, .42, tall) + mix(.5, .45, tall) * lobe + (lick - .5) * mix(.7, mix(.35, .8, nr), tall) * (1. + .8 * max(su, 0.)), .06, 1.), 1., step(3.75, vF.y) * step(vF.y, 4.7) * step(abs(vF.x), 1e8) * step(vE.x, 200.)), side > 0. ? vB.z : vB.y), soft = max(fwm * 1.5, mix(.4, mix(mix(.65, .35, nr), 1., max(-su, 0.)), tall) * topM), body = smoothstep(0., soft, topM - ymS);
          // (gr: how far out toward its edge a place lies, 0 at the line, 1 at the edge: the fire is brightest and
          // azure along its line and a deep blue toward its torn edge)
          float gr = clamp(ymS / max(topM, 1e-3), 0., 1.);
          // (IN IT THE FIRE FALLS: long streaks, some 10 m by an eighth of the body's reach, and finer ones of 4 m,
          // run down the line at the sulphur's speed: deep electric blue between them, bright on them, brightest
          // where the fall breaks (brk: knots a metre and a half long). Where a pixel covers more than a streak's
          // breadth the streaks are taken at their mean: from afar they are never a sum of bright lines or of spots.
          // And the whole body surges: slow swells some 15 m long that go down with the fire, by a third darker
          // and a quarter brighter: these a far eye still sees fall)
          float st = .55 * nR(vec2(a * 1. * side + sd * 3.3, us * .012 + sd)) + .45 * nG(vec2(a * 2. * side + sd * 9.1, us * .03 + sd * 2.));
          st = mix(st, .5, smoothstep(.03, .12, fwm / max(wb, 1e-3))); float brk = nB(vec2(us * .09 + sd * 5.3, uTime * .11 + sd * 3.)); brk *= brk;
          float surge = .6 + .5 * nR(vec2(sd * 3.7 + a * side * .04, us * .008 + sd * 5.));
          // (THE CRACK'S OWN LINE: a thin pale thread down the middle, six hundredths of the reach to either side:
          // strong in a low seam, faint in a fall, whose many lines would else stand as a comb; thinner than a
          // pixel it is the fainter by as much, and so are all the far ones together: no white column.
          // THE LIGHT ON THE ROCK to both sides dies away over a third of the flame's height, 0.3 m at the least,
          // and is the fainter where a pixel covers more than that.
          // hot: AT ITS HEAD AND WHERE IT BREAKS over a ledge the fire burns hottest: its body a quarter brighter,
          // and on a fall its pale thread up to four times as broad and three times as strong)
          float hot = max(vF.w, 0.), am = 0., drp = step(4.7, vF.y), hc = max(.06 * wb, .03) * (1. + 3. * hot * tall), core = (1. - smoothstep(.3 * hc, hc, ymS)) * min(1., hc / fwm) * mix(.85, mix(.15 + .3 * hot, .5, drp), tall);
          float hs = max(.35 * hR, .3), halo = exp(-ymS / hs) * min(1., hs / (2. * fwm)) * (1. - .7 * body);
          // (A SHORT STRAND THAT HANGS AND LETS GO (the build's mark of it: 5): whole where it holds to the rock, at its
          // head, it breaks up as it falls: toward its lower end it is drops of fire, half a metre long and less,
          // that fall at 5 m a second with gaps between them. Its light is the crack's law's, not the broad fall's: a
          // pale thread down its middle, streaks that run down it, a deep blue toward its edge; an eighth dimmer)
          float dr = mix(1., smoothstep(.42, .6, nG(vec2(sd * 9., (vP.y + 5. * uTime) * .2))), drp * smoothstep(.15, .9, 1. - hot)) * (1. - .125 * drp);
          float kk = smoothstep(0., .25, vC.w) * (1. - smoothstep(.85, 1., abs(2. * y - 1.))) * dr, hid = min(body * (1. + 9. * vRed), 1.);
          vec3 sc = (FIRE_BODY * (body * (.95 + .7 * st + .2 * brk) * surge * (1. + .25 * hot) * mix(1.2, .75, gr * nr) + .25 * halo) + FIRE_FRINGE * (.9 * (hid - body)) + FIRE_INNER * (body * mix(st, 1.5 * (1. - gr), nr)) + FIRE_HEART * core) * kk;
          // A FALL OF FIRE IS ONE BODY. The light inside a fall's stroke is told off BY THE PLACE in the world, not by
          // the stroke: where the strokes of lines that lie close cover one another they show one and the same
          // fire, and no line's own middle or edge stands in it as a stripe. In it the fire falls in sheets,
          // threads and hollows of unlike breadth and speed (the grain: below); deep blue between the sheets,
          // electric blue on them. AT ITS HEAD, ON A LEDGE AND WHERE IT LANDS ON ONE (hot) the deep blue between
          // its sheets is filled: the fire is bright all across and azure, and only there do the crests of its
          // sheets turn pale. From afar the noise's own filter leaves the mean.
          // (Q: THE PLACE the fire is told off at: where the line from the eye's place through this spot of the
          // stroke meets the fall's own plane (vN, and vF.x: the build's). The strokes of a fall stand at unlike
          // depths, each turned to the eye's place about its own line; told off on the one plane they show the
          // same fire wherever they cover one another, from wherever the eye stands. THIS READS THE EYE'S PLACE.
          // The place is never taken nearer than half nor further than twice the stroke's own distance; a fall
          // too small to have a plane is told off at the stroke's own spot)
          // (cA: the place's metres across the fall, along the plane's level way; its height is the world's own)
          // (off: HOW FAR ACROSS THE FALL THIS SPOT LIES FROM ITS LINE'S POINT, metres along the level way, with
          // its sign: the way from the line's point to this spot of the sheet (vR), carried on along the line
          // from the eye's place until it lies in the plane's own ways through that point. It is worked out
          // from places, not from which side of the stroke the spot is on, so it runs on unbroken where a
          // line's run passes the level way and the stroke's sides change places. The line from the eye's
          // place is taken to stand at least 0.15 of its length out of the plane: nothing is divided by less)
          if (tall > .5 && drp < .5) { vec3 Q = vP, tP = vec3(.7071, 0., .7071); float off = 0.;
            if (abs(vF.x) < 1e8) { vec3 nP = vN / max(length(vN), 1e-6), ray = vP - cameraPosition; float den = dot(nP, ray), dg = max(abs(den), .15 * length(ray)) * (den < 0. ? -1. : 1.); den = abs(den) < 1e-3 ? 1e-3 : den;
              Q = cameraPosition + ray * clamp((vF.x - dot(nP, cameraPosition)) / den, .5, 2.); tP = normalize(vec3(-nP.z, 0., nP.x) + vec3(1e-6, 0., 0.));
              off = dot(vR, tP) - dot(vR, nP) * dot(ray, tP) / dg; }
            float cA = dot(Q, tP), Y1 = Q.y + 4.5 * uTime, Y2 = Q.y + 9.5 * uTime, Y3 = Q.y + 15. * uTime, Y4 = Q.y + 7.5 * uTime;
            // (THE FIRE'S OWN GRAIN, four things at four speeds, all told off on the plane. BROAD SLOW SHEETS,
            // some 6 m across and 30 m long, at 4.5 m a second, whose folds wander from side to side by a metre
            // and a half as they go; finer ones of a metre by 10 m at 9.5 over them. FAST BRIGHT THREADS, a
            // third of a metre by some 3 m, at 15 m a second, few, and brightest where they run through a sheet. DARKER HOLLOWS, some
            // 6 m across and 14 m tall, soft, that travel down at 7.5 m a second: in one the fire is six tenths
            // as bright and deep blue. Slow swells go down through all of it)
            float sh = nR(vec2((cA + 3. * (nG(vec2(cA * .011 + .7, Y1 * .004)) - .5)) * .022, Y1 * .0045)), fi = nG(vec2(cA * .11 + .11, Y2 * .012));
            float fl = smoothstep(.32, .68, .65 * sh + .35 * fi), sw = nR(vec2(cA * .012 + .5, Y1 * .0045 + .37));
            float thr = smoothstep(.6, .8, nA(vec2(cA * .33 + .21, Y3 * .014))) * (.3 + .7 * fl);
            // (hq: WHERE THE FIRE STRIKES A LEDGE AND AT ITS HEAD it is the brightest and the most broken: the
            // build's hot reach (each line's own length of it) is broken into knots under a metre across and
            // 2 m tall that fall at 3 m a second and boil; a hot place has no hollow)
            float hq = clamp(hot * (.35 + 1.3 * nB(vec2(cA * .16 + 2.3, (Q.y + 3. * uTime) * .07 + uTime * .15))), 0., 1.);
            float hol = smoothstep(.55, .9, nB(vec2(cA * .022 + .4, Y4 * .0095))) * (1. - hq);
            // (THE FALL'S SIDES ARE TORN. dEd: how far inside the fall's nearer side this place lies, metres
            // across the fall (below nought: outside its outermost line): the build's two distances from the
            // line's point and off, this spot's own place across the fall from that point (above). The share
            // of the fall's breadth the eye's place sees across the stroke (vE's third number: a size with no
            // sign, 0.15 at the least at every point) only sets how far the side may be let out and how soft
            // it is. THIS READS THE EYE'S PLACE, as the fill does. tin: how far the side
            // stands drawn in at this height (or, below nought, how far out the fire may reach): each side
            // wanders in and out in great lobes some 20 m tall that sink at 1.5 m a second and breathe, drawn
            // in by up to three tenths of the fall's breadth there, 7 m at the most, and let out by up to 4 m
            // and never by more than three tenths of the stroke's own reach; on them swells of 7 m of height,
            // 2 m in and out, and small tongues of 0.65 m by 3 m, that climb at 1.2 and at 3.5 m a second
            // while the fire falls behind them (on a narrow fall both are the less, by its breadth: kT). Those
            // two are the plane's, not the side's: fire stands out beyond a place that is drawn in, and
            // strands leave the body and come back to it. A fill between two bodies of one fall is torn by the
            // same law. IT IS THIS LAW AND NOT A STROKE'S STRAIGHT REACH THAT ENDS THE FIRE AT A SIDE: the lobe
            // and the swell together never let the side out further than 0.85 of what this stroke reaches past
            // that side (rT: its reach across the fall less its line's distance from the side), less the
            // tongues' depth; so the tongues, laid on last, tear the edge inside the sheet at every height, and
            // no stretch of a side stands as the straight soft end of a stroke)
            if (abs(vF.x) < 1e8) { float dL = vE.x + off, dR = vE.y - off, dEd = min(dL, dR);
              float big = clamp((nR(vec2(dL < dR ? .21 : .58, (Q.y + 1.5 * uTime) * .0065 + uTime * .004)) - .5) * 3. + .5, 0., 1.);
              float kT = clamp((vE.x + vE.y) / 12., .35, 1.), rT = wb * rs / vE.z - (dL < dR ? vE.x : vE.y);
              float tin = max(min(7., .3 * (vE.x + vE.y)) * smoothstep(.5, .9, big) - min(4., .3 * wb * rs / vE.z) * (1. - smoothstep(.1, .5, big)) + (smoothstep(.3, .7, nG(vec2(cA * .02 + 1.9, (Q.y - 1.2 * uTime) * .02))) - .5) * 4. * kT, -max(.85 * rT - 1.3 * kT, 0.))
                + (nG(vec2(cA * .2 + 4.4, (Q.y - 3.5 * uTime) * .045)) - .5) * 2.6 * kT;
              kk *= smoothstep(-max(1.5 * fwm / vE.z, .5), 0., dEd - tin); }
            sc = (FIRE_BODY * (body * ((mix(.42, 1.15, hq) + (1.35 - .5 * hq) * fl * (.6 + .4 * sw)) * (1. - .4 * hol) + .55 * thr) + .25 * halo) + FIRE_FRINGE * (.9 * (hid - body))
              + FIRE_INNER * (body * (fl * (.15 + 1.2 * hq) * (1. - hol) + .6 * hq + .5 * thr)) + FIRE_HEART * (body * (hq * (.1 + .35 * smoothstep(.5, 1., fl)) + .1 * thr))) * kk;
            // (ITS FOOT STANDS IN ITS OWN LIT MIST: where the build says the fall lands (vF.w below nought: how deep
            // in the mist) the stroke bears, before its fire, the spray the fall throws up, lit by the fire: soft
            // billows some 6 m and 2.5 m across that climb at 1.5 m a second, told off on the fall's plane as the
            // fire is, thick at the foot and torn into the air above it, dying away toward the stroke's sides;
            // the fire is seen through it the fainter the thicker it stands. am: how much of what lies behind
            // the mist hides, eight tenths at the most)
            float mist = max(-vF.w, 0.), bw = .6 * nR(vec2(cA * .02 + 3.7, (Q.y - 1.5 * uTime) * .02)) + .4 * nG(vec2(cA * .05 + 1.3, (Q.y - 1.5 * uTime) * .05));
            am = .65 * smoothstep(0., .5, mist * 1.3 + (bw - .5) * .9 - .15) * (1. - smoothstep(.25, 1., ymS / max(vB.x, 1e-3))) * kk * smoothstep(0., 1., vC.w);
            sc = sc * (1. - am) + (FIRE_BODY * .34 + FIRE_HEART * .05) * ((.5 + bw) * am); }
          sc = mix(sc, vec3(.5, .55, .8) * dot(sc, vec3(.1, .3, .4)), uFlame.y);
          // (the glow on the rock hides a fifth of what lies behind it at the most, as glare does: the rock's own beds show through it)
          gl_FragColor = vec4(sc, FIRE_HIDES * (min(hid + .2 * halo, 1.) * kk * (1. - am) + am) * (1. - uFlame.y));
          gl_FragColor.rgb = gl_FragColor.rgb * vAir.a + vAir.rgb * gl_FragColor.a;   // (seen through the bowl's air)
          return; }
        // (A GROUND LINE'S RIBBON, from here on: ym, the metres up from its foot)
        // (the eye's place is read for shading: a sheet of gas seen edge-on is seen through its thin way and shows
        // nothing: nothing within six degrees of its own plane, and it comes up as it turns its face to the eye,
        // whole from twenty-six degrees: a sheet seen so steeply is a blade, not a flame. Its face is the one
        // across its line's run and its flame's way (vN), even from point to point; a sheet whose flame lies along
        // its own line has no breadth, and shows as much the less)
        float dist = length(cameraPosition - vP), facing = smoothstep(.1, .44, abs(dot(vN, cameraPosition - vP)) / (max(length(vN), .3) * dist));
        // (farK, the pixel's footprint: the bed's tongues begin to run together where a pixel covers more than 0.08 m
        // at the ribbon's distance, and are one stroke from 0.26 m)
        float farK = smoothstep(.08, .26, dist * uPx), hR = vH * (.3 + .7 * min(vC.w, 1.));
        // (us: the line's metres as they travel with the sulphur; run: how hard it runs; ub: the same, drawn
        // down-stream with the height, so what stands on running sulphur leans down-stream)
        float run = smoothstep(1., 4.5, abs(vF.x)), us = vF.z - vF.x * uTime;
        float slow = nR(vec2(us * .045 + sd * 5.3, sd * 3. + uTime * .03)), crest = nB(vec2(us * .09 + sd * 5.3, uTime * .11 + sd * 3.));
        // THE FRONT OF FLAME, one law by the pixel's footprint, laid over what is behind it as a tongue is. From
        // near it is THE BED, a low bright sheet 0.3 to 0.8 m high along the whole line, brightest at its foot,
        // whose crests run down the line at the sulphur's speed; and A ROW OF TONGUES rooted in it, one to every
        // 1.6 m of the line, each a lick of the one law (lickD) with a height and a bend
        // of its own, climbing and tearing off at its tip on a round of its own. On running sulphur they ride
        // down the line at a third of its speed and are drawn down-stream with their height.
        // From afar it is THE STROKE: one ragged body with slow knots. Between the two it passes smoothly.
        float bedH = min((.3 + .35 * slow) * (1. + .4 * run), .45 * hR) * smoothstep(0., .3, vC.w);
        // (the row is told off in true metres along the ribbon's feet, vF.z: the world's own count of a line is not in metres everywhere)
        float cw = 1.6, tH = min(hR * .95, 3.), dT = -9., bT = 0., hT = 0., tT = 0.;
        float xs = (vF.z - vF.x * uTime * .35 - sign(vF.x) * ym * (.15 + .3 * run)) / cw, ci = floor(xs + .5);
        float eat = (nG(vec2(us * .2 + sd * 7., ym * .45 - uTime * .9)) - .5) * .5;
        // (each tongue's own numbers are told off from whole numbers: its place in the row and the ribbon's seed in thousandths)
        for (int k = -1; k <= 1; k++) { float cj = ci + float(k), h1 = fract(sin(mod(cj, 1024.) * 12.9898 + floor(sd * 997.) * 4.1414) * 43758.5453), h2 = fract(h1 * 57.31);
          float a = fract(uTime * (.5 + .5 * h2) + h1 * 9.), hb = mix(.66, 1., pow(a, .7));
          float hg = max(tH * (.5 + .5 * h1) * (.7 + .3 * slow), .05), wT = min(.18 + .2 * hg, cw * .5);
          vec2 q = vec2((xs - cj - (h2 - .5) * .5) * cw / wT, (ym - bedH * .4) / hg);
          float dk = lickD(q, 0., (h1 - .5) * .8, .8, hb, 1.4 + .8 * h2, h1 * 40., hg, 1.);
          vec2 c = vec2((h1 - .5) * .8 * mix(.8, 1.1, a), mix(.9, 1.22, a)), rr = vec2(.32 - .16 * a, .2 - .08 * a);
          dT = max(dT, dk); bT = max(bT, smoothstep(0., .38 / (1. + .8 * vRed), dk + eat)); tT += max(1. - length((q - c) / rr) + eat * 1.5, 0.) * (1. - a) * (1. - a);
          hT = max(hT, smoothstep(0., .16, lickD(q, 0., (h1 - .5) * .4, .16, hb * .62, 1.2, h1 * 40., hg, 1.) + eat * .15)); }
        // (the bed: its top rises and sinks along the line; its light falls from its foot to nothing at its top,
        // and bright crests run through it down the line)
        // (its top is torn into small licks by the same noise that eats the tongues)
        float bedTop = bedH * (.7 + .6 * nA(vec2(us * .11 + sd * 3., uTime * .35 + sd))) * (1. + 1.4 * eat), bd = clamp(1. - ym / max(bedTop, 1e-3), 0., 1.);
        float fl = nB(vec2(us * .16 + sd * 3., ym * .5 + sd * 9.)), streak = nA(vec2(us * .35 + sd, ym * .25 - uTime * 1.1));
        float fringe = smoothstep(-.3, .1, dT + eat) * (1. - bT) * (1. - vRed); tT *= 1. - .7 * vRed;
        // (the same light as a tongue's: the body never more than one body's; the heart a thin line up each tongue of
        // the row, and thin bright crests low along the bed's foot)
        // (hidN: how much the near front hides; what its edge hides beyond its own light by molten sulphur it gives the fringe's deep blue, as a tongue does)
        float lightN = max(bT, sqrt(bd)), hidN = min(lightN * (1. + 9. * vRed), 1.);
        vec3 nearC = FIRE_FRINGE * (.45 * fringe + .9 * (hidN - lightN)) + FIRE_BODY * (min(max(bT, .85 * sqrt(bd)) + .8 * tT, 1.) * (1.5 + .45 * streak)) + FIRE_INNER * min(smoothstep(.22, .55, dT + eat) + .5 * tT, 1.)
          + FIRE_HEART * (max(hT, bd * bd * bd * fl * fl) * .9 * (.75 + .25 * streak));
        // (the stroke: its top soft over a third of its height, its thin bright core along its foot, a seventh of
        // its height, spread over the pixel when it is thinner than one)
        float top = min(hR * (.24 + .3 * slow + .46 * crest * crest), vH * .92);
        float fw = fwidth(ym), hc = .14 * top, soft = max(fw * 1.5, .35 * top), body = smoothstep(0., soft, top - ym);
        vec3 farC = FIRE_BODY * (body * (1.5 + .45 * streak)) + FIRE_FRINGE * (.9 * (min(body * (1. + 9. * vRed), 1.) - body)) + FIRE_INNER * smoothstep(.3 * top, max(fw * 3., .8 * top), top - ym)
          + FIRE_HEART * ((1. - smoothstep(.2 * hc, hc, ym)) * min(1., .86 * hc / max(fw, 1e-4)) * .9);
        // (where the line hardly burns there is no fire; the sheet's face toward the eye: shading)
        float lit = smoothstep(0., .25, vC.w) * facing;
        float kk = lit * (1. - smoothstep(.85, 1., y));
        vec3 sc = mix(nearC, farC, farK) * kk;
        sc = mix(sc, vec3(.5, .55, .8) * dot(sc, vec3(.1, .3, .4)), uFlame.y);
        gl_FragColor = vec4(sc, FIRE_HIDES * min(mix(hidN + .8 * tT + .4 * fringe, body * (1. + 9. * vRed), farK), 1.) * kk * (1. - uFlame.y));
        gl_FragColor.rgb = gl_FragColor.rgb * vAir.a + vAir.rgb * gl_FragColor.a;   // (seen through the bowl's air, taken at each corner of the ribbon)
      }`})}const ot=.55,Ze={falls:500,beds:1e3,tongues:1},Fe={cluster:4,river:.325,run:.25,knot:.45,knotMetres:3.5,seam:.41,other:.265,tall:.785,broad:.24};function gt(D){return new M.ShaderMaterial({uniforms:D,transparent:!0,depthWrite:!1,side:M.DoubleSide,fog:!1,...tt,vertexShader:`
      attribute vec4 iP, iQ, iR, iF; uniform float uTime; uniform vec4 uWind; uniform vec2 uFlame;
      ${$e}
      ${Ye}
      ${je}
      uniform float uPx; varying vec2 vUv, vK; varying vec3 vT; varying vec4 vS, vAir; varying float vRed;
      void main(){
        vRed = moltenAt(iP.xyz);   // (how near molten sulphur it stands or lies: for its edge, see the tongue's law)
        float sd = iQ.x, on = iQ.z < 0. ? 1. : .55 + .45 * pourBurn(iQ.z), hot = step(1.5, iR.w) * step(iR.w, 2.5), y = position.y + .5;
        // (lit: how hard its place burns now: one whose place hardly burns gives no light)
        float lit = smoothstep(.03, .3, iQ.w * on) * (.6 + .4 * min(iQ.w * 1.4, 1.));
        if (iR.w > 2.5) {
          // A TILE OF THE RIVER'S SHEET (kind 3): it lies along its piece of the line, from point to point of the
          // world's own ribbon (iR.xyz: the way from the one to the other, with the ground's fall), level across
          // the line, iP.w metres to either side, 0.3 m over the line's points; over a step of the ground it
          // stands as steep as the step: there the fire falls. Each overlaps the next by its soft ends.
          float len = max(length(iR.xyz), 1e-3), two = iF.w;
          vec3 t = iR.xyz / len, n = normalize(vec3(iR.z, 0., -iR.x) + vec3(1e-6, 0., 0.)), up = normalize(cross(n, t)); up *= sign(up.y + 1e-6);
          // (the second sheet of a pour, iF.w = 1, stands across the first, from the step's face outward: as deep as
          // the first's half breadth, a little more: its outer edge is as far from the line as the first sheet's
          // side edges are, so it stays in the air the first is held to)
          float E = .5 * sqrt(iP.w * iP.w + .09);
          vec3 pos = iP.xyz + up * .3 + t * (position.y * len * 1.3) + (two > .5 ? up * (E - .3 + position.x * 2. * E) : n * (position.x * 2. * iP.w));
          // (vUv.y runs down the fall: from -0.65 at the tile's upper end to 0.65 at its lower)
          vUv = vec2(position.x * 2., position.y * 1.3 * (iR.y > 0. ? -1. : 1.)); vK = vec2(3., two); vS = vec4(sd, lit, iF.z, iP.w); vT = vec3(iF.x + position.y * 1.3 * len, iF.y, uFlame.x * on);
          gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.); vAir = airAt(pos);
          return; }
        // (h: the sheet's height now: iP.w, the height the build gave this tongue, in the hour's weather, breathing
        // on two slow rhythms of its own and never over iP.w; wm: its half breadth at the foot, the build's (iR.x),
        // and never over three tenths of its height)
        float h = max(iP.w * uFlame.x * on * (.8 + .12 * sin(uTime * (1.3 + sd * 1.1) + sd * 40.) + .08 * sin(uTime * (2.9 + sd * 1.7) + sd * 90.)), .05);
        float wm = min(iR.x, max(h * (.3 + .2 * hot), .03));
        vec2 wd = mix(uWind.zw, uWind.xy, windLean(iQ.y));
        vec3 foot = iP.xyz, toEye = cameraPosition - foot; float dist = length(toEye); vec2 rt = normalize(vec2(toEye.z, -toEye.x) + vec2(1e-5, 0.));
        // (its tip is drawn down the wind, and down-stream where it stands on running sulphur: iF.zw)
        // (a lick of a wall's seam, marked by iF.z = 9, stands upright: on a wall the hot gas climbs)
        float seam = step(5., iF.z);
        vec2 lean = wd * (h * (.18 + .12 * fract(sd * 13.7) + .06 * sin(uTime * 1.9 + sd * 60.))) + iF.zw * (h * (1. - seam));
        // (THE LICK IS TILTED, not stretched: its tip stands at most 0.8 of its length aside, and as far as it
        // leans it stands the lower (vy), so its whole reach from its foot is its own length, inside the 1.1 of the
        // flame's height that the world keeps clear for it; run: how hard the sulphur under it runs: on running
        // fire the gas is torn the more)
        float L = min(length(lean) / h, .8), run = (1. - seam) * smoothstep(.15, .6, length(iF.zw)), vy = sqrt(1. - L * L);
        lean *= L * h / max(length(lean), 1e-4); float lx = dot(lean, rt) / wm;
        // (a filter by the pixel's footprint: a lick under a pixel and a half of half breadth is thinned, to nothing
        // at half a pixel; one whose place hardly burns is not drawn. A seam's licks, small and many down one crack,
        // give way to the seam's ribbon where a pixel covers 0.03 to 0.09 m at the lick's distance (as the
        // ribbon turns into its one stroke about the crack): so a seam from afar is never a comb or a scatter of points)
        float k = smoothstep(.5, 1.5, wm / max(dist * uPx, 1e-5)) * lit * (1. - seam * smoothstep(.03, .09, dist * uPx)), Q = 1.65 + .25 * abs(lx);
        vec3 pos = foot + vec3(0., y * h * vy, 0.) + vec3(lean.x, 0., lean.y) * y + vec3(rt.x, 0., rt.y) * (position.x * 2. * wm * Q * step(.002, k));
        // (vK.x: its kind, and a quarter more on a chimney's own tongue, which stands in the air before a flank)
        // (and four tenths more on a tongue of a steep fall, whose depth pull is under a metre: it hangs in the air over the fall)
        vUv = vec2(position.x * 2. * Q, y); vK = vec2(iR.w + (iR.y > 0. ? (iR.y < .95 ? .4 : .25) : 0.), Q); vS = vec4(sd, k, h, wm); vT = vec3(lx, smoothstep(6., 28., h / max(dist * uPx, 1e-4)) * (1. + .8 * run), hot);
        gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.); vAir = airAt(foot + vec3(0., h * .4, 0.));
        // (a chimney's own tongue: its depth is taken iR.y metres nearer the eye's place: see the head)
        if (iR.y > 0.) { vec4 cn = projectionMatrix * viewMatrix * vec4(pos + toEye * (iR.y / dist), 1.); gl_Position.z = cn.z * gl_Position.w / cn.w; }
      }`,fragmentShader:`
      uniform vec2 uFlame; uniform float uTime;
      ${je}
      ${st}
      varying vec2 vUv, vK; varying vec3 vT; varying vec4 vS, vAir; varying float vRed;
      void main(){
        float y = vUv.y, sd = vS.x, flip = fract(sd * 91.7) < .5 ? -1. : 1.;
        if (vK.x > 2.5) {
          // THE RIVER'S SHEET, laid over the ground as a tongue's body is: across the line it falls from its
          // middle to nothing at its sides; along it soft billows run down the line at the sulphur's speed on
          // the world's clock: deep blue in their troughs, electric blue to azure on their crests. Where it
          // stands steep over a step of the ground (vS.z: the pour) it is the same body, drawn out down the fall.
          // It hides the ground in full wherever it burns at six tenths of its strength or more (a weaker
          // sheet is a deeper blue, not a thinner one: thin blue over the orange bed shows pink).
          /* (each tile dies away over the next piece's first seventh: where two meet each is at seven tenths, and the one laid over the other gives one body's light) */
          /* (IT HAS NO STRAIGHT EDGE AND NO SAW'S EDGE: its sides wander in and out along the line in long soft lobes, some 2.5 m to a swell with lesser ones of a metre and of half a metre on it (vw: two slow noises that run with the sulphur), and its ends are ragged) */
          /* (vS.z says how steep the sheet falls over a step, 0..1; a pour's last sheet, under which no other falls, is told by 2 added to it (endK), and low runs from 0 to 1 down its lower half. sk: what lies further from the sheet's middle lags behind as it runs, by 0.8 m to a metre across: its billows are swept back, as flame is that is drawn along) */
          float v = vUv.x, m = vT.x, us = m - vT.y * uTime, endK = step(1.5, vS.z), a = v * vS.w, low = endK * smoothstep(-.1, .65, vUv.y), sk = sign(vT.y) * abs(a) * .8;
          /* (each side's edge has lobes of its own, a metre or two long, between four tenths and nine tenths of the tile's half breadth from its middle: the body swells and draws in along the line, and the middle wanders slowly by up to 0.15 of it: the light is nought at the tile's own sides everywhere, so no straight edge shows. A POUR'S LAST SHEET draws in to six tenths as it falls and ends in a few hanging tongues of unlike lengths, not in a level hem) */
          float c0 = (nA(vec2(us * .02 + sd * 4., sd * 9.)) - .5) * .3, sideN = nG(vec2((us + sk) * .11 + sd * 4. + step(0., v) * .37, sd * 9. + step(0., v) * .21));
          float vw = (v - c0) / ((.38 + .56 * sideN) * (1. - abs(c0)) * (1. - .4 * low)), bell = max(1. - vw * vw, 0.); bell *= .4 + .6 * bell;
          float ends = clamp((.65 - abs(vUv.y) - .05 * v * v + (nG(vec2(v * 1.3 + sd * 5., us * .07)) - .5) * .12 + (nR(vec2(v * .22 + sd * 5.3, sd * 3.)) - .6) * .9 * low) / (.21 + .2 * low), 0., 1.);
          /* (ITS BODY IS WHOLE: soft billows of burning gas, some 0.8 m long and 0.4 m across (bil), with a finer tearing (rag), run down the line with the sulphur and drift across it; they are taken in metres. A POUR IS THE SAME BODY, FALLING: its billows keep their own measure (drawn out down the fall they are stripes on a flat card), and nothing of it stands open: fire that falls is a body of flame, not threads) */
          float bil = nR(vec2((us + sk) * .16 + sd * 5.3, a * .3 + sd * 3. + uTime * .04)), rag = nG(vec2((us + sk) * .3 + sd * 3., a * .55 + sd * 7. - uTime * .06));
          float raw = bell * (.75 + .5 * bil + .35 * rag), I = ends * vS.y * vT.z, B = smoothstep(.2, .55, raw), cr = smoothstep(.3, .75, bil);
          /* (THE HOT FOOT: one thin pale thread low in the fire, a seventh of the sheet's half breadth, that wanders from side to side with the billows and breaks where the tearing runs low) */
          float core = max(1. - abs(vw - (bil - .5) * .9) / .14, 0.) * smoothstep(.3, .6, rag);
          /* (a filter by the pixel's footprint: a sheet seen so nearly edge-on that it is under a pixel and a half broad on the screen cannot be drawn, it would be a row of dashes: it is faded out; a pour's second sheet, which is there for the side view alone, from six pixels down to two) */
          I *= smoothstep(vK.y > .5 ? 2. : .75, vK.y > .5 ? 6. : 1.5, 2. / max(fwidth(v), 1e-4));
          /* (its body is a deep blue, 0.95, in the troughs of its billows and electric blue, 1.9, on their crests (cr): the billows show as rolls of flame, not as one even sheet; azure toward its middle; and the hot foot's thread of pale cyan) */
          /* (ITS EDGE IS A SOFT VEIL, AND WHAT IT HIDES BEYOND ITS LIGHT IT GIVES DEEP BLUE. Toward its sides the sheet hides the ground a little sooner than its own light falls (H: it comes up from 0.12 to 0.5 of the body's strength), and what it hides there beyond its light it gives the fringe's deep blue (rim): an edge that hides and gives no light is a dark line wherever one sheet's edge lies over another's body. A sheet that hides the ground in full to its very edge is a shape cut from paper: so the edge stays a veil) */
          /* (NEAR MOLTEN SULPHUR THE EDGE GIVES WAY A LITTLE, by the molten law's answer (vRed: 0.12 at its most, see moltenAt). The reason is the bed: there the sheet lies on sulphur that glows orange under it, and a thin veil of blue over orange shows pink. So by vRed the edge that hides early, from 0.06 to 0.3 of the body's strength, is mixed in: an eighth of it at the most; and the deep blue comes in only where 0.7 of vRed of the ground is hidden already: a twelfth at the most. At one the edge would hide the bed before its light and stand dark, then deep blue, then the body; the law is handed so little of it because a stream's fire stands on the bed from end to end and at the whole strength is a flat sheet with cut edges) */
          float H = mix(smoothstep(.12, .5, raw), smoothstep(.06, .3, raw), vRed), rim = max(smoothstep(.7 * vRed, 1., H) - B, 0.);
          /* (AWAY FROM MOLTEN SULPHUR THE SHEET IS LOW FIRE WITH FRONTS IN IT, NOT ONE EVEN BAND: there its troughs are thin and a deep blue, 0.45, and let two fifths of the ground show; its billows' crests are the body's blue; and through it run thin bright fronts (fr: ridges that lie across the line, some 0.4 m apart and a metre long, and run down it with the sulphur, electric blue, pale only on their ridges), with the hot foot's thread at four tenths of its strength: seen flat on from near, on a steep slope, it has rolls and fronts of flame in it and the slope shows dark between them. On the molten bed it is the same low fire for seven eighths and more: dry is 1 less vRed, 0.88 at the least) */
          float dry = 1. - vRed, fr = nB(vec2((us + sk) * .3 + sd * 2.1, a * .13 + sd * 5.7 + uTime * .05)); fr *= fr;
          H *= 1. - dry * .4 * (1. - max(cr, fr));
          vec3 c = FIRE_BODY * (I * B * mix(.95 + .95 * cr, .45 + .75 * cr + .8 * fr, dry)) + FIRE_INNER * (I * smoothstep(.45, .9, raw) * (.4 + .6 * cr) * (1. - .6 * dry * (1. - fr)))
            + FIRE_HEART * (I * B * (core * (.8 - .5 * dry) + dry * .3 * smoothstep(.5, .85, fr))) + FIRE_FRINGE * (I * rim * .8);
          gl_FragColor = vec4(mix(c, vec3(.5, .55, .8) * dot(c, vec3(.1, .3, .4)), uFlame.y), FIRE_HIDES * I * min(1.6, 1. / max(vS.y * vT.z, 1e-3)) * H * (1. - uFlame.y)); }
        // (as a tongue: it bends down the wind inside its sheared sheet, and is turned left or right by its seed; its
        // light dies away toward the sheet's sides. A tongue's foot is soft: its light comes in from nothing over
        // the lowest tenth of its height (where it stands on the lip of a step its foot is seen from below, and
        // a foot that begins at full light is a hard level edge there); a chimney's own stands in the air before the flank: over the lowest fifth,
        // so tongue over tongue they are one strand)
        // (and the foot is round, not level: the light comes in the later the further from the tongue's middle line, by
        // three tenths of the height more at one half breadth aside: the glow about a foot does not end in a straight hem)
        // (A TONGUE OF A STEEP FALL HAS NO LEVEL FOOT AT ALL: it stands on no floor, the ground falls away under it,
        // and seen from over the fall a broad level foot makes it a plate. Its foot is a round drop: its lower
        // outline climbs with the square of the way from its middle line, to three tenths of its height at its
        // body's side (r), so it is a flame from wherever it is seen)
        else { float r = .6 * vUv.x * vUv.x * step(.3, fract(vK.x));
          gl_FragColor = tongueLight(vec2((vUv.x + vT.x * y * (1. - y)) * flip, y), sd, vS.z, vS.w, vT.y, vT.z, 1., uFlame.y, 1. - smoothstep(.7, 1., abs(vUv.x) / vK.y), vRed) * (vS.y * smoothstep(r, r + mix(.1, .22, step(.1, fract(vK.x))) + .3 * vUv.x * vUv.x, y)); }
        gl_FragColor.rgb = gl_FragColor.rgb * vAir.a + vAir.rgb * gl_FragColor.a;   // (seen through the bowl's air, taken at the lick's own place)
      }`})}function pt(D){return new M.ShaderMaterial({uniforms:D,transparent:!0,depthWrite:!1,side:M.DoubleSide,fog:!1,...tt,vertexShader:`
      attribute vec4 iS, iT, iM, iG; attribute vec3 iE; uniform float uTime, uFall; uniform vec4 uWind; uniform vec3 uMoonDir;
      ${$e}
      ${Ye}
      varying vec2 vUv, vLd; varying vec3 vLm, vK; varying vec4 vC, vAir, vF, vM; varying float vFb;
      void main(){
        float kind = iM.w, age, str = iT.w;
        if (kind > 2.5 && kind < 3.5) { float tb = uLaw.z - uFall / 30. - iE.y; age = clamp(tb / iE.z, 0., 1.); str *= step(0., tb) * step(tb, iE.z); }
        else age = fract(iM.x + uTime * iM.y);
        float ln = windLean(iE.x); vec2 wd = mix(uWind.zw, uWind.xy, ln);
        float rise = pow(age, .8) * iS.w, carry = pow(age, 1.4) * iT.x;
        vec3 c = iS.xyz + vec3(wd.x * carry, rise, wd.y * carry);
        c.xz += (vec2(sin(iM.z * 40. + age * 5.), cos(iM.z * 57. + age * 4.)) * .12) * rise * (1. + age);
        float size = mix(iT.y, iT.z, pow(age, .7));
        vec3 toEye = normalize(cameraPosition - c), rt = normalize(cross(vec3(0., 1., 0.), toEye) + vec3(1e-5, 0., 0.)), up = cross(toEye, rt);
        // (the lake's steam lies in banks: each is two and a half times as broad as it is deep)
        vec3 pos = c + (rt * position.x + up * (position.y * (kind > 1.5 && kind < 2.5 ? .4 : 1.))) * size * 2.;
        // (vLd: the way from the puff back to where it left the ground, across and up its own square: its lit side)
        vec3 back = normalize(iS.xyz - c + vec3(0., -1e-3, 0.)); vLd = vec2(dot(back, rt), dot(back, up));
        // (vLm: the way to the low moon, or to the east's first light, across, up and out of its own square)
        vLm = vec3(dot(uMoonDir, rt), dot(uMoonDir, up), dot(uMoonDir, toEye));
        vUv = position.xy * 2.; vC = vec4(iM.z, str * smoothstep(0., .1, age) * (1. - smoothstep(.5, 1., age)), rise, kind);
        // (vF: the world's up across and out of its own square; its half breadth now, metres; and how high over
        // the ground it left the fire's light has fallen to a third: a seventh of its whole climb, 7 m at the least
        // and 26 m at the most: the fire lights a column's foot blue, and above it the gas is the night's and the moon's)
        vF = vec4(up.y, toEye.y, size, clamp(iS.w * .15, 7., 26.));
        // (vM: the puff's own way at this moment of its track, as it is seen across and up its square: up while
        // it rises fast, down the wind as the wind takes it; its age; and how much fire burns under where it left
        // the ground: the burst at the fall is the burning river's own)
        float ag = max(age, .02); vec3 vel = vec3(wd.x, 0., wd.y) * (1.4 * pow(ag, .4) * iT.x) + vec3(0., .8 * pow(ag, -.2) * iS.w, 0.);
        // (vFb: HOW NEAR A GREAT FALL OF FIRE IT LEFT THE GROUND: the fall's own spray. The build keeps it with
        // the fire under the puff, in whole twos: 1 hard by the fall, nought from 40 m)
        float fbk = kind > 2.5 ? 0. : floor(iE.z * .5 + 1e-4); vFb = fbk / 7.;
        vM = vec4(vec2(dot(vel, rt), dot(vel, up)) / max(length(vel), 1e-3), age, kind > 2.5 ? 1. : iE.z - 2. * fbk);
        // (vK: WHERE IN ITS COLUMN THE PUFF STANDS (rising gas: kinds 0 and 1; the build's iG and iE.y): the
        // column's middle at the puff's own height is the middle of the places its neighbours left, carried down
        // the wind as their middle track is at that height; the column's half breadth there (Rc) is the spread
        // of those places and near half the puff's own size, a little more as it climbs. vK: how far the puff's
        // middle stands from the column's, across its square and toward the eye's place, and its own half
        // size, all in the column's half breadths: for the column's lit side and shade side, see the fragment)
        float aM = pow(clamp(max(c.y - iS.y, 0.) / max(iG.z, 1.), 0., 1.), 1.25), Rc = iE.y + .45 * size + .1 * rise;
        vec2 dC = c.xz - iG.xy - wd * (pow(aM, 1.4) * iG.w);
        vK = vec3(dot(dC, rt.xz), dot(dC, normalize(toEye.xz + vec2(1e-5, 0.))), size) / Rc;
        gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.); vAir = airAt(c);
      }`,fragmentShader:`
      uniform float uTime; uniform vec3 uFireCol, uSkyCol, uLakeCol, uMoonCol, uPlume;   // (uPlume: the fire's glow on the plume, the lake's on its steam, how thick the hour's steam stands)
      ${je}
      varying vec2 vUv, vLd; varying vec3 vLm, vK; varying vec4 vC, vAir, vF, vM; varying float vFb;
      // (THE GAS'S THICKNESS at a place q of the puff, taken across its own way (x) and along it (y): ax its half
      // breadth and half length; fs how fine the tearing noise is across and along; off where in the noise this
      // puff reads; E how hard it is torn. It answers two numbers: how thick the gas stands, 0 where there is none
      // and 1 where it is full; and the tearing noise itself there, which is how dense the gas's folds are.
      // The thickness answers the noise GENTLY: it comes up over the whole way from the puff's reach to its middle,
      // and the noise moves it by less than that way: a thickness that answers the noise hard cuts a puff into a
      // few full lumps, each with a rim where its gas ends at once)
      vec2 gas(vec2 q, vec2 ax, vec2 fs, vec2 off, float E){
        vec4 t = texture2D(tNoise, q * fs + off); vec2 r = q / ax; float n = t.r * .62 + t.a * .26 + t.g * .12;
        return vec2(smoothstep(0., 1.1, 1. - dot(r, r) + min((n - .55) * E * .55, .3)), n); }
      void main(){
        float seed = vC.x, age = vM.z;
        float kind = vC.w, body = step(.5, kind) * step(kind, 1.5), bank = step(1.5, kind) * step(kind, 2.5);
        // (of the lake's steam one puff in three is a single wisp, a third as broad, drawn out upward; the others
        // are banks, drawn out along the water)
        float wisp = bank * step(fract(seed * 7.3), .33);
        vec2 p = vUv * vec2(1. + 2. * wisp, 1.); float f = 1. - dot(p, p);
        if (f <= 0.) discard;
        // (dv: its own way across the square (a puff that comes straight at the eye is taken as rising); dn: across that way)
        vec2 dv = normalize(mix(vM.xy + vec2(0., .25), vec2(1. - wisp, wisp), bank)), dn = vec2(dv.y, -dv.x);
        float tm = uTime * mix(.03, .012, body), r1 = fract(seed * 5.7), r3 = fract(seed * 9.3);
        // (FOLDED: the place is pushed about by a slow noise, more the older the puff)
        vec2 w = texture2D(tNoise, p * .11 + seed * vec2(3.1, 7.7) - dv * (tm * .4)).rg - .5;
        vec2 pw = p + w * mix(.42 + .28 * age, .55 + .35 * age, bank), q = vec2(dot(pw, dn), dot(pw, dv));
        // (DRAWN OUT AND TORN: its form narrows across its way as it ages, the tearing noise is read two to three
        // times as long along the way as across, and it tears harder with age; the noise climbs along the way)
        // (ITS REACH IS UNEVEN: the same slow noise that folds it says how far the gas reaches at each part of the
        // puff, from a little over half its measure to a seventh more: one side of it stands out and another falls
        // short, so its outline is no round; and at its furthest it ends short of its square's rim, which is a
        // round and must not be seen: the tearing eats the gas and adds little to its reach)
        // (GAS THAT POURS UPWARD IS DRAWN OUT ALONG ITS WAY: a puff of the plume or of a mouth's steam is a third
        // narrower across its way and a fifth longer along it than a bank of the lake's steam, and its tearing
        // runs in long strands up it, some three to four times as long as broad: one over another they are a stream
        // of gas, not a heap of round clouds)
        vec2 ax = mix(vec2(mix(.46, .36, age) * (.8 + .3 * r1), .86), vec2(mix(.62, .5, age) * (.8 + .3 * r1), .72), bank) * clamp(1. + 2.2 * w.y, .55, 1.15);
        // (GAS THAT RISES HAS LONG SOFT FOLDS: the folds of a puff of the plume, of a column or of a mouth's steam
        // are read 1.3 times as fine across its way as a bank's, some five to the puff's breadth, and near twice
        // as long along its way as they are across: drawn out up the wind, five to seven times as long as broad)
        // (the burst at the fall keeps its own make: 1.7 times as fine as a bank, torn a quarter harder)
        float rising = step(kind, 1.5);   // (1 on gas that rises in a column: kinds 0 and 1)
        vec2 fs = vec2(.2, .2 * mix(mix(.38, .24, age), mix(.55, .35, age), bank)) * (.8 + .5 * r3) * mix(mix(vec2(1.7), vec2(1.3, .75), rising), vec2(1.), bank), off = seed * vec2(5.3, 1.9) - vec2(0., tm);
        // (a young puff is torn too: no puff is a full round ball at any age. GAS THAT RISES IS TORN SOFTLY, half
        // as hard as the lake's steam: its folds swell and thin, they do not curdle into lumps with edges)
        float E = mix(2.1, 2.9, age) * (.8 + .4 * r1) * mix(1.2, .85, body) * mix(mix(1.25, .5, rising), 1., bank);
        // (the field is read at three places well apart: its value, and its broad slope across the square: the
        // light then falls on the puff's whole side and does not draw a bright line round every strand)
        vec2 G0 = gas(q, ax, fs, off, E), Gx = gas(q + vec2(.22, 0.), ax, fs, off, E) - G0, Gy = gas(q + vec2(0., .22), ax, fs, off, E) - G0; float D0 = G0.x;
        // (th: how thick the gas stands here: a little thinner where its folds are thin; it is nothing at its
        // square's rim, which no part of it reaches full)
        float th = D0 * smoothstep(0., .3, f) * (.72 + .28 * smoothstep(.3, .65, G0.y));
        if (th <= .003) discard;
        // (which way this part of the gas faces: from the slope of its thickness and of its folds, turned back
        // to the square's own frame)
        vec2 gr = (dn * (Gx.x + .45 * Gx.y) + dv * (Gy.x + .45 * Gy.y)) / .22;
        vec3 nm = normalize(vec3(-gr * mix(.55, .3, bank), 1.)), U = vec3(0., vF.x, vF.y);
        // (A COLUMN HAS ONE LIT SIDE AND ONE SHADE SIDE. Gas that rises (kinds 0 and 1) stands puff over puff in
        // a column, and the light falls on the column, not on each puff as if it were a ball: so this part of
        // the gas faces mostly as the column's own side does where it stands in it (sx: how far across the
        // column, -1..1; a round column's side, turned a little toward the eye's place where the puff stands
        // before the column's middle), and only by a quarter as its own folds do: the folds are soft and
        // small against the column, and the column's side toward the light is pale and its other side less so)
        float sx = clamp(vK.x + p.x * vK.z, -1., 1.);
        nm = normalize(mix(nm, normalize(vec3(sx, .2, max(sqrt(1. - sx * sx) + .5 * clamp(vK.y, -1., 1.), .08))), .75 * rising));
        // (in its dense folds the light does not reach: the gas is darker there. It goes by the folds, which
        // run through the gas with no regard to any one puff, not by the puff's own middle. In gas that rises
        // the folds are only a little darker, a tenth: it is thin, and the light goes through it)
        float top = dot(nm, U), crease = 1. - mix(mix(.3, .1, rising), .42, bank) * smoothstep(.42, .75, G0.y) * th;
        // (by the night's own light steam is grey: it takes the sky's tone and none of its hue; the sky lights it
        // from above: its crowns are pale, its under sides and its creases dark)
        vec3 grey = vec3(1.04, 1., .98) * (dot(uSkyCol, vec3(.3, .4, .3)) * .34 + .009);
        // (the fire lights it from beneath and from where it rose, and only where fire burns under it (vM.w); the
        // light dies away up the gas with no edge: to a third at the height vF.w over the ground it left, to a
        // twentieth at three times that; above, it is a grey shape against the stars)
        // (THE SPRAY OF A GREAT FALL (vFb) has the fire beside it all the way up: its light does not die away
        // with the height and is up to twice as strong (the fall is a wall of fire, not a line on the
        // ground), and the spray hides four tenths as much: the fire is seen through it, and before the
        // fall it is lit mist and never a dark shape on the fire. A low bank of it takes this light and not
        // the lake's)
        float hgt = vC.z + p.y * vF.z, lowB = max(exp(-max(hgt, 0.) / (.9 * vF.w)) * vM.w, vFb) * (1. + vFb);
        float fK = clamp(dot(nm, normalize(vec3(vLd * .5, 0.) - U)) * .7 + .5, 0., 1.5);
        // (how thick it stands: a body of the plume is thick, and hides the stars; a puff is thin, thickest where
        // it has just left the ground and thinner as it climbs; the lake's steam is thin)
        float low = exp(-max(vC.z, 0.) / 45.);
        // (and it is densest as it leaves the mouth and thins as it climbs: a third denser young, a quarter thinner old)
        float dens = th * vC.y * uPlume.z * mix(mix(.5, 1.5, low), 1.4, body) * mix(mix(1.35, .75, age), 1.2, bank), a = min(dens, .93);
        // (GAS THAT RISES IS THIN AT ITS EDGES AND NEVER A WALL: what it hides comes up softly with its
        // thickness and ends at seven tenths where it stands thickest; through a puff's outer third the wall, the
        // stars and the lake are dimly seen, and only puff over puff, in a column's middle, does it close)
        a = mix(a, .7 * (1. - exp(-1.5 * dens)), rising) * (1. - .6 * vFb);
        // (THE LIGHT OF GAS THAT RISES: it is pale. By the night sky alone it is a soft blue-grey, a blue cast
        // on the sky's tone and no brown in it: on its shade side a half of that tone, which is paler than the
        // night sky behind it, on the side turned to the sky's bright side (where the moon or the first light
        // stands, in every hour) seven tenths: pale grey-blue by starlight. THE MOON, when it is up, does the
        // rest: the side turned to it is pale blue-white; and where the moon stands behind the gas (vLm.z below
        // nought: the way to it leads away from the eye's place) its thin parts shine through. The moon's
        // light is the hour's own number, taken for its strength and not for its hue: the first light before
        // dawn is warm, and warm light on grey gas shows brown.
        // The lake's steam and the burst at the fall take the night's plain grey, the law above)
        vec3 moonC = mix(vec3(dot(uMoonCol, vec3(.3, .5, .2))), uMoonCol, .3);
        float through = smoothstep(.15, .9, -vLm.z) * exp(-3.5 * th) * 1.2, lit = clamp(dot(nm, vLm) * .6 + .45, 0., 1.);
        vec3 col = grey * .62 * mix(1. + .8 * low, 2.1, body) * (.45 + .55 * (.5 + .5 * top) * (.5 + .5 * top)) * crease + moonC * ((max(dot(nm, vLm) * .8 + .2, 0.) * mix(.6, 1.1, body) * crease + through * mix(.6, 1., body)));
        vec3 colR = vec3(.6, .84, 1.3) * ((dot(uSkyCol, vec3(.3, .4, .3)) * mix(.5, .7, lit) + .01) * (.8 + .2 * (.5 + .5 * top)) * crease)
          + vec3(.8, .95, 1.2) * (dot(uMoonCol, vec3(.3, .5, .2)) * 1.7 * (max(dot(nm, vLm) * .8 + .2, 0.) * crease + through * .8));
        col = mix(col, colR, rising);
        // (THE FIRE'S BLUE: the world lays the fire's light on the ground as 0.08, 0.38, 1; the gas over the
        // fire takes that same blue a little stronger, 0.1, 0.44, 1.15 (the gas's own grey comes on top of it and would
        // pale it), on its under sides and through its thin low parts)
        // (it goes by the height over the fire, which is one field through all the gas, and only a little by
        // which way a part faces: so it lights the column's foot, not a ring round every puff)
        col += uFireCol * vec3(.1, .44, 1.15) * uPlume.x * (lowB * (.58 + .46 * fK) * mix(1., 1.2, body) * mix(1., crease, .7) + body * vM.w * .03 / (1. + vC.z * vC.z / 3600.) * (.7 + .3 * fK));
        // (the lake's own steam glows faintly with the lake's light)
        col = mix(col, (grey * (.5 + .5 * (.5 + .5 * top)) + uLakeCol * uPlume.y * (2. + 1.5 * D0)) * crease, bank * (1. - vFb));
        gl_FragColor = vec4((col * vAir.a + vAir.rgb) * a, a);   // (seen through the bowl's air, taken at the puff's own middle)
      }`})}function yt(D){return new M.ShaderMaterial({uniforms:D,transparent:!0,depthWrite:!1,side:M.DoubleSide,fog:!1,...ut,vertexShader:`
      attribute vec4 iP, iQ; uniform float uTime, uPx; uniform vec4 uWind;
      ${$e}
      ${Ye}
      varying vec3 vC; varying float vL;
      vec3 at(float age){ float sd = iQ.x; vec2 wd = mix(uWind.zw, uWind.xy, windLean(iQ.y));
        vec2 side = vec2(sin(sd * 71.), cos(sd * 53.)) * .35;
        if (iP.w < 0.) return iP.xyz + vec3(0., iP.w * age * age, 0.);              // (a drip: it falls from where it hangs, faster as it goes)
        return iP.xyz + vec3((wd.x * .5 + side.x) * iP.w * age, iP.w * (2. * age - age * age), (wd.y * .5 + side.y) * iP.w * age); }
      void main(){
        float cyc = iQ.x * 17. + uTime * iQ.w, age = fract(cyc), on = iQ.z < 0. ? 1. : pourBurn(iQ.z);
        // (a drip is a short streak ahead of where it is; a spark is a fine streak: its bright head where it is now,
        // its tail along the way it came over the last fourteenth of its flight)
        vec3 c = at(age), d = iP.w < 0. ? (at(age + .04) - c) * 1.6 : c - at(max(age - .07, 0.));
        vec3 toEye = cameraPosition - c; float dist = length(toEye);
        vec3 ax = normalize(cross(d, toEye) + vec3(1e-5, 0., 0.));
        float hw = max(iP.w < 0. ? .02 : .035, dist * uPx * .75);
        vec3 pos = c + d * (position.y + (iP.w < 0. ? .5 : -.5)) + ax * position.x * 2. * hw;
        // (its brightness is spread over whatever breadth it is drawn at: a drip is 28 mm broad, a spark's glow 70 at its narrowest and its light that of one 140 broad;
        // a spark is brightest as it leaves and fades all the way up its arc, slowly at first: it rises and dies)
        vL = position.y * 2.;
        // (and it is dimmed by the bowl's air between it and the eye. A SPARK IS A SMALL THING: where a pixel at its
        // distance from the eye's place covers more than a tenth of a metre it begins to go out, and it is gone
        // where a pixel covers 0.45 m: many sparks about a far fire would else add up in a few pixels to pale dots)
        vC = vec3(position.x * 2., on * airAt(c).a * (1. - smoothstep(.1, .45, dist * uPx)) * smoothstep(0., .08, age) * (iP.w < 0. ? .014 / hw * (1. - smoothstep(.45, .95, age)) : min(.07 / hw, 1.) * 1.5 * (1. - age) * (1. - age * age)), iP.w < 0. ? 2. : fract(iQ.x * 7.7));
        gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.);
      }`,fragmentShader:`
      varying vec3 vC; varying float vL;
      void main(){ float al = vL * .5 + .5;   // (along the streak: a drip is soft at both ends; a spark is brightest at its head, its tail thinning away)
        float a = (1. - vC.x * vC.x) * vC.y * (vC.z > 1.5 ? 1. - vL * vL : al * al * (1. - smoothstep(.82, 1., al)) * 1.5);
        // (a spark's head is an ember: pale cyan and more than twice as bright as its tail, bright enough to bloom; a
        // spark is blue fire too: its red is under a fifth of its blue)
        float hd = al * al * al * al;
        gl_FragColor = vec4(mix(mix(mix(vec3(.05, .4, 1.5), vec3(.1, .55, 1.4), step(.6, vC.z)), vec3(.25, .85, 1.6), hd) * (1. + 1.4 * hd), vec3(1.1, .1, .02), step(1.5, vC.z)) * (a * 2.2), 1.); }`})}const Tt=(D,t,I,Y,ee)=>D===1?[t[0]+I[0]*(Math.cos(Y)+.25*Math.sin(4*Y+ee*9)),t[1]+I[1]*(Math.sin(2*Y)+.3*Math.sin(5*Y)),t[2]+I[2]*(Math.sin(Y+.7)+.25*Math.cos(3*Y))]:[t[0]+I[0]*Math.cos(Y),t[1]+I[1]*(.5*Math.sin(2*Y+ee*6)+.25*Math.sin(5*Y)),t[2]+I[2]*Math.sin(Y)];function bt(D){return new M.ShaderMaterial({uniforms:D,side:M.DoubleSide,fog:!1,vertexShader:`
      attribute vec4 iC, iR, iH; uniform float uTime;
      ${Ye}
      varying vec3 vW, vN; varying vec3 vUv; varying vec4 vAir;
      vec3 course(float t){ float sd = iH.y;
        if (iC.w > .5 && iC.w < 1.5) return iC.xyz + iR.xyz * vec3(cos(t) + .25 * sin(4. * t + sd * 9.), sin(2. * t) + .3 * sin(5. * t), sin(t + .7) + .25 * cos(3. * t));
        return iC.xyz + iR.xyz * vec3(cos(t), .5 * sin(2. * t + sd * 6.) + .25 * sin(5. * t), sin(t)); }
      void main(){
        float kind = iC.w, sd = iH.y, t = iH.x + uTime * iR.w;
        vec3 c = course(t), dir = normalize(course(t + .03) - c + vec3(1e-5, 0., 0.)), rt, up; float ang;
        // (a moth at rest lies flat to what it hangs on: its wings spread in one plane, raised two degrees, and
        // shivered through three more in bursts)
        if (kind > 1.5) { c = iC.xyz; dir = vec3(0., 1., 0.); rt = vec3(cos(iH.w), 0., sin(iH.w));
          ang = .035 + .05 * sin(uTime * 55. + sd * 30.) * smoothstep(.2, .6, sin(uTime * .8 + sd * 20.)); }
        else { rt = normalize(cross(dir, vec3(0., 1., 0.)) + vec3(1e-5, 0., 0.));
          float beats = kind > .5 ? 1. : smoothstep(-.25, .15, sin(uTime * 1.1 + sd * 30.));
          ang = kind > .5 ? .85 * sin(uTime * 58. + sd * 40.) : mix(.3, .12 + 1.05 * sin(uTime * 19. + sd * 40.), beats); }
        up = cross(rt, dir);
        // (A MOTH'S SPAN: the world gives the largest an atlas moth of the place may have, a quarter of a metre from
        // tip to tip; each moth has its own, 0.76 to 1 of that by its seed: 0.19 to 0.25 m. A bat keeps the world's)
        float x = position.x, ca = cos(ang), sa = sin(ang), half_ = iH.z * (kind > .5 && kind < 1.5 ? 1. : .76 + .24 * fract(sd * 7.31));
        vec3 p = c + (rt * (x * ca) + up * (abs(x) * sa) + dir * position.z) * half_;
        vW = p; vN = normalize(up * ca - rt * (sign(x) * sa)); vUv = vec3(abs(x), position.z, kind);
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.); vAir = airAt(c);
      }`,fragmentShader:`
      varying vec3 vW, vN; varying vec3 vUv; varying vec4 vAir;
      ${je}
      ${ct}
      void main(){ vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N; float x = vUv.x, z = vUv.y;
        // (A FLYER TAKES THE NIGHT'S LIGHT AS THE WORLD'S STONES DO, by the same shares: six hundredths of the fire's
        // near light, eight of its far light, six tenths of the sky's, the lake's and the moon's: dark by the
        // moon, blue-grey near the fire, never a lamp of its own; under: what of the fire comes from beneath)
        vec3 lit = fireLight(vW, N, .3) * .06 + fireFar(vW, N) * .08 + nightLight(vW, N) * .6, under = fireLight(vW, vec3(0., -1., 0.), .3) * .06 + fireFar(vW, vec3(0., -1., 0.)) * .08;
        // a bat: dark fur and membrane, the membrane thin enough to take a little light through
        vec3 bat = vec3(.05, .035, .03) * lit + vec3(.03, .02, .02) * under * smoothstep(.15, .5, x);
        // a moth by night: drab grey-brown wings with a paler band and a dark margin, a clear window in each
        float band = 1. - smoothstep(0., .1, abs(x - .62 - z * .25)), margin = smoothstep(.78, .95, x + abs(z) * .25), win = 1. - smoothstep(.06, .1, abs(x - .42) + abs(z - .08) * .8);
        vec3 moth = mix(mix(vec3(.16, .13, .1), vec3(.3, .28, .24), band * .7), vec3(.045, .04, .035), margin) * lit;
        moth = mix(moth, under * .4, win);
        gl_FragColor = vec4((vUv.z > .5 && vUv.z < 1.5 ? bat : moth) * vAir.a + vAir.rgb, 1.);   // (seen through the bowl's air)
      }`})}function kt(D,t){const I=new M.InstancedBufferGeometry,Y=[],ee=[],ae=D.C.length/4;for(const Ee of[1,-1]){const $=Y.length/3;Y.push(0,0,.3,Ee*1,0,.42,Ee*.86,0,-.08,Ee*.62,0,-.6,0,0,-.42,0,0,0,Ee*.55,0,.5),ee.push($+5,$,$+6,$+5,$+6,$+1,$+5,$+1,$+2,$+5,$+2,$+3,$+5,$+3,$+4)}I.setAttribute("position",new M.Float32BufferAttribute(Y,3)),I.setIndex(ee);const be=Ee=>new M.InstancedBufferAttribute(new Float32Array(Ee.length?Ee:[0,0,0,0]),4);I.setAttribute("iC",be(D.C)),I.setAttribute("iR",be(D.R)),I.setAttribute("iH",be(D.H)),I.instanceCount=ae;const Le=new M.Mesh(I,bt({...t}));return Le.frustumCulled=!1,{object:Le,dispose(){I.dispose(),Le.material.dispose()}}}async function Mt(D,t={}){const I=new M.Group,Y=[],ee=t.laws||ft({}),ae=t.light||{},be={tNoise:ae.tNoise,uLaw:ae.uLaw||ee.uniform,uTime:ae.uTime||{value:0},uAir:ae.uAir,uAirMap:ae.uAirMap,uAirFloor:ae.uAirFloor,uAirTeal:ae.uAirTeal,uAirCol:ae.uAirCol,uAirFire:ae.uAirFire,tAir:ae.tAir,tAirRed:ae.tAirRed,uWind:{value:new M.Vector4(...t.wind||[.5,.87,1,0])},uFlame:{value:new M.Vector2(...t.flame||[1,0])},uPx:{value:.0016}},Le=be.uPx,Ee=()=>{const f=new M.InstancedBufferGeometry;return f.setAttribute("position",new M.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),f.setIndex([0,1,2,0,2,3]),f};t.yield&&await t.yield();const $=[];if(t.flames){const f=t.flames,c=[],e=new Set,h=ae.uBay?ae.uBay.value:{x:0,y:0};for(let E=0;E<f.P.length;E+=4)f.Q[E+2]<-1.5&&f.Q[E+3]<.85&&c.push(E);for(const E of c){if(e.has(E))continue;const L=c.filter(b=>!e.has(b)&&Math.hypot(f.P[b]-f.P[E],f.P[b+2]-f.P[E+2])<=2.6&&Math.abs(f.P[b+1]-f.P[E+1])<=1.2);if(L.length<4)continue;let A=0,W=0,z=0,te=0,C=0,Z=0,V=0,X=0,l=0,n=0;for(const b of L)e.add(b),A+=f.P[b]/L.length,W+=f.P[b+1]/L.length,z+=f.P[b+2]/L.length,te=Math.max(te,f.P[b+3]);for(const b of L){const U=f.P[b]-A,Q=f.P[b+1]-W,R=f.P[b+2]-z;C=Math.max(C,Math.hypot(U,R)),Z+=U*U,V+=U*R,X+=R*R,l+=U*Q,n+=R*Q}const i=Z*X-V*V;let r=i>.001?(l*X-n*V)/i:0,T=i>.001?(n*Z-l*V)/i:0;const F=Math.hypot(r,T);F>.45&&(r*=.45/F,T*=.45/F);const _=Math.hypot(r,1,T),a=[-r/_,1/_,-T/_],g=Math.hypot(1-a[0]*a[0],a[0]*a[1],a[0]*a[2]),s=[(1-a[0]*a[0])/g,-a[0]*a[1]/g,-a[0]*a[2]/g],d=[s[1]*a[2]-s[2]*a[1],s[2]*a[0]-s[0]*a[2],s[0]*a[1]-s[1]*a[0]],p={x:A+.95*a[0],lip:W+.95*a[1],z:z+.95*a[2],r:Math.max(C/.55,.5),tall:te,L,ax:a,e1:s,e2:d,east:Ne(((A-h.x-(z-h.y))*.7071+78)/120)};p.at=(b,U,Q)=>{const R=Math.cos(U)*Q,y=Math.sin(U)*Q;return[p.x-a[0]*b+s[0]*R+d[0]*y,p.lip-a[1]*b+s[1]*R+d[1]*y,p.z-a[2]*b+s[2]*R+d[2]*y]},$.push(p)}}t.yield&&await t.yield();const ze=[];if(t.puffs){const f=t.puffs.S,c=t.puffs.M,e=f.length/4;for(let h=0;h<e;){let E=h+1;for(;E<e&&c[h*4+3]<.5&&c[E*4+3]<.5&&Math.abs(f[E*4+1]-f[h*4+1])<.001&&Math.abs(f[E*4]-f[h*4])<=1&&Math.abs(f[E*4+2]-f[h*4+2])<=1;)E++;E-h>=8&&ze.push(h,E),h=E}for(const h of $){h.pipe=!1;for(let E=0;E<ze.length&&!h.pipe;E+=2){const L=ze[E]*4;h.pipe=Math.abs(f[L+1]-h.lip)<=2.5&&Math.hypot(f[L]-h.x,f[L+2]-h.z)<=1.5}}}else for(const f of $)f.pipe=!0;if(t.yield&&await t.yield(),t.flames&&t.flames.P.length){const f=Ee(),c=Array.from(t.flames.P),e=Array.from(t.flames.Q),h=t.glows,E=new Map,L=(V,X)=>Math.round(V*20)*100003+Math.round(X*20);{const V=c.length/4,X=new Map,l=new Set,n=(r,T,F)=>Math.floor(r/2)*73856093^Math.floor(T/2)*19349663^Math.floor(F/2)*83492791;for(const r of $)for(const T of r.L)l.add(T);const i=r=>e[r+2]<0&&e[r+2]>-1.5&&c[r+3]<2.6&&!l.has(r);for(let r=0;r<V*4;r+=4)if(i(r)){const T=n(c[r],c[r+1],c[r+2]);let F=X.get(T);F||X.set(T,F=[]),F.push(r)}t.yield&&await t.yield();for(let r=0;r<V*4;r+=4){if(t.yield&&r%800===796&&await t.yield(),!i(r))continue;const T=c[r],F=c[r+1],_=c[r+2],a=e[r+3];let g=1e9,s=1e9,d=c[r+3];for(let b=-1;b<=1;b++)for(let U=-1;U<=1;U++)for(let Q=-1;Q<=1;Q++){const R=X.get(n(T+2*b,F+2*U,_+2*Q));if(R){for(const y of R)if(y!==r){const K=Math.hypot(c[y]-T,c[y+1]-F,c[y+2]-_);K<g?(s=g,g=K):K<s&&(s=K)}}}if(a<=1){s<1.9&&(c[r+3]=d*(.45+.55*ke(.3,.75,.5+.5*Math.sin(T*.9+1.7*Math.sin(_*.7)+F*1.1))),e[r+3]=1,e[r+2]=-1.2);continue}const p=Math.min(Math.max(.19*d*a,s<1.9?.8*s:0),Math.max(1.4,.19*d*a));e[r+3]=Math.max(p/(.19*d),1.06),E.set(L(T,_),Math.min(Math.max(p*1.25,.8),1.8))}t.yield&&await t.yield()}const A=[],W=[];if(h){const V=[],X=[],l=t.curtains;for(let i=0,r=h.P.length/4;i<r;i++){const T=h.R[i*4+3];T>.5&&T<1.5&&V.push(i*4)}if(l)for(let i=0,r=l.P.length/3;i<r;i+=6){const T=Math.hypot(l.T[i*4],l.T[i*4+1],l.T[i*4+2]);T>0&&l.T[i*4+1]/T<.5&&X.push(l.P[i*3],l.P[i*3+1],l.P[i*3+2])}let n=0;for(const i of V){const r=h.P[i],T=h.P[i+1],F=h.P[i+2];let _=0,a=0;t.yield&&n++%2===0&&await t.yield();for(const s of V){const d=((h.P[s]-r)**2+(h.P[s+1]-T)**2+(h.P[s+2]-F)**2)/(h.R[s]*h.R[s]);d<1&&(_+=h.Q[s+3]*(1-d)*(1-d))}for(let s=0;s<X.length&&!a;s+=3)(X[s]-r)**2+(X[s+1]-T)**2+(X[s+2]-F)**2<16&&(a=1);const g=E.get(L(r,F));g?(A.push(r,T,F,g),W.push(h.Q[i],h.Q[i+1],h.Q[i+2],-Math.max(h.Q[i+3]*ot*Math.min(1,.2/Math.max(_,.001)),1e-4)-200)):(c.push(r,T,F,h.R[i]*.85),e.push(h.Q[i],h.Q[i+1],h.Q[i+2],-Math.max(h.Q[i+3]*ot*(a?1.8:1)*Math.min(1,.2/Math.max(_,.001)),1e-4)-100*a))}}for(const[V,X]of $.entries()){for(const l of X.L)e[l+3]=Math.max(e[l+3],1);c.push(X.x,X.lip,X.z,Math.max((1.1*X.tall-.95)/1.35,.5)),e.push(He(V*17+3),X.east,-1,-.3*ot*1.8-100)}const z=(A.length+c.length)/4,te=new Float32Array(z*4),C=new Float32Array(z*4);te.set(A),te.set(c,A.length),C.set(W),C.set(e,W.length),f.setAttribute("iP",new M.InstancedBufferAttribute(te,4)),f.setAttribute("iQ",new M.InstancedBufferAttribute(C,4)),f.instanceCount=z;const Z=new M.Mesh(f,wt({...be}));Z.frustumCulled=!1,Z.renderOrder=4.6,I.add(Z),Y.push(f)}t.yield&&await t.yield();const le=[],Ae=[],ve=[],ue=[],pe=[],Oe=[],Be=[],Ce=[],Re=[],Pe=new Map,xe={tongues:0,tiles:0,pours:0,pourDrop:0},_e=ae.uBay?ae.uBay.value:{x:0,y:0},Je=(f,c)=>Ne(((f-_e.x-(c-_e.y))*.7071+78)/120);let Ve=t.curtains;if(t.curtains&&t.curtains.I.length){const f=new M.BufferGeometry,c=t.curtains,e=Ve={P:Float32Array.from(c.P),T:Float32Array.from(c.T),U:Float32Array.from(c.U),I:c.I};for(let a=0,g=e.P.length/3;a<g;){let s=a;for(;s<g&&e.U[s*4+1]===e.U[a*4+1];)s+=3;const d=(s-a)/3,p=s-3,b=e.P[p*3+1]>e.P[a*3+1]?-1:1,U=b>0?a:p,Q=(e.P[p*3]-e.P[a*3])*b,R=(e.P[p*3+1]-e.P[a*3+1])*b,y=(e.P[p*3+2]-e.P[a*3+2])*b,K=Math.hypot(Q,R,y),we=Math.hypot(Q,y),S=a+3*(d>>1),k=e.T[S*4+1]/(Math.hypot(e.T[S*4],e.T[S*4+1],e.T[S*4+2])||1);let de=!1;for(let q=1;q<d&&!de;q++){const G=a+3*q;de=((e.P[G*3]-e.P[G*3-9])*Q+(e.P[G*3+1]-e.P[G*3-8])*R+(e.P[G*3+2]-e.P[G*3-7])*y)*b<-.5*K}if(de&&d>8&&k>=.5&&-R>3&&-R>.7*K&&we>.02*K){const q=[Q/K,R/K,y/K],G=-R/K,m=we/K,o=[(Q/we-m*q[0])/G,-m*q[1]/G,(y/we-m*q[2])/G],N=[q[1]*o[2]-q[2]*o[1],q[2]*o[0]-q[0]*o[2],q[0]*o[1]-q[1]*o[0]];t.yield&&await t.yield();const oe=[],fe=[],v=[],P=[],w=[],u=6,H=[e.P[U*3],e.P[U*3+1],e.P[U*3+2]];for(let x=0;x<d;x++){const B=a+3*x,me=e.P[B*3]-H[0],ce=e.P[B*3+1]-H[1],O=e.P[B*3+2]-H[2];oe.push([me*q[0]+ce*q[1]+O*q[2],me*o[0]+ce*o[1]+O*o[2],me*N[0]+ce*N[1]+O*N[2],B])}oe.sort((x,B)=>x[0]-B[0]||x[3]-B[3]);for(const x of oe){const B=x[3];fe.push(e.P[B*3],e.P[B*3+1],e.P[B*3+2]),v.push(e.T[B*4],e.T[B*4+1],e.T[B*4+2]),P.push(e.U[B*4+2],e.U[B*4+3]),w.push(Math.hypot(e.T[B*4],e.T[B*4+1],e.T[B*4+2]))}const j=oe.map((x,B)=>{let me=-1e9;for(let ce=Math.max(0,B-u);ce<=Math.min(d-1,B+u);ce++)me=Math.max(me,oe[ce][1]);return me}),ie=(x,B,me)=>{let ce=0,O=0;for(let re=Math.max(0,B-me);re<=Math.min(d-1,B+me);re++){const ye=me+1-Math.abs(re-B);ce+=x(re)*ye,O+=ye}return ce/O},J=oe.map((x,B)=>{const me=ie(re=>oe[re][0],B,2),ce=ie(re=>j[re],B,u),O=ie(re=>oe[re][2],B,u);return[H[0]+q[0]*me+o[0]*ce+N[0]*O,H[1]+q[1]*me+o[1]*ce+N[1]*O,H[2]+q[2]*me+o[2]*ce+N[2]*O]}),ne=[0];for(let x=1;x<d;x++)ne.push(ne[x-1]+Math.hypot(J[x][0]-J[x-1][0],J[x][1]-J[x-1][1],J[x][2]-J[x-1][2]));for(let x=0,B=0;x<d;x++){const me=x/(d-1)*ne[d-1];for(;B<d-2&&ne[B+1]<me;)B++;t.yield&&x%48===47&&await t.yield();const ce=(me-ne[B])/Math.max(ne[B+1]-ne[B],1e-6),O=[0,1,2].map(se=>J[B][se]+(J[B+1][se]-J[B][se])*ce);let re=0;for(let se=0;se<d;se++)re=Math.max(re,w[se]-Math.hypot(O[0]-fe[se*3],O[1]-fe[se*3+1],O[2]-fe[se*3+2])/1.3);const ye=Math.hypot(v[x*3],v[x*3+1],v[x*3+2]),Me=Math.min(ie(se=>Math.hypot(v[se*3],v[se*3+1],v[se*3+2]),x,3),re),Te=ye>0&&Me>=.3?Me/ye:1e-5/Math.max(ye,1e-5),he=Me>=.3?ie(se=>P[se*2],x,3):0,De=a+3*(b>0?x:d-1-x);for(let se=0;se<3;se++){const ge=De+se;e.P[ge*3]=O[0],e.P[ge*3+1]=O[1],e.P[ge*3+2]=O[2],e.T[ge*4]=v[x*3]*Te,e.T[ge*4+1]=v[x*3+1]*Te,e.T[ge*4+2]=v[x*3+2]*Te,e.U[ge*4+2]=he,e.U[ge*4+3]=P[x*2+1]}}}a=s}t.yield&&await t.yield(),f.setAttribute("position",new M.Float32BufferAttribute(e.P,3)),f.setAttribute("aT",new M.Float32BufferAttribute(e.T,4)),f.setAttribute("aU",new M.Float32BufferAttribute(e.U,4));const h=e.P.length/3,E=new Float32Array(h*4),L=new Float32Array(h*4),A=a=>e.P[a*3+1],W=(a,g)=>Math.hypot(e.P[a*3]-e.P[g*3],e.P[a*3+1]-e.P[g*3+1],e.P[a*3+2]-e.P[g*3+2]),z=f.attributes.position.array,te=f.attributes.aU.array,C=f.attributes.aT.array;let Z=0;t.yield&&await t.yield();const V=new Set,X=new Set;{const a=[],g=[];for(let s=0;s<h;){let d=s;for(;d<h&&e.U[d*4+1]===e.U[s*4+1];)d+=3;const p=(d-s)/3,b=A(s)-A(d-3),U=W(s,d-3),Q=s+3*(p>>1),R=e.T[Q*4+1]/(Math.hypot(e.T[Q*4],e.T[Q*4+1],e.T[Q*4+2])||1);if(!(R<.5&&p>8||R<-.3)&&p>3&&Math.abs(b)>2.5&&Math.abs(b)>.3*U)if(Math.abs(b)>.7*U){V.add(s);for(let y=s;y<d;y+=3)g.push(y)}else U<40&&a.push([s,b>0?s:d-3]);s=d}t.yield&&await t.yield();for(const s of a){for(let d=0;d<g.length;d++)if(W(s[1],g[d])<10){V.add(s[0]),X.add(s[0]);break}t.yield&&await t.yield()}}const l=new Map,n=new Map,i=new Map,r=new Set,T=new Map,F=new Map;{const a=[];for(const g of V){let s=g,d=0,p=0,b=0;for(;s<h&&e.U[s*4+1]===e.U[g*4+1];)d+=e.P[s*3],p+=e.P[s*3+2],b++,s+=3;let U=a.find(Q=>Math.hypot(Q.x/Q.k-d/b,Q.z/Q.k-p/b)<70);U||a.push(U={x:0,z:0,k:0,R:[]}),U.x+=d,U.z+=p,U.k+=b,U.R.push([g,s])}t.yield&&await t.yield();for(const g of a){if(g.R.length<8)continue;const s=[0,0,0],d=[0,0,0],p=[0,0,0];let b=0;for(const[v,P]of g.R){const w=P-3,u=A(v)>A(w)?1:-1,H=W(v,w)||1;d[0]+=(e.P[w*3]-e.P[v*3])*u/H,d[1]+=(A(w)-A(v))*u/H,d[2]+=(e.P[w*3+2]-e.P[v*3+2])*u/H;for(let j=v;j<P;j+=3)s[0]+=e.P[j*3],s[1]+=e.P[j*3+1],s[2]+=e.P[j*3+2],b++}s[0]/=b,s[1]/=b,s[2]/=b;for(const[v,P]of g.R)for(let w=v;w<P;w+=3){const u=e.P[w*3]-s[0],H=e.P[w*3+2]-s[2];p[0]+=u*u,p[1]+=u*H,p[2]+=H*H}const U=Math.hypot(d[0],d[1],d[2])||1,Q=Math.hypot(d[0],d[2]),R=.5*Math.atan2(2*p[1],p[0]-p[2]),y=Q>.15*U?[-d[2]/Q,0,d[0]/Q]:[Math.cos(R),0,Math.sin(R)],K=[y[1]*d[2]-y[2]*d[1],y[2]*d[0]-y[0]*d[2],y[0]*d[1]-y[1]*d[0]],we=Math.hypot(K[0],K[1],K[2])||1,S=[K[0]/we,K[1]/we,K[2]/we,0];S[3]=S[0]*s[0]+S[1]*s[1]+S[2]*s[2];for(const[v]of g.R)l.set(v,S);t.yield&&await t.yield();const k=[],de=[];let q=1e9,G=-1e9,m=0;for(const[v,P]of g.R){const w=X.has(v)?1:0;for(let u=v;u<P;u+=3)k.push(u,(e.P[u*3]-s[0])*y[0]+(e.P[u*3+2]-s[2])*y[2],A(u),m,w),q=Math.min(q,A(u)),G=Math.max(G,A(u));m++}const o=G-q>20?Math.min(24,.1*(G-q)):0;t.yield&&await t.yield();const N=new Map,oe=v=>Math.floor(v/2.5);for(let v=0;v<k.length;v+=5)if(!k[v+4]&&e.U[k[v]*4+2]>.05){const P=oe(k[v+2]);let w=N.get(P);w||N.set(P,w=[]),w.push(v)}t.yield&&await t.yield();const fe=new Float32Array(k.length/5);for(let v=0;v<k.length;v+=5)fe[v/5]=e.P[k[v]*3]*S[0]+e.P[k[v]*3+1]*S[1]+e.P[k[v]*3+2]*S[2];for(let v=0;v<k.length;v+=5){let P=1e9,w=1e9;if(t.yield&&v%250===245&&await t.yield(),!k[v+4])for(let u=oe(k[v+2])-1,H=u+2;u<=H;u++){const j=N.get(u);if(j)for(const ie of j){if(k[ie+3]===k[v+3]||Math.abs(k[ie+2]-k[v+2])>2.5||Math.abs(fe[ie/5]-fe[v/5])>5)continue;const J=k[ie+1]-k[v+1];J>.5?w=Math.min(w,J):J<-.5&&(P=Math.min(P,-J))}}de.push(P<o?.9*P:P<2*o?Math.min(.55*P,24.5):0,w<o?.9*w:w<2*o?Math.min(.55*w,24.5):0),G-q>40&&k[v+2]<q+10&&i.set(k[v],1-(k[v+2]-q)/10)}for(let v=0,P=0;v<k.length;v+=5,P+=2){const w=v>=5&&k[v-2]===k[v+3],u=v+5<k.length&&k[v+8]===k[v+3],H=de[P]||(w&&u?Math.min(de[P-2],de[P+2]):0),j=de[P+1]||(w&&u?Math.min(de[P-1],de[P+3]):0);n.set(k[v],Math.floor(H*32)+j/25)}t.yield&&await t.yield(),S.push(y[0],y[1],y[2],y[0]*s[0]+y[2]*s[2]);{let v=0;for(const P of N.keys()){const w=[];for(let u=P-1;u<=P+1;u++){const H=N.get(u);if(H)for(const j of H)w.push(j)}w.sort((u,H)=>k[u+1]-k[H+1]);for(let u=0;u<w.length;u++){const H=w[u],j=k[H+2];if(oe(j)!==P)continue;let ie=k[H+1],J=ie;for(let ne=u-1;ne>=0;ne--){const x=w[ne];if(!(Math.abs(k[x+2]-j)>3||Math.abs(fe[x/5]-fe[H/5])>5)){if(ie-k[x+1]>6)break;ie=k[x+1]}}for(let ne=u+1;ne<w.length;ne++){const x=w[ne];if(!(Math.abs(k[x+2]-j)>3||Math.abs(fe[x/5]-fe[H/5])>5)){if(k[x+1]-J>6)break;J=k[x+1]}}T.set(k[H],[ie,J])}t.yield&&++v%2===0&&await t.yield()}}t.yield&&await t.yield();{const v=[];for(const[w,u]of g.R)if(!X.has(w)&&Math.abs(A(w)-A(u-3))>6){const H=A(w)>A(u-3);v.push([H?w:u-3,H?u-3:w,w,u])}const P=(w,u,H)=>{const j=u===w[2]?3:-3,ie=u===w[2]?w[3]-3:w[2];for(;u!==ie;){const J=u+j,ne=W(u,J);if(ne>=H){const x=H/Math.max(ne,.001);return[e.P[u*3]+(e.P[J*3]-e.P[u*3])*x,A(u)+(A(J)-A(u))*x,e.P[u*3+2]+(e.P[J*3+2]-e.P[u*3+2])*x]}H-=ne,u=J}return[e.P[u*3],A(u),e.P[u*3+2]]};for(const w of v){let u=null,H=12,j=null,ie=12;const J=He(e.U[w[2]*4+1]*997+3),ne=He(e.U[w[2]*4+1]*997+11);for(const x of v){if(x===w)continue;const B=W(w[1],x[0]);B<H&&A(x[0])<A(w[1])+9&&(H=B,u=x);const me=W(w[0],x[1]);me<ie&&A(x[1])>A(w[0])-9&&(ie=me,j=x)}u&&F.set(w[1],P(u,u[0],1.5+7.5*Math.pow(J,1.7))),j&&F.set(w[0],[e.P[w[0]*3],A(w[0])+1.5+6*Math.pow(ne,1.5),e.P[w[0]*3+2]])}t.yield&&await t.yield()}}}for(let a=0;a<h;){let g=a;for(;g<h&&e.U[g*4+1]===e.U[a*4+1];)g+=3;const s=(g-a)/3,d=A(a)-A(g-3);let p=0;for(let m=1;m<s;m++)p+=W(a+3*m,a+3*m-3);let b=!1;const U=a+3*(s>>1),Q=e.T[U*4+1]/(Math.hypot(e.T[U*4],e.T[U*4+1],e.T[U*4+2])||1);b=Q<.5&&s>8||Q<-.3&&s>3;const R=V.has(a);if(!b&&!R&&s>4){const m=[];for(let N=1;N<s;N++)m.push(W(a+3*N,a+3*N-3));const o=m.slice().sort((N,oe)=>N-oe)[m.length>>1];for(let N=1;N<s;N++)m[N-1]>8&&m[N-1]>4*o&&r.add(a+3*N)}const y=b||R?new Float32Array(s):null,K=b||R?new Float32Array(s):null,we=Math.max(1,Math.min(8,Math.round(5*(s-1)/Math.max(p,.5))));if(y)for(let m=0;m<s;m++){const o=a+3*Math.max(0,m-2),N=a+3*Math.min(s-1,m+2);y[m]=Math.abs(A(o)-A(N))/Math.max(W(o,N),.5),m&&(K[m]=K[m-1]+W(a+3*m,a+3*m-3))}if(b||R)for(let m=0;m<s;m++){const o=a+3*m,N=Math.min(we,m,s-1-m);let oe=0,fe=0,v=0,P=0;for(let j=m-N;j<=m+N;j++){const ie=a+3*j,J=N+1-Math.abs(j-m);oe+=e.P[ie*3]*J,fe+=e.P[ie*3+1]*J,v+=e.P[ie*3+2]*J,P+=J}const w=b&&Math.hypot(e.T[o*4],e.T[o*4+1],e.T[o*4+2])>0?.5*Ne(Math.min(m,s-1-m)/8):0,u=F.get(o),H=R?Math.min(1,F.has(a)?.5+m:.6*m,F.has(g-3)?.5+(s-1-m):.6*(s-1-m)):1;u&&(oe=u[0]*P,fe=u[1]*P,v=u[2]*P);for(let j=0;j<3;j++)z[(o+j)*3]=oe/P,z[(o+j)*3+1]=fe/P,z[(o+j)*3+2]=v/P,te[(o+j)*4+2]=Math.max(te[(o+j)*4+2],w)*H}const S=Math.abs(d)<.5?0:Math.sign(d)*(1.5+4*Math.min(1,Math.abs(d)/Math.max(p,1))),k=R&&!X.has(a)&&p<8&&!(n.get(a+3*(s>>1))>0);let de=0;if(b||R){let m=0,o=0;for(let N=a;N<g;N+=3){const oe=Math.hypot(e.T[N*4],e.T[N*4+1],e.T[N*4+2]);oe>0&&(m+=oe,o++)}de=k?5:Math.max(R?4:1,Math.min(m/Math.max(o,1)/1.6,4.4))}let q=e.U[a*4+1]*97;const G=[];for(let m=0;m<s;m++){const o=a+3*m,N=a+3*Math.max(0,m-2),oe=a+3*Math.min(s-1,m+2),fe=(A(N)-A(oe))/Math.max(W(N,oe),.5),v=m?Math.hypot(z[o*3]-z[o*3-9],z[o*3+1]-z[o*3-8],z[o*3+2]-z[o*3-7]):0;q+=v;const P=e.T[o*4],w=e.T[o*4+1],u=e.T[o*4+2],H=w/(Math.hypot(P,w,u)||1),j=Ne((H-.4)/.4),ie=e.P[oe*3]-e.P[N*3],J=e.P[oe*3+2]-e.P[N*3+2],ne=Math.hypot(ie,J)||1,x=(S?Math.sign(S)*Math.min(.4,.2+.5*Math.max(0,fe*Math.sign(S))):Math.max(-.4,Math.min(.4,fe*.5)))*j*j*(3-2*j);let B=0;if(y){let O=0;for(let he=Math.max(0,m-6);he<=Math.min(s-1,m+6);he++)O=Math.max(O,y[he]);const re=d>0?K[m]:p-K[m],ye=R?.55+.9*He(e.U[a*4+1]*997+17):1,Me=R?.55+.9*He(e.U[a*4+1]*997+29):1;B=Math.max(Math.exp(-re/(Math.min(12,p/3)*ye)),k?0:ke(.12,.4,O-y[m]),R&&!k?.8*Math.exp(-(p-re)/(5*Me)):0);const Te=i.get(o);Te>.02&&(B=-Te)}for(let O=0;O<3;O++)E[(o+O)*4]=S,E[(o+O)*4+1]=de,E[(o+O)*4+2]=q,E[(o+O)*4+3]=B;{const O=z[oe*3]-z[N*3],re=z[oe*3+1]-z[N*3+1],ye=z[oe*3+2]-z[N*3+2],Me=Math.hypot(O,re,ye)||1;let Te=1;if(b||R){const he=Math.hypot(P,w,u);let De=0,se=0;for(let Qe=Math.max(0,m-we);Qe<=Math.min(s-1,m+we);Qe++){const qe=a+3*Qe,We=Math.hypot(e.T[qe*4],e.T[qe*4+1],e.T[qe*4+2]),Ke=we+1-Math.abs(Qe-m);We>0&&(De+=We*Ke,se+=Ke)}const ge=Math.min(K[m],p-K[m]),Se=(d>0?K[m]:p-K[m])/Math.max(p,.5),Ue=Math.min(F.has(a)?m?1:.12:.35+.65*ke(0,1.5,K[m]),F.has(g-3)?m<s-1?1:.12:.35+.65*ke(0,1.5,p-K[m]));he>0&&se>0&&(Te=Math.max(Math.min(Math.max(De/se/he,.25),4),R?(k?p/9:Math.min(2,p/4))/he:0)*(k?(.5+.5*ke(0,.12,Se))*(1-.75*ke(.25,1,Se)):R?Ue:.12+.88*ke(0,4,ge)))}for(let he=0;he<3;he++)L[(o+he)*4]=O/Me,L[(o+he)*4+1]=re/Me,L[(o+he)*4+2]=ye/Me,L[(o+he)*4+3]=Te}const me=Math.sqrt(Math.max(1-fe*fe,0));if(!b&&!R&&H>.5&&me<.75){const O=.9*(1-ke(.3,.75,me)),re=Math.sign(fe)||1,ye=ie/ne*re,Me=J/ne*re,Te=Math.hypot(P,w,u),he=P/Te+ye*O,De=w/Te,se=u/Te+Me*O,ge=Te/Math.hypot(he,De,se);for(let Se=0;Se<3;Se++)C[(o+Se)*4]=he*ge,C[(o+Se)*4+1]=De*ge,C[(o+Se)*4+2]=se*ge}if(R){const O=l.get(a),re=Math.hypot(P,w,u)||.001,ye=T.get(o),Me=O?z[o*3]*O[4]+z[o*3+2]*O[6]-O[7]:0,Te=X.has(a)?-1:ye?Math.floor(Math.min(Math.max(Me-ye[0],0),100)*8)+Math.min(Math.max(ye[1]-Me,0),63.9)/64:480.9375;O&&e.U[o*4+2]>.05&&Re.push(e.P[o*3],A(o),e.P[o*3+2]);for(let he=0;he<3;he++)E[(o+he)*4]=O?O[3]:1e9,O&&(C[(o+he)*4]=O[0]*re,C[(o+he)*4+1]=O[1]*re,C[(o+he)*4+2]=O[2]*re,te[(o+he)*4]=F.has(o)?0:n.get(o)||0,E[(o+he)*4+2]=Te)}!b&&e.U[o*4+2]>.5&&w>=.6&&(Math.abs(S)>=3&&fe*Math.sign(S)>.25?ve:ue).push(o),e.U[o*4+2]>.05&&(le.push(e.P[o*3],e.P[o*3+1],e.P[o*3+2],e.U[o*4]+1e3*e.U[o*4+1],S,b?9:ie/ne*x,J/ne*x,Math.hypot(P,w,u)),Ae.push(b?0:ke(.45,.65,Math.abs(fe))));const ce=o-3;if(!b&&!R&&!r.has(o)&&m>=1&&e.U[o*4+2]>.05&&e.U[ce*4+2]>.05){const O=e.P[ce*3],re=e.P[ce*3+1],ye=e.P[ce*3+2],Me=a+3*Math.max(0,m-2),Te=a+3*Math.min(s-1,m+1),he=(O+e.P[o*3])/2,De=(ye+e.P[o*3+2])/2;let se=e.P[o*3]-O,ge=e.P[o*3+2]-ye;const Se=e.P[o*3+1]-re,Ue=Math.hypot(se,Se,ge)||.001;{const We=e.P[Te*3]-e.P[Me*3],Ke=e.P[Te*3+2]-e.P[Me*3+2],Xe=Math.hypot(We,Ke);if(Xe>.2){const rt=(se*We+ge*Ke)/Xe;se=We/Xe*rt,ge=Ke/Xe*rt}Math.hypot(se,ge)<.05*Ue&&(se+=ie/ne*.05*Ue,ge+=J/ne*.05*Ue)}const Qe=Math.abs(A(a+3*Math.max(0,m-2))-A(a+3*Math.min(s-1,m+1)))>=1.5?ke(.72,.9,Math.abs(Se)/Ue):0,qe=Math.min(Math.hypot(e.T[o*4],e.T[o*4+1],e.T[o*4+2]),Math.hypot(e.T[ce*4],e.T[ce*4+1],e.T[ce*4+2]));G.push([he,re+Se/2,De,se,Se,ge,q-v/2,Math.min(e.U[o*4+2],e.U[ce*4+2]),e.U[o*4+3],Qe,Math.abs(Se),Math.sqrt(Math.max(1.69*qe*qe-.09-.0225*Ue*Ue,.01))])}}for(let m=0;m<G.length;m++){const o=G[m],N=G[m-Math.sign(S||1)],oe=o[9]<.5&&N&&N[9]>=.5?1:0;{const w=Math.floor(o[0]/1.6),u=Math.floor(o[2]/1.6);let H=!1;for(let ie=-1;ie<=1&&!H;ie++)for(let J=-1;J<=1&&!H;J++){const ne=Pe.get((w+ie)*8192+u+J);if(ne){for(const x of ne)if(x[3]!==a&&(x[0]-o[0])**2+(x[1]-o[1])**2+(x[2]-o[2])**2<2.56){H=!0;break}}}if(H)continue;let j=Pe.get(w*8192+u);j||Pe.set(w*8192+u,j=[]),j.push([o[0],o[1],o[2],a])}const fe=Math.min((.6+.8*Ne((Math.abs(S)-1.5)/4)+.5*dt(o[6]/9))*(oe?1.25:1),2,o[11]),v=G[m+Math.sign(S||1)],P=o[9]>=.5&&!(v&&v[9]>=.5&&Math.abs(v[6]-o[6])<4)?2:0;for(let w=0;w<(o[9]>=.5?2:1);w++)pe.push(o[0],o[1],o[2],fe),Oe.push(e.U[a*4+1],Je(o[0],o[2]),o[8],Math.min(1,o[7]*(oe?1.5:1))),Be.push(o[3],o[4],o[5],3),Ce.push(o[6],S,Math.max(o[9],.4*oe)+P,w);xe.tiles++,o[9]>=.5&&(xe.pours++,xe.pourDrop=Math.max(xe.pourDrop,o[10]))}t.yield&&g-Z>450&&(Z=g,await t.yield()),a=g}t.yield&&await t.yield(),f.setAttribute("aF",new M.Float32BufferAttribute(E,4)),f.setAttribute("aD",new M.Float32BufferAttribute(L,4));{const a=e.I,g=[];for(let s=0;s<a.length;s+=3)if(t.yield&&s%9e3===8997&&await t.yield(),te[a[s]*4+2]>1e-4||te[a[s+1]*4+2]>1e-4||te[a[s+2]*4+2]>1e-4){const d=Math.max(a[s],a[s+1],a[s+2]);r.has(d-d%3)||g.push(a[s],a[s+1],a[s+2])}t.yield&&await t.yield(),f.setIndex(g)}t.yield&&await t.yield();const _=new M.Mesh(f,vt({...be,uBay:ae.uBay||{value:new M.Vector2}}));_.frustumCulled=!1,_.renderOrder=4.5,I.add(_),Y.push(f)}t.yield&&await t.yield();const Ie=[];for(const[f,c]of $.entries()){const e=L=>He(f*17+L),h=Math.round(2.2*c.tall),E=Math.max(c.tall-Math.max(.65,.6*c.r),.3);c.fn=0,c.hp=[],c.kp=[],c.sD=0,c.sR=0,c.sDD=0,c.sDR=0,c.su=0,c.sv=0,c.s2c=0,c.s2s=0;for(let L=0;L<h;L++){const A=(L+e(20+L))/h*6.2832,W=c.r*(.65+.3*e(40+L)),z=e(60+L),te=c.at(.3,A,W);Ie.push(te[0],te[1],te[2],Math.min(c.tall*(.45+.4*z*z+.15*e(80+L)),E),e(100+L),c.east,L%3?0:2)}}const it=(f,c,e)=>{for(const h of $){const E=f-h.x,L=c-h.lip,A=e-h.z,W=-(E*h.ax[0]+L*h.ax[1]+A*h.ax[2]);if(W<1.2)continue;const z=E+h.ax[0]*W,te=L+h.ax[1]*W,C=A+h.ax[2]*W,Z=Math.hypot(z,te,C),V=1/Math.max(Z,.001);if(Z<=Math.min(4.5*h.r+1.5,1.3*h.r+.5*W+1.2))return[h,W,Z,(z*h.e1[0]+te*h.e1[1]+C*h.e1[2])*V,(z*h.e2[0]+te*h.e2[1]+C*h.e2[2])*V]}return null};if(xe.chimneys=$.length,t.glows&&t.glows.P.length){const f=Ee(),c=t.glows,e=c.P.length/4,h=n=>new M.InstancedBufferAttribute(new Float32Array(n),4),E=[],L=[],A=[],W=[],z=t.flames,te=new Map,C=new Map;if(z)for(let n=0,i=z.P.length/4;n<i;n++){const r=Math.floor(z.P[n*4]/4)*4096+Math.floor(z.P[n*4+2]/4);let T=te.get(r);T||te.set(r,T=[]),T.push(n*4)}t.yield&&await t.yield();const Z=new Map,V=(n,i)=>Math.floor(n/4)*4096+Math.floor(i/4);for(let n=0;n<le.length;n+=8){t.yield&&n%16e3===15992&&await t.yield();const i=V(le[n],le[n+2]);let r=Z.get(i);r||Z.set(i,r=[]),r.push(n)}t.yield&&await t.yield();for(let n=0;n<e;n++)if(c.R[n*4+3]>1.5){t.yield&&n%500===499&&await t.yield();const i=it(c.P[n*4],c.P[n*4+1],c.P[n*4+2]);i&&i[0].hp.push(c.P[n*4],c.P[n*4+1],c.P[n*4+2])}for(let n=0;n<e;n++){const i=c.R[n*4+3],r=c.Q[n*4],T=(r*7.77+.31)%1,F=(r*13.37+.73)%1;if(t.yield&&n%40===39&&await t.yield(),i>.5&&i<1.5||c.Q[n*4+3]<=.03)continue;const _=c.P[n*4],a=c.P[n*4+1],g=c.P[n*4+2],s=c.P[n*4+3];let d=3.5*3.5,p=-1,b=-1,U=1,Q=0;for(let S=-4;S<=4;S+=4)for(let k=-4;k<=4;k+=4){const de=Z.get(V(_+S,g+k)),q=te.get(V(_+S,g+k));if(q&&b<0){for(const G of q)if(Math.abs(z.P[G+1]+.05-a)<.02&&Math.hypot(z.P[G]-_,z.P[G+2]-g)<=.29*z.P[G+3]*z.Q[G+3]+.01){b=G;break}}if(de)for(const G of de){const m=(le[G]-_)**2+(le[G+1]-a)**2+(le[G+2]-g)**2;m<d&&(d=m,p=G)}}let R=s*Fe.tall;const y=p<0&&b<0?it(_,a,g):null,K=y?Math.min(Math.max((y[0].lip-5)/15,0),1):0;if(y){const S=y[0],k=Math.max(s*(.9+.1*F),Math.min(1,.45*S.tall))*(1+K*(.7+.9*T));if(S.fn++,S.sD+=y[1],S.sR+=y[2],S.sDD+=y[1]*y[1],S.sDR+=y[1]*y[2],S.su+=y[3],S.sv+=y[4],S.s2c+=y[3]*y[3]-y[4]*y[4],S.s2s+=2*y[3]*y[4],i<1.5){let de=0;for(const q of[S.hp,S.kp])for(let G=0;G<q.length&&!de;G+=3)(q[G]-_)**2+(q[G+1]-a)**2+(q[G+2]-g)**2<.16&&(de=1);if(de)continue;S.kp.push(_,a,g)}E.push(_,a,g,k),L.push(r,c.Q[n*4+1],c.Q[n*4+2],c.Q[n*4+3]),A.push(k*(.3+.08*K),Math.max(1.2+.8*K,Math.min(.8*y[2],4)),0,i),W.push(-1,0,0,0),xe.tongues++;continue}if(b>=0){if(i<1.5&&T>=Fe.cluster/Math.ceil(z.P[b+3]*2.5))continue;U=i>1.5?.5:.5+.5*F}else if(p>=0&&le[p+5]===9){if(T>=Fe.seam)continue;U=.6+.4*F}else if(p>=0){const S=ke(Fe.knot,Fe.knot+.25,ht(_/Fe.knotMetres,g/Fe.knotMetres));if(Q=Ae[p/8],T>=Ge(Math.max(Fe.river*S,Math.abs(le[p+4])>=3?Fe.run:0),.9,Q))continue;U=(.7+.3*F)*(.7+.3*Math.max(S,Q)),R=Math.max(R,Math.min((1.3*le[p+7]-Math.sqrt(d))/(1+Fe.broad*1.65),4))}else{if(T>=Fe.other*ke(Fe.knot,Fe.knot+.25,ht(_/Fe.knotMetres,g/Fe.knotMetres)))continue;U=.6+.4*F}{const S=Math.floor(_/2.5),k=Math.floor(a/2.5),de=Math.floor(g/2.5),q=(S*4096+de)*256+(k&255),G=C.get(q)||0;if(G>=2+Math.floor(3.5*He(((S*73+de*151+k*31)%4096+4096)%4096))+Math.round(3*Q))continue;C.set(q,G+1)}const we=R*U;if(E.push(_,a,g,we),L.push(r,c.Q[n*4+1],c.Q[n*4+2],c.Q[n*4+3]),A.push(we*Fe.broad,.9*Q,0,i),xe.tongues++,p<0)W.push(-1,0,0,0);else{const S=le[p+5]===9?1:1-.75*Q;W.push(le[p+3],le[p+4],le[p+5]*S,le[p+6]*S)}}t.yield&&await t.yield();for(let n=0;n<Ie.length;n+=7)E.push(Ie[n],Ie[n+1],Ie[n+2],Ie[n+3]),L.push(Ie[n+4],Ie[n+5],-1,1),A.push(Ie[n+3]*.27,1,0,Ie[n+6]),W.push(-1,0,0,0),xe.tongues++;for(const[n,i]of $.entries()){const r=p=>He(n*17+p),T=i.fn*i.sDD-i.sD*i.sD,F=i.fn>=8,_=F&&T>i.fn,a=_?Math.min(Math.max((i.fn*i.sDR-i.sD*i.sR)/T,0),.5):.1,g=_?(i.sR-a*i.sD)/i.fn-.2:.95*i.r,s=i.pipe?F?1:i.tall>3.5?3:i.tall>2.5?2:1:0,d=Math.hypot(i.su,i.sv)>.35*i.fn?Math.atan2(-i.sv,-i.su):.5*Math.atan2(i.s2s,i.s2c)+(r(1)<.5?1.5708:-1.5708);for(let p=0;p<s;p++){const b=F?d+.5*(r(2)-.5):(r(1)+(p+.3*(r(2+p)-.5))/s)*6.2832,U=Math.min(i.tall*(1.3+.6*r(5+p)),.6*i.lip),Q=Math.min(Math.max(3,Math.round(U*2.3)),39),R=r(9+p)*6.2832;for(let y=1;y<Q;y++){const K=y/Q,we=K*U,S=b+.22*Math.sin(we*.9+R)+.1*Math.sin(we*2.3+R*2),k=r(120+p*40+y),de=y%2?0:1,q=Math.min(Math.max(g+a*we,.95*i.r+.05*we),1.3*i.r+.5*we),G=i.at(we,S,q+.4),m=Math.max(i.tall*(.28+.34*k*k)*(1-.45*K),Math.min(1.1,.5*i.tall)*(1+.8*Math.min(Math.max((i.lip-5)/15,0),1)));E.push(G[0],G[1],G[2],m),L.push(r(400+p*40+y),i.east,-1,1),A.push(m*(.3+.15*de),Math.max(1.5,Math.min(.8*q,4)),0,2*de),W.push(-1,0,0,0),xe.tongues++}}}for(let n=0;n<pe.length;n++)E.push(pe[n]),L.push(Oe[n]),A.push(Be[n]),W.push(Ce[n]);const X=E.length/4;f.setAttribute("iP",h(E)),f.setAttribute("iQ",h(L)),f.setAttribute("iR",h(A)),f.setAttribute("iF",h(W)),f.instanceCount=X;const l=new M.Mesh(f,gt({...be}));l.frustumCulled=!1,l.renderOrder=4,I.add(l),Y.push(f)}t.yield&&await t.yield();const at={value:new M.Vector3(1,1,t.steam??1)};if(t.puffs&&t.puffs.S.length){const f=Ee(),c=t.puffs.S.length/4,e=Float32Array.from(t.puffs.S),h=Float32Array.from(t.puffs.T),E=Float32Array.from(t.puffs.M),L=Float32Array.from(t.puffs.E),A=new Map,W=(l,n)=>Math.floor(l/16)*4096+Math.floor(n/16);for(let l=0;l<ze.length;l+=2){const n=ze[l],i=ze[l+1],r=[];for(let a=n;a<i;a++)r.push(a);r.sort((a,g)=>e[a*4+3]-e[g*4+3]);const T=r[r.length>>1],F=[e[T*4],e[T*4+1],e[T*4+2],e[T*4+3],h[T*4],h[T*4+1],h[T*4+2],E[T*4+1]],_=Math.min(F[6],Math.max(2.6,F[3]/5));for(let a=n;a<i;a++)e[a*4]=F[0],e[a*4+1]=F[1],e[a*4+2]=F[2],e[a*4+3]=F[3],h[a*4]=F[4],h[a*4+1]=Math.min(h[a*4+1],F[5],_),h[a*4+2]=_,E[a*4]=(a-n+.6*E[a*4])/(i-n),E[a*4+1]=F[7]}const z=(l,n,i)=>{const r=W(l,i);let T=A.get(r);T||A.set(r,T=[]),T.push(l,n,i)};for(let l=0;l<le.length;l+=32)z(le[l],le[l+1],le[l+2]);if(t.flames)for(let l=0,n=t.flames.P;l<n.length;l+=4)z(n[l],n[l+1],n[l+2]);t.yield&&await t.yield();const te=new Map;for(let l=0;l<Re.length;l+=3){const n=W(Re[l],Re[l+2]);let i=te.get(n);i||te.set(n,i=[]),i.push(Re[l],Re[l+1],Re[l+2])}t.yield&&await t.yield();for(let l=0;l<c;l++){if(t.yield&&l%8===7&&await t.yield(),E[l*4+3]>2.5)continue;const n=e[l*4],i=e[l*4+1],r=e[l*4+2];let T=1e9,F=1e9;for(let _=-16;_<=16&&T>64;_+=16)for(let a=-16;a<=16&&T>64;a+=16){const g=A.get(W(n+_,r+a));if(g)for(let s=0;s<g.length&&T>64;s+=3){const d=(g[s]-n)**2+(g[s+1]-i)**2+(g[s+2]-r)**2;d<T&&(T=d)}}if(te.size)for(let _=-48;_<=48&&F>196;_+=16)for(let a=-48;a<=48&&F>196;a+=16){const g=te.get(W(n+_,r+a));if(g)for(let s=0;s<g.length&&F>196;s+=3){const d=(g[s]-n)**2+(g[s+1]-i)**2+(g[s+2]-r)**2;d<F&&(F=d)}}L[l*3+2]=1-ke(8,16,Math.sqrt(T))+2*Math.round(7*(1-ke(14,40,Math.sqrt(F))))}const C=new Float32Array(c*4),Z=new Map,V=(l,n)=>Math.floor(l/10)*8192+Math.floor(n/10);for(let l=0;l<c;l++)if(E[l*4+3]<1.5){const n=V(e[l*4],e[l*4+2]);let i=Z.get(n);i||Z.set(n,i=[]),i.push(l)}t.yield&&await t.yield();for(let l=0;l<c;l++){if(t.yield&&l%8===7&&await t.yield(),E[l*4+3]>1.5)continue;const n=e[l*4],i=e[l*4+1],r=e[l*4+2];let T=0,F=0,_=0,a=0,g=0,s=0;for(let b=-10;b<=10;b+=10)for(let U=-10;U<=10;U+=10){const Q=Z.get(V(n+b,r+U));if(Q)for(const R of Q){const y=e[R*4]-n,K=e[R*4+2]-r;y*y+K*K<100&&Math.abs(e[R*4+1]-i)<8&&(T+=y,F+=K,_+=y*y+K*K,a+=e[R*4+3],g+=h[R*4],s++)}}const d=T/s,p=F/s;C[l*4]=n+d,C[l*4+1]=r+p,C[l*4+2]=a/s,C[l*4+3]=g/s,L[l*3+1]=Math.sqrt(Math.max(_/s-d*d-p*p,0))}f.setAttribute("iG",new M.InstancedBufferAttribute(C,4)),f.setAttribute("iS",new M.InstancedBufferAttribute(e,4)),f.setAttribute("iT",new M.InstancedBufferAttribute(h,4)),f.setAttribute("iM",new M.InstancedBufferAttribute(E,4)),f.setAttribute("iE",new M.InstancedBufferAttribute(L,3)),f.instanceCount=c;const X=new M.Mesh(f,pt({...be,uFall:{value:t.fall??300},uFireCol:ae.uFireCol,uSkyCol:ae.uSkyCol,uLakeCol:ae.uLakeCol,uMoonDir:ae.uMoonDir,uMoonCol:ae.uMoonCol,uPlume:at}));X.frustumCulled=!1,X.renderOrder=5,I.add(X),Y.push(f)}if(t.yield&&await t.yield(),t.sparks&&t.sparks.P.length){const f=Ee(),c=Array.from(t.sparks.P),e=Array.from(t.sparks.Q),h=Ve,E=ae.uBay?ae.uBay.value:{x:0,y:0},L=(C,Z)=>{const V=Math.sin(C*12.9898+Z*78.233)*43758.5453;return V-Math.floor(V)},A=(C,Z)=>Ne(((C-E.x-(Z-E.y))*.7071+78)/120),W=(C,Z,V,X,l,n,i,r)=>{c.push(C,Z+.1,V,X*(r-.3*L(n,i))),e.push(L(n,i+1),A(C,V),l,1/(.8+1.3*L(n,i+2)))};if(h){const C=(Z,V,X)=>{const l=Math.max(1,Math.ceil(Z.length/V));for(let n=0;n<Z.length;n+=l){const i=Z[n];for(let r=0;r<X;r++)W(h.P[i*3],h.P[i*3+1],h.P[i*3+2],h.T[i*4+1],h.U[i*4+3],i,r*3,.92)}};Ze.falls&&C(ve,Ze.falls,2),Ze.beds&&C(ue,Ze.beds,1)}if(t.flames&&Ze.tongues)for(let C=0,Z=t.flames,V=Z.P.length/4;C<V;C++)Z.P[C*4+3]>=3&&W(Z.P[C*4],Z.P[C*4+1],Z.P[C*4+2],Z.P[C*4+3],Z.Q[C*4+2],C,7,.8);const z=c.length/4;f.setAttribute("iP",new M.InstancedBufferAttribute(new Float32Array(c),4)),f.setAttribute("iQ",new M.InstancedBufferAttribute(new Float32Array(e),4)),f.instanceCount=z;const te=new M.Mesh(f,yt({...be,uPx:Le}));te.frustumCulled=!1,te.renderOrder=7,I.add(te),Y.push(f)}t.yield&&await t.yield();const nt=new M.Vector2,lt=Math.tan((t.fov??60)*Math.PI/360);return{object:I,radius:200,height:320,center:new M.Vector3(0,70,0),anchors:{},laws:ee,uniforms:be,facts:xe,update(f,c){ee.set(c),D.renderer&&(D.renderer.getDrawingBufferSize(nt),Le.value=2*lt/Math.max(1,nt.y)),at.value.x=(t.glow??1)*(.75+.25*ee.burn(150)),at.value.y=t.lakeGlow??1},dispose(){for(const f of Y)f.dispose();I.traverse(f=>{f.material&&f.material.dispose()})},ground:!1,groundY:0}}export{Ye as GLSL_AIR,ct as GLSL_FIRE,$e as GLSL_LAWS,je as GLSL_NOISE,st as GLSL_TONGUE,Mt as buildHero,Tt as flyerCourse,kt as makeFlyers,ft as makeLaws,xt as makeNoiseTexture};
