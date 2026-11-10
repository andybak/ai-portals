import*as t from"three";const{sin:m,cos:V,abs:_,pow:me,min:J,max:U,PI:X,exp:Ye,sqrt:se,floor:Me}=Math,j=X*2,ne=(s,n,i)=>J(i,U(n,s)),ie=(s,n,i)=>s+(n-s)*i,H=(s,n,i)=>{const z=ne((i-s)/(n-s),0,1);return z*z*(3-2*z)},He=["#E7D9BC","#EEF1F2","#0D1136","#9CC1E6","#2A1015","#F4EEDC","#D6A63C"],Y={z0:392,z1:510,y:16.6,x:2},a={x0:-60,x1:60,y0:0,y1:80,z0:100,z1:1060,slab:20,barEnd:900,coreR:7,collarR:7.5,axis:[-15,50],waveSpeed:90,waveLength:120,waveHeight:1.5},Xe=[.59719,.076,.0284,.35458,.90834,.13383,.04823,.01566,.83777],Ze=[1.60475,-.10208,-.00327,-.53108,1.10813,-.07276,-.07367,-.00605,1.07602],Ne=new t.Matrix3().fromArray(Xe).invert(),Oe=new t.Matrix3().fromArray(Ze).invert(),Ie=s=>s.elements.map(n=>n.toFixed(6)).join(",");function nt(s,n=1,i=new t.Color){const z=new t.Vector3(J(s.r,.95),J(s.g,.95),J(s.b,.95)).applyMatrix3(Oe),d=x=>{x=ne(x,4e-4,.97);const P=.983729*x-1,p=.432951*x-.0245786,l=.238081*x+90537e-9;return(-p-se(U(p*p-4*P*l,0)))/(2*P)};return z.set(d(z.x),d(z.y),d(z.z)).applyMatrix3(Ne),i.setRGB(U(z.x,0)*.6/n,U(z.y,0)*.6/n,U(z.z,0)*.6/n)}function Je(s,n={}){const i=[s()*j,s()*j,s()*j,s()*j],z=[-.95+s.range(-.18,.18),3.5+3*s.range(-.04,.04)],d=[s()*j,s()*j,s()*j,s()*j],x=[s()*j,s()*j,s()*j,s()*j],P=s()*j,p={bp:i,tilt:z,rp:x,gp:P,pk:d};return p.barC=(l,e=[0,0])=>{const f=1-H(820,900,l),M=ne((l-100)/800,0,1);e[0]=a.axis[0]+f*(.9*m(l*.011+i[0])+.45*m(l*.027+i[1])),e[1]=a.axis[1]+f*(-1*m(X*M)+.3*m(l*.019+i[2]));for(const y of p.moons)if(y.dx&&!y.free){const A=H(y.z-95,y.z-30,l)*(1-H(y.z+30,y.z+95,l));e[0]+=y.dx*A,e[1]+=y.dy*A}return e},p.barP=l=>.16+.74*H(160,900,l),p.barR=l=>.5+.08*m(l*.043+i[3])+6.3*H(835,892,l),p.moons=[{z:318,R:11,p:.2,dx:-7,dy:3},{z:450,R:12,p:.36,dx:-15,dy:12},{z:600,R:13,p:.5,dx:-1.6,dy:15},{z:682,R:16,p:.72,free:!0,x:32,y:58}],n.gibbous&&(p.moons[3].x=n.gibbous.x,p.moons[3].y=n.gibbous.y),p.moonC=(l,e=[0,0])=>l.free?(e[0]=l.x,e[1]=l.y,e):p.barC(l.z,e),p.fullMoon={R:26},p.faceMoon={R:12,p:.14},p.barA=l=>z[1]+.16*H(300,900,l),p.inBar=(l,e,f,M=0)=>{if(f>a.barEnd+M)return!1;for(const b of p.moons)if(_(f-b.z)<2.2+M){const c=p.moonC(b);if(Math.hypot(l-c[0],e-c[1])<b.R+M)return!0}const y=p.barC(f),A=p.barR(f)+M,v=p.barA(f),T=(l-y[0])/A,D=(e-y[1])/A,R=T*V(v)+D*m(v),g=-T*m(v)+D*V(v);return R*R+g*g>1?!1:R>(1-2*p.barP(f))*se(U(1-g*g,0))-M/A},p.ridgeH=(l,e)=>{const f=-30+5*m(e*.0061+x[0]),M=31+4.5*m(e*.0048+x[1]),y=H(165,300,e)*(1-.55*H(930,1040,e)),A=27+4*m(e*.0087+x[2])+y*(9.5*(1-_(m(e*.0171+d[0])))+5*(1-_(m(e*.043+d[1])))-3),v=26.5+4*m(e*.0071+x[3])+y*(15*(1-_(m(e*.0153+d[2])))+6*(1-_(m(e*.039+d[3])))-2),T=H(230,330,e)*(1-H(540,640,e)),D=H(420,460,e)*(1-H(640,690,e)),R=(A+T*6*(1-_(m(e*.0171+d[0]))))*(1-.68*D),g=H(498,514,e)*(1-H(552,578,e)),c=(R+g*(U(R,30.8+1.3*m(e*.115+1)+.8*m(e*.31))-R))*U(.16,1-.7*me(_(l-f)/34,.8)),w=(v+T*9*(1-_(m(e*.0153+d[2]))))*U(.16,1-.7*me(_(l-M)/32,.8));let C=J(U(c,w)+.12*J(c,w),17+l*l/36);const L=1-H(.5,.85,C/30);if(C+=9*p.knoll(l,e)*H(5,18,_(l-6))*H(205,275,e)*(1-H(880,960,e)),e>975){const F=(q,E,B,O)=>{const k=(l-q)/17,ae=(e-1028)/38,Z=Math.atan2(ae,k+1e-9),ee=Math.hypot(k,ae)*(1+.1*m(3*Z+B)+.06*m(5*Z+2.3*B)),re=U(se(ee*ee+.05)-.2236,0);return E*U(0,1-me(re,1.42))+2.4*Ye(-((l-q-O)*(l-q-O)/5+(e-1026)*(e-1026)/30))};C=U(C,F(13,42,d[0],1.5),F(-43,40,d[1]+2,-1.3))}const Q=H(Y.z0,Y.z0+20,e)*(1-H(Y.z1-20,Y.z1,e))*(1-H(13,22,_(l-Y.x)));C=ie(C,J(C,13.4),Q);const I=C+.9*m(l*.21+e*.013+x[0])*m(e*.031+x[1])+.4*L*m(l*2.1+1.5*m(e*.02+x[2]));return Q>.001?U(I,Y.y):I},p.knoll=(l,e)=>{const f=U(0,m(l*.23+1.7*m(e*.021+d[0]))*m(e*.075+.8*m(l*.11)+d[1]));return f*f},p.lake=Y,p.inSight=(l,e,f,M=1)=>{for(const y of p.moons){const A=y.z-f;if(A<1||A>190)continue;if(!y.v){const c=p.moonC(y),w=ue(y.z-80);y.v=[c[0],c[1],w[0]-c[0],w[1]-c[1]]}const v=y.v,T=A/190,D=J(1,A/25),R=v[2],g=v[3],b=ne(((l-v[0])*R+(e-v[1])*g)/(R*R+g*g),T,D);if(Math.hypot(l-v[0]-R*b,e-v[1]-g*b)<(y.R*(1-b)+1.5)*M)return!0}return!1},p.gooseXY=(l,e=[0,0])=>(e[0]=6+l*4.2,e[1]=66-_(l-4)*2,e),p.gooseWing=(l,e)=>.55*m(e*(j/55)+P+l*.7),p.uniforms={uBarPh:{value:new t.Vector4(...i)},uBarTilt:{value:new t.Vector2(...z)},uRidgePh:{value:new t.Vector4(...x)},uGoosePh:{value:P},uPeakPh:{value:new t.Vector4(...d)}},p}const pe=`
  uniform vec3 uBoxMin, uBoxMax;        // the jelly box now (uBoxMin.z is the cut face)
  uniform float uCutAge[5], uCutZ0[5];  // seconds since each cut (negative: not yet) and the z it was made at
  uniform float uTime, uExposure, uWobAmp;
  uniform vec3 uDay, uDayLow, uInk, uBoard, uK;
  uniform vec4 uBarPh, uRidgePh, uPeakPh, uCore, uHas, uDawn;   // uDawn: the clear lower layer: z where it starts to rise, z where it is full, its height, the tint left in it
  uniform float uKeep, uEyeK, uModel;   // (uModel: how much a form is modelled by the thickness it looks out through; 0 = flat tone) how true a near stuff stays (0.3; the moon and the leaf more); a stuff seen down the light pipe   // uCore: axis x, axis y, radius, z where the clear core starts
  uniform vec2 uBarTilt;
  uniform float uGoosePh, uFarFace;
  uniform mat3 uRot;                    // this block's own space -> world (a slab lying on its back): for the dome only
  uniform float uIdle, uCapY;           // the jelly's never-quite-still sway (m); height above which the ridge is capped white
  uniform float uIdleF, uStick;         // the sway's beat (rad/s); 1 = this block's foot is stuck to the board (a standing slice)
  uniform float uShud, uRing;           // EIGHTH ROUND: the cut end's shudder as a wave starts (0..1); the lake's rings as a wave passes (0..1)
  uniform vec4 uWarm, uWarm2;                   // the village's lamplight on the paste round it: x, z, reach (m), strength
  uniform vec4 uStream;                 // the stream of clear agar from the lake: z0, z1, half width, on
  uniform vec2 uSide;                   // the long cut: seconds since it (negative: not yet), and the x of its plane
  // THE ROOM (fourth round): evening. uDay is still the light the jelly holds (a paper lantern's, come through the agar);
  // what a wet face MIRRORS and what shows past the jelly is the room itself: dark above, amber low, the lamp's side warmer.
  uniform vec3 uRoomHi, uRoomLow, uRoomBoard, uLamp, uLampDir;
  // the moon of THIS block: phase, radius (below zero: the loaf's own bar), 1 = angle given, angle; and its centre (z = 1: given)
  uniform vec4 uMoonOv; uniform vec3 uMoonAt;

  // ---- exact colour: display colour (linear) -> scene value ----
  vec3 toScene(vec3 D){
    vec3 y = clamp(mat3(${Ie(Oe)})*clamp(D, 0., 0.95), 0.0004, 0.97);
    vec3 A = 0.983729*y - 1., B = 0.432951*y - 0.0245786, C = 0.238081*y + 0.000090537;
    vec3 v = (-B - sqrt(max(B*B - 4.*A*C, 0.)))/(2.*A);
    return max(mat3(${Ie(Ne)})*v, 0.)*(0.6/max(uExposure, 0.05));
  }
  float hash11(float n){ return fract(sin(n*127.1)*43758.5453); }
  float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
    return mix(mix(hash21(i), hash21(i + vec2(1, 0)), f.x), mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), f.x), f.y); }


  // ---- the pictures (twins of makeShape in JS) ----
  vec2 barC(float z){ float e = 1. - smoothstep(820., 900., z), t = clamp((z - 100.)/800., 0., 1.);
    if (uMoonAt.z > 0.5) return uMoonAt.xy;
    return vec2(${a.axis[0].toFixed(1)}, ${a.axis[1].toFixed(1)}) + e*vec2(0.9*sin(z*0.011 + uBarPh.x) + 0.45*sin(z*0.027 + uBarPh.y),
      -sin(3.14159265*t) + 0.3*sin(z*0.019 + uBarPh.z)); }
  float barP(float z){ return uMoonOv.x >= 0. ? uMoonOv.x : 0.16 + 0.74*smoothstep(160., 900., z); }
  // the bar is a thread of paste between the moons, swelling to the spooned tip the core springs from
  float barR(float z){ return uMoonOv.y > 0. ? uMoonOv.y : 0.5 + 0.08*sin(z*0.043 + uBarPh.w) + 6.3*smoothstep(835., 892., z); }
  float barA(float z){ return uMoonOv.z > 0.5 ? uMoonOv.w : uBarTilt.y + 0.16*smoothstep(300., 900., z); }
  // signed distance (metres, about) to the moon's lit part at section z: below zero is white paste
  float luneSd(vec2 xy, float z){
    float R = barR(z), a = barA(z); vec2 q = (xy - barC(z))/R, l = vec2(cos(a), sin(a));
    float u = dot(q, l), v = dot(q, vec2(-l.y, l.x)), t = 1. - 2.*barP(z);
    return max(length(q) - 1., t*sqrt(max(1. - v*v, 0.)) - u)*R; }
  float knoll(float x, float z){ float a = max(0., sin(x*0.23 + 1.7*sin(z*0.021 + uPeakPh.x))*sin(z*0.075 + 0.8*sin(x*0.11) + uPeakPh.y)); return a*a; }
  float knollH(float x, float z){ return 9.*knoll(x, z)*smoothstep(5., 18., abs(x - 6.))*smoothstep(205., 275., z)*(1. - smoothstep(880., 960., z)); }      // a knoll's own height over the slope it stands on
  float ridgeRaw(float x, float z, out float basin){
    float c1 = -30. + 5.*sin(z*0.0061 + uRidgePh.x), c2 = 31. + 4.5*sin(z*0.0048 + uRidgePh.y);
    float e = smoothstep(165., 300., z)*(1. - 0.55*smoothstep(930., 1040., z));
    float h1 = 27. + 4.*sin(z*0.0087 + uRidgePh.z) + e*(9.5*(1. - abs(sin(z*0.0171 + uPeakPh.x))) + 5.*(1. - abs(sin(z*0.043 + uPeakPh.y))) - 3.);
    float h2 = 26.5 + 4.*sin(z*0.0071 + uRidgePh.w) + e*(15.*(1. - abs(sin(z*0.0153 + uPeakPh.z))) + 6.*(1. - abs(sin(z*0.039 + uPeakPh.w))) - 2.);
    float e2 = smoothstep(230., 330., z)*(1. - smoothstep(540., 640., z));
    h1 += e2*6.*(1. - abs(sin(z*0.0171 + uPeakPh.x))); h2 += e2*9.*(1. - abs(sin(z*0.0153 + uPeakPh.z)));
    h1 *= 1. - 0.68*smoothstep(420., 460., z)*(1. - smoothstep(640., 690., z));
    h1 = mix(h1, max(h1, 30.8 + 1.3*sin(z*0.115 + 1.) + 0.8*sin(z*0.31)), smoothstep(498., 514., z)*(1. - smoothstep(552., 578., z)));      // ninth round: a spur of the port range stands under the window
    float m1 = h1*max(0.16, 1. - 0.7*pow(abs(x - c1)/34. + 1e-5, 0.8)), m2 = h2*max(0.16, 1. - 0.7*pow(abs(x - c2)/32. + 1e-5, 0.8));
    float m = min(max(m1, m2) + 0.12*min(m1, m2), 17. + x*x/36.);
    float low = 1. - smoothstep(0.5, 0.85, m/30.);
    m += 9.*knoll(x, z)*smoothstep(5., 18., abs(x - 6.))*smoothstep(205., 275., z)*(1. - smoothstep(880., 960., z));
    basin = smoothstep(${Y.z0.toFixed(1)}, ${(Y.z0+20).toFixed(1)}, z)*(1. - smoothstep(${(Y.z1-20).toFixed(1)}, ${Y.z1.toFixed(1)}, z))*(1. - smoothstep(13., 22., abs(x - ${Y.x.toFixed(1)})));
    m = mix(m, min(m, 13.4), basin);
    float h = m + 0.9*sin(x*0.21 + z*0.013 + uRidgePh.x)*sin(z*0.031 + uRidgePh.y) + 0.4*low*sin(x*2.1 + 1.5*sin(z*0.02 + uRidgePh.z));
    return h; }
  float ridgeH(float x, float z){ float b; float h = ridgeRaw(x, z, b); return b > 0.001 ? max(h, ${Y.y.toFixed(2)}) : h; }
  // the winter loaf: white paste laid on the crests. Above zero is white. uCapY is the share of each crest's own height
  // where the white begins (1e5: no cap); the line wavers as a hand lays it.
  float capLine(vec3 p, float depth){
    float hi = p.y - uCapY - 4.*smoothstep(985., 1000., p.z) - 12.*smoothstep(230., 330., p.z)*(1. - smoothstep(540., 640., p.z)) - 14.*smoothstep(590., 650., p.z)*(1. - smoothstep(790., 860., p.z)) + 2.2*(vnoise(p.xz*0.16) - 0.5) + 0.7*(vnoise(p.xz*0.7) - 0.5) + 1.3*(abs(sin(p.x*0.45 + 1.1*sin(p.z*0.05 + uRidgePh.z))) - 0.64);      // tenth round: across the loaf the white hangs in round lobes some 7 m long (a fine sine read as a saw)
    // and on the top of every knoll in the valley (a pinch of white paste), wherever the loaf has snow at all
    float kn = (knoll(p.x, p.z)*smoothstep(5., 18., abs(p.x - 6.))*smoothstep(13., 27., abs(p.x - 6.))*smoothstep(205., 275., p.z)*(1. - smoothstep(880., 960., p.z)) - 0.55)*7. + 1.1*(vnoise(p.xz*0.5) - 0.5) - depth*3.;      // a crust, not a column: on a cut face it is only skin deep
    float sp = smoothstep(498., 514., p.z)*(1. - smoothstep(552., 578., p.z))*(1. - smoothstep(-12., -8., p.x));      // ninth round: the spur under the window carries snow
    hi = max(hi, p.y - 28.4 + 1.2*(vnoise(p.xz*0.3 + 5.) - 0.5) - 60.*(1. - sp) - 100.*step(1e4, uCapY));
    return max(hi, uCapY > 1e4 ? -1. : kn); }
  // signed distance to the nearest of the nine goose chevrons at section z
  float gooseSd(vec2 xy, float z){
    float d = 1e3;
    for (int i = 0; i < 9; i++){
      float fi = float(i); vec2 c = vec2(6. + fi*4.2, 66. - abs(fi - 4.)*2.);
      float a = 0.55*sin(z*0.1142397 + uGoosePh + fi*0.7);
      vec2 q = xy - c; q.x = abs(q.x); vec2 e = vec2(cos(a), sin(a))*3.;
      float h = clamp(dot(q, e)/9., 0., 1.);
      d = min(d, length(q - e*h) - mix(0.5, 0.14, h));
    }
    return d; }

  // ---- the medium moves: one elastic wave per cut, 120 m long, 1.5 m high, 90 m/s; all stuffs ride it together ----
  float wave1(float z, float age, float z0){
    float s = (z - z0 - ${a.waveSpeed.toFixed(1)}*age)/${a.waveLength.toFixed(1)};
    float h = sin(3.14159265*clamp(s, -1., 0.));
    float q = exp(-max(age, 0.)*1.2)*exp(-max(z - z0, 0.)/70.)*sin(age*8. - (z - z0)*0.07)*0.3;   // the fresh face quivers
    return step(0., age)*(h*h*${a.waveHeight.toFixed(2)} + q); }
  float waveAt(float z){ float w = 0.; for (int i = 0; i < 5; i++) w += wave1(z, uCutAge[i], uCutZ0[i]); return w; }
  vec3 wobble(vec3 p){
    float w = waveAt(p.z)*uWobAmp, hh = clamp((p.y - uBoxMin.y)/max(uBoxMax.y - uBoxMin.y, 1.), 0., 1.);
    w += uIdle*sin(uTime*uIdleF - p.z*0.045 + 1.3*sin(uTime*0.4 + p.z*0.004));       // set jelly is never quite still
    float s2 = (uSide.y - p.x - 70.*uSide.x)/70., h2 = sin(3.14159265*clamp(s2, -1., 0.));   // the long cut's sideways wave
    w -= step(0., uSide.x)*h2*h2*1.4*exp(-max(uSide.x, 0.)*0.35);
    // EIGHTH ROUND: the cut end shudders as a wave starts down the loaf (a slow, whole shake, about one a second)
    w += uShud*1.5*sin(uTime*6.3 - (p.z - uBoxMin.z)*0.08)*exp(-max(p.z - uBoxMin.z, 0.)/110.);
    // SET JELLY LEANS: its foot is stuck to the board, so the sway grows with height: the valley floor hardly moves, the
    // fir tops more, the cloud banks and the moons two or three times further (a shear, as a wobbling jelly's is)
    return vec3(w*mix(0.1 + 2.7*hh*sqrt(hh), hh*(0.55 + 0.45*hh), uStick), -0.1*w*hh, 0.35*w*hh*hh*uStick); }
  // the wave's pale front: a band some 25 m deep that runs down the loaf just behind each wave's leading edge (0..1)
  // TENTH ROUND: THE FRONT IS A TONE STEP, NOT A GLOW. One firm leading edge (half a metre: an edge, like the edge of a stuff),
  // everything behind it one flat shade paler for some 40 m, dying away softly behind that. frontP(p) is the same with the
  // edge wavering across the loaf as a hand's would (use it wherever a position is known).
  float frontAt(float z){
    float f = 0.;
    for (int i = 0; i < 5; i++){
      float age = uCutAge[i], s = (z - uCutZ0[i] - ${a.waveSpeed.toFixed(1)}*age)/${a.waveLength.toFixed(1)};
      f += step(0., age)*smoothstep(-2.6, -0.5, s)*(1. - smoothstep(-0.064, -0.06, s))*exp(-max(age - 9., 0.)*0.4);
    }
    return min(f, 1.); }
  float frontP(vec3 p){ return frontAt(p.z + 6.5*sin(p.x*0.085 + 1.4*sin(p.x*0.037 + 1.) + 0.05*p.y) + 2.4*sin(p.x*0.27 + 2. + 0.11*p.y) + 0.9*sin(p.x*0.7 + 0.3*p.y)); }
  // the stream's middle line and half width at z (JS twin: streamX / streamW in the part)
  float streamX(float z){ return 3.2 + 4.2*sin(z*0.0125 + 0.9) + 1.3*sin(z*0.043 + 2.); }
  float streamSd(vec2 xz){ return abs(xz.x - streamX(xz.y)) - uStream.z*(1. + 0.35*sin(xz.y*0.057) + 1.6*smoothstep(uStream.x + 26., uStream.x, xz.y)); }       // the foot sticks to the board; a standing slice bends from it and nods a little
  // the wash of paler blue that follows each wave through and fades: 0..1
  float washAt(float z){
    float w = 0.;
    for (int i = 0; i < 5; i++){
      float age = uCutAge[i], s = (z - uCutZ0[i] - ${a.waveSpeed.toFixed(1)}*age)/320.;
      w += step(0., age)*smoothstep(-1., -0.3, s)*(1. - smoothstep(-0.3, 0.05, s))*exp(-max(age, 0.)*0.1);
    }
    return min(w, 1.); }

  // ---- colour is thickness ----
  // the tint thins to a tenth in the top 10 m (the pale band): integral of the density from 0 to y
  float rhoInt(float y){ float h = clamp(y - (uBoxMax.y - 10.), 0., 10.); return y - 0.045*h*h; }
  float rhoAt(float y){ return 1. - 0.09*clamp(y - (uBoxMax.y - 10.), 0., 10.); }
  float rhoAvg(float ya, float yb){ float dy = yb - ya; return abs(dy) < 0.02 ? rhoAt(ya) : (rhoInt(yb) - rhoInt(ya))/dy; }
  // THE DAWN LAYER. The loaf was poured in two: under the indigo lies a layer of almost colourless agar, nothing at the
  // cut end, rising to uDawn.z metres by z uDawn.y and level from there to the far face, the boundary soft over ten
  // metres. Daylight comes up it from the far end, so the valley between the ranges lies in dawn under the night.
  float dawnFr(float y, float z, float fr){
    float h = uDawn.z*smoothstep(uDawn.x, uDawn.y, z);
    return mix(1., mix(uDawn.w, 1., smoothstep(h - 7., h + 4. + fr, y)), smoothstep(0., 10., h)); }
  float dawnAt(float y, float z){ return dawnFr(y, z, 0.); }
  // mean tint along a straight run from (ya, za) to (yb, zb): the pale top exactly, the dawn layer by five samples
  float rhoSeg(float ya, float yb, float za, float zb){
    float fr = 0.05*abs(zb - za);          // seen down a long reach of the loaf the boundary is a broad soft fringe: the glow fades upward
    float d = dawnFr(mix(ya, yb, 0.1), mix(za, zb, 0.1), fr) + dawnFr(mix(ya, yb, 0.3), mix(za, zb, 0.3), fr) + dawnFr(mix(ya, yb, 0.5), mix(za, zb, 0.5), fr)
            + dawnFr(mix(ya, yb, 0.7), mix(za, zb, 0.7), fr) + dawnFr(mix(ya, yb, 0.9), mix(za, zb, 0.9), fr);
    return rhoAvg(ya, yb)*d*0.2; }
  // distance from p (inside the box) to where a ray along unit d leaves it
  float boxExit(vec3 p, vec3 d){
    vec3 far = mix(uBoxMin, uBoxMax, step(0., d));
    vec3 t = max((far - p)*(step(0., d)*2. - 1.), 0.)/(abs(d) + 1e-5);
    return min(t.x, min(t.y, t.z)); }
  // share of the sight line from the eye to p that runs inside the colourless core (0..1)
  float coreClear(vec3 p, vec3 eye){
    float re = length(eye.xy - uCore.xy), rp = length(p.xy - uCore.xy), R = uCore.z;
    float c = re < R ? (rp < R ? 1. : (R - re)/max(rp - re, 1e-3)) : (rp < R ? (R - rp)/max(re - rp, 1e-3) : 0.);
    return clamp(min(c, (max(p.z, eye.z) - uCore.w)/max(abs(p.z - eye.z), 1e-3)), 0., 1.); }
  // tinted metres between p and the eye
  float eyePath(vec3 p, vec3 eye){
    vec3 e = eye - p; float L = length(e); vec3 d = e/max(L, 1e-4);
    float le = min(L, boxExit(clamp(p, uBoxMin, uBoxMax), d));
    return le*rhoSeg(p.y, p.y + d.y*le, p.z, p.z + d.z*le)*(1. - coreClear(p, eye))*uEyeK; }
  // what is left of daylight after m tinted metres: red goes first, blue last, and the long view closes to ink
  vec3 transmit(float m){ return exp(-uK*m - m*m*8.0e-6); }
  // tinted metres daylight crosses to reach a surface at p facing n: the nearest outer face (or the clear core),
  // mixed with the thickness the surface itself looks out through, which is all the modelling a form gets
  float lightPath(vec3 p, vec3 n){
    vec3 q = clamp(p, uBoxMin, uBoxMax);
    float side = min(q.x - uBoxMin.x, uBoxMax.x - q.x), ends = min(q.z - uBoxMin.z, uBoxMax.z - q.z);
    float dq = dawnAt(q.y, q.z);
    float near = min(min(side, ends)*rhoAt(q.y)*dq, (uBoxMax.y - q.y)*rhoSeg(q.y, uBoxMax.y, q.z, q.z));
    float core = max(length(q.xy - uCore.xy) - uCore.z, 0.) + max(uCore.w - q.z, 0.);
    near = min(near, core);
    float t = min(boxExit(q, n), 150.), yb = q.y + n.y*t;
    float along = t*rhoSeg(q.y, yb, q.z, q.z + n.z*t) + 70.*step(yb, uBoxMin.y + 0.05)*step(n.y, 0.);    // the board sends little back
    return mix(near, min(along, near + 70.), uModel); }
  // THE rule: an opaque stuff of display colour 'albedo' at p (normal n) as the eye sees it, as a scene value
  float gKeep = 0., gEye = 1.;          // tenth round: a fragment may ask to stay truer than its material's uKeep and uEyeK (white paste laid on dark: the snow)
  vec3 inJelly(vec3 albedo, vec3 p, vec3 n, vec3 eye){
    float w = 1. - 0.32*washAt(p.z), keep = clamp(uKeep + gKeep, 0., 1.);
    // the long cut: daylight floods in from the fresh wall, a pale front that crosses the loaf in a second and fades over six
    w -= 0.3*step(0., uSide.x)*smoothstep(0., 1., (uSide.x*55. - (uSide.y - p.x))/20.)*exp(-max(uSide.x, 0.)*0.3);
    vec3 Te = transmit(eyePath(p, eye)*w*gEye);
    vec3 T = Te*transmit(lightPath(p, n)*w*0.4);          // daylight arrives scattered: under half the straight path counts
    // a stuff's own hue goes with the red: far gold and far paste are both simply pale, then blue, then ink
    // near, a stuff is only dimmed and stays true; with distance it becomes the blue ghost of itself
    vec3 W = vec3(0.3, 0.55, 0.15);
    vec3 col = mix(albedo*mix(dot(T, W), 1., keep), vec3(dot(albedo, W))*T, smoothstep(0.42*max(keep - 0.3, 0.), 1., 1. - Te.g*sqrt(Te.g)));     // gold within 10 m is gold
    return toScene(col + uInk*(1. - Te.b)); }
  // the same for bare agar: what lies behind the jelly (display colour 'behind') through 'metres' of it
  vec3 throughJelly(vec3 behind, float metres, float z){
    vec3 T = transmit(metres*(1. - 0.32*washAt(z)));
    return toScene(behind*T + uInk*(1. - T.b)); }
  // the workroom's north light, as mirrored by wet faces and seen past the board
  vec3 domeAt(vec3 d){ d = uRot*d;
    float l = max(dot(d, uLampDir), 0.); l *= l; l *= l;
    vec3 c = d.y < 0. ? mix(uRoomLow, uRoomBoard, 1. - smoothstep(-0.25, 0., d.y)) : mix(uRoomLow, uRoomHi, smoothstep(0., 0.5, d.y));
    return c + uLamp*(0.22*l + 0.5*l*l*l*l); }
`,Te=`
  vec3 eyeLocal(){ return (cameraPosition - modelMatrix[3].xyz)*mat3(modelMatrix); }
`;function et(s={}){const n=(s.palette||He).map(c=>new t.Color(c)),i=s.shape,z=s.box||{min:[a.x0,a.y0,a.z0],max:[a.x1,a.y1,a.z1]},d=new t.Vector3(-Math.log(n[3].r/n[1].r)/30,-Math.log(n[3].g/n[1].g)/30,-Math.log(n[3].b/n[1].b)/30),x={uBoxMin:{value:new t.Vector3(...z.min)},uBoxMax:{value:new t.Vector3(...z.max)},uCutAge:{value:[-1,-1,-1,-1,-1]},uCutZ0:{value:[z.min[2],z.min[2],z.min[2],z.min[2],z.min[2]]},uTime:{value:0},uExposure:{value:s.exposure??1},uWobAmp:{value:1},uDay:{value:n[1]},uDayLow:{value:n[1].clone().lerp(n[3],.16)},uInk:{value:n[2]},uBoard:{value:n[0]},uK:{value:d},uPx:{value:600},uCore:{value:new t.Vector4(a.axis[0],a.axis[1],s.core===!1?-1e4:a.coreR,s.core===!1?1e6:a.barEnd)},uHas:{value:new t.Vector4(1,1,1,1)},uFarFace:{value:s.farFace?1:0},uFloor:{value:1},uDawn:{value:new t.Vector4(1e6,2e6,0,1)},uKeep:{value:.3},uEyeK:{value:1},uModel:{value:.65},uRoomHi:{value:new t.Color("#150E0A")},uRoomLow:{value:new t.Color("#3A2413")},uRoomBoard:{value:new t.Color("#5E4326")},uLamp:{value:new t.Color("#F2B55E")},uLampDir:{value:new t.Vector3(.7,.25,.65).normalize()},uMoonOv:{value:new t.Vector4(-1,-1,0,0)},uMoonAt:{value:new t.Vector3(0,0,0)},uLampPos:{value:new t.Vector3(-430,170,760)},uLampK:{value:new t.Vector4(1.3,600,1,1)},uSteelC:{value:new t.Color("#B4BAC0")},uWin:{value:new t.Vector4(512,48,0,24)},uKnife:{value:new t.Vector4(-72,470,-.06,0)},uBowl:{value:new t.Vector3(700,1250,1)},uRot:{value:new t.Matrix3},uIdle:{value:s.idle??.22},uIdleF:{value:s.idleF??1.25},uStick:{value:s.stick??0},uCapY:{value:1e5},uSide:{value:new t.Vector2(-1,1e5)},uShud:{value:0},uRing:{value:0},uWarm:{value:new t.Vector4(0,0,1,0)},uWarm2:{value:new t.Vector4(0,0,1,0)},uStream:{value:new t.Vector4(506,912,1.5,0)},...i.uniforms},P=c=>Object.assign({},x,c),p=`${pe}
    varying vec3 vP; varying vec3 vN; varying vec3 vEye;`,l=p+Te;function e(c,w={}){return new t.ShaderMaterial({uniforms:P({uAlbedo:{value:new t.Color(c)},uGrain:{value:w.grain??.1},uCapCol:{value:n[5]},uSlabT:{value:n[3].clone().multiplyScalar(1/U(n[3].r,n[3].g,n[3].b,.001))},uCapOn:{value:w.cap?1:0},uFurrow:{value:w.furrow??0},uMoon:{value:w.moon?1:0},uStreak:{value:w.streak??0},uMoonLit:{value:w.moonLit??0},uMaria:{value:w.maria??0},uTip:{value:w.tip??0},uLake:{value:w.lake||new t.Vector4(0,0,0,0)},uLakeMoon:{value:w.lakeMoon||new t.Vector4(0,0,1e5,1)},uLakeMoon2:{value:w.lakeMoon2||new t.Vector2(.5,0)},...w.keep!==void 0?{uKeep:{value:w.keep}}:{},...w.eyeK!==void 0?{uEyeK:{value:w.eyeK}}:{},...w.model!==void 0?{uModel:{value:w.model}}:{}}),side:w.side??t.DoubleSide,vertexShader:`${l}
        attribute float aHollow; varying float vHol;      // 1 in the spoon's hollow (the tip); geometries without it read 0
        attribute vec3 aTipQ; varying vec3 vTipQ;         // the tip: the scoop's own coordinates (along, across) and the drag ridges' tone (+ crest, - trough)
        void main(){ vP = position; vN = normal; vEye = eyeLocal(); vHol = aHollow; vTipQ = aTipQ;
          gl_Position = projectionMatrix*modelViewMatrix*vec4(position + wobble(position), 1.); }`,fragmentShader:`${p}
        varying float vHol; varying vec3 vTipQ;
        uniform vec3 uAlbedo, uCapCol, uSlabT; uniform float uGrain, uCapOn, uFurrow, uMoon, uStreak, uMoonLit, uMaria, uTip; uniform vec4 uLake, uLakeMoon; uniform vec2 uLakeMoon2;
        void main(){
          if (vP.z < uBoxMin.z || vP.x > uBoxMax.x) discard;     // the blade has been here
          vec3 e = vEye - vP; float dist = length(e);
          vec3 n = vN/max(length(vN), 1e-4); if (dot(n, e) < 0.) n = -n;
          // the hand: paste pressed through a nozzle keeps long streaks and a fine tooth; both fade to their mean far off
          float near = 1. - smoothstep(30., 140., dist), fine = 1. - smoothstep(8., 45., dist);
          float g = (vnoise(vec2(vP.z*0.045, (vP.x - vP.y)*0.8)) - 0.5)*near + 0.6*(vnoise(vP.xy*3.1 + vP.z*0.9) - 0.5)*fine;
          g -= 0.45*smoothstep(0.62, 0.7, vnoise(vec2(vP.z*0.012, (vP.x + vP.y*0.6)*2.6)))*fine;     // the nozzle's grooves
          // the fork's furrows (the ridge only): combed while the paste was soft, running lengthways and wavering; the
          // crests are rubbed paler. Finer than about 3 px they give way to their mean.
          // THE FORK AND THE HAND (fourth round). Near, each furrow wavers by a third of its width, a crest breaks every ten
          // or twenty metres, crests are rubbed paler in patches and carry a tooth, crumbs lie in the troughs: all of it
          // changes along the course, so it streams under us; beyond some 60 m it gives way to the plain furrow, then its mean.
          float fz = max(fwidth(vP.z), 1e-4), nearZ = 1. - smoothstep(0.5, 2.5, fz), fineZ = 1. - smoothstep(0.04, 0.22, fz);
          // EIGHTH ROUND: BEAN PASTE A FORK WAS DRAWN THROUGH. Near the eye each furrow is a decided pale crest line beside a
          // darker flat trough: two flat tones meeting at an edge, with one thin deep line where the tine cut. The furrows
          // waver by a third of their width, a crest is broken off where the fork skipped, crests are rubbed paler in
          // patches, and within some 20 m the paste shows its pits and its tooth. Beyond some 60 m the furrows are gone:
          // the slopes there are tone and form (below), never corduroy.
          float fnear = 1. - smoothstep(64., 120., dist);      // ninth round: the side slopes are the same combed paste as the floor, seen further off
          float fq = vP.x*2.2 + 1.5*sin(vP.z*0.02 + uRidgePh.z) + 0.6*vnoise(vec2(vP.x*0.3, vP.z*0.01))
                   + 2.0*(vnoise(vec2(vP.x*0.45, vP.z*0.1)) - 0.5) + 0.9*(vnoise(vec2(vP.x*1.3 + 7., vP.z*0.33)) - 0.5);
          float fw = max(fwidth(fq), 1e-4), fa = clamp(fw/3.14159, 0.004, 0.5);
          float fsg = fract(fq/6.2831853 + 0.5) - 0.5, fc = 1. - 2.*abs(fsg);            // fsg: across one furrow, 0 on the crest's own line
          float fi = floor(fq/6.2831853 + 0.5), bz = vP.z/13. + hash11(fi*1.37)*9., bc = floor(bz);
          float gap = step(0.5, hash21(vec2(fi, bc)))*(1. - smoothstep(0.03, 0.24, abs(fract(bz) - 0.25 - 0.5*hash21(vec2(bc, fi + 3.)))))*(1. - smoothstep(24., 42., dist))*smoothstep(0.88, 0.95, n.y);      // ninth round: where the fork skipped (on the floor) the crest thins to a point and is gone (never a square end); only near the eye: further off the furrow lines run unbroken
          float crest = smoothstep(0.74 + 0.32*gap - fa, 0.74 + 0.32*gap + fa, fc);
          float groove = (1. - smoothstep(0.04 - 0.5*fa, 0.04 + 0.5*fa, abs(fsg - 0.19)))*(1. - smoothstep(0.2, 0.5, gap))*(1. - smoothstep(0.02, 0.1, fa));
          float rub = 0.55*smoothstep(0.585, 0.615, vnoise(vec2(vP.x*0.13, vP.z*0.085)))*(1. - smoothstep(28., 60., dist));      // (a rubbed patch is one firm step of tone)
          float tooth = (vnoise(vec2(vP.x*8., vP.z*4.3)) - 0.5)*fineZ;
          float pitK = (1. - smoothstep(0.1, 0.45, fz))*(1. - smoothstep(14., 30., dist));
          float pits = smoothstep(0.66, 0.72, vnoise(vP.xz*2.7 + 11.))*pitK;
          vec2 cc = floor(vP.xz*1.3), cq2 = fract(vP.xz*1.3) - 0.5 - (vec2(hash21(cc + 4.1), hash21(cc + 8.3)) - 0.5)*0.5;
          float crumb = step(0.9, hash21(cc))*(1. - smoothstep(0.1, 0.2, length(cq2)))*fineZ*(1. - crest);
          float fvis = (1. - smoothstep(1.0, 2.6, 2.9*max(fwidth(vP.x), 1e-4)))*fnear;      // ninth round: by the furrow's own mean width on screen (the waver's local slope made it come and go in soft blocks)
          float fur = mix(1.3, (mix(0.96 - 0.42*groove, mix(2.7, 2.25, smoothstep(30., 70., dist)) + 1.1*rub, crest)*(1. + 0.5*tooth*crest) + 1.5*crumb)*(1. - 0.34*pits), fvis)*(0.9 + 0.2*vnoise(vP.xz*0.07 + 3.));      // and the whole field is patchy, as a hand leaves it
          g = mix(g, 0.5*(vnoise(vP.xy*3.1 + vP.z*0.9) - 0.5)*fine, uFurrow);      // ninth round: the ridge is combed, not streaked (the nozzle's long soft blocks read as camouflage on the slopes)
          // the nozzle's long streaks close to (the Moon Bar): finer than three pixels they give way to their mean
          float sa = (vP.x - vP.y)*8., sb = (vP.x + vP.y)*8., sw = fwidth(sa) + fwidth(sb);
          g += uStreak*(vnoise(vec2(vP.z*0.03, sa)) + vnoise(vec2(vP.z*0.03 + 9., sb)) - 1.)*(1. - smoothstep(0.3, 0.8, sw));
          // THE MOON CUT LENGTHWAYS: a lune has two faces, the swelling lit limb and the hollow, and the hollow lies in the
          // moon's own thickness: a third darker and bluer. They meet in the horn, one crisp edge running the length of the bar.
          vec2 mq = (vP.xy - barC(vP.z))/max(barR(vP.z), 1.); float ma = barA(vP.z); vec2 ml = vec2(cos(ma), sin(ma));
          float mu = dot(mq, ml), mv = dot(mq, vec2(-ml.y, ml.x));
          float hollow = uMoon*smoothstep(-0.012, 0.012, (1. - length(mq)) - (mu - (1. - 2.*barP(vP.z))*sqrt(max(1. - mv*mv, 0.))))*(1. - smoothstep(884., 892., vP.z))*(1. - smoothstep(0.5, 0.8, abs(vN.z)/max(length(vN), 1e-4)));
          float faceC = dot(n, vec3(-0.62, 0.55, 0.56));
          float cq = capLine(vP + vec3(0., 0.9*uMoonLit, 0.), 0.);
          // TENTH ROUND: the white's edge is a level line of the LAND, not of the mesh: near the line the height is taken from the
          // picture function itself (across a sharp crest the mesh's facets and its normals made the edge a saw), and the
          // snowline no longer steps down on the faces turned to the moons (that step ran along the creases)
          if (uCapOn > 0.5 && abs(cq) < 4.5 && vP.z < 968.) cq = capLine(vec3(vP.x, mix(ridgeH(vP.x, vP.z), vP.y, smoothstep(940., 968., vP.z)) + 0.9*uMoonLit, vP.z), 0.);
          float cw = clamp(fwidth(cq), 1e-3, 0.5);      // white paste on the crests, lower on the faces turned to the moons
          // ninth round: spread paste ends in round lobes. TENTH ROUND: seen end-on along the valley a 10 m lobe is a tooth: there the
          // short lobes give way (by their own width against their height on screen) and long ones of some 30 m carry the edge
          float lph = vP.z*0.3 + 2.4*vnoise(vP.xz*0.045 + 9.) + vP.x*0.07, lratio = 3.5*fwidth(cq)/max(fwidth(lph), 1e-4);
          cq += (0.9*(abs(sin(lph)) - 0.64)*smoothstep(0.9, 2.2, lratio) + 1.5*(abs(sin(vP.z*0.105 + 1.7*vnoise(vP.xz*0.02 + 4.) + vP.x*0.03)) - 0.64))*uCapOn;
          float cap = uCapOn*smoothstep(-cw, cw, cq);
          fur = mix(fur, 1., cap);                                   // one paste laid on another: a crisp line at any distance
          // THE LAKE: a basin of the valley filled with clear agar. It mirrors the night: the third moon hanging over its far
          // end (the true reflection of that slice of paste, found by the ray), ink above, the dawn low down; its skin is
          // never still, so the moon in it wavers.
          // EIGHTH ROUND: THE STREAM. Clear agar runs out of the lake's far end and winds down the valley floor to the dawn: a
          // pale ribbon that holds the light of the far end, short ripple lines running down it, a paler wet line at its banks.
          float bank = 0.;
          if (uStream.w > 0.5 && vP.z > uStream.x - 6. && vP.z < uStream.y) {
            float ss = streamSd(vP.xz) + 3.*smoothstep(uStream.y - 40., uStream.y, vP.z), sa = clamp(fwidth(ss), 1e-3, 3.);
            if (ss < 0. && sa < 2.*uStream.z) {
              float ry = abs(e.y)/max(dist, 1e-4);
              float rq = vP.z*0.42 - uTime*1.5 + 1.3*sin(vP.x*1.3 + vP.z*0.21), rw = clamp(fwidth(rq), 1e-3, 1.);
              float ripl = (1. - smoothstep(0.07, 0.1 + 1.5*rw, abs(fract(rq) - 0.5)))*(1. - smoothstep(0.25, 0.6, rw))*smoothstep(0.4, 0.55, vnoise(vec2(vP.x*0.8 + floor(rq)*3.1, 1.7)));
              vec3 wc = uInk*1.5 + uDayLow*(0.3 + 0.34*(1. - smoothstep(0.03, 0.45, ry)));
              wc += uDayLow*0.3*ripl; wc *= 1. + 0.55*smoothstep(-0.5 - sa, 0., ss) + 0.4*frontP(vP);
              wc *= min(1., dot(uCapCol, vec3(0.287, 0.526, 0.143))/max(dot(wc, vec3(0.3, 0.55, 0.15)), 1e-4));      // (tenth round: its wet line inside the wave's front is never lighter than the moon's cream)
              vec3 Tw = transmit(eyePath(vP, vEye)*0.6);
              gl_FragColor = vec4(toScene(wc*Tw + uInk*(1. - Tw.b)), 1.); return;
            }
            bank = (1. - smoothstep(0., 0.4 + sa, ss))*(1. - smoothstep(1.5, 4., sa));
          }
          if (uLake.w > 0.5 && vP.z > uLake.x && vP.z < uLake.y) {
            float lb; float depth = uLake.z - ridgeRaw(vP.x, vP.z, lb);
            if (lb > 0.001 && depth > 0.) {
              vec3 dv = -e/max(dist, 1e-4);
              float lf = 1. - smoothstep(0.15, 0.8, fz);
              vec2 rp2 = vec2(sin(vP.x*0.9 + uTime*0.8 + 1.7*sin(vP.z*0.31 - uTime*0.5)), sin(vP.z*0.7 - uTime*0.6 + 1.3*sin(vP.x*0.43 + uTime*0.4)));
              // EIGHTH ROUND: when a wave passes under it the lake's round breaks into rings (uRing), which run out to the shore and die
              float rgd = length((vP.xz - vec2(${Y.x.toFixed(1)}, ${((Y.z0+Y.z1)/2).toFixed(1)}))*vec2(1., 0.5)), rgs = sin(rgd*1.25 - uTime*3.4), rgw = clamp(fwidth(rgd)*1.25, 1e-3, 2.);
              float ring = uRing*rgs*(1. - smoothstep(0.6, 1.6, rgw)); rp2 += 5.*ring;
              vec3 r = vec3(dv.x + 0.004*rp2.x*lf, abs(dv.y) + 0.02, dv.z + 0.004*rp2.y*lf); r /= max(length(r), 1e-4);
              // the moon is a round that faces the eye: in the water it is that same round, upside down, wavering only at its edge
              vec3 mc = uLakeMoon.xyz - vP; float al = dot(mc, r); vec3 hh = r*al - mc;
              vec3 rr = cross(vec3(0., 1., 0.), -r); rr /= max(length(rr), 1e-3); vec3 uu = cross(-r, rr);
              vec2 lq = vec2(dot(hh, rr), dot(hh, uu))/max(uLakeMoon.w, 1.), ll = vec2(-cos(uLakeMoon2.y), sin(uLakeMoon2.y));
              float lu = dot(lq, ll), lv = dot(lq, vec2(-ll.y, ll.x)), wav = 0.045*(rp2.x + rp2.y)*lf + 0.22*ring;
              float lsd = (1. - 2.*uLakeMoon2.x)*sqrt(max(1. - lv*lv, 0.)) - lu, lrd = length(lq) - 1. + wav;
              float lw = clamp(fwidth(lq.x) + fwidth(lq.y), 0.01, 0.2);
              float moonR = (1. - smoothstep(-lw, lw, lrd))*step(0.001, al), moon = moonR*(1. - smoothstep(-lw, lw, lsd + wav));
              vec3 sky = uInk*1.9 + uDayLow*(0.05 + 0.55*(1. - smoothstep(0.03, 0.32, r.y)));
              vec3 T = transmit(eyePath(vP, vEye));
              sky = mix(sky, sky + (uDayLow - uInk)*0.06, moonR);                                            // the unlit round, faintly paler
              // seventh round: the water is seen to be water: short pale ripple lines lie across it and drift (finer than three pixels: gone)
              float rq = vP.z*0.5 + 1.5*sin(vP.x*0.23 + uTime*0.25) + 0.7*sin(vP.x*0.61 - uTime*0.4), rw = clamp(fwidth(rq), 1e-3, 1.);
              float ripl = (1. - smoothstep(0.05, 0.07 + 1.5*rw, abs(fract(rq) - 0.5)))*(1. - smoothstep(0.2, 0.55, rw))*smoothstep(0.5, 0.62, vnoise(vec2(vP.x*0.16 + floor(rq)*3.1, uTime*0.12)))*smoothstep(0.3, 1.2, depth);
              sky += (uDayLow - uInk)*0.11*ripl*(1. - moonR) + (uDayLow - uInk)*0.2*uRing*smoothstep(0.55, 0.9, rgs)*(1. - smoothstep(0.6, 1.6, rgw));
              vec3 lake = mix(sky, uCapCol*0.9, moon*0.92)*(1. + 0.5*(1. - smoothstep(0., 0.35, depth)));      // a paler wet line at the shore
              gl_FragColor = vec4(toScene(lake*T + uInk*(1. - T.b)), 1.); return;
            }
          }
          float drift = mix(0.95, 0.82 + 0.26*vnoise(vec2(vP.x*0.6 + vP.z*0.15, vP.z*0.08)) - 0.1*smoothstep(0.55, 0.75, vnoise(vP.xz*0.21 + 5.)), (1. - smoothstep(1.5, 5., fz))*uCapOn);      // wind-laid drifts in the snow
          // SIXTH ROUND: MOONLIGHT ON THE LAND. The moons hang to port and ahead: every slope and crest that faces them carries
          // a rim of their light (paste a shade warmer and paler, snow whiter), the slopes turned away stay in the ink, so
          // each range reads as a shape against the night. It is tone only: no cast shadow, no lamp.
          // EIGHTH ROUND: TONE AND FORM. A slope is one of three flat tones by how it faces the moons (they hang to port and
          // ahead): the faces turned to them pale and warm, the faces turned away a cool dark, the rest the paste's own
          // colour, meeting at soft-wavering edges; the valley floor is a shade paler than the slopes. No cast shadow, no lamp.
          // TENTH ROUND: A KNOLL TAKES THE TONE OF THE SLOPE IT STANDS ON. Its own round back, turned from the moons, was one
          // isolated dark disc with a firm edge (the see-through disc on the left range, the dark leaf on the knoll): the tone
          // is chosen by the land's slope WITHOUT the knoll, so a knoll reads by its outline, its furrows and its pinch of snow.
          vec3 nT = n;
          if (uFurrow > 0.5 && n.y > 0.15) { float e7 = 1.6; vec2 kg = vec2(knollH(vP.x + e7, vP.z) - knollH(vP.x - e7, vP.z), knollH(vP.x, vP.z + e7) - knollH(vP.x, vP.z - e7))/(2.*e7);
            vec3 nb = vec3(n.x/n.y + kg.x, 1., n.z/n.y + kg.y); nT = nb/max(length(nb), 1e-3); }

          // (tenth round: where the furrows show, each combed strip takes its tone whole: a tone's edge runs along the furrows and
          // steps from strip to strip, as light lies on combed paste. One smooth round edge laid across the furrows read as a
          // see-through disc lying over the slope: the dark round on the starboard range over the village.)
          float face = dot(nT, vec3(-0.62, 0.55, 0.56)) + 0.1*(vnoise(vP.xz*0.09 + 3.) - 0.5) + 0.2*(hash11(fi*2.17 + 3.) - 0.5)*fvis*uFurrow, aw2 = clamp(fwidth(face), 2e-4, 0.05);      // ninth round: one pixel of edge wherever the slope turns, however slowly (a fixed band left soft blots on the knolls)
          float kn9 = 9.*knoll(vP.x, vP.z)*smoothstep(5., 18., abs(vP.x - 6.))*smoothstep(205., 275., vP.z)*(1. - smoothstep(880., 960., vP.z));
          // (tenth round: a knoll's side turned from the moons is only a shade cooler: at full strength it was one isolated dark patch, a hole in the paste)
          float mlit = smoothstep(0.62 - aw2, 0.62 + aw2, face)*uMoonLit, mshd = (1. - smoothstep(0.22 - aw2, 0.22 + aw2, face))*uMoonLit*(1. - 0.72*smoothstep(0.8, 3., kn9)), mh = smoothstep(16., 46., vP.y);
          // (tenth round: a half tone between the paste's own colour and the moonlit one: a buttress turned half from the moons was
          // one dark round with a single firm edge among pale slopes, the see-through disc on the left range at u 0.34)
          float mhalf = smoothstep(0.4 - aw2, 0.4 + aw2, face)*uMoonLit;
          float fy = vP.y - kn9 + 2.*(vnoise(vP.xz*0.13 + 7.) - 0.5), fyw = clamp(fwidth(fy), 0.02, 1.5);      // tenth round: a knoll is the floor's own paste heaped up: it keeps the floor's paler tone (it stood out of it as a dark patch)
          float floorK = (1. - smoothstep(21.7 - fyw, 22.3 + fyw, fy))*uMoonLit;
          // and the slopes are laid in terraces: three flat tones by height, their edges wavering as a hand leaves them
          float ty = vP.y - kn9 + 3.2*(vnoise(vP.xz*0.1 + 1.) - 0.5), tyw = clamp(fwidth(vP.y), 0.02, 0.7);      // ninth round: by the range's own height: a knoll's top is no dark cap
          // (tenth round: the middle terrace is a shade, not a dark band: on a rounded hill it stood as a dark see-through disc)
          // (and the three tones climb: each terrace a shade paler than the one below. A middle terrace darker than both its
          // neighbours lay round a buttress as a closed dark shape: the see-through disc on the starboard range over the village.)
          float terr = mix(1., mix(1., 1.07, smoothstep(26. - tyw, 26. + tyw, ty))*mix(1., 1.1, smoothstep(32.5 - tyw, 32.5 + tyw, ty)), uMoonLit);
          // the full moon's seas: where the hand pressed the paste thin it is a breath cooler (never near the opening in its middle)
          float mr = length(vP.xy - uCore.xy), mar = uMaria*smoothstep(0.5, 0.6, vnoise(vP.xy*0.075 + 3.7) + 0.25*vnoise(vP.xy*0.3 + 9.))*smoothstep(9.5, 14., mr)*(1. - smoothstep(22.5, 25.5, mr));
          // EIGHTH ROUND: THE HARE IN THE MOON, pressed into the paste with a thumb: a hare bent over its mortar, the pestle in its
          // paws, a shade cooler than the cream (flat, one crisp edge), low on the left of the round and clear of the opening
          if (uMaria > 0.5) { vec2 hq = vec2(-(vP.x - uCore.x), vP.y - uCore.y); float hw2 = clamp(fwidth(hq.x) + fwidth(hq.y), 1e-3, 1.);
            float hd = length((hq - vec2(-13., -9.))*vec2(1., 1.3)) - 6.;                                   // its body
            hd = min(hd, length(hq - vec2(-10.6, -3.4)) - 2.7);                                               // its head
            vec2 e1 = hq - vec2(-12.6, 1.4), e2 = hq - vec2(-10.2, 1.9);                                       // two ears laid back
            hd = min(hd, length(vec2(e1.x*0.92 + e1.y*0.39, (-e1.x*0.39 + e1.y*0.92)*0.3)) - 0.95);
            hd = min(hd, length(vec2(e2.x*0.98 + e2.y*0.2, (-e2.x*0.2 + e2.y*0.98)*0.3)) - 0.9);
            vec2 pa = vec2(-8.6, -6.4), pb = vec2(-3.2, -11.6), pq = hq - pa, pd = pb - pa; float ph = clamp(dot(pq, pd)/dot(pd, pd), 0., 1.);
            hd = min(hd, length(pq - pd*ph) - 0.55);                                                          // the pestle
            vec2 mq2 = abs(hq - vec2(-2.6, -15.4)) - vec2(3.4 - 0.25*(hq.y + 15.4), 2.5); hd = min(hd, max(mq2.x, mq2.y));      // the mortar
            hd = min(hd, length((hq - vec2(-18.6, -11.6))*vec2(1., 1.1)) - 1.5);                              // its scut
            mar = max(mar, (1. - smoothstep(-hw2, hw2, hd))*2.4); }
          float frnt = frontP(vP)*uMoonLit;                      // the wave's pale front running down the valley floor and the snow
          vec3 ridgeC = uAlbedo*mix(1., fur, uFurrow)*terr*mix(mix(mix(1., 0.72/min(terr, 1.), mshd), 1.4 + 0.5*mh, mhalf), 1.75 + 1.5*mh, mlit)*mix(vec3(1.), vec3(0.7, 0.79, 1.26), mshd)*(1. + 0.9*floorK) + uCapCol*(0.05*mlit*(0.3 + mh) + 0.03*floorK);
          // NINTH ROUND: THE SNOW IS WHITE PASTE SPREAD WITH A KNIFE. Long shallow strokes lie along the slope, one over the
          // next: two close tones of cream meeting at a firm edge, a thin cooler line where a stroke's edge stands proud;
          // its lower edge on the dark paste is thick: a paler lip, and under it a narrow dark crease. Finer than a few pixels
          // the strokes give way to their mean. (No sugar grains: they read as square flecks.)
          float kq = vP.y*0.34 + vP.z*0.02 + 2.0*vnoise(vec2(vP.z*0.055, vP.x*0.07 + 3.)) + 0.5*vnoise(vec2(vP.z*0.16, vP.y*0.2 + 1.));      // tenth round: narrower strokes that bow and waver (level bands on a flat slope read as straight-edged facets)
          // TENTH ROUND: on the two peaks by the full moon the knife was drawn down from the top: five strokes fan round each heap
          float pw = 0.;
          { vec2 pc = vec2(vP.x > -15. ? 13. : -43., 1028.), pd = (vP.xz - pc)/vec2(17., 38.); float pr = length(pd);
            pw = smoothstep(982., 996., vP.z)*(1. - smoothstep(0.85, 1.05, pr));
            if (abs(pd.x) + abs(pd.y) < 1e-4) pd = vec2(1e-4, 0.);
            kq = mix(kq, atan(pd.y, pd.x)*1.5915494 + 0.05*vP.y + 0.35*vnoise(vec2(vP.y*0.11, vP.x*0.2 + 3.)), pw); }
          float kw = clamp(fwidth(kq), 1e-3, 1.);
          float kp = abs(fract(kq*0.5)*2. - 1.), kvis = (1. - smoothstep(0.22, 0.45, kw))*uCapOn;
          float kpar = smoothstep(0.5 - 0.6*kw, 0.5 + 0.6*kw, kp), kline = (1. - smoothstep(0.03 + 0.5*kw, 0.06 + 1.5*kw, abs(kp - 0.5)))*(1. - smoothstep(0.08, 0.22, kw));
          float lip = (1. - smoothstep(0.55, 0.75 + cw, cq))*(1. - smoothstep(0.25, 0.5, cw))*uCapOn;
          drift = mix(drift, mix(mix(0.76, 0.98, kpar)*(1. - 0.13*kline), 1.03, lip), kvis);
          // (tenth round: the crease is a narrow line in METRES. Round a knoll's pinch of snow, where the line's function falls away
          // slowly, it was a dark ring fifteen metres wide: the see-through dark disc on the left range, the knoll's dark leaf)
          float gq = clamp(cw/max(length(fwidth(vP)), 1e-4), 0.3, 4.);
          float under = (1. - cap)*smoothstep(-0.75 - cw, -0.5, cq/gq)*(1. - smoothstep(0.25, 0.5, cw))*uCapOn;      // the crease under the lip
          ridgeC *= 1. - 0.45*under;
          // TENTH ROUND: on the snow the tones go by the STROKE: each stroke of the knife is one flat tone (moonward cream, the
          // middle tone, the cool one), chosen by how the slope faces the moons and by the stroke's own hand, so the edges
          // between tones are the strokes' edges (long, bowed, following the slope) and never a straight crease of the form.
          // (and by the LAND'S OWN slope, taken from the height function, not from the mesh: a facet's straight edge never shows in the snow)
          float faceA = face;
          if (cap > 0.002 && vP.z < 960. && uTip < 0.5 && uCapOn > 0.5) { float e9 = 2.2, hA = ridgeH(vP.x - e9, vP.z), hB = ridgeH(vP.x + e9, vP.z), hC = ridgeH(vP.x, vP.z - e9), hD = ridgeH(vP.x, vP.z + e9);
            vec3 nA = vec3(hA - hB, 2.*e9, hC - hD); nA /= max(length(nA), 1e-3);
            faceA = mix(dot(nA, vec3(-0.62, 0.55, 0.56)) + 0.1*(vnoise(vP.xz*0.09 + 3.) - 0.5), face, smoothstep(930., 960., vP.z)); }
          float sid = mod(floor(kq + 0.5), 10.), faceS = faceA + 0.42*(hash11(sid*1.31 + 2.) - 0.5)*kvis;
          float slit = smoothstep(0.62 - aw2, 0.62 + aw2, faceS)*uMoonLit, sshd = (1. - smoothstep(0.22 - aw2, 0.22 + aw2, faceS))*uMoonLit;
          gKeep = 0.36*cap; gEye = mix(1., 0.3, cap);      // white paste laid on the dark stays cream a long way (as the moons do), lavender only far off
          // two close pale tones and the cream: the loaf's own cool (pale blue in the indigo, pale lavender in the plum), never slate
          vec3 sMid = mix(vec3(1.), uSlabT, 0.2)*0.9, sShd = mix(vec3(1.), uSlabT, 0.4)*mix(0.8, 0.86, pw);
          vec3 snowC = uCapCol*drift*mix(vec3(1.), mix(mix(sMid, sShd, sshd), vec3(0.93), slit), uMoonLit)*mix(vec3(1.), vec3(0.8, 0.86, 0.97), (1. - crest)*0.75*uFurrow*uMoonLit*fvis*(1. - kvis));
          // TENTH ROUND: NOTHING INSIDE IS BRIGHTER THAN THE MOON'S CREAM. Every lift (the stream's bank, the village's windows,
          // the room's lamp through the round window, the wave's front) multiplies the DARK paste only; the snow takes each as a
          // step toward a cream that stops short of the moon's, so it keeps its two tones and its strokes and never burns out.
          vec3 capMax = uCapCol*0.955;
          vec2 wd = (vP.xz - uWarm.xy)/max(uWarm.z, 1.); float wk = uWarm.w*exp(-dot(wd, wd)*1.6)*uMoonLit;      // the village's windows warm the ground about it
          // the lamp of the room falls in through the round window: ONE pool, a patch with an edge (a round window's light), wavering a little
          vec2 wd2 = (vP.xz - uWarm2.xy)/max(uWarm2.z, 1.); float wl2 = length(wd2) + 0.07*sin(vP.x*0.9 + vP.z*0.6) + 0.05*sin(vP.z*1.7 - vP.x*0.8), ww2 = clamp(fwidth(wl2), 1e-3, 0.2);
          float wk2 = uWarm2.w*(1. - smoothstep(0.86 - ww2, 0.9 + ww2, wl2))*uMoonLit;
          ridgeC = mix(ridgeC, ridgeC*1.4 + uCapCol*0.09, bank*uMoonLit);
          ridgeC = ridgeC*(1. + 1.2*wk) + uLamp*0.15*wk;
          ridgeC = ridgeC*(1. + 1.5*wk2) + uLamp*0.2*wk2;
          ridgeC = ridgeC*(1. + 0.7*frnt) + uCapCol*0.03*frnt;
          snowC = mix(snowC, uCapCol*vec3(1., 0.93, 0.8)*0.94, 0.45*wk);
          snowC = mix(snowC, uCapCol*vec3(1., 0.9, 0.7)*0.94, 0.62*wk2);
          snowC = mix(snowC, capMax, 0.5*frnt);
          vec3 base = mix(ridgeC, min(snowC, capMax), cap);
          // SEVENTH ROUND: PASTE A SPOON HAS BEEN DRAGGED THROUGH (the tip, uTip 1). In the hollow the spoon's own drag marks
          // follow the scoop, a shade paler and cooler; along the outside each drag ridge is a pale crest beside a cooler
          // trough; within some 25 m the paste shows its pits and tooth. Tone steps only: no shading round the form.
          float th = smoothstep(0.4, 0.6, vHol);
          float tf = (vTipQ.y*(1. + 0.35*vTipQ.x*vTipQ.x) + 0.06*sin(vTipQ.x*5. + 1.))*2.9 + 0.12*vnoise(vTipQ.xy*9.), tw = clamp(fwidth(tf), 1e-3, 1.);
          float tmark = (1. - smoothstep(0.1, 0.13 + 1.5*tw, abs(fract(tf) - 0.5)))*(1. - smoothstep(0.3, 0.7, tw))*th;
          float tsh = (1. - smoothstep(0.0, 0.3, abs(fract(tf) - 0.24)))*(1. - smoothstep(0.3, 0.7, tw))*th;            // the shallow groove beside each mark
          float tcrest = smoothstep(0.3, 0.5, vTipQ.z)*(1. - th), ttrough = smoothstep(0.22, 0.42, -vTipQ.z)*(1. - th);
          float tnear = 1. - smoothstep(14., 34., dist);
          float pit = smoothstep(0.66, 0.74, vnoise(vP.xz*2.3 + vP.y*1.9))*tnear + 0.5*(vnoise(vP.xz*7. + vP.y*5.) - 0.5)*tnear*(1. - smoothstep(6., 20., dist));
          vec3 tipTone = mix(vec3(1.), mix(vec3(1.), vec3(1.12, 1.115, 1.1), tmark)*mix(vec3(1.), vec3(0.93, 0.95, 0.985), tsh)
                           *mix(vec3(1.), vec3(1.05, 1.045, 1.03), tcrest)*mix(vec3(1.), vec3(0.7, 0.78, 0.93), ttrough)*(1. - 0.1*pit), uTip);
          gl_FragColor = vec4(inJelly(base*tipTone*max(1. + uGrain*2.*g, 0.2)*mix(vec3(1.), vec3(0.58, 0.67, 0.84), hollow)*mix(vec3(1.), vec3(0.76, 0.83, 0.94), smoothstep(0.4, 0.6, vHol))*mix(vec3(1.), vec3(0.9, 0.918, 0.955), mar), vP, n, vEye), 1.);
        }`})}function f(){return new t.ShaderMaterial({uniforms:P({uPaste:{value:n[5]},uSlabC:{value:n[3]},uKeep:{value:.94},uEyeK:{value:.13},uRound:{value:.03}}),vertexShader:`${pe}${Te}
        attribute vec3 aCtr; attribute vec3 aMoon;        // aMoon: radius, lit fraction, the angle the lit limb faces
        varying vec2 vQ; varying vec3 vC; varying vec3 vEye; varying vec3 vMoon; varying vec3 vP;
        void main(){
          vEye = eyeLocal(); vec3 c = aCtr + wobble(aCtr);
          vec3 f = vEye - c; f /= max(length(f), 1e-3);
          vec3 r = cross(vec3(0., 1., 0.), f); r /= max(length(r), 1e-3);      // the eye is never straight above a moon
          vec3 up = cross(f, r);
          vQ = position.xy; vMoon = aMoon; vC = aCtr;
          vP = c + (r*position.x + up*position.y)*aMoon.x;
          gl_Position = projectionMatrix*modelViewMatrix*vec4(vP, 1.);
        }`,fragmentShader:`${pe}
        uniform vec3 uPaste, uSlabC; uniform float uRound;
        varying vec2 vQ; varying vec3 vC; varying vec3 vEye; varying vec3 vMoon; varying vec3 vP;
        void main(){
          if (vP.z < uBoxMin.z || vP.x > uBoxMax.x) discard;
          vec2 l = vec2(-cos(vMoon.z), sin(vMoon.z));
          float u = dot(vQ, l), v = dot(vQ, vec2(-l.y, l.x)), sd = (1. - 2.*vMoon.y)*sqrt(max(1. - v*v, 0.)) - u;
          float aa = clamp(fwidth(u) + fwidth(v), 1e-4, 0.2), lit = 1. - smoothstep(-aa, aa, sd);
          vec3 e = vEye - vC; vec3 n = e/max(length(e), 1e-4);
          vec2 m = vQ*vMoon.x;                                  // metres on the face: the nozzle's streaks, a fine tooth close to
          float fine = 1. - smoothstep(0.02, 0.12, aa);
          float g = (vnoise(vec2(m.x*0.5 + 3.*vMoon.y, (m.x - m.y)*0.9)) - 0.5)*(1. - smoothstep(0.004, 0.05, aa)) + 0.5*(vnoise(m*3.1) - 0.5)*fine;
          vec3 paste = inJelly(uPaste*(1. + 0.1*g - 0.05*smoothstep(-0.25, 0., sd)), vC, n, vEye);       // a breath of shade toward the terminator
          vec3 T = transmit(eyePath(vC, vEye));
          vec3 dark = toScene(mix(uInk*1.15, uSlabC, uRound)*mix(vec3(1.), T, 0.5) + uInk*0.3*(1. - T.b));
          gl_FragColor = vec4(mix(dark, paste, lit), 1.);
        }`})}function M(c){const C=[],L=[],Q=[],I=[];c.forEach((q,E)=>{const B=E*65;C.push(0,0,0),L.push(...q.c),Q.push(q.R,q.p,q.a);for(let O=0;O<64;O++){const k=O/64*j;C.push(V(k),m(k),0),L.push(...q.c),Q.push(q.R,q.p,q.a),I.push(B,B+1+O,B+1+(O+1)%64)}});const F=new t.BufferGeometry;return F.setAttribute("position",new t.Float32BufferAttribute(C,3)),F.setAttribute("aCtr",new t.Float32BufferAttribute(L,3)),F.setAttribute("aMoon",new t.Float32BufferAttribute(Q,3)),F.setIndex(I),F.boundingSphere=new t.Sphere(new t.Vector3(0,40,580),900),F}function y(c){return new t.ShaderMaterial({uniforms:P({uAlbedo:{value:new t.Color(c??n[6])},uKeep:{value:.78},uFar:{value:1.7}}),side:t.DoubleSide,vertexShader:`${pe}${Te}
        uniform vec3 uAlbedo; uniform float uPx, uFar;
        attribute vec3 aPos; attribute vec4 aQuat; attribute vec4 aData;      // aData: size m, tone, seed, 1 = a punched star (the figures)
        varying vec3 vCol; varying vec3 vUv; varying float vClip; varying float vSeed; varying float vStar;
        vec3 qrot(vec4 q, vec3 v){ return v + 2.*cross(q.xyz, cross(q.xyz, v) + q.w*v); }
        void main(){
          vec3 eye = eyeLocal(); vec3 c = aPos;
          float dist = length(eye - c);
          float px = aData.x*uPx/max(dist, 0.5);                 // the scrap's size on screen, pixels
          float isStar = step(0.5, aData.w)*step(aData.w, 1.5), lying = step(1.5, aData.w);
          float lim = min(1., mix(0.024, 0.07, isStar)*uPx/max(px, 1e-3));      // and never a card against the lens: under a fortieth of the frame
          px *= lim;
          float grow = lim*max(1., 1.7/max(px, 1e-3));           // never thinner than about 1.5 px
          // torn outline: each rim corner at its own radius (position.z is the corner's number)
          float rr = mix(0.8 + 0.2*hash11(aData.z*91.7 + position.z*7.3), 1., isStar);
          vec3 l = vec3(position.xy*rr*aData.x*grow, 0.); l.x *= mix(mix(0.42, 1., hash11(aData.z*3.7)), 1., isStar);   // some are strips
          vec3 nrm = qrot(aQuat, vec3(0., 0., 1.));
          float faceOn = 1. - smoothstep(2., 7., px);                  // tiny scraps turn to face the eye so none is edge-on
          vec4 mv = modelViewMatrix*vec4(c + wobble(c), 1.);
          mv.xyz += mix(mat3(modelViewMatrix)*qrot(aQuat, l), l, faceOn);
          gl_Position = projectionMatrix*mv;
          if (dot(nrm, eye - c) < 0.) nrm = -nrm;
          // scraps too small to draw are not dimmed (a paving of dim specks would hide the ink): only their fair share
          // is drawn at all, each at full tone
          float cover = clamp(px/mix(uFar, 1.7, max(isStar, lying)), 0., 1.);      // (uFar: the loaf's hanging leaf gives way sooner with distance, so it never gathers into a swarm at the vanishing point)
          if (hash11(aData.z*5.31 + 0.7) > cover*cover + 0.02 || lying*step(px, 2.2) > 0.5) gl_Position = vec4(2., 2., 2., 1.);      // (leaf lying far off is not drawn at all: a field of specks read as dirt)
          // leaf lying in a furrow glints as we pass over it: each scrap catches the light for a moment, slowly, never a flash
          float gl = sin(uTime*(0.5 + 0.6*hash11(aData.z*2.9)) + aData.z*6.3 + dot(eye.xz, vec2(0.11, 0.07))); gl = max(gl, 0.); gl *= gl; gl *= gl;
          // EIGHTH ROUND: leaf is never whiter than the moon: its tone stops a shade under the paste's cream (silver stays grey silver)
          vec3 la = uAlbedo*aData.y*(1. + 0.55*lying*gl); la *= min(1., 0.62/max(dot(la, vec3(0.3, 0.55, 0.15)), 1e-3));
          vCol = inJelly(la, c, nrm, eye);
          vUv = vec3(position.xy*rr, px); vClip = min(c.z - uBoxMin.z, uBoxMax.x - c.x); vSeed = aData.z; vStar = isStar;
        }`,fragmentShader:`${pe}
        varying vec3 vCol; varying vec3 vUv; varying float vClip; varying float vSeed; varying float vStar;
        void main(){
          if (vClip < 0.) discard;
          float px = vUv.z, big = smoothstep(4., 12., px);
          // close to, the tear shows: a ragged edge and the leaf's faint beaten wrinkles
          float sd = vSeed, th = atan(vUv.y, vUv.x + 1e-5);
          float rad = 0.36 + 0.3*vnoise(vec2(th*1.1 + sd, sd)) + 0.1*vnoise(vec2(th*4.3 - sd, sd + 3.));
          float c2 = cos(2.*th), star = 0.76/pow(pow(abs(cos(th)) + 1e-3, 0.55) + pow(abs(sin(th)) + 1e-3, 0.55), 1.818);        // the figures' stars are punched from the leaf: four points
          if (length(vUv.xy) > mix(mix(1.2, rad, big), mix(0.5, star, smoothstep(3., 8., px)), step(0.5, vStar))) discard;
          float wr = (vnoise(vec2(vUv.x*9. + vUv.y*3., vUv.y*1.3) + sd) - 0.5)*0.2*big;
          // EIGHTH ROUND: a scrap is two tones: its body, and a paler edge where the torn leaf curls up (one side of it)
          float ca = sd*6.283, curl = smoothstep(0.02, 0.12, dot(vUv.xy, vec2(cos(ca), sin(ca))) - 0.1 - 0.12*vnoise(vec2(th*2.3 + sd, 2.)))*big*(1. - step(0.5, vStar));
          gl_FragColor = vec4(vCol*(1. + wr)*mix(1., mix(0.8, 1.2, curl), big*(1. - step(0.5, vStar))), 1.);
        }`})}function A(c,w,C){const L=new t.InstancedBufferGeometry,Q=[];for(let B=0;B<5;B++){const O=B/5*j;Q.push(V(O),m(O),B+1)}L.setAttribute("position",new t.Float32BufferAttribute(Q,3)),L.setIndex([0,1,2,0,2,3,0,3,4]);const I=new Float32Array(c*3),F=new Float32Array(c*4),q=new Float32Array(c*4),E={pos:[0,0,0],size:1,tone:1};for(let B=0;B<c;B++){C(B,E);const O=B*3,k=B*4;I[O]=E.pos[0],I[O+1]=E.pos[1],I[O+2]=E.pos[2];const ae=w(),Z=w()*j,ee=w()*j,re=se(1-ae),le=se(ae);F[k]=re*m(Z),F[k+1]=re*V(Z),F[k+2]=le*m(ee),F[k+3]=le*V(ee),q[k]=E.size,q[k+1]=E.tone,q[k+2]=w()*100}return L.setAttribute("aPos",new t.InstancedBufferAttribute(I,3)),L.setAttribute("aQuat",new t.InstancedBufferAttribute(F,4)),L.setAttribute("aData",new t.InstancedBufferAttribute(q,4)),L.instanceCount=c,L.boundingSphere=new t.Sphere(new t.Vector3(0,40,580),700),L}function v(c=96){const w=new t.BoxGeometry(1,1,1,4,4,c);return w.translate(.5,.5,.5),w.boundingSphere=new t.Sphere(new t.Vector3(0,40,580),900),w}const T=c=>`${l}
    void main(){ vP = mix(uBoxMin, uBoxMax, position); vN = normal; vEye = eyeLocal();
      vec3 p = vP + wobble(vP); p.y = max(p.y, uBoxMin.y + 0.08);        // clear of the board
      ${c?"p += normal*0.05*sin(vP.z*0.19 + vP.y*0.23 + vP.x*0.17 + uTime*2.3)*(1. - step(vP.y, uBoxMin.y + 0.01));":""}
      gl_Position = projectionMatrix*modelViewMatrix*vec4(p, 1.); }`;function D(){return new t.ShaderMaterial({uniforms:P({uDiscGain:{value:1.1},uFloor:x.uFloor,uFarDim:{value:.04},uBand:{value:1},uWinAt:{value:new t.Vector4(-430,97,760,2.1)},uSky:{value:0}}),side:t.BackSide,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4,vertexShader:T(!1),fragmentShader:`${p}
        uniform float uDiscGain, uFloor, uFarDim, uBand;
        // SIXTH ROUND: THE ROOM SEEN FROM WITHIN. Where a wall is looked through (the look out through the pass in the port
        // range; the fresh wall of the long cut) what lies beyond it is the room itself, found by the ray: the cypress board
        // under the lamp with its seams and the lamp's long streak, the knife lying beside the loaf (bright steel, a dark
        // handle), the paper lantern with its dark frame, the dark of the room above. Display colours; the agar between
        // tints them like everything else.
        uniform vec3 uLampPos, uSteelC, uBowl; uniform vec4 uLampK, uWin, uKnife, uWinAt; uniform float uSky;
        vec3 roomAt(vec3 ro, vec3 d){
          vec3 col = mix(uRoomLow, uRoomHi, smoothstep(-0.02, 0.5, d.y));
          vec3 lv0 = uLampPos - ro; lv0 /= max(length(lv0), 1e-3);
          float gl = max(dot(d, lv0), 0.); gl *= gl; gl *= gl; gl *= gl;
          col += uLamp*uLampK.w*0.1*gl;                                     // the lamp's glow hangs in the room's air
          float tB = 1e6;
          vec3 pB = ro + d*(ro.y/max(-d.y, 0.004));                        // (derivatives are taken outside the branch)
          float aq = clamp(max(fwidth(pB.x), fwidth(pB.z)), 0.05, 6.);
          if (d.y < -0.004) {
            tB = ro.y/(-d.y); vec3 p = ro + d*tB;
            vec3 Lv = uLampPos - p; float dl = max(length(Lv), 1e-3);
            float I = uLampK.x*uLampK.w/(1. + dl*dl/(uLampK.y*uLampK.y));
            float fx = fract((p.x + 20.)/40.)*40., seam = (1. - smoothstep(0.25 + aq, 0.6 + 2.*aq, min(fx, 40. - fx)))*min(1., 0.6/aq + 0.3);
            float grain = vnoise(vec2(p.x*0.42, p.z*0.012))*(1. - smoothstep(0.5, 2.5, aq));
            vec3 b = uBoard*(1. + 0.14*(grain - 0.5))*(1. + 0.2*(hash11(floor((p.x + 20.)/40.)*3.7 + 1.) - 0.5))*(1. - 0.42*seam)*(uLamp*I + uRoomLow*uLampK.z);      // each plank its own tone
            float sp = max(dot(reflect(d, vec3(0., 1., 0.)), Lv/dl), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
            b += uLamp*uLampK.w*0.34*sp;                                   // the lamp lies along the polished wood
            // the knife: q.x along the blade from the heel, q.y from the spine to the edge
            vec2 k = p.xz - uKnife.xy; float ca = cos(uKnife.z), sa = sin(uKnife.z);
            vec2 q = vec2(k.x*sa + k.y*ca, -k.x*ca + k.y*sa);
            float tt = max(q.x - 112., 0.)/58., w = 26.*sqrt(max(1. - tt*tt, 0.));
            float blade = smoothstep(-aq, aq, q.x)*(1. - smoothstep(170. - aq, 170. + aq, q.x))*smoothstep(-aq, aq, q.y)*(1. - smoothstep(w - aq, w + aq, q.y));
            float bandX = (q.x - 70. - 22.*sin(uTime*0.23))/34.;
            vec3 steel = uSteelC*(0.34 + 0.2*smoothstep(0.5, 0.62, q.y/max(w, 1.)) + 0.5*smoothstep(0.86, 0.94, q.y/max(w, 1.)))*(0.5 + 0.9*I)
                       + vec3(1., 0.93, 0.8)*uLampK.w*(0.75*exp(-bandX*bandX) + 0.12);
            float handle = smoothstep(-76. - aq, -76. + aq, q.x)*(1. - smoothstep(-aq, aq, q.x))*(1. - smoothstep(7. - aq, 7. + aq, abs(q.y - 9.)));
            vec3 wood = mix(vec3(0.16, 0.085, 0.05)*1.2, vec3(0.72, 0.66, 0.55), smoothstep(-9., -8., q.x))*(uLamp*I*1.5 + uRoomLow);
            b = mix(mix(b, wood, handle*uKnife.w), steel, blade*uKnife.w);
            // spilled sugar on the board: a few clear grains the size of boulders, each a pale lozenge with one bright edge
            vec2 sgc = floor(p.xz/70.), sgq = p.xz - (sgc + 0.5 + (vec2(hash21(sgc + 3.3), hash21(sgc + 9.1)) - 0.5)*0.6)*70.;
            float sga = hash21(sgc + 5.7)*3.1, sgs = 3. + 5.*hash21(sgc + 1.9); sgq = vec2(sgq.x*cos(sga) - sgq.y*sin(sga), sgq.x*sin(sga) + sgq.y*cos(sga));
            float sgd = max(abs(sgq.x), abs(sgq.y)) - sgs, sgk = step(0.55, hash21(sgc + 7.7))*(1. - smoothstep(-aq, aq, sgd))*step(34., p.x);
            b = mix(b, b*1.25 + uLamp*I*(0.1 + 0.4*smoothstep(-1.2 - aq, -0.2, sgd)), sgk);
            col = mix(b, uRoomLow*0.8, smoothstep(500., 2600., tB));
          }
          // the tea bowl, far off on the board to starboard: a dark turned shape, the lamp down its near side (the long cut's wall)
          { vec2 bo = uBowl.xy - ro.xz; float dh = max(length(d.xz), 1e-3); vec2 dn = d.xz/dh;
            float ta = dot(bo, dn), rs = bo.x*dn.y - bo.y*dn.x, tt3 = ta/dh, yb = ro.y + d.y*tt3;
            float rad = mix(92., 236., smoothstep(8., 204., yb)), sa3 = 0.5 + 0.004*max(tt3, 0.);
            float inb = (1. - smoothstep(rad - sa3, rad + sa3, abs(rs)))*smoothstep(-sa3, sa3, yb)*(1. - smoothstep(206. - sa3, 206. + sa3, yb))*step(0., ta)*step(tt3, tB)*uBowl.z;
            vec2 n2 = (-dn*sqrt(max(rad*rad - rs*rs, 0.)) + vec2(dn.y, -dn.x)*rs)/max(rad, 1.);
            vec2 lb = uLampPos.xz - uBowl.xy; lb /= max(length(lb), 1e-3);
            float lit = clamp(dot(n2, lb)*0.6 + 0.4, 0., 1.), rim3 = smoothstep(196., 204., yb);
            vec3 bowl = vec3(0.3, 0.215, 0.15)*(uLamp*1.5*lit*lit + uRoomLow*0.7) + uLamp*0.12*lit*lit*lit*lit*lit*lit + vec3(0.35, 0.23, 0.14)*uLamp*rim3*0.5;
            col = mix(col, bowl, inb); }
          // the lantern: paper lit from within, a dark wooden frame (posts, rails, one mullion on each side)
          vec3 bc = vec3(uLampPos.x, 172., uLampPos.z), bh = vec3(82., 172., 82.);
          vec3 dd = d + vec3(1e-5)*(step(0., d)*2. - 1.);
          vec3 t1 = (bc - bh - ro)/dd, t2 = (bc + bh - ro)/dd, tmn = min(t1, t2), tmx = max(t1, t2);
          float tn = max(max(tmn.x, tmn.y), tmn.z), tf = min(min(tmx.x, tmx.y), tmx.z);
          if (tn < tf && tn > 0. && tn < tB) {
            vec3 p = ro + d*tn, l = (p - bc)/bh;
            float uu = abs(l.x) > abs(l.z) ? l.z : l.x, sa2 = 0.022 + 0.00006*tn;
            float post = smoothstep(0.86 - sa2, 0.86 + sa2, abs(uu)) + (1. - smoothstep(0.03 - sa2, 0.03 + sa2, abs(uu)));
            float sy = sa2*82.;
            float rail = (1. - smoothstep(2.5 - sy, 2.5 + sy, abs(p.y - 134.))) + (1. - smoothstep(2.5 - sy, 2.5 + sy, abs(p.y - 232.))) + (1. - smoothstep(42. - sy, 42. + sy, p.y)) + smoothstep(324. - sy, 324. + sy, p.y);
            float h = (p.y - uLampPos.y)/120., fib = vnoise(vec2((p.x + p.z)*0.05, p.y*0.9));
            vec3 paper = uLamp*uLampK.w*(0.8 + 0.7*exp(-h*h))*(0.95 + 0.1*fib);
            col = mix(col, mix(paper, vec3(0.05, 0.032, 0.02), clamp(post + rail, 0., 1.)), max(smoothstep(34., 40., p.y), smoothstep(0.84, 0.88, abs(uu))));      // open between its feet
          }
          return col; }

        void main(){
          vec3 e = vP - vEye; float L = length(e); vec3 d = e/max(L, 1e-4);
          float m = eyePath(vP, vEye), px = max(fwidth(vP.x), fwidth(vP.z));
          // the look out: a reach of the port wall (over the pass in the range) is looked through; the long cut's fresh wall too
          float inL = smoothstep(0., 30., vEye.z - uBoxMin.z);
          // EIGHTH ROUND: THE LOOK OUT IS A WINDOW. One round of clear jelly in the port wall (uWin: its z, y, strength, radius),
          // a pale rim line round it; the thick jelly is a lens, so the room stands in it whole and small: the lantern, the
          // lamp-lit board, the knife (the sight line is turned toward uWinAt and its field widened by uWinAt.w)
          float wr = length(vP.zy - uWin.xy), wa = max(fwidth(wr), 1e-3), onPort = step(vN.x, -0.5)*inL*uWin.z;
          onPort *= smoothstep(0.43, 0.6, abs(d.x));          // looked along, the wall is a mirror: the window is seen as we come abreast of it
          float win = onPort*(1. - smoothstep(uWin.w - wa, uWin.w + wa, wr));
          float wrim = onPort*onPort*(1. - smoothstep(0.07 + 0.5*wa, 0.12 + 1.3*wa, abs(wr - uWin.w)));
          float cutW = step(0.5, vN.x)*step(0., uSide.x)*inL*(1. - smoothstep(790., 900., vP.z));      // eighth round: toward the far end the fresh wall is the night's own ink again
          vec3 dw = d + 0.006*vec3(sin(vP.z*0.19 + uTime*1.1 + 2.*sin(vP.y*0.13 - uTime*0.6)), sin(vP.y*0.23 - uTime*0.9 + 2.*sin(vP.z*0.11 + uTime*0.5)), 0.); dw /= max(length(dw), 1e-4);
          // SEVENTH ROUND: through the long cut's fresh wall the thick jelly bends every sight line outward and down, so the
          // lamp-lit board lies over the lower half of the wall with its seams and grain, running back to a soft horizon
          vec3 dc = mix(dw, d + (dw - d)*0.3, cutW) + vec3(0.6, -0.16, 0.)*cutW;
          // eighth round: and by its height: the wall's lower third always looks down on the lamp-lit board (its seams, its grain,
          // the lamp's streak), the rest out across the room, wherever the eye stands
          dc.y = mix(dc.y, mix(-0.55, 0.2, smoothstep(26., 96., vP.y)), 0.85*cutW); dc /= max(length(dc), 1e-4);
          if (win > 0.001) { vec3 wc = vec3(uBoxMin.x, uWin.y, uWin.x), ax = wc - vEye, tg = uWinAt.xyz - wc; ax /= max(length(ax), 1e-3); tg /= max(length(tg), 1e-3);
            dc = tg + (dw - ax)*uWinAt.w; dc /= max(length(dc), 1e-4); }
          vec3 room = (win + cutW > 0.001) ? roomAt(vP, dc) : vec3(0.);
          // THE NIGHT LASTS. Agar is about n 1.34: a side wall or the top met at more than some 48 degrees from its normal is
          // a mirror (total internal reflection, as in a glass rod), and what it shows is the length of the loaf, wherever the
          // eye stands, outside looking in through the cut face or inside. So looking down the loaf nearly every wall is ink;
          // the room shows only where a wall is seen nearly square on (the outer edge of the frame) and in the colourless
          // top 10 m of each side wall, the night's horizon glow: two pale lines running to the vanishing point.
          float c = abs(dot(d, vN)), wM = 0., wB = 0., mm = m, rrM = 1e4, yF = vP.y;
          float hF = uDawn.z*smoothstep(uDawn.x, uDawn.y, uBoxMax.z);      // the dawn layer's height at the far face
          if (d.z > 0.02 && vN.z < 0.5 && vN.z > -0.5 && vN.y > -0.5) {
            float zs = max(vEye.z, uBoxMin.z);
            vec2 q = vEye.xy + d.xy*((zs - vEye.z)/d.z);          // where the sight line enters the loaf (inside: the eye itself)
            if (q.x > uBoxMin.x && q.x < uBoxMax.x && q.y > uBoxMin.y && q.y < uBoxMax.y) {
              float inK = smoothstep(0., 30., vEye.z - uBoxMin.z);                       // from outside the wet face bends every sight line toward the axis
              wM = 1. - smoothstep(0.6, 0.8, c/mix(1.34, 1., inK));
              float fe = smoothstep(uBoxMax.z - 270., uBoxMax.z - 140., vP.z);
              if (vN.x > 0.5 && uSide.x >= 0.) wM *= mix(1., 0.3, 1. - smoothstep(790., 900., vP.z));                               // the long cut: a fresh wall, the room floods in
              wM = max(wM, fe);        // the far end stands against something: no glow beside it
              wM *= 1. - smoothstep(uBoxMax.y - 9., uBoxMax.y - 1.5, q.y);              // from outside, the top of the cut face lets the room in
              yF = vEye.y + d.y*((uBoxMax.z - vEye.z)/d.z); yF = yF > uBoxMax.y ? uBoxMax.y + 100. : max(yF, uBoxMin.y);   // off the top: the night
              mm = (uBoxMax.z - zs)/d.z*rhoSeg(q.y, min(yF, uBoxMax.y), zs, uBoxMax.z)*(1. - coreClear(vP, vEye));
              if (abs(vN.x) > 0.5) wB = smoothstep(uBoxMax.y - 7., uBoxMax.y - 1., vP.y)*uBand*(1. - fe)*smoothstep(-4., 10., vEye.z - uBoxMin.z);
              rrM = length(vEye.xy + d.xy*((uBoxMax.z - vEye.z)/d.z) - uCore.xy);       // where the mirrored line meets the far end, unfolded
            }
          }
          vec3 behind = domeAt(d), farDark = uInk*1.5 + uDayLow*uFarDim;
          // OPEN SKY: from within, the room beyond the walls is dark, so the sides fall to indigo-black and only the leaf shows
          behind = mix(behind, uInk*0.5, 0.95*smoothstep(0., 30., vEye.z - uBoxMin.z));
          behind = mix(behind, room, max(win, cutW)); wM *= 1. - max(win, 0.6*cutW);
          m = mix(m, min(m, 20.), win);                          // the pane we look out through is thin: the lantern stays warm
          // the skin shivers, so the glow of the walls swims a little
          behind *= 1. + 0.035*sin(vP.z*0.11 + vP.y*0.2 + uTime*1.7 + 2.*sin(vP.y*0.07 - uTime*0.6));
          float gain = 0.;
          if (vN.y < -0.5 && uFloor > 0.5) {                     // the floor: the board, lit only through the jelly
            float grain = vnoise(vec2(vP.x*0.9, vP.z*0.03))*(1. - smoothstep(0.1, 0.5, px));
            behind = uRoomBoard*0.7*(0.94 + 0.08*grain)*transmit(lightPath(vP + vec3(0., 0.5, 0.), vec3(0., 1., 0.))*0.5);
          } else if (vN.y > 0.5) {                               // a few bubbles trapped under the top
            vec2 g = vP.xz/7., id = floor(g); vec2 c = (vec2(hash21(id), hash21(id + 7.3)) - 0.5)*0.6;
            float r = length(fract(g) - 0.5 - c)*7., R = 0.25 + 0.7*hash21(id + 3.1);
            float has = step(0.62, hash21(id + 11.7))*(1. - smoothstep(0.08, 0.3, px));
            behind *= 1. + has*(0.35*(1. - smoothstep(0., 0.22, abs(r - R))) - 0.12*(1. - smoothstep(R - 0.1, R, r)));
          } else if (vN.z > 0.5) {                               // the far face: the full moon is a disc of plain daylight
            float rr = length(vP.xy - uCore.xy);
            float disc = 1. - smoothstep(uCore.z - 0.2, uCore.z + 0.05, rr);
            // the far end stands against something dark; the disc's daylight spills a little way into the jelly round it
            behind = mix(uDayLow, farDark + uDayLow*0.22*exp(-max(rr - uCore.z, 0.)/14.) + uDayLow*uSky*(0.2*exp(-max(rr - 26., 0.)/7.) + 0.1*(1. - smoothstep(0.3, 0.6 + 2.*px, abs(rr - 33.)))), smoothstep(hF - 5.5, hF - 2.5, vP.y + 100.*step(hF, 1.))); gain = disc;      // eighth round: a soft halo round the full moon, and one thin ring      // sixth round: the dawn is a band with a decided upper edge
          }
          float wsh = washAt(vP.z);
          vec3 T = transmit(m*(1. - 0.32*wsh));
          vec3 disp = behind*T + uInk*(1. - T.b);
          // 10h (N1): THE LOAF'S END IS A BLOCK OF JELLY, NOT A PANE. Looked into aslant through the cut face, the far side wall
          // near the end was seen across a thin wedge of the loaf with the room standing in it under a flat tint: a see-through
          // sheet over that side of the view. But a side wall met from within is a mirror (the rule above: agar's total internal
          // reflection), and near the fresh face what it mirrors is jelly that holds the lamp's light, as a slice does: the
          // loaf's own body across to the other wall. So there the wall is the colour of the tinted metres to it and the loaf's
          // whole width beyond (paler in the colourless top): a deep blue band, deepening to ink with the way to it. The light
          // comes in by the fresh face: the first slab's length of the loaf holds it and it is gone a slab further in (measures
          // of the place, the same from anywhere).
          if (abs(vN.x) > 0.5) { vec3 Tw = transmit((m + (uBoxMax.x - uBoxMin.x)*rhoAt(vP.y)*uEyeK)*(1. - 0.32*wsh));
            disp = mix(disp, uDay*Tw + uInk*(1. - Tw.b), 0.95*(1. - smoothstep(${a.slab.toFixed(1)}, ${(2*a.slab).toFixed(1)}, vP.z - uBoxMin.z))*(1. - max(win, cutW))); }
          disp += win*0.12*uDay*transmit(36.);                    // the pane has a body: the pale blue of a slice laid over the room
          if (gain > 0.) {                                       // the clear core is a light pipe: its daylight comes down the shaft
            vec3 Td = transmit(min(m, 5. + 0.035*m));
            disp = mix(disp + uInk*1.4*wsh, uDay*Td + uInk*(1. - Td.b), gain);
          } else if (vN.z > 0.5) disp += uInk*1.4*wsh;
          if (wM > 0.) {                                         // the mirror: the far end of the loaf through the whole length of it
            vec3 Tm = transmit(mm*(1. - 0.32*wsh));
            float bn = max(abs(d.x)/max(d.z, 1e-3)*(uBoxMax.z - max(vEye.z, uBoxMin.z)) - (d.x > 0. ? uBoxMax.x - vEye.x : vEye.x - uBoxMin.x), 0.)/120.;   // bounces off the side walls on the way
            vec3 farEnd = mix(uDayLow*exp(-0.55*bn), farDark + uDayLow*0.22*exp(-max(rrM - uCore.z, 0.)/14.), smoothstep(hF - 5.5, hF - 2.5, yF + 100.*step(hF, 1.)));
            disp = mix(disp, farEnd*Tm + uInk*(1. - Tm.b) + uInk*1.4*wsh, wM);      // the pale wash lifts the ink as it passes
          }
          if (wB > 0.) { vec3 Tb = transmit(13. + 0.075*L); disp = mix(disp, uDay*Tb + uInk*(1. - Tb.b), wB); }
          float aa2 = max(max(fwidth(vP.z), fwidth(vP.y)), 1e-3);
          float wm1 = onPort*(1. - smoothstep(-wa, wa, abs(wr - (uWin.w - 0.6)) - 0.6)), wm2 = onPort*(1. - smoothstep(-wa, wa, abs(wr - (uWin.w - 1.9)) - 0.7));
          disp = mix(disp, disp*0.5 + uInk*1.1 + uDay*vec3(0.09, 0.16, 0.34), 0.8*wm2);      // ninth round: no grey band: the thick clear jelly's meniscus, paler inside,
          disp = mix(disp, uInk*2.4 + uDay*vec3(0.035, 0.07, 0.19), 0.85*wm1);                // deeper at the edge,
          disp = mix(disp, uDay*0.8 + uInk, 0.9*wrim);                                        // and one thin pale wet line
          // EIGHTH ROUND: THE SKY IS RICH. Far off in the depth of the jelly, by direction only (so it lies behind every subject and
          // never against the lens): a milky band of sugar dust slanting across the night, two star clouds, long flat strata
          // of agar low over the ranges with a paler upper edge, a comet of leaf with its tail. Flat pale tones; specks never
          // under a pixel and a half.
          float skyK = uSky*inL*(1. - max(win, cutW))*step(-0.5, vN.y)*smoothstep(0.035, 0.16, d.y), ad = max(length(fwidth(d)), 1e-4);
          if (skyK > 0.001) {
            float az = atan(d.x, abs(d.z) + 1e-4), el = d.y;
            float bb = dot(d, vec3(0.52, 0.6, -0.61)) - 0.12 + 0.05*vnoise(vec2(az*3., el*3.));
            float band = exp(-bb*bb/0.012)*(0.45 + 0.9*vnoise(vec2(az*7. + 3., el*9.)))*(1. - 0.6*smoothstep(0.5, 0.7, vnoise(vec2(az*4. + 9., el*14.))));
            vec3 c1 = vec3(-0.5, 0.52, 0.69), c2 = vec3(0.62, 0.42, 0.66);
            float cl = exp(-dot(d - c1, d - c1)/0.02) + 0.8*exp(-dot(d - c2, d - c2)/0.012);
            vec2 sg = vec2(az, el)*46., sid = floor(sg); vec2 sq = fract(sg) - 0.5 - (vec2(hash21(sid + 1.3), hash21(sid + 7.9)) - 0.5)*0.7;
            float sh = hash21(sid + 3.3), sr = max(0.03 + 0.08*sh*sh, 0.8*ad*46.);
            float star = step(1. - 0.055 - 0.5*clamp(band + cl, 0., 1.), hash21(sid + 5.5))*(1. - smoothstep(sr*0.6, sr*1.2, length(sq)))*min(1., (0.03 + 0.08*sh*sh)/sr + 0.35);
            // four long flat clouds of agar low over the ranges, each a lens with a ragged belly and a paler moonlit top
            float strata = 0., sedge = 0., sw = clamp(ad/0.02, 0.03, 0.6);
            for (int i = 0; i < 4; i++) { float fi = float(i);
              vec2 sc = vec2(-1.25 + 0.8*fi + 0.22*sin(fi*2.7 + 1.) + 0.004*uTime, 0.215 + 0.04*sin(fi*1.9 + 1.));
              vec2 s2 = (vec2(az, el) - sc)/vec2(0.15 + 0.05*sin(fi*3.1), 0.026 + 0.007*cos(fi*2.3));
              s2.y *= s2.y < 0. ? 2.4 : 1.;                                             // a flat belly
              float sdl = dot(s2, s2) - 0.28*(0.5 + 0.5*sin(s2.x*7. + fi*2.))*step(0., s2.y)*(1. - s2.x*s2.x), inC = 1. - smoothstep(1. - sw, 1. + sw, sdl);      // a heaped top
              strata = max(strata, inC); sedge = max(sedge, inC*smoothstep(0.1, 0.1 + sw, s2.y - 0.15*sin(s2.x*5. + fi))); }
            vec3 cd = vec3(0.6 - 0.02*sin(uTime*0.05), 0.58, 0.55); cd /= length(cd); vec3 ct = vec3(0.5, 0.42, -0.2); ct /= length(ct);      // the comet: its head, and the way its tail streams
            vec3 cv = d - cd; float ca = dot(cv, ct), cp = length(cv - ct*ca);
            float comet = smoothstep(0., 0.02, ca)*(1. - smoothstep(0.05, 0.3, ca))*(1. - smoothstep(0.3, 1., cp/(0.006 + 0.07*max(ca, 0.) + ad))) + (1. - smoothstep(0.012, 0.016 + ad, length(cv)));
            float dust = 0.55*smoothstep(0.4, 0.46, band) + 0.45*smoothstep(0.8, 0.87, band);      // (tenth round: the two star clouds are crowds of stars only: their flat dust lay over the ranges as two faint discs)      // sugar dust: flat pale tones, an edge where it thins
            vec3 sky = uDay*transmit(62.)*0.11*min(dust, 1.2) + mix(uDay, uDayLow, 0.5)*0.55*star + uDay*(0.3*transmit(75.)*strata*(1. - sedge) + 0.42*transmit(48.)*sedge) + vec3(0.96, 0.93, 0.84)*0.5*comet;
            disp += sky*skyK*(1. - 0.6*wM*step(d.y, 0.1));
          }
          if (cutW > 0.001) {
            // THE FRESH WET FACE OF THE LONG CUT, seen from within: the lamp's reflection swims on it, beads stand on it and one
            // drop runs down, and the ridge's cut edge is a clean pale line along its foot
            vec3 lw = uLampPos - vP; lw /= max(length(lw), 1e-3);
            vec3 nw = vec3(1., 0.035*sin(vP.z*0.17 + uTime*1.3 + 2.*sin(vP.y*0.13 + uTime*0.7)), 0.035*sin(vP.y*0.21 - uTime*1.1 + 2.*sin(vP.z*0.09 - uTime*0.5))); nw /= length(nw);
            float rs = max(dot(reflect(d, nw), lw), 0.); float r4 = rs*rs; r4 *= r4; float r16 = r4*r4; r16 *= r16;
            vec3 wet = uLamp*uLampK.w*(0.012*r4 + 0.5*r16*r16);      // (eighth round: no broad khaki haze; the lamp is its streak and one small bright image)
            // the lamp lies on the wet face as one long pale streak, standing the height of the wall and broken by its ripple
            float zs = vEye.z + 44. + 5.*sin(vP.y*0.21 + uTime*0.8 + 2.*sin(vP.y*0.07 - uTime*0.45)) + 2.*sin(vP.y*0.9 - uTime*1.3);      // (it goes with the eye, as a reflection does)
            float sq = (vP.z - zs)/(3.2 + 0.05*(vP.y - uBoxMin.y)), st = exp(-sq*sq);
            wet += uLamp*uLampK.w*st*(0.3 + 0.12*sin(vP.y*0.8 + uTime*1.1))*smoothstep(0., 10., vP.y - ridgeH(uBoxMax.x - 0.3, vP.z))*(1. - smoothstep(uBoxMax.y - 14., uBoxMax.y - 2., vP.y));
            vec2 bg = vP.zy/5.6, bid = floor(bg); vec2 bq = (fract(bg) - 0.5 - (vec2(hash21(bid + 2.2), hash21(bid + 8.8)) - 0.5)*0.7)*5.6;
            float br = 0.3 + 0.5*hash21(bid + 4.4);
            float bead = step(0.7, hash21(bid + 6.6))*(1. - smoothstep(br - aa2, br + aa2, length(bq*vec2(1., 0.85))))*(1. - smoothstep(0.3, 1.1, aa2));
            float dz0 = vEye.z + 20. + 22.*hash11(floor(uTime/11.)), dy = uBoxMax.y - 4. - mod(uTime, 11.)*6.5;
            float trail = (1. - smoothstep(0.1 + aa2, 0.2 + 2.*aa2, abs(vP.z - dz0 - 0.2*sin(vP.y*0.9))))*step(dy, vP.y)*step(vP.y, uBoxMax.y - 4.);
            float drop = 1. - smoothstep(0.45, 0.6 + aa2, length((vP.zy - vec2(dz0 + 0.2*sin(dy*0.9), dy))*vec2(1., 0.7)));
            float foot = 1. - smoothstep(0.25 + aa2, 0.5 + 2.*aa2, abs(vP.y - ridgeH(uBoxMax.x - 0.3, vP.z) - 0.45));
            float skinTop = 1. - smoothstep(0.2 + aa2, 0.45 + 2.*aa2, uBoxMax.y - vP.y);
            disp += wet*(1. + 0.5*bead)*cutW;
            disp = mix(disp, vec3(0.82, 0.88, 0.95)*mix(T, vec3(1.), 0.4), cutW*clamp(0.55*bead + 0.3*trail + 0.7*drop + 0.8*max(foot, skinTop), 0., 1.)*smoothstep(0.03, 0.25, T.g));
          }
          vec3 col = toScene(disp);
          gl_FragColor = vec4(col*(1. + gain*(uDiscGain - 1.)*exp(-m*0.02)), 1.);
        }`})}function R(c={}){return new t.ShaderMaterial({uniforms:P({...c.moonOv?{uMoonOv:{value:c.moonOv}}:{},uPaste:{value:n[5]},uDark:{value:n[4]},uGold:{value:n[6]},uSheen:{value:s.sheen??.05},uHaze:{value:s.haze??0},uRoundF:{value:c.round??.13},uFilm:{value:c.film??0},uSlab:{value:c.slab??0},uSlabC:{value:n[3]}}),side:t.FrontSide,transparent:!0,depthWrite:!1,vertexShader:T(!0),fragmentShader:`${p}
        uniform vec3 uPaste, uDark, uGold, uSlabC; uniform float uSheen, uHaze, uRoundF, uFilm, uSlab;
        void main(){
          vec3 e = vP - vEye; float L = length(e); vec3 d = e/max(L, 1e-4);
          vec3 n = vN; float film = 0., rimL = 0.;
          vec2 uv = abs(n.x) > 0.5 ? vP.zy : (abs(n.y) > 0.5 ? vP.xz : vP.xy);
          float aa = max(max(fwidth(uv.x), fwidth(uv.y)), 1e-4);          // metres per pixel on this face
          vec3 aq = max(fwidth(vP), vec3(1e-4));                           // (10h) and along each of the block's own axes: a wet line is measured across itself
          float t = uTime;
          vec2 rip = vec2(sin(uv.x*0.21 + t*1.3 + 2.*sin(uv.y*0.13 + t*0.7)), sin(uv.y*0.17 - t*1.1 + 2.*sin(uv.x*0.11 - t*0.5)));
          float sway = waveAt(vP.z)*0.03;
          vec3 n2 = n + (vec3(rip.x, rip.y, rip.y - rip.x)*0.03 + sway)*(1. - abs(n)); n2 /= max(length(n2), 1e-4);
          float c = clamp(dot(-d, n2), 0., 1.), f1 = 1. - c;
          float F = 0.004 + 0.996*f1*f1*f1*f1*f1;          // square on, a wet face is clear
          vec3 refl = domeAt(reflect(d, n2));
          if (abs(n.z) < 0.5) { F *= 0.55; refl = mix(refl, uRoomLow*1.5, 0.75); }      // the long skin shivers: a soft pale sheen over the ink, never a clean mirror
          float aS = 0., aD = 0.; vec3 sec = vec3(0.);
          if (n.z < -0.5 || (n.z > 0.5 && uFarFace > 0.5)) {     // a cut face
            vec2 xy = vP.xy; float z = n.z < 0. ? uBoxMin.z + 0.02 : uBoxMax.z - 0.02, w = 0.6*aa;
            float gold = 0.;                                     // leaf specks: torn scraps cut through are short gold dashes
            vec2 gc = xy/4.6, id = floor(gc); float hs = hash21(id + floor(z)*0.37);
            vec2 q = (fract(gc) - 0.5)*4.6 - (vec2(hash21(id + 1.7), hash21(id + 5.1)) - 0.5)*2.6;
            float an = hs*40., len = 0.25 + 1.1*hash21(id + 9.2);
            vec2 dr = vec2(cos(an), sin(an)); float al = clamp(dot(q, dr), -len, len);
            float gw = max(0.05, 0.8*aa);                          // a dash is leaf seen edge on: never under 1.5 px, paler when widened
            gold = step(0.72, hs)*uHas.w*(1. - smoothstep(gw*0.6, gw*1.4, length(q - dr*al)))*min(1., 0.07/gw + 0.25)*(1. - smoothstep(0.35, 0.9, aa));
            float dG = gooseSd(xy, z), dM = luneSd(xy, z), dR = xy.y - ridgeH(xy.x, z);
            float aR = uHas.x*(1. - smoothstep(-w, w, dR)), aM = uHas.y*(1. - smoothstep(-w, w, dM - w));
            float aG = uHas.z*(1. - smoothstep(-w, w, dG - clamp(0.8*aa - 0.3, 0., 1.3)))*step(z, 830.);      // tenth round: a rod's cut end is never under a pixel and a half thick: nine chevrons are read on every face
            // faint drag lines the blade left, running the way it travelled
            float drag = (vnoise(vec2(xy.x*2.3, xy.y*0.045)) - 0.5)*(1. - smoothstep(0.1, 0.45, aa));
            float wP = max(aM, aG)*(1. - aR), wG = gold*(1. - aR)*(1. - max(aM, aG));      // each stuff by its own coverage: an edge is where one stuff stops
            // the rest of the moon's disc: a round of clearer jelly, faintly paler than what is round it, with a crisp edge
            aD = uHas.y*uRoundF*(1. - smoothstep(-w, w, length(xy - barC(z)) - barR(z)))*(1. - aR)*(1. - max(aM, aG))*(1. - wG);
            aS = clamp(aR + wP + wG, 0., 1.);
            vec3 alb = (mix(uDark, uPaste, smoothstep(-w, w, capLine(vec3(xy, z), max(-dR, 0.))))*aR + uPaste*wP + uGold*wG)/max(aR + wP + wG, 1e-4);
            sec = inJelly(alb*(1. + 0.07*drag), vec3(xy, z - 0.05*n.z), vec3(0., 0., n.z), vEye);
            F *= 1. + 0.2*drag;
            F += uHaze;
            // close to, the upper part of what we see of a wet face carries the dome as a pale cool sheen (keyed to how high the
            // mirrored sight line climbs: strongest at the top of the view, half strength a third of the way down, its lower
            // boundary wavering with the skin's ripple); it slides up and off as we enter
            float fd = abs(vEye.z - z), e0 = mix(0.8, -0.06, smoothstep(5., 20., fd));
            float sh = uSheen*smoothstep(e0, e0 + 0.5, (uRot*reflect(d, n2)).y + 0.05*rip.x + 0.03*rip.y)*(1. - smoothstep(30., 58., fd));
            F += sh; refl = mix(refl, uLamp*0.8, clamp(sh*1.6, 0., 1.));
            // beads of water, and one drop running down
            vec2 bg = xy/2.6, bid = floor(bg); vec2 bq = (fract(bg) - 0.5 - (vec2(hash21(bid + 2.2), hash21(bid + 8.8)) - 0.5)*0.7)*2.6;
            float br = 0.1 + 0.2*hash21(bid + 4.4), fine = 1. - smoothstep(0.06, 0.22, aa);
            float bead = step(0.7, hash21(bid + 6.6))*(1. - smoothstep(br - aa, br + aa, length(bq)))*fine;
            float dx = uBoxMin.x + (uBoxMax.x - uBoxMin.x)*(0.22 + 0.56*hash11(floor(t/11.) + z));
            float dy = uBoxMax.y - 4. - mod(t, 11.)*7.5;
            float trail = (1. - smoothstep(0.05 + aa, 0.09 + 2.*aa, abs(xy.x - dx - 0.12*sin(xy.y*0.9))))*step(dy, xy.y)*step(xy.y, uBoxMax.y - 4.)
                        *(1. - smoothstep(0.1, 0.5, aa));
            // 10h (N1c): the track a running drop leaves on a wet face draws up into a few beads; it is never one line the height
            // of the face (which stood in the view as a seam between two panes)
            trail *= step(0.6, hash11(floor(xy.y/2.6) + 3.7))*(1. - smoothstep(0.2, 0.34 + aa, abs(fract(xy.y/2.6) - 0.5)*2.6));
            float drop = 1. - smoothstep(0.22, 0.28 + aa, length((xy - vec2(dx + 0.12*sin(dy*0.9), dy))*vec2(1., 0.7)));
            F = clamp(F + 0.85*bead + 0.22*trail + 0.6*drop*(1. - smoothstep(0.1, 0.5, aa)), 0., 1.);
            // SIXTH ROUND: the loaf's own cut face is a sheet: a breath of the slab's pale blue over all of it, and one pale
            // rim line where the face meets the top and the sides (the edge of the sheet catching the lamp)
            // (10h: each edge's line is measured across itself, so a face seen aslant never carries a broad pale cap)
            vec2 ed = vec2(min(xy.x - uBoxMin.x, uBoxMax.x - xy.x), uBoxMax.y - xy.y);
            rimL = max(1. - smoothstep(0.3 + aq.x, 0.55 + 2.*aq.x, ed.x), 1. - smoothstep(0.3 + aq.y, 0.55 + 2.*aq.y, ed.y))*step(n.z, -0.5);
            film = uFilm*step(n.z, -0.5)*(mix(0.035, 0.09, smoothstep(30., 90., fd)) + 0.75*rimL)*(1. - aS*0.6);      // seventh round: close to, the sheet is clear and the night behind it sharp
          }
          vec3 r = toScene(refl);
          float a = aS + F - aS*F;
          vec4 o = vec4((sec*aS*(1. - F) + r*F)/max(a, 1e-4), a);
          float ad = aD*(1. - a); vec3 rd = toScene(uDay*0.92);                 // the round lies under the wet sheen, over the night
          vec4 o2 = vec4((o.rgb*o.a + rd*ad)/max(o.a + ad, 1e-4), o.a + ad);
          vec3 fc = toScene(mix(uSlabC*0.8, uDay*0.95, rimL)); float a2 = o2.a + film - o2.a*film;
          vec4 o3 = vec4((o2.rgb*o2.a*(1. - film) + fc*film)/max(a2, 1e-4), a2);
          // NINTH ROUND: A SLICE IS A SLAB OF WET JELLY (uSlab 1). Its faces are distinct tones: the cut face clear, the end face
          // deeper; every edge of the block carries one pale wet line (never under a pixel and a half), and the lamp sits as
          // one small glint on the top corner nearest the eye.
          if (uSlab > 0.5) {
            vec3 sz = uBoxMax - uBoxMin, q = vP - uBoxMin; float bodyA = 0.; vec3 bodyC = uSlabC; vec2 ed, ea, ex;
            // 10h (N1): A SLICE'S END IS A DEEP BLUE BAND. Looked into at its end a slice is not 20 m of jelly but its whole length
            // (agar is a light pipe: a sight line that enters the end stays in the slab), so the end face is the colour of that
            // thickness, uDay through the slab's own length, paler in the colourless top as the loaf is; where the ridge is cut
            // by the end the dark paste stands in it. (It was a flat slate at two thirds, which over the pale far face read as
            // the edge of a pane.)
            if (abs(n.x) > 0.5) { ed = vec2(sz.y - q.y, min(q.z, sz.z - q.z)); ea = aq.yz; ex = sz.yz;
              vec3 Tn = transmit(sz.x*rhoAt(vP.y)*uEyeK);
              bodyC = uDay*Tn + uInk*(1. - Tn.b); bodyA = 0.95*(1. - uHas.x*(1. - smoothstep(-0.6*aq.y, 0.6*aq.y, vP.y - ridgeH(vP.x, vP.z)))); }
            else if (abs(n.y) > 0.5) { ed = vec2(min(q.x, sz.x - q.x), min(q.z, sz.z - q.z)); ea = aq.xz; ex = sz.xz; bodyC = uSlabC*0.85 + uDay*0.3; bodyA = 0.6; }
            else { ed = vec2(min(q.x, sz.x - q.x), sz.y - q.y); ea = aq.xy; ex = sz.xy; }
            // (10h: each wet line is measured across itself and never takes more than an eighth of its face, so a face seen
            // aslant keeps its own tone between its two lines: a band, never one white line)
            ea = min(ea, 0.066*ex);
            vec2 r2 = 1. - smoothstep(0.1 + 0.6*ea, 0.18 + 1.6*ea, ed); float rl = max(r2.x, r2.y);
            vec3 slabC = mix(bodyC, uDay*0.92 + uLamp*0.2, rl); float slabA = max(bodyA, 0.92*rl);
            vec3 mid = 0.5*(uBoxMin + uBoxMax), cn = vec3(vEye.x > mid.x ? uBoxMax.x : uBoxMin.x, uBoxMax.y, vEye.z > mid.z ? uBoxMax.z : uBoxMin.z);
            float gw = max(1.5, 3.6*aa), gl = (1. - smoothstep(0.4*gw, gw, length((vP - cn - vec3(sign(mid.x - cn.x)*2.4, -1.2, 0.))*vec3(0.6, 1., 1.))))*(1. - smoothstep(230., 380., length(vEye - cn)));
            slabC = mix(slabC, uLamp*2.4 + uDay*0.4, gl); slabA = max(slabA, gl);
            float a3 = o3.a + slabA - o3.a*slabA;
            o3 = vec4((o3.rgb*o3.a*(1. - slabA) + toScene(slabC)*slabA)/max(a3, 1e-4), a3);
          }
          // 10h (N1): THE LOAF'S END IS A BLOCK TOO. From outside, its side walls for the first slab's length behind the fresh
          // face are what a slice's end is: the colour of the loaf's whole width behind them (paler in the colourless top, the
          // dark paste standing in it where the ridge meets the wall), dying away over the next slab's length, where the lamp's
          // light that came in by the face is gone and the long skin is its sheen over the ink again.
          else if (abs(n.x) > 0.5) {
            vec3 Tn = transmit((uBoxMax.x - uBoxMin.x)*rhoAt(vP.y)*uEyeK*(1. - 0.32*washAt(vP.z)));
            float bandA = 0.95*(1. - smoothstep(${a.slab.toFixed(1)}, ${(2*a.slab).toFixed(1)}, vP.z - uBoxMin.z))*(1. - uHas.x*(1. - smoothstep(-0.6*aq.y, 0.6*aq.y, vP.y - ridgeH(vP.x, vP.z))));
            float a3 = o3.a + bandA - o3.a*bandA;
            o3 = vec4((o3.rgb*o3.a*(1. - bandA) + toScene(uDay*Tn + uInk*(1. - Tn.b))*bandA)/max(a3, 1e-4), a3);
          }
          gl_FragColor = o3;
        }`})}function g(){return new t.ShaderMaterial({uniforms:P({uStrength:{value:.8},uInGain:{value:1},uTube:{value:1}}),side:t.DoubleSide,transparent:!0,depthWrite:!1,blending:t.CustomBlending,blendEquation:t.AddEquation,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,blendSrcAlpha:t.OneFactor,blendDstAlpha:t.OneMinusSrcAlphaFactor,vertexShader:`${l}
        void main(){ vP = position; vN = normal; vEye = eyeLocal();
          gl_Position = projectionMatrix*modelViewMatrix*vec4(position + wobble(position), 1.); }`,fragmentShader:`${p}
        uniform float uStrength, uInGain, uTube;
        void main(){
          if (vP.z < uBoxMin.z) discard;
          vec3 e = vEye - vP; float L = length(e); vec3 d = e/max(L, 1e-4);
          vec3 n = vN/max(length(vN), 1e-4);
          float c = abs(dot(n, d));
          bool inside = length(vEye.xy - uCore.xy) < uCore.z && vEye.z > uCore.w;
          if (inside == gl_FrontFacing) discard;                  // outside: the near wall only; inside: the wall round us
          float along = smoothstep(uCore.w - 4., uBoxMax.z, vP.z), f1 = 1. - c;
          vec2 dr = vP.xy - uCore.xy; dr /= max(length(dr), 1e-4);      // round the shaft without the seam of atan()
          float sn = vnoise(vec2(dr.x*1.6 + 0.3*sin(uTime*0.5 + vP.z*0.05), dr.y*1.6 + vP.z*0.06 - uTime*0.35));
          float streak = 0.45 + 1.3*sn*sn;   // the wall of the shaft is not quite even, and swims
          // inside: the pipe's wall round us carries fine lengthways caustics of the daylight coming down it, slowly turning;
          // never a veil
          if (inside) {
            float cn = vnoise(vec2(dr.x*4. + dr.y*2.3 + uTime*0.16, dr.y*4. - dr.x*1.7 + vP.z*0.012 - uTime*0.1));
            gl_FragColor = vec4(toScene(uDay)*((0.012*streak + 0.*cn)*f1*f1*uInGain*uStrength), 0.); return; }      // no caustic lobes: perspective turned them into rays round the disc
          // outside: the pipe. Its light swims slowly down it (long soft bands, never a flicker)
          float sw = vnoise(vec2(vP.z*0.035 - uTime*0.55, dr.x*1.3 + dr.y*0.7 + 0.2*sin(uTime*0.4)));
          float m = eyePath(vP, vEye);
          // bluer than the paste it springs from (the bar's tip stays a tip), paler toward the disc
          vec3 T = transmit(min(m, mix(27., 12., along) + 0.1*m)*(1. - 0.32*washAt(vP.z)));
          vec3 disp = (uDay*T + uInk*(1. - T.b))*(0.84 + 0.32*sw);
          // A ROD OF CLEAR JELLY, NOT A BEAM: looked along it is the pale pipe; seen from the side it is clear, and only its
          // two edges (where the sight line grazes the wall) stay pale, crisp along its whole length, so what lies beyond
          // shows through its middle. Nothing about it fades with distance, so it has no end that dissolves.
          vec2 dxy = d.xy/max(length(d.xy), 1e-3);
          float rim = 1. - smoothstep(0.0, 0.42, abs(dot(dr, dxy)));
          // (10h, N2: THE THREAD IS A THIN CLEAR LINE from the tip on. Over its first 60 m by the tip the rod was a pale body
          // with two broad soft rims (byTip 1 at the tip, 0 from 62 m on), which from the valley lengthened the tip into one
          // long white shape. Now it is as clear there as along the rest of its length, and springs from the tip by its two
          // crisp edge lines alone: only this line, which reads a place, is changed.)
          float byTip = 0.;
          float a = (mix(0.015, 0.8, smoothstep(70., 260., L))*mix(0.18, 1., byTip) + 0.55*rim*rim*(1. - smoothstep(80., 220., L))*byTip)*mix(0.3, 1., smoothstep(uCore.z + 1., uCore.z*4., length(vEye.xy - uCore.xy)));
          // SEVENTH ROUND: the rod's two edges are crisp pale lines (where the sight line grazes its wall), about two pixels
          // wide at any distance, and they hold from the torn end of the tip all the way down to the full moon
          float cw = clamp(fwidth(c)*2., 0.004, 0.25), edge = (1. - smoothstep(cw, 2.2*cw, c))*0.8;
          a = max(a, edge);
          a = min(a, 0.92)*smoothstep(uCore.w - 5., uCore.w + 2., vP.z)*uTube;
          a *= (1. - smoothstep(110., 190., uCore.w - vEye.z))*(1. - smoothstep(uCore.w - 30., uCore.w - 8., vEye.z));      // too far off it is a line from nowhere; past the tip its source is behind us
          disp = mix(disp, uDay*mix(T, vec3(1.), 0.35) + uInk*(1. - T.b)*0.5, edge);
          // where the sight line goes on through the pipe to the exit disc, the disc itself shows: the pale end of the tube
          float tz = (uBoxMax.z - vEye.z)/max(vP.z - vEye.z, 1e-3);
          vec2 hit = vEye.xy + (vP.xy - vEye.xy)*max(tz, 0.);
          a *= vP.z > vEye.z ? smoothstep(uCore.z - 0.6, uCore.z + 0.1, length(hit - uCore.xy)) : 1.;
          gl_FragColor = vec4(toScene(disp)*a, a);
        }`})}function b(c,w){for(let C=0;C<5;C++)x.uCutAge.value[C]=c[C]??-1;w!==void 0&&(x.uBoxMin.value.z=w)}return{uniforms:x,shape:i,palette:n,pasteMaterial:e,moonMaterial:f,moonGeometry:M,leafMaterial:y,leafGeometry:A,boxGeometry:v,hullMaterial:D,skinMaterial:R,coreMaterial:g,setCuts:b}}function it(s,n,i,z=300,d={}){const P=d.tip?10:0,p=d.tip?22:0,l=z-p,e=new Float32Array((z+1)*48*3),f=new Uint16Array(z*48*6),M=[0,0];for(let v=0;v<=z;v++){let T,D=1;if(v<=l)T=ie(n,i-P,v/l);else{const L=(v-l)/p;T=i-P+P*m(L*X*.5),D=se(U(1-me(m(L*X*.5),2),0))}s.barC(T,M);const R=s.barR(T),g=s.barA(T),b=1-2*s.barP(T),c=V(g),w=m(g),C=.5*(1+b);for(let L=0;L<48;L++){const Q=L<24,I=Q?-X/2+X*L/(48/2):X/2-X*(L-48/2)/(48/2);let F=(Q?1:b)*V(I),q=m(I);if(D<1){const B=1+.1*m(L*1.9+v*.9)*(1-D)+.06*m(L*.7-v*1.3)*(1-D);F=C+(F-C)*D*B,q=q*D*B}const E=(v*48+L)*3;e[E]=M[0]+R*(F*c-q*w),e[E+1]=M[1]+R*(F*w+q*c),e[E+2]=T}}for(let v=0;v<z;v++)for(let T=0;T<48;T++){const D=v*48+T,R=v*48+(T+1)%48,g=D+48,b=R+48,c=(v*48+T)*6;f[c]=D,f[c+1]=R,f[c+2]=g,f[c+3]=R,f[c+4]=b,f[c+5]=g}const y=new t.BufferGeometry;y.setAttribute("position",new t.BufferAttribute(e,3)),y.userData.capAt=d.cap?n:null;const A=new Float32Array(e.length);for(let v=0;v<=z;v++)for(let T=0;T<48;T++){const D=(v*48+(T+48-1)%48)*3,R=(v*48+(T+1)%48)*3,g=(U(v-1,0)*48+T)*3,b=(J(v+1,z)*48+T)*3,c=e[R]-e[D],w=e[R+1]-e[D+1],C=e[R+2]-e[D+2],L=e[b]-e[g],Q=e[b+1]-e[g+1],I=e[b+2]-e[g+2];let F=w*I-C*Q,q=C*L-c*I,E=c*Q-w*L;const B=Math.hypot(F,q,E);B<1e-7?(F=0,q=0,E=1):(F/=B,q/=B,E/=B);const O=(v*48+T)*3;A[O]=F,A[O+1]=q,A[O+2]=E}return y.setIndex(new t.BufferAttribute(f,1)),y.setAttribute("normal",new t.BufferAttribute(A,3)),y.boundingSphere=new t.Sphere(new t.Vector3(a.axis[0],a.axis[1],(n+i)/2),(i-n)/2+30),y}function rt(s,n){const z=[],d=[],x=[],P=s.barC(n),p=s.barR(n),l=s.barA(n),e=1-2*s.barP(n),f=V(l),M=m(l);for(let A=0;A<=28;A++){const v=-X/2+X*A/28;for(const T of[1,e]){const D=T*V(v),R=m(v);z.push(P[0]+p*(D*f-R*M),P[1]+p*(D*M+R*f),n),d.push(0,0,-1)}}for(let A=0;A<28;A++){const v=A*2;x.push(v,v+1,v+2,v+1,v+3,v+2)}const y=new t.BufferGeometry;return y.setAttribute("position",new t.Float32BufferAttribute(z,3)),y.setAttribute("normal",new t.Float32BufferAttribute(d,3)),y.setIndex(x),y.boundingSphere=new t.Sphere(new t.Vector3(P[0],P[1],n),20),y}function Ke(s,n,i,z=0){const d=[],x=[],P=s.length,p=[];for(let e=0;e<n;e++)p.push(z?1+z*(i()-.3)*(.5+.5*m(e*.9)):1);for(let e=0;e<P;e++)for(let f=0;f<n;f++){const M=f/n*j,y=s[e][0]*(s[e][2]?p[f]:1);d.push(a.axis[0]+y*V(M),a.axis[1]+y*m(M),s[e][1])}for(let e=0;e<P-1;e++)for(let f=0;f<n;f++){const M=e*n+f,y=e*n+(f+1)%n,A=M+n,v=y+n;x.push(M,y,A,y,v,A)}const l=new t.BufferGeometry;return l.setAttribute("position",new t.Float32BufferAttribute(d,3)),l.setIndex(x),l.computeVertexNormals(),l}const tt=s=>3.2+4.2*m(s*.0125+.9)+1.3*m(s*.043+2);function ue(s,n=[0,0]){const i=H(845,1e3,s),z=H(500,640,s),d=1-H(160,300,s);return n[0]=ie(6,a.axis[0],i)+16*d,n[1]=ie(40-12.5*z,a.axis[1],i)+4.5*d,n}function at(s){const n=[[0,.42],[.13,.42],[.15,.38],[.3,1.42],[.82,1.42],[.9,1],[1,1]];let i=0;for(;i<n.length-2&&s>n[i+1][0];)i++;return ie(n[i][1],n[i+1][1],H(n[i][0],n[i+1][0],s))}const ot=[3.9,7.9,11.9,19,28];async function st(s,n){const d=a.barEnd,x=2*a.coreR,P=d-x,p=a.coreR/2,l=[],e=[],f=[],M=[],y=[0,0],A=-.3,v=P+.52*x,T=.3*x,D=.8,R=b=>Math.atan2(m(b),V(b));for(let b=0;b<=64;b++){n&&b%12===11&&await n.yield();const c=b/64,w=P+(d-P)*c;s.barC(w,y);const C=H(d-1.1*p,d-.2,w),L=1-J(c/.42,1),Q=p*se(U(1-me(L,2.4),0))*se(U(1-C*C,0))+.04,I=H(.16,0,c),F=y[1]+.38*p*I*I,q=y[0]-.18*p*I*I;for(let E=0;E<64;E++){const B=E/64*j-X,O=R(B-A),k=(w-v)/T,ae=O/D,Z=Math.hypot(ae,k);let ee=1;Z<1&&(ee-=.5*(1-Z*Z)*(1-.25*C)),ee+=.12*Math.exp(-((Z-1)*(Z-1))/.03)*(1-C),l.push(q+Q*ee*V(B),F+Q*ee*m(B)*.96,w),e.push(1-H(.7,.98,Z)),f.push(k,ae,0)}}for(let b=0;b<64;b++)for(let c=0;c<64;c++){const w=b*64+c,C=b*64+(c+1)%64;M.push(w,C,w+64,C,C+64,w+64)}const g=new t.BufferGeometry;return g.setAttribute("position",new t.Float32BufferAttribute(l,3)),g.setAttribute("aHollow",new t.Float32BufferAttribute(e,1)),g.setAttribute("aTipQ",new t.Float32BufferAttribute(f,3)),n&&await n.yield(),g.setIndex(M),g.computeVertexNormals(),n&&await n.yield(),g.boundingSphere=new t.Sphere(new t.Vector3(a.axis[0],a.axis[1],(P+d)/2),x),g}async function lt(s,n={}){const i=s.rng.fork?s.rng.fork("moon-bar"):s.rng,z=ne(n.detail??s.quality?.detail??1,.6,1),d=Je(i,{gibbous:n.gibbous}),x=et({palette:n.palette||He,shape:d,exposure:n.exposure??1}),P=x.uniforms,p=x.palette;for(let o=0;o<5;o++)P.uCutZ0.value[o]=a.z0+a.slab*(o+1);P.uDawn.value.set(108,182,38,.07),P.uCapY.value=33;const l=new t.Group;l.name="night-by-the-slice-hero";const e=new t.Group;e.rotation.y=X,e.position.z=(a.z0+a.z1)/2,l.add(e);const f=(o,h,r)=>new t.Vector3(-o,h,(a.z0+a.z1)/2-r),M=(o,h,r=0)=>{const u=new t.Mesh(o,h);return u.frustumCulled=!1,u.renderOrder=r,e.add(u),u};await s.yield();const y=x.boxGeometry(96),A=M(y,x.hullMaterial(),-2);await s.yield();const v=M(y,x.skinMaterial({moonOv:new t.Vector4(d.faceMoon.p,d.faceMoon.R,0,0)}),6);await s.yield();const T=x.pasteMaterial(p[5].clone().multiplyScalar(.955),{grain:.012,keep:.94,eyeK:.06,model:0,tip:1});await s.yield();const D=M(await st(d,s),T,0);await s.yield();const R=M(x.moonGeometry(d.moons.map(o=>{const h=d.moonC(o);return{c:[h[0],h[1],o.z],R:o.R,p:o.p,a:d.barA(160)}})),x.moonMaterial(),0);await s.yield();const g=a.coreR,b=a.z1,c=[];for(let o=0;o<=8;o++){const h=o/8;c.push([.05+(g-.1)*m(h*X*.5),a.barEnd-4+7*(1-V(h*X*.5))])}for(let o=1;o<=16;o++)c.push([g-.05,a.barEnd+3+(b-a.barEnd-3)*(o/16)]);const w=M(Ke(c,48,i),x.coreMaterial(),4);await s.yield();const C=[[g+.5,b-12,1],[g+.72,b-10.4,1],[g+.95,b-5],[g+1.3,b-2.2],[g+2.1,b-1.1],[g+3.3,b-.6,1],[g+3.1,b-.4,1],[g+.6,b-.4],[g-.15,b-.4],[g-.02,b-2.5],[g+.16,b-6],[g+.36,b-10],[g+.5,b-12,1]],L=M(Ke(C,72,i,.14),x.pasteMaterial(p[5],{grain:.05,keep:.94,eyeK:.06,model:0}),0);await s.yield();const Q=(()=>{const h=d.fullMoon.R,r=[],u=[];for(let $=0;$<=3;$++){const S=ie(g+.3,h,[0,.12,.6,1][$]);for(let G=0;G<96;G++){const W=G/96*j;r.push(a.axis[0]+S*V(W),a.axis[1]+S*m(W),b-.45)}}for(let $=0;$<3;$++)for(let S=0;S<96;S++){const G=$*96+S,W=$*96+(S+1)%96;u.push(G,W,G+96,W,W+96,G+96)}const N=new t.BufferGeometry;return N.setAttribute("position",new t.Float32BufferAttribute(r,3)),N.setAttribute("normal",new t.Float32BufferAttribute(new Float32Array(r.length).map(($,S)=>S%3===2?-1:0),3)),N.setIndex(u),M(N,x.pasteMaterial(p[5],{grain:.012,keep:.94,eyeK:.06,model:0,maria:1,side:t.DoubleSide}),0)})();await s.yield();const I=Math.round((n.flakes??32e3)*z),F=Math.round(2600*z),q=I+F,E=new Float32Array(q*3),B=new Float32Array(q),O=new Float32Array(q),k=[0,0],ae=[0,0],Z=[{wide:1,p:[[-1,.3,1],[-.62,.5,.9],[-.3,.34,.9],[-.02,.1,.8],[.08,-.5,.9],[.62,-.62,.9],[.74,.08,1]]},{wide:0,p:[[-.5,.78,1],[.45,.84,.9],[-.36,.1,.85],[0,0,.85],[.36,-.1,.85],[-.55,-.82,.9],[.48,-.76,1],[0,1,.6],[.06,-.36,.6]]},{wide:1,p:[[-1,.5,.9],[-.5,-.5,1],[0,.2,.9],[.5,-.6,.9],[1,.55,1]]},{wide:0,p:[[0,1,1],[0,.32,.9],[0,-.92,.9],[-.8,.5,.85],[.75,.22,.85],[0,-.3,.6]]}],ee={star:[33,67,12,7],port:[-37,68,10,7.5]},re=[[0,"star",290],[1,"star",420],[3,"star",535],[2,"port",700],[0,"star",880]],le=[],Se=[];for(const[o,h,r]of re){const u=ee[h],N=i.range(-.18,.18),$=r+i.range(-12,12);for(const S of Z[o].p){const G=S[0]*V(N)-S[1]*m(N),W=S[0]*m(N)+S[1]*V(N);let oe=u[0]-G*u[2],te=u[1]+W*u[3];const he=$+i.range(-2.5,2.5);te=U(te,d.ridgeH(oe,he)+3),d.inBar(oe,te,he,2.5)&&(te+=9),le.push([ne(oe,a.x0+3,a.x1-3),J(te,a.y1-2.5),he,3*S[2]])}Se.push([u[0],u[1],u[2]+5,u[3]+4,$])}const Ge=U(0,I-le.length),We=i()*j,ge=2.5,ve=[];for(let o=a.z0;o<a.z1;o+=ge)ue(o,k),ve.push(k[0],k[1]);const Ve=d.moons.map(o=>d.moonC(o,[0,0])),Ue=(o,h,r,u)=>{for(let N=0;N<d.moons.length;N++){const $=d.moons[N],S=Ve[N];if(r>$.z-25)continue;const G=J(ve.length/2-1,Me((r-6-a.z0)/ge));for(let W=0;W<=G;W++){const oe=a.z0+W*ge,te=(r-oe)/($.z-oe),he=ve[W*2],De=ve[W*2+1];if(Math.hypot(o-he-(S[0]-he)*te,h-De-(S[1]-De)*te)<$.R*te+u+1)return!0}}return!1};let K=0,be=0,Ce=0,Ee=0,Ae=0,we=0;for(;K<Ge&&be<I*12;){be++,be%200===0&&await s.yield();let o,h,r,u;if(we>0)we--,o=Ce+i.gauss()*1.6,h=Ee+i.gauss()*1.2,r=Ae+i.gauss()*2.6,u=.3+.7*i()*i();else{r=i.range(a.z0+.5,a.z1-1);const S=i();if(u=.3+1.5*S*S*S*S,i()<.12){const W=.55+.5*m(r*.0045+We),oe=i.gauss()*34,te=i.gauss()*2.6;o=10+oe*V(W)-te*m(W),h=55+oe*m(W)+te*V(W),u=.26+.5*i()*i()+(i()<.04?.9:0)}else o=i.range(a.x0+1,a.x1-1),h=i.range(3,a.y1-1);ue(r,k);const G=Math.hypot(o-k[0],h-k[1]);if(G<8||G>30&&i()>.45||r>930&&G<36&&i()>.03+.97*(G/36)*(G/36)*(G/36)||h>68&&i()>.5||r<245&&i()>.2)continue;i()<.2&&(we=2+Me(i()*6),Ce=o,Ee=h,Ae=r)}if(o<a.x0+1||o>a.x1-1||h>a.y1-1||r<a.z0+.5||r>a.z1-1||h<d.ridgeH(o,r)+.8+u)continue;ue(r,k);const N=Math.hypot(o-k[0],h-k[1]);if(N<8+u||r>930&&Math.hypot(o-a.axis[0],h-a.axis[1])<d.fullMoon.R+a.waveHeight+u)continue;if(r>560){const S=a.axis[0]-k[0],G=a.axis[1]-k[1],W=ne(((o-k[0])*S+(h-k[1])*G)/(S*S+G*G+1e-6),0,1);if(Math.hypot(o-k[0]-S*W,h-k[1]-G*W)<ie(10,29,W))continue}if(o>-32&&o<k[0]+4&&r>258&&r<348&&h<40||o<k[0]-5&&r>448&&r<554&&_(h-48)<27||o>8&&o<58&&r>600&&r<680&&h<62||_(o-k[0])<17&&r>677&&r<737&&h<40||r>958&&h<54&&(_(o-13)<17||_(o+43)<17)||(N<20&&(u=J(u,.3+N*.04)),we>0&&N<18&&K%3!==0)||d.inBar(o,h,r,.5+u*.6)||d.inSight(o,h,r)||Ue(o,h,r,u))continue;let $=!1;for(const S of Se)if(_(r-S[4])<26&&_(o-S[0])<S[2]&&_(h-S[1])<S[3]){$=!0;break}$||r>a.barEnd-6&&Math.hypot(o-a.axis[0],h-a.axis[1])<a.collarR+(r>a.z1-5?4:1.2)+u||(E[K*3]=o,E[K*3+1]=h,E[K*3+2]=r,B[K]=u,O[K]=.8+.3*i(),K++)}const je=K;for(let o=0;o<F;o++){o%250===249&&await s.yield();const h=!1;let r,u;if(h){u=i.range(180,1040),r=i.range(-56,56);for(let S=0;S<6&&d.ridgeH(r,u)<30;S++)r=i.range(-56,56)}else u=i.range(196,900),ue(u,k),r=k[0]+i.gauss()*(u<480?13:10);const N=h?.4+.8*i()*i():.45+.95*i()*i(),$=(h?.9:1.5)+.4*i();_(r)>57||u>d.lake.z0&&u<d.lake.z1&&d.ridgeH(r,u)<=d.lake.y+.01||u>500&&_(r-tt(u))<3.4||(E[K*3]=r,E[K*3+1]=d.ridgeH(r,u)+.14,E[K*3+2]=u,B[K]=N,O[K]=$,K++)}const qe=K;for(const o of le){if(K>=q)break;E[K*3]=o[0],E[K*3+1]=o[1],E[K*3+2]=o[2],B[K]=o[3],O[K]=1.25,K++}await s.yield();const ze=x.leafGeometry(K,i,(o,h)=>{h.pos[0]=E[o*3],h.pos[1]=E[o*3+1],h.pos[2]=E[o*3+2],h.size=B[o],h.tone=O[o]});{const o=ze.getAttribute("aQuat"),h=ze.getAttribute("aData");for(let r=qe;r<K;r++){const u=i.range(-.2,.2),N=i.range(-.2,.2);o.setXYZW(r,m(u/2),m(N/2),0,V(u/2)*V(N/2)),h.setW(r,1)}for(let r=je;r<qe;r++){const u=-X/2+i.range(-.22,.22),N=i.range(-.2,.2);o.setXYZW(r,m(u/2),0,m(N/2),V(u/2)*V(N/2)),h.setW(r,2)}}const Be=M(ze,x.leafMaterial(),1);Be.material.uniforms.uFar.value=2.8,await s.yield();let Pe=!1;const xe=new Float32Array(65);{let o=0;for(let h=1;h<=64;h++)o+=1/(64*at((h-.5)/64)),xe[h]=o;for(let h=1;h<=64;h++)xe[h]/=o}const ke=[-1,-1,-1,-1,-1];function Le(o,h=ot){Pe=!0;let r=a.z0;for(let u=0;u<5;u++)P.uCutZ0.value[u]=a.z0+a.slab*(u+1);for(let u=0;u<5;u++)ke[u]=o>=h[u]?o-h[u]:-1,ke[u]>=0&&(r+=a.slab);x.setCuts(ke,r)}function $e(o,h=40){const r=ne(o,0,1)*64,u=J(63,Me(r));Le(h*ie(xe[u],xe[u+1],r-u))}const Re=new t.Vector2;function Fe(o,h,r){if(P.uTime.value=h,!Pe){const u=h%9;x.setCuts([40+u,20+u,9+u,u,-1],a.z0+3*a.slab),P.uCutZ0.value[3]=a.z0+3*a.slab}s.renderer&&r&&(s.renderer.getDrawingBufferSize(Re),P.uPx.value=.5*Re.y*r.projectionMatrix.elements[5])}Fe(0,0,null);const _e=[0,80,160,400,600,660,710,760,820,900,925,950,975,1e3,1030,1060].map(o=>(ue(o,k),f(k[0],k[1],o))),Qe={portalSeat:{position:f(a.axis[0],a.axis[1],a.z1),facing:new t.Vector3(0,0,1),radius:7},flyThrough:_e,entry:f(0,26,0),faceCentre:f(0,40,a.z0+3*a.slab),barStart:f(...d.barC(a.z0),a.z0),barTip:f(a.axis[0],a.axis[1],a.barEnd),coreStart:f(a.axis[0],a.axis[1],a.barEnd-4),viewpoints:{entry:f(0,26,0),blade:f(0,34,80),wetFace:f(0,41.5,150),heart:f(0,42,520),tip:f(0,42,860),shaft:f(a.axis[0],a.axis[1],1010)}};let de=f(0,36,100),ce=50,fe=12;const ye=n.view;return ye==="in"&&(de=f(2,43,420),ce=9,fe=6),ye==="tip"&&(de=f(5,45,880),ce=12,fe=6),ye==="core"&&(de=f(a.axis[0],a.axis[1],1004),ce=1,fe=1),ye==="far"&&(de=f(0,30,400),ce=260,fe=200),{object:l,radius:ce,height:fe,center:de,anchors:Qe,loaf:e,jelly:x,shape:d,uniforms:P,meshes:{hull:A,skin:v,bar:D,core:w,collar:L,leaf:Be,moons:R,fullMoon:Q},setProgress:$e,setClock:Le,setCuts:(o,h)=>{Pe=!0,x.setCuts(o,h)},setExposure:o=>{P.uExposure.value=o},update:Fe,dispose(){},ground:!0,groundY:0}}export{ot as CUT_TIMES,a as LOAF,He as PALETTE,pe as STYLE_GLSL,Te as STYLE_VERT_GLSL,rt as barCapGeometry,it as barGeometry,lt as buildHero,et as createJelly,Je as makeShape,at as pace,ue as pathXY,tt as streamX,st as tipGeometry,nt as toScene};
