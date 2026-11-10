import*as t from"three";import{clamp as se,lerp as U,smoothstep as Ct}from"../kit/core.js";const wt=["#F1E6CC","#E2341D","#1F45B5","#1F8A66","#F5D83A","#F28CA6","#17141A"],Ht=1,Pt={canvas:0,vermilion:1,cobalt:2,viridian:3,lemon:4,rose:5,black:6};function _t(s){return new t.Color(s)}function It(s,a=wt){const e=wt.map((i,x)=>a&&a[x]||i),u=e.map(i=>_t(i)),p=i=>new t.Vector3(i.r,i.g,i.b),h=[];for(let i=0;i<8;i++)h.push(new t.Vector4(0,-9999,0,0));const n={uTime:{value:0},uFront:{value:-1e4},uTube:{value:u.map(p)},uOldA:{value:p(u[2])},uOldB:{value:p(u[3])},uNewA:{value:p(u[1])},uNewB:{value:p(u[1])},uShOld:{value:p(u[4])},uShNew:{value:p(u[3])},uVineCol:{value:p(u[2])},uSeed:{value:new t.Vector2(.13,.71)},uHalo:{value:h},uLate:{value:new t.Vector4(0,-330,-472,-150)},uLateB:{value:new t.Vector4(55,-20,280,200)}};return{palette:e,tubes:u,uniforms:n}}const me=`
  uniform vec3 uTube[7];
  uniform float uTime, uFront;
  uniform vec3 uOldA, uOldB, uNewA, uNewB, uShOld, uShNew;
  uniform vec2 uSeed;
  uniform vec4 uHalo[8];
  uniform vec4 uLate, uLateB;
  float h11(float n){ return fract(sin(n*127.1 + 1.7)*43758.5453); }
  float h21(vec2 p){ vec3 q = fract(vec3(p.xyx)*0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y)*q.z); }
  float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
    return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
  // metres the front must have travelled before it reaches world point w: distance along -Z plus slow noise
  float frontCoord(vec3 w){
    float base = -w.z + 0.8*max(w.y + 150., 0.)*smoothstep(-600., -638., w.z)
      + 46.*(vn(vec2(w.x, w.y + w.z*0.2)*0.011 + 3.7) - 0.5) + 16.*(vn(vec2(w.x + w.z*0.3, w.y)*0.045 + 9.1) - 0.5);
    if (uLate.x < 0.5) return base;
    // the wall behind the rack of canvases, below them: laid in from the far end toward the window as we pass
    float rag = vn(vec2(w.z, w.y)*0.021 + 5.3) - 0.5, rag2 = vn(vec2(w.z, w.y)*0.023 + 1.7) - 0.5;
    float zr = w.z - uLate.z - uLateB.x;                                   // metres beyond the window's edge, along the rack
    float mf = step(abs(w.x - uLate.y), 3.)*step(34. + 26.*rag2, zr)*step(zr, uLateB.w + 30.*rag)*step(w.y, 18. + 46.*rag2);
    float lf = 1500. + 10.*(15. + (uLateB.w - zr)/1.03) + 130.*(vn(vec2(w.z, w.y)*0.034 + 8.) - 0.5) + 30.*(vn(vec2(w.z, w.y)*0.11 + 2.) - 0.5);      // a slow lean only: the edge itself is stroke ends, not torn noise
    // the wall round the window: the last lick closes in on the frame and stops a hand's width short of it
    float r = length(max(vec2(abs(w.z - uLate.z) - uLateB.x, max(uLateB.y - w.y, w.y - uLateB.z)), 0.));
    float mw = step(abs(w.x - uLate.y), 3.)*step(r, 35. + 13.*rag2);      // an even border round the window, its edge made by whole strokes
    float lw = 1500. + 10.*(20. + 195.*(1. - r/54.)) + 80.*(vn(vec2(w.z, w.y)*0.04 + 4.) - 0.5) + 1.e5*step(r, 2.6);
    return mix(mix(base, lf, mf), lw, mw);
  }
  // an edge that is either a clean sliver two pixels wide or closed: d = signed distance (> 0 in the gap), off = how far the
  // gap is opened on purpose, aa = filter width. Gaps thinner than the filter are shut instead of half covered.
  float gapd(float d, float off, float aa){ float o = max(off, 0.); return d + min(off, 0.) + o*smoothstep(3.*aa, 5.*aa, o) - 1.6*aa; }

  struct Stroke { float d; float h; float g; float along; vec2 off; };   // g = 1 where the stroke is in the layer's second tube
  // one layer of paint: a brick lattice of capsule strokes 7 x 2.2 m laid along a slow flow field.
  // p in metres on the painted plane. off = vector from the stroke's centre to p, back in plane axes.
  Stroke strokes(vec2 p, float seed){
    float ang = 0.3 + seed*2.3, c = cos(ang), s = sin(ang);
    vec2 w = p + 11.*vec2(vn(p*0.012 + seed*7.1), vn(p*0.012 + seed*3.3 + 19.)) + 1.4*vec2(vn(p*0.06 + 5.), vn(p*0.06 + seed + 31.));
    vec2 q = vec2(c*w.x + s*w.y, -s*w.x + c*w.y);
    float rowf = floor(q.y/2.2), bestKey = -1., bh2 = 0., du = 1e3; vec2 bid = vec2(0.);
    Stroke best; best.d = 1e3; best.h = 0.; best.g = 0.; best.along = 0.; best.off = vec2(0.);
    // strokes are fatter than their rows, so they overlap their neighbours; where two cover, the later (higher hash) wins
    for (int j = -1; j <= 1; j++) {
      float row = rowf + float(j), ry = q.y - (row + 0.5)*2.2;
      float x = q.x + h11(row + seed*13.)*7., cell = floor(x/7.);
      for (int i = -1; i <= 1; i++) {
        vec2 id = vec2(cell + float(i), row);
        float h = h21(id + seed*171.), h2 = fract(h*7.31 + 0.37);
        float cx = (id.x + 0.5)*7. + (h - 0.5)*2.6, dx = x - cx, hl = 3.1 + h2*0.9, r = 1.1 + 0.22*h;
        float yy = ry + (h2 - 0.5)*0.4 - 0.13*sin(dx*0.5 + h*6.283);
        float d = length(vec2(max(abs(dx) - hl, 0.), yy)) - r;
        float key = d < 0. ? 2. + h : 1./(1. + d); du = min(du, d);
        if (key > bestKey) { bestKey = key; best.d = d; best.h = h; bh2 = h2; bid = id;
          best.along = clamp((dx + hl + r)/(2.*(hl + r)), 0., 1.); best.off = vec2(c*dx - s*ry, s*dx + c*ry); }
      }
    }
    best.g = step(0.74, 0.42*bh2 + 0.58*vn(bid*vec2(0.3, 0.1) + seed*9.));
    // the edge of the top stroke shows as a hairline of canvas only here and there (drifts), elsewhere the paint is closed
    best.d = mix(du, best.d, smoothstep(0.66, 0.8, vn(p*0.04 + seed*5. + 2.)));

    return best;
  }
  // how much of the new layer is refused round moving things (0 = paint, 1 = leave the old colour)
  float haloAt(vec3 w, float rag){
    float k = 0.;
    for (int i = 0; i < 8; i++) { vec4 hh = uHalo[i]; k = max(k, step(length(w - hh.xyz), hh.w*(0.8 + 0.45*rag))); }
    return k;
  }
  // THE BIG BRUSH. Far off (where a 2.2 m stroke would fall under three pixels) the wall is laid in with the same hand
  // 3.6 times as large: capsule strokes 25 x 8 m that overlap their neighbours, each with its own turn in the front
  // (a few come early, one in ten a beat late), wiped along its length with a round end. A fresh stroke is lean, so the
  // old colour shows between it and its neighbours; it fattens over the next second or two and the gaps close.
  // Binary but for one pixel of edge; where a stroke is under two pixels the filter (thin()) takes over, see the field below.
  float bigCover(vec2 p, vec3 w, vec3 fu, vec3 fv, float aa){
    Stroke b = strokes(p/3.6 + 31.7, uSeed.y);
    vec3 bw = w - (fu*b.off.x + fv*b.off.y)*3.6;
    float lead = uFront - 8. - frontCoord(bw) - (b.h - 0.5)*56. - 80.*step(0.9, fract(b.h*13.7));
    float rim = clamp(1. + b.d/1.2, 0., 1.);
    float e = lead - b.along*32. - 7.*rim*rim, ea = 1.6*aa;
    float fat = -0.1 + 0.75*smoothstep(15., 110. + 60.*b.h, lead);
    return smoothstep(-ea, ea, e)*(1. - smoothstep(-aa, aa, (b.d - fat)*3.6 - 1.6*aa));
  }
  // THE MEAN TONES a filtered stroke fades to (the designer, 7 Oct 11:20: where a stroke would be thinner than two pixels it fades to
  // the mean tone of its strokes and ground together). Shares of the SURFACE, measured on the lattice itself as strokes() lays it:
  // the second tube takes 0.09 of a layer's strokes (M_B), the slivers of bare canvas 0.02 of the old layer (M_CAN), the new layer's
  // shapes cover 0.997 of what the front has passed (M_NEW). BRUSH_W: the brush's width, the least a stroke of the lattice is across.
  const float BRUSH_W = 2.2, M_B = 0.09, M_CAN = 0.02, M_NEW = 0.997;
  // the stroke's own coordinate: metres across the strokes of the layer laid with this seed (strokes() turns the plane by this angle)
  float across(vec2 p, float seed){ float ang = 0.3 + seed*2.3; return dot(p, vec2(-sin(ang), cos(ang))); }
  // THE MEAN FOLLOWS THE RULE BY METRES: it is the mean of what that rule has left standing at this distance. A stroke keeps the second
  // tube while fract(h*5.3 + 0.21) is over far: measured on the lattice as laid (eight seeds), the share of second-tube surface still
  // standing is 1 - far to within 0.04 (0.89 0.81 0.68 0.59 0.50 0.39 0.32 0.24 0.14 at far 0.1 to 0.9), and nothing at far 1.
  float standing(float far){ return 1. - far; }
  // kb = the share of the second tube's strokes standing, kc = the share of the canvas slivers still open (0 wherever a stroke is thin:
  // gapd shuts a sliver once a pixel covers more than about 0.05 m, long before thin() is over 0). At kb 0, kc 0 it is a itself.
  vec3 meanOld(vec3 a, vec3 b, float kb, float kc){ return mix(uTube[0], mix(a, b, M_B*kb), 1. - M_CAN*kc); }
  // the share of the new layer's strokes laid at w: each is wiped over 11 m of the front and takes its turn within 16 m (t in fieldColor)
  float meanLaid(vec3 w){ return M_NEW*smoothstep(0., 27., uFront - frontCoord(w)); }
  // the same for the big brush: nine in ten of its strokes take their turn within 56 m and are wiped over 32 m, one in ten 80 m late (bigCover)
  float meanBig(vec3 w){ float d = uFront - 8. - frontCoord(w); return 0.9*smoothstep(-28., 60., d) + 0.1*smoothstep(52., 140., d); }
  // The painted field. p plane coords (m), w world position, fu/fv the plane's world axes, pix metres per pixel,
  // keep 0..1 extra refusal of the new layer (from a distance texture round static contours).
  // thin = the filter's three readings (CRISP_GLSL, thin()): the old layer's strokes, the new layer's, the big brush's.
  // Tubes are mixed by one rule only (thin(), here as th: a stroke under two pixels fades to the mean of its strokes and ground, the designer's
  // order of 7 Oct; the one-layer fields and the glass use the same rule); otherwise a far stroke of the second tube drops out whole (its own hash against far),
  // and each stroke of the new layer is either its own shape or, far off, part of a big-brush stroke.
  // FAR is a distance from the eye in metres, the same on every screen: the broad strokes begin 240 m from the eye and are complete
  // at 522 m (where, on a picture 720 lines high through this world's lens of 62 degrees, a pixel of a wall seen square on covers
  // 0.34 and 0.74 m of the brush's plane as it is measured here: 0.6 x the length of the plane's change over one pixel).
  vec3 fieldColor(vec2 p, vec3 w, vec3 fu, vec3 fv, float pix, float keep, vec3 th){
    float far = smoothstep(240., 522., length(w - cameraPosition)), aa = max(pix, 1e-3);
    vec3 col = uOldA, nc = uNewA; float cn = 0., pick = 1.;
    if (far < 0.999) {                                               // near and middle distance: the two lattices of 7 x 2.2 m strokes
      Stroke o = strokes(p, uSeed.x), n = strokes(p, uSeed.y);
      vec3 oc = (o.g > 0.5 && fract(o.h*5.3 + 0.21) > far) ? uOldB : uOldA;
      float co = max(1. - smoothstep(-aa, aa, gapd(o.d, 0.2*(vn(p*0.045 + 7.) - 0.3), aa)), step(0.5, far));   // slivers of bare canvas, in drifts
      col = mix(uTube[0], oc, co);
      col = mix(col, meanOld(uOldA, uOldB, standing(far), 0.), th.x);      // the filter: a thin old stroke and its ground, to the mean of what stands at this far (no canvas in it: the slivers are shut by gapd before a stroke is thin)
      vec3 wc = w - fu*n.off.x - fv*n.off.y;                         // the new stroke's centre in the world
      float t = (uFront - frontCoord(wc) - n.h*16.)/11.;             // wiped along its length over 0.25 s
      float wipe = smoothstep(-0.04, 0.04, t - n.along);
      float refuse = max(keep, haloAt(wc, n.h));
      cn = (1. - smoothstep(-aa, aa, gapd(n.d, -0.05, aa)))*wipe*(1. - refuse);
      nc = (n.g > 0.5 && fract(n.h*5.3 + 0.21) > far) ? uNewB : uNewA;
      pick = step(fract(n.h*3.7 + 0.53), far);                       // this stroke's own choice: itself, or part of a big-brush stroke
      // the filter: a thin new stroke and its ground (the old layer under it), to the share of them the front has laid there
      if (th.y > 0.) { cn = mix(cn, meanLaid(w)*(1. - max(keep, haloAt(w, 0.5))), th.y); nc = mix(nc, mix(uNewA, uNewB, M_B*standing(far)), th.y); }
    }
    if (far > 0.001) cn = mix(cn, bigCover(p, w, fu, fv, aa)*(1. - max(keep, haloAt(w, 0.5))), pick);
    if (th.z > 0.) cn = mix(cn, meanBig(w)*(1. - max(keep, haloAt(w, 0.5))), pick*th.z);      // the filter, on a stroke of the big brush
    return mix(col, nc, cn);
  }
  // 0 before the front, 1 after it has passed world point w (for shadow stripes and anything that changes tube)
  float frontState(vec3 w){ return smoothstep(-3., 3., uFront - frontCoord(w) - 8.); }
`,mt=`
  float crisp(float c){ return clamp((c - 0.5)/max(fwidth(c), 1e-4) + 0.5, 0., 1.); }
  // THE FILTER, written once (the designer, 7 Oct 11:20; as a texture's far levels are). w = a stroke's width in its own coordinate q
  // (metres across the stroke): its width on the screen is w over the change of q across one pixel. 0 where the stroke is two pixels
  // wide or more (it is drawn as it is), 1 where it is one pixel or less (it and its ground are their mean tone), even between.
  // It reads q and q's change across a pixel and nothing else, and switches nothing on or off.
  float thin(float w, float q){ return clamp(2. - w/max(length(vec2(dFdx(q), dFdy(q))), 1e-6), 0., 1.); }`;function gt(s,a={}){const e=a.single?a.single.map(u=>s.uniforms.uTube.value[u]):null;return new t.ShaderMaterial({side:a.side??t.DoubleSide,defines:{...e?{SINGLE:1}:{},...a.haloTex?{HALOTEX:1}:{},...a.vine?{VINE:1}:{}},uniforms:{...s.uniforms,uVine:{value:a.vine?a.vine.tex:null},uVineRect:{value:a.vine?a.vine.rect:new t.Vector4(0,0,1,1)},uVineLen:{value:a.vine?a.vine.len:1},uVineMain:{value:a.vine?a.vine.main:1},uVineMap:{value:a.vine?a.vine.map:new t.Vector4(0,0,1,0)},uVineGrow:a.vine?a.vine.grow:{value:0},uVineOff:{value:a.vine?a.vine.off??0:0},uVineHW:{value:a.vine?a.vine.hw??1.6:1.6},uSA:{value:e?e[0]:null},uSB:{value:e?e[1]:null},uHaloTex:{value:a.haloTex||null},uHaloRect:{value:a.haloRect||new t.Vector4(0,0,1,1)}},vertexShader:`
      attribute vec3 fu, fv; varying vec3 vW, vFU, vFV;
      void main(){ vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vFU = mat3(modelMatrix)*fu; vFV = mat3(modelMatrix)*fv;
        gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
      ${me}
      ${mt}
      ${xt}
      uniform sampler2D uVine; uniform vec4 uVineRect, uVineMap; uniform float uVineLen, uVineMain, uVineGrow, uVineOff, uVineHW; uniform vec3 uVineCol;
      uniform vec3 uSA, uSB; uniform sampler2D uHaloTex; uniform vec4 uHaloRect;
      varying vec3 vW, vFU, vFV;
      void main(){
        vec2 p = vec2(dot(vW, vFU), dot(vW, vFV));
        float pix = 0.6*length(fwidth(p));
        #ifdef SINGLE
          float far = smoothstep(212., 494., length(vW - cameraPosition)), aa = max(pix, 1e-3);      // metres from the eye (0.3 and 0.7 m to the pixel at 720 lines)
          Stroke o = strokes(p, 0.47);
          float co = max(1. - smoothstep(-aa, aa, gapd(o.d, 0.2*(vn(p*0.05 + 3.) - 0.3), aa)), step(0.5, far));
          vec3 col = mix(uTube[0], (o.g > 0.5 && fract(o.h*5.3 + 0.21) > far) ? uSB : uSA, co);
          col = mix(col, meanOld(uSA, uSB, standing(far), 0.), thin(BRUSH_W, across(p, 0.47)));      // the filter: a thin stroke and its ground, to the mean of what stands at this far
        #else
          float keep = 0.;
          #ifdef HALOTEX
            vec2 huv = (p - uHaloRect.xy)/max(uHaloRect.zw, vec2(1e-3));
            float hd = texture2D(uHaloTex, huv).r*16.;
            keep = step(hd, 1.6)*step(0., huv.x)*step(huv.x, 1.)*step(0., huv.y)*step(huv.y, 1.);
          #endif
          // the filter's readings for the field's three hands: each by its own strokes' coordinate (the big brush is the new layer's, 3.6 times as large)
          vec3 th = vec3(thin(BRUSH_W, across(p, uSeed.x)), thin(BRUSH_W, across(p, uSeed.y)), thin(BRUSH_W, across(p/3.6, uSeed.y)));
          vec3 col = fieldColor(p, vW, vFU, vFV, pix, keep, th);
          #ifdef VINE
            // the arabesque: drawn in its own tube over the new paint only, growing tile by tile from its root
            vec2 q = p - uVineMap.xy; q = vec2(uVineMap.z*q.x + uVineMap.w*q.y, -uVineMap.w*q.x + uVineMap.z*q.y);
            float tile = floor((q.x - uVineRect.x)/max(uVineRect.z, 1e-3));
            float hwv = uVineHW*(0.85 + 0.3*vn(q*0.05 + 2.));
            float vc = vineCover(uVine, uVineRect, uVineLen, q, max(hwv, 1.1*pix), uVineGrow - uVineOff - tile*uVineMain, max(pix, 1e-3)*1.2);
            vc = smoothstep(0.3, 0.7, vc)*step(0., tile)*step(frontCoord(vW), uFront - 22.)*(1. - keep);
            float gate = step(0., tile)*step(frontCoord(vW), uFront - 22.)*(1. - keep)*step(pix, 0.12);      // the sliver beside the stem: two pixels wide or not there
            float ve = vineCover(uVine, uVineRect, uVineLen, q + vec2(0.5, 0.42), max(hwv, 1.1*pix) + 0.42, uVineGrow - uVineOff - tile*uVineMain, max(pix, 1e-3)*1.2);
            col = mix(col, uTube[0], crisp(ve)*gate*step(0.3, vn(q*0.09 + 5.)));
            col = mix(col, uVineCol, vc);
          #endif
        #endif
        gl_FragColor = vec4(col, 1.);
      }`})}function Me(s,a,e,u,p,h=1,n=1){const i=[],x=[],l=[],g=[];for(let G=0;G<=n;G++)for(let F=0;F<=h;F++){const S=(F/h-.5)*u,f=(G/n-.5)*p;i.push(s.x+a.x*S+e.x*f,s.y+a.y*S+e.y*f,s.z+a.z*S+e.z*f),x.push(a.x,a.y,a.z),l.push(e.x,e.y,e.z)}for(let G=0;G<n;G++)for(let F=0;F<h;F++){const S=G*(h+1)+F,f=S+1,P=S+h+1,_=P+1;g.push(S,f,_,S,_,P)}const A=new t.BufferGeometry;return A.setAttribute("position",new t.Float32BufferAttribute(i,3)),A.setAttribute("fu",new t.Float32BufferAttribute(x,3)),A.setAttribute("fv",new t.Float32BufferAttribute(l,3)),A.setIndex(g),A}function qt(s,a={}){return new t.ShaderMaterial({side:a.side??t.DoubleSide,uniforms:{...s.uniforms},vertexShader:`
      attribute float tube; varying float vTube; varying vec3 vW;
      void main(){ vTube = tube; vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
      ${me}
      varying float vTube; varying vec3 vW;
      void main(){ int k = int(clamp(vTube + 0.5, 0., 6.));
        vec3 col = uTube[k];
        if (vTube > 6.5) col = mix(uShOld, uShNew, frontState(vW));
        gl_FragColor = vec4(col, 1.); }`})}function je(s){const a=new t.PlaneGeometry(2,2,6,1),e=new t.InstancedBufferGeometry;e.index=a.index,e.setAttribute("position",a.getAttribute("position"));const u=s.length,p=new Float32Array(u*3),h=new Float32Array(u*3),n=new Float32Array(u*3),i=new Float32Array(u*3),x=new Float32Array(u);return s.forEach((l,g)=>{p.set(l.p,g*3),h.set(l.a,g*3),n.set(l.b,g*3),i[g*3]=l.tube,x[g]=l.born??-1e6,i[g*3+1]=l.seed??g*.6180339%1,i[g*3+2]=l.bend??0}),e.setAttribute("iP",new t.InstancedBufferAttribute(p,3)),e.setAttribute("iA",new t.InstancedBufferAttribute(h,3)),e.setAttribute("iB",new t.InstancedBufferAttribute(n,3)),e.setAttribute("iT",new t.InstancedBufferAttribute(i,3)),e.setAttribute("iG",new t.InstancedBufferAttribute(x,1)),e.instanceCount=u,e.boundingSphere=new t.Sphere(new t.Vector3,1e5),e}const bt=`
  // uv in -1..1 (x along the stroke), ar = length/width, seed. Returns signed coverage (> 0 inside).
  float dabShape(vec2 uv, float ar, float seed){
    float x = uv.x*ar, hl = ar - 1.;
    float edge = 0.12*sin(uv.x*5. + seed*40.) + 0.07*sin(uv.x*13. + seed*91.);
    float d = length(vec2(max(abs(x) - hl, 0.), uv.y + edge*0.5)) - (0.86 + edge*0.5);
    float br = h11(floor((uv.y + 1.)*5.5) + seed*57.);                // bristles: the tail lifts off unevenly
    float lift = smoothstep(0.35, 1.0, uv.x) * (0.25 + 1.3*br);
    return -(d + lift*0.55);
  }`;function Ue(s,a={}){return s.uniforms.uResY||(s.uniforms.uResY={value:900}),new t.ShaderMaterial({side:t.DoubleSide,uniforms:{...s.uniforms,uRise:{value:new t.Vector2(a.rise?a.rise[0]:0,a.rise?a.rise[1]:1)},uBirth:a.birth||{value:1e6},uBirthSpan:{value:a.span??1},uNod:{value:a.nod??0},uMinPx:{value:a.minPx??0}},defines:{...a.rise?{RISE:1}:{},...a.front?{FRONTLAID:1}:{},...a.minPx?{MINPX:1}:{}},vertexShader:`
      uniform float uTime; uniform vec2 uRise;
      uniform float uBirth, uBirthSpan, uNod, uMinPx, uResY;
      attribute vec3 iP, iA, iB, iT; attribute float iG; varying vec2 vUv; varying vec3 vT; varying vec3 vW; varying float vAr; varying float vBorn;
      void main(){ vUv = position.xy; vT = iT;
        float ph = iT.y*6.283;
        float born = clamp((uBirth - iG)/max(uBirthSpan, 1e-3), 0., 1.); born = born*born*(3. - 2.*born);
        #ifdef MINPX
          // the style's thinnest mark: a dab whose stroke would be under about two pixels thick on screen (its half-width as
          // projected, foreshortening included) is not laid at all. Each against its own seed, so far dabs drop out whole,
          // one at a time, and come in whole as the eye nears: never a speck, never a fade.
          mat4 pvm = projectionMatrix*viewMatrix*modelMatrix;
          vec4 c0 = pvm*vec4(iP, 1.), c1 = pvm*vec4(iP + iA, 1.), c2 = pvm*vec4(iP + iB, 1.);
          if (c0.w > 0.5 && c1.w > 0.5 && c2.w > 0.5) {
            vec2 sc = 0.5*max(uResY, 1.)*vec2(projectionMatrix[1][1]/max(projectionMatrix[0][0], 1e-4), 1.);
            vec2 s0 = c0.xy/c0.w, sA = (c1.xy/c1.w - s0)*sc, sB = (c2.xy/c2.w - s0)*sc;
            float thick = abs(sA.x*sB.y - sA.y*sB.x)/max(length(sA), 1e-3);
            if (thick < uMinPx*(0.85 + 0.6*iT.y) || length(sA) < uMinPx*3.) born = 0.;
          }
        #endif
        vBorn = born;
        vec3 l = iP + (iA*position.x + iB*(position.y + iT.z*(1. - position.x*position.x)))*born
               + iB*(0.10*sin(uTime*0.9 + ph)) + iA*(0.04*sin(uTime*0.6 + ph*1.7));
        vAr = length(iA)/max(length(iB), 1e-3);
        #ifdef RISE
          l.y = uRise.x + mod(l.y - uRise.x + uTime*(1.3 + 1.8*iT.y), max(uRise.y, 1.));
          l.x += 0.7*sin(uTime*1.3 + ph + l.y*0.2); l.z += 0.5*sin(uTime*1.1 + ph*2.3 + l.y*0.17);
        #endif
        l.xz += uNod*max(l.y, 0.)*vec2(sin(uTime*0.7 + l.x*0.05 + l.y*0.04), cos(uTime*0.53 + l.z*0.05))*0.5;
        vec4 w = modelMatrix*vec4(l, 1.); vW = (modelMatrix*vec4(iP, 1.)).xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
      ${me}
      ${bt}
      varying vec2 vUv; varying vec3 vT; varying vec3 vW; varying float vAr; varying float vBorn;
      void main(){
        float sd = floor(vT.y*1024. + 0.5)/1024.;          // whole per dab: an interpolated seed stipples the bristled edge when the dab is large on screen
        if (vBorn < 0.01 || dabShape(vUv, max(vAr, 1.), sd) < 0.) discard;
        int k = int(clamp(vT.x + 0.5, 0., 6.)); vec3 col = uTube[k];
        #ifdef FRONTLAID
          float tw = (uFront - frontCoord(vW) - vT.y*16.)/11.;
          if (vT.x > 7.5 && vT.x < 8.5) { if (tw < vUv.x*0.5 + 0.5 || haloAt(vW, vT.y) > 0.5) discard; col = fract(vT.y*7.31) > 0.8 ? uNewB : uNewA; }
          if (vT.x > 8.5) { if (tw > vUv.x*0.5 + 0.5 && (fract(vT.y*13.7) < 0.72 || abs(vUv.y + 0.3*sin(vUv.x*3. + vT.y*20.)) > 0.2)) discard; col = fract(vT.y*7.31) > 0.8 ? uOldB : uOldA; }   // painted over
        #endif
        if (vT.x > 6.5 && vT.x < 7.5) col = mix(uShOld, uShNew, frontState(vW));
        gl_FragColor = vec4(col, 1.); }`})}function He(s){const a=[],e=[],u=[],p=[],h=[];let n=0;for(const x of s){const l=x.pts,g=l.length,A=!!x.closed,G=A?g+1:g;let F=0;const S=[0];for(let f=1;f<G;f++){const P=l[f%g],_=l[(f-1)%g];F+=Math.hypot(P[0]-_[0],P[1]-_[1],P[2]-_[2]),S.push(F)}for(let f=0;f<G;f++){const P=l[f%g],_=A?l[(f-1+g)%g]:l[Math.max(f-1,0)],$=A?l[(f+1)%g]:l[Math.min(f+1,g-1)];let re=$[0]-_[0],q=$[1]-_[1],te=$[2]-_[2];const oe=Math.hypot(re,q,te)||1;re/=oe,q/=oe,te/=oe;for(let E=-1;E<=1;E+=2)a.push(P[0],P[1],P[2]),e.push(re,q,te),u.push(E,S[f]/Math.max(F,.001),F,x.width??1),p.push(x.tube??6,x.seed??0,A?x.gap??.09:0,A?1:0);if(f<G-1){const E=n+f*2;h.push(E,E+1,E+3,E,E+3,E+2)}}n+=G*2}const i=new t.BufferGeometry;return i.setAttribute("position",new t.Float32BufferAttribute(a,3)),i.setAttribute("tan",new t.Float32BufferAttribute(e,3)),i.setAttribute("a0",new t.Float32BufferAttribute(u,4)),i.setAttribute("a1",new t.Float32BufferAttribute(p,4)),i.setIndex(h),i.boundingSphere=new t.Sphere(new t.Vector3,1e5),i}function Wt(s,a={}){return s.uniforms.uResY||(s.uniforms.uResY={value:900}),new t.ShaderMaterial({side:t.DoubleSide,uniforms:{...s.uniforms,uLift:{value:a.lift??.35}},vertexShader:`
      uniform float uTime, uResY, uLift;
      attribute vec3 tan; attribute vec4 a0, a1; varying vec4 vA; varying float vG;
      void main(){
        float arc = a0.y, len = a0.z, seed = a1.y, s = arc*len;
        // redrawn slowly: a 0.3 Hz wobble of the line itself
        vec3 wob = vec3(sin(s*0.11 + seed*17. + uTime*1.9), sin(s*0.083 + seed*5. - uTime*1.6), sin(s*0.097 + seed*29. + uTime*1.3));
        wob += 0.5*vec3(sin(s*0.31 + seed*3.), sin(s*0.27 + seed*11.), sin(s*0.23 + seed*7.));
        float wscale = min(a0.w, 1.2)*0.34;
        vec4 pv = viewMatrix*modelMatrix*vec4(position + wob*wscale, 1.);
        vec3 tv = mat3(viewMatrix)*mat3(modelMatrix)*tan;
        vec3 c = cross(tv, pv.xyz); c /= max(length(c), 1e-4);
        // the gap drifts round a closed shape; open lines taper at both ends
        float g = fract(arc + seed + uTime*(0.006 + 0.004*fract(seed*7.)));
        float taper = a1.w > 0.5 ? smoothstep(a1.z, a1.z + 0.07, g)*(1. - smoothstep(0.93, 1., g)) : smoothstep(0., 0.08, arc)*(1. - smoothstep(0.9, 1., arc));
        float swell = 0.78 + 0.3*sin(s*0.19 + seed*13. + uTime*0.7) + 0.16*sin(s*0.53 - uTime*1.1 + seed*31.);
        float px = -pv.z*2./(projectionMatrix[1][1]*max(uResY, 1.));       // metres per pixel at this depth
        float w = max(a0.w*swell*(0.3 + 0.7*taper), 1.7*px);
        pv.xyz += c*a0.x*w*0.5; pv.z += uLift;                             // lifted toward the eye, so it sits on its shape
        vA = a1; vG = g; gl_Position = projectionMatrix*pv; }`,fragmentShader:`
      ${me}
      varying vec4 vA; varying float vG;
      void main(){ if (vA.w > 0.5 && vG < vA.z) discard;
        gl_FragColor = vec4(uTube[int(clamp(vA.x + 0.5, 0., 6.))], 1.); }`})}function Dt(s,a={}){return s.uniforms.uResY||(s.uniforms.uResY={value:900}),new t.ShaderMaterial({side:t.BackSide,defines:a.halo?{HALO:1}:{},uniforms:{...s.uniforms,uHaloW:{value:a.width??1.9}},vertexShader:`
      ${me}
      uniform float uResY, uHaloW;
      attribute vec3 hull; varying float vTube;
      void main(){
        vec4 pv = modelViewMatrix*vec4(position, 1.);
        vec3 n = normalMatrix*normal; n /= max(length(n), 1e-4);
        float sd = hull.z*31., s = dot(position, vec3(0.21, 0.17, 0.19));
        float swell = 0.85 + 0.3*sin(s*0.9 + sd + uTime*0.7) + 0.16*sin(s*2.3 - uTime*1.1 + sd*3.);
        float soft = smoothstep(-0.75, -0.35, sin(s*0.33 + sd*2. + uTime*0.12));      // the place where the line nearly gives out
        float px = -pv.z*2./(projectionMatrix[1][1]*max(uResY, 1.));
        float w = max(hull.x*swell*(0.3 + 0.7*soft), 1.7*px);
        #ifdef HALO
          float hn = vn(position.xy*0.19 + position.zx*0.16 + sd), hk = smoothstep(0.36, 0.5, hn);      // hk 0: the new colour was cut right up to the line
          float rag = 0.55 + 0.9*vn(position.yz*0.83 + position.x*0.61 + sd*3.) + 0.2*sin(s*1.7 + uTime*0.5 + sd);
          w += hk*max(uHaloW*(0.25 + 2.3*smoothstep(0.42, 0.9, hn))*rag, 2.*px);
          pv.z -= 0.6;
        #endif
        pv.xyz += n*w;
        vTube = hull.y; gl_Position = projectionMatrix*pv; }`,fragmentShader:`
      uniform vec3 uTube[7]; uniform vec3 uOldA; varying float vTube;
      void main(){
        #ifdef HALO
          gl_FragColor = vec4(uOldA, 1.);
        #else
          gl_FragColor = vec4(uTube[int(clamp(vTube + 0.5, 0., 6.))], 1.);
        #endif
      }`})}async function Et(s,a={}){const e=a.rng||s.rng.fork("vine"),u=512,p=256,h=3,n=96,i=1.2,x=e.range(.85,1.1),l=e.range(0,6.28),g=[];let A=0,G=0,F=0;const S=z=>x*Math.sin(z/n*Math.PI*2+l)+.25*Math.sin(z/n*Math.PI*4+l*2),f=Math.round(h*n/i);for(let z=0;z<=f;z++){g.push([A,G,F,1]);const I=S(F);A+=Math.cos(I)*i,G+=Math.sin(I)*i,F+=i}const P=A,_=F,$=[];for(let z=0;z<h*2;z++){const I=Math.round((z+.5+e.range(-.08,.08))*n*.5/i),N=z%2?1:-1,Y=g[Math.min(I,f)];let le=Y[0],he=Y[1],j=S(Y[2])+N*.5,K=Y[2];const L=e.range(44,60),R=[];for(let Z=0;Z<L;Z+=i)R.push([le,he,K,1-.5*Z/L]),j+=N*i*(.012+.27*Math.pow(Z/L,2.2)),le+=Math.cos(j)*i,he+=Math.sin(j)*i,K+=i;$.push(R)}const re=$.map(z=>{const I=z[z.length-1];return[I[0],I[1],I[2]]});let q=1e9,te=-1e9;for(const z of[g,...$])for(const I of z)q=Math.min(q,I[1]),te=Math.max(te,I[1]);q-=10,te+=10;const oe=te-q,E=new Uint8Array(u*p*2).fill(255),ze=new Float32Array(u*p).fill(8),xe=u/P,Ae=p/oe,ie=8;let Oe=0;for(const z of[g,...$])for(let I=0;I<z.length-1;I++){const N=z[I],Y=z[I+1],le=(N[0]+Y[0])/2,he=(N[1]+Y[1])/2,j=Y[0]-N[0],K=Y[1]-N[1],L=j*j+K*K||1,R=Math.floor((le-ie)*xe),Z=Math.ceil((le+ie)*xe),Fe=Math.max(0,Math.floor((he-q-ie)*Ae)),W=Math.min(p-1,Math.ceil((he-q+ie)*Ae));for(let fe=Fe;fe<=W;fe++)for(let de=R;de<=Z;de++){const D=(de+.5)/xe,Se=(fe+.5)/Ae+q,Be=se(((D-N[0])*j+(Se-N[1])*K)/L,0,1),ve=Math.hypot(D-N[0]-j*Be,Se-N[1]-K*Be)+(1-N[3])*1.2,ne=fe*u+(de%u+u)%u;ve<ze[ne]&&(ze[ne]=ve,E[ne*2]=Math.round(ve/8*255),E[ne*2+1]=Math.round(se(N[2]/(_+62),0,1)*255))}++Oe%30===0&&await s.yield()}const ae=new t.DataTexture(E,u,p,t.RGFormat,t.UnsignedByteType);return ae.wrapS=t.RepeatWrapping,ae.wrapT=t.ClampToEdgeWrapping,ae.minFilter=ae.magFilter=t.LinearFilter,ae.needsUpdate=!0,{texture:ae,rect:new t.Vector4(0,q,P,oe),length:_+62,main:_,period:P,tips:re}}const xt=`
  // coverage of the arabesque at plane point p: stem half-width hw, grown as far as arc length grow
  float vineCover(sampler2D t, vec4 rect, float len, vec2 p, float hw, float grow, float aa){
    vec2 uv = (p - rect.xy)/max(rect.zw, vec2(1e-3)); vec2 rg = texture2D(t, uv).rg;
    float inY = step(0., uv.y)*step(uv.y, 1.);
    return (1. - smoothstep(-aa, aa, rg.r*8. - hw))*step(rg.g*len, grow)*inY;
  }`;function ke(s,a,e,u){const p=s.pos.length/3;for(let h=0;h<a.length;h++)s.pos.push(a[h]);for(let h=0;h<a.length/3;h++)s.tube.push(u);for(let h=0;h<e.length;h++)s.idx.push(e[h]+p)}function yt(s){const a=new t.BufferGeometry;return a.setAttribute("position",new t.Float32BufferAttribute(s.pos,3)),a.setAttribute("tube",new t.Float32BufferAttribute(s.tube,1)),a.setIndex(s.idx),a.computeBoundingSphere(),a}function Mt(s,a,e,u,p=()=>1,h=0){const n=[],i=[],x=a.length;for(let l=0;l<x;l++)for(let g=0;g<=e;g++){const A=g/e*Math.PI*2,G=a[l][0]*p(A,l);n.push(Math.sin(A)*G,a[l][1]+h,Math.cos(A)*G)}for(let l=0;l<x-1;l++)for(let g=0;g<e;g++){const A=l*(e+1)+g,G=A+1,F=A+e+1,S=F+1;i.push(A,F,G,G,F,S)}ke(s,n,i,u)}function _e(s,a,e,u){let p=0,h=0;for(const l of a)p+=l[0],h+=l[1];p/=a.length,h/=a.length;const n=[p,e,h],i=[],x=a.length;for(const l of a)n.push(l[0],e,l[1]);for(let l=0;l<x;l++)i.push(0,1+l,1+(l+1)%x);ke(s,n,i,u)}function Nt(s,a,e,u,p,h,n){const i=[],x=[],g=Math.cos(e),A=Math.sin(e),G=n.range(.38,.5),F=[];for(let f=0;f<=13;f++)F.push(n.range(.9,1.1));const S=(f,P)=>{const _=(f-.5)*u,$=h*u*Math.sin(f*Math.PI)*.5+.06*u*Math.sin(f*Math.PI*2),re=Math.pow(Math.max(0,Math.sin(Math.PI*Math.pow(f,G/.5*.8))),.85)*p*.5*F[Math.round(f*13)],q=$+P*re;return[s+g*_-A*q,a+A*_+g*q]};for(let f=0;f<=13;f++)i.push(S(f/13,1));for(let f=12;f>=1;f--)i.push(S(f/13,-1));for(let f=1;f<13;f++)x.push(S(.04+.8*(f/13),0));return{out:i,rib:x}}const H=30,ge=68,ee=65,jt=75,ue=-142,De=190,X=(s,a)=>[Math.sin(s)*a,Math.cos(s)*a];function be(s,a,e,u,p){const h=[];for(let n=0;n<e;n++){const i=n/e*Math.PI*2,x=s*(1+u*Math.sin(i*3+p*9)+u*.6*Math.sin(i*5+p*23));h.push([Math.sin(i)*x,a,Math.cos(i)*x])}return h}function Ge(s,a,e,u,p,h,n){const i=(a+e)/2,x=Math.abs(e-a)/2,l=X(i,s*Math.cos(x)),g=X(i+Math.PI/2,s*Math.sin(x)),A=X(i,p);return{p:[l[0],u,l[1]],a:[g[0],0,g[1]],b:[A[0],0,A[1]],tube:h,seed:n,bend:s*(1-Math.cos(x))/p}}async function $t(s,a={}){const e=s.rng.fork("goldfish-tank"),u=se(a.detail??s.quality?.detail??1,.6,1),p=a.style||It(s,a.palette),h=p.uniforms,n=Pt,i=new t.Group;i.name="goldfish-tank";const x=se(Math.round(a.fish??e.pick([4,4,4,3,5])),3,5),l=!!a.carp,g=l?1:x,A=l?2.7:1,G=e.pick([n.lemon,n.lemon,n.cobalt,n.canvas]),F={pos:[],tube:[],idx:[]},S=[],f=[],P=e.range(0,6.28),_=(o,r)=>1+.006*Math.sin(o*3+P)+.004*Math.sin(o*7+r);Mt(F,[[75.2,0],[76.1,-1.3],[75.3,-3.5],[72.6,-5.2],[72.1,-8.6],[68.5,-10.2],[22,-13.5],[13.5,-17]],56,n.rose,_),Mt(F,[[13.5,-17],[10.5,-23],[14.5,-31],[17.5,-41],[12.5,-53],[8.8,-61],[8.2,-90],[10.4,-98],[15.6,-104],[11.5,-112],[9.4,-120],[14,-128],[29,-135.5],[39.5,-139.5],[41,ue]],28,n.rose,(o,r)=>1+.02*Math.sin(o*2+P+r*.4)),S.push({pts:be(75.9,.2,80,.004,P),closed:!0,width:1.35,tube:n.black,seed:e(),gap:.07}),S.push({pts:be(72.4,-8.6,64,.005,P+1),closed:!0,width:.9,tube:n.black,seed:e(),gap:.12});for(const[o,r,c]of[[17.9,-41,.9],[15.9,-104,.8],[40.4,-139.5,1.1]])S.push({pts:be(o,r,36,.02,e()),closed:!0,width:c,tube:n.black,seed:e(),gap:.1});f.push(Ge(49,.75,2.35,ue+.4,5.2,7,e())),await s.yield();{const o=[0,0,0],r=[],c=72;for(let b=0;b<c;b++){const v=X(b/c*Math.PI*2,75.3*_(b/c*Math.PI*2,0));o.push(v[0],0,v[1]),r.push(0,1+b,1+(b+1)%c)}const m=new t.BufferGeometry;m.setAttribute("position",new t.Float32BufferAttribute(o,3));const O=[],V=[];for(let b=0;b<=c;b++)O.push(1,0,0),V.push(0,0,-1);m.setAttribute("fu",new t.Float32BufferAttribute(O,3)),m.setAttribute("fv",new t.Float32BufferAttribute(V,3)),m.setIndex(r);const w=new t.Mesh(m,gt(p,{single:[n.rose,n.rose]}));w.name="table-top",i.add(w)}const $=e.chance(.5)?1:-1;for(let o=0;o<12;o++){const r=o/12*Math.PI*2+e.range(-.05,.05),c=53+e.range(-2.5,2.5),m=X(r,c),O=-r+(o%2?.42:-.3)*$+e.range(-.12,.12),V=e.range(27,32),w=e.range(10,12.5),b=Nt(m[0],m[1],O,V,w,e.range(-.12,.12),e),v=[e.range(-.6,.6),e.range(-.6,.6)];_e(F,b.out.map(d=>[m[0]+(d[0]-m[0])*1.07+v[0],m[1]+(d[1]-m[1])*1.07+v[1]]),.12,n.canvas),_e(F,b.out,.24,n.viridian),S.push({pts:b.out.map(d=>[d[0],.5,d[1]]),closed:!0,width:1.05,tube:n.black,seed:e(),gap:.1}),S.push({pts:b.rib.map(d=>[d[0],.5,d[1]]),closed:!1,width:.7,tube:n.black,seed:e()});for(const d of[3,6,9])for(const B of[0,1]){const C=.04+.8*(d/13),y=Math.min(12,Math.round((C+.13)*13)),T=b.out[B?26-y:y],M=b.rib[d-1],k=[U(M[0],T[0],.36)+e.range(-.3,.3),U(M[1],T[1],.36)+e.range(-.3,.3)],J=[U(M[0],T[0],.7),U(M[1],T[1],.7)];S.push({pts:[[M[0],.5,M[1]],[U(M[0],k[0],.5),.5,U(M[1],k[1],.5)],[k[0],.5,k[1]],[U(k[0],J[0],.5),.5,U(k[1],J[1],.5)],[J[0],.5,J[1]]],closed:!1,width:.5,tube:n.black,seed:e()})}if(o%3===2&&await s.yield(),G!==n.canvas||o%2===0){const d=X(r+Math.PI/12,c+e.range(7,11)),B=e.range(2.1,2.9),C=[];for(let y=0;y<12;y++){const T=X(y/12*Math.PI*2,B*e.range(.9,1.1));C.push([d[0]+T[0],d[1]+T[1]])}_e(F,C,.3,G),S.push({pts:C.map(y=>[y[0],.55,y[1]]),closed:!0,width:.75,tube:n.black,seed:e(),gap:.14})}}await s.yield(),_e(F,be(29.5,0,48,.006,2).map(o=>[o[0],o[2]]),.3,n.canvas);for(let o=0;o<3;o++)f.push(Ge(35.2,.72+o*.56,1.36+o*.56,.36+o*.02,3.4,7,e()));const re=Math.round(7*u),q=Math.round(11*u),te=Math.round(6*u);for(let o=0;o<re;o++){const r=e.range(0,6.28),c=e.range(6,24);f.push(Ge(c,r,r+e.range(4,9)/c,.42,e.range(.7,1.1),n.cobalt,e()))}for(let o=0;o<q;o++){const r=o/q*Math.PI*2+e.range(-.2,.2),c=X(r,28.5),m=X(r+Math.PI/2,1),O=e.range(.9,1.45)*(e.chance(.5)?1:-1),V=e.range(3.5,6),w=e.range(.8,1.15),b=Math.cos(O),v=Math.sin(O);f.push({p:[c[0],e.range(9,57),c[1]],a:[m[0]*b*V,v*V,m[1]*b*V],b:[-m[0]*v*w,b*w,-m[1]*v*w],tube:n.cobalt,seed:e()})}const oe=[];for(let o=0;o<te;o++){const r=e.range(0,6.28),c=e.range(7,26);oe.push(Ge(c,r,r+e.range(5,11)/c,ee+.05,e.range(.45,.75),n.cobalt,e()))}{const o=e.fork("ripples"),r=Math.round(12*u);for(let c=0;c<r;c++){const m=c/r*6.283+o.range(-.2,.2),O=5+21*Math.sqrt(c*.618%1);oe.push(Ge(O,m,m+o.range(3,8)/O,ee+.05,o.range(.35,.6),c%5===4?n.viridian:n.cobalt,o()))}}S.push({pts:be(H+.3,ge,96,.004,e()),closed:!0,width:1.45,tube:n.cobalt,seed:e(),gap:.07}),S.push({pts:be(H+.35,.6,96,.004,e()),closed:!0,width:1.3,tube:n.cobalt,seed:e(),gap:.11}),S.push({pts:be(H-.5,ee,72,.006,e()),closed:!0,width:.7,tube:n.cobalt,seed:e(),gap:.16}),await s.yield();const E=Math.round(34*u),ze=e.pick([n.lemon,n.lemon,n.cobalt,n.viridian]);for(let o=0;o<E;o++){const r=o/E*Math.PI*2+e.range(-.02,.02),c=X(r,72.9),m=X(r+Math.PI/2,1),O=e.range(-.25,.25);f.push({p:[c[0],-6.9,c[1]],a:[m[0]*2.3,O,m[1]*2.3],b:[0,1.05,0],tube:ze,seed:e()})}await s.yield();const xe=[],Ae=Math.round(22*u);for(let o=0;o<Ae;o++){const r=X(e.range(0,6.28),e.range(4,23)),c=e.range(3,ee-3),m=e.range(.4,.8),O=e.range(0,3.14),V=e();for(const w of[0,Math.PI/2])xe.push({p:[r[0],c,r[1]],a:[0,m,0],b:[Math.cos(O+w)*m,0,Math.sin(O+w)*m],tube:n.cobalt,seed:V})}const ie=new t.Mesh(je(xe),Ue(p,{rise:[3,ee-5]}));ie.name="bubbles",ie.frustumCulled=!1,i.add(ie),await s.yield();const Oe=new t.Mesh(yt(F),qt(p));Oe.name="flat-forms",i.add(Oe),await s.yield();const ae=new t.Mesh(je(f),Ue(p));ae.name="dabs",ae.frustumCulled=!1,i.add(ae);const z=new t.Mesh(je(oe),Ue(p));z.material.depthWrite=!1,z.name="ripples",z.frustumCulled=!1,z.renderOrder=5.5,i.add(z),await s.yield();const I=Wt(p),N=new t.Mesh(He(S),I);N.name="contours",N.frustumCulled=!1,i.add(N),await s.yield();const Y=[];for(let o=0;o<=16;o++)Y.push([0,.6+(ge-.6)*(o/16),0]);const le=He([{pts:Y,closed:!1,width:1.3,tube:n.cobalt,seed:e()}]),he=[0,1].map(o=>{const r=new t.Mesh(o?le.clone():le,I);return r.frustumCulled=!1,r.name="upright",i.add(r),r});await s.yield();const j=a.vine||await Et(s,{rng:e.fork("vine")}),K=[0,5,3,2,4,1,2],L={old:[n.cobalt,n.viridian],next:[n.vermilion,n.vermilion],...a.layers||{}},R=o=>h.uTube.value[o],Z=[];for(let o=0;o<5;o++)Z.push(new t.Vector4(0,17,-999,0));const Fe=[];for(let o=0;o<5;o++)Fe.push(new t.Vector4(1,0,0,0));const W={uOrigin:{value:new t.Vector3},uFish:{value:Z},uFishB:{value:Fe},uVine:{value:j.texture},uVineRect:{value:j.rect},uVineLen:{value:j.length},uGrow:{value:0},uCatAz:{value:a.catAzimuth??Math.PI},uCat:{value:a.cat===!1?0:1},uCatS:{value:.3},uWinS:{value:-.9},uWinA:{value:R(2).clone()},uWinB:{value:R(3).clone()},uGOldA:{value:R(3).clone()},uGOldB:{value:R(2).clone()},uGNewA:{value:R(5).clone()},uGNewB:{value:R(5).clone()}};await s.yield();const fe=new t.CylinderGeometry(H-.3,H-.3,ge-.4,72,1,!0);fe.translate(0,(ge+.4)/2,0);const de=new t.Mesh(fe,new t.ShaderMaterial({side:t.BackSide,uniforms:{...h,...W},vertexShader:`
      varying vec3 vL;
      void main(){ vL = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }`,fragmentShader:`
      ${me}
      ${mt}
      ${xt}
      uniform vec3 uOrigin, uGOldA, uGOldB, uGNewA, uGNewB; uniform vec4 uFish[5];
      const float FK = ${A.toFixed(1)};
      uniform sampler2D uVine; uniform vec4 uVineRect; uniform float uVineLen, uGrow, uCatAz, uCat, uCatS, uWinS;
      varying vec3 vL;
      float ell(vec2 p, vec2 c, vec2 r){ return (length((p - c)/r) - 1.)*min(r.x, r.y); }
      // THE GLASS'S OWN HAND. The wall of the tank is bare canvas for the most part, before the front and after it: the room is
      // drawn on it again as loose strokes of the room's own brush (the same capsule, 2.2 to 2.6 m wide and 8.4 to 10.6 m long, on
      // the slant and the slow flow of the room's old layer), but laid APART: the rows stand 3.8 m from one another and the strokes
      // 12.5 m from one to the next along a row, so every stroke has canvas all round it (1.4 m between two rows as a rule and
      // never under 0.5 m as the lattice is laid out, 0.6 m and more end to end) and no patch of one colour is wider than one
      // stroke; and only some of them are laid (G_OLD of them in the old layer's swapped tubes, G_NEW once the front has passed:
      // the front lays its colour over the old strokes, along their length, and lays more on the bare canvas between them).
      // A stroke is its own whole shape or it is not there.
      const float G_ROW = 3.8, G_CELL = 12.5, G_OLD = 0.25, G_NEW = 0.38;
      // for the filter's mean tone: one stroke's share of its cell (a capsule of mean half-length 3.55 and mean radius 1.21 m: 21.8 m2 of
      // the cell's G_ROW x G_CELL = 47.5 m2; 0.459 measured on the lattice as laid) and the second tube's share of the strokes (measured)
      const float G_AREA = 0.459, G_B = 0.10;
      struct GStroke { float d; float h; float g; float along; };
      GStroke gstrokes(vec2 p, float seed){
        float ang = 0.3 + seed*2.3, c = cos(ang), s = sin(ang);
        vec2 w = p + 11.*vec2(vn(p*0.012 + seed*7.1), vn(p*0.012 + seed*3.3 + 19.)) + 1.4*vec2(vn(p*0.06 + 5.), vn(p*0.06 + seed + 31.));
        vec2 q = vec2(c*w.x + s*w.y, -s*w.x + c*w.y);
        float rowf = floor(q.y/G_ROW);
        GStroke best; best.d = 1e3; best.h = 0.; best.g = 0.; best.along = 0.;
        for (int j = -1; j <= 1; j++) {
          float row = rowf + float(j), ry = q.y - (row + 0.5)*G_ROW;
          float x = q.x + h11(row + seed*13.)*G_CELL, cell = floor(x/G_CELL);
          for (int i = -1; i <= 1; i++) {
            vec2 id = vec2(cell + float(i), row);
            float h = h21(id + seed*171.), h2 = fract(h*7.31 + 0.37);
            float cx = (id.x + 0.5)*G_CELL + (h - 0.5)*1.2, dx = x - cx, hl = 3.1 + h2*0.9, r = 1.1 + 0.22*h;
            float yy = ry + (h2 - 0.5)*0.4 - 0.13*sin(dx*0.5 + h*6.283);
            float d = length(vec2(max(abs(dx) - hl, 0.), yy)) - r;
            if (d < best.d) { best.d = d; best.h = h; best.along = clamp((dx + hl + r)/(2.*(hl + r)), 0., 1.);
              best.g = step(0.74, 0.42*h2 + 0.58*vn(id*vec2(0.3, 0.1) + seed*9.)); }
          }
        }
        return best;
      }
      void main(){
        vec3 cam = cameraPosition - uOrigin;
        vec2 f = -cam.xz; float fl = length(f); f = fl < 1e-3 ? vec2(0., -1.) : f/fl;
        float s = dot(vL.xz, vec2(-f.y, f.x))/${H.toFixed(1)};                   // -1..1 across the glass as seen
        float az = mod(atan(f.x, f.y) - 2.06, 6.2832);                           // which way we look into the room
        float Uc = ${De.toFixed(1)}*(az - 0.47*s), V = vL.y;                  // mirrored and squeezed to a third
        vec2 p = vec2(Uc/3., V + 80.);                                             // the brush is the same brush: only the drawing is squeezed
        vec3 wv = vec3(uOrigin.x + 60.*s, uOrigin.y + V, uOrigin.z - 30. + 25.*s);
        // (far, between 212 and 494 m from the eye, where on a picture 720 lines high through this world's lens a pixel covers 0.3 and
        // 0.7 m of the drawing, the same on every screen: what is far away is the fish's windows closed and in one tube and the front as
        // one edge. The lattice's strokes stand at every distance; where they are thin on the screen the filter gives their mean tone.)
        float pix = 0.6*length(fwidth(p)), far = smoothstep(212., 494., length(vL - cam)), aa = max(pix, 1e-3);
        Stroke o = strokes(p, uSeed.x), n = strokes(p, uSeed.y);
        // the windows of old colour that travel with the fish: the new paint is cut in round each of them
        vec3 rd = vL - cam; rd /= max(length(rd), 1e-4);
        float m = 1e3;
        for (int i = 0; i < 5; i++) { vec4 F = uFish[i];
          // four points from the tail tip to the nose (the fish runs from 10.8 m behind its centre to 8 m ahead), widest at the
          // forked tail, so the whole fish lies inside its window with old colour all round it
          for (int j = 0; j < 4; j++) { float th = F.x + (-10.4 + 5.4*float(j))*FK/max(F.y, 1.);
            vec3 pt = vec3(sin(th)*F.y, F.z, cos(th)*F.y);
            m = min(m, length(cross(pt - cam, rd)) + (1. - F.w)*1e3 - (j == 0 ? 2.3 : (j == 3 ? 0.4 : 1.0))*FK); } }
        m /= FK;
        float t = (uFront - frontCoord(wv) - n.h*16.)/11.;
        float painted = smoothstep(-0.04, 0.04, t - n.along)*(1. - smoothstep(-aa, aa, gapd(n.d, 0.03, aa)));
        painted = crisp(mix(painted, step(frontCoord(wv), uFront - 8.), far));
        // each fish keeps its own window: 4 to 6 m of old colour round the stroke, so rose shows between two fish
        float halo = step(m, 4.1*(0.8 + 0.45*n.h))*step(0.5, painted);
        float oB = o.g*step(far, fract(o.h*5.3 + 0.21));
        float co = crisp(mix((1. - smoothstep(-aa, aa, gapd(o.d, mix(0.22*(vn(p*0.06 + 4.) - 0.12), 0.05, halo), aa))), 1., far));     // water: the canvas shows more
        // outside the fish's windows: bare canvas and the glass's own loose strokes; inside a window, the old layer as it was
        // (closed, in the room's own old tubes), so the whole fish has old colour all round it
        GStroke b = gstrokes(p, uSeed.x);
        float bk = fract(b.h*91.7 + 0.31), tb = (uFront - frontCoord(wv) - b.h*16.)/11.;
        float bn = crisp(smoothstep(-0.04, 0.04, tb - b.along))*step(bk, G_NEW);          // the front has reached this stroke (wiped on along its length)
        float bc = (1. - smoothstep(-aa, aa, b.d))*max(step(bk, G_OLD), bn);
        vec3 col = mix(uTube[0], mix(mix(uGOldA, uGOldB, b.g), mix(uGNewA, uGNewB, b.g), bn), crisp(bc));
        // the filter: a thin stroke of the lattice and the canvas round it, to their mean. Of the surface, G_AREA*G_OLD is old strokes before
        // the front and G_AREA*G_NEW new strokes after it; lf = the share of the strokes there that the front has reached (their turn
        // within 16 m, wiped over 11 m, as tb above). The lattice lies on the old layer's slant, so its strokes' coordinate is that layer's.
        float tl = thin(BRUSH_W, across(p, uSeed.x));
        if (tl > 0.) { float lf = smoothstep(0., 27., uFront - frontCoord(wv)), so = G_AREA*G_OLD*(1. - lf), sn = G_AREA*G_NEW*lf;
          col = mix(col, uTube[0]*(1. - so - sn) + mix(uGOldA, uGOldB, G_B)*so + mix(uGNewA, uGNewB, G_B)*sn, tl); }
        col = mix(col, mix(uTube[0], mix(uOldA, uOldB, oB), co), halo);
        col = mix(col, meanOld(uOldA, uOldB, standing(far), 0.), halo*tl);      // and the old layer's strokes inside a fish's window, by the same filter (oB and co above thin and shut them by this far)
        // the arabesque in the old tube (so it shows only on the new field), swapped like everything else
        float vc = crisp(vineCover(uVine, uVineRect, uVineLen, vec2(Uc*0.9, (V - 34.)*1.5), 1.7, uGrow, aa*1.5));
        col = mix(col, uGOldA, vc*(1. - halo)*painted);
        // the window: a lemon band over a lawn in the wrong tube, blossom left as bare canvas
        vec2 wq = vec2(${(De*.47).toFixed(2)}*(uWinS - s)*1.35, (V - 45.)*1.35);
        float wb = max(abs(wq.x) - 21. - 1.2*sin(V*0.3), abs(wq.y) - 24. - 1.0*sin(Uc*0.21));
        vec3 wcol = wq.y > 9. + 1.4*sin(Uc*0.33) ? uTube[4] : uTube[2];
        float bl = min(ell(wq, vec2(-8., 2.), vec2(8., 5.)), min(ell(wq, vec2(9., -3.), vec2(7., 4.5)), ell(wq, vec2(1., -13.), vec2(9., 4.))));
        wcol = mix(wcol, uTube[0], (1. - smoothstep(-aa, aa, bl)));
        col = mix(col, wcol, (1. - smoothstep(-aa, aa, wb)));
        col = mix(col, uTube[2], (1. - smoothstep(-aa, aa, abs(wb - 1.6) - 0.7))*step(0.12, fract(Uc*0.011 + V*0.007)));
        // the cat, black drawn cobalt: one flat shape, two lemon eye dabs, breathing
        vec2 cq = vec2(${(De*.47).toFixed(2)}*(uCatS - s)*1.6 + 1.2*sin(uTime*0.4), (V - 1.)*3.9 - 14.);       // it sits on the glass's foot, under the fish
        float cd = min(ell(cq, vec2(0., 10.), vec2(27., 24.)), ell(cq, vec2(2., 44.), vec2(19., 15. + 0.4*sin(uTime*0.8))));
        vec2 e = vec2(abs(cq.x - 2.) - 11., cq.y - 55.);
        cd = min(cd, max(abs(e.x)*1.6 + e.y*0.9 - 10., -e.y - 8.));              // two ears
        cd = min(cd, max(abs(length(cq - vec2(27., 0.)) - 14.) - 3.2, 29. - cq.x));   // the tail curling out behind
        cd += 0.6*sin(V*0.5 + Uc*0.13); cd /= 2.5;
        vec3 ccol = min(ell(cq, vec2(-5.5, 45.5), vec2(5.4, 3.4)), ell(cq, vec2(9.5, 45.5), vec2(5.4, 3.4))) < 0. ? uTube[4] : uTube[2];
        // a sliver of bare canvas is left round it (broken, like every line here), so it never melts into a fish's window
        col = mix(col, uTube[0], (1. - smoothstep(-aa, aa, cd - max(0.34, 3.*aa)))*step(0.2, vn(vec2(Uc*0.16, V*0.3) + 3.))*uCat);
        col = mix(col, ccol, (1. - smoothstep(-aa, aa, cd))*uCat);
        gl_FragColor = vec4(col, 1.);
      }`}));de.name="glass-room",i.add(de),await s.yield();const D={pos:[],tube:[],idx:[]};let Se=0,Be=0,ve=0;{const c=[],m=[],O=w=>2.8*Math.pow(Math.max(0,Math.sin(Math.PI*(.11+.89*Math.pow(w,.92)))),.5);for(let w=0;w<=22;w++){const b=w/22,v=-4.2+10.9*b,d=O(b),B=d*.62;for(let C=0;C<14;C++){const y=C/14*Math.PI*2,T=Math.cos(y),M=Math.sin(y);c.push(v,T*d*(T>0?.92:1.08)-.1*d,M*B)}}for(let w=0;w<22;w++)for(let b=0;b<14;b++){const v=w*14+b,d=w*14+(b+1)%14,B=v+14,C=d+14;m.push(v,B,d,d,B,C)}ke(D,c,m,l?n.black:n.vermilion);for(let w=2;w<c.length;w+=3)ve=Math.max(ve,Math.abs(c[w]));const V=(w,b,v,d,B,C,y,T=0,M=0)=>{const J=[],lt=[];for(let ce=0;ce<=7;ce++){const Q=ce/7,zt=U(w,v,Q),Ot=U(b,d,Q)+T*Math.sin(Q*Math.PI),ht=B*Math.pow(Math.sin(Math.PI*(.12+.8*Q)),.7)*(1+.12*Math.sin(ce*2.1+w)),ct=v-w,ut=d-b,ft=Math.hypot(ct,ut)||1,Lt=-ut/ft,Rt=ct/ft;for(const dt of[-1,1]){const vt=zt+Lt*ht*dt,pt=Ot+Rt*ht*dt;C==="y"?J.push(vt,pt,M):J.push(vt,.15,pt)}}for(let ce=0;ce<7;ce++){const Q=ce*2;lt.push(Q,Q+1,Q+3,Q,Q+3,Q+2)}ke(D,J,lt,y)};V(-3.2,.5,-9,3.9,1.75,"y",n.rose,.5),V(-3.2,-.5,-8.7,-3.6,1.6,"y",n.rose,-.5),Se=D.idx.length,V(-3.4,.4,-7.9,2.7,1.2,"z",n.rose),V(-3.4,-.4,-7.9,-2.7,1.2,"z",n.rose),Be=D.idx.length,V(-2.8,1.5,3,2.7,1.05,"y",l?n.rose:n.vermilion,.6),V(2.4,-1.9,-.6,-4,.8,"y",n.rose);for(const w of[-1,1]){const d=w*(O(.8211009174311926)*.62*.9),B=[4.75,.55+.1,d+w*.55],C=[];for(let M=0;M<8;M++){const k=M/8*Math.PI*2;B.push(4.75+Math.cos(k)*.7,.55+Math.sin(k)*.7,d-w*.1),C.push(0,1+M,1+(M+1)%8)}ke(D,B,C,l?n.lemon:n.black),l&&(V(-3,.5,.2,1.2,.5,"y",n.rose,.3,w*1.72),V(.6,-.9,3.6,-.2,.46,"y",n.rose,-.25,w*1.66),V(-1.6,-1.5,1.4,-1.2,.4,"y",n.rose,.2,w*1.5));const y=[],T=[];for(let M=0;M<=4;M++){const k=M/4,J=.75*Math.sin(Math.PI*(.15+.8*k));y.push(2.6-3.2*k,-1.2-1.3*k+J,w*(1.4+1.5*k),2.6-3.2*k,-1.2-1.3*k-J,w*(1.4+1.5*k))}for(let M=0;M<4;M++){const k=M*2;T.push(k,k+1,k+3,k,k+3,k+2)}ke(D,y,T,n.rose)}}await s.yield();const ne=yt(D),pe=new t.InstancedBufferGeometry,Te=new t.BufferGeometry;Te.setAttribute("position",ne.getAttribute("position")),Te.setAttribute("tube",ne.getAttribute("tube")),Te.setIndex(D.idx.filter((o,r)=>r<Se||r>=Be)),Te.boundingSphere=new t.Sphere(new t.Vector3,1e5),pe.index=ne.index,pe.setAttribute("position",ne.getAttribute("position")),pe.setAttribute("tube",ne.getAttribute("tube")),pe.setAttribute("iIdx",new t.InstancedBufferAttribute(new Float32Array([0,1,2,3,4]),1)),pe.instanceCount=g,pe.boundingSphere=new t.Sphere(new t.Vector3(0,32,0),60);const kt=`
    uniform vec4 uFish[5], uFishB[5]; uniform float uTime;
    // q: fish space (x along, head +x; y up; z outward). Returns the local position on the fish's circle.
    vec3 fishPlace(vec3 q, float idx, float yOff){
      int k = int(idx + 0.5); vec4 F = uFish[k], B = uFishB[k]; q *= B.y;
      float big = max(B.y/1.3, 1.);                                    // a carp waggles as one fish, not as three
      float tail = (1. - smoothstep(-8.5*big, 3.5*big, q.x));
      float wig = sin(q.x*0.45/big + B.z)*(0.25 + 1.5*tail*tail)*sqrt(big);
      float th = F.x + q.x/max(F.y, 1.), rr = F.y + q.z + wig;
      return vec3(sin(th)*rr, F.z + q.y + yOff + B.w*q.x, cos(th)*rr);
    }`,Le=new t.Mesh(pe,new t.ShaderMaterial({side:t.DoubleSide,uniforms:{...h,...W},vertexShader:`
      ${kt}
      attribute float tube, iIdx; varying float vTube;
      void main(){ vTube = tube; gl_Position = projectionMatrix*modelViewMatrix*vec4(fishPlace(position, iIdx, 0.), 1.); }`,fragmentShader:`
      uniform vec3 uTube[7]; varying float vTube;
      void main(){ gl_FragColor = vec4(uTube[int(clamp(vTube + 0.5, 0., 6.))], 1.); }`}));Le.name="goldfish",Le.frustumCulled=!1,Le.renderOrder=6,i.add(Le);const Ie=new t.CircleGeometry(H-.45,56);Ie.rotateX(-Math.PI/2),Ie.translate(0,ee-.06,0);const Re=new t.Mesh(Ie,new t.ShaderMaterial({side:t.DoubleSide,depthWrite:!1,uniforms:{...h,...W},vertexShader:`
      varying vec3 vL;
      void main(){ vL = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }`,fragmentShader:`
      ${me}
      uniform vec3 uOrigin, uWinA, uWinB; uniform vec4 uFish[5];
      const float FK = ${A.toFixed(1)};
      varying vec3 vL;
      // how far the eye's ray through water point c passes from the nearest fish (three points along each stroke of a fish)
      float fishRay(vec3 c, vec3 cam){
        vec3 rd = c - cam; rd /= max(length(rd), 1e-4);
        float m = 1e3;
        for (int i = 0; i < 5; i++) { vec4 F = uFish[i];
          for (int j = 0; j < 4; j++) { float th = F.x + (-10.4 + 5.4*float(j))*FK/max(F.y, 1.);
            vec3 pt = vec3(sin(th)*F.y, F.z, cos(th)*F.y);
            m = min(m, length(cross(pt - cam, rd)) + (1. - F.w)*1e3 - (j == 0 ? 1.2 : (j == 3 ? 0. : 0.9))*FK); } }
        return m/FK + 1e3*step(-rd.y, 0.3);
      }
      void main(){
        vec3 cam = cameraPosition - uOrigin;
        if (cam.y < ${(ee+.3).toFixed(1)}) discard;
        float aa = max(0.6*length(fwidth(vL.xz)), 1e-3);
        // a fish's window is a handful of strokes from three hands of the old layer (three slants, three lengths), two in three
        // of each laid, overlapping; what is left between them is canvas, a sliver two pixels wide or shut
        float d = 1e3, g = 0.;
        for (int k = 0; k < 3; k++) {
          float sc = k == 0 ? 2.3 : (k == 1 ? 1.3 : 1.75), sd = fract(uSeed.x + 0.29*float(k));
          Stroke o = strokes(vL.xz*sc + 37.*float(k), sd);
          vec3 pc = vec3(vL.x - o.off.x/sc, vL.y, vL.z - o.off.y/sc);          // the stroke's centre on the water
          float on = step(fishRay(pc, cam), 7.8*(0.7 + 0.6*o.h))*step(0.6, fract(o.h*9.7 + 0.13*float(k)));
          float dk = o.d/sc + (1. - on)*1e3;
          if (dk < d) { d = dk; g = o.g; }
        }
        float co = 1. - smoothstep(-aa, aa, d - 1.6*aa);
        vec3 col = mix(uTube[0], g > 0.5 ? uWinB : uWinA, co);
        // the water is told as water the way the glass is told as glass: loose cobalt rings that do not close, each widening
        // from where a fish has risen and coming apart into a shortening arc as it goes (a whole line or none: never a fade)
        float re = 1e3;
        for (int i = 0; i < 5; i++) { float fi = float(i), cl = uTime*0.1 + fi*0.41 + 0.5*h11(fi*3.1), cyc = floor(cl), ft = fract(cl);
          float ha = h11(fi*7.3 + cyc*1.7), hb = h11(fi*2.9 + cyc*3.1 + 5.);
          vec2 c = vec2(cos(ha*6.2832), sin(ha*6.2832))*(5. + 16.*hb), dv = vL.xz - c; float dl = length(dv); vec2 dn = dv/max(dl, 1e-3);
          vec2 gd = vec2(cos(ha*40. + ft*1.5), sin(ha*40. + ft*1.5));
          float rad = (1.6 + 5.4*ft)*(1. + 0.1*dn.x*dn.y), lw = 0.45*(1. - 0.4*ft)*(0.75 + 0.5*dn.y*dn.y);       // the line swells and thins round the ring
          re = min(re, max(abs(dl - rad) - lw, (dot(dn, gd) - 0.9 + 2.1*ft*ft)*dl)); }      // the gap is part of the same distance: no seam where the arc ends
        float rg = clamp(0.5 - re/max(fwidth(re), 1e-4), 0., 1.);      // cut to one pixel after the loop: a hard edge at any slant
        col = mix(col, uTube[2], rg);
        gl_FragColor = vec4(col, 1.);
      }`}));Re.name="water",Re.frustumCulled=!1,Re.renderOrder=5,i.add(Re);const $e=new t.PlaneGeometry(2,2,10,1),Ve=new t.InstancedBufferGeometry;Ve.index=$e.index,Ve.setAttribute("position",$e.getAttribute("position")),Ve.setAttribute("iIdx",new t.InstancedBufferAttribute(new Float32Array([0,1,2,3,4]),1)),Ve.instanceCount=g;const Ce=new t.Mesh(Ve,new t.ShaderMaterial({side:t.DoubleSide,uniforms:{...h,...W},vertexShader:`
      uniform vec4 uFish[5], uFishB[5]; uniform float uTime; uniform vec3 uOrigin;
      attribute float iIdx; varying vec2 vUv; varying float vAr, vSeed;
      void main(){ int k = int(iIdx + 0.5); vec4 F = uFish[k], B = uFishB[k]; vUv = vec2(-position.x, position.y); vSeed = iIdx*0.37 + 0.11;
        float above = smoothstep(1., 5., cameraPosition.y - uOrigin.y - ${ee.toFixed(1)});       // looked down on: a dab no larger than its fish
        vec3 cam = cameraPosition - uOrigin, F3 = vec3(sin(F.x)*F.y, F.z, cos(F.x)*F.y);
        float tt = clamp((cam.y - ${ee.toFixed(1)})/max(cam.y - F3.y, 1.), 0., 1.), sc = mix(1., 0.62*tt, above);
        float st = mix(B.x, min(B.x, 1.25), above), hl = 5.4*st*B.y*sc, hw = 1.55*B.y/sqrt(max(st, 0.5))*mix(1., 1.5*tt, above);
        float th = F.x + (position.x*hl + 0.6*sc)/max(F.y, 1.);
        float rr = F.y + position.y*hw + 0.35*sc*sin(uTime*1.3 + iIdx*2. + position.x*2.5);
        vAr = hl/max(hw, 1e-3);
        vec3 pos = vec3(sin(th)*rr, ${(ee+.18).toFixed(2)}, cos(th)*rr);
        vec3 sh = (cam + (F3 - cam)*tt - F3 + vec3(sin(F.x), 0., cos(F.x))*8.5*tt)*above; pos.xz += sh.xz;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(pos, 1.); }`,fragmentShader:`
      uniform vec3 uTube[7];
      float h11(float n){ return fract(sin(n*127.1 + 1.7)*43758.5453); }
      ${bt}
      varying vec2 vUv; varying float vAr, vSeed;
      void main(){ float sd = floor(vSeed*100. + 0.5)*0.01;       // the seed is whole per dab: an interpolated one stipples the bristled edge
        if (dabShape(vUv, max(vAr, 1.), sd) < 0.) discard; gl_FragColor = vec4(uTube[${l?6:1}], 1.); }`}));if(Ce.name="reflections",Ce.frustumCulled=!1,Ce.renderOrder=7,i.add(Ce),await s.yield(),a.stage!==!1){const o=new t.Vector3(1,0,0),r=new t.Vector3(0,1,0),c=new t.Vector3(0,0,-1),m=(y,T,M)=>new t.Vector3(y,T,M),O=[Me(m(100,ue,310),o,c,800,1e3),Me(m(100,418,310),o,c,800,1e3),Me(m(100,138,-190),o,r,800,560),Me(m(100,138,810),o,r,800,560),Me(m(-300,138,310),c,r,1e3,560),Me(m(500,138,310),c,r,1e3,560)],V={position:[],fu:[],fv:[],idx:[]};let w=0;for(const y of O){for(const T of["position","fu","fv"])V[T].push(...y.getAttribute(T).array);for(const T of y.index.array)V.idx.push(T+w);w+=y.getAttribute("position").count,y.dispose()}const b=new t.BufferGeometry;for(const y of["position","fu","fv"])b.setAttribute(y,new t.Float32BufferAttribute(V[y],3));b.setIndex(V.idx);const v=new t.Mesh(b,gt(p));v.name="stage-room",v.frustumCulled=!1,i.add(v);const d=[],B=(y,T)=>{const M=[];for(let k=0;k<=24;k++)M.push([U(y[0],T[0],k/24),U(y[1],T[1],k/24),U(y[2],T[2],k/24)]);d.push({pts:M,closed:!1,width:2.4,tube:n.black,seed:e()})};for(const y of[ue+.5,417])B([-299,y,-189],[499,y,-189]),B([-299,y,-189],[-299,y,809]),B([499,y,-189],[499,y,809]);B([-299,ue,-189],[-299,418,-189]),B([499,ue,-189],[499,418,-189]);const C=new t.Mesh(He(d),I);C.frustumCulled=!1,C.name="stage-corners",i.add(C)}await s.yield();const ye=[];for(let o=0;o<5;o++)ye.push({r:e.range(14,20),y:0,ph:e.range(0,6.28),sc:e.range(1.12,1.3),w:e.range(.8,1.25)});{const o=e.shuffle([0,1,2,3,4].slice(0,x));for(let r=0;r<x;r++)ye[r].y=23+o[r]/(x-1)*20+e.range(-1.5,1.5)}const Ye=e.range(.74,.84),qe=6/17,Ke=H-.3,At=29.5,We=[14-2.6,20+2.6],Ft=o=>{let r=0;for(let c=0;c<D.pos.length;c+=3){const m=D.pos[c]*o;r=Math.max(r,D.pos[c+2]*o+.25+1.5*(1-Ct(-8.5,3.5,m))**2)}return r},Xe=o=>{const r=ve*o;return[Ke-5-r,Math.min(Ke-2-r,At-Ft(o))]},St=ye.map(o=>Xe(o.sc)),Ze=(()=>{const o=Xe(1.21);return(o[0]+o[1])/2})(),Je=[n.cobalt,n.viridian],Qe=[n.vermilion,n.vermilion];let et=1,tt=!1,ot=0,at=-1,Bt=0,Ee=W.uCatAz.value;const nt=new Float32Array(5),Pe=new Float32Array(5),st=()=>{h.uOldA.value.copy(R(L.old[0])),h.uOldB.value.copy(R(L.old[1])),h.uNewA.value.copy(R(L.next[0])),h.uNewB.value.copy(R(L.next[1])),W.uGOldA.value.copy(R(K[L.old[0]])),W.uGOldB.value.copy(R(K[L.old[1]])),W.uGNewA.value.copy(R(K[L.next[0]])),W.uGNewB.value.copy(R(K[L.next[1]]));const o=m=>m===n.vermilion,r=o(L.old[0])?L.old[1]:L.old[0];W.uWinA.value.copy(R(r)),W.uWinB.value.copy(R(o(L.old[1])?r:L.old[1]));const c=L.next[0]===n.vermilion;h.uShOld.value.copy(R(L.shOld??(c?n.lemon:n.viridian))),h.uShNew.value.copy(R(L.shNew??(c?n.viridian:n.lemon)))};(!a.style||a.layers)&&st();const we=new t.Vector3,Ne=new t.Vector3,Tt=new t.Vector2,rt=(o,r)=>qe*r+ye[o].ph*.15+o*(Math.PI*2/x)*(Ye+(1-Ye)*Math.sin(r*.083))+.5*Math.sin(r*.19*ye[o].w+o*1.9);function Vt(o,r,c){h.uTime.value=r,i.updateWorldMatrix(!0,!1),we.setFromMatrixPosition(i.matrixWorld),W.uOrigin.value.copy(we),s.renderer?.getDrawingBufferSize&&(h.uResY.value=s.renderer.getDrawingBufferSize(Tt).y),Bt+=o;for(let v=0;v<x;v++){const d=ye[v],B=rt(v,r),C=d.r+2.6*Math.sin(r*.11*d.w+d.ph),y=d.y+2.2*Math.sin(r*.23*d.w+d.ph*2),T=o>1e-4?se((B-nt[v])/o,0,1.2):qe;nt[v]=B,Pe[v]=U(Pe[v]||T,T,se(o*3,0,1));const M=rt(v,0),k=St[v];Z[v].set(l?B:M+(B-M)*17/Ze,l?17.5+1.5*Math.sin(r*.11*d.w+d.ph):U(k[0],k[1],(C-We[0])/(We[1]-We[0])),l?30+2.2*Math.sin(r*.23*d.w+d.ph*2):y,v<g?et:0),Fe[v].set(1+se(Math.abs(Pe[v]-qe)*3.2,0,.9),l?2.9:d.sc,-r*(2.6+3.5*Pe[v])+d.ph,.05*Math.cos(r*.23*d.w+d.ph*2))}if(!tt){const v=Math.floor((r+8.7)/30),d=B=>(.13+B*.618034)%1;if(ot=r+8.7-v*30,v!==at){at=v;const B=v%2===1;L.old=B?Qe:Je,L.next=B?Je:Qe,st(),h.uSeed.value.set(d(v),d(v+1))}h.uFront.value=-we.z-850+ot*45}W.uGrow.value=se((h.uFront.value+we.z-70)*.67,0,j.length),c.getWorldPosition(Ne);const m=Ne.x-we.x,O=Ne.z-we.z,V=Math.hypot(m,O);{const v=Math.atan2(Math.sin(Ee-Math.atan2(-m,-O)),Math.cos(Ee-Math.atan2(-m,-O))),d=se((Math.PI-Math.abs(v))/.7,0,1),B=.64*Math.tanh(-v/.3)*d;W.uCatS.value=B,W.uWinS.value=B-1.28+.1*Math.tanh(-v)}const w=Math.atan2(m,O),b=V>H+.5?Math.acos(se((H+.3)/V,-1,1)):Math.PI/2;he[0].position.set(Math.sin(w+b)*(H+.3),0,Math.cos(w+b)*(H+.3)),he[1].position.set(Math.sin(w-b)*(H+.3),0,Math.cos(w-b)*(H+.3))}const Gt={portalSeat:{position:new t.Vector3(-300,74,-22),heading:new t.Vector3(-1,0,0)},flyThrough:[[62,22,80],[73,30,42],[68,42,6],[46,58,-20],[24,73,-25],[0,74,-22],[-40,74,-22],[-110,74,-22]].map(o=>new t.Vector3(...o)),viewpoints:{entry:new t.Vector3(30,14,450),glass:new t.Vector3(68,42,6),overhead:new t.Vector3(0,108,4),leaving:new t.Vector3(-90,74,-22)},rimLanding:new t.Vector3(-20.7,ge+.8,-22),fishOrbit:{center:new t.Vector3(0,33,0),radius:l?17:Ze},shadowSide:new t.Vector3(1,0,0),catDirection:new t.Vector3(0,0,-1),tankRadius:H,rimY:ge,waterY:ee,tableRadius:jt,floorY:ue},it={object:i,radius:60,height:ge,center:new t.Vector3(0,30,0),anchors:Gt,style:p,vine:j,update:Vt,dispose(){j.texture.dispose()},setFront(o){tt=!0,h.uFront.value=o},setCatAzimuth(o){Ee=o,W.uCatAz.value=o},setFishShown(o){et=o?1:0},fishWorld(o,r=new t.Vector3){const c=Z[Math.min(o,x-1)];return r.set(Math.sin(c.x)*c.y,c.z,Math.cos(c.x)*c.y).add(we)},fishCount:g,carp:l,fishSide:Te,ground:!1,groundY:ue};return i.userData.hero=it,it}export{bt as DAB_FRAG,Ht as EXPOSURE,wt as PALETTE,me as STYLE_GLSL,Pt as TUBE,xt as VINE_GLSL,$t as buildHero,He as contourGeometry,Wt as contourMaterial,je as dabGeometry,Ue as dabMaterial,gt as fieldMaterial,Me as fieldPlane,qt as flatMaterial,Dt as hullMaterial,It as makeStyle,Et as makeVineTexture,_t as sceneColor};
