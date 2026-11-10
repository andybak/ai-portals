import*as e from"three";import{makePath as Zt}from"../kit/core.js";import{buildHero as ea}from"../parts/figure-and-ground.js";import{makeRng as ta,hashSeed as aa}from"../kit/core.js";const j=(t,a,i)=>Math.min(i,Math.max(a,t)),A=(t,a,i)=>{const v=j((i-t)/(a-t),0,1);return v*v*(3-2*v)},W="gl_Position = vec4(2., 2., 2., 1.);",re=2,dt=[[12,13],[8,9]],le={n:80,x0:-300,dx:10},pt=`uniform vec2 uTube[${le.n}];
  vec2 tubeAt(float x) { float f = clamp((x - ${le.x0}.) / ${le.dx}., 0., ${le.n-1}. - .001), i = floor(f); return mix(uTube[int(i)], uTube[int(i) + 1], f - i); }
  vec3 clearOf(vec3 p, float r, vec2 tie) { vec2 d = p.yz - tubeAt(p.x) + tie; float l = max(length(d), 1e-3); p.yz += d / l * (sqrt(l * l + r * r) - l); return p; }`,oa=`varying vec3 vDir;
  void main() { vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,sa=`varying vec3 vDir;
  uniform vec3 uInk, uPaper; uniform float uTime, uRain, uStars, uDuty, uSeed, uUnder, uCalm;
  float h12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(h12(i), h12(i + vec2(1., 0.)), f.x), mix(h12(i + vec2(0., 1.)), h12(i + vec2(1., 1.)), f.x), f.y); }
  float lineT(float x, float per, float w, float aa) { float d = abs(fract(x / per + .5) - .5) * per; return 1. - smoothstep(w * .5 - aa, w * .5 + aa, d); }
  void main() {
    vec3 d = normalize(vDir);
    float hl = max(length(d.xz), 1e-4);
    vec2 hd = d.xz / hl;
    float te = abs(d.y) / hl;
    float tone = 1.;
    if (d.y >= 0. && uUnder < .5) {
      // level bars in bundles of five to nine, each bar tapering to a point at both ends like a burin cut
      float w = log(te + .012) * 2.;
      float ab = max(fwidth(w), 1e-4) * 1.5;            // one pixel, in half-band units
      float bw = w * 2., bi = floor(bw), f = bw - bi;
      float hsh = h12(vec2(bi, uSeed));
      float n = 5. + floor(hsh * 4.99);
      float horizon = 1. - smoothstep(-5.3, -4.7, w);
      float per = .078;
      float sp = (floor(h12(vec2(bi, 7.3 + uSeed)) * 3.) - 1.) * .011 + .004;   // three drift rates
      float a = uTime * sp + hsh * 40.;
      vec2 r = vec2(hd.x * cos(a) - hd.y * sin(a), hd.x * sin(a) + hd.y * cos(a));
      float nz = vn(r * 2.3 + bi * 5.7);
      float thr = mix(.52, .78, smoothstep(-5., 2.5, w));
      float taper = smoothstep(thr, thr + .14, nz);
      // on a small picture a bundle is cut with fewer, wider-spaced lines (never closer than about four pixels),
      // so it is always lines of ink and never a grey bar
      float oc = exp2(ceil(log2(max(ab * 5.6 / per, 1.))));
      per *= oc; n = max(1., floor(n / oc + .5));
      float halfB = n * per * .5 * (.35 + .65 * taper);
      float inB = 1. - smoothstep(halfB - ab, halfB + ab, abs(f - .5));
      float lw = min(per * uDuty, ab * 3.2) * taper;
      float fine = lineT(f - .5 + per * .5 * mod(n + 1., 2.), per, lw, ab) * inB * clamp(lw / (1.4 * ab), 0., 1.);
      float res = step(n * per, 1.05);
      // a bundle too fine to show its lines is one fine line, never a slab
      float sw = max(.05, ab * 1.3) * taper;
      float solid = (1. - smoothstep(sw - ab, sw + ab, abs(f - .5))) * clamp(sw / ab, 0., 1.);
      float ink = mix(solid, fine, res) * (1. - horizon) * step(.001, taper);
      // the last three degrees: a few bold level bars with gaps, never closer than about ten pixels at any size of
      // picture, thinning upward into the paper
      float fe = max(fwidth(te), 1e-6);
      float P = .0052 * exp2(ceil(log2(max(fe * 10. / .0052, 1.))));
      float li = floor(te / P);
      float hl2 = h12(vec2(li, uSeed + 3.));
      float a2 = uTime * ((floor(hl2 * 3.) - 1.) * .009 + .003) + hl2 * 50.;
      vec2 r2 = vec2(hd.x * cos(a2) - hd.y * sin(a2), hd.x * sin(a2) + hd.y * cos(a2));
      float nh = vn(r2 * 9. + li * 3.1);
      float hband = 1. - smoothstep(.03, .06, te);
      float cut = smoothstep(.36, .52, nh + .22 * (hband - .85));
      float hw = max(P * .40 * cut * (.4 + .6 * hband) * (1. - .5 * uCalm), 2.5 * fe * step(.001, cut));
      float hatch = (1. - smoothstep(hw * .5 - fe, hw * .5 + fe, abs(fract(te / P) - .5) * P)) * clamp(hw / (2. * fe), 0., 1.);
      ink = max(ink, hatch * step(.001, cut) * smoothstep(0., .02, hband));
      float pa = max(length(fwidth(d)), 1e-5);
      if (uStars > .5) {
        // a few star gouges: short cuts, each with its own slant
        vec2 sp2 = d.xz / (1. + d.y) * 15.;
        vec2 ci = floor(sp2), cf = fract(sp2) - .5;
        float hs = h12(ci + uSeed * 3.1);
        float ang = hs * 40.;
        vec2 dir = vec2(cos(ang), sin(ang));
        float al = dot(cf, dir), ac = abs(dot(cf, vec2(-dir.y, dir.x)));
        float pw = pa * 15. / (1. + d.y);
        float gouge = (1. - smoothstep(max(.004, pw * .2), max(.012, pw * .9), ac)) * (1. - smoothstep(.10 + .2 * fract(hs * 7.), .13 + .2 * fract(hs * 7.), abs(al)));
        float tw = .75 + .25 * sin(uTime * (1. + 3. * fract(hs * 13.)) + hs * 60.);
        ink = max(ink, gouge * step(.88, hs) * smoothstep(.2, .45, te) * step(.25, tw));
      }
      if (uRain > .5) {
        // long diagonal cuts sliding down-wind: great circles through the direction the rain falls in
        vec3 R = normalize(vec3(.95, -1., .35));
        vec3 U = normalize(cross(R, vec3(0., 0., 1.))), V = cross(R, U);
        float ra = dot(d, U), rb = dot(d, V), rc = dot(d, R);
        float rr = max(length(vec2(ra, rb)), 1e-4);
        float ph = atan(rb, ra + 1e-6) / 6.2831853 * 240.;
        float id = floor(ph + .5);
        float dl = abs(ph - id) * (6.2831853 / 240.) * rr;
        float hr = h12(vec2(id, 3.7 + uSeed));
        float ln = 1. - smoothstep(pa * .25, pa * 1.05, dl);
        float fc = max(fwidth(rc), 1e-5) * 2.4;
        float dash = lineT(rc * 2.4 - uTime * (.55 + .5 * hr) + hr * 9., 1., .09 + .09 * hr, fc);
        ink = max(ink, ln * dash * step(.3, hr) * smoothstep(.3, .5, rr) * smoothstep(.12, .17, te));
      }
      tone = 1. - ink;
    } else {
      // the water: ink. Its depth is cut into it: level ivory cuts that gather at the underwater horizon (long bold
      // bars with gaps, never closer than about ten pixels at any size of picture) and thin out under it, shorter,
      // finer and fewer, to nothing some thirteen degrees down. So the water has a far and a near and a level line.
      float fe = max(fwidth(te), 1e-6);
      float P = .0058 * exp2(ceil(log2(max(fe * 10. / .0058, 1.))));
      float li = floor(te / P);
      float hl2 = h12(vec2(li, uSeed + 5.));
      float a2 = uTime * (hl2 - .5) * .014 + hl2 * 50.;
      vec2 r2 = vec2(hd.x * cos(a2) - hd.y * sin(a2), hd.x * sin(a2) + hd.y * cos(a2));
      float near = 1. - smoothstep(0., .17, te);
      float nh = vn(r2 * (4. + 60. * te + 4. * hl2) + li * 3.1);       // long cuts at the horizon, short ones under it
      float thr = mix(.82, .30, near * near * near);
      float cut = smoothstep(thr, thr + .12, nh);
      float hw = max(P * .40 * cut * near * near, 2.5 * fe * step(.001, cut));
      tone = (1. - smoothstep(hw * .5 - fe, hw * .5 + fe, abs(fract(te / P) - .5) * P)) * clamp(hw / (2. * fe), 0., 1.) * step(.001, cut) * step(.004, near);
    }
    // paper fibre: a faint mottle fixed to the sheet
    float fib = (vn(gl_FragCoord.xy * vec2(.07, .45)) - .5) * .045 + (vn(gl_FragCoord.xy * .9) - .5) * .03;
    gl_FragColor = vec4(mix(uInk, uPaper * (1. - abs(fib)), tone), 1.);
  }`,ia=`attribute vec4 aP; attribute vec4 aQ;
  uniform vec3 uBox, uCamW; uniform float uTime, uRise, uSide, uSpiral, uTumble, uClear;
  ${pt}
  void main() {
    vec3 base = aP.xyz * uBox;
    base.y += uRise * (.55 + .9 * aP.w) * uTime;
    vec3 c = uCamW + (fract((base - uCamW) / uBox + .5) - .5) * uBox;
    float ph = uTime * aQ.y + aQ.z * 6.2832;
    c.xz += uSpiral * (.4 + aQ.w) * vec2(cos(ph * .6), sin(ph * .6));
    c.x += (1. - uSpiral) * 1.5 * sin(ph * .37);
    c = clearOf(c, uClear, (aQ.zw - .5) * .05);       // uClear metres and more from the flown line
    float ay = ph * 1.3, ax = aQ.w * 2. + uTumble * ph;
    vec3 p = position * aQ.x;
    p = vec3(p.x, p.y * cos(ax) - p.z * sin(ax), p.y * sin(ax) + p.z * cos(ax));
    p = vec3(p.x * cos(ay) + p.z * sin(ay), p.y, -p.x * sin(ay) + p.z * cos(ay));
    vec3 wp = c + p;
    vec3 rel = c - uCamW;
    gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
    if (uSide * c.y < .6 || max(abs(rel.x) / uBox.x, max(abs(rel.y) / uBox.y, abs(rel.z) / uBox.z)) > .47) ${W}
  }`,mt="uniform vec3 uCol; void main() { gl_FragColor = vec4(uCol, 1.); }";function na(){const t=[],a=[];for(let x=0;x<=9;x++){const p=x*.95,y=.2*(1-.35*x/9),r=(x/9-.5)*.9;if(t.push(y*Math.cos(p),r-.07,y*Math.sin(p),y*Math.cos(p),r+.07,y*Math.sin(p)),x<9){const m=x*2;a.push(m,m+1,m+2,m+1,m+3,m+2)}}const v=new e.BufferGeometry;return v.setAttribute("position",new e.Float32BufferAttribute(t,3)),v.setIndex(a),v}function ra(){const t=new e.BufferGeometry;return t.setAttribute("position",new e.Float32BufferAttribute([-.5,0,-.16,.42,0,-.3,.55,0,.12,-.3,0,.3],3)),t.setIndex([0,1,2,0,2,3]),t}function vt(t,a,i,v,x=1){const p=new e.InstancedBufferGeometry;p.index=t.index,p.setAttribute("position",t.getAttribute("position"));const y=new Float32Array(a*4),r=new Float32Array(a*4);for(let d=0;d<a;d++)y[d*4]=i(),y[d*4+1]=i(),y[d*4+2]=i(),y[d*4+3]=i(),r[d*4]=i.range(.45,1.2)*x,r[d*4+1]=i.range(.5,1.6)*(i()<.5?-1:1),r[d*4+2]=i(),r[d*4+3]=i();p.setAttribute("aP",new e.InstancedBufferAttribute(y,4)),p.setAttribute("aQ",new e.InstancedBufferAttribute(r,4)),p.instanceCount=a;const m=new e.Mesh(p,new e.ShaderMaterial({uniforms:v,vertexShader:ia,fragmentShader:mt,side:e.DoubleSide}));return m.frustumCulled=!1,m}const la=`attribute vec4 aSk; attribute vec4 aB;
  uniform vec3 uCamW; uniform float uTime, uShow, uPX, uCeil; uniform vec2 uFrontN;
  void main() {
    float h = aSk.w, spd = aB.z;
    vec2 hd = vec2(cos(h), sin(h)), rt = vec2(-hd.y, hd.x);
    vec2 c = aSk.xy * uPX + hd * spd * uTime;
    c = uCamW.xz + (fract((c - uCamW.xz) / uPX + .5) - .5) * uPX;
    float k = abs(aB.x), sg = aB.x < 0. ? -1. : 1.;
    float br = uTime * .35 + aB.w * 6.2832;
    vec2 o = -hd * k * (6.5 + .8 * sin(br + k)) + rt * sg * k * (5.6 + .7 * cos(br * .8 + k * 1.7));
    vec3 ctr = vec3(c.x + o.x, aSk.z + k * .7 + 2.5 * sin(br * 1.3 + k * .6), c.y + o.y);
    // rare: behind the closing front the skeins tighten into the second plane and are drawn by it
    float fd = dot(ctr.xz, uFrontN) - uCeil;
    float tight = 1. - smoothstep(0., 260., fd);
    ctr.y = mix(ctr.y, 119., tight * tight);
    float dist = distance(ctr, uCamW);
    float s = max(1.1, dist / 110.);
    float flap = sin(uTime * 10. * (.9 + .2 * aB.w) + aB.w * 40. + k) * (1. - tight);
    vec3 p = position;
    p.y += abs(p.z) * (.22 + .34 * flap);
    p.z *= 1. - .12 * flap * flap;
    p *= s;
    vec3 wp = ctr + vec3(p.x * hd.x - p.z * hd.y, p.y, p.x * hd.y + p.z * hd.x);
    gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
    vec2 rel = abs(c - uCamW.xz) / uPX;
    if (uShow < .5 || max(rel.x, rel.y) > .46 || fd < 0.) ${W}
  }`;function fa(t,a,i,v,x){const p=[],y=[];for(let d=0;d<t;d++){const z=a(),w=a(),n=30+146*Math.pow(a(),2.6),s=d<15?a.range(-.15,.15):v+a.gauss()*.35+(a()<.15?Math.PI*a.range(.6,1):0),l=a.range(26,36),o=a.int(4,11),u=x&&a()<.6;for(let h=-o;h<=o;h++)u&&h<0||(p.push(z,w,n,s),y.push(h===0?.001:h,a(),l,a()))}const r=new e.InstancedBufferGeometry;r.setAttribute("position",new e.Float32BufferAttribute([1.5,0,0,.35,0,0,-1.3,0,-4.4,-1.3,0,4.4,-2.3,0,0,.5,0,-.45,.5,0,.45],3)),r.setIndex([0,1,2,0,3,1,5,6,4]),r.setAttribute("aSk",new e.InstancedBufferAttribute(new Float32Array(p),4)),r.setAttribute("aB",new e.InstancedBufferAttribute(new Float32Array(y),4)),r.instanceCount=p.length/4;const m=new e.Mesh(r,new e.ShaderMaterial({uniforms:i,vertexShader:la,fragmentShader:mt,side:e.DoubleSide}));return m.frustumCulled=!1,m}const ha=`attribute vec4 aS; attribute vec4 aR;
  uniform vec3 uCamW; uniform vec4 uBoxS, uRank, uLat; uniform vec2 uFld; uniform float uTime, uShow, uCeil, uDrop, uFront, uSize; uniform vec2 uFrontN;
  varying vec2 vQ; varying float vCov, vUp;
  ${pt}
  void main() {
    float r1 = aR.x, r2 = aR.y, r3 = aR.z, c = aS.z;
    vec2 hd = uRank.xy, nr = vec2(-hd.y, hd.x);
    float cs, cn, n0, row;
    if (uDrop > .5) { cs = dot(uCamW.xz, hd); cn = dot(uCamW.xz, nr); n0 = c / uLat.y * uBoxS.y; row = aS.w * 6.5 * uSize; }
    else { vec2 P = vec2(uFld.x + uBoxS.y * c, uFld.y); cs = dot(P, hd); cn = dot(P, nr); n0 = cn; row = aS.y * uSize + uLat.w * c * uBoxS.w; }
    float sw = cs + (fract(((aS.x / uLat.x + uLat.z * c) * uBoxS.x + uRank.w * uTime - cs) / uBoxS.x + .5) - .5) * uBoxS.x;
    float nw = cn + (fract((n0 - cn) / uBoxS.y + .5) - .5) * uBoxS.y;
    float slope = uRank.z * uBoxS.w / uBoxS.x;
    float y = uBoxS.z + mod(row + sw * slope, uBoxS.w);
    // a curtain is alive: a slow wave runs along it, and every fish keeps a little of its own
    float ph = sw * .031 - uTime * .42 + c * 2.4;
    float na = nw + 2.6 * sin(ph) + (r3 - .5) * 2.4;
    vec3 ctr = vec3(hd.x * sw + nr.x * na, y + .7 * sin(uTime * .27 + r2 * 31.), hd.y * sw + nr.y * na);
    float fd = dot(ctr.xz, uFrontN) - uCeil;
    ctr.y = mix(ctr.y, 117.5, uDrop * (1. - smoothstep(0., 170., -fd)));
    // 10 m and more from the flown line: 13 m from a line 3 m under it, where the fish we ride swims, so the leader has its own water
    ctr = clearOf(ctr, 13., vec2(3., 0.) + (vec2(r3, r2) - .5) * .05);
    vec3 lp = position;
    float wv = (.10 + .34 * (1. - smoothstep(-4., 1.5, lp.x))) * sin(lp.x * 1.1 + uTime * (4.5 + 2. * r1) + r2 * 20.);
    wv += .25 * sin(uTime * 7. + r1 * 9.) * (1. - smoothstep(-2.2, -1.2, lp.z)) * step(-1., lp.x);
    vec3 bd = vec3(lp.x, lp.z, wv);
    float pit = atan(slope) + .05 * cos(uTime * .27 + r2 * 31.);       // nose along the climb
    bd = vec3(bd.x * cos(pit) - bd.y * sin(pit), bd.x * sin(pit) + bd.y * cos(pit), bd.z);
    float yaw = atan(hd.y, hd.x) + atan(2.6 * .031 * cos(ph));
    float cy = cos(yaw), sy = sin(yaw);
    bd = vec3(bd.x * cy - bd.z * sy, bd.y, bd.x * sy + bd.z * cy);
    // at the end of its curtain's reach a fish dwindles away whole (thinning it there left long hairlines); so does one
    // at the top or the bottom of the climb, and one that comes to the unlaid sea
    vec2 e2 = abs(vec2(sw - cs, nw - cn)) / uBoxS.xy * 2.;
    float es = 1. - smoothstep(mix(.84, .72, uDrop), .98, max(e2.x, e2.y));
    es *= smoothstep(0., 5., min(y - uBoxS.z, uBoxS.z + uBoxS.w - y)) * (1. - smoothstep(uFront - 34., uFront - 10., ctr.x));
    // the rare event's ranks, sent about the eye, dwindle whole with their distance too; the ranks of the deep do not
    float dist = distance(ctr, uCamW);
    vCov = mix(1., 1. - smoothstep(66., 330., dist), uDrop) * step(.02, es);
    es *= smoothstep(0., .2, vCov);
    vec3 wp = ctr + bd * es * uSize;
    vQ = position.xz;
    vUp = max(wp.y - uCamW.y + 1.5, uDrop);
    gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
    if (uShow < .5 || vCov <= .001 || (uDrop > .5 && (fd > -6. || aS.w < -.5 || aS.x > uLat.x - .5 || c > uLat.y - .5))) ${W}
  }`,ca=t=>`varying vec2 vQ; varying float vCov, vUp;
