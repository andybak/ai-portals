import*as U from"three";import{makeRng as No,hashSeed as Po,makePath as ca}from"../kit/core.js";const He=Math.PI/180,Eo=(a,o,e)=>{const t=Math.min(1,Math.max(0,(e-a)/(o-a)));return t*t*(3-2*t)},s={RIM_A:94,RIM_B:78,WALL_H:48.5,BASE_H:.45,BAYS:80,PIER_W:2.4,PIER_D:2.7,ARCH_W:4.3,COL_W:.89,LEVEL:[.45,10.5,22.35,33.95,48.5],ARCH_H:[7.05,6.45,6.4],ENTAB_H:[2.35,2.1,2.1],BAND_H:[0,2.35,1.95,2.1],AXIS_ARCH_W:5.5,RING2_IN:2.7+5.8,RING3_IN:2.7+5.8+4.5,STATUE_H:2.3,SHIELD_D:2,MAST_T:.4,MAST_TOP:51.5,ARENA_A:41.5,ARENA_B:25,RING_DEPTH:52.5,RING_DEPTH_B:53,PODIUM_H:3.4,PODIUM_D:5.15,PODIUM_N:5,PODIUM_TOP:5.15,PODIUM_STEP:.9,ROW_D:.73,ROW_H:.44,ROWS1:20,WALK_D:1.25,WALK_WALL:1,ROWS2:16,WALL5_D0:32.7,WALL5_D1:34.2,WALL5_TOP:27.9,COLONNADE_N:80,COLONNADE_H:7,GAL_D0:34.2,GAL_STEP_D:.62,GAL_STEP_H:.45,GAL_N:11,GAL_D1:41,STAND_D1:43,GAL_TOP:32.85,ROOF_Y:36,BOX_W:10.5,BOX_D:4.1,BOX_TOP:5.65,GATE_W:5,GATE_H:7,WATER_A:40,WATER_B:23.5,WATER_Y:-.25,WATER_DEEP:1,MASTS:240,RINGROPE_A:43.5,RINGROPE_B:27,RINGROPE_Y:30,ROPE_SAG:1.8,CLOTH_DRAW:31,CLOTH_DRAW_MIN:26,CLOTH_DRAW_MAX:34,CLOTH_BELLY:1.5,ROPE_SWAY:.1,PAVE_W:17.5,POST_H:1.5,RING:[-19.5,7.5,0],RING_R:4};function zo(a,o,e,t=0){const i=new Float64Array(8193);let h=a,c=0;for(let d=1;d<=8192;d++){const R=d/8192*Math.PI*2,m=a*Math.cos(R),T=o*Math.sin(R);i[d]=i[d-1]+Math.hypot(m-h,T-c),h=m,c=T}const A=i[8192],p=[];let l=0;for(let d=0;d<e;d++){let R=((d+t)/e%1+1)%1*A;for(R<i[l]&&(l=0);l<8192&&i[l+1]<R;)l++;const m=(R-i[l])/Math.max(1e-9,i[l+1]-i[l]),T=(l+m)/8192*Math.PI*2,v=a*Math.cos(T),L=o*Math.sin(T);let y=o*Math.cos(T),E=a*Math.sin(T);const b=Math.hypot(y,E);y/=b,E/=b,p.push({x:v,z:L,nx:y,nz:E,t:T,s:R})}return p.perimeter=A,p}const _o=a=>s.ARENA_A+a,To=a=>s.ARENA_B+a*(s.RING_DEPTH_B/s.RING_DEPTH),De=(()=>{const a={podium:[],rows1:[],rows2:[],gallery:[]};for(let o=0;o<s.PODIUM_N;o++)a.podium.push({d0:o*s.PODIUM_D/s.PODIUM_N,d1:(o+1)*s.PODIUM_D/s.PODIUM_N,y:s.PODIUM_H+o*(s.PODIUM_TOP-s.PODIUM_H)/s.PODIUM_N});a.Z1_D0=s.PODIUM_D,a.Z1_Y0=s.PODIUM_TOP+s.PODIUM_STEP;for(let o=0;o<s.ROWS1;o++)a.rows1.push({d0:a.Z1_D0+o*s.ROW_D,d1:a.Z1_D0+(o+1)*s.ROW_D,y:a.Z1_Y0+(o+1)*s.ROW_H});a.Z1_D1=a.Z1_D0+s.ROWS1*s.ROW_D,a.Z1_Y1=a.Z1_Y0+s.ROWS1*s.ROW_H,a.Z2_D0=a.Z1_D1+s.WALK_D,a.Z2_Y0=a.Z1_Y1+s.WALK_WALL;for(let o=0;o<s.ROWS2;o++)a.rows2.push({d0:a.Z2_D0+o*s.ROW_D,d1:a.Z2_D0+(o+1)*s.ROW_D,y:a.Z2_Y0+(o+1)*s.ROW_H});a.Z2_D1=a.Z2_D0+s.ROWS2*s.ROW_D,a.Z2_Y1=a.Z2_Y0+s.ROWS2*s.ROW_H;for(let o=0;o<s.GAL_N;o++)a.gallery.push({d0:s.GAL_D0+o*s.GAL_STEP_D,d1:s.GAL_D0+(o+1)*s.GAL_STEP_D,y:s.WALL5_TOP+(o+1)*s.GAL_STEP_H});return a})(),xo={STAND:1.75,ARM:.5,LEAP:.3};function za(){const a=[],o=xo.STAND+xo.ARM;for(const e of De.podium)a.push({zone:"podium",d:(e.d0+e.d1)/2,d0:e.d0,d1:e.d1,y:e.y+o});for(const e of De.rows1)a.push({zone:"first zone",d:(e.d0+e.d1)/2,d0:e.d0,d1:e.d1,y:e.y-s.ROW_H+o+xo.LEAP});for(const e of De.rows2)a.push({zone:"second zone",d:(e.d0+e.d1)/2,d0:e.d0,d1:e.d1,y:e.y-s.ROW_H+o+xo.LEAP});for(const e of De.gallery)a.push({zone:"gallery",d:(e.d0+e.d1)/2,d0:e.d0,d1:e.d1,y:e.y+o});return a.push({zone:"standing room",d:(s.GAL_D1+s.STAND_D1)/2,d0:s.GAL_D1,d1:s.STAND_D1,y:s.GAL_TOP+o}),a}function Fa(a=33.67,o=87.4){const e=a*He,t=(o-110)*He;return[Math.cos(e)*Math.cos(t),Math.sin(e),Math.cos(e)*Math.sin(t)]}const Vo={DOWN_DEG:27.5,CREST_CLEAR:12,STEP:3,OUT:{RADIUS:30,RAMP_OUT:10,RAMP_IN:16,SLOPE:.38,CREST_EASE:50,FOOT_EASE:40,ENTRY_Y:23.5,ENTRY_SIDE:30,H:.05}};let ea="",Ko=null;function wo(a=Vo){const o=JSON.stringify(a);if(o===ea)return Ko;const e=a.OUT,t=oo.TERRACE,r=s.RING[0],i=Math.tan(a.DOWN_DEG*He),h=F=>s.RING[1]+i*(F-r),c=s.RIM_A,A=s.MAST_TOP+a.CREST_CLEAR,p=3*(h(c)-A)/i,l=F=>{const at=c-F,rt=at/p;return at>=p?h(F):A-i*p*(rt*rt-rt*rt*rt/3)},d=[t.CX+t.TEMPLE_W/2+e.ENTRY_SIDE,e.ENTRY_Y,t.CZ-t.D/2+t.TEMPLE_FRONT+t.TEMPLE_L],R=1/e.RADIUS,m=F=>{const at=F*e.RADIUS-(e.RAMP_OUT+e.RAMP_IN)/2,rt=e.RAMP_OUT+at+e.RAMP_IN,Lt=Math.max(1,Math.round(rt/e.H)),bt=rt/Lt,zt=new Float64Array(2*Lt+2),j=et=>et<e.RAMP_OUT?R*et/e.RAMP_OUT:et<e.RAMP_OUT+at?R:R*(1-(et-e.RAMP_OUT-at)/e.RAMP_IN);let Rt=c,Gt=0,gt=Math.PI/2;zt[0]=Rt;for(let et=0;et<Lt;et++)gt-=j((et+.5)*bt)*bt,Rt+=Math.sin(gt)*bt,Gt+=Math.cos(gt)*bt,zt[2*et+2]=Rt,zt[2*et+3]=Gt;return{x:Rt,z:Gt,phi:Math.PI/2-F,len:rt,h:bt,n:Lt,pts:zt}},T=F=>{const at=m(F);return(d[0]-at.x)*Math.cos(at.phi)-(d[2]-at.z)*Math.sin(at.phi)};let v=30*He,L=89*He;const y=T(v);for(let F=0;F<48;F++){const at=(v+L)/2;T(at)>0==y>0?v=at:L=at}const E=m((v+L)/2),b=(d[0]-E.x)*Math.sin(E.phi)+(d[2]-E.z)*Math.cos(E.phi),ot=E.len+b,g=(A-e.ENTRY_Y-e.SLOPE*(e.FOOT_EASE+e.CREST_EASE)/2)/e.SLOPE,M=F=>F<e.CREST_EASE?e.SLOPE*F/e.CREST_EASE:F<e.CREST_EASE+g?e.SLOPE:F<e.CREST_EASE+g+e.FOOT_EASE?e.SLOPE*(1-(F-e.CREST_EASE-g)/e.FOOT_EASE):0,G=Math.ceil(ot/e.H),q=new Float64Array(G+2);q[0]=A;for(let F=0;F<=G;F++)q[F+1]=q[F]-M((F+.5)*e.H)*e.H;const X=F=>{F=Math.min(ot,Math.max(0,F));const at=F/e.H,rt=Math.min(G,Math.floor(at)),Lt=q[rt]+(q[rt+1]-q[rt])*(at-rt);if(F>=E.len)return[E.x+Math.sin(E.phi)*(F-E.len),Lt,E.z+Math.cos(E.phi)*(F-E.len)];const bt=F/E.h,zt=Math.min(E.n-1,Math.floor(bt)),j=bt-zt;return[E.pts[2*zt]+(E.pts[2*zt+2]-E.pts[2*zt])*j,Lt,E.pts[2*zt+1]+(E.pts[2*zt+3]-E.pts[2*zt+1])*j]},ht=[];for(let F=ot;F>0;F-=1){const at=X(F);ht.push(at[0],at[2])}for(let F=c;F>=r;F-=1)ht.push(F,0);const tt=(F,at)=>{let rt=1e9;for(let Lt=0;Lt<ht.length;Lt+=2)rt=Math.min(rt,Math.hypot(ht[Lt]-F,ht[Lt+1]-at));return rt};return Ko={ringX:r,crestX:c,crestY:A,roundOver:p,inner:l,downAt:h,entry:d,head:90-(v+L)/2/He,straight:b,out:X,outLength:ot,outClimbFrom:e.CREST_EASE+g+e.FOOT_EASE,outTurnFrom:E.len,planDist:tt},ea=o,Ko}function fa(a=Vo){const o=wo(a),e=[],t=Math.round(o.outLength/a.STEP),r=o.crestX-o.ringX,i=Math.round(r/a.STEP);for(let h=0;h<=t;h++)e.push(o.out(o.outLength*(1-h/t)));for(let h=1;h<=i;h++){const c=o.crestX-r*h/i;e.push(h===i?[s.RING[0],s.RING[1],s.RING[2]]:[c,o.inner(c),0])}return e}const oa={PACE:{ENTRY:13,WALL:11,TURN:5.7,BOWL:7.6},RAMP:[{to:"WALL",from:"climb",until:"attic"},{to:"TURN",from:"attic",until:"turn"},{to:"BOWL",from:"crest",until:"roofEdge"}],LOOK_BAY:2,LOOK:{WHOLE:{at:"eye",w:.4,from:"start",to:"attic",fade:.4},ARCHES:{at:"arches",w:.6,from:"edge",to:"turn",fade:.42},TOP0:{at:"water",w:.25,from:"climb",to:"crest",fade:.3},TOP:{at:"water",w:.6,from:"attic",to:"crest",fade:.42},BOWL:{at:"ring",w:.55,from:"masts",to:"eye",fade:.42},BOATS:{at:"boats",w:.4,from:"crest",to:"eye",fade:.45},MID:{at:"water",w:.52,from:"roofEdge",to:"boatsEnd",fade:.35},HORSES:{at:"liberty",w:.55,from:"eye",to:"end",fade:.3},ATTIC:{at:"attic",w:.55,from:"attic",to:"masts",fade:.45},FOOT:{at:"foot",w:.45,from:"edge",to:"cornice",fade:.5}}};function da(a=oa){const o=vo(),e=mo.AR;return{eye:[0,s.RINGROPE_Y,0],arches:Bo(o[a.LOOK_BAY],0,s.LEVEL[2],0),attic:Bo(o[a.LOOK_BAY],0,Wt.SHIELD_Y,0),foot:Bo(o[a.LOOK_BAY+1],0,s.BASE_H,s.PAVE_W/2),ring:[s.RING[0],s.RING[1],s.RING[2]],boats:[e.WEST_X+e.PITCH,s.WATER_Y,0],water:[0,s.WATER_Y,0],liberty:[s.RING[0],s.WATER_Y,s.RING[2]]}}function Ba(a,o=Vo,e=oa){const t=a.length,r=wo(o),i=mo.AR,h=.25,c=Math.floor(t/h),A=(tt,F,at)=>{const rt=Math.min(1,Math.max(0,(at-tt)/(F-tt)));return rt*rt*(3-2*rt)},p=new Float64Array(c+1),l=new Float64Array(c+1),d=new Float64Array(c+1),R=new Float64Array(c+1);for(let tt=0;tt<=c;tt++){const F=a.posAtDist(tt*h);p[tt]=F.x,l[tt]=F.y,d[tt]=F.z,tt&&(R[tt]=R[tt-1]+Math.hypot(p[tt]-p[tt-1],d[tt]-d[tt-1]))}const m=(tt,F,at)=>{for(let rt=F;rt<=at;rt++)if(tt(rt))return rt*h;return at*h},T=tt=>{for(let F=1;F<=c;F++)if(R[F]>=tt)return(F-1+(tt-R[F-1])/(R[F]-R[F-1]))*h;return t},v=T(r.outLength),L=Math.round(v/h),y=tt=>m(F=>l[F]>=tt,0,L),E=tt=>m(F=>p[F]<=tt,L,c),b=Ro().terrace[4],ot={start:0,edge:m(tt=>d[tt]<=b,0,L),climb:T(r.outLength-r.outClimbFrom),attic:y(s.LEVEL[3]),turn:T(r.outLength-r.outTurnFrom),cornice:y(s.WALL_H),masts:y(s.MAST_TOP),crest:v,roofEdge:E(_o(s.GAL_D0)),eye:E(s.RINGROPE_A),boats:E(i.WEST_X+2*i.PITCH),boatsEnd:E(i.WEST_X),liberty:E(i.FREE_X+i.FREE_RX),end:t},g=e.PACE,M=tt=>{let F=g.ENTRY,at=g.ENTRY;for(const rt of e.RAMP)F+=(g[rt.to]-at)*A(ot[rt.from],ot[rt.until],tt),at=g[rt.to];return F},G=tt=>M(tt*t)/g.WALL;let q=0;for(let tt=.125;tt<t;tt+=.25)q+=.25/M(tt);const X=da(e),ht=Object.keys(e.LOOK).map(tt=>{const F=e.LOOK[tt];return{name:tt,at:X[F.at],from:ot[F.from]/t,to:ot[F.to]/t,weight:F.w,fade:F.fade}});return{place:ot,pace:G,pois:ht,duration:Math.round(q*10)/10}}const Ct={D_RING:s.RINGROPE_A-s.ARENA_A,SPAN:s.RIM_A-s.RINGROPE_A,RIPPLE:[.55,.3,.15],RATE:[1.7,2.9],WAVES:[9,17],PHASE:2.399963,SWAY_RATE:.9,RING_BREATH:.08,RING_RATE:.5,RUN:6,THROUGH:.5,SHADE:{THROUGH:.4,GLOW:.15,SKY:.28,BOUNCE:.8,TINT:1.5},EDGE:{WALL:1.6,ROOF:.7,HEM:.06}},ua={MIN:2,MAX:7,LEAD:.58,THIRD:.14,TONE:[.9,1.04]};function Wa(a,o=2){const e=s.MASTS,t=new Uint8Array(e),r=new Float32Array(e),i=ua,h=(p,l)=>p+Math.floor(a()*(l-p+1));let c=0;const A=(p,l,d)=>{for(let R=0;R<l&&c<e;R++,c++)t[c]=p,r[c]=d*(.985+.03*a())};for(;c<e;){const p=e-c;let l=h(i.MIN,i.MAX),d=h(i.MIN,i.MAX);if(p<=2*i.MAX)l=Math.min(Math.min(i.MAX,p-i.MIN),Math.max(Math.max(i.MIN,p-i.MAX),l)),d=p-l;else for(;p-l-d>0&&p-l-d<2*i.MIN;)if(d>i.MIN)d--;else if(l>i.MIN)l--;else break;const R=i.TONE[0]+(i.TONE[1]-i.TONE[0])*a(),m=a(),T=o>=3&&m<i.THIRD?3:m<i.THIRD+(1-i.THIRD)*i.LEAD?1:2;A(T,l,.96+.08*(R-i.TONE[0])/(i.TONE[1]-i.TONE[0])),A(0,d,i.TONE[0]+(i.TONE[1]-i.TONE[0])*a())}return{kind:t,tone:r}}function ka(a,o,e,t){const r=e*Ct.PHASE,i=Eo(0,.08,o),h=Ct.RIPPLE[0]+Ct.RIPPLE[1]*Math.sin(Ct.RATE[0]*t-Ct.WAVES[0]*o+r)+Ct.RIPPLE[2]*Math.sin(Ct.RATE[1]*t+Ct.WAVES[1]*o+2.3*r);return Math.sin(Math.PI*a)*i*h*s.CLOTH_BELLY}const $a=(()=>{let o=0;const e=[0];for(let i=1;i<=4096;i++){const h=(i-.5)/4096*Math.PI*2;o+=Math.hypot(s.RIM_A*Math.sin(h),s.RIM_B*Math.cos(h))*(Math.PI*2/4096),e.push(o)}let t=0,r=0;for(let i=0;i<4096;i++){const h=i/4096*Math.PI*2,c=e[i]/o-h/(Math.PI*2);t+=c*Math.sin(2*h)*2/4096,r+=c*Math.sin(4*h)*2/4096}return{c2:t,c4:r,perimeter:o,share:i=>i/(Math.PI*2)+t*Math.sin(2*i)+r*Math.sin(4*i)}})(),to={SIZE:140,DRIFT:[0,-7],EDGE:[.56,.78],DEPTH:.5},eo=`
uniform vec3 uSun; uniform vec3 uSunCol; uniform vec3 uSkyCol; uniform vec3 uBounceCol; uniform vec4 uHaze; uniform float uTime;
uniform vec4 uCloth; uniform vec3 uClothCol[3]; uniform vec4 uArc; uniform sampler2D uClothTex; uniform vec2 uCloudAt;
const float FA_A = ${s.ARENA_A.toFixed(2)}, FA_B = ${s.ARENA_B.toFixed(2)}, FA_K = ${(s.RING_DEPTH_B/s.RING_DEPTH).toFixed(6)};
// d of the seating ring's family of ellipses through the plan point p (Newton from d0; clamped where the family ends)
float famD(vec2 p, float d0) {
  float d = d0;
  for (int i = 0; i < 4; i++) {
    float a = FA_A + d, b = FA_B + FA_K * d;
    float f = p.x * p.x / (a * a) + p.y * p.y / (b * b) - 1.;
    float df = -2. * p.x * p.x / (a * a * a) - 2. * FA_K * p.y * p.y / (b * b * b);
    d = clamp(d - f / min(df, -1e-6), -20., 400.);
  }
  return d;
}
float clothLiftG(float a, float s, float j, float t) {
  float ph = j * ${Ct.PHASE.toFixed(6)}, env = smoothstep(0., .08, s);
  float w = ${Ct.RIPPLE[0].toFixed(2)} + ${Ct.RIPPLE[1].toFixed(2)} * sin(${Ct.RATE[0].toFixed(2)} * t - ${Ct.WAVES[0].toFixed(1)} * s + ph) + ${Ct.RIPPLE[2].toFixed(2)} * sin(${Ct.RATE[1].toFixed(2)} * t + ${Ct.WAVES[1].toFixed(1)} * s + 2.3 * ph);
  return sin(3.14159265 * clamp(a, 0., 1.)) * env * w;
}
// the cloth of strip j: its colour by the runs' law (clothRuns(), handed over as one row of 240 colours)
vec3 clothColour(float j) { return texture2D(uClothTex, vec2((mod(j, ${s.MASTS.toFixed(1)}) + .5) / ${s.MASTS.toFixed(1)}, .5)).rgb; }
// the tint of the light that has passed strip j's weave: the dye deepened (uCloth.z scales it so that plain linen keeps its brightness)
vec3 clothTint(float j) { return pow(clothColour(j), vec3(${Ct.SHADE.TINT.toFixed(2)})) * uCloth.z; }
// (order three, addendum 5, point 3) the same under the place jf of the rig (a strip's number with its fraction): mixed
// evenly from a strip's middle to its neighbour's, so that a dyed strip's shade ends softly beside a linen one's
vec3 clothTintSoft(float jf) { float j = floor(jf), a = jf - j - .5; return mix(clothTint(j), clothTint(j + sign(a)), abs(a)); }
// the sun that reaches the point P of the world: nought in the wall's or the roof's shade, the cloth's colour under a
// cloth, plain under the bare ropes and the open eye
// the clouds' shade on the open valley (INVENTED, OURS, see SKYSHADE): a field of soft patches drifting across the long
// axis on the world's clock, over the ground, the town and the outer wall's face. WHERE THE FIELD LIES IS THE VISIT'S
// OWN: uCloudAt, two numbers the world deals from a stream of its own (the field's shift, in patches). A law of place
// and time alone.
float famCh(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float famCn(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(famCh(i), famCh(i + vec2(1., 0.)), f.x), mix(famCh(i + vec2(0., 1.)), famCh(i + vec2(1., 1.)), f.x), f.y);
}
float cloudSun(vec3 P) {
  vec2 q = P.xz - uSun.xz * (P.y / max(uSun.y, .05));
  vec2 c = (q - vec2(${to.DRIFT[0].toFixed(2)}, ${to.DRIFT[1].toFixed(2)}) * uTime) / ${to.SIZE.toFixed(1)} + uCloudAt;
  float n = famCn(c) * .68 + famCn(c * 2.3 + 7.7) * .32;
  return 1. - ${to.DEPTH.toFixed(2)} * smoothstep(${to.EDGE[0].toFixed(2)}, ${to.EDGE[1].toFixed(2)}, n);
}
// the outer wall alone. x: 1. inside the oval, 2. outside it; y: the share of the sun the wall lets by: nought in its
// shade, one clear of it, and between them the soft rim of its top's shade (RIG.EDGE.WALL)
vec2 wallSun2(vec3 P) {
  vec3 L = uSun;
  float A = ${s.RIM_A.toFixed(1)}, B = ${s.RIM_B.toFixed(1)};
  float qa = L.x * L.x / (A * A) + L.z * L.z / (B * B), qb = 2. * (P.x * L.x / (A * A) + P.z * L.z / (B * B)), qc = P.x * P.x / (A * A) + P.z * P.z / (B * B) - 1.;
  float disc = qb * qb - 4. * qa * qc;
  if (disc <= 0.) return vec2(2., 1.);
  float sq = sqrt(disc), s0 = (-qb - sq) / (2. * qa), s1 = (-qb + sq) / (2. * qa), lit = 1.;
  if (s0 > 0.02) lit = min(lit, smoothstep(-${Ct.EDGE.WALL.toFixed(2)}, ${Ct.EDGE.WALL.toFixed(2)}, P.y + L.y * s0 - ${s.WALL_H.toFixed(1)}));
  if (s1 > 0.02) lit = min(lit, smoothstep(-${Ct.EDGE.WALL.toFixed(2)}, ${Ct.EDGE.WALL.toFixed(2)}, P.y + L.y * s1 - ${s.WALL_H.toFixed(1)}));
  return vec2(s1 < 0. ? 2. : 1., lit);
}
// (as it always was: 0. in the wall's shade, 1. inside the oval with the sun over the wall, 2. outside the oval in open sun)
float wallSun(vec3 P) { vec2 w = wallSun2(P); return w.y < .5 ? 0. : w.x; }
vec3 sunAt(vec3 P) {
  vec3 L = uSun;
  // the outer wall: where the way to the sun crosses the outer line below the wall's top
  vec2 w2 = wallSun2(P); float rim = w2.y;
  if (rim <= 0.) return vec3(0.);
  if (w2.x > 1.5) return vec3(cloudSun(P) * rim);
  // the gallery's roof: where the way to the sun crosses the roof's level over the gallery
  float yr = ${(s.ROOF_Y-.55).toFixed(2)};
  if (P.y < yr) {
    float sr = (yr - P.y) / max(L.y, .05);
    float dr = famD(P.xz + L.xz * sr, 40.);
    if (dr < ${s.RING_DEPTH.toFixed(1)}) rim *= 1. - smoothstep(${(s.GAL_D0-.3-Ct.EDGE.ROOF).toFixed(2)}, ${(s.GAL_D0-.3+Ct.EDGE.ROOF).toFixed(2)}, dr);
    if (rim <= 0.) return vec3(0.);
  }
  // the rig: where the way to the sun crosses the ropes' surface (y 30 at the ring rope, the mast heads' height at the wall)
  float s = (42. - P.y) / max(L.y, .05), d = 27.;
  for (int i = 0; i < 4; i++) {
    d = famD(P.xz + L.xz * s, d);
    float tau = clamp((d - ${Ct.D_RING.toFixed(1)}) / ${Ct.SPAN.toFixed(1)}, -.2, 1.2);
    s = (${s.RINGROPE_Y.toFixed(1)} + ${(s.MAST_TOP-s.RINGROPE_Y).toFixed(1)} * tau - P.y) / max(L.y, .05);
  }
  if (s <= 0.) return vec3(rim);
  vec2 h = P.xz + L.xz * s;
  float tau = (d - ${Ct.D_RING.toFixed(1)}) / ${Ct.SPAN.toFixed(1)};
  if (tau < uCloth.x - ${(Ct.EDGE.HEM/2).toFixed(3)} || tau > 1.) return vec3(rim);
  float ang = atan(h.y / (FA_B + FA_K * d), h.x / (FA_A + d));
  float jf = fract(ang / 6.2831853 + uArc.x * sin(2. * ang) + uArc.y * sin(4. * ang)) * ${s.MASTS.toFixed(1)};
  float j = floor(jf), a = jf - j, sc = 1. - tau;
  float lift = clothLiftG(a, sc, j, uTime);
  float edge = smoothstep(uCloth.x - ${(Ct.EDGE.HEM/2).toFixed(3)}, uCloth.x + ${(Ct.EDGE.HEM/2).toFixed(3)}, tau);
  vec3 through = clothTintSoft(jf) * uCloth.y * (.82 + .36 * lift);
  return mix(vec3(1.), through, edge) * rim;
}
// THE FILL OF A PLACE (order three, part II): the sky's light and the stone's bounce that reach a face with normal N
// at P, d metres out from the arena wall along the bowl's ellipses (negative outside the bowl), under strip jf. In the
// open: the sky's fill and the warm bounce. Under a spread cloth the sky is the cloth: its dyed glow, a share of the
// sky through the eye and a share of the bounce (RIG.SHADE).
vec3 fillAt(vec3 P, vec3 N, float d, float jf) {
  vec3 open = uSkyCol * (.6 + .4 * N.y) + uBounceCol * (.8 - .4 * N.y);
  float tau = (d - ${Ct.D_RING.toFixed(1)}) / ${Ct.SPAN.toFixed(1)};
  float cover = smoothstep(uCloth.x - .02, uCloth.x + .06, tau) * step(tau, 1.02) * step(P.y, ${(s.ROOF_Y+.5).toFixed(1)});
  if (cover <= 0.) return open;
  vec3 shade = clothTintSoft(jf) * uSunCol * ${Ct.SHADE.GLOW.toFixed(3)} * (.7 + .3 * N.y) + uSkyCol * ${Ct.SHADE.SKY.toFixed(2)} * (.6 + .4 * N.y) + uBounceCol * ${Ct.SHADE.BOUNCE.toFixed(2)} * (.8 - .4 * N.y);
  return mix(open, shade, cover);
}
vec3 hazed(vec3 col, vec3 P) {
  float dist = length(P - cameraPosition);
  float low = exp(-max(P.y, 0.) * .012);
  float f = 1. - exp(-dist * uHaze.w * (.45 + .55 * low));
  return mix(col, uHaze.rgb, clamp(f, 0., 1.));
}
`,Fo=`
float hash21(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y); }
float fbm2(vec2 p) { return .5 * vnoise(p) + .25 * vnoise(p * 2.03 + 7.1) + .125 * vnoise(p * 4.01 + 13.7) + .0625 * vnoise(p * 8.07 + 3.3); }
`;async function Ua(a,o={}){const e=new U.Group;e.name="flavian-amphitheatre";const t={triangles:0,calls:0,pieces:{}},r=o.U,h={ctx:a,opts:o,U:r,object:e,info:t,add:(c,A,p)=>(A.name=c,A.matrixAutoUpdate=!1,A.updateMatrix(),e.add(A),t.triangles+=p,t.calls+=1,t.pieces[c]=p,A),updates:[]};for(const c of po)await c(h),await a.yield();return{object:e,radius:s.RIM_A,height:s.MAST_TOP,center:new U.Vector3(0,24,0),anchors:{ring:new U.Vector3(...s.RING),eastGate:new U.Vector3(s.RIM_A,0,0)},info:t,update(c,A,p){for(const l of h.updates)l(c,A,p)},dispose(){},ground:!0,groundY:0}}const po=[];function So(){return{pos:[],nor:[],mat:[],arch:[],idx:[],n:0}}function we(a,o,e,t,r,i,h,c=[0,0,0,0]){const A=e[0]-o[0],p=e[1]-o[1],l=e[2]-o[2],d=r[0]-o[0],R=r[1]-o[1],m=r[2]-o[2];let T=p*m-l*R,v=l*d-A*m,L=A*R-p*d;const y=Math.hypot(T,v,L)||1;T/=y,v/=y,L/=y;const E=Array.isArray(i)?i:[i,i,i,i];[o,e,t,r].forEach((b,ot)=>{a.pos.push(b[0],b[1],b[2]),a.nor.push(T,v,L),a.mat.push(E[ot],h),a.arch.push(c[0],c[1],c[2],c[3])}),a.idx.push(a.n,a.n+1,a.n+2,a.n,a.n+2,a.n+3),a.n+=4}function Ie(a,o,e,t,r,i,h,c,A,p,l){c.includes("f")&&we(a,[o,t,h],[e,t,h],[e,r,h],[o,r,h],A,p,l),c.includes("b")&&we(a,[e,t,i],[o,t,i],[o,r,i],[e,r,i],A,p,l),c.includes("l")&&we(a,[o,t,i],[o,t,h],[o,r,h],[o,r,i],A,p,l),c.includes("r")&&we(a,[e,t,h],[e,t,i],[e,r,i],[e,r,h],A,p,l),c.includes("t")&&we(a,[o,r,h],[e,r,h],[e,r,i],[o,r,i],A,p,l),c.includes("u")&&we(a,[o,t,i],[e,t,i],[e,t,h],[o,t,h],A*.6,p,l)}function Se(a,o,e,t,r,i,h,c,A={}){let p=e[0]-o[0],l=e[1]-o[1],d=e[2]-o[2];const R=Math.hypot(p,l,d)||1;p/=R,l/=R,d/=R;const m=Math.abs(l)<.9?0:1,T=Math.abs(l)<.9?1:0;let v=l*0-d*T,L=d*m-p*0,y=p*T-l*m;const E=Math.hypot(v,L,y);v/=E,L/=E,y/=E;const b=l*y-d*L,ot=d*v-p*y,g=p*L-l*v,M=A.flat??1,G=A.ao??1,q=(X,ht,tt)=>{const F=Math.PI*2*tt/i+(A.turn??0),at=Math.cos(F)*ht,rt=Math.sin(F)*ht*M;return[X[0]+v*at+b*rt,X[1]+L*at+ot*rt,X[2]+y*at+g*rt]};for(let X=0;X<i;X++){const ht=q(o,t,X),tt=q(o,t,X+1),F=q(e,r,X),at=q(e,r,X+1);we(a,ht,tt,at,F,G,h,c),A.capB&&we(a,F,at,e,e,G,h,c)}}function Io(a){const o=new U.BufferGeometry;return o.setAttribute("position",new U.Float32BufferAttribute(a.pos,3)),o.setAttribute("normal",new U.Float32BufferAttribute(a.nor,3)),o.setAttribute("aMat",new U.Float32BufferAttribute(a.mat,2)),o.setAttribute("aArch",new U.Float32BufferAttribute(a.arch,4)),o.setIndex(a.idx),o}const ae={FACE:0,REVEAL:1,MOULD:2,TOPWALL:3,WOOD:4,FLOOR:5,BRONZE:6,STATUE:7,RINGWALL:8,ROPE:9,MARBLE:10},uo=zo(s.RIM_A,s.RIM_B,8,0).perimeter/s.BAYS;function vo(){const a=zo(s.RIM_A,s.RIM_B,s.BAYS,-.5),o=[];for(let e=0;e<s.BAYS;e++){const t=a[e],r=a[(e+1)%s.BAYS],i=Math.hypot(r.x-t.x,r.z-t.z),h=(t.x-r.x)/i,c=(t.z-r.z)/i;o.push({i:e,ox:(t.x+r.x)/2,oz:(t.z+r.z)/2,Xx:h,Xz:c,Nx:-c,Nz:h,w:i,axis:e%(s.BAYS/4)===0})}return o}const Bo=(a,o,e,t)=>[a.ox+a.Xx*o*(a.w/uo)+a.Nx*t,e,a.oz+a.Xz*o*(a.w/uo)+a.Nz*t],Wt={ARC_N:10,COL_CAP_H:.6,COL_CAP_W:1.2,COL_CAP_Z:.62,PED_Z:.52,ENTAB_Z:.42,CORNICE_H:.55,CORNICE_Z:.85,PILASTER_W:.9,PILASTER_Z:.3,TOP_ENTAB_H:2.1,TOP_CORNICE_Z:.95,CORBEL_Y:43.9,CORBEL_H:.9,CORBEL_W:.5,CORBEL_Z:.7,WINDOW_W:1.5,WINDOW_H:2.2,WINDOW_Y:39.4,SMALL_W:.9,SMALL_H:1,SMALL_Y:34.5,SHIELD_Y:40.6,MAST_Z:.34,WINDOW_DEEP:.8,SHIELD_RIM:.14};function aa(a){const o=So(),e=uo/2,t=Wt,r=s.PIER_D,i=s.COL_W/2;for(let d=0;d<3;d++){const R=s.LEVEL[d],m=s.LEVEL[d+1],T=(d===0?a:s.ARCH_W)/2,v=R+s.BAND_H[d],L=v+s.ARCH_H[d],y=L-T,E=m-s.ENTAB_H[d],b=[v,y,E,T];s.BAND_H[d]>0&&we(o,[-e,R,0],[e,R,0],[e,v,0],[-e,v,0],1,ae.FACE,b),we(o,[-e,v,0],[-T,v,0],[-T,E,0],[-e,E,0],1,ae.FACE,b),we(o,[T,v,0],[e,v,0],[e,E,0],[T,E,0],1,ae.FACE,b);for(let G=0;G<t.ARC_N;G++){const q=Math.PI*G/t.ARC_N,X=Math.PI*(G+1)/t.ARC_N,ht=T*Math.cos(q),tt=y+T*Math.sin(q),F=T*Math.cos(X),at=y+T*Math.sin(X);we(o,[F,at,0],[ht,tt,0],[ht,E,0],[F,E,0],1,ae.FACE,b),we(o,[ht,tt,0],[F,at,0],[F,at,-r],[ht,tt,-r],[1,1,.3,.3],ae.REVEAL,b)}we(o,[-T,v,0],[-T,v,-r],[-T,y,-r],[-T,y,0],[1,.3,.3,1],ae.REVEAL,b),we(o,[T,v,-r],[T,v,0],[T,y,0],[T,y,-r],[.3,1,1,.3],ae.REVEAL,b),d>0&&we(o,[-T,v,0],[T,v,0],[T,v,-r],[-T,v,-r],[1,1,.35,.35],ae.REVEAL,b);const ot=d===0?R:v,g=E-t.COL_CAP_H,M=5;for(let G=0;G<M;G++){const q=Math.PI*G/M,X=Math.PI*(G+1)/M,ht=-e+i*Math.cos(X),tt=i*Math.sin(X),F=-e+i*Math.cos(q),at=i*Math.sin(q);we(o,[ht,ot,tt],[F,ot,at],[F,g,at],[ht,g,tt],1,ae.MOULD,b)}Ie(o,-e-t.COL_CAP_W/2,-e+t.COL_CAP_W/2,g,E,0,t.COL_CAP_Z,"flru",1,ae.MOULD,b),d>0&&Ie(o,-e-.62,-e+.62,R,v,0,t.PED_Z,"flrt",1,ae.MOULD,b),we(o,[-e,E,t.ENTAB_Z],[e,E,t.ENTAB_Z],[e,m-t.CORNICE_H,t.ENTAB_Z],[-e,m-t.CORNICE_H,t.ENTAB_Z],[1,1,.7,.7],ae.MOULD,b),Ie(o,-e,e,E,m-t.CORNICE_H,0,t.ENTAB_Z,"u",.9,ae.MOULD,b),Ie(o,-e,e,m-t.CORNICE_H,m,0,t.CORNICE_Z,"fut",1,ae.MOULD,b)}const h=s.LEVEL[3],c=s.LEVEL[4],A=c-t.TOP_ENTAB_H,p=h+s.BAND_H[3],l=[0,0,A,0];we(o,[-e,h,0],[e,h,0],[e,A,0],[-e,A,0],1,ae.TOPWALL,l),Ie(o,-e-.55,-e+.55,h,p,0,.24,"flrt",1,ae.MOULD,l),Ie(o,-e-t.PILASTER_W/2,-e+t.PILASTER_W/2,p,A-.5,0,t.PILASTER_Z,"flr",1,ae.MOULD,l),Ie(o,-e-.6,-e+.6,A-.5,A,0,.32,"flru",1,ae.MOULD,l),we(o,[-e,A,t.ENTAB_Z],[e,A,t.ENTAB_Z],[e,c-.6,t.ENTAB_Z],[-e,c-.6,t.ENTAB_Z],[1,1,.7,.7],ae.MOULD,l),Ie(o,-e,e,A,c-.6,0,t.ENTAB_Z,"u",.9,ae.MOULD,l),Ie(o,-e,e,c-.6,c,-1.8,t.TOP_CORNICE_Z,"fut",1,ae.MOULD,l),we(o,[e,s.ROOF_Y,-1.8],[-e,s.ROOF_Y,-1.8],[-e,c,-1.8],[e,c,-1.8],[.6,.6,1,1],ae.MOULD,l);for(let d=-1;d<=1;d++){const R=d*uo/3;Ie(o,R-t.CORBEL_W/2,R+t.CORBEL_W/2,t.CORBEL_Y,t.CORBEL_Y+t.CORBEL_H,0,t.CORBEL_Z,"flrut",1,ae.MOULD,l);const m=t.CORBEL_Y+t.CORBEL_H,T=t.MAST_Z,v=s.MAST_T/2,L=s.MAST_T*.375,y=4,E=(g,M)=>Array.from({length:y},(G,q)=>{const X=Math.PI*2*(q+.5)/y;return[R+M*Math.SQRT2*Math.cos(X),g,T+M*Math.SQRT2*Math.sin(X)]}),b=E(m,v),ot=E(s.MAST_TOP,L);for(let g=0;g<y;g++){const M=(g+1)%y;we(o,b[M],b[g],ot[g],ot[M],1,ae.WOOD,l)}we(o,ot[3],ot[2],ot[1],ot[0],1,ae.WOOD,l),Ie(o,R-.11,R+.11,s.MAST_TOP-.62,s.MAST_TOP-.3,T-L-.2,T-L+.02,"fblrt",.9,ae.WOOD,l),Se(o,[R+.03,s.MAST_TOP-.62,T-L-.1],[R+.16,c+.12,T-v-.3],.03,.03,3,ae.ROPE,l),Ie(o,R-.1,R+.42,c,c+.12,T-v-.56,T-v-.08,"fblrt",.9,ae.ROPE,l)}return o}function Aa(a=s.MAST_TOP,o=Wt.MAST_Z){const e=vo(),t=[];for(let r=0;r<s.MASTS;r++){const i=Math.floor((r+1)/3)%s.BAYS,h=(r+1)%3-1;t.push(Bo(e[i],-h*uo/3,a,o))}return t}function Ea(){return Aa()}const Ne={TRAVERTINE:[.74,.675,.55],MARBLE:[.66,.645,.61],TIMBER:[.33,.25,.16],BRONZE:[.74,.52,.2],DARK:[.05,.045,.04]},$e=a=>"vec3("+a.map(o=>o.toFixed(3)).join(", ")+")",je={OUT:5.7,HALF_W:4.3,COL_X:3.5,COL_Z:5.1,COL_R:.5,COL_TOP:7.6,BLOCK_Y0:8.2,ATTIC_TOP:11.2,HORSE_S:1.5},Zo=-.5,sa=`
attribute vec2 aMat; attribute vec4 aArch; attribute float aBay; attribute vec2 aVar;
uniform vec3 uSun;
varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec2 vMat; varying vec4 vArch; varying vec3 vSunL; varying float vBay; varying vec3 vEyeL;
void main() {
  vec3 p = position, n = normal;
  if (aMat.y > 6.5 && aMat.y < 7.5) {
    // a statue is turned a little about its own place and is a little taller or shorter (the instance's own draw)
    float c = cos(aVar.x), s = sin(aVar.x);
    vec2 o = p.xz - vec2(0., ${Zo.toFixed(2)});
    p.xz = vec2(c * o.x + s * o.y, -s * o.x + c * o.y) + vec2(0., ${Zo.toFixed(2)});
    n.xz = vec2(c * n.x + s * n.z, -s * n.x + c * n.z);
    p.y = aArch.x + (p.y - aArch.x) * aVar.y;
  }
  vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.);
  mat3 im = mat3(instanceMatrix);
  vec3 X = normalize(im[0]), Z = normalize(im[2]);
  vW = w.xyz; vN = normalize(im * n); vL = p; vMat = aMat; vArch = aArch; vBay = aBay;
  vSunL = vec3(dot(uSun, X), uSun.y, dot(uSun, Z));
  vec3 e = w.xyz - cameraPosition; vEyeL = vec3(dot(e, X), e.y, dot(e, Z));
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Xo=`
varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec2 vMat; varying vec4 vArch; varying vec3 vSunL; varying float vBay; varying vec3 vEyeL;
${eo}
${Fo}
// 1 inside the opening (a square with a half circle on top) at the point q of the wall's face
float inArch(vec2 q, vec4 arch) {
  if (abs(q.x) > arch.w || q.y < arch.x) return 0.;
  if (q.y < arch.y) return 1.;
  vec2 c = vec2(q.x, q.y - arch.y);
  return dot(c, c) < arch.w * arch.w ? 1. : 0.;
}
// the shade a half column on the joint at xc throws on the face at x (the sun's way in the bay's own measures)
float columnShade(float x, float xc, vec3 sl) {
  vec2 u = normalize(vec2(sl.x, max(sl.z, 1e-3)));
  float along = (xc - x) * u.x, perp = abs((xc - x) * u.y);
  return along > 0. ? smoothstep(${(s.COL_W/2).toFixed(3)}, ${(s.COL_W/2*.7).toFixed(3)}, perp) : 0.;
}
// the shade a flat strip throws that stands pz proud of the face between xc - pw and xc + pw (the attic's pilaster)
float stripShade(float x, float xc, float pw, float pz, vec3 sl) {
  float len = pz * abs(sl.x) / max(sl.z, .05), s = sl.x > 0. ? 1. : -1., dx = ((xc - s * pw) - x) * s;
  return step(0., dx) * (1. - smoothstep(len - .04, len + .04, dx));
}
// the shade of a block that stands on the face between x0 and x1, y0 and y1, from z0 to z1 proud of it, at the
// face's point q: the way to the sun crosses it (k: the sun's x and y for one metre out from the face)
float blockShade(vec2 q, vec2 lo, vec2 hi, float z0, float z1, vec2 k) {
  vec2 a = (lo - q) / k, b = (hi - q) / k, tn = min(a, b), tf = max(a, b);
  float t0 = max(max(tn.x, tn.y), z0), t1 = min(min(tf.x, tf.y), z1);
  return smoothstep(0., .06, t1 - t0);
}
void main() {
  vec3 N = normalize(vN), sl = vSunL;
  float kind = vMat.y, ao = vMat.x, lit = 1., spec = 0., hw = ${(uo/2).toFixed(4)}, nlOwn = -1.;
  vec3 gilt = vec3(0.);
  // the stone: pale cream travertine in large blocks with tight joints (drawn only where a block is larger than a pixel)
  vec2 blk = vec2(vL.x / 1.7 + .5 * mod(floor(vL.y / .78), 2.), vL.y / .78);
  vec2 fw = fwidth(blk);
  vec2 bf = abs(fract(blk) - .5);
  float joint = max(smoothstep(.5 - 1.5 * fw.x - .012, .5, bf.x), smoothstep(.5 - 1.5 * fw.y - .02, .5, bf.y)) * (1. - smoothstep(.2, .5, max(fw.x, fw.y)));
  // (order two: no flat cream) every block its own tone and a little warmer or greyer, every course a little its
  // own; the stone's bedding in fine level streaks; the joints by the measure of a block
  float tone = hash21(floor(blk) + vBay * 7.31), hue = hash21(floor(blk) * 1.7 + vBay * 3.13 + 5.);
  float course = hash21(vec2(floor(blk.y), 3.7));
  vec3 alb = ${$e(Ne.TRAVERTINE)} * (.89 + .15 * tone + .05 * course) * mix(vec3(1.035, 1., .93), vec3(.975, 1., 1.05), hue) * (1. - .24 * joint);
  float fwy = fwidth(vL.y);
  alb *= 1. - .07 * (vnoise(vec2(vL.x * .7 + vBay * 9.1, vL.y * 11.)) - .5) * (1. - smoothstep(.03, .12, fwy));
  alb *= .95 + .1 * vnoise(vec2(vBay * 3.1 + vL.x * .2, vL.y * .11));
  // (order three, addendum 6, point 6: THE WALL'S OWN TOP, seen from over the mast heads, is never one flat tone.
  // A level face of the wall carries its slabs: joints by the slab's measure,
  // each slab its own tone, the weather's stains darker toward the back)
  if (N.y > .9 && kind < 5.5) {
    vec2 sb = vec2(vL.x / 1.35 + .5 * mod(floor(vL.z / .92), 2.), vL.z / .92), sf = abs(fract(sb) - .5), sw = fwidth(sb);
    float sj = max(smoothstep(.5 - 1.5 * sw.x - .02, .5, sf.x), smoothstep(.5 - 1.5 * sw.y - .03, .5, sf.y)) * (1. - smoothstep(.2, .5, max(sw.x, sw.y)));
    alb = ${$e(Ne.TRAVERTINE)} * (.74 + .2 * hash21(floor(sb) + vBay * 5.7)) * (1. - .3 * sj) * (.8 + .3 * vnoise(vec2(vL.x * .9 + vBay * 4.3, vL.z * 1.6)));
  }
  // THE PORCH'S SHADE on a gate's bay: the way to the sun against the porch's block (the bay's own measures)
  float axisBay = 1. - step(.25, abs(mod(vBay + 10., 20.) - 10.));
  if (axisBay > .5 && kind < 5.5) {
    vec3 d = sl + vec3(1e-4), t0 = (vec3(${(-je.HALF_W).toFixed(2)}, ${je.BLOCK_Y0.toFixed(2)}, 0.) - vL) / d, t1 = (vec3(${je.HALF_W.toFixed(2)}, ${je.ATTIC_TOP.toFixed(2)}, ${je.OUT.toFixed(2)}) - vL) / d;
    vec3 tn = min(t0, t1), tf = max(t0, t1);
    float ta = max(max(tn.x, tn.y), max(tn.z, .02)), tb = min(min(tf.x, tf.y), tf.z);
    lit *= 1. - smoothstep(0., .25, tb - ta);
  }
  float k = sl.y / max(sl.z, .08);
  if (kind < .5) {
    // the face: the entablature's and the cornice's shade under them, the half columns' shade beside them
    float drop = max(${Wt.ENTAB_Z.toFixed(2)} * k, ${Wt.CORNICE_Z.toFixed(2)} * k - 1.6);
    lit *= smoothstep(drop - .06, drop + .06, vArch.z - vL.y);
    lit *= 1. - max(columnShade(vL.x, -hw, sl), columnShade(vL.x, hw, sl));
    ao *= .82 + .18 * smoothstep(0., 2.2, vArch.z - vL.y);
  } else if (kind < 1.5) {
    // inside an opening: the sun comes in through the opening's own shape
    vec2 q = vL.xy + sl.xy * (-vL.z / max(sl.z, 1e-3));
    lit *= sl.z > 0. ? inArch(q, vArch) : 0.;
    alb *= .93;
  } else if (kind < 2.5) {
    // the mouldings, the half columns, the cornices: the same stone, a little paler and closer grained
    alb = mix(alb, ${$e(Ne.TRAVERTINE)} * 1.04, .55);
    // (order three) THE CORNICE'S SHADE LINE on the frieze under it
    if (vArch.z > 1. && abs(vL.z - ${Wt.ENTAB_Z.toFixed(2)}) < .03 && vL.y > vArch.z) {
      float top = vL.y < ${s.LEVEL[1].toFixed(2)} ? ${(s.LEVEL[1]-Wt.CORNICE_H).toFixed(2)} : vL.y < ${s.LEVEL[2].toFixed(2)} ? ${(s.LEVEL[2]-Wt.CORNICE_H).toFixed(2)} : vL.y < ${s.LEVEL[3].toFixed(2)} ? ${(s.LEVEL[3]-Wt.CORNICE_H).toFixed(2)} : ${(s.LEVEL[4]-.6).toFixed(2)};
      float cz = (vL.y < ${s.LEVEL[3].toFixed(2)} ? ${(Wt.CORNICE_Z-Wt.ENTAB_Z).toFixed(2)} : ${(Wt.TOP_CORNICE_Z-Wt.ENTAB_Z).toFixed(2)}) * k;
      lit *= smoothstep(cz - .05, cz + .05, top - vL.y);
    }
  } else if (kind < 3.5) {
    // the top storey's wall: a window in every second bay, a small window in the band under the shield in the others
    // (NOT CHECKED: the research has the small windows under the blank bays from memory, 3.9)
    float even = 1. - mod(floor(vBay + .5), 2.);
    vec2 wq = abs(vec2(vL.x, vL.y - ${(Wt.WINDOW_Y+Wt.WINDOW_H/2).toFixed(2)})) - vec2(${(Wt.WINDOW_W/2).toFixed(2)}, ${(Wt.WINDOW_H/2).toFixed(2)});
    vec2 sq = abs(vec2(vL.x, vL.y - ${(Wt.SMALL_Y+Wt.SMALL_H/2).toFixed(2)})) - vec2(${(Wt.SMALL_W/2).toFixed(2)}, ${(Wt.SMALL_H/2).toFixed(2)});
    float hole = even * step(max(wq.x, wq.y), 0.) + (1. - even) * step(max(sq.x, sq.y), 0.);
    // a window's surround: a plain raised band of paler stone, a sill under it, and the shade both throw
    vec2 oq = even > .5 ? wq : sq;
    float od = max(oq.x, oq.y), band = step(0., od) * (1. - smoothstep(.2, .24, od));
    alb = mix(alb, ${$e(Ne.TRAVERTINE)} * 1.06, band * .8);
    float sillY = (even > .5 ? ${Wt.WINDOW_Y.toFixed(2)} : ${Wt.SMALL_Y.toFixed(2)}) - .22 - vL.y;
    float underSill = step(0., sillY) * (1. - smoothstep(.1, .16 + .14 * k, sillY)) * step(oq.x, .3);
    float besideBand = step(.22, od) * (1. - smoothstep(.22 + .05 * abs(sl.x) / max(sl.z, .05), .26 + .05 * abs(sl.x) / max(sl.z, .05), od)) * step(oq.y, .22) * step(0., -sl.x * vL.x);
    lit *= 1. - max(underSill, besideBand);
    ao *= 1. - .25 * underSill;
    float drop = max(${Wt.ENTAB_Z.toFixed(2)} * k, ${Wt.TOP_CORNICE_Z.toFixed(2)} * k - 1.5);
    lit *= smoothstep(drop - .06, drop + .06, vArch.z - vL.y);
    // (order three) RELIEF THAT THROWS SHADE in the low sun: the pilasters on the joints, the three corbels and the
    // masts on them, the shield with its rim
    vec2 ks = sl.xy / max(sl.z, .05);
    float inPil = step(${(s.LEVEL[3]+s.BAND_H[3]).toFixed(2)}, vL.y) * step(vL.y, vArch.z - .5);
    lit *= 1. - inPil * max(stripShade(vL.x, -hw, ${(Wt.PILASTER_W/2).toFixed(2)}, ${Wt.PILASTER_Z.toFixed(2)}, sl), stripShade(vL.x, hw, ${(Wt.PILASTER_W/2).toFixed(2)}, ${Wt.PILASTER_Z.toFixed(2)}, sl));
    if (sl.z > 0.) {
      float per = ${(uo/3).toFixed(4)}, xr = mod(vL.x + .5 * per, per) - .5 * per, toSun = sl.x > 0. ? per : -per;
      vec2 qc = vec2(xr, vL.y);
      float cs = max(blockShade(qc, vec2(${(-Wt.CORBEL_W/2).toFixed(2)}, ${Wt.CORBEL_Y.toFixed(2)}), vec2(${(Wt.CORBEL_W/2).toFixed(2)}, ${(Wt.CORBEL_Y+Wt.CORBEL_H).toFixed(2)}), 0., ${Wt.CORBEL_Z.toFixed(2)}, ks),
        blockShade(qc - vec2(toSun, 0.), vec2(${(-Wt.CORBEL_W/2).toFixed(2)}, ${Wt.CORBEL_Y.toFixed(2)}), vec2(${(Wt.CORBEL_W/2).toFixed(2)}, ${(Wt.CORBEL_Y+Wt.CORBEL_H).toFixed(2)}), 0., ${Wt.CORBEL_Z.toFixed(2)}, ks));
      cs = max(cs, max(blockShade(qc, vec2(${(-s.MAST_T/2).toFixed(2)}, ${(Wt.CORBEL_Y+Wt.CORBEL_H).toFixed(2)}), vec2(${(s.MAST_T/2).toFixed(2)}, ${s.MAST_TOP.toFixed(2)}), ${(Wt.MAST_Z-s.MAST_T/2).toFixed(2)}, ${(Wt.MAST_Z+s.MAST_T/2).toFixed(2)}, ks),
        blockShade(qc - vec2(toSun, 0.), vec2(${(-s.MAST_T/2).toFixed(2)}, ${(Wt.CORBEL_Y+Wt.CORBEL_H).toFixed(2)}), vec2(${(s.MAST_T/2).toFixed(2)}, ${s.MAST_TOP.toFixed(2)}), ${(Wt.MAST_Z-s.MAST_T/2).toFixed(2)}, ${(Wt.MAST_Z+s.MAST_T/2).toFixed(2)}, ks)));
      lit *= 1. - cs;
      // the shield's shade (the bays without a large window), thrown from its rim's height
      vec2 sc = vec2(vL.x, vL.y - ${Wt.SHIELD_Y.toFixed(2)}) + ks * ${(Wt.SHIELD_RIM+.04).toFixed(2)};
      lit *= 1. - (1. - even) * (1. - smoothstep(${(s.SHIELD_D/2-.05).toFixed(2)}, ${(s.SHIELD_D/2+.05).toFixed(2)}, length(sc)));
    }
    if (hole > .5) {
      // A WINDOW (order three: never flat black): the sight is followed from the face into the opening (by the
      // direction from the eye): it ends on a jamb, on the sill, under the lintel or, WINDOW_DEEP in, on the dim room
      // behind; the sun lies on that place where its way back out passes the opening
      vec2 hf = even > .5 ? vec2(${(Wt.WINDOW_W/2).toFixed(2)}, ${(Wt.WINDOW_H/2).toFixed(2)}) : vec2(${(Wt.SMALL_W/2).toFixed(2)}, ${(Wt.SMALL_H/2).toFixed(2)});
      vec2 q = vL.xy - vec2(0., even > .5 ? ${(Wt.WINDOW_Y+Wt.WINDOW_H/2).toFixed(2)} : ${(Wt.SMALL_Y+Wt.SMALL_H/2).toFixed(2)});
      vec3 e = normalize(vEyeL);
      float tz = ${Wt.WINDOW_DEEP.toFixed(2)} / max(-e.z, 1e-3);
      // (where the eye stands level with a window to a ten thousandth, a divisor that lost its sign made the way
      // come out negative and the sill blaze white: the divisor keeps its sign; the way and the depth stay inside
      // the opening)
      float ex = e.x > 0. ? max(e.x, 1e-4) : min(e.x, -1e-4), ey = e.y > 0. ? max(e.y, 1e-4) : min(e.y, -1e-4);
      float tx = (e.x > 0. ? hf.x - q.x : -hf.x - q.x) / ex;
      float ty = (e.y > 0. ? hf.y - q.y : -hf.y - q.y) / ey;
      float t = max(min(tz, min(tx, ty)), 0.), deep = -e.z * t;
      vec2 hp = q + e.xy * t, qs = hp + ks * deep;
      float sunIn = sl.z > 0. && abs(qs.x) < hf.x && abs(qs.y) < hf.y ? 1. : 0.;
      float far = clamp(deep / ${Wt.WINDOW_DEEP.toFixed(2)}, 0., 1.);
      if (t >= tz) {
        // the room behind: dim plaster, a little lighter low down where the floor throws the day back
        alb = vec3(.36, .31, .26) * (.55 + .45 * smoothstep(hf.y, -hf.y, hp.y)) * (.8 + .4 * hash21(vec2(vBay, 3.)));
        lit = 1.; ao = .8; nlOwn = .2;   // the day that comes in by the room's other openings: dim, never black
      } else if (tx < ty) {
        // a jamb: lit when it faces the sun
        nlOwn = max(-sign(e.x) * sl.x, 0.); lit = sunIn; ao = .8 - .35 * far;
      } else {
        // the sill (seen from above) or the lintel's underside (seen from below)
        nlOwn = e.y < 0. ? max(sl.y, 0.) : 0.; lit = sunIn; ao = (e.y < 0. ? .85 : .5) - .3 * far;
      }
    }
    // the band's top edge
    alb *= 1. - .12 * (1. - smoothstep(0., .1, abs(vL.y - ${(s.LEVEL[3]+s.BAND_H[3]).toFixed(2)})));
  } else if (kind < 4.5) {
    alb = ${$e(Ne.TIMBER)} * (.85 + .3 * hash21(vec2(vBay, floor(vL.x * 3.))));
  } else if (kind < 5.5) {
    // a floor behind the arches: the sun lies on it in the openings' own shapes
    vec2 q = vL.xy + sl.xy * (-vL.z / max(sl.z, 1e-3));
    q.x = mod(q.x + hw, 2. * hw) - hw;
    lit *= sl.z > 0. ? inArch(q, vArch) : 0.;
    alb *= .8;
  } else if (kind < 6.5) {
    // bronze: its own colour, the sky in it, a glint of the sun by the direction from it to the eye
    // GILT bronze: the sky above and the pale ground below mirrored in it (by the direction from it to the eye)
    alb = ${$e(Ne.BRONZE)};
    vec3 V = normalize(cameraPosition - vW), Hh = normalize(V + uSun), Rf = reflect(-V, N);
    spec = pow(clamp(dot(N, Hh), 0., 1.), 42.) * 1.5 + pow(clamp(dot(N, Hh), 0., 1.), 5.) * .5;
    gilt = mix(uBounceCol * 2.2, uSkyCol * 1.3, smoothstep(-.25, .45, Rf.y)) * ao;
  } else if (kind < 7.5) {
    // a statue in its opening: white marble; the sun reaches it through the opening's shape
    vec2 q = vL.xy + sl.xy * (-vL.z / max(sl.z, 1e-3));
    lit *= sl.z > 0. ? inArch(q, vArch) : 0.;
    alb = ${$e(Ne.MARBLE)} * 1.12;
    ao *= .95;
  } else if (kind > 9.5) {
    // white marble (the gates' porches): its own pale tone with faint grey veins
    alb = ${$e(Ne.MARBLE)} * (1.1 - .1 * smoothstep(.55, .8, vnoise(vec2(vL.x * 1.3 + vL.z, vL.y * .6 + 4. * vnoise(vL.xy * .7)))));
    // THE MARBLE IS BUILT STONE BY THE WALL'S OWN LAWS (a thing of FORM, the same for all four porches; it changes no
    // measure of the porch; the slabs' and the blocks' sizes are OURS): a level face carries its slabs (the wall's
    // own top's law: joints by the slab's measure, each slab its own tone, the weather's stains), an upright face
    // of the block and the attic its coursed blocks (the wall's own blocks' measure and joints), a soft shade lies
    // under the cornice, and THE GROUP THROWS ITS SHADE ON THE ATTIC'S TOP by the porch's own law of shade (the way
    // to the sun against a box: here the four horses' bodies' layer; half of the sun is taken, for the sun passes
    // between the four bodies and under them). Every joint melts where a slab or a block is under a pixel (the
    // pixel's footprint, as the wall's own joints do).
    if (N.y > .9) {
      vec2 sb = vec2(vL.x / 1.35 + .5 * mod(floor(vL.z / .92), 2.), vL.z / .92), sf = abs(fract(sb) - .5), sw = fwidth(sb);
      float sj = max(smoothstep(.5 - 1.5 * sw.x - .02, .5, sf.x), smoothstep(.5 - 1.5 * sw.y - .03, .5, sf.y)) * (1. - smoothstep(.2, .5, max(sw.x, sw.y)));
      alb *= (.9 + .14 * hash21(floor(sb) + vBay * 5.7)) * (1. - .26 * sj) * (.86 + .22 * vnoise(vec2(vL.x * .9 + vBay * 4.3, vL.z * 1.6)));
      if (vL.y > ${(je.ATTIC_TOP-.1).toFixed(2)}) {
        vec3 d = sl + vec3(1e-4), t0 = (vec3(-2.5, ${(je.ATTIC_TOP+.8*je.HORSE_S).toFixed(2)}, .6) - vL) / d, t1 = (vec3(2.5, ${(je.ATTIC_TOP+1.5*je.HORSE_S).toFixed(2)}, 5.3) - vL) / d;
        vec3 tn = min(t0, t1), tf = max(t0, t1);
        float ta = max(max(tn.x, tn.y), max(tn.z, .02)), tb = min(min(tf.x, tf.y), tf.z);
        lit *= 1. - .5 * smoothstep(0., .5, tb - ta);
      }
    } else if (vL.y > ${(je.BLOCK_Y0-.05).toFixed(2)} && N.y > -.5) {
      float side = step(fwidth(vL.x), fwidth(vL.z)), ub = mix(vL.x, vL.z, side);
      vec2 mb = vec2(ub / 1.7 + .5 * mod(floor(vL.y / .78), 2.), vL.y / .78), mf = abs(fract(mb) - .5), mw = fwidth(mb);
      float mj = max(smoothstep(.5 - 1.5 * mw.x - .012, .5, mf.x), smoothstep(.5 - 1.5 * mw.y - .02, .5, mf.y)) * (1. - smoothstep(.2, .5, max(mw.x, mw.y)));
      alb *= (.94 + .09 * hash21(floor(mb) + vBay * 7.31 + side * 3.)) * (1. - .18 * mj);
      float under = ${(s.LEVEL[1]-.5).toFixed(2)} - vL.y;
      ao *= under > 0. ? .75 + .25 * smoothstep(0., .9, under) : 1.;
    }
  } else if (kind > 8.5) {
    // a hempen rope: its end made fast at the mast, its coil on the cornice
    alb = vec3(.5, .43, .3) * (.85 + .3 * hash21(floor(vL.xy * 14.)));
  } else {
    // the second ring wall, 5.8 m behind the piers: dim stone with its own openings, and through them the third wall's
    // openings by the direction from the eye (deep shade with dim arches beyond)
    lit = 0.;
    float open2 = inArch(vL.xy, vArch);
    vec2 q3 = vL.xy + vEyeL.xy * (${(s.RING3_IN-s.RING2_IN).toFixed(1)} / max(-vEyeL.z, .05));
    q3.x = mod(q3.x + hw, 2. * hw) - hw;
    float open3 = inArch(q3, vArch);
    float glow = max(sl.z, 0.) * exp(-max(vL.y - vArch.x, 0.) / 2.6);
    alb *= mix(.5 + .5 * glow, mix(.2, .04, open3), open2);
    ao = .55;
  }
  float NL = nlOwn >= 0. ? nlOwn : max(dot(N, uSun), 0.);
  // (order three, addendum 8: the clouds' drifting shade lies on the wall as on the square; and THE STONE'S RANGE: the
  // lit face warm, a face in shade clearly cooler and darker: it keeps the sky's blue light, less of it, and loses
  // most of the warm bounce)
  lit *= cloudSun(vW);
  float inSun = smoothstep(0., .3, NL * lit);
  vec3 col = alb * (uSunCol * NL * lit * 1.06 + uSkyCol * (.62 + .38 * N.y) * ao * mix(.8, 1., inSun) + uBounceCol * (.75 - .45 * N.y) * ao * (.4 + .6 * lit) * mix(.4, 1., inSun));
  if (kind > 5.5 && kind < 6.5) col = alb * (uSunCol * NL * lit * .55 + gilt);
  col += uSunCol * spec * ${$e(Ne.BRONZE)} * lit;
  gl_FragColor = vec4(hazed(col, vW), 1.);
}`;po.push(async function(o){const e=vo(),t=new U.ShaderMaterial({uniforms:{...o.U},vertexShader:sa,fragmentShader:Xo}),r=new U.Matrix4,i=new U.Vector3,h=new U.Vector3(0,1,0),c=new U.Vector3,A=(p,l,d)=>{const R=Io(d),m=new U.InstancedMesh(R,t,l.length),T=new Float32Array(l.length);l.forEach((v,L)=>{i.set(v.Xx,0,v.Xz).multiplyScalar(v.w/uo),c.set(v.Nx,0,v.Nz),r.makeBasis(i,h,c).setPosition(v.ox,0,v.oz),m.setMatrixAt(L,r),T[L]=v.i}),R.setAttribute("aBay",new U.InstancedBufferAttribute(T,1)),m.frustumCulled=!1,m.instanceMatrix.needsUpdate=!0,o.add(p,m,d.idx.length/3*l.length)};A("wall bays",e.filter(p=>!p.axis),aa(s.ARCH_W)),await o.ctx.yield(),A("wall axis bays",e.filter(p=>p.axis),aa(s.AXIS_ARCH_W))});const pa=`
attribute vec2 aMat; attribute vec4 aArch; attribute float aBay; attribute vec3 aLocal; attribute vec2 aX;
uniform vec3 uSun;
varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec2 vMat; varying vec4 vArch; varying vec3 vSunL; varying float vBay; varying vec3 vEyeL;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.);
  vec3 X = vec3(aX.x, 0., aX.y), Z = vec3(-aX.y, 0., aX.x);
  vW = w.xyz; vN = normal; vL = aLocal; vMat = aMat; vArch = aArch; vBay = aBay;
  vSunL = vec3(dot(uSun, X), uSun.y, dot(uSun, Z));
  vec3 e = w.xyz - cameraPosition; vEyeL = vec3(dot(e, X), e.y, dot(e, Z));
  gl_Position = projectionMatrix * viewMatrix * w;
}`;po.push(async function(o){const e=zo(s.RIM_A,s.RIM_B,s.BAYS,-.5),t=vo(),r=So(),i=uo/2,h=[],c=[],A=[];for(let d=0;d<s.BAYS;d++){const R=e[d],m=e[(d+1)%s.BAYS],T=t[d],v=E=>{const b=E[0]>0?R:m;return[b.x+b.nx*E[2],E[1],b.z+b.nz*E[2]]},L=(E,b,ot,g,M,G,q)=>{we(r,v(E),v(b),v(ot),v(g),M,G,q);for(const X of[E,b,ot,g])h.push(X[0]*i,X[1],X[2]),c.push(T.Xx,T.Xz),A.push(d)},y=s.BASE_H/2;L([-1,0,.9],[1,0,.9],[1,y,.9],[-1,y,.9],.8,ae.MOULD),L([-1,y,.9],[1,y,.9],[1,y,.45],[-1,y,.45],1,ae.MOULD),L([-1,y,.45],[1,y,.45],[1,2*y,.45],[-1,2*y,.45],.8,ae.MOULD);for(let E=0;E<3;E++){const b=s.LEVEL[E],ot=s.LEVEL[E+1],g=(E===0&&T.axis?s.AXIS_ARCH_W:s.ARCH_W)/2,M=b+s.BAND_H[E],G=M+s.ARCH_H[E]-g,q=[M,G,ot-s.ENTAB_H[E],g];L([-1,M,E===0?.45:-s.PIER_D],[1,M,E===0?.45:-s.PIER_D],[1,M,-s.RING3_IN],[-1,M,-s.RING3_IN],[1,1,.3,.3],ae.FLOOR,q),L([-1,b,-s.RING2_IN],[1,b,-s.RING2_IN],[1,ot,-s.RING2_IN],[-1,ot,-s.RING2_IN],.5,ae.RINGWALL,q)}d%20===19&&await o.ctx.yield()}const p=Io(r);p.setAttribute("aLocal",new U.Float32BufferAttribute(h,3)),p.setAttribute("aX",new U.Float32BufferAttribute(c,2)),p.setAttribute("aBay",new U.Float32BufferAttribute(A,1));const l=new U.ShaderMaterial({uniforms:{...o.U},vertexShader:pa,fragmentShader:Xo});o.ringMat=l,o.add("behind the arches",new U.Mesh(p,l),r.idx.length/3).frustumCulled=!1});function va(a,o,e,t){const r=Zo,i=ae.STATUE,h=e+.4;Ie(a,-.5,.5,e,h,r-.4,r+.4,"flrt",1,i,t),Se(a,[0,h,r],[0,h+.95,r],.34,.27,7,i,t,{flat:.72}),Se(a,[0,h+.95,r],[0,h+1.6,r],.27,.31,7,i,t,{flat:.66}),Se(a,[0,h+1.6,r],[0,h+1.87,r],.31,.11,7,i,t,{flat:.66}),Se(a,[0,h+1.87,r],[0,h+1.97,r],.09,.09,5,i,t),Se(a,[0,h+1.95,r+.01],[0,h+2.26,r+.02],.135,.115,7,i,t,{capB:!0}),Se(a,[-.31,h+1.7,r],[-.35,h+1,r+.04],.085,.07,4,i,t),o===0?Se(a,[.31,h+1.7,r],[.35,h+1,r+.04],.085,.07,4,i,t):(Se(a,[.31,h+1.7,r],[.34,h+1.28,r+.03],.085,.08,4,i,t),Se(a,[.34,h+1.28,r+.03],[.26,h+1.38,r+.4],.08,.065,4,i,t,{capB:!0}))}po.push(async function(o){const e=vo(),t=o.ctx.core.makeRng(o.ctx.core.hashSeed("amphitheatre-statues:"+o.ctx.seed)),r=new U.ShaderMaterial({uniforms:{...o.U},vertexShader:sa,fragmentShader:Xo});o.wallMat=r;const i=new U.Matrix4,h=new U.Vector3,c=new U.Vector3(0,1,0),A=new U.Vector3,p=(b,ot)=>ot.forEach((g,M)=>{h.set(g.Xx,0,g.Xz).multiplyScalar(g.w/uo),A.set(g.Nx,0,g.Nz),i.makeBasis(h,c,A).setPosition(g.ox,0,g.oz),b.setMatrixAt(M,i)});for(let b=0;b<2;b++){const ot=So(),g=e.filter(ht=>ht.i%2===b);for(let ht=1;ht<=2;ht++){const tt=s.ARCH_W/2,F=s.LEVEL[ht]+s.BAND_H[ht];va(ot,(ht+b)%2,F,[F,F+s.ARCH_H[ht]-tt,s.LEVEL[ht+1]-s.ENTAB_H[ht],tt])}const M=Io(ot),G=new U.InstancedMesh(M,r,g.length),q=new Float32Array(g.length),X=new Float32Array(g.length*2);p(G,g),g.forEach((ht,tt)=>{q[tt]=ht.i,X[tt*2]=t.range(-.45,.45),X[tt*2+1]=t.range(.93,1.06)}),M.setAttribute("aBay",new U.InstancedBufferAttribute(q,1)),M.setAttribute("aVar",new U.InstancedBufferAttribute(X,2)),G.frustumCulled=!1,o.add("statues "+(b?"b":"a"),G,ot.idx.length/3*g.length)}await o.ctx.yield();const l=So(),d=18,R=s.SHIELD_D/2,m=Wt.SHIELD_Y,T=[0,0,99,0];for(let b=0;b<d;b++){const ot=Math.PI*2*b/d,g=Math.PI*2*(b+1)/d,M=Math.cos(ot),G=Math.sin(ot),q=Math.cos(g),X=Math.sin(g),ht=Wt.SHIELD_RIM,tt=.86*R,F=.8*R,at=(rt,Lt,bt,zt)=>[rt*Lt,m+rt*bt,zt];we(l,at(R,M,G,0),at(R,q,X,0),at(R,q,X,ht),at(R,M,G,ht),.8,ae.BRONZE,T),we(l,at(R,M,G,ht),at(R,q,X,ht),at(tt,q,X,ht),at(tt,M,G,ht),1,ae.BRONZE,T),we(l,at(tt,M,G,ht),at(tt,q,X,ht),at(F,q,X,.05),at(F,M,G,.05),.7,ae.BRONZE,T),we(l,at(F,M,G,.05),at(F,q,X,.05),[.2*R*q,m+.2*R*X,.13],[.2*R*M,m+.2*R*G,.13],1,ae.BRONZE,T),we(l,[.2*R*M,m+.2*R*G,.13],[.2*R*q,m+.2*R*X,.13],[0,m,.27],[0,m,.27],1,ae.BRONZE,T)}const v=e.filter(b=>b.i%2===1),L=Io(l),y=new U.InstancedMesh(L,r,v.length),E=new Float32Array(v.length);p(y,v),v.forEach((b,ot)=>{E[ot]=b.i}),L.setAttribute("aBay",new U.InstancedBufferAttribute(E,1)),y.frustumCulled=!1,o.add("shields",y,l.idx.length/3*v.length)});function Ra(a,o,e,t,r,i){const h=ae.BRONZE,c=[0,0,99,0],A=(p,l,d)=>[o+p*r,e+l*r,t+d*r];Se(a,A(0,1.12,-.7),A(0,1.17,.5),.31*r,.34*r,8,h,c,{flat:1.12}),Se(a,A(0,1.17,.5),A(0,1.24,.72),.34*r,.2*r,8,h,c,{flat:1.12,capB:!0}),Se(a,A(0,1.12,-.7),A(0,1.1,-.86),.31*r,.17*r,8,h,c,{flat:1.12,capB:!0}),Se(a,A(0,1.3,.48),A(0,1.92,.88),.24*r,.13*r,6,h,c,{flat:.7}),Se(a,A(0,1.97,.84),A(0,1.72,1.36),.15*r,.075*r,6,h,c,{flat:.75,capB:!0}),Se(a,A(0,1.2,-.84),A(0,.55,-1.02),.07*r,.035*r,4,h,c);for(const p of[-1,1])Se(a,A(p*.17,.95,-.6),A(p*.17,0,-.66),.085*r,.05*r,4,h,c),i&&p>0?(Se(a,A(.17,.98,.42),A(.17,.66,.7),.08*r,.06*r,4,h,c),Se(a,A(.17,.66,.7),A(.17,.3,.56),.06*r,.045*r,4,h,c)):Se(a,A(p*.17,.98,.42),A(p*.17,0,.44),.08*r,.05*r,4,h,c)}po.push(async function(o){const e=So(),t=je,r=[0,0,99,0],i=t.HORSE_S,h=t.ATTIC_TOP;for(const E of[-1,1])Ie(e,E*t.COL_X-.75,E*t.COL_X+.75,s.BASE_H,s.BASE_H+.6,t.COL_Z-.75,t.COL_Z+.75,"fblrt",1,ae.MARBLE,r),Se(e,[E*t.COL_X,s.BASE_H+.6,t.COL_Z],[E*t.COL_X,t.COL_TOP,t.COL_Z],t.COL_R,t.COL_R*.88,10,ae.MARBLE,r),Ie(e,E*t.COL_X-.7,E*t.COL_X+.7,t.COL_TOP,t.BLOCK_Y0,t.COL_Z-.7,t.COL_Z+.7,"fblru",1,ae.MARBLE,r);Ie(e,-t.HALF_W,t.HALF_W,t.BLOCK_Y0,s.LEVEL[1],0,t.OUT,"flrut",1,ae.MARBLE,r),Ie(e,-t.HALF_W-.25,t.HALF_W+.25,s.LEVEL[1]-.5,s.LEVEL[1],0,t.OUT+.25,"flru",1,ae.MARBLE,r),Ie(e,-t.HALF_W+.4,t.HALF_W-.4,s.LEVEL[1],h,.2,t.OUT-.2,"flrt",1,ae.MARBLE,r),[-2.03,-.68,.68,2.03].forEach((E,b)=>Ra(e,E,h,3.35+(b===1||b===2?.12:0),i,b===0||b===3));const A=(E,b,ot)=>[E*i,h+b*i,1.3+ot*i],p=ae.BRONZE;Ie(e,-.5*i,.5*i,h+.62*i,h+.7*i,1.3-.45*i,1.3+.3*i,"fblrut",1,p,r),Ie(e,-.5*i,.5*i,h+.7*i,h+1.25*i,1.3+.24*i,1.3+.3*i,"fblrt",1,p,r);for(const E of[-1,1])Ie(e,E*.5*i-.04,E*.5*i+.04,h+.7*i,h+1.12*i,1.3-.25*i,1.3+.3*i,"fblrt",1,p,r),Se(e,A(E*.58,.42,-.1),A(E*.64,.42,-.1),.42*i,.42*i,12,p,r,{capB:!0}),Se(e,A(E*.64,.42,-.1),A(E*.58,.42,-.1),.42*i,.42*i,12,p,r,{capB:!0});Se(e,A(0,.62,.3),A(0,1.02,1.75),.05*i,.04*i,4,p,r),Se(e,A(-1.5,1.05,1.72),A(1.5,1.05,1.72),.045*i,.045*i,4,p,r);const l=vo().filter(E=>E.axis),d=Io(e),R=new U.InstancedMesh(d,o.wallMat,l.length),m=new Float32Array(l.length),T=new U.Matrix4,v=new U.Vector3,L=new U.Vector3(0,1,0),y=new U.Vector3;l.forEach((E,b)=>{v.set(E.Xx,0,E.Xz),y.set(E.Nx,0,E.Nz),T.makeBasis(v,L,y).setPosition(E.ox,0,E.oz),R.setMatrixAt(b,T),m[b]=E.i}),d.setAttribute("aBay",new U.InstancedBufferAttribute(m,1)),R.frustumCulled=!1,o.add("porches and four horse groups",R,e.idx.length/3*l.length)});function na(){const a=Ea(),o=[],e=[];for(let r=0;r<s.MASTS;r++){const i=Math.atan2(a[r][2]/s.RIM_B,a[r][0]/s.RIM_A);o.push([s.RINGROPE_A*Math.cos(i),s.RINGROPE_Y,s.RINGROPE_B*Math.sin(i)]);let h=-s.RINGROPE_A*Math.sin(i),c=s.RINGROPE_B*Math.cos(i);const A=Math.hypot(h,c);e.push([h/A,c/A])}return{heads:a,ring:o,tan:e,at:(r,i)=>{const h=a[r%s.MASTS],c=o[r%s.MASTS];return[h[0]+(c[0]-h[0])*i,h[1]+(c[1]-h[1])*i-4*s.ROPE_SAG*i*(1-i),h[2]+(c[2]-h[2])*i]}}}function Ya(a,o,e,t){const r=Math.sin(Math.PI*o),i=s.ROPE_SWAY*r*Math.sin(Ct.SWAY_RATE*e+a*1.7),h=.5*s.ROPE_SWAY*r*Math.sin(.7*e+a*2.9)+o*Ct.RING_BREATH*Math.sin(Ct.RING_RATE*e+a*.0785),c=-t[2]*s.RINGROPE_A/s.RINGROPE_B+1e-5,A=t[0]*s.RINGROPE_B/s.RINGROPE_A,p=Math.hypot(c,A);return[c/p*i,h,A/p*i]}const Be={MAIN:.06,BARE:.06,LESSER:.035,RING:.12,HEAD:.05,KNOT:1.1,EVERY:6,MAIN_AT:3,LASH:.9,LENGTH:56,TWIST:.5,COLOUR:[.34,.26,.16]},_a=`
attribute vec3 aDir; attribute vec4 aRope;
uniform float uTime; uniform vec2 uView; uniform vec3 uSun;
varying float vAlpha; varying vec3 vW; varying float vShade; varying vec3 vRope;
void main() {
  float s = aRope.x, j = aRope.y, side = aRope.z, r = aRope.w;
  float w = sin(3.14159265 * s);
  vec3 p = position;
  vec2 tn = normalize(vec2(-p.z * ${(s.RINGROPE_A/s.RINGROPE_B).toFixed(4)}, p.x * ${(s.RINGROPE_B/s.RINGROPE_A).toFixed(4)}) + vec2(1e-5, 0.));
  float a = ${s.ROPE_SWAY.toFixed(2)} * w * sin(${Ct.SWAY_RATE.toFixed(2)} * uTime + j * 1.7);
  p.xz += tn * a;
  p.y += ${(.5*s.ROPE_SWAY).toFixed(3)} * w * sin(.7 * uTime + j * 2.9) + s * ${Ct.RING_BREATH.toFixed(2)} * sin(${Ct.RING_RATE.toFixed(2)} * uTime + j * .0785);
  vec4 wp = modelMatrix * vec4(p, 1.);
  vec3 V = cameraPosition - wp.xyz; float dist = length(V);
  // a rope under a pixel wide is drawn a pixel wide at its true share of that pixel (its cover): the pixel's footprint
  float px = 2. * dist / (projectionMatrix[1][1] * uView.y), half_ = max(r, .5 * px);
  vec3 sd = normalize(cross(aDir, V) + vec3(0., 1e-5, 0.));
  wp.xyz += sd * side * half_;
  // the side that is turned to the sun is the lit one (across the rope as the eye sees it)
  vAlpha = r / half_; vW = wp.xyz; vShade = .5 + .5 * side * sign(dot(sd, uSun) + 1e-4);
  vRope = vec3(s * ${Be.LENGTH.toFixed(1)}, side, r / max(px, 1e-4));
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,xa=`
varying float vAlpha; varying vec3 vW; varying float vShade; varying vec3 vRope;
${eo}
void main() {
  // hemp: brown, a lit and a shaded side, the strands' twist where a strand is wider than a pixel
  vec3 alb = ${$e(Be.COLOUR)} * (1. - .62 * step(${(Be.LENGTH+.03).toFixed(2)}, vRope.x));   // (a lashing on the ring rope: dark tarred turns)
  float twist = .5 + .5 * sin(6.2831853 * (vRope.x / ${Be.TWIST.toFixed(2)} + .35 * vRope.y));
  alb *= mix(1., .72 + .4 * twist, smoothstep(1.5, 4., vRope.z));
  float round_ = sqrt(max(1. - vRope.y * vRope.y, 0.));
  vec3 col = alb * (uSunCol * (.15 + .75 * vShade) * (.55 + .45 * round_) * step(.5, wallSun(vW)) + uSkyCol * .7 + uBounceCol * .4);
  gl_FragColor = vec4(hazed(col, vW), vAlpha);
}`;po.push(async function(o){const e=na(),t=10,r=[],i=[],h=[],c=[];let A=0;const p=(v,L,y,E)=>{for(let b=0;b<v.length;b++){const ot=v[Math.max(0,b-1)],g=v[Math.min(v.length-1,b+1)],M=Math.hypot(g[0]-ot[0],g[1]-ot[1],g[2]-ot[2])||1;for(const G of[-1,1])r.push(...v[b]),i.push((g[0]-ot[0])/M,(g[1]-ot[1])/M,(g[2]-ot[2])/M),h.push(E(b),L,G,y);b&&c.push(A+2*b-2,A+2*b-1,A+2*b,A+2*b-1,A+2*b+1,A+2*b)}A+=v.length*2},l=Math.min(1,Math.max(.012,o.opts.draw/Ct.SPAN)+.01);for(let v=0;v<s.MASTS;v++){const L=v%Be.EVERY===Be.MAIN_AT,y=[];for(let E=0;E<=t;E++)y.push(e.at(v,l*E/t));if(p(y,v,L?Be.MAIN/2:Be.LESSER/2,E=>l*E/t),L&&l<1){const E=[];for(let b=0;b<=6;b++)E.push(e.at(v,l+(1-l)*b/6));p(E,v,Be.BARE/2,b=>l+(1-l)*b/6),p([e.at(v,1-Be.LASH/Be.LENGTH),e.at(v,1)],v,Be.BARE*1.4,b=>b?1:1-Be.LASH/Be.LENGTH)}}await o.ctx.yield();const d=[];for(let v=0;v<=s.MASTS;v++)d.push(e.ring[v%s.MASTS]);for(let v=0;v<s.MASTS;v++)p([d[v],d[v+1]],v,Be.RING/2,()=>1);for(let v=Be.MAIN_AT;v<s.MASTS;v+=Be.EVERY){const L=e.ring[v],y=e.tan[v],E=Be.KNOT/2;p([[L[0]-y[0]*E,L[1],L[2]-y[1]*E],[L[0]+y[0]*E,L[1],L[2]+y[1]*E]],v,Be.RING*.9,()=>1.001)}for(let v=0;v<s.MASTS;v++)p([e.heads[v],e.heads[(v+1)%s.MASTS]].map(L=>[L[0],L[1]-.12,L[2]]),v,Be.HEAD/2,()=>0);const R=new U.BufferGeometry;R.setAttribute("position",new U.Float32BufferAttribute(r,3)),R.setAttribute("aDir",new U.Float32BufferAttribute(i,3)),R.setAttribute("aRope",new U.Float32BufferAttribute(h,4)),R.setIndex(c),o.uView={value:new U.Vector2(800,450)},o.updates.push(()=>{o.ctx.renderer.getDrawingBufferSize(o.uView.value)});const m=new U.ShaderMaterial({uniforms:{...o.U,uView:o.uView},vertexShader:_a,fragmentShader:xa,transparent:!0,depthWrite:!1,side:U.DoubleSide}),T=o.add("ropes and ring rope",new U.Mesh(R,m),c.length/3);T.frustumCulled=!1,T.renderOrder=3});const no={NA:4,NS:10,SCALLOP:.9,HEM:.22,FOLD:.85,FOLD_SLOPE:.14,ROLL_S:.6,ROLL_R:.3,ROLL_SAG:.3,HOLD:.1},go={DROP:1.7,RISE:.6,IN:.24,LEAN:.2,BELLY:.12,STIR:.16,NA:4,NV:2};function ra(a,o,e,t){const r=a.at(o,t),i=a.at(o+1,t);return[r[0]+(i[0]-r[0])*e,r[1]+(i[1]-r[1])*e,r[2]+(i[2]-r[2])*e]}const wa=`
attribute vec3 aCloth; attribute vec3 aTa; attribute vec3 aTs;
varying vec3 vW; varying vec3 vCloth; varying vec3 vTa; varying vec3 vTs;
${eo}
void main() {
  vec3 p = position;
  // (a spread cloth alone: a roll and the valance carry no rope's way, aTs nought)
  float hold = length(aTs) > .01 ? clamp((1. - uCloth.x - aCloth.y) / (${no.HOLD.toFixed(2)} * (1. - uCloth.x)), 0., 1.) : 1.;
  p.y += clothLiftG(aCloth.x, aCloth.y, aCloth.z, uTime) * ${s.CLOTH_BELLY.toFixed(2)} * hold;
  // the valance stirs in the morning's air: its foot swings in and out a hand's breadth or two on the world's clock
  if (aCloth.y < -.5) { float v = -aCloth.y - 1.; p.xz -= normalize(p.xz) * v * sin(3.14159265 * aCloth.x) * (${go.STIR.toFixed(2)} * sin(uTime * 1.7 + aCloth.z * 1.3) + ${(go.STIR*.5).toFixed(2)} * sin(uTime * 2.9 + aCloth.z * 2.1 + 1.)); }
  vec4 w = modelMatrix * vec4(p, 1.);
  vW = w.xyz; vCloth = aCloth; vTa = aTa; vTs = aTs;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,ma=`
varying vec3 vW; varying vec3 vCloth; varying vec3 vTa; varying vec3 vTs;
${eo}
void main() {
  float a = clamp(vCloth.x, 0., 1.), s = vCloth.y, j = floor(vCloth.z + .5);
  vec3 V = normalize(cameraPosition - vW), c = clothColour(j), N;
  float seam = 0., hem = 0., roll = step(length(vTs), .01);
  float fall = roll * step(s, -.5);
  if (fall > .5) {
    // the valance behind the masts: a scalloped foot (it hangs deepest in the strip's middle), the folds of a hung
    // cloth, a doubled hem along its foot, the seam at each mast
    float v = -s - 1., foot = ${go.RISE.toFixed(2)} + ${(1-go.RISE).toFixed(2)} * pow(max(sin(3.14159265 * a), 0.), .7);
    if (v > foot) discard;
    N = normalize(vTa);
    seam = 1. - smoothstep(0., .045, min(a, 1. - a));
    hem = 1. - smoothstep(.05, .09, foot - v);
    c *= (.93 + .07 * sin(a * 31. + j * 1.3)) * (1. - .12 * v);
  } else if (roll > .5) {
    // a furled roll (the rare look): a thick bundle, its lashings two darker bands
    N = normalize(vTa);
    seam = (1. - smoothstep(.02, .05, abs(a - .3))) + (1. - smoothstep(.02, .05, abs(a - .7)));
    c *= .9 + .1 * sin(a * 70. + j * 1.3);
  } else {
    // THE HEM: the cloth's inner edge hangs back in a scallop between its two ropes
    float sEnd = (1. - uCloth.x) - ${(no.SCALLOP/Ct.SPAN).toFixed(5)} * pow(max(sin(3.14159265 * a), 0.), .8);
    if (s > sEnd) discard;
    hem = 1. - smoothstep(${(no.HEM*.7/Ct.SPAN).toFixed(5)}, ${(no.HEM/Ct.SPAN).toFixed(5)}, sEnd - s);
    float wd = max(length(vTa), .3), ln = max(length(vTs), 1.);
    vec3 ta = vTa / wd, ts = vTs / ln, n0 = normalize(cross(ts, ta));
    if (n0.y < 0.) n0 = -n0;
    // the cloth's own slope from the ripple's law (the same law that lifts it)
    float ph = j * ${Ct.PHASE.toFixed(6)}, env = smoothstep(0., .08, s) * clamp((1. - uCloth.x - s) / (${no.HOLD.toFixed(2)} * (1. - uCloth.x)), 0., 1.);
    float f1 = ${Ct.RATE[0].toFixed(2)} * uTime - ${Ct.WAVES[0].toFixed(1)} * s + ph, f2 = ${Ct.RATE[1].toFixed(2)} * uTime + ${Ct.WAVES[1].toFixed(1)} * s + 2.3 * ph;
    float R = ${Ct.RIPPLE[0].toFixed(2)} + ${Ct.RIPPLE[1].toFixed(2)} * sin(f1) + ${Ct.RIPPLE[2].toFixed(2)} * sin(f2);
    float dR = -${(Ct.WAVES[0]*Ct.RIPPLE[1]).toFixed(3)} * cos(f1) + ${(Ct.WAVES[1]*Ct.RIPPLE[2]).toFixed(3)} * cos(f2);
    float dLa = 3.14159265 * cos(3.14159265 * a) * env * R * ${s.CLOTH_BELLY.toFixed(2)} / wd;
    float dLs = sin(3.14159265 * a) * env * dR * ${s.CLOTH_BELLY.toFixed(2)} / ln;
    // the folds across a strip, where the cloth is gathered along its ropes: one every ${no.FOLD} m, bowed with the
    // belly, melted where a fold is under two pixels (the pixel's footprint)
    float sm = s * ln, fwS = fwidth(sm);
    float fold = (cos(sm * ${(Math.PI*2/no.FOLD).toFixed(3)} * (.85 + .3 * fract(ph * .37)) + 1.6 * sin(3.14159265 * a) + ph * 3.1) + .6 * cos(sm * ${(Math.PI*2/no.FOLD*.37).toFixed(3)} - ph * 1.7 + .6 * uTime)) * (1. - smoothstep(${(no.FOLD*.25).toFixed(3)}, ${(no.FOLD*.6).toFixed(3)}, fwS));
    dLs += ${no.FOLD_SLOPE.toFixed(2)} * fold * sin(3.14159265 * a);
    N = normalize(n0 - ta * dLa - ts * dLs);
    // the seam along each rope
    seam = 1. - smoothstep(0., .045, min(a, 1. - a));
  }
  float top = fall > .5 ? smoothstep(-.05, .05, dot(N, V)) : roll > .5 ? 1. : smoothstep(-.05, .05, dot(N, V));
  float NL = max(dot(N, uSun), 0.), lit = fall > .5 ? 1. : step(.5, wallSun(vW));
  c *= 1. - .14 * seam - .16 * hem;   // (addendum 8, point 6: the seam along a rope is a soft line, never a dark arc: .14)
  // above: the sun and the sky on the cloth. Under: the sun THROUGH the weave (the cloth glows in its own colour where
  // the sun stands on its far side, more where the eye looks toward the sun, and lies plain in the wall's shade)
  // (order three, addendum 2, point 4: the cloths at the east end lean away from the low sun; their ripples' far
  // slopes must not stand in the sky's light alone as dark ridges between thin lit ones. A cloth is a thin woven sheet: the sun goes round into the weave and through the
  // fold: the lit share falls off softly past the fold's edge and never to nought on a cloth the sun stands over)
  float NLw = max(dot(N, uSun) * .7 + .3, 0.);
  vec3 above = c * (uSunCol * NLw * lit + uSkyCol * (.75 + .25 * N.y));
  vec3 deep = mix(c, c * c * 1.3, .35);   // (addendum 8, point 6: a dyed cloth's underside keeps its dye's own tone, not a deeper one: .35)
  float toward = pow(max(dot(-V, uSun), 0.), 5.);
  vec3 under = deep * uSunCol * ${Ct.THROUGH.toFixed(2)} * lit * (.25 + 1.5 * NL + 1.2 * toward) * (1. + .5 * hem) + c * (uSkyCol * .3 + uBounceCol * .7);
  gl_FragColor = vec4(hazed(mix(under, above, top), vW), 1.);
}`;po.push(async function(o){const e=na(),t=no,r=Math.max(.012,o.opts.draw/Ct.SPAN),i=[],h=[],c=[],A=[],p=[];let l=0;if(o.opts.rare){const m=t.ROLL_S/Ct.SPAN,T=6,v=4;for(let L=0;L<s.MASTS;L++){const y=e.at(L,m),E=e.at(L+1,m),b=[E[0]-y[0],E[1]-y[1],E[2]-y[2]],ot=Math.hypot(b[0],b[1],b[2])||1,g=-b[2]/ot,M=b[0]/ot;for(let q=0;q<=v;q++){const X=q/v,ht=Math.sin(Math.PI*X),tt=t.ROLL_R*(.45+.55*ht),F=y[0]+b[0]*X,at=y[1]+b[1]*X-t.ROLL_SAG*ht-t.ROLL_R*.6,rt=y[2]+b[2]*X;for(let Lt=0;Lt<=T;Lt++){const bt=Math.PI*2*Lt/T,zt=Math.cos(bt),j=Math.sin(bt);i.push(F+g*zt*tt,at+j*tt,rt+M*zt*tt),h.push(X,m,L),c.push(g*zt,j,M*zt),A.push(0,0,0)}}const G=T+1;for(let q=0;q<v;q++)for(let X=0;X<T;X++){const ht=l+q*G+X,tt=ht+G;p.push(ht,ht+1,tt,tt,ht+1,tt+1)}l+=(v+1)*G,L%60===59&&await o.ctx.yield()}}for(let m=0;m<(o.opts.rare?0:s.MASTS);m++){for(let v=0;v<=t.NA;v++)for(let L=0;L<=t.NS;L++){const y=v/t.NA,E=r*L/t.NS,b=e.at(m,E),ot=e.at(m+1,E),g=.01,M=ra(e,m,y,E+g),G=ra(e,m,y,E);i.push(G[0],G[1],G[2]),h.push(y,E,m),c.push(ot[0]-b[0],ot[1]-b[1],ot[2]-b[2]),A.push((M[0]-G[0])/g,(M[1]-G[1])/g,(M[2]-G[2])/g)}const T=t.NS+1;for(let v=0;v<t.NA;v++)for(let L=0;L<t.NS;L++){const y=l+v*T+L,E=y+T;p.push(y,E,y+1,E,E+1,y+1)}l+=(t.NA+1)*T,m%60===59&&await o.ctx.yield()}if(!o.opts.rare){await o.ctx.yield();const m=go;for(let T=0;T<s.MASTS;T++){const v=(T+1)%s.MASTS,L=e.heads[T],y=e.heads[v];let E=-(y[2]-L[2]),b=y[0]-L[0];const ot=Math.hypot(E,b)||1;E/=ot,b/=ot,E*L[0]+b*L[2]>0&&(E=-E,b=-b);const g=(G,q)=>{const X=m.IN+m.LEAN*q+m.BELLY*Math.sin(Math.PI*G)*Math.sin(Math.PI*Math.min(q,1));return[L[0]+(y[0]-L[0])*G+E*X,L[1]-.1-m.DROP*q,L[2]+(y[2]-L[2])*G+b*X]};for(let G=0;G<=m.NA;G++)for(let q=0;q<=m.NV;q++){const X=G/m.NA,ht=q/m.NV,tt=.02,F=g(X,ht),at=g(Math.min(X+tt,1),ht),rt=g(Math.max(X-tt,0),ht),Lt=g(X,ht+tt),bt=g(X,Math.max(ht-tt,0)),zt=[at[0]-rt[0],at[1]-rt[1],at[2]-rt[2]],j=[Lt[0]-bt[0],Lt[1]-bt[1],Lt[2]-bt[2]];let Rt=zt[1]*j[2]-zt[2]*j[1],Gt=zt[2]*j[0]-zt[0]*j[2],gt=zt[0]*j[1]-zt[1]*j[0];const et=Math.hypot(Rt,Gt,gt)||1,Zt=Rt*E+gt*b>0?-1:1;i.push(F[0],F[1],F[2]),h.push(X,-1-ht,T),c.push(Zt*Rt/et,Zt*Gt/et,Zt*gt/et),A.push(0,0,0)}const M=m.NV+1;for(let G=0;G<m.NA;G++)for(let q=0;q<m.NV;q++){const X=l+G*M+q,ht=X+M;p.push(X,ht,X+1,ht,ht+1,X+1)}l+=(m.NA+1)*M,T%80===79&&await o.ctx.yield()}}const d=new U.BufferGeometry;d.setAttribute("position",new U.Float32BufferAttribute(i,3)),d.setAttribute("aCloth",new U.Float32BufferAttribute(h,3)),d.setAttribute("aTa",new U.Float32BufferAttribute(c,3)),d.setAttribute("aTs",new U.Float32BufferAttribute(A,3)),d.setIndex(p);const R=new U.ShaderMaterial({uniforms:{...o.U},vertexShader:wa,fragmentShader:ma,side:U.DoubleSide});o.add("cloths",new U.Mesh(d,R),p.length/3).frustumCulled=!1});const de={STONE:0,ROWS:1,WOOD_ROWS:2,TIMBER:3,WALL5:4,LEDGE:5,PIT:6,COLUMN:7,GATE:8},Ce={NT:192,ROOF_D0:s.GAL_D0-.3,ROOF_D1:s.RING_DEPTH-1.3,ROOF_UNDER:s.ROOF_Y-1,COL_D:33.45,COL_R:.42,GATE_HALF:s.GATE_W/2,GATE_SPRING:s.GATE_H-s.GATE_W/2,GATE_BLOCK_HALF:3.7,GATE_BLOCK_TOP:7.7,GATE_BLOCK_D:8.2,GATE_LEN:22};function Ta(a=!0){const o=De,e=[],t=r=>{a&&e.push(r)};return e.push([-1.5,-s.WATER_DEEP-.3,-1.5,0,de.PIT,.5,.9]),e.push([-1.5,0,0,0,de.LEDGE,.9,.8]),e.push([0,0,0,s.PODIUM_H,de.STONE,.85,1]),o.podium.forEach((r,i)=>{t([r.d0,r.y,r.d1,r.y,de.STONE,1,.85]);const h=i<o.podium.length-1?o.podium[i+1].y:o.Z1_Y0;t([r.d1,r.y,r.d1,h,de.STONE,.85,1])}),t([o.Z1_D0,o.Z1_Y0,o.Z1_D1,o.Z1_Y1,de.ROWS,1,1,[o.Z1_D0,s.ROW_D,s.ROW_H]]),e.push([o.Z1_D1,o.Z1_Y1,o.Z2_D0,o.Z1_Y1,de.STONE,1,.8]),e.push([o.Z2_D0,o.Z1_Y1,o.Z2_D0,o.Z2_Y0,de.STONE,.8,1]),t([o.Z2_D0,o.Z2_Y0,o.Z2_D1,o.Z2_Y1,de.ROWS,1,1,[o.Z2_D0,s.ROW_D,s.ROW_H]]),e.push([o.Z2_D1,o.Z2_Y1,s.WALL5_D0,s.WALL5_TOP,de.WALL5,.85,1]),e.push([s.WALL5_D0,s.WALL5_TOP,s.WALL5_D1,s.WALL5_TOP,de.STONE,1,.7]),t([s.GAL_D0,s.WALL5_TOP,s.GAL_D1,s.GAL_TOP,de.WOOD_ROWS,.75,.45,[s.GAL_D0,s.GAL_STEP_D,s.GAL_STEP_H]]),t([s.GAL_D1,s.GAL_TOP,s.STAND_D1,s.GAL_TOP,de.TIMBER,.45,.35]),e.push([s.STAND_D1,s.GAL_TOP,s.STAND_D1,Ce.ROOF_UNDER,de.TIMBER,.35,.3]),e.push([Ce.ROOF_D0,Ce.ROOF_UNDER,Ce.ROOF_D0,s.ROOF_Y,de.TIMBER,.8,1]),e.push([Ce.ROOF_D0,s.ROOF_Y,Ce.ROOF_D1,s.ROOF_Y,de.TIMBER,1,.9]),e.push([s.STAND_D1,Ce.ROOF_UNDER,Ce.ROOF_D0,Ce.ROOF_UNDER,de.TIMBER,.3,.55]),e}const Sa=`
attribute vec4 aSec; attribute vec3 aRow;
varying vec3 vW; varying vec3 vN; varying vec4 vSec; varying vec3 vRow;
void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normal; vSec = aSec; vRow = aRow; gl_Position = projectionMatrix * viewMatrix * w; }`;po.push(async function(o){const e=So(),t=[],r=[],i=Ta(o.opts.seats!==!1),h=Ce.NT,c=(l,d,R)=>{const m=Math.PI*2*R/h;return[_o(l)*Math.cos(m),d,To(l)*Math.sin(m)]};for(let l=0;l<h;l++){for(const d of i){we(e,c(d[0],d[1],l),c(d[0],d[1],l+1),c(d[2],d[3],l+1),c(d[2],d[3],l),1,0);const R=d[7]||[0,1,1],m=l*s.BAYS/h,T=(l+1)*s.BAYS/h;t.push(d[0],m,d[4],d[5],d[0],T,d[4],d[5],d[2],T,d[4],d[6],d[2],m,d[4],d[6]);for(let v=0;v<4;v++)r.push(R[0],R[1],R[2])}l%48===47&&await o.ctx.yield()}const A=new U.BufferGeometry;A.setAttribute("position",new U.Float32BufferAttribute(e.pos,3)),A.setAttribute("normal",new U.Float32BufferAttribute(e.nor,3)),A.setAttribute("aSec",new U.Float32BufferAttribute(t,4)),A.setAttribute("aRow",new U.Float32BufferAttribute(r,3)),A.setIndex(e.idx);const p=new U.ShaderMaterial({uniforms:{...o.U},vertexShader:Sa,fragmentShader:La,side:U.DoubleSide});o.bowlMat=p,o.add("bowl",new U.Mesh(A,p),e.idx.length/3).frustumCulled=!1});const La=`
varying vec3 vW; varying vec3 vN; varying vec4 vSec; varying vec3 vRow;
${eo}
${Fo}
void main() {
  float d = vSec.x, bayU = vSec.y, kind = floor(vSec.z + .5), ao = vSec.w;
  vec3 N = normalize(vN);
  float fa = FA_A + d, fb = FA_B + FA_K * d;
  vec2 rad = normalize(vec2(vW.x / (fa * fa), vW.z / (fb * fb)) + vec2(1e-6, 0.));
  vec3 E = normalize(vW - cameraPosition);
  float fwD = fwidth(d);
  // the gates' passages on the long axis are cut out of the stone (their own piece stands in the cut)
  vec2 gq = vec2(abs(vW.z), vW.y - ${Ce.GATE_SPRING.toFixed(2)});
  float inGate = step(gq.x, ${Ce.GATE_HALF.toFixed(2)}) * (gq.y < 0. ? 1. : step(dot(gq, gq), ${(Ce.GATE_HALF*Ce.GATE_HALF).toFixed(3)}));
  if (inGate > .5 && abs(vW.x) > 30. && d < ${Ce.GATE_LEN.toFixed(1)} && d > -1.4) discard;
  vec3 alb = ${$e(Ne.MARBLE)};
  float under = 0.;
  if (kind == ${de.ROWS}. || kind == ${de.WOOD_ROWS}.) {
    // a slope of rows: which face of a step the eye meets (the tread from above, the riser from across)
    float fd = (d - vRow.x) / vRow.y, f = fract(fd), rowI = floor(fd);
    float vd = dot(E.xz, rad), vy = -E.y;
    float riser = vd > 0. ? step((1. - f) * vRow.y * max(vy, 0.), f * vRow.z * vd) : 0.;
    float share = vd > 0. ? clamp(vRow.z * vd / max(vRow.z * vd + vRow.y * max(vy, 0.), 1e-4), 0., 1.) : 0.;
    float fine = 1. - smoothstep(.3, .75, fwD / vRow.y);
    riser = mix(share, riser, fine);
    float back = vd > 0. && vy > 0. ? clamp(f + f * vRow.z * vd / max(vy * vRow.y, 1e-4), 0., 1.) : f;
    float seam = (1. - riser) * (1. - .45 * smoothstep(.72, 1., back) * fine);
    N = normalize(mix(vec3(0., 1., 0.), vec3(-rad.x, 0., -rad.y), riser));
    ao *= mix(seam, .82, riser);
    if (kind == ${de.WOOD_ROWS}.) { alb = ${$e(Ne.TIMBER)} * (1.25 + .2 * hash21(vec2(rowI, floor(bayU)))); }
    else {
      alb *= .97 + .05 * hash21(vec2(rowI, floor(bayU * 6.)));
      // the stairs' mouths: dark door openings 2.5 m wide in two rings (forty in each zone), drawn only
      float bw = 6.2831853 * .5 * (fa + fb) / ${s.BAYS.toFixed(1)};
      float first = step(vRow.x, 10.);
      float mouthBay = mod(floor(bayU) + first, 2.);
      float mx = abs(fract(bayU) - .5) * bw, my = fd - (first > .5 ? 9. : 3.);
      float mouth = mouthBay * step(mx, 1.1) * step(0., my) * step(my, 3.2);
      // a mouth is a stair's well: its near steps still catch the sky, its far end is deep
      alb = mix(alb, ${$e(Ne.TRAVERTINE)} * mix(.6, .26, smoothstep(.2, 2.6, my)), mouth); under = mouth * .65;
    }
  } else if (kind == ${de.TIMBER}.) {
    alb = ${$e(Ne.TIMBER)} * (1.1 + .25 * vnoise(vec2(bayU * 9., d * 1.3)));
    alb *= 1. - .2 * (1. - smoothstep(0., .06, abs(fract(bayU) - .5) - .47));
  } else if (kind == ${de.WALL5}.) {
    // the wall under the colonnade, with doors and windows in it
    alb = ${$e(Ne.TRAVERTINE)};
    float y = vW.y - ${De.Z2_Y1.toFixed(2)};
    float bx = abs(fract(bayU) - .5) * 6.2831853 * .5 * (fa + fb) / ${s.BAYS.toFixed(1)};
    float door = step(bx, .6) * step(y, 2.3);
    float win = step(abs(bx - 1.9), .35) * step(abs(y - 3.4), .5);
    alb = mix(alb, ${$e(Ne.DARK)}, max(door, win)); under = max(door, win);
  } else if (kind == ${de.LEDGE}. || kind == ${de.PIT}.) {
    alb = ${$e(Ne.TRAVERTINE)} * .9;
    // wet where the water laps it: the pit's wall and the ledge's inner edge, the border wavering on the world's clock
    float lap = .32 + .1 * sin(bayU * 23. + uTime * 1.1) * sin(bayU * 9.7 - uTime * .8);
    float wet = kind == ${de.PIT}. ? 1. : 1. - smoothstep(lap - .08, lap + .08, d + 1.5);
    alb *= mix(1., .5, wet);
  } else if (kind == ${de.COLUMN}.) {
    // grey granite and cipollino (white marble with grey green waves) by turns
    float wave = sin(vW.y * 2.2 + 4. * vnoise(vec2(bayU * 5., vW.y * .9)));
    alb = vRow.x < .5 ? vec3(.36, .36, .38) * (.85 + .3 * hash21(floor(vW.xy * 9.))) : mix(vec3(.72, .74, .7), vec3(.42, .5, .44), smoothstep(.2, .9, wave));
  } else if (kind == ${de.GATE}.) {
    // a gate's passage: dimmer the deeper it runs from either end
    float deep = min(abs(vW.x) - ${s.ARENA_A.toFixed(1)}, ${s.RIM_A.toFixed(1)} - abs(vW.x));
    alb = ${$e(Ne.TRAVERTINE)} * .8; ao *= .12 + .6 * exp(-max(deep, 0.) / 5.); under = 1.;
  } else {
    // marble: the podium wall and its platforms, the walkway and its low wall
    alb *= .97 + .05 * hash21(floor(vec2(bayU * 4., vW.y * 1.2)));
  }
  vec3 sun = sunAt(vW + N * .05) * uSunCol * max(dot(N, uSun), 0.) * (1. - under);
  // under the cloth the sky's fill is the cloth's own dyed glow (the one law's fillAt)
  float jf = fract(bayU / ${s.BAYS.toFixed(1)}) * ${s.MASTS.toFixed(1)};
  vec3 col = alb * (sun + fillAt(vW, N, d, jf) * ao);
  gl_FragColor = vec4(hazed(col, vW), 1.);
}`;po.push(async function(o){const e=So(),t=[],r=[],i=Ce,h=(A,p,l)=>{for(;t.length/4<e.n;){const d=t.length/4;t.push(A,p,e.mat[d*2+1],e.mat[d*2]),r.push(l[0],l[1],l[2])}};for(let A=0;A<s.COLONNADE_N;A++){const p=Math.PI*2*A/s.COLONNADE_N,l=_o(i.COL_D)*Math.cos(p),d=To(i.COL_D)*Math.sin(p),R=s.WALL5_TOP,m=R+s.COLONNADE_H;Se(e,[l,R,d],[l,R+.3,d],i.COL_R*1.35,i.COL_R*1.35,8,de.COLUMN,void 0),Se(e,[l,R+.3,d],[l,m-.5,d],i.COL_R,i.COL_R*.86,8,de.COLUMN,void 0),Se(e,[l,m-.5,d],[l,m+.1,d],i.COL_R*.9,i.COL_R*1.6,8,de.COLUMN,void 0),h(i.COL_D,A,[A%2,1,1]),A%20===19&&await o.ctx.yield()}for(const A of[1,-1]){const p=(b,ot,g)=>[A*b,ot,A*g],l=s.ARENA_A-.3,d=s.ARENA_A+i.GATE_BLOCK_D,R=s.RIM_A-s.PIER_D,m=i.GATE_BLOCK_HALF,T=i.GATE_HALF,v=i.GATE_SPRING,L=i.GATE_BLOCK_TOP,y=10,E=(b,ot,g,M,G,q)=>we(e,p(...b),p(...ot),p(...g),p(...M),G,q);E([l,0,T],[l,0,m],[l,L,m],[l,L,T],1,de.STONE),E([l,0,-m],[l,0,-T],[l,L,-T],[l,L,-m],1,de.STONE);for(let b=0;b<y;b++){const ot=Math.PI*b/y,g=Math.PI*(b+1)/y,M=T*Math.cos(ot),G=v+T*Math.sin(ot),q=T*Math.cos(g),X=v+T*Math.sin(g);E([l,X,q],[l,G,M],[l,L,M],[l,L,q],1,de.STONE),E([l,G,M],[l,X,q],[R,X,q],[R,G,M],.9,de.GATE)}E([l,L,-m],[l,L,m],[d,L,m],[d,L,-m],1,de.STONE),E([l,0,m],[d,0,m],[d,L,m],[l,L,m],.9,de.STONE),E([d,0,-m],[l,0,-m],[l,L,-m],[d,L,-m],.9,de.STONE),E([R,0,T],[l,0,T],[l,v,T],[R,v,T],.9,de.GATE),E([l,0,-T],[R,0,-T],[R,v,-T],[l,v,-T],.9,de.GATE),E([s.WATER_A,0,-T],[s.WATER_A,0,T],[R,0,T],[R,0,-T],.9,de.GATE),h(0,0,[0,1,1])}for(const A of[1,-1]){const p=A*(s.ARENA_B-.3),l=A*(s.ARENA_B+s.BOX_D),d=s.BOX_W/2;Ie(e,-d,d,0,s.BOX_TOP,Math.min(p,l),Math.max(p,l),A>0?"blrt":"flrt",1,de.STONE),h(0,20,[0,1,1])}const c=new U.BufferGeometry;c.setAttribute("position",new U.Float32BufferAttribute(e.pos,3)),c.setAttribute("normal",new U.Float32BufferAttribute(e.nor,3)),c.setAttribute("aSec",new U.Float32BufferAttribute(t,4)),c.setAttribute("aRow",new U.Float32BufferAttribute(r,3)),c.setIndex(e.idx),o.add("colonnade, gates, boxes",new U.Mesh(c,o.bowlMat),e.idx.length/3).frustumCulled=!1});const oo={PLAZA:55,N_FOOT:-137,N_TOP:-189,N_Y:18,S_FOOT:135,S_TOP:260,S_TOP_W:380,S_Y:15,STREET_HALF:5,VELIA:6,FORE:{X0:53.5,X1:190,Z0:38,Z1:136,MOUTHS:6,MOUTH_Z:[46,124]},TOWN:{X0:105,X1:450,Z0:-118,Z1:330,XW:-80,ROW_D:[15,25],FRONT:[7.5,15],STREET:[4.2,6.8],CROSS:[2.6,4.2],CROSS_EVERY:[3,6],COURT:.1,SPLIT:.72,LANE_X1:440,HUNG_EVERY:[22,60],HUNG_Y:[4.6,6.2],SMOKE:.15,SMOKE_CLEAR:70,SMOKE_REACH:12},STOREY2:[6.4,7.6],STOREY3:[9.2,10.8],ROOF_RISE:[1.6,3.8],RIDGE_MAX:15,BATHS:{CX:26,CZ:-249,W:105,D:120,WALL:16,HALL_W:34,HALL_D:70,HALL_H:24,FRONT_D:8,FRONT_H:11,STAIR_W:36,STAIR_Z1:-131,STAIR_LIFT:.3,FOOT_D:9,FOOT_H:7.5},PALACE:{CX:165,Z:-310,LEN:365,D:42,H:13,PORTICO_D:6,PORTICO_H:6.5},TERRACE:{CX:141,CZ:265,W:175,D:260,PARAPET:1.2,TEMPLE_W:30,TEMPLE_L:52,TEMPLE_FRONT:11,PODIUM:4,COLUMN:15,ENTAB:3,PEDIMENT:4.2,PORTICO_H:7,PORTICO_D:7}},Wo=(a,o)=>{let e=Math.imul(a|0,374761393)+Math.imul(o|0,668265263)|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296},jo=(a,o)=>{const e=Math.floor(a),t=Math.floor(o),r=a-e,i=o-t,h=r*r*(3-2*r),c=i*i*(3-2*i),A=Wo(e,t),p=Wo(e+1,t),l=Wo(e,t+1),d=Wo(e+1,t+1);return A+(p-A)*h+(l-A)*c+(A-p-l+d)*h*c};function ro(a,o,e=[0,0]){const t=oo,r=Math.hypot(a,o);let i=t.N_Y*Math.min(1,Math.max(0,(t.N_FOOT-o)/(t.N_FOOT-t.N_TOP)))+14*Eo(-420,-1100,o)+t.S_Y*Eo(t.S_FOOT,t.S_TOP+(t.S_TOP_W-t.S_TOP)*Eo(70,20,a),o)+16*Eo(420,1100,o);return i+=t.VELIA*Eo(-220,-450,a)+12*Eo(520,1300,a),r>1100&&(i+=150*Eo(1100,3200,r)*jo(a/700+e[0],o/700+e[1])),a<-3600&&(i+=380*Eo(-3600,-6200,a)*(.55+.45*jo(o/900+e[1],e[0]))),i}function Ro(){const a=oo,o=a.BATHS,e=a.PALACE,t=a.TERRACE,r=o.CX-o.W/2,i=o.CX+o.W/2,h=o.CZ-o.D/2,c=o.CZ+o.D/2,A=t.CX-t.W/2,p=t.CX+t.W/2,l=t.CZ-t.D/2,d=t.CZ+t.D/2,R=a.S_Y;return{baths:[r,i,a.N_Y,a.N_Y+o.WALL,h,c-o.FRONT_D],bathsHall:[o.CX-o.HALL_W/2,o.CX+o.HALL_W/2,a.N_Y+o.WALL,a.N_Y+o.HALL_H,o.CZ-o.HALL_D/2,o.CZ+o.HALL_D/2],bathsFront:[r,i,a.N_Y,a.N_Y+o.FRONT_H,c-o.FRONT_D,c],bathsFoot:[o.CX-o.STAIR_W/2,o.CX+o.STAIR_W/2,0,o.FOOT_H,o.STAIR_Z1,o.STAIR_Z1+o.FOOT_D],palace:[i,e.CX+e.LEN/2,a.N_Y,a.N_Y+e.H,e.Z-e.D,e.Z],palacePortico:[i,e.CX+e.LEN/2,a.N_Y,a.N_Y+e.PORTICO_H,e.Z,e.Z+e.PORTICO_D],terrace:[A,p,0,R+t.PARAPET,l,d],temple:[t.CX-t.TEMPLE_W/2,t.CX+t.TEMPLE_W/2,R,R+t.PODIUM+t.COLUMN+t.ENTAB+t.PEDIMENT,l+t.TEMPLE_FRONT,l+t.TEMPLE_FRONT+t.TEMPLE_L]}}function Ga(a,o=[0,0]){const e=oo,t=e.TOWN,r=[],i=Ro(),h=[],c=[],A=[],p=[],l=s.RIM_A+e.PLAZA,d=s.RIM_B+e.PLAZA,R=wo(),m=(y,E)=>y*y/(l*l)+E*E/(d*d)<1,T=(y,E,b,ot,g,M)=>b>y[0]-M&&E<y[1]+M&&g>y[4]-M&&ot<y[5]+M,v=(y,E)=>y[0]+(y[1]-y[0])*E,L=y=>y[0]+Math.floor(a()*(y[1]-y[0]+1));for(const y of[1,-1]){let E=e.STREET_HALF+.5;const b=y>0?t.Z1:-t.Z0;for(;E<b;){const ot=v(t.ROW_D,a());let g=t.XW+a()*10,M=L(t.CROSS_EVERY);for(;g<t.X1;){const X=v(t.FRONT,a()),ht=a()<t.SPLIT?.4+.2*a():1,tt=g,F=g+X;for(let at=0;at<2;at++){const rt=[a(),a(),a(),a(),a(),a()];if(at===1&&ht>=1)continue;const Lt=E+(at===0?0:ot*ht),bt=E+(at===0?ot*ht:ot),zt=y>0?Lt:-bt,j=y>0?bt:-Lt;if(F<t.X0&&j<e.S_FOOT||m(tt,zt)||m(F,zt)||m(tt,j)||m(F,j)||T(i.terrace,tt,F,zt,j,6)||F>e.FORE.X0&&tt<e.FORE.X1&&j>e.FORE.Z0&&zt<e.FORE.Z1)continue;const Rt=Math.min(ro(tt,zt,o),ro(F,zt,o),ro(tt,j,o),ro(F,j,o)),Gt=Math.max(ro(tt,zt,o),ro(F,zt,o),ro(tt,j,o),ro(F,j,o));if(rt[0]<t.COURT){c.push({x:(tt+F)/2,z:(zt+j)/2,r:Math.min(F-tt,j-zt)/2,base:Gt});continue}const gt=Gt+(rt[1]<.68?v(e.STOREY2,rt[2]):v(e.STOREY3,rt[2])),et=Math.min(gt+v(e.ROOF_RISE,rt[3])*Math.min(1,Math.min(F-tt,j-zt)/9),Gt+e.RIDGE_MAX),Zt={x0:tt,x1:F,z0:zt,z1:j,base:Rt,eave:gt,ridge:et,axis:F-tt>=j-zt?0:1,tone:rt[4]<.45?0:rt[4]<.8?1:2};r.push(Zt);const he=(tt+F)/2,oe=(zt+j)/2;rt[5]<t.SMOKE&&R.planDist(he,oe)>t.SMOKE_CLEAR&&p.push({x:he+(rt[3]-.5)*2,y:et-.3,z:oe+(rt[2]-.5)*2})}g+=X,M--,M<=0&&(g+=v(t.CROSS,a()),M=L(t.CROSS_EVERY))}const G=v(t.STREET,a()),q=E+ot+G/2;if(q<d-8){let X=Math.max(l*Math.sqrt(1-q*q/(d*d))+1,t.X0+2);y>0&&q>e.FORE.Z0-3&&q<e.FORE.Z1&&(X=Math.max(X,e.FORE.X1+1)),h.push({z:y*q,w:G,side:y,x0:X,x1:t.LANE_X1});for(let ht=X+6+a()*20;ht<t.X1-5;ht+=v(t.HUNG_EVERY,a()))A.push({x:ht,z0:y*q-G/2,z1:y*q+G/2,y:v(t.HUNG_Y,a()),w:1.1+1.6*a(),tone:a()})}E+=ot+G}}return r.lanes=h,r.courts=c,r.hung=A,r.smoke=p,r}const Qo={TERRACES:6,X:[-70,372],STAIR_GAP:1.5,CYPRESS:{H:[9,15],R:[.95,1.5],EVERY:[5.5,8.5],RUN:[4,11],GAP:[14,34]},PINE:{H:[9,14],R:[3.2,5.2],IN_GAP:.45},AVENUE_Z:-247,AVENUE_HALF:6,AVENUE_EVERY:7.5,AVENUE_X:[8,340],CLUMPS:7,CLUMP_N:[3,7],CLUMP_R:11,FOOT_EVERY:[12,18],TEMPLE_ROW:9.5,TEMPLE_EVERY:8,WALK:{SIDE:19,EVERY:9,END:9,HALF:2.6,BEHIND:16,PHASE:.3},ROW_H:[10,15],ROW_R:[1,1.4]};function Oa(){const a=oo,o=a.TERRACE,e=Qo,t=Ro(),r=wo(),i=[];let h=0;for(let m=r.outLength;m>0;m-=.25)if(r.out(m)[2]<=t.terrace[4]){h=m;break}const c=r.out(r.outLength),A=r.out(h),p=Math.hypot(A[0]-c[0],A[2]-c[2]),l=(A[0]-c[0])/p,d=(A[2]-c[2])/p,R=[c[0]-l*e.WALK.BEHIND-d*e.WALK.SIDE,c[2]-d*e.WALK.BEHIND+l*e.WALK.SIDE];return i.push({ox:R[0],oz:R[1],ax:l,az:d,every:e.WALK.EVERY,n:Math.floor((p+e.WALK.BEHIND-e.WALK.END)/e.WALK.EVERY)+1,phase:e.WALK.PHASE,walk:{x:c[0],z:c[2],dx:l,dz:d}}),i}function ya(a,o){const e=Qo,t=r=>r-Math.floor(r);return{x:a.ox+a.ax*a.every*o,z:a.oz+a.az*a.every*o,h:e.ROW_H[0]+(e.ROW_H[1]-e.ROW_H[0])*t(o*.618034+a.phase),r:e.ROW_R[0]+(e.ROW_R[1]-e.ROW_R[0])*t(o*.414214+a.phase*2.3)}}function qa(a){const o=oo,e=o.BATHS,t=o.TERRACE,r=Qo,i=Ro(),h=[],c=[],A=(L,y)=>L[0]+(L[1]-L[0])*y,p=L=>L[0]+Math.floor(a()*(L[1]-L[0]+1)),l=(L,y,E)=>c.push({x:L,y,z:E,kind:0,h:A(r.CYPRESS.H,a()),r:A(r.CYPRESS.R,a())}),d=(L,y,E)=>c.push({x:L,y,z:E,kind:1,h:A(r.PINE.H,a()),r:A(r.PINE.R,a())}),R=(o.N_FOOT-o.N_TOP)/r.TERRACES,m=o.N_Y/r.TERRACES,T=e.CX-e.STAIR_W/2-r.STAIR_GAP,v=e.CX+e.STAIR_W/2+r.STAIR_GAP;for(let L=0;L<r.TERRACES;L++){const y=o.N_FOOT-R*L,E=m*L,b=m*(L+1);for(const[ot,g]of[[r.X[0],T],[v,r.X[1]]]){h.push({x0:ot,x1:g,zf:y,zb:y-R,y0:E,y1:b});let M=ot+2+a()*6;for(;M<g-2;){for(let q=p(r.CYPRESS.RUN);q>0&&M<g-2;q--)l(M,b,y-1.3-a()*.5),M+=A(r.CYPRESS.EVERY,a());const G=A(r.CYPRESS.GAP,a());a()<r.PINE.IN_GAP&&M+G/2<g-6&&d(M+G/2,b,y-R*(.4+.3*a())),M+=G}}}for(let L=r.X[0]+a()*8;L<r.X[1];L+=A(r.FOOT_EVERY,a()))(L<T-5||L>v+5)&&d(L,0,o.N_FOOT+3.5+a());for(let L=i.baths[1]+r.AVENUE_X[0];L<r.AVENUE_X[1];L+=r.AVENUE_EVERY)for(const y of[-1,1])l(L,o.N_Y,r.AVENUE_Z+y*r.AVENUE_HALF);for(let L=0;L<r.CLUMPS;L++){const y=i.baths[1]+18+a()*(r.AVENUE_X[1]-i.baths[1]-30),E=r.AVENUE_Z+(a()<.5?-1:1)*(r.AVENUE_HALF+r.CLUMP_R+4+a()*14);for(let b=p(r.CLUMP_N);b>0;b--){const ot=a()*Math.PI*2,g=Math.sqrt(a())*r.CLUMP_R;d(y+Math.cos(ot)*g,o.N_Y,E+Math.sin(ot)*g*.7)}}for(let L=0;L<5;L++)d(i.baths[0]-14-a()*22,o.N_Y,e.CZ-30+a()*60);for(const L of Oa())for(let y=0;y<L.n;y++){const E=ya(L,y);c.push({x:E.x,y:o.S_Y+t.PARAPET,z:E.z,kind:0,h:E.h,r:E.r,fine:!0})}return{terraces:h,trees:c}}const ba={X_END:460,R_END:980,RINGS:[{r:[0,430],depth:[17,24],front:[9,17],lane:[4,7],cross:[3,5]},{r:[430,680],depth:[24,34],front:[16,32],lane:[6,9],cross:[5,8]},{r:[680,980],depth:[34,46],front:[28,56],lane:[8,12],cross:[7,11]}],KEEP:.2,GAP:.06,EAVE:[5.6,10.4],RISE:[1.8,3.6],PRECINCT:[-70,372,-372,-118],STEEP:3.2,WIDE:{r:[980,1750],depth:[38,56],front:[34,70],lane:[9,14],cross:[8,13],end:1750,steep:9}};function Va(a,o=[0,0]){const e=Ma(a,o);let t=e.next();for(;!t.done;)t=e.next();return t.value}function*Ma(a,o=[0,0]){const e=wo().entry,t={X0:-20,X1:Math.ceil(e[0])+1,Z0:0,Z1:Math.ceil(e[2])+1},r=oo,i=r.TOWN,h=ba,c=Ro(),A=[],p=s.RIM_A+r.PLAZA+14,l=s.RIM_B+r.PLAZA+14,d=(m,T)=>m[0]+(m[1]-m[0])*T,R=(m,T,v,L,y,E)=>v>m[0]-E&&T<m[1]+E&&y>m[4]-E&&L<m[5]+E;for(const m of[...h.RINGS,h.WIDE]){const T=m.end||h.R_END,v=m.steep||h.STEEP;let L=-T;for(;L<T;){const y=d(m.depth,a());let E=-T+a()*10,b=3+Math.floor(a()*4);for(;E<h.X_END;){const ot=d(m.front,a()),g=[a(),a(),a(),a(),a()],M=E,G=E+ot,q=L,X=L+y,ht=(M+G)/2,tt=(q+X)/2,F=Math.hypot(ht,tt);if(E+=ot,b--,b<=0&&(E+=d(m.cross,a()),b=3+Math.floor(a()*4)),F<m.r[0]||F>=m.r[1]||G>i.XW-6&&M<i.X1+6&&X>i.Z0-6&&q<i.Z1+6||ht*ht/(p*p)+tt*tt/(l*l)<1||G>h.PRECINCT[0]&&M<h.PRECINCT[1]&&X>h.PRECINCT[2]&&q<h.PRECINCT[3]||R(c.terrace,M,G,q,X,10)||g[0]<h.GAP||jo(ht/170+o[0],tt/170+o[1])<h.KEEP)continue;const at=[ro(M,q,o),ro(G,q,o),ro(M,X,o),ro(G,X,o)],rt=Math.min(...at),Lt=Math.max(...at);if(Lt-rt>v)continue;const bt=Lt+d(h.EAVE,g[1]),zt=bt+d(h.RISE,g[2])*Math.min(1.6,Math.min(ot,y)/9);A.push({x0:M,x1:G,z0:q,z1:X,base:rt,eave:bt,ridge:zt,axis:ot>=y?0:1,tone:g[3]<.45?0:g[3]<.8?1:2,no:(tt>t.Z1?"f":tt<t.Z0?"b":"")+(ht<t.X0?"l":ht>t.X1?"r":"")})}L+=y+d(m.lane,a())}m===h.RINGS[0]&&(yield A.length)}return A}const Na={FLOCKS:6,FLOCK_N:[14,30],FLOCK_R:[16,38],FLOCK_Y:[21,38],FLOCK_X:[140,335],FLOCK_Z:[-105,125],CLEAR:10,SPREAD:5,RISE:2.5,WALL_FLOCKS:3,WALL_N:[18,34],WALL_OUT:[6,14],WALL_Y:[38,46],PACE:[7,11],TEMPLE:{K:[1.6,1.7],Y:[34,40],SPREAD:2.5}},Lo={W:2.2,D:1.1,H:1.25,GAP:.9};function Ka(){const a=oo,o=a.TERRACE,e=o.CZ-o.D/2+.5+Lo.GAP,t=a.S_Y+o.PARAPET;return{box:[o.CX-Lo.W/2,o.CX+Lo.W/2,t,t+Lo.H,e,e+Lo.D],smoke:{x:o.CX,y:t+Lo.H-.05,z:e+Lo.D/2}}}function Za(a){const o=Na,e=wo().planDist,t=[],r=(i,h)=>{i.birds=new Float32Array(i.n*5);for(let c=0;c<i.birds.length;c++)i.birds[c]=h();return i};for(let i=0;i<o.FLOCKS;i++){const h=a("birds-"+i),c=p=>p[0]+(p[1]-p[0])*h();let A=null;for(let p=0;p<60&&!A;p++){const l=c(o.FLOCK_X),d=c(o.FLOCK_Z),R=c(o.FLOCK_R),m=c(o.FLOCK_Y),T=Math.round(c(o.FLOCK_N)),v=(h()<.5?-1:1)*c(o.PACE)/R;e(l,d)>=R+o.SPREAD+o.CLEAR&&(A={x:l,y:m,z:d,rx:R,rz:R*(.7+.3*h()),turn:v,n:T,spread:o.SPREAD,wall:!1})}A&&(r(A,h),A.phase=h()*Math.PI*2,t.push(A))}for(let i=0;i<o.WALL_FLOCKS;i++){const h=a("birds-"+(o.FLOCKS+i)),c=R=>R[0]+(R[1]-R[0])*h(),A=c(o.WALL_OUT),p=c(o.WALL_Y),l=Math.round(c(o.WALL_N)),d=c(o.PACE)*1.3;t.push(r({x:0,y:p,z:0,rx:s.RIM_A+A,rz:s.RIM_B+A,turn:(i%2?-1:1)*d/(s.RIM_A+A),n:l,spread:3,wall:!0,phase:h()*Math.PI*2},h))}{const i=a("birds-temple"),h=T=>T[0]+(T[1]-T[0])*i(),c=Ro().temple,A=(c[1]-c[0])/2,p=(c[5]-c[4])/2,l=h(o.TEMPLE.K),d=h(o.TEMPLE.Y),R=Math.round(h(o.FLOCK_N)),m=h(o.PACE);t.push(r({x:c[0]+A,y:d,z:c[4]+p,rx:A*l,rz:p*l,turn:(i()<.5?-1:1)*m/(p*l),n:R,spread:o.TEMPLE.SPREAD,wall:!1,phase:i()*Math.PI*2},i))}return t}const Pa={STAND_SHARE:.36,STAND_MAX:3,STAND_X:[.95,1.75],STAND_Z:[.7,1.7],PASS_PER_BAY:3.4,PASS_Z:[.9,5],PASS_BAYS:3,SPEED:[.9,1.35],HEIGHT:[.93,1.06]};function ia(a){return a===0?s.BASE_H:s.LEVEL[a]+s.BAND_H[a]}function Xa(a,o=1){const e=Pa,t=vo(),r=[],i=[],h=[],c=(l,d,R)=>[l.ox+l.Xx*d+l.Nx*R,l.oz+l.Xz*d+l.Nz*R],A=l=>l[0]+(l[1]-l[0])*a();for(let l=1;l<=2;l++)for(const d of t){if(a()>=e.STAND_SHARE*o)continue;const R=1+Math.floor(a()*e.STAND_MAX),m=a()<.5?-1:1;for(let T=0;T<R;T++){const v=c(d,(T===1?-m:m)*A(e.STAND_X),-A(e.STAND_Z)-(T===2?.7:0)),L=(a()-.5)*.9;r.push(v[0],v[1],v[0]+d.Nx+d.Xx*L,v[1]+d.Nz+d.Xz*L),i.push(a(),0,A(e.HEIGHT),a()),h.push(ia(l),1,d.Nx,d.Nz)}}const p=Math.round(e.PASS_PER_BAY*s.BAYS*o);for(let l=0;l<p;l++){const d=Math.floor(a()*s.BAYS),R=a()<.5?-1:1,m=t[d],T=t[(d+R*e.PASS_BAYS+s.BAYS)%s.BAYS],v=-(s.PIER_D+A(e.PASS_Z)),L=c(m,0,v),y=c(T,0,v);r.push(L[0],L[1],y[0],y[1]),i.push(a(),A(e.SPEED),A(e.HEIGHT),a()),h.push(ia(0),0,m.Nx,m.Nz)}return{n:i.length/4,line:new Float32Array(r),who:new Float32Array(i),at:new Float32Array(h)}}const Ho={WAY:3.6,FROM:7,LEN:64,SIDE:20,STALL:{EVERY:4.6,W:3.3,D:2.5,FRONT:2.7,BACK:2.05,TABLE:.85,KNOT:[2,5],STAND:[.7,2.3],PHASE:.11},PINE:{OUT:12.5,EVERY:10.5,H:[16.5,19],R:[4.4,5.6],PHASE:.71}};function la(){const a=Ho,o=oo,e=Ro(),t=wo(),r=v=>v-Math.floor(v);let i=0;for(let v=t.outLength;v>0;v-=.25)if(t.out(v)[2]<=e.terrace[4]){i=v;break}const h=t.out(i),c=t.out(i-20),A=Math.hypot(c[0]-h[0],c[2]-h[2]),p=(c[0]-h[0])/A,l=(c[2]-h[2])/A,d=a.FROM+a.SIDE*Math.abs(p/l),R={x:h[0]+p*d+l*a.SIDE,z:h[2]+l*d-p*a.SIDE,dx:p,dz:l,len:a.LEN,half:a.WAY},m=[],T=[];for(const v of[1,-1]){const L=-l*v,y=p*v,E=Math.floor((a.LEN-a.STALL.W)/a.STALL.EVERY)+1;for(let b=0;b<E;b++){const ot=a.STALL.W/2+b*a.STALL.EVERY,g=a.WAY+a.STALL.D/2;m.push({x:R.x+p*ot+L*g,z:R.z+l*ot+y*g,fx:-L,fz:-y,k:m.length})}v<0&&T.push({ox:R.x+p*9+L*a.PINE.OUT,oz:R.z+l*9+y*a.PINE.OUT,ax:p,az:l,every:a.PINE.EVERY,n:Math.floor((a.LEN-11)/a.PINE.EVERY)+1,phase:a.PINE.PHASE})}for(const v of m)v.tone=r(v.k*.618034+a.STALL.PHASE);return{way:R,stalls:m,rows:T}}function Da(a,o){const e=Ho.PINE,t=r=>r-Math.floor(r);return{x:a.ox+a.ax*a.every*o,z:a.oz+a.az*a.every*o,h:e.H[0]+(e.H[1]-e.H[0])*t(o*.618034+a.phase),r:e.R[0]+(e.R[1]-e.R[0])*t(o*.414214+a.phase*2.3)}}const ko={N:3e3,STREET_SHARE:.12,LANE_SHARE:.22,WAY_SHARE:.06,STAND_SHARE:.035,MOUTHS:16,MOUTH_EAST:.8,SPEED:[1,1.45],SIDE:1.3,STREET_X:440,HEIGHT:[.93,1.06],INTO_ARCH:1.2,SLOW:[.45,.8],BAND_PACE:.7,SHARE:30,LITTERS:7,LITTER_SPEED:.8,LITTER:{HALF_W:.45,LEN:2.1,FLOOR:.9,TOP:1.95,ROOF:.17,POLE_X:.56,POLE_Y:1.42,POLE_LEN:4.3,BEARER_Z:1.75,STREET_SHARE:.55}};function Ia(a=[]){const o=ko,e=oo,t=vo(),r=s.RIM_A+e.PLAZA+2,i=s.RIM_B+e.PLAZA+2,h=la(),c=a.map(d=>({x:d.x0,z:d.z,w:d.w}));for(let d=0;d<o.MOUTHS;d++){const R=Math.acos(o.MOUTH_EAST)+(d+.5)/o.MOUTHS*(Math.PI*2-2*Math.acos(o.MOUTH_EAST));c.push({x:r*Math.cos(R),z:i*Math.sin(R),w:6})}for(let d=0;d<e.FORE.MOUTHS;d++)c.push({x:e.FORE.X1,z:e.FORE.MOUTH_Z[0]+(d+.5)/e.FORE.MOUTHS*(e.FORE.MOUTH_Z[1]-e.FORE.MOUTH_Z[0]),w:7});c.push({x:h.way.x+h.way.dx*h.way.len,z:h.way.z+h.way.dz*h.way.len,w:2*h.way.half});const A=d=>Math.hypot(d.x/(s.RIM_A+s.PAVE_W),d.z/(s.RIM_B+s.PAVE_W)),p=new Map;return{streams:c.slice().sort((d,R)=>A(d)-A(R)).map(d=>{let R=t[0],m=1e9;for(const E of t)if(E.i%2===0){const b=d.x-E.ox-E.Nx*s.PAVE_W,ot=d.z-E.oz-E.Nz*s.PAVE_W,g=Math.hypot(b,ot);if(b*E.Nx+ot*E.Nz<.35*g)continue;const M=g+o.SHARE*(p.get(E.i)||0);M<m&&(m=M,R=E)}p.set(R.i,(p.get(R.i)||0)+1);const T=R.ox+R.Nx*s.PAVE_W,v=R.oz+R.Nz*s.PAVE_W,L=R.ox-R.Nx*o.INTO_ARCH,y=R.oz-R.Nz*o.INTO_ARCH;return{mx:d.x,mz:d.z,gx:T,gz:v,ax:L,az:y,l1:Math.hypot(T-d.x,v-d.z),l2:Math.hypot(L-T,y-v),bay:R.i}}),market:h}}function ja(a,o=1,e=[]){const t=ko,r=oo,i=Math.round(t.N*o),h=Math.round(t.LITTERS*o),c=i+4*h,A=new Float32Array(c*4),p=new Float32Array(c*4),l=new Float32Array(c),d=new Float32Array(c),{streams:R,market:m}=Ia(e),T=m.way,v=Ho.STALL,L=e.reduce((g,M)=>g+(M.x1-M.x0),0),y=1/t.BAND_PACE,E=R.reduce((g,M)=>g+M.l1+M.l2*y,0);for(let g=0;g<i;g++){const M=[a(),a(),a(),a(),a(),a(),a()];let G,q,X,ht,tt=0,F=1;if(M[0]<t.STREET_SHARE){const at=(M[1]*2-1)*(r.STREET_HALF-.8);G=t.STREET_X,q=at,X=s.RIM_A-t.INTO_ARCH,ht=at*.3,tt=t.SLOW[0]*.6}else if(e.length&&M[0]<t.STREET_SHARE+t.LANE_SHARE){let at=M[1]*L,rt=e[0];for(const bt of e)if(rt=bt,at-=bt.x1-bt.x0,at<=0)break;const Lt=(M[2]*2-1)*Math.max(.2,rt.w/2-.9);G=rt.x1,q=rt.z+Lt,X=rt.x0,ht=rt.z+Lt}else if(M[0]<t.STREET_SHARE+t.LANE_SHARE+t.WAY_SHARE){const at=(M[2]*2-1)*(T.half-v.STAND[1]-.2);G=T.x-T.dz*at,q=T.z+T.dx*at,X=G+T.dx*T.len,ht=q+T.dz*T.len}else if(M[0]<t.STREET_SHARE+t.LANE_SHARE+t.WAY_SHARE+t.STAND_SHARE){const at=m.stalls[Math.floor(M[1]*m.stalls.length)%m.stalls.length],rt=(M[2]*2-1)*v.W*.5,Lt=v.D/2+v.STAND[0]+(v.STAND[1]-v.STAND[0])*M[3];G=at.x+at.fx*Lt-at.fz*rt,q=at.z+at.fz*Lt+at.fx*rt,X=G-at.fx,ht=q-at.fz,d[g]=1}else{let at=M[1]*E,rt=R[0];for(const bt of R)if(rt=bt,at-=bt.l1+bt.l2*y,at<=0)break;const Lt=(M[3]*2-1)*t.SIDE;if(M[2]*(rt.l1+rt.l2*y)<rt.l1){const bt=(rt.gx-rt.mx)/rt.l1,zt=(rt.gz-rt.mz)/rt.l1;G=rt.mx-zt*Lt,q=rt.mz+bt*Lt,X=rt.gx-zt*Lt*.6,ht=rt.gz+bt*Lt*.6,tt=t.SLOW[0]+(t.SLOW[1]-t.SLOW[0])*M[6]}else{const bt=(rt.ax-rt.gx)/rt.l2,zt=(rt.az-rt.gz)/rt.l2;G=rt.gx-zt*Lt*.6,q=rt.gz+bt*Lt*.6,X=rt.ax-zt*Lt*.6,ht=rt.az+bt*Lt*.6,F=t.BAND_PACE,tt=t.SLOW[0]*.5}}A.set([G,q,X,ht],g*4),p.set([M[4],(t.SPEED[0]+(t.SPEED[1]-t.SPEED[0])*M[5])*F,t.HEIGHT[0]+(t.HEIGHT[1]-t.HEIGHT[0])*M[6],M[3]*.37+M[6]*.63],g*4),l[g]=tt}const b={n:h,line:new Float32Array(h*4),who:new Float32Array(h*4),slow:new Float32Array(h)},ot=t.LITTER;for(let g=0;g<h;g++){const M=[a(),a(),a(),a(),a()];let G,q,X,ht,tt;if(M[0]<ot.STREET_SHARE){const bt=(M[1]*2-1)*(r.STREET_HALF-1.6);G=t.STREET_X,q=bt,X=s.RIM_A-t.INTO_ARCH,ht=bt*.3,tt=t.SLOW[0]*.6}else{const bt=R[Math.floor(M[1]*R.length)%R.length];G=bt.mx,q=bt.mz,X=bt.gx,ht=bt.gz,tt=t.SLOW[0]}const F=Math.hypot(X-G,ht-q)||1,at=(X-G)/F,rt=(ht-q)/F;b.line.set([G,q,X,ht],g*4),b.who.set([M[3],t.LITTER_SPEED,1,M[4]],g*4),b.slow[g]=tt;let Lt=i+g*4;for(const[bt,zt]of[[-ot.POLE_X,-ot.BEARER_Z],[ot.POLE_X,-ot.BEARER_Z],[-ot.POLE_X,ot.BEARER_Z],[ot.POLE_X,ot.BEARER_Z]]){const j=bt*rt+zt*at,Rt=-bt*at+zt*rt;A.set([G+j,q+Rt,X+j,ht+Rt],Lt*4),p.set([M[3],t.LITTER_SPEED,.97,.7+.08*a()],Lt*4),l[Lt]=tt,Lt++}}return{n:c,line:A,who:p,slow:l,stand:d,litters:b,streams:R,market:m}}const co={CLEAR:20.5,WALK:3e3,KNOT:[.3,.36,.22,.12],ABREAST:[.6,1],LAG:1.1,MOUTH:2.6,POST_KEEP:.85,ARCH_HALF:1.7,PRONG:[.2,.1],PRONG_REACH:1.35,SLOW:[.1,.4],BAND:.5,ARCH3:[.4,.3],FACE_KEEP:.6,PORCH_KEEP:1.25,GATHER:24,GATHER_KNOTS:[3,6],GATHER_R:[3.2,6.5],LONE:70,KNOT_N:[2,5],AXIS_CLEAR:3.8,STAND_OUT:5.5,STAND_N:[2,4],SET_DOWN:.75,ROWS:[{s:7.95,k0:2,k1:11,face:1},{s:19.35,k0:3,k1:6,face:-1},{s:19.35,k0:8,k1:11,face:-1}],LANE:{S:[13.4,15.9],T:[4,60],WALK:34,STAND:[.7,1.7],BUSY:.85},DUG:{W:13,D:12,GAP:7.8,FROM_NE:81.5,KEEP:.5},TERRACE:{PARAPET:30,PARAPET_BACK:[.45,1.9],ALTAR_CLEAR:6.5,TEMPLE:9,FRONT:16,FRONT_Z:[3.6,9.6],WALKS:5,STROLL:12,STROLL_PACE:[.55,.9],PATH:4,BED:[23,17],ROOM_EVERY:4.5,SHADE:11}},ga=[.4,.56,.68,.77,.85,.9,.95,1.01],$o=a=>{let o=0;for(;a>=ga[o];)o++;return o},Uo=(a,o)=>{let e=a();for(let t=0;t<12&&o.has($o(e));t++)e=a();return o.add($o(e)),e};function Co(a,o,e){const t=a.length;for(let r=0;r<t;r++)for(let i=r+1;i<t;i++){const h=Math.hypot(a[i].x-a[r].x,a[i].z-a[r].z);if(h<o)return!1;for(let c=i+1;c<t;c++){const A=Math.max(h,Math.hypot(a[c].x-a[r].x,a[c].z-a[r].z),Math.hypot(a[c].x-a[i].x,a[c].z-a[i].z));if(Math.abs((a[i].x-a[r].x)*(a[c].z-a[r].z)-(a[c].x-a[r].x)*(a[i].z-a[r].z))/A<e*A)return!1}}return!0}function Yo(a,o,e,t){const r=.3+.13*o;let i=[];for(let h=0;h<16;h++){const c=[];let A=0;for(let l=0;l<o;l++)c.push(.5+a()),A+=c[l];let p=a()*Math.PI*2;i=[];for(let l=0;l<o;l++){p+=c[l]/A*Math.PI*2;const d=r*(.7+.6*a());i.push({x:e+Math.cos(p)*d,z:t+Math.sin(p)*d})}if(Co(i,.55,.2))break}for(const h of i){const c=Math.atan2(t-h.z,e-h.x)+(a()-.5)*1.3+(a()<.15?(a()<.5?-1:1)*(1.3+a()):0);h.fx=Math.cos(c),h.fz=Math.sin(c)}return ha(i)}function ha(a){for(let o=0;o<a.length;o++)for(let e=o+1;e<a.length;e++){const t=a[o],r=a[e],i=Math.hypot(r.x-t.x,r.z-t.z)||1,h=(r.x-t.x)/i,c=(r.z-t.z)/i;if(t.fx*h+t.fz*c>.986&&-(r.fx*h+r.fz*c)>.986){const A=Math.cos(.5),p=Math.sin(.5),l=r.fx*A-r.fz*p,d=r.fx*p+r.fz*A;r.fx=l,r.fz=d}}return a}function Go(a,o){const e=co;let t=[{x:0,z:0}];if(o===1)return t;for(let i=0;i<16;i++){t=[];let h=0;for(let c=0;c<o;c++)t.push({x:h,z:(a()*2-1)*e.LAG*.4}),h+=e.ABREAST[0]+(e.ABREAST[1]-e.ABREAST[0])*a();if(Co(t,.5,.18)&&(o>2||Math.abs(t[0].z-t[1].z)>.14))break}const r=(t[0].x+t[o-1].x)/2;return t.map(i=>({x:i.x-r,z:i.z/.4}))}function Jo(){const a=[],o=[],e=[],t=[],r=[],i=[];return{get n(){return e.length},stander(h,c,A,p,l,d,R,m=0,T=-1){a.push(h,c,h+A,c+p),o.push(R,0,l,d),e.push(0),t.push(1),r.push(m),i.push(T)},walker(h,c,A,p,l,d,R,m,T,v=0,L=-1){a.push(h,c,A,p),o.push(l-Math.floor(l),d,R,m),e.push(T),t.push(0),r.push(v),i.push(L)},unmirror(){const h=[];for(let c=0;c<t.length;c++)t[c]&&h.push(c);for(let c=0;c<4;c++){let A=0;const p=Math.cos(.5),l=Math.sin(.5)*(c%2?-1:1);for(let d=0;d<h.length;d++)for(let R=d+1;R<h.length;R++){const m=h[d]*4,T=h[R]*4,v=a[T]-a[m];if(v>2.2||v<-2.2)continue;const L=a[T+1]-a[m+1];if(L>2.2||L<-2.2||r[h[d]]!==r[h[R]])continue;const y=Math.sqrt(v*v+L*L)||1,E=v/y,b=L/y,ot=a[m+2]-a[m],g=a[m+3]-a[m+1],M=a[T+2]-a[T],G=a[T+3]-a[T+1];y<2.2&&ot*E+g*b>.986&&-(M*E+G*b)>.986&&(a[T+2]=a[T]+M*p-G*l,a[T+3]=a[T+1]+M*l+G*p,A++)}if(!A)break}},pack(){return this.unmirror(),{n:e.length,line:new Float32Array(a),who:new Float32Array(o),slow:new Float32Array(e),stand:new Float32Array(t),y:new Float32Array(r),sun:new Float32Array(i)}}}}function Ha(){const a=Ho,o=la(),e=o.way,t=e.dz,r=-e.dx,i=c=>c-Math.floor(c),h=[];for(const c of co.ROWS)for(let A=c.k0;A<=c.k1;A++){const p=a.STALL.W/2+A*a.STALL.EVERY,l=o.stalls.length+h.length;h.push({x:e.x+e.dx*p+t*c.s,z:e.z+e.dz*p+r*c.s,fx:t*c.face,fz:r*c.face,k:l,tone:i(l*.618034+a.STALL.PHASE)})}return{way:e,stalls:h,rows:co.ROWS,px:t,pz:r}}async function Qa(a,o,e=1,t=[],r=async()=>{},i=r){const h=co,c=ko,A=oo,p=Ho,l=p.STALL,d=Ha(),R=d.way,m=Ro().terrace,T=m[1]-co.DUG.FROM_NE,v=[T-co.DUG.W/2,T+co.DUG.W/2,m[4]-co.DUG.GAP-co.DUG.D,m[4]-co.DUG.GAP],L=Jo(),y=P=>P[0]+(P[1]-P[0])*o(),E=P=>P[0]+Math.floor(o()*(P[1]-P[0]+1)),b=P=>P-Math.floor(P),ot=s.RIM_A,g=s.RIM_B,M=s.PAVE_W,G=s.BAYS,q=(P,K)=>Math.sqrt(P*P+K*K),X=zo(ot,g,G,-.5).map(P=>[P.x+P.nx*M,P.z+P.nz*M]),ht=vo(),tt=P=>{P=(P%G+G)%G;const K=X[P],C=X[(P+1)%G],It=q(C[0]-K[0],C[1]-K[1]),wt=ht[P];return{i:P,x:(K[0]+C[0])/2,z:(K[1]+C[1])/2,ux:(C[0]-K[0])/It,uz:(C[1]-K[1])/It,half:It/2-h.POST_KEEP,nx:wt.Nx,nz:wt.Nz,ax:wt.ox-wt.Nx*c.INTO_ARCH,az:wt.oz-wt.Nz*c.INTO_ARCH}},F=[],at=(P,K,C,It,wt,Vt)=>{const Xt=wt-C,Kt=Vt-It,Ot=Xt*Xt+Kt*Kt,se=Ot>0?Math.min(1,Math.max(0,((P-C)*Xt+(K-It)*Kt)/Ot)):0;return q(P-C-Xt*se,K-It-Kt*se)},rt=(P,K,C)=>P>v[0]-C&&P<v[1]+C&&K>v[2]-C&&K<v[3]+C,Lt=(P,K,C,It,wt)=>{let Vt=0,Xt=1;const Kt=C-P,Ot=It-K;if(Math.max(P,C)<v[0]-wt||Math.min(P,C)>v[1]+wt||Math.max(K,It)<v[2]-wt||Math.min(K,It)>v[3]+wt)return!1;for(const[se,Ae]of[[-Kt,P-v[0]+wt],[Kt,v[1]+wt-P],[-Ot,K-v[2]+wt],[Ot,v[3]+wt-K]])if(se===0){if(Ae<0)return!1}else{const xe=Ae/se;if(se<0){if(xe>Xt)return!1;xe>Vt&&(Vt=xe)}else{if(xe<Vt)return!1;xe<Xt&&(Xt=xe)}}return!0};for(const P of[...a.market.stalls,...d.stalls])F.push({x:P.x,z:P.z,r:2.3});for(const P of a.market.rows)for(let K=0;K<P.n;K++){const C=Da(P,K);F.push({x:C.x,z:C.z,r:.9})}const bt=(P,K,C=0,It=-1)=>L.stander(P.x,P.z,P.fx,P.fz,y(c.HEIGHT),Uo(o,K),o(),C,It),zt=(P,K,C)=>{const It=new Set;for(const wt of Yo(o,C,P,K))bt(wt,It);F.push({x:P,z:K,r:.3+.13*C+.9})},j={line:[],who:[],slow:[],y:[]};for(const P of ht)if(P.axis)for(const K of[1,-1]){const C=tt(P.i+K),It=C.x+C.nx*h.STAND_OUT,wt=C.z+C.nz*h.STAND_OUT,Vt=h.STAND_N[0]+Math.floor(b(C.i*.618034+.37)*(h.STAND_N[1]-h.STAND_N[0]+1));let Xt=0;const Kt=[];for(let Ot=0;Ot<Vt;Ot++)Kt.push(Xt),Xt+=1.7+.9*b(Ot*.7548+C.i*.31);for(let Ot=0;Ot<Vt;Ot++){const se=Kt[Ot]-Kt[Vt-1]/2,Ae=(b(Ot*.5698+C.i*.17)-.5)*2.4,xe=(b(Ot*.445+C.i*.23)-.5)*.9,Ye=Math.cos(xe),Pe=Math.sin(xe),ze=It+C.ux*se+C.nx*Ae,ao=wt+C.uz*se+C.nz*Ae,so=-(C.nx*Ye-C.nz*Pe),Je=-(C.nz*Ye+C.nx*Pe);j.line.push(ze,ao,ze+so,ao+Je),j.who.push(0,0,1,b(Ot*.618034+C.i*.137)),j.slow.push(0),j.y.push(-h.SET_DOWN),F.push({x:ze,z:ao,r:2.4})}for(let Ot=4*Vt,se=0;Ot>0;se++){let Ae=Math.min(Ot,E(h.KNOT_N));Ot-Ae===1&&(Ae=Ot<=5?Ot:Ae-1);const xe=(o()*2-1)*(Kt[Vt-1]/2+1.5),Ye=4.3+1.9*(se%2)+o()*1.2;zt(It+C.ux*xe+C.nx*Ye,wt+C.uz*xe+C.nz*Ye,Ae),Ot-=Ae}}for(const P of d.stalls){if(o()>=h.LANE.BUSY*Math.min(1.15,e))continue;const K=E(l.KNOT),C=new Set;let It=[];for(let wt=0;wt<16;wt++){It=[];for(let Vt=0;Vt<K;Vt++){const Xt=(o()*2-1)*l.W*.5,Kt=l.D/2+y(h.LANE.STAND);It.push({x:P.x+P.fx*Kt-P.fz*Xt,z:P.z+P.fz*Kt+P.fx*Xt})}if(Co(It,.55,.2))break}for(const wt of It){const Vt=Math.atan2(-P.fz,-P.fx)+(o()-.5)*1.1;wt.fx=Math.cos(Vt),wt.fz=Math.sin(Vt),bt(wt,C)}}const Rt=(P,K,C,It,wt,Vt,Xt,Kt)=>{const Ot=Math.max(q(C-P,It-K),1),se=(C-P)/Ot,Ae=(It-K)/Ot,xe=o();let Ye=new Set;for(const Pe of Vt){const ze=Uo(o,Ye);Ye=new Set([$o(ze)]),L.walker(P-Ae*Pe.x,K+se*Pe.x,C-Ae*Pe.x,It+se*Pe.x,xe-Pe.z/Ot+1,Xt,y(c.HEIGHT),ze,Kt)}},Gt=()=>{const P=o();let K=0,C=h.KNOT[0];for(;K<h.KNOT.length-1&&P>=C;)K++,C+=h.KNOT[K];return K+1};for(let P=Math.round(h.LANE.WALK*e);P>0;){const K=Math.min(P,Gt(),3),C=Go(o,K),It=Math.abs(C[0].x)+.3,wt=h.LANE.S[0]+It+o()*Math.max(0,h.LANE.S[1]-h.LANE.S[0]-2*It),Vt=o()<.5,Xt=Vt?h.LANE.T[1]:h.LANE.T[0],Kt=Vt?h.LANE.T[0]:h.LANE.T[1];Rt(R.x+R.dx*Xt+d.px*wt,R.z+R.dz*Xt+d.pz*wt,R.x+R.dx*Kt+d.px*wt,R.z+R.dz*Kt+d.pz*wt,K,C,y(c.SPEED)*c.BAND_PACE,0),P-=K}const gt=1/c.BAND_PACE,et=a.streams.map(P=>{const K=t.find(Xt=>Math.abs(Xt.x0-P.mx)<.01&&Math.abs(Xt.z-P.mz)<.01),C=K?Math.max(.4,K.w/2-.9):h.MOUTH,It=(P.gx-P.mx)/P.l1,wt=(P.gz-P.mz)/P.l1,Vt=[{g:tt(P.bay),share:1}];for(const Xt of[-2,2,-4,4]){const Kt=tt(P.bay+Xt),Ot=P.mx-Kt.x,se=P.mz-Kt.z,Ae=q(Ot,se),xe=h.PRONG[Math.abs(Xt)/2-1];Ot*Kt.nx+se*Kt.nz>=.35*Ae&&Ae<=h.PRONG_REACH*P.l1&&(Vt.push({g:Kt,share:xe}),Vt[0].share-=xe)}return{s:P,half:C,px:-wt,pz:It,prongs:Vt,near:null}}),Zt=P=>{let K=o(),C=0;for(;C<P.prongs.length-1&&K>=P.prongs[C].share;)K-=P.prongs[C].share,C++;return P.prongs[C].g};await i();const he=[],oe=(P,K,C,It)=>{const wt=(Ot,se)=>P*P/(Ot*Ot)+K*K/(se*se);if(wt(ot+M+3+C,g+M+3+C)<1)return!1;const Vt=P>A.FORE.X0+4+C&&P<A.FORE.X1-4-C&&K>A.FORE.Z0+4+C&&K<A.S_FOOT-6-C;if(!(wt(ot+A.PLAZA-3-C,g+A.PLAZA-3-C)<1)&&!Vt||P>0&&Math.abs(K)<A.STREET_HALF+2.5+C)return!1;const Xt=(P-R.x)*R.dx+(K-R.z)*R.dz,Kt=(P-R.x)*d.px+(K-R.z)*d.pz;if(Xt>-8-C&&Xt<R.len+8+C&&Kt>-(p.WAY+l.D+3)-C&&Kt<24+C||rt(P,K,3+C))return!1;for(const Ot of he)if(Math.abs(P-Ot.x)<C+Ot.r+5&&q(P-Ot.x,K-Ot.z)<C+Ot.r+5)return!1;for(const Ot of F)if(Math.abs(P-Ot.x)<C+Ot.r+1.5&&q(P-Ot.x,K-Ot.z)<C+Ot.r+1.5)return!1;for(const Ot of et)for(let se=0;se<Ot.prongs.length;se++){const Ae=Ot.prongs[se];if(at(P,K,Ot.s.mx,Ot.s.mz,Ae.g.x,Ae.g.z)<C+(se?It*.6:It+Ot.half))return!1}return!0},Ee=(P,K)=>{for(let C=0;C<70;C++){const It=-160+355*o(),wt=-140+280*o();if(oe(It,wt,P,K))return[It,wt]}return null};for(let P=Math.round(h.GATHER*e);P>0;P--){const K=y(h.GATHER_R),C=Ee(K,h.AXIS_CLEAR);if(!C)continue;const It=[];for(let wt=E(h.GATHER_KNOTS);wt>0;wt--)for(let Vt=0;Vt<20;Vt++){const Xt=o()*Math.PI*2,Kt=Math.sqrt(o())*K,Ot=C[0]+Math.cos(Xt)*Kt,se=C[1]+Math.sin(Xt)*Kt;if(It.every(Ae=>q(Ae[0]-Ot,Ae[1]-se)>=2.6)){It.push([Ot,se]);break}}he.push({x:C[0],z:C[1],r:K});for(const wt of It)zt(wt[0],wt[1],E(h.KNOT_N))}await r();for(let P=Math.round(h.LONE*e);P>0;P--){const K=Ee(1.3,h.AXIS_CLEAR*.7);K&&(he.push({x:K[0],z:K[1],r:1.3}),zt(K[0],K[1],Math.min(4,E(h.KNOT_N))))}await r();for(const P of et)P.near=F.filter(K=>P.prongs.some(C=>at(K.x,K.z,P.s.mx,P.s.mz,C.g.x,C.g.z)<K.r+P.half+C.g.half+2.5));const I=(P,K,C,It,wt,Vt)=>{for(const Xt of P.near)if(at(Xt.x,Xt.z,K,C,It,wt)<Xt.r+Vt)return!1;return!Lt(K,C,It,wt,h.DUG.KEEP+Vt)},ie=(P,K,C)=>{const It=P.s,wt=Zt(P);if(K){const Ae=(o()*2-1)*Math.max(0,P.half-C),xe=(o()*2-1)*Math.max(0,wt.half-C);return[It.mx+P.px*Ae,It.mz+P.pz*Ae,wt.x+wt.ux*xe,wt.z+wt.uz*xe]}const Vt=(o()*2-1)*Math.max(0,wt.half-C),Xt=(o()*2-1)*Math.max(0,h.ARCH_HALF-C),Kt=o(),Ot=Kt<h.ARCH3[0]?0:Kt<h.ARCH3[0]+h.ARCH3[1]?-1:1,se=(o()*2-1)*Math.max(0,h.ARCH_HALF-h.FACE_KEEP-C);if(Ot){const Ae=tt(wt.i+Ot),xe=wt.x+wt.ux*Vt,Ye=wt.z+wt.uz*Vt,Pe=Ae.ax+Ae.nx*c.INTO_ARCH+Ae.ux*se,ze=Ae.az+Ae.nz*c.INTO_ARCH+Ae.uz*se,ao=q(Pe-xe,ze-Ye),so=(Pe-xe)/ao,Je=(ze-Ye)/ao,io=c.INTO_ARCH/Math.max(-(so*Ae.nx+Je*Ae.nz),.5),O=Pe+so*io,W=ze+Je*io;for(const Y of Mt)if(at(Y[0],Y[1],xe,Ye,O,W)<h.PORCH_KEEP+C)return null;return[xe,Ye,O,W]}return[wt.x+wt.ux*Vt,wt.z+wt.uz*Vt,wt.ax+wt.ux*Xt,wt.az+wt.uz*Xt]},Mt=[];for(const P of ht)if(P.axis)for(const K of[-1,1])Mt.push([P.ox+P.Xx*K*je.COL_X+P.Nx*je.COL_Z,P.oz+P.Xz*K*je.COL_X+P.Nz*je.COL_Z]);const pe=a.n-4*a.litters.n,Le=new Float32Array(a.line),Ue=new Float32Array(a.slow),pt=c.SIDE+.02;for(let P=0;P<pe;P++){if(a.stand[P]>.5)continue;const K=Le[P*4],C=Le[P*4+1],It=Le[P*4+2],wt=Le[P*4+3];let Vt=null,Xt=!0;for(const Kt of et){if(q(K-Kt.s.mx,C-Kt.s.mz)<pt&&q(It-Kt.s.gx,wt-Kt.s.gz)<pt*.6+.02){Vt=Kt,Xt=!0;break}if(q(K-Kt.s.gx,C-Kt.s.gz)<pt*.6+.02&&q(It-Kt.s.ax,wt-Kt.s.az)<pt*.6+.02){Vt=Kt,Xt=!1;break}}if(Vt){for(let Kt=0;Kt<8;Kt++){const Ot=ie(Vt,Xt,.3);if(Ot&&I(Vt,Ot[0],Ot[1],Ot[2],Ot[3],.3)){Le.set(Ot,P*4),Xt&&(Ue[P]=y(h.SLOW));break}}P%600===599&&await r()}}await r();const Ke=et.reduce((P,K)=>P+K.s.l1+K.s.l2*gt,0);for(let P=Math.round(h.WALK*e),K=0;P>0&&K<4e4;K++){let C=o()*Ke,It=et[0];for(const Ot of et)if(It=Ot,C-=Ot.s.l1+Ot.s.l2*gt,C<=0)break;const wt=o()*(It.s.l1+It.s.l2*gt*h.BAND)<It.s.l1,Vt=Math.min(P,Gt()),Xt=Go(o,Vt),Kt=Math.abs(Xt[0].x)+.3;for(let Ot=0;Ot<6;Ot++){const se=ie(It,wt,Kt);if(!(!se||!I(It,se[0],se[1],se[2],se[3],Kt))){Rt(se[0],se[1],se[2],se[3],Vt,Xt,y(c.SPEED)*(wt?1:c.BAND_PACE),wt?y(h.SLOW):c.SLOW[0]*.5),P-=Vt;break}}K%400===399&&await r()}return{line:Le,slow:Ue,more:L.pack(),litters:{n:j.slow.length,line:new Float32Array(j.line),who:new Float32Array(j.who),slow:new Float32Array(j.slow),y:new Float32Array(j.y)}}}const Ve={WALL:4.6,FRONT:9.5,COL:.98,BASE:1.994,KEEP:.45};async function Ja(a,o=1,e=async()=>{}){const t=co,r=t.TERRACE,i=ko,h=oo,c=h.TERRACE,A=Ro(),p=A.terrace,l=A.temple,d=wo(),R=p[3],m=c.PORTICO_D,T=Jo(),v=Jo(),L=j=>j[0]+(j[1]-j[0])*a(),y=j=>j[0]+Math.floor(a()*(j[1]-j[0]+1)),E=[];for(let j=d.outLength;j>0;j-=.5){const Rt=d.out(j);if(Rt[2]<p[4]-30)break;E.push(Rt[0],Rt[1],Rt[2])}const b=(j,Rt,Gt)=>{const gt=(t.CLEAR+.6)*(t.CLEAR+.6);for(let et=0;et<E.length;et+=3){const Zt=E[et]-j,he=E[et+1]-Math.min(Math.max(E[et+1],Rt),Rt+2),oe=E[et+2]-Gt;if(Zt*Zt+he*he+oe*oe<gt)return!1}return!0},ot=()=>{const j=a();let Rt=0,Gt=t.KNOT[0];for(;Rt<t.KNOT.length-1&&j>=Gt;)Rt++,Gt+=t.KNOT[Rt];return Rt+1},g=(j,Rt,Gt,gt,et)=>j.stander(Rt.x,Rt.z,Rt.fx,Rt.fz,L(i.HEIGHT),Uo(a,Gt),a(),gt,et),M=(j,Rt,Gt,gt,et,Zt,he,oe,Ee)=>{const I=Math.max(Math.hypot(gt-Rt,et-Gt),1),ie=(gt-Rt)/I,Mt=(et-Gt)/I,pe=a();let Le=new Set;for(const Ue of he){const pt=Uo(a,Le);Le=new Set([$o(pt)]),j.walker(Rt-Mt*Ue.x,Gt+ie*Ue.x,gt-Mt*Ue.x,et+ie*Ue.x,pe-Ue.z/I+1,oe,L(i.HEIGHT),pt,0,R,Ee)}},G=(j,Rt,Gt,gt,et,Zt,he,oe,Ee,I)=>{let ie=[];for(let Mt=0;Mt<16;Mt++){ie=[];let pe=0;for(let Le=0;Le<j;Le++){const Ue=L(oe);ie.push({x:Rt+gt*pe+Zt*Ue,z:Gt+et*pe+he*Ue}),pe+=.6+.5*a()}if(Co(ie,.55,.2))break}for(const Mt of ie){const pe=Math.atan2(I,Ee)+(a()-.5)*1.1+(a()<.2?(a()<.5?-1:1)*(1+a()):0);Mt.fx=Math.cos(pe),Mt.fz=Math.sin(pe)}return ha(ie)},q=p[0]+m+2,X=p[1]-m-r.SHADE,ht=p[4]+.5,tt=[],F=(j,Rt,Gt)=>tt.every(gt=>Math.hypot(gt[0]-j,gt[1]-Rt)>=Gt)&&(tt.push([j,Rt]),!0);for(let j=Math.round(r.PARAPET*o),Rt=0;j>0&&Rt<400;Rt++){const Gt=y(t.KNOT_N),gt=q+a()*(X-q-4),et=G(Gt,gt,ht,1,0,0,1,r.PARAPET_BACK,0,-1);if(et.some(he=>Math.abs(he.x-c.CX)<r.ALTAR_CLEAR||!b(he.x,R,he.z))||!F(gt,ht,5))continue;const Zt=new Set;for(const he of et)g(T,he,Zt,R,-1);j--}await e();const at=l[4]-8,rt=R+c.PODIUM,Lt=Ve.BASE-Ve.COL,bt=[];for(let j=0;j<6;j++)bt.push([l[0]+Ve.COL+j*(l[1]-l[0]-2*Ve.COL)/5,l[4]+Ve.COL,0]);for(let j=1;j<10;j++)for(const Rt of[1,-1])bt.push([Rt>0?l[0]+Ve.COL:l[1]-Ve.COL,l[4]+Ve.COL+j*(l[5]-l[4]-2*Ve.COL)/10,Rt]);const zt=j=>{for(const Rt of bt)Math.abs(j.x-Rt[0])-Lt<Ve.KEEP&&Math.abs(j.z-Rt[1])-Lt<Ve.KEEP&&(Rt[2]?j.x=Rt[0]+Rt[2]*(Lt+Ve.KEEP):j.z=Rt[1]+Lt+Ve.KEEP);return j};for(let j=Math.round(r.TEMPLE*o),Rt=0;j>0&&Rt<400;Rt++){const Gt=y(t.KNOT_N),gt=a()<.55?0:2,et=l[0]+1.5+a()*(l[1]-l[0]-6);let Zt,he=()=>R,oe=-1,Ee=T;if(gt===0)Zt=G(Gt,et,at-.5,1,0,0,-1,[0,1.3],0,1);else{const Mt=l[4]+3+a()*5;Zt=Yo(a,Gt,et+1.2,Mt),he=()=>rt,oe=.55,Ee=v}const I=gt===2?3:r.ALTAR_CLEAR;if(Zt.some(Mt=>Math.abs(Mt.x-c.CX)<I||Mt.x<l[0]+.6||Mt.x>l[1]-.6||gt===2&&(Mt.z<l[4]+2||Mt.z>l[4]+8.8)||!b(Mt.x,he(Mt),Mt.z))||!F(et,gt*40+Zt[0].z,3.2))continue;const ie=new Set;for(const Mt of Zt)g(Ee,gt===2?zt(Mt):Mt,ie,he(Mt),oe);j--}await e();{const j=[p[4]+r.FRONT_Z[0],p[4]+r.FRONT_Z[1]],Rt=[[p[0]+m+.5,l[0]-1.5]];let Gt=X;for(let et=X;et>c.CX&&!(!b(et,R,j[0])||!b(et,R,j[1]));et-=.5)Gt=et;X-Gt>8&&Rt.push([Gt+.8,X]);const gt=Rt.reduce((et,Zt)=>et+Zt[1]-Zt[0],0);for(let et=Math.round(r.FRONT*o);et>0;){const Zt=Math.min(et,ot(),3),he=Go(a,Zt),oe=Math.abs(he[0].x)+.3,Ee=j[0]+oe+a()*(j[1]-j[0]-2*oe),I=a()<.5;let ie=a()*gt,Mt=Rt[0];for(const pe of Rt)if(Mt=pe,ie-=pe[1]-pe[0],ie<=0)break;M(T,I?Mt[1]:Mt[0],Ee,I?Mt[0]:Mt[1],Ee,Zt,he,L(r.STROLL_PACE),-1),et-=Zt}}for(const[j,Rt]of[["e",0],["w",-1],["b",0]]){await e();const Gt=Rt<0?T:v,gt=j==="b"?.6:1,et=(oe,Ee)=>j==="e"?[p[1]-1.4-Ee,p[4]+3+oe]:j==="w"?[p[0]+1.4+Ee,p[4]+3+oe]:[p[0]+m+1+oe,p[5]-1.4-Ee],Zt=j==="b"?p[1]-p[0]-2*m-2:p[5]-p[4]-m-4,he=j==="b"?2.2:m-2.6;for(let oe=Math.round(r.WALKS*gt*o),Ee=0;oe>0&&Ee<200;Ee++){const I=y(t.KNOT_N),ie=et(1.5+a()*(Zt-3),.9+a()*(he-1.8)),Mt=Yo(a,I,ie[0],ie[1]);if(!F(ie[0],ie[1],4))continue;const pe=new Set;for(const Le of Mt)g(Gt,Le,pe,R,Rt);oe--}for(let oe=Math.round(r.STROLL*gt*o);oe>0;){const Ee=Math.min(oe,ot(),3),I=Go(a,Ee),ie=Math.abs(I[0].x)+.3,Mt=ie+a()*Math.max(0,he-2*ie),pe=a()<.5,Le=et(pe?Zt:0,Mt),Ue=et(pe?0:Zt,Mt);M(Gt,Le[0],Le[1],Ue[0],Ue[1],Ee,I,L(r.STROLL_PACE),Rt),oe-=Ee}}{const j=[p[0]+m+4.5,p[1]-m-.5],Rt=[p[4]+m+4.5,p[5]-m-4.5],Gt=et=>p[1]-m-.5-et,gt=(et,Zt,he)=>{const oe=Math.min(4,y(t.KNOT_N));let Ee=[];for(let Mt=0;Mt<8;Mt++){Ee=Yo(a,oe,et,Zt);for(const pe of Ee)he?pe.z=Zt+(pe.z-Zt)*.55:pe.x=et+(pe.x-et)*.55;if(Co(Ee,.5,.15))break}const I=Gt(et)<r.SHADE-4;if(Gt(et)<r.SHADE&&!I||et>l[0]-6.5&&et<l[1]+6.5&&Zt>l[4]-6.5&&Zt<l[5]+6.5||Ee.some(Mt=>!b(Mt.x,R,Mt.z))||!F(et,Zt,3.5))return;const ie=new Set;for(const Mt of Ee)g(I?v:T,Mt,ie,R,I?0:-1)};await e();for(let et=p[5]-r.BED[1];et>Rt[0];et-=r.BED[1])if(et<Rt[1])for(let Zt=Math.round((j[1]-j[0])*r.PATH/100*o);Zt>0;Zt--)gt(j[0]+a()*(j[1]-j[0]),et,!0);await e();for(let et=p[0]+r.BED[0];et<j[1];et+=r.BED[0])if(et>j[0])for(let Zt=Math.round((Rt[1]-Rt[0])*r.PATH/100*o);Zt>0;Zt--)gt(et,Rt[0]+a()*(Rt[1]-Rt[0]),!1)}await e();for(const[j,Rt]of[["e",-1],["w",0],["b",0]]){const Gt=Ve.WALL,gt=Gt-Ve.KEEP,et=Ve.BASE+Ve.KEEP,Zt=j==="b"?l[1]-l[0]-2*Gt-1:l[5]-l[4]-9.5-2.5,he=Rt<0?T:v;for(let oe=Math.round(Zt/r.ROOM_EVERY*o),Ee=0;oe>0&&Ee<120;Ee++){const I=Math.min(4,y(t.KNOT_N)),ie=1+a()*(Zt-2-.55*I),Mt=j==="e"?G(I,l[1]-gt,l[4]+10+ie,0,1,1,0,[0,gt-et],1,0):j==="w"?G(I,l[0]+gt,l[4]+10+ie,0,1,-1,0,[0,gt-et],-1,0):G(I,l[0]+Gt+.5+ie,l[5]-gt,1,0,0,1,[0,gt-et],0,1);if(Mt.some(Le=>!b(Le.x,rt,Le.z))||!F(Mt[0].x,Mt[0].z+500,3.4))continue;const pe=new Set;for(const Le of Mt)g(he,Le,pe,rt,Rt);oe--}}return{open:T.pack(),roofed:v.pack()}}const ts=(()=>{const o=Math.PI*2,e=Ce.NT,t=s.RING_DEPTH_B/s.RING_DEPTH,r={PITCH:.4,PITCH_ALT:.45,CHAIR_PITCH:.5,CHAIR_H:.45,CHAIR_IN:.74,ROW_IN:.3,GAL_IN:.27,STAND_FILES:5,MOUTH_W:2.5,MOUTH_ROWS:3,MOUTH_ROW:[9,3],MOUTH_BAY:[0,1],MOUTH_DROP:1,MOUTH_STEPS:4,MOUTH_LINTEL:.3,MOUTH_JAMB:.22,STAIR_W:.8,EDGE:.05,BOX_ROWS:3,BOX_PITCH:.6,BOX_FIRST:.8,BOX_ROW_D:1.2,BOX_SIDE:.45,OFF:20.5,NEAR:44,KNIGHT_ROWS:14,DARK_FROM:10,GUEST_BAYS:[4.5,10],FULL:[.88,1.5,1]},i={BODY_C:[[.34,0],[.64,.34]],BODY_R:[[.2,.28,.13],[.2,.31,.13]],HEAD_C:[[.72,.02],[1.06,.34]],HEAD_R:.105,LAP_C:[[.12,.22],[.2,.36]],LAP_R:[[.19,.1,.26],[.17,.25,.12]],SHIN_C:[[-.16,.44],[-.24,.36]],SHIN_R:[[.17,.22,.1],[.15,.24,.1]],STAND_BASE:[.47,-.36],HAND_UP:.11,HAND_R_UP:.2,CLOTH_UP:.27,CLOTH_R:[.15,.1],CLOTH_SWING:.16,PARASOL_UP:.5,PARASOL_R:[.4,.1],HAT_UP:.085,HAT_R:[.2,.035],RIBBON_TOP:1.75},h={SIT:i.HEAD_C[0][0]+i.HEAD_R,PARASOL:i.HEAD_C[0][0]+i.PARASOL_UP+i.PARASOL_R[1],STAND:i.HEAD_C[1][0]+i.HEAD_R,ARM:i.HEAD_C[1][0]+i.HAND_UP+i.HAND_R_UP,CLOTH:i.HEAD_C[1][0]+i.HAND_UP+i.CLOTH_UP+i.CLOTH_R[1],OWN_FLOOR:i.STAND_BASE[0],FORWARD:i.HEAD_C[1][1]+.13,SIDE:.25+i.CLOTH_SWING+i.CLOTH_R[0]+.055},c=new Float64Array(e+1),A=new Float64Array(e+1);for(let O=0;O<=e;O++)c[O]=Math.cos(o*O/e),A[O]=Math.sin(o*O/e);c[e]=c[0],A[e]=A[0];function p(O,W,Y=[0,0]){const z=Math.min(e-1,Math.max(0,Math.floor(W))),dt=W-z,N=_o(O),_=To(O);return Y[0]=N*(c[z]+(c[z+1]-c[z])*dt),Y[1]=_*(A[z]+(A[z+1]-A[z])*dt),Y}const l={PODIUM:0,FIRST:1,SECOND:2,GALLERY:3,STANDING:4,BOX:5},d=["podium","first zone","second zone","gallery","standing room","boxes"];function R(O){const W=_o(O.d),Y=To(O.d),z=new Float64Array(e+1);for(let ft=0;ft<e;ft++)z[ft+1]=z[ft]+Math.hypot(W*(c[ft+1]-c[ft]),Y*(A[ft+1]-A[ft]));const dt=z[e],N=ft=>{const Pt=Math.min(e-1,Math.max(0,Math.floor(ft)));return z[Pt]+(z[Pt+1]-z[Pt])*(ft-Pt)},_=ft=>{let Pt=0,te=e-1;for(;Pt<te;){const ce=Pt+te+1>>1;z[ce]<=ft?Pt=ce:te=ce-1}return Pt+(ft-z[Pt])/(z[Pt+1]-z[Pt])},Ft=ft=>{const Pt=[];for(const[ce,_e]of ft){const Oe=(ce%dt+dt)%dt,ne=Oe+(_e-ce);ne<=dt?Pt.push([Oe,ne]):(Pt.push([Oe,dt]),Pt.push([0,ne-dt]))}Pt.sort((ce,_e)=>ce[0]-_e[0]);const te=[];for(const ce of Pt)te.length&&ce[0]<=te[te.length-1][1]+1e-9?te[te.length-1][1]=Math.max(te[te.length-1][1],ce[1]):te.push([ce[0],ce[1]]);return te},Tt=[],qt=[];for(const ft of O.gaps||[])if(ft.fa!==void 0){const Pt=N((ft.fa%e+e)%e)+(ft.fa<0?-dt:0),te=N(ft.fb);Tt.push([Pt-ft.edge,te+ft.edge]),ft.hole&&qt.push([Pt,te])}else{const Pt=N(ft.f);Tt.push([Pt-ft.half,Pt+ft.half])}const Ut=Ft(Tt),it=Ft(qt),_t=[];let Bt=0,Nt=0;const Ht=(ft,Pt)=>{const te=Math.round((Pt-ft)/O.pitch);te>=1&&(_t.push({s0:ft,s1:Pt,n:te,k0:Nt,pitch:(Pt-ft)/te}),Nt+=te)};for(const[ft,Pt]of Ut)ft>Bt+1e-9&&Ht(Bt,ft),Bt=Math.max(Bt,Pt);return Bt<dt-1e-9&&Ht(Bt,dt),{...O,oval:!0,a:W,b:Y,cum:z,per:dt,sAt:N,fAt:_,blocks:Ut,holes:it,runs:_t,n:Nt}}function m(O,W){const Y=To(O);for(let z=0;z<e/4;z++){const dt=Y*A[z],N=Y*A[z+1];if(N>=W)return z+(W-dt)/(N-dt)}return e/4}function T(O,W){const Y=_o(O);for(let z=0;z<e/4;z++){const dt=Y*A[z],N=Y*A[z+1];if(N>=W)return z+(W-dt)/(N-dt)}return e/4}function v(O){const W=O===0?De.rows1:De.rows2,Y=r.MOUTH_ROW[O],z=W[Y+1],dt=(z.d0+z.d1)/2,N=[],_=_o(dt),Ft=To(dt);for(let Tt=r.MOUTH_BAY[O];Tt<s.BAYS;Tt+=2){const qt=(Tt+.5)*e/s.BAYS,Ut=Math.floor(qt),it=Math.hypot(_*(c[Ut+1]-c[Ut]),Ft*(A[Ut+1]-A[Ut]));N.push({zone:O,bay:Tt,fc:qt,fa:qt-r.MOUTH_W/2/it,fb:qt+r.MOUTH_W/2/it,r0:Y})}return N}function L(O=r.PITCH){const W=y(O);let Y=W.next();for(;!Y.done;)Y=W.next();return Y.value}function*y(O){const W=De,Y=[],z=Ce,dt=[v(0),v(1)],N=(it,_t,Bt)=>{if(!(Bt<z.GATE_BLOCK_TOP&&it<z.GATE_BLOCK_D))return[];const Nt=m(_t,z.GATE_BLOCK_HALF-.1),Ht=m(it,z.GATE_BLOCK_HALF)-Nt,ft=r.EDGE+_(it,Nt,Math.max(Ht,0));return[{fa:-Nt,fb:Nt,edge:ft,hole:!0},{fa:e/2-Nt,fb:e/2+Nt,edge:ft,hole:!0}]};function _(it,_t,Bt){const Nt=p(it,_t),Ht=p(it,_t+Bt);return Math.hypot(Ht[0]-Nt[0],Ht[1]-Nt[1])}const Ft=it=>{const _t=T(it,s.BOX_W/2);return[{fa:e/4-_t,fb:e/4+_t,edge:r.EDGE+.25,hole:!1},{fa:3*e/4-_t,fb:3*e/4+_t,edge:r.EDGE+.25,hole:!1}]};W.podium.forEach((it,_t)=>{Y.push(R({group:l.PODIUM,row:_t,d:it.d0+r.CHAIR_IN,seatY:it.y+r.CHAIR_H,floorY:it.y,pitch:r.CHAIR_PITCH,chair:!0,tread:[it.d0,it.d1,it.y],riser:[it.d1,it.y,_t<W.podium.length-1?W.podium[_t+1].y:W.Z1_Y0],gaps:[...N(it.d0,it.d1,it.y),...Ft(it.d0+r.CHAIR_IN)]}))});const Tt=(it,_t,Bt,Nt)=>it.forEach((Ht,ft)=>{const Pt=Ht.d0+r.ROW_IN,te=ft>=r.MOUTH_ROW[Nt]&&ft<r.MOUTH_ROW[Nt]+r.MOUTH_ROWS,ce=dt[Nt].map(_e=>te?{fa:_e.fa,fb:_e.fb,edge:r.EDGE,hole:!0}:{f:_e.fc,half:r.STAIR_W/2});Y.push(R({group:Bt,row:ft,d:Pt,seatY:Ht.y,floorY:Ht.y,pitch:O,own:ft===0,tread:[Ht.d0,Ht.d1,Ht.y],riser:[Ht.d0,ft===0?_t:it[ft-1].y,Ht.y],riserFirst:!0,gaps:[...N(Ht.d0,Ht.d1,Ht.y),...ce]}))});yield,Tt(W.rows1,W.Z1_Y0,l.FIRST,0),yield,Tt(W.rows2,W.Z2_Y0,l.SECOND,1),yield,W.gallery.forEach((it,_t)=>{Y.push(R({group:l.GALLERY,row:_t,d:it.d0+r.GAL_IN,seatY:it.y,floorY:it.y,pitch:O,tread:[it.d0,it.d1,it.y],riser:[it.d0,_t===0?s.WALL5_TOP:W.gallery[_t-1].y,it.y],riserFirst:!0,gaps:dt[1].map(Bt=>({f:Bt.fc,half:r.STAIR_W/2}))}))}),yield;const qt=(s.STAND_D1-s.GAL_D1)/r.STAND_FILES;for(let it=0;it<r.STAND_FILES;it++)Y.push(R({group:l.STANDING,row:it,d:s.GAL_D1+(it+.5)*qt,seatY:s.GAL_TOP,floorY:s.GAL_TOP,pitch:O,stand:!0,gaps:[]}));const Ut=2*Math.floor((s.BOX_W/2-r.BOX_SIDE)/r.BOX_PITCH);for(const it of[1,-1])for(let _t=0;_t<r.BOX_ROWS;_t++){const Bt=it*(s.ARENA_B-.3+r.BOX_FIRST+_t*r.BOX_ROW_D),Nt=Ut*r.BOX_PITCH/2;Y.push({group:l.BOX,row:_t,oval:!1,sgn:it,z:Bt,x0:it>0?Nt:-Nt,x1:it>0?-Nt:Nt,per:2*Nt,seatY:s.BOX_TOP+r.CHAIR_H,floorY:s.BOX_TOP,pitch:r.BOX_PITCH,chair:!0,d:(Math.abs(Bt)-s.ARENA_B)/t,runs:[{s0:0,s1:2*Nt,n:Ut,k0:0,pitch:r.BOX_PITCH}],n:Ut,blocks:[],holes:[]})}return Y.forEach((it,_t)=>{it.id=_t}),{lines:Y,mouths:dt,pitch:O,maxPlaces:Y.reduce((it,_t)=>Math.max(it,_t.n),0),places:Y.reduce((it,_t)=>it+_t.n,0)}}function E(O,W,Y=[0,0,0,0,0,0]){let z=O.lastRun;if(!z||W<z.k0||W>=z.k0+z.n){const _t=O.runs;z=_t[0];for(let Bt=0;Bt<_t.length;Bt++){const Nt=_t[Bt];if(W>=Nt.k0&&W<Nt.k0+Nt.n){z=Nt;break}}O.lastRun=z}const dt=z.s0+(W-z.k0+.5)*z.pitch;if(!O.oval){const _t=dt/O.per;return Y[0]=O.x0+(O.x1-O.x0)*_t,Y[1]=O.z,Y[2]=0,Y[3]=-O.sgn,Y[4]=O.sgn>0?s.BAYS/4:3*s.BAYS/4,Y[5]=Y[4]*e/s.BAYS,Y}const N=O.fAt(dt),_=N/e*o,Ft=Math.cos(_),Tt=Math.sin(_);p(O.d,N,Y);let qt=-Ft/O.a,Ut=-Tt/O.b;const it=Math.hypot(qt,Ut);return Y[2]=qt/it,Y[3]=Ut/it,Y[4]=N*s.BAYS/e,Y[5]=N,Y}function b(O,W,Y){let z=Y;for(let dt=0;dt<5;dt++){const N=s.ARENA_A+z,_=s.ARENA_B+t*z,Ft=O*O/(N*N)+W*W/(_*_)-1,Tt=-2*O*O/(N*N*N)-2*t*W*W/(_*_*_);z=Math.min(400,Math.max(-20,z-Ft/Math.min(Tt,-1e-6)))}return z}function ot(O,W,Y,z,dt){const N=s.RIM_A,_=s.RIM_B,Ft=z[0]*z[0]/(N*N)+z[2]*z[2]/(_*_),Tt=2*(O*z[0]/(N*N)+Y*z[2]/(_*_)),qt=O*O/(N*N)+Y*Y/(_*_)-1,Ut=Tt*Tt-4*Ft*qt;if(Ut<=0)return 1;const it=Math.sqrt(Ut),_t=(-Tt-it)/(2*Ft),Bt=(-Tt+it)/(2*Ft);if(_t>.02&&W+z[1]*_t<s.WALL_H||Bt>.02&&W+z[1]*Bt<s.WALL_H)return 0;if(Bt<0)return 1;const Nt=Math.max(z[1],.05),Ht=(Ce.ROOF_UNDER+s.ROOF_Y)/2;if(W<Ht){const ce=(Ht-W)/Nt,_e=b(O+z[0]*ce,Y+z[2]*ce,40);if(_e>Ce.ROOF_D0&&_e<s.RING_DEPTH)return 0}let ft=((s.RINGROPE_Y+s.MAST_TOP)/2-W)/Nt,Pt=27;for(let ce=0;ce<4;ce++){Pt=b(O+z[0]*ft,Y+z[2]*ft,Pt);const _e=Math.min(1.2,Math.max(-.2,(Pt-Ct.D_RING)/Ct.SPAN));ft=(s.RINGROPE_Y+(s.MAST_TOP-s.RINGROPE_Y)*_e-W)/Nt}if(ft<=0)return 1;const te=(Pt-Ct.D_RING)/Ct.SPAN;return te<dt||te>1?1:.5}const g=["#000000","#ebe5d4","#d9caa4","#e4e5dd","#cbb486","#d4c098","#b9ab8e","#8a6646","#6c4e34","#7c4c3a","#a6412f","#4b6a92","#6b8946","#cc9f3a","#4a3828","#68635c","#4c4945","#5d5042","#e8dec2","#d2bd8e","#bbae94","#b85a40","#5c1f52","#c08c66","#b07e58","#9e6e48","#85593a","#33261d","#7a746c","#c8b27a","#8a6d4c","#ad2a20","#5d8a3c","#6a2862","#f0eadc","#f1eee5","#bd7234","#4c847c","#7a5284","#bf8272","#d0bf98","#c9bda0"],M={HEAD:18,PURPLE:22,SKIN:23,HAIR:27,STRAW:29,CHAIR:30,NAPKIN:34},G=[[35,.6],[3,.25],[1,.15]],q=[[1,.55],[3,.25],[35,.2]],X=[[2,.4],[40,.35],[41,.25]],ht=[[5,.4],[4,.35],[6,.25]],tt=[[14,.2],[8,.14],[7,.08],[15,.2],[16,.18],[17,.14],[9,.06]],F=[[31,.5],[33,.38],[32,.12]],at=[10,13,12,11,36,37,38,39],rt=[.24,.22,.14,.14,.1,.07,.05,.04],Lt={PURPLE:1,HEADCLOTH:2,RESTLESS:4,WAVER:8,STAND:16,NEAR:32,HAT:64,PARASOL:128};function bt(O){const W=O.group,Y=O.row;if(W===l.PODIUM)return{white:G,dark:0,pale:0,dye:0,women:0,marked:0,stripe:.5,foreign:1/40,hat:[.03,.1],parasol:[0,0],skin:1.7,empty:.3,waver:1/30,restless:1/90,band:0};if(W===l.BOX)return{white:G,dark:0,pale:0,dye:0,women:0,marked:0,stripe:0,foreign:0,hat:[0,0],parasol:[0,0],skin:1.7,empty:0,waver:0,restless:0,band:0};if(W===l.FIRST)return Y<r.KNIGHT_ROWS?{white:q,dark:0,pale:.02,dye:0,women:0,marked:.05,stripe:0,foreign:0,hat:[.05,.14],parasol:[.004,.02],skin:1.6,empty:.6,waver:1/7,restless:1/45,band:.5}:{white:X,dark:.02,pale:.1,dye:.03,women:0,marked:0,stripe:0,foreign:0,hat:[.05,.14],parasol:[.004,.02],skin:1.6,empty:.6,waver:1/7,restless:1/45,band:.5};if(W===l.SECOND){const z=Math.min(1,Math.max(0,(Y-(r.DARK_FROM-2))/3)),dt=z*z*(3-2*z);return{white:X,dark:.04+.8*dt,pale:.16-.08*dt,dye:.42-.35*dt,women:0,marked:0,stripe:0,foreign:0,hat:[.06,.16],parasol:[.006,.025],skin:1.3,empty:.9+.5*dt,waver:1/7,restless:1/40,band:.8}}return W===l.GALLERY?{white:X,dark:.45,pale:.12,dye:.38,women:.5,marked:0,stripe:0,foreign:0,hat:[.04,.1],parasol:[.03,.06],skin:1,empty:1.7,waver:1/8,restless:1/40,band:.6}:{white:X,dark:.62,pale:.1,dye:.25,women:.1,marked:0,stripe:0,foreign:0,hat:[0,0],parasol:[0,0],skin:1,empty:2.3,waver:1/10,restless:0,band:.5}}const zt=.8,j=.78,Rt=40,Gt=1024,gt=.85,et=4;function Zt(O){const W=No(Po("amphitheatre-seating-wedges:"+O)),Y=No(Po("amphitheatre-seating-groups:"+O)),z=new Float32Array(6*Rt*3),dt=new Float32Array(Gt*2);for(let N=0;N<z.length;N++)z[N]=W();for(let N=0;N<dt.length;N++)dt[N]=Y();return{wedge:z,group:dt}}const he=(O,W)=>{const Y=O===l.SECOND||O===l.GALLERY||O===l.STANDING?1.5:.5;return(Math.floor((W-Y)*.5)%Rt+Rt)%Rt};function oe(O,W){if(O!==l.FIRST&&O!==l.PODIUM)return 0;const Y=Math.abs(W-s.BAYS/2),z=Math.min(1,Math.max(0,(r.GUEST_BAYS[1]-Y)/(r.GUEST_BAYS[1]-r.GUEST_BAYS[0])));return z*z*(3-2*z)}function Ee(O,W,Y,z,dt,N,_){const Ft=O.group,Tt=he(Ft,Y),qt=(Ft*Rt+Tt)*3,Ut=_.wedge[qt],it=_.wedge[qt+1],_t=_.wedge[qt+2],Bt=(Re,ue)=>{for(let ge=0;ge<Re.length;ge++){const Te=Re[ge];if(ue<Te[1])return Te[0];ue-=Te[1]}return Re[Re.length-1][0]},Nt=(Re,ue,ge)=>{if(Re<ge)return at[ue];Re=(Re-ge)/(1-ge);for(let Te=0;Te<at.length;Te++){if(Re<rt[Te])return at[Te];Re-=rt[Te]}return at[0]},Ht=Re=>{let ue=Re;for(let ge=0;ge<at.length;ge++){if(ue<rt[ge])return ge;ue-=rt[ge]}return 0},ft=Math.floor((O.row+Math.floor(_t*et))/et),Pt=Math.floor(Y*gt+ft*.618034%1),te=((Ft*7919+ft*104729+Pt*1299721)%Gt+Gt)%Gt,ce=_.group[te*2],_e=_.group[te*2+1],Oe=oe(Ft,Y);let ne=W.dye,fe=W.dark,be=W.pale,re=W.marked,me=W.foreign;ne*=.6+.8*Ut,re*=.4+1.6*Ut;let ve=Ht(it),Fe=.3;if(W.band>0&&ne>0){const Re=Math.min(.9,ne),ue=ce<Re*.85;ne=ue?ne+(.92-ne)*W.band:ne*(1-W.band*.8),ue&&(ve=Ht(_e),Fe=.8,fe*=1-W.band*.7)}if(Oe>0){const Re=Ft===l.PODIUM?.5:.74;ne=ne+(Re-ne)*Oe,re*=1-Oe,ve=Ht(_e),Fe=.55,me=0,Ft!==l.PODIUM&&(fe=fe+(.12-fe)*Oe)}return z?dt<j?Nt(N,ve,Fe):Bt(ht,N):dt<fe?Bt(tt,N):dt<fe+re?Bt(F,N):dt<fe+re+me?Nt(N,ve,0):dt<fe+re+me+ne?Nt(N,ve,Fe):dt<fe+re+me+ne+be?Bt(ht,N):Bt(W.white,N)}const I=O=>{const W=Math.min(1,Math.max(0,(O-.7)/(r.FULL[2]-.7)));return 1-(1-r.FULL[0])*Math.pow(1-W,r.FULL[1])};function ie(O=.25){const W=ca(fa()),Y=Math.floor(W.length/O),z=new Float32Array((Y+2)*3),dt=new U.Vector3;for(let N=0;N<=Y+1;N++)W.posAtDist(Math.min(W.length,N*O),dt),z[N*3]=dt.x,z[N*3+1]=dt.y,z[N*3+2]=dt.z;return z}function Mt(O,W,Y,z,dt,N,_,Ft,Tt){let qt=1e18;for(let Ut=0;Ut<O.length;Ut+=3){const it=O[Ut]-W,_t=O[Ut+2]-Y,Bt=O[Ut+1],Nt=it*z+_t*dt,Ht=_t*z-it*dt,ft=Nt<0?-Nt:Nt>Ft?Nt-Ft:0,Pt=Math.abs(Ht)>Tt?Math.abs(Ht)-Tt:0,te=Bt<N?N-Bt:Bt>_?Bt-_:0,ce=ft*ft+Pt*Pt+te*te;ce<qt&&(qt=ce)}return Math.sqrt(qt)}async function pe(O,W,Y={},z=async()=>{}){const dt=O.lines,N=O.places,_=new Float32Array(N*4),Ft=new Float32Array(N*4),Tt=new Uint8Array(N*4),qt=new Float32Array(N),Ut=new Uint16Array(N),it=new Uint16Array(N),_t=Y.sunV?[Y.sunV.x??Y.sunV[0],Y.sunV.y??Y.sunV[1],Y.sunV.z??Y.sunV[2]]:[.69,.72,-.05],Bt=1-(Y.draw??s.CLOTH_DRAW)/Ct.SPAN,Nt=Y.rare?1:0,Ht=Zt(Y.seed??0),ft=[0,0,0,0,0,0];let Pt=0,te=0;for(const ne of dt){const fe=bt(ne);for(let be=0;be<ne.n;be++){E(ne,be,ft);const re=Pt*4,me=ot(ft[0],ne.seatY+.7,ft[1],_t,Bt),ve=me>.75?1:me>.25?.12:.03;_[re]=ft[0],_[re+1]=ne.seatY,_[re+2]=ft[1],_[re+3]=Math.atan2(ft[3],ft[2]);const Fe=ne.own||ne.stand?1:0;Ft[re]=ft[4],Ft[re+1]=ne.d,Ft[re+2]=ne.seatY+h.CLOTH+Fe*h.OWN_FLOOR,Ft[re+3]=Fe;const Re=W()<fe.women,ue=W(),ge=W(),Te=Ee(ne,fe,ft[4],Re,ue,ge,Ht);let ke=ne.stand?Lt.STAND:0;W()<fe.stripe&&(Te<=3||Te===35)&&(ke|=Lt.PURPLE);const lo=W();lo<fe.waver?ke|=Lt.WAVER:lo<fe.waver+fe.restless&&(ke|=Lt.RESTLESS);const fo=W(),Oo=W(),B=fe.parasol[Nt]*ve,Dt=fe.hat[Nt]*ve;!(ke&(Lt.WAVER|Lt.RESTLESS|Lt.STAND))&&fo<B?ke|=Lt.PARASOL:fo<B+Dt?ke|=Lt.HAT:Re&&Oo<zt&&(ke|=Lt.HEADCLOTH),Tt[re]=Te,Tt[re+1]=Math.floor(W()*256),Tt[re+2]=ke,Tt[re+3]=Math.min(3,Math.floor(Math.pow(W(),fe.skin)*4))|(W()<.18?1:0)<<2|Math.floor(W()*4)<<3|ne.group<<5,qt[Pt]=fe.empty>0?W()/fe.empty:2+W(),Ut[Pt]=ne.id,it[Pt]=be,Pt++,++te%150===0&&await z()}}const ce=Math.round(Pt*I(Y.density??1)),_e=Math.max(0,Pt-ce);let Oe=Pt;if(_e>0){const be=new Uint32Array(4096),re=ue=>Math.min(4095,Math.floor(ue/4*4096));for(let ue=0;ue<Pt;ue++)be[re(qt[ue])]++;await z();let me=0,ve=0;for(;ve+be[me]<_e;)ve+=be[me++];const Fe=[];for(let ue=0;ue<Pt;ue++)re(qt[ue])===me&&Fe.push(qt[ue]);Fe.sort((ue,ge)=>ue-ge);const Re=Fe[_e-1-ve];Oe=0,await z();for(let ue=0;ue<Pt;ue++)qt[ue]<=Re?Tt[ue*4]=0:Oe++}return{places:Pt,taken:Oe,pos:_,more:Ft,who:Tt,lineOf:Ut,kOf:it,emptiedByOff:0}}async function Le(O,W,Y=async()=>{}){const z=ie(.25),dt=h;await Y();const N=Math.floor((z.length/3-2)/4)+2,_=new Float32Array(N*3);for(let Ht=0;Ht<N;Ht++){const ft=Math.min(z.length/3-1,Ht*4)*3;_[Ht*3]=z[ft],_[Ht*3+1]=z[ft+1],_[Ht*3+2]=z[ft+2]}const Ft=d.map(()=>1e9),Tt=d.map(()=>null),qt=d.map(()=>0),Ut=d.map(()=>0),it=d.map(()=>0);let _t=0,Bt=1e9,Nt=0;for(let Ht=0;Ht<W.places;Ht++){Nt>2e4&&(Nt=0,await Y());const ft=Ht*4;if(!W.who[ft])continue;Nt+=N;const Pt=W.pos[ft],te=W.pos[ft+1],ce=W.pos[ft+2],_e=W.who[ft+3]>>5;let Oe=1e18;for(let be=0;be<_.length;be+=3){const re=_[be]-Pt,me=_[be+1]-(te+.7),ve=_[be+2]-ce,Fe=re*re+me*me+ve*ve;Fe<Oe&&(Oe=Fe)}const ne=Math.sqrt(Oe);let fe=ne-2.2;if(ne<Math.max(Ft[_e]+2.4,r.OFF+4)){const be=Math.cos(W.pos[ft+3]),re=Math.sin(W.pos[ft+3]);if(Nt+=z.length/3,fe=Mt(z,Pt,ce,be,re,te,W.more[ft+2],dt.FORWARD,dt.SIDE),fe<Bt&&(Bt=fe),fe<r.OFF){W.who[ft]=0,W.taken--,it[_e]++;continue}fe<Ft[_e]&&(Ft[_e]=fe,Tt[_e]=[Pt,te,ce])}Ut[_e]++,ne<r.NEAR&&(W.who[ft+2]|=Lt.NEAR,_t++,qt[_e]++)}return W.emptiedByOff=it.reduce((Ht,ft)=>Ht+ft,0),{least:Ft,leastAt:Tt,leastRaw:Bt,near:_t,nearBy:qt,takenBy:Ut,emptied:it,linePlaces:z.length/3}}async function Ue(O={}){const W=L(O.pitch??r.PITCH),Y=No(Po("amphitheatre-seating:"+(O.seed??0))),z=await pe(W,Y,O),dt=await Le(W,z),N=h,_=[];for(let Ft=0;Ft<z.places;Ft++){const Tt=Ft*4;if(!z.who[Tt])continue;const qt=z.pos[Tt+1],Ut=z.more[Tt+3]*N.OWN_FLOOR,it=z.who[Tt+2],_t=(it&Lt.STAND)!==0,Bt=(it&Lt.PARASOL)!==0;_.push({zone:d[z.who[Tt+3]>>5],x:z.pos[Tt],y:qt,z:z.pos[Tt+2],facing:[Math.cos(z.pos[Tt+3]),Math.sin(z.pos[Tt+3])],sitting:_t?qt+Ut+N.STAND:qt+(Bt?N.PARASOL:N.SIT),standing:Bt?qt+N.PARASOL:qt+Ut+N.STAND,armUp:Bt?qt+N.PARASOL:qt+Ut+N.ARM,clothUp:Bt?qt+N.PARASOL:qt+Ut+N.CLOTH,forward:N.FORWARD,sideways:N.SIDE})}return{people:_,plan:W,deal:z,law:dt}}const pt=O=>O.toFixed(3),Ke=O=>"vec3("+O.map(pt).join(", ")+")",P=O=>`vec3(0., mix(${pt(O[0][0])}, ${pt(O[1][0])}, up), mix(${pt(O[0][1])}, ${pt(O[1][1])}, up))`,K={RIBBON:0,TREAD:1,RISER:2,FLOOR:3,WELL_RISER:4,WELL_TREAD:5,WELL_CHEEK:6,DOOR:7},C={HALF_ROUND:17,HALF_ANSWER:5.2,HALF_UP:3.4,HALF_SHARE:.3,WEDGE_ROUND:[14,10],WEDGE_UP:2.8,CLAP_LEN:3.6,CLAP_RATE:2.3,KEEN:[.45,.93,.93,.9,.9],CLOTH_SHARE:.8,SHOWERS:4,BALL_BEFORE:.3,BALL_AFTER:.5,BALL_SHARE:.94},It=`
uniform vec4 uCrowd;   // x: where the halves' round stands at the clock's nought; y: +1 or -1, the half that shouts first; z: the wedges' own number
uniform vec4 uShower[${C.SHOWERS}];            // a shower of prize balls: its period, its place on the clock, 1 where it stands
uniform float uShowerWedge[${C.SHOWERS*16}];  // its sixteen wedges (the oval's angle), gone through turn by turn
uniform vec4 uShowerLaw;                             // x: half the breadth of the wedge a shower falls on (an angle); y: the seconds a turn's balls are thrown and fall
float bit(float v, float b) { return mod(floor(v / b), 2.); }
float h11(float x) { return fract(sin(x * 127.1 + 31.7) * 43758.5453); }
float spell(float s, float len, float soft) { return smoothstep(0., soft, s) * (1. - smoothstep(len - soft, len, s)); }
// A FIGURE'S OWN MEASURES, from its phase: x how far it sits off its place's middle (metres along the bench), y its size
// (0.87 to 1 of the figure's measures: nobody is taller than the count's figure), z the tone of its cloth, w its hair's tone
vec4 ownOf(float ph) { float t = fract(ph * 9.13 + .37); return vec4((fract(ph * 5.37 + .71) - .5) * .11, 1. - .13 * t * t, .86 + .17 * fract(ph * 13.7 + .21), mix(.55, 1.3, fract(ph * 23.1 + .4))); }
float baldOf(float ph) { return step(.88, fract(ph * 17.3 + .5)); }
// how far the whole wedge of a place is on its feet (0..1): its own round, or its half's shout if this round's draw takes it
float wedgeUpAt(float bayU, float grp, float r2, out float w, out float s, out float P) {
  float g = grp > 4.5 ? 0. : grp, off = g > 1.5 ? 1.5 : .5;
  w = mod(floor((bayU - off) * .5), ${(s.BAYS/2).toFixed(1)}) + ${(s.BAYS/2).toFixed(1)} * g + uCrowd.z;
  P = ${pt(C.WEDGE_ROUND[0])} + ${pt(C.WEDGE_ROUND[1])} * h11(w); s = fract(uTime / P + h11(w + 17.3)) * P;
  float ownUp = spell(s - r2 * .5, ${pt(C.WEDGE_UP)}, .35);
  float side = bayU < ${(s.BAYS/2).toFixed(1)} ? 1. : -1.;
  float rq = uTime / ${pt(C.HALF_ROUND)} + uCrowd.x, turnN = floor(rq);
  float sH = (rq - turnN) * ${pt(C.HALF_ROUND)} - (side * uCrowd.y > 0. ? 0. : ${pt(C.HALF_ANSWER)});
  float joins = step(h11(w * 1.37 + turnN * 7.13), ${pt(C.HALF_SHARE)}) * step(g, 4.5);
  float halfUp = spell(sH - h11(w + 3.3) * 1.1 - r2 * .5, ${pt(C.HALF_UP)}, .4) * joins;
  return max(ownUp, halfUp) * step(grp, 4.5);
}
// how far a place reaches for the prize balls (0..1): the two marble zones, inside a falling shower's wedge
float reachAt(float bayU, float grp, float r2) {
  float reach = 0.;
  if (grp > .5 && grp < 2.5) {
    float ang = bayU * ${(Math.PI*2/s.BAYS).toFixed(7)};
    for (int i = 0; i < ${C.SHOWERS}; i++) {
      vec4 sh = uShower[i];
      if (sh.z > .5) {
        float q = (uTime + sh.y) / sh.x, turn = floor(q), since = (q - turn) * sh.x;
        float da = abs(mod(ang - uShowerWedge[i * 16 + int(mod(turn, 16.))] + 3.14159265, 6.2831853) - 3.14159265);
        reach = max(reach, (1. - smoothstep(uShowerLaw.x, uShowerLaw.x * 1.2, da)) * spell(since - ${pt(C.BALL_BEFORE)} - r2 * .4, uShowerLaw.y + ${pt(C.BALL_AFTER)}, .3));
      }
    }
  }
  return reach;
}
// one figure's doings: x how far up it stands (0 sits, 1 stands), y its arms (0 down, 1 up), z its sway (-1..1), w its
// cloth (0 none, 1 held up); clap: x how much it claps, y the beat (-1 hands apart .. 1 hands together)
vec4 doingAt(float bayU, float grp, float ph, float fl, out vec2 clap) {
  float g = grp > 4.5 ? 0. : grp;
  float keen = g < .5 ? ${pt(C.KEEN[0])} : g < 1.5 ? ${pt(C.KEEN[1])} : g < 2.5 ? ${pt(C.KEEN[2])} : g < 3.5 ? ${pt(C.KEEN[3])} : ${pt(C.KEEN[4])};
  float r1 = fract(ph * 7.31 + .13), r2 = fract(ph * 3.77 + .61), r3 = fract(ph * 11.9 + .29);
  float w, s, P, wedgeUp = wedgeUpAt(bayU, grp, r2, w, s, P);
  float rise = wedgeUp * step(r1, keen);
  float reach = reachAt(bayU, grp, r2) * step(r1, ${pt(C.BALL_SHARE)});
  float cl = spell(s - P * .5 - r2 * .3, ${pt(C.CLAP_LEN)}, .35) * step(r3, .85) * step(grp, 4.5);
  clap = vec2(cl, sin((uTime * ${pt(C.CLAP_RATE)} + h11(w + 5.1)) * 6.2831853));
  float restless = bit(fl, 4.), waver = bit(fl, 8.), stands = bit(fl, 16.), par = bit(fl, 128.);
  float q2 = fract(uTime / (9. + 12. * ph) + ph * 5.1);
  float own = smoothstep(0., .05, q2) * (1. - smoothstep(.2, .26, q2));
  float cloth = max(waver * own, rise * max(waver, step(r3, ${pt(C.CLOTH_SHARE)}))) * (1. - reach);
  float q = fract(uTime / (11. + 17. * ph) + ph * 13.7);
  float up1 = restless * smoothstep(0., .07, q) * (1. - smoothstep(.24, .32, q));
  float up = max(max(max(rise, up1), cloth * .85), reach) * (1. - par);
  float arms = max(max(max(rise * step(r2, .85), up1 * .5), cloth), reach) * (1. - par);
  return vec4(max(up, stands), arms, sin(uTime * (.5 + .9 * ph) + ph * 61.), cloth * (1. - par));
}
// one on his feet bends his knees a little in his own time: metres DOWN from his full height (never up)
float bobOf(float ph, float up) { return up * .07 * (.5 + .5 * sin(uTime * (5. + 3. * ph) + ph * 97.)); }
`,wt=`
vec3 litBy(vec3 alb, vec3 N, vec3 P, float d, float bayU, float ao, float sunK) {
  vec3 sun = sunAt(P + N * .05) * uSunCol * max(dot(N, uSun), 0.) * sunK;
  return alb * (sun + fillAt(P, N, d, fract(bayU / ${s.BAYS.toFixed(1)}) * ${s.MASTS.toFixed(1)}) * ao);
}
`,Vt=`
attribute vec4 aCell;   // the line's number (or -1), the place's breadth here, kind * 8 + group (+ 64: own floor), d
attribute vec4 aPl;     // the place's measure along the line (-1: none), the measure across (or up), the bay's measure, how open to the sky
attribute vec2 aIn;     // the face's own level direction: toward the arena, or a cheek's facing
varying vec3 vW; varying vec4 vCell; varying vec4 vPl; varying vec2 vIn;
void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vCell = aCell; vPl = aPl; vIn = aIn; gl_Position = projectionMatrix * viewMatrix * w; }
`,Xt=`
precision highp float;
varying vec3 vW; varying vec4 vCell; varying vec4 vPl; varying vec2 vIn;
uniform sampler2D tSeats;
uniform vec3 uPal[${g.length}];
${eo}
${Fo}
${It}
${wt}
float blob(vec2 q) { return clamp(1. - dot(q, q), 0., 1.); }
void main() {
  float kg = floor(vCell.z + .5), kind = floor(kg / 8.), grp = kg - kind * 8., bayU = vPl.z, ao = vPl.w, loc = vPl.y;
  // A FILTER BY A PIXEL'S FOOTPRINT on the stone, in metres (taken here, before any branch)
  float fpS = max(fwidth(vPl.x) * vCell.y, fwidth(vPl.y));
  float flat_ = (kind == ${K.TREAD}. || kind == ${K.FLOOR}. || kind == ${K.WELL_TREAD}.) ? 1. : 0.;
  float d = vCell.w + (kind == ${K.TREAD}. ? loc : 0.);
  vec3 F = normalize(vec3(vIn.x, 0., vIn.y) + vec3(1e-6, 0., 0.)), R = vec3(-F.z, 0., F.x);
  vec3 N = flat_ > .5 ? vec3(0., 1., 0.) : F;
  float wood = (grp > 2.5 && grp < 4.5) ? 1. : 0.;
  vec3 alb = ${Ke(Ne.MARBLE)} * (.97 + .05 * hash21(vec2(floor(vCell.w * 2.74), floor(bayU * 6.))));
  if (wood > .5) {
    alb = kind == ${K.FLOOR}. ? ${Ke(Ne.TIMBER)} * (1.1 + .25 * vnoise(vec2(bayU * 9., d * 1.3))) * (1. - .2 * (1. - smoothstep(0., .06, abs(fract(bayU) - .5) - .47)))
      : ${Ke(Ne.TIMBER)} * (1.25 + .2 * hash21(vec2(floor(vCell.w * 3.2), floor(bayU))));
  }
  float sunK = 1., fine = 1. - smoothstep(.12, .4, fpS);
  if (kind == ${K.RISER}.) {
    ao *= .82 * mix(.8, 1., smoothstep(0., .3, loc));
    // THE SHADE ON THE STEP BEHIND THE SITTERS: a riser behind a row of people stands in their shade and sees little
    // sky (not the first riser of a zone, which has nobody before it, and not where a stair runs through)
    if (grp > .5 && grp < 3.5 && abs(vCell.w - ${pt(De.Z1_D0)}) > .1 && abs(vCell.w - ${pt(De.Z2_D0)}) > .1 && abs(vCell.w - ${pt(s.GAL_D0)}) > .1) {
      float tt = bayU * ${(Math.PI*2/s.BAYS).toFixed(7)}, ra = FA_A + vCell.w, rb = FA_B + FA_K * vCell.w;
      float bayLen = length(vec2(ra * sin(tt), rb * cos(tt))) * ${(Math.PI*2/s.BAYS).toFixed(7)};
      float toStair = abs(mod(bayU - (grp > 1.5 ? 1.5 : .5) + 1., 2.) - 1.) * bayLen;
      float behind = smoothstep(${pt(r.STAIR_W/2-.02)}, ${pt(r.STAIR_W/2+.06)}, toStair);
      ao *= mix(1., .5, behind); sunK = mix(1., .25, behind);
    }
  }
  if (kind == ${K.TREAD}.) {
    // the seam where the tread meets the riser behind it
    ao *= 1. - .3 * fine * smoothstep(.3, .44, loc) * (1. - wood * .5);
    if (vPl.x < -.5 && grp > .5 && grp < 3.5) {
      // a stair between two wedges: each row's rise taken in two steps (drawn: a worn middle and the half step's edge)
      alb *= .9 + .06 * hash21(vec2(floor(bayU * 3.), floor(vCell.w * 2.74)));
      ao *= 1. - .3 * fine * (1. - smoothstep(0., .05, abs(loc - .07)));
    }
  }
  if (kind == ${K.TREAD}. && vCell.x > -.5 && vPl.x >= 0.) {
    float pitch = vCell.y, k = floor(vPl.x), a = (vPl.x - k - .5) * pitch;
    vec4 who = texelFetch(tSeats, ivec2(int(k), int(vCell.x + .5)), 0) * 255.;
    float fl = who.z, stands = bit(fl, 16.), near = bit(fl, 32.);
    if (who.x > .5) {
      // the shade round the one who is there, and the shade he casts on his own tread, away from the sun
      float sh = blob(vec2(a / .3, (loc + .12) / .42));
      alb *= 1. - .5 * sh;
      // (behind him, where his back and the feet of the row behind shut the sky out: a dark line along his back, the
      // stone paler again toward the riser)
      ao *= 1. - .6 * smoothstep(.06, .15, loc) * (1. - .55 * smoothstep(.2, .36, loc));
      vec2 offs = -uSun.xz * (.4 / max(uSun.y, .2));
      sunK *= 1. - .9 * min(1., 1.6 * blob(vec2((a + dot(offs, R.xz)) / .34, (loc + dot(offs, F.xz)) / .4)));
      if (near < .5) {
        vec2 clap; vec4 doing = doingAt(bayU, grp, who.y / 255., fl, clap);
        float up = doing.x;
        vec4 me = ownOf(who.y / 255.);
        vec3 cloth = uPal[int(who.x + .5)] * me.z;
        float hatp = bit(fl, 64.), par = bit(fl, 128.);
        vec3 top = hatp > .5 ? uPal[${M.STRAW}] : bit(fl, 2.) + par > .5 ? uPal[${M.HEAD} + int(mod(floor(who.w / 8.), 4.))] : mix(uPal[${M.HAIR} + int(bit(who.w, 4.))] * me.w, uPal[${M.SKIN} + int(mod(who.w, 4.))] * .95, baldOf(who.y / 255.));
        a = (a - me.x + doing.z * .02) / me.y; float locS = loc / me.y;
        // from above: the lap before the seat's line (gone when he stands), the shoulders on it, the head over them.
        // Every part's edge is one footprint soft, and a head smaller than the footprint is drawn as wide as the
        // footprint and as much fainter, so that far heads neither sparkle nor vanish
        float rh = mix(.105, mix(.2, .4, par), max(hatp, par)), wh = max(rh, .7 * fpS);
        // (one on his feet stands a little before his seat's line; his raised hands and his cloth show as small patches)
        locS += .1 * up;
        vec2 qs = vec2(a / .2, locS / .14), ql = vec2(a / .17, (locS + .16) / .13), qh = vec2(a, locS + .03) / wh;
        float e = clamp(fpS / .2, .04, .9), eh = clamp(fpS / wh, .04, .9);
        float lap = (1. - smoothstep(1. - e, 1. + e, length(ql))) * (1. - up), body = 1. - smoothstep(1. - e, 1. + e, length(qs));
        float head = (1. - smoothstep(1. - eh, 1. + eh, length(qh))) * (rh * rh) / (wh * wh), cov = max(max(lap, body), head);
        // (a raised arm and the cloth patch by the same filter: true size, .07 and .13 by .09; under a pixel one pixel
        // wide and fainter by the true cover)
        float wa = max(.07, .5 * fpS), arm = doing.y * (1. - smoothstep(1. - e, 1. + e, length(vec2(abs(a) - .2, locS + .06) / wa))) * (.0049 / (wa * wa));
        vec2 kr = max(vec2(.13, .09), vec2(.5 * fpS));
        float kc = doing.w * (1. - smoothstep(1. - e, 1. + e, length(vec2(a - .1, locS + .12) / kr))) * (.0117 / (kr.x * kr.y));
        if (max(arm, kc) > .003) { alb = mix(alb, mix(uPal[${M.SKIN} + int(mod(who.w, 4.))], uPal[${M.NAPKIN}], step(arm, kc)), max(arm, kc)); sunK = mix(sunK, 1., max(arm, kc)); }
        if (cov > .003) {
          vec2 q = head > .5 ? qh : body > lap ? qs : ql;
          // (the lap lies a little lower in tone than the shoulders: the hands and the body's own shade on it)
          alb = mix(alb, mix(cloth * (body > lap ? 1. : .88), top, head), cov);
          vec3 nr = normalize(vec3(0., 1., 0.) * sqrt(max(1. - min(dot(q, q), 1.), .04)) + (R * q.x + F * (-q.y)) * .9);
          N = normalize(mix(N, nr, cov * (1. - smoothstep(.07, .22, fpS))));
          sunK = mix(sunK, 1., cov);
        }
      }
    }
  }
  if (kind == ${K.WELL_TREAD}. || kind == ${K.WELL_RISER}.) {
    // a stair's mouth: its near steps still catch the sky, its far end is deep
    alb = ${Ke(Ne.TRAVERTINE)} * mix(.62, .3, loc) * (kind == ${K.WELL_RISER}. ? .8 : 1.); ao *= mix(.8, .3, loc); sunK = .35;
  } else if (kind == ${K.WELL_CHEEK}.) {
    alb *= mix(.9, .5, loc); ao *= mix(.75, .3, loc); sunK = .35;
  } else if (kind == ${K.DOOR}.) {
    // the door under the row behind: a dark opening between two jambs and under a lintel; in it the stair goes on down, dimmer step by step
    float H = vCell.y, open_ = step(abs(vPl.x), ${pt(1-r.MOUTH_JAMB/(r.MOUTH_W/2))}) * step(loc, H - ${pt(r.MOUTH_LINTEL)});
    float deep = smoothstep(0., .75, loc / H), stepLine = .78 + .22 * step(.45, fract(loc / .21));
    alb = mix(${Ke(Ne.TRAVERTINE)} * .7, ${Ke(Ne.TRAVERTINE)} * mix(.42, .08, deep) * stepLine, open_);
    ao *= mix(.6, .4, open_); sunK = (1. - open_) * .35;
  }
  vec3 col = litBy(alb, N, vW, d, bayU, ao, sunK);
  gl_FragColor = vec4(hazed(col, vW), 1.);
}
`,Kt=`
precision highp float;
varying vec3 vW; varying vec4 vCell; varying vec4 vPl; varying vec2 vIn;
uniform sampler2D tSeats;
uniform vec3 uPal[${g.length}];
${eo}
${It}
${wt}
void main() {
  float kg = floor(vCell.z + .5), own = floor(kg / 64.), chair = floor((kg - own * 64.) / 8.), grp = kg - own * 64. - chair * 8.;
  float pitch = vCell.y, k = floor(vPl.x), a = (vPl.x - k - .5) * pitch, h = vPl.y, bayU = vPl.z;
  // A PIXEL'S FOOTPRINT on the ribbon, in metres (taken before anything is cut away), and half of it. THE FOOTPRINT
  // FILTER ON A FIGURE: every part keeps its true size; a part under a pixel wide (a head, a hat, a hand, a raised
  // arm, the cloth) is drawn one pixel wide, and thin is then its true cover (1 for a part at its true size): its
  // colour falls by that toward its bearer's own cloth (a ribbon is a cut-out and lets nothing through, so the
  // fall is toward the cloth it stands before, not toward what lies behind the ribbon). The body's own rounds
  // (shins, lap, body) keep their true size however far.
  float fp = max(fwidth(vPl.x) * pitch, fwidth(vPl.y)), hp = .5 * fp, thin = 1.;
  vec2 rT, rD;
  if (vPl.x < 0.) discard;
  vec4 who = texelFetch(tSeats, ivec2(int(k), int(vCell.x + .5)), 0) * 255.;
  float fl = who.z, stands = bit(fl, 16.);
  if (who.x < .5 || bit(fl, 32.) > .5) discard;
  vec2 clap; vec4 doing = doingAt(bayU, grp, who.y / 255., fl, clap);
  float up = doing.x, arms = doing.y;
  float h0 = h, a0 = a;
  vec4 me = ownOf(who.y / 255.);
  h = (h - max(stands, own * up) * ${pt(i.STAND_BASE[0])} * me.y + bobOf(who.y / 255., up)) / me.y;
  a = (a - me.x) / me.y;
  a -= doing.z * .025 * smoothstep(0., .7, h);
  vec3 F = normalize(vec3(vIn.x, 0., vIn.y)), R = vec3(-F.z, 0., F.x);
  float before = step(0., dot(F, cameraPosition - vW));
  float part = 0., fold = 1.; vec2 q, nl = vec2(0.); float dd;
  // from the back of the picture to its front: the seat, shins and lap, body, head, hands, the cloth
  if (chair > .5 && abs(a0) < .2 && h0 < .03 && (abs(a0) > .14 || h0 > -.1)) { part = 7.; nl = vec2(a0 / .2, 0.) * .5; }
  q = vec2(a, h - mix(${pt(i.LAP_C[0][0])}, ${pt(i.LAP_C[1][0])}, up)) / vec2(mix(${pt(i.LAP_R[0][0])}, ${pt(i.LAP_R[1][0])}, up), mix(${pt(i.LAP_R[0][1])}, ${pt(i.LAP_R[1][1])}, up)); dd = dot(q, q);
  if (dd < 1.) { part = 3.; nl = q; }
  q = vec2(a, h - mix(${pt(i.SHIN_C[0][0])}, ${pt(i.SHIN_C[1][0])}, up)) / vec2(mix(${pt(i.SHIN_R[0][0])}, ${pt(i.SHIN_R[1][0])}, up), mix(${pt(i.SHIN_R[0][1])}, ${pt(i.SHIN_R[1][1])}, up)); dd = dot(q, q);
  if (dd < 1.) { part = 3.5; nl = q; }
  q = vec2(a, h - mix(${pt(i.BODY_C[0][0])}, ${pt(i.BODY_C[1][0])}, up)) / vec2(${pt(i.BODY_R[0][0])}, mix(${pt(i.BODY_R[0][1])}, ${pt(i.BODY_R[1][1])}, up)); dd = dot(q, q);
  if (dd < 1.) { part = 1.; nl = q; }
  float hy = mix(${pt(i.HEAD_C[0][0])}, ${pt(i.HEAD_C[1][0])}, up);
  rT = vec2(${pt(i.HEAD_R)}); rD = max(rT, vec2(hp));
  q = vec2(a, h - hy) / rD; dd = dot(q, q);
  if (dd < 1.) { part = 2.; nl = q; thin = rT.x * rT.y / (rD.x * rD.y); }
  // a broad hat on the head or a parasol over it (no wider here than the holder's own place)
  float hatp = bit(fl, 64.), par = bit(fl, 128.);
  if (hatp + par > .5) {
    rT = mix(vec2(${pt(i.HAT_R[0])}, ${pt(i.HAT_R[1]+.005)}), vec2(${pt(i.PARASOL_R[0])}, ${pt(i.PARASOL_R[1])}), par); rD = max(rT, vec2(hp));
    q = (vec2(a, h) - vec2(0., hy + mix(${pt(i.HAT_UP)}, ${pt(i.PARASOL_UP)}, par))) / rD; dd = dot(q, q);
    if (dd < 1.) { part = 6.; nl = q * .5; thin = rT.x * rT.y / (rD.x * rD.y); }
  }
  // the hands: on the lap, at the sides of one who stands, up over the head, or meeting before the chest on the wedge's beat
  // (a raised arm is a stroke from the shoulder to the hand: its top is the count's, ${pt(i.HAND_UP+i.HAND_R_UP)} over the head's middle)
  vec2 hc = mix(mix(vec2(.05, .22), vec2(.2, .3), up), vec2(.2, hy + ${pt(i.HAND_UP+i.HAND_R_UP-.24)}), arms), hr = mix(vec2(.06, .05), vec2(.07, .24), arms);
  float clapping = clap.x * (1. - arms) * (1. - up);
  hc = mix(hc, vec2(.04 + .13 * (.5 - .5 * clap.y), .56), clapping); hr = mix(hr, vec2(.055, .075), clapping);
  if (before + arms > .5) {
    rT = hr; rD = max(rT, vec2(hp));
    q = (vec2(a, h) - hc) / rD; dd = dot(q, q); if (dd < 1.) { part = 4.; nl = q; thin = rT.x * rT.y / (rD.x * rD.y); }
    q = (vec2(a, h) - vec2(-hc.x, hc.y)) / rD; dd = dot(q, q); if (dd < 1.) { part = 4.; nl = q; thin = rT.x * rT.y / (rD.x * rD.y); }
  }
  // THE TOSSED FOLD: ONE SIZE FOR EVERY EYE (the cards' own: ${pt(i.CLOTH_R[0])} by ${pt(i.CLOTH_R[1]+.1)} m half, grown with the lift);
  // its top stays where the count has it, ${pt(i.HAND_UP+i.CLOTH_UP+i.CLOTH_R[1])} over the head's middle at the most. Under a pixel it is one
  // pixel wide and fainter by its true cover (the filter above). Its inner shade (two tones parted by a moving
  // line) runs to its own mean, .81, where the footprint is too large to carry the line.
  if (doing.w > .001) {
    rT = vec2(${pt(i.CLOTH_R[0])}, ${pt(i.CLOTH_R[1]+.1)}) * doing.w; rD = max(rT, vec2(hp));
    q = (vec2(a, h) - vec2(.1 + sin(uTime * 6. + who.y * .157) * .09, hy + ${pt(i.HAND_UP+i.CLOTH_UP+i.CLOTH_R[1]-.01)} - max(${pt(i.CLOTH_R[1]+.1)}, rD.y))) / rD;
    if (abs(q.x) < 1. && abs(q.y) < 1.) { part = 5.; nl = q * .3; thin = rT.x * rT.y / (rD.x * rD.y); fold = mix(.62 + .38 * step(0., q.y + .3 * sin(q.x * 4. + uTime * 6.)), .81, smoothstep(.07, .22, fp)); }
  }
  if (part < .5) discard;
  vec3 cloth = uPal[int(who.x + .5)] * me.z, skin = uPal[${M.SKIN} + int(mod(who.w, 4.))];
  vec3 top = bit(fl, 2.) > .5 ? uPal[${M.HEAD} + int(mod(floor(who.w / 8.), 4.))] : mix(uPal[${M.HAIR} + int(bit(who.w, 4.))] * me.w, skin * .95, baldOf(who.y / 255.));
  vec3 alb = cloth;
  if (part > 6.5) alb = uPal[${M.CHAIR}];
  else if (part > 5.5) alb = hatp > .5 ? uPal[${M.STRAW}] : uPal[${M.HEAD} + int(mod(floor(who.w / 8.), 4.))];
  else if (part > 4.5) alb = (mod(floor(who.w / 8.), 4.) < 2.5 ? uPal[${M.NAPKIN}] : cloth) * fold;
  else if (part > 3.8) alb = skin;
  else if (part > 3.2) { alb = cloth * .86; if (bit(fl, 1.) > .5 && nl.y < -.5) alb = uPal[${M.PURPLE}]; }
  else if (part > 2.5) alb = cloth;
  else if (part > 1.5) alb = mix(top, mix(skin, top, step(-.05, nl.y)), before);
  else if (bit(fl, 1.) > .5 && abs(nl.x - .3) < .16 && before > .5) alb = uPal[${M.PURPLE}];
  // (a part drawn one pixel wide: its colour at the strength of its true cover, over its bearer's cloth)
  alb = mix(cloth * .92, alb, thin);
  // each round carries its own shade: darker toward its rim, and most at its two sides, where its neighbours shut the
  // sky out (THE SHADE BETWEEN BODIES); the body is palest at the shoulders, which catch the sky
  alb *= mix(1., .62, smoothstep(.45, 1., length(nl)));
  if (part < 1.5 || (part > 2.5 && part < 3.8)) alb *= mix(1., .7, smoothstep(.55, 1., abs(nl.x))) * mix(.9, 1.04, smoothstep(-.2, .8, nl.y));
  // far off the rounds run together: the figure's mean colour, and a normal that looks at the eye and up
  // (two tones: the head's band over the body's, so that far rows still show as rows of heads over cloth; further
  // still, where a head is less than a pixel, the head's band draws toward the cloth, so that no speckle is left)
  float far = smoothstep(.07, .22, fp), vfar = smoothstep(.2, .6, fp);
  vec3 headBand = mix(mix(top, skin, .4), cloth * .8, .15 + .5 * vfar);
  if (part < 3.8) alb = mix(alb, mix(cloth * .92, headBand, smoothstep(hy - .17, hy - .07, h)), far * .85);
  vec3 Fv = F * (before * 2. - 1.);
  vec3 N = normalize(Fv * sqrt(max(1. - dot(nl, nl), .05)) + R * nl.x * -1. + vec3(0., nl.y, 0.));
  N = normalize(mix(N, normalize(Fv + vec3(0., .6, 0.)), far * .7));
  // THE SHADE OF THE ROW BEFORE: the lower body sits in it; one on his feet stands clear of it, and so does the first
  // row of a zone, which has no row before it
  // (on the podium and in a box the seats stand apart on broad platforms: little of that shade; far off, where a row is
  // a pixel or two, the shade is evened out over the figure, so that the rows do not flicker against the pixels)
  float low = smoothstep(-.1, .5, h);
  low = mix(max(low, max(chair, own) * .7), .72, far * .75); low = mix(low, 1., up * .8);
  vec3 col = litBy(alb, N, vW, vCell.w, bayU, vPl.w * mix(.5, 1., low), mix(.22, 1., low * low));
  gl_FragColor = vec4(hazed(col, vW), 1.);
}
`,Ot=`
void figureRounds(float up, float sway, out vec3 cT, out vec3 rT, out vec3 cH, out vec3 cL, out vec3 rL, out vec3 cS, out vec3 rS) {
  cT = ${P(i.BODY_C)} + vec3(sway * .02, 0., 0.); rT = mix(${Ke(i.BODY_R[0])}, ${Ke(i.BODY_R[1])}, up);
  cH = ${P(i.HEAD_C)} + vec3(sway * .035, 0., 0.);
  cL = ${P(i.LAP_C)}; rL = mix(${Ke(i.LAP_R[0])}, ${Ke(i.LAP_R[1])}, up);
  cS = ${P(i.SHIN_C)}; rS = mix(${Ke(i.SHIN_R[0])}, ${Ke(i.SHIN_R[1])}, up);
}
`,se=`
attribute vec4 aSeat;   // the seat's point and the bearing of its facing
attribute vec4 aWho;    // cloth, phase, flags, skin and group
attribute vec4 aMore;   // the bay's measure, d, how open to the sky, own floor + 2 * a movable seat
uniform float uTime;
varying vec4 vA, vB, vC, vE, vQ, vDz, vDz2, vDz3, vH, vK, vCardFl, vIdx;
varying vec4 vX, vY; varying vec3 vPlace;
${It}
${Ot}
void main() {
  float ph = aWho.y / 255., fl = aWho.z, grp = floor(aWho.w / 32.), stands = bit(fl, 16.), own = mod(aMore.w, 2.), chair = floor(aMore.w / 2.);
  vec3 S = aSeat.xyz, F = vec3(cos(aSeat.w), 0., sin(aSeat.w)), R = vec3(-F.z, 0., F.x), UP = vec3(0., 1., 0.);
  vec2 clap; vec4 doing = doingAt(aMore.x, grp, ph, fl, clap);
  float up = doing.x, arms = doing.y, cloth = doing.w, hat = bit(fl, 64.), par = bit(fl, 128.);
  vec3 cT, rT, cH, cL, rL, cS, rS; figureRounds(up, doing.z, cT, rT, cH, cL, rL, cS, rS);
  vec4 me = ownOf(ph); float sz = me.y;
  vec3 S0 = S; S -= R * me.x;
  vec3 O = S + (UP * ${pt(i.STAND_BASE[0])} + F * ${pt(i.STAND_BASE[1])}) * max(stands, own * up) * sz - UP * bobOf(ph, up);
  // the hands: together on the lap, at the sides of one who stands, up over the head, or meeting before the chest on the wedge's beat
  vec3 hDown = mix(vec3(.05, .22, .36), vec3(.23, .3, cT.z), up), hUp = vec3(.25, cH.y + ${pt(i.HAND_UP)}, cT.z);
  // (a raised arm is a stroke from the shoulder to the hand: its top is the count's, ${pt(i.HAND_UP+i.HAND_R_UP)} over the head's middle)
  vec3 cHand = mix(hDown, hUp - vec3(.04, .04, 0.), arms), rHand = mix(vec3(.06, .05, .06), vec3(.07, .24, .07), arms);
  float clapping = clap.x * (1. - arms) * (1. - up);
  cHand = mix(cHand, vec3(.04 + .13 * (.5 - .5 * clap.y), .56, .26), clapping); rHand = mix(rHand, vec3(.055, .075, .055), clapping);
  // THE CARD: about the figure's middle, square to the direction from the figure to the eye
  vec3 C0 = O + (UP * mix(.3, .42, up) + F * mix(.2, .34, up)) * sz;
  vec3 V = normalize(cameraPosition - C0);
  vec3 X = cross(UP, V); float xl = length(X); X = xl > .02 ? X / xl : R;
  vec3 Y = cross(V, X);
  float half_ = .62 + .3 * up + .32 * max(arms, cloth) + .5 * par + .14 * chair;
  vec3 wp = C0 + (X * position.x + Y * position.y) * half_;
  vCardFl = vec4(position.xy * half_, bit(fl, 1.) + ph * .5, dot(F, V));
  // each round on the card: where its middle falls, how wide and tall it shows, how far toward the eye it lies and reaches
  // (the figure's own size is laid into the three directions)
  vec3 rx0 = vec3(dot(R, X), dot(UP, X), dot(F, X)), ry0 = vec3(dot(R, Y), dot(UP, Y), dot(F, Y));
  vec3 rx = rx0 * sz, ry = ry0 * sz, rz = vec3(dot(R, V), dot(UP, V), dot(F, V)) * sz;
  vec3 o = O - C0, ox = vec3(dot(o, X), dot(o, Y), dot(o, V));
  vA = vec4(dot(cT, rx) + ox.x, dot(cT, ry) + ox.y, length(rT * rx), length(rT * ry));
  vB = vec4(dot(cH, rx) + ox.x, dot(cH, ry) + ox.y, aMore.x, aMore.y);
  vC = vec4(dot(cL, rx) + ox.x, dot(cL, ry) + ox.y, length(rL * rx), length(rL * ry));
  vE = vec4(dot(cS, rx) + ox.x, dot(cS, ry) + ox.y, length(rS * rx), length(rS * ry));
  vDz = vec4(dot(cT, rz) + ox.z, length(rT * rz), dot(cH, rz) + ox.z, ${pt(i.HEAD_R)} * sz);
  vDz2 = vec4(dot(cL, rz) + ox.z, length(rL * rz), dot(cS, rz) + ox.z, length(rS * rz));
  vDz3 = vec4(length(rHand * rx), length(rHand * ry), hat + 2. * par + 4. * own, aMore.z);
  vec3 hl = vec3(-cHand.x, cHand.y, cHand.z);
  vH = vec4(dot(cHand, rx) + ox.x, dot(cHand, ry) + ox.y, dot(hl, rx) + ox.x, dot(hl, ry) + ox.y);
  // the movable seat stays where it stands (from the seat's point, not from the one who rose)
  vec3 cq = vec3(0., -.21, -.03), rq = vec3(.2, .24, .2), oq = S0 - C0, oqx = vec3(dot(oq, X), dot(oq, Y), dot(oq, V));
  vQ = vec4(dot(cq, rx0) + oqx.x, dot(cq, ry0) + oqx.y, length(rq * rx0) * chair, length(rq * ry0) * chair);
  // the cloth one holds up: over the right hand, swinging
  vec3 cK = hUp + vec3(sin(uTime * 6. + ph * 40.) * ${pt(i.CLOTH_SWING)}, ${pt(i.CLOTH_UP-.1)}, 0.);
  vK = vec4(dot(cK, rx) + ox.x, dot(cK, ry) + ox.y, ${pt(i.CLOTH_R[0])} * cloth * sz, ${pt(i.CLOTH_R[1]+.1)} * cloth * sz);
  // or a broad hat on the head, or a parasol held over it (the deal gives nobody two of the three): one more round
  if (hat + par > .5) {
    vec3 cQ = cH + mix(vec3(0., ${pt(i.HAT_UP)}, 0.), vec3(.1, ${pt(i.PARASOL_UP)}, .04), par), rQ = mix(vec3(${pt(i.HAT_R[0])}, ${pt(i.HAT_R[1])}, ${pt(i.HAT_R[0])}), vec3(${pt(i.PARASOL_R[0])}, ${pt(i.PARASOL_R[1])}, ${pt(i.PARASOL_R[0])}), par);
    vK = vec4(dot(cQ, rx) + ox.x, dot(cQ, ry) + ox.y, length(rQ * rx), length(rQ * ry));
  }
  vIdx = vec4(aWho.x, ${M.SKIN}. + mod(aWho.w, 4.), bit(fl, 2.) > .5 ? ${M.HEAD}. + mod(floor(aWho.w / 8.), 4.) : baldOf(ph) > .5 ? ${M.SKIN}. + mod(aWho.w, 4.) : ${M.HAIR}. + bit(aWho.w, 4.),
    hat > .5 ? ${M.STRAW}. : par > .5 ? ${M.HEAD}. + mod(floor(aWho.w / 8.), 4.) : (mod(floor(aWho.w / 8.), 4.) < 2.5 ? ${M.NAPKIN}. : aWho.x));
  vX = vec4(X, up); vY = vec4(Y, arms); vPlace = C0;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
}
`,Ae=`
precision highp float;
varying vec4 vA, vB, vC, vE, vQ, vDz, vDz2, vDz3, vH, vK, vCardFl, vIdx;
varying vec4 vX, vY; varying vec3 vPlace;
uniform vec3 uPal[${g.length}];
${eo}
${wt}
void main() {
  vec2 p = vCardFl.xy;
  float purple = floor(vCardFl.z + .25), ph = (vCardFl.z - purple) * 2.;
  // A PIXEL'S FOOTPRINT on the card, in metres (taken before anything is cut away), and half of it; THE FOOTPRINT
  // FILTER as on the ribbon: the body's rounds and the seat at their true size; a head, a hand, a hat, a parasol or
  // the cloth under a pixel wide is drawn one pixel wide, its colour fallen by its true cover (thin) toward its
  // bearer's own cloth
  float fp = max(fwidth(p.x), fwidth(p.y)), hp = .5 * fp, thin = 1.;
  vec2 rT, rD;
  vec3 V = normalize(cross(vX.xyz, vY.xyz)); float up = vX.w;
  float best = -1e3, part = 0., fold = 1.; vec3 nl = vec3(0., 0., 1.); vec2 q; float d;
  // the movable seat behind all; then the body, the lap, the shins, the head: the nearest to the eye is seen
  if (vQ.z > .001) { q = (p - vQ.xy) / vQ.zw; if (abs(q.x) < 1. && abs(q.y) < 1.) { part = 7.; nl = vec3(q.x * .5, .1, .85); } }
  q = (p - vA.xy) / vA.zw; d = dot(q, q);
  if (d < 1.) { float z = sqrt(1. - d); best = vDz.x + z * vDz.y; part = 1.; nl = vec3(q, z); }
  q = (p - vC.xy) / vC.zw; d = dot(q, q);
  if (d < 1.) { float z = sqrt(1. - d), dep = vDz2.x + z * vDz2.y; if (dep > best) { best = dep; part = 3.; nl = vec3(q, z); } }
  q = (p - vE.xy) / vE.zw; d = dot(q, q);
  if (d < 1.) { float z = sqrt(1. - d), dep = vDz2.z + z * vDz2.w; if (dep > best) { best = dep; part = 3.5; nl = vec3(q, z); } }
  rT = vec2(vDz.w); rD = max(rT, vec2(hp));
  q = (p - vB.xy) / rD; d = dot(q, q);
  if (d < 1.) { float z = sqrt(1. - d), dep = vDz.z + z * vDz.w; if (dep > best) { best = dep; part = 2.; nl = vec3(q, z); thin = rT.x * rT.y / (rD.x * rD.y); } }
  // the hands: plain patches of skin, seen from before or when they are up
  vec2 hr = vDz3.xy;
  if (step(-.25, vCardFl.w) + step(hr.x * 1.6, hr.y) > .5) {
    rT = hr; rD = max(rT, vec2(hp));
    q = (p - vH.xy) / rD; d = dot(q, q); if (d < 1.) { part = 4.; nl = vec3(q, sqrt(1. - d)); thin = rT.x * rT.y / (rD.x * rD.y); }
    q = (p - vH.zw) / rD; d = dot(q, q); if (d < 1.) { part = 4.; nl = vec3(q, sqrt(1. - d)); thin = rT.x * rT.y / (rD.x * rD.y); }
  }
  // the cloth held up: a plain patch; or the hat, or the parasol: a plain round
  if (vK.z > .001) {
    rT = vK.zw; rD = max(rT, vec2(hp));
    if (mod(vDz3.z, 4.) < .5) { q = (p - vK.xy) / rD; if (abs(q.x) < 1. && abs(q.y) < 1.) { part = 5.; nl = vec3(q.x * .4, .2, .9); thin = rT.x * rT.y / (rD.x * rD.y); fold = .62 + .38 * step(0., q.y + .3 * sin(q.x * 4. + ph * 40.)); } }
    else { q = (p - vK.xy) / rD; d = dot(q, q); if (d < 1.) { part = 5.; nl = vec3(q * .55, .8); thin = rT.x * rT.y / (rD.x * rD.y); } }
  }
  if (part < .5) discard;
  vec3 cloth = uPal[int(vIdx.x + .5)] * (.84 + .19 * fract(ph * 13.7 + .21)), skin = uPal[int(vIdx.y + .5)], top = uPal[int(vIdx.z + .5)];
  if (vIdx.z > ${M.HAIR-.5} && vIdx.z < ${M.HAIR+1.5}) top *= mix(.5, 1.3, fract(ph * 23.1 + .4));
  vec3 alb = cloth;
  if (part > 6.5) alb = uPal[${M.CHAIR}];
  else if (part > 4.5) alb = uPal[int(vIdx.w + .5)] * fold;
  else if (part > 3.8) alb = skin;
  else if (part > 3.2) { alb = cloth * .86; if (purple > .5 && nl.y < -.5) alb = uPal[${M.PURPLE}]; }
  else if (part > 2.5) alb = cloth;
  else if (part > 1.5) alb = mix(skin, top, max(step(mix(-.05, -.8, clamp(V.y, 0., 1.)), nl.y), step(vCardFl.w, -.15)));
  else if (purple > .5 && abs(nl.x - .3) < .16 && vCardFl.w > 0.) alb = uPal[${M.PURPLE}];
  // (a part drawn one pixel wide: its colour at the strength of its true cover, over its bearer's cloth)
  alb = mix(cloth * .92, alb, thin);
  // each round carries its own shade: darker toward its rim, and most at its two sides, where its neighbours shut the
  // sky out (THE SHADE BETWEEN BODIES); the body is palest at the shoulders, which catch the sky
  alb *= mix(1., .62, smoothstep(.45, 1., length(nl.xy)));
  if (part < 1.5 || (part > 2.5 && part < 3.8)) alb *= mix(1., .7, smoothstep(.55, 1., abs(nl.x))) * mix(.9, 1.04, smoothstep(-.2, .8, nl.y));
  // far off the rounds run together: the figure's mean colour, and a normal that looks at the eye and up
  // (two tones: the head's band over the body's, so that far rows still show as rows of heads over cloth; further
  // still, where a head is less than a pixel, the head's band draws toward the cloth, so that no speckle is left)
  float far = smoothstep(.07, .22, fp), vfar = smoothstep(.2, .6, fp);
  vec3 headBand = mix(mix(top, skin, .4), cloth * .8, .15 + .5 * vfar);
  if (part < 3.8) alb = mix(alb, mix(cloth * .92, headBand, smoothstep(vB.y - .17, vB.y - .07, p.y)), far * .85);
  vec3 N = normalize(vX.xyz * nl.x + vY.xyz * nl.y + V * nl.z);
  N = normalize(mix(N, normalize(V + vec3(0., .6, 0.)), far * .7));
  vec3 P = vPlace + vX.xyz * p.x + vY.xyz * p.y;
  // THE SHADE OF THE ROW BEFORE: the lower body sits in it; one on his feet stands clear of it, and so does the first
  // row of a zone, which has no row before it
  // (on the podium and in a box the seats stand apart on broad platforms: little of that shade; far off, where a row is
  // a pixel or two, the shade is evened out over the figure, so that the rows do not flicker against the pixels)
  float low = smoothstep(-.42, .2, p.y);
  low = mix(max(low, max(step(.001, vQ.z), step(3.5, vDz3.z)) * .7), .72, far * .75); low = mix(low, 1., up * .8);
  vec3 col = litBy(alb, N, P, vB.w, vB.z, vDz3.w * mix(.5, 1., low), mix(.22, 1., low * low));
  gl_FragColor = vec4(hazed(col, P), 1.);
}
`;function xe(O,W){const Y=[];for(let N=0;N<=e;N++)Y.push(O.cum[N]);for(const[N,_]of O.holes)Y.push(N,_);if(W){for(const N of O.runs)Y.push(N.s0,N.s1);for(const[N,_]of O.blocks)Y.push(N,_)}Y.sort((N,_)=>N-_);const z=[];let dt=0;for(let N=0;N+1<Y.length;N++){const _=Y[N],Ft=Y[N+1];if(Ft-_<1e-6)continue;const Tt=(_+Ft)/2;for(;dt<e-1&&O.cum[dt+1]<=Tt;)dt++;const qt=O.cum[dt+1]-O.cum[dt];let Ut=!1;for(const[_t,Bt]of O.holes)if(Tt>_t&&Tt<Bt){Ut=!0;break}let it=null;if(W){for(const _t of O.runs)if(Tt>_t.s0&&Tt<_t.s1){it=_t;break}}z.push({u:_,v:Ft,f0:dt+Math.max(0,(_-O.cum[dt])/qt),f1:dt+Math.min(1,(Ft-O.cum[dt])/qt),hole:Ut,run:it})}return z}const Ye=(O,W)=>({pos:new Float32Array(O*3),cell:new Float32Array(O*4),pl:new Float32Array(O*4),inn:new Float32Array(O*2),idx:new Uint32Array(W),n:0,ni:0,cv:O,ci:W});function Pe(O,W,Y){if(O.n+W>O.cv){const z=O.cv*2;for(const[dt,N]of[["pos",3],["cell",4],["pl",4],["inn",2]]){const _=new Float32Array(z*N);_.set(O[dt]),O[dt]=_}O.cv=z}if(O.ni+Y>O.ci){const z=O.ci*2,dt=new Uint32Array(z);dt.set(O.idx),O.idx=dt,O.ci=z}}function ze(O,W,Y,z,dt,N,_,Ft,Tt,qt,Ut,it,_t,Bt){const Nt=O.n,Ht=Nt*3,ft=Nt*4,Pt=Nt*2;return O.pos[Ht]=W,O.pos[Ht+1]=Y,O.pos[Ht+2]=z,O.cell[ft]=dt,O.cell[ft+1]=N,O.cell[ft+2]=_,O.cell[ft+3]=Ft,O.pl[ft]=Tt,O.pl[ft+1]=qt,O.pl[ft+2]=Ut,O.pl[ft+3]=it,O.inn[Pt]=_t,O.inn[Pt+1]=Bt,O.n=Nt+1,Nt}function ao(O,W,Y,z,dt,N,_){const Ft=O.ni;O.idx[Ft]=W,O.idx[Ft+1]=Y,O.idx[Ft+2]=z,O.idx[Ft+3]=dt,O.idx[Ft+4]=N,O.idx[Ft+5]=_,O.ni=Ft+6}function so(O,W,Y,z,dt,N){let _=-1,Ft=0,Tt=null;const qt=[0,0],Ut=[0,0],it=(_t,Bt,Nt)=>{p(z[0],_t,qt),p(dt[0],_t,Ut);const Ht=_t/e*o,ft=Math.cos(Ht),Pt=Math.sin(Ht);let te=-ft/W.a,ce=-Pt/W.b;const _e=Math.hypot(te,ce);te/=_e,ce/=_e;const Oe=N.people&&Nt?Nt.k0+(Bt-Nt.s0)/Nt.pitch:-1,ne=N.people&&Nt?Nt.pitch:1,fe=_t*s.BAYS/e;Pe(O,2,6);const be=ze(O,qt[0],z[1],qt[1],N.id,ne,N.code,N.dA,Oe,N.locA,fe,N.aoA,te,ce);return ze(O,Ut[0],dt[1],Ut[1],N.id,ne,N.code,N.dB,Oe,N.locB,fe,N.aoB,te,ce),be};for(const _t of Y){if(N.cut&&_t.hole||N.runsOnly&&!_t.run){_=-1;continue}const Bt=N.people?_t.run:null,Nt=_>=0&&Tt===Bt&&Math.abs(Ft-_t.u)<1e-5?_:it(_t.f0,_t.u,_t.run),Ht=it(_t.f1,_t.v,_t.run);ao(O,Nt,Nt+1,Ht,Nt+1,Ht+1,Ht),Ft=_t.v,Tt=Bt,_=Ht}}function Je(O,W,Y,z,dt){Pe(O,4,6);const N=O.n;for(let _=0;_<4;_++)ze(O,W[_][0],W[_][1],W[_][2],Y[0],Y[1],Y[2],Y[3],z[_][0],z[_][1],z[_][2],z[_][3],dt[0],dt[1]);ao(O,N,N+1,N+2,N,N+2,N+3)}async function io(O,W,Y={}){const z=new U.Group;z.name="flavian-amphitheatre-seating";const dt={triangles:0,calls:0,pieces:{},people:{}},N=()=>O.yield(),_=Y.U||{},Ft=No(Po("amphitheatre-seating:"+O.seed)),Tt=No(Po("amphitheatre-seating-clock:"+O.seed)),qt=new U.Vector4(Tt(),Tt()<.5?-1:1,Math.floor(Tt()*97),0);await N();let Ut;{const B=y(r.PITCH);let Dt=B.next();for(;!Dt.done;)await N(),Dt=B.next();Ut=Dt.value}await N();const it=await pe(Ut,Ft,{seed:O.seed,density:Y.density??1,rare:!!Y.rare,sunV:Y.sunV,draw:Y.draw},N);await N();const _t=await Le(Ut,it,N);await N();const Bt=Math.ceil(Ut.maxPlaces/64)*64,Nt=Ut.lines.length,Ht=new Uint8Array(Bt*Nt*4);for(let B=0;B<it.places;B++){const Dt=(it.lineOf[B]*Bt+it.kOf[B])*4,jt=B*4;Ht[Dt]=it.who[jt],Ht[Dt+1]=it.who[jt+1],Ht[Dt+2]=it.who[jt+2],Ht[Dt+3]=it.who[jt+3]}const ft=new U.DataTexture(Ht,Bt,Nt,U.RGBAFormat,U.UnsignedByteType);ft.minFilter=U.NearestFilter,ft.magFilter=U.NearestFilter,ft.generateMipmaps=!1,ft.needsUpdate=!0;const Pt=[],te=new Float32Array(C.SHOWERS*16),ce=new U.Vector4(0,0,0,0);for(let B=0;B<C.SHOWERS;B++)Pt.push(new U.Vector4(1,0,0,0));let _e=0;if(await(O.frame?O.frame():N()),typeof mo<"u"&&mo&&mo.arenaPlan&&mo.AR){const B=mo.arenaPlan(O.core||{makeRng:No,hashSeed:Po},O.seed,{density:Y.density,detail:Y.detail}),Dt=mo.AR;(B.showers||[]).slice(0,C.SHOWERS).forEach((jt,Qt)=>{if(!(!(jt.period>0)||!jt.wedges||jt.wedges.length!==16)){Pt[Qt].set(jt.period,jt.offset,1,0);for(let ye=0;ye<16;ye++)te[Qt*16+ye]=jt.wedges[ye];_e++}}),ce.set(Dt.BALL_WEDGE??.1,(Dt.BALL_THROW??3)+(Dt.BALL_FLY?Dt.BALL_FLY[1]:2.5),0,0)}await N();const Oe={..._,tSeats:{value:ft},uPal:{value:g.map(B=>new U.Color(B))},uCrowd:{value:qt},uShower:{value:Pt},uShowerWedge:{value:te},uShowerLaw:{value:ce}};await N();const ne=De,fe=Ut.lines,be=fe.filter(B=>B.oval);let re=Ye(8e4,16e4);const me=B=>.75+(.45-.75)*Math.min(1,Math.max(0,(B-s.GAL_D0)/(s.GAL_D1-s.GAL_D0)));for(const B of be){if(B.stand)continue;const Dt=B.group,jt=Dt===l.GALLERY,Qt=B.tread,ye=B.riser,Ze=xe(B,!0),Ao=xe(B,!1),Xe=jt?me(Qt[0]):(Dt===l.PODIUM,1),Qe=jt?me(Qt[1]):Dt===l.PODIUM?.85:1;so(re,B,Ze,[Qt[0],Qt[2]],[Qt[1],Qt[2]],{id:B.id,code:K.TREAD*8+Dt,dA:B.d,dB:B.d,locA:Qt[0]-B.d,locB:Qt[1]-B.d,aoA:Xe,aoB:Qe,people:!0,cut:!0}),await N();const n=jt?me(ye[0]):Dt===l.PODIUM?.92:1;so(re,B,Ao,[ye[0],ye[1]],[ye[0],ye[2]],{id:-1,code:K.RISER*8+Dt,dA:ye[0],dB:ye[0],locA:0,locB:ye[2]-ye[1],aoA:n,aoB:n,people:!1,cut:!0}),await N()}{const B=fe.find(jt=>jt.stand),Dt=xe(B,!1);so(re,B,Dt,[s.GAL_D1,s.GAL_TOP],[s.STAND_D1,s.GAL_TOP],{id:-1,code:K.FLOOR*8+l.STANDING,dA:s.GAL_D1,dB:s.STAND_D1,locA:0,locB:0,aoA:.45,aoB:.35,people:!1,cut:!1})}await N();const ve=(B,Dt,jt)=>{const Qt=p(B,Dt);return[Qt[0],jt,Qt[1]]};for(let B=0;B<2;B++){const Dt=B===0?ne.rows1:ne.rows2,jt=B===0?l.FIRST:l.SECOND;for(const Qt of Ut.mouths[B]){const ye=Qt.r0,Ze=ye+r.MOUTH_ROWS-1,Ao=Dt[ye-1].y,Xe=Dt[ye].d0,Qe=Dt[Ze].d1,n=r.MOUTH_STEPS,f=r.MOUTH_DROP/n,w=Ao-r.MOUTH_DROP,u=Qt.fc*s.BAYS/e,S=Qt.fc/e*o,D=_o((Xe+Qe)/2),H=To((Xe+Qe)/2);let Z=-Math.cos(S)/D,lt=-Math.sin(S)/H;const ut=Math.hypot(Z,lt);Z/=ut,lt/=ut;let Q=-D*Math.sin(S),k=H*Math.cos(S);const mt=Math.hypot(Q,k);Q/=mt,k/=mt;for(let St=0;St<n;St++){const x=Xe+(Qe-Xe)*St/n,nt=Xe+(Qe-Xe)*(St+1)/n,vt=Ao-St*f,J=St/n,At=(St+1)/n;Je(re,[ve(x,Qt.fa,vt),ve(x,Qt.fb,vt),ve(nt,Qt.fb,vt),ve(nt,Qt.fa,vt)],[-1,1,K.WELL_TREAD*8+jt,x],[[-1,J,u,1],[-1,J,u,1],[-1,At,u,1],[-1,At,u,1]],[Z,lt]),St<n-1&&Je(re,[ve(nt,Qt.fa,vt-f),ve(nt,Qt.fb,vt-f),ve(nt,Qt.fb,vt),ve(nt,Qt.fa,vt)],[-1,1,K.WELL_RISER*8+jt,nt],[[-1,At,u,1],[-1,At,u,1],[-1,At,u,1],[-1,At,u,1]],[-Z,-lt])}for(let St=ye;St<=Ze;St++){const x=Dt[St],nt=(x.d0-Xe)/(Qe-Xe),vt=(x.d1-Xe)/(Qe-Xe);Je(re,[ve(x.d0,Qt.fa,w),ve(x.d1,Qt.fa,w),ve(x.d1,Qt.fa,x.y),ve(x.d0,Qt.fa,x.y)],[-1,1,K.WELL_CHEEK*8+jt,x.d0],[[-1,nt,u,1],[-1,vt,u,1],[-1,vt,u,1],[-1,nt,u,1]],[Q,k]),Je(re,[ve(x.d0,Qt.fb,w),ve(x.d1,Qt.fb,w),ve(x.d1,Qt.fb,x.y),ve(x.d0,Qt.fb,x.y)],[-1,1,K.WELL_CHEEK*8+jt,x.d0],[[-1,nt,u,1],[-1,vt,u,1],[-1,vt,u,1],[-1,nt,u,1]],[-Q,-k])}const ct=Ao-(n-1)*f,yt=Dt[Ze].y-ct;Je(re,[ve(Qe,Qt.fa,ct),ve(Qe,Qt.fb,ct),ve(Qe,Qt.fb,Dt[Ze].y),ve(Qe,Qt.fa,Dt[Ze].y)],[-1,yt,K.DOOR*8+jt,Qe],[[-1,0,u,1],[1,0,u,1],[1,yt,u,1],[-1,yt,u,1]],[Z,lt]),Qt.bay%16<2&&await N()}await N()}const Fe=async B=>{const Dt=new U.BufferGeometry;return Dt.setAttribute("position",new U.BufferAttribute(B.pos.slice(0,B.n*3),3)),await N(),Dt.setAttribute("aCell",new U.BufferAttribute(B.cell.slice(0,B.n*4),4)),await N(),Dt.setAttribute("aPl",new U.BufferAttribute(B.pl.slice(0,B.n*4),4)),await N(),Dt.setAttribute("aIn",new U.BufferAttribute(B.inn.slice(0,B.n*2),2)),await N(),Dt.setIndex(new U.BufferAttribute(B.idx.slice(0,B.ni),1)),Dt},Re=(B,Dt,jt)=>(Dt.name=B,Dt.frustumCulled=!1,Dt.matrixAutoUpdate=!1,Dt.updateMatrix(),z.add(Dt),dt.triangles+=jt,dt.calls+=1,dt.pieces[B]=jt,Dt),ue=new U.ShaderMaterial({uniforms:Oe,vertexShader:Vt,fragmentShader:Xt,side:U.DoubleSide});Re("steps",new U.Mesh(await Fe(re),ue),re.ni/3),await N(),re.n=0,re.ni=0;for(const B of fe){const Dt=B.own||B.stand?1:0,jt=i.RIBBON_TOP+Dt*i.STAND_BASE[0],Qt=B.group+(B.chair?8:0)+Dt*64,ye=B.group===l.GALLERY?me(B.d):B.group===l.STANDING?.4:1;if(B.oval)so(re,B,xe(B,!0),[B.d,B.floorY],[B.d,B.seatY+jt],{id:B.id,code:Qt,dA:B.d,dB:B.d,locA:B.floorY-B.seatY,locB:jt,aoA:ye,aoB:ye,people:!0,cut:!0,runsOnly:!0});else{const Ze=B.sgn>0?s.BAYS/4:3*s.BAYS/4;Je(re,[[B.x0,B.floorY,B.z],[B.x1,B.floorY,B.z],[B.x1,B.seatY+jt,B.z],[B.x0,B.seatY+jt,B.z]],[B.id,B.pitch,Qt,B.d],[[0,B.floorY-B.seatY,Ze,1],[B.n,B.floorY-B.seatY,Ze,1],[B.n,jt,Ze,1],[0,jt,Ze,1]],[0,-B.sgn])}await N()}const ge=new U.ShaderMaterial({uniforms:Oe,vertexShader:Vt,fragmentShader:Kt,side:U.DoubleSide});Re("ribbons",new U.Mesh(await Fe(re),ge),re.ni/3),await N();const Te=_t.near,ke=new Float32Array(Te*4),lo=new Uint8Array(Te*4),fo=new Float32Array(Te*4);await N();{let B=0;for(let Dt=0;Dt<it.places;Dt++){const jt=Dt*4;if(!it.who[jt]||!(it.who[jt+2]&Lt.NEAR))continue;const Qt=fe[it.lineOf[Dt]];ke[B]=it.pos[jt],ke[B+1]=it.pos[jt+1],ke[B+2]=it.pos[jt+2],ke[B+3]=it.pos[jt+3],lo[B]=it.who[jt],lo[B+1]=it.who[jt+1],lo[B+2]=it.who[jt+2],lo[B+3]=it.who[jt+3],fo[B]=it.more[jt],fo[B+1]=it.more[jt+1],fo[B+2]=Qt.group===l.GALLERY?me(Qt.d):Qt.group===l.STANDING?.4:1,fo[B+3]=(Qt.own?1:0)+(Qt.chair?2:0),B+=4,Dt%1e3===999&&await N()}}if(Te>0){const B=new U.InstancedBufferGeometry;B.setAttribute("position",new U.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),B.setIndex([0,1,2,0,2,3]),B.setAttribute("aSeat",new U.InstancedBufferAttribute(ke,4)),B.setAttribute("aWho",new U.InstancedBufferAttribute(lo,4)),B.setAttribute("aMore",new U.InstancedBufferAttribute(fo,4)),B.instanceCount=Te,await N();const Dt=new U.ShaderMaterial({uniforms:Oe,vertexShader:se,fragmentShader:Ae});Re("cards",new U.Mesh(B,Dt),Te*2)}await N();const Oo=d.map(()=>0);for(const B of fe)Oo[B.group]+=B.n;return dt.people={pitch:Ut.pitch,places:it.places,taken:it.taken,share:I(Y.density??1),placesByZone:Object.fromEntries(d.map((B,Dt)=>[B,Oo[Dt]])),takenByZone:Object.fromEntries(d.map((B,Dt)=>[B,_t.takenBy[Dt]])),sitting:it.taken-_t.takenBy[l.STANDING],standing:_t.takenBy[l.STANDING],cards:_t.near,cardsByZone:Object.fromEntries(d.map((B,Dt)=>[B,_t.nearBy[Dt]])),nearMetres:r.NEAR,leftEmptyByTheOffLaw:it.emptiedByOff,leastToHighestReach:Object.fromEntries(d.map((B,Dt)=>[B,_t.least[Dt]>1e8?null:+_t.least[Dt].toFixed(2)])),offMetres:r.OFF,lines:fe.length,mouths:Ut.mouths[0].length+Ut.mouths[1].length,crowdClock:[qt.x,qt.y,qt.z],showersAnswered:_e},{object:z,info:dt,update(){},dispose(){ft.dispose();for(const B of z.children)B.geometry.dispose(),B.material.dispose()}}}return{READY:!0,SEAT:r,FIG:i,REACH_BUILT:h,knotAt:p,GROUP_NAME:d,makePlan:L,placeAt:E,sunShare:ot,PALETTE:g,PAL:M,FLAG:Lt,dressOf:bt,clothOf:Ee,chanceOfSeating:Zt,wedgeOf:he,guestShare:oe,fullShare:I,flownLine:ie,leastToReach:Mt,dealSeats:pe,lawOfPlace:Le,peopleOfSeating:Ue,MOTION:C,buildSeating:io}})(),mo=(()=>{const o=Math.PI*2,e=(n,f,w)=>{const u=Math.min(1,Math.max(0,(w-n)/(f-n)));return u*u*(3-2*u)},t={BOAT_L:8.5,BOAT_B:2.1,BOAT_LS:[9.5,12,9],BOAT_BS:[2.2,2.5,2.1],ROW_N:[6,8,6],ROW_AFT:[1.7,2.3,1.7],ROW_PITCH:.8,SIDE_N:3,WEST_X:3.5,PITCH:8.5,LIE:{HEAD:85*He,HEAD_APART:12*He,MID:7.3,WALL:[2.15,1,1.35],X:[-3,30],LEDGE:1,CLEAR:[1.5,.6],KEEP:{D:20.5,DT:20.2,Y0:17.85,S:.5206},NQ:12,DIRS:72,PERIOD:[9,13],DRIFT:[.3,.45],YAW:[2.75*He,3.75*He],SURGE:.5,YAW2:.25,SETS:[[0,[2.2,17.75,84],[14.3,13.75,-21],[25.2,12,-57]],[0,[2.2,17.75,84],[12.9,14,58],[25.1,11.75,-76]],[0,[4.2,16.5,-44],[14.4,13.5,-30],[25.5,12,-59]],[0,[3.9,16.5,-47],[14.2,13.75,-23],[23.5,11.75,72]],[0,[3.9,16.5,-47],[13.9,13.75,-17],[25,12,-62]],[2,[2.3,17.75,83],[14.3,13.75,-23],[25.4,12,-60]],[2,[2.2,17.75,84],[13.8,13.75,-17],[24.7,12.25,-62]],[2,[2.2,17.75,84],[13.8,13.75,-20],[22.8,11.75,67]],[2,[3.7,16.75,-48],[13.8,13.5,-29],[25.2,12,-64]],[2,[3.6,16.75,-49],[13.7,13.75,-21],[23,11.75,70]]],STEPS:36,STEP:[1,.75,10*He]},BEAT_PERIOD:[3,3.8],SEAT_Y:.3,SEAT_Z:.42,ROWER_TOP:1.22,DECK_Y:.45,STEER_AFT:1,STEER_TOP:.45+1.72,OAR_OUT:2.55,OAR_IN:.62,OAR_Y:.5,OAR_HALF:.032,BLADE_L:.8,BLADE_HALF:.13,SWEEP:22*He,DIP_IN:15*He,DIP_OUT:7*He,LEAN0:.1,LEAN1:.3,STREAM_L:3,STREAM_W:[.26,.09],STREAM_SEG:8,STREAM_OUT:[.93,.05],STREAM_WAVE:[.05,.3],POST_STERN:3,POST_STEM:2.15,OUTER_RX:9.5,OUTER_RZ:15.5,OUTER_HORSES:3,OUTER_BULLS:3,OUTER_SPEED:.95,BULL_STRIDE:1.6,HORSE_H:1.5,BULL_H:1.45,FREE_N:10,FREE_X:-15.5,FREE_Z:0,FREE_RX:6.5,FREE_RZ:12.5,FREE_SPEED:1.05,STRIDE:1.9,FREE_GAP_DEAL:.12,FREE_COATS:[6,22,10,14,23,9,25,15,24,16],STAND_CLEAR_WALK:3.2,STAND_CLEAR_RING:5.5,STAND_CLEAR_EACH:4.2,STAND_TRIES:240,STAND_DEALS:64,STAND_LATTICE:.25,REAR_N:2,REAR_PERIOD:13,REAR_UP:.9,REAR_HOLD:2.4,REAR_DOWN:.7,REAR_ANGLE:50*He,REAR_PIVOT:[-.58,.98],SHAKE_PERIOD:[6.5,9],SHAKE_LASTS:1.25,WEST_HANDLERS:6,WEST_Z:[3.2,9.4],EAST_HANDLERS:11,EAST_X:30,STAND_SHARE:[.15,.85],PERSON_H:1.72,BALL_SLOTS:3,BALLS:34,BALL_PERIOD:[7.5,11.5],BALL_THROW:3.2,BALL_FLY:[2,2.6],BALL_R:.07,BALL_STROKE:.045,BALL_WEDGE:5.5*He,BALL_AXIS_OFF:7*He,BALL_D:[6.6,30.5],BALL_G:9.81,SPRAY_SHAKE:30,SHAKE_FLY:.62},r=(()=>{const n=Math.hypot(to.DRIFT[0],to.DRIFT[1]);return[to.DRIFT[0]/n,to.DRIFT[1]/n]})();function i(n,f,w=[0,0,0]){if(n.mode>1.5){const u=n.a0+n.w*f,S=Math.cos(u),D=Math.sin(u);w[0]=n.cx+n.r*S,w[1]=n.cz+n.r*n.p1*D,w[2]=Math.atan2(n.p1*S*n.p0,-D*n.p0)}else if(n.mode>.5){const u=n.w*f+n.p0,S=-.5*n.r*Math.cos(u),D=t.LIE.SURGE*n.r*Math.sin(u+2);w[0]=n.cx+r[0]*S+Math.cos(n.a0)*D,w[1]=n.cz+r[1]*S+Math.sin(n.a0)*D,w[2]=n.a0+n.p1*(Math.sin(u+1.1)+t.LIE.YAW2*Math.sin(2*u+.5))}else{const u=n.a0+n.w*f;w[0]=n.cx+n.r*Math.cos(u),w[1]=n.cz+n.r*Math.sin(u),w[2]=u+n.p0}return w}function h(n,f){if(n.mode>.5||!(n.p1>.5))return 0;const w=((f+(n.p1-1)*t.REAR_PERIOD)%t.REAR_PERIOD+t.REAR_PERIOD)%t.REAR_PERIOD;return e(0,t.REAR_UP,w)*(1-e(t.REAR_UP+t.REAR_HOLD,t.REAR_UP+t.REAR_HOLD+t.REAR_DOWN,w))}function c(n,f,w,u,S,D=[0,0,0]){const H=i(n,f),Z=Math.cos(H[2]),lt=Math.sin(H[2]);return D[0]=H[0]+w*Z-S*lt,D[1]=s.WATER_Y+u,D[2]=H[1]+w*lt+S*Z,D}function A(n){const f=De;return n<f.Z1_D1?f.Z1_Y0+(Math.max(n,f.Z1_D0)-f.Z1_D0)*s.ROW_H/s.ROW_D:n<f.Z2_D0?f.Z1_Y1:f.Z2_Y0+(Math.min(n,f.Z2_D1)-f.Z2_D0)*s.ROW_H/s.ROW_D}const p=s.RING_DEPTH_B/s.RING_DEPTH,l=(n,f)=>[(s.ARENA_A+n)*Math.cos(f),(s.ARENA_B+p*n)*Math.sin(f)];function d(n){const f=Lt(n),w=[],u=f.STEM[f.STEM.length-1],S=f.STERN[f.STERN.length-1],D=xo.STAND+xo.ARM,H=n.B/2+t.OAR_OUT,Z=Math.sin(t.SWEEP)*t.OAR_OUT,lt=n.thwarts[n.thwarts.length-1],ut=n.thwarts[0];w.push([u[0],0,u[1],.15,0,2],[S[0],0,S[1],.15,0,2],[S[0],0,S[1],t.STREAM_L,3,2]);for(const Q of[-1,1])w.push([lt-Z,Q*H,t.OAR_Y+.2,.3,1,1],[ut+Z,Q*H,t.OAR_Y+.2,.3,1,1]);w.push([n.steer,0,t.DECK_Y+D,.5,2,0]);for(const Q of n.thwarts)for(const k of[-1,1])w.push([Q,k*t.SEAT_Z,t.SEAT_Y+D,.35,2,0]);for(const Q of f.ST)w.push([Q[0],Q[1],Q[2],.15,0,0]),Q[1]>0&&w.push([Q[0],-Q[1],Q[2],.15,0,0]);for(const Q of[f.STEM,f.STERN])for(let k=0;k+1<Q.length;k++)w.push([Q[k][0],0,Q[k][1],.15,0,2]);return w.push([-n.L/2-.7,1.36,.2,.1,0,2]),w}const R=(()=>{const n=t.LIE.DIRS,f=new Float64Array(n),w=new Float64Array(n);for(let u=0;u<n;u++)f[u]=Math.cos(u*o/n),w[u]=Math.sin(u*o/n);return{c:f,s:w}})(),m=(()=>{const n=(s.WATER_A+s.ARENA_A)/2,f=(s.WATER_B+s.ARENA_B)/2,w=f*Math.sqrt(1-t.EAST_X/n*(t.EAST_X/n)),u=w*(1-2*t.STAND_SHARE[0]/t.EAST_HANDLERS);return{LA:n,LB:f,zE:w,E:[n*Math.sqrt(1-u/f*(u/f)),u]}})(),T=[t.STREAM_L*(t.STREAM_OUT[0]+t.STREAM_OUT[1]),t.STREAM_WAVE[0]+t.STREAM_WAVE[1]];function v(n,f){const w=n+r[0]*T[0],u=f+r[1]*T[0],S=T[1]*Math.abs(r[1]),D=T[1]*Math.abs(r[0]),H=Math.min(n,w)-S,Z=Math.max(n,w)+S,lt=Math.min(f,u)-D,ut=Math.max(f,u)+D,Q=m,k=Math.max(Math.hypot(H/Q.LA,lt/Q.LB),Math.hypot(Z/Q.LA,lt/Q.LB),Math.hypot(H/Q.LA,ut/Q.LB),Math.hypot(Z/Q.LA,ut/Q.LB));return Math.max(Math.hypot(Math.max(0,Q.E[0]-Z),Math.max(0,lt-Q.E[1],-Q.E[1]-ut)),(1-k)*Math.min(Q.LA,Q.LB))}function L(n){const f=n.thing,w=t.LIE,u=w.KEEP,S=n.pts||(n.pts=d(n)),D=[0,0,0],H=o/f.w,Z=1+u.S*u.S,lt=n.sw||(n.sw=[]);lt.length=0,n.sup=null;for(let ut=0;ut<w.NQ;ut++){i(f,ut/w.NQ*H-f.p0/f.w,D);const Q=Math.cos(D[2]),k=Math.sin(D[2]);for(const mt of S){const ct=D[0]+mt[0]*Q-mt[1]*k,yt=D[1]+mt[0]*k+mt[1]*Q;if(mt[4]<1.5){const nt=s.WATER_A-w.WALL[mt[5]],vt=s.WATER_B-w.WALL[mt[5]];if(ct/nt*(ct/nt)+yt/vt*(yt/vt)>1||Math.abs(yt)<w.MID||ct<w.X[0]||ct>w.X[1])return!1;lt.push(mt[4],ct,yt)}else if(mt[4]>2.5&&v(ct,yt)<w.LEDGE)return!1;const St=u.Y0+u.S*ct-mt[2],x=(mt[4]>1.5&&mt[4]<2.5?u.D:u.DT)+mt[3];if(yt*yt+St*St/Z<x*x)return!1}}return!0}function y(n,f){const w=t.LIE.DIRS,u=R;for(const D of[n,f])if(!D.sup){const H=D.sup=[new Float64Array(w).fill(-1/0),new Float64Array(w).fill(-1/0)],Z=D.sw;for(let lt=0;lt<Z.length;lt+=3){const ut=H[Z[lt]],Q=Z[lt+1],k=Z[lt+2];for(let mt=0;mt<w;mt++){const ct=Q*u.c[mt]+k*u.s[mt];ct>ut[mt]&&(ut[mt]=ct)}}}let S=1/0;for(let D=0;D<2;D++)for(let H=0;H<2;H++){const Z=n.sup[D],lt=f.sup[H];let ut=-1/0;for(let Q=0;Q<w;Q++){const k=-lt[(Q+w/2)%w]-Z[Q];k>ut&&(ut=k)}ut-=t.LIE.CLEAR[D+H>0?1:0],ut<S&&(S=ut)}return S}function E(n,f){const w=t.LIE;f.lie={kept:0,set:[]};const u=(S,D,H,Z,lt)=>{S.x=H,S.off=Z,S.head=lt,S.thing.cx=H,S.thing.cz=D*Z,S.thing.a0=-D*(90*He+lt)};for(let S=0;S<2;S++){const D=S===0?-1:1,H=w.SETS[Math.min(w.SETS.length-1,Math.floor(n()*w.SETS.length))],Z=[];f.lie.set.push(w.SETS.indexOf(H));for(const[lt,ut]of[[1,H[0]],[2,1],[3,2-H[0]]]){const Q=t.BOAT_LS[ut],k=t.BOAT_BS[ut],mt=[];for(let yt=t.ROW_N[ut]-1;yt>=0;yt--)mt.push(-Q/2+t.ROW_AFT[ut]+yt*t.ROW_PITCH);const ct={side:S,i:ut,L:Q,B:k,thwarts:mt,steer:-Q/2+t.STEER_AFT};ct.thing={cx:0,cz:0,r:n.range(...w.DRIFT),a0:0,w:o/n.range(...w.PERIOD),mode:1,p0:n()*o,p1:(n()<.5?-1:1)*n.range(...w.YAW)},u(ct,D,H[lt][0],H[lt][1],H[lt][2]*He),L(ct),Z.push(ct)}for(let lt=0;lt<w.STEPS;lt++){const ut=Z[Math.min(2,Math.floor(n()*3))],Q=[ut.x,ut.off,ut.head],k=ut.sw,mt=ut.sup;ut.sw=null;const ct=ut.x+n.range(-w.STEP[0],w.STEP[0]),yt=ut.off+n.range(-w.STEP[1],w.STEP[1]),St=Math.max(-w.HEAD,Math.min(w.HEAD,ut.head+n.range(-w.STEP[2],w.STEP[2])));u(ut,D,ct,yt,St),Z.every(x=>x===ut||Math.abs(x.head-St)>=w.HEAD_APART)&&L(ut)&&Z.every(x=>x===ut||y(x,ut)>=0)?f.lie.kept++:(u(ut,D,Q[0],Q[1],Q[2]),ut.sw=k,ut.sup=mt)}Z.sort((lt,ut)=>lt.i-ut.i);for(const lt of Z)f.boats.push({side:S,thing:lt.thing,L:lt.L,B:lt.B,thwarts:lt.thwarts,steer:lt.steer,beat:o/n.range(...t.BEAT_PERIOD),beatPhase:n()*o,crew:n.int(0,3)})}}function b(n,f,w={}){const u=k=>n.makeRng(n.hashSeed("amphitheatre-"+k+":"+f)),S={boats:u("arena-boats"),beasts:u("arena-beasts"),free:u("arena-free"),stands:u("arena-stands"),rear:u("arena-rear"),handlers:u("arena-handlers"),balls:u("arena-balls"),spray:u("arena-spray")},D=Math.min(1.3,Math.max(.7,w.density??1)),H=Math.min(1,Math.max(.5,w.detail??1)),Z={seed:f,density:D,detail:H,boats:[],beasts:[],handlers:[],showers:[],balls:[],spray:[]};E(S.boats,Z);const lt={outer:S.beasts.shuffle([19,20,21]),rear:[17,18],shake:5},ut={outer:S.beasts.shuffle([4,6,7]),stand:5},Q=S.free.sign();{const k=S.beasts,mt=t.OUTER_HORSES+t.OUTER_BULLS,ct=-Q,yt=k()*o,St=[];for(let x=0;x<mt;x++)St.push(x<t.OUTER_HORSES?"horse":"bull");k.shuffle(St);for(let x=0;x<mt;x++){const nt={cx:t.FREE_X,cz:t.FREE_Z,r:t.OUTER_RX,a0:yt+(x+k.range(-.12,.12))*o/mt,w:ct*t.OUTER_SPEED/Math.max(t.OUTER_RX,t.OUTER_RZ),mode:2,p0:ct,p1:t.OUTER_RZ/t.OUTER_RX},vt=St[x],J=vt==="horse"?lt.outer.pop():ut.outer.pop();Z.beasts.push({kind:vt,gait:"walk",thing:nt,free:!0,scale:k.range(.96,1.06),coat:J,ph:k()*o,pace:2*o*t.OUTER_SPEED/(vt==="horse"?t.STRIDE:t.BULL_STRIDE)+k.range(-.3,.3),shaker:0,rear:0,turn:ct,handler:null})}}{const k=S.free,mt=Q,ct=k()*o,yt=t.FREE_N;for(let $=0;$<yt;$++){const st={cx:t.FREE_X,cz:t.FREE_Z,r:t.FREE_RX,a0:ct-mt*($+k.range(-t.FREE_GAP_DEAL,t.FREE_GAP_DEAL))*o/yt,w:mt*t.FREE_SPEED/Math.max(t.FREE_RX,t.FREE_RZ),mode:2,p0:mt,p1:t.FREE_RZ/t.FREE_RX};Z.beasts.push({kind:"horse",gait:"walk",thing:st,free:!0,scale:k.range(.96,1.06),coat:t.FREE_COATS[$%t.FREE_COATS.length],ph:k()*o,pace:2*o*t.FREE_SPEED/t.STRIDE+k.range(-.3,.3),shaker:0,rear:0,turn:mt,handler:null})}const St=[0,1,2,3].map($=>({facing:k()*o,scale:k.range(.98,1.06),ph:k()*o,period:$===2?k.range(...t.SHAKE_PERIOD):0})),x=[];for(let $=0;$<720;$++){const st=$*o/720;x.push(t.FREE_X+t.FREE_RX*Math.cos(st),t.FREE_Z+t.FREE_RZ*Math.sin(st))}const nt=($,st)=>Math.hypot(($-t.FREE_X)/t.FREE_RX,(st-t.FREE_Z)/t.FREE_RZ),vt=($,st)=>{const xt=1-nt($,st),Et=t.STAND_CLEAR_WALK;if(xt*Math.min(t.FREE_RX,t.FREE_RZ)>=Et)return!0;if(xt*Math.max(t.FREE_RX,t.FREE_RZ)<Et)return!1;for(let ee=0;ee<x.length;ee+=2){const Yt=$-x[ee],$t=st-x[ee+1];if(Yt*Yt+$t*$t<Et*Et)return!1}return!0},J=($,st)=>nt($,st)<1&&Math.hypot($-s.RING[0],st-s.RING[2])>=t.STAND_CLEAR_RING&&vt($,st),At=($,st)=>st.reduce((xt,Et)=>Math.min(xt,Math.hypot($[0]-Et[0],$[1]-Et[1])),1/0),Jt=S.stands,le=()=>[t.FREE_X+Jt.range(-t.FREE_RX,t.FREE_RX),t.FREE_Z+Jt.range(-t.FREE_RZ,t.FREE_RZ)],We=[];let V=[];for(let $=0;$<t.STAND_DEALS&&V.length<4;$++){V=[];for(let st=0;st<4&&V.length===st;st++)for(let xt=0;xt<t.STAND_TRIES&&V.length===st;xt++){const Et=le();We[st]=Et,J(Et[0],Et[1])&&At(Et,V)>=t.STAND_CLEAR_EACH&&V.push(Et)}}if(V.length<4){const $=[],st=[];for(let Et=t.FREE_X-t.FREE_RX;Et<=t.FREE_X+t.FREE_RX;Et+=t.STAND_LATTICE)for(let ee=t.FREE_Z-t.FREE_RZ;ee<=t.FREE_Z+t.FREE_RZ;ee+=t.STAND_LATTICE)nt(Et,ee)<1&&($.push([Et,ee]),J(Et,ee)&&st.push([Et,ee]));const xt=st.length?st:$.length?$:[[t.FREE_X,t.FREE_Z]];V=[];for(let Et=0;Et<4;Et++){const ee=We[Et]||le();let Yt=null,$t=1/0,Me=xt[0],Ge=-1;for(const qe of xt){const ho=At(qe,V),yo=Math.hypot(qe[0]-ee[0],qe[1]-ee[1]);ho>=t.STAND_CLEAR_EACH&&yo<$t&&(Yt=qe,$t=yo),ho>Ge&&(Me=qe,Ge=ho)}V.push(Yt||Me)}}const kt=t.REAR_N>0?S.rear():0;[["horse","rear"],["horse","rear"],["horse","shake"],["bull","stand"]].forEach(([$,st],xt)=>{const Et=V[xt],{facing:ee,scale:Yt,ph:$t,period:Me}=St[xt],Ge=st==="rear"&&xt<t.REAR_N?1+(kt+xt/2)%1:0,qe={cx:Et[0],cz:Et[1],r:0,a0:ee,w:0,mode:0,p0:0,p1:Ge};Z.beasts.push({kind:$,gait:"stand",thing:qe,free:!0,scale:Yt,coat:st==="rear"?lt.rear[xt]:$==="horse"?lt.shake:ut.stand,ph:$t,pace:.7,shaker:Me,rear:Ge,turn:0,handler:null})})}{const k=S.handlers,mt=m.LA,ct=m.LB,yt=(x,nt,vt)=>{const J=Math.atan2(-nt/(ct*ct),-x/(mt*mt))+k.range(-.45,.45);Z.handlers.push({where:vt,thing:{cx:x,cz:nt,r:0,a0:J,w:0,mode:0,p0:0,p1:0},dress:k(),ph:k()*o})};for(let x=0;x<t.WEST_HANDLERS;x++){const nt=x%2?1:-1,vt=Math.floor(x/2),J=Math.ceil(t.WEST_HANDLERS/2),At=(t.WEST_Z[1]-t.WEST_Z[0])/J,Jt=nt*(t.WEST_Z[0]+(vt+k.range(...t.STAND_SHARE))*At);yt(-mt*Math.sqrt(1-Jt/ct*(Jt/ct)),Jt,"west ledge")}const St=m.zE;for(let x=0;x<t.EAST_HANDLERS;x++){const nt=-St+(x+k.range(...t.STAND_SHARE))*2*St/t.EAST_HANDLERS;yt(mt*Math.sqrt(1-nt/ct*(nt/ct)),nt,"east ledge")}}{const k=S.balls,mt=Math.max(8,Math.round(t.BALLS*D*H)),ct=Math.PI/2;for(let yt=0;yt<t.BALL_SLOTS;yt++){const St=[];for(let nt=0;nt<16;nt++)St.push(k.int(0,3)*ct+t.BALL_AXIS_OFF+t.BALL_WEDGE+k()*(ct-2*t.BALL_AXIS_OFF-2*t.BALL_WEDGE));const x=k.range(...t.BALL_PERIOD);Z.showers.push({period:x,offset:k()*x,wedges:St})}for(let yt=0;yt<t.BALL_SLOTS;yt++)for(let St=0;St<mt;St++)Z.balls.push({slot:yt,delay:k()*t.BALL_THROW,a0:k.range(-.6,.6)*t.BALL_WEDGE,a1:k.range(-1,1)*t.BALL_WEDGE,d1:t.BALL_D[0]+(t.BALL_D[1]-t.BALL_D[0])*Math.sqrt(k()),fly:k.range(...t.BALL_FLY),tone:k()})}{const k=S.spray,mt=ct=>Math.max(4,Math.round(ct*Math.min(1,.6+.4*H)));for(const ct of Z.beasts){const yt=Y(ct);if(ct.shaker)for(let St=0;St<mt(t.SPRAY_SHAKE);St++){const x=k()<.6,nt=k(),vt=x?[(.62+.42*nt)*yt,(1.42+.6*nt)*yt-s.WATER_DEEP,0]:[(-.7+1.2*nt)*yt,1.46*yt-s.WATER_DEEP,0],J=k.range(-1.35,1.35),At=k.range(2,3.6);Z.spray.push({thing:ct.thing,kind:1,o:vt,v:[k.range(-.7,.7),At*Math.cos(J)*.7+.4,At*Math.sin(J)],r:k.range(.024,.038),tim:[ct.shaker,k.range(.05,t.SHAKE_FLY),t.SHAKE_FLY,ct.ph]})}}}return Z}function ot(n,f,w){const u=n.showers[f],S=(w+u.offset)/u.period,D=Math.floor(S);return{turn:D,since:(S-D)*u.period,wedge:u.wedges[(D%16+16)%16]}}const g={d:Ce.ROOF_D0-.4,y:s.ROOF_Y+.5,HAND:1.3};function M(n,f,w,u=[0,0,0]){const S=ot(n,f.slot,w),D=(S.since-f.delay)/f.fly;if(D<=0||D>=1)return null;const H=l(g.d,S.wedge+f.a0),Z=l(f.d1,S.wedge+f.a1),lt=A(f.d1)+g.HAND;return u[0]=H[0]+(Z[0]-H[0])*D,u[2]=H[1]+(Z[1]-H[1])*D,u[1]=g.y+(lt-g.y)*D+.5*t.BALL_G*f.fly*f.fly*D*(1-D),u}function G(n){const f=[],w=xo.STAND+xo.ARM;for(const u of n.boats){for(const S of u.thwarts)for(const D of[-1,1])f.push({who:"rower",thing:u.thing,at:[S,D*t.SEAT_Z],slack:.35,reach:s.WATER_Y+t.ROWER_TOP,reachUp:s.WATER_Y+t.SEAT_Y+w});f.push({who:"the one who steers",thing:u.thing,at:[u.steer,0],slack:.5,reach:s.WATER_Y+t.DECK_Y+w,reachUp:s.WATER_Y+t.DECK_Y+w})}for(const u of n.handlers)f.push({who:"handler on the "+u.where,thing:u.thing,at:[0,0],slack:.5,reach:w,reachUp:w});return f}function q(n,f,w=[0,0,0],u=n.reach){return c(n.thing,f,n.at[0],0,n.at[1],w),w[1]=u,w}function X(n){if(n.mode<.5&&(n.r===0||n.w===0))return[0];const f=n.mode>.5&&n.mode<1.5?360:720,w=o/Math.abs(n.w),u=[];for(let S=0;S<f;S++)u.push(S*w/f);return u}function ht(n,f){const w=f.slice().sort((ct,yt)=>ct[1]-yt[1]),u=ct=>{let yt=1/0,St=null;for(const x of ct)for(const nt of w){if(nt[1]-x[1]-(x[3]||0)>=yt)break;const vt=Math.hypot(nt[0]-x[0],nt[1]-x[1],nt[2]-x[2])-(x[3]||0);vt<yt&&(yt=vt,St={lens:nt,point:[x[0],x[1],x[2]],what:x[4]})}return{least:yt,at:St}},S={people:{},peopleUp:{},things:{}},D=[0,0,0],H={};for(const ct of G(n))(H[ct.who]=H[ct.who]||[]).push(ct);for(const ct in H){const yt=[],St=[];for(const x of H[ct])for(const nt of X(x.thing))q(x,nt,D,x.reach),yt.push([D[0],D[1],D[2],x.slack,ct]),q(x,nt,D,x.reachUp),St.push([D[0],D[1],D[2],x.slack,ct]);S.people[ct]=u(yt),S.peopleUp[ct]=u(St)}const Z=[],lt=[],ut=[],Q=[],k=[];for(const ct of n.boats)for(const yt of X(ct.thing)){const St=Lt(ct);for(const x of[[St.STEM[St.STEM.length-1][0],St.STEM[St.STEM.length-1][1],0],[St.STERN[St.STERN.length-1][0],St.STERN[St.STERN.length-1][1],0],[ct.L/2,1.2,0],[-ct.L/2,1.3,0],[0,.55,ct.B/2],[0,.55,-ct.B/2]])c(ct.thing,yt,x[0],x[1],x[2],D),Z.push([D[0],D[1],D[2],.15,"hull"]);for(const x of ct.thwarts)for(const nt of[-1,1])for(const vt of[-1,1]){const J=ct.B/2+t.OAR_OUT;c(ct.thing,yt,x+vt*Math.sin(t.SWEEP)*t.OAR_OUT,t.OAR_Y+.2,nt*J,D),lt.push([D[0],D[1],D[2],.3,"oar"])}c(ct.thing,yt,St.STERN[St.STERN.length-1][0],t.POST_STERN,0,D),k.push([D[0],D[1],D[2],t.STREAM_L,"streamer"])}for(const ct of n.beasts)for(const yt of X(ct.thing))c(ct.thing,yt,1,z(ct),0,D),ut.push([D[0],D[1],D[2],.9,ct.kind]);for(const ct of n.balls){const yt=n.showers[ct.slot];for(let St=0;St<16;St++)for(let x=1;x<24;x++){const nt=(St+0)*yt.period-yt.offset+ct.delay+ct.fly*x/24,vt=M(n,ct,nt+1e-6,D);vt&&Q.push([vt[0],vt[1],vt[2],t.BALL_R,"ball"])}}S.things={hull:u(Z),oar:u(lt),streamer:u(k),beast:u(ut),ball:Q.length?u(Q):{least:1/0,at:null}};let mt=1/0;for(const ct of n.boats)for(const yt of X(ct.thing))for(const St of Lt(ct).ST)for(const x of[-1,1])c(ct.thing,yt,St[0],0,x*St[1],D),mt=Math.min(mt,tt(D[0],D[2]));return S.hullToWall=mt,S}function tt(n,f){let w=1/0;for(let u=0;u<720;u++){const S=F[2*u]-n,D=F[2*u+1]-f,H=S*S+D*D;H<w&&(w=H)}return Math.sqrt(w)}const F=(()=>{const n=new Float64Array(1440);for(let f=0;f<720;f++)n[2*f]=s.WATER_A*Math.cos(f*o/720),n[2*f+1]=s.WATER_B*Math.sin(f*o/720);return n})(),at={ST:[[-4.25,0,1.05,.3],[-3.7,.42,.78,-.12],[-2.8,.8,.6,-.28],[-1.4,1,.52,-.35],[0,1.05,.5,-.35],[1.4,1,.52,-.35],[2.8,.78,.62,-.28],[3.7,.4,.84,-.1],[4.25,0,1.1,.32]],STEM:[[-.05,.95],[.17,1.45],[.11,1.9],[-.15,t.POST_STEM]],STERN:[[.05,.9],[-.27,1.6],[-.25,2.35],[0,t.POST_STERN]]},rt=(()=>{const n=at.ST,f=[],w=([,u,S,D])=>{const H=D+.36*(S-D);return H>=0?.74*u*-D/(H-D):u*(.74+.26*-H/(S-H))};for(let u=0;u<n.length;u++){const S=n[u][3];S>=0||(u>0&&n[u-1][3]>=0&&f.push([n[u-1][0]+(n[u][0]-n[u-1][0])*n[u-1][3]/(n[u-1][3]-S),0]),f.push([n[u][0],w(n[u])]),u+1<n.length&&n[u+1][3]>=0&&f.push([n[u][0]+(n[u+1][0]-n[u][0])*-S/(n[u+1][3]-S),0]))}return f})();function Lt(n){const f=n.L/t.BOAT_L,w=n.B/t.BOAT_B;return{ST:at.ST.map(([u,S,D,H])=>[u*f,S*w,D,H]),STEM:at.STEM.map(([u,S])=>[n.L/2+u,S]),STERN:at.STERN.map(([u,S])=>[-n.L/2+u,S])}}const bt={RIGID:0,OAR:1,ROWER:2,NOD:3,FLOAT:4,SHAKE:5,FLAG:7};function zt(){return{pos:[],nor:[],col:[],t0:[],t1:[],pp:[],pq:[],idx:[],n:0,thing:null,part:[0,0,0,0],q:[0,0,0,0],colour:[1,1,1,0],tris:0}}const j=(n,f)=>[n[0]-f[0],n[1]-f[1],n[2]-f[2]],Rt=(n,f)=>[n[1]*f[2]-n[2]*f[1],n[2]*f[0]-n[0]*f[2],n[0]*f[1]-n[1]*f[0]],Gt=n=>{const f=Math.hypot(n[0],n[1],n[2])||1;return[n[0]/f,n[1]/f,n[2]/f]};function gt(n,f,w,u=n.colour){const S=n.thing;return n.pos.push(f[0],f[1],f[2]),n.nor.push(w[0],w[1],w[2]),n.col.push(u[0],u[1],u[2],u[3]||0),n.t0.push(S.cx,S.cz,S.r,S.a0),n.t1.push(S.w,S.mode,S.p0,S.p1),n.pp.push(...n.part),n.pq.push(...n.q),n.n++}function et(n,f,w,u,S,D){const H=Gt(Rt(j(w,f),j(S,f))),Z=mt=>(D&&Array.isArray(D[0])?D[mt]:D)||n.colour,lt=gt(n,f,H,Z(0)),ut=gt(n,w,H,Z(1)),Q=gt(n,u,H,Z(2)),k=gt(n,S,H,Z(3));n.idx.push(lt,ut,Q,lt,Q,k),n.tris+=2}function Zt(n,f,w,u,S){const D=Gt(Rt(j(w,f),j(u,f))),H=Z=>(S&&Array.isArray(S[0])?S[Z]:S)||n.colour;n.idx.push(gt(n,f,D,H(0)),gt(n,w,D,H(1)),gt(n,u,D,H(2))),n.tris+=1}function he(n,f,w,u,S=!1){const D=n.n,H=f[0].length;f.forEach((Z,lt)=>{const ut=[0,0,0];for(const Q of Z)ut[0]+=Q[0]/H,ut[1]+=Q[1]/H,ut[2]+=Q[2]/H;Z.forEach((Q,k)=>gt(n,Q,Gt(j(Q,ut)),typeof u=="function"?u(lt,k):u))});for(let Z=0;Z+1<f.length;Z++)for(let lt=0;lt<(w?H:H-1);lt++){const ut=D+Z*H+lt,Q=D+Z*H+(lt+1)%H,k=D+(Z+1)*H+(lt+1)%H,mt=D+(Z+1)*H+lt;S?n.idx.push(ut,k,Q,ut,mt,k):n.idx.push(ut,Q,k,ut,k,mt),n.tris+=2}}function oe(n,f,w,u,S,D){const H=Gt(j(w,f)),Z=Gt(Rt(H,Math.abs(H[1])>.9?[1,0,0]:[0,1,0])),lt=Rt(Z,H),ut=(Q,k)=>[[Q[0]+Z[0]*k,Q[1]+Z[1]*k,Q[2]+Z[2]*k],[Q[0]+lt[0]*k,Q[1]+lt[1]*k,Q[2]+lt[2]*k],[Q[0]-Z[0]*k,Q[1]-Z[1]*k,Q[2]-Z[2]*k],[Q[0]-lt[0]*k,Q[1]-lt[1]*k,Q[2]-lt[2]*k]];he(n,[ut(f,u),ut(w,S)],!0,D,!0)}function Ee(n,f,w,u,S,D){const H=n.n,Z=(lt,ut,Q)=>{for(let k=0;k<6;k++){const mt=k*Math.PI/3,ct=[f[0]+w[0]*ut*Math.cos(mt),f[1]+w[1]*lt,f[2]+w[2]*ut*Math.sin(mt)];gt(n,ct,Gt(j(ct,f)),Math.cos(mt)*D<Q?S:u)}};gt(n,[f[0],f[1]+w[1],f[2]],[0,1,0],S),Z(.5,.87,.6),Z(-.45,.85,-.4),gt(n,[f[0],f[1]-w[1],f[2]],[0,-1,0],u);for(let lt=0;lt<6;lt++){const ut=H+1+lt,Q=H+1+(lt+1)%6,k=H+7+lt,mt=H+7+(lt+1)%6;n.idx.push(H,Q,ut,ut,Q,mt,ut,mt,k,H+13,k,mt),n.tris+=4}}const I=(n,f=1)=>{const w=new U.Color(n);return[w.r*f,w.g*f,w.b*f,0]},ie=(n,f,w)=>[n[0]+(f[0]-n[0])*w,n[1]+(f[1]-n[1])*w,n[2]+(f[2]-n[2])*w,n[3]||0],Mt=(n,f)=>[n[0]*f,n[1]*f,n[2]*f,n[3]||0],pe=[I("#b3432a"),I("#e6dfcd")],Le=I("#7b5c3b"),Ue=I("#4d3a27"),pt=I("#a08258"),Ke=I("#33271c"),P=I("#2b2118"),K=I("#4b3927"),C=I("#e9e1c8"),It=[I("#dcd3bd"),I("#cfc4a8"),I("#c7b999"),I("#d6ccb6")],wt=[I("#d6ccb6"),I("#c2b393"),I("#a98f68"),I("#8a6e4d"),I("#b9a98c")],Vt=I("#a8785a"),Xt=I("#2a2019"),Kt=[{coat:I("#dcd7cb"),hair:I("#75716b"),nose:I("#6a625c"),blaze:0},{coat:I("#cfccc4"),hair:I("#55524e"),nose:I("#5c5652"),blaze:0},{coat:I("#a7a8a6"),hair:I("#3f3e3c"),nose:I("#353331"),blaze:0},{coat:I("#d8d0c0"),hair:I("#a39a88"),nose:I("#6a625a"),blaze:0},{coat:I("#8b8d90"),hair:I("#2e2d2c"),nose:I("#2c2a29"),blaze:0},{coat:I("#6a5446"),hair:I("#8a785e"),nose:I("#3a2c24"),blaze:0},{coat:I("#63503f"),hair:I("#1a1512"),nose:I("#2a1e17"),blaze:0},{coat:I("#2b2723"),hair:I("#14110f"),nose:I("#1c1917"),blaze:0},{coat:I("#b68d55"),hair:I("#1c1713"),nose:I("#33261b"),blaze:0},{coat:I("#58483e"),hair:I("#241c16"),nose:I("#261c16"),blaze:0},{coat:I("#6e5140"),hair:I("#553f33"),nose:I("#38281f"),blaze:0},{coat:I("#bdbfc1"),hair:I("#e4e0d6"),nose:I("#6e6862"),blaze:0},{coat:I("#d9c9a6"),hair:I("#efe6d2"),nose:I("#7a6a58"),blaze:0},{coat:I("#9aa0a8"),hair:I("#2c2b2b"),nose:I("#2a2828"),blaze:0},{coat:I("#4f3f34"),hair:I("#16110e"),nose:I("#20170f"),blaze:0},{coat:I("#5e493c"),hair:I("#40312a"),nose:I("#2a1e17"),blaze:0},{coat:I("#2e2927"),hair:I("#151210"),nose:I("#1a1310"),blaze:0},{coat:I("#674f40"),hair:I("#34271e"),nose:I("#2c2018"),blaze:0},{coat:I("#534237"),hair:I("#15110e"),nose:I("#2a1f18"),blaze:0},{coat:I("#6b5443"),hair:I("#1a1410"),nose:I("#2c2018"),blaze:0},{coat:I("#5a463a"),hair:I("#33271f"),nose:I("#221a15"),blaze:0},{coat:I("#2a2725"),hair:I("#121010"),nose:I("#1a1716"),blaze:0},{coat:I("#775f4c"),hair:I("#1c1612"),nose:I("#30241c"),blaze:0},{coat:I("#765a48"),hair:I("#5c4638"),nose:I("#3a2a20"),blaze:0},{coat:I("#66584d"),hair:I("#2c2420"),nose:I("#2a211c"),blaze:0},{coat:I("#614b3d"),hair:I("#48372c"),nose:I("#2e2119"),blaze:0}],Ot=[{coat:I("#dad3c3"),fore:I("#8a867e"),nose:I("#2e2a27")},{coat:I("#d2cab9"),fore:I("#6c6862"),nose:I("#2e2a27")},{coat:I("#cdb890"),fore:I("#a58e66"),nose:I("#3a3028")},{coat:I("#b39160"),fore:I("#8c6d43"),nose:I("#33291f")},{coat:I("#6e5545"),fore:I("#56412f"),nose:I("#2e2520")},{coat:I("#6a5646"),fore:I("#4e3e32"),nose:I("#2e2520")},{coat:I("#5a483c"),fore:I("#42342a"),nose:I("#2a221d")},{coat:I("#4c3e36"),fore:I("#372d27"),nose:I("#241e1a")}],se=I("#e4dabd"),Ae=I("#3b332b");function xe(n,f,w,u={}){const S=u.handL||[.08,.82,-.27],D=u.handR||[.08,.82,.27],H=Vt,Z=Mt(w,.8);if(!u.wades)for(const Q of[-1,1])oe(n,f(0,.86,Q*.09),f(.02,0,Q*.1),.085,.055,H);const lt=u.wades?.86:.52,ut=(Q,k,mt)=>[f(mt,Q,-k),f(mt,Q,k),f(-mt,Q,k),f(-mt,Q,-k)];he(n,[ut(lt,.19,.13),ut(1,.17,.115),ut(1.42,.215,.12)],!0,Q=>Q===0?Z:w,!0),et(n,f(.12,1.42,-.215),f(.12,1.42,.215),f(-.12,1.42,.215),f(-.12,1.42,-.215),w),oe(n,f(0,1.39,-.24),f(...S),.055,.04,H),oe(n,f(0,1.39,.24),f(...D),.055,.04,H),Ee(n,f(0,1.59,0),[.1,.13,.095],H,Xt,u.back||1)}function Ye(n,f,w){n.thing=f.thing,n.part=[0,0,0,bt.RIGID],n.q=[0,0,0,0],w.thing=f.thing;const u=Lt(f),S=u.ST,D=f.L,H=-D/2,Z=[...pe[f.side].slice(0,3),1],lt=[...Mt(pe[f.side],.8).slice(0,3),1],ut=pe[f.side],Q=(V,kt)=>[S[V][0],S[V][2],kt*S[V][1]],k=(V,kt)=>[S[V][0],S[V][3]+.36*(S[V][2]-S[V][3]),kt*.74*S[V][1]],mt=V=>[S[V][0],S[V][3],0];for(let V=0;V+1<S.length;V++)et(n,Q(V,1),k(V,1),k(V+1,1),Q(V+1,1),Z),et(n,k(V,1),mt(V),mt(V+1),k(V+1,1),lt),et(n,Q(V+1,-1),k(V+1,-1),k(V,-1),Q(V,-1),Z),et(n,k(V+1,-1),mt(V+1),mt(V),k(V,-1),lt);const ct=Mt(pe[f.side],1.06),yt=(V,kt,$)=>[S[V][0],S[V][2]+$,kt*Math.max(0,S[V][1]-.22)];for(let V=0;V+1<S.length;V++)et(n,Q(V,1),Q(V+1,1),yt(V+1,1,.02),yt(V,1,.02),ct),et(n,Q(V+1,-1),Q(V,-1),yt(V,-1,.02),yt(V+1,-1,.02),ct);const St=(V,kt)=>{for(let $=0;$+1<S.length;$++)if(V<=S[$+1][0]){const st=Math.max(0,(V-S[$][0])/(S[$+1][0]-S[$][0]));return S[$][kt]+(S[$+1][kt]-S[$][kt])*st}return S[S.length-1][kt]},x=V=>St(V,1),nt=.06,vt=.76,J=H+1.5,At=f.thwarts[0]+.7,Jt=(V,kt,$,st,xt,Et=4)=>{for(let ee=0;ee<Et;ee++){const Yt=V+(kt-V)*ee/Et,$t=V+(kt-V)*(ee+1)/Et;et(n,[Yt,typeof $=="function"?$(Yt):$,-st*x(Yt)],[Yt,typeof $=="function"?$(Yt):$,st*x(Yt)],[$t,typeof $=="function"?$($t):$,st*x($t)],[$t,typeof $=="function"?$($t):$,-st*x($t)],xt)}};Jt(J,At,nt,vt,P,5);for(const V of f.thwarts){const kt=x(V)*.93;et(n,[V-.12,t.SEAT_Y,-kt],[V-.12,t.SEAT_Y,kt],[V+.12,t.SEAT_Y,kt],[V+.12,t.SEAT_Y,-kt],K)}const le=V=>St(V,2)-.07;Jt(H+.12,J,t.DECK_Y,.9,ct,3),Jt(At,D/2-.12,le,.9,ct,5),et(n,[J,t.DECK_Y,-.9*x(J)],[J,t.DECK_Y,.9*x(J)],[J,nt,vt*x(J)],[J,nt,-vt*x(J)],Mt(pe[f.side],.7)),et(n,[At,le(At),.9*x(At)],[At,le(At),-.9*x(At)],[At,nt,-vt*x(At)],[At,nt,vt*x(At)],Mt(pe[f.side],.7));for(const V of[u.STEM,u.STERN])for(let kt=0;kt+1<V.length;kt++)oe(n,[V[kt][0],V[kt][1],0],[V[kt+1][0],V[kt+1][1],0],.12-.02*kt,.1-.02*kt,ut);oe(n,[H+1.2,1.5,.42],[H-.3,-.05,1.12],.04,.04,pt),et(n,[H-.17,.12,1.02],[H-.35,.02,1.2],[H-.7,-.5,1.36],[H-.47,-.42,1.12],C);for(const V of f.thwarts)for(const kt of[-1,1]){const $=kt*(x(V)+.02),st=$-kt*t.OAR_IN,xt=$+kt*t.OAR_OUT,Et=xt-kt*t.BLADE_L,ee=t.OAR_HALF,Yt=t.OAR_Y;w.part=[V,Yt,$,bt.OAR],w.q=[kt,1,f.beat,f.beatPhase],et(w,[V-ee,Yt,st],[V+ee,Yt,st],[V+ee,Yt,Et],[V-ee,Yt,Et],pt),et(w,[V,Yt-ee,st],[V,Yt+ee,st],[V,Yt+ee,Et],[V,Yt-ee,Et],pt),w.q=[kt,0,f.beat,f.beatPhase];const $t=t.BLADE_HALF;et(w,[V-$t*.6,Yt,Et],[V+$t*.6,Yt,Et],[V+$t,Yt,xt],[V-$t,Yt,xt],C)}let We=0;for(const V of f.thwarts)for(const kt of[-1,1]){const $=kt*t.SEAT_Z,st=t.SEAT_Y,xt=It[(f.crew+We*3+(kt>0?1:0))%It.length],Et=(Yt,$t,Me)=>[V-Yt,st+$t,$-Me];We++,n.part=[0,0,0,bt.RIGID],n.q=[0,0,0,0],et(n,Et(-.1,.17,-.17),Et(-.1,.17,.17),Et(.44,.15,.15),Et(.44,.15,-.15),Mt(xt,.85)),et(n,Et(.44,.15,-.15),Et(.44,.15,.15),Et(.5,-.25,.13),Et(.5,-.25,-.13),Vt),n.part=[V-.02,st+.1,$,bt.ROWER],n.q=[0,0,f.beat,f.beatPhase];const ee=(Yt,$t,Me)=>[Et(.02+Me,Yt,-$t),Et(.02+Me,Yt,$t),Et(.02-Me,Yt,$t),Et(.02-Me,Yt,-$t)];he(n,[ee(.08,.17,.12),ee(.62,.2,.115)],!0,xt,!0),et(n,Et(.135,.62,-.2),Et(.135,.62,.2),Et(-.095,.62,.2),Et(-.095,.62,-.2),xt),oe(n,Et(.04,.58,-.22),Et(.5,.31,-.1),.05,.04,Vt),oe(n,Et(.04,.58,.22),Et(.5,.31,.1),.05,.04,Vt),Ee(n,Et(.03,t.ROWER_TOP-st-.13,0),[.1,.13,.095],Vt,Xt,-1)}n.part=[0,0,0,bt.RIGID],n.q=[0,0,0,0],xe(n,(V,kt,$)=>[f.steer+V,t.DECK_Y+kt,$],It[(f.crew+2)%It.length],{handR:[.2,1.08,.42]});{const V=u.STERN[u.STERN.length-1],kt=t.STREAM_SEG,$=Mt(pe[f.side],1.04),st=[];n.part=[V[0],V[1]-t.STREAM_W[0],0,bt.FLAG],n.q=[t.STREAM_L,0,.6+.8*(f.beatPhase/o%1),f.beatPhase*3.1];for(let xt=0;xt<=kt;xt++){const Et=xt/kt,ee=t.STREAM_W[0]+(t.STREAM_W[1]-t.STREAM_W[0])*Et;for(const Yt of[1,-1])st.push(gt(n,[n.part[0]+Et*t.STREAM_L,n.part[1]+Yt*ee,0],[0,0,1],$))}for(let xt=0;xt<kt;xt++){const Et=st[2*xt],ee=st[2*xt+1],Yt=st[2*xt+2],$t=st[2*xt+3];n.idx.push(Et,ee,$t,Et,$t,Yt),n.tris+=2}n.part=[0,0,0,bt.RIGID],n.q=[0,0,0,0]}}const Pe={RINGS:[[-.9,1.14,.09,.94],[-.84,1.36,.22,.86],[-.66,1.48,.3,.8],[-.42,1.5,.325,.78],[-.12,1.44,.325,.76],[.14,1.42,.33,.75],[.38,1.47,.31,.77],[.55,1.5,.26,.8],[.7,1.38,.23,.84],[.82,1.2,.16,.92]],NECK:[[.58,1.3,.26,.17],[.7,1.56,.215,.14],[.8,1.82,.175,.115],[.88,2.04,.145,.1],[.93,2.2,.125,.092]],HEAD:[[.94,2.21,.13,.105],[1.06,2.12,.15,.11],[1.21,1.97,.11,.085],[1.34,1.83,.08,.07]],EAR:[[.91,2.26,.065],[.93,2.5,.1]],EAR_R:.06,PIVOT:[.62,1.26],DOCK:[-.87,1.34],TAIL_IN:-1.05,TAIL_END:-1.7,TAIL_W:[.05,.07,.1,.12],TOP:2.58,REAR_TOP:3.45,TUCK:[[.56,.98,.085],[.8,.7,.055],[.63,.44,.05]],FORE_Z:.15},ze={RINGS:[[-1,1.12,.12,.88],[-.94,1.32,.3,.78],[-.72,1.4,.4,.66],[-.4,1.4,.44,.6],[-.05,1.38,.46,.55],[.25,1.44,.45,.53],[.48,1.6,.4,.55],[.68,1.56,.36,.58],[.88,1.34,.3,.68]],NECK:[[.7,1.28,.34,.28],[.9,1.36,.3,.25],[1.08,1.42,.26,.22]],HEAD:[[1.08,1.44,.22,.2],[1.26,1.34,.2,.18],[1.44,1.22,.15,.145],[1.55,1.15,.125,.13]],HORN:[[1.04,1.6,.16],[1.06,1.67,.46],[1.17,1.78,.66],[1.35,1.93,.7]],HORN_R:[.075,.062,.042,.01],PIVOT:[.7,1.2],DOCK:[-.99,1.28],TAIL_IN:-1.1,TAIL_END:-1.64,TAIL_W:[.028,.03,.03,.1],TOP:1.99},ao=[-130,-97.5,-65,-32.5,0,32.5,65,97.5,130].map(n=>n*He),so=(n,f,w)=>{let u=1/0;for(let S=0;S+1<n.length;S++){const[D,H]=n[S],Z=n[S+1][0]-D,lt=n[S+1][1]-H,ut=Math.min(1,Math.max(0,((f-D)*Z+(w-H)*lt)/(Z*Z+lt*lt)));u=Math.min(u,Math.hypot(f-D-Z*ut,w-H-lt*ut))}return u};function Je(n,f){const w=n.RINGS,u=w[0][0],S=w[w.length-1][0],D=[];for(let x=u;x<=S+1e-9;x+=.02){let nt=0;for(;nt+2<w.length&&x>w[nt+1][0];)nt++;const vt=(x-w[nt][0])/(w[nt+1][0]-w[nt][0]),[J,At,Jt]=[1,2,3].map(le=>w[nt][le]+(w[nt+1][le]-w[nt][le])*vt);D.push({x,top:J,arch:ao.map(le=>[At*Math.sin(le),Jt+(J-Jt)*(.5+.5*Math.cos(le))])})}const H=w.map(([x,nt])=>{let vt=[x,nt,0,0];for(let J=s.WATER_DEEP;J<=nt;J+=.01){let At=Math.min(J-s.WATER_DEEP,x-u,S-x);if(f)for(let Jt=1;Jt<=10;Jt++){const le=t.REAR_ANGLE*Jt/10;At=Math.min(At,t.REAR_PIVOT[1]+(x-t.REAR_PIVOT[0])*Math.sin(le)+(J-t.REAR_PIVOT[1])*Math.cos(le)-s.WATER_DEEP)}for(const Jt of D){if(At<=0)break;const le=Math.abs(Jt.x-x);le<At&&(At=Math.min(At,J<Jt.top?Math.hypot(so(Jt.arch,0,J),le):le))}At>vt[3]&&(vt=[x,J,0,At])}return vt}),Z=([x,nt,vt,J])=>{const At=[];for(let Jt=0;Jt<=6;Jt++)At.push([J*Math.sin(Jt*o/6),vt*Math.cos(Jt*o/6)]);return[x,nt,0,so(At,0,0)]},lt=[...n.NECK.map(Z),...n.HEAD.map(Z)],ut=n.HORN?[-1,1].map(x=>n.HORN.map(([nt,vt,J],At)=>[nt,vt,x*J,n.HORN_R[At]*Math.SQRT1_2])):[],Q=(x,nt,vt)=>{const J=[0];for(let At=1;At<x.length;At++)J.push(J[At-1]+Math.hypot(x[At][0]-x[At-1][0],x[At][1]-x[At-1][1],x[At][2]-x[At-1][2]));return x.map((At,Jt)=>{let le=At[3];return x.forEach((We,V)=>{le=Math.min(le,Math.hypot(We[3],J[V]-J[Jt]))}),nt&&(le=Math.min(le,J[Jt])),vt&&(le=Math.min(le,J[x.length-1]-J[Jt])),[At[0],At[1],At[2],le]})},k=[Q(H,!0,!0),Q(lt,!1,!0),...ut.map(x=>Q(x,!1,!1))],mt=k.flat(),ct=[0,1].map(x=>Math.min(...mt.map(nt=>nt[x]))),yt=[0,1].map(x=>Math.max(...mt.map(nt=>nt[x]))),St=[(ct[0]+yt[0])/2,(ct[1]+yt[1])/2];return{chains:k,rises:f,hold:[St[0],St[1],Math.max(...mt.map(x=>Math.hypot(x[0]-St[0],x[1]-St[1],x[2])+x[3]))]}}const io={horse:Je(Pe,1),bull:Je(ze,0)},O=32*He;function W(n,f,w){const u=1/Math.tan(O),S=Math.cos(O)/ue,D=S/Math.sqrt(1-S*S),H=t.REAR_PIVOT;let Z=0;for(let lt=0;lt<=(w?10:0);lt++)for(const ut of io[n].chains)for(const[Q,k,mt,ct]of ut){const yt=t.REAR_ANGLE*lt/10,St=Math.cos(yt),x=Math.sin(yt),nt=Q*f-H[0],vt=k*f-H[1],J=H[0]+nt*St-vt*x,At=H[1]+nt*x+vt*St;Z=Math.max(Z,Math.hypot(J,mt*f)+u*Math.max(At-s.WATER_DEEP,0)+D*Math.min(Math.max(At,0),s.WATER_DEEP)+(ct*f+Te)/Math.sin(O))}return Z}const Y=n=>n.scale*(n.kind==="horse"?t.HORSE_H/1.5:t.BULL_H/1.45);function z(n){return(n.rear?Pe.REAR_TOP:n.kind==="horse"?Pe.TOP:ze.TOP)*Y(n)-s.WATER_DEEP}function dt(n,f){const w=f.kind==="horse",u=w?Pe:ze,S=Y(f),D=($,st,xt)=>[$*S,st*S-s.WATER_DEEP,xt*S],H=w?Kt[f.coat]:Ot[f.coat],Z=H.coat,lt=w?Z:H.fore,ut=w?H.hair:Mt(H.fore,.6);n.thing=f.thing,n.part=[0,0,0,bt.RIGID],n.q=[0,0,0,0];const Q=n.n,k=$=>{f.parts&&f.parts.push([$,n.idx.length])};k("body");const mt=ao,ct=u.RINGS.length,yt=u.RINGS.map(([$,st,xt,Et])=>mt.map(ee=>D($,Et+(st-Et)*(.5+.5*Math.cos(ee)),xt*Math.sin(ee))));he(n,yt,!1,($,st)=>{const xt=ie(Z,lt,e(.05,.45,u.RINGS[$][0])),Et=Math.abs(st-4);return Mt(xt,Et===0?1.1:Et===1?1.04:Et===2?.92:Et===3?.74:.6)});for(const $ of[0,ct-1]){const st=yt[$],xt=[st[4][0],(st[0][1]+st[4][1])/2,0];for(let Et=0;Et<8;Et++)Zt(n,xt,st[Et],st[Et+1],Mt($?lt:Z,.85))}k("tail");{const $=D(u.DOCK[0],u.DOCK[1],0),st=u.TAIL_W.map(Me=>Me*S),xt=.016,Et=u.TAIL_IN*S,ee=u.TAIL_END*S,Yt=(Et+ee)/2,$t=ie(ut,Z,.5);et(n,[$[0],$[1],-st[0]],[$[0],$[1],st[0]],[Et,xt,st[1]],[Et,xt,-st[1]],$t),et(n,[$[0]-st[0],$[1]-.02,0],[$[0]+st[0],$[1]+.05,0],[Et+st[1],xt,0],[Et-st[1],xt,0],Mt($t,.9)),n.part=[Et,xt,0,bt.FLOAT],n.q=[w?.2:.3,0,w?.9:1.3,f.ph*1.7],et(n,[Et,xt,-st[1]],[Et,xt,st[1]],[Yt,xt,st[2]],[Yt,xt,-st[2]],$t),et(n,[Yt,xt,-st[2]],[Yt,xt,st[2]],[ee,xt,st[3]],[ee,xt,-st[3]],[$t,$t,Mt($t,.85),Mt($t,.85)])}const x=D(u.PIVOT[0],u.PIVOT[1],0),nt=f.gait==="stand"?.085:.055;n.part=[x[0],x[1],x[2],f.shaker?bt.SHAKE:bt.NOD],n.q=[nt,f.shaker||0,f.pace,f.ph];const vt=($,st)=>{const xt=$.map(([Et,ee,Yt,$t],Me)=>{const Ge=$[Math.max(0,Me-1)],qe=$[Math.min($.length-1,Me+1)],ho=Math.hypot(qe[0]-Ge[0],qe[1]-Ge[1])||1,yo=-(qe[1]-Ge[1])/ho,qo=(qe[0]-Ge[0])/ho,Do=[];for(let bo=0;bo<6;bo++){const Mo=bo*o/6;Do.push(D(Et+yo*Yt*Math.cos(Mo),ee+qo*Yt*Math.cos(Mo),$t*Math.sin(Mo)))}return Do});return he(n,xt,!0,st),xt},J=($,st)=>Mt(lt,st===3?.7:st===0?1.1:st===1||st===5?1:.85);k("neck");const At=vt(u.NECK,J),Jt=w?Z:ie(lt,Z,.6),le=I("#e2ddd0"),We=u.HEAD.length-1,V=($,st)=>$===We?H.nose:w&&H.blaze&&st===0?le:Mt($===We-1?ie(Jt,H.nose,.35):Jt,st===3?.8:1);k("head");const kt=vt(u.HEAD,V);{const $=kt[We],st=kt[0];for(let xt=1;xt<5;xt++)Zt(n,$[0],$[xt],$[xt+1],H.nose),Zt(n,st[0],st[xt+1],st[xt],Jt)}if(w){k("mane");const $=ie(ut,Z,.5),st=f.ph>Math.PI?1:-1,xt=st>0?1:5,Et=st>0?2:4,ee=st>0?5:1,Yt=($t,Me,Ge)=>[$t[0],$t[1]+Ge*S,$t[2]+st*Me*S];for(let $t=0;$t+1<At.length;$t++){const Me=Yt(At[$t][0],0,.045),Ge=Yt(At[$t+1][0],0,.045),qe=Yt(At[$t][xt],.035,.02),ho=Yt(At[$t+1][xt],.035,.02),yo=ie(At[$t][xt],At[$t][Et],.2),qo=ie(At[$t+1][xt],At[$t+1][Et],.2),Do=Yt(yo,.04,0),bo=Yt(qo,.04,0),Mo=Yt(ie(At[$t][0],At[$t][ee],.4),-.02,.03),ta=Yt(ie(At[$t+1][0],At[$t+1][ee],.4),-.02,.03);st>0?(et(n,Me,Ge,ho,qe,$),et(n,qe,ho,bo,Do,Mt($,.92)),et(n,Mo,ta,Ge,Me,$)):(et(n,Ge,Me,qe,ho,$),et(n,ho,qe,Do,bo,Mt($,.92)),et(n,ta,Mo,Me,Ge,$))}et(n,Yt(kt[0][0],.05*st,.03),Yt(kt[0][0],-.05*st,.03),Yt(kt[1][0],-.035*st,.012),Yt(kt[1][0],.035*st,.012),$);for(const $t of[-1,1])oe(n,D(u.EAR[0][0],u.EAR[0][1],$t*u.EAR[0][2]),D(u.EAR[1][0],u.EAR[1][1],$t*u.EAR[1][2]),u.EAR_R*S,.008,Z)}else for(const $ of[-1,1]){k("horn");for(let st=0;st+1<u.HORN.length;st++){const xt=u.HORN[st],Et=u.HORN[st+1];oe(n,D(xt[0],xt[1],$*xt[2]),D(Et[0],Et[1],$*Et[2]),u.HORN_R[st]*S,u.HORN_R[st+1]*S,st===2?Ae:se)}k("ear"),Zt(n,D(1.02,1.54,$*.2),D(1.08,1.5,$*.2),D(1,1.47,$*.42),Mt(lt,.85))}if(k("tuck"),f.rear){const $=Mt(Z,.8);n.part=[0,0,0,bt.RIGID],n.q=[0,0,0,0];for(const st of[-1,1])for(let xt=0;xt+1<u.TUCK.length;xt++)oe(n,D(u.TUCK[xt][0],u.TUCK[xt][1],st*u.FORE_Z),D(u.TUCK[xt+1][0],u.TUCK[xt+1][1],st*u.FORE_Z*.8),u.TUCK[xt][2]*S,u.TUCK[xt+1][2]*S,xt?$:Z)}k("end");for(let $=Q;$<n.n;$++)n.col[$*4+3]=.25}function N(n,f){n.thing=f.thing,n.part=[0,0,0,bt.RIGID],n.q=[0,0,0,0],xe(n,(w,u,S)=>[w,-s.WATER_Y+u,S],wt[Math.floor(f.dress*wt.length)],f.ph>4?{handR:[.12,1.02,.2]}:{})}const _=(n,f=3)=>Number(n).toFixed(f),Ft=n=>"vec3("+n.slice(0,3).map(f=>f.toFixed(3)).join(", ")+")",Tt=_(s.WATER_Y),qt=`
attribute vec4 aT0; attribute vec4 aT1;
uniform float uTime;
vec3 thingFrame() {
  if (aT1.y > 1.5) {
    float a = aT0.w + aT1.x * uTime, c = cos(a), s = sin(a);
    return vec3(aT0.x + aT0.z * c, aT0.y + aT0.z * aT1.w * s, atan(aT1.w * c * aT1.z, -s * aT1.z));
  }
  if (aT1.y > .5) {
    float q = aT1.x * uTime + aT1.z, d = -.5 * aT0.z * cos(q), e = ${_(t.LIE.SURGE)} * aT0.z * sin(q + 2.);
    return vec3(aT0.x + ${_(r[0],6)} * d + cos(aT0.w) * e, aT0.y + ${_(r[1],6)} * d + sin(aT0.w) * e, aT0.w + aT1.w * (sin(q + 1.1) + ${_(t.LIE.YAW2)} * sin(2. * q + .5)));
  }
  float a = aT0.w + aT1.x * uTime;
  return vec3(aT0.x + aT0.z * cos(a), aT0.y + aT0.z * sin(a), a + aT1.z);
}
// how far a horse that rears is up (rearUp above): 0 down, 1 held up
float rearUp() {
  if (aT1.y > .5 || aT1.w < .5) return 0.;
  float tau = mod(uTime + (aT1.w - 1.) * ${_(t.REAR_PERIOD)}, ${_(t.REAR_PERIOD)});
  return smoothstep(0., ${_(t.REAR_UP)}, tau) * (1. - smoothstep(${_(t.REAR_UP+t.REAR_HOLD)}, ${_(t.REAR_UP+t.REAR_HOLD+t.REAR_DOWN)}, tau));
}
vec3 toWorld(vec3 f, vec3 l) { float c = cos(f.z), s = sin(f.z); return vec3(f.x + l.x * c - l.z * s, ${Tt} + l.y, f.y + l.x * s + l.z * c); }
vec3 turnBy(vec3 f, vec3 n) { float c = cos(f.z), s = sin(f.z); return vec3(n.x * c - n.z * s, n.y, n.x * s + n.z * c); }
`,Ut=n=>`
attribute vec4 aP; attribute vec4 aQ; attribute vec4 aCol;
${n?"uniform vec2 uView;":""}
${qt}
vec3 rX(vec3 v, float a) { float c = cos(a), s = sin(a); return vec3(v.x, v.y * c - v.z * s, v.y * s + v.z * c); }
vec3 rY(vec3 v, float a) { float c = cos(a), s = sin(a); return vec3(v.x * c + v.z * s, v.y, -v.x * s + v.z * c); }
vec3 rZ(vec3 v, float a) { float c = cos(a), s = sin(a); return vec3(v.x * c - v.y * s, v.x * s + v.y * c, v.z); }
// how much of what is drawn a thing truly covers (1 but for an oar under a pixel wide)
float bodyCover;
void bodyAt(out vec3 w, out vec3 n) {
  bodyCover = 1.;
  vec3 fr = thingFrame();
  vec3 q = position - aP.xyz, m = normal;
  float kind = aP.w, t = uTime;
  if (kind > .5 && kind < 1.5) {
    // AN OAR: it sweeps about its pin and dips for the pull. ITS TRUE SIZE; where its shaft or its blade is under a
    // pixel wide it is drawn one pixel wide and its strength falls by its true cover, so that it carries no more
    // light than its true size (the pixel's footprint at the oar's own point; named at the head). THE BLADE TURNS
    // about the shaft: on edge in the water, flat on the way back.
    float ph = aQ.z * t + aQ.w, inw = smoothstep(-.2, .5, sin(ph));
    float dip = mix(${_(t.DIP_OUT,4)}, ${_(t.DIP_IN,4)}, inw) * aQ.x, sw = ${_(t.SWEEP,4)} * cos(ph) * aQ.x;
    // (own: this vertex's own place on the oar's middle line at the clock; the shaft's half thickness, or the
    // blade's own half breadth at this vertex)
    ${n?`vec3 own = (modelMatrix * vec4(toWorld(fr, aP.xyz + rY(rX(vec3(0., 0., q.z), dip), sw)), 1.)).xyz;
    float px = 2. * length(cameraPosition - own) / (projectionMatrix[1][1] * uView.y);
    float wide = max(1., .5 * px / (aQ.y > .5 ? ${_(t.OAR_HALF)} : max(abs(q.x), 1e-3)));`:"float wide = 1.;"}
    bodyCover = 1. / wide;
    if (aQ.y > .5) q.xy *= wide;
    else { q.x *= wide; float fa = 1.5708 * inw; q = rZ(q, fa); m = rZ(m, fa); }
    q = rY(rX(q, dip), sw); m = rY(rX(m, dip), sw);
  } else if (kind > 1.5 && kind < 2.5) {
    // A ROWER leans to the catch and back with his boat's beat
    float a = ${_(t.LEAN0)} + ${_(t.LEAN1)} * cos(aQ.z * t + aQ.w - .3);
    q = rZ(q, a); m = rZ(m, a);
  } else if (kind > 2.5 && kind < 3.5) {
    // A NECK AND HEAD nod
    float a = aQ.y + aQ.x * sin(aQ.z * t + aQ.w);
    q = rZ(q, a); m = rZ(m, a);
  } else if (kind > 3.5 && kind < 4.5) {
    // A TAIL ON THE WATER swings slowly from side to side, now more, now less; it lies on the water and does not rise with a horse that rears
    float a = aQ.x * sin(aQ.z * t + aQ.w) * (.55 + .45 * sin(.37 * aQ.z * t + 2. * aQ.w));
    q = rY(q, a); m = rY(m, a);
  } else if (kind > 4.5 && kind < 5.5) {
    // THE SHAKE: for a good second in every period (aQ.y seconds) the neck rolls fast from side to side
    float tau = mod(t + aQ.w * 3., aQ.y), env = smoothstep(0., .2, tau) * (1. - smoothstep(.9, ${_(t.SHAKE_LASTS)}, tau));
    float a = .3 * sin(19. * t) * env, b = aQ.x * sin(aQ.z * t + aQ.w);
    q = rZ(rX(q, a), b); m = rZ(rX(m, a), b);
  }
  vec3 p = aP.xyz + q;
  // A HORSE THAT REARS: its whole body, neck, head and drawn-up forelegs turn up about its hips; its tail on the
  // water (kind 4) does not
  float ra = ${_(t.REAR_ANGLE,4)} * rearUp();
  if (ra > 0. && (kind < 3.5 || (kind > 4.5 && kind < 5.5))) {
    vec2 pv = vec2(${_(t.REAR_PIVOT[0])}, ${_(t.REAR_PIVOT[1]-s.WATER_DEEP)});
    p.xy = pv + rZ(vec3(p.xy - pv, 0.), ra).xy; m = rZ(m, ra);
  }
  w = toWorld(fr, p);
  n = turnBy(fr, m);
  if (kind > 6.5 && kind < 7.5) {
    // A STREAMER: plain cloth made fast at the post's head (the pivot); it streams DOWN THE WIND (the way the clouds
    // drift: the one wind of this world, ${Ft([to.DRIFT[0],0,to.DRIFT[1]])} m a second outside, a light air in the bowl), its free end waving, rising
    // and sinking as the air freshens and fails (aQ: its length, -, its own quickness, its own phase). How far down
    // the wind it lies and how far it waves: AR.STREAM_OUT and AR.STREAM_WAVE (the lie's rule 7 reads the same figures)
    vec3 Wd = normalize(vec3(${_(to.DRIFT[0])}, 0., ${_(to.DRIFT[1])})), Xd = vec3(-Wd.z, 0., Wd.x);
    float s = q.x / aQ.x, air = .55 + .45 * sin(t * .37 * aQ.z + aQ.w);
    float k1 = 6.5 * s - t * (2.6 + aQ.z) + aQ.w, wave = sin(k1) * (${_(t.STREAM_WAVE[0])} + ${_(t.STREAM_WAVE[1])} * s) * s;
    float slope = (cos(k1) * 6.5 * (${_(t.STREAM_WAVE[0])} + ${_(t.STREAM_WAVE[1])} * s) * s + sin(k1) * (${_(t.STREAM_WAVE[0])} + ${_(2*t.STREAM_WAVE[1])} * s)) / aQ.x;
    float droop = (1.25 - .85 * air) * s * s + .07 * s * sin(9. * s - t * 3.7 + aQ.w * 1.3);
    w = toWorld(fr, aP.xyz) + Wd * q.x * (${_(t.STREAM_OUT[0])} + ${_(t.STREAM_OUT[1])} * air) + Xd * wave + vec3(0., q.y - droop, 0.);
    n = normalize(Xd - Wd * slope);
  }
  w = (modelMatrix * vec4(w, 1.)).xyz;
}
`,it=Ut(!0),_t=Ut(!1),Bt=`
varying vec3 vW; varying vec3 vN; varying vec4 vCol; varying float vCover;
${it}
void main() { vec3 w, n; bodyAt(w, n); vW = w; vN = n; vCol = aCol; vCover = bodyCover; gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.); }`,Nt=`
vec3 bodyLit(vec3 P, vec3 N, vec4 c, bool front) {
  if (!front) N = -N;
  vec3 alb = c.rgb;
  // the hull's skin is painted outside and dark tarred timber inside
  if (c.a > .5 && !front) alb = ${Ft(Ke)};
  // wet and dark at the water's line
  alb *= mix(.55, 1., smoothstep(${Tt} + .01, ${Tt} + .2, P.y));
  // AN ANIMAL'S BODY IS A ROUND WET VOLUME lit from above (its colour's fourth figure .25 marks it): the back, the
  // croup, the crest of the neck and the poll stand clearly lighter than the flank, which falls dark toward the belly
  // line and the water (CHOSEN figures on the surface's own lie, not on the eye)
  float beast = step(.12, c.a) * step(c.a, .4), topl = smoothstep(-.35, .8, N.y);
  alb *= mix(1., mix(.56, 1.38, topl) * mix(.6, 1., smoothstep(${Tt} + .05, ${Tt} + .55, P.y)), beast);
  float ao = mix(.6, 1., smoothstep(${Tt}, ${Tt} + .5, P.y));
  vec3 sun = sunAt(P + N * .05) * uSunCol * max(dot(N, uSun), 0.);
  // the place's fill by the one law: d out from the arena wall along the bowl's ellipses, under strip jf
  float d = famD(P.xz, -3.), ang = atan(P.z / (FA_B + FA_K * d), P.x / (FA_A + d));
  float jf = fract(ang / 6.2831853 + uArc.x * sin(2. * ang) + uArc.y * sin(4. * ang)) * ${_(s.MASTS,1)};
  vec3 col = alb * (sun + fillAt(P, N, d, jf) * ao);
  // a narrow wet sheen along an animal's top line where the sun lies (by the surface's lie; it reads no eye)
  col += beast * sunAt(P + N * .05) * uSunCol * pow(max(N.y, 0.), 12.) * .12 * smoothstep(${Tt} + .25, ${Tt} + .5, P.y);
  return col;
}`,Ht=`
varying vec3 vW; varying vec3 vN; varying vec4 vCol; varying float vCover;
${eo}
${Nt}
void main() {
  // (its strength: 1 but for an oar under a pixel wide, which is drawn in a mesh of its own that blends)
  gl_FragColor = vec4(hazed(bodyLit(vW, normalize(vN), vCol, gl_FrontFacing), vW), vCover);
}`,ft=.03,Pt=.05,te=[18,6],ce=.5,_e=.9,Oe=`
vec2 waver(vec2 p, float up) { p.x += up * .08 * sin(p.y * 2.9 + uTime * 1.7 + p.x * .7); p.y += up * .08 * sin(p.x * 2.3 - uTime * 1.3); return p; }`,ne=t.SIDE_N*2,fe=`
uniform vec4 uHullA[${ne}]; uniform vec4 uHullB[${ne}]; uniform float uHullC[${ne}];
// the drawn hull's half breadth at the waterline at x (under nought: no hull there)
float hullWater(float x) {
${rt.slice(0,-1).map(([n,f],w)=>`  if (x >= ${_(n)} && x < ${_(rt[w+1][0])}) return mix(${_(f)}, ${_(rt[w+1][1])}, (x - ${_(n)}) / ${_(rt[w+1][0]-n)});`).join(`
`)}
  return -1.;
}
// (uHullA: a boat's cx, cz, r, a0; uHullB: its w, p0, p1 and its length over the drawn hull's; uHullC: its beam over
// the drawn hull's)
bool inHull(vec2 p) {
  for (int i = 0; i < ${ne}; i++) {
    vec4 a = uHullA[i], b = uHullB[i];
    float q = b.x * uTime + b.y, d = -.5 * a.z * cos(q), e = ${_(t.LIE.SURGE)} * a.z * sin(q + 2.), h = a.w + b.z * (sin(q + 1.1) + ${_(t.LIE.YAW2)} * sin(2. * q + .5)), c = cos(h), s = sin(h);
    vec2 o = p - vec2(a.x + ${_(r[0],6)} * d + cos(a.w) * e, a.y + ${_(r[1],6)} * d + sin(a.w) * e), l = vec2(o.x * c + o.y * s, -o.x * s + o.y * c);
    if (abs(l.y) < hullWater(l.x / b.w) * uHullC[i]) return true;
  }
  return false;
}`,be=`
varying vec3 vB; varying vec3 vN; varying vec4 vCol;
${_t}
${Oe}
void main() {
  vec3 w, n; bodyAt(w, n);
  vec3 fr = thingFrame(), E = cameraPosition;
  // the body's point mirrored in the surface (a point under the surface comes out over it: it has no image, and the
  // fragment shader cuts it away at the waterline)
  float up = w.y - ${Tt};
  vec3 m = vec3(w.x, ${Tt} - up, w.z);
  // ONE FACE AT A POINT, THE NEAREST ALONG THE SIGHT: the mirrored point's own distance from the eye, less its thing's
  // own middle's, sets how far before the surface the face is laid on the sight (the nearer the farther before it)
  float key = length(m - E) - length(vec3(fr.x, ${Tt}, fr.y) - E);
  float lift = ${_(ft)} + ${_(Pt)} * clamp(.5 - key / (aT1.y > .5 && aT1.y < 1.5 ? ${_(te[0])} : ${_(te[1])}), 0., 1.);
  float den = max(E.y - m.y, 1e-3), k0 = max(E.y - ${Tt}, 0.) / den, k = max(E.y - ${Tt} - lift, 1e-4) / den;
  // where the sight to the mirrored point meets the surface (s), and the same sight at its lift (p), with the waver
  vec3 s = E + (m - E) * k0, p = E + (m - E) * k;
  p.xz += waver(s.xz, max(up, 0.)) - s.xz;
  vB = w; vN = n; vCol = aCol;
  // (divided by k: so that what is carried to the fragment goes evenly over the BODY's own face, not over its flat
  // image: the body's point, lie and colour at a fragment are those of the body's point mirrored there)
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.) / k;
}`,re=`
varying vec3 vB; varying vec3 vN; varying vec4 vCol;
${eo}
${Nt}
${Oe}
${fe}
void main() {
  // ONLY WHAT STANDS OVER THE WATER IS MIRRORED: the image begins where the body meets the water
  float up = vB.y - ${Tt};
  if (up <= 0.) discard;
  // where the sight from the eye's place to the body's mirrored point meets the surface, with the waver
  vec3 E = cameraPosition, m = vec3(vB.x, ${Tt} - up, vB.z);
  vec3 s = E + (m - E) * (max(E.y - ${Tt}, 0.) / max(E.y - m.y, 1e-3));
  s.xz = waver(s.xz, up);
  // no image off the water: outside the pit's own oval, or inside a hull's own plan at the waterline
  vec2 e = s.xz / vec2(${_(s.WATER_A,1)}, ${_(s.WATER_B,1)});
  if (dot(e, e) > 1.) discard;
  if (inHull(s.xz)) discard;
  vec3 V = normalize(E - s);
  // the mirror's share by the sight's own angle: the flatter the sight lies on the water the stronger (CHOSEN figures)
  float F = .07 + .93 * pow(1. - clamp(V.y, 0., 1.), 3.);
  // THE BODY'S OWN COLOUR IN THE BODY'S OWN LIGHT: the bodies' one law at the body's own point; the face is the one a
  // mirrored eye sees (a mirror turns a face's winding about: the image's back is the body's front)
  vec3 col = bodyLit(vB, normalize(vN), vCol, !gl_FrontFacing);
  // the water's: the mirror's share and the ripple's loss, the same for every body
  float a = F * ${_(_e)} * exp(-up / ${_(ce)});
  gl_FragColor = vec4(hazed(col, s), a);
}`,me={SHADE:0,WASH:1,OAR:2,WAKE:3,RINGS:4,DROPS:5,CAST:6},ve=[.43,.092,.06],Fe=n=>{const f=n.RINGS,w=f.length-1,u=Z=>Math.max(0,s.WATER_DEEP-Z[3]);let S=0;for(let Z=0;Z<w;Z++)S+=(f[Z+1][0]-f[Z][0])*(u(f[Z])+u(f[Z+1]))/2;const D=S/(f[w][0]-f[0][0])/2,H=Math.max(...f.map(Z=>Z[2]));return{deep:D,loss:ve.map(Z=>Math.exp(-Z*2*D)),r:H,a:f[0][0]+H,b:f[w][0]-H}},Re={horse:Fe(Pe),bull:Fe(ze)},ue=1.33,ge=s.WATER_DEEP/Math.sqrt(ue*ue-1),Te=.25,ke=Math.sin(t.SWEEP)*(t.OAR_OUT-t.BLADE_L/2),lo=n=>n.chains.map(f=>{const w=u=>`shp(vec3(${_(u[0],4)}, ${_(u[1],4)}, ${_(u[2],4)}), ${n.rises?"cR":"0."}, k)`;return`{ vec2 a = ${w(f[0])}, b; `+f.slice(1).map((u,S)=>`b = ${w(u)}; s = max(s, castS(qq, a, b, ${_(f[S][3],4)} * k, ${_(u[3],4)} * k)); a = b;`).join(" ")+" }"}).join(`
      `),fo=`
attribute vec4 aM; attribute vec4 aC; attribute vec4 aN; attribute vec3 aK; attribute vec2 aUV;
uniform vec3 uSun;
varying vec4 vW; varying vec4 vQ; varying vec4 vM; varying vec4 vS0; varying vec4 vS1; varying vec3 vK;
${qt}
void main() {
  vec3 fr = thingFrame();
  vec3 w = toWorld(fr, vec3(position.x, 0., position.z));
  // a hull's soft shade lies down-sun of it
  if (aM.x < .5) w.xz -= normalize(uSun.xz + vec2(1e-5, 0.)) * aM.y;
  w.y = ${Tt} + aC.z;
  w = (modelMatrix * vec4(w, 1.)).xyz;
  vQ = vec4(position.xz - aC.xy, aUV); vM = aM; vK = aK;
  float fourth = aC.w;
  // a hull's wash: which way the boat goes along its own heading at this clock (+1 astern at its fastest, -1 ahead)
  if (aM.x > .5 && aM.x < 1.5) fourth = clamp(-2. * (${_(t.LIE.SURGE)} * cos(aT1.x * uTime + aT1.z + 2.) + .5 * (${_(r[0],6)} * cos(aT0.w) + ${_(r[1],6)} * sin(aT0.w)) * sin(aT1.x * uTime + aT1.z)), -1., 1.);
  if (aM.x > 2.5 && aM.x < 3.5 && aT1.y > 1.5) {
    // a wake on a course is bent as the course bends there
    float a = aT0.w + aT1.x * uTime, c = cos(a), s = sin(a);
    fourth = aT1.z * aT1.w / (aT0.z * pow(max(s * s + aT1.w * aT1.w * c * c, 1e-3), 1.5));
  }
  vS0 = vec4(-1., 0., 0., 0.); vS1 = vec4(0.);
  if (aM.x > 2.5 && aM.x < 4.5) {
    // a wake's and a standing thing's rings' own animal (aN: where the mark's picture is measured from, horse or
    // bull, its scale, 1 if it is an animal)
    vS1 = aN;
  }
  if (aM.x > 5.5) {
    // AN ANIMAL'S SHADE ON THE FLOOR. The sheet lies ON THE SURFACE over the shade's place on the floor (it reads no
    // eye here: the fragment shader bends the sight). The sun's way in the animal's own space: how far a metre of
    // height throws its shade through the air (vS0.xy) and through the water (vS0.zw: the sun's ray bent at the
    // surface, its sine divided by WATER_N); how far it is reared up (vS1.x); its heading's cosine and sine (vS1.yz)
    float c = cos(fr.z), s = sin(fr.z);
    vec2 sd = vec2(uSun.x * c + uSun.z * s, -uSun.x * s + uSun.z * c);
    float ch = max(length(sd), 1e-4), sw = min(ch / ${_(ue)}, .99);
    vS0 = vec4(sd / max(uSun.y, .25), sd / ch * sw / sqrt(1. - sw * sw));
    vS1 = vec4(${_(t.REAR_ANGLE,4)} * rearUp(), c, s, 0.);
  }
  vW = vec4(w, fourth);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}`,Oo=`
varying vec4 vW; varying vec4 vQ; varying vec4 vM; varying vec4 vS0; varying vec4 vS1; varying vec3 vK;
${eo}
${Fo}
float sq(float x) { return x * x; }
// THE SHADE ON THE FLOOR of the point p of an animal's lines (x ahead, height over the hooves, z to the right; scale k;
// turned up by the angle rear about the hips if it rises with a horse that rears): down the sun's way through the air
// (cA a metre) and through the water (cW a metre). A round thing's shade is longer along the sun's way than across
// it: the plane is measured with that way shortened by the sun's sine (cU, cS), so that a line's thickness is true.
vec2 cA; vec2 cW; vec2 cU; float cS;
vec2 squeeze(vec2 s) { return s - cU * (dot(s, cU) * (1. - cS)); }
vec2 shp(vec3 p, float rear, float k) {
  p *= k;
  if (rear > 0.) { vec2 pv = vec2(${_(t.REAR_PIVOT[0])}, ${_(t.REAR_PIVOT[1])}), o = p.xy - pv; float c = cos(rear), s = sin(rear); p.xy = pv + vec2(o.x * c - o.y * s, o.x * s + o.y * c); }
  return squeeze(p.xz - cA * max(p.y - ${_(s.WATER_DEEP)}, 0.) - cW * clamp(p.y, 0., ${_(s.WATER_DEEP)}));
}
// THE FOOTPRINT ACROSS a thing that is measured by x (metres): how much x changes from one pixel to the next
float across(float x) { return length(vec2(dFdx(x), dFdy(x))); }
// a soft line of half width w where x = 0 (x: the line's own distance): never drawn thinner than the pixel's footprint
// ACROSS the line; it is made fainter by its true cover instead (a line that runs along a flat sight stays a pixel wide)
float ln(float x, float w) { float fa = across(x), ww = w * w + fa * fa; return exp(-x * x / ww) * w / sqrt(ww); }
// A WAVE of length L whose light (or dark) at this place is v, and a quarter in the mean over a whole wave: as the
// footprint across the waves (fa) outgrows them, what is drawn goes to that MEAN (a true averaging), not to nought
float wave(float v, float L, float fa) { return mix(.25, v, 1. - smoothstep(.22 * L, .6 * L, fa)); }
// how far p lies outside a line from a to b that is ra thick at a and rb at b
float cap(vec2 p, vec2 a, vec2 b, float ra, float rb) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0., 1.); return length(pa - ba * h) - mix(ra, rb, h); }
// A LINE THINNER THAN THE RIM THROWS NO MORE DARK THAN ITS COVER: the rim (CAST_RIM either way of the line's edge) is
// the ripples' blur, and a blur keeps the sum: where a line's half thickness r is under CAST_RIM its strength falls
// by thin(r), so that the dark summed across the line is its true breadth's worth (2 r) at every thickness: thin is
// 2 r over the sum across the rim's own curve where the line's middle cuts it short (q: r over CAST_RIM)
float thin(float r) { float q = clamp(r / ${_(Te)}, 0., 1.), u = .5 - .5 * q; return q / (1. - 2. * u + 2. * u * u * u - u * u * u * u); }
// the strength at p of the shade of the round piece from a to b (ra thick at a, rb at b): half at the line's edge,
// CAST_RIM either way, times thin
float castS(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0., 1.), r = mix(ra, rb, h);
  return thin(r) * (1. - smoothstep(-${_(Te)}, ${_(Te)}, length(pa - ba * h) - r));
}
// THE WATERLINE OF AN ANIMAL (order three, addendum 5: a body must sit IN the water): at the point p of its own space
// (x ahead, z to the right; k its scale): a thin bright curl of water round chest, flank and quarters where the body
// meets the surface, brightest at the chest, alive (it comes and goes along the body), and a soft darker line of
// contact close round it. Gives (light, dark).
vec2 waterline(vec2 p, float k, float bull, float t, float ph) {
  float r = mix(.31, .44, bull) * k;
  float d = cap(p, vec2(mix(-.80, -.92, bull), 0.) * k, vec2(mix(.72, .84, bull), 0.) * k, r, r * .8);
  float n = .3 + .7 * vnoise(vec2(atan(p.y, p.x) * 2.5 + ph, t * .8 + ph));
  float fore = .55 + .45 * smoothstep(-.6, .7, p.x / k);
  return vec2(ln(d - .08, .075) * n * fore * .85, smoothstep(-.3, -.02, d) * (1. - smoothstep(.02, .5, d)) * 1.15);
}
void main() {
  vec2 el = vW.xz / vec2(${_(s.WATER_A,1)}, ${_(s.WATER_B,1)});
  if (dot(el, el) > 1.) discard;
  float kind = vM.x, t = uTime, light = 0., dark = 0., deepK = .62, brown = 0., bullK = 0.;
  vec2 q = vQ.xy, e = vQ.zw;
  float edge = 1. - smoothstep(.72, 1., max(abs(e.x), abs(e.y)));
  vec3 sunHere = sunAt(vW.xyz + vec3(0., .05, 0.));
  float sunL = dot(sunHere, vec3(.3333));
  if (kind < .5) {
    // the soft shade a hull throws into the shallow water (strongest in the open sun)
    dark = (1. - smoothstep(.25, 1., length(e))) * (.35 + .6 * sunL);
    edge = 1.;
  } else if (kind < 1.5) {
    // A HULL'S WASH (vM.y, vM.z: its half length and half beam; vW.w: the way it goes): a low white wash along the
    // hull, a little more at stem and stern, heaped at the end it is moving toward and trailing off the other; one
    // broad soft ripple going out from the hull's own shape; a soft dark line of contact where it sits in the water
    vec2 ab = vec2(vM.y, vM.z);
    float k = length(q / ab), d = (k - 1.) * k / max(length(q / (ab * ab)), 1e-3);
    float along = q.x / ab.x, go = -vW.w;
    float lead = clamp(.5 + .5 * along * sign(go), 0., 1.);
    float ends = smoothstep(.72, 1., abs(along));
    float band = ln(d - .16, .17) * (.22 + .3 * ends + .55 * abs(go) * lead * lead + .15 * vnoise(vec2(along * 5. + t * .6, t * .25 + vM.w)));
    float s = sin(6.2832 * (d / 1.5 - t * .22) + vM.w);
    float env = smoothstep(.25, .6, d) * exp(-max(d, 0.) / 1.1), fa = across(d);
    light = band + env * wave(sq(max(s, 0.)), 1.5, fa) * .3;
    dark = env * wave(sq(max(-s, 0.)), 1.5, fa) * .25 + ln(d - .03, .17) * .8;
  } else if (kind < 2.5) {
    // AN OAR'S DIP (order three, addendum 5: a boat held against its oars sits in rings): white water round the blade
    // while it pulls (a splash as long as the blade, going aft with it); when the blade comes out, the water it
    // leaves spreads as A THIN PALE RING that grows to two metres over two beats, drifting off from the hull, and
    // fades; a smaller ring where it went in. Each oar's own (vM.y: which side of the hull it is on).
    float ph = vM.z * t + vM.w, inw = smoothstep(-.2, .5, sin(ph));
    float c = cos(ph), bx = ${_(ke)} * c;
    vec2 dq = q - vec2(bx, 0.), from = vec2(-${_(ke)}, 0.), drift = vec2(-.12, .3 * vM.y);
    float a1 = fract((ph - 2.6) / 6.28319), a2 = fract((ph + .2) / 6.28319);
    float r1 = length(q - from - drift * a1), r1b = length(q - from - drift * (a1 + 1.)), r2 = length(q - vec2(${_(ke)}, 0.));
    // (the splash and the water it leaves: soft patches, never smaller than the pixel's footprint across each of their
    // two breadths (fx, fy) and fainter by their true cover, the product of the two breadths' shares: the one filter)
    float fx = across(q.x), fy = across(q.y);
    vec2 dl = q - from - drift * a1;
    float splash = inw * exp(-(dq.x * dq.x / (.035 + fx * fx) + dq.y * dq.y / (.16 + fy * fy))) * sqrt(.035 * .16 / ((.035 + fx * fx) * (.16 + fy * fy)));
    float left = exp(-(dl.x * dl.x / (.07 + fx * fx) + dl.y * dl.y / (.07 + fy * fy))) * (.07 / sqrt((.07 + fx * fx) * (.07 + fy * fy))) * sq(1. - min(a1 * 3., 1.));
    float ring1 = ln(r1 - (.18 + .95 * a1), .07 + .03 * a1) * (1. - .45 * a1);
    float ring1b = ln(r1b - (1.13 + .95 * a1), .1) * .55 * (1. - a1);
    float ring2 = ln(r2 - (.12 + .45 * a2), .07) * sq(1. - min(a2 * 1.8, 1.));
    light = splash * 1.15 + left * .9 + ring1 * .7 + ring1b * .65 + ring2 * .4;
    dark = (ln(r1 - (.36 + .95 * a1), .09) * (1. - .45 * a1) + ln(r1b - (1.33 + .95 * a1), .11) * .55 * (1. - a1)) * .3;
  } else if (kind < 3.5) {
    // A WALKER IN THE WATER (order three, addenda 3 and 5: no ring of foam, but a body that sits in the water),
    // measured from its chest: ITS WATERLINE (above), and behind it ONE V: two soft pale lines, a darker one inside
    // each, two to three body lengths long, lying along the way the animal came (vW.w: how its way bends). No more.
    vec2 wl = waterline(q + vec2(vS1.x, 0.), vS1.z, vS1.y, t, vM.w);
    float x = -q.x, back = max(x, 0.), z = abs(q.y - vW.w * back * back * .5), xp = max(x - .9, 0.);
    float za = mix(.30, .42, vS1.y) * vS1.z + .17 * xp, along = smoothstep(.6, 1.5, x) * exp(-max(x - 2.2, 0.) / 1.8) * vM.y;
    light = wl.x + ln(z - za, .07 + .035 * xp) * along * .45;
    float vd = ln(z - za + .16 + .04 * xp, .09 + .04 * xp) * along * .35;
    dark = max(wl.y, vd); brown = step(vd, wl.y); bullK = vS1.y;
  } else if (kind < 4.5) {
    // A THING THAT STANDS IN THE WATER: faint slow rings round it, more dark than light; an animal's waterline. NO
    // WHITE WATER AT AN ANIMAL: a rearing horse's forelegs come down with no burst (order four)
    float r = length(q), s = sin(6.2832 * (r / .9 - t * vM.y) + vM.w);
    float env = smoothstep(.3, .6, r) * exp(-r / 1.1), fa = across(r);
    light = env * wave(sq(max(s, 0.)), .9, fa) * .12; dark = env * wave(sq(max(-s, 0.)), .9, fa) * .2;
    if (vS1.w > .5) {
      vec2 p = q + vec2(vS1.x, 0.), wl = waterline(p, vS1.z, vS1.y, t, vM.w);
      light += wl.x; if (wl.y > dark) { dark = wl.y; brown = 1.; bullK = vS1.y; }
    }
  } else if (kind < 5.5) {
    // where the drops of a shake fall: five small rings close round the animal, each begun a little after the last,
    // while the shake lasts and just after
    float tau = mod(t + vM.w * 3., vM.y);
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      vec2 c = vec2(.95 * sin(fi * 2.4 + vM.w), 1.0 * cos(fi * 4.1 + vM.w * 1.7));
      float age = (tau - .3 - fi * .2) / 1.1;
      light += step(0., age) * step(age, 1.) * ln(length(q - c) - (.04 + .32 * age), .05) * (1. - clamp(age, 0., 1.)) * .45;
    }
  } else {
    // THE SHADE AN ANIMAL CASTS ON THE FLOOR, BY THE BENT SIGHT (the declared law; the lines CAST above). This
    // fragment is a point S of the surface. The sight from the eye's place to S is bent at S as water bends it (its
    // sine off the plumb divided by WATER_N) and followed down: it meets the floor at F and, on its way, the depth of
    // the animal's bulk at P. THE SHADE IS READ AT F: the lines' shade there (each round piece's own strength, the
    // greatest of them: half at the line's edge, CAST_RIM either way, a thin line fainter by thin), and the sun where
    // the sun's own ray to F enters the water (so "only where the sun lies" is the floor's own, the same for every
    // eye); never legged, and no band runs from the animal to its shade; a horse that rears throws it long. THE
    // ANIMAL'S OWN BULK UNDER THE SURFACE IS READ AT P: a soft dark pool of its own coat's tone, the bulk's plan as a
    // round-ended line (POOL: as much as 0.06 to 0.07 m outside the built body's plan, at the shoulder; half strength
    // at the line's edge), sun or none: seen from the plumb it lies under its animal. Both go out as the sight grows
    // flat (one less the mirror's share: the water's own rule).
    float k = vM.z, bull = vM.y, cR = bull < .5 ? vS1.x : 0., s = 0.;
    bullK = bull;
    cA = vS0.xy; cW = vS0.zw;
    float cot = max(length(cA), 1e-4); cU = cA / cot; cS = 1. / sqrt(1. + cot * cot);
    vec3 I = normalize(vW.xyz - cameraPosition);
    float lh = max(length(I.xz), 1e-5), si = min(lh / ${_(ue)}, .999);
    // (bw: how far the bent sight goes along the water in a metre of depth, in the world; bl: in the animal's own space)
    vec2 bw = I.xz / lh * (si / sqrt(1. - si * si)), bl = vec2(bw.x * vS1.y + bw.y * vS1.z, -bw.x * vS1.z + bw.y * vS1.y);
    vec2 qq = squeeze(q + bl * ${_(s.WATER_DEEP)}), qp = q + bl * mix(${_(Re.horse.deep,4)}, ${_(Re.bull.deep,4)}, bull);
    // (first the one ball that holds every line of the kind: the measure of the shade never lengthens a way, so
    // outside that ball's own shade and the rim no line throws any dark, and the lines are not asked)
    vec3 hold = mix(vec3(${io.horse.hold.map(n=>_(n,4)).join(", ")}), vec3(${io.bull.hold.map(n=>_(n,4)).join(", ")}), bull);
    if (length(qq - shp(vec3(hold.xy, 0.), cR, k)) < hold.z * k + ${_(Te)}) {
      if (bull < .5) {
      ${lo(io.horse)}
      } else {
      ${lo(io.bull)}
      }
    }
    float pr = mix(${_(Re.horse.r,4)}, ${_(Re.bull.r,4)}, bull) * k;
    float pool = cap(qp, vec2(mix(${_(Re.horse.a,4)}, ${_(Re.bull.a,4)}, bull), 0.) * k, vec2(mix(${_(Re.horse.b,4)}, ${_(Re.bull.b,4)}, bull), 0.) * k, pr, pr);
    float pl = 1. - smoothstep(-${_(Te)}, ${_(Te)}, pool);
    // (neither shade nor pool at this point: nothing is drawn)
    if (s <= 0. && pl <= 0.) discard;
    float sl = max(length(uSun.xz), 1e-4), sw = min(sl / ${_(ue)}, .99);
    vec2 into = vW.xz + bw * ${_(s.WATER_DEEP)} + uSun.xz / sl * (sw / sqrt(1. - sw * sw)) * ${_(s.WATER_DEEP)};
    sunHere = sunAt(vec3(into.x, ${Tt} + .05, into.y)); sunL = dot(sunHere, vec3(.3333));
    float shd = s * .8 * smoothstep(.3, .85, sunL);
    dark = max(shd, pl) * (1. - (.07 + .93 * pow(1. - clamp(-I.y, 0., 1.), 3.))); brown = step(shd, pl);
    deepK = .5; edge = 1.;
  }
  // white water is a white thing under the ONE law (the sun's and the cloth's light on it); the dark is the water's own
  // deep tone under the same law's sky; an animal's bulk under the surface takes its own coat (vK), darkened by the
  // water's loss of colour over its kind's own way (POOL)
  float wl = clamp(light, 0., 1.) * .92, wd = clamp(dark, 0., 1.) * deepK * (1. - wl), a = clamp(wl + wd, 0., .92) * edge;
  vec3 white = .85 * (sunHere * uSunCol * .7 + uSkyCol * .9 + uBounceCol * .4);
  vec3 deep = mix(vec3(.2, .3, .25), vK * mix(${Ft(Re.horse.loss)}, ${Ft(Re.bull.loss)}, bullK), brown) * (uSkyCol + sunHere * uSunCol * .1);
  vec3 col = (white * wl + deep * wd) / max(wl + wd, 1e-3);
  gl_FragColor = vec4(hazed(col, vW.xyz), a);
}`,B=`
attribute vec4 aB0; attribute vec4 aB1; attribute vec2 aUV;
uniform float uTime; uniform float uWedge[${t.BALL_SLOTS*16}];
varying vec3 vW; varying vec2 vUV; varying float vA; varying float vS; varying vec2 vUp;
vec2 fam(float d, float a) { return vec2((${_(s.ARENA_A,2)} + d) * cos(a), (${_(s.ARENA_B,2)} + ${_(p,6)} * d) * sin(a)); }
float rowsY(float d) {
  if (d < ${_(De.Z1_D1)}) return ${_(De.Z1_Y0)} + (max(d, ${_(De.Z1_D0)}) - ${_(De.Z1_D0)}) * ${_(s.ROW_H/s.ROW_D,5)};
  if (d < ${_(De.Z2_D0)}) return ${_(De.Z1_Y1)};
  return ${_(De.Z2_Y0)} + (min(d, ${_(De.Z2_D1)}) - ${_(De.Z2_D0)}) * ${_(s.ROW_H/s.ROW_D,5)};
}
void main() {
  float q = (uTime + aB0.y) / aB0.x, turn = floor(q), since = (q - turn) * aB0.x;
  float u = (since - aB0.z) / aB0.w, uc = clamp(u, 0., 1.), show = step(0., u) * step(u, 1.);
  int k = int(mod(turn, 16.)) + int(aB1.w + .5) * 16;
  float wedge = uWedge[k];
  vec2 p0 = fam(${_(g.d)}, wedge + aB1.x), p1 = fam(aB1.z, wedge + aB1.y);
  float y1 = rowsY(aB1.z) + ${_(g.HAND)};
  vec3 c = vec3(mix(p0.x, p1.x, uc), ${_(g.y)} + (y1 - ${_(g.y)}) * uc + ${_(.5*t.BALL_G)} * aB0.w * aB0.w * uc * (1. - uc), mix(p0.y, p1.y, uc));
  // its speed by the same law: a falling ball is drawn as the short stroke of its own motion (AR.BALL_STROKE seconds of it)
  vec3 vel = vec3(p1.x - p0.x, y1 - ${_(g.y)} + ${_(.5*t.BALL_G)} * aB0.w * aB0.w * (1. - 2. * uc), p1.y - p0.y) / aB0.w;
  // A BALL IS ITS TRUE SIZE, ${_(2*t.BALL_R,2)} m across, at every distance
  vec3 V = cameraPosition - c;
  float dist = length(V), r = ${_(t.BALL_R)};
  vec3 Vn = V / max(dist, 1e-3), along = vel - Vn * dot(vel, Vn);
  float sp = length(along), hl = r + .5 * sp * ${_(t.BALL_STROKE)};
  vec3 up = sp > 1e-3 ? along / sp : vec3(0., 1., 0.);
  vec3 right = normalize(cross(up, Vn));
  vec3 w = (modelMatrix * vec4(c + (right * aUV.x * r + up * aUV.y * hl) * show, 1.)).xyz;
  vW = w; vUV = vec2(aUV.x, aUV.y * hl / r); vS = hl / r - 1.; vA = show;
  // (the world's up as the sheet sees it: a ball's underside is dark)
  vUp = vec2(right.y, up.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}`,Dt=`
varying vec3 vW; varying vec2 vUV; varying float vA; varying float vS; varying vec2 vUp;
${eo}
void main() {
  // a round ball drawn out along its stroke (a stadium's shape); the stroke is fainter than the ball at rest
  vec2 o = vec2(vUV.x, sign(vUV.y) * max(abs(vUV.y) - vS, 0.));
  float d = length(o);
  float a = (1. - smoothstep(.8, 1., d)) * vA / (1. + .2 * vS);
  if (a < .01) discard;
  // plain pale wood, round: light above, dark on its underside and round its rim (so that it shows on pale and on dark)
  vec3 alb = vec3(.86, .77, .58) * mix(.3, 1., smoothstep(-.7, .3, dot(o, vUp))) * (1. - .6 * smoothstep(.5, .9, d));
  vec3 col = alb * (sunAt(vW) * uSunCol * .8 + uSkyCol * .8 + uBounceCol * .6);
  gl_FragColor = vec4(hazed(col, vW), a);
}`,jt=`
attribute vec4 aS0; attribute vec4 aS1; attribute vec4 aS2; attribute vec2 aUV;
uniform vec2 uView;
varying vec3 vW; varying vec2 vUV; varying float vA;
${qt}
void main() {
  vec3 fr = thingFrame();
  float kind = aS0.w, t = uTime, age, show;
  {
    // the drops of a shake: thrown while the shake lasts (aS2.y: the drop's own delay), again every ${_(t.SHAKE_FLY)} s of it
    float tau = mod(t + aS2.w * 3., aS2.x);
    age = mod(tau - aS2.y, ${_(t.SHAKE_FLY)});
    show = step(aS2.y, tau) * step(tau - age, ${_(t.SHAKE_LASTS)}) * step(age, aS2.z);
  }
  float u = clamp(age / aS2.z, 0., 1.);
  vec3 l = aS0.xyz + aS1.xyz * age + vec3(0., -${_(.5*t.BALL_G)} * age * age, 0.);
  show *= step(0., l.y);
  vec3 c = (modelMatrix * vec4(toWorld(fr, l), 1.)).xyz;
  vec3 V = cameraPosition - c;
  float dist = length(V), px = 2. * dist / (projectionMatrix[1][1] * uView.y);
  float r0 = aS1.w, r = max(r0, .5 * px);
  vec3 right = normalize(cross(vec3(0., 1., 0.), V) + vec3(1e-5, 0., 0.)), up = normalize(cross(V, right) + vec3(0., 1e-5, 0.));
  vec3 w = c + (right * aUV.x + up * aUV.y) * r * show;
  vW = w; vUV = aUV; vA = show * (r0 / r) * (r0 / r) * (1. - .5 * u);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}`,Qt=`
varying vec3 vW; varying vec2 vUV; varying float vA;
${eo}
void main() {
  float d = length(vUV), a = (1. - smoothstep(.2, 1., d)) * vA;
  if (a < .01) discard;
  vec3 col = .88 * (sunAt(vW) * uSunCol * .72 + uSkyCol * .9 + uBounceCol * .4);
  gl_FragColor = vec4(hazed(col, vW), a);
}`;function ye(n){const f=new U.BufferGeometry;return f.setAttribute("position",new U.Float32BufferAttribute(n.pos,3)),f.setAttribute("normal",new U.Float32BufferAttribute(n.nor,3)),f.setAttribute("aCol",new U.Float32BufferAttribute(n.col,4)),f.setAttribute("aT0",new U.Float32BufferAttribute(n.t0,4)),f.setAttribute("aT1",new U.Float32BufferAttribute(n.t1,4)),f.setAttribute("aP",new U.Float32BufferAttribute(n.pp,4)),f.setAttribute("aQ",new U.Float32BufferAttribute(n.pq,4)),f.setIndex(n.idx),f}function Ze(){return{n:0,idx:[],a:{}}}function Ao(n,f){for(const[w,u]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const S=f(w,u);for(const D in S)(n.a[D]=n.a[D]||[]).push(...S[D])}n.idx.push(n.n,n.n+1,n.n+2,n.n,n.n+2,n.n+3),n.n+=4}function Xe(n,f){const w=new U.BufferGeometry;for(const u in n.a)w.setAttribute(u,new U.Float32BufferAttribute(n.a[u],f[u]));return w.setIndex(n.idx),w}async function Qe(n,f,w={}){const u=new U.Group;u.name="flavian-amphitheatre-arena";const S={triangles:0,calls:0,pieces:{},people:{}},D=(x,nt,vt,J)=>(nt.name=x,nt.frustumCulled=!1,nt.matrixAutoUpdate=!1,nt.updateMatrix(),J!==void 0&&(nt.renderOrder=J),u.add(nt),S.triangles+=vt,S.calls+=1,S.pieces[x]=vt,nt),H=b(n.core,n.seed,{density:w.density,detail:w.detail}),Z={value:new U.Vector2(800,450)},lt={...w.U,uView:Z};await n.yield();const ut=zt(),Q=zt();for(const x of H.boats)Ye(ut,x,Q),await n.yield();for(let x=0;x<H.beasts.length;x++)dt(ut,H.beasts[x]),x%3===2&&await n.yield();for(const x of H.handlers)N(ut,x);await n.yield();const k=ye(ut);await n.yield(),D("boats, crews, animals, handlers",new U.Mesh(k,new U.ShaderMaterial({uniforms:lt,vertexShader:Bt,fragmentShader:Ht,side:U.DoubleSide})),ut.tris);const mt={...lt,uHullA:{value:H.boats.map(x=>new U.Vector4(x.thing.cx,x.thing.cz,x.thing.r,x.thing.a0))},uHullB:{value:H.boats.map(x=>new U.Vector4(x.thing.w,x.thing.p0,x.thing.p1,x.L/t.BOAT_L))},uHullC:{value:H.boats.map(x=>x.B/t.BOAT_B)}},ct=x=>new U.ShaderMaterial({uniforms:mt,vertexShader:be,fragmentShader:re,side:U.DoubleSide,transparent:!0,...x});D("mirrored forms, the nearest face",new U.Mesh(k,ct({depthWrite:!0,colorWrite:!1})),ut.tris,2),D("mirrored forms",new U.Mesh(k,ct({depthWrite:!1})),ut.tris,2.1),await n.yield(),D("oars",new U.Mesh(ye(Q),new U.ShaderMaterial({uniforms:lt,vertexShader:Bt,fragmentShader:Ht,side:U.DoubleSide,transparent:!0})),Q.tris,2.5);{const x=Ze(),nt=(J,At,Jt,le,We,V={})=>Ao(x,(kt,$)=>({position:[At[0]+kt*Jt[0],0,At[1]+$*Jt[1]],aT0:[J.cx,J.cz,J.r,J.a0],aT1:[J.w,J.mode,J.p0,J.p1],aM:We,aC:[(V.q0||At)[0],(V.q0||At)[1],le,V.curv||0],aN:V.n||[0,0,0,0],aK:V.coat||[0,0,0],aUV:[kt,$]}));for(const J of H.boats){nt(J.thing,[0,0],[J.L/2+.9,J.B/2+.75],.02,[me.SHADE,.55,0,0]),nt(J.thing,[0,0],[J.L/2+2.6,J.B/2+2.6],.03,[me.WASH,J.L/2+.05,J.B/2+.04,J.beatPhase]);for(const At of J.thwarts)for(const Jt of[-1,1]){const le=Lt(J).ST.reduce((We,V,kt,$)=>kt+1<$.length&&At>=V[0]&&At<=$[kt+1][0]?V[1]+($[kt+1][1]-V[1])*(At-V[0])/($[kt+1][0]-V[0]):We,J.B/2)+(t.OAR_OUT-t.BLADE_L/2)*Math.cos((t.DIP_IN+t.DIP_OUT)/2);nt(J.thing,[At,Jt*le],[2.9,2.9],.04,[me.OAR,Jt,J.beat,J.beatPhase])}}for(const J of H.beasts){const At=Y(J),Jt=J.kind==="horse",le=J.thing,We=(Jt?.84:.86)*At,V=W(J.kind,At,!!J.rear)+ge,kt=J.gait==="walk",$=Jt?0:1,st=(Jt?Kt:Ot)[J.coat].coat.slice(0,3);nt(le,[0,0],[V,V],.02,[me.CAST,$,At,0],{q0:[0,0],coat:st}),kt?nt(le,[We-4.4,0],[5.5,3.2],.035,[me.WAKE,1,1,J.ph],{q0:[We,0],n:[We,$,At,1],coat:st}):nt(le,[.1,0],[2.4,2.4],.035,[me.RINGS,.3,0,J.ph],{q0:[.1,0],n:[.1,$,At,1],coat:st}),J.shaker&&nt(le,[.2,0],[1.9,1.9],.045,[me.DROPS,J.shaker,0,J.ph])}const vt=Xe(x,{position:3,aT0:4,aT1:4,aM:4,aC:4,aN:4,aK:3,aUV:2});D("marks on the water",new U.Mesh(vt,new U.ShaderMaterial({uniforms:lt,vertexShader:fo,fragmentShader:Oo,transparent:!0,depthWrite:!1,side:U.DoubleSide})),x.n/2,1)}await n.yield();{const x=Ze(),nt=new Float32Array(t.BALL_SLOTS*16);H.showers.forEach((J,At)=>J.wedges.forEach((Jt,le)=>{nt[At*16+le]=Jt}));for(const J of H.balls){const At=H.showers[J.slot];Ao(x,(Jt,le)=>({position:[0,0,0],aB0:[At.period,At.offset,J.delay,J.fly],aB1:[J.a0,J.a1,J.d1,J.slot],aUV:[Jt,le]}))}const vt=Xe(x,{position:3,aB0:4,aB1:4,aUV:2});D("prize balls",new U.Mesh(vt,new U.ShaderMaterial({uniforms:{...lt,uWedge:{value:nt}},vertexShader:B,fragmentShader:Dt,transparent:!0,depthWrite:!1,side:U.DoubleSide})),x.n/2,4)}{const x=Ze();for(const vt of H.spray){const J=vt.thing;Ao(x,(At,Jt)=>({position:[0,0,0],aT0:[J.cx,J.cz,J.r,J.a0],aT1:[J.w,J.mode,J.p0,J.p1],aS0:[vt.o[0],vt.o[1],vt.o[2],vt.kind],aS1:[vt.v[0],vt.v[1],vt.v[2],vt.r],aS2:vt.tim,aUV:[At,Jt]}))}const nt=Xe(x,{position:3,aT0:4,aT1:4,aS0:4,aS1:4,aS2:4,aUV:2});D("spray",new U.Mesh(nt,new U.ShaderMaterial({uniforms:lt,vertexShader:jt,fragmentShader:Qt,transparent:!0,depthWrite:!1,side:U.DoubleSide})),x.n/2,3)}await n.yield();const yt=G(H);for(const x of yt)S.people[x.who]=(S.people[x.who]||0)+1;S.people.all=yt.length,S.beasts=H.beasts.length,S.boats=H.boats.length,S.balls=H.balls.length,S.drops=H.spray.length;const St=[0,0,0];return{object:u,info:S,plan:H,people:()=>yt,count:x=>ht(H,x),marks(x,nt){let vt=0;for(const J of H.boats)i(J.thing,x,St),nt[4*vt]=St[0],nt[4*vt+1]=St[1],nt[4*vt+2]=J.L*.7,nt[4*vt+3]=.3,vt++;for(const J of H.beasts){if(vt>=24)break;i(J.thing,x,St),nt[4*vt]=St[0],nt[4*vt+1]=St[1],nt[4*vt+2]=J.thing.r>0?2:1.6,nt[4*vt+3]=J.thing.r>0?.14:.1,vt++}return vt},update(x,nt,vt){n.renderer.getDrawingBufferSize(Z.value)},dispose(){}}}return{READY:!0,liePoints:d,liesFree:L,lieClear:y,clothOff:v,AR:t,thingAt:i,thingPoint:c,rowsY:A,famPoint:l,arenaPlan:b,showerAt:ot,BALL_FROM:g,ballAt:M,arenaPeople:G,personAt:q,thingClocks:X,arenaCount:ht,rearUp:h,HULL:at,hullOf:Lt,PART:bt,beastTop:z,beastScale:Y,MARK:me,buildArena:Qe,shadeCount:{HORSE:Pe,BULL:ze,CAST:io,POOL:Re,CAST_RIM:Te,WATER_N:ue,SUN_LOW:O,castReach:W,buildBeast:dt,mesh:zt}}})();export{Na as AIR,Lo as ALTAR,$a as ARC,Pa as ARCADE,mo as ARENA,uo as BAY_W,de as BK,Ce as BOWLC,no as CLOTH,Ne as COLOUR,co as CROWD,He as DEG,ba as FARCITY,oa as FLIGHT,Qo as GARDEN,ae as KIND,eo as LIGHT_GLSL,s as M,Ho as MARKET,Fo as NOISE_GLSL,ko as OUTSIDE,je as PORCH,xo as REACH,Ct as RIG,Be as ROPE,Vo as ROUTE,ua as RUNS,ts as SEATING,De as SECTION,to as SKYSHADE,go as VALANCE,oo as VALLEY,Wt as WALLC,Ka as altarPlan,ia as arcadeFloor,Xa as arcadePlan,vo as bayFrames,Bo as bayPoint,Ua as buildHero,ka as clothLift,ra as clothRest,Wa as clothRuns,$o as dyeOf,zo as ellipseSteps,Va as farRoofPlan,Ma as farRoofSteps,Ba as flightPlan,Za as flockPlan,qa as gardenPlan,Qa as groundPlan,ro as groundY,Ro as hillMasses,Co as knotLoose,da as lookThings,Ha as marketMore,la as marketPlan,Ea as mastHeads,Aa as mastLine,ja as outsidePlan,Ia as outsideStreams,Da as pineTree,za as placesOfPeople,na as rigRest,_o as ringA,To as ringB,Ya as ropeSway,wo as routeLaw,fa as routePoints,ya as rowTree,Fa as sunVector,Ja as terracePlan,Oa as terraceRows,Ga as townPlan};
