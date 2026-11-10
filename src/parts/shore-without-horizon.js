import*as n from"three";const ee=Math.PI*2,te=128,me=9,Ve=[.5,.36,.7,.3,.36,.36,.34,.6,.6],We=[62,2.4],it=3,At=["#1E4854","#8C86A6","#F3CDB0","#EEE6D3","#060606","#E8674F","#35B6B0"],kt=[.59719,.35458,.04823,.076,.90834,.01566,.0284,.13383,.83777],zt=[1.60475,-.53108,-.07367,-.10208,1.10813,-.00605,-.00327,-.07276,1.07602],st=(l,a)=>[l[0]*a[0]+l[1]*a[1]+l[2]*a[2],l[3]*a[0]+l[4]*a[1]+l[5]*a[2],l[6]*a[0]+l[7]*a[1]+l[8]*a[2]];function St(l){const t=st(kt,l.map(r=>Math.max(r,0)/.6)).map(r=>(r*(r+.0245786)-90537e-9)/(r*(.983729*r+.432951)+.238081));return st(zt,t).map(r=>Math.min(1,Math.max(0,r)))}function we(l){const a=new n.Color(l),t=[a.r,a.g,a.b];let r=t.slice();for(let g=0;g<60;g++){const A=St(r);r=r.map((y,k)=>Math.min(6,Math.max(0,y+(t[k]-A[k])*(.9+1.6*y))))}return new n.Color().setRGB(r[0],r[1],r[2],n.LinearSRGBColorSpace)}const Ae=(l,a)=>{let t=0;for(const[r,g,A,y]of a){const k=y&&l>r?0:(l-r)/g;t+=A*Math.exp(-k*k)}return t},Se=(l,a,t)=>{const r=Math.min(1,(1-l)/t);return Math.pow(Math.min(1,l/a),.8)*Math.sqrt(Math.max(0,r*(2-r)))};function Le(l,a){let t=.05,r=0,g=a;const A=Math.sin(Math.PI*a),y=Math.cos(Math.PI*a);switch(l){case 0:t=.3*Math.pow(Math.max(A,0),.72)*(1.12-.34*a)*Math.min(1,a/.02+.08);break;case 1:t=(.016+Ae(a,[[.895,.05,.09,1],[.3,.2,.012]]))*Se(a,.02,.105);break;case 2:t=(.006+Ae(a,[[.56,.24,.115]]))*Se(a,.01,.02);break;case 3:t=(.03+Ae(a,[[.23,.13,.15],[.8,.15,.19,1]]))*Se(a,.03,.2);break;case 4:t=(.035+Ae(a,[[.18,.1,.12],[.5,.11,.17],[.86,.09,.11,1]]))*Se(a,.03,.14),r=.07*Math.sin(ee*a*1.02)*a;break;case 5:{t=(.028+Ae(a,[[.22,.16,.06],[.89,.07,.095,1]]))*Se(a,.03,.11);let k=0,C=0;const P=48,B=Math.min(a,1);for(let v=0;v<P;v++){const E=(v+.5)/P*B,I=Math.max(0,(E-.5)/.5),q=2.7*I*I*(3-2*I);k+=Math.sin(q)*B/P,C+=Math.cos(q)*B/P}r=k*1.22,g=C*1.22;break}case 6:t=(.012+Ae(a,[[.29,.19,.2],[.84,.1,.115,1]]))*Se(a,.015,.16);break;case 7:t=(.012+.07*A*A+Ae(a,[[.33,.1,.05]]))*Math.min(1,A/.06+.05),r=-.34*y,g=Math.pow(Math.max(A,0),.62);break;default:t=(.01+.026*A+Ae(a,[[.26,.085,.15],[.74,.085,.13]]))*Math.min(1,A/.05+.05),r=-.46*Math.sign(y)*Math.pow(Math.abs(y),.55),g=Math.pow(Math.max(A,0),.5);break}return[Math.max(t,0),r,g]}function*ht(){const l=new Uint16Array(te*me*4),a=[];for(let g=0;g<me;g++){g&&(yield null);const A=new Float32Array(te*3);for(let h=0;h<te;h++){const[i,f,u]=Le(g,h/(te-1)),s=(g*te+h)*4;A[h*3]=i,A[h*3+1]=f,A[h*3+2]=u,l[s]=n.DataUtils.toHalfFloat(i),l[s+1]=n.DataUtils.toHalfFloat(f),l[s+2]=n.DataUtils.toHalfFloat(u)}const y=224,k=new Float32Array(y+1);let C=0,P=0;const B=[];let v=null,E=null,I=Le(g,0);for(let h=1;h<=y;h++){const i=Le(g,h/y),f=Math.hypot(i[1]-I[1],i[2]-I[2]),u=i[0]-I[0],s=Math.atan2(u,Math.max(f,1e-6)),x=Math.atan2(i[1]-I[1],i[2]-I[2]);let m=0;if(v!==null){let b=Math.abs(x-E);b>Math.PI&&(b=ee-b),m=Math.min(.6,Math.abs(s-v))+Math.min(.6,b)}B.push([Math.hypot(f,u),m]),C+=Math.hypot(f,u),P+=m,v=s,E=x,I=i}const q=1.6*C/Math.max(P,.001);for(let h=0;h<y;h++)k[h+1]=k[h]+B[h][0]+q*B[h][1];for(let h=0,i=0;h<te;h++){const f=h/(te-1)*k[y];for(;i<y-1&&k[i+1]<f;)i++;const u=h===te-1?1:(i+(f-k[i])/Math.max(k[i+1]-k[i],1e-9))/y;l[(g*te+h)*4+3]=n.DataUtils.toHalfFloat(Math.min(1,Math.max(0,u)))}a.push(A)}const t=new n.DataTexture(l,te,me,n.RGBAFormat,n.HalfFloatType);return t.magFilter=t.minFilter=n.LinearFilter,t.wrapS=t.wrapT=n.ClampToEdgeWrapping,t.generateMipmaps=!1,t.needsUpdate=!0,{tex:t,at:(g,A)=>{const y=a[g],k=Math.min(Math.max(A,0),1)*(te-1),C=Math.min(te-2,Math.floor(k)),P=k-C;return[0,1,2].map(B=>y[C*3+B]*(1-P)+y[(C+1)*3+B]*P)}}}function Tt(){const l=ht();let a=l.next();for(;!a.done;)a=l.next();return a.value}async function Lt(l){const a=ht();let t=a.next();for(;!t.done;)await l.yield(),t=a.next();return t.value}const ge={floor:1/3,half:1/3,reach:.1,full:1.5,l1:3.5,l2:6,t1:6,t2:9.5},ke=l=>l.toFixed(6),Pt=Math.ceil(ge.floor*1e6-1e-9)/1e6,Dt=(()=>{const l=.5/(1-ge.floor);if(!(l<1))return ge.half;let a=0,t=1;for(let r=0;r<40;r++){const g=(a+t)/2;g*g*(3-2*g)<l?a=g:t=g}return ge.half/((a+t)/2)})(),Me=`
  uniform float uTime, uShadowAz, uModelSkew, uModelView, uModelLean, uLeanAdd, uGroundY, uGlint, uShLen, uPeel, uMirror, uMirrorForm, uUnderWet, uBladeW, uLimb, uUnder, uFlat;
  uniform vec2 uDbl;                        // (fix round 8) a WHOLE double: how much of its body's hang it keeps under the tide, and its size beside its body
  uniform vec2 uTurn;
  uniform vec4 uTide;                       // xy = unit direction the tide travels (world xz), z = how far it has come, w = 0|1 tide exists
  uniform vec3 uRampC[4], uIvory, uDove, uBlack, uShade;
  vec3 hseg(vec3 a, vec3 b, vec3 ma, vec3 mb, float u){ float u2=u*u, u3=u2*u;
    return (2.*u3-3.*u2+1.)*a + (u3-2.*u2+u)*ma + (3.*u2-2.*u3)*b + (u3-u2)*mb; }
  // THE GRADIENT. e = elevation of the view ray in radians (-PI/2 straight down .. +PI/2 zenith). One C1 curve through
  // petrol (-90 deg), smoke violet (-30), opal (0), apricot (+40 and up); nothing happens at e = 0.
  const float RAMP_TOP = .44444;      // the gradient's top stop, as a share of the way from level to the zenith: 40 degrees up. ramp()'s clamp and air() both read it
  vec3 ramp(float e){
    float x = clamp(e/1.5707963, -1., RAMP_TOP);
    vec3 s01=(uRampC[1]-uRampC[0])*1.5, s12=(uRampC[2]-uRampC[1])*3., s23=(uRampC[3]-uRampC[2])*2.25;
    vec3 m1=.5*(s01+s12), m2=.5*(s12+s23);
    if (x < -.33333) return hseg(uRampC[0], uRampC[1], s01*.66667, m1*.66667, (x+1.)*1.5);
    if (x < 0.) return hseg(uRampC[1], uRampC[2], m1*.33333, m2*.33333, (x+.33333)*3.);
    return hseg(uRampC[2], uRampC[3], m2*.44444, vec3(0.), x*2.25);
  }
  // (the fourteenth round) THE AIR IS DEEP WHERE THE BODIES HANG. air(e) = the tone of the air on a ray, as the backdrop's one text
  // (shoreAt) draws it: ramp(e) itself up to the gradient's own top stop (RAMP_TOP: 40 degrees over level, where ramp() reaches its
  // last ink and from where it is flat) and, from that stop to the zenith, ramp's ink mixed toward the hour's own violet
  // (uRampC[1], the ink 30 degrees under level) by z*s(u), u = t*(2 - t), t = how far e has come from the stop to the zenith
  // (0 to 1), s(u) = u*u*(3 - 2u): 0 with no slope at the stop, where ramp() too arrives with no slope (so the tone and its slope
  // are continuous there: the air is palest 40 degrees up and turns over smoothly), z with no slope at the zenith, never falling
  // between; half of z at 54.6 degrees, nine tenths at 67.9.
  // z, THE ZENITH'S SHARE, comes from the hour's inks by one rule: the share of the violet that brings the top ink's light
  // (.3 r + .6 g + .1 b of the ink as it is written, the weights of mirrorInk and stepTo) down to .42; a top ink whose light is
  // already under .42 keeps it, z = 0. By the world's four hours, in L as the screen
  // shows the inks: dawn z .56, the zenith 73.0 (ivory 93.5, dove 56.5); day .68, 75.7 (95.1, 55.6); the golden hour .73, 73.8
  // (93.1, 54.1): 19 to 20.5 under the hour's ivory, within 2 of midway between its ivory and its dove; night z 0 (its top ink's
  // light is .14), so there air(e) is ramp(e) to the last bit.
  // THE START IS THE GRADIENT'S TOP STOP (the fourteenth round b; it was a typed 48.2 degrees): that stop is a thing of the world,
  // the place from which the air was one flat ink, and from there it deepens. air() reads the stop from the constant that
  // ramp()'s clamp reads, so the two cannot part.
  // ramp() draws as it drew, flat from 40 degrees up (its clamp reads RAMP_TOP, the figure it held typed): besides the backdrop's
  // air it is read by the tide's film (the air a quarter as high, so never over 22.5 degrees), by the ground under level and by
  // every body's underside (ramp of 60 degrees up, in shadeForm), and this law moves none of them.
  vec3 air(float e){
    float y3 = dot(uRampC[3], vec3(.3, .6, .1)), y1 = dot(uRampC[1], vec3(.3, .6, .1));
    float z = clamp((y3-.42)/max(y3-y1, 1e-4), 0., 1.), t = clamp((e/1.5707963-RAMP_TOP)/(1.-RAMP_TOP), 0., 1.), u = t*(2.-t);
    return mix(ramp(e), uRampC[1], z*u*u*(3.-2.*u));
  }
  float elevOf(vec3 d){ return asin(clamp(d.y/max(length(d),1e-4), -1., 1.)); }
  // 1 where the mirror tide has arrived at ground point xz, 0 ahead of the front (a few centimetres of soft edge)
  float tideWet(vec2 xz){ return uTide.w*(1.-smoothstep(-.06, .06, dot(xz, uTide.xy)-uTide.z)); }
  // THE TIDAL FLAT (ground round). The flat is a real surface: bars of drying sand lying along the tide's edge with sheets
  // and pools of standing water between them. flatH(xz, fd) = height of the sand over the water there, in its own units
  // (above 0 sand, below 0 water); fd = how much of each of its three scales can be drawn at that distance (1,1,1 near).
  const vec2 FQ0 = vec2(.0028, .0083), FQ1 = vec2(.015, .045), FQ2 = vec2(.05, .14);      // three scales of bar: 360 by 120 m, 66 by 22, 20 by 7
  float fhash(vec2 p){ vec3 q = fract(vec3(p.xyx)*.1031); q += dot(q, q.yzx+33.33); return fract((q.x+q.y)*q.z); }
  float fnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
    return mix(mix(fhash(i), fhash(i+vec2(1., 0.)), f.x), mix(fhash(i+vec2(0., 1.)), fhash(i+vec2(1., 1.)), f.x), f.y); }
  vec2 shoreQ(vec2 xz){ return vec2(dot(xz, vec2(uTide.y, -uTide.x)), dot(xz, uTide.xy)); }      // (along the tide's edge, the way it travels)
  float flatH(vec2 xz, vec3 fd){ vec2 q = shoreQ(xz);
    return .4*fd.x*(fnoise(q*FQ0+3.7)-.5) + .85*fd.y*(fnoise(q*FQ1+11.3)-.5) + .5*fd.z*(fnoise(q*FQ2+5.1)-.5) + .03; }
  // 1 where a double can be seen at ground point xz: where the tide has come, and before it in every pool of the flat
  // (fix round 8) before the tide the flat is the gradient's own deep ground (uFlat under a half): no pool, so no double
  float wetAt(vec2 xz){ return max(tideWet(xz), step(flatH(xz, vec3(1.)), -.03)*step(.5, uFlat)); }
  // A DOUBLE SEEN FROM THE AIR is drawn short (wet sand shows a body's double foreshortened): full height from the flat,
  // a fifth of it from 34 m up, so the hung colony and the mother are doubled inside the picture under themselves
  // (fix round 7) two fifths, not a fifth: at a fifth a double was a squashed patch. And from the air ONLY THE GREAT ARE DOUBLED:
  // dblKeep(H) = how much of the double of a body H tall is drawn (under 12 m it draws back into its foot as the eye rises),
  // so the mirror seen from 40 m holds the mother, her largest and the giants upside down and no debris
  // (fix round 8) WHOLE: the double of a body that hangs over the tide is drawn whole and in its true proportions at any height
  // of the eye (never squashed, never left out), hung under the tide a part (uDbl.x) as deep as its body hangs over it and
  // drawn uDbl.y the size of its body (so the double of a riser beside the eye still stands whole inside the picture)
  #ifdef WHOLE
    float dblK(){ return 1.; }
    float dblKeep(float H){ return 1.; }
  #else
    float dblK(){ return mix(1., .42, smoothstep(10., 34., cameraPosition.y-uGroundY)); }
    float dblKeep(float H){ return 1.-smoothstep(13., 27., cameraPosition.y-uGroundY)*(1.-smoothstep(10.5, 13., H)); }
  #endif
  // THE MIRROR. How bright the tide shows the gradient at view elevation e (e < 0 looking down): at level it IS the air
  // (so ground and air still meet with nothing to see), and it falls to uMirror looking down (night: oil)
  float mirrorK(float e){ return mix(1., uMirror, smoothstep(0., .5, -e)); }
  // a double in the tide: the form's own modelling greyed toward dove (m = uMirrorForm; 1 = a perfect mirror)
  vec3 mirrorInk(vec3 col, float m){ vec3 lw = vec3(.3, .6, .1);
    float rel = clamp(dot(col, lw)/max(dot(uIvory, lw), 1e-4), 0., 1.);
    return mix(uDove*(.62+.38*rel), col, smoothstep(.5, .9, m)); }
  #ifdef DAWNDBL
    // (the thirteenth round, see DAWN) dblFade(x) = K: how much of a double's own colour is left at x = the image's true depth
    // under the tide over the height of the body's top over the tide; dblWave(w): the level offset in metres of a point of a
    // double drawn at world w
    float dblFade(float x){ float s = smoothstep(0., ${ke(Dt)}, x); return (1.-s)+${ke(Pt)}*s; }
    vec2 dblWave(vec3 w){ float d = max(uGroundY-w.y, 0.);
      return ${ke(ge.reach*Math.SQRT1_2)}*smoothstep(0., ${ke(ge.full)}, d)*vec2(sin(6.28319*(d/${ke(ge.l1)}-uTime/${ke(ge.t1)})+.9*w.x+.5*w.z),
        sin(6.28319*(d/${ke(ge.l2)}+uTime/${ke(ge.t2)})+.4*w.x-.8*w.z+1.3)); }
  #endif
  float shadowAz(){ return uShadowAz + .07*sin(uTime*.45); }              // the needles drift 4 degrees to and fro on their own
  vec2 shadowDir(){ float a = shadowAz(); return vec2(sin(a), cos(a)); }   // world xz direction every shadow points
`,de={h0:6,hc:76,dc:.44,p:.55,w:5,b0:.34,b1:1,bd:.5,bz:.05},ue=l=>l.toFixed(4),$e=`
  float penX(float h){ return clamp((h-${ue(de.h0)})/${ue(de.hc-de.h0)}, 0., 1.); }
  float penD(float h){ float x = pow(penX(h), ${ue(de.p)}); return 1.-${ue(1-de.dc)}*x*x*(3.-2.*x); }
  float penE(float h){ float x = penX(h); return ${ue(de.w)}*x*x*(3.-2.*x); }
  float penB(float b){ float t = clamp((b-${ue(de.b0)})/${ue(de.b1-de.b0)}, 0., 1.), u = clamp((b-${ue(de.bz)})/${ue(de.b0-de.bz)}, 0., 1.);
    return ${ue(de.bd)}*u*u*(3.-2.*u)+${ue(1-de.bd)}*t*t*(3.-2.*t); }
  float penK(float b){ return min((1.-penB(b))/${ue(1-de.bd)}, 1.); }
  float penLeft(float h, float b, float d, float hb, float cap){ float k = penK(b);
    return 1.-penD(h)*penB(b)*smoothstep(0., max(min(max(penE(h), k*hb), mix(cap, hb, k)), 1e-4), d); }
`;function Et(l){if(l.getAttribute("aS0"))return l;const a=l.getAttribute("position").array,t=l.getAttribute("normal").array,r=l.index.array,g=a.length/3,A=new Int32Array(g),y=new Map,k=new Array(g);for(let v=0;v<g;v++){const E=Math.round(a[v*3]*1e3)+","+Math.round(a[v*3+1]*1e3)+","+Math.round(a[v*3+2]*1e3);y.has(E)||y.set(E,v),A[v]=y.get(E)}const C=(v,E)=>{A[v]!==A[E]&&(k[A[v]]||(k[A[v]]=new Set)).add(E)};for(let v=0;v<r.length;v+=3)for(let E=0;E<3;E++)C(r[v+E],r[v+(E+1)%3]),C(r[v+(E+1)%3],r[v+E]);const P=new Float32Array(g*3),B=new Float32Array(g*3);for(let v=0;v<g;v++){const E=k[A[v]];if(!E)continue;const I=t[v*3],q=t[v*3+1],h=t[v*3+2];let i=Math.abs(q)<.9?-h:0,f=Math.abs(q)<.9?0:h,u=Math.abs(q)<.9?I:-q;const s=Math.hypot(i,f,u)||1;i/=s,f/=s,u/=s;const x=q*u-h*f,m=h*i-I*u,b=I*f-q*i;let z=0,R=0,X=0,G=0,K=0,w=0,S=0,V=0;for(const oe of E){const ce=a[oe*3]-a[v*3],be=a[oe*3+1]-a[v*3+1],ye=a[oe*3+2]-a[v*3+2],re=ce*i+be*f+ye*u,ae=ce*x+be*m+ye*b,o=re*re+ae*ae;if(o<1e-10)continue;const M=t[oe*3]-I,F=t[oe*3+1]-q,O=t[oe*3+2]-h,T=M*i+F*f+O*u,N=M*x+F*m+O*b,D=1/o;z+=D*re*re,R+=D*re*ae,X+=D*o,G+=D*re*ae,K+=D*ae*ae,w+=D*re*T,S+=D*(ae*T+re*N),V+=D*ae*N}const _=z*(X*K-G*G)-R*R*K;if(!(_>1e-4))continue;const $=(w*(X*K-G*G)-R*(S*K-G*V))/_,J=(z*(S*K-G*V)-w*R*K)/_,he=(z*(X*V-G*S)-R*(R*V)+w*R*G)/_;P[v*3]=$*i*i+2*J*i*x+he*x*x,P[v*3+1]=$*f*f+2*J*f*m+he*m*m,P[v*3+2]=$*u*u+2*J*u*b+he*b*b,B[v*3]=$*i*f+J*(i*m+f*x)+he*x*m,B[v*3+1]=$*f*u+J*(f*b+u*m)+he*m*b,B[v*3+2]=$*u*i+J*(u*x+i*b)+he*b*x}return l.setAttribute("aS0",new n.BufferAttribute(P,3)),l.setAttribute("aS1",new n.BufferAttribute(B,3)),l}const Ue=`
  uniform float uProg;
  // rise: rp = (release, hang, phase). Returns the offset of a body that has let go of the ground: up, with a kite's sway.
  vec3 riseOff(vec3 rp){
    float k = clamp((uProg-rp.x)/(.2+.0022*rp.y), 0., 1.); k = k*k*(3.-2.*k);
    float a = k*(.5+.012*rp.y);
    return vec3(a*sin(uTime*.43+rp.z*6.), rp.y*k + a*.35*sin(uTime*.61+rp.z*9.), a*cos(uTime*.34+rp.z*4.));
  }
`,Ke=Ue+`
  uniform sampler2D uProf;
  attribute vec4 iA;   // foot x y z (local), height H
  attribute vec4 iB;   // yaw, body type 0..8, fatness, accent index 0..2
  attribute vec4 iC;   // release (0..1 of progress), hang height, phase, dip (fraction of the body from the tip that is dipped)
  attribute vec3 iD;   // sway inherited from the body it stands on: x, z amplitude (m) and that body's phase
  #ifdef BUD
    // BUDDING. A bud swells out of its parent's flank, slides off as a small egg, stands beside the parent, and sinks
    // back into the flat as the next one starts. iA.xyz = where it will stand; iE.xyz = from there back to the place on
    // the flank where it swells; iE.w = where in its cycle it is at time 0.
    attribute vec4 iE;
    float budCyc(){ return fract(uTime*(.075+.03*iC.z)+iE.w); }
  #endif
  #ifdef DAWNDBL
    vec2 lDb;      // (the thirteenth round) lathe() leaves here, over its group's own ground: how high the point's true image stands (the body's own foot, with all of its rise, and the point's height in a body of its own size) and how high the body's top
  #endif
  float ringT(float ty, float y){ return textureLod(uProf, vec2((clamp(y,0.,1.)*${te-1}.+.5)/${te}., (ty+.5)/${me}.), 0.).w; }
  vec3 prof(float ty, float t){ return textureLod(uProf, vec2((clamp(t,0.,1.)*${te-1}.+.5)/${te}., (ty+.5)/${me}.), 0.).xyz; }
  // medium: mercury. Radius multiplier (travelling bulges, breathing waists) and centreline sag for the tall ones.
  float bulge(float t, float ph, float H){
    float e = sin(3.14159*clamp(t,0.,1.));
    return 1. + e*(.17*sin(t*9.-uTime*.8+ph*20.) + .10*sin(t*3.5+uTime*.47+ph*11.));
  }
  vec3 centre(float ty, float t, float ph, float H){
    vec3 p = prof(ty, t);
    p.y += t*t*(.03+.02*smoothstep(4.,25.,H))*sin(uTime*.31+ph*14.);
    p.x *= bulge(t, ph, H);
    float nk = (t-.5)/.15;                         // the dumbbell bridge necks down almost to parting, then thickens until two are one
    p.x *= 1. + step(7.5, ty)*exp(-nk*nk)*(.9+1.5*sin(uTime*.27+ph*31.));
    return p;
  }
  vec3 yawed(vec3 v, float a){ float c=cos(a), s=sin(a); return vec3(c*v.x+s*v.z, v.y, -s*v.x+c*v.z); }
  // THE TURNING. a01 = 0..1 round the body, t along it. The ring is not divided evenly: for every ring the two points where
  // the surface turns away from the eye (n.(P-eye) = 0, solved exactly, perspective included) are found, and vertices are
  // put ON them: three quarters of the ring's vertices span the arc that faces the eye, one quarter the arc that does not.
  // So the outline of every body is its true turned outline at every ring whatever the number of sides: no facet.
  void lathe(float a01, float t, out vec3 pos, out vec3 nor){
    float ty=iB.y, ph=iC.z, H=iA.w, d=1./${te-1}.;
    vec3 budOff = vec3(0.);
    #ifdef MIRROR
      H *= max(dblKeep(iA.w), 1e-3);
      #ifdef WHOLE
        H *= uDbl.y;
      #endif
      #ifdef SINK
        // (fix round 7) A DOUBLE LETS GO WITH ITS BODY: as a body of the field rises its double draws back into the place it
        // stood (a risen body beside the eye left its double at the bottom of the frame, a grey thing with no owner above it)
        { float kr = clamp((uProg-iC.x)/(.2+.0022*iC.y), 0., 1.); H *= max(1.-smoothstep(.08, .5, kr)*step(.5, iC.y), 1e-3); }
      #endif
    #endif
    #ifdef DAWNDBL
      float dSz = H/max(iA.w, 1e-4);      // how much smaller than its body the double is drawn (dblKeep, uDbl.y, sink)
    #endif
    #ifdef BUD
      float cy = budCyc(), sl = smoothstep(.3, .6, cy);
      H *= max(smoothstep(0., .3, cy)*(1.-smoothstep(.93, 1., cy)), 1e-3);
      budOff = iE.xyz*vec3(1.-sl, 1.-sl*sl, 1.-sl);
      budOff.y += iA.w*.12*sin(3.14159*smoothstep(.6, .74, cy))*(1.-smoothstep(.6, .74, cy));   // it lands, dips and stands up
    #endif
    vec3 p=centre(ty,t,ph,H), a=centre(ty,t-d,ph,H), b=centre(ty,t+d,ph,H);
    vec2 dc=b.yz-a.yz; float dl=max(length(dc),1e-4); vec2 T=dc/dl, N=vec2(T.y,-T.x);
    float drds=(b.x-a.x)*iB.z/dl, r=p.x*iB.z;
    vec3 rise=riseOff(iC.xyw*vec3(1.,1.,0.)+vec3(0.,0.,ph));
    #ifdef DAWNDBL
      float dRise = rise.y;      // the body's own rise, before a whole double keeps a part of it
    #endif
    #ifdef WHOLE
      rise.y *= uDbl.x;
    #endif
    vec3 off=iA.xyz+budOff+vec3(iD.x,0.,iD.y)*sin(uTime*.31+iD.z*14.)+rise;
    vec3 eye=cameraPosition;
    #ifdef MIRROR
      eye.y = uGroundY-(eye.y-uGroundY)/dblK();
    #endif
    eye = (eye-modelMatrix[3].xyz)*mat3(modelMatrix);              // into the group's frame (yaw and translation only)
    vec3 vb = yawed(off-eye, -iB.x)+vec3(p.y, p.z, 0.)*H;           // eye -> ring centre, in the body's own frame
    float A=dot(N, vb.xy), B=vb.z, R=max(length(vec2(A, B)), 1e-4);
    float phi = R > 2e-4 ? atan(B, A) : 0.;
    float dlt = acos(clamp((drds*dot(T, vb.xy)-r*H)/R, -1., 1.));
    float th = a01 < .7501 ? phi+dlt+(a01/.75)*(6.2831853-2.*dlt) : phi-dlt+(a01-.75)*8.*dlt;
    float c=cos(th), s=sin(th);
    vec3 P=vec3(p.y+r*c*N.x, p.z+r*c*N.y, r*s)*H;
    vec3 n=vec3(c*N.x-drds*T.x, c*N.y-drds*T.y, s);
    pos=off+yawed(P,iB.x);
    #ifdef DAWNDBL
      { float ft = off.y+dRise-rise.y; lDb = vec2(ft+P.y/dSz, ft+H/dSz); }
    #endif
    nor=yawed(n/max(length(n),1e-4), iB.x);
  }
`,_e=`
  vec3 shadeForm(vec3 n, vec3 w, vec3 cam, float tip, float dipAt, vec3 accent){
    float az = shadowAz() + 3.14159 + uModelSkew;       // the modelling light disagrees with the shadows on purpose
    vec3 L = vec3(sin(az)*.9487, .3162, cos(az)*.9487);
    vec3 V = cam - w; V /= max(length(V), 1e-4);
    // THE PAINTER'S LIGHT (uModelView = 1): every body is lit from the right of the eye that looks at it, a little toward
    // the eye (uModelLean), so the turn of every form reads the same wherever it stands in the picture: clear light
    // with no source. uModelView = 0 is one light in the world at az.
    vec2 vh = V.xz; float vl = length(vh); vh = vl > 1e-3 ? vh/vl : vec2(0., -1.);
    float ln = uModelLean + uLeanAdd + .07*sin(uTime*.45), cl = cos(ln), sl = sin(ln);      // (uLeanAdd: a great body may have the light come round toward the eye, meshMaterial({ lean }))
    vec3 Lv = vec3((vh.y*cl+vh.x*sl)*.9487, .3162, (-vh.x*cl+vh.y*sl)*.9487);
    L = mix(L, Lv, uModelView); L /= max(length(L), 1e-4);
    // THE TURN OF A LATHED BONE: ivory on the lit flank, one smooth slide across the middle of the body, dove grey over the
    // far third; the terminator lies well inside the outline so every body shows both inks whatever its size
    // (the slide is drawn for the eye, not for the light meter: ivory is five times dove in light, so the mix is bent
    // until the middle of the slide is the middle grey between the two inks on the screen)
    // (fix round 3) uTurn = where the slide begins and ends (the pale hours turn sooner, so a full third of every body is
    // dove); uLimb: where a body is not in the light its outline turns away a step darker, so the contour of a pale body
    // can be followed the whole way round against pale air
    float k = smoothstep(uTurn.x, uTurn.y, dot(n, L)+.1*n.y);
    vec3 col = mix(uDove, uIvory, k*k*sqrt(k));
    float rim = 1.-abs(dot(n, V));
    col = mix(col, uDove*.9, uLimb*smoothstep(.45, 1., rim)*(1.-k*k));
    // the underside of every swelling: a step darker, with the colour of the flat (or of the tide) beneath it
    float under = 1.-smoothstep(-.8, .05, n.y);
    // (fix round 3) once the tide is in, the mirror below is as pale as the air: an underside that took a third of it melted
    // into the air when seen from below (the whole last climb), so then it takes only uUnder of it and stays a step darker
    col = mix(col, mix(ramp(-1.0472), ramp(1.0472)*mix(1., uMirror, .6), uUnderWet), mix(.34, uUnder, uUnderWet)*under)*(1.-.1*under);
    float aa = fwidth(tip)+1e-5;
    col = mix(col, accent*(.62+.38*k), smoothstep(-aa, aa, tip-dipAt));
    vec3 Hh = L+V; Hh /= max(length(Hh), 1e-4);
    float g = max(dot(n, Hh), 0.); g *= g; g *= g; g *= g; g *= g;        // ^16
    return col + uGlint*pow(g, 100.);
  }
`;function Rt(l={}){const a=l.az??1.2,t=l.len??3,r=l.cam||[0,46,275],g=374,A=l.gap??6.5,y=Math.sin(a),k=Math.cos(a),C=[],P=(h,i)=>{const f=Math.max(i-r[2],20);return[-h*g/f,r[1]*g/f]},B=(h,i,f)=>{const u=f[0]-i[0],s=f[1]-i[1],x=Math.min(1,Math.max(0,((h[0]-i[0])*u+(h[1]-i[1])*s)/Math.max(u*u+s*s,1e-6)));return Math.hypot(h[0]-i[0]-u*x,h[1]-i[1]-s*x)},v=(h,i,f)=>{for(const u of h)for(let s=0;s<i.length-1;s++)if(B(u,i[s],i[s+1])<f)return!0;return!1};function E(h,i,f){const u=[];for(let s=0;s<=8;s++){const x=s/8,m=i+k*f*x;if(m-r[2]<55)return null;u.push(P(h+y*f*x,m))}return u}function I(h,i,f,u={}){const s=E(h,i,t*f);if(!s||Math.hypot(s[8][0]-s[0][0],s[8][1]-s[0][1])<(u.minLen??l.minLen??105)||s[0][1]<(u.far??26)||s[0][1]>175||Math.abs(s[0][0])>385)return!1;let x=0;for(const b of s)Math.abs(b[0])<395&&b[1]<150&&x++;if(x<5)return!1;const m=A+(l.gapNear??.1)*s[0][1];for(const b of C)if(v(s,b.pts,Math.max(m,b.gap))||v(b.pts,s,Math.max(m,b.gap)))return!1;return C.push({pts:s,gap:m}),!0}function q(h,i,f,u){const s=E(h,i,f);s&&C.push({pts:s,gap:u})}return{tryNeedle:I,block:q,get count(){return C.length},az:a,len:t,cam:r}}function Bt(l,a={}){const t=a.palette&&a.palette.length>=7?a.palette:At,r={petrol:we(t[0]),violet:we(t[1]),opal:we(t[7]||"#DCD9D6"),apricot:we(t[2]),ivory:we(t[3]),dove:we(t[8]||"#9FA3A8"),black:we(t[4]),coral:we(t[5]),lemon:we(t[9]||"#EEDB5C"),turquoise:we(t[6])},g=a.profiles||Tt(),A=o=>{const M=[];for(let F=0;F<me;F++){let O=0;for(let T=0;T<=80;T++)O=Math.max(O,o.at(F,T/80)[0]);M.push(O*1.2)}return M},y={uTime:{value:0},uShadowAz:{value:a.shadowAz??2.1},uModelSkew:{value:.55},uModelView:{value:1},uModelLean:{value:.1},uLeanAdd:{value:0},uGroundY:{value:0},uGlint:{value:7},uShLen:{value:a.shadowLen??it},uMirror:{value:a.mirror??.94},uMirrorForm:{value:a.mirrorForm??.94},uTurn:{value:new n.Vector2(a.turn?.[0]??-.6,a.turn?.[1]??.4)},uLimb:{value:a.limb??0},uUnder:{value:a.under??.34},uUnderWet:{value:0},uFlat:{value:a.flat??.1},uDbl:{value:new n.Vector2(.3,1)},uBladeW:{value:a.bladeWidth??.6},uAirKeep:{value:a.airKeep??6.5},uAirSlim:{value:a.airSlim??.8},uAirPx:{value:a.airPx??5.5},uAirBold:{value:a.airBold??1.7},uRmax:{value:A(g)},uPeel:{value:0},uTide:{value:new n.Vector4(0,-1,-1e6,0)},uProg:{value:0},uRampC:{value:[r.petrol,r.violet,r.opal,r.apricot]},uIvory:{value:r.ivory},uDove:{value:r.dove},uBlack:{value:r.black},uShade:{value:a.shade?we(a.shade):r.black},uAccent:{value:[r.coral,r.lemon,r.turquoise]},uProf:{value:g.tex},uPix:{value:new n.Vector2(.0025,450)}},k=o=>Object.assign({},y,o),C=-.3,P=o=>Object.assign(o,{transparent:!0,depthWrite:!1,forceSinglePass:!0,blending:n.CustomBlending,blendEquation:n.AddEquation,blendSrc:n.ZeroFactor,blendDst:n.OneFactor,blendEquationAlpha:n.MinEquation,blendSrcAlpha:n.OneFactor,blendDstAlpha:n.OneFactor,userData:{shade:1}});function B(){const o=new n.BufferGeometry;o.setAttribute("position",new n.BufferAttribute(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));const M=new n.Mesh(o,new n.ShaderMaterial({uniforms:k({}),side:n.DoubleSide,transparent:!0,forceSinglePass:!0,depthTest:!1,depthWrite:!1,blending:n.CustomBlending,blendEquation:n.AddEquation,blendSrc:n.OneMinusDstAlphaFactor,blendDst:n.DstAlphaFactor,blendEquationAlpha:n.AddEquation,blendSrcAlpha:n.OneFactor,blendDstAlpha:n.ZeroFactor,vertexShader:"void main(){ gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:"precision highp float; uniform vec3 uShade; void main(){ gl_FragColor = vec4(uShade, 1.); }"}));return M.frustumCulled=!1,M.renderOrder=C+.1,M}const v=!!a.dawnDouble,E={value:new n.Vector4(0,0,1,1)},I=(o,M)=>(v&&M&&(o.defines.DAWNDBL=1,o.uniforms.uDblView=E),o);function q(o,M,F,O,T){o.getCurrentViewport(E.value).roundToZero(),T.uniformsNeedUpdate=!0}const h=o=>(o.material.defines&&o.material.defines.DAWNDBL&&(o.onBeforeRender=q),o),i=o=>{if(!v)return 0;const M=o.getAttribute("position").array;let F=-1e9;for(let O=1;O<M.length;O+=3)M[O]>F&&(F=M[O]);return F},f=`varying vec3 vN, vW, vAcc; varying float vTip, vDip;
    #ifdef DAWNDBL
      varying vec2 vDb;      // (the thirteenth round) how deep the point's true image lies under the tide, and how high the body's top stands over it
    #endif
    `,u=`
    #ifdef DAWNDBL
      ${K()}
      uniform mat4 projectionMatrix; uniform vec4 uDblView;      // (uDblView: the rectangle drawn into, in drawn pixels: its corner x, y, its breadth, its height; see atDraw())
      vec3 dblTone(){ vec2 pj = vec2(projectionMatrix[0][0], projectionMatrix[1][1]);
        vec3 v = vec3((2.*(gl_FragCoord.xy-uDblView.xy)/uDblView.zw-1.+projectionMatrix[2].xy)/pj, -1.);
        return shoreAt(normalize(v*mat3(viewMatrix))); }
    #endif
    `,s=`precision highp float; ${f} ${Me} ${_e} ${u}
    void main(){
      vec3 n = vN/max(length(vN), 1e-4), w = vW, cam = cameraPosition; float dim = 1.;
      #ifdef DAWNDBL
        vec3 tone = dblTone();      // (the thirteenth round) read before anything is thrown away: it takes fwidth
      #endif
      #ifdef MIRROR
        if (w.y > uGroundY) discard;
        vec3 d = w-cam; float k = (uGroundY-cam.y)/min(d.y, -1e-4);
        if (wetAt(cam.xz+d.xz*k) < .5) discard;
        w.y = uGroundY+(uGroundY-w.y)/dblK(); n.y = -n.y; cam.y = 2.*uGroundY-cam.y; dim = uMirrorForm;
      #endif
      vec3 col = shadeForm(n, w, cam, vTip, vDip, vAcc);
      #ifdef MIRROR
        col = mirrorInk(col, dim);        // the double keeps to the inks: it greys toward dove, it is never dimmed to mud
      #endif
      #ifdef DAWNDBL
        { float fk = dblFade(vDb.x/max(vDb.y, 1e-3)); col = fk*col+(1.-fk)*tone; }      // (the thirteenth round) K of the double's own colour, the rest the tide's tone; written solid, as below
      #endif
      gl_FragColor = vec4(col, 1.);
    }`,x=`
      vec4 w = modelMatrix*vec4(p, 1.); vec3 wn = mat3(modelMatrix)*n;
      #ifdef MIRROR
        w.y = uGroundY-(w.y-uGroundY)*dblK(); wn.y = -wn.y;
        #ifdef DAWNDBL
          w.xz += dblWave(w.xyz);
        #endif
      #endif
      vW = w.xyz; vN = wn; gl_Position = projectionMatrix*viewMatrix*w; }`;function m(o={}){return I(new n.ShaderMaterial({uniforms:k(Object.assign({uProg:o.prog||y.uProg},Array.isArray(o.whole)?{uDbl:{value:new n.Vector2(o.whole[0],o.whole[1])}}:{})),defines:Object.assign(o.mirror?{MIRROR:1}:{},o.bud?{BUD:1}:{},o.sink?{SINK:1}:{},o.whole?{WHOLE:1}:{}),side:o.mirror?n.BackSide:n.FrontSide,vertexShader:`${f} ${Me} ${Ke} uniform vec3 uAccent[3];
        void main(){ vec3 p, n; float tt = ringT(iB.y, position.y); lathe(position.x, tt, p, n);
          vTip = tt; vDip = 1.-iC.w; vAcc = iB.w < .5 ? uAccent[0] : (iB.w < 1.5 ? uAccent[1] : uAccent[2]);
          #ifdef DAWNDBL
            vDb = lDb+(modelMatrix[3].y-uGroundY);
          #endif
        ${x}`,fragmentShader:s}),o.mirror)}function b(o={}){return I(new n.ShaderMaterial({uniforms:k(Object.assign({uMeshAcc:{value:o.accent||r.coral},uMeshDip:{value:o.dip??.9}},o.lean?{uLeanAdd:{value:o.lean}}:{},v&&o.mirror?{uDblTop:{value:o.top??0}}:{})),defines:o.mirror?{MIRROR:1}:{},side:o.mirror?n.BackSide:n.FrontSide,vertexShader:`${f} ${Me} attribute float aTip, aSoft; uniform vec3 uMeshAcc; uniform float uMeshDip;
        #ifdef DAWNDBL
          uniform float uDblTop;      // (the thirteenth round) the mesh's own top over its group's ground (o.top: topY(geometry))
        #endif
        void main(){ vec3 n = normal;
          vec3 p = position + normal*aSoft*(.6*sin(position.y*.3-uTime*.8)+.4*sin(dot(position, vec3(.21,.13,.17))+uTime*.47));
          vTip = aTip; vDip = uMeshDip; vAcc = uMeshAcc;
          #ifdef DAWNDBL
            vDb = vec2((modelMatrix*vec4(p, 1.)).y, uDblTop+modelMatrix[3].y)-uGroundY;      // (a mesh's double is the true image)
          #endif
        ${x}`,fragmentShader:s}),o.mirror)}function z(o={}){return P(new n.ShaderMaterial({uniforms:k({uProg:o.prog||y.uProg}),defines:Object.assign(o.bud?{BUD:1}:{},o.pick?{PICK:1}:{}),side:n.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:`${Me} ${Ke}
        centroid varying vec4 vPen;      // the height that casts this point of the blade, where it lies across it (-1 .. 1), half its breadth there (m), the breadth of the body there (m)
        uniform float uAirKeep, uAirSlim, uAirPx, uAirBold, uRmax[${me}]; uniform vec2 uPix;
        #ifdef PICK
          attribute float iK;      // 1 = one of the few dozen needles that rule the mirror when it is seen from the air (makeRuler)
        #endif
        // a bud's shadow arrives when the bud has slid off its parent and stands on the flat
        float bladeH(){
          #ifdef BUD
            float cy = budCyc(); return iA.w*smoothstep(.57, .66, cy)*(1.-smoothstep(.93, 1., cy));
          #else
            return iA.w;
          #endif
        }
        float sGrow = 1.;         // how much of its length a needle has (it grows out from its foot when it first can be drawn)
        vec2 gpt(float t, out float r){ float bh = bladeH(); vec3 p = centre(iB.y, t, iC.z, iA.w); r = p.x*iB.z*bh;
          vec4 w = modelMatrix*vec4(iA.xyz+yawed(vec3(p.y*bh, 0., 0.), iB.x), 1.);
          return w.xz + shadowDir()*uShLen*sGrow*(w.y-uGroundY+p.z*bh); }
        void main(){ float r, r2, d = 1./${te-1}.;
          float bt = ringT(iB.y, position.x);
          float aloft = smoothstep(20., 38., cameraPosition.y-uGroundY), bh = bladeH();      // (journey round: in the climbing turn, 10-30 m up, the flat below is still ruled with every shadow) (the fourteenth round b: this float was named air, the name of G_COMMON's air(); the name alone is changed)
          // FIX ROUND 3, A NEEDLE IS A LINE OR IT IS NOTHING. Seen from near the flat a shadow is foreshortened in breadth by
          // (height of the eye over its distance) / (how much of its length the eye sees). Measured once, at the needle's
          // middle: needM = the breadth on the flat that shows as a hairline of 0.8 px a side. If that is more than capH
          // (an eighth of its length) it cannot be drawn as a line and is not drawn at all; nor is one shorter on the screen
          // than a couple of dozen pixels; from the air they go one by one (each at its own height) and only the ruled stay.
          vec3 footW = (modelMatrix*vec4(iA.xyz, 1.)).xyz; vec2 sdn = shadowDir();
          vec3 toM = vec3(footW.x+sdn.x*uShLen*bh*.6, uGroundY, footW.z+sdn.y*uShLen*bh*.6)-cameraPosition;
          float dM = max(length(toM), 1e-3), tvM = dot(vec3(sdn.x, 0., sdn.y), toM)/dM, seenM = sqrt(max(1.-tvM*tvM, 1e-4));
          float fracM = max(abs(toM.y)/dM/seenM, .02), needM = .8*uPix.x*dM/fracM, capH = .12*uShLen*bh+1e-4;
          float hsh = fract(iC.z*7.31+iA.x*.137+iA.z*.071), lenPx = uShLen*bh*seenM/max(uPix.x*dM, 1e-6);
          // (nothing pops: a needle that can no longer be drawn draws back into its foot, and grows out of it again)
          sGrow = clamp((capH/max(needM, 1e-5)-1.)*5., 0., 1.)*clamp((lenPx/(mix(22., 70., aloft)*(.75+.5*hsh))-1.)*4., 0., 1.)
            *clamp((hsh*.96+.02-aloft*1.04*(1.+dM/120.))*10., 0., 1.);     // (as the eye rises the far ones go first, so none pile up along level)
          // (journey round) NEVER A HAIRLINE BAR: a shadow whose widest swelling would show under two hairs' breadth is not drawn
          int ty = int(clamp(iB.y+.5, 0., ${me-1}.));
          float rm = max(uRmax[ty]*iB.z*bh, 1e-4), cap = .4+.03*bh;
          sGrow *= clamp((min(uBladeW*rm, cap)/max(needM, 1e-5)-2.)*2., 0., 1.);
          #ifdef PICK
            float pk = step(.5, iK), pk2 = step(1.5, iK); sGrow = mix(sGrow, 1., max(pk*aloft, pk2));      // (journey round: ruled only from the air; lower down a ruled shadow obeys the rules of the rest)
            // (polish round) iK = 2: THE SHADOW A RISER LEAVES beside the line of flight is always drawn, whole, at any height of the eye
          #endif
          vec2 g = gpt(bt, r), tg = gpt(bt+d, r2)-gpt(bt-d, r2);
          tg = length(tg) > 1e-5 ? normalize(tg) : sdn;
          vec2 nW = vec2(tg.y, -tg.x);
          vec3 toP = vec3(g.x, uGroundY, g.y)-cameraPosition; float dC = max(length(toP), 1e-3);
          // A SHADOW IS THE STRETCHED SILHOUETTE OF ITS BODY. The whole profile is scaled until its widest swelling fits the
          // needle (it is never clipped to a slab of constant width), so a crown is a curve, a waist a waist, and both ends
          // close to points. Where the silhouette would be finer than a hair it is one unbroken hairline (0.8 px a side,
          // closing over its last sixth).
          float wd = r*min(uBladeW, cap/rm)*sGrow;
          #ifdef PICK
            // and bold: the true stretched silhouette of its body, pointed at both ends; seen from low over the mirror, where a
            // true shadow is foreshortened to a hair, it is given the breadth that shows as four pixels a side at its middle
            float bLo = min(rm, .5+.09*bh);
            // (fix round 8) and clearly wider than the hair that rises from its foot: five and a half pixels a side, tapering to its point
            wd = mix(wd, r/rm*max(bLo, min(5.5*uPix.x*dM/fracM, .16*uShLen*bh)), pk2);
          #endif
          float tv = dot(vec3(tg.x, 0., tg.y), toP)/dC, frac = max(abs(toP.y)/dC/sqrt(max(1.-tv*tv, 1e-4)), .02);
          float hair = min(.8*uPix.x*dC/frac, capH)*min(1., (1.-bt)*6.);
          #ifdef PICK
            // THE RULED MIRROR, from the air: the few dozen chosen needles (iK, see makeRuler) are DRAWN BOLD as the silhouettes
            // of their bodies. So low over the mirror a true shadow is foreshortened to a hairline, so each is given the
            // breadth on the flat that shows as uAirPx pixels a side at its widest in the nearest row (less with distance,
            // never under 1.5), measured once at its middle: along its length it is a real shape lying on a real plane, it
            // narrows away from the eye and ends in a point
            float wMax = min(clamp(uAirPx*150./dM, 2.4, uAirPx)*uPix.x*dM/fracM, .2*uShLen*bh);      // (fix round 8: never under 2.4 px a side, so a far needle is still a needle beside its hair)
            wd = mix(wd, r/rm*1.2*wMax, aloft*pk*(1.-pk2));
          #endif
          wd = max(wd, hair);
          g += nW*wd*step(1e-3, sGrow)*position.y;
          vec3 P = vec3(g.x, uGroundY+.02, g.y);
          { vec3 pc = centre(iB.y, bt, iC.z, iA.w);
            vPen = vec4((modelMatrix*vec4(iA.xyz+yawed(vec3(pc.y*bh, 0., 0.), iB.x), 1.)).y-uGroundY+pc.z*bh, position.y, wd, 2.*prof(iB.y, bt).x*iB.z*iA.w); }
          // the rare event: the needle peels off the flat foot first and is drawn up its thread like a kite's tail
          vec3 rp = vec3(iC.x, iC.y, iC.z);
          float up = clamp((uProg-rp.x)/(.2+.0022*rp.y), 0., 1.)*step(.5, rp.y)*step(rp.x, 5.);
          float q = clamp((uPeel*1.9-iC.z*.75-position.x*.4)*3., 0., 1.)*up; q = q*q*(3.-2.*q);
          if (q > 0.) {
            vec3 F = (modelMatrix*vec4(iA.xyz, 1.)).xyz + riseOff(rp);
            vec2 sdv = shadowDir(); float tt = position.x, L = min(iA.w*1.3, 22.);
            vec3 side = cross(vec3(0., 1., 0.), F-cameraPosition); float sl = length(side); side = sl > 1e-3 ? side/sl : vec3(sdv.y, 0., -sdv.x);
            // (fix round 7) A TAIL IS A HAIR THAT SWELLS ONCE: never more than three and a half pixels a side wherever it hangs
            // (they were blades as wide as leaves beside the hole), and only the shadows that were drawn bold or ruled go up
            // as tails; every other needle is simply drawn up into its foot and is gone, so no thicket hangs under the colony
            float tw = min(.02*iA.w+.05, 2.6*uPix.x*max(length(F-cameraPosition), .1))*pow(max(1.-tt, 0.), .7)*(tt/(tt+.04));
            #ifdef PICK
              float tk = step(.25, iK);      // (fix round 9: iK = 0.3 = not ruled, but its shadow goes up as a tail on the rare tide)
            #else
              float tk = 0.;
            #endif
            tw *= tk; L *= tk;
            vec3 tail = F + vec3(sdv.x*.12*L*tt*tt, -L*tt, sdv.y*.12*L*tt*tt)
              + side*(tw*position.y + .04*L*tt*sin(uTime*.9+tt*5.+iC.z*30.));
            P = mix(P, tail, q);
          }
          gl_Position = projectionMatrix*viewMatrix*vec4(P, 1.); }`,fragmentShader:`precision highp float; ${$e} centroid varying vec4 vPen;
        void main(){ gl_FragColor = vec4(0., 0., 0., penLeft(vPen.x, vPen.w, vPen.z*(1.-abs(vPen.y)), vPen.z, .5*vPen.z)); }`}))}const R=`${Me} ${Ue} uniform vec2 uPix, uKeep;
    attribute vec3 tA, tB;     // the two ends at rest (local)
    attribute vec3 rA, rB;     // rise parameters of what each end is tied to: (release, hang, phase); release 9 = fixed
    attribute vec4 sAB;        // xz sway of end A and of end B with their owners' sag (metres)
    attribute vec4 tS;         // sag in metres when slack, phase, progress at which it starts to tauten, progress when taut
    vec3 tpt(float s){
      vec3 a = tA + riseOff(rA) + vec3(sAB.x, 0., sAB.y)*sin(uTime*.31+rA.z*14.);
      vec3 b = tB + riseOff(rB) + vec3(sAB.z, 0., sAB.w)*sin(uTime*.31+rB.z*14.);
      float slack = mix(1., .03, smoothstep(tS.z, tS.w, uProg))*(.6+.4*sin(uTime*.37+tS.y*20.));
      vec3 p = mix(a, b, s); p.y -= tS.x*slack*4.*s*(1.-s); return p; }
    // how much of this thread is drawn at view distance d: thread by thread they stop being drawn with distance (its own
    // distance each, from tS.y), so far rigging is a few separate hairs and never a mass; a tether (tS.z > 1.5) is let go
    // when its shadow follows its form
    float tkeep(float d){ float D = uKeep.x*exp(uKeep.y*tS.y);
      return (1.-smoothstep(D, D*1.12, d))*(1.-step(1.5, tS.z)*clamp((uPeel*1.9-(tS.y-.3)*1.07)*3., 0., 1.)); }`;function X(o={}){return new n.ShaderMaterial({uniforms:k({uProg:o.prog||y.uProg,uWidth:{value:o.width??.035},uKeep:{value:new n.Vector2(...o.keep||[150,1.5])},uFloor:{value:o.floor??.36},uCap:{value:o.cap??.62},uFine:{value:new n.Vector3(...o.fine||[60,300,.72])},uHide:o.hide||{value:0},uLine:{value:o.color||r.black}}),side:n.DoubleSide,transparent:!0,depthWrite:!1,vertexShader:`${R} uniform float uWidth, uFloor, uCap, uHide; uniform vec3 uFine; varying vec3 vS;
        void main(){ float s = position.x;
          vec3 v0 = (modelViewMatrix*vec4(tpt(s), 1.)).xyz, v1 = (modelViewMatrix*vec4(tpt(s+.02), 1.)).xyz;
          vec3 sd = cross(v1-v0, v0); sd /= max(length(sd), 1e-6);
          float px = uPix.x*max(-v0.z, .1), L = clamp(uWidth*.5/px, uFloor, uCap), G = L+.75;      // half the hair and half the ribbon, in pixels
          float keep = tkeep(length((modelViewMatrix*vec4(tpt(.5), 1.)).xyz))*(1.-uHide);
          vS = vec3(position.y*G, L, keep*mix(1., uFine.z, smoothstep(uFine.x, uFine.y, -v0.z)));
          gl_Position = projectionMatrix*vec4(v0+sd*G*px*step(.004, keep)*position.y, 1.); }`,fragmentShader:`precision highp float; uniform vec3 uLine; varying vec3 vS;
        void main(){ float c = clamp(vS.y-abs(vS.x)+.5, 0., 1.), a = (1.-(1.-c)*(1.-c)*(1.-c))*vS.z;      // (the air is several times brighter than paper white before the tone map: a hair that covers half a pixel must take most of it to read black)
          if (a < .004) discard; gl_FragColor = vec4(uLine, a); }`})}function G(o={}){return new n.ShaderMaterial({uniforms:k({uProg:o.prog||y.uProg,uBead:{value:o.radius??.16},uBeadCol:{value:o.color||r.ivory},uBeadPx:{value:o.floorPx??1.1},uBeadS:{value:o.at??-1},uKeep:{value:new n.Vector2(...o.keep||[150,1.5])},uHide:o.hide||{value:0}}),vertexShader:`${R} uniform float uBead, uBeadPx, uBeadS, uHide; attribute vec2 bP; varying vec2 vUv; varying vec3 vW;
        void main(){ float s = .5-.47*cos(3.14159*fract(bP.x+uTime*bP.y)*2.);
          if (uBeadS >= 0.) s = uBeadS;      // (fix round 8: o.at = a bead that does not slide: the knot at one end of a hair)
          vec3 c = tpt(s); vW = (modelMatrix*vec4(c, 1.)).xyz; vec3 v = (viewMatrix*vec4(vW, 1.)).xyz;
          float r = max(uBead, uBeadPx*uPix.x*max(-v.z, .1))*step(.5, tkeep(length((viewMatrix*modelMatrix*vec4(tpt(.5), 1.)).xyz)))*(1.-uHide); vUv = position.xy; v.xy += position.xy*r;
          gl_Position = projectionMatrix*vec4(v, 1.); }`,fragmentShader:`precision highp float; ${Me} ${_e} varying vec2 vUv; varying vec3 vW; uniform vec3 uBeadCol;
        void main(){ float q = dot(vUv, vUv); if (q > 1.) discard;
          vec3 n = (vec4(vUv, sqrt(max(1.-q, 0.)), 0.)*viewMatrix).xyz;
          gl_FragColor = vec4(shadeForm(n, vW, cameraPosition, 1., o_dip, uBeadCol), 1.); }`.replace("o_dip",o.color?"-1.":"2.")})}function K(){return`
        float hash(vec2 p){ vec3 q = fract(vec3(p.xyx)*.1031); q += dot(q, q.yzx+33.33); return fract((q.x+q.y)*q.z); }
        // stepTo(a, b, w, k): a moved toward b by w, but never by more than k times a's own light
        vec3 stepTo(vec3 a, vec3 b, float w, float k){ vec3 lw = vec3(.3, .6, .1); float dl = abs(dot(b-a, lw));
          return mix(a, b, w*min(1., k*dot(a, lw)/max(dl, 1e-4))); }
        vec3 shoreAt(vec3 d){
          float e = asin(clamp(d.y, -1., 1.));
          float k = max(cameraPosition.y-uGroundY, 0.)/max(-d.y, 1e-4);
          float dd = dot(cameraPosition.xz+d.xz*k, uTide.xy)-uTide.z, fw = min(fwidth(dd), 1e4);
          float below = step(d.y, -2e-4)*uTide.w;
          vec3 col = air(e);      // (the fourteenth round) the air: ramp(e) up to its top stop, 40 degrees over level, at the pale hours deeper from there to the zenith (air(), G_COMMON)
          // (polish round) NO BAND ON THE LEVEL LINE. A true mirror showed the whole gradient upside down, so the level stop,
          // a step deeper than the air above it, lay across the view as a soft dark band with pale air above AND below: a
          // horizon. The tide shows the air only a quarter as high as it is (it is a film of water, not glass): from level
          // down it holds the level tone and deepens a little, so the picture is still ONE gradient from top to bottom
          // (ground round) THE FLAT IS A WET TIDAL FLAT, drawn here in the gradient's own inks: bars of drying sand (the flat's
          // tone a step toward the level tone) lying along the tide's edge, a darker wet margin where each bar goes under,
          // sheets and pools of standing water that show the air (the same film the tide is), a bright rim round every
          // pool, long ripple lines that follow the edges, shells and worm casts near the eye. Every part of it goes to the
          // one level tone as the ray comes up to level and each scale is left out where it is too fine to draw, so there is
          // still nothing to see where ground and air meet.
          vec2 gp = cameraPosition.xz+d.xz*k, gq = shoreQ(gp), fq = min(fwidth(gq), vec2(1e4));
          float grd = step(d.y, -2e-4), tide = below*(1.-smoothstep(-fw*.5-.02, fw*.5+.02, dd));
          vec3 fd = 1.-smoothstep(.22, .75, vec3(max(fq.x*FQ0.x, fq.y*FQ0.y), max(fq.x*FQ1.x, fq.y*FQ1.y), max(fq.x*FQ2.x, fq.y*FQ2.y)));
          // (fix round 7) SEEN FROM THE AIR THE FLAT IS CALM: the two finer scales of bar are left out as the eye rises (from 40 m
          // they were a blotched camouflage), so the mirror under the reveal is two broad tones and a fine rim
          float hEye = cameraPosition.y-uGroundY;
          fd.z *= 1.-smoothstep(7., 18., hEye); fd.y *= 1.-.9*smoothstep(12., 30., hEye);
          float h = flatH(gp, fd), fh = min(fwidth(h), 10.)+1e-4, seen = max(fd.x, max(fd.y, fd.z));
          float water = (1.-smoothstep(-.03-fh, -.03+fh, h))*seen, dry = smoothstep(.0, .075, h)*seen;
          // (the tones part from the level tone only below three degrees under level, so ground and air still meet in one tone)
          float ge = smoothstep(0., .055, -e);
          vec3 base = ramp(e), lvl = ramp(0.), sky = mix(lvl, uRampC[3], .8);
          vec3 mir = mix(ramp(-e*.25)*mirrorK(e), sky*mix(1., uMirror, .5), .5*ge);
          vec3 sandWet = mix(base, uRampC[1]*.8, .45*ge*seen), sandDry = mix(mix(base, uRampC[1], .25*ge), mix(lvl, uRampC[3], .45), .34*ge*seen);
          vec3 land = mix(sandWet, sandDry, dry);
          // drawn ripple marks on the sand and long ripple lines on the water: contours of the same height, so they follow the edges
          float rc = (gq.y+9.*fnoise(gq*vec2(.006, .03)+2.)+3.5*h)/5.5, rw = min(fwidth(rc), 10.)+1e-4, rl = abs(fract(rc)-.5)*2.;
          float rip = (1.-smoothstep(.3, 2.2, (1.-rl)/rw*.5))*(1.-smoothstep(.2, .55, rw))*fd.z;
          rip *= smoothstep(.3, .55, fnoise(gq*vec2(.045, .35)+9.));      // (drawn marks, a few strides long each: never a ruled line)
          // (fix round 7) NO FIELD OF SCRIBBLES: a drawn mark is one small step paler than the tone it lies on (stepTo: never more
          // than a part of that tone's own light, so on the plum flat of night it is next to nothing), and none is drawn once
          // the eye is off the flat
          rip *= 1.-smoothstep(6., 14., hEye);
          land = stepTo(land, mix(lvl, uRampC[3], .7), .55*rip*dry*ge, .8);
          land = mix(land, mix(base, uRampC[1]*.7, ge), .35*rip*(1.-dry));
          vec3 pale = mix(mir, mix(sky, uIvory, .3), .6);      // (the lines on the water are a step paler than the air of the hour, never white on a night flat)
          vec3 pool = stepTo(mix(mir, sky, .45*ge), pale, .35*rip*smoothstep(-.3, -.06, h), .8);
          // the bright rim of a pool, a hair of ivory where the water meets the sand
          float rim = (1.-smoothstep(.6, 1.8, abs(h+.03)/fh))*(1.-smoothstep(.02, .09, fh))*seen;
          vec3 flat0 = mix(land, pool, water);
          flat0 = stepTo(flat0, mix(sky, uIvory, .5), .7*rim*(1.-tide), 1.6);
          // shells and worm casts: one small mark in every other stride of sand nearK the eye
          { vec2 cg = gp/1.7, ci = floor(cg), cf = fract(cg)-.5; float hs = fhash(ci+17.), hk = fhash(ci+71.);
            vec2 o = (vec2(fhash(ci+3.), fhash(ci+9.))-.5)*.6; float sz = (.05+.06*hk)/1.7, pxs = max(fq.x, fq.y)/1.7+1e-4;
            vec2 v = cf-o; float ca = cos(hk*6.28), sa = sin(hk*6.28); v = vec2(ca*v.x+sa*v.y, -sa*v.x+ca*v.y); v.y *= 1.7;
            float rr = length(v), nearK = (1.-smoothstep(.25, .6, pxs/max(sz, 1e-4)))*step(hs, .55)*dry;
            float shell = 1.-smoothstep(sz-pxs, sz+pxs, rr), coil = shell*smoothstep(sz*.35-pxs, sz*.35+pxs, rr);
            flat0 = mix(flat0, hs < .3 ? uIvory*.95 : sandWet*.6, nearK*(hs < .3 ? shell : coil)*(1.-.5*tide)); }
          // under the tide the bars are still there, a hand's depth down: the mirror keeps two tones going back
          // (fix round 7: and they show further back, to within a degree and a half of level, so from the float the tide is
          // two tones in bands and not one flat sheet)
          // (fix round 9) TWO CLEAR TONES AND NO DRAWN LINE: a bar under the tide is one flat second tone with a clean edge (it faded
          // in so softly that the mirror near the eye was one bare sheet), and the pale contour lines that were drawn on the water
          // are gone (on the night mirror they were a texture). (Round rings on the tide: the one pale line on the water now is
          // the ring of a falling drop, below, near the eye that skims it.)
          // The bars are drawn as broad bands that lie along the tide's edge, one every 34 m, each with its own wandering edge:
          // wherever the eye is there are two tones going back, none on the level line
          float bq = gq.y/34.+1.7*fnoise(gq*vec2(.011, .028)+7.3)+.45*h, bw = min(fwidth(bq), 10.)+1e-4;
          float bar = smoothstep(.5-bw, .5+bw, abs(fract(bq)-.5)*2.)*(1.-smoothstep(.14, .45, bw));
          // (the bands are for the eye that skims the mirror; as it climbs they go, and from the air the mirror is the two broad calm
          // tones of the great bars alone)
          bar = max(bar*(1.-smoothstep(8., 26., hEye)), smoothstep(.0, .1, h)*seen*smoothstep(8., 26., hEye));
          vec3 tided = mix(mir, mix(mir, uRampC[1], .45), bar*smoothstep(.004, .03, -e));
          // (round rings on the tide) THE BARE TIDE READS AS WATER, FOR THE EYE THAT SKIMS IT. The film of water is still, and a
          // drop falls on it now and then: one place in every thirty metres square of the flat, each with its own beat of five
          // to eight seconds, sends three thin rings out at walking pace (1.1 m a second, 1.7 m apart, to nine metres at
          // most); each ring comes up over its first half metre and all three fade from half the drop's life on. They are
          // drawn here, on the tide alone and under every double and every shadow (those are drawn after the backdrop, so no
          // double is touched; the thirteenth round: at dawn a double's colour goes toward this very tone by its depth, so
          // there a ring shows in a double by one less its K), in the tone and by the limit of a pool's bright rim (stepTo 1.6: on a night flat a ring adds
          // at most 1.6 times the tide's own light). A ring is left out, every arc of it alike, where one pixel covers more
          // of the flat than a third of a metre to 1.1 m in any direction (pf: so none is drawn far off, none near the level
          // line), and as the eye climbs off the flat, by the bands' own figures (whole to 8 m, none from 26 m: later than the
          // drawn marks of the land, which go from 6 to 14 m): from the air the mirror stays calm, as fix round 7 has it. A
          // place of the flat and the world's clock: no seed, no position on the route.
          { vec2 cg = gp/30., ci = floor(cg); float h1 = fhash(ci+31.), h2 = fhash(ci+57.), h3 = fhash(ci+83.);
            vec2 cc = (ci+.5+(vec2(h1, h2)-.5)*.3)*30.;      // (the drop falls in the middle three tenths of its square, so no ring reaches a square's edge)
            float per = mix(5., 8., h3), ph = fract(uTime/per+h1*7.3), age = ph*per, pf = max(fq.x, fq.y);
            // (the line's breadth and skirt are a pixel's reach along the ring's radius, and never more than the pixel's whole
            // footprint on the flat, fp: at a square's edge the drop measured from changes, the radius jumps with it, and a
            // breadth taken from that jump drew the squares' edges as dotted pale lines)
            vec2 fp = min(fwidth(gp), vec2(1e4)); float rr = length(gp-cc), fr = min(min(fwidth(rr), 10.), fp.x+fp.y)+1e-4, lw = .09+.5*fr;
            float r0 = 1.1*age, r1 = r0-1.7, r2 = r0-3.4;
            float ring = (1.-smoothstep(lw, lw+fr, abs(rr-r0)))*smoothstep(.2, .7, r0)
              +.7*(1.-smoothstep(lw, lw+fr, abs(rr-r1)))*smoothstep(.2, .7, r1)+.45*(1.-smoothstep(lw, lw+fr, abs(rr-r2)))*smoothstep(.2, .7, r2);
            ring *= (1.-smoothstep(.5, 1., ph))*(1.-smoothstep(.3, 1.1, pf))*(1.-smoothstep(8., 26., hEye));
            tided = stepTo(tided, mix(sky, uIvory, .5), min(ring, 1.), 1.6); }
          // (fix round 8) THE GROUND UNDER THE FORMS IS THE GRADIENT'S OWN SMOKE VIOLET until the tide comes: of the wet flat only a
          // breath is drawn (uFlat), so the ivory bodies and their black needles stand on a deep ground
          col = mix(col, mix(mix(base, flat0, uFlat), tided, tide), grd);
          // (fix round 3) the front is a hairline of light seen only near the eye: one pixel, thinning as it goes, and gone
          // before the ray comes within five degrees of level, so it never draws a line across the view where a horizon would be
          float hw = max(.04, .6*fw);
          col = mix(col, vec3(1.6), below*clamp((hw-abs(dd))/max(fw, 1e-4)+.5, 0., 1.)*smoothstep(.09, .22, -e));
          return col*(1.+(hash(gl_FragCoord.xy)-.5)*.008); }`}function w(){return new n.ShaderMaterial({uniforms:k({}),side:n.BackSide,depthWrite:!1,depthTest:!1,vertexShader:`varying vec3 vDir;
        void main(){ vDir = position; vec4 p = projectionMatrix*viewMatrix*vec4(cameraPosition+position*400., 1.);
          if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fragmentShader:`precision highp float; ${Me} ${K()} varying vec3 vDir;
        void main(){ gl_FragColor = vec4(shoreAt(vDir/max(length(vDir), 1e-4)), 1.); }`})}function S(o={}){return P(new n.ShaderMaterial({uniforms:k({uFootY:{value:o.footY??0},uAxis:{value:o.axis||new n.Vector3},uSlim:{value:o.airSlim??1},uSlimAll:{value:o.slim??1}}),side:n.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:`${Me} uniform float uFootY, uSlim, uSlimAll; uniform vec3 uAxis; attribute vec3 aS0, aS1; centroid varying vec3 vPen;
        void main(){ vec4 w = modelMatrix*vec4(position, 1.); vec2 sd = shadowDir(), g = w.xz+sd*uShLen*(w.y-uFootY);
          // HOW FAR INSIDE THE OUTLINE (for the soft edge). ll = the way the light goes, in the mesh's own frame; c = how the
          // surface faces it (0 on the line of the body that casts the outline); kap = how fast the surface curves along the
          // light there (shadeCurv). A point of the surface where the normal has turned c from that line lands about
          // c*c/(2 kap) from the outline, times the stretch of the flattening across the outline (sig): metres on the flat,
          // found at the vertex and carried across the triangle (vPen.y). vPen.x = the height that casts this point;
          // vPen.z = the limb's breadth there, 2 over the sum of its two curvatures in metres (carried no broader than 4 m:
          // penB is 1 from PEN.b1 up)
          vec3 ll = normalize(vec3(sd.x*uShLen, -1., sd.y*uShLen))*mat3(modelMatrix), nW = mat3(modelMatrix)*normal;
          float c = dot(normal, ll), kap = dot(ll, aS0*ll+aS1*ll.yzx+aS1.zxy*ll.zxy)/max(1.-c*c, 1e-3), sig = length(nW.xz+sd*uShLen*nW.y);
          vPen = vec3(w.y-uFootY, min(sig*c*c/(2.*max(abs(kap), 1e-4)), 500.), min(2.*length(modelMatrix[0].xyz)/max(abs(aS0.x+aS0.y+aS0.z), 1e-4), 4.));
          // (fix round 2) seen from the air a great shadow is drawn as the boldest of the ruled needles: it closes toward the
          // line through its own foot (o.axis, local) to o.airSlim of its breadth
          vec2 a0 = (modelMatrix*vec4(uAxis, 1.)).xz, pp = vec2(sd.y, -sd.x);
          g -= pp*dot(g-a0, pp)*(1.-uSlimAll);        // (journey round) o.slim: a great body's shadow is a slim stretched silhouette at any height
          g -= pp*dot(g-a0, pp)*(1.-uSlim)*smoothstep(6., 30., cameraPosition.y-uGroundY);
          gl_Position = projectionMatrix*viewMatrix*vec4(g.x, uGroundY+.02, g.y, 1.); }`,fragmentShader:`precision highp float; ${$e} centroid varying vec3 vPen;
        void main(){ gl_FragColor = vec4(0., 0., 0., penLeft(vPen.x, vPen.z, vPen.y, .5*vPen.z, 1e3)); }`}))}function V(o,M){const F=new n.Mesh(Et(o),S(M));return F.renderOrder=C,F.frustumCulled=!1,F}function _(o,M){const F=new Float32Array((o+1)*(M+1)*3),O=[];for(let N=0;N<=M;N++)for(let D=0;D<=o;D++){const ne=(N*(o+1)+D)*3;F[ne]=D/o,F[ne+1]=N/M}for(let N=0;N<M;N++)for(let D=0;D<o;D++){const ne=N*(o+1)+D,ie=ne+1,le=ne+o+1,Re=le+1;O.push(ne,le,ie,ie,le,Re)}const T=new n.BufferGeometry;return T.setAttribute("position",new n.BufferAttribute(F,3)),T.setIndex(O),T}function $(o){const M=new Float32Array((o+1)*2*3),F=[];for(let T=0;T<=o;T++)M[T*6]=M[T*6+3]=T/o,M[T*6+1]=-1,M[T*6+4]=1;for(let T=0;T<o;T++){const N=T*2;F.push(N,N+1,N+2,N+1,N+3,N+2)}const O=new n.BufferGeometry;return O.setAttribute("position",new n.BufferAttribute(M,3)),O.setIndex(F),O}const J=()=>{const o=new n.BufferGeometry;return o.setAttribute("position",new n.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,-1,1,0,1,1,0]),3)),o.setIndex([0,1,2,1,3,2]),o};function he(o,M,F,O){const T=new n.InstancedBufferGeometry;T.index=o.index,T.setAttribute("position",o.getAttribute("position"));for(const D in O)T.setAttribute(D,new n.InstancedBufferAttribute(O[D][0],O[D][1]));T.instanceCount=F,T.boundingSphere=new n.Sphere(new n.Vector3,1e5);const N=new n.Mesh(T,M);return N.frustumCulled=!1,M.userData.shade&&(N.renderOrder=C),h(N)}function oe(o){const M=o.length,F=new Float32Array(M*4),O=new Float32Array(M*4),T=new Float32Array(M*4),N=new Float32Array(M*3);return o.forEach((D,ne)=>{D.sway&&N.set(D.sway,ne*3),F.set([D.x,D.y,D.z,D.H],ne*4),O.set([D.yaw,D.type,D.fat,D.accent],ne*4),T.set([D.rel,D.hang,D.phase,D.dip],ne*4)}),{iA:[F,4],iB:[O,4],iC:[T,4],iD:[N,3]}}function ce(o,M){const[,F,O]=g.at(o.type,M),T=Math.cos(o.yaw),N=Math.sin(o.yaw),D=M*M*(.03+.02*n.MathUtils.smoothstep(o.H,4,25))*o.H;return{p:[o.x+T*F*o.H,o.y+O*o.H,o.z-N*F*o.H],sway:[T*D,-N*D],rise:[o.rel,o.hang,o.phase]}}function be(o){const M=o.length,F=new Float32Array(M*3),O=new Float32Array(M*3),T=new Float32Array(M*3),N=new Float32Array(M*3),D=new Float32Array(M*4),ne=new Float32Array(M*4);return o.forEach((ie,le)=>{F.set(ie.a.p,le*3),O.set(ie.b.p,le*3),T.set(ie.a.rise||[9,0,0],le*3),N.set(ie.b.rise||[9,0,0],le*3),D.set([...ie.a.sway||[0,0],...ie.b.sway||[0,0]],le*4),ne.set([ie.sag,ie.phase,ie.t0,ie.t1],le*4)}),{tA:[F,3],tB:[O,3],rA:[T,3],rB:[N,3],sAB:[D,4],tS:[ne,4]}}function ye(){const o=new n.Mesh(new n.IcosahedronGeometry(1,3),w());return o.frustumCulled=!1,o.renderOrder=-.9,o.add(B()),o}const re=new n.Vector2;function ae(o,M,F){if(y.uTime.value=M,F&&l.renderer){l.renderer.getDrawingBufferSize(re);const O=Math.max(re.y,1);y.uPix.value.set(2/(Math.max(F.projectionMatrix.elements[5],.001)*O),O)}}return{glsl:{G_COMMON:Me,G_RISE:Ue,G_LATHE:Ke,G_SHADE:_e,G_PEN:$e,V_OUT:f,V_TAIL:x,F_FORM:s,F_TONE:u,G_THREAD:R,PN:te,PTYPES:me},U:k,palette:r,uniforms:y,profiles:g,formMaterial:m,meshMaterial:b,meshShadowMaterial:S,meshShadow:V,laid:P,SHADE_ORDER:C,bladeMaterial:z,threadMaterial:X,beadMaterial:G,backdropMaterial:w,asDouble:I,atDraw:h,topY:i,makeBackdrop:ye,gridGeometry:_,stripGeometry:$,quadGeometry:J,instanced:he,formAttrs:oe,threadAttrs:be,pointOn:ce,bodySample:Le,update:ae,dispose(){g.tex.dispose()},SHADOW_LEN:it,MIRROR_ORDER:-.5}}const Ft=Math.PI/180,Te=50*Ft,fe=new n.Vector3(0,118,-15),ze=7.5,Pe=new n.Vector3(0,Math.sin(Te),-Math.cos(Te)),xe=new n.Vector3(0,Math.cos(Te),Math.sin(Te));function je(l,a,t,r,g){const A=new n.Vector3(1,0,0),y=[],k=[],C=[],P=[],B=w=>{const S=.5+.5*Math.cos(w),V=Math.atan2(Math.sin(w-l.swellAt),Math.cos(w-l.swellAt));return 2+3.6*Math.pow(S,1.5)+l.swell*Math.exp(-V*V/.18)},v=new n.Vector3,E=new n.Vector3;for(let w=0;w<a;w++){const S=w/a*ee,V=B(S);v.copy(xe).multiplyScalar(-Math.cos(S)).addScaledVector(A,Math.sin(S));for(let _=0;_<t;_++){const $=_/t*ee;E.copy(fe).addScaledVector(v,ze+V+V*Math.cos($)).addScaledVector(Pe,V*Math.sin($)*.92),y.push(E.x,E.y,E.z),k.push(0),C.push(.18)}}for(let w=0;w<a;w++)for(let S=0;S<t;S++){const V=w*t+S,_=(w+1)%a*t+S,$=w*t+(S+1)%t,J=(w+1)%a*t+(S+1)%t;P.push(V,$,_,$,J,_)}const I=B(0),q=y.length/3,h=fe.y+xe.y*(ze+2*B(Math.PI)),i=h-58,f=new n.Vector3().copy(fe).addScaledVector(xe,-(ze+I+1.6)),u=[],s=.25;let x=0;for(;f.y>i&&x<80;){const w=n.MathUtils.smoothstep(x,2,20),S=Te*(1-w);u.push([f.y,f.z,S]),f.y-=Math.cos(S)*s,f.z-=Math.sin(S)*s,x+=s}const m=x,b=w=>(1.25+3.1*Math.exp(-((w/.2)**2))+4.1*Math.exp(-(((w-.7)/.165)**2)))*Math.pow(Math.min(1,(1-w)/.13),.72);for(let w=0;w<=g;w++){const S=Math.pow(w/g,.9),V=u[Math.min(u.length-1,Math.round(S*(u.length-1)))],_=V[2],$=w===g?0:b(S);for(let J=0;J<r;J++){const he=J/r*ee,oe=Math.cos(he)*$,ce=Math.sin(he)*$;y.push(oe,V[0]+ce*Math.sin(_),V[1]-ce*Math.cos(_)),k.push(S),C.push(.18+.4*n.MathUtils.smoothstep(S,.12,.4)*(1-n.MathUtils.smoothstep(S,.85,1)))}}for(let w=0;w<g;w++)for(let S=0;S<r;S++){const V=q+w*r+S,_=q+(w+1)*r+S,$=q+w*r+(S+1)%r,J=q+(w+1)*r+(S+1)%r;P.push(V,_,$,$,_,J)}const z=new n.BufferGeometry;z.setAttribute("position",new n.Float32BufferAttribute(y,3)),z.setAttribute("aTip",new n.Float32BufferAttribute(k,1)),z.setAttribute("aSoft",new n.Float32BufferAttribute(C,1)),z.setIndex(P),z.computeVertexNormals();const R=z.getAttribute("normal"),X=new n.Vector3,G=new n.Vector3,K=new n.Vector3;for(let w=q;w<y.length/3;w++){E.fromArray(y,w*3),K.copy(E).sub(fe);const S=Math.atan2(K.x,-K.dot(xe)),V=B(S);v.copy(xe).multiplyScalar(-Math.cos(S)).addScaledVector(A,Math.sin(S)),G.copy(E).sub(fe).addScaledVector(v,-(ze+V));const _=G.length()-V,$=1-n.MathUtils.smoothstep(_,.3,7);X.fromBufferAttribute(R,w).lerp(G.normalize(),$).normalize(),R.setXYZ(w,X.x,X.y,X.z)}return z.userData={tipPoint:new n.Vector3(0,f.y,f.z),yTop:h,Ld:m,rt:B,dropTop:new n.Vector3().copy(fe).addScaledVector(xe,-(ze+I))},z}const pe=[[0,0,200],[0,43,138],[0,72,23.6],[0,118,-15]];function Ot(l,a,t){let r=1e9;for(let g=0;g<pe.length-1;g++){const A=pe[g],y=pe[g+1],k=y[0]-A[0],C=y[1]-A[1],P=y[2]-A[2],B=Math.min(1,Math.max(0,((l-A[0])*k+(a-A[1])*C+(t-A[2])*P)/(k*k+C*C+P*P)));r=Math.min(r,Math.hypot(l-A[0]-k*B,a-A[1]-C*B,t-A[2]-P*B))}return r}async function It(l,a={}){const t=a.style||Bt(l,a),r=l.rng,g=t.profiles,A=Math.min(1,Math.max(.5,a.detail??l.quality?.detail??1)),y={value:0},k=new n.Group,C=n.MathUtils.smoothstep,P=n.MathUtils.lerp,B=[];for(let e=0;e<me;e++){let d=0;for(let c=0;c<=40;c++){const[p,L]=g.at(e,c/40);d=Math.max(d,Math.abs(L)+p)}B.push(d)}const v=[];for(let e=0;e<me;e++)v.push(r.range(.4,1.6));const E=e=>{let d=0;for(const p of e)d+=v[p];let c=r()*d;for(const p of e)if(c-=v[p],c<=0)return p;return e[0]},I=r.int(0,2),q=8+r.range(0,1.5),h=r.range(0,ee),i=9,f=()=>r.chance(.5)?I:r.int(0,2),u=[],s=[],x=(e,d)=>{const c=Math.hypot(e.x,e.z+8),p=Math.pow(Math.sin(Math.PI*Math.min(1,c/60)),.8);let L=15+Math.max(0,86-d)*p*r.range(.7,1);return Math.abs(e.x)<18&&e.z<2&&e.z>-48&&(L=Math.max(8,Math.min(L,58-d))),L},m=e=>{for(const d of s)if(Math.hypot(d.x-e.x,d.z-e.z)<(d.w+e.w)*.92+.15)return!0;return!1},b=(e,d)=>{const c=Math.hypot(e*.9,d+15)/60,p=d>-24&&Math.abs(e)<20?.2:0;return Math.pow(Math.max(0,Math.min(1,1-c+p)),1.15)};for(let e=0;e<i;e++){const d=12.5+e*5.25;let c=h+e*.71,p=0;const L=c+ee;for(;c<L;){const H=d+r.range(-1.6,1.6),Q=r.range(.4,2.2+e*.25),Z=r()<A||e<5;c+=(p*1.1+Q)/H;const Y=Math.sin(c)*H,j=Math.cos(c)*H,W=Math.min(40,Math.max(2,P(2.6,36,b(Y,j))*r.range(.62,1.22))),U=E(W>=14?[1,2,3,4,5,6]:W>=5?[1,2,3,4,5,6,7,8,0]:[0,6,5,7,8,3,2,0]),se=r.range(.85,1.2)*(W>18?.9:1)*(U===0?W>6?.6:.9:1)*(U>=7?.85:1),Ee=B[U]*W*se,ve={x:Y,y:0,z:j,H:W,yaw:r.range(0,ee),type:U,fat:se,accent:f(),rel:0,hang:0,phase:r(),dip:r.range(.04,.11)*(U===7||U===8?.6:1)*Ve[U],w:Ee,kids:0,top:W};c+=Ee*1.1/H,p=0,!(ve.z>-24&&Math.abs(ve.x)-Ee<q||!Z||m(ve)||W<9&&ve.phase<.66)&&(ve.rel=.5*(1-Math.min(1,Math.hypot(ve.x,ve.z)/56))+r.range(0,.06),u.push(ve),s.push(ve))}await l.yield()}for(let e=0,d=Math.round(105*A);e<900&&s.length<d;e++){const c=57*Math.sqrt(r()),p=r.range(0,ee),L=2+5*Math.pow(r(),2.2),H=E([0,6,5,7,8,3,2,4,1]),Q=r.range(.9,1.3)*(H===0?.85:1),Z=B[H]*L*Q,Y={x:Math.sin(p)*c,y:0,z:Math.cos(p)*c,H:L,yaw:r.range(0,ee),type:H,fat:Q,accent:f(),rel:0,hang:0,phase:r(),dip:r.range(.05,.13)*(H>=7?.6:1)*Ve[H],w:Z,kids:0,top:L};Y.z>-24&&Math.abs(Y.x)-Z<q||m(Y)||(Y.rel=.5*(1-Math.min(1,c/56))+r.range(0,.06),u.push(Y),s.push(Y),e%100===99&&await l.yield())}const z=s.filter(e=>e.H>=4.5&&e.type!==5),R=Math.round(34*A);for(let e=0,d=0;e<400&&d<R&&z.length;e++){let c=r.pick(z);const p=r.pick(z),L=r.chance(.3);c.kids>0&&p.kids===0&&(c=p);const H=L&&c.kid&&c.kid.H>=4&&c.kid.type<5&&!c.kid.kid?c.kid:c,Q=H.type>=7,Z=t.pointOn(H,Q?.5:1),Y=Math.max(1.6,H.H*r.range(.2,.46)),j=E(Y>6?[0,1,2,3,6]:[0,0,2,6,3,8]),W=r.range(.8,1.15)*(j===0&&Y>5?.75:1),U=Q?g.at(H.type,.5)[0]*H.H*H.fat:0,se={x:Z.p[0],y:Z.p[1]+U,z:Z.p[2],H:Y,yaw:r.range(0,ee),type:j,fat:W,accent:f(),rel:c.rel,hang:0,phase:c.phase,dip:r.range(.05,.14)*Ve[j],w:B[j]*Y*W,kids:0,top:0,sway:H===c?[Z.sway[0],Z.sway[1],c.phase]:c.kidSway||[0,0,0],parent:c};H.kid||(H.kid=se,H===c&&(c.kidSway=se.sway),c.kids++,c.top=Math.max(c.top,se.y+Y),u.push(se),d++)}for(const e of s)e.hang=x(e,e.top);s.filter(e=>e.H>=12).sort((e,d)=>d.H-e.H).forEach((e,d)=>{e.dip=(d<14?.26:.16)*(e.type>=7?.6:1),d<14&&(e.accent=d%3,e.cap=!0,e.fat*=1.22)});for(const e of u)e.parent&&(e.hang=e.parent.hang);for(let e=0;e<6;e++){const d=e%2?1:-1,c=e>>1,p=[3,0,6,2,0,4][e],L=8+.7*c+.5*(e%2),H=p===0?.62:p===2?1.25:.9,Q=d*[10.2,10.6,9.9][c],Z=[8.6,10.2,11.8][c]+.5*(e%2),Y=[-3.6,.7,4.3][c]+.6*(e%2),j=new n.Vector3().copy(fe).addScaledVector(Pe,-Z).addScaledVector(xe,Y),W={x:Q,y:0,z:j.z,H:L,yaw:e*1.7+h,type:p,fat:H,accent:(I+e)%3,rel:.38+.012*e,hang:j.y-L*.5,phase:(e*.618+.21)%1,dip:.26,w:B[p]*L*H,kids:0,top:L,escort:!0};for(let U=s.length-1;U>=0;U--){const se=s[U];se.escort||se.kids>0||Math.hypot(se.x-W.x,se.z-W.z)>=(se.w+W.w)*.92+.15||(s.splice(U,1),u.splice(u.indexOf(se),1))}u.push(W),s.push(W)}[[165,215,26,12,6,.9,.62],[480,220,28,13.5,3,.9,.6],[520,185,44,15,4,.9,.58]].forEach(([e,d,c,p,L,H,Q],Z)=>{const Y=new n.Vector3().copy(fe).addScaledVector(Pe,c-38).addScaledVector(xe,(180-d)*c/300),j={x:(e-320)*c/300,y:0,z:Y.z,H:p,yaw:Z*2.3+h,type:L,fat:H,accent:(I+Z+1)%3,rel:Q,hang:Y.y-p*.5,phase:(Z*.618+.47)%1,dip:.26,w:B[L]*p*H,kids:0,top:p,escort:!0};for(let W=s.length-1;W>=0;W--){const U=s[W];U.escort||U.kids>0||Math.hypot(U.x-j.x,U.z-j.z)>=(U.w+j.w)*.92+.15||(s.splice(W,1),u.splice(u.indexOf(U),1))}u.push(j),s.push(j)}),await l.yield(),a.adjust&&a.adjust(u);const X=a.ruler||Rt();{const e=s.filter(c=>c.H>=9).sort((c,p)=>p.H-c.H);let d=0;for(const c of e){if(d>=(a.ruledMax??14))break;X.tryNeedle(-c.x,400-c.z,c.H)&&(c.ruled=!0,d++)}}const G={swellAt:r.sign()*r.range(1.5,2.5),swell:r.range(.5,1.3)},K=je(G,96,28,28,40),w=K.userData;await l.yield();const S=je(G,64,16,16,24);await l.yield();const V=je(G,48,8,12,16);await l.yield();const _=new n.Mesh(K,t.meshMaterial({accent:t.palette.coral,dip:.5})),$=t.atDraw(new n.Mesh(S,t.meshMaterial({accent:t.palette.coral,dip:.5,mirror:!0,top:t.topY(S)}))),J=t.meshShadow(V,{footY:w.tipPoint.y,axis:w.tipPoint,airSlim:.3});$.renderOrder=t.MIRROR_ORDER;for(const e of[_,$,J])e.frustumCulled=!1,k.add(e);const he=new n.Vector3(1,0,0),oe=new n.Vector3,ce=new n.Vector3,be=e=>{const d=Math.max(-1,Math.min(1,e/38))*1.9+r.range(-.25,.25),c=w.rt(d);return ce.copy(xe).multiplyScalar(-Math.cos(d)).addScaledVector(he,Math.sin(d)),oe.copy(fe).addScaledVector(ce,ze+c*1.85).addScaledVector(Pe,-c*.3),{p:[oe.x,oe.y,oe.z]}},ye=(e,d)=>{for(let c=0;c<2;c++)for(let p=0;p<=8;p++){const L=p/8,H=c*(e.rise?e.rise[1]:0),Q=c*(d.rise?d.rise[1]:0);if(Ot(P(e.p[0],d.p[0],L),P(e.p[1]+H,d.p[1]+Q,L),P(e.p[2],d.p[2],L))<5)return!1}return!0},re=e=>e.kid?e.kid.kid||e.kid:e,ae=e=>{const d=re(e);return t.pointOn(d,d.type>=7?.5:1)},o=[],M=(e,d)=>Math.hypot(e.p[0]-d.p[0],e.p[1]-d.p[1],e.p[2]-d.p[2]),F=e=>.2+.0022*e.hang;let O=0;const T=[];for(const e of s){++O%80===0&&await l.yield();const d=e.H>=9&&r.chance(.45),c=ae(e),p=be(e.x),L=r(),H=r.chance(.5);!e.cap||!ye(c,p)||T.push({a:c,b:p,sag:M(c,p)*.05,phase:L,t0:e.rel+.03,t1:e.rel+F(e),acc:T.length%2})}await l.yield();for(let e=0;e<s.length;e++){e%40===39&&await l.yield();const d=s[e];let c=null,p=16;for(let j=0;j<s.length;j++){const W=s[j];if(W===d)continue;const U=Math.hypot(W.x-d.x,W.z-d.z);U<p&&U>2&&(j>e||U>7)&&(p=U,c=W)}const L=r.chance(.5),H=r.chance(.5);if(!c||!H||d.phase>.16||Math.abs(d.hang-c.hang)>6)continue;const Q=ae(d),Z=L?ae(c):t.pointOn(c,c.type>=7?.25:.45);if(!ye(Q,Z))continue;const Y=Math.max(d.rel,c.rel)+.05;o.push({a:Q,b:Z,sag:M(Q,Z)*.09,phase:r(),t0:Y,t1:Y+.25,bead:r.chance(.45)}),e%60===0&&await l.yield()}const N=o.length;for(const e of s){const d=r.chance(.3);e.cap&&o.push({a:t.pointOn(e,0),b:{p:[e.x,0,e.z]},sag:0,phase:e.ruled?.97:.3+.7*e.phase,t0:2,t1:3})}o.push({a:{p:w.tipPoint.toArray()},b:{p:[w.tipPoint.x,0,w.tipPoint.z]},sag:0,phase:1.3,t0:1.2,t1:1.3}),await l.yield();const D=e=>{const d=[75.5,118,60.2],c=e*253.7;let p=0,L=c;for(;p<2&&L>d[p];)L-=d[p],p++;const H=Math.min(1,L/d[p]);return[0,P(pe[p][1],pe[p+1][1],H),P(pe[p][2],pe[p+1][2],H),pe[p+1][1]-pe[p][1],pe[p+1][2]-pe[p][2]]},ne=[];for(let e=0;e<=28;e++)ne.push(D(e/28));for(let e=0;e<u.length;e++){const d=u[e],c=d.parent||d;let p=0;e%120===119&&await l.yield();for(let L=0;L<=28;L++){const H=L/28,Q=ne[L],Z=.45+.55*H,Y=Math.min(1,Math.max(0,(Z-.5)/.4));let j=Math.min(1,Math.max(0,(Y-c.rel)/(.2+.0022*c.hang)));j=j*j*(3-2*j);const W=d.y+c.hang*j+d.H*.5-Q[1],U=d.z-Q[2],se=Math.hypot(d.x,W,U),Ee=Math.hypot(Q[3],Q[4]);(W*Q[3]+U*Q[4])/(Ee*Math.max(se,.001))>.25&&(p=Math.max(p,d.H/Math.max(se-d.H*.4,4)))}d.seen=p}const ie=u.slice().sort((e,d)=>d.seen-e.seen),le=Math.round(44*A),Re=Math.round(130*A),Ie=ie.slice(0,le),He=ie.slice(le,le+Re),Be=ie.slice(le+Re),Ce=t.formMaterial({prog:y}),Ye=t.formMaterial({prog:y,mirror:!0,sink:!0}),lt=t.formMaterial({prog:y,mirror:!0,whole:!0});await l.yield();const dt=t.instanced(t.gridGeometry(16,24),Ce,Ie.length,t.formAttrs(Ie)),ct=t.instanced(t.gridGeometry(8,14),Ce,He.length,t.formAttrs(He));await l.yield();const ut=t.instanced(t.gridGeometry(8,9),Ce,Be.length,t.formAttrs(Be));await l.yield(),await l.yield();const ft=t.formAttrs(u),Fe=e=>e.cap||e.parent&&e.parent.cap,Qe=u.filter(Fe),pt=Be.filter(e=>e.H>=10.5&&!Fe(e)),Xe=Be.filter(e=>e.H<10.5&&!Fe(e)),Ze=t.instanced(t.gridGeometry(8,16),lt,Qe.length,t.formAttrs(Qe));Ze.renderOrder=t.MIRROR_ORDER;const Je=Ie.concat(He).filter(e=>!Fe(e)).concat(pt),et=t.instanced(t.gridGeometry(4,4),Ye,Xe.length,t.formAttrs(Xe));et.renderOrder=t.MIRROR_ORDER;const tt=t.instanced(t.gridGeometry(8,12),Ye,Je.length,t.formAttrs(Je));tt.renderOrder=t.MIRROR_ORDER;const at=new Float32Array(u.length);u.forEach((e,d)=>{at[d]=e.ruled?1:e.cap||e.escort?.3:0});const mt=t.instanced(t.stripGeometry(12),t.bladeMaterial({prog:y,pick:!0}),u.length,Object.assign({},ft,{iK:[at,1]}));await l.yield();const wt=t.instanced(t.stripGeometry(8),t.threadMaterial({prog:y,keep:We}),o.length,t.threadAttrs(o));await l.yield();const De=o.slice(0,N).filter(e=>e.bead),yt=t.threadAttrs(De),Ne=new Float32Array(De.length*2);for(let e=0;e<De.length;e++)Ne[e*2]=r(),Ne[e*2+1]=r.range(.025,.07)*r.sign();const vt=t.instanced(t.quadGeometry(),t.beadMaterial({prog:y,keep:We}),De.length,Object.assign(yt,{bP:[Ne,2]})),qe={value:0},ot=e=>{const d=T.filter(c=>c.acc===e);return t.instanced(t.stripGeometry(8),t.threadMaterial({prog:y,keep:[4e3,0],width:.045,hide:qe}),d.length,t.threadAttrs(d))},gt=ot(0),xt=ot(1);await l.yield();const rt=[0,1].map(e=>{const d=T.filter(p=>p.acc===e),c=new Float32Array(d.length*2);for(let p=0;p<d.length;p++)c[p*2]=(p*.37+.2*e)%1,c[p*2+1]=.012+.008*(p*.618%1);return t.instanced(t.quadGeometry(),t.beadMaterial({prog:y,keep:[4e3,0],radius:.62,color:e?t.palette.turquoise:t.palette.coral,hide:qe}),d.length,Object.assign(t.threadAttrs(d),{bP:[c,2]}))}),Ge=o.slice(N,o.length-1),bt=t.instanced(t.quadGeometry(),t.beadMaterial({prog:y,keep:We,radius:.24,floorPx:1.7,at:0}),Ge.length,Object.assign(t.threadAttrs(Ge),{bP:[new Float32Array(Ge.length*2),2]}));k.add(et,tt,Ze,mt,ut,ct,dt,wt,vt,bt,gt,xt,rt[0],rt[1]);const Oe=!a.style;(Oe||a.backdrop)&&k.add(t.makeBackdrop()),await l.yield();let nt=Oe;const Mt=e=>new n.Vector3(e[0],e[1],e[2]);return{object:k,radius:62,height:126,center:new n.Vector3(0,52,-8),ground:!1,groundY:0,style:t,progress:y,counts:{forms:u.length,ground:s.length,threads:o.length,beads:De.length},ruler:X,anchors:{portalSeat:{position:fe.clone(),axis:Pe.clone(),facing:Pe.clone().negate(),radius:7,pitch:Te},flyThrough:pe.map(Mt),holeCenter:fe.clone(),holeRadius:ze,motherTip:w.tipPoint.clone(),motherTop:new n.Vector3(0,w.yTop,fe.z+xe.z*(ze+4)),shadowFoot:new n.Vector3(w.tipPoint.x,0,w.tipPoint.z),aisleHalfWidth:q,viewpoints:{entry:new n.Vector3(0,1.7,400),lift:new n.Vector3(0,43,138),threeQuarter:new n.Vector3(85,34,95),under:new n.Vector3(0,72,23.6)}},setProgress(e){nt=!1,y.value=Math.min(1.2,Math.max(0,e)),qe.value=C(y.value,.92,1.02)},update(e,d,c){Oe&&t.update(e,d,c),nt&&(y.value=.5-.5*Math.cos(d*ee/48),t.uniforms.uTide.value.set(0,-1,(d-1)*16-70,1))},dispose(){Oe&&t.dispose()}}}function Ht(l,a,t=96,r=36){const g=[],A=[],y=[],k=[],C=[],P=(h,i,f,u)=>{const s=u&&h>i?0:(h-i)/f;return Math.exp(-s*s)},B=(h,i)=>Math.min(1,h/i+.04),v=(h,i)=>{const f=Math.min(1,(1-h)/i);return Math.sqrt(Math.max(0,f*(2-f)))},E=(h,i,f)=>{const u=Math.min(1,Math.max(0,(f-h)/(i-h)));return u*u*(3-2*u)};function I(h,i,f,u=t,s=!1,x=1){const m=g.length/3,b=.001;for(let z=0;z<=u;z++){const R=z/u,X=s?R:Math.min(1-b,Math.max(b,R)),G=h(R),K=h(X-b),w=h(X+b);let S=w[0]-K[0],V=w[1]-K[1];const _=Math.hypot(S,V)||1;S/=_,V/=_;const $=i(R),J=(i(X+b)-i(X-b))/_,he=-V,oe=S;for(let ce=0;ce<r;ce++){const be=ce/r*ee,ye=Math.cos(be),re=Math.sin(be),ae=ye*he,o=ye*oe;g.push(G[0]+ae*$,G[1]+o*$,re*$*x);const M=ae-S*J,F=o-V*J,O=re/x,T=Math.hypot(M,F,O)||1;A.push(M/T,F/T,O/T),y.push(f(R,ae,o,re,G)),k.push(s?.004*a:.0055*a*Math.sin(Math.PI*R))}}for(let z=0;z<u;z++)for(let R=0;R<r;R++){const X=m+z*r+R,G=m+z*r+(R+1)%r,K=X+r,w=G+r;C.push(X,G,K,G,w,K)}}if(l==="horn"){const h=i=>a*(.036+.222*P(i,.3,.165)+.07*P(i,.88,.07,1))*B(i,.07)*v(i,.11);I(i=>[.26*a*Math.pow(i,1.8),a*(i-.1*i*i*i)/.9],h,(i,f,u,s,x)=>.72+(((x[1]+u*h(i))*.94-(x[0]+f*h(i))*.342)/a-.786)*4)}else if(l==="column")I(h=>[.04*a*Math.sin(ee*h*.9)*h,a*h],h=>a*(.034+.25*P(h,.25,.125)+.275*P(h,.775,.125,1))*B(h,.05)*v(h,.225),h=>P(h,.512,.062));else if(l==="hook"){const i=[0],f=[0];for(let m=1;m<=256;m++){const b=(m-.5)/256,z=Math.max(0,(b-.42)/.58),R=3.3*z*z*(3-2*z);i.push(i[m-1]+Math.sin(R)/256),f.push(f[m-1]+Math.cos(R)/256)}const u=m=>(.066+.08*P(m,.17,.15)+.175*P(m,.9,.09,1))*B(m,.05)*v(m,.11);let s=0;for(let m=0;m<=256;m++)s=Math.max(s,f[m]/(1-u(m/256)));const x=m=>{const b=Math.min(255.999999,Math.max(0,m*256)),z=Math.floor(b),R=b-z;return[(i[z]+(i[z+1]-i[z])*R)*a/s,(f[z]+(f[z+1]-f[z])*R)*a/s]};I(x,m=>a*u(m),(m,b,z,R,X)=>{const G=x(Math.max(0,m-.004)),K=x(Math.min(1,m+.004)),w=Math.hypot(K[0]-G[0],K[1]-G[1])||1;return E(.44,.52,m)*(1-E(.79,.85,m))*(.5+.5*(b*(K[1]-G[1])-z*(K[0]-G[0]))/w)},t,!1,1.25)}else if(l==="arch")I(h=>[-.345*a*Math.cos(Math.PI*h),.92*a*Math.pow(Math.max(Math.sin(Math.PI*h),0),.62)],h=>{const i=Math.max(Math.sin(Math.PI*h),0);return a*(.014+.085*i*i)*(2.2-.5*Math.pow(i,8))*Math.min(1,i/.06+.05)},(h,i,f,u,s)=>{const x=Math.max(Math.sin(Math.PI*h),0),m=-s[0],b=.4*a-s[1],z=Math.hypot(m,b)||1;return E(.02,.08,x)*(.8+.5*(Math.cos(Math.atan2(-u,Math.hypot(i,f)*Math.sign(i*m+f*b))-.32)-Math.cos(.39)))});else if(l==="eye"){const h=.522*a,i=2.6;I(x=>{const m=ee*x-Math.PI/2,b=Math.cos(m),z=Math.sin(m),R=Math.pow(Math.pow(Math.abs(b),i)+Math.pow(Math.abs(z),i),-1/i);return[.225*a*b*R*(1+.15*z*R),h+.31*a*z*R]},x=>{const m=ee*x-Math.PI/2,b=Math.sin(2*m);return .14*a*(1+.2*Math.sin(m))*(1-.2*b*b)},(x,m,b,z,R)=>.5+.5*Math.sqrt(Math.max(0,1-z*z))*Math.sign(-R[0]*m+(h-R[1])*b),t,!0,.5);const s=h-.31*a-.8*.14*a+.012*a;I(x=>[0,s*x],x=>a*.012*B(x,.2)*(.5+.5*x),()=>0,6,!1)}else{const h=.325*a,i=.55*a,f=.158;I(s=>[h*Math.cos(ee*s-Math.PI/2),i+h*Math.sin(ee*s-Math.PI/2)],s=>f*a*(1+.1*Math.cos(ee*s+.6)),(s,x,m,b)=>.5+.5*Math.sqrt(Math.max(0,1-b*b))*Math.sign(x*Math.cos(ee*s-Math.PI/2)+m*Math.sin(ee*s-Math.PI/2))*-1,t,!0,.58);const u=i-h-f*a*(1+.1*Math.cos(.6))+.012*a;I(s=>[0,u*s],s=>a*.011*B(s,.2)*(.5+.5*s),()=>0,6,!1)}const q=new n.BufferGeometry;return q.setAttribute("position",new n.Float32BufferAttribute(g,3)),q.setAttribute("normal",new n.Float32BufferAttribute(A,3)),q.setAttribute("aTip",new n.Float32BufferAttribute(y,1)),q.setAttribute("aSoft",new n.Float32BufferAttribute(k,1)),q.setIndex(C),q}export{ge as DAWN,Ve as DIPK,de as PEN,it as SHADOW_LEN,It as buildHero,Ht as giantGeometry,we as ink,Lt as makeProfilesStepped,Rt as makeRuler,Bt as makeStyle,Et as shadeCurv};
