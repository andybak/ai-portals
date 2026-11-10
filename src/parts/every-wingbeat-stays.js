import*as x from"three";import{clamp as oe,lerp as S,smoothstep as Se}from"../kit/core.js";const ae=Math.PI*2,ke=["#F3C52E","#E24A2A","#B5347C","#2747A8","#1E8C72","#F2E7D0","#221F2A"],fe={R:110,Y0:250,CLIMB:1.5625,PERIOD:25.6,D:1.6,N:90,BEAT:1.44,BANK:.2443,T_END:42},ze=[[.59719,.35458,.04823],[.076,.90834,.01566],[.0284,.13383,.83777]],Oe=[[1.60475,-.53108,-.07367],[-.10208,1.10813,-.00605],[-.00327,-.07276,1.07602]],Me=e=>{const[[t,s,u],[l,r,m],[d,p,f]]=e,h=r*f-m*p,y=-(l*f-m*d),R=l*p-r*d,c=t*h+s*y+u*R;return[[h/c,-(s*f-u*p)/c,(s*m-u*r)/c],[y/c,(t*f-u*d)/c,-(t*m-u*l)/c],[R/c,-(t*p-s*d)/c,(t*r-s*l)/c]]},Re=(e,t)=>[e[0][0]*t[0]+e[0][1]*t[1]+e[0][2]*t[2],e[1][0]*t[0]+e[1][1]*t[1]+e[1][2]*t[2],e[2][0]*t[0]+e[2][1]*t[1]+e[2][2]*t[2]],He=Me(ze),We=Me(Oe),_e=e=>{e=oe(e,0,.98);const t=1-.983729*e,s=.0245786-.432951*e,u=-(90537e-9+.238081*e);return(-s+Math.sqrt(Math.max(s*s-4*t*u,0)))/(2*t)};function Ne(e){return(t,s=1)=>{const u=t.isColor?t.clone():new x.Color(t),l=Re(He,Re(We,[u.r*s,u.g*s,u.b*s]).map(_e)),r=.6/Math.max(e,.05);return new x.Color(Math.max(l[0],.002)*r,Math.max(l[1],.002)*r,Math.max(l[2],.002)*r)}}function Ce(e){const t=[],s=[],u=[],l=[],r=[],m=[];let d={seg:0,j:0,side:0,pivot:[0,0,0],tint:0};const p=(f,h,y,R,c,b)=>{if(b){const M=h[0]-f[0],F=h[1]-f[1],N=h[2]-f[2],Y=y[0]-f[0],Z=y[1]-f[1],$=y[2]-f[2],se=F*$-N*Z,ee=N*Y-M*$,B=M*Z-F*Y;if(se*b[0]+ee*b[1]+B*b[2]<0){const P=h;h=y,y=P,c=c&4|(c&1)<<1|(c&2)>>1}}const a=(f[0]+h[0]+y[0])/3,n=(f[1]+h[1]+y[1])/3,i=(f[2]+h[2]+y[2])/3,v=e();t.push(f[0],f[1],f[2],h[0],h[1],h[2],y[0],y[1],y[2]);const w=c&4?1:0,k=c&1?1:0,C=c&2?1:0;s.push(1,k,C,w,1,C,w,k,1);for(let M=0;M<3;M++)u.push(d.seg,d.j,d.side,R),l.push(d.pivot[0],d.pivot[1],d.pivot[2]),r.push(a,n,i,v),m.push(d.tint)};return{rng:e,set(f){d={...d,...f}},tri(f,h,y,R,c,b=0){p(f,h,y,R,b,c)},quad(f,h,y,R,c,b,a=c){p(f,h,y,c,1,b),p(f,y,R,a,2,b)},count:()=>t.length/9,geometry(f){const h=f?new x.InstancedBufferGeometry:new x.BufferGeometry;return h.setAttribute("position",new x.Float32BufferAttribute(t,3)),h.setAttribute("aBary",new x.Float32BufferAttribute(s,3)),h.setAttribute("aInfo",new x.Float32BufferAttribute(u,4)),h.setAttribute("aPivot",new x.Float32BufferAttribute(l,3)),h.setAttribute("aCen",new x.Float32BufferAttribute(r,4)),h.setAttribute("aTint",new x.Float32BufferAttribute(m,1)),h}}}const z=[0,1,0],qe=[0,-1,0],I=(e,t,s=1)=>[e[0]+t[0]*s,e[1]+t[1]*s,e[2]+t[2]*s],he=(e,t,s)=>[S(e[0],t[0],s),S(e[1],t[1],s),S(e[2],t[2],s)];function ne(e,t,s,u,l,r,m={}){const d=m.n??2,p=m.roll??.12,f=m.tipRole??3,h=m.leadRole??0,y=m.trailRole??2,R=m.notch??0,c=m.rng,b=C=>.42+.58*Math.sin(Math.min(C*2.4,1)*Math.PI*.5)-.5*Se(.55,1,C),a=(C,M)=>{const F=(M>0?.48:.52)*r*b(C),N=I(I(t,s,l*C),u,M*F);return N[1]-=(M<0?p*F:-p*.4*F*M)+(m.droop??0)*C*C*l,N},n=.8,i=I(t,s,l);i[1]-=(m.droop??0)*l;let v=a(0,.5),w=a(0,0),k=a(0,-.5);for(let C=1;C<=d;C++){const M=C/d*n,F=a(M,1),N=a(M,0),Y=a(M,-1);if(e.quad(v,F,N,w,h,z),R>0&&C>1){const Z=M-.5/d*n,$=a(Z,-(1-R*(.6+.4*c())));e.tri(w,k,$,y,z,1),e.tri(w,$,N,y,z,6),e.tri(N,$,Y,y,z,2)}else e.quad(w,N,Y,k,y,z);v=F,w=N,k=Y}e.tri(v,i,w,f,z,0),e.tri(w,i,k,m.tipRole2??f,z,0)}function Ae(e,t,s,u,l,r,m,d=[0,2,3]){const p=I(t,z,r*.4),f=I(t,z,-r*.6),h=I(s,z,m*.4),y=I(s,z,-m*.6),R=[t[0],t[1]-r*.1,t[2]-u],c=[s[0],s[1]-m*.1,s[2]-l];return e.quad(p,h,c,R,d[0],z),e.quad(f,y,c,R,d[1],qe),e.quad(p,h,y,f,d[2],[0,0,1]),{aR:R,bR:c,aT:p,bT:h,aB:f,bB:y}}const Be={crane:{neck:1,tail:e=>15-2.2*e*e,tailW:1.5,chord:1,primW:1.25,primL:[9,9.6,10.3,11,11.8,12.6,13.4,14,13.6,12.4,10.6],spread:1.35,legs:!0,bill:4.3,sweep:1.8},condor:{neck:.5,tail:e=>8-1.2*e*e,tailW:2,chord:1.35,primW:1.7,primL:[8,8.4,9,9.8,10.8,12,13,13.6,13.6,13,11.6],spread:1.62,legs:!1,bill:2.4,sweep:.6},frigate:{neck:.6,tail:e=>7+12*e*e,tailW:1.2,chord:.78,primW:1.05,primL:[8,8.8,9.8,11,12.2,13.4,14.4,15,15,14,12],spread:1,legs:!1,bill:5.2,sweep:3.4}};function Pe(e,t,s,u){for(let l=0;l<t.length-1;l++){const r=t[l],m=t[l+1],d=r.length;for(let p=0;p<d;p++){const f=r[p],h=r[(p+1)%d],y=m[(p+1)%d],R=m[p],c=[(f[0]+h[0]+y[0]+R[0])/4,(f[1]+h[1]+y[1]+R[1])/4,(f[2]+h[2]+y[2]+R[2])/4],b=he(s[l],s[l+1],.5),a=u(l,p);e.quad(f,h,y,R,a,[c[0]-b[0],c[1]-b[1],c[2]-b[2]],Array.isArray(a)?a[1]:a)}}}function je(e,t,s){e.set({seg:0,j:0,side:0,pivot:[0,0,0]});const u=[[-6.4,.45,.5,.5],[-4.2,1.15,1,1.2],[-1.2,1.75,1.45,2],[1.6,2.15,1.7,2.9],[4.2,1.8,1.5,2.1],[6.3,.95,.95,1]],l=([a,n,i,v])=>[[0,i,a],[n,.35*i,a+.2],[.72*n,-.5*v,a],[0,-v,a+.5],[-.72*n,-.5*v,a],[-n,.35*i,a+.2]],r=(a,n)=>n===0?a===2?3:0:n===5?a===2?3:1:n===1?a%2?0:1:n===4?1:n===2||a%2?2:1;Pe(e,u.map(l),u.map(a=>[0,0,a[0]]),r);const m=l(u[0]);for(let a=0;a<6;a++)e.tri(m[a],m[(a+1)%6],[0,0,-7.4],2,[m[a][0],m[a][1],-1],0);const d=t.neck,p=[0,.7,6.3];e.set({seg:1,pivot:p});const f=[[.7,6.3,.95],[1.5*d+.3,6.3+3.2*d,.62],[2.1*d+.2,6.3+6.2*d,.5],[1.9*d+.3,6.3+8.9*d,.55],[2*d+.3,6.3+8.9*d+1.3,.85],[1.6*d+.3,6.3+8.9*d+2.5,.36]],h=([a,n,i])=>[[0,a+i,n],[i*.8,a,n],[0,a-i*1.15,n],[-i*.8,a,n]];Pe(e,f.map(h),f.map(a=>[0,a[0],a[1]]),(a,n)=>a===3?n===0||n===3?2:3:a===4?n<1||n>2?0:1:n===0?0:n===3?1:a%2?3:2);const y=f[5],R=[0,y[0]-.5,y[1]+t.bill],c=h(y);e.tri(c[0],c[1],R,3,[1,1,0],0),e.tri(c[1],c[2],R,4,[1,-1,0],0),e.tri(c[2],c[3],R,4,[-1,-1,0],0),e.tri(c[3],c[0],R,3,[-1,1,0],0);{const a=f[4];for(let n=0;n<3;n++)ne(e,[(n-1)*.22,a[0]+.7,a[1]-.1],[(n-1)*.16,.42-.1*Math.abs(n-1),-.9],[n<1?-1:1,0,0],3.4-.8*Math.abs(n-1),.5,{n:1,roll:0,leadRole:n===1?3:0,trailRole:2,tipRole:4})}e.set({seg:0,pivot:[0,0,0]});for(let a=0;a<(s?5:3);a++)for(const n of[1,-1]){const i=a/(s?5:3),v=S(4.4,-3.6,i);ne(e,[n*.25,S(1.62,1.2,i)+.12,v],[n*.34,-.1,-.93],[n,0,0],s?3:4.2,1.5,{n:1,roll:.5,leadRole:a%2?0:1,trailRole:a%2?2:1,tipRole:3})}if(e.set({seg:1,pivot:p}),s){const a=f[4];for(const n of[1,-1])e.tri([n*.72,a[0]+.25,a[1]-.2],[n*.72,a[0]-.15,a[1]+.3],[n*.6,a[0]+.3,a[1]+.55],4,[n,0,0],0)}if(t.legs)for(const a of[1,-1]){e.set({seg:6,side:a,pivot:[a*.6,-1,-3]});const n=[a*.6,-1,-3],i=[a*.75,-1.5,-11.5],v=[a*.8,-1.35,-18.5],w=.32;e.quad(I(n,[0,1,0],w),I(i,[0,1,0],w*.7),I(i,[a,-.6,0],w*.7),I(n,[a,-.6,0],w*1.4),1,[a,.3,0]),e.quad(I(n,[0,1,0],w),I(i,[0,1,0],w*.7),I(i,[-a,-.6,0],w*.7),I(n,[-a,-.6,0],w*1.4),2,[-a,.3,0]),e.quad(I(i,[0,1,0],w*.7),I(v,[0,1,0],w*.3),I(v,[a,-.6,0],w*.5),I(i,[a,-.6,0],w*.7),4,[a,.3,0]),e.quad(I(i,[0,1,0],w*.7),I(v,[0,1,0],w*.3),I(v,[-a,-.6,0],w*.5),I(i,[-a,-.6,0],w*.7),4,[-a,.3,0]);for(const k of[-1,0,1])e.tri(I(v,[0,1,0],.1),I(v,[a*.1+k*.5,-.25*Math.abs(k)-.1,-1.5],1),I(v,[k*.25,-.3,-.2],1),3,z,0)}const b=[0,.15,-5.6];for(let a=0;a<9;a++){const n=(a-4)/4,i=t.tail(Math.abs(n));e.set({seg:2,j:a,side:0,pivot:b});const v=[n*.5,.15-.07*Math.abs(a-4)+a%2*.05,-5.6];ne(e,v,[0,0,-1],[n>=0?1:-1,0,0],i,t.tailW,{n:s?4:2,roll:.1,notch:s?.35:0,rng:e.rng,leadRole:0,trailRole:a%2?2:1,tipRole:a===4?2:3})}return{bill:R,neckBase:p,tailRoot:b}}const Q=[1.45,.95,5],te=[13.6,.95,4.3];function Ie(e,t,s,u){const l=n=>[n[0]*s,n[1],n[2]],r=t.chord,m=t.sweep;e.set({seg:3,j:0,side:s,pivot:l(Q)});const d=[7.4,.95,5+.25],p=[[Q,d,4.3*r,3.9*r,1.4,1.3],[d,te,3.9*r,3.4*r,1.3,1.15]],f=[];p.forEach(([n,i,v,w,k,C],M)=>{const F=Ae(e,l(n),l(i),v,w,k,C,[M?0:1,M?1:2,3]);f.push([F.aR,F.bR])}),e.tri(l([.9,1.2,3.6]),l(I(Q,z,.56)),l([Q[0],.8,5-4.3*r]),1,z,0);const h=te[0]-Q[0],y=u?3:2,R=u?12:6;for(let n=0;n<y;n++)for(let i=0;i<R;i++){const v=(i+.5)/R,w=Q[0]+v*h,k=S(4.3,3.4,v)*r,C=l([w,.82-.14*n,S(5,4.3,v)+.25*Math.sin(v*Math.PI)-k*(.62+.3*n)]);ne(e,C,[s*.05,0,-1],[s,0,0],(2.6-.25*n)*r,h/R*1.12,{n:1,roll:.08,leadRole:0,trailRole:(i+n)%2?1:0,tipRole:n===y-1?3:i%3?1:2})}for(let n=0;n<9;n++){const i=(n+.5)/9,v=Q[0]+.3+i*(h-.2),w=S(4.3,3.4,i)*r,k=S(-.1,.2,i),C=l([v,.5,S(5,4.3,i)-w-1.2*r]);ne(e,C,[s*Math.sin(k),0,-Math.cos(k)],[s*Math.cos(k),0,Math.sin(k)],S(7.2,8.6,i)*(.8+.2*r),1.55,{n:u?4:2,notch:u?.3:0,rng:e.rng,roll:.13,leadRole:0,trailRole:n%2?1:2})}e.set({seg:4,pivot:l(te)});const c=[19.6,.95,4.3-m];Ae(e,l(te),l(c),3.4*r,1.5*r,1.15,.5,[0,1,3]),e.tri(l(I(c,z,.2)),l(I(c,[1.5,0,-.9],1)),l([c[0],c[1],c[2]-1.5*r]),3,z,0),ne(e,l(I(te,[.3,.5,.2],1)),[s*.96,0,-.28],[s*.28,0,.96],3.4,.8,{n:1,roll:0,leadRole:3,trailRole:1,tipRole:4});const b=u?7:4;for(let n=0;n<b;n++){const i=(n+.5)/b,v=S(te[0],c[0],i),w=S(3.4,1.5,i)*r,k=S(.15,.7,i),C=l([v,.8,S(te[2],c[2],i)-w*.7]);ne(e,C,[s*Math.sin(k),0,-Math.cos(k)],[s*Math.cos(k),0,Math.sin(k)],2.8*r,(c[0]-te[0])/b*1.2,{n:1,roll:.08,leadRole:0,trailRole:n%2?1:0,tipRole:3})}let a=null;for(let n=0;n<11;n++){const i=n/10,v=S(.24,t.spread,Math.pow(i,.85)),w=S(3.4,1.5,i)*r,k=[S(te[0]+.4,c[0]+.5,i),.62-.02*n,S(te[2],c[2],i)-w*(1-.45*i)+.3];e.set({seg:5,j:n,pivot:l(k)});const C=[s*Math.sin(v),0,-Math.cos(v)],M=[s*Math.cos(v),0,Math.sin(v)],F=t.primL[n];ne(e,l(k),C,M,F,t.primW*(1-.18*i),{n:u?5:2,notch:u?.28:0,rng:e.rng,roll:.16,droop:.004,leadRole:n%4===3?1:0,tipRole:u?4:3,tipRole2:u?4:n%2?3:2}),n===7&&(a={pos:I(l(k),C,F),pivot:l(k),j:n})}return a}function Ee(e,t,s){const u=Ce(e),l=Be[t]||Be.crane,r=je(u,l,s),m=Ie(u,l,1,s),d=Ie(u,l,-1,s);return{S:u,bill:r.bill,neckBase:r.neckBase,tipR:m,tipL:d}}const Le=`
  uniform float uT, uA0, uBeatOff, uSpread, uClimb, uY0;
  const float TAU = 6.2831853;
  vec3 rotX(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(p.x, p.y*c-p.z*s, p.y*s+p.z*c); }
  vec3 rotY(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(p.x*c+p.z*s, p.y, -p.x*s+p.z*c); }
  vec3 rotZ(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(p.x*c-p.y*s, p.x*s+p.y*c, p.z); }
  // rigid pose of one segment at wingbeat phase ph (0..1). info = (segment, index j, side, role)
  vec3 pose(vec3 p, vec4 info, vec3 piv, float ph){
    float seg = info.x, j = info.y, s = info.z;
    float w = TAU*ph, sn = sin(w), cs = cos(w);
    float sh = 0.12 + 0.62*sn;                 // shoulder
    float wr = 0.36*sin(w - 1.2);              // wrist lags the arm
    float swp = 0.35*max(cs, 0.);              // hand sweeps back on the upstroke
    vec3 S = vec3(1.45*s, 0.95, 5.0), W = vec3(13.6*s, 0.95, 4.3);
    if (seg > 4.5 && seg < 5.5) {              // primary j: fans, pitches, tips bend
      float pt = 0.3*cs;
      p -= piv; p = rotY(p, -s*j*uSpread*(1. + 0.5*cs)); p = rotX(p, pt*(1. - j*0.07)); p = rotZ(p, -s*pt*j*0.07); p += piv;
    }
    if (seg > 3.5 && seg < 5.5) { p -= W; p = rotY(p, s*swp); p = rotZ(p, s*wr); p += W; }
    if (seg > 2.5 && seg < 5.5) { p -= S; p = rotZ(p, s*sh); p += S; }
    if (seg > 1.5 && seg < 2.5) { p -= piv; p = rotY(p, -(j - 4.)*0.25*(0.5 + 0.2*cs)); p = rotX(p, -0.14*sn); p += piv; }
    if (seg > 0.5 && seg < 1.5) { p -= piv; p = rotX(p, 0.07*sn); p += piv; }
    if (seg > 5.5) { p -= piv; p = rotX(p, -0.05*sn); p += piv; }
    p.y -= 0.8*sn;                             // the body heaves against the wings
    return p;
  }
  vec3 birdPos(float te){ float a = uA0 + TAU*te/25.6; return vec3(110.*cos(a), uY0 + 1.5625*uClimb*te, -110.*sin(a)); }
  // bird space -> hero space at time te: nose along the helix tangent, banked 14 degrees toward the needle
  vec3 place(vec3 p, float te){
    float a = uA0 + TAU*te/25.6;
    vec3 fwd = vec3(-sin(a)*26.998, 1.5625*uClimb, -cos(a)*26.998) / 27.0432;
    vec3 r0 = vec3(cos(a), 0., -sin(a)), u0 = cross(r0, fwd);
    vec3 right = r0*0.9703 + u0*0.2419, up = u0*0.9703 - r0*0.2419;
    return birdPos(te) + right*p.x + up*p.y + fwd*p.z;
  }
`,ve=`
  uniform vec3 uHue[5], uMid[5], uComp[5], uCream, uInk, uSkyWarm, uSkyCool, uSunDir;
  uniform float uAges[4], uDepthK, uDis, uFarHue;
  // colour is time: the hue band of a face of this age. Each border is crossed in half a second.
  vec3 ageColour(float age, float role){
    float k1 = smoothstep(uAges[0], uAges[0]+0.5, age), k2 = smoothstep(uAges[1], uAges[1]+0.5, age);
    float k3 = smoothstep(uAges[2], uAges[2]+0.5, age), k4 = smoothstep(uAges[3], uAges[3]+0.5, age);
    vec3 h = mix(mix(mix(mix(uHue[0], uHue[1], k1), uHue[2], k2), uHue[3], k3), uHue[4], k4);
    vec3 m = mix(mix(mix(mix(uMid[0], uMid[1], k1), uMid[2], k2), uMid[3], k3), uMid[4], k4);
    vec3 c = mix(mix(mix(mix(uComp[0], uComp[1], k1), uComp[2], k2), uComp[3], k3), uComp[4], k4);
    vec3 col = role < 0.5 ? h : role < 1.5 ? m : role < 2.5 ? c : role < 3.5 ? uCream : uInk;
    return col;
  }
  // distance is tone steps: n steps toward the sky tone, borders at 250, 600, 1200, 2400 m
  float depthSteps(float d){ return smoothstep(250., 290., d) + smoothstep(600., 640., d) + smoothstep(1200., 1240., d) + smoothstep(2400., 2440., d); }
  vec3 skyTone(vec3 fromCam){ float k = dot(fromCam.xz, uSunDir.xz) / max(length(fromCam.xz), 1.); return mix(uSkyCool, uSkyWarm, smoothstep(-0.15, 0.15, k)); }
`,Ge=`
  uniform vec3 uInkF; uniform float uLineW, uBack;
  // thin ink edge from barycentrics; faces too small for a line are darkened by the line's average instead
  vec3 inked(vec3 col, vec3 bary, float lighten, vec3 sky){
    vec3 fw = max(fwidth(bary), vec3(0.00001));
    vec3 e3 = bary / fw; float e = min(e3.x, min(e3.y, e3.z));
    float px = 0.33 / max(fw.x, max(fw.y, fw.z));
    float ls = clamp(px/6. - 0.5, 0., 1.);
    float line = 1. - smoothstep(uLineW - 0.5, uLineW + 0.5, e);
    vec3 ink = mix(uInkF, sky, lighten);
    if (!gl_FrontFacing) col *= uBack;
    return mix(col*(1. - 0.12*(1. - ls)), ink, line*ls);
  }
`,Ve=`
  attribute vec3 aBary, aPivot; attribute vec4 aInfo, aCen; attribute float aTint;
  uniform float uYoung;
  #if defined(SHELL) || defined(PERCH)
    attribute float aI;
  #endif
  varying vec3 vBary, vCol, vSky; varying float vLight;
  ${Le}
  ${ve}
  void main(){
    float n = floor(uT/1.6);
    #if defined(PERCH)
      float idx = 46. + mod(n - aI + 240., 24.);       // a row keeps to one physical shell while it is magenta
      float te = (n - idx)*1.6;
    #elif defined(SHELL)
      float te = (n - aI)*1.6;                          // quantised per slot: an echo never moves
    #else
      float te = uT;
    #endif
    float age = uT - te;
    float ph = fract(te/1.44 + uBeatOff);
    vec3 P = place(pose(position, aInfo, aPivot, ph), te);
    float role = aInfo.w, colAge = age;
    #if defined(PERCH)
      vec3 C = place(pose(aCen.xyz, aInfo, aPivot, ph), te);
      float k = smoothstep(73.6, 76.6, age)*(1. - smoothstep(107., 110., age));   // arrive and leave by shrinking
      P = C + (P - C)*k; colAge = 0.;
    #elif defined(SHELL)
      vec3 C = place(pose(aCen.xyz, aInfo, aPivot, ph), te);
      float seed = aCen.w;
      float d = clamp((age - uDis - 8.*seed)/9., 0., 1.);                        // old shells come apart face by face
      // one face in eight lets go as a loose triangle of 2 to 6 m, turning into an even three-cornered piece as it
      // leaves; the rest fold away where they are, so the cloud is separate triangles and not a burst of feather slivers
      float keep = step(fract(seed*13.7), 0.13), corner = float(gl_VertexID - 3*(gl_VertexID/3));
      vec3 ax = normalize(vec3(sin(seed*40.), 0.6, cos(seed*40.)));
      vec3 e1 = normalize(cross(ax, vec3(0.3, 1., 0.2))), e2 = cross(ax, e1);
      float ca3 = corner*2.0944, sz = 1.3 + 2.2*fract(seed*29.3);
      vec3 v = mix(P - C, (e1*cos(ca3) + e2*sin(ca3))*sz, smoothstep(0., 0.22, d)*keep);
      float ang = 5.*d, ca = cos(ang), sa = sin(ang);
      v = v*ca + cross(e1, v)*sa + e1*dot(e1, v)*(1. - ca);                       // tumbling about an axis in its own plane
      v *= (1. - smoothstep(0.75, 1., d)) * mix(1. - smoothstep(0.02, 0.3, d), 1., keep);
      P = C + v + vec3(4.*d*sin(3.*d + 6.*seed), -6.*d - 28.*d*d, 4.*d*cos(2.*d + 6.*seed));
    #endif
    vec4 cw = modelMatrix * vec4(birdPos(te), 1.);
    float dcam = distance(cw.xyz, cameraPosition), st = depthSteps(dcam);
    vec3 col = ageColour(colAge, role);
    #if defined(SHELL)
      // the living bird alone wears the colour of now. Every self of the first band stands a clear step under it from a
      // fifth of a second after its birth: hue and mid faces most of the way to the next band's, cream edges to the hue.
      // So beside the bird a self is plainly a second bird of another colour, never a second pair of its own wings.
      // (Only within some 300 m: from afar the top turn of the stair keeps the clean colour of now.)
      float yng = uYoung * smoothstep(0., 0.2, age) * (1. - smoothstep(uAges[0] - 1.5, uAges[0] + 0.5, age)) * (1. - smoothstep(260., 430., dcam));
      if (role < 1.5) col = mix(col, ageColour(uAges[0] + 1., role), 0.85*yng);
      else if (role > 2.5 && role < 3.5) col = mix(col, ageColour(0., 0.), 0.85*yng);
      col *= 1. - 0.16*yng;
    #endif
    // far off a face is a few pixels and its roles average to brown: the mid, complement and cream lean to the hue
    if (role > 0.5 && role < 3.5) col = mix(col, ageColour(colAge, 0.), uFarHue * smoothstep(360., 620., dcam));
    col *= 1. + aTint;
    vSky = skyTone(cw.xyz - cameraPosition); vLight = uDepthK*min(st, 1.);                // one tone step at most: the Gyre must hold its colour
    vCol = mix(col, vSky, vLight); vBary = aBary;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(P, 1.);
  }
`,Fe=`
  varying vec3 vBary, vCol, vSky; varying float vLight;
  ${Ge}
  void main(){ gl_FragColor = vec4(inked(vCol, vBary, vLight, vSky), 1.); }
`,Ye=`
  attribute vec3 aBary, aColor; attribute vec4 aCen;
  varying vec3 vBary, vCol, vSky; varying float vLight;
  ${ve}
  void main(){
    vec4 cw = modelMatrix * vec4(0., aCen.y, 0., 1.);
    float st = depthSteps(distance(cw.xyz, cameraPosition));
    vSky = skyTone(cw.xyz - cameraPosition); vLight = 0.16*st;
    vCol = mix(aColor, vSky, vLight); vBary = aBary;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
  }
`,Ue=`
  attribute float aK, aSide, aWhich;
  uniform vec4 uRInfo[3]; uniform vec3 uRPos[3], uRPiv[3]; uniform vec2 uRes; uniform float uStep, uLife, uMinPx, uMaxPx;
  varying vec3 vCol; varying float vV, vPx;
  ${Le}
  ${ve}
  vec3 track(int w, float tk){ return place(pose(uRPos[w], uRInfo[w], uRPiv[w], fract(tk/1.44 + uBeatOff)), tk); }
  void main(){
    int w = int(aWhich + 0.5);
    float tk = aK < 0.5 ? uT : (floor(uT/uStep) - (aK - 1.))*uStep;      // the head grows with the bird
    float age = max(uT - tk, 0.);
    mat4 mv = viewMatrix * modelMatrix;
    vec4 a = mv * vec4(track(w, tk), 1.);
    vec4 cf = projectionMatrix * (mv * vec4(track(w, tk + 0.04), 1.)), cb = projectionMatrix * (mv * vec4(track(w, tk - 0.04), 1.));
    vec4 ca = projectionMatrix * a;
    vec2 sf = cf.xy / max(abs(cf.w), 0.001), sb = cb.xy / max(abs(cb.w), 0.001);
    vec2 dir = (sf - sb) * uRes; float dl = length(dir);
    vec2 nrm = dl > 0.0001 ? vec2(-dir.y, dir.x) / dl : vec2(0., 1.);
    float dist = max(-a.z, 0.5);
    float wpx = clamp(0.35 * uRes.y * projectionMatrix[1][1] / dist * 0.5, uMinPx, uMaxPx);   // half-width: 0.7 m wide, floor and cap in pixels
    float life = mix(uLife, min(uLife, 9.), smoothstep(320., 640., dist));                   // far off, only the newest stretch
    wpx *= smoothstep(0.25, 1.5, age) * mix(1., 0.45, clamp(age / max(life, 1.), 0., 1.)) * (1. - smoothstep(life * 0.72, life, age));
    if (aWhich > 1.5) wpx *= smoothstep(1.6, 4.5, age);                                       // the bill's line begins a body length behind the bird: never drawn through it
    wpx *= smoothstep(14., 55., dist);                                                       // a trace passing by the lens thins away: no line crosses the frame edge to edge
    wpx *= step(0.45 * uMinPx, wpx);                                                         // never a sub-pixel hair: it ends cleanly
    ca.xy += nrm * aSide * wpx / uRes * ca.w;
    float st = depthSteps(dist);
    vec3 sky = skyTone((modelMatrix * vec4(birdPos(tk), 1.)).xyz - cameraPosition);
    vCol = mix(ageColour(age, aWhich > 1.5 ? 3. : 0.), sky, clamp(uDepthK*min(st, 1.) + 0.45*smoothstep(260., 620., dist), 0., 0.7));
    vV = aSide; vPx = wpx;
    gl_Position = ca;
  }
`,Ke=`
  uniform vec3 uInkF; varying vec3 vCol; varying float vV, vPx;
  void main(){
    float edge = smoothstep(vPx - 2.2, vPx - 1.0, abs(vV)*vPx) * step(5., vPx);   // ink rims once the band is wide enough
    gl_FragColor = vec4(mix(vCol, uInkF, edge), 1.);
  }
`,Xe=(e,t)=>{const u=new x.Color(e).getHexString(),l=[0,2,4].map(r=>oe(parseInt(u.slice(r,r+2),16)/255*t,0,1));return new x.Color().setRGB(l[0],l[1],l[2],x.SRGBColorSpace)},Ze=(e,t,s)=>{const u=new x.Color(e).getHexString(),l=new x.Color(t).getHexString(),r=[0,2,4].map(m=>S(parseInt(u.slice(m,m+2),16),parseInt(l.slice(m,m+2),16),s)/255);return new x.Color().setRGB(r[0],r[1],r[2],x.SRGBColorSpace)};function Te(e){const t=new x.Color(e),s={};return t.getHSL(s,x.SRGBColorSpace),new x.Color().setHSL((s.h+.5)%1,.45,.4,x.SRGBColorSpace)}async function ot(e,t={}){const s=e.rng.fork?e.rng.fork("gyre"):e.rng,u=t.palette&&t.palette.length>=7?t.palette:ke,l=u.every((o,g)=>String(o).toUpperCase()===ke[g]),r=oe(t.detail??e.quality?.detail??1,.6,1),m=t.variant||(()=>{const o=s();return o<.6?"crane":o<.8?"condor":"frigate"})(),d=Ne(t.exposure??1),p={...fe,N:Math.round(oe(t.shells??fe.N,20,fe.N))},f=t.ringTime??40,h=-Math.PI/2-ae*f/p.PERIOD,y=oe(t.ribbonLife??40,6,60),R=t.ribbonMaxFrac??.009,c=.5+s.range(-.04,.04),b=[u[0],Ze(u[0],u[1],.55),u[1],u[2],u[3]].map(o=>new x.Color(o)),a=t.comps?t.comps.map((o,g)=>o?new x.Color(o):Te(b[g])):l?["#5B4A86","#1F6E86",u[4],"#2F8A4E","#C4622A"].map(o=>new x.Color(o)):b.map(Te),n=new x.Color(u[5]),i=new x.Color(u[6]),v={uT:{value:12},uClimb:{value:t.climb??1},uY0:{value:t.y0??p.Y0},uDepthK:{value:t.depthK??.16},uDis:{value:(p.N-oe(t.crumble??14,6,40))*p.D},uA0:{value:h+(t.phase??0)},uBeatOff:{value:c},uSpread:{value:.05},uHue:{value:b.map(o=>d(o))},uMid:{value:b.map((o,g)=>d(t.mids?.[g]?new x.Color(t.mids[g]):Xe(o,.72)))},uFarHue:{value:t.farHue??.8},uComp:{value:a.map(o=>d(o))},uCream:{value:d(n)},uInk:{value:d(i)},uInkF:{value:d(i)},uAges:{value:(t.bands??[.09,.16,.495,t.blueFrom??.77]).map(o=>o*p.N*p.D)},uSkyWarm:{value:d("#EBD9A8")},uSkyCool:{value:d("#4F9F92")},uSunDir:{value:new x.Vector3(-1,.53,0).normalize()},uLineW:{value:1.4},uBack:{value:.8},uYoung:{value:t.young??1},uRes:{value:new x.Vector2(1280,720)},uStep:{value:.06},uMinPx:{value:.75},uMaxPx:{value:2},uLife:{value:y},uRInfo:{value:[]},uRPos:{value:[]},uRPiv:{value:[]}},w=(o,g=Ve,A=Fe)=>new x.ShaderMaterial({uniforms:v,defines:o,vertexShader:g,fragmentShader:A,side:x.DoubleSide,fog:!1,toneMapped:!1}),k=new x.Group;k.name="gyre";const C=(o,g,A,K=0)=>{const O=new x.Mesh(o,g);return O.name=A,O.frustumCulled=!1,O.renderOrder=K,k.add(O),O};await e.yield?.();const M=Ee(s.fork?s.fork("shell"):s,m,!1);await e.yield?.();const F=M.S.geometry(!0),N=new Float32Array(p.N);for(let o=0;o<p.N;o++)N[o]=o;F.setAttribute("aI",new x.InstancedBufferAttribute(N,1)),F.instanceCount=p.N,C(F,w({SHELL:1}),"shells"),await e.yield?.();const Y=Ee(s.fork?s.fork("live"):s,m,!0);await e.yield?.(),C(Y.S.geometry(!1),w({LIVE:1}),"bird"),await e.yield?.();const Z=[M.tipR,M.tipL,{pos:M.bill,pivot:M.neckBase,j:0,seg:1,side:0}];if(v.uRInfo.value=Z.map((o,g)=>new x.Vector4(o.seg??5,o.j,g===0?1:g===1?-1:0,0)),v.uRPos.value=Z.map(o=>new x.Vector3(...o.pos)),v.uRPiv.value=Z.map(o=>new x.Vector3(...o.pivot)),t.ribbons!==!1){const o=r<.75?.09:.06,g=Math.ceil(y/o)+1;v.uStep.value=o;const A=[],K=[],O=[],G=[],L=[];for(let J=0;J<3;J++){const re=A.length;for(let V=0;V<=g;V++)A.push(V,V),K.push(-1,1),O.push(J,J),L.push(0,0,0,0,0,0);for(let V=0;V<g;V++){const _=re+V*2;G.push(_,_+1,_+2,_+1,_+3,_+2)}}const U=new x.BufferGeometry;U.setAttribute("position",new x.Float32BufferAttribute(L,3)),U.setAttribute("aK",new x.Float32BufferAttribute(A,1)),U.setAttribute("aSide",new x.Float32BufferAttribute(K,1)),U.setAttribute("aWhich",new x.Float32BufferAttribute(O,1)),U.setIndex(G),C(U,w({},Ue,Ke),"ribbons")}await e.yield?.();const $={shellTris:M.S.count(),birdTris:Y.S.count()};if(t.needle!==!1){await e.yield?.();const o=Je(s.fork?s.fork("needle"):s,d,u);$.needleTris=o.attributes.position.count/3,C(o,w({},Ye,Fe),"needle"),await e.yield?.()}if(t.swifts!==!1){const o=Ce(s.fork?s.fork("swifts"):s),g=[],A=[],K=Math.max(3,Math.round(5*r));for(let L=0;L<8;L++)for(let U=0;U<K;U++){const J=L%3===2?-1:1,re=J*(3.2+U*1.9+L%2*.8+s.range(-.3,.3)),V=(Math.abs(re)-Q[0])/(te[0]-Q[0]),_=[re,1.5-.06*V,S(5.2,4.5,V)-.25],le=s.range(.9,1.15),ce=s.range(-.5,.5),me=Math.cos(ce),ge=Math.sin(ce),De=o.count(),X=(H,ie,be)=>[_[0]+(H*me+be*ge)*le,_[1]+ie*le,_[2]+(-H*ge+be*me)*le];o.set({seg:3,j:0,side:J,pivot:[Q[0]*J,Q[1],Q[2]]});const pe=X(0,.42,.42),xe=X(0,.56,.12),ye=X(0,.4,-.3),de=X(0,.16,-.62),we=X(0,.1,.05);for(const H of[1,-1]){const ie=X(H*.17,.3,.02);o.tri(pe,xe,ie,0,[H,.5,0]),o.tri(xe,ye,ie,H>0?0:1,[H,.5,0]),o.tri(ye,de,ie,1,[H,.3,0]),o.tri(pe,ie,we,3,[H,-.5,0]),o.tri(ie,de,we,1,[H,-.5,0]),o.tri(X(H*.16,.44,.12),X(H*.2,.3,-.25),X(-H*.08,.2,-1.15),2,[H,1,0]),o.tri(de,X(H*.16,.14,-.95),X(H*.02,.15,-.7),4,z)}o.tri(pe,X(.03,.4,.4),X(0,.37,.62),4,[1,0,0]);for(let H=De;H<o.count();H++)g.push(L*3,L*3,L*3),A.push(_,_,_)}const O=o.geometry(!1),G=O.attributes.aCen;for(let L=0;L<G.count;L++)G.setXYZ(L,A[L][0],A[L][1],A[L][2]);O.setAttribute("aI",new x.Float32BufferAttribute(g,1)),$.swiftTris=o.count(),C(O,w({PERCH:1}),"swifts")}let se=null;const ee=(o,g=new x.Vector3)=>{const A=h+ae*o/p.PERIOD;return g.set(p.R*Math.cos(A),p.Y0+p.CLIMB*o,-p.R*Math.sin(A))},B=(o,g=new x.Vector3)=>{const A=h+ae*o/p.PERIOD;return g.set(-Math.sin(A),.0579,-Math.cos(A)).normalize()},P=(o,g,A)=>new x.Vector3(o,g,A),D=Math.round(ee(f).y-(t.seatDrop??11.6)),q=[],j=[],E=[];for(let o=23.5;o<=29.01;o+=1.1)q.push(ee(o-p.PERIOD).add(P(0,-10,0)));for(let o=30;o<=36.01;o+=1.2){const g=ee(o-.5),A=(p.R+52)/p.R;j.push(P(g.x*A,ee(o).y+8,g.z*A))}{const o=h+ae*(23.5-p.PERIOD)/p.PERIOD;for(let g=0;g<=6;g++){const A=o-(1-g/6)*1.745;E.push(P(190*Math.cos(A),S(48,237,g/6),-190*Math.sin(A)))}}const ue={portalSeat:{position:P(0,D,p.R),forward:P(1,0,0),radius:7},finalLeg:[P(-150,D,p.R),P(-75,D,p.R),P(0,D,p.R),P(60,D,p.R)],flyThrough:[...q,...j,P(-150,D,p.R),P(0,D,p.R)],arcade:q,beside:j,climb:E,entry:{position:P(0,56,760),lookAt:P(0,170,0)},summit:P(0,320,0),basinRadius:250,helixRadius:p.R,wingReach:34},W=new x.Vector2;return{object:k,radius:150,height:340,center:P(0,170,0),anchors:ue,parts:$,variant:m,uniforms:v,birdAt:ee,headingAt:B,setProgress(o){se=p.T_END*o},setClock(o){se=o},setSky(o,g,A){o&&(v.uSkyWarm.value=d(o)),g&&(v.uSkyCool.value=d(g)),A&&v.uSunDir.value.copy(A).normalize()},update(o,g,A){v.uT.value=se??g,e.renderer?.getDrawingBufferSize&&(e.renderer.getDrawingBufferSize(W),W.x>0&&(v.uRes.value.copy(W),v.uMinPx.value=oe(W.y/600,1.5,3)*.5,v.uMaxPx.value=Math.max(W.y*R*.5,v.uMinPx.value*1.6)))},dispose(){},ground:!0,groundY:0}}function $e(){const e=[],t=[],s=[],u=[],l=(r,m,d,p,f,h)=>{const y=m[0]-r[0],R=m[1]-r[1],c=m[2]-r[2],b=d[0]-r[0],a=d[1]-r[1],n=d[2]-r[2];let i=[R*n-c*a,c*b-y*n,y*a-R*b];if(h&&i[0]*h[0]+i[1]*h[1]+i[2]*h[2]<0){const M=m;m=d,d=M,i=[-i[0],-i[1],-i[2]],f===1?f=2:f===2&&(f=1)}const v=typeof p=="function"?p(i):p;e.push(...r,...m,...d);const w=f===3?1:0,k=f===1?1:0,C=f===2?1:0;t.push(1,k,C,w,1,C,w,k,1);for(let M=0;M<3;M++)s.push(v.r,v.g,v.b),u.push(0,160,0,0)};return{tri(r,m,d,p,f){l(r,m,d,p,0,f)},quad(r,m,d,p,f,h){l(r,m,d,f,1,h),l(r,d,p,f,2,h)},geometry(){const r=new x.BufferGeometry;return r.setAttribute("position",new x.Float32BufferAttribute(e,3)),r.setAttribute("aBary",new x.Float32BufferAttribute(t,3)),r.setAttribute("aColor",new x.Float32BufferAttribute(s,3)),r.setAttribute("aCen",new x.Float32BufferAttribute(u,4)),r}}}function Je(e,t,s){const u=$e(),l=11,r=t("#E9DDC2"),m=t("#D3C49C"),d=t("#B7ABBF"),p=t(s[5]),f=t("#5B4A86"),h=t(s[4]),y=t("#3F3A5E"),R=t("#DCCFAF"),c=t("#C2B48E"),b=t("#A79BB6"),a=t("#8D80AA"),n=t("#7C6FA0"),i=(B,P)=>D=>{const q=Math.hypot(D[0],D[1],D[2])||1,j=D[1]/q,E=(-D[0]*.85+D[2]*.25)/q;return j>.6?p:B?E>-.15?B:y:E>.35?P?R:r:E>-.3?P?c:m:E>-.8?P?b:d:P?n:a},v=[];for(let B=0;B<l;B++)v.push((B+e.range(-.32,.32))/l*ae);const w=v.map(()=>e.range(.8,1.18)),k=B=>4.2+18.8*Math.pow(1-oe(B/286,0,1),1.35)+5*Math.pow(1-oe(B/60,0,1),2);let C=e.range(0,ae),M=-6,F=null;const N=(B,P,D,q)=>v.map((j,E)=>[Math.cos(j+D)*P*(w[E]+q[E]),B,Math.sin(j+D)*P*(w[E]+q[E])]);let Y=v.map(()=>0),Z=0;for(;M<284;){const B=Z>1&&e.chance(.36),P=B?e.range(2.5,5):e.range(8,19)*(M<40?.7:1),D=Math.min(M+P,286),q=B?e.range(.8,1.8):e.range(-1.6,.9),j=k(M)+q,E=k(D)+q-(B?0:e.range(0,.6)),ue=B?e.chance(.55)?f:h:null,W=N(M,j,C,Y),T=N(D,E,C+e.range(-.03,.03),Y);if(F)for(let o=0;o<l;o++){const g=(o+1)%l;u.quad(F[o],F[g],W[g],W[o],i(null),[0,j>k(M)?-1:1,0])}for(let o=0;o<l;o++){const g=(o+1)%l;u.quad(W[o],W[g],T[g],T[o],i(ue,(Z+(o%4===0?1:0))%2),[W[o][0]+W[g][0],0,W[o][2]+W[g][2]])}if(!B&&e.chance(.55)){const o=e.int(0,l-1),g=(o+1)%l,A=e.range(2.5,6)*(.5+j/26),K=S(M,D,e.range(.2,.7)),O=e.range(1.5,4),G=he(W[o],T[o],.5),L=he(W[g],T[g],.5);G[1]=L[1]=K;const U=(G[0]+L[0])/2,J=(G[2]+L[2])/2,re=Math.hypot(U,J)||1,V=[U/re*A,0,J/re*A],_=[U+V[0],K-O*.3,J+V[2]],le=[G[0],K-O*2.2,G[2]],ce=[L[0],K-O*2.2,L[2]];u.tri(G,L,_,i(null),z),u.tri(G,_,le,i(null),[G[0]-L[0],0,G[2]-L[2]]),u.tri(L,_,ce,i(null),[L[0]-G[0],0,L[2]-G[2]]),u.tri(le,ce,_,i(null),[V[0],-A,V[2]])}Y=Y.map(o=>oe(o+e.range(-.05,.05),-.14,.14)),C+=e.range(-.05,.09),F=T,M=D,Z++}const $=F.reduce((B,P)=>B+P[0],0)/l,se=F.reduce((B,P)=>B+P[2],0)/l;for(let B=0;B<l;B++)u.tri(F[B],F[(B+1)%l],[$,289,se],p,z);const ee=e.range(0,ae);return[[1,320,3.3],[-1,309,2.7]].forEach(([B,P,D])=>{const q=Math.cos(ee)*B*2.9,j=Math.sin(ee)*B*2.9,E=[];[280,296,P-7].forEach((T,o)=>{const g=D*(1-o*.24),A=1+o*.22;E.push([0,1,2,3,4].map(K=>{const O=ee+K/5*ae+o*.25;return[q*A+Math.cos(O)*g,T,j*A+Math.sin(O)*g]}))});for(let T=0;T<2;T++)for(let o=0;o<5;o++){const g=(o+1)%5;u.quad(E[T][o],E[T][g],E[T+1][g],E[T+1][o],i(T===1&&B>0?f:null),[E[T][o][0]+E[T][g][0]-2*q,0,E[T][o][2]+E[T][g][2]-2*j])}const W=[q*1.75,P,j*1.75];for(let T=0;T<5;T++){const o=(T+1)%5;u.tri(E[2][T],E[2][o],W,i(null),[E[2][T][0]+E[2][o][0]-2*q*1.44,.4,E[2][T][2]+E[2][o][2]-2*j*1.44])}}),u.geometry()}const Qe=[[30.7,.3,70,-22],[31.8,0,67,-20],[32.9,-.2,66,-19],[34,-.1,74,-16],[35.2,.3,88,-13],[36.4,.9,90,-9]],et=[[-170,3,92],[-135,1,107],[-95,0,110],[-50,0,110]];function at(e,t={}){const s=e.anchors,u=fe,l=[],r=(c,b,a,n)=>l.push({p:new x.Vector3(c,b,a),t:n}),m=t.entryZ??660,d=e.uniforms.uA0.value;r(0,56,m,0),r(0,56,m-70,null),r(0,55.5,m-170,null),r(4,50,m-300,null),r(20,48,262,null);const p=d+ae*(23.5-u.PERIOD)/u.PERIOD,f=(c,b,a,n)=>{const i=p+c;r(b*Math.cos(i),a,-b*Math.sin(i),n)},h=t.climbRadius??164;f(-1.745,h+4,48,12.5),f(-1.42,h,80,null),f(-1.1,h,116,null),f(-.8,h,152,null),f(-.52,h-2,186,null),f(-.27,h-10,214,null),f(-.08,134,231,null);for(let c=0;c<s.arcade.length-(t.arcadeSkip??1);c++){const b=s.arcade[c];r(b.x,b.y+(t.arcadeDrop??-8),b.z,23.5+1.1*c)}{const[c,b,a]=t.exit??[.1,150,-16],n=e.birdAt(29+c-u.PERIOD),i=b/u.R;r(n.x*i,n.y+a,n.z*i,29+c)}const y=t.E??Qe;for(const[c,b,a,n]of y){const i=e.birdAt(c-b),v=(u.R+a)/u.R;r(i.x*v,e.birdAt(c).y+n,i.z*v,c)}const R=s.portalSeat.position.y;for(const[c,b,a]of t.F??et)r(c,R+b,a,null);return r(0,R,110,t.tEnd??45.7),l}export{ve as GLSL_COLOUR,Ge as GLSL_INK,Le as GLSL_MOTION,fe as GYRE,ot as buildHero,at as flightPlan,Ne as makeTone,$e as stillSoup};
