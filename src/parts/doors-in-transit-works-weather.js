const S=[null,{col:[1,1,1],size:.16,fall:3,secs:3.6,drift:.5,flutter:.35,a:.95},{col:[.93,.74,.42],size:.09,fall:3.1,secs:1.1,drift:.05,flutter:.03,a:.9},{col:[.62,.42,.14],size:.2,fall:2.8,secs:3,drift:1.3,flutter:.6,a:.95},{col:[.9,.93,.97],size:1.5,fall:1.2,secs:6.5,drift:.9,flutter:.2,a:.16},{col:[.72,.84,1],size:.08,fall:3.1,secs:.85,drift:0,flutter:0,a:.9},{col:[1,.68,.78],size:.15,fall:2.9,secs:4.2,drift:1,flutter:.55,a:.95}],n=12,j=[1,7,13,29],D=[Math.SQRT2-1,Math.sqrt(3)-1,Math.sqrt(5)-2,Math.sqrt(7)-2],b=e=>e-Math.floor(e);function I(e,i,C){const d=Math.max(1,i.length*n),o=new e.InstancedBufferGeometry;o.setAttribute("position",new e.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),o.setIndex([0,1,2,0,2,3]);const l=new Float32Array(d*4),c=new Float32Array(d*4),f=new Float32Array(d*4);i.forEach((u,a)=>{for(let s=0;s<n;s++)for(let t=0;t<4;t++)f[(a*n+s)*4+t]=b(u.wphase*j[t]+(s+1)*D[t])});const h=new e.InstancedBufferAttribute(l,4),m=new e.InstancedBufferAttribute(c,4);h.setUsage(e.DynamicDrawUsage),m.setUsage(e.DynamicDrawUsage),o.setAttribute("aPos",h),o.setAttribute("aCol",m),o.instanceCount=i.length*n,o.boundingSphere=new e.Sphere(new e.Vector3(0,40,0),400);const w=new e.ShaderMaterial({uniforms:Object.assign(e.UniformsUtils.merge([e.UniformsLib.fog]),{uHeight:C.uHeight}),vertexShader:`
      attribute vec4 aPos; attribute vec4 aCol; uniform float uHeight; varying vec2 vQ; varying vec4 vCol;
      #include <fog_pars_vertex>
      void main() {
        vQ = position.xy * 2.; vCol = aCol;
        vec4 mvPosition = modelViewMatrix * vec4(aPos.xyz, 1.);
        // a fleck narrower than a pixel and six tenths is drawn that wide and as much fainter: a filter by the
        // pixel's TRUE footprint at the fleck's own distance, measured as the works' slender iron is measured
        // (the same uniform, the same law: doors-in-transit-works-iron.js)
        float dist = max(0., -mvPosition.z), need = 1.6 * dist * 2. / (max(projectionMatrix[1][1], 0.05) * max(uHeight, 16.));
        float w = max(aPos.w, need);
        vCol.a *= clamp(aPos.w / w, 0., 1.) * clamp(aPos.w / w, 0., 1.);
        mvPosition.xy += position.xy * w;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vQ; varying vec4 vCol;
      #include <fog_pars_fragment>
      void main() {
        float d = clamp(1. - dot(vQ, vQ), 0., 1.);
        float a = d * d * vCol.a;
        gl_FragColor = vec4(vCol.rgb, a);
        #include <fog_fragment>
      }`,transparent:!0,depthWrite:!1,fog:!0}),g=new e.Mesh(o,w);g.frustumCulled=!1,g.renderOrder=3;function z(u){let a=0;for(const s of i){const t=S[s.weather];for(let p=0;p<n;p++,a++){const x=f[a*4],y=f[a*4+1],A=f[a*4+2],v=f[a*4+3],r=b(u/(t.secs*(.8+.4*y))+x+s.wphase),M=(A-.5)*3+t.drift*r*(v-.3),U=t.flutter*Math.sin(u*(1.3+v)+x*40)*r,P=(v-.5)*.5+U;l[a*4]=s.x+s.tx*M-s.tz*P,l[a*4+1]=s.y+.12-t.fall*(t.secs<1.5?r*r:r),l[a*4+2]=s.z+s.tz*M+s.tx*P,l[a*4+3]=t.size*(.7+.6*y);const _=Math.sin(Math.PI*Math.min(1,r*1.02))*t.a;c[a*4]=t.col[0],c[a*4+1]=t.col[1],c[a*4+2]=t.col[2],c[a*4+3]=_}}h.needsUpdate=!0,m.needsUpdate=!0}return{object:g,update:z,count:i.length*n,material:w}}export{I as makeWeather};
