import*as o from"three";import{sharedU as C,GLSL_COMMON as P}from"./the-city-that-left-common.js";class U{constructor(){this.P=[],this.T=[],this.S=[],this.W=[],this.C=[],this.I=[],this.n=0}line(t,g,i,b){const f=this.n,d=t.length;for(let a=0;a<d;a++){const r=t[Math.max(0,a-1)],v=t[Math.min(d-1,a+1)],e=Math.hypot(v[0]-r[0],v[1]-r[1],v[2]-r[2])||1,u=b(a);for(const c of[-1,1])this.P.push(t[a][0],t[a][1],t[a][2]),this.T.push((v[0]-r[0])/e,(v[1]-r[1])/e,(v[2]-r[2])/e),this.S.push(c,g),this.W.push(u[0],u[1],u[2],u[3]),this.C.push(i[0],i[1],i[2]),this.n++;if(a>0){const c=f+(a-1)*2;this.I.push(c,c+1,c+2,c+1,c+3,c+2)}}}get triangles(){return this.I.length/3}build(){const t=new o.BufferGeometry;return t.setAttribute("position",new o.Float32BufferAttribute(this.P,3)),t.setAttribute("aTan",new o.Float32BufferAttribute(this.T,3)),t.setAttribute("aSide",new o.Float32BufferAttribute(this.S,2)),t.setAttribute("aSw",new o.Float32BufferAttribute(this.W,4)),t.setAttribute("color",new o.Float32BufferAttribute(this.C,3)),t.setIndex(this.I),t.computeBoundingSphere(),t.boundingSphere.radius+=12,t}}const q=.0017;function V(n){return new o.ShaderMaterial({uniforms:C(n,{uPix:{value:q}}),transparent:!0,side:o.DoubleSide,vertexShader:`
      attribute vec3 aTan, color; attribute vec2 aSide; attribute vec4 aSw;
      uniform float uTime, uPix; uniform vec2 uGlowAz;
      varying vec3 vWorld, vCol; varying float vAcross, vCover, vRim;
      void main(){
        vec3 p = position;
        // the pendulum: mostly along the rim, a little in and out
        vec2 rad = p.xz / max(length(p.xz), 1e-3), tg = vec2(-rad.y, rad.x);
        float th = aSw.z*(sin(uTime*aSw.w + aSw.y) + .35*sin(uTime*aSw.w*2.3 + aSw.y*1.7));
        p.xz += (tg*.92 + rad*.4*sin(aSw.y*5.))*th*aSw.x;
        vec4 wp = modelMatrix*vec4(p, 1.);
        vec3 toCam = cameraPosition - wp.xyz; float dist = max(length(toCam), 1e-3);
        vec3 sd = cross(aTan, toCam); sd = sd / max(length(sd), 1e-5);
        float hw = max(aSide.y, dist*uPix*.75);
        vCover = aSide.y / hw; vAcross = aSide.x; vCol = color;
        vRim = dot(sd.xz, uGlowAz)*aSide.x;                       // the edge that faces the afterglow
        wp.xyz += sd*aSide.x*hw; vWorld = wp.xyz;
        gl_Position = projectionMatrix*viewMatrix*wp;
      }`,fragmentShader:P+`
      varying vec3 vWorld, vCol; varying float vAcross, vCover, vRim;
      void main(){
        float fw = fwidth(vAcross), a = (1. - smoothstep(1. - min(fw*1.5, .9), 1., abs(vAcross)))*clamp(vCover, 0., 1.);
        if (a < .01) discard;
        float rim = clamp(vRim, 0., 1.)*smoothstep(.1, .9, abs(vAcross));
        vec3 col = vCol*(mix(uHemiGnd, uHemiSky, .5 + .3*vAcross) + uBand*rim*1.6);
        gl_FragColor = vec4(ctlFog(col, vWorld - cameraPosition), a);
      }`})}class W{constructor(){this.P=[],this.U=[],this.F=[],this.O=[],this.I=[],this.n=0}sheet(t,g,i){const b=this.n,f=i.nd;for(let d=0;d<=t;d++){const a=g(d);for(let r=0;r<=f;r++)this.P.push(a[0],a[1],a[2]),this.U.push(t?d/t*2-1:0,r/f),this.F.push(i.len,i.out,i.seed,i.kind),this.O.push(i.dir[0],i.dir[1],i.width||0,i.spread??.3),this.n++}for(let d=0;d<t;d++)for(let a=0;a<f;a++){const r=b+d*(f+1)+a,v=r+1,e=r+f+2,u=r+f+1;this.I.push(r,v,e,r,e,u)}}get triangles(){return this.I.length/3}build(){const t=new o.BufferGeometry;return t.setAttribute("position",new o.Float32BufferAttribute(this.P,3)),t.setAttribute("aUV",new o.Float32BufferAttribute(this.U,2)),t.setAttribute("aFall",new o.Float32BufferAttribute(this.F,4)),t.setAttribute("aOut",new o.Float32BufferAttribute(this.O,4)),t.setIndex(this.I),t.computeBoundingSphere(),t.boundingSphere.center.y-=90,t.boundingSphere.radius+=130,t}}function I(n){return new o.ShaderMaterial({uniforms:C(n,{uFlow:{value:1}}),transparent:!0,depthWrite:!1,side:o.DoubleSide,blending:o.CustomBlending,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec2 aUV; attribute vec4 aFall, aOut;
      uniform float uTime, uFlow;
      varying vec3 vWorld; varying vec2 vUV; varying vec4 vFall; varying float vAcross;
      void main(){
        float t = aUV.y, len = aFall.x, kind = aFall.w;
        vec3 p = position;
        float drop = len*t*t, flow = mix(1., uFlow, step(kind, .5));
        // it leaves the lip going outward and keeps that speed; the lower part wavers in the air
        vec2 out2 = aOut.xy*aFall.y*t*(.6 + .4*flow), perp = vec2(-aOut.y, aOut.x);
        float wav = sin(uTime*(kind > .5 && kind < 1.5 ? .35 : .8) + aFall.z*7. + t*4.)*t*t*(kind > .5 && kind < 1.5 ? 6. : 2.5)*step(kind, 1.5);
        p.xz += out2 + perp*wav + perp*aUV.x*aOut.w*t*len*.06*step(aOut.z, .001);
        p.y -= drop;
        vec4 wp = modelMatrix*vec4(p, 1.);
        // billboards: a narrow sheet that turns about the vertical to face the camera
        vec3 toCam = cameraPosition - wp.xyz; vec2 rt = vec2(toCam.z, -toCam.x); rt = rt / max(length(rt), 1e-4);
        float halfW = aOut.z*(1. + aOut.w*t*3.);
        wp.xz += rt*aUV.x*halfW;
        vAcross = step(aOut.z, .001)*aUV.x*10.5 + aUV.x*halfW;      // metres across, more or less
        vWorld = wp.xyz; vUV = aUV; vFall = aFall;
        gl_Position = projectionMatrix*viewMatrix*wp;
      }`,fragmentShader:P+`
      uniform float uFlow;
      varying vec3 vWorld; varying vec2 vUV; varying vec4 vFall; varying float vAcross;
      void main(){
        float t = clamp(vUV.y, 0., 1.), x = vUV.x, kind = vFall.w, seed = vFall.z;
        vec3 toP = vWorld - cameraPosition; float dist = length(toP);
        vec2 h = toP.xz / max(length(toP.xz), 1e-4);
        float back = clamp(dot(h, uGlowAz), 0., 1.); back *= back;      // looking through it toward the afterglow
        float edge = 1. - smoothstep(.55, 1., abs(x));
        vec3 col; float a;
        if (kind < .5) {
          // water: streaks that stretch as they fall (the pattern rides the time of flight), thinning to rain
          float flow = uFlow;
          float q = t*42. - uTime*3.1;
          float s1 = cN(vec2(vAcross*1.7 + seed*13., q)), s2 = cN(vec2(vAcross*5.3 + seed*29., q*1.9 + 3.)), s3 = cN(vec2(vAcross*.45 + seed*5., q*.5));
          float body = s1*.55 + s2*.3 + s3*.35;
          float thin = mix(.16, .78, smoothstep(.04, .85, t)) + (1. - flow)*.22;
          a = smoothstep(thin, thin + .3, body)*edge*(1. - smoothstep(.62, 1., t))*(.5 + .5*flow);
          a = max(a, (1. - smoothstep(0., .06, t))*edge*.85*flow);            // the smooth tongue at the lip
          float white = smoothstep(.5, .9, body);
          // pale grey-blue water, with only a thin warm edge on the side toward the afterglow
          col = mix(vec3(.1, .125, .17), vec3(.36, .41, .5), white) + uBand*.3*back*smoothstep(.45, .9, abs(x))*white;
        } else if (kind < 1.5) {
          // dust and soil: slower, softer, in threads of grains that catch the afterglow when the eye looks through them
          float q = t*9. - uTime*.9;
          float s1 = cF(vec2(vAcross*.33 + seed*13., q)), s2 = cN(vec2(vAcross*1.9 + seed*29., q*3.1)), s3 = cN(vec2(vAcross*7. + seed*3., q*5.3 + 1.7));
          a = smoothstep(.36, .8, s1*.7 + s2*.5)*(.3 + .45*smoothstep(.45, .8, s3))*edge*(1. - smoothstep(.4, 1., t))*smoothstep(0., .08, t);
          col = vec3(.11, .09, .072)*(1. + uHemiSky*.5) + (uBand*.45 + uRose*.2)*back*(.4 + .6*s3);
        } else {
          // drips: single drops with long tails, faster the further they have fallen
          float q = t*11. - uTime*1.25 + seed;
          float f = fract(q), id = floor(q);
          float on = step(.45, cH(vec2(id, seed*7.)));
          a = on*smoothstep(.0, .12, f)*(1. - smoothstep(.12, .2 + .5*t, f))*edge*(1. - smoothstep(.7, 1., t))*.8;
          col = vec3(.2, .24, .32) + uBand*.06*back;
        }
        // a narrow fall close to the eye fades out before it fills the frame (the river's own sheets, the long ones, do not)
        a *= smoothstep(1.5, 6., dist)*mix(smoothstep(9., 34., dist)*mix(1., smoothstep(30., 80., dist), step(.5, kind)*step(kind, 1.5)), 1., step(205., vFall.x));
        if (a < .004) discard;
        float f = ctlFogF(toP);
        gl_FragColor = vec4(mix(col, uFogCol, f)*a, a);
      }`})}function T(n,t,g,i=1){const[b,f,d]=t.p,a=t.d[0],r=t.d[1],v=new o.Matrix4().makeBasis(new o.Vector3(r,0,-a),new o.Vector3(0,1,0),new o.Vector3(a,0,r)).setPosition(b,f,d);n.set(v);const e=2.7,u=2.5,c=8,p=[[-e,0],[-e,u]];for(let s=1;s<c;s++){const l=Math.PI*(1-s/c);p.push([Math.cos(l)*e,u+Math.sin(l)*e])}p.push([e,u],[e,0]);const S=[-17,-9,-3,t.out],A=[.13,.125,.115],F=[.035,.034,.034],M=[.2,.19,.175];for(let s=0;s<S.length-1;s++){const l=S[s],h=S[s+1],x=(.2-.05*s)*i,z=(.2-.05*(s+1))*i;for(let y=0;y<p.length-1;y++){const m=p[y],w=p[y+1];n.quad([w[0],w[1],l],[m[0],m[1],l],[m[0],m[1],h],[w[0],w[1],h],F,x,z),h>-3&&n.quad([m[0]*1.16,m[1]*1.12-.3,l],[w[0]*1.16,w[1]*1.12-.3,l],[w[0]*1.16,w[1]*1.12-.3,h],[m[0]*1.16,m[1]*1.12-.3,h],A)}n.quad([-e,0,h],[e,0,h],[e,0,l],[-e,0,l],[.05,.048,.045],z*.8,x*.8),h>-3&&n.quad([-e*1.16,-.3,l],[e*1.16,-.3,l],[e*1.16,-.3,h],[-e*1.16,-.3,h],A)}for(let s=0;s<p.length-1;s++){const l=p[s],h=p[s+1],x=t.out;n.quad([l[0],l[1],x],[h[0],h[1],x],[h[0]*1.16,h[1]*1.12-.3,x],[l[0]*1.16,l[1]*1.12-.3,x],M)}n.quad([-e,0,-17],[e,0,-17],[e,u+e,-17],[-e,u+e,-17],F,.22*i,.4*i);for(const s of[-13,-8.5,-4,-.6])n.box(.9,u+e-.55,s,.5,.18,.9,[.3,.28,.2],2.6*i);const B=g.range(.25,.7),k=t.out+g.range(2,7);for(const s of[-.75,.75])n.box(s,.12,(t.out-17)/2,.14,.2,t.out+17,[.06,.055,.05]),n.cyl([s,.15,t.out],[s+g.range(-.4,.4),.15-B*(k-t.out)*.5,k],.11,.09,4,[.07,.06,.05],0,1);n.set(null)}export{W as Sheets,U as Strands,I as makeFallMaterial,V as makeStrandMaterial,T as tunnelInto};
