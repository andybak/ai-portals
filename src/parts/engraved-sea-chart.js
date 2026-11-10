import*as p from"three";const ct=["#EBDCB6","#CDB88A","#8A6A45","#3B2616","#7FAE9C","#C8687A","#E2A93A"],de=`
uniform vec3 uPaper, uAged, uInkFar, uInk, uWashA, uWashB, uGold;
uniform vec3 uKey;
uniform float uTime;
float eHash(float n){ return fract(sin(n*127.1+1.7)*43758.5453); }
float eHash2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float eN1(float x){ float i=floor(x), f=x-i; f=f*f*(3.-2.*f); return mix(eHash(i), eHash(i+1.), f); }
float eN2(vec2 p){ vec2 i=floor(p), f=p-i; f=f*f*(3.-2.*f);
  return mix(mix(eHash2(i), eHash2(i+vec2(1.,0.)), f.x), mix(eHash2(i+vec2(0.,1.)), eHash2(i+vec2(1.,1.)), f.x), f.y); }
float eN3(vec3 p){ float z=floor(p.z), f=p.z-z; f=f*f*(3.-2.*f);
  return mix(eN2(p.xy+z*vec2(37.,17.)), eN2(p.xy+(z+1.)*vec2(37.,17.)), f); }
// One family of lines along constant v. u runs along the line, w = fwidth(v) (take it BEFORE any loop).
// The pitch snaps to the power of two that puts lines 7-14 px apart and cross-fades between octaves:
// new lines grow between the old ones while the old ones thin, so the mean tint never jumps.
float eLines(float v, float u, float w, float tone){
  w = clamp(w, 1e-5, 64.);
  float lfr = -log2(w*7.);
  float lf = clamp(lfr, -5., 7.);
  float k = floor(lf), b = lf-k;
  float F = exp2(k+1.);
  float x = v*F, px = w*F;
  float hw = mix(.05, .3, tone)*smoothstep(.015, .09, tone);
  float ne = 2.*floor(x*.5+.5), no = 2.*floor(x*.5)+1.;
  float th = mix(.66, -.5, smoothstep(.03, .36, tone));
  float ue = u*F*.021;
  float me = mix(eN1(ue+eHash(ne/F)*91.), eN1(ue*2.+eHash(ne/F)*91.), b);
  float mo = mix(eN1(ue+eHash(no/F)*91.), eN1(ue*2.+eHash(no/F)*91.), b);
  float we = hw*(2.-b)*smoothstep(th, th+.42, me);
  float wo = hw*b*smoothstep(th, th+.42, mo);
  float aa = .62*px;
  float ce = 1.-smoothstep(we-aa, we+aa, abs(x-ne));
  float co = 1.-smoothstep(wo-aa, wo+aa, abs(x-no));
  float c = max(ce*step(1e-4, we), co*step(1e-4, wo));
  float mean = clamp(hw*2.*smoothstep(th-.2, th+.6, .5), 0., 1.);
  return mix(c, mean, smoothstep(0., 1.2, lf-lfr));       // coarsest octave too fine: dissolve to tint
}
// Full engraving: first family, the 35 degree cross above tone .5, a dot in each lozenge above .8.
float eInk(float tone, vec2 h, float w){
  tone = clamp(tone, 0., 1.);
  float c = eLines(h.x, h.y, w, tone);
  float t2 = smoothstep(.48, .74, tone);
  vec2 r = vec2(.8192*h.x+.5736*h.y, -.5736*h.x+.8192*h.y);
  float c2 = eLines(r.x, r.y, w, tone*t2*.82);
  c = max(c, c2*step(.001, t2));
  float td = smoothstep(.78, .98, tone);
  float wc = clamp(w, 1e-5, 64.);
  float lf = clamp(-log2(wc*7.), -5., 7.);
  float k = floor(lf), b = lf-k, F = exp2(k+1.);
  vec2 q = vec2(h.x, r.x)*F; float aa = .7*wc*F;
  vec2 qa = q-(2.*floor(q*.5)+1.);
  vec2 qb = fract(q)-.5;
  float da = 1.-smoothstep(.3*(1.-b)-aa, .3*(1.-b)+aa, length(qa));
  float db = 1.-smoothstep(.15*b-aa, .15*b+aa, length(qb));
  c = max(c, max(da*(1.-b), db*b)*td*step(lf+.001, 7.));
  return clamp(c, 0., 1.);
}
// Antialiased ink line where d (in the units of wd = fwidth(d)) is within px pixels of zero.
float eEdge(float d, float wd, float px){ wd = max(wd, 1e-6); return 1.-smoothstep(px-.7, px+.7, abs(d)/wd); }
// Laid paper grain, anchored to the dome: pass the view direction (world).
float eGrain(vec3 dir){
  vec3 d = normalize(dir+vec3(1e-5));
  float laid = .5+.5*sin(d.y*900.+eN2(d.xz*9.)*3.);
  return .55*eN3(d*210.)+.3*eN3(d*37.)+.15*laid;
}
// Paper + wash + ink + distance. fog 0..1; fogCol is the world's vellum.
vec3 eCompose(float cov, vec3 wash, float washAmt, float fog, vec3 fogCol, float grain){
  vec3 paper = uPaper*(.9+.08*grain);
  vec3 fill = mix(paper, paper*wash*1.25+wash*.12, clamp(washAmt, 0., 1.));
  vec3 ink = mix(uInk*1.5, uInkFar, smoothstep(0., .5, fog));
  vec3 col = mix(fill, ink, cov*(1.-.85*smoothstep(.45, 1., fog)));
  return mix(col, fogCol, smoothstep(.3, 1., fog));
}
`,ie=`
#include <fog_pars_fragment>
float eFog(){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return clamp(1.-exp(-fogDensity*fogDensity*vFogDepth*vFogDepth), 0., 1.);
    #else
      return smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #else
    return 0.;
  #endif
}
vec3 eFogCol(){
  #ifdef USE_FOG
    return fogColor;
  #else
    return uPaper*.94;
  #endif
}
`;function Qe(e=ct,n=[-.82,.5,.28]){const t=e.map(m=>new p.Color(m));return{uPaper:{value:t[0]},uAged:{value:t[1]},uInkFar:{value:t[2]},uInk:{value:t[3]},uWashA:{value:t[4]},uWashB:{value:t[5]},uGold:{value:t[6]},uKey:{value:new p.Vector3(n[0],n[1],n[2]).normalize()},uTime:{value:0}}}function xt(e,n){return n==="A"||n===void 0?e.uWashA:n==="B"?e.uWashB:n==="gold"?e.uGold:n==="none"?e.uPaper:{value:new p.Color(n)}}function Mt(e={}){const n=e.uniforms||Qe(e.palette,e.keyDir),t=e.hatch||"world";return new p.ShaderMaterial({fog:!0,side:e.side??p.FrontSide,uniforms:{...p.UniformsUtils.clone(p.UniformsLib.fog),...n,uWash:xt(n,e.wash),uWashAmt:{value:e.wash==="none"?0:e.washAmt??.3},uToneBias:{value:e.tone??0},uHScale:{value:e.hatchScale??1}},vertexShader:`
      ${t==="attr"?"attribute vec2 aHatch;":""}
      varying vec3 vWP, vWN; varying vec2 vH;
      #include <fog_pars_vertex>
      void main(){
        vec4 wp = modelMatrix*vec4(position, 1.);
        vWP = wp.xyz; vWN = normalize(mat3(modelMatrix)*normal);
        ${t==="attr"?"vH = aHatch;":t==="uv"?"vH = uv;":"vH = vec2(wp.y*1.3+dot(wp.xz, vec2(.31,.17)), dot(wp.xz, vec2(.8,-.6)));"}
        vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${de}
      ${ie}
      uniform vec3 uWash; uniform float uWashAmt, uToneBias, uHScale;
      varying vec3 vWP, vWN; varying vec2 vH;
      void main(){
        vec2 h = vH*uHScale; float w = fwidth(h.x);
        vec3 N = normalize(vWN); if(!gl_FrontFacing) N = -N;
        float tone = clamp(.86*smoothstep(.7, -.9, dot(N, uKey))+.12*smoothstep(.1, -.9, N.y)+uToneBias, 0., 1.);
        float cov = eInk(tone, h, w);
        vec3 col = eCompose(cov, uWash, uWashAmt*(.8+.5*tone), eFog(), eFogCol(), eGrain(vWP-cameraPosition));
        gl_FragColor = vec4(col, 1.);
      }`})}function yt(e={}){const n=e.uniforms||Qe(e.palette,e.keyDir);return new p.ShaderMaterial({fog:!0,side:p.BackSide,uniforms:{...p.UniformsUtils.clone(p.UniformsLib.fog),...n,uResY:e.resY||{value:900},uPxW:{value:e.px??2.4}},vertexShader:`
      uniform vec3 uKey; uniform float uResY, uPxW;
      #include <fog_pars_vertex>
      void main(){
        vec4 wp = modelMatrix*vec4(position, 1.);
        vec3 wn = normalize(mat3(modelMatrix)*normal);
        float depth = max(-(viewMatrix*wp).z, .1);
        float k = 2./(projectionMatrix[1][1]*uResY);
        wp.xyz += wn*depth*k*uPxW*(1.+.7*clamp(-dot(wn, uKey), 0., 1.));
        vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uPaper, uInk, uInkFar;
      ${ie}
      void main(){
        float f = eFog();
        vec3 ink = mix(uInk, uInkFar, smoothstep(0., .5, f));
        gl_FragColor = vec4(mix(ink, eFogCol(), smoothstep(.3, 1., f)), 1.);
      }`})}const Ke=`
uniform sampler2D uSpine; uniform float uSpN, uSpLen, uTime, uJaw, uLift;
attribute float aS; attribute vec4 aP; attribute vec2 aH; attribute float aSkin;
void spineFrame(float s, out vec3 P, out vec3 T, out vec3 N, out float g){
  float x = clamp(s/uSpLen, 0., 1.)*(uSpN-1.);
  float i = min(floor(x), uSpN-2.); float f = x-i;
  ivec2 a = ivec2(int(i), 0), b = ivec2(int(i)+1, 0);
  vec4 h0 = texelFetch(uSpine, a, 0), h1 = texelFetch(uSpine, b, 0);
  vec4 l0 = texelFetch(uSpine, a+ivec2(0,1), 0), l1 = texelFetch(uSpine, b+ivec2(0,1), 0);
  vec4 n0 = texelFetch(uSpine, a+ivec2(0,2), 0), n1 = texelFetch(uSpine, b+ivec2(0,2), 0);
  vec4 t0 = texelFetch(uSpine, a+ivec2(0,3), 0), t1 = texelFetch(uSpine, b+ivec2(0,3), 0);
  P = mix(h0.xyz+l0.xyz, h1.xyz+l1.xyz, f); g = mix(h0.w, h1.w, f);
  N = normalize(mix(n0.xyz, n1.xyz, f)+vec3(0., 1e-5, 0.));
  T = normalize(mix(t0.xyz, t1.xyz, f)+vec3(0., 0., 1e-5));
}
// local-space position and normal of this vertex on the posed, animated animal
void serpentVertex(out vec3 wp, out vec3 wn){
  vec3 P, T, N; float g; spineFrame(aS, P, T, N, g);
  vec3 B = normalize(cross(N, T)+vec3(1e-5, 0., 0.));
  vec3 lp = position, ln = normal;
  float kind = aP.w;
  if((kind > 3.5 && kind < 4.5) || aSkin > 50.){      // lower jaw (and what grows on it): hinge about the b axis
    float a = uJaw, c = cos(a), sn = sin(a);
    vec2 q = lp.yz-vec2(-.5, 2.6);
    lp.yz = vec2(-.5, 2.6)+vec2(q.x*c-q.y*sn, q.x*sn+q.y*c);
    ln.yz = vec2(ln.y*c-ln.z*sn, ln.y*sn+ln.z*c);
  }
  float gs = aSkin < -.5 ? g : 1.;
  wp = P+B*(lp.x*gs)+N*(lp.y*gs+(aSkin > 50. ? 0. : max(aSkin, 0.))*(g-1.))+T*lp.z;
  wn = normalize(B*ln.x+N*ln.y+T*ln.z+vec3(0., 1e-5, 0.));
  if(kind > .5 && kind < 1.5){                        // scute: the free edge lifts in travelling ripples
    float rip = max(0., sin(aS*.085-uTime*1.25+aH.y*.35));
    wp += wn*aP.z*uLift*(.18+.82*rip*rip);
  } else if(kind > 1.5 && kind < 2.5){                // fin: fans and ripples (A across, B out along the rays)
    float ph = uTime*1.15+aP.y*.55-aP.z*2.7+aS*.05;
    wp += wn*sin(ph)*aP.z*aP.z*1.5+T*(aP.y-4.)*aP.z*sin(uTime*.55+aS*.02)*.28;
  } else if(kind > 2.5 && kind < 3.5){                // wrack: hangs under gravity from its anchor, streaming
    float d = aP.y;
    wp.y -= d;
    wp += T*ln.x+(T*sin(uTime*1.3+aP.z+d*.55)+B*cos(uTime*.9+aP.z*1.7+d*.4))*d*.075;
    wn = normalize(B*sign(lp.x+1e-4)+T*.3*sin(d*1.7+aP.z));
  } else if(kind > 4.5 && kind < 5.5){                // barbel / tongue / mane: sways from the root
    float a2 = aP.y*aP.y;
    wp += (B*sin(uTime*1.2+aP.z+aP.y*3.)+T*cos(uTime*.8+aP.z*2.+aP.y*2.5)*.6)*a2*1.1;
    wp.y -= a2*.6*(1.+sin(uTime*.7+aP.z));
  } else if(kind > 5.5 && kind < 6.5){                // dorsal fin: a wave runs down the membrane
    float a2 = aP.z*aP.z;
    wp += B*sin(uTime*1.4-aS*.21)*a2*.55-T*a2*(.5+.5*sin(uTime*.5-aS*.03))*.9;
  }
}
`,bt=`
${de}
${ie}
uniform vec3 uLook; uniform float uFinSel, uWet;
varying vec3 vWP, vWN; varying vec2 vH; varying vec4 vP; varying float vLY;
// fish-scale lattice: p.x columns, p.y rows toward the head. returns (inset from the free edge,
// distance outside the scales lying on top, id hash)
vec3 eScales(vec2 p){
  float j = floor(p.y), R = .78;
  float o1 = .5*mod(j+1., 2.), o0 = .5*mod(j, 2.);
  vec2 c2 = vec2(floor(p.x-o0+.5)+o0, j+2.);
  vec2 c1 = vec2(floor(p.x-o1+.5)+o1, j+1.);
  vec2 c0 = vec2(floor(p.x-o0+.5)+o0, j);
  vec2 cm = vec2(floor(p.x-o1+.5)+o1, j-1.);
  float d2 = length(p-c2), d1 = length(p-c1), d0 = length(p-c0), dm = length(p-cm);
  float e, sh; vec2 id;
  if(d1 < R){ e = R-d1; sh = d2-R; id = c1; }
  else if(d0 < R){ e = R-d0; sh = d1-R; id = c0; }
  else { e = R-dm; sh = min(d1, d0)-R; id = cm; }
  return vec3(e, sh, eHash2(id));
}
void main(){
  vec3 N = normalize(vWN); if(!gl_FrontFacing) N = -N;
  float mat = floor(vP.x+.5);
  float w = fwidth(vH.x);
  vec2 sp = vec2(vH.y/.9425, vH.x/.9);
  if(mat > 4.5 && mat < 5.5) sp *= 2.;
  vec2 fs2 = fwidth(sp); float fp = max(fs2.x, fs2.y);
  float fA = fwidth(vP.y), fB = fwidth(vP.z);
  vec3 V = normalize(cameraPosition-vWP);
  float ndl = dot(N, uKey);
  float tone = .86*smoothstep(.7, -.9, ndl);
  tone += .12*smoothstep(.1, -.9, N.y);
  float wetBand = smoothstep(9., 0., vLY);              // darker, wetter toward the waterline
  vec3 wash = uWashA; float washAmt = .3; float edge = 0.; vec3 emis = vec3(0.); float gold = 0.;
  vec2 h = vH;
  if(mat < .5 || (mat > 4.5 && mat < 5.5)){             // skin: scale lattice
    vec3 sc = eScales(sp);
    float far = 1.-smoothstep(.14, .36, fp);
    tone = max(tone, .11);
    edge = (1.-smoothstep(.5*fp, 1.6*fp, sc.x))*far*(.45+.5*tone);
    tone += ((1.-smoothstep(0., .34, sc.y))*.3+(sc.z-.5)*.1)*far+.07*(1.-far);
    tone += .1*wetBand;
    washAmt = .34+.3*tone+.12*sc.z;
  } else if(mat < 1.5){                                 // belly plate: A = 0 leading edge .. 1 free edge
    tone = max(tone*.6, .13)+.55*smoothstep(.62, 0., vP.y);
    edge = max(eEdge(1.-vP.y, fA, 1.3), eEdge(abs(vP.z-.5)-.167, fB, .9)*.55);
    wash = uAged; washAmt = .55;
    h = vec2(vH.y*.6, vH.x);                            // hatch runs along the plates, across the belly
    w = fwidth(h.x);
  } else if(mat < 2.5){                                 // raised scute: A = rim .. centre, B = base .. tip
    tone = tone*.85+.3*(1.-vP.z);
    edge = eEdge(vP.y, fA, 1.2);
    washAmt = .34+.3*tone;
  } else if(mat < 3.5 || mat > 9.5){                    // membrane: A across the rays, B base .. edge (10 = always rose)
    wash = mat > 9.5 ? uWashB : mix(uWashB, uWashA, uFinSel); washAmt = .66+.2*tone;
    tone = .07+.34*tone+.16*smoothstep(.8, 1., vP.z);
    edge = max(eEdge(1.-vP.z, fB, 1.4), eEdge(vP.z, fB, 1.));
    edge = max(edge, eEdge(fract(vP.y+.5)-.5, fA, 1.15)*(.35+.65*(1.-vP.z)));   // the rays
  } else if(mat < 4.5){                                 // bone: spines, tusks, teeth, horns
    tone *= .7; wash = uAged; washAmt = .35;
  } else if(mat < 6.5){                                 // eye: gold-leaf iris, slit pupil tracking the camera
    vec2 e2 = vH; float sgn = vP.y;
    float fac = max(uLook.x*sgn, .3);
    vec2 c = clamp(vec2(uLook.z, uLook.y)/fac*.34, -.42, .42)*step(0., uLook.x*sgn);
    vec2 q = e2-c; float r = length(q);
    float fr = fwidth(r)+1e-4;
    float iris = 1.-smoothstep(.56-fr, .56+fr, r);
    float pup = 1.-smoothstep(1.-fr*2., 1.+fr*2., length(q/vec2(.11, .47)));
    float ring = eEdge(r-.56, fr, 1.5);
    float spark = .75+.5*eN2(q*9.+uTime*.6)+.25*sin(atan(q.y, q.x+1e-5)*24.);
    gold = iris*(1.-pup);
    emis = uGold*2.5*spark*gold;
    edge = max(max(pup, ring), smoothstep(.86, 1., length(e2)));
    tone = .1+.5*smoothstep(.5, 1., length(e2)); wash = uPaper; washAmt = 0.;
    h = vec2(r*3., atan(q.y, q.x+1e-5)); w = fr*3.;
  } else if(mat < 7.5){                                 // wrack and barbels
    tone = .2+.35*tone; washAmt = .75;
    edge = eEdge(abs(vP.y-floor(vP.y+.5))-.5, fA, .0)*0.;
  } else if(mat < 8.5){                                 // barnacle: A = 0 foot .. 1 crater
    tone = tone*.7+.6*smoothstep(.72, .95, vP.y);
    edge = eEdge(vP.y-.74, fA, 1.1);
    wash = uPaper; washAmt = 0.;
  } else {                                              // mouth, tongue
    wash = uWashB; washAmt = .85; tone = .58+.4*tone;
  }
  float cov = max(eInk(tone, h, w), edge);
  float fog = eFog();
  vec3 col = eCompose(cov*(1.-gold), wash, washAmt, fog, eFogCol(), eGrain(-V));
  gl_FragColor = vec4(mix(col, emis, gold*(1.-fog)), 1.);
}
`;function Pt(e,n){const t={...p.UniformsUtils.clone(p.UniformsLib.fog),...e,...n},m=new p.ShaderMaterial({fog:!0,side:p.DoubleSide,uniforms:t,vertexShader:`
      ${Ke}
      varying vec3 vWP, vWN; varying vec2 vH; varying vec4 vP; varying float vLY;
      #include <fog_pars_vertex>
      void main(){
        vec3 lp, ln; serpentVertex(lp, ln);
        vec4 wp = modelMatrix*vec4(lp, 1.);
        vWP = wp.xyz; vWN = normalize(mat3(modelMatrix)*ln); vH = aH; vP = aP; vLY = lp.y;
        vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:bt}),P=new p.ShaderMaterial({fog:!0,side:p.BackSide,uniforms:{...p.UniformsUtils.clone(p.UniformsLib.fog),...e,...n},vertexShader:`
      ${Ke}
      uniform vec3 uKey; uniform float uResY;
      #include <fog_pars_vertex>
      void main(){
        vec3 lp, ln; serpentVertex(lp, ln);
        vec4 wp = modelMatrix*vec4(lp, 1.);
        vec3 wn = normalize(mat3(modelMatrix)*ln);
        float depth = max(-(viewMatrix*wp).z, .1);
        float k = 2./(projectionMatrix[1][1]*uResY);
        wp.xyz += wn*min(depth*k*2.3*(1.+.75*clamp(-dot(wn, uKey), 0., 1.)), .6);
        vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uPaper, uInk, uInkFar;
      ${ie}
      void main(){
        float f = eFog();
        vec3 ink = mix(uInk, uInkFar, smoothstep(0., .5, f));
        gl_FragColor = vec4(mix(ink, eFogCol(), smoothstep(.3, 1., f)), 1.);
      }`}),d=new p.ShaderMaterial({fog:!0,side:p.BackSide,transparent:!0,depthWrite:!1,uniforms:{...p.UniformsUtils.clone(p.UniformsLib.fog),...e,...n},vertexShader:`
      ${Ke}
      uniform float uResY;
      varying vec3 vWP; varying float vS;
      #include <fog_pars_vertex>
      void main(){
        vec3 lp, ln; serpentVertex(lp, ln);
        float cr = .5+.5*sin(aS*.13+aH.y*.9+uTime*.22);
        float dpx = max(-(modelViewMatrix*vec4(lp, 1.)).z, .1)*2./(projectionMatrix[1][1]*uResY);
        lp += ln*max(.35+.7*cr, dpx*(4.+6.*cr));
        vec4 wp = modelMatrix*vec4(lp, 1.);
        vWP = wp.xyz; vS = aS;
        vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${de}
      ${ie}
      varying vec3 vWP; varying float vS;
      void main(){
        float n = eN3(vWP*.22+vec3(0., uTime*.05, 0.));
        float a = (.26+.26*n)*(1.-smoothstep(.25, .9, eFog()));
        vec3 paper = uPaper*.94;
        gl_FragColor = vec4(paper*uWashA*1.25+uWashA*.12, a);
      }`});return{main:m,hull:P,wash:d}}function Ye(){const e=[],n=[],t=[],m=[],P=[],d=[],y=[],z={n:0,v(g,x,k,v,w,u,h,A,S,c,l,i,r,s){return e.push(g,x,k),n.push(v,w,u),t.push(h),m.push(A,S),P.push(c,l,i,r),d.push(s),z.n++},tri(g,x,k){y.push(g,x,k)},setNormal(g,x,k,v){n[g*3]=x,n[g*3+1]=k,n[g*3+2]=v},quad(g,x,k,v){y.push(g,x,k,g,k,v)},mark(){return[z.n,y.length]},tris(){return y.length/3},smooth(g,x=!0,k=!0){const[v,w]=g,u=z.n-v,h=new Float32Array(u*3),A=new Int32Array(u);if(k){const s=new Map;for(let a=0;a<u;a++){const f=(v+a)*3,b=Math.round(e[f]*400)*1048573+Math.round(e[f+1]*400)*8191+Math.round(e[f+2]*400);let o=s.get(b);o===void 0&&(o=a,s.set(b,a)),A[a]=o}}else for(let s=0;s<u;s++)A[s]=s;let S=0,c=0,l=0;for(let s=0;s<u;s++){const a=(v+s)*3;S+=e[a],c+=e[a+1],l+=e[a+2]}S/=u,c/=u,l/=u;let i=0;for(let s=w;s<y.length;s+=3){const a=y[s]*3,f=y[s+1]*3,b=y[s+2]*3,o=e[f]-e[a],B=e[f+1]-e[a+1],M=e[f+2]-e[a+2],R=e[b]-e[a],T=e[b+1]-e[a+1],V=e[b+2]-e[a+2],W=B*V-M*T,C=M*R-o*V,N=o*T-B*R;i+=W*(e[a]-S)+C*(e[a+1]-c)+N*(e[a+2]-l);for(const q of[y[s],y[s+1],y[s+2]]){const O=A[q-v]*3;h[O]+=W,h[O+1]+=C,h[O+2]+=N}}const r=x&&i<0;if(r)for(let s=w;s<y.length;s+=3){const a=y[s+1];y[s+1]=y[s+2],y[s+2]=a}for(let s=0;s<u;s++){const a=A[s]*3,f=Math.hypot(h[a],h[a+1],h[a+2])||1,b=r?-1:1,o=(v+s)*3;n[o]=b*h[a]/f,n[o+1]=b*h[a+1]/f,n[o+2]=b*h[a+2]/f}},grid(g,x,k){const v=z.n;for(let w=0;w<=g;w++)for(let u=0;u<=x;u++){const h=k(w/g,u/x,w,u);z.v(h[0],h[1],h[2],0,1,0,h[3],h[4],h[5],h[6],h[7],h[8],h[9],h[10])}for(let w=0;w<g;w++)for(let u=0;u<x;u++){const h=v+w*(x+1)+u;z.quad(h,h+x+1,h+x+2,h+1)}return v},build(){const g=new p.BufferGeometry;return g.setAttribute("position",new p.Float32BufferAttribute(e,3)),g.setAttribute("normal",new p.Float32BufferAttribute(n,3)),g.setAttribute("aS",new p.Float32BufferAttribute(t,1)),g.setAttribute("aH",new p.Float32BufferAttribute(m,2)),g.setAttribute("aP",new p.Float32BufferAttribute(P,4)),g.setAttribute("aSkin",new p.Float32BufferAttribute(d,1)),g.setIndex(y),g.boundingSphere=new p.Sphere(new p.Vector3(0,20,0),400),g}};return z}function D(e,n){const t=e.length;if(n<=e[0][0])return e[0][1];if(n>=e[t-1][0])return e[t-1][1];let m=0;for(;m<t-2&&n>e[m+1][0];)m++;const P=e[Math.max(0,m-1)][1],d=e[m][1],y=e[m+1][1],z=e[Math.min(t-1,m+2)][1],g=(n-e[m][0])/(e[m+1][0]-e[m][0]),x=g*g,k=x*g;return .5*(2*d+(y-P)*g+(2*P-5*d+4*y-z)*x+(3*d-P-3*y+z)*k)}const H=(e,n,t)=>{const m=Math.min(1,Math.max(0,(t-e)/(n-e)));return m*m*(3-2*m)},Be=[.866,-.5],ft=[.5,.866],_=256;function zt(e){const n=(o,B)=>new p.Vector3(o*Be[0]+B*ft[0],0,o*Be[1]+B*ft[1]),t=e.range(16,30)*(e.chance(.8)?1:-.6),m=new p.CatmullRomCurve3([n(-164,t),n(-151,t*.5),n(-136,t*.14),n(-116,0),n(-63.6,0),n(0,0),n(63.6,0),n(90,0),new p.Vector3(92,0,-62),new p.Vector3(86,0,-80),new p.Vector3(72,0,-91),new p.Vector3(56,0,-96.5),new p.Vector3(42,0,-95.5),new p.Vector3(33.5,0,-89.5),new p.Vector3(30.6,0,-82.5),new p.Vector3(29.6,0,-78)],!1,"centripetal"),P=1500,d=m.getSpacedPoints(P),y=m.getLength(),z=y/P,g=[40.5*e.range(.96,1.04),40.5,40.5*e.range(.96,1.04)],x=[-63.6,0,63.6];let k=0,v=P;for(let o=0;o<=P;o++){const B=d[o].x*Be[0]+d[o].z*Be[1];B<-89&&(k=o),v===P&&B>=89&&(v=o)}const w=e.range(30,38),u=e.range(.5,2.6),h=[[0,-10],[12,-9.5],[22,-4],[w,u],[w+13,-4.5],[w+24,-6],[y*k/P-9,.5],[y*k/P,7.5]],A=[[0,16.6],[6,17.3],[13,19.8],[21,18],[28,10],[34,2],[41,-6],[50,-10]],S=new Float32Array(P+1),c=new Float32Array(P+1),l=new Float32Array(P+1),i=new Float32Array((P+1)*5),r=new Float32Array(P+1);for(let o=0;o<=P;o++){const B=o*z,M=d[o].x*Be[0]+d[o].z*Be[1];let R,T=4.5;const V=[0,0,0,0,0];if(o<=k){const W=(k-o)*z;R=D(h,W),T=.95+3.55*Math.pow(1-H(8,y*k/P,W),.7),V[0]=1}else if(o>=v){const W=(P-o)*z;R=D(A,W),T=3+1.5*H(4,58,W),V[4]=1}else{R=-1e9;for(let Q=0;Q<3;Q++){const he=Math.abs(M-x[Q])/22;R=Math.max(R,g[Q]*(1-he*he*he))}const W=3;R=Math.log(Math.exp(W*Math.max(R,-40)/10)+Math.exp(-W))*10/W;const C=1-H(-37.8,-25.8,M),N=H(25.8,37.8,M);V[1]=C,V[3]=N,V[2]=1-C-N;const q=H(-89,-80,M),O=1-H(80,89,M);V[0]=1-q,V[1]*=q,V[4]=1-O,V[3]*=O}S[o]=R,c[o]=T,r[o]=(P-o)*z;for(let W=0;W<5;W++)i[o*5+W]=V[W];o>0&&(l[o]=l[o-1]+Math.hypot(d[o].x-d[o-1].x,R-S[o-1],d[o].z-d[o-1].z))}const s=l[P],a={L:s,N:_,x:new Float32Array(_),y:new Float32Array(_),z:new Float32Array(_),ex:new Float32Array(_),ez:new Float32Array(_),R:new Float32Array(_),reg:new Float32Array(_*5),g:new Float32Array(_),crownH:g,sNeck:0,sTailEnd:0};let f=0;for(let o=0;o<_;o++){const B=o/(_-1)*s;for(;f<P-1&&l[f+1]<B;)f++;const M=Math.min(1,Math.max(0,(B-l[f])/Math.max(1e-6,l[f+1]-l[f])));a.x[o]=d[f].x+(d[f+1].x-d[f].x)*M,a.z[o]=d[f].z+(d[f+1].z-d[f].z)*M,a.y[o]=S[f]+(S[f+1]-S[f])*M,a.R[o]=c[f]+(c[f+1]-c[f])*M,a.g[o]=r[f]+(r[f+1]-r[f])*M;const R=Math.max(0,f-3),T=Math.min(P,f+4),V=d[T].x-d[R].x,W=d[T].z-d[R].z,C=Math.hypot(V,W)||1;a.ex[o]=V/C,a.ez[o]=W/C;for(let N=0;N<5;N++)a.reg[o*5+N]=i[f*5+N]+(i[(f+1)*5+N]-i[f*5+N])*M}a.sNeck=l[v],a.sTailEnd=l[k];const b=(o,B)=>{const M=Math.min(1,Math.max(0,B/s))*(_-1),R=Math.min(_-2,Math.floor(M)),T=M-R;return o[R]+(o[R+1]-o[R])*T};return a.radAt=o=>b(a.R,o),a.yAt=o=>b(a.y,o),a.regAt=(o,B)=>{const M=Math.min(1,Math.max(0,o/s))*(_-1),R=Math.min(_-2,Math.floor(M));return a.reg[R*5+B]},a}const qe=4.5,St=.9425,ht=.9;function fe(e,n){const t=Math.cos(e),m=Math.sin(e);let P=t>=-.7?t:-.7-(-t-.7)*.5;return P=P*1.03+.1*Math.exp(-(e/.3)*(e/.3)),[m*n*.98,P*n]}async function ut(e,n,t,m,P,d,y){const z=Math.ceil(n.L/t);for(let x=0;x<=z;x++){y&&x%24===23&&await y();const k=x/z*n.L;let v=n.radAt(k)*(1+.035*P.n2(k*.045,d));x===0&&(v=.03);for(let w=0;w<=m;w++){const u=w/m*Math.PI*2-Math.PI,h=fe(u,v);e.v(h[0],h[1],0,Math.sin(u),Math.cos(u),0,k,k,u*qe,0,0,0,0,-1)}}const g=e.n-(z+1)*(m+1);for(let x=0;x<z;x++){y&&x%48===47&&await y();for(let k=0;k<m;k++){const v=g+x*(m+1)+k;e.quad(v,v+m+1,v+m+2,v+1)}}}async function kt(e,n,t){let m=0;const P=.98,d=9,y=[[.92,1.006,0],[-1.05,1.055,1],[-.95,.99,1]];for(let z=5;z<n.L-1.2;z+=1.7){(++m&31)===0&&await t();const g=n.radAt(z);if(g<2.2)continue;const x=e.mark(),k=e.n;for(let v=0;v<3;v++)for(let w=0;w<=d;w++){const u=w/d,h=u*2-1,A=Math.PI+h*P,S=Math.cos(h*Math.PI*3),c=fe(A,g*(y[v][1]+(v<2?.02+.02*S:0))*(1-.012*Math.abs(h))),l=y[v][0]-(v>0?.14*S:0);e.v(c[0],c[1],l,0,-1,0,z,z+l,A*qe,1,y[v][2],u,0,-1)}for(let v=0;v<2;v++)for(let w=0;w<d;w++){const u=k+v*(d+1)+w;e.quad(u,u+1,u+d+2,u+d+1)}e.smooth(x,!0,!1)}}async function At(e,n,t,m){const P=[[-.5,.2],[0,.36],[.5,.2],[.64,-.26],[0,-.92],[-.64,-.26]],d=[0,0,0,.55,1,.55],y=Math.floor(n.L/ht);for(let z=6;z<y-6;z++){(z&31)===0&&await m();const g=z*ht,x=n.radAt(g);if(x<2||n.yAt(g)<-6)continue;const k=[1,2,-2,-3,7,-8];z%3===0&&k.push(4,-5);for(const v of k){const w=(v+.5*(z%2))*St,u=w/qe,h=x/qe*t.range(1.05,1.3),A=Math.sin(u),S=Math.cos(u),c=fe(u,x+.2*h),l=e.v(c[0],c[1],-.22*h,A,S,-.12,g,g-.22*h,w,2,1,.42,1,-1),i=e.n;for(let r=0;r<6;r++){const s=P[r][0]*h,a=P[r][1]*h,f=u+s/x,b=fe(f,x+.02+.05*d[r]);e.v(b[0],b[1],a,Math.sin(f),Math.cos(f),-.3*d[r],g,g+a,w+s,2,0,d[r],1,-1)}for(let r=0;r<6;r++)e.tri(l,i+r,i+(r+1)%6)}}}async function Ft(e,n,t,m,P,d){const z=t.L-15,g=Math.round((z-26)/2.7),x=[],k=[];for(let w=0;w<=g;w++){const u=26+w/g*(z-26),h=H(26,56,u)*(1-H(z-22,z,u)*.55),A=H(-.55,-.25,m.n2(u*.016,P+9)),S=4*Math.min(1.12,Math.max(.18,.72+.5*m.n2(u*.05,P)))*h*(.25+.75*A)*(.82+.3*(w%2));x.push(Math.max(.35,S)),k.push(u)}const v=.45;for(let w=0;w<=g;w++){(w&15)===0&&await d();const u=k[w],h=x[w],A=fe(0,t.radAt(u))[1]-.12,S=e.mark(),c=h*1.12;if(e.grid(4,4,(f,b)=>{const o=b*Math.PI*2,B=.17*(1-f*.86),M=f*c;return[Math.cos(o)*B,A+M,Math.sin(o)*B*1.5-v*M,u,u,M,4,0,f*1.12,6,t.radAt(u)]}),e.smooth(S,!0),w===g)break;const l=k[w+1],i=x[w+1],r=n.n,s=4,a=3;for(let f=0;f<=s;f++)for(let b=0;b<=a;b++){const o=f/s,B=u+(l-u)*o,M=(h+(i-h)*o)*(1-.3*Math.sin(Math.PI*o))*(b/a),R=fe(0,t.radAt(B))[1]-.12;n.v(0,R+M,-v*M,1,0,0,B,B-v*M,M,3,o,b/a,6,t.radAt(B))}for(let f=0;f<s;f++)for(let b=0;b<a;b++){const o=r+f*(a+1)+b;n.quad(o,o+a+1,o+a+2,o+1)}}}async function Bt(e,n,t,m,P){const d=[];for(let z=20;z<n.L-20;z+=.6){const g=n.yAt(z);g>.5&&g<13&&d.push(z)}if(!d.length)return;const y=[];for(let z=0;z<26;z++)y.push(t.pick(d));for(let z=0;z<m;z++){(z&63)===0&&await P();const g=t.chance(.7),x=g?y[z%y.length]+t.gauss()*.45:t.pick(d),k=n.radAt(x),v=t.range(-2.2,2.2),w=t.range(.22,.55)*(g?1:.8),u=w*t.range(.7,1.3),h=Math.sin(v),A=Math.cos(v),S=fe(v,k-.03),c=t.range(0,6.28),l=e.mark(),i=e.n,r=5;for(let s=0;s<3;s++)for(let a=0;a<r;a++){const f=c+a/r*Math.PI*2,b=s===0?w:s===1?w*.55:w*.3,o=s===0?0:s===1?u:u*.55,B=Math.cos(f)*b,M=Math.sin(f)*b;e.v(S[0]+A*B+h*o,S[1]-h*B+A*o,M,h,A,0,x,x+M,v*qe+B,8,s===0?0:s===1?.74:1,0,0,-1)}for(let s=0;s<2;s++)for(let a=0;a<r;a++){const f=i+s*r+a,b=i+s*r+(a+1)%r;e.quad(f,b,b+r,f+r)}e.tri(i+2*r,i+2*r+1,i+2*r+2),e.tri(i+2*r,i+2*r+2,i+2*r+3),e.tri(i+2*r,i+2*r+3,i+2*r+4),e.smooth(l,!0,!1)}}async function Rt(e,n,t,m,P){const d=[];for(let y=20;y<n.L-8;y+=.8)n.yAt(y)>11&&d.push(y);if(d.length)for(let y=0;y<m;y++){(y&31)===0&&await P();const z=t.pick(d),g=n.radAt(z),x=t.sign(),k=x*t.range(1.75,2.45),v=fe(k,g*.97),w=t.range(4,8)*Math.min(1,(n.yAt(z)-3)/9),u=t.range(0,6.28),h=t.range(.28,.5),A=8,S=e.n;for(let c=0;c<=A;c++){const l=c/A,i=h*Math.sqrt(Math.sin(Math.PI*Math.min(.97,l*.9+.07)))*(1+.45*Math.sin(l*11+u));for(const r of[-1,1])e.v(v[0],v[1],0,r*i,0,0,z,r*i*2.2+y*3.7,l*w,7,l*w,u,3,-1)}for(let c=0;c<A;c++){const l=S+c*2;e.quad(l,l+1,l+3,l+2)}}}const Re=[[-1.2,2.95],[1,3.1],[3.5,3.5],[5.5,3.2],[8,2.3],[10.5,1.95],[11.8,2.15],[12.7,1.95],[13.35,1.5],[13.8,.85],[14,.25]],Je=[[-1.2,3.05],[1.5,3.2],[4,3.8],[5.6,3.6],[7.5,2.5],[9.5,2.05],[11.5,2.3],[12.4,2.35],[13.1,2],[13.65,1.35],[14,.6]],je=[[-1.2,-.6],[2.6,-.5],[5,-.8],[8,-.45],[11,-.6],[13,-.05],[14,.3]],mt=[[1,-3],[3,-3.1],[6,-2.5],[9.5,-1.8],[12,-1.3],[12.9,-.75]];async function Lt(e,n,t,m,P,d){const y=t.L,z=60,g=(c,l,i,r,s,a,f,b,o,B)=>[c,l,i,y,y+r,s,a,f,b,o,B];await d();let x=e.mark();e.grid(44,28,(c,l)=>{const i=-1.2+15.2*(1-Math.pow(1-c,1.3)),r=H(1.5,3.6,i),s=D(Re,i),a=D(Je,i),f=D(je,i),b=-2.95+(f-.6+2.95)*r,o=-.5*Math.PI+(.5-.13)*Math.PI*r,B=o+l*(Math.PI-2*o),M=Math.sin(B),R=Math.cos(B),T=.5*Math.exp(-(((i-4.7)/1.2)**2))*Math.exp(-(((Math.abs(B-Math.PI/2)-.72)/.42)**2)),V=.3*Math.exp(-(((i-12.2)/.7)**2))*Math.exp(-(((Math.abs(B-Math.PI/2)-.5)/.3)**2)),W=.3*Math.exp(-(((i-2.6)/1.5)**2))*Math.exp(-(((Math.abs(B-Math.PI/2)-1.45)/.4)**2)),C=1+(T+V+W)/Math.max(1.2,s),N=M>=0?f+(a-f)*Math.pow(M,.68):f-(f-b)*Math.pow(-M,.7),q=s*Math.sign(R)*Math.pow(Math.abs(R),.85);return g(q*C,f+(N-f)*C,i,i,(B-Math.PI/2)*3.2,5,0,0,0,0)}),e.smooth(x,!0),await d();const k=c=>D(je,c)-.22,v=c=>D(Re,c)*(.93-.5*H(11.4,12.9,c));x=e.mark(),e.grid(30,18,(c,l)=>{const i=1+11.9*c,r=v(i),s=k(i),a=D(mt,i),f=-.1*Math.PI+l*1.2*Math.PI,b=Math.sin(f),o=Math.cos(f),B=b>=0?s-(s-a)*Math.pow(b,.72):s+.22*-b;return g(r*Math.sign(o)*Math.pow(Math.abs(o),.85)*(b<0?.93:1),B,i,i,(f-Math.PI/2)*3.2+40,5,0,0,4,0)}),e.smooth(x,!0),await d();for(const c of[0,1])x=n.mark(),n.grid(10,4,(l,i)=>{const r=2.8+(c?9.6:10.6)*l,s=(c?v(r):D(Re,r))*.9,a=(i*2-1)*s,f=c?k(r)-.12-.3*(1-(i*2-1)**2):D(je,r)-.2+.55*(1-(i*2-1)**2);return g(a,f,r,r,a,9,0,0,c?4:0,0)}),n.smooth(x,!1);await d();const w=(c,l,i,r,s,a,f,b,o,B,M,R,T=0)=>{const V=c.mark();c.grid(5,6,(W,C)=>{const N=C*Math.PI*2,q=o*(1-W)**.8+.01,O=W*b,Q=R*W*W*b;return g(l+s*O+Math.cos(N)*q*(1-Math.abs(s))+Q*(l>0?1:-1)*0,i+a*O+Math.sin(N)*q*Math.abs(f)+Q*a*0,r+f*O+Math.sin(N)*q*Math.abs(a)+Math.cos(N)*q*Math.abs(s)-Q,O*.6,N*q,B,0,W,M,T)}),c.smooth(V,!0)};for(const c of[-1,1]){for(let l=0;l<9;l++){const i=4.6+l*.95+m.range(-.15,.15),r=l===7?1.9:l>5?1.25:1;w(e,c*D(Re,i)*.9,D(je,i)-.3,i,0,-1,0,m.range(.6,.95)*r,.2*r,4,0,.12)}for(let l=0;l<8;l++){const i=5+l*.95+m.range(-.15,.15);w(e,c*v(i)*.88,k(i)-.1,i,0,1,0,m.range(.5,.8),.18,4,4,.1)}}await d();const u=P==="tusked"?3.1:1.7;for(const c of[-1,1]){x=e.mark();const l=9.6,i=c*v(l)*.92,r=k(l)-.35,s=u/1.5;e.grid(10,8,(a,f)=>{const b=a*1.5,o=f*Math.PI*2,B=.36*(u/3.1)**.6*(1-a)**.75+.012,M=i+c*(1-Math.cos(b))*s*.75+c*a*.5,R=r+Math.sin(b)*s,T=l+a*.5-(1-Math.cos(b))*s*.55,V=c*Math.cos(b)*.8,W=-Math.sin(b);return g(M+V*Math.cos(o)*B,R+W*Math.cos(o)*B,T+Math.sin(o)*B,a*u*.5,o*B,4,0,a,4,0)}),e.smooth(x,!0)}await d();const h=[];for(const c of[-1,1]){const l=[c*D(Re,5.2)*.9,1.7,5.2],i=new p.Vector3(c*.9,.2,.38).normalize(),r=new p.Vector3(0,0,1).addScaledVector(i,-i.z).normalize(),s=new p.Vector3().crossVectors(i,r).multiplyScalar(c).normalize();s.y<0&&s.multiplyScalar(-1);const a=.66,f=1.3,b=n.n;for(let o=0;o<=6;o++)for(let B=0;B<=14;B++){const M=o/6*f,R=B/14*Math.PI*2,T=Math.sin(M),V=Math.cos(M)-.25,W=i.x*V+(r.x*Math.cos(R)+s.x*Math.sin(R))*T,C=i.y*V+(r.y*Math.cos(R)+s.y*Math.sin(R))*T,N=i.z*V+(r.z*Math.cos(R)+s.z*Math.sin(R))*T;n.v(l[0]+W*a,l[1]+C*a,l[2]+N*a,W,C,N,y,Math.cos(R)*T/Math.sin(f),Math.sin(R)*T/Math.sin(f),6,c,0,0,0)}for(let o=0;o<6;o++)for(let B=0;B<14;B++){const M=b+o*15+B;n.quad(M,M+15,M+16,M+1)}x=e.mark(),e.grid(14,6,(o,B)=>{const M=o*Math.PI*2,R=B*Math.PI*2,T=.2+.1*Math.max(0,Math.sin(M)),V=a*1+.1,W=r.x*Math.cos(M)+s.x*Math.sin(M),C=r.y*Math.cos(M)+s.y*Math.sin(M),N=r.z*Math.cos(M)+s.z*Math.sin(M),q=V+Math.cos(R)*T,O=Math.sin(R)*T+.05+.12*Math.max(0,Math.sin(M));return g(l[0]+W*q+i.x*O,l[1]+C*q+i.y*O,l[2]+N*q+i.z*O,l[2]+N*q-y+y,M*2,5,0,0,0,0)}),e.smooth(x,!0),h.push(l)}await d();const A=[];for(const c of[-1,1]){const i=c*.78,r=D(Je,11.3)-.25;x=e.mark(),e.grid(3,9,(s,a)=>{const f=a*Math.PI*2,b=[.55,.4,.3,.12][Math.round(s*3)],o=[0,.42,.5,.2][Math.round(s*3)];return g(i+Math.cos(f)*b,r+o,11.3+Math.sin(f)*b,11.3,f,5,0,0,0,0)}),e.smooth(x,!0),A.push([i,r+.5,11.3])}await d();const S=(c,l,i,r,s,a,f,b,o,B,M=7,R=0)=>{const T=e.mark();e.grid(7,5,(V,W)=>{const C=W*Math.PI*2,N=b*(1-V*.9)+.015,q=V*f;return g(c+r*q+Math.cos(C)*N+Math.sign(r)*R*Math.sin(Math.PI*V)*f*.2,l+s*q-(.25+.4*R)*V*V*f*(1-Math.abs(s)),i+a*q+Math.sin(C)*N,q,C*N+o,M,V,o,5,B?z:0)}),e.smooth(T,!0)};for(let c=0;c<12;c++){const l=m.range(3.2,9.5),i=c%2*2-1,r=i*v(l)*m.range(.1,.85);S(r,D(mt,l)*(1-.35*(r/v(l))**2)+.2,l,i*.1,-.93,-.3,m.range(2.6,5.6)*(P==="maned"?1.25:1),m.range(.16,.26),m.range(0,6.28),!0)}for(const c of[-1,1])S(c*1.9,D(je,12.2)+.1,12.2,c*.6,-.2,-.75,5.6,.2,m.range(0,6.28),!1,7,1);if(P==="maned")for(let c=0;c<46;c++){const l=m.range(-1.1,4.6),i=m.range(-1.25,1.25),r=D(Re,l),s=D(Je,l);S(Math.sin(i)*r*.95,s*Math.cos(i)*.96,l,Math.sin(i)*.5,.35*Math.cos(i),-.78,m.range(3,6.5),m.range(.14,.22),m.range(0,6.28),!1)}return{blow:A,eyes:h,jawTop:k,jawW:v}}function Ee(e,n,t){const m=new p.Vector3(...t.e1).normalize(),P=new p.Vector3(...t.e2);P.addScaledVector(m,-P.dot(m)).normalize();const d=new p.Vector3().crossVectors(m,P).normalize(),y=t.rays,z=3,g=y*z,x=5,k=t.kind??2,v=t.skin??0,w=t.sag??.2,u=A=>t.len*t.profile(A),h=n.n;for(let A=0;A<=g;A++)for(let S=0;S<=x;S++){const c=A/g,l=t.a0+(t.a1-t.a0)*c,i=A%z/z,r=u(c)*(1-w*Math.sin(Math.PI*i)**2),s=r*(.04+.96*S/x),a=m.x*Math.cos(l)+P.x*Math.sin(l),f=m.y*Math.cos(l)+P.y*Math.sin(l),b=m.z*Math.cos(l)+P.z*Math.sin(l);n.v(t.root[0]+a*s,t.root[1]+f*s,t.root[2]+b*s,d.x,d.y,d.z,t.s,l*t.len*.55+(t.hOff||0),s,t.mat??3,c*y,S/x,k,v)}for(let A=0;A<g;A++)for(let S=0;S<x;S++){const c=h+A*(x+1)+S;n.quad(c,c+x+1,c+x+2,c+1)}if(t.bones)for(let A=0;A<=y;A++){const S=A/y,c=t.a0+(t.a1-t.a0)*S,l=u(S)*(t.boneOver??1.08),i=m.x*Math.cos(c)+P.x*Math.sin(c),r=m.y*Math.cos(c)+P.y*Math.sin(c),s=m.z*Math.cos(c)+P.z*Math.sin(c),a=r*d.z-s*d.y,f=s*d.x-i*d.z,b=i*d.y-r*d.x,o=k===6?e:n,B=o.mark(),M=t.boneR??.16;if(o.grid(4,4,(R,T)=>{const V=T*Math.PI*2,W=M*(1-R*.88),C=R*l,N=Math.cos(V)*W,q=Math.sin(V)*W;return[t.root[0]+i*C+a*N+d.x*q,t.root[1]+r*C+f*N+d.y*q,t.root[2]+s*C+b*N+d.z*q,t.s,C,V*W,4,S*y,Math.min(1,R*(t.boneOver??1.08)),k,v]}),k===6)o.smooth(B,!0);else{const[R]=B;for(let T=R;T<o.n;T++)o.setNormal(T,d.x,d.y,d.z)}}}async function Wt(e,n,t,m,P,d){const y=t.L;await d();const z=y-13,g=t.radAt(z);for(const v of[-1,1]){const w=fe(v*1.8,g*.93);Ee(e,n,{s:z,root:[w[0],w[1],0],e1:[v*.78,-.12,-.62],e2:[v*.2,.78,.58],a0:-.42,a1:.92,len:12,rays:9,profile:u=>.5+.5*Math.pow(Math.sin(Math.PI*Math.min(1,u*.8+.22)),1.4),sag:.16,kind:2,skin:g*.9,bones:!0,boneR:.14,hOff:v*50})}await d(),Ee(e,n,{s:3,root:[0,0,0],e1:[0,0,-1],e2:[0,1,0],a0:-.95,a1:.95,len:12,rays:10,profile:v=>.5+.5*Math.pow(Math.abs(v*2-1),1.6),sag:.14,kind:2,skin:0,bones:!0,boneR:.15,hOff:200}),await d();for(const v of[-1,1])Ee(e,n,{s:y,root:[v*2.9,.5,1],e1:[v*.62,.2,-.76],e2:[v*.12,.95,.28],a0:-.9,a1:1,len:4.6,rays:7,profile:w=>.62+.38*Math.sin(Math.PI*w),sag:.24,kind:2,skin:0,bones:!0,boneR:.09,hOff:v*90,mat:10});if(await d(),Ee(e,n,{s:y,root:[0,2.7,3],e1:[0,1,0],e2:[0,0,-1],a0:-.55,a1:1.4,len:P==="maned"?3.6:5.2,rays:7,profile:v=>.55+.45*Math.sin(Math.PI*Math.min(1,v*.85+.2)),sag:.42,kind:6,skin:0,bones:!0,boneR:.19,boneOver:1.2,hOff:300,mat:10}),await d(),P==="ram")for(const v of[-1,1]){const w=e.mark();e.grid(30,8,(u,h)=>{const A=-.5+u*7.4,S=2*(1-u*.62),c=h*Math.PI*2,l=(.62*(1-u)**.8+.03)*(1+.1*Math.sin(u*95)),i=v*(2.1+u*2.6),r=2.9+Math.sin(A)*S*.9-u*.9,s=2.2-Math.cos(A)*S,a=0,f=Math.sin(A),b=-Math.cos(A);return[i+v*Math.sin(c)*l+a,r+f*Math.cos(c)*l,s+b*Math.cos(c)*l,y,y+u*14,c*l,4,0,u,0,0]}),e.smooth(w,!0)}await d();const x=n.n,k=9;for(let v=0;v<=k;v++)for(const w of[-1,1]){const u=v/k,h=Math.max(0,u-.72)/.28,A=.42*(1-.5*u)*(1-h*.75);n.v(w*(A+h*.55),-.95-2.1*u*u,7.5+u*6.8,0,1,0,y,y+u*8,w*A,9,u*.9,w*.8+2,5,0)}for(let v=0;v<k;v++){const w=x+v*2;n.quad(w,w+1,w+3,w+2)}}function Vt(e,n,t,m,P){const d=[];for(let S=10;S<e.L-4;S+=.25)e.yAt(S)>5&&d.push(S);const y=[],z=[],g=[],x=[],k=[],v=Math.min(t,d.length*4),w=d.length/v;for(let S=0;S<v;S++){const c=d[Math.floor(S*w)],l=S%5,i=e.radAt(c),r=((l+.5)/5*2-1)*i*.86+n.range(-.15,.15),s=(l*.37+S*.6180339)%1,a=n.range(3.2,7.5),f=i*(.86-.3*(r/i)*(r/i));for(let o=0;o<4;o++)y.push(r,f,a),z.push(c),g.push((o&1)*2-1,o>>1),x.push(s,n());const b=S*4;k.push(b,b+1,b+3,b,b+3,b+2)}const u=new p.BufferGeometry;u.setAttribute("position",new p.Float32BufferAttribute(y,3)),u.setAttribute("aS",new p.Float32BufferAttribute(z,1)),u.setAttribute("aQ",new p.Float32BufferAttribute(g,2)),u.setAttribute("aR",new p.Float32BufferAttribute(x,2)),u.setIndex(k),u.boundingSphere=new p.Sphere(new p.Vector3(0,20,0),400);const h=new p.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:p.DoubleSide,uniforms:{...p.UniformsUtils.clone(p.UniformsLib.fog),...m,...P},vertexShader:`
      uniform sampler2D uSpine; uniform float uSpN, uSpLen, uTime, uResY, uRain; uniform vec2 uGust;
      attribute float aS; attribute vec2 aQ, aR;
      varying vec2 vQ; varying float vA;
      #include <fog_pars_vertex>
      void main(){
        float x = clamp(aS/uSpLen, 0., 1.)*(uSpN-1.);
        float i = min(floor(x), uSpN-2.), f = x-i;
        ivec2 a = ivec2(int(i), 0), b = ivec2(int(i)+1, 0);
        vec3 P = mix(texelFetch(uSpine, a, 0).xyz+texelFetch(uSpine, a+ivec2(0,1), 0).xyz, texelFetch(uSpine, b, 0).xyz+texelFetch(uSpine, b+ivec2(0,1), 0).xyz, f);
        vec3 N = mix(texelFetch(uSpine, a+ivec2(0,2), 0).xyz, texelFetch(uSpine, b+ivec2(0,2), 0).xyz, f);
        vec3 T = mix(texelFetch(uSpine, a+ivec2(0,3), 0).xyz, texelFetch(uSpine, b+ivec2(0,3), 0).xyz, f);
        vec3 B = normalize(cross(N, T)+vec3(1e-5, 0., 0.));
        vec3 o = P+B*position.x; o.y -= position.y;
        float cyc = 46.+8.*aR.y;
        float fall = fract(aR.x+uTime*30./cyc)*cyc;
        float len = position.z*(.5+.5*smoothstep(0., 8., fall));
        vec2 sl = uGust*(1.+.4*sin(uTime*.7+aS*.05));
        vec3 top = o+vec3(sl.x*fall, -fall, sl.y*fall);
        vec3 bot = top+vec3(sl.x*len, -len, sl.y*len);
        float vis = step(3.5, o.y)*step(.5, top.y)*uRain;
        bot = mix(top, bot, clamp(top.y/max(top.y-bot.y, 1e-3), 0., 1.));
        vec4 vt = modelViewMatrix*vec4(top, 1.), vb = modelViewMatrix*vec4(bot, 1.);
        vec4 mvPosition = mix(vt, vb, aQ.y);
        vec2 dir = vb.xy-vt.xy; dir = dir/max(length(dir), 1e-4);
        float depth = max(-mvPosition.z, .1);
        float pxw = depth*2./(projectionMatrix[1][1]*uResY);
        float hwid = min(max(.022, .8*pxw), 2.2*pxw);
        mvPosition.xy += vec2(-dir.y, dir.x)*aQ.x*hwid;
        vQ = vec2(aQ.x, aQ.y);
        vA = vis*min(1., .022/hwid*2.6+.12)*(.55+.45*aR.y)*(1.-smoothstep(.75, 1., fall/cyc));
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uPaper, uInk, uInkFar;
      varying vec2 vQ; varying float vA;
      ${ie}
      void main(){
        float f = eFog();
        float taper = pow(max(sin(3.14159*clamp(vQ.y, 0., 1.)), 0.), .6);
        float a = vA*(1.-smoothstep(taper*.9-.35, taper*.9+.05, abs(vQ.x)))*(1.-smoothstep(.4, 1., f));
        gl_FragColor = vec4(mix(uInk, uInkFar, min(1., smoothstep(0., .5, f)+.2)), a*.85);
      }`}),A=new p.Mesh(u,h);return A.frustumCulled=!1,A.renderOrder=3,{mesh:A,tris:v*2}}function It(e,n,t,m){const P=[],d=[],y=[],z=[];for(let w=0;w<n;w++){const u=w%2,h=e.range(0,6.283),A=.12+.88*Math.pow(e(),.7),S=e(),c=z.length/3;for(let l=0;l<=18;l++)for(const i of[-1,1])z.push(l/18,i,0),d.push(u,h,A,S);for(let l=0;l<18;l++){const i=c+l*2;y.push(i,i+1,i+3,i,i+3,i+2)}}const x=new p.BufferGeometry;x.setAttribute("position",new p.Float32BufferAttribute(z,3)),x.setAttribute("aArc",new p.Float32BufferAttribute(d,4)),x.setIndex(y),x.boundingSphere=new p.Sphere(new p.Vector3(0,30,0),400);const k=new p.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:p.DoubleSide,uniforms:{...p.UniformsUtils.clone(p.UniformsLib.fog),...t,...m},vertexShader:`
      uniform vec3 uBlow[2]; uniform float uSpout, uTime, uResY;
      attribute vec4 aArc;
      varying vec3 vQ; varying float vSeed;
      #include <fog_pars_vertex>
      vec3 arcPos(float u, vec3 o, float Hs){
        float q = 1.7*u-1.;
        float r = aArc.z*(Hs*.46*pow(max(u, 0.), 1.9)+4.4*pow(max(u, 0.), .5));     // a palm: wide at the wrist, curling out
        return o+vec3(cos(aArc.y)*r, Hs*(1.-q*q), sin(aArc.y)*r);
      }
      void main(){
        vec3 o = aArc.x < .5 ? uBlow[0] : uBlow[1];
        float pulse = .86+.14*sin(uTime*.9+aArc.w*2.);
        float Hs = 50.*uSpout*pulse*(.6+.4*aArc.w);
        float u = position.x;
        vec4 p0 = modelViewMatrix*vec4(arcPos(u, o, Hs), 1.), p1 = modelViewMatrix*vec4(arcPos(u+.03, o, Hs), 1.);
        vec2 dir = p1.xy-p0.xy; dir = dir/max(length(dir), 1e-4);
        vec4 mvPosition = p0;
        float depth = max(-p0.z, .1);
        float pxw = depth*2./(projectionMatrix[1][1]*uResY);
        float hw = min(max(.045+.06*u, .72*pxw), 3.*pxw);
        mvPosition.xy += vec2(-dir.y, dir.x)*position.y*hw;
        // far off, every other arc is left out so paper shows between the strokes
        float keep = step(fract(aArc.y*3.7+aArc.w*5.3), mix(1., .42, smoothstep(40., 150., depth)));
        vQ = vec3(u, position.y, min(1., (.045+.06*u)/hw*2.4+.15)*step(.02, uSpout)*keep);
        vSeed = aArc.w;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uPaper, uInk, uInkFar; uniform float uTime;
      varying vec3 vQ; varying float vSeed;
      ${ie}
      void main(){
        float f = eFog(), u = vQ.x;
        float duty = mix(.5, .2, smoothstep(.5, 1., u));
        float d = fract(u*(7.+4.*vSeed)-uTime*(.55+.3*vSeed)+vSeed*7.);
        float on = step(d, duty), taper = pow(max(sin(3.14159*clamp(d/duty, 0., 1.)), 0.), .5)*on;
        float a = (1.-smoothstep(taper*.95-.4, taper*.95+.05, abs(vQ.y)))*on;
        float u0 = max(0., vSeed-.25)*.5;                 // three arcs in four begin higher up, so the wrist of the palm stays open
        a *= vQ.z*smoothstep(u0, u0+.08, u)*(1.-smoothstep(.9, 1., u))*(1.-smoothstep(.4, 1., f));
        gl_FragColor = vec4(mix(uInk, uInkFar, min(1., smoothstep(0., .5, f)+.3)), a*.8);
      }`}),v=new p.Mesh(x,k);return v.frustumCulled=!1,v.renderOrder=3,{mesh:v,tris:n*18*2}}const be=12;function Tt(e,n,t){const m=[],P=[];for(let k=0;k<be;k++){const v=m.length/3;for(let w=0;w<=6;w++)for(let u=0;u<=26;u++)m.push(w/6,u/26*Math.PI*2,k);for(let w=0;w<6;w++)for(let u=0;u<26;u++){const h=v+w*27+u;P.push(h,h+26+1,h+26+2,h,h+26+2,h+1)}}const z=new p.BufferGeometry;z.setAttribute("position",new p.Float32BufferAttribute(m,3)),z.setIndex(P),z.boundingSphere=new p.Sphere(new p.Vector3,500);const g=new p.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:p.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4,uniforms:{...p.UniformsUtils.clone(p.UniformsLib.fog),...e,...n},vertexShader:`
      uniform vec4 uLeg[${be}];
      ${t}
      varying vec3 vR; varying float vStr;
      #include <fog_pars_vertex>
      void main(){
        vec4 leg = uLeg[int(position.z+.5)];
        float d = position.x*22.;
        vec2 dir = vec2(cos(position.y), sin(position.y));
        vec3 lp = vec3(leg.x+dir.x*(leg.z*.82+d), 0., leg.y+dir.y*(leg.z*.82+d));
        vec4 wp = modelMatrix*vec4(lp, 1.);
        wp.y += heroSea(wp.xz)+.14;
        vR = vec3(d, position.y, leg.z); vStr = leg.w;
        vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${de}
      ${ie}
      varying vec3 vR; varying float vStr;
      void main(){
        float d = vR.x, th = vR.y, r = vR.z+d;
        float ph = d/2.6-uTime*.33;
        float wph = fwidth(d)/2.6+1e-4;
        float arc = th*r;
        // eight waterlines: they travel outward, break into strokes and thin to nothing
        float life = clamp(1.-d/21., 0., 1.);
        float brk = smoothstep(.75-life*.85, 1.05-life*.85, eN1(arc*.16+floor(ph+.5)*7.3));
        float hw = wph*(.9+1.7*life*life)*brk;
        float lines = (1.-smoothstep(hw-wph*.7, hw+wph*.7, abs(fract(ph+.5)-.5)))*step(1e-5, hw)*(.45+.55*life);
        lines *= 1.-smoothstep(.22, .45, wph);
        // collar of curl ticks hugging the leg
        float n = floor(6.283*r/1.9)+1.;
        float cell = th/6.283*n; vec2 q = vec2((fract(cell+uTime*.05)-.5)*1.9, d-1.5+.5*sin(floor(cell)*2.4+uTime*1.1));
        float wq = fwidth(d)+1e-4;
        float curl = 1.-smoothstep(.09, .09+wq*1.4, abs(length(q)-.55));
        curl *= smoothstep(-.35, -.05, q.x+q.y*.4)*step(d, 3.2)*(1.-smoothstep(.2, .5, wq));
        float dark = (1.-smoothstep(0., 1.4, d))*.4;                      // contact darkening at the skin
        float a = max(max(lines, curl), dark)*vStr*(1.-smoothstep(.45, 1., eFog()));
        vec3 ink = mix(uInk, uInkFar, smoothstep(0., .5, eFog()));
        gl_FragColor = vec4(mix(ink, uWashA*.6, dark*(1.-max(lines, curl))), a);
      }`}),x=new p.Mesh(z,g);return x.frustumCulled=!1,x.renderOrder=2,{mesh:x,tris:be*6*26*2}}function Nt(e,n,t){const m=new p.RingGeometry(.01,48,56,14);m.rotateX(-Math.PI/2);const P=new p.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:p.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2,uniforms:{...p.UniformsUtils.clone(p.UniformsLib.fog),...e,...n},vertexShader:`
      uniform float uBulge, uTime;
      ${t}
      varying vec3 vWP; varying vec3 vB;
      #include <fog_pars_vertex>
      void main(){
        float rho = length(position.xz);
        float c = .5+.5*cos(3.14159*min(rho/31., 1.));
        float wob = 1.+.06*sin(uTime*2.3+rho*.3);
        float h = 10.*uBulge*c*wob;
        float slope = -10.*uBulge*.5*3.14159/31.*sin(3.14159*min(rho/31., 1.));
        vec4 wp = modelMatrix*vec4(position.x, h+.1, position.z, 1.);
        wp.y += heroSea(wp.xz);
        vWP = wp.xyz; vB = vec3(rho, h, slope);
        vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${de}
      ${ie}
      uniform float uBulge;
      varying vec3 vWP; varying vec3 vB;
      void main(){
        float rho = vB.x;
        float v = vB.y*1.15+rho*.22-uTime*.25*uBulge;                    // contours: bunch on the flanks
        float w = fwidth(v);
        vec2 rd = normalize(vWP.xz+vec2(1e-4));
        vec3 N = normalize(vec3(-rd.x*vB.z, 1., -rd.y*vB.z));
        float tone = clamp(.3+smoothstep(.8, -.4, dot(N, uKey))*.6+.22*smoothstep(8., 31., rho)*uBulge, 0., 1.);
        vec3 Vd = normalize(cameraPosition-vWP);
        float rimk = smoothstep(.2, .02, abs(dot(N, Vd)))*smoothstep(.05, .3, uBulge);
        float cov = max(eInk(tone, vec2(v, atan(rd.y, rd.x)*max(rho, 2.)), w), rimk);
        float a = smoothstep(0., .12, uBulge)*(1.-smoothstep(36., 47., rho));
        vec3 col = eCompose(cov, uWashA, .22+.3*tone, eFog(), eFogCol(), eGrain(vWP-cameraPosition));
        gl_FragColor = vec4(col, a);
      }`}),d=new p.Mesh(m,P);return d.frustumCulled=!1,d.renderOrder=1,{mesh:d,tris:784*2}}const Le=17;function _t(e,n){const t=new p.Group,m=new p.Mesh(new p.SphereGeometry(2500,32,20),new p.ShaderMaterial({side:p.BackSide,depthWrite:!1,depthTest:!1,uniforms:{...e},vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }",fragmentShader:`
      ${de}
      varying vec3 vD;
      void main(){
        vec3 d = normalize(vD);
        float el = asin(clamp(d.y, -1., 1.));
        float v = el*el*sign(el)*240.+el*40., w = fwidth(v);
        float tone = smoothstep(.07, 1.1, el)*.34;
        float cov = eLines(v, atan(d.z, d.x+1e-5)*200., w, tone)*.75;
        float fox = smoothstep(.72, .8, eN3(d*13.))*.1;
        vec3 col = eCompose(cov, uAged, .1+fox+.25*smoothstep(.4, -.1, el), .0, uPaper, eGrain(d));
        gl_FragColor = vec4(col, 1.);
      }`}));m.renderOrder=-.5,m.frustumCulled=!1,t.add(m);const P=new p.Mesh(new p.CircleGeometry(1600,72).rotateX(-Math.PI/2),new p.ShaderMaterial({fog:!0,uniforms:{...p.UniformsUtils.clone(p.UniformsLib.fog),...e,...n},vertexShader:`
      varying vec3 vWP;
      #include <fog_pars_vertex>
      void main(){ vec4 wp = modelMatrix*vec4(position, 1.); vWP = wp.xyz; vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${de}
      ${ie}
      uniform vec4 uCaps[${Le}];
      varying vec3 vWP;
      float capShadow(vec3 p, vec3 L, vec3 a, vec3 b, float r){
        vec3 ab = b-a, ao = p-a; float abL = dot(ab, L);
        float A = dot(ab, ab)-abL*abL;
        float t = clamp((dot(ao, ab)-dot(ao, L)*abL)/max(A, 1e-3), 0., 1.);
        vec3 c = a+ab*t-p; float s = dot(c, L);
        vec3 d = c-L*max(s, 0.);
        return (1.-smoothstep(r*.75, r*1.5, length(d)))*step(0., s);
      }
      void main(){
        vec2 p = vWP.xz;
        float sw = dot(p, vec2(.342, .94));
        float ph = sw/90.*6.2832+uTime*.5;
        float h = sin(ph)+.4*sin(dot(p, vec2(-.6, .8))/37.*6.2832+uTime*.9);
        float v = sw+4.*sin(dot(p, vec2(.9, -.3))*.045+uTime*.25)+1.5*eN2(p*.03)+uTime*3.;
        float w = fwidth(v);
        float sh = 0.;
        for(int i = 0; i < ${Le-1}; i++) sh = max(sh, capShadow(vWP, uKey, uCaps[i].xyz, uCaps[i+1].xyz, .5*(uCaps[i].w+uCaps[i+1].w)));
        float tone = clamp(.13+.09*h+.4*sh, 0., 1.);
        float cov = eInk(tone, vec2(v, dot(p, vec2(.94, -.342))), w);
        vec3 col = eCompose(cov, uWashA, .14+.3*tone+.2*sh, eFog(), eFogCol(), eGrain(vWP-cameraPosition));
        gl_FragColor = vec4(col, 1.);
      }`}));return P.frustumCulled=!1,t.add(P),{group:t,dome:m,sea:P}}async function Ht(e,n={}){const t=p,m=e.rng.fork?e.rng.fork("serpent"):e.rng,P=e.noise||e.core.makeNoise(e.seed||1),d=e.quality?.detail??1,y=n.stage??Object.keys(n).length===0,z=n.palette||ct,g=Qe(z,n.keyDir),x=n.head||m.pick(["tusked","tusked","ram","maned"]),k=n.spouts||(m.chance(.65)?2:1),v=(n.finWash||(m.chance(.78)?"rose":"verdigris"))==="rose"?0:1,w=m.range(0,100),u=n.seaGLSL||"float heroSea(vec2 p){ return 0.; }",h=zt(m),A=h.L,S=new Uint16Array(_*4*4),c=new t.DataTexture(S,_,4,t.RGBAFormat,t.HalfFloatType);c.minFilter=c.magFilter=t.NearestFilter,c.generateMipmaps=!1,c.needsUpdate=!0;const l=[];for(let L=0;L<be;L++)l.push(new t.Vector4(0,0,4,0));const i=[];for(let L=0;L<Le;L++)i.push(new t.Vector4(0,-50,0,4));const r={uSpine:{value:c},uSpN:{value:_},uSpLen:{value:A},uJaw:{value:.12},uLift:{value:.24},uResY:{value:900},uLook:{value:new t.Vector3(0,0,1)},uFinSel:{value:v},uWet:{value:1},uRain:{value:1},uGust:{value:new t.Vector2(.1,.05)},uBlow:{value:[new t.Vector3,new t.Vector3]},uSpout:{value:1},uLeg:{value:l},uBulge:{value:0},uCaps:{value:i},...n.seaUniforms||{}},s=Pt(g,r),a=new t.Group;a.name="chart-makers-serpent";const f={},b=Ye(),o=Ye(),B=Ye(),M=async()=>{await e.yield?.()};await M(),await ut(b,h,1.95,26,P,w,M),f.tube=b.tris(),await M(),await ut(B,h,4.2,12,P,w,M),await M(),await kt(b,h,M),await M(),await At(o,h,m.fork?m.fork("scutes"):m,M),f.scutes=o.tris(),await M(),await Ft(b,o,h,P,w,M),await M(),await Bt(o,h,m,Math.round(380*(.5+.5*d)),M),await M(),await Rt(o,h,m,Math.round(150*d),M),await M();const R=await Lt(b,o,h,m,x,M);await M(),await Wt(b,o,h,m,x,M),await M();const T=b.build();await M();const V=o.build();await M();const W=B.build();await M();const C=(L,j,X)=>{const E=new t.Mesh(L,j);return E.frustumCulled=!1,E.renderOrder=X,a.add(E),E};C(T,s.main,0),C(V,s.main,0),C(T,s.hull,0),C(W,s.wash,2);const N=Vt(h,m,Math.round(1700*d),g,r);a.add(N.mesh),await M();const q=It(m,Math.round(84*(.6+.4*d)),g,r);a.add(q.mesh),await M();let O=null,Q=null,he=null;n.waterlines!==!1&&(O=Tt(g,r,u),a.add(O.mesh)),n.bulge!==!1&&(Q=Nt(g,r,u),a.add(Q.mesh)),y&&(he=_t(g,r),a.add(he.group)),f.triangles=b.tris()*2+o.tris()+B.tris()+N.tris+q.tris+(O?O.tris:0)+(Q?Q.tris:0),f.outlined=b.tris(),f.plain=o.tris(),f.drawCalls=6+(O?1:0)+(Q?1:0)+(y?2:0),await e.yield?.();const ne=new Float32Array(_),Y=new Float32Array(_),se=new Float32Array(_),Xe=new Float32Array(_),Ze=new Float32Array(_),J=t.DataUtils.toHalfFloat,I={progress:1,headK:null,headAuto:0,yaw:0,first:!0,pacing:0,travel:0,sound:0,pOrigin:new t.Vector3(67.8,0,-83.3),pDir:new t.Vector3(.643,0,-.766),bulge:0,headRise:1,surge:0,lean:0},We=L=>L<=0?0:L>=1?1:Math.pow(H(0,.85,L),.8)+.045*Math.sin(Math.PI*H(.55,1,L)),ve=[1,1,1,1,1];let Ve=_-2;for(let L=_-1;L>=0;L--)h.g[L]<=16&&(Ve=L);const Ue=new t.Vector3,Pe=new t.Vector3,pe=new t.Vector3,dt=new t.Vector2,De=new t.Vector3,Ie=new t.Vector3,Te=new t.Vector3,Oe=new t.Vector3,Ne=new Float32Array(Le*4),ze=[],et=[];for(let L=0;L<be;L++)et.push({x:0,z:0,r:0});const vt=(L,j)=>{const X=Math.hypot(L,j);return 10*I.bulge*(.5+.5*Math.cos(Math.PI*Math.min(X/31,1)))};function tt(L){const j=I.progress;ve[2]=We((j-.17)/.5),ve[1]=We((j-.42)/.45),ve[3]=We((j-.58)/.4),ve[0]=We((j-.6)/.4),ve[4]=We((j-.75)/.25),I.headRise=ve[4],I.bulge=H(0,.2,j)*(1-H(.3,.62,j));const X=I.headK??I.headAuto,E=I.pacing,we=I.yaw*(1-E),_e=h.x[Ve],He=h.z[Ve],ce=I.pDir,nt=Math.hypot(ce.x,ce.z)||1,st=ce.x/nt,rt=ce.z/nt;for(let F=0;F<_;F++){const U=F/(_-1)*A,Se=F*5;let te=h.x[F],$=h.y[F],Z=h.z[F],oe=h.ex[F],ae=h.ez[F];const Ce=H(3,30,$);let ge=0,xe=0;for(let G=0;G<5;G++){const K=h.reg[Se+G];ge+=K*ve[G],xe+=K*Math.sin(L*.55+G*2.1)}$+=1.5*xe*Ce;const re=h.g[F];re<46&&($-=X*6.9*H(44,14,re)-.7*Math.sin(L*.7)*H(40,14,re));const ke=.9*Math.sin(L*.4+U*.021)*Ce;if(te+=-ae*ke,Z+=oe*ke,$=-13+($+13)*ge,(I.surge!==0||I.lean!==0)&&(Z-=h.reg[Se+2]*(I.surge+I.lean*Math.min(1.1,Math.max(0,$)/40.5))),re<16){const G=we*H(16,3,re),K=Math.cos(G),ee=Math.sin(G),ue=te-_e,me=Z-He;te=_e+ue*K+me*ee,Z=He-ue*ee+me*K;const Me=oe;oe=Me*K+ae*ee,ae=-Me*ee+ae*K}if(E>0){const G=A-U,K=I.travel-G/1.6;let ue=2.5+H(14,52,G)*(1-H(215,300,G))*15.5*Math.cos(6.2832*(K-.55*I.travel)/50)-11.5*H(240,330,G)+1.2*(1-H(0,40,G));const me=G/A*.6,Me=H(me,me+.4,I.sound);ue+=-44*Me+26*H(.5,.75,I.sound)*(1-H(.8,1,I.sound))*H(A-45,A,G);const Ae=I.pOrigin.x+st*K,Fe=I.pOrigin.z+rt*K;te+=(Ae-te)*E,$+=(ue-$)*E,Z+=(Fe-Z)*E,oe+=(st-oe)*E,ae+=(rt-ae)*E;const ye=Math.hypot(oe,ae)||1;oe/=ye,ae/=ye}ne[F]=te,Y[F]=$,se[F]=Z,Xe[F]=oe,Ze[F]=ae}ze.length=0;for(let F=0;F<_;F++){const U=Math.max(0,F-1),Se=Math.min(_-1,F+1);let te=ne[Se]-ne[U],$=Y[Se]-Y[U],Z=se[Se]-se[U];const oe=Math.hypot(te,$,Z)||1;te/=oe,$/=oe,Z/=oe;const ae=Ze[F],Ce=-Xe[F];let ge=$*Ce,xe=Z*ae-te*Ce,re=-$*ae;const ke=Math.hypot(ge,xe,re)||1;ge/=ke,xe/=ke,re/=ke;const G=F/(_-1)*A,K=1+.065*Math.sin(G*.075-L*.9)*H(0,60,G)*H(0,30,A-G),ee=F*4,ue=Math.floor(ne[F]),me=Math.floor(Y[F]),Me=Math.floor(se[F]);S[ee]=J(ue),S[ee+1]=J(me),S[ee+2]=J(Me),S[ee+3]=J(K);const Ae=ee+_*4;S[Ae]=J(ne[F]-ue),S[Ae+1]=J(Y[F]-me),S[Ae+2]=J(se[F]-Me),S[Ae+3]=0;const Fe=ee+_*8;S[Fe]=J(ge),S[Fe+1]=J(xe),S[Fe+2]=J(re),S[Fe+3]=0;const ye=ee+_*12;if(S[ye]=J(te),S[ye+1]=J($),S[ye+2]=J(Z),S[ye+3]=0,F===_-1&&(Te.set(te,$,Z),Ie.set(ge,xe,re),De.crossVectors(Ie,Te),Oe.set(ne[F],Y[F],se[F])),F>0&&ze.length<be&&Y[F-1]>0!=Y[F]>0){const it=Y[F-1]/(Y[F-1]-Y[F]),lt=h.R[F]*K,gt=Math.min(1.7,1/Math.max(.45,Math.abs($)));if(lt>.9){const Ge=et[ze.length];Ge.x=ne[F-1]+(ne[F]-ne[F-1])*it,Ge.z=se[F-1]+(se[F]-se[F-1])*it,Ge.r=lt*gt,ze.push(Ge)}}}c.needsUpdate=!0;for(let F=0;F<be;F++){const U=ze[F];U?l[F].set(U.x,U.z,U.r,1):l[F].w=0}for(let F=0;F<Le;F++){const U=Math.round(F/(Le-1)*(_-1));Ne[F*4]=ne[U],Ne[F*4+1]=Y[U],Ne[F*4+2]=se[U],Ne[F*4+3]=h.R[U],i[F].set(ne[U],Y[U],se[U],h.R[U])}Ue.copy(Oe).addScaledVector(Te,6).addScaledVector(Ie,1.2);const wt=r.uBlow.value;for(let F=0;F<2;F++){const U=k===2?R.blow[F]:[0,R.blow[0][1]+.3,10.8];wt[F].copy(Oe).addScaledVector(De,U[0]).addScaledVector(Ie,U[1]).addScaledVector(Te,U[2])}r.uBulge.value=I.bulge}tt(0);const ot=.6428,at=.766,le=L=>{const j=L<440?9.5:L<526?9.5+12.5*H(440,526,L):22-(L-526)*.2588;if(L<=300)return new t.Vector3(0,j,252-L);if(L<=376.8){const X=(L-300)/110;return new t.Vector3(110-110*Math.cos(X),j,-48-110*Math.sin(X))}return new t.Vector3(25.73+ot*(L-376.8),j,-118.7-at*(L-376.8))},pt={crowns:[new t.Vector3(-55.1,h.crownH[0]+4.6,31.8),new t.Vector3(0,45.1,0),new t.Vector3(55.1,h.crownH[2]+4.6,-31.8)],underCrown:new t.Vector3(0,9.5,0),flyThrough:[0,60,120,180,220,252,284,300,320,340,360,376.8,410,440,480,526,560,588].map(le),course:le,portalSeat:{position:le(588),normal:new t.Vector3(-ot,.26,at).normalize(),radius:7},head:Ue.clone(),headPass:le(330),bulge:new t.Vector3(0,0,0),rainFoot:new t.Vector3(0,0,0),pacingOrigin:I.pOrigin.clone(),pacingDir:I.pDir.clone(),viewpoints:{entry:le(0),rise:le(112),underArch:le(252),headPass:le(330),exitLook:le(378)}},$e={object:a,radius:120,extent:175,height:68,center:new t.Vector3(0,22,0),anchors:pt,ground:!1,groundY:0,stats:f,variant:x,capsules:Ne,legs:ze,style:{uniforms:g,pal:z,material:(L={})=>Mt({uniforms:g,...L}),outline:(L={})=>yt({uniforms:g,resY:r.uResY,...L}),glsl:de},spineLength:A,spout:null,rain:1,progressFromU:L=>Math.min(1,Math.max(0,(L*42-7)/6)),setProgress(L){I.progress=Math.min(1,Math.max(0,L))},setHead(L){I.headK=L},setSurge(L=0,j=0){I.surge=L,I.lean=j},setPacing(L,j=0,X=0,E,we){I.pacing=Math.min(1,Math.max(0,L)),I.travel=j,I.sound=Math.min(1,Math.max(0,X)),E&&I.pOrigin.copy(E),we&&I.pDir.copy(we).normalize()},heightOfBulge:vt,update(L,j,X){g.uTime.value=j,e.renderer&&(r.uResY.value=e.renderer.getDrawingBufferSize(dt).y),a.updateMatrixWorld(),Pe.setFromMatrixPosition(X.matrixWorld),a.worldToLocal(Pe);const E=Pe.distanceTo(Ue);I.headAuto=H(120,35,E);const we=Math.atan2(Pe.x-h.x[Ve],Pe.z-h.z[Ve])-Math.atan2(h.ex[_-1],h.ez[_-1]),_e=Math.atan2(Math.sin(we),Math.cos(we)),He=Math.max(-.32,Math.min(.32,(_e-.45*Math.tanh(_e*4))*.6))*H(300,140,E);if(I.yaw=I.first?He:I.yaw+(He-I.yaw)*(1-Math.exp(-Math.min(L,.1)*1.6)),I.first=!1,tt(j),pe.copy(Pe).sub(Ue).normalize(),r.uLook.value.set(pe.dot(De),pe.dot(Ie),pe.dot(Te)),r.uJaw.value=.08+.05*Math.sin(j*.8)+.13*H(110,35,E)*(.75+.25*Math.sin(j*2.1)),r.uSpout.value=($e.spout??1)*H(.5,1,I.headRise)*(1-.9*I.sound)*(Oe.y>2?1:0),r.uRain.value=$e.rain,r.uLift.value=.22+.06*Math.sin(j*.6),he){pe.setFromMatrixPosition(X.matrixWorld),a.worldToLocal(pe),he.dome.position.copy(pe);const ce=a.parent;ce&&ce.fog&&ce.fog.color&&ce.fog.color.copy(g.uPaper.value).multiplyScalar(.94)}},dispose(){c.dispose()}};return $e}export{de as ENGRAVE_GLSL,ie as FOG_FRAG,ct as PALETTE,Ht as buildHero,Qe as engraveUniforms,Mt as styleMaterial,yt as styleOutline};
