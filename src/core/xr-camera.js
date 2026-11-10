// Keep the headset's asymmetric field of view while using this camera's clip planes.
export function setXRProjection(camera, projection) {
  const { near, far } = camera;
  camera.projectionMatrix.copy(projection);
  const e = camera.projectionMatrix.elements;
  e[10] = far === Infinity ? -1 : -(far + near) / (far - near);
  e[14] = far === Infinity ? -2 * near : -2 * far * near / (far - near);
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
}
