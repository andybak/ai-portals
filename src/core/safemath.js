const o=`#define pow(a,b) pow(max(abs(a),1e-30),b)
#define sqrt(a) sqrt(max(a,0.))
#define inversesqrt(a) inversesqrt(max(a,1e-30))
#define log(a) log(max(a,1e-30))
#define log2(a) log2(max(a,1e-30))
#define acos(a) acos(clamp(a,-1.,1.))
#define asin(a) asin(clamp(a,-1.,1.))
#define normalize(a) ((a)*inversesqrt(max(dot(a,a),1e-30)))
`;function c(f,n){const i=n?o.split(`
`).filter(s=>n.split(",").some(t=>s.startsWith("#define "+t+"("))).join(`
`)+`
`:o,a=f.getContext();if(a.__safeMath)return;a.__safeMath=!0;const l=a.shaderSource;a.shaderSource=function(s,t){let e=String(t);if(e.startsWith("#version")){const r=e.indexOf(`
`)+1;e=e.slice(0,r)+i+e.slice(r)}else e=i+e;return l.call(this,s,e)}}export{c as installSafeMath};
