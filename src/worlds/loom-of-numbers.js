import*as r from"three";import{makePath as Na,clamp as Pe,lerp as Wo,smoothstep as Ye}from"../kit/core.js";import{PLAN as e,makeShared as Ta,LIGHT_GLSL as Ee,SHADE_GLSL as Ce,RACK_GLSL as Da,WHEEL_GLSL as Ia,makeMesher as Me,lin as be,MATTER as _e,wheelStackGeometry as At,makeWheelMaterial as Bt,makeWheelColumn as Mt,makePlainMaterial as Oe,buildHero as Pa,NO_WAVE as nt,PASTE as rt,PASTE_GLSL as Ba}from"../parts/loom-of-numbers.js";const kt=e.colX0+(e.colN-1)*e.colStep,qe=46,Qe=40,$t=8,Ht=30,Ft=18,Yo=11.25*Math.PI/180,xo=e.cx+e.drumR*Math.cos(Yo),Vo=e.drumR*Math.sin(Yo),Lt=((xo-Vo-e.cx)**2-qe**2)/(2*qe),it=e.gateW,St=e.gateH,wo=St/2,Ko=e.loomX,go=34,Zo=Math.tan(19*Math.PI/180),yo=18,bo=14,jo=e.storeX0+1.5,$a=(go-$t)/Zo+yo,Ha=jo+bo*Math.floor(((kt-$a)/2-jo)/bo),$e=[580,620,660,700],lt=2.5*4+1.5+.45,Ct={44:[36,38],35:[27.5,29.5],17:[9,11]},Ot=e.cardX0+5,ct=10,Fa=3.5,Rt=Ct[17][0]-Fa,Ca=2.6,Oa=Math.tan(14*Math.PI/180),qa=Ot+ct*Math.floor(($e[0]-lt-Ca-Ot)/ct),Ao=Ot+ct*Math.ceil(($e[1]+lt-Ot)/ct),Ve=16,qt=e.loomX0+4+3*Ve,Et=(e.rollY+1.2+e.fellY)/2,Xa=Math.tan(17*Math.PI/180);function Xt(t,c,n,a=yo){const o=c/n+a;return t<=0?0:t>=o?c:t<a?n*t*t/(2*a):t>o-a?c-n*(o-t)*(o-t)/(2*a):n*(t-a/2)}const Mo=(t,c,n=yo)=>t/(c-n),Ua=Math.min(Oa,Mo(Ft-Rt,qa-e.archE));function Ga(){const t=Math.sqrt((qe+Qe)**2-Qe**2),c=e.cx-t,n=xo-Vo;if(!(n-e.cx>qe))throw new Error("loom-of-numbers: the way out would meet the axis inside the round");const a=Math.acos(Qe/(qe+Qe)),o=Math.acos(Lt/(qe+Lt)),s=Math.PI/2+a,R=Math.PI/2-o,d=[],L=f=>f<kt?go-Xt(f-Ha,go-$t,Zo):$t+(Ht-$t)*Ye(kt,e.archW,f),m=Mo(Et-Rt,qt-Ao),M=Math.min(Xa,Mo(Et-wo,mo-qt)),k=f=>f<Ao?Ft-Xt(f-e.archE,Ft-Rt,Ua):f<qt?Rt+Xt(f-Ao,Et-Rt,m):Et-Xt(f-qt,Et-wo,M);for(let f=0;f<c-3;f+=6)d.push([f,L(f),0]);for(let f=0;f<=6;f++){const p=a*f/6;d.push([c+Qe*Math.sin(p),Ht,Qe-Qe*Math.cos(p)])}for(let f=1;f<=17;f++){const p=f/18,l=s+(R-s)*p;d.push([e.cx+qe*Math.cos(l),Ht+(Ft-Ht)*Ye(0,1,p),qe*Math.sin(l)])}for(let f=6;f>=0;f--){const p=o*f/6,l=n-Lt*Math.sin(p);d.push([l,k(l),Lt-Lt*Math.cos(p)])}for(let f=n+6;f<Ko-3;f+=6)d.push([f,k(f),0]);return d.push([Ko,wo,0]),{pts:d,xa:c,xb:n,b0:s,b1:R,up:m,down:M}}const Qo=.62,Ut=.5,Jo=.78,ko=-3,zt=800,Gt=45,ea=[170,120],Wa=3,Wt=7,Lo=250,So=14,Ya=400,ta=[700,1700],Va=2;function Ka(){const t=(c,n,a,o)=>`boxD(p, vec2(${h((c+n)/2)}, ${h((a+o)/2)}), vec2(${h((n-c)/2)}, ${h((o-a)/2)}))`;return`
      float vnoise(vec2 x){
        vec2 i = floor(x), f = fract(x); f = f*f*(3. - 2.*f);
        return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y);
      }
      float boxD(vec2 p, vec2 c, vec2 h){ vec2 d = abs(p - c) - h; return length(max(d, 0.)) + min(max(d.x, d.y), 0.); }
      // (the cloud sheet's banks at a place of the sheet, as the panes' sky has them: the land reads its shade there)
      float bankAt(vec2 c, float fw);
      // how far a place of the land lies from the house's walls (the four halls, the crossing's wings, the links)
      float houseD(vec2 p){
        float d = ${t(e.storeX0,e.storeX1,-e.storeHalf,e.storeHalf)};
        d = min(d, ${t(e.storeX1,e.crossX1,-Ke,He)});
        d = min(d, ${t(e.crossX1,e.cardX0,-ve,ve)});
        d = min(d, length(p - vec2(${h(e.cx)}, ${h(e.cz)})) - ${h(e.drumR)});
        d = min(d, ${t(e.cardX0,e.cardX1,-e.cardHalf,e.cardHalf)});
        return min(d, ${t(e.loomX0,e.loomX1,-e.loomHalf,e.loomHalf)});
      }
      // the fields' grid: turned twenty degrees from the house's axis and gently bent; one unit is one field
      const mat2 FROT = mat2(.94, .342, -.342, .94);
      const vec2 FIELD = vec2(${h(ea[0])}, ${h(ea[1])});
      vec2 fieldAt(vec2 p){ vec2 q = FROT*p; q += 14.*sin(q.yx*.011 + vec2(1.3, 4.1)); return q/FIELD; }
      // a band from a to b softened by the grain px (the same measure under one pixel), gone to its mean share
      // before it is finer than the grain
      float bandAA(float s, float a, float b, float px){
        return smoothstep(a - px, a + px, s)*(1. - smoothstep(b - px, b + px, s))*clamp((b - a)/max(px, 1e-4), 0., 1.);
      }
      // A FIELD IS A WOOD where the drifts lie (a low noise over the fields' own numbers) and the whole field stands
      // FAR_WOOD and more from the house. Farther out the drifts close up: from WOODS_CLOSE[0] to WOODS_CLOSE[1]
      // metres from the house more and more fields are wood, and beyond nearly every one: a dark band of woods
      // lies about the country's far rim, under the hills.
      float woodCell(vec2 id){
        float dw = houseD(((id + .5)*FIELD)*FROT);
        return step(.56 - .44*smoothstep(${h(ta[0])}, ${h(ta[1])}, dw), vnoise(id*.42 + 3.3))*step(${h(Lo+135)}, dw);
      }
      // WHAT STANDS ON A BOUNDARY, its height in metres at s metres along it. Everywhere a hedge; FAR_WOOD and more
      // from the house a tree line on some boundaries (a crown to every CROWN metres, a few missing) and a single
      // great tree here and there on the others; a wood's edge where a wood lies on either hand (w); nothing on the
      // lawn. key: the boundary's own number; dh: how far the house is.
      float wallH(vec2 key, float s, float w, float dh){
        float far = smoothstep(${h(Lo)}, ${h(Lo+30)}, dh), line = step(.55, hash21(key*1.3 + 4.));
        float slot = floor(s/${h(So)}), f = (fract(s/${h(So)}) - .5)*${h(So/5.5)};
        float has = step(hash21(vec2(slot, key.x*7. + key.y)), mix(.05, .85, line));
        float crown = has*far*max(1. - f*f, 0.);
        return mix(${h(Wa)}, ${h(Wt)}, max(crown, w))*smoothstep(${h(Gt)}, ${h(Gt+6)}, dh);
      }
      // the meadows' four clear tones by their number: fresh green, yellower hay, darker rough pasture, pale new-mown
      vec3 meadow(float i){
        return i < .5 ? vec3(.2, .4, .1) : i < 1.5 ? vec3(.56, .5, .19) : i < 2.5 ? vec3(.1, .19, .075) : vec3(.42, .55, .25);
      }
      // THE GROUND at a place of the land (p in metres, q in fields; fw: the grain in fields, px in metres): the
      // house's lawn, then meadows in the four tones, and on them the long shade of what stands on a field's
      // sunward boundaries (Ls: metres of shade to a metre of height, toward the sun, in the fields' frame).
      // A far field is one meadow, a tone by its own number. A FIELD NEAR THE HOUSE (its middle within STRIPS_NEAR
      // of the walls) LIES IN STRIPS along its length, two or three by its own number, each a meadow of a tone of
      // its own: the tones are taken in their order from the field's own, forward or back by the field's number,
      // so no two strips side by side are alike. No hedge parts the strips; a strip's edge is as soft as the grain.
      vec3 groundAt(vec2 p, vec2 q, vec2 fw, float px, vec2 Ls){
        float dh = houseD(p), k = hash21(floor(q)*1.7 + 2.3);
        vec2 id = floor(q);
        float i0 = k < .32 ? 0. : k < .56 ? 1. : k < .8 ? 2. : 3.;
        float n = 1. + step(houseD(((id + .5)*FIELD)*FROT), ${h(Ya)})*(1. + step(.5, hash21(id*2.9 + 7.1)));
        float turn = 1. + 2.*step(.5, hash21(id*4.3 + 1.9));
        float e = fract(q.y)*n - .5, s0 = floor(e), sw = clamp(fw.y*n, 1e-4, .5);
        vec3 tone = mix(meadow(mod(i0 + turn*clamp(s0, 0., n - 1.), 4.)), meadow(mod(i0 + turn*clamp(s0 + 1., 0., n - 1.), 4.)), smoothstep(.5 - sw, .5 + sw, fract(e)));
        // (finer than the grain the meadows go to their mean tone)
        tone = mix(tone, vec3(.31, .4, .15), smoothstep(.4, 1.2, max(fw.x, fw.y*n)));
        // (the sward's mottle, eleven metres across, and the ground's broad swell of lighter and darker, sixty-seven)
        tone *= (.9 + .2*mix(vnoise(p/11.), .5, smoothstep(3., 11., px)))*(.86 + .28*mix(vnoise(p/67. + 5.), .5, smoothstep(20., 67., px)));
        float lawn = 1. - smoothstep(${h(Gt-1)} - px, ${h(Gt+1)} + px, dh);
        // (the lawn is mown in swathes four metres broad that follow the house's walls)
        tone = mix(tone, vec3(.3, .48, .17)*(.96 + .08*mix(vnoise(p/23.), .5, smoothstep(6., 23., px)))*(1. + .16*sin(dh*.785)*(1. - smoothstep(1., 4., px))), lawn);
        float ix = id.x + step(0., Ls.x), iy = id.y + step(0., Ls.y);
        float hx = wallH(vec2(ix, id.y), q.y*FIELD.y, max(woodCell(vec2(ix - 1., id.y)), woodCell(vec2(ix, id.y))), dh);
        float hy = wallH(vec2(iy, id.x) + 17., q.x*FIELD.x, max(woodCell(vec2(id.x, iy - 1.)), woodCell(vec2(id.x, iy))), dh);
        float shade = max(bandAA(abs(ix - q.x)*FIELD.x, 0., hx*abs(Ls.x), fw.x*FIELD.x), bandAA(abs(iy - q.y)*FIELD.y, 0., hy*abs(Ls.y), fw.y*FIELD.y));
        return tone*mix(vec3(1.), vec3(.3, .4, .56), shade*.92);
      }
      // ONE FAMILY OF BOUNDARIES as the eye's line passes them. a: where the line comes down through the level of
      // the crowns' tops; b: where it meets the ground (in fields, this family's axis first; pa, pb the same two
      // places in metres). Between the two the line sinks WOOD_H, so it is stopped by the n-th boundary back from b
      // if what stands there is taller than the line is there. Out: what is seen (colour times cover), the cover,
      // and how far down the sinking the nearest stop lies (1 at the ground).
      void walls(vec2 a, vec2 b, vec2 pa, vec2 pb, float fw, float along, float sunS, float fam, float px, out vec3 wc, out float cover, out float lam){
        float span = b.x - a.x, dir = span < 0. ? -1. : 1., len = max(abs(span), 1e-4);
        float g0 = dir > 0. ? fract(b.x) : 1. - fract(b.x), i0 = dir > 0. ? floor(b.x) : floor(b.x) + 1.;
        wc = vec3(0.); cover = 0.; lam = 1.;
        // the face seen is the one toward the eye: lit when the sun stands on the eye's side of the boundary
        vec3 leaf = mix(vec3(.04, .08, .06), vec3(.15, .25, .08), step(0., -dir*sunS));
        for (int n = 0; n < 3; n++){
          float g = g0 + float(n), r = min(g/len, 1.), i = i0 - dir*float(n), sy = mix(b.y, a.y, r), row = floor(sy);
          vec2 lo = fam < .5 ? vec2(i - 1., row) : vec2(row, i - 1.), hi = fam < .5 ? vec2(i, row) : vec2(row, i);
          float h = wallH(vec2(i, row) + 17.*fam, sy*along, max(woodCell(lo), woodCell(hi)), houseD(mix(pb, pa, r)));
          float c = bandAA(g, 0., len*h/${h(Wt)}, fw);
          vec3 tone = leaf*(.62 + .5*(1. - r)*${h(Wt)}/max(h, 1.))*(.85 + .3*mix(vnoise(vec2(sy*along/6., i*3.1)), .5, smoothstep(3., 9., px)));
          wc = mix(wc, tone, c); cover = 1. - (1. - cover)*(1. - c); lam = mix(lam, 1. - r, step(.5, c));
        }
      }
      // THE LAND where the eye's line meets it (p0, q0: the ground's meeting point in metres and in fields; fw, px:
      // the grain there). No upright thing is drawn flat: a hedge, a tree line, a wood's edge stands on its
      // boundary as high as it is, and a wood's crowns lie on their own level sheet, each met by the line itself.
      vec3 landAt(vec3 V, vec2 p0, vec2 q0, vec2 fw, float px){
        float dn = min(V.y, -1e-3);
        vec2 eye = cameraPosition.xz, Ls = FROT*(uSunDir.xz/max(uSunDir.y, .2))*${h(Va)};
        vec2 p7 = eye + V.xz*((${h(ko+Wt)} - cameraPosition.y)/dn), q7 = fieldAt(p7);
        vec3 col = groundAt(p0, q0, fw, px, Ls), cx, cy;
        float ax, ay, lx, ly;
        walls(q7, q0, p7, p0, fw.x, FIELD.y, Ls.x, 0., px, cx, ax, lx);
        walls(q7.yx, q0.yx, p7, p0, fw.y, FIELD.x, Ls.y, 1., px, cy, ay, ly);
        float xn = step(lx, ly);
        col = mix(cy, cx, xn) + (1. - mix(ay, ax, xn))*(mix(cx, cy, xn) + (1. - mix(ax, ay, xn))*col);
        // a wood's crowns, on their own sheet: lit, mottled crown by crown
        vec2 ed = min(fract(q7), 1. - fract(q7))/max(fw, vec2(1e-4));
        float top = woodCell(floor(q7))*clamp(min(ed.x, ed.y) + .5, 0., 1.);
        col = mix(col, vec3(.085, .155, .07)*(.7 + .6*mix(vnoise(p7/7.), .5, smoothstep(2., 7., px))), top);
        // THE BANKS' OWN SHADE ON THE LAND: where the cloud sheet stands between this place of the land and the sun
        // (the place's own line toward the sun, met with the sheet's level), the place lies in soft shade. The
        // sheet is read by the place it is met at, as the panes read it, so the patches of shade pass over the
        // fields with the banks' own drift, by the world's clock. Finer than the grain the shade goes to its mean.
        vec2 cs = (p0 + uSunDir.xz*(${h(zt-ko)}/max(uSunDir.y, .1)))*${h(1.3/zt)} + uCloud.xy + uCloud.zw*uTime;
        float fs = px*${h(1.3/zt)};
        float under = mix(smoothstep(.47, .62, bankAt(cs, fs)), .4, smoothstep(.3, 1.2, fs));
        col *= mix(vec3(1.), vec3(.5, .58, .7), under*.8);
        // the morning's air: tones clear to the middle distance, a thin mist only at the hills' feet (by distance)
        float dist = length(p0 - eye);
        col = mix(col, vec3(.6, .7, .8), 1. - exp(-min(dist, 4e4)/9000.));
        return mix(col, vec3(.74, .8, .84), smoothstep(2500., 9000., dist)*.85);
      }`}function Za(t,c){return new r.ShaderMaterial({uniforms:{...t,uCloud:{value:c}},side:r.DoubleSide,vertexShader:`
      attribute vec4 aBar;
      varying vec3 vW; varying vec2 vUv; varying vec4 vBar;
      void main(){
        vec4 w = modelMatrix*vec4(position, 1.);
        vW = w.xyz; vUv = uv; vBar = aBar;
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:`
      varying vec3 vW; varying vec2 vUv; varying vec4 vBar;
      uniform vec4 uCloud;
      ${Ee}
      ${Ce}
      float barLine(float v, float period, float halfW){
        float d = abs(fract(v/period) - .5)*period, px = fwidth(v);
        return (1. - smoothstep(halfW - px, halfW + px, d))*clamp(halfW*2./max(px, 1e-4), 0., 1.);
      }
      ${Ka()}
      // THE MORNING BEYOND THE GLASS (one law for every pane). THIS WORLD'S FAR MORNING is by the direction looked in
      // alone: the sky's blue paling to the horizon, the sun's glow, and the far ranges (three layers of blue hills
      // with a broken skyline, farther than any place of the flight can tell apart). THE CLOUD SHEET AND THE LAND
      // EACH HAVE A PLACE: the eye's line through the pane, from the eye's true place, meets a level plane (CLOUD_Y
      // over the floor; LAND_Y under it) and what is drawn there is by that meeting point's world x and z alone, so
      // the banks and the country stand still as the eye passes. The banks drift by the world's clock from the
      // place the sky's stream dealt them.
      float bankAt(vec2 c, float fw){
        float a1 = 1. - smoothstep(.4, 1.2, fw), a2 = 1. - smoothstep(.17, .5, fw), a3 = 1. - smoothstep(.08, .23, fw), a4 = 1. - smoothstep(.035, .1, fw);
        return .5 + (vnoise(c) - .5)*.55*a1 + (vnoise(c*2.3 + 7.) - .5)*.3*a2 + (vnoise(c*5.1 + 3.) - .5)*.15*a3 + (vnoise(c*11.7 + 1.) - .5)*.07*a4;
      }
      vec3 skyAt(vec3 V){
        float up = V.y, h = clamp(up, 0., 1.);
        vec3 sky = mix(vec3(.6, .72, .84), vec3(.15, .32, .68), pow(h, .5));
        float sd = clamp(dot(V, uSunDir), 0., 1.);
        sky += uSunCol*(pow(sd, 900.)*2.2 + pow(sd, 40.)*.1 + pow(sd, 6.)*.03);
        // the banks: where the line meets the sheet; grey where a bank is deep, lit where it is thin and on its
        // sunward rim; paled by the air between toward the far sheet
        float t = (${h(zt)} - cameraPosition.y)/max(up, 1e-3);
        vec2 c = (cameraPosition.xz + V.xz*t)*${h(1.3/zt)} + uCloud.xy + uCloud.zw*uTime;
        float fw = max(fwidth(c.x), fwidth(c.y)), n = bankAt(c, fw), e0 = clamp(fwidth(n), .015, .2);
        float bank = smoothstep(.53 - e0, .53 + e0 + .02, n), deep = clamp((n - .53)/.12, 0., 1.);
        float rim = n - bankAt(c + normalize(uSunDir.xz)*.09, fw);
        vec3 cloud = mix(vec3(.46, .51, .61), vec3(.98, .95, .9), clamp(1.05 - deep*1.3 + rim*9. + .2*sd, 0., 1.));
        float air = 1. - exp(-min(t, 6e4)/18000.);
        sky = mix(sky, mix(cloud, vec3(.66, .76, .86), air), bank*step(1e-3, up)*(1. - smoothstep(.55, 1., air))*.94);
        // the far ranges, by direction: the farthest tallest and palest, the nearest lowest and deepest
        float az = atan(V.z, V.x), e = up/max(length(V.xz), .05), ee = max(fwidth(e), 2e-4);
        float k3 = sin(az*13. + 2.), k2 = sin(az*23. + 1.), k1 = sin(az*37. + .7);
        float r3 = .078 + .024*sin(az*3. + 1.3) + .012*sin(az*7. + 4.) + .016*k3*k3*k3*k3 + .003*sin(az*61.);
        float r2 = .05 + .016*sin(az*5. + .4) + .009*sin(az*11. + 2.2) + .011*k2*k2*k2*k2 + .002*sin(az*89.);
        float r1 = .024 + .01*sin(az*8. + 2.1) + .006*sin(az*19. + .5) + .007*k1*k1 + .0015*sin(az*131.);
        float mist = 1. - smoothstep(0., .016, e);
        sky = mix(sky, mix(vec3(.5, .62, .78), vec3(.7, .78, .85), mist*.8), 1. - smoothstep(r3 - ee, r3 + ee, e));
        sky = mix(sky, mix(vec3(.36, .49, .68), vec3(.7, .78, .85), mist*.8), 1. - smoothstep(r2 - ee, r2 + ee, e));
        sky = mix(sky, mix(vec3(.2, .33, .47), vec3(.7, .78, .85), mist*.8), 1. - smoothstep(r1 - ee, r1 + ee, e));
        // below the level: the land, where the line meets it (the grain is measured here, outside the branch)
        vec2 p0 = cameraPosition.xz + V.xz*((${h(ko)} - cameraPosition.y)/min(up, -1e-3)), q0 = fieldAt(p0);
        vec2 fq = fwidth(q0);
        float px = max(fwidth(p0.x), fwidth(p0.y));
        if (up < 0.) sky = mix(sky, landAt(V, p0, q0, fq, px), 1. - smoothstep(-ee, 0., e));
        return sky;
      }
      void main(){
        vec3 V = normalize(vW - cameraPosition);
        vec3 sky = skyAt(V);
        float bar = max(barLine(vUv.x, vBar.x, vBar.z), barLine(vUv.y, vBar.y, vBar.z));
        // A PANE'S OWN LIGHT (vBar.w). 1 and over: a clear pane, a little brighter than the sky's law. Under 1: a
        // pane of the Cards' old crown glass, which lets that share of the morning through and holds what it shows
        // under white (a soft shoulder from PANE_KNEE toward PANE_TOP), so that no pane of that hall glares
        vec3 seen = sky*mix(vBar.w, mix(1., vBar.w, .2), step(1., vBar.w));
        float top = max(seen.r, max(seen.g, seen.b)), over = max(top - ${h(Ut)}, 0.);
        seen *= mix((min(top, ${h(Ut)}) + ${h(Jo-Ut)}*(1. - exp(-over/${h(Jo-Ut)})))/max(top, 1e-4), 1., step(1., vBar.w));
        vec3 col = mix(seen, vec3(.03, .035, .045), bar);
        gl_FragColor = vec4(hazed(col, vW), 1.);
      }`})}function ja(){const t=[],c=[],n=[],a={};return a.quad=(o,s,R,d,L,m,M,k,f)=>{for(const[p,l,g]of[[o,L,m],[s,M,m],[R,M,k],[o,L,m],[R,M,k],[d,L,k]])t.push(p[0],p[1],p[2]),c.push(l,g),n.push(f[0],f[1],f[2],f[3])},a.tri=(o,s,R,d,L,m,M)=>{for(const[k,f]of[[o,d],[s,L],[R,m]])t.push(k[0],k[1],k[2]),c.push(f[0],f[1]),n.push(M[0],M[1],M[2],M[3])},a.build=()=>{const o=new r.BufferGeometry;return o.setAttribute("position",new r.BufferAttribute(new Float32Array(t),3)),o.setAttribute("uv",new r.BufferAttribute(new Float32Array(c),2)),o.setAttribute("aBar",new r.BufferAttribute(new Float32Array(n),4)),o.computeBoundingSphere(),o.computeBoundingBox(),o},a}const h=t=>Number.isInteger(t)?t+".":String(t),Je=e.ribBearings,Yt=Je[1]-Je[0],_t=e.ribR[1]-e.ribR[0],oa=10.5,aa=37.5,Ro=7.5,sa=e.cx+Math.sqrt(e.drumR*e.drumR-225)-.4+Ro,na=62,ra=0,ia=24,Eo=32,la=52;function Qa(t){return new r.ShaderMaterial({uniforms:{...t,uPaste:{value:Array.from({length:na},()=>new r.Vector4(0,0,0,0))},uWallAt:{value:Array.from({length:20},()=>new r.Vector2(0,0))},uLoopTop:{value:new r.Vector4(0,0,0,0)}},vertexShader:`
      varying vec3 vW;
      void main(){ vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
      varying vec3 vW;
      ${Ee}
      ${Ce}
      // a rank of the Store's columns on z = zr, met by the line from p along R: how much of a column is met
      float rankMet(vec3 p, vec3 R, float zr){
        float t = (zr - p.z)/(abs(R.z) < .02 ? .02*sign(R.z + 1e-5) : R.z);
        vec3 q = p + R*t;
        float dx = abs(fract((q.x - ${e.colX0.toFixed(1)})/6. + .5) - .5)*6.;
        // only a column's lowest metres stand in the floor, soft, fading upward from its foot within six metres
        return (1. - smoothstep(.5, 1.3 + t*.03, dx))*step(0., t)*(1. - smoothstep(.3, 6., q.y))*step(-38., q.x)*step(q.x, 234.)*(1. - smoothstep(30., 90., t));
      }
      float boxNear(vec2 p, vec2 c, vec2 hw){ vec2 d = max(abs(p - c) - hw, 0.); return length(d); }
      uniform vec4 uPaste[${na}]; uniform vec2 uWallAt[20]; uniform vec4 uLoopTop;
      // the Mill's ten ribs, each as the level direction from the drum's centre along it
      const vec2 RIB_DIR[10] = vec2[10](${Je.map(c=>`vec2(${Math.cos(c*Math.PI/180).toFixed(5)}, ${Math.sin(c*Math.PI/180).toFixed(5)})`).join(", ")});
      // a round upright thing of radius rad that stands on the Mill's floor at c (metres from the drum's centre), met
      // by the line from the floor's place d along the level direction Rh, rising by slope a metre: how much of it
      // is met. Only its lowest metres stand in the floor, soft, fading upward from its foot within MILL_STREAK.
      const float MILL_STREAK = 18.;
      // the light the Mill's brass stands in as the floor shows it (shares of the clerestory's sky and of the fans'
      // glow), the barrels' steel (a share of the lantern's daylight), the links' panes (a share of the sky)
      const vec2 MILL_BRASS = vec2(2.4, 1.3); const float MILL_STEEL = 3., LINK_GLASS = 1.2;
      // a loop's under side, which the floor shows, stands in the hall's shade: this share of its pasteboard's tone
      const float LOOP_UNDER = .6;
      // THE LANTERN'S ROUND on the Mill's floor: how strong the round of daylight under the lantern lies on the slabs
      // over the lantern's wider light (a share of the lantern's own daylight), from the drum's centre to its soft
      // rim 18 to 21 m out. It stands: no clock moves it.
      const float LANTERN_ROUND = 1.;
      float roundMet(vec2 d, vec2 Rh, float slope, vec2 c, float rad){
        vec2 rel = c - d;
        float along = dot(rel, Rh), off = abs(rel.x*Rh.y - rel.y*Rh.x);
        return (1. - smoothstep(rad*.55, rad*1.1 + along*.03, off))*smoothstep(0., rad, along)*(1. - smoothstep(.3, MILL_STREAK, along*slope));
      }
      // a loop of cards hung across the Cards' hall (its lowest point low over the middle line, its ends at top over
      // the rails 14.8 m to either hand), met by the line from the floor's place p along R: the metres along that
      // line to the loop, or -1 where the line passes it by
      float loopMeet(vec3 p, vec3 R, float low, float top){
        float a = (top - low)/(14.8*14.8);
        float A = a*R.z*R.z, B = 2.*a*p.z*R.z - R.y, C = low + a*p.z*p.z, disc = B*B - 4.*A*C;
        return (B < 0. && disc > 0.) ? 2.*C/(-B + sqrt(disc)) : -1.;
      }
      // how much of a sheer fall of cards is met at the height y, t metres along the line (soft is the softness
      // there): the whole fall from the floor to its top, its lowest metres the strongest, less the farther
      float fallMet(float y, float top, float soft, float t){
        return step(0., t)*(1. - smoothstep(top - soft, top + soft, y))*(1. - .75*smoothstep(4., 30., y))*(1. - smoothstep(40., 110., t));
      }
      // the light a brass column or a hung pasteboard stands in, as the polish shows it (one law, the Store's ranks')
      vec3 streakLight(){ return uSkyCol*.9 + uSunCol*.12; }
      // in the floor's polish before the loom: how strong the gate's own light stands (GATE_POOL), and the share of
      // a lit-through cloth's pool that the cloth drawn off beside the gate (lit on its face only) leaves (GATE_FALL)
      const float GATE_POOL = 1.8, GATE_FALL = .3;
      // the shade about one round foot of radius R, d metres from its axis: darkest under its rim, gone two metres out
      float footRound(float d, float R){ return mix(.3, 1., smoothstep(R*.85, R*.85 + 2., d)); }
      // THE CONTACT SHADE, by place: the floor darkens softly about every foot that stands on it (the Store's columns;
      // the Mill's columns, spindles, comb posts and barrels, each foot alone; the loom's posts and breast, the creels)
      float footShade(vec3 p){
        float s = 1.;
        if (p.x < 240.) {
          float dx = abs(fract((p.x - ${e.colX0.toFixed(1)})/6. + .5) - .5)*6., az = abs(p.z);
          float dz = min(abs(az - 9.), min(abs(az - 16.), uRanks > 2.5 ? abs(az - 23.) : 99.));
          s = mix(.3, 1., smoothstep(1., 3., length(vec2(dx, dz))))*step(-40., p.x) + step(p.x, -40.);
        } else if (p.x < ${h(e.crossX1)}) {
          // the Drive: the wheel's pit (dark between its kerbs), the bearing frames' two bed plates, the governor's stand
          vec2 q = p.xz - vec2(${h(W.x)}, ${h(W.z)});
          float pit = boxNear(q, vec2(0.), vec2(${h(W.R+.7)}, ${h(Do)}));
          float beds = boxNear(vec2(q.x, abs(q.y)), vec2(0., ${h(ut)}), vec2(${h(pt+1.4)}, 1.2));
          float gov = boxNear(q, vec2(${h(Xe-W.x)}, ${h(ha)}), vec2(2.2));
          s = mix(.1, 1., smoothstep(0., .3, pit))*mix(.4, 1., smoothstep(0., 2., min(beds, gov)));
        } else if (p.x < 540.) {
          // the Mill: every column, spindle and comb post of a rib and every barrel stands on its own foot on the bare
          // floor; the shade lies about each foot alone (a round of its own size), bare floor between
          vec2 d = p.xz - MILL_C; float r = length(d), ang = degrees(atan(d.y, d.x));
          ang = ang < 0. ? ang + 360. : ang;
          float b = ang < 180. ? ${h(Je[0])} + ${h(Yt)}*clamp(floor((ang - ${h(Je[0])})/${h(Yt)} + .5), 0., 4.) : ${h(Je[5])} + ${h(Yt)}*clamp(floor((ang - ${h(Je[5])})/${h(Yt)} + .5), 0., 4.);
          float da = radians(ang - b);
          vec2 q = vec2(r*cos(da), r*sin(da));
          float uc = ${h(e.ribR[0])} + ${h(_t)}*clamp(floor((q.x - ${h(e.ribR[0])})/${h(_t)} + .5), 0., 2.);
          float us = ${h(e.ribR[0]+e.spindleOff)} + ${h(_t)}*clamp(floor((q.x - ${h(e.ribR[0]+e.spindleOff)})/${h(_t)} + .5), 0., 2.);
          s = footRound(length(vec2(q.x - uc, q.y)), ${h(e.footCol)})*footRound(length(vec2(q.x - us, q.y)), ${h(e.footSpindle)})*footRound(length(vec2(q.x - ${h(e.postR)}, q.y)), ${h(e.footPost)});
          float bz = ${h(e.barrelZ[2])}*clamp(floor(d.y/${h(e.barrelZ[2])} + .5), -1., 1.);
          s *= footRound(length(d - vec2(0., bz)), ${h(e.footBarrel)})*footRound(length(vec2(d.x, abs(d.y) - ${h(e.midPostZ)})), .6);
        } else if (p.x < ${h(e.loomX0-4)}) {
          // the Cards: the floor darkens softly about every pile of folded cards (the two under each curtain's sheer
          // falls, the twenty along the walls), bare floor between; the shade dies away from 12 m to 4 m before
          // the Loom hall's west wall, and the last 4 m before that wall have none
          float az = abs(p.z), cz = clamp(floor((p.x - 560.)/40.), 0., 3.);
          float pile = boxNear(vec2(p.x, az), vec2(${h($e[0])} + 40.*cz + uAbreast*2. + 3.2, 8.), vec2(.75, 1.6));
          float bay = clamp(floor((p.x - 600.)/40. + .5), -1., 3.);
          int at = int((bay + 1.)*4. + (p.z > 0. ? 2. : 0.) + step(600. + 40.*bay, p.x));
          pile = min(pile, boxNear(vec2(p.x, az), vec2(uPaste[${Eo} + at].w, 14.6), vec2(1.6, .75)));
          s = mix(1., mix(.5, 1., smoothstep(0., 1.8, pile)), 1. - smoothstep(${h(e.loomX0-12)}, ${h(e.loomX0-4)}, p.x));
        } else if (p.x > 740.) {
          float az = abs(p.z);
          float frame = boxNear(vec2(p.x, az), vec2(${e.loomX.toFixed(1)}, ${((e.postZ-e.postHalf+28.5)/2).toFixed(2)}), vec2(1.2, ${((28.5-e.postZ+e.postHalf)/2).toFixed(2)}));
          float creel = boxNear(vec2(p.x, az), vec2(${(at+Te*(je-1)/2).toFixed(1)}, 19.4), vec2(${(Te*(je-1)/2+1).toFixed(1)}, 3.));
          // (the last creels before the gate; the take-up rolls of the cloth drawn off)
          creel = min(creel, boxNear(vec2(p.x, az), vec2(${h(mo+Te*(st-1)/2)}, ${h(po)}), vec2(${h(Te*(st-1)/2+1)}, 1.)));
          frame = min(frame, boxNear(vec2(p.x, az), vec2(${h(e.fallX-Be)}, ${h((e.fallZ[0]+e.fallZ[1])/2)}), vec2(${h(Be)}, ${h((e.fallZ[1]-e.fallZ[0])/2)})));
          s = mix(.35, 1., smoothstep(0., 2.5, frame))*mix(.6, 1., smoothstep(0., 2., creel));
        }
        return s;
      }
      // (the cloth's pool, found by mirrorAt for the place last asked; laid on by the floor's own polish)
      vec3 pool = vec3(0.);
      vec3 mirrorAt(vec3 p, vec3 R){
        vec3 m = envAt(R, p);
        if (p.x < 240.) {
          float s = sign(R.z + 1e-5);
          float met = max(rankMet(p, R, 9.*s), max(rankMet(p, R, 16.*s), rankMet(p, R, 23.*s)*step(2.5, uRanks)));
          m = mix(m, vec3(.55, .36, .1)*(uSkyCol*.9 + uSunCol*.12), met*.8);
        } else if (p.x <= 540.) {
          vec2 d = p.xz - MILL_C;
          float hl = max(length(R.xz), .05), slope = R.y/hl; vec2 Rh = R.xz/hl;
          if (dot(d, d) < 78.*78.) {
            // THE MILL IN ITS FLOOR, by the feet's own places: under each of the thirty columns of the two fans a
            // soft upright streak of its brass (in the clerestory's sky and the fans' own glow), under each of the
            // three barrels one of its blue steel (in the lantern's daylight)
            float brass = 0.;
            for (int i = 0; i < 10; i++) for (int k = 0; k < 3; k++)
              brass = max(brass, roundMet(d, Rh, slope, RIB_DIR[i]*(${h(e.ribR[0])} + ${h(_t)}*float(k)), 1.3));
            float steel = max(roundMet(d, Rh, slope, vec2(0.), 4.), max(roundMet(d, Rh, slope, vec2(0., ${h(e.barrelZ[2])}), 4.), roundMet(d, Rh, slope, vec2(0., -${h(e.barrelZ[2])}), 4.)));
            m = mix(m, vec3(.55, .36, .1)*(uSkyCol*MILL_BRASS.x + vec3(.95, .66, .28)*MILL_BRASS.y), brass*.8);
            m = mix(m, vec3(.05, .115, .28)*lanternCol()*MILL_STEEL, steel*.8);
          }
          // THE LINKS IN THEIR FLOORS (each from its arch to its far end, between its glass walls): THE GLASS WALLS'
          // LIGHT lies in the floor as long soft bars: the panes between the hoops' posts (7.5 m apart) and the
          // rails, found where the line meets the wall it runs toward, the softer the longer the line; far off the
          // bars go to their mean
          float lx0 = p.x < MILL_C.x ? ${h(e.crossX1)} : ${h(e.archE-.4)}, lx1 = p.x < MILL_C.x ? ${h(e.archW+.4)} : ${h(e.cardX0)};
          float open = 1. - millDark(p);
          if (open > 0. && p.x > lx0 && p.x < lx1) {
            float sz = sign(R.z + 1e-5), t = (15.*sz - p.z)/(abs(R.z) < .02 ? .02*sz : R.z);
            vec3 q = p + R*t;
            float soft = t*.03;
            float dp = abs(fract((q.x - lx0)/7.5 + .5) - .5)*7.5, dr = abs(fract((q.y - 6.)/9.5) - .5)*9.5;
            float glass = mix(smoothstep(.38, .6 + soft, dp)*smoothstep(.2, .42 + soft, dr), .85, smoothstep(25., 80., t));
            float wall = step(0., t)*smoothstep(lx0 - 1., lx0 + 1., q.x)*(1. - smoothstep(lx1 - 1., lx1 + 1., q.x))*smoothstep(5.9 - soft, 6.2 + soft, q.y)*(1. - smoothstep(44. - soft, 44.3 + soft, q.y));
            m = mix(m, mix(vec3(.05, .06, .075), uSkyCol*LINK_GLASS, glass), wall*open*.85);
            if (p.x > MILL_C.x) {
              // THE EAST LINK'S TEN FALLS stand in its floor, each a soft streak of its own pasteboard: found where
              // the line meets a fall's own plane within the fall's breadth, the nearest fall over the farther
              vec4 acc = vec4(0.);
              float rx = abs(R.x) < .02 ? .02*sign(R.x + 1e-5) : R.x;
              for (int j = 0; j < 5; j++) {
                int k = R.x > 0. ? 4 - j : j;
                float tf = (${h(sa-.62)} + ${h(Ro)}*float(k) - p.x)/rx;
                vec3 qf = p + R*tf;
                float sf = .2 + tf*.03;
                float w = fallMet(qf.y, ${h(aa)}, sf, tf)*(1. - smoothstep(1.5 - sf, 1.5 + sf, abs(abs(qf.z) - ${h(oa)})));
                acc = mix(acc, vec4(uPaste[${la} + (qf.z > 0. ? 5 : 0) + k].rgb, 1.), w);
              }
              m = m*(1. - acc.a*open*.85) + acc.rgb*streakLight()*open*.85;
            }
          }
        } else if (p.x > 540. && p.x < 740.) {
          float t = (20. - p.z)/max(R.z, .02);
          vec3 q = p + R*t;
          float gy = mod(q.y - 8., 9.);
          float win = gap(q.x, 5., .28)*smoothstep(1.3, 1.6, gy)*(1. - smoothstep(7.5, 7.8, gy))*step(8., q.y)*step(q.y, 50.)*step(0.02, R.z);
          m = mix(m, uSkyCol*1.25, win*.85);
          // THE CHAINS IN THE CARDS' FLOOR, west of the Loom hall's west wall: each stands in the polish as a soft
          // streak of the pasteboard it was dealt, found where the line meets the chain's own place: the walls'
          // sheer falls (on the wall the line runs toward), then curtain by curtain from the farthest to the
          // nearest its two sheer falls east of it and the loops of its lowest rail (seen from under, in shade).
          // The streaks die away from 12 m to 4 m before that wall; the last 4 m before it show none.
          float keepW = 1. - smoothstep(${h(e.loomX0-12)}, ${h(e.loomX0-4)}, p.x);
          if (keepW > 0.) {
            vec4 acc = vec4(0.);
            float rx = abs(R.x) < .02 ? .02*sign(R.x + 1e-5) : R.x;
            float sz = sign(R.z + 1e-5), tw = (14.78*sz - p.z)/(abs(R.z) < .02 ? .02*sz : R.z);
            vec3 qw = p + R*tw;
            float bay = clamp(floor((qw.x - 600.)/40. + .5), -1., 3.), sw = .2 + tw*.03;
            int at = int((bay + 1.)*4. + (sz > 0. ? 2. : 0.) + step(600. + 40.*bay, qw.x));
            vec4 pw = uPaste[${Eo} + at];
            acc = mix(acc, vec4(pw.rgb, 1.), fallMet(qw.y, uWallAt[at].x, sw, tw)*(1. - smoothstep(1.5 - sw, 1.5 + sw, abs(qw.x - pw.w))));
            for (int j = 0; j < 4; j++) {
              int c = R.x > 0. ? 3 - j : j;
              float cx = ${h($e[0])} + ${h($e[1]-$e[0])}*float(c);
              float tf = (cx + uAbreast*2. + 3.38 - p.x)/rx;
              vec3 qf = p + R*tf;
              float sf = .2 + tf*.03;
              vec4 fall = vec4(uPaste[${ia} + c*2 + (qf.z > 0. ? 1 : 0)].rgb, 1.);
              float wf = fallMet(qf.y, 49.6, sf, tf)*(1. - smoothstep(1.5 - sf, 1.5 + sf, abs(abs(qf.z) - 8.)));
              // (the loop's place along the hall is found on a loop of the rail's middle sag, then the line is met
              // again with that loop's own sag)
              float top = uLoopTop[c], t0 = loopMeet(p, R, top - 9.45, top);
              float i = clamp(floor((p.x + R.x*t0 - cx)/4. + uAbreast*.5), 0., uAbreast - 1.);
              vec4 pl = uPaste[${ra} + c*6 + int(i)];
              float tl = loopMeet(p, R, pl.w, top), sl = .2 + tl*.03;
              vec3 ql = p + R*tl;
              float wl = step(0., t0)*step(0., tl)*step(.5, pl.w)*(1. - smoothstep(1.5 - sl, 1.5 + sl, abs(ql.x - cx - (i - (uAbreast - 1.)*.5)*4.)))
                *(1. - smoothstep(14.8 - sl, 14.8 + sl, abs(ql.z)))*(1. - smoothstep(40., 110., tl));
              vec4 loop = vec4(pl.rgb*LOOP_UNDER, 1.);
              if (R.x > 0.) { acc = mix(acc, fall, wf); acc = mix(acc, loop, wl); }
              else { acc = mix(acc, loop, wl); acc = mix(acc, fall, wf); }
            }
            m = m*(1. - acc.a*keepW*.85) + acc.rgb*streakLight()*keepW*.85;
          }
        } else if (p.x >= 740.) {
          // the loom in the floor: only what glows of it. THE CLOTH'S POOL: a polished floor of slabs is no true
          // mirror: it draws a bright thing out into a long soft streak toward the eye and toward the thing's foot.
          // So the cloth lit through stands in the floor as a long pool of its own colours before the loom: found
          // where the eye's line, turned up off the floor, meets the loom's plane inside the cloth's breadth, from
          // well under the cloth's foot to well over the fell, the softer the longer the line. The bright warp over
          // it shows faintly.
          float t = (${e.loomX.toFixed(1)} - p.x)/max(R.x, .02);
          vec3 q = p + R*t;
          float az = abs(q.z), ahead = step(.02, R.x)*step(p.x, ${(e.loomX-1).toFixed(1)});
          float sf = 2. + t*.08;
          float inFrame = 1. - smoothstep(${h(e.warpHalf)} - sf, ${h(e.warpHalf)} + sf, az);
          float cloth = inFrame*smoothstep(${h((e.rollY+1.2)*.3)}, ${h(e.rollY+1.2)}, q.y)*(1. - smoothstep(${h(e.fellY)}, ${h(e.fellY*1.7)}, q.y));
          float warp = inFrame*smoothstep(${h(e.fellY)} - sf, ${h(e.fellY)} + sf, q.y)*(1. - smoothstep(${h(e.warpTop)} - sf, ${h(e.warpTop)} + sf, q.y));
          // (so do the two outer lengths before their windows, lit through; the cloth drawn off beside the gate,
          // which is lit on its face only, stands in it the fainter; and THE GATE'S OWN LIGHT lies before the gate
          // as a long warm streak of the gate's breadth)
          float outerL = (1. - smoothstep(${h((e.outerZ[1]-e.outerZ[0])/2)} - sf, ${h((e.outerZ[1]-e.outerZ[0])/2)} + sf, abs(az - ${h((e.outerZ[0]+e.outerZ[1])/2)})))*(1. - smoothstep(${h(e.outerY[1])}, ${h(e.outerY[1]*1.4)}, q.y));
          float fall = (1. - smoothstep(${h((e.fallZ[1]-e.fallZ[0])/2)} - sf, ${h((e.fallZ[1]-e.fallZ[0])/2)} + sf, abs(az - ${h((e.fallZ[0]+e.fallZ[1])/2)})))*(1. - smoothstep(${h(e.fallTop)}, ${h(e.fallTop*1.7)}, q.y));
          float gate = (1. - smoothstep(${h(it/2)} - sf, ${h(it/2)} + sf, az))*(1. - smoothstep(${h(St*.6)}, ${h(St*1.6)}, q.y));
          pool = (clothLight(q.zy)*max(cloth, max(outerL, fall*GATE_FALL)) + vec3(1., .86, .62)*gate*GATE_POOL)*ahead*(1. - smoothstep(60., 220., t));
          m = mix(m, (uSkyCol*.5 + vec3(.2, .19, .15)), .4*ahead*warp*(1. - cloth));
        }
        return m;
      }
      void main(){
        vec3 N = vec3(0., 1., 0.);
        vec3 V = normalize(cameraPosition - vW), R = reflect(-V, N);
        // the slabs' joints, six metres apart, softened by the picture's grain
        vec2 g = vW.xz/6., gw = fwidth(g);
        // inside the Mill's drum the slabs lie in rings about its centre, each ring cut by its own count of spokes
        vec2 dm = vW.xz - MILL_C; float rm = length(dm);
        if (rm < 75.) {
          float ring = floor(rm/6.), spokes = floor(6.2831853*(ring + .5));
          float th = atan(dm.y, dm.x)/6.2831853;
          g = vec2(rm/6., th*spokes + ring*.37);
          gw = vec2(fwidth(rm)/6., fwidth(vW.x)/max(rm, 3.)*spokes/6.2831853*1.5);
        }
        vec2 jd = abs(fract(g) - .5);
        float joint = 1. - .55*min(smoothstep(.5 - gw.x*1.2 - .002, .5, jd.x) + smoothstep(.5 - gw.y*1.2 - .002, .5, jd.y), 1.)*clamp(.012/max(gw.x, gw.y), 0., 1.);
        float slab = .9 + .2*hash21(floor(g));
        vec3 alb = vec3(.115, .095, .078)*slab*joint;
        vec3 col = alb*lightAt(N, vW);
        col += alb*lanternCol()*LANTERN_ROUND*(1. - smoothstep(18., 21., rm));
        float fr = .05 + .33*pow(clamp(1. - dot(N, V), 0., 1.), 3.);
        col += mirrorAt(vW, R)*fr*joint;
        col += pool*(.1 + .9*fr)*joint;
        col *= footShade(vW);
        gl_FragColor = vec4(hazed(col, vW), 1.);
      }`})}const Q=_e.iron,$=_e.ironLit,pe=_e.steel,ht=_e.timber,ke=_e.oak,Nt=(t,c)=>[c*e.storeHalf*Math.cos(t),30+(e.storeCrown-30)*Math.sin(t)],He=55,Ke=40,ve=15,Fe=30,ft=[be("#6a3f33",1),[0,.1]];async function Ja(t,c,n){t.dress=[6,3.5,3.5,0];const a=e.storeX0,o=300,s=e.storeHalf,R=[7,6,.2,1.15];for(const l of[-1,1]){t.box((a+e.storeX1)/2,3,l*(s+.6),e.storeX1-a,6,1.2,Q[0],Q[1]),c.quad([a,6,l*s],[e.storeX1,6,l*s],[e.storeX1,30,l*s],[a,30,l*s],a,6,e.storeX1,30,R);for(let w=0;w<6;w++){const b=w/6*Math.PI/2,v=(w+1)/6*Math.PI/2,C=Nt(b,l),_=Nt(v,l),O=Math.hypot(_[0]-C[0],_[1]-C[1]);c.quad([a,C[1],C[0]],[o,C[1],C[0]],[o,_[1],_[0]],[a,_[1],_[0]],a,30+w*O,o,30+(w+1)*O,[7,60,.2,1.2]),t.rod([a,_[1]-.1,_[0]],[o,_[1]-.1,_[0]],.22,4,Q[0],Q[1],{flat:!0,twist:Math.PI/4})}for(let w=a+1.5;w<o;w+=14){w<e.storeX1&&t.box(w,15,l*(s-.5),1.1,30,1,$[0],$[1],{skip:"-y"});for(let b=0;b<6;b++){const v=Nt(b/6*Math.PI/2,l*.985),C=Nt((b+1)/6*Math.PI/2,l*.985);t.rod([w,v[1]-.4,v[0]],[w,C[1]-.4,C[0]],.55,4,$[0],$[1],{flat:!0,twist:Math.PI/4});const _=Y=>[l*(e.storeHalf-e.ribDeep)*Math.cos(Y),30+(e.storeCrown-30-e.ribDeep)*Math.sin(Y)],O=_(b/6*Math.PI/2),T=_((b+1)/6*Math.PI/2);t.quad([w,v[1]-.4,v[0]],[w,C[1]-.4,C[0]],[w,T[1],T[0]],[w,O[1],O[0]],$[0],$[1])}}const g=e.storeX1;l>0?(c.quad([g,30,s],[o,30,s],[o,24,He],[g,24,He],g,0,o,26,[7,6.5,.2,1.2]),c.quad([g,6,He],[o,6,He],[o,24,He],[g,24,He],g,6,o,24,R),t.box((g+o)/2,3,He+.6,o-g,6,1.2,Q[0],Q[1]),t.box(g-.5,13.5,(s+He)/2,1,27,He-s,Q[0],Q[1])):(t.box((g+o)/2,15,-(Ke+.6),o-g,30,1.2,ft[0],ft[1],{paint:[8,.6,0,0]}),t.box((g+o)/2,30.3,-(s+Ke)/2,o-g,.6,Ke-s+1.2,Q[0],Q[1],{paint:[6,5,5,0]}),t.box(g-.5,15,-(s+Ke)/2,1,30,Ke-s,ft[0],ft[1],{paint:[8,.6,0,0]})),t.box(g,15,l*(s-.5),1.6,30,1.6,$[0],$[1],{skip:"-y"})}await n.yield();const d=12,L=[];for(let l=0;l<=d;l++){const g=l/d*Math.PI,w=-s*Math.cos(g),b=30+(e.storeCrown-30)*Math.sin(g);L.push([w,b])}c.quad([a,6,s],[a,6,-s],[a,30,-s],[a,30,s],s,6,-s,30,[6,6,.2,1.15]);for(let l=0;l<d;l++)c.tri([a,30,0],[a,L[l+1][1],L[l+1][0]],[a,L[l][1],L[l][0]],[0,30],[L[l+1][0],L[l+1][1]],[L[l][0],L[l][1]],[6,6,.2,1.15]);t.box(a-.6,3,0,1.2,6,2*s,Q[0],Q[1]),t.rod([a,e.storeCrown-.3,0],[o,e.storeCrown-.3,0],.4,4,Q[0],Q[1],{flat:!0,twist:Math.PI/4});const m=l=>30+18*Math.sqrt(Math.max(0,1-(l/s)**2)),M=[7.5,6,.2,1.15],k=l=>{for(let g=1;g+1<l.length;g++)c.tri([o,l[0][1],l[0][0]],[o,l[g][1],l[g][0]],[o,l[g+1][1],l[g+1][0]],l[0],l[g],l[g+1],M)};for(const l of[-1,1]){const g=l>0?He:Ke;t.box(o+.6,3,l*(ve+g)/2,1.2,6,g-ve,Q[0],Q[1]),l>0?k([[ve,6],[g,6],[g,24],[s,30],[ve,30]]):t.box(o+.3,18,-(ve+1.2+g)/2,.6,24,g-ve-1.2,ft[0],ft[1],{paint:[8,.6,0,0]});for(let w=0;w<6;w++){const b=ve+w*2.5,v=b+2.5;k([[l*b,30],[l*v,30],[l*v,m(v)],[l*b,m(b)]])}t.box(o-.3,15,l*(ve+.6),1.8,30,1.2,$[0],$[1],{skip:"-y"}),t.box(o-.3,15,l*s,1.2,30,1.2,$[0],$[1],{skip:"-y"}),l>0&&t.box(o-.3,12.6,l*42.5,.9,25.2,.9,$[0],$[1],{skip:"-y"}),t.box(o-.3,30,l*(ve+s)/2,.7,.7,s-ve,$[0],$[1])}const f=12,p=l=>Fe+Math.sqrt(Math.max(0,ve*ve-l*l));for(let l=0;l<f;l++){const g=-ve+2*ve*l/f,w=g+2*ve/f;k([[g,p(g)],[w,p(w)],[w,m(w)],[g,m(g)]]),t.rod([o-.3,p(g),g],[o-.3,p(w),w],1,4,$[0],$[1],{flat:!0,twist:Math.PI/4})}}const es=.2,ts=.22,Vt=7.5,zo=2,Kt=1.3,os=[2.5,4,.13,1.15];function ca(t,c,n,a,o){t.dress=[6,3.75,3.75,0];const s=[e.cx,e.cz],R=e.drumR,d=Math.PI/180,L=7.5,m=(b,v)=>[s[0]+Math.cos(b*d)*v,s[1]+Math.sin(b*d)*v],M=(b,v=0)=>{const C=Math.hypot(1,v);return[-Math.cos(b*d)/C,v/C,-Math.sin(b*d)/C]},k=[[R,46],[56,57],[36,66],[e.lanternR,e.lanternY]],f=[be("#2c343f",2.8),[0,1]];if(o===0)for(let b=0;b<48;b++){const v=b*L-11.25,C=v+L,_=v+L/2,O=m(v,R),T=m(C,R),Y=Math.abs((_+180)%360-180)<11.3||Math.abs(_-180)<11.3,q=M(v),V=M(C),E=[q,V,V,q],Z=v*d*R,ee=C*d*R;if(Y)t.quad([O[0],44,O[1]],[T[0],44,T[1]],[T[0],46,T[1]],[O[0],46,O[1]],Q[0],Q[1],void 0,E);else{t.quad([O[0],0,O[1]],[T[0],0,T[1]],[T[0],40,T[1]],[O[0],40,O[1]],f[0],f[1],[9,L*d*R/2,40/6,0],E),c.quad([O[0],40,O[1]],[T[0],40,T[1]],[T[0],46,T[1]],[O[0],46,O[1]],Z,40,ee,46,[2.455,20,.13,1.3]);const z=m(_,R-.35);for(const x of[13.5,27,39.6])t.box(z[0],x,z[1],.7,.7,2*R*Math.sin(L*d/2),$[0],$[1],{ry:-_*d,skip:"+x"});const i=m(_,R-.75),N=m(_+Math.atan2(zo/2+Kt-.15,R-.9)/d,Math.hypot(zo/2+Kt-.15,R-.9));t.box(i[0],20.6,i[1],.5,37.2,zo,pe[0],pe[1],{ry:-_*d,skip:"+x",paint:[5,.8,200+b+n,1]}),a.push({x:N[0],y:20,z:N[1],deg:_,col:[1/(Kt*.6283),0,nt,0],seed:200+b+n}),t.rod([N[0]-Math.cos(_*d)*.1,20,N[1]-Math.sin(_*d)*.1],[N[0]+Math.cos(_*d)*.8,20,N[1]+Math.sin(_*d)*.8],.3,6,$[0],$[1],{})}const S=m(v,R-.4),F=Math.abs(Math.abs((v+180)%360-180)-11.25)<.1||Math.abs(Math.abs(v-180)-11.25)<.1;Math.abs((v+180)%360-180)<11||Math.abs(v-180)<11||t.box(S[0],F?22:20,S[1],F?1.3:.8,F?44:40,F?1.6:1,$[0],$[1],{ry:-v*d,skip:"-y",arris:!0});for(let z=0;z<3;z++){const[i,N]=k[z],[x,u]=k[z+1],B=m(v,i),U=m(C,i),G=m(C,x),re=m(v,x),te=-(i-x)/(u-N);if(t.quad([B[0],N,B[1]],[U[0],N,U[1]],[G[0],u,G[1]],[re[0],u,re[1]],f[0],f[1],[4,2.75,0,0],[M(v,te),M(C,te),M(C,te),M(v,te)]),b%2===0){const H=m(v,i-.3),de=m(v,x-.3);t.rod([H[0],N-.3,H[1]],[de[0],u-.3,de[1]],.3,4,$[0],$[1],{flat:!0})}}const X=m(v,e.lanternR),y=m(C,e.lanternR);c.tri([s[0],e.lanternY,s[1]],[X[0],e.lanternY,X[1]],[y[0],e.lanternY,y[1]],[s[0],s[1]],X,y,[3.75,3.75,.11,1.6]),t.rod([X[0],e.lanternY-.3,X[1]],[y[0],e.lanternY-.3,y[1]],.35,4,$[0],$[1],{flat:!0}),t.rod([O[0],46.2,O[1]],[T[0],46.2,T[1]],.3,4,$[0],$[1],{flat:!0})}if(o===0)return;const p=Math.sqrt(R*R-ve*ve),l=5,g=(b,v)=>{const C=b/l*Math.PI/2;return[v*ve*Math.cos(C),Fe+ve*Math.sin(C)]},w=b=>Fe+Math.sqrt(Math.max(0,ve*ve-b*b));for(const[b,v,C]of[[300,s[0]-p+.4,!0],[s[0]+p-.4,e.cardX0,!1]]){for(const Y of[-1,1]){t.box((b+v)/2,3,Y*(ve+.6),v-b,6,1.2,Q[0],Q[1]),c.quad([b,6,Y*ve],[v,6,Y*ve],[v,Fe,Y*ve],[b,Fe,Y*ve],b,6,v,Fe,os),t.box((b+v)/2,6.2,Y*(ve-.4),v-b,.6,.8,$[0],$[1],{skip:"-y"});for(let q=b+3.75;q<v;q+=7.5)t.box(q,Fe/2,Y*(ve-.3),.7,Fe,.6,$[0],$[1],{skip:"-y",arris:!0});for(let q=0;q<l;q++){const V=g(q,Y),E=g(q+1,Y),Z=Math.hypot(E[0]-V[0],E[1]-V[1]);c.quad([b,V[1],V[0]],[v,V[1],V[0]],[v,E[1],E[0]],[b,E[1],E[0]],b,q*Z,v,(q+1)*Z,[7.5,60,.2,1.2]);for(let ee=b+3.75;ee<v;ee+=7.5)t.rod([ee,V[1]-.3,V[0]*.98],[ee,E[1]-.3,E[0]*.98],.45,4,$[0],$[1],{flat:!0,twist:Math.PI/4})}}t.rod([b,Fe+ve-.3,0],[v,Fe+ve-.3,0],.3,4,Q[0],Q[1],{flat:!0,twist:Math.PI/4});const _=C?v:b,O=C?[1,0,0]:[-1,0,0],T=C?b:v;for(let Y=0;Y<8;Y++){const q=-ve+2*ve*Y/8,V=q+2*ve/8;t.quad([_,w(q),q],[_,w(V),V],[_,44.2,V],[_,44.2,q],f[0],f[1],[6,4,4,0],[O,O,O,O]),C||t.quad([T,w(q),q],[T,w(V),V],[T,44.2,V],[T,44.2,q],ht[0],ht[1],[7,.45,0,0],[O,O,O,O])}}for(const[b]of[[180],[0]]){const v=m(b,R-.5);t.box(v[0],44.5,v[1],1.6,1.2,31,$[0],$[1],{ry:-b*d})}}function as(t,c){const n=e.cardX0,a=e.cardX1,o=e.cardHalf,s=a-n,R=(n+a)/2,d=50,L=e.cardHigh,m=_e.timber,M=[be("#b98a55",.55),[0,.25]],k=[be("#b48f71"),[0,.25]];t.dress=[7,.42,0,0];for(const f of[-1,1]){for(const p of e.galY)t.box(R,p-.25,f*(o-e.galDeep/2),s,.5,e.galDeep,m[0],m[1]),t.box(R,p+1.15,f*(o-e.galDeep+.1),s,.16,.16,M[0],M[1]),t.box(R,p+.6,f*(o-e.galDeep+.1),s,.1,.1,M[0],M[1]);for(let p=n+5;p<a;p+=10)t.box(p,25,f*(o-e.galDeep+.1),.36,50,.36,M[0],M[1],{skip:"-y"});if(f>0){t.box(R,4,f*(o+.3),s,8,.6,k[0],k[1]);for(const p of e.galY)c.quad([n,p+1.3,f*o],[a,p+1.3,f*o],[a,Math.min(p+7.8,d),f*o],[n,Math.min(p+7.8,d),f*o],n,0,a,6.5,[5,30,.28,Qo]),t.box(R,p+.2,f*(o+.2),s,2.2,.4,k[0],k[1])}else t.box(R,d/2,f*(o+.3),s,d,.6,k[0],k[1]);c.quad([n,d,f*o],[a,d,f*o],[a,L,0],[n,L,0],n,0,a,21,[5,60,.2,Qo]);for(let p=n+5;p<a;p+=10)t.rod([p,d-.3,f*o],[p,L-.3,0],.28,4,M[0],M[1],{flat:!0})}t.rod([n,L-.4,0],[a,L-.4,0],.35,4,M[0],M[1],{flat:!0});for(const f of[-1,1])t.box(n-.3,25,f*17.5,.6,50,5,m[0],m[1],{skip:"-y"});t.quad([n,44,-15],[n,44,15],[n,L,0],[n,L,0],m[0],m[1],void 0,[[1,0,0],[1,0,0],[1,0,0],[1,0,0]]),t.quad([n,44,-15],[n,L,0],[n,d,-o],[n,44,-o],m[0],m[1],void 0,[[1,0,0],[1,0,0],[1,0,0],[1,0,0]]),t.quad([n,44,15],[n,44,o],[n,d,o],[n,L,0],m[0],m[1],void 0,[[1,0,0],[1,0,0],[1,0,0],[1,0,0]]),t.dress=[0,0,0,0]}const _o=[12,26,40,54],ss=2,No=.5,Zt=e.loomX1-1.2;function ns(t,c){const n=e.loomX0,a=e.loomX1,o=e.loomHalf,s=e.loomHigh,R=a-n,d=(n+a)/2,L=[be("#a98a62",.5),[0,.3]],m=[be("#a98a62",.4),[0,.25]],M=E=>[E,E,E,E];t.dress=[7,.45,0,0],t.box(d,3,o+.3,R,6,.6,L[0],L[1]),c.quad([n,6,o],[a,6,o],[a,72,o],[n,72,o],0,0,R,66,[8,11,.22,1.25]),t.box(d,73,o+.3,R,2,.6,L[0],L[1]),t.box(d,s/2,-(o+.3),R,s,.6,L[0],L[1]);for(const E of _o)t.box(d,E-.3,-(o-2),R,.6,4,ht[0],ht[1]),t.box(d,E+1.25,-(o-3.9),R,.2,.2,m[0],m[1],{paint:[0,0,0,0]}),t.box(d,E+.65,-(o-3.9),R,.12,.12,m[0],m[1],{paint:[0,0,0,0]});for(const E of[-1,1]){for(let Z=n+4;Z<a;Z+=Ve)t.box(Z,s/2,E*(o-.35),.9,s,.9,ke[0],ke[1],{skip:"-y",paint:[7,.45,0,1]}),E<0&&t.box(Z,28,-(o-3.9),.4,56,.4,ke[0],ke[1],{skip:"-y",paint:[7,.4,0,1]});t.quad([n,s,E*8],[a,s,E*8],[a,s,E*o],[n,s,E*o],L[0],L[1],void 0,M([0,-1,0])),t.quad([n,0,E*e.cardHalf],[n,0,E*o],[n,s,E*o],[n,s,E*e.cardHalf],L[0],L[1],void 0,M([1,0,0])),t.quad([n,50,E*e.cardHalf],[n,s,E*e.cardHalf],[n,s,0],[n,e.cardHigh,0],L[0],L[1],void 0,M([1,0,0]))}c.quad([n,s,-8],[a,s,-8],[a,s,8],[n,s,8],n,-8,a,8,[8,8,.25,1.3]);for(let E=n+4;E<a;E+=Ve)t.box(E,s-.5,0,.8,1,2*o,ke[0],ke[1],{paint:[7,.4,0,0]});const k=[be("#4a3524",1.9),[0,.4]],f=e.warpHalf,p=e.rollY+1.2,l=e.fellY,g=[7,.5,0,1],w=(E,Z,ee,S)=>t.quad([a,ee,E],[a,ee,Z],[a,S,Z],[a,S,E],k[0],k[1],g,M([-1,0,0])),b=it/2-.3,v=St-it/2,C=E=>v+Math.sqrt(Math.max(0,b*b-E*E)),_=e.outerZ,O=e.outerY,T=_[0]+ss,Y=_[1]-No,q=O[0]+2*No,V=O[1]-2*No;for(const E of[-1,1])w(E*f,E*T,0,s),w(E*Y,E*o,0,s),w(E*T,E*Y,0,q),w(E*T,E*Y,V,s),c.quad([a,q,E>0?Y:-T],[a,q,E>0?T:-Y],[a,V,E>0?T:-Y],[a,V,E>0?Y:-T],E>0?Y:-T,q,E>0?T:-Y,V,[8,9.25,.25,1.15]),w(E*b,E*f,0,p),t.box(a-.45,s/2,E*(o+31)/2,.9,s,.9,ke[0],ke[1],{skip:"-y",paint:[7,.45,0,1]});w(-f,f,l,s);for(let E=0;E<16;E++){const Z=-b+2*b*E/16,ee=Z+2*b/16;t.quad([a,C(Z),Z],[a,C(ee),ee],[a,p,ee],[a,p,Z],k[0],k[1],g,M([-1,0,0]))}c.quad([a,p,f],[a,p,-f],[a,l,-f],[a,l,f],f,p,-f,l,[8,9.25,.25,1.15]),t.dress=[0,0,0,0]}const et=[110,170],Tt=13,dt=256;function rs(t){return new r.ShaderMaterial({uniforms:{...t},vertexShader:`
      attribute vec4 aCol; attribute vec2 aMeta;
      varying vec3 vW, vN, vL; varying vec4 vCol; varying vec2 vMeta;
      void main(){
        vec4 w = modelMatrix*instanceMatrix*vec4(position, 1.);
        vW = w.xyz; vN = normalize(mat3(modelMatrix)*mat3(instanceMatrix)*normal); vL = position; vCol = aCol; vMeta = aMeta;
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:`
      varying vec3 vW, vN, vL; varying vec4 vCol; varying vec2 vMeta;
      ${Ee}
      ${Ce}
      ${Ia}
      const vec3 BRASS = vec3(${be("#c9a04a").map(c=>c.toFixed(4)).join(", ")});
      const vec3 BRASS_DARK = vec3(${be("#6e5320").map(c=>c.toFixed(4)).join(", ")});
      const vec3 BLUE_STEEL = vec3(${be("#3d5f8f",1.5).map(c=>c.toFixed(4)).join(", ")});
      const vec3 BRASS_EDGE = vec3(${be("#f0d48a").map(c=>c.toFixed(4)).join(", ")});
      void main(){
        vec3 N = normalize(vN);
        // the grain of the picture on the drum's face, in scallops: finer than this and the scallops go to their mean tone
        float grain = length(fwidth(vL.xz))/(.9*.62831853);
        float y = vL.y - ${e.storeFoot.toFixed(1)}, k = floor(y/.6), fy = y - k*.6;
        vec3 col;
        if (vL.y > 26.02 || y < 0.) col = shadeDull(vec3(.012, .014, .018), N, vW, 1.);
        else {
          float act;
          vec4 dc = floor(vCol*${dt}. + .5)/${dt}.; float ds = floor(vMeta.x*${dt}. + .5)/${dt}.;
          float turn = wheelTurn(dc, ds, floor(vMeta.y + .5), k, uTime*uTempo, act);
          float th = atan(vL.z, vL.x)/.62831853 - turn;
          float s = fract(th), idx = mod(floor(th + .5), 10.);
          float notch = smoothstep(.2, .3, s)*(1. - smoothstep(.7, .8, s));
          float fade = smoothstep(.25, .9, grain);
          notch = mix(notch, .5, fade);
          float blue = step(idx, .5)*(1. - notch)*(1. - fade*.7);
          float tint = .86 + .28*hash21(vec2(k*1.7, ds*3.3));
          // as the true wheels are shaded (the part's wheel material): a worn bright edge above and below, the under
          // edge in the shade of the wheel over it, the stack's broad highlight and its darker turning edge
          float e = fy*4. - 1., worn = smoothstep(.8, 1., clamp(abs(e), 0., 1.))*(1. - fade);
          vec3 F0 = mix(mix(mix(BRASS, BRASS_DARK, notch*.45), BRASS_EDGE, worn*.6)*tint, BLUE_STEEL, blue);
          col = shadeMetal(F0, N, vW, .5 + .3*(1. - notch))*mix(1., .72, notch);
          vec3 V = normalize(cameraPosition - vW);
          float broad = pow(clamp(dot(N, normalize(uSunDir + V)), 0., 1.), 5.);
          col = col*mix(.5, 1.08, smoothstep(.05, .7, clamp(dot(N, V), 0., 1.))) + F0*gSun*broad*.55;
          col *= mix(.8, 1.12, smoothstep(-1., .6, e));
          col = mix(col, shadeMetal(vec3(.3, .33, .38), N, vW, .5)*.4, step(.5, fy)*(1. - fade*.6));
        }
        gl_FragColor = vec4(hazed(col, vW), 1.);
      }`})}function is(){const t=Me(),c=[0,0,0],n=[0,0],a=e.storeR;return t.rod([0,e.storeFoot,0],[0,26,0],a,12,c,n,{}),t.rod([0,0,0],[0,e.storeFoot,0],a*1.3,12,c,n,{r2:a*.85,capB:!0}),t.rod([0,26,0],[0,27.2,0],a*.82,12,c,n,{r2:a*.6}),t.rod([0,27.3,0],[0,27.8,0],.8,10,c,n,{capB:!0}),t.build()}const ls=.55,jt=1.2,cs=1.45,To=27.6,Dt=3.4,hs=29.5;function fs(t){return new r.ShaderMaterial({uniforms:{...t},vertexShader:`
      attribute vec3 color; attribute vec2 aSurf; attribute vec4 aPaint; attribute vec2 aRack;
      varying vec3 vW, vN, vC; varying vec2 vS;
      ${Ee}
      ${Da}
      void main(){
        vec3 p = position, n = normal;
        float th = ${h(ls)}*rackSlide(aRack.x, uTime*uTempo)/5., c = cos(th), sn = sin(th), kind = aPaint.x, up = step(10., p.y);
        vec2 piv = vec2(0., mix(${h(Dt)}, ${h(To)}, up));
        if (kind > 1.5 && kind < 2.5) { vec2 d = p.xy - piv; p.xy = piv + vec2(c*d.x + sn*d.y, -sn*d.x + c*d.y); n.xy = vec2(c*n.x + sn*n.y, -sn*n.x + c*n.y); }
        else if (kind > .5 && kind < 1.5) p.y -= ${h(jt)}*sn;
        else if (kind > 2.5) p.x -= ${h(jt)}*sn;
        // (a station under the low bay's bed is the shorter by the bed's own drop)
        p.y += up*(aRack.y - ${h(hs)});
        vec4 w = modelMatrix*instanceMatrix*vec4(p, 1.);
        vW = w.xyz; vN = normalize(mat3(modelMatrix)*mat3(instanceMatrix)*n); vC = color; vS = aSurf;
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:`
      varying vec3 vW, vN, vC; varying vec2 vS;
      ${Ee}
      ${Ce}
      void main(){
        vec3 N = normalize(vN);
        vec3 col = vS.x > .5 ? shadeMetal(vC, N, vW, vS.y) : shadeDull(vC, N, vW, vS.y);
        gl_FragColor = vec4(hazed(col, vW), 1.);
      }`})}function ds(){const t=Me(),c=_e.brass,n=cs,a=jt,o=.14,s=(R,d)=>{const L={paint:[2,0,0,0]};t.rod([0,R,n-o-.06],[0,R,n+o+.06],.3,6,c[0],c[1],{...L,capA:!0,capB:!0});for(const m of[[0,R+d*1.1],[a,R]])t.rod([0,R,n],[m[0],m[1],n],.17,4,c[0],c[1],{...L,flat:!0,r2:.1})};return s(To,1),s(Dt,-1),t.rod([a,Dt,n],[a,To,n],.13,4,pe[0],pe[1],{flat:!0,paint:[1,0,0,0]}),t.rod([0,Dt-1.05,n],[-1.5,Dt-1.05,n-.4],.11,4,pe[0],pe[1],{flat:!0,paint:[3,0,0,0]}),t.build()}async function us(t){const{scene:c,shared:n,ctx:a}=t,o=t.RNG.store,s=Pe(.3+.15*(t.vary.density-.7)/.6,.3,.45),R=()=>{const T=1.5/s*o.range(.85,1.15);return{col:[T,o.range(0,T),nt,0],seed:o.range(1,90)}},d={R:e.storeR,depth:.19,pitch:e.storeBand,thick:.5,segs:2,capped:!1,foot:e.storeFoot,y0:e.storeFoot},L=At({...d,wheels:e.storeWheels}),m=At({...d,wheels:e.storeWheels/2}),M=At({wheels:1,R:.8,depth:.2,pitch:.6,thick:.5,segs:3,capped:!1,bare:!0,foot:0,y0:0}),k=Bt(n,{y0:e.storeFoot}),f=Bt(n,{y0:0}),p=T=>T>et[0]-Tt&&T<et[1]+Tt,l=Me(),g=[],w=[],b=[],v=T=>[1,.5,T+t.rackSalt.store,1];l.dress=[6,3,3,0];const C=[-1,1],_=e.rankZ.slice(0,t.ranks);for(const T of C)for(let Y=0;Y<_.length;Y++){const q=T*_[Y],V=Y===0,E=V&&T===t.lowSide,Z=(T>0?3:0)+Y;let ee=[],S=[];const F=()=>{ee.length&&c.add(Mt(L,k,ee)),S.length&&c.add(Mt(m,k,S)),ee=[],S=[]},A=e.colX0-3,X=e.colX0+(e.colN-1)*e.colStep+3,y=[];if(E)y.push([A,et[0]-Tt,29.5,Z*10],[et[0],et[1],17.5,90+Z],[et[1]+Tt,X,29.5,Z*10+3]);else for(let i=0;i<5;i++)y.push([A+(X-A)*i/5,A+(X-A)*(i+1)/5,29.5,Z*10+i]);for(let i=0;i<e.colN;i++){const N=e.colX0+i*e.colStep,x=R(),u=E&&p(N);if(!V){g.push({x:N,z:q,...x});continue}(u?S:ee).push({x:N,y:0,z:q,...x});const B=y.find(U=>N>=U[0]&&N<=U[1]);B&&w.push({x:N,y:B[2]-2.2,z:q,col:[1/(.8*.6283),0,nt,0],seed:B[3]+t.rackSalt.store}),i%10===9&&(F(),await a.yield())}F();const z=(i,N,x,u,B)=>{const U=Math.hypot(x-i,u-N),G=(i+x)/2,re=(N+u)/2;if(Math.abs(u-N)<.01){l.box(G,re,q,U,1.3,1.5,Q[0],Q[1]);for(const te of[-1,1])l.box(G,re-.75,q+te*.95,U,.5,.4,pe[0],pe[1],{paint:v(B)})}else{l.rod([i,N,q],[x,u,q],.85,4,Q[0],Q[1],{flat:!0,twist:Math.PI/4});for(const H of[-1,1])l.rod([i,N-.75,q+H*.95],[x,u-.75,q+H*.95],.3,4,pe[0],pe[1],{flat:!0,twist:Math.PI/4,paint:v(B)});const te=30+(e.storeCrown-30-e.ribDeep)*Math.sqrt(Math.max(0,1-(q/(e.storeHalf-e.ribDeep))**2));for(let H=e.storeX0+1.5;H<Math.max(i,x);H+=bo)if(H>Math.min(i,x)){const de=N+(u-N)*(H-i)/(x-i);for(const J of[-1,1])l.rod([H,de-.9,q+J*1.25],[H,te,q+J*1.25],es,4,$[0],$[1],{flat:!0});l.box(H,de-1.05,q,.4,.3,2.9,$[0],$[1])}}};for(const i of y)z(i[0],i[2],i[1],i[2],i[3]);if(V)for(const i of y)for(const N of[.25,.75]){const x=Pe(Math.round((i[0]+(i[1]-i[0])*N-e.colX0)/e.colStep),0,e.colN-1);b.push({x:e.colX0+x*e.colStep,z:q,turn:T>0?Math.PI:0,seed:i[3]+t.rackSalt.store,bed:i[2]})}if(E){const[i,N]=et,x=Tt;z(i-x,29.5,i,17.5,Z*10),z(N,17.5,N+x,29.5,Z*10+3)}l.rod([X,29.5,q],[X+12,29.5,T*12],.85,4,Q[0],Q[1],{flat:!0,twist:Math.PI/4})}const O=Mt(M,f,w);O.geometry.getAttribute("aMeta").array.forEach((T,Y,q)=>{Y%2===1&&(q[Y]=-1)}),c.add(O);{const T=ds(),Y=b.length,q=new Float32Array(Y*2),V=new r.Matrix4,E=new r.InstancedMesh(T,fs(n),Y);b.forEach((Z,ee)=>{q[ee*2]=Z.seed,q[ee*2+1]=Z.bed,E.setMatrixAt(ee,V.makeRotationY(Z.turn).setPosition(Z.x,0,Z.z))}),T.setAttribute("aRack",new r.InstancedBufferAttribute(q,2)),E.instanceMatrix.needsUpdate=!0,E.computeBoundingSphere(),E.userData={kind:"instanced",reach:jt},c.add(E)}if(g.length){const T=is(),Y=g.length,q=new Float32Array(Y*4),V=new Float32Array(Y*2),E=new r.Matrix4,Z=new r.InstancedMesh(T,rs(n),Y),ee=S=>Math.round(S*dt)/dt;g.forEach((S,F)=>{q.set(S.col.map(ee),F*4),V[F*2]=ee(S.seed),V[F*2+1]=e.storeWheels,Z.setMatrixAt(F,E.makeTranslation(S.x,0,S.z))}),T.setAttribute("aCol",new r.InstancedBufferAttribute(q,4)),T.setAttribute("aMeta",new r.InstancedBufferAttribute(V,2)),Z.instanceMatrix.needsUpdate=!0,Z.computeBoundingSphere(),Z.userData={kind:"instanced",reach:0},c.add(Z)}t.storeIron=l}const W=e.fly,Ze=32,Le={x:W.x+W.R+3.5,r:2.5,top:24},ut=3.8,pt=4.4,Do=1.5,Xe=W.x-W.R-3,ha=5.5,Qt=3;function It(t,c,n,a,o){for(let d=0;d<8;d++)for(let L=0;L<6;L++){const m=(v,C)=>{const _=v/8*Math.PI*2,O=C/6*Math.PI,T=[Math.sin(O)*Math.cos(_),Math.cos(O),Math.sin(O)*Math.sin(_)];return[[c[0]+T[0]*n,c[1]+T[1]*n,c[2]+T[2]*n],T]},[M,k]=m(d,L),[f,p]=m(d+1,L),[l,g]=m(d+1,L+1),[w,b]=m(d,L+1);L>0&&t.tri(M,f,l,a,o,void 0,[k,p,g]),L<5&&t.tri(M,l,w,a,o,void 0,[k,g,b])}}const fa=["#1d5a45","#34506b","#8a816c","#17382f"];function ps(t){const{scene:c,shared:n}=t,a=t.storeIron,o=Oe(n),s=t.RNG.drive,R=s.range(0,W.turn),d=s(),L=fa[Math.floor(d*fa.length)];n.uWheel.value=R;const m=[be(L,1.5),[0,.8]],M=[be(L,2.3),[0,.8]],k=[be("#d9b45a"),[1,.8]],f=[be("#c8d0da"),[1,.9]],p=Me(),l=48,g=W.R,w=g-2.3,b=1,v=(y,z,i,N,x)=>{for(let u=0;u<l;u++){const B=u/l*Math.PI*2,U=(u+1)/l*Math.PI*2,G=[0,0,x];p.quad([Math.cos(B)*y,Math.sin(B)*y,i],[Math.cos(B)*z,Math.sin(B)*z,i],[Math.cos(U)*z,Math.sin(U)*z,i],[Math.cos(U)*y,Math.sin(U)*y,i],N[0],N[1],void 0,[G,G,G,G])}};for(let y=0;y<l;y++){const z=y/l*Math.PI*2,i=(y+1)/l*Math.PI*2,N=Math.cos(z),x=Math.sin(z),u=Math.cos(i),B=Math.sin(i),U=(G,re,te,H)=>[G*te,re*te,H];p.quad(U(N,x,g,b),U(N,x,g,-b),U(u,B,g,-b),U(u,B,g,b),f[0],f[1],void 0,[[N,x,0],[N,x,0],[u,B,0],[u,B,0]]),p.quad(U(N,x,w,-b),U(N,x,w,b),U(u,B,w,b),U(u,B,w,-b),m[0],m[1],void 0,[[-N,-x,0],[-N,-x,0],[-u,-B,0],[-u,-B,0]])}for(const y of[-1,1])v(w,g-.5,y*b,M,y),v(g-.5,g-.2,y*(b+.04),k,y),v(g-.2,g,y*b,f,y);for(let y=0;y<8;y++){const z=y/8*Math.PI*2,i=Math.cos(z),N=Math.sin(z);p.rod([i*1.4,N*1.4,0],[i*(w+.05),N*(w+.05),0],1,4,m[0],m[1],{flat:!0,r2:.62});for(const x of[-1,1])p.rod([i*1.6,N*1.6,x*.62],[i*(w-.1),N*(w-.1),x*.42],.24,4,M[0],M[1],{flat:!0});It(p,[i*2.3,N*2.3,1.05],.3,k[0],k[1]),p.rod([i*1.15,N*1.15,1.3],[i*1.15,N*1.15,1.5],.14,6,f[0],f[1],{capB:!0})}p.rod([0,0,-1.3],[0,0,1.3],1.7,16,m[0],m[1],{capA:!0,capB:!0}),p.rod([0,0,1.3],[0,0,1.75],.75,12,k[0],k[1],{capB:!0}),p.rod([4,0,1],[4,0,1.9],.4,8,pe[0],pe[1],{capB:!0});const C=new r.Mesh(p.build(),o);C.position.set(W.x,W.y,W.z),C.userData={kind:"spinZ",R:g+.1,half:2};const _=Me();_.box(0,0,0,30,1.9,.9,m[0],m[1]),_.box(0,0,0,3.2,3.2,1.1,M[0],M[1]),_.box(0,1.05,0,29,.2,1.1,M[0],M[1]);for(const y of[-1,1])_.rod([y*15,0,-.8],[y*15,0,.8],.45,8,pe[0],pe[1],{capA:!0,capB:!0}),It(_,[y*7.5,1.3,0],.28,k[0],k[1]);_.rod([0,0,-.7],[0,0,.7],.6,10,k[0],k[1],{capA:!0,capB:!0});const O=new r.Mesh(_.build(),o);O.position.set(W.x,Ze,W.z),O.userData={kind:"swing",reach:2.6};const T=(()=>{const y=Me();return y.rod([0,0,0],[0,1,0],.22,6,pe[0],pe[1],{}),y.build()})(),Y=new r.Mesh(T,o),q=new r.Mesh(T,o);Y.userData={kind:"swing",reach:9},q.userData={kind:"swing",reach:3};for(const y of[-1,1]){const z=W.z+y*ut,i=W.x;a.box(i,.25,z,2*pt+2.8,.5,2.4,m[0],m[1],{skip:"-y"});for(const u of[-1,1]){a.rod([i+u*pt,.5,z],[i+u*.9,W.y-1,z],.85,4,m[0],m[1],{flat:!0,twist:Math.PI/4});for(const B of[-1,1])a.rod([i+u*(pt+.8),.5,z+B*.8],[i+u*(pt+.8),.85,z+B*.8],.2,6,f[0],f[1],{capB:!0})}a.box(i,W.y/2-.5,z,pt+.9,.6,.8,M[0],M[1]),a.box(i,W.y,z,3,2.4,1.8,M[0],M[1]),a.rod([i,W.y,z-1],[i,W.y,z+1],.9,12,k[0],k[1],{capA:!0,capB:!0}),It(a,[i,W.y+1.5,z],.32,k[0],k[1]);const N=W.y+1.2,x=Ze-1;a.rod([i,N,z],[i,N+.7,z],1.35,12,M[0],M[1],{capB:!0}),a.rod([i,N+.7,z],[i,x-.8,z],1,12,m[0],m[1],{r2:.78}),a.rod([i,x-.8,z],[i,x-.5,z],.92,12,k[0],k[1],{capA:!0,capB:!0}),a.rod([i,x-.5,z],[i,x,z],1.25,12,M[0],M[1],{capA:!0,capB:!0}),a.box(i,Ze,z,2.2,2,1.5,M[0],M[1]),It(a,[i,Ze+1.2,z],.3,k[0],k[1])}a.rod([W.x,W.y,W.z-ut-1.3],[W.x,W.y,W.z+ut+1.3],.55,10,pe[0],pe[1],{capA:!0,capB:!0}),a.rod([W.x,Ze,W.z-ut-1],[W.x,Ze,W.z+ut+1],.45,8,pe[0],pe[1],{capA:!0,capB:!0}),a.rod([Le.x,0,W.z],[Le.x,Le.top,W.z],Le.r,20,m[0],m[1],{capB:!0});for(const y of[1,Le.top/3,2*Le.top/3,Le.top-.5])a.rod([Le.x,y-.3,W.z],[Le.x,y+.3,W.z],Le.r+.2,20,k[0],k[1],{capA:!0,capB:!0});for(const y of[-1,1])a.box(W.x,.45,W.z+y*(Do+.3),2*g+2.6,.9,.6,$[0],$[1]),a.box(W.x+y*(g+1),.45,W.z,.6,.9,2*Do,$[0],$[1]);a.rod([Le.x,Ne[1]-2,W.z+Le.r-.2],[Ne[0],Ne[1]-2,Ne[2]],.35,8,$[0],$[1],{}),a.rod([Ne[0],Ne[1]-2.2,Ne[2]],[Ne[0],Ne[1]-.1,Ne[2]],.45,8,$[0],$[1],{capB:!0});const V=Me();V.rod([0,0,0],[0,16,0],.22,6,pe[0],pe[1],{capB:!0});for(const y of[-1,1])V.rod([0,15,0],[y*2.6,11.4,0],.12,6,pe[0],pe[1],{}),It(V,[y*2.6,11.2,0],.75,k[0],k[1]),V.rod([y*2.6,11.2,0],[0,9,0],.1,6,pe[0],pe[1],{});const E=W.z+ha,Z=new r.Mesh(V.build(),o);Z.position.set(Xe,Qt,E),Z.userData={kind:"spin",R:3.4,y0:0,y1:16},a.box(Xe,.2,E,4.4,.4,4.4,m[0],m[1],{skip:"-y"});for(const y of[-1,1])for(const z of[-1,1])a.rod([Xe+y*1.8,.4,E+z*1.8],[Xe+y*1.8,.7,E+z*1.8],.18,6,f[0],f[1],{capB:!0});a.rod([Xe,.4,E],[Xe,Qt-.3,E],1.5,10,m[0],m[1],{r2:.9}),a.rod([Xe,Qt-.3,E],[Xe,Qt,E],1.05,10,k[0],k[1],{capA:!0,capB:!0});{const y=e.crossX1-.12,z=-(ve+1.2),i=-Ke,N=Math.round((z-i)/6);a.box(y,15.5,(z+i)/2,.24,29,z-i,m[0],m[1],{skip:"-y",paint:[6,3,3,0]});for(let x=0;x<=N;x++)a.box(y-.3,15,z+(i-z)*x/N,.6,30,.9,$[0],$[1],{skip:"-y"});a.box(y-.35,29.4,(z+i)/2,.7,1.2,z-i,$[0],$[1]),a.box(y-.3,1,(z+i)/2,.6,2,z-i,$[0],$[1],{skip:"-y"}),a.rod([y-.35,Le.top,z],[y-.35,Le.top,i],.18,6,k[0],k[1],{})}c.add(C,O,Y,q,Z);const ee=new r.Vector3(0,1,0),S=new r.Vector3,F=new r.Vector3,A=new r.Vector3,X=(y,z,i)=>{A.subVectors(i,z);const N=A.length();y.position.copy(z),y.scale.set(1,N,1),y.quaternion.setFromUnitVectors(ee,A.divideScalar(N))};t.drivePhase=R,t.drivePaint={PA:m,PAL:M,bright:f},t.updates.push((y,z)=>{const i=(z*n.uTempo.value+R)/W.turn*Math.PI*2,N=-.157*Math.sin(i);C.rotation.z=i,O.rotation.z=N,Z.rotation.y=i*5,X(Y,S.set(W.x+4*Math.cos(i),W.y+4*Math.sin(i),W.z+1.6),F.set(W.x-15*Math.cos(N),Ze-15*Math.sin(N),W.z+1.6)),X(q,S.set(Le.x,Le.top,W.z),F.set(W.x+15*Math.cos(N),Ze+15*Math.sin(N),W.z))})}const Jt=1.5,eo=kt+15+2.5,da=[28,24],to=1.2,Io=1.8,ms=45,Po=4;function vs(){const t=(S,F,A)=>new r.Vector3(S,F,A),c=t(W.x,W.y,W.z),n=W.R+.06,a=[],o=(S,F,A,X,y,z)=>{const i=F.clone().sub(S),N=i.dot(X),x=i.dot(y),u=Math.hypot(N,x),B=Math.atan2(x,N)+z*Math.asin(A/u),U=Math.sqrt(u*u-A*A);return S.clone().addScaledVector(X,U*Math.cos(B)).addScaledVector(y,U*Math.sin(B))},s=t(1,0,0),R=t(0,1,0),d=t(0,0,1),L=t(eo,da[0],W.z),m=t(eo,da[1],W.z),M=t(eo,ms,0),k=o(L,c,n,s,R,1),f=o(m,c,n,s,R,-1),p=o(L,M,Io,d,R,1),l=o(m,M,Io,d,R,-1),g=(S,F,A,X)=>{const y=S.clone().sub(F).normalize(),z=A.clone().sub(F).normalize(),i=Math.acos(Pe(y.dot(z),-1,1)),N=to/Math.tan(i/2),x=F.clone().addScaledVector(y.clone().add(z).normalize(),to/Math.sin(i/2)),u=F.clone().addScaledVector(y,N),B=F.clone().addScaledVector(z,N),U=y.clone().cross(z).normalize();return U.dot(X)<0&&U.negate(),{O:x,A:u,B,n:U,turn:Math.PI-i,u:y.clone().negate()}},w=g(k,L,p,d),b=s.clone().multiplyScalar(w.n.dot(s)<0?-1:1),v=g(l,m,f,b),C=(S,F)=>a.push({p:S.clone(),b:F.clone().normalize()}),_=(S,F,A,X,y)=>{for(let z=1;z<y;z++){const i=z/y;C(S.clone().lerp(F,i),A.clone().lerp(X,i))}},O=(S,F,A,X,y,z)=>{const i=F.clone().sub(S);for(let N=0;N<=z;N++)C(S.clone().add(i.clone().applyAxisAngle(A,X*N/z)),y)},T=S=>S.n.clone().multiplyScalar(Math.sign(S.n.clone().cross(S.A.clone().sub(S.O)).dot(S.u))||1),Y=Math.atan2(f.y-c.y,f.x-c.x),q=Math.atan2(k.y-c.y,k.x-c.x),V=((q-Y)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);O(c,f,d,V,d,36),_(k,w.A,d,w.n,7),O(w.O,w.A,T(w),w.turn,w.n,5),_(w.B,p,w.n,b,9);const E=Math.atan2(p.y-M.y,p.z-M.z),Z=Math.atan2(l.y-M.y,l.z-M.z),ee=((E-Z)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);return O(M,p,s,ee,b,10),_(l,v.A,b,v.n,9),O(v.O,v.A,T(v),v.turn,v.n,5),_(v.B,f,v.n,d,7),{pts:a,G1:w,G2:v,Lc:M,spin:T,bL:b}}function xs(t){return new r.ShaderMaterial({uniforms:{...t},side:r.DoubleSide,vertexShader:`
      varying vec3 vW, vN; varying vec2 vUv;
      void main(){ vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix)*normal); vUv = uv; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
      varying vec3 vW, vN; varying vec2 vUv;
      ${Ee}
      ${Ce}
      void main(){
        vec3 N = normalize(vN); N = gl_FrontFacing ? N : -N;
        // metres along the belt, less the way the rim has gone by the wheel's own clock
        float s = vUv.x - ${h(W.R)}*6.2831853*(uTime*uTempo + uWheel)/${h(W.turn)};
        float k = fract(s/${h(Po)}), g = fwidth(vUv.x)/${h(Po)};
        float lap = smoothstep(0., .015, k)*(1. - smoothstep(.1, .115, k));
        lap = mix(lap, .1, smoothstep(.04, .12, g));
        float edge = smoothstep(.7, .78, abs(vUv.y))*(1. - smoothstep(.9, .96, abs(vUv.y)));
        float stitch = mix(step(.5, fract(s/.6)), .5, smoothstep(.1, .3, fwidth(vUv.x)/.6))*edge;
        vec3 alb = vec3(.2, .1, .045)*(1. - .45*lap)*(.9 + .2*hash11(floor(s/${h(Po)}))) + vec3(.3, .25, .16)*stitch;
        gl_FragColor = vec4(hazed(shadeDull(alb, N, vW, .25), vW), 1.);
      }`})}function ws(t){const{scene:c,shared:n}=t,a=t.storeIron,{pts:o,G1:s,G2:R,Lc:d,spin:L,bL:m}=vs(),M=o.length,k=[],f=[],p=[],l=[],g=new r.Vector3,w=new r.Vector3;let b=0;for(let A=0;A<=M;A++){const X=o[A%M],y=o[(A+M-1)%M],z=o[(A+1)%M];A>0&&(b+=X.p.distanceTo(y.p)),g.subVectors(z.p,y.p).normalize(),w.crossVectors(g,X.b).normalize();for(const i of[-1,1])k.push(X.p.x+X.b.x*i*Jt/2,X.p.y+X.b.y*i*Jt/2,X.p.z+X.b.z*i*Jt/2),f.push(w.x,w.y,w.z),p.push(b,i);A<M&&l.push(2*A,2*A+1,2*A+2,2*A+1,2*A+3,2*A+2)}const v=new r.BufferGeometry;v.setAttribute("position",new r.BufferAttribute(new Float32Array(k),3)),v.setAttribute("normal",new r.BufferAttribute(new Float32Array(f),3)),v.setAttribute("uv",new r.BufferAttribute(new Float32Array(p),2)),v.setIndex(l),v.computeBoundingSphere(),v.computeBoundingBox();const C=new r.Mesh(v,xs(n));C.userData={kind:"still"},c.add(C);const{PA:_,PAL:O,bright:T}=t.drivePaint,Y=Oe(n),q=(A,X)=>{const y=Me(),z=20;for(let i=0;i<z;i++){const N=i/z*Math.PI*2,x=(i+1)/z*Math.PI*2,u=Math.cos(N),B=Math.sin(N),U=Math.cos(x),G=Math.sin(x),re=A-.28;y.quad([u*A,B*A,X],[u*A,B*A,-X],[U*A,G*A,-X],[U*A,G*A,X],T[0],T[1],void 0,[[u,B,0],[u,B,0],[U,G,0],[U,G,0]]),y.quad([u*re,B*re,-X],[u*re,B*re,X],[U*re,G*re,X],[U*re,G*re,-X],_[0],_[1],void 0,[[-u,-B,0],[-u,-B,0],[-U,-G,0],[-U,-G,0]]);for(const te of[-1,1])y.quad([u*re,B*re,te*X],[u*A,B*A,te*X],[U*A,G*A,te*X],[U*re,G*re,te*X],O[0],O[1],void 0,[[0,0,te],[0,0,te],[0,0,te],[0,0,te]])}for(let i=0;i<4;i++){const N=i/4*Math.PI*2;y.rod([0,0,0],[Math.cos(N)*(A-.2),Math.sin(N)*(A-.2),0],.3,4,_[0],_[1],{flat:!0})}return y.rod([0,0,-X-.15],[0,0,X+.15],.38,8,O[0],O[1],{capA:!0,capB:!0}),y.build()},V=new r.Vector3(0,0,1),E=new r.Quaternion,Z=new r.Quaternion,ee=Jt/2+.12,S=[[s.O,L(s),to-.06],[R.O,L(R),to-.06],[d,new r.Vector3(1,0,0),Io-.06]].map(([A,X,y])=>{const z=new r.Mesh(q(y,ee),Y),i=y+ee;return z.position.copy(A),z.userData={kind:"course",lo:[A.x-i,A.y-i,A.z-i],hi:[A.x+i,A.y+i,A.z+i]},c.add(z),{m:z,base:new r.Quaternion().setFromUnitVectors(V,X),r:y}}),F=[eo,30,-(e.storeHalf-.6)];for(const A of[s,R]){const X=L(A),y=A.O.clone().addScaledVector(X,-ee-.5),z=A.O.clone().addScaledVector(X,ee+.5);a.rod(y.toArray(),z.toArray(),.2,6,pe[0],pe[1],{capA:!0,capB:!0});for(const[i,N]of[[y,-1],[z,1]])a.rod([F[0]+N,F[1],F[2]],i.toArray(),.22,4,$[0],$[1],{flat:!0})}a.box(F[0],F[1]-.1,F[2],3.2,.5,.6,$[0],$[1]),t.updates.push((A,X)=>{const y=(X*n.uTempo.value+t.drivePhase)/W.turn*Math.PI*2*W.R;for(const z of S)Z.setFromAxisAngle(V,y/z.r),z.m.quaternion.copy(z.base).multiply(Z)})}const Ne=[Le.x+2*Le.r,Le.top-17,W.z+Le.r+2.5],oo=2*W.turn,ua=1.15,gs=.75*W.turn;function ys(t){const{scene:c,shared:n}=t,a=t.storeIron,o=Math.PI/180,s=t.rackSalt.drive,R=_e.brass,d=[],L=34,m=1.5,M=28.45,k=3.4,f=.25,p=1.15,l=.15,g=.35,w=30.15+g,b=30.2,v=.3,C=.26,_=(x,u,B,U=!1)=>{const G=M-m+.12,re=Math.sign(u),te=u-re*l;for(const H of[-1,1]){const de=U&&H===-re,J=!B||de?29.55:U?b:w;a.rod([x,0,u+H*3.4],[x,G-1.2,u+H*2.45],.3,4,$[0],$[1],{flat:!0,arris:!!B}),a.box(x,(G-1.2+J)/2,u+H*2.45,.5,J-G+1.2,.3,$[0],$[1],{arris:!!B,skip:de?"+y":""}),de&&a.box(x,(29.55+w)/2,u+H*(2.3+C/2),.5,w-29.55,C,$[0],$[1],{arris:!0,skip:"-y"}),a.box(x,.2,u+H*3.4,1.4,.4,1,Q[0],Q[1],B?{skip:"-y"}:{})}{const de=3.4-13.299999999999999/(G-1.2);a.box(x,14,u,.3,.4,2*de,$[0],$[1],B?{skip:"-z+z"}:{})}if(B){const H=U?v:2.3;a.box(x,30.15+g/2,u+re*(H-2.3)/2,.5,g,H+2.3,$[0],$[1],{skip:"-y-z+z"})}a.rod([x,G,u-2.6],[x,G,u+2.6],.2,6,pe[0],pe[1],B?{}:{capA:!0,capB:!0});for(const H of[-1,1])a.rod([x,G,u+H*2.3],[x,G,u+H*2.62],.42,8,R[0],R[1],{capA:!0,capB:!0});if(B)for(const H of[-1,0,1])d.push({x,y:G,z:te+H*p,col:[1/(m*.6283),0,nt,0],seed:B+H+s})},O=(x,u,B,U=2.325)=>{const G=M-m+.12,re=Math.sign(u),te=u-re*l;for(const H of[-1,1])a.box(x,(G-.5+w)/2,u+H*2.45,.4,w-G+.5,.25,$[0],$[1],{arris:!0});if(a.box(x,30.15+g/2,u+re*(U-2.325)/2,.4,g,U+2.325,$[0],$[1],{skip:"-y-z+z"}),x>e.crossX1+.1&&x<e.archW){const H=e.crossX1+Vt/2+Vt*Math.round((x-e.crossX1-Vt/2)/Vt);for(const de of[-1,1]){const J=u+de*2.3;a.rod([x,30.15,u+de*1.9],[H,Fe+Math.sqrt(ve*ve-J*J)-.3,J],ts,4,$[0],$[1],{flat:!0,arris:!0})}}a.rod([x,G,u-2.6],[x,G,u+2.6],.2,6,pe[0],pe[1],{});for(const H of[-1,1])a.rod([x,G,u+H*2.3],[x,G,u+H*2.62],.42,8,R[0],R[1],{capA:!0,capB:!0});for(const H of[-1,0,1])d.push({x,y:G,z:te+H*p,col:[1/(m*.6283),0,nt,0],seed:B+H+s})},T=e.crossX1,Y=(x,u)=>{const B=x<T&&u>T?T:x,U=Math.max(1,Math.round((u-B)/L)),G=[];for(let re=0;re<=U;re++)G.push(B+(u-B)*re/U);return G},q=(x,u,B)=>{const U=Math.sign(u),G=U*(ve+.3);O(x,u,B,Math.abs(G-u)),a.rod([x,25,G],[x,30.15+g/2,u+U*2.45],.26,4,$[0],$[1],{flat:!0,arris:!0})},V=.18,E=(x,u)=>{const B=Math.sign(u);for(const U of[4,5]){const[G,re]=Nt(U/6*Math.PI/2,B);a.rod([x,30.15,u+(U===4?1:-1)*B*1.8],[x,re-.1,G],V,4,$[0],$[1],{flat:!0,arris:!0})}},Z=(x,u,B,U,G,re)=>{const te=12*U,H=u-x,de=(x+u)/2,J=te-U*f,se=te-U*l;if(H>.1){a.box(de,29.85,J,H,.6,k,Q[0],Q[1],{paint:[6,4.25,3.9,0]});for(const le of[-1,0,1])a.box(de,29.3,se+le*p,H,.5,.9,pe[0],pe[1],{skip:"+y-y"}),a.box(de,M+.3,se+le*p,H,.6,.8,pe[0],pe[1],{skip:"+y",paint:[1,1,G+le+s,1]});const ie=Y(x,u);for(let le=0;le<3&&ie[0]>x;le++){const we=x+(ie[0]-x)*le/3;O(we,te,G),E(we,te)}ie.forEach((le,we)=>{if(le===T&&ie[0]>x?q(le,te,G):_(le,te,G,le===B),we+1<ie.length)for(const P of[1/3,2/3])O(le+(ie[we+1]-le)*P,te,G)})}else _(x,te,0);const me=Math.hypot(B-e.cx,te),fe=Math.atan2(te,B-e.cx)/o,D=6;let ne=[B,29.5,te];for(let ie=1;ie<=D;ie++){const le=ie/D,we=(fe+(re-fe)*le)*o,P=me+(72-me)*le,K=Math.cos(we),j=Math.sin(we),oe=[e.cx+K*P,29.5+(40.2-29.5)*le,e.cz+j*P];if(a.rod(ne,oe,.95,4,Q[0],Q[1],{flat:!0,twist:Math.PI/4}),ie<D){const xe=e.drumR-.5,he=[e.cx+K*xe,oe[1]-4,e.cz+j*xe],I=[e.cx+K*xe,oe[1]-.5,e.cz+j*xe];a.rod(he,[oe[0],oe[1]-.5,oe[2]],.22,4,$[0],$[1],{flat:!0,arris:H>.1}),a.rod(I,[oe[0],oe[1]-.5,oe[2]],.18,4,$[0],$[1],{flat:!0,arris:H>.1})}ne=oe}},ee=e.colX0+(e.colN-1)*e.colStep+15;for(const x of[-1,1])Z(ee,e.archW+6,e.archW+6,x,70+10*x,154*x),Z(e.archE-6,e.archE-6,e.archE-6,x,0,26*x);const S=At({wheels:1,R:.8,depth:.2,pitch:.6,thick:.5,segs:3,capped:!0,bare:!0,foot:0,y0:0}),F=Bt(n,{y0:0}),A=new r.Matrix4,X=new r.Vector3,y=new r.Vector3(0,1,0),z=new r.Vector3,i=new r.Quaternion,N=(x,u,B,U)=>{const G=Mt(S,F,x),re=new r.Vector3(u/.8,B/.5,u/.8);x.forEach((te,H)=>{U(te,z),i.setFromUnitVectors(y,z),G.setMatrixAt(H,A.compose(X.set(te.x,te.y,te.z).addScaledVector(z,-B/2),i,re))}),G.geometry.getAttribute("aMeta").array.forEach((te,H,de)=>{H%2===1&&(de[H]=-1)}),G.instanceMatrix.needsUpdate=!0,G.computeBoundingSphere(),G.userData={kind:"instanced",reach:.1},c.add(G)};N(d,m,.75,(x,u)=>u.set(0,0,1)),N(t.wallPins,Kt,.6,(x,u)=>u.set(-Math.cos(x.deg*o),0,-Math.sin(x.deg*o)));{a.rod([e.storeX0+1,45,0],[298,45,0],.28,8,pe[0],pe[1],{});for(let H=e.storeX0+8.5;H<298;H+=14)a.rod([H,45,0],[H,47.4,0],.2,4,Q[0],Q[1],{flat:!0});const x=At({wheels:1,R:.8,depth:.2,pitch:.6,thick:.5,segs:3,capped:!1,bare:!0,foot:0,y0:0}),u=[];for(let H=e.storeX0+5;H<298;H+=14)u.push({x:H,y:45,z:0,col:[2.2,H*.37,nt,0],seed:1});const B=Mt(x,Bt(n,{y0:0}),u),U=new r.Matrix4,G=new r.Quaternion().setFromAxisAngle(new r.Vector3(0,0,1),-Math.PI/2),re=new r.Vector3(1.9,1.2,1.9),te=new r.Vector3;u.forEach((H,de)=>B.setMatrixAt(de,U.compose(te.set(H.x-.3,H.y,H.z),G,re))),B.geometry.getAttribute("aMeta").array.forEach((H,de,J)=>{de%2===1&&(J[de]=-2)}),B.instanceMatrix.needsUpdate=!0,B.computeBoundingSphere(),B.userData={kind:"instanced",reach:3.1},c.add(B)}}function bs(t){const c=Pe(Math.round(10*t.detail),5,10),n=2*c,a=new r.BufferGeometry;a.setAttribute("position",new r.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,-1,0,1,1,0,-1,1,0]),3));const o=new Float32Array(n*3),s=t.RNG.drive;for(let m=0;m<n;m++)o[m*3]=Math.floor(m/c)*W.turn+m%c*(.85*W.turn/c)+s.range(0,.3),o[m*3+1]=s.range(-1,1),o[m*3+2]=s.range(-1,1);a.setAttribute("aPuff",new r.InstancedBufferAttribute(o,3));const R=new r.ShaderMaterial({uniforms:{...t.shared,uStroke:{value:t.drivePhase-gs}},transparent:!0,depthWrite:!1,vertexShader:`
      attribute vec3 aPuff;
      uniform float uTime, uTempo, uStroke;
      varying vec2 vQ; varying float vA; varying vec3 vW;
      void main(){
        float age = mod(uTime*uTempo + uStroke - aPuff.x, ${oo.toFixed(1)});
        vec3 c = vec3(${Ne.map(m=>m.toFixed(1)).join(", ")}) + vec3(aPuff.y*.09*age + .5*sin(age*.5 + aPuff.z*3.), ${ua.toFixed(2)}*age, aPuff.z*.07*age);
        float size = .9 + 3.4*(1. - exp(-age*.16));
        float late = fract(aPuff.x/${W.turn.toFixed(1)});
        vA = smoothstep(0., .9, age)*(1. - smoothstep(${(oo*.4).toFixed(1)}, ${oo.toFixed(1)}, age))*mix(.5, .26, late);
        vQ = position.xy;
        vec4 mv = viewMatrix*vec4(c, 1.);
        mv.xy += position.xy*size;
        vW = c;
        gl_Position = projectionMatrix*mv;
      }`,fragmentShader:`
      varying vec2 vQ; varying float vA; varying vec3 vW;
      ${Ee}
      void main(){
        float d = clamp(length(vQ), 0., 1.);
        float a = (1. - d*d)*(1. - d*d)*(1. - d*d)*vA;
        vec3 col = vec3(.86, .89, .94)*(.78 + .22*clamp(vQ.y, -1., 1.)) + uSunCol*.1*sunAt(vW);
        gl_FragColor = vec4(col, a);
      }`}),d=new r.InstancedMesh(a,R,n);d.frustumCulled=!1;const L=ua*oo;d.userData={kind:"medium",centre:[Ne[0],Ne[1]+L/2,Ne[2]],radius:L/2+5},t.scene.add(d)}function As(t){const c=[],n=e.storeFoot+e.storeWheels*e.storeBand,a=e.colX0+(e.colN-1)*e.colStep,o=e.rankZ.slice(0,t.ranks);for(let k=0;k+1<o.length;k++)c.push([[e.colX0,0,o[k]+1.5],[a,n,o[k+1]-1.5],1.3]);c.push([[e.storeX1+2,0,12+4.5],[e.crossX1-2,24,e.storeHalf-2],1]),c.push([[e.loomX0+6,0,Co[0]-3],[vt,xt,e.loomHalf-2],.14]);const s=[],R=[],d=[];for(const[k,f,p]of c){const l=(w,b,v)=>[w?f[0]:k[0],b?f[1]:k[1],v?f[2]:k[2]],g=[[l(0,0,0),l(0,0,1),l(0,1,1),l(0,1,0)],[l(1,0,1),l(1,0,0),l(1,1,0),l(1,1,1)],[l(0,1,0),l(0,1,1),l(1,1,1),l(1,1,0)],[l(1,0,0),l(0,0,0),l(0,1,0),l(1,1,0)],[l(0,0,1),l(1,0,1),l(1,1,1),l(0,1,1)]];for(const w of g)for(const b of[w[0],w[1],w[2],w[0],w[2],w[3]])s.push(b[0],b[1],b[2]),R.push(k[0],k[1],k[2]),d.push(f[0],f[1],f[2],p)}const L=new r.BufferGeometry;L.setAttribute("position",new r.BufferAttribute(new Float32Array(s),3)),L.setAttribute("aLo",new r.BufferAttribute(new Float32Array(R),3)),L.setAttribute("aHi",new r.BufferAttribute(new Float32Array(d),4)),L.computeBoundingSphere(),L.computeBoundingBox();const m=new r.ShaderMaterial({uniforms:{...t.shared},transparent:!0,depthWrite:!1,blending:r.AdditiveBlending,side:r.FrontSide,vertexShader:`
      attribute vec3 aLo; attribute vec4 aHi;
      varying vec3 vW, vLo; varying vec4 vHi;
      void main(){ vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vLo = aLo; vHi = aHi; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
      varying vec3 vW, vLo; varying vec4 vHi;
      ${Ee}
      void main(){
        vec3 ro = cameraPosition, rd = normalize(vW - cameraPosition);
        vec3 inv = 1./(abs(rd) + 1e-5)*sign(rd + 1e-6);
        vec3 ta = (vLo - ro)*inv, tb = (vHi.xyz - ro)*inv;
        vec3 t0 = min(ta, tb), t1 = max(ta, tb);
        float tn = max(max(t0.x, t0.y), max(t0.z, 0.)), tf = min(t1.x, min(t1.y, t1.z));
        float chord = max(tf - tn, 0.);
        vec3 sum = vec3(0.);
        for (int i = 0; i < 10; i++) {
          vec3 p = ro + rd*(tn + chord*(float(i) + .5)/10.);
          vec3 e = min(p - vLo, vHi.xyz - p);
          float thin = smoothstep(0., 1.5, e.x)*smoothstep(0., 1.5, e.z)*smoothstep(0., 3., vHi.y - p.y);
          float dust = .82 + .18*sin(p.x*.37 + uTime*.11 + 2.*sin(p.y*.21 - uTime*.05))*sin(p.z*.9 + p.y*.33 + uTime*.07);
          sum += sunAt(p)*thin*dust;
        }
        // lit dust sends most of its light on the sun's own way: the air is brightest looked through toward the sun
        float toSun = max(dot(rd, uSunDir), 0.);
        vec3 col = uSunCol*(sum/10.)*(1. - exp(-chord*.03))*vHi.w*.22*(.3 + 2.*toSun*toSun*toSun);
        gl_FragColor = vec4(col, 1.);
      }`}),M=new r.Mesh(L,m);M.renderOrder=4,M.userData={kind:"still",air:!0},t.scene.add(M)}function Ms(t){const n=[],a=[],o=e.lanternY,s=e.lanternR,R=18;for(let M=0;M<48;M++){const k=M/48*Math.PI*2,f=(M+1)/48*Math.PI*2,p=Math.cos(k),l=Math.sin(k),g=Math.cos(f),w=Math.sin(f),b=[e.cx+p*R,0,e.cz+l*R],v=[e.cx+g*R,0,e.cz+w*R],C=[e.cx+g*s,o,e.cz+w*s],_=[e.cx+p*s,o,e.cz+l*s];for(const[O,T,Y]of[[b,p,l],[C,g,w],[v,g,w],[b,p,l],[_,p,l],[C,g,w]])n.push(O[0],O[1],O[2]),a.push(T,0,Y)}const d=new r.BufferGeometry;d.setAttribute("position",new r.BufferAttribute(new Float32Array(n),3)),d.setAttribute("normal",new r.BufferAttribute(new Float32Array(a),3)),d.computeBoundingSphere(),d.computeBoundingBox();const L=new r.ShaderMaterial({uniforms:{...t.shared},transparent:!0,depthWrite:!1,blending:r.AdditiveBlending,side:r.FrontSide,vertexShader:`
      varying vec3 vW, vN;
      void main(){ vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vN = normal; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
      varying vec3 vW, vN;
      uniform vec3 uSkyCol, uSunCol; uniform float uTime;
      void main(){
        vec3 V = normalize(vW - cameraPosition);
        float flat_ = max(length(V.xz), .2);
        float chord = 2.*16.5*abs(dot(normalize(vN.xz), V.xz/flat_))/flat_;
        float lit = clamp(chord/40., 0., 1.5);
        float dust = .88 + .12*sin(vW.y*.3 - uTime*.06 + 2.*sin(atan(vN.z, vN.x)*3. + uTime*.04));
        gl_FragColor = vec4((uSkyCol*.4 + uSunCol*.17)*lit*lit*(.2 + .16*vW.y/${o.toFixed(1)})*dust, 1.);
      }`}),m=new r.Mesh(d,L);m.renderOrder=4,m.userData={kind:"still"},t.scene.add(m)}const ao=1.08,pa=3,ma=.45,so=.95,ks=`
// the place s metres along a chain: (across-hall or downward offset, height); a = the loop's parabola (0 for a fall)
vec2 chainAt(float s, float a, float len){
  s = clamp(s, 0., len);
  if (a <= 0.) return vec2(0., -s);
  float h = len*.5, x = s - h, z = x*.8;
  // the place on the parabola whose arc from the lowest point is x: three steps of Newton's rule
  float k = 2.*a;
  z -= (.5*z*sqrt(1. + k*k*z*z) + log(k*z + sqrt(k*k*z*z + 1.))/(2.*k) - x)/sqrt(1. + k*k*z*z);
  z -= (.5*z*sqrt(1. + k*k*z*z) + log(k*z + sqrt(k*k*z*z + 1.))/(2.*k) - x)/sqrt(1. + k*k*z*z);
  z -= (.5*z*sqrt(1. + k*k*z*z) + log(k*z + sqrt(k*k*z*z + 1.))/(2.*k) - x)/sqrt(1. + k*k*z*z);
  return vec2(z, a*z*z);
}
`;function Ls(t,c){if(c=Pe(c,0,t.len),!(t.a>0))return[t.x,t.top-c,t.z];const n=c-t.len/2,a=2*t.a;let o=n*.8;for(let s=0;s<3;s++)o-=(.5*o*Math.sqrt(1+a*a*o*o)+Math.asinh(a*o)/(2*a)-n)/Math.sqrt(1+a*a*o*o);return t.kind===3?[t.x+o,t.low+t.a*o*o+t.slope*o,t.z]:[t.x,t.low+t.a*o*o,t.z+o]}const va=(t,c)=>{const n=2*t;return c*Math.sqrt(1+n*n*c*c)+Math.asinh(n*c)/n},Ss=.3,xa=[.25,.7],Rs=[.6,.65,.74],Es=.07,no=[.807,.738,.565],zs=.38,_s=.45,Ns=.1,Ts=.35,Ds=.03,Is=2.5,Ps="#40557a";function Bs(t){const c=be(t),n=Math.max(c[0],c[1],c[2]),a=n<Ds;if(!a&&(n-Math.min(c[0],c[1],c[2]))/n<Ts)return null;const o=(a?be(Ps):c.map(s=>s*(zs+_s*n)/n)).map((s,R)=>Wo(s,no[R],Ns));return{tone:o,dyed:1,ivoryLace:o[0]>Is*Math.max(o[1],o[2])?1:0}}const mt={tone:no,dyed:0,ivoryLace:0},$s={3:[.5,.3,.2],4:[.4,.3,.2,.1]},Hs=.5,Fs=.125,wa=.375,Cs=.375,Os=.6,tt=2,qs=2;function Xs(t,c,n,a,o,s){const R=c.map(Bs).filter(Boolean),d=R.length,L=$s[d],m=t.hall.shuffle(R.slice()),M=t.hall.shuffle(m.slice(1)),k=S=>{let F=S(),A=0;for(;A<d-1&&(F-=L[A])>=0;)A++;return m[A]},f=[M[2]||M[1],M[0],m[0],M[1]],p=(S,F)=>Math.round(S*(F===tt?Fs:Hs)),l=n[tt]-p(n[tt],tt),g=(S,F,A,X,y)=>{const z=[];for(let i=0;i<F;i++)z.push(i<A?mt:i<A+X?y:k(S));return S.shuffle(z)},w=n.map((S,F)=>{let A=p(S,F);if(F!==tt)for(;S-A>=l;)A++;const X=S-A;return{loops:g(t.curtains[F],S,A,F<qs?X:Math.round(X*Os),f[F]),falls:[f[F],f[F]]}}),b=Math.round(a*wa),v=g(t.walls,a,b,0),C=S=>Math.floor(S/4)-1,_=(S,F)=>{for(let A=s;A<a;A++)if(!v[A].dyed&&(A%4<2?0:1)===F&&(S<0||C(A)===S))return A;return-1};for(let S=tt;S<w.length;S++){let F=_(S,1);F<0&&(F=_(-1,1)),F<0&&(F=_(-1,0)),F>=0?(v[F]=f[S],w[S].falls[1]=mt):S===tt&&(w[S].falls[1]=f[S+1])}const O=(S,F)=>w[S].loops.concat(w[S].falls,v.slice(4*(S+1),4*(S+2))).filter(A=>A===F).length;for(let S=C(s);S<w.length;S++)for(const F of m)if(F!==f[S])for(let A=4*(S+1);A<4*(S+2)&&O(S,F)>=O(S,f[S]);A++)v[A]===F&&(v[A]=f[S]);const T=n.reduce((S,F)=>S+F+2,0)+a+o,Y=w.reduce((S,F)=>S+F.loops.filter(A=>!A.dyed).length,0)+b,q=Pe(Math.round(T*Cs)-Y,Math.ceil(o*wa),o-d),V=o/2,E=[Math.floor(q/2),Math.ceil(q/2)].map((S,F)=>{const A=[];for(let X=1;X<V;X++)A.push(X<S?mt:m[d-1-(F*(V-Math.floor(q/2))+X-S)%d]);return[mt].concat(t.link.shuffle(A))}),Z=S=>E[0].reduce((F,A,X)=>F+(X>0&&A===E[1][1+(X-1+S)%(V-1)]?1:0),0);let ee=0;for(let S=1;S<V-1;S++)Z(S)<Z(ee)&&(ee=S);return{curtains:w,wall:v,link:E[0].concat([mt],E[1].slice(1+ee),E[1].slice(1,1+ee))}}function Us(t){return new r.ShaderMaterial({uniforms:{...t},side:r.DoubleSide,vertexShader:`
      attribute vec4 aA, aB, aDye; attribute vec3 aC;
      varying vec3 vW, vN; varying vec2 vUv; varying vec2 vId; varying vec4 vDye;
      ${Ee}
      ${ks}
      void main(){
        vec3 st = chainStep(uTime*uTempo, aB.z, aB.w, aC.z);
        float s = (aC.x + st.x + position.y)*${ao.toFixed(2)};
        vec2 pt = chainAt(s, aB.x, aB.y), p2 = chainAt(s + .05, aB.x, aB.y);
        vec2 tg = p2 - pt; tg = length(tg) > 1e-5 ? normalize(tg) : vec2(0., -1.);
        float u = clamp(s/aB.y, 0., 1.);
        float swing = ${ma.toFixed(2)}*exp(-st.z*1.8)*sin(st.z*5.)*4.*u*(1. - u);
        float lx = position.x*${pa.toFixed(1)};
        vec3 w, tx, ty;
        if (aA.w < .5) { w = vec3(aA.x + lx + swing, aA.y + pt.y, aA.z + pt.x); tx = vec3(1., 0., 0.); ty = vec3(0., tg.y, tg.x); }
        else if (aA.w < 1.5) { w = vec3(aA.x + lx, aA.y + pt.y, aA.z + swing); tx = vec3(1., 0., 0.); ty = vec3(0., -1., 0.); }
        else if (aA.w < 2.5) { w = vec3(aA.x + swing, aA.y + pt.y, aA.z + lx); tx = vec3(0., 0., 1.); ty = vec3(0., -1., 0.); }
        else {
          // a run along the hall: the loop's span lies along x on a line that rises by (aA.w - 3) a metre
          float rise = aA.w - 3.;
          w = vec3(aA.x + pt.x, aA.y + pt.y + rise*pt.x, aA.z + lx); tx = vec3(0., 0., 1.); ty = normalize(vec3(tg.x, tg.y + rise*tg.x, 0.));
        }
        vW = w; vN = normalize(cross(tx, ty));
        vUv = vec2(lx, position.y*${ao.toFixed(2)}); vId = vec2(aC.x - st.y, aC.y); vDye = aDye;
        gl_Position = projectionMatrix*viewMatrix*vec4(w, 1.);
      }`,fragmentShader:`
      varying vec3 vW, vN; varying vec2 vUv; varying vec2 vId; varying vec4 vDye;
      ${Ee}
      ${Ce}
      ${Ba}
      void main(){
        // the picture's grain on the card, in metres: holes finer than it are not cut but go to the card's mean tone
        float grain = max(fwidth(vUv.x), fwidth(vUv.y));
        vec3 N = normalize(vN); N = gl_FrontFacing ? N : -N;
        float id = floor(vId.x + .5), cs = floor(vId.y*8. + .5)/8.;
        float cord = 1. - smoothstep(.06, .1, abs(abs(vUv.x) - 1.25));
        if (vUv.y > 1. && cord < .5) discard;
        vec2 g = vec2(vUv.x + 1.5, vUv.y)/.25, cell = floor(g), cf = fract(g) - .5;
        float inField = step(.5, cell.x)*step(cell.x, 10.5)*step(vUv.y, 1.);
        float pierced = step(.5, hash21(cell + vec2(id*7.13, cs*3.7)))*inField;
        float hole = pierced*(1. - smoothstep(.26, .32, length(cf)));
        // THE HOLES BY THE PICTURE'S GRAIN (metres of card under a pixel). Near (a hole five grains across and more)
        // a hole is cut. Farther it is not cut but stands as a ROUND dark mark of its own size, its rim softened by
        // the grain (never a dark square). Before a row of holes is two and a half grains apart the marks go to
        // their mean: the card is then one even pale tone (the same tone the marks average to, so no card's tone
        // changes as it goes over).
        float fine = smoothstep(.022, .04, grain), even = smoothstep(.05, .1, grain);
        if (hole > .5 && fine < .5) discard;
        float soft = max(grain/.25, .02), mark = pierced*(1. - smoothstep(.36 - soft, .36 + soft, length(cf)));
        // (each card is its own pasteboard, paler or deeper than the next, by its chain's number and its own
        // place in the chain: so a chain's step is seen as far as a card is, when every card takes the next one's place)
        // THE CHAIN'S PASTEBOARD (aDye: its tone; its fourth number 0 ivory, 1 dyed, 3 dyed with ivory laces)
        float dyed = step(.5, vDye.w), ivoryLace = step(2.5, vDye.w), pv = max(vDye.r, max(vDye.g, vDye.b));
        vec3 alb = vDye.rgb*(.8 + .34*hash11(id*1.31 + cs));
        // (where a hole is not cut its place stands as a dark mark, 0.78 of the card's tone taken off there, so that
        // a card reads as a punched card and its chain's step is seen from as far as its holes' rows are told
        // apart; where the marks have gone to their mean the whole card stands 0.16 darker)
        alb *= 1. - mix(.78*mark, .16, even)*fine;
        // (a card's own edge: the pasteboard's cut rim stands a little darker all round it, as far as it can be told)
        alb *= 1. - .22*(1. - smoothstep(0., .045 + grain, min(min(vUv.y, 1. - vUv.y), 1.5 - abs(vUv.x))))*(1. - even)*step(vUv.y, 1.);
        // (the card as the sun comes through it: its own colour with its marks and rim. West of the Cards' west
        // wall a dyed card's is brought to the ivory's value, its hue kept, and less and less so over the 8 m east
        // of that wall: see BEFORE THE LINK'S GLASS)
        float glassed = dyed*(1. - smoothstep(${h(e.cardX0)}, ${h(e.cardX0+8)}, vW.x));
        vec3 thru = alb*mix(1., ${h(Math.max(...no))}/max(pv, .02), glassed);
        float stitch = cord*step(abs(vUv.y - .5), .5)*(step(vUv.y, .09) + step(.91, vUv.y));
        vec3 lace = mix(vec3(.6, .03, .05), vec3(${no.join(", ")}), ivoryLace);
        alb = mix(alb, lace, max(stitch, cord*step(1., vUv.y))); thru = mix(thru, lace, max(stitch, cord*step(1., vUv.y)));
        vec3 col = shadeDull(alb, N, vW, .15);
        // THE SHADE SIDE (the Cards' hall and the link, west of the Loom hall's west wall): where the sun does not
        // strike it, ivory pasteboard keeps CARD_SHADE of the hall's fill, so a pale card's shade side stands well
        // under its lit side, and cooler. A dyed pasteboard is deep of itself and takes the hall's fill whole (its
        // shade side is a deep tone, never a dark shape). Under the Loom hall's ridge of glass the runs to the
        // loom's head hang in the sky's whole light.
        float west = 1. - smoothstep(${h(e.loomX0-4)}, ${h(e.loomX0+4)}, vW.x);
        vec3 keep = mix(vec3(1.), vec3(${Rs.join(", ")}), west*(1. - dyed)*(1. - clamp(gSun.g*max(dot(N, uSunDir), 0.)*2., 0., 1.)));
        col -= alb*fillAt(N, vW)*(1. - keep);
        // the morning sun on pasteboard is warm
        col *= 1. + vec3(.07, .01, -.09)*clamp(gSun.g*.4, 0., 1.)*max(dot(N, uSunDir), 0.);
        // PASTEBOARD LETS A SHARE OF THE SUN THROUGH: the face turned from the sun glows warm where the sun strikes
        // the card's other face (so a loop seen from under and a fall seen from its shaded side stand as lit ivory
        // with their holes dark or bright in them, never as a dark shape)
        // BEFORE THE LINK'S GLASS (the falls west of the Cards' west wall) as much of the sun comes through a dyed
        // pasteboard as through an ivory one, and in the dye's own hue (thru: the dyed card's colour at the ivory's
        // value): so a dyed fall with the sun behind it stands as lit pasteboard of its own dye, held under its own
        // top as its sunlit face is (see A CARD STAYS UNDER WHITE), and never as a dark slab
        col += thru*gSun*vec3(1., .92, .76)*max(-dot(N, uSunDir), 0.)*${h(Ss)};
        // FAR CARDS GO TO AN EVEN TONE: where the picture's grain on a card is coarser than a hole's row (a card far
        // off, or seen along its face), its sunlit and shaded tones go to one even tone of its pasteboard in the
        // hall's fill (with FAR_SUN of the sun west of the Loom hall, where the shade side is the deeper), so that
        // far chains never stand as a lattice of thin bright streaks
        col = mix(col, alb*(fillAt(N, vW)*keep + uSunCol*mix(.04, ${h(Es)}, west)), smoothstep(${h(xa[0])}, ${h(xa[1])}, grain)*.85);
        // A CARD STAYS UNDER WHITE: pasteboard in the full sun keeps its tone, so that its holes and laces read on
        // the sunlit loops: a soft shoulder on its lit colour from a knee up toward a top it never reaches (the
        // part's PASTE: ivory's, a dyed pasteboard's by its own tone's value, and under the Loom hall's ridge)
        float knee = mix(${h(rt.roof[0])}, mix(${h(rt.knee)}, ${h(rt.dyeKnee)}*pv, dyed), west), top = mix(${h(rt.roof[1])}, mix(${h(rt.top)}, ${h(rt.dyeTop)}*pv, dyed), west);
        col = underTop(col, knee, top);
        gl_FragColor = vec4(hazed(col, vW), 1.);
      }`})}function Gs(t){return new r.ShaderMaterial({uniforms:{...t},vertexShader:`
      attribute vec3 aStep;
      varying vec3 vW, vN, vL;
      ${Ee}
      void main(){
        vec3 st = chainStep(uTime*uTempo, aStep.x, aStep.y, aStep.z);
        float a = (st.y + st.x)*1.5707963, c = cos(a), s = sin(a);
        vec3 p = position, n = normal;
        p.yz = vec2(c*p.y - s*p.z, s*p.y + c*p.z); n.yz = vec2(c*n.y - s*n.z, s*n.y + c*n.z);
        vec4 w = modelMatrix*instanceMatrix*vec4(p, 1.);
        vW = w.xyz; vN = normalize(mat3(modelMatrix)*mat3(instanceMatrix)*n); vL = position;
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:`
      varying vec3 vW, vN, vL;
      ${Ee}
      ${Ce}
      void main(){
        vec3 N = normalize(vN);
        float edge = smoothstep(.46, .6, max(abs(vL.y), abs(vL.z)))*step(abs(vL.x), 1.69);
        vec3 alb = mix(vec3(.39, .2, .075), vec3(.12, .05, .02), edge);
        alb = mix(alb, vec3(.5, .42, .3), step(1.69, abs(vL.x))*.0 + (1. - smoothstep(.03, .05, abs(abs(vL.x) - 1.25)))*.5);
        vec3 col = shadeDull(alb, N, vW, .4);
        gl_FragColor = vec4(hazed(col, vW), 1.);
      }`})}function Ws(t){const{scene:c,shared:n}=t,a=t.RNG.cards,o=t.RNG.falls,s=Me(),R=Pe(Math.round(5*t.vary.density),4,6),d=14.8,L=e.cardHalf-e.galDeep-.6;n.uAbreast.value=R;const m=a.shuffle([{tiers:[35,17]},{tiers:[44,35,17],backed:1},{tiers:[44,17]}]),M=[m[0],m[1],{tiers:[44,35]},m[2]],k=[],f=[],p=oa,l=aa,g=Ro,w=sa,b=l-so,v=[];for(let P=w;P<e.cardX0-2;P+=g)v.push(P);const C=20,_=4*(1+Math.ceil(($e[1]+lt+5-600)/40)),O=Xs(t.RNG.dye,t.cloth,M.map(P=>P.tiers.length*R),C,2*v.length,_);let T=0,Y=0;const q=t.floorMat.uniforms,V=(P,K,j)=>q.uPaste.value[P].set(K.tone[0],K.tone[1],K.tone[2],j),E=(P,K,j,oe,xe,he)=>s.box(P,oe/2,K,j,oe,xe,he.dyed?he.tone:_e.ivory[0],_e.ivory[1],{skip:"-y",paint:[13,.09,xe>j?K:P,(xe>j?1:0)+2*he.ivoryLace+4*he.dyed]}),Z=P=>{const K=P.range(.8,1.6);return[K,P.range(0,K)]},ee=(P,K)=>K?1+P.int(0,11):0;M.forEach((P,K)=>{const j=$e[K];let oe=0;for(const he of P.tiers)for(let I=0;I<R;I++){const ae=j+(I-(R-1)/2)*4,ce=he+2.45,ue=a.range(Ct[he][0],Ct[he][1]),ye=(ce-ue)/(d*d),[ze,Re]=Z(a),Ae=ee(a,P.backed?!0:a.chance(.12)),Se=O.curtains[K].loops[oe++];k.push({kind:0,x:ae,z:0,low:ue,top:ce,a:ye,len:va(ye,d),period:ze,phase:Re,backed:Ae,seed:a.range(1,60),paste:Se}),he===P.tiers[P.tiers.length-1]&&(V(ra+K*6+I,Se,ue),q.uLoopTop.value.setComponent(K,ce));for(const ge of[-1,1])f.push({x:ae,y:ce-.72,z:ge*L,along:"x",period:ze,phase:Re,backed:Ae});(he===35||he===P.tiers[0]&&!P.tiers.includes(35))&&n.uDots.value[K*6+I].set(ze,Re,Ae)}const xe=j+R*4/2+4;s.box(xe,51.6,0,.5,1.6,2*e.cardHalf,Q[0],Q[1]),s.box(xe,50.4,0,.3,.3,2*e.cardHalf,$[0],$[1]);for(const he of[-1,1]){const[I,ae]=Z(o),ce=o.range(4,5.4),ue=O.curtains[K].falls[he<0?0:1];k.push({kind:2,x:xe-.62,z:he*8,top:49.6,a:0,len:49.6-ce,period:I,phase:ae,backed:0,seed:o.range(1,60),paste:ue}),f.push({x:xe,y:49.6,z:he*8,along:"z",period:I,phase:ae,backed:0}),E(xe-.8,he*8,1.5,ce,3.2,ue),V(ia+K*2+(he<0?0:1),ue,ce)}});for(let P=-1;P<4;P++)for(const K of[-1,1])for(const j of[-4,4]){const oe=600+40*P+j+o.range(-1,1),xe=o.pick([26,35,44]),he=xe+1.7,I=o.range(3,5),[ae,ce]=Z(o),ue=ee(o,o.chance(.2)),ye=O.wall[T++];k.push({kind:1,x:oe,z:K*(L-.62),top:he,a:0,len:he-I,period:ae,phase:ce,backed:ue,seed:o.range(1,60),paste:ye}),f.push({x:oe,y:he,z:K*L,along:"x",period:ae,phase:ce,backed:ue}),E(oe,K*(L-.8),3.2,I,1.5,ye),V(Eo+T-1,ye,oe),q.uWallAt.value[T-1].set(he,I)}{const P=[17,26,35,44].map(he=>he+1.7-so),K=e.cardX0,j=e.cardX1,oe=(K+j)/2,xe=50+(e.cardHigh-50)*(e.cardHalf-L)/e.cardHalf-.75;for(const he of[-1,1]){for(const I of P)s.box(oe,I-.16,he*(L+.05),j-K,.32,.36,$[0],$[1]);s.box(oe,xe,he*L,j-K,.3,.3,ht[0],ht[1],{paint:[7,.3,0,0]});for(let I=K+ct;I<j;I+=ct)s.box(I,(xe+P[0])/2-.2,he*(L+.3),.22,xe-P[0]+.4,.1,$[0],$[1])}for(const he of f)if(he.along==="x"&&Math.abs(Math.abs(he.z)-L)<.01)for(const I of[-1,1])s.box(he.x+I*1.82,he.y-so/2+.12,he.z,.12,so+.24,.5,$[0],$[1],{skip:"-y+y"})}for(const P of[-1,1]){s.box((e.archE+e.cardX0)/2,b-.25,P*p,e.cardX0-e.archE,.5,.5,Q[0],Q[1]);for(const K of v){const j=l,oe=o.range(3,5),[xe,he]=Z(o),I=ee(o,o.chance(.2)),ae=O.link[Y++];k.push({kind:2,x:K-.62,z:P*p,top:j,a:0,len:j-oe,period:xe,phase:he,backed:I,seed:o.range(1,60),paste:ae}),f.push({x:K,y:j,z:P*p,along:"z",period:xe,phase:he,backed:I}),E(K-.8,P*p,1.5,oe,3.2,ae),V(la+Y-1,ae,oe),s.box(K,b-.15,P*p,.3,.3,3.9,$[0],$[1]);for(const ce of[-1,1])s.box(K,b+.45,P*p+ce*1.82,.5,.9,.12,$[0],$[1],{skip:"-y"});s.rod([K+g/2,b,P*p],[K+g/2,30+Math.sqrt(225-p*p)-.3,P*p],.12,4,Q[0],Q[1],{flat:!0})}}const S=t.RNG.head,[F,A]=Z(S),X=2,y=e.loomHigh,z=700+R*4/2+4,i=[[z,53.2],[e.loomX0+.6,53.6]];for(const P of[3,6,9]){const K=e.loomX0+4+Ve*P;i.push([K,53.6+(Ge+.75-53.6)*(K-e.loomX0-.6)/(Ue-e.loomX0-.6)])}i.push([Ue,Ge+.75]);for(const P of[-5,0,5]){const K=S.range(1,60);for(let j=0;j+1<i.length;j++){const[oe,xe]=i[j],[he,I]=i[j+1],ae=(he-oe)/2,ce=X/(ae*ae);k.push({kind:3,x:(oe+he)/2,z:P,low:(xe+I)/2-X,top:Math.max(xe,I),a:ce,len:va(ce,ae),slope:(I-xe)/(he-oe),period:F,phase:A,backed:0,seed:K})}k.push({kind:2,x:Ue+.9,z:P,top:Ge,a:0,len:5.6,period:F,phase:A,backed:0,seed:K})}f.push({x:Ue,y:Ge,z:0,along:"z",period:F,phase:A,backed:0,scale:[7.2,1.25,1.25]});for(let P=1;P+1<i.length;P++){const[K,j]=i[P];if(s.rod([K,j-.45,-7.4],[K,j-.45,7.4],.4,8,pe[0],pe[1],{capA:!0,capB:!0}),P>1)for(const oe of[-7.2,7.2])s.box(K,(j+y)/2-.5,oe,.25,y-j-.2,.25,Q[0],Q[1]);else for(const oe of[-7.2,7.2])s.box(K,j+.1,oe,.25,1.1,.25,Q[0],Q[1])}s.box(Ue+1,Ge-6.2,0,2.2,.4,14.5,ke[0],ke[1]);for(const P of[-7,7])s.box(Ue+1.9,Ge-4.3,P,.3,4.2,.3,Q[0],Q[1]);const N=[];for(const P of k){const K=Math.ceil(P.len/ao);for(let j=-1;j<K;j++)N.push([P,j])}const x=new r.BufferGeometry,u=N.length;x.setAttribute("position",new r.BufferAttribute(new Float32Array([-.5,0,0,.5,0,0,.5,1,0,-.5,0,0,.5,1,0,-.5,1,0]),3));const B=new Float32Array(u*4),U=new Float32Array(u*4),G=new Float32Array(u*3),re=new Float32Array(u*4);N.forEach(([P,K],j)=>{const oe=P.paste||mt;B.set([P.x,P.a>0?P.low:P.top,P.z,P.kind+(P.slope||0)],j*4),U.set([P.a,P.len,P.period,P.phase],j*4),G.set([K,Math.round(P.seed*8)/8,P.backed],j*3),re.set([oe.tone[0],oe.tone[1],oe.tone[2],oe.dyed+2*oe.ivoryLace],j*4)}),x.setAttribute("aA",new r.InstancedBufferAttribute(B,4)),x.setAttribute("aB",new r.InstancedBufferAttribute(U,4)),x.setAttribute("aC",new r.InstancedBufferAttribute(G,3)),x.setAttribute("aDye",new r.InstancedBufferAttribute(re,4));const te=new r.InstancedMesh(x,Us(n),u);te.boundingSphere=new r.Sphere(new r.Vector3((e.archE+Ue)/2,36,0),222),te.userData={kind:"chains",chains:k,pitch:ao,long:pa,swing:ma,point:Ls};const H=Me();H.box(0,0,0,3.4,1.2,1.2,[1,1,1],[0,0]);const de=H.build(),J=new Float32Array(f.length*3),se=new r.Matrix4,me=new r.Quaternion,fe=new r.Vector3(0,1,0),D=new r.Vector3(1,1,1),ne=new r.Vector3,ie=new r.Vector3,le=new r.InstancedMesh(de,Gs(n),f.length);f.forEach((P,K)=>{J.set([P.period,P.phase,P.backed],K*3),le.setMatrixAt(K,se.compose(ie.set(P.x,P.y,P.z),me.setFromAxisAngle(fe,P.along==="z"?Math.PI/2:0),P.scale?ne.set(P.scale[0],P.scale[1],P.scale[2]):D))}),de.setAttribute("aStep",new r.InstancedBufferAttribute(J,3)),le.instanceMatrix.needsUpdate=!0,le.computeBoundingSphere(),le.userData={kind:"instanced",reach:1.8},s.dress=[0,0,0,0];const we=new r.Mesh(s.build(),Oe(n));we.userData={kind:"still"},c.add(te,le,we),t.cardChains=k}const Bo=5.2,Ys=`
uniform vec3 uGround, uFlowerA, uFlowerB, uLeaf, uPetals;
uniform float uBands;
// the cloth's colour at q; w is 1 on a figure (stem, leaf, flower) and 0 on the ground
vec4 clothAt(vec2 q, float salt){
  // the ground; on the rare visit it is woven in broad bands of two grounds, nine metres to a pair
  vec3 ground2 = mix(uGround, uFlowerB, .32)*.8 + uLeaf*.12;
  vec3 col = mix(uGround, ground2, uBands*smoothstep(.46, .5, abs(fract(q.y/9. + salt*.37) - .5)));
  float fig = 0.;
  // stems, one to every 4.6 m of breadth, and their leaves, one to every 2.1 m, left and right in turn
  float sx = q.x/4.6, si = floor(sx), sf = (fract(sx) - .5)*4.6;
  float wav = .85*sin(q.y*.55 + si*2.4 + salt);
  float stem = 1. - smoothstep(.08, .13, abs(sf - wav));
  col = mix(col, uLeaf*.8, stem); fig = max(fig, stem);
  float ly = q.y/2.1, li = floor(ly), lc = (li + .5)*2.1, side = mod(li, 2.)*2. - 1.;
  vec2 p = vec2(sf - .85*sin(lc*.55 + si*2.4 + salt), q.y - lc);
  float ca = cos(.7*side), sa = sin(.7*side);
  p = vec2(ca*p.x + sa*p.y, -sa*p.x + ca*p.y)*vec2(side, 1.);
  float r2 = dot(p, p);
  float leaf = step(0., p.x)*(1. - smoothstep(-.02, .02, r2*r2 - .62*(p.x*p.x - p.y*p.y)));
  col = mix(col, uLeaf, leaf); fig = max(fig, leaf);
  col = mix(col, uLeaf*.55, leaf*(1. - smoothstep(.0, .035, abs(p.y))));
  // flowers: a cell to every ${Bo.toFixed(1)} m, four cells in five bearing one, 2 to 4 m across
  float cs = ${Bo.toFixed(1)};
  vec2 c = q/cs, ci = floor(c), cf = (fract(c) - .5)*cs;
  float h = hash21(ci + salt*3.1), h2 = hash21(ci*1.7 + 9. + salt);
  float kind = floor(h2*3.), there = step(h, .8);
  float n = kind < .5 ? uPetals.x : (kind < 1.5 ? uPetals.y : uPetals.z);
  vec2 fp = cf - (vec2(h, h2) - .5)*.9;
  float R = 1. + h2, fr = length(fp), th = atan(fp.y, fp.x + 1e-5) + h*6.2832;
  float rose = R*(.3 + .7*abs(cos(n*.5*th)));
  vec3 fc = kind < .5 ? uFlowerA : (kind < 1.5 ? uFlowerB : mix(uFlowerA, uFlowerB, .5));
  float petals = (1. - smoothstep(rose - .04, rose + .04, fr))*there;
  col = mix(col, fc, petals); fig = max(fig, petals);
  float inner = R*.55*(.3 + .7*abs(cos(n*.5*th + 1.5708)));
  col = mix(col, mix(fc, uGround, .55), (1. - smoothstep(inner - .04, inner + .04, fr))*there);
  col = mix(col, uLeaf*1.2 + .05, (1. - smoothstep(R*.1, R*.1 + .05, fr))*there);
  return vec4(col, fig);
}
`;function ro(t,c,n={}){return new r.ShaderMaterial({uniforms:{...t,...c,uCreep:{value:n.creep??.3},uBack:{value:n.back??1},uSalt:{value:n.salt??0},uStart:{value:n.start??0},uThru:{value:n.thru??0}},side:r.DoubleSide,vertexShader:`
      attribute vec2 aHang, aDraught;
      uniform float uTime, uTempo;
      varying vec3 vW, vN; varying vec2 vQ; varying float vSalt;
      void main(){
        vec3 p = position;
        // a hung length breathes in the hall's draught: a slow billow that grows down its fall (aHang.x = how free
        // the cloth is here), each length on its own slow period and phase (aDraught, dealt), a ripple running along it
        float turn = 6.2831853*uTime/max(aDraught.x, 1.) + aDraught.y;
        float sway = aHang.x*(${Oo.toFixed(2)}*sin(turn + p.y*.11) + ${qo.toFixed(2)}*sin(turn*2.3 + aHang.y*2.3 + p.x*.4));
        p += normal*sway;
        vec4 w = modelMatrix*vec4(p, 1.);
        vW = w.xyz; vN = normalize(mat3(modelMatrix)*normal); vQ = uv; vSalt = aHang.y;
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:`
      varying vec3 vW, vN; varying vec2 vQ; varying float vSalt;
      uniform float uCreep, uBack, uSalt, uStart, uThru;
      ${Ee}
      ${Ce}
      ${Ys}
      void main(){
        vec3 N = normalize(vN); N = gl_FrontFacing ? N : -N;
        vec2 q = vec2(vQ.x, vQ.y - uTime*uTempo*uCreep + uStart);
        // the weft's lines, a finger's breadth apart, going to their mean tone before the picture's grain
        float grain = fwidth(q.y);
        float weft = mix(.5 + .5*sin(q.y*120.), .5, smoothstep(.008, .03, grain));
        vec4 pc = clothAt(q, uSalt + floor(vSalt*8. + .5)/8.);
        vec3 pat = pc.rgb*(.9 + .2*weft);
        // a hung length: the sun on the face it strikes, and through the silk from behind (the figures let more through)
        vec3 sun = uSunCol*sunAt(vW);
        float facing = dot(N, uSunDir);
        vec3 lit = shadeDull(pat, N, vW, .35) + uThru*pat*sun*max(-facing, 0.)*(1.1 + .9*pc.a);
        // the loom's cloth, lit through: the ground stays deep, the figures glow; its brightest part is held at 1.3
        float soft = .82 + .3*sin(vQ.x*.11 + 1.3)*sin(vQ.y*.19 + .4);
        vec3 glow = pat*mix(1.25, 2.9, pc.a)*soft + pat*lightAt(N, vW)*.3;
        glow *= min(1., 1.3/max(max(glow.r, glow.g), max(glow.b, 1e-3)));
        gl_FragColor = vec4(hazed(mix(lit, glow, uBack), vW), 1.);
      }`})}const io=.62,ga=.9;function $o(t,c={}){return new r.ShaderMaterial({uniforms:{...t,uThread:{value:new r.Color(c.color||"#e9dfc6")},uPar:{value:new r.Vector4(c.half??.2,c.group??24,c.waves??5,c.period??2.4)},uLift:{value:new r.Vector3(c.lift??0,c.liftY??.2,c.glow??1)},uDense:{value:c.dense??0},uMore:{value:new r.Vector4(c.gap??0,c.glint??0,c.glintPeriod??2.2,c.warm??0)},uKnee:{value:c.knee?1:0}},transparent:!0,depthWrite:!1,side:r.DoubleSide,vertexShader:`
      uniform float uTime, uTempo; uniform vec4 uPar; uniform vec3 uLift;
      varying vec3 vW; varying vec2 vUv; varying float vRip;
      void main(){
        float grp = floor(uv.x/uPar.y);
        float rip = sin(6.2831853*(grp*uPar.z/40. - uTime*uTempo/uPar.w) + 1.7*sin(grp*12.9898));
        vec3 p = position;
        // the shed: lifted groups stand off the sheet, most a little way up from the fell, not at all at either end
        float shed = smoothstep(0., uLift.y, uv.y)*(1. - smoothstep(uLift.y, 1., uv.y));
        p.x -= uLift.x*shed*rip;
        vec4 w = modelMatrix*vec4(p, 1.);
        vW = w.xyz; vUv = uv; vRip = rip;
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:`
      uniform vec3 uThread; uniform vec4 uPar, uMore; uniform vec3 uLift; uniform float uDense, uKnee;
      varying vec3 vW; varying vec2 vUv; varying float vRip;
      ${Ee}
      ${Ce}
      void main(){
        float grain = fwidth(vUv.x);
        float d = abs(fract(vUv.x) - .5);
        float line = 1. - smoothstep(uPar.x - grain, uPar.x + grain, d);
        float cover = mix(line, 2.*uPar.x, smoothstep(.35, 1., grain));
        // the bundles: the gap between two groups, a share uMore.x of a group's breadth
        float gx = vUv.x/uPar.y, gg = fwidth(gx), id = floor(gx);
        float inGap = smoothstep(.5 - uMore.x*.5 - gg, .5 - uMore.x*.5 + gg, abs(fract(gx) - .5));
        cover *= 1. - mix(inGap, uMore.x, smoothstep(.35, 1., gg))*step(.001, uMore.x);
        float twitch = .5 + .5*sin(vUv.x*7.31 + uTime*3.1*hash11(id) + id);
        float bright = (.4 + .95*smoothstep(-.5, .9, vRip))*(.85 + .3*twitch);
        // the glint running up the thread
        float at = fract(uTime*uTempo/uMore.z - id*.045 - .15*hash11(id*1.7 + 2.)), gd = (clamp(vUv.y, 0., 1.) - at)/.09;
        float glint = uMore.y*exp(-gd*gd);
        vec3 light = lightAt(vec3(-1., 0., 0.), vW)*.55 + mix(uSkyCol*.75, uSunCol*.3, uMore.w)*uLift.z;
        vec3 col = uThread*light*(bright + 2.2*glint);
        // THE THREADS' SHOULDER (the creels' threads and the cord fan; the warp has none): a lit thread's colour is
        // held under white, from THREAD_KNEE up toward THREAD_TOP, which it never reaches (as a card's is), so a lit
        // thread stays a thread with air beside it and does not burn into its neighbours
        float top = max(col.r, max(col.g, col.b)), over = max(top - ${h(io)}, 0.);
        col *= mix(1., (min(top, ${h(io)}) + ${h(ga-io)}*(1. - exp(-over/${h(ga-io)})))/max(top, 1e-4), uKnee);
        // (a dense sheet, the warp, hides more of what stands behind it)
        float lifted = smoothstep(-.4, .8, vRip);
        float alpha = cover*mix(.4 + .58*lifted, .5 + .5*lifted, uDense);
        gl_FragColor = vec4(hazed(col, vW), min(1., alpha*(1. + 1.5*glint)));
      }`})}function Vs(t){return new r.ShaderMaterial({uniforms:{...t},vertexShader:`
      attribute vec4 aSpool;
      uniform float uTime, uTempo;
      varying vec3 vW, vN, vL, vC; varying float vA;
      void main(){
        float a = uTime*uTempo*aSpool.w + aSpool.x*40., c = cos(a), s = sin(a);
        vec3 p = position, n = normal;
        p.xz = vec2(c*p.x - s*p.z, s*p.x + c*p.z); n.xz = vec2(c*n.x - s*n.z, s*n.x + c*n.z);
        vec4 w = modelMatrix*instanceMatrix*vec4(p, 1.);
        vW = w.xyz; vN = normalize(mat3(modelMatrix)*n); vL = position; vC = instanceColor; vA = aSpool.x;
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:`
      varying vec3 vW, vN, vL, vC; varying float vA;
      ${Ee}
      ${Ce}
      void main(){
        vec3 N = normalize(vN);
        float body = step(.25, vL.y)*step(vL.y, 2.75)*step(length(vL.xz), 1.02);
        float th = atan(vL.z, vL.x + 1e-5);
        // the winding lies in two broad slanted bands, lighter and darker, so that the spool is seen to turn
        float wind = smoothstep(-.25, .25, sin(th*2. + vL.y*2.2));
        float spoke = step(.55, fract(th/1.0472 + .5*vA));
        vec3 alb = mix(vec3(.3, .2, .11)*mix(.6, 1., spoke), vC*mix(.5, 1.3, wind), body);
        vec3 col = shadeDull(alb, N, vW, mix(.3, .6, body));
        gl_FragColor = vec4(hazed(col, vW), 1.);
      }`})}function ya(t,c){const n=Me(),a=t.RNG.bolts,o=t.cloth,s=e.loomX0,R=e.loomX1,d=e.loomHalf,L=Ve,m=L-4,M=-(d-1.15),k=2.1,f=[o[0],o[0],o[1],o[2],o[3],"#e9dfc6"],p=(g,w,b,v,C)=>{const _=be(C,1.25).map(O=>O+.02);n.rod([g,w+v*.81,M],[g+b,w+v*.81,M],v,5,_,[0,.2],{flat:!0,capA:!0,twist:Math.PI/2,paint:[4,.07,0,0]})};for(const g of c)for(let w=s+4;w+L<R;w+=L){const b=w+(L-m)/2;for(const v of[0,.5,1])n.box(b+m*v,g+k*1.5,M,.16,k*3,1.5,ke[0],ke[1],{skip:"-y-z+x",paint:[7,.3,0,1]});for(let v=1;v<=2;v++)n.box(b+m/2,g+k*v-.06,M,m,.12,1.5,ke[0],ke[1],{skip:"-z+x",paint:[7,.4,0,0]});for(let v=0;v<3;v++){let C=b+.25+a.range(0,.6),_=null;for(;C<b+m-2.2;){const O=Math.min(a.range(2,3.4),b+m-.25-C),T=a.range(.3,.46),Y=a.pick(f),q=!a.chance(.12);q&&(p(C,g+k*v,O,T,Y),_&&a.chance(.3)&&p((_.x+C)/2+.2,g+k*v+1.5*Math.min(T,_.r),Math.min(O,_.len)*.8,.3,a.pick(f))),_=q?{x:C,len:O,r:T}:null,C+=O+a.range(.12,.5)}}}const l=new r.Mesh(n.build(),Oe(t.shared));l.userData={kind:"still"},t.scene.add(l)}const vt=e.loomX0+4+10*Ve,xt=58,Ue=924.4,Ge=70.4,Ho=932,ot=70,Fo=14,Co=[9,13.5],Oo=.55,qo=.15,Be=1.3,lo=.25,ba=.3;function Ks(t){const{scene:c,shared:n}=t,a=t.RNG.loom,o=e.loomX,s=e.warpHalf,R=e.fellY,d=Me(),L=(I,ae=1)=>new r.Color(I).multiplyScalar(ae),m=a.shuffle([3,4,5,6,7,8]).slice(0,3),M={uGround:{value:L(t.cloth[0])},uFlowerA:{value:L(t.cloth[1])},uFlowerB:{value:L(t.cloth[2])},uLeaf:{value:L(t.cloth[3])},uPetals:{value:new r.Vector3(m[0],m[1],m[2])},uBands:{value:t.vary.rare?1:0}},k=a.range(1,40),f=a.range(0,Bo),p=[be("#4a3524",2.2),[0,.5]],l=e.loomHigh,g=e.postZ,w=e.postHalf;d.dress=[7,.5,0,1];for(const I of[-1,1]){d.box(o,l/2,I*27,4,l,8,p[0],p[1],{skip:"-y"}),d.box(o,(e.rollY-1.5)/2,I*g,2*w,e.rollY-1.5,2*w,p[0],p[1],{skip:"-y"}),d.box(o+.4,e.breastTop/2,I*(g+w+23)/2,1,e.breastTop,23-g-w,p[0],p[1],{skip:"-y"}),d.box(o+.4,e.breastTop+.3,I*(g+23)/2,1.8,.6,23-g+w,p[0],p[1],{paint:[7,.5,0,0]}),d.box(o,e.rollY,I*23.6,2.8,3.6,1.2,p[0],p[1]);for(const ae of[926.6,937.4])d.box(ae,(68.3+l)/2,I*23.4,.6,l-68.3,.6,p[0],p[1]);d.box(Ue,Ge,I*12.9,1.4,2.2,.9,p[0],p[1]),d.box(Ue,(Ge+l)/2+.5,I*12.9,.5,l-Ge-1,.5,p[0],p[1]),d.box(vt,xt,I*19.25,.8,.8,9.9,p[0],p[1],{paint:[7,.4,0,0]});for(const ae of[14.6,23.9])d.box(vt,(xt+l)/2,I*ae,.3,l-xt,.3,Q[0],Q[1],{paint:[0,0,0,0]})}d.dress=[7,.5,0,0],d.box(o,64,0,4.4,4,62,p[0],p[1]),d.box(Ho,68,0,12,.6,48,p[0],p[1]),d.rod([o,e.warpTop,-s-.5],[o,e.warpTop,s+.5],1.3,14,_e.ivory[0],_e.ivory[1],{capA:!0,capB:!0,paint:[0,0,0,0]});const b=ro(n,M,{creep:.3,back:1,salt:k,start:f}),v=new r.PlaneGeometry(1,1,1,1),C=v.getAttribute("position"),_=v.getAttribute("uv"),O=e.rollY+1.2;for(let I=0;I<C.count;I++){const ae=C.getX(I)+.5,ce=C.getY(I)+.5;C.setXYZ(I,o,O+(R-O)*ce,-s+2*s*ae),_.setXY(I,2*s*ae,(R-O)*(1-ce)),v.getAttribute("normal").setXYZ(I,-1,0,0)}v.setAttribute("aHang",new r.BufferAttribute(new Float32Array(C.count*2),2)),v.setAttribute("aDraught",new r.BufferAttribute(new Float32Array(C.count*2),2)),v.computeBoundingSphere(),v.computeBoundingBox();const T=new r.Mesh(v,b);T.userData={kind:"still"};const Y=t.RNG.hangs,q=t.RNG.draught,V=[],E=[],Z=[],ee=[],S=[],F=[],A=6,X=10;for(const I of[-1,1])for(let ae=0;ae<5;ae++){const ce=e.loomX0+4+Ve*(1+2*ae+(I>0?1:0))+1,ue=I*Y.range(Co[0],Co[1]),ye=Y.range(30,46),ze=Math.round(Y.range(1,40)*8)/8,Re=V.length/3,Ae=q.range(5,9),Se=q.range(0,Math.PI*2);for(let ge=0;ge<=X;ge++)for(let De=0;De<=A;De++){const Ie=ce+Fo*De/A,We=ot-(ot-ye)*ge/X;V.push(Ie,We,ue),E.push(0,0,-I),Z.push(Ie-ce,ot-We),ee.push(Math.min(1,(ot-We)/30),ze),S.push(Ae,Se)}for(let ge=0;ge<X;ge++)for(let De=0;De<A;De++){const Ie=Re+ge*(A+1)+De,We=Ie+1,vo=Ie+A+1,_a=vo+1;F.push(Ie,vo,We,We,vo,_a)}d.box(ce+Fo/2,ot+.2,ue,Fo+.6,.3,.3,Q[0],Q[1],{paint:[0,0,0,0]});for(const ge of[ce-1+.2,ce+Ve-1.2])d.box(ge,(ot+l)/2,ue,.2,l-ot-.4,.2,Q[0],Q[1],{paint:[0,0,0,0]})}const y=new r.BufferGeometry;y.setAttribute("position",new r.BufferAttribute(new Float32Array(V),3)),y.setAttribute("normal",new r.BufferAttribute(new Float32Array(E),3)),y.setAttribute("uv",new r.BufferAttribute(new Float32Array(Z),2)),y.setAttribute("aHang",new r.BufferAttribute(new Float32Array(ee),2)),y.setAttribute("aDraught",new r.BufferAttribute(new Float32Array(S),2)),y.setIndex(F),y.computeBoundingSphere(),y.computeBoundingBox();const z=new r.Mesh(y,ro(n,M,{creep:0,back:0,thru:1}));z.userData={kind:"still",reach:Oo+qo};const i=(I,ae,ce,ue,ye,ze)=>{const Re=I.P.length/3;for(let Ae=0;Ae<=ce;Ae++)for(let Se=0;Se<=ae;Se++){const ge=ze(Se/ae,Ae/ce);I.P.push(...ge.p),I.N.push(...ue),I.U.push(...ge.uv),I.H.push(ge.free,ge.salt),I.D.push(...ye)}for(let Ae=0;Ae<ce;Ae++)for(let Se=0;Se<ae;Se++){const ge=Re+Ae*(ae+1)+Se,De=ge+1,Ie=ge+ae+1,We=Ie+1;I.I.push(ge,Ie,De,De,Ie,We)}},N=(I,ae,ce)=>{const ue=new r.BufferGeometry;ue.setAttribute("position",new r.BufferAttribute(new Float32Array(I.P),3)),ue.setAttribute("normal",new r.BufferAttribute(new Float32Array(I.N),3)),ue.setAttribute("uv",new r.BufferAttribute(new Float32Array(I.U),2)),ue.setAttribute("aHang",new r.BufferAttribute(new Float32Array(I.H),2)),ue.setAttribute("aDraught",new r.BufferAttribute(new Float32Array(I.D),2)),ue.setIndex(I.I),ue.computeBoundingSphere(),ue.computeBoundingBox();const ye=new r.Mesh(ue,ae);return ye.userData={kind:"still",reach:ce},ye},x=()=>({P:[],N:[],U:[],H:[],D:[],I:[]}),u=e.fallZ,B=e.fallX,U=e.fallTop,G=x(),re=R-O+2*Math.PI*.75;for(const I of[-1,1]){const ae=Be+lo,ce=Math.hypot(o-.3-B,e.rollY-1.5-U-.17);for(const[ue,ye,ze,Re]of[[e.rollY-1.52,U+.17,1,!0],[U+.17,ae,8,!1]])i(G,4,ze,Re?[0,-1,0]:[-1,0,0],[1,0],(Ae,Se)=>{const ge=u[0]+(u[1]-u[0])*Ae,De=Re&&Se===0,Ie=ue+(ye-ue)*Se;return{p:[De?o-.3:B,Ie,I*(De?Math.min(ge,s-.1):ge)],uv:[s+I*ge,re+(Re?ce*Se:ce+ue-Ie)],free:0,salt:0}});d.rod([B,U,I*(u[0]-.9)],[B,U,I*(u[1]+.3)],.15,6,Q[0],Q[1],{capA:!0,capB:!0}),d.box((B+o-w)/2,U,I*(u[0]-.7),o-w-B+.3,.3,.3,p[0],p[1],{paint:[7,.4,0,0]}),d.box((B+o-2)/2,U,I*(u[1]+.1),o-2-B+.3,.3,.3,p[0],p[1],{paint:[7,.4,0,0]});for(const ue of[u[0]-.25,u[1]+.25])d.box(B-Be,(Be+lo+.4)/2,I*ue,2*Be+.8,Be+lo+.4,.4,p[0],p[1],{skip:"-y",paint:[7,.4,0,1]})}const te=N(G,ro(n,M,{creep:.3,back:0,salt:k,start:f}),0),H=e.outerZ,de=e.outerY,J=x(),se=t.RNG.drawn;for(const I of[-1,1]){const ae=Math.round(se.range(1,40)*8)/8,ce=se.range(6,10),ue=se.range(0,Math.PI*2);i(J,3,12,[-1,0,0],[ce,ue],(ye,ze)=>{const Re=H[0]+(H[1]-H[0])*ye,Ae=de[1]-(de[1]-de[0])*ze;return{p:[Zt,Ae,I*Re],uv:[Re-H[0],de[1]-Ae],free:ba*Math.min(1,(de[1]-Ae)/30),salt:ae}}),d.box(Zt,de[1]+.2,I*(H[0]+H[1])/2,.3,.3,H[1]-H[0]+.6,Q[0],Q[1],{paint:[0,0,0,0]});for(const ye of H)d.box((Zt+e.loomX1)/2,de[1]+.2,I*ye,e.loomX1-Zt,.2,.2,Q[0],Q[1],{paint:[0,0,0,0]})}const me=N(J,ro(n,M,{creep:0,back:1}),ba*(Oo+qo)),fe=new r.Mesh(d.build(),Oe(n));fe.userData={kind:"still"},c.add(fe,T,z,te,me);const D=new r.PlaneGeometry(1,1,92,8);{const I=D.getAttribute("position"),ae=D.getAttribute("uv");for(let ce=0;ce<I.count;ce++){const ue=I.getX(ce)+.5,ye=I.getY(ce)+.5;I.setXYZ(ce,o,R+(e.warpTop-R)*ye,-s+2*s*ue),ae.setXY(ce,ue*1840,ye)}D.computeBoundingSphere(),D.computeBoundingBox()}const ne=new r.Mesh(D,$o(n,{color:"#f3cf6a",half:.3,group:40,waves:3,period:2.6,lift:.8,liftY:.2,glow:1.9,dense:1,gap:.3,warm:1}));ne.userData={kind:"still",reach:.8},ne.renderOrder=2;const ie=[],le=[],we=46,P=[[Ho-1,67.7,-12],[Ho-1,67.7,12]],K=wt+fo+Pt/2,j=[[gt,K,-s],[gt,K,s]],oe=(I,ae)=>[I[0][0]+(I[1][0]-I[0][0])*ae,I[0][1]+(I[1][1]-I[0][1])*ae,I[0][2]+(I[1][2]-I[0][2])*ae];for(let I=0;I<we;I++){const ae=I/we,ce=(I+1)/we,ue=oe(P,ae),ye=oe(P,ce),ze=oe(j,ce),Re=oe(j,ae);for(const[Ae,Se,ge]of[[ue,ae,0],[ye,ce,0],[ze,ce,1],[ue,ae,0],[ze,ce,1],[Re,ae,1]])ie.push(Ae[0],Ae[1],Ae[2]),le.push(Se*920,ge)}const xe=new r.BufferGeometry;xe.setAttribute("position",new r.BufferAttribute(new Float32Array(ie),3)),xe.setAttribute("uv",new r.BufferAttribute(new Float32Array(le),2)),xe.computeBoundingSphere(),xe.computeBoundingBox();const he=new r.Mesh(xe,$o(n,{half:.16,group:10,waves:7,period:1.3,glow:1.25,gap:.4,knee:!0}));he.userData={kind:"still"},he.renderOrder=3,c.add(ne,he),t.loomLook=M}const Aa=1.4,Xo=.9,Ma=4,Zs=1.45,js=.7,co=3.5,ho=co+.3,wt=e.fellY+6.45,fo=.7,Pt=.6,gt=e.loomX-1.5,Uo=.2,ka=1.8,Qs=Aa*e.warpHalf/(e.warpHalf+ho),uo=2*Qs,at=770,Te=3.4,je=40,Go=[[17,.24],[19.4,4.2],[21.8,8.2]],yt=1.1,Js=.4,en=.4,tn=2*yt,on=.12,an=e.fallX-2*Be-.4,La=Math.ceil((vt+Js+yt-at)/Te),sn=Math.floor((an-tn-yt-at)/Te),po=it/2+yt+en,mo=at+Te*La,st=sn-La+1;function nn(t){const{scene:c,shared:n}=t,a=t.RNG.loom,o=e.loomX,s=e.warpHalf,R=e.fellY,d=Oe(n),L=t.cloth.map(J=>be(J,.9)),m=(J,se,me)=>{const fe=Me();for(let D=0;D<16;D++){const ne=D/16*Math.PI*2,ie=(D+1)/16*Math.PI*2,le=L[D%2===0?0:1+(D>>1)%3],we=(j,oe)=>[Math.cos(j)*J,Math.sin(j)*J,oe],P=[Math.cos(ne),Math.sin(ne),0],K=[Math.cos(ie),Math.sin(ie),0];if(fe.quad(we(ne,-se),we(ie,-se),we(ie,se),we(ne,se),le,[0,.4],void 0,[P,K,K,P]),me)for(const j of[-1,1])fe.tri([0,0,j*se],j>0?we(ne,se):we(ie,-se),j>0?we(ie,se):we(ne,-se),le,[0,.4])}return fe.build()},M=new r.Mesh(m(1.5,s,!1),d);M.position.set(o,e.rollY,0),M.userData={kind:"spinZ",R:1.55,half:s};const k=(e.fallZ[1]-e.fallZ[0])/2,f=m(Be,k,!0),p=[-1,1].map(J=>{const se=new r.Mesh(f,d);return se.position.set(e.fallX-Be,Be+lo,J*(e.fallZ[0]+e.fallZ[1])/2),se.userData={kind:"spinZ",R:Be+.05,half:k},c.add(se),se}),l=Me();l.box(0,0,0,.5,.8,2*s,be("#c4ccd6"),[1,.85]);const g=new r.Mesh(l.build(),d);g.position.set(o-.35,R+.45,0),g.userData={kind:"swing",reach:1.6};const w=Me(),b=[be("#f1f3f6",2.1),[1,.95]];for(const J of[-1,1])for(let se=0;se<6;se++){const me=se/6*Math.PI*2,fe=(se+1)/6*Math.PI*2,D=js;w.tri([Math.cos(me)*D,Math.sin(me)*D,0],[Math.cos(fe)*D,Math.sin(fe)*D,0],[0,0,J*co],b[0],b[1])}const v=w.build(),C=[t.cloth[1],t.cloth[2],t.cloth[3],"#e9dfc6"],_=J=>{const se=Me(),me=be(J,2.2).map(fe=>fe+.25);return se.box(0,0,.5,.3,.8,1,me,[0,0],{skip:"-z+z"}),se.build()},O=[],T=t.RNG.round,Y=T.range(0,uo);for(let J=0;J<Ma;J++){const se=new r.Mesh(v,d),me=new r.Mesh(_(C[J%C.length]),d),fe=R+1.1+Zs*J,D={kind:"course",lo:[o-1.3,fe-.9,-s-2*ho],hi:[o+.6,fe+.9,s+2*ho]};se.userData=D,me.userData=D,O.push({body:se,trail:me,start:(J+T())/Ma*uo,y:fe}),c.add(se,me)}const q=Me(),V=[0,0,0],E=[0,0];q.rod([0,.25,0],[0,2.75,0],.95,10,V,E,{}),q.rod([0,0,0],[0,.25,0],yt,10,V,E,{capB:!0}),q.rod([0,2.75,0],[0,3,0],yt,10,V,E,{capB:!0}),q.rod([0,3,0],[0,3.5,0],.12,5,V,E,{});const Z=q.build(),ee=2*(Go.length*je+st),S=new Float32Array(ee*4),F=new r.Matrix4,A=new r.Color,X=new r.InstancedMesh(Z,Vs(n),ee),y=[...t.cloth,"#e9dfc6"],z=t.RNG.creel,i=Me(),N=[],x=[];i.dress=[7,.4,0,0];let u=0;const B=(J,se,me)=>{for(const[fe,D,ne,ie]of[[J,se,on,.09],[se,me,.09,.09]]){const le=[fe[0]-ne,fe[1],fe[2]],we=[fe[0]+ne,fe[1],fe[2]],P=[D[0],D[1],D[2]+ie],K=[D[0],D[1],D[2]-ie];for(const[j,oe,xe]of[[le,0,0],[we,1,0],[P,1,1],[le,0,0],[P,1,1],[K,0,1]])N.push(j[0],j[1],j[2]),x.push(u*3+.2+oe*.6,xe)}};for(const J of[-1,1]){const se=t.RNG.last,me=Te*(st-1)+3,fe=.24;i.box(mo+Te*(st-1)/2,fe-.12,J*po,me,.24,2.5,ke[0],ke[1],{skip:"-y"});for(let D=0;D<st;D++,u++){const ne=mo+Te*D,ie=(D+.5)/st;X.setMatrixAt(u,F.makeTranslation(ne,fe,J*po)),X.setColorAt(u,A.set(y[(D+(J>0?3:0))%y.length])),S.set([se(),0,0,se.range(.5,1.4)*(se.chance(.5)?1:-1)],u*4),B([ne,fe+3.5,J*po],[vt,xt+.4,J*(14.8+8.9*(.5+.5*ie))],[o-.5,e.warpTop+1.3,J*(.6+22*(.5+.5*ie))])}}for(const J of[-1,1])Go.forEach(([se,me],fe)=>{const D=J*se,ne=Te*(je-1)+3,ie=at+Te*(je-1)/2;if(i.box(ie,me-.12,D,ne,.24,2.5,ke[0],ke[1],{skip:fe?"":"-y"}),fe)for(let le=0;le<=je;le+=4)i.box(at+Te*(le-.5),(me-.24)/2,D+J*1,.3,me-.24,.3,ke[0],ke[1],{skip:"-y",paint:[7,.3,0,1]});for(let le=0;le<je;le++,u++){const we=at+Te*le,P=(le+fe/Go.length)/je;X.setMatrixAt(u,F.makeTranslation(we,me,D)),X.setColorAt(u,A.set(y[(le+2*fe+(J>0?1:0))%y.length])),S.set([z(),0,0,z.range(.5,1.4)*(z.chance(.5)?1:-1)],u*4),B([we,me+3.5,D],[vt,xt+.4,J*(14.8+8.9*P)],[o-.5,e.warpTop+1.3,J*(.6+22*P)])}});Z.setAttribute("aSpool",new r.InstancedBufferAttribute(S,4)),X.instanceMatrix.needsUpdate=!0,X.instanceColor.needsUpdate=!0,X.computeBoundingSphere(),X.userData={kind:"instanced",reach:0};const U=new r.BufferGeometry;U.setAttribute("position",new r.BufferAttribute(new Float32Array(N),3)),U.setAttribute("uv",new r.BufferAttribute(new Float32Array(x),2)),U.computeBoundingSphere();const G=new r.Mesh(U,$o(n,{half:.2,group:3,waves:3,period:1.7,glow:1.5,glint:1,glintPeriod:2.4,knee:!0}));G.userData={kind:"still"},G.renderOrder=3;const re=new r.Mesh(i.build(),d);re.userData={kind:"still"},c.add(M,g,X,G,re);const te=a.range(0,Xo),H=[0,1].map(J=>{const se=Me(),me=[be("#ecd9ae",2),[0,.3]];for(let D=J;D<6;D+=2){se.box(gt-Uo*D,0,0,.14,Pt,2*s+.8,me[0],me[1],{paint:[0,0,0,0]});for(const ne of[-1,1])se.box(gt-Uo*D,0,ne*(s+.55),.2,Pt+.12,.3,_e.brass[0],_e.brass[1],{paint:[0,0,0,0]})}const fe=new r.Mesh(se.build(),d);return fe.position.y=wt,fe.userData={kind:"course",lo:[gt-Uo*5-.1,wt-fo-Pt,-s-.8],hi:[gt+.1,wt+fo+Pt,s+.8]},c.add(fe),fe}),de=t.RNG.heddle.range(0,ka);t.updates.push((J,se)=>{const me=se*n.uTempo.value;M.rotation.z=-(me*.3)/1.5;const fe=Math.sin(2*Math.PI*(me+de)/ka),D=fo*(2*Ye(-.7,.7,fe)-1);H[0].position.y=wt+D,H[1].position.y=wt-D;const ne=(me+te)%Xo/Xo;g.position.y=R+.45+1.5*(ne<.7?Ye(0,.7,ne):1-Ye(.7,.86,ne));for(const ie of p)ie.rotation.z=-(me*.3)/Be;for(const ie of O){const le=(me+Y-ie.start)/uo,we=Math.floor(le),P=Pe((le-we)*uo/Aa,0,1),K=Math.abs(we)%2===0?1:-1,j=K*(s+ho)*(2*P-1);ie.body.position.set(o-.45,ie.y,j);const oe=-K*(s+.2),xe=Math.max(.01,Math.abs(j-K*co-oe));ie.trail.position.set(o-.45,ie.y,Math.min(oe,j-K*co)),ie.trail.scale.set(1,1,Math.abs(j)>s?.01:xe)}})}const Sa=23,rn=13,bt=40,ln=.45,Ra=73,cn=82,Ea=34,hn=62,za=[["#1c2f5e","#d9a520","#b3202e","#1f6b5a"],["#3a1d5c","#e9dfc6","#b3202e","#2a8a6a"],["#17402f","#d9a520","#f1ead8","#d98a9a"],["#8f1a26","#d9a520","#e9dfc6","#3d5f8f"],["#1c120d","#c9ccd2","#d9a520","#3d5f8f"]];var un={id:"loom-of-numbers",name:"The Loom of Numbers",category:"books",placeKind:"interior",book:"Notes on the Analytical Engine",author:"Ada Lovelace, 1815 to 1852",media:["air"],weirdness:.5,async build(t){const c=new r.Scene,n=t.vary||{hour:"any",rare:!1,density:1,mood:.5},a=t.quality?.detail??1,o=D=>t.core.makeRng(t.core.hashSeed("loom-"+D+":"+t.seed)),s={look:o("look"),store:o("store"),drive:o("drive"),mill:o("mill"),cards:o("cards"),loom:o("loom"),falls:o("falls"),head:o("head"),hangs:o("hangs"),creel:o("creel"),racks:o("racks"),sky:o("sky"),heddle:o("heddle"),draught:o("draught"),bolts:o("bolts"),drawn:o("drawn"),last:o("last"),round:o("round"),dye:{hall:o("dye"),curtains:$e.map((D,ne)=>o("dye-curtain-"+(ne+1))),walls:o("dye-walls"),link:o("dye-link")}},R=s.look,d=n.hour,L=d==="dawn"?R.range(12,16):d==="golden"?R.range(16,22):d==="day"?R.range(32,40):R.range(12,40),m=R.range(15,40),M=R.range(8e-4,.0015),k=za[R.int(0,za.length-1)],f=R.chance(.6)?3:2,p=R.chance(.5)?-1:1,l=.95+.1*n.mood,g=Math.PI/180,w=1-Ye(12,30,L),b=new r.Vector3(Math.cos(L*g)*Math.cos(m*g),Math.sin(L*g),Math.cos(L*g)*Math.sin(m*g)),v=new r.Color("#fff1cf").lerp(new r.Color(d==="dawn"?"#ffd9b8":"#ffe2b4"),w),C=Ta({sunDir:b,sunColor:v,sunPower:3,fogDensity:M,ranks:f,clothA:k[0],clothB:k[1],clothC:k[2],clothD:k[3],tempo:l}),_={ctx:t,scene:c,shared:C,RNG:s,vary:n,detail:a,ranks:f,lowSide:p,cloth:k,updates:[]};_.rackSalt={store:s.racks.int(0,400)/8,drive:s.racks.int(0,400)/8,mill:s.racks.int(0,400)/8};{const D=s.sky,ne=D.range(0,Math.PI*2),ie=D.range(.012,.024);_.cloud=new r.Vector4(D.range(0,40),D.range(0,40),Math.cos(ne)*ie,Math.sin(ne)*ie)}c.background=new r.Color("#b4c6d8");const O=Ga(),T=Na(O.pts);_.path=T,_.route=O,await t.yield();const Y=new r.Mesh(new r.PlaneGeometry(1040,160,1,1).rotateX(-Math.PI/2).translate(465,0,0),Qa(C));Y.userData={kind:"still"},c.add(Y),_.floorMat=Y.material;const q=Me(),V=ja();await t.yield(),await Ja(q,V,t),await t.yield(),_.wallPins=[],ca(q,V,_.rackSalt.mill,_.wallPins,0),await t.yield(),ca(q,V,_.rackSalt.mill,_.wallPins,1),await t.yield(),as(q,V),ns(q,V),await t.yield(),_.plain=Oe(C,{side:r.DoubleSide});const E=new r.Mesh(q.build(),_.plain),Z=new r.Mesh(V.build(),Za(C,_.cloud));E.userData={kind:"still"},Z.userData={kind:"still"},c.add(E,Z),await t.yield(),await us(_),await t.yield(),ps(_),await t.yield(),ws(_),await t.yield(),ys(_),await t.yield(),bs(_),Ms(_),As(_),await t.yield();const ee=new r.Mesh(_.storeIron.build(),Oe(C));ee.userData={kind:"still"},c.add(ee),await t.yield(),Ws(_),await t.yield(),Ks(_),await t.yield(),ya(_,_o.slice(0,2)),await t.yield(),ya(_,_o.slice(2)),await t.yield(),nn(_),await t.yield();const S=await Pa(t,{shared:C,rng:s.mill,rare:n.rare,detail:a,plainMaterial:Oe(C),rackSalt:_.rackSalt.mill});c.add(S.object),_.hero=S,await t.yield();const F=new r.Vector3,A=D=>Wo(1,rn/Sa,Ye(e.archW-20,e.archW,D)*(1-Ye(e.archE,e.archE+20,D))),X=D=>A(T.pointAt(Pe(D,0,1),F).x);let y=0;for(let D=0;D<T.length;D+=2)y+=2/(Sa*A(T.posAtDist(D+1,F).x));const z=Pe(y,35,50),i=T.length,N=[e.cx,e.cz],x=Math.PI/180,u=D=>{for(let ne=0;ne<=i;ne+=.5)if(D(T.posAtDist(ne,F)))return ne;return i},B=(D,ne,ie,le,we={})=>({from:D/i,to:ne/i,fade:Math.min(.5,bt/(ne-D)),weight:ie,arc:!0,at:le,...we}),U=new r.Vector3,G=new r.Vector3,re=new r.Vector3,te=new r.Vector3,H=new r.Vector3,de=e.ribR[0],J=e.millFoot+e.millWheels*e.millBand/2,se=Ra*x-Math.acos(qe*Math.cos(Ra*x)/de),me=u(D=>D.z>1&&Math.atan2(D.z-N[1],D.x-N[0])<=cn*x),fe=[B(u(D=>D.x+(W.x-W.R-D.x)*(-e.rankZ[0]-D.z)/(W.z-D.z)>=kt+e.storeR*1.3),u(D=>D.x>=W.x),ln,()=>U.set(W.x,W.y,W.z)),B(u(D=>D.x>=e.archW)-bt,me+2*bt,1,(D,ne)=>{T.pointAt(Pe(ne,0,1),H);const ie=Math.atan2(H.z-N[1],H.x-N[0])-se;return G.set(N[0]+de*Math.cos(ie),J,N[1]+de*Math.sin(ie))},{steady:!0}),B(me,u(D=>D.x>N[0]&&D.x>=O.xb&&Math.abs(D.z)<.01)+bt,1,(D,ne)=>(T.pointAt(Pe(ne,0,1),H),te.set(Math.max(xo,H.x+Ea),H.y,0)),{steady:!0}),B(u(D=>D.x>=$e[0]-lt)-bt,u(D=>D.x>=$e[1]+lt)+bt,.6,(D,ne)=>(T.pointAt(Pe(ne,0,1),H),re.set(H.x+2*lt,Ct[35][0],0)))];return{scene:c,path:T,duration:z,pace:X,ride:"none",companion:"none",camera:{fov:hn,near:.3,far:1300,lookAhead:Ea,sway:1,bank:0},pois:fe,portal:{shape:"arch",width:it,height:St,color:"#ffe9c0",glow:1,revealDistance:1200},post:{exposure:1,bloom:{strength:.32,radius:.6,threshold:.95},grade:{saturation:1.06,contrast:1.05,vignette:.26,grain:.02,aberration:0}},update(D,ne,ie,le){C.uTime.value=ne,S.update(D,ne);for(const we of _.updates)we(D,ne)},dispose(){}}}};export{un as default};
