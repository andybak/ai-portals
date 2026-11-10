import*as e from"three";const Z=(n,s,t)=>Math.min(t,Math.max(s,n)),Ne=(n,s,t)=>n+(s-n)*t,W=Math.PI*2,j=(n,s,t)=>{const o=Z((n-s)/(t-s),0,1);return o*o*(3-2*o)},N={H:70.935,R:30,RM:9,HB:46,NG:24,SEG:6,NV:84,HOLE:8.5,CAB:9,UP:72*Math.PI/180,PANEL:11,NB:8,LOOP:40},J=n=>n<=46?9+21*Math.sin(Math.PI*n/92):30*Math.sqrt(Math.max(0,1-((n-46)/26)**2)),D=new e.Vector3(Math.sin(20*Math.PI/180)*Math.cos(10*Math.PI/180),Math.sin(10*Math.PI/180),-Math.cos(20*Math.PI/180)*Math.cos(10*Math.PI/180)).normalize();function le(n,s={}){const t=Math.PI/2*j(n/N.UP,0,1),o=Math.sin(t),u=Math.cos(t);return s.be=t,s.by=.25+1.8*u,s.bz=-1.8+1.8*o,s.fy=s.by+6*o,s.fz=s.bz-6*u,s.s=Math.sin(n),s.c=Math.cos(n),s}function he(n,s,t,o={}){const u=Z(n,0,N.H),l=J(u),a=N.CAB+u,d=t.fy+t.s*a,h=j(s.th,.06,.75),g=1-j(u,s.hf-16,s.hf+6);let m=.07+.55*g;m=1+(m-1)*j(u,0,14);const M=m+(1-m)*h,v=M*l,S=1-j(s.th,0,.55);return o.r=l,o.b=v,o.ax=(1+.5*Math.pow(1-M,1.5))*l,o.cy=d+S*Math.max(0,.94*v-d),o.cz=t.fz-t.c*a,o.up=h,o.wave=g,o.h=u,o}const be={},ye={};function me(n,s,t,o,u=new e.Vector3){const l=le(o.th,be),a=he(s,o,l,ye),d=s-a.h;return u.set(n,a.cy+l.s*d+l.c*t,a.cz-l.c*d+l.s*t)}const Q=`
float hash21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(hash21(i), hash21(i+vec2(1., 0.)), f.x), mix(hash21(i+vec2(0., 1.)), hash21(i+vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 5; i++){ s += a*vnoise(p); p = p*2.03+17.1; a *= .5; } return s; }
`,re=`
uniform vec3 uSun, uSunCol, uSkyCol, uFogCol, uBurnP, uBurnCol;
uniform float uBurn, uFog, uMist, uTime, uGround;
// the air blues with distance and goes gold toward the sun; under it a layer of ground mist that thins with height (40 m),
// so the valleys fill and the ridges stand out of it
vec3 mist(vec3 col, vec3 p, float dist){
  float ts = pow(max(dot((p-cameraPosition)/max(dist, .001), uSun), 0.), 3.);
  col = mix(col, mix(uFogCol, vec3(.95, .56, .28), .6*ts), 1.-exp(-dist*uFog));
  float hp = max(p.y-uGround, 0.), hc = max(cameraPosition.y-uGround, 0.), dh = abs(hc-hp);
  float od = dh < .5 ? exp(-hp/40.) : 40.*(exp(-min(hp, hc)/40.)-exp(-max(hp, hc)/40.))/dh;
  return mix(col, mix(vec3(.36, .43, .68), vec3(1.02, .62, .32), .8*ts), 1.-exp(-dist*uMist*od));
}
`,ge=`
const vec3 HIDE = vec3(.12, .05, .03), CRIMSON = vec3(.62, .03, .05), TANGERINE = vec3(.92, .27, .03), SAFFRON = vec3(.96, .62, .06), TEAL = vec3(.03, .42, .40), COBALT = vec3(.05, .11, .56), PLUM = vec3(.36, .05, .36), CHAR = vec3(.03, .03, .04);
vec3 six(float i){ return i < .5 ? CRIMSON : (i < 1.5 ? TANGERINE : (i < 2.5 ? SAFFRON : (i < 3.5 ? TEAL : (i < 4.5 ? COBALT : PLUM)))); }
`;function Ae(){const n={uTime:{value:0},uSun:{value:D.clone()},uSunCol:{value:new e.Vector3(3,1.82,.86)},uSkyCol:{value:new e.Vector3(.24,.37,.8)},uFogCol:{value:new e.Vector3(.3,.4,.66)},uFog:{value:1e-4},uMist:{value:6e-4},uGround:{value:0},uBurnP:{value:new e.Vector3},uBurnCol:{value:new e.Vector3(1,.56,.18)},uBurn:{value:0},uAmb:{value:new e.Vector3(.2,.13,.09)},uHoleC:{value:new e.Vector3},uHoleN:{value:new e.Vector3(0,1,0)},uOpen:{value:0},uHf:{value:200},uUp:{value:0},uBal:{value:Array.from({length:N.NB},()=>new e.Vector4(0,-9999,0,0))},uPx:{value:400}},s=[],t=S=>{const w=new e.ShaderMaterial(S);return w.uniforms=Object.assign(w.uniforms,n),s.push(w),w},o=`
    attribute vec2 aAux; varying vec3 vP, vN; varying vec2 vUv, vAux;
    void main(){ vP = position; vN = normal; vUv = uv; vAux = aAux; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.); }`,u=`
    precision highp float;
    ${re} ${Q} ${ge}
    uniform vec3 uAmb, uHoleC, uHoleN; uniform float uOpen, uHf, uUp, uPanel; uniform vec4 uBal[${N.NB}];
    varying vec3 vP, vN; varying vec2 vUv, vAux;
    vec3 pattern(float g, float v){
      float gi = floor(g), band = floor(v*30.);
      if (uPanel > .5) return mod(gi, 2.) < 1. ? SAFFRON : TANGERINE;
      if (v < .011) return HIDE;
      if (v < .215) return mod(gi, 2.) < 1. ? COBALT : CRIMSON;
      if (v < .868) return six(mod(gi+band, 6.));
      return mod(gi, 2.) < 1. ? SAFFRON : CRIMSON;
    }
    float shadowAt(vec3 p){
      float s = 1.;
      for (int i = 0; i < ${N.NB}; i++){
        vec4 b = uBal[i]; if (b.w <= 0.) continue;
        vec3 d = b.xyz-p; float t = dot(d, uSun); if (t <= 0.) continue;
        float q = length(d-uSun*t); s *= 1.-.9*(1.-smoothstep(b.w-1.6, b.w+1.6, q));
        vec3 d2 = d-vec3(0., b.w*1.02, 0.); t = dot(d2, uSun); q = length(d2-uSun*t); s *= 1.-.9*(1.-smoothstep(b.w*.52-1.4, b.w*.52+1.4, q));
        d2 = d-vec3(0., b.w*2.08, 0.); t = dot(d2, uSun); q = length(d2-uSun*t); s *= 1.-.85*(1.-smoothstep(1.6, 3.2, q));
      }
      return s;
    }
    void main(){
      vec3 N = normalize(vN), V = normalize(cameraPosition-vP);
      float g = vUv.x, v = vUv.y, r = max(vAux.x, 1.);
      vec3 base = pattern(g, v);
      // the load tapes between the gores, the sewn seams between the panels
      float gw = 6.2832*r/${N.NG}., fg = fract(g), dg = min(fg, 1.-fg)*gw, pg = fwidth(g)*gw+1e-4;
      float tape = uPanel > .5 ? 1.-smoothstep(.07, .07+pg, min(fg, 1.-fg)*6.2832*r/24.) : 1.-smoothstep(.11, .11+pg, dg);
      float fb = fract(v*30.), db = min(fb, 1.-fb)*3.4, pb = fwidth(v*30.)*3.4+1e-4;
      float seam = (1.-smoothstep(.03, .03+pb, db))*(1.-uPanel);
      // creases: where the cloth is slack the light through it runs in long folds
      float wave = 1.-smoothstep(uHf-16., uHf+6., vAux.y), slack = (1.-uUp)*mix(1., .5, wave);
      float cr = sin(g*23.+3.5*sin(v*31.+g*1.7))*.5+sin(g*61.+v*40.+2.*sin(v*90.))*.3+sin(v*210.+g*9.)*.2;
      float fold = 1.+(.34*slack+.035)*cr;
      float dn = dot(N, V);
      if (uPanel > .5 && dn > 0.){ N = -N; dn = -dn; }          // the rip top is seen from within on both its faces
      float ndl = dot(N, uSun);
      vec3 tr = pow(base, vec3(.82));
      float onGround = smoothstep(uGround+.15, uGround+2.2, vP.y);
      vec3 Lb = uBurnP-vP; float lb = length(Lb);
      vec3 Lh = uHoleC-vP; float lh = length(Lh);
      vec3 col;
      if (dn < 0.){
        // from within: the sun through the cloth on its own side, the sky's blue through every side, the light thrown about inside
        float sunT = smoothstep(-.10, .55, ndl)*shadowAt(vP)*onGround;
        float hot = pow(max(dot(-V, uSun), 0.), 6.);
        vec3 sunC = mix(uSunCol, vec3(dot(uSunCol, vec3(.3333)))*1.05, .3);
        col = tr*sunC*sunT*(.32+.24*hot)*fold;
        col += tr*uSkyCol*(.17+.10*N.y)*mix(.35, 1., onGround)*fold;
        col += base*uAmb*(.55+.25*cr*slack);
        col += tr*vec3(.25, .23, .22)*(1.-onGround)*(1.-uUp);
        // the burner: the cloth lit, falling off with distance from the flame
        col += (base+.03)*uBurnCol*uBurn*max(dot(-N, Lb/lb), .16)*500./(120.+lb*lb);
        // the mouth: the day comes in from below, off the land
        col += base*vec3(.46, .50, .44)*max(dot(-N, Lb/lb), .12)*(300./(170.+lb*lb)+.10*(1.-uUp));
        // the open top: daylight from the hole, and the sun's own beam where it strikes
        col += base*uSkyCol*uOpen*max(dot(-N, Lh/lh), 0.)*300./(260.+lh*lh);
        float hd = dot(uSun, uHoleN), ht = dot(uHoleC-vP, uHoleN)/hd;
        float beam = ht > 0. ? 1.-smoothstep(${(N.HOLE-.7).toFixed(2)}, ${(N.HOLE+.5).toFixed(2)}, length(vP+uSun*ht-uHoleC)) : 0.;
        col += base*uSunCol*beam*uOpen*(.3+.7*max(dot(-N, uSun), 0.))*1.25*(1.-uPanel);
        col = mix(col, col*.16+CHAR*(uAmb+uSkyCol*.08), tape*.92);
        col *= 1.-.42*seam;
      } else {
        // from without
        col = base*(uSunCol*max(ndl, 0.)*.62+uSkyCol*(.46+.26*N.y))*fold;
        col += pow(base, vec3(1.3))*uSunCol*(1.-smoothstep(-.6, .2, ndl))*(.12+.28*pow(max(dot(-V, uSun), 0.), 2.))*fold;   // the sun through from the far side
        col += tr*uBurnCol*uBurn*300./(160.+lb*lb);
        col += (base+.05)*vec3(.95, 1., 1.1)*uOpen*exp(-max(lh-${N.HOLE.toFixed(1)}, 0.)/5.5)*.85;                    // the ring's light on the crown
        col = mix(col, col*.3, tape*.8);
        col *= 1.-.3*seam;
        col = mist(col, vP, length(cameraPosition-vP));
      }
      gl_FragColor = vec4(col, 1.);
    }`;return{U:n,cloth:S=>t({vertexShader:o,fragmentShader:u,side:e.DoubleSide,uniforms:{uPanel:{value:S?1:0}}}),sky:()=>t({side:e.BackSide,depthWrite:!1,depthTest:!1,uniforms:{},vertexShader:"varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix*vec4(mat3(viewMatrix)*position, 1.); gl_Position = p.xyww; }",fragmentShader:`
      precision highp float;
      ${re} ${Q}
      varying vec3 vD;
      void main(){
        vec3 d = normalize(vD); float h = max(d.y, 0.);
        vec2 dh = normalize(d.xz+1e-5), sh = normalize(uSun.xz);
        float sa = dot(dh, sh);
        vec3 zen = vec3(.026, .075, .29), mid = vec3(.13, .27, .64), hor = vec3(.42, .50, .76);
        vec3 c = mix(mid, zen, smoothstep(.12, .8, h)); c = mix(hor, c, smoothstep(0., .26, h));
        // toward the sun: peach, then hot orange low down
        c = mix(c, vec3(1.05, .58, .34), exp(-h*3.2)*pow(max(sa, 0.), 1.4)*.8);
        c = mix(c, vec3(1.6, .72, .17), exp(-h*9.)*pow(max(sa, 0.), 2.6)*.92);
        // away from it: the rose band over the blue shadow of the earth
        c = mix(c, vec3(.96, .52, .62), exp(-abs(h-.12)*12.)*max(-sa, 0.)*.62);
        c = mix(c, vec3(.24, .30, .52), exp(-h*24.)*max(-sa, 0.)*.8);
        float low = exp(-h*5.5);
        // high thin cloud, lit from below by the sun that has not reached the meadow yet
        vec2 q = d.xz/max(d.y+.12, .03)*1.4;
        float cf = fbm(q*vec2(.55, 1.5)+vec2(3.1, .7));
        float cl = smoothstep(.46, .78, cf)*smoothstep(.02, .22, d.y)*(1.-smoothstep(.6, .95, d.y));
        vec3 clc = mix(vec3(.98, .48, .46), vec3(1.45, .92, .48), pow(max(sa, 0.), 1.5))*(.55+.45*low);
        c = mix(c, clc, cl*(.5+.35*max(sa, 0.)));
        // long bars of low cloud toward the sun, dark with burning lower edges
        float bf = fbm(vec2(atan(d.x, -d.z)*2.2+1.7, h*34.));
        float bar = smoothstep(.52, .70, bf)*smoothstep(.015, .05, h)*(1.-smoothstep(.16, .30, h))*pow(max(sa, 0.), 1.2);
        c = mix(c, mix(vec3(1.5, .80, .30), vec3(.40, .30, .46), smoothstep(.56, .74, bf)), bar*.8);
        // the sun: a small disc in a tight glow
        float sd = max(dot(d, uSun), 0.);
        c += vec3(1., .78, .46)*(smoothstep(.99988, .99996, sd)*26.+pow(sd, 1400.)*.9+pow(sd, 80.)*.14+pow(sd, 8.)*.03);
        if (d.y < 0.) c = mix(c, uFogCol, (1.-smoothstep(-.05, 0., d.y)));
        gl_FragColor = vec4(c, 1.);
      }`}),land:S=>t({uniforms:{tLand:{value:S},uBalG:{value:Array.from({length:24},()=>new e.Vector4(0,0,0,0))}},vertexShader:"attribute float aSh; varying vec3 vP, vL, vN; varying float vSh; void main(){ vL = position; vN = normal; vSh = aSh; vec4 w = modelMatrix*vec4(position, 1.); vP = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }",fragmentShader:`
      precision highp float;
      ${re} ${Q}
      uniform sampler2D tLand; uniform vec4 uBalG[24];
      varying vec3 vP, vL, vN; varying float vSh;
      float riverZ(float x){ return -215.-45.*sin(x/150.+1.)-15.*sin(x/55.+.4); }
      float profR(float h){ return h <= 46. ? 9.+21.*sin(3.14159*h/92.) : 30.*sqrt(max(0., 1.-(h-46.)*(h-46.)/676.)); }
      // the fields: a skewed patchwork. x: the metres to the nearest hedge; y, z: two chances of the field
      vec3 fieldAt(vec2 p){
        vec2 w = p+84.*vec2(vnoise(p*.0041+3.)-.5, vnoise(p*.0037+11.)-.5);
        vec2 q = vec2((w.x+.35*w.y+3000.)/118., (w.y-.2*w.x+3000.)/86.);
        float hb = hash21(floor(q*.5)+5.7); vec2 sz = vec2(1.);
        if (hb < .30){ q *= .5; sz = vec2(2.); } else if (hb < .52){ q.x *= .5; sz.x = 2.; } else if (hb < .70){ q.y *= .5; sz.y = 2.; }
        vec2 fi = floor(q), ff = fract(q);
        return vec3(min(min(ff.x, 1.-ff.x)*118.*sz.x, min(ff.y, 1.-ff.y)*86.*sz.y), hash21(fi+sz*3.1), hash21(fi+17.3+sz));
      }
      void main(){
        vec2 p = vL.xz; float dist = length(cameraPosition-vP);
        vec4 t = texture2D(tLand, p/4096.+.5);
        float n1 = fbm(p*.012), nearK = (1.-smoothstep(80., 700., dist)), n2 = fbm(p*.11+7.), n3 = vnoise(p*1.7);
        float rr = length(p), hgt = vL.y;
        vec3 Nv = normalize(vN);
        vec2 a = normalize(uSun.xz); float te = uSun.y/length(uSun.xz);
        float rz = riverZ(p.x), rw = 13.+5.*sin(p.x/90.), rd = abs(p.y-rz);
        // the launch meadow: dew-dark grass, paler where it grows long in drifts, flowers close by
        vec3 grass = mix(vec3(.036, .092, .022), vec3(.062, .124, .028), smoothstep(.3, .7, n1));
        grass = mix(grass, vec3(.100, .128, .040), .5*smoothstep(.46, .70, fbm(p*.045+21.)));
        float bl = vnoise(p*7.)*.45+vnoise(p*19.)*.35+vnoise(p*47.)*.2;
        grass *= mix(1., .72+.56*bl, (1.-smoothstep(4., 60., dist)));
        grass *= .93+.14*n3*(1.-smoothstep(20., 160., dist));
        float px = dist*.0017;   // about the metres one line of the picture spans out there
        float tuft = (vnoise(p*.33)-.5)*(1.-smoothstep(1.2, 4., px))+(vnoise(p*.9+5.)-.5)*.8*(1.-smoothstep(.45, 1.5, px))+(vnoise(p*2.4+9.)-.5)*.6*(1.-smoothstep(.17, .55, px));
        grass *= 1.+.6*tuft;
        // beyond the meadow and over the river: fields, each with a crop of its own, hedges between
        float mead = (1.-smoothstep(250., 276., rr+52.*(n1-.5)))*step(rz, p.y);
        vec3 fl = fieldAt(p);
        vec3 crop = fl.y < .30 ? vec3(.046, .108, .026) : (fl.y < .45 ? vec3(.210, .160, .052) : (fl.y < .70 ? vec3(.080, .158, .032) : (fl.y < .81 ? vec3(.100, .074, .046) : (fl.y < .95 ? vec3(.270, .220, .024) : vec3(.135, .080, .200)))));
        float sd = fl.z < .5 ? p.x+.35*p.y : p.y-.2*p.x, sw = fl.y < .5 ? 9. : 5.;
        float stripe = mix(.5, .5+.5*sin(sd*6.2832/sw), 1.-smoothstep(.15, .5, fwidth(sd)/sw));
        crop *= (.90+.20*stripe)*(.82+.36*n1); crop = mix(vec3(.080, .122, .040)*(.8+.4*n1), crop, .25+.75*(1.-smoothstep(1100., 2400., rr)));
        float hedge = 1.-smoothstep(2.4, 3.8, fl.x+(vnoise(p*.13)-.5)*3.);
        float lowl = (1.-smoothstep(8., 30., hgt))*(1.-smoothstep(1100., 2400., rr)); hedge *= lowl;
        float hsh = max(1.-smoothstep(2.4, 5., fieldAt(p+a*8.).x), .7*(1.-smoothstep(2.4, 5., fieldAt(p+a*17.).x)))*(1.-hedge)*lowl;
        // a lane across the launch field: two ruts worn pale, the grass short between
        float lnd = abs(p.y-(16.+6.*sin(p.x/40.)+3.*sin(p.x/13.+1.)));
        if (p.y > 15.) lnd = min(lnd, abs(p.x-(-28.+8.*sin(p.y/50.))));
        grass = mix(grass, vec3(.095, .112, .044), (1.-smoothstep(1.8, 3.2, lnd))*.4);
        grass = mix(grass, vec3(.21, .165, .095), (1.-smoothstep(.22, .6, abs(lnd-1.1)))*(.55+.45*vnoise(p*1.3))*.85);
        grass = mix(crop, grass, mead);
        grass = mix(grass, vec3(.018, .042, .018)*(.7+.6*vnoise(p*.4)), hedge*(1.-mead));
        grass = mix(grass, vec3(.028, .058, .024), (1.-smoothstep(rw+1., rw+8., rd))*.8);   // the reeds of the banks
        // the foothills are wooded; above the trees grass and scree, then rock, and snow on the far range
        float steep = 1.-Nv.y;
        vec3 forest = mix(vec3(.018, .058, .026), vec3(.036, .092, .030), fbm(p*.006+5.))*(.8+.45*fbm(p*.07+2.)*(1.-smoothstep(250., 1600., dist)));
        grass = mix(grass, forest, smoothstep(10., 48., hgt)*.97);
        vec3 rock = mix(vec3(.165, .120, .100), vec3(.240, .170, .140), fbm(p*.003+1.));
        float alp = smoothstep(400., 620., hgt+90.*(fbm(p*.004+9.)-.5));
        grass = mix(grass, mix(vec3(.095, .110, .045), rock, smoothstep(.10, .30, steep)), alp);
        float snow = smoothstep(780., 960., hgt+150.*(fbm(p*.0025+3.)-.5))*(1.-smoothstep(.42, .72, steep));
        grass = mix(grass, vec3(.52, .52, .60), snow);
        // light: the low sun rakes the land; the long shadows of trees, hedges, balloons and hills
        float trs = .25*(texture2D(tLand, (p+vec2(3., 1.))/4096.+.5).r+texture2D(tLand, (p+vec2(-3., -1.))/4096.+.5).r+texture2D(tLand, (p+vec2(1., -3.))/4096.+.5).r+texture2D(tLand, (p+vec2(-1., 3.))/4096.+.5).r);
        float sh = (1.-.72*trs)*(1.-.6*hsh*(1.-mead))*vSh;
        for (int i = 0; i < 24; i++){
          vec4 b = uBalG[i]; if (b.w <= 0.) continue;
          // b: where a balloon stands, and how high its mouth is over the land. The sun's ray from this ground passes its axis D*te up
          vec2 d = p-b.xz; float D = -dot(d, a); if (D <= 0.) continue;
          float hh = D*te-b.y; if (hh < -15. || hh > 72.) continue;
          float rad = hh < -11.5 ? 2.4 : (hh < 0. ? 0. : profR(min(hh, 72.)));
          float soft = 2.2+D*.045;
          sh *= 1.-.62*b.w*(1.-smoothstep(rad-soft, rad+soft, abs(dot(d, vec2(-a.y, a.x)))))*step(.5, rad);
        }
        // the hills' own relief: gullies and spurs too small for the land's mesh, as a tilt of the light
        vec2 pb = p*.0045+2.3; float e0 = abs(fbm(pb)-.5), hm = smoothstep(25., 110., hgt);
        vec3 nrm = normalize(Nv+vec3(e0-abs(fbm(pb+vec2(.16, 0.))-.5), 0., e0-abs(fbm(pb+vec2(0., .16))-.5))*7.*hm+vec3((n1-.5)*.2*(1.-.7*mead)+(n3-.5)*.1*nearK, 0., (n2-.5)*.18*nearK));
        float ndl = max(dot(nrm, uSun), 0.);
        float sun = 5.*ndl/(1.+2.2*ndl)*sh;
        vec3 col = grass*(uSunCol*sun+uSkyCol*(.30+.26*nrm.y));
        // dew: the grass toward the sun shines pale
        vec3 V = normalize(cameraPosition-vP);
        col += uSunCol*pow(max(dot(normalize(V+uSun), nrm), 0.), 24.)*.06*sh*(1.-smoothstep(20., 700., dist))*(1.-smoothstep(10., 40., hgt));
        // the river: a mirror of the sky, deep overhead and pale far off, and a path of gold toward the sun
        float rv = 1.-smoothstep(rw-2., rw+1., rd);
        vec2 lc = vec2(cos(uTime*${(6.283185307/N.LOOP).toFixed(6)}), sin(uTime*${(6.283185307/N.LOOP).toFixed(6)}));   // one turn in a loop of the clock: every drift below closes on itself
        vec3 wn = normalize(vec3((vnoise(p*.9+1.9*lc)-.5)*.10, 1., (vnoise(p*.7+9.-1.6*lc.yx)-.5)*.10));
        vec3 rf = reflect(-V, wn); float fres = pow(max(1.-max(V.y, 0.), 0.), 3.);
        vec3 wat = mix(vec3(.030, .085, .26), vec3(.46, .56, .82), fres);
        float gp = max(dot(rf, uSun), 0.);
        wat += vec3(1.5, .86, .36)*(pow(gp, 14.)*.9+pow(gp, 220.)*4.*(.4+1.2*vnoise(p*2.3+8.3*lc)));
        col = mix(col, wat*(.5+.5*sh), rv);
        // mist: in the hollows, and in thin ribbons beside the river
        float mk = .40*t.a*smoothstep(.35, .75, fbm(p*.006+.025*lc));
        mk = max(mk, .42*smoothstep(8., 30., rd)*(1.-smoothstep(30., 130., rd))*smoothstep(.40, .68, fbm(p*.011+3.+.019*lc.yx)));
        float tsm = pow(max(dot(-V, uSun), 0.), 3.);
        col = mix(col, mix(vec3(.50, .56, .78), vec3(1.25, .80, .46), .8*tsm)*(.55+.55*sh), mk*.7);
        col = mist(col, vP, dist);
        gl_FragColor = vec4(col, 1.);
      }`}),solid:S=>t({uniforms:{},side:e.DoubleSide,defines:S?{INST:1}:{},vertexShader:`
      attribute vec3 aCol; attribute float aS; varying vec3 vP, vN, vC, vL; varying float vS, vT;
      void main(){ vC = aCol; vS = aS; vL = position; vT = .5;
        #ifdef INST
        vec4 w = modelMatrix*instanceMatrix*vec4(position, 1.); vN = normalize(mat3(modelMatrix)*mat3(instanceMatrix)*normal); vT = fract(sin(dot(instanceMatrix[3].xz, vec2(12.9898, 78.233)))*43758.5453);
        #else
        vec4 w = modelMatrix*vec4(position, 1.); vN = normalize(mat3(modelMatrix)*normal);
        #endif
        vP = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
      precision highp float;
      ${re} ${Q}
      varying vec3 vP, vN, vC, vL; varying float vS, vT;
      void main(){
        vec3 N = normalize(vN), V = normalize(cameraPosition-vP); if (dot(N, V) < 0.) N = -N;
        vec3 base = vC; float spec = 0.;
        if (vS > .5 && vS < 1.5){            // wicker: weavers over and under the stakes
          float wu = (vL.x+vL.z)*2.6, wy = vL.y*7.; float over = step(.5, fract(wu+.5*mod(floor(wy), 2.)));
          float fine = 1.-smoothstep(.25, .7, fwidth(wy));
          base *= mix(.82, (.50+.50*over)*(.45+.55*sin(fract(wy)*3.1416))+.14, fine); }
        else if (vS > 1.5 && vS < 2.5){ spec = pow(max(dot(reflect(-V, N), uSun), 0.), 40.)*1.2; base *= .8+.2*sin(vL.y*40.); }
        else if (vS > 3.5){ float pl = fract(vL.x*2.1); base *= (.62+.38*smoothstep(.03, .09, pl)*(1.-smoothstep(.93, .98, pl)))*(.8+.4*vnoise(vec2(floor(vL.x*2.1)*7.3, vL.z*2.5))); }   // boards
        else if (vS < .5){ base *= (.50+.85*fbm(vL.xz*5.+vL.y*4.))*(.72+.38*N.y)*mix(vec3(.80, 1., .86), vec3(1.30, 1.08, .66), vT); }
        float ndl = vS < .5 ? max((dot(N, uSun)+.5)/1.5, 0.) : max(dot(N, uSun), 0.);
        vec3 Lb = uBurnP-vP; float lb = length(Lb);
        vec3 col = base*(uSunCol*ndl*.9+uSkyCol*(.40+.28*N.y)+vec3(.20, .24, .09)*(.5-.5*N.y))+uSunCol*spec*.5;
        if (vS < .5) col += base*uSunCol*pow(max(dot(-V, uSun), 0.), 3.)*pow(max(1.-abs(dot(N, V)), 0.), 1.5)*1.6;
        col += base*uBurnCol*uBurn*max(dot(N, Lb/lb), .1)*min(500./(60.+lb*lb), 1.5);
        col = mist(col, vP, length(cameraPosition-vP));
        gl_FragColor = vec4(col, 1.);
      }`}),others:()=>t({uniforms:{},side:e.DoubleSide,vertexShader:`
      attribute vec3 aC1, aC2, aC3; attribute vec4 aK; varying vec3 vP, vN, vC1, vC2, vC3; varying vec2 vUv; varying vec4 vK; varying float vY;
      void main(){ vC1 = aC1; vC2 = aC2; vC3 = aC3; vK = aK; vUv = uv; vY = position.y;
        vec4 w = modelMatrix*instanceMatrix*vec4(position, 1.); vN = normalize(mat3(modelMatrix)*mat3(instanceMatrix)*normal); vP = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
      precision highp float;
      ${re} ${Q}
      varying vec3 vP, vN, vC1, vC2, vC3; varying vec2 vUv; varying vec4 vK; varying float vY;
      void main(){
        vec3 N = normalize(vN), V = normalize(cameraPosition-vP); bool back = dot(N, V) < 0.;
        float g = vUv.x, v = vUv.y, gi = floor(g), band = floor(v*14.), k = vK.x;
        vec3 base;
        if (v < -1.5) base = vec3(.030, .026, .024);                                        // ropes, the burner frame
        else if (v < 0.) base = vec3(.20, .115, .045)*(.75+.25*step(.5, fract(vY*2.)));     // the basket
        else if (v < .05) base = vec3(.03, .03, .04);
        else if (k < .5) base = mod(gi, 2.) < 1. ? vC1 : vC2;                                // gores of two colours
        else if (k < 1.5) base = mod(gi+band, 3.) < 1. ? vC1 : (mod(gi+band, 3.) < 2. ? vC2 : vC3);   // a spiral of three
        else if (k < 2.5) base = mod(band, 3.) < 1. ? vC1 : (mod(band, 3.) < 2. ? vC2 : vC3);          // hoops
        else if (k < 3.5) base = mod(floor(v*14.+abs(fract(g*.5)-.5)*4.), 2.) < 1. ? vC1 : vC2;      // a zigzag
        else base = (v > .42 && v < .56) ? vC2 : vC1;                                        // one belt
        float bulge = abs(fract(g)-.5)*2.;
        if (v >= 0.){ base *= .80+.20*(1.-bulge*bulge); N = normalize(N+normalize(cross(vec3(0., 1., 0.), N)+1e-5)*(.5-fract(g))*.6*(back ? -1. : 1.)); }
        float ndl = dot(N, uSun);
        vec3 col = base*(uSunCol*max(ndl, 0.)*.56+uSkyCol*(.30+.20*N.y));
        if (back) col = base*(uSunCol*smoothstep(-.1, .5, ndl)*.5+uSkyCol*.3);
        // the sun comes through the far side and lights the shaded half from within, most when seen against the sun; a burning edge
        float vs = max(dot(-V, uSun), 0.);
        if (v >= 0.){ col += pow(base, vec3(1.3))*uSunCol*(1.-smoothstep(-.55, .25, ndl))*(.14+.30*vs*vs);
          col += uSunCol*pow(max(1.-abs(dot(N, V)), 0.), 4.)*pow(vs, 5.)*.35; }
        // its burner: a loop on the world's clock; the cloth glows from within, strongest low down
        float fire = pow(max(sin(uTime*6.2832*vK.z/${N.LOOP}.+vK.y), 0.), 5.)*vK.w;
        if (v >= 0.) col += pow(base, vec3(.8))*uBurnCol*fire*(2.2-1.5*smoothstep(0., .7, v));
        col = mist(col, vP, length(cameraPosition-vP));
        gl_FragColor = vec4(col, 1.);
      }`}),flame:()=>t({uniforms:{uLen:{value:6},uRad:{value:1.5},uPow:{value:0}},side:e.DoubleSide,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneFactor,vertexShader:`
      uniform float uLen, uRad, uTime; attribute float aIn; varying vec3 vN, vV, vL, vAx; varying float vY, vIn;
      void main(){ float y = position.y; vY = y; vIn = aIn; vAx = normalize(mat3(modelMatrix)*vec3(0., 1., 0.));
        float rad = uRad*mix(1., .45, aIn)*(.22+.78*smoothstep(0., .4, y))*(1.-.78*smoothstep(.5, 1., y));
        vec3 p = vec3(position.x*rad, y*uLen, position.z*rad);
        p.xz += .22*uRad*y*vec2(sin(uTime*${(57*6.283185307/N.LOOP).toFixed(5)}+y*7.), cos(uTime*${(46*6.283185307/N.LOOP).toFixed(5)}+y*5.));
        vL = p; vec4 w = modelMatrix*vec4(p, 1.); vN = normalize(mat3(modelMatrix)*vec3(position.x, .15, position.z)); vV = cameraPosition-w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
      precision highp float;
      ${Q}
      uniform float uPow, uTime, uLen; varying vec3 vN, vV, vL, vAx; varying float vY, vIn;
      void main(){
        float lw = uTime/${N.LOOP}., tb = uTime-${N.LOOP}.;   // the rising noise at this clock and one loop back, crossfaded: the loop closes
        float n = mix(fbm(vec2(vL.x*.9+vL.z*.7, vL.y*.42-uTime*8.)), fbm(vec2(vL.x*.9+vL.z*.7, vL.y*.42-tb*8.)), lw), n2 = mix(fbm(vec2(vL.x*2.3-vL.z*1.9, vL.y*.9-uTime*12.)), fbm(vec2(vL.x*2.3-vL.z*1.9, vL.y*.9-tb*12.)), lw);
        float body = smoothstep(0., .05, vY)*(1.-smoothstep(.34+.60*n, 1., vY));
        vec3 Vn = normalize(vV);
        float edge = pow(abs(dot(normalize(vN), Vn)), 1.2);
        float vis = mix(edge, .5, smoothstep(.45, .92, abs(dot(Vn, vAx))));
        float tong = smoothstep(.30, .62, n*.6+n2*.4+.30*(1.-vY));
        vec3 col = mix(vec3(1., .16, .01), vec3(1., .56, .14), clamp((1.-vY)*.9+.25*vIn, 0., 1.));
        col = mix(col, vec3(1., .86, .50), vIn*(1.-smoothstep(.1, .7, vY)));
        col = mix(col, vec3(.20, .40, 1.), (1.-smoothstep(.0, .10, vY))*.85);
        float a = body*vis*tong*(.55+.9*n2)*uPow;
        gl_FragColor = vec4(col*a*(1.5+.8*vIn), 1.);
      }`}),glow:()=>t({uniforms:{uPow:{value:0},uSize:{value:30}},transparent:!0,depthWrite:!1,depthTest:!0,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneFactor,vertexShader:"uniform float uPx, uSize; void main(){ vec4 mv = viewMatrix*modelMatrix*vec4(position, 1.); gl_Position = projectionMatrix*mv; gl_PointSize = min(uSize*uPx/max(-mv.z, 1.), 900.); }",fragmentShader:"precision highp float; uniform float uPow; uniform vec3 uBurnCol; void main(){ float r = length(gl_PointCoord-.5)*2.; float a = pow(max(1.-r, 0.), 3.2); gl_FragColor = vec4(uBurnCol*a*uPow, 1.); }"}),shaft:()=>t({uniforms:{uGain:{value:1}},side:e.DoubleSide,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneFactor,vertexShader:"varying vec3 vN, vV, vP; varying float vA; void main(){ vA = uv.y; vP = position; vN = normal; vV = cameraPosition-position; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.); }",fragmentShader:`
      precision highp float;
      ${Q}
      uniform vec3 uSunCol; uniform float uOpen, uGain, uTime; varying vec3 vN, vV, vP; varying float vA;
      void main(){
        float edge = pow(abs(dot(normalize(vN), normalize(vV))), 1.6);
        float a = edge*(1.-smoothstep(.55, 1., vA))*smoothstep(0., .04, vA)*(.75+.25*fbm(vP.xz*.2+vP.y*.13+.32*vec2(cos(uTime*${(6.283185307/N.LOOP).toFixed(6)}), sin(uTime*${(6.283185307/N.LOOP).toFixed(6)}))));
        gl_FragColor = vec4(uSunCol*a*uOpen*uGain*.045, 1.);
      }`}),dispose(){for(const S of s)S.dispose()}}}function Pe(n){const s=N.NG*N.SEG,t=N.NV,o=s+1,u=o*t,l=new Float64Array(t),a=new Float64Array(t),d=new Float64Array(t);{const L=[0],B=[0];let U=0,z=J(0),H=0;for(let G=1;G<=4e3;G++){const T=N.H*G/4e3,R=J(T);H+=Math.hypot(T-U,R-z),L.push(H),B.push(T),U=T,z=R}let I=0;for(let G=0;G<t;G++){const T=H*G/(t-1);for(;I<3999&&L[I+1]<T;)I++;const R=(T-L[I])/Math.max(L[I+1]-L[I],1e-9);l[G]=B[I]+(B[I+1]-B[I])*R,a[G]=J(l[G]),d[G]=T}l[t-1]=N.H,a[t-1]=N.HOLE}const h=new Float32Array(u*3),g=new Float32Array(u*3),m=new Float32Array(u*2),M=new Float32Array(u*2),v=new Uint32Array(s*(t-1)*6),S=new Float64Array(o),w=new Float64Array(o),f=new Float64Array(o);for(let A=0;A<o;A++){const L=W*A/s;S[A]=Math.cos(L),w[A]=Math.sin(L),f[A]=Math.sin(Math.PI*(A%N.SEG/N.SEG))}let b=0;for(let A=0;A<t;A++)for(let L=0;L<o;L++){const B=A*o+L;m[B*2]=L/N.SEG,m[B*2+1]=A/(t-1),M[B*2]=a[A],M[B*2+1]=l[A]}for(let A=0;A<t-1;A++)for(let L=0;L<s;L++){const B=A*o+L,U=B+1,z=B+o,H=z+1;v[b++]=B,v[b++]=z,v[b++]=U,v[b++]=U,v[b++]=z,v[b++]=H}const p=new e.BufferGeometry,y=new e.BufferAttribute(h,3),r=new e.BufferAttribute(g,3);y.setUsage(e.DynamicDrawUsage),r.setUsage(e.DynamicDrawUsage),p.setAttribute("position",y),p.setAttribute("normal",r),p.setAttribute("uv",new e.BufferAttribute(m,2)),p.setAttribute("aAux",new e.BufferAttribute(M,2)),p.setIndex(new e.BufferAttribute(v,1)),p.boundingSphere=new e.Sphere(new e.Vector3(0,40,-40),400);const i=new e.Mesh(p,n);i.frustumCulled=!1,i.name="cloth";const c={},x={},C=W*7/N.LOOP,F=W*4/N.LOOP,P=W*11/N.LOOP,k=(A,L,B)=>(.1+.3*(1-L)*(.3+.7*B))*j(A,0,8)*(1-.7*j(A,64,N.H));function V(A,L){le(A.th,c);const B=-A.H+.05,U=L%N.LOOP;for(let z=0;z<t;z++){he(l[z],A,c,x);const H=k(l[z],x.up,x.wave),I=d[z],G=.02*x.up,T=.19*I-C*U,R=.47*I+F*U+1.3,$=1.1*I-P*U;for(let E=0;E<o;E++){const _=(z*o+E)*3,q=S[E],Y=w[E],K=1+G*(f[E]-.6);let X=x.ax*q*K,ee=x.b*Y*K;const te=x.b*q,oe=x.ax*Y,ne=Math.hypot(te,oe)||1,ae=H*(.55*Math.sin(T+2*Y)+.3*Math.sin(R+5*q)+.15*Math.sin($+3*W*E/s));X+=te/ne*ae,ee+=oe/ne*ae;const se=x.cy+c.c*ee;h[_]=X,h[_+1]=se<B?B:se,h[_+2]=x.cz+c.s*ee}}for(let z=0;z<t;z++){const H=z>0?z-1:z,I=z<t-1?z+1:z;for(let G=0;G<o;G++){const T=G>0?G-1:s-1,R=G<s?G+1:1,$=(z*o+T)*3,E=(z*o+R)*3,_=(H*o+G)*3,q=(I*o+G)*3,Y=(z*o+G)*3,K=h[E]-h[$],X=h[E+1]-h[$+1],ee=h[E+2]-h[$+2],te=h[q]-h[_],oe=h[q+1]-h[_+1],ne=h[q+2]-h[_+2];let ae=oe*ee-ne*X,se=ne*K-te*ee,de=te*X-oe*K;const fe=Math.hypot(ae,se,de)||1;g[Y]=ae/fe,g[Y+1]=se/fe,g[Y+2]=de/fe}}y.needsUpdate=!0,r.needsUpdate=!0}return{mesh:i,geometry:p,update:V,rim:(A,L)=>{const B=Math.round(s*(A+.5)/4)%s;return L.set(h[B*3],h[B*3+1],h[B*3+2])},rippleAmp:k,hs:l,rs:a}}function Ce(n){const l=new Float32Array(1323),a=new Float32Array(441*3),d=new Float32Array(441*2),h=new Float32Array(441*2),g=[];for(let p=0;p<=8;p++)for(let y=0;y<49;y++){const r=p*49+y;d[r*2]=y/48*24,d[r*2+1]=.9,h[r*2]=Math.max(N.PANEL*p/8,.4),h[r*2+1]=N.H}for(let p=0;p<8;p++)for(let y=0;y<48;y++){const r=p*49+y,i=r+1,c=r+49,x=c+1;g.push(r,i,c,i,x,c)}const m=new e.BufferGeometry,M=new e.BufferAttribute(l,3),v=new e.BufferAttribute(a,3);M.setUsage(e.DynamicDrawUsage),v.setUsage(e.DynamicDrawUsage),m.setAttribute("position",M),m.setAttribute("normal",v),m.setAttribute("uv",new e.BufferAttribute(d,2)),m.setAttribute("aAux",new e.BufferAttribute(h,2)),m.setIndex(g);const S=new e.Mesh(m,n);S.frustumCulled=!1,S.name="rip-top";const w={},f={};function b(p,y){le(p.th,w),he(N.H,p,w,f);const r=p.open,i=r*(N.HOLE+.5),c=W*3*(y%N.LOOP)/N.LOOP,x=f.ax/N.HOLE,C=f.b/N.HOLE,F=-p.H+.08;for(let P=0;P<=8;P++){const k=i+(N.PANEL-i)*P/8,V=.32*r*(1-P/8);for(let O=0;O<49;O++){const A=W*O/48,L=(P*49+O)*3,B=x*k*Math.cos(A),U=C*k*Math.sin(A),z=-1.2+.7*f.up*(1-r)*(1-(k/N.PANEL)**2)+V*Math.sin(A*16+.6*Math.sin(c+A*3)),H=f.cy+w.s*z+w.c*U;l[L]=B,l[L+1]=H<F?F:H,l[L+2]=f.cz-w.c*z+w.s*U}}for(let P=0;P<=8;P++){const k=P>0?P-1:P,V=P<8?P+1:P;for(let O=0;O<49;O++){const A=O>0?O-1:47,L=O<48?O+1:1,B=(P*49+A)*3,U=(P*49+L)*3,z=(k*49+O)*3,H=(V*49+O)*3,I=(P*49+O)*3,G=l[U]-l[B],T=l[U+1]-l[B+1],R=l[U+2]-l[B+2],$=l[H]-l[z],E=l[H+1]-l[z+1],_=l[H+2]-l[z+2];let q=T*_-R*E,Y=R*$-G*_,K=G*E-T*$;const X=Math.hypot(q,Y,K)||1;P===0&&r<.02?(q=0,Y=w.s,K=-w.c,a[I]=q,a[I+1]=Y,a[I+2]=K):(a[I]=q/X,a[I+1]=Y/X,a[I+2]=K/X)}}M.needsUpdate=!0,v.needsUpdate=!0}return{mesh:S,geometry:m,update:b}}function ce(){const n=[],s=[],t=[],o=[],u=[];let l=0;const a=new e.Matrix4,d=new e.Quaternion,h=new e.Euler,g=new e.Vector3,m=new e.Matrix3,M=new e.Color;return{add(v,{p:S=[0,0,0],r:w=[0,0,0],s:f=[1,1,1],c:b="#ffffff",surf:p=3}={}){a.compose(new e.Vector3(...S),d.setFromEuler(h.set(w[0],w[1],w[2])),new e.Vector3(...typeof f=="number"?[f,f,f]:f)),m.getNormalMatrix(a),typeof b=="string"?M.set(b):M.setRGB(b[0],b[1],b[2]);const y=v.attributes.position,r=v.attributes.normal,i=v.index;for(let c=0;c<y.count;c++)g.fromBufferAttribute(y,c).applyMatrix4(a),n.push(g.x,g.y,g.z),g.fromBufferAttribute(r,c).applyMatrix3(m).normalize(),s.push(g.x,g.y,g.z),t.push(M.r,M.g,M.b),o.push(p);if(i)for(let c=0;c<i.count;c++)u.push(l+i.getX(c));else for(let c=0;c<y.count;c++)u.push(l+c);return l+=y.count,v.dispose(),this},build(){const v=new e.BufferGeometry;return v.setAttribute("position",new e.Float32BufferAttribute(n,3)),v.setAttribute("normal",new e.Float32BufferAttribute(s,3)),v.setAttribute("aCol",new e.Float32BufferAttribute(t,3)),v.setAttribute("aS",new e.Float32BufferAttribute(o,1)),v.setIndex(u),v},get count(){return u.length/3}}}function ze(){const n=ce(),s="#a06e36",t="#7a4e24",o="#4a2416",u="#9aa0a8",l="#8a1420";n.add(new e.BoxGeometry(4.6,3.3,3.6),{p:[0,1.65,0],c:s,surf:1}),n.add(new e.BoxGeometry(4.68,.5,3.68),{p:[0,2.35,0],c:t,surf:1});for(const a of[-1,1])n.add(new e.CylinderGeometry(.24,.24,5,10),{p:[0,3.36,a*1.8],r:[0,0,Math.PI/2],c:o,surf:3}),n.add(new e.CylinderGeometry(.24,.24,3.9,10),{p:[a*2.3,3.36,0],r:[Math.PI/2,0,0],c:o,surf:3});for(const a of[-1,1])for(const d of[-1,1])n.add(new e.CylinderGeometry(.19,.19,3.3,8),{p:[a*2.3,1.65,d*1.8],c:o,surf:3});n.add(new e.BoxGeometry(4.5,.16,3.5),{p:[0,-.02,0],c:"#94704a",surf:4});for(const a of[-1,0,1])n.add(new e.BoxGeometry(4.4,.12,.3),{p:[0,-.14,a*1.3],c:"#6a4826",surf:3});for(const a of[-1,1])n.add(new e.BoxGeometry(.32,.3,4),{p:[a*1.6,-.24,0],c:"#5a3a1c",surf:3});for(const a of[-1,1])for(const d of[-1,1])n.add(new e.TorusGeometry(.32,.06,6,12,Math.PI),{p:[a*1.2,1.55,d*1.84],r:[Math.PI,0,0],c:"#d8c8a0",surf:3});for(const a of[-1,1])for(const d of[-1,1])n.add(new e.CylinderGeometry(.16,.16,2.7,8),{p:[a*1.85,4.75,d*1.5],r:[d*-.05,0,a*.06],c:l,surf:3}),n.add(new e.CylinderGeometry(.42,.42,2.5,12),{p:[a*1.65,1.6,d*1.15],c:u,surf:2});for(const a of[-1,1])n.add(new e.BoxGeometry(3.5,.2,.2),{p:[0,6,a*1.6],c:u,surf:2}),n.add(new e.BoxGeometry(.2,.2,3.4),{p:[a*1.65,6,0],c:u,surf:2});for(const a of[-1,1]){n.add(new e.CylinderGeometry(.42,.34,1.25,14),{p:[a*.55,6.5,0],c:u,surf:2}),n.add(new e.BoxGeometry(.3,.3,3.3),{p:[a*.55,6,0],c:"#555b62",surf:2});for(let d=0;d<3;d++)n.add(new e.TorusGeometry(.5,.05,6,16),{p:[a*.55,6.72+d*.17,0],r:[Math.PI/2,0,0],c:"#c8a070",surf:2})}return n.build()}function Le(){const n=ce(),s="#3a3e44",t="#c89a18";for(const o of[0,.9]){for(const[u,l,a]of[[1.75,.07,36],[1.2,.035,28],[.62,.035,20]])n.add(new e.TorusGeometry(u,l,5,a),{p:[0,2.1,o],c:s,surf:2});for(let u=0;u<12;u++){const l=W*u/12;n.add(new e.BoxGeometry(1.5,.035,.035),{p:[1*Math.cos(l),2.1+1*Math.sin(l),o],r:[0,0,l],c:s,surf:2})}}for(let o=0;o<16;o++){const u=W*o/16;n.add(new e.BoxGeometry(.05,.05,.9),{p:[1.75*Math.cos(u),2.1+1.75*Math.sin(u),.45],c:s,surf:2})}n.add(new e.CylinderGeometry(.4,.4,.95,14),{p:[0,2.1,1.45],r:[Math.PI/2,0,0],c:"#55595f",surf:2});for(let o=0;o<5;o++)n.add(new e.CylinderGeometry(.52,.52,.05,14),{p:[0,2.1,1.12+o*.16],r:[Math.PI/2,0,0],c:"#787d84",surf:2});n.add(new e.CylinderGeometry(.28,.28,.8,12),{p:[0,2.86,1.45],r:[0,0,Math.PI/2],c:"#a01818",surf:3});for(const o of[-1,1])n.add(new e.SphereGeometry(.28,10,8),{p:[o*.4,2.86,1.45],c:"#a01818",surf:3}),n.add(new e.BoxGeometry(.12,2.5,.12),{p:[o*1.42,1.05,.05],r:[.2,0,o*.17],c:t,surf:3}),n.add(new e.BoxGeometry(.12,2.6,.12),{p:[o*1.42,1.05,1.05],r:[-.34,0,o*.17],c:t,surf:3}),n.add(new e.BoxGeometry(.12,.12,2.3),{p:[o*1.62,.1,.6],c:t,surf:3}),n.add(new e.TorusGeometry(.34,.13,8,16),{p:[o*1.8,.47,1.55],r:[0,Math.PI/2,0],c:"#1c1c1e",surf:3}),n.add(new e.CylinderGeometry(.2,.2,.16,10),{p:[o*1.8,.47,1.55],r:[0,0,Math.PI/2],c:"#b8bcc0",surf:2});n.add(new e.BoxGeometry(3.6,.1,.1),{p:[0,.47,1.55],c:s,surf:2}),n.add(new e.BoxGeometry(2.9,.1,.1),{p:[0,3,2],c:t,surf:3});for(const o of[-1,1])n.add(new e.BoxGeometry(.1,1.5,.1),{p:[o*1.4,2.4,1.7],r:[-.42,0,0],c:t,surf:3});return n.build()}function Be(){const n=ce();for(let s=0;s<5;s++){const t=W*s/5;n.add(new e.BoxGeometry(1.35,.46,.04),{p:[.85*Math.cos(t),.85*Math.sin(t),0],r:[.42,0,t],c:"#d0d4d8",surf:2})}return n.add(new e.CylinderGeometry(.25,.25,.3,12),{r:[Math.PI/2,0,0],c:"#30343a",surf:2}),n.add(new e.ConeGeometry(.25,.4,12),{p:[0,0,-.35],r:[-Math.PI/2,0,0],c:"#c89a18",surf:3}),n.build()}function Ge(n){const t=new Float32Array(96),o=new Float32Array(96),u=new Float32Array(96).fill(.42),l=new Float32Array(32).fill(3),a=[];for(let p=0;p<4;p++){const y=p*8;for(let r=0;r<4;r++){const i=y+r,c=y+(r+1)%4,x=i+4,C=c+4;a.push(i,c,x,c,C,x)}}const d=new e.BufferGeometry,h=new e.BufferAttribute(t,3),g=new e.BufferAttribute(o,3);h.setUsage(e.DynamicDrawUsage),g.setUsage(e.DynamicDrawUsage),d.setAttribute("position",h),d.setAttribute("normal",g),d.setAttribute("aCol",new e.BufferAttribute(u,3)),d.setAttribute("aS",new e.BufferAttribute(l,1)),d.setIndex(a);const m=new e.Mesh(d,n);m.frustumCulled=!1,m.name="cables";const M=new e.Vector3,v=new e.Vector3,S=new e.Vector3,w=new e.Vector3(1,0,0),f=.05;return{mesh:m,geometry:d,set:(p,y,r)=>{M.subVectors(r,y).normalize(),v.crossVectors(M,w),v.lengthSq()<1e-4&&v.set(0,1,0),v.normalize(),S.crossVectors(M,v);for(let i=0;i<2;i++){const c=i?r:y;for(let x=0;x<4;x++){const C=x*Math.PI/2,F=Math.cos(C),P=Math.sin(C),k=(p*8+i*4+x)*3,V=v.x*F+S.x*P,O=v.y*F+S.y*P,A=v.z*F+S.z*P;t[k]=c.x+V*f,t[k+1]=c.y+O*f,t[k+2]=c.z+A*f,o[k]=V,o[k+1]=O,o[k+2]=A}}h.needsUpdate=!0,g.needsUpdate=!0}}}function Fe(){const t=[],o=[],u=[],l=[];for(let f=0;f<=22;f++){const b=71.5*Math.pow(f/22,.9),p=b>=71.4?.01:J(Math.min(b,70.9))*(b>70.9?.3:1),y=Math.min(b+.4,71.5),r=(y>=71.4?.01:J(Math.min(y,70.9)))-p,i=y-b,c=Math.hypot(r,i)||1;for(let x=0;x<25;x++){const C=W*x/24;t.push(p*Math.cos(C),b,p*Math.sin(C)),o.push(i/c*Math.cos(C),-r/c,i/c*Math.sin(C)),u.push(x,f/22)}}for(let f=0;f<22;f++)for(let b=0;b<24;b++){const p=f*25+b,y=p+1,r=p+25,i=r+1;l.push(p,r,y,y,r,i)}const d=new e.Matrix4,h=new e.Quaternion,g=new e.Vector3(0,1,0),m=new e.Vector3,M=new e.Vector3(1,1,1),v=(f,b)=>{const p=f.attributes.position,y=f.attributes.normal,r=t.length/3;for(let i=0;i<p.count;i++)t.push(p.getX(i),p.getY(i),p.getZ(i)),o.push(y.getX(i),y.getY(i),y.getZ(i)),u.push(0,b);for(let i=0;i<f.index.count;i++)l.push(r+f.index.getX(i));f.dispose()},S=(f,b,p,y)=>{m.set(b[0]-f[0],b[1]-f[1],b[2]-f[2]);const r=m.length();h.setFromUnitVectors(g,m.normalize()),d.compose(new e.Vector3((f[0]+b[0])/2,(f[1]+b[1])/2,(f[2]+b[2])/2),h,M),v(new e.BoxGeometry(p,r,p).applyMatrix4(d),y)};v(new e.BoxGeometry(4.6,3.4,3.6).translate(0,-13.3,0),-1),v(new e.BoxGeometry(5,.4,4).translate(0,-11.5,0),-2),v(new e.BoxGeometry(3.7,.3,3.5).translate(0,-8.6,0),-2);for(const f of[-1,1])for(const b of[-1,1])S([f*2.1,-11.5,b*1.7],[f*1.75,-8.6,b*1.65],.3,-2);for(let f=0;f<8;f++){const b=W*(f+.5)/8,p=Math.cos(b),y=Math.sin(b);S([Math.sign(p)*1.75,-8.6,Math.sign(y)*1.65],[8.9*p,.2,8.9*y],.22,-2)}const w=new e.BufferGeometry;return w.setAttribute("position",new e.Float32BufferAttribute(t,3)),w.setAttribute("normal",new e.Float32BufferAttribute(o,3)),w.setAttribute("uv",new e.Float32BufferAttribute(u,2)),w.setIndex(l),w}const ue=(n,s)=>{let t=Math.imul(n,374761393)+Math.imul(s,668265263)|0;return t=Math.imul(t^t>>>13,1274126177),((t^t>>>16)>>>0)/4294967296},Me=(n,s)=>{const t=Math.floor(n),o=Math.floor(s),u=n-t,l=s-o,a=u*u*(3-2*u),d=l*l*(3-2*l),h=ue(t,o),g=ue(t+1,o),m=ue(t,o+1),M=ue(t+1,o+1);return h+(g-h)*a+(m-h)*d+(h-g-m+M)*a*d},ie=(n,s)=>{const t=1-Math.abs(2*Me(n,s)-1);return t*t},ve=Math.hypot(D.x,D.z),pe=D.x/ve,xe=D.z/ve;function we(n,s){const t=Math.hypot(n,s);let u=(Math.sin(n*.0061+1.3)*Math.cos(s*.0047-.4)+.5*Math.sin(n*.013-s*.011+2.1))*7*j(t,380,1100);if(t>900){const l=.5+.5*(n*pe+s*xe)/t,a=Math.abs(s-Se(n));u+=(30+200*ie(n/950+3.1,s/950+7.7)+80*ie(n/400+1.3,s/400+9.1))*j(t,900,2300)*(1-.6*l)*j(a,60,560),t>2600&&(u+=(180+700*ie(n/2300+5.2,s/2300+1.7)+300*ie(n/900+2.2,s/900+4.4)+110*ie(n/380+.4,s/380+8.3))*j(t,2600,5200)*(1-.78*l*l)*j(a,120,1200))}return u}function ke(){const s=[0];let t=6;for(;t<7400;)s.push(t),t=t*1.045+2;const o=s.length,u=217,l=o*u,a=new Float32Array(l*3),d=new Float32Array(l*3),h=new Float32Array(l).fill(1),g=[];for(let r=0;r<o-1;r++)for(let i=0;i<216;i++){const c=r*u+i,x=c+1,C=c+u,F=C+1;g.push(c,x,C,x,F,C)}const m=new e.BufferGeometry;m.setAttribute("position",new e.BufferAttribute(a,3)),m.setAttribute("normal",new e.BufferAttribute(d,3)),m.setAttribute("aSh",new e.BufferAttribute(h,1)),m.setIndex(g);const M=[];for(let r=0;r<o;r+=12)M.push(()=>{for(let i=r;i<Math.min(o,r+12);i++)for(let c=0;c<u;c++){const x=W*(c%216)/216,C=s[i]*Math.cos(x),F=s[i]*Math.sin(x),P=(i*u+c)*3;a[P]=C,a[P+1]=we(C,F),a[P+2]=F}});M.push(()=>{for(let r=0;r<o;r++){const i=Math.max(r-1,0),c=Math.min(r+1,o-1);for(let x=0;x<u;x++){const C=(x+216-1)%216,F=(x+1)%216,P=(r*u+C)*3,k=(r*u+F)*3,V=(i*u+x)*3,O=(c*u+x)*3,A=(r*u+x)*3,L=a[k]-a[P],B=a[k+1]-a[P+1],U=a[k+2]-a[P+2],z=a[O]-a[V],H=a[O+1]-a[V+1],I=a[O+2]-a[V+2];let G=B*I-U*H,T=U*z-L*I,R=L*H-B*z;T<0&&(G=-G,T=-T,R=-R);const $=Math.hypot(G,T,R);r===0||$<1e-9?(d[A]=0,d[A+1]=1,d[A+2]=0):(d[A]=G/$,d[A+1]=T/$,d[A+2]=R/$)}}});const v=256,S=6400,w=v+1,f=new Float32Array(w*w),b=2*S/v;for(let r=0;r<w;r+=20)M.push(()=>{for(let i=r;i<Math.min(w,r+20);i++)for(let c=0;c<w;c++)f[i*w+c]=we(-S+c*b,-S+i*b)});const p=(r,i)=>{const c=Z((r+S)/b,0,v-1e-6),x=Z((i+S)/b,0,v-1e-6),C=Math.floor(c),F=Math.floor(x),P=c-C,k=x-F,V=F*w+C;return(f[V]*(1-P)+f[V+1]*P)*(1-k)+(f[V+w]*(1-P)+f[V+w+1]*P)*k},y=D.y/ve;for(let r=0;r<o;r+=24)M.push(()=>{for(let i=r;i<Math.min(o,r+24);i++)if(!(s[i]<300))for(let c=0;c<u;c++){const x=i*u+c,C=a[x*3],F=a[x*3+1],P=a[x*3+2];let k=1;for(let V=70;V<5200&&k>0;V=V*1.22+30){const O=.5-(p(C+pe*V,P+xe*V)-(F+V*y))/(.05*V+14);O<k&&(k=O)}h[x]=Z(k,0,1)}});return{geometry:m,steps:M,tris:g.length/3}}const Se=n=>-215-45*Math.sin(n/150+1)-15*Math.sin(n/55+.4);function Ve(n){const t=new Uint8Array(4194304),o=new Float32Array(1024*1024),u=-D.x/Math.hypot(D.x,D.z),l=-D.z/Math.hypot(D.x,D.z),a=1/Math.tan(Math.asin(D.y)),d=[];for(let g=0;g<n.length;g+=60)d.push(()=>{for(const m of n.slice(g,g+60)){const M=m.s*1.5*a,v=m.s*.75;for(let S=0;S<=1;S+=2/Math.max(M,2)){const w=m.x+u*M*S,f=m.z+l*M*S,b=Math.floor((w-v)/4+512),p=Math.ceil((w+v)/4+512),y=Math.floor((f-v)/4+512),r=Math.ceil((f+v)/4+512);for(let i=Math.max(y,0);i<=Math.min(r,1023);i++)for(let c=Math.max(b,0);c<=Math.min(p,1023);c++){const x=(c-512)*4-w,C=(i-512)*4-f,F=1-j(Math.hypot(x,C),v*.5,v*1.2),P=i*1024+c;o[P]=Math.max(o[P],F*(.86-.3*S))}}}});for(let g=0;g<16;g++)d.push(()=>{for(let m=g*64;m<g*64+64;m++)for(let M=0;M<1024;M++){const v=(M-512)*4,S=(m-512)*4,w=(m*1024+M)*4,f=Math.hypot(v,S),b=Math.floor((v+.35*S+2e3)/230),p=Math.floor((S-.2*v+2e3)/170),y=Math.abs(Math.sin(b*127.1+p*311.7)*43758.5453)%1,r=.5+.5*Math.sin(v*.0043+.7)*Math.cos(S*.0037+1.9);t[w]=Math.round(255*Z(o[m*1024+M],0,1)),t[w+1]=255,t[w+2]=Math.round(255*(f>380?.05+.95*y:0)),t[w+3]=Math.round(255*Z(j(r,.78,1)*j(f,260,700)*.8,0,1))}});const h=new e.DataTexture(t,1024,1024,e.RGBAFormat);return h.wrapS=h.wrapT=e.ClampToEdgeWrapping,h.magFilter=e.LinearFilter,h.minFilter=e.LinearMipmapLinearFilter,h.generateMipmaps=!0,{tex:h,steps:d,done(){h.needsUpdate=!0}}}function Oe(){const n=ce(),s=(o,u)=>{const l=o.attributes.position;for(let a=0;a<l.count;a++){const d=l.getX(a),h=l.getY(a),g=l.getZ(a),m=1+u*(Math.sin(d*9.1+h*5.3)*Math.sin(g*7.7-h*3.1)+.6*Math.sin(d*17+g*13+h*11));l.setXYZ(a,d*m,h*(1+.5*(m-1)),g*m);const M=Math.hypot(d,h,g)||1;o.attributes.normal.setXYZ(a,d/M,h/M,g/M)}return o},t=(o,u,l,a)=>n.add(s(new e.IcosahedronGeometry(1,1),o),{p:u,s:l,c:a,surf:0});return t(.15,[0,1.15,0],[.42,.85,.42],"#27502a"),t(.13,[.03,2.3,.02],[.28,.72,.28],"#31602e"),t(.17,[1,.95,.3],[.62,.5,.62],"#2f5a2a"),t(.17,[1.46,.86,.5],[.44,.38,.44],"#386630"),t(.17,[.66,1.16,.1],[.44,.38,.44],"#2a5126"),t(.16,[-.75,.36,-.4],[.5,.38,.5],"#28481f"),n.add(new e.CylinderGeometry(.06,.1,.6,6),{p:[0,.3,0],c:"#2a1c12",surf:3}),n.add(new e.CylinderGeometry(.07,.11,.7,6),{p:[1,.35,.3],c:"#2a1c12",surf:3}),n.build()}function Ie(n){const o=[],u=[],l=[],a=[],h=me(0,N.H,0,n),g=me(0,0,0,n),m=le(n.th),M=new e.Vector3(1,0,0),v=new e.Vector3(0,m.c,m.s),S=new e.Vector3(0,m.s,-m.c),w=new e.Vector3,f=new e.Vector3,b=new e.Vector3,p=r=>{let i=2;for(;i<70;i+=.5){b.copy(r).addScaledVector(D,-i).sub(g);const c=b.dot(S);if(c<.5||Math.sqrt(Math.max(b.lengthSq()-c*c,0))>J(Math.min(c,N.H))-.8)break}return i-.5};for(let r=0;r<41;r++){const i=W*r/40,c=N.HOLE-.5;w.copy(h).addScaledVector(M,c*Math.cos(i)).addScaledVector(v,c*Math.sin(i));const x=w.clone(),C=p(x);f.set(0,0,0).addScaledVector(M,Math.cos(i)).addScaledVector(v,Math.sin(i)),f.addScaledVector(D,-f.dot(D)).normalize();for(let F=0;F<=10;F++)w.copy(x).addScaledVector(D,-C*F/10),o.push(w.x,w.y,w.z),u.push(f.x,f.y,f.z),l.push(r/40,F/10)}for(let r=0;r<40;r++)for(let i=0;i<10;i++){const c=r*11+i,x=c+1,C=c+10+1,F=C+1;a.push(c,x,C,x,F,C)}const y=new e.BufferGeometry;return y.setAttribute("position",new e.Float32BufferAttribute(o,3)),y.setAttribute("normal",new e.Float32BufferAttribute(u,3)),y.setAttribute("uv",new e.Float32BufferAttribute(l,2)),y.setIndex(a),y}export{N as EV,D as SUN,ze as basketGeometry,Be as fanBladesGeometry,Le as fanGeometry,le as frameOf,we as landHeight,ce as makeB,Ge as makeCables,Pe as makeCloth,Ae as makeDawn,ke as makeLand,Ve as makeLandMap,Ce as makePanel,Fe as otherGeometry,J as profR,Se as riverZ,me as scPoint,he as sectionOf,Ie as shaftGeometry,Oe as treeGeometry};
