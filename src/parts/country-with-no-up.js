import*as t from"three";import{COMMON as W,SKY as le,makeShared as se,HOOP as v,HOOP_R as $,SPHERE_R as L,REST as B,TRACK as f,TRACK_LEN as U,POINT as j,circleR as ue,smooth as P}from"./country-with-no-up-glsl.js";const Z=U-L,i=16,ce=W+`
varying vec3 vW, vN;
void main(){
  vN = position; vW = uSphere.xyz + position*uSphere.w;
  gl_Position = projectionMatrix*viewMatrix*vec4(vW.x, vW.y + uLift, vW.z, 1.);
}`,ve=W+le+`
uniform sampler2D uMapTex, uMapTex2; uniform vec4 uMapRect, uMapRect2;      // centre x, z, half size, gain (2: the fine picture round the circle)
vec2 mapUv(vec2 hit, vec4 r){ return vec2((hit.x - r.x)/(2.*r.z) + 0.5, (r.y - hit.y)/(2.*r.z) + 0.5); }
uniform vec4 uRc[${i}], uRn[${i}], uRcol[${i}];       // rings: centre + radius, normal + width, colour + strength
uniform vec4 uPoint;                                   // the one-point country: xyz, brightness
uniform float uBend;
varying vec3 vW, vN;
void main(){
  if (vW.y < 0.) discard;
  vec3 N = normalize(vN), V = normalize(vW - uEye), R = reflect(V, N);
  float ndv = clamp(-dot(V, N), 0., 1.), om = 1. - ndv, fres = om*om*om*om*om;
  // ---- upward: space, the hoops as arcs, the point as a star
  vec3 sky = skyCol(R)*1.6;
  for (int i = 0; i < ${i}; i++) {
    if (i >= 5 && i < 8) continue;
    float dn = dot(R, uRn[i].xyz); dn = abs(dn) < 1e-3 ? 1e-3 : dn;
    float t = dot(uRc[i].xyz - vW, uRn[i].xyz)/dn;
    vec3 hp = vW + R*t - uRc[i].xyz;
    float e = abs(length(hp) - uRc[i].w), w = (i == 0 ? 1.7 : 1.2) + 0.005*max(t, 0.);
    sky += uRcol[i].rgb*uRcol[i].w*(i == 0 ? 1.5 : 0.8)*step(0., t)*(exp(-e*e/(w*w)) + 0.02*exp(-e/(6.*w)));
  }
  vec3 pd = uPoint.xyz - vW; pd /= max(length(pd), 1e-3);
  sky += vec3(0.93, 0.92, 0.98)*uPoint.w*(40.*exp(-(1. - dot(R, pd))*9000.) + 1.5*exp(-(1. - dot(R, pd))*500.));
  // ---- downward: the country, read from the picture of the plane
  // (once the ball is sunk in the plane only its upper half shows, and a true mirror there holds nothing but space:
  // the reflection is bent down the flanks, uBend, so the ball carries the country round it as it did coming down)
  float ny2 = N.y*N.y;
  vec3 Rg = normalize(vec3(R.x, R.y - uBend*(1. - ny2*ny2), R.z));
  float ry = min(Rg.y, -1e-3), t = min(vW.y/(-ry), 4000.);
  vec2 hit = vW.xz + Rg.xz*t;
  vec2 uv = mapUv(hit, uMapRect), uv2 = mapUv(hit, uMapRect2);
  vec2 e2 = abs(uv - 0.5), e3 = abs(uv2 - 0.5);
  float inMap = 1. - smoothstep(0.44, 0.5, max(e2.x, e2.y)), inFine = (1. - smoothstep(0.42, 0.49, max(e3.x, e3.y)))*uMapRect2.w;
  // (each picture is read at the level its own footprint on the ball asks for, a little sharper: near things stay crisp)
  vec3 wide = texture2D(uMapTex, clamp(uv, 0.002, 0.998), -0.6).rgb*inMap;
  vec3 fine = texture2D(uMapTex2, clamp(uv2, 0.002, 0.998), -0.6).rgb;
  vec3 ground = max(mix(wide, fine, inFine), 0.)*uMapRect.w;
  ground *= ground/(ground + 0.05);                       // a mirror of black glass: faint pools sink, edges stay
  // beyond the picture the country is its districts' gathered light; under everything the glass holds a little of it
  vec3 tg = townGlow(hit);
  ground += tg*(0.03 + 0.30*(1. - inMap));
  // the circle's own blaze, a hard belt at the waist
  float ce = max(length(hit - uCircle.xy) - uCircle.z, 0.);
  ground += uPal[4]*uCircle.w*0.4*exp(-ce/1.3);
  float flen = min(uFogP.z, vW.y)/(-ry);
  float T = exp(-uFogP.x*flen);
  ground = ground*T + fogLight(hit)*(1. - T);
  float g = smoothstep(0.03, -0.03, Rg.y);
  vec3 col = mix(sky, ground, g);
  // never black: a pearl-blue floor, brighter toward the limb
  vec3 sheen = vec3(0.50, 0.62, 0.95);
  col += sheen*(0.035 + 0.03*N.y*N.y*N.y + 0.26*om*om + 0.36*fres);       // graded: brighter toward the silhouette, so the cap reads round
  // the vermilion square beside the flank: the mirror shows it (a level square of 6.5 m, met by the true reflected ray)
  float ts = (uSq.y - vW.y)/(abs(R.y) < 1e-3 ? 1e-3 : R.y);
  vec2 sq = abs(vW.xz + R.xz*ts - uSq.xz); float sd = max(sq.x, sq.y) - 3.25;
  if (ts > 0. && sd < 0.) col = mix(col, uPal[6]*(sd > -0.9 ? 2.2 : 0.35) + uPal[7], uSq.w*0.85);
  vec4 fg = slabFog(vW);
  gl_FragColor = vec4(col*fg.a + fg.rgb, 1.);
}`,de=W+`
attribute vec2 aR;             // angle 0..1, side -1 / +1
attribute float aId;
uniform vec4 uRc[${i}], uRn[${i}], uRcol[${i}];
varying vec3 vW; varying vec4 vCol; varying vec2 vS; varying float vIn;
void main(){
  int id = int(aId + 0.5);
  vec3 C = uRc[id].xyz, n = uRn[id].xyz; float rad = uRc[id].w;
  vec3 U = normalize(cross(n, abs(n.x) > 0.9 ? vec3(0., 0., 1.) : vec3(1., 0., 0.))), Wv = cross(n, U);
  float a = aR.x*6.2831853;
  vec3 radial = cos(a)*U + sin(a)*Wv, tang = -sin(a)*U + cos(a)*Wv;
  vec3 P = C + radial*rad;
  vec3 view = P - uEye; float dist = max(length(view), 0.1);
  vec3 side = cross(tang, view/dist); side /= max(length(side), 1e-3);
  float hw = max(uRn[id].w, 1.3*dist/uPx);
  P += side*aR.y*hw*3.0;                                 // the ribbon is three half-widths wide: a hard core in a soft edge
  // a thin far ring gives up light for its width. No ring's light depends on how far the eye is, but for the near
  // thinning of anything we could fly through: the lesser rings thin within 15 m of the eye's place
  float nearK = id == 5 || id == 0 ? 1. : smoothstep(3., 15., dist);
  // +1 on the ribbon's inner edge, -1 on its outer (side.radial is the same all round a ring: it is the eye's place
  // off the ring's plane; near that plane the two edges ease into one another)
  vIn = -clamp(dot(side, radial)*4., -1., 1.)*aR.y;
  vW = P; vCol = vec4(uRcol[id].rgb*uRcol[id].w*nearK*mix(1., uRn[id].w/hw, id == 0 || id == 5 ? 0.5 : 0.85), aId); vS = vec2(aR.y, aR.x);
  gl_Position = projectionMatrix*viewMatrix*vec4(P.x, P.y + uLift, P.z, 1.);
}`,he=W+`
varying vec3 vW; varying vec4 vCol; varying vec2 vS; varying float vIn;
void main(){
  if (vW.y < 0.) discard;
  float s = min(abs(vS.x)*3.0, 3.), core = 1. - smoothstep(0.7, 1.15, s), soft = exp(-s*s*0.9)*0.2;
  float sh = 0.82 + 0.3*cN(vec2(vS.y*150. + vCol.a*17., uTime*1.3)) ;
  vec4 fg = slabFog(vW);
  vec3 col = vCol.rgb*(core + soft);
  if (vCol.a > 7.5) {
    // a ring the Sphere left on its track: a made thing of light, never a hairline. A broad soft band (the whole
    // ribbon, six half-widths across) that swells toward its inner edge, and a bright line along that edge; the
    // country's hues faint in the band
    float t = 0.5 + 0.5*clamp(vIn, -1., 1.), a = vS.y*6.2831853, k = cN(vec2(cos(a), sin(a))*1.6 + vCol.a*3.1 + uTime*0.02);
    float rise = smoothstep(0., 0.8, t), band = 0.30*rise*sqrt(rise)*(1. - smoothstep(0.86, 1., t)), edge = exp(-(t - 0.82)*(t - 0.82)/0.0032);
    float rim = 1. - smoothstep(0.7, 1., abs(vS.x));        // the ribbon's own two borders are always soft (seen from in its plane, too)
    vec3 hue = mix(mix(uPal[0], uPal[2], smoothstep(0.35, 0.5, k)), uPal[1], smoothstep(0.55, 0.7, k));
    col = (vCol.rgb*(band + 0.85*edge) + hue*length(vCol.rgb)*0.16*band)*rim;
    sh = 0.93 + 0.12*cN(vec2(vS.y*40. + vCol.a*17., uTime*0.6));      // a soft band shimmers slowly and broadly: no fringe
  }
  gl_FragColor = vec4(col*sh*fg.a, 0.);
}`,pe=W+`
uniform vec4 uRc[${i}], uRn[${i}], uRcol[${i}];
varying vec3 vW; varying vec2 vQ;
void main(){
  vec3 C = uRc[0].xyz, n = uRn[0].xyz;
  vec3 U = normalize(cross(n, abs(n.x) > 0.9 ? vec3(0., 0., 1.) : vec3(1., 0., 0.))), Wv = cross(n, U);
  vec3 P = C + (U*position.x + Wv*position.y)*uRc[0].w;
  vQ = position.xy; vW = P;
  gl_Position = projectionMatrix*viewMatrix*vec4(P.x, P.y + uLift, P.z, 1.);
}`,fe=W+`
uniform vec4 uRcol[${i}]; uniform float uFilm;
varying vec3 vW; varying vec2 vQ;
void main(){
  float r = length(vQ);
  float n1 = cN(vQ*2.6 + vec2(uTime*0.05, -uTime*0.04)), n2 = cN(vQ*6.7 - vec2(uTime*0.06, uTime*0.03));
  float rip = 0.5 + 0.5*sin(r*30. + 5.*n1 + uTime*0.8); rip *= rip;
  float edge = r*r*(1. - smoothstep(0.90, 0.995, r));
  float film = (0.018 + 0.045*rip*(0.35 + 0.65*n2))*edge + 0.05*exp(-r*r*22.);
  vec3 col = mix(uRcol[0].rgb, vec3(0.42, 0.58, 1.0), 0.45 + 0.3*n1)*film*uRcol[0].w;
  // in the film's place, always: a faint glow of the country's aqua and violet round the hoop's middle
  vec3 glow = mix(uPal[0], uPal[1], 0.35 + 0.5*n1)*(0.05*exp(-r*r*7.) + 0.012*exp(-r*r*1.6))*(0.75 + 0.25*n2);
  gl_FragColor = vec4((col*uFilm + glow)*(1. - smoothstep(0.99, 1.0, r))*smoothstep(3., 15., length(vW - uEye)), 0.);
}`,ge=W+`
varying vec3 vW;
void main(){
  vec2 w = uCircle.xy + position.xy*(uCircle.z + 260.);
  vW = vec3(w.x, 0.55, w.y);
  gl_Position = projectionMatrix*viewMatrix*vec4(vW.x, vW.y + uLift, vW.z, 1.);
}`,me=W+`
varying vec3 vW;
void main(){
  float r = length(vW.xz - uCircle.xy), e = r - uCircle.z, ae = abs(e);
  float out1 = step(0., e);
  float sh = 0.85 + 0.3*cN(vec2(atan(vW.z - uCircle.y, vW.x - uCircle.x + 1e-4)*14., uTime*1.7));
  float glow = 1.5*exp(-ae/1.3)*sh + out1*(0.16*exp(-ae/4.) + 0.03*exp(-ae/22.) + 0.006*exp(-ae/90.));
  if (uMap > 0.5) glow = 0.45*exp(-ae/1.3)*sh + out1*0.03*exp(-ae/6.);
  glow *= 1. - smoothstep(170., 255., e);
  vec4 fg = slabFog(vW);
  gl_FragColor = vec4(uPal[4]*uCircle.w*glow*fg.a, 0.);
}`;function ye(r){const d=new Uint8Array(262144),c=[[73,214,198],[169,139,255],[242,178,78],[237,235,250]];for(let n=0;n<5200;n++){const N=r()*6.2832,F=.48*Math.pow(r(),.7),p=Math.floor((.5+Math.cos(N)*F)*256),T=Math.floor((.5+Math.sin(N)*F)*256),s=c[Math.floor(r()*4)],M=.5+.5*r();for(let z=0;z<2;z++)for(let g=0;g<2;g++){const m=((T+z)%256*256+(p+g)%256)*4;d[m]=s[0]*M,d[m+1]=s[1]*M,d[m+2]=s[2]*M,d[m+3]=255}}const R=new t.DataTexture(d,256,256,t.RGBAFormat,t.UnsignedByteType);return R.minFilter=t.LinearMipmapLinearFilter,R.magFilter=t.LinearFilter,R.generateMipmaps=!0,R.needsUpdate=!0,R}const H={transparent:!0,depthWrite:!1,depthTest:!0,blending:t.CustomBlending,blendEquation:t.AddEquation,blendSrc:t.OneFactor,blendDst:t.OneFactor,side:t.DoubleSide};async function Re(r,w={}){const d=!w.shared,c=w.shared||se(),R=d?{standin:r.rng.fork("standin"),sway:r.rng.fork("sway")}:null,n=d?new t.Vector3().sub(B):new t.Vector3,N=new t.Group,F=e=>Array.from({length:e},()=>new t.Vector4),p=w.mapCenter||[B.x+n.x,B.z+n.z+(d?0:40)],T=w.mapHalf||(d?420:440),s={uMapTex:{value:null},uMapRect:{value:new t.Vector4(p[0],p[1],T,d?2.2:1)},uMapTex2:{value:null},uMapRect2:{value:new t.Vector4(0,0,100,0)},uRc:{value:F(i)},uRn:{value:F(i)},uRcol:{value:F(i)},uBend:{value:0},uFilm:{value:1},uPoint:{value:new t.Vector4(j.x+n.x,j.y+n.y,j.z+n.z,1)}},M=(e,l,u={})=>new t.ShaderMaterial({vertexShader:e,fragmentShader:l,uniforms:{...c,...s},...u}),z=(e,l)=>(e.frustumCulled=!1,e.renderOrder=l,e.matrixAutoUpdate=!1,N.add(e),e);let g=null,m=null,C=null,S=null,h=null;if(w.mapObjects&&r.renderer){const e=r.renderer.extensions,l=e&&(e.has("EXT_color_buffer_float")||e.has("EXT_color_buffer_half_float")),u=(r.quality?.detail??1)>=.8?1024:512,x=()=>{const a=new t.WebGLRenderTarget(u,u,{type:l?t.HalfFloatType:t.UnsignedByteType,depthBuffer:!1,minFilter:t.LinearMipmapLinearFilter,magFilter:t.LinearFilter,generateMipmaps:!0});return a.texture.anisotropy=4,a};g=x(),m=x(),C=new t.Scene,C.background=new t.Color(0,0,0),C.matrixAutoUpdate=!1,S=new t.OrthographicCamera(-T,T,T,-T,1,400),S.position.set(p[0],200,p[1]),S.up.set(0,0,-1),S.lookAt(p[0],0,p[1]),S.updateMatrixWorld(!0),h=new t.OrthographicCamera(-105,105,105,-105,1,400),h.position.set(p[0],200,p[1]),h.up.set(0,0,-1),h.lookAt(p[0],0,p[1]),h.updateMatrixWorld(!0);for(const a of w.mapObjects)C.add(a);s.uMapTex.value=g.texture,s.uMapTex2.value=m.texture;try{const a=r.renderer.getRenderTarget();r.renderer.initRenderTarget(g),r.renderer.initRenderTarget(m),r.renderer.setRenderTarget(a)}catch{}}else s.uMapTex.value=s.uMapTex2.value=ye(R?R.standin:w.standin);const K=r.core.makeRng(r.core.hashSeed("wake:"+r.seed)),_=[];for(let e=K.range(28,56);e<Z&&_.length<i-8;e+=K.range(28,56))_.push(e);const O=w.sway||[0,1,2,3].map(()=>R.sway.range(0,6.2832));await r.yield();const ee=z(new t.Mesh(new t.SphereGeometry(1,96,64),M(ce,ve)),0);await r.yield();const q=z(new t.Mesh(new t.PlaneGeometry(2,2),M(ge,me,H)),1.5);if(C){const e=new t.Mesh(q.geometry,q.material);e.frustumCulled=!1,e.matrixAutoUpdate=!1,C.add(e)}const k=256,I=new Float32Array((k+1)*4),te=new Float32Array((k+1)*6),Q=[],X=new Float32Array(i);for(let e=0;e<=k;e++)I[e*4]=e/k,I[e*4+1]=-1,I[e*4+2]=e/k,I[e*4+3]=1;for(let e=0;e<k;e++)Q.push(e*2,e*2+1,e*2+2,e*2+2,e*2+1,e*2+3);for(let e=0;e<i;e++)X[e]=e;const A=new t.InstancedBufferGeometry;A.setIndex(Q),A.setAttribute("position",new t.BufferAttribute(te,3)),A.setAttribute("aR",new t.BufferAttribute(I,2)),A.setAttribute("aId",new t.InstancedBufferAttribute(X,1)),A.instanceCount=i;const ae=z(new t.Mesh(A,M(de,he,H)),5),xe=z(new t.Mesh(new t.PlaneGeometry(2,2),M(pe,fe,H)),4.5);await r.yield();const V=new t.Color("#EDEBFA"),oe=new t.Color("#FFE2A8"),ne=new t.Color("#EDEBFA").lerp(new t.Color("#FFE2A8"),.45),y=new t.Vector3,Y=new t.Vector3(0,1,0),J=new t.Vector2,E=(e,l,u,x,a,o,b,G,ie)=>{s.uRc.value[e].set(l,u,x,a),s.uRn.value[e].set(o.x,o.y,o.z,b),s.uRcol.value[e].set(G.r,G.g,G.b,ie)};function D(e,l){y.copy(v).addScaledVector(f,e).add(n),c.uSphere.value.set(y.x,y.y,y.z,L);const u=ue(y.y),x=P(0,16,u)*(.9+.1*Math.sin(l*2.1+O[0]));c.uCircle.value.set(y.x,y.z,u,x),s.uBend.value=1.1*(1-P(0,L,y.y)),E(0,v.x+n.x,v.y+n.y,v.z+n.z,$,f,.9,V,.95+.85*Math.exp(-Math.max(e,0)/120));for(let a=1;a<=4;a++){const o=e-60*a,b=P(0,30,o)*(1-P(U-90,U+6,e));E(a,v.x+n.x+f.x*60*a,v.y+n.y+f.y*60*a,v.z+n.z+f.z*60*a,L-2-15*P(0,420,o)-2.5*Math.sin(l*.23+a+O[1]),f,.22,V,b*(.2+.7*Math.exp(-Math.max(o,0)/60)))}E(5,y.x,.6,y.z,Math.max(u,.01),Y,.7,oe,4*x);for(let a=0;a<2;a++){const o=(l/12+a*.5+O[2]/6.2832)%1,b=Math.sin(Math.PI*o);E(6+a,v.x+n.x,v.y+n.y,v.z+n.z,$+(22-$)*o*o*(3-2*o),f,.2,V,.12*b*b*P(40,200,e))}for(let a=0;a<i-8;a++){const o=_[a]||0,b=o/Z;a<_.length?E(8+a,v.x+n.x+f.x*o,v.y+n.y+f.y*o,v.z+n.z+f.z*o,46-.09*o+1.5*Math.sin(l*.23+a+O[1]),f,.8+.6*b,ne,(.16+.42*b)*P(0,30,e-o)):E(8+a,0,-500,0,1,Y,1,V,0)}s.uFilm.value=1-P(0,2*L,e),s.uPoint.value.w=.72+.28*Math.sin(l*6.2832/7+O[3])}function re(e){if(!g)return;const l=e.getRenderTarget(),u=e.autoClear;c.uMap.value=1,e.autoClear=!0,e.setRenderTarget(g),e.render(C,S);const x=c.uCircle.value.x,a=c.uCircle.value.y,o=Math.max(c.uCircle.value.z,30)+75;h.left=-o,h.right=o,h.top=o,h.bottom=-o,h.updateProjectionMatrix(),h.position.set(x,200,a),h.updateMatrixWorld(!0),s.uMapRect2.value.set(x,a,o,1),e.setRenderTarget(m),e.render(C,h),e.setRenderTarget(l),e.autoClear=u,c.uMap.value=0}return D(d?U+8:0,0),{object:N,radius:100,height:80,center:new t.Vector3(0,30,0),ground:!0,groundY:0,anchors:{portal:v.clone().add(n),track:f.clone(),rest:B.clone().add(n)},sphere:ee,rings:ae,pool:q,uniforms:s,shared:c,setS:D,renderMap:re,ringAt:_,update(e,l,u){d&&(c.uTime.value=l,c.uEye.value.setFromMatrixPosition(u.matrixWorld),r.renderer&&(r.renderer.getDrawingBufferSize(J),c.uPx.value=.5*J.y*u.projectionMatrix.elements[5]),D(U+8,l))},dispose(){g&&g.dispose(),m&&m.dispose()}}}export{Re as buildHero};
