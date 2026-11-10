import*as a from"three";import{mergeGeometries as re}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as Ee,lerp as Q,smoothstep as J}from"../kit/core.js";const dt=["#05060a","#1a2440","#cfd8e6","#c47a3a","#e8c98a","#6e6048","#b3122a"],V=88,ve=40,vt=40,ie=46,Ke=48.5,yt=54,ee=36,te=17,B=26.5,$e=3.5,Ge=-17,se=30,gt=-138,xt=276/87,oe=t=>gt+t*xt,wt=t=>t<26,Qe=t=>t<8?1:t<26?2:3;function l(t,n,o={}){let d=t.index&&!o.smooth?t.toNonIndexed():t;o.smooth&&!d.index&&(d=d),d.index&&(d=d.toNonIndexed()),d.deleteAttribute("uv"),o.m&&d.applyMatrix4(o.m),o.smooth||d.computeVertexNormals();const y=d.attributes.position.count,h=new Float32Array(y*3),u=d.attributes.position;for(let g=0;g<y;g++){let v=n.r,x=n.g,L=n.b;if(o.fn){const P=o.fn(u.getX(g),u.getY(g),u.getZ(g));v=P.r,x=P.g,L=P.b}h[g*3]=v,h[g*3+1]=x,h[g*3+2]=L}return d.setAttribute("color",new a.BufferAttribute(h,3)),d}const Dt=new a.Matrix4,kt=new a.Quaternion,bt=new a.Euler,Vt=new a.Vector3,Ht=new a.Vector3;function r(t,n,o,d=0,y=0,h=0,u=1,g=1,v=1){return new a.Matrix4().compose(new a.Vector3(t,n,o),new a.Quaternion().setFromEuler(bt.set(d,y,h)),new a.Vector3(u,g,v))}function b(t,n,o,d=.2,y=1){const h=new a.CylinderGeometry(Math.SQRT1_2,Math.SQRT1_2,n,4,3,!1,Math.PI/4),u=h.attributes.position,g=Math.min(d,n*.45);for(let v=0;v<u.count;v++){let x=u.getY(v),L=u.getX(v),P=u.getZ(v);const K=Math.round((x/n+.5)*3),s=[-n/2,-n/2+g,n/2-g,n/2][K],m=K===0||K===3?g:0,w=Q(1,y,s/n+.5);Math.hypot(L,P)>1e-4&&(L=Math.sign(L)*Math.max(.02,(t/2-m)*w)*(Math.abs(L)>.1?1:0),P=Math.sign(P)*Math.max(.02,(o/2-m)*w)*(Math.abs(P)>.1?1:0)),u.setXYZ(v,L,s,P)}return h}function q(t,n,o,d=1,y=1){const h=[],u=(v,x)=>[t[0]+n[0]*v+o[0]*x,t[1]+n[1]*v+o[1]*x,t[2]+n[2]*v+o[2]*x];for(let v=0;v<d;v++)for(let x=0;x<y;x++){const L=v/d,P=(v+1)/d,K=x/y,s=(x+1)/y;h.push(...u(L,K),...u(P,K),...u(P,s),...u(L,K),...u(P,s),...u(L,s))}const g=new a.BufferGeometry;return g.setAttribute("position",new a.Float32BufferAttribute(h,3)),g.computeVertexNormals(),g}function j(t){const n=t.attributes.position.array,o=t.attributes.normal.array,d=t.attributes.color.array,y=[],h=[],u=[];for(let v=0;v<n.length;v+=9)if(!((o[v+2]+o[v+5]+o[v+8])/3<-.5))for(let x=0;x<9;x++)y.push(n[v+x]),h.push(o[v+x]),u.push(d[v+x]);const g=new a.BufferGeometry;return g.setAttribute("position",new a.Float32BufferAttribute(y,3)),g.setAttribute("normal",new a.Float32BufferAttribute(h,3)),g.setAttribute("color",new a.Float32BufferAttribute(u,3)),g}function St(t,n,o,d){const y=[],h=(s,m,w,G=1)=>{m=Math.round(m),!(m<0||m>87||s<.25||s>ve-.5)&&(m>=o[0]&&m<=o[1]&&s>d[0]-.8&&s<d[1]+.8||y.push([s,m,Ee(w,.2,1),G]))},u=6+t.int(0,5),g=t.pick([[0,5,7,3],[0,-2,3,5],[0,7,5,8],[0,3,-2,5]]),v=[0,7,12,15,19,24,27,31,36,39],x=[0,7,12,16,19,24,28,31,36,40],L=[0,2,3,5,7,8,10],P=[15,30];if(h(.45,u+4,1,1.7),h(.6,u+8,.95,1.6),h(.78,u+11,.9,1.6),n==="nocturne"){h(1.2,u+3,1,1.4);for(let m=0,w=2.6;w<39;m++,w+=2.5){const G=u+g[m%4],k=m%4===0||t.chance(.6)?v:x;for(let R=0;R<k.length;R++)h(w+R*.105,G+k[R],.62+.25*Math.sin(R*.6),1)}let s=t.int(2,9);for(let m=3.2;m<39;)s=Ee(s+t.pick([-2,-1,-1,1,1,2,3]),0,13),h(m,51+u%12+12*Math.floor(s/7)+L[s%7],.85,1.3),m+=t.pick([1.25,1.25,1.25,2.5,.625])}else if(n==="toccata"){const s=[0,12,7,15,3,12,7,19];for(let m=0,w=.8;w<39.2;m++,w+=.125){const G=Math.floor(w/2.5),k=u+g[G%4];m%2===0?h(w,k+12+s[(m>>1)%8],.6,.6):h(w,k+36+s[(m*3>>1)%8]+G%2*5,.7,.6),m%16===0&&h(w,k,.95,1.2)}}else for(let s=1.2;s<39;s+=1.7){const m=30+Mt(t.int(0,54),u,L);h(s,m,1,2.2),h(s+.85,m-12,.6,2.2),t.chance(.35)&&h(s+.42,m+7,.75,2)}for(let s=0;s<=41;s++)h(20.4+s*.021,68-s,.8-.2*Math.cos(s*.15),.8);for(let s=0;s<=41;s++)h(24.3+s*.019,24+s*1,.8,.8);for(const s of[22,25.5])for(let m=0;m<=79;m++)h(s+m*.0145,87-m,.85-.2*Math.cos(m*.11),.7);const K=[0,3,5,8,10,13,17,20,22,19,15,12,7,2];for(let s=17.7,m=0;s<27.7;s+=1.2,m++)for(let w=0;w<14;w++)h(s+w*.0857,8+m%3*2+K[w]*(w<8?1:.9),.7+.25*Math.sin(w*.7),.9);if(n==="bells")for(const s of[21,25])[0,7,12,16,19,24,28,31].forEach((m,w)=>h(s+w*.06,34+u%5+m,1,2.2));for(const s of P)[0,12,19,24,28,31,36,43,48,55,60].forEach((m,w)=>h(s+w*.028,u+2+m,1,1.6));return y.sort((s,m)=>s[0]-m[0]),{ev:y,pedalTimes:P}}function Mt(t,n,o){const d=Math.floor(t/12),y=t%12;let h=0;for(const u of o)Math.abs((u+n)%12-y)<Math.abs((h+n)%12-y)&&(h=u);return d*12+(h+n)%12}const Pt=t=>{if(t<-.15||t>.75)return 0;if(t<0){const n=1+t/.15;return n*n}if(t<.4){const n=t/.4;return 1-n*n}return .13*Math.sin(Math.PI*(t-.4)/.35)},Ct=(t,n)=>{let o=0;for(let d=0;d<n.length;d++){const y=n[d],h=d===n.length-1&&d>0?3:0;o=Math.max(o,J(y-.5,y+.5,t)*(1-J(y+3.6+h,y+5+h,t)))}return o};function At(t,n,o){const{ev:d,pedalTimes:y}=t,h=Ct(n,y);for(let u=0;u<V;u++)o[u*4]=0,o[u*4+1]=0,o[u*4+2]=99,o[u*4+3]=h;for(let u=0;u<d.length;u++){const g=d[u],v=n-g[0];if(v<-.15)break;const x=g[1]*4,L=Pt(v)*(.8+.2*g[2]);if(L>o[x]&&(o[x]=L),v>=0){const P=Q(3.4,.9,g[1]/87)*g[3]*(1+h*.8);o[x+1]=Math.min(1,o[x+1]+g[2]*Math.exp(-v/P)*J(0,.03,v)),o[x+2]=v;const K=J(-.02,.07,v)*(1-J(.5,.85,v));K>o[x+3]&&(o[x+3]=K)}}return h}const Ft=`
uniform sampler2D uEnv;
varying vec3 vWPos; varying vec3 vWN; varying vec3 vGlow;
vec4 hEnv(float k){ return texelFetch(uEnv, ivec2(int(k + 0.5), 0), 0); }
`,zt=`
{
  vec4 hW = vec4(transformed, 1.0); vec3 hN = objectNormal;
  #ifdef USE_INSTANCING
    hW = instanceMatrix * hW; hN = mat3(instanceMatrix) * hN;
  #endif
  vWPos = (modelMatrix * hW).xyz; vWN = normalize(mat3(modelMatrix) * hN);
}
`,Lt=`
uniform vec3 uKeyDir, uKeyCol, uFillCol, uAmbCol, uLampP, uLampCol; uniform float uSelf, uSpec, uShin, uGrain, uFillK, uFillMin, uDeep, uPinK, uPedalF, uTimeF; uniform vec2 uShaft; uniform mat4 uInvModel;
varying vec3 vWPos; varying vec3 vWN; varying vec3 vGlow;
float hFeltK = 0.0;                                         // 1 on white hammer felt (set by the hammer's colour patch): fuzz rim
float hHash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float hNoise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hHash(i), hHash(i + vec3(1,0,0)), f.x), mix(hHash(i + vec3(0,1,0)), hHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hHash(i + vec3(0,0,1)), hHash(i + vec3(1,0,1)), f.x), mix(hHash(i + vec3(0,1,1)), hHash(i + vec3(1,1,1)), f.x), f.y), f.z); }
`,Nt=`
{
  vec3 hN = normalize(vWN); if (!gl_FrontFacing) hN = -hN;
  vec3 hV = normalize(cameraPosition - vWPos);
  vec3 hL = (uInvModel * vec4(vWPos, 1.0)).xyz;            // hero-local position
  float hn = hNoise(hL * 0.55) * 0.6 + hNoise(hL * 2.3) * 0.4;
  // spruce grain on the soundboard apron (lengthwise lines) and long streaks on the walls
  float hg = hNoise(vec3(hL.x * 2.6, hL.y * 0.4, hL.z * 0.03)) * 0.6 + 0.4 * hNoise(vec3(hL.x * 9.0, 0.0, hL.z * 0.08));
  float hSb = uGrain * step(abs(hL.y - 40.0), 0.06), hPool = 1.0;
  diffuseColor.rgb *= mix(0.78 + 0.44 * hn, 0.55 + 0.75 * hg, max(hSb, uGrain * 0.35));
  // the plate: dull antique bronze, sand-cast (pitted bump, warm metallic sheen)
  float hPl = uGrain * step(43.6, hL.y) * (1.0 - step(-15.3, hL.z));
  if (hPl > 0.5) {
    vec3 hq = hL * 6.2; float hn0 = hNoise(hq) + 0.5 * hNoise(hq * 3.1);
    float hnx = hNoise(hq + vec3(0.4, 0.0, 0.0)) + 0.5 * hNoise(hq * 3.1 + vec3(0.4, 0.0, 0.0));
    float hnz = hNoise(hq + vec3(0.0, 0.0, 0.4)) + 0.5 * hNoise(hq * 3.1 + vec3(0.0, 0.0, 0.4));
    hN = normalize(hN + vec3(hn0 - hnx, 0.0, hn0 - hnz) * 0.15);
    float hPat = hNoise(hL * 0.16) * 0.6 + hNoise(hL * 5.5) * 0.4;
    diffuseColor.rgb *= vec3(1.0, 0.7, 0.36) * (0.34 + 0.5 * hPat * hPat);
    vec2 hd = hL.xz - vec2(-60.0, -62.0); hPool = mix(0.36, 1.3, exp(-dot(hd, hd) / 2600.0));   // the well's light pools round the open porthole
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.05, 0.12, 0.1), 0.22 * smoothstep(0.62, 0.9, hNoise(hL * 0.33 + 7.0)));   // a breath of verdigris
  }
  float hShaft = smoothstep(uShaft.x, uShaft.y, hL.y);
  float hK = max(dot(hN, uKeyDir), 0.0);
  float hRim = pow(1.0 - max(dot(hN, hV), 0.0), 3.0);
  float hNdv = 1.0 - max(dot(hN, hV), 0.0);
  vec3 hLi = uKeyCol * (hK * hShaft * hPool + 0.25 * hRim * hShaft + 0.32 * hFeltK * hNdv * hNdv * (0.3 + 0.7 * hShaft))
           + uFillCol * uDeep * (1.0 - smoothstep(6.0, 40.0, hL.y)) * (0.65 + 0.35 * hN.y)
           + uFillCol * uFillK * (max(-hN.y, 0.0) * 0.9 + 0.1 + 0.25 * uFillMin) * max(smoothstep(22.0, 42.0, hL.y), uFillMin)
           + uAmbCol * (0.6 + 0.4 * hN.y) * (0.35 + 0.65 * smoothstep(-5.0, 46.0, hL.y));
  // the music-desk lamp: a warm pool over the keyboard end (uLampP is in world space), against the cool spot
  vec3 hLd = uLampP - vWPos; float hLl = max(length(hLd), 1e-3); hLd /= hLl;
  float hLamp = exp(-hLl * hLl / 40000.0);
  hLi += uLampCol * 1.0 * (1.0 - 0.8 * uPinK) * hLamp * smoothstep(30.0, 46.0, hL.y) * max(dot(hN, hLd), 0.0);
  float hS = pow(max(dot(hN, normalize(uKeyDir + hV)), 0.0), uShin) * uSpec * (0.15 + 0.85 * hShaft) * (1.0 - 0.7 * hPl);
  vec3 hPin = vec3(0.0);
  if (uPinK > 0.0) {                                       // chrome pins: each carries its lights as vertical streaks
    vec2 hNx = hN.xz / max(length(hN.xz), 1e-3), hVx = hV.xz / max(length(hV.xz), 1e-3);
    vec2 hH1 = hLd.xz / max(length(hLd.xz), 1e-3) + hVx; hH1 /= max(length(hH1), 1e-3);
    vec2 hH2 = uKeyDir.xz / max(length(uKeyDir.xz), 1e-3) + hVx; hH2 /= max(length(hH2), 1e-3);
    float hSt1 = pow(max(dot(hNx, hH1), 0.0), 30.0), hSt2 = pow(max(dot(hNx, hH2), 0.0), 30.0) + 0.5 * pow(max(dot(hNx, hH2), 0.0), 6.0) * uPedalF, hEdge = pow(clamp(1.0 - abs(dot(hNx, hVx)), 0.0, 1.0), 6.0);
    hPin = (mix(uLampCol, vec3(dot(uLampCol, vec3(0.4))), 0.3) * (1.4 * hSt1 + 0.12 * hEdge) * (0.2 + 0.8 * hLamp) + uKeyCol * (0.95 * hSt2 + 0.1 * hEdge)) * uPinK * (1.0 - smoothstep(0.5, 0.9, abs(hN.y))) * smoothstep(0.15, 0.75, dot(hV.xz, hV.xz));   // seen from above a pin shows its cap, not a streak
  }
  float hNdh = max(dot(hN, normalize(uKeyDir + hV)), 0.0);
  vec2 hd2 = hL.xz - vec2(-60.0, -62.0); float hPoolS = mix(0.16, 1.0, exp(-dot(hd2, hd2) / 1000.0));      // the sheen gathers round the lit porthole
  vec3 hWarm = vec3(0.58, 0.38, 0.145) * hPl * hPoolS * 0.62 * pow(hNdh, 18.0) * (0.3 + 1.3 * hn * hn) * dot(uKeyCol, vec3(0.33))      // cast bronze: a broad warm metallic lobe
    + vec3(1.0, 0.76, 0.42) * hPl * hPool * (0.1 * hPoolS * pow(hNdh, 30.0) + 0.05 * pow(max(dot(reflect(-hV, hN), normalize(vec3(0.2, 0.6, -0.75))), 0.0), 6.0) + 0.05 * hRim) * dot(uKeyCol + uAmbCol, vec3(0.33));
  hPin += uKeyCol * uPinK * (0.3 * pow(hNdh, 5.0) + 0.12 * uPedalF * (0.5 + 0.5 * sin(uTimeF * 3.1 + hL.x * 1.9)));      // caps and shoulders carry the spot; a shimmer of sympathy on the pedal
  totalEmissiveRadiance += (diffuseColor.rgb * hLi + uKeyCol * hS + hWarm + hPin) * uSelf + vGlow;
  if (hFeltK > 0.0) totalEmissiveRadiance = min(totalEmissiveRadiance, vec3(0.85) + vGlow * 2.2);      // felt never blooms, but a white head flashes as it strikes
}
`;function ce(t,n,o={}){const d={uSpec:{value:o.spec??.08},uShin:{value:o.shin??30},uGrain:{value:o.grain??0},uFillK:{value:o.fillK??1},uFillMin:{value:o.fillMin??0},uDeep:{value:o.deep??0},uPinK:{value:o.pin??0}};return t.onBeforeCompile=y=>{Object.assign(y.uniforms,n,d),y.vertexShader=y.vertexShader.replace("#include <common>",`#include <common>
`+Ft+(o.vhead||"")).replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
vGlow = vec3(0.0);
`+(o.vnormal||"")).replace("#include <begin_vertex>",`#include <begin_vertex>
`+(o.vpos||"")).replace("#include <project_vertex>",zt+`
#include <project_vertex>`),y.fragmentShader=y.fragmentShader.replace("#include <common>",`#include <common>
`+Lt+(o.fhead||"")).replace("#include <color_fragment>",`#include <color_fragment>
`+(o.fcolor||"")).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
`+Nt)},t.customProgramCacheKey=()=>"hos-"+(o.key||"base"),t}const _e=t=>`vec3(${t.r.toFixed(4)}, ${t.g.toFixed(4)}, ${t.b.toFixed(4)})`,Je=`
float hFog(){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      return smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #else
    return 0.0;
  #endif
}
`;function It(t,n){const o=[],d=t.maple,y=t.maple.clone().multiplyScalar(.6),h=new a.CylinderGeometry(.3,.42,B+1,8,3);o.push(l(h,d,{smooth:!0,m:r(0,0,-B/2+.5,Math.PI/2,0,0),fn:(x,L,P)=>d.clone().multiplyScalar((.72+.3*Math.sin(P*1.7)*Math.sin(P*.31)+.12*Math.sin(P*9+x*5))*(Math.abs(P+11)<.5||Math.abs(P+12.4)<.25?.45:1))})),o.push(l(new a.CylinderGeometry(.52,.52,.9,8),t.brass.clone().multiplyScalar(1.3),{smooth:!0,m:r(0,0,-B+2.3,Math.PI/2,0,0)})),o.push(l(new a.CylinderGeometry(.5,.54,2.2,8),t.leather.clone().multiplyScalar(.55),{smooth:!0,m:r(0,0,-6.6,Math.PI/2,0,0)})),o.push(l(new a.CylinderGeometry(.34,.34,2.6,6),t.brass.clone().multiplyScalar(1.4),{smooth:!0,m:r(0,.2,.9,0,0,Math.PI/2)})),o.push(l(b(1.5,1.5,3.4,.25),y,{m:r(0,-.1,1.2)})),o.push(l(new a.CylinderGeometry(.22,.22,2,6),t.brass,{smooth:!0,m:r(0,0,0,0,0,Math.PI/2)})),o.push(l(new a.CylinderGeometry(.62,.62,1.1,8),t.leather,{smooth:!0,m:r(0,-.75,-4.2,0,0,Math.PI/2)})),o.push(l(b(.9,.9,1.5,.15),y,{m:r(0,-.3,-4.2)})),o.push(l(b(1.5,3.4,1.9,.25,.75),t.mould,{m:r(0,-.2,-B,Math.PI,0,0)})),o.push(l(b(1.2,2.2,1.3,.2,.45),t.mould,{m:r(0,-2.6,-B-.25,Math.PI,0,0)}));const u=new a.SphereGeometry(1,12,10),g=u.attributes.position;for(let x=0;x<g.count;x++){let L=g.getX(x),P=g.getY(x),K=g.getZ(x);L=Math.sign(L)*Math.pow(Math.abs(L),.55);const s=Math.max(P,0),m=1-.42*Math.pow(s,1.6);K*=m*(P<0?1-.25*P*P:1);const w=Math.exp(-Math.pow((P+.32)/.3,2));g.setXYZ(x,L*1.2*(1+.12*w),1+P*2.5,K*1.75*(1+.12*w))}u.computeVertexNormals();const v=n.range(0,.25);return o.push(l(u,t.felt,{smooth:!0,m:r(0,0,-B)})),re(o)}function Et(t){const n=[];return n.push(l(b(1.9,.55,5.6,.12),t.crimson,{m:r(0,.28,0)})),n.push(l(b(1.5,.5,2,.1,.7),t.crimson,{m:r(0,-.2,1.2,Math.PI,0,0)})),n.push(l(b(2,1.7,6,.35,.86),t.lacquer,{m:r(0,1.4,0)})),n.push(l(b(1.1,.5,3.4,.2,.7),t.lacquer,{m:r(0,2.45,.2)})),n.push(l(new a.CylinderGeometry(.11,.11,30,5,1,!0),t.steel,{smooth:!0,m:r(0,-14.4,2.2)})),n.push(l(b(.6,.6,.9,.1),t.brass,{m:r(0,.4,2.2)})),re(n)}function Kt(t){const n=[[.74,0],[.74,1],[.98,1.12],[1,2.1],[.74,2.25],[.66,4.7]].map(y=>new a.Vector2(y[0],y[1])),o=l(new a.LatheGeometry(n,7),t.chrome,{smooth:!0,fn:(y,h,u)=>h>1.05&&h<2.2?t.steel.clone().multiplyScalar(.7+.3*Math.sin(h*40)):t.chrome}),d=l(b(.86,1.4,.86,.14,.82),t.chrome,{m:r(0,5.35,0)});return re([o,d])}function Gt(t){const n=[[.62,-.4],[.62,0],[.38,.15],[.36,.75],[.5,.95],[0,1.4]].map(o=>new a.Vector2(o[0],o[1]));return l(new a.LatheGeometry(n,5),t.brass,{smooth:!0})}async function Bt(t,n={}){const o=t.rng.fork?t.rng.fork("hall-of-strings-hero"):t.rng,d=(n.palette&&n.palette.length>=7?n.palette:dt).map(e=>new a.Color(e)),y=n.piece||o.pick(["nocturne","nocturne","nocturne","toccata","bells"]),h=n.light||o.pick(["spot","spot","spot","rehearsal","moon"]),u=n.selfLight??1,g=n.strings!==!1,v=n.stringLength??490,x=n.clearKeys||[0,5],L=n.clearWindow||[17,27],P=n.dust??6e3,[K,s,m,w,G,k,R]=d,Te=o.range(-.06,.06),S={lacquer:K.clone().lerp(s,.3).multiplyScalar(1.6),indigo:s.clone(),silver:m.clone(),copper:w.clone(),spruce:G.clone().multiplyScalar(.42),bronze:k.clone().multiplyScalar(.9),crimson:R.clone().multiplyScalar(.95),maple:G.clone().lerp(new a.Color(1,1,1),.15-Te).multiplyScalar(.6),mould:G.clone().lerp(w,.55+Te).multiplyScalar(.36),felt:new a.Color(.7,.69,.66),leather:w.clone().lerp(G,.4).multiplyScalar(.5),brass:G.clone().lerp(w,.4).multiplyScalar(.7),chrome:m.clone().multiplyScalar(.5),steel:m.clone().multiplyScalar(.34),dark:K.clone().lerp(s,.5).multiplyScalar(.9)},ye={spot:{key:m.clone().multiplyScalar(1.5),fill:w.clone().multiplyScalar(.3),amb:s.clone().multiplyScalar(.55)},rehearsal:{key:new a.Color("#ffe2b0").multiplyScalar(1.3),fill:w.clone().multiplyScalar(.4),amb:new a.Color("#4a4a66").multiplyScalar(.42)},moon:{key:new a.Color("#8fb0ff").multiplyScalar(1.25),fill:w.clone().lerp(s,.5).multiplyScalar(.12),amb:new a.Color("#10204e").multiplyScalar(.8)}}[h]||null,et=o.range(-.08,.08),ge=n.keyDir?new a.Vector3().fromArray(n.keyDir).normalize():new a.Vector3(.5+et,.8,.26).normalize(),De=new Float32Array(V*4),W=new a.DataTexture(De,V,1,a.RGBAFormat,a.FloatType);W.minFilter=W.magFilter=a.NearestFilter,W.generateMipmaps=!1,W.needsUpdate=!0;const F={uEnv:{value:W},uTime:{value:0},uPedal:{value:0},uKeyDir:{value:ge.clone()},uKeyCol:{value:ye.key},uFillCol:{value:ye.fill},uAmbCol:{value:ye.amb},uSelf:{value:u},uShaft:{value:new a.Vector2(16,44)},uInvModel:{value:new a.Matrix4},uPx:{value:.002},uPtScale:{value:500},uLampP:{value:new a.Vector3(14,120,-150)},uLampCol:{value:new a.Color("#ffc88a")}};F.uPedalF=F.uPedal,F.uTimeF=F.uTime;const xe=St(o,y,x,L),D=new a.Group;D.name="hall-of-strings-hero";const ke=Math.tan(12*Math.PI/180),tt=Math.sin(12*Math.PI/180),ot=Math.cos(12*Math.PI/180),C=44.8,we=47.3,H=[];for(let e=0;e<V;e++){const c=Qe(e),i=wt(e);for(let f=0;f<c;f++){const A=(f-(c-1)/2)*(i?1.05:.72),z=Math.min(v,i?478-e*3.5:60+350*Math.pow(1-(e-26)/61,1.5)),T=oe(e)+A-(i?ke*8:0),I=i?Ke:ie,M=Ge,N={key:e,ax:T,ay:I,az:M,r:i?c===1?.5:.36:.1,bass:i,L:z};i?(N.bx=T+tt*z,N.by=Q(Ke,yt,Math.min(1,z/300)),N.bz=M+ot*z):(N.bx=T,N.by=ie,N.bz=M+z);const de=H.length;N.px=T+o.range(-.1,.1),N.pz=-23-de%4*5.6-o.range(0,.5),N.py=i?we:C,H.push(N)}}const X=(e,c)=>{const i=(c-e.az)/(e.bz-e.az);return[Q(e.ax,e.bx,i),Q(e.ay,e.by,i),c]},be=[];H.forEach((e,c)=>{be[e.key]===void 0&&(be[e.key]=c)});const Y=e=>H[be[e]+(Qe(e)-1>>1)],Se=[],Me=[],at=Math.hypot($e,B),nt=Math.atan2($e,B);for(let e=0;e<V;e++){const c=X(Y(e),-9)[1]-Y(e).r;Se[e]=Math.asin((c-ee)/at)-nt,Me[e]=Se[e]-.56}await t.yield?.();const p=[],Z=(e,c=.25)=>(i,f,A)=>e.clone().multiplyScalar(1-c+c*(.5+.5*Math.sin(i*.11+f*.3)*Math.cos(A*.17+i*.043))),U=S.dark,he=S.lacquer,Ve=S.mould.clone().lerp(U,.35).multiplyScalar(.8);p.push(l(q([-165,0,20],[330,0,0],[0,0,-35],22,2),Ve,{fn:Z(Ve)})),await t.yield?.();for(let e=0;e<=22;e++){const c=-157.5+e*14.318181818181818;p.push(j(l(b(3.2,C-6,.9,.3,.82),S.mould.clone().multiplyScalar(.8),{m:r(c,(C-6)/2,-14.7)}))),p.push(j(l(b(5,2.2,1.3,.4,.7),S.mould,{m:r(c,C-6,-14.6,Math.PI,0,0)}))),e%4===3&&await t.yield?.()}p.push(j(l(b(326,2,1.1,.4),S.mould.clone().multiplyScalar(.9),{m:r(0,30,-14.6)}))),p.push(j(l(b(326,1.4,1,.3),k.clone().multiplyScalar(.6),{m:r(0,16,-14.6)}))),await t.yield?.(),p.push(j(l(b(326,1.5,1.3,.35),S.maple.clone().multiplyScalar(1.05),{m:r(0,35.2,-14.3),fn:e=>S.maple.clone().multiplyScalar(.95+.14*Math.sin(e*.9)*Math.sin(e*.23))}))),p.push(j(l(b(326,.5,.9,.15),S.crimson,{m:r(0,36.15,-14.35)})));for(let e=-162;e<=162;e+=6)p.push(j(l(b(1,4.4,.7,.2,.8),S.brass.clone().multiplyScalar(1.25),{m:r(e,33.6,-14.5)}))),p.push(j(l(b(1.6,.6,1.7,.2,.7),S.brass.clone().multiplyScalar(1.4),{m:r(e,34.2,-14.1,Math.PI,0,0)}))),p.push(l(new a.CylinderGeometry(.28,.28,.5,6),S.steel.clone().multiplyScalar(1.6),{m:r(e,32.2,-13.95,Math.PI/2,0,0)})),(e+162)%60===54&&await t.yield?.();await t.yield?.(),p.push(j(l(b(326,1.6,1,.3),k.clone().multiplyScalar(.8),{m:r(0,C-3.6,-14.7)}))),p.push(l(q([-165,0,-15],[330,0,0],[0,C-1,0],22,3),he,{fn:Z(S.mould,.4)})),await t.yield?.(),p.push(l(q([165,0,20],[-330,0,0],[0,38.5,0],22,3),he,{fn:Z(U)})),p.push(l(q([-165,0,-15],[0,C,0],[0,0,35],2,2),he,{fn:Z(U)})),p.push(l(q([165,0,-15],[0,0,35],[0,C,0],2,2),he,{fn:Z(U)})),p.push(l(q([-165,38.5,14],[330,0,0],[0,0,6],22,1),S.mould)),p.push(l(q([165,38.5,14],[-330,0,0],[0,1.5,0],22,1),S.spruce)),n.apron!==!1&&p.push(l(q([-165,vt,70],[330,0,0],[0,0,-56],30,4),S.spruce,{fn:Z(S.spruce,.15)})),await t.yield?.();const ue=ee+19*Math.sin(Me[60])-.5;p.push(l(b(286,2.4,3,.4),S.mould,{m:r(0,ee-2,te+.9)})),p.push(l(b(282,1.3,2.2,.3),S.mould,{m:r(0,ue-1.15,te-19)})),p.push(l(b(282,.55,2,.2),S.crimson,{m:r(0,ue-.25,te-19)})),p.push(l(b(300,1.5,1.5,.3),S.mould,{m:r(0,22,13.5)})),p.push(l(b(300,.9,3.2,.3),S.crimson,{m:r(0,5.6,-11.5)})),p.push(l(b(300,1.2,3,.3),k.clone().multiplyScalar(.5),{m:r(0,9.9,8)}));for(let e=-120;e<=120;e+=30)p.push(l(b(2.2,ee-3,2.6,.4,.8),S.mould,{m:r(e+1.6,(ee-3)/2,te+1.6)})),p.push(l(b(1.3,ue-1.6,1.3,.3,.7),S.mould,{m:r(e+1.6,(ue-1.6)/2,te-19)}));for(let e=0;e<V;e++){const c=oe(e),i=o.range(-.25,.25),f=.8+o.range(0,.35),A=S.maple.clone().multiplyScalar(.55*f);p.push(l(b(2.5,1.8,33,.3),A,{m:r(c,8+i,2.2,.012,0,0)})),p.push(l(b(1.5,1.7,14,.35),A,{m:r(c,24.4+i,10.5,-.1,0,0)})),p.push(l(b(.9,8.2,1.2,.2,.7),S.mould.clone().multiplyScalar(f),{m:r(c,29.3+i,12.7,.06,0,0)})),p.push(l(b(.8,14.5,.8,.2),S.brass,{m:r(c,16.5+i,6.2)})),(e&7)===7&&await t.yield?.()}await t.yield?.();const _=[[-60,-62],[22,-62],[104,-62]];{const e=new a.Shape;e.moveTo(-165,15.5),e.lineTo(165,15.5),e.lineTo(165,78),e.lineTo(-165,78),e.closePath();for(const[f,A]of _){const z=new a.Path;z.absarc(f,-A,8.1,0,Math.PI*2,!0),e.holes.push(z)}const c=new a.ExtrudeGeometry(e,{depth:2,bevelEnabled:!0,bevelSize:.6,bevelThickness:.6,bevelSegments:1,curveSegments:16,steps:1});c.rotateX(-Math.PI/2),c.translate(0,C-2.6,0);const i=S.bronze;await t.yield?.(),p.push(l(c,i,{fn:(f,A,z)=>i.clone().multiplyScalar(.78+.22*t.noise.n2(f*.05,z*.05))})),await t.yield?.(),p.push(l(b(84,we-C,31,.5,.985),i,{m:r(-99,(we+C)/2,-31.5)})),p.push(l(b(192,.5,2.6,.2),i.clone().multiplyScalar(1.15),{m:r(42,C+.25,Ge)})),p.push(l(b(326,1.3,2,.4),i,{m:r(0,C+.65,-47.5)})),p.push(l(b(326,1.8,2.4,.5),i,{m:r(0,C+.9,-76.5)}));for(let f=-150;f<=150;f+=20.5)_.some(A=>Math.abs(f-A[0])<11.5)||p.push(l(b(1.8,1.2,27,.4,.8),i,{m:r(f,C+.6,-62,0,f/150*.12,0)}));for(const[f,A]of _){for(let T=0;T<12;T++){const I=(T+.5)/12*Math.PI*2;p.push(l(new a.CylinderGeometry(.55,.8,.7,6),S.brass,{m:r(f+Math.cos(I)*10.2,C+.35,A+Math.sin(I)*10.2)}))}const z=new a.CylinderGeometry(7.6,6.6,16,24,1,!0);z.scale(-1,1,1),p.push(l(z,U,{m:r(f,C-2.6-8,A),fn:(T,I,M)=>U.clone().multiplyScalar(.25+.75*J(C-16,C-2,I))})),await t.yield?.()}for(let f=0;f<_.length;f++){const[A,z]=_[f],T=[[7.72,C-.45],[8.25,C+.7],[9,C+.7],[9.55,C]].map(I=>new a.Vector2(I[0],I[1]));p.push(l(new a.LatheGeometry(T,56),i.clone().multiplyScalar(1.2),{smooth:!0,m:r(A,0,z)}));for(let I=.26;I<Math.PI-.26;){const M=o.range(.05,.13),N=12.4;p.push(l(b(N*M,.4,o.range(1.3,1.8),.16),i.clone().multiplyScalar(1.18),{m:r(A+Math.cos(I+M/2)*N,C+.3,z+Math.sin(I+M/2)*N,0,Math.PI/2-(I+M/2),0)})),I+=M+o.range(.025,.06)}for(const I of[-1,1])p.push(l(new a.CylinderGeometry(1.5,2,.9,10),i.clone().multiplyScalar(1.15),{m:r(A+I*15.5,C+.45,z-6.5)})),p.push(l(new a.CylinderGeometry(.7,.7,.5,6),S.brass,{m:r(A+I*15.5,C+1.1,z-6.5)})),(f===0||I>0)&&p.push(l(b(1.5,.9,11,.35,.7),i.clone().multiplyScalar(1.1),{m:r(A+I*13.2,C+.45,z-8.5,0,I*.5,0)}));await t.yield?.()}await t.yield?.();for(const[f,A]of _.slice(1))p.push(l(q([f-7,C-18.5,A+7],[14,0,0],[0,0,-14]),U.clone().multiplyScalar(.2)));for(const f of[[-52.5,-140,-84],[-52.5,-36,-2],[-52.5,46,80],[-71.5,40,86]])for(let A=f[1];A<f[2];){const z=o.range(.8,3.2);p.push(l(b(z,.55,o.range(2.2,3.2),.2),i.clone().multiplyScalar(1.12),{m:r(A+z/2,C+.27,f[0])})),A+=z+o.range(.4,1.4)}}await t.yield?.();const lt=re(p);await t.yield?.();const rt=ce(new a.MeshStandardMaterial({vertexColors:!0,roughness:.62,metalness:0}),F,{key:"static",grain:1,spec:.12,shin:24,deep:3.4}),Pe=new a.Mesh(lt,rt);Pe.name="canyon",D.add(Pe),p.forEach(e=>e.dispose()),await t.yield?.();const He=It(S,o);await t.yield?.();const me=new Float32Array(V*3),it=ce(new a.MeshStandardMaterial({vertexColors:!0,roughness:.8,metalness:0}),F,{key:"hammer",spec:.05,shin:14,fillK:1.6,fillMin:.7,vhead:`attribute vec3 aKA;
float hc, hs;
varying vec4 vHam;
`,fhead:`varying vec4 vHam;
`,fcolor:`if (vColor.g > 0.6) {
      vec3 hq = vec3(vHam.x, vHam.y - 1.0, vHam.z + ${B.toFixed(1)}); float ly = hq.y / 2.5;
      float fib = hNoise(hq * 6.0 + vHam.w * 3.7) * 0.6 + hNoise(hq * 19.0 + vHam.w) * 0.4;                 // felt fibre
      float rr = length(vec2(ly, hq.z / 1.75));
      vec3 felt = ${_e(S.felt)} * 1.12 * (0.8 + 0.2 * clamp(ly + 0.6, 0.0, 1.0)) * (0.7 + 0.5 * fib) * (0.9 + 0.1 * sin(rr * 30.0)) * (0.86 + 0.14 * hNoise(vec3(hq.x * 2.0, hq.y * 26.0, hq.z * 26.0)));   // pressed layers, fibre
      float groove = smoothstep(0.78, 0.93, ly) * (1.0 - smoothstep(0.05, 0.17, abs(abs(hq.x) - 0.45)));   // the strings' grooves pressed into the crown
      felt *= 1.0 - 0.45 * groove;
      float wf = smoothstep(-0.07, 0.2, ly + 0.05 * (fib - 0.5));                                                               // 0.3 m of soft seam down to the underfelt
      vec3 hc3 = mix(${_e(S.crimson)} * (0.6 + 0.6 * fib), felt, wf);
      diffuseColor.rgb = mix(${_e(S.mould)}, hc3, smoothstep(-0.76, -0.66, ly));
      hFeltK = wf;
    }`,vnormal:`vec4 hE = hEnv(aKA.x); float hA = mix(aKA.y, aKA.z, hE.r); hc = cos(hA); hs = sin(hA);
      objectNormal.yz = vec2(objectNormal.y * hc - objectNormal.z * hs, objectNormal.y * hs + objectNormal.z * hc);`,vpos:`transformed.yz = vec2(transformed.y * hc - transformed.z * hs, transformed.y * hs + transformed.z * hc);
      vHam = vec4(position, aKA.x);
      vGlow = vec3(0.80, 0.86, 1.0) * smoothstep(0.5, 0.62, color.g) * (1.0 - smoothstep(0.06, 0.2, color.r - color.b)) * smoothstep(0.0, 0.3, (position.y - 1.0) / 2.5)
        * (0.2 * hE.r * hE.r * hE.r + 0.75 * smoothstep(-0.1, 0.03, hE.b) * exp(-max(hE.b, 0.0) * 5.0));`}),ae=new a.InstancedMesh(He,it,V);ae.name="hammers",ae.frustumCulled=!1;for(let e=0;e<V;e++){const c=1+.16*(1-e/87)+o.range(-.02,.02);ae.setMatrixAt(e,r(oe(e),ee,te,0,0,0,c,1,1)),me[e*3]=e,me[e*3+1]=Me[e]+o.range(-.006,.006),me[e*3+2]=Se[e]}He.setAttribute("aKA",new a.InstancedBufferAttribute(me,3)),D.add(ae),await t.yield?.();const Ce=70,Be=Et(S),qe=new Float32Array(Ce),st=ce(new a.MeshStandardMaterial({vertexColors:!0,roughness:.35,metalness:0}),F,{key:"damper",spec:.9,shin:60,vhead:`attribute float aKey;
`,vpos:"transformed.y += hEnv(aKey).a * 3.0;"}),ne=new a.InstancedMesh(Be,st,Ce);ne.name="dampers",ne.frustumCulled=!1;for(let e=0;e<Ce;e++){const c=Y(e),i=X(c,se);ne.setMatrixAt(e,r(i[0],i[1]+c.r,i[2]+e%2*.5,0,c.bass?Math.atan(ke):0,0,c.bass?1.1:1,1,1)),qe[e]=e}Be.setAttribute("aKey",new a.InstancedBufferAttribute(qe,1)),D.add(ne),await t.yield?.();const O=H.length,ct=ce(new a.MeshStandardMaterial({vertexColors:!0,roughness:.25,metalness:0}),F,{key:"pin",spec:4,shin:46,pin:1}),fe=new a.InstancedMesh(Kt(S),ct,O);fe.name="pins";const ht=ce(new a.MeshStandardMaterial({vertexColors:!0,roughness:.35,metalness:0}),F,{key:"agraffe",spec:1.2,shin:30}),pe=new a.InstancedMesh(Gt(S),ht,O);pe.name="agraffes",H.forEach((e,c)=>{fe.setMatrixAt(c,r(e.px,e.py,e.pz,o.range(-.05,.02),o.range(0,6.28),0,1,1+o.range(-.04,.04),1));const i=e.bass?1.25:.8;pe.setMatrixAt(c,r(e.ax,e.ay-1.05*i,e.az,0,0,0,i,i,i))}),D.add(fe,pe),await t.yield?.();let $=null;if(g){const c=new Float32Array(198),i=[];for(let M=0;M<=32;M++)if(c.set([M/32,-1,0,M/32,1,0],M*6),M<32){const N=M*2;i.push(N,N+1,N+2,N+1,N+3,N+2)}const f=new a.InstancedBufferGeometry;f.setAttribute("position",new a.BufferAttribute(c,3)),f.setIndex(i);const A=new Float32Array(O*6),z=new Float32Array(O*6),T=new Float32Array(O*8);H.forEach((M,N)=>{const de=o();A.set([M.ax,M.ay,M.az],N*3),z.set([M.bx,M.by,M.bz],N*3),T.set([M.key,M.r,M.bass?1:0,de],N*4);const Ie=O+N;A.set([M.px,M.py+1.65,M.pz+.8],Ie*3),z.set([M.ax,M.ay,M.az],Ie*3),T.set([-1,M.r*(M.bass?.55:1),M.bass?1:0,de],Ie*4)}),f.setAttribute("iA",new a.InstancedBufferAttribute(A,3)),f.setAttribute("iB",new a.InstancedBufferAttribute(z,3)),f.setAttribute("iInfo",new a.InstancedBufferAttribute(T,4)),f.instanceCount=O*2;const I=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{}]),fog:!0,transparent:!0,depthWrite:!1,side:a.DoubleSide,premultipliedAlpha:!0,vertexShader:`
        #include <common>
        #include <fog_pars_vertex>
        attribute vec3 iA; attribute vec3 iB; attribute vec4 iInfo;
        uniform sampler2D uEnv; uniform float uTime, uPedal, uPx;
        varying float vV, vCore, vEnvF, vAmp, vKind, vLen, vSeed, vAge, vT;
        void main(){
          float t = position.x, sd = position.y, amp = 0.0, age = 99.0;
          if (iInfo.x > -0.5) {
            vec4 e = texelFetch(uEnv, ivec2(int(iInfo.x + 0.5), 0), 0); age = e.b;
            amp = max(e.g, uPedal * 0.07 * (0.6 + 0.4 * sin(uTime * 3.1 + iInfo.w * 40.0)));
          }
          float s1 = abs(sin(PI * t)), s2 = abs(sin(2.0 * PI * t)), s3 = abs(sin(3.0 * PI * t));
          float shape = 0.62 * s1 + 0.26 * s2 * (0.6 + 0.4 * sin(uTime * 5.3 + iInfo.w * 17.0)) + 0.14 * s3 * (0.6 + 0.4 * sin(uTime * 8.1 + iInfo.w * 31.0));
          float env = 1.5 * amp * shape;
          vec3 P = mix(iA, iB, t);
          vec4 mvPosition = modelViewMatrix * vec4(P, 1.0);
          vec3 dv = normalize((modelViewMatrix * vec4(iB - iA, 0.0)).xyz);
          vec3 side = normalize(cross(dv, mvPosition.xyz));
          float dist = length(mvPosition.xyz), r = iInfo.y;
          float hw = max(max(r, env), 0.8 * uPx * dist);
          mvPosition.xyz += side * sd * hw;
          vV = sd; vCore = r / hw; vEnvF = env / hw; vAmp = amp; vKind = iInfo.z; vSeed = iInfo.w; vAge = age; vT = t;
          vLen = t * length(iB - iA);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        #include <common>
        #include <fog_pars_fragment>
        uniform vec3 uCopper, uSilver, uKeyCol, uFillCol, uAmbCol; uniform float uTime, uGlow, uSelf, uPedalF, uIdle;
        varying float vV, vCore, vEnvF, vAmp, vKind, vLen, vSeed, vAge, vT;
        ${Je}
        void main(){
          float a = abs(vV), fw = max(fwidth(vV), 1e-4);
          bool sub = vCore < fw;
          float core = sub ? min(1.0, 2.0 * vCore / fw) * (1.0 - a) : clamp((vCore - a) / fw + 0.5, 0.0, 1.0);
          vec3 base = mix(uSilver * 0.24, uCopper * 0.5, vKind);
          float s = vLen / 0.6, fs = fwidth(s);
          base *= mix(1.0, mix(0.5 + 0.5 * (0.5 + 0.5 * sin(6.2832 * s)), 0.76, clamp(fs * 2.5, 0.0, 1.0)), vKind);
          float nx = clamp(vV / max(vCore, 1e-3), -1.0, 1.0), cyl = sqrt(1.0 - nx * nx);
          float hlGain = mix(0.3, uIdle, vKind) + 1.8 * vAmp;
          vec3 gcol = mix(mix(uSilver, vec3(0.5, 0.68, 1.0), 0.45), uCopper * vec3(1.5, 1.0, 0.62), vKind);
          vec3 hlCol = mix(uKeyCol, uKeyCol * (0.45 + 0.9 * uCopper), 0.6 * vKind);                 // a copper string carries the key as a warm line
          vec3 lit = sub ? base * (uAmbCol * 1.2 + uKeyCol * 0.4 + uFillCol * 0.4) + hlCol * 0.14 * hlGain
                         : base * (uAmbCol * 1.2 + uKeyCol * 0.6 * cyl + uFillCol * 0.9 * (0.5 - 0.5 * nx)) + hlCol * exp(-pow((nx - 0.35) / 0.11, 2.0)) * hlGain;
          lit *= max(uSelf, 0.15);
          // sympathy: with the dampers lifted every string of the field carries a little light of its own
          float symp = uPedalF * step(0.0, vAge) * (0.7 + 0.3 * sin(uTime * 3.1 + vSeed * 40.0));
          lit += gcol * uGlow * symp * mix(0.4, 0.3, vKind) * (sub ? 1.0 : 0.45 + 0.55 * cyl);
          // the ribbon: long exposure of a standing wave, bright at the turning points, with ghost strands
          vec3 rgb = lit * core; float alpha = core;
          if (vEnvF > 0.002) {
            float q = a / vEnvF, inside = 1.0 - smoothstep(1.0 - max(fw / vEnvF, 0.03), 1.0, q);
            float dens = 0.1 + 0.92 * pow(min(q, 1.0), 7.0);
            float sv = vV / vEnvF;
            for (int i = 0; i < 3; i++) {
              float gp = sin(uTime * (9.0 + 4.0 * float(i)) + vSeed * 20.0 + float(i) * 2.1 + vT * 5.0);
              dens += 0.26 * exp(-pow((sv - gp) / (0.05 + fw / vEnvF), 2.0));
            }
            float flash = 1.0 + 1.2 * exp(-vAge * 4.0);
            rgb += gcol * uGlow * mix(0.5, 1.0, vKind) * dens * inside * (0.2 + 0.8 * max(vAmp, 0.35 * symp)) * flash * smoothstep(0.0, 0.25, vEnvF) * mix(0.2, 1.0, smoothstep(0.0, 12.0, abs(vLen - 8.0)));
            alpha += 0.05 * inside * vAmp * (1.0 - core);
          }
          #ifdef USE_FOG
            rgb = mix(rgb, fogColor * alpha, hFog());
          #endif
          gl_FragColor = vec4(rgb, alpha);
        }`});Object.assign(I.uniforms,{uEnv:F.uEnv,uTime:F.uTime,uPedal:F.uPedal,uPx:F.uPx,uKeyCol:F.uKeyCol,uFillCol:F.uFillCol,uAmbCol:F.uAmbCol,uSelf:F.uSelf,uCopper:{value:w.clone()},uSilver:{value:m.clone()},uGlow:{value:.62},uPedalF:F.uPedal,uIdle:{value:.5}}),$=new a.Mesh(f,I),$.name="strings",$.frustumCulled=!1,$.renderOrder=2,D.add($)}await t.yield?.(),await t.yield?.();const je=P+V,Ae=new Float32Array(je*3),Fe=new Float32Array(je*4);for(let e=0;e<P;e++){const c=H[Math.floor(o()*H.length)],i=Math.min(.98,(.01+Math.pow(o(),1.5)*190)/c.L+.01),f=X(c,Q(c.az,c.bz,i));Ae.set([f[0]+o.range(-.4,.4),f[1]+.3+o()*1.2,f[2]],e*3),Fe.set([c.key,i,o(),o()],e*4)}await t.yield?.();for(let e=0;e<V;e++){const c=Y(e),i=X(c,-9),f=P+e;Ae.set([i[0],i[1]-.2,i[2]],f*3),Fe.set([e,0,o(),2],f*4)}const ze=new a.BufferGeometry;ze.setAttribute("position",new a.BufferAttribute(Ae,3)),ze.setAttribute("aD",new a.BufferAttribute(Fe,4));const We=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{}]),fog:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 aD; uniform sampler2D uEnv; uniform float uTime, uPtScale, uPedal; uniform vec3 uCopper, uSilver, uKeyCol;
      varying vec3 vCol; varying float vFlash;
      void main(){
        vec4 e = texelFetch(uEnv, ivec2(int(aD.x + 0.5), 0), 0);
        float age = e.b, sz, mn = 1.5; vec3 p = position; vec3 tint = mix(uSilver, uCopper * 1.3, step(aD.x, 25.5));
        if (aD.w > 1.5) {
          float f = exp(-age * 7.0) * step(age, 2.0);
          sz = 6.0 * (0.35 + 0.65 * f); vCol = mix(tint, uKeyCol, 0.5) * 1.3 * f; vFlash = 1.0; mn = 0.0;
        } else {
          float shape = abs(sin(PI * aD.y * (1.0 + floor(aD.w * 3.0))));
          float up = (3.0 + 3.0 * aD.z) * shape * (1.0 - exp(-age * 5.0)) * exp(-age * 0.5) * step(age, 30.0) + uPedal * 0.7 * aD.z;
          p.y += up + 0.25 * sin(uTime * 0.4 + aD.z * 50.0);
          p.x += 0.5 * sin(uTime * 0.23 + aD.w * 70.0) + up * 0.25 * sin(aD.z * 91.0);
          p.z += 0.5 * cos(uTime * 0.19 + aD.z * 33.0);
          sz = 0.2 + 0.25 * aD.w; vFlash = 0.0;
          vCol = tint * (0.2 + 1.7 * min(up / 3.0, 1.0)) * (0.6 + 0.4 * sin(uTime * 2.0 + aD.z * 80.0));
        }
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        float ideal = sz * uPtScale / max(-mvPosition.z, 0.1);
        gl_PointSize = clamp(ideal, mn, 150.0);
        if (aD.w < 1.5) vCol *= min(1.0, pow(ideal / 1.5, 2.0));
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      varying vec3 vCol; varying float vFlash;
      ${Je}
      void main(){
        vec2 c = gl_PointCoord * 2.0 - 1.0; float d = length(c);
        float soft = 1.0 - smoothstep(0.35, 1.0, d);
        float star = exp(-d * d * 7.0) + 0.6 * exp(-c.y * c.y * 160.0) * exp(-c.x * c.x * 3.5) * (1.0 - smoothstep(0.7, 1.0, abs(c.x)));
        vec3 rgb = vCol * mix(soft, star, vFlash) * (1.0 - hFog());
        gl_FragColor = vec4(rgb, 1.0);
      }`});Object.assign(We.uniforms,{uEnv:F.uEnv,uTime:F.uTime,uPedal:F.uPedal,uPtScale:F.uPtScale,uKeyCol:F.uKeyCol,uCopper:{value:w.clone()},uSilver:{value:m.clone()}});const le=new a.Points(ze,We);le.name="dust",le.frustumCulled=!1,le.renderOrder=3,D.add(le),await t.yield?.();const Le=_.map(([e,c],i)=>{const f=G.clone().multiplyScalar(i===0?8:.9);return l(new a.TorusGeometry(7.72,i===0?.16:.1,5,72),f,{smooth:!0,m:r(e,C-.25,c,Math.PI/2,0,0)})});Le.push(l(new a.TorusGeometry(8.28,.1,5,72),G.clone().multiplyScalar(4.5),{smooth:!0,m:r(_[0][0],C+.72,_[0][1],Math.PI/2,0,0)})),Le.push(l(new a.TorusGeometry(9.5,.07,5,72),G.clone().multiplyScalar(2.4),{smooth:!0,m:r(_[0][0],C+.06,_[0][1],Math.PI/2,0,0)}));const ut=new a.ShaderMaterial({uniforms:{...a.UniformsUtils.clone(a.UniformsLib.fog),uTime:F.uTime,uPedalF:F.uPedal},fog:!0,vertexColors:!0,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      varying vec3 vC; varying vec2 vXZ;
      void main(){ vC = color; vXZ = position.xz; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform float uTime, uPedalF; varying vec3 vC; varying vec2 vXZ;
      void main(){
        vec2 d = vXZ - vec2(${_[0][0].toFixed(1)}, ${_[0][1].toFixed(1)}); float an = atan(d.y, d.x + 1e-4);
        float sh = 0.62 + 0.3 * sin(an * 3.0 - uTime * 0.9) + 0.22 * sin(an * 7.0 + uTime * 1.7) + 0.3 * uPedalF;
        gl_FragColor = vec4(vC * sh, 1.0);
        #include <fog_fragment>
      }`}),Re=new a.Mesh(re(Le),ut);Re.name="porthole-rims",D.add(Re);const E=(e,c,i)=>new a.Vector3(e,c,i),Ne=E(_[0][0],C-.6,_[0][1]),Ue=E(Math.cos(55*Math.PI/180),-Math.sin(55*Math.PI/180),0),Oe=Ne.clone().addScaledVector(Ue,-60),mt={flyThrough:[E(-153,60,78),E(-153,57,42),E(-154,49,15),E(-155,35,3),E(-155,31,-1),E(-155,47,-4),E(-153,61,-22),E(-128,84,-52),Oe.clone(),Ne.clone()],canyonHang:E(-155,31,-1),canyonLook:E(140,37,-9),rankStart:E(oe(0),ie,-9),rankEnd:E(oe(87),ie,-9),portalSeat:{position:Ne,normal:E(0,1,0),radius:7},diveStart:Oe,diveDir:Ue,damperLine:[E(X(Y(0),se)[0],Ke+2,se),E(X(Y(69),se)[0],ie+2,se)],portholes:_.slice(1).map(([e,c])=>E(e,C,c)),spotAxis:ge.clone()};let Xe=!1,Ye=0;const ft=new a.Vector2;function pt(e){Xe=!0,Ye=Ee(e,0,1)}function Ze(e,c,i){const f=(Xe?Ye:c/ve%1)*ve;if(F.uPedal.value=At(xe,f,De),W.needsUpdate=!0,F.uTime.value=c,D.updateWorldMatrix(!0,!1),F.uInvModel.value.copy(D.matrixWorld).invert(),F.uKeyDir.value.copy(ge).transformDirection(D.matrixWorld),i){let A=720;t.renderer?.getDrawingBufferSize&&(A=t.renderer.getDrawingBufferSize(ft).y||720);const z=i.projectionMatrix.elements[5];F.uPx.value=2/(z*A),F.uPtScale.value=z*A/2}}return Ze(0,0,null),{object:D,radius:62,height:24,center:new a.Vector3(0,34,1.5),bounds:{min:E(-165,0,-78),max:E(165,60,Ge+Math.min(v,490))},anchors:mt,update:Ze,setProgress:pt,setSelfLight(e){F.uSelf.value=e},score:xe.ev,pedalTimes:xe.pedalTimes,scoreSeconds:ve,piece:y,lightState:h,envTexture:W,uniforms:F,keyX:oe,parts:{strings:$,hammers:ae,dampers:ne,pins:fe,agraffes:pe,dust:le,canyon:Pe},dispose(){W.dispose()},ground:!1,groundY:0}}export{Bt as buildHero};
