import{SHED as e}from"./doors-in-transit-plan.js";const p={value:null},f={value:1},o={cy:e.spring,r:62},t=s=>Number(s).toFixed(4),r=(e.x1-e.x0)/2,a=e.z0+e.ribStep/2,x=`
float shedRoofY(float x){ float s = min(1., abs(x) / ${t(r)});
  return ${t(e.spring)} + ${t(e.crown-e.spring)} * (.85 * pow(max(1e-4, 1. - pow(max(s, 1e-4), 2.6)), 1. / 2.6) + .15 * (1. - s)); }
float shedSunShade(vec3 p, vec3 S){
  float lit = 0., ky = 1. / max(S.y, .05), e = S.z < 0. ? -1. : 1.;
  // through the great screen of the sun's end: a half-round of light, crossed by the shadows of its bars
  float te = (e * ${t(e.z1)} - p.z) / (abs(S.z) < 1e-3 ? e * 1e-3 : S.z), xh = p.x + S.x * te, yh = p.y + S.y * te, soft = 2.5 + te * .02;
  if (te > 0.) {
    vec2 fp = vec2(xh, yh - ${t(o.cy)}); float r = length(fp), a = atan(fp.y, abs(fp.x) < 1e-4 ? 1e-4 : fp.x), sec = a / (3.14159265 / 24.);
    float inFan = smoothstep(-soft, soft, ${t(o.r)} - r) * smoothstep(${t(o.cy)} - soft, ${t(o.cy)} + soft, yh);
    float dsec = abs(fract(sec / 4. + .5) - .5) * 4. * (3.14159265 / 24.) * r, dring = abs(fract((r - 14.) / 12. + .5) - .5) * 12.;
    float barsh = max(1. - smoothstep(.5, 2.4, dsec), 1. - smoothstep(.4, 2., dring));
    lit = inFan * (1. - .5 * barsh);
  }
  // through the roof: where the ray toward the sun leaves the glass; a rib shades what lies just behind it
  float yr = 80., xr = p.x;
  xr = p.x + S.x * ky * max(yr - p.y, 0.); yr = shedRoofY(xr);
  xr = p.x + S.x * ky * max(yr - p.y, 0.); yr = shedRoofY(xr);
  xr = p.x + S.x * ky * max(yr - p.y, 0.); yr = shedRoofY(xr);
  float zr = p.z + S.z * ky * max(yr - p.y, 0.), urib = fract((zr - ${t(a)}) / ${t(e.ribStep)}) * ${t(e.ribStep)};
  float ribsh = smoothstep(${t(e.ribStep-7)}, ${t(e.ribStep-4)}, urib) * (1. - smoothstep(${t(e.ribStep-.6)}, ${t(e.ribStep)}, urib));
  float viaRoof = (1. - smoothstep(${t(e.z1-4)}, ${t(e.z1)}, abs(zr))) * (1. - smoothstep(${t(r-6)}, ${t(r)}, abs(xr)));
  return max(lit, viaRoof * (1. - .55 * ribsh));
}
`;export{o as FAN,x as SHED_SUN_GLSL,f as shedBarsUniform,p as shedSunUniform};
