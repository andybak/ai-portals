import*as a from"three";import{clamp as De,lerp as me,smoothstep as ta}from"../kit/core.js";const Kt=170,U={ax:95,bz:55,pivot:[20,20],hn:[.5,.8636364],hd:47.5},Ye=["#F2A93B","#D9381E","#0E1F1B","#F3EAD6","#3E7F5E","#3A2545","#FFE9B8"],Gt=1,Bt=t=>new a.Matrix3().fromArray(t).invert().elements,aa=[.59719,.076,.0284,.35458,.90834,.13383,.04823,.01566,.83777],oa=[1.60475,-.10208,-.00327,-.53108,1.10813,-.07276,-.07367,-.00605,1.07602],Rt=Bt(aa),Dt=Bt(oa),Lt=t=>t.map(e=>e.toFixed(6)).join(","),sa=`
  vec3 toScene(vec3 D){
    vec3 y = clamp(mat3(${Lt(Dt)})*clamp(D, 0., 0.95), 0.0004, 0.97);
    vec3 A = 0.983729*y - 1., B = 0.432951*y - 0.0245786, Cc = 0.238081*y + 0.000090537;
    vec3 v = (-B - sqrt(max(B*B - 4.*A*Cc, 0.)))/(2.*A);
    return max(mat3(${Lt(Rt)})*v, 0.)*${(.6/Gt).toFixed(5)};
  }`;function na(t){const e=new a.Color(t),o=[Math.min(e.r,.95),Math.min(e.g,.95),Math.min(e.b,.95)],h=(c,s)=>[c[0]*s[0]+c[3]*s[1]+c[6]*s[2],c[1]*s[0]+c[4]*s[1]+c[7]*s[2],c[2]*s[0]+c[5]*s[1]+c[8]*s[2]],p=h(Dt,o).map(c=>De(c,4e-4,.97)).map(c=>{const s=.983729*c-1,i=.432951*c-.0245786,m=.238081*c+90537e-9;return(-i-Math.sqrt(Math.max(i*i-4*s*m,0)))/(2*s)}),l=h(Rt,p).map(c=>Math.max(c,0)*.6/Gt);return new a.Color(l[0],l[1],l[2])}function ia(t=Ye){return{uPal:{value:Ye.map((o,h)=>new a.Color(t[h]||o))},uTime:{value:0},uPetal:{value:0},uKoiT:{value:0},uKoiYaw:{value:0},uJoint:{value:0},uNearR:{value:25},uTurn:{value:0},uShell:{value:new a.Matrix4},uKey:{value:new a.Vector3(-.5,.42,.76).normalize()},uApex:{value:new a.Vector3(0,0,0)},uBreeze:{value:0},uGenGain:{value:.93},uGenPlum:{value:.925},uFocus:{value:new a.Vector4(0,0,0,0)},uGenEye:{value:new a.Vector4(0,0,0,0)},uClear:{value:new a.Vector4(0,0,1,2)},uClearFar:{value:0},uLateTurn:{value:.9},uBand0:{value:new a.Vector4(1,0,0,0)},uBand1:{value:new a.Vector4(0,1,0,0)},uBandC:{value:new a.Vector4(0,0,0,0)},uCapB:{value:new a.Vector4(0,1,0,.3)},uCapK:{value:new a.Vector2(0,0)},uShellEye:{value:new a.Vector4(0,0,0,0)},uKeyW:{value:new a.Vector3(.62,.42,-.66).normalize()},uSlitCol:{value:new a.Color(t[0]||Ye[0])},uGlow:{value:new a.Vector4(0,0,400,0)},uGenMax:{value:1e3},uGenCut:{value:1e3},uBoughCut:{value:0},uPadCut:{value:0},uPush:{value:1},uBare:{value:0},uIce:{value:0},uKoiMode:{value:0}}}const ra=`
  uniform float uTime, uTurn, uBreeze, uLateTurn; uniform mat4 uShell; uniform vec3 uKey, uApex; uniform vec4 uGenEye, uShellEye, uBand0, uBand1, uBandC, uGlow, uCapB; uniform vec2 uCapK; uniform float uPush, uGenMax;
  attribute vec4 iInfo;      // generation, slot, shell flag (1 = Globe copy), seed
  attribute vec4 iClip;      // inset of mirror x=0, of the hypotenuse, of z=0 (m); w: 1 leaning mirrors (uApex), 0 upright, -1 upright + hinge sway
  varying vec3 vW, vN, vV, vL, vApex; varying vec4 vInfo; varying vec3 vInset;
  const vec2 PIVOT = vec2(${U.pivot[0].toFixed(1)}, ${U.pivot[1].toFixed(1)});
  float turnOf(){ return uTurn + step(1.5, iInfo.w)*uLateTurn; }
  vec3 discToWedge(vec3 p){ float c = cos(turnOf()), s = sin(turnOf()); return vec3(PIVOT.x + c*p.x - s*p.z, p.y, PIVOT.y + s*p.x + c*p.z); }
  vec3 discDir(vec3 n){ float c = cos(turnOf()), s = sin(turnOf()); return vec3(c*n.x - s*n.z, n.y, s*n.x + c*n.z); }
  vec2 wedgeToDisc(vec2 w){ float c = cos(turnOf()), s = sin(turnOf()); vec2 d = w - PIVOT; return vec2(c*d.x + s*d.y, -s*d.x + c*d.y); }
  mat4 copyMatrix(){ mat4 m = instanceMatrix; if (iInfo.z > 0.5) m = uShell*m; return modelMatrix*m; }
  // pw, nw: position and normal in wedge space. Sets every varying and returns the clip-space position.
  vec4 gardenVertex(vec3 pw, vec3 nw){
    mat4 m = copyMatrix();
    if (iClip.w < -0.5 && iClip.w > -1.5) {                 // (iClip.w -2: an upright copy whose tree is not drawn) a page of the Tongue swaying a degree on its hinge (the edge x = 0)
      float a = 0.0175*sin(uTime*0.45 + iInfo.w*6.2832), c = cos(a), s = sin(a);
      pw = vec3(c*pw.x - s*pw.y, s*pw.x + c*pw.y, pw.z); nw = vec3(c*nw.x - s*nw.y, s*nw.x + c*nw.y, nw.z);
    }
    vec4 wp = m*vec4(pw, 1.);
    mat3 m3 = mat3(m);
    vW = pw; vInfo = iInfo; vInset = iClip.xyz; vApex = uApex*clamp(iClip.w, 0., 1.);
    if (iInfo.z < -0.5) { vec3 cc = (m*vec4(34., 0., 17., 1.)).xyz; vInfo.x = (iInfo.x + max(length(cc - uGenEye.xyz) - 46., 0.)*uGenEye.w)*(1. - uGlow.w*(1. - smoothstep(0.3*uGlow.z, uGlow.z, length(cc.xz - uGlow.xy)))); }   // (the Globe is a lantern: the gardens round its foot stand in its light)
    // the Globe counts its reflections from where we are: the garden beside the lens is the true one, the far side is dusk
    if (iInfo.z > 0.5) {
      vec3 cc = (m*vec4(34., 0., 17., 1.)).xyz; vInfo.x = max(length(cc - uShellEye.xyz) - 64., 0.)*uShellEye.w;
      // ... or, when the world lays a BAND OF LIGHT on the wall (uBandC.w > 0): brightness belongs to the facets. The band is an
      // arc of the shell (from uBand0.xyz round toward uBand1.xyz, uBand0.w radians long, uBand1.w radians wide); a garden is
      // dimmer by one reflection for every 1/uBandC.w radians it lies from that arc. Counted in the shell's own frame.
      if (uBandC.w > 0.) {
        vec3 dd = (modelMatrix*(instanceMatrix*vec4(34., 0., 17., 1.) + vec4(0., ${Kt}., 0., 0.))).xyz - uBandC.xyz; dd = dd/max(length(dd), 1e-3);   // (the shell's own frame: its centre is GLOBE_CY up, as uShell places it)
        float bx = dot(dd, uBand0.xyz), by = dot(dd, uBand1.xyz), an = atan(by, bx + 1e-5), ac = clamp(an, 0., uBand0.w);
        vec3 near = uBand0.xyz*cos(ac) + uBand1.xyz*sin(ac);
        vInfo.x = max(acos(clamp(dot(dd, near), -1., 1.)) - uBand1.w, 0.)*uBandC.w;
        // (review 6) ... and a second, smaller cap of light (uCapB: its direction in the shell's frame and its half-width; uCapK: reflections
        // per radian beyond it, and reflections added to the whole cap: large = dark): the gardens that stand behind the Gate
        if (uCapK.x > 0.) vInfo.x = min(vInfo.x, max(acos(clamp(dot(dd, uCapB.xyz), -1., 1.)) - uCapB.w, 0.)*uCapK.x + uCapK.y);
        vInfo.x = min(vInfo.x, uGenMax);
      }
    }
    vec3 n = m3*nw; vN = n/max(length(n), 1e-5);
    vec3 l = m3*uKey; vL = l/max(length(l), 1e-5);
    // nothing solid comes nearer the lens than about five metres: boughs and leaves part before it
    vec3 dc = wp.xyz - cameraPosition; float dl = length(dc);
    wp.xyz += dc/max(dl, 1e-3)*(1. - smoothstep(2.0, 6.5, dl))*(6.5 - dl)*0.8*uPush;
    vV = cameraPosition - wp.xyz;
    return projectionMatrix*viewMatrix*wp;
  }`,Ft=`
  uniform vec3 uPal[7]; uniform float uGenGain, uGenPlum, uGenCut, uBoughCut, uTime, uBare, uIce, uKoiMode, uClearFar, uPadCut; uniform vec4 uClear;
  varying vec3 vW, vN, vV, vL, vApex; varying vec4 vInfo; varying vec3 vInset;
  ${sa}
  // signed distances (m, positive inside) to the three mirrors at this height; the mirrors lean to vApex
  vec3 mirrorDist(vec3 P){
    return vec3(P.x - P.y*vApex.x, ${U.hd.toFixed(1)} - dot(P.xz, vec2(${U.hn[0]}, ${U.hn[1]})) - P.y*vApex.z, P.z - P.y*vApex.y);
  }
  // (true = cut. It does not discard: a derivative taken after a discard is not defined, so the caller makes the cut after its last fwidth)
  bool clipWedge(){ vec3 d = mirrorDist(vW); d.x -= max(vInset.x - 1.3, 0.); return min(d.x, min(d.y, d.z)) < 0.; }
  // JANUARY (review 8): the ice is enamel like the rest: flat PLATES in three decided tones (a pale frost of ivory toward plum, a
  // jade-grey, a plum-grey), each one flat tone, with hard cracked edges; the jade-black water shows in the leads between plates,
  // in scalloped leads along the seams, in whole missing plates and in the open pools passed in open (metres, negative inside).
  // p: disc metres (the plates turn with the garden and fold into the seams), seamD: metres to the nearest mirror, px: metres a pixel.
  vec2 iceH2(vec2 c){ vec3 p3 = fract(vec3(c.xyx)*vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz)*p3.zy); }
  vec3 iceTone(float h){
    vec3 frost = mix(uPal[3], uPal[5], 0.60), jade = mix(mix(uPal[2], uPal[4], 0.35), uPal[3], 0.20), plumG = mix(uPal[5], uPal[3], 0.09);
    return h < 0.50 ? frost : h < 0.80 ? jade : plumG;
  }
  // (iceCol takes three widths, and a width taken inside a branch that not every pixel of a block of four takes is not defined. So it stands
  // in two parts for a caller that lays the ice inside a branch: icePlate(p) = (metres to the plate's cracked edge, the plate's hash), and
  // iceLaid, which is handed pl = icePlate(p) and w = the fwidth of (pl.x, seamD, open), both taken ABOVE the caller's branch.)
  vec2 icePlate(vec2 p){
    vec2 g = p/13., ci = floor(g), f = g - ci, id = ci; float d1 = 9., d2 = 9.;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
      vec2 o = vec2(float(i), float(j)), q = o + 0.12 + 0.76*iceH2(ci + o) - f; float d = dot(q, q);
      if (d < d1) { d2 = d1; d1 = d; id = ci + o; } else if (d < d2) d2 = d;
    }
    return vec2((sqrt(d2) - sqrt(d1))*6.5, iceH2(id + 17.3).x);         // metres to the plate's cracked edge, and its hash
  }
  vec3 iceLaid(vec3 water, vec2 p, float seamD, float open, float px, vec2 pl, vec3 w){
    float h = pl.y, edge = pl.x;
    float sc = abs(sin(p.x*0.46 + 1.3*sin(p.y*0.21)));                      // scallops along the leads
    float wE = w.x, wS = w.y, wO = w.z;                                      // (the edge is filtered by its own slope on screen: hard from any angle)
    float l0 = edge - max(0.26, min(0.8*wE, 0.8*px)), l1 = seamD - 0.9 - 1.2*sc, l2 = open - 1.3*sc, lead = min(l0, min(l1, l2));
    float e = 0.7*(l0 < min(l1, l2) ? wE : l1 < l2 ? wS : wO);
    if (h < 0.07) lead = -1.;                                               // a plate gone: a whole dark lead
    e = clamp(e, 1e-3, 0.75*px + 1e-3); float ice = smoothstep(-e, e, lead);
    vec3 avg = mix(water, mix(iceTone(0.2), iceTone(0.6), 0.45), 0.72);     // plates too small to draw: their flat average
    return mix(avg, mix(water, iceTone((h - 0.07)/0.93), ice), 1. - smoothstep(1.7, 3.6, px));
  }
  vec3 iceCol(vec3 water, vec2 p, float seamD, float open, float px){       // (whole, as it was: for a caller that stands outside every branch)
    if (uIce < 0.5) return water;
    vec2 pl = icePlate(p);
    return iceLaid(water, p, seamD, open, px, pl, vec3(fwidth(pl.x), fwidth(seamD), fwidth(open)));
  }
  // fired enamel: flat colour, hard terminator leaning to jade-black, dark glossy rim, one tight hard highlight
  vec3 gShade = vec3(-1.);                                  // set to a colour to shade toward it instead of the pond's jade-black
  vec3 enamel(vec3 base, vec3 N, float gloss){
    vec3 V = vV/max(length(vV), 1e-4); vec3 sh = gShade.x < 0. ? uPal[2] : gShade;
    // amber's shade leans to vermilion, not to jade-black: its dark side is orange, never mustard or brown
    if (gShade.x < 0.) sh = mix(sh, uPal[1]*0.72, smoothstep(0.25, 0.42, base.g/max(base.r, 1e-3))*smoothstep(0.5, 0.8, (base.r - base.b)/max(base.r, 1e-3)));
    if (dot(N, V) < 0.) N = -N;
    float nl = dot(N, vL), w = fwidth(nl) + 1e-4;
    vec3 col = mix(mix(base, sh, 0.40), base, smoothstep(-w, w, nl - 0.08));
    float nv = dot(N, V), wv = fwidth(nv) + 1e-4;
    col = mix(mix(col, sh, 0.62), col, smoothstep(-wv, wv, nv - 0.23));
    vec3 H = vL + V; H = H/max(length(H), 1e-4);
    float h = dot(N, H), wh = fwidth(h) + 1e-4;
    col = mix(col, uPal[6], gloss*smoothstep(-wh, wh, h - 0.972));
    return col;
  }
  // distance is counted in reflections: each one keeps uGenGain of the light and leans a step toward plum
  // (a warm pigment leans to rose on its way to plum, so a dimmed amber is plum-red, never brown)
  vec3 generation(vec3 col, float g){
    float kp = pow(uGenPlum, g), warm = smoothstep(0.3, 0.7, (col.r - col.b)/max(col.r, 1e-3)), w = warm*(1. - kp);
    col.g = mix(col.g, min(col.g, 0.07*col.r), 0.9*warm*(1. - pow(0.74, g)));        // amber dims THROUGH vermilion (orange, then red), then to rose-plum with the rest: never tan
    col.g *= 1. - 0.62*w; col.b = mix(col.b, max(col.b, 0.22*col.r), w);
    kp *= 1. - smoothstep(uGenCut, uGenCut + 5., g);
    return mix(uPal[5], col*pow(uGenGain, g), kp);
  }
  const vec3 LACQ = vec3(0.0044, 0.0137, 0.0110);            // black lacquer #0E1F1B: trunks, boughs and the Tongue's rib, whatever colour the water is
  // the cracked mirror: a copy flagged late (seed >= 2) is the same garden an hour on, in blue dusk
  vec3 lateHour(vec3 c){ float l = dot(c, vec3(0.3, 0.5, 0.2)); return mix(c, vec3(0.17, 0.27, 0.52)*(0.3 + 1.5*l), 0.74*step(1.5, vInfo.w)); }
  vec4 finish(vec3 col){ return vec4(toScene(generation(lateHour(col), vInfo.x)), 1.); }`;function Pe(t,e={}){const o=e.slots|0,h={...t,...e.uniforms||{}};return o&&(h.uSlot={value:Array.from({length:o},()=>new a.Vector4(0,0,0,0))}),new a.ShaderMaterial({uniforms:h,side:e.side??a.DoubleSide,transparent:!!e.transparent,depthWrite:e.depthWrite??!0,blending:e.blending??a.NormalBlending,defines:e.defines||{},vertexShader:`
      ${ra}
      attribute vec2 aInk; varying vec2 vInk; varying vec3 vP;
      ${o?`uniform vec4 uSlot[${o}];`:""}
      ${e.vertDecl||""}
      void main(){
        vec3 p = position, n = normal; float alive = 1.;
        ${o?`vec4 sl = uSlot[int(iInfo.y + 0.5)]; float sc_ = cos(sl.z), ss_ = sin(sl.z); alive = step(1e-4, sl.w);
        p = vec3(sc_*p.x - ss_*p.z, p.y, ss_*p.x + sc_*p.z)*sl.w + vec3(sl.x, 0., sl.y);
        n = vec3(sc_*n.x - ss_*n.z, n.y, ss_*n.x + sc_*n.z);`:""}
        vP = position; vInk = aInk;
        ${e.vertMove||""}
        gl_Position = gardenVertex(${e.wedgeSpace?"p, n":"discToWedge(p), discDir(n)"});
        if (alive < 0.5) gl_Position = vec4(0., 0., 2., 1.);
      }`,fragmentShader:`
      ${Ft}
      varying vec2 vInk; varying vec3 vP;
      ${e.fragDecl||""}
      void main(){
        // EVERY CUT IS DECIDED WHERE IT STANDS AND MADE LATE: a derivative taken after a discard is not defined (the rim of every cut came out
        // different on each draw). So a cut sets the bool cut (here, and in a fragColor piece: cut = true, never a discard), and the one
        // discard stands after the last fwidth: after enamel(), or after fragEnd when a material has one. A piece that leaves main by return
        // must make the cut itself, after its own last fwidth.
        bool cut = ${e.noClip?"false":"clipWedge()"};
        if (vInk.x < 1.5 && (uBare > 0.5 || vInfo.w > 1.5)) discard;   // (made here: an ink is one value over a triangle and vInfo.w one over a copy, so this takes whole triangles and leaves no rim)
        { float d2 = dot(vV, vV); if (d2 < 2.6) cut = true;                // foliage never sits on the lens: it parts in a bubble round it, and in the clear cone
          // (round 12: opts.lensCut false leaves the cut by the lens's distance out of a material whose bodies are kept off the route by place; the bubble and the clear cone stay)
          if (vInk.x < 1.5 && (${e.lensCut===!1?"":`d2 < max(${((e.nearCut??7.5)**2).toFixed(1)}, uPadCut*uPadCut) || `}(${e.keepIf?"!("+e.keepIf+") && ":""}d2 < uClearFar*uClearFar && dot(-vV, uClear.xyz) > uClear.w*sqrt(d2)))) cut = true; }
        vec3 base = uPal[int(clamp(vInk.x, 0., 6.) + 0.5)]; float gloss = vInk.y;
        vec3 N = vN/max(length(vN), 1e-4);
        ${e.fragColor||""}
        vec3 lit = enamel(base, N, gloss);
        ${e.fragEnd?"":"if (cut) discard;"}
        gl_FragColor = finish(lit);
        ${e.fragEnd?e.fragEnd+`
        if (cut) discard;`:""}
      }`})}const Qe=(1+Math.sqrt(5))/2,ve={R:150,Ra:157,centerY:Kt,pitch:35*Math.PI/180,slitHalf:8};function la(t){const e=(n,v,g)=>new a.Vector3(n,v,g),o=e(0,1/Qe,Qe).normalize().multiplyScalar(ve.R),h=e(0,-1/Qe,Qe).normalize().multiplyScalar(ve.R),r=o.clone().add(h).multiplyScalar(.5),p=e(1,0,Qe).normalize().multiplyScalar(ve.Ra),l=p.clone().sub(r).multiplyScalar(1/U.ax),c=o.clone().sub(r).multiplyScalar(1/U.bz),s=c.clone().cross(l).normalize();s.dot(r)>0&&s.negate(),s.multiplyScalar((l.length()+c.length())/2);const i=new a.Matrix4().makeBasis(l,s,c).setPosition(r),m=n=>{n=n.clone().normalize();const v=new a.Matrix4;return v.set(1-2*n.x*n.x,-2*n.x*n.y,-2*n.x*n.z,0,-2*n.x*n.y,1-2*n.y*n.y,-2*n.y*n.z,0,-2*n.x*n.z,-2*n.y*n.z,1-2*n.z*n.z,0,0,0,0,1),v},y=[m(e(0,1,0)),m(e(1,0,0)),m(p.clone().cross(o))],k=e(.31,.57,.83),f=n=>{const v=k.clone().applyMatrix4(n);return[v.x,v.y,v.z].map(g=>Math.round(g*1e4)).join(",")},S=new Map,A=[{g:new a.Matrix4,gen:0,word:""}];S.set(f(A[0].g),1);for(let n=0;n<A.length&&A.length<130;n++){const v=A[n];for(let g=0;g<3;g++){const C=v.g.clone().multiply(y[g]),j=f(C);S.has(j)||(S.set(j,1),A.push({g:C,gen:v.gen+1,word:v.word+g}))}}const X=new a.Matrix4().makeRotationX(ve.pitch),L=[],V=()=>{const n=new a.Matrix4;return t()<.34?(n.makeRotationX((t()-.5)*.014),n.setPosition((t()-.5)*.3,0,(t()-.5)*.3)):(t(),t(),t()),n};for(const n of A){const v=n.word===""||n.word==="0"||n.word==="1"||n.word==="01"||n.word==="10",g=X.clone().multiply(n.g).multiply(i).multiply(V());L.push({matrix:g,gen:n.gen,shell:1,seed:t(),clip:[v?ve.slitHalf:1.3,1.3,.12,v?2:1]})}const _=e(0,0,0).applyMatrix4(i.clone().invert()),q=e(_.x/_.y,_.z/_.y,(U.hd-U.hn[0]*_.x-U.hn[1]*_.z)/_.y),J=ve.centerY,he=Math.sin(ve.pitch),de=Math.cos(ve.pitch),Ce=e(0,J-ve.R*he,ve.R*de),Ie=e(0,he,-de),Se=e(0,de,he),te=[84,72,62,52,44,36,30],ce=[0,3,7,12,18,26,35],we=[],u=Ce.clone().addScaledVector(Se,-20).addScaledVector(Ie,-16);let M=0;for(let n=0;n<7;n++)M+=te[n]*Math.sin(ce[n]*Math.PI/180);const N=u.y/M;let F=u.clone();we[7]=F.clone();for(let n=6;n>=0;n--){const v=ce[n]*Math.PI/180;F=F.clone().addScaledVector(e(0,Math.sin(v),-Math.cos(v)),-te[n]*N),we[n]=F.clone()}const z=[];for(let n=0;n<7;n++){const v=ce[n]*Math.PI/180,g=e(0,Math.sin(v),-Math.cos(v)),C=e(0,Math.cos(v),Math.sin(v)),j=(n+1)*4.5*Math.PI/180,Y=te[n]*N/110,H=1.6+.95*n;for(const Q of[1,-1]){const ae=e(Q*Math.cos(j),0,0).addScaledVector(C,Math.sin(j)),fe=e(-Q*Math.sin(j),0,0).addScaledVector(C,Math.cos(j)),We=we[n].clone().add(we[n+1]).multiplyScalar(.5).addScaledVector(ae,H);z.push({k:n,side:Q,c:We,w:ae,n:fe,t:g,sc:Y,rho:j});const st=t();for(const bt of[1,-1]){const Te=new a.Matrix4().makeBasis(ae.clone().multiplyScalar(Y),fe.clone().multiplyScalar(Y),g.clone().multiplyScalar(Y*bt)).setPosition(We);L.push({matrix:Te,gen:.3+n*.22,shell:0,seed:st,clip:[De(1.5/Y,2.2,5.5),De(1.5/Y,2.2,5.5),.12,-1]})}}}return{copies:L,apex:q,tongue:{spine:we,pages:z,slit:Ce,head:Ie,up:Se,tip:u,TH:ce}}}function re(t,e,o,h=1){const r=o.length*h,p=new a.InstancedMesh(t,e,r),l=new Float32Array(r*4),c=new Float32Array(r*4);for(let s=0,i=0;s<h;s++)for(const m of o)p.setMatrixAt(i,m.matrix),l.set([m.gen,s,m.shell,m.seed],i*4),c.set(m.clip,i*4),i++;return t.setAttribute("iInfo",new a.InstancedBufferAttribute(l,4)),t.setAttribute("iClip",new a.InstancedBufferAttribute(c,4)),p.frustumCulled=!1,p.instanceMatrix.needsUpdate=!0,p}function ze(){const t=[],e=[],o=[],h=[];return{P:t,N:e,K:o,I:h,v(p,l,c,s,i,m,y,k=.8){return t.push(p,l,c),e.push(s,i,m),o.push(y,k),t.length/3-1},tri(p,l,c){h.push(p,l,c)},quad(p,l,c,s){h.push(p,l,c,p,c,s)},build(p=!1){let l=new a.BufferGeometry;return l.setAttribute("position",new a.Float32BufferAttribute(t,3)),l.setAttribute("normal",new a.Float32BufferAttribute(e,3)),l.setAttribute("aInk",new a.Float32BufferAttribute(o,2)),l.setIndex(h),p&&(l=l.toNonIndexed(),l.computeVertexNormals()),l}}}const ca=`
  float hash1(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.x); }`;function Ht(){const t=ze(),e=(o,h,r,p)=>t.v(o,h,r,0,p,0,2,1);t.tri(e(0,0,0,1),e(2,0,0,1),e(1,0,0,1));for(const[o,h]of[[0,1],[1,2],[2,0]])t.quad(e(o,0,1,1),e(h,0,1,1),e(h,1,1.999,1),e(o,1,1.999,1));t.tri(e(0,2,2,-1),e(1,2,2,-1),e(2,2,2,-1));for(const[o,h]of[[0,1],[1,2],[2,0]])t.quad(e(o,0,2,-.2),e(h,0,2,-.2),e(h,2,2,-.2),e(o,2,2,-.2));return t.build()}function Ot(t,e,o){return Pe(t,{wedgeSpace:!0,noClip:!0,uniforms:e,vertDecl:"varying float vPart; varying vec3 vCamW; varying vec2 vDisc; varying float vAlong; varying vec3 vPane; varying float vLean, vPar;",vertMove:`
      vCamW = (inverse(copyMatrix())*vec4(cameraPosition, 1.)).xyz;
      float lay = position.y; vec3 ins = iClip.xyz;
      ins.z = max(ins.z, 0.001*length(vCamW - vec3(PIVOT.x, 0., PIVOT.y)));        // the hairline seam never thins below ~1.5 px
      bool page = iClip.w < -0.5 && iClip.w > -1.5;                                // a page of the Tongue: its rim is a cloison wire, drawn whole
      if (lay > 0.5 && lay < 1.5) ins = page ? vec3(0., 0., max(ins.z - 1.3, 0.)) : max(ins - 1.3, 0.) - clamp(0.003*length(vCamW - vec3(PIVOT.x, 0., PIVOT.y)), 0.05, 0.5);   // (review 6: each strip LAPS a little past its mirror line, and the fragment stage trims the lap to under a pixel: no crack between the two copies that share a line, so a thread's core is one unbroken line)
      if (lay > 1.5) ins = vec3(page ? vec2(0.) : max(iClip.xy - 1.3, 0.), -0.25);                   // the glass back runs out to the mirror lines: pane meets pane (and laps its other half, so no crack shows the seam behind)
      const vec2 HN = vec2(${U.hn[0]}, ${U.hn[1]}); const float HD = ${U.hd.toFixed(1)};
      vec2 q = position.x < 0.5 ? ins.xz : position.x < 1.5 ? vec2((HD - ins.y - HN.y*ins.z)/HN.x, ins.z) : vec2(ins.x, (HD - ins.y - HN.x*ins.x)/HN.y);
      p = vec3(q.x, lay > 1.5 ? -1.6 : 0., q.y); n = normalize(normal + vec3(0.001, 0., 0.));
      // (10c: the strips lie flat on the plain again, as in the version on the site; a ridge that rose with its distance from the lens is out)
      vPart = position.z; vAlong = q.x + q.y*0.7; vLean = iClip.w; vPar = step(0.5, mod(floor(iInfo.x + 0.5), 2.));   // (which side of the mirror this half-garden is: light and dark alternate round the ball)
      vPane = (copyMatrix()*vec4(34., 0., 17., 1.)).xyz;                            // this half-garden's centre, in the world (the same at every corner)
      vDisc = wedgeToDisc(q);
      if (${o===1?"position.z < 1.9995":"position.z > 1.9995"}) alive = 0.;`,fragDecl:`
      varying float vPart; varying vec3 vCamW; varying vec2 vDisc; varying float vAlong; varying vec3 vPane; varying float vLean, vPar;
      float sdTaper(vec2 p, vec2 a, vec2 b, float ra, float rb){ vec2 ab = b - a; float h = clamp(dot(p - a, ab)/max(dot(ab, ab), 1e-3), 0., 1.); return length(p - a - ab*h) - mix(ra, rb, h); }
      uniform vec4 uCrown[6]; uniform vec3 uKoiW[4]; uniform vec3 uKey, uKeyW, uSlitCol; uniform float uInside; uniform vec4 uRing, uTrunk, uBandC;
      uniform float uKoiT, uKoiYaw, uMirrorN, uJoint, uNearR;
      ${Ut}
      // a koi drawn flat on the glass or the near water: a curved body through four points of its own path (nose, shoulder, middle, tail root),
      // a forked tail, two pectoral fins; sad: the field of its saddle
      float koiBody(vec2 p, vec2 n0, vec2 s0, vec2 m0, vec2 t0, out float sad){
        vec2 bk = t0 - m0; bk = bk/max(length(bk), 1e-3); vec2 pr = vec2(-bk.y, bk.x);
        float d = min(min(sdTaper(p, n0, s0, 0.55, 1.45), sdTaper(p, s0, m0, 1.45, 1.15)), sdTaper(p, m0, t0, 1.15, 0.3));
        d = min(d, min(sdTaper(p, t0, t0 + bk*2.7 + pr*1.6, 0.16, 0.6), sdTaper(p, t0, t0 + bk*2.7 - pr*1.6, 0.16, 0.6)));
        vec2 fw = s0 - n0; fw = fw/max(length(fw), 1e-3); vec2 fp = vec2(-fw.y, fw.x);
        d = min(d, min(sdTaper(p, s0, s0 - fw*0.7 + fp*2.4, 0.32, 0.1), sdTaper(p, s0, s0 - fw*0.7 - fp*2.4, 0.32, 0.1)));
        sad = length(p - mix(s0, m0, 0.4)) - 1.2;
        return d;
      }
      ${ca}
      ${yt}
      // the crown, mirrored in the water the way it is drawn above: each bough's pad a lobed rosette with a heart of the other leaf
      // colour and a dark rim, and two leaf cards let go beside it. px: metres per pixel on the water (taken before the call).
      float crownMirror(vec3 ro, vec3 rd, float px, out vec3 rc){
        float cov = 0.; rc = vec3(0.);
        float ry = max(rd.y, 0.06);
        for (int i = 0; i < 6; i++){
          vec4 c = uCrown[i]; float t = (c.y - ro.y)/ry;
          if (c.w > 1. && t > 0. && float(i) < uMirrorN) {
            vec2 d = (ro.xz + rd.xz*t) - c.xz; float rad = length(d), R0 = c.w*1.3, fi = float(i);
            if (rad < R0*2.4) {
              float e = clamp(0.3*px*(1. + 0.02*t), 0.03, 2.), fineK = 1. - smoothstep(0.35, 1.5, e);   // hard enamel edges; lobes and cards drop out when too fine
              float ang = rad > 1e-3 ? atan(d.y, d.x) : 0.;
              float lob = R0*(0.82 + 0.20*cos(5.*ang + fi*1.9)*fineK);
              float inP = 1. - smoothstep(lob - e, lob + e, rad);
              bool amb = (i == 1 || i == 4);
              vec3 pc = amb ? uPal[0] : uPal[1], hc = amb ? uPal[1] : uPal[0];
              if (inP > 0.) {
                vec3 col = mix(hc, pc, max(smoothstep(0.36*lob - e, 0.36*lob + e, rad), 1. - fineK));
                float rimW = max(0.09*R0, 1.5*e);
                col = mix(col, mix(pc, uPal[2], 0.72), smoothstep(lob - rimW - e, lob - rimW + e, rad)*fineK);
                rc = mix(rc, col, inP); cov = max(cov, inP);
              }
              for (int k = 0; k < 2; k++){
                float ak = fi*2.4 + float(k)*2.6 + 0.6, sz = 2.3;
                vec2 q = d - R0*(1.5 + 0.35*float(k))*vec2(cos(ak), sin(ak));
                if (dot(q, q) < sz*sz && fineK > 0.01) {
                  float ca = cos(ak*1.7), sa = sin(ak*1.7); vec2 uv = vec2(ca*q.x - sa*q.y, sa*q.x + ca*q.y)/sz;
                  float lf = leafShape(uv), inL = smoothstep(0., 2.*e/sz, lf)*fineK;
                  vec3 lc = (k == 0) == amb ? uPal[1] : uPal[0];
                  lc = mix(mix(lc, uPal[2], 0.7), lc, smoothstep(0.05, 0.05 + 2.*e/sz, lf));
                  rc = mix(rc, lc, inL); cov = max(cov, inL);
                }
              }
            }
          }
        }
        return cov;
      }`,fragColor:`
      vec3 Vw = vCamW - vW; Vw = Vw/max(length(Vw), 1e-4); float glassA = 1.;
      float px = fwidth(vW.x) + fwidth(vW.z);
      // A SEAM IS A THREAD. On the plain and the Tongue the strip is 1.3 m of each garden, but only a thread of it is drawn: one
      // percent of the frame across both halves at any distance (seam gold on the mirror line, a thin amber edge); the rest of
      // the strip is the pond's own black water, mirror and rings and all.
      vec3 mdS = mirrorDist(vec3(vW.x, 0., vW.z)); mdS.xy -= max(vInset.xy - 1.3, 0.);   // (measured from the strip's own outer edge: a pane beside the slit stands back from its mirror)
      float sdS = min(mdS.x, mdS.y), wsd = fwidth(sdS) + 1e-4, distS = length(vV);
      // EACH PASS HOLDS ONLY ITS OWN TEXT. Pass 1 (the glass back) draws no pond and no strip: vPart is 2 at every corner it draws, so the
      // pond's and the thread's widths, the lap and both their branches are left out of its text. Pass 0 leaves at the end of its own
      // share of the back (below) on every path and never reaches the back's text, which is left out of pass 0.
      ${o===0?`
      float thW = clamp(mix(0.0092, 0.0078, step(0.5, vInfo.z))*distS*mix(0.55, 1., smoothstep(8., 30., distS)), 0.03, 1.3);   // (finer beside the lens: at the bottom edge a thread with its amber edge is under ten pixels)
      bool pageS = vLean < -0.5 && vLean > -1.5;
      bool wideS = !pageS && vPart > 0.5 && vPart < 1.999 && sdS < 1.3001 && mdS.z > max(0.13, 0.0011*distS);   // (review 6: the Globe's leading too: ONE burning thread with its ivory core from the lens to the hub, a hundredth of the frame across at any distance, never a plum band that fades into a thread)
      float wzE = fwidth(vW.z) + 1e-4, wDistE = fwidth(length(vV)) + 1e-4, wPE = fwidth(length(vDisc) - 27.) + 1e-4;   // (for the edge pixels that reach the back: see there)
      float wsz = fwidth(mdS.z) + 1e-4, lapS = min(sdS + max(0.75*wsd, 0.3*thW), mdS.z + max(0.75*wsz, 0.03));
      if (!pageS && vPart > 0.5 && vPart < 1.999 && lapS < 0.) cut = true;   // the lap past the mirror line, trimmed (decided here, made below: see cut in the factory's main)
      // EVERY WIDTH THE POND AND THE THREAD TAKE STANDS HERE, above their branches and above every cut. One strip holds pixels of both
      // branches, and a width taken inside a branch that not every pixel of a block of four takes is as undefined as one taken after a
      // discard. So what each width is taken of is computed on every pixel (the same expressions as before, moved up), and each branch
      // makes the cut at its head, where no width follows.
      float tS = (vPart - 1.)/0.999, wtS = fwidth(tS) + 1e-4;                                             // the thread (seam strip)
      float calm = smoothstep(0.05, 0.4, Vw.y)*mix(1., 0.5, step(vInfo.z, -0.5));                       // seen at a grazing angle the mirror lies flat: a wobble there would smear every reflection into strips
      vec3 Nw = normalize(vec3((0.016*sin(vDisc.x*0.83 + uTime*1.1) + 0.012*sin(vDisc.y*1.9 - uTime*0.7))*calm, 1., 0.016*sin(vDisc.y*0.71 - uTime*0.9)*calm));
      vec3 R = reflect(-Vw, Nw);
      float gz = abs(R.y), wgz = fwidth(gz) + 1e-4;
      float hk = dot(R, uKey), wk = fwidth(hk) + 1e-4;
      `:""}
      // January: the ice's three widths too (of its plate's edge, of the seam, of the open water), for the pond here and for the near water of the glass back
      vec2 iceP = vec2(0.); vec3 iceW = vec3(0.); float openS = 0.;
      if (uIce >= 0.5) {
        vec2 ga = vec2((vW.x - 58.)*1.45, vW.z*0.84), sa = vW.xz - vec2(0.5, 45.), sb = vec2(14., -17.5);   // open water round the moon gate's feet, the stepping stones and the tipper's knocking stone
        openS = length(ga) - 14.5;
        if (vInfo.z < -0.5) openS = min(min(openS, length(sa - sb*clamp(dot(sa, sb)/dot(sb, sb), 0., 1.)) - 3.0), length(vW.xz - vec2(43.5, 16.8)) - 5.2);   // (stones and tipper stand on the plain only)
        iceP = icePlate(vDisc); iceW = vec3(fwidth(iceP.x), fwidth(min(sdS, mdS.z)), fwidth(openS));
      }
      ${o===0?`
      if (vPart < 0.5 || (wideS && sdS > thW + wsd)) {                // ---- the pond: a jade-black mirror
        if (cut) discard;                                               // (the factory's cuts and the lap: every width stands above)
        if (vCamW.y < 0.) discard;                                      // (made here: vCamW is one value over a copy and no width follows on any path)
        float ring = 0.;
        for (int i = 0; i < 4; i++){
          float ph = fract(uTime*0.3 + uKoiW[i].z), rr = 1.2 + ph*8.;
          ring = max(ring, (1. - ph)*(1. - smoothstep(0.10, 0.26, abs(length(vW.xz - uKoiW[i].xy) - rr))));
        }
        vec2 cell = floor(vDisc/11.), f = vDisc - (cell + 0.5)*11.; float hs = hash1(cell);
        vec2 o = (vec2(hash1(cell + 3.1), hash1(cell + 7.7)) - 0.5)*6.;
        float ph = fract(uTime*0.21 + hs*7.), rr = 0.3 + ph*2.6;
        ring = max(ring, step(0.45, hs)*(1. - ph)*(1. - smoothstep(0.06, 0.2, abs(length(f - o) - rr))));
        // (review 8) the tipper's knock: ONE small ring spreading from its knocking stone on each pond of the plain, every six seconds
        { float pk = fract(uTime/6. - 0.87)*2.2; if (pk < 1. && vInfo.z < -0.5) ring = max(ring, (1. - pk*pk)*(1. - smoothstep(0.12, 0.28, abs(length(vW.xz - vec2(42.9, 16.4)) - (1.9 + 4.4*pk))))); }
        ring *= 1. - smoothstep(0.25, 0.7, px);
        // (review 8) the water is ONE flat tone; where it takes the dome's plum (seen flat) it does so across one hard contour, never a fade
        vec3 col = mix(uPal[2], uPal[5], 0.5*(1. - smoothstep(-wgz, wgz, gz - 0.2)));   // (calm, Nw, R, gz and its width: above the branch)
        vec3 rc; float hit = crownMirror(vW, R, px, rc)*(1. - 0.9*ring);   // (a ripple ring cuts the mirrored crown)
        hit *= mix(1., smoothstep(0.13, 0.21, R.y), step(vInfo.z, 0.5));   // on the plain a crown is mirrored only where the water is seen steeply enough to hold its shape: far water stays black
        col = mix(col, rc, 0.84*hit*(1. - uBare)*(1. - step(1.5, vInfo.w)));
        if (uRing.w > 0.5 && abs(vInfo.z) > 0.5 && abs(R.x) > 1e-3) {      // the plain's moon gate (plane x = uRing.x), mirrored in the water
          float tR = (uRing.x - vW.x)/R.x; vec3 hp = vW + R*max(tR, 0.); float rr = length(vec2(hp.y + 0.5, hp.z));
          if (tR > 0. && rr > uRing.y && rr < uRing.z) col = mix(col, mix(uPal[3], uPal[4], step(uRing.z - 1.6, rr)), 0.6);
        }
        col = mix(col, uPal[4], 0.6*ring);
        col = mix(col, uPal[6], smoothstep(-wk, wk, hk - 0.9996)*(1. - step(0.42, px)));   // (a glitter too fine to draw drops out: no dotted lattice on far ponds)
        if (uIce >= 0.5) col = iceLaid(col, vDisc, min(sdS, mdS.z), openS, px, iceP, iceW);   // (the open water, the plate and the three widths: above the branch)
        gl_FragColor = finish(col); return;
      }
      if (vPart < 1.999) {                                            // ---- seam strip: amber, gold core on the mirror line
        if (cut) discard;                                               // (the factory's cuts and the lap: the thread's width stands above)
        float t = tS, wt = wtS, thin = 0.;
        if (wideS) { t = clamp(1. - sdS/thW, 0., 1.); wt = wsd/thW; thin = 1. - smoothstep(0.5, 1.3, thW); }
        float nearK = 0.;   // the Globe's leading seen close: dark lacquer-plum with ONE gold hairline on the mirror line, not an amber slab and not a grey band
        float core = mix(smoothstep(-wt, wt, t - (1. - max(pageS ? 0.62 : mix(mix(0.30, 0.56, thin), 0.08, nearK), 1.3*wt))), 0.45, smoothstep(0.25, 0.5, wt));
        float gl = fract(vAlong/41. + vInfo.w + dot(Vw, vec3(0.9, 0.3, 0.7))*1.7 + uTime*0.05);
        float glint = core*(1. - smoothstep(0.02, 0.05, abs(gl - 0.5)));
        vec3 seamC = mix(uPal[0], uSlitCol, step(0.5, vInfo.z));                    // the Globe's leading burns with the slit light in every season
        vec3 col = mix(mix(seamC, uPal[5]*0.72, nearK), uPal[6], core*(1. - 0.6*smoothstep(0.25, 0.5, wt)));
        vec3 sc = toScene(mix(uPal[5], col*pow(uGenGain, vInfo.x*0.6), pow(uGenPlum, vInfo.x*0.6)));
        float farS = smoothstep(20., 90., distS);                                   // beside the lens the thread is the seam gold itself: no gain, a quiet glint, nothing blown
        if (wideS) sc *= smoothstep(-wsd, wsd, thW - sdS)*0.999 + 0.001;
        gl_FragColor = vec4(sc*(mix(mix(1.0, 1.25, farS), 0.8 + 0.45*core, nearK) + mix(0.3, 2.0, farS)*glint*(1. - nearK)), 1.); return;
      }
      `:""}
      // PASS 0 HOLDS THE POND AND THE STRIPS ONLY, yet a pixel on a strip's outer edge is worked out at its centre, which can lie past
      // the edge: there vPart runs past 1.999 and the pixel comes down here. The back's text takes widths of its own, and taken by one
      // pixel of a block of four after the others have left they are not defined (those pixels came out different on every draw).
      // So in pass 0 such a pixel is given here what the back gives it, from widths taken at the head: the joint's lap trimmed, the
      // pane's flat tone and limb, the pond's shadow, the joint's hairline, the near water's flat tone and contour, the slit's line.
      // THE SAME EXPRESSIONS AS IN THE BACK BELOW: KEEP THE TWO IN STEP. Left out, because they need the back's own widths: the far
      // highlight; the shadow of crown, trunk, mound and leaf cards; striders' rings and koi; what lies on the near water (mirrored
      // crown, cards, koi, rings); and the wall of a slit, which only a swaying page of the Tongue can reach here.
      ${o===0?`{ if (cut || vW.z < -max(0.75*wzE, 0.01)) discard;
        vec3 Vv = vV/max(length(vV), 1e-4); float dist = length(vV); vec3 salmon = mix(uPal[1], uPal[3], 0.5);
        if (dot(N, Vv) < 0.) N = -N;
        vec3 pd = vPane - uBandC.xyz; pd = uBandC.w > 0. ? pd/max(length(pd), 1e-3) : N;
        float hs = fract(vInfo.w*7.31 + 0.37), hs2 = fract(vInfo.w*13.7 + 0.11);
        float face = 0.5 + 0.10*dot(pd, uKeyW) + 0.12*max(-pd.y, 0.) + 0.46*(hs - 0.5) + 0.44*(vPar - 0.5);
        float stepK = floor(clamp((face - 0.2)/0.6, 0., 0.999)*4.);
        if (vLean > 1.5) stepK = pd.x*uKeyW.x > 0. ? 2. + step(0.5, hs2) : step(0.5, hs2);
        vec3 gcol = stepK < 0.5 ? uPal[5]*0.42 : stepK < 1.5 ? uPal[5]*0.80 : stepK < 2.5 ? mix(uPal[5], salmon, 0.075) : mix(uPal[5], salmon, 0.21);
        float limb = 1. - smoothstep(0.16, 0.34, abs(dot(N, Vv)));
        gcol = mix(gcol, mix(uPal[5], salmon, 0.17), 0.7*limb*step(stepK, 1.5)*smoothstep(60., 130., dist));
        float dP = length(vDisc) - 27., pondIn = 1. - smoothstep(-wPE, wPE, dP), lwP = max(0.7, 0.9*wPE);
        float shade = max(0.17*pondIn, 0.46*(1. - smoothstep(lwP - wPE, lwP + wPE, abs(dP)))*clamp(0.45/lwP, 0.35, 1.));
        gcol *= stepK < 0.5 ? 1. + 1.5*shade : 1. - shade;
        float nearW = 1. - smoothstep(-wDistE, wDistE, dist - uNearR);
        float jw = max(min(0.16, 0.0035*dist), 0.75*wzE), jo = fract(vInfo.w*3.71) < 0.34 ? 0.55 : 0.;
        float joint = 0.5*clamp(0.3/jw, mix(0.12, 0.5, smoothstep(27., 60., dist)), 1.)*(1. - smoothstep(jw - 0.5*wzE, jw + 0.5*wzE, abs(vW.z - jo)));
        gcol = mix(gcol, uSlitCol, joint*(1. - nearW));
        if (nearW > 0.) {
          vec3 wcol = mix(uPal[2], uPal[5], 0.5*(1. - smoothstep(0.10, 0.34, abs(dot(N, Vv)))));
          if (uIce >= 0.5) wcol = iceLaid(wcol, vDisc, 1e3, 1e3, px, iceP, vec3(iceW.x, 0., 0.));
          wcol = mix(wcol, uSlitCol, joint); gcol = mix(gcol, wcol, nearW);
          float lwN = max(0.07, 0.8*wDistE); gcol = mix(gcol, uPal[5]*0.3, (1. - smoothstep(lwN - wDistE, lwN + wDistE, abs(dist - uNearR)))*0.9); }
        gcol = mix(gcol, uSlitCol, 1. - smoothstep(-0.5*wsd, 0.5*wsd, sdS - max(mix(0.26, 0.08, nearW), 0.72*wsd)));   // (sdS and wsd: the back's rimD and wr, the same expressions, taken at the head)
        gl_FragColor = vec4(toScene(gcol), 1.); return; }`:`
      // ---- the back: a pane of dusk glass. ONE flat tone per pane (four steps, spread round the ball with only a gentle lean to
      // the key side, so no meridian divides it), a lighter limb at the silhouette, one hard highlight from afar, and light burning
      // only as one thin line where pane meets pane. The garden behind each pane lies on it as a shadow that never drops out:
      // pond edge, lobed crown, trunk, koi ticks, leaf cards drifting inward. Seen CLOSE (the crossing) the glass is the black
      // water itself: jade-black, the crown mirrored in it in vermilion, koi and ripple rings sliding on it.
      vec3 Vv = vV/max(length(vV), 1e-4); float dist = length(vV);
      vec3 salmon = mix(uPal[1], uPal[3], 0.5);
      if (dot(N, Vv) < 0.) N = -N;
      vec3 pd = vPane - uBandC.xyz; pd = uBandC.w > 0. ? pd/max(length(pd), 1e-3) : N;
      float hs = fract(vInfo.w*7.31 + 0.37), hs2 = fract(vInfo.w*13.7 + 0.11);
      float face = 0.5 + 0.10*dot(pd, uKeyW) + 0.12*max(-pd.y, 0.) + 0.46*(hs - 0.5) + 0.44*(vPar - 0.5);
      float stepK = floor(clamp((face - 0.2)/0.6, 0., 0.999)*4.);
      if (vLean > 1.5) stepK = pd.x*uKeyW.x > 0. ? 2. + step(0.5, hs2) : step(0.5, hs2);          // the panes either side of the slit: the key side a visible step lighter
      vec3 gcol = stepK < 0.5 ? uPal[5]*0.42 : stepK < 1.5 ? uPal[5]*0.80 : stepK < 2.5 ? mix(uPal[5], salmon, 0.075) : mix(uPal[5], salmon, 0.21);
      float limb = 1. - smoothstep(0.16, 0.34, abs(dot(N, Vv)));
      gcol = mix(gcol, mix(uPal[5], salmon, 0.17), 0.7*limb*step(stepK, 1.5)*smoothstep(60., 130., dist));   // the paper-moon limb: the dark panes lift at the silhouette
      // one hard highlight on the ball of glass, sliding from pane to pane as the view shifts (from afar only: close, it would be a stain)
      { vec3 Ns = (cameraPosition - vV) - uBandC.xyz; Ns = uBandC.w > 0. ? Ns/max(length(Ns), 1e-3) : N;
        vec3 Ng = mix(N, Ns, 0.6); Ng = Ng/max(length(Ng), 1e-3); vec3 Hg = uKeyW + Vv; Hg = Hg/max(length(Hg), 1e-4);
        float hg = dot(Ng, Hg), wg = fwidth(hg) + 1e-5;
        gcol = mix(gcol, mix(uPal[5], mix(uPal[3], salmon, 0.45), 0.5), smoothstep(-wg, wg, hg - 0.9968)*smoothstep(230., 340., dist)); }   // (round 9c: no rim crescent on the glass; the horizon's band stands behind the Globe instead)
      // THE GARDEN BEHIND THE PANE. Every mark is antialiased by the width of its own distance field (taken outside the loops),
      // and a mark thinner than a pixel is widened to it and thinned in ink, so nothing shimmers and nothing vanishes.
      float dP = length(vDisc) - 27., wP = fwidth(dP) + 1e-4;
      float pondIn = 1. - smoothstep(-wP, wP, dP), lwP = max(0.7, 0.9*wP);
      float pondEdge = (1. - smoothstep(lwP - wP, lwP + wP, abs(dP)))*clamp(0.45/lwP, 0.35, 1.);
      float dC = 1e3, heart = 0., dW = 1e3, heartW = 0., dHrt = 1e3, iW = 0.; vec4 cW = vec4(0., 0., 0., 1.);                               // dC: the crown's shadow on the glass; dW: its pads mirrored in the water, each a small separate lobed shape
      for (int i = 0; i < 6; i++){ vec2 dcr = vW.xz - uCrown[i].xz; float rr = length(dcr), ac = rr > 1e-3 ? atan(dcr.y, dcr.x) : 0.;
        float di = rr - uCrown[i].w*(1.42 + 0.22*cos(5.*ac + float(i)*1.9)); if (di < dC) { dC = di; heart = (i == 1 || i == 4) ? 1. : 0.; }
        float dj = rr - uCrown[i].w*(0.36 + 0.07*cos(5.*ac + float(i)*1.9)); if (dj < dW && (i == 0 || i == 2 || i == 4 || i == 5)) { dW = dj; heartW = (i == 4) ? 1. : 0.; dHrt = rr - uCrown[i].w*(0.15 + 0.035*cos(5.*ac + float(i)*1.9)); cW = uCrown[i]; iW = float(i); } }
      if (vLean > 1.5) {                                                                // (review 6) the panes beside the slit keep a pad of their own in the water we pass, whole inside the flank, wherever the disc's turn has carried the crown's; it draws in as one of those comes near
        float nearP = 1e3; for (int i = 0; i < 6; i++) if (i == 0 || i == 2 || i == 4 || i == 5) nearP = min(nearP, length(uCrown[i].xz - vec2(11.5, 7.8)) - 0.36*uCrown[i].w);
        float kP = smoothstep(2.8, 4.8, nearP); vec2 dcr = vW.xz - vec2(11.5, 7.8); float rr = length(dcr), ac = rr > 1e-3 ? atan(dcr.y, dcr.x) : 0.;
        float dj = rr - 6.6*kP*(0.36 + 0.07*cos(5.*ac + 0.7));
        if (kP > 0.02 && dj < dW) { dW = dj; heartW = 0.; dHrt = rr - 6.6*kP*(0.15 + 0.035*cos(5.*ac + 0.7)); cW = vec4(11.5, 0., 7.8, 6.6*kP); iW = 1.3; } }
      float wW = fwidth(dW) + 1e-4, distB = length(vV), wDist = fwidth(distB) + 1e-4;
      float wC = fwidth(dC) + 1e-4, cr = (1. - smoothstep(-wC, wC, dC))*(1. - uBare);
      vec2 pa = vW.xz - uTrunk.xy, ba = uTrunk.zw - uTrunk.xy; float hh = clamp(dot(pa, ba)/max(dot(ba, ba), 1e-3), 0., 1.);
      float dT = length(pa - ba*hh), wT = fwidth(dT) + 1e-4, lwT = max(1.1, 0.9*wT);
      float tr = (1. - smoothstep(lwT - wT, lwT + wT, dT))*clamp(1.1/lwT, 0.4, 1.);
      float dM = length(pa) - 7.5, wM = fwidth(dM) + 1e-4, lwM = max(0.5, 0.9*wM);       // the moss mound the maple stands on: a disc with its edge drawn
      float mound = max(0.5*(1. - smoothstep(-wM, wM, dM)), (1. - smoothstep(lwM - wM, lwM + wM, abs(dM)))*clamp(0.5/lwM, 0.35, 1.));
      float dK = 1e3, dSad = 1e3, kWho = 0.;
      for (int k = 0; k < 4; k++){ vec2 tg, t2; float fk = float(k), tau = uKoiT + fk*2.1; koiAt(fk, tau, tg); float sp = max(length(tg), 1.);   // each koi a curved fish with a forked tail, bending as it swims its own path
        vec2 tn = tg/sp, sv = vec2(-tn.y, tn.x); float wg = sin(uTime*2.2 + fk*1.7);
        vec2 n0 = koiAt(fk, tau + 4.6/sp, t2) - sv*0.3*wg, s0 = koiAt(fk, tau + 1.7/sp, t2), m0 = koiAt(fk, tau - 2.0/sp, t2) + sv*0.6*wg, t0 = koiAt(fk, tau - 5.4/sp, t2) - sv*1.1*wg;
        float sd1, dk = koiBody(vDisc, n0, s0, m0, t0, sd1); if (dk < dK) { dK = dk; dSad = sd1; kWho = fk; } }
      float wSad = fwidth(dSad) + 1e-4;
      float wK = fwidth(dK) + 1e-4, lwK = max(0., 0.8*wK - 1.1), kk = (1. - smoothstep(lwK - wK, lwK + wK, dK))*clamp(1.1/max(0.8*wK, 1e-3), 0.5, 1.);
      float lsh = 0., lshV = 0., lshA = 0.;
      for (int j = 0; j < 3; j++){ float ph = fract(uTime*0.045 + float(j)*0.37 + vInfo.w*5.), grow = smoothstep(0., 0.1, ph)*(1. - smoothstep(0.9, 1., ph));
        vec2 ql = (vW.xz - mix(uCrown[j].xz, vec2(34., 17.), ph))/(2.6*max(grow, 0.02));
        if (dot(ql, ql) < 1.) { float al = float(j)*2.1 + ph*4., cl = cos(al), sl = sin(al), lfv = leafShape(vec2(cl*ql.x - sl*ql.y, sl*ql.x + cl*ql.y)); if (lfv > lshV) { lshV = lfv; lshA = step(1.5, float(j)); } } }
      { float eL = clamp(0.25*px, 0.004, 0.2); lsh = smoothstep(0., 2.*eL, lshV)*(1. - step(1.1, 0.5*px))*(1. - uBare); }   // (review 6: a flat card with a hard edge, drawn in and out by its size: never a see-through stain)
      float ringW = 0.;                                                                 // water striders' dimples (as on the pond)
      { vec2 cell = floor(vDisc/11.), fc = vDisc - (cell + 0.5)*11.; float hc = hash1(cell);
        vec2 oc = (vec2(hash1(cell + 3.1), hash1(cell + 7.7)) - 0.5)*6.; float phr = fract(uTime*0.21 + hc*7.), rrr = 0.5 + phr*3.2;
        ringW = step(0.4, hc)*(1. - phr)*(1. - smoothstep(0.10, 0.30, abs(length(fc - oc) - rrr)))*(1. - smoothstep(0.25, 0.7, 0.5*px)); }
      // a school of small koi under the glass (seen only close: a twentieth of the frame each), each curving round its own small circle
      float fry = 0., frySad = 1e3;
      { vec2 cs = floor(vDisc/9.5), fc = vDisc - (cs + 0.5)*9.5; float hf = hash1(cs + 17.3), dirF = hf > 0.71 ? 1. : -1.;
        float af = uTime*(0.30 + 0.45*fract(hf*9.7))*dirF + hf*40., pxf = 0.5*px;
        vec2 qf = (fc - (vec2(hash1(cs + 4.4), hash1(cs + 9.1)) - 0.5)*1.6)*4.;                                        // (a koi a quarter the size of the great ones: three metres, on a circle of 3.2 m)
        float aN = af + 0.44*dirF, aS = af + 0.16*dirF, aM = af - 0.19*dirF, aT = af - 0.50*dirF, sdf;
        float df = koiBody(qf, 12.8*vec2(cos(aN), sin(aN)), 12.8*vec2(cos(aS), sin(aS)), 12.8*vec2(cos(aM), sin(aM)), 12.8*vec2(cos(aT), sin(aT)), sdf)*0.25, wf = clamp(0.6*pxf, 0.004, 0.2);
        fry = step(0.25, hf)*(1. - smoothstep(-wf, wf, df))*(1. - smoothstep(0.12, 0.3, pxf))*pondIn; frySad = sdf*0.25; }
      // ... and two that keep to the joint between the halves of the garden (wedge space: z = 0), each circling across it, so that beside the
      // slit a koi is always sliding nose to nose into its twin
      { float pxf = 0.5*px, wf = clamp(0.6*pxf, 0.004, 0.2);
        for (int j = 0; j < 2; j++){ float fj = float(j), dj2 = 1. - 2.*fj, aj = dj2*uJoint*(1. + 0.27*fj) + fj*1.9, sdj;   // (review 6: on the hero's joint clock, which the world keys to the flight: at the crossing a pair touches noses on the joint, mid-flank, on every seed and at any hour; every copy in step, as mirrors are)
          vec2 cj = vec2(17. + 14.*fj, 0.), ej = vec2(5.5, 4.2);   // (the first touches its twin 13 m along the joint: mid-flank beside the slit, whose panes stand 6.7 m back from the mirror)
          vec2 qj = (vW.xz - cj)*4.; float aN = aj + 0.42*dj2, aS = aj + 0.15*dj2, aM = aj - 0.18*dj2, aT = aj - 0.48*dj2;
          vec4 cA = cos(vec4(aN, aS, aM, aT))*ej.x*4., sA = sin(vec4(aN, aS, aM, aT))*ej.y; sA = (sqrt(sA*sA + 0.81) - 0.78)*4.;   // the koi does not swim THROUGH the mirror (half a fish is a bar): it comes to the joint nose first, touches its twin's nose there and turns away, whole all the while
          float dfj = koiBody(qj, vec2(cA.x, sA.x), vec2(cA.y, sA.y), vec2(cA.z, sA.z), vec2(cA.w, sA.w), sdj)*0.25;
          float fj2 = (1. - smoothstep(-wf, wf, dfj))*(1. - smoothstep(0.12, 0.3, pxf))*(1. - smoothstep(-wDist, wDist, distB - uNearR));
          if (fj2 > fry) { fry = fj2; frySad = sdj*0.25; } } }
      float nearW = 1. - smoothstep(-wDist, wDist, distB - uNearR);                           // within 25 m the pane is the black water itself: the change is a contour, never a fade
      { float shade = max(max(0.17*pondIn, 0.46*pondEdge), max(max(0.42*cr, 0.5*mound), max(0.6*tr, 0.55*lsh)));
        gcol *= stepK < 0.5 ? 1. + 1.5*shade : 1. - shade;                               // on the darkest panes the garden shows lighter than the glass, on the others darker
        gcol = mix(gcol, mix(uPal[5], salmon, 0.45), 0.5*ringW*(1. - nearW));              // a strider's dimple, as a ring of lighter glass
        gcol = mix(gcol, mix(uPal[5], uPal[3], 0.42), 0.6*max(kk, fry));
        // the joint between the two halves of one garden: a hairline, dimmer than the burning slits, one in three with the hair of offset
      }
      float wz = fwidth(vW.z) + 1e-4; if (vW.z < -max(0.75*wz, 0.01)) cut = true;     // (review 6: the two halves of a pane lap at the joint; the lap is trimmed to under a pixel so they never fight) (decided here; made below, after the last width of the back)
      // (the last widths of the back stand here: the slit's line and the slit's wall (above the wall's branch, as the pond's are). So the cuts
      // decided above, the factory's and the joint's lap, are made here, before the joint and the near water are worked out)
      vec3 md = mirrorDist(vec3(vW.x, 0., vW.z)); float rimD = min(md.x - max(vInset.x - 1.3, 0.), md.y - max(vInset.y - 1.3, 0.));
      float wr = fwidth(rimD) + 1e-4;
      float sy = clamp(-vW.y/1.6, 0., 1.), wy = fwidth(sy) + 1e-4, sx = vAlong*1.43, wx = fwidth(sx) + 1e-4;
      vec2 iceS = vec2(0.); float wIceS = 0.;
      if (uIce >= 0.5) { iceS = icePlate(vec2(sx, sy*22.)); wIceS = fwidth(iceS.x); }
      if (cut) discard;
      float jw = max(min(0.16, 0.0035*distB), 0.75*wz), jo = fract(vInfo.w*3.71) < 0.34 ? 0.55 : 0.;   // (a hairline at any distance)
      float joint = 0.5*clamp(0.3/jw, mix(0.12, 0.5, smoothstep(27., 60., dist)), 1.)*(1. - smoothstep(jw - 0.5*wz, jw + 0.5*wz, abs(vW.z - jo)));
      gcol = mix(gcol, uSlitCol, joint*(1. - nearW));
      if (nearW > 0.) {
        vec3 wcol = mix(uPal[2], uPal[5], 0.5*(1. - smoothstep(0.10, 0.34, abs(dot(N, Vv)))));
        vec3 leafC = mix(uPal[1], uPal[0], heart);
        leafC = mix(uPal[1], uPal[0], heartW);
        float crW = (1. - smoothstep(-wW, wW, dW))*(1. - uBare);                          // the crown mirrored as separate lobed pads, each with ONE crisp dark rim
        wcol = mix(wcol, leafC, crW);
        wcol = mix(wcol, mix(uPal[0], uPal[1], heartW), crW*(1. - smoothstep(-wW, wW, dHrt)));   // ... with a heart of the other leaf colour
        wcol = mix(wcol, leafC*0.36, crW*smoothstep(-wW, wW, dW + max(0.3, 1.5*wW)));
        for (int k2 = 0; k2 < 3; k2++){                                                 // ... and three leaf cards let go beside it, turning a little on the water
          float ak = iW*2.4 + float(k2)*2.1 + 0.6; vec2 ql = (vW.xz - cW.xz) - cW.w*(0.62 + 0.15*float(k2))*vec2(cos(ak), sin(ak));
          if (dot(ql, ql) < 2.25 && uBare < 0.5) { float at = ak*1.7 + 0.25*sin(uTime*0.5 + ak), ca = cos(at), sa = sin(at), eL = clamp(0.6*px, 0.004, 0.2)/1.5;
            float lf = leafShape(vec2(ca*ql.x - sa*ql.y, sa*ql.x + ca*ql.y)/1.5);
            vec3 lc = (k2 == 1) ? mix(uPal[0], uPal[1], heartW) : leafC; lc = mix(mix(lc, uPal[2], 0.7), lc, smoothstep(0.06, 0.06 + 2.*eL, lf));
            wcol = mix(wcol, lc, smoothstep(0., 2.*eL, lf)); } }
        { float eL = clamp(0.25*px, 0.004, 0.2); vec3 lc = mix(uPal[1], uPal[0], lshA); wcol = mix(wcol, mix(mix(lc, uPal[2], 0.7), lc, smoothstep(0.06, 0.06 + 2.*eL, lshV)), lsh); }
        wcol = mix(wcol, LACQ, 0.8*tr);
        wcol = mix(wcol, mix(uPal[4], uPal[2], 0.25), step(0.25, mound)*(1. - smoothstep(-wM, wM, dM)));
        { vec3 koiC = (uKoiMode > 0.5 && uKoiMode < 1.5) ? uPal[0] : uPal[3], bigC = (uKoiMode > 1.5 && kWho < 0.5) ? mix(uPal[2], uPal[5], 0.55) : koiC;
          bigC = mix(bigC, uKoiMode < 0.5 ? uPal[1] : uKoiMode < 1.5 ? mix(uPal[0], uPal[1], 0.6) : bigC, 1. - smoothstep(-wSad, wSad, dSad));   // the saddle
          { float wfs = clamp(0.3*px, 0.004, 0.2); vec3 fryC = mix(koiC, uKoiMode < 0.5 ? uPal[1] : uKoiMode < 1.5 ? mix(uPal[0], uPal[1], 0.6) : koiC, 1. - smoothstep(-wfs, wfs, frySad)); wcol = mix(wcol, fryC, fry); }
          wcol = mix(wcol, bigC, kk); }
        { vec2 cell = floor(vDisc/11.), fc = vDisc - (cell + 0.5)*11.; float hc = hash1(cell), eR = clamp(0.6*px, 0.006, 0.2), hwR = max(0.05, 0.7*px);   // two or three thin crisp rings
          vec2 oc = (vec2(hash1(cell + 3.1), hash1(cell + 7.7)) - 0.5)*6.; float phr = fract(uTime*0.21 + hc*7.), rrr = 0.5 + phr*3.2;
          wcol = mix(wcol, uPal[4], step(0.3, hc)*step(phr, 0.8)*(1. - smoothstep(hwR - eR, hwR + eR, abs(length(fc - oc) - rrr)))); }
        { vec2 c2 = floor(vW.xz/5.), f2 = vW.xz - (c2 + 0.5)*5. - (vec2(hash1(c2 + 5.9), hash1(c2 + 2.3)) - 0.5)*2.4; float h2 = hash1(c2 + 11.3), p2 = fract(uTime*0.23 + h2*5.);   // rain-fine rings on the black water beside the slit
          float e2 = clamp(0.6*px, 0.004, 0.1), hw2 = max(0.025, 0.7*px);
          wcol = mix(wcol, mix(uPal[4], uPal[3], 0.3), step(0.9, h2)*step(p2, 0.7)*(1. - smoothstep(hw2 - e2, hw2 + e2, abs(length(f2) - 0.3 - 1.5*p2)))); }
        if (uIce >= 0.5) wcol = iceLaid(wcol, vDisc, 1e3, 1e3, px, iceP, vec3(iceW.x, 0., 0.));   // (the plate and its edge's width: taken at the head, above every branch; the width of a constant is nought)
        wcol = mix(wcol, uSlitCol, joint);                                                // the joint: one burning hairline on the water
        gcol = mix(gcol, wcol, nearW);
        float lwN = max(0.07, 0.8*wDist);                                                 // where pane meets water: one dark line
        gcol = mix(gcol, uPal[5]*0.3, (1. - smoothstep(lwN - wDist, lwN + wDist, abs(distB - uNearR)))*0.9);
      }
      float rb = 1. - smoothstep(-0.5*wr, 0.5*wr, rimD - max(mix(0.26, 0.08, nearW), 0.72*wr));       // one thin burning line per slit (each pane draws half of it)   // (round 9c: a line is a seam. No gold jamb on the panes that flank the slit: the same 0.08 m line as on every other pane)
      gcol = mix(gcol, uSlitCol, rb);
      if (vW.y < -0.02 && vW.y > -1.58) {                                           // ---- the wall of a slit
        // From afar it is lit from inside (the amber burning between the panes). CLOSE (the crossing) it is the black water of the
        // facet we pass, tilted toward us: jade-black, one burning seam edge above, the mirrored crown, a koi and a ripple ring
        // sliding along it, and below it the edge of the glass in lacquer-plum with one gold hairline. Never an amber slab.
        float nearS = 1. - smoothstep(30., 70., dist);
        vec3 farC = mix(gcol, uSlitCol, (1. - smoothstep(1.6, 2.2, rimD))*0.85);
        vec3 sk = mix(uPal[2], uPal[5], 0.25);
        float blob = 0., amb = 0., padIn = 0.;
        for (int i = 0; i < 6; i++){ vec2 qb = vec2((sx - uCrown[i].z*1.9)/(uCrown[i].w*1.5), (sy - 0.34)/0.27); float ab = dot(qb, qb) > 1e-6 ? atan(qb.y, qb.x) : 0.;
          float v = length(qb)/(0.84 + 0.16*cos(5.*ab + float(i)*1.9)); if (v < 1. && uCrown[i].w > 1.) { padIn = 1.; blob = 1. - smoothstep(0.80, 0.84, v); amb = (i == 1 || i == 4) ? 1. : 0.; } }
        vec3 padC = mix(uPal[1], uPal[0], amb);
        sk = mix(sk, mix(mix(padC, uPal[2], 0.7), padC, blob), padIn*(1. - uBare));   // a hard-edged pad with one dark rim
        float tick = 0., rip = 0.;
        for (int k = 0; k < 3; k++){ float fk = float(k), zk = mod(uKoiT*(22. + 9.*fk) + fk*37. + vInfo.w*50., 130.) - 10.;
          vec2 qk = vec2((sx - zk)/5.0, (sy - (0.2 + 0.2*fk))/0.07); tick = max(tick, 1. - smoothstep(0.92, 1., length(qk)));
          float phr = fract(uTime*0.19 + fk*0.37 + vInfo.w*3.), zr = fract(vInfo.w*7. + fk*0.41)*110.;
          rip = max(rip, step(phr, 0.8)*(1. - smoothstep(0.05, 0.08, abs(length(vec2((sx - zr)/6., (sy - 0.45)/0.3)) - 0.25 - phr)))); }
        sk = mix(sk, (uKoiMode > 0.5 && uKoiMode < 1.5) ? uPal[0] : uPal[3], 0.9*tick);
        sk = mix(sk, uPal[4], 0.6*rip*(1. - smoothstep(0.02, 0.06, wy)));
        if (uIce >= 0.5) sk = iceLaid(sk, vec2(sx, sy*22.), 1e3, 1e3, wx + 22.*wy, iceS, vec3(wIceS, 0., 0.));
        float glassE = smoothstep(0.80 - wy, 0.80 + wy, sy);                           // the edge of the pane below the water
        sk = mix(sk, uPal[5]*0.62, glassE);
        float hl = max(0.012, 0.8*wy);
        sk = mix(sk, uPal[6], (1. - smoothstep(hl - wy, hl + wy, abs(sy - 0.9)))*clamp(0.012/hl, 0.4, 1.)*(1. - smoothstep(0.03, 0.08, hl)));        // one gold hairline on the glass
        float se = max(0.035, 0.9*wy);
        sk = mix(sk, mix(uSlitCol, uPal[6], 0.5), (1. - smoothstep(se - wy, se + wy, sy - 0.02))*(1. - 0.85*smoothstep(0.08, 0.25, wy)));                    // the burning seam edge of the pond
        gcol = mix(farC, sk, nearS); }
      gl_FragColor = vec4(toScene(gcol), 1.); return;`}`})}function Le(t,e,o,h,r,p,l=!0){const c=e.length,s=[],i=new a.Vector3,m=new a.Vector3,y=new a.Vector3,k=new a.Vector3;for(let f=0;f<c;f++){i.subVectors(e[Math.min(f+1,c-1)],e[Math.max(f-1,0)]).normalize(),m.set(.13,.2,.97),Math.abs(i.dot(m.normalize()))>.9&&m.set(1,0,0),y.crossVectors(i,m).normalize(),k.crossVectors(i,y);const S=[];for(let A=0;A<h;A++){const X=A/h*Math.PI*2,L=Math.cos(X),V=Math.sin(X),_=y.x*L+k.x*V,q=y.y*L+k.y*V,J=y.z*L+k.z*V;S.push(t.v(e[f].x+_*o[f],e[f].y+q*o[f],e[f].z+J*o[f],_,q,J,r,p))}s.push(S)}for(let f=0;f<c-1;f++)for(let S=0;S<h;S++){const A=(S+1)%h;t.quad(s[f][S],s[f][A],s[f+1][A],s[f+1][S])}if(l){const f=e[c-1];i.subVectors(f,e[c-2]).normalize();const S=t.v(f.x+i.x*o[c-1],f.y+i.y*o[c-1],f.z+i.z*o[c-1],i.x,i.y,i.z,r,p);for(let A=0;A<h;A++)t.tri(s[c-1][A],s[c-1][(A+1)%h],S)}}function ha(t,e){const o=ze(),h=(u,M,N)=>new a.Vector3(u,M,N),r=t.range(-.5,.9),p=t.range(25,29),l=h(t.range(-5,-2),0,t.range(-1,4)),c=h(Math.cos(r),0,Math.sin(r));{const M=o.v(l.x,1.5,l.z,0,1,0,4,.5),N=[],F=[];for(let z=0;z<8;z++){const n=z/8*Math.PI*2+.3,v=.85+.3*t();N.push(o.v(l.x+Math.cos(n)*7.5*.55*v,1.05,l.z+Math.sin(n)*7.5*.55*v,Math.cos(n)*.4,.9,Math.sin(n)*.4,4,.5)),F.push(o.v(l.x+Math.cos(n)*7.5*v,-.3,l.z+Math.sin(n)*7.5*v,Math.cos(n)*.85,.5,Math.sin(n)*.85,4,.5))}for(let z=0;z<8;z++){const n=(z+1)%8;o.tri(M,N[n],N[z]),o.quad(N[z],N[n],F[n],F[z])}}const s=[],i=[];for(let u=0;u<=6;u++){const M=u/6,N=.6+M*p*.62,F=Math.sin(M*3)*2.2;s.push(h(l.x+c.x*(M*M*9)-c.z*F,N,l.z+c.z*(M*M*9)+c.x*F)),i.push(me(1.75,.8,Math.sqrt(M))*(u===0?1.5:1))}Le(o,s,i,6,2,1,!1);const m=5,y=[],k=[];for(let u=0;u<m;u++){const M=.42+.58*(u/(m-1)),N=Math.min(5,Math.floor(M*6)),F=M*6-N,z=s[N].clone().lerp(s[Math.min(6,N+1)],F),n=r+(u===m-1?.1:(u%2?1:-1)*t.range(.5,1.5)+(u===0?2.6:0)),v=u===m-1?t.range(10,13):t.range(15,23),g=h(Math.cos(n),0,Math.sin(n)),C=t.range(.35,.75)+(u===m-1?.6:0),j=[],Y=[],H=me(.85,.5,u/m);for(let Q=0;Q<=4;Q++){const ae=Q/4,fe=Math.sin(ae*2.4+u)*1.6;j.push(h(z.x+g.x*v*ae-g.z*fe,z.y+v*(C*ae-.42*ae*ae),z.z+g.z*v*ae+g.x*fe)),Y.push(me(H,.16,ae))}Le(o,j,Y,4,2,1,!0),y.push(j[4].clone());for(let Q=1;Q<=4;Q++)k.push({p:j[Q],r:me(3.2,6.2,Q/4),w:Q})}k.push({p:s[6],r:5.5,w:4});const f={ang:r,R:32.8,y:13};{const u=s[4].clone(),M=h(Math.cos(r)*f.R,f.y,Math.sin(r)*f.R),N=[],F=[];for(let z=0;z<=5;z++){const n=z/5,v=u.clone().lerp(M,n);v.y+=3*Math.sin(n*Math.PI)*(1-.5*n);const g=1.4*Math.sin(n*5.2);v.x+=-Math.sin(r)*g,v.z+=Math.cos(r)*g,N.push(v),F.push(me(.3,.09,n))}N[5].copy(M),Le(o,N,F,3,2,1,!0),k.push({p:N[2],r:3.3,w:3.5},{p:N[3],r:2.9,w:3.5},{p:N[4],r:2.3,w:3.5})}const S=[],A=k.filter((u,M)=>u.w>=2&&(M%2===0||u.w===4||u.w===3.5));for(const u of A){const M=u.r*t.range(.95,1.3),N=t()<.3?0:1,F=t()*6.283,z=t.range(-.18,.18),n=t.range(-.18,.18),v=5,g=o.v(u.p.x,u.p.y+M*.46,u.p.z,0,1,0,N,.9),C=[];for(let j=0;j<v*2;j++){const Y=F+j/(v*2)*Math.PI*2,H=M*(j%2?.56:t.range(.9,1.2)),Q=Math.cos(Y)*H,ae=Math.sin(Y)*H;C.push(o.v(u.p.x+Q,u.p.y+Q*z+ae*n+(j%2?M*.12:-M*.2),u.p.z+ae,Math.cos(Y)*.75,.66,Math.sin(Y)*.75,N,.6))}for(let j=0;j<v*2;j++)o.tri(g,C[(j+1)%(v*2)],C[j]);S.push([g,o.P.length/3,u.p.x,u.p.y+M*.2,u.p.z,M*1.2])}const X=o.I.length;{const u=s[4],M=h(Math.cos(r)*f.R,f.y,Math.sin(r)*f.R);[.46,.63,.8,.95].forEach((N,F)=>{const z=u.clone().lerp(M,N);z.y+=3*Math.sin(N*Math.PI)*(1-.5*N)+.9;const n=F%2?1:-1;z.x+=-Math.sin(r)*n*1.3,z.z+=Math.cos(r)*n*1.3;const v=2.3-.35*F,g=F%2,C=.7+F*1.3,j=o.v(z.x,z.y+v*.4,z.z,0,1,0,g,.9),Y=[];for(let H=0;H<10;H++){const Q=C+H/10*Math.PI*2,ae=v*(H%2?.56:1.05),fe=Math.cos(Q)*ae,We=Math.sin(Q)*ae;Y.push(o.v(z.x+fe,z.y+(H%2?v*.12:-v*.2),z.z+We,Math.cos(Q)*.75,.66,Math.sin(Q)*.75,g,.6))}for(let H=0;H<10;H++)o.tri(j,Y[(H+1)%10],Y[H]);S.push([j,o.P.length/3,z.x,z.y,z.z,-v])})}const L=o.build();{const u=new Float32Array(o.P.length/3*4);for(const[M,N,F,z,n,v]of S)for(let g=M;g<N;g++)u.set([F,z,n,v],g*4);L.setAttribute("aPad",new a.BufferAttribute(u,4))}const V=Math.round(64*e),_=Math.round(12*e),q=V+_,J=new Float32Array(q*12),he=new Float32Array(q*12),de=new Float32Array(q*16),Ce=new Float32Array(q*8),Ie=[],Se=k.reduce((u,M)=>u+M.w,0),te=new a.Vector3;for(let u=0;u<q;u++){let M,N,F,z,n=t(),v=t()<.3?0:1;if(u<V){let g=t()*Se,C=k[0];for(const Y of k)if(g-=Y.w,g<=0){C=Y;break}te.set(t.gauss(),t.gauss()*.6+.25,t.gauss()).normalize();const j=C.r*Math.cbrt(t());M=C.p.x+te.x*j,N=Math.max(2,C.p.y+te.y*j*.7),F=C.p.z+te.z*j,z=t.range(.85,1.4),te.y=Math.abs(te.y)+.45,te.normalize()}else{const g=t()*6.283,C=t.range(8,46);M=Math.cos(g)*C,N=.06,F=Math.sin(g)*C,z=t.range(1,1.7),n+=2,te.set(.02,1,.02).normalize()}for(let g=0;g<4;g++)J.set([M,N,F],u*12+g*3),he.set([te.x,te.y,te.z],u*12+g*3),de.set([g===0||g===3?-1:1,g<2?-1:1,z,n],u*16+g*4),Ce.set([v,.9],u*8+g*2);Ie.push(u*4,u*4+1,u*4+2,u*4,u*4+2,u*4+3)}const ce=new a.BufferGeometry;ce.setAttribute("position",new a.BufferAttribute(J,3)),ce.setAttribute("normal",new a.BufferAttribute(he,3)),ce.setAttribute("aCard",new a.BufferAttribute(de,4)),ce.setAttribute("aInk",new a.BufferAttribute(Ce,2)),ce.setIndex(Ie);const we=y.map((u,M)=>new a.Vector4(u.x,u.y-.5,u.z,5.2+M%2));for(we.push(new a.Vector4(s[6].x,s[6].y+1,s[6].z,6));we.length<6;)we.push(new a.Vector4(0,-99,0,.1));return{trunkGeo:L,leafGeo:ce,crown:we.slice(0,6),tips:y,top:s[6].clone(),foot:s[0].clone(),H:p,reach:f,coreIndex:X}}const $t=`
#ifndef U_PETAL
#define U_PETAL
  uniform float uPetal;
#endif
  float gustAt(vec3 q){ float g = fract(uTime/7.), front = mix(-40., 60., g); float d = (q.x - front)/9.; return exp(-d*d); }
  vec3 treeSway(vec3 q){ float h = clamp(q.y/28., 0., 1.); float s = h*h*(0.25*sin(uTime*0.8 + q.x*0.1) + 1.1*gustAt(q));
    float rr = max(length(q.xz - vec2(-3.5, 1.5)) - 8., 0.), droop = uPetal*min(0.0045*rr*rr, 0.22*max(q.y, 0.));   // the weeping cherry: the further out along a bough, the lower it hangs
    return q + vec3(s, -droop, 0.35*s); }`,yt=`
#ifndef U_PETAL
#define U_PETAL
  uniform float uPetal;
#endif
  float leafShape(vec2 uv){
    if (uPetal > 0.5) { vec2 q = vec2(uv.x, uv.y + 0.04); float e = 1. - length(q/vec2(0.7, 0.94)), notch = length(q - vec2(0., 1.0)) - 0.27, wedge = 0.62*(0.8*(q.y + 1.0) - abs(q.x)); return min(min(0.6*e, wedge), notch); }   // a cherry petal: a rounded card with one notch at its tip
    float r = length(uv); if (r < 0.08) return 1.;
    float yy = uv.y + 0.25; if (abs(uv.x) + abs(yy) < 1e-4) return 1.;
    float a = atan(uv.x, yy), aa = abs(a);
    float R = 0.20 + 0.80*exp(-aa*5.5) + 0.70*exp(-abs(aa - 0.75)*5.5) + 0.52*exp(-abs(aa - 1.5)*5.5) + 0.30*exp(-abs(aa - 2.2)*5.5);
    float stem = (1. - step(0.045, abs(uv.x)))*step(uv.y, -0.2)*step(-0.95, uv.y);
    return max(R - length(vec2(uv.x, uv.y + 0.25)), stem > 0.5 ? 0.06 : -1.);
  }`;function da(t){return Pe(t,{nearCut:13,vertDecl:`attribute vec4 aCard; varying vec2 vUv; ${$t}`,vertMove:`
      vec3 nn = normalize(n), tt = cross(nn, vec3(0.31, 0.2, 0.93)); tt = tt/max(length(tt), 1e-3); vec3 bb = cross(nn, tt);
      float sd = aCard.w, isTree = step(sd, 1.5), s1 = fract(sd); if ((iClip.w < -1.5 || iClip.w > 1.5) && isTree > 0.5) alive = 0.;
      float fl = isTree*(0.38*sin(uTime*(1.0 + s1) + s1*40.) + 1.0*gustAt(p)*sin(uTime*6. + s1*20.));
      vec3 t2 = tt*cos(fl) + nn*sin(fl); n = nn*cos(fl) - tt*sin(fl);
      float spin = (1. - isTree)*(uTime*0.05*(s1 - 0.5) + s1*6.3), cs = cos(spin), sn = sin(spin);
      vec2 cuv = vec2(cs*aCard.x - sn*aCard.y, sn*aCard.x + cs*aCard.y);
      p = mix(p, treeSway(p), isTree) + (t2*cuv.x + bb*cuv.y)*aCard.z;
      vUv = aCard.xy;`,fragDecl:`varying vec2 vUv; ${yt}`,fragColor:`
      float lf = leafShape(vUv); if (lf < 0.) cut = true;                           // (the leaf's outline: decided here, made by the factory after the last width: the rim's fwidth below would not be defined after a discard)
      gloss *= 1. - smoothstep(0.13, 0.2, length(vUv - vec2(0.16, 0.22)));          // a card's highlight is a spot, never the whole leaf
      float wl = fwidth(lf) + 1e-4; base = mix(mix(base, uPal[2], 0.7), base, smoothstep(-wl, wl, lf - max(0.07, 1.5*wl)*step(wl, 0.05)));`})}function fa(t){const e=ze(),o=6,h=[],r=[],p=[];for(let s=0;s<o;s++){const i=s/o*Math.PI*2,m=.82+.36*t(),y=Math.cos(i),k=Math.sin(i);h.push([y*m,-.25,k*m]),r.push([y*m*.86,.5+.12*t(),k*m*.86]),p.push([y*m*.5,.78+.1*t(),k*m*.5])}const l=(s,i,m,y,k)=>{const f=e.v(...s,0,1,0,y,k),S=e.v(...i,0,1,0,y,k),A=e.v(...m,0,1,0,y,k);e.tri(f,S,A)};for(let s=0;s<o;s++){const i=(s+1)%o;l(h[s],r[i],h[i],3,.6),l(h[s],r[s],r[i],s%2?4:3,.6),l(r[s],p[i],r[i],4,.5),l(r[s],p[s],p[i],4,.5),l(p[s],[0,.9,0],p[i],4,.5)}const c=e.build();return c.computeVertexNormals(),c}function ua(t){const e=ze(),o=7;for(let h=0;h<o;h++){const r=t()*6.283,p=t.range(.05,.3),l=t.range(.7,1.15),c=t.range(.05,.075),s=t.range(.1,.45),i=Math.cos(r),m=Math.sin(r),y=[];for(let f=0;f<=2;f++){const S=f/2.6,A=l*S,X=p+s*S*S,L=c*(1-S*.55);y.push([e.v(i*X-m*L,A,m*X+i*L,i,.25,m,4,.9),e.v(i*X+m*L,A,m*X-i*L,i,.25,m,4,.9)])}for(let f=0;f<2;f++)e.quad(y[f][0],y[f][1],y[f+1][1],y[f+1][0]);const k=e.v(i*(p+s*1.05),l,m*(p+s*1.05),i,.25,m,4,.9);e.tri(y[2][0],y[2][1],k)}return e.build()}function pa(){const t=ze(),e=5,o=[3.4,2.6,1,-1,-2.5],h=[.16,.62,.86,.6,.2],r=[];for(let l=0;l<o.length;l++){const c=[];for(let s=0;s<e;s++){const i=s/e*Math.PI*2+Math.PI/2,m=Math.cos(i),y=Math.sin(i);c.push(t.v(o[l],y*h[l]*.92,m*h[l]*.8,0,y,m,3,1))}r.push(c)}for(let l=0;l<o.length-1;l++)for(let c=0;c<e;c++){const s=(c+1)%e;t.quad(r[l][c],r[l][s],r[l+1][s],r[l+1][c])}const p=(l,c,s,i)=>t.tri(t.v(...l,...i,3,1),t.v(...c,...i,3,1),t.v(...s,...i,3,1));return p([-2.4,.1,0],[-3.6,.95,0],[-3.1,.1,0],[0,.3,1]),p([-2.4,.1,0],[-3.1,.1,0],[-3.6,-.6,0],[0,.3,1]),p([1.2,.75,0],[-.9,.6,0],[-.3,1.2,0],[0,.3,1]),p([1.7,.1,.6],[.9,.2,1.7],[.8,.1,.6],[0,1,0]),p([1.7,.1,-.6],[.8,.1,-.6],[.9,.2,-1.7],[0,1,0]),t.build()}const Me={a:31,b:13,speed:.105,n:4},Ut=`
  vec2 koiAt(float k, float tau, out vec2 tang){
    float ph = k*2.3, c = cos(ph), s = sin(ph), a = ${Me.a.toFixed(1)} - 4.*k, b = ${Me.b.toFixed(1)} + 2.*k;
    vec2 q = vec2(a*sin(tau), b*sin(2.*tau)), d = vec2(a*cos(tau), 2.*b*cos(2.*tau));
    vec2 o = vec2(6. - 5.*k, -4. + 6.*k);
    float cy = cos(uKoiYaw), sy = sin(uKoiYaw);
    vec2 t0 = vec2(c*d.x - s*d.y, s*d.x + c*d.y), p0 = o + vec2(c*q.x - s*q.y, s*q.x + c*q.y);
    tang = vec2(cy*t0.x - sy*t0.y, sy*t0.x + cy*t0.y);
    return vec2(cy*p0.x - sy*p0.y, sy*p0.x + cy*p0.y);
  }`;function ma(t,e,o=0){const h=t*2.3,r=Math.cos(h),p=Math.sin(h),l=Me.a-4*t,c=Me.b+2*t,s=l*Math.sin(e),i=c*Math.sin(2*e),m=6-5*t+r*s-p*i,y=-4+6*t+p*s+r*i,k=Math.cos(o),f=Math.sin(o);return[k*m-f*y,f*m+k*y]}function va(t){return Pe(t,{vertDecl:"uniform float uKoiT, uKoiYaw;"+Ut,vertMove:`
      float k = iInfo.y, tau = uKoiT + k*2.1;
      vec2 tg0; koiAt(k, tau, tg0); float spd = max(length(tg0), 1.);
      float ks = iInfo.z > 0.5 ? 1.55 : 1.;                             // in the Globe the koi are seen from across the hollow: a lattice of ivory, not ticks
      vec2 tg; vec2 c = koiAt(k, tau + position.x*1.25*ks/spd, tg); tg = tg/max(length(tg), 1e-3);
      vec2 sd = vec2(-tg.y, tg.x);
      float wig = sin(uTime*2.6 - position.x*0.8 + k*1.7)*0.34*smoothstep(2.5, -3.5, position.x);
      float lat = position.z + wig;
      p = vec3(c.x + sd.x*lat*1.25*ks, position.y*1.1*ks + 0.3, c.y + sd.y*lat*1.25*ks);
      n = vec3(tg.x*normal.x + sd.x*normal.z, normal.y, tg.y*normal.x + sd.y*normal.z);`,fragColor:`
      float sdl = fract(vInfo.y*0.37 + 0.2)*2.4 - 0.9;
      if (uKoiMode < 0.5) { if (vP.y > 0.12 && abs(vP.x - sdl) < 0.95 + 0.25*sin(vP.z*5.)) base = uPal[1]; if (vP.x > 2.9) base = mix(base, uPal[0], 0.6); }
      else if (uKoiMode < 1.5) { base = uPal[0]; if (vP.y > 0.12 && abs(vP.x - sdl) < 0.95) base = mix(uPal[0], uPal[6], 0.6); }
      else if (vInfo.y < 0.5) base = uPal[2];
      base = mix(base, uPal[2], 0.45*uIce);`})}function _t(t,e,o,h){const{ax:r,bz:p,hn:l,hd:c,pivot:s}=U;return i=>{const m=Math.cos(i),y=Math.sin(i),k=e.value;let f=0;for(let S=0;S<t.length&&f<k.length;S++){const A=t[S],X=s[0]+m*A.x-y*A.z,L=s[1]+y*A.x+m*A.z,V=o*A.s;if(X>-V&&L>-V&&X<r+V&&L<p+V&&c-l[0]*X-l[1]*L>-V){let _=1;if(h){const q=Math.max(h[0]-X,0,X-h[1]),J=Math.max(Math.abs(L-h[2])-h[3],0);_=ta(A.s*.9,A.s*.9+4,Math.hypot(q,J))}_>.02&&k[f++].set(A.x,A.z,A.yaw,A.s*_)}}for(;f<k.length;f++)k[f].w=0}}const Fe={rIn:7.5,rOut:10.4,depth:2.6},wa=`
  { float gr = length(vP.xy), ga = atan(vP.y, max(vP.x, 1e-4));
    float wd = fwidth(ga)*gr + fwidth(gr) + fwidth(vP.z) + 1e-4;                     // metres per pixel on the stone
    // (EVERY DERIVATIVE OF THE STONES IS TAKEN HERE, above their branch: the line gr = 7.53 runs along the inner chamfer of every stone, so a
    // block of four pixels can lie half inside the branch, and a derivative taken in there of a value that only the branch computes is not
    // defined. What the derivatives are taken of, t, gr and the relief hgt with all it is made of, is computed on every pixel: the same
    // expressions as before, moved up; the branch uses the results.)
    float t = clamp((ga - 0.012)/1.5468, 0., 1.)*8., bi = floor(t), ft = t - bi, hs = fract(sin(bi*12.9898 + 4.1)*43758.5453), hs2 = fract(hs*7.13 + 0.31);
    float front = step(1.02, abs(vP.z));                                             // the ring's two faces (else its outer and inner bands)
    float dj = min(ft, 1. - ft)*gr*0.19335;                                          // metres to the nearest joint ...
    float de = min(dj, max(mix(1.28 - abs(vP.z), min(gr - 7.5, ${10.4.toFixed(1)} - gr), front), 0.));   // ... and to the nearest edge of this face of the voussoir
    // the moss: scalloped cushions hanging from the crown of each stone and spilling down the joints
    float wc = fwidth(gr) + 1e-4, lob = 0.3*abs(sin(ga*27. + hs*6.)), spill = step(0.3, hs2)*(0.3 + 0.9*hs2)*exp(-dj*dj/0.1);
    float cap = ${10.4.toFixed(1)} - (0.2 + 0.7*hs*hs) - lob - spill;
    float mo = max(smoothstep(-wc, wc, gr - cap)*front, (1. - front)*step(8.5, gr)*step(0.3, hs2)*(1. - smoothstep(0.3, 0.3 + wd, dj)));
    float wj = fwidth(t) + 1e-4;
    float fv = clamp(mix((vP.z + 1.3)/2.6, (gr - 7.5)/2.9, front), 0., 1.);
    float hgt = (0.34*smoothstep(0., 0.6, de) + 0.5*sin(ft*3.14159)*sin(fv*3.14159))*(1. - mo);
    vec3 dpx = dFdx(vV), dpy = dFdy(vV); float hx = dFdx(hgt), hy = dFdy(hgt);
    if (vInk.x > 2.5 && vInk.x < 3.5 && gr > ${(7.5+.03).toFixed(2)}) {
      float nearK = 1. - smoothstep(0.05, 0.14, wd);
      base = mix(uPal[3], uPal[5], 0.07 + 0.13*hs);                                  // each stone its own grey of ivory
      base = mix(base, mix(base, uPal[5], 0.17), smoothstep(-wd, wd, de - 0.46)*nearK);          // the dressed panel, a step darker ...
      base = mix(base, mix(base, uPal[2], 0.42), (1. - smoothstep(-wd, wd, de - 0.15))*nearK);   // ... and the dark glossy rim round every voussoir
      { vec2 lc = vec2(t*5., mix(vP.z, gr, front)*1.4), ci = floor(lc); float lh = fract(sin(dot(ci, vec2(127.1, 311.7)))*43758.5453);
        vec2 lf = lc - ci - 0.5 - 0.5*(vec2(fract(lh*29.3), fract(lh*13.7)) - 0.5);
        float lr = 0.1 + 0.16*fract(lh*5.3); base = mix(base, mix(uPal[4], uPal[3], 0.25), step(0.8, lh)*(1. - smoothstep(lr, lr + 2.*wd, length(lf*vec2(1., 0.7 + 0.6*fract(lh*3.1)))))*nearK); }   // lichen
      vec3 moss = mix(uPal[4], mix(uPal[4], uPal[2], 0.34), step(0.5, fract(ga*27./6.2832 + hs*0.95)));   // (the moss: its cap, cover mo and width wc stand above the branch)
      moss = mix(moss, mix(uPal[4], uPal[2], 0.6), (1. - smoothstep(0.06, 0.06 + wc, abs(gr - cap)))*front*nearK);
      base = mix(base, moss, mo);
      float hw = max(0.04, 0.8*wj);
      base = mix(base, uPal[2], 0.85*(1. - smoothstep(hw - 0.5*wj, hw + 0.5*wj, min(ft, 1. - ft)))*(1. - smoothstep(0.2, 0.45, wj)));   // dark joints
      if (bi > 6.5) base = mix(base, uPal[6], (1. - smoothstep(0.5*wj, 1.5*wj + 0.006, 1. - ft))*(1. - smoothstep(0.2, 0.45, wj)));     // the hair of seam gold where the quarter meets its twin
      // every voussoir is a pillow of enamel: its shoulders turn the light, so one hard highlight slides round each as we pass
      { vec2 q = vec2(ga*gr, mix(vP.z, gr, front))*0.6 + vec2(0.4*sin(uTime*0.45) + uTime*0.05, 0.3*sin(uTime*0.33 + 1.));   // the crown's shadow dappling the stone, stirring with the breeze
        vec2 qi = floor(q); float qh = fract(sin(dot(qi, vec2(41.3, 289.1)))*43758.5453);
        vec2 qf = q - qi - 0.5 - 0.3*(vec2(qh, fract(qh*17.)) - 0.5);
        float dap = step(0.45, qh)*(1. - smoothstep(0.3, 0.3 + 1.5*wd, length(qf)*(1. + 0.12*sin(uTime*0.9 + qh*40.))));
        base = mix(base, mix(base, uPal[2], 0.3), dap*nearK); }
      { vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);     // (the relief hgt and its four derivatives: above the branch)
        vec3 gN = N + (hx*r1 + hy*r2)*(det < 0. ? -1. : 1.)/max(abs(det), 1e-7)*nearK;
        N = gN/max(length(gN), 1e-4); gloss = mix(gloss, 0.95, nearK*(1. - mo)); }
    } else if (vInk.x > 3.5 && vInk.x < 4.5 && gr > ${(7.5+.03).toFixed(2)}) {  // the mossed crown: cushions with dark seams between them
      vec2 mc = vec2(ga*gr, vP.z)*0.95, ci = floor(mc); float mh = fract(sin(dot(ci, vec2(269.5, 183.3)))*43758.5453);
      vec2 mf = mc - ci - 0.5 - 0.24*(vec2(mh, fract(mh*9.3)) - 0.5); float md2 = length(mf), nearK = 1. - smoothstep(0.08, 0.2, wd);
      base = mix(uPal[4], mix(uPal[4], uPal[2], 0.3), step(0.5, mh)*nearK);
      base = mix(base, mix(uPal[4], uPal[2], 0.62), smoothstep(0.43, 0.43 + 2.*wd, md2)*nearK);
      gloss = mix(gloss, 0.9*(1. - smoothstep(0.1, 0.16, md2)), nearK);
    } }`;function xa(t){const e=ze(),o=8,h=.012,r=Math.PI/2-.012,p=(i,m,y,k,f,S)=>{const X=[[y+.22,-f],[k-.22,-f],[k,-f+.22],[k,f-.22],[k-.22,f],[y+.22,f],[y,f-.22],[y,-f+.22]],L=[],V=[];for(const[q,J]of X)L.push([q*Math.cos(i),q*Math.sin(i),J]),V.push([q*Math.cos(m),q*Math.sin(m),J]);const _=(q,J,he,de)=>{e.tri(e.v(...q,0,0,1,de,.55),e.v(...J,0,0,1,de,.55),e.v(...he,0,0,1,de,.55))};for(let q=0;q<8;q++){const J=(q+1)%8,he=S&&(q===2||q===1||q===3)?4:3;_(L[q],L[J],V[J],he),_(L[q],V[J],V[q],he)}for(let q=1;q<7;q++)_(L[0],L[q+1],L[q],3),_(V[0],V[q],V[q+1],3)};for(let i=0;i<o;i++){const m=me(h,r,i/o)+.006,y=me(h,r,(i+1)/o)-.006,k=i===0||i===o-1;p(m,y,Fe.rIn-(k?.12:0),Fe.rOut+(k?.55:t.range(-.12,.2)),Fe.depth/2+(k?.3:t.range(-.08,.1)),t()<.62)}for(let i=0;i<10;i++)p(me(h,r,i/10),me(h,r,(i+1)/10),Fe.rIn-.28,Fe.rIn-.02,.5,!1);const l=e.build();l.computeVertexNormals();const c=l.getAttribute("aInk"),s=l.getAttribute("position");for(let i=0;i<c.count;i++)Math.hypot(s.getX(i),s.getY(i))<Fe.rIn+.05&&Math.abs(s.getZ(i))<.51&&c.setXY(i,2,1);return l}function ga(t,e){return new a.ShaderMaterial({side:a.DoubleSide,uniforms:{...t,...e},vertexShader:`
      uniform float uTime; uniform mat4 uShell, uGate; uniform vec3 uKey; uniform float uProgress; uniform vec4 uShellEye;
      attribute vec3 aStart; attribute vec4 aPar;    // phase, seed, mode (0 drizzle, 1 wreath), ink
      attribute float aGen;
      varying vec3 vW, vN, vV, vL, vApex, vInset; varying vec4 vInfo; varying vec2 vUv; varying float vInk, vFade;
      void main(){
        float ph = aPar.x, sd = aPar.y; vec3 c; float size = 0.8 + 0.6*sd; vFade = 1.;
        float ang = sd*6.2832 + uTime*0.16;
        if (aPar.z < 0.5 || aPar.z > 1.5) {
          float nearS = step(2.5, aPar.z);                                  // mode 3: a NEAR string, strung beside the last straight (its start is given in the piece's own space and does not roll with the shell)
          vec3 s0 = nearS > 0.5 ? aStart : (uShell*vec4(aStart, 1.)).xyz;
          float s = fract(uTime*0.021 + ph); float e = mix(s, s*s*(3. - 2.*s), 0.25);   // evenly strung: a line of separate cards, not a cloud at its ends
          vec3 ctr = (uGate*vec4(0., 0., 0., 1.)).xyz;
          vec3 rad = s0 - ctr; vec3 ax = (uGate*vec4(0., 0., 1., 0.)).xyz; float gs = max(length(ax), 1e-3); ax /= gs;
          vec3 rp = rad - ax*dot(rad, ax); float rl = length(rp); vec3 e1 = rl > 1e-3 ? rp/rl : vec3(1., 0., 0.), e2 = cross(ax, e1);
          float sw = 0.9 + 0.5*fract(sd*7.31);          // each line slants round the axis and never crosses the opening
          vec3 end = ctr + (e1*cos(sw) + e2*sin(sw))*13.5*gs + ax*(-1. + 3.*fract(sd*3.7));
          vec3 mid = ctr + rad*0.5 + e2*rl*0.13 + e1*4.;   // (round 10: a line for each garden: each a gentle slant, so they read as lines converging on the Gate, not as a whirl)
          if (nearS > 0.5) { end = ctr + e1*12.6*gs - ax; mid = 0.5*(s0 + end) + e2*1.5; }   // straight to the ring's rim, outside the stones: it converges on the Gate as the straight does
          c = mix(mix(s0, mid, e), mix(mid, end, e), e);
          c += vec3(sin(uTime*0.9 + ph*50.), sin(uTime*0.7 + ph*31.), cos(uTime*0.8 + ph*17.))*0.5*sin(s*3.1416);
          vFade = smoothstep(0., 0.03, s)*(1. - smoothstep(0.95, 1., s));
          vFade *= smoothstep(5., 12., length(cameraPosition - (modelMatrix*vec4(c, 1.)).xyz));
          { vec3 toC = (modelMatrix*vec4(c, 1.)).xyz - cameraPosition, toG = (modelMatrix*vec4(ctr, 1.)).xyz - cameraPosition; float dG = max(length(toG), 1e-3), al = dot(toC, toG)/dG, pe = length(toC - toG/dG*al);
            vFade *= max(step(dG + 3., al), smoothstep(11.0*gs/dG*max(al, 0.), 13.2*gs/dG*max(al, 0.) + 1e-3, pe)); }   // (round 10: the cone kept clear is the whole ring, stones and all: the lines end ON the rim and none lies across the Gate)   // (review 7: the opening's cone is kept clear of the drizzle and the strings; they end on the rim)   // (review 6: a card of the drizzle never passes against the lens as a slab: it draws in as it comes within twelve metres)
          size *= mix(1.3, 0.8, nearS);   // (round 10b: THE ONE RULE OF SIZE. A line's card has its own size in metres, as every leaf card has: 0.8 to 1.4 by its seed, 1.3 times that on a line and 0.8 times on a near string, the same at any distance from the lens)
          vInfo = vec4(min(max(length((modelMatrix*vec4(c, 1.)).xyz - uShellEye.xyz) - 64., 0.)*uShellEye.w*(1. - 0.5*e), 2.6)*(1. - nearS), 0., 0., sd);   // (round 10: a line across the hollow is as many reflections down as the wall it leaves, up to 2.6: near lines bright, far lines crimson)   // counted from the lens: the strings stay bright against the plum side
        } else {
          float r = 12.2 + 2.6*fract(sd*5.3) + 0.5*sin(uTime*0.5 + sd*30.);
          float a = ph*6.2832 + uTime*0.16;
          // (review 6) uProgress 0..0.5: the wreath comes in onto the RIM and turns there, its leaves over the stones and the opening's outer
          // edge, the middle clear; 0.5..1 (the last second): it closes across the opening and we go through with it
          float pr = clamp(uProgress*3. - fract(sd*9.1)*0.5, 0., 1.); pr = pr*pr*(3. - 2.*pr);
          float pc = clamp((uProgress - 0.5)*3. - fract(sd*4.7)*0.5, 0., 1.); pc = pc*pc*(3. - 2.*pc);
          r = mix(r, 7.3 + 2.9*fract(sd*5.3), pr); r = mix(r, 0.8 + 6.0*fract(sd*5.3), pc);
          c = (uGate*vec4(r*cos(a), r*sin(a), mix((fract(sd*3.7) - 0.5)*3.4, -0.7 - 2.6*fract(sd*2.3), pr), 1.)).xyz;
          vInfo = vec4(0., 0., 0., sd);
        }
        float sp = uTime*(0.9 + sd) + sd*40. + ph*23.;
        vec3 nn = normalize(vec3(sin(sp)*cos(sp*0.37), cos(sp), sin(sp)*sin(sp*0.37)) + vec3(0., 0.15, 0.));
        vec3 tt = cross(nn, vec3(0.31, 0.2, 0.93)); tt = tt/max(length(tt), 1e-3); vec3 bb = cross(nn, tt);
        if (aPar.z > 1.5 && aPar.z < 2.5) vFade = 0.;
        vec4 wp = modelMatrix*vec4(c + (tt*position.x + bb*position.y)*size*vFade, 1.);
        vec3 n = mat3(modelMatrix)*nn; vN = n/max(length(n), 1e-5);
        vec3 l = mat3(modelMatrix)*mat3(uGate)*uKey; vL = l/max(length(l), 1e-5);
        vV = cameraPosition - wp.xyz; vW = vec3(0.); vApex = vec3(0.); vInset = vec3(0.);
        vUv = position.xy; vInk = aPar.w;
        gl_Position = projectionMatrix*viewMatrix*wp;
      }`,fragmentShader:`
      ${Ft}
      ${yt}
      varying vec2 vUv; varying float vInk, vFade;
      void main(){
        float lf = leafShape(vUv); if (uBare > 0.5) lf = 0.55 - length(vUv); bool cut = lf < 0. || vFade < 0.02;   // (decided here, made after enamel: a width taken after a discard is not defined, and the rim of every card came out different on each draw)
        vec3 base = uBare > 0.5 ? uPal[3] : uPal[int(vInk + 0.5)]; float wl = fwidth(lf) + 1e-4;
        base = mix(mix(base, uPal[2], 0.7), base, smoothstep(-wl, wl, lf - max(0.07, 1.5*wl)*step(wl, 0.05)));
        vec3 lit = enamel(base, vN/max(length(vN), 1e-4), 0.9);
        if (cut) discard;
        gl_FragColor = finish(lit);
      }`})}async function ba(t,e={}){const o=t.rng,h=De(e.detail??t.quality?.detail??1,.6,1),r=e.uniforms||ia(e.palette||Ye),p=new a.Group;p.name="garden-of-sixty-gardens:globe";const{copies:l,apex:c,tongue:s}=la(o);if(r.uApex.value.copy(c),e.lateFacet){const d=new a.Vector3(-.62,.05,-.78).normalize().multiplyScalar(ve.R),x=new a.Vector3,I=l.filter(b=>b.shell>.5).map(b=>({c:b,d:x.set(34,0,17).applyMatrix4(b.matrix).distanceTo(d)})).sort((b,w)=>b.d-w.d);I[0].c.seed+=2,I[1].c.seed+=2}const i=e.shellAxis?e.shellAxis.clone().normalize():s.head.clone(),m=o()*6.283,y=o.range(-.25,.25),k=e.turnRate??1.2*Math.PI/180,f=e.shellRate??.011;await t.yield();const S={uMirrorN:{value:6},uTrunk:{value:new a.Vector4(0,0,0,0)},uRing:{value:new a.Vector4(0,0,0,0)},uCrown:{value:[]},uKoiW:{value:[new a.Vector3,new a.Vector3,new a.Vector3,new a.Vector3]}},A=Ot(r,S,0),X=re(Ht(),A,l);p.add(X);const L=re(Ht(),Ot(r,S,1),l);L.renderOrder=5,p.add(L),await t.yield();const V=ha(o,h);S.uCrown.value=V.crown.map(d=>d.clone()),r.uKoiYaw.value=V.reach.ang;const _=Pe(r,{vertDecl:$t+"attribute vec4 aPad; uniform float uPadCut, uClearFar, uBare; uniform vec4 uClear; varying float vKeep;",fragDecl:"varying float vKeep;",keepIf:"vKeep > 0.5",nearCut:12,vertMove:`p = treeSway(p);
      // (review 8) January: a bare bough is a solid stroke at any distance. Each lacquer tube swells along its own normal by three
      // quarters of a pixel, so the far boughs are strokes a pixel and a half wide or more, never dotted hairlines.
      if (uBare > 0.5 && aInk.x > 1.5 && aInk.x < 2.5) { float dB = length((copyMatrix()*vec4(discToWedge(p), 1.)).xyz - cameraPosition); p += n*0.0021*max(dB - 20., 0.); } if (iClip.w < -1.5 || iClip.w > 1.5) alive = 0.; vKeep = step(aPad.w, -0.01);
      if (aPad.w > 0.) {                                      // a foliage pad draws in toward its own heart as the lens (or the clear cone) comes for it
        vec3 pc = treeSway(aPad.xyz), dP = (copyMatrix()*vec4(discToWedge(pc), 1.)).xyz - cameraPosition; float dl = max(length(dP), 1e-3), cut = max(12., uPadCut);
        float k = smoothstep(cut, cut + 7., dl - aPad.w);
        if (dl < uClearFar) k = min(k, 1. - smoothstep(uClear.w - 0.035, uClear.w - 0.008, dot(dP, uClear.xyz)/dl - 0.6*aPad.w/dl));
        p = mix(pc, p, k); if (k < 0.03) alive = 0.; }`,fragColor:`
      if (vInk.x > 1.5 && vInk.x < 2.5) { base = LACQ; gShade = LACQ*0.55; if (dot(vV, vV) < max(max(81., uBoughCut*uBoughCut), 0.3*uPadCut*uPadCut)) cut = true; }   // black lacquer in every season and hour; a bough parts nine metres from the lens, so none is a bar across the frame (the cut is decided here and made by the factory, after enamel's widths)
      if (vInk.x < 1.5) {
        float rho = clamp((0.9 - vInk.y)/0.3, 0., 1.), wq = fwidth(rho) + 1e-4; gloss = 0.9*(1. - smoothstep(0.30, 0.42, rho));   // the highlight keeps to the pad's heart
        base = mix(vInk.x < 0.5 ? uPal[1] : uPal[0], base, smoothstep(-wq, wq, rho - 0.36));
        float rimW = max(0.075, 1.5*wq);
        base = mix(base, mix(base, uPal[2], 0.72), smoothstep(-wq, wq, rho - (1. - rimW))*(1. - smoothstep(0.1, 0.25, wq)));
      }`}),q=re(V.trunkGeo,_,l);p.add(q),await t.yield();const J=da(r),he=re(V.leafGeo,J,l);p.add(he),await t.yield();const de=(d,x,I,b,w)=>{const K=[];for(let B=0;B<d;B++){const ne=o()*6.283,xe=Math.sqrt(me(x*x,I*I,o()));K.push({x:Math.cos(ne)*xe,z:Math.sin(ne)*xe,yaw:o()*6.283,s:o.range(b,w)})}return K},Ce=de(19,13,80,2.4,5),Ie=de(8,11,62,3.4,5),Se=Pe(r,{slots:4}),te=Pe(r,{slots:2,vertMove:"p.xz += (0.05*sin(uTime*1.3 + p.x*0.4) + 0.03*sin(uTime*2.1 + p.z))*position.y*position.y*sl.w;"}),ce=fa(o),we=re(ce,Se,l,4);p.add(we),await t.yield();const u=ua(o),M=re(u,te,l,2);p.add(M);const N=_t(Ce,Se.uniforms.uSlot,1.2,e.clearLane),F=_t(Ie,te.uniforms.uSlot,.5,e.clearLane);await t.yield();const z=pa(),n=va(r),v=re(z,n,l,Me.n);p.add(v),await t.yield();const g=ve.centerY,C=new a.Vector3(0,g,0),j=s.head,Y=s.up,H=e.gateHeading?e.gateHeading.clone().normalize():j.clone(),Q=new a.Vector3(0,1,0).addScaledVector(H,-H.y).normalize(),ae=new a.Vector3().crossVectors(Q,H).normalize(),fe=new a.Matrix4().makeBasis(ae,Q,H).setPosition(C),We=xa(o),st=[[1,1,0],[-1,1,1.6],[1,-1,3.2],[-1,-1,4.8]].map(([d,x,I],b)=>({matrix:fe.clone().multiply(new a.Matrix4().makeScale(d,x,-1).setPosition(b?(o()-.5)*.16:0,b?(o()-.5)*.16:0,b*.05)),gen:I,shell:0,seed:o(),clip:[0,0,0,0]})),Te=re(We,Pe(r,{wedgeSpace:!0,noClip:!0,fragColor:wa+`
    { float gr2 = length(vP.xy), ga2 = atan(vP.y, max(vP.x, 1e-4)), tt = fract(ga2*3.8197186 + 0.5);   // (the teeth's two widths are taken above their branch, on every pixel: abs(vP.z) > 1.02 divides a block of four on the stones' flanks, and a width taken inside is not defined there)
      float dT = (1. - (gr2 - 7.52)/1.05)*0.5 - abs(tt - 0.5), wT = fwidth(dT) + 1e-4, wtt = fwidth(tt);
      if (vInk.x > 2.5 && vInk.x < 3.5 && abs(vP.z) > 1.02) { float inT = smoothstep(-wT, wT, dT)*step(7.5, gr2)*(1. - smoothstep(0.2, 0.5, wtt));
        vec3 gT = mix(uPal[0], uPal[6], step(0.5, tt)); gT = mix(mix(uPal[0], uPal[2], 0.6), gT, smoothstep(0.035, 0.035 + wT, dT));
        base = mix(base, gT, inT); gloss = mix(gloss, 0.9, inT); } }
    // (round 10: ONE TRUE QUARTER AND THREE REFLECTIONS. Each reflected quarter of the Gate is a clear step dimmer and cooler than the one before it)
    { float qg = clamp(vInfo.x/1.6, 0., 3.); base = mix(base, uPal[5], 0.15*qg)*(1. - 0.06*qg); }`}),st);p.add(Te);const Ee={uIris:{value:7.2},uIrisIn:{value:6.9},uIrisZ:{value:.2},uVeil:{value:na(e.veil||Ye[0])}},nt=(()=>{const d=ze(),x=48,I=[],b=[];for(let w=0;w<x;w++){const K=w/x*Math.PI*2;I.push(d.v(Math.cos(K),Math.sin(K),0,0,0,1,2,1)),b.push(d.v(Math.cos(K),Math.sin(K),1,0,0,1,2,1))}for(let w=0;w<x;w++){const K=(w+1)%x;d.quad(I[w],I[K],b[K],b[w])}return d.build()})(),He=re(nt,Pe(r,{wedgeSpace:!0,noClip:!0,uniforms:Ee,vertDecl:"uniform float uIris, uIrisIn, uIrisZ; varying float vBand; varying vec2 vQ;",vertMove:"vBand = position.z; p = vec3(position.xy*mix(uIrisIn, max(uIris, 7.05), position.z), -uIrisZ); vQ = p.xy; n = vec3(0., 0., -1.);",fragDecl:"varying float vBand; varying vec2 vQ; uniform vec3 uVeil;",fragColor:"gloss = 0.;",fragEnd:`{ vec2 aq = abs(vQ); float along = max(aq.x, aq.y), horiz = step(aq.y, aq.x);
        float off = horiz > 0.5 ? (vQ.x > 0. ? 0.09 : -0.07) : (vQ.y > 0. ? -0.08 : 0.06), across = (horiz > 0.5 ? vQ.y : vQ.x) - off;
        float wq = fwidth(across) + 1e-4, hw = max(0.05, 0.8*wq), ln = (1. - smoothstep(hw - 0.5*wq, hw + 0.5*wq, abs(across)))*smoothstep(0.55, 0.55 + 2.*wq, along)*clamp(0.09/hw, 0.35, 1.);
        gl_FragColor = vec4(mix(uVeil, toScene(uPal[6]), ln), 1.); }`}),[{matrix:fe.clone(),gen:0,shell:0,seed:.5,clip:[0,0,0,0]}]);He.matrixAutoUpdate=!1,p.add(He);const it={uMedR:{value:8},uMedZ:{value:.3},uVeil:Ee.uVeil},rt=new a.BufferGeometry;for(const d of["position","normal","aInk"])rt.setAttribute(d,nt.getAttribute(d));rt.setIndex(nt.getIndex());const Ze=re(rt,Pe(r,{wedgeSpace:!0,noClip:!0,uniforms:it,vertDecl:"uniform float uMedR, uMedZ;",vertMove:"p = vec3(position.xy*uMedR*position.z, uMedZ); n = vec3(0., 0., -1.);",fragDecl:"uniform vec3 uVeil;",fragColor:"gloss = 0.;",fragEnd:"gl_FragColor = vec4(uVeil, 1.);"}),[{matrix:fe.clone(),gen:0,shell:0,seed:.5,clip:[0,0,0,0]}]);Ze.matrixAutoUpdate=!1,p.add(Ze),await t.yield();const kt=fe.clone(),Pt=new a.Quaternion,lt=new a.Matrix4,ct=new a.Matrix4,Oe=new a.Vector3;Te.matrixAutoUpdate=!1;const zt={uGate:{value:kt},uProgress:{value:0}},$e=l.filter(d=>d.shell>.5),ht=Math.round(40*h),Mt=Math.round(280*h),Yt=e.wreathKeep??1,Qt=e.lineCards??1,St=e.linePer==="garden"?d=>$e[d].matrix.determinant()>0&&$e[d].clip[3]<1.5:d=>d%(e.lineEvery||7)===5,Zt=$e.filter((d,x)=>St(x)).length,Ct=e.nearStrings||[],dt=Math.round(42*h),Xe=Zt*ht+Mt+Ct.length*dt,ft=new Float32Array(Xe*3),Je=new Float32Array(Xe*4),ut=new Float32Array(Xe);let It=Xe;{const d=new a.Vector3;let x=0;for(let I=0;I<$e.length;I++){const b=$e[I],w=o(),K=St(I);for(let B=0;B<ht;B++){d.set(U.pivot[0]+o.range(-3.5,3.5),16+o()*9,U.pivot[1]+o.range(-3.5,3.5)).applyMatrix4(b.matrix);const ne=[(B+.15+.7*o())/ht,(w+o()*.004)%1,0,o()<.3?1:0];!K||B*.618034%1>=Qt||(ft.set([d.x,d.y,d.z],x*3),ut[x]=b.gen,Je.set(ne,x*4),x++)}}for(let I=0;I<Mt;I++){const b=[o(),o(),1,o()<.35?0:1];I*.618034%1<Yt&&(Je.set(b,x*4),x++)}Ct.forEach((I,b)=>{for(let w=0;w<dt;w++,x++){const K=(w*.618034+b*.37)%1,B=(w*.754877+b*.19)%1;ft.set([I.x+(K-.5)*2.4,I.y+(B-.5)*2.4,I.z+((K+B)%1-.5)*2.4],x*3),ut[x]=0,Je.set([(w+.2+.6*K)/dt,(.137+b*.291+B*.004)%1,3,(w+b)%3===0?1:0],x*4)}}),It=x}const Ae=new a.InstancedBufferGeometry;Ae.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),Ae.setIndex([0,1,2,0,2,3]),Ae.setAttribute("aStart",new a.InstancedBufferAttribute(ft,3)),Ae.setAttribute("aPar",new a.InstancedBufferAttribute(Je,4)),Ae.setAttribute("aGen",new a.InstancedBufferAttribute(ut,1)),Ae.instanceCount=It;const Tt=new a.Mesh(Ae,ga(r,zt));Tt.frustumCulled=!1,p.add(Tt),await t.yield();{const d=ze(),x=[],I=[];for(let w=0;w<=7;w++)x.push(s.spine[w].clone()),I.push(me(1.5,.45,w/7)),w<7&&(x.push(s.spine[w].clone().lerp(s.spine[w+1],.5)),I.push(me(1.5,.45,(w+.5)/7)*.72));x[0].y-=1.2,Le(d,x,I,6,2,1,!0);for(const w of s.pages)for(const K of[0,1]){const B=s.spine[w.k+K],ne=w.c.clone().addScaledVector(w.t,(K?1:-1)*53*w.sc).addScaledVector(w.w,1.5*w.sc);Le(d,[B.clone(),B.clone().lerp(ne,.5).addScaledVector(w.n,.8),ne],[.55,.4,.28],4,K?2:6,1,!0)}const b=re(d.build(),Pe(r,{wedgeSpace:!0,noClip:!0,fragColor:"if (vInk.x > 1.5 && vInk.x < 2.5) { base = LACQ; gShade = LACQ*0.55; }"}),[{matrix:new a.Matrix4,gen:1,shell:0,seed:.5,clip:[0,0,0,0]}]);p.add(b)}const et=s.slit.clone(),pt=[];for(let d=0;d<=7;d++){const x=s.TH[Math.max(0,d-1)]*Math.PI/180;pt.push(s.spine[d].clone().add(new a.Vector3(0,Math.cos(x),Math.sin(x)).multiplyScalar(me(34,20,d/7))))}pt.push(et.clone(),et.clone().addScaledVector(j,70),C.clone());const Xt={center:C,heading:j.clone(),up:Y.clone(),portalSeat:{position:C.clone(),normal:H.clone().negate(),heading:H.clone(),radius:7,tiltDeg:35},slit:{position:et,along:Y.clone(),clearHalfWidth:ve.slitHalf-1.3},flyThrough:pt,tongueRoot:s.spine[0].clone(),tongueTip:s.tip.clone(),viewpoints:{plain:new a.Vector3(60,30,560),underTongue:new a.Vector3(26,22,300),inside:et.clone().addScaledVector(j,40)}},At=r.uShell.value,Vt=new a.Matrix4,ue={progress:0,shell:null,turn:null,koiT:null,eye:!1},tt=new a.Vector3,Wt=(d,x,I)=>{!ue.eye&&I&&(I.getWorldPosition(tt),r.uShellEye.value.set(tt.x,tt.y,tt.z,1/25)),r.uTime.value=x;const b=ue.turn??m+x*k;r.uTurn.value=b;const w=ue.koiT??x*Me.speed;r.uKoiT.value=w,r.uJoint.value=ue.joint??x*.26,Vt.makeRotationAxis(i,ue.shell??y+x*f),At.makeTranslation(0,g,0).multiply(Vt);const K=Math.cos(b),B=Math.sin(b),ne=U.pivot[0],xe=U.pivot[1];for(let R=0;R<6;R++){const ie=V.crown[R];S.uCrown.value[R].set(ne+K*ie.x-B*ie.z,ie.y,xe+B*ie.x+K*ie.z,ie.w)}{const R=V.foot,ie=V.top;S.uTrunk.value.set(ne+K*R.x-B*R.z,xe+B*R.x+K*R.z,ne+K*ie.x-B*ie.z,xe+B*ie.x+K*ie.z)}for(let R=0;R<4;R++){const ie=R%Me.n,ye=R*.27,pe=(x*.3+ye)%1,Ve=ma(ie,w-pe/.3*Me.speed+ie*2.1+3.4/30,r.uKoiYaw.value);S.uKoiW.value[R].set(ne+K*Ve[0]-B*Ve[1],xe+B*Ve[0]+K*Ve[1],ye)}N(b),F(b)};Wt(0,0);const qe=e.gview||"";let Ne=180,je=250,Ke=new a.Vector3(0,150,40);return qe==="in"&&(Ne=28,je=60,Ke=C.clone().addScaledVector(j,-15)),qe==="mid"&&(Ne=75,je=60,Ke=C.clone().addScaledVector(j,-15)),qe==="close"&&(Ne=9,je=26,Ke=new a.Vector3(U.pivot[0]+6,5,U.pivot[1]).applyMatrix4(l[0].matrix).applyMatrix4(At)),qe==="gate"&&(Ne=5,je=14,Ke=C.clone()),qe==="tongue"&&(Ne=34,je=40,Ke=s.spine[4].clone().add(new a.Vector3(0,12,0))),{object:p,radius:Ne,height:je,center:Ke,anchors:Xt,uniforms:r,update:Wt,ground:!qe,groundY:0,setProgress(d){ue.progress=De(d,0,1),zt.uProgress.value=ue.progress},setShellAngle(d){ue.shell=d},setGateFacing(d,x=1,I=1,b=1e4){Oe.copy(d).normalize(),Oe.dot(H)<-.999&&Oe.copy(H),Pt.setFromUnitVectors(H,Oe),lt.makeRotationFromQuaternion(Pt),He.matrix.makeTranslation(C.x,C.y,C.z).multiply(lt).multiply(ct.makeTranslation(-C.x,-C.y,-C.z)),Te.matrix.makeTranslation(C.x,C.y,C.z).multiply(lt).multiply(ct.makeScale(x,x,x)).multiply(ct.makeTranslation(-C.x,-C.y,-C.z)),Te.matrixWorldNeedsUpdate=!0,He.matrixWorldNeedsUpdate=!0;{const w=De(Oe.dot(H),-1,1),K=.2+7.4*Math.sqrt(1-w*w)*(1-I);Ee.uIrisZ.value=K,Ee.uIris.value=(7.5*x+.25)*(1-K/Math.max(b,30)),Ee.uIrisIn.value=Math.max(Ee.uIris.value,7.05)*I;const B=.3+7.4*Math.sqrt(1-w*w);it.uMedZ.value=B,it.uMedR.value=(7.5*x+.35)*(1+B/Math.max(b,30)),Ze.matrix.copy(He.matrix),Ze.matrixWorldNeedsUpdate=!0}kt.copy(Te.matrix).multiply(fe)},setTurn(d){ue.turn=d},keepClear(d,x,I){const b=U.pivot[0],w=U.pivot[1],K=r.uLateTurn.value,B=r.uPetal.value,ne=48,xe=(W,T,O)=>B?B*Math.min(.0045*Math.pow(Math.max(Math.hypot(W+3.5,O-1.5)-8,0),2),.22*Math.max(T,0)):0,R=[],ie=new a.Matrix4,ye=new a.Vector3;for(const W of x){if(W.clip[3]<-1.5||W.clip[3]>1.5)continue;ye.set(b,0,w).applyMatrix4(W.matrix);const T=ye.x,O=ye.z;ie.copy(W.matrix).invert();const P=W.seed>=1.5?K:0,G=Math.max(W.clip[0]-1.3,0);for(const $ of d){if(Math.hypot($.p.x-T,$.p.z-O)>ne)continue;ye.copy($.p).applyMatrix4(ie);const D=$.turn+P,E=Math.cos(D),oe=Math.sin(D),ee=ye.x-b,Z=ye.z-w;R.push(E*ee+oe*Z,ye.y,-oe*ee+E*Z,E,oe,G)}}const pe={cards:0,pads:0,left:0,far:0,mirror:0};if(!R.length)return pe;const Ve=(W,T,O)=>{const P=b+R[W+3]*T-R[W+4]*O,G=w+R[W+4]*T+R[W+3]*O;return P>=R[W+5]&&G>=0&&U.hd-(P*U.hn[0]+G*U.hn[1])>=0},Ge=new a.Vector3,Be=new a.Vector3,mt=new a.Vector3,vt=new a.Vector3,at=new a.Vector3,Jt=(W,T,O,P,G)=>{Ge.subVectors(O,T),Be.subVectors(P,T),mt.subVectors(W,T);const $=Ge.dot(mt),D=Be.dot(mt);if($<=0&&D<=0)return G.copy(T);vt.subVectors(W,O);const E=Ge.dot(vt),oe=Be.dot(vt);if(E>=0&&oe<=E)return G.copy(O);const ee=$*oe-E*D;if(ee<=0&&$>=0&&E<=0)return G.copy(T).addScaledVector(Ge,$/($-E));at.subVectors(W,P);const Z=Ge.dot(at),se=Be.dot(at);if(se>=0&&Z<=se)return G.copy(P);const le=Z*D-$*se;if(le<=0&&D>=0&&se<=0)return G.copy(T).addScaledVector(Be,D/(D-se));const ke=E*se-Z*oe;if(ke<=0&&oe-E>=0&&Z-se>=0)return G.copy(O).addScaledVector(at.subVectors(P,O),(oe-E)/(oe-E+(Z-se)));const _e=1/(ke+le+ee);return G.copy(T).addScaledVector(Ge,le*_e).addScaledVector(Be,ee*_e)},ot=new a.Vector3,wt=new a.Vector3,be=new a.Vector3,ge=[0,1,2,3].map(()=>new a.Vector3),Et=(W,T,O,P,G)=>{let $=0;for(let D=0;D<R.length;D+=6){const E=T-R[D],oe=O-R[D+1],ee=P-R[D+2],Z=I+G;if(E*E+oe*oe+ee*ee>Z*Z)continue;let se=Ve(D,T,P);for(let le=0;le<W&&!se;le++)se=Ve(D,ge[le].x,ge[le].z);if(se){ot.set(R[D],R[D+1],R[D+2]);for(let le=1;le+1<W;le++){Jt(ot,ge[0],ge[le],ge[le+1],wt);const ke=wt.distanceTo(ot);I-ke>$&&($=I-ke,ke>1e-4?be.subVectors(wt,ot).divideScalar(ke):be.set(T-R[D],O-R[D+1],P-R[D+2]).normalize())}}}return $},Re=V.leafGeo.getAttribute("position"),xt=V.leafGeo.getAttribute("normal"),qt=V.leafGeo.getAttribute("aCard"),gt=new a.Vector3,Ue=new a.Vector3,Nt=new a.Vector3,ea=new a.Vector3(.31,.2,.93),jt=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let W=0;W<Re.count;W+=4){if(qt.getW(W)>1.5)continue;const T=qt.getZ(W);let O=Re.getX(W),P=Re.getY(W),G=Re.getZ(W),$=0,D=0;gt.set(xt.getX(W),xt.getY(W),xt.getZ(W)).normalize(),Ue.crossVectors(gt,ea),Ue.divideScalar(Math.max(Ue.length(),.001)),Nt.crossVectors(gt,Ue);for(let E=0;E<=24;E++){const oe=P-xe(O,P,G);for(let Z=0;Z<4;Z++)ge[Z].set(O,oe,G).addScaledVector(Ue,jt[Z][0]*T).addScaledVector(Nt,jt[Z][1]*T);if(D=Et(4,O,oe,G,1.5*T),D<=0||E===24)break;const ee=D+.01;if($+=ee,P+be.y*ee<2){const Z=Math.hypot(be.x,be.z);P=2,Z>.001?(O+=be.x/Z*ee,G+=be.z/Z*ee):O+=ee}else O+=be.x*ee,P+=be.y*ee,G+=be.z*ee}if($){for(let E=0;E<4;E++)Re.setXYZ(W+E,O,P,G);pe.cards++,pe.far=Math.max(pe.far,$),D>0&&pe.left++}}if(Re.needsUpdate=!0,!(r.uBare.value>.5)){const W=V.trunkGeo.getAttribute("position"),T=V.trunkGeo.getAttribute("aPad"),O=[];for(let P=0;P<T.count;P++){if(!(T.getW(P)>0))continue;const G=O[O.length-1];G&&G.i1===P&&T.getX(G.i0)===T.getX(P)&&T.getY(G.i0)===T.getY(P)&&T.getZ(G.i0)===T.getZ(P)&&T.getW(G.i0)===T.getW(P)?G.i1=P+1:O.push({i0:P,i1:P+1})}for(const P of O){const G=P.i1-P.i0;for(;ge.length<G+1;)ge.push(new a.Vector3);let $=0,D=0;for(let E=0;E<=80;E++){for(let se=0;se<G;se++){const le=W.getX(P.i0+se),ke=W.getY(P.i0+se)+$,_e=W.getZ(P.i0+se);ge[se].set(le,ke-xe(le,ke,_e),_e)}ge[G].copy(ge[1]);const oe=T.getX(P.i0),ee=T.getY(P.i0)+$,Z=T.getZ(P.i0);if(D=Et(G+1,oe,ee-xe(oe,ee,Z),Z,2*T.getW(P.i0)),D<=0||E===80)break;$+=Math.max(D+.01,.05)}if($){for(let E=P.i0;E<P.i1;E++)W.setY(E,W.getY(E)+$),T.setY(E,T.getY(E)+$);pe.pads++,pe.far=Math.max(pe.far,$),D>0&&pe.left++;for(const E of V.crown)Math.fround(E.x)===T.getX(P.i0)&&Math.fround(E.z)===T.getZ(P.i0)&&(E.y+=$,pe.mirror++)}}W.needsUpdate=!0,T.needsUpdate=!0}return pe},setShellEye(d,x){ue.eye=!0,r.uShellEye.value.set(d.x,d.y,d.z,x)},setJointClock(d){ue.joint=d},setKoiClock(d){ue.koiT=d},addCopies(d,x="full"){const I=new a.Group,b=K=>{const B=new a.BufferGeometry;for(const ne of["position","normal","aInk","aCard","aPad"])K.getAttribute(ne)&&B.setAttribute(ne,K.getAttribute(ne));return B.setIndex(K.getIndex()),B},w=b(V.trunkGeo);return x!=="full"&&w.setDrawRange(0,V.coreIndex),I.add(re(b(X.geometry),A,d),re(w,_,d)),x==="full"&&I.add(re(b(V.leafGeo),J,d),re(b(ce),Se,d,4),re(b(u),te,d,2),re(b(z),n,d,Me.n)),I},crown:S.uCrown,mirrorN:S.uMirrorN,pondRing:S.uRing,koiRings:S.uKoiW,maple:V,tongue:s,copies:l,turnAt:d=>m+d*k,shellAt:d=>ue.shell??y+d*f,dispose(){}}}export{Ye as DEFAULT_PALETTE,Fe as GATE,wa as GATE_FRAG,ve as GLOBE,Me as KOI,Ut as KOI_GLSL,yt as LEAF_GLSL,Ft as STYLE_FRAG_GLSL,ra as STYLE_VERT_GLSL,$t as SWAY_GLSL,sa as TONE_GLSL,U as WEDGE,re as applyCopies,ba as buildHero,Pe as enamelMaterial,xa as gateQuarterGeometry,ze as geo,ma as koiAtJS,la as makeCopies,ia as makeStyleUniforms,na as toScene,Le as tube};
