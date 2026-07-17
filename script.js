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

if (vanishCopy && !reduceMotion) {
  window.setTimeout(() => {
    vanishCopy.classList.add("has-vanished");
  }, 3000);
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
      state.targetX = Math.max(-0.16, Math.min(0.16, ((targetScreenX - centerX) / rect.width) * 0.55));
      state.targetY = Math.max(-0.16, Math.min(0.16, ((targetScreenY - centerY) / rect.height) * 0.55));
    });
  };

  const animateLogoEyes = () => {
    updateEyeTargets();
    eyeStates.forEach((state) => {
      state.x += (state.targetX - state.x) * 0.08;
      state.y += (state.targetY - state.y) * 0.08;
      state.shell.style.setProperty("--eye-x", `${state.x.toFixed(2)}px`);
      state.shell.style.setProperty("--eye-y", `${state.y.toFixed(2)}px`);
    });
    requestAnimationFrame(animateLogoEyes);
  };

  requestAnimationFrame(animateLogoEyes);
}

if (motionCanvas) {
  const context = motionCanvas.getContext("2d");
  const particles = Array.from({ length: 74 }, (_, index) => ({
    x: Math.random(),
    y: Math.random(),
    speed: 0.00022 + Math.random() * 0.00042,
    radius: 1.8 + Math.random() * 4.8,
    phase: index * 0.42,
  }));

  const resizeCanvas = () => {
    const density = Math.min(window.devicePixelRatio || 1, 2);
    motionCanvas.width = Math.floor(window.innerWidth * density);
    motionCanvas.height = Math.floor(window.innerHeight * density);
    motionCanvas.dataset.density = density;
  };

  const drawFrame = (time) => {
    const density = Number(motionCanvas.dataset.density || 1);
    const width = motionCanvas.width;
    const height = motionCanvas.height;
    const pointerInfluenceX = (pointerX / window.innerWidth - 0.5) * 80 * density;
    const pointerInfluenceY = (pointerY / window.innerHeight - 0.5) * 60 * density;

    context.clearRect(0, 0, width, height);

    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#181818");
    gradient.addColorStop(0.48, "#050505");
    gradient.addColorStop(1, "#2a1115");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.globalCompositeOperation = "screen";
    particles.forEach((particle, index) => {
      const wave = Math.sin(time * particle.speed + particle.phase);
      const x = ((particle.x * width + time * particle.speed * 3400) % width) + pointerInfluenceX * 0.25;
      const y = particle.y * height + wave * 82 * density + pointerInfluenceY * 0.18;
      const radius = particle.radius * density;

      context.beginPath();
      context.fillStyle = index % 4 === 0 ? "rgba(255, 210, 90, 0.55)" : "rgba(200, 16, 46, 0.2)";
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    });

    for (let line = 0; line < 11; line += 1) {
      const y = ((line / 10) * height + Math.sin(time * 0.0004 + line) * 52 * density) % height;
      context.strokeStyle = line % 2 ? "rgba(246, 180, 0, 0.16)" : "rgba(200, 16, 46, 0.14)";
      context.lineWidth = 1.5 * density;
      context.beginPath();
      context.moveTo(-80 * density, y);
      context.bezierCurveTo(width * 0.28, y - 130 * density, width * 0.62, y + 130 * density, width + 80 * density, y - 20 * density);
      context.stroke();
    }

    const halo = context.createRadialGradient(
      width * 0.66 + pointerInfluenceX,
      height * 0.36 + pointerInfluenceY,
      20,
      width * 0.66,
      height * 0.36,
      width * 0.42
    );
    halo.addColorStop(0, "rgba(246, 180, 0, 0.24)");
    halo.addColorStop(1, "rgba(246, 180, 0, 0)");
    context.fillStyle = halo;
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = "source-over";

    requestAnimationFrame(drawFrame);
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  requestAnimationFrame(drawFrame);
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
