import*as g from"./valley-inside-the-works-plan.js";import{X0 as _,X1 as I,Z0 as B,Z1 as H,STEP as P,NX as V,NZ as E,CH as S,routeAt as ee,smooth as X}from"./valley-inside-the-works-meadow-field.js";const W=26,C=4,z=n=>n.toFixed(1);function te(n){return n>150?2.5:n>30?1:n>-34?2:n>-46?.5:n>-204?3.5:n>-206?.5:4}const ae=[150,30,-34,-46,-204,-206];function T(n,a){if(g.riverHalfWidth(a)>0&&g.bankDistance(n,a)<.02){const r=n<g.riverX(a)?-1:1;return g.groundHeight(g.riverX(a)+r*(g.riverHalfWidth(a)+.02),a)}return g.groundHeight(n,a)}function J(n,a,r,v,f,d){const e=new Float32Array(97);for(let o=0;o<96;o++){const h=n+(a-n)*(o+.5)/96,u=f?a-h:h-n;let x=Math.min(Math.max(.9+.085*Math.max(Math.abs(h-v)-12,0),.9),6);x=Math.min(x,.55+.3*u),e[o+1]=e[o]+1/x}let t=0;for(let o=0;o<=r;o++){const h=e[96]*o/r;for(;t<95&&e[t+1]<h;)t++;const u=e[t+1]>e[t]?(h-e[t])/(e[t+1]-e[t]):0;d[o]=n+(a-n)*(t+Math.min(Math.max(u,0),1))/96}d[0]=n,d[r]=a}async function se(n,a){const r=[];for(let c=H;c>B+1e-6;){r.push(c);let s=c-te(c);for(const p of ae)c>p+1e-6&&s<p&&(s=p);c=s}r.push(B);const v=2*W+C+1,f=r.length,d=new Float32Array(f*v*3),i=new Float32Array(f*v*3),e=new Float32Array(f*v*2),t=new Float32Array(f*v*3).fill(1),o=new Float32Array(W+1),h=new Float32Array(W+1),u=new Float32Array(v),x=new Uint8Array(v);for(let c=0;c<f;c++){const s=r[c],p=s<g.FALL_Z-.01&&s>g.FALL_Z-.99?g.FALL_Z:s,b=g.riverHalfWidth(p)>0,k=b?g.riverHalfWidth(p):22,D=g.riverX(p),M=D-k,L=D+k,A=ee(s)[0];J(_,M,W,A,!0,o),J(L,I,W,A,!1,h);for(let l=0;l<=W;l++)u[l]=o[l],x[l]=0,u[W+C+l]=h[l],x[W+C+l]=0;for(let l=1;l<C;l++)u[W+l]=l===1?M+.55:l===C-1?L-.55:M+(L-M)*l/C,x[W+l]=b?1:0;const N=X(-36.4,-37.4,s)*(1-X(-43.4,-44.6,s));for(let l=0;l<v;l++){const y=u[l],q=(c*v+l)*3,O=(c*v+l)*2,Z=s<g.FALL_Z+1.95&&s>g.FALL_Z-.6&&(l===W||l===W+C),Q=x[l]?g.groundHeight(y,p):Z?T(y,g.FALL_Z+2):T(y,s);if(d[q]=y,d[q+1]=Q,d[q+2]=s,x[l])i[q]=0,i[q+1]=1,i[q+2]=0;else{const R=(T(y+.6,s)-T(y-.6,s))/1.2,Y=(T(y,s+.6)-T(y,s-.6))/(2*.6),j=Math.hypot(R,1,Y);i[q]=-R/j,i[q+1]=1/j,i[q+2]=-Y/j}e[O]=x[l]?-1.5:Math.min(b?g.bankDistance(y,s):8,8),e[O+1]=x[l]?0:N}c%10===9&&await n.yield()}await n.yield();const G=new Uint32Array((f-1)*(v-1)*6);let w=0;for(let c=0;c+1<f;c++)for(let s=0;s+1<v;s++){const p=c*v+s,b=p+1,k=p+v,D=k+1;G[w++]=p,G[w++]=b,G[w++]=k,G[w++]=b,G[w++]=D,G[w++]=k}await n.yield();const m=new a.BufferGeometry;m.setAttribute("position",new a.BufferAttribute(d,3)),m.setAttribute("normal",new a.BufferAttribute(i,3)),m.setAttribute("color",new a.BufferAttribute(t,3)),m.setAttribute("aG",new a.BufferAttribute(e,2)),m.setIndex(new a.BufferAttribute(G,1)),m.computeBoundingSphere(),m.userData.triangles=w/3;const F=c=>{let s=0;for(;s+1<f&&r[s]>c+.001;)s++;return s*(v-1)*6};return m.userData.splits=[F(30),F(g.FALL_Z+2)],m}const $=400,U=1100,K=(n,a)=>{let r=n*374761393+a*668265263|0;return r=Math.imul(r^r>>>13,1274126177),((r^r>>>16)>>>0)/4294967296};async function ie(n,a,r,v){const f=new Uint8Array($*U*4),d=(e,t)=>{f[e]=Math.round(255*Math.sqrt(Math.min(Math.max(t,0),1)))};for(let e=0;e<U;e++){const t=B+(e+.5)*(H-B)/U;for(let o=0;o<$;o++){const h=_+(o+.5)*(I-_)/$,u=(e*$+o)*4,x=r.at(S.lush,h,t),G=r.at(S.dry,h,t),w=r.at(S.shade,h,t),m=K(o,e),F=K(o+911,e-577),c=1-x,s=.5+.5*r.noise.n2(h/11.3,t/11.3);let p=.022+.085*c*c+.016*s,b=.105+.07*c+.03*s,k=.016+.03*c;const D=.85+.3*m;p*=D,b*=D,k*=D;const M=X(.9,1.2,g.bankDistance(h,t)),L=M*r.at(S.tall,h,t),A=(y,q,O,Z)=>{y=Math.min(y,.9),p+=(q-p)*y,b+=(O-b)*y,k+=(Z-k)*y};A(.2*L*(.3+1.4*F),.3,.25,.1);const N=M*r.at(S.fox,h,t),l=K(o*3+17,e*5-29);if(l>.6&&l<.6+.16*N&&A(.8*(.25+.75*m*m),.42,.1,.33),w>.05){const y=.5*w;p*=1-y,b*=1-.8*y,k*=1-.6*y,A(.3*w*M*(.2+1.5*m*F),.1,.12,.42)}if(G>0){const y=.5*G*(.7+.6*m);p+=(.12-p)*y,b+=(.15-b)*y,k+=(.05-k)*y}d(u,p),d(u+1,b),d(u+2,k),f[u+3]=255}e%3===2&&await n.yield()}const i=new a.DataTexture(f,$,U,a.RGBAFormat);return i.wrapS=i.wrapT=a.ClampToEdgeWrapping,i.magFilter=a.LinearFilter,i.minFilter=a.LinearMipmapLinearFilter,i.generateMipmaps=!0,i.anisotropy=4,i.needsUpdate=!0,i}function le(n,a,r,v,f){const d=new Uint8Array(r*v*4),i=[S.daisy,S.clover,S.parsley,S.tall];for(let t=0;t<r*v;t++)for(let o=0;o<4;o++)d[t*4+o]=Math.round(255*Math.min(Math.max(a.data[t*f+i[o]],0),1));const e=new n.DataTexture(d,r,v,n.RGBAFormat);return e.wrapS=e.wrapT=n.ClampToEdgeWrapping,e.magFilter=n.LinearFilter,e.minFilter=n.LinearFilter,e.generateMipmaps=!1,e.needsUpdate=!0,e}async function ce(n,a,r){const f=new Uint8Array(262144),d=[];for(let t=0;t<3;t++){const o=[];for(let h=0;h<4;h++){const u=8<<h,x=new Float32Array(u*u);for(let G=0;G<u*u;G++)x[G]=r();o.push([u,x])}d.push(o)}const i=(t,o,h)=>{let u=0,x=0,G=1;for(const[w,m]of d[t]){const F=o*w,c=h*w,s=Math.floor(F),p=Math.floor(c),b=F-s,k=c-p,D=b*b*(3-2*b),M=k*k*(3-2*k),L=s%w,A=(s+1)%w,N=p%w,l=(p+1)%w;u+=G*((m[N*w+L]*(1-D)+m[N*w+A]*D)*(1-M)+(m[l*w+L]*(1-D)+m[l*w+A]*D)*M),x+=G,G*=.6}return u/x};for(let t=0;t<256;t++)for(let o=0;o<256;o++){o===0&&t%8===7&&await n.yield();const h=(t*256+o)*4,u=o/256,x=t/256;f[h]=Math.round(255*Math.min(Math.max((i(0,u,x)-.5)*1.9+.5,0),1)),f[h+1]=Math.round(255*Math.min(Math.max((i(1,u,x)-.5)*1.9+.5,0),1)),f[h+2]=Math.round(255*Math.min(Math.max((i(2,u,x)-.5)*1.9+.5,0),1)),f[h+3]=255}const e=new a.DataTexture(f,256,256,a.RGBAFormat);return e.wrapS=e.wrapT=a.RepeatWrapping,e.magFilter=a.LinearFilter,e.minFilter=a.LinearMipmapLinearFilter,e.generateMipmaps=!0,e.anisotropy=4,e.needsUpdate=!0,e}async function he(n,a,r){const f=new Float32Array(65536).fill(.3),d=new Uint8Array(256*256*4);for(let e=0;e<1500;e++){e%60===59&&await n.yield();let t=r()*256,o=r()*256;const h=r()*6.2832,u=22+46*r(),x=1.3+2.2*r(),G=.5+.9*r()*r()+.25*r(),w=(r()-.5)*.03;let m=Math.cos(h),F=Math.sin(h);for(let c=0;c<u;c++){const s=x*(1-.85*c/u),p=G*(.75+.5*c/u);for(let M=-Math.ceil(s);M<=Math.ceil(s);M++){const L=1-Math.abs(M)/(s+.5);if(L<=0)continue;const A=(Math.round(t-F*M)%256+256)%256,N=(Math.round(o+m*M)%256+256)%256,l=p*(.6+.4*L);l>f[N*256+A]&&(f[N*256+A]=l)}t+=m,o+=F;const b=Math.cos(w),k=Math.sin(w),D=m*b-F*k;F=m*k+F*b,m=D}}for(let e=0;e<256*256;e++){const t=Math.round(255*Math.min(f[e]/1.6,1));d[e*4]=t,d[e*4+1]=t,d[e*4+2]=t,d[e*4+3]=255}const i=new a.DataTexture(d,256,256,a.RGBAFormat);return i.wrapS=i.wrapT=a.RepeatWrapping,i.magFilter=a.LinearFilter,i.minFilter=a.LinearMipmapLinearFilter,i.generateMipmaps=!0,i.anisotropy=4,i.needsUpdate=!0,i}const re=`
          gSplat = 0.0;
          float sx = abs(p.x) - 8.45, sy = p.y - ${g.liquidY(g.FALL_Z).toFixed(2)};
          if (wild > 0.5 && sx > -0.5 && sx < 3.5 && sy < 2.6 && up < 0.7) {
            float aa = 0.7 * max(fwidth(q.x), fwidth(q.y)) + 0.004;
            for (int o = 0; o < 2; o++) {            // the blot of this cell, and the run of the one above it
              float row = floor(q.y) + float(o), colx = q.x / 0.9 + 0.37 * row, col = floor(colx);
              vec3 h = turfHash(vec2(col, row) + 17.0), h2 = turfHash(vec2(row, col) + 71.0);
              vec2 d = vec2((colx - col - 0.44 - 0.12 * h.x) * 0.9, q.y - row - 0.44 - 0.12 * h.y);       // metres from the blot's middle
              float bx = abs(p.x - d.x) - 8.45, by = sy - d.y;                                         // (where its middle is, near enough)
              float reach = (1.0 - smoothstep(0.3, 3.3, bx)) * (1.0 - smoothstep(0.9, 1.6, by)) * step(0.0, by);      // (a blot's middle 1.6 m up at most: its own edge, 2 m)
              if (h2.x > 0.45 * reach) continue;
              float r = 0.09 + 0.19 * h.z * h.z, len = 0.4 + 0.7 * h2.y, t = clamp(-d.y / len, 0.0, 1.0);
              float an = dot(d, d) > 1e-10 ? atan(d.y, d.x) : 0.0;      // (the way round the blot; at its exact middle there is none, and none is asked: nought)
              float rim = r * (1.0 + 0.26 * sin(3.0 * an + 40.0 * h.z) + 0.14 * sin(5.0 * an + 23.0 * h2.z));       // a splat's uneven edge
              float e = length(d * vec2(1.0, 0.88)), blob = 1.0 - smoothstep(rim - aa, rim + aa, e);
              vec2 d2 = d - r * vec2(1.25 * cos(6.2832 * h2.z), 1.1 * sin(6.2832 * h2.z));                               // a drop thrown off beside it
              blob = max(blob, 1.0 - smoothstep(0.26 * r - aa, 0.26 * r + aa, length(d2)));
              float rw = r * (0.36 - 0.24 * t);
              float run = (1.0 - smoothstep(rw - aa, rw + aa, abs(d.x - 0.4 * r * (h.x - 0.5)))) * step(d.y, 0.0) * (1.0 - smoothstep(len - 0.07, len, -d.y));
              float m = max(blob, run);
              vec3 body = choc * (0.7 + 0.6 * clamp(0.5 + d.y / (2.0 * r), 0.0, 1.0)) * (1.0 - 0.3 * smoothstep(0.55, 1.0, e / rim) * step(d.y, 0.0));     // thick: light above, shadowed under
              c = mix(c, body, m);
              vec2 dg = (d - vec2(-0.28, 0.34) * r) * vec2(1.0, 0.6);
              c = mix(c, vec3(0.85, 0.78, 0.66), 0.85 * blob * step(0.13, r) * (1.0 - smoothstep(0.05 * r, 0.13 * r + aa, length(dg))));              // its one small glint
              gSplat = max(gSplat, m);
            }
          }`;function de(n,a,r,v,f){const d=new n.MeshStandardMaterial({vertexColors:!0,roughness:.93,metalness:0});return d.userData.uniforms={uTurf:{value:a},uGrain:{value:r},uBlades:{value:v},uDrift:{value:f},uDip:{value:0}},d.onBeforeCompile=i=>{Object.assign(i.uniforms,d.userData.uniforms),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 aG; varying vec2 vG; varying vec3 vGW;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vG = aG; vGW = (modelMatrix * vec4(transformed, 1.0)).xyz;`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
        uniform sampler2D uTurf, uGrain, uBlades, uDrift; uniform float uDip; varying vec2 vG;
        // turfHash: BROUGHT IN, it follows "Hash without Sine" (c)2014 David Hoskins, MIT License; see the head of this file
        vec3 turfHash(vec2 p) { vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.xxy + q.yzz) * q.zyx); } varying vec3 vGW; float gBank, gWet, gSplat, gDamp, gStain;
        const vec3 CHOC = vec3(0.12, 0.058, 0.034);      // the river's own brown: the chocolate part's body colour (its uBody, '#614434', as linear light)
        // a stone of the shore: a ball in a cell of space, so that it is as round on the slope as on the flat. Returns
        // its cover; t is its tone (its own paleness, and lighter on the side turned to the plan's light).
        float shoreStone(vec3 p, float cell, float keep, out float t) {
          vec3 sp = p / cell, si = floor(sp), sh = turfHash(si.xz + 57.0 * si.y + 91.0 * cell);
          vec3 sd = (sp - si - 0.5 - (sh - 0.5) * 0.36) * cell;
          float sr = cell * (0.14 + 0.18 * sh.z), sa = cell * max(max(fwidth(sp.x), fwidth(sp.y)), fwidth(sp.z)) + 0.003;
          t = (0.55 + 0.9 * sh.y) * (0.6 + 0.7 * clamp(0.5 + 0.5 * dot(sd, vec3(${g.LIGHT_DIR.map(e=>e.toFixed(3)).join(", ")})) / sr, 0.0, 1.0));
          return (1.0 - smoothstep(sr - sa, sr + sa, length(sd))) * step(fract(sh.x * 13.7 + sh.y * 5.3), keep);
        }
        // the limestone. wild: the scar's own weathered stone (its bedding dips with the beds and its seams lie at
        // uneven spacings; grey where the rain has weathered it). wet: behind and beside the fall, block by block: the
        // same stone dark and bare, thin runs of brown down it, small glints along a block's worn upper edge. And on
        // the scar within three metres of the fall's sides, thickest low down: the SPLATTER (see below).
        // (the paint is laid along the face: its lie is mirrored left and right of the river, so that it is never drawn out on a face that turns in toward the fall)
        vec3 valleyRock(vec3 p, vec3 n, float wild, float wet) {
          float up = clamp(n.y, 0.0, 1.0);
          vec2 q = vec2(p.x + 0.6 * p.z * clamp(p.x * 0.5, -1.0, 1.0), p.y - wild * uDip * p.x);
          float blot = texture2D(uGrain, q / 7.3).r, grain = texture2D(uGrain, q / 1.1).g, big = texture2D(uGrain, p.xz / 23.0).b;
          vec3 c = mix(vec3(0.61, 0.51, 0.37), vec3(0.87, 0.77, 0.58), blot) * (0.86 + 0.28 * grain);      // (a warm, honey-grey stone)
          float fy = fwidth(q.y) + 1e-4, lam = abs(fract(q.y / 0.46 + 0.6 * big) - 0.5) * 0.46;
          float line = (1.0 - smoothstep(0.012 + fy, 0.03 + 1.5 * fy, lam)) * (1.0 - smoothstep(0.12, 0.4, fy));
          c *= 1.0 - 0.3 * (1.0 - 0.85 * wild) * line * (1.0 - up) * smoothstep(0.45, 0.7, texture2D(uGrain, q / vec2(9.0, 3.1)).g);
          // the scar's seams: where one slow slice of the grain crosses its middle, so that no two lie the same way apart
          float sv = texture2D(uGrain, vec2(q.x / 67.0, q.y / 5.7)).g, sw = fwidth(sv) + 1e-4;
          float seam = (1.0 - smoothstep(0.6 * sw, 1.6 * sw + 0.004, abs(sv - 0.5))) * (1.0 - smoothstep(0.02, 0.07, sw));
          c *= 1.0 - 0.34 * wild * seam * (1.0 - up);
          c = mix(c, vec3(0.5, 0.51, 0.49) * (0.8 + 0.4 * grain), 0.45 * wild * smoothstep(0.35, 0.65, texture2D(uGrain, q / 17.0).b));
          float streak = texture2D(uGrain, vec2(q.x / 2.6, q.y / 24.0)).b;       // the rain's stains: tall and narrow, clean at the edge
          c *= 1.0 - (0.16 + 0.08 * wild) * smoothstep(0.66, 0.77, streak) * (1.0 - up);
          vec3 moss = vec3(0.085, 0.17, 0.045) * (0.6 + 0.8 * grain);
          c = mix(c, moss, (1.0 - wet) * smoothstep(0.7, 0.92, up) * smoothstep(0.28, 0.5, blot * 0.6 + grain * 0.5));
          vec3 choc = CHOC;
          vec3 dark = mix(c, vec3(dot(c, vec3(0.34))), 0.85) * vec3(0.44, 0.375, 0.32);
          dark = mix(dark, choc * 0.9, 0.5 * smoothstep(0.7, 0.76, texture2D(uGrain, vec2(q.x / 1.1, q.y / 9.0)).r) * (1.0 - up));
          float edge = smoothstep(0.3, 0.55, n.y) * (1.0 - smoothstep(0.8, 0.97, n.y));
          dark += vec3(0.9, 0.86, 0.78) * edge * smoothstep(0.7, 0.78, texture2D(uGrain, vec2(q.x / 0.37, p.z / 0.9)).g);
          c = mix(c, dark, wet);
${re}
          return c;
        }`).replace("#include <color_fragment>",`#include <color_fragment>
        {
          vec3 turf = texture2D(uTurf, (vGW.xz - vec2(${z(_)}, ${z(B)})) / vec2(${z(I-_)}, ${z(H-B)})).rgb; turf *= turf;
          float d1 = texture2D(uGrain, vGW.xz / 2.3).r, d2 = texture2D(uGrain, vGW.xz / 0.53).g, nb = texture2D(uGrain, vGW.xz / 5.1).b;
          float bl = texture2D(uBlades, vGW.xz / 1.6).r * 1.6, bl2 = texture2D(uBlades, vGW.zx / 4.7 + 0.37).r * 1.6;
          turf *= (0.25 + 0.95 * bl) * (0.7 + 0.45 * bl2) * (0.75 + 0.5 * d1);
          turf *= 0.74 + 0.52 * texture2D(uGrain, vGW.xz / 6.7).g;        // the hay stands in tussocks
          float bd = vG.x + 0.3 * (d2 - 0.5) + 0.25 * (d1 - 0.5);      // (the bare earth's edge is ragged at three scales)
          gBank = 1.0 - smoothstep(0.5 + 0.4 * nb, 0.85 + 0.5 * nb, bd);      // (bare earth: the bank's first metre, gone to turf by 1.6 m)
          {
            // THE DRIFTS FAR OFF: the same flowers the planting stands near the eye, here as heads seen from above: one to
            // a cell of 0.42 m, of the kind the field says, crisp while a head spans grains of the picture and gone to the
            // drift's own mean colour beyond. They come in where the planting's own forms give out (by the eye's distance).
            vec4 dr = texture2D(uDrift, (vGW.xz - vec2(${z(_-.5*P)}, ${z(B-.5*P)})) / vec2(${z(V*P)}, ${z(E*P)}));
            vec2 cp = vGW.xz / 0.42, ci = floor(cp); float fwp = max(fwidth(cp.x), fwidth(cp.y));
            vec3 hh = turfHash(ci); float dd = length(cp - (ci + 0.5 + (hh.xy - 0.5) * 0.5)) * 0.42, aa = 0.42 * fwp + 1e-4;
            float kD = 0.4 * dr.r, kC = kD + 0.34 * dr.g, kP = kC + 0.2 * dr.b, kT = kP + 0.28 * dr.a;
            vec3 fc = vec3(0.0); float rad = 0.0;
            if (hh.z < kD) { fc = dd < 0.055 ? vec3(0.6, 0.42, 0.04) : vec3(0.58, 0.58, 0.53); rad = 0.17; }
            else if (hh.z < kC) { fc = vec3(0.4, 0.11, 0.25); rad = 0.11; }
            else if (hh.z < kP) { fc = vec3(0.55, 0.57, 0.47) * (0.7 + 0.6 * d2); rad = 0.2; }
            else if (hh.z < kT) { fc = vec3(0.36, 0.27, 0.1); rad = 0.085; }
            float dotK = rad > 0.0 ? 1.0 - smoothstep(rad - aa, rad + aa, dd) : 0.0, fine = 1.0 - smoothstep(0.3, 0.85, fwp);
            vec3 meanC = turf + kD * 0.5 * (vec3(0.58, 0.58, 0.53) - turf) + (kC - kD) * 0.21 * (vec3(0.4, 0.11, 0.25) - turf) + (kP - kC) * 0.7 * (vec3(0.55, 0.57, 0.47) - turf) + (kT - kP) * 0.13 * (vec3(0.36, 0.27, 0.1) - turf);
            float amount = smoothstep(30.0, 44.0, distance(vGW, cameraPosition)) * smoothstep(0.9, 1.2, vG.x);      // (the planting's far forms stand out to some 40 m; no head within a metre of the bank line)
            turf = mix(turf, mix(meanC, mix(turf, fc, dotK), fine), amount);
          }
          // THE SHORE. Between the bank line and the liquid the bed's slope shows, and the bank's first metre is bare:
          // dark wet earth with stones in it, stained with the liquid's own brown at and just above its line, drying
          // to the bank's own earth and then to turf. (On the slope vG.x is minus the metres under the bank's level;
          // the liquid lies the plan's FREEBOARD under that level.)
          float damp = 1.0 - smoothstep(-0.25, 1.2, vG.x), over = vG.x + ${g.FREEBOARD.toFixed(2)};
          float dm = texture2D(uGrain, vec2(vGW.x + vGW.y, vGW.z) / 0.53).g;      // (the earth's grain, laid so that it is not drawn out down the slope)
          vec3 mud = vec3(0.115, 0.075, 0.047) * (0.65 + 0.7 * dm) * (1.0 - 0.5 * damp);
          // the stones, large and small: they lie on the slope and thin out across the bank; wet ones are darker
          float lie = 1.0 - smoothstep(0.3, 1.2, bd), st, st2;
          float stone = shoreStone(vGW, 0.42, 0.5 * lie, st), stone2 = shoreStone(vGW, 0.19, 0.6 * lie, st2);
          if (stone < stone2) { stone = stone2; st = st2; }
          vec3 sc = vec3(0.25, 0.23, 0.195) * st * (1.0 - 0.45 * damp);
          mud = mix(mud, sc, stone);
          gStain = (1.0 - smoothstep(0.03 + 0.12 * nb, 0.1 + 0.2 * nb, over)) * (1.0 - clamp(vG.y, 0.0, 1.0));
          mud = mix(mud, CHOC * (0.8 + 0.5 * dm), gStain);
          gDamp = damp * gBank * (1.0 - clamp(vG.y, 0.0, 1.0));
          vec3 c = mix(turf, mud, gBank);
          vec3 nW = normalize(inverseTransformDirection(normalize(vNormal), viewMatrix));
          float wild = smoothstep(10.0, 11.0, vG.x);
          gWet = smoothstep(1.3, 1.7, vG.y) * wild;     // (wet goes by the block: its edge is the block's own)
          c = mix(c, valleyRock(vGW, nW, wild, gWet), clamp(vG.y, 0.0, 1.0));
          diffuseColor.rgb *= c;
        }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(mix(mix(mix(roughnessFactor, 0.5, gBank * (1.0 - clamp(vG.y, 0.0, 1.0))), 0.34, gDamp), 0.3, gWet), 0.16, max(gSplat, gStain));`)},d.customProgramCacheKey=()=>"valley-meadow-ground",g.barMaterial(d)}export{he as bladesTexture,le as driftTexture,T as dryHeight,ce as grainTexture,se as groundGeometry,de as groundMaterial,ie as turfTexture};
