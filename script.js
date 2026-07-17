import * as THREE from "./assets/three.module.min.js";

const glow = document.querySelector(".cursor-glow");
const scene = document.querySelector("[data-scene]");
const motionCanvas = document.querySelector(".hero-video");
const campaignCanvas = document.querySelector(".campaign-3d");
const counters = document.querySelectorAll("[data-counter]");
const revealItems = document.querySelectorAll(".section, .service-card");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const compactViewport = window.matchMedia("(max-width: 620px)");
const vanishCopy = document.querySelector("[data-vanish-copy]");
const revealCopy = document.querySelector("[data-reveal-copy]");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");
const logoEyeShells = document.querySelectorAll("[data-logo-eyes]");
const whatsAppNumber = "918921558984";

let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
let actionX = pointerX;
let actionY = pointerY;
let actionAt = 0;

window.addEventListener("pointermove", (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;

  if (glow) {
    glow.style.left = `${pointerX}px`;
    glow.style.top = `${pointerY}px`;
  }

  if (scene) {
    const rotateX = (pointerY / window.innerHeight - 0.5) * -7;
    const rotateY = (pointerX / window.innerWidth - 0.5) * 9;
    scene.style.setProperty("--rx", `${rotateX}deg`);
    scene.style.setProperty("--ry", `${rotateY}deg`);
  }
});

document.querySelectorAll(".magnetic").forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

const registerActionPoint = (element) => {
  const rect = element.getBoundingClientRect();
  actionX = rect.left + rect.width / 2;
  actionY = rect.top + rect.height / 2;
  actionAt = performance.now();
};

document.querySelectorAll("a, button, .magnetic, .service-card, [type='submit']").forEach((item) => {
  item.addEventListener("pointerenter", () => registerActionPoint(item));
  item.addEventListener("pointerdown", () => registerActionPoint(item));
  item.addEventListener("focus", () => registerActionPoint(item));
});

const animateCounter = (element) => {
  const target = Number(element.dataset.counter);
  const duration = 1300;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");

      if (entry.target.dataset.counter && !entry.target.dataset.counted) {
        entry.target.dataset.counted = "true";
        animateCounter(entry.target);
      }

      entry.target.querySelectorAll("[data-counter]").forEach((counter) => {
        if (!counter.dataset.counted) {
          counter.dataset.counted = "true";
          animateCounter(counter);
        }
      });
    });
  },
  { threshold: 0.22 }
);

revealItems.forEach((item) => {
  item.classList.add("reveal");
  observer.observe(item);
});

counters.forEach((counter) => observer.observe(counter));

document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("pointerenter", () => {
    document.body.dataset.activeHue = card.dataset.hue;
  });
});

if (vanishCopy && revealCopy) {
  if (reduceMotion) {
    vanishCopy.classList.add("has-vanished");
    revealCopy.classList.add("has-arrived");
  } else {
    window.setTimeout(() => {
      vanishCopy.classList.add("has-vanished");
      window.setTimeout(() => {
        revealCopy.classList.add("has-arrived");
      }, 520);
    }, 3000);
  }
}

if (contactForm && formNote) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const message = [
      "Hi Adversado, I want a digital marketing audit.",
      `Name: ${formData.get("name") || "-"}`,
      `Company: ${formData.get("company") || "-"}`,
      `Contact: ${formData.get("contact") || "-"}`,
      `Need: ${formData.get("turning-point") || "-"}`,
      `Message: ${formData.get("message") || "-"}`,
    ].join("\n");
    const url = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;
    formNote.innerHTML = `Opening WhatsApp. If it does not open, <a href="${url}" target="_blank" rel="noopener">tap here</a>.`;
    window.open(url, "_blank", "noopener");
  });
}

