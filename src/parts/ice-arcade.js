import*as r from"three";const rt=["#FBF6F1","#F6C3CC","#FFD79A","#5E86C4","#243F7A","#BCE3F4","#C8202A"],Ie=2.1,He=16,it=n=>new r.Color(n),Oe=(n,i,h)=>{const W=Math.min(1,Math.max(0,(h-n)/(i-n)));return W*W*(3-2*W)};function Ue(n,i,h,W){let $=0,R=0;const F=n/6;for(let V=0;V<6;V++){const p=(V+.5)*F,N=i*p*(.45+.55*p);$+=Math.sin(N),R+=Math.cos(N)}return W.x=$*F*h,W.y=R*F*h,W}function ct(n,i,h=0){const W=[16.2,15.2,17][i%3]*n.range(.98,1.02),$=n.range(.15,.185),R=t=>$*(Math.pow(Math.max(.02,1-.93*t),1.15)+.5*Math.exp(-t*20))+.012,F={pos:[],att:[],limb:[],hang:[],nrm:[],tone:[],idx:[]},V={pos:[],att:[],limb:[],twig:[],hang:[],card:[],kind:[],idx:[]},p=(t=0,s=0,l=0)=>new r.Vector3(t,s,l),N=p(0,1,0),oe=n.range(0,6.28),Me=n.range(0,6.28),Ge=n.range(0,6.28),We=n.range(.3,.55),Ee=n.range(-.5,.5),ye=n.range(-.5,.5),j=(t,s=p())=>{const l=Math.max(0,t-We);return s.set(.11*Math.sin(t*7.3+oe)*t+.045*Math.sin(t*19+Me)*t+Ee*l,0,.11*Math.cos(t*6.1+Ge)*t+.045*Math.cos(t*17+oe)*t+ye*l)},Z=h?6:8,_=h?9:14,le=p();for(let t=0;t<_;t++){const s=Math.pow(t/(_-1),.85),l=R(s)*(t===_-1?.5:1);j(s,le);for(let g=0;g<Z;g++){const A=g/Z*Math.PI*2+t*.22,S=1+.12*Math.sin(g*2.4+t*1.7)+(t===0?.25*Math.sin(g*1.9+i):0),b=Math.cos(A),k=Math.sin(A);F.pos.push(b*l*S+le.x,s*W,k*l*S+le.z),F.att.push(s),F.limb.push(b*l*S+le.x,0,k*l*S+le.z),F.hang.push(0,0,0),F.nrm.push(b,.1,k),F.tone.push(s>.93?.6:t===0?.35:0)}if(t)for(let g=0;g<Z;g++){const A=(t-1)*Z+g,S=(t-1)*Z+(g+1)%Z,b=t*Z+g,k=t*Z+(g+1)%Z;F.idx.push(A,b,S,S,b,k)}}const I=(t,s,l,g,A,S,b,k)=>({t,len:A,rb:b,az:S,at(x,q=p()){return q.copy(g).multiplyScalar(x*A).addScaledVector(N,.1*A*x*x).add(s)},dirAt(x,q=p()){return q.copy(g).addScaledVector(N,.2*x).normalize()},sag(x,q=p()){return q.set(Math.cos(S)*.12*A*x*x,-k*A*x*x,Math.sin(S)*.12*A*x*x).add(l)}}),B=(t,s,l,g)=>{const A=t.dirAt(0),S=F.pos.length/3,b=p().crossVectors(A,N).normalize(),k=p().crossVectors(b,A).normalize(),x=p(),q=p();for(let M=0;M<l;M++){const K=M/(l-1),G=t.rb*(1-.88*K)+.007;t.at(K,x),t.sag(K,q);for(let P=0;P<s;P++){const U=P*Math.PI*2/s+.6,ce=b.x*Math.cos(U)+k.x*Math.sin(U),te=b.y*Math.cos(U)+k.y*Math.sin(U),he=b.z*Math.cos(U)+k.z*Math.sin(U);F.pos.push(x.x+ce*G,t.t*W+x.y+te*G,x.z+he*G),F.att.push(t.t),F.limb.push(x.x+ce*G,x.y+te*G,x.z+he*G),F.hang.push(q.x,q.y,q.z),F.nrm.push(ce,te,he),F.tone.push(Math.min(1,g+(1-g)*Math.min(1,K*1.6)))}if(M)for(let P=0;P<s;P++){const U=S+(M-1)*s+P,ce=S+(M-1)*s+(P+1)%s,te=S+M*s+P,he=S+M*s+(P+1)%s;F.idx.push(U,te,ce,ce,te,he)}}},H=[],ve=[],be=h?4:5,se=n.range(0,6.28);for(let t=0;t<be;t++){const s=.38+.52*(t+n.range(.1,.9))/be,l=se+t*2.4+n.range(-.4,.4),g=n.range(.5,.9),A=(5.6-3*(s-.38)/.52)*n.range(.85,1.15),S=p(Math.cos(l)*Math.sin(g),Math.cos(g),Math.sin(l)*Math.sin(g)),b=I(s,j(s),p(),S,A,l,R(s)*.55,n.range(.34,.5));if(H.push(b),B(b,h?3:4,h?4:5,.25),!h)for(let k=0;k<2;k++){const x=.3+.3*k+n.range(0,.12),q=l+(k?1:-1)*n.range(.6,1.2),M=n.range(.45,1.05),K=p(Math.cos(q)*Math.sin(M),Math.cos(M),Math.sin(q)*Math.sin(M)),G=I(s,b.at(x),b.sag(x),K,A*n.range(.4,.55)*(1-.4*x),q,b.rb*(1-.8*x)*.75,n.range(.4,.6));ve.push(G),B(G,3,3,.7)}}const ne=(t,s,l,g,A,S)=>(V.pos.push(s.x+l.x,t*W+s.y+l.y,s.z+l.z),V.att.push(t),V.limb.push(s.x,s.y,s.z),V.twig.push(l.x,l.y,l.z),V.hang.push(g.x,g.y,g.z),V.card.push(A[0],A[1],A[2],A[3]),V.kind.push(S),V.pos.length/3-1),ze=p(),Y=p(),Se=p(),Ce=p(),me=p(),pe=p(),ge=p(),Te=p(),fe=p(),ee=h?1.5:1,Ae=(t,s,l,g,A,S)=>{const b=n.range(1.5,2.9)*A,k=(.4+.09*b)*ee,x=n.range(0,100);fe.set(n.gauss(),n.gauss()*.6+.35,n.gauss()).normalize(),Se.copy(g).multiplyScalar(.55).addScaledVector(fe,.9).normalize(),Ce.set(n.gauss(),n.gauss(),n.gauss()).cross(Se).normalize();const q=n.range(0,6.28);pe.set(Math.cos(q),0,Math.sin(q)),me.set(-pe.z,0,pe.x),n.chance(.5)&&me.copy(pe).multiplyScalar(-1);const M=n.range(.12,.4);let K=-1;for(let G=0;G<=S;G++){const P=G/S;ge.copy(Se).multiplyScalar(P*b).addScaledVector(N,-.1*b*P*P),Te.copy(pe).multiplyScalar(M*b*(1-(1-P)*(1-P))).addScaledVector(N,-b*P*(.5+.42*P)).add(l);const U=ne(t,s,fe.copy(ge).addScaledVector(Ce,-k),p().copy(Te).addScaledVector(me,-k),[-k,P*b,b,x],1);ne(t,s,fe.copy(ge).addScaledVector(Ce,k),p().copy(Te).addScaledVector(me,k),[k,P*b,b,x],1),K>=0&&V.idx.push(K,K+1,U,K+1,U+1,U),K=U}},y=h?10:14;for(const t of H)for(let s=0;s<y;s++){const l=.15+.85*Math.pow((s+n())/y,.8);Ae(t.t,t.at(l,ze),t.sag(l,Y),t.dirAt(l,fe.clone()),(1-.25*l)*(h?1.3:1),h?2:3)}for(const t of ve)for(let s=0;s<5;s++){const l=.2+.8*(s+n())/5;Ae(t.t,t.at(l,ze),t.sag(l,Y),t.dirAt(l,fe.clone()),.85-.2*l,2)}const xe=h?14:30;for(let t=0;t<xe;t++){const s=.27+.73*Math.pow((t+n())/xe,.75);Ae(s,j(s,ze),Y.set(0,0,0),N,(.8+.2*(1-s))*(h?1.3:1),h?2:3)}const Fe=(t,s,l,g,A,S,b)=>{const k=n.range(.2,.36),x=n.range(0,100),q=p(),M=ne(t,s,q,l,[0,0,k,x],2);ne(g,A,q,S,[b,0,k,x],2),ne(t,s,q,p(l.x,l.y-k,l.z),[0,1,k,x],2),ne(g,A,q,p(S.x,S.y-k,S.z),[b,1,k,x],2),V.idx.push(M,M+2,M+1,M+1,M+2,M+3)};if(!h)for(const t of H)for(let s=0;s<4;s++){const l=.08+s*.22+n.range(0,.04),g=l+.2;Fe(t.t,t.at(l),t.sag(l),t.t,t.at(g),t.sag(g),.2*t.len)}for(let t=0;t<(h?5:10);t++){const s=.2+(h?.15:.075)*t+n.range(0,.01),l=s+(h?.14:.07),g=R(s)*.7,A=R(l)*.7;Fe(s,j(s).add(p(g,0,0)),p(),l,j(l).add(p(A,0,0)),p(),(l-s)*W)}for(const t of h?[0]:[-.35,.95]){let s=-1;const l=p(),g=p(0,0,t),A=h?6:11;for(let S=0;S<=A;S++){const b=.08+.92*S/A,k=i*7.3+1.7+t*13.1,x=ne(b,g,l,l,[b*W,0,0,k],3);ne(b,g,l,l,[b*W,1,0,k],3),s>=0&&V.idx.push(s,s+1,x,s+1,x+1,x),s=x}}const re=t=>new r.Float32BufferAttribute(t,3),D=new r.BufferGeometry;D.setAttribute("position",re(F.pos)),D.setAttribute("aAtt",new r.Float32BufferAttribute(F.att,1)),D.setAttribute("aLimb",re(F.limb)),D.setAttribute("aHang",re(F.hang)),D.setAttribute("normal",re(F.nrm)),D.setAttribute("aTone",new r.Float32BufferAttribute(F.tone,1)),D.setIndex(F.idx);const ie=new r.BufferGeometry;return ie.setAttribute("position",re(V.pos)),ie.setAttribute("aAtt",new r.Float32BufferAttribute(V.att,1)),ie.setAttribute("aLimb",re(V.limb)),ie.setAttribute("aTwig",re(V.twig)),ie.setAttribute("aHang",re(V.hang)),ie.setAttribute("aCard",new r.Float32BufferAttribute(V.card,4)),ie.setAttribute("aKind",new r.Float32BufferAttribute(V.kind,1)),ie.setIndex(V.idx),{L:W,bark:D,glass:ie,limbs:H,cardW:ee,tris:(F.idx.length+V.idx.length)/3}}const ue=`
  uniform float uT, uTime, uFront, uRidge, uWind, uLitAll, uSkew, uPre, uA0;
  uniform vec3 uSun, uSunCol, uSkyCol, uDeep;
  float hash1(float n) { return fract(sin(n * 12.9898 + 1.37) * 43758.5453); }
  float hash2(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  // how much direct sun reaches height h above the snow at arcade distance arc: the ridge shadow's edge
  // rises ahead of the light front, so the vault's ridge is lit long before the floor is
  float litAt(float arc, float h) {
    float hs = min((arc - uFront) * 0.45, uRidge);
    return max(max(smoothstep(hs - 1.6, hs + 1.6, h), uLitAll), 1.0 - smoothstep(uPre - 22.0, uPre, arc));
  }
`,Be=`
  #include <fog_pars_vertex>
`,_e=`
  #include <fog_pars_fragment>
  float fogAmt() {
    #ifdef USE_FOG
      #ifdef FOG_EXP2
        return 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
      #else
        return smoothstep(fogNear, fogFar, vFogDepth);
      #endif
    #else
      return 0.0;
    #endif
  }
  vec3 fogCol() {
    #ifdef USE_FOG
      return fogColor;
    #else
      return vec3(0.0);
    #endif
  }
`,at=`
  attribute float aAtt;
  attribute vec3 aLimb, aHang;
  attribute vec4 aInst;                      // bow, time the light touches it, arcade distance, seed
  attribute vec4 aInst2;                     // distance from the foot to the sled's corridor along the bend, clearance height (tree units), seconds the whip waits (heralds),
                                             // w: seconds the burst takes to run from base to tip beyond the usual 0.35 (> 0: a tree that sheds slowly, in separate falls)
  uniform float uLen, uThetaMax;
  vec2 stemPoint(float t, float th) {
    vec2 p = vec2(0.0); float dt = t / 6.0;
    for (int i = 0; i < 6; i++) { float s = (float(i) + 0.5) * dt; float ph = th * s * (0.45 + 0.55 * s); p += vec2(sin(ph), cos(ph)); }
    return p * dt * uLen;
  }
  // the sheath bursts base to tip 0.8 s after the light arrives; the stem then springs to 3/4 upright and rocks at 0.6 Hz
  float treeTheta(float age) {
    float qs = max(age - 0.95 - aInst2.z, 0.0);
    float settle = exp(-qs * qs * 5.5);                                      // lets go slowly, then whips: mid-whip lasts 0.7 s
    float rock = 0.19 * sin(3.77 * qs) * exp(-qs * 0.5) * smoothstep(0.25, 0.8, qs);
    float sway = uWind * (0.022 * sin(uTime * 0.9 + aInst.w * 6.28) + 0.012 * sin(uTime * 1.73 + aInst.z * 0.13));
    return uThetaMax * aInst.x * (0.25 + 0.75 * settle - rock) + sway * (1.0 + 3.2 * (1.0 - settle));
  }
  float hangK(float qb) {                    // 1 = hanging under ice, 0 = sprung back (with a little overshoot)
    float q = max(qb, 0.0);
    return clamp(exp(-q * 3.6) * cos(q * 8.0), -0.22, 1.0);
  }
  vec3 turnZ(vec3 v, float c, float s) { return vec3(v.x * c + v.y * s, -v.x * s + v.y * c, v.z); }
`,ht=ue+at+Be+`
  attribute float aTone;
  varying vec3 vN, vW, vObj;
  varying float vTone, vIce, vArc, vH;
  void main() {
    float age = uT - aInst.y;
    float qb = age - 0.8 - (0.35 + aInst2.w) * aAtt;
    float th = treeTheta(age);
    float ph = th * aAtt * (0.45 + 0.55 * aAtt), c = cos(ph), s = sin(ph);
    vec3 P = vec3(stemPoint(aAtt, th), 0.0) + turnZ(aLimb, c, s) + aHang * hangK(qb);
    vec4 ip = instanceMatrix * vec4(P, 1.0);
    vec4 wp = modelMatrix * ip;
    vN = normalize(mat3(modelMatrix) * (mat3(instanceMatrix) * turnZ(normal, c, s)));
    vW = wp.xyz; vObj = position; vTone = aTone; vArc = aInst.z;
    vIce = 1.0 - smoothstep(0.0, 0.07, qb);
    vH = ip.y - instanceMatrix[3].y;
    vec4 mv = viewMatrix * wp;
    gl_Position = projectionMatrix * mv;
    #ifdef USE_FOG
      vFogDepth = -mv.z;
    #endif
  }
`,ft=ue+_e+`
  uniform vec3 uBark, uTwigCol;
  varying vec3 vN, vW, vObj;
  varying float vTone, vIce, vArc, vH;
  void main() {
    vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0));
    vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
    // paper-birch bark: chalk white, fine lenticel dashes, black chevrons at old branch scars, a darker rough foot
    float ang = atan(vObj.z, vObj.x + 1e-5) * 0.159155 + 0.5;
    float y = vObj.y;
    vec2 lc = vec2(ang * 9.0, y * 26.0); vec2 li = floor(lc), lf = fract(lc);
    float dash = step(0.62, hash2(li)) * (1.0 - smoothstep(0.36, 0.5, abs(lf.y - 0.5) * 2.2 + 0.2 * step(0.9, abs(lf.x - 0.5) * 2.0)));
    vec2 cc = vec2(ang * 3.0 + floor(y * 0.9) * 0.37, y * 0.9); vec2 ci = floor(cc), cf = fract(cc) - 0.5;
    float hv = hash2(ci + 7.3);
    float chev = step(0.42, hv) * (1.0 - smoothstep(0.03, 0.075, abs(cf.y - 0.1 + abs(cf.x) * 0.55))) * (1.0 - smoothstep(0.25, 0.42, abs(cf.x)));
    float eye = step(0.42, hv) * (1.0 - smoothstep(0.03, 0.1, length(cf * vec2(1.0, 2.2) - vec2(0.0, 0.3))));
    float foot = (1.0 - smoothstep(0.0, 1.6, y)) * (0.45 + 0.55 * hash2(floor(vec2(ang * 14.0, y * 5.0))));
    float ptch = 0.5 + 0.5 * sin(y * 1.7 + ang * 6.28 + sin(y * 0.6) * 2.0);
    vec3 alb = uBark * (0.86 + 0.14 * ptch);
    alb = mix(alb, uBark * vec3(1.0, 0.9, 0.84), 0.25 * (1.0 - ptch));           // peeled, pinker underbark
    // peeling curls: a strip of paper lifting, its lip bright, a thin shadow under it
    vec2 qc = vec2(ang * 5.0 + floor(y * 3.1) * 0.61, y * 3.1); vec2 qi = floor(qc), qf = fract(qc);
    float hq = hash2(qi + 2.7);
    float curlOn = step(0.5, hq) * smoothstep(0.06, 0.2, qf.x) * (1.0 - smoothstep(0.55 + 0.3 * hq, 0.95, qf.x)) * (1.0 - vTone);
    float cdy = (qf.y - 0.3 - 0.4 * hq) / 3.1 + 0.02 * sin(qf.x * 9.0 + hq * 20.0);
    alb = mix(alb, vec3(0.05, 0.045, 0.06), curlOn * (1.0 - smoothstep(0.0, 0.016, abs(cdy + 0.014))) * 0.75);
    alb += uBark * vec3(0.22, 0.16, 0.12) * curlOn * (1.0 - smoothstep(0.0, 0.012, abs(cdy - 0.004)));
    alb = mix(alb, vec3(0.035, 0.03, 0.04), max(max(chev, eye), max(dash * 0.55, foot * 0.6)) * (1.0 - vTone));
    alb = mix(alb, uTwigCol, vTone);
    float lit = litAt(vArc, vH);
    float ndl = dot(N, uSun);
    float wrap = clamp(ndl * 0.85 + 0.15, 0.0, 1.0);
    float ao = 0.55 + 0.45 * smoothstep(0.0, 4.0, vH);
    vec3 fill = mix(uDeep * 1.5, uSkyCol, (0.35 + 0.65 * (N.y * 0.5 + 0.5)) * ao);
    vec3 col = alb * (uSunCol * lit * wrap * mix(1.0, 0.62, vIce) + fill);
    float mark = max(max(chev, eye), max(dash * 0.55, foot * 0.6)) * (1.0 - vTone);
    // the glaze: a clear coat with one hard line of sun, a sky rim, and fire along the edge when back-lit
    vec3 Hh = normalize(uSun + V + vec3(0.0, 1e-4, 0.0));
    float ndh = max(dot(N, Hh), 0.0);
    float fres = 1.0 - max(dot(N, V), 0.0); fres = fres * fres * fres;
    float back = max(dot(-V, uSun), 0.0);
    float glaze = vIce;
    col *= mix(1.0, 0.8, glaze);                                                    // wet-dark under clear ice
    col += glaze * (uSunCol * lit * (pow(ndh, 220.0) * 6.0 + pow(ndh, 28.0) * 0.07 * (1.0 - mark) + min(fres * back * back * 2.5, 0.7)) + uSkyCol * fres * 1.3 * (1.0 - 0.6 * mark));
    col += (1.0 - glaze) * alb * uSunCol * lit * 0.12;                              // freed bark is chalk-bright
    gl_FragColor = vec4(mix(col, fogCol(), fogAmt()), 1.0);
  }
`,dt=ue+at+Be+`
  attribute vec3 aTwig;
  attribute vec4 aCard;
  attribute float aKind;
  varying vec3 vW;
  varying vec4 vCard;
  varying vec4 vS;                          // kind, ice (0..1), age, drop below the stem (sheet)
  varying vec3 vA;                          // arcade distance, height above the snow, column height (sheet)
  varying float vCz;                        // sheet: metres from the middle of the sled's corridor
  varying float vRag;                       // sheet: this tree sheds slowly, in separate falls (seconds from base to tip)
  void main() {
    vCz = 9.0; vRag = aInst2.w;
    float age = uT - aInst.y;
    float qb = age - 0.8 - (0.35 + aInst2.w) * aAtt;
    vec3 P; float drop = 0.0, colH = 0.0;
    if (aKind > 2.5) {                       // the sheet hangs from where the stem WAS when it let go
      vec2 C = stemPoint(aAtt, uThetaMax * aInst.x);
      colH = C.y; drop = aCard.y * C.y;
      P = vec3(C.x, C.y - drop, aLimb.z);
      vCz = C.x - aInst2.x;
    } else {
      float th = treeTheta(age);
      float ph = th * aAtt * (0.45 + 0.55 * aAtt), c = cos(ph), s = sin(ph);
      float hk = hangK(qb);
      float along = aCard.y * step(aKind, 1.5);
      vec3 sway = vec3(sin(uTime * 1.3 + aCard.w + along * 0.7), 0.0, cos(uTime * 1.07 + aCard.w * 1.7 + along * 0.5)) * (0.035 * uWind * along);
      P = vec3(stemPoint(aAtt, th), 0.0) + turnZ(aLimb, c, s) + mix(turnZ(aTwig, c, s), aHang, hk) + sway;
      // nothing of glass may hang into the sled's corridor (the eye passes 5.5 to 7.5 m from the foot, 1.7 m up)
      float cz = smoothstep(aInst2.x - 4.1, aInst2.x - 2.9, P.x) * (1.0 - smoothstep(aInst2.x + 3.3, aInst2.x + 4.5, P.x));
      P.y = max(P.y, mix(-60.0, aInst2.y, cz));
    }
    vec4 ip = instanceMatrix * vec4(P, 1.0);
    vec4 wp = modelMatrix * ip;
    vW = wp.xyz; vCard = aCard;
    float iceOn = 1.0 - smoothstep(0.0, 0.07, qb);
    vS = vec4(aKind, iceOn, age, drop);
    vA = vec3(aInst.z, ip.y - instanceMatrix[3].y, colH);
    vec4 mv = viewMatrix * wp;
    gl_Position = projectionMatrix * mv;
    #ifdef USE_FOG
      vFogDepth = -mv.z;
    #endif
  }
`,ut=ue+_e+`
  uniform vec3 uTwigCol, uIceTint;
  uniform float uGlaze, uGlint, uLen, uCardW, uCurt, uFull;
  varying vec3 vW;
  varying vec4 vCard;
  varying vec4 vS;
  varying vec3 vA;
  varying float vCz;
  varying float vRag;
  // one layer of falling ice. p = (metres along the stem, seconds after the burst that this ice let go), v = its speed
  // here, px = metres per pixel. Chips keep their size in metres whatever the speed; returns (cover, flash).
  vec2 chipLayer(vec2 p, float v, float px, float cw, float dr, float fill, float s0, float s1, float seed) {
    float row = floor(p.y / dr);
    p.x += hash1(row * 7.1 + seed) * cw;
    vec2 g = vec2(p.x / cw, p.y / dr), id = floor(g), f = fract(g) - 0.5;
    float h = hash2(id + seed), h2 = hash2(id * 1.7 + seed + 3.1);
    vec2 cell = vec2(cw, dr * v);
    vec2 m = f * cell - (vec2(hash1(h * 31.0), hash1(h * 57.0)) - 0.5) * cell * 0.5;
    float sz = mix(s0, s1, h2 * h2);
    float a0 = h * 40.0 + uT * (3.0 + 8.0 * h2) * (h > 0.5 ? 1.0 : -1.0);
    float d = dot(m, vec2(cos(a0), sin(a0))) - sz * 0.42;
    d = max(d, dot(m, vec2(cos(a0 + 2.3), sin(a0 + 2.3))) - sz * 0.5);
    d = max(d, dot(m, vec2(cos(a0 + 4.1), sin(a0 + 4.1))) - sz * 0.34);
    float aa = max(px, 0.004);
    float cov = (1.0 - smoothstep(-aa, aa, d)) * step(h, fill);
    float avg = fill * clamp(sz * sz * 0.8 / max(cell.x * cell.y, 1e-4), 0.0, 1.0);
    float farK = smoothstep(0.45, 1.4, px / sz);
    cov = mix(cov, avg, farK);                                                 // sub-pixel: the same light, spread
    float tw = hash2(id * 1.37 + floor(uT * 12.0 + h * 8.0));
    // far off the glitter is drawn in square cells of its own (a tall falling cell would flash as a vertical dash)
    float sub = floor((f.y + 0.5) * max(1.0, floor(cell.y / cell.x + 0.5)));
    float tw2 = hash2(id * 1.37 + sub * 3.7 + floor(uT * 12.0 + h * 8.0 + sub * 1.3));
    tw = mix(tw, tw2, farK);
    tw *= tw; tw *= tw; tw *= tw;
    return vec2(cov, cov * tw * mix(1.0, 2.4, farK));
  }
  void main() {
    vec3 Vv = cameraPosition - vW;
    float dist = length(Vv);
    vec3 V = Vv / max(dist, 1e-3);
    float lit = litAt(vA.x, vA.y);
    float back = max(dot(-V, uSun), 0.0);
    float fa = fogAmt();
    vec3 rgb = vec3(0.0); float alpha = 0.0;
    vec2 c = vCard.xy;
    vec2 dx = dFdx(c), dy = dFdy(c);
    vec3 Px = dFdx(vW), Py = dFdy(vW);
    if (vS.x < 1.5) {
      // ---------------- twig spray: a dark twig with side shoots inside a clear sheath; bare and red-brown once freed
      float len = vCard.z, seed = vCard.w, iceOn = vS.y, bare = 1.0 - iceOn, ice = mix(0.5, 1.0, iceOn);
      float mpp = max(length(vec2(dx.x, dy.x)), length(vec2(dx.y, dy.y))) + 1e-5;
      float det = dx.x * dy.y - dx.y * dy.x; det = abs(det) < 1e-9 ? 1e-9 : det;
      vec3 T = (Py * dx.x - Px * dy.x) / det; T = T / max(length(T), 1e-5);
      vec3 S = (Px * dy.y - Py * dx.y) / det; S = S / max(length(S), 1e-5);
      float covC = 0.0, covS = 0.0, sAcr = 1.0, slope = 0.0;
      float kq = c.y / max(len, 0.1);
      float ax = 0.05 * sin(c.y * 2.1 + seed) * kq;
      float thick = 1.0 + 0.8 * bare;
      {
        float rc = mix(0.009, 0.004, kq) * thick, rs = rc + uGlaze * ice;
        float d = abs(c.x - ax);
        float hwC = max(rc, 0.62 * mpp), hwS = max(rs, 0.75 * mpp);
        covC = clamp((hwC - d) / mpp + 0.5, 0.0, 1.0) * max(rc / hwC, mix(0.3, 0.6, bare));
        covS = clamp((hwS - d) / mpp + 0.5, 0.0, 1.0) * (rs / hwS);
        sAcr = (c.x - ax) / hwS;
      }
      for (int i = 0; i < 9; i++) {
        float fi = float(i);
        float h1 = hash1(seed + fi * 3.1), h2 = hash1(seed * 1.7 + fi * 5.3);
        float yk = len * (0.05 + 0.095 * fi + 0.05 * h1);
        float sg = hash1(seed * 2.3 + fi * 7.7) > 0.5 ? 1.0 : -1.0;
        float m = sg * (0.16 + 0.42 * h2) * uCardW;
        float lk = (0.25 + 1.0 * h2 * h2 + 0.3 * h1) * min(1.0, len * 0.5);
        float yy = c.y - yk;
        float inside = step(0.0, yy) * step(yy, lk);
        float xl = 0.05 * sin(yk * 2.1 + seed) * yk / max(len, 0.1) + m * yy * (1.0 - 0.45 * yy / max(lk, 0.05));
        float d = abs(c.x - xl) / sqrt(1.0 + m * m * 0.5) + (1.0 - inside) * 10.0;
        float rc = mix(0.005, 0.0025, yy / max(lk, 0.05)) * thick, rs = rc + uGlaze * 0.8 * ice;
        float hwC = max(rc, 0.62 * mpp), hwS = max(rs, 0.75 * mpp);
        covC = max(covC, clamp((hwC - d) / mpp + 0.5, 0.0, 1.0) * max(rc / hwC, mix(0.2, 0.45, bare)));
        float cs = clamp((hwS - d) / mpp + 0.5, 0.0, 1.0) * (rs / hwS);
        if (cs > covS) { covS = cs; sAcr = (c.x - xl) / hwS; slope = m * 0.6; }
      }
      covS *= ice;
      // the finest twigs, too thin to draw one by one: a streaked haze that fills the crown from a distance
      float hwc = (0.4 + 0.09 * len) * uCardW;
      float fan = (1.0 - smoothstep(0.3, 1.0, abs(c.x) / (hwc * (0.3 + 0.7 * kq)))) * smoothstep(0.03, 0.22, kq) * (1.0 - smoothstep(0.72, 1.0, kq));
      float fine = 0.5 + 0.5 * sin(c.x / (0.05 + 0.12 * c.y) * 9.0 + seed * 5.0);
      fine = mix(0.25 + 0.75 * fine, 0.62, smoothstep(0.03, 0.09, mpp));
      float wash = fan * fine * smoothstep(0.01, 0.04, mpp) * mix(0.1, 0.27, bare);
      if (covC + covS + wash < 0.004) discard;
      vec3 Tl = T + S * slope; Tl = Tl / max(length(Tl), 1e-4);
      vec3 Hh = normalize(uSun + V + vec3(0.0, 1e-4, 0.0));
      float th = dot(Tl, Hh);
      float kk = pow(sqrt(max(1.0 - th * th, 0.0)), 46.0);                  // highlight ring of a thin cylinder
      float resolved = clamp(uGlaze / mpp - 0.6, 0.0, 1.0);
      float s0 = 0.45 * (dot(S, uSun) > 0.0 ? 1.0 : -1.0);
      float sa = clamp(sAcr, -1.0, 1.0);
      float prof = mix(0.3, 2.2 * exp(-(sa - s0) * (sa - s0) * 22.0), resolved);
      float rim = smoothstep(0.45, 1.0, abs(sa)) * resolved;
      float wav = 0.5 + 0.5 * sin(c.y * 31.0 + 2.6 * sin(c.y * 8.3 + seed * 1.7 + slope * 9.0) + seed * 3.0 + slope * 40.0 + dot(V, Tl) * 55.0 + uTime * 0.7);
      wav *= wav; wav *= wav; wav *= wav;
      float spk = mix(wav * 4.2, 0.62, smoothstep(0.03, 0.09, mpp));                 // beads of fire that crawl as the eye moves; averaged far off
      vec3 amb = mix(uDeep * 1.4, uSkyCol, 0.75);
      vec3 coreCol = uTwigCol * (amb + uSunCol * lit * mix(0.4, 0.75, bare));
      vec3 body = uIceTint * (uSkyCol * (0.45 + 0.8 * rim) + uSunCol * lit * (0.06 + 0.4 * rim * back));
      float aB = 0.1 + 0.42 * rim + 0.08 * (1.0 - resolved);
      float gK = uGlint * mix(1.2, 1.0, iceOn) * mix(0.34, 1.0, smoothstep(4.0, 17.0, dist));   // a crown passed at arm's length glitters, it does not white out the frame                                      // half the sheath is left: the freed crown still glitters
      vec3 glint = uSunCol * lit * gK * (kk * prof * (0.3 + 1.1 * spk) + back * back * back * (0.3 + 0.6 * rim + 0.6 * spk) * mix(0.4, 1.0, smoothstep(8.0, 30.0, dist)))
                 + uSkyCol * kk * prof * 0.35;
      rgb = coreCol * covC + (body * aB + glint) * covS * (1.0 - 0.85 * covC);
      alpha = covC + covS * aB * (1.0 - covC);
      vec3 washCol = mix(uIceTint * (uSkyCol * 0.55 + uSunCol * lit * (0.12 + 0.3 * back)), uTwigCol * (amb + uSunCol * lit * 0.6), 0.35 + 0.65 * bare);
      rgb += washCol * wash * (1.0 - alpha);
      alpha += wash * (1.0 - alpha);
      vec2 gcell = floor(c * 24.0);                                                  // beads of glaze still clinging: points of fire in the crown
      float gsp = step(0.972, hash2(gcell + seed + floor(dot(V, vec3(19.0, 7.0, 13.0)) * 5.0 + hash2(gcell) * 6.0)));
      rgb += uSunCol * lit * uGlint * gsp * fan * (0.5 + 1.6 * back * back) * (0.35 + 0.65 * bare) * (1.0 - smoothstep(0.05, 0.11, mpp));
      rgb = mix(rgb, fogCol() * alpha, fa);
    } else if (vS.x < 2.5) {
      // ---------------- icicle comb: a row of tapered clear teeth
      float n = c.x * 21.0;
      float fw = (abs(dx.x) + abs(dy.x)) * 21.0 + 1e-4;
      float id = floor(n), f = fract(n) - 0.5;
      float tl = 0.22 + 0.78 * hash1(id * 1.3 + vCard.w);
      float w = 0.36 * clamp(1.0 - c.y / tl, 0.0, 1.0);
      float cov = clamp((w - abs(f)) / fw + 0.5, 0.0, 1.0) * step(c.y, tl) * min(1.0, 0.7 / fw + 0.3);
      cov = max(cov, (1.0 - smoothstep(0.0, 0.1, c.y)) * 0.8) * vS.y;                 // the glazed underside they hang from
      if (cov < 0.004) discard;
      float edge = smoothstep(0.3, 1.0, abs(f) / max(w, 0.02));
      float core = exp(-f * f / max(w * w * 0.12, 1e-4));
      vec3 body = uIceTint * (uSkyCol * (0.6 + 0.7 * edge) + uSunCol * lit * 0.2);
      vec3 gl = uSunCol * lit * uGlint * (core * (0.5 + 1.6 * back * back) + edge * back * 0.8);
      float aB = 0.3 + 0.4 * edge;
      rgb = (body * aB + gl) * cov; alpha = cov * aB;
      rgb = mix(rgb, fogCol() * alpha, fa);
    } else {
      // ---------------- curtain: at every point of the sheet, the ice that let go (r) seconds after the burst is passing.
      // Plates and chips that keep their size as they speed up, a veil of ice dust behind them, powder where they land.
      float sT = c.x / max(uLen, 1.0);
      float q = vS.z - 0.8 - (0.35 + vRag) * sT;                                // seconds since this part of the stem burst
      float drop = max(vS.w, 0.0);
      float tau = sqrt(drop * 0.2174);                                         // fall time from the stem to here, g = 9.2
      float colJ = hash1(floor(c.x * 2.6) * 1.7 + vCard.w);                     // every foot of stem lets go at its own moment
      float own = smoothstep(1.0, 10.0, vA.x - uFront);
      float slow = step(0.01, vRag);
      // full: a curtain that is there to be looked at: a herald's, a slow tree's, and every tree's while the eye stands
      // outside the arcade and sees the wave from the side (uFull). Inside the vault the sheets stay thin.
      float seen = max(slow, uFull) * (1.0 - own);
      float full = max(own, seen);
      float hk = full * (1.1 - 0.6 * slow) * hash1(floor(c.x * 0.9 + 0.37 * vCard.w) * 5.3 + vCard.w * 1.3);   // hanks a metre wide, each let go at its own moment: a jagged top, never a slab
      float r = q - tau - 0.3 * colJ - hk;
      if (r < 0.0 || r > 3.4) discard;
      float v = 9.2 * tau + 0.7;
      // a herald lets go ahead of the light front, in the blue of the nave: its ice keeps coming for two seconds and
      // falls as one pale hanging curtain, lit by the sky and by the ice dust itself, rose only above the shadow line
      float rate = smoothstep(0.0, 0.05, r) * (1.0 - smoothstep(mix(mix(0.32, 0.7, full), 1.2, slow), mix(mix(1.0, 1.55, full), 2.8, slow), r)) + 0.045 * (1.0 - smoothstep(1.0, 3.4, r));
      // such a sheet is ragged: it falls in separate hanks with the wood showing between them, never as one slab
      float hank = 0.5 + 0.5 * sin(c.x * 1.7 + vCard.w * 3.0) * sin(c.x * 0.73 + vCard.w * 7.0 + 1.0) + 0.3 * (hash1(floor(c.x * 1.1) * 3.7 + vCard.w) - 0.5);
      float rag = mix(1.0, smoothstep(0.4 + 0.1 * seen, 0.66 + 0.06 * seen, hank + 0.12 * sin(drop * 1.9 + c.x * 2.3)), full);
      float px = max(length(Px), length(Py)) + 1e-4;
      vec3 nS = cross(Px, Py);
      float facing = abs(dot(nS / max(length(nS), 1e-9), V));                   // a sheet seen edge-on would be a rack of vertical dashes: it fades out instead
      vec2 pc = vec2(c.x, r);
      // seen whole from outside the ribs the fall is plates of ice a hand and more across, leading; the dust only trails them
      vec2 c1 = chipLayer(pc, v, px, mix(0.26, 0.46, seen), mix(0.034, 0.06, seen), 0.62, mix(0.07, 0.15, seen), mix(0.17, 0.38, seen), vCard.w);
      vec2 c2 = chipLayer(pc + vec2(0.13, 0.011), v, px, 0.11, 0.019, 0.74, 0.03, mix(0.075, 0.1, seen), vCard.w + 5.7);
      float lead = 1.0 - smoothstep(0.25, 1.1, r);                              // the big plates come first
      float cA = clamp(c1.x * mix(1.0, 0.45 + 0.75 * lead, seen) + c2.x * (1.0 - c1.x), 0.0, 1.0) * rate * mix(0.6, mix(0.85, 1.0, seen), full) * (0.35 + 0.65 * rag);
      float fl = (c1.y + c2.y * 0.8) * rate * smoothstep(0.3, 0.7, facing) * (1.0 - 0.6 * seen);
      float vn = 0.5 + 0.5 * sin(c.x * 3.1 + r * 9.0 + vCard.w) * sin(c.x * 7.7 - r * 4.0 + 1.3);
      float veil = rate * (0.04 + 0.05 * vn) * (1.0 - 0.45 * smoothstep(0.0, 9.0, drop)) * (1.0 - 0.5 * seen);
      float strand = 0.5 + 0.5 * sin(c.x * 17.0 + 2.6 * sin(c.x * 4.3 + vCard.w) + r * 2.5);          // the curtain hangs in strands
      float gr = hash2(floor(vec2(c.x * 5.0, drop * 5.0 - uT * 23.0)) + vCard.w);                     // falling grains, a hand across
      veil += full * rate * rag * (0.12 + 0.5 * strand * (0.45 + 0.55 * vn)) * (0.4 + 1.2 * gr * gr) * mix(1.0, 0.05 + 0.1 * smoothstep(0.5, 1.6, r), seen);          // fine ice fills each hank between the stem and the chips (from outside: a thin trail behind the plates)
      float foot = mix(1.0, smoothstep(0.0, 0.75 + 0.5 * vn, vA.y), full);      // its foot dissolves: no straight line on the snow, the burst carries the landing
      // a slow tree's ice comes down in three or four separate falls a stride wide, bare stem between them
      float falls = mix(1.0, smoothstep(0.42, 0.62, 0.5 + 0.5 * sin(c.x * 2.6 + 0.6) + 0.1 * sin(drop * 1.3 + c.x * 5.0)), slow);
      cA *= foot * falls; veil *= foot * falls; fl *= falls * (1.0 - 0.5 * slow);
      float pg = q - sqrt(max(vA.z, 0.0) * 0.2174) - 0.3 * colJ - hk;                 // seconds since the first ice reached the snow below
      float burst = exp(-max(vA.y, 0.0) * 1.3) * smoothstep(0.0, 0.15, pg) * exp(-max(pg, 0.0) * 0.9) * (0.55 + 0.45 * vn);
      float aV = clamp(veil + 0.4 * burst * (1.0 - 0.35 * full) * (1.0 - 0.5 * seen), 0.0, mix(0.5 + 0.12 * full, 0.13, seen));   // from outside: no gauze, the plates carry the fall
      // a full curtain thins as the flight comes up to it: its sparkle never fills a side of the frame (a herald from 19 m,
      // the wave seen from outside from 14 m, the slow tree the flight passes under from 8 m)
      float nfLo = mix(mix(2.0, mix(4.0, 5.0, own), full), 2.5, slow), nfHi = mix(mix(7.5, mix(14.0, 19.0, own), full), 8.0, slow);
      float nearFade = smoothstep(nfLo, nfHi, dist);
      float ends = smoothstep(mix(mix(0.08, 0.05, full), 0.03, slow), mix(mix(0.2, 0.45, full), 0.16, slow), sT) * (1.0 - smoothstep(mix(mix(0.93, 0.68, full), 0.82, slow), 1.0, sT));
      // thin over the track itself (the way ahead stays open; a slow tree drops nothing at all on the flight line under it), thin far off (sheets pile up down the avenue), thin on the flank trees
      float k = mix(mix(uCurt, 1.0, smoothstep(16.0, 40.0, dist)), 1.0, full) * nearFade * ends * (1.0 - fa) * mix(mix(mix(0.3, 0.8, full), 0.0, slow), 1.0, smoothstep(1.3 + 0.1 * slow, 3.8 - 0.6 * slow, abs(vCz))) / (1.0 + dist * 0.022 * (1.0 - 0.6 * full)) * (uCardW > 1.2 ? 0.4 : 1.0)
              * smoothstep(0.12, 0.45, facing) * (1.0 - 0.65 * seen * smoothstep(38.0, 80.0, dist));
      vec3 Ls = uSunCol * lit * mix(vec3(1.0), vec3(1.06, 0.76, 0.58), seen);          // seen whole, the falling plates are the warmest thing in the frame
      // seen from the sun's side the falling ice takes the sun's colour and stands brighter than the snow behind it
      vec3 bodyC = uIceTint * (uSkyCol * mix(0.85, 0.2, seen) + Ls * (mix(0.12, 0.5, seen) + 0.3 * back * (1.0 - 0.5 * seen)));
      vec3 dustC = uSkyCol * mix(0.75, 0.16, seen) + Ls * (mix(0.3, 0.5, seen) + 0.4 * back * (1.0 - 0.6 * seen));
      vec3 flashC = Ls * (3.2 + 7.0 * back * (1.0 - 0.7 * seen)) + uSkyCol * 1.4 * (1.0 - 0.6 * seen);
      vec3 pale = uIceTint * (uSkyCol * 0.5 + 0.62) * own * (1.0 - 0.5 * lit) * (1.0 - 0.4 * uLitAll);
      bodyC += pale; dustC += pale; flashC += pale * 6.0;
      alpha = (cA + aV * (1.0 - cA)) * k;
      rgb = (bodyC * cA + dustC * aV * (1.0 - cA) + flashC * fl * uGlint) * k;
    }
    gl_FragColor = vec4(rgb, alpha);
  }
`,vt=ue+Be+`
  attribute vec4 aP0;                        // start point (local), w = snow height where it lands
  attribute vec4 aV;                         // drift x, drift z, release time, seed
  attribute vec4 aM;                         // arcade distance, size (m), restitution (< 0: diamond dust), spin
  uniform float uPx;                         // metres per pixel at 1 m
  varying vec2 vUv;
  varying vec4 vP;                           // spin angle, seed, lit, energy
  varying vec3 vNv;                          // facet normal (world)
  varying vec3 vW;
  varying float vOwn;                        // ice in flight ahead of the light front (a herald's): pale of its own
  void main() {
    float seed = aV.w;
    float q = clamp(uT - aV.z, -1.0, 60.0);
    vec3 p = aP0.xyz; float show = step(0.0, q), ang, hAbove;
    if (aM.z < 0.0) {                        // diamond dust: sifts down for ever, thicker once the ice has let go
      float fall = uTime * (0.25 + 0.3 * seed);
      float span = 10.5;
      hAbove = mod(aP0.y - aP0.w - fall, span);
      p.y = aP0.w + hAbove + 0.2;
      p.x += sin(uTime * 0.6 + seed * 40.0) * 0.35; p.z += cos(uTime * 0.47 + seed * 23.0) * 0.35;
      show = (0.3 + 0.7 * smoothstep(0.0, 2.5, uT - aV.z) * (1.0 - 0.6 * smoothstep(8.0, 20.0, uT - aV.z))) * smoothstep(0.0, 0.8, hAbove) * (1.0 - smoothstep(span - 1.5, span, hAbove));
      ang = uTime * (1.5 + aM.w) + seed * 50.0;
    } else {
      float g = 9.2, h = max(aP0.y - aP0.w, 0.02), tI = sqrt(2.0 * h / g);
      float qa = min(q, tI);
      p.xz += aV.xy * qa; p.y -= 0.5 * g * qa * qa;
      float q2 = max(q - tI, 0.0);
      float vy = min(aM.z * g * tI, 3.2), tb = 2.0 * vy / g, qb = min(q2, tb);
      vec2 skid = aV.xy * 1.3 + (vec2(hash1(seed * 91.0), hash1(seed * 57.0)) - 0.5) * 2.6;
      p.xz += skid * (1.0 - exp(-2.4 * q2)) / 2.4;
      p.y = max(p.y, aP0.w) + vy * qb - 0.5 * g * qb * qb + 0.02 * step(tI, q);
      hAbove = p.y - aP0.w;
      ang = seed * 40.0 + aM.w * min(q, tI + tb);
    }
    float b = seed * 17.0;
    vec3 n = vec3(sin(ang) * cos(b), cos(ang), sin(ang) * sin(b));
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vec4 mv = viewMatrix * wp;
    float d = max(-mv.z, 0.3);
    float size = aM.y, minSize = 1.7 * uPx * d;
    float k = max(size, minSize);
    float energy = clamp(size / k, 0.0, 1.0); energy *= energy;
    mv.xy += position.xy * k * show;
    gl_Position = projectionMatrix * mv;
    vUv = position.xy; vW = wp.xyz; vNv = mat3(modelMatrix) * n;
    vP = vec4(ang * 0.37 + seed * 9.0, seed, litAt(aM.x, hAbove), max(energy, 0.03) * show * (aM.z < 0.0 ? 1.0 : smoothstep(1.2, 4.5, d)));
    vOwn = smoothstep(1.0, 10.0, aM.x - uFront) * step(0.0, aM.z) * (1.0 - smoothstep(2.0, 4.0, q)) * step(0.0, q);
    #ifdef USE_FOG
      vFogDepth = -mv.z;
    #endif
  }
`,mt=ue+_e+`
  uniform vec3 uIceTint;
  uniform float uGlint;
  varying vec2 vUv;
  varying vec4 vP;
  varying vec3 vNv;
  varying vec3 vW;
  varying float vOwn;
  void main() {
    float a0 = vP.x, seed = vP.y;
    // an angular chip: three cuts at uneven angles, turned by the spin
    float d = -1.0;
    for (int i = 0; i < 3; i++) {
      float a = a0 + float(i) * 2.094 + (hash1(seed * 13.0 + float(i)) - 0.5) * 0.9;
      d = max(d, dot(vUv, vec2(cos(a), sin(a))) - (0.15 + 0.1 * hash1(seed * 7.0 + float(i))));
    }
    float shape = (1.0 - smoothstep(-0.03, 0.03, d));
    if (shape * vP.w < 0.003) discard;
    vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
    vec3 Hh = normalize(uSun + V + vec3(0.0, 1e-4, 0.0));
    vec3 N = normalize(vNv + vec3(0.0, 1e-4, 0.0));
    float sp = abs(dot(N, Hh)); sp = sp * sp; sp = sp * sp; sp = sp * sp; sp = sp * sp;
    float back = max(dot(-V, uSun), 0.0);
    float lit = vP.z;
    float edge = smoothstep(-0.07, -0.01, d);                                  // a bright bevel round a clear middle
    vec3 body = uIceTint * (uSkyCol * (0.55 + 0.5 * edge) + uSunCol * lit * (0.08 + 0.3 * edge));
    vec3 gl = uSunCol * lit * uGlint * (sp * 4.5 + 0.06 + back * back * back * 1.0) + uSkyCol * sp * 0.8;
    vec3 pale = uIceTint * (uSkyCol * 0.5 + 0.62) * vOwn * (1.0 - 0.5 * lit);
    body += pale * (0.6 + 0.6 * edge); gl += pale * (sp * 3.5 + 0.3);
    float fa = fogAmt();
    float aB = (0.26 + 0.34 * edge) * (1.0 + 0.7 * vOwn) * shape * vP.w;
    gl_FragColor = vec4(mix(body * aB, fogCol() * aB, fa) + gl * shape * vP.w * (1.0 - fa), aB);
  }
`,pt=ue+Be+`
  attribute vec2 aUV;
  varying vec2 vUV;
  varying vec3 vW;
  void main() {
    vUV = aUV;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vW = wp.xyz;
    vec4 mv = viewMatrix * wp;
    gl_Position = projectionMatrix * mv;
    #ifdef USE_FOG
      vFogDepth = -mv.z;
    #endif
  }
`,gt=ue+_e+`
  uniform sampler2D uShadow;
  uniform vec3 uSnow;
  uniform vec4 uFloor;                       // total length, half width, shadow lateral span, bar contrast
  varying vec2 vUV;
  varying vec3 vW;
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash2(i), hash2(i + vec2(1.0, 0.0)), f.x), mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float relief(vec2 p) { return vnoise(p * vec2(0.9, 0.28)) * 0.7 + vnoise(p * vec2(3.1, 1.3) + 9.0) * 0.3; }
  void main() {
    float a = vUV.x, l = vUV.y;
    vec3 Vv = cameraPosition - vW; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
    float track = 1.0 - smoothstep(1.25, 1.9, abs(l));
    vec2 p = vW.xz;
    float e = 0.12;
    float h0 = relief(p), hx = relief(p + vec2(e, 0.0)), hz = relief(p + vec2(0.0, e));
    float bump = (1.0 - 0.75 * track) * 0.34;
    vec3 N = normalize(vec3(-(hx - h0) / e * bump, 1.0, -(hz - h0) / e * bump));
    float groove = (1.0 - smoothstep(0.02, 0.07, abs(abs(l) - 0.26))) * 0.5;
    vec2 pc = vec2(a / 0.62, l / 0.24); vec2 pi = floor(pc), pf = fract(pc) - 0.5;
    float paw = (1.0 - smoothstep(0.2, 0.42, length(pf * vec2(1.0, 0.9)))) * step(0.45, hash2(pi)) * step(abs(pi.y + 0.5), 2.6) * (1.0 - smoothstep(0.1, 0.2, abs(abs(l) - 0.26) - 0.02) * 0.0);
    float dent = max(groove, paw * 0.4) * track;
    float bars = texture2D(uShadow, vec2((a + uA0) / uFloor.x, l / uFloor.z + 0.5)).r;
    float age = (uFront - a) / 12.0 - 1.2;
    float canopy = mix(0.5, 0.16, smoothstep(0.0, 1.5, age)) * (0.55 + 0.45 * vnoise(p * 0.23 + 3.0)) * (1.0 - smoothstep(5.0, 13.0, abs(l)));
    float lit = litAt(a - l * uSkew, 0.0) * (1.0 - uFloor.w * bars) * (1.0 - canopy);
    vec3 alb = uSnow * (1.0 - 0.07 * track - 0.22 * dent);
    float ndl = max(dot(N, uSun), 0.0);
    float rl = clamp(0.5 + (N.x + N.z) * 1.6, 0.0, 1.0);
    vec3 fill = mix(uDeep * 1.6, uSkyCol, 0.3 + 0.3 * h0 + 0.4 * rl) * (1.0 - 0.25 * dent);
    vec3 col = alb * (uSunCol * lit * (0.25 + 0.6 * min(ndl, 0.5)) + fill * (0.8 - 0.4 * lit));
    // sparkle: facets that flash as the eye moves; only near, so it never shimmers far off
    vec2 sc = floor(p * 26.0);
    float fl = hash2(sc + floor(dot(V, vec3(31.0, 17.0, 23.0)) + hash2(sc) * 6.0));
    col += (uSunCol * lit * 2.2 + uSkyCol * 0.5) * step(0.993, fl) * (1.0 - smoothstep(6.0, 26.0, dist)) * (0.4 + 0.6 * hash2(sc + 3.0));
    float edge = (1.0 - smoothstep(0.6, 1.0, abs(l) / uFloor.y)) * smoothstep(0.0, 14.0, a + uA0) * (1.0 - smoothstep(uFloor.x - uA0 - 20.0, uFloor.x - uA0, a));
    gl_FragColor = vec4(mix(col, fogCol(), fogAmt()), edge);
  }
`,wt={common:ue,fogV:Be,fogF:_e};async function yt(n,i={}){const h=n.rng,W=n.quality?.detail??1,$=(i.palette&&i.palette.length>=6?i.palette:rt).map(it),R={dawn:"rose",day:"rose"}[i.hour]||i.hour||"rose",F=i.load??i.season??"normal",V=i.weather||"clear",p={normal:{bow:1,glaze:.014,ff:1.6,shards:60},heavy:{bow:1.1,glaze:.021,ff:1.25,shards:70},light:{bow:.86,glaze:.009,ff:2,shards:44}}[F]||{bow:1,glaze:.014,ff:1.6,shards:60},N=i.sunSide??(R==="golden"?-1:1),oe=i.sunDir?new r.Vector3().copy(i.sunDir).normalize():R==="night"?new r.Vector3(.78*N,.5,.36).normalize():new r.Vector3(.975*N,R==="golden"?.16:.125,.19).normalize(),Me=R==="night"?new r.Color("#C9D6FF").multiplyScalar(.85):R==="golden"?new r.Color("#FFB066").multiplyScalar(2.7):$[1].clone().lerp($[2],.42).multiplyScalar(2.5),Ge=$[3].clone().multiplyScalar(R==="night"?.42:1.22),We=$[4].clone().multiplyScalar(R==="night"?.45:1);i.sunColor&&Me.set(i.sunColor).multiplyScalar(i.sunIntensity??2.5);const Ee=i.ridgeShadow??R==="rose",ye=Math.max(0,i.centerline?i.lead??0:0),j=60+ye,Z=30+ye;let _=i.length??305;const le=10;let I,B,H;if(i.centerline&&i.centerline.length>=2){const e=new r.CatmullRomCurve3(i.centerline.map(f=>f.isVector3?f.clone():new r.Vector3(f[0],f[1]||0,f[2])),!1,"centripetal");e.arcLengthDivisions=600;const o=e.getLength();_=Math.max(40,o-ye-le),H=Math.round(_+le);const a=H+2*j+1;I=new Float32Array(a),B=new Float32Array(a);const u=new r.Vector3,d=e.getTangentAt(0),C=e.getTangentAt(1),w=e.getPointAt(0),z=e.getPointAt(1);for(let f=0;f<a;f++){const T=f-60;T<=0?u.copy(w).addScaledVector(d,T):T>=o?u.copy(z).addScaledVector(C,T-o):e.getPointAt(T/o,u),I[f]=u.x,B[f]=u.z}}else{H=Math.round(_+le);const e=H+2*j+1;I=new Float32Array(e),B=new Float32Array(e);const o=r.MathUtils.degToRad(15)*h.range(.6,1.25)*(i.mirror?-1:1),a=r.MathUtils.degToRad(18)*h.range(.6,1.25)*(i.mirror?-1:1),u=_/305,d=m=>-o*Oe(8*u,75*u,m)+(o+a)*Oe(75*u,165*u,m);let C=0,w=0,z=1e9,f=-1e9,T=1e9,c=-1e9;for(let m=j;m<e;m++){I[m]=C,B[m]=w;const E=d(m-j+.5);C+=Math.sin(E),w-=Math.cos(E)}for(let m=j-1;m>=0;m--)I[m]=I[m+1],B[m]=B[m+1]+1;for(let m=j;m<=j+H;m++)z=Math.min(z,I[m]),f=Math.max(f,I[m]),T=Math.min(T,B[m]),c=Math.max(c,B[m]);const L=(z+f)/2,O=(T+c)/2;for(let m=0;m<e;m++)I[m]-=L,B[m]-=O}const ve=I.length,be=i.groundAt||(()=>0),se=(e,o=0,a={})=>{const u=Math.min(ve-1.001,Math.max(0,e+j)),d=Math.floor(u),C=u-d;let w=I[d+1]-I[d],z=B[d+1]-B[d];const f=Math.hypot(w,z)||1;return w/=f,z/=f,a.x=I[d]+(I[d+1]-I[d])*C-z*o,a.z=B[d]+(B[d+1]-B[d])*C+w*o,a.tx=w,a.tz=z,a.y=be(a.x,a.z),a},ne=(e,o,a=-1,u=ve)=>{let d=1e18,C=0;const w=a<0?0:Math.max(0,Math.floor(a+j-u)),z=a<0?ve-1:Math.min(ve-1,Math.ceil(a+j+u));for(let O=w;O<=z;O++){const m=I[O]-e,E=B[O]-o,v=m*m+E*E;v<d&&(d=v,C=O)}const f=Math.min(ve-2,C),T=I[f+1]-I[f],c=B[f+1]-B[f],L=(e-I[C])*T+(o-B[C])*c;return{arc:C-j+L,lat:-(e-I[C])*c+(o-B[C])*T}},ze=i.frontFactor??p.ff,Y=i.passAt??125*(_/305),Se=i.pathLength??440,Ce=i.arcadeStart??125,me=i.releaseAt||(e=>e/He),pe=i.frontAt||(e=>He*e),ge=i.timeAtCamArc||(e=>(Y+ze*(e-Y))/He),Te=i.shardBoost||(()=>1),fe=[];for(let e=0;e<5;e++)fe.push(ct(h,e,e<3?0:1)),await n.yield();const ee=[],Ae=Math.max(4,Math.round(_/6.1)+1),y={};for(let e=0;e<Ae;e++)for(const o of[1,-1]){const a=3+e/(Ae-1)*(_-6)+h.range(-1.5,1.5),u=o*h.range(6,7);se(a,u,y);const d=h.gauss()*.32+(o>0?.08:-.08),C=-o*-y.tz,w=-o*y.tx,z=C*Math.cos(d)-w*Math.sin(d),f=C*Math.sin(d)+w*Math.cos(d);let T=p.bow*h.range(.7,1.08);F==="light"&&h.chance(.5)&&(T*=.45);const c={a,lat:u,side:o,x:y.x,y:y.y,z:y.z,dx:z,dz:f,bow:T,scale:h.range(.84,1.14),v:h.int(0,2),rel:me(a)+h.range(-.15,.15),seed:h(),corr:Math.abs(u)};i.skip&&i.skip(a,o*N)||ee.push(c)}const xe=[],Fe=i.heraldArc||[75,100],re=i.heraldCam||[25,55];for(const[e,o,a,u]of[[1,Fe[0],re[0],1],[-1,Fe[1],re[1],.85]]){const d=e*N,C=(o+h.range(-6,6)*.3)*(_/305);let w=null;for(const z of ee)z.side===d&&(!w||Math.abs(z.a-C)<Math.abs(w.a-C))&&(w=z);w.bow=Math.max(w.bow,p.bow*1.02),w.herald=!0,w.whip=u,w.scale=Math.max(w.scale,1),w.rel=ge(a*(_/305))-.8,xe.push(w)}for(const[e,o,a,u]of[[0,6.4,1.62,1.05],[7.5,6,1.2,1]])for(const d of[1,-1])se(_+le-e,d*o,y),ee.push({a:_+le-e,lat:d*o,side:d,x:y.x,y:y.y,z:y.z,dx:-d*-y.tz,dz:-d*y.tx,bow:u,scale:a,v:(d>0?0:2)+(e?1:0)*(d>0?1:-1),rel:1e6,seed:h(),portal:!0,corr:o});for(const e of i.extraTrees||[]){const o=ne(e.x,e.z),a=e.dir||[Math.cos(e.yaw||0),Math.sin(e.yaw||0)];se(o.arc,0,y);const u=Math.sign(o.lat)||1,d=(a[0]*y.tz-a[1]*y.tx)*u,C=e.corr??(d>.2?Math.abs(o.lat)/d:1e3);ee.push({a:e.arc??o.arc,lat:o.lat,side:u,x:e.x,y:e.y??be(e.x,e.z),z:e.z,dx:a[0],dz:a[1],bow:e.bow??.9,scale:e.scale??1,v:e.light?3+h.int(0,1):e.variant??h.int(0,2),rel:e.release??1e6,seed:h(),extra:!0,light:!!e.light,corr:C,clear:e.clear,whip:e.whip||0,rag:e.rag||0})}await n.yield();const D={uT:{value:0},uTime:{value:0},uFront:{value:0},uRidge:{value:i.ridgeHeight??7.4},uWind:{value:i.wind??1},uLitAll:{value:Ee?0:1},uSkew:{value:.35*N},uPre:{value:i.preLit??(ye>0?4:-1e5)},uA0:{value:Z},uSun:{value:oe.clone()},uSunCol:{value:Me},uSkyCol:{value:Ge},uDeep:{value:We},uThetaMax:{value:Ie},uGlaze:{value:p.glaze},uGlint:{value:i.glint??1},uBark:{value:$[0].clone().multiplyScalar(.72)},uTwigCol:{value:new r.Color("#47352f").lerp($[4],.1)},uIceTint:{value:$[5].clone().lerp(new r.Color("#ffffff"),.45)},uSnow:{value:$[0].clone().multiplyScalar(.8)},uPx:{value:.002},uCurt:{value:i.curtain??1},uFull:{value:i.full??0},uShadow:{value:null},uFloor:{value:new r.Vector4(H+30+Z,i.floorWidth??46,i.shadowLat??48,.62)}},ie=()=>r.UniformsUtils.clone(r.UniformsLib.fog),t=(e,o,a={},u={})=>new r.ShaderMaterial({uniforms:{...ie(),...D,...a},vertexShader:e,fragmentShader:o,fog:!0,...u}),s={transparent:!0,depthWrite:!1,blending:r.CustomBlending,blendEquation:r.AddEquation,blendSrc:r.OneFactor,blendDst:r.OneMinusSrcAlphaFactor,blendSrcAlpha:r.OneFactor,blendDstAlpha:r.OneMinusSrcAlphaFactor},l=new r.Group;l.name="ice-arcade";const g=new r.Matrix4,A=new r.Quaternion,S=new r.Vector3,b=new r.Vector3,k=new r.Vector3(0,1,0);let x=0;for(let e=0;e<5;e++){const o=ee.filter(c=>c.v===e);if(!o.length)continue;await n.yield();const a=fe[e],u=o.length,d=new Float32Array(u*4),C=new Float32Array(u*4),w=new r.InstancedMesh(a.bark,t(ht,ft,{uLen:{value:a.L}}),u),z=new r.InstancedMesh(a.glass,t(dt,ut,{uLen:{value:a.L},uCardW:{value:a.cardW}},{...s,side:r.DoubleSide}),u);o.forEach((c,L)=>{A.setFromAxisAngle(k,Math.atan2(-c.dz,c.dx)),g.compose(S.set(c.x,c.y,c.z),A,b.setScalar(c.scale)),w.setMatrixAt(L,g),z.setMatrixAt(L,g),d.set([c.bow,c.rel,c.a-c.lat*.35*N,c.seed],L*4),c.L=a.L,C.set([(c.corr??1e3)/c.scale,(c.clear??4.8)/c.scale,c.whip||0,c.rag||0],L*4)});const f=new r.InstancedBufferAttribute(d,4),T=new r.InstancedBufferAttribute(C,4);a.bark.setAttribute("aInst",f),a.glass.setAttribute("aInst",f),a.bark.setAttribute("aInst2",T),a.glass.setAttribute("aInst2",T);for(const c of[w,z])c.frustumCulled=!1,c.instanceMatrix.needsUpdate=!0,l.add(c);z.renderOrder=2,x+=a.tris*u}await n.yield();const q=(e,o,a,u,d)=>d.set(e.x+(o*e.dx-u*e.dz)*e.scale,e.y+a*e.scale,e.z+(o*e.dz+u*e.dx)*e.scale),M={x:0,y:0};{const e=Math.round(p.shards*W),o=Math.round(3600*W),a=Math.round((V==="clear"?1500:2600)*W),u=ee.filter(v=>v.rel<1e5);let d=0;const C=n.core&&n.core.makeRng?n.core.makeRng((n.seed|0)*31+977>>>0):h;for(const v of u)v.boost=v.rag?1.7:v.light?.35:Te(v.a),v.nSh=Math.round(e*v.boost),v.nEx=v.herald?Math.max(0,Math.round(e*3)-v.nSh):0,d+=v.nSh+v.nEx;const w=d+o+a,z=new Float32Array(w*4),f=new Float32Array(w*4),T=new Float32Array(w*4);let c=0;const L=new r.Vector3;let O=0;for(const v of u){(++O&1)===0&&await n.yield();const J=v.herald?1.25:v.boost>1.2?1.15:.9;for(let ae=0;ae<v.nSh+v.nEx;ae++,c++){const X=ae<v.nSh?h:C,Ve=.12+.88*Math.pow(X(),.7);Ue(Ve,Ie*v.bow,v.L,M);const Pe=Oe(.4,.8,Ve);q(v,M.x+X.gauss()*.25*Pe,Math.max(.4,M.y-X()*X()*3.2*Pe),X.gauss()*(.12+1.5*Pe),L),z.set([L.x,L.y,L.z,be(L.x,L.z)],c*4),f.set([X.gauss()*.5+v.dx*.3,X.gauss()*.5+v.dz*.3,v.rel+.8+(.35+(v.rag||0))*Ve+X()*X()*(v.herald?1.5:.6),X()],c*4),T.set([v.a-v.lat*.35*N,X.range(.05,.14)*J*(F==="heavy"?1.25:1),X.range(.16,.4),X.range(5,19)*X.sign()],c*4)}}await n.yield();for(let v=0;v<o;v++,c++){(v&127)===127&&await n.yield();const J=h.range(-4,_+4);se(J,h.gauss()*3.6,y),z.set([y.x,y.y+.02,y.z,y.y],c*4),f.set([0,0,-100,h()],c*4),T.set([J,h.range(.035,.11),.2,0],c*4)}await n.yield();for(let v=0;v<a;v++,c++){(v&127)===127&&await n.yield();const J=h.range(-10,_+12);se(J,h.range(-10,10),y),z.set([y.x,y.y+h.range(0,10.5),y.z,y.y],c*4),f.set([0,0,me(J)+.8,h()],c*4),T.set([J,V==="shower"?.03:.014,-1,h.range(0,3)],c*4)}const m=new r.InstancedBufferGeometry;m.setAttribute("position",new r.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),m.setIndex([0,1,2,0,2,3]),m.setAttribute("aP0",new r.InstancedBufferAttribute(z,4)),m.setAttribute("aV",new r.InstancedBufferAttribute(f,4)),m.setAttribute("aM",new r.InstancedBufferAttribute(T,4)),m.instanceCount=w;const E=new r.Mesh(m,t(vt,mt,{},s));E.frustumCulled=!1,E.renderOrder=3,l.add(E),x+=w*2}await n.yield();const K=i.shadowLat??48,G=ye>0?4096:2048,P=Math.max(32,Math.round(128*K/48)),U=H+30+Z,ce=new Uint8Array(G*P);{const e=Math.hypot(oe.x,oe.z)||1,o=-oe.x/e,a=-oe.z/e,u=Math.max(.06,oe.y/e),d=Math.min(62,9.5/u),C=U/G,w=K/P,z=(f,T,c,L,O)=>{const m=ne(f,T,c,75),E=(m.arc+Z)/U*G,v=(m.lat/K+.5)*P-.5,J=Math.max(L/C,1.3),ae=Math.max(L/w,1),X=Math.max(0,Math.floor(E-J)),Ve=Math.min(G-1,Math.ceil(E+J)),Pe=Math.max(0,Math.floor(v-ae)),lt=Math.min(P-1,Math.ceil(v+ae));for(let qe=Pe;qe<=lt;qe++){const Je=(qe-v)/ae;for(let Le=X;Le<=Ve;Le++){const Qe=(Le-E)/J,$e=Qe*Qe+Je*Je;if($e>=1)continue;const et=1-$e,tt=O*et*(2-et);tt>ce[qe*G+Le]&&(ce[qe*G+Le]=tt)}}};for(const f of ee){const T=Ie*f.bow,c=f.L*f.scale,L=Math.ceil(Math.min(c/u,d+c)/.33);for(let O=1;O<=L;O++){const m=O/L;Ue(m,T,f.L,M);const E=M.y*f.scale/u;if(E>d)break;const v=f.x+f.dx*M.x*f.scale+o*E,J=f.z+f.dz*M.x*f.scale+a*E,ae=E/d;z(v,J,f.a,.17*(1-.6*m)+.012*E,255*(1-.4*ae)),ae>.45&&(O&3)===0&&z(v,J,f.a,(.5+2.6*(ae-.45))*f.scale,175*Oe(.45,.62,ae)*(1-Oe(.9,1,ae)))}await n.yield()}}const te=new r.DataTexture(ce,G,P,r.RedFormat,r.UnsignedByteType);te.magFilter=te.minFilter=r.LinearFilter,te.needsUpdate=!0,D.uShadow.value=te;let he=null;if(i.floor!==!1){const e=D.uFloor.value.y,o=Math.ceil(U/2.5),a=12,u=[],d=[],C=[];for(let z=0;z<=o;z++){const f=-Z+z/o*U;for(let T=0;T<=a;T++){const c=T/a*2-1,L=Math.sign(c)*Math.pow(Math.abs(c),1.6)*e;if(se(f,L,y),u.push(y.x,y.y,y.z),d.push(f,L),z&&T){const O=z*(a+1)+T;C.push(O-a-2,O-1,O-a-1,O-a-1,O-1,O)}}}const w=new r.BufferGeometry;w.setAttribute("position",new r.Float32BufferAttribute(u,3)),w.setAttribute("aUV",new r.Float32BufferAttribute(d,2)),w.setIndex(C),he=new r.Mesh(w,t(pt,gt,{},{transparent:!0,side:r.DoubleSide})),he.frustumCulled=!1,he.renderOrder=-.5,l.add(he),x+=C.length/3}await n.yield();const de=(e,o,a)=>new r.Vector3(e,o,a),Q=(e,o=1.7,a=0)=>(se(e,a,y),de(y.x,y.y+o,y.z)),ot=e=>(se(e,0,y),de(y.tx,0,y.tz)),Ne=[];for(let e=-30;e<H-1;e+=12.5)Ne.push(Q(e));Ne.push(Q(H));const Re=(e,o=.86)=>(Ue(o,Ie*e.bow,e.L,M),q(e,M.x,M.y,0,de())),we=se(H,0,{});let Ze=xe[1];if(i.owlArc){let e=1e9;for(const o of ee){const a=Math.abs(o.a-i.owlArc);!o.extra&&!o.portal&&!o.herald&&o.side===xe[1].side&&o.bow>.6&&a<e&&(e=a,Ze=o)}}const st={flyThrough:Ne,mouth:{position:Q(0,0),facing:ot(0)},portalSeat:{position:de(we.x,we.y,we.z),center:de(we.x,we.y+4.5,we.z),facing:de(-we.tx,0,-we.tz),width:9,height:9,note:"foot of the portal on the snow under the last bowed pair (never released); three black spruce belong 8-12 m to its right (sun side)"},heralds:xe.map(e=>({root:de(e.x,e.y,e.z),crown:Re(e),curtain:Re(e,.55).setY(e.y+4.2),arc:e.a,side:e.side,time:e.rel+.8})),owlPerch:Re(Ze,.8).add(de(0,.35,0)),owlLiftTime:xe[1].rel+.8+1,trees:ee.map(e=>({x:e.x,y:e.y,z:e.z,arc:e.a,side:e.side,release:e.rel,portal:!!e.portal,herald:!!e.herald})),viewpoints:{nave:{position:Q(Y-60),gaze:Q(Y-20,4)},waveBeside:{position:Q(Y),gaze:Q(Y+30,3.5)},lookBack:{position:Q(Math.min(_-20,Y+70),2.2),gaze:Q(Y+30,4)},outside:{position:Q(Y,3,26*N),gaze:Q(Y+10,5)},exit:{position:Q(H-60),gaze:Q(H,4)}},sun:oe.clone(),arcLength:_,total:H,shadow:{texture:te,span:U,latSpan:K,start:Z,note:"red = trunk shadow; u = (arc + start) / span, v = lateral / latSpan + 0.5"}};let Xe=!1,ke=-3;const je=e=>{Xe=!0,ke=e},Ye=new r.Vector2,nt={triangles:Math.round(x),trees:ee.length,shardsPerTree:Math.round(p.shards*W),stemAt:(e,o,a)=>(Ue(e,Ie*o,a,M),[M.x,M.y]),extent:{length:H,width:2*(i.floorWidth??46),height:12},hour:R,load:F,weather:V,frontSpeed:He,frontFactor:ze,passAt:Y},De=i.view||[Math.min(_-30,118*(_/305)),9,3.2,-3],Ke=se(De[0],0,{});return{object:l,radius:De[1],height:De[3],center:de(Ke.x,Ke.y+De[2],Ke.z),anchors:st,info:nt,uniforms:D,ground:!1,groundY:0,setProgress(e){je(ge(Se*e-Ce))},setCameraArc(e){je(ge(e))},setTime:je,timeAtCamArc:ge,getTime:()=>ke,frontArc:()=>pe(ke),arcOf:(e,o)=>ne(e,o),pointAt:(e,o=0,a=0)=>Q(e,a,o),releaseTimeAt:e=>me(e)+.8,setLight(e={}){e.sun&&oe.copy(e.sun).normalize(),e.sunColor&&Me.copy(e.sunColor),e.sky&&Ge.copy(e.sky),e.deep&&We.copy(e.deep),e.glint!=null&&(D.uGlint.value=e.glint),e.litAll!=null&&(D.uLitAll.value=e.litAll)},update(e,o,a){D.uTime.value=o,Xe||(ke=-3+o*1%27),D.uT.value=ke,D.uFront.value=pe(ke),l.updateWorldMatrix(!0,!1),D.uSun.value.copy(oe).transformDirection(l.matrixWorld),a&&n.renderer&&(n.renderer.getDrawingBufferSize(Ye),D.uPx.value=2/(Math.max(.1,a.projectionMatrix.elements[5])*Math.max(1,Ye.y)))},dispose(){te.dispose()}}}export{wt as HERO_GLSL,yt as buildHero};
