import*as c from"three";import{BOWL as rt,STEPS as k,PATHS as Y,MOUTH_R as ht,footR as ft,DEG as E,STAR_AZ as O,TAN_EL as I,LIGHT_GLSL as U,LAMPMAP_GLSL as ct,makeLightUniforms as dt,makeLampMap as pt,bowlXZ as mt}from"./old-light-arriving-common.js";import{makeSkyGroup as vt}from"./old-light-arriving-sky.js";import{WATER_GLSL as wt}from"./old-light-arriving-land.js";import{dressBowl as ut,GLOBE_IN as it}from"./old-light-arriving-bowl.js";const t=rt,b={a:rt.arch,inner:10,outer:14,spring:14,depth:5},St=b.a,tt=`
// the highest the hill may stand at lateral distance l from the axis on the star's side (the stage, then six terraces stepping up)
float stepTop(float l){ float a = abs(l), j = floor((a - ${t.notch}.)/${k.w}.); return a < ${t.notch}. ? ${t.yStage.toFixed(1)} : (j > ${k.n-.5} ? 1e4 : ${k.y0} + ${k.rise}*j); }
float bowlLit(vec3 p){                                                                             // p in the bowl's frame
  float l = abs(p.x), a = -p.z, r = length(p.xz);
  // the star's rays run along the axis, so a ray keeps its lateral distance: what it must clear is the far side's section at that distance,
  // which rises with the tiers until it is as high as it may stand there (the stage, a terrace of the notch's stepped side, or the rim)
  float top = stepTop(l), cap = min(top, ${t.yRim.toFixed(1)});
  float rc = cap > ${(t.yRim-.5).toFixed(1)} ? 134. : (top < ${(t.yStage+.1).toFixed(1)} ? ${t.pool}. : ${t.low}. + ${t.tread}.*floor((cap - ${t.yLow.toFixed(2)})/${t.rise.toFixed(2)} + 1e-4));
  float ac = sqrt(max(rc*rc - p.x*p.x, 0.));
  float lit = smoothstep(-1.5, .4, p.y + max(ac - a, 0.)*${I.toFixed(5)} - cap);
  lit = mix(lit, 1., smoothstep(${(t.top-1.5).toFixed(1)}, ${(t.top+.5).toFixed(1)}, r));                             // the rim walk and the outer slope: only their own facing counts
  // the arch's shadow: carry the point up its ray to the arch's plane and ask whether it meets stone
  float t = ${b.a.toFixed(1)} - a, h = p.y + t*${I.toFixed(5)} - ${t.yStage.toFixed(1)};
  float outer = min(${b.outer}. - l, ${b.spring}. + sqrt(max(${b.outer*b.outer}. - p.x*p.x, 0.)) - h);
  float inner = min(${b.inner}. - l, ${b.spring}. + sqrt(max(${b.inner*b.inner}. - p.x*p.x, 0.)) - h);
  float soft = .25 + max(t, 0.)*.012;                                                              // soft-ended: the edge widens with the shadow's length
  float sh = smoothstep(-soft, soft, outer) * (1. - smoothstep(-soft, soft, inner)) * step(0., t) * step(0., h);
  return lit * (1. - sh);
}`;async function gt(n){const x=[],H=[],q=[],K=[],_=[],N=[],h=(e,o,a,r,s,l,i,d,y=9)=>(x.push(e,o,a),H.push(r,s,l),q.push(i[0],i[1],i[2]),K.push(d),_.push(y),x.length/3-1),S=(e,o,a,r)=>N.push(e,o,a,o,r,a),G=[.1,.165,.13],C=[.34,.35,.4],J=[.37,.38,.43],A=[.27,.28,.33],V=[.36,.37,.42],X=(e,o)=>{if(o===void 0)return 0;const a=k.lmin(o);return e>a?Math.asin(a/e):Math.PI/2},w=(e,o,a,r,s,l,i,d,y,T=!1)=>{const m=a-e,L=r-o,u=Math.hypot(m,L)||1,g=-L/u,v=m/u,f=(v<0||v===0&&g>0?-1:1)*(T?-1:1);let $=null;for(let M=0;M<=s;M++){const F=[];for(const[B,lt,nt]of[[e,o,d],[a,r,y]]){const et=X(B,nt),ot=et+(2*Math.PI-2*et)*M/s,at=Math.sin(ot),st=-Math.cos(ot);F.push(h(B*at,lt,B*st,f*g*at,f*v,f*g*st,l,i))}$&&S($[0],F[0],$[1],F[1]),$=F}},P=e=>t.yRim*(t.foot-e)/(t.foot-t.rim),z=ht,j=[];for(let e=0;e<k.n;e++)j.push(k.y0+k.rise*e);const W=[[z,t.yStage,0]];{const e=[];for(const o of j)e.push([t.foot-o/t.yRim*(t.foot-t.rim),o,0]);for(const o of Y)e.push([o+1.5,P(o+1.5),0],[o+1.5,P(o),2],[o-1.5,P(o),1],[o-1.5,P(o-1.5),2]);e.sort((o,a)=>a[0]-o[0]||o[1]-a[1]),W.push(...e,[t.rim,t.yRim,0])}const Q=e=>{for(let o=1;o<W.length;o++)if(W[o][1]>=e-1e-6){const a=W[o-1],r=W[o];return r[1]-a[1]<1e-6?a[0]:a[0]+(r[0]-a[0])*(e-a[1])/(r[1]-a[1])}return t.rim};{let e=null;for(let o=0;o<=180;o++){const a=2*Math.PI*o/180,r=Math.sin(a),s=-Math.cos(a),l=ft(a),i=l+3.6*(l-z)/t.yStage,d=[h(i*r,-3.6,i*s,r*.55,.83,s*.55,G,0),h(z*r,t.yStage,z*s,r*.55,.83,s*.55,G,0)];e&&S(e[0],d[0],e[1],d[1]),e=d}}n&&await n();for(let e=1;e<W.length;e++){const o=W[e-1],a=W[e],r=a[2],s=Math.max(o[1],a[1]);n&&e%4===0&&await n(),w(o[0],o[1],a[0],a[1],120,r===0?G:r===1?[.3,.3,.31]:A,r===0?0:1,s,s,r===2)}n&&await n(),w(t.rim,t.yRim,t.rim-2,t.yWalk,120,C,1,t.yRim,t.yRim),w(t.rim-2,t.yWalk,t.top,t.yWalk,120,C,1,t.yWalk,t.yWalk),w(t.top,t.yWalk,t.top,t.yLow+t.rise*t.tiers,120,A,2,t.yWalk,t.yWalk);for(let e=t.tiers-1;e>=0;e--){n&&e%2===1&&await n();const o=t.low+t.tread*e,a=t.yLow+t.rise*(e+1);w(o+t.tread,a,o,a,120,J,2,a,a),w(o,a,o,a-t.rise,120,A,2,a,a)}n&&await n(),w(t.low,t.yLow,t.pool,t.yLow,96,C,4,t.yLow,t.yLow),w(t.pool,t.yLow,t.pool,t.yPool-.3,96,A,1);{let o=null;const a=[];for(let s=0;s<=186;s+=6)a.push(s);a.push(212,240);for(const s of a){const l=[];for(let i=0;i<13;i++){const d=-t.notch+2*t.notch*i/12,y=Math.sqrt(Math.max(t.pool*t.pool-d*d,0)),T=Math.max(s,y),m=Math.hypot(d,T),L=m<=186?t.yStage:Math.max(3,t.yStage-(m-186)*.11);l.push(h(d,L,-T,0,1,0,V,4))}if(o)for(let i=0;i<12;i++)S(o[i],o[i+1],l[i],l[i+1]);o=l}let r=null;for(let s=0;s<13;s++){const l=-t.notch+2*t.notch*s/12,i=Math.sqrt(Math.max(t.pool*t.pool-l*l,0)),d=h(l,t.yStage,-i,0,.3,.95,A,1),y=h(l,t.yPool-.3,-i,0,.3,.95,A,1);r&&S(r[0],d,r[1],y),r=[d,y]}}n&&await n();const Z=(e,o)=>{const a=e+o*1e-4;if(a>=t.rim){for(const r of Y)if(Math.abs(a-r)<=1.5)return P(r);return P(a)}return a>=t.rim-2?t.yWalk+(t.yRim-t.yWalk)*(a-(t.rim-2))/2:a>=t.top?t.yWalk:a>=t.low?t.yLow+t.rise*(Math.floor((a-t.low)/t.tread)+1):t.yLow},R=[];for(let e=0;e<=t.tiers;e++)R.push(t.low+t.tread*e);R.push(t.rim-2,t.rim,...j.map(Q),...Y.flatMap(e=>[e-1.5,e+1.5]),z),R.sort((e,o)=>e-o);for(const e of[-1,1]){n&&await n();for(let o=0;o<k.n;o++){const a=t.notch+k.w*o,r=a+k.w,s=j[o],l=Math.floor((s-t.yLow)/t.rise+1e-6),i=t.low+t.tread*l,d=Q(s),y=12,T=3;let m=null;for(let g=0;g<=y;g++){const v=[];for(let f=0;f<=T;f++){const $=a+(r-a)*f/T,M=Math.sqrt(i*i-$*$),F=Math.sqrt(d*d-$*$),B=M+(F-M)*g/y;v.push(h(e*$,s,-B,0,1,0,V,4))}if(m)for(let f=0;f<T;f++)e>0?S(m[f],m[f+1],v[f],v[f+1]):S(m[f+1],m[f],v[f+1],v[f]);m=v}const L=t.yLow+t.rise*l;let u=null;if(s-L>.02)for(let g=0;g<=T;g++){const v=a+(r-a)*g/T,f=Math.sqrt(i*i-v*v),$=-e*v/i,M=f/i,F=h(e*v,s,-f,$,0,M,A,3,0),B=h(e*v,L,-f,$,0,M,A,3,s-L);u&&S(u[0],F,u[1],B),u=[F,B]}}for(let o=0;o<=k.n;o++){const a=t.notch+k.w*o,r=o===0?t.yStage:j[o-1],s=o<k.n?j[o]:1e9;let l=null;for(let i=0;i<R.length;i++)for(const d of[-1,1]){const y=R[i];if(y<=a+.01)continue;const T=Math.sqrt(y*y-a*a),m=Z(y,d),L=Math.min(m,s),u=Math.min(m,r),g=[T,L,u];if(d<0&&l&&(l[1]>l[2]+.001||L>u+.001)){const v=Math.max(l[1],l[2]),f=Math.max(L,u),$=h(e*a,v,-l[0],-e,0,0,A,3,0),M=h(e*a,l[2],-l[0],-e,0,0,A,3,v-l[2]),F=h(e*a,f,-T,-e,0,0,A,3,0),B=h(e*a,u,-T,-e,0,0,A,3,f-u);S($,F,M,B)}l=g}}{const o=Math.sqrt(t.pool*t.pool-t.notch*t.notch),a=Math.sqrt(t.low*t.low-t.notch*t.notch);S(h(e*t.notch,t.yStage,-o,e,0,0,A,1),h(e*t.notch,t.yStage,-a,e,0,0,A,1),h(e*t.notch,t.yLow,-o,e,0,0,A,1),h(e*t.notch,t.yLow,-a,e,0,0,A,1))}}{const e=b,o=t.yStage-.3,a=-e.a-e.depth/2,r=-e.a+e.depth/2,s=[.5,.51,.56],l=[];l.push([-e.inner,0,-e.outer,0,-1,0]);for(let m=0;m<=24;m++){const L=Math.PI*m/24,u=-Math.cos(L),g=Math.sin(L);l.push([e.inner*u,e.spring+e.inner*g,e.outer*u,e.spring+e.outer*g,u,g])}l.push([e.inner,0,e.outer,0,1,0]);let i=null,d=null,y=null,T=null;for(const[m,L,u,g,v,f]of l){const $=[h(m,o+L,r,0,0,1,s,1),h(u,o+g,r,0,0,1,s,1)],M=[h(m,o+L,a,0,0,-1,s,1),h(u,o+g,a,0,0,-1,s,1)],F=[h(u,o+g,r,v,f,0,s,1),h(u,o+g,a,v,f,0,s,1)],B=[h(m,o+L,r,-v,-f,0,s,1),h(m,o+L,a,-v,-f,0,s,1)];i&&(S(i[0],i[1],$[0],$[1]),S(d[0],d[1],M[0],M[1]),S(y[0],y[1],F[0],F[1]),S(T[0],T[1],B[0],B[1])),i=$,d=M,y=F,T=B}}n&&await n();const p=new c.BufferGeometry;return p.setAttribute("position",new c.Float32BufferAttribute(x,3)),p.setAttribute("normal",new c.Float32BufferAttribute(H,3)),n&&await n(),p.setAttribute("color",new c.Float32BufferAttribute(q,3)),p.setAttribute("aKind",new c.Float32BufferAttribute(K,1)),p.setAttribute("aTop",new c.Float32BufferAttribute(_,1)),p.setIndex(N),p.computeBoundingSphere(),p}async function zt(n,x={}){const H=!x.LU,q=x.LU||dt(),K=x.WU||{uLate:{value:0}},_=x.streams||(()=>{const p={};for(const e of["stars","mottle","clouds","meteors","range","crowd","floats","masts","hill"])p[e]=n.rng.fork(e);return p})(),N=new c.Group,h=new c.ShaderMaterial({uniforms:{...q,uSeats:{value:null},uTierFill:{value:new Float32Array(t.tiers).fill(.9)}},side:c.DoubleSide,vertexShader:`attribute vec3 color; attribute float aKind, aTop; varying vec3 vW, vN, vL, vCol; varying float vKind, vTop; ${U}
      void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = olaW(w.xyz); vN = olaW(mat3(modelMatrix)*normal); vL = position; vCol = color; vKind = aKind; vTop = aTop; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`uniform sampler2D uSeats; uniform float uTierFill[${t.tiers}]; varying vec3 vW, vN, vL, vCol; varying float vKind, vTop; ${U} ${ct} ${tt}
      // where in the seat table is the seat at this place of the tiers (xy), and can a ray at this height pass through someone sitting there (z)?
      // Arithmetic only: the table itself is read in main, outside every branch.
      vec3 seatAt(vec3 q){ float r = length(q.xz), k = clamp(floor((r - ${t.low}.)/${t.tread}.), 0., ${t.tiers-1}.), f = r - ${t.low}. - ${t.tread}.*k;
        float odd = step(2.05, f), j = 2.*k + odd, rr = ${t.low}. + ${t.tread}.*k + mix(1.15, 2.95, odd), ty = ${t.yLow.toFixed(2)} + ${t.rise.toFixed(2)}*(k + 1.);
        float ang = atan(q.x, -q.z + 1e-6); ang += (1. - step(0., ang))*6.2831853;
        float n = floor(6.2831853*rr/.9), sI = ang/6.2831853*n;
        float ok = step(${t.low}., r) * step(r, ${t.top}.) * step(abs(r - rr), .36) * step(q.y, ty + .98) * step(ty - .05, q.y) * step(abs(fract(sI) - .5), .46);
        return vec3((floor(sI) + .5)/1024., (j + .5)/${t.tiers*2}., ok); }
      // the row of seats abreast of a point of the tiers (a01: its bearing, 0 to two pi; k: its tread; odd: which of the tread's two rows):
      // (the seat's column in the table, its neighbour's to the nearer hand, metres along the row from the seat's middle, 0)
      vec4 rowAt(float a01, float k, float odd){ float rr = ${t.low}. + ${t.tread}.*k + mix(1.15, 2.95, odd), n = floor(6.2831853*rr/.9), sI = a01/6.2831853*n, c = floor(sI), su = fract(sI) - .5;
        return vec4(c, mod(c + (su < 0. ? -1. : 1.), n), su*.9, 0.); }
      void main(){ if (vW.y < -.03) discard;
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.)), alb = vCol;
        float r = length(vL.xz), ang = atan(vL.x, -vL.z + 1e-6), foot = max(fwidth(vL.x), fwidth(vL.z)), fine = clamp(1.2 - 1.6*foot, 0., 1.);
        float turf = 1. - smoothstep(.2, .8, vKind), wall = step(2.5, vKind) * (1. - step(3.5, vKind)), pave = step(3.5, vKind), tier = smoothstep(1.5, 1.9, vKind) * (1. - step(2.5, vKind));
        float gn = olaNoise(vL.xz*.047)*.35 + olaNoise(vL.xz*.31 + 7.)*.3 + olaNoise(vL.xz*2.1)*.35*fine + .17*(1.-fine);
        // the outer slope is a hill with a shore, not a disc: rough grass in two greens with mown rides between, a paler mown lawn where the
        // fliers come down (the near foot, either side of the landing stair), bare places worn by feet, and at the water a dark wet margin
        // of mud and stones. On snow visits the snow lies drifted: deep in the hollows, grass and stone showing through on the swells.
        float swell = olaNoise(vec2(ang*7., r*.06) + 3.)*.6 + olaNoise(vec2(ang*23., r*.21))*.4;
        float lawn = (1. - smoothstep(.34, .52, abs(abs(ang) - 2.72))) * smoothstep(149., 153., r) * (1. - smoothstep(180., 186., r)) * step(.5, turf);      // (bearings 133 to 177 degrees either side: the near slope beside the stair)
        vec3 grass = mix(vec3(.085,.15,.105), vec3(.125,.175,.115), swell) * (.72 + .56*gn);
        grass = mix(grass, vec3(.13,.2,.15) * (.9 + .1*sin(r*2.1)*fine), lawn);
        grass = mix(grass, vec3(.2,.19,.17), .6*(1. - smoothstep(.0, .045, abs(olaNoise(vec2(ang*5.5 + 3., r*.02)) - .5))) * (1. - lawn));      // worn paths up the slope
        float wet = 1. - smoothstep(.15, 1.5, vL.y), stones = smoothstep(.7, .8, olaNoise(vL.xz*1.7 + 4.)) * smoothstep(.45, .6, olaNoise(vL.xz*.23)) * wet;      // (round stones in loose scatters, not a row)
        grass = mix(grass, vec3(.04,.05,.055), wet*.8); grass = mix(grass, vec3(.2,.21,.23), stones*.7*fine + stones*.1*(1.-fine));
        alb = mix(alb, grass, turf);
        // cut stone: joints along the seats and between the blocks, a worn lighter nosing at each tread's edge
        float arc = ang*r, jw = min(fwidth(arc)*.8, .4), joint = 1. - smoothstep(.04+jw, .1+jw, abs(fract(arc/2.6 + floor(r/4.)*.37) - .5)*2.6);
        float nose = smoothstep(.72, .98, fract((r - ${t.low}.)/${t.tread}.)) * step(.5, n.y);
        alb *= mix(1., .9 + .2*olaNoise(vec2(arc*.4, r*.9)), 1.-turf);
        alb *= 1. - .14*tier*(1.-joint)*fine;
        alb *= 1. + .12*tier*nose;
        alb *= 1. - .2*tier*step(.5, n.y)*(1. - smoothstep(.0, .17, fract((r - ${t.low}.)/${t.tread}.)))*clamp(1.5 - .9*foot, 0., 1.);      // the worn dark foot of each riser: an empty tier is still read as steps
        // paving (the stage, the terraces of its stepped sides, the ring round the pool): large slabs, dark joints, each slab its own tone,
        // and the wear of feet down the stage's middle
        vec2 sl = vec2(vL.x/3.2 + .5*floor(vL.z/2.1), vL.z/2.1), sc = floor(sl), sf = fract(sl);
        float jx = min(sf.x, 1. - sf.x)*3.2, jz = min(sf.y, 1. - sf.y)*2.1, jd = min(jx, jz), jf = clamp(foot*.9, 0., .5);
        float slabJ = (1. - smoothstep(.02 + jf*.4, .07 + jf, jd)) * clamp(1.3 - 2.*foot, 0., 1.);
        alb *= mix(1., (.86 + .26*olaHash(sc)) * (1. - .34*slabJ) * (1. + .1*exp(-min(vL.x*vL.x, 900.)/26.)), pave);
        float drift = mix(1., smoothstep(.22, .5, swell + .25*gn) * (1. - wet), turf);                 // on the hill the snow lies in drifts
        alb = mix(alb, vec3(.5,.54,.62), uSnow * smoothstep(.5,.8,n.y) * mix(.5, 1., turf) * (.85+.15*gn) * drift * (1. - .75*pave*exp(-min(vL.x*vL.x, 900.)/60.)));      // (the stage's middle is swept)
        // the walls of the stepped sides: courses of cut stone with broken joints, and a coping stone along every top
        float crs = fract(vL.y/.57), run = vL.z*.92 + vL.x*.39, stag = fract(run/1.9 + .5*floor(vL.y/.57)), wf = clamp(1.3 - 2.2*max(fwidth(vL.y), fwidth(run)), 0., 1.);
        float mortar = max(1. - smoothstep(.0, .09, min(crs, 1. - crs)), 1. - smoothstep(.0, .03, min(stag, 1. - stag)));
        float cope = 1. - smoothstep(.34, .4, vTop), under = smoothstep(.34, .4, vTop) * (1. - smoothstep(.44, .6, vTop));
        alb *= mix(1., (1. - .2*mortar*wf*(1. - cope)) * (.9 + .2*olaHash(vec2(floor(vL.y/.57), floor(run/1.9 + .5*floor(vL.y/.57))))) * (1. + .3*cope) * (1. - .3*under), wall);
        // what reaches a wall that the star only grazes: the light the pale floor at its foot throws back, and the amber of the crowd's lamps
        vec3 bounce = uStarCol * .2 * wall * bowlLit(vec3(vL.x + n.x*2.5, vL.y, vL.z)) + vec3(1., .44, .095) * wall * (.05 + .1*exp(-clamp(vTop, 0., 40.)/1.6));
        // the portal's own pale light on the stage before the arch and up the stepped sides: it moves as the light in the arch moves
        vec3 pq = vec3(vL.x, vL.y - ${(t.yStage+9).toFixed(1)}, vL.z + ${(t.arch-1.5).toFixed(1)}); float pr = length(pq * vec3(1., 1.3, 1.));      // (the middle of the arch's light: within its depth, 1.5 m toward the pool from its plane)
        float inNotch = step(abs(vL.x), ${(t.notch+k.n*k.w+.5).toFixed(1)}) * step(0., pq.z) * step(vL.z, 0.) * (1. - turf) * (1. - tier);
        float psw = olaNoise(vec2(pr*.16 - uTime*.5, vL.y*.5 + vL.x*.11 + uTime*.21)) * .65 + olaNoise(vec2(pq.z*.33 + uTime*.4, (vL.y + vL.x*.7)*.33 - uTime*.27)) * .5;
        vec3 port = vec3(.71, .80, 1.) * 1.1 * inNotch * exp(-min(pr, 400.)/26.) * (.25 + .75*smoothstep(.2, .95, psw)) * mix(1., .6, step(.5, n.y));
        float lit = bowlLit(vL);
        // the crowd's own second shadows on the steps: carry the point up the star's ray and ask the seats it passes (five places, each read
        // of the table standing alone). Where a seat is smaller than a pixel the pattern melts to its MEAN: the tier's filled share times
        // the share of a seat's width a body shades (${.7}).
        vec3 s0 = seatAt(vL + vec3(0., .30*${I.toFixed(5)} + .04, -.30)), s1 = seatAt(vL + vec3(0., 1.02*${I.toFixed(5)} + .04, -1.02)), s2 = seatAt(vL + vec3(0., 1.94*${I.toFixed(5)} + .04, -1.94));
        vec3 s3 = seatAt(vL + vec3(0., 3.06*${I.toFixed(5)} + .04, -3.06)), s4 = seatAt(vL + vec3(0., 4.38*${I.toFixed(5)} + .04, -4.38));
        float h0 = texture2D(uSeats, s0.xy).r, h1 = texture2D(uSeats, s1.xy).r, h2 = texture2D(uSeats, s2.xy).r, h3 = texture2D(uSeats, s3.xy).r, h4 = texture2D(uSeats, s4.xy).r;
        float sh = max(max(max(s0.z*step(.5, h0), s1.z*step(.5, h1)), max(s2.z*step(.5, h2), s3.z*step(.5, h3))), s4.z*step(.5, h4));
        float kt = clamp(floor((r - ${t.low}.)/${t.tread}.), 0., ${t.tiers-1}.), meanSh = uTierFill[int(kt)] * .7;
        lit *= 1. - .85 * tier * mix(meanSh, sh, fine);
        // THE HELD GLOBES' LIGHT ON THE STEPS: on each tread, the globes of its two rows (the seat abreast and its neighbour to the nearer
        // hand in each), by the metres from each globe. Where a seat is smaller than a pixel: the MEAN of that (0.85 with every globe
        // there) times the half of the tier's filled seats that hold one.
        float a01 = ang + (1. - step(0., ang))*6.2831853, fT = r - ${t.low}. - ${t.tread}.*kt, jy = (2.*kt + .5)/${t.tiers*2}., jy1 = (2.*kt + 1.5)/${t.tiers*2}.;
        vec4 rA = rowAt(a01, kt, 0.), rB = rowAt(a01, kt, 1.);
        float gA0 = texture2D(uSeats, vec2((rA.x + .5)/1024., jy)).a, gA1 = texture2D(uSeats, vec2((rA.y + .5)/1024., jy)).a, gB0 = texture2D(uSeats, vec2((rB.x + .5)/1024., jy1)).a, gB1 = texture2D(uSeats, vec2((rB.y + .5)/1024., jy1)).a;
        float dA = fT - ${(1.15-it).toFixed(2)}, dB = fT - ${(2.95-it).toFixed(2)}, oA = .9 - abs(rA.z), oB = .9 - abs(rB.z);
        float pools = step(.75, gA0)*.35/(.55 + dA*dA + rA.z*rA.z) + step(.75, gA1)*.35/(.55 + dA*dA + oA*oA) + step(.75, gB0)*.35/(.55 + dB*dB + rB.z*rB.z) + step(.75, gB1)*.35/(.55 + dB*dB + oB*oB);
        vec3 held = vec3(1., .44, .095) * .55 * tier * mix(uTierFill[int(kt)] * .42, pools, fine);
        vec3 c = alb * (olaLight(n, lit * olaBands(vW.xz)) + bounce + port + held) + olaLamps(vW.xz, alb) * max(step(${t.top}., length(vL.xz)), pave);      // (the lamps' pools lie on the ground itself: the hill's paths, the rim walk, the stage and its terraces)
        gl_FragColor = vec4(olaFog(c, length(vW - olaW(cameraPosition))), 1.); }`}),S=new c.Mesh(await gt(n.yield),h);N.add(S),await n.yield();const G=t.rise/t.tread,C=t.low+(t.yPool-t.yLow)/G,J=.55,A=[.045,.05,.085],V=t.yLow+t.rise-t.yPool,X=t.yLow+t.rise*t.tiers-t.yPool,w=p=>p.toFixed(2),P=new c.Mesh(new c.CircleGeometry(t.pool,64).rotateX(-Math.PI/2).translate(0,t.yPool,0),new c.ShaderMaterial({uniforms:{...q,...K,uRough:{value:.12},uTierFill:h.uniforms.uTierFill},side:c.DoubleSide,vertexShader:`varying vec3 vW, vL, vCamL; ${U} void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = olaW(w.xyz); vL = position;
      vCamL = (inverse(modelMatrix)*vec4(cameraPosition, 1.)).xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`uniform float uTierFill[${t.tiers}]; varying vec3 vW, vL, vCamL; ${U} ${wt} ${tt}
      float edge3(float x){ return smoothstep(-1.5, 1.5, x); }
      void main(){ vec3 cam = olaW(cameraPosition), V = vW - cam; float dist = length(V); V /= max(dist, 1e-3);
        float fine = clamp(1.4 - 2.2*max(fwidth(vW.x), fwidth(vW.z)), 0., 1.), t = uTime;
        // (every derivative before a branch or a product that can be zero)
        vec3 rl = vL - vCamL; rl.y = abs(rl.y) + 1e-3; float s = max(length(rl.xz), 1e-4), m = rl.y / s; vec2 dh = rl.xz / s;
        float b = dot(vL.xz, dh), r2 = dot(vL.xz, vL.xz);
        float tLow = -b + sqrt(max(b*b + ${w(t.low*t.low)} - r2, 0.)), tTop = -b + sqrt(max(b*b + ${w(t.top*t.top)} - r2, 0.));
        vec2 pm = vL.xz + dh * mix(tLow, tTop, .35);                                                // where the eye's line, carried on over the water, stands among the tiers
        float fc = atan(pm.x, -pm.y) * 52., colG = clamp(1.5 - 1.3*fwidth(fc), 0., 1.);            // the tiers in columns some 1.6 m wide, each with its own share of globes
        vec3 c = olaWater(vW.xz, V, fine, bowlLit(vL), 1.);
        // a still dark pool gives back more of the sky than moving water: the sheen that says it is water. The cat's-paws drift on a
        // TYPED course of their own, not read from the evening's wind: the broad patches at about a metre a second, some 110 degrees
        // off the wind's bearing, the small ones across them at a quarter of a metre a second (about 40 degrees off it). Ruffled
        // water gives back a paler, softer sky, slack water stays a dark mirror
        float dep = clamp(-V.y, .002, 1.), back = clamp(V.z, 0., 1.) / max(length(V.xz), 1e-3);
        float paw = .6*olaNoise(vL.xz*.1 + vec2(t*.09, t*.05)) + .4*olaNoise(vL.xz*.29 - vec2(t*.07, 0.) + 7.), ruff = smoothstep(.36, .62, paw) * fine + .45*(1. - fine);
        float swell = .5 + .5*sin(dot(vL.xz, vec2(.21, .13)) - t*.6 + 2.6*olaNoise(vL.xz*.07));      // a slow swell, its crests some 25 m apart
        c += olaSkyUp(dep, back) * (.3 + .55*ruff) * (1. - .5*dep);
        // how far the water turns the mirrored ray along the eye's line (in the tangent of its height), and the glints it is broken into:
        // long along the eye's line, narrow across it, moving with the ripples; under a pixel they go to their mean
        float sp = mix(.04, ${J}, ruff) * (.75 + .5*swell);
        float gu = dot(vL.xz, dh), gv = dot(vL.xz, vec2(-dh.y, dh.x));
        float g1 = olaNoise(vec2(gv*6., gu*.5) + vec2(t*.6, -t*.9)), g2 = olaNoise(vec2(gv*2.4 + 9., gu*.22) - vec2(t*.35, t*.5));
        float g3 = olaNoise(vec2(gv*13., gu*1.4) + vec2(-t*.9, -t*1.6));
        float gn = clamp((.45*g1 + .25*g2 + .3*g3 - .27)*2.2, 0., 1.), gnA = clamp((.3*g1 + .4*g2 + .3*g3 - .27)*2.2, 0., 1.);      // (spread to the whole of 0..1)
        // THE TIERS' AMBER: the tiers stand between two heights over the water in the mirrored ray's direction (mLo to mHi, as tangents).
        // Within that band the mirror is full of their light; above it (water nearer the eye) only the steeper ripples still catch a
        // globe, fewer and fewer of them: so the light does not dim toward the eye, its GLINTS THIN OUT (each glint a globe's own light)
        float mLo = ${w(V)} / max(tLow, 1.), mHi = ${w(X)} / max(tTop, 1.), over = max(m - mHi, 0.) / (1.1*sp);
        float W = edge3((m - mLo)/sp) * exp(-min(over*over, 30.));
        float have = mix(1., clamp((stepTop(pm.x) - ${w(t.yLow)}) / ${w(t.rise*t.tiers)}, 0., 1.), step(pm.y, 0.));      // (the notch and its stepped sides hold less of the tiers, or none)
        float fillM = (uTierFill[2] + uTierFill[8] + uTierFill[14] + uTierFill[20]) * .25;
        // (and in ruffled water the steepest ripples catch a globe from the stands to either hand: a thin scatter of amber glints in
        // every cat's-paw, thicker toward the rim under the stands that stand full behind it; none where the notch opens)
        vec2 po = vL.xz / max(sqrt(r2), 1e-3) * 84.;
        float under = smoothstep(16., 33., sqrt(r2)) * mix(1., clamp((stepTop(po.x) - ${w(t.yLow)}) / ${w(t.rise*t.tiers)}, 0., 1.), step(po.y, 0.));
        float d = max(have * W * mix(1., .45 + 1.1*olaNoise(vec2(fc, 2.7)), colG), ruff * (.2 + .5*under)) * fillM * 1.6;      // how thick the glints lie here
        float glint = mix(d*d*.5, smoothstep(1. - .72*d, 1.5 - .72*d, gn), fine);
        c += vec3(1., .44, .095) * .5 * glint * (1. - .35*dep);
        // THE ARCH'S PALE LIGHT, down the middle of the far water: the arch stands ${b.a} m along the axis, its opening ${2*b.inner} m wide and ${b.spring+b.inner} m high
        float tA = (${w(-b.a)} - vL.z) / min(dh.y, -1e-3), xA = (vL.x + dh.x*tA) / (${w(b.inner)} + tA*sp*.35);
        float mA0 = ${w(t.yStage-t.yPool)} / max(tA, 1.), mA1 = ${w(t.yStage+b.spring+b.inner-t.yPool)} / max(tA, 1.), overA = max(m - mA1, 0.) / (1.1*sp);
        float dA = step(dh.y, -.05) * edge3((m - mA0)/sp) * exp(-min(overA*overA, 30.)) * exp(-min(xA*xA*1.4, 30.));
        c += vec3(.71, .80, 1.) * .55 * mix(dA*dA*.5, smoothstep(1. - .72*dA, 1.5 - .72*dA, gnA), fine);
        // the tiers in slack water: the mirrored ray from this point of the pool, met with the cone of the tiers; each globe a point
        float Bq = m / ${G.toFixed(4)}, den = min(Bq*Bq - 1., -1e-3), ab = ${C.toFixed(2)}*Bq - b;
        float tau = (-ab - sqrt(max(ab*ab - den*(${(C*C).toFixed(1)} - r2), 0.))) / den, rh = ${C.toFixed(2)} + Bq*tau;
        vec2 hp = vL.xz + dh*tau; float hy = ${t.yPool.toFixed(2)} + m*tau;
        hp += (vec2(olaNoise(vL.xz*.9 + t*.3), olaNoise(vL.xz*.9 + 3.7 - t*.25)) - .5) * clamp(tau, 0., 200.) * .05 * fine;      // (the ripple breaks the image)
        float on = step(Bq, .985) * smoothstep(${t.low}., ${t.low+3}., rh) * (1. - smoothstep(${t.top-6}., ${t.top}., rh));
        on *= 1. - step(0., -hp.y) * step(stepTop(hp.x), hy);                                       // (over the stage and its stepped sides the mirror finds no crowd)
        float kt = clamp(floor((rh - ${t.low}.)/${t.tread}.), 0., ${t.tiers-1}.);
        vec2 cell = floor(vec2(rh*2., atan(hp.x, hp.y)*rh*1.1)); float grain = clamp(1.6 - 1.2*length(fwidth(hp))*2., 0., 1.);
        float spk = mix(.5, 3.2*step(.84, olaHash(cell)), grain);
        c += vec3(1., .44, .095) * on * uTierFill[int(kt)] * spk * .26 * (1. - .6*dep) * (1.2 - .7*ruff);      // the tiers' held globes in the mirror: points near the far rim
        // the wet rim: where the water meets the paved ring it gives back the ring's own light in a thin line that the ripples move
        float rim = smoothstep(${w(t.pool-.75)}, ${w(t.pool-.25)}, sqrt(r2) + .14*(olaNoise(vL.xz*1.7 + t*.4) - .5));
        c = mix(c, vec3(.15, .16, .21) + vec3(1., .44, .095) * .04 * fillM, rim * .8);
        // the water's least tone (POOL_FLOOR, above) where it lies slack; where the air ruffles it, it gives back a wider and paler sky
        c = max(c, vec3(${A.join(", ")})) * (1. + ruff * (.2 + .45*gn) + .16*(swell - .5));
        gl_FragColor = vec4(olaFog(c, dist), 1.); }`}));P.renderOrder=1,N.add(P);const z=vt({late:!!x.late,rare:!!x.rare,highCloud:!!x.highCloud,LU:q,streams:_});if(z.stars){const p=new c.InstancedBufferGeometry,e=new c.PlaneGeometry(2,2);p.index=e.index,p.setAttribute("position",e.getAttribute("position")),p.setAttribute("aStar",new c.InstancedBufferAttribute(z.stars.dirs,4)),p.setAttribute("aTw",new c.InstancedBufferAttribute(z.stars.tw,2)),p.instanceCount=z.stars.n;const o=new c.Mesh(p,new c.ShaderMaterial({uniforms:{uTime:q.uTime},transparent:!0,depthWrite:!1,blending:c.AdditiveBlending,vertexShader:`attribute vec4 aStar; attribute vec2 aTw; uniform float uTime; varying vec2 vQ; varying float vB;
      void main(){ vec3 s = aStar.xyz, d = vec3(s.x*${Math.cos(O*E).toFixed(5)} + s.z*${Math.sin(O*E).toFixed(5)}, -s.y, -s.x*${Math.sin(O*E).toFixed(5)} + s.z*${Math.cos(O*E).toFixed(5)});      // into the bowl's frame, mirrored
        vec3 camL = (inverse(modelMatrix)*vec4(cameraPosition, 1.)).xyz; float hgt = camL.y - ${t.yPool.toFixed(2)}, t = max(hgt, 0.) / max(s.y, .02);
        vec3 hit = camL + d*t, a = normalize(cross(d, vec3(0., 1., .01))), b = cross(a, d);
        float inside = step(.05, hgt) * step(length(hit.xz), ${(t.pool-.4).toFixed(1)});
        vQ = position.xy; vB = aStar.w * (.72 + .28*sin(uTime*aTw.y + aTw.x)) * smoothstep(.03, .2, s.y) * .55 * inside;
        vec4 p = projectionMatrix*viewMatrix*modelMatrix*vec4(camL + (d + (a*position.x + b*position.y)*.0042) * t * .997, 1.);
        gl_Position = inside > 0. ? p : vec4(2., 2., 2., 1.); }`,fragmentShader:`varying vec2 vQ; varying float vB;
      void main(){ float r2 = dot(vQ,vQ), px = max(fwidth(vQ.x), 1e-4), s = max(.3, 1.1*px);
        gl_FragColor = vec4(vec3(.74,.82,1.) * vB * 1.5 * exp(-r2/(s*s)) * (1. - smoothstep(.6, 1., sqrt(r2))) * pow(min(1., .3/s), 1.2), 1.); }`}));o.frustumCulled=!1,o.renderOrder=2,N.add(o)}H&&(N.add(z.group),z.group.rotation.y=O*E,z.group.scale.setScalar(.9),xt(q,1,!1)),await n.yield();const j=x.RU||{uRes:{value:new c.Vector2(1280,720)}},W=x.lamp?null:pt(q,{x0:-232,z0:-232,w:464,h:464}),Q=x.lamp||((p,e,o,a,r,s,l)=>W.stamp(p,e,o,a,r,s,l)),Z=await ut(N,{LU:q,RU:j,S:_,full:x.full??1,litGLSL:tt,wind:x.wind,far:x.far,stone:h,lamp:Q,yieldFn:n.yield});W&&await W.finish(n.yield);const R=null;return{object:N,radius:150,height:40,center:new c.Vector3(0,16,0),ground:!1,sky:z,shell:S,pool:P,stone:h,dress:Z,anchors:{arch:new c.Vector3(0,t.yStage+11,-b.a),axis:new c.Vector3(0,0,-1),centre:mt(0,0)},update(p,e,o){H&&(q.uTime.value=e,n.renderer&&n.renderer.getDrawingBufferSize(j.uRes.value),z.update(e,o),z.group.position.sub(N.getWorldPosition(new c.Vector3))),R&&R.update&&R.update(p,e,o)},dispose(){}}}const D={hemi:1.7,glow:.3,band:.8,star:.72};function xt(n,x,H){n.uHemiSky.value.set("#33447A").multiplyScalar(D.hemi*(H?.8:1)),n.uHemiGround.value.set("#181B2C").multiplyScalar(D.hemi),n.uGlowDir.value.set(0,Math.sin(5*E),Math.cos(5*E)),n.uGlowCol.value.set("#C79AA6").multiplyScalar(H?0:D.glow*(1.1-x)),n.uBandDir.value.set(0,Math.sin(60*E),-Math.cos(60*E)),n.uBandCol.value.set("#E9EEFA").multiplyScalar(D.band*.5),n.uStarCol.value.set("#DCE8FF").multiplyScalar(D.star*1.6*x),n.uStar.value=x}export{St as ARCH_AT,tt as BOWL_LIT_GLSL,D as LIGHT_K,zt as buildHero,xt as setLights};
