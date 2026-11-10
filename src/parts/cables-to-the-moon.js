import*as r from"three";import{cmStream as Re,CM_GLSL as ie,CM_RIBBON as vt,withShared as fe,makeShared as pt,Geo as be,bound as me,CABLE_L as De,CABLE_D as Fe,CABLE_N as Ae,cableRadius as $e,cableDip as Ve,C as Q,clamp as te,lerp as Ye,sstep as ae,fract as wt}from"./cables-to-the-moon-common.js";import{makeCables as gt}from"./cables-to-the-moon-web.js";const oe=Math.PI*2,q={T:32,swing:6,stride:60,speed:60/32,s0:250,limbs:7,ours:2};q.route=q.limbs*q.ours*q.stride;const bt=s=>s/q.route*q.T,yt=.66,ze=.07,xt=.75,K={len:220,a:40,b:33,cy:-78,up:.9,down:1.22};function kt(s){const h=s.length,c=s.map((t,v)=>{const o=s[Math.max(0,v-1)],e=s[Math.min(h-1,v+1)];return(e[1]-o[1])/(e[0]-o[0])});return t=>{if(t<=s[0][0])return s[0][1];if(t>=s[h-1][0])return s[h-1][1];let v=0;for(;t>s[v+1][0];)v++;const o=s[v+1][0]-s[v][0],e=(t-s[v][0])/o,A=e*e,a=A*e;return(2*a-3*A+1)*s[v][1]+(a-2*A+e)*o*c[v]+(-2*a+3*A)*s[v+1][1]+(a-A)*o*c[v+1]}}function He(s,h=0){const c=kt([[0,0],[5e-4,.061],[.002,.122],[.005,.194],[.012,.3],[.05,.6],[.13,.86],[.27,1],[.44,.93],[.6,.8],[.75,.64],[.87,.47],[.95,.3],[.99,.14],[.995,.099],[.998,.063],[.9995,.031],[1,0]]),t={x:0,y:0,z:0,fold:0};return{point:(o,e)=>{const A=Math.max(c(o),0),a=Math.cos(e),w=Math.sin(e),b=wt(o*4.3+.18)-.5,f=Math.exp(-(b*b)/.0055)*ae(.05,.2,o)*ae(.97,.85,o),L=Math.cos(e*7+2.2*Math.sin(o*8+h)+h),N=.045*L*ae(.02,.2,o)*ae(1,.8,o),F=.11*s.n3(a*1.25+h,w*1.25,o*3.4)+.045*s.n3(a*3.1,w*3.1+h,o*9),S=A*(1-.15*f+N+F),z=6.5*Math.sin(o*4.4+.7+h)*A,y=-7*Math.exp(-((o-.3)*(o-.3))/.03)+13*(2*o-1)*(2*o-1);t.x=z+K.a*S*a,t.y=K.cy+y+K.b*S*w*(w<0?K.down:K.up),t.z=(.5-o)*K.len;const R=ae(.45,.9,w)*A;return t.y+=R*(1.3+1.6*Math.max(0,s.n2(o*26+h,e*5))),t.fold=te(f*.9+Math.max(0,-L)*.55*ae(.02,.2,o),0,1),t},prof:c}}const Qe=`
attribute vec4 aB; attribute vec3 aC, aAx;
uniform vec3 uSway;                          // roll about the cable (rad), bob (m), -
varying vec3 vW, vN, vObj, vNo, vQ, vCw, vAxw; varying vec4 vB; varying float vRho, vSc;
${ie}
vec3 swayP(vec3 p){ float c = cos(uSway.x), s = sin(uSway.x); return vec3(p.x*c - p.y*s, p.x*s + p.y*c + uSway.y, p.z); }
vec3 swayN(vec3 p){ float c = cos(uSway.x), s = sin(uSway.x); return vec3(p.x*c - p.y*s, p.x*s + p.y*c, p.z); }
void main(){
  vec3 p = position;
  if (aB.x > 0.5 && aB.x < 1.5) {                  // a sac fills and empties
    float b = sin(uTime*1.2566 + aB.y*6.2831853), b2 = b*(1.0 - 0.3*b*b);
    vec3 q = p - aC; float hgt = dot(q, aAx);
    p = aC + q*(1.0 + 0.05*b2) + aAx*max(hgt - aB.w, 0.0)*0.55*b2;          // it stands up out of the hide as it fills, and sinks back
  }
  vObj = p; vNo = normal; vQ = p - aC; vB = aB; vRho = aC.x;       // (on the body aC.x is the girth's radius there, metres)
  vSc = length(modelMatrix[0].xyz);                                // (the size the whole thing is drawn at: 1 for the hero, the second's own for the second)
  vCw = (modelMatrix*vec4(swayP(aC), 1.0)).xyz; vAxw = mat3(modelMatrix)*swayN(aAx);
  vec4 w = modelMatrix*vec4(swayP(p), 1.0);
  vW = w.xyz; vN = normalize(mat3(modelMatrix)*swayN(normal));
  gl_Position = projectionMatrix*viewMatrix*w;
}`,Xe=`
#define CM_FOLLOW uFol
uniform float uFol;              // (mend U, U1) the share of the land's fall this creature's place takes: see FAR_FRAG
uniform vec3 uBark, uBarkD, uMoss, uLichen, uFelt, uSac, uPodAmber, uPodDark, uSkin; uniform mat3 uRot;
varying vec3 vW, vN, vObj, vNo, vQ, vCw, vAxw; varying vec4 vB; varying float vRho, vSc;
${ie}
float sdSeg(vec2 p, vec2 a, vec2 b, float r){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba)/max(dot(ba, ba), 1e-5), 0.0, 1.0); return length(pa - ba*h) - r; }
// bark: plates between cracks. p: cells (along, round; per cells make the round). x = 0 on a crack, rising into
// the plate; y = the plate's number
vec2 plates(vec2 p, float per){
  vec2 n = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0, id = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)), c = n + g; c.y = mod(c.y, per);
    vec2 o = cmH2(c), r = g + o - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; id = cmH(c + 7.7); } else if (d < d2) d2 = d;
  }
  return vec2(sqrt(d2) - sqrt(d1), id);
}
void main(){
  vec3 v = normalize(cameraPosition - vW);
  vec3 n = normalize(vN);
  float part = vB.x;
  float toward = clamp(dot(-v, uSunDir), 0.0, 1.0);
  // ---- the relief of the hide (worked out for every fragment, so its screen derivatives are sound)
  float up = normalize(vNo).y, fold = vB.w, th = vB.z;
  // BARK AND BLADDER. The back and the upper flanks are furrowed bark: long ridges that run the length of the body
  // and wander, cracked across; within a ridge, fibre and flakes (the second, finer size: it is what says how big
  // the thing is). The belly is a bladder: taut pale skin, veined.
  float bark = smoothstep(-0.25, 0.3, up), zz = vObj.z;
  // (round Q, R3: NO PATTERN OF THE HIDE IS LAID BY THE ANGLE ROUND THE BODY SO THAT IT PINCHES WHERE THE BODY
  // CLOSES. Fibre, flake, grain, the cracks across, the veins, the hair and the wander of the ridges are laid in
  // the body's own metres (patterns in space, drawn out along its length): they have no pole. The long ridges
  // are counted round the body, 34 of them, so they DIE OUT as the girth falls toward an end: a ridge is whole
  // where it is 3.2 m broad (17 m of girth radius) and gone where it would be 0.9 m (5 m): the end is a blunt
  // cap of plain bark and moss, never a fan. Every pattern goes to its mean by the pixel's LARGER footprint.)
  vec3 oq = vec3(vObj.xy, zz); float rr = max(vRho, 0.0), ridgeW = rr/5.4113;
  // (mend R, G3: THE HIDE IS THE SAME HIDE AT ANY SIZE. Its patterns are laid in the body's own metres, so the
  // footprint they go to their mean by is the pixel's reach in those metres (the world's, over the size the
  // body is drawn at), and the relief's slope, further down, is the pattern's slope times that size. The
  // second of the kind, half the hero's size, had its ridges cut twice as steep as the hero's and kept twice
  // as long under the pixel: a pale back with hard dark stripes. For the hero the size is 1: nothing changes.)
  float fpx = cmPxMax(vW)/max(vSc, 1e-3), near1 = 1.0 - smoothstep(0.10, 0.54, fpx), near2 = 1.0 - smoothstep(0.034, 0.19, fpx);
  float wob = 1.3*cmN3(vec3(oq.xy*0.075, zz*0.028)) + 0.35*cmN3(vec3(oq.xy*0.2, zz*0.1));
  float rdgK = smoothstep(0.9, 3.2, ridgeW)*(1.0 - smoothstep(0.33, 0.8, fpx/max(ridgeW, 1e-3)));
  float rdg = mix(0.5, abs(fract(th*5.4113 + wob) - 0.5)*2.0, rdgK);     // 34 ridges round: 0 in a furrow .. 1 on a ridge
  float across = smoothstep(0.0, 0.2, abs(cmN3(vec3(oq.xy*0.175, zz*0.21)) - 0.5)*2.0);
  float fibre = cmN3(vec3(oq.xy*2.25, zz*0.8)), flake = cmN3(vec3(oq.xy*0.78, zz*0.31)), grainB = cmN3(vec3(oq.xy*6.5, zz*2.6));
  float hBark = smoothstep(0.0, 0.6, rdg)*(0.72 + 0.28*across) + (0.22*(flake - 0.5) + 0.12*(fibre - 0.5))*near1 + 0.06*(grainB - 0.5)*near2;
  float veinB = 1.0 - smoothstep(0.0, 0.12, abs(cmF3(vec3(oq.xy*0.125, zz*0.1)) - 0.5)*2.0);
  float hBlad = 0.1*veinB + 0.05*cmN3(vec3(oq.xy*0.5, zz*0.6))*near1;
  float h = mix(hBlad, hBark, bark)*(1.0 - step(0.5, part));
  vec3 dpx = dFdx(vW), dpy = dFdy(vW); float hx = dFdx(h), hy = dFdy(h);
  vec3 col;
  if (part < 0.5) {
    float lod = 1.0 - smoothstep(0.25, 1.2, fpx);                        // the relief goes flat under the pixel's footprint
    vec3 r1 = cross(dpy, n), r2 = cross(n, dpx); float det = dot(dpx, r1);
    vec3 grad = (hx*r1 + hy*r2)*sign(det)/max(abs(det), 1e-6);
    n = normalize(n - clamp(grad*vSc, -3.0, 3.0)*0.85*lod);
    // bark: dark in the furrows, grey-green on the ridges, lichen in pale rosettes, moss in every furrow and fold
    vec3 albB = mix(uBarkD*0.6, uBark, smoothstep(0.05, 0.7, rdg)*(0.6 + 0.4*across))*(0.72 + 0.56*mix(0.5, 0.6*flake + 0.4*fibre, near1));
    float lich = smoothstep(0.6, 0.72, cmN3(vObj*0.22 + 40.0))*smoothstep(0.35, 0.6, cmN3(vObj*1.3))*smoothstep(0.3, 0.7, rdg);
    albB = mix(albB, uLichen*(0.6 + 0.4*smoothstep(0.3, 0.7, rdg)), lich*0.5);          // (lichen lies in the bark's own relief: never a flat pale oval)
    float moss = clamp((1.0 - smoothstep(0.0, 0.45, rdg))*0.8 + fold*1.1 + smoothstep(0.5, 0.75, cmF3(vObj*0.05 + 5.0))*0.8 - 0.15, 0.0, 1.0)*smoothstep(-0.4, 0.3, up);
    albB = mix(albB, uMoss*(0.45 + 0.6*cmN3(vObj*0.8)), moss*0.85);
    // bladder: pale grey-green skin with darker veins, mottled
    vec3 albS = mix(vec3(0.30, 0.37, 0.22), uSac*0.85, 0.35 + 0.5*cmN3(vObj*0.09 + 9.0))*(1.0 - 0.4*veinB)*(0.85 + 0.25*cmN3(vObj*0.7));
    vec3 alb = mix(albS, albB, bark);
    // seed-hair lies on the flanks and the belly in pale hanging streaks, thickest in the folds (the streaks go
    // to their mean, 0.3, under the pixel's footprint: the hair is there at every distance); and the hide is
    // drawn up into pale knots, a hashed scatter over the flanks and belly (about half of its cells hold one)
    float hairy = mix(0.3, smoothstep(0.45, 0.7, cmN3(vec3(oq.xy*0.95, zz*0.5 + 3.0*cmN3(vec3(oq.xy*0.05, zz*0.07))))), near1)*smoothstep(0.5, -0.5, up)*(0.5 + 0.5*fold);
    alb = mix(alb, uFelt*(0.7 + 0.4*fibre), hairy*0.3);
    float knot = (1.0 - smoothstep(0.1, 0.3, length(fract(vec2(zz*0.11, th*2.7) + cmH2(floor(vec2(zz*0.11, th*2.7)))*0.5) - 0.5)))*step(0.55, cmH(floor(vec2(zz*0.11, th*2.7)) + 3.3))*smoothstep(0.2, -0.6, up)*smoothstep(8.0, 20.0, rr);   // (the knots' cells are counted round the body: none where the girth closes)
    alb = mix(alb, uFelt*0.9, knot*0.6);
    float ao = (1.0 - 0.45*fold)*(0.55 + 0.45*mix(1.0, smoothstep(0.0, 0.5, rdg), bark))*(0.72 + 0.28*smoothstep(-1.0, 0.3, up));
    float ndl = dot(n, uSunDir);
    float diff = clamp((ndl + 0.3)/1.3, 0.0, 1.0);
    // lit by the sun on its sunward side, by the sky at its own height, and from below by the bright roof of the
    // forest (as its limbs and its rope are): the side turned from the sun has its ribs and folds in that light
    vec3 bounce = cmBounceL*vec3(0.42, 0.47, 0.3)*dot(uSunCol, vec3(0.33))*0.3*clamp(0.6 - 0.4*n.y, 0.0, 1.0);
    col = alb*(cmSunL*cmLitL(ndl)*0.6 + cmAmb(n)*0.8 + bounce)*ao;
    // the bladder is taut: a dull sheen, and the low sun comes a little way into its skin at the edge
    float nv = clamp(dot(n, v), 0.0, 1.0), rim = pow(1.0 - nv, 2.4);
    vec3 hv = uSunDir + v; hv /= max(length(hv), 1e-3);
    col += cmSunL*(1.0 - bark)*(pow(clamp(dot(n, hv), 0.0, 1.0), 26.0)*0.1 + uSac*rim*0.35*toward*toward);
    // (mend T, T3: THE RIM WHERE IT CROSSES THE SUN IS LIGHT CAUGHT IN ITS SEED-HAIR: only where the hair lies
    // (the flanks and the belly, in its own streaks: broken, uneven) and only as the thing stands toward the
    // sun from the eye; no edge of the bare hide or the bark is outlined, and nothing is lit from the side
    // away from the sun. It was an even pale edge all round, a little of it at every bearing.)
    col += cmSunL*uFelt*rim*0.45*toward*toward*bark*clamp(3.0*hairy, 0.0, 1.2);
  } else if (part < 1.5) {
    // ---- a breathing sac: a bladder in the hide. Where it comes out of the bark the skin is puckered into a
    // dark gathered rim; over the dome it is stretched thin, veined, and the light stands in it
    vec3 q = vQ, axw = normalize(vAxw), rel = vW - vCw;
    float em = max(dot(rel, axw) - vB.w, 0.0);                             // metres it stands out of the hide here
    vec3 tang = rel - axw*dot(rel, axw); float tl = max(length(tang), 1e-3);
    vec3 e1 = normalize(cross(axw, vec3(0.31, 0.2, 0.93))), e2 = cross(axw, e1);
    float ang = atan(dot(tang, e2), dot(tang, e1));
    float rimK = 1.0 - smoothstep(0.0, 0.45, em);                          // where it comes out of the hide (no dark ring: G2)
    float pucker = 0.5 + 0.5*sin(ang*31.0 + 7.0*cmN(vec2(ang*2.0, vB.y*40.0)));
    float veins = abs(cmF3(q*0.5 + vB.y*30.0) - 0.5)*2.0;
    float vein = 1.0 - smoothstep(0.0, 0.085, veins);
    // SOME ARE FULL, SOME SLACK (three in five full): a full one is taut and has a sheen; a slack one hangs in
    // folds that run out from its middle, and is duller
    float full = step(0.4, fract(vB.y*7.31)), slackK = 1.0 - full;
    float foldS = sin(ang*13.0 + 5.0*cmN(vec2(ang*3.0, em*0.8 + vB.y*9.0)));
    foldS *= smoothstep(0.3, 1.3, tl);                                     // (R3: the folds die out toward the dome's middle, where they would pinch)
    n = normalize(n + cross(axw, tang/tl)*foldS*0.55*slackK*smoothstep(0.2, 1.5, em));
    // A SWELLING OF THE HIDE, in the hide's own light: the sun, the sky at its height, the roof's green from
    // below; its crown takes the light and its sides turn away into the gathered rim
    float dome = clamp(dot(n, axw), 0.0, 1.0);
    float ndl = dot(n, uSunDir), diff = clamp((ndl + 0.3)/1.3, 0.0, 1.0);
    float nv = clamp(dot(n, v), 0.0, 1.0);
    float thru = pow(1.0 - nv, 1.5)*(0.35 + 0.65*toward) + 0.35*clamp(-ndl, 0.0, 1.0);
    // (G2: A BOSS IS A DOME WITH HIDE-LIGHT, never a ring round a dark or a pale middle: at its foot it is the
    // hide's own bark colour, and it goes a little greener and paler over the dome; no dark rim, no pale lip)
    vec3 hideC = mix(uBarkD, uBark, 0.5);
    vec3 skin = mix(hideC, mix(hideC, mix(vec3(0.3, 0.37, 0.22), uSac*0.62, 0.3 + 0.5*full), 0.55), smoothstep(0.2, 2.6, em));
    // (the roof's green from below is the widest light on the side turned from the sun: the under-curve of a
    // swelling takes it and its upper curve does not, which is what makes it a dome)
    vec3 bounce = cmBounceL*vec3(0.42, 0.47, 0.3)*dot(uSunCol, vec3(0.33))*0.6*clamp(0.5 - 0.5*n.y, 0.0, 1.0);
    col = skin*(cmSunL*cmLitL(ndl)*0.6 + cmAmb(n)*0.8 + bounce)*(0.6 + 0.4*dome)*(1.0 - 0.3*vein)*(1.0 - rimK*0.07*pucker)*(1.0 - 0.3*slackK*(0.5 - 0.5*foldS));
    col += uSac*vec3(1.1, 1.0, 0.45)*cmSunL*thru*0.2*(1.0 - rimK)*(0.4 + 0.6*full);
    // the sheen: the sun in a small bright point, and the bright roof below lying on the under-curve of a taut skin
    vec3 h = uSunDir + v; h /= max(length(h), 1e-3); vec3 rf = reflect(-v, n);
    col += (cmSunL*(pow(clamp(dot(n, h), 0.0, 1.0), 50.0)*0.3 + pow(clamp(dot(n, h), 0.0, 1.0), 7.0)*0.05) + cmBounceL*vec3(0.5, 0.56, 0.34)*dot(uSunCol, vec3(0.33))*pow(clamp(-rf.y, 0.0, 1.0), 5.0)*0.28)*(1.0 - rimK)*(0.25 + 0.75*full);
  } else if (part < 2.5) {
    // ---- a dark pod: a great seed, ribbed
    vec3 relP = vW - vCw, axP = normalize(vAxw); float poleP = smoothstep(0.15, 0.7, length(relP - axP*dot(relP, axP)));
    float ribs = mix(0.5, 0.5 + 0.5*cos(vB.z*9.0), poleP);                 // (R3: a pod's ribs die out toward its two ends)
    float ndl = dot(n, uSunDir), diff = clamp((ndl + 0.25)/1.25, 0.0, 1.0);
    col = uPodDark*(0.55 + 0.6*ribs)*(cmSunL*diff*0.55 + cmAmb(n)*0.8);
    vec3 h = uSunDir + v; h /= max(length(h), 1e-3);
    col += cmSunL*pow(clamp(dot(n, h), 0.0, 1.0), 24.0)*0.12*ribs;
  } else if (part < 3.5) {
    // ---- a clear pod: amber-green glass with a small curled figure inside, lit through where the sun is behind it
    vec3 axw = normalize(vAxw), rd = -v, cw = vCw;
    vec3 pn = rd - axw*dot(rd, axw); pn /= max(length(pn), 1e-3);              // a plane through the axis, facing the eye
    float t = dot(cw - vW, pn)/max(dot(rd, pn), 0.05);
    vec3 hp = vW + rd*t - cw;
    vec2 f0 = vec2(dot(hp, axw), dot(hp, cross(axw, pn)))/2.7;                // along the pod (its fat lower end is +1), across it
    vec2 f = (f0 - vec2(0.36, 0.0))/0.8;                                       // the figure lies curled in its fat end, head down
    // the figure: head tucked, back curved, knees drawn up; it stirs
    float st = sin(uTime*0.5 + vB.y*40.0), st2 = sin(uTime*0.31 + vB.y*17.0);
    vec2 hd = vec2(0.30 + 0.015*st, 0.03 + 0.02*st2);
    float d = length(f - hd) - 0.105;
    d = min(d, sdSeg(f, vec2(0.20, -0.02), vec2(-0.06, -0.10), 0.085));       // back
    d = min(d, sdSeg(f, vec2(-0.06, -0.10), vec2(-0.26, -0.03), 0.08));       // hips
    d = min(d, sdSeg(f, vec2(-0.26, -0.03), vec2(-0.05 + 0.02*st, 0.10), 0.055)); // thigh
    d = min(d, sdSeg(f, vec2(-0.05 + 0.02*st, 0.10), vec2(-0.28, 0.13), 0.045));  // shin
    d = min(d, sdSeg(f, vec2(0.16, 0.0), vec2(0.04, 0.09 + 0.02*st2), 0.04));     // arm
    // a soft shape seen through the wall, never a hard mark. The figure is a pattern of the pod's wall a metre
    // or so across: it melts into the pod's own colour as the pixel's footprint on the pod grows from 0.22 to
    // 0.34 m (antialiasing; fpx is the larger reach, cmPxMax): a pod of a few pixels is a plain lit seed
    float fig = (1.0 - smoothstep(-0.03, 0.05, d))*(1.0 - smoothstep(0.22, 0.34, fpx));
    float nv = clamp(dot(n, v), 0.0, 1.0);
    float glass = 0.30 + 0.7*pow(1.0 - nv, 2.0);
    float back = 0.7 + 1.9*toward*toward + 0.5*clamp(dot(-n, uSunDir), 0.0, 1.0);
    // lit through like a green grape held to the light: brightest where it is thickest, a paler wall at its
    // edge, faintly ribbed; the light in it is the sun's with half its gold taken out by the green of the wall
    vec3 sunW = dot(cmSunL, vec3(0.3, 0.5, 0.2))*vec3(0.9, 1.0, 0.62);
    vec3 body = uPodAmber*(cmAmb(n)*0.5 + sunW*0.2*min(back, 1.9)*(0.35 + 0.65*nv));
    body = mix(body, body*vec3(1.12, 1.0, 0.62), smoothstep(-0.3, 0.8, f0.x)*0.6);
    body *= 0.86 + 0.14*cos(vB.z*8.0)*smoothstep(0.15, 0.7, length(hp - axw*dot(hp, axw)));
    body += uPodAmber*sunW*0.1*pow(1.0 - nv, 3.0);
    col = mix(body, mix(uSkin, vec3(0.3, 0.22, 0.1), 0.45)*(cmAmb(n)*0.75 + sunW*0.06*back), fig*0.8);
    vec3 h = uSunDir + v; h /= max(length(h), 1e-3);
    col += cmSunL*pow(clamp(dot(n, h), 0.0, 1.0), 90.0)*0.55 + cmAmb(n)*glass*0.12;
  } else {
    // ---- a pad of dried sap
    float ndl = dot(n, uSunDir);
    col = vec3(0.15, 0.115, 0.06)*(cmSunL*clamp(ndl*0.7 + 0.3, 0.0, 1.0)*0.4 + cmAmb(n)*0.7);
    vec3 h = uSunDir + v; h /= max(length(h), 1e-3);
    col += cmSunL*pow(clamp(dot(n, h), 0.0, 1.0), 40.0)*0.14;
  }
  col = cmAir(col, vW);
  gl_FragColor = vec4(col, 1.0);
}`;function Ze(){return new be({aB:4,aC:3,aAx:3})}function Ce(s,h,c,t,v){const o=s.count,e=new Float32Array((c+1)*(t+1)*3),A=[],a=[];for(let b=0;b<=c;b++){const f=b/c,L=te(.5-.5*Math.cos(Math.PI*f)*(.7+.3*Math.abs(Math.cos(Math.PI*f))),0,1);A.push(L);for(let N=0;N<=t;N++){const F=h.point(L,N/t*oe),S=(b*(t+1)+N)*3;e[S]=F.x,e[S+1]=F.y,e[S+2]=F.z,a.push(F.fold)}}const w=(b,f)=>(te(b,0,c)*(t+1)+(f%t+t)%t)*3;for(let b=0;b<=c;b++)for(let f=0;f<=t;f++){const L=(b*(t+1)+f)*3,N=w(b,f-1),F=w(b,f+1),S=w(b-1,f),z=w(b+1,f),y=e[F]-e[N],R=e[F+1]-e[N+1],H=e[F+2]-e[N+2],M=e[z]-e[S],T=e[z+1]-e[S+1],p=e[z+2]-e[S+2];let m=R*p-H*T,u=H*M-y*p,n=y*T-R*M;const x=Math.hypot(m,u,n);x<1e-6?(m=0,u=0,n=b<c/2?1:-1):(m/=x,u/=x,n/=x),m*e[L]+u*(e[L+1]-K.cy)+n*e[L+2]*.3<0&&(m=-m,u=-u,n=-n),v(A[b],f/t*oe,a[b*(t+1)+f]),s.v(e[L],e[L+1],e[L+2],m,u,n)}s.stitch(o,c+1,t,!0)}function Te(s,h,c,t,v,o,e,A,a=10,w=7,b=1,f=0){const L=s.count,N=new r.Vector3().crossVectors(c,t).normalize(),F=new r.Vector3().crossVectors(N,c).normalize();for(let S=0;S<=w;S++){const z=S/w*Math.PI,y=Math.sin(z),R=Math.cos(z);for(let H=0;H<=a;H++){const M=H/a*oe,T=Math.cos(M),p=Math.sin(M),m=e===2||e===3?Math.pow(y,.9)*(.62+.38*R):y,u=R*v,n=T*m*o,x=p*m*o*b,P=R/v,i=T*y/o,d=p*y/(o*b),g=h.x+c.x*u+N.x*n+F.x*x,V=h.y+c.y*u+N.y*n+F.y*x,I=h.z+c.z*u+N.z*n+F.z*x;let D=c.x*P+N.x*i+F.x*d,G=c.y*P+N.y*i+F.y*d,C=c.z*P+N.z*i+F.z*d;const B=Math.hypot(D,G,C)||1;s.set("aB",e,A,M,f),s.set("aC",h.x,h.y,h.z),s.set("aAx",c.x,c.y,c.z),s.v(g,V,I,D/B,G/B,C/B)}}s.stitch(L,w+1,a,!0)}function ce(s,h,c,t){const v=s.point(h,c);t.p.set(v.x,v.y,v.z);const o=s.point(h,c+.02);qe.set(o.x,o.y,o.z).sub(t.p);const e=s.point(Math.min(h+.004,1),c);return et.set(e.x,e.y,e.z).sub(t.p),t.n.crossVectors(qe,et).normalize(),t.n.dot(St.set(t.p.x,t.p.y-K.cy,0))<0&&t.n.negate(),t.down.copy(qe).normalize(),t.down.y>0&&t.down.negate(),t}const qe=new r.Vector3,et=new r.Vector3,St=new r.Vector3,tt=`
attribute vec4 aL, aF;
uniform vec3 uJ[28]; uniform vec3 uLN[7]; uniform vec4 uHand[7];     // joints (body space); each limb's plane; hand: grip 0..1, cable radius there,
uniform vec3 uDown;                                                  // (mend V) how the rope's sink changes along the hand (m a metre), the share of the land's fall the hand has taken
uniform float uFol;              // (mend U, U1) the share of the land's fall this creature's place takes: see FAR_FRAG
varying vec3 vW, vN; varying vec4 vL; varying vec2 vPhi; varying float vFol;
${ie}
void main(){
  int li = int(aL.x + 0.5);
  float kind = aL.w;
  vec3 c, N1, N2, T = vec3(0.0, 0.0, -1.0);
  if (kind < 0.5 || kind > 1.5) {
    float t = clamp(aL.y, 0.0, 2.9999); int sg = int(floor(t)); float f = t - float(sg);
    vec3 P0 = uJ[li*4 + max(sg - 1, 0)], P1 = uJ[li*4 + sg], P2 = uJ[li*4 + sg + 1], P3 = uJ[li*4 + min(sg + 2, 3)];
    vec3 m1 = (P2 - P0)*0.2, m2 = (P3 - P1)*0.2;                          // straight between its joints, turning at the knees
    float f2 = f*f, f3 = f2*f;
    c = (2.0*f3 - 3.0*f2 + 1.0)*P1 + (f3 - 2.0*f2 + f)*m1 + (-2.0*f3 + 3.0*f2)*P2 + (f3 - f2)*m2;
    T = (6.0*f2 - 6.0*f)*P1 + (3.0*f2 - 4.0*f + 1.0)*m1 + (-6.0*f2 + 6.0*f)*P2 + (3.0*f2 - 2.0*f)*m2;
    T /= max(length(T), 1e-4);
    N1 = uLN[li]; N2 = cross(T, N1);
    // a living bough is never straight: it wanders between its joints
    float env = sin(3.14159*clamp(aL.y/3.0, 0.0, 1.0));
    c += (N1*sin(aL.y*5.3 + aL.x*2.1) + N2*cos(aL.y*3.9 + aL.x*1.3))*0.6*env;
  } else {
    // a finger: a rootlet that curls round the cable under the hand. When the hand lets go it opens as a claw
    // does: still hooked half round, standing off the rope by at most 0.6 of its radius more (so an open hand
    // is a hooked hand on the end of its limb, never prongs standing up alone over the rope)
    float w = aL.y, grip = uHand[li].x, rc = uHand[li].y, open = 1.0 - grip;
    vec3 G = uJ[li*4 + 3];
    float R = (rc + 0.75)*(1.0 + open*w*0.6);
    float th = aF.y*(0.22 + w*(3.25*grip + 1.75*open));
    vec3 radial = vec3(sin(th), cos(th), 0.0);
    c = G - vec3(0.0, rc + 0.75, 0.0) + radial*R + vec3(0.0, 0.0, aF.x*(1.0 + 0.25*w*open));
    // (mend V) the rope under a hand has sunk more at the hand's lower side than at its upper: each finger
    // closes round the rope where the rope is drawn at the finger's own metre (aF.x: its place along the hand)
    c -= uDown*(uHand[li].z*aF.x*(1.0 + 0.25*w*open));
    N1 = vec3(0.0, 0.0, 1.0); N2 = radial;
  }
  vec3 p, nrm;
  if (kind < 1.5) { nrm = N1*position.x + N2*position.y; p = c + nrm*position.z; }
  else if (kind < 2.5) {
    // a drape: it hangs from the underside, streams back down the cable, sways from its root
    float q = aL.z, L = aF.x, ph = aF.w;
    vec3 sw = vec3(sin(uTime*0.7 + ph*30.0 + q*2.0), 0.0, 0.6*sin(uTime*0.5 + ph*17.0 + q*3.0))*L*0.07*q*q;
    p = c + uDown*(position.z*0.7 + L*q*(1.0 - 0.15*q)) + vec3(0.0, 0.0, 1.0)*L*0.28*q*q + sw + T*aF.y*aF.z*(1.0 - 0.75*q);
    nrm = cross(T, uDown); float nl = length(nrm); nrm = nl > 1e-3 ? nrm/nl : vec3(1.0, 0.0, 0.0);     // (a drape that hangs straight down its bough has no side of its own)
  } else {
    // a shoot: a young leaf standing out of the knee, drooping a little at the tip
    float u = aL.z, L = aF.x, s = aF.y, an = aF.z;
    vec3 dir = N1*cos(an) + N2*sin(an) + T*aF.w; dir /= max(length(dir), 1e-3);
    vec3 wd = cross(dir, T); wd /= max(length(wd), 1e-3);
    float bw = 0.24*L*sin(3.14159*pow(clamp(u, 0.0, 1.0), 0.7));
    float fl = 0.06*L*u*sin(uTime*(1.5 + aF.w) + an*7.0 + aL.x*3.0);
    p = c + dir*(position.z + u*L) + wd*s*bw + T*fl + uDown*0.15*L*u*u;
    nrm = cross(dir, wd);
  }
  vec4 wp = modelMatrix*vec4(p, 1.0);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix)*nrm); vL = aL; vPhi = kind < 1.5 ? vec2(atan(position.y, position.x), 0.0) : vec2(aF.y, aF.w);
  // (mend V) THE SHARE OF THE LAND'S FALL THIS POINT TAKES, for the light by a thing's own height: the creature's
  // own (uFol: its place on its rope) and, along a limb whose hand has gone down with a sinking rope, the
  // hand's share (uHand.w) by the point's place along the limb: none at the shoulder, all of it at the hand
  vFol = uFol + uHand[li].w*(kind > 0.5 && kind < 1.5 ? 1.0 : clamp(aL.y/3.0, 0.0, 1.0));
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,at=`
#define CM_FOLLOW vFol
varying float vFol;              // (mend U, U1; mend V) the share of the land's fall this point takes: said in LIMB_VERT
uniform vec3 uBark, uBarkD, uMoss, uLichen, uFelt;
varying vec3 vW, vN; varying vec4 vL; varying vec2 vPhi;
${ie}
void main(){
  vec3 v = normalize(cameraPosition - vW);
  vec3 n = normalize(vN);
  float t = clamp(vL.y, 0.0, 3.0), kind = vL.w;
  float toward = clamp(dot(-v, uSunDir), 0.0, 1.0);
  vec3 col;
  float fpx = cmPx(vW);                                  // the pixel's footprint on the limb (taken before the branch below)
  if (kind < 1.5) {
    float len = vL.z, phi = vPhi.x, fing = kind;
    float lod = 1.0 - smoothstep(0.25, 1.35, fpx), lodFar = 1.0 - smoothstep(0.10, 0.7, fpx);   // footprint fades (cmPx)
    // bark of a living bough: long fibrous ridges, cracked across, callus at the knees, moss on every upper side
    float knee = (exp(-(t - 1.0)*(t - 1.0)/0.01) + exp(-(t - 2.0)*(t - 2.0)/0.01))*(1.0 - fing);
    float ridge = cmN(vec2(phi*4.0 + 0.6*sin(len*0.07), len*0.06 + vL.x*7.0));
    float fine = cmN(vec2(phi*13.0, len*0.5 + vL.x*3.0));
    float crack = smoothstep(0.0, 0.16, abs(cmN(vec2(phi*2.0 + vL.x, len*0.33)) - 0.5)*2.0);
    crack = mix(0.87, crack, lodFar);                    // (0.87: the mean of the cracks' light)
    float h = mix(0.6*ridge + 0.4*fine, cmN(vec2(phi*6.0, len*1.3)), knee*0.7)*crack;
    vec3 alb = mix(uBarkD, uBark, smoothstep(0.1, 0.7, h))*(0.85 + 0.3*mix(0.5, fine, lodFar));
    alb = mix(alb, uLichen, smoothstep(0.6, 0.8, cmN(vec2(phi*1.5 + 9.0, len*0.11)))*0.5);
    alb = mix(alb, uMoss, smoothstep(-0.1, 0.7, n.y)*smoothstep(0.25, 0.6, cmN(vec2(phi*2.2 + 3.0, len*0.09)))*0.85);
    // (a finger has the limb's own bark and moss, a shade darker: the hero's green-brown, never pale)
    alb *= 1.0 - 0.2*fing;
    float ndl = dot(n, uSunDir), diff = clamp((ndl + 0.3)/1.3, 0.0, 1.0);
    // (the lit roof below reaches the side turned from the sun: no limb or hand is a black shape on the rope)
    vec3 bounce = cmBounceL*vec3(0.42, 0.47, 0.3)*dot(uSunCol, vec3(0.33))*0.6*clamp(0.6 - 0.4*n.y, 0.0, 1.0);
    col = alb*(cmSunL*cmLitL(ndl)*0.6 + cmAmb(n)*0.85 + bounce)*(0.7 + 0.3*crack)*(0.85 + 0.3*mix(0.5, h, lod));
    // (mend T, T3: the rim is the sun in the limb's moss, toward the sun only, broken by the bark's own grain)
    float rim = pow(clamp(1.0 - dot(n, v), 0.0, 1.0), 2.6)*toward*toward*2.0*mix(0.5, smoothstep(0.3, 0.7, h), lod);
    col += cmSunL*uFelt*rim*0.2*(1.0 - 0.85*fing)*mix(0.5, 1.0, lod);       // (no pale edge on a finger; half on a limb a pixel or two wide)
  } else if (kind < 2.5) {
    // moss and seed-hair hanging: pale, the sun in it from behind
    float q = vL.z;
    float fib = 0.6 + 0.4*cmN(vec2(vPhi.x*3.0 + vPhi.y*50.0, q*6.0));
    vec3 alb = mix(uMoss*1.2, uFelt, smoothstep(0.1, 0.8, q))*fib;
    col = alb*(cmAmb(vec3(0.0, 0.3, 0.0))*0.8 + cmSunL*(0.10 + 0.5*toward*toward));
  } else {
    // a young leaf on a pollard shoot
    col = cmLeaf(n, v, 0.25 + 0.5*fract(vPhi.y*7.0 + vL.x*0.37), 1.0, 0.85, 0.5);
  }
  col = cmAir(col, vW);
  gl_FragColor = vec4(col, 1.0);
}`,ne=[{z:-80,x:8,L:164,a:.3,bx:1,by:.25,off:205,turn:0,thick:1},{z:-52,x:-10,L:126,a:.3,bx:-.3,by:-.6,off:135,turn:5,thick:.85},{z:-22,x:11,L:114,a:.3,bx:1,by:.1,off:92,turn:3,thick:.9},{z:8,x:-9,L:114,a:.3,bx:-.3,by:-.5,off:-78,turn:1,thick:1.05},{z:36,x:12,L:136,a:.3,bx:1,by:.15,off:-130,turn:6,thick:.95},{z:66,x:-8,L:158,a:.3,bx:-.25,by:-.65,off:-185,turn:4,thick:.82},{z:96,x:7,L:190,a:.29,bx:.9,by:.3,off:-250,turn:2,thick:1.1}],zt=1.04,ot=.985,Mt=.35,Lt=2,nt=s=>s.L*(zt-2*s.a*(1-ot));function Ie(s,h,c){const t=h/3,v=Ye(3,1.25,Math.pow(t,.8))*s.thick,o=1+.95*Math.exp(-((h-1)*(h-1))/.006)+.85*Math.exp(-((h-2)*(h-2))/.006)+1.3*Math.exp(-h/.13)+.5*Math.exp(-((3-h)*(3-h))/.004);return v*o*(1+.1*c)}function st(s,h,c={}){const t=new be({aL:4,aF:4}),v=c.NR??60,o=c.NS??14,e=c.skip||[],A=a=>{const w=t.count-(a+1)*2;for(let b=0;b<a;b++){const f=w+b*2;t.i.push(f,f+1,f+2,f+1,f+3,f+2)}};for(let a=0;a<7;a++){if(e.includes(a))continue;const w=ne[a],b=t.count,f=[w.a*w.L,(1-2*w.a)*w.L,w.a*w.L];for(let z=0;z<=v;z++){const y=z/v*3,R=Math.min(2,Math.floor(y)),H=(R>0?f[0]:0)+(R>1?f[1]:0)+(y-R)*f[R];for(let M=0;M<=o;M++){const T=M/o*oe,p=Ie(w,y,s.n2(y*7+a*9.1,Math.cos(T)*1.6+Math.sin(T)*2.3)+.6*s.n2(y*23+a*3,Math.cos(T)*3.1));t.set("aL",a,y,H,0),t.set("aF",0,0,0,0),t.v(Math.cos(T),Math.sin(T),p)}}t.stitch(b,v+1,o);const L=6,N=c.FR??11,F=c.FS??6;for(let z=0;z<L;z++){const y=t.count,R=(z-(L-1)/2)*1.5*w.thick,H=z%2?1:-1,M=(.75-.06*Math.abs(z-2.5))*w.thick;for(let T=0;T<=N;T++){const p=T/N;for(let m=0;m<=F;m++){const u=m/F*oe;t.set("aL",a,p,p*12,1),t.set("aF",R,H,0,z/L),t.v(Math.cos(u),Math.sin(u),M*(1-.72*p)*(1+.25*Math.sin(p*9+z)))}}t.stitch(y,N+1,F)}const S=Math.round(w.L/14);for(let z=0;z<S;z++){const y=.12+2.8*(z+h())/S,R=h.range(4,11)*(.7+.5*Math.sin(Math.PI*y/3)),H=h.range(.4,1),M=h(),T=4,p=Ie(w,y,0);for(let m=0;m<=T;m++)for(const u of[-1,1])t.set("aL",a,y,m/T,2),t.set("aF",R,u,H,M),t.v(0,0,p);A(T)}for(const z of[1,2])for(let y=0;y<2;y++){const R=h.range(3,6)*w.thick,H=h.range(0,oe),M=h.range(-.5,.5),T=Ie(w,z,0)*.8,p=z+h.range(-.06,.06);for(let m=0;m<=3;m++)for(const u of[-1,1])t.set("aL",a,p,m/3,3),t.set("aF",R,u,H,M),t.v(0,0,T);A(3)}}return t}function We(s,h=0,c={}){const v=c.gap||[0,0,0,0,0,0,0],o=c.swing||[1,1,1,1,1,1,1],e=c.sway||[0,0,0],A=ne.map(M=>{const T=.5-M.z/K.len,p=Math.PI/2-M.x/K.a*.9,m=s.point(T,p);return new r.Vector3(m.x,m.y-4,m.z)}),a={phase0:h,sBody:q.s0,sway:0,bob:0,J:Array.from({length:28},()=>new r.Vector3),LN:Array.from({length:7},()=>new r.Vector3(1,0,0)),hand:Array.from({length:7},()=>new r.Vector4(1,4,0,0)),grips:Array.from({length:7},()=>new r.Vector4(0,0,0,0)),lift:new Float32Array(7),swingE:new Float32Array(7),shift:new Float32Array(7)},w=new r.Vector3,b=new r.Vector3,f=new r.Vector3,L=new r.Vector3,N=new r.Vector3,F=Array.from({length:7},()=>new r.Vector3),S=c.radius||(M=>$e(te(M,0,De))),z=c.dip||Ve,y=c.rope||null,R=c.down||new r.Vector3(0,-1,0),H=(M,T)=>{const p=ne[M],m=a.grips[M],u=S(m.x),n=a.lift[M];return T.set((p.bx>0?7:-2)*n,z(m.x,a.grips)*(1-n)+u+.75+13*n,-(m.x-a.sBody)),y&&T.add(y.seat(m.x,L)),u};return a.solve=M=>{const T=q.s0+q.speed*M;a.sBody=T,a.sway=.02*Math.sin(oe*(M/9.3+e[0]))+.012*Math.sin(oe*(M/5.1+e[1])),a.bob=.9*Math.sin(oe*(M/6.4+e[2]));for(let n=0;n<7;n++){const x=ne[n],P=q.swing*o[n],i=q.T-P,d=(x.turn+.35*v[n])/7+a.phase0,g=M/q.T+d,V=Math.floor(g),I=(g-V)*q.T,D=q.s0+q.speed*(i/2-d*q.T)+x.off,G=D+q.stride*V,C=a.grips[n];if(I<i)a.swingE[n]=0,a.lift[n]=0,a.hand[n].x=1,C.set(G,ae(0,.8,I)*ae(i,i-.8,I),I,1.1+1.4*Math.exp(-I/1.6));else{const B=(I-i)/P,O=B*B*B*(B*(B*6-15)+10),X=Math.sin(Math.PI*B);a.swingE[n]=B,a.lift[n]=X*X,a.hand[n].x=1-ae(0,.14,B)*ae(1,.84,B),C.set(G+q.stride*O,0,0,1.1)}}if(y&&y.clip)for(let n=0;n<7;n++)a.grips[n].x=y.clip(a.grips[n].x);const p=Math.cos(a.sway),m=Math.sin(a.sway);for(let n=0;n<7;n++){const x=A[n];F[n].set(x.x*p-x.y*m,x.x*m+x.y*p+a.bob,x.z)}let u=!1;for(let n=0;n<7;n++){const x=a.grips[n],P=nt(ne[n]);if(a.shift[n]=0,H(n,f),!(f.distanceTo(F[n])>P))continue;const i=x.x,d=T-F[n].z;let g=0,V=1;for(let I=0;I<26;I++){const D=(g+V)/2;x.x=d+(i-d)*D,H(n,f),f.distanceTo(F[n])>P?V=D:g=D}x.x=d+(i-d)*g,a.shift[n]=Math.abs(i-x.x),u=!0}for(let n=0;n<7;n++){const x=ne[n],P=a.grips[n],i=F[n],d=H(n,f);if(a.hand[n].y=d,a.hand[n].z=0,a.hand[n].w=0,u){a.hand[n].x*=1-Mt*ae(0,Lt,a.shift[n]);const O=f.distanceTo(i),X=nt(x);O>X&&f.sub(i).multiplyScalar(X/O).add(i)}y&&(L.x!==0||L.y!==0||L.z!==0)&&(a.hand[n].w=y.share(P.x),a.hand[n].z=(y.seat(P.x+.75,L).dot(R)-y.seat(P.x-.75,N).dot(R))/1.5),w.subVectors(f,i);const g=w.length();w.multiplyScalar(1/g),b.set(x.bx,x.by,0).addScaledVector(w,-(x.bx*w.x+x.by*w.y)).normalize();const V=x.a*x.L,I=(1-2*x.a)*x.L,D=te((g-I)/(2*V),-.92,ot),G=Math.sqrt(1-D*D),C=a.J,B=n*4;C[B].copy(i),C[B+3].copy(f),C[B+1].copy(i).addScaledVector(w,D*V).addScaledVector(b,G*V),C[B+2].copy(f).addScaledVector(w,-D*V).addScaledVector(b,G*V),a.LN[n].crossVectors(w,b).normalize()}return a},a}const rt=`
attribute vec4 aHr, aHk; attribute vec3 aDir;
uniform vec3 uSway, uDown, uStrandEnd;
uniform float uFol, uStrandFol;  // (mend U, U1) the creature's own share of the land's fall; (mend V) the share the rope has taken where the new strand is made fast
varying vec3 vW; varying vec4 vR; varying vec2 vA; varying float vFol;
${ie}
${vt}
vec3 swayP(vec3 p){ float c = cos(uSway.x), s = sin(uSway.x); return vec3(p.x*c - p.y*s, p.x*s + p.y*c + uSway.y, p.z); }
vec3 hairPoint(float q){
  float L = aHr.z, ph = aHr.w;
  if (aHk.y > 1.5) {                       // the new strand: from the tail to the point of the cable it was fixed to
    vec3 a = swayP(position), b = uStrandEnd;
    return mix(a, b, q) + uDown*(0.17*length(b - a))*sin(3.14159*q) + vec3(1.0, 0.0, 0.0)*1.2*sin(uTime*0.7 + q*9.0)*sin(3.14159*q);
  }
  vec3 root = swayP(position);
  // the wind comes up the cable past the body in gusts about 60 m long: all the hair it reaches streams back
  // together, and each hair flutters a little in its own time
  float gust = 0.5 + 0.5*sin(uTime*0.9 + position.z*0.1 + position.x*0.04 + 1.7*sin(uTime*0.23 + position.z*0.021));
  vec3 back = vec3(0.25*sin(uTime*0.31 + position.z*0.05), 0.0, 1.0);
  // fringe: out from the hide, drooping, streaming back
  if (aHk.y > 0.5)
    return root + aDir*L*q*(1.0 - 0.45*q) + uDown*L*0.45*q*q + back*L*q*q*(0.2 + 0.5*gust) + aDir*0.06*L*q*sin(uTime*3.3 + ph*40.0 + q*4.0);
  // a beard: it hangs, streams back down the cable in the gusts, and sways from its root
  vec3 w = vec3(sin(uTime*0.6 + ph*30.0 + q*2.6), 0.0, 0.6*sin(uTime*0.47 + ph*17.0 + q*3.4))*L*0.05*q*q;
  return root + aDir*L*0.07*sin(3.14159*min(q*1.5, 1.0)) + uDown*L*q*(1.0 - 0.22*q) + back*L*q*q*(0.26 + 0.3*gust) + w;
}
void main(){
  float q = aHr.x;
  vec3 c = hairPoint(q), c2 = hairPoint(min(q + 0.03, 1.03));
  vec3 cw = (modelMatrix*vec4(c, 1.0)).xyz, tw = mat3(modelMatrix)*(c2 - c);
  float taper = aHk.y > 1.5 ? 1.0 : (1.0 - 0.8*q);
  float k; vec4 mv = cmRibbon(cw, tw/max(length(tw), 1e-4), aHr.y, aHk.x*taper, k);
  // (vA.y: how much of the sun's bearing lies across the ribbon, toward its +1 edge: for the shade on a strand)
  vec3 tvv = mat3(viewMatrix)*(tw/max(length(tw), 1e-4)), sdv = cross(tvv, (viewMatrix*vec4(cw, 1.0)).xyz);
  vW = cw; vR = vec4(aHr.y, q, aHr.w, aHk.y); vA = vec2(k, dot(sdv/max(length(sdv), 1e-5), mat3(viewMatrix)*uSunDir));
  // (mend V) the share of the land's fall this point takes: the creature's own; and along the new strand, whose
  // far end goes down with the rope it is made fast to, that end's share by the point's place along the strand
  vFol = uFol + (aHk.y > 1.5 ? uStrandFol*clamp(q, 0.0, 1.0) : 0.0);
  gl_Position = projectionMatrix*mv;
}`,it=`
#define CM_FOLLOW vFol
varying float vFol;              // (mend U, U1; mend V) the share of the land's fall this point takes: said in HAIR_VERT
uniform vec3 uFelt, uNetCol;
varying vec3 vW; varying vec4 vR; varying vec2 vA;
${ie}
void main(){
  float s = abs(vR.x), q = clamp(vR.y, 0.0, 1.0), kind = vR.w, fw = fwidth(vR.x) + 1e-4;
  vec3 v = normalize(cameraPosition - vW);
  float toward = clamp(dot(-v, uSunDir)*0.5 + 0.5, 0.0, 1.0);
  vec3 col; float al;
  if (kind > 1.5) {
    float e = 1.0 - smoothstep(max(1.0 - fw*1.5, 0.0), 1.0, s);
    float g = pow(clamp(0.5 + 0.5*sin(q*90.0 - uTime*2.2), 0.0, 1.0), 10.0);
    // the new strand is wet: dull where the sun is not on it, beaded every half metre, glints running down it.
    // (mend R, V1: IT IS A THREAD OF THE WEB AND GOES BY THE THREAD'S ONE LAW OF LIGHT (the common part). It
    // had a brightness of its own that no light gave it, up to four times its colour: by day a white-hot wire
    // from the climber's tail to the cable, in the dusk and the night the same. Now what it has without the
    // sun is the fill's, what it catches is the sun's at its own height, and it is never brighter than the
    // lit rope beside it. Its beads go to their mean under the pixel's footprint, three tenths of their light.)
    float bw = fwidth(q*150.0), bd = mix(1.0 - smoothstep(0.1, 0.2, abs(fract(q*150.0) - 0.5)), 0.3, smoothstep(0.3, 1.0, bw));
    float hT = vW.y + (CM_FOLLOW)*cmDrop(vW.xz), sunY = cmThreadSun(hT);
    col = cmThreadCap(uNetCol*(cmThreadDull(hT) + sunY*(0.3*toward*toward + 2.2*g*(0.3 + 0.7*toward) + 0.9*bd*(0.4 + 0.6*toward))), hT); al = e*clamp(vA.x, 0.0, 1.0);
  } else {
    // many hairs in one ribbon: streaks of thread with gaps, thinning to the tip; a nearer lock of strands lies
    // over a farther one that is dimmer and shows in the gaps (strands in front of strands)
    float strand = cmN(vec2(vR.x*8.0 + vR.z*60.0, q*1.5)), fine = cmN(vec2(vR.x*31.0 + vR.z*23.0, q*5.0));
    float body = smoothstep(0.36, 0.66, 0.55*strand + 0.45*fine + 0.2*(1.0 - s));
    float behind = smoothstep(0.34, 0.6, 0.6*cmN(vec2(vR.x*11.0 + vR.z*37.0 + 7.0, q*1.1 + 3.0)) + 0.4*fine + 0.15*(1.0 - s));
    float cover = body + (1.0 - body)*0.7*behind, front = body/max(cover, 1e-3);
    al = cover*(1.0 - smoothstep(0.6, 1.0, s))*(1.0 - 0.75*q*q)*clamp(vA.x, 0.0, 1.0)*(kind > 0.5 ? 0.8 : 0.92);
    // each lock is round: lit on its side toward the sun, in shade on the side away from it (vA.y)
    float slope = cmN(vec2((vR.x + 0.05)*8.0 + vR.z*60.0, q*1.5)) - cmN(vec2((vR.x - 0.05)*8.0 + vR.z*60.0, q*1.5));
    float lit = clamp(0.66 + (0.26*vR.x - 1.6*slope)*vA.y, 0.3, 1.0);
    // pale thread, a little under white (never the sun's own white): its own colour in the fill and the sun,
    // and the sun through it from behind, most at the thin tips (the eye still finds the climber by it from far)
    float thru = toward*toward*(0.26 + 0.2*q);
    col = uFelt*(0.55 + 0.45*fine)*mix(0.55, 1.0, front)*(cmAmb(vec3(0.0, 0.2, 0.0))*0.62*(0.6 + 0.4*lit) + cmSunL*(0.05 + 0.2*lit + thru));
    col *= 1.0/(1.0 + 0.6*max(dot(col, vec3(0.3, 0.5, 0.2)) - 0.6, 0.0));
  }
  col = cmAir(col, vW);
  gl_FragColor = vec4(col*al, al);
}`,Ft=`
attribute vec4 aP0, aP1; attribute vec3 aCol;
uniform vec3 uSway;
varying vec3 vW, vN; varying vec3 vK; varying vec3 vLoc;
${ie}
vec3 swayP(vec3 p){ float c = cos(uSway.x), s = sin(uSway.x); return vec3(p.x*c - p.y*s, p.x*s + p.y*c + uSway.y, p.z); }
vec3 flyAt(float t, out float settle){
  float ph = aP0.w, sp = 0.5 + 0.5*fract(ph*7.3), R = aP1.w;
  // now and then it comes in and sits on the hide
  settle = smoothstep(0.5, 0.8, sin(t*0.21*sp + ph*40.0));
  float a = t*sp*1.1 + ph*6.2831853;
  vec3 n = normalize(aP1.xyz), up = vec3(0.0, 1.0, 0.0), tz = vec3(0.0, 0.0, 1.0);
  vec3 ty = up - n*dot(up, n); ty /= max(length(ty), 1e-3);
  float out_ = mix(2.5 + 1.8*sin(a*2.3 + ph*9.0) + 0.5*R, 0.35, settle);
  vec3 p = aP0.xyz + n*out_ + (tz*cos(a)*1.4 + ty*sin(a*1.0 + 1.0*sin(a*0.5)))*R*(1.0 - 0.9*settle);
  return p;
}
void main(){
  float st, st2;
  vec3 c = flyAt(uTime, st), c2 = flyAt(uTime + 0.06, st2);
  vec3 fwd = c2 - c; float fl = length(fwd);
  fwd = fl > 1e-4 ? fwd/fl : vec3(0.0, 0.0, -1.0);
  fwd = mix(fwd, vec3(0.0, 0.0, -1.0), st*0.9); fwd /= max(length(fwd), 1e-3);
  vec3 n = normalize(aP1.xyz);
  vec3 rt = cross(fwd, n); rt /= max(length(rt), 1e-3);
  vec3 upv = cross(rt, fwd);
  vec3 p = position;
  // wings beat (a blur of amber), and fold when it sits
  if (aCol.x > 0.5) { float beat = sin(uTime*34.0 + aP0.w*90.0)*(1.0 - st)*0.9 + 0.5*st; float cb = cos(beat), sb = sin(beat)*aCol.y; p = vec3(p.x*cb, p.y + abs(p.x)*sb*aCol.y, p.z); }
  vec3 b = swayP(c + rt*p.x + upv*p.y + fwd*p.z);
  vec4 w = modelMatrix*vec4(b, 1.0);
  vW = w.xyz; vN = normalize(mat3(modelMatrix)*(rt*normal.x + upv*normal.y + fwd*normal.z)); vK = aCol; vLoc = position;
  gl_Position = projectionMatrix*viewMatrix*w;
}`,At=`
#define CM_FOLLOW 0.0            // (mend U, U1) the fliers are the hero's alone, and the hero keeps its height: none of the land's fall
varying vec3 vW, vN; varying vec3 vK; varying vec3 vLoc;
${ie}
void main(){
  vec3 v = normalize(cameraPosition - vW), n = normalize(vN);
  float toward = clamp(dot(-v, uSunDir)*0.5 + 0.5, 0.0, 1.0);
  vec3 col;
  // wings: amber, lit through
  if (vK.x > 0.5) {
    // a film with dark veins: every other point of it lets the world through
    float vein = step(0.8, fract(vLoc.x*2.6 + vLoc.z*0.7)) + step(0.86, fract(vLoc.z*3.1));
    if (vein < 0.5 && mod(floor(gl_FragCoord.x) + floor(gl_FragCoord.y), 2.0) < 0.5) discard;
    col = mix(vec3(0.62, 0.38, 0.1), vec3(0.08, 0.05, 0.02), min(vein, 1.0))*(cmAmb(n)*0.3 + cmSunL*(0.06 + 0.3*toward*toward));
  }
  else {
    // (the abdomen is behind the waist, at negative z of the shape: banded dark and amber)
    float stripe = step(0.6, fract(vLoc.z*2.6 + 0.2));
    vec3 alb = mix(vec3(0.03, 0.026, 0.022), vec3(0.6, 0.34, 0.06), stripe*step(vLoc.z, -0.06));
    col = alb*(cmSunL*clamp(dot(n, uSunDir)*0.7 + 0.3, 0.0, 1.0)*0.5 + cmAmb(n)*0.8);
  }
  col = cmAir(col, vW);
  gl_FragColor = vec4(col, 1.0);
}`;function Tt(){const s=new be({aCol:3}),h=6,c=1.1,t=[[0,-.76],[.1,-.68],[.15,-.56],[.19,-.3],[.07,-.08],[.26,.2],[.2,.56],[0,.78]].map(([o,e])=>[o*c,e*c]),v=s.count;s.set("aCol",0,0,0);for(let o=0;o<t.length;o++)for(let e=0;e<=h;e++){const A=e/h*oe;s.v(Math.cos(A)*t[o][0],Math.sin(A)*t[o][0],-t[o][1],Math.cos(A),Math.sin(A),0)}s.stitch(v,t.length,h,!0);for(const o of[-1,1])for(const[e,A,a]of[[-.5,1.9,.5],[-.05,1.4,.36]]){s.set("aCol",1,o,0);const w=s.v(o*.2,.2,e,0,1,0),b=s.v(o*A,.34,e+.42,0,1,0),f=s.v(o*A*.85,.34,e+.42+a,0,1,0),L=s.v(o*.2,.2,e+a*.7,0,1,0);s.quad(w,b,f,L)}return s}const lt=s=>s.reduce((h,c)=>Math.max(h,s.reduce((t,v)=>v===c?t:Math.min(t,c.c.distanceTo(v.c)),1/0)/c.wide),0),ct=()=>({uBark:{value:Q("#8A9478")},uBarkD:{value:Q("#3A4033")},uMoss:{value:Q("#4A6632")},uLichen:{value:Q("#A9AD7E")},uFelt:{value:Q("#B4C2B0")},uSac:{value:Q("#A9C58A")},uPodAmber:{value:Q("#BEDD9C")},uPodDark:{value:Q("#3A2A1C")},uSkin:{value:Q("#2F5A2A")},uNetCol:{value:Q("#D8ECD0",1.2)}});async function Dt(s,h={}){const c=!h.shared,t=h.shared||pt({sunAz:-124,sunEl:44,sunCol:"#ffb070",sunI:2.6}),v=t.U,o=s.noise,e=t.cable,A=h.clock||bt,a=h.forks||{},w=l=>Re(t,a[l],l,s,c),b=w("phase"),f=w("sacs"),L=w("pods"),N=w("limbs"),F=w("beards"),S=w("felt"),z=w("fliers");c&&(v.uHemiSky.value.set(.5,.45,.55),v.uHemiGnd.value.set(.18,.15,.2),v.uFogCol.value.set(.87,.35,.16),v.uFog.value.set(5e-4,5e-4,4e3,200));const y=w("gait"),R=h.phase??b(),H={sway:[b(),b(),b()],gap:ne.map(()=>y.range(-1,1)),swing:ne.map(()=>y.range(.8,1.25))},M=new r.Vector3,T=new r.Vector3(0,-Ae.y,Fe.y).normalize(),p={seat:(l,k)=>(e.offset(l,t.drop,M),k.set(M.dot(e.X),M.dot(e.n),-M.dot(e.d))),share:l=>{e.course(l,M);const k=t.drop(M.x,M.z);return k>1e-6?e.sunk(l,t.drop)/k:0}},m=He(o,0),u=We(m,R,{...H,rope:p,down:T,radius:l=>e.girth(te(l,-30,De)),dip:(l,k)=>Ve(Math.max(l,0),k)}),n=new r.Group;n.name="climber",n.matrixAutoUpdate=!1;const x=new r.Vector3,P=new r.Matrix3().set(e.X.x,e.n.x,-e.d.x,e.X.y,e.n.y,-e.d.y,e.X.z,e.n.z,-e.d.z),i=ct(),d={p:new r.Vector3,n:new r.Vector3,down:new r.Vector3},g=Ze();Ce(g,m,100,80,(l,k,E)=>{g.set("aB",0,0,k,E),g.set("aC",K.a*Math.max(m.prof(l),0),0,0),g.set("aAx",0,0,1)}),await s.yield();const V=[],I=.08;for(let l=0;l<2;l++)for(let k=0,E=0;k<9;k++){const W=(Math.floor(k/3)+.32)/4.3+(l?.012:-.01),_=Math.max(W,I+ze)+te(f.gauss()*.035,-ze,ze),J=f.range(-.55,.4),$=l?Math.PI-J:J;ce(m,_,$,d);const Y=f.range(4,7.5)*(.75+.5*f()),ee=Y*f.range(.5,.72),U=d.p.clone().addScaledVector(d.n,-ee);if(V.some(re=>re.c.distanceTo(U)<(re.r+Y)*.87+3)){++E<400?k--:E=0;continue}E=0;const j=1-.45*ae(.4,yt,_),he=f();V.push({c:U,r:Y,wide:2*K.a*Math.max(m.prof(_),0)}),Te(g,d.p.clone().addScaledVector(d.n,-ee*j),d.n.clone(),d.down,Y*j*.92,Y*j,1,he,14,9,1,ee*j)}await s.yield();const D=h.pods??23,G=Math.min(h.clear??9,D),C=[],B=new r.Vector3,O=new r.Vector3;for(let l=0,k=0;l<D&&k<4e3;k++){k%100===99&&await s.yield();const E=L.range(.27,.76),W=Math.PI-L.range(.36,.9);ce(m,E,W,d);const _=d.p.clone().addScaledVector(d.n,l<G?1.2:.85);C.some(J=>J.c.distanceTo(_)<(l<G&&J.clear?11:6.5))||(B.crossVectors(d.n,d.down).normalize(),O.copy(d.down).addScaledVector(B,L.range(-.8,.8)).normalize(),C.push({c:_,n:d.n.clone(),ax:O.clone(),clear:l<G,phase:L(),p:d.p.clone()}),l++)}L.shuffle(C),await s.yield();for(const l of C)B.crossVectors(l.n,l.ax).normalize(),Te(g,l.c,l.ax,B,l.clear?2.7:1.6,l.clear?.85:.62,l.clear?3:2,l.phase,16,12),Te(g,l.p.clone().addScaledVector(l.n,.1),l.n,l.ax,.4,l.clear?.95:.7,4,l.phase,12,5,l.clear?2.6:2.1);const X={value:0},de=fe(v,{uSway:{value:x},uRot:{value:P},uFol:X,...i}),pe=new r.Mesh(me(g.geometry(),0,-60,0,300),new r.ShaderMaterial({uniforms:de,vertexShader:Qe,fragmentShader:Xe,side:r.DoubleSide,fog:!1}));pe.name="climber-body",n.add(pe),await s.yield();const ye=st(o,N),xe=fe(v,{uJ:{value:u.J},uLN:{value:u.LN},uHand:{value:u.hand},uDown:{value:new r.Vector3(0,-Ae.y,Fe.y).normalize()},uFol:X,...i}),we=new r.Mesh(me(ye.geometry(),0,-20,0,320),new r.ShaderMaterial({uniforms:xe,vertexShader:tt,fragmentShader:at,side:r.DoubleSide,fog:!1}));we.name="climber-limbs",n.add(we),await s.yield();const se=new be({aHr:4,aHk:4,aDir:3}),ke=new r.Vector3(0,-Ae.y,Fe.y).normalize(),ge=(l,k,E,W,_,J,$)=>{const Y=se.count,ee=l();for(let U=0;U<=$;U++)for(const j of[-1,1])se.set("aHr",U/$,j,W,ee),se.set("aHk",_,J,0,0),se.set("aDir",E.x,E.y,E.z),se.v(k.x,k.y,k.z);for(let U=0;U<$;U++){const j=Y+U*2;se.i.push(j,j+1,j+2,j+1,j+3,j+2)}};for(let l=0;l<80;l++){const k=F.range(.05,.92),E=Math.PI*1.5+F.range(-1.3,1.3);ce(m,k,E,d),ge(F,d.p.clone().addScaledVector(d.n,-.3),d.n,F.range(30,50)*(.6+.4*m.prof(k)),F.range(2.2,4.6),0,14)}for(let l=0;l<1300;l++){const k=S.range(.02,.97),E=Math.PI*1.5+te(S.gauss()*.9,-1.25,1.25);ce(m,k,E,d),ge(S,d.p.clone().addScaledVector(d.n,-.2),d.n,S.range(3,9),S.range(1,2.2),1,3),l%100===99&&await s.yield()}const Be=m.point(.012,-Math.PI/2),dt=new r.Vector3(Be.x,Be.y-2,Be.z);ge(S,dt,ke,1,.16,2,40);const Ne=new r.Vector3,ue=h.strandS??46,Oe={value:0},ht=fe(v,{uSway:{value:x},uDown:{value:ke},uStrandEnd:{value:Ne},uFol:X,uStrandFol:Oe,...i}),Pe=new r.Mesh(me(se.geometry(),0,-70,60,420),new r.ShaderMaterial({uniforms:ht,vertexShader:rt,fragmentShader:it,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:r.DoubleSide,fog:!1}));Pe.name="climber-hair",Pe.renderOrder=1,n.add(Pe),await s.yield();const Se=Math.round(h.flies??90),_e=Tt(),le=new r.InstancedBufferGeometry;le.instanceCount=Se;{const l=_e.geometry();le.setAttribute("position",l.getAttribute("position")),le.setAttribute("normal",l.getAttribute("normal")),le.setAttribute("aCol",l.getAttribute("aCol")),le.setIndex(l.getIndex())}const je=new Float32Array(Se*4),Ge=new Float32Array(Se*4);for(let l=0;l<Se;l++){const k=z.range(.15,.86),E=z()<.8?Math.PI-z.range(-.45,.95):z.range(-.4,.9);ce(m,k,E,d),je.set([d.p.x,d.p.y,d.p.z,z()],l*4),Ge.set([d.n.x,d.n.y,d.n.z,z.range(2.5,8.5)],l*4)}le.setAttribute("aP0",new r.InstancedBufferAttribute(je,4)),le.setAttribute("aP1",new r.InstancedBufferAttribute(Ge,4)),me(le,0,-70,0,300);const Ue=new r.Mesh(le,new r.ShaderMaterial({uniforms:fe(v,{uSway:{value:x}}),vertexShader:Ft,fragmentShader:At,side:r.DoubleSide,fog:!1}));Ue.name="climber-fliers",n.add(Ue);const Me=new r.Group;if(Me.name="climber-root",Me.add(n),c){const l=gt(s,t,{quiet:!0,peaks:[{x:0,z:-400,h:95,r:180,p:1.6}],grips:u.grips,strandS:ue});Me.add(l.object)}const Pt=new r.Matrix4,ft=new r.Vector3,Je=new r.Vector2,Z=new r.Vector3,Ke=l=>{u.solve(A(l)),e.matrix(u.sBody,n.matrix),n.matrixWorldNeedsUpdate=!0,x.set(u.sway,u.bob,0),Ne.set(0,Ve(ue,u.grips)-e.radius(ue)*.8,u.sBody-ue),Ne.add(p.seat(ue,Z)),Oe.value=p.share(ue)};Ke(0);const mt=q.s0+45;return{object:Me,group:n,gait:u,gaitDeal:H,grips:u.grips,pods:C,sacs:V,budAt:xt,shape:m,strandS:ue,loneMost:lt(V),radius:150,height:120,center:e.at(mt,0,-62),ground:!1,anchors:{bodyCentre:(l,k=new r.Vector3)=>e.at(q.s0+q.speed*A(l),0,K.cy,k)},triangles:g.triangles+ye.triangles+se.triangles+Se*_e.triangles,worldOf(l,k,E,W,_=new r.Vector3){return e.at(q.s0+q.speed*A(l)-W,k,E,_)},flank(l,k){const E=e.coords(k,Z),W=q.s0+q.speed*A(l),_=E.y,J=E.z,$=W-E.x;let Y=1/0,ee=0;for(let U=0;U<=44;U++)for(let j=0;j<16;j++){const he=U/44,re=m.point(he,j/16*oe),ve=Math.hypot(re.x-_,re.y-J,re.z-$);ve<Y&&(Y=ve,ee=2*K.a*Math.max(m.prof(he),0))}return{gap:Y,thick:ee}},limbClearance(l,k){u.solve(A(l));let E=1/0;for(let W=0;W<7;W++)for(let _=0;_<3;_++){const J=u.J[W*4+_],$=u.J[W*4+_+1],Y=e.at(u.sBody-J.z,J.x,J.y,Z),ee=Y.x,U=Y.y,j=Y.z,he=e.at(u.sBody-$.z,$.x,$.y,Z),re=he.x-ee,ve=he.y-U,Le=he.z-j,ut=re*re+ve*ve+Le*Le,Ee=te(((k.x-ee)*re+(k.y-U)*ve+(k.z-j)*Le)/ut,0,1);E=Math.min(E,Math.hypot(k.x-ee-re*Ee,k.y-U-ve*Ee,k.z-j-Le*Ee)-4.5*ne[W].thick)}for(let W=0;W<7;W++){const _=u.grips[W].x,J=2.5*$e(te(_,0,De)),$=u.J[W*4+3];e.at(_,0,0,Z).add(e.offset(_,t.drop,ft)),E=Math.min(E,Math.hypot(k.x-Z.x,k.y-Z.y,k.z-Z.z)-J),e.at(u.sBody-$.z,$.x,$.y,Z),E=Math.min(E,Math.hypot(k.x-Z.x,k.y-Z.y,k.z-Z.z)-J)}return E},update(l,k,E,W){Ke(W===void 0?k*27%1300:W),E&&c&&(s.renderer.getDrawingBufferSize(Je),v.uPx.value=2*Math.tan((E.fov||60)*Math.PI/360)/Math.max(Je.y,1),v.uTime.value=k)},dispose(){}}}const Bt=`
attribute vec3 aE;                    // kind (0 body, 1 limb, 2 beard), q, phase
varying vec3 vW, vN, vNo, vE, vP;
${ie}
void main(){
  vec3 p = position; vP = position;
  if (aE.x > 1.5) p += vec3(sin(uTime*0.6 + aE.z*30.0), 0.0, 0.5*sin(uTime*0.45 + aE.z*11.0))*4.0*aE.y*aE.y;
  if (aE.x > 0.5 && aE.x < 1.5) p += vec3(0.0, 1.0, 0.0)*1.5*sin(uTime*0.35 + aE.z*20.0)*sin(3.14159*aE.y);
  vec4 w = modelMatrix*vec4(p, 1.0);
  vW = w.xyz; vN = normalize(mat3(modelMatrix)*normal); vNo = normal; vE = aE;
  gl_Position = projectionMatrix*viewMatrix*w;
}`,Nt=`
#define CM_FOLLOW uFol
uniform float uFol;
uniform vec3 uBark, uBarkD, uFelt, uMoss, uSac;
varying vec3 vW, vN, vNo, vE, vP;
${ie}
void main(){
  vec3 v = normalize(cameraPosition - vW), n = normalize(vN);
  float up = normalize(vNo).y, shade = 1.0;
  vec3 alb;
  if (vE.x < 0.5) {
    // the hero's own dress, told in the body's own metres: bark in plates along the back with moss in the creases,
    // felt below, and the pale bladders sunk in the flanks, each in its dark rim
    float pl = cmF3(vP*0.07), cr = smoothstep(0.4, 0.6, cmN3(vP*vec3(0.2, 0.2, 0.045) + 3.0));
    vec3 bark = mix(uBarkD, uBark, 0.3 + 0.7*cr)*(0.7 + 0.6*pl);
    vec3 felt = mix(uFelt, uMoss, 0.6*smoothstep(0.35, 0.7, cmN3(vP*0.045 + 9.0)))*(0.8 + 0.4*pl);
    alb = mix(felt, bark, smoothstep(-0.2, 0.5, up));
    alb = mix(alb, uMoss*(0.7 + 0.6*pl), 0.6*smoothstep(0.48, 0.7, cmN3(vP*0.03 + 17.0))*smoothstep(-0.5, 0.3, up));
    vec3 cp = vP*0.05, ci = floor(cp), cf = fract(cp) - 0.5;
    float d = length(cf + 0.3*(vec3(cmH3(ci + 3.1), cmH3(ci + 7.7), cmH3(ci + 1.3)) - 0.5));
    float on = step(0.45, cmH3(ci))*(1.0 - smoothstep(0.25, 0.75, abs(up + 0.1)));
    alb = mix(alb, uBarkD*0.8, on*(1.0 - smoothstep(0.3, 0.4, d)));
    alb = mix(alb, mix(uSac, uMoss, 0.45)*(0.75 + 0.35*pl), on*(1.0 - smoothstep(0.2, 0.31, d)));
    shade = 0.62 + 0.38*smoothstep(0.25, 0.6, pl + 0.25*cr);
  } else if (vE.x < 1.5) {
    // woody limbs: bark in rings and knots, moss on their upper side
    float kn = cmN3(vP*vec3(0.25, 0.25, 0.25) + 5.0);
    alb = mix(mix(uBarkD, uBark, 0.45 + 0.55*kn), uMoss, 0.35*smoothstep(0.2, 0.8, n.y)*smoothstep(0.4, 0.6, cmN3(vP*0.11)));
    // (G3 e: in the plain cut the limbs wear the body's own moss and felt, so from far they are of the body's
    // colour and the body and its beard are seen first, not a dark tangle)
    alb = mix(alb, mix(uMoss, uFelt, 0.45), 0.55);
    shade = 0.75 + 0.25*kn;
  } else {
    // the beard: pale fibre, thinning to its tip
    alb = mix(uFelt, vec3(0.62, 0.64, 0.5), 0.6)*(0.8 + 0.3*cmH(floor(vec2(vE.z*91.0, vE.y*9.0))));
  }
  float ndl = dot(n, uSunDir), diff = clamp((ndl + 0.3)/1.3, 0.0, 1.0);
  // lit by the sun on one side and from below by the bright roof of the forest, as the climber beside us is: a far
  // climber is never a black shape, and never glossy (no rim, no shine)
  vec3 bounce = cmBounceL*vec3(0.42, 0.47, 0.3)*dot(uSunCol, vec3(0.33))*0.6*clamp(0.6 - 0.4*n.y, 0.0, 1.0);
  vec3 col = alb*shade*(cmSunL*cmLitL(ndl)*0.6 + cmAmb(n)*0.85 + bounce);
  // (a far climber keeps the hero's own green and its beard at every distance: it takes the air as the hill it
  // climbs from does, the roof's things' law, and no other)
  col = cmHaze(col, vW, 1.0);
  gl_FragColor = vec4(col, 1.0);
}`;function Vt(s,h,c={}){const t=s.noise,v=Re(h,c.rng,"far"+(c.key??0),s),o=He(t,3.7+(c.key??0)*2.1),e=We(o,v());e.solve(v.range(0,32));const A=e.shift.some(p=>p>0),a=new be({aE:3});Ce(a,o,30,18,()=>a.set("aE",0,0,0));const f=new r.Vector3,L=new r.Vector3,N=new r.Vector3,F=new r.Vector3,S=new r.Vector3,z=(p,m,u,n,x,P)=>{const i=x*x,d=i*x;for(const g of["x","y","z"])P[g]=.5*(2*m[g]+(u[g]-p[g])*x+(2*p[g]-5*m[g]+4*u[g]-n[g])*i+(3*m[g]-p[g]-3*u[g]+n[g])*d);return P};for(let p=0;p<7;p++){const m=a.count,u=v(),n=6,x=p*4,P=e.J,i=5;let d=0;for(let g=0;g<=3*i;g++){const V=Math.min(2,Math.floor(g/i)),I=g/i-V,D=g/(3*i),G=P[x+Math.max(0,V-1)],C=P[x+V],B=P[x+V+1],O=P[x+Math.min(3,V+2)];z(G,C,B,O,I,f),z(G,C,B,O,I+.02,L),N.subVectors(L,f).normalize(),F.copy(e.LN[p]).addScaledVector(N,-e.LN[p].dot(N)).normalize(),S.crossVectors(N,F);const X=Math.exp(-Math.pow((D-1/3)*7,2))+Math.exp(-Math.pow((D-2/3)*7,2)),de=Ye(2.6,1.3,D)*ne[p].thick*(1+.35*X)*(.9+.2*t.n2(D*9+p*3.3,u*7));a.set("aE",1,D,u);for(let pe=0;pe<=n;pe++){const ye=pe/n*oe,xe=Math.cos(ye),we=Math.sin(ye),se=F.x*xe+S.x*we,ke=F.y*xe+S.y*we,ge=F.z*xe+S.z*we;a.v(f.x+se*de,f.y+ke*de,f.z+ge*de,se,ke,ge)}d++}a.stitch(m,d,n)}const y={p:new r.Vector3,n:new r.Vector3,down:new r.Vector3},R=new r.Vector3(0,-Ae.y,Fe.y).normalize();for(let p=0;p<26;p++){ce(o,v.range(.1,.9),Math.PI*1.5+v.range(-1.1,1.1),y);const m=v.range(30,58),u=v.range(2.4,5),n=v(),x=a.count;for(let P=0;P<=4;P++){const i=P/4;a.set("aE",2,i,n);for(const d of[-1,1])a.v(y.p.x+R.x*m*i+d*u*(1-.8*i)*.5,y.p.y+R.y*m*i,y.p.z+R.z*m*i+.34*m*i*i+d*u*.3*(1-i),y.n.x,y.n.y,y.n.z)}for(let P=0;P<4;P++){const i=x+P*2;a.i.push(i,i+1,i+2,i+1,i+3,i+2)}}const H=a.geometry();me(H,0,-50,0,320);const M={uBark:{value:Q("#4E5444")},uBarkD:{value:Q("#2A2D24")},uFelt:{value:Q("#8C9A80")},uMoss:{value:Q("#44602E")},uSac:{value:Q("#A9B48A")},uFol:{value:0}},T=new r.Mesh(H,new r.ShaderMaterial({uniforms:fe(h.U,M),vertexShader:Bt,fragmentShader:Nt,side:r.DoubleSide,fog:!1}));return T.name="far-climber",T.matrixAutoUpdate=!1,T.frustumCulled=!1,{object:T,triangles:a.triangles,reachLimited:A,update(p){M.uFol.value=c.frame(p,T.matrix)||0,T.matrixWorldNeedsUpdate=!0}}}async function Ht(s,h,c={}){const t=h.U,v=s.noise,o=Re(h,c.rng,"traverser",s),e=[o(),o(),o()],A=o.pick([[1,4],[3,2],[5,4],[1,2]]),a=new r.Vector3(0,-1,0),w={sway:e,gap:ne.map((i,d)=>A.includes(d)?0:o.range(-1,1)),swing:ne.map((i,d)=>A.includes(d)?1:o.range(.8,1.25)),radius:c.radius,dip:()=>0,down:a,rope:c.rope},b=He(v,6.3),f=We(b,o(),w),L=new r.Group;L.name="second",L.matrixAutoUpdate=!1;const N=new r.Vector3,F=ct(),S={p:new r.Vector3,n:new r.Vector3,down:new r.Vector3},z=Ze(),y=[];Ce(z,b,64,48,(i,d,g)=>{z.set("aB",0,0,d,g),z.set("aC",K.a*Math.max(b.prof(i),0),0,0),z.set("aAx",0,0,1)}),await s.yield();for(let i=0,d=0;i<2;i++)for(let g=0;g<6;g++){const V=(Math.floor(g/3)+1.32)/4.3+(i?.012:-.01),I=V+te(o.gauss()*.035,-ze,ze),D=o.range(-.55,.4),G=i?Math.PI-D:D;ce(b,I,G,S);const C=o.range(4,7.5)*(.75+.5*o()),B=C*o.range(.5,.72),O=S.p.clone().addScaledVector(S.n,-B),X=o();if(y.some(de=>de.c.distanceTo(O)<(de.r+C)*.87+3)){++d<400&&g--;continue}y.push({c:O,r:C,wide:2*K.a*Math.max(b.prof(I),0)}),Te(z,S.p.clone().addScaledVector(S.n,-B),S.n.clone(),S.down,C*.92,C,1,X,12,8,1,B)}const R={value:0},H=new r.Mesh(me(z.geometry(),0,-60,0,300),new r.ShaderMaterial({uniforms:fe(t,{uSway:{value:N},uRot:{value:new r.Matrix3},uFol:R,...F}),vertexShader:Qe,fragmentShader:Xe,side:r.DoubleSide,fog:!1}));H.name="second-body",L.add(H),await s.yield();const M=st(v,o,{skip:A,NR:44,NS:12,FR:8,FS:5}),T=new r.Mesh(me(M.geometry(),0,-20,0,320),new r.ShaderMaterial({uniforms:fe(t,{uJ:{value:f.J},uLN:{value:f.LN},uHand:{value:f.hand},uDown:{value:a},uFol:R,...F}),vertexShader:tt,fragmentShader:at,side:r.DoubleSide,fog:!1}));T.name="second-limbs",L.add(T),await s.yield();const p=new be({aHr:4,aHk:4,aDir:3}),m=(i,d,g,V,I,D)=>{const G=p.count,C=o();for(let B=0;B<=D;B++)for(const O of[-1,1])p.set("aHr",B/D,O,g,C),p.set("aHk",V,I,0,0),p.set("aDir",d.x,d.y,d.z),p.v(i.x,i.y,i.z);for(let B=0;B<D;B++){const O=G+B*2;p.i.push(O,O+1,O+2,O+1,O+3,O+2)}};for(let i=0;i<46;i++){const d=o.range(.05,.92),g=Math.PI*1.5+o.range(-1.3,1.3);ce(b,d,g,S),m(S.p.clone().addScaledVector(S.n,-.3),S.n,o.range(30,50)*(.6+.4*b.prof(d)),o.range(2.2,4.6),0,12)}await s.yield();for(let i=0;i<520;i++){const d=o.range(.02,.97),g=Math.PI*1.5+te(o.gauss()*.9,-1.25,1.25);ce(b,d,g,S),m(S.p.clone().addScaledVector(S.n,-.2),S.n,o.range(3,9),o.range(1,2.2),1,3),i%100===99&&await s.yield()}const u=new r.Mesh(me(p.geometry(),0,-70,60,420),new r.ShaderMaterial({uniforms:fe(t,{uSway:{value:N},uDown:{value:a},uStrandEnd:{value:new r.Vector3},uFol:R,uStrandFol:{value:0},...F}),vertexShader:rt,fragmentShader:it,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:r.DoubleSide,fog:!1}));u.name="second-hair",u.renderOrder=1,L.add(u);const n=c.tg0??0,x=c.go||(i=>i),P=i=>{R.value=c.frame(i,L.matrix,a)||0,f.solve(n+x(i)),L.matrixWorldNeedsUpdate=!0,N.set(f.sway,f.bob,0)};return P(0),{object:L,gait:f,skip:A,limbsGrown:7-A.length,bosses:y.length,loneMost:lt(y),triangles:z.triangles+M.triangles+p.triangles,update:P}}export{K as BODY,xt as BUD_AT,ze as CROWD,yt as FORE_AT,q as GAIT,ne as LIMBS,zt as LIMB_REACH,He as bodyShape,Dt as buildHero,Ht as buildSecond,bt as gaitClock,nt as limbReach,Vt as makeFarClimber,We as makeGait};
