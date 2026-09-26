// A simplified 3D recreation of a robotic floor: robots drive a grid, slow down as a person
// approaches and stop when they get close. The person can't walk through robots.
// Click the floor to move the person.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const host = document.querySelector('.sim3d');
if (host) init(host);

function init(host) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = host.querySelector('canvas');
  const statStop = host.querySelector('[data-stopped]');
  const statSlow = host.querySelector('[data-slowed]');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  } catch (e) {
    return; // No WebGL: the illustrated fallback stays visible
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const C = {
    bg: '#22405a', floor: '#2c4f6c', line: '#f3efd4', egg: '#f3efd4',
    person: '#e0533f', ok: '#5fc27a', slow: '#f0a020', stop: '#e0442f',
    pods: ['#445b7f', '#2a6f97', '#c29d1f', '#2f8a82', '#8e3a78', '#b5523b']
  };

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.bg);
  scene.fog = new THREE.Fog(C.bg, 34, 70);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  camera.position.set(11, 12.5, 14);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false; // let the mouse wheel scroll the page
  controls.maxPolarAngle = Math.PI * 0.44;
  controls.autoRotate = !reduce;
  controls.autoRotateSpeed = 0.5;
  controls.target.set(0, 0, 0);

  scene.add(new THREE.HemisphereLight('#fff8e6', '#15293a', 1.3));
  const sun = new THREE.DirectionalLight('#fff4dc', 1.8);
  sun.position.set(9, 18, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 50 });
  sun.shadow.radius = 4;
  scene.add(sun);

  // Floor, grid lines and fiducial markers
  const COLS = 16, ROWS = 11;
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(COLS + 1, ROWS + 1),
    new THREE.MeshStandardMaterial({ color: C.floor, roughness: 1 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const linePts = [];
  for (let c = 0; c <= COLS; c++) linePts.push(c - COLS / 2, 0.002, -ROWS / 2, c - COLS / 2, 0.002, ROWS / 2);
  for (let r = 0; r <= ROWS; r++) linePts.push(-COLS / 2, 0.002, r - ROWS / 2, COLS / 2, 0.002, r - ROWS / 2);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
  scene.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: C.line, transparent: true, opacity: 0.08 })));

  const fid = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.09, 0.09),
    new THREE.MeshBasicMaterial({ color: C.line, transparent: true, opacity: 0.35 }),
    COLS * ROWS
  );
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)), one = new THREE.Vector3(1, 1, 1);
  let k = 0;
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const p = cellPos(c, r);
    m4.compose(new THREE.Vector3(p.x, 0.004, p.z), q, one);
    fid.setMatrixAt(k++, m4);
  }
  scene.add(fid);

  function cellPos(c, r) { return { x: c - COLS / 2 + 0.5, z: r - ROWS / 2 + 0.5 }; }

  // Person with two zones: robots slow down inside the outer one and stop inside the inner one
  const STOP_R = 1.4, SLOW_R = 3.2, BODY_R = 0.66;
  const personGroup = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.55, 6, 12), new THREE.MeshStandardMaterial({ color: C.person, roughness: 0.6 }));
  body.position.y = 0.5;
  body.castShadow = true;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), body.material);
  head.position.y = 1.08;
  head.castShadow = true;
  personGroup.add(body, head);
  scene.add(personGroup);

  function flat(geo, color, opacity, y) {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false }));
    m.rotation.x = -Math.PI / 2;
    m.position.y = y;
    scene.add(m);
    return m;
  }
  const zones = [
    flat(new THREE.CircleGeometry(SLOW_R, 64), C.slow, 0.08, 0.008),
    flat(new THREE.RingGeometry(SLOW_R - 0.04, SLOW_R, 64), C.slow, 0.7, 0.01),
    flat(new THREE.CircleGeometry(STOP_R, 64), C.stop, 0.2, 0.011),
    flat(new THREE.RingGeometry(STOP_R - 0.05, STOP_R, 64), C.stop, 0.9, 0.012)
  ];
  const pulse = flat(new THREE.RingGeometry(0.92, 1, 64), C.stop, 0.6, 0.014);
  const marker = flat(new THREE.RingGeometry(0.18, 0.26, 32), C.egg, 0, 0.016);

  const person = { x: -2, z: 1, tx: 2, tz: -1 };
  let manualUntil = 0, lastProgress = 0;

  // Robots
  const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  const occ = new Map();
  const key = (c, r) => c + ',' + r;
  const robotGeo = new THREE.BoxGeometry(0.72, 0.26, 0.72);
  const podGeo = new THREE.BoxGeometry(0.62, 0.8, 0.62);
  const lightGeo = new THREE.SphereGeometry(0.07, 12, 8);
  const haloGeo = new THREE.RingGeometry(0.5, 0.58, 32);
  const robotMat = new THREE.MeshStandardMaterial({ color: C.egg, roughness: 0.7 });
  const robots = [];
  const N = 16;
  let tries = 0;
  while (robots.length < N && tries++ < 400) {
    const c = Math.floor(Math.random() * COLS), r = Math.floor(Math.random() * ROWS);
    if (occ.has(key(c, r))) continue;
    const p = cellPos(c, r);
    if (Math.hypot(p.x - person.x, p.z - person.z) < SLOW_R + 0.5) continue;
    const g = new THREE.Group();
    const base = new THREE.Mesh(robotGeo, robotMat);
    base.position.y = 0.15;
    base.castShadow = true;
    g.add(base);
    if (Math.random() < 0.55) {
      const pod = new THREE.Mesh(podGeo, new THREE.MeshStandardMaterial({ color: C.pods[robots.length % C.pods.length], roughness: 0.8 }));
      pod.position.y = 0.7;
      pod.castShadow = true;
      g.add(pod);
    }
    const light = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: C.ok }));
    light.position.set(0, 0.3, 0.3);
    g.add(light);
    const halo = new THREE.Mesh(haloGeo, new THREE.MeshBasicMaterial({ color: C.stop, transparent: true, opacity: 0, depthWrite: false }));
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.015;
    g.add(halo);
    g.position.set(p.x, 0, p.z);
    scene.add(g);
    const rb = { c, r, tc: c, tr: r, p: 0, dir: Math.floor(Math.random() * 4), speed: 1.4 + Math.random() * 0.7, hold: Math.random(), state: 'go', g, light, halo, yaw: 0 };
    rb.yaw = Math.PI / 2 - rb.dir * Math.PI / 2;
    g.rotation.y = rb.yaw;
    occ.set(key(c, r), rb);
    robots.push(rb);
  }

  function robotXZ(rb) {
    const a = cellPos(rb.c, rb.r), b = cellPos(rb.tc, rb.tr);
    return { x: a.x + (b.x - a.x) * rb.p, z: a.z + (b.z - a.z) * rb.p };
  }
  // 1 outside the slow zone, easing down to 0.2 at the edge of the stop zone, 0 inside it
  function speedFactor(d) {
    if (d <= STOP_R) return 0;
    if (d >= SLOW_R) return 1;
    return 0.2 + 0.8 * (d - STOP_R) / (SLOW_R - STOP_R);
  }
  function newWanderTarget(t) {
    person.tx = (Math.random() - 0.5) * (COLS - 3);
    person.tz = (Math.random() - 0.5) * (ROWS - 3);
    lastProgress = t;
  }
  // Push the person out of any robot they overlap, so they slide around robots instead of through them
  function collide() {
    for (let pass = 0; pass < 2; pass++) {
      robots.forEach(rb => {
        const p = robotXZ(rb);
        let dx = person.x - p.x, dz = person.z - p.z, d = Math.hypot(dx, dz);
        if (d >= BODY_R) return;
        if (d < 0.001) { dx = 1; dz = 0; d = 1; }
        person.x = p.x + dx / d * BODY_R;
        person.z = p.z + dz / d * BODY_R;
      });
    }
    person.x = THREE.MathUtils.clamp(person.x, -COLS / 2 + 0.3, COLS / 2 - 0.3);
    person.z = THREE.MathUtils.clamp(person.z, -ROWS / 2 + 0.3, ROWS / 2 - 0.3);
  }

  function step(dt, t) {
    const manual = performance.now() < manualUntil;
    if (!manual && Math.hypot(person.tx - person.x, person.tz - person.z) < 0.1) newWanderTarget(t);
    const dx = person.tx - person.x, dz = person.tz - person.z, d = Math.hypot(dx, dz);
    const sp = (manual ? 2.6 : 0.9) * dt;
    const bx = person.x, bz = person.z;
    if (d > 0.01) { person.x += dx / d * Math.min(sp, d); person.z += dz / d * Math.min(sp, d); }
    collide();
    const moved = Math.hypot(person.x - bx, person.z - bz);
    // Blocked by a robot for a while: give up on this target and wander somewhere else
    if (moved > sp * 0.3 || d < 0.1) lastProgress = t;
    else if (t - lastProgress > 1.2) { manualUntil = 0; newWanderTarget(t); }

    personGroup.position.set(person.x, 0, person.z);
    if (moved > 0.001) personGroup.rotation.y = Math.atan2(person.x - bx, person.z - bz);
    body.position.y = 0.5 + (moved > 0.001 ? Math.abs(Math.sin(t * 9)) * 0.04 : 0);
    head.position.y = body.position.y + 0.58;
    zones.concat(pulse).forEach(m => { m.position.x = person.x; m.position.z = person.z; });
    const ph = (t % 2) / 2;
    pulse.scale.setScalar(STOP_R * (0.3 + 0.7 * ph));
    pulse.material.opacity = 0.6 * (1 - ph);
    marker.material.opacity = Math.max(0, marker.material.opacity - dt * 0.8);

    let stopped = 0, slowed = 0;
    robots.forEach(rb => {
      const pos = robotXZ(rb);
      const f = speedFactor(Math.hypot(pos.x - person.x, pos.z - person.z));
      rb.state = f === 0 ? 'stop' : f < 1 ? 'slow' : 'go';
      if (f > 0) {
        if (rb.tc !== rb.c || rb.tr !== rb.r) {
          rb.p += rb.speed * f * dt;
          if (rb.p >= 1) {
            occ.delete(key(rb.c, rb.r));
            rb.c = rb.tc; rb.r = rb.tr; rb.p = 0;
            rb.hold = Math.random() < 0.15 ? 0.3 + Math.random() : 0;
          }
        } else if (rb.hold > 0) {
          rb.hold -= dt;
        } else {
          const order = [rb.dir];
          if (Math.random() < 0.3) order.unshift((rb.dir + (Math.random() < 0.5 ? 1 : 3)) % 4);
          order.push((rb.dir + 1) % 4, (rb.dir + 3) % 4, (rb.dir + 2) % 4);
          for (const dd of order) {
            const nc = rb.c + DIRS[dd][0], nr = rb.r + DIRS[dd][1];
            if (nc < 0 || nr < 0 || nc >= COLS || nr >= ROWS || occ.has(key(nc, nr))) continue;
            const np = cellPos(nc, nr);
            if (Math.hypot(np.x - person.x, np.z - person.z) < STOP_R + 0.3) continue;
            rb.dir = dd; rb.tc = nc; rb.tr = nr; rb.p = 0;
            occ.set(key(nc, nr), rb);
            break;
          }
        }
      }
      const now = robotXZ(rb);
      rb.g.position.set(now.x, 0, now.z);
      const targetYaw = Math.PI / 2 - rb.dir * Math.PI / 2;
      let diff = targetYaw - rb.yaw;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      rb.yaw += diff * Math.min(1, dt * 10) * Math.max(f, 0.2);
      rb.g.rotation.y = rb.yaw;
      const col = rb.state === 'stop' ? C.stop : rb.state === 'slow' ? C.slow : C.ok;
      rb.light.material.color.set(col);
      if (rb.state !== 'go') rb.halo.material.color.set(col);
      rb.halo.material.opacity += ((rb.state === 'go' ? 0 : 0.9) - rb.halo.material.opacity) * Math.min(1, dt * 8);
      if (rb.state === 'stop') stopped++;
      else if (rb.state === 'slow') slowed++;
    });
    if (statStop) statStop.textContent = stopped;
    if (statSlow) statSlow.textContent = slowed;
  }

  // Click (not drag) on the floor moves the person
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let down = null;
  canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('pointerup', e => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
    const rect = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObject(floor)[0];
    if (!hit) return;
    person.tx = THREE.MathUtils.clamp(hit.point.x, -COLS / 2 + 0.5, COLS / 2 - 0.5);
    person.tz = THREE.MathUtils.clamp(hit.point.z, -ROWS / 2 + 0.5, ROWS / 2 - 0.5);
    manualUntil = performance.now() + 8000;
    marker.position.x = person.tx;
    marker.position.z = person.tz;
    marker.material.opacity = 1;
  });
  controls.addEventListener('start', () => { controls.autoRotate = false; });

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 600 ? 42 : 32;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host);
  resize();

  const clock = new THREE.Clock();
  let running = false, visible = true, t = 0;
  function frame() {
    if (!running) return;
    const dt = Math.min(0.05, clock.getDelta());
    t += dt;
    step(dt, t);
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  function start() { if (running) return; running = true; clock.getDelta(); requestAnimationFrame(frame); }
  function stop() { running = false; }

  step(0, 0);
  renderer.render(scene, camera);
  host.classList.add('live');
  start();

  new IntersectionObserver(e => {
    visible = e[0].isIntersecting;
    if (visible && !document.hidden) start(); else stop();
  }).observe(host);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (visible) start(); });
}
