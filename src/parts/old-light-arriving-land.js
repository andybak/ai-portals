import*as m from"three";import{smoothstep as y}from"../kit/core.js";import{LIGHT_GLSL as q,LAMPMAP_GLSL as Y,BAND_GLSL as U,WAY_GLSL as K,WAY_BOX as E,TOWN_LIT_GLSL as j,BACK_STAIR as R,STAR_DIR as Q,QUAY_Z as L,CREST_Z as M,BOWL as S,waterD as T,southG as H,southH as X,terraceK as Z,terrT as I,plotW as J,PLOT_EDGES as ee,PLOT_RAMP as $,TERRACE_ROWS as z,starLit as te,plainH as D,northShore as F,AXIS as B}from"./old-light-arriving-common.js";const oe=(()=>{const e=[0,1.5];for(const h of z)h>1.6&&h<=25.6&&e.push(8+(h-1.6)/.3);return e})(),_=e=>[...new Set(e.map(h=>Math.round(h*100)/100))].sort((h,l)=>h-l),C=_([...oe,...Array.from({length:29},(e,h)=>h*4)]),ae=[[120,232,-280,104],[-424,-120,-40,104],[-312,456,-504,-280]],se=(e,h)=>ae.some(l=>e>l[0]&&e<l[1]&&h>l[2]&&h<l[3]);function V(){const e={P:[],N:[],C:[],T:[],G:[],I:[]},h=new m.Vector3,l=(o,a)=>{const c=T(o,a);if(c<=0)return Math.max(-3,c*1.5);const n=H(o,a,c);return c<1.5?n*c/1.5:n};return e.vert=(o,a,c,n)=>{const d=c?l:X,r=T(o,a),w=n!==void 0?n:d(o,a),s=.9;h.set(d(o-s,a)-d(o+s,a),2*s,d(o,a-s)-d(o,a+s)).normalize();const t=r>0?H(o,a,r):-1,v=r>0?I(o,a,t)[0]:-1,u=Z(a,t),p=2.5,i=r>0?J(o)[1]*y(5,5.92,v)*y(0,14,L-a):0,f=H(o+p,a,T(o+p,a))-H(o-p,a,T(o-p,a)),g=H(o,a+p,T(o,a+p))-H(o,a-p,T(o,a-p)),x=Math.hypot(f,g)||1,b=r>0&&h.dot(Q)>.02?te(o,w+.6,a):r>0?0:1,W=(1-y(M-2,M+10,a))*y(.5,6,w),k=r>0&&r<8.5&&w<3?1:0,P=y(96,170,r)*(a>M?1:0);let N=.16,G=.25,A=.205;return N+=(.1-N)*P,G+=(.16-G)*P,A+=(.12-A)*P,N+=(.05-N)*W,G+=(.085-G)*W,A+=(.07-A)*W,N+=(.42-N)*k,G+=(.43-G)*k,A+=(.47-A)*k,e.P.push(o,w,a),e.N.push(h.x,h.y,h.z),e.C.push(N,G,A),e.T.push(v,u*(r<150||a<L?1:0),b),e.G.push(f/x,g/x,i),e.P.length/3-1},e.join=(o,a)=>{for(let c=0;c<o.length-1;c++){const n=o[c],d=o[c+1],r=a[c],w=a[c+1];e.P[n*3+1]<=-2.9&&e.P[d*3+1]<=-2.9&&e.P[r*3+1]<=-2.9&&e.P[w*3+1]<=-2.9||e.I.push(n,d,r,r,d,w)}},e.finish=async(o=async()=>{})=>{const a=new Map,c=(t,v)=>t<v?t+":"+v:v+":"+t,n=e.I,d=n.length;for(let t=0;t<d;t+=3){t%9e3===8997&&await o();for(let v=0;v<3;v++){const u=n[t+v],p=n[t+(v+1)%3];if(u===p)continue;const i=c(u,p);a.set(i,a.has(i)?null:[u,p])}}const r=new Map,w=t=>(r.has(t)||(r.set(t,e.P.length/3),e.P.push(e.P[t*3],e.P[t*3+1]-9,e.P[t*3+2]),e.N.push(e.N[t*3],e.N[t*3+1],e.N[t*3+2]),e.C.push(e.C[t*3],e.C[t*3+1],e.C[t*3+2]),e.T.push(e.T[t*3],e.T[t*3+1],e.T[t*3+2]),e.G.push(e.G[t*3],e.G[t*3+1],e.G[t*3+2])),r.get(t));await o();for(const t of a.values())if(t){const[v,u]=t,p=w(v),i=w(u);n.push(v,p,u,u,p,i)}await o();const s=new m.BufferGeometry;return s.setAttribute("position",new m.Float32BufferAttribute(e.P,3)),s.setAttribute("normal",new m.Float32BufferAttribute(e.N,3)),await o(),s.setAttribute("color",new m.Float32BufferAttribute(e.C,3)),s.setAttribute("aT",new m.Float32BufferAttribute(e.T,3)),s.setAttribute("aG",new m.Float32BufferAttribute(e.G,3)),s.setIndex(n),s.computeBoundingSphere(),s},e}async function le(e){const h=[];{const l=V();let o=null;for(let a=104;a>=-280;a-=4){const c=C.map(n=>l.vert(120+n,a,!1,n===0?-.6:void 0));o&&l.join(o,c),o=c,await e()}h.push(await l.finish(e)),await e()}{const l=V(),o=_([...C.map(n=>-120-n),...Array.from({length:25},(n,d)=>-424+8*d)]),a=_([...C.map(n=>-40+n),...Array.from({length:9},(n,d)=>72+4*d)]);let c=null;for(const n of o){const d=a.map(r=>l.vert(n,r,!1,n===-120||r===-40?-.6:void 0));c&&l.join(d,c),c=d,await e()}h.push(await l.finish(e)),await e()}{const l=V(),o=ee.flatMap(s=>[s-$/2,s-$/4,s,s+$/4,s+$/2]).filter(s=>s>-312&&s<456),a=_([...Array.from({length:108},(s,t)=>-312+4*t),...C.map(s=>120+s),...Array.from({length:56},(s,t)=>236+4*t),...o]);let c=null,n=0;const d=(s,t)=>I(s,t,H(s,t,T(s,t)))[0],r=M+2,w=20;for(const s of a){const t=[l.vert(s,L,!1,T(s,L+.5)<0?-.6:void 0),l.vert(s,L-1.5,!1)];let v=L-1.5,u=d(s,v),p=1,i=v;for(;p<z.length&&z[p]<=u;)t.push(l.vert(s,v-.01*p,!1)),p++;for(;i>r&&p<z.length;){i=Math.max(r,i-.5);const f=d(s,i);for(;p<z.length&&f>=z[p]&&f>u;){const g=(z[p]-u)/(f-u);t.push(l.vert(s,v+(i-v)*g,!1)),p++}v=i,u=f}for(;p<z.length;)t.push(l.vert(s,r+.004*(z.length-p),!1)),p++;for(let f=0;f<=w;f++){const g=r+(-504-r)*f/w;t.push(l.vert(s,g,!1))}c&&l.join(t,c),c=t,n++,await e()}h.push(await l.finish(e)),await e()}{const l=V(),o=-1720,a=-504,c=215,n=73,d=[];for(let r=0;r<=c;r++){const w=[];for(let s=0;s<=n;s++)w.push(l.vert(o+16*r,a+16*s,!0));d.push(w),await e()}for(let r=0;r<c;r++){const w=[],s=[];r%16===15&&await e();for(let t=0;t<=n;t++)w.push(d[r+1][t]),s.push(d[r][t]);for(let t=0;t<n;t++)se(o+16*(r+.5),a+16*(t+.5))||l.join([w[t],w[t+1]],[s[t],s[t+1]])}await e(),h.push(await l.finish(e)),await e()}return h}async function fe(e,h){const l=new m.ShaderMaterial({uniforms:{...e},side:m.DoubleSide,vertexShader:`attribute vec3 color, aT, aG; varying vec3 vW, vN, vCol, vT, vG; ${q}
      void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = olaW(w.xyz); vN = olaW(mat3(modelMatrix)*normal); vCol = color; vT = aT; vG = aG; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`varying vec3 vW, vN, vCol, vT, vG; ${q} ${Y} ${K}
      void main(){ if (vW.y < -.03) discard;
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.)), alb = vCol;
        float b = vT.x - 1.6, tk = clamp(vT.y, 0., 1.) * step(0., b), stp = b < 24. ? 6. : 9.;      // (vT.x: the terrace coordinate, in the plot's own levels)
        float f = b < 24. ? fract(b/6.) : fract((b-24.)/9.), fb = fwidth(b)/stp, w = min(fb*1.2, .12);
        // THE TERRACES' ONE LAW OF FOOTPRINT: where a whole step (tread, wall and coping) is under about eight pixels of the picture, the
        // three go to their MEAN (0.28 of a step is wall, a tenth of it coping, and the light falls on the mean of their two facings), so
        // that a far hillside is one tone under its houses and trees and no edge is ruled across it.
        float melt = smoothstep(.05, .22, fb), up = smoothstep(.72, 1., f);                               // up: how far up its wall a point of a wall stands
        float riser = mix(smoothstep(.72-w, .72+w, f), .28, melt) * tk;
        float cope = mix(max(smoothstep(.95-w, .962+w, f), 1. - smoothstep(.004, .012+w, f)), .1, melt) * tk;      // the coping: the wall's top course, half a metre of pale stone, and its lip
        // on the terraces the light falls on what the terrace IS (a level tread, a steep wall that follows the hill's line), not on the grid's facets
        vec2 gd = vG.xy / max(length(vG.xy), 1e-3);
        n = normalize(mix(n, mix(vec3(0.,1.,0.), normalize(vec3(-gd.x, .45, -gd.y)), riser), tk));
        float fine = clamp(1. - 3.*fwidth(vW.x + vW.z), 0., 1.);                                   // near enough to see blades
        float gn = olaNoise(vW.xz*.21)*.6 + olaNoise(vW.xz*2.3)*.4*fine + .2*(1.-fine);
        float mow = .5 + .5*sin((vW.x*.7 + vW.z*.7)*1.3);                                          // the mower's stripes on the terraces
        alb *= (.74 + .5*gn) * (1. + .1*mow*fine*tk);
        // no ground is one flat colour. The quay is paved (slabs, joints, each slab its own tone). Every terrace is a GARDEN: lawn, beds
        // of low planting each inside a pale stone kerb, a gravel walk behind the coping. The open lawns of the saddle and the upland
        // are rough grass in two greens crossed by worn tracks.
        float quay = step(.3, vCol.r), pf = max(fwidth(vW.x), fwidth(vW.z)), seen = clamp(1.4 - 2.2*pf, 0., 1.);
        vec2 qs = vec2(vW.x/2.6 + .5*floor(vW.z/1.7), vW.z/1.7), qf = fract(qs); float qj = min(min(qf.x, 1. - qf.x)*2.6, min(qf.y, 1. - qf.y)*1.7);
        alb *= mix(1., (.84 + .3*olaHash(floor(qs))) * (1. - .32*(1. - smoothstep(.02 + pf*.4, .07 + pf, qj)) * clamp(1.3 - 2.*pf, 0., 1.)) * .62, quay);
        float tread = tk * (1. - riser) * (1. - quay);
        float bedN = olaNoise(vW.xz*.19 + 5.)*.65 + olaNoise(vW.xz*.47 + 9.)*.35, bw = .012 + clamp(pf, 0., 3.)*.12;
        float bed = smoothstep(.57 - bw, .57 + bw, bedN) * tread, kerb = (1. - smoothstep(.01, .05, abs(bedN - .57))) * tread * seen;
        alb = mix(alb, vec3(.085,.125,.095) * (.7 + .6*olaNoise(vW.xz*1.3)), bed*.85);
        alb = mix(alb, vec3(.33,.34,.37), kerb*.75);
        float walk = smoothstep(.035 - w, .05 + w, f) * (1. - smoothstep(.15 - w, .18 + w, f)) * tread;
        alb = mix(alb, vec3(.34,.34,.35) * (.85 + .3*olaNoise(vW.xz*1.7)), walk*.85);
        float open = (1. - tk) * (1. - quay), swell = olaNoise(vW.xz*.021 + 3.)*.6 + olaNoise(vW.xz*.07)*.4;
        alb *= mix(1., .78 + .5*swell, open);
        float track = open * (1. - smoothstep(.0, .05, abs(olaNoise(vW.xz*.016 + 11.) - .5)));      // tracks worn over the open ground
        alb = mix(alb, vec3(.2,.19,.17), track * .55);
        // the walls: pale cut stone in courses 0.6 m high with broken joints, each block its own tone; creepers hang over some of them
        float creep = smoothstep(.5, .7, olaNoise(vW.xz*.09 + vW.y*.13));
        float crsY = vW.y*1.6 + .15*olaNoise(vW.xz*.3), run = dot(vW.xz, vec2(-gd.y, gd.x));
        float cw = clamp(fwidth(crsY)*.9, 0., .5), cseen = clamp(1.3 - 2.6*cw, 0., 1.), blk = run/1.5 + .5*floor(crsY);
        float joint = max(1. - smoothstep(.05, .1 + cw, min(fract(crsY), 1. - fract(crsY))), (1. - smoothstep(.02, .05 + clamp(fwidth(run)*.6, 0., .5), min(fract(blk), 1. - fract(blk)))) * .7);
        vec3 stone = vec3(.25,.26,.3) * mix(1., (.86 + .28*olaHash(vec2(floor(crsY), floor(blk)))) * (1. - .3*joint), cseen);
        stone = mix(stone, vec3(.1,.16,.115), creep*.45);
        alb = mix(alb, stone, riser*.95); alb = mix(alb, vec3(.37,.38,.42), cope*.85);
        // a ramp between two plots is a flight of pale steps down its middle
        alb = mix(alb, vec3(.38,.39,.43) * (.8 + .2*step(.5, fract(vW.y*1.6))), smoothstep(.75, .9, vG.z) * tk * (1. - quay));
        // the way up the town (the common part's WAY): its flights are steps of the same stone as the ramps between the plots, its
        // two garden paths over the top lawn the same gravel as every terrace's walk: no brighter than any other path of the town
        vec2 way = vW.x > ${E[0].toFixed(2)} && vW.x < ${E[1].toFixed(2)} && vW.z > ${E[2].toFixed(2)} && vW.z < ${E[3].toFixed(2)} ? olaWay(vW.xz) * step(1.2, vW.y) : vec2(0.);      // (inside the way's own bounds)
        alb = mix(alb, vec3(.38,.39,.43) * (.8 + .2*step(.5, fract(vW.y*1.6))), way.x);
        alb = mix(alb, vec3(.34,.34,.35) * (.85 + .3*olaNoise(vW.xz*1.7)), way.y*.85*(1. - way.x));
        // the back stair from the crest's halls down the north face to the basin's landing: pale steps
        float sx = ${R.x}. + ${R.amp}.*sin((vW.z - (${M}.))*${R.k}), back = (1.-smoothstep(${R.hw}, ${R.hw+.9}, abs(vW.x - sx))) * step(vW.z, ${M}.) * step(1.2, vW.y);
        alb = mix(alb, vec3(.44,.45,.5) * (.8 + .2*step(.5, fract(vW.y*1.6))), back);
        // first snow: every roof of ground that lies open to the sky is white; walls and steep wood stay dark
        float snow = uSnow * smoothstep(.72, .9, n.y) * (1.-riser) * (.85 + .15*gn) * mix(1., smoothstep(.2, .5, swell + .25*gn), open) * (1. - .55*max(walk, max(way.x, way.y))) * (1. - .3*bed) * (1. - .5*quay*(1. - smoothstep(.2, .6, olaNoise(vW.xz*.3))));      // drifted on the open slopes, trodden on the walks and the quay, thin on the beds' planting
        snow = max(snow, uSnow * cope * .9);                                                         // and it caps every coping
        // SNOW ON OPEN GROUND HAS FORM: long drifts lying across the evening's wind, small wind ridges on their backs (seen near), the
        // worn tracks trodden grey through it, and a cold sheen where it is seen at a low angle against the sky's light
        vec2 wq = vec2(vW.x*.9 - vW.z*.44, vW.x*.44 + vW.z*.9), dq = wq*vec2(.11, .034);            // (across, along) the wind
        float d0 = olaNoise(dq), dA = olaNoise(dq + vec2(.17, 0.)) - d0, dB = olaNoise(dq + vec2(0., .05)) - d0;
        float sq = olaNoise(wq*vec2(1.3, .22) + 4.), sA = olaNoise(wq*vec2(1.3, .22) + vec2(4.2, 4.)) - sq;
        float lie = snow * open;
        vec2 tilt = (vec2(dA, dB*.4)*2.6 + vec2(sA, 0.)*1.1*fine) * lie;
        n = normalize(n + vec3(tilt.x*.9 + tilt.y*.44, 0., -tilt.x*.44 + tilt.y*.9));
        vec3 sn = vec3(.5,.54,.62) * mix(1., (.86 + .3*d0) * (1. - .16*fine*smoothstep(.55, .8, sq)), lie) * (1. - .45*track);
        alb = mix(alb, sn, snow);
        float glance = pow(1. - clamp(dot(normalize(olaW(cameraPosition) - vW), n), 0., 1.), 4.) * lie;
        // (the lamps' pools lie on the ground itself. A wall takes the light of the lamps that stand at its top and at its foot: it falls off
        // down the wall from the one and up it from the other, by the metres of wall between)
        float wallK = mix(1., max(exp(-(1. - up)*stp/3.), exp(-up*stp/2.5)), riser * (1. - melt));
        vec3 c = alb * olaLight(n, vT.z * olaBands(vW.xz)) + olaLamps(vW.xz, alb) * wallK + uHemiSky * .22 * glance;
        gl_FragColor = vec4(olaFog(c, length(vW - olaW(cameraPosition))), 1.); }`}),o=new m.Group;for(const a of await le(h))o.add(new m.Mesh(a,l));return{object:o,material:l}}const O=`
uniform float uLate, uRough; ${U} ${j}
vec3 olaSkyUp(float y, float back){
  vec3 zen = vec3(.0030,.0060,.0296), mid = vec3(.0110,.0212,.0802), hor = vec3(.0202,.0331,.1022);
  vec3 c = mix(mid, zen, smoothstep(.12,.85,y)); c = mix(hor, c, smoothstep(0.,.24,y));
  c = mix(c, c*vec3(.62,.66,.8), uLate);
  return c + vec3(.36,.22,.27) * (1.-uLate) * back*back*back * exp(-y/.1) * .55;
}
// The far side in the water. r: the mirrored ray of LEVEL water (up). The band's law is the sky's own (BAND_GLSL in the common part);
// ripples smear its image over 'sig' degrees. Returns (the smeared band's mean light, the low glow's light).
vec2 olaBandUp(vec3 r, float sig){
  float off = asin(clamp(r.x,-1.,1.))*57.29578, e = atan(max(r.y, 1e-4), -r.z)*57.29578;
  float hw = olaBandHW(e), w = sqrt(hw*hw + sig*sig), x = off/w, lit = olaBandLit(e, uLate);
  float band = olaBandAxis(e, lit) * (hw/w) * exp(-min(x*x*.7, 40.));      // the same light over a wider image is dimmer
  return vec2(band, olaBandGlow(off, asin(clamp(r.y, 0., 1.))*57.29578, uLate));
}
// THE GLINT'S OWN FIELD. Light on ripples lies in small soft streaks along their crests, so every glint of this water is read from a
// field that has no cells: a smooth field of chance made from slopes dealt at the knots of a net (never values dealt in its squares,
// which draw every glint as a square block with straight sides and corners), in a frame turned to a ripple train's crests and three
// times as long along a crest as deep across it. Two trains cross on this water, their crests 36 degrees either side of the line
// across the river (olaGlintP, olaGlintQ): a glint is read from one, or from both where both must throw the light. The field has
// the squares' field's own mean and spread, so the water's light is what it was.
vec2 olaGlintP(vec2 p){ return vec2(.81*p.x - .58*p.y, .58*p.x + .81*p.y) * vec2(.577, 1.732); }
vec2 olaGlintQ(vec2 p){ return vec2(.81*p.x + .58*p.y, -.58*p.x + .81*p.y) * vec2(.577, 1.732); }
float olaGlint(vec2 q){ vec2 i = floor(q), f = fract(q), u = f*f*f*(f*(f*6. - 15.) + 10.);
  vec4 a = 6.2831853 * vec4(olaHash(i), olaHash(i + vec2(1.,0.)), olaHash(i + vec2(0.,1.)), olaHash(i + vec2(1.,1.)));
  vec4 d = cos(a)*vec4(f.x, f.x - 1., f.x, f.x - 1.) + sin(a)*vec4(f.y, f.y, f.y - 1., f.y - 1.);
  return clamp(.5 + mix(mix(d.x, d.y, u.x), mix(d.z, d.w, u.x), u.y), 0., 1.); }
// p: map point; V: unit ray from the eye to the water; fine: 1 where a ripple is wider than a pixel; lit: how much of the star's light
// is on this water; pen: how much of it comes whole (1 in the open; under 1 in the soft part of the town's hill's shade, where it
// comes through the crest's crowns and is broken)
vec3 olaWater(vec2 p, vec3 V, float fine, float lit, float pen){
  float t = uTime;
  vec2 sw = vec2(cos(p.x*.19 + p.y*.07 + t*.55), cos(p.y*.23 - p.x*.05 + t*.47)) * .012
          + vec2(cos(p.x*.61 - p.y*.33 + t*1.1), cos(p.y*.71 + p.x*.29 - t*.9)) * .010;
  vec2 q = p*.9 + vec2(t*.22, t*.31);
  float n0 = olaNoise(q), nx = olaNoise(q + vec2(.35,0.)), nz = olaNoise(q + vec2(0.,.35));
  vec2 q2 = p*2.7 - vec2(t*.41, t*.17);
  float m0 = olaNoise(q2), mx = olaNoise(q2 + vec2(.35,0.)), mz = olaNoise(q2 + vec2(0.,.35));
  vec2 rip = (vec2(nx-n0, nz-n0)*.16 + vec2(mx-m0, mz-m0)*.09) * fine;
  vec2 sl = (sw + rip) * uRough;
  vec3 n = normalize(vec3(-sl.x, 1., -sl.y));
  vec3 r = reflect(V, n); r.y = abs(r.y) + 1e-3; r = normalize(r);
  float dep = clamp(-V.y, .002, 1.), fres = .3 + .7*pow(1.-dep, 5.);      // (a dusk river is a mirror at every angle: the floor keeps the near water readable)
  float back = clamp(r.z, 0., 1.) / max(length(r.xz), 1e-3);
  vec3 c = olaSkyUp(r.y, back) * fres * 1.25 + vec3(.004,.008,.026) * (1.-fres);
  // glitter never lies still. Where ripples are finer than a pixel each pixel holds a changing handful of glints: a smooth field of
  // chance whose grain is the SHORT side of the pixel's footprint on the water (so it is never a tile or a floe), two grains blended.
  vec2 fx = dFdx(p), fy = dFdy(p); float ft = clamp(min(length(fx), length(fy)) * 1.7, .3, 300.), lf = log2(ft), l0 = floor(lf), lk = lf - l0;
  float tw = t*2.6, t0 = floor(tw), tk = smoothstep(0., 1., fract(tw)); vec2 ps = olaGlintP(p), pq = olaGlintQ(p), pa = ps / exp2(l0), pb = pq / exp2(l0 + 1.);
  float ga = mix(olaGlint(pa + t0*17.3), olaGlint(pa + (t0 + 1.)*17.3), tk), gb = mix(olaGlint(pb + t0*17.3 + 5.), olaGlint(pb + (t0 + 1.)*17.3 + 5.), tk), gt = mix(ga, gb, lk);
  float far = .5 + 9.*gt*gt*gt*gt*gt;                                                           // sparse and bright: glints on dark water, never a grey wash
  vec2 pr = vec2(p.x*.8 + p.y*.6, -p.x*.6 + p.y*.8);
  float paws = .55 + .9*(.65*olaNoise(pr*.017 + vec2(t*.02, 0.)) + .35*olaNoise(pr*.041 + 3.)) * (.6*olaNoise(pr*vec2(.006, .05) - vec2(0., t*.015) + 5.) + .4*olaNoise(pr*vec2(.019, .11) + 9.));      // the wind's cat's-paws: bright and slack water in long soft patches
  float near = .25 + 2.2*pow(olaGlint(ps*1.9 + vec2(t*.8, -t*.55)), 3.) + .5*olaNoise(p*.23 - vec2(t*.1, 0.));
  float spark = mix(far, near, fine) * paws;
  // the far side: a soft track (the band's image smeared by the ripples) broken by them into patches of light, a far wider and thinner
  // scatter of pearl glints either side of it (the steeper ripples), and the low glow lying on the far water
  vec3 r0 = normalize(vec3(V.x, abs(V.y) + 1e-3, V.z));
  vec2 trk = olaBandUp(r0, .12 + 2.6*uRough), wide = olaBandUp(r0, .12 + 13.*uRough);
  // THE TOWN'S HILL STANDS BETWEEN THE RIVER AND THE FAR SIDE: water south of the quay shows the far side's image only where the
  // mirrored ray clears the hill's crest (the crest's own heights, at the place on the crest the ray passes over). Under the crest
  // the far side's image is simply not laid (nothing of the hill itself is drawn in the water: the water there keeps the night
  // sky's colour as everywhere). The image comes in over 16 m of the ray's height at the crest, from 4 m under the crest's ground
  // to 12 m over it: the ripples carry the mirrored ray some degrees either way, so a little of the image shows before the level
  // ray clears the ground, and the crest's crowns thin it above. (So the thread's image lies on the water before the eye and is
  // gone well before the quay: it comes to no stair's foot.)
  float open = 1.; if (p.y > ${L}. && r0.z < -1e-3) { float tt = (${M}. - p.y) / r0.z; open = smoothstep(-4., 12., r0.y*tt - olaCrest(p.x + r0.x*tt)); }
  trk *= open; wide *= open;
  float brk = mix(1., .15 + 3.4*olaGlint(olaGlintP(q))*olaGlint(olaGlintQ(q2)), fine);            // what the ripples make of it near: streaks of it along them, with dark water between
  float gl2 = mix(far, .1 + 7.*pow(olaGlint(pq*2.3 + vec2(-t*.6, t*.45)), 4.), fine);            // sparse glints
  c += vec3(.85,.88,.98) * (trk.x * brk * 1.5 + wide.x * gl2 * 4.) * fres * 1.4 + vec3(.30,.38,.84) * trk.y * .75 * fres * (.7 + .3*far);
  // the star: its mirror point is 12 degrees down on its bearing; the glitter gathers round it and runs out toward the horizon as a road
  float az = atan(r.x, max(-r.z, 1e-4))*57.29578, el = asin(clamp(r.y,0.,1.))*57.29578;
  float da = (az - 14.) * cos(el*.0174533), de = el - 12.;
  float gl = exp(-da*da/(1.4 + 9.*uRough*(1.-fine))) * exp(-de*de/(3. + 60.*uRough*(1.-fine)));
  float vaz = atan(V.x, max(-V.z, 1e-4))*57.29578 - 14.;
  float road = exp(-vaz*vaz/14.) * exp(-dep*dep/.05) * (.35 + .65*olaNoise(p*.5 + vec2(t*.3, -t*.2))) * uRough;      // the unresolved glitter of the road
  float sheen = exp(-vaz*vaz/5200.) * pow(1.-dep, 5.) * (.55 + .45*olaNoise(pr*.045 + vec2(t*.05, 0.))) * min(uRough, 1.);
  // the broad field of glitter round the star's mirror point: every ripple that tilts the right way throws the star back. It reaches
  // from the far water toward us by the star's one strength (nearer water needs steeper ripples, and only a strong light shows on those).
  float reach = de > 0. ? 16. + 150.*uStar*uStar : 150.;
  float field = exp(-da*da/1500.) * exp(-de*de/reach) * smoothstep(.2, .8, uRough);
  // IN THE STAR'S WHOLE LIGHT the water wears the even sheen and the field; in the soft part of the hill's shade the light that comes
  // through the crowns is broken, and the water keeps its dark body and takes glints alone: the same sheen and field, counted only
  // where a ripple throws them (fewer the deeper in the shade), with no even part. The even part comes in only as the light comes whole.
  float whole = smoothstep(.95, 1., pen), broken = 9.*pow(max(gt, 1e-4), 5. + 8.*(1. - pen)) * paws;
  float silver = (.3*sheen + .34*field*spark)*whole + (.3*sheen + .34*field)*broken*(1. - whole);
  c += vec3(.71,.80,1.) * uStar * lit * (5.*gl + .85*road + silver);
  return c;
}`;function de(e,h){const l=new m.PlaneGeometry(1,1).rotateX(-Math.PI/2);l.scale(7600,1,3200),l.translate(0,0,-900);const o=new m.ShaderMaterial({uniforms:{...e,...h,uRough:{value:1},uBowl:{value:new m.Vector4(S.c[0],S.c[1],B[0],B[1])}},depthWrite:!1,side:m.DoubleSide,vertexShader:`varying vec3 vW; ${q} void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = olaW(w.xyz); gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`varying vec3 vW; uniform vec4 uBowl; ${q} ${O}
      void main(){ vec3 cam = olaW(cameraPosition), V = vW - cam; float dist = length(V); V /= max(dist, 1e-3);
        float fine = clamp(1.4 - 2.2*max(fwidth(vW.x), fwidth(vW.z)), 0., 1.);
        // the bowl's hill stands between the star and the water on its near side: a long shadow toward us, ${(S.yRim/Math.tan(12*Math.PI/180)).toFixed(0)} m and soft-ended
        vec2 d = vW.xz - uBowl.xy; float l = -uBowl.w*d.x + uBowl.z*d.y, a = uBowl.z*d.x + uBowl.w*d.y;
        float behind = -a - sqrt(max(${(S.rim*S.rim).toFixed(1)} - l*l, 0.));
        float shade = (1.-smoothstep(${S.rim-12}., ${S.rim+6}., abs(l))) * step(a, 0.) * (1.-smoothstep(120., 172., behind));
        float pen = olaTownLit(vec3(vW.x, 0., vW.z));      // (south of the town's hill the water lies in that hill's shade from the star: the common part's law)
        vec3 c = olaWater(vW.xz, V, fine, (1.-shade) * pen, pen);
        // fish rings on the lower river: a ring opens in a cell of the water now and then
        vec2 cell = floor(vW.xz/38.), cp = (cell + .25 + .5*vec2(olaHash(cell), olaHash(cell+7.3)))*38.;
        float ph = fract(uTime/(5.+6.*olaHash(cell+3.1)) + olaHash(cell+1.7)), rr = length(vW.xz - cp);
        float ring = (1.-smoothstep(0., .22, abs(rr - ph*3.2))) * (1.-ph)*(1.-ph) * step(.55, olaHash(cell+9.9)) * step(-250., vW.z) * fine;
        c += vec3(.02,.028,.05) * ring;
        gl_FragColor = vec4(olaFog(c, dist), 1.); }`}),a=new m.Mesh(l,o);return a.renderOrder=-.5,a.frustumCulled=!1,{object:a,material:o}}const re=(e,h,l)=>{const o=(520+380*y(0,2600,e))*(1-.55*y(2200,5200,e));return-560*(1-y(500,3800,e))+o*Math.sin(e*.00205+.25+h)+260*(1-.55*y(2200,5200,e))*Math.sin(e*71e-5+l)};async function me(e,h,l){const o=[],a=[],[c,n]=l.seed,d=l.pause||(async()=>{}),r=[];for(let i=0;i<5800;)r.push(i),i+=i<900?45:i<2600?130:400;const w=[...r.slice(1).reverse().map(i=>-i),...r],s=[0,5,14,34,80,180,380,600,800];for(let i=950;i<=5200;i+=150)s.push(i);const t=(i,f)=>{const g=-1e3-(F(i)-f),x=Math.abs(i-re(g,c,n))-240,b=.5+.5*Math.sin(f/150+1.9*Math.sin(i*.0011+c)+1.1*Math.sin(i*.0037+n));return(8+34*y(900,3600,f))*b*b*y(800,1500,f)*y(40,420,x)};for(let i=0;i<w.length;i++){const f=w[i];i%12===11&&await d();for(const g of s){const x=F(f)-g+2;o.push(f,g===0?-1.2:D(f,x)+t(f,g),x)}}const v=s.length;for(let i=0;i<w.length-1;i++)for(let f=0;f<v-1;f++){const g=i*v+f,x=g+v;a.push(g,g+1,x,x,g+1,x+1)}{const i=o.length/3,f=24,g=22;for(let x=0;x<=g;x++)for(let b=0;b<=f;b++){const W=-96+192*b/f,k=138+170*x/g,P=S.c[0]+B[0]*k-B[1]*W,N=S.c[1]+B[1]*k+B[0]*W;o.push(P,D(P,N),N)}for(let x=0;x<g;x++)for(let b=0;b<f;b++){const W=i+x*(f+1)+b,k=W+f+1;a.push(W,k,W+1,W+1,k,k+1)}}const u=new m.BufferGeometry;u.setAttribute("position",new m.Float32BufferAttribute(o,3)),u.setIndex(a),await d(),u.computeVertexNormals(),u.computeBoundingSphere(),await d();const p=new m.ShaderMaterial({uniforms:{...e,...h,uRough:{value:1},uSeed:{value:new m.Vector2(c,n)},uFull:{value:l.full}},side:m.DoubleSide,vertexShader:`varying vec3 vW, vN; ${q} void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = olaW(w.xyz); vN = olaW(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`varying vec3 vW, vN; uniform vec2 uSeed; uniform float uFull; ${q} ${O}
      // the river's middle line across the plain (the same line the ground's rises keep clear of)
      float loopD(vec2 p){ float n = -1000. - p.y, far = 1. - .55*smoothstep(2200., 5200., n);    // metres north of the far bank
        float amp = (520. + 380.*smoothstep(0., 2600., n)) * far, xc = -560.*(1. - smoothstep(500., 3800., n)) + amp*sin(n*.00205 + .25 + uSeed.x) + 260.*far*sin(n*.00071 + uSeed.y);
        float slope = amp*.00205*cos(n*.00205 + .25 + uSeed.x) + 260.*far*.00071*cos(n*.00071 + uSeed.y);
        float hw = 170. + 70.*sin(n*.0013 + 2.);
        return (abs(p.x - xc) / sqrt(1. + slope*slope)) - hw; }                                 // about metres to its bank: negative on the water
      float pathN(vec2 p){ return olaNoise(p*.0021 + uSeed*9. + 13.); }                          // the footpaths are the lines where this field is one half
      void main(){ if (vW.y < -.03) discard;
        vec3 cam = olaW(cameraPosition), V = vW - cam; float dist = length(V); V /= max(dist, 1e-3);
        vec2 p = vW.xz; float foot = max(fwidth(p.x), fwidth(p.y));                                // metres of ground under a pixel
        float ld = loopD(p), wet = 1. - smoothstep(-foot*.7 - 1., foot*.7 + 1., ld);
        float f1 = olaNoise(p*.0031 + uSeed), f2 = olaNoise(p*.011 + uSeed.yx);
        // streams: thin winding water, a few metres across, where one slow field crosses its middle (a thing with a width: under a pixel
        // it is drawn a pixel wide with its share of the pixel)
        float sN = olaNoise(p*.0017 + uSeed.yx*2. + 31.), sw = .0045 + foot*.0017*.5, stream = (1. - smoothstep(sw*.6, sw, abs(sN - .5))) * min(1., .0045/sw) * step(0., ld);
        wet = max(wet, stream);
        // groves: bodies of trees with ragged edges, large and small; near enough their crowns are seen, each catching the sky on its top
        float gN = olaNoise(p*.0042 + uSeed*3.)*.6 + olaNoise(p*.013 + 7.)*.28 + olaNoise(p*.047 + 2.)*.12, ge = .025 + clamp(foot*.004, 0., .1);
        float grove = smoothstep(.57 - ge, .57 + ge, gN) * (1. - wet);
        vec2 cq = p/11., ci = floor(cq), cf = fract(cq) - .5 - .28*(vec2(olaHash(ci + 1.7), olaHash(ci + 4.3)) - .5);
        float crown = mix(1., .55 + .9*(1. - smoothstep(.1, .55, length(cf))), clamp(1.5 - foot/4., 0., 1.));
        // hedges: a few long dark lines that wander, broken by gaps
        float hN = olaNoise(p*.0024 + uSeed*5. + 3.), hw = .006 + foot*.0024*.5;
        float hedge = (1. - smoothstep(hw*.6, hw, abs(hN - .5))) * min(1., .006/hw) * step(.42, olaNoise(p*.007 + 9.)) * (1. - grove) * (1. - wet);
        // footpaths: narrow trodden ways winding over the meadows from the houses and the groves to the water
        float pN = pathN(p), pw = .0035 + foot*.0021*.5, path = (1. - smoothstep(pw*.6, pw, abs(pN - .5))) * min(1., .0035/pw) * (1. - wet);
        // the open ground: meadow in long soft swells (drifts on a snow visit)
        vec2 wq = vec2(p.x*.9 - p.y*.44, p.x*.44 + p.y*.9) * vec2(.021, .0065);
        float d0 = olaNoise(wq + 5.), dA = olaNoise(wq + vec2(5.3, 5.)) - d0;
        vec3 alb = mix(vec3(.060,.085,.080), vec3(.085,.10,.075), f1) * (.8 + .25*f2);
        alb = mix(alb, vec3(.5,.54,.62) * (.84 + .3*d0), uSnow);
        alb = mix(alb, mix(vec3(.16,.15,.13), vec3(.33,.35,.4), uSnow), path*.8);
        vec3 wood = mix(vec3(.028,.045,.036), vec3(.13,.15,.19), uSnow*.55) * crown * (.8 + .4*olaNoise(p*.03 + 1.));
        alb = mix(alb, wood, max(grove, hedge*.85));
        // scattered houses: one in some of the country's 190 m cells, a low dark body under a pale roof with a lit side
        vec2 hc = floor(p/190.), hq = (hc + .25 + .5*vec2(olaHash(hc + 1.3), olaHash(hc + 8.9)))*190., hd = p - hq;
        float isH = step(.7, olaHash(hc + uSeed*3.)) * (1. - wet), body = (1. - smoothstep(-foot*.5, foot*.5 + .5, max(abs(hd.x) - 7., abs(hd.y) - 4.5))) * isH * clamp(1.6 - foot/6., 0., 1.);
        alb = mix(alb, mix(vec3(.09,.09,.1), vec3(.45,.48,.55), uSnow), body);
        // cloud shadows drift over the country under the star
        float cs = smoothstep(.45, .75, olaNoise(p*.0011 + vec2(uTime*.006, 0.) + uSeed));
        vec3 n = normalize(vN * (vN.y < 0. ? -1. : 1.) + vec3(dA*1.6*.9, 0., -dA*1.6*.44) * (1. - grove) + vec3(0., 1e-4, 0.));
        vec3 land = alb * olaLight(n, (1. - .55*cs) * mix(1., olaBands(p), clamp(1.3 - foot*.4, 0., 1.)));
        // LIGHTS, each a true point with a pool on the ground, each kind going to its mean where a pixel holds many:
        // lamps along the footpaths (a 26 m cell holds one if its place lies on a path)
        vec2 lc = floor(p/26.), lp = (lc + .2 + .6*vec2(olaHash(lc + 2.1), olaHash(lc + 5.7)))*26.; float onPath = 1. - smoothstep(.008, .014, abs(pathN(lp) - .5));
        float rad = max(.55, foot*.75), dl = dot(p - lp, p - lp), k26 = clamp(foot/18., 0., 1.);
        float lampPt = exp(-min(dl/(rad*rad), 40.)) * min(1., .3/(rad*rad)*6.) * 2.4 + .16*exp(-dl/55.);
        float lamps = onPath * mix(lampPt, .05, k26);
        // the watchers' held lights: gathered thick along the paths and the banks (river, streams, the basin's far bank), a few apart
        float bank = exp(-max(ld, 0.)/90.) + exp(-max(-1000. - p.y, 0.)/140.), gather = 1. - smoothstep(.01, .05, abs(pN - .5));
        float den = clamp(.02 + .5*bank + .65*gather, 0., 1.) * uFull;
        vec2 gc = floor(p/13.), wp = (gc + .2 + .6*vec2(olaHash(gc + 2.1), olaHash(gc + 5.7)))*13.; float h = olaHash(gc + uSeed*7.);
        float pt = exp(-min(dot(p - wp, p - wp)/(rad*rad), 40.)) * step(1. - den*.55, h) * min(1., .3/(rad*rad)*6.);
        float held = mix(pt*2.2, den*.55*.11*2.2, clamp(foot/9., 0., 1.));
        // the houses' lit sides: a warm point and its spill on the ground; far off, a pin light
        float r2 = max(2.2, foot*.75), hl = dot(hd - vec2(0., 5.), hd - vec2(0., 5.));
        float house = isH * (exp(-min(hl/(r2*r2), 40.)) * min(1., 4.84/(r2*r2)) * 2. + .2*exp(-hl/260.));
        vec3 lights = vec3(1., .44, .095) * (held + lamps + house) * (1. - wet) * (1. - .7*grove) * (1. + .7*uSnow);      // (on snow every lamp's light is thrown back by the white ground)
        vec3 c = mix(land, olaWater(p, V, clamp(1.4 - 2.2*foot, 0., 1.), 1. - .5*cs, 1.), wet) + lights;
        float fg = 1. - exp(-min(dist*dist*uFogDen*uFogDen, 40.));                                  // (the far country goes into the same haze the rises under the range stand in)
        gl_FragColor = vec4(mix(c, uFogCol * (1. + .2*smoothstep(1500., 4500., dist)), fg), 1.); }`});return{object:new m.Mesh(u,p),material:p}}function ve(e,h=[.9,-.44]){const l=new m.PlaneGeometry(1,1).rotateX(-Math.PI/2);l.scale(7600,1,3200),l.translate(0,1.3,-900);const o=new m.ShaderMaterial({uniforms:{...e,uWind:{value:new m.Vector2(h[0],h[1]).normalize()}},transparent:!0,depthWrite:!1,side:m.DoubleSide,vertexShader:`varying vec3 vW; ${q} void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = olaW(w.xyz); gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`varying vec3 vW; uniform vec2 uWind; ${q} ${j}
      void main(){ vec3 cam = olaW(cameraPosition), V = vW - cam; float dist = length(V); V /= max(dist, 1e-3);
        float t = uTime; vec2 p = vec2(dot(vW.xz, uWind), dot(vW.xz, vec2(-uWind.y, uWind.x)));      // along the wind, across it
        // (A LANE'S SIDES WANDER: the air that draws the vapour out does not run ruler-straight, so the lanes are read a little
        // aside of the straight: each bends across the wind as it runs, by some tens of metres over a hundred or two, and no side
        // of any lane is a straight line on the water)
        p += vec2(46.*sin(p.y*.019 + 2.), 26.*sin(p.x*.0157 + 1.3 + 1.1*sin(p.y*.011)) + 13.*sin(p.x*.047 + p.y*.021 + 4.));
        float n = olaNoise(p*vec2(.0035, .021) + vec2(t*.01, 0.))*.5 + olaNoise(p*vec2(.009, .052) + vec2(t*.016, 3.))*.32 + olaNoise(p*vec2(.03, .16) + vec2(t*.03, 7.))*.18;
        float dens = smoothstep(.5, .86, n);                                                       // lanes: about a third of the water wears it
        float a = 1. - exp(-dens * .05 / max(abs(V.y), .03));                                       // a few metres of thin vapour: the lower we look along it, the more of it we look through
        a = min(a, .55) * smoothstep(1.5, 12., dist);                                              // (never a white floor; the eye never comes within five metres of it)
        vec3 c = vec3(.74,.77,.88) * (uHemiSky*.8 + uBandCol*.4 + uGlowCol*.2 + uStarCol*.42*olaTownLit(vec3(vW.x, 1.3, vW.z)));      // (south of the town's hill the vapour lies in that hill's shade from the star, as the water under it does: the common part's law)
        float f = 1. - exp(-dist*dist*uFogDen*uFogDen); c = mix(c, uFogCol, clamp(f, 0., 1.));
        gl_FragColor = vec4(c, clamp(a, 0., 1.)); }`}),a=new m.Mesh(l,o);return a.renderOrder=2.2,a.frustumCulled=!1,{object:a,material:o}}export{O as WATER_GLSL,fe as makeLand,ve as makeMist,me as makePlain,de as makeWater};
