import*as z from"./valley-inside-the-works-plan.js";const M=`
attribute vec3 aLayer;
varying vec3 vWorld, vAxis, vLayer;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz; vAxis = normal; vLayer = aLayer;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,W=`
uniform vec3 uBeam, uLightDir; uniform float uDust, uReach;
varying vec3 vWorld, vAxis, vLayer;   // vAxis: the sheet's own direction; vLayer: its layer's depth, its strength, its fade
// A soft-edged strip that repeats: lit from 0 to on (rising and falling over e), dark to the period p. litTo: the
// lit metres between 0 and x; strip: the strip itself.
float ramp(float u, float e) { float t = clamp(u / e, 0.0, 1.0); return e * (t * t * t - 0.5 * t * t * t * t) + max(u - e, 0.0); }
float litTo(float x, float p, float on, float e) { float k = floor(x / p), m = x - k * p; return k * (on - e) + ramp(m, e) - ramp(m - (on - e), e); }
float strip(float x, float p, float on, float e) { float m = x - floor(x / p) * p; return smoothstep(0.0, e, m) - smoothstep(on - e, on, m); }
void main() {
  vec3 e = cameraPosition, d = vWorld - e;
  float len = length(d); d /= max(len, 1e-3);
  // this sheet's own layer of air: its last vLayer.x metres, square to the sheet; and the air's own thinning toward
  // the eye (0.6 to 2.5 m), summed
  float off = abs(dot(d, vAxis)) * len;
  float t0 = min(max(1.55, len * (1.0 - vLayer.x / max(off, 1e-3))), len), t1 = len;
  // the right-hand wall lays its own shade along its foot (the plan's law): a line that runs into it is lit no further
  float se = e.x + 0.578 * (52.0 - e.y), sd = d.x - 0.578 * d.y;
  if (sd > 1e-4) t1 = min(t1, max((78.5 - se) / sd, 0.0));
  float span = max(t1 - t0, 0.0);
  // ALONG THE HALL the light comes down in the plan's bars: w = z + 0.7009 y, lit 12.2 m of every 20.
  // ACROSS THE HALL the shafts' own law cuts each bar into shafts: s = where a ray of the sun crossed the roof's
  // valley level, lit 6.4 m of every 9.33 (three shafts to the nave). A shaft is where both are lit: a slanting
  // pillar of light.
  float w0 = e.z + 0.7009 * e.y - 16.45; w0 -= floor(w0 / 20.0) * 20.0;
  float dw = d.z + 0.7009 * d.y;
  float s0 = se - 15.47; s0 -= floor(s0 / 9.3333) * 9.3333;
  // The layer is taken in six stretches, short at its near end. In each: the lit share along the hall and the lit
  // share across it (both exact, from the strips' own laws), and how much of that light still reaches the eye
  // through the air between (uReach metres): the nearest shafts stand clear, far ones sink into the haze.
  float sum = 0.0, ta = t0;
  for (int i = 1; i <= 6; i++) {
    float fr = float(i) / 6.0, tb = t0 + span * fr * fr, seg = tb - ta;
    float wa = w0 + dw * ta, wb = w0 + dw * tb, sa = s0 + sd * ta, sb = s0 + sd * tb;
    float lw = abs(dw) * seg > 0.05 ? abs(litTo(wb, 20.0, 12.2, 1.2) - litTo(wa, 20.0, 12.2, 1.2)) / max(abs(dw) * seg, 1e-4) : strip(0.5 * (wa + wb), 20.0, 12.2, 1.2);
    float ls = abs(sd) * seg > 0.05 ? abs(litTo(sb, 9.3333, 6.4, 1.5) - litTo(sa, 9.3333, 6.4, 1.5)) / max(abs(sd) * seg, 1e-4) : strip(0.5 * (sa + sb), 9.3333, 6.4, 1.5);
    sum += seg * lw * ls * exp(-0.5 * (ta + tb) / uReach);
    ta = tb;
  }
  // dust scatters forward: the shafts are brightest looking toward the light (the Henyey-Greenstein phase law of
  // the literature with g = 0.55, written out: (1 - g g) / (1 + g g - 2 g cos)^1.5; a formula, not code brought in)
  float cg = clamp(dot(d, uLightDir), -1.0, 1.0);
  float phase = 0.6975 / pow(max(1.3025 - 1.1 * cg, 0.15), 1.5);
  float glow = 1.0 - exp(-sum * uDust * vLayer.y * min(phase, 3.2));
  gl_FragColor = vec4(uBeam * (glow * vLayer.z), 1.0);
}`,e={first:170,step:40,count:10,half:16,soft:6,lift:.5,strength:1.6},c={side:26,sideStrength:3,head:40,headStrength:2};function F(a){const r=z.SHED,g=r.x0+.7,d=r.x1-.7,u=r.zHead+.7,m=r.zDown-.7,p=r.roofValley,v=[],A=[],L=[],S=[],x=(t,o,s,f,i,b,B,k)=>{const D=v.length/3;for(let l=0;l<o.length;l++)for(let n=0;n<t.length;n++)v.push(...i(t[n],o[l])),A.push(...b),L.push(B,k,s[n]*f[l]);for(let l=0;l+1<o.length;l++)for(let n=0;n+1<t.length;n++){const w=D+l*t.length+n,y=w+t.length;S.push(w,w+1,y+1,w,y+1,y)}};for(const t of[d,g])x([m,u],[-2,p],[1,1],[1,1],(o,s)=>[t,s,o],[1,0,0],c.side,c.sideStrength);x([g,d],[-2,p],[1,1],[1,1],(t,o)=>[t,o,u],[0,0,1],c.head,c.headStrength);for(let t=0;t<e.count;t++){const o=e.first-e.step*t,s=e.half;let f=-1e9;for(let i=-s;i<=s;i+=2)f=Math.max(f,z.groundHeight(i,o));x([-s,-s+e.soft,s-e.soft,s],[f+e.lift,f+e.lift+e.soft,p-e.soft,p],[0,1,1,0],[0,1,1,0],(i,b)=>[i,b,o],[0,0,1],e.step,e.strength)}const h=new a.BufferGeometry;return h.setAttribute("position",new a.Float32BufferAttribute(v,3)),h.setAttribute("normal",new a.Float32BufferAttribute(A,3)),h.setAttribute("aLayer",new a.Float32BufferAttribute(L,3)),h.setIndex(S),h.computeBoundingSphere(),h}function C(a,r,g){const d=F(a),u=new a.ShaderMaterial({uniforms:{uBeam:{value:new a.Color(r.sun).multiplyScalar(r.beam)},uLightDir:{value:g},uDust:{value:r.dust},uReach:{value:90}},vertexShader:M,fragmentShader:W,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide,fog:!1}),m=new a.Mesh(d,u);return m.renderOrder=-1,m.frustumCulled=!1,{mesh:m,geometry:d,material:u}}export{C as makeBeams};
