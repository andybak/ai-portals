import*as A from"three";const Ee=["#F3EEDD","#F6C52B","#E2432A","#2F5FB3","#8A5BA8","#2E8B74","#3A2F6B"],at={salmon:"#F2A27A",mauve:"#C9A6CC",pcob:"#A9C1E6",lemon:"#F4E27A",green:"#5DAE66"},s={AIR:0,SKY_LOW:1,SKY_HIGH:2,CLOUD:3,WATER:4,FOLIAGE:5,TRUNK:6,BRIDGE:7,DEEP:8,WISTERIA:9,PAD:10,FLOWER:11,RIM:12,GRASS:13,STUBBLE:14,FROST:15,STACK:16,POPPY:17,IRIS:18,ROOF:19,STONE:20,BOAT:21,HILL:22,TOWN:23},we=24,S={DAWN:0,MORNING:1,NOON:2,SUNSET:3,DUSK:4},pe=5,He=P=>{const p=parseInt(P.slice(1),16);return[(p>>16)/255,(p>>8&255)/255,(p&255)/255]},n=(P,p,e)=>[P[0]+(p[0]-P[0])*e,P[1]+(p[1]-P[1])*e,P[2]+(p[2]-P[2])*e];function ot(P=Ee,p="clear"){const[e,m,x,f,i,v,g]=P.map(He),t=P.every((z,y)=>z.toUpperCase()===Ee[y])?Object.fromEntries(Object.entries(at).map(([z,y])=>[z,He(y)])):{salmon:n(n(x,m,.25),e,.47),mauve:n(i,e,.55),pcob:n(f,e,.62),lemon:n(m,e,.45),green:n(n(v,m,.3),e,.2)},a=(z,y)=>n(z,e,y),J=n(x,i,.45),T=n(f,g,.45),H=n(v,f,.4),d=[];d[s.AIR]=[a(t.pcob,.55),a(t.pcob,.7),a(t.pcob,.3),a(t.mauve,.4)],d[s.SKY_LOW]=[a(t.pcob,.6),e,a(t.pcob,.35),a(t.mauve,.5)],d[s.SKY_HIGH]=[t.pcob,a(f,.5),a(f,.42),a(t.mauve,.2)],d[s.CLOUD]=[e,a(t.salmon,.7),a(t.mauve,.45),a(t.salmon,.5)],d[s.WATER]=[t.pcob,a(t.pcob,.22),a(f,.36),a(i,.42)],d[s.FOLIAGE]=[t.green,a(n(v,m,.55),.22),a(v,.08),a(n(v,f,.45),.12)],d[s.TRUNK]=[t.salmon,t.mauve,i,n(i,J,.5)],d[s.BRIDGE]=[a(H,.3),a(v,.22),H,a(n(f,i,.5),.12)],d[s.DEEP]=[n(v,i,.45),v,g,n(g,i,.45)],d[s.WISTERIA]=[t.mauve,a(t.mauve,.55),i,a(n(i,f,.5),.18)],d[s.PAD]=[t.green,a(v,.28),n(v,i,.35),a(i,.22)],d[s.FLOWER]=[e,t.salmon,a(J,.3),t.mauve],d[s.RIM]=[t.lemon,a(m,.25),t.green,t.lemon],d[s.GRASS]=[t.green,a(n(v,m,.62),.25),v,a(n(v,f,.5),.2)],d[s.STUBBLE]=[t.lemon,a(t.salmon,.4),t.mauve,t.pcob],d[s.FROST]=[e,a(t.mauve,.6),t.pcob,t.mauve],d[s.STACK]=[t.salmon,t.lemon,i,a(n(i,f,.5),.15)],d[s.POPPY]=[x,a(x,.25),J,a(J,.2)],d[s.IRIS]=[i,t.mauve,n(i,f,.5),g],d[s.ROOF]=[t.salmon,a(t.salmon,.35),i,t.mauve],d[s.STONE]=[t.mauve,a(t.pcob,.3),i,a(f,.3)],d[s.BOAT]=[a(v,.2),a(n(v,f,.3),.32),n(v,i,.4),n(v,f,.5)],d[s.HILL]=[a(t.pcob,.3),a(t.mauve,.35),t.pcob,t.mauve],d[s.TOWN]=[a(t.mauve,.3),a(t.pcob,.35),t.mauve,t.pcob];const L=[];L[S.DAWN]={lt:a(t.mauve,.55),la:.52,st:n(t.pcob,i,.35),sa:.55,air:[a(t.mauve,.6),a(t.lemon,.6),a(t.mauve,.25),t.pcob]},L[S.MORNING]={lt:n(t.salmon,t.lemon,.5),la:.34,st:t.mauve,sa:.3,air:[a(t.salmon,.6),a(t.lemon,.55),a(t.mauve,.35),a(t.pcob,.3)]},L[S.NOON]={lt:e,la:0,st:f,sa:0,air:d[s.AIR]},L[S.SUNSET]={lt:n(x,m,.5),la:.5,st:i,sa:.45,air:[t.salmon,a(n(x,m,.6),.35),t.mauve,a(i,.3)]},L[S.DUSK]={lt:n(t.pcob,f,.45),la:.62,st:n(T,i,.3),sa:.66,air:[n(t.pcob,f,.35),n(t.mauve,i,.3),n(f,i,.4),T]};const b=[];for(let z=0;z<pe;z++){const y=L[z],G=[];for(let W=0;W<we;W++){const se=d[W];G[W]=W===s.AIR?y.air:[n(se[0],y.lt,y.la),n(se[1],y.lt,y.la*.8),n(se[2],y.st,y.sa),n(se[3],y.st,y.sa*.85)]}b[z]=G}for(let z=0;z<pe;z++)for(const y of[s.POPPY,s.FLOWER,s.RIM,s.BOAT]){const G=d[y],W=L[z];b[z][y]=[n(G[0],W.lt,W.la*.45),n(G[1],W.lt,W.la*.45),n(G[2],W.st,W.sa*.5),n(G[3],W.st,W.sa*.5)]}const C=s.SKY_LOW,B=s.SKY_HIGH,_=s.CLOUD,$=n(x,m,.55);b[S.DAWN][C]=[a(t.lemon,.45),a(t.lemon,.7),a(t.salmon,.5),a(t.lemon,.25)],b[S.DAWN][B]=[a(t.mauve,.5),a(t.salmon,.55),a(t.mauve,.22),a(t.pcob,.4)],b[S.DAWN][_]=[a(t.salmon,.35),a(t.lemon,.6),a(t.mauve,.3),a(t.salmon,.6)],b[S.MORNING][C]=[a(t.lemon,.6),a(t.pcob,.7),a(t.salmon,.6),a(t.pcob,.5)],b[S.MORNING][B]=[a(t.pcob,.3),a(t.pcob,.55),t.pcob,a(t.mauve,.45)],b[S.MORNING][_]=[e,a(t.salmon,.6),a(t.mauve,.5),a(t.salmon,.75)],b[S.SUNSET][C]=[a($,.45),t.lemon,t.salmon,a($,.25)],b[S.SUNSET][B]=[t.mauve,a(t.salmon,.25),a(i,.3),a(t.pcob,.2)],b[S.SUNSET][_]=[t.salmon,a($,.3),a(i,.25),a(J,.45)],b[S.DUSK][C]=[n(t.mauve,t.pcob,.4),a(i,.35),n(f,i,.5),a(f,.3)],b[S.DUSK][B]=[a(T,.3),a(n(f,i,.5),.25),n(T,i,.4),a(T,.15)],b[S.DUSK][_]=[t.mauve,a(t.pcob,.15),a(i,.2),n(f,i,.5)],b[S.DAWN][s.STUBBLE]=[a(t.mauve,.66),a(t.lemon,.78),n(t.pcob,i,.38),n(t.mauve,f,.3)],b[S.DAWN][s.FROST]=[e,a(t.mauve,.72),n(t.pcob,i,.25),a(i,.4)],b[S.DAWN][s.STACK]=[t.salmon,a(t.salmon,.35),n(i,f,.18),a(n(i,f,.45),.12)],b[S.DAWN][s.RIM]=[t.salmon,a(t.lemon,.2),t.mauve,t.salmon],b[S.MORNING][s.STUBBLE]=[a(n(t.salmon,t.lemon,.6),.25),t.lemon,t.mauve,a(i,.35)],b[S.MORNING][s.WATER]=[a(t.pcob,.3),a(t.salmon,.62),a(f,.42),a(i,.42)],b[S.SUNSET][s.WATER]=[a($,.42),t.salmon,t.mauve,a(i,.3)],b[S.DUSK][s.WATER]=[n(t.pcob,f,.3),t.mauve,n(f,i,.45),a(T,.2)],b[S.SUNSET][s.FOLIAGE]=[n(t.green,$,.45),n(t.lemon,$,.35),n(v,f,.45),n(i,f,.3)],b[S.DUSK][s.FOLIAGE]=[n(t.pcob,v,.3),a(H,.35),n(i,f,.35),n(i,T,.45)],b[S.DUSK][s.TOWN]=[t.pcob,t.mauve,n(i,f,.4),n(i,T,.3)];const ie={[_]:[t.mauve,a(t.salmon,.3),a(i,.2),n(f,i,.5)],[s.FOLIAGE]:[n(t.pcob,v,.3),n(t.mauve,t.pcob,.4),n(i,f,.35),n(i,T,.45)],[s.POPPY]:b[S.DUSK][s.POPPY]};b[S.DUSK][s.POPPY]=[a(x,.22),t.salmon,b[S.DUSK][s.POPPY][2],b[S.DUSK][s.POPPY][3]],b[S.MORNING][s.STACK]=[n(t.salmon,t.lemon,.45),a($,.4),i,a(n(i,f,.5),.2)];const oe=z=>{for(let y=0;y<pe;y++)for(let G=0;G<we;G++)b[y][G]=z(b[y][G],y,G)};if(p==="grey"){const z=a(n(t.mauve,t.pcob,.5),.35),y=[.4,.3,.2,.34,.4],G=[.16,.06,0,.1,.24];oe((W,se)=>{const ne=Me=>n(n(Me,z,y[se]),n(i,f,.5),G[se]),ce=ne(W[0]),fe=n(ne(W[1]),W[1],.45);return[ce,fe,n(ne(W[2]),ce,.45),n(ne(W[3]),fe,.4)]})}else if(p==="late"){for(let z=0;z<pe;z++){const y=L[z],G=1-y.la*.6;b[z][s.FOLIAGE]=[n(t.lemon,y.lt,y.la*.5),n(n(m,x,.38),y.lt,y.la*.5),n(n(x,i,.35),y.st,y.sa*.6),n(n(m,v,.45),y.st,y.sa*.6)],b[z][s.GRASS]=[n(a(n(v,m,.7),.3),y.lt,y.la*.6*G+.1),b[z][s.GRASS][1],b[z][s.GRASS][2],n(t.mauve,y.st,y.sa)]}b[S.SUNSET][s.BRIDGE]=[n(x,m,.5),t.salmon,n(i,x,.3),i],b[S.DAWN][s.FROST]=[e,a(t.salmon,.7),t.pcob,a(i,.5)]}else if(p==="dusk"){const z=b[S.SUNSET].map((G,W)=>G.map((se,ne)=>n(se,(ie[W]||b[S.DUSK][W])[ne],.72))),y=b[S.DUSK].map(G=>[n(G[0],n(T,i,.4),.34),n(G[1],T,.3),n(G[2],n(g,f,.3),.4),n(G[3],n(g,i,.4),.4)]);b[S.SUNSET]=z,b[S.DUSK]=y}return{table:b,ground:e,tints:t,pig:{W:e,Y:m,R:x,B:f,V:i,G:v,D:g},edition:p}}function st(P){const p=new Uint8Array(we*4*pe*4);for(let m=0;m<pe;m++)for(let x=0;x<we;x++)for(let f=0;f<4;f++){const i=P.table[m][x][f],v=((m*we+x)*4+f)*4;p[v]=Math.round(i[0]*255),p[v+1]=Math.round(i[1]*255),p[v+2]=Math.round(i[2]*255),p[v+3]=255}const e=new A.DataTexture(p,we*4,pe,A.RGBAFormat,A.UnsignedByteType);return e.colorSpace=A.SRGBColorSpace,e.magFilter=e.minFilter=A.NearestFilter,e.generateMipmaps=!1,e.needsUpdate=!0,e}function nt(P,p){const e=p.ground;return{uTime:{value:0},uStrip:{value:P},uGround:{value:new A.Color().setRGB(e[0],e[1],e[2],A.SRGBColorSpace)},uFront:{value:new A.Vector4(S.NOON,S.NOON,-1e5,50)},uCourse:{value:new A.Vector4(0,1,0,.8)},uLight:{value:new A.Vector3(-.38,.8,.46).normalize()},uCam:{value:new A.Vector3(0,1e4,0)},uCamR:{value:new A.Vector3(1,0,0)},uCamF:{value:new A.Vector3(0,0,1)},uView:{value:new A.Vector2(1280,720)},uWind:{value:new A.Vector4(.8,.6,1,0)},uGust:{value:new A.Vector3(-1e5,40,0)},uCloud:{value:new A.Vector3(-1e5,60,0)},uAir:{value:new A.Vector3(900,60,.85)},uTwinkle:{value:.12},uLily:{value:0},uPart:{value:0},uFog:{value:new A.Vector4(1e5,40,50,0)},uCast:{value:[new A.Vector4(0,0,0,0),new A.Vector4(0,0,0,0),new A.Vector4(0,0,0,0)]},uCastOn:{value:0},uCastY:{value:new A.Vector3(0,0,0)}}}const Ue=`
uniform float uTime, uTwinkle, uLily, uPart;
uniform sampler2D uStrip;
uniform vec3 uGround, uLight, uCam, uCamR, uCamF, uGust, uCloud, uAir;
uniform vec4 uFront, uCourse, uWind, uFog;
uniform vec4 uCast[3]; uniform float uCastOn; uniform vec3 uCastY;
float gFogK;
uniform vec2 uView;
float sfHash(float n){ return fract(sin(n*12.9898+4.1414)*43758.5453); }
float sfHash2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float sfNoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(sfHash2(i), sfHash2(i+vec2(1.,0.)), f.x), mix(sfHash2(i+vec2(0.,1.)), sfHash2(i+vec2(1.,1.)), f.x), f.y); }
// the sky upside down: where the eye's ray, turned up off the water at p, meets the cloud field. Cloud shapes keep the
// sky's own breadth however near the water is, and lie still like the sky while the dashes of the water slide through them.
float sfCloudMap(vec3 p){
  vec3 v = p - uCam; v = v/max(length(v), 1e-3);
  vec2 q = v.xz/(max(-v.y, 0.) + .22)*2.4 + uTime*vec2(.012, .005);
  return sfNoise(q + 3.)*.62 + sfNoise(q*2.3 + 11.)*.38; }
// strip lookup: role 0..23, k 0 lightA 1 lightB 2 shadeA 3 shadeB, hour row
vec3 sfPig(float role, float k, float hour){ return textureLod(uStrip, vec2((role*4.+k+.5)/96., (hour+.5)/5.), 0.).rgb; }
// how far the new hour has repainted a touch at world place p whose own delay is 0..1
float sfHourMix(vec3 p, float delay){
  float along = dot(p.xz, uCourse.xy) + uCourse.z;
  float m = clamp((uFront.z - along)/max(uFront.w, 1.) - delay*uCourse.w, 0., 1.);
  return m*m*(3.-2.*m); }
vec3 sfPigNow(float role, float k, float m){ return mix(sfPig(role, k, uFront.y), sfPig(role, k, uFront.x), m); }
// analytic cast shadows: the footprint of a drum with a conical cap (a grainstack) thrown along the hour's light
float sfCast(vec3 p){
  vec2 l = uLight.xz; float ll = max(length(l), 1e-3); vec2 sd = -l/ll; float te = max(uLight.y, .02)/ll, s = 0.;
  vec2 pj = p.xz + (vec2(sfNoise(p.xz*.45), sfNoise(p.xz*.45 + 7.3)) - .5)*2.2;   // the edge of a shadow is ragged touches, never a ruled line
  for (int i = 0; i < 3; i++) { vec4 c = uCast[i]; vec2 v = pj - c.xy;
    float al = dot(v, sd), lat = abs(v.x*sd.y - v.y*sd.x), h = al*te;
    float hw = c.z*(h < c.w*.47 ? 1.04 : 1.1*max(0., (c.w-h)/max(c.w*.53, .01)));
    float gy = i == 0 ? uCastY.x : i == 1 ? uCastY.y : uCastY.z;
    s = max(s, step(c.z*.8, al)*step(h, c.w)*step(lat, hw*(.93 + .14*sin(al*1.7 + lat*2.)))*step(p.y, gy + 2.5 + al*.06)); }
  return s*uCastOn; }
// 1 inside the cloud shadow or a cast shadow footprint
float sfCloud(vec3 p){ float along = dot(p.xz, uCourse.xy) + uCourse.z;
  return max(sfCast(p), uCloud.z*(1.-smoothstep(uCloud.y*.8, uCloud.y, abs(along-uCloud.x) + 14.*(sfNoise(p.xz*.03)-.5)))); }
// fog (the rare morning): past the fog's edge the air closes in; call once before sfDistance
void sfSetFog(vec3 p, float delay){ float along = dot(p.xz, uCourse.xy) + uCourse.z;
  gFogK = uFog.w*clamp((along-uFog.x)/max(uFog.y, 1.) - delay*.6, 0., 1.); }
// distance in the style's own terms: a touch takes one of four steps of the hour's air colour, each on its own threshold
vec3 sfDistance(vec3 col, float dist, float h, float m){
  float p = 1.-exp(-dist/max(mix(uAir.x, uFog.z, gFogK), 1.));
  float q = min(floor(p*5.+h)/5., 1.)*mix(uAir.z, 1., gFogK);
  return mix(col, sfPigNow(0., h < .5 ? 0. : 1., m), q); }
`,Ke=`
float sfBreakV(vec3 q){ float sc = exp2(floor(log2(max(q.z/26., 1.))));
  float n = sfNoise(vec2(q.x*.21/sc + 3.7, q.y*2.6/sc));
  float n2 = sfNoise(vec2(q.x*.07 + 9.1, q.y*.9/sc + 2.3));
  return n*.7 + n2*.3 + .07*min(-q.y, 20.)/20.; }
float sfBreak(vec3 q){ return step(.6, sfBreakV(q)); }
`,rt=`
attribute vec4 iA, iB, iC, iD;
uniform float uRefl;
varying vec2 vUv; varying vec3 vColA, vColB; flat varying vec4 vInfo; varying vec3 vBrk;
${Ue}
void main(){
  float role = iD.x, occl = iD.y, seed = iD.z, kind = iD.w, hang = iC.w;
  float h1 = fract(seed*37.37+.11), h2 = fract(seed*91.7+.31), h3 = fract(seed*173.3+.7), h4 = fract(seed*251.9+.53);
  if (role > 23.5) role = sfCloudMap((modelMatrix*vec4(iA.xyz, 1.)).xyz) + (h1-.5)*.2 > .5 ? 3. : 4.;   // a dash of the sky lying on the water: cloud or blue as the cloud map has it there
  mat3 m3 = mat3(modelMatrix);
  vec3 c = (modelMatrix*vec4(iA.xyz, 1.)).xyz;
  vec3 d = m3*iB.xyz; d = d/max(length(d), 1e-4);
  vec3 n = m3*iC.xyz; n = n/max(length(n), 1e-4);
  float len = iA.w, wid = iB.w;
  if (uRefl > .5) { vec2 t = uCam.xz - c.xz; t = t/max(length(t), 1e-3); n = vec3(t.x, 0., t.y); d = vec3(d.x*.3, 1., d.z*.3); d = d/max(length(d), 1e-4); }
  vec3 nLit = n;
  if (uRefl > .5) { nLit = m3*iC.xyz; nLit = nLit/max(length(nLit), 1e-4); }   // a double keeps its source's light and shade  // a reflection is a drag on the water, turned to the eye about the upright
  // the medium's loops: hanging touches swing as pendulums (a strand shares one phase), the gust swings them harder
  float along = dot(c.xz, uCourse.xy) + uCourse.z;
  float gust = uGust.z*(1.-smoothstep(0., max(uGust.y, 1.), abs(along-uGust.x)));
  float ph = sfHash2(floor(iA.xz*.6));
  float hw = min(abs(hang), 6.);
  float sw = sin(uTime*(.55+.5*ph) + ph*6.283 + c.x*.07) + .4*sin(uTime*1.7 + ph*40.);
  vec2 off = uWind.xy*(sw*.065*uWind.z + gust*.3)*hw;
  // the push round the lens is OFF: uPart is 0 (every hanging thing is held clear of the flown line by place, the world's
  // HEM LAW), so push is 0 here and the next line adds nothing to off. (With uPart above 0 these lines pushed hanging
  // touches ahead sideways off the camera's line.)
  vec3 rc = c-uCam; float lat = dot(rc, uCamR), fwd = dot(rc, uCamF);
  float sgn = lat < 0. ? -1. : 1.;
  float push = uPart*max(3.2-abs(lat), 0.)*smoothstep(-3., 1., fwd)*(1.-smoothstep(5., 16., fwd))*min(hw*.5, 1.)*step(.01, hw);
  off += uCamR.xz*sgn*push*.8;
  c.xz += off;
  if (hw > .01) { d.xz -= off/max(hw, .5)*(d.y < 0. ? -1. : 1.); d = d/max(length(d), 1e-4); }
  if (uRefl > .5) c.x += .22*sin(c.y*.9 + uTime*.8 + ph*6.)*(1.+.15*abs(c.y));
  float dist = length(c-uCam);
  // fewer, larger: past uAir.y a touch grows and its neighbours drop out, so the covered area stays
  float g = max(1., dist/max(uAir.y, 1.));
  float keep = smoothstep(0., .12, 1./g - h4*.999 + .12*step(g, 1.001));
  float grow = sqrt(g)*keep;
  if (kind > 3.5) grow *= 1.-uLily*.7;                       // lily flower dabs close
  len *= grow; wid *= grow;
  vec4 cc = projectionMatrix*viewMatrix*vec4(c, 1.);
  float pxk = projectionMatrix[1][1]*uView.y*.5/max(cc.w, .1);   // pixels per metre at the touch
  // at arm's length a mark is a bristle streak: nothing wider than a fortieth of the frame (pads and flower dabs lie as they are)
  float capS = (kind > 1.5) ? (kind > 2.5 && kind < 3.5 ? min(1., .026*uView.x/max(wid*pxk, 1e-3)) : 1.) : min(1., .026*uView.x/max(wid*pxk, 1e-3));
  len *= mix(1., capS, .8); wid *= capS;
  float minW = 1.6/pxk*step(.001, grow);
  wid = max(wid, minW); len = max(len, minW*2.2);
  vec3 a = cross(n, d); a = a/max(length(a), 1e-4);
  c += n*((h1-.5)*.05*(1.+dist*.03));                         // impasto: touches stack, never share a plane
  vec3 wp = c + d*(position.x*len) + a*(position.y*wid);
  // pigment: light or shade by the hour's light, two pigments a role, the hour's front against this touch's delay
  float m = sfHourMix(c, h3);
  sfSetFog(c, h3);
  float lit = step(occl + .40 + (h2-.5)*.3, dot(nLit, uLight)*.5+.5);
  lit *= 1.-step(.5, sfCloud(c) + (h2-.5)*.2);
  float pick = step(.5, h1);
  float base = mix(2., 0., lit);
  vec3 cA = sfPigNow(role, base+pick, m), cB = sfPigNow(role, base+1.-pick, m);
  float P = 5.+6.*h2, tri = abs(fract(uTime/P + h1*9.)*2.-1.);
  float tw = smoothstep(.3, .7, tri)*step(h4, uTwinkle)*smoothstep(5., 8., len*pxk);
  tw = max(tw, gust*step(h4, .6));                            // the gust silvers: touches show their other pigment
  vec3 colA = mix(cA, cB, tw), colB = mix(cB, cA, tw);
  vColA = sfDistance(colA, dist, h2, m); vColB = sfDistance(colB, dist, h2, m);
  vUv = position.xy; vInfo = vec4(kind, seed, wid*pxk, 0.);   // the same at every corner of a touch (flat)
  vBrk = vec3(wp.x + wp.z, wp.y, dist);                       // for sfBreak: this corner's own place in the world, and the touch's distance from the eye (one for the whole touch)
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.);
}`,lt=`
uniform vec3 uGround; uniform float uRefl, uBrk;
varying vec2 vUv; varying vec3 vColA, vColB; flat varying vec4 vInfo; varying vec3 vBrk;
float sfHash(float n){ return fract(sin(n*12.9898+4.1414)*43758.5453); }
float sfHash2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float sfNoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(sfHash2(i), sfHash2(i+vec2(1.,0.)), f.x), mix(sfHash2(i+vec2(0.,1.)), sfHash2(i+vec2(1.,1.)), f.x), f.y); }
${Ke}
void main(){
  float kind = vInfo.x, seed = vInfo.y;
  float fine = smoothstep(3., 9., vInfo.z);          // bristles are drawn only where they are wider than a pixel
  float u = vUv.x, v = vUv.y, fb, b;
  if (kind > 1.5 && kind < 2.5) {                     // a lily pad: one level ellipse, ragged rim, a notch
    vec2 q = vUv; if (dot(q, q) < 1e-8) q = vec2(1e-4, 0.);
    float r = length(q)*2., ang = atan(q.y, q.x);
    float rag = .72 + .28*sfNoise(vec2(ang*1.9 + seed*30., seed*5.)) - .1*sfNoise(vec2(ang*7. + seed*3., 2.));
    float da = abs(ang - (seed*6.283-3.1416));
    if (r > rag || (da < .16*fine && r > .3)) discard;
    fb = (v+.5)*7. + .9*sfNoise(vec2(u*5. + seed*17., seed*3.)); b = floor(fb);
    if (sfHash2(vec2(b + seed*61., floor(u*7. + sfHash(b + seed*5.)*3.))) > mix(1.1, .9, fine)) discard;
  } else {
    if (kind > .5 && kind < 1.5 || kind > 3.5) {      // a curled dab: the press turns as it lifts
      v += (u*u-.07)*1.25*(fract(seed*7.7) < .5 ? 1. : -1.); v *= 1.75;
    }
    if (abs(v) > .5) discard;
    fb = (v+.5)*7.; b = floor(fb);
    float hb = sfHash(b*13.1 + seed*97.), hb2 = sfHash(b*7.7 + seed*31. + 3.);
    float drag = step(2.5, kind)*step(kind, 3.5);
    float e0 = -.5 + (.02 + .26*hb*hb)*fine, e1 = .5 - (.02 + (.3 + .2*drag)*hb2*hb2)*fine;
    float edge = abs(v) - (.5 - .2*smoothstep(.2, .5, abs(u)) - .12*fine*sfNoise(vec2(u*7. + seed*50., seed*9. + v)));
    if (u < e0 || u > e1 || edge > 0.) discard;
    float gap = sfHash2(vec2(b + seed*61., floor(u*6. + hb*3.)));
    if (gap > mix(1.1, .89 - .09*drag, fine)) discard;   // dry brush: the ground or the touch beneath shows
  }
  float ridge = sfHash(b*3.3 + seed*11.);
  vec3 col = mix(vColA, vColB, mix(.25, step(.62, ridge)*.8, fine));
  float crest = smoothstep(.25, 0., fract(fb))*step(.5, sfHash(b*5.1 + seed*23.));
  col = mix(col, uGround, crest*.3*fine);              // a loaded bristle ridge catches white
  if (uRefl > .5 && sfBreakV(vBrk) > uBrk) discard;     // a double is crossed by level breaks: where a band lies the drag is not drawn, and the water or what lies behind shows (uBrk: BRK below)
  gl_FragColor = vec4(col, 1.);
}`,qe={POND:.74,STREAM:.8,BRIDGE:.8,NONE:9};function it(P,{reflect:p=!1,brk:e=qe.POND}={}){return new A.ShaderMaterial({uniforms:Object.assign({uRefl:{value:p?1:0},uBrk:{value:e}},P),vertexShader:rt,fragmentShader:lt,side:A.DoubleSide})}const Y={STREAK:0,CURL:1,PAD:2,DRAG:3,FLOWER:4};class Ve{constructor(p,e=1,m=4096){this.rng=p,this.detail=e,this.n=0,this.cap=m,this.A=new Float32Array(m*16)}add(p,e,m,x,f,i,v,g,M,t,a,J,T=0,H=0,d=0,L=!0){const b=this.rng();if(L&&this.detail<1){if(b*7.13%1>this.detail)return;const _=1/Math.sqrt(this.detail);t*=_,a*=_}if(this.n===this.cap){this.cap*=2;const _=new Float32Array(this.cap*16);_.set(this.A),this.A=_}const C=this.A,B=this.n++*16;C[B]=p,C[B+1]=e,C[B+2]=m,C[B+3]=t,C[B+4]=x,C[B+5]=f,C[B+6]=i,C[B+7]=a,C[B+8]=v,C[B+9]=g,C[B+10]=M,C[B+11]=d,C[B+12]=J,C[B+13]=T,C[B+14]=b,C[B+15]=H}reflectInto(p,e=2,m=2.2,x=0,f=this.n,i=1e9,v=1.5,g=.05){const M=this.A;for(let t=x;t<f;t++){const a=t*16;if(M[a+1]<g||M[a+1]>i||M[a+14]*53.7%1*e>1)continue;const J=Math.sqrt(e);p.add(M[a],-M[a+1]*1,M[a+2],M[a+4]*.25,1,M[a+6]*.25,M[a+8],M[a+9],M[a+10],Math.max(M[a+3],M[a+7])*m*J,Math.max(M[a+7]*J*.6,.1),M[a+12],M[a+12]===9||M[a+12]===11||M[a+12]===12||M[a+12]===17||M[a+12]===21?M[a+13]:Math.max(M[a+13],v),Y.DRAG,M[a+11],!1)}}mesh(p){const e=new A.InstancedBufferGeometry;e.setAttribute("position",new A.BufferAttribute(new Float32Array([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0]),3)),e.setIndex([0,1,2,0,2,3]);const m=new A.InstancedInterleavedBuffer(this.A.subarray(0,this.n*16),16);e.setAttribute("iA",new A.InterleavedBufferAttribute(m,4,0)),e.setAttribute("iB",new A.InterleavedBufferAttribute(m,4,4)),e.setAttribute("iC",new A.InterleavedBufferAttribute(m,4,8)),e.setAttribute("iD",new A.InterleavedBufferAttribute(m,4,12)),e.instanceCount=this.n;const x=new A.Mesh(e,p);return x.frustumCulled=!1,x}}const ct=`
attribute vec2 aRole;
varying vec2 vPaint, vRole; varying vec3 vWp, vN;
void main(){
  vPaint = uv; vRole = aRole;
  vec4 w = modelMatrix*vec4(position, 1.); vWp = w.xyz;
  vN = mat3(modelMatrix)*normal;
  gl_Position = projectionMatrix*viewMatrix*w;
}`,ft=`
varying vec2 vPaint, vRole; varying vec3 vWp, vN;
uniform vec4 uCell; uniform vec3 uMode; uniform float uFlow, uDbl;   // small cell (len, wid), large cell (len, wid); mode: water 0/1, slide speed, chink share
${Ue}
float gM, gDist; vec3 gN;
${Ke}
float gCellH;
vec4 sfCellLayer(vec2 p, vec2 size, float role, float occl, float so, float fine){
  vec2 q = p/size;
  q.y += .26*(sfNoise(q*vec2(.8, .35) + so) - .5) + .3*(sfNoise(q*vec2(2.3, .9) + so + 5.) - .5);           // rows are never ruled
  float row = floor(q.y);
  q.x += sfHash(row*1.7 + so)*7.3 + uTime*uMode.y*mix(mod(row, 2.) < 1. ? 1. : -1., 1., uFlow)/size.x;
  vec2 id = floor(q), f = fract(q)-.5;
  float h1 = sfHash2(id + so), h2 = sfHash2(id*1.31 + 7.7 + so), h3 = sfHash2(id*.77 + 3.3 + so), h4 = sfHash2(id*2.1 + 9.1 + so);
  float bb = floor((f.y+.5)*5.), hb = sfHash2(id + bb*3.1 + so), hb2 = sfHash2(id*1.7 + bb*5.3 + so);
  // one press of a flat brush: each its own length, the ends rounded and ragged bristle by bristle, never a ruled joint
  float ty = f.y*2., tap = .15*ty*ty*fine, sh = sfHash2(id*4.3 + 1.7 + so);
  float e0 = -.5 + (.015 + .2*sh*sh + .2*hb*hb)*fine + tap, e1 = .5 - (.015 + .2*h4*h4 + .26*hb2*hb2)*fine - tap;
  float inside = step(e0, f.x)*step(f.x, e1)*step(abs(f.y), .5 - .035*h2*fine);
  inside *= step(sfHash2(id*3.7 + bb + floor(f.x*5.)), 1.-.07*fine);
  float m = clamp(gM + (.5-h3)*uCourse.w*.6, 0., 1.);
  // the press beneath shows in the gaps: it belongs to a lattice of its own, so the chinks never draw a grid
  vec2 q2 = q*vec2(.63, 1.) + vec2(.31, .5); vec2 id2 = floor(q2);
  float g1 = sfHash2(id2*1.9 + so + 2.), g2 = sfHash2(id2*2.7 + so + 4.);
  float cloud = 0., cloud2 = 0., csh = 0.;
  if (uMode.x > .5) {                                        // water is the sky upside down: cloud touches by a slow map
    float cn = sfCloudMap(vWp);
    cloud = step(.5, cn + (h1-.5)*.2); cloud2 = step(.5, cn + (g1-.5)*.2);
    csh = step(cn, .55 + (h2-.5)*.08);                       // a cloud's edge is its mauve and rose shade
  }
  float r2 = mix(role, 3., cloud), r3 = mix(role, 3., cloud2);
  float lit = step(occl + .40 + (h2-.5)*.3, dot(gN, uLight)*.5+.5);
  lit *= 1.-step(.5, sfCloud(vWp) + (h2-.5)*.2);
  lit *= 1.-uDbl;                                            // a double is laid in its mass's shade pigments
  float litC = lit*(1.-cloud*csh);
  float base = mix(2., 0., litC), pick = step(.5, h1);
  vec3 col = sfPigNow(r2, base + pick, m), under = sfPigNow(r2, base + 1.-pick, m);
  vec3 below = sfPigNow(r3, mix(2., 0., lit*(1.-cloud2*csh)) + step(.5, g2), m);
  float P = 5. + 6.*h2, tri = abs(fract(uTime/P + h1*9.)*2.-1.);
  float tw = smoothstep(.3, .7, tri)*step(h4, uTwinkle)*fine;
  vec3 c2 = mix(col, under, tw);
  c2 = mix(c2, mix(under, col, tw), step(.6, hb)*.6*fine);    // bristle ridges carry the second pigment
  vec3 chink = mix(below, uGround, step(sfHash2(id*5.3 + bb*1.9 + so), uMode.z*2.)*step(g1, .5));   // another press beneath, primed canvas in a few chinks
  gCellH = sh;
  return vec4(sfDistance(mix(chink, c2, inside), gDist, h2, m), inside);
}
void main(){
  gN = vN/max(length(vN), 1e-4); if (!gl_FrontFacing) gN = -gN;
  gDist = length(vWp - uCam); gM = sfHourMix(vWp, .5); sfSetFog(vWp, .5);
  vec2 fw = fwidth(vPaint); float f1 = max(max(fw.x*.4, fw.y), 1e-5);
  // the hand wanders: paint coordinates are bent a little so rows are never ruled
  vec2 p = vPaint + vec2(0., .35*uCell.w)*(sfNoise(vPaint*vec2(.9, 2.)/max(uCell.z, .01)) - .5)*2.;
  float pxS = uCell.y/f1, pxL = uCell.w/f1;
  // fewer, larger: the cell size steps up by four whenever a cell would fall under about 6 px (the style's distance rule)
  float lod = clamp(log2(7./max(pxL, 1e-3))*.5, 0., 2.);
  float k0 = floor(lod), fr = lod-k0, sc = exp2(2.*k0);
  float tn = smoothstep(.6, 1., fr)*step(lod, 1.999);
  float fS = smoothstep(4., 8., pxS), fL = smoothstep(2.5, 5., pxL*sc*mix(1., 4., tn));
  float fineL = smoothstep(6., 14., pxL*sc);                  // bristles only where a bristle is wider than a pixel
  vec3 col = sfCellLayer(p, uCell.zw*sc, vRole.x, vRole.y, k0*5., fineL).rgb;
  // fewer, larger arrive press by press over the finer crust, and the small touches lie over the large in patches:
  // sizes overlap, a layer never fades in as a sheet
  if (tn > 0.) { vec4 big = sfCellLayer(p, uCell.zw*sc*4., vRole.x, vRole.y, k0*5.+5., 1.); col = mix(col, big.rgb, big.a*smoothstep(gCellH*.8, gCellH*.8 + .2, tn)); }
  if (fS > 0.) { vec4 sm = sfCellLayer(p, uCell.xy, vRole.x, vRole.y, 17., fS); col = mix(col, sm.rgb, fS*sm.a*step(gCellH, .66)); }
  if (fL < 1.) {                                              // too fine to draw: the mean tint of the crust, no shimmer
    float cloud = uMode.x > .5 ? step(.5, sfCloudMap(vWp)) : 0.;
    float lit = smoothstep(vRole.y + .2, vRole.y + .4, dot(gN, uLight)*.5+.5)*(1.-sfCloud(vWp))*(1.-uDbl);
    float r2 = mix(vRole.x, 3., cloud);
    vec3 a = mix(sfPigNow(r2, 2., gM), sfPigNow(r2, 0., gM), lit), b = mix(sfPigNow(r2, 3., gM), sfPigNow(r2, 1., gM), lit);
    col = mix(sfDistance(mix(mix(a, b, .5), uGround, uMode.z*.5), gDist, .5, gM), col, fL);
  }
  if (uDbl > .5) {                                            // a double: level dashes of water cross it, its lower fringe is ragged
    float col1 = sfNoise(vec2((vWp.x + vWp.z)*.8, 1.3)), col2 = sfNoise(vec2((vWp.x + vWp.z)*.19, 5.7));
    if (sfBreak(vec3(vWp.x + vWp.z, vWp.y, gDist)) > .5 || vRole.y > .5 + .3*col2 + .2*col1) discard;
  }
  gl_FragColor = vec4(col, 1.);
}`;function ht(P,{water:p=!1,slide:e=0,small:m=[.3,.085],large:x=[1.3,.36],chink:f=.08,side:i=A.DoubleSide,flow:v=0,double:g=!1}={}){return new A.ShaderMaterial({uniforms:Object.assign({uCell:{value:new A.Vector4(m[0],m[1],x[0],x[1])},uMode:{value:new A.Vector3(p?1:0,e,f)},uFlow:{value:v},uDbl:{value:g?1:0}},P),vertexShader:ct,fragmentShader:ft,side:i})}function ut(P=Ee,p="clear"){const e=ot(P,p),m=st(e),x=nt(m,e);return{pigments:e,strip:m,uniforms:x,touchMaterial:f=>it(x,f),canvasMaterial:f=>ht(x,f),frame(f,i,v){x.uTime.value=f;const g=i.matrixWorld.elements;x.uCam.value.set(g[12],g[13],g[14]),x.uCamR.value.set(g[0],g[1],g[2]).normalize(),x.uCamF.value.set(-g[8],-g[9],-g[10]).normalize(),v&&v.getDrawingBufferSize(x.uView.value)},setHours(f,i,v,g=50){x.uFront.value.set(f,i,v,g)},dispose(){m.dispose()}}}class Ye{constructor(){this.p=[],this.n=[],this.uv=[],this.r=[],this.i=[],this.count=0}vert(p,e,m,x,f,i,v,g,M,t=0){return this.p.push(p,e,m),this.n.push(x,f,i),this.uv.push(v,g),this.r.push(M,t),this.count++}tri(p,e,m){this.i.push(p,e,m)}quad(p,e,m,x){this.i.push(p,e,m,p,m,x)}tube(p,e,m=0,x=8,f=!1,i=1){const v=[],g=new A.Vector3(0,0,1),M=new A.Vector3,t=new A.Vector3,a=new A.Vector3;let J=0;for(let T=0;T<p.length;T++){const H=p[T],d=p[Math.min(T+1,p.length-1)],L=p[Math.max(T-1,0)];M.set(d.x-L.x,d.y-L.y,d.z-L.z).normalize(),t.crossVectors(M,g),t.lengthSq()<1e-6&&t.set(1,0,0),t.normalize(),a.crossVectors(t,M).normalize(),T>0&&(J+=Math.hypot(H.x-L.x,H.y-L.y,H.z-L.z));const b=[];for(let C=0;C<=x;C++){const B=C/x*Math.PI*2,_=Math.cos(B),$=Math.sin(B)*i,ie=t.x*_+a.x*$,oe=t.y*_+a.y*$,z=t.z*_+a.z*$,y=C/x*Math.PI*2*H.r;b.push(this.vert(H.x+ie*H.r,H.y+oe*H.r,H.z+z*H.r,ie,oe,z,f?J:y,f?y:J,e,m))}v.push(b)}for(let T=0;T<v.length-1;T++)for(let H=0;H<x;H++)this.quad(v[T][H],v[T][H+1],v[T+1][H+1],v[T+1][H])}mesh(p){const e=new A.BufferGeometry;return e.setAttribute("position",new A.Float32BufferAttribute(this.p,3)),e.setAttribute("normal",new A.Float32BufferAttribute(this.n,3)),e.setAttribute("uv",new A.Float32BufferAttribute(this.uv,2)),e.setAttribute("aRole",new A.Float32BufferAttribute(this.r,2)),e.setIndex(this.i),new A.Mesh(e,p)}}const O=22;async function dt(P,p={}){const e=P.rng,m=()=>P.yield?P.yield():null,x=p.detail??P.quality?.detail??1,f=p.style||ut(p.palette||Ee),i=!p.style,v=new A.Group;v.name="footbridge-at-noon";const g=new Ve(e,x,32768),M=new Ye,t=e.range(6.6,7),a=8-t,J=e.int(7,9),T=e.range(5.3,5.8),H=e.range(.15,.45),d=2.1,L=o=>a+t*(1-o/O*(o/O)),b=o=>-2*t*o/(O*O),C=.62,B=44;let _=0;const $=[0];for(let o=1;o<=B;o++){const r=-O+(o-1)*2*O/B,l=r+2*O/B;_+=Math.hypot(l-r,L(l)-L(r)),$.push(_)}const ie=_;for(const o of["top","bottom","front","back"]){const r=[];for(let l=0;l<=B;l++){const c=-O+l*2*O/B,h=L(c),R=b(c),w=1/Math.hypot(1,R);let u,N;if(o==="top")u=M.vert(c,h+C,-d,-R*w,w,0,$[l],0,s.BRIDGE,-.1),N=M.vert(c,h+C,d,-R*w,w,0,$[l],2*d,s.BRIDGE,-.1);else if(o==="bottom")u=M.vert(c,h,d,R*w,-w,0,d,$[l],s.DEEP,.2),N=M.vert(c,h,-d,R*w,-w,0,-d,$[l],s.DEEP,.2);else{const I=o==="front"?d:-d,U=o==="front"?1:-1;u=M.vert(c,h,I,0,0,U,$[l],0,s.BRIDGE,.05),N=M.vert(c,h+C,I,0,0,U,$[l],C,s.BRIDGE,.05)}l>0&&M.quad(r[0],u,N,r[1]),r[0]=u,r[1]=N}}const oe=(o,r)=>{for(let l=0;l<ie;l+=o){const c=-O+l/ie*2*O*1;r(c,L(c),b(c))}};for(const o of[1,-1])for(let r=0;r<3;r++)oe(.26,(l,c,h)=>{const R=1/Math.hypot(1,h),w=e.range(-.25,.25);g.add(l+e.range(-.1,.1),c+.1+r*.24+e.range(-.05,.05),o*(d+.03),R,(h+w)*R,0,0,0,o,e.range(.34,.52),e.range(.15,.22),e.chance(.04)?s.RIM:s.BRIDGE,r===0?.25:0,Y.STREAK,0,!1)});oe(.21,(o,r,l)=>{const c=1/Math.hypot(1,l);for(let h=-d+.3;h<d;h+=.52){const R=e(),w=R>.9;g.add(o+e.range(-.06,.06),r-.03,h+e.range(-.15,.15),e.range(-.2,.2),0,1,l*c,-c,0,w?e.range(.5,.9):e.range(.5,.75),w?.055:e.range(.15,.22),w?s.RIM:R<.2?s.DEEP:R<.42?s.FOLIAGE:s.BRIDGE,w?-1:.3,Y.STREAK,0,w)}}),oe(.3,(o,r,l)=>{const c=1/Math.hypot(1,l);for(let h=-d+.25;h<d;h+=.6)g.add(o+e.range(-.1,.1),r+C+.02,h+e.range(-.2,.2),c,l*c,e.range(-.25,.25),-l*c,c,0,e.range(.45,.7),e.range(.16,.24),e.chance(.3)?s.RIM:s.BRIDGE,-.2)}),await m();const z=(o,r,l,c)=>oe(.2,(h,R,w)=>{const u=1/Math.hypot(1,w),N=R+C+o,I=()=>e.range(.3,.44);g.add(h,N+c*.5,r,u,w*u,e.range(-.08,.08),-w*u,u,0,I(),c*1.25,s.RIM,-1,Y.STREAK,0,!1),g.add(h+.1,N,r+l*c*.5,u,(w+e.range(-.12,.12))*u,0,0,0,l,I(),c*1.5,s.BRIDGE,0,Y.STREAK,0,!1),e.chance(.6)&&g.add(h+.05,N-c*.5,r,u,w*u,0,w*u,-u,0,I(),c*1.2,s.BRIDGE,1,Y.STREAK,0,!1)});for(const o of[1,-1])z(1.12,o*d,o,.15),z(.58,o*d,o,.11);for(const o of[1,-1])for(let r=-O+.6;r<O;r+=1.45){const l=L(r)+C;for(let c=0;c<3;c++)g.add(r+e.range(-.03,.03),l+.2+c*.36,o*(d+.02),e.range(-.1,.1),1,0,0,0,o,.4,.1,s.BRIDGE,c===0?.3:0,Y.STREAK,0,!1)}await m();const y=o=>L(o)+C+T*(.9+.1*(1-o/O*(o/O))),G=[];for(let o=0;o<=J;o++)G.push(-O*.93+o*(2*O*.93/J));for(const o of[1,-1])for(const r of G){const l=L(r)+C,c=y(r);for(let h=l+.15;h<c;h+=.3)g.add(r+e.range(-.03,.03),h,o*(d+.08),e.range(-.08,.08),1,0,0,0,o,e.range(.4,.5),.15,e.chance(.15)?s.RIM:s.BRIDGE,0,Y.STREAK,0,!1),g.add(r+(e.chance(.5)?.08:-.08),h+.1,o*d,0,1,e.range(-.08,.08),r<0?-1:1,0,.2*o,e.range(.4,.5),.13,s.BRIDGE,.35,Y.STREAK,0,!1)}for(const o of[1,-1])for(const r of[0,-.7])oe(.22,(l,c,h)=>{const R=1/Math.hypot(1,h),w=y(l),u=o*(d+.08+r);g.add(l,w,u+o*.06,R,h*R*.9,0,0,.2,o,e.range(.36,.5),.15,s.BRIDGE,0,Y.STREAK,0,!1),e.chance(.5)&&g.add(l,w+.07,u,R,h*R*.9,0,0,1,0,.4,.13,s.RIM,-1,Y.STREAK,0,!1)});for(let o=-O*.93;o<=O*.93;o+=1.1)for(let r=-d;r<d;r+=.42)g.add(o,y(o)+.05,r+.2,e.range(-.1,.1),0,1,0,1,0,.5,.12,s.BRIDGE,e.chance(.5)?0:.6,Y.STREAK,0,!1);await m(),oe(.3,(o,r,l)=>{const c=y(o);for(const h of[1,-1])for(let R=0;R<5;R++){const w=e.range(-.5,1.1),u=e.range(-.9,.5);g.add(o+e.range(-.3,.3),c+w,h*(d+.25+u*.6),e.range(-.6,.6),e.range(-1,.3),e.range(-.3,.3),e.range(-.3,.3),.5+w*.6,h*(.9+u*.4),e.range(.45,.75),e.range(.28,.42),s.FOLIAGE,w<-.1?.45:0,Y.CURL,0)}e.chance(.7)&&g.add(o,c+e.range(.2,.7),e.range(-d,d),1,.2,e.range(-.5,.5),0,1,0,e.range(.4,.6),.28,s.FOLIAGE,-.3,Y.CURL,0)});const W=p.hem||null,se=x<1?1/Math.sqrt(x):1;let ne=0;const ce=(o,r,l,c,h,R,w)=>{const u=Math.max(3,Math.round(c/.27)),N=e.range(-.12,.12);let I=u;const U=W?W.floor(o,l):-1/0;if(U>-1e8){for(I=0;I<u;){const q=(I+.5)/u;if(r-q*c-(.2+.3*(1-q*.72))*.6*(I>1?se:1)<U)break;I++}I/u*c<W.min&&(I=0)}for(let q=0;q<u;q++){const ee=(q+.5)/u,ae=1-ee*.72,re=(.2+.3*ae)*e.range(.85,1.2),be=o+N*ee*c+e.range(-.2,.2)*ae,Ce=l+e.range(-.16,.16)*ae,ye=e.range(-.5,.5),ue=e.range(-.2,.2),ve=e.range(-.5,.5),De=R?-1:w+(e.chance(.3)?.3:0);if(q>=I){const E=e();!(q>1&&x<1&&E*7.13%1>x)&&r-ee*c>=.05&&Math.fround(E)*53.7%1*1.6<=1&&ne++;continue}g.add(be,r-ee*c,Ce,ye,-1,ue,ve,.25,h,re,re*.62,s.WISTERIA,De,Y.CURL,ee*c+.25,q>1)}};let fe=0;for(const o of[1,-1]){for(let r=-O*.95;r<O*.95;r+=e.range(.38,.72))ce(r,y(r)-e.range(0,.4),o*(d+e.range(.15,.6)),e.range(2,4),o,e.chance(H),0),fe++,e.chance(.35)&&ce(r+.2,y(r)-.3,o*e.range(.2,d-.3),e.range(1.2,2.6),o,!1,.4);for(let r=-O*.97;r<O*.97;r+=e.range(.3,.55)){const l=L(r)+e.range(-.05,.12),c=Math.max(4+e.range(0,1.6)*e(),1.3),h=Math.min(4.2,l-c);h>.7?(ce(r,l,o*(d+e.range(-.3,.3)),h*e.range(.6,1),o,e.chance(H),.15),fe++):l>2.4&&e.chance(.6)&&(ce(r,l,o*(d+e.range(-.2,.3)),Math.min(2.4,l-1.3)*e.range(.5,1),o,!1,.15),fe++)}await m()}const Me=g.n,ze=a+.55,Re=e.range(10,12),Ae=e.range(12,15),Se=(o,r,l)=>{const c=(o-l*(O+3.5))/Re,h=r/Ae,R=c*c+h*h;return R>=1?0:ze*Math.pow(1-R,1.5)};for(const o of[-1,1]){const r=o*(O+3.5),l=[],c=M.vert(r,ze,0,0,1,0,0,r,s.GRASS,0);for(let h=1;h<=6;h++){const R=h/6,w=[];for(let u=0;u<=24;u++){const N=u/24*Math.PI*2,I=r+Math.cos(N)*R*Re,U=Math.sin(N)*R*Ae;w.push(M.vert(I,Se(I,U,o),U,Math.cos(N)*R*.5,1,Math.sin(N)*R*.5,U,I,s.GRASS,0))}for(let u=0;u<24;u++)h===1?M.tri(c,w[u+1],w[u]):M.quad(l[u],l[u+1],w[u+1],w[u]);l.length=0,l.push(...w)}for(let h=0;h<900;h++){const R=e()*Math.PI*2,w=Math.sqrt(e()),u=r+Math.cos(R)*w*Re,N=Math.sin(R)*w*Ae,I=w>.86,U=Se(u,N,o),q=I?e.range(.6,1.1):e.range(.3,.6),ee=e.sign();g.add(u,U+q*.45,N,e.range(-.25,.25),1,0,e.range(-.5,.5),.35,ee,q,q*(I?.2:.3),I&&e.chance(.45)?s.IRIS:e.chance(.12)?s.RIM:s.GRASS,e.chance(.3)?.4:0)}}await m();const Ie=[],Be=async(o,r,l,c,h,R=!1)=>{const w=o<0?-1:1,u=Se(o,r,w),N={x:o+c*2.4,y:u+l*.33,z:r+e.range(-1,1)};if(!R){const E=[];for(let D=0;D<=7;D++){const k=D/7;E.push({x:o+(N.x-o)*k*k+Math.sin(k*5+o)*.35,y:u-.3+(N.y-u+.3)*k,z:r+(N.z-r)*k,r:1.5-.75*Math.sqrt(k)+(D===0?.5:0)})}M.tube(E,s.TRUNK,.1,9,!1);for(let D=0;D<7;D++)for(let k=0;k<1;k+=.22){const F=E[D],K=E[D+1],V=F.x+(K.x-F.x)*k,Q=F.y+(K.y-F.y)*k,j=F.z+(K.z-F.z)*k,le=F.r+(K.r-F.r)*k;for(let Z=0;Z<7;Z++){const te=(Z+e())/7*Math.PI*2,de=Math.cos(te),me=Math.sin(te);Q>u+.2&&g.add(V+de*le,Q+e.range(-.1,.1),j+me*le,-me,e.range(-.25,.25),de,de,0,me,e.range(.6,.95),e.range(.2,.3),s.TRUNK,.05,Y.STREAK,0,!1)}}}const I=u+l*.52,U=u+l-I,q=R?0:e.int(4,6);for(let E=0;E<q;E++){const D=(E+e.range(-.3,.3))/q*Math.PI*2,k=h*e.range(.35,.6),F=I+U*e.range(.35,.7),K=[];for(let V=0;V<=6;V++){const Q=V/6,j=Math.sin(Q*Math.PI/2);K.push({x:N.x+Math.cos(D)*k*Q*(.4+.6*Q),y:N.y+(F-N.y)*j,z:N.z+Math.sin(D)*k*Q*(.4+.6*Q),r:.62-.45*Q})}M.tube(K,s.TRUNK,.3,6,!1);for(let V=0;V<6;V++)for(let Q=0;Q<4;Q++){const j=K[V],le=K[V+1],Z=e(),te=e()*6.283;g.add(j.x+(le.x-j.x)*Z+Math.cos(te)*j.r,j.y+(le.y-j.y)*Z,j.z+(le.z-j.z)*Z+Math.sin(te)*j.r,-Math.sin(te),.3,Math.cos(te),Math.cos(te),.2,Math.sin(te),.7,.22,s.TRUNK,.3,Y.STREAK,0,!1)}}const ee=e()*6.283,ae=e()*6.283,re=E=>1+.2*Math.sin(E*3+ee)+.13*Math.sin(E*5+ae)+.16*Math.sin(E+ae),be=E=>.66+.28*re(E*2+1),Ce=E=>u+2.3+1.3*Math.sin(E*3+ae)+.9*Math.sin(E*7+ee)+5*Math.pow(Math.max(0,Math.sin(E+ee)),6),ye=22,ue=7;let ve=null;for(let E=0;E<=ue;E++){const D=[],k=E/ue;for(let F=0;F<=ye;F++){const K=F/ye*Math.PI*2,V=k*Math.PI*.5,Q=h*.8*re(K)*(E===0?.02:Math.sin(V))*(E===ue?.93:1),j=E===ue?Ce(K)+2.2:I+U*.76*Math.cos(V)*be(K)-(k>.7?(k-.7)*14:0);D.push(M.vert(o+c+Math.cos(K)*Q,j,r+Math.sin(K)*Q,Math.cos(K)*Math.sin(V),Math.cos(V)*.8,Math.sin(K)*Math.sin(V),k*h*1.6+(E===ue?6:0),K*h*.8,s.FOLIAGE,.5))}if(ve)for(let F=0;F<ye;F++)M.quad(ve[F],ve[F+1],D[F+1],D[F]);ve=D}await m();const De=Math.round(700*(h/12));for(let E=0;E<De;E++){const D=e()*Math.PI*2,k=Math.sqrt(.25+.75*e()),F=k>.74,K=h*re(D),V=o+c+Math.cos(D)*K*k*.9,Q=r+Math.sin(D)*K*k*.9,j=I+U*Math.pow(1-k*k*.9,.42)*be(D)*e.range(.84,1.07),le=Ce(D)+(F?e.range(-1.2,1.5):e.range(1,6)),Z=Math.max(2,j-le),te=K*(1-k*.9)*.55+e.range(.4,2.2),de=Math.cos(D),me=Math.sin(D),Ze=(F?0:.3)+(re(D)<.93?.22:0);let Te=e.range(0,.8),et=0;for(;Te<Z&&et++<30;){const ke=e.range(1.1,2.7),ge=Te+ke*.5,Ge=1-Math.exp(-ge/(Z*.3)),We=Math.exp(-ge/(Z*.3))/(Z*.3),tt=!F&&e.chance(.25)?s.DEEP:e.chance(.025)?s.RIM:s.FOLIAGE;g.add(V+de*te*Ge,j-ge,Q+me*te*Ge,de*te*We+e.range(-.12,.12),-1,me*te*We+e.range(-.12,.12),de,.05+.6*(1-ge/Z)*(1-ge/Z),me,ke,Math.max(.3,ke*.2),tt,Ze+(ge>Z*.7?.12:0),Y.DRAG,ge,!0),Te+=ke*e.range(.62,.85)}E%120===0&&await m()}for(let E=0;E<(R?220:420);E++){const D=e()*Math.PI*2,k=Math.sqrt(e())*.8,F=h*re(D),K=Math.cos(D),V=Math.sin(D),Q=I+U*Math.pow(1-k*k*.9,.42)*be(D)+e.range(-.3,1.1),j=e.range(1,2.2);g.add(o+c+K*F*k*.9,Q,r+V*F*k*.9,K*(.5+k)+e.range(-.3,.3),e.range(-.2,.9),V*(.5+k)+e.range(-.3,.3),K*k,1,V*k,j,j*.24,e.chance(.05)?s.RIM:s.FOLIAGE,0,Y.CURL,0)}R||Ie.push({x:o+c,z:r,H:l,R:h,top:u+l})},je=e.sign();for(const o of[-1,1]){const r=je===o,l=r?28:e.range(25,27),c=r?14:12,h=o*(O+e.range(7.5,9.5)),R=o*e.range(-1.5,4),w=-o*e.range(.2,1.2);await Be(h,R,l,w,c),await Be(h+o*c*e.range(.5,.7),R+e.sign()*c*e.range(.35,.6),l*e.range(.66,.78),w,c*e.range(.6,.72),!0)}const _e=g.n,Oe=[],$e=e.int(26,32),Xe=p.waterRadius??420,Pe=(o,r)=>Math.abs(r+1.5)<3.2&&Math.abs(o)<O||Ie.some(l=>Math.hypot(o-l.x,r-l.z)<l.R*.8);for(let o=0;o<$e;o++){const r=o<10,l=e.range(4,9),c=e.range(2.2,4.5),h=r?e.sign()*e.range(3.5+l*.6,14):e.range(-58,58),R=r?e.range(7,58)*(o<6?1:-1):e.range(-75,75),w=Math.round(l*c*e.range(1.4,2));Oe.push({x:h,z:R,rx:l,rz:c});for(let u=0;u<w;u++){const N=e()*6.283,I=Math.sqrt(e()),U=h+Math.cos(N)*I*l,q=R+Math.sin(N)*I*c,ee=e.range(.6,1.2),ae=e()*6.283;Se(U,q,U<0?-1:1)>0||(g.add(U,.03,q,Math.cos(ae),0,Math.sin(ae)*.5,0,1,0,ee*1.2,ee*.72,s.PAD,Pe(U,q)?1:e.chance(.25)?.5:-.2,Y.PAD,0,!0),e.chance(.11)&&g.add(U+.2,.09,q,Math.cos(ae+1),0,Math.sin(ae+1),0,1,0,e.range(.42,.62),e.range(.34,.46),s.FLOWER,Pe(U,q)?.6:-1,Y.FLOWER,0,!1))}}await m();const xe=new Ve(e,1,16384);g.reflectInto(xe,1.6,2.3,0,Me);for(let o=0;o<ne;o++)e();await m(),g.reflectInto(xe,3.2/Math.max(x,.6),2,Me,_e),await m();const he={touch:f.touchMaterial(),reflect:f.touchMaterial({reflect:!0,brk:qe.BRIDGE}),form:f.canvasMaterial(),water:null};if(p.water!==!1){const o=new Ye,r=[0,6,14,26,42,64,95,140,200,290,Xe],l=40;let c=null;for(let R=0;R<r.length;R++){const w=[];for(let u=0;u<=l;u++){const N=u/l*Math.PI*2,I=Math.cos(N)*r[R],U=Math.sin(N)*r[R];w.push(o.vert(I,0,U,0,1,0,I,U,s.WATER,-.5))}if(c)for(let u=0;u<l;u++)o.quad(c[u],w[u],w[u+1],c[u+1]);c=w}he.water=f.canvasMaterial({water:!0,slide:.07,small:[.6,.12],large:[2.4,.5],chink:.05}),he.water.depthWrite=!1;const h=o.mesh(he.water);h.renderOrder=-.6,h.frustumCulled=!1,h.name="pond",v.add(h)}const Ne=xe.mesh(he.reflect);Ne.renderOrder=-.5,Ne.name="reflections",v.add(Ne);const Fe=M.mesh(he.form);Fe.name="under-forms",v.add(Fe);const Le=g.mesh(he.touch);Le.name="touches",v.add(Le),await m();const X=(o,r,l)=>new A.Vector3(o,r,l),Qe={reveal:X(0,2,90),lookAt:X(0,7,0),flyThrough:[X(0,2,90),X(0,2.4,62),X(0,3.4,34),X(0,4.3,12),X(0,4.5,0),X(0,4.2,-14),X(0,2.8,-45),X(0,1.5,-80)],crown:X(0,8,0),trellisTop:X(0,L(0)+C+T,0),willows:Ie.map(o=>({base:X(o.x,0,o.z),top:X(o.x,o.top,o.z),radius:o.R})),banks:[X(-(O+3.5),0,0),X(O+3.5,0,0)],bankRadius:X(Re,ze,Ae),rafts:Oe.map(o=>({at:X(o.x,0,o.z),rx:o.rx,rz:o.rz})),span:2*O,clearance:8},Je={touches:g.n,reflections:xe.n,formTriangles:M.i.length/3,racemes:fe,triangles:(g.n+xe.n)*2+M.i.length/3+(p.water!==!1?800:0)};return{object:v,radius:44,height:28,center:X(0,8,0),anchors:Qe,style:f,stats:Je,materials:he,ground:!1,groundY:0,setHours(o,r,l,c){f.setHours(o,r,l,c)},setProgress(o){this.progress=o},update(o,r,l){f.frame(r,l,P.renderer)},dispose(){i&&f.dispose()}}}export{qe as BRK,Ye as FormBatch,S as HOUR,pe as HOURS,Y as KIND,Ee as PALETTE,s as ROLE,we as ROLES,Ue as STYLE_GLSL,Ve as TouchBatch,dt as buildHero,ht as canvasMaterial,ot as makePigments,st as makeStrip,ut as makeStyle,nt as makeStyleUniforms,it as touchMaterial};
