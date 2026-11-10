import*as f from"three";const Me=["#1F5A4A","#E9C75A","#D9A441","#E9E2CC","#17211C","#B5361E","#9A4A2C"],Xe={flat:1,bloom:{strength:0},grade:{saturation:1,contrast:1,vignette:0,grain:0}},Le=`
uniform vec3 uGreen, uYellow, uOchre, uWhite, uWhiteSh, uInk, uRed, uRedSh;
uniform float uU, uTime, uAgree;      // uU: journey progress 0..1 (the hour).  uAgree: 0..1, every false sun swings to uSunAll
uniform vec3 uSunAll;
float sqHash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
// coverage of a ruled line: d = distance in metres from the ruled edge, w = its width in metres; never under 1.5 pixels
// one layer of dry-brush drag: flecks FIXED TO THE WALL (cells of "cell" metres; a share dens of them, in loose runs along
// some of the rows, hold a fleck 0.35 to 0.9 of the cell long and a quarter of it high).  On screen a fleck is never over
// 2.5 pixels high or 12 long (it is drawn thinner, in its place, as we come close) and fades to flat chalk where it would
// be under a pixel high or 4 long: height is measured by fw.y and length by fw.x, so an oblique face carries no chips.
float sqDrag(vec2 uv, vec2 fw, vec2 cell, float dens){
  vec2 q = uv / cell; float row = floor(q.y);
  float rh = sqHash(vec2(row, 7. + cell.y * 91.)); q.x += rh * 19.;
  float cx = floor(q.x); vec2 f = vec2(fract(q.x), fract(q.y)) - .5;
  float h = sqHash(vec2(cx, row) + cell.x * 3.1), len = .35 + .55 * sqHash(vec2(cx, row) + 3.7);
  float run = sqHash(vec2(floor(q.x / 6. + rh * 3.), floor(row / 2.)) + 5.3);          // runs: six cells long, two rows deep
  float on = step(h, dens * (.25 + 2.4 * step(.62, run)) * step(.3, rh));
  float pxH = .5 * cell.y / fw.y, pxL = len * cell.x / fw.x;
  float halfH = min(.25 * cell.y, 1.25 * fw.y), halfL = min(.5 * len * cell.x, 6. * fw.x);
  float cov = clamp((halfH - abs(f.y) * cell.y) / fw.y + .5, 0., 1.) * clamp((halfL - abs(f.x) * cell.x) / fw.x + .5, 0., 1.);
  return on * cov * smoothstep(.8, 1.5, pxH) * smoothstep(3., 5., pxL);
}
// THE DRY BRUSH ON A FREE-STANDING SOLID (the balls, the cones, the blocks, the plinths): short flecks measured on the thing's
// own surface (uv in metres on it): each 2 to 6 cm long and a centimetre and a half high, lying anywhere in a cell of its
// own, no runs and no rows; a share dens of the cells hold one.  True size at any distance: where a fleck is under a pixel
// it counts for the share of the pixel it covers, so far off the field is flat.
float sqFleck(vec2 uv, vec2 fw, vec2 cell, float dens){
  vec2 q = uv / cell; float row = floor(q.y);
  q.x += sqHash(vec2(row, 3. + cell.y * 57.)) * 23.;
  vec2 id = vec2(floor(q.x), row);
  float on = step(sqHash(id + cell.x * 5.3), dens), len = .31 + .54 * sqHash(id + 1.9);
  vec2 hf = vec2(.5 * len, .225) * cell;
  vec2 jit = (vec2(sqHash(id + 8.1), sqHash(id + 4.4)) - .5) * (cell - 2. * hf);
  vec2 d = abs((fract(q) - .5) * cell - jit);
  vec2 cov = clamp((hf - d) / fw + .5, 0., 1.) * min(2. * hf / fw, 1.);
  return on * cov.x * cov.y;
}
float sqRule(float d, float w, float aa){ float lw = max(w, 1.5 * aa); return 1. - smoothstep(lw - .5 * aa, lw + .5 * aa, d); }
`,Te=`
attribute vec3 aSun;      // this building's own false sun (object space, need not be unit)
attribute vec2 aTone;     // x: 0 white, 1 red, 2 interior green-black, 3 ochre (a threshold);  y: value of u at which lit and shade swap (2 = never)
attribute vec2 aUV;       // metres on the face (for joints, flecks)
attribute vec4 aArch;     // metres from the arch centre at springing (x, y), half width (sign = which half of the rim is ruled), rise;  z = 0: no arch
attribute vec4 aEdge;     // metres to the ruled edge on the left, right, bottom, top of this quad (1e3 = that edge is not ruled)
uniform vec3 uSunAll; uniform float uAgree, uU;
varying float vLit, vDist, vTone; varying vec2 vUV; varying vec4 vArch, vEdge;
void main(){
  vec3 sun = mix(aSun, uSunAll * max(length(aSun), 1e-3), uAgree);
  float l = dot(normal, sun);
  vLit = (uU >= aTone.y) ? -l : l;
  vTone = aTone.x; vUV = aUV; vArch = aArch; vEdge = aEdge;
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,Re=`
${Le}
uniform vec2 uCourse;     // course height, stone length (m)
uniform float uLineW;     // 0.15
uniform vec3 uDeep;       // tone 5: an interior's ruled lines: white in shade once we are inside it, green-black from outside
varying float vLit, vDist, vTone; varying vec2 vUV; varying vec4 vArch, vEdge;
void main(){
  if (vTone > 1.5 && vTone < 3.5) { gl_FragColor = vec4(vTone > 2.5 ? uOchre : uInk, 1.); return; }
  if (vTone > 4.5) { gl_FragColor = vec4(uDeep, 1.); return; }      // tone 5: an interior's ruled line (green-black from outside, white in shade once we are inside)
  float deep = step(3.5, vTone);
  float lit = step(0., vLit) * (1. - deep);
  vec3 cl = vTone > .5 ? uRed : uWhite, cs = vTone > .5 ? uRedSh : uWhiteSh;
  if (deep > .5) { cl = uInk; cs = uInk; }
  vec3 field = mix(cs, cl, lit), other = mix(cl, cs, lit);
  vec2 fw = fwidth(vUV); float aa = max(max(fw.x, fw.y), 1e-5);
  // dry-brush flecks of the other tone: the field dragged dry.  Three layers of flecks fixed to the wall (1, 2.5 and 6.5 cm
  // high), each 1 to 2.5 pixels high and 4 to 12 long on screen, in loose horizontal runs, denser beside a ruled line, flat
  // chalk by 28 m; nothing moves on the wall as the camera does
  // (a free-standing solid, aArch.w < 0 or 2, is dragged in short flecks instead: two sheets of cells 7 and 6.6 cm long, 11.5 in
  // a hundred of each holding a fleck a quarter of its cell: 6 per cent of the field, within 12 m of the lens, none by 14 m)
  float fade = 1. - smoothstep(13., 28., vDist);
  float solid = max(step(vArch.w, -.5), step(1.5, vArch.w) * step(abs(vArch.z), 1e-4));
  if (solid > .5) {
    float share = .115 * (1. - smoothstep(12., 14., vDist));
    vec2 fwc = max(fw, vec2(1e-5));
    if (share > 0.) field = mix(field, other, max(sqFleck(vUV, fwc, vec2(.07, .035), share), sqFleck(vUV + 7.31, fwc, vec2(.066, .031), share)));
  } else if (fade > 0.) {
    float dE0 = min(min(vEdge.x, vEdge.y), min(vEdge.z, vEdge.w));
    float dens = (.2 + .35 * (1. - smoothstep(.1, 1.6, dE0))) * fade;
    vec2 fwc = max(fw, vec2(1e-5));
    float fl = max(sqDrag(vUV, fwc, vec2(.1, .02), dens), max(sqDrag(vUV, fwc, vec2(.26, .05), dens), sqDrag(vUV, fwc, vec2(.7, .13), dens)));
    field = mix(field, other, fl);
  }
  // ruled joints, 3 cm, on shade faces only, gone by 60 m
  float jf = (1. - lit) * (1. - smoothstep(26., 60., vDist)) * step(0., vArch.w);      // (aArch.w < 0: no joints, a turned or plaster thing)
  if (jf > 0.) {
    float cy = vUV.y / uCourse.x, r = floor(cy);
    float dy = abs(fract(cy) - .5) * uCourse.x;                       // distance from the middle of the course
    float cx = vUV.x / uCourse.y + .5 * mod(r, 2.) + .13 * r;
    float dx = (.5 - abs(fract(cx) - .5)) * uCourse.y;
    float j = max(sqRule(.5 * uCourse.x - dy, .03, max(fw.y, 1e-5)), sqRule(dx, .03, max(fw.x, 1e-5)));
    field = mix(field, uInk, j * jf * (.8 - .42 * deep));      // (fainter on the half-dark of an interior)
  }
  // the line: green-black, 0.15 m, on the ruled edges only; a 4 cm hair of ochre underpaint between field and line
  float dE = min(min(vEdge.x, vEdge.y), min(vEdge.z, vEdge.w));
  float da = max(fwidth(dE), 1e-5);
  float line = sqRule(dE, uLineW, da);
  float hair = sqRule(dE, max(uLineW, 1.5 * da) + .04, da) * (1. - smoothstep(.02, .05, da));
  float hw = abs(vArch.z), hwS = max(hw, 1e-3);
  vec2 p = vArch.xy; float k = length(p / vec2(hwS, max(vArch.w, 1e-3)));
  float dA = max(p.y < 0. ? abs(p.x) - hwS : (k - 1.) * hwS, 0.);
  float dAa = max(fwidth(dA), 1e-5);
  float half_ = step(-.06 * hwS, p.x * sign(vArch.z)) * step(-1.5 * hwS, p.y) * step(1e-3, hw);
  line = max(line, sqRule(dA, uLineW, dAa) * half_);
  hair = max(hair, sqRule(dA, max(uLineW, 1.5 * dAa) + .04, dAa) * (1. - smoothstep(.02, .05, dAa)) * half_);
  field = mix(field, uOchre, hair * (1. - deep));
  field = mix(field, uInk, line);
  gl_FragColor = vec4(field, 1.);
}`;function Oe(l=Me){const r=Me.map((n,t)=>new f.Color(l&&l[t]?l[t]:n)),e=r[3].clone().lerp(r[4],.4);{const n=new f.Color,t=new f.Color;n.copy(r[3]).convertLinearToSRGB(),t.copy(r[4]).convertLinearToSRGB(),n.lerp(t,.4).convertSRGBToLinear(),e.copy(n)}const u={uGreen:{value:r[0]},uYellow:{value:r[1]},uOchre:{value:r[2]},uWhite:{value:r[3]},uWhiteSh:{value:e},uInk:{value:r[4]},uRed:{value:r[5]},uRedSh:{value:r[6]},uU:{value:0},uTime:{value:0},uAgree:{value:0},uSunAll:{value:new f.Vector3(-.5,.6,.62).normalize()}},m=e.clone(),a={palette:r,whiteSh:e,uniforms:u,deep:m,ink:r[4]};return a.masonryMaterial=(n={})=>new f.ShaderMaterial({uniforms:{...u,uDeep:{value:r[4].clone()},uCourse:{value:new f.Vector2(...n.course||[1,2.6])},uLineW:{value:n.line??.15}},vertexShader:Te,fragmentShader:Re,side:n.side??f.FrontSide}),Ue(a),a.setProgress=(n,t=n)=>{u.uU.value=n,u.uHour.value=t},a}function Ce(){const l=[],r=[],e=[],u=[],m=[],a=[],n=[],t=[],i={xf:(o,h,v)=>[o,h,v],sun:[-.5,.6,.62],tone:0,swap:2,count:0,innerTone:2},c=[0,0,0,1],A=[0,0,0,2];return i.quad=(o,h,v,y,d,w={})=>{let O=[o,h,v,y];const C=h[0]-o[0],T=h[1]-o[1],s=h[2]-o[2],R=y[0]-o[0],F=y[1]-o[1],b=y[2]-o[2];(T*b-s*F)*d[0]+(s*R-C*b)*d[1]+(C*F-T*R)*d[2]<0&&(O=[o,y,v,h]);const x=Math.abs(d[0]),B=Math.abs(d[1]),V=Math.abs(d[2]),k=V>=x&&V>=B?0:x>=B?2:0,I=V>=x&&V>=B||x>=B?1:2,E=O.map(L=>i.xf(L[0],L[1],L[2])),$=E[1][0]-E[0][0],he=E[1][1]-E[0][1],ee=E[1][2]-E[0][2],te=E[3][0]-E[0][0],N=E[3][1]-E[0][1],G=E[3][2]-E[0][2];let ae=he*G-ee*N,_=ee*te-$*G,le=$*N-he*te;const de=Math.hypot(ae,_,le)||1;ae/=de,_/=de,le/=de;let ne=1e9,we=-1e9,re=1e9,g=-1e9;for(const L of O)ne=Math.min(ne,L[k]),we=Math.max(we,L[k]),re=Math.min(re,L[I]),g=Math.max(g,L[I]);const M=w.edge||[0,0,0,0],S=w.arch||(i.solid?A:c),W=w.tone??i.tone,D=l.length/3;for(let L=0;L<4;L++){const H=O[L];l.push(E[L][0],E[L][1],E[L][2]),r.push(ae,_,le),e.push(i.sun[0],i.sun[1],i.sun[2]),u.push(W,i.swap),m.push(H[k]+(w.uo||0),H[I]),a.push(H[0]-S[0],H[1]-S[1],S[2],S[3]),n.push(M[0]?H[k]-ne:1e3,M[1]?we-H[k]:1e3,M[2]?H[I]-re:1e3,M[3]?g-H[I]:1e3)}t.push(D,D+1,D+2,D,D+2,D+3),i.count+=2},i.box=(o,h,v,y,d,w,O={})=>{const C=O.skip||{},T=O.rule||[0,1,1,0];O.noFront||i.quad([o,v,w],[h,v,w],[h,y,w],[o,y,w],[0,0,1],{edge:T,tone:O.tone}),C.left||i.quad([o,v,d],[o,v,w],[o,y,w],[o,y,d],[-1,0,0],{tone:O.tone,edge:[0,0,T[2],0]}),C.right||i.quad([h,v,d],[h,v,w],[h,y,w],[h,y,d],[1,0,0],{tone:O.tone,edge:[0,0,T[2],0]}),C.top||i.quad([o,y,d],[h,y,d],[h,y,w],[o,y,w],[0,1,0],{tone:O.tone}),C.bottom||i.quad([o,v,d],[h,v,d],[h,v,w],[o,v,w],[0,-1,0],{tone:O.tone}),O.back&&i.quad([o,v,d],[h,v,d],[h,y,d],[o,y,d],[0,0,-1],{tone:O.tone})},i.build=()=>{const o=new f.BufferGeometry;return o.setAttribute("position",new f.Float32BufferAttribute(l,3)),o.setAttribute("normal",new f.Float32BufferAttribute(r,3)),o.setAttribute("aSun",new f.Float32BufferAttribute(e,3)),o.setAttribute("aTone",new f.Float32BufferAttribute(u,2)),o.setAttribute("aUV",new f.Float32BufferAttribute(m,2)),o.setAttribute("aArch",new f.Float32BufferAttribute(a,4)),o.setAttribute("aEdge",new f.Float32BufferAttribute(n,4)),o.setIndex(l.length/3>65535?new f.Uint32BufferAttribute(t,1):new f.Uint16BufferAttribute(t,1)),o.computeBoundingSphere(),o.computeBoundingBox(),o},i}function Ve(l,r,e,u,m,a,n,t,i,c,A,o,h=!0,v=!1,y=0){const d=r+u*.5,w=e+n,O=r+u,C=e+m,T=[d,w,a*A,t],s=d-a,R=d+a,F=[];for(let p=0;p<=c;p++){const x=Math.PI*(1-p/c);F.push([d+a*Math.cos(x),w+t*Math.sin(x),Math.cos(x),Math.sin(x)])}F[0][0]=s,F[c][0]=R,F[0][1]=F[c][1]=w;for(let p=0;p<(h?2:1);p++){const x=p?-i:0,B=[0,0,p?-1:1],V=p?{tone:l.innerTone,arch:[d,w,-a*A,t]}:{arch:T};for(const[k,I]of[[r,s],[R,O]])for(const[E,$]of[[e,w],[w,C]])l.quad([k,E,x],[I,E,x],[I,$,x],[k,$,x],B,V);if(p&&v){if(l.quad([s,e,x],[R,e,x],[R,w,x],[s,w,x],B,V),l.quad([s,w,x],[R,w,x],[R,C,x],[s,C,x],B,V),l.innerTone===4)for(let k=0;k<c;k++)l.quad([F[k][0],e,x-.03],[F[k+1][0],e,x-.03],[F[k+1][0],F[k+1][1],x-.03],[F[k][0],F[k][1],x-.03],B,{tone:2})}else for(let k=0;k<c;k++)l.quad([F[k][0],F[k][1],x],[F[k+1][0],F[k+1][1],x],[F[k+1][0],C,x],[F[k][0],C,x],B,V)}const b=v?i-.5:i;v&&l.quad([s,e,-b],[R,e,-b],[R,C,-b],[s,C,-b],[0,0,1],{tone:2}),l.quad([s,e,-b],[s,e,0],[s,w,0],[s,w,-b],[1,0,0],{}),l.quad([R,e,-b],[R,e,0],[R,w,0],[R,w,-b],[-1,0,0],{});for(let p=0;p<c;p++){const x=[-(F[p][2]+F[p+1][2])*.5,-(F[p][3]+F[p+1][3])*.5,0],B=F[p][0],V=F[p+1][0];l.quad([B,F[p][1],-b],[B,F[p][1],0],[V,F[p+1][1],0],[V,F[p+1][1],-b],x,{uo:p*.37}),o&&l.quad([B,e,-b],[V,e,-b],[V,e,0],[B,e,0],[0,1,0],{}),y>0&&(l.quad([B,e+y,-b],[V,e+y,-b],[V,e+y,0],[B,e+y,0],[0,1,0],{tone:3}),l.quad([B,e,0],[V,e,0],[V,e+y,0],[B,e+y,0],[0,0,1],{tone:3}))}}function qe(l,r,e,u,m,a,n={}){let t=u;for(const[i,c]of a){const A=r-(n.noLeft?0:c),o=e+(n.noRight?0:c);l.box(A,o,t,t+i,0,c,{rule:[0,0,1,0],skip:{left:n.noLeft,right:n.noRight}}),n.noLeft||l.box(A,r,t,t+i,-m*.5,0,{skip:{right:!0},back:!0,noFront:!0}),n.noRight||l.box(e,o,t,t+i,-m*.5,0,{skip:{left:!0},back:!0,noFront:!0}),t+=i}return t}const ce={F:120,K:.7,T:2,N:5},X=.25;function fe(l){return 1-(1-ce.K)*(ce.F*.5-l)/ce.F}function Fe(l,r,e){return r===0||r===1&&e===0?{hw:l.archHalf,jamb:l.jamb,rise:l.rise}:{hw:l.archHalf*l.narrow,jamb:l.jamb-1.2,rise:l.rise*l.narrow}}function Se(){const{F:l,K:r}=ce,e=l*.5,u=-Math.log(r)/l,m=a=>e-(1-Math.exp(-u*a))*l/(1-r);return[{name:"front",stretch:1,xf:(a,n,t)=>[a,n,e+t]},{name:"back",stretch:1,xf:(a,n,t)=>[-a*r,n*r,-e-t]},{name:"starboard",stretch:u*l/(1-r),xf:(a,n,t)=>{const i=m(a+e),c=fe(i);return[(e+t)*c,n*c,i]}},{name:"port",stretch:u*l/(1-r),xf:(a,n,t)=>{const i=m(e-a),c=fe(i);return[-(e+t)*c,n*c,i]}}]}async function Ee(l,r){const{F:e,T:u,N:m}=ce,a=e*.5,n=e/m,t=Ce();t.sun=r.sun,t.innerTone=4;const i=Se();for(let o=0;o<4;o++){const h=i[o];t.xf=h.xf;const v=r.ruleSide[o];for(let d=0;d<m;d++){const w=Fe(r,o,d),O=w.hw/h.stretch,C=d*n;for(let s=0;s<m;s++)Ve(t,-a+s*n,C,n,n,O,w.jamb,w.rise,u,o===0?r.segFront:r.seg,v,d>0,!0,r.blind[o][d*m+s],d===0?X:0);await l.yield();const T=r.impost;for(let s=0;s<=m;s++){const R=s===0?-a:-a+(s-.5)*n+O,F=s===m?a:-a+(s+.5)*n-O,b=s===0,p=s===m;qe(t,R-(b?T*3:0),F+(p?T*3:0),C+w.jamb-r.impostH*3,u,[[r.impostH,T],[r.impostH,T*2],[r.impostH,T*3]],{noLeft:b,noRight:p}),d===0&&qe(t,R-(b?.5:0),F+(p?.5:0),0,u,[[.9,.5],[.5,.28],[.3,.12]],{noLeft:b,noRight:p})}await l.yield()}{const d=-u-.04,w=[0,0,-1],O={tone:5},C=Fe(r,o,1).hw/h.stretch,T=Math.min(2.7,(n*.5-C)*.55),s=.3;for(let R=1;R<m;R++)t.quad([-a,R*n-1.1,d],[a,R*n-1.1,d],[a,R*n-.6,d],[-a,R*n-.6,d],w,O);for(let R=1;R<0;R++){const F=-a+R*n;for(const b of[-1,1])t.quad([F+b*T-s*.5,X,d],[F+b*T+s*.5,X,d],[F+b*T+s*.5,e-u,d],[F+b*T-s*.5,e-u,d],w,O);for(let b=0;b<m;b++){const p=b*n+Fe(r,o,b).jamb;t.quad([F-T-.9,p-.5,d-.02],[F+T+.9,p-.5,d-.02],[F+T+.9,p,d-.02],[F-T-.9,p,d-.02],w,O)}}await l.yield()}const y=[v<0?1:0,v>0?1:0,0,0];t.box(-a-.12,-a+2.6,-.02,e-3+.25,0,.12,{rule:y,skip:{top:!0,bottom:!0}}),t.box(a-2.6,a+.12,-.02,e-3+.25,0,.12,{rule:y,skip:{top:!0,bottom:!0}});for(let d=1;d<m;d++)t.box(-a-.25,a+.25,d*n-1.5,d*n-.9,0,.25,{rule:[0,0,1,0]}),t.box(-a-.55,a+.55,d*n-.9,d*n,0,.55,{rule:[0,0,1,0]});t.box(-a-.4,a+.4,e-3,e-2.2,0,.4,{rule:[0,0,1,0]}),t.box(-a-.9,a+.9,e-2.2,e-1,0,.9,{rule:[0,0,1,0]}),t.box(-a-1.5,a+1.5,e-1,e,0,1.5,{rule:[0,0,1,0]}),await l.yield()}t.xf=(o,h,v)=>{const y=fe(-o);return[v*y,h*y,-o]};const c=12;for(let o=0;o<c;o++){const h=-a+o/c*e,v=-a+(o+1)/c*e;t.quad([h,e,-a-1.5],[v,e,-a-1.5],[v,e,a+1.5],[h,e,a+1.5],[0,1,0],{}),t.quad([h,e-u,-a],[v,e-u,-a],[v,e-u,a],[h,e-u,a],[0,-1,0],{tone:2});const y=Math.max(h,-a+u),d=Math.min(v,a-u);t.xf=(w,O,C)=>{const T=fe(-w);return[C*T,O,-w]},t.quad([y,X,-a+u],[d,X,-a+u],[d,X,a-u],[y,X,a-u],[0,1,0],{tone:4});for(let w=-7;w<=7;w++)t.quad([y,X+.02,w*8-.12],[d,X+.02,w*8-.12],[d,X+.02,w*8+.12],[y,X+.02,w*8+.12],[0,1,0],{tone:5});t.xf=(w,O,C)=>{const T=fe(-w);return[C*T,O*T,-w]}}await l.yield();const A=t.build();return await l.yield(),A}const He=`
attribute vec3 aFoot;     // where this vertex stands on the floor at the caster's base (object space)
attribute vec2 aOff;      // metres along the shadow from the foot, metres across (in the shadow's own swinging frame)
attribute vec4 aAng;      // angle at u = 0 (rad, 0 = +Z, toward +X), swing over the flight (rad), stretch over the flight (fraction), gate u
attribute vec4 aFold;     // fold line: beyond dot(n, xz) > d (n = xy, d = z) the shadow leaves the floor;  w = 1 active, 0 none; 2 active and 3 none, and it keeps its own angle when the hour agrees
attribute vec3 aFoldDir;  // ... and runs on in this direction (straight up a wall = 0,1,0; down a ramp, and so on)
attribute float aKind;    // 0 cast shadow (green-black), 1 tongue of light (ochre)
uniform float uU, uHour, uAgree, uAgreeAng;
uniform vec4 uFloorFold;  // the floor this material's shadows lie on tips away beyond dot(xy, p.xz) > z by w per metre (0: level)
varying float vKind;
#ifdef FACE_BOUND
varying vec3 vFlat; varying vec4 vFold;      // where this vertex lies before the fold (flat), and its fold line (w: 1 folded, 0 not)
#endif
void main(){
  float g = step(aAng.w, uU);
  float ang = mix(aAng.x + aAng.y * uHour, uAgreeAng, uAgree * (1. - step(1.5, aFold.w)));
  float sc = (1. + aAng.z * uHour) * g;
  vec2 d = vec2(sin(ang), cos(ang));
  vec3 p = aFoot + vec3(d.x, 0., d.y) * (aOff.x * sc) + vec3(d.y, 0., -d.x) * (aOff.y * g);
  p.y -= uFloorFold.w * max(dot(uFloorFold.xy, p.xz) - uFloorFold.z, 0.);
  float ex = max(dot(aFold.xy, p.xz) - aFold.z, 0.) * step(.5, aFold.w) * (1. - step(2.5, aFold.w));
#ifdef FACE_BOUND
  vFlat = p; vFold = vec4(aFold.xyz, step(.5, aFold.w) * (1. - step(2.5, aFold.w)));
#endif
  p.xz -= aFold.xy * ex; p += aFoldDir * ex;
  vKind = aKind;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}`,De=`