${t}
  void main() {
    float fw = max(fwidth(vQ.x), fwidth(vQ.y));
    float aa = clamp(fw * .75, .002, .6);
    // a body seen edge-on carries no cuts (they would beat against the pixels): plain ivory and its key line
    float side = smoothstep(.12, .3, min(fwidth(vQ.x), fwidth(vQ.y)) / max(fw, 1e-5));
    float det = (1. - smoothstep(.07, .3, fw)) * side;
    float red;
    float sd = sdfAt(vQ);
    float tone = fishTone(vQ, sd, aa, det, 0., red);
    // a far fish is still a striped fish: where the tile's own scale rows fall under the pixels, the ribs are cut
    // wider apart, octave by octave of the pixel's own width (every other one narrows and goes), never closer than
    // five pixels nor thinner than a pixel and a half; the last of them go when the fish is some twenty pixels long
    float oc = max(0., log2(fw * 5. / .8)), fo = fract(oc), P = .8 * exp2(floor(oc));
    float ru = vQ.x + .42 * (vQ.y - .2) * (vQ.y - .2);
    float wr = max(.26 * P, 1.5 * fw);
    float ribs = max(lineT(ru, 2. * P, wr, aa), lineT(ru + P, 2. * P, wr * (1. - fo), aa) * step(1.5 * fw, wr * (1. - fo)));
    ribs *= smoothstep(-2.4, -2.0, vQ.x) * (1. - smoothstep(1.1, 1.5, vQ.x)) * smoothstep(2.5 * fw, 3.5 * fw, sd) * (1. - smoothstep(.9, 1.3, fw));
    tone = min(tone, 1. - ribs * side * smoothstep(.07, .3, fw));
    // depth is size and overlap: the fish's own ink key line (a pixel wide at the least) parts a far fish from the fish
    // behind it and from the ceiling
    // the rare event's far fish: a solid paper silhouette inside its key line
    float thin = 1. - smoothstep(.55, .97, vCov);
    float cw = max(.12, 1.6 * fw);
    tone = mix(tone, smoothstep(cw, cw + aa, sd), smoothstep(0., .45, thin));
    gl_FragColor = vec4(mix(uInk, uPaper, smoothstep(.3, .7, tone)), 1.);
  }`,xt=[0,1,3,4];function ua(t,a,i,v,x,p,y){const r=new e.InstancedBufferGeometry;r.index=t.index,r.setAttribute("position",t.getAttribute("position"));const m=xt.length,d=a*m*i,z=new Float32Array(d*4),w=new Float32Array(d*4);for(let l=0;l<d*4;l++)w[l]=x();let n=0;for(let l=0;l<i;l++)for(let o=0;o<m;o++)for(let u=0;u<a;u++,n+=4)z[n]=u+.1*(w[n+3]-.5),z[n+1]=v*xt[o]+.5*(w[n]-.5),z[n+2]=l,z[n+3]=o<3?o:-1;r.setAttribute("aS",new e.InstancedBufferAttribute(z,4)),r.setAttribute("aR",new e.InstancedBufferAttribute(w,4)),r.instanceCount=d;const s=new e.Mesh(r,new e.ShaderMaterial({uniforms:p,vertexShader:ha,fragmentShader:ca(y),side:e.DoubleSide}));return s.frustumCulled=!1,s}const da=`attribute float aKind; attribute vec4 aI; attribute vec4 aJ;
  uniform vec4 uRaft[${re}]; uniform vec4 uRaftB[${re}]; uniform vec3 uSeatR, uCamW, uAxis; uniform vec2 uRingR; uniform float uTime, uShow;
  varying vec2 vQ; varying float vKind, vKeel, vLock;
  void main() {
    int ri = int(clamp(aI.z, 0., ${re-1}.) + .5);
    vec4 R = uRaft[ri];      // centre, heading
    vec4 B = uRaftB[ri];     // roll, lock, release (0: this raft is whole .. 1: all its birds are on the ring), size
    float r1 = aJ.x, r2 = aJ.y;
    float lx = B.y * 2.2 - 1.2 * aJ.w;                    // the lock runs through the raft as a straight front
    float w = clamp(B.z * 1.7 - .7 * aI.w, 0., 1.);      // the release: front rows first
    float lk = smoothstep(0., 1., lx) * (1. - smoothstep(0., .1, w));
    float e = w * w * (3. - 2. * w);
    // where it lands on the ring: a place on the annulus, at the size of the ring's own tiles
    float th = r1 * 6.2832, rr = mix(uRingR.x, uRingR.y, r2);
    vec3 T = uSeatR + vec3(-.6, rr * cos(th), rr * sin(th));
    vec3 hd0 = vec3(cos(R.w), 0., sin(R.w));
    vec2 dT = T.xz - R.xz;
    vec3 hd = normalize(mix(hd0, vec3(dT.x, 0., dT.y) / max(length(dT), 1e-3), .8 * sin(3.1416 * w)) + vec3(1e-4, 0., 0.));
    vec3 rt0 = vec3(-hd.z, 0., hd.x);
    float ro = B.x * (1. - e);
    vec3 rt = rt0 * cos(ro) - vec3(0., sin(ro), 0.);
    vec3 up = vec3(0., cos(ro), 0.) + rt0 * sin(ro);
    vec2 Lc = aI.xy;
    float unf = 1. - lk;
    // loose: a chevron at 1.6 times the cell spacing, every bird drifting on its own; locked: the lattice offset exactly
    vec2 loose = vec2(1.6 * Lc.x - .64 * abs(Lc.y) + 1.6 * sin(uTime * .7 + r1 * 40.), 1.6 * Lc.y + 1.1 * sin(uTime * .9 + r2 * 40.));
    vec2 ab = mix(loose, Lc, lk);
    vec3 ctr = R.xyz + hd * ab.x + rt * ab.y + up * (unf * 1.3 * sin(uTime * 1.1 + r1 * 17.));
    ctr = mix(ctr, T, e);
    // a released bird keeps about 11 m from the line of travel, by the rule the lifted geese of the plane obey
    vec3 dv = ctr - uCamW;
    float al = dot(dv, uAxis);
    vec3 perp = dv - uAxis * al + vec3(0., r2 - .3, r1 - .21) * .05;
    float pl = max(length(perp), 1e-3);
    ctr += perp / pl * (sqrt(pl * pl + 120.) - pl) * (1. - smoothstep(10., 42., abs(al))) * smoothstep(0., .1, w);
    float sc = mix(1., .3, smoothstep(.3, .9, w)) * B.w;
    vec3 lp = position;
    float sgn = lp.z < 0. ? -1. : 1., az = abs(lp.z);
    float beat = sin(uTime * 6.2832 * 1.5 * (.9 + .2 * r2) + r1 * 30.);
    float ang = (beat * .5 + .14) * unf;
    float arm = max(az - .9, 0.) * (1. + 1.25 * unf);
    float y = arm * sin(ang) - .22 * beat * unf + lp.y * unf * 1.5;
    float span = min(az, .9) + arm * cos(ang);
    float x = lp.x - unf * arm * .22;
    vec3 wp = ctr + sc * (x * hd + y * up + sgn * span * rt);
    // the fish in the gap behind this goose: there only while the raft is locked, in its exact cell
    if (aKind > .5) wp = R.xyz + hd * (Lc.x - 4. + lp.x) + rt * (Lc.y - 2.5 + lp.z);
    vQ = position.xz; vKind = aKind; vLock = lk;
    vKeel = (aKind < .5 && abs(lp.y) > 1e-4) ? 1. : 0.;
    gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
    if (uShow < .5 || w > .995 || (aKind > .5 && (lx < 1.03 || w > 0. || aJ.z < .5))) ${W}
  }`,pa=t=>`varying vec2 vQ; varying float vKind, vKeel, vLock;
