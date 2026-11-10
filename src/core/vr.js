import * as THREE from 'three';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { Post } from './post.js';

// The flight is the rig; tracked head motion is local to it. No input sources or
// DOM overlay are requested. Each eye gets its own portal and postprocessed view.
export function setupVR(engine) {
  if (!navigator.xr || !window.isSecureContext) return;
  const r = engine.renderer, xr = r.xr, post = engine.post;
  xr.setReferenceSpaceType('local');
  xr.setFramebufferScaleFactor(1);
  const rig = new THREE.Group(), base = new THREE.PerspectiveCamera();
  rig.add(base);
  const copy = new FullScreenQuad(new THREE.ShaderMaterial({
    uniforms: { image: { value: null } }, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: 'uniform sampler2D image; varying vec2 vUv; void main(){ gl_FragColor=texture2D(image,vUv); }',
  }));
  const button = document.createElement('button');
  button.id = 'b-vr'; button.textContent = 'Enter VR'; button.hidden = true;
  button.setAttribute('aria-label', 'Enter virtual reality');
  document.body.append(button);
  navigator.xr.isSessionSupported('immersive-vr').then((ok) => { button.hidden = !ok; }).catch(() => {});
  let savedPaused = false, firstFrame = false;
  const eyePosts = [];
  const restoreBuffers = () => {
    for (const eyePost of eyePosts) eyePost.dispose();
    eyePosts.length = 0;
    engine.portalRT.setSize(Math.floor(engine.w * engine.pr), Math.floor(engine.h * engine.pr));
  };
  button.addEventListener('click', async () => {
    button.disabled = true;
    let session;
    try {
      console.info('[PortalsXR] Requesting immersive session');
      session = await navigator.xr.requestSession('immersive-vr');
      console.info('[PortalsXR] Session granted; making graphics context XR compatible');
      await xr.setSession(session);
    } catch (e) {
      if (session) await session.end().catch(() => {});
      button.textContent = 'Retry VR'; button.title = e.message;
      console.warn('[PortalsXR] Could not enter VR:', e);
    } finally { button.disabled = false; }
  });
  xr.addEventListener('sessionstart', () => {
    // All rendering is explicit per eye, including offscreen preparation work.
    xr.enabled = false;
    savedPaused = engine.settings.paused; engine.settings.paused = false;
    firstFrame = true;
    console.info('[PortalsXR] Session started: native eye resolution and full postprocessing');
    engine.calm = 1; engine.camInit = false;
    document.body.classList.add('in-vr');
    engine._last = performance.now();
  });
  xr.addEventListener('sessionend', () => {
    engine.settings.paused = savedPaused;
    post.composer.renderToScreen = true;
    document.body.classList.remove('in-vr');
    button.textContent = 'Enter VR';
    restoreBuffers();
    engine._resize(true); engine._last = performance.now();
    console.info('[PortalsXR] Session ended; desktop rendering restored');
  });
  engine.vr = {
    render(A, B, dt) {
      const target = r.getRenderTarget();
      if (!target) return;
      const started = performance.now();
      const viewport = target.viewport.clone();
      rig.position.copy(engine.camera.position); rig.quaternion.copy(engine.camera.quaternion);
      rig.updateMatrixWorld(true);
      base.near = engine.camera.near; base.far = engine.camera.far;
      xr.updateCamera(base);
      const eyes = xr.getCamera().cameras;
      if (!eyes.length) return;
      // The shared portal texture can serve different eye sizes without being
      // reallocated between eyes. Each post pipeline retains its own bloom history.
      const width = Math.max(...eyes.map((eye) => eye.viewport.z));
      const height = Math.max(...eyes.map((eye) => eye.viewport.w));
      if (engine.portalRT.width !== width || engine.portalRT.height !== height) engine.portalRT.setSize(width, height);
      let updated = false, drew = false;
      try {
        for (const [index, eye] of eyes.entries()) {
          // updateCamera already composed the flight rig with the tracked pose.
          // Rendering an unparented eye must not replace that world transform.
          eye.matrixWorldAutoUpdate = false;
          const v = eye.viewport;
          let eyePost = eyePosts[index];
          if (!eyePost) eyePost = eyePosts[index] = new Post(r, v.z, v.w, 1, engine.samples, engine.rtType);
          else if (eyePost.composer.readBuffer.width !== v.z || eyePost.composer.readBuffer.height !== v.w) eyePost.setSize(v.z, v.w, 1);
          eyePost.composer.renderToScreen = false;
          eyePost.bloom.enabled = post.bloom.enabled;
          eyePost.guard.enabled = post.guard.enabled;
          if (eyePost.stylePass !== post.stylePass) eyePost.setStylePass(post.stylePass);
          if (eyePost.stylePass) {
            eyePost.stylePass.uniforms.uRes.value.set(v.z, v.w);
            eyePost.stylePass.uniforms.uScale.value = Math.max(1, v.w / 900);
          }
          const dewash = B ? (engine.opts.dewash ?? A.portalSpec.dewash ?? (A.feed ? 0 : 0.85)) : 0;
          A.portal.setDewash(eyePost.bloomTexture, dewash);
          if (B && (A.feed || engine.reveal > 0.002)) {
            const rendered = engine._renderPortal(A, B, dt, eye, !updated);
            updated ||= rendered; drew ||= rendered;
            if (rendered && dewash > 0) A.portal.setDewash(eyePost.bloomTexture, dewash * (1 - THREE.MathUtils.smoothstep(engine.rimIn, 0.8, 1.2)));
          }
          eyePost.render(A.scene, eye, engine.postNow, engine.time, engine.fade);
          copy.material.uniforms.image.value = eyePost.composer.readBuffer.texture;
          target.viewport.copy(v);
          r.setRenderTarget(target);
          // A framebuffer clear ignores the viewport and would erase the other eye.
          const autoClear = r.autoClear;
          r.autoClear = false;
          try { copy.render(r); } finally { r.autoClear = autoClear; }
        }
        if (A.view.used) A.shown = drew ? B : null;
        if (firstFrame) {
          firstFrame = false;
          console.info(`[PortalsXR] First stereo frame submitted in ${Math.round(performance.now() - started)} ms`);
        }
      } finally {
        target.viewport.copy(viewport); r.setRenderTarget(target);
      }
    },
  };
}