if (logoEyeShells.length) {
  const eyeStates = Array.from(logoEyeShells, (shell) => ({
    shell,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  }));

  const updateEyeTargets = () => {
    const now = performance.now();
    const actionAge = Math.min((now - actionAt) / 1100, 1);
    const actionWeight = 1 - actionAge;
    const targetScreenX = pointerX * (1 - actionWeight) + actionX * actionWeight;
    const targetScreenY = pointerY * (1 - actionWeight) + actionY * actionWeight;

    eyeStates.forEach((state) => {
      const rect = state.shell.getBoundingClientRect();
      const eyeLayer = state.shell.querySelector(".logo-eye-layer");
      const eyeRect = eyeLayer ? eyeLayer.getBoundingClientRect() : rect;
      const centerX = eyeRect.left + eyeRect.width * 0.4227;
      const centerY = eyeRect.top + eyeRect.height * 0.445;
      state.targetX = Math.max(-1.8, Math.min(1.8, ((targetScreenX - centerX) / rect.width) * 4.6));
      state.targetY = Math.max(-1.4, Math.min(1.4, ((targetScreenY - centerY) / rect.height) * 3.4));
    });
  };

  const animateLogoEyes = () => {
    updateEyeTargets();
    eyeStates.forEach((state) => {
      state.x += (state.targetX - state.x) * 0.045;
      state.y += (state.targetY - state.y) * 0.045;
      state.shell.style.setProperty("--eye-x", `${state.x.toFixed(2)}px`);
      state.shell.style.setProperty("--eye-y", `${state.y.toFixed(2)}px`);
    });
    requestAnimationFrame(animateLogoEyes);
  };

  requestAnimationFrame(animateLogoEyes);
}

