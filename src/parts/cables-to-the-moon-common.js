import*as m from"three";import{makeRng as _,hashSeed as B}from"../kit/core.js";const I=Math.PI/180;function ae(t,o,e,a,n=!1){return o||(n||(console.error('cables-to-the-moon: the stream "'+e+'" was not handed to its part; it is made here from the seed and that name'),t&&(t.missing=t.missing||[]).push(e)),_(B((t?.visit??a?.seed??0)+":"+e)))}const v=(t,o=1)=>new m.Color(t).multiplyScalar(o),z=(t,o,e)=>Math.min(e,Math.max(o,t)),H=(t,o,e)=>t+(o-t)*e,S=(t,o,e)=>{const a=z((e-t)/(o-t),0,1);return a*a*(3-2*a)},ne=t=>t-Math.floor(t),R=700,G=.15,D=t=>t<300?H(7,4.5,z(t/300,0,1)):H(4.5,3,z((t-300)/400,0,1)),V=new m.Vector3(0,.407,-.914).normalize(),P=new m.Vector3(0,.914,.407).normalize();function K(t=1){const o=new m.Vector3,e={mx:t,P:new m.Vector3(0,95,-400),d:V.clone(),X:new m.Vector3(t,0,0),n:P.clone(),L:R,radius:D,at(r,l,h,f=new m.Vector3){return f.copy(e.P).addScaledVector(e.d,r).addScaledVector(e.X,l).addScaledVector(e.n,h)},matrix(r,l=new m.Matrix4){const h=e.at(r,0,0,o);return l.set(e.X.x,e.n.x,-e.d.x,h.x,e.X.y,e.n.y,-e.d.y,h.y,e.X.z,e.n.z,-e.d.z,h.z,0,0,0,1)},coords(r,l=new m.Vector3){return o.copy(r).sub(e.P),l.set(o.dot(e.d),o.dot(e.X),o.dot(e.n))}};e.hub={H:e.at(701,-18.4,-13.8),R:23,r:2.5,s:701,x:-18.4,m:-13.8};const a=[];for(let r=-30;r<90;r+=1.5)a.push(r);for(let r=0;r<=61;r++)a.push(H(90,R,r/61));const n=new m.Vector3,i=new m.Vector3,c=new m.Vector3;e.stations=a,e.fall=r=>1-S(0,G,r/R),e.course=(r,l=new m.Vector3)=>{const h=r>=0?r:-8*(1-Math.exp(r/8));return e.at(h,0,0,l),r<0&&(l.y-=h-r),l},e.girth=r=>D(Math.max(r,0))*(1-.25*S(0,-30,r));const d=r=>{let l=0,h=a.length-2;for(;l<h;){const f=l+h+1>>1;a[f]<=r?l=f:h=f-1}return l},p=(r,l)=>z((r-a[l])/(a[l+1]-a[l]),0,1),x=(r,l)=>(e.course(a[r],c),l(c.x,c.z)*e.fall(a[r]));return e.sunk=(r,l)=>{const h=d(r);return H(x(h,l),x(h+1,l),p(r,h))},e.offset=(r,l,h=new m.Vector3)=>{if(h.set(0,-e.sunk(r,l),0),r>=0)return h;const f=d(r);return e.course(a[f],n).sub(e.at(a[f],0,0,c)),e.course(a[f+1],i).sub(e.at(a[f+1],0,0,c)),h.add(n.lerp(i,p(r,f)))},e}const k=-1,q=320,j=.001,C=55,U=.0012;function Y(t,o,e=1){const a=Math.hypot(t,o+400),n=a/e,i=S(140,190,n)*(1-S(400,470,n));return S(60,190,a)*(5*Math.sin(t*.0052+o*.0031+.9)+3.5*Math.sin(t*-.0041+o*.0067+2.2))-8*i*Math.sin(Math.PI*(n-275)/130)}function N(t,o,e,a=1){const n=t+34*Math.sin(o*.0131+1.3),i=o+34*Math.sin(t*.0117+4.1);let c=2*Math.sin(n*.0171+i*.0102+.6)+1.4*Math.sin(n*-.0143+i*.0297+2.9)+1*Math.sin(n*.0431+i*-.0284+4.4)+.5*Math.sin(n*.0612+i*.0571+1.1);return c+=.7*Math.sin(t*.031+o*.034-e*.55)+.4*Math.sin(t*-.052+o*.047-e*.8+2),k+c+Y(t,o,a)}const s=Math.fround,y=t=>t-Math.floor(t);function L(t,o){let e=y(s(s(t)*s(.1031))),a=y(s(s(o)*s(.103)));const n=s(s(e*s(a+s(33.33)))+s(a*s(e+s(33.33))));return e=s(e+n),a=s(a+n),y(s(s(e+a)*e))}function W(t,o){let e=y(s(s(t)*s(.1031))),a=y(s(s(o)*s(.103))),n=y(s(s(t)*s(.0973)));const i=s(s(s(e*s(a+s(33.33)))+s(a*s(n+s(33.33))))+s(n*s(e+s(33.33))));return e=s(e+i),a=s(a+i),n=s(n+i),[y(s(s(e+a)*n)),y(s(s(e+n)*a))]}function T(t,o){const e=Math.floor(t),a=Math.floor(o);let n=t-e,i=o-a;return n=n*n*(3-2*n),i=i*i*(3-2*i),H(H(L(e,a),L(e+1,a),n),H(L(e,a+1),L(e+1,a+1),n),i)}function re(t,o,e,a){const n=Math.floor((t-10)/34+13)-1,i=Math.floor((o+10)/34+13)+1,c=Math.floor((e-10)/34+13)-1,d=Math.floor((a+10)/34+13)+1,p=i-n+3,x=(h,f)=>(f-c+1)*p+(h-n+1),r=new Array(p*(d-c+3));for(let h=c-1;h<=d+1;h++)for(let f=n-1;f<=i+1;f++){const u=W(f,h),w=(f+u[0]-13)*34,A=(h+u[1]-13)*34;let E=w,g=A;for(let b=0;b<10;b++){const F=20*(T(E*.023,g*.023)-.5),M=20*(T(E*.023+9.3,g*.023+9.3)-.5);E=w-F,g=A-M}r[x(f,h)]={x:E,z:g,qx:f+u[0],qz:h+u[1],id:L(f+7.7,h+7.7)}}const l=[];for(let h=c;h<=d;h++)for(let f=n;f<=i;f++){const u=r[x(f,h)],w=[];let A=1/0,E=null;for(let g=-1;g<=1;g++)for(let b=-1;b<=1;b++){if(!b&&!g)continue;const F=r[x(f+b,h+g)],M=Math.hypot(F.qx-u.qx,F.qz-u.qz);w.push(M),M<A&&(A=M,E=F)}w.sort((g,b)=>g-b),l.push({x:u.x,z:u.z,id:u.id,qx:u.qx,qz:u.qz,r:17*A,room:17*(w[1]+w[2]+w[3])/3,nx:E.x,nz:E.z})}return l}const X=(t,o)=>.55*T(t,o)+.28*T(t*2.03+17.3,o*2.03+17.3)+.17*T(t*4.1+31.7,o*4.1+31.7);function $(t,o,e){if(y(t*91.73)<.04)return 1.5;const a=S(.5,.68,X(o*.136+41,e*.136+41));return H(.72,1.28,y(t*17.3))*(y(t*53.9)<H(.1,.7,a)?H(.62,.48,a):1)}const J=t=>{const o=y(t*13.37);return y(t*91.73)<.04?10+6*o:6*o*o};function Z(t,o,e=0,a=1){const n=(t+20*(T(t*.023,o*.023)-.5))/34+13,i=(o+20*(T(t*.023+9.3,o*.023+9.3)-.5))/34+13,c=Math.floor(n),d=Math.floor(i);let p=64,x=0,r=0,l=0;for(let u=-1;u<=1;u++)for(let w=-1;w<=1;w++){const A=W(c+w,d+u),E=c+w+A[0]-n,g=d+u+A[1]-i,b=E*E+g*g;b<p&&(p=b,x=L(c+w+7.7,d+u+7.7),r=c+w+A[0],l=d+u+A[1])}const h=$(x,r,l),f=z(2.3*p/(h*h),0,1);return N(t,o,e,a)+J(x)*(1-f)-7*f}function Q(t,o,e){let a=0;const n=Math.hypot(o,e);for(const i of t.lumps??[]){const c=o-i.x,d=e-i.z;a+=t.h*i.k*Math.exp(-(c*c+d*d)/(2*i.s*i.s))}return a*Math.min(Math.max((1-n)/.4,0),1)}function se(t,o,e){const a=Math.hypot(o-t.x,e-t.z);return a>=t.r?0:t.h*Math.pow(1-a/t.r,t.p)+Q(t,(o-t.x)/t.r,(e-t.z)/t.r)}function ie(t={}){const o=(t.sunAz??-38)*I*(t.mirror?-1:1),e=(t.sunEl??15)*I,a=new m.Vector3(Math.sin(o)*Math.cos(e),Math.sin(e),-Math.cos(o)*Math.cos(e)),n={uTime:{value:0},uPx:{value:.002},uSunDir:{value:a},uSunCol:{value:v(t.sunCol??"#FFE2A6",t.sunI??3.4)},uHemiSky:{value:v("#E6D69C",1.2)},uHemiGnd:{value:v("#2F5E22",1.2)},uHemiSkyB:{value:v("#3A3050",.6)},uHemiGndB:{value:v("#2F5E22",.95)},uAirK:{value:new m.Vector4(k,q,.662,0)},uFogCol:{value:v("#E9D796")},uLandAir:{value:v("#E9D796")},uHazeCol:{value:v("#F2DC9A")},uFog:{value:new m.Vector4(j,U,q,16)},uRingK:{value:(t.hillR??112.5)/112.5},uBend:{value:new m.Vector4(0,-3600,0,0)},uHills:{value:Array.from({length:10},()=>new m.Vector4(0,0,0,1))},uLeafA:{value:v(t.leafA??"#5E9B2E")},uLeafB:{value:v(t.leafB??"#3F7F2A")},uLeafT:{value:v(t.leafT??"#9FD23C")},uLeafD:{value:v(t.leafD??"#173A1C")}},i=(x,r)=>{const l=n.uBend.value,h=x-l.x,f=r-l.y,u=h*h+f*f,w=l.z;return l.w+w*u/(1+Math.sqrt(Math.max(1-w*w*u,0)))},c=K((t.mirror?-1:1)*(t.away?-1:1)),d=n.uRingK.value,p=(x,r,l=0)=>N(x,r,l,d);return{U:n,sunDir:a,drop:i,cable:c,hub:c.hub,hump:p,roof:(x,r,l=0)=>Z(x,r,l,d),ringK:d}}const he=(t,o={})=>({...t,...o}),ee="#4E5842",O=v(ee,.85),te=.7,le=`
uniform float uTime, uPx;
uniform vec3 uSunDir, uSunCol, uHemiSky, uHemiGnd, uHemiSkyB, uHemiGndB, uFogCol, uLandAir, uHazeCol, uLeafA, uLeafB, uLeafT, uLeafD;
uniform vec4 uFog, uBend, uAirK;
uniform vec4 uHills[10];
uniform float uRingK;
float cmH(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.x); }
vec2 cmH2(vec2 p){ vec3 q = fract(vec3(p.xyx)*vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz)*q.zy); }
float cmH3(vec3 p){ p = fract(p*0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y)*p.z); }
float cmN(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(cmH(i), cmH(i + vec2(1.,0.)), f.x), mix(cmH(i + vec2(0.,1.)), cmH(i + vec2(1.,1.)), f.x), f.y);
}
float cmN3(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  float a = mix(mix(cmH3(i), cmH3(i + vec3(1.,0.,0.)), f.x), mix(cmH3(i + vec3(0.,1.,0.)), cmH3(i + vec3(1.,1.,0.)), f.x), f.y);
  float b = mix(mix(cmH3(i + vec3(0.,0.,1.)), cmH3(i + vec3(1.,0.,1.)), f.x), mix(cmH3(i + vec3(0.,1.,1.)), cmH3(i + vec3(1.,1.,1.)), f.x), f.y);
  return mix(a, b, f.z);
}
float cmF(vec2 p){ return 0.55*cmN(p) + 0.28*cmN(p*2.03 + 17.3) + 0.17*cmN(p*4.1 + 31.7); }
float cmF3(vec3 p){ return 0.55*cmN3(p) + 0.28*cmN3(p*2.03 + 17.3) + 0.17*cmN3(p*4.1 + 31.7); }
// how far the forest has fallen away under the point (x, z): see the head of the common file
float cmDrop(vec2 xz){ vec2 q = xz - uBend.xy; float r2 = dot(q, q), k = uBend.z; return uBend.w + k*r2/(1.0 + sqrt(max(1.0 - k*k*r2, 0.0))); }
// the large relief of the roof (the JS function relief() is the same sum)
float cmRelief(vec2 p){
  float r0 = length(p - vec2(0.0, -400.0)), r = r0/max(uRingK, 0.5), ring = smoothstep(140.0, 190.0, r)*(1.0 - smoothstep(400.0, 470.0, r));
  return smoothstep(60.0, 190.0, r0)*(5.0*sin(dot(p, vec2(0.0052, 0.0031)) + 0.9) + 3.5*sin(dot(p, vec2(-0.0041, 0.0067)) + 2.2)) - 8.0*ring*sin(3.14159265*(r - 275.0)/130.0);
}
// the swells of the roof (the JS function hump() is the same sum)
float cmHump(vec2 p, float t){
  vec2 q = p + 34.0*vec2(sin(p.y*0.0131 + 1.3), sin(p.x*0.0117 + 4.1));
  float h = 2.0*sin(dot(q, vec2(0.0171, 0.0102)) + 0.6) + 1.4*sin(dot(q, vec2(-0.0143, 0.0297)) + 2.9)
          + 1.0*sin(dot(q, vec2(0.0431, -0.0284)) + 4.4) + 0.5*sin(dot(q, vec2(0.0612, 0.0571)) + 1.1);
  h += 0.7*sin(dot(p, vec2(0.031, 0.034)) - t*0.55) + 0.4*sin(dot(p, vec2(-0.052, 0.047)) - t*0.8 + 2.0);
  return ${k.toFixed(1)} + h + cmRelief(p);
}
// THE CROWNS. The roof is crown beside crown, about 34 m across, never in rows. x = distance to the nearest
// crown's middle (in crowns), y = how much nearer it is than the next one (0 on the line between two crowns),
// zw = the way to that middle (in crowns); id: that crown's own number
// (sq: that crown's site in the pattern's own cells, the same all over the crown)
vec4 cmCrownQ(vec2 p, out float id, out vec2 sq){
  vec2 q = (p + 20.0*vec2(cmN(p*0.023) - 0.5, cmN(p*0.023 + 9.3) - 0.5))/34.0 + 13.0;
  vec2 n = floor(q), f = fract(q); float d1 = 8.0, d2 = 8.0; vec2 r1 = vec2(0.0); id = 0.0; sq = n;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)), o = cmH2(n + g), r = g + o - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; r1 = r; id = cmH(n + g + 7.7); sq = n + g + o; } else if (d < d2) d2 = d;
  }
  return vec4(sqrt(d1), sqrt(d2) - sqrt(d1), r1);
}
vec4 cmCrown(vec2 p, out float id){ vec2 sq; return cmCrownQ(p, id, sq); }
// THE ONE RULE OF A CROWN'S SIZE (the JS crownSize is the same sum): see there
float cmSize(float id, vec2 sq){
  if (fract(id*91.73) < 0.04) return 1.5;
  float drift = smoothstep(0.5, 0.68, cmF(sq*0.136 + 41.0));
  return mix(0.72, 1.28, fract(id*17.3))*(fract(id*53.9) < mix(0.1, 0.7, drift) ? mix(0.62, 0.48, drift) : 1.0);
}
// how far down a crown's side a point lies, 0 on its top .. 1 in the dark between crowns
float cmSide(float f1){ return clamp(2.3*f1*f1, 0.0, 1.0); }
// how high a crown's top stands over the swell (m), by its own number: most low, one in 25 emergent (the JS
// crownTop is the same sum)
float cmTop(float id){ float h3 = fract(id*13.37); return fract(id*91.73) < 0.04 ? 10.0 + 6.0*h3 : 6.0*h3*h3; }
// the roof itself: the swells, each crown's top standing its own height on them, the gaps between crowns 7 m
// under the swell: THE SAME AT EVERY DISTANCE. Everything that stands on the roof stands on this, so its height
// reads no eye. cmCrownH is the crowns' relief alone (its mean over the roof is -2.7 m, measured over 641,160 points of 36 km2); only the painted sheet
// flattens it, in its own vertex shader, where its own mesh is too coarse to carry a crown (the forest part).
// (mend P, H3: THE RELIEF CALLS THE ONE RULE OF SIZE: a lesser crown's dome is as small in the relief as it is
// painted and built; the JS roofAt is the same sum)
float cmCrownH(vec2 p){ float id; vec2 sq; vec4 c = cmCrownQ(p, id, sq); float s = cmSide(c.x/cmSize(id, sq)); return cmTop(id)*(1.0 - s) - 7.0*s; }
float cmRoof(vec2 p, float t){ return cmHump(p, t) + cmCrownH(p); }
// gusts running over the leaves: 0..1, bands about 60 m wide moving with the wind
float cmGust(vec2 p, float t){ float g = cmN(p*0.021 + vec2(t*0.21, -t*0.13)); return smoothstep(0.42, 0.85, g); }
// how far the air has thinned at the height y (0 at the roof .. 1 at the ring's rim): the world file's thinning()
float cmThin(float y){ return clamp((1.0 - exp(-max(y - uAirK.x, 0.0)/max(uAirK.y, 1.0)))/max(uAirK.z, 1e-3), 0.0, 1.0); }
// THE FILL a point gets is the sky's colour at THAT POINT's own height (y: its height in the world)
vec3 cmAmbAt(vec3 n, float y){ float a = cmThin(y); return mix(mix(uHemiGnd, uHemiGndB, a), mix(uHemiSky, uHemiSkyB, a), 0.5 + 0.5*n.y); }
// (every fragment shader of this world carries its point's place in the world as vW). THE LAND'S SINK IS NOT A
// HEIGHT: a thing that stands on the roof takes the fill for the height it had before the land sank under it.
// Its shader says so before this chunk: CM_FOLLOW 1.0, or the share of the land's fall its point takes.
#ifndef CM_FOLLOW
#define CM_FOLLOW 0.0
#endif
#define cmAmb(n) cmAmbAt(n, vW.y + (CM_FOLLOW)*cmDrop(vW.xz))
// (mend T, T3) THE SUN LIGHTS WHAT STANDS BEFORE IT, AND HARDER WITH HEIGHT. ONE LAW OF THE LIGHT, declared here,
// for everything that stands or flies in the air (the cables, the ring, the climbers, their limbs, pods and
// hair, the threads' cap, the fliers): by the SUN'S DIRECTION and by THE THING'S OWN HEIGHT over the leaves
// (cmThin: the air's one thinning, 0 at the leaves, 1 at the height of the ring's rim and above). It reads no
// eye. (The wood's leaves stand at the leaves' level: their light is the leaf's own, cmLeaf.)
//   cmSunAt    the sun on a lit face: its own colour and strength at the leaves; at the rim and above 1.5 of
//              it on red, 1.36 on green, 1.12 on blue (1.39 times as light, and warmer): the raw sun, with no
//              air before it.
//   cmLitAt    how much of it a face takes whose normal makes ndl with the sun's direction: low in the air
//              the soft wrap it always had (((ndl + 0.3) / 1.3) squared: the air's own scatter lights a face
//              turned a little from the sun); as the air thins the wrap narrows, to ((ndl + 0.16) / 1.16)
//              squared: the line between the lit side and the shaded side is sharper.
//   cmBounceAt the forest's green light from below on the shaded side: whole at the leaves, 0.75 of it at
//              the rim and above (0.35 and a wrap of 0.08 were tried first: the climber's under side, seen
//              from the road below it, went to a black shape). The fill (cmAmb) goes to the sky's own dark there, as it did: so a shaded
//              side high up goes toward the dark of the sky, with the roof's green still in it: never black.
#define CM_SUN_RAW vec3(1.5, 1.36, 1.12)
vec3 cmSunAt(float h){ return uSunCol*mix(vec3(1.0), CM_SUN_RAW, cmThin(h)); }
float cmLitAt(float ndl, float h){ float w = mix(0.3, 0.16, cmThin(h)), d = clamp((ndl + w)/(1.0 + w), 0.0, 1.0); return d*d; }
float cmBounceAt(float h){ return mix(1.0, 0.75, cmThin(h)); }
#define cmSunL cmSunAt(vW.y + (CM_FOLLOW)*cmDrop(vW.xz))
#define cmLitL(ndl) cmLitAt(ndl, vW.y + (CM_FOLLOW)*cmDrop(vW.xz))
#define cmBounceL cmBounceAt(vW.y + (CM_FOLLOW)*cmDrop(vW.xz))
// (mend T, T3) HIGH UP A SHADED SIDE GOES TOWARD THE DARK OF THE SKY, NEVER A FLAT BLACK BAR. Low down the air
// that stands before a thing lifts its dark (cmAir); above the air nothing does, and a rope's dark bark in
// shade fell under the picture's own black (the engine's grade shows a linear 0.045 and all under it as
// black): a flat black bar on the sky. So a shaded side is never drawn darker than CM_DEEP, a dark ash
// violet (the sky's own dark seen in a bark's shade: under the sky's colour there on every channel), by
// the share of the air UNDER THE THING (cmThin of its own height: nothing of it at the leaves, all of it
// at the ring's rim), and by the thing's own form (its grooves' and yarns' openness: the caller's), coming
// down to that floor smoothly, as the leaf's does (the forest part's cnDeep). CM_DEEP was set on the whole
// field by the grade's black: at the rim the floor shows as 6 to 35 of 255 (a first trial, 0.066, 0.06, 0.08,
// showed as 50 to 60: the ring's ropes went steel blue).
#define CM_DEEP vec3(0.057, 0.055, 0.061)
vec3 cmDeepAt(vec3 col, float h, float form){
  vec3 f = max(CM_DEEP*(cmThin(h)*form), vec3(1e-5)), x = 8.0*(col - f)/f;
  return f + 0.125*f*mix(log(1.0 + exp(min(x, vec3(20.0)))), x, step(vec3(20.0), x));
}
#define cmDeepL(col, form) cmDeepAt(col, vW.y + (CM_FOLLOW)*cmDrop(vW.xz), form)
// THE LIGHT OF A THREAD OF THE WEB (mend R, V1: one law, declared here, for the web's strands and for the new
// strand the climber pays out). Nothing of a thread shines of itself. h: the thread's own height over the
// leaves' level under it.
//   cmThreadDull  what it has without the sun: half the fill from below at its height and a little of its own
//                 pale green (the sky's light and the roof's: all a thread has in the night).
//   cmThreadSun   how much of the sun it can catch, as a brightness (never the sun's colour: what it catches
//                 it gives back in its own pale green-silver): 0.3 of the sun's, times the thick air's share
//                 at its height (cmThin, the fill's own measure: whole at the leaves, nothing at the height of
//                 the ring's rim).
//   cmThreadCap   A THREAD IS NEVER BRIGHTER THAN THE LIT ROPE BESIDE IT: its colour is held under the
//                 brightness of the main cable's bark lit full by the same sun (the rope's own sum: 0.72 of
//                 three quarters of the sun, the fill at the thread's height and the roof's light from
//                 below). A glint or a bead is a paler run on the strand; no strand is a bright wire.
vec3 cmThreadDull(float h){ return (cmAmbAt(vec3(0.0, -0.4, 0.0), h) + vec3(0.10, 0.12, 0.06))*0.5; }
float cmThreadSun(float h){ return dot(uSunCol, vec3(0.3, 0.5, 0.2))*0.3*(1.0 - cmThin(h)); }
vec3 cmThreadCap(vec3 col, float h){
  vec3 ropeLit = vec3(${O.r.toFixed(4)}, ${O.g.toFixed(4)}, ${O.b.toFixed(4)})*0.72*(cmSunAt(h)*0.75 + cmAmbAt(vec3(0.0, 0.0, 1.0), h)*0.6 + cmBounceAt(h)*vec3(0.42, 0.47, 0.3)*dot(uSunCol, vec3(0.33))*0.48);
  return col*min(1.0, dot(ropeLit, vec3(0.3, 0.5, 0.2))/max(dot(col, vec3(0.3, 0.5, 0.2)), 1e-4));
}
// THE PIXEL'S FOOTPRINT (antialiasing; declared once, here, for every part of this world): the metres of a
// thing's own surface that one pixel covers, from the screen derivatives of the thing's own place (fragment
// shaders only). A pattern smaller than a few pixels goes to its mean by this and by nothing else (a painted
// crown's round: to the mean of what the ray sees of it, see WHICH REACH below): no tone,
// shade, relief or presence of any thing goes by metres from the eye. What does read the eye's place: the air
// along the ray (cmAir, cmHaze below: fog), the sky's far plane, and a thread or far rope
// never drawn narrower than 1.6 pixels (0.8 of a pixel to each side of its middle); a thread is dimmed by as much as it is widened (a web strand by the power 1.5 of that, its beads by that itself: the web part),
// a rope is not: it stays solid (cmRibbon, the web part's rope: vertex shaders, the eye's depth times the pixel's angle).
// WHICH REACH (mend R: said once, here, as it is). A pixel covers a patch of a surface with two reaches, one
// along the screen's x and one along its y; seen edge-on the two differ many times over.
//   cmPx     THE MEAN OF THE TWO (the root of their product): the limbs, the pods, the ropes, the boughs, the
//            leaves and the fliers go by it.
//   cmPxMax  THE LARGER OF THE TWO: the hero's hide (and the second's) goes by it, and the roof's sheet goes by
//            its own larger reach on the map (the forest part's fw, widened by the same ratio): on a surface
//            that turns edge-on to the eye no pattern is left hard along the short reach.
//   and THE CROWNS PAINTED ON THE ROOF ARE RELIEF DRAWN BY THE RAY (mend T; the forest part, SHEET_FRAG): a
//   crown's round goes by THE PIXEL'S REACH ON THAT RELIEF, fr = 1/(1/fw + 0.12/fs) (fw, fs: the sheet's
//   larger and smaller reach on the map; a crown's cap stands 0.12 of its width over the crown before it,
//   and the cap is what a flat ray sees of it): whole while fr is under 0.4 of 34 m and at its mean past 0.8
//   of it: crisp while a crown is more than two and a half pixels across, at its mean under one and a
//   quarter. (Mend R faded the round by the smaller reach alone, whole only past 34 pixels: gone.) It is a
//   footprint fade to the MEAN; a picture three times as high keeps the rounds three times as far.
//   THE MEAN OF A CROWN'S ROUND IS THE MEAN OF WHAT THE RAY SEES OF IT, LIGHT AS WELL AS SHADE (the forest
//   part's cnMean, declared once there and counted: seven faces of a dome under the leaf's own light, each
//   side with the whole round's turn-to-the-sun factor and the mean of its lit-through edge; the grain's
//   light goes to its mean over its own spread of tilts the same way: cnLeafG). Mend S2's two numbers
//   (CN_MEAN, CN_MEAN_TOPS) gave back the shade alone: gone.
//   (mend S) On the roof's sheet the land's larger patterns go to their means by the sheet's larger reach
//   too: the swells' light and shade (150 m), the ranks (520 m), the long valleys (600 m): each whole while
//   the reach is under a quarter of its size and at its mean past 0.8 of it. A fade to the MEAN, by the
//   footprint: never a reach round the eye.
#define cmPx(w) sqrt(max(length(dFdx(w)), 1e-5)*max(length(dFdy(w)), 1e-5))
#define cmPxMax(w) max(length(dFdx(w)), length(dFdy(w)))
// THE AIR HAS THREE LAWS, all by the ray from the eye to a thing (fog): the clear air (cmAir), the seed haze
// (the first lines of cmHaze) and the steam's far-air line (the lines marked AIR in cmHaze; stated at cmSteam
// below; its last line loses the far land in the sky's own colour, so the land has no edge). The first two are two things in one air, each a function of a POINT's own height with one constant at the roof that no frame
// changes: clear air (uFog.x a metre at the leaves, thinning by e every uFog.z = 320 m) and the gold seed haze
// that lies on the roof (uFog.y a metre at the leaves, thinning by e every ${C.toFixed(1)} m). What dims a thing is the
// air along the ray from the eye to it. Things in the sky are dimmed by the clear air (the density at the middle
// height of the ray, times its length); things standing on the roof by the haze (its density summed exactly
// along the ray: seen from high over it the ray crosses the layer steeply and the land shows; seen from within
// it the far roof is lost).
// (mend S) THE COLOUR THE AIR TAKES ROUND A THING IS THE AIR'S AT THE THING'S OWN HEIGHT (y: its height in the
// world before the land's sink): the lit air of the land at the leaves (uLandAir), the sky's own colour at the
// horizon as the eye has it (uFogCol) at the height of the ring's rim, by the air's one thinning between. THE
// LAND STANDS IN FULL DAY AT EVERY HEIGHT OF THE EYE: the sun stands still; the sky darkens because we climb
// out of the air, and the air that lies on the land below us is as lit as it was.
vec3 cmAirCol(float y){ return mix(uLandAir, uFogCol, cmThin(y)); }
vec3 cmAir(vec3 col, vec3 p){
  float dist = length(p - cameraPosition);
  float hm = max(0.5*(p.y + cmDrop(p.xz) + uFog.w), 0.0);
  float x = uFog.x*dist*exp(-hm/max(uFog.z, 1.0));
  return mix(col, cmAirCol(p.y + cmDrop(p.xz)), 1.0 - exp(-x*x));
}
// THE STEAM OF THE HOT FOREST, the same thing at every height: banks of steam lying on the roof, with gaps,
// the hills and the high crowns standing out of them. cmSteam(p): how much steam lies where a thing stands, a
// pattern of the PLACE (banks about a kilometre across, 0.2 in a gap to 0.7 in a bank), thinning upward from
// 25 m over the roof by e every 60 m, so a hill's top stands clear of it. Its colour is a warm pale gold, 0.7
// of the haze's own (STEAM_DIM; 0.81 toward the sun at the most: under white on every channel); toward the sun's bearing it is a
// sixth brighter at the most. THE AIR'S OWN LAW BY THE RAY (fog; the lines marked AIR below): a far thing takes
// the steam's colour by the clear air's density, its mean along the ray, coming on softly (CM_SOFT, below: no
// ring where it begins); and never more of it than the steam that lies where the thing stands
// (the cap: many thin layers along a long look never add up to more than that). AND THE LAND HAS NO EDGE: past
// the banks the same air, by the same measure along the ray a quarter longer, takes every thing on the roof
// wholly into the colour of the land's own lit air (cmAirCol at the thing's height: for the land, uLandAir): the
// forest runs out as crowns, paler with distance. HOW FAR THE LAW REACHES (the land's share of that colour):
// seen from the roof a tenth at 0.7 km, half at 1.8 km, 0.99 of it by 4.5 km; seen from the road's end,
// by the ring (the eye 539 m over the roof AS IT HAS SUNK there; made true in mend V: this note named the
// eye 518 m over the roof, which these reaches are not for) a tenth at 1.2 km, half at 3.4 km,
// 0.99 of it by 8.9 km. All of it lies within the land's own mesh
// (12 km: the forest part's makeCanopy) and before the world's limb, and the sky part paints that same
// colour on the limb and under it: no line, no rim, no bare band.
float cmSteam(vec3 p){
  // (the banks drift down the wind, 7 m a second, and are torn: a finer pattern drawn out along the wind)
  vec2 q = p.xz - uTime*vec2(7.0, 2.2);
  float bank = smoothstep(0.3, 0.62, 0.7*cmF(q*0.00045 + 13.0) + 0.3*cmF(vec2(q.x*0.0011 + q.y*0.0003, q.y*0.0031 - q.x*0.0009) + 5.0));
  return mix(0.2, 0.7, bank)*exp(-max(p.y + cmDrop(p.xz) - 25.0, 0.0)/60.0);
}
vec3 cmSteamCol(vec2 rd){
  float sunA = 0.5 + 0.5*dot(rd, uSunDir.xz/max(length(uSunDir.xz), 1e-4));
  return uHazeCol*${te.toFixed(2)}*(1.0 + 0.16*sunA*sunA*sunA);
}
// (mend T, T1 d) CM_SOFT: THE FAR AIR COMES ON SOFTLY. Its share was 1 - exp(-x^5) of the air's measure x along
// the ray: nothing, and then all of it within a doubling of the distance: seen from the height the green
// land ended at a ring round the place under the eye, a disc with a rim, and from low down at a straight
// pale edge. It is 1 - exp(-(x / CM_SOFT)^2) now: HALF AT THE SAME DISTANCE AS BEFORE (CM_SOFT 1.117: the
// fifth root of ln 2 over its square root), a tenth of it at 0.39 of that distance and 0.99 of it at 2.6
// times it. One number for the steam's line and the air's; the air's measure and its colours are mend S's.
#define CM_SOFT 1.117
vec3 cmHaze(vec3 col, vec3 p, float k){
  float dist = length(p - cameraPosition);
  float hp = max(p.y + cmDrop(p.xz), 0.0)/${C.toFixed(1)}, he = max(uFog.w, 0.0)/${C.toFixed(1)}, dh = he - hp;
  float F = abs(dh) > 1e-3 ? (exp(-hp) - exp(-he))/dh : exp(-hp);
  float x = uFog.y*dist*k*clamp(F, 0.0, 1.0);
  col = mix(col, uHazeCol, 1.0 - exp(-x*x));
  float ap = max(p.y + cmDrop(p.xz), 0.0)/max(uFog.z, 1.0), ae = max(uFog.w, 0.0)/max(uFog.z, 1.0), da = ae - ap;
  float Fa = abs(da) > 1e-3 ? (exp(-ap) - exp(-ae))/da : exp(-ap);
  float xa = 0.7*uFog.x*dist*clamp(Fa, 0.0, 1.0)/CM_SOFT;                                         // AIR
  vec2 rd = (p.xz - cameraPosition.xz)/max(length(p.xz - cameraPosition.xz), 1e-3);            // AIR (the ray's bearing)
  col = mix(col, cmSteamCol(rd), (1.0 - exp(-xa*xa))*cmSteam(p));                               // AIR, capped by the steam of the place
  float xb = xa/1.25;                                                                             // AIR
  return mix(col, cmAirCol(p.y + cmDrop(p.xz)), 1.0 - exp(-xb*xb));                               // AIR: the far land is lost in the land's own lit air
}
// THE SHADE OF THE HILLS on the roof (a rule of the place: the sun stands 15 degrees up on the visit's bearing).
// A hill h high and r wide with a hollow flank throws a wedge away from the sun, h/tan(15 deg) long from its
// middle, as wide at a metres from the middle as the hill is at the height the sun's ray has there.
float cmHillShade(vec2 p){
  vec2 sx = uSunDir.xz/max(length(uSunDir.xz), 1e-4); float sh = 0.0;
  for (int i = 0; i < 10; i++) {
    vec4 hl = uHills[i]; if (hl.z < 1.0) continue;
    vec2 q = p - hl.xy; float a = -dot(q, sx), c = abs(q.x*sx.y - q.y*sx.x), Ls = 3.73*hl.z;
    if (a <= 0.0 || a >= Ls || c >= hl.w) continue;
    float w = hl.w*(1.0 - sqrt(clamp(a/Ls, 0.0, 1.0)));
    sh = max(sh, (1.0 - smoothstep(0.55*w, w + 4.0, c))*smoothstep(0.0, 0.25*hl.w, a)*(1.0 - smoothstep(0.75*Ls, Ls, a)));
  }
  return sh;
}
// A LEAF. n: its upper normal, v: unit vector to the eye, tone 0..1, thin 0..1 (how much light comes through),
// ao 1 open .. 0 buried, wax: strength of the sheen. Lit faces are green, faces the sun is behind are stained glass.
vec3 cmLeaf(vec3 n, vec3 v, float tone, float thin, float ao, float wax){
  vec3 nf = dot(n, v) < 0.0 ? -n : n;
  float ndl = dot(nf, uSunDir);
  vec3 alb = mix(uLeafA, uLeafB, tone);
  // the forest stands in its own thick bright air however high we are, and a leaf throws back green before gold:
  // its fill is the forest's daylight, and the sun on it is half the sun's colour, half its brightness in leaf green
  vec3 sunL = mix(uSunCol, dot(uSunCol, vec3(0.3, 0.5, 0.2))*vec3(0.86, 1.0, 0.58), 0.5);
  vec3 fill = mix(vec3(0.035, 0.14, 0.02), vec3(0.86, 0.78, 0.42), 0.5 + 0.5*nf.y);
  vec3 col = mix(uLeafD*1.6, alb, 0.25 + 0.75*ao)*(sunL*max(ndl, 0.0)*0.42 + fill*0.62)*(0.35 + 0.65*ao);
  float toward = clamp(dot(-v, uSunDir), 0.0, 1.0);
  float thr = thin*clamp(0.2 - ndl*2.2, 0.0, 1.0)*(0.22 + 0.78*toward*toward);
  col += uLeafT*uSunCol*thr*0.34*(0.4 + 0.6*ao);
  vec3 h = uSunDir + v; h /= max(length(h), 1e-3);
  float sp = pow(clamp(dot(nf, h), 0.0, 1.0), 110.0)*smoothstep(0.0, 0.08, ndl);
  col += uSunCol*sp*wax*0.2;
  return col;
}
`,ce=`
vec4 cmRibbon(vec3 c, vec3 t, float side, float w, out float k){
  vec4 mv = viewMatrix*vec4(c, 1.0);
  vec3 tv = mat3(viewMatrix)*t;
  vec3 sd = cross(tv, mv.xyz); sd /= max(length(sd), 1e-5);
  float wd = max(w, uPx*0.8*max(-mv.z, 0.1));
  k = w/wd;
  mv.xyz += sd*side*wd;
  return mv;
}
`;class fe{constructor(o={}){this.p=[],this.n=[],this.i=[],this.count=0,this.names=Object.keys(o),this.sizes=o,this.a={};for(const e of this.names)this.a[e]=[];this.cur={};for(const e of this.names)this.cur[e]=new Array(o[e]).fill(0)}set(o,...e){return this.cur[o]=e,this}v(o,e,a,n=0,i=1,c=0){this.p.push(o,e,a),this.n.push(n,i,c);for(const d of this.names){const p=this.cur[d],x=this.a[d];for(let r=0;r<this.sizes[d];r++)x.push(p[r]??0)}return this.count++}tri(o,e,a){this.i.push(o,e,a)}quad(o,e,a,n){this.i.push(o,e,a,o,a,n)}stitch(o,e,a,n=!1){for(let i=0;i<e-1;i++)for(let c=0;c<a;c++){const d=o+i*(a+1)+c,p=d+a+1;n?this.i.push(d,d+1,p,d+1,p+1,p):this.i.push(d,p,d+1,d+1,p,p+1)}}geometry(o=!1){const e=new m.BufferGeometry;e.setAttribute("position",new m.Float32BufferAttribute(this.p,3)),e.setAttribute("normal",new m.Float32BufferAttribute(this.n,3));for(const a of this.names)e.setAttribute(a,new m.Float32BufferAttribute(this.a[a],this.sizes[a]));return e.setIndex(this.count>65535?new m.Uint32BufferAttribute(this.i,1):new m.Uint16BufferAttribute(this.i,1)),o&&e.computeVertexNormals(),e}get triangles(){return this.i.length/3}}const de=(t,o,e,a,n)=>(t.boundingSphere=new m.Sphere(new m.Vector3(o,e,a),n),t);function me(t,o){let e=0;for(let a=0;a<o.length;a++){const n=o[a],i=Math.abs(t-n.x),c=i-60*n.z;e-=n.y*n.w*Math.exp(-i/38),e+=.6*n.y*Math.exp(-n.z*.3)*Math.exp(-c*c/2025)*Math.sin(c*.0698)}return e}const ue=`
uniform vec4 uGr[7];
float cmCableDip(float s){
  float y = 0.0;
  for (int i = 0; i < 7; i++) {
    vec4 g = uGr[i]; float ds = abs(s - g.x), ph = ds - 60.0*g.z;
    y -= g.y*g.w*exp(-ds/38.0);
    y += 0.6*g.y*exp(-g.z*0.3)*exp(-ph*ph/2025.0)*sin(ph*0.0698);
  }
  return y;
}
`;export{q as AIR_H,j as AIR_RHO,v as C,V as CABLE_D,G as CABLE_FALL,R as CABLE_L,P as CABLE_N,le as CM_GLSL,ce as CM_RIBBON,I as DEG,ue as DIP_GLSL,fe as Geo,C as HAZE_H,U as HAZE_RHO,k as ROOF_Y,ee as ROPE_BARK,te as STEAM_DIM,de as bound,me as cableDip,D as cableRadius,z as clamp,ae as cmStream,re as crownSites,$ as crownSize,J as crownTop,ne as fract,N as hump,H as lerp,K as makeFrame,ie as makeShared,se as peakH,Q as peakLump,Y as relief,Z as roofAt,S as sstep,he as withShared};
