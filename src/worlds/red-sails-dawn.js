import*as w from"three";import{makePath as gt,clamp as S0,lerp as j}from"../kit/core.js";import{buildHero as wt,PALETTE as xt}from"../parts/red-sails-dawn.js";const A=(e,n,m)=>{const f=S0((m-e)/(n-e),0,1);return f*f*(3-2*f)},M0=Math.PI*2,l0=e=>new w.Color(e);function q0(){const e=[],n=[],m=[],f=[],d={P:e,I:f,v(v,z,x,y,r){return e.push(v,z,x),n.push(y[0],y[1],y[2]),m.push(r?r[0]:0,r?r[1]:0,r?r[2]:0,r?r[3]:0),e.length/3-1},tri(v,z,x){f.push(v,z,x)},quad(v,z,x,y){f.push(v,z,x,v,x,y)},tube(v,z,x={}){const y=[],r=new w.Vector3,h=new w.Vector3,c=new w.Vector3,t=new w.Vector3;for(let u=0;u<v.length;u++){const g=v[Math.max(u-1,0)].p,i=v[Math.min(u+1,v.length-1)].p,b=v[u];h.set(i[0]-g[0],i[1]-g[1],i[2]-g[2]).normalize(),r.set(0,1,0),Math.abs(h.y)>.9&&r.set(x.side?0:1,0,x.side?1:0),c.crossVectors(h,r).normalize(),t.crossVectors(c,h).normalize();const S=[],G=b.r,M=b.ry??b.r;for(let F=0;F<z;F++){const s=F/z*M0+(x.twist||0),C=Math.cos(s),H=Math.sin(s),$=x.flatBelly&&H<0?x.flatBelly:1,Y=b.cb&&H<-.2?b.cb:b.c;S.push(d.v(b.p[0]+c.x*C*G+t.x*H*M*$,b.p[1]+c.y*C*G+t.y*H*M*$,b.p[2]+c.z*C*G+t.z*H*M*$,Y,b.a))}y.push(S)}for(let u=0;u<y.length-1;u++)for(let g=0;g<z;g++){const i=(g+1)%z;d.quad(y[u][g],y[u][i],y[u+1][i],y[u+1][g])}for(const u of[0,y.length-1]){const g=v[u],i=d.v(g.p[0],g.p[1],g.p[2],g.c,g.a);for(let b=0;b<z;b++){const S=(b+1)%z;u?d.tri(y[u][b],y[u][S],i):d.tri(y[u][S],y[u][b],i)}}},build(){const v=new w.BufferGeometry;return v.setAttribute("position",new w.Float32BufferAttribute(e,3)),v.setAttribute("color",new w.Float32BufferAttribute(n,3)),v.setAttribute("aAnim",new w.Float32BufferAttribute(m,4)),v.setIndex(f),v.computeVertexNormals(),v}};return d}const e0=(e,n=1)=>{const m=l0(e);return[m.r*n,m.g*n,m.b*n]},t0=(e,n,m)=>[j(e[0],n[0],m),j(e[1],n[1],m),j(e[2],n[2],m)],Mt=["uTime","uSunLineY","uSunDir","uSunColor","uSunI","uSky","uGround","uHemiW","uMistColor","uMistTop","uMistAmt","uMistLit","uFogCol","uFogWarm","uFogRange","uSunAz"],ae=`
uniform float uTime, uSunLineY, uSunI, uHemiW, uMistTop, uMistAmt, uMistLit;
uniform vec3 uSunDir, uSunColor, uSky, uGround, uMistColor, uFogCol, uFogWarm;
uniform vec2 uFogRange, uSunAz;
float h21(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
float litAt(float y) { return smoothstep(-0.03, 0.03, y - uSunLineY); }
// the waterline wanders at a finer scale than the ground grid: ground and water add the same small offset to their height
float shoreWig(vec2 p) { return (vn(p * 1.1 + 2.0) - 0.5) * 0.085 + (vn(p * 3.7 + 9.0) - 0.5) * 0.04; }
vec3 hemiAt(vec3 N) { return mix(uGround, uSky, N.y * 0.5 + 0.5) * uHemiW; }
vec3 hazeCol(vec3 dir) { float s = max(dot(dir.xz, uSunAz), 0.0); s *= s; return mix(uFogCol, uFogWarm, s * s * (1.0 - 0.5 * clamp(dir.y * 4.0, 0.0, 1.0))); }
vec3 haze(vec3 col, vec3 w) {
  vec3 d = w - cameraPosition; float dist = length(d);
  float f = clamp((dist - uFogRange.x) / max(uFogRange.y - uFogRange.x, 1.0), 0.0, 1.0);
  return mix(col, hazeCol(d / max(dist, 1e-4)), f * (2.0 - f) * 0.92);
}
// ground mist: things fade toward the mist colour below uMistTop above their own ground (the hero's law)
vec3 mistFade(vec3 col, vec3 w, float groundY) {
  float md = clamp(uMistTop - (w.y - groundY), 0.0, uMistTop);
  float vy = abs(normalize(cameraPosition - w + vec3(0.0, 1e-4, 0.0)).y);
  return mix(col, uMistColor * 0.8, min(1.0 - exp(-md * 0.11 / max(vy, 0.05)), 0.8) * uMistAmt);
}`;function V0(e,n,m=Mt){for(const f of m)e.uniforms[f]=n[f];return e}const bt=[[0,1.5,0],[30,1.5,0],[41,1.8,.2],[51,3.7,.4],[60,5.3,.5],[67,5.6,.6],[81,4.6,-.9],[94,2.6,-2.2],[104,1.6,-3.4],[121,1.25,-6.2],[136,.95,-8.8],[170,1.12,-14.8],[205,1.5,-21.4],[214,1.9,-20.9],[226,1.5,-21.9],[236,1,-24],[244,.9,-25.5],[254,1.1,-25.8],[265,1.7,-24.8],[276,2.2,-22.9],[294.2,2,-17.7],[310,1.6,-10.6],[318,1.7,-6],[326.6,2.4,-.8],[340,2.95,8.6],[352.8,3,17.6],[379,3,35.9]],je=30,zt=257;function kt(e,n){const m=gt(bt),f=m.length,d=220,v=e.noise,z=new Float32Array(d+1),x=new Float32Array(d+1),y=new Float32Array(d+1),r=new Float32Array(d+1),h=new w.Vector3,c=new w.Vector3;for(let M=0;M<=d;M++){m.posAtDist(M/d*f,h),m.tangentAtDist(M/d*f,c);const F=Math.hypot(c.x,c.z)||1;z[M]=h.x,x[M]=h.z,y[M]=c.x/F,r[M]=c.z/F}const t={s:0,lat:0};function u(M,F){let s=1e18,C=0;for(let a0=0;a0<=d;a0+=4){const w0=M-z[a0],x0=F-x[a0],b0=w0*w0+x0*x0;b0<s&&(s=b0,C=a0)}const H=Math.max(C-4,0),$=Math.min(C+4,d);for(let a0=H;a0<=$;a0++){const w0=M-z[a0],x0=F-x[a0],b0=w0*w0+x0*x0;b0<s&&(s=b0,C=a0)}const Y=M-z[C],D=F-x[C];return t.s=C/d*f+Y*y[C]+D*r[C],t.lat=Y*r[C]-D*y[C],t}function g(M,F,s=new w.Vector3){m.posAtDist(M,h),m.tangentAtDist(S0(M,0,f),c);const C=Math.hypot(c.x,c.z)||1;return s.set(h.x+c.z/C*F,0,h.z-c.x/C*F)}const i=n===2?.2:.3;function b(M){const F=(M-je)/(zt-je);if(F<=0||F>=1)return 0;const s=Math.sqrt(Math.min(1,F/.07,(1-F)/.1));return(5.2+7.3*Math.pow(Math.sin(Math.PI*Math.pow(F,.8)),.6)*(.85+.3*v.n2(M*.021,3.3)))*s}const S=M=>2.7+.4*Math.sin(M*.09)-6.4*A(106,126,M)*(1-A(214,232,M))+1.3*A(230,237,M)*(1-A(250,256,M));function G(M,F){const{s,lat:C}=u(M,F),H=Math.abs(C),$=v.fbm2(M*.03,F*.03,3),Y=v.fbm2(M*.11+7,F*.11,2);let D=.55+.22*$;const a0=-19+6*Math.sin(M*.013),w0=31+5*$,x0=j(10,6,A(f-45,f-8,s)),b0=Math.max(1-A(w0-7,w0+3,Math.abs(F-a0)),1-A(x0,x0+8,H));D=j(D,-.34+.15*Y-.85*A(.75,1,b0),b0);const Z0=A(.1,.55,v.fbm2(M*.045+31,F*.06,2))*A(8,15,H)*b0;D=Math.max(D,j(D,.14+.05*Y,Z0));const $0=2.1+1.5*v.n2(M*.1+5.5,F*.1)+.9*v.n2(M*.27,F*.27+8),c0=(z0,P0)=>{if(P0<.02||z0<-1.2)return;const _0=Math.max($0,.5)*P0+.3,ge=S0(z0/_0,0,1);if(z0>_0+1.5)return;const oe=.13-.3*Math.pow(ge,.75)+.03*Y+.035*v.n2(M*.45+3,F*.45);D=Math.max(D,j(D,oe,P0*(1-A(_0,_0+1.5,z0))))},u0=b(s);if(u0>.01){const z0=Math.abs(C-S(s)-u0)/u0+.1*v.fbm2(M*.11,F*.11,3)*Math.min(1,6/u0),P0=1-A(1-.8/u0,1,z0);D=Math.max(D,j(D,n===2?.1+.36*v.fbm2(M*.085+3,F*.085,2)+.03*Y:i+.04*Y,P0)),c0(S(s)+.55-C,Math.min(1,u0/4))}const _=s+1.6*Y+.9*Math.sin(C*.7),h0=A(23.5,26.5,_)*(1-A(55,58.5,_))*(1-A(5.4,6.6,-C+.7*Y))*(1-A(9,12,C));D=Math.max(D,j(D,i+.04*Y,h0)),c0(Math.max(26.2-_,_-55.4)+.4,(1-A(4.5,7,-C))*(1-A(7,10,C)));const H0=A(82,87,_)*(1-A(107,112,_))*A(2.9,4.1,-C+.5*Y)*(1-A(8.5,11,-C));D=Math.max(D,j(D,.13+.05*Y,H0));const Q0=Math.max(A(311,316,s)*(1-A(338,344,s)),A(274,280,s)*(1-A(302,308,s)))*A(2.5,3.9,C+.5*Y)*(1-A(9.5,14,C));D=Math.max(D,j(D,i+.04*Y,Q0)),c0(3.3-C,Math.max(A(311,316,s)*(1-A(338,344,s)),A(274,280,s)*(1-A(302,308,s))));const B0=A(-7,-2,s)*(1-A(27,33,s))*A(1.8,2.6,C+.3*Y)*(1-A(16,24,C)),k0=A(9,15,s)*(1-A(40,52,s))*A(3,4.6,-C+.5*Y)*(1-A(8.5,12.5,-C));D=Math.max(D,j(D,.17+.05*Y,k0)),D=Math.max(D,j(D,i+.04*Y+.7*A(8.5,13,C),B0)),c0(2.3-C,A(-7,-2,s)*(1-A(27,33,s))*(1-A(2.5,4,-C)));const W=A(C>0?f-52:f-26,C>0?f-47:f-20,s)*A(4.6,6,H+.3*Y)*(1-A(9.5,12,H));D=Math.max(D,j(D,i-.04+.04*Y,W)),c0(5.4-H,A(C>0?f-52:f-26,C>0?f-47:f-20,s)*A(2.2,3.2,H));const T0=(M-305)/13,s0=(F-17)/15,U0=Math.exp(-T0*T0-s0*s0);D=Math.max(D,j(D,.7+.1*Y,A(.3,.7,U0)));const E0=39+3*Math.sin(M*.021),K0=(F-E0)/6.5;D+=3.2*Math.exp(-K0*K0)*A(8.5,14,H)*(.8+.3*$);const X0=-262+14*Math.sin(M*.008+1),W0=(F-X0)/16;return D+=4.5*Math.exp(-W0*W0)+1.2*A(40,110,F-E0),D}return{path:m,L:f,info:u,at:g,heightAt:G,barHalf:b,barEdge:S,barTop:i}}async function At(e,n,m){const f=[],d=[];for(let t=-110;t<-30;t+=16)f.push(t);for(let t=-30;t<9;t+=3)f.push(t);for(let t=9;t<117;t+=2)f.push(t);for(let t=117;t<=420;t+=3)f.push(t);for(let t=436;t<=900;t+=40)f.push(t);for(let t=-340;t<-70;t+=22)d.push(t);for(let t=-70;t<-52;t+=3)d.push(t);for(let t=-52;t<-36;t+=1.3)d.push(t);for(let t=-36;t<8;t+=.86)d.push(t);for(let t=8;t<16;t+=1.6)d.push(t);for(let t=16;t<=46;t+=2.5)d.push(t);for(let t=50;t<=62;t+=4)d.push(t);for(let t=80;t<=200;t+=40)d.push(t);const v=f.length,z=d.length,x=new Float32Array(v*z*3),y=[];for(let t=0,u=0;t<z;t++){for(let g=0;g<v;g++,u++)x[u*3]=f[g],x[u*3+1]=m.heightAt(f[g],d[t]),x[u*3+2]=d[t];await e.yield()}for(let t=0;t<z-1;t++)for(let u=0;u<v-1;u++){const g=t*v+u;y.push(g,g+v,g+1,g+1,g+v,g+v+1)}const r=new w.BufferGeometry;r.setAttribute("position",new w.BufferAttribute(x,3)),r.setIndex(y),await e.yield(),r.computeVertexNormals(),await e.yield();const h=V0(V0(new w.ShaderMaterial({uniforms:{uMud:{value:l0("#9C4A32")},uGreen:n.uGreen,uWet:{value:m.barTop<.25?1:0}},vertexShader:`
      varying vec3 vW, vN;
      void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normal; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
      uniform vec3 uMud, uGreen; uniform float uWet; varying vec3 vW, vN;
      ${ae}
      ${Ae}
      // distance from the nearest plate edge of a Voronoi tiling, and the plate's id
      float vorE(vec2 p, out float id) {
        vec2 ip = floor(p), fp = fract(p); float f1 = 9.0, f2 = 9.0; id = 0.0;
        for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
          vec2 o = vec2(float(i), float(j)), c = o + vec2(h21(ip + o), h21(ip + o + 17.3)) * 0.8 + 0.1 - fp;
          float d = dot(c, c);
          if (d < f1) { f2 = f1; f1 = d; id = h21(ip + o + 3.1); } else if (d < f2) { f2 = d; }
        }
        return sqrt(max(f2, 0.0)) - sqrt(max(f1, 0.0));
      }
      void main() {
        vec3 Ng = normalize(vN + vec3(0.0, 1e-4, 0.0));
        float steep = 1.0 - smoothstep(0.72, 0.94, Ng.y);                      // cut banks and levee flanks
        vec2 gx = vW.xz + vW.y * vec2(0.9, 1.3);                                // slopes are not smeared: the pattern also runs with height
        vec2 p = gx * 2.5 + vec2(vn(gx * 0.9), vn(gx * 0.9 + 5.0)) * 0.7;
        float fw = max(fwidth(p.x), fwidth(p.y));
        float id, id2, id3, e = vorE(p, id), e2 = vorE(p * 2.7 + 13.0, id2), e3 = vorE(p * 0.43 + 31.0, id3);
        float lod = 1.0 - smoothstep(0.25, 0.9, fw);
        float yS = vW.y + shoreWig(vW.xz) * (1.0 - smoothstep(0.25, 0.5, fwidth(vW.x) + fwidth(vW.z)));
        float dry = mix(smoothstep(0.07, 0.2, yS), smoothstep(0.0, 0.06, yS), uWet);      // after rain the plates stand in a film of water, their cracks brimming
        // the mud is not one tile: cracked plates in patches (large slabs here, fine crazing there), smooth silt pans between
        float pa = vn(vW.xz * 0.27 + 11.0) + 0.3 * vn(vW.xz * 1.1), pb = vn(vW.xz * 0.19 + 70.0);
        float cm = max(0.5 + 0.5 * smoothstep(0.6, 0.8, pa), uWet * 0.85) * (1.0 - steep);      // polish 4: plates everywhere (bold here, fainter in the silt pans): no smooth smear at the lens
        float dryC = mix(0.6, 1.0, dry) * smoothstep(-0.16, -0.03, yS);      // the cracks run on down the wet apron and under the first centimetres of clear water
        float cmBig = smoothstep(0.55, 0.7, pb) * (1.0 - smoothstep(0.5, 0.64, pa)) * (1.0 - steep);
        float lod3 = (1.0 - smoothstep(0.5, 1.6, fw)) * cmBig * dry;
        lod *= cm;
        float lod2 = (1.0 - smoothstep(0.1, 0.4, fw * 2.7)) * mix(0.45, 1.0, smoothstep(0.56, 0.76, pa)) * dryC * (1.0 - steep);
        float crack = max((1.0 - smoothstep(0.012, 0.03 + fw, e)) * lod * dryC, 0.75 * (1.0 - smoothstep(0.008, 0.04 + fw * 2.7, e2)) * lod2);
        crack = max(crack, (1.0 - smoothstep(0.01, 0.03 + fw * 0.43, e3)) * lod3);
        // polish 3: seen close, a big slab is not a smooth cell: hairline crazing inside it, and grit everywhere
        // ... and seen from afar or at a grazing angle the bar is not a smooth smear: great polygons 2.5 m across take over as the fine ones fade
        float id4, e4 = vorE(p * 0.16 + 50.0, id4);
        float lod4 = (1.0 - smoothstep(1.5, 5.0, fw)) * smoothstep(0.1, 0.4, fw) * smoothstep(0.0, 0.12, yS) * (1.0 - steep);
        crack = max(crack, 0.7 * (1.0 - smoothstep(0.008, 0.035 + fw * 0.3, e4)) * lod4);
        float nearK = 1.0 - smoothstep(0.03, 0.14, fw);
        crack = max(crack, 0.5 * (1.0 - smoothstep(0.006, 0.03 + fw * 2.7, e2)) * (1.0 - smoothstep(0.1, 0.4, fw * 2.7)) * cmBig * dry);
        float grit = (vn(vW.xz * 41.0) - 0.5) * 0.3 + (vn(vW.xz * 97.0 + 3.0) - 0.5) * 0.24;
        float curl = smoothstep(0.1, 0.45, e) * lod * dry;
        // strandlines: as the pool shrinks it leaves fine lines of silt that follow every bay and tongue of the waterline
        float sl = yS * 36.0 + 1.3 * vn(vW.xz * 0.5 + 3.0) + 0.5 * vn(vW.xz * 2.3), fsl = fwidth(sl);
        float slK = (1.0 - smoothstep(0.3, 0.9, fsl)) * smoothstep(-0.05, -0.01, yS) * (1.0 - smoothstep(0.07, 0.15, yS)) * (1.0 - steep) * (1.0 - uWet) * (0.35 + 0.65 * smoothstep(0.3, 0.7, vn(vW.xz * 0.35 + 60.0)));
        float strand = (1.0 - smoothstep(0.04, 0.07 + fsl, abs(fract(sl) - 0.5))) * slK;
        float strandP = (1.0 - smoothstep(0.03, 0.06 + fsl, abs(fract(sl + 0.16) - 0.5))) * slK;
        float wet = 1.0 - smoothstep(0.0, 0.25, yS);                             // the apron darkens gradually toward the water: no hard band
        float edgeL = smoothstep(0.06, 0.13, e) * (1.0 - smoothstep(0.15, 0.36, e)) * lod * dry;      // plates curl up pale at their edges
        float big = vn(vW.xz * 0.07), mid = vn(vW.xz * 0.6);
        vec3 mud = uMud * vec3(0.86, 1.36, 1.6);                                // red-brown terracotta, not crimson
        vec3 alb = mud * (0.74 + 0.42 * id * lod * dry + 0.22 * (id3 - 0.5) * lod3 + 0.42 * (id4 - 0.5) * lod4 + 0.2 * mid + 0.3 * (big - 0.5)) * mix(1.0, 0.82, curl * 0.5);
        alb = mix(alb, mud * vec3(1.4, 1.6, 1.7) + 0.02, edgeL * 0.7);
        alb *= (0.86 + 0.28 * vn(vW.xz * 9.0) * (1.0 - smoothstep(0.1, 0.5, fw))) * (1.0 + 0.3 * (id2 - 0.5) * lod2) * (1.0 + grit * nearK);
        float edge3 = smoothstep(0.02, 0.05, e3) * (1.0 - smoothstep(0.06, 0.15, e3)) * lod3;
        alb = mix(alb, mud * vec3(1.4, 1.6, 1.7) + 0.02, edge3 * 0.45);
        // silt pans: paler, with faint ripple marks and drift lines left by the falling water
        float pan = (1.0 - smoothstep(0.42, 0.62, pa)) * (1.0 - cmBig) * dry * (1.0 - steep);
        float rip = sin((vW.x * 0.6 + vW.z) * 9.0 + 3.0 * vn(vW.xz * 0.8)) * 0.5 + 0.5;
        alb = mix(alb, mud.rgb * vec3(1.15, 1.45, 1.5) * (0.82 + 0.16 * rip * (1.0 - smoothstep(0.05, 0.3, fw))), pan * 0.55);
        float drift = 1.0 - smoothstep(0.0, 0.035, abs(fract(vW.y * 9.0 + 0.25 * vn(vW.xz * 0.5)) - 0.5));
        alb *= 1.0 - 0.13 * drift * smoothstep(0.12, 0.2, vW.y) * (1.0 - smoothstep(0.24, 0.3, vW.y));
        alb = mix(alb, uGreen * 0.5, 0.35 * smoothstep(0.62, 0.8, vn(vW.xz * 0.23 + 40.0)) * smoothstep(0.35, 0.6, vW.y) * (1.0 - steep)); // moss on the flat
        // bedding in the cut banks: the Red Beds, layer on layer
        float bed = vn(vec2(vW.y * 11.0, (vW.x + vW.z) * 0.8)) * 0.7 + 0.3 * vn(vec2(vW.y * 31.0, vW.x * 1.7));
        float ledge = smoothstep(0.0, 0.22, fract(vW.y * 4.3 + 0.35 * vn(vW.xz * 0.45)));
        alb = mix(alb, mix(mud * 0.5, mud * vec3(1.5, 1.9, 2.0), smoothstep(0.4, 0.62, bed)) * (0.35 + 0.65 * ledge) * (0.7 + 0.5 * vn(vec2((vW.x - vW.z) * 2.6, vW.y * 0.9))), steep * 0.9);   // ledges, and rills down the face
        // trackways: two lines of five-toed prints wander down the bar
        float tk = 0.0;
        for (int k = 0; k < 2; k++) {
          float fk = float(k), z0 = -7.5 - 6.5 * fk - (0.105 + 0.02 * fk) * (vW.x - 60.0) + 2.2 * sin(vW.x * 0.07 + fk * 2.0);
          float cell = floor(vW.x / 0.6), side = mod(cell, 2.0) * 2.0 - 1.0;
          vec2 dq = vec2((fract(vW.x / 0.6) - 0.5) * 0.6, vW.z - z0 - side * 0.34) / vec2(0.13, 0.11);
          tk = max(tk, 1.0 - smoothstep(0.55, 1.0, length(dq)));
        }
        tk *= dry * (1.0 - smoothstep(0.02, 0.12, fwidth(vW.x))) * step(0.2, vW.y) * (1.0 - step(0.5, vW.y));
        // puddles in the hollows of the bar: the last of the water, mirroring the sky
        float pdn = vn(vW.xz * 1.0 + 23.0) + 0.14 * vn(vW.xz * 2.6 + 4.0);
        float flatBar = smoothstep(0.2, 0.24, vW.y) * (1.0 - smoothstep(0.42, 0.5, vW.y)) * (1.0 - steep);
        float pud = smoothstep(0.75, 0.772, pdn) * flatBar, damp = smoothstep(0.705, 0.75, pdn) * flatBar;
        float pudRim = smoothstep(0.728, 0.744, pdn) * (1.0 - smoothstep(0.748, 0.762, pdn)) * flatBar * (1.0 - uWet);      // a pale ring of dried silt round each puddle: an edge, not a blur
        crack *= 1.0 - pud;
        alb = mix(alb, mud * vec3(0.24, 0.2, 0.24), max(max(crack, wet * wet * mix(0.34, 0.45, uWet)), max(damp * 0.3, tk * 0.6)));
        alb *= 1.0 - 0.3 * strand;
        alb = mix(alb, mud * vec3(1.5, 1.85, 1.95) + 0.02, max(0.3 * strandP * (1.0 - crack), 0.55 * pudRim));
        // low relief the raking light can catch: swells a few metres across, hummocks under a metre, never flat as a floor
        vec2 qa = vW.xz * 0.5 + 3.0, qb = vW.xz * 1.9 + 11.0;
        vec2 rl = vec2(vn(qa + vec2(0.3, 0.0)) - vn(qa - vec2(0.3, 0.0)), vn(qa + vec2(0.0, 0.3)) - vn(qa - vec2(0.0, 0.3)));
        vec2 rs = vec2(vn(qb + vec2(0.3, 0.0)) - vn(qb - vec2(0.3, 0.0)), vn(qb + vec2(0.0, 0.3)) - vn(qb - vec2(0.0, 0.3)));
        vec3 relief = (vec3(rl.x, 0.0, rl.y) * 0.3 + vec3(rs.x, 0.0, rs.y) * 0.2 * (1.0 - smoothstep(0.3, 1.2, fw))) * (1.0 - steep) * smoothstep(0.02, 0.2, yS);
        vec3 N = normalize(Ng - relief + vec3(grit, 0.0, grit * 0.7 - 0.1 * grit) * 0.5 * nearK + vec3(vn(vW.xz * 3.0) - 0.5, 0.0, vn(vW.xz * 3.0 + 9.0) - 0.5) * 0.25 * lod + vec3(id2 - 0.5, 0.0, fract(id2 * 7.3) - 0.5) * 0.35 * lod2 + vec3(id - 0.5, 0.0, fract(id * 5.3) - 0.5) * 0.3 * curl);
        float lit = litAt(vW.y);
        // shade: cool sky from above plus a little of the dawn band; sun: a raking warm wash that catches every curled edge
        float toDawn = dot(N.xz, uSunAz);                                        // before the sun, the dawn band itself models the relief
        vec3 col = alb * (hemiAt(N) * 0.7 + mix(uRoseC, vec3(0.5, 0.36, 0.3), 0.6) * (0.36 + 0.08 * uProg) * clamp(1.0 + 2.2 * toDawn, 0.45, 1.7));
        col += alb * mix(uSunColor, vec3(1.0, 0.74, 0.52), 0.4) * uSunI * lit * (0.17 + 3.2 * clamp(dot(N, uSunDir) + 0.02, 0.0, 0.4) + 0.5 * edgeL) * (1.0 - 0.6 * crack);     // a warm wash, not pure red on red
        float lipSheen = 0.0;
        vec3 Vg = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
        float gl = 1.0 - clamp(Vg.y, 0.0, 1.0); gl *= gl;
        // after rain the plates are dark and glazed: they hold the sky at a low angle
        col = mix(col, col * 0.72 + uSky * uHemiW * 0.16 * gl * gl, uWet * (1.0 - 0.6 * crack));
        vec2 pr = (vec2(vn(vW.xz * 2.3 + uTime * 0.25), vn(vW.xz * 2.3 + 7.0 - uTime * 0.2)) - 0.5) * 0.05;
        vec3 R = normalize(vec3(-Vg.x + pr.x, abs(Vg.y) + 0.03, -Vg.z + pr.y));
        vec3 mir = skyBase(vec3(R.x, min(R.y, 0.45), R.z)) + sunGlow(R) * 0.6;
        col = mix(col, mix(col * 0.8, mir * 0.7, 0.3 + 0.7 * gl), max(pud, uWet * crack * 0.85));      // looked down into, a puddle shows its bed, not a black hole
        // wet mud by the water is glossy: it holds the sky at a low angle, in broken patches, and a pale line of silt marks the edge
        float gloss = wet * wet * (0.08 + 0.45 * gl) * (0.55 + 0.45 * vn(vW.xz * 2.1 + 17.0)) * (1.0 - uWet) * (1.0 - 0.75 * crack) * (1.0 - 0.6 * strand);
        col = mix(col, mir * 0.7, gloss);
        float scum = (1.0 - smoothstep(0.0, 0.016, abs(yS - 0.02))) * smoothstep(0.3, 0.6, vn(vW.xz * 2.7 + 5.0)) * (1.0 - smoothstep(0.02, 0.12, fwidth(vW.x) + fwidth(vW.z)));
        col += (uSky * 0.6 + uRoseC * 0.4) * uHemiW * 0.07 * scum;
        col = mix(col, mistFade(col, vec3(vW.x, max(vW.y, 0.0), vW.z), 0.3), 0.12);
        gl_FragColor = vec4(haze(col, vW), 1.0);
      }`}),n),n,ke),c=new w.Mesh(r,h);return c.name="ground",c.frustumCulled=!1,{mesh:c,xs:f,zs:d,pos:x}}const ke=["uZen","uMidSky","uRoseC","uPeachC","uProg","uBandGain","uSunVis","uSunUp"],Ae=`
uniform vec3 uZen, uMidSky, uRoseC, uPeachC, uSunVis; uniform float uProg, uBandGain, uSunUp;
vec3 skyBase(vec3 d) {
  float e = max(d.y, 0.0);
  vec2 h = d.xz / max(length(d.xz), 1e-4);
  float ca = dot(h, uSunAz), east = smoothstep(-0.4, 1.0, ca);
  vec3 c = mix(uMidSky, uZen, smoothstep(0.02, 0.62, e));
  c = mix(c, uZen * 0.85, (1.0 - east) * 0.6);
  float bh = mix(0.13, 0.27, uProg);
  float band = exp(-e / bh * 2.3) * east * east;
  float core = exp(-e / bh * 5.5) * (0.3 + 0.7 * uProg) * smoothstep(0.2, 1.0, ca);
  vec3 warm = mix(uRoseC, uPeachC, core);
  c = mix(c, warm * uBandGain * (1.0 + 0.5 * core), band * (0.8 + 0.2 * uProg));
  float hz = exp(-e * 9.0);                                   // the whole horizon glows before sunrise: lilac-rose even in the west
  c = mix(c, mix(uRoseC, uPeachC, 0.3) * (0.62 + 0.3 * uProg), hz * (0.34 + 0.3 * east) * mix(1.0, 0.25 + 0.75 * east, uProg));
  // away from the dawn: the belt of rose above the earth's own blue shadow, which sinks as the sun comes up
  float belt = exp(-(e - 0.13) * (e - 0.13) * 160.0) * (1.0 - east) * smoothstep(0.35, 0.9, uProg);
  c = mix(c, mix(uRoseC, uMidSky, 0.35) * 0.95, belt * 0.5);
  c = mix(c, uZen * 0.9 + uMidSky * 0.12, exp(-e * 22.0) * (1.0 - east) * smoothstep(0.35, 0.9, uProg) * 0.75);
  // the place where the sun will rise: a tall soft fan of peach light standing over the levee from the first frame
  float fan = exp(-e * 5.0) * pow(max(ca, 0.0), 24.0);
  c += uPeachC * vec3(1.0, 0.78, 0.6) * fan * (0.22 + 0.5 * uProg);
  return mix(hazeCol(d), c, smoothstep(0.0, 0.05, e));
}
vec3 cloudLite(vec3 d, vec3 c) {
  vec2 h = d.xz / max(length(d.xz), 1e-4);
  float ca = dot(h, uSunAz), sa = h.x * uSunAz.y - h.y * uSunAz.x, az = atan(sa, ca + 1e-5), e = max(d.y, 0.0);
  vec2 q = vec2(az * 1.5 + 3.0, e * 11.0 - az * 0.9);
  float n = vn(q + vec2(0.0, vn(q * 0.6 + 9.0))) * 0.6 + vn(q * vec2(3.1, 2.3) + 4.0) * 0.4;
  float hi = smoothstep(0.5, 0.74, n) * smoothstep(0.1, 0.3, e) * (1.0 - smoothstep(0.62, 0.9, e)) * (1.0 - smoothstep(1.3, 2.7, abs(az)));
  return mix(c, mix(uRoseC, uPeachC, 0.3) * (0.75 + 0.5 * uProg), hi * 0.5 * (0.45 + 0.55 * smoothstep(-0.2, 0.9, ca)));
}
vec3 sunGlow(vec3 d) {
  vec3 q = d - uSunVis; q.y *= 1.4; float r = length(q);
  float disc = 1.0 - smoothstep(0.03, 0.05, r);
  return uPeachC * vec3(1.0, 0.72, 0.5) * uSunUp * (disc * 2.1 + 0.7 * exp(-r * 11.0) + 0.36 * exp(-r * 3.5));
}`;function St(e,n,m){const f=new w.SphereGeometry(1e3,48,24),d=V0(V0(new w.ShaderMaterial({uniforms:{uCirrus:{value:n===1?1:0},uEmberC:e.uEmber,uStars:{value:1},uSeed:{value:m()*20}},vertexShader:`
      varying vec3 vD;
      void main() { vD = position; vec4 p = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); gl_Position = p; }`,fragmentShader:`
      uniform float uCirrus, uStars, uSeed; uniform vec3 uEmberC; varying vec3 vD;
      ${ae}
      ${Ae}
      // altocumulus bars: noise stretched along the horizon inside a low window toward the dawn
      float cloudCov(float e, float az) {
        vec2 q = vec2(az * 2.4 + uSeed + uTime * 0.003, e * 34.0 + 0.6 * sin(az * 1.3 + uSeed));
        float n = vn(q + vec2(0.0, vn(q * 0.7 + 5.0) * 1.2)) * 0.65 + vn(q * vec2(2.7, 2.1) + 11.0) * 0.35;
        float win = smoothstep(0.04, 0.075, e) * (1.0 - smoothstep(0.2, 0.3, e)) * (1.0 - smoothstep(0.5, 1.5, abs(az)));
        return smoothstep(0.55, 0.7, n) * win;
      }
      void main() {
        vec3 d = normalize(vD);
        vec3 c = skyBase(d);
        vec2 h = d.xz / max(length(d.xz), 1e-4);
        float ca = dot(h, uSunAz), sa = h.x * uSunAz.y - h.y * uSunAz.x, az = atan(sa, ca + 1e-5), e = d.y;
        // a high veil of cirrus on some mornings: lilac streaks
        float cir = vn(vec2(az * 1.2 + e * 2.0 + uSeed, e * 16.0 - az * 2.5)) * vn(vec2(az * 3.0 - e * 4.0, e * 44.0 + az * 6.0 + uSeed + uTime * 0.002));
        c += uCirrus * smoothstep(0.1, 0.55, cir) * smoothstep(0.12, 0.35, e) * (1.0 - smoothstep(0.5, 0.95, e)) * mix(uMidSky, uRoseC, 0.5 + 0.4 * ca) * 0.2;
        // cloud bars, lit ember from beneath, brightening with u
        float cv = cloudCov(e, az), cvB = cloudCov(e - 0.011, az);
        vec3 under = mix(uEmberC, uPeachC, 0.25 + 0.5 * uProg) * (0.7 + 1.0 * uProg);
        vec3 topc = mix(uZen, uRoseC, 0.3) * 0.75;
        vec2 q2 = vec2(az * 1.5 + uSeed * 1.7 + uTime * 0.002, e * 11.0 - az * 0.9);
        float n2 = vn(q2 + vec2(0.0, vn(q2 * 0.6 + 9.0))) * 0.6 + vn(q2 * vec2(3.1, 2.3) + 4.0) * 0.4;
        float hi = smoothstep(0.54, 0.74, n2) * smoothstep(0.2, 0.36, e) * (1.0 - smoothstep(0.62, 0.9, e)) * (1.0 - smoothstep(1.3, 2.7, abs(az)));
        float hiB = smoothstep(0.54, 0.74, vn(q2 + vec2(0.0, vn(q2 * 0.6 + 9.0)) + vec2(0.0, -0.25)) * 0.6 + vn(q2 * vec2(3.1, 2.3) + 4.0) * 0.4);
        c = mix(c, mix(mix(uZen, uMidSky, 0.5) * 0.9, mix(uRoseC, uPeachC, 0.3) * (0.75 + 0.5 * uProg), clamp(0.25 + (hi - hiB * 0.7) * 1.5, 0.0, 1.0) * (0.45 + 0.55 * smoothstep(-0.2, 0.9, ca))), hi * 0.55);
        c = mix(c, mix(topc, under, smoothstep(0.0, 0.45, cv - cvB * 0.85)), cv * 0.92);
        // two last stars in the west
        vec3 s1 = normalize(vec3(-0.55, 0.62, 0.56)), s2 = normalize(vec3(-0.2, 0.45, 0.87));
        float tw = 0.75 + 0.25 * sin(uTime * 3.1);
        c += vec3(0.8, 0.9, 1.0) * uStars * tw * (smoothstep(0.99996, 0.99999, dot(d, s1)) * 2.0 + smoothstep(0.99997, 0.999995, dot(d, s2)) * 1.4);
        c += sunGlow(d) * smoothstep(-0.01, 0.01, e);
        gl_FragColor = vec4(c, 1.0);
      }`,depthWrite:!1,depthTest:!1,side:w.BackSide}),e),e,ke),v=new w.Mesh(f,d);return v.renderOrder=-1,v.frustumCulled=!1,v.name="sky",v}const ce=6,j0=8;function Ct(e,n,m){const f=n.pos.length/3,d=new Float32Array(f*3),v=new Float32Array(f);for(let c=0;c<f;c++)d[c*3]=n.pos[c*3],d[c*3+2]=n.pos[c*3+2],v[c]=-n.pos[c*3+1];const z=new w.BufferGeometry;z.setAttribute("position",new w.BufferAttribute(d,3)),z.setAttribute("aDepth",new w.BufferAttribute(v,1));{const c=n.mesh.geometry.index.array,t=[];for(let u=0;u<c.length;u+=3)(v[c[u]]>-.12||v[c[u+1]]>-.12||v[c[u+2]]>-.12)&&t.push(c[u],c[u+1],c[u+2]);z.setIndex(t)}const x=c=>Array.from({length:c},()=>new w.Vector4(0,0,0,0)),y={uRing:{value:x(ce)},uRefA:{value:x(j0)},uRefB:{value:x(j0)},uRefC:{value:x(j0)},uMud:{value:l0("#9C4A32")},uEmberC:e.uEmber,uWebShade:e.uWebShade,uRipple:{value:m===2?.35:1},uSmear:{value:m===2?1:.55},uFresMin:{value:m===2?.62:.16},uShore:{value:.09},uRefMaxY:{value:m===2?.3:1}},r=V0(V0(new w.ShaderMaterial({uniforms:y,transparent:!0,depthWrite:!1,vertexShader:`
      attribute float aDepth; varying vec3 vW; varying float vDepth;
      void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vDepth = aDepth; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
      uniform vec4 uRing[${ce}], uRefA[${j0}], uRefB[${j0}], uRefC[${j0}];
      uniform vec3 uMud, uEmberC, uWebShade; uniform float uRipple, uSmear, uFresMin, uShore, uRefMaxY;
      varying vec3 vW; varying float vDepth;
      ${ae}
      ${Ae}
      void main() {
        vec3 Vd = cameraPosition - vW; float dist = length(Vd); vec3 V = Vd / max(dist, 1e-4);
        vec2 rp = vW.xz * 1.7 + uTime * 0.3;
        vec2 dn = (vec2(vn(rp), vn(rp + 9.1)) - 0.5) * 0.075 * uRipple + (vec2(vn(rp * 0.23 + 3.0), vn(rp * 0.23 + 7.0)) - 0.5) * 0.03;
        float paw = smoothstep(0.5, 0.72, vn(vW.xz * vec2(0.045, 0.2) + vec2(uTime * 0.02, 3.0)));     // patches of faint breeze
        dn += (vec2(vn(rp * 3.1 + 2.0), vn(rp * 3.1 + 6.0)) - 0.5) * 0.14 * paw * uRipple;
        float glint = 0.0;
        vec3 Rm = normalize(vec3(-V.x + dn.x * 0.5, abs(V.y) + 0.02, -V.z + dn.y * 0.5));      // the sails' mirror trembles; it is not torn by the rings
        float dS = max(vDepth, -1.0) - shoreWig(vW.xz);
        for (int i = 0; i < ${ce}; i++) {
          vec2 dv = vW.xz - uRing[i].xy; float r = length(dv), age = uRing[i].z, front = 0.2 + age * 1.0;
          float x1 = (r - front) / 0.13, x2 = (r - front * 0.55) / 0.1;
          float w = (exp(-x1 * x1) + 0.6 * exp(-x2 * x2)) * uRing[i].w * exp(-age * 0.45);
          dn += dv / max(r, 1e-3) * w * 0.2 * sin((r - front) * 30.0);
          glint += w;
        }
        vec3 R = normalize(vec3(-V.x + dn.x, abs(V.y) + 0.02, -V.z + dn.y));
        vec3 Rs = vec3(R.x, min(R.y, uRefMaxY), R.z);  // after rain the still sheet holds the pale low sky, not the dark zenith
        vec3 sky = cloudLite(Rs, skyBase(Rs)) + sunGlow(R) * (0.45 + 0.9 * vn(rp * vec2(1.6, 6.0))), refC = vec3(0.0); float refA = 0.0;
        // the far shores stand in the water too: a dark ragged band of levee and conifers under the horizon's glow
        vec2 rh = R.xz / max(length(R.xz), 1e-4);
        float raz = atan(rh.y, rh.x + 1e-5), shoreH = 0.03 + 0.035 * vn(vec2(raz * 46.0, 3.0)) * vn(vec2(raz * 9.0, 7.0));
        sky = mix(sky, mix(vec3(0.02, 0.03, 0.035) * uHemiW, hazeCol(R), 0.3), (1.0 - smoothstep(shoreH, shoreH + 0.012, R.y)) * 0.8);
        // the sun's road on the water: a broken path of peach glitter toward the sunrise
        float ga = max(dot(rh, uSunAz), 0.0), road = pow(ga, 70.0) * (1.0 - smoothstep(0.03, 0.45, R.y));
        float spark = smoothstep(0.5, 0.85, vn(vW.xz * vec2(1.7, 6.0) + uTime * vec2(0.25, 0.8)));
        sky += uPeachC * vec3(1.0, 0.68, 0.42) * uSunUp * road * (0.3 + 2.4 * spark);
        float bk = max(dot(-V.xz / max(length(V.xz), 1e-3), uSunAz), 0.0), bl = 0.3 + 0.7 * bk * bk;
        // mirrored sail-backs: ray against each animal's upright plane, the fan profile of the rib-shadow shader
        for (int i = 0; i < ${j0}; i++) {
          vec4 A = uRefA[i], B = uRefB[i], C = uRefC[i]; float uSmearK = clamp((uSmear - 0.55) / 0.45, 0.0, 1.0);
          float cy = cos(A.z), sy = sin(A.z); vec2 ax = vec2(cy, -sy), nr = vec2(sy, cy);
          float dnr = dot(nr, Rm.xz); dnr = abs(dnr) < 1e-3 ? 1e-3 : dnr;
          float t = dot(nr, A.xy - vW.xz) / dnr;
          vec2 hit = vW.xz + Rm.xz * t;
          float sc = max(B.w, 0.1), xl = dot(ax, hit - A.xy) / sc, wy = t * Rm.y, hp = (wy - C.z) / sc;
          float s = (xl - C.x) / max(C.y - C.x, 0.1), soft = 0.035 + t * 0.012;
          float bodyH = 0.47 * smoothstep(-0.6, -0.05, s) * (1.0 - smoothstep(1.08, 1.38, s));
          float scl = clamp(s, 0.0, 1.0), w = scl < B.y ? 0.5 * scl / max(B.y, 1e-3) : 0.5 + 0.5 * (scl - B.y) / max(1.0 - B.y, 1e-3);
          float prof = B.x * (0.13 + 0.87 * pow(max(sin(3.14159 * w), 0.0), B.z));
          float inS = smoothstep(-0.03, 0.03, s) * (1.0 - smoothstep(0.97, 1.03, s));
          float sail = inS * (1.0 - smoothstep(prof - soft, prof + soft, hp - 0.44)) * smoothstep(0.38, 0.46, hp);
          float sb = min(soft, 0.1);
          float body = (1.0 - smoothstep(bodyH - sb, bodyH + sb, hp)) * smoothstep(0.1, 0.3, hp) * smoothstep(-0.65, -0.45, s) * (1.0 - smoothstep(1.2, 1.4, s));
          float du = abs(fract(s * mix(21.0, 25.0, C.w) + 0.5) - 0.5), rib = 1.0 - smoothstep(0.1, 0.32, du);
          vec3 web = mix(uWebShade * (uSky * 1.1 + uRoseC * 0.9) * (1.0 - 0.7 * rib), uEmberC * mix(0.08 + 0.3 * bk * bk, 0.4 + 0.7 * bk * bk, uSmearK) * (1.0 - mix(0.75, 0.7, uSmearK) * rib), litAt(wy) * step(0.5, uSunI * 10.0));
          vec3 c = mix(web, vec3(0.1, 0.075, 0.075) * hemiAt(vec3(0.0, 0.2, 0.0)), body);
          float cov = max(sail, body) * step(0.0, t) * A.w * (1.0 - smoothstep(4.0, 7.5, t)) * (1.0 - smoothstep(0.45, 0.75, abs(V.y)));      // only beside its owner: a detached red patch reads as a stain
          refC = mix(refC, c, cov); refA = max(refA, cov);
        }
        float uSmearK = clamp((uSmear - 0.55) / 0.45, 0.0, 1.0);
        sky = mix(sky, refC, refA * 0.7);
        float fres = uFresMin + (1.0 - uFresMin) * pow(1.0 - clamp(abs(V.y), 0.0, 1.0), 3.0);      // near water shows its dark bed, far water mirrors
        vec3 bed = (uMud * vec3(0.8, 1.5, 2.0) * (0.3 + 0.5 * exp(-vDepth * 6.0)) + uSky * 0.2) * hemiAt(vec3(0.0, 1.0, 0.0)) * 0.8 * (0.7 + 0.45 * vn(vW.xz * 1.7 + 3.0) + 0.25 * vn(vW.xz * 6.0));
        vec3 col = mix(bed, sky * 0.86, fres) * (0.9 + 0.2 * vn(rp * vec2(0.35, 1.3)));
        col = mix(col, refC * 0.85, refA * mix(0.22, 0.6, uSmearK));
        col += uSky * glint * 0.3 * uHemiW;
        col = mix(col, mistFade(col, vW, 0.0), 0.14);
        float a = smoothstep(0.0, uShore, dS) * mix(0.34 + 0.66 * smoothstep(0.04, 0.34, dS), 1.0, fres);
        a = max(a, refA * 0.85 * smoothstep(0.0, uShore, dS));       // a mirrored sail holds even in the clear shallows
        gl_FragColor = vec4(haze(col, vW), a);
      }`}),e),e,ke),h=new w.Mesh(z,r);return h.renderOrder=1,h.frustumCulled=!1,h.name="water",{mesh:h,uni:y}}function Wt(e,n,m){const f=n<.8?[.5,.78]:[.38,.62,.86],d=[],v=[],z=[];f.forEach((h,c)=>{const t=.3+m*h*1.05,u=d.length/3;d.push(-260,t,-330,640,t,-330,640,t,110,-260,t,110),v.push(c,c,c,c),z.push(u,u+2,u+1,u,u+3,u+2)});const x=new w.BufferGeometry;x.setAttribute("position",new w.Float32BufferAttribute(d,3)),x.setAttribute("aLayer",new w.Float32BufferAttribute(v,1)),x.setIndex(z);const y=V0(new w.ShaderMaterial({uniforms:{uRoseC:e.uRoseC,uPeachC:e.uPeachC,uProg:e.uProg},transparent:!0,depthWrite:!1,side:w.DoubleSide,vertexShader:`
      attribute float aLayer; varying vec3 vW; varying float vLayer;
      void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vLayer = aLayer; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
      uniform vec3 uRoseC, uPeachC; uniform float uProg; varying vec3 vW; varying float vLayer;
      ${ae}
      void main() {
        vec2 p = vW.xz * 0.16 + vec2(uTime * 0.045, uTime * 0.012) * (1.0 + vLayer * 0.35) + vLayer * 7.3;
        float n = vn(p) * 0.5 + vn(p * 2.3 + 3.0 + uTime * 0.05) * 0.28 + vn(p * 5.1 + vec2(uTime * 0.2, -uTime * 0.07)) * 0.22;
        float big = vn(vW.xz * 0.055 + vec2(uTime * 0.012, 3.0) + vLayer * 3.1);
        float a = 0.7 * smoothstep(0.45, 0.74, n * 0.62 + big * 0.62) * (1.0 - vLayer * 0.2) * (1.0 - 0.72 * smoothstep(0.56, 0.74, uProg));
        vec3 dv = vW - cameraPosition; float dist = length(dv);
        a *= smoothstep(6.0, 14.0, length(dv.xz));
        float steepV = abs(dv.y) / max(dist, 1e-3);
        a *= mix(0.72, 1.0, smoothstep(0.03, 0.2, steepV)) * mix(1.0, 0.22, smoothstep(0.12, 0.42, steepV));     // edge-on the sheets must not add up to a wall; looked down into, mist is thin
        a *= (1.0 - 0.4 * smoothstep(30.0, 100.0, dist)) * mix(1.0, 0.4, smoothstep(2.4, 5.0, cameraPosition.y));
        a = min(a + smoothstep(60.0, 220.0, dist) * 0.18 * (0.4 + 0.6 * n), 0.6);
        vec3 lit = mix(uRoseC, uPeachC, 0.55 + 0.3 * n) * (0.5 + 0.35 * n) * (0.7 + 0.6 * max(dot(dv.xz / max(length(dv.xz), 1e-3), uSunAz), 0.0));
        vec3 col = mix(uMistColor * (0.85 + 0.55 * n), lit, uMistLit * (0.8 + 0.2 * n));
        gl_FragColor = vec4(haze(col, vW), a * uMistAmt);
      }`}),e),r=new w.Mesh(x,y);return r.renderOrder=3,r.frustumCulled=!1,r.name="mist",r}function He(e,n=!1){return V0(new w.ShaderMaterial({uniforms:{uPix:e.uPix,uGreenGain:e.uGreenGain,uRoseP:e.uRoseC,uMirror:{value:n?-1:1}},vertexColors:!0,side:w.DoubleSide,transparent:n,depthWrite:!n,vertexShader:`
      attribute vec4 aAnim; attribute vec3 aI;     // aI: tint, phase, sway scale
      uniform float uTime, uPix, uMirror;
      varying vec3 vW, vN, vCol; varying vec3 vK; varying float vWy;
      void main() {
        mat4 M = modelMatrix * instanceMatrix;
        vec3 p = position;
        vec4 w = M * vec4(p, 1.0);
        float ph = aI.y * 6.283, sw = aAnim.x * aI.z;
        w.x += sw * (0.06 * sin(uTime * 0.7 + ph + w.z * 0.2) + 0.025 * sin(uTime * 1.9 + ph * 3.0));
        w.z += sw * (0.05 * sin(uTime * 0.53 + ph * 1.7 + w.x * 0.2));
        float hw = abs(aAnim.w);
        if (hw > 1e-5) {    // thin blades keep ~1.5 px of width
          float dist = distance(w.xyz, cameraPosition), k = clamp(dist * uPix * 0.8 / hw, 1.0, 8.0);
          vec3 off = (aAnim.z < 0.0 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0)) * aAnim.w * (k - 1.0);
          w.xyz += mat3(M) * off;
        }
        vWy = w.y; w.y *= uMirror; w.x += (1.0 - uMirror) * 0.012 * sin(uTime * 1.6 + vWy * 7.0 + w.z);
        vW = w.xyz; vN = mat3(M) * normal; vCol = color * (1.0 + aI.x);
        vK = vec3(aAnim.y, abs(aAnim.z), M[3].y);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:`
      uniform float uGreenGain, uMirror; uniform vec3 uRoseP; varying vec3 vW, vN, vCol; varying vec3 vK; varying float vWy;
      ${ae}
      void main() {
        vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0)); if (!gl_FrontFacing) N = -N;
        vec3 Vd = cameraPosition - vW; float dist = length(Vd); vec3 V = Vd / max(dist, 1e-4);
        vec3 alb = vCol * vec3(1.0, uGreenGain, 1.0);
        // joints: a dark ring and a pale sheath at every node of a horsetail
        float j = vK.y > 1e-4 ? fract(vK.x / max(vK.y, 1e-3)) : 0.5;
        float fj = fwidth(vK.x / max(vK.y, 1e-3));
        float ring = (1.0 - smoothstep(0.04, 0.1 + fj, min(j, 1.0 - j))) * step(1e-4, vK.y) * (1.0 - smoothstep(0.3, 0.8, fj));
        alb = mix(alb, alb * vec3(0.35, 0.3, 0.3), ring);
        alb *= 0.85 + 0.3 * vn(vW.xz * 7.0 + vW.y * 5.0);
        float lit = litAt(vWy), ndl = dot(N, uSunDir);
        float back = max(dot(-V, uSunDir), 0.0), fr = 1.0 - abs(dot(N, V));
        vec3 sunC = mix(uSunColor, vec3(1.0, 0.8, 0.56), 0.6);
        vec3 col = alb * (hemiAt(N) * 0.9 + sunC * uSunI * lit * (0.12 + 0.5 * clamp(ndl * 0.7 + 0.3, 0.0, 1.0)));
        // translucent green and a warm edge where the sun is behind
        col += sunC * uSunI * lit * (alb * vec3(1.1, 1.3, 0.75) * 0.55 * back * back + vec3(1.0, 0.55, 0.35) * 0.04 * fr * fr * (0.3 + back));
        col += alb * (uRoseP * 0.5 + uSky * 0.5) * 0.5 * back * back * uHemiW * 0.5;             // before the sun: the dawn band shows through thin green
        col = mix(col, mistFade(col, vec3(vW.x, vWy, vW.z), vK.z), 0.45);
        float under = 0.5 - 0.5 * uMirror;
        if (under > 0.5 && vWy < 0.0) discard;                 // only what stands above the water is mirrored
        gl_FragColor = vec4(haze(col, vW) * (1.0 - 0.7 * under), 1.0 - under * (0.1 + 0.7 * smoothstep(0.3, 2.2, vWy)));
      }`}),e)}function pe(e,n,m,f,d,v,z,x,y,r,h,c,t=0){const u=Math.cos(m),g=Math.sin(m),i=[],b=[];for(let S=0;S<=r;S++){const G=S/r,M=f*G,F=v*f*G-z*f*G*G,s=d*Math.sin(Math.PI*Math.min(.08+G*.92,1))*(S%2?1:.55)+.01,C=t0(x,y,G),H=[h*G*G,c+Math.max(F,0),0,0],$=n[0]+u*M,Y=n[2]+g*M,D=n[1]+F+(S%2?-.06*d:0);i.push(e.v($-g*s,D,Y+u*s,C,H)),b.push(e.v($+g*s,D,Y-u*s,C,H)),S&&e.quad(i[S-1],b[S-1],b[S],i[S])}if(t>0)for(const S of[-1,1]){const G=n[1]+v*f-z*f;pe(e,[n[0]+u*f*.72,n[1]+(v*.72-z*.52)*f,n[2]+g*f*.72],m+S*.5,f*.5,d*.75,v*.4,z*.9,x,y,4,h,c+Math.max(G-n[1],0)*.7,0)}}function Se(e,n=!1){const m=q0(),f=e0("#3A2A24"),d=e0("#2F4A3A",.6),v=e0("#3F5E44",.8),z=8;m.tube([0,.3,.62,1].map(r=>({p:[.12*Math.sin(r*3),r*z,.08*Math.sin(r*4+1)],r:j(.2,.03,r),c:t0(f,d,r*.7),a:[r*r*.5,r*z,0,0]})),5);const x=n===2,y=x?6:n?8:11;for(let r=0;r<y;r++){const h=r/(y-1),c=j(1.6,z-.25,Math.pow(h,.9)),t=j(2.5,.35,Math.pow(h,.8)),u=x?4:n?5:r<7?7:5;for(let g=0;g<u;g++){const i=g/u*M0+r*.9+e()*.3,b=t*(.85+.3*e());pe(m,[0,c,0],i,b,(.3+.16*(1-h))*(x?2.1:n?1.5:1),.02,-.14,d,v,n?2:4,.4+h*.6,c),r<9&&!n&&pe(m,[0,c+.12,0],i+.45,b*.6,.24,.22,.1,d,t0(d,v,.5),3,.4+h*.6,c)}}return m.build()}function Ke(e,n=!1){const m=q0(),f=e0("#4E5C48"),d=e0("#727E60"),v=5,z=.25;if(n){const y=[],r=e0("#A9B67C"),h=e0("#39463A");for(let c=0;c<=8;c++){const t=c/8;y.push({p:[z*t*t,t*v,0],r:j(.1,.022,Math.pow(t,.85)),c:t0(t0(f,h,.35),d,t),a:[t*t,t*v,.5,0]})}m.tube(y,6);for(let c=1;c<=9;c++){const t=c*.5,u=t/v,g=z*u*u,i=9,b=(.42+.75*Math.sin(Math.PI*Math.pow(u,.75)))*(.85+.3*e()),S=j(.1,.022,Math.pow(u,.85));for(let G=0;G<i;G++){const M=G/i*M0+c*.5+e()*.3,F=Math.cos(M),s=Math.sin(M),C=.04,H=.42+.2*e(),$=b*(.8+.4*e()),Y=[u*u,t,0,0],D=[u*u+.12,t+$*.4,0,0],a0=[u*u+.3,t+$*.5,0,0],w0=t0(f,d,.5),x0=t0(d,r,.35),b0=t0(d,r,.8),Z0=g+F*S*.8,$0=s*S*.8,c0=g+F*$*.6,u0=s*$*.6,_=t+$*H,h0=g+F*$,H0=s*$,Q0=t+$*(H+.02),B0=m.v(Z0-s*C,t,$0+F*C,w0,Y),k0=m.v(Z0+s*C,t,$0-F*C,w0,Y),W=m.v(c0-s*C*.75,_,u0+F*C*.75,x0,D),T0=m.v(c0+s*C*.75,_,u0-F*C*.75,x0,D);m.quad(B0,k0,T0,W),m.tri(W,T0,m.v(h0,Q0,H0,b0,a0))}}return m.build()}const x=[];for(let y=0;y<=5;y++){const r=y/5;x.push({p:[z*r*r,r*v,0],r:j(.085,.025,r),c:t0(f,d,r),a:[r*r,r*v,.52,0]})}m.tube(x,4);for(let y=1;y<=9;y++){const r=y*.52,h=r/v,c=z*h*h,t=5,u=j(.75,.3,h),g=t0(f,d,.6);for(let i=0;i<t;i++){const b=i/t*M0+y*.5,S=Math.cos(b),G=Math.sin(b),M=[h*h,r,0,0],F=[h*h+.15,r+u*.5,0,0],s=m.v(c+S*.03-G*.025,r,G*.03+S*.025,g,M),C=m.v(c+S*.03+G*.025,r,G*.03-S*.025,g,M);m.tri(s,C,m.v(c+S*u*.8,r+u*.62,G*u*.8,d,F))}}return m.build()}function Pt(e){const n=q0(),m=e0("#46523A"),f=e0("#8C9668");for(let d=0;d<4;d++){const v=e()*M0,z=Math.sqrt(e())*.36,x=Math.cos(v)*z,y=Math.sin(v)*z,r=.4+.5*e(),h=(e()-.5)*.14,c=(e()-.5)*.14,t=.013+.006*e();for(const u of[0,1]){const g=u?-.09:.09,i=u?0:1,b=u?1:0,S=n.v(x-i*t,-.25,y-b*t,m,[0,0,g,-t]),G=n.v(x+i*t,-.25,y+b*t,m,[0,0,g,t]),M=n.v(x+h+i*t*.35,r,y+c+b*t*.35,f,[1,r,g,t*.35]),F=n.v(x+h-i*t*.35,r,y+c-b*t*.35,f,[1,r,g,-t*.35]);n.quad(S,G,M,F)}}return n.build()}function Ft(e){const n=q0(),m=e0("#3E5A38"),f=e0("#7A8A4A");for(let d=0;d<8;d++)pe(n,[0,.05,0],d/8*M0+e()*.5,.9+.5*e(),.22,1.1+.4*e(),.9,m,f,5,.5,.2,1);return n.build()}function _e(e,n,m,f,d,v,z,x,y,r,h,c){const t=Math.cos(m),u=Math.sin(m),g=[];for(let i=0;i<=r;i++){const b=i/r,S=f*b;g.push([n[0]+t*S,n[1]+v*f*b-z*f*b*b,n[2]+u*S,b])}for(let i=1;i<=r;i++){const b=g[i-1],S=g[i],G=S[3],M=t0(x,y,G),F=[h*b[3]*b[3],c+Math.max(b[1]-n[1],0),0,0],s=[h*G*G,c+Math.max(S[1]-n[1],0),0,0],C=.028*(1.2-G);e.quad(e.v(b[0]-u*C,b[1],b[2]+t*C,x,F),e.v(b[0]+u*C,b[1],b[2]-t*C,x,F),e.v(S[0]+u*C,S[1],S[2]-t*C,M,s),e.v(S[0]-u*C,S[1],S[2]+t*C,M,s));const H=d*Math.min(G/.16,1)*(1.08-G)+.05,$=f/r*.3;for(const Y of[-1,1]){const D=S[0]+Y*-u*H+t*H*.35,a0=S[2]+Y*t*H+u*H*.35;e.tri(e.v(S[0]-t*$,S[1]+.01,S[2]-u*$,M,s),e.v(S[0]+t*$,S[1]+.01,S[2]+u*$,M,s),e.v(D,S[1]-.22*H,a0,t0(M,y,.6),[s[0]+.1,s[1],0,0]))}}}function Rt(e){const n=q0(),m=e0("#3A3024"),f=e0("#35603A"),d=e0("#8FA85E"),v=e0("#5A4A30"),z=2.3;n.tube([0,.1,.3,.65,1].map(x=>({p:[.1*x*x,x*z,0],r:j(.26,.1,Math.pow(x,.35))*(1+.08*Math.sin(x*31)),c:t0(m,e0("#56503A"),.5+.5*Math.sin(x*29)),a:[x*x*.2,x*z,.07,0]})),6);for(let x=0;x<11;x++){const y=x*2.399+e()*.3,r=1.9+.5*e();_e(n,[.1,z-.03,0],y,r,.55,.7+.25*e(),.95+.3*e(),f,d,9,.8,z)}for(let x=0;x<4;x++)_e(n,[.1,z,0],x*1.571+e()*.4,1.3+.3*e(),.42,1.25,.8,f,d,6,.8,z);for(let x=0;x<3;x++){const y=x*2.1+e(),r=Math.cos(y),h=Math.sin(y),c=[];for(let t=0;t<=6;t++){const u=t/6,g=u*u*4.4,i=.3*(1-.75*u),b=.08+.2*Math.min(u*2,1)+(u>.5?Math.sin(g)*i*.5:0);c.push({p:[.1+r*b,z+.5*Math.min(u*2,1)+(u>.5?(1-Math.cos(g))*i*.4:0),h*b],r:.03*(1-.6*u),c:t0(v,d,.6),a:[.3,z,0,0]})}n.tube(c,3)}return n.build()}function I0(e,n,m,f){const d=Math.max(m.length,1),v=new w.InstancedMesh(e,n,d),z=new Float32Array(d*3),x=new w.Matrix4,y=new w.Quaternion,r=new w.Euler,h=new w.Vector3,c=new w.Vector3;return m.forEach((t,u)=>{r.set(t.lean||0,t.yaw||0,0),y.setFromEuler(r),h.set(t.s||1,(t.s||1)*(t.sy||1),t.s||1),c.set(t.x,t.y,t.z),x.compose(c,y,h),v.setMatrixAt(u,x),z.set([t.tint||0,t.ph??u*.618%1,t.sway??1],u*3)}),v.count=m.length,e.setAttribute("aI",new w.InstancedBufferAttribute(z,3)),v.instanceMatrix.needsUpdate=!0,v.frustumCulled=!1,v.name=f,v}function Vt(e){return V0(new w.ShaderMaterial({uniforms:{uEmberC:e.uEmber},vertexColors:!0,side:w.DoubleSide,transparent:!0,vertexShader:`
      attribute vec4 aAnim; attribute vec4 aI;     // aI: phase, ground height for the mist law, wave amount, flap amount
      uniform float uTime;
      varying vec3 vW, vN, vCol, vObj; varying vec3 vK;
      void main() {
        vec3 p = position; float ph = aI.x * 6.283;
        p.z += aAnim.x * aI.z * sin(uTime * 1.6 + ph - p.x * 5.0);
        p += normal * aAnim.z * 0.012 * sin(uTime * 1.3 + ph);
        p.y += aAnim.y * aI.w * abs(p.z) * 0.2 * sin(uTime * 58.0 + ph + aAnim.y * 0.8);
        mat4 M = modelMatrix * instanceMatrix;
        vec4 w = M * vec4(p, 1.0);
        vW = w.xyz; vN = mat3(M) * normal; vCol = color; vObj = position; vK = vec3(aAnim.w, aI.y, aI.x);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:`
      uniform vec3 uEmberC; varying vec3 vW, vN, vCol, vObj; varying vec3 vK;
      ${ae}
      void main() {
        if (vW.y < 0.0) discard;
        vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0)); if (!gl_FrontFacing) N = -N;
        vec3 Vd = cameraPosition - vW; float dist = length(Vd); vec3 V = Vd / max(dist, 1e-4);
        float lit = litAt(vW.y), back = max(dot(-V, uSunDir), 0.0), fr = 1.0 - abs(dot(N, V));
        vec3 col; float alpha = 1.0;
        // wing coordinates and their derivatives, taken outside every branch
        float wT = clamp(vCol.r, 0.0, 1.0), wC = clamp(vCol.g, 0.0, 1.0), wfT = fwidth(vCol.r), wfC = fwidth(vCol.g);
        float wCl = pow(wC + 1e-4, 0.8) * 5.0, wRow = floor(wCl), wDl = abs(fract(wCl + 0.5) - 0.5);
        float wDc = abs(fract(wT * 34.0 + wRow * 0.37 + 0.6 * sin(wRow * 2.1)) - 0.5);
        if (vK.x > 0.5) {
          // wing membrane: clear smoky glass carried on a net of dark veins (a stout leading edge, six long veins fanning to the hind margin,
          // a ladder of fine cross-veins between them, a node half-way and a dark stigma near the tip); gold, never white, with the sun behind
          float longV = 1.0 - smoothstep(0.05, 0.07 + wfC * 7.0, wDl);
          float crossV = (1.0 - smoothstep(0.07, 0.1 + wfT * 50.0, wDc)) * (1.0 - smoothstep(0.2, 0.6, wfT * 34.0));
          float costa = 1.0 - smoothstep(0.05, 0.08 + wfC * 1.5, wC);
          float stig = smoothstep(0.83, 0.85, wT) * (1.0 - smoothstep(0.92, 0.94, wT)) * (1.0 - smoothstep(0.17, 0.21, wC));
          float nodus = (1.0 - smoothstep(0.0, 0.012 + wfT, abs(wT - 0.46))) * (1.0 - smoothstep(0.1, 0.3, wC));
          float vein = clamp(max(max(longV, crossV * 0.75), max(max(costa, stig), nodus)), 0.0, 1.0);
          float smoke = 0.35 * smoothstep(0.7, 1.0, wT) + 0.5 * (1.0 - smoothstep(0.0, 0.1, wT));           // amber at the root, smoky toward the tip
          vec3 glass = mix(vec3(0.5, 0.56, 0.62), vec3(0.42, 0.3, 0.16), smoke) * hemiAt(N) * 0.55 + uSky * uHemiW * fr * fr * 0.35;
          vec3 gold = mix(uEmberC, vec3(1.0, 0.66, 0.3), 0.7) * min(uSunI, 2.0) * (0.14 + 0.3 * back * back) * (1.0 - 0.35 * smoke);
          col = mix(glass, glass * 0.5 + gold, lit);
          col = mix(col, vec3(0.05, 0.035, 0.02) * (hemiAt(N) * 0.8 + uSunColor * uSunI * lit * 0.5), vein);
          alpha = mix(0.34 + 0.3 * fr * fr + 0.2 * smoke + 0.12 * lit, 0.96, vein);
        } else {
          float fade = 1.0 - smoothstep(6.0, 22.0, dist);
          float wart = vn(vObj.xz * 60.0 + vK.z * 9.0), blot = vn(vObj.xz * 9.0 + vObj.y * 5.0 + vK.z * 31.0);
          vec3 alb = vCol * (1.0 + fade * (wart - 0.5) * 0.7 + (blot - 0.5) * 0.55);
          float wrap = clamp(dot(N, uSunDir) * 0.7 + 0.3, 0.0, 1.0);
          float fr2 = fr * fr;
          col = alb * (hemiAt(N) * 1.5 + uSunColor * uSunI * wrap * lit * 0.6);
          col += uSky * uHemiW * fr2 * fr * (0.3 + 0.7 * max(N.y, 0.0)) * 0.22;                 // moist skin: sky sheen
          col += uSunColor * uSunI * lit * fr2 * fr2 * (0.1 + 0.8 * back * back) * 0.5;
          col = mix(col, col * vec3(0.5, 0.55, 0.62), (1.0 - smoothstep(-0.02, 0.05, vW.y)));    // darker where awash
        }
        col = mistFade(col, vW, vK.y);
        gl_FragColor = vec4(haze(col, vW), alpha);
      }`}),e)}function ye(e,n,m,f,d,v){const z=[.012,.012,.014],x=[2.2,2.4,2.6],y=6,r=e.v(n,m+d*.9,f,z),h=[];for(let t=0;t<y;t++){const u=t/y*M0;h.push(e.v(n+Math.cos(u)*d,m,f+Math.sin(u)*d,t%2?v:z))}for(let t=0;t<y;t++)e.tri(h[t],r,h[(t+1)%y]);const c=d*.3;e.tri(e.v(n+c,m+d*.95,f,x),e.v(n+c*2.2,m+d*.8,f+c,x),e.v(n+c*2.2,m+d*.8,f-c,x))}function It(){const e=q0(),n=e0("#4A5240"),m=e0("#2C3326"),f=e0("#8A8A6A"),d=e0("#B9B08A"),v=11,z=[];for(let y=0;y<v;y++){const r=y/(v-1)*2-1,h=Math.abs(r),c=r*.185,t=.5-.13*Math.pow(h,1.6),u=.33-.2*Math.pow(h,1.25),g=.045*(1-.72*h)+.006,i=(t+u)/2,b=t0(t0(n,m,.4+.4*Math.sin(y*2.4)),d,A(.86,1,h));z.push([e.v(t,.012,c,b),e.v(i,.012+g,c,b),e.v(u,.012,c,b),e.v(i,.012-g*.6,c,t0(f,d,A(.86,1,h)))])}for(let y=0;y<v-1;y++)for(let r=0;r<4;r++)e.quad(z[y][r],z[y][(r+1)%4],z[y+1][(r+1)%4],z[y+1][r]);ye(e,.4,.05,.045,.016,n),ye(e,.4,.05,-.045,.016,n);const x=[[.3,.075,.04],[.16,.09,.05],[0,.085,.05],[-.14,.06,.05],[-.26,.03,.06],[-.4,.016,.055],[-.5,.006,.03]];e.tube(x.map((y,r)=>({p:[y[0],0,0],r:y[1],ry:y[2],c:t0(n,m,.5+.5*Math.sin(r*2.1)),cb:f,a:[Math.pow(Math.max(.16-y[0],0)/.66,1.5),0,y[0]>-.15?1:0,0]})),8);for(const y of[.2,-.12])for(const r of[-1,1])e.tube([{p:[y,-.01,r*.07],r:.016,c:n},{p:[y+.03,-.03,r*.14],r:.012,c:n},{p:[y+.06,-.05,r*.16],r:.014,ry:.006,c:m}],4);return e.build()}function Bt(){const e=q0(),n=e0("#5E543E"),m=e0("#3A3226"),f=e0("#BDAE86"),d=[[1,.085,.03],[.95,.17,.05],[.84,.24,.068],[.68,.29,.085],[.55,.305,.1],[.45,.275,.13],[.22,.35,.2],[-.08,.37,.21],[-.33,.31,.19],[-.5,.2,.15],[-.68,.12,.11],[-.84,.06,.07],[-.95,.015,.03]],v=r=>.07*A(.4,.75,r),z=r=>.02+r[2]*.55+v(r[0]);e.tube(d.map((r,h)=>({p:[r[0],z(r),0],r:r[1],ry:r[2],c:t0(n,m,.5+.5*Math.sin(h*1.9+1)),cb:r[0]>.35?f:t0(f,n,.35),a:[Math.pow(Math.max(-.3-r[0],0)/.7,1.5),0,r[0]<.4&&r[0]>-.4?1:0,0]})),12,{flatBelly:.55});const x=r=>{for(let h=0;h<d.length-1;h++)if(r<=d[h][0]&&r>=d[h+1][0]){const c=(d[h][0]-r)/(d[h][0]-d[h+1][0]);return[j(d[h][1],d[h+1][1],c),j(z(d[h]),z(d[h+1]),c),j(d[h][2],d[h+1][2],c)]}return[.1,.1,.05]},y=x(.62);ye(e,.62,y[1]+y[2]*.82,.13,.04,n),ye(e,.62,y[1]+y[2]*.82,-.13,.04,n);for(const r of[-1,1]){const h=[.99,.9,.78,.64,.5];let c=null;for(const u of h){const g=x(u),i=e.v(u,g[1]-.012,r*(g[0]+.004),m),b=e.v(u,g[1]+.012,r*(g[0]+.004),m);c&&e.quad(c[0],i,b,c[1]),c=[i,b]}const t=x(.93);e.tri(e.v(.93,t[1]+t[2]+.004,r*.05,m),e.v(.955,t[1]+t[2],r*.07,m),e.v(.905,t[1]+t[2]+.004,r*.072,m))}for(const[r,h]of[[.3,.2],[-.36,-.08]])for(const c of[-1,1]){e.tube([{p:[r,.16,c*.24],r:.105,c:n},{p:[r-.04,.17,c*.5],r:.085,c:n},{p:[r+h*.6,.09,c*.62],r:.06,c:m},{p:[r+h,.02,c*.66],r:.07,ry:.025,c:m}],6,{side:!0});const t=r+h+.02,u=c*.67,g=e.v(t,.035,u,m);for(let i=0;i<5;i++){const b=(i-2)*.4+c*.6,S=.16;e.tri(g,e.v(t+Math.cos(b-.13)*S,.008,u+Math.sin(b-.13)*S,f),e.v(t+Math.cos(b+.13)*S,.008,u+Math.sin(b+.13)*S,f))}}return e.build()}function Tt(){const e=q0(),n=e0("#4A3C24"),m=e0("#17120C"),f=e0("#A08C52"),d=e0("#2E4438"),v=[.5,.62,.6],z=[[.118,.012,.012],[.105,.03,.028],[.085,.024,.026],[.07,.036,.04],[.035,.042,.05],[-.005,.038,.044],[-.035,.022,.026]];e.tube(z.map((h,c)=>({p:[h[0],c>2&&c<6?.008:0,0],r:h[1],ry:h[2],c:c===4?t0(n,f,.35):c%2?n:m,cb:t0(n,f,.5)})),8);const x=[];for(let h=0;h<=20;h++){const c=h/20,t=h%2?1.18:.9;x.push({p:[-.035-c*.42,.004-.012*c*c,0],r:j(.017,.0085,Math.pow(c,.7))*t*(c>.9?1.25:1),c:h%2?t0(n,f,.55):m,cb:t0(n,f,.3)})}e.tube(x,6);for(const h of[-1,1]){e.tube([{p:[-.45,-.008,h*.005],r:.004,c:m},{p:[-.48,-.006,h*.012],r:.005,c:m},{p:[-.505,-.004,h*.008],r:.002,c:m}],4),e.tube([{p:[.112,.016,h*.004],r:.014,c:d},{p:[.114,.014,h*.022],r:.026,c:d},{p:[.106,.008,h*.04],r:.019,c:t0(d,v,.45)},{p:[.1,.004,h*.049],r:.006,c:v}],7,{side:!0});for(let c=0;c<3;c++){const t=.07-c*.028,u=.05-c*.035,g=.05+c*.012;e.tube([{p:[t,-.03,h*.02],r:.0055,c:n},{p:[t+u*.3,-.07,h*g],r:.0045,c:n},{p:[t+u+.03,-.085,h*(g+.012)],r:.0035,c:m},{p:[t+u+.05,-.1,h*g],r:.0025,c:m}],4,{side:!0})}}const y=12,r=3;for(const[h,c,t,u,g,i]of[[0,.058,.345,.07,.34,1],[1,-.004,.325,.084,.62,-1]])for(const b of[-1,1]){const S=[];for(let G=0;G<=y;G++){const M=G/y,F=A(.8,1,M),s=u*j(g,1,A(0,.32,M))*(1-.82*F*F),C=c+.01*Math.sin(Math.PI*M)-.5*u*F*F-(h?.03:.012)*M,H=[];for(let $=0;$<=r;$++){const Y=$/r;H.push(e.v(C-Y*s,.034+.012*M*(1-M)*4*(h?.6:1),b*(.026+M*t),[M,Y,h],[0,i,0,1]))}S.push(H)}for(let G=0;G<y;G++)for(let M=0;M<r;M++)e.quad(S[G][M],S[G][M+1],S[G+1][M+1],S[G+1][M])}return e.build()}function Ce(e,n,m,f){const d=new w.InstancedMesh(e,n,m),v=new Float32Array(m*4);return e.setAttribute("aI",new w.InstancedBufferAttribute(v,4)),d.frustumCulled=!1,d.name=f,d.userData.aI=v,d.renderOrder=4,d}function Oe(e,n,m,f=1){const d=n.length,v=new Float32Array(d*3),z=new Float32Array(d*4);n.forEach((h,c)=>{v.set([h.x,h.y,h.z],c*3),z.set([h.ph,h.rise,h.orbit,h.size],c*4)});const x=new w.BufferGeometry;x.setAttribute("position",new w.BufferAttribute(v,3)),x.setAttribute("aP",new w.BufferAttribute(z,4));const y=V0(new w.ShaderMaterial({uniforms:{uPixH:e.uPixH,uTop:{value:m},uGain:{value:f}},transparent:!0,depthWrite:!1,vertexShader:`
      attribute vec4 aP; uniform float uTime, uPixH, uTop, uSunLineY; varying float vLit, vFade;
      void main() {
        vec3 p = position; float ph = aP.x * 6.283;
        float yr = mod(position.y + uTime * aP.y, max(uTop, 0.5));
        p.y = aP.y > 0.0 ? yr : position.y;
        vFade = aP.y > 0.0 ? smoothstep(0.0, 0.5, yr) * (1.0 - smoothstep(uTop * 0.7, uTop, yr)) : 1.0;
        p.x += aP.z * sin(uTime * (0.8 + aP.x) + ph); p.z += aP.z * cos(uTime * (0.7 + aP.x * 0.6) + ph * 1.3); p.y += aP.z * 0.4 * sin(uTime * 1.3 + ph * 2.0);
        vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
        float d = max(-mv.z, 0.1);
        gl_PointSize = clamp(aP.w * uPixH / d, 1.5, 5.0);
        vLit = smoothstep(-0.06, 0.06, p.y - uSunLineY); vFade *= 1.0 - smoothstep(60.0, 140.0, d);
      }`,fragmentShader:`
      uniform vec3 uSunColor; uniform float uSunI, uGain; varying float vLit, vFade;
      void main() {
        vec2 q = gl_PointCoord - 0.5; float r = length(q) * 2.0, a = 1.0 - smoothstep(0.45, 1.0, r);
        vec3 gold = mix(uSunColor, vec3(1.0, 0.55, 0.15), 0.7) * (0.3 + 0.28 * uSunI) * uGain;
        gl_FragColor = vec4(mix(vec3(0.05, 0.06, 0.08), gold, vLit), a * vFade * mix(0.08, 0.85, vLit));
      }`}),e,["uTime","uSunLineY","uSunColor","uSunI"]),r=new w.Points(x,y);return r.frustumCulled=!1,r.renderOrder=5,r}function Et(e){const n=new w.PlaneGeometry(1,1);n.rotateX(-Math.PI/2);const m=new w.ShaderMaterial({vertexShader:`
      varying vec2 vQ;
      void main() { vQ = uv * 2.0 - 1.0; gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0); }`,fragmentShader:`
      varying vec2 vQ;
      void main() {
        float r = length(vQ * vec2(1.0, 1.25)), a = (1.0 - smoothstep(0.2, 1.0, r)) * 0.5;
        gl_FragColor = vec4(mix(vec3(1.0), vec3(0.42, 0.4, 0.55), a), 1.0);
      }`,transparent:!0,depthWrite:!1,blending:w.CustomBlending,blendEquation:w.AddEquation,blendSrc:w.ZeroFactor,blendDst:w.SrcColorFactor,blendSrcAlpha:w.ZeroFactor,blendDstAlpha:w.OneFactor}),f=new w.InstancedMesh(n,m,Math.max(e.length,1)),d=new w.Matrix4,v=new w.Quaternion,z=new w.Euler,x=new w.Vector3,y=new w.Vector3;return e.forEach((r,h)=>{const c=Math.cos(r.yaw),t=-Math.sin(r.yaw),u=r.scale*(r.kind==="dim"?1.05:1);z.set(0,r.yaw,0),v.setFromEuler(z),y.set(r.x+c*.2*u,r.y+.045,r.z+t*.2*u),x.set(3*u,1,1.35*u),d.compose(y,v,x),f.setMatrixAt(h,d)}),f.count=e.length,f.instanceMatrix.needsUpdate=!0,f.frustumCulled=!1,f.renderOrder=0,f.name="contact-shade",f}const Lt=[{name:"clear",pal:xt,mistTop:.36,green:1,band:1.25,fog:"#7F93A8"},{name:"cirrus",pal:["#8C8CB2","#34304F","#9C4A32","#C9608A","#F2466E","#F4C2B4","#2F4A3A"],mistTop:.5,green:.95,band:1.2,fog:"#8C8CB2"},{name:"rain",pal:["#7C97AC","#2A3A56","#8E4430","#C9714A","#F2552C","#F4C9A0","#2F5238"],mistTop:.34,green:1.18,band:1.3,fog:"#7C97AC"}],Ye={eda:[1,.5,.5,-.4,1.02],dim:[1.26,.6,.62,-.3,.94]};var jt={id:"red-sails-dawn",name:"Red Sails at Sunrise",category:"prehistoric",weirdness:.3,media:["open","water"],async build(e){const n=e.rng,m=e.vary||{},f=e.quality?.detail??1,d=m.density??1,v=n.int(0,2),z=Lt[v],x=n.int(0,2),y=!!m.rare,r=m.hour||"any",h=r==="night"?-1:r==="day"||r==="golden"?1:0,c=v===2?-.1:0,t=[[0,1.5],[.08,1.45],[.16,1.38],[.25,1.2],[.34,.95],[.4,.55],[.43,.2],[.47,-.15],[.54,-.5],[1,-.5]],u=a=>{a=S0(a,0,1);for(let o=0;o<t.length-1;o++)if(a<=t[o+1][0])return j(t[o][1],t[o+1][1],(a-t[o][0])/(t[o+1][0]-t[o][0]));return-.5},g=new w.Scene,i=kt(e,v),b=i.L,S=i.path,G=(30+n.range(-3,3))*Math.PI/180,M=new w.Vector2(Math.cos(G),-Math.sin(G));await e.yield();const F=[],s=new w.Vector3,C=-(Math.PI/2-G),H=(a,o,l,p={})=>{i.at(o,l,s);const V={kind:a,shadowLift:v===2?.2:.07,x:s.x,z:s.z,y:Math.max(i.heightAt(s.x,s.z),.03),yaw:C+(p.dyaw||0),scale:p.scale||1,tilt:p.tilt||0,s:o,lat:l};return p.mist===!1&&(V.mist=!1),F.push(V),V},$=(a,o,l)=>{i.at(a,o,s);for(const p of F)if(Math.hypot(p.x-s.x,p.z-s.z)<l)return!1;return!0},Y=n.chance(.6)?6:4,D=(a,o,l={})=>{const p=n.range(-.1,.1),V=Math.cos(C+p),B=-Math.sin(C+p),E=i.at(a,o,new w.Vector3),K=l.gap??1.5,Q=l.stag??.85,r0=i.info(E.x-K*M.x+Q*V,E.z-K*M.y+Q*B),f0=r0.s,v0=r0.lat,R0=i.info(E.x+K*M.x-Q*V,E.z+K*M.y-Q*B),R=R0.s,o0=R0.lat;H("dim",f0,v0,{dyaw:p,tilt:-.1,...l}),H("dim",R,o0,{dyaw:p+Math.PI,tilt:-.1,scale:.96,...l})};D(13.8,5.3),D(247.5,6.2,{gap:2.1,stag:2}),D(174.7,5.1);for(const[a,o,l,p,V]of[[38.4,3.7,1.1,1,0],[42,-3.9,1.06,1,1],[48.2,4.4,1.08,1,0],[53.4,-4.3,1,1,1],[41,8.4,1,0,0]])H("eda",a,o,{dyaw:n.range(-.15,.15)+(V?Math.PI:0),scale:l}).hero=!!p;H("edaFar",47,-2.9,{dyaw:.35,scale:.5}),H("eda",138.6,3,{dyaw:.12,scale:1.1}).hero=!0;for(const[a,o,l]of[[70.5,4.5,1.06],[76,6.6,1],[81.5,4.7,1.08],[104.6,6.9,1.07],[111.2,5.6,1]])H("eda",a,o,{dyaw:n.range(-.15,.15),scale:l}).hero=o<6.5;for(const[a,o,l,p]of[[284,4.7,1.08,1],[290.5,7,1,0],[296.5,5,1.04,1],[293.2,4.2,.5,0],[355,6.6,1.05,1],[361.5,8.4,1,0],[383,6.5,1.04,1],[384.5,-6.5,1,1]])H(l<.8?"edaFar":"eda",a,o,{dyaw:(o<0?.5:a>350?-.6:-.38)+n.range(-.1,.1),scale:l}).hero=!!p;for(const[a,o,l]of[[320.5,4.4,1.1],[326.5,7.2,1],[332.5,5.2,1.04],[324.6,4.3,.5],[329.6,4.3,.46]])H(l<.8?"edaFar":"eda",a,o,{dyaw:-.3+n.range(-.15,.15),scale:l}).hero=l>1.01;const a0=[95,101.5,36.6,44.2,316,21.5],w0=(a,o)=>o===5?-5.2:o===4?-7.4:o===3?1.3:o===2?-1:i.barEdge(a)+1.75;a0.forEach((a,o)=>{i.at(a,w0(a,o),s),F.push({kind:"ery",x:s.x,z:s.z})});{const a=S.posAtDist(.52*b,new w.Vector3);for(const[o,l,p]of[[4.2,.2,1.1],[7.4,-3.7,1.06],[8.6,4,1.03]]){const V=i.info(a.x+M.x*o+M.y*l,a.z+M.y*o-M.x*l);H("eda",V.s,V.lat,{scale:p}).hero=!0}}for(let a=119.5+n.range(-.3,.3),o=0;a<220;a+=5.7+n.range(-.25,.25),o++){const l=(o%2?5.8:4.3)+n.range(-.1,.3),p=n.range(-.18,.18)+(n.chance(.3)?Math.PI:0),V=n.range(1,1.1);a>167.5&&a<182.5||!$(a,l,3.6)||(H("eda",a,l,{dyaw:p,scale:V}).hero=!0)}const x0=Math.round(S0(n.range(26,40)*(.8+.2*d),26,40));for(let a=88+n.range(0,5);a<236;a+=n.range(7,11)){const o=Math.max(i.barEdge(a)+2.25,a>112&&a<222?8.3:0)+n()*1.3;$(a,o,3)&&H("eda",a,o,{dyaw:n.range(-.25,.25)+(n.chance(.3)?Math.PI:0),scale:n.range(.92,1.08)})}let b0=0;for(;F.filter(a=>a.kind==="eda").length<x0&&b0++<60;){const a=n.range(66,240),o=i.barHalf(a),l=Math.max(i.barEdge(a)+3.2,7.5)+Math.pow(n(),2.2)*Math.max(2*o-9,.5),p=n.int(3,6);for(let V=0;V<p;V++){const B=a+n.range(-5.5,5.5),E=l+n.range(-2.8,2.8),K=i.barHalf(B),Q=i.barEdge(B);if(!(E<Math.max(Q+2.5,7.2)||E>Q+2*K-1.6||B<62||B>250||!$(B,E,2.9))){if(F.filter(r0=>r0.kind==="eda").length>=x0)break;H("eda",B,E,{dyaw:n.range(-.28,.28)+(n.chance(.3)?Math.PI:0),scale:n.range(.9,1.08)})}}}const Z0=F.filter(a=>a.kind==="eda"&&a.lat>0),$0=n.int(0,6);for(let a=0;a<$0;a++){const o=n.pick(Z0),l=o.s+n.range(-1.6,1.6),p=o.lat+n.range(1.4,2.2);p<i.barEdge(l)+2*i.barHalf(l)-1.4&&$(l,p,1.5)&&H("edaFar",l,p,{dyaw:n.range(-.4,.4),scale:n.range(.46,.56)})}{const a=S.posAtDist(.52*b,new w.Vector3);for(const o of F){if(o.kind==="ery")continue;const l=o.x-a.x,p=o.z-a.z,V=l*M.x+p*M.y,B=Math.abs(l*M.y-p*M.x);if(!(V<0||V>150||B>1.9+.1*V||V<5&&B<1.2)){if(V>14||o.s===void 0){o.kind="skip";continue}i.at(o.s+3,o.lat,s),o.x=s.x,o.z=s.z,o.y=Math.max(i.heightAt(s.x,s.z),.03),o.s+=3}}}F.filter(a=>a.kind==="eda").sort((a,o)=>(o.hero?1:0)-(a.hero?1:0)||Math.abs(a.lat)-Math.abs(o.lat)).forEach((a,o)=>{o>=21&&(a.kind="edaFar")}),await e.yield();{const{sailbackGeometry:V}=await import("../parts/red-sails-dawn.js"),B=Math.ceil(b/.2),E=new Float64Array((B+1)*3),K=()=>.5,Q={};for(let R=0;R<=B;R++)S.posAtDist(Math.min(R*.2,b),s),E[R*3]=s.x,E[R*3+1]=s.y,E[R*3+2]=s.z;await e.yield();for(const R of["eda","edaFar","dim"]){const o0=V(R==="dim"?"dim":"eda",K,R!=="edaFar"),P=o0.attributes.position.array,I=o0.attributes.aAnim.array;let L=0;for(let k=0;k<P.length;k+=3)L=Math.max(L,Math.hypot(P[k],P[k+1],P[k+2]));Q[R]={pos:P,an:I,rad:L,rolled:{}},await e.yield()}const r0=(R,o0)=>R.rolled[o0]||(R.rolled[o0]=[-.072,.072].map(P=>{const I=new Float64Array(R.pos.length);for(let L=0,k=3;L<I.length;L+=3,k+=4){const N=(P+o0)*R.an[k],q=Math.cos(N),T=Math.sin(N);I[L]=R.pos[L],I[L+1]=q*R.pos[L+1]-T*R.pos[L+2],I[L+2]=T*R.pos[L+1]+q*R.pos[L+2]}return I})),f0=R=>{const o0=Q[R.kind],P=r0(o0,R.tilt),I=Math.cos(R.yaw),L=Math.sin(R.yaw),k=(o0.rad+.03)*R.scale+2;let N=1/0;for(let q=0;q<E.length;q+=3){const T=E[q]-R.x,Z=E[q+1]-R.y,J=E[q+2]-R.z;if(T*T+Z*Z+J*J>=k*k)continue;const i0=(T*I-J*L)/R.scale,X=Z/R.scale,p0=(T*L+J*I)/R.scale;for(const d0 of P)for(let y0=0;y0<d0.length;y0+=3){const C0=d0[y0]-i0,N0=d0[y0+1]-X,g0=d0[y0+2]-p0,Y0=C0*C0+N0*N0+g0*g0;Y0<N&&(N=Y0)}}return(Math.sqrt(N)-.03)*R.scale},v0=.3,R0=(R,o0,P,I,L)=>{const k=Q[R.kind],N=Q[L.kind],q=.03*(R.scale+L.scale),T=(v0+q)/L.scale;if(Math.hypot(L.x-o0,L.y-P,L.z-I)>=k.rad*R.scale+N.rad*L.scale+v0+q)return v0;const Z=Math.cos(R.yaw),J=Math.sin(R.yaw),i0=Math.cos(L.yaw),X=Math.sin(L.yaw),p0=r0(N,L.tilt),d0=[],y0=[];let C0=T*T;const N0=(O,U)=>{for(let m0=0;m0<O.length;m0++){const A0=m0%3;O[m0]<U[A0]&&(U[A0]=O[m0]),O[m0]>U[A0+3]&&(U[A0+3]=O[m0])}return U},g0=(O,U,m0,A0)=>U>=O[0]-T&&U<=O[3]+T&&m0>=O[1]-T&&m0<=O[4]+T&&A0>=O[2]-T&&A0<=O[5]+T,Y0=p0.reduce((O,U)=>N0(U,O),[1/0,1/0,1/0,-1/0,-1/0,-1/0]);for(const O of r0(k,R.tilt))for(let U=0;U<O.length;U+=3){const m0=o0+(O[U]*Z+O[U+2]*J)*R.scale-L.x,A0=P+O[U+1]*R.scale-L.y,ie=I+(O[U+2]*Z-O[U]*J)*R.scale-L.z,le=(m0*i0-ie*X)/L.scale,Ne=A0/L.scale,qe=(m0*X+ie*i0)/L.scale;g0(Y0,le,Ne,qe)&&d0.push(le,Ne,qe)}const ve=N0(d0,[1/0,1/0,1/0,-1/0,-1/0,-1/0]);for(const O of p0)for(let U=0;U<O.length;U+=3)g0(ve,O[U],O[U+1],O[U+2])&&y0.push(O[U],O[U+1],O[U+2]);for(let O=0;O<d0.length;O+=3)for(let U=0;U<y0.length;U+=3){const m0=y0[U]-d0[O],A0=y0[U+1]-d0[O+1],ie=y0[U+2]-d0[O+2],le=m0*m0+A0*A0+ie*ie;le<C0&&(C0=le)}return C0<T*T?Math.sqrt(C0)*L.scale-q:v0};for(const R of F){if(R.kind!=="eda"&&R.kind!=="edaFar"&&R.kind!=="dim")continue;const o0=R.lat,P=R.x,I=R.y,L=R.z;for(let k=0;k<3;k++){const N=2-f0(R);if(!(N>0))break;R.lat+=(R.lat<0?-1:1)*N,i.at(R.s,R.lat,s),R.x=s.x,R.z=s.z,R.y=Math.max(i.heightAt(s.x,s.z),.03)}if(R.lat!==o0){const k=R.lat-o0,N=[[R,o0,P,I,L]];for(const[q,T,Z,J,i0]of N)for(const X of F){if(X.kind!=="eda"&&X.kind!=="edaFar"&&X.kind!=="dim"||X.lat<0!=T<0||!(Math.abs(X.lat)>Math.abs(T))||N.some(d0=>d0[0]===X))continue;await e.yield();const p0=R0(q,q.x,q.y,q.z,X);p0<v0&&(await e.yield(),p0<R0(q,Z,J,i0,X)&&(N.push([X,X.lat,X.x,X.y,X.z]),X.lat+=k,i.at(X.s,X.lat,s),X.x=s.x,X.z=s.z,X.y=Math.max(i.heightAt(s.x,s.z),.03)))}}await e.yield()}}const c0=F.filter(a=>a.kind!=="ery"&&a.kind!=="skip");await e.yield();{const a=v===2?-.07:.12;let o=0;for(const l of c0){const p=Math.cos(l.yaw),V=-Math.sin(l.yaw);let B=v===2?5.5:11;for(const E of[-1.1,.3,1.5])for(let K=.6;K<B;K+=.45)if(i.heightAt(l.x+p*E*l.scale-M.x*K,l.z+V*E*l.scale-M.y*K)<a){B=K;break}l.shadowLen=Math.max(B*1.3+.3,1.2),l.refl=1,v!==2&&l.s!==void 0&&(i.at(l.s,l.lat-Math.sign(l.lat)*2.5*l.scale,s),l.refl=i.heightAt(s.x,s.z)<.06?1:0),++o,await e.yield()}}const u0=await wt(e,{placements:c0,ground:!1,mist:!1,palette:z.pal,sailStyle:x,detail:f});g.add(u0.object),await e.yield();const _=u0.uniforms,h0=z.pal;Object.assign(_,{uFogCol:{value:l0(z.fog).multiplyScalar(.62)},uFogWarm:{value:l0(h0[3])},uFogRange:{value:new w.Vector2(120,900)},uSunAz:{value:M},uZen:{value:l0(h0[1]).multiplyScalar(h<0?.8:1)},uMidSky:{value:l0(h0[0]).multiplyScalar(h<0?.85:1)},uRoseC:{value:l0(h0[3])},uPeachC:{value:l0(h0[5])},uProg:{value:0},uBandGain:{value:z.band},uSunVis:{value:new w.Vector3(M.x,0,M.y)},uSunUp:{value:0},uHemiW:{value:1.8},uGreen:{value:l0(h0[6])},uGreenGain:{value:z.green},uPixH:{value:400},uMoteGain:{value:1}}),_.uHemiI.value=1.6,u0.setMist(l0(h0[0]).multiplyScalar(.6).lerp(l0(h0[3]),.12),z.mistTop),g.fog=new w.Fog(_.uFogCol.value.clone(),120,900);const H0=St(_,v,n);g.add(H0);const Q0=await At(e,_,i);g.add(Q0.mesh),await e.yield(),await e.yield();const B0=Ct(_,Q0,v);g.add(B0.mesh),await e.yield(),g.add(Wt(_,f,z.mistTop)),await e.yield(),g.add(Et(c0)),await e.yield();const k0=He(_),W=n.fork?n.fork("plants"):n,T0=(a,o,l=0)=>{const p=i.barHalf(a);return p>.5&&o>i.barEdge(a)-l&&o<i.barEdge(a)+2*p+l},s0=(a,o,l={})=>({x:a,z:o,y:i.heightAt(a,o)-(l.sink||0),yaw:W()*M0,s:l.s||1,sy:l.sy||1,tint:W.range(-.18,.18),sway:l.sway??1,lean:l.lean||0}),U0=[],E0=[],K0=[],X0=[],W0=[],z0=[],P0=(a,o,l)=>{for(const p of F)if(Math.abs(p.x-a)<l&&Math.abs(p.z-o)<l&&Math.hypot(p.x-a,p.z-o)<l)return!0;return!1},_0=Math.round(54*(f<.8?.5:1));for(let a=0;a<_0;a++){const o=-110+(a+W())*(990/_0),l=-262+14*Math.sin(o*.008+1)+W.range(-9,9);K0.push(s0(o,l,{s:W.range(1,1.45),sink:.6,sway:.5}))}await e.yield();for(let a=0;a<15;a++){const o=-40+a*27+W.range(-8,8),l=39+3*Math.sin(o*.021)+W.range(-4,5),p=i.info(o,l);if(!(Math.abs(p.lat)<13)){E0.push(s0(o,l,{s:W.range(.85,1.3),sink:.2}));for(let V=0;V<2;V++){const B=o+W.range(-5,5),E=l+W.range(-6,4);Math.abs(i.info(B,E).lat)>11&&z0.push(s0(B,E,{s:W.range(.8,1.2),sink:.1}))}for(let V=0;V<3;V++){const B=o+W.range(-9,9),E=l+W.range(-12,3);Math.abs(i.info(B,E).lat)>9&&i.heightAt(B,E)>.3&&W0.push(s0(B,E,{s:W.range(.8,1.25)}))}}}for(let a=0;a<8;a++){const o=30+a*52+W.range(-15,15),l=W.range(-150,-78);E0.push(s0(o,l,{s:W.range(.9,1.3),sink:.3}))}for(const a of[-1,1]){i.at(b-1.5,a*8.7,s),U0.push({...s0(s.x,s.z,{s:1.22,sink:.15}),yaw:a*.4});for(let o=0;o<5;o++)i.at(b-W.range(-6,40),a*W.range(9.5,17),s),(o<2?z0:W0).push(s0(s.x,s.z,{s:W.range(.8,1.2)}))}await e.yield();for(let a=0;a<46;a++){const o=W.range(230,430),l=39+3*Math.sin(o*.021)+W.range(-13,12),p=i.info(o,l);Math.abs(p.lat)>9.5&&i.heightAt(o,l)>.35&&(a%4?W0:z0).push(s0(o,l,{s:W.range(.8,1.3)}))}for(let a=0;a<18;a++){const o=296+a%4*5.5+W.range(-1.5,1.5),l=4+a*1.5+W.range(-1,1);U0.push(s0(o,l,{s:W.range(1.05,1.45),sink:.1})),a%2?z0.push(s0(o+W.range(-4,4),l+W.range(-3,3),{s:W.range(.8,1.2)})):W0.push(s0(o-W.range(3,7),l+W.range(-3,3),{s:W.range(.8,1.2)}))}for(let a=0;a<12;a++)i.at(b+W.range(16,70),(a%2?1:-1)*W.range(4,30),s),E0.push({...s0(s.x,s.z,{s:W.range(1,1.5)}),tint:-.3});await e.yield();const ge=[[25,-14],[72,-13.5],[118,-15],[166,-13],[208,-14.5],[252,-15],[150,46],[60,44],[215,40],[290,12],[297,24],[300,-11],[b-52,-10.5],[b-50,10.5],[b-30,-11],[b-26,11.5],[b-10,12.5],[b-8,-12.5],[288,15.5],[300,16],[311,15.5],[322,-8.6],[330,-8.8],[272,-9.5],[345,13.5]];for(const[a,o]of ge){const l=Math.round(W.range(13,24)*(f<.8?.5:1)*S0(d,.8,1.2));for(let p=0;p<l;p++){const V=a+W.gauss()*4.5,B=o+W.gauss()*2.6;if(Math.abs(B)<6.8||T0(V,B,1))continue;i.at(V,B,s);const E=i.heightAt(s.x,s.z);E>1.2||P0(s.x,s.z,3.2)||X0.push({...s0(s.x,s.z,{s:1,sy:W.range(.75,1.25),lean:W.range(-.07,.07)}),y:E-.1})}await e.yield()}const oe=[],We=(a,o,l=2)=>{i.at(a,o,s);const p=i.heightAt(s.x,s.z);p>1.2||p<-.3||P0(s.x,s.z,l)||oe.push({...s0(s.x,s.z,{s:W.range(.95,1.2),sy:W.range(.85,1.3),lean:W.range(-.06,.06)}),y:p-.1})};for(const[a,o]of[[101.6,7.9],[102.8,8.6],[103.4,7.4],[100.2,9.3],[109.6,2.9],[110.4,3.5],[111.6,2.75],[112.6,3.3],[93.5,6.6],[92.2,7.4]])We(a,o,1.5);for(const[a,o,l,p,V]of[[89,-4.4,6,2.6,.9],[97,-5,6,2.6,1],[104,-4.6,6,2.4,1],[20,9.5,6,3,1.5],[33,-8,6,3,1.3],[58,8.5,5,2.5,1.2],[61,-7.5,6,3,1.3],[72,-9.5,5,3,1.5]]){for(let B=0;B<l;B++){const E=a+W.gauss()*p,K=o+W.gauss()*V;Math.abs(K)>=2.9&&We(E,K,2.6)}await e.yield()}await e.yield();const J0=[],Ze=Math.round(1e3*f*S0(d,.8,1.25));for(let a=0,o=0;J0.length<Ze&&o<14e3;o++,a++){o%80===79&&await e.yield();const l=W()<.24,p=W.range(-45,b+20),V=l?W.range(-22,55):W.range(-11,12)*W();if(Math.abs(V)<1.7||p>231&&p<256&&V>0&&V<5.5||(i.at(p,V,s),e.noise.fbm2(s.x*.09+50,s.z*.09,2)<(l?.05:-.4))||T0(p,V,-1.6)&&(V>-1.5||W()>.13))continue;const B=i.heightAt(s.x,s.z);if(B<-1.6||B>.75||P0(s.x,s.z,2.3))continue;const E=l?W.range(1,1.45):W.range(.62,1);J0.push({...s0(s.x,s.z,{s:E,sy:W.range(.8,1.3)}),y:Math.max(B,-.3)})}for(let a=0;a<Math.round(46*f);a++){i.at(W.range(11,47),-W.range(3.3,9.5),s);const o=i.heightAt(s.x,s.z);o<.02||o>.5||P0(s.x,s.z,1.7)||J0.push({...s0(s.x,s.z,{s:W.range(.7,1.15),sy:W.range(.8,1.3)}),y:o})}await e.yield();for(const[a,o,l]of[[-12,-64,5],[30,-90,4],[62,-64,6],[104,-78,5],[140,-61,4],[172,-84,6],[206,-65,5],[234,-94,4]]){for(let p=0;p<l;p++){const V=W()*M0,B=Math.sqrt(W())*9;K0.push(s0(a+Math.cos(V)*B*1.5,o+Math.sin(V)*B*.7,{s:W.range(.95,1.5),sink:.25,sway:.6}))}for(let p=0;p<2;p++)W0.push(s0(a+W.range(-12,12),o+W.range(4,9),{s:W.range(.9,1.4)}));await e.yield()}for(let a=0;a<10;a++){const o=-22+a*41+W.range(-9,9),l=40+3*Math.sin(o*.021)+W.range(-3,6);Math.abs(i.info(o,l).lat)>14&&E0.push(s0(o,l,{s:W.range(.9,1.4),sink:.2}))}const L0=n.fork?n.fork("geo2"):n;g.add(I0(Se(L0),k0,U0,"walchia")),await e.yield(),g.add(I0(Se(L0,!0),k0,E0,"walchia-far")),await e.yield(),g.add(I0(Se(L0,2),k0,K0,"walchia-comb")),await e.yield(),g.add(I0(Ke(L0),k0,X0,"calamites")),await e.yield(),g.add(I0(Ke(L0,!0),k0,oe,"calamites-near")),await e.yield(),g.add(I0(Pt(L0),k0,J0,"shoots")),await e.yield();{const a=K=>{const Q=i.info(K.x,K.z),r0=Q.lat,f0=Q.s;return K.y<-.02&&r0>-9&&(i.barHalf(f0)<.5?r0<9:r0<i.barEdge(f0)+.3)},o=He(_,!0),l=g.getObjectByName("shoots").geometry.clone(),p=g.getObjectByName("calamites").geometry.clone();await e.yield();const V=J0.filter(a);await e.yield();const B=I0(l,o,V,"shoots-mirror"),E=I0(p,o,X0.filter(a),"canes-mirror");B.renderOrder=2,E.renderOrder=2,g.add(B),g.add(E)}await e.yield(),g.add(I0(Ft(L0),k0,W0,"seedferns")),g.add(I0(Rt(L0),k0,z0,"treeferns")),await e.yield();const we=Vt(_),n0=n.fork?n.fork("cast"):n,ue=Math.round(S0(n0.range(8,20),10,20)),Pe=[15,70,248,284,351,321,64],O0=[],G0=[],xe=new w.Vector3,$e=(a,o)=>(i.at(a,o,s),i.heightAt(s.x,s.z)<-.13&&!T0(a,o,.6)),Fe=Math.ceil(ue/2),Qe=(b-44)/Fe;for(let a=0;O0.length<ue&&a<40;a++){let o=16+(a%Fe+n0.range(.2,.8))*Qe;const l=a%2?1:-1;a<Pe.length&&(o=Pe[a]);for(let p=0;p<2&&O0.length<ue;p++){const V=o+p*n0.range(1.1,1.9),B=p?2.3:1.35;let E=0;for(const Q of o===248?[p?2.5:1.45]:[l*B,-l*B,-4.4-p,-5.8-p])if($e(V,Q)){E=Q;break}if(!E)continue;i.at(V,E,s),S.tangentAtDist(S0(V,0,b),xe);const K=(p?4:0)+(o===248?2.5:0);O0.push({x:s.x,z:s.z,s:V,late:K,yaw:Math.atan2(xe.z,-xe.x)+(E>0?-1:1)*n0.range(.45,1),ph:n0()}),G0.push({x:s.x,z:s.z,sAt:V-27},{x:s.x,z:s.z,sAt:V-6.5+K})}}const ne=Ce(It(),we,ue,"diplocaulus");g.add(ne),ne.count=O0.length,O0.forEach((a,o)=>ne.userData.aI.set([a.ph,-10,.035,0],o*4)),await e.yield();const se=Ce(Bt(),we,a0.length,"eryops");g.add(se);const F0=a0.map((a,o)=>{const l=i.at(a,w0(a,o),new w.Vector3),p=i.at(a+2.2,1.7,new w.Vector3);return l.y=Math.max(i.heightAt(l.x,l.z),-.09),p.y=-.07,se.userData.aI.set([n0(),-10,.05,0],o*4),{a:l,b:p,yaw:Math.atan2(-(p.z-l.z),p.x-l.x)+[.9,0,2.6,-2.2,2.4,2.3][o]}});G0.push({x:j(F0[1].a.x,F0[1].b.x,.6),z:j(F0[1].a.z,F0[1].b.z,.6),sAt:a0[1]-6});const ee=Ce(Tt(),we,4,"griffinflies");g.add(ee);const Re=[[1.35,.3],[.4,.6],[.9,.7],[1,.2]],Ve=[.165,.655,.868,.79].map((a,o)=>{const l=o===1?i.at(a*b+34,-12,new w.Vector3):o<3?i.at(a*b+30,9,new w.Vector3):i.at(34,5.5,new w.Vector3);return ee.userData.aI.set([n0(),-10,0,1],o*4),{u0:a,c:l,cy:2.3+.5*n0(),ph:n0()*M0,w:n0.range(.5,.75),dir:o%2?-1:1,pos:new w.Vector3,yaw:0}});if(!y){const a=Ve[3],o=2,l=34,p=a.cy-.7,V=a.cy+.7,B=720,E=new Float64Array(B),K=new Float64Array(B);for(let k=0;k<B;k++)E[k]=5*Math.sin(k/B*M0),K[k]=2.6*Math.sin(2*k/B*M0);const Q=ee.geometry.attributes.position.array,r0=ee.geometry.attributes.aAnim.array;let f0=0,v0=0;for(let k=0,N=0;k<Q.length;k+=3,N+=4){const q=Math.abs(Q[k+1])+.2*Math.abs(r0[N+1]*Q[k+2]);f0=Math.max(f0,1.1*Math.hypot(Q[k],q,Q[k+2])),v0=Math.max(v0,1.1*(Math.abs(Q[k])*Math.sin(.08)+q+Math.abs(Q[k+2])*Math.sin(.5)))}const R0=(k,N,q,T)=>{let Z=1/0;for(let J=0;J<B;J++){const i0=k+E[J]-q,X=N+K[J]-T,p0=i0*i0+X*X;p0<Z&&(Z=p0)}return Math.sqrt(Z)},R=[],o0=k=>{const N=g.getObjectByName(k).geometry.attributes.position.array;let q=0,T=0;for(let Z=0;Z<N.length;Z+=3)q=Math.max(q,Math.hypot(N[Z],N[Z+2])),T=Math.max(T,N[Z+1]);return[q,T]};for(const[k,N]of[[U0,"walchia"],[E0,"walchia-far"],[K0,"walchia-comb"],[X0,"calamites"],[oe,"calamites-near"],[J0,"shoots"],[W0,"seedferns"],[z0,"treeferns"]]){const[q,T]=o0(N);for(const Z of k){const J=Math.abs(Math.sin(Z.lean)),i0=T*Z.s*Z.sy;R.push([Z.x,Z.z,q*Z.s+i0*J,Z.y+i0+q*Z.s*J])}await e.yield()}for(const k of["eda","edaFar","dim"]){const[N,q]=o0("sailbacks-"+k);for(const T of c0)if(T.kind===k){const Z=Math.sin(.072+Math.abs(T.tilt));R.push([T.x,T.z,(N+q*Z)*T.scale,T.y+(q+N*Z)*T.scale])}await e.yield()}const P=[],I=Math.ceil(b/.2);for(let k=0;k<=I;k++)S.posAtDist(Math.min(k*.2,b),s),P.push(s.x,s.y,s.z);await e.yield();const L=(k,N,q)=>{for(let T=0;T<P.length;T+=3)if(!(Math.abs(P[T]-k)>5+o+f0||Math.abs(P[T+2]-N)>2.6+o+f0)&&Math.hypot(R0(k,N,P[T],P[T+2]),Math.max(0,p-P[T+1],P[T+1]-V))-f0<o)return!1;if(!q)return!0;for(const[T,Z,J,i0]of R)if(i0+v0>p&&Math.abs(T-k)<5+J+f0&&Math.abs(Z-N)<2.6+J+f0&&R0(k,N,T,Z)<J+f0)return!1;for(let T=0;T<B;T+=8)if(i.heightAt(k+E[T],N+K[T])+v0>p)return!1;return!0};for(const[k,N,q]of[...[0,2,-2,4,-4,6,8,10,12,14,16].map(T=>[a.dir,!0,l+T]),[-a.dir,!0,l],[a.dir,!1,l]])for(let T=5.5;T<=30&&!a.c2;T+=.5)i.at(a.u0*b+q,k*T,s),L(s.x,s.z,N)&&(a.c2=s.clone()),await e.yield()}await e.yield();const Ie=[],Ue=Math.round(600*f*(f<.8?.6:1));for(let a=0;a<Ue;a++){const o=a%26,l=8+o*15.5+o*7%5,p=(o%2?1:-1)*(3.5+o*3%5);i.at(l+n0.gauss()*1.6,p+n0.gauss()*1.3,s),Ie.push({x:s.x,y:n0.range(.5,2.7),z:s.z,ph:n0(),rise:0,orbit:n0.range(.2,.5),size:.022})}const Xe=Oe(_,Ie,3);if(g.add(Xe),y){const a=[],o=Math.round(7e3*f);for(let l=0;l<o;l++){const p=n0()<.7;i.at(n0.range(-25,b+5),p?n0.range(-8,10):n0.range(-20,34),s),a.push({x:s.x,y:n0.range(0,4.2),z:s.z,ph:n0(),rise:n0.range(.2,.55),orbit:n0.range(.12,.32),size:.027}),l%800===799&&await e.yield()}g.add(Oe(_,a,4.2,1.7))}await e.yield();const he=new w.Vector3,fe=new w.Quaternion,de=new w.Quaternion,Be=new w.Matrix4,Te=new w.Vector3,te=new w.Vector3,D0=new w.Vector3,Je=new w.Vector3(0,1,0),et=new w.Vector3(0,0,1),tt=new w.Vector3(1,0,0),Ee=new w.Vector2,Le=new w.Vector3,me=(a,o,l,p,V,B,E,K,Q)=>{fe.setFromAxisAngle(Je,B),de.setFromAxisAngle(et,E),fe.multiply(de),K&&(de.setFromAxisAngle(tt,K),fe.multiply(de)),te.set(l,p,V),Te.setScalar(Q),Be.compose(te,fe,Te),a.setMatrixAt(o,Be)},Me=new Float32Array(c0.length),be=new Uint8Array(c0.length),at=_.uFogCol.value.clone(),ot=l0(h0[5]).multiplyScalar(.8),nt=l0(h0[3]),st=l0(h0[5]),rt=g.fog.color,it=l0(h0[4]),lt=l0(h0[4]).lerp(l0(h0[5]),.42),Ge=_.uMidSky.value.clone(),ct=Ge.clone().lerp(l0("#5E8FCC"),.5),De=_.uZen.value.clone(),ut=De.clone().lerp(l0("#2B4E94"),.45),ht=b/46,ft=i.at(320.6,4.6,new w.Vector3).setY(1.35),ze=new w.Vector3,dt=i.at(14.6,5,new w.Vector3).setY(1.1),mt=i.at(289.5,6.2,new w.Vector3).setY(1.2),vt=i.at(360,6.6,new w.Vector3).setY(1.5),re=new w.Vector3,pt=i.at(247.5,5.6,new w.Vector3).setY(.75),yt=i.at(175,5.3,new w.Vector3).setY(1.55);return{scene:g,path:S,duration:46,pace:a=>1.12-.46*A(.26,.32,a)+.5*A(.63,.69,a)-.14*A(.8,.88,a),title:"Red Sails at Sunrise \xB7 280 million years ago",ride:"none",companion:"none",style:"none",camera:{fov:62,near:.3,far:1200,lookAhead:30,sway:.15,bank:.5,nearThrough:.3},pois:[{at:dt,from:-.06,to:.062,weight:.95,fade:.3},{at:(a,o)=>{const l=A(.14,.28,o),p=A(.375,.415,o),V=A(.45,.49,o),B=A(.125,.16,o),E=A(.2,.235,o)*(1-A(.265,.29,o));return i.at(o*b+j(j(9,16,B),5,l),j(j(1.1,7.5,B),6.2,l)-2.4*E,ze).setY(j(1.25,1,B*(1-l))),ze.lerp(yt,p),S.posAtDist(o*b,re),re.x+=M.x*16,re.z+=M.y*16,re.y=1.75,ze.lerp(re,V)},from:.035,to:.6,weight:.8,fade:.1},{at:pt,from:.56,to:.66,weight:.8,fade:.28},{at:mt,from:.655,to:.775,weight:.6,fade:.3},{at:ft,from:.745,to:.835,weight:.9,fade:.3},{at:vt,from:.84,to:.92,weight:.4,fade:.35}],portal:{shape:"circle",radius:7,color:"#EE8A4E",glow:.75,revealDistance:140},post:{exposure:1,bloom:{strength:.55,radius:.6,threshold:.95},grade:{saturation:1.06,contrast:1.06,tint:"#ffffff",shadowTint:"#10142a",vignette:.25,grain:0,aberration:0}},update(a,o,l,p){u0.update(a,o,l),u0.setProgress(p+.055*A(.1,.38,p)*(1-A(.62,.9,p))),u0.setSunLine(u(p)+c),_.uEmberGain.value=2.7,he.setFromMatrixPosition(l.matrixWorld),e.renderer.getDrawingBufferSize(Ee),_.uPixH.value=Ee.y*l.projectionMatrix.elements[5]*.5;const V=j(-.03,.085,A(0,.75,p))+.012*h,B=Math.cos(V);_.uSunVis.value.set(M.x*B,Math.sin(V),M.y*B),_.uSunUp.value=A(.18,.4,p),Le.set(M.x,Math.max(V,.05),M.y),u0.setSun(Le),_.uProg.value=S0(.2+.85*p+.12*h,0,1),_.uFogCol.value.copy(at).lerp(ot,.08*A(.45,.9,p)),_.uFogWarm.value.copy(nt).lerp(st,.6*A(.2,.8,p));const E=A(.42,.72,p);_.uSunColor.value.copy(it).lerp(lt,A(.3,.8,p)),_.uHemiW.value=j(1.8,1.38,E),_.uHemiI.value=j(1.6,1.22,E),_.uMidSky.value.copy(Ge).lerp(ct,E),_.uZen.value.copy(De).lerp(ut,E),rt.copy(_.uFogCol.value),H0.position.copy(he),H0.material.uniforms.uStars.value=1-A(.15,.55,p);const K=p*b;for(let P=0;P<O0.length;P++){const I=O0[P],L=A(I.s-27,I.s-22,K),k=A(I.s-6+I.late,I.s-.5+I.late,K),N=L*(1-k);me(ne,P,I.x,-.3+.335*L-.4*k*k+.008*Math.sin(o*1.7+I.ph*9),I.z,I.yaw+.25*Math.sin(o*.3+I.ph*5),.2*N,0,1.2)}ne.instanceMatrix.needsUpdate=!0;for(let P=0;P<F0.length;P++)P!==1&&me(se,P,F0[P].a.x,F0[P].a.y,F0[P].a.z,F0[P].yaw,0,0,P>=4?1.08:1);const Q=A(a0[1]-13,a0[1]+1,K),r0=F0[1];me(se,1,j(r0.a.x,r0.b.x,Q),j(r0.a.y,r0.b.y,A(.2,.8,Q)),j(r0.a.z,r0.b.z,Q),r0.yaw+.06*Math.sin(Q*14),-.2*Math.sin(Math.PI*Q),0,1),se.instanceMatrix.needsUpdate=!0;for(let P=0;P<4;P++){const I=Ve[P],L=o*I.w+I.ph,k=I.c2&&p>=I.u0?I.c2:I.c;let N=k.x,q=k.z,T=5,Z=2.6;y&&(i.at(K+13+5.5*P,4.5+1.6*P,D0),N=D0.x,q=D0.z,T=3,Z=1.6);let J=N+T*Math.sin(L),i0=q+Z*Math.sin(2*L),X=I.cy+.7*Math.sin(L*.7+1),p0=0,d0=0;if(I.u0>=0){const g0=A(I.u0-.06,I.u0-.02,p)*(1-A(I.u0+.02,I.u0+.06,p));if(g0>0){const Y0=S0((p-I.u0)/.02,-1.5,1.5),ve=Y0*(P===3?.9:3)*I.dir+Re[P][0]+.12*Math.sin(o*2.3+I.ph),O=P===3?1:P?2.9:2.5;S.posAtDist(K+O,te),S.tangentAtDist(S0(K+O,0,b),D0),J=j(J,te.x+D0.z*ve,g0),i0=j(i0,te.z-D0.x*ve,g0),X=j(X,te.y+.05+Re[P][1]+(P===3?.12:.5)*Y0+.07*Math.sin(o*3.1+I.ph),g0),p0=g0,d0=Math.atan2(-D0.z,D0.x)+I.dir*1.2}}const y0=J-I.pos.x,C0=i0-I.pos.z;y0*y0+C0*C0>1e-6&&(I.yaw=Math.atan2(-C0,y0)),I.pos.set(J,X,i0);let N0=I.yaw;if(p0>0){let g0=d0-I.yaw;g0-=Math.round(g0/M0)*M0,N0=I.yaw+g0*p0}me(ee,P,J,X,i0,N0,.08,j(.2*Math.sin(L*2)+.3*I.dir,-I.dir*(P===3?.62:1),p0),1.1)}ee.instanceMatrix.needsUpdate=!0;const f0=B0.uni.uRing.value;for(let P=0;P<ce;P++){let I=-1,L=-1e9;for(let k=P;k<G0.length;k+=ce)K>=G0[k].sAt&&G0[k].sAt>L&&(I=k,L=G0[k].sAt);if(I>=0){const k=(K-L)/ht;f0[P].set(G0[I].x,G0[I].z,k,k<9?1:0)}else f0[P].w=0}const v0=B0.uni.uRefA.value,R0=B0.uni.uRefB.value,R=B0.uni.uRefC.value,o0=c0.length;for(let P=0;P<o0;P++)Me[P]=Math.hypot(c0[P].x-he.x,c0[P].z-he.z),be[P]=0;for(let P=0;P<j0;P++){let I=-1,L=40;for(let q=0;q<o0;q++)!be[q]&&Me[q]<L&&(I=q,L=Me[q]);if(I<0){v0[P].w=0;continue}be[I]=1;const k=c0[I],N=k.kind==="dim"?Ye.dim:Ye.eda;v0[P].set(k.x,k.z,k.yaw,k.mist===!1?0:k.refl*(1-A(26,38,L))),R0[P].set(N[0],N[1],N[2],k.scale),R[P].set(N[3],N[4],k.y,k.kind==="dim"?1:0)}},dispose(){u0.dispose()}}}};export{jt as default};