if (motionCanvas) {
  const protocolRenderer = new THREE.WebGLRenderer({
    canvas: motionCanvas,
    alpha: true,
    antialias: true,
  });
  protocolRenderer.setClearColor(0x000000, 0);
  protocolRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const protocolScene = new THREE.Scene();
  const protocolCamera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
  const protocolGroup = new THREE.Group();
  protocolScene.add(protocolGroup);

  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  protocolScene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xfff0c4, 1.35);
  keyLight.position.set(3, 5, 6);
  protocolScene.add(keyLight);

  const blueLight = new THREE.PointLight(0x173962, 3.2, 12);
  blueLight.position.set(-4, 1.8, 2.4);
  protocolScene.add(blueLight);

  const goldLight = new THREE.PointLight(0xffd25a, 2.4, 12);
  goldLight.position.set(4, 1.4, 2.2);
  protocolScene.add(goldLight);

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xf6b400,
    emissive: 0x8f6200,
    emissiveIntensity: 0.54,
    metalness: 0.44,
    roughness: 0.24,
  });
  const blueMaterial = new THREE.MeshStandardMaterial({
    color: 0x173962,
    emissive: 0x071729,
    emissiveIntensity: 0.58,
    metalness: 0.38,
    roughness: 0.28,
  });
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf8fbff,
    emissive: 0x262626,
    emissiveIntensity: 0.18,
    metalness: 0.08,
    roughness: 0.12,
    transmission: 0.16,
    transparent: true,
    opacity: 0.86,
  });
  const blueprintMaterial = new THREE.MeshBasicMaterial({
    color: 0x75d7ff,
    transparent: true,
    opacity: 0.32,
    wireframe: true,
  });
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffd25a,
    transparent: true,
    opacity: 0.58,
  });
  const blueLineMaterial = new THREE.LineBasicMaterial({
    color: 0x2f6fa8,
    transparent: true,
    opacity: 0.42,
  });

  const stageRoot = new THREE.Group();
  protocolGroup.add(stageRoot);

  const makeLabel = (label, color = '#ffd25a') => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(5, 5, 5, 0.58)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(40, 28);
    ctx.lineTo(472, 28);
    ctx.quadraticCurveTo(490, 28, 490, 46);
    ctx.lineTo(490, 82);
    ctx.quadraticCurveTo(490, 100, 472, 100);
    ctx.lineTo(40, 100);
    ctx.quadraticCurveTo(22, 100, 22, 82);
    ctx.lineTo(22, 46);
    ctx.quadraticCurveTo(22, 28, 40, 28);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = '800 34px Montserrat, Inter, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 256, 65);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.92 }));
    sprite.scale.set(1.55, 0.38, 1);
    return sprite;
  };

  const stagePositions = [-4.7, -1.55, 1.55, 4.7];
  const stages = [];

  const dream = new THREE.Group();
  dream.position.set(stagePositions[0], 0.15, 0);
  const dreamCore = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 2), goldMaterial);
  dream.add(dreamCore);
  const dreamHalo = new THREE.Mesh(
    new THREE.TorusGeometry(0.98, 0.012, 12, 120),
    new THREE.MeshBasicMaterial({ color: 0xffd25a, transparent: true, opacity: 0.52 })
  );
  dreamHalo.rotation.x = Math.PI / 2;
  dream.add(dreamHalo);
  const dreamCloud = new THREE.Group();
  for (let i = 0; i < 18; i += 1) {
    const mote = new THREE.Mesh(new THREE.SphereGeometry(0.026 + Math.random() * 0.026, 12, 8), goldMaterial.clone());
    const angle = (i / 18) * Math.PI * 2;
    mote.position.set(Math.cos(angle) * (0.9 + Math.random() * 0.38), Math.sin(i * 1.7) * 0.42, Math.sin(angle) * 0.55);
    dreamCloud.add(mote);
  }
  dream.add(dreamCloud);
  const dreamLabel = makeLabel('DREAM', '#ffd25a');
  dreamLabel.position.set(0, -1.12, 0);
  dream.add(dreamLabel);
  stageRoot.add(dream);
  stages.push({ group: dream, active: dreamCore, aux: dreamCloud });

  const blueprint = new THREE.Group();
  blueprint.position.set(stagePositions[1], 0.04, 0);
  const blueprintBox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2, 5, 5, 5), blueprintMaterial);
  blueprint.add(blueprintBox);
  const gridLines = new THREE.Group();
  for (let i = -3; i <= 3; i += 1) {
    const horizontal = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.95, i * 0.22, -0.7), new THREE.Vector3(0.95, i * 0.22, -0.7)]),
      blueLineMaterial
    );
    const vertical = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(i * 0.22, -0.78, -0.7), new THREE.Vector3(i * 0.22, 0.78, -0.7)]),
      lineMaterial
    );
    gridLines.add(horizontal, vertical);
  }
  blueprint.add(gridLines);
  const blueprintLabel = makeLabel('BLUEPRINT', '#75d7ff');
  blueprintLabel.position.set(0, -1.12, 0);
  blueprint.add(blueprintLabel);
  stageRoot.add(blueprint);
  stages.push({ group: blueprint, active: blueprintBox, aux: gridLines });

  const build = new THREE.Group();
  build.position.set(stagePositions[2], -0.06, 0);
  const blockGeometry = new THREE.BoxGeometry(0.46, 0.46, 0.46);
  const buildBlocks = [];
  [
    [-0.38, -0.38, 0], [0.1, -0.38, 0], [0.58, -0.38, 0],
    [-0.14, 0.1, 0], [0.34, 0.1, 0], [0.1, 0.58, 0],
  ].forEach((position, index) => {
    const block = new THREE.Mesh(blockGeometry, index % 2 ? blueMaterial : goldMaterial);
    block.position.set(...position);
    block.rotation.set(index * 0.11, index * 0.17, index * 0.08);
    build.add(block);
    buildBlocks.push(block);
  });
  const gearOne = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.035, 12, 64), blueMaterial);
  gearOne.position.set(-0.5, 0.48, -0.32);
  gearOne.rotation.y = Math.PI / 2;
  build.add(gearOne);
  const buildLabel = makeLabel('BUILD', '#2f6fa8');
  buildLabel.position.set(0.12, -1.12, 0);
  build.add(buildLabel);
  stageRoot.add(build);
  stages.push({ group: build, active: gearOne, aux: buildBlocks });

  const reality = new THREE.Group();
  reality.position.set(stagePositions[3], 0.02, 0);
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.98, 0.18, 6), goldMaterial);
  pedestal.position.y = -0.62;
  reality.add(pedestal);
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.78, 1.18, 0.78), glassMaterial);
  tower.position.y = 0.06;
  reality.add(tower);
  const cap = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0), goldMaterial);
  cap.position.y = 0.88;
  reality.add(cap);
  const realityRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.98, 0.012, 12, 120),
    new THREE.MeshBasicMaterial({ color: 0xf8fbff, transparent: true, opacity: 0.42 })
  );
  realityRing.rotation.x = Math.PI / 2;
  reality.add(realityRing);
  const realityLabel = makeLabel('REALITY', '#ffffff');
  realityLabel.position.set(0, -1.12, 0);
  reality.add(realityLabel);
  stageRoot.add(reality);
  stages.push({ group: reality, active: cap, aux: realityRing });

  const pathCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(stagePositions[0], 0.14, 0),
    new THREE.Vector3(-3.05, 0.62, -0.46),
    new THREE.Vector3(stagePositions[1], 0.04, 0),
    new THREE.Vector3(0, -0.5, 0.38),
    new THREE.Vector3(stagePositions[2], -0.02, 0),
    new THREE.Vector3(3.08, 0.58, -0.42),
    new THREE.Vector3(stagePositions[3], 0.12, 0),
  ]);
  const pathTube = new THREE.Mesh(
    new THREE.TubeGeometry(pathCurve, 160, 0.018, 10, false),
    new THREE.MeshBasicMaterial({ color: 0xffd25a, transparent: true, opacity: 0.52 })
  );
  stageRoot.add(pathTube);

  const signalGeometry = new THREE.SphereGeometry(0.07, 18, 12);
  const signals = Array.from({ length: 6 }, (_, index) => {
    const signal = new THREE.Mesh(signalGeometry, index % 2 ? blueMaterial.clone() : goldMaterial.clone());
    signal.userData.offset = index / 6;
    stageRoot.add(signal);
    return signal;
  });

  const circuitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 });
  for (let i = 0; i < 7; i += 1) {
    const y = -1.55 + i * 0.52;
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-5.8, y, -1.4),
        new THREE.Vector3(-2.4, y + Math.sin(i) * 0.18, -1.4),
        new THREE.Vector3(1.4, y - Math.cos(i) * 0.12, -1.4),
        new THREE.Vector3(5.8, y + Math.sin(i * 1.4) * 0.18, -1.4),
      ]),
      circuitMaterial
    );
    protocolGroup.add(line);
  }

  const resizeProtocol = () => {
    const rect = motionCanvas.parentElement.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    protocolRenderer.setSize(width, height, false);
    protocolCamera.aspect = width / height;
    protocolCamera.updateProjectionMatrix();

    const mobile = width < 680;
    protocolCamera.position.set(mobile ? 0 : 1.1, mobile ? 0.2 : 0.34, mobile ? 10.8 : 8.4);
    protocolGroup.position.set(mobile ? 0.25 : 1.15, mobile ? -0.78 : -0.2, 0);
    protocolGroup.scale.setScalar(mobile ? 0.62 : 0.9);
  };

  const animateProtocol = (time = 0) => {
    const seconds = time * 0.001;
    const pointerTiltX = (pointerY / window.innerHeight - 0.5) * 0.18;
    const pointerTiltY = (pointerX / window.innerWidth - 0.5) * 0.32;

    protocolGroup.rotation.x += (pointerTiltX - protocolGroup.rotation.x) * 0.035;
    protocolGroup.rotation.y += (pointerTiltY - protocolGroup.rotation.y) * 0.035;

    stages.forEach((stage, index) => {
      stage.group.position.y += (Math.sin(seconds * 1.15 + index * 0.82) * 0.08 - (stage.group.position.y - (index === 2 ? -0.06 : index === 0 ? 0.15 : 0.02))) * 0.04;
      stage.active.rotation.x += 0.006 + index * 0.001;
      stage.active.rotation.y += 0.011 + index * 0.002;
      if (Array.isArray(stage.aux)) {
        stage.aux.forEach((item, itemIndex) => {
          item.position.y += Math.sin(seconds * 2.2 + itemIndex) * 0.0008;
          item.rotation.y += 0.006;
        });
      } else {
        stage.aux.rotation.z += 0.006 + index * 0.002;
      }
    });

    dreamHalo.rotation.z = seconds * 0.46;
    realityRing.rotation.z = -seconds * 0.38;
    pathTube.material.opacity = 0.42 + Math.sin(seconds * 1.4) * 0.12;

    signals.forEach((signal) => {
      const progress = (seconds * 0.09 + signal.userData.offset) % 1;
      const point = pathCurve.getPointAt(progress);
      signal.position.copy(point);
      signal.scale.setScalar(0.75 + Math.sin(seconds * 8 + progress * 12) * 0.22);
    });

    protocolRenderer.render(protocolScene, protocolCamera);
    if (!reduceMotion) {
      requestAnimationFrame(animateProtocol);
    }
  };

  resizeProtocol();
  window.addEventListener("resize", resizeProtocol);
  requestAnimationFrame(animateProtocol);
}

