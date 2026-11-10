import*as m from"three";const P=170,j=-430,_=-120,T=-420,U=-900,N=[_,P,-700],F=[-60,190,-1300];function q(){const t=[],s=(f,h,u,n)=>{const e=t[t.length-1];t.push({x:f,z:h,nx:u,nz:n,s:e?e.s+Math.hypot(f-e.x,h-e.z):0})},o=(f,h)=>Math.hypot(f+50,h+700)<560?6:30,r=(f,h,u,n,e,a)=>{const w=Math.hypot(u-f,n-h);for(let v=0;v<w;){const l=f+(u-f)*v/w,d=h+(n-h)*v/w;s(l,d,e,a),v+=o(l,d)}},i=(f,h,u,n,e,a)=>{for(let w=0;w<=6;w++){const v=n+(e-n)*w/6;s(f+Math.cos(v)*u*a,h+Math.sin(v)*u*a,Math.cos(v),Math.sin(v))}};return r(-1400,-2e3,-1400,T-40,-1,0),i(-1360,T-40,40,Math.PI,Math.PI/2,1),r(-1360,T,_-40,T,0,1),i(_-40,T-40,40,Math.PI/2,0,1),r(_,T-40,_,U+40,1,0),i(_+40,U+40,40,0,Math.PI/2,-1),r(_+40,U,340,U,0,1),i(340,U-40,40,Math.PI/2,0,1),r(380,U-40,380,-2e3,1,0),t}const B=t=>{const s=Math.sin(t*127.1+311.7)*43758.5453;return s-Math.floor(s)},M=(t,s,o)=>{const r=Math.min(1,Math.max(0,(o-t)/(s-t)));return r*r*(3-2*r)};function D(t,s,o,r,i,f,h,u,n){const e=Math.floor(t/o),a=B(e*1.37+r),w=B(e*2.71+r+5.1),v=B(e*3.19+r+9.3),l=B(e*4.43+r+2.7);if(l>n)return 0;const d=Math.abs(t-(e+.3+.4*a)*o),b=i+(f-i)*w,y=-260+360*v;return(h+(u-h)*(.5*a+.5*l/n))*(1-M(b-3.5,b+2.5,d))*M(y-50,y+20,s)}function $(t,s,o){const i=Math.floor(t/230),f=B(i*1.91+o+3.3),h=B(i*2.33+o+7.9),u=B(i*3.77+o+1.3);if(B(i*5.21+o+6.1)>.78)return[0,0];const e=Math.abs(t-(i+.3+.4*f)*230),a=13+9*h,w=P-14-40*u,v=-220+200*f;return[(1-M(a-2,a+2,e))*(8-34*M(w-3,w+3,s)),(44+16*h)*(1-M(4,7.5,Math.abs(e-a-6)))*M(v-40,v+20,s)]}const H=(()=>{let t=1e9,s=0;for(const o of q()){const r=Math.hypot(o.x-N[0],o.z-N[2]);r<t&&(t=r,s=o.s)}return s})();function X(t,s,o,r){const i=(o-j)/(P-j),f=Math.floor((o-j)/14),h=Math.sin(f*12.9898)*43758.5453,u=h-Math.floor(h)-.5,n=40*t.n2(.37,.71);let e=22*t.n2(s/170,3.1)+15*Math.abs(t.n2(s/44,7.7+i*.9))-6+6*t.n2(s/63,i*3+20)+7*u+2*t.n2(s/9,o/12);e+=9*t.n2(Math.floor((o-j)/62)*3.3+.5,s/240);const a=$(s,o,n);e+=a[0];let w=Math.max(D(s,o,110,n,9,19,26,58,.8),D(s+23,o,47,n+50,4,7,14,30,.55),a[1]);const v=M(16,64,Math.abs(s-H));return w*=v*M(20,70,Math.abs(s-r)),e=(e-w)*v+(2-12*(1-i)**.7)*(1-v),e>0&&(e*=M(14,60,Math.abs(s-r))),e=Math.min(Math.max(e,-28-40*M(P,P-50,o)),26),o<-300&&(e+=(-300-o)*1.1),[e,Math.min(1,w/34)]}function Y(t,s,o,r){return X(t,s,o,r)[0]}const E=t=>-700+11*Math.sin(t/70)*Math.min(1,Math.max(0,(-135-t)/80));function L(t,s,o,r,i,f=[]){const h=Math.min(1,Math.max(0,r/30)),u=(3.2*t.n2(s/90,o/90)+1.6*t.n2(s/23,o/23+9))/1.5+.3*t.n2(s/11+3,o/11),n=Math.floor(u);let e=P+h*1.5*(n+M(.78,1,u-n));for(const v of f){const l=Math.hypot(s-v[0],o-v[1]);l<v[2]+10&&(e+=(v[3]-e)*(1-M(v[2],v[2]+10,l)))}const a=Math.hypot(s-F[0],o-F[2]);e+=5.2*Math.max(0,1-a/150)**1.5*h,a<30&&(e=Math.max(e,F[1]-10-Math.max(0,a-14)*.5));const w=Math.abs(o-E(s));if(s<-110&&w<60&&(e=Math.min(e,168.9+Math.max(0,w-9)*.12)),i){const v=i.nearestXZ(s,o);v.dist<40&&o<-880&&(e=Math.min(e,v.y-9.6+v.dist*.05),e+=h*Math.max(0,v.y-15.5-v.dist*.2-e))}return e}const ee=()=>[-760,-620,-480,-340,-220,-150,-119].map(t=>[t,169.75,E(t)]),J=`
attribute vec3 aSK; varying vec3 vW, vN, vSK;
#include <fog_pars_vertex>
void main(){ vec4 mvPosition = viewMatrix*vec4(position, 1.); gl_Position = projectionMatrix*mvPosition; vW = position; vN = normal; vSK = aSK;
  #include <fog_vertex>
}`,I=`
float h1(vec2 p){ vec3 q = fract(vec3(p.xyx)*.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y)*q.z); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f); return mix(mix(h1(i), h1(i + vec2(1., 0.)), f.x), mix(h1(i + vec2(0., 1.)), h1(i + vec2(1., 1.)), f.x), f.y); }
float fb(vec2 p){ return .5*vn(p) + .3*vn(p*2.03 + 7.) + .2*vn(p*4.1 + 19.); }`,Q=`
uniform vec3 uSun, uSunCol, uSkyCol, uGroundCol; uniform float uTime; uniform vec4 uBun[16], uRing; uniform vec3 uBunC[16];
varying vec3 vW, vN, vSK;
#include <fog_pars_fragment>
${I}
// the wall's quartzite at a place: s runs along the face, y up; ny is the face's upward lean
vec3 wallRock(float s, float y, float fw, float ny){
    // beds 4 to 24 m thick. The sum always rises with height (by .03 a metre at the least: the noise's steepest slope is 1.5 a cell), so a bed is a
    // level band that waves a little and never closes into a loop
    float by = y/6.5 + 1.5*vn(vec2(1.3, y*.05)) + .6*vn(vec2(s*.007, y*.006)) + .2*vn(vec2(s*.045, y*.02)), bed = floor(by), fy = by - bed, hb = h1(vec2(bed, 5.));
    float big = fb(vec2(s*.0045, y*.0042)), mid = fb(vec2(s*.021 + 5., y*.027));
    vec3 rock = mix(vec3(.45, .28, .25), vec3(.54, .37, .17), smoothstep(.3, .7, hb*.2 + big*.92));      // pink-grey and ochre, in great patches
    rock = mix(rock, vec3(.33, .29, .3), smoothstep(.5, .8, vn(vec2(s*.011, y*.016 + 9.)))*.8);          // grey weathered faces
    rock = mix(rock, mix(vec3(.6, .4, .34), vec3(.66, .55, .38), h1(vec2(bed, 2.))), .42*h1(vec2(bed, 7.)));   // bed by bed a change of colour: rose, cream
    rock *= (.76 + .48*mid)*(.88 + .24*hb)*(.8 + .4*fb(vec2(s*.09, y*.13)));
    float keepM = 1. - smoothstep(3., 16., fw), keepN = 1. - smoothstep(.2, 1.3, fw);
    rock *= 1. + (.13*smoothstep(.78, .97, fy) - .36*(1. - smoothstep(0., .13 + fw*.2, fy)))*keepM;    // each bed's lit rim, and the dark seam under the bed
    // upright joints, two families. The wide ones (6 to 16 m apart: the spacing wanders) run through four beds at a stroke and end at a seam,
    // set off from those of the four beds above and below, with a small lean; half of them are open. The narrow ones (1.5 to 5 m apart, one in
    // five open) stand within one bed and show only where the wall is near. A joint is a straight crack, never the outline of a noise (such
    // outlines close into loops), and no two courses bond like brickwork
    float gb = floor(by*.25), hg = h1(vec2(gb, 17.));
    float j1 = (s + 6.*vn(vec2(s*.045, gb*1.3)))/11. + hg*7.3 + .1*vn(vec2(gb*1.7, y*.035)), j2 = (s + 2.4*vn(vec2(s*.13, bed*3.7 + 2.)))/3.1 + hb*3.1 + .06*vn(vec2(bed*2.3 + 5., y*.3));
    float c1 = abs(fract(j1) - .5)*11., c2 = abs(fract(j2) - .5)*3.1;                                    // about the metres to the nearest joint of each family
    float on1 = step(.5, h1(vec2(floor(j1), gb + 11.))), on2 = step(.8, h1(vec2(floor(j2), bed + 23.)));
    rock *= 1. - .5*max((1. - smoothstep(.03, .1 + fw*1.2, c1))*on1*keepM, (1. - smoothstep(.015, .05 + fw*1.2, c2))*on2*(1. - smoothstep(.1, .5, fw))*.45);
    float fl = fract(y/.9 + .7*vn(vec2(s*.05, y*.2)) + hb*3.);
    rock *= mix(1., (.8 + .4*fb(vec2(s*.6, y*.9)))*(.62 + .38*smoothstep(0., .34, fl))*(.8 + .4*vn(vec2(s*3.1, y*4.3))), keepN);   // near: thin laminations, grain
    float keepP = 1. - smoothstep(.3, 2.2, fw), py = y/2.4 + 1.6*vn(vec2(s*.013, y*.03)) + 1.1*vn(vec2(s*.004 + 3., y*.1)) + .5*vn(vec2(s*.06, y*.08)) + hb*5., hp = h1(vec2(floor(py), 9.));   // rises with height everywhere (.12 a metre at the least): partings wave, none loops
    rock *= (1. - (.06 + .3*hp*hp)*(1. - smoothstep(0., .12 + fw*.35, py - floor(py)))*keepP)*mix(1., .8 + .4*hp, keepP);   // near and middle: partings within a bed, each its own shade
    float grp = smoothstep(.48, .7, vn(vec2(s*.013, 4.3))), thr = smoothstep(.6, .82, vn(vec2(s*.2, 1.7)))*(.45 + .55*vn(vec2((s + hb*1.1)*1.3, y*.01)))*(.6 + .4*h1(vec2(bed, 31.)));   // each bed takes the stain its own way: a thread is broken at the seams
    float ylen = 150. - 480.*vn(vec2(s*.33, 9.1));
    float wet = grp*thr*smoothstep(ylen - 70., ylen + 40., y)*(.6 + .4*vn(vec2(s*.6, y*.035)));          // black where water runs: narrow threads, each its own length
    wet = max(wet, (1. - smoothstep(4., 16., abs(vW.z + 700.)))*step(vW.x, -100.)*.95);                  // the dark ledge of the fall
    rock = mix(rock, vec3(.04, .04, .045), clamp(wet*1.15, 0., .88));
    float lm = smoothstep(.3, .52, vn(vec2(s*.03, bed*3.1)))*smoothstep(.22, .5, vn(vec2(s*.12, bed*1.7 + y*.03)));   // where a ledge carries a garden, and the green that trails down from it
    float ledge = max(max(smoothstep(.66, .92, fy), smoothstep(.2, .7, fy)*smoothstep(.45, .7, vn(vec2(s*.8, bed*1.3))))*lm, smoothstep(.3, .62, ny)*smoothstep(.26, .54, vn(vec2(s*.12, bed*1.7 + y*.03))));
    rock = mix(rock, mix(rock*1.3, vec3(.055, .15, .04)*(.6 + .8*vn(vec2(s*.7, y*.5)))*mix(1., .5 + h1(floor(vec2(s, y)*2.5)), keepN*.8), smoothstep(.25, .5, vn(vec2(s*.21, bed)))), ledge*.9);   // pale ledges, hanging gardens (tufts when near)
    float fringe = smoothstep(138., 169., y)*smoothstep(.4, .66, vn(vec2(s*.045, 7.3)))*smoothstep(.38, .75, vn(vec2(s*.9, y*.07)) + .4*smoothstep(158., 170., y));
    rock = mix(rock, vec3(.07, .2, .05)*(.65 + .7*vn(vec2(s*1.3, y*.8))), fringe*.85);                                    // gardens that trail down from the rim, in stretches
    rock = mix(rock, vec3(.3, .16, .1)*(.7 + .6*vn(vW.xz*.08)), 1. - smoothstep(-360., -300., y));                        // red-brown scree
  return rock;
}
void main(){
  vec3 n = normalize(vN), V = normalize(cameraPosition - vW), col; float s = vW.x - vW.z, y = vW.y, fw = length(fwidth(vW)), ft = sqrt(max(length(dFdx(vW))*length(dFdy(vW)), 1e-8)), pool = 0., topK = step(.5, vSK.y), rimD = (vSK.y - 1.)*1000.;
  if(vSK.y < .5){
    vec3 fc = cross(dFdx(vW), dFdy(vW)); fc = fc/max(length(fc), 1e-9); if(dot(fc, V) < 0.) fc = -fc;
    n = normalize(mix(n, fc, .22));                                                          // planes of rock, not folds of cloth                                                   // the wall: quartzite in level beds of uneven thickness
    vec3 an = abs(normalize(vN)); float wx = an.x*an.x*an.x*an.x, wz = an.z*an.z*an.z*an.z; wx = wx/max(wx + wz, 1e-5); wz = 1. - wx;
    float ny = normalize(vN).y; col = vec3(0.);                       // by three axes, nothing stretched: a face that looks east or west is drawn by z and height, one that looks
    if(wx > .03) col += wx*wallRock(vW.z + 37., y, fw, ny);             // north or south by x and height (blended where it turns), and what lies level is a ledge, drawn in plan
    if(wz > .03) col += wz*wallRock(vW.x, y, fw, ny);
    float lvl = smoothstep(.4, .75, max(ny, fc.y));                    // a face that lies near level is a shelf: it is drawn in plan, as the top is, so that no bed is stretched across it
    if(lvl > 0.){ vec2 q = vW.xz; vec3 sh = mix(vec3(.47, .3, .24), vec3(.58, .41, .24), vn(q*.09))*(.82 + .36*vn(q*.21));
      sh = mix(sh, vec3(.1, .22, .06)*(.7 + .6*vn(q*1.3)), smoothstep(.5, .72, vn(q*.06 + 21.))*.85); col = mix(col, sh, lvl); }
  } else {                                                          // the top: bare sandstone of the wall's own warm colours, a few wandering fissures, sand and moss beside them, many still pools
    vec2 p = vW.xz;                                                 // level ground seen low: ft is the mean of a pixel's two reaches, so its drawing holds far out
    float keep = 1. - smoothstep(.5, 4., ft), keepB = 1. - smoothstep(2., 14., ft), keepN = 1. - smoothstep(.06, .5, ft);
    float t5 = vn(p*.022 + 9.)*5. + .35*vn(p*.07), st = fract(t5), plate = h1(vec2(floor(t5), 3.));
    float edge = (1. - smoothstep(0., .03 + ft*.2, st))*keepB;                                           // a slab's edge
    float f1 = abs(vn(p*.031 + 3.) - .5), f2 = abs(vn(p*.012 + 41.) - .5);                               // two families of fissures that wander, each of uneven width
    float w1 = .003 + .016*vn(p*.09 + 2.), w2 = .002 + .01*vn(p*.05 + 8.);
    float fis = max(1. - smoothstep(w1*.5, w1 + ft*.012, f1), 1. - smoothstep(w2*.5, w2 + ft*.005, f2))*keepB;
    float along = max(1. - smoothstep(w1, w1*4. + .02, f1), 1. - smoothstep(w2, w2*4. + .012, f2));        // the ground beside a fissure
    vec3 rock = mix(vec3(.47, .3, .24), vec3(.58, .41, .24), plate)*(.82 + .36*vn(p*.21))*(.9 + .2*vn(p*.045 + 5.));   // rose and ochre, slab by slab
    rock = mix(rock, vec3(.36, .32, .3), smoothstep(.55, .8, vn(p*.03 + 12.))*.5);                       // grey weathered rock
    rock *= 1. - .5*smoothstep(.76, .82, vn(p*.33 + 40.))*keep;                                          // potholes
    rock *= mix(1., .84 + .32*h1(floor(p*4.)), keepN*.5);                                                // near: grain
    float riser = 1. - smoothstep(.9, .985, n.y); rock = mix(rock, vec3(.16, .11, .09), riser*.6);       // the face of a low step
    float sand = max(along*smoothstep(.45, .7, vn(p*.07 + 4.)), smoothstep(.8, .84, vn(p*.05 + 3.) + .1*vn(p*.21)))*(1. - riser);   // pink sand: small drifts beside fissures and in hollows
    float rip = sin(dot(p, vec2(.8, .6))*5.5 + 6.*vn(p*.4));
    rock = mix(rock, vec3(.74, .5, .45)*mix(1., 1. + .1*rip, keepN), sand*.9);
    float moss = along*smoothstep(.5, .75, vn(p*.13 + 21.))*(1. - sand);                                 // moss in drifts along the fissures
    rock = mix(rock, vec3(.12, .24, .07)*(.7 + .6*vn(p*1.7)), moss*.8);
    rock = mix(rock, vec3(.06, .045, .04), max(fis*.85, edge*.5));
    float q = step(.988, h1(floor(p*2.2)))*keep*(1. - sand*.5);                                          // quartz that glints
    col = rock + q*2.2*pow(max(dot(reflect(-V, n), uSun), 1e-4), 6.);
    float riv = (1. - smoothstep(6., 13., abs(vW.z - vSK.z)))*step(vW.x, -112.), lev = smoothstep(.975, .995, n.y);
    col = mix(col, vec3(.11, .075, .045), riv);                                                          // the tea river's wet bed
    float rm = length(p - uRing.xz), pf = vn(p*.014 + 77.) + .1*vn(p*.09 + 5.), pf2 = vn(p*.047 + 13.) + .12*vn(p*.2 + 3.);   // many still pools, large and small, with crisp shores
    pf += .16*(1. - smoothstep(22., 30., abs(rm - 44.)))*step(.45, vn(p*.05 + 31.));
    float feet = 0.;                                                                                     // one more at each low bunch's feet, on the side of the avenue's axis
    for(int i = 0; i < 16; i++){ vec2 c = uBun[i].xz + vec2(sign(uRing.x + 8. - uBun[i].x)*12., 0.); feet = max(feet, (1. - smoothstep(5., 6.5, length((p - c)*vec2(1.5, .8)) + 1.5*vn(p*.3)))*step(.5, uBun[i].w)*step(uBun[i].w, 20.)); }
    float rill = (1. - smoothstep(w2*.3, w2*.8 + ft*.004, f2))*keepB;                                    // rills: water standing in the long fissures
    float wat = max(max(smoothstep(.7, .712 + fw*.02, pf), smoothstep(.74, .755 + fw*.02, pf2)), max(feet, rill));
    float deepK = max(smoothstep(.722, .74, pf), smoothstep(.765, .78, pf2));                             // well inside a large pool the water covers a low step of the slabs too (a tilt under about 20 degrees): one sheet, never a dry facet standing in it; steeper rock (the ring's table, a pad's flank) stays dry
    pool = wat*max(lev, deepK*smoothstep(.925, .955, n.y))*(1. - riv)*smoothstep(10., 24., rimD)*smoothstep(17., 20., rm);
    col *= 1. - .45*max(smoothstep(.672, .7, pf), smoothstep(.71, .74, pf2))*lev;                        // a wet dark shore
    col += (rock + .1)*vec3(1., .84, .58)*uRing.w*4.5/(1. + rm*rm*.0022)*(1. - smoothstep(70., 130., rm));   // the ring's glow lying on the rock
  }
  float ndl = max(dot(n, uSun), 0.), rec = (1. - topK)*clamp(vSK.z, 0., 1.);
  col = col*(uSunCol*(ndl + .12*topK)*(1. - .75*rec) + mix(uGroundCol*.7, uSkyCol*(1. + .5*topK), n.y*.5 + .5)*(1. - .5*rec)
    + uSkyCol*vec3(.7, .84, 1.08)*.45*(1. - topK)*(1. - smoothstep(0., .3, ndl))*(1. - .4*rec))*.3183;      // rock in shade takes the sky's blue light: its beds still read
  float gz = 1. - max(V.y, 0.), g2 = gz*gz;
  vec3 mirror = mix(uSkyCol*.2, mix(uSkyCol*.34, uSkyCol*.46 + uSunCol*.07, g2*g2), .06 + .94*g2*g2);   // a pool takes the sky's colour
  mirror += uSunCol*pow(max(dot(reflect(-V, vec3(0., 1., 0.)), uSun), 1e-4), 500.)*1.5;
  float shd = 0.;                                                    // the low bunches' shadows lie long across the top (a disc each, thrown down the sun)
  for(int i = 0; i < 16; i++){ float w = uBun[i].w; vec2 sc = uBun[i].xz - uSun.xz*max(uBun[i].y - y, 0.)/max(uSun.y, .08); shd = max(shd, (1. - smoothstep(w*.5, max(w*1.05, w*.5 + .01), length(vW.xz - sc)))*step(.5, w)); }
  col = mix(col, col*vec3(.36, .43, .6), shd*topK);
  col = mix(col, mirror, pool);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;function te(t,s){const o=[],r=(l,d)=>Math.min(Math.max(Math.min(_-l,T-d),U-d),l+1400,380-l);let i=Math.floor(s.length);for(let l=0;l<=s.length;l+=1){const d=s.posAtDist(l);if(r(d.x,d.z)>0){i=l;break}}const f=s.posAtDist(i),h=[f.x,f.z],u=q();let n=0,e=1e9;for(const l of u){const d=Math.hypot(l.x-h[0],l.z-h[1]);d<e&&(e=d,n=l.s)}const a=u.map(l=>{const d=Y(t,l.s,P,n);return[l.x+l.nx*d,l.z+l.nz*d]}),w=(l,d)=>{if(r(l,d)>115)return 99;let b=1e9;for(let y=0;y<a.length-1;y++){const k=a[y],K=a[y+1],S=K[0]-k[0],A=K[1]-k[1],C=Math.max(0,Math.min(1,((l-k[0])*S+(d-k[1])*A)/(S*S+A*A+1e-9))),z=Math.hypot(l-k[0]-S*C,d-k[1]-A*C);z<b&&(b=z)}return b};return{P:u,rim:a,inset:r,rimDist:w,topAt:(l,d)=>{const b=w(l,d);return L(t,l,d,b,s,o)-(b>75?.5:0)},pads:o,cross:h,crossS:n,crossAt:i}}const Z=(t,s,o,r)=>{const i=[];for(let f=t;f<s;){i.push(f);let h=r;for(const[u,n,e]of o)f>=u-e&&f<n&&(h=e);f+=h}return i.push(s),i};async function oe(t,s,o,r,i,f=[]){const{P:h}=t,u=[];for(let c=P;c>110;c-=6)u.push(c);for(let c=110;c>-100;c-=11)u.push(c);for(let c=-100;c>-330;c-=26)u.push(c);u.push(-340,-385,j-8);const n=[],e=[],a=[],w=h.length,v=u.length;for(let c=0;c<w;c++){const p=h[c];for(const g of u){const[x,W]=X(s,p.s,g,t.crossS);n.push(p.x+p.nx*x,g,p.z+p.nz*x),e.push(p.s,0,W)}c%40===0&&await i()}for(let c=0;c<w-1;c++)for(let p=0;p<v-1;p++){const g=c*v+p,x=g+v;a.push(g,g+1,x,x,g+1,x+1)}const l=[0,3,7,12,19,28,40,56,75],d=l.length,b=n.length/3;for(let c=0;c<w;c++){const p=h[c],g=t.rim[c];for(const x of l){const W=g[0]-p.nx*x,V=g[1]-p.nz*x;n.push(W,x?L(s,W,V,t.rimDist(W,V),o,t.pads):P,V),e.push(p.s,1+x/1e3,-700+11*Math.sin(W/70)*Math.min(1,Math.max(0,(-135-W)/80)))}c%20===0&&await i()}for(let c=0;c<w-1;c++)for(let p=0;p<d-1;p++){const g=b+c*d+p,x=g+d;a.push(g,x,g+1,x,x+1,g+1)}const y=Z(-1400,380,[[-205,85,5]],60),k=Z(-2e3,-385,[[-1410,-905,5],[-735,-665,5]],40),K=n.length/3,S=y.length,A=k.length;for(let c=0;c<A;c++){for(let p=0;p<S;p++){const g=y[p],x=k[c],W=t.rimDist(g,x);n.push(g,L(s,g,x,Math.max(W,30),o,t.pads)-.5,x),e.push(0,1.2,-700+11*Math.sin(g/70)*Math.min(1,Math.max(0,(-135-g)/80)))}c%6===0&&await i()}for(let c=0;c<A-1;c++)for(let p=0;p<S-1;p++){if(t.inset((y[p]+y[p+1])/2,(k[c]+k[c+1])/2)<38||t.inset(y[p],k[c])<30||t.inset(y[p+1],k[c+1])<30||t.inset(y[p+1],k[c])<30||t.inset(y[p],k[c+1])<30)continue;const g=K+c*S+p,x=g+S;a.push(g,x,g+1,x,x+1,g+1)}await i();const C=new m.BufferGeometry;C.setAttribute("position",new m.Float32BufferAttribute(n,3)),await i(),C.setAttribute("aSK",new m.Float32BufferAttribute(e,3)),C.setIndex(a),await i(),C.computeVertexNormals(),await i(),C.computeBoundingSphere();const z=m.UniformsUtils.merge([m.UniformsLib.fog,{}]);Object.assign(z,{uTime:{value:0},uSun:{value:r.sun},uSunCol:{value:r.sunCol},uSkyCol:{value:r.sky},uGroundCol:{value:r.ground}});const R=[],O=[];for(let c=0;c<16;c++){const p=f[c]||[0,0,0,0,0,0,0];R.push(new m.Vector4(p[0],p[1],p[2],p[3])),O.push(new m.Vector3(p[4],p[5],p[6]))}z.uBun={value:R},z.uBunC={value:O},z.uRing={value:new m.Vector4(F[0],F[1],F[2],.6)};const G=new m.Mesh(C,new m.ShaderMaterial({name:"hosMountain",uniforms:z,vertexShader:J,fragmentShader:Q,fog:!0,side:m.DoubleSide}));return G.name="tableMountain",{object:G,uniforms:z,triangles:a.length/3}}function se(t,s,o){const r=new m.PlaneGeometry(5200,5200,40,40);r.rotateX(-Math.PI/2),r.translate(200,0,-900);const i=r.attributes.position;for(let a=0;a<i.count;a++)i.setY(a,j+30*t.n2(i.getX(a)/420,i.getZ(a)/420));r.computeVertexNormals();const f=m.UniformsUtils.merge([m.UniformsLib.fog,{}]);Object.assign(f,{uTime:{value:0},uSun:{value:s.sun},uSunCol:{value:s.sunCol},uSkyCol:{value:s.sky},uGroundCol:{value:s.ground},uLit:{value:o.lit},uShade:{value:o.shade}});const h=`varying vec3 vW;
    #include <fog_pars_vertex>
    void main(){ vec4 mvPosition = viewMatrix*vec4(position, 1.); gl_Position = projectionMatrix*mvPosition; vW = position;
    #include <fog_vertex>
    }`,u=new m.Mesh(r,new m.ShaderMaterial({name:"hosForest",uniforms:f,fog:!0,vertexShader:h,fragmentShader:`
    uniform vec3 uSun, uSunCol, uSkyCol; uniform float uTime; varying vec3 vW;
    #include <fog_pars_fragment>
    ${I}
    float crown(vec2 p){ return .6*vn(p*.075) + .4*vn(p*.19 + 13.); }
    void main(){
      vec2 p = vW.xz; float fw = length(fwidth(p)), keep = 1. - smoothstep(4., 30., fw);
      float c = crown(p), e = 2.5;
      vec3 n = normalize(vec3((crown(p - vec2(e, 0.)) - crown(p + vec2(e, 0.)))*9.*keep, 1., (crown(p - vec2(0., e)) - crown(p + vec2(0., e)))*9.*keep));
      vec3 col = mix(vec3(.035, .11, .03), vec3(.16, .3, .07), smoothstep(.25, .8, c))*(.75 + .5*vn(p*.011));
      col = mix(col, vec3(.3, .4, .1), smoothstep(.78, .9, vn(p*.03 + 50.))*keep*.8);                    // emergent crowns
      float rv = abs(fb(p*.0011 + 2.) - .5), w = .012 + .008*vn(p*.004);
      col = mix(col, vec3(.6, .5, .32), 1. - smoothstep(w*1.6, w*2.3, rv));                               // sandbanks
      col = mix(col, vec3(.3, .2, .1) + .25*uSkyCol*.3183, 1. - smoothstep(w*.8, w*1.1, rv));              // the brown river
      col = col*(uSunCol*max(dot(n, uSun), 0.)*(.55 + .45*c) + uSkyCol*.9)*.3183;
      float mist = smoothstep(.52, .75, fb(p*.0035 + vec2(uTime*.004, 0.)))*(1. - smoothstep(.3, .62, vn(p*.0016 + 9.)));
      col = mix(col, (uSunCol*.5 + uSkyCol)*.26, mist*.8);                                                 // morning mist in the hollows
      col = mix(col, uSkyCol*.3, .28);                                                                     // 600 m of air
      gl_FragColor = vec4(col, 1.);
      #include <fog_fragment>
    }`}));u.name="forestFloor";const n=new m.PlaneGeometry(9e3,9e3,1,1);n.rotateX(-Math.PI/2),n.translate(0,o.y,0);const e=new m.Mesh(n,new m.ShaderMaterial({name:"hosCloudFloor",uniforms:f,fog:!0,transparent:!0,depthWrite:!1,vertexShader:h,fragmentShader:`
    uniform vec3 uSun, uSunCol, uLit, uShade; uniform float uTime; varying vec3 vW;
    #include <fog_pars_fragment>
    ${I}
    void main(){
      vec2 p = vW.xz + vec2(uTime*2., uTime*.8); float b = fb(p*.006), b2 = fb(p*.021 + 5.);
      float d1 = length(max(vec2(vW.x + 120., vW.z + 420.), 0.)), d2 = length(max(vec2(vW.x - 380., vW.z + 900.), 0.)), dBay = max(vW.z + 520., vW.x - 520.) + 70.*(fb(vW.xz*.009) - .5);
      float open = min(min(smoothstep(20., 95., d1 - 60.*b2), smoothstep(20., 95., d2 - 60.*b2)), smoothstep(-30., 60., dBay - 50.*b2));      // shreds, then nothing, toward the walls
      float a = open*smoothstep(.12, .5, b + .5*b2 - .15 + .6*open)*(1. - smoothstep(3200., 4400., length(vW.xz - vec2(-50., -700.))));
      vec3 col = mix(uShade, uLit, smoothstep(.3, .75, b*.6 + b2*.5));
      gl_FragColor = vec4(col, a);
      #include <fog_fragment>
    }`}));return e.name="cloudFloor",e.renderOrder=1,e.frustumCulled=!1,{forest:u,floor:e,uniforms:f}}function ne(t){const o=[],r=[],i=[];for(let n=0;n<3;n++)for(let e=0;e<=46;e++){const a=e/46,w=N[1]-.4-560*a**1.45,v=N[0]+2+n*2.2+(26+n*7)*(1-Math.exp(-a*2.6)),l=5.5+34*a**1.1+n*1.5;if(o.push(v,w,N[2]-l,v,w,N[2]+l),r.push(-1,a,n,1,a,n),e<46){const d=(n*47+e)*2;i.push(d,d+1,d+2,d+1,d+3,d+2)}}const f=new m.BufferGeometry;f.setAttribute("position",new m.Float32BufferAttribute(o,3)),f.setAttribute("aU",new m.Float32BufferAttribute(r,3)),f.setIndex(i),f.computeBoundingSphere();const h=m.UniformsUtils.merge([m.UniformsLib.fog,{}]);Object.assign(h,{uTime:{value:0},uSun:{value:t.sun},uSunCol:{value:t.sunCol},uSkyCol:{value:t.sky}});const u=new m.Mesh(f,new m.ShaderMaterial({name:"hosFall",uniforms:h,fog:!0,transparent:!0,depthWrite:!1,side:m.DoubleSide,vertexShader:`attribute vec3 aU; varying vec3 vU, vW;
      #include <fog_pars_vertex>
      void main(){ vec4 mvPosition = viewMatrix*vec4(position, 1.); gl_Position = projectionMatrix*mvPosition; vU = aU; vW = position;
      #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSun, uSunCol, uSkyCol; uniform float uTime; varying vec3 vU, vW;
      #include <fog_pars_fragment>
      ${I}
      void main(){
        float t = clamp(vU.y, 0., 1.), x = vU.x;
        // the seconds a drop has fallen to this height (it falls faster as it goes: 26 m a second at the lip, 86 at the foot). The strands are
        // drawn on that clock and ride down with the water, so they keep their drawing however long the world's clock has run: nothing shears
        float fu = sqrt(clamp((${N[1].toFixed(1)} - vW.y)/560., 0., 1.)), tau = 18.667*(fu - .43333*log(1. + 2.3077*fu));
        float nstr = mix(9. + vU.z*3., 3.5, smoothstep(.12, .8, t));                                 // its strands gather into a few wide veils
        float st = vn(vec2(x*nstr + vU.z*17., (tau - uTime)*.8 + 80.)), st2 = vn(vec2(x*23. + vU.z*5., (tau - uTime)*3.3 + 300.));
        float rag = .5 + .45*vn(vec2(vW.y*.03 + vU.z*7., uTime*.2));                                 // a ragged, fraying edge
        float body = st*.65 + st2*.35, edge = 1. - smoothstep(.2, .95, abs(x) + .5*(rag - .7) + .3*(vn(vec2(x*4. + vU.z*3., vW.y*.09)) - .5));
        float strands = smoothstep(.3, .72, st*.55 + st2*.6);
        float water = edge*mix(strands, 1., .6*(1. - smoothstep(0., .5, t)))*(1. - smoothstep(.5, .88, t))*mix(.95, .6, t);
        float mist = edge*smoothstep(.2, .6, t)*(1. - smoothstep(.8, 1., t))*(.22 + .45*st)*.6;      // and all of it is mist before the forest
        float a = max(water, mist);
        vec3 V = normalize(cameraPosition - vW); float back = pow(max(dot(-V, uSun), 1e-4), 3.);
        vec3 col = mix(vec3(.6, .4, .2), mix(vec3(.62, .68, .76), vec3(.97), smoothstep(.3, .75, st2*.6 + st*.5)), smoothstep(0., .06, t + body*.03))*(uSunCol*(.6 + .7*back) + uSkyCol)*.3183;
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`}));return u.name="theFall",u.renderOrder=1.5,{object:u,uniforms:h}}function ae(t,s){const o=new m.InstancedBufferGeometry,r=t.length,i=new Float32Array(r*4),f=new Float32Array(r*4),h=new m.Box3,u=new m.Vector3;o.setAttribute("position",new m.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),o.setIndex([0,1,2,0,2,3]),t.forEach((a,w)=>{i.set([a[0],a[1],a[2],a[6]],w*4),f.set([a[3],a[4],a[5],a[7]||0],w*4),h.expandByPoint(u.set(a[0],a[1],a[2]))}),o.setAttribute("aC",new m.InstancedBufferAttribute(i,4)),o.setAttribute("aS",new m.InstancedBufferAttribute(f,4)),o.instanceCount=r,o.boundingSphere=h.getBoundingSphere(new m.Sphere),o.boundingSphere.radius+=260;const n=m.UniformsUtils.merge([m.UniformsLib.fog,{}]);Object.assign(n,{uTime:{value:0},uSunCol:{value:s.sunCol},uSkyCol:{value:s.sky}});const e=new m.Mesh(o,new m.ShaderMaterial({name:"hosVeils",uniforms:n,fog:!0,transparent:!0,depthWrite:!1,vertexShader:`attribute vec4 aC, aS; uniform float uTime; varying vec2 vUv; varying float vA, vPh;
      #include <fog_pars_vertex>
      void main(){
        vec3 c = aC.xyz + vec3(14.*sin(uTime*.11 + aC.w), 4.*sin(uTime*.07 + aC.w*1.7), 10.*sin(uTime*.09 + aC.w*2.3));   // a bounded drift along the walls
        float h = mod(uTime*aS.w + aC.w*3.5, 22.), sm = step(.001, aS.w), grow = mix(1., .35 + h*.09, sm);                // smoke (aS.w > 0): it rises 22 m from its stack, widens, thins, and begins again
        c = mix(c, aC.xyz + vec3(1.2*sin(h*.3 + aC.w) + h*.28, h, 1.*sin(h*.23 + aC.w*2.)), sm);
        vec4 mvPosition = viewMatrix*vec4(c, 1.);
        vA = aS.z*mix(smoothstep(.6, 2.5, length(mvPosition.xyz)), smoothstep(0., 2.5, h)*(1. - h/22.), sm); vUv = position.xy; vPh = aC.w;   // a veil thins only by true distance, inside 0.6 to 2.5 m of the eye (none is dealt where the route comes)
        mvPosition.xy += position.xy*aS.xy*grow;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`uniform vec3 uSunCol, uSkyCol; uniform float uTime; varying vec2 vUv; varying float vA, vPh;
      #include <fog_pars_fragment>
      ${I}
      void main(){
        float r = length(vUv), nz = fb(vUv*1.6 + vec2(vPh*3.1 + uTime*.012, vPh*1.7));
        float a = vA*(1. - smoothstep(.1, 1., r + .55*(nz - .5)))*(.5 + .7*nz);
        gl_FragColor = vec4((uSunCol*.5 + uSkyCol*.9)*.3183*vec3(.96, .98, 1.), a);
        #include <fog_fragment>
      }`}));return e.name="mistVeils",e.renderOrder=2,{object:e,uniforms:n}}function re(t,s){const o=[];for(const[n,e,a,w]of[[3100,-1500,620,200],[1900,-3300,520,250],[3e3,900,700,170],[-700,-4600,800,230],[1500,2600,560,190]]){const v=new m.CylinderGeometry(a*.92,a*1.12,w+120,30,4,!1),l=v.attributes.position,d=t()*9;for(let b=0;b<l.count;b++){const y=Math.atan2(l.getZ(b),l.getX(b)),k=1+.2*s.n2(Math.cos(y)*1.6+d,Math.sin(y)*1.6)+.06*s.n2(y*5+d,l.getY(b)/90);l.setX(b,l.getX(b)*k),l.setZ(b,l.getZ(b)*k*1.25)}v.translate(n,(w-120)/2,e),o.push(v.toNonIndexed())}const r=o.reduce((n,e)=>n+e.attributes.position.count,0),i=new Float32Array(r*3);let f=0;for(const n of o)i.set(n.attributes.position.array,f),f+=n.attributes.position.count*3,n.dispose();const h=new m.BufferGeometry;h.setAttribute("position",new m.BufferAttribute(i,3)),h.computeVertexNormals();const u=new m.Mesh(h,new m.MeshLambertMaterial({color:"#8f8690"}));return u.name="farTableMountains",u}export{j as FLOOR,N as LIP,U as NORTH,F as RING,T as SOUTH,P as TOP,_ as WEST,ne as makeFall,re as makeFarTepuis,se as makeFloors,te as makeLandPlan,oe as makeMountain,ae as makeVeils,q as planCurve,ee as riverCourse,L as topHeight,Y as wallOff,X as wallRelief};
