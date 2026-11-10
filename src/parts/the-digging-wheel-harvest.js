import*as D from"three";import{Geo as o0,GLASS as W,HARVEST as s0,fixedRng as X,addShadowBox as a0}from"./the-digging-wheel.js";import{fieldY as n0}from"./the-digging-wheel-land.js";import{GLSL_STEEL as i0}from"./the-digging-wheel-machine.js";const P=6.5,j={combine:[[2.6,1.35],[2.6,-1.35],[-2.9,1.25],[-2.9,-1.25]],tractor:[[1.45,.85],[1.45,-.85],[-1.2,.88],[-1.2,-.88]],trailer:[[1.95,.95],[1.95,-.95],[-1.95,.95],[-1.95,-.95]]},E=[.05,.254,.231],M=[.815,.738,.546],G=[.323,.042,.023],q=[.254,.266,.246],Z=[.723,.402,.068],z=[.035,.035,.037],w=[.072,.068,.066],U=[.12,.12,.125],J=[.9,.86,.7],H=[.022,.022,.024],c0=[.42,.42,.4],f0=[.4,.4,.38],$=[.42,.06,.03],T=(t,e)=>[t[0]*e,t[1]*e,t[2]*e],h0=9,k=0,F=1,r0=2,l0=3,_=4,d0=5,u0=6,S=7,L=8,v0=9,m0=`
  varying vec4 vOwn; varying vec3 vKind;
  vec3 movedMore(vec3 p, vec4 mark, vec4 aux){ vOwn = aux; vKind = mark.yzw; return p; }
`,p0=i0+`
  varying vec4 vOwn; varying vec3 vKind;
  const vec3 HV_STRAW = vec3(0.60, 0.47, 0.24), HV_HOLLOW = vec3(0.030, 0.028, 0.024);
  // WHAT THE FIELD DOES TO A FACE. A: the ground's level under the vehicle (under -50: a part that takes none of it).
  // Rust in blotches low on the walls; the field's dust thick on the skirts with a ragged upper edge and thinning above
  // it; chaff and straw dust lying on what is level (chaff: how much); grime in the face's own edge
  vec3 hvWeather(vec3 col, vec3 p0, vec3 n, float foot, float edge, float A, float chaff){
    if (A < -50.) return col;
    float h = p0.y - A, wall = 1. - smoothstep(0.5, 0.8, abs(n.y)), top = smoothstep(0.6, 0.9, n.y);
    float rag = mix(vnoise(vec3(p0.x * 1.9, p0.y * 0.6, p0.z * 1.9)), 0.5, smoothstep(0.15, 0.5, foot)), up = 0.35 + 0.6 * rag;
    float rb = mix(smoothstep(0.50, 0.76, vnoise(p0 * 2.3 + 17.)), 0.24, smoothstep(0.25, 0.8, foot));
    col = mix(col, ST_RUST * 1.5, wall * 0.7 * rb * (1. - smoothstep(0.5, 1.9, h)));
    float dust = wall * (0.60 * (1. - smoothstep(0.3 * up, up, h)) + 0.16 * (1. - smoothstep(up, up + 1.1, h)));
    col = mix(col, ST_DUST * (0.8 + 0.12 * vnoise(p0 * 2.7)), dust);
    col = mix(col, HV_STRAW, top * chaff * (0.05 + 0.5 * mix(smoothstep(0.48, 0.74, fbm(p0 * 1.3)), 0.2, smoothstep(0.4, 1.2, foot))));   // (in drifts: the paint shows between them)
    return col * (1. - 0.14 * (1. - smoothstep(0., 0.07, edge)) * (1. - smoothstep(0.03, 0.14, foot)));
  }
  // PAINT. A: the ground's level; B: into how many panels the face is parted along its longer side (0 or 1: one sheet),
  // a dark seam between each two and a latch's dot beside each seam; B under 0: the same count, and little chaff lies on
  // it (the tractor, which stood out of the combine's dust: its red is to be seen from above)
  vec3 hvPaint(vec3 base, vec3 p0, vec3 n, float foot, vec2 uv, vec2 hf, float edge, float A, float B){
    vec3 col = base * (0.93 + 0.14 * vnoise(p0 * 1.3)); float nb = abs(B);
    col *= 1. + 0.16 * (fbm(p0 * 0.55 + 3.) - 0.5) * (1. - smoothstep(1., 3., foot));       // faded by the sun in patches
    if (nb > 1.5 && hf.x < 500.) { bool lu = hf.x >= hf.y; float along = lu ? uv.x : uv.y, half1 = lu ? hf.x : hf.y, across = lu ? uv.y : uv.x;
      float S = 2. * half1 / nb, d = stOff(along + half1, S);
      col *= 1. - 0.65 * stLine(d, 0.04, foot);
      vec2 dd = vec2(abs(d) - 0.14, across); col *= 1. - 0.5 * (1. - smoothstep(0.045 - 0.5 * foot, 0.045 + 0.5 * foot, length(dd))) * (1. - smoothstep(0.03, 0.09, foot)); }
    return hvWeather(col, p0, n, foot, edge, A, B < -0.5 ? 0.4 : 1.);
  }
  // PANE: dark glass holding a little of the sky, deeper below, in a rubber seal (the machine's own law for its panes)
  vec3 hvPane(vec3 base, float foot, vec2 uv, vec2 hf, float edge){
    float up = clamp(0.5 + 0.5 * uv.y / max(hf.y, 0.01), 0., 1.);
    vec3 col = mix(base, vec3(0.075, 0.10, 0.135), 0.2 + 0.6 * up * up);
    col = mix(col, ST_DUST * 0.4, 0.2 * (1. - up));
    return mix(col, vec3(0.015), stLine(edge, 0.07, foot));
  }
  // TYRE: on its round the tread's lugs, two to a facet, raked back either way from the tread's middle; on its wall a
  // line round it; the field's dust on all of it. A: the ground's level
  vec3 hvTyre(vec3 base, vec3 p0, float foot, vec2 uv, vec2 hf, float A){
    vec3 col = base * (0.8 + 0.4 * vnoise(p0 * 4.1));
    if (hf.x < 500.) col *= 1.3 * (1. - 0.6 * stLine(stOff(uv.x + 0.55 * abs(uv.y), hf.x), 0.42 * hf.x, foot));
    else col *= 1. - 0.35 * stLine(uv.y - 0.84 * hf.y, 0.05, foot);
    return mix(col, ST_DUST * 0.5, 0.12 + 0.24 * vnoise(p0 * 2.3) + 0.25 * (1. - smoothstep(0.1, 0.9, p0.y - A)));
  }
  // RIM: a wheel's painted disc: a dark hub in its middle, the dish's ring, dust
  vec3 hvRim(vec3 base, vec3 p0, float foot, vec2 uv, vec2 hf){
    vec3 col = base * (0.9 + 0.2 * vnoise(p0 * 3.1));
    if (hf.x > 500.) { float f = 0.5 * foot;
      col = mix(col, base * 0.25, 1. - smoothstep(0.26 * hf.y - f, 0.26 * hf.y + f, uv.y));
      col *= 1. - 0.4 * stLine(uv.y - 0.68 * hf.y, 0.05 * hf.y + 0.02, foot); }
    return mix(col, ST_DUST, 0.18 + 0.2 * vnoise(p0 * 2.1));
  }
  // LOUVRE: slats A apart in a frame (the machine's own law for its grilles)
  vec3 hvLouvre(vec3 base, float foot, vec2 uv, vec2 hf, float edge, float A){
    float f = fract(uv.y / A), k = 1. - smoothstep(0.3 * A, 0.7 * A, foot);
    vec3 col = base * mix(0.62, mix(0.26, 1.02, smoothstep(0.15, 0.8, f)), k);
    return mix(base * 1.5, col, smoothstep(0.05 - 0.5 * foot, 0.05 + 0.5 * foot, edge));
  }
  // REEL: the combine's reel, drawn on a six-sided prism (its ends lie against the end sheets). On a side (u across it, v along the reel): a bar along
  // each long edge (two faces' edges make one bar at each of the six corners), tines hanging in from one bar, three
  // spiders' arms across; between them the dark that is seen through a reel. On an end: a spider (a hub, an arm to each
  // side's middle, a rim)
  vec3 hvReel(vec3 base, vec3 p0, float foot, vec2 uv, vec2 hf, float edge){
    vec3 col = base * (0.9 + 0.2 * vnoise(p0 * 2.3)); float on;
    if (hf.x < 500.) { bool lu = hf.x < hf.y; float across = lu ? uv.x : uv.y, along = lu ? uv.y : uv.x, ha = lu ? hf.x : hf.y, hl = lu ? hf.y : hf.x;
      on = stLine(ha - abs(across), 0.30, foot);                                           // the bars (each face holds half of two)
      on = max(on, stLine(stOff(along + hl, 2. * hl / 3.), 0.12, foot));                   // the spiders' arms
      float tine = stLine(stOff(along, 0.16), 0.035, foot) * step(0., across) * (1. - smoothstep(0.26, 0.30, ha - across));
      on = max(on, 0.8 * tine); }
    else on = max(max(stLine(uv.x, 0.09, foot), stLine(edge, 0.12, foot)), 1. - smoothstep(0.14 - 0.5 * foot, 0.14 + 0.5 * foot, uv.y));
    return mix(HV_HOLLOW, mix(col, ST_DUST, 0.15), on);
  }
  // BOARDS: a trailer's side: boards 0.26 m deep, one over another, a dark joint between each two; a stake standing
  // proud every metre along it, its shade beside it; a rail along the head. A: the ground's level
  vec3 hvBoards(vec3 base, vec3 p0, vec3 n, float foot, vec2 uv, vec2 hf, float edge, float A){
    float row = floor((uv.y + hf.y) / 0.26);
    vec3 col = base * (0.9 + 0.2 * vnoise(p0 * 1.7)) * (1. + 0.16 * (stHash(vec2(row, floor(hf.x * 7.))) - 0.5) * (1. - smoothstep(0.1, 0.26, foot)));
    col *= 1. - 0.55 * stLine(stOff(uv.y + hf.y, 0.26), 0.03, foot);
    float span = 2. * hf.x - 0.24, ds = stOff(uv.x + hf.x - 0.12, span / max(1., floor(span / 0.96 + 0.5)));   // (a stake 0.12 m in from either end, the others evenly between, a metre apart or nearly)
    col *= (1. + 0.30 * stLine(ds, 0.13, foot)) * (1. - 0.45 * stLine(ds - 0.10, 0.06, foot));
    col *= 1. + 0.22 * stLine(hf.y - uv.y - 0.06, 0.12, foot);
    return hvWeather(col, p0, n, foot, edge, A, 0.6);
  }
  // GRAIN: the heap's gold, speckled, a little darker where it lies steep
  vec3 hvGrain(vec3 base, vec3 p0, vec3 n, float foot){
    float sp = mix(vnoise(p0 * 23.), 0.5, smoothstep(0.02, 0.09, foot));
    return base * (0.80 + 0.22 * fbm(p0 * 1.9) + 0.16 * (sp - 0.5)) * (0.86 + 0.14 * smoothstep(0.6, 0.95, n.y));
  }
  // IRON: a chassis, an axle, a drawbar, the exhaust: cast dark, rusted in patches, the field's dust on it. A: the ground's level
  vec3 hvIron(vec3 base, vec3 p0, vec3 n, float foot, float edge, float A){
    vec3 col = base * (0.8 + 0.4 * fbm(p0 * 2.3));
    col = mix(col, ST_RUST * 0.9, mix(0.3, 0.6 * smoothstep(0.3, 0.75, vnoise(p0 * 3.7 + 11.)), 1. - smoothstep(0.1, 0.4, foot)));
    return mix(col, ST_DUST * 0.7, A < -50. ? 0.08 : 0.2 + 0.3 * (1. - smoothstep(0.2, 1.2, p0.y - A)));
  }
  // AUGER: the header's feed auger: a tube whose flighting is drawn as a helix running to the middle from either end.
  // A: which of the tube's B facets this is (the helix goes on from facet to facet)
  vec3 hvAuger(vec3 base, vec3 p0, float foot, vec2 uv, vec2 hf, float A, float B){
    vec3 col = base * (0.85 + 0.3 * vnoise(p0 * 3.3));
    float turn = (A + 0.5 + 0.5 * uv.x / hf.x) / B, d = stOff(abs(uv.y) - 0.55 * turn, 0.55);
    col *= 0.5 + 0.8 * stLine(d, 0.17, foot);
    return mix(col, ST_DUST, 0.12);
  }
  vec3 surface(vec3 base, vec3 p0, vec3 wp, vec3 n, float foot){
    float id = floor(vKind.x + 0.5), A = vKind.y, B = vKind.z;
    vec2 uv = vOwn.xy, hf = vOwn.zw; float edge = min(hf.x - abs(uv.x), hf.y - abs(uv.y));   // metres in from the face's nearest edge
    vec3 col; float k = 0.5;                                  // (k: how much of the steel's light the face takes: a vehicle's half, as the coach's; the grain none)
    if (id < 0.5) col = hvPaint(base, p0, n, foot, uv, hf, edge, A, B);
    else if (id < 1.5) col = hvPane(base, foot, uv, hf, edge);
    else if (id < 2.5) col = hvTyre(base, p0, foot, uv, hf, A);
    else if (id < 3.5) col = hvRim(base, p0, foot, uv, hf);
    else if (id < 4.5) col = hvLouvre(base, foot, uv, hf, edge, A);
    else if (id < 5.5) col = hvReel(base, p0, foot, uv, hf, edge);
    else if (id < 6.5) col = hvBoards(base, p0, n, foot, uv, hf, edge, A);
    else if (id < 7.5) { col = hvGrain(base, p0, n, foot); k = 0.; }
    else if (id < 8.5) col = hvIron(base, p0, n, foot, edge, A);
    else col = hvAuger(base, p0, foot, uv, hf, A, B);
    return stLight(col, n, wp, k);
  }
`;function Y(t,e){const o=Math.cos(t.yaw),n=Math.sin(t.yaw),s=e.length,i=e.map(([b,g])=>n0(t.x+g*o+b*n,t.z-g*n+b*o));let a=0,h=0,c=0,f=0,r=0,d=0,u=0;e.forEach(([b,g],R)=>{a+=b/s,h+=g/s,c+=i[R]/s}),e.forEach(([b,g],R)=>{f+=(b-a)*(b-a),r+=(b-a)*(i[R]-c),d+=(g-h)*(g-h),u+=(g-h)*(i[R]-c)});const m=r/f,v=u/d,p=c-m*a-v*h,A=new D.Vector3(n,m,o).normalize(),l=new D.Vector3().crossVectors(A,new D.Vector3(o,v,-n)).normalize(),y=new D.Vector3().crossVectors(l,A);return{at:(b,g,R)=>[t.x+b*A.x+g*l.x+R*y.x,p+b*A.y+g*l.y+R*y.y,t.z+b*A.z+g*l.z+R*y.z],y0:p,U:A,N:l,W:y,yaw:t.yaw,c:o,s:n}}function t0(){const t=s0,e=Y(t.combine,j.combine),o=Y(t.tractor,j.tractor),n=Y(t.trailer,j.trailer),s=(r,d,u,m)=>(u-d.x)*r.s+(m-d.z)*r.c,i=(r,d,u,m)=>(u-d.x)*r.c-(m-d.z)*r.s,a=s(e,t.combine,t.combine.x,t.pass.knife),h=Math.abs(i(e,t.combine,t.pass.x1,t.combine.z)-i(e,t.combine,t.pass.x0,t.combine.z))/2,c=o.at(-2.3,.65,0),f=s(n,t.trailer,c[0],c[2]);return{C:e,T:o,R:n,knife:a,half:h,reach:f}}function O(t,e,o,n,s,i,a,h){const c=(o-e)/2,f=(s-n)/2,r=(a-i)/2,d=t.at((e+o)/2,(n+s)/2,(i+a)/2),u=[t.c,0,-t.s],m=[0,1,0],v=[t.s,0,t.c],p=(A,l)=>Math.abs(A.x*l[0]+A.y*l[1]+A.z*l[2]);return h?{c:d,h:[u,m,v].map(A=>p(t.W,A)*r+p(t.N,A)*f+p(t.U,A)*c),yaw:t.yaw}:{c:d,h:[(r-p(t.W,m)*f-p(t.W,v)*c)/p(t.W,u),(f-p(t.N,u)*r-p(t.N,v)*c)/p(t.N,m),(c-p(t.U,u)*r-p(t.U,m)*f)/p(t.U,v)],yaw:t.yaw}}const e0=[-1,-1,1,-1,1,1,-1,-1,1,1,-1,1],B=(t,e,o)=>[t,e,o],L0=(t,e,o)=>[o,e,t],b0=(t,e,o)=>[t,o,e];class y0{constructor(e=18e3){this.g=new o0(e),this.at=(o,n,s)=>[o,n,s],this.kind(k)}kind(e,o=0,n=0){return this.g.mark=[h0,e,o,n],this}get triangles(){return this.g.triangles}quadW(e,o,n,s,i){const a=.5*Math.hypot(o[0]-e[0],o[1]-e[1],o[2]-e[2]),h=.5*Math.hypot(s[0]-e[0],s[1]-e[1],s[2]-e[2]);let c=this.g.triangles*12;this.g.quad(e,o,n,s,i);const f=this.g.A;for(let r=0;r<12;r+=2)f[c++]=e0[r]*a,f[c++]=e0[r+1]*h,f[c++]=a,f[c++]=h}fanW(e,o,n,s){const i=n[0]-o[0],a=n[1]-o[1],h=n[2]-o[2],c=e[0]-o[0],f=e[1]-o[1],r=e[2]-o[2],d=Math.hypot(i,a,h)||1,u=(c*i+f*a+r*h)/d,m=Math.hypot(f*h-r*a,r*i-c*h,c*a-f*i)/d;let v=this.g.triangles*12;this.g.tri(e,o,n,s);const p=this.g.A,A=[0,-u,d-u];for(let l=0;l<3;l++)p[v++]=A[l],p[v++]=l?m:0,p[v++]=1e3,p[v++]=m}quad(e,o,n,s,i){const a=this.at;this.quadW(a(e[0],e[1],e[2]),a(o[0],o[1],o[2]),a(n[0],n[1],n[2]),a(s[0],s[1],s[2]),i)}fan(e,o,n,s){const i=this.at;this.fanW(i(e[0],e[1],e[2]),i(o[0],o[1],o[2]),i(n[0],n[1],n[2]),s)}box(e,o,n,s,i,a,h,c=""){c.includes("F")||this.quad([o,n,i],[o,n,a],[o,s,a],[o,s,i],h),c.includes("A")||this.quad([e,n,i],[e,n,a],[e,s,a],[e,s,i],h),c.includes("L")||this.quad([e,n,a],[o,n,a],[o,s,a],[e,s,a],h),c.includes("R")||this.quad([e,n,i],[o,n,i],[o,s,i],[e,s,i],h),c.includes("T")||this.quad([e,s,i],[o,s,i],[o,s,a],[e,s,a],h),c.includes("B")||this.quad([e,n,i],[o,n,i],[o,n,a],[e,n,a],h)}prism(e,o,n,s,i,a=i,h=!0){const c=e.length;let f=0,r=0;for(const[d,u]of e)f+=d/c,r+=u/c;for(let d=0;d<c;d++){const[u,m]=e[d],[v,p]=e[(d+1)%c];this.quad(s(u,m,o),s(v,p,o),s(v,p,n),s(u,m,n),i),h&&(this.fan(s(f,r,o),s(u,m,o),s(v,p,o),a),this.fan(s(f,r,n),s(u,m,n),s(v,p,n),a))}}cyl(e,o,n,s,i,a=i,h=n,c=3){e=this.at(e[0],e[1],e[2]),o=this.at(o[0],o[1],o[2]);const f=o[0]-e[0],r=o[1]-e[1],d=o[2]-e[2],u=Math.hypot(f,r,d),m=[f/u,r/u,d/u];let v=[m[2],0,-m[0]];const p=Math.hypot(v[0],v[2]);v=p<1e-6?[1,0,0]:[v[0]/p,0,v[2]/p];const A=[m[1]*v[2]-m[2]*v[1],m[2]*v[0]-m[0]*v[2],m[0]*v[1]-m[1]*v[0]],l=(b,g)=>{const R=new Array(s);for(let N=0;N<s;N++){const Q=N/s*Math.PI*2,C=Math.cos(Q)*g,K=Math.sin(Q)*g;R[N]=[b[0]+v[0]*C+A[0]*K,b[1]+v[1]*C+A[1]*K,b[2]+v[2]*C+A[2]*K]}return R},y=l(e,n),x=l(o,h);for(let b=0;b<s;b++){const g=(b+1)%s;this.quadW(y[b],y[g],x[g],x[b],i),c&1&&this.fanW(e,y[b],y[g],a),c&2&&this.fanW(o,x[b],x[g],a)}}plate(e,o,n){this.quad(e[0],e[1],e[2],e[3],n);for(let s=0;s<4;s++){const i=e[s],a=e[(s+1)%4];this.quad(i,a,[a[0]+o[0],a[1]+o[1],a[2]+o[2]],[i[0]+o[0],i[1]+o[1],i[2]+o[2]],n)}}band(e,o,n){for(let s=0;s<4;s++){const i=(s+1)%4;this.quad(e[s],e[i],o[i],o[s],n)}}sheet(e,o,n,s){const i=[];for(let a=0;a<=e;a++){i.push([]);for(let h=0;h<=o;h++)i[a].push(n(a,h))}for(let a=0;a<e;a++)for(let h=0;h<o;h++)this.quad(i[a][h],i[a+1][h],i[a+1][h+1],i[a][h+1],s(a,h))}mesh(e){return this.g.mesh(e,{surface:p0,motion:m0})}}const I=(t,e)=>t.map(([o,n])=>[o,n,e]);function V(t,e,o,n,s,i,a,h,c){const f=Math.sign(s-n),r=Math.min(.14,.3*Math.abs(s-n)),d=o-.7*r;t.kind(r0,c),t.cyl([e,o,n],[e,o,n+f*r],d,i,z,z,o,0),t.cyl([e,o,n+f*r],[e,o,s-f*r],o,i,z,z,o,0),t.cyl([e,o,s-f*r],[e,o,s],o,i,z,z,d,2),t.kind(l0),t.cyl([e,o,s-f*.02],[e,o,s+f*.05],a,12,h,h,.94*a,2)}function g0(t,e,o,n,s,i,a,h,c,f,r){const d=(u,m,v)=>[e+u*Math.cos(m),o+u*Math.sin(m),v];for(let u=0;u<f;u++){const m=h+(c-h)*u/f,v=h+(c-h)*(u+1)/f;t.quad(d(s,m,i),d(s,v,i),d(s,v,a),d(s,m,a),r);for(const p of[i,a])t.quad(d(n,m,p),d(n,v,p),d(s,v,p),d(s,m,p),r)}for(const u of[h,c])t.quad(d(n,u,i),d(s,u,i),d(s,u,a),d(n,u,a),r)}function x0(t,e,o,n){const s=e.y0,i=o-P,a=T(E,.78),h=X(20261013);t.at=e.at,t.kind(L,s),t.box(-3.6,3.7,.5,1.35,-1,1,T(w,1.5),"T"),t.box(-3.1,-2.7,.42,.78,-1.03,1.03,w),t.kind(k,s),t.box(1.6,3.7,1.35,2.05,-.95,.95,a,"BT"),t.box(-4.2,-3.6,.85,1.52,-1.2,1.2,a),t.prism([[-3.7,1.3],[1.6,1.3],[1.6,3],[-3,3],[-4.25,2.3],[-4.25,1.75]],-1.6,1.6,B,E);for(const l of[-1,1]){const y=l*1.64,x=[0,0,-l*.04];t.kind(k,s,3),t.plate(I([[-2.3,1.5],[1.35,1.5],[1.35,2.72],[-2.3,2.72]],y),x,M),t.kind(_,.12),t.plate(I([[-3.65,1.72],[-2.5,1.72],[-2.5,2.5],[-3.65,2.5]],y),x,U)}t.kind(k,-99),t.plate([[-4.29,1.8,-1.25],[-4.29,1.8,1.25],[-4.29,2.3,1.25],[-4.29,2.3,-1.25]],[.04,0,0],H);const c=l=>3.45+(l-2.05)*.35/1.5;t.kind(k,s),t.prism([[1.6,2.05],[3.45,2.05],[3.8,3.55],[3.8,3.7],[1.6,3.7]],-1.05,1.05,B,E),t.kind(k,s,2),t.box(1.5,3.98,3.7,3.84,-1.15,1.15,M,"B"),t.kind(_,.1),t.plate([[1.75,3.9,-.7],[2.85,3.9,-.7],[2.85,3.9,.7],[1.75,3.9,.7]],[0,-.06,0],T(M,.7));for(const l of[-1,1]){const y=l>0?.95:-1.74,x=l>0?1.74:-.95;t.kind(k,s),t.box(1.62,3.6,1.93,2.23,y,x,a,"T"),t.kind(_,.14),t.quad([1.62,2.23,y],[3.6,2.23,y],[3.6,2.23,x],[1.62,2.23,x],T(U,1.5))}t.kind(k,s),t.prism([[3.6,1.93],[3.92,1.93],[4.32,.55],[4,.55]],1.12,1.62,B,a),t.kind(_,.3),t.plate([[3.958,1.941,1.12],[3.958,1.941,1.62],[4.358,.561,1.62],[4.358,.561,1.12]],[-.038,-.011,0],T(U,1.8)),t.kind(F),t.plate([[c(2.22)+.039,2.211,-.93],[c(2.22)+.039,2.211,.93],[c(3.5)+.039,3.491,.93],[c(3.5)+.039,3.491,-.93]],[-.039,.009,0],W);for(const l of[-1,1]){const y=l*1.09,x=[0,0,-l*.04];t.plate(I([[2.7,2.25],[c(2.25)-.1,2.25],[c(3.5)-.1,3.5],[2.7,3.5]],y),x,W),t.plate(I([[1.75,2.25],[2.55,2.25],[2.55,3.5],[1.75,3.5]],y),x,W)}t.kind(k,-99);for(const l of[-1,1])t.plate([[4.02,3.72,l*.55],[4.02,3.72,l*.95],[4.02,3.82,l*.95],[4.02,3.82,l*.55]],[-.04,0,0],J);t.kind(k,s,2),t.prism([[3.7,.9],[i+4.7,.3],[i+4.7,1.3],[3.7,2]],-.75,.75,B,a);{const l=i+1,y=Math.hypot(l,.7),x=.04*.7/y,b=.04*l/y,g=(R,N)=>[3.7+R*l+x,2-.7*R+b,N];t.plate([g(.2,-.52),g(.2,.52),g(.82,.52),g(.82,-.52)],[-x,-b,0],M)}const f=n-.3,r=[[4.65,.2],[6.5,.13],[6.5,.26],[5.95,.36],[5.15,.4],[5.15,1.45],[4.65,1.45]],d=s-.5,u=[[L,w,s,0],[k,c0,-99,0],[L,T(w,2.6),-99,0],[k,H,-99,0],[k,E,d,6],[k,M,-99,6],[k,E,d,6]];for(let l=0;l<7;l++){const[y,x]=r[l],[b,g]=r[(l+1)%7],R=u[l];t.kind(R[0],R[2],R[3]),t.quad([i+y,x,-f],[i+y,x,f],[i+b,g,f],[i+b,g,-f],R[1])}for(let l=0;l<8;l++){const y=l*Math.PI/4,x=y+Math.PI/4,b=(g,R)=>[i+5.52+.3*Math.cos(g),.74+.3*Math.sin(g),R];t.kind(v0,l,8),t.quad(b(y,-f),b(x,-f),b(x,f),b(y,f),f0)}t.kind(k,d);for(const l of[-1,1])t.prism([[4.65,.2],[6.5,.13],[7.55,.28],[7.05,.8],[6.95,1.25],[6.95,1.6],[6.25,1.6],[5.15,1.5],[4.65,1.5]].map(([y,x])=>[i+y,x]),l*f,l*n,B,E);t.kind(d0),t.prism(Array.from({length:6},(l,y)=>[i+6.62+.66*Math.cos(y*Math.PI/3),1.36+.66*Math.sin(y*Math.PI/3)]),-f+.03,f-.03,B,$,$,!1);const m=[[-1.95,3,-1.2],[1.3,3,-1.2],[1.3,3,1.2],[-1.95,3,1.2]],v=[[-2.1,3.56,-1.4],[1.42,3.56,-1.4],[1.42,3.56,1.4],[-2.1,3.56,1.4]],p=[[-1.97,3.56,-1.27],[1.29,3.56,-1.27],[1.29,3.56,1.27],[-1.97,3.56,1.27]],A=[[-1.92,3.38,-1.21],[1.25,3.38,-1.21],[1.25,3.38,1.21],[-1.92,3.38,1.21]];t.kind(k,s,3),t.band(m,v,E),t.kind(k,-99),t.band(v,p,T(E,1.5)),t.band(p,A,T(E,.5)),t.kind(S),t.sheet(14,10,(l,y)=>{const x=-1.92+3.17*l/14,b=-1.21+2.42*y/10,g=Math.hypot((x+.3)/1.5,b/1.1);return[x,3.38+(l%14&&y%10?.42*Math.pow(Math.max(0,1-g),.8)+h.range(-.012,.012):0),b]},()=>T(Z,.95+.1*h())),t.kind(k,s),t.box(-2.98,-2.18,3,3.36,-1.3,1.1,a,"TB"),t.kind(_,.11),t.quad([-2.98,3.36,-1.3],[-2.18,3.36,-1.3],[-2.18,3.36,1.1],[-2.98,3.36,1.1],U),t.kind(k,-99),t.cyl([-2.58,3.36,-.8],[-2.58,3.66,-.8],.2,8,M),t.kind(L,-99),t.cyl([-2.58,3.36,.55],[-2.58,3.68,.55],.17,8,w,H),t.kind(k,s),t.cyl([1.05,2.95,1.52],[1.05,3.5,1.52],.27,8,E),t.cyl([1.05,3.24,1.6],[-3.45,3.34,1.6],.2,8,M),t.cyl([-3.45,3.34,1.6],[-3.75,3.06,1.6],.2,8,M,H),t.box(-2.6,-2.3,2.8,3.2,1.42,1.78,E,"B");for(const l of[-1,1])V(t,2.6,.95,l*1,l*1.7,20,.55,M,s),V(t,-2.9,.6,l*1.03,l*1.475,14,.34,M,s)}function k0(t,e){const o=e.y0,n=T(G,1.25);t.at=e.at,t.kind(L,o),t.box(-1.9,2.2,.5,1.02,-.38,.38,w),t.box(1.3,1.6,.34,.66,-.68,.68,w),t.box(-1.42,-.98,.62,1.08,-.6,.6,w),t.box(-2.35,-1.9,.45,.85,-.2,.2,w),t.kind(k,o,-1),t.prism([[.3,1],[2.25,1],[2.25,1.55],[2.05,1.7],[.3,1.8]],-.48,.48,B,G),t.prism([[-1.95,1.2],[.3,1.2],[.3,1.8],[.1,2.72],[-1.85,2.72],[-1.95,2]],-.78,.78,B,G),t.kind(k,o,-2),t.box(-2.02,.42,2.72,2.9,-.86,.86,n,"B"),t.kind(k,o,-1);for(const a of[-1,1])g0(t,-1.2,.85,.87,1,a*.78,a*1.2,.3,3.3,8,G);t.kind(L,o),t.box(2.25,2.6,.55,1,-.42,.42,w),t.kind(_,.09),t.plate([[2.29,1.06,-.38],[2.29,1.06,.38],[2.29,1.38,.38],[2.29,1.38,-.38]],[-.04,0,0],U);for(const a of[-1,1])t.plate(I([[.95,1.1],[2,1.1],[2,1.48],[.95,1.48]],a*.52),[0,0,-a*.04],U);t.plate([[1.05,1.797,-.3],[1.85,1.751,-.3],[1.85,1.751,.3],[1.05,1.797,.3]],[0,-.04,0],U),t.kind(k,-99);for(const a of[-1,1])t.plate([[2.29,1.41,a*.18],[2.29,1.41,a*.4],[2.29,1.52,a*.4],[2.29,1.52,a*.18]],[-.04,0,0],J);t.kind(F);const s=a=>.3-(a-1.8)*.2/.92,i=a=>-1.95+(a-2)*.1/.72;t.plate([[s(1.86)+.039,1.8685,-.68],[s(1.86)+.039,1.8685,.68],[s(2.66)+.039,2.6685,.68],[s(2.66)+.039,2.6685,-.68]],[-.039,-.0085,0],W),t.plate([[i(2.06)-.04,2.0655,.66],[i(2.06)-.04,2.0655,-.66],[i(2.66)-.04,2.6655,-.66],[i(2.66)-.04,2.6655,.66]],[.04,-.0055,0],W);for(const a of[-1,1]){const h=a*.82,c=[0,0,-a*.04];t.plate(I([[-.82,1.4],[.2,1.4],[s(2.64)-.08,2.64],[-.82,2.64]],h),c,W),t.plate(I([[-1.84,1.9],[-.98,1.9],[-.98,2.64],[-1.8,2.64]],h),c,W)}t.kind(L,-99),t.cyl([.72,1.7,.3],[.72,2.3,.3],.2,8,T(w,1.3)),t.cyl([.72,2.3,.3],[.72,2.98,.3],.17,8,w,H);for(const a of[-1,1])V(t,-1.2,.85,a*.6,a*1.15,20,.5,M,o),V(t,1.45,.5,a*.68,a*1.02,14,.28,M,o)}function A0(t,e,o){const n=e.y0,s=X(20261012);t.at=e.at,t.kind(L,n),t.box(-2.7,2.7,.8,1.15,-.45,.45,w);for(const c of[-1.95,1.95])t.box(c-.16,c+.16,.34,.66,-.78,.78,w);t.prism([[2.1,-.6],[o,-.17],[o,.17],[2.1,.6]],.48,.8,b0,T(w,1.4));const i=[[-3,2.45,-1.2],[3,2.45,-1.2],[3,2.45,1.2],[-3,2.45,1.2]],a=[[-2.86,2.45,-1.06],[2.86,2.45,-1.06],[2.86,2.45,1.06],[-2.86,2.45,1.06]],h=a.map(([c,,f])=>[c,2.2,f]);t.kind(u0,n),t.box(-3,3,1.15,2.45,-1.2,1.2,q,"TB"),t.band(a,h,T(q,.7)),t.kind(k,n),t.quad([-3,1.15,-1.2],[3,1.15,-1.2],[3,1.15,1.2],[-3,1.15,1.2],T(q,.6)),t.band(i,a,T(q,1.3)),t.kind(S),t.sheet(28,10,(c,f)=>{const r=-2.86+5.72*c/28,d=-1.06+2.12*f/10,u=1-Math.abs(d)/1.06,m=Math.min(1,(2.86-Math.abs(r))/1),v=Math.max(0,...[-1.75,0,1.75].map(p=>1-Math.abs(r-p)/.9));return[r,2.2+.74*u*m*(.8+.2*v)+(c%28&&f%10?s.range(-.012,.012):0),d]},()=>T(Z,.95+.1*s()));for(const c of[-1.95,1.95])for(const f of[-1,1])V(t,c,.5,f*.775,f*1.125,14,.27,T(M,.8),n)}function R0(t){const{C:e,T:o,R:n,knife:s,half:i}=t,a=s-P,h=[O(e,-2.6,3.3,.55,2.9,-.9,.9,!1)],c=a+4.77,f=a+5.03,r=i-.45,d=Math.min(e.at(c,1.33,-r)[1],e.at(c,1.33,r)[1],e.at(f,1.33,-r)[1],e.at(f,1.33,r)[1]),u=Math.min(e.at(c,.32,-r)[1],e.at(c,.32,r)[1],e.at(f,.32,-r)[1],e.at(f,.32,r)[1]),m=e.at((c+f)/2,.8,0);return h.push({c:[m[0],(d+u)/2,m[2]],h:[r*Math.abs(e.W.x*e.c-e.W.z*e.s),(d-u)/2,(f-c)/2-.02],yaw:e.yaw}),h.push(O(o,-1.85,.2,.6,2.62,-.68,.68,!1),O(n,-2.9,2.9,.5,2.08,-1,1,!1)),h}function T0(){const{C:t,T:e,R:o,knife:n,half:s,reach:i}=t0(),a=n-P,h=[],c=(f,r)=>h.push({name:f,c:r.c,h:r.h,yaw:r.yaw});return c("combine",O(t,-4.32,4.04,0,3.9,-1.76,1.82,!0)),c("combine header",O(t,4.04,a+7.57,0,1.96,-s,s,!0)),c("tractor",O(e,-2.36,2.62,0,3,-1.22,1.22,!0)),c("trailer",O(o,-3,3,0,2.98,-1.2,1.2,!0)),c("trailer drawbar",O(o,3,i,.46,.82,-.6,.6,!0)),h}const O0=(()=>{const t=[];let e=!1;const o=()=>{if(!e){const n=T0();for(const s of n)t.push(s);e=!0}return t};return new Proxy(t,{get:(n,s,i)=>Reflect.get(o(),s,i),has:(n,s)=>Reflect.has(o(),s),ownKeys:()=>Reflect.ownKeys(o()),getOwnPropertyDescriptor:(n,s)=>Reflect.getOwnPropertyDescriptor(o(),s)})})();async function B0(t,e){const o=t0(),n=new y0;x0(n,o.C,o.knife,o.half),await t.yield(),k0(n,o.T),A0(n,o.R,o.reach),await t.yield();for(const i of R0(o))a0(e,i.c,i.h,i.yaw);const s=new D.Group;return s.add(n.mesh(e)),{group:s,triangles:n.triangles}}export{O0 as HARVEST_BODIES,B0 as buildHarvest,T0 as harvestBodies};