if (campaignCanvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas: campaignCanvas,
    alpha: true,
    antialias: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const threeScene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.4, 8);

  const campaignGroup = new THREE.Group();
  threeScene.add(campaignGroup);

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xf6b400,
    emissive: 0x9b6600,
    emissiveIntensity: 0.42,
    metalness: 0.45,
    roughness: 0.24,
  });
  const navyMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e4a78,
    emissive: 0x0b213b,
    emissiveIntensity: 0.36,
    metalness: 0.35,
    roughness: 0.32,
  });
  const whiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8fbff,
    emissive: 0xb7c8dc,
    emissiveIntensity: 0.22,
    metalness: 0.12,
    roughness: 0.38,
  });

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xf6b400,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide,
  });

  const ringGeometry = new THREE.TorusGeometry(2.85, 0.01, 12, 160);
  const rings = [0, 1, 2].map((_, index) => {
    const ring = new THREE.Mesh(ringGeometry, ringMaterial.clone());
    ring.rotation.x = Math.PI / 2 + index * 0.38;
    ring.rotation.y = index * 0.58;
    ring.material.opacity = 0.18 + index * 0.06;
    campaignGroup.add(ring);
    return ring;
  });

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.74, 1),
    goldMaterial
  );
  campaignGroup.add(core);

  const pathMaterial = new THREE.LineBasicMaterial({
    color: 0xffd25a,
    transparent: true,
    opacity: 0.68,
  });
  const pathPoints = [];
  for (let index = 0; index < 160; index += 1) {
    const t = index / 18;
    pathPoints.push(new THREE.Vector3(Math.cos(t) * 2.7, Math.sin(t * 0.7) * 1.05, Math.sin(t) * 2.1));
  }
  const pathLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pathPoints), pathMaterial);
  campaignGroup.add(pathLine);

  const nodeGeometry = new THREE.SphereGeometry(0.16, 28, 18);
  const nodeMaterials = [goldMaterial, navyMaterial, whiteMaterial, goldMaterial, navyMaterial, whiteMaterial];
  const nodes = nodeMaterials.map((material, index) => {
    const angle = (index / nodeMaterials.length) * Math.PI * 2;
    const node = new THREE.Mesh(nodeGeometry, material);
    node.position.set(Math.cos(angle) * 2.7, Math.sin(index * 1.4) * 0.8, Math.sin(angle) * 2.15);
    campaignGroup.add(node);
    return node;
  });

  const barGroup = new THREE.Group();
  const barGeometry = new THREE.BoxGeometry(0.12, 1, 0.12);
  for (let index = 0; index < 14; index += 1) {
    const bar = new THREE.Mesh(barGeometry, index % 2 ? navyMaterial : goldMaterial);
    const angle = (index / 14) * Math.PI * 2;
    bar.position.set(Math.cos(angle) * 3.35, -1.7, Math.sin(angle) * 2.15);
    bar.scale.y = 0.25 + (index % 5) * 0.16;
    bar.rotation.y = -angle;
    barGroup.add(bar);
  }
  campaignGroup.add(barGroup);

  threeScene.add(new THREE.AmbientLight(0xf8fbff, 0.9));
  const goldLight = new THREE.PointLight(0xffd25a, 12, 12);
  goldLight.position.set(2.8, 2.4, 3.6);
  threeScene.add(goldLight);
  const blueLight = new THREE.PointLight(0x4fa0ff, 8, 12);
  blueLight.position.set(-3.2, -1.8, 3.2);
  threeScene.add(blueLight);

  const resizeThree = () => {
    const rect = campaignCanvas.getBoundingClientRect();
    renderer.setSize(Math.max(rect.width, 1), Math.max(rect.height, 1), false);
    camera.aspect = Math.max(rect.width, 1) / Math.max(rect.height, 1);
    camera.fov = compactViewport.matches ? 46 : 42;
    camera.position.set(0, compactViewport.matches ? 0.28 : 0.4, compactViewport.matches ? 10.4 : 8);
    campaignGroup.scale.setScalar(compactViewport.matches ? 0.58 : 1);
    campaignGroup.position.y = compactViewport.matches ? 0.28 : 0;
    campaignGroup.position.z = compactViewport.matches ? -0.18 : 0;
    camera.updateProjectionMatrix();
  };

  const animateThree = (time) => {
    const seconds = time * 0.001;
    const pointerTiltX = (pointerY / window.innerHeight - 0.5) * 0.26;
    const pointerTiltY = (pointerX / window.innerWidth - 0.5) * 0.34;

    campaignGroup.rotation.x = pointerTiltX + Math.sin(seconds * 0.45) * 0.08;
    campaignGroup.rotation.y = seconds * 0.28 + pointerTiltY;
    core.rotation.x = seconds * 0.7;
    core.rotation.y = seconds * 0.92;
    pathLine.rotation.y = -seconds * 0.18;
    barGroup.rotation.y = seconds * 0.42;

    nodes.forEach((node, index) => {
      node.scale.setScalar(1 + Math.sin(seconds * 2.2 + index) * 0.22);
    });

    rings.forEach((ring, index) => {
      ring.rotation.z = seconds * (0.22 + index * 0.08);
    });

    renderer.render(threeScene, camera);

    if (!reduceMotion) {
      requestAnimationFrame(animateThree);
    }
  };

  resizeThree();
  window.addEventListener("resize", resizeThree);
  compactViewport.addEventListener("change", resizeThree);
  requestAnimationFrame(animateThree);
}