${t}
  void main() {
    float fx = fwidth(vQ.x), fz = fwidth(vQ.y), fw = max(fx, fz);
    float aa = clamp(fw * .75, .002, .6);
    float sdF = sdfAt(vQ), sg = -sdfAt(vQ + vec2(4., 2.5));
    float red, tone;
    if (vKind > .5) {
      tone = fishTone(vQ, sdF, aa, 1. - smoothstep(.07, .3, fw), 0., red);
    } else {
      float det = max((1. - smoothstep(.03, .10, fw)) * smoothstep(.12, .3, min(fx, fz) / max(fw, 1e-5)), vLock * (1. - smoothstep(.07, .3, fw)));
      tone = vKeel > .01 ? 0. : gooseTone(vQ, sg, aa, det, 0., 0., 0., red);
      // a paper key line while it flies free; locked, the bird's edge is the fish's own key line
      float kw = max(.12, min(aa * 1.5, .32));
      float key = (1. - smoothstep(kw - aa, kw + aa, sg)) * (1. - smoothstep(.85, 1., vLock));
      tone = max(tone, vKeel > .01 ? 0. : key);
    }
    gl_FragColor = vec4(mix(uInk, uPaper, smoothstep(.3, .7, tone)), 1.);
  }`;function ma(t,a,i,v,x,p){const y=t.getAttribute("position").array,r=a.getAttribute("position").array,m=y.length/3,d=r.length/3,z=new Float32Array(y.length+r.length),w=new Float32Array(m+d);z.set(y),z.set(r,y.length),w.fill(1,m);const n=Array.from(t.index.array);for(const c of a.index.array)n.push(c+m);const s=new e.InstancedBufferGeometry;s.setAttribute("position",new e.BufferAttribute(z,3)),s.setAttribute("aKind",new e.BufferAttribute(w,1)),s.setIndex(n);const l=dt.reduce((c,[T,S])=>c+T*S,0),o=new Float32Array(l*4),u=new Float32Array(l*4);let h=0;for(let c=0;c<re;c++){const[T,S]=dt[c],C=Math.abs(p.x)*8*(T-1)+Math.abs(p.y)*5*(S-1);for(let L=0;L<T;L++)for(let b=0;b<S;b++,h+=4){const E=8*(L-(T-1)/2),Y=5*(b-(S-1)/2);o[h]=E,o[h+1]=Y,o[h+2]=c,o[h+3]=1-L/(T-1),u[h]=x(),u[h+1]=x(),u[h+2]=L>0&&b>0?1:0,u[h+3]=j((E*p.x+Y*p.y)/C+.5,0,1)}}s.setAttribute("aI",new e.InstancedBufferAttribute(o,4)),s.setAttribute("aJ",new e.InstancedBufferAttribute(u,4)),s.instanceCount=l;const f=new e.Mesh(s,new e.ShaderMaterial({uniforms:i,vertexShader:da,fragmentShader:pa(v),side:e.DoubleSide}));return f.frustumCulled=!1,f}const va=t=>`varying vec3 vP; uniform float uCeil; uniform vec2 uFrontN;
