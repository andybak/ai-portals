import{SHED as A,TOWER as oe,BAY as ve,TURNTABLE as ae,STRAIGHT as me,TIERS as Pe,DOOR as ne,FAR as H,tierRadius as be,tierRail as we}from"./doors-in-transit-plan.js";import{SHED_SUN_GLSL as re,shedSunUniform as xe,shedBarsUniform as ye,FAN as T}from"./doors-in-transit-shed-sun.js";import{buildBay as Ce,BAY_RIB_STEP as Me,rod as ge}from"./doors-in-transit-shed-bay.js";import{furnishYard as qe,TRACKS as N,ARCADE as Y}from"./doors-in-transit-shed-yard.js";import{furnishDeck as je}from"./doors-in-transit-shed-deck.js";import{buildMouth as Re,MOUTH as ke}from"./doors-in-transit-shed-mouth.js";const V=h=>Number(h).toFixed(4),E=(A.x1-A.x0)/2,We=A.crown-A.spring,U=[];for(let h=A.z0+10;h<A.z1;h+=A.ribStep)U.push(h);function X(h){const z=Math.min(1,Math.abs(h)/E),v=2.6;return A.spring+We*(.85*Math.pow(Math.max(0,1-Math.pow(z,v)),1/v)+.15*(1-z))}function De(h){const z=[];let _=0;for(let e=0;e<=600;e++){const o=e/600*Math.PI,s=E*Math.cos(o),u=X(s);e&&(_+=Math.hypot(s-z[e-1].x,u-z[e-1].y)),z.push({x:s,y:u,s:_})}const k=[];let f=0;for(let e=0;e<=h;e++){const o=_*e/h;for(;f<599&&z[f+1].s<o;)f++;const s=z[f],u=z[f+1],d=(o-s.s)/Math.max(1e-6,u.s-s.s);k.push({x:s.x+(u.x-s.x)*d,y:s.y+(u.y-s.y)*d,s:o})}k[0].x=E,k[0].y=A.spring,k[h].x=-E,k[h].y=A.spring;for(let e=0;e<=h;e++){const o=k[Math.max(0,e-1)],s=k[Math.min(h,e+1)],u=s.x-o.x,d=s.y-o.y,P=Math.hypot(u,d)||1;k[e].nx=-d/P,k[e].ny=u/P}return k.length_=_,k}function J(){const h=[],z=[],v=[],_=[],k={kind:0,w:1},f={st:k,set(e){return Object.assign(k,e),f},poly(e,o){const s=e[0],u=e[1],d=e[2];let P=(u[1]-s[1])*(d[2]-s[2])-(u[2]-s[2])*(d[1]-s[1]),S=(u[2]-s[2])*(d[0]-s[0])-(u[0]-s[0])*(d[2]-s[2]),B=(u[0]-s[0])*(d[1]-s[1])-(u[1]-s[1])*(d[0]-s[0]);const q=Math.hypot(P,S,B)||1;P/=q,S/=q,B/=q;const l=h.length/3,C=Math.abs(P),F=Math.abs(S),j=Math.abs(B);for(let p=0;p<e.length;p++){const y=e[p];h.push(y[0],y[1],y[2]),z.push(P,S,B),o?v.push(o[p][0],o[p][1],k.kind,o[p].length>2?o[p][2]:k.w):F>.7?v.push(y[0],y[2],k.kind,k.w):C>j?v.push(y[2],y[1],k.kind,k.w):v.push(y[0],y[1],k.kind,k.w)}for(let p=1;p<e.length-1;p++)_.push(l,l+p,l+p+1);return f},quad(e,o,s,u,d){return f.poly([e,o,s,u],d)},box(e,o,s,u,d,P,S=""){return S.includes("f")||f.quad([e,s,P],[o,s,P],[o,u,P],[e,u,P]),S.includes("k")||f.quad([o,s,d],[e,s,d],[e,u,d],[o,u,d]),S.includes("r")||f.quad([o,s,P],[o,s,d],[o,u,d],[o,u,P]),S.includes("l")||f.quad([e,s,d],[e,s,P],[e,u,P],[e,u,d]),S.includes("u")||f.quad([e,u,P],[o,u,P],[o,u,d],[e,u,d]),S.includes("d")||f.quad([e,s,d],[o,s,d],[o,s,P],[e,s,P]),f},triangles(){return _.length/3},geometry(e){const o=new e.BufferGeometry;return o.setAttribute("position",new e.Float32BufferAttribute(h,3)),o.setAttribute("normal",new e.Float32BufferAttribute(z,3)),o.setAttribute("aP",new e.Float32BufferAttribute(v,4)),o.setIndex(h.length/3>65535?new e.Uint32BufferAttribute(_,1):new e.Uint16BufferAttribute(_,1)),o.computeBoundingBox(),o.computeBoundingSphere(),o}};return f}const Se=`
// sh12: hash12 of "Hash without Sine" (David Hoskins, MIT), brought in
float sh12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float svn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(sh12(i), sh12(i + vec2(1., 0.)), f.x), mix(sh12(i + vec2(0., 1.)), sh12(i + vec2(1., 1.)), f.x), f.y); }
`,Ve=`attribute vec4 aP; varying vec4 vP; varying vec3 vWp;
`,Ae=`#include <begin_vertex>
 vP = aP; vWp = (modelMatrix * vec4(position, 1.)).xyz;
`;function ie(h,z,v,_,k,f,e){const o=new h.MeshStandardMaterial(v);return o.onBeforeCompile=s=>{Object.assign(s.uniforms,f||{}),s.vertexShader=s.vertexShader.replace("#include <common>",Ve+"#include <common>").replace("#include <begin_vertex>",Ae),s.fragmentShader=s.fragmentShader.replace("#include <common>",`varying vec4 vP; varying vec3 vWp;
`+Se+(_||"")+"#include <common>").replace("#include <color_fragment>",`#include <color_fragment>
`+k).replace("void main() {",`void main() {
 vec3 shedGlow = vec3(0.);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance += shedGlow;`),e&&e(s)},o.customProgramCacheKey=()=>"doors-in-transit-shed-"+z,o}const _e=`
{
  vec2 uv = vP.xy; vec3 base; float px;
  if (vP.z < .5) {
    float bh = .36, bw = 1.08, row = floor(uv.y / bh), uo = uv.x / bw + .5 * mod(row, 2.), vo = uv.y / bh;
    vec2 id = vec2(floor(uo), row), f = vec2(fract(uo), fract(vo)), fw = fwidth(vec2(uo, vo)) + 1e-5;
    float h = sh12(id), h2 = sh12(id + 17.3);
    vec3 brick = mix(vec3(.34, .135, .06), vec3(.47, .235, .095), h);
    brick = mix(brick, vec3(.2, .085, .05), step(.88, h2) * .75);
    vec2 e = min(f, 1. - f), jw = vec2(.036 / bw, .036 / bh), j = 1. - smoothstep(jw, jw + fw, e);
    px = max(fw.x * 1.4, fw.y);
    base = mix(vec3(.385, .18, .08), mix(brick, vec3(.42, .37, .3), max(j.x, j.y)), 1. - smoothstep(.1, .3, px));
    float bq = uv.y / 5.76, bf = fract(bq), bwd = fwidth(bq) + 1e-5, bandw = .125;
    float band = smoothstep(0., bwd, bf) * (1. - smoothstep(bandw, bandw + bwd, bf)) * min(1., bandw / bwd);
    base = mix(base, vec3(.125, .088, .07) * (.8 + .4 * h), band * .72);
  } else if (vP.z < 1.5) {
    float bh = 1.3, bw = 2.7, row = floor(uv.y / bh), uo = uv.x / bw + .5 * mod(row, 2.), vo = uv.y / bh;
    vec2 id = vec2(floor(uo), row), f = vec2(fract(uo), fract(vo)), fw = fwidth(vec2(uo, vo)) + 1e-5;
    vec2 e = min(f, 1. - f), jw = vec2(.03 / bw, .03 / bh), j = 1. - smoothstep(jw, jw + fw, e);
    px = max(fw.x, fw.y);
    vec3 stone = vec3(.46, .42, .34) * (.86 + .26 * sh12(id));
    base = mix(vec3(.445, .405, .33), stone * (1. - .45 * max(j.x, j.y)), 1. - smoothstep(.12, .34, px));
  } else if (vP.z < 2.5) {
    // the bay's brick: an even red in Flemish bond (a stretcher, a header), bands of blue-black and cream every fourteenth course
    float bh = .36, P = 1.62, row = floor(uv.y / bh), uo = uv.x / P + .5 * mod(row, 2.), vo = uv.y / bh;
    vec2 f = vec2(fract(uo), fract(vo)), fw = fwidth(vec2(uo, vo)) + 1e-5; float hd = step(.6667, f.x), h = sh12(vec2(floor(uo) * 2. + hd, row));
    float ex = min(min(f.x, abs(f.x - .6667)), 1. - f.x), ey = min(f.y, 1. - f.y);
    float jn = max(1. - smoothstep(.011, .011 + fw.x, ex), 1. - smoothstep(.05, .05 + fw.y, ey));
    px = max(fw.x * 2., fw.y);
    float bq = uv.y / (14. * bh), bf = fract(bq), bw = fwidth(bq) * .5 + 1e-5;
    float band3 = smoothstep(5. / 14. - bw, 5. / 14. + bw, bf) - smoothstep(8. / 14. - bw, 8. / 14. + bw, bf);
    float cream = smoothstep(6. / 14. - bw, 6. / 14. + bw, bf) - smoothstep(7. / 14. - bw, 7. / 14. + bw, bf), dark = max(band3 - cream, 0.);
    vec3 far = mix(mix(vec3(.39, .168, .082), vec3(.6, .52, .37), cream), vec3(.062, .092, .135), dark);
    vec3 near = mix(mix(vec3(.405, .17, .082) * (.93 + .14 * h) * (1. - .1 * hd), vec3(.62, .54, .38) * (.93 + .14 * h), cream), vec3(.055, .085, .13) * (.85 + .3 * h), dark);
    base = mix(far, mix(near, vec3(.47, .42, .34), jn), 1. - smoothstep(.1, .3, px));
  } else {
    // glazed tiles (the bay's dado, panels and friezes): rows half a metre high. Kind 3 in bands: of every eight rows five
    // are cream, one blue-black, one a zigzag of deep green on cream, one blue-black. Kind 4 plain: every row cream
    float th = .5, row = floor(uv.y / th), bnd = vP.z > 3.5 ? 0. : mod(row, 8.), uo = uv.x / th + .5 * mod(row, 2.);
    vec2 f = vec2(fract(uo), fract(uv.y / th)), fw = fwidth(vec2(uv.x / th, uv.y / th)) + 1e-5, e = min(f, 1. - f);
    float jn = max(1. - smoothstep(.03, .03 + fw.x, e.x), 1. - smoothstep(.03, .03 + fw.y, e.y)), h = sh12(vec2(floor(uo), row));
    px = max(fw.x, fw.y);
    vec3 cream = vec3(.66, .6, .45), dark = vec3(.03, .055, .09), green = vec3(.05, .25, .2);
    float zig = step(abs(fract(uv.x / th * .5) - .5) * 2., f.y);
    vec3 t = bnd < 4.5 ? cream : bnd < 5.5 ? dark : bnd < 6.5 ? mix(cream, green, zig) : dark;
    vec3 far = bnd < 4.5 ? cream : bnd < 5.5 ? dark : bnd < 6.5 ? mix(cream, green, .5) : dark;
    base = mix(far, t * (.93 + .14 * h) * (1. - .45 * jn), 1. - smoothstep(.12, .34, px));
  }
  float soot = svn(uv * vec2(.045, .11)) * .6 + svn(uv * vec2(.37, .23) + 9.) * .4;
  float sk = vP.z > 1.5 ? .1 : .4;
  base *= (1. - .55 * sk + sk * soot) * mix(1. - .65 * sk, 1., smoothstep(0., 5., vWp.y)) * vP.w;
  // shade drawn into the stuff itself (the hall's own light is even): what faces down (a soffit, the underside of a
  // cornice or a string course) lies in shade
  vec3 nW = (vec4(vNormal, 0.) * viewMatrix).xyz; nW /= max(length(nW), 1e-4);
  base *= 1. - .5 * smoothstep(.25, .8, -nW.y);
  // the low sun on the hall's own walls: the same bars of light and shade as on the floor and the doors (never in the bay).
  // Brick in shade is a good deal darker and redder; a wall turned from the sun is darker again, most at its foot
  if (abs(vWp.x) > ${V(E-8)} || abs(vWp.z) > ${V(A.z1-10)}) {
    float lit = smoothstep(.45, .95, shedSunShade(vWp, uSun)), turned = 1. - smoothstep(-.3, .25, dot(nW, uSun));
    vec3 shade = vec3(.64, .55, .49) * (1. - turned * (.14 + .2 * (1. - smoothstep(2., 30., vWp.y))));
    base *= mix(vec3(1.), mix(shade, vec3(1.12, 1.1, 1.06), lit), uPool);
  }
  diffuseColor.rgb = base;
  if (vP.w > 1.05) shedGlow = base * uSunCol * .085;            // an inside face of the bay: sunlit, a shade warmer
}
`,$e=`
{
  vec2 p = vWp.xz; vec3 base, tile = vec3(0.); float tone, joint, px, pave = 0., tsh = 0.;
  if (vP.z < .5) {
    vec2 q = vec2(p.x + p.y, p.y - p.x) * (.7071 / .36), c = floor(q), f = fract(q), bid, l;
    float m = mod(c.x - c.y, 4.);
    if (m < .5) { bid = c; l = f; } else if (m < 1.5) { bid = c - vec2(1., 0.); l = vec2(f.x + 1., f.y); }
    else if (m < 2.5) { bid = c - vec2(0., 1.) + 100.; l = vec2(f.y + 1., f.x); } else { bid = c + 100.; l = vec2(f.y, f.x); }
    vec2 fw = fwidth(q) + 1e-5; px = max(fw.x, fw.y);
    float e = min(min(l.x, 2. - l.x), min(l.y, 1. - l.y));
    joint = 1. - smoothstep(.03, .03 + px, e);
    tone = .7 + .6 * sh12(bid) + .25 * (svn(vec2(l.x * 1.5 + bid.x * 3.1, l.y * 14. + bid.y * 7.3)) - .5);
  } else if (vP.z > 1.5) {
    // the bay's floor: one pattern from wall to wall: plain tiles on the diagonal, terracotta and cream, a small black tile at every meeting
    vec2 q = vec2(p.x + p.y, p.y - p.x) * (.7071 / .95), c = floor(q), f = fract(q), fw = fwidth(q) + 1e-5; px = max(fw.x, fw.y);
    float chk = mod(c.x + c.y, 2.), cx = min(f.x, 1. - f.x), cy = min(f.y, 1. - f.y);
    float corner = 1. - smoothstep(.17, .17 + px, max(cx, cy)), jt = 1. - smoothstep(.012, .012 + px, min(cx, cy));
    vec3 t = mix(vec3(.43, .165, .078), vec3(.63, .54, .37), chk) * (.92 + .16 * sh12(c));
    t = mix(t, vec3(.055, .055, .06), corner); t *= 1. - .35 * jt * (1. - corner);
    t = mix(vec3(.47, .31, .2), t, 1. - smoothstep(.12, .34, px));
    tile = t; joint = 0.; tone = 1.;
  } else {
    vec2 q = vec2(p.x / .9, p.y / 7.), c = floor(q), f = fract(q); vec2 fw = fwidth(q) + 1e-5; px = fw.x;
    joint = 1. - smoothstep(.03, .03 + fw.x, min(f.x, 1. - f.x));
    tone = .75 + .5 * sh12(vec2(c.x, 3.)) + .25 * (svn(vec2(p.x * 9., p.y * .8)) - .5);
  }
  float keep = 1. - smoothstep(.3, 1.1, px);
  base = vec3(.25, .165, .095) * mix(1., tone * (1. - .55 * joint), keep);
  if (vP.z > 1.5) base = tile;
  if (vP.z < .5) {
    float pw = max(fwidth(p.x), fwidth(p.y)) + 1e-5;
    // every rib bay of the paving its own tone from wall to wall (so no kerb and no joint between two pavings runs
    // along the hall); here and there a patch of newer blocks; wear and old stains
    float rb = ${V(A.ribStep)}, zr = p.y - ${V(U[0])};
    base *= .88 + .24 * sh12(vec2(3.7, floor(zr / rb)) + uSeed.y);
    vec2 cid = floor(p / vec2(12., 10.)), cp = (p - cid * vec2(12., 10.)); cid += uSeed.y; float hp = sh12(cid + 41.3);
    vec2 pc = vec2(3.5 + 5. * sh12(cid + 7.1), 3. + 4. * sh12(cid + 19.9)), ph = vec2(1.4 + 2.6 * sh12(cid + 2.3), 1.2 + 2. * sh12(cid + 11.7));
    vec2 dq = abs(cp - pc) - ph; float fresh = step(.7, hp) * (1. - smoothstep(0., pw + .02, max(dq.x, dq.y)));
    base = mix(base, base * vec3(1.42, 1.3, 1.02), fresh);
    float wear = svn(p * .028) * .6 + svn(p * .11 + 5.) * .4;
    base = mix(base, vec3(.3, .25, .19) * (.8 + .4 * wear), .4 * smoothstep(.45, .8, wear));
    base *= 1. - .3 * smoothstep(.62, .85, svn(p * .045 + 31.));
    // PAVING COURSES, by place in metres: the blocks are laid in courses square across the hall from wall to wall (no
    // joint of them runs lengthwise). Midway between two ribs a band of dark paving brick, two courses breaking joint,
    // with small iron gullies 12 m apart, set off from band to band; at the quarters a narrow strip of stone. A fine
    // line is widened to a pixel by the footprint only and fades as it widens; far off the courses go into the paving.
    float cb = rb * .25, ci = floor(zr / cb + .5), zs = zr - ci * cb, zb = abs(zs), kb = mod(ci, 4.), pz = fwidth(p.y) + 1e-5;
    float isB = step(1.5, kb) * step(kb, 2.5), nearC = 1. - smoothstep(.3 * cb, cb, pz);
    float cov = lineCov(zb, mix(.13, .45, isB), pz) * nearC * (1. - step(kb, .5));
    float crs = step(0., zs), bx = abs(fract(p.x / .5 + .5 * crs) - .5) * .5, fineC = (1. - smoothstep(.1, .45, pw)) * (1. - smoothstep(.1, .6, pz));
    float bjn = max(lineCov(bx, .02, pw), max(lineCov(zb, .02, pz), lineCov(abs(zb - .45), .03, pz))) * fineC;
    vec3 brk = vec3(.15, .136, .128) * (.82 + .36 * sh12(vec2(floor(p.x / .5 + .5 * crs), ci * 2. + crs)) * fineC + .18 * (1. - fineC)) * (1. - .5 * bjn);
    vec3 strip = vec3(.34, .32, .275) * (.85 + .3 * sh12(vec2(floor(p.x / 1.7), ci))) * (1. - .4 * lineCov(abs(fract(p.x / 1.7) - .5) * 1.7, .02, pw) * fineC);
    base = mix(base, mix(strip, brk, isB), cov);
    float gx = abs(fract((p.x + 6. * mod(floor(ci * .25), 2.)) / 12. + .5) - .5) * 12.;
    float gul = lineCov(gx, .32, pw) * lineCov(zb, .32, pz) * isB * (1. - smoothstep(.2, 1.2, max(pw, pz)));
    base = mix(base, vec3(.04, .044, .05) * (1. + 1.5 * step(.5, fract(p.x / .11)) * fineC), gul);
    pave = cov * mix(.35, .7, isB);
    // rails set flush in the paving, both through the turntable, never along the flown line: a cross track square
    // across the hall toward both streets, and a through track from a gated doorway in one long wall to the doorway
    // opposite in the other (its angle follows from the two doorways); a bed of stone setts between and beside the rails
    vec2 tt = p - vec2(${V(ae.x)}, ${V(ae.z)}), sd = vec2(${V(Math.sin(N.slant))}, ${V(Math.cos(N.slant))}); float rt = length(tt), tw = ${V(ae.r)};
    float sa = dot(tt, sd), sc = abs(sd.x * tt.y - sd.y * tt.x), hg = ${V(N.gauge/2)}, hb = ${V(N.bed)};
    float onB = step(abs(tt.x), ${V(N.reach)}), onC = step(${V(-N.slantReach[1])}, sa) * step(sa, ${V(N.slantReach[0])}), tab = 1. - smoothstep(tw, tw + pw, rt);
    float bed = max(onB * (1. - smoothstep(hb, hb + pw, abs(tt.y))), onC * (1. - smoothstep(hb, hb + pw, sc)));
    vec2 sq = vec2(p.x / .8 + .5 * mod(floor(p.y / .5), 2.), p.y / .5), sf = fract(sq);
    float sjn = 1. - smoothstep(.06, .06 + pw * 2., min(min(sf.x, 1. - sf.x), min(sf.y, 1. - sf.y)));
    base = mix(base, vec3(.33, .31, .27) * (.8 + .4 * sh12(floor(sq) + 7.)) * (1. - .45 * sjn * (1. - smoothstep(.08, .3, pw))), bed);
    // a stone kerb beside each rib's line, an iron drain channel on the line itself, square across the hall; where the
    // through track meets them they run on across its bed (its rails are let into the kerb and bridge the drain)
    float zc = abs(fract(zr / rb + .5) - .5) * rb, kerb = 1. - smoothstep(1.3, 1.3 + pw, zc);
    float sj = 1. - smoothstep(.03, .03 + pw, abs(fract(p.x / 2.6 + .5) - .5) * 2.6);
    vec3 stone = vec3(.36, .34, .29) * (.82 + .3 * sh12(vec2(floor(p.x / 2.6 + .5), floor(zr / rb + .5)))) * (1. - .4 * sj * (1. - smoothstep(.05, .4, pw)));
    base = mix(base, stone, kerb);
    float drain = 1. - smoothstep(.42, .42 + pw, zc), slot = step(.5, fract(p.x / .5)) * (1. - smoothstep(.1, .45, pw));
    base = mix(base, vec3(.045, .05, .055) * (1. + 1.6 * slot), drain);
    // the turntable: a round deck of boards in an iron ring; over all, the rails: a groove and a steel head
    float bj = 1. - smoothstep(.03, .03 + pw, abs(fract(tt.y / .45 + .5) - .5) * .45);
    base = mix(base, vec3(.3, .215, .13) * (.75 + .5 * sh12(vec2(floor(tt.y / .45 + .5), 5.))) * (1. - .5 * bj * (1. - smoothstep(.08, .3, pw))), tab);
    base = mix(base, vec3(.05, .055, .06), 1. - smoothstep(.18, .18 + pw, abs(rt - tw)));
    float dr = min(mix(99., abs(abs(tt.y) - hg), max(onB, tab)), mix(99., abs(sc - hg), max(onC, tab)));
    base = mix(base, vec3(.04, .042, .046), 1. - smoothstep(.2, .2 + pw, dr));
    base = mix(base, vec3(.42, .43, .45), (1. - smoothstep(.07, .07 + pw, dr)) * (1. - smoothstep(.2, .6, pw)));
    // THE MOUTH'S SILL (the far store begins beyond it): past the end wall's face the floor is one course of long
    // stones, flush with the paving, a fine joint where the two meet
    float sill = 1. - smoothstep(-pw, 0., p.y - ${V(H.wallZ)}), sfine = 1. - smoothstep(.1, .5, max(pw, pz));
    float sjl = max(lineCov(abs(fract(p.x / 3.2 + .5) - .5) * 3.2, .02, pw) * sill, lineCov(abs(p.y - ${V(H.wallZ)}), .025, pz)) * sfine;
    base = mix(base, vec3(.36, .34, .29) * (.84 + .28 * sh12(vec2(floor(p.x / 3.2 + .5), 77.))), sill) * (1. - .4 * sjl);
    pave = max(pave, .7 * sill);
  }
  // the walk: a slightly more worn band inside the lowest street
  float oval = abs(length(vec2(p.x, max(abs(p.y) - ${V(me)}, 0.))) - ${V(be(0)-7)});
  float walk = 1. - smoothstep(2.2, 3.6, oval);
  base *= vP.z > 1.5 ? 1. : mix(1., .96, walk) * (.84 + .3 * svn(p * .07));
  // the long light: sun through the great screen lies on the floor as a half-round pool crossed by the shadows of its
  // bars; further up the hall it comes through the roof, crossed by the long shadows of the ribs
  float lit = shedSunShade(vec3(p.x, 0., p.y), uSun);
  lit *= smoothstep(${V(H.wallZ-ke.depth)}, ${V(H.wallZ)}, p.y);          // the hall's light dies on the mouth's sill: none of it lies beyond
  // THE DOOR TRAINS' SHADOWS, by place: every street of doors hangs as a ribbon under its oval rail, from its sills to
  // its heads, and the plan's sun lays that ribbon on the floor as a soft band: broad where the sun crosses a street,
  // narrow where it runs along one (a single door's own sharp shadow is the shadow map's). Only where the sun falls.
  if (vP.z < 1.5) {
    vec2 sw = uSun.xz / max(uSun.y, .1);
${Array.from({length:Pe},(h,z)=>`    tsh = max(tsh, trainBand(p, sw, ${V(be(z))}, ${V(we(z)-ne.drop)}, ${V(we(z)-ne.drop+ne.frameH)}));
`).join("")}    tsh *= smoothstep(.15, 1., lit) * uPool;
    base *= 1. - .3 * tsh;
  }
  base *= mix(1., vP.z > 1.5 ? .54 + .6 * lit : .4 + .78 * smoothstep(.15, 1., lit), uPool);
  if (vP.z > 1.5) {                              // the bay's glass roof lays a faint ladder of light on the tiles, rib by rib
    float rs = ${V(Me)}, rung = smoothstep(.08, .42, abs(fract((p.y - ${V(ve.zBack)}) / rs + .5) - .5) * rs);
    base *= mix(.94, 1.12, rung * smoothstep(0., 1.6, ${V(ve.x1)} - abs(p.x)));
  }
  diffuseColor.rgb = base * vP.w;
  // the sheen: the end screen and the roof's light mirrored softly in the worn wood (a pale even light, never the sky's blue)
  vec3 V = vWp - cameraPosition; V /= max(length(V), 1e-3);
  vec3 R = vec3(V.x, abs(V.y) + 1e-3, V.z); float c1 = 1. - clamp(R.y, 0., 1.), fr = c1 * c1; fr = .03 + .97 * fr * fr * c1;
  float tr = (uEnd * ${V(A.z1)} - vWp.z) / (abs(R.z) < 1e-3 ? 1e-3 : R.z); vec3 glow = uSkyCol * .34;
  if (tr > 0.) {
    vec2 hp = vec2(vWp.x + R.x * tr, vWp.y + R.y * tr - ${V(T.cy)}), ds = hp - uSpot.xy; float blur = 4. + tr * .07;
    float m = smoothstep(-blur, blur, ${V(T.r)} - length(hp)) * smoothstep(-blur, blur, hp.y);
    glow = mix(glow, uSunCol * (.27 + .5 * exp(-dot(ds, ds) / (2. * uSpot.z * uSpot.z))), m);
  }
  // (brick and stone courses are matt, and a street's shade takes a little of the sheen: the far deck keeps its lines)
  shedGlow = glow * fr * uSheen * (.55 + .9 * svn(p * .9)) * (1. - pave) * (1. - .3 * tsh);
}
`,Be=`
uniform vec3 uSun, uSunCol, uSkyCol, uSpot; uniform float uEnd, uPool, uSheen; uniform vec2 uSeed;
// how much of a pixel px wide, its middle d from a line's middle, a line of half width hw covers: a fine line is
// widened to a pixel by the footprint only, and fades as it widens
float lineCov(float d, float hw, float px){ return clamp((hw - d) / px + .5, 0., 1.) - clamp((-hw - d) / px + .5, 0., 1.); }
// a street of doors under one oval rail (radius R, straights to the plan's length) as a ribbon from the height h0 to
// h1: 1 where the line from the floor's place p toward the sun (sw: metres across per metre up) goes through it
float ovalD(vec2 q, float R){ vec2 c = vec2(q.x, max(abs(q.y) - ${V(me)}, 0.)); return sqrt(dot(c, c) + 1e-6) - R; }
float trainBand(vec2 p, vec2 sw, float R, float h0, float h1){
  float fa = ovalD(p + sw * h0, R), fb = ovalD(p + sw * h1, R), fm = ovalD(p + sw * (.5 * (h0 + h1)), R);
  float lo = min(fa, min(fm, fb)), hi = max(fa, max(fm, fb)), e = .5 + .02 * h1;
  return smoothstep(-e, e, hi) * (1. - smoothstep(-e, e, lo));
}
`+re,Fe=`
{
  vec2 uv = vP.xy; vec3 paint = vec3(.03, .115, .072), base = paint * (.72 + .56 * svn(uv * .35));
  if (vP.z > 2.5) {
    // the yard's things: w picks the stuff: 1 black iron, 2 bare rail steel, 3 timber, 4 grey-blue paint, 5 buff paint, 6 grey primer
    base = (vP.w < 1.5 ? vec3(.035, .037, .04) : vP.w < 2.5 ? vec3(.2, .17, .15) : vP.w < 3.5 ? vec3(.36, .26, .15) : vP.w < 4.5 ? vec3(.16, .27, .34) : vP.w < 5.5 ? vec3(.5, .42, .24) : vec3(.4, .4, .37)) * (.8 + .4 * svn(uv * 1.3));
  } else if (vP.z > 1.5) {
    base = paint * .9;
    // (w over 1: the bay's gates. A leaf's own tone, and the sky's fill on it, so that the bars are seen in shade too)
    if (vP.w > 1.03) { base = paint * vP.w; shedGlow = base * uSkyCol * .5; }
  } else if (vP.z > .5) {
    float d = max(vP.w, .6), cell = 3.2, ft = fract(uv.x / cell), k = d * cell / sqrt(cell * cell + d * d);
    float px = max(fwidth(uv.x), fwidth(uv.y) * d) + 1e-5;
    float dd = min(abs(uv.y - ft), abs(uv.y - (1. - ft))) * k, dv = min(ft, 1. - ft) * cell, de = min(uv.y, 1. - uv.y) * d;
    float solid = max(max(1. - smoothstep(.16 - px * .5, .16 + px * .5, dd), 1. - smoothstep(.13 - px * .5, .13 + px * .5, dv)), 1. - smoothstep(.32 - px * .5, .32 + px * .5, de));
    solid = max(solid, 1. - smoothstep(1.5, 1.9, d));                       // near the pins the web is plate
    solid = mix(solid, max(solid, .5), smoothstep(.5, 1.6, px));
    vec2 c = fract(vec2(uv.x, uv.y * d) / .7) - .5; float rv = (1. - smoothstep(.09, .09 + px, length(c) * .7)) * (1. - smoothstep(.12, .5, px));
    base = mix(base, paint * 2.3 + .015, rv * step(d, 1.7)) * solid;
    vec3 Vw = vWp - cameraPosition; Vw /= max(length(Vw), 1e-3); float upw = clamp(Vw.y, 0., 1.);
    float sw = .5 + .5 * dot(Vw, uSun);
    shedGlow = mix(mix(mix(uSkyZen, vec3(.8, .86, .95), .28), uSkyHor, sw * sw), uSkyZen, smoothstep(0., .6, upw)) * mix(.78, 1.14, sw) * (1. - solid) * .96;
  } else {
    float px = max(fwidth(uv.x), fwidth(uv.y)) + 1e-5;
    vec2 c = fract(uv / .7) - .5; float rv = 1. - smoothstep(.09, .09 + px, length(c) * .7);
    float seam = 1. - smoothstep(.03, .03 + px, abs(fract(uv.x / 5.6 + .5) - .5) * 5.6);
    base = mix(base, paint * 2.3 + .015, rv * (1. - smoothstep(.12, .5, px)) + .16 * smoothstep(.12, .5, px));
    base *= 1. - .5 * seam * (1. - smoothstep(.05, .3, px));
  }
  diffuseColor.rgb = base;
}
`,Oe=`
uniform float uTime, uRain, uCloud; uniform vec3 uSun, uSunCol, uSkyCol, uSpot, uSkyZen, uSkyHor, uCloudCol; uniform vec2 uCover, uSeed, uLantern;
varying vec4 vP; varying vec3 vWp;
#ifdef USE_FOG
uniform vec3 fogColor; varying float vFogDepth; uniform float fogDensity; uniform float fogNear; uniform float fogFar;
#endif
`+Se+`
float bar(float d, float hw, float px){ return (1. - smoothstep(hw, hw + px, d)) * clamp(2. * hw / (px + 1e-4), 0., 1.); }
// a row of bars, cell metres apart, hw their half width; e = the distance to the nearest in cells (0..0.5); px = metres to
// a pixel: under a few pixels to a cell they fade to their even tone (never dots)
float bars(float e, float cell, float hw, float px){ return mix(bar(e * cell, hw, px), 2. * hw / cell, smoothstep(.16 * cell, .42 * cell, px)); }
// the sky as seen through clear glass, by the direction of sight alone (it stands at the far plane): a clear blue, deeper
// overhead and away from the sun, paling to white-gold only round the sun's place; a few slow clouds whose forms are
// seen, their fine grain fading by its footprint (no shimmer at a low angle); never a disc
vec3 skyThrough(vec3 V, float lobe){
  float up = clamp(V.y, 0., 1.), sunw = .5 + .5 * dot(V, uSun), t = smoothstep(0., .6, up);
  // the horizon takes its own colour toward the sun and a pale one of the zenith's away from it; between a warm horizon
  // and the blue above lies a pale band (never a mauve one)
  vec3 hz = mix(mix(uSkyZen, vec3(.8, .86, .95), .28), uSkyHor, sunw * sunw);
  vec3 sky = mix(hz, uSkyZen, t) * mix(.78, 1.14, sunw);
  sky += vec3(.9, .9, .85) * max(uSkyHor.r - uSkyHor.b, 0.) * 1.6 * t * (1. - t) * sunw;
  vec2 c = V.xz / max(V.y, .16) * 1.7 + vec2(uTime * .012, uTime * .005), cw = fwidth(c);
  float fine = 1. - smoothstep(.2, .8, max(cw.x, cw.y));
  float n = svn(c) * .56 + mix(.22, svn(c * 2.1 + 4.7) * .28 + svn(c * 4.3 + 9.1) * .16, fine);
  float cl = smoothstep(uCover.x, uCover.y, n) * smoothstep(.16, .34, V.y), thick = smoothstep(uCover.y, uCover.y + .16, n);
  sky = mix(sky, uCloudCol * (.84 + .22 * svn(c * 1.7 + 2.) - .2 * thick), cl * .95);
  float l2 = lobe * lobe;
  return sky + uSunCol * (l2 * .1 + l2 * l2 * .25);
}
void main(){
  vec3 V = vWp - cameraPosition; V /= max(length(V), 1e-3);
  float s = max(dot(V, uSun), 0.), s2 = s * s, lobe = s2 * s2; lobe *= lobe;
  vec3 col; float iron = 0.;
  float cloud = svn(vWp.xz * .011 + vec2(uTime * .016, uTime * .007)) * .6 + svn(vWp.zx * .029 - uTime * .011) * .4;
  if (vP.z < .5) {
    // the roof: panes 1.25 by 3.3 between fine bars. Most are clear and show the day outside; one in sixteen is old
    // obscured glass, a few are dusty or mended; an obscured pane takes the colour of the sky behind it, paler (never a white sheet)
    vec2 q = vec2(vP.x / 1.25, vP.y / 3.3), id = floor(q) + uSeed.x, f = fract(q), fw = fwidth(q) + 1e-5, e = min(f, 1. - f);
    iron = max(bars(e.x, 1.25, .055, fw.x * 1.25), bars(e.y, 3.3, .1, fw.y * 3.3));
    float h1 = sh12(id), h2 = sh12(id + 31.7), far = smoothstep(.16, .42, max(fw.x, fw.y));
    float frostK = mix(.03, .22, h1 * h1); frostK = mix(frostK, .62, step(.94, h2)); frostK = mix(frostK, .12, far);
    float streak = svn(vec2(vP.x * 2.6, vP.y * .22 - uTime * uRain * .8)), grime = svn(vP.xy * .35);
    vec3 thru = skyThrough(V, lobe);
    vec3 milk = mix(thru, uSkyCol, .5) * (1. - uCloud * .3 + uCloud * .6 * cloud) * (.9 + .16 * grime + .08 * streak);
    milk = mix(milk, milk * vec3(.92, .86, .72), step(.96, h2));                          // a dusty pane
    col = mix(thru, milk, frostK) * mix(.93 + .14 * sh12(id + 5.3), 1., far);
    float mend = step(.94, sh12(id + 13.9)) * (1. - far);                                // a mended pane: a lead across it, two glasses
    iron = max(iron, mend * bar(abs(f.y - .45) * 3.3, .05, fw.y * 3.3) * (1. - far));
    col = mix(col, col * vec3(.84, .96, .9), mend * step(.45, f.y));
    col *= mix(vec3(1.08, 1.03, .95), vec3(.86, .93, 1.), smoothstep(${V(A.z0)}, ${V(A.z1)}, vWp.z * sign(-uSun.z)));     // deeper toward the end away from the sun
    col += uSunCol * (lobe * .1 + lobe * lobe * .3) * frostK;
    col = mix(col, col * (.7 + .5 * streak), uRain * .6);
  } else if (vP.z < 1.5) {
    float r = length(vP.xy), a = atan(vP.y, abs(vP.x) < 1e-4 ? 1e-4 : vP.x), sec = a / (3.14159265 / 24.), pr = fwidth(r) + 1e-5;
    float dsec = abs(fract(sec + .5) - .5) * (3.14159265 / 24.) * r, heavy = step(abs(fract(sec / 4. + .5) - .5), .13);
    float dring = abs(fract((r - 14.) / 12. + .5) - .5) * 12.;
    iron = max(bar(dsec, mix(.16, .42, heavy), pr), bar(dring, .3, pr) * step(13., r));
    iron = max(iron, 1. - smoothstep(3.2, 3.2 + pr, r));
    iron = max(iron, bar(vP.y, .5, pr));
    vec2 dsp = vP.xy - uSpot.xy; float g = exp(-dot(dsp, dsp) / (2. * uSpot.z * uSpot.z));
    float frost = .88 + .2 * svn(vP.xy * .6);
    vec3 sunny = uSunCol * (.16 + g * .32 + lobe * .04) * frost;
    vec2 pid = vec2(floor(sec), floor((r - 14.) / 12.)); float ph = sh12(pid + 3.3);
    vec3 thru = skyThrough(V, lobe), shady = mix(thru, mix(thru, uSkyCol * (1.05 + .15 * cloud), .55) * frost, mix(.08, .5, ph));
    col = mix(shady, sunny, vP.w) * (.92 + .16 * sh12(pid + 9.9));
  } else if (vP.z > 3.5) {
    // the lantern: evenly bright frosted glass. Its top (w 2) has twelve facets: bars radiate in three ranks (twelve ribs that
    // taper to nothing at the apex, twelve bars between them, twenty-four fine ones further out) so that they never crowd
    // into a hub, crossed by fine twelve-sided rings, all alike; its walls (w 1) are small panes
    float face = 1.;
    if (vP.w > 1.5) {
      float r = length(vP.xy) + 1e-4, a = atan(vP.y, abs(vP.x) < 1e-4 ? 1e-4 : vP.x), pr = fwidth(r) + 1e-5;
      float lan = mod(a + .2618, .5236) - .2618, al = abs(lan), rp = r * cos(lan), gap = .2618 * r;
      float rib = bar((.2618 - al) * r, .12 * clamp(r / 3., 0., 1.), pr);
      float mid = bar(al * r, .07, pr) * smoothstep(4.2, 5.2, r);
      float fine = mix(bar(abs(al - .1309) * r, .045, pr), .09 / max(gap, .1), smoothstep(.12 * gap, .3 * gap, pr)) * smoothstep(6.3, 7.3, r);
      float ring = bars(abs(fract(rp / 2.1 + .5) - .5), 2.1, .05, pr) * smoothstep(3., 3.2, rp);
      iron = max(max(rib, mid), max(fine, ring)) * .86;
      face = 1. + .06 * cos(a - lan - atan(uSun.z, abs(uSun.x) < 1e-4 ? 1e-4 : uSun.x));
    } else {
      vec2 ps = vec2(.84, 1.9), q = vP.xy / ps, f = fract(q), fw = fwidth(q) + 1e-5, e = min(f, 1. - f);
      iron = max(bars(e.x, ps.x, .04, fw.x * ps.x), bars(e.y, ps.y, .05, fw.y * ps.y)) * .86;
    }
    col = uSkyCol * 1.16 * face + uSunCol * lobe * .15;
  } else {
    vec2 ps = vP.z > 2.5 ? vec2(.9167, 2.667) : vec2(1.7); float hw = vP.z > 2.5 ? .035 : .07;
    vec2 q = vP.xy / ps, f = fract(q), fw = fwidth(q) + 1e-5, e = min(f, 1. - f);
    iron = max(bars(e.x, ps.x, hw, fw.x * ps.x), bars(e.y, ps.y, hw, fw.y * ps.y));
    col = uSkyCol * 1.06 * vP.w + uSunCol * lobe * .1;                       // obscured glass: no picture of the sky in it
  }
  col = mix(col, vec3(.012, .013, .016), iron);
  gl_FragColor = vec4(col, 1.);
#ifdef USE_FOG
  #ifdef FOG_EXP2
  float ff = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
  float ff = smoothstep(fogNear, fogFar, vFogDepth);
  #endif
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, ff * .55);
#endif
  vec2 ld = vWp.xz - uLantern; float lan = mod(atan(ld.y, abs(ld.x) < 1e-4 ? 1e-4 : ld.x) + .2618, .5236) - .2618;      // the roof's glass is open in a twelve-sided round
  if (vP.z < .5 && length(ld) * cos(lan) < 12.3) discard;
}
`,Ie=`
attribute vec4 aP; varying vec4 vP; varying vec3 vWp;
#ifdef USE_FOG
varying float vFogDepth;
#endif
void main(){
  vP = aP; vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
#ifdef USE_FOG
  vFogDepth = -mvPosition.z;
#endif
}
`;function Te(h){return h==="golden"?{sun:[4.6,2.9,1.25],sky:[.74,.66,.55],zen:[.1,.22,.55],hor:[1,.72,.4],cloudCol:[1,.8,.58],cover:[.6,.7],rain:0,cloud:.5,sheen:1.1,pool:1}:h==="dawn"?{sun:[3.6,2.7,2.5],sky:[.7,.64,.68],zen:[.16,.28,.6],hor:[.98,.76,.5],cloudCol:[1,.88,.76],cover:[.58,.69],rain:0,cloud:.4,sheen:1,pool:.8}:h==="night"?{sun:[1.5,1.6,1.75],sky:[.6,.65,.71],zen:[.5,.55,.62],hor:[.66,.7,.75],cloudCol:[.74,.78,.84],cover:[0,.42],rain:1,cloud:.7,sheen:1.9,pool:0}:{sun:[4.2,3.4,2.3],sky:[.66,.72,.8],zen:[.04,.17,.62],hor:[.2,.44,.9],cloudCol:[.96,.95,.92],cover:[.65,.73],rain:0,cloud:.5,sheen:1,pool:1}}function Q(h,z){const v=(f,e,o,s)=>h.quad(z(f[0],f[1],f[2]),z(e[0],e[1],e[2]),z(o[0],o[1],o[2]),z(s[0],s[1],s[2])),_=(f,e,o,s)=>{const u=[];for(let d=0;d<=s;d++){const P=Math.PI*d/s;u.push([f+o*Math.cos(P),e+o*Math.sin(P)])}return u},k={rect(f,e,o,s,u=0){v([f,o,u],[e,o,u],[e,s,u],[f,s,u])},block(f,e,o,s,u,d,P=""){v([f,o,d],[e,o,d],[e,s,d],[f,s,d]),P.includes("r")||v([e,o,d],[e,o,u],[e,s,u],[e,s,d]),P.includes("l")||v([f,o,u],[f,o,d],[f,s,d],[f,s,u]),P.includes("u")||v([f,s,d],[e,s,d],[e,s,u],[f,s,u]),P.includes("d")||v([f,o,u],[e,o,u],[e,o,d],[f,o,d])},arched(f,e,o,s,u,d,P=8,S,B=.4){let q=f;for(const[l,C,F,j]of u){l-C>q&&k.rect(q,l-C,o,s),q=l+C;const p=_(l,F,C,P),y=_(l,F,C+.9,P),O=Object.assign({},h.st);for(let m=0;m<P;m++)v([p[m+1][0],p[m+1][1],0],[p[m][0],p[m][1],0],[p[m][0],s,0],[p[m+1][0],s,0]),v([p[m][0],p[m][1],-d],[p[m][0],p[m][1],0],[p[m+1][0],p[m+1][1],0],[p[m+1][0],p[m+1][1],-d]);v([l+C,o,-d],[l+C,o,0],[l+C,F,0],[l+C,F,-d]),v([l-C,o,0],[l-C,o,-d],[l-C,F,-d],[l-C,F,0]),h.set({kind:1,w:1});for(let m=0;m<P;m++)v([p[m][0],p[m][1],.4],[y[m][0],y[m][1],.4],[y[m+1][0],y[m+1][1],.4],[p[m+1][0],p[m+1][1],.4]),v([y[m][0],y[m][1],.4],[y[m][0],y[m][1],0],[y[m+1][0],y[m+1][1],0],[y[m+1][0],y[m+1][1],.4]);k.block(l-.6,l+.6,F+C-.3,F+C+1.7,0,.8),k.block(l+C-.3,l+C+1.1,F-.7,F+.2,0,.7),k.block(l-C-1.1,l-C+.3,F-.7,F+.2,0,.7),h.set(O);const K=[[l-C,o],[l+C,o]].concat(p);S?S(K.map(m=>z(m[0],m[1],-d)),K.map(m=>[m[0]-l,m[1]-o])):(h.set({w:O.w*(j||B)}),h.poly(K.map(m=>z(m[0],m[1],-d))),h.set(O))}q<e&&k.rect(q,e,o,s)}};return k}function te(h,z,v,_,k,f,e){const o=Q(h,z),s=[v].concat(k,[_]),u=[],d=S=>(e.doorways||[]).some(B=>Math.abs(B-S)<.5);for(let S=0;S<s.length-1;S++){const B=s[S],q=s[S+1],l=(B+q)/2,C=q-B-e.pierW,F=[];if(C>2*e.hw*2+3&&e.two)F.push([l-C/4-e.gap,e.hw,e.ys],[l+C/4+e.gap,e.hw,e.ys]);else{const j=Math.min(e.hw,C/2-1.4);j>1.5&&F.push([l,j,e.ys-(e.hw-j)])}h.set({kind:0,w:1});for(const j of F)d(j[0])&&(j.push(.1),u.push(j));o.arched(B,q,0,e.band,F,e.dep),o.rect(B,q,e.band,f)}for(const S of k)h.set({kind:0,w:1}),o.block(S-e.pierW/2,S+e.pierW/2,2.4,f-2.8,0,e.pierD,"ud"),h.set({kind:1}),o.block(S-e.pierW/2-.3,S+e.pierW/2+.3,0,2.4,0,e.pierD+.4,"d"),o.block(S-e.pierW/2-.5,S+e.pierW/2+.5,f-2.8,f,0,e.pierD+.9),o.block(S-e.pierW/2-.2,S+e.pierW/2+.2,e.band,e.band+1.4,0,e.pierD+.5);h.set({kind:1,w:1});let P=v;for(const[S,B]of u.concat([[_,0]]))o.block(P,S-B,0,2.4,0,.7,"d"+(P===v?"l":"")+(S-B===_?"r":"")),P=S+B;o.block(v,_,e.band,e.band+1.4,0,.9,"lr"),o.block(v,_,f-1.3,f,0,1.2,"lru");for(let S=v+1.2;S<_-.6;S+=2.4)o.block(S-.4,S+.4,f-2.4,f-1.3,0,.9,"u");return h.set({kind:0,w:1}),u}function Ee(h,z){const v=A.z1/Math.max(Math.abs(z.z),.2),_=.7*T.r;let k=z.x*v,f=Math.max(8,12+z.y*v-A.spring);const e=Math.hypot(k,f);return e>_&&(k*=_/e,f*=_/e),new h.Vector3(k,f,14)}async function Ze(h,z){const v=z.THREE,_=new v.Group;_.name="doors-in-transit-shed";const k=z.sunDir&&z.sunDir.isVector3?z.sunDir.toArray():z.sunDir||[.15,.5,-.85],f=new v.Vector3(k[0],k[1],k[2]).normalize(),e=f.z<=0?-1:1,o=Te(h.vary&&h.vary.hour),s={uTime:{value:0},uRain:{value:o.rain},uCloud:{value:o.cloud},uSun:{value:f},uSunCol:{value:new v.Vector3(o.sun[0],o.sun[1],o.sun[2])},uSkyCol:{value:new v.Vector3(o.sky[0],o.sky[1],o.sky[2])},uSpot:{value:Ee(v,f)},uSkyZen:{value:new v.Vector3(o.zen[0],o.zen[1],o.zen[2])},uSkyHor:{value:new v.Vector3(o.hor[0],o.hor[1],o.hor[2])},uCloudCol:{value:new v.Vector3(o.cloudCol[0],o.cloudCol[1],o.cloudCol[2])},uCover:{value:new v.Vector2(o.cover[0],o.cover[1])},uLantern:{value:new v.Vector2(oe.x,oe.z)},uSeed:{value:new v.Vector2(0,0)}};z.rngFor&&s.uSeed.value.set(Math.floor(z.rngFor("shed-glass")()*900),Math.floor(z.rngFor("shed-floor")()*900)),xe.value=f,ye.value=o.pool;const u=ie(v,"brick",{roughness:.9,metalness:0},`uniform vec3 uSunCol, uSun; uniform float uPool;
`+re,_e,s);s.uEnd={value:e},s.uPool={value:o.pool},s.uSheen={value:.55*o.sheen};const d=ie(v,"floor",{roughness:.6,metalness:0},Be,$e,s),P=ie(v,"iron",{roughness:.46,metalness:.3,side:v.DoubleSide},`uniform vec3 uSkyCol, uSkyZen, uSkyHor, uSun;
`,Fe,s),S=new v.ShaderMaterial({uniforms:Object.assign(v.UniformsUtils.clone(v.UniformsLib.fog),s),vertexShader:Ie,fragmentShader:Oe,fog:!0}),B=J(),q=J(),l=J(),C=J(),F=J(),j=A.z0,p=A.z1,y=56,O=De(y);await h.yield(),B.quad([-E,0,p],[E,0,p],[E,0,j],[-E,0,j]);const K={pierW:Y.pierW,pierD:2.1,hw:Y.hw,ys:15.5,band:23,dep:Y.dep,gap:Y.gap,two:!0};for(const t of[1,-1]){const n=t>0?(i,b,g)=>[E-g,b,i]:(i,b,g)=>[-E+g,b,-i],w=te(q,n,j,p,U,A.spring,Object.assign({doorways:[t*N.doorZ[t>0?0:1]]},K));for(const[i,b,g]of w){const R=Y.dep,$=(a,r)=>n(a,r,.3-R),c=a=>g+Math.sqrt(Math.max(0,b*b-(a-i)*(a-i)))-.1;B.set({kind:0,w:1}).poly([n(i-b,0,0),n(i+b,0,0),n(i+b,0,-R),n(i-b,0,-R)]),l.set({kind:2,w:1.05});for(const a of[.45,5.6,10.8,g])ge(l,$(i-b,a),$(i+b,a),.07,.2);for(let a=-4;a<=4;a++)ge(l,$(i+a*.66,.45),$(i+a*.66,c(i+a*.66)),.06,a?.11:.2);l.set({kind:0,w:1})}await h.yield()}const m=[];for(let t=0;t<=y;t++){const n=Math.PI*t/y;m.push([T.r*Math.cos(n),T.cy+T.r*Math.sin(n)])}let le=null;for(const t of[-1,1]){const n=t<0?j:p,w=n+t*1.6,i=t>0,b=(c,a,r,x,M)=>i?M.quad(x,r,a,c):M.quad(c,a,r,x);q.set({kind:0,w:1});const g=t<0?(c,a,r)=>[c,a,n+r]:(c,a,r)=>[-c,a,n-r],R=[-84,-60,-36,-12,12,36,60,84],$={pierW:3.4,pierD:2.3,hw:7.6,ys:12.5,band:23,dep:2.6,two:!1};if(t>0)te(q,g,-E,E,R,A.spring,$);else{const c=Object.assign({},$,{dep:ke.depth});te(q,g,-E,H.x0,R.filter(a=>a<H.x0),A.spring,c),te(q,g,H.x1,E,R.filter(a=>a>H.x1),A.spring,c),le=Re(q,l,B,Q,g,$,A.spring)}q.set({kind:1,w:1});for(let c=0;c<y;c++){const a=m[c],r=m[c+1],x=1+3.2/T.r,M=[a[0]*x,T.cy+(a[1]-T.cy)*x],D=[r[0]*x,T.cy+(r[1]-T.cy)*x],W=n-t*1;b([a[0],a[1],W],[M[0],M[1],W],[D[0],D[1],W],[r[0],r[1],W],q),b([M[0],M[1],W],[M[0],M[1],n],[D[0],D[1],n],[D[0],D[1],W],q),b([a[0],a[1],n],[a[0],a[1],W],[r[0],r[1],W],[r[0],r[1],n],q)}Q(q,t<0?(a,r,x)=>[a,r,n+x]:(a,r,x)=>[-a,r,n-x]).block(-T.r-5,T.r+5,A.spring-.2,A.spring+2.2,0,1.9);{const c=Q(q,t<0?(M,D,W)=>[M,D,n+W]:(M,D,W)=>[-M,D,n-W]),a=M=>Math.sqrt(Math.max(0,(T.r+3.2)*(T.r+3.2)-(M-T.cy)*(M-T.cy))),r=M=>{let D=0,W=E;for(let I=0;I<24;I++){const G=(D+W)/2;X(G)>M?D=G:W=G}return D};for(const M of[-1,1]){for(const D of[72,84]){const W=X(D+1.7)-1.4,I=M*D;q.set({kind:0,w:1}),c.block(I-1.7,I+1.7,A.spring+2.2,W-1.6,0,1.3,"ud"),q.set({kind:1,w:1}),c.block(I-2.1,I+2.1,W-1.6,W,0,1.8)}q.set({kind:1,w:1});for(const D of[46,58,70,82,94]){const W=a(D+.65)+.2,I=r(D+1.3)-.4;I-W>2&&c.block(Math.min(M*W,M*I),Math.max(M*W,M*I),D,D+1.3,0,.8,"lr")}}const x=n-t*.9;for(let M=0;M<y;M++){const D=O[M],W=O[M+1],I=[D.x+D.nx*2.4,D.y+D.ny*2.4],G=[W.x+W.nx*2.4,W.y+W.ny*2.4];b([I[0],I[1],x],[D.x,D.y,x],[W.x,W.y,x],[G[0],G[1],x],q),b([I[0],I[1],n],[I[0],I[1],x],[G[0],G[1],x],[G[0],G[1],n],q)}}q.set({kind:0,w:1});for(let c=0;c<y;c++){const a=m[c],r=m[c+1],x=O[c],M=O[c+1];b([a[0],a[1],n],[x.x,x.y,n],[M.x,M.y,n],[r[0],r[1],n],q),q.set({kind:1}),b([a[0],a[1],w],[a[0],a[1],n],[r[0],r[1],n],[r[0],r[1],w],q),q.set({kind:0})}C.set({kind:1,w:t===e?1:0});for(let c=0;c<y;c++){const a=m[c],r=m[c+1],x=[[0,0],[a[0],a[1]-T.cy],[r[0],r[1]-T.cy]];i?C.poly([[0,T.cy,w],[r[0],r[1],w],[a[0],a[1],w]],[x[0],x[2],x[1]]):C.poly([[0,T.cy,w],[a[0],a[1],w],[r[0],r[1],w]],x)}}await h.yield(),C.set({kind:0,w:1});for(let t=0;t<y;t++){const n=O[t],w=O[t+1];C.quad([n.x,n.y,j],[n.x,n.y,p],[w.x,w.y,p],[w.x,w.y,j],[[j,n.s],[p,n.s],[p,w.s],[j,w.s]])}const Z=t=>{const n=t<=y/2?t/(y/2):(y-t)/(y/2);return .9+4.3*Math.pow(Math.sin(Math.PI*Math.min(1,n)),.85)},ce=O.map(t=>[t.x+t.nx*.3,t.y+t.ny*.3]),fe=O.map((t,n)=>[t.x+t.nx*(.3+Z(n)),t.y+t.ny*(.3+Z(n))]),ee=(t,n,w)=>[n[0]+t.nx*w,n[1]+t.ny*w];for(const t of U){for(let i=0;i<y;i++){const b=ce[i],g=ce[i+1],R=fe[i],$=fe[i+1],c=O[i].s,a=O[i+1].s,r=Z(i),x=Z(i+1);l.set({kind:1,w:1}),l.quad([b[0],b[1],t],[R[0],R[1],t],[$[0],$[1],t],[g[0],g[1],t],[[c,0,r],[c,1,r],[a,1,x],[a,0,x]]),l.set({kind:0,w:1}),l.quad([R[0],R[1],t-.6],[R[0],R[1],t+.6],[$[0],$[1],t+.6],[$[0],$[1],t-.6],[[c,.05],[c,1.25],[a,1.25],[a,.05]]),l.quad([b[0],b[1],t-.5],[b[0],b[1],t+.5],[g[0],g[1],t+.5],[g[0],g[1],t-.5],[[c,.15],[c,1.15],[a,1.15],[a,.15]]);const M=ee(O[i],R,-.5),D=ee(O[i+1],$,-.5),W=ee(O[i],b,.42),I=ee(O[i+1],g,.42);for(const G of[-1,1])l.quad([R[0],R[1],t+G*.6],[$[0],$[1],t+G*.6],[D[0],D[1],t+G*.6],[M[0],M[1],t+G*.6],[[c,.1],[a,.1],[a,.6],[c,.6]]),l.quad([b[0],b[1],t+G*.5],[g[0],g[1],t+G*.5],[I[0],I[1],t+G*.5],[W[0],W[1],t+G*.5],[[c,.14],[a,.14],[a,.56],[c,.56]])}const n=O[y/2],w=[];for(let i=0;i<8;i++)w.push([n.x+1.5*Math.cos(i*Math.PI/4),n.y+.9+1.5*Math.sin(i*Math.PI/4),t+.08]);l.poly(w),l.poly(w.map(i=>[i[0],i[1],t-.08]).reverse());for(const i of[-1,1])l.box(Math.min(i*(E-2.6),i*(E-.1)),Math.max(i*(E-2.6),i*(E-.1)),A.spring,A.spring+1.7,t-.95,t+.95,"d");await h.yield()}for(let t=4;t<y;t+=4){const n=O[t],w=-n.ny,i=n.nx,b=.3,g=(r,x)=>[n.x+n.nx*r+w*x,n.y+n.ny*r+i*x],R=g(.3,-b),$=g(.3,b),c=g(1.5,-b),a=g(1.5,b);l.set({kind:0,w:1}),l.quad([c[0],c[1],j],[c[0],c[1],p],[a[0],a[1],p],[a[0],a[1],j],[[j,.05],[p,.05],[p,.65],[j,.65]]),l.set({kind:1,w:1.2}),l.quad([R[0],R[1],j],[R[0],R[1],p],[c[0],c[1],p],[c[0],c[1],j],[[j,0],[p,0],[p,1],[j,1]]),l.quad([a[0],a[1],j],[a[0],a[1],p],[$[0],$[1],p],[$[0],$[1],j],[[j,1],[p,1],[p,0],[j,0]])}l.set({kind:2,w:1});const L=(t,n,w,i,b)=>[t.x+t.nx*n-t.ny*w*i,t.y+t.ny*n+t.nx*w*i,b];for(const t of[0,3,7,10,13])for(const[n,w]of[[2,9],[9,16],[y-9,y-2],[y-16,y-9]])for(const[i,b]of[[n,w],[w,n]]){const g=U[t],R=U[t+1],$=O[i],c=O[b];l.quad(L($,.95,-1,.17,g),L($,.95,1,.17,g),L(c,.95,1,.17,R),L(c,.95,-1,.17,R))}for(const t of[10,20,y-20,y-10]){const n=O[t],w=.5+Z(t);l.quad(L(n,w,-1,.16,j),L(n,w,1,.16,j),L(n,w,1,.16,p),L(n,w,-1,.16,p)),l.quad(L(n,w-.16,0,0,j),L(n,w+.16,0,0,j),L(n,w+.16,0,0,p),L(n,w-.16,0,0,p))}{const w=12.6/Math.cos(Math.PI/12),i=oe.x,b=oe.z,g=X(w)-.4,R=A.crown+9,$=2*w*Math.sin(Math.PI/12),c=[];for(let a=0;a<=12;a++){const r=(a+.5)/12*Math.PI*2;c.push([i+w*Math.cos(r),b+w*Math.sin(r),a*$])}for(let a=0;a<12;a++){const r=c[a],x=c[a+1],M=1-.3/w;C.set({kind:4,w:1}),C.quad([r[0],g,r[1]],[x[0],g,x[1]],[x[0],R,x[1]],[r[0],R,r[1]],[[r[2],0],[x[2],0],[x[2],R-g],[r[2],R-g]]),C.set({kind:4,w:2}),C.poly([[r[0],R,r[1]],[x[0],R,x[1]],[i,R+3.2,b]],[[r[0]-i,r[1]-b],[x[0]-i,x[1]-b],[0,0]]),l.set({kind:2,w:1}),l.quad([r[0],g,r[1]],[x[0],g,x[1]],[x[0],g+.4,x[1]],[r[0],g+.4,r[1]]),l.quad([r[0],g,r[1]],[i+(r[0]-i)*M,g,b+(r[1]-b)*M],[i+(r[0]-i)*M,R,b+(r[1]-b)*M],[r[0],R,r[1]])}l.set({kind:0,w:1})}await h.yield(),Ce(q,l,C,B,Q),await h.yield();const se=await qe(F,h);await h.yield();const he=await je(F,h);se.standing+=he.standing,se.leftOut+=he.leftOut,await h.yield();const ze=[[B,d,!0],[q,u,!0],[l,P,!1],[C,S,!1],[F,P,!0,!0]];let de=0,pe=0;const ue=[];for(const[t,n,w,i]of ze){const b=t.geometry(v),g=new v.Mesh(b,n);g.receiveShadow=w,g.castShadow=!!i,_.add(g),de+=t.triangles(),pe++,ue.push(b,n),await h.yield()}return{object:_,triangles:de,drawCalls:pe,roofY:X,yard:se,mouth:le,update(t,n,w){s.uTime.value=n},dispose(){for(const t of ue)t.dispose()}}}export{re as SHED_SUN_GLSL,Ze as buildShed,X as roofY,ye as shedBarsUniform,xe as shedSunUniform};
