import*as v from"three";import{PP as F}from"./pelican-peloton-plan.js";import{leaderGeometry as fe,packMesh as de}from"./pelican-peloton-riders.js";const j={ink:"#1B1F3B",sky:"#8FD0FF",skyLowBand:"#BFE6FF",sun:"#FFD23F",halo:"#FFF1B0",sea:"#2F7FD8",seaFar:"#4F9BE6",stroke:"#FFFFFF",surf:"#FFFFFF",beach:"#F7E7B5",cliff:"#E9C98B",cliffShade:"#D2A865",wall:"#E3E0D6",wallShade:"#C4C0B4",verge:"#F2DFA6",road:"#8C929B",dash:"#FFFFFF",shadow:"#5A6478",land:"#6CC466",hillNear:"#57B85A",hillMid:"#7FCB6B",hillFar:"#9AD68A",fieldStripe:"#8ED36B",headlandFar:"#A8D8C8",treeHead:"#3FA34D",treeCone:"#2F8F57",treeStick:"#8A5A2B",pelican:"#FFFFFF",pelicanShade:"#DCE3EC",wingTip:"#2B2B33",bill:"#FFA630",pouch:"#FFC83D",pouchShade:"#F08A1C",legs:"#FF8A1E",bikeRed:"#E8362E",bikeTeal:"#1FB5A8",bikeYellow:"#F5C518",tyre:"#1B1F3B",rim:"#C9CED6",greyBlob:"#9AA1AA",sail:"#E8362E",lighthouseWhite:"#FFFFFF",lighthouseRed:"#E8362E",beam:"#FFF1B0",brownBack:"#8A7F78",brownHead:"#FFFFFF",brownNape:"#7A3B2E",brownCrown:"#E9D27A",brownPouch:"#C7483A",saddle:"#8A5630",straw:"#ECC77A",fish:"#5AA9E6",crownWash:"#FFF3B8",eyeRing:"#FFE9A8",hat:"#1B1F3B",hatBand:"#F5C518",cap:"#2F6FD6",scarf:"#E8362E"},H={day:j,morning:{...j,sky:"#BDE6FF",skyLowBand:"#DDF2FF",sun:"#FFE066",halo:"#FFF6C9",sea:"#2A8FD0",seaFar:"#58AEE2",beach:"#FAEEC8",cliff:"#EBD09A",cliffShade:"#D6B274",road:"#949AA3",land:"#79CC72",hillNear:"#62BE64",hillMid:"#8BD278",hillFar:"#A6DC98",headlandFar:"#B4DDD2",shadow:"#647089"}},$=new v.Color,re=e=>($.set(e),[$.r,$.g,$.b]),Y=re(j.ink),G=F.LINE_RIDER,Re=e=>Math.min(F.LINE_MAX,F.LINE_SHARE*e);function xe(e="day"){const i=H[e]||H.day,t={},n=p=>t[p]||(t[p]=re(i[p]||p)),o=[];for(let p=0;p<F.KNOTS;p++)o.push(new v.Vector4(0,F.KNOT_S0+p*F.KNOT_STEP,0,1));const s={uTime:{value:0},uD:{value:0},uResY:{value:450},uLine:{value:new v.Vector2(F.LINE_PT[0],F.LINE_PT[1])},uInkMix:{value:new v.Vector2(F.INK_FULL,F.INK_NONE)},uInk:{value:new v.Vector3(...n("ink"))},uF:{value:new v.Vector4(F.K0,F.K1,F.D_K0,F.D_K1)},uRoad:{value:o},uRoadY:{value:[F.ROAD_Y0,F.FALL,F.S_FALL[0],F.S_FALL[1],F.S_FALL[2],F.S_FALL[3],F.S_BRINK,F.S_GRADE,Math.tan(F.GRADE_DEG*Math.PI/180)]},uSunDir:{value:new v.Vector3(.6486,.1392,.7483)},uSunCol:{value:new v.Vector3(...n("sun"))},uCamP:{value:new v.Vector3},uRim:{value:new v.Vector3(...n("rim"))}},d=p=>{const l=p.knots;for(let a=0;a<F.KNOTS;a++)o[a].set(l[a*4],l[a*4+1],l[a*4+2],l[a*4+3])};return{key:H[e]?e:"day",hex:i,col:n,U:s,setRoad:d}}const I=e=>Number(e).toFixed(4),se=.68,le=`
  uniform float uTime, uD, uResY; uniform vec2 uLine, uInkMix; uniform vec3 uInk, uSunDir, uSunCol, uCamP;
  uniform vec4 uF; uniform vec4 uRoad[${F.KNOTS}]; uniform float uRoadY[9];
  vec2 ppRot2(vec2 v, float a){ float c = cos(a), s = sin(a); return vec2(c * v.x - s * v.y, s * v.x + c * v.y); }
  float ppF(float d){
    float w = max(uF.w - uF.z, 1e-3), t = clamp((d - uF.z) / w, 0., 1.);
    return uF.x * d + (uF.y - uF.x) * w * (t * t * t - 0.5 * t * t * t * t) + (uF.y - uF.x) * max(d - uF.w, 0.);
  }
  vec2 ppRoadY(float s){
    float y0 = uRoadY[0], F = uRoadY[1], a0 = uRoadY[2], a1 = uRoadY[3], a2 = uRoadY[4], a3 = uRoadY[5], b0 = uRoadY[6], b1 = uRoadY[7], g = uRoadY[8];
    float wa = max(a1 - a0, 1e-3), wc = max(a3 - a2, 1e-3), wb = max(b1 - b0, 1e-3);
    float yA = y0 - F * wa * 0.5, yB = yA - F * (a2 - a1), yC = yB - F * wc * 0.5;
    if (s <= a0) return vec2(y0, 0.);
    if (s <= a1) { float t = s - a0; return vec2(y0 - F * t * t / (2. * wa), -F * t / wa); }
    if (s <= a2) return vec2(yA - F * (s - a1), -F);
    if (s <= a3) { float t = s - a2; return vec2(yB - F * (t - t * t / (2. * wc)), -F * (1. - t / wc)); }
    if (s <= b0) return vec2(yC, 0.);
    if (s <= b1) { float t = s - b0; return vec2(yC + g * t * t / (2. * wb), g * t / wb); }
    return vec2(yC + g * wb * 0.5 + g * (s - b1), g);
  }
  vec3 ppRoad(float s, float n, float h, out vec2 hd){
    float f = (s - ${I(F.KNOT_S0)}) / ${I(F.KNOT_STEP)}, fi = clamp(floor(f), 0., ${I(F.KNOTS-2)}), t = f - fi, L = ${I(F.KNOT_STEP)};
    int i = int(fi);
    vec4 A = uRoad[i], B = uRoad[i + 1];
    float t2 = t * t, t3 = t2 * t;
    float h00 = 2. * t3 - 3. * t2 + 1., h10 = t3 - 2. * t2 + t, h01 = -2. * t3 + 3. * t2, h11 = t3 - t2;
    float d00 = 6. * t2 - 6. * t, d10 = 3. * t2 - 4. * t + 1., d11 = 3. * t2 - 2. * t;
    vec2 c = h00 * A.xy + h10 * L * A.zw + h01 * B.xy + h11 * L * B.zw;
    vec2 d = d00 * A.xy + d10 * L * A.zw - d00 * B.xy + d11 * L * B.zw;
    hd = d / max(length(d), 1e-4);
    return vec3(c.x + hd.y * n, ppRoadY(s).x + h, c.y - hd.x * n);
  }
  float ppPixel(vec4 clip){ return 2. * abs(clip.w) / max(projectionMatrix[1][1] * max(uResY, 1.), 1e-4); }
  vec2 ppLine(float W, float px){
    float pt = px * max(uResY / 450., ${I(se)});                         // metres one POINT covers there
    float held = clamp(W, uLine.x * pt, max(uLine.y * pt, uLine.x * pt));
    return vec2(held, smoothstep(uInkMix.y, max(uInkMix.x, uInkMix.y + 1e-3), W / max(held, 1e-6)));
  }
`;function ce(e,i={},t={}){const n=(Array.isArray(i)?i:[i]).slice(0,24),o=Math.max(1,n.length),s=[],d=[];for(let p=0;p<o;p++){const l=n[p]||{},a=l.hip||[2.05,-.28],u=l.crank||[.72,0];s.push(new v.Vector4(a[0],a[1],l.thigh??.82,l.shin??.95)),d.push(new v.Vector4(u[0],u[1],l.arm??.43,l.back?1:0))}return new v.ShaderMaterial({uniforms:{...e,uRim:e.uRim||{value:new v.Vector3(.584,.617,.672)},uLeg:{value:s},uCrank:{value:d},...t.uniforms||{}},vertexShader:ge(o,t.vertexPre||"",t.vertexMove||"",!!t.keepInk),fragmentShader:`
      varying vec3 vCol;
      ${t.fragPre||""}
      void main(){
        vec3 col = vCol; bool cut = false;
        ${t.fragColor||""}
        gl_FragColor = vec4(col, 1.);
        if (cut) discard;
      }`,side:t.side??v.FrontSide,...t.extra||{}})}function ge(e,i,t,n=!1){const o=n?"1.":"0.";return`
    attribute vec3 aCol; attribute vec4 aK; attribute vec4 aRig; attribute vec4 iA; attribute vec4 iB;
    ${le}
    uniform vec4 uLeg[${e}], uCrank[${e}];
    varying vec3 vCol;
    // what ppBegin() sets for this vertex's row: metres ridden, the cranks' angle, 0 where wheels stand still, the wheels'
    // own small time term, 0..1 standing on the pedals, the head's turn, the size over the model's, metres a pixel covers
    // at the thing, and the row's own phase
    float gTrav = 0., gCrank = 0., gSpin = 1., gWheelT = 0., gStand = 0., gTurn = 0., gSize = 1., gPx = 0.01, gOwn = 0., gLoose = 0.;
    uniform vec3 uRim;
    ${i}
    void main(){
      vec3 p = position, n = normal;
      float part = floor(aK.y + 0.5);
      if (part > 31.5) { gLoose = 1.; part -= 32.; }                     // a part of the rider's LOOSE body (the drifter's bird): the same part, carried by the holder
      else gLoose = 0.;
      #ifdef PP_BEGIN
        ppBegin();
      #else
        gPx = ppPixel(projectionMatrix * modelViewMatrix * vec4(0., 0., 0., 1.));
      #endif
      if (part > 0.5 && part < 1.5) {                                   // a wheel turns by metres over its radius
        float R = max(aRig.z * gSize, 0.05), a = (gTrav / R + gWheelT) * sign(aRig.w) * gSpin;
        vec2 q = p.yz - aRig.xy;
        if (abs(aRig.w) > 1.5) q *= smoothstep(7., 15., R / max(gPx, 1e-5));   // a spoke: drawn in to the hub as the wheel grows small on the picture
        p.yz = ppRot2(q, a) + aRig.xy; n.yz = ppRot2(n.yz, a);
      } else if (part > 1.5 && part < 2.5) {                            // arms and chainring turn about the bracket
        float a = gCrank * aRig.w + aRig.z;
        p.yz = ppRot2(p.yz - aRig.xy, a) + aRig.xy; n.yz = ppRot2(n.yz, a);
      } else if (part > 2.5 && part < 3.5) {                            // a pedal rides its arm's end and stays level
        float a = gCrank + aRig.z;
        p.yz += aRig.w * (vec2(cos(a), sin(a)) - vec2(1., 0.));
      } else if (part > 3.5 && part < 6.5) {                            // a leg: hip fixed, ankle over the pedal, knee solved
        int ri = int(clamp(aRig.w, 0., ${(e-1).toFixed(1)}) + 0.5);
        vec4 lg = uLeg[ri], ck = uCrank[ri];
        float a = gCrank + aRig.y;
        // the ankle rides its lift over the pedal; a NEGATIVE lift is a foot that slips off the pedal's front once a turn
        vec2 lift = aRig.z >= 0. ? vec2(aRig.z, 0.) : vec2(0.12, 0.) + aRig.z * smoothstep(0.55, 1., sin(a)) * vec2(1., -0.5);
        vec2 H = lg.xy + gStand * vec2(0.35, 0.25), F = ck.xy + ck.z * vec2(cos(a), sin(a)) + lift;
        float L1 = lg.z, L2 = lg.w;
        vec2 dv = F - H; float dl0 = max(length(dv), 1e-4); vec2 dn = dv / dl0;
        float dl = clamp(dl0, abs(L1 - L2) + 0.02, L1 + L2 - 0.004);    // the two circles always meet
        float a2 = (dl * dl + L1 * L1 - L2 * L2) / (2. * dl), hh = sqrt(max(L1 * L1 - a2 * a2, 0.));
        vec2 Kn = H + dn * a2 + vec2(dn.y, -dn.x) * hh * (ck.w > 0.5 ? -1. : 1.);   // the knee goes forward (astern on a bird that faces astern)
        F = H + dn * dl;
        if (part > 5.5) {                                               // the foot: flat on the pedal, toes dipping with the stroke
          float tip = 0.22 * sin(a + 0.6);
          p.yz = ppRot2(p.yz, tip) + F; n.yz = ppRot2(n.yz, tip); p.x += aRig.x;
        } else {
          vec2 P0 = part < 4.5 ? H : Kn, P1 = part < 4.5 ? Kn : F;
          vec2 ax = (P1 - P0) / max(length(P1 - P0), 1e-4);             // the bone's own +Y, as (y, z)
          p = vec3(p.x + aRig.x, P0.x + ax.x * p.y - ax.y * p.z, P0.y + ax.y * p.y + ax.x * p.z);
          n = vec3(n.x, ax.x * n.y - ax.y * n.z, ax.y * n.y + ax.x * n.z);
        }
      }
      else if (part > 6.5 && part < 7.5) {                              // the pouch: nods with the head, then swings and sags (on the world's time)
        float a = aRig.w * sin(gCrank * 2.);
        p.yz = ppRot2(p.yz - aRig.yz, a) + aRig.yz; n.yz = ppRot2(n.yz, a);
        float ph = uTime * 4.6 + gOwn;
        p.y -= aRig.x * 0.07 * (1. + sin(ph + 0.9)); p.x += aRig.x * 0.09 * sin(ph * 0.83); p.z += aRig.x * 0.04 * sin(ph + 2.2);
        if (abs(gTurn) > 1e-4) { vec2 q = ppRot2(vec2(p.x, p.z - aRig.z), gTurn); p.x = q.x; p.z = q.y + aRig.z; n.xz = ppRot2(n.xz, gTurn); }
      } else if (part > 7.5 && part < 8.5) {                            // cloth streaming back from its knot: a wave along its length
        float s = aRig.x, k = aRig.y * s, ph = uTime * 7. + 0.6 * gTrav + gOwn;
        p.x += k * sin(s * 4.2 - ph); p.y += k * 0.7 * sin(s * 3.1 - ph * 0.74 + 1.3);
      } else if (part > 8.5 && part < 9.5) {                            // a thing that hovers: it bobs by the metres ridden, and drifts a little aside
        float ph = gTrav * aRig.y + 0.5 * uTime + gOwn;
        p.y += aRig.x * sin(ph + aRig.z); p.x += aRig.w * sin(ph * 0.61 + aRig.z * 1.7);
      } else if ((part > 10.5 && part < 11.5) || (part > 15.5 && part < 16.5)) {   // head, bill, hat: a nod with each stroke
        float a = aRig.z * sin(gCrank * 2.);
        p.yz = ppRot2(p.yz - aRig.xy, a) + aRig.xy; n.yz = ppRot2(n.yz, a);
        float tn = gTurn * (aRig.w > 0.01 ? aRig.w : 1.);                // a head's own share of the turn (aRig.w; none typed: the whole of it)
        if (abs(tn) > 1e-4) { vec2 q = ppRot2(vec2(p.x, p.z - aRig.y), tn); p.x = q.x; p.z = q.y + aRig.y; n.xz = ppRot2(n.xz, tn); }   // the head turns (the leader by the metres flown; the others look about on the world's time)
      } else if (part > 11.5 && part < 12.5) {                          // speed strokes: they slide back and forth behind the rider
        p.z += aRig.y * sin(uTime * 6. + aRig.x + gOwn);
      } else if (part > 16.5 && part < 17.5) {                          // a fish's tail: it flaps side to side about its root
        float away = clamp(length(p.yz - aRig.xy) * 3., 0., 1.);
        p.x += aRig.z * away * sin(uTime * 9. + aRig.w + gOwn);
      }
      // the bird itself (pouch, cloth, trunk, head, the drifter's bird, dress): it rises and falls a little on the saddle,
      // and where the rider stands on the pedals it goes up and forward and rocks with the cranks
      if ((part > 6.5 && part < 8.5) || (part > 9.5 && part < 11.5) || (part > 12.5 && part < 13.5) || (part > 14.5 && part < 16.5)) {
        float w = gStand * ((part > 9.5 && part < 10.5) ? 1. - clamp(aRig.w, 0., 1.) : 1.);
        p.y += 0.02 * sin(gCrank * 2. + 0.4) + 0.35 * w; p.z += 0.25 * w; p.x += 0.10 * w * sin(gCrank);
      }
      ${t}
      vec4 wp = modelMatrix * vec4(p, 1.);
      vec3 wn = mat3(modelMatrix) * n; wn = wn / max(length(wn), 1e-5);
      vec4 cp = projectionMatrix * viewMatrix * wp;
      float px = ppPixel(cp);
      vec3 fill = mix(aCol, iB.rgb, aK.z);
      vCol = fill;
      float push = 0.;
      if (aK.x > 0.) {                                                  // a hull: THE ONE LINE, going over to the fill where it is fat beside its thing
        vec2 l = ppLine(aK.x, px);
        push = l.x * aK.w * mix(0.75 / max(uLine.x, 0.75), 1., l.y);    // ... and drawn in with it to three quarters of a pixel
        vCol = mix(fill, uInk, max(l.y, ${o}));
      } else if (aK.x < 0.) {                                           // a stroke's own skin: thinned near with the line, never under 1.5 px wide
        float r = -aK.x, ls = ppLine(${I(G)}, px).x / ${I(G)}, pt = px * max(uResY / 450., ${I(se)});
        float hw = max(max(r * min(ls, 1.), min(r * ls, 0.5 * uLine.x * pt)), 0.75 * px);
        // a DETAIL stroke (aK.w under 1: a digit, a scallop, a chain) is drawn in to nothing once it is held fatter than
        // its mark can carry: whole while its true width is over aK.w of the drawn one, gone at four fifths of that
        if (aK.w < 0.99) hw *= smoothstep(0.8 * aK.w, aK.w, r / max(hw, 1e-6));
        // a TYRE (aK.w over 1.5) goes over to the rim's pale tone as the line goes over to its fill, by the same two
        // figures, and is drawn in with it: a far wheel is a pale ring and never a solid dark disc
        if (aK.w > 1.5) { float sh = smoothstep(uInkMix.y, max(uInkMix.x, uInkMix.y + 1e-3), r / max(hw, 1e-6)); vCol = mix(uRim, fill, max(sh, ${o})); hw = max(hw * mix(0.6, 1., sh), 0.5 * px); }
        push = hw - r;
      }
      wp.xyz += wn * push;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }`}function pe(){return{pos:[],nor:[],col:[],k:[],rig:[],idx:[],hulls:[]}}const A=(e,i,t)=>new v.Vector3(e,i,t),ue=A(1,0,0),we=A(0,1,0),ze=A(0,0,1),S=A(0,0,0),N=A(0,0,0),T=A(0,0,0),L=A(0,0,0),O=[0,0,0,0];function U(e,i,t,n={}){const{col:o=[1,1,1],part:s=0,rig:d=O,line:p=G,tint:l=0,side:a=ue,axis:u=null,flip:x=!1}=n,c=e.pos.length/3,g=i.length,z=t+1;for(let r=0;r<g;r++){const h=i[r],m=i[Math.max(0,r-1)].p,R=i[Math.min(g-1,r+1)].p;u?L.copy(u):(L.subVectors(R,m),L.lengthSq()<1e-10&&L.set(0,1,0)),L.normalize(),S.copy(h.side||a).addScaledVector(L,-L.dot(h.side||a)),S.lengthSq()<1e-8&&S.set(1,0,0).addScaledVector(L,-L.x),S.normalize(),N.crossVectors(L,S);const y=h.rig||d;for(let f=0;f<z;f++){const k=f/t*Math.PI*2,P=Math.cos(k)*h.rx,M=Math.sin(k)*h.rz;e.pos.push(h.p.x+S.x*P+N.x*M,h.p.y+S.y*P+N.y*M,h.p.z+S.z*P+N.z*M),e.nor.push(0,0,0),e.col.push(o[0],o[1],o[2]),e.k.push(p<0?p:0,s,l,p<0&&n.detail?n.detail:h.m||1),e.rig.push(y[0],y[1],y[2],y[3])}}const C=e.idx.length;for(let r=0;r<g-1;r++)for(let h=0;h<t;h++){const m=c+r*z+h,R=m+1,y=m+z,f=y+1;x?e.idx.push(m,y,R,R,y,f):e.idx.push(m,R,y,R,f,y)}const b=e.pos,w=e.nor;for(let r=C;r<e.idx.length;r+=3){const h=e.idx[r]*3,m=e.idx[r+1]*3,R=e.idx[r+2]*3;S.set(b[m]-b[h],b[m+1]-b[h+1],b[m+2]-b[h+2]),N.set(b[R]-b[h],b[R+1]-b[h+1],b[R+2]-b[h+2]),T.crossVectors(S,N);for(const y of[h,m,R])w[y]+=T.x,w[y+1]+=T.y,w[y+2]+=T.z}for(let r=0;r<g;r++){const h=(c+r*z)*3,m=(c+r*z+t)*3;for(let y=0;y<3;y++){const f=w[h+y]+w[m+y];w[h+y]=f,w[m+y]=f}const R=Math.max(i[r].rx,i[r].rz)<.001;for(let y=0;y<z;y++){const f=(c+r*z+y)*3;let k=Math.hypot(w[f],w[f+1],w[f+2]);if(R||k<1e-9){const P=i[r===0?1:r===g-1?g-2:r-1];T.subVectors(i[r].p,P.p),k=T.length()||1,w[f]=T.x/k,w[f+1]=T.y/k,w[f+2]=T.z/k}else w[f]/=k,w[f+1]/=k,w[f+2]/=k}}return p>0&&e.hulls.push([c,c+g*z,C,e.idx.length,p]),c}function ke(e,i,t,n={}){const{nseg:o=12,nring:s=6,axis:d=we,side:p=ue}=n,l=L.copy(d).normalize().clone(),a=[];for(let u=0;u<=s;u++){const x=u/s*Math.PI,c=-Math.cos(x)*t[1],g=u===0||u===s?1e-4:Math.sin(x);a.push({p:A(i.x+l.x*c,i.y+l.y*c,i.z+l.z*c),rx:t[0]*g,rz:t[2]*g})}return U(e,a,o,{...n,axis:l,side:p})}function ve(e,i,t,n={}){const{nseg:o=5,cap0:s=!0,cap1:d=!0,flat:p=1,round:l=.5}=n,a=i.length,u=[],x=g=>Array.isArray(t)?t[g]:t,c=(g,z,C)=>{const b=T.subVectors(i[g],i[z]).normalize();u[C<0?"unshift":"push"]({p:i[g].clone().addScaledVector(b,x(g)*l),rx:1e-4,rz:1e-4})};for(let g=0;g<a;g++)u.push({p:i[g],rx:x(g),rz:x(g)*p});return s&&c(0,1,-1),d&&c(a-1,a-2,1),U(e,u,o,n)}function Ae(e,i,t,n={}){return ve(e,i,t,{nseg:3,cap0:!1,cap1:!1,col:Y,...n,line:-t})}function Ce(e,i,t,n,o={}){const{nR:s=20,nr:d=5,col:p=Y,part:l=0,rig:a=O,tint:u=0,line:x=0,squash:c=1}=o,g=e.pos.length/3,z=e.idx.length;for(let C=0;C<=s;C++){const b=C/s*Math.PI*2,w=Math.cos(b),r=Math.sin(b);for(let h=0;h<=d;h++){const m=h/d*Math.PI*2,R=Math.cos(m),y=Math.sin(m);e.pos.push(i.x+y*n*c,i.y+w*(t+R*n),i.z+r*(t+R*n)),e.nor.push(y,w*R,r*R),e.col.push(p[0],p[1],p[2]),e.k.push(x<0?x:0,l,u,x<0&&o.far?2:1),e.rig.push(a[0],a[1],a[2],a[3])}}for(let C=0;C<s;C++)for(let b=0;b<d;b++){const w=g+C*(d+1)+b,r=w+1,h=w+d+1,m=h+1;e.idx.push(w,h,r,r,h,m)}return x>0&&e.hulls.push([g,e.pos.length/3,z,e.idx.length,x]),g}function Me(e,i,t,n={}){const{col:o=[1,1,1],part:s=0,rig:d=O,tint:p=0,line:l=G}=n,a=e.pos.length/3,u=e.idx.length,x=1/Math.sqrt(3);for(let c=0;c<8;c++){const g=c&1?1:-1,z=c&2?1:-1,C=c&4?1:-1;e.pos.push(g>0?t.x:i.x,z>0?t.y:i.y,C>0?t.z:i.z),e.nor.push(g*x,z*x,C*x),e.col.push(o[0],o[1],o[2]),e.k.push(0,s,p,1.35),e.rig.push(d[0],d[1],d[2],d[3])}for(const c of[[0,2,3,1],[4,5,7,6],[0,1,5,4],[2,6,7,3],[0,4,6,2],[1,3,7,5]])e.idx.push(a+c[0],a+c[1],a+c[2],a+c[0],a+c[2],a+c[3]);return l>0&&e.hulls.push([a,a+8,u,e.idx.length,l]),a}function Ee(e,i,t,n,o,s={}){const{nseg:d=10,cap0:p=!0,cap1:l=!0,m:a=1.3,flat:u=1}=s,x=[],c=1e-4;return p&&n>.001&&x.push({p:i,rx:c,rz:c}),x.push({p:i,rx:Math.max(n,c),rz:Math.max(n*u,c),m:n>.001?a:1}),x.push({p:t,rx:Math.max(o,c),rz:Math.max(o*u,c),m:o>.001?a:1}),l&&o>.001&&x.push({p:t,rx:c,rz:c}),U(e,x,d,{...s,axis:t.clone().sub(i).normalize()})}function W(e,i,t,n,o,s={}){const{col:d=[1,1,1],part:p=0,rig:l=O,tint:a=0,line:u=0,two:x=!0}=s,c=[i,t,n,o],g=e.pos.length/3,z=t.clone().sub(i).cross(o.clone().sub(i)).normalize(),C=(w,r,h,m)=>{e.pos.push(w.x,w.y,w.z),e.nor.push(r.x,r.y,r.z),e.col.push(d[0],d[1],d[2]),e.k.push(h,p,a,m),e.rig.push(l[0],l[1],l[2],l[3])},b=(w,r,h,m)=>{e.idx.push(w,r,h,w,h,m),x&&e.idx.push(w,h,r,w,m,h)};for(const w of c)C(w,z,0,1);if(b(g,g+1,g+2,g+3),u>0){const w=e.pos.length/3;for(let r=0;r<4;r++){const h=c[r].clone().sub(c[(r+3)%4]).normalize(),m=c[(r+1)%4].clone().sub(c[r]).normalize(),R=h.cross(z),y=m.cross(z),f=R.clone().add(y).normalize(),k=1/Math.max(f.dot(R),.3);C(c[r],f,u,0),C(c[r],f,u,k)}for(let r=0;r<4;r++){const h=w+r*2,m=w+(r+1)%4*2;b(h,h+1,m+1,m)}}return g}const X=[[[[.5,0],[.2,.14],[.1,.5],[.2,.86],[.5,1],[.8,.86],[.9,.5],[.8,.14],[.5,0]],[[.22,.2],[.78,.8]]],[[[.18,.7],[.5,1],[.5,0]],[[.18,0],[.82,0]]],[[[.1,.78],[.3,1],[.7,1],[.9,.8],[.88,.6],[.1,0],[.9,0]]],[[[.1,.88],[.3,1],[.7,1],[.9,.8],[.88,.66],[.55,.52],[.9,.36],[.9,.2],[.7,0],[.3,0],[.1,.12]]],[[[.7,0],[.7,1],[.1,.32],[.95,.32]]],[[[.85,1],[.2,1],[.15,.56],[.6,.6],[.9,.42],[.9,.2],[.66,0],[.3,0],[.1,.12]]],[[[.8,.94],[.5,1],[.25,.85],[.1,.5],[.1,.22],[.3,0],[.7,0],[.9,.2],[.9,.38],[.7,.56],[.3,.56],[.1,.4]]],[[[.1,1],[.9,1],[.4,0]]],[[[.5,.54],[.22,.66],[.22,.88],[.5,1],[.78,.88],[.78,.66],[.5,.54],[.14,.4],[.14,.14],[.5,0],[.86,.14],[.86,.4],[.5,.54]]],null];X[9]=X[6].map(e=>e.map(([i,t])=>[1-i,1-t]));function Le(e,i,t,n,o,s,d={}){const{col:p=Y,part:l=0,rig:a=O,two:u=!1,weight:x=.075,detail:c=.45}=d,g=e.pos.length/3,z=String(Math.max(0,Math.round(i))).slice(0,3).split("").map(Number),C=.52*s,b=.68*s,w=x*s,r=(h,m,R,y)=>{e.pos.push(t.x+n.x*h+o.x*m,t.y+n.y*h+o.y*m,t.z+n.z*h+o.z*m),e.nor.push(n.x*R+o.x*y,n.y*R+o.y*y,n.z*R+o.z*y),e.col.push(p[0],p[1],p[2]),e.k.push(-w,l,0,c),e.rig.push(a[0],a[1],a[2],a[3])};return z.forEach((h,m)=>{const R=(m-(z.length-1)/2)*b;for(const y of X[h]){const f=y.map(([M,E])=>[R+(M-.5)*C,(E-.5)*s]),k=f.length,P=e.pos.length/3;for(let M=0;M<k;M++){const E=f[Math.max(0,M-1)],Z=f[Math.min(k-1,M+1)],D=f[M],J=(te,ae)=>{const ie=ae[0]-te[0],ne=ae[1]-te[1],oe=Math.hypot(ie,ne)||1;return[-ne/oe,ie/oe]},V=J(M===0?D:E,M===0?Z:D),B=J(M===k-1?E:D,M===k-1?D:Z);let K=V[0]+B[0],_=V[1]+B[1];const ee=Math.hypot(K,_)||1;K/=ee,_/=ee;const q=Math.min(1.8,1/Math.max(K*V[0]+_*V[1],.4));r(D[0]+K*w*q,D[1]+_*w*q,K,_),r(D[0]-K*w*q,D[1]-_*w*q,-K,-_)}for(let M=0;M<k-1;M++){const E=P+M*2;e.idx.push(E+1,E+3,E,E,E+3,E+2),u&&e.idx.push(E+1,E,E+3,E,E+2,E+3)}}}),g}function Pe(e,i,t,n){for(let o=i;o<e.pos.length/3;o++)if(e.k[o*4+1]=t,n)for(let s=0;s<4;s++)e.rig[o*4+s]=typeof n=="function"?n(o,s):n[s]}const Q=(e,i)=>{for(;e.ia.length<i*4;)e.ia.push(0,0,0,F.SCALE),e.ib.push(1,1,1,0)};function Se(e,i,t,n){const o=e.pos.length/3;e.ia||(e.ia=[],e.ib=[]),Q(e,i),e.ia.length=i*4,e.ib.length=i*4;for(let s=i;s<o;s++)e.ia.push(t[0],t[1],t[2],t[3]),e.ib.push(n[0],n[1],n[2],n[3])}function me(e,i=1/0){const t=e.hulls.splice(0,Math.min(i,e.hulls.length));e.ia&&Q(e,e.pos.length/3);for(const[n,o,s,d,p]of t){const l=e.pos.length/3-n;for(let a=n;a<o;a++)e.pos.push(e.pos[a*3],e.pos[a*3+1],e.pos[a*3+2]),e.nor.push(e.nor[a*3],e.nor[a*3+1],e.nor[a*3+2]),e.col.push(e.col[a*3],e.col[a*3+1],e.col[a*3+2]),e.k.push(p,e.k[a*4+1],e.k[a*4+2],e.k[a*4+3]),e.rig.push(e.rig[a*4],e.rig[a*4+1],e.rig[a*4+2],e.rig[a*4+3]),e.ia&&(e.ia.push(e.ia[a*4],e.ia[a*4+1],e.ia[a*4+2],e.ia[a*4+3]),e.ib.push(e.ib[a*4],e.ib[a*4+1],e.ib[a*4+2],e.ib[a*4+3]));for(let a=s;a<d;a+=3)e.idx.push(e.idx[a]+l,e.idx[a+2]+l,e.idx[a+1]+l)}return e.hulls.length}async function he(e,i,t={}){for(;e.hulls.length;)me(e,60),i&&await i();const n=t.instanced?new v.InstancedBufferGeometry:new v.BufferGeometry,o=e.pos.length/3,s=i&&o>6e3;return n.setAttribute("position",new v.Float32BufferAttribute(e.pos,3)),s&&await i(),n.setAttribute("normal",new v.Float32BufferAttribute(e.nor,3)),s&&await i(),n.setAttribute("aCol",new v.Float32BufferAttribute(e.col,3)),s&&await i(),n.setAttribute("aK",new v.Float32BufferAttribute(e.k,4)),s&&await i(),n.setAttribute("aRig",new v.Float32BufferAttribute(e.rig,4)),s&&await i(),e.ia&&!t.instanced&&(Q(e,o),n.setAttribute("iA",new v.Float32BufferAttribute(e.ia,4)),n.setAttribute("iB",new v.Float32BufferAttribute(e.ib,4))),n.setIndex(o>65e3?new v.Uint32BufferAttribute(e.idx,1):new v.Uint16BufferAttribute(e.idx,1)),n.userData.triangles=e.idx.length/3,n}function Te(e,i){const t=new Float32Array(i.length*4),n=new Float32Array(i.length*4);return i.forEach((o,s)=>{t.set([o[0],o[1],o[2],o[3]],s*4),n.set([o[4],o[5],o[6],o[7]],s*4)}),e.setAttribute("iA",new v.InstancedBufferAttribute(t,4)),e.setAttribute("iB",new v.InstancedBufferAttribute(n,4)),e.instanceCount=i.length,e}function Ie(e,i,t={}){const n=e.length,o=new Float32Array(n*4),s=new Float32Array(n*4),d=new v.InstancedBufferGeometry;e.forEach((u,x)=>{const c=u.p.isVector3?[u.p.x,u.p.y,u.p.z]:u.p,g=typeof u.col=="string"?i.col(u.col):u.col||[1,1,1];o.set([c[0],c[1],c[2],u.r],x*4),s.set([g[0],g[1],g[2],u.sway||0],x*4)}),d.setAttribute("position",new v.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),d.setIndex([0,1,2,0,2,3]),d.setAttribute("iP",new v.InstancedBufferAttribute(o,4)),d.setAttribute("iC",new v.InstancedBufferAttribute(s,4));for(const[u,x]of Object.entries(t.attributes||{}))d.setAttribute(u,new v.InstancedBufferAttribute(new Float32Array(x.array),x.size));d.instanceCount=n;const p=u=>new v.ShaderMaterial({uniforms:{...i.U,uRing:{value:u},uBack:{value:u>0?t.back??.3:0},uBackK:{value:u>0?t.backShare??0:0},...t.uniforms||{}},vertexShader:`
      attribute vec4 iP, iC;
      ${le}
      uniform float uRing, uBack, uBackK;
      varying vec2 vUv; varying vec3 vCol;
      ${t.vertexPre||""}
      void main(){
        vec3 c = (modelMatrix * vec4(iP.xyz, 1.)).xyz; float r = iP.w;
        c.y += iC.w * sin(uTime * 0.9 + iP.x * 0.37 + iP.z * 0.23);
        ${t.vertexMove||""}
        vec3 toC = c - cameraPosition; float dl = max(length(toC), 1e-4); vec3 fw = toC / dl;
        vec3 rt = cross(fw, vec3(0., 1., 0.)); float rl = length(rt); rt = rl > 1e-4 ? rt / rl : vec3(1., 0., 0.);
        vec3 up = cross(rt, fw);
        vCol = iC.rgb;
        if (uRing > 0. && r > 0.) {
          vec2 l = ppLine(uRing, ppPixel(projectionMatrix * viewMatrix * vec4(c, 1.)));
          r += l.x * mix(0.75 / max(uLine.x, 0.75), 1., l.y); vCol = mix(iC.rgb, uInk, l.y);
          float bk = uBackK > 0. ? min(uBack, uBackK * dl) : uBack;      // opts.backShare: no further back than that share of its distance
          c += fw * bk; r *= (dl + bk) / dl;                             // a hair further off, the same size on the picture
        }
        vUv = position.xy;
        gl_Position = projectionMatrix * viewMatrix * vec4(c + (rt * position.x + up * position.y) * r, 1.);
      }`,fragmentShader:`
      varying vec2 vUv; varying vec3 vCol;
      void main(){ float d = dot(vUv, vUv); gl_FragColor = vec4(vCol, 1.); if (d > 1.) discard; }`}),l=new v.Group;if(l.name=t.name||"pp-discs",t.ring>0){const u=new v.Mesh(d,p(t.ring));u.frustumCulled=!1,u.name=l.name+"-line",u.renderOrder=(t.renderOrder??0)-1,l.add(u)}const a=new v.Mesh(d,p(0));return a.frustumCulled=!1,a.name=l.name+"-fill",a.renderOrder=t.renderOrder??0,l.add(a),l}const ye=`
  #define PP_BEGIN
  void ppBegin(){
    gSize = iA.w / ${I(F.SCALE)};
    gTrav = uTime * 14.; gWheelT = 0.; gCrank = gTrav / (2.5 * 0.6); gOwn = 0.;
    gTurn = 0.6109 * smoothstep(0.55, 0.95, sin(uTime * 0.5));          // the head turns toward the open lane and back, as it does on the last straight
    gPx = ppPixel(projectionMatrix * modelViewMatrix * vec4(0., 2., 0., 1.));
  }
`;async function De(e,i={}){const t=xe(i.look||"day"),n=async()=>{e&&e.yield&&await e.yield()},o=new v.Group;o.name="pp-hero";const s=F.LEADER/F.SCALE,d=6,p=3.2,l=pe(),a=t.col("road"),u=t.col("dash"),x=.02;W(l,A(p,x,-d),A(p,x,d),A(-p,x,d),A(-p,x,-d),{col:a,two:!0,line:0});for(const f of[-1,1])W(l,A(f*p+.07,x+.01,-d),A(f*p+.07,x+.01,d),A(f*p-.07,x+.01,d),A(f*p-.07,x+.01,-d),{col:Y,two:!0});for(const f of[-4.2,1.8])W(l,A(-1.9+.17,x+.01,f),A(-1.9+.17,x+.01,f+3.2),A(-1.9-.17,x+.01,f+3.2),A(-1.9-.17,x+.01,f),{col:u,two:!0});const c=t.col("shadow"),g=l.pos.length/3,z=16;l.pos.push(.5,x+.02,.3);for(let f=0;f<z;f++){const k=f/z*Math.PI*2;l.pos.push(.5+Math.sin(k)*1.1+.9*(1-Math.cos(k))*.5,x+.02,.3+Math.cos(k)*3.3)}for(let f=0;f<=z;f++)l.nor.push(0,1,0),l.col.push(c[0],c[1],c[2]),l.k.push(0,0,0,1),l.rig.push(0,0,0,0);for(let f=0;f<z;f++)l.idx.push(g,g+1+f,g+1+(f+1)%z);const C=new v.Mesh(await he(l,n),ce(t.U));C.name="pp-hero-road",o.add(C),await n();const b=pe(),w={n:0,o:0,own:0,size:F.LEADER,livery:"red",bib:1,band:"leader",kind:"leader"},r=await fe(b,t,w,n),h=ce(t.U,b.rigs||r.rig,{vertexPre:ye,vertexMove:"p *= gSize;"}),m=de(await he(b,n),null,h);m.name="pp-hero-leader",o.add(m);const R=new v.Vector2,y=new v.Vector3;return{object:o,radius:4.4,height:6.3,center:A(0,3,.2),anchors:{saddle:A(0,1.78*s,-.62*s),headTop:A(0,4.84*s,.5*s),billTip:A(0,3.78*s,2.3*s),ahead:A(0,0,1)},triangles:m.geometry.userData.triangles,update(f,k,P){t.U.uTime.value=k,e&&e.renderer&&(t.U.uResY.value=e.renderer.getDrawingBufferSize(R).y),P&&t.U.uCamP.value.copy(P.getWorldPosition(y))},dispose(){},ground:!0,groundY:0}}export{H as LOOKS,le as PP_GLSL,se as PT_MIN,me as appendHulls,ke as ball,Me as box,De as buildHero,Ee as cone,Le as digits,he as finish,ce as flatMaterial,Re as lineOf,U as loft,pe as makeBuilder,Ie as makeDiscs,xe as makeLook,W as plate,Ce as ring,Te as setInstances,Pe as setPart,Se as setRow,Ae as stroke,ve as tube};