uniform vec3 uInk, uOchre; varying float vKind;
#ifdef FACE_BOUND
// A SHADOW CLIMBS ONLY WHERE A FACE STANDS.  A material that defines FACE_BOUND names the one arcade front its folded shadows
// climb, in the front's own terms (the numbers it was built from): uFaceO = its first corner (x, z) and the unit direction of its
// run (x, z); uFaceS = (how much smaller it grows per metre of run, the length of its run in its own metres, one bay, the
// segments of an arch); uFaceA = (an arch's half width, the height of its springing, its rise, the height of the string course).
// A fragment that lies past the fold line is drawn only where that front's face stands behind it: on a pier, on the wall over
// an arch.  Over an open mouth, past either end and above the string course it is not drawn: the shadow ends at the threshold.
uniform vec4 uFaceO, uFaceS, uFaceA;
varying vec3 vFlat; varying vec4 vFold;
#endif
void main(){
#ifdef FACE_BOUND
  float ex = (dot(vFold.xy, vFlat.xz) - vFold.z) * vFold.w;
  if (ex > 0. && uFaceS.y > 0.) {
    vec2 w = vFlat.xz - vFold.xy * ex;
    float dA = dot(w - uFaceO.xy, uFaceO.zw), s = max(1. - dA * uFaceS.x, 1e-4), run = uFaceS.x > 0. ? -log(s) / uFaceS.x : dA;
    float b = (vFlat.y + ex) / s, x = mod(run, uFaceS.z) - .5 * uFaceS.z, hw = uFaceA.x, n = uFaceS.w;
    float k = clamp(floor((1. - acos(clamp(x / hw, -1., 1.)) / 3.14159265) * n), 0., n - 1.);
    vec2 t = 3.14159265 * (1. - vec2(k, k + 1.) / n), ax = hw * cos(t), ay = uFaceA.z * sin(t);
    float arch = uFaceA.y + mix(ay.x, ay.y, clamp((x - ax.x) / (ax.y - ax.x), 0., 1.));
    if ((abs(x) < hw && b < arch) || run < 0. || run > uFaceS.y || b > uFaceA.w) discard;
  }
#endif
  gl_FragColor = vec4(vKind > .5 ? uOchre : uInk, 1.);
}`,Pe=`
varying vec3 vDir;
void main(){ vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,je=`
${Le}
uniform vec2 uBand;       // degrees: the low colour up to x, the high colour from y; between them the streaks interlock
uniform vec3 uSkyLow, uSkyHigh, uLineCol; uniform float uLine;      // uLine: degrees of a flat line of uLineCol on the horizon (0 = none)
varying vec3 vDir;
void main(){
  vec3 d = vDir / max(length(vDir), 1e-4);
  float el = degrees(asin(clamp(d.y, -1., 1.)));
  float az = atan(d.x, d.z + 1e-6 * step(abs(d.x) + abs(d.z), 0.));
  float t = (el - uBand.x) / max(uBand.y - uBand.x, 1e-3);
  float hi = step(1., t);
  if (t > 0. && t < 1.) {
    // 10 rows of dry-brush streaks fixed to the dome: about 40 of each colour all the way round, longer low down
    float rows = 10., r = floor(t * rows), fy = fract(t * rows);
    float n = 34. + 9. * sqHash(vec2(r, 3.));
    float x = az / 6.2831853 * n + sqHash(vec2(r, 11.)) * 7.;
    float c = floor(x), fx = fract(x);
    float h = sqHash(vec2(mod(c, n), r));
    float endT = max(abs(fx - .5) * 2. - .62, 0.) / .38;             // the streak thins toward its two ends
    float thr = (r + .5) / rows;
    float body = step(abs(fy - .5) * 2., 1. - endT * endT);
    float green = step(h, thr * 1.25 - .12);
    hi = green > .5 ? mix(step(.5, thr), 1., body) : mix(step(.5, thr), 0., body);
  }
  vec3 col = mix(uSkyLow, uSkyHigh, hi);
  if (el < uLine) col = uLineCol;
  gl_FragColor = vec4(col, 1.);
}`;function Ue(l){const r=l.uniforms;l.flatMaterial=(e="uOchre",u={})=>new f.ShaderMaterial({uniforms:{uC:r[e]},vertexShader:"void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform vec3 uC; void main(){ gl_FragColor = vec4(uC, 1.); }",side:u.side??f.FrontSide}),r.uAgreeAng={value:0},r.uHour={value:0},r.uFloorFold={value:new f.Vector4(0,0,0,0)},l.shadowMaterial=()=>new f.ShaderMaterial({uniforms:r,vertexShader:He,fragmentShader:De,side:f.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4}),l.makeSky=(e={})=>{const u=new f.ShaderMaterial({uniforms:{...r,uBand:{value:new f.Vector2(...e.band||[14,18])},uSkyLow:{value:e.low||r.uYellow.value},uSkyHigh:{value:e.high||r.uGreen.value},uLine:{value:e.line||0},uLineCol:{value:e.lineColor||r.uYellow.value}},vertexShader:Pe,fragmentShader:je,side:f.BackSide,depthWrite:!1,depthFunc:f.LessEqualDepth}),m=new f.Mesh(new f.SphereGeometry(900,48,24),u);m.renderOrder=-1,m.frustumCulled=!1;const a=new f.Vector3;return m.follow=n=>{a.setFromMatrixPosition(n.matrixWorld),m.parent&&m.parent.worldToLocal(a),m.position.copy(a)},m}}function We(){const l=[],r=[],e=[],u=[],m=[],a=[],n=[],t={angle:0,swing:0,stretch:0,gate:0,kind:0,fold:null,foldDir:[0,1,0],lift:.04,count:0,own:!1};return t.vert=(i,c,A,o,h=0)=>(l.push(i,c+t.lift,A),r.push(o,h),e.push(t.angle,t.swing,t.stretch,t.gate),t.fold?u.push(t.fold[0],t.fold[1],t.fold[2],t.own?2:1):u.push(0,0,0,t.own?3:0),m.push(t.foldDir[0],t.foldDir[1],t.foldDir[2]),a.push(t.kind),l.length/3-1),t.tri=(i,c,A)=>{n.push(i,c,A),t.count++},t.thrown=(i,c=1)=>{const A=[];for(const o of i){const h=[];for(let v=0;v<=c;v++)h.push(t.vert(o[0],o[1],o[2],o[3]+(o[4]-o[3])*(v/c)));A.push(h)}for(let o=0;o+1<A.length;o++)for(let h=0;h<c;h++)t.tri(A[o][h],A[o+1][h],A[o+1][h+1]),t.tri(A[o][h],A[o+1][h+1],A[o][h+1])},t.shape=(i,c)=>{const A=c.map(o=>[t.vert(i[0],i[1],i[2],o[0],o[1]),t.vert(i[0],i[1],i[2],o[0],o[2])]);for(let o=0;o+1<A.length;o++)t.tri(A[o][0],A[o+1][0],A[o+1][1]),t.tri(A[o][0],A[o+1][1],A[o][1])},t.build=()=>{const i=new f.BufferGeometry;return i.setAttribute("position",new f.Float32BufferAttribute(l,3)),i.setAttribute("aFoot",new f.Float32BufferAttribute(l,3)),i.setAttribute("aOff",new f.Float32BufferAttribute(r,2)),i.setAttribute("aAng",new f.Float32BufferAttribute(e,4)),i.setAttribute("aFold",new f.Float32BufferAttribute(u,4)),i.setAttribute("aFoldDir",new f.Float32BufferAttribute(m,3)),i.setAttribute("aKind",new f.Float32BufferAttribute(a,1)),i.setIndex(n),i},t}function Ke(l,r,e,u={}){const{F:m,K:a}=ce,n=m*.5,t=u.y??0,i=u.div??12;l.kind=0,l.angle=r,l.swing=u.swing??-.1,l.stretch=u.stretch??-.18,l.gate=0;const c=.42;l.thrown([[-n-c,t,n+c,0,e],[n+c,t,n+c,0,e]],i),l.thrown([[n+c,t,n+c,0,e],[n*a,t,-n,0,e*a]],i),l.thrown([[-n-c,t,n+c,0,e],[-n*a,t,-n,0,e*a]],i)}function Ie(l,r,e=40,u={}){const m=u.wide??1,a=e*m,n=e/(u.pre||1),t=u.step??.8,i=u.shoulders??.095,c=u.hem??(u.seated?.088:.062),A=u.neckW??.024,o=u.bt??(u.seated?.6:.7),h=u.slope??.05,v=u.neck??.028,[y,d]=u.head||[.062,.048],w=u.seated?.16:u.legs??.2,O=u.tilt??0,C=o+h,T=p=>O*Math.max(p-C,0)*n,s=p=>{const x=[];for(let B=0;B+1<p.length;B++){const[V,k,I=0]=p[B],[E,$,he=0]=p[B+1],ee=Math.max(1,Math.ceil(Math.abs(E-V)*n/t));for(let te=B?1:0;te<=ee;te++){const N=te/ee,G=V+(E-V)*N,ae=I+(he-I)*N,_=k+($-k)*N;x.push([G*n,(ae-_)*a+T(G),(ae+_)*a+T(G)])}}l.shape(r,x)};if(u.seated)s([[0,.125],[w,.125]]);else if(w>0)for(const p of[-1,1])s([[0,c*.3,p*c*(u.stance??.52)],[w,c*.49,p*c*.5]]);s([[w,c],[o,i],[o+h*.3,i*.84],[C,A],[C+v+y*.3,A]]);const R=[],F=C+v+y,b=Math.max(8,Math.ceil(2*y*n/t));for(let p=0;p<=b;p++){const x=-1+2*p/b,B=d*Math.sqrt(Math.max(1-x*x,0))*a,V=F+y*x;R.push([V*n,-B+T(V),B+T(V)])}if(l.shape(r,R),u.arm!==!1){const p=u.armSide??1,x=(u.armW??A)*1.08,B=u.armLen??.26,V=u.armOut??.42,k=[],I=i*.9,E=$=>p*(I+(o-.012-$)*(n/a)*V);k.push([o-.012,x,E(o-.012)],[o-.012-B*.82,x*.9,E(o-.012-B*.82)],[o-.012-B,x*.3,E(o-.012-B)]),s(k.reverse())}}function _e(l,r,e,u,m,a,n,t,i=12,c=null){const A=[];for(let o=0;o<=i;o++){const h=Math.PI*(1-o/i),v=e+u*Math.cos(h),y=m+a+n*Math.sin(h),d=r(v),w=c?c(d,y*d[3]*t):y*d[3]*t;A.push([d[0],d[1],d[2],Math.min(m*d[3]*t,w),w])}l.kind=1,l.thrown(A,1)}const Ne=`
attribute vec3 aStart; attribute vec4 aPath; attribute vec3 aBird; attribute vec2 aLocal;
uniform float uRun, uTime, uBeat, uTipK, uFoldK, uLong, uNear; uniform vec3 uWallO, uWallT, uWallN, uWallUp; uniform vec4 uFloorFold; uniform float uLoop; uniform vec2 uPaceK;
varying vec2 vWall;
void main(){
  float sB = uRun - aBird.x, size = aBird.z;
  if (uLoop > 0.) sB = mod(sB, uLoop);      // o.loop: every bird comes round again every o.loop metres of run
  // o.paceK: the shadow's speed is a function of where IT is: uPaceK.x of the run's rate over the tipped floor (the part of its
  // floor run beyond the floor's fold line: the ramp), the run's own rate over level floor, uPaceK.y of it up the wall
  // (1, 1: the run is metres everywhere, as before)
  vec2 d0 = vec2(sin(aPath.x), cos(aPath.x));
  float toLine = dot(uFloorFold.xy, d0);
  float sR = (uFloorFold.w > 0. && toLine < -1e-4) ? clamp((uFloorFold.z - dot(uFloorFold.xy, aStart.xz)) / toLine, 0., aPath.y) : 0.;
  sB = min(sB * uPaceK.x, sR) + clamp(sB - sR / uPaceK.x, 0., aPath.y - sR) + max(sB - sR / uPaceK.x - (aPath.y - sR), 0.) * uPaceK.y;
  // near the lens a bird's shadow is nearer its true size (uNear of the size it has far off, where it is drawn large to be seen at
  // all): under us it is a bird, not a splintered blot; it grows as it flies on, as everything here lies about distance
  vec3 cen = aStart + vec3(d0.x, 0., d0.y) * clamp(sB, 0., aPath.y);
  cen.y -= uFloorFold.w * max(dot(uFloorFold.xy, cen.xz) - uFloorFold.z, 0.);
  size *= mix(uNear, 1., smoothstep(6., 22., length((modelViewMatrix * vec4(cen, 1.)).xyz)));
  float ph = uTime * uBeat * 6.2831853 + aBird.y;
  float span = (1. - uFoldK) + uFoldK * cos(ph), tip = abs(aLocal.y) * 2.;
  float s = sB + (aLocal.x * uLong + tip * tip * uTipK * sin(ph)) * size, lat = aLocal.y * span * size;
  float alive = step(0., sB) * step(sB, aPath.y + aPath.z + 11.);
  s = mix(sB, s, alive); lat *= alive;
  vec2 d = vec2(sin(aPath.x), cos(aPath.x));
  float onFloor = min(s, aPath.y), up = max(s - aPath.y, 0.), drift = max(up - aPath.z, 0.) * aPath.w;
  vec3 p = aStart + vec3(d.x, 0., d.y) * onFloor + uWallT * (lat + drift);
  p.y -= uFloorFold.w * max(dot(uFloorFold.xy, p.xz) - uFloorFold.z, 0.);      // the floor tips away beyond this line
  p += uWallUp * up + uWallN * (.05 * step(1e-4, up));
  p.y += .05;
  vWall = vec2(dot(p - uWallO, uWallT), s - aPath.y);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}`,Ge=`
uniform vec3 uInk; uniform vec2 uCell; uniform vec3 uArch; uniform float uTop;      // uTop: the wall's height (nothing is cast on the air above it)
varying vec2 vWall;
void main(){
  if (vWall.y > uTop) discard;
  if (vWall.y > 0.) {
    vec2 q = mod(vWall, max(uCell, vec2(1e-3)));
    vec2 p = vec2(q.x - .5 * uCell.x, q.y - uArch.y);
    float k = length(p / max(uArch.xz, vec2(1e-3)));
    if (p.y < 0. ? abs(p.x) < uArch.x : k < 1.) discard;
  }
  gl_FragColor = vec4(uInk, 1.);
}`,Ye=(()=>{const l=[],r=(a,n,t)=>l.push(a,n,t);r([.3,0],[.02,.07],[.02,-.07]),r([.02,.07],[-.24,0],[.02,-.07]),r([-.2,0],[-.4,.09],[-.4,-.09]);const e=[.05,.2,.36,.5],u=[.13,.2,.13,-.05],m=[-.1,-.03,-.05,-.09];for(const a of[1,-1])for(let n=0;n<3;n++)r([u[n],e[n]*a],[u[n+1],e[n+1]*a],[m[n+1],e[n+1]*a]),r([u[n],e[n]*a],[m[n+1],e[n+1]*a],[m[n],e[n]*a]);return r([.13,.05],[.13,-.05],[-.1,0]),l})();function ze(l,r,e={}){const u=[],m=[],a=[],n=[];for(const h of r)for(const v of Ye)u.push(h.start[0],h.start[1],h.start[2]),m.push(h.heading,h.fold,h.climb,h.side),a.push(h.delay||0,h.phase||0,h.size||2.6),n.push(v[0],v[1]);const t=new f.BufferGeometry;t.setAttribute("position",new f.Float32BufferAttribute(u,3)),t.setAttribute("aStart",new f.Float32BufferAttribute(u,3)),t.setAttribute("aPath",new f.Float32BufferAttribute(m,4)),t.setAttribute("aBird",new f.Float32BufferAttribute(a,3)),t.setAttribute("aLocal",new f.Float32BufferAttribute(n,2));const i=l.uniforms,c={value:-1},A=new f.ShaderMaterial({uniforms:{uInk:i.uInk,uTime:i.uTime,uRun:c,uBeat:{value:e.beat??2},uTipK:{value:e.tipK??.16},uFoldK:{value:e.foldK??.4},uLong:{value:e.long??1},uNear:{value:e.near??.45},uTop:{value:e.top??1e5},uWallO:{value:new f.Vector3(...e.wallOrigin||[0,0,0])},uWallT:{value:new f.Vector3(...e.wallT||[1,0,0])},uWallN:{value:new f.Vector3(...e.wallN||[0,0,1])},uWallUp:{value:new f.Vector3(...e.wallUp||[0,1,0])},uFloorFold:{value:new f.Vector4(...e.floorFold||[0,0,0,0])},uLoop:{value:e.loop||0},uPaceK:{value:new f.Vector2(...e.paceK||[1,1])},uCell:{value:new f.Vector2(...e.cell||[24,24])},uArch:{value:new f.Vector3(...e.arch||[8,12,7.5])}},vertexShader:Ne,fragmentShader:Ge,side:f.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-6}),o=new f.Mesh(t,A);return o.frustumCulled=!1,o.name="flock",o.setRun=h=>{c.value=h},o}async function $e(l,r={}){const e=l.rng,u=r.detail??l.quality?.detail??1,m=r.style||Oe(r.palette||Me),{F:a,K:n,T:t,N:i}=ce,c=a*.5,A=e.chance(.5)?1:-1,o=e.range(.35,.75)*A,h=e.range(.45,.8),v={sun:[Math.sin(o)*Math.cos(h),Math.sin(h),Math.cos(o)*Math.cos(h)],archHalf:8,jamb:12,narrow:e.range(.58,.66),rise:e.range(7.35,7.7),seg:u<.8?12:16,segFront:u<.8?18:26,impost:e.range(.22,.34),impostH:e.range(.42,.6),ruleSide:[-A,A,1,-1]};v.blind=[0,1,2,3].map(g=>{const M=new Array(i*i).fill(!1);if(g>=1&&r.blind!==!1)for(let S=0;S<i;S++)M[S]=!(g===1&&S===2);return M}),v.ruleSide[2]=e.chance(.5)?1:-1,v.ruleSide[3]=e.chance(.5)?1:-1;const y=(r.shadowAngle??e.range(.3,.4))*(e.chance(.5)?1:-1),d=r.tongueGate??.6,w=new f.Group;w.name="cube-of-a-hundred-arches";const O=await Ee(l,v);await l.yield();const C=m.masonry||(m.masonry=m.masonryMaterial({course:[1,2.6]})),T=new f.Mesh(O,C);T.name="cube",w.add(T);const s=We(),R=Se();r.shadow!==!1&&Ke(s,y,r.shadowLength??235,{y:0});const F=[Math.PI,0,-Math.PI/2,Math.PI/2],b=[],p=r.roomLight!==!1;for(let g=0;g<4;g++)for(let M=0;M<3;M++)for(let S=0;S<i;S++){const W=M===0&&S===2&&g<2,D=e(),L=e.range(.14,.62)*(e.chance(.5)?1:-1),H=M===0?W?e.range(2.4,3.3):e.range(.9,2.1):e.range(.5,1.1),oe=e.range(.05,.14)*(e.chance(.67)?1:-1),K=e.range(.12,.34);v.blind[g][M*i+S]||(W||D<(M===0?p?1:.3:p?.5:.2))&&b.push({fi:g,i:S,j:M,lean:W?L*.6:L,k:H*(p?M===0?1.5:1.8:1),swing:oe,stretch:K})}const x=c-t,B=x*(1-n)/a,V=x*(1-(1-n)*.5),k=Math.hypot(1,B),I=[{n:[0,-1],d:x,fold:!0,back:!0},{n:[0,1],d:x,fold:!1},{n:[1/k,-B/k],d:V/k,fold:!0},{n:[-1/k,-B/k],d:V/k,fold:!0}],E=21.5*n;let $=0;if(p){const g=b.find(L=>L.fi===1&&L.j===0&&L.i===2),M=b.length?b[0].lean:.3,S=(M<0?-1:1)*(.015+Math.abs(M)*.04),W=.035,D=(2*x+.9*E)/((3*(a/i)+v.jamb+v.rise)*(1+W));b.length=0;for(let L=0;L<4;L++)for(let H=0;H<i;H++)b.push({fi:0,i:H,j:L,lean:S,k:D,swing:-S*.5/2.2,stretch:W/1.6,fixed:!0});g&&b.push({...g,k:1.25})}let he=0;for(const g of b){he++%4===3&&await l.yield();const M=R[g.fi],S=Fe(v,g.fi,g.j),W=S.hw/M.stretch,D=-c+(g.i+.5)*(a/i);s.angle=F[g.fi]+g.lean,s.swing=g.swing*2.2,s.stretch=g.stretch*1.6,s.gate=d,s.lift=.04;const L=z=>{const P=M.xf(z,0,-t-.05);return[P[0],X,P[2],g.fi===0?1:fe(P[2])]},H=L(D),oe=s.angle+s.swing*.5,K=[Math.sin(oe),Math.cos(oe)];let q=null,se=1e9;for(const z of I){const P=z.n[0]*K[0]+z.n[1]*K[1];if(P<.001)continue;const j=(z.d-z.n[0]*H[0]-z.n[1]*H[2])/P;j>.5&&j<se&&(se=j,q=z)}(!p||!q||!q.fold||g.fixed&&!q.back)&&(q=null),s.fold=q?[q.n[0],q.n[1],q.d-.09]:null,s.foldDir=[0,1,0];const ie=(z,P,j)=>{const Q=s.angle+s.swing*j,Y=P*(1+s.stretch*j);let Z=z[0]+Math.sin(Q)*Y,J=z[2]+Math.cos(Q)*Y;if(q){const U=q.n[0]*Z+q.n[1]*J-q.d;if(U>E||U>-.4&&(Z-=q.n[0]*(U+.4),J-=q.n[1]*(U+.4),q.back&&Math.abs(Z)<9.6))return!1}for(const U of I)if(U!==q&&U.n[0]*Z+U.n[1]*J-U.d>-(q?1.6:.4))return!1;return!0},be=(z,P)=>{let j=P;for(let Q=0;Q<700&&j>0&&!(ie(z,j,0)&&ie(z,j,1));Q++)j-=.25;return Math.max(j,0)},ge=12,pe=8,me=g.j*(a/i),ke=[];for(let z=0;z<=ge;z++){const P=Math.PI*(1-z/ge),j=D+W*Math.cos(P);ke.push([L(j),me+S.jamb+S.rise*Math.sin(P)])}let ve=0;if(q){const z=s.stretch,P=s.swing;g.fixed||(s.stretch=.07);for(const j of g.fixed?[1]:[1,.5,.25]){s.swing=P*j;const Q=s.angle+s.swing,Y=q.n[0]*Math.sin(Q)+q.n[1]*Math.cos(Q),Z=me+S.jamb+S.rise;if(Y<.2)continue;let J=g.fixed?g.k:((q.d-q.n[0]*H[0]-q.n[1]*H[2])/Y+.92*E/Y)/(Z*H[3]*(1+s.stretch));for(let U=0;U<(g.fixed?1:10)&&!ve;U++,J*=.975){if(J>8.5)continue;let xe=!0;for(const[ye,Ae]of ke)for(const Be of[0,.5,1])ie(ye,Ae*ye[3]*J,Be)||(xe=!1);xe&&(ve=J)}if(ve)break}ve||(q=null,s.fold=null,s.stretch=z,s.swing=P)}if(!q){_e(s,L,D,W,me,S.jamb,S.rise,g.k,12,be);continue}const ue=[];for(const[z,P]of ke){const j=P*z[3]*ve,Q=Math.min(me*z[3]*ve,j);let Y=1e9,Z=-1e9;for(const U of[0,.5,1]){const xe=s.angle+s.swing*U,ye=q.n[0]*Math.sin(xe)+q.n[1]*Math.cos(xe);if(ye<.001)continue;const Ae=(q.d-.09-q.n[0]*z[0]-q.n[1]*z[2])/ye/(1+s.stretch*U);Y=Math.min(Y,Ae),Z=Math.max(Z,Ae)}Y>Z&&(Y=j,Z=j);const J=[Q];for(let U=0;U<=pe;U++)J.push(Math.min(Math.max(Y-.25+(Z-Y+.5)*U/pe,Q),j));J.push(j),ue.push(J.map(U=>s.vert(z[0],z[1],z[2],U)))}$++,s.kind=1;for(let z=0;z<ge;z++)for(let P=0;P+1<ue[z].length;P++)s.tri(ue[z][P],ue[z+1][P],ue[z+1][P+1]),s.tri(ue[z][P],ue[z+1][P+1],ue[z][P+1])}s.fold=null,s.foldDir=[0,1,0],s.lift=.04,r.debug&&console.log("room tongues",b.length,"climbing",$);let ee=0;if(r.figure!==!1){const g=e.chance(.5)?1:-1;e.range(1.92,2.08),e.range(28,31),ee=-g*12;const M=-g*12+e.range(-1.5,1.5)*.3,S=34.5,W=[M,0,c+.07+25];s.kind=0,s.angle=Math.PI,s.swing=0,s.stretch=.045,s.gate=0,s.lift=.05,s.own=!0,s.fold=[0,-1,-(c+.07)],s.foldDir=[0,1,0],Ie(s,W,S,{armSide:-g,bt:.79,slope:.05,neck:.026,head:[.058,.052],shoulders:.094,step:.5}),s.own=!1,s.fold=null,s.foldDir=[0,1,0],s.lift=.04}await l.yield();const te=new f.Mesh(s.build(),m.shadow||(m.shadow=m.shadowMaterial()));te.frustumCulled=!1,te.name="shadows-and-tongues",w.add(te);let N=null,G=1,ae=!1;if(r.flock!==!1){const g=[],M=Math.round(36*(u<.8?.7:1)),S=r.flockRun??150,W=[-56.6,-36,-12,12,36,56.6];for(let D=0;D<M;D++){const L=e.int(0,5),H=ee&&W[L]===ee?L===2?1:4:L,oe=W[H]+e.range(-1.6,1.6),K=oe*e.range(.25,.8)+e.range(-10,10),q=H===3&&K<14?14+(14-K)*.4:H===2&&K>-3?-3-(K+3)*.4:K,se=S+e.range(-12,12),ie=Math.atan2(oe-q,-se),be=Math.hypot(oe-q,se),ge=e.int(0,3),pe=ge*(a/i)+v.jamb+e.range(-5,.5),me=H===0?1:H===5?-1:e.chance(.5)?1:-1;g.push({start:[q,0,c+se],heading:ie,fold:be,climb:pe,side:me,delay:e.range(0,70)+D%3*14,phase:e.range(0,6.28),size:e.range(2.3,2.9)*(r.flockSize??1)}),G=Math.max(G,be+pe+11+112)}if(r.flockLoop){G-=82;for(let D=0;D<M;D++)g[D].delay=(D*7%M+g[D].delay/98*.7)*G/M}N=ze(m,g,{floorFold:r.floorFold,wallOrigin:[-c,0,c],wallT:[1,0,0],wallN:[0,0,1],cell:[a/i,a/i],arch:[v.archHalf,v.jamb,v.rise],loop:r.flockLoop?G:0}),w.add(N)}let _=null,le=1,de=!1;if(r.flock!==!1){const g=[],M=Math.round(22*(u<.8?.7:1)),S=c-t-.6;for(let W=0;W<M;W++){const D=e.range(-44,44),L=Math.PI+e.range(-.3,.3),H=Math.sin(L),oe=Math.cos(L);let K=0;for(;K<130;){const se=D+H*(K+1),ie=S+oe*(K+1);if(ie<-S||Math.abs(se)>S*fe(ie))break;K+=1}const q=e.range(0,110);g.push({start:[D,X,S],heading:L,fold:K,climb:0,side:1,delay:q,phase:e.range(0,6.28),size:e.range(2.3,2.9)}),le=Math.max(le,K+q+12)}_=ze(m,g,{wallOrigin:[0,0,0],wallT:[1,0,0],wallN:[0,0,1],cell:[1,1],arch:[0,0,0]}),_.name="room-flock",w.add(_)}let ne=null;if(r.apron!==!1){const g=new f.Mesh(new f.CircleGeometry(2600,48),m.flatMaterial("uOchre"));g.rotation.x=-Math.PI/2,g.name="apron",w.add(g)}r.sky!==!1&&(ne=m.makeSky(),w.add(ne)),await l.yield();let we=!1;const re={object:w,radius:92,height:a,center:new f.Vector3(0,52,0),style:m,sky:ne,ground:!1,groundY:0,anchors:{frontArch:{position:new f.Vector3(0,0,c),width:16,height:v.jamb+v.rise,facing:new f.Vector3(0,0,1)},backArch:{position:new f.Vector3(0,0,-c),width:16*n,height:(v.jamb+v.rise)*n,facing:new f.Vector3(0,0,-1)},flyThrough:[[0,7,300],[0,7,150],[0,7,c+8],[0,7,0],[0,7,-c-8],[0,7,-160]].map(g=>new f.Vector3(...g)),portalSeat:{position:new f.Vector3(0,0,-c-100),facing:new f.Vector3(0,0,1)},viewpoints:{reveal:new f.Vector3(-14,-8.5,308),chase:new f.Vector3(0,2,120),threshold:new f.Vector3(0,7,c+6),room:new f.Vector3(0,7,20)},shadowAngle:y,sun:new f.Vector3(...v.sun),figurePier:ee,smallArch:{...Fe(v,2,1),stretch:Se()[2].stretch},footprint:[[-c,0,c],[c,0,c],[c*n,0,-c],[-c*n,0,-c]].map(g=>new f.Vector3(...g))},setProgress(g,M=g){we=!0,m.uniforms.uU.value=g,m.uniforms.uHour.value=M},setFlock(g){ae=!0,N&&N.setRun(g)},flockLength:0,setRoomFlock(g){de=!0,_&&_.setRun(g)},roomFlockLength:0,update(g,M,S){m.uniforms.uTime.value=M,we||(m.uniforms.uHour.value=m.uniforms.uU.value=.5+.48*Math.sin(M*.45)),N&&!ae&&N.setRun(M*40%G),_&&!de&&_.setRun(M*40%le),ne&&S&&ne.follow(S)},dispose(){}};return re.flockLength=G,re.flock=N,re.roomFlockLength=le,re.roomFlock=_,re}export{Me as PALETTE,Xe as POST,Le as STYLE_GLSL,Ke as addCubeShadow,Ie as addFigure,_e as addTongue,Ve as archCell,$e as buildHero,fe as cubeScaleAt,ze as makeFlock,Ce as makeMasonryBuilder,We as makeShadowBuilder,Oe as makeStyle,qe as steppedBand};
