import*as c from"three";import{makePath as wa,clamp as ye,lerp as B,smoothstep as q}from"../kit/core.js";import{buildHero as va,halfBeam as ht,SHIP as g,MOTION as He,motionAt as xa,MOTH as Ee,MOTH_GLSL as ba}from"../parts/gale-in-green-glass.js";const et=["#5FA07E","#17392B","#3F7F72","#ECE6D6","#14110F","#C99A4A","#B8862E","#FFB45A"],$=new c.Vector3(.47,0,-.883).normalize(),L=new c.Vector3(0,56,-50),G=250,Pe=new c.Vector3(.86,0,.5).normalize(),tt={left:.9,at:330,col:"#1D282E"},pt=Math.sqrt(-Math.log(tt.left))/tt.at,Ke=t=>new c.Vector3(t[0],t[1],t[2]),ue={aimZ:-20,back:345,height:78,level:60,hold:10},kt=new c.Vector3(0,ue.height,ue.aimZ).addScaledVector($,-ue.back),ya=kt.clone().sub(L).dot($),de={behind:80,push:40},ae=ya-de.behind-de.push,ge=Math.PI/180,we={loa:g.boomEnd[2]-g.jibEnd[2],half:ht(g.masts[1].z)},Ge={ahead:.2,low:11,r:.22,out:.2,step:22.5},dt={near:.22,far:.35,n:5},se={dive:40,clear:27,near:150,lift:8,step:22.5,close:.25,fall:3,top:67.5},he={x:0,y:g.P[1],z0:70},ga=[0,g.mainTopsail[1],(g.jibEnd[2]+g.boomEnd[2])/2],mt=new c.Vector3().crossVectors($,new c.Vector3(0,1,0)).normalize(),Gt=(t,o,i)=>[L.x+$.x*t+mt.x*o,i,L.z+$.z*t+mt.z*o];let Lt=null;function Vt(){if(Lt)return Lt;const t=Ge.r*we.loa,o=g.stemZ-Ge.ahead*we.loa,i=-(we.half+Ge.out*we.loa),d=we.half+dt.near*we.loa,r=d-t,m=we.half+dt.far*we.loa,h=he.y+se.lift,p=Math.tan(se.dive*ge),s=se.close*m,f=[],n=720,w=M=>Math.pow(1-M/Math.PI,se.fall);let y=0;for(let M=0;M<n;M++){const H=(M+.5)*Math.PI/n;y+=w(H)*Math.sin(H)*Math.PI/n}const A=s+(m-2*s)/y;let I=m,E=0,D=0,V=0;for(let M=0;M<=n;M++){const H=M*180/n;Math.abs(H/se.step-Math.round(H/se.step))<1e-6&&f.push([I,E,D,H]),Math.abs(H-se.top)<1e-6&&(V=D);const W=(M+.5)*Math.PI/n,J=s+(A-s)*w(W),ie=J*Math.PI/n;I-=Math.sin(W)*ie,E+=Math.cos(W)*ie,D+=ie}const re=D,Q=f[f.length-1][1],R=re-V,ce=M=>{const H=M+Q,W=h+p*(R+H-se.near),J=M-g.sternZ,ie=pe=>B(g.topY,W,(J+pe)/(J+V));return{yTop:W,zEnd:H,rise:ie,leg:J,pts:f.map(([pe,Ze,C,Le],b)=>[b===f.length-1?he.x:pe,Le<=se.top?ie(C):W-p*(C-V),M+Ze])}},Z=se.near-Q;return Lt={rB:t,zB:o,cxW:i,cxL:r,xLee:d,xOut:m,rWide:A,rClose:s,yNear:h,tan:p,xFar:f[(f.length-1)/2][0],z1:Z,...ce(Z)}}function jt(){const t=Vt(),o=[],i=Ge.low,d=(s,f,n)=>[B(s[0],f[0],n),B(s[1],f[1],n),B(s[2],f[2],n)];for(let s=0;s*20<=ue.level;s++)o.push(kt.clone().addScaledVector($,20*s).toArray());const r=kt.clone().addScaledVector($,ue.level+ue.hold).toArray();o.push(r);const m=[t.cxW-t.rB,i,t.zB+t.rB],h=Math.round(Math.hypot(m[0]-r[0],m[2]-r[2])/75);for(let s=1;s<h;s++)o.push(d(r,m,s/h));for(let s=0;s<=90.01;s+=Ge.step)o.push([t.cxW-t.rB*Math.cos(s*ge),i,t.zB+t.rB-t.rB*Math.sin(s*ge)]);o.push([(t.cxW+t.cxL)/2,i,t.zB]);for(let s=0;s<=90.01;s+=Ge.step)o.push([t.cxL+t.rB*Math.sin(s*ge),i,t.zB+t.rB-t.rB*Math.cos(s*ge)]);for(let s=1;s<=dt.n;s++){const f=s/dt.n,n=q(0,1,f);o.push([B(t.xLee,t.xOut,n),B(i,g.topY,n),B(t.zB+t.rB,g.sternZ,f)])}const p=Math.max(1,Math.round((t.z1-g.sternZ)/50));for(let s=1;s<p;s++)o.push([t.xOut,t.rise(t.leg*(s/p-1)),B(g.sternZ,t.z1,s/p)]);for(const s of t.pts)o.push(s);o.push([he.x,B(t.yNear,he.y,.6),(se.near+he.z0+10)/2]);for(const s of[he.z0+10,he.z0,60,40,20,0])o.push([he.x,he.y,s]);return o}function $a(t,o,i=0){const d=new c.Vector3;for(let r=i;r<=t.length;r+=.5)if(t.posAtDist(r,d),o(d,r))return r;return t.length}const $e={weight:1,lead:72*ge,hard:30,her:ga,ahead:.3,side:.5},Me={down:1.25,bow:.74,lee:.95,out:1.2,turn:.74,stoop:1,line:1.05},Ja=t=>ta(t.x,t.y,t.z);function ka(t){const o=t.length,i=g.masts,d=Vt(),r=(b,z)=>$a(t,b,z),m=ue.level+ue.hold,h=r(b=>b.z<i[2].z,m),p=r(b=>b.z<d.zB+d.rB,h),s=r(b=>b.x>d.cxW,p),f=r(b=>b.x>0,s),n=r(b=>b.x>d.cxL,f),w=r(b=>b.z>d.zB+d.rB,n),y=r(b=>b.z>i[1].z,w),A=r(b=>b.z>g.sternZ,y),I=r(b=>b.z>d.z1,A),E=r(b=>b.x<d.xFar,I),D=r(b=>b.z<se.near+.5,E),V=r(b=>b.z<he.z0+10,D),re=r(b=>b.z<40,V),Q=new c.Vector3,R=new c.Vector3,ce=new c.Vector3,Z=new c.Vector3,M=new c.Vector3,H=Ke($e.her),W=Ke(g.tops[0]),J=Ke(g.lantern),ie=Ke(g.sternWindow),pe=B(g.railY,g.topY,$e.side),Ze=(b,z)=>{z.copy(b).sub(Q);const oe=Math.max(z.length(),.001),ne=Math.max(Math.hypot(z.x,z.z),.001),ze=Math.atan2(z.y,ne),Ce=Math.atan2(R.x*z.z-R.z*z.x,R.x*z.x+R.z*z.z),ee=Math.abs(Ce),xt=Math.acos(Math.min(1,Math.cos($e.lead)/Math.max(Math.cos(ze-Math.asin(ye(R.y,-1,1))),.001))),bt=Math.min(ee,-Math.log(Math.exp(-$e.hard*ee)+Math.exp(-$e.hard*xt))/$e.hard),xe=Math.atan2(R.z,R.x)+Math.sign(Ce)*bt;return z.set(Math.cos(xe)*Math.cos(ze),Math.sin(ze),Math.sin(xe)*Math.cos(ze)).multiplyScalar(oe).add(Q)},C=(b,z)=>(t.posAtDist(b,Q),t.tangentAtDist(b,R),z.copy(H).lerp(W,q(h,s,b)),Z.set(0,pe,Math.min(Q.z+$e.ahead*we.loa,J.z)).lerp(J,q(y,A,b)),z.lerp(Z,q(f,w,b)),z.lerp(H,q(I,E,b)),Z.copy(J).lerp(ie,q(E,D,b)),z.lerp(Z,q(E,D,b)),Ze(ce.copy(z),z));return{duration:45,pace:b=>{const z=b*o;let oe=B(Me.down,Me.bow,q(h,p,z));return oe=B(oe,Me.lee,q(w,y,z)),oe=B(oe,Me.out,q(y,A,z)),oe=B(oe,Me.turn,q(A,E,z)),oe=B(oe,Me.stoop,q(E,D,z)),B(oe,Me.line,q(D,V,z))},lookPoint:C,places:{mHold:m,mMizzenW:h,mBowIn:p,mAthwart:s,mKeel:f,mLeeBow:n,mLeeRun:w,mMainL:y,mTaffL:A,mTurn:I,mFar:E,mNear:D,mLine:V,mLine40:re},pois:[{at:(b,z)=>C(z*o,M),from:0,to:re/o,weight:$e.weight,fade:(re-V)/re,steady:!0}]}}const x={s0:440,s1:680,r:50,end:900};function La(t){return t<=ae?0:t<ae+de.push?G*Math.sqrt(Math.max(0,1-(t-ae)/de.push)):t<=x.s0?G:t>=x.s1?x.r:x.r+(G-x.r)*(.5+.5*Math.cos(Math.PI*(t-x.s0)/(x.s1-x.s0)))}async function za(t){const o=[];for(let n=0;n<=12;n++){const w=G*n/12;o.push([ae+de.push*(1-(w/G)**2),w])}for(let n=1;n<=12;n++)o.push([ae+(x.s0-ae)*n/12,G]);for(let n=1;n<=20;n++){const w=x.s0+(x.s1-x.s0)*n/20;o.push([w,La(w)])}o.push([790,x.r],[x.end,x.r],[x.end-3,x.r-3],[x.end-9,x.r*.6],[x.end-12,0]);const i=new c.Vector3(0,1,0),d=new c.Vector3().crossVectors($,i).normalize(),r=96,m=[],h=[],p=[],s=new c.Vector3;for(let n=0;n<o.length;n++){n%4===3&&await t.yield();const[w,y]=o[n],A=o[Math.max(0,n-1)],I=o[Math.min(o.length-1,n+1)],E=I[0]-A[0],D=I[1]-A[1],V=Math.hypot(E,D)||1,re=D/V,Q=-E/V;for(let R=0;R<=r;R++){const ce=R/r*Math.PI*2,Z=Math.cos(ce),M=Math.sin(ce);s.copy(L).addScaledVector($,w).addScaledVector(i,y*Z).addScaledVector(d,y*M),m.push(s.x,s.y,s.z),s.set(0,0,0).addScaledVector($,re).addScaledVector(i,Q*Z).addScaledVector(d,Q*M),h.push(s.x,s.y,s.z)}}await t.yield();for(let n=0;n<o.length-1;n++)for(let w=0;w<r;w++){const y=n*(r+1)+w;p.push(y,y+r+1,y+r+2,y,y+r+2,y+1)}const f=new c.BufferGeometry;return f.setAttribute("position",new c.Float32BufferAttribute(m,3)),f.setAttribute("normal",new c.Float32BufferAttribute(h,3)),f.setIndex(p),f}const qa=`
  varying vec3 vW, vN;
  void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normal; gl_Position = projectionMatrix * viewMatrix * w; }`,a={tableY:-210,lift:-.06,liftTop:150,floorY:-1500,ceilY:2300,cornice:2130,rail:1420,dado:430,s0:-2100,s1:3300,l0:-2600,l1:1750,table:[-1650,2800,-1900,1380],sheet:[-1440,2350,-1500,-285],globe:[-1250,250,-600,230],ink:[1330,-470],dividers:[1810,-520],win:[480,540],bay:503.3,bay0:-1600,winBays:4,fire:[860,-200],star:[260,800],lamp:[-330,-614],pile:[650,-690],flameY:506,fall:320,dusk:.1,flameH:190,flameW:44,chimneyTop:1180};a.winPitch=a.winBays*a.bay,a.shade=[.2,.21,.24];const Fe={col:[1,.42,.13],k:1.1,fall:800,lift:60,breathe:.3},ft={lamp:[.56,.42,.24],cold:[.14,.22,.36]},Sa={y:70},Te={pitch:435,half:42,dark:.3,shade:.22},N={pier:-70,pic:[175,120,640],frame:34,ladder:1,rail:1480,rung:140},F={half:760,shelf:566,candle:480,ends:660,mirror:[330,430,524]},zt={k:.5,reach:245},_t={k:.4,fox:.6},qt=Ke(Gt(a.lamp[0],a.lamp[1],a.flameY)),Aa=qt.clone().sub(L).normalize(),ve=a.pile[0]+330,ut=(()=>{const t=qt.clone().sub(L),o=Ke(g.mainTopsail).sub(L),i=h=>Math.hypot(h.dot(mt),h.y);let d=0,r=1;for(let h=0;h<40;h++){const p=(d+r)/2;i(t.clone().lerp(o,p))>Ee.R?d=p:r=p}const m=t.clone().lerp(o,r);return{s:m.dot($),up:Math.atan2(-m.dot(mt),m.y)/ge}})(),e=t=>t.toFixed(1),Ne={beads:[-140,15,92],bead:10},Ea=`
  uniform vec3 uLampR; uniform vec4 uFlame, uRoomPh; uniform vec2 uHearthPh;
  vec3 rmP(vec3 w){ vec3 r = w - uMid; return vec3(dot(r, uAxis), w.y, dot(r, uSide)); }
  // THE LAMP'S LIGHT FALLS WITH THE SQUARE OF THE WAY FROM IT: half of it is left ROOM.fall metres off (d2: that way squared)
  float rmFall(float d2){ return 1. / (1. + d2 / ${e(a.fall*a.fall)}); }
  vec3 rmD(vec3 d){ return vec3(dot(d, uAxis), d.y, dot(d, uSide)); }
  float rh(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  // THE FIRE'S LIGHT at a place p of the room (FIRE): by the square of the way from its bed, breathing on the clock
  vec3 rmFire(vec3 p){
    vec3 v = p - vec3(${e(a.s1)}, ${e(a.fire[1]+Fe.lift)}, ${e(a.fire[0])});
    float br = ${(1-Fe.breathe).toFixed(2)} + ${(2*Fe.breathe).toFixed(2)} * texture2D(uNoise, vec2(uTime * .045 + uRoomPh.y, .61)).r;
    return vec3(${Fe.col.map(t=>t.toFixed(2)).join(", ")}) * (${Fe.k.toFixed(2)} * br / (1. + dot(v, v) / ${e(Fe.fall*Fe.fall)}));
  }
  // THE ROOM'S LIGHT LAW: what a face of colour alb shows at p under the lamp's light there (lamp: by the face's own
  // way), the dusk along the room, the fire, and the room's shade where the lamp's light has gone
  vec3 rmLit(vec3 alb, vec3 lamp, vec3 p){
    float ds = p.x - uLampR.x, k = ${a.dusk.toFixed(2)} + ${(1-a.dusk).toFixed(2)} * rmFall(ds * ds);
    return alb * (lamp * k + rmFire(p) + vec3(${a.shade.map(t=>t.toFixed(3)).join(", ")}) * (1. - k));
  }
  // a line of half width w metres at d metres from it, seen from t metres off: never drawn narrower than a pixel and
  // a half (the one floor; under it the line carries its share of that width, and a third more)
  float rmLine(float d, float w, float t){ float ww = max(w, t * .0022); return (1. - smoothstep(ww, ww * 1.7, abs(d))) * min(1., w / ww + .35); }
  // the chart's paper at a place p (metres), seen from t metres: x the ink, y the land's wash
  vec2 rmInk(vec2 p, float t){
    float land = texture2D(uNoise, p * .00019 + .37).r + .3 * texture2D(uNoise, p * .0008).g;
    float fw = max(fwidth(land), 2e-4), coast = 1. - smoothstep(fw, fw * 2.6, abs(land - .62));
    vec2 v = p - vec2(${e(a.star[0])}, ${e(a.star[1])}); float r = length(v), a = atan(v.y, v.x + 1e-4);
    float da = abs(fract(a / .3927 + .5) - .5) * .3927, rhumb = rmLine(r * sin(da), 4.5, t) * smoothstep(60., 200., r) * (.45 + .55 * step(.5, fract(a / .7854 + .25)));
    // the star: eight points, each half dark and half left pale, in one ring
    float k = abs(fract(a / .7854 + .5) - .5) * 2., pt = 250. * (.26 + .74 * pow(clamp(1. - k, 0., 1.), 3.));
    float star = step(r, pt) * step(0., fract(a / .7854 + .5) - .5), ring = rmLine(r - 285., 7., t);
    return vec2(clamp(max(max(coast * .9, rhumb * .7), max(star, ring)), 0., 1.), smoothstep(.62 - fw, .62 + fw, land));
  }
  // the lamp's light on the table at p: a pool round the font's own shadow, falling with the square of the way; where
  // the flame's light to that place has passed through the bottle it lies green, with one bright line (the glass gathers it)
  vec3 rmPool(vec2 p){
    vec2 dv = p - uLampR.xz; float d2 = dot(dv, dv), e = 1.9 / (1. + d2 / 490000.) * smoothstep(350., 470., sqrt(d2));
    vec2 q = uLampR.xz + dv * ${((a.flameY-56)/(a.flameY-a.tableY)).toFixed(4)};
    float inB = (1. - smoothstep(215., 250., abs(q.y))) * smoothstep(${e(ae)}, ${e(ae+40)}, q.x) * (1. - smoothstep(560., 700., q.x));
    vec3 c = uLampCol * e * uLampK * mix(vec3(1.), vec3(.16, .5, .26) * (.3 + .8 * exp(-q.y * q.y / 2500.)), inB);
    return c + vec3(.035, .06, .12);
  }
  vec3 rmTable(vec2 p, float t){
    vec2 ink = rmInk(p, t); vec3 paper = mix(vec3(.86, .74, .47), vec3(.72, .58, .33), ink.y * .6) * (.9 + .2 * texture2D(uNoise, p * .0031).a);
    paper = mix(paper, vec3(.09, .06, .04), ink.x * .88);
    // the paper's own edge a little inside the table's, bare dark wood beyond it
    // the table's top: GREEN BAIZE inside a walnut border; the chart's sheet lies on the lamp's side, under the things
    vec2 e = min(p - vec2(${e(a.table[0])}, ${e(a.table[2])}), vec2(${e(a.table[1])}, ${e(a.table[3])}) - p); float m = min(e.x, e.y);
    vec3 top = mix(vec3(.3, .16, .07) * (.8 + .4 * texture2D(uNoise, p * vec2(.0005, .004)).r), vec3(.05, .27, .13) * (.85 + .3 * texture2D(uNoise, p * .02).g), smoothstep(150., 156., m));
    top = mix(top, vec3(.9, .64, .22), (1. - smoothstep(3., 8., abs(m - 190.))) * .7);
    float inP = step(${e(a.sheet[0])}, p.x) * step(p.x, ${e(a.sheet[1])}) * step(${e(a.sheet[2])}, p.y) * step(p.y, ${e(a.sheet[3])});
    return mix(top, paper, inP) * rmPool(p);
  }`,Ma=`
  // THE SHELVES OF A WALL OF BOOKS (one painter for every such wall), from the floor to the cornice (ROOM.cornice):
  // boards 330 m apart, spines 58 m apart, each of its own width, height and colour, one in twelve a gap; an upright
  // every ROOM.bay metres; over them the cornice. q: metres along the wall and the height; lit: the wall's light
  // there; gk: how far its gilt answers the lamp. laid: 1 on a wall that keeps GREAT FOLIOS LAID FLAT: in one shelf
  // of a bay in six the books lie in a pile of three or four, their backs outward, each of its own length
  vec3 rmShelves(vec2 q, float t, vec3 lit, float gk, float laid){
    vec3 col = vec3(.3, .17, .08) * lit;
    float inSh = step(q.y, ${e(a.cornice)});
    float row = floor((q.y - ${e(a.floorY)}) / 330.), fy = q.y - ${e(a.floorY)} - row * 330., ci = floor(q.x / 58.), fx = q.x - ci * 58.;
    float h1 = rh(vec2(ci, row)), h2 = rh(vec2(ci + 7.7, row * 1.3 + 2.)), h3 = rh(vec2(ci * 1.7 + 3., row + 9.));
    float sw = 58. * (.6 + .38 * h1), sh = 296. * (.6 + .36 * h2), on = step(fx, sw) * step(26., fy) * step(fy, 26. + sh) * step(.08, h3);
    vec3 sp = h3 < .3 ? vec3(.56, .1, .07) : h3 < .5 ? vec3(.12, .2, .44) : h3 < .68 ? vec3(.4, .23, .09) : h3 < .84 ? vec3(.08, .32, .17) : vec3(.72, .6, .36);
    sp *= (.6 + .6 * h2) * (1. - .55 * smoothstep(sw * .25, sw * .5, abs(fx - sw * .5)));
    float gilt = step(.42, h1) * (rmLine(fy - 26. - sh * .8, 5., t) + rmLine(fy - 26. - sh * .2, 5., t)) * on;
    float glint = .55 + .45 * sin(uTime * (1.3 + 2. * h2) + h3 * 40.);
    float bi = floor((q.x - (${e(a.bay0)})) / ${e(a.bay)});
    if (laid * step(rh(vec2(bi * 1.3 + 5., row * 2.1 + 1.)), .17) > .5) {
      // (a shelf of folios: each 62 m thick, a line of shade between two of them, two gilt lines across each back)
      float bx = q.x - (${e(a.bay0)}) - bi * ${e(a.bay)}, pj = floor((fy - 26.) / 62.), py = fy - 26. - pj * 62.;
      float hf = rh(vec2(bi * 3.1 + pj, row * 1.7 + 4.)), hg = rh(vec2(bi + 9.3, row + pj * 2.3));
      float len = ${e(a.bay-60)} * (.6 + .38 * hf), x0 = 30. + (${e(a.bay-60)} - len) * hg;
      on = step(x0, bx) * step(bx, x0 + len) * step(26., fy) * step(pj, 2.5 + step(.5, hg)) * step(4., py);
      sp = (hf < .3 ? vec3(.56, .1, .07) : hf < .55 ? vec3(.5, .33, .14) : hf < .8 ? vec3(.08, .32, .17) : vec3(.12, .2, .44)) * (.7 + .5 * hg) * (1. - .45 * smoothstep(18., 31., abs(py - 33.)));
      gilt = step(.35, hf) * (rmLine(bx - x0 - len * .12, 5., t) + rmLine(bx - x0 - len * .88, 5., t)) * on;
    }
    // (the back of a shelf behind its books: dark wood; a wall of the room's ends has it one shade lighter, so that
    // no empty shelf of it stands under the room's shade)
    vec3 shelf = mix(vec3(.05, .04, .03) * (1. + .8 * laid), sp, on) * lit * 1.6 + vec3(1., .72, .3) * gilt * glint * (.35 + .9 * uLampK * step(.8, h2 + h3 * .4)) * gk;
    shelf = mix(shelf, vec3(.36, .2, .09) * lit * (1.25 - .5 * step(fy, 9.)), max(step(fy, 26.), step(abs(fract((q.x - (${e(a.bay0)})) / ${e(a.bay)} + .5) - .5), .028)));
    col = mix(col, shelf, inSh);
    // the cornice over them: a deep moulding of walnut, a bright roll at its foot, a shade under its lip
    float cq = (q.y - ${e(a.cornice)}) / ${e(a.ceilY-a.cornice)};
    return mix(col, vec3(.4, .23, .1) * lit * (.7 + .9 * smoothstep(0., .12, cq) * (1. - smoothstep(.12, .3, cq)) + .5 * smoothstep(.5, .62, cq) - .45 * smoothstep(.8, .9, cq)), 1. - inSh);
  }
  vec3 rmDarkWall(vec2 q, float t){
    // (the shelves' light is the lamp's by its own way to them, as strong abreast of the lamp as it was; the moon's cold
    // stays; the shelves nearest the hearth take the fire's glow, by the room's law)
    float wayD = ${e((a.l1-a.lamp[1])**2)}, fallD = rmFall(wayD + (q.x - uLampR.x) * (q.x - uLampR.x)) / rmFall(wayD);
    vec3 lit = uLampCol * vec3(${ft.lamp.map(t=>t.toFixed(2)).join(", ")}) * uLampK * fallD + vec3(${ft.cold.map(t=>t.toFixed(2)).join(", ")}) * (.45 + .55 * fallD) + rmFire(vec3(q.x, q.y, ${e(a.l1)}));
    vec3 col = rmShelves(q, t, lit, 1., 0.);
    // the tall clock: a trunk with a glass door, a hood with a round head, a pale dial with twelve ticks and two hands
    vec2 c = q - vec2(130., 0.);
    float body = max(step(abs(c.x), 98.) * step(q.y, 930.), max(step(abs(c.x), 128.) * step(930., q.y) * step(q.y, 1215.), step(length((q - vec2(130., 1215.)) / vec2(128., 95.)), 1.)));
    col = mix(col, vec3(.4, .2, .09) * lit * (1.25 - .5 * smoothstep(60., 98., abs(c.x)) * step(q.y, 930.)), body);
    float door = step(abs(c.x), 64.) * step(110., q.y) * step(q.y, 810.);
    float sa = .1 * sin(uTime * 1.5708 + uRoomPh.x); vec2 bob = vec2(130., 900.) + 700. * vec2(sin(sa), -cos(sa)), bq = q - bob;
    float rod = rmLine((q.x - 130.) - (900. - q.y) * tan(sa), 4., t) * step(q.y, 900.) * step(bob.y, q.y), bd = length(bq);
    vec3 inDoor = vec3(.012, .016, .018) + vec3(.5, .36, .12) * lit * rod + vec3(1., .78, .34) * (lit * 1.6 * step(bd, 38.) + (.9 + .6 * uLampK) * exp(-dot(bq + vec2(10., -10.), bq + vec2(10., -10.)) / 150.));
    col = mix(col, inDoor, door);
    vec2 dq = q - vec2(130., 1075.); float dr = length(dq), dang = atan(dq.y, dq.x + 1e-4);
    float tick = step(abs(fract(dang / .5236 + .5) - .5), .09) * step(62., dr) * step(dr, 80.);
    float hands = max(rmLine(dq.x * .829 - dq.y * .559, 5., t) * step(0., dq.x * .559 + dq.y * .829) * step(dr, 70.), rmLine(dq.x * .242 + dq.y * .97, 6., t) * step(0., dq.x * .97 - dq.y * .242) * step(dr, 48.));
    col = mix(col, vec3(.8, .74, .58) * lit * 1.7 * (1. - .85 * max(tick, hands)), step(dr, 90.));
    // the window: tall and cold, one upright bar and three across it, the moon small and bright in an upper pane
    // (two such windows stand in this wall, ROOM.winPitch metres apart; the moon is in the nearer one)
    float wi = step(${e(a.win[0]+a.winPitch/2)}, q.x); vec2 w = q - vec2(${e(a.win[0])} + ${e(a.winPitch)} * wi, ${e(a.win[1])}), hw = vec2(150., 380.);
    float inW = step(abs(w.x), hw.x) * step(abs(w.y), hw.y), fr = step(abs(w.x), hw.x + 30.) * step(abs(w.y), hw.y + 30.);
    float bars = max(max(rmLine(w.x, 7., t), rmLine(w.y, 6., t)), max(rmLine(w.y - 190., 6., t), rmLine(w.y + 190., 6., t)));
    vec2 mq = w - vec2(72., 268.); float md = length(mq);
    vec3 sky = mix(vec3(.09, .2, .62), vec3(.2, .4, .95), clamp(.5 - w.y / 760., 0., 1.)) * 1.25 + vec3(1., .97, .88) * (2.6 * (1. - smoothstep(22., 26., md)) + .45 * exp(-md / 55.)) * (1. - wi);
    col = mix(col, vec3(.16, .17, .18) * (lit + vec3(.05, .09, .16)), fr); col = mix(col, sky * (1. - .93 * bars), inW);
    // the curtain beside it: pale folds, cold where the window finds them
    float cx = q.x - ${e(a.winPitch)} * wi, inC = step(662., cx) * step(cx, 855.) * step(-320., q.y) * step(q.y, 985.), fold = .5 + .5 * sin(cx * .13 + .7 * sin(q.y * .0045));
    col = mix(col, (vec3(.5, .52, .5) * lit + vec3(.1, .16, .26) * (1. - (cx - 662.) / 193.)) * (.35 + .75 * fold), inC);
    return col;
  }`,Fa=`
  // a panelled wall: x: 1 on a raised field; y: the light its moulding takes (L: the way to the light along the wall)
  vec2 rmPanel(vec2 q, vec2 cell, float rail, vec2 L){
    vec2 f = (fract(q / cell) - .5) * cell, e = cell * .5 - rail - abs(f); float m = min(e.x, e.y);
    vec2 n = e.x < e.y ? vec2(sign(f.x), 0.) : vec2(0., sign(f.y));
    return vec2(smoothstep(0., 12., m), (1. - smoothstep(10., 44., m)) * step(0., m) * dot(n, L));
  }
  // the wall's own dress at q (metres along it, the height): walnut panelling to the picture rail, oxblood over it, the
  // cornice; L: the way to the light along the wall
  vec3 rmWall(vec2 q, vec2 L){
    vec2 pn = rmPanel(q + vec2(0., ${e(-a.floorY)}), vec2(640., ${e((a.rail-a.floorY)/3)}), 78., L);
    float grain = texture2D(uNoise, q * vec2(.0042, .0005)).r;
    vec3 col = vec3(.46, .2, .085) * (.75 + .5 * grain) * (1. - .28 * pn.x) * (1. + .8 * pn.y);
    float up = smoothstep(${e(a.rail)}, ${e(a.rail+6)}, q.y), rl = (q.y - ${e(a.rail)}) / 60.;
    col = mix(col, vec3(.4, .075, .06) * (.8 + .4 * texture2D(uNoise, q * .0011).g), up);
    col *= 1. + .7 * (1. - smoothstep(.0, .5, abs(rl + .5))) - .5 * (1. - smoothstep(0., .4, abs(rl - .5)));
    float cq = (q.y - ${e(a.cornice)}) / ${e(a.ceilY-a.cornice)};
    return mix(col, vec3(.44, .26, .11) * (.7 + .9 * smoothstep(0., .12, cq) * (1. - smoothstep(.12, .3, cq)) + .5 * smoothstep(.5, .62, cq) - .45 * smoothstep(.8, .9, cq)), step(0., cq));
  }
  // a frame of half sizes h round c, w metres wide: x: 1 inside its sight, y: 1 on the frame, z: the moulding's light
  vec3 rmFrame(vec2 q, vec2 c, vec2 h, float w, vec2 L){
    vec2 e = h + w - abs(q - c); float m = min(e.x, e.y), on = step(0., m) * (1. - step(w, m));
    vec2 n = e.x < e.y ? vec2(sign(q.x - c.x), 0.) : vec2(0., sign(q.y - c.y));
    return vec3(step(w, m), on, (.5 - abs(m / w - .5)) * 2. * dot(n, L) + .5 * (1. - smoothstep(.0, .25, abs(m / w - .5))));
  }
  vec3 rmLampWall(vec2 q){
    vec2 v = vec2(uLampR.x, uLampR.y) - q; float fall = 1.8 / (1. + dot(v, v) / 4.4e6); vec2 L = normalize(v + 1e-3);
    vec3 col = rmWall(q, L);
    // the door, far along toward the bottle's base: six panels
    vec2 dr = q - vec2(-1650., 0.); float door = step(abs(dr.x), 330.) * step(q.y, 1240.);
    vec2 dp = rmPanel(dr + vec2(330., ${e(-a.floorY)}), vec2(330., 913.), 52., L);
    col = mix(col, vec3(.3, .16, .07) * (1. - .3 * dp.x) * (1. + .8 * dp.y), door);
    // THE CASE OF BUTTERFLIES: a dark frame, cream ground, four rows of three, each of its own colour, wings spread
    vec3 fr = rmFrame(q, vec2(-620., 880.), vec2(300., 390.), 46., L);
    vec2 bq = (q - vec2(-620., 880.) + vec2(300., 390.)) / vec2(200., 195.), bi = floor(bq), bp = (fract(bq) - .5) * vec2(2.5, 2.44); bp.x = abs(bp.x);
    float hb = rh(bi + 2.3), fore = length((bp - vec2(.52, .22)) / vec2(.5, .36 + .2 * bp.x)), hind = length((bp - vec2(.36, -.3)) / vec2(.34, .3)), wing = min(fore, hind);
    vec3 wc = hb < .2 ? vec3(.12, .36, .86) : hb < .4 ? vec3(.92, .46, .08) : hb < .58 ? vec3(.93, .8, .2) : hb < .74 ? vec3(.86, .12, .1) : hb < .88 ? vec3(.2, .62, .34) : vec3(.9, .88, .78);
    vec3 fly = mix(vec3(.84, .78, .6), wc * (1. - .75 * smoothstep(.72, .98, wing)), 1. - smoothstep(.97, 1.03, wing));
    fly = mix(fly, vec3(.07, .05, .04), 1. - smoothstep(.035, .06, length(bp * vec2(1., .13))));
    col = mix(col, fly, fr.x); col = mix(col, vec3(.16, .09, .045) * (1. + .9 * fr.z), fr.y);
    // THE BAROMETER: a banjo of walnut, its round dial low (a pale face, twelve ticks, one hand, a brass rim), a small
    // round over it, the tube with its red thread up the neck, a rounded head
    vec2 bc = q - vec2(2250., 620.); float br = length(bc), neck = step(abs(bc.x), 52. + 24. * smoothstep(300., 900., bc.y)) * step(0., bc.y) * step(bc.y, 900.);
    float bodyB = max(max(step(br, 192.), neck), max(step(length(bc - vec2(0., 900.)), 92.), step(length(bc - vec2(0., 400.)), 84.)));
    col = mix(col, vec3(.3, .15, .06) * (1.2 - .4 * smoothstep(20., 60., abs(bc.x)) * neck), bodyB);
    float ba = atan(bc.y, bc.x + 1e-4), tickB = step(abs(fract(ba / .5236 + .5) - .5), .1) * step(108., br) * step(br, 138.);
    float handB = (1. - smoothstep(4., 9., abs(bc.x * .5 + bc.y * .866))) * step(0., bc.y * .5 - bc.x * .866) * step(br, 125.);
    col = mix(col, vec3(.84, .78, .6) * (1. - .85 * max(tickB, handB)), step(br, 150.));
    col = mix(col, vec3(1., .72, .28) * (.7 + .9 * clamp(dot(normalize(bc + 1e-3), L), 0., 1.)), step(150., br) * step(br, 170.));
    col = mix(col, vec3(.8, .74, .58), step(length(bc - vec2(0., 400.)), 56.));
    col = mix(col, mix(vec3(.82, .8, .74), vec3(.8, .1, .06), step(bc.y, 640.)), step(abs(bc.x), 9.) * step(520., bc.y) * step(bc.y, 800.));
    // (the room's light law: the lamp by this wall's own way, the dusk along the room, the fire, the shade)
    return rmLit(col, uLampCol * fall * uLampK + vec3(.03, .04, .06), vec3(q.x, q.y, ${e(a.l0)}));
  }
  vec3 rmCeil(vec2 p){
    vec2 v = p - uLampR.xz; float r = length(v);
    float disc = (1. - smoothstep(470., 640., r)) * (.7 + .6 * smoothstep(300., 520., r)) + .5 * exp(-r / 1100.);
    float beam = max(step(abs(p.x + 520.), 150.), step(abs(p.x - 1560.), 150.));
    // (joists run along the room between the beams, one every JOIST.pitch metres: each a little darker than the
    // plaster, a line of shade on the side turned from the lamp)
    float jf = (fract(p.y / ${e(Te.pitch)}) - .5) * ${e(Te.pitch)}, js = sign(p.y - uLampR.z), joist = step(abs(jf), ${e(Te.half)});
    vec3 plaster = vec3(.36, .27, .18) * (1. - ${Te.dark.toFixed(2)} * joist - ${Te.shade.toFixed(2)} * (1. - joist) * (1. - smoothstep(0., 70., jf * js - ${e(Te.half)})) * step(${e(Te.half)}, jf * js));
    return rmLit(mix(plaster, vec3(.14, .08, .04), beam), uLampCol * disc * 1.25 * uLampK + vec3(.12, .15, .16), vec3(p.x, ${e(a.ceilY)}, p.y));
  }
  // THE END WALL OF THE ROOM, beyond the bottle's neck: A WALL OF BOOKS AND THE HEARTH. Shelves of coloured books from
  // the floor to the cornice (rmShelves, folios among them) stand to either side of THE CHIMNEY BREAST, which stands
  // out from them the room's whole height. Below, pale stone in courses round the fire's arched mouth: an architrave
  // round the arch and its keystone, a fluted pilaster at each side, a frieze of dentils, the mantel shelf. On the
  // shelf (HEARTH): a ginger jar in blue and white, two brass candlesticks with lit candles, a pile of three folios.
  // Above it the breast is one great panel of walnut and on it hangs A DARK MIRROR in a gilt frame: old foxed glass
  // that holds only the room itself, dimly (nothing of any other place).
  // THE FIRE: tongues of red gold that climb and gutter on the clock over a bright bed. ITS LIGHT is the room's law
  // (rmFire): strong on the stone round it, a warm wash up the breast and across the mantel's things and on the
  // nearest shelves; each candle adds a small pool of its own (CANDLE)
  vec3 rmEndWall(vec2 q, float t){
    vec3 p = vec3(${e(a.s1)}, q.y, q.x);
    vec2 fq = q - vec2(${e(a.fire[0])}, ${e(a.fire[1])}); float ax = abs(fq.x), ym = fq.y - ${e(F.shelf)};
    vec2 c1 = vec2(fq.x + ${e(F.candle)}, ym - 286.), c2 = vec2(fq.x - ${e(F.candle)}, ym - 286.);
    float f1 = .8 + .2 * sin(uTime * 9.1 + uHearthPh.x), f2 = .8 + .2 * sin(uTime * 7.7 + uHearthPh.y);
    vec3 lit = rmLit(vec3(1.), uLampCol * 1.2 * uLampK, p) + vec3(1., .62, .25) * ${zt.k.toFixed(2)} * (f1 / (1. + dot(c1, c1) / ${e(zt.reach**2)}) + f2 / (1. + dot(c2, c2) / ${e(zt.reach**2)}));
    float glow = exp(-length(fq * vec2(1., .8) - vec2(0., 60.)) / 300.);
    // the shelves of books to either side of the breast, in its shade where they meet it
    vec3 col = rmShelves(q + vec2(4031., 0.), t, lit, clamp(dot(lit, vec3(.5)), 0., 1.), 1.) * (.7 + .3 * smoothstep(${e(F.half)}, ${e(F.half+70)}, ax));
    float breast = step(ax, ${e(F.half)}) * step(q.y, ${e(a.cornice)}), edge = smoothstep(${e(F.half-60)}, ${e(F.half)}, ax);
    // the breast above the mantel: walnut, one great raised panel; the light comes up it from the fire
    vec2 Lf = normalize(vec2(-fq.x, 60. - fq.y) + 1e-3), pn = rmPanel(vec2(fq.x + ${e(F.half)}, ym), vec2(${e(2*F.half)}, ${e(a.cornice-a.fire[1]-F.shelf)}), 110., Lf);
    vec3 wood = vec3(.46, .2, .085) * (.75 + .5 * texture2D(uNoise, q * vec2(.0042, .0005)).r) * (1. - .28 * pn.x) * (1. + .8 * pn.y) * (1. - .35 * edge);
    col = mix(col, wood * lit, breast);
    // THE DARK MIRROR: here its frame and the dark of its old glass; what the glass holds is found where the sight is
    // known (rmTrace): the room itself, mirrored
    vec2 mc = vec2(0., ${e(F.shelf+F.mirror[2])}), mh = vec2(${e(F.mirror[0])}, ${e(F.mirror[1])}), mq = (fq - mc) / mh;
    vec3 fr = rmFrame(fq, mc, mh, 64., Lf);
    vec3 glass = vec3(.03, .03, .026) * (1. + .3 * mq.y);
    col = mix(col, glass, fr.x * breast); col = mix(col, vec3(.95, .66, .22) * (.3 + .6 * fr.z) * (lit * 1.2 + .05), fr.y * breast);
    // the stone below the mantel: courses, the two fluted pilasters and their capitals, the architrave round the arch
    // with a line of shade at its outer edge, the keystone, the frieze of dentils
    vec3 stone = vec3(.62, .56, .46) * (.8 + .35 * texture2D(uNoise, q * .0016).g) * (1. - .35 * edge) * (1. - .18 * step(.5, fract((q.y + 1500.) / 300.)) * step(.94, fract(q.x / 380. + .5 * floor((q.y + 1500.) / 300.))));
    stone *= 1. - .1 * step(.955, fract((q.y + 1500.) / 300.));
    float pil = step(520., ax) * step(ax, 690.) * step(fq.y, 400.);
    stone *= 1. - pil * (.2 * (.5 + .5 * cos((ax - 520.) * .1478)) + .12 * smoothstep(640., 690., ax)) + .12 * step(500., ax) * step(ax, 710.) * step(340., fq.y) * step(fq.y, 400.);
    float arch = 330. - 150. * smoothstep(180., 400., ax), mouth = step(ax, 400.) * step(fq.y, arch);
    float archO = 395. - 150. * smoothstep(215., 470., ax), arc = step(ax, 470.) * step(fq.y, archO) * (1. - mouth);
    stone *= 1. + .15 * arc - .4 * arc * (1. - smoothstep(0., 12., min(470. - ax, archO - fq.y))) + .2 * step(ax, 46. + (fq.y - 330.) * .15) * step(330., fq.y) * step(fq.y, 418.);
    stone *= 1. - step(ax, 790.) * step(400., fq.y) * step(fq.y, 474.) * (.3 * step(.5, fract(fq.x / 76.)) * step(fq.y, 452.) + .1);
    col = mix(col, stone * (lit * 1.1 + vec3(1., .36, .1) * 1.3 * glow), breast * step(ym, 0.));
    // the mantel shelf, proud of the breast: its lip lit from below, a line of shade under it
    col = mix(col, vec3(.74, .68, .56) * (lit * 1.2 + vec3(1., .4, .12) * (.4 + 1.2 * step(fq.y, 500.)) * glow) * (1. - .25 * step(fq.y, 484.)), step(ax, ${e(F.half+70)}) * step(abs(fq.y - 520.), 46.));
    // THE MANTEL'S THINGS, each standing on the shelf: the ginger jar (white porcelain, blue sprigs, two blue bands,
    // a lid), the two brass candlesticks (a spread foot, a turned stem with a knop, a cup, the cream candle, its
    // flame a small leaf of white gold that shivers on the clock), the pile of three folios with gilt across their backs
    { float jx = fq.x + ${e(F.ends)}, jb = length(vec2(jx, ym - 80.) / vec2(72., 80.)), jar = max(step(jb, 1.) * step(0., ym), max(step(abs(jx), 30.) * step(150., ym) * step(ym, 176.), step(length(vec2(jx, ym - 180.) / vec2(42., 17.)), 1.)));
      vec3 jc = mix(vec3(.8, .84, .86), vec3(.1, .2, .52), max(smoothstep(.52, .58, texture2D(uNoise, vec2(jx, ym) * .011 + .3).g), step(abs(abs(ym - 80.) - 62.), 5.)));
      col = mix(col, jc * (lit * 1.5 + vec3(1., .5, .2) * .3 * glow) * (1.15 - .7 * jx * jx / 5184. + .5 * exp(-dot(vec2(jx - 22., ym - 104.), vec2(jx - 22., ym - 104.)) / 300.)), jar);
      float cx = ax - ${e(F.candle)}, fl = mix(f1, f2, step(0., fq.x));
      float stick = max(step(abs(cx), 46. - 30. * smoothstep(0., 30., ym)) * step(0., ym) * step(ym, 30.), max(step(abs(cx), 10. + 12. * exp(-(ym - 92.) * (ym - 92.) / 240.)) * step(30., ym) * step(ym, 152.), step(abs(cx), 27.) * step(152., ym) * step(ym, 166.)));
      col = mix(col, vec3(.95, .62, .2) * (lit * 1.5 + vec3(1., .5, .2) * .5 * glow) * (.55 + 1.1 * exp(-(cx + 5.) * (cx + 5.) / 60.)), stick);
      col = mix(col, vec3(.86, .8, .62) * (lit * 1.4 + vec3(1., .7, .3) * .9 * smoothstep(190., 262., ym)), step(abs(cx), 13.) * step(166., ym) * step(ym, 262.));
      vec2 fv = vec2(cx + 5. * (fl - .8) * (ym - 262.) / 20., ym - 286.) / vec2(11., 26.);
      col += vec3(2.6, 1.7, .6) * fl * (1. - smoothstep(.6, 1., length(fv))) + vec3(1., .55, .2) * .2 * fl * exp(-dot(fv, fv) / 5.) * step(0., ym);
      float px = fq.x - ${e(F.ends)}, pj = floor(ym / 46.), py = ym - pj * 46., ln = 118. - 15. * pj, pxo = px - 9. * (pj - 1.);
      float fo = step(abs(pxo), ln) * step(0., ym) * step(pj, 2.5) * step(3., py);
      vec3 fc = (pj < .5 ? vec3(.5, .1, .07) : pj < 1.5 ? vec3(.09, .3, .17) : vec3(.5, .34, .15)) * (1. - .4 * smoothstep(13., 23., abs(py - 24.)));
      fc = mix(fc, vec3(1., .74, .3) * 1.4, max(rmLine(abs(pxo) - ln * .8, 4., t), rmLine(abs(pxo) - ln * .3, 4., t)));
      col = mix(col, fc * (lit * 1.5 + vec3(1., .5, .2) * .3 * glow), fo); }
    float ton = texture2D(uNoise, vec2(fq.x * .0019 + uRoomPh.y, fq.y * .0011 - uTime * .21)).r, emb = texture2D(uNoise, vec2(fq.x * .008, uTime * .05 + uRoomPh.z)).g;
    float fire = smoothstep(.28, .6, ton * (1.25 - (fq.y + 60.) / 330.) * (1. - smoothstep(200., 380., abs(fq.x)))) * (.75 + .25 * sin(uTime * 7.3 + uRoomPh.z));
    // (the fire lights its own fireback: courses of brick, red in its light, brighter toward the bed, breathing with it)
    float fbk = (1. - .35 * max(step(.9, fract(fq.y / 62.)), step(.94, fract(fq.x / 134. + .5 * floor(fq.y / 62.))))) * (.3 + .7 * (1. - smoothstep(-100., 330., fq.y))) * (.7 + .6 * texture2D(uNoise, vec2(uTime * .045 + uRoomPh.y, .61)).r);
    col = mix(col, vec3(.05, .016, .008) + vec3(.6, .19, .055) * fbk + vec3(2.2, .66, .12) * fire + vec3(1.5, .3, .05) * (.4 + .6 * emb) * (1. - smoothstep(-110., 10., fq.y)), mouth);
    return col;
  }
  // THE WALL BEHIND THE BOTTLE'S BASE: A WALL OF BOOKS. Shelves of coloured books from the floor to the cornice
  // (rmShelves, folios among them), lit by the lamp as the long wall's are at the same way from it and never more than
  // abreast of it. A brass rail runs along them BACK.rail metres up and A LIBRARY LADDER hangs from it (two rails of
  // pale oak that draw together upward, a rung every BACK.rung metres, its shade on the books beside it, away from
  // the lamp). One bay is A PIER OF PANELLED WALNUT and on it hangs THE SMALL LANDSCAPE OF HILLS in its gilt frame: an
  // old painting under dark varnish, a dull amber sky and three brown ranges of hills, a quiet thing of the room;
  // under it a marble bust on a bracket
  vec3 rmBackWall(vec2 q, float t){
    vec2 v = vec2(uLampR.z, uLampR.y) - q, L = normalize(v + 1e-3); float dl = q.x - uLampR.z;
    float fallB = min(1., rmFall(${e((a.lamp[0]-a.s0)**2)} + dl * dl) / rmFall(${e((a.l1-a.lamp[1])**2)}));
    vec3 lit = uLampCol * vec3(${ft.lamp.map(t=>t.toFixed(2)).join(", ")}) * uLampK * fallB + vec3(${ft.cold.map(t=>t.toFixed(2)).join(", ")}) * (.45 + .55 * fallB) + rmFire(vec3(${e(a.s0)}, q.y, q.x));
    vec3 col = rmShelves(q + vec2(${e(a.bay0+24.5*a.bay-N.pier)}, 0.), t, lit, fallB, 1.);
    // the brass rail and the ladder: its shade first, then the oak
    float lx = q.x - ${e(N.pier+N.ladder*a.bay)}, hh = clamp((q.y - ${e(a.floorY)}) / ${e(N.rail-a.floorY)}, 0., 1.), hw = 104. - 22. * hh, up = step(q.y, ${e(N.rail+30)});
    float rails = (1. - smoothstep(9., 12., abs(abs(lx) - hw))) * up, rung = step(abs(lx), hw) * step(abs(fract((q.y - ${e(a.floorY)}) / ${e(N.rung)}) - .5) * ${e(N.rung)}, 8.) * step(q.y, ${e(N.rail-40)});
    float shd = max((1. - smoothstep(9., 30., abs(abs(lx - 34.) - hw))) * up, step(abs(lx - 34.), hw) * step(abs(fract((q.y - ${e(a.floorY)} + 22.) / ${e(N.rung)}) - .5) * ${e(N.rung)}, 9.) * step(q.y, ${e(N.rail-40)}));
    float pier = step(abs(q.x - ${e(N.pier)}), ${e(a.bay/2-14)}) * step(q.y, ${e(a.cornice)});
    col *= 1. - .45 * shd * (1. - pier);
    col = mix(col, vec3(1., .72, .3) * (lit * 1.5 + uLampCol * uLampK * .5 * step(.9, fract(q.x / 251.65))), rmLine(q.y - ${e(N.rail)}, 7., t) * (1. - pier));
    col = mix(col, vec3(.6, .43, .22) * lit * 1.7 * (1. - .3 * rung * step(abs(lx), hw - 12.)), max(rails, rung));
    // the pier and its landscape
    vec2 pn = rmPanel(vec2(q.x - ${e(N.pier-a.bay/2)}, q.y - ${e(a.floorY)}), vec2(${e(a.bay)}, ${e((a.cornice-a.floorY)/3)}), 62., L);
    col = mix(col, vec3(.46, .2, .085) * (.75 + .5 * texture2D(uNoise, q * vec2(.0042, .0005)).r) * (1. - .28 * pn.x) * (1. + .8 * pn.y) * lit * 1.6, pier);
    vec2 c = vec2(${e(N.pier)}, ${e(N.pic[2])}), w = q - c; vec3 fr = rmFrame(q, c, vec2(${e(N.pic[0])}, ${e(N.pic[1])}), ${e(N.frame)}, L);
    float h1 = 14. + 26. * sin(w.x * .016 + 1.) + 11. * sin(w.x * .04 + 2.), h2 = -26. + 30. * sin(w.x * .013 + 3.4) + 9. * sin(w.x * .052), h3 = -72. + 22. * sin(w.x * .01 + .5) + 6. * sin(w.x * .065 + 1.);
    vec3 land = mix(vec3(.4, .31, .16), vec3(.25, .23, .17), smoothstep(-20., 110., w.y));
    land = mix(land, vec3(.2, .19, .13), step(w.y, h1)); land = mix(land, vec3(.14, .13, .08), step(w.y, h2)); land = mix(land, vec3(.08, .07, .04), step(w.y, h3));
    col = mix(col, land * (.85 + .3 * texture2D(uNoise, w * .006).r) * lit * 1.5, fr.x); col = mix(col, vec3(.95, .66, .22) * (.3 + .6 * fr.z) * lit * 1.5, fr.y);
    // under the landscape A BUST OF WHITE MARBLE on a bracket (BUST): a socle, the shoulders, the neck, a plain smooth
    // head with no face; the lamp's side of it the lighter, its shade on the panel beside it
    vec2 b = q - vec2(${e(N.pier)}, ${e(Sa.y)}); float bx = abs(b.x), sd = sign(uLampR.z - ${e(N.pier)});
    float brk = max(step(bx, 150.) * step(-26., b.y) * step(b.y, 0.), step(bx, 60. + b.y * .6) * step(-126., b.y) * step(b.y, -26.));
    col = mix(col, vec3(.4, .2, .09) * lit * (1.9 - .9 * step(b.y, -26.)), brk);
    // (its outline, by the height over the bracket: the socle, the chest widening to the shoulders, the shoulders
    // falling to the neck, the head an egg; each part round across, lighter on the lamp's side, a shade under the chin)
    float bw = b.y < 14. ? 62. : b.y < 60. ? 40. : b.y < 200. ? mix(52., 122., smoothstep(60., 185., b.y)) : b.y < 252. ? mix(122., 30., smoothstep(196., 252., b.y)) : 30.;
    float hd = length(vec2(b.x, b.y - 330.) / vec2(52., 68.)), bust = max(step(bx, bw) * step(0., b.y) * step(b.y, 290.), step(hd, 1.));
    float hs = length(vec2(b.x + sd * 40., b.y - 322.) / vec2(52., 68.)), bsh = max(step(abs(b.x + sd * 40.), bw) * step(0., b.y) * step(b.y, 290.), step(hs, 1.));
    col *= 1. - .3 * bsh * (1. - bust);
    float rnd = b.y > 268. ? sqrt(clamp(1. - hd * hd, 0., 1.)) : sqrt(clamp(1. - b.x * b.x / (bw * bw), 0., 1.)), side = clamp(sd * b.x / max(bw, 1.), -1., 1.);
    vec3 marble = vec3(.74, .72, .66) * (.42 + .5 * rnd + .22 * side) * (1. - .3 * smoothstep(262., 250., b.y) * step(252., b.y) * step(b.y, 275.) - .18 * step(b.y, 60.) * step(14., b.y)) * (.94 + .12 * texture2D(uNoise, b * .013).g);
    col = mix(col, marble * lit * 1.5, bust);
    return col;
  }
  // a box of half sizes h about c, turned by cs (cosine, sine of its yaw): x the way to it (1e9: none), yzw the place
  // of the hit in its own frame
  vec4 rmBox(vec3 o, vec3 d, vec3 c, vec3 h, vec2 cs){
    vec3 oo = o - c, dd = d; oo.xz = vec2(oo.x * cs.x + oo.z * cs.y, oo.z * cs.x - oo.x * cs.y); dd.xz = vec2(d.x * cs.x + d.z * cs.y, d.z * cs.x - d.x * cs.y);
    vec3 sg = mix(vec3(-1.), vec3(1.), step(0., dd)), id = sg / max(abs(dd), vec3(1e-4));
    vec3 t0 = (-sg * h - oo) * id, t1 = (sg * h - oo) * id; float tn = max(max(t0.x, t0.y), t0.z), tf = min(min(t1.x, t1.y), t1.z);
    if (tn > tf || tn < 0.) return vec4(1e9, 0., 0., 0.);
    return vec4(tn, oo + dd * tn);
  }
  // a shut book lying flat: boards of its cover's colour top and bottom, the pale block of its pages between them on
  // the three open sides, its back on the fourth (the side away from the bottle). Returns the colour and the way
  vec4 rmBook(vec3 o, vec3 d, vec3 c, vec3 h, vec2 cs, vec3 cover){
    vec4 b = rmBox(o, d, c, h, cs); if (b.x > 1e8) return vec4(0., 0., 0., 1e9);
    vec3 p = b.yzw, fl = uLampR - c; fl.xz = vec2(fl.x * cs.x + fl.z * cs.y, fl.z * cs.x - fl.x * cs.y);
    vec3 e = abs(p) / h, n = step(vec3(.9995), e) * sign(p), L = normalize(fl - p);
    float board = step(h.y - 9., abs(p.y)), back = step(.9995, e.z) * step(0., p.z), top = step(.9995, e.y);
    float pages = (1. - board) * (1. - back) * (1. - top);
    vec3 col = mix(cover * (.8 + .4 * texture2D(uNoise, p.xz * .0021).g), vec3(.82, .76, .6) * (.72 + .28 * step(.4, fract(p.y / 7.))), pages);
    // the back is leather in raised bands: four gilt lines across it and a dark label with a gilt edge between two of them
    float bx = abs(p.x) / h.x, bf = abs(fract(bx * 3.2 + .5) - .5) / 3.2, band = (1. - smoothstep(.016, .034, bf)) * step(.12, bx);
    col *= 1. - .45 * back * pow(abs(p.y) / h.y, 3.);
    // (between the two middle bands a gilt lozenge, the binder's tool)
    float loz = 1. - smoothstep(.75, 1., abs(p.x) / (h.x * .07) + abs(p.y) / (h.y * .5));
    col = mix(col, vec3(1., .74, .3) * 1.3, back * max(band, loz * step(abs(abs(p.x) / (h.x * .07) + abs(p.y) / (h.y * .5) - .55), .2)) * .9);
    col *= 1. - .3 * back * smoothstep(.02, .05, bf) * (1. - smoothstep(.05, .1, bf)) * step(.12, bx);
    // the page block stands a little in from the boards: a line of shade under the upper board
    col *= 1. - .55 * pages * smoothstep(h.y - 30., h.y - 9., p.y);
    float lam = clamp(dot(n, L), 0., 1.) * 1.5 / (1. + dot(fl - p, fl - p) / 1.6e6);
    // what faces the bottle takes the light the sea and the glass give back: a soft green gold
    return vec4(col * (uLampCol * lam * uLampK + vec3(.04, .06, .1) + uLampCol * vec3(.7, .9, .6) * .4 * uLampK * clamp(n.z, 0., 1.)), b.x);
  }
  // an upright round of radius r about c from y0 to y1: x the way (1e9: none), y the height of the hit, zw its level normal
  vec4 rmCyl(vec3 o, vec3 d, vec2 c, float r, float y0, float y1){
    vec2 oc = o.xz - c; float a = max(dot(d.xz, d.xz), 1e-6), b = dot(oc, d.xz), h = b * b - a * (dot(oc, oc) - r * r);
    if (h < 0.) return vec4(1e9, 0., 0., 0.);
    float t = (-b - sqrt(h)) / a, y = o.y + d.y * t;
    if (t < 0. || y < y0 || y > y1) return vec4(1e9, 0., 0., 0.);
    return vec4(t, y, (oc + d.xz * t) / r);
  }
  // an egg of half sizes R about c: x the way (1e9: none), yzw its normal
  vec4 rmEgg(vec3 o, vec3 d, vec3 c, vec3 R){
    vec3 oo = (o - c) / R, dd = d / R; float a = dot(dd, dd), b = dot(oo, dd), h = b * b - a * (dot(oo, oo) - 1.);
    if (h < 0.) return vec4(1e9, 0., 0., 0.);
    float t = (-b - sqrt(h)) / a; if (t < 0.) return vec4(1e9, 0., 0., 0.);
    return vec4(t, normalize((oo + dd * t) / R));
  }
  // a thin rod from a to b: x metres from the sight to it at their nearest, y the way to there, z the share along it
  vec3 rmRod(vec3 o, vec3 d, vec3 a, vec3 b){
    vec3 ab = b - a, ao = o - a; float abd = dot(ab, d), s = clamp((dot(ao, ab) - dot(ao, d) * abd) / max(dot(ab, ab) - abd * abd, 1e-4), 0., 1.);
    float t = max(dot(a + ab * s - o, d), 0.); return vec3(length(o + d * t - a - ab * s), t, s);
  }
  // brass, lit by the flame: N its normal, p its place
  vec3 rmBrass(vec3 N, vec3 p, vec3 d, float k){
    vec3 L = normalize(uLampR - p), R = reflect(d, N); float nl = clamp(dot(N, L) * .8 + .2, 0., 1.), rl = clamp(dot(R, L), 0., 1.), sp = pow(rl, 18.) + 2.5 * pow(rl, 180.);
    float cold = pow(clamp(dot(R, normalize(vec3(${e(a.win[0])}, ${e(a.win[1])}, ${e(a.l1)}) - p)), 0., 1.), 70.);
    return (vec3(.95, .62, .2) * (.16 + 1.1 * nl) * k + vec3(1., .9, .6) * sp * 1.4) * uLampCol * uLampK + vec3(.02, .035, .06) * (.5 + .5 * N.z) + vec3(.5, .72, 1.) * 1.1 * cold;
  }
  // the lamp's font (FONT): polished brass mirrors the room in broad bands, by the mirrored sight's own lean: the lit
  // ceiling high on it, the room's dark at its waist, the gold of the lamp-lit chart low on it; and its turned beads
  vec3 rmFont(vec3 N, vec3 p, vec3 d){
    vec3 r = reflect(d, N);
    vec3 env = mix(vec3(.9, .7, .34), vec3(.07, .05, .03), smoothstep(-.55, -.12, r.y));
    env = mix(env, vec3(.62, .46, .24), smoothstep(.1, .55, r.y));
    vec3 col = rmBrass(N, p, d, 1.) * .62 + vec3(.95, .66, .26) * env * uLampCol * uLampK * .7;
    float bead = 0., under = 0.;
    ${Ne.beads.map(t=>`{ float g = p.y - (${e(t)}); bead += 1. - smoothstep(${e(Ne.bead*.4)}, ${e(Ne.bead*.9)}, abs(g - ${e(Ne.bead*.5)})); under += 1. - smoothstep(${e(Ne.bead*.3)}, ${e(Ne.bead*.7)}, abs(g + ${e(Ne.bead*.6)})); }`).join(`
    `)}
    return col * (1. - .6 * min(under, 1.)) + vec3(1., .86, .5) * uLampCol * uLampK * .45 * min(bead, 1.) * (.4 + .6 * clamp(N.y + .5, 0., 1.));
  }`,Ta=`
  vec3 rmTrace(vec3 o, vec3 d){
    vec3 sg = step(0., d), tt = (mix(vec3(${e(a.s0)}, ${e(a.floorY)}, ${e(a.l0)}), vec3(${e(a.s1)}, ${e(a.ceilY)}, ${e(a.l1)}), sg) - o) * (sg * 2. - 1.) / max(abs(d), vec3(1e-4));
    float t = min(min(tt.x, tt.y), tt.z); vec3 p = o + d * t, col;
    if (tt.z <= t) { if (d.z > 0.) col = rmDarkWall(p.xy, t); else col = rmLampWall(p.xy); }
    else if (tt.y <= t) { if (d.y > 0.) col = rmCeil(p.xz); else col = vec3(.012, .01, .008); }
    else { if (d.x < 0.) col = rmBackWall(p.zy, t); else {
      col = rmEndWall(p.zy, t);
      // THE DARK MIRROR HOLDS THE ROOM: the sight, turned back by its glass, goes on to the room's own shell (the ceiling
      // and its lamp-lit round, the walls of books); the old glass gives back MIRROR.k of it, less where it is foxed at
      // its edges
      vec2 mq = (p.zy - vec2(${e(a.fire[0])}, ${e(a.fire[1]+F.shelf+F.mirror[2])})) / vec2(${e(F.mirror[0])}, ${e(F.mirror[1])});
      if (max(abs(mq.x), abs(mq.y)) < 1.) {
        vec3 md = vec3(-d.x, d.y, d.z), s2 = step(0., md), t2 = (mix(vec3(${e(a.s0)}, ${e(a.floorY)}, ${e(a.l0)}), vec3(${e(a.s1)}, ${e(a.ceilY)}, ${e(a.l1)}), s2) - p) * (s2 * 2. - 1.) / max(abs(md), vec3(1e-4));
        float tm = min(min(t2.x, t2.y), t2.z); vec3 pm = p + md * tm, held = vec3(.012, .01, .008);
        if (t2.z <= tm) { if (md.z > 0.) held = rmDarkWall(pm.xy, t + tm); else held = rmLampWall(pm.xy); }
        else if (t2.y <= tm) { if (md.y > 0.) held = rmCeil(pm.xz); }
        else held = rmBackWall(pm.zy, t + tm);
        col += held * vec3(.8, .86, .78) * ${_t.k.toFixed(2)} * (1. - ${_t.fox.toFixed(2)} * smoothstep(.6, 1., max(abs(mq.x), abs(mq.y))) * smoothstep(.3, .6, texture2D(uNoise, p.zy * .004).g));
      } } }
    // (every wall and the ceiling carry the room's light law in their own light: rmLit, the shelves' law; the dusk
    // below is for the floor and for what stands in the room)
    float tw = t, own = (tt.z > t && tt.y <= t && d.y <= 0.) ? 0. : 1.;
    float tb = (${e(a.tableY)} - o.y) / min(d.y, -1e-4); vec2 q = o.xz + d.xz * tb;
    if (d.y < 0. && tb > 0. && tb < t && q.x > ${e(a.table[0])} && q.x < ${e(a.table[1])} && q.y > ${e(a.table[2])} && q.y < ${e(a.table[3])}) { t = tb; col = rmTable(q, tb); }
    vec3 amb = vec3(.03, .05, .09);
    // THE PILE OF THREE GREAT BOOKS (oxblood, night blue, bottle green), their backs toward the bottle; the two upper
    // ones stand back from the lowest one's edge, each laid a little askew
    vec4 bk = rmBook(o, d, vec3(-330. + ${e(ve)}, -115., -690.), vec3(430., 95., 300.), vec2(.9988, .05), vec3(.1, .4, .2)); if (bk.w < t) { t = bk.w; col = bk.rgb; }
    bk = rmBook(o, d, vec3(-350. + ${e(ve)}, 60., -760.), vec3(390., 80., 230.), vec2(.9982, -.06), vec3(.12, .22, .56)); if (bk.w < t) { t = bk.w; col = bk.rgb; }
    bk = rmBook(o, d, vec3(-310. + ${e(ve)}, 212., -762.), vec3(340., 72., 230.), vec2(.9968, .08), vec3(.66, .1, .07)); if (bk.w < t) { t = bk.w; col = bk.rgb; }
    // its ribbon: red silk out of the top book's pages, down over the backs onto the lowest book
    vec4 rb = rmBox(o, d, vec3(-190. + ${e(ve)}, 128., -521.), vec3(15., 152., 3.), vec2(1., 0.));
    if (rb.x < t) { t = rb.x; col = vec3(.85, .08, .07) * (.75 + .25 * sin(rb.z * .09)) * (uLampCol * .7 * uLampK + amb * 2.); }
    // THE MAGNIFYING GLASS lying flat on the lowest book's edge: a brass ring round a lens, a turned walnut handle
    { float tm = (-16. - o.y) / min(d.y, -1e-4); vec2 mq = o.xz + d.xz * tm - vec2(-600. + ${e(ve)}, -455.); float mr = length(mq);
      if (d.y < 0. && tm > 0. && tm < t && mr < 62.) { t = tm; col = mr > 50. ? rmBrass(vec3(0., 1., 0.), o + d * tm, d, 1.6) : mix(col, vec3(.6, .75, .7), .25) * 1.5 + uLampCol * uLampK * .5 * exp(-dot(mq - vec2(14., 10.), mq - vec2(14., 10.)) / 260.); }
      vec3 rh2 = rmRod(o, d, vec3(-540. + ${e(ve)}, -8., -447.), vec3(-390. + ${e(ve)}, -8., -430.)); float wh = max(11., rh2.y * .0022);
      col = mix(col, vec3(.3, .15, .06) * (uLampCol * .9 * uLampK + amb * 2.), (1. - smoothstep(wh * .8, wh * 1.2, rh2.x)) * step(rh2.y, t)); }
    // THE ROLLED CHART leaning on that edge: cream paper wound on itself, tied with a red ribbon at its middle
    { vec3 rr2 = rmRod(o, d, vec3(-905. + ${e(ve)}, -160., -560.), vec3(-745. + ${e(ve)}, 330., -650.)); float wr = max(56., rr2.y * .0022), kr = (1. - smoothstep(wr * .92, wr * 1.08, rr2.x)) * step(rr2.y, t);
      vec3 pc = vec3(.86, .77, .54) * (.35 + .65 * sqrt(clamp(1. - rr2.x * rr2.x / (wr * wr), 0., 1.))) * (1. - .45 * step(.96, rr2.z) * step(rr2.x, wr * .7) - .3 * step(rr2.z, .02));
      pc = mix(pc, vec3(.85, .08, .07), step(abs(rr2.z - .45), .045));
      col = mix(col, pc * (uLampCol * .85 * uLampK + amb * 2.), kr); if (kr > .5) t = min(t, rr2.y); }
    // THE GLOBE IN ITS STAND: a varnished ball of parchment seas and brown lands, lines of the degrees drawn fine on it,
    // its pole leaning; a brass meridian ring round it, a turned pillar, a round foot
    { vec3 gc = vec3(${e(a.globe[0])}, ${e(a.globe[1])}, ${e(a.globe[2])});
      vec4 cyG = rmCyl(o, d, gc.xz, 200., ${e(a.tableY)}, -168.); if (cyG.x < t) { t = cyG.x; col = vec3(.3, .15, .06) * (uLampCol * (.3 + .7 * clamp(dot(vec3(cyG.z, 0., cyG.w), normalize(uLampR - o - d * t)), 0., 1.)) * uLampK + amb * 2.); }
      float tg = (-168. - o.y) / min(d.y, -1e-4); vec2 gq = o.xz + d.xz * tg - gc.xz; if (d.y < 0. && tg > 0. && tg < t && dot(gq, gq) < 40000.) { t = tg; col = vec3(.34, .18, .07) * (uLampCol * .8 * uLampK + amb * 2.); }
      cyG = rmCyl(o, d, gc.xz, 40., -168., gc.y - ${e(a.globe[3]-6)}); if (cyG.x < t) { t = cyG.x; col = rmBrass(vec3(cyG.z, 0., cyG.w), o + d * t, d, 1.); }
      float tp = (gc.z - o.z) / (abs(d.z) > 1e-4 ? d.z : 1e-4); vec2 pq = o.xy + d.xy * tp - gc.xy; float pr = length(pq);
      if (tp > 0. && tp < t && pr > ${e(a.globe[3]+12)} && pr < ${e(a.globe[3]+40)}) { t = tp; col = rmBrass(normalize(vec3(pq, .6 * sign(-d.z))), o + d * tp, d, 1.4) * (.8 + .2 * step(.5, fract(atan(pq.y, pq.x) * 5.73))); }
      vec4 eg0 = rmEgg(o, d, gc, vec3(${e(a.globe[3])}));
      if (eg0.x < t) { t = eg0.x; vec3 n = eg0.yzw, pp = o + d * t, m = vec3(n.x * .92 - n.y * .39, n.x * .39 + n.y * .92, n.z);
        float lon = atan(m.z, m.x), lat = asin(clamp(m.y, -1., 1.));
        float land = smoothstep(.5, .54, texture2D(uNoise, vec2(lon * .16 + .2, lat * .32 + .5)).r * .7 + texture2D(uNoise, vec2(lon * .5, lat * .9)).g * .3);
        float gr = max(rmLine((abs(fract(lon / .5236 + .5) - .5)) * .5236 * ${e(a.globe[3])} * cos(lat), 2.2, t), rmLine((abs(fract(lat / .5236 + .5) - .5)) * .5236 * ${e(a.globe[3])}, 2.2, t));
        vec3 gcol = mix(vec3(.78, .76, .56), vec3(.5, .34, .15), land) * (1. - .45 * gr);
        vec3 Lg = normalize(uLampR - pp); float nl = clamp(dot(n, Lg) * .75 + .25, 0., 1.);
        col = gcol * (uLampCol * nl * 1.25 * uLampK + amb * 2.5 + vec3(${a.shade.map(t=>t.toFixed(3)).join(", ")}) * .7) + uLampCol * uLampK * 1.2 * pow(clamp(dot(reflect(d, n), Lg), 0., 1.), 60.) + vec3(.5, .7, 1.) * .5 * pow(clamp(dot(reflect(d, n), normalize(vec3(${e(a.win[0])}, ${e(a.win[1])}, ${e(a.l1)}) - pp)), 0., 1.), 40.); } }
    // THE INKWELL OF CUT GLASS: a squat round cut in upright facets, dark with ink to its shoulder, a brass cap; each
    // facet takes the lamp as one hard glint; the quill standing in it
    vec3 iw = vec3(${e(a.ink[0])}, 0., ${e(a.ink[1])});
    vec4 cy = rmCyl(o, d, iw.xz, 150., ${e(a.tableY)}, 70.);
    if (cy.x < t) { t = cy.x; vec3 pp = o + d * t; float fa = atan(cy.w, cy.z), fi = (floor(fa / .5236) + .5) * .5236, fe = abs(fract(fa / .5236) - .5) * 2.;
      vec3 N = vec3(cos(fi), .12, sin(fi)), Li = normalize(uLampR - pp); float ink = 1. - smoothstep(-20., 10., pp.y);
      col = mix(vec3(.3, .5, .46) * (.35 + .5 * fe), vec3(.015, .02, .06), ink * .9) * (uLampCol * uLampK + amb * 3.)
        + uLampCol * uLampK * (1.6 * pow(clamp(dot(reflect(d, N), Li), 0., 1.), 24.) + .35 * smoothstep(.8, 1., fe))
        + vec3(.5, .7, 1.) * .4 * pow(clamp(dot(reflect(d, N), normalize(vec3(${e(a.win[0])}, ${e(a.win[1])}, ${e(a.l1)}) - pp)), 0., 1.), 12.); }
    float tc = (70. - o.y) / min(d.y, -1e-4); vec2 cq = o.xz + d.xz * tc - iw.xz;
    // (a thing is seen only before the sight's own beginning: from a place of the glass below the inkwell's top, a
    // falling sight meets that top only backward, which is no meeting)
    if (d.y < 0. && tc > 0. && tc < t && dot(cq, cq) < 22500.) { t = tc; col = vec3(.2, .34, .32) * (uLampCol * .6 * uLampK + amb * 2.); }
    cy = rmCyl(o, d, iw.xz, 84., 70., 150.); if (cy.x < t) { t = cy.x; col = rmBrass(vec3(cy.z, 0., cy.w), o + d * t, d, 1.); }
    vec3 rq = rmRod(o, d, vec3(iw.x, 130., iw.z), vec3(iw.x + 250., 940., iw.z - 120.));
    float vane = 7. + 84. * pow(clamp(sin(3.1416 * clamp((rq.z - .2) / .8, 0., 1.)), 0., 1.), .6), wq = max(vane, rq.y * .0022);
    float kq = (1. - smoothstep(wq * .8, wq * 1.2, rq.x)) * step(rq.y, t);
    col = mix(col, vec3(.9, .87, .78) * (.72 + .28 * smoothstep(.0, .5, rq.x / wq)) * (1. - .12 * step(.6, fract(rq.z * 23. + rq.x / wq * 1.5))) * (uLampCol * .6 * uLampK + amb * 2.), kq);
    // THE DIVIDERS: two brass legs standing on their points, joined under a round knob
    vec3 ap = vec3(${e(a.dividers[0])}, 1050., ${e(a.dividers[1])}), ra = rmRod(o, d, ap, ap + vec3(-112., ${e(a.tableY-1050)}, -55.)), rb2 = rmRod(o, d, ap, ap + vec3(115., ${e(a.tableY-1050)}, 50.)), rk = rmRod(o, d, ap, ap + vec3(0., 90., 0.));
    float wa = max(mix(30., 6., ra.z), ra.y * .0022), wb = max(mix(30., 6., rb2.z), rb2.y * .0022);
    float kd = max(max((1. - smoothstep(wa * .8, wa * 1.2, ra.x)) * step(ra.y, t), (1. - smoothstep(wb * .8, wb * 1.2, rb2.x)) * step(rb2.y, t)), (1. - smoothstep(46., 54., rk.x)) * step(rk.y, t));
    col = mix(col, vec3(.98, .68, .24) * (uLampCol * (.45 + .65 * smoothstep(-.3, .6, ra.x / wa - rb2.x / wb)) * uLampK + amb), kd);
    // THE ROOM'S DUSK (ROOM.dusk, ROOM.fall), by the place the sight has met: on the table and its things and on the floor
    { float ds = o.x + d.x * t - uLampR.x, k = ${a.dusk.toFixed(2)} + ${(1-a.dusk).toFixed(2)} * rmFall(ds * ds);
      if (t < tw - .01 || own < .5) col *= k; }
    // THE LAMP: the brass font like a hill, its bright rim, the collar with its slots, the gallery that holds the glass
    vec3 lp = vec3(uLampR.x, 0., uLampR.z);
    vec4 eg = rmEgg(o, d, lp + vec3(0., -60., 0.), vec3(310., 200., 310.)); if (eg.x < t) { t = eg.x; col = rmFont(eg.yzw, o + d * t, d); }
    cy = rmCyl(o, d, lp.xz, 128., 118., 172.); if (cy.x < t) { t = cy.x; col = rmBrass(vec3(cy.z, .35, cy.w), o + d * t, d, 1.5) + uLampCol * .55 * uLampK * smoothstep(150., 170., cy.y); }
    cy = rmCyl(o, d, lp.xz, 95., 172., 300.); if (cy.x < t) { t = cy.x; col = rmBrass(vec3(cy.z, 0., cy.w), o + d * t, d, .8) * (1. - .7 * step(.6, fract(atan(cy.w, cy.z) * 3.82)) * step(200., cy.y) * step(cy.y, 270.)); }
    cy = rmCyl(o, d, lp.xz, 132., 300., 336.); if (cy.x < t) { t = cy.x; col = rmBrass(vec3(cy.z, .2, cy.w), o + d * t, d, 1.3); }
    // the burner's milled wheel, on its stem at the side: a brass button, its rim cut in fine teeth
    { vec3 wc = lp + vec3(165., 236., 70.); vec4 ew = rmEgg(o, d, wc, vec3(54., 54., 22.));
      if (ew.x < t) { t = ew.x; vec3 pw = o + d * t - wc; col = rmBrass(ew.yzw, o + d * t, d, 1.3) * (1. - .55 * step(.5, fract(atan(pw.y, pw.x + 1e-4) * 4.14)) * smoothstep(36., 46., length(pw.xy))); }
      vec3 rs2 = rmRod(o, d, wc, lp + vec3(80., 236., 30.)); float ws = max(10., rs2.y * .0022);
      col = mix(col, vec3(.8, .52, .18) * uLampCol * uLampK, (1. - smoothstep(ws * .8, ws * 1.2, rs2.x)) * step(rs2.y, t)); }
    // the chimney and the flame, on the upright plane through the lamp's own axis that faces the eye
    vec2 oc = o.xz - lp.xz; float a = max(dot(d.xz, d.xz), 1e-6), tl = -dot(oc, d.xz) / a, lat = (oc.x * d.z - oc.y * d.x) / sqrt(a), yl = o.y + d.y * tl;
    float seen = step(0., tl) * step(tl, t), rc = 86. + 52. * exp(-(yl - 470.) * (yl - 470.) / 52000.), u = lat / rc, inCh = step(336., yl) * step(yl, ${e(a.chimneyTop)}) * step(abs(u), 1.) * seen;
    col *= 1. - .3 * inCh * smoothstep(.75, 1., abs(u));
    col += uLampCol * uLampK * inCh * (.05 + .2 * exp(-(u + .5) * (u + .5) / .03) + .1 * exp(-(u - .62) * (u - .62) / .02) + .16 * smoothstep(.8, 1., abs(u)) + .3 * smoothstep(${e(a.chimneyTop-26)}, ${e(a.chimneyTop-6)}, yl));
    float H = ${e(a.flameH)} * uFlame.z, yy = clamp((yl - (uLampR.y - ${e(a.flameH/2)})) / H, 0., 1.);
    float xo = lat - ${e(a.flameW)} * (2.2 * uFlame.x * yy * yy + .5 * uFlame.y * yy * sin(yy * 9. - uTime * 17.));
    float w = ${e(a.flameW)} * (.05 + 1.9 * sqrt(yy) * pow(clamp(1. - yy, 0., 1.), .6)), ends = smoothstep(0., .04, yy) * (1. - smoothstep(.93, 1., yy));
    float core = (1. - smoothstep(w * .3, w * .78, abs(xo))) * ends, mantle = (1. - smoothstep(w * .7, w * 1.3, abs(xo))) * ends;
    float rr = length(vec2(lat, yl - uLampR.y));
    col = mix(col, vec3(0.), max(core, mantle * .8) * seen);
    col += (uLampHeart * core * (1.1 + .5 * yy) + uLampCol * vec3(1., .42, .08) * 1.5 * max(mantle - core * .8, 0.) + uLampCol * vec3(1., .8, .5) * (.3 * exp(-rr / 90.) + .08 * exp(-rr / 330.))) * seen * uLampK;
    return col;
  }`,Na=`
  uniform vec3 uMid, uAxis, uSide, uLamp, uLampCol, uLampHeart, uGlassLit, uGlassDeep, uFogCol, uSeaCol;
  uniform float uLampK, uPhiL, uSeedK, uFogDen, uDay;
  uniform vec4 uMoth;
  uniform sampler2D uNoise;`,St={low:2.5,high:9},Yt={low:6,high:30},K={bend:.003,wave:.009,end:.09,cell:58,seed:[3,11],win:[34,80],bloom:[34,24],line:[85,6],canvas:[0,75,-66]},j={wall:6,deep:.5,own:.06,line:1/6,heel:3,gold:.9,cold:.6},Ve={col:[.78,.63,.43],wax:[.4,.05,.03],rim:7,lit:.45},De={depth:.6,mirror:.2,hi:.3,at:.86,wide:.07,round:.55},Re={over:.22,air:.012,fade:.4,bar:.5,bow:.12},Ut=(t,o,i)=>[t*G/Math.hypot(o,i-L.y),Math.atan2(o,i-L.y)],wt={lamp:Ut(a.lamp[0],a.lamp[1],a.flameY),win:Ut(a.win[0],a.l1,a.win[1])},Da=`
  varying vec3 vW, vN;
  // (sea: the share of the sea that lies before this place of the wall; the neck holds none and mirrors its own dark glass)
  vec3 mirrorOf(vec3 r, vec3 w, float sea){
    float amb = pow(clamp(dot(r, normalize(vec3(${K.canvas.map(e).join(", ")}) - w)), 0., 1.), 10.);
    return mix(uGlassDeep * .45 * (.4 + .6 * sea), uSeaCol * .85, (1. - smoothstep(-.03, .1, r.y)) * sea) + vec3(1., .66, .25) * amb * .7 * sea;
  }
  // the room in small, as a seed of the glass turns it over: the flame a bright speck, the pale table and the dark room changed places
  vec3 roomSmall(vec3 d, vec3 w){
    float lam = clamp(dot(d, normalize(uLamp - w)), 0., 1.);
    return mix(vec3(.5, .42, .24), vec3(.03, .06, .05), smoothstep(-.25, .15, d.y)) * (.4 + .6 * uLampK) + (uLampHeart * pow(lam, 260.) * 2.5 + uLampCol * pow(lam, 14.) * .5) * uLampK;
  }
  // THE MOTH (MOTH in the part: its measures and its shade): a great moth AT REST on the OUTSIDE of the glass, seen
  // from below: a furred brown body, six feet on the glass, two feathered feelers, and two pairs of wings held as a
  // resting moth holds them: the fore wings swept back in one broad arrowhead, the hind wings showing between them and
  // the body. Cream and brown: brown at the root, two dark wavy lines across, a dark spot, a pale outer band with a
  // row of dots, a scalloped fringe. The wings stir a little and slowly on the world clock (MOTH.stir, MOTH.flap).
  // q: metres from its middle over its length (x toward its head, along the bottle). uMoth: where it is along the
  // bottle, how far its wings are stirred open (0 to 1), its shiver (radians).
  float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)); }
  // a wing as it lies on the glass, swung to an angle about its root: x cover, y the way along it, z across it.
  // tri 0: a round lobe (a hind wing); tri 1: narrow at the root, broad at its outer edge, the tip rounded (a fore wing)
  vec3 wingAt(vec2 p, float ang, float len, float wide, float tri){
    float ca = cos(ang), sa = sin(ang); vec2 w = vec2(ca * p.x + sa * p.y, -sa * p.x + ca * p.y) / vec2(len, wide);
    float t = clamp(w.x, 0., 1.), lobe = pow(max(sin(3.14159 * pow(t, .62)), 0.), .7), e = max((t - .7) / .3, 0.);
    float hw = mix(lobe, (.2 + .8 * pow(t, .85)) * sqrt(max(1. - e * e, 0.)) * smoothstep(0., .05, t), tri) + 1e-3;
    return vec3(step(0., w.x) * step(w.x, 1.) * (1. - smoothstep(hw - .06, hw, abs(w.y))), t, w.y / hw);
  }
  vec4 mothAt(vec2 q){
    vec2 p = vec2(q.x, abs(q.y)); float open = uMoth.y, sh = uMoth.z;
    float fur = texture2D(uNoise, q * 7.).g, dust = texture2D(uNoise, q * 2.3 + .4).r, scale = texture2D(uNoise, q * 19.).b;
    vec3 fw = wingAt(p - vec2(.2, .05), 2.62 - ${Ee.stir.toFixed(2)} * open + sh, .62, .2, 1.), hw = wingAt(p - vec2(.08, .04), 2.95 - ${(Ee.stir*.6).toFixed(3)} * open + sh * .7, .46, .2, 0.);
    vec3 cream = vec3(.6, .5, .33), brown = vec3(.25, .16, .09);
    // the fore wing: brown at its root, two dark wavy lines, the spot between them, the pale band, its dots, the fringe
    float wav = .035 * sin(fw.z * 7.) + .03 * (dust - .5);
    float l1 = 1. - smoothstep(.012, .04, abs(fw.y - .36 - wav)), l2 = 1. - smoothstep(.012, .04, abs(fw.y - .64 + wav * 1.4 - .05 * fw.z * fw.z));
    float spot = 1. - smoothstep(.6, 1., length(vec2((fw.y - .5) / .05, (fw.z + .25) / .22)));
    float dots = (1. - smoothstep(.2, .45, length(vec2((fw.y - .86) / .05, fract(fw.z * 3.5) - .5)))) * step(abs(fw.z), .95);
    float fringe = smoothstep(.93, .97, fw.y) * (.5 + .5 * step(.5, fract(fw.z * 9.)));
    float vein = 1. - smoothstep(0., .12, abs(fract(fw.z * 3.5 + .5) - .5));
    vec3 fcol = mix(brown * 1.3, cream, smoothstep(.14, .48, fw.y) * (.45 + .55 * smoothstep(.64, .74, fw.y)));
    fcol *= (.72 + .5 * scale) * (.85 + .3 * dust) * (1. - .16 * vein * smoothstep(.2, .5, fw.y)) * (1. - .3 * smoothstep(.7, 1., abs(fw.z)));
    fcol = mix(fcol, brown * .7, max(max(l1, l2) * .85, max(spot * .9, dots * .7)));
    fcol = mix(fcol, cream * 1.1, fringe * .6);
    // the hind wing lies under the fore wing: paler and greyer, in its shade, one curved line and a brown border
    vec3 hcol = mix(cream * vec3(.86, .88, .9), brown, smoothstep(.72, .98, hw.y) * .7) * (.55 + .4 * scale) * (1. - .3 * smoothstep(.6, 1., abs(hw.z)));
    hcol = mix(hcol, brown * .8, (1. - smoothstep(.015, .045, abs(hw.y - .58 - .06 * hw.z * hw.z))) * .7);
    vec4 o = vec4(hcol, hw.x * .92);
    o = mix(o, vec4(fcol, .95), fw.x);
    // (each leg bends once at its knee; its foot is a small pad on the glass)
    float leg = min(min(min(sdSeg(p, vec2(.22, .05), vec2(.29, .13)), sdSeg(p, vec2(.29, .13), vec2(.36, .12))), min(sdSeg(p, vec2(.16, .06), vec2(.19, .15)), sdSeg(p, vec2(.19, .15), vec2(.15, .2)))), min(sdSeg(p, vec2(.1, .05), vec2(.06, .13)), sdSeg(p, vec2(.06, .13), vec2(-.02, .15))));
    float foot = min(min(length(p - vec2(.36, .12)), length(p - vec2(.15, .2))), length(p - vec2(-.02, .15)));
    // (a feeler: a fine curved stem from the head, feathered to either hand along it)
    vec2 fa = vec2(.35, .02), fb = vec2(.56, .2); float ft = clamp(dot(p - fa, fb - fa) / dot(fb - fa, fb - fa), 0., 1.);
    vec2 pf = p + vec2(-.03, .03) * sin(3.14159 * ft);
    float feel = sdSeg(pf, fa, fb) - .024 * step(.45, fract(ft * 18.)) * sin(3.14159 * ft);
    float lines = max(1. - smoothstep(.006, .011, leg), max(1. - smoothstep(.008, .013, foot), 1. - smoothstep(.005, .009, feel)));
    o = mix(o, vec4(.1, .075, .05, 1.), lines);
    // the body: a long ringed abdomen, a broad thorax in thick fur (its edge is the fur's own), a small head, two dark eyes
    float abd = length((p - vec2(-.17, 0.)) / vec2(.27, .065 * (1. - .5 * (1. - smoothstep(-.44, -.17, q.x))))), tho = length((p - vec2(.17, 0.)) / vec2(.14, .105)), hd = length((p - vec2(.31, 0.)) / vec2(.055, .05));
    float tuft = texture2D(uNoise, q * 31.).r;
    float bd = min(abd, min(tho, hd)), body = 1. - smoothstep(.78 - .32 * fur - .18 * tuft * step(tho, abd), 1.04, bd);
    vec3 bcol = mix(brown * 1.25, cream * .85, smoothstep(.45, .8, fur) * .6) * (.6 + .7 * tuft) * (1. - .3 * step(.5, fract(q.x * 24.)) * step(abd, 1.)) * (.55 + .45 * (1. - smoothstep(.3, 1., bd)));
    bcol = mix(bcol, vec3(.05, .04, .03), 1. - smoothstep(.012, .02, length(p - vec2(.325, .032))));
    return mix(o, vec4(bcol, 1.), body);
  }
  void main(){
    vec3 rel = vW - uMid; float s = dot(rel, uAxis); vec3 rad = rel - uAxis * s; float rax = length(rad);
    float rs = dot(rad, uSide), phi = atan(rs, rad.y + 1e-5), rr = clamp(rax / 250., 0., 1.);
    vec3 N = normalize(vN), V = cameraPosition - vW; float dist = max(length(V), 1e-3); vec3 D = -V / dist;
    float c = abs(dot(D, N)), graze = 1. / max(c, .22);
    float dome = step(s, ${(ae+de.push+1).toFixed(1)}) * (1. - smoothstep(244., 249.8, rax)), cork = step(${(x.end-13).toFixed(1)}, s) * step(rax, ${(x.r-.4).toFixed(1)});
    float along = (1. - dome) * (1. - cork);
    // the glass is uneven: slow swells of its thickness (n1) and a finer ripple on them (n2); t1, t2: the wall's own two ways
    vec2 gu = vec2(s, phi * 250.) / 360.; vec4 n1 = texture2D(uNoise, gu), n2 = texture2D(uNoise, gu * 3.1 + .37);
    vec2 g = vec2(sin(s * .023 + 2.2 * sin(phi * 1.7 + .4)), sin(phi * 2.1 + s * .008 + 1.1));
    // where the glass bends a sight: a few slow waves of the long wall, and the wall's own turn at shoulder, neck and base
    float turnIn = max(smoothstep(${e(x.s0-70)}, ${e(x.s0+50)}, s), max(dome, 1. - smoothstep(${e(ae+de.push)}, ${e(ae+de.push+j.heel*j.wall)}, s)));
    float wavy = smoothstep(.55, 1., sin(s * .0105 + 1.9) * sin(phi * 1.3 + .7 + s * .002));
    float bendK = ${K.bend.toFixed(4)} + ${K.wave.toFixed(3)} * wavy;
    // (an end's thick glass is one lens: it draws the sight toward the bottle's axis, evenly, by GLASS.end at the
    // wall's own radius and by none at the end's middle: one slow bending across the whole end. It comes on slowly
    // where the long wall nears the shoulder; on the base wall it goes out again across the rim's own thickness, so
    // what is seen is whole across the rim)
    float lens = ${K.end.toFixed(3)} * max(smoothstep(${e(x.s0-70)}, ${e(x.s0+50)}, s), dome * (1. - smoothstep(${e(G-j.heel*j.wall)}, ${e(G-1)}, rax)));
    vec3 t1 = uAxis - N * dot(uAxis, N); t1 = dot(t1, t1) > .003 ? normalize(t1) : normalize(cross(N, uSide)); vec3 t2 = cross(N, t1);
    // (a) the bent sight
    float lift = ${a.lift.toFixed(2)} * (1. - smoothstep(-20., ${e(a.liftTop)}, vW.y));
    vec3 d1 = normalize(D + (t1 * g.x + t2 * g.y) * bendK * min(graze, 2.5) - vec3(0., lift, 0.) - rad / 250. * lens), o = rmP(vW);
    vec3 room = rmTrace(o, rmD(d1));
    // the moth stands between the room and the glass (on the body of the bottle only), lit by the lamp it clings toward
    float mothOn = 0.;
    { vec2 mq = vec2(s - uMoth.x, (phi - (${(-ut.up*Math.PI/180).toFixed(4)})) * 250.) / ${e(Ee.len)};
      if (max(abs(mq.x), abs(mq.y)) < 1.1 && along > .5) { vec4 mo = mothAt(mq); mothOn = mo.a; room = mix(room, mo.rgb * (uLampCol * .5 * uLampK + vec3(.1, .14, .12)), mo.a); } }
    // (b) the tint, by the depth of glass crossed (the glass is thicker here and thinner there: n1)
    // (AT AN END THE GLASS IS CLEAR, END: the sight crosses END.depth of the long wall's depth of glass, whatever its
    // lean, and THICK.deep more of that toward the rim: what is seen through an end keeps two thirds of its light
    // and colour or more, in every part of it)
    float endDeep = ${De.depth.toFixed(2)} * (1. + ${j.deep.toFixed(2)} * max(dome * smoothstep(.55, .95, rr), turnIn * (1. - dome)));
    vec3 tint = exp(-vec3(.3, .03, .17) * (.7 + .5 * n1.b) * mix(1. / max(c, .3), endDeep, turnIn));
    // the glass's own body, lit where the wall faces the lamp from outside; dust on it there, and three fingermarks
    vec3 Lw = normalize(uLamp - vW); float toward = clamp(dot(-N, Lw), 0., 1.), rake = toward * (1. - toward) * 4.;
    // (the lamp's light on the glass itself falls by the wall's own way from the lamp along the bottle)
    float fallS = rmFall((s - uLampR.x) * (s - uLampR.x));
    // (the ends add THICK.own of the glass's own colour over the long wall's, and a third of that of its lit colour: no veil)
    vec3 body = uGlassDeep * (.1 + ${j.own.toFixed(3)} * turnIn) + (uLampCol * vec3(.8, .9, .4) * .06 * pow(toward, 1.5) * (.7 + .6 * n1.b) + uGlassLit * (.03 + ${(j.own/3).toFixed(3)} * turnIn) * (.5 + .5 * toward)) * uLampK * (1. + .6 * uDay) * (.25 + .75 * fallS);
    float dust = smoothstep(.62, .9, texture2D(uNoise, gu * 23.).g) * (.4 + .6 * n2.g);
    float mark = 0.;
    ${[[-160,-1.2,.3],[130,-.72,1.9],[340,-1.33,4]].map(([t,o,i])=>`{ vec2 mq = vec2(s - (${e(t)}), (phi - (${o.toFixed(2)})) * 250.) / vec2(26., 19.); float ml = length(mq); mark += (1. - smoothstep(.75, 1., ml)) * (.5 + .5 * sin((mq.x + .45 * mq.y * mq.y) * 34. + ${i.toFixed(1)})); }`).join(`
    `)}
    body += uLampCol * (.1 * dust + .06 * mark) * rake * uLampK * along;
    // (the long wall goes dark where it is seen edge on; an end does not: its glass is clear at every lean)
    vec3 col = (room * tint + body) * mix(smoothstep(0., .13, c), 1., turnIn);
    // (e) SEEDS: one to a cell of the wall, GLASS.cell metres square (on the base wall the cells lie across it)
    vec2 sc = (dome > .5 ? vec2(rs, rad.y) : vec2(s, phi * 250.)) / ${e(K.cell)}, ci = floor(sc);
    float hR = rh(ci + 3.7), R = ${e(K.seed[0])} + ${e(K.seed[1]-K.seed[0])} * hR * hR, mg = (R + .5) / ${e(K.cell)};
    vec2 off = (sc - ci - mg - vec2(rh(ci), rh(ci + 7.3)) * (1. - 2. * mg)) * ${e(K.cell)} * vec2(1., dome > .5 ? 1. : rr) / R;
    float bd = length(off), fwb = max(fwidth(bd), 1e-4), ball = (1. - smoothstep(1. - fwb, 1., bd)) * step(rh(ci + 53.9), uSeedK * .35) * (1. - cork);
    // (A SEED IS A SMALL BRIGHT RINGLET ON THE WALL: it never stands darker than the glass round it, so no dark speck hangs in the air)
    vec3 inBall = max(col, mix(col, roomSmall(normalize(D - (t1 * off.x + t2 * off.y) * 1.3), vW) * tint, .6));
    col = mix(col, inBall + uGlassLit * .22 * smoothstep(.62, .9, bd) * (.4 + .6 * fallS) + uLampCol * .8 * uLampK * fallS * exp(-dot(off - vec2(.3, .45), off - vec2(.3, .45)) / .03), ball);
    // (d) THE MIRROR at a grazing sight (an end mirrors END.mirror of what the long wall does)
    col = mix(col, mirrorOf(reflect(D, N), vW, 1. - smoothstep(${e(x.s1-40)}, ${e(x.s1)}, s)), (.03 + .85 * pow(clamp(1. - c, 0., 1.), 4.) * (1. - ${(1-De.mirror).toFixed(2)} * turnIn)) * (1. - cork));
    // (c) THE GLOSS: THE WINDOW'S LIGHT lies on the wall as one soft reflection in the window's own shape (four panes
    // round one upright and one cross bar), bent with the wall, pale blue and low; THE LAMP'S as one soft gold bloom. Each lies
    // at ONE PLACE OF THE WALL (GLOSS: where the light's straight way to her middle comes in through the glass), the
    // same for every eye, on the long wall only: they are gone where the shoulder begins
    float lit = .5 + .5 * cos(phi - uPhiL);
    float h1 = ${e(wt.lamp[0])}, h2 = ${e(wt.win[0])};
    vec2 wq = vec2(s - h2, (phi - ${wt.win[1].toFixed(3)} - (n1.r - .5) * .03) * 250.) / vec2(${e(K.win[0])}, ${e(K.win[1])});
    // (WINGLOSS: soft at its edge, its two bars faint and bowed; no hard side anywhere in it)
    vec2 wb = vec2(wq.x - ${Re.bow.toFixed(2)} * (wq.y * wq.y - .33), wq.y - ${(Re.bow*.7).toFixed(3)} * (wq.x * wq.x - .33));
    float pane = (1. - smoothstep(${(1-Re.fade).toFixed(2)}, 1., abs(wq.x))) * (1. - smoothstep(${(1-Re.fade).toFixed(2)}, 1., abs(wq.y)))
      * (1. - ${Re.bar.toFixed(2)} * max(1. - smoothstep(.03, .15, abs(wb.x)), 1. - smoothstep(.02, .09, abs(wb.y))));
    vec2 lq = vec2(s - h1, (phi - (${wt.lamp[1].toFixed(3)})) * 250.) / vec2(${e(K.bloom[0])}, ${e(K.bloom[1])});
    // (the lamp's light on the glass is a bright gold LINE along the wall, GLASS.line, with a small bloom round its middle, GLASS.bloom)
    vec2 lq1 = lq * vec2(${e(K.bloom[0])}, ${e(K.bloom[1])}) / vec2(${e(K.line[0])}, ${e(K.line[1])});
    // (the moth clings outside between the lamp and the wall: where it covers the glass the lamp's light does not lie on it)
    float bloom = (.55 * exp(-dot(lq, lq) * 1.5) + 1.6 * exp(-dot(lq1, lq1) * 1.5)) * (1. - mothOn);
    float onSh = smoothstep(${e(x.s0+12)}, ${e(x.s0+30)}, s), inNeck = step(${e(x.s1)}, s);
    // THE LINES OF LIGHT WHERE THE GLASS TURNS (THICK), each lw metres to either hand (rmLine: its least drawn width
    // is a pixel and a half, the one floor): one where the wall leaves the body for the shoulder,
    // and one down the neck on the lamp's side. AN END'S CURVE IS TOLD BY ONE SOFT BROAD HIGHLIGHT OF THE LAMP (END):
    // it lies near the rim on the lamp's side of the bottle, END.at of the radius out, soft over END.wide of the
    // radius and END.round radians round, on the base wall's dome and on the shoulder alike, and it is as strong as
    // the lamp's light is at that place along the bottle (the room's dusk law)
    float lw = ${(j.wall*j.line).toFixed(2)}, dphi = phi - uPhiL; dphi -= 6.2832 * floor(dphi / 6.2832 + .5);
    float turnLine = rmLine(s - ${e(x.s0)}, lw, dist), neckLine = rmLine(dphi * rax, lw, dist) * inNeck;
    col += (col * ${Re.over.toFixed(2)} + vec3(.56, .76, 1.) * ${Re.air.toFixed(3)}) * pane * (1. - onSh) * along;
    vec3 gloss = uLampCol * vec3(1., .86, .55) * .42 * bloom * uLampK * (1. - onSh);
    float fallW = rmFall((s - ${e(a.win[0])}) * (s - ${e(a.win[0])}));
    // (a line is gold where the wall faces the lamp, by the room's own dusk law along the bottle, and cold where it faces the window)
    vec3 gold = uLampCol * ${j.gold.toFixed(2)} * uLampK * (${a.dusk.toFixed(2)} + ${(1-a.dusk).toFixed(2)} * fallS), cold = vec3(.5, .7, 1.) * ${j.cold.toFixed(2)} * (.25 + .75 * fallW);
    vec3 lineLit = gold * pow(lit, 5.) + cold * pow(1. - lit, 5.);
    vec3 hiCol = uLampCol * vec3(1., .9, .62) * ${De.hi.toFixed(2)} * uLampK * (${a.dusk.toFixed(2)} + ${(1-a.dusk).toFixed(2)} * fallS) * exp(-(rr - ${De.at.toFixed(2)}) * (rr - ${De.at.toFixed(2)}) / ${(De.wide**2).toFixed(4)} - dphi * dphi / ${(De.round**2).toFixed(4)});
    gloss += lineLit * turnLine + gold * neckLine + hiCol * onSh * (1. - inNeck);
    col = (col + gloss) * along + col * (1. - along);
    // THE BASE WALL is the bottom of a bottle seen from inside (THICK, END). Its rim is the glass seen edge on: from
    // the long wall's inner face (one thickness inside the rim: one thin line of light lies there) inward for
    // THICK.heel thicknesses a band of deeper green that fades into the pane, with no edge of its own. Within it the
    // pane is clear: its curve is told by the one soft broad highlight and by the slow bending of what is seen
    float rHeel = ${e(G-j.heel*j.wall)}, rFace = ${e(G-j.wall)};
    float heel = smoothstep(rHeel - ${e(j.wall)}, rHeel + ${e(j.wall)}, rax), heelLine = rmLine(rax - rFace, lw, dist);
    col = mix(col, col * (1. - .3 * heel) + uGlassDeep * (.2 + .3 * n1.b) * heel + lineLit * heelLine + hiCol, dome);
    // THE CORK at the neck's end (CORK): a round plug of pale tan cork, pitted (fine pores, and a few deeper pits),
    // and round it the rim of the sealing wax, a darker red. It gives no light of its own: the lamp's light comes to
    // it down the neck's glass (CORK.lit of the lamp's), most on the lamp's side of its flat face, and the room's
    // shade lights the rest of it; so it stands lighter than the wall beyond it. The wax takes one small gleam
    vec2 cp = vec2(rs, rad.y); float cg = texture2D(uNoise, cp * .011).g, pores = smoothstep(.6, .8, texture2D(uNoise, cp * .05).r), pits = smoothstep(.64, .72, texture2D(uNoise, cp * .019 + .2).b);
    float faceLit = .5 + .5 * dot(cp, vec2(sin(uPhiL), cos(uPhiL))) / ${e(x.r)};
    vec3 farLight = uLampCol * ${Ve.lit.toFixed(2)} * uLampK * (.35 + .9 * faceLit) + vec3(${a.shade.map(t=>t.toFixed(3)).join(", ")});
    vec3 ck = vec3(${Ve.col.map(t=>t.toFixed(2)).join(", ")}) * (.8 + .35 * cg) * (1. - .4 * pores) * (1. - .55 * pits) * farLight;
    vec3 wax = vec3(${Ve.wax.map(t=>t.toFixed(2)).join(", ")}) * (.7 + .5 * cg) * farLight + uLampCol * .25 * uLampK * pow(lit, 12.) * (1. - smoothstep(.6, 1.6, abs(rax - ${e(x.r-Ve.rim/2)})));
    col = mix(col, mix(ck, wax, smoothstep(${e(x.r-Ve.rim)}, ${e(x.r-Ve.rim+2.5)}, rax)), cork);
    // WHERE THE SEA MEETS THE GLASS (the sea's own law: its swells and its run up the wall, swell and bankAt). up: metres
    // of this place of the wall over the waterline. Under it the water is seen through the glass, a deep bottle green
    // going dark with the depth; on it lies A THREAD OF FOAM, torn, that the run leaves as it slides back; over it the
    // glass is wet a few metres up (WET) and mirrors the sea: its blue low down, the white of the nearest crests
    vec4 sw = swell(vW.xz); float run = bankAt(vW.xz), up = vW.y - sw.x - run;
    float wn = texture2D(uNoise, vec2((dome > .5 ? rs : s) * .021, uTime * .011)).r, wn2 = texture2D(uNoise, vec2((dome > .5 ? rs : s) * .083 + .3, vW.y * .05 - uTime * .02)).g;
    float wetTop = ${e(St.low)} + ${e(St.high-St.low)} * wn, wet = (1. - smoothstep(wetTop * .4, wetTop, up)) * (1. - cork);
    vec2 inw = -normalize(vec2(rad.x, rad.z) + 1e-5); vec4 sw2 = swell(vW.xz + inw * (4. + 1.4 * max(up, 0.)));
    float top = smoothstep(.62, .95, clamp(sw2.x / max(sw2.w, 1.) * .5 + .5, 0., 1.));
    // THE FOOT OF THE GLASS IS THICK (FOOT_GLASS: from the waterline to that many metres over it, by the place): the
    // sight through it is dim and deep green, so what lies low outside (the table's top) is never seen beside the sea
    float foot = (1. - smoothstep(${e(Yt.low)}, ${e(Yt.high)} + 10. * wn, up)) * (1. - cork);
    col = mix(col, col * vec3(.12, .28, .2) + uGlassDeep * vec3(.5, 1., .72) * (.2 + .16 * lit + .12 * n1.b) * (.35 + .65 * fallS), foot * .9);
    col = mix(col, col * vec3(.5, .8, .62) + uSeaCol * (.3 + .25 * lit) + vec3(.85, .85, .8) * top * .3, wet * .6);
    col = mix(col, uGlassDeep * vec3(.35, .8, .6) * (.6 - .42 * smoothstep(0., 14., -up)) + uSeaCol * .16, (1. - smoothstep(-.8, .2, up)) * (1. - cork));
    // (WLINE: the thread lies in pieces, by the place, the same pieces the sea's own foam at the glass lies in)
    float thread = (1. - smoothstep(.25, .9 + 1.3 * wn2, abs(up - .3))) * smoothstep(.3, .52, wn2 + .25 * wn) * (1. - cork) * WLINE_PIECE_AT;
    col = mix(col, vec3(.9, .92, .88) * (.3 + .3 * lit), thread * .6);
    float f = 1. - exp(-uFogDen * uFogDen * dist * dist);
    // the glass is the end of the air: it takes two fifths of the haze
    gl_FragColor = vec4(mix(col, uFogCol, clamp(f, 0., 1.) * .4), 1.);
  }`,Zt=[[4.2,210,16,0],[2.6,130,12,.21],[1.4,75,9,-.26]],At=(t,o)=>(t-L.x)*$.x+(o-L.z)*$.z,S={amp:24,len:165,per:14,rise:58};S.from=At(he.x,se.near),S.full=S.from-S.rise;const Jt=t=>1.9*Math.pow(.5+.5*Math.sin(t),1.6)-.9,Xt=t=>t<=-6?-12:-12+19*Math.pow(Math.min(1,(t+6)/30),2);function Qt(t,o){if(t>26||t<-154)return 0;const i=ye((-110-t)/44,0,1),d=o>=0?4*(1-Math.min(1,o/26)):4+20*Math.pow(Math.min(1,-o/12),2),r=Math.min(t-i*i*d,24),m=Xt(r);if(o<=m||r<-154)return 0;const h=ye((r+6)/30,0,1),p=ye((-100-r)/54,0,1),s=6+6*h+9*p*p,f=3.2-1.3*h-1.5*p;return o>=s?ht(r):ht(r)*Math.pow(Math.max(0,1-Math.pow(Math.min(1,(s-o)/Math.max(.001,s-m)),f)),1/f)}const le={reach:20,wl:1.2},je={h:.9,at:1.6,wide:2.2},_={h:4.6,len:46,lead:1.5,open:.36,inner:3.4,outer:1.5,over:2.2},O={h:5.2,z:22.5,lx:7.5,lz:8,tear:.85,skin:1.5,free:5,grain:.06},Y={half:9,spread:.1,lee:.12,len:190,ridge:1.3,cut:1.1,pale:[10,70]},U={grain:.04,fine:.16,cut:[.58,.66],rest:[.5,2.4],share:.04},at={reach:46,k:.45,path:190},_e={reach:150,spread:.14,k:1.6,hollow:.3};function Ra(t,o,i){const d=Math.sin(i.roll),r=Math.cos(i.roll),m=Math.sin(i.pitch),h=Math.cos(i.pitch),p=le.wl-g.P[1],s=(o-p*m)/h,f=p*h-s*m,n=(t-f*d)/r;return[n,g.P[1]-n*d+f*r,s]}const Wa=t=>Math.max(Qt(t,le.wl),ht(Math.min(t,25))*.82*q(8,20,t));function Ca(t,o){const i=ye(o,-150,25.5),d=Wa(i),r=Math.max(Math.abs(t)-d,0),m=o-i,h=Math.hypot(r,m);return h>0?h:Math.abs(t)-d}function Ba(t,o,i,d,r){const m=(i-je.at)/je.wide,h=je.h*Math.exp(-m*m)*q(-1.5,0,i),p=Math.max(o+150,0),s=ye(.5-.5*d.pitch/(He.pitch*Math.PI/180),0,1),f=_.h*r*(.7+.3*s)*Math.exp(-p/_.len)*(1-q(60,110,p)),n=i-_.lead-_.open*p,w=f*Math.exp(-n*n/(n<0?_.inner*_.inner:_.outer*_.outer))*q(-1.5,.5,i),y=O.h*Math.exp(-(t*t/(O.lx*O.lx)+(o-O.z)*(o-O.z)/(O.lz*O.lz)));return h+w+y}function Oa(t,o){const i=o-20,d=(1.7*Math.sin(i*.071)+.9*Math.sin(i*.19+1.7))*q(8,60,i),r=Math.abs(t-i*Y.lee-d),m=Y.half+i*Y.spread,h=(r-m)/2.2,p=.76+.24*Math.sin(i*.33+2*Math.sin(i*.09));return Y.ridge*p*Math.exp(-h*h)*q(2,12,i)*(1-q(Y.len*.6,Y.len,i))}function Xa(t,o,i,d,r,m){let h=0;Zt.forEach(([Q,R,ce,Z],M)=>{const H=Math.cos(Z),W=Math.sin(Z),J=Pe.x*H-Pe.z*W,ie=Pe.x*W+Pe.z*H;h+=Q*d*Jt((t*J+o*ie)*6.2832/R-i*6.2832/ce+r[M])});const p=At(t,o),s=1-q(S.full,S.from,p);h+=S.amp*d*s*Jt(p*6.2832/S.len-i*6.2832/S.per+r[3]);const[f,n,w]=Ra(t,o,m),y=Ca(f,w),A=Ba(f,w,y,m,d);let I=B(h+Oa(t,o),n,1-q(0,le.reach,y))+A+Ia(t,o);const E=le.wl+(I-n),D=Qt(w,E),V=D>.01?1-q(-4,-1.5,Math.abs(f)-D):0;I=B(I,Math.min(I,n+Xt(w)-2-le.wl),V);const re=(1-q(15.2,16.2,Math.abs(f)))*q(-2,-1,w)*(1-q(25.6,26.4,w));return B(I,Math.min(I,n+g.cabin.y0-.8-le.wl),re)}const l=(t,o=2)=>t.toFixed(o),Ye={h:2.6,reach:20,len:140,per:8},ot={dark:5,deep:.6,grain:.004,cut:[.5,.62]},ea=t=>`smoothstep(${ot.cut[0].toFixed(2)}, ${ot.cut[1].toFixed(2)}, texture2D(uNoise, ${t} * ${ot.grain.toFixed(4)} + vec2(uTime * .002, 0.)).r)`;function ta(t,o,i){const d=t-L.x,r=o-L.y,m=i-L.z,h=d*$.x+m*$.z,p=Math.hypot(d-$.x*h,r,m-$.z*h),s=x.r+(G-x.r)*(.5+.5*Math.cos(Math.PI*ye((h-x.s0)/(x.s1-x.s0),0,1)));return Math.min(s-p,h-(ae+de.push*(1-p*p/(G*G))))}function Ia(t,o){const i=1-ye(ta(t,0,o)/Ye.reach,0,1);return Ye.h*i*i}const We=`
  uniform float uTime, uState, uRunPh;
  uniform vec2 uWind, uMotion;
  uniform vec4 uPhase;
  float halfBeam(float z){
    if (z > 26. || z < -154.) return 0.;
    if (z >= -10.) return 22. - 5. * pow(clamp((z + 10.) / 34., 0., 1.), 1.7);
    if (z >= -110.) return 22.;
    return 22. * sqrt(max(0., 1. - pow(clamp((-110. - z) / 44., 0., 1.), 2.4)));
  }
  float keelUnder(float z){ return z <= -6. ? -12. : -12. + 19. * pow(clamp((z + 6.) / 30., 0., 1.), 2.); }
  // her half breadth at a height (the part's own section law, with the stem's rake): where the sea meets her side
  float hullBreadth(float z, float y){
    if (z > 26. || z < -154.) return 0.;
    float w = clamp((-110. - z) / 44., 0., 1.), rake = y >= 0. ? 4. * (1. - min(1., y / 26.)) : 4. + 20. * pow(clamp(-y / 12., 0., 1.), 2.);
    float zz = min(z - w * w * rake, 24.), yb = keelUnder(zz); if (y <= yb || zz < -154.) return 0.;
    float aft = clamp((zz + 6.) / 30., 0., 1.), fwd = clamp((-100. - zz) / 54., 0., 1.), ym = 6. + 6. * aft + 9. * fwd * fwd, p = 3.2 - 1.3 * aft - 1.5 * fwd;
    if (y >= ym) return halfBeam(zz);
    return halfBeam(zz) * pow(max(0., 1. - pow(clamp((ym - y) / max(1e-3, ym - yb), 0., 1.), p)), 1. / p);
  }
  // SHE SITS IN HER SEA (the same laws as shipAt, planHalf, planDist, builtAt and wakeRidge in JS). uMot: her roll and
  // pitch at this clock. shipAt: a world place in her frame at her waterline (x: across her, y: the world height of
  // her waterline there, z: along her)
  uniform vec2 uMot;
  vec3 shipAt(vec2 p){
    float sr = sin(uMot.x), cr = cos(uMot.x), sp = sin(uMot.y), cp = cos(uMot.y), h = ${l(le.wl-g.P[1])};
    float zs = (p.y - h * sp) / cp, y1 = h * cp - zs * sp, xs = (p.x - y1 * sr) / cr;
    return vec3(xs, ${l(g.P[1])} - xs * sr + y1 * cr, zs);
  }
  float planHalf(float zs){ return max(hullBreadth(zs, ${l(le.wl)}), halfBeam(min(zs, 25.)) * .82 * smoothstep(8., 20., zs)); }
  // metres outside her plan at the waterline (negative inside); dirOut: the way out from her, in her frame
  float planDist(vec2 q, out vec2 dirOut){
    float zc = clamp(q.y, -150., 25.5), hb = planHalf(zc), sx = q.x < 0. ? -1. : 1.;
    vec2 dv = vec2(sx * max(abs(q.x) - hb, 0.), q.y - zc); float o = length(dv);
    dirOut = o > 1e-3 ? dv / o : vec2(sx, 0.);
    return o > 0. ? o : abs(q.x) - hb;
  }
  // what is built on the carried sea (x: metres over her waterline; y: metres its top is pushed out over its foot;
  // z: the bow wave's own share, for its white). The rolls of the collar are lumps a few metres long
  vec3 builtAt(vec2 q, float d){
    float lump = .55 + .45 * abs(sin(q.y * .83 + 1.7 * sin(q.y * .21) + q.x * .3));
    float k = (d - ${l(je.at)}) / ${l(je.wide)}, k2 = (d - 5.4) / 1.5;
    float collar = ${l(je.h)} * (lump * exp(-k * k) + .45 * (1.5 - lump) * exp(-k2 * k2)) * smoothstep(-1.5, 0., d);
    float az = max(q.y + 150., 0.), plunge = clamp(.5 - .5 * uMot.y / ${l(He.pitch*Math.PI/180,5)}, 0., 1.);
    float H = ${l(_.h)} * uState * (.7 + .3 * plunge) * exp(-az / ${l(_.len,1)}) * (1. - smoothstep(60., 110., az)) * (.78 + .22 * sin(az * .61 + 2.1 * sin(az * .17 + q.x * .2) - uTime * 1.3));
    float t = d - ${l(_.lead)} - ${l(_.open)} * az, wd = t < 0. ? ${l(_.inner)} : ${l(_.outer)};
    float prof = exp(-t * t / (wd * wd)) * smoothstep(-1.5, .5, d), bow = H * prof;
    vec2 bq = (q - vec2(0., ${l(O.z)})) / vec2(${l(O.lx)}, ${l(O.lz)});
    float boil = ${l(O.h)} * exp(-dot(bq, bq));
    return vec3(collar + bow + boil, ${l(_.over)} * bow / ${l(_.h)} * smoothstep(.45, 1., prof) * step(-1., t), bow);
  }
  // THE WAKE astern, in the free sea: x: its two spreading ridges (metres over the swell); y: its churned middle (0 to 1),
  // where the water is lumps and pits (churnAt: 0 on a lump, 1 in a pit), cut down
  vec2 wakeAt(vec2 p){
    float wz = p.y - 20., wan = (1.7 * sin(wz * .071) + .9 * sin(wz * .19 + 1.7)) * smoothstep(8., 60., wz);
    float wx = abs(p.x - wz * ${l(Y.lee)} - wan), wh = ${l(Y.half,1)} + wz * ${l(Y.spread)}, k = (wx - wh) / 2.2;
    float env = smoothstep(2., 12., wz) * (1. - smoothstep(${l(Y.len*.6,1)}, ${l(Y.len,1)}, wz));
    return vec2(${l(Y.ridge)} * (.76 + .24 * sin(wz * .33 + 2. * sin(wz * .09))) * exp(-k * k), 1. - smoothstep(wh - 3., wh, wx)) * env;
  }
  // metres from a place to the glass (the body's wall, the shoulder, the base wall's dome)
  float wallGap(vec3 w){
    vec3 rel = w - vec3(${l(L.x,1)}, ${l(L.y,1)}, ${l(L.z,1)}), ax = vec3(${$.x.toFixed(5)}, 0., ${$.z.toFixed(5)});
    float s = dot(rel, ax), rc = length(rel - ax * s);
    float R = ${l(x.r,1)} + ${l(G-x.r,1)} * (.5 + .5 * cos(3.14159 * clamp((s - ${l(x.s0,1)}) / ${l(x.s1-x.s0,1)}, 0., 1.)));
    return min(R - rc, s - (${l(ae,1)} + ${l(de.push,1)} * (1. - rc * rc / ${l(G*G,1)})));
  }
  float churnAt(vec2 p){
    vec2 q = p + 1.7 * vec2(sin(p.y * .31 + uTime * .7), sin(p.x * .37 - uTime * .5));
    float a = sin(q.x * .83 + 1.3 * sin(q.y * .47)) * sin(q.y * .61 - uTime * 1.1), b = sin(q.x * 1.1 + q.y * .6) * sin(q.y * .9 - q.x * .4 + uTime * .8);
    return clamp(.5 - .4 * a - .14 * b, 0., 1.);
  }
  // THE SMALL SEAS: short stiff crests lying across the wind and travelling down it, each a ridge of its own in a
  // seeded scatter (uScatter: the seed's two offsets): steep to weather, long to lee, of its own length and height,
  // one in three or so left out. x: its height as a share (0 in the hollows, 1 on the tallest ridge top); y: the share
  // of white its top carries (a whitecap on the crests the scatter picks)
  uniform vec4 uScatter;
  float h21s(vec2 p){ p = fract(p * vec2(123.34, 456.21) + uScatter.xy); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  vec2 crests(float al, float ac, float lam, float lane, float pace, float set){
    float lq = ac / lane + set * .37, li = floor(lq), lf = fract(lq);
    float ph = (al - pace * uTime) / lam + h21s(vec2(li, set)) * 7., ci = floor(ph), cf = fract(ph);
    float pick = h21s(vec2(li * 1.7 + ci * .61, set + 3.1)), tall = h21s(vec2(ci * 1.3 - li, set + 7.7));
    float e = clamp(1. - abs(lf - .5) * 2. / (.45 + .55 * pick), 0., 1.); e = e * e * (3. - 2. * e);
    float up = clamp(cf / .62, 0., 1.), prof = up * up * up * (1. - smoothstep(.62, .8, cf));
    float h = e * prof * (.4 + .6 * tall) * step(.3, pick);
    return vec2(h, h * smoothstep(.5, .9, prof) * step(.62, tall));
  }
  vec2 smallSeas(vec2 p){
    float al = dot(p, uWind), ac = dot(p, vec2(-uWind.y, uWind.x));
    vec2 a = crests(al, ac, 17., 31., 5.1, 0.), b = crests(al * .97 + ac * .24, ac * .97 - al * .24, 27., 47., 6.5, 1.) * vec2(.8, 1.);
    return a.x > b.x ? a : b;
  }
  // metres along the bottle from her middle (astern is negative)
  float sAlong(vec2 p){ return dot(p - vec2(${L.x.toFixed(1)}, ${L.z.toFixed(1)}), vec2(${$.x.toFixed(5)}, ${$.z.toFixed(5)})); }
  // THE RUN UP THE GLASS (RUNUP): metres the sea stands over its own swell at a place, by its way from the wall and
  // the surge's own clock along the wall
  float bankAt(vec2 p){
    float k = 1. - clamp(wallGap(vec3(p.x, 0., p.y)) / ${e(Ye.reach)}, 0., 1.), sa = sAlong(p);
    return ${e(Ye.h)} * k * k * (.5 + .5 * sin(sa * ${(6.2832/Ye.len).toFixed(5)} + 1.7 * sin(sa * .013 + p.x * .004) + uRunPh - uTime * ${(6.2832/Ye.per).toFixed(5)}));
  }
  // the sea at a place: x its height, yz its slope, w the height it can reach there
  vec4 swell(vec2 p){
    vec4 r = vec4(0.);
    ${Zt.map(([t,o,i,d],r)=>`{
      vec2 d = vec2(uWind.x * ${Math.cos(d).toFixed(5)} - uWind.y * ${Math.sin(d).toFixed(5)}, uWind.x * ${Math.sin(d).toFixed(5)} + uWind.y * ${Math.cos(d).toFixed(5)});
      float k = ${(6.2832/o).toFixed(6)}, th = dot(p, d) * k - uTime * ${(6.2832/i).toFixed(6)} + uPhase[${r}];
      float b = clamp(.5 + .5 * sin(th), 0., 1.);
      r.x += ${t.toFixed(2)} * uState * (1.9 * pow(b, 1.6) - .9);
      r.yz += ${t.toFixed(2)} * uState * 1.52 * pow(b, .6) * cos(th) * k * d;
    }`).join(`
    `)}
    {
      // the following sea: its share by place (and that share's own slope), its crests running up the bottle toward her
      float s = sAlong(p), q = clamp((s - ${S.full.toFixed(1)}) / ${(S.from-S.full).toFixed(1)}, 0., 1.);
      float env = 1. - q * q * (3. - 2. * q), denv = -6. * q * (1. - q) / ${(S.from-S.full).toFixed(1)};
      float k = ${(6.2832/S.len).toFixed(6)}, th = s * k - uTime * ${(6.2832/S.per).toFixed(6)} + uPhase.w;
      float b = clamp(.5 + .5 * sin(th), 0., 1.), c = 1.9 * pow(b, 1.6) - .9;
      r.x += ${S.amp.toFixed(1)} * uState * env * c;
      r.yz += ${S.amp.toFixed(1)} * uState * (denv * c + env * 1.52 * pow(b, .6) * cos(th) * k) * vec2(${$.x.toFixed(5)}, ${$.z.toFixed(5)});
      r.w = (8.2 + ${S.amp.toFixed(1)} * env) * uState;
    }
    return r;
  }`,Ue={len:[46,17],pace:[.05,.11],steep:[1.5,1.1]},Et=Gt(a.win[0],a.l1,a.win[1]),aa=.95,oa={from:.58,drift:3},Ha=`
  ${We}
  varying vec3 vW; varying vec4 vSw, vShip; varying float vIn;
  void main(){
    vec3 p = position; vec4 sw = swell(p.xz);
    // the free sea (the swells and the wake's ridges) gives way to her own waterline within CARRY.reach metres of her plan
    vec3 sa = shipAt(p.xz); vec2 dir; float d = planDist(sa.xz, dir), kc = 1. - smoothstep(0., ${l(le.reach,1)}, d);
    vec3 bl = builtAt(sa.xz, d); vec2 wk = wakeAt(p.xz);
    float y = mix(sw.x + wk.x, sa.y, kc) + bl.x + bankAt(p.xz);
    // the small seas and the wake's churn are cut down from that surface (the small seas less, close under her side)
    y -= ${aa.toFixed(2)} * uState * (1. - smallSeas(p.xz).x) * (1. - .6 * kc) + ${l(Y.cut)} * wk.y * churnAt(p.xz) * (1. - kc);
    // inside her skin, at the sea's own height in her frame, the sheet is held under her keel: it meets her side and
    // never comes through; under the cabin's plan it never stands within 0.8 m of the floor cloth
    float ys = ${l(le.wl)} + (y - sa.y), hb = hullBreadth(sa.z, ys); vIn = hb > .01 ? 1. - smoothstep(-4., -1.5, abs(sa.x) - hb) : 0.;
    y = mix(y, min(y, sa.y + keelUnder(sa.z) - ${l(2+le.wl)}), vIn);
    float hold = (1. - smoothstep(15.2, 16.2, abs(sa.x))) * smoothstep(-2., -1., sa.z) * (1. - smoothstep(25.6, 26.4, sa.z));
    y = mix(y, min(y, sa.y + ${l(g.cabin.y0-.8-le.wl)}), hold);
    // the bow wave's top is pushed out over its foot, the way out from her
    p.xz += dir * bl.y; p.y = y;
    vW = p; vSw = sw; vShip = vec4(sa.x, sa.z, d, kc);
    gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
  }`,Pa=`
  precision highp float;
  ${We}
  uniform vec3 uKeyDir, uKeyCol, uSeaSky, uSeaGround, uFogCol, uDeep, uIndigo, uBlack, uLitBlue, uWhite, uWhiteShade, uSheen, uBlurC;
  uniform float uFogDen, uCaus; uniform vec3 uLant, uLantCol;
  ${ba}
  uniform sampler2D uNoise;
  uniform vec2 uNet;
  varying vec3 vW; varying vec4 vSw, vShip; varying float vIn;
  float caus(vec2 p, float t){
    vec2 q = p * .085; q += .9 * vec2(sin(q.y * 1.7 + t * .5), sin(q.x * 1.9 - t * .43));
    float a = sin(q.x * 3.1 + t * .31) * sin(q.y * 2.7 - t * .27);
    float c = clamp(1. - abs(a) * 2.2, 0., 1.); return c * c * c;
  }
  vec4 tri(vec3 q, vec3 tw){ return texture2D(uNoise, q.xz) * tw.y + texture2D(uNoise, q.zy) * tw.x + texture2D(uNoise, q.xy) * tw.z; }
  // the surface without its small seas (the vertex shader's own law)
  float baseH(vec2 p){
    vec3 sa = shipAt(p); vec2 dir; float d = planDist(sa.xz, dir);
    return mix(swell(p).x + wakeAt(p).x, sa.y, 1. - smoothstep(0., ${l(le.reach,1)}, d)) + builtAt(sa.xz, d).x;
  }
  void main(){
    vec2 p = vW.xz, ex = vec2(.35, 0.), ez = vec2(0., .35); float kc = vShip.w, d = vShip.z;
    // the form of the water: near her and in her wake by the law itself, elsewhere the swells' own slope
    vec2 wk = wakeAt(p), slope = vSw.yz;
    if (d < 75.) { float h0 = baseH(p); slope = vec2(baseH(p + ex) - h0, baseH(p + ez) - h0) / .35; }
    else slope += vec2(wakeAt(p + ex).x - wk.x, wakeAt(p + ez).x - wk.x) / .35;
    slope += vec2(bankAt(p + ex) - bankAt(p), bankAt(p + ez) - bankAt(p)) / .35;
    vec2 ss = smallSeas(p); float ch = churnAt(p), cutK = ${aa.toFixed(2)} * uState * (1. - .6 * kc) / .35, chK = wk.y * (1. - kc) * ${l(Y.cut)} / .35;
    slope += vec2(smallSeas(p + ex).x - ss.x, smallSeas(p + ez).x - ss.x) * cutK + vec2(churnAt(p + ex) - ch, churnAt(p + ez) - ch) * chK;
    vec3 N = normalize(vec3(-slope.x, 1., -slope.y)), tw = pow(abs(N), vec3(4.)); tw /= tw.x + tw.y + tw.z;
    // the marks: tone patches, the brush's hairs (two ways from above, level along a steep face), tooth and grit
    vec4 t1 = tri(vW * .0061 + .1, tw), t3 = tri(vW * .13, tw), t4 = tri(vW * .011 + .37, tw);
    float al = dot(p, uWind), ac = dot(p, vec2(-uWind.y, uWind.x)), al2 = al * .47 + ac * .883, ac2 = ac * .47 - al * .883;
    // (the grain is the same every way: nothing is drawn out into streaks under the eye)
    float bristle = tri(vW * .047 + .7, tw).g * .65 + t3.r * .35;
    float tooth = t3.a, grit = t3.g, px = fwidth(ac);
    // the water carries small stiff ridges, two ways in patches; they
    // stand on what faces up (a steep face keeps its own form)
    float way = smoothstep(.44, .56, t1.r); vec2 rq = mix(vec2(al, ac), vec2(al2, ac2), way) * vec2(.027, .013);
    float rg = texture2D(uNoise, rq).r, rgx = texture2D(uNoise, rq + vec2(.004, 0.)).r, rgy = texture2D(uNoise, rq + vec2(0., .004)).r;
    vec2 rgrad = vec2(rgx - rg, rgy - rg) * (vec2(.027, .013) / .004), wa = mix(uWind, vec2(.47 * uWind.x - .883 * uWind.y, .47 * uWind.y + .883 * uWind.x), way);
    vec3 N0 = N;
    vec3 bl = builtAt(vShip.xy, d); float built = smoothstep(.12, .5, bl.x) * smoothstep(-2., -.5, d);
    N = normalize(N + vec3(-(wa.x * rgrad.x - wa.y * rgrad.y), 0., -(wa.y * rgrad.x + wa.x * rgrad.y)) * (.7 * tw.y + 3. * built));
    // THE WAVES' OWN SMALL WAVES: two trains of ripples (RIPPLE: metres long), one down the wind and one across it, each
    // running on the clock; sharp near the eye, laid to rest where a pixel covers many of them
    vec2 r1 = p / ${e(Ue.len[0])} + uWind * uTime * ${Ue.pace[0].toFixed(3)}, r2 = (p * mat2(.8, .6, -.6, .8)) / ${e(Ue.len[1])} - vec2(-uWind.y, uWind.x) * uTime * ${Ue.pace[1].toFixed(3)} + .37;
    vec2 rg1 = vec2(texture2D(uNoise, r1 + vec2(.006, 0.)).r - texture2D(uNoise, r1 - vec2(.006, 0.)).r, texture2D(uNoise, r1 + vec2(0., .006)).r - texture2D(uNoise, r1 - vec2(0., .006)).r);
    vec2 rg2 = vec2(texture2D(uNoise, r2 + vec2(.006, 0.)).b - texture2D(uNoise, r2 - vec2(.006, 0.)).b, texture2D(uNoise, r2 + vec2(0., .006)).b - texture2D(uNoise, r2 - vec2(0., .006)).b);
    float calmK = 1. - smoothstep(.25, 1.6, px);
    vec2 rip = (rg1 * ${Ue.steep[0].toFixed(1)} + rg2 * mat2(.8, -.6, .6, .8) * ${Ue.steep[1].toFixed(1)}) * calmK * (1. - .7 * built);
    N = normalize(N + vec3(-rip.x, 0., -rip.y));
    float bk0 = bankAt(p), hn = clamp((vW.y - bk0) / max(vSw.w, 1.) * .5 + .5, 0., 1.), hollow = 1. - smoothstep(0., .35, ss.x);
    // THE PAINT: blue black in the troughs, indigo, ultramarine, a greener blue on the shoulders the lamp finds
    vec3 alb = mix(uIndigo, uDeep, smoothstep(.2, .62, hn + .12 * (t1.r - .5)));
    alb = mix(uBlack, alb, smoothstep(.03, .3, hn + .1 * (t1.g - .5)));
    alb = mix(alb, uLitBlue, clamp(dot(N, uKeyDir) * 1.5, 0., 1.) * smoothstep(.45, .8, hn) * .75);
    alb = mix(alb, uIndigo * .7, hollow * .4) * (.82 + .36 * bristle) * (.85 + .3 * smoothstep(.35, .65, t1.b)) * (.9 + .2 * tooth);
    // each wave has a bright side and a deep blue-green side: what is turned from the lamp goes to the green of deep water
    alb = mix(alb, vec3(.012, .1, .115), (1. - clamp(dot(N, uKeyDir) * 1.6 + .45, 0., 1.)) * .55);
    // white over what stands highest: the crest lines of the swells, the tops of the small ridges
    // THE CRESTS BREAK IN LACE: high on a swell the white lies in patches and tatters (LACE: a web of threads round
    // dark holes, two isolines of slow noise, in patches of their own) that drift down the wind and trail down the
    // swell's back; only the very top is whole. The chop's own tops carry a touch of the same web, never a dash
    vec2 lp = p - uWind * uTime * ${l(oa.drift,1)};
    float la = texture2D(uNoise, lp * .0115).r, lb = texture2D(uNoise, lp * .027 + .5).b, lc = texture2D(uNoise, lp * .0038 + .2).r, ridge = smoothstep(.45, .95, ss.x);
    float web = max(1. - smoothstep(.012, .045, abs(la - .5)), .8 * (1. - smoothstep(.015, .05, abs(lb - .52))));
    float lace = smoothstep(${l(oa.from)}, .9, hn + .14 * (lc - .5)) * smoothstep(.38, .6, lc) * (.22 + .78 * web) + smoothstep(.88, .99, hn) * .85;
    float cr = clamp(lace + ridge * ss.y * web * .7, 0., 1.) * (1. - .7 * kc);
    // the wake: A ROAD OF LACE: torn white on the lumps of its churned pale middle and on its two ridges, in the same
    // web of threads as the breaking crests
    // (the churned middle keeps its lace right up to the boil under her counter: only outside it does the sea she
    // carries lie plain)
    float torn = texture2D(uNoise, p * .023 + vec2(0., uTime * .003)).r * .6 + texture2D(uNoise, p * .071).g * .4;
    float wakeW = max(wk.y * (.1 + .8 * smoothstep(.44, .62, torn)) * (.25 + .75 * (1. - ch)) * (.3 + .7 * web), smoothstep(.15, .7, wk.x) * (.5 + .5 * smoothstep(.36, .58, torn)) * (.45 + .55 * web)) * (1. - kc * (1. - wk.y));
    float ww = clamp(max(cr, wakeW), 0., 1.), dry = bristle * .62 + tooth * .26 + .12 * t1.g;
    float white = smoothstep(.9 - .78 * ww, 1.04 - .74 * ww, dry) * smoothstep(0., .08, ww);
    // where one pixel covers many hairs the texture has already run them together: there the white is its share of the surface
    white = mix(white, smoothstep(.22, .86, ww), smoothstep(.08, .55, px));
    // (the churned middle's pale is froth spread fine, A LAW OF THE WAKE'S OWN PLACE, the same for every eye: within
    // WAKE.pale[0] metres astern of her counter the churn is new and deep water shows between the lace; by WAKE.pale[1]
    // metres astern it stands whole, in the churn's own lumps)
    alb = mix(alb, mix(uDeep, uWhite, .4), wk.y * (1. - kc) * .3 * (1. - ch) * smoothstep(${l(Y.pale[0],1)}, ${l(Y.pale[1],1)}, p.y - ${l(g.transomOut)}) * (.5 + .5 * smoothstep(.4, .6, torn)));
    alb = mix(alb, mix(uWhiteShade, uWhite, clamp(.25 + 1.1 * bristle, 0., 1.)), white);
    // THE BUILT WHITE round her: the collar's rolls, the bow wave, the boil under her counter: thick foam
    // (the collar's rolls and the boil are white all through; the bow wave is white on its crest and its steep outer
    // face, torn where the dry brush left it, and its long inner slope shows the blue)
    float foam = max(max(smoothstep(.12, .5, bl.x - bl.z), smoothstep(.5, 1.7, bl.z) * (.5 + .5 * smoothstep(.3, .55, dry))), 1. - smoothstep(.5, 3.2, d)) * smoothstep(-2., -.5, d);
    // the boil is churned water, not a bank of snow: clear of her skin (BOIL.skin to BOIL.free metres off her plan) its
    // white is torn, in lumps BOIL.grain to the metre that work on the clock, and the blue paint shows in the gaps
    float bt = texture2D(uNoise, p * ${l(O.grain)} + vec2(0., uTime * .015)).r * .65 + torn * .35;
    foam *= 1. - ${l(O.tear)} * smoothstep(.12, .5, bl.x - bl.z) * smoothstep(${l(O.skin)}, ${l(O.free)}, d) * (1. - smoothstep(.46, .6, bt));
    // THE WHITE UNDER HER COUNTER IS LACE: in the boil's own plan the white stands only on the web's threads and the
    // lumps' tops; between them the deep water shows. The plan is THE BOIL'S OWN WHITE, the whole of it (wherever the
    // boil's height alone stands over the foam's own threshold), clear of her skin
    { vec2 bq = (vShip.xy - vec2(0., ${l(O.z)})) / vec2(${l(O.lx)}, ${l(O.lz)}); float inBoil = smoothstep(.12, .5, ${l(O.h)} * exp(-dot(bq, bq))) * smoothstep(.6, 2.2, d);
      foam *= 1. - .92 * inBoil * (1. - max(web, smoothstep(.56, .7, bt))); }
    alb = mix(alb, mix(uWhiteShade, uWhite, clamp(.3 + .8 * tooth + .4 * bristle, 0., 1.)), foam * (.75 + .25 * smoothstep(.3, .6, dry)));
    // a painted seam at her skin: a dark line where the sea meets her
    alb = mix(alb, uBlack, (1. - smoothstep(.1, .45, d)) * step(-1.4, d) * .8);
    // AT THE GLASS the water stands deep and green (the bottle's own colour comes down into it) and carries the thread
    // of foam its run leaves, torn, a few metres wide by the place
    float gap = wallGap(vW), fw2 = 1.2 + 3.5 * t4.r;
    alb = mix(alb, vec3(.01, .13, .1), (1. - smoothstep(1., 16., gap)) * .7);
    alb = mix(alb, mix(uWhiteShade, uWhite, .5 + .5 * tooth), (1. - smoothstep(fw2 * .4, fw2, gap)) * smoothstep(.42, .6, torn) * .55 * ${ea("vW.xz")});
    float dif = clamp(dot(N, uKeyDir) * .8 + .2, 0., 1.);
    float ms = mothShade(vW);   // the moth's dusk on the sea: the lamp's light goes where its shadow lies
    vec3 toWin = normalize(vec3(${e(Et[0])}, ${e(Et[1])}, ${e(Et[2])}) - vW);
    // (water gives the lamp back as glints, not as a wash: on the blue itself the lamp's light is taken at its strength
    // only, a little to the green, so no lit face goes brown or purple; the white takes the lamp's own gold)
    vec3 keyW = mix(vec3(dot(uKeyCol, vec3(.333))) * vec3(.6, .98, 1.12), uKeyCol, clamp(white + foam, 0., 1.));
    vec3 lightv = mix(uSeaGround, uSeaSky, .5 + .5 * N.y) + keyW * dif * dif * 2.1 * ms + vec3(.3, .5, 1.) * .5 * pow(clamp(dot(N, toWin) * .7 + .3, 0., 1.), 2.);
    lightv += keyW * uCaus * caus(p * .5 + uNet, uTime) * (1. - .5 * white) * ms;
    // her three stern lanterns throw their gold on the sea by place: on what faces each, falling with the square of
    // the way from it, and one track of gold down the wake toward the eye (from the great one)
    vec3 toL = uLant - vW; float dl = max(length(toL), 1.); toL /= dl;
    float lant = 0.;
    ${g.lanterns.map(t=>`{ vec3 tq = uLant + vec3(${l(t[0]-g.lantern[0],1)}, ${l(t[1]-g.lantern[1],1)}, ${l(t[2]-g.lantern[2],1)}) - vW; float dq = max(dot(tq, tq), 1.); lant += ${l(t[3])} * clamp(dot(N, tq / sqrt(dq)) * .7 + .3, 0., 1.) / (1. + dq / ${l(at.reach*at.reach,1)}); }`).join(`
    `)}
    // (the same law as the lamp's: on the blue itself a lantern's light is taken at its strength only, a little to the
    // green, so the lit swell under her counter never goes purple; the white takes the lantern's own gold)
    lightv += mix(vec3(dot(uLantCol, vec3(.333))) * vec3(.6, .98, 1.12), uLantCol, clamp(white + foam, 0., 1.)) * lant * ${l(at.k)};
    // the open stern's light down her wake (CASEMENT)
    float cz = p.y - ${l(g.transomOut)}, cw = ${l((g.casement.x1-g.casement.x0)/2)} + ${l(_e.spread)} * max(cz, 0.);
    float cas = exp(-p.x * p.x / (cw * cw)) * smoothstep(-6., 4., cz) / (1. + cz * cz / ${l(_e.reach*_e.reach,1)});
    // (in the road the casement's light IS the light: the white there is gold, never white hot; the water keeps its blue under a low gold.
    // The white is churned water: the gold lies on its lumps' tops and is low in the hollows between them, CASEMENT.hollow of it, by the churn's own grain)
    float road = clamp(cas * ${l(_e.k)}, 0., 1.);
    lightv = mix(lightv, mix(lightv * .8 + vec3(dot(uLantCol, vec3(.333))) * vec3(.5, .82, .9) * .3, uLantCol * vec3(1., .8, .46) * .95 * (${l(_e.hollow)} + ${l(1-_e.hollow)} * smoothstep(.38, .62, bt)), clamp(white + foam, 0., 1.)), road);
    vec3 col = alb * lightv;
    // matt paint: the lamp lays one broad track of warm gold on it, the glass a faint green sheen at a grazing eye
    vec3 V = normalize(cameraPosition - vW), Nt = normalize(mix(N0, N, .3) + vec3(0., .7, 0.)), toB = normalize(uBlurC - vW);
    // THE LIGHTS LIE ON THE WATER AS BROKEN PATHS, never a smear: where the lamp would be mirrored to the eye (a broad
    // way toward it) every ripple that is turned right carries one small hard glint of gold; the window's way is the
    // same in pale blue; her stern lanterns lay a long broken way of gold down her wake (LANTERN.path metres)
    vec3 Ng = normalize(N + vec3(-rip.x, 0., -rip.y) * 1.5), Rg = reflect(-V, Ng);
    float way1 = pow(clamp(dot(reflect(-toB, Nt), V), 0., 1.), 10.), way2 = pow(clamp(dot(reflect(-toWin, Nt), V), 0., 1.), 9.), way3 = pow(clamp(dot(reflect(-toL, Nt), V), 0., 1.), 5.) / (1. + dl * dl / ${l(at.path*at.path,1)});
    float sp1 = smoothstep(.9, .98, dot(Rg, toB)), sp3 = smoothstep(.84, .97, dot(Rg, toL));
    vec3 toC = normalize(vec3(${l(g.sternWindow[0])}, ${l(g.sternWindow[1])}, ${l(g.transomOut)}) - vW);
    float way4 = pow(clamp(dot(reflect(-toC, Nt), V), 0., 1.), 4.) * cas, sp4 = smoothstep(.8, .96, dot(Rg, toC));
    // (each way is BROKEN at every distance: only the scattered small faces of the water that the grain picks carry a glint)
    // (the grain is one size in metres, GLINT, and drifts down the wind; the pixel's footprint lays it to rest far off)
    vec2 drift = uWind * uTime * .012;
    float spark = mix(smoothstep(${l(U.cut[0])}, ${l(U.cut[1])}, texture2D(uNoise, p * ${l(U.grain)} + drift).g), ${l(U.share)}, smoothstep(${l(U.rest[0])}, ${l(U.rest[1])}, px));
    float sparkF = mix(smoothstep(${l(U.cut[0])}, ${l(U.cut[1])}, texture2D(uNoise, p * ${l(U.fine)} + drift * 4.).b), ${l(U.share)}, smoothstep(${l(U.rest[0]*U.grain/U.fine)}, ${l(U.rest[1]*U.grain/U.fine)}, px));
    float still = (1. - .6 * foam) * (1. - .5 * white);
    // (where two ways cross, a glint is no brighter than the brightest of them: the ways never add up to a white sheet)
    col += max(max(uKeyCol * vec3(1., .8, .42) * (2.3 * way1 * sp1 * spark + .008 * way1) * ms, vec3(.62, .8, 1.) * .02 * way2), max(uLantCol * (2.6 * way3 * sp3 * sparkF + .02 * way3), uLantCol * 4. * way4 * sp4 * sparkF)) * still;
    col += uSheen * pow(1. - clamp(dot(N, V), 0., 1.), 3.) * .22;
    // (WLINE: the dark green line where the sea meets the glass)
    col *= (1. - .65 * vIn) * (1. - ${ot.deep.toFixed(2)} * (1. - smoothstep(0., ${e(ot.dark)}, gap)));
    float dist = length(cameraPosition - vW), f = 1. - exp(-uFogDen * uFogDen * dist * dist);
    gl_FragColor = vec4(mix(col, uFogCol, clamp(f, 0., 1.)), 1.);
  }`,T={fine:1.6,grow:1.13,coarse:16,low:30,pad:12,s:[1/0,-1/0],l:[1/0,-1/0]};for(const t of jt())if(t[1]<T.low){const o=At(t[0],t[2]),i=(t[0]-L.x)*-$.z+(t[2]-L.z)*$.x;T.s=[Math.min(T.s[0],o-T.pad),Math.max(T.s[1],o+T.pad)],T.l=[Math.min(T.l[0],i-T.pad),Math.max(T.l[1],i+T.pad)]}function sa(t,o,i,d){const r=[];let m=i,h=T.fine;for(;m>t;)r.unshift(m),h=m<i?Math.min(T.coarse,h*T.grow):h,m-=h;for(r.unshift(t),m=i+T.fine,h=T.fine;m<o;)r.push(m),h=m>=d?Math.min(T.coarse,h*T.grow):h,m+=h;return r.push(o),r}async function Ka(t){const o=sa(ae-12,690,T.s[0],T.s[1]),i=sa(-262,262,T.l[0],T.l[1]),d=o.length-1,r=i.length-1,m=new c.Vector3().crossVectors($,new c.Vector3(0,1,0)).normalize(),h=new Float32Array((d+1)*(r+1)*3),p=new Uint32Array(d*r*6);let s=0;for(let n=0;n<=d;n++){const w=o[n];for(const y of i)h[s]=L.x+$.x*w+m.x*y,h[s+2]=L.z+$.z*w+m.z*y,s+=3;n%8===7&&await t.yield()}await t.yield(),s=0;for(let n=0;n<d;n++)for(let w=0;w<r;w++){w===0&&n%8===7&&await t.yield();const y=n*(r+1)+w;p[s]=y,p[s+1]=y+1,p[s+2]=y+r+2,p[s+3]=y,p[s+4]=y+r+2,p[s+5]=y+r+1,s+=6}await t.yield();const f=new c.BufferGeometry;return f.setAttribute("position",new c.BufferAttribute(h,3)),f.setIndex(new c.BufferAttribute(p,1)),f}const ke={n:96,r:2.5,stray:.2,soft:1},la=.05,ra=3,Ga=5200,st={n:300,size:[2.5,6],life:[1.5,2.7]},X={s0:-400,s1:160,len:520,top:120,fade:30},vt=`
  uniform float uPxH, uCutOwn; uniform vec3 uKeyDir; uniform vec3 uLane[${ke.n}];
  varying float vAlpha, vLit, vId; varying vec2 vUv; varying float vDist;
  float clearOfShip(vec3 c){
    float top = c.z > -14. ? 31. : (c.z > -116. ? 19. : 25.);
    float beside = abs(c.x) - halfBeam(clamp(c.z, -154., 26.)) - 1.5, beyond = max(c.z - 27.5, -155.5 - c.z);
    return smoothstep(0., 4., max(max(beside, c.y - top), beyond));
  }
  // metres from a place to the flown line
  float laneDist(vec3 c){
    float d2 = 1e9;
    for (int i = 0; i < ${ke.n-1}; i++) {
      vec3 a = uLane[i], ab = uLane[i + 1] - a, ac = c - a; vec3 q = ac - ab * clamp(dot(ac, ab) / max(dot(ab, ab), 1e-4), 0., 1.);
      d2 = min(d2, dot(q, q));
    }
    return sqrt(d2);
  }
  // lay one dab: c its centre, e1 and e2 its own two edges in metres, reach its greatest half length; returns the clip
  // position. A dab is put out where its centre, with its reach, stands in the tube round the flown line (LANE.r metres
  // and the lane's stray), and is whole LANE.soft metres further out. A long streak (uCutOwn: the rain) is CUT where it
  // enters the tube instead: each of its corners is put out by its own place.
  vec4 dab(vec3 c, vec3 e1, vec3 e2, float reach, float fade){
    vec3 w = c + e1 * position.x + e2 * position.y; float rr = ${(ke.r+2*ke.stray).toFixed(2)} + reach * (1. - uCutOwn);
    float k = smoothstep(rr, rr + ${ke.soft.toFixed(1)}, laneDist(mix(c, w, uCutOwn))) * clearOfShip(c);
    vAlpha = fade * k; vDist = length(cameraPosition - c); vUv = position.xy;
    vLit = .5 + .5 * abs(dot(normalize(cross(e1, e2) + 1e-5), uKeyDir));
    return projectionMatrix * viewMatrix * vec4(mix(c, w, max(step(.004, vAlpha), uCutOwn)), 1.);
  }`,Va=`
  ${We}
  ${vt}
  attribute vec4 aA, aB; uniform vec4 uBox;
  void main(){
    // aA: place along the wind, across it, height, speed (25 to 35 m/s); aB: size (m), tumble rate, phase. The box is fixed
    // in the world and spans the bottle from wall to wall down the wind; a fleck that leaves its lee end comes in again at
    // its weather end, faded at both. No fleck flies lower than 1.5 m over the sea under it.
    float a = mod(aA.x + aA.w * uTime, uBox.z) - uBox.z * .5;
    vec2 xz = uBox.xy + uWind * a + vec2(-uWind.y, uWind.x) * aA.y;
    float y = aA.z + 1.6 * sin(uTime * (.6 + .2 * aB.y) + aB.z) - .012 * (a + uBox.z * .5);
    vec3 c = vec3(xz.x, max(y, swell(xz).x + 1.5), xz.y);
    float th = uTime * aB.y + aB.z;
    vec3 wd = vec3(uWind.x, 0., uWind.y), cx = vec3(-uWind.y, 0., uWind.x), up = vec3(0., 1., 0.);
    vec3 e1 = cx * cos(th) + up * sin(th), e2 = normalize(wd * 1.3 + .5 * (cx * sin(th * .7) - up * cos(th * .7)));
    gl_Position = dab(c, e1 * .7 * aB.x, normalize(cross(e1, e2) + 1e-5) * .7 * aB.x, .5 * aB.x, smoothstep(0., 40., uBox.z * .5 - abs(a)) * smoothstep(0., ${X.fade.toFixed(1)}, ${((X.s1-X.s0)/2).toFixed(1)} - abs(aA.y)));
  }`,ja=`
  ${We}
  ${vt}
  attribute vec4 aA, aB;
  void main(){
    // aA: metres across the bottle, life (s), its share of that life at the clock's zero, which crest (0 or 1);
    // aB: size (m), rise (m), pace down the wind (m/s), tumble phase
    float life = aA.y, age = fract(uTime / life + aA.z) * life, tb = uTime - age, len = ${S.len.toFixed(1)}, s0 = ${(S.full-S.len).toFixed(1)};
    float sc = (1.5708 - uPhase.w + ${(6.2832/S.per).toFixed(6)} * tb) / ${(6.2832/S.len).toFixed(6)} + aA.w * len;
    float sb = s0 + mod(sc - s0, 2. * len), s = sb + ${(.9*S.len/S.per).toFixed(3)} * age;
    vec2 ax = vec2(${$.x.toFixed(5)}, ${$.z.toFixed(5)});
    vec2 xz = vec2(${L.x.toFixed(1)}, ${L.z.toFixed(1)}) + ax * s + vec2(-ax.y, ax.x) * aA.x + uWind * aB.z * age;
    float env = 1. - smoothstep(${S.full.toFixed(1)}, ${S.from.toFixed(1)}, sb), k = age / life;
    vec3 c = vec3(xz.x, swell(xz).x + .4 + aB.y * pow(clamp(k, 0., 1.), .7), xz.y);
    float th = uTime * 2.3 + aB.w;
    vec3 e1 = normalize(vec3(cos(th), sin(th), .3)), e2 = normalize(cross(e1, vec3(.3, .2, 1.)));
    float size = aB.x * (.6 + 1.2 * k);
    gl_Position = dab(c, e1 * size, e2 * size, .75 * size, smoothstep(0., .12, k) * (1. - smoothstep(.45, 1., k)) * smoothstep(.2, .6, env) * .8);
  }`,ia=`
  ${We}
  ${vt}
  attribute vec4 aA, aB;
  void main(){
    // the bow comes down once in every 9 s of the ship's own pitch law: cyc is 0 as she passes level going down.
    // aA: the dab's throw (m/s: outward from her side, up, along her keel) and its delay (a share of the cycle);
    // aB: size (m), its place along the bow from the stem aft (m), phase (its sign: the weather or the lee bow), life (s)
    float cyc = fract(uTime / ${He.pitchPer.toFixed(1)} + (uMotion.y - 3.14159) / 6.28318);
    float t = (cyc - aA.w) * ${He.pitchPer.toFixed(1)}, life = aB.w, sd = aB.z < 0. ? 1. : -1.;
    // it starts where the sea meets her bow, 1 to 4 m outside her side, is thrown outward and up, and is carried down the wind
    float zo = -153. + aB.y;
    vec3 o = vec3(sd * (halfBeam(zo) + 1. + 3. * fract(abs(aB.z) * 3.7)), 1.5, zo);
    vec3 c = o + vec3(sd * aA.x, aA.y, aA.z) * max(t, 0.) + .5 * vec3(uWind.x * 13., -12., uWind.y * 13.) * t * t;
    float fade = step(0., t) * smoothstep(0., .2, t) * (1. - smoothstep(life * .55, life, t));
    // each dab is round (never drawn out) and tumbles about the line of its own flight
    // (a dab breaks up as it flies: from a quarter of its life on it is drawn finer, down to 0.45 of its size)
    float th = uTime * 5. + aB.z * 6.28, size = aB.x * (1. + .2 * max(t, 0.)) * (1. - .55 * smoothstep(.25, .8, clamp(t / max(life, .1), 0., 1.)));
    vec3 vel = vec3(sd * aA.x, aA.y, aA.z) + vec3(uWind.x * 13., -12., uWind.y * 13.) * max(t, 0.);
    vec3 e1 = normalize(vel + 1e-4), e2 = normalize(cross(e1, vec3(cos(th), sin(th), .3)) + 1e-5);
    vId = aB.z;
    gl_Position = dab(c, e1 * size, e2 * size, .75 * size, fade);
  }`,_a=`
  ${We}
  ${vt}
  attribute vec4 aA; uniform vec4 uBox;
  void main(){
    // slanting threads down the wind through the whole box, RAIN_LEN metres long; aA: along the wind, across it, height, speed share
    float a = mod(aA.x + 17. * aA.w * uTime, uBox.z) - uBox.z * .5, y = uBox.w - mod(aA.z + 30. * aA.w * uTime, uBox.w);
    vec2 xz = uBox.xy + uWind * a + vec2(-uWind.y, uWind.x) * aA.y;
    vec3 c = vec3(xz.x, y, xz.y), fall = normalize(vec3(uWind.x * 17., -30., uWind.y * 17.));
    vec3 side = normalize(cross(fall, cameraPosition - c) + 1e-5);
    // the thin-line rule (the one reading of the picture): never drawn narrower than a pixel and a half
    float dist = length(cameraPosition - c), px = 2. / (projectionMatrix[1][1] * max(uPxH, 1.));
    float w = max(${la.toFixed(2)}, 1.5 * px * dist);
    gl_Position = dab(c, side * w, fall * ${e(ra)}, ${e(ra/2)}, smoothstep(0., 40., uBox.z * .5 - abs(a)) * smoothstep(0., ${X.fade.toFixed(1)}, ${((X.s1-X.s0)/2).toFixed(1)} - abs(aA.y)) * smoothstep(0., 12., min(y, uBox.w - y)) * .6 * (${la.toFixed(2)} / w));
  }`,Ya=`
  precision highp float;
  uniform vec3 uWhite, uWhiteShade, uKeyCol, uSky, uSeaSky, uFogCol; uniform float uFogDen, uSoft, uLace; uniform sampler2D uNoise;
  varying float vAlpha, vLit, vId; varying vec2 vUv; varying float vDist;
  void main(){
    float r = length(vUv) * 2.;
    float a = vAlpha * mix(1. - smoothstep(.55, 1., r), 1. - smoothstep(.0, 1., abs(vUv.x) * 2.), uSoft);
    if (uLace > .5) {
      // A TORN SHEET OF LACE (the bow's spray): the same web as the breaking crests (threads round holes: two
      // isolines of the slow noise), each sheet a piece of its own (vId), ragged at its rim by the same noise. Where
      // the sheet is under forty pixels across the web gives way to its own mean cover (no shimmer far off).
      vec2 q = vUv * .3 + vec2(fract(vId * 7.3), fract(vId * 3.1));
      float la = texture2D(uNoise, q).r, lb = texture2D(uNoise, q * 2.3 + .5).b, lc = texture2D(uNoise, q * .6 + .2).g;
      float web = max(1. - smoothstep(.012, .05, abs(la - .5)), .8 * (1. - smoothstep(.015, .055, abs(lb - .52))));
      float rim = 1. - smoothstep(.4, 1., r + 1.2 * (lc - .5));
      a = vAlpha * rim * mix(web, .32, smoothstep(.02, .05, fwidth(vUv.x) + fwidth(vUv.y)));
    }
    if (a < .01) discard;
    // (the burst's lace is the sea's own white thrown up: it is lit as the crests are, by the sea's sky and the key)
    vec3 col = mix(uWhiteShade, uWhite, vLit) * (mix(uSky * 1.6, uSeaSky * 1.25, uLace) + uKeyCol * vLit * .9);
    float f = 1. - exp(-uFogDen * uFogDen * vDist * vDist);
    gl_FragColor = vec4(mix(col, uFogCol, clamp(f, 0., 1.)), a);
  }`;async function lt(t,o,i,d,r,m,h=1,p=0){const s=new c.InstancedBufferGeometry,f=new c.PlaneGeometry(1,1,1,h);s.index=f.index,s.setAttribute("position",f.attributes.position);const n=new Float32Array(o*4),w=new Float32Array(o*4);for(let A=0;A<o;A++)i(n,w,A*4),A%400===399&&await t.yield();s.setAttribute("aA",new c.InstancedBufferAttribute(n,4)),s.setAttribute("aB",new c.InstancedBufferAttribute(w,4)),s.instanceCount=o;const y=new c.Mesh(s,new c.ShaderMaterial({uniforms:{...r,uSoft:{value:m},uLace:{value:p},uCutOwn:{value:h>1?1:0}},vertexShader:d,fragmentShader:Ya,transparent:!0,depthWrite:!1,side:c.DoubleSide}));return y.frustumCulled=!1,y.renderOrder=4,y}var Qa={id:"gale-in-green-glass",name:"Gale in Green Glass",category:"ocean",media:["air"],weirdness:.5,async build(t){const o=t.vary||{},i=t.quality&&t.quality.detail||1,d=o.hour||"any",r=o.mood??.5,m=o.density??1,h=!!o.rare,p=k=>t.core.makeRng(t.core.hashSeed("gale:"+k+":"+t.seed)),s=p("weather"),f=p("flecks"),n=p("spray"),w=p("lace"),y=p("rain"),A=p("sea"),I=p("lamp"),E=p("spindrift"),D=p("room"),V=p("moth"),re=p("runup"),Q=p("hearth"),R=s.chance(.4),ce=s.range(0,38),Z=.8+.2*r,M={lamp:.16,key:.86},H=[0,1,2,3].map(()=>A.range(0,6.2832)),W=[0,1,2,3].map(()=>I.range(0,6.2832)),J=[0,1,2,3].map(()=>D.range(0,6.2832)),ie=[0,1].map(()=>Q.range(0,6.2832)),pe=[0,1,2,3].map(()=>V.range(0,6.2832)),Ze=re.range(0,6.2832),C=new c.Scene;C.background=new c.Color(tt.col),C.fog=new c.FogExp2(tt.col,pt);const Le=Aa.clone(),b=new c.HemisphereLight("#6FB592","#2C5F56",1);C.add(b);const z=new c.DirectionalLight("#FFD9A0",2.6);z.position.copy(Le).multiplyScalar(400),C.add(z),await t.yield();const oe=jt();await t.yield();const ne=wa(oe),ze=ne.length;await t.yield();const Ce=ka(ne);await t.yield();const ee=await va(t,{palette:et,rain:R?1:0});C.add(ee.object),await t.yield();const xt={warm:{col:"#FFD9A0",heart:[2,1.75,1.4],flame:1,day:0,key:"#FFD9A0"},grey:{col:"#DCE8D8",heart:[1.7,1.8,1.7],flame:1.1,day:1,key:"#DCE8D8"},fire:{col:"#E0552A",heart:[1.2,.29,.09],flame:.55,day:0,key:"#FFD9A0"}},bt=d==="day"||d==="dawn"?"grey":d==="night"?"fire":"warm",xe=xt[bt],Be=new c.Vector3().crossVectors($,new c.Vector3(0,1,0)).normalize(),Mt=Le.clone(),be=qt.clone(),na=Math.atan2(Mt.dot(Be),Mt.y),ca=new c.Vector3(be.clone().sub(L).dot($),be.y,be.clone().sub(L).dot(Be)),ha=(r-.5)*12/360,Oe=k=>{const u=new c.Color(k),v={};return u.getHSL(v),u.setHSL(v.h+ha,v.s,v.l)},yt=new c.Color(tt.col),Ft=new c.Color(xe.key),Tt=ee.uniforms.uNoise.value,gt=Ft.clone().multiplyScalar(.95),qe={deep:"#1C3F80",indigo:"#0D1A3C",black:"#040D14",lit:"#2B7396",chalk:"#EEEBE0",chalkShade:"#8E9FBE"},P={uMid:{value:L},uAxis:{value:$},uSide:{value:Be},uLamp:{value:be.clone()},uLampCol:{value:new c.Color(xe.col)},uLampHeart:{value:new c.Vector3().fromArray(xe.heart)},uLampR:{value:ca},uFlame:{value:new c.Vector4(0,0,xe.flame,0)},uRoomPh:{value:new c.Vector4().fromArray(J)},uHearthPh:{value:new c.Vector2().fromArray(ie)},uGlassLit:{value:Oe(et[0])},uGlassDeep:{value:Oe(et[1])},uFogCol:{value:yt},uSeaCol:{value:new c.Color(qe.deep)},uMoth:{value:new c.Vector4(ut.s,.5,0,0)},uTime:{value:0},uRunPh:{value:Ze},uLampK:{value:1},uPhiL:{value:na},uSeedK:{value:.4+.35*r},uFogDen:{value:pt},uDay:{value:xe.day},uNoise:{value:Tt},uState:{value:Z},uPhase:{value:new c.Vector4().fromArray(H)},uScatter:{value:new c.Vector4(A(),A(),A(),A())},uWind:{value:new c.Vector2(Pe.x,Pe.z)},uMotion:{value:new c.Vector2(ee.motion[0],ee.motion[1])},uMot:{value:new c.Vector2}};await t.yield();const pa=await za(t);await t.yield();const Nt=new c.Mesh(pa,new c.ShaderMaterial({uniforms:P,vertexShader:qa,fragmentShader:`precision highp float;
#define WLINE_PIECE_AT (`+ea("vW.xz")+`)
`+We+Na+Ea+Ma+Fa+Ta+Da,side:c.DoubleSide}));Nt.frustumCulled=!1,C.add(Nt),await t.yield();const Se=(k,u=1)=>new c.Color(k).multiplyScalar(u),rt=ut.up*Math.PI/180,Dt=new c.Vector3(0,Math.cos(rt),0).addScaledVector(Be,-Math.sin(rt)),Rt=new c.Vector3(0,Math.sin(rt),0).addScaledVector(Be,Math.cos(rt)),Je={uVMid:{value:L},uVAxis:{value:$},uMothN:{value:Dt},uMothT:{value:Rt},uLampAt:{value:be},uMoth:P.uMoth,uTime:P.uTime,uRunPh:P.uRunPh,uState:P.uState,uPhase:P.uPhase,uScatter:P.uScatter,uWind:P.uWind,uMotion:P.uMotion,uMot:P.uMot,uKeyDir:{value:Le},uKeyCol:{value:gt},uSeaSky:{value:new c.Color(.5,.66,.74).multiplyScalar(.88)},uSeaGround:{value:new c.Color(.22,.34,.5).multiplyScalar(.5)},uFogCol:{value:yt},uDeep:{value:Se(qe.deep,1.5)},uIndigo:{value:Se(qe.indigo,1.4)},uBlack:{value:Se(qe.black,1.5)},uLitBlue:{value:Se(qe.lit,1.25)},uWhite:{value:Se(qe.chalk)},uWhiteShade:{value:Se(qe.chalkShade)},uSheen:{value:Oe(et[0])},uBlurC:P.uLamp,uFogDen:{value:pt},uCaus:{value:.35},uLant:{value:new c.Vector3(...g.lantern)},uLantCol:{value:Se(et[7])},uNet:{value:new c.Vector2},uNoise:{value:Tt}},da=await Ka(t);await t.yield();const Wt=new c.Mesh(da,new c.ShaderMaterial({uniforms:Je,vertexShader:Ha,fragmentShader:Pa}));Wt.frustumCulled=!1,C.add(Wt),await t.yield();let me=[];for(let k=ke.stray;;k+=.05){const u=new c.Vector3,v=new c.Vector3,nt=new c.Vector3,Ae=new c.Vector3;let fe=0;const Ie=(te,ct)=>(ne.posAtDist(fe+(te-fe)*ct,nt).sub(u),Ae.subVectors(v,u),nt.addScaledVector(Ae,-nt.dot(Ae)/Math.max(Ae.lengthSq(),1e-6)).length());me=[ne.posAtDist(0,u).clone().addScaledVector($,-ue.level),ne.posAtDist(0,u).clone()];for(let te=2;te<ze;te+=1)ne.posAtDist(fe,u),ne.posAtDist(te,v),te%20===0&&await t.yield(),(Math.max(Ie(te,.25),Ie(te,.5),Ie(te,.75))>k||te-fe>=80)&&(fe=te-1,me.push(ne.posAtDist(fe,u).clone()));if(me.push(ne.posAtDist(ze,u).clone()),me.length<=ke.n||k>.6)break;await t.yield()}for(;me.length<ke.n;)me.push(me[me.length-1].clone());await t.yield();const Ct=(X.s0+X.s1)/2,it=(X.s1-X.s0)/2,Bt={value:450},Ot=new c.Vector2,Xe={...Je,uSky:{value:Oe("#6FB592").multiplyScalar(.4)},uPxH:Bt,uLane:{value:me},uBox:{value:new c.Vector4(L.x+$.x*Ct,L.z+$.z*Ct,X.len,X.top)}},ma=Math.round(Ga*m*i),It=await lt(t,ma,(k,u,v)=>{k[v]=f.range(0,X.len),k[v+1]=f.range(-it,it),k[v+2]=3+78*Math.pow(f(),1.8),k[v+3]=f.range(25,35),u[v]=f.range(.15,.5),u[v+1]=f.range(2.5,7)*(f.chance(.5)?1:-1),u[v+2]=f.range(0,6.28)},Va,Xe,0);It.name="flying white",C.add(It),await t.yield();const Ht=await lt(t,Math.round(2600*i),(k,u,v)=>{k[v]=E.range(-235,235),k[v+1]=E.range(2.2,4.5),k[v+2]=E(),k[v+3]=E.chance(.5)?1:0,u[v]=E.range(.5,1.4),u[v+1]=E.range(3,10),u[v+2]=E.range(10,22),u[v+3]=E.range(0,6.28)},ja,Xe,0);Ht.name="spindrift",C.add(Ht),await t.yield();const Pt=await lt(t,Math.round(3600*i),(k,u,v)=>{k[v]=n.range(1,9),k[v+1]=9+21*Math.sqrt(n()),k[v+2]=n.range(-8,5),k[v+3]=n.range(.05,.3),u[v]=.14+.7*Math.pow(n(),3),u[v+1]=n.range(0,26),u[v+2]=(n.chance(.6)?1:-1)*n.range(.02,1),u[v+3]=n.range(2.4,4.2)},ia,Xe,0);Pt.name="bow spray",C.add(Pt),await t.yield();const Kt=await lt(t,Math.round(st.n*i),(k,u,v)=>{k[v]=w.range(1,7),k[v+1]=12+16*Math.sqrt(w()),k[v+2]=w.range(-6,4),k[v+3]=w.range(.04,.22),u[v]=w.range(st.size[0],st.size[1]),u[v+1]=w.range(0,22),u[v+2]=(w.chance(.7)?1:-1)*w.range(.02,1),u[v+3]=w.range(st.life[0],st.life[1])},ia,Xe,0,1,1);Kt.name="bow lace",C.add(Kt),await t.yield();const $t=await lt(t,Math.round(6700*i),(k,u,v)=>{k[v]=y.range(0,X.len),k[v+1]=y.range(-it,it),k[v+2]=y.range(0,X.top),k[v+3]=y.range(.8,1.2)},_a,Xe,1,4);return $t.name="rain",$t.visible=R,C.add($t),await t.yield(),ee.setLight({moth:{mid:L,axis:$,n:Dt,t:Rt,lamp:be},keyDir:Le,sky:Oe("#6FB592").multiplyScalar(.5),ground:Oe("#3F7F72").multiplyScalar(.45),fogCol:yt,fogDen:pt}),{scene:C,path:ne,duration:Ce.duration,pace:Ce.pace,ride:"none",companion:"none",camera:{fov:68,near:.3,far:2400,lookAhead:20,sway:1,bank:Math.tan((He.heel+He.roll)*ge)/.28},pois:Ce.pois,portal:{shape:"rect",width:2*g.opening.hx,height:2*g.opening.hy,frame:0,veil:"#D9C88C",revealDistance:400,blendDistance:25},post:{exposure:1.72,bloom:{strength:.4,radius:.6,threshold:.95},grade:{saturation:1.05,contrast:1.03,vignette:.3,grain:.02}},update(k,u,v,nt){ee.update(k,u,v),P.uTime.value=u;{const Qe=xa(u,ee.motion);Je.uMot.value.set(Qe.roll,Qe.pitch)}const Ae=.925+.045*Math.sin(u*6.2832/5.3+W[0])+.03*Math.sin(u*6.2832/13+W[1]),fe=h?q(0,1.2,(u+ce)%38)*(1-q(2,4.5,(u+ce)%38)):0;P.uLampK.value=Ae*(1-M.lamp*fe);const Ie=5*Math.sin(u*.9+W[2]),te=4*Math.sin(u*1.37+W[3]);P.uLamp.value.copy(be).addScaledVector(Be,Ie*4).setY(be.y+te*4);const ct=Math.pow(Math.max(0,Math.sin(u*.37+J[3])),8);P.uFlame.value.x=.55*Math.sin(u*.83+W[2])+.25*Math.sin(u*2.1+W[3])+.5*ct*Math.sin(u*6.1+J[3]),P.uFlame.value.y=.25+1.6*ct;{const Qe=(u/Ee.cycle+pe[0]/6.2832)%1,fa=q(0,.25,Qe)-q(.5,.75,Qe),ua=Math.pow(Math.max(0,Math.sin(u*6.2832/17+pe[2])),10);P.uMoth.value.set(ut.s+Ee.walk*(2*fa-1),.5+.5*Math.sin(u*6.2832/Ee.flap+pe[1]),.07*ua*Math.sin(u*38+pe[3]),0),ee.uniforms.uMoth.value.copy(P.uMoth.value)}Je.uNet.value.set(Ie*.6,te*.6),ee.uniforms.uNet.value.copy(Je.uNet.value),gt.copy(Ft).multiplyScalar(.95*Ae*(1-(1-M.key)*fe)),ee.setLight({keyCol:gt}),t.renderer.getDrawingBufferSize(Ot),Bt.value=Ot.y},dispose(){ee.dispose()}}}};export{Qa as default,ka as flightPlan,jt as routePoints,Xa as seaHeight,Ja as wallGapAt};