${t}
  void main() {
    if (dot(vP.xz, uFrontN) - uCeil > 0.) discard;
    vec2 p = vP.xz / 3.;      // cut three times larger, so the interlock still reads from 110 m below
    float fx = fwidth(p.x), fz = fwidth(p.y), fw = max(fx, fz);
    float aa = clamp(fw * .75, .002, .6);
    float det = 1. - smoothstep(.07, .3, fw);
    float red, hole;
    float tone = tilingTone(p, aa, det, 1., vec2(0., 1.), red, hole);
    float e = clamp(.5 * min(fx, fz) / max(fw, 1e-5) * (fw * .75 / aa), .09, .5);
    float T = smoothstep(.5 - e, .5 + e, tone);
    // past the range where the interlock can be cut: straight lines parallel to the closing front, thinning to bare
    // paper with distance, so only the nearby tiling and the front itself are seen overhead (never rings)
    float w = max(smoothstep(.7, 1.7, fx), smoothstep(.7, 1.7, fz));
    float hx = dot(p, uFrontN);
    float fh = fwidth(hx);
    float dist = length(vP.xz - uCamL.xz);
    float fade = 1. - smoothstep(160., 380., dist);
    if (fade < .003) discard;
    float edge = 1. - smoothstep(4., 30., (uCeil - dot(vP.xz, uFrontN)) / 3.);       // the closing front: a heavy line
    float duty = max(.5 * fade, .8 * edge);
    float inkF = octLines(hx, fh, 8., duty * w);
    float inkG = octLines(hx, fh, 8., 1. - (1. - duty) * w);
    float ink = mix(1. - inkG, 1. - inkF, T);
    gl_FragColor = vec4(mix(uInk, uPaper, ink), 1.);
  }`;function xa(t){const a=t.length,i=44,v=8,x=[],p=[],y=[],r=[],m=l=>{let o=1e9,u=-1e9;for(let h=0;h<a;h++){const f=t[h],c=t[(h+1)%a];if((f.x-l)*(c.x-l)<=0&&f.x!==c.x){const T=f.y+(c.y-f.y)*(l-f.x)/(c.x-f.x);o=Math.min(o,T),u=Math.max(u,T)}}return o>u?[0,0]:[o,u]},d=[-2,-1,-.8,-.4,0,.4,.8,1,2];for(let l=0;l<=i;l++){const o=-3.97+7.94*l/i,[u,h]=m(o),f=(o-.7)/3.25,c=Math.abs(f)<1?1.22*Math.sqrt(1-f*f):0;for(const T of[1,-1])for(let S=0;S<=v;S++){const C=S===0?u:S===v?h:j(d[S]*c,u,h),L=c>0&&Math.abs(C)<c?.5*c*Math.sqrt(1-C/c*(C/c)):0;x.push(o,C,T*Math.max(.012,L)),p.push(0,0),y.push(0)}}const z=2*(v+1);for(let l=0;l<i;l++)for(let o=0;o<2;o++)for(let u=0;u<v;u++){const h=l*z+o*(v+1)+u,f=h+z;o===0?r.push(h,f,h+1,h+1,f,f+1):r.push(h,h+1,f,h+1,f+1,f)}const w=4,n=2;for(const l of[1,-1]){const o=x.length/3;for(let u=0;u<=w;u++)for(let h=0;h<=n;h++){const f=u/w,c=h/n;x.push(1.9-1*c-1.1*f-.35*f*c,.35,l*(.5+2*f*(1-.25*c))),p.push(f,c),y.push(1)}for(let u=0;u<w;u++)for(let h=0;h<n;h++){const f=o+u*(n+1)+h,c=f+n+1;r.push(f,c,f+1,f+1,c,c+1)}}const s=new e.BufferGeometry;return s.setAttribute("position",new e.Float32BufferAttribute(x,3)),s.setAttribute("uv",new e.Float32BufferAttribute(p,2)),s.setAttribute("aKind",new e.Float32BufferAttribute(y,1)),s.setIndex(r),s.computeVertexNormals(),s}const wa=`attribute float aKind;
  uniform float uFlat, uSwim, uTime, uShow;
  varying vec2 vQ, vUv; varying vec3 vN, vV; varying float vBody, vKind;
  void main() {
    vec3 p = position;
    float lat = p.z * (1. - uFlat);
    float w = uSwim * (.04 + .30 * (1. - smoothstep(-4., 1.5, p.x))) * sin(p.x * 1.1 + uTime * 5.5);
    float fin = smoothstep(1.3, 1.9, p.y) * uSwim * .30 * sin(p.x * 2.4 - uTime * 4.2);
    float y = p.y;
    if (aKind > .5) {
      float arm = abs(p.z) - .5;
      y += arm * (.22 + .5 * sin(uTime * 5.2 - arm * .9)) * uSwim * (1. - uFlat);
      fin = 0.;
    }
    vec3 lp = vec3(p.x, y, lat + w + fin);
    vQ = p.xy; vUv = uv; vBody = abs(p.z); vKind = aKind;
    vec4 mv = modelViewMatrix * vec4(lp, 1.);
    vN = normalMatrix * normal; vV = -mv.xyz;
    gl_Position = projectionMatrix * mv;
    if (uShow < .5 || (aKind > .5 && uFlat > .97)) ${W}
  }`,ya=t=>`varying vec2 vQ, vUv; varying vec3 vN, vV; varying float vBody, vKind;
  uniform float uFlat;
${t}
  void main() {
    float tone, red = 0.;
    if (vKind > .5) {
      float au = max(fwidth(vUv.y), 1e-4) * .75;
      float rays = lineT(vUv.y + vUv.x * .22, .2, .05 + au, au) * smoothstep(.12, .3, vUv.x);
      float eu = max(fwidth(vUv.x), 1e-4);
      float edge = min(min(vUv.y / max(au * 1.4, 1e-4), (1. - vUv.y) / max(au * 1.4, 1e-4)), (1. - vUv.x) / eu) ;
      tone = (1. - rays) * smoothstep(1.5, 2.5, edge);
    } else {
      float fw = max(fwidth(vQ.x), fwidth(vQ.y));
      float aa = clamp(fw * .75, .002, .6);
      float det = 1. - smoothstep(.07, .3, fw);
      float sd = sdfAt(vQ);
      tone = fishTone(vQ, sd, aa, det, 1., red);
      // while it swims the back is cut lightly (a few ribs and a spine line), so it reads as an ivory body
      float lw = max(.045, aa * 1.2);
      float bodyM = smoothstep(-2.6, -2.1, vQ.x) * (1. - smoothstep(2.0, 2.6, vQ.x)) * (1. - smoothstep(1.2, 1.32, abs(vQ.y)));
      float ribs = lineT(vQ.x + .42 * (vQ.y - .2) * (vQ.y - .2), .8, .07 + aa, aa) * smoothstep(.25, .5, abs(vQ.y - .9));
      float own = smoothstep(lw - aa, lw + aa, sd) * (1. - ribs * det);
      tone = mix(tone, own, bodyM * (1. - uFlat));
      float nl = max(dot(vN, vN), 1e-8), vl = max(dot(vV, vV), 1e-8);
      float ndv = abs(dot(vN, vV)) * inversesqrt(nl * vl);
      float sil = (1. - smoothstep(.13, .19, ndv)) * smoothstep(.04, .10, vBody) * (1. - uFlat);
      tone *= 1. - sil; red *= 1. - sil;
    }
    vec3 col = mix(uInk, uPaper, tone);
    gl_FragColor = vec4(mix(col, uAccent, red), 1.);
  }`,wt="const float LI = 2.3, LO = 3.4, CW = 1.6;";function ga(){const t=[],a=[],i=[];for(let d=0;d<=8;d++){const z=-4+8*d/8;if(t.push(z,0,-2.5,z,0,2.5),a.push(0,0),d<8){const w=d*2;i.push(w,w+1,w+2,w+1,w+3,w+2)}}const r=[0,2.3*.5,2.3,2.3+3.4*.25,2.3+3.4*.5,2.3+3.4*.75,2.3+3.4];for(const d of[-1,1]){const z=t.length/3;r.forEach((w,n)=>{if(t.push(w,0,d,w,w<=2.3?1.6:1.6*(1-(w-2.3)/3.4),d),a.push(1,1),n<r.length-1){const s=z+n*2;i.push(s,s+1,s+2,s+1,s+3,s+2)}})}const m=new e.BufferGeometry;return m.setAttribute("position",new e.Float32BufferAttribute(t,3)),m.setAttribute("aPart",new e.Float32BufferAttribute(a,1)),m.setIndex(i),m}const ba=`attribute float aPart;
  uniform float uUnfold, uBeat, uShow;
  varying vec2 vQ; varying float vPart;
  ${wt}
  void main() {
    float beat = sin(uBeat);
    float wu = smoothstep(.1, .7, uUnfold);       // the wings come out of the body as the cell is cut back to a bird
    vec3 B;
    if (aPart < .5) {
      B = vec3(position.x, .26 * wu, position.z);
      B.y += smoothstep(1.2, 4., position.x) * (.10 * sin(uBeat - 1.3) - .12);     // the head nods a little after the beat
      vQ = position.xz;
    } else {
      float s = position.x, c = position.y;
      float a1 = .28 + .36 * beat, a2 = a1 - .06 - .16 * (1. + cos(uBeat));
      vec3 W = normalize(vec3(.20, sin(a1), cos(a1))) * min(s, LI) + normalize(vec3(-.52, sin(a2), cos(a2))) * max(s - LI, 0.)
        + vec3(-.94, -.34, 0.) * c;                // the chord is set leading edge up: the back of the wing faces the seat
      B = vec3(.95, 0., .22) + W * wu; B.z *= position.z;
      vQ = position.xy;
    }
    B.y -= .22 * beat * uUnfold;                  // the body rides down as the wings go up
    vec4 wp = modelMatrix * vec4(B, 1.);
    if (cameraPosition.y > 0.) wp.y = max(wp.y, .04);     // over the plane nothing of it dips through the plane: until we are a seat's height up it lies on it
    vPart = aPart;
    gl_Position = projectionMatrix * viewMatrix * wp;
    if (uShow < .5 || (aPart > .5 && wu < .01)) ${W}
  }`,ka=t=>`varying vec2 vQ; varying float vPart; uniform float uUnfold;