// CAT SYSTEM: Curiosity Hunt Mechanics
(() => {
  const STORAGE_KEY = "adversado_found_cats";
  const CAT_PAGES = ["home", "about", "services", "contact"];
  
  // Initialize or get found cats from localStorage
  const getFoundCats = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  };

  const saveCat = (pageName) => {
    const found = getFoundCats();
    found[pageName] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    return found;
  };

  const showCatNotification = (count) => {
    const notification = document.createElement("div");
    notification.className = "cat-notification";
    notification.innerHTML = `<p>${count} of 5. It gets harder. 🐱</p>`;
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add("show"), 10);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const checkAllCatsFound = () => {
    const found = getFoundCats();
    const foundCount = CAT_PAGES.filter((page) => found[page]).length;
    return foundCount === CAT_PAGES.length;
  };

  // Set up click handlers for hidden cats
  const hiddenCats = document.querySelectorAll(".hidden-cat");
  hiddenCats.forEach((catElement) => {
    const pageName = catElement.getAttribute("data-cat-page");
    
    catElement.style.cursor = "pointer";
    catElement.style.opacity = "0";
    catElement.style.position = "fixed";
    catElement.style.pointerEvents = "auto";
    catElement.style.fontSize = "32px";
    catElement.style.width = "40px";
    catElement.style.height = "40px";
    catElement.style.display = "flex";
    catElement.style.alignItems = "center";
    catElement.style.justifyContent = "center";
    
    // Randomize position on each page
    const randomX = Math.random() * (window.innerWidth - 40);
    const randomY = Math.random() * (window.innerHeight - 40);
    catElement.style.left = randomX + "px";
    catElement.style.top = randomY + "px";

    // Handle click
    catElement.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const found = getFoundCats();
      
      // Only process if not already found
      if (!found[pageName]) {
        saveCat(pageName);
        const foundCats = getFoundCats();
        const foundCount = CAT_PAGES.filter((page) => foundCats[page]).length;
        
        showCatNotification(foundCount);

        // Hide this cat after found
        catElement.style.display = "none";

        // Check if all found
        if (checkAllCatsFound()) {
          setTimeout(() => {
            window.location.href = "/curiosity-pays.html";
          }, 500);
        }
      }
    });

    // Hide if already found
    const found = getFoundCats();
    if (found[pageName]) {
      catElement.style.display = "none";
    }
  });

  // Bonus: Randomize cat positions every few seconds for harder hunt
  setInterval(() => {
    const hiddenCats = document.querySelectorAll(".hidden-cat");
    hiddenCats.forEach((catElement) => {
      if (catElement.style.display !== "none") {
        const randomX = Math.random() * (window.innerWidth - 40);
        const randomY = Math.random() * (window.innerHeight - 40);
        catElement.style.left = randomX + "px";
        catElement.style.top = randomY + "px";
      }
    });
  }, 5000);
})();
