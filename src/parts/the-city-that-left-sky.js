import*as t from"three";import{clamp as M,lerp as L}from"../kit/core.js";import{makeSky as D}from"../kit/sky.js";import{GLOW_AZ as F,HERO as P}from"./the-city-that-left-common.js";import{EAST_CREST_X as T}from"./the-city-that-left-land.js";const k={apricot:{band:"#E99A5E",rose:"#8C5A6E",bandGain:1.35,roseGain:.62,bandH:.085,roseH:.25,cirrus:1,shelf:0,stars:1,moon:!1,wet:0,key:"#F0B08A",keyGain:1,fogGlow:"#8C5A6E"},rain:{band:"#D9C36B",rose:"#5F8A78",bandGain:1.25,roseGain:.5,bandH:.095,roseH:.27,cirrus:.5,shelf:0,stars:.8,moon:!1,wet:1,key:"#E6D08A",keyGain:.95,fogGlow:"#6F8A7A"},deep:{band:"#C8643E",rose:"#5E3E66",bandGain:.95,roseGain:.55,bandH:.06,roseH:.2,cirrus:.7,shelf:0,stars:2,moon:!0,wet:0,key:"#D99A80",keyGain:.8,fogGlow:"#5E4466"},shelf:{band:"#E99A5E",rose:"#8C5A6E",bandGain:1.3,roseGain:.6,bandH:.085,roseH:.24,cirrus:.6,shelf:1,stars:.7,moon:!1,wet:0,key:"#F0B08A",keyGain:1,fogGlow:"#8C5A6E"}};function W(H,x,u={}){const s=k[u.hour]||k.apricot,S=u.forks.sky,C=e=>new t.Color(e),l=D({rng:S,preset:"blueHour",zenith:"#0C0F17",mid:"#262C3C",horizon:"#3A3B4A",ground:"#1f222c",horizonPow:3.2,midPow:1,scatter:0,sunElevation:-6,sunAzimuth:-40,sunIntensity:0,sunGlow:0,stars:.14,twinkle:.8,starDensity:s.stars>1?.34:.24,milkyWay:0,bodies:s.moon?[{elevation:10,azimuth:118,size:1.25,phase:.96,phaseAngle:60,intensity:.9,color:"#f2e6c8",glow:.22,glowColor:"#c8b890",glowSize:5}]:[],clouds:!1,clouds2:!1,bake:!!s.moon,renderer:H.renderer}),G=new t.ShaderMaterial({side:t.BackSide,depthWrite:!1,transparent:!0,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:{uTime:x.uniforms.uTime,uAz:{value:F},uBandC:{value:C(s.band).multiplyScalar(s.bandGain)},uRoseC:{value:C(s.rose).multiplyScalar(s.roseGain)},uH:{value:new t.Vector2(s.bandH,s.roseH)},uCirrus:{value:s.cirrus},uShelf:{value:s.shelf},uSeed:{value:S.range(0,40)}},vertexShader:`
      varying vec3 vDir;
      void main(){ vDir = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }`,fragmentShader:`
      uniform float uTime, uAz, uCirrus, uShelf, uSeed; uniform vec3 uBandC, uRoseC; uniform vec2 uH;
      varying vec3 vDir;
      float sH(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y)*p3.z); }
      float sN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
        return mix(mix(sH(i), sH(i + vec2(1., 0.)), f.x), mix(sH(i + vec2(0., 1.)), sH(i + vec2(1., 1.)), f.x), f.y); }
      // one cirrus bar: centre (azimuth from the glow, elevation), half length, thickness; x, y in radians
      vec2 bar(float da, float e, vec4 b, float tilt){
        float x = da - b.x, y = e - b.y - tilt*x - .012*(sN(vec2(x*5. + uSeed, b.x*9.)) - .5);
        float along = 1. - smoothstep(b.z*.35, b.z, abs(x));
        float w = b.w*(.6 + .8*sN(vec2(x*18. + uSeed, b.y*90.)));
        float dens = exp(-y*y/max(w*w, 1e-6))*along*smoothstep(.1, .8, .6*sN(vec2(x*14. + uSeed, y*60. + b.y*50.)) + .7*sN(vec2(x*5. - uSeed, b.x*3.)));
        return vec2(dens, 1. - smoothstep(-w, w, y));                         // density, how much of it is the lit underside
      }
      void main(){
        vec3 d = vDir / max(length(vDir), 1e-4);
        float e = asin(clamp(d.y, -1., 1.));
        float az = atan(d.x + 1e-6, -d.z), da = az - uAz; da = atan(sin(da), cos(da) + 1e-6);
        float up = max(e, 0.);
        float lobeA = exp(-da*da/(.8*.8)), lobeR = exp(-da*da/(1.3*1.3));
        float band = exp(-up*up/(uH.x*uH.x))*lobeA, rose = exp(-up*up/(uH.y*uH.y))*lobeR;
        vec3 col = uBandC*band + uRoseC*rose*(1. - .6*band);
        float a = clamp(band + rose*.85, 0., 1.);
        // cirrus low in the north-west, drifting; rose underneath, slate on top
        float dr = da - uTime*.00035;
        vec2 c1 = bar(dr, e, vec4(-.52, .13, .34, .007), .03), c2 = bar(dr, e, vec4(-.1, .185, .42, .009), -.02);
        vec2 c3 = bar(dr, e, vec4(.33, .1, .27, .006), .05), c4 = bar(dr, e, vec4(-.9, .22, .3, .008), -.04);
        float cd = clamp((c1.x + c2.x + c3.x + c4.x)*uCirrus, 0., 1.), under = (c1.x*c1.y + c2.x*c2.y + c3.x*c3.y + c4.x*c4.y)/max(c1.x + c2.x + c3.x + c4.x, 1e-4);
        vec3 cirLit = (uBandC*.8 + uRoseC*.7)*lobeR, cirDark = vec3(.035, .04, .075);
        col = mix(col, mix(cirDark, cirLit, under), cd*.8); a = max(a, cd*.8);
        // a high shelf of cloud lit from below (one of the visit's hours)
        // (its pattern is laid on a flat layer overhead, so it has no seam anywhere round the sky)
        vec2 lay = d.xz / max(d.y + .25, .2);
        float sy = (e - .42)/.2, shelf = uShelf*smoothstep(-1., -.2, sy)*(1. - smoothstep(.6, 1.6, sy))*smoothstep(.3, .62, sN(lay*2.6 + vec2(uSeed - uTime*.002, uSeed*.37)) + .25*sN(lay*14. + uSeed));
        vec3 shelfC = mix(vec3(.03, .035, .065), uRoseC*1.2 + uBandC*.25, (1. - smoothstep(-.9, .5, sy))*(.35 + .65*lobeR));
        col = mix(col, shelfC, shelf*.85); a = max(a, shelf*.85);
        float fade = smoothstep(-.07, .0, e);
        gl_FragColor = vec4(col*fade, a*fade);
      }`}),d=new t.Mesh(new t.SphereGeometry(3600,48,24),G);d.renderOrder=-.9,d.frustumCulled=!1;const a=u.cities??16,o=u.forks.skyCities,w=new t.PlaneGeometry(2,2),i=new t.InstancedBufferGeometry;i.setAttribute("position",w.attributes.position),i.setAttribute("uv",w.attributes.uv),i.setIndex(w.index);const n=new Float32Array((a+1)*4),f=new Float32Array((a+1)*2),v=new Float32Array((a+1)*2),r=Math.PI/180,p=(e,g,c,m,E,R)=>{n[e*4]=g*r,n[e*4+1]=o.range(c,m)*r,n[e*4+2]=E*r*.5,n[e*4+3]=R*r,f[e*2]=o(),f[e*2+1]=o(),v[e*2]=c*r,v[e*2+1]=(m-c)*r};p(0,149,8,24,2.5,.022);for(let e=1;e<a;e++)e<=5?p(e,-26+(e-1)*13.5+o.range(-4,4),13,31,o.range(1.1,1.5),o.range(.02,.06)):e<=9?p(e,100+(e-6)*19+o.range(-6,6),7,38,o.range(.45,1.5),o.range(.02,.06)):p(e,o.range(-180,180),7,44,o.range(.45,1.5),o.range(.02,.06));const B=!!u.second,z=new t.Vector3(T+2400,0,P.z);n[a*4]=78*r,n[a*4+1]=-3.2*r,n[a*4+2]=3.4*r*.5,n[a*4+3]=0,f[a*2]=o(),f[a*2+1]=o(),v[a*2]=-3.2*r,v[a*2+1]=1,i.setAttribute("aCity",new t.InstancedBufferAttribute(n,4)),i.setAttribute("aSeed",new t.InstancedBufferAttribute(f,2)),i.setAttribute("aBand",new t.InstancedBufferAttribute(v,2)),i.instanceCount=B?a+1:a;const b=new t.ShaderMaterial({depthWrite:!1,transparent:!0,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:{uTime:x.uniforms.uTime,uGold:x.uniforms.uGold,uRise:{value:0},uLast:{value:a},uLastAz:{value:78*r}},vertexShader:`
      attribute vec4 aCity; attribute vec2 aSeed, aBand;
      uniform float uTime, uRise, uLast, uLastAz;
      varying vec2 vUv; varying vec2 vSeed; varying float vPx, vShow;
      void main(){
        float isLast = step(uLast - .5, float(gl_InstanceID));
        // where in its band of sky it is by now (0 at the foot, 1 at the top, round and round)
        float span = max(aBand.y, 1e-4), f = fract((aCity.y - aBand.x + aCity.w*uTime)/span);
        vShow = mix(smoothstep(0., .12, f)*(1. - smoothstep(.85, 1., f)), 1., isLast);
        float az = mix(aCity.x, uLastAz, isLast), el = mix(aBand.x + f*span, aCity.y + uRise, isLast);
        vec3 dir = vec3(sin(az)*cos(el), sin(el), -cos(az)*cos(el));
        vec3 rt = normalize(vec3(cos(az), 0., sin(az))), upv = cross(rt, dir);
        vec3 p = cameraPosition + (dir + (rt*position.x + upv*position.y)*aCity.z*1.7)*3300.;
        vUv = position.xy*1.7; vSeed = aSeed;
        gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.);
        vPx = aCity.z;                                                           // its half-size in the sky, in radians
      }`,fragmentShader:`
      uniform vec3 uGold;
      varying vec2 vUv; varying vec2 vSeed; varying float vPx, vShow;
      float sH(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y)*p3.z); }
      void main(){
        vec2 p = vUv; float x = clamp(p.x, -1., 1.), show = clamp(vShow, 0., 1.), edgeK = clamp(1. - x*x, 0., 1.);
        // the rock under it: a shallow slab cut out of its country, ragged along its underside, never a smooth lens
        float jag = sH(vec2(floor((x + 1.)*11. + vSeed.y*9.), vSeed.x*17.));
        float belly = -(.14 + .2*sqrt(edgeK) + .11*jag*edgeK);
        float lens = step(abs(p.x), 1.)*smoothstep(belly - .02, belly + .02, p.y)*(1. - smoothstep(-.02, .02, p.y));
        // the town on it: an uneven skyline, low toward its edges, with two or three towers standing out of it
        float colm = floor((x + 1.)*13. + vSeed.x*7.), hc = sH(vec2(colm, vSeed.y*31.)), tw = step(.84, sH(vec2(colm*1.7, vSeed.x*53.)));
        float sky = (.07 + .2*hc + .36*tw)*smoothstep(0., .45, edgeK)*step(abs(p.x), .96);
        float town = step(0., p.y)*(1. - smoothstep(sky - .02, sky + .02, p.y));
        // its windows are lit in clusters: some quarters bright, some dark
        vec2 wc = floor(vec2((x + 1.)*30., p.y*46.));
        float quarter = smoothstep(.25, .6, sH(floor(wc/vec2(4., 5.)) + vSeed*23.));
        float win = step(.5, sH(wc + vSeed*57.))*quarter*town;
        // small on screen: the windows of a quarter run together into that quarter's own glow, inside the skyline
        float px = clamp(vPx*500., 0., 60.), fine = smoothstep(5., 24., px);
        vec3 col = uGold*(win*mix(.9, 2.2, fine) + town*quarter*(.3 + .7*hc)*mix(1.2, 0., fine));
        // its field shows only as a faint haze on the one limb the sun, already under the horizon, grazes from below:
        // soft, gone well inside the card's edge, never a line round it
        vec2 fp = p - vec2(0., .05); float fr = length(fp);
        float graze = clamp(dot(fp / max(fr, 1e-3), vec2(-.55, -.83)), 0., 1.);
        col += vec3(.6, .5, .5)*smoothstep(.75, 1.15, fr)*(1. - smoothstep(1.15, 1.6, fr))*graze*graze*.02;
        float a = clamp(lens*.94 + town*.8, 0., 1.);
        col += vec3(.012, .014, .024)*(lens + town*(1. - win));
        gl_FragColor = vec4(col, a)*show;
      }`}),h=new t.Mesh(i,b);h.renderOrder=-.8,h.frustumCulled=!1;const A=new t.Group;A.add(l.object,d,h);const y=new t.Vector3;return{object:A,sky:l,glow:d,cities:h,hour:s,update(e,g,c,m){l.update(e,g,c),y.setFromMatrixPosition(c.matrixWorld),d.position.copy(y),l.uniforms.uStars&&(l.uniforms.uStars.value.x=L(.14,.42,m)*Math.min(1.4,s.stars)),b.uniforms.uRise.value=M(m,0,1)*11*Math.PI/180,b.uniforms.uLastAz.value=Math.atan2(z.x-y.x,-(z.z-y.z))},dispose(){l.dispose?.()}}}export{k as HOURS,W as buildSky};