${t}
  ${wt}
  float smax(float a, float b, float k) { float h = max(k - abs(a - b), 0.) / k; return max(a, b) + h * h * k * .25; }
  void main() {
    float fx = fwidth(vQ.x), fz = fwidth(vQ.y), fw = max(fx, fz);
    float aa = clamp(sqrt(fx * fz) * .9, .002, .08);       // crisp cuts even where a sheet is seen steeply
    float edge, cuts, bill = 0., eye = 0.;
    if (vPart < .5) {
      float sg = -sdfAt(vQ + vec2(4., 2.5));
      float x = vQ.x, ay = abs(vQ.y);
      // once it has unfolded, the tile is cut back to a bird: a slim neck, a head and a bill ahead of an oval back with
      // a short fanned tail (as a flat cell it is the whole tile)
      // (the head and the bill: the tile's long bill is cut back to a goose's short one as the bird unfolds, the head
      // set forward on the neck: hx is the head's middle, bx the root of the bill, tx its tip)
      float un = smoothstep(.15, .6, uUnfold), hx = mix(2.6, 3.0, un), bx0 = mix(2.85, 3.3, un), tx = mix(4.02, 3.9, un);
      float hd = (x - hx) / .36;
      float hw = mix(.21, .26, un) + .37 * exp(-hd * hd);
      hw = min(hw, mix(.52, .56, un) * (tx - x) / (tx - bx0)) * step(-1., x);
      float bx = (x + .9) / 2.;
      hw = smax(hw, .74 * sqrt(max(1. - bx * bx, 0.)) * mix(1., .7, smoothstep(-1.4, 1., x)), .3);     // a slim back that narrows to the shoulders
      hw = max(hw, step(-3.6, x) * step(x, -2.4) * mix(.42, .80, clamp((-2.4 - x) / 1.2, 0., 1.)));
      hw += (1. - smoothstep(.15, .6, uUnfold)) * 6.;
      edge = min(sg + 1.2 * un, hw - ay);       // unfolded, the bird's outline is its own: the head is wider than the tile's bill was
      // feather scallops in staggered rows over the back, long primaries toward the tips of the tile's own wings
      // each family of cuts is kept only where its own spacing is resolved along its own direction
      float r = x + ay * .55;
      float pc = ay + .42 * x;
      float rn = x + ay * .9;
      float fr = fwidth(r), fp = fwidth(pc), fn = fwidth(rn);
      float dS = 1. - smoothstep(.11, .19, fr), dP = 1. - smoothstep(.09, .15, fp), dN = 1. - smoothstep(.07, .11, fn), dT = 1. - smoothstep(.05, .08, fz);
      float row = floor(r / .58);
      float fc = fract(ay / .5 + .5 * mod(row, 2.)) - .5;
      float scal = lineT(r - .58 * 1.5 * fc * fc, .58, .05 + aa * .5, max(aa, .6 * fr)) * dS;
      float primM = max(smoothstep(1.3, 1.5, ay) * step(x, .1 + .2 * ay), (1. - dS) * smoothstep(.9, 1.1, ay));
      float prim = lineT(pc, .44, max(.05 + aa * .4, 1.6 * fp), max(aa, .6 * fp)) * dP;
      float body = smoothstep(-3., -2.5, x) * (1. - smoothstep(1.0, 1.5, x));
      float tail = lineT(vQ.y, .24, .05 + aa * .4, aa) * (1. - smoothstep(-2.9, -2.6, x)) * dT;
      // neck feathers: the same staggered scallops, cut finer
      float rowN = floor(rn / .34);
      float fn2 = fract(ay / .24 + .5 * mod(rowN, 2.)) - .5;
      float ring = lineT(rn - .34 * 1.5 * fn2 * fn2, .34, .045 + aa * .5, max(aa, .6 * fn)) * dN * step(.9, x) * step(x, hx - .3) * (1. - smoothstep(.2, .5, ay - .12 * (2.3 - x)));
      cuts = max(max(mix(scal, prim, primM) * body, tail), ring);
      // bill and eye in the accent
      bill = smoothstep(bx0, bx0 + 2. * aa, x);
      eye = 1. - smoothstep(.09 - aa, .09 + aa, length(vec2(x - hx + .08, ay - .25)));
    } else {
      // a wing. The arm: the coverts as two rows of scallops over the leading half, one line where they end, and
      // behind it the secondaries, cut apart, their tips the scalloped trailing edge. The hand: the primaries, a fan
      // of seven fingers from the wrist, the outermost along the leading edge to the wing's point, parted at their tips
      float s = vQ.x, c = vQ.y;
      float fs = fwidth(s), fcw = fwidth(c);
      if (s < LI) {
        float ch = CW * mix(.94, .86, s / LI), ft = 2. * fract(s / .46) - 1.;
        edge = min(c - .02, ch * (1. - .13 * ft * ft) - c);
        float row = floor(c / .36);
        float fq = fract(s / .46 + .5 * mod(row, 2.)) - .5;
        float scal = lineT(c - .36 * 1.4 * fq * fq - .13, .36, .05 + aa * .5, max(aa, .6 * fcw)) * step(.2, c) * step(c, .55 * ch) * (1. - smoothstep(.10, .17, fcw));
        float fl = lineT(s, .46, .05 + aa * .5, max(aa, .6 * fs)) * step(.62 * ch, c) * (1. - smoothstep(.11, .17, fs));
        float cl = (1. - smoothstep(.035, .035 + aa, abs(c - .60 * ch))) * (1. - smoothstep(.10, .16, fcw));
        cuts = max(max(scal, fl), cl);
      } else {
        vec2 d = vec2(s - LI, c);
        float rho = max(length(d), 1e-3), fa = atan(d.y, d.x) * 4.4563;     // 7 fingers over the quarter turn
        float ft = 2. * fract(fa) - 1., ff = fwidth(fa), f2 = ft * ft;
        float rt = LO * CW / (CW * d.x / rho + LO * d.y / rho);              // the panel's own edge along this ray
        edge = min(c - .02, .98 * rt * (1. - .20 * f2 - .16 * f2 * f2 * f2) - rho);
        float m = .2244 * rho;                                                // metres to one finger at this radius
        cuts = lineT(fa, 1., (.05 + aa * .5) / m, max(aa / m, .6 * ff)) * step(.9, rho) * (1. - smoothstep(.22, .33, ff));
        cuts = max(cuts, (1. - smoothstep(.035, .035 + aa, abs(rho - rt * (.42 - .06 * f2)))) * (1. - smoothstep(.10, .16, fwidth(rho))));
      }
    }
    if (edge < 0.) discard;
    cuts *= smoothstep(.15, .22, edge);
    // paper key line, so the black bird stands off the black cells beneath it
    float key = 1. - smoothstep(.07 - aa, .07 + aa, edge);
    float tone = max(cuts, key);
    float red = max(bill * (1. - key), eye);
    vec3 col = mix(uInk, uPaper, tone * (1. - eye));
    gl_FragColor = vec4(mix(col, uAccent, red), 1.);
  }`,I={cell:40,file:10,fade:[110,190],cut:.5,growTo:44,growBy:10,fan:14},N=t=>Number.isInteger(t)?t+".":String(t),yt="const float LI = 2.5, LO = 4.0, CW = 2.5;",Sa=t=>`attribute vec4 aL; attribute float aQ; attribute float aP;
  uniform vec4 uLiftC;     // birds a file holds at once, speed forward (m/s), climb (m over the first second), second at which it begins to level
  uniform vec3 uLiftS;     // what is sent: the lanes' reach to the side of the eye (+ the lanes' larger offset), the radius of the lift's disc (2550 m, 50 m inside the plane's edge) squared, lanes a side
  varying vec2 vQ; varying float vPart, vUnf;
  ${t}
  ${yt}
  float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7)) + uLiftA.z) * 43758.5453); }
  void main() {
    // WHAT IS SENT: a rule of what is sent, not of what is seen. The rule of the place (which cell gives a bird and
    // everything that bird is) reads nothing of it. No bird is drawn further from the eye than the fade's cut at full
    // growth, so slots are made (makeLift) only for the lanes and the rank fronts within that reach of the eye's place,
    // counted outward from the low edge of that box about the eye: aL.x is the lane's place in it, aL.y the rank
    // front's on its file. They are the same birds in the same cells at the same ages as when every lane and every
    // front of the whole plane had a slot; the slots that hold no bird of the plane are clipped as before.
    float n = ceil((cameraPosition.z - uLiftS.x) / uLiftA.y) + aL.x;       // lanes numbered across the avenue: 0, 1, .. on the +z side, -1, -2, .. on the -z side
    float side = n < 0. ? -1. : 1., i = n < 0. ? -n - 1. : n;
    float z = side * (uLiftA.x + uLiftA.y * i + ${N(I.file)} * aL.z);
    // the lane's rank fronts are every uLiftB.z-th front; where the one this slot serves crosses this file
    float c0 = mod(-(i + (side > 0. ? uLiftB.y : uLiftB.x)), uLiftB.z);
    float Dx = uLiftB.z * uWave.w / uWave.x;
    float X0 = (uWave.z - c0 * uWave.w - uWave.y * z) / uWave.x;
    // a file's rank fronts are those on its chord of the lift's disc (hc: half of it), Qn of them, as before; the
    // slot's own is counted from the eye: the first at or behind aQ metres ahead of it, then every next one back
    float hc = sqrt(max(uLiftS.y - z * z, 0.)), Qn = max(1., ceil(2. * hc / Dx)), jhi = floor((X0 + hc) / Dx);
    float j = ceil((X0 - cameraPosition.x - aQ) / Dx) + aL.y;
    float xf = X0 - j * Dx;
    // the file's giving cells stand 40 m apart: this slot draws the aL.w-th of them behind the front
    float x0 = 4. + 8. * liftPick(i, side);
    float cx = x0 + ${N(I.cell)} * (floor((xf - x0) / ${N(I.cell)}) - aL.w);
    float tt = (xf - cx) * uWave.x / uLiftB.w;           // seconds since the front passed the cell
    float life = uLiftC.x * ${N(I.cell)} * uWave.x / uLiftB.w;
    float h1 = h21(vec2(cx, z)), h2 = h21(vec2(z, cx));
    float T0 = .8 + .25 * h1;                             // it thickens in its cell as the front passes and leaves the plane a little later
    float tf = max(tt - T0, 0.);
    float swell = smoothstep(0., .3, tt), unfold = smoothstep(T0 - .1, T0 + .4, tt);   // its wings are out as it leaves the plane
    float run = uLiftC.y * (tf - .5 * (1. - exp(-tf / .5)));
    // the climb steepens to uLiftC.w seconds, then eases out level over the next second or so
    float tb = uLiftC.w, tc = min(tf, tb), ue = max(tf - tb, 0.), mb = uLiftC.z * 1.8 * pow(tb, .8);
    float rise = uLiftC.z * pow(tc, 1.8) + mb * .8 * (1. - exp(-ue / .8));
    float vr = tf < tb ? uLiftC.z * 1.8 * pow(tf + .02, .8) : mb * exp(-ue / .8);
    float pit = (atan(vr, uLiftC.y * (1. - exp(-tf / .5)) + .5) + .5 * exp(-ue / .8)) * smoothstep(0., .4, tf);   // pitched to its climb and steeper than its path while it labours up; it levels as its path does
    // it grows as it climbs, as the creatures of the ring grow outward from its rim: the tile's size at the plane,
    // 5.4 times that from 44 m up, and the three files open like a fan, away from the avenue, to keep wingtip to
    // wingtip
    float grow = 1. + min(rise, ${N(I.growTo)}) / ${N(I.growBy)};
    // the ring's pull, a rule of the ring's place: a goose from a cell before the ring and within its reach leans,
    // once it is above the ring's own height, toward a point 24 m to one side of the ring (that point is taken
    // once, from its CELL; the lean grows through the 26 m above the ring's height and is then held; the bird does
    // not circle the ring), so the tops of the ranks lean in over the ring and the air before the
    // ring stays clear. The reach (uLiftR.w, 520 m) is measured from the ring's own seat to the bird's cell, never to
    // the eye; the pull is full inside .45 of it (234 m) and fades out to the reach. Both are typed numbers, not
    // derived from the ring's size, the fronts' spacing or the route's length.
    vec2 toR = uLiftR.xz - vec2(cx, z);
    float dR = max(length(toR), 1.);
    vec2 aim = normalize(toR + 24. * vec2(-toR.y, toR.x) / dR);
    float pull = (1. - smoothstep(.45 * uLiftR.w, uLiftR.w, dR)) * smoothstep(30., 110., toR.x) * smoothstep(uLiftR.y, uLiftR.y + 26., rise);
    vec2 dir = normalize(mix(vec2(1., 0.), aim, .85 * pull));
    vec2 sw = swellAt(vec2(cx, z));
    vec3 ctr = vec3(cx + sw.x + dir.x * run, rise, z + sw.y + dir.y * run + side * ${N(I.fan)} * (aL.z + 1.) * (grow - 1.));
    // the bird in its own frame (x ahead, y up, z to its side), by part
    vec3 B;
    if (aP < .5) { B = vec3(position.x, 0., position.z); vQ = position.xz; }
    else if (aP < 2.5) {
      // a wing: the arm beats about the shoulder, the hand follows it, bent down at the wrist (most on the way up)
      // and swept back; the chord is set leading edge up, so the wing is a band of ink from behind as from below
      float ph = uTime * 6.2832 * 1.5 * (.9 + .2 * h2) + h1 * 40.;
      float a1 = .30 + .65 * sin(ph), a2 = a1 - .5 - .35 * (1. + cos(ph));
      vec3 W = normalize(vec3(.25, sin(a1), cos(a1))) * min(position.x, LI) + normalize(vec3(-.7, sin(a2), cos(a2))) * max(position.x - LI, 0.)
        + vec3(-.9, -.436, 0.) * position.y;
      B = vec3(1.1, .18, .5) + W * unfold; B.z *= position.z;
      vQ = position.xy;
    }
    else if (aP < 3.5) { B = vec3(position.x, position.y * swell * (.4 + .6 * unfold), 0.); vQ = position.xy; }
    else { B = vec3(-.4, position.y * unfold, position.z * unfold); vQ = position.zy; }
    B.y += .05 + .5 * swell;
    // pitched about its tail, which keeps to the path
    float cp = cos(pit), sp = sin(pit);
    vec3 b = vec3((B.x + 3.5) * cp - B.y * sp - 3.5, (B.x + 3.5) * sp + B.y * cp, B.z);
    vec2 hd = normalize(mix(vec2(1., 0.), dir, smoothstep(0., .8, tf)));
    // every bird, the full-grown one too, ends its flight by shrinking, whole, to half its size and is then not
    // drawn; one far from the eye for its size is drawn smaller in the same way (metres from the eye, as the hero's
    // geese fade) and is not drawn where that would be under half its size, so a far bird appears at half size: no specks
    float sc = (1. - smoothstep(.86, 1., tt / life)) * (1. - smoothstep(${N(I.fade[0])}, ${N(I.fade[1])}, distance(ctr, cameraPosition) / grow));
    vec3 wp = ctr + sc * grow * vec3(b.x * hd.x - b.z * hd.y, b.y, b.x * hd.y + b.z * hd.x);
    wp.y = max(wp.y, .03);                                // nothing dips through the plane
    vPart = aP; vUnf = unfold;
    gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
    if (uLiftA.w < .5 || tt < 0. || tt >= life || sc < ${N(I.cut)} || (aP > .5 && aP < 2.5 || aP > 3.5) && unfold < .01 || cx * cx + z * z > 6.5e6) ${W}
    if (i >= uLiftS.z || j > jhi || j <= jhi - Qn) ${W}     // a slot of the box about the eye that holds no lane or no rank front of the plane
  }`,za=t=>`varying vec2 vQ; varying float vPart, vUnf;
${t}
  ${yt}
  float seg(float x, float a, float b) { return step(a, x) * step(x, b); }
  void main() {
    float fx = fwidth(vQ.x), fz = fwidth(vQ.y), fw = max(fx, fz);
    float aa = clamp(fw * .75, .002, .6);
    float ac = clamp(sqrt(fx * fz) * .9, .002, .3);       // for the cuts: crisp where a part is seen steeply
    float edge, cuts = 0.;
    if (vPart < .5) {
      // the body from above. Flat in its cell it is the whole tile's goose; as it leaves it is a flying goose's own
      // outline: body, a long slim neck, a small head and a bill, a short fanned tail
      float x = vQ.x, ay = abs(vQ.y);
      float bx = (x + .9) / 1.95, hx = (x - 3.3) / .5;
      float e = .98 * sqrt(max(1. - bx * bx, 0.));
      e = max(e, seg(x, .4, 3.3) * mix(.38, .26, clamp((x - .6) / 2.6, 0., 1.)));
      e = max(e, .44 * sqrt(max(1. - hx * hx, 0.)));
      e = max(e, step(3.6, x) * .20 * clamp((4.02 - x) / .42, 0., 1.));
      e = max(e, seg(x, -3.5, -2.3) * mix(.40, .75, clamp((-2.3 - x) / 1.2, 0., 1.)));
      edge = mix(-sdfAt(vQ + vec2(4., 2.5)), min(e - ay, x + 3.5), smoothstep(0., .6, vUnf));
      // cuts, each kept only while it is three pixels or more: a ring at the foot of the neck, a crescent over the
      // rump, the tail's fan (no rows of scallops over the back: on a body they are a fish's scales)
      float ring = (1. - smoothstep(.07, .07 + aa, abs(x - 1.05))) * (1. - smoothstep(.05, .09, fx));
      float rump = (1. - smoothstep(.08, .08 + aa, abs(x + 2.0 + .5 * ay * ay))) * step(-2.5, x) * (1. - smoothstep(.06, .10, fx));
      float tail = lineT(vQ.y, .22, .05 + ac * .4, ac) * step(x, -2.55) * (1. - smoothstep(.05, .073, fz));
      cuts = max(max(rump, ring), tail);
    } else if (vPart < 2.5) {
      // a wing in metres along it (s) and back from its leading edge (c). The arm: a broad band whose trailing edge
      // is the secondaries' tips. The hand: the primaries, a fan of seven fingers that spread from the wrist, the
      // outermost along the leading edge to the wing's point, the innermost meeting the arm
      float s = vQ.x, c = vQ.y, hand = step(LI, s);
      float fsw = fwidth(s), fcw = fwidth(c);
      if (hand < .5) {
        float ch = mix(2.3, 2.0, s / LI), ft = 2. * fract(s / .5) - 1.;
        edge = min(c - .03, ch * (1. - .16 * ft * ft) - c);
        // cuts: between the feathers (the rear of the chord only), and one line where the coverts end
        float fl = lineT(s, .5, .05 + ac * .5, max(ac, .6 * fsw)) * step(.64 * ch, c) * (1. - smoothstep(.11, .17, fsw));
        cuts = max(fl, (1. - smoothstep(.04, .04 + aa, abs(c - .50 * ch))) * (1. - smoothstep(.10, .16, fcw)));
      } else {
        vec2 d = vec2(s - LI, c);
        float rho = max(length(d), 1e-3), fa = atan(d.y, d.x) * 4.4563;     // 7 fingers over the quarter turn
        float ft = 2. * fract(fa) - 1., ff = fwidth(fa);
        float rt = LO * CW / (CW * d.x / rho + LO * d.y / rho);              // the panel's own edge along this ray
        edge = min(c - .03, .98 * rt * (1. - .28 * ft * ft) - rho);
        float m = .2244 * rho;                                                // metres to one finger at this radius
        cuts = lineT(fa, 1., (.05 + ac * .5) / m, max(ac / m, .6 * ff)) * step(1.0, rho) * (1. - smoothstep(.22, .33, ff));
      }
    } else if (vPart < 3.5) {
      // the body from the side
      float x = vQ.x, y = vQ.y;
      float bx = (x + .9) / 1.95, hx = (x - 3.3) / .5;
      edge = .70 * sqrt(max(1. - bx * bx, 0.)) - abs(y + .16) - step(1., abs(bx));
      edge = max(edge, mix(-1., .27 - abs(y - .03 * (x - .6)), seg(x, .4, 3.3)));
      edge = max(edge, .38 * sqrt(max(1. - hx * hx, 0.)) - abs(y - .09) - step(1., abs(hx)));
      edge = max(edge, mix(-1., .15 * (4.02 - x) / .42 - abs(y - .05), step(3.6, x)));
      edge = max(edge, mix(-1., .12 - abs(y), seg(x, -3.5, -2.3)));
    } else {
      // the body from behind
      edge = (1. - length(vec2(vQ.x / .98, (vQ.y + .16) / .72))) * .72;
    }
    // the silhouette, one pixel wide across the edge itself
    float cov = clamp(edge / max(.75 * fwidth(edge), 1e-4) + .5, 0., 1.);
    if (cov <= 0.) discard;
    cuts *= smoothstep(.15, .22, edge) * smoothstep(.2, .7, vUnf);
    // a paper key line round the body and the wings, so black over black and over the plane still reads as birds
    float kw = max(.09, min(aa * 1.5, .32));
    float tone = vPart > 2.5 ? 0. : max(cuts, 1. - smoothstep(kw - aa, kw + aa, edge));
    gl_FragColor = vec4(mix(uInk, uPaper, smoothstep(.3, .7, tone)), cov);
  }`;function La(t,a,i,v,x){const p=[],y=[],r=[],w=(k,M,X,_,H)=>{const P=p.length/3;p.push(...M,...X,..._,...H),y.push(k,k,k,k),r.push(P,P+2,P+1,P,P+3,P+2)};w(0,[-4,0,-2.5],[4,0,-2.5],[4,0,2.5],[-4,0,2.5]);for(const k of[-1,1]){w(1,[0,0,k],[2.5,0,k],[2.5,2.5,k],[0,2.5,k]);const M=p.length/3;p.push(2.5,0,k,2.5+4,0,k,2.5,2.5,k),y.push(2,2,2),r.push(M,M+1,M+2)}w(3,[-3.6,-1.02,0],[4.1,-1.02,0],[4.1,.7,0],[-3.6,.7,0]),w(4,[0,-1.02,-1.2],[0,-1.02,1.2],[0,.7,1.2],[0,.7,-1.2]);const n=I,s=t.uWave.value,l=t.uLiftC.value,o=l.x,u=v.z*s.w/s.x;let h=0,f=1;for(let k=0;k<50;k++){const M=(h+f)/2;1-M*M*(3-2*M)>n.cut?h=M:f=M}const c=1+n.growTo/n.growBy,T=(n.fade[0]+(n.fade[1]-n.fade[0])*f)*c,S=o*n.cell*s.x/v.w,C=l.y*S,L=Math.abs(t.uSwell.value.z),b=n.file+L+C+n.fan*2*(c-1),E=o*n.cell,Y=Math.max(0,l.y-v.w/s.x)*S,Z=Math.max(i.x,i.y-i.x),V=Math.min(i.x,i.y-i.x),Q=T+b,be=Math.ceil((2*Q+Z-V)/i.y)+1;let R=0;for(;i.x+i.y*R+n.file<x;)R++;t.uLiftS={value:new e.Vector3(Q+Z,x*x,R)};const ee=[],ke=[];for(let k=0;k<be;k++){const M=-Q-(Z-V)+i.y*k,X=-Q+i.y*(k+1),_=Math.max(0,Math.max(M,-X,0)-b);if(_>=T)continue;const H=Math.sqrt(T*T-_*_),P=Math.floor((2*H+E+Y+2*L)/u)+1;for(let $=-1;$<=1;$++)for(let fe=0;fe<P;fe++)for(let de=0;de<o;de++)ee.push(k,fe,$,de),ke.push(H+E+L)}const D=new e.InstancedBufferGeometry;D.setAttribute("position",new e.Float32BufferAttribute(p,3)),D.setAttribute("aP",new e.Float32BufferAttribute(y,1)),D.setIndex(r),D.setAttribute("aL",new e.InstancedBufferAttribute(new Float32Array(ee),4)),D.setAttribute("aQ",new e.InstancedBufferAttribute(new Float32Array(ke),1)),D.instanceCount=ee.length/4;const O=new e.Mesh(D,new e.ShaderMaterial({uniforms:t,vertexShader:Sa(a),fragmentShader:za(a),side:e.DoubleSide,alphaToCoverage:!0}));return O.frustumCulled=!1,O.name="figure-and-ground-lift",O}var Ma={id:"figure-and-ground",name:"Figure and Ground",category:"sky",media:["underwater","air"],weirdness:.95,async build(t){const a=t.rng,i=t.vary||{},v=j(i.density??1,.7,1.3),x=t.quality?.detail??1,p=!!i.rare,y=a.pick(["day","day","golden","rain","night"]),r=i.hour==="night"?"night":i.hour==="golden"?"golden":i.hour==="day"?"day":i.hour==="dawn"?"rain":y,m=a.sign(),d=a.range(13,24),z=a.chance(.4),w=a.range(0,50),n=new e.Scene,s=await ea(t,{edition:r==="night"?"night":r==="golden"?"golden":"day",portalDistance:430,fog:0,demo:!1,gooseCols:30,gooseBack:35});n.add(s.object);const l=s.uniforms,o=s.anchors,u=s.glsl;n.background=l.uInk.value.clone();const h=Math.round(190-75*(v-.7)/.6);s.setFrontSpacing(h),s.setRedOpen(!0),s.setRiseLimit(o.portalSeat.position.x-110),await t.yield();const f=o.crossingGoose.z,c=o.portalSeat.position,T=c.y,S=Zt([[-230,-46,f],[-180,-45,f+m*10],[-110,-36,f],[-34,-13.8,f],[o.crossingGoose.x,0,f],[26,7,f],[76,9,f+m*d*.42],[132,5.5,m*d],[184,8,m*d*.3],[240,11,-m*d*.62],[312,T+1.8,0],[c.x-60,T,0],[c.x,T,0]]);await t.yield();const C=S.length,L=new e.Vector3;let b=0;for(let g=100,B=0;g<C;g+=.25,B++)if((B&255)===255&&await t.yield(),S.posAtDist(g,L).y>=0){b=g;break}const E=b/C;await t.yield();const Y=42,Z=g=>(.55+.7*A(.07,E-.02,g))*(1-.14*A(.86,1,g)),V=64,Q=new Float32Array(V+1);for(let g=1;g<=V;g++)Q[g]=Q[g-1]+2/(j(Z((g-1)/V),.35,2.5)+j(Z(g/V),.35,2.5));const be=g=>{const B=j(g,0,1)*V,G=Math.min(V-1,Math.floor(B));return Y*(Q[G]+(Q[G+1]-Q[G])*(B-G))/Q[V]},R=new e.Vector2(o.frontDir.x,o.frontDir.z),ee=(b+40)/C;S.posAtDist(b+40,L);const ke=L.x*R.x+L.z*R.y-o.frontSpeed*be(ee),D=L.x*R.x+L.z*R.y,O={value:0},k={value:new e.Vector3(-230,-46,f)},M={value:new e.Vector3(1,0,0)},X={value:[]};for(let g=0,B=-200;g<le.n;g++){const G=le.x0+le.dx*g;let K=C+200;for(let F=0;F<26;F++){const ge=.5*(B+K);S.posAtDist(ge,L).x<G?B=ge:K=ge}S.posAtDist(B,L),X.value.push(new e.Vector2(L.y,L.z)),B=Math.max(-200,B-1)}await t.yield();const _={value:-1e9},H={value:R},P=g=>Object.assign({},l,g),$=new e.Mesh(new e.SphereGeometry(900,40,24),new e.ShaderMaterial({uniforms:{uInk:l.uInk,uPaper:l.uPaper,uTime:O,uRain:{value:r==="rain"?1:0},uStars:{value:r==="night"?1:0},uDuty:{value:r==="golden"?.56:.36},uSeed:{value:w},uUnder:{value:1},uCalm:{value:p?1:0}},vertexShader:oa,fragmentShader:sa,side:e.BackSide,depthWrite:!1,depthTest:!1}));$.renderOrder=-1,$.frustumCulled=!1,n.add($),await t.yield();const fe=1.4*m,de=3.2,U={x0:-262,pitch:40,curtains:8,reach:260,lo:-76,climb:66,step:.38,rise:.38},Ge=Math.max(8,Math.round(12*v*x)),Ke=Math.max(Ge,Math.round(13*v*x)),qe=[U.reach,U.pitch,U.lo,U.climb],gt=[520,420,74,38],je=[Ke,U.curtains,U.step,U.rise],bt=[Ge,5,.38,0],kt=a.fork("shoal"),te=P({uCamW:k,uTube:X,uBoxS:{value:new e.Vector4(...qe)},uLat:{value:new e.Vector4(...je)},uFld:{value:new e.Vector2(U.x0,f)},uRank:{value:new e.Vector4(Math.cos(fe),Math.sin(fe),1,de)},uShow:{value:1},uCeil:_,uDrop:{value:0},uFrontN:H,uSize:{value:1.6}}),St=ua(s.geo.fish,Ke,U.curtains,U.climb/6/1.6,kt,te,u);n.add(St),await t.yield();const Ee={uBox:{value:new e.Vector3(84,64,84)},uCamW:k,uTube:X,uTime:O,uRise:{value:1.1},uSide:{value:-1},uSpiral:{value:1},uTumble:{value:0},uClear:{value:6},uCol:l.uPaper},zt=vt(na(),Math.round(48*x),a.fork("shavings"),Ee,1);n.add(zt),await t.yield();const Lt={uBox:{value:new e.Vector3(130,70,130)},uCamW:k,uTube:X,uTime:O,uRise:{value:-1.5},uSide:{value:1},uSpiral:{value:0},uTumble:{value:1},uClear:{value:11},uCol:l.uInk},Bt=vt(ra(),Math.round(260*v*x),a.fork("chips"),Lt,.4);n.add(Bt),await t.yield();const Xe={uCamW:k,uTime:O,uShow:{value:0},uPX:{value:1900},uCeil:_,uFrontN:H,uCol:l.uInk},At=fa(Math.round(200*v*(.5+.5*x)),a.fork("skeins"),Xe,Math.atan2(R.y,R.x)*a.range(.2,.9),z);n.add(At),await t.yield();const Se=P({uRaft:{value:Array.from({length:re},()=>new e.Vector4)},uRaftB:{value:Array.from({length:re},()=>new e.Vector4)},uSeatR:{value:c.clone()},uRingR:{value:new e.Vector2(o.ringInner+.9,o.ringOuter-.9)},uShow:{value:0},uCamW:k,uAxis:M}),Tt=ma(s.geo.goose,s.geo.fish,Se,u,a.fork("rafts"),R);n.add(Tt);const Mt=95,Ct=55,He=16,Ft=.43,Pt=100,Rt=209,Je=[180,208],Ce={off:26,alt:30,roll:.5},Fe={off:36,alt:38,roll:.22},ze=b+60,Le=C-60,Qt=[{s0:Pt,sd:m,feeds:!1},{s0:Rt,sd:-m,feeds:!0}];await t.yield();const Ye=P({uCeil:_,uFrontN:H,uShow:{value:0}}),Ze=new e.CircleGeometry(2600,48);Ze.rotateX(-Math.PI/2);const Pe=new e.Mesh(Ze,new e.ShaderMaterial({uniforms:Ye,side:e.DoubleSide,vertexShader:`varying vec3 vP; uniform float uShow; void main() { vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); if (uShow < .5) ${W} }`,fragmentShader:va(u)}));Pe.position.y=120,Pe.frustumCulled=!1,n.add(Pe),await t.yield();const Be=P({uFlat:{value:0},uSwim:{value:1},uShow:{value:1}}),pe=new e.Mesh(xa(s.outline.fish),new e.ShaderMaterial({uniforms:Be,vertexShader:wa,fragmentShader:ya(u),side:e.DoubleSide}));pe.matrixAutoUpdate=!1,pe.frustumCulled=!1,n.add(pe),await t.yield();const me=P({uUnfold:{value:0},uBeat:{value:0},uShow:{value:0}}),ve=new e.Mesh(ga(),new e.ShaderMaterial({uniforms:me,vertexShader:ba,fragmentShader:ka(u),side:e.DoubleSide}));ve.matrixAutoUpdate=!1,ve.frustumCulled=!1,n.add(ve),await t.yield();const Re={uCol:l.uInk,uOp:{value:0},uPer:{value:24}},Qe=new e.Mesh(new e.PlaneGeometry(2,2),new e.ShaderMaterial({uniforms:Re,transparent:!1,depthTest:!1,depthWrite:!1,vertexShader:`uniform float uOp; void main() { gl_Position = vec4(position.xy, 0., 1.); if (uOp < .004) ${W} }`,fragmentShader:`uniform vec3 uCol; uniform float uOp, uPer;
        void main() { if (abs(fract(gl_FragCoord.y / max(uPer, 2.)) - .5) * 2. > uOp) discard; gl_FragColor = vec4(uCol, 1.); }`}));Qe.frustumCulled=!1,Qe.renderOrder=50,n.add(Qe);const et=ta(aa(t.seed+":lift")),tt=et.int(0,1);l.uLiftA.value.set(67.5,150,et.range(0,97),1),l.uLiftB.value.set(tt,1-tt,2,o.frontSpeed),l.uLiftR.value.set(c.x,c.y,c.z,520);const It=P({uLiftC:{value:new e.Vector4(6,40,6.5,3)}});await t.yield();const Vt=La(It,u,l.uLiftA.value,l.uLiftB.value,2550);n.add(Vt),await t.yield();const _t=new e.Vector3(-7,4.3,0),Ut=new e.Vector3(-6.5,5,0),at=30,he=new e.Vector3,Ie=new e.Quaternion,Wt=new e.Vector3,ae=new e.Vector3,Ve=new e.Vector3,ot=new e.Vector3,oe=new e.Vector3,se=new e.Vector3,xe=new e.Vector3,ie=new e.Quaternion,we=new e.Vector3,Ae=new e.Matrix4,st=new e.Vector3(1,1,1),it=new e.Vector3,Nt=new e.Quaternion().setFromRotationMatrix(new e.Matrix4().makeBasis(new e.Vector3(1,0,0),new e.Vector3(0,0,1),new e.Vector3(0,-1,0))),Dt=new e.Vector3(o.crossingFish.x,-.03,o.crossingFish.z),_e=new e.Vector3,Ue=new e.Vector3,nt=g=>g+60+165*A(-34,-230,g),ye=new e.Vector3,We=new e.Vector3,Ot=new e.Vector2;let rt=0;function $t(g,B,G,K){const F=j(K,0,1)*C;G.matrixWorld.decompose(he,Ie,Wt),ae.set(0,0,-1).applyQuaternion(Ie),S.posAtDist(F,Ve),S.posAtDist(F+at,ot);const ge=F<b-1.5;O.value=B,k.value.copy(he),M.value.subVectors(ot,Ve).normalize(),$.position.copy(he),$.material.uniforms.uUnder.value=he.y<0?1:0,s.setLockFront(ge?nt(Ve.x):1e6),s.setFrontPhase(ke+o.frontSpeed*be(K)-o.frontSpeed*B),s.setPortalProgress(A(.8,.985,K)),Re.uOp.value=A(b-4.2,b-2,F)*(1-A(b+1.5,b+8.5,F)),Re.uPer.value=Math.max(12,t.renderer.getDrawingBufferSize(Ot).y/18);const Ne=F<b+6,ce=F>b-6;if(Ee.uSide.value=-1,Xe.uShow.value=ce?1:0,p){const q=A(.58,.9,K);_.value=ce?D-700+3600*Math.pow(q,1.6):-1e9,Ye.uShow.value=ce?1:0,te.uDrop.value=ce&&!Ne?1:0,te.uShow.value=1;const J=ce&&!Ne;te.uBoxS.value.set(...J?gt:qe),te.uLat.value.set(...J?bt:je),te.uRank.value.z=J?-1:1}else te.uShow.value=Ne?1:0;Se.uShow.value=ce?1:0;for(let q=0;q<re;q++){const J=Qt[q],ft=J.s0+Ft*(F-b),ne=b+ft,ht=ne-F,Et=A(ze,ze+40,ne)*(1-A(Le-40,Le,ne)),Xt=A(ze,ze+He,ne)*(1-A(Le-He,Le,ne)),Ht=J.feeds?A(Mt,Ct,ht):0,Me=A(Je[0],Je[1],ft),De=1-Me,ct=J.sd*(Ce.off*De+Fe.off*Me),Jt=Ce.alt*De+Fe.alt*Me,Yt=Ce.roll*De+Fe.roll*Me;S.posAtDist(ne,ye),S.posAtDist(ne+6,We);const Oe=We.x-ye.x,$e=We.z-ye.z,ut=Math.max(Math.hypot(Oe,$e),1e-4);Se.uRaft.value[q].set(ye.x-$e/ut*ct,Jt+1.5*Math.sin(B*.31+q*2.1),ye.z+Oe/ut*ct,Math.atan2($e,Oe)),Se.uRaftB.value[q].set(J.sd*(Yt+.05*Math.sin(B*.23+q*1.7)),1.1*A(180,100,Math.abs(ht))*Et,Ht,Xt)}oe.copy(M.value).lerp(ae,.5).normalize(),xe.crossVectors(oe,se.set(0,1,0)).normalize(),se.crossVectors(xe,oe),Ae.makeBasis(oe,se,xe),ie.setFromRotationMatrix(Ae);const ue=A(b-58,b-10,F),lt=F>=b-10;we.copy(he).sub(it.copy(_t).applyQuaternion(ie));const Kt=ue*ue*(3-2*ue),qt=A(.55,1,ue);we.lerp(Dt,Kt),ie.slerp(Nt,qt),pe.matrix.compose(we,ie,st),pe.matrixWorldNeedsUpdate=!0,Be.uFlat.value=A(.6,1,ue),Be.uSwim.value=1-A(.5,.95,ue),Be.uShow.value=lt||t.through?0:1,s.setRedOpen(!lt);const jt=F>b-3;me.uShow.value=jt&&!t.through?1:0,me.uUnfold.value=A(b-2,b+26,F),rt+=g*6.2832*1.6*.75*A(.955,.995,K),me.uBeat.value=6.2832*1.6*B-rt,me.uUnfold.value*=1-.8*A(.965,1,K),se.set(0,1,0).applyQuaternion(Ie);const Te=M.value;oe.copy(ae).applyAxisAngle(se,.5*Math.atan2(ae.z*Te.x-ae.x*Te.z,ae.x*Te.x+ae.z*Te.z)),xe.crossVectors(oe,se).normalize(),Ae.makeBasis(oe,se,xe),ie.setFromRotationMatrix(Ae),we.copy(he).sub(it.copy(Ut).applyQuaternion(ie)),ve.matrix.compose(we,ie,st),ve.matrixWorldNeedsUpdate=!0,s.update(g,B,G)}const Gt="#"+l.uAccent.value.getHexString();return{scene:n,path:S,duration:Y,pace:Z,title:r==="night"?"Figure and Ground, night edition":r==="golden"?"Figure and Ground, kraft edition":r==="rain"?"Figure and Ground, rain edition":"Figure and Ground",ride:"none",style:"none",companion:"none",camera:{fov:62,near:.3,far:5e3,lookAhead:at,sway:.6,bank:.45},pois:[{at:(g,B)=>(S.pointAt(B,_e),_e.set(nt(_e.x)-25,0,f)),from:0,to:E-.05,weight:.4,fade:.25},{at:(g,B)=>(S.posAtDist(j(B,0,1)*C+50,Ue),Ue.y+=10,Ue),from:ee+.12,to:ee+.3,weight:.35,fade:.3},{at:c,from:.66,to:1,weight:.5,fade:.25}],portal:{shape:"circle",radius:o.ringInner,color:Gt,veil:"#"+l.uInk.value.getHexString(),glow:0,halo:!1,revealDistance:300},post:{flat:1,exposure:1,bloom:{strength:0},grade:{saturation:1,contrast:1,vignette:0,grain:0}},update:$t,dispose(){s.dispose?.()}}}};export{Ma as default};
