import * as THREE from "three";

/**
 * AURA THREE.JS 3D ENGINE
 * High-performance, memory-safe, immersive 3D scenes with WebGL detection,
 * pointer-based parallax, gyroscope orbital rings, and automatic lifecycle disposal.
 */

// Respect reduced motion
export const isReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Safe WebGL Renderer Creator
function createSafeRenderer(canvas) {
  try {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    if (THREE.sRGBEncoding) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    return renderer;
  } catch (err) {
    console.warn("WebGL renderer creation failed:", err);
    return null;
  }
}

// Responsive Camera & Canvas Resizer
function resizeToParent(renderer, camera, canvas) {
  if (!canvas || !canvas.parentElement) return;
  const w = canvas.parentElement.clientWidth || 300;
  const h = canvas.parentElement.clientHeight || 300;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

// Viewport-aware Animation Loop
function runViewportLoop(canvas, onFrame) {
  const clock = new THREE.Clock();
  let rafId = 0;
  let isRunning = true;
  let isInView = true;

  let observer = null;
  if (typeof IntersectionObserver !== "undefined") {
    observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);
  }

  const loop = () => {
    if (!isRunning) return;
    rafId = requestAnimationFrame(loop);
    if (isInView) {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      onFrame(elapsed, delta);
    }
  };
  loop();

  return () => {
    isRunning = false;
    cancelAnimationFrame(rafId);
    if (observer) {
      observer.disconnect();
    }
  };
}

/* ==========================================================================
   1. HERO SCENE: AURA NEXUS (Sculptural Polyhedral Core + Gyroscope Rings)
   ========================================================================== */
export function createHeroScene(canvas) {
  if (!canvas) return null;
  const renderer = createSafeRenderer(canvas);
  if (!renderer) return null;

  const isMobile = window.innerWidth < 768;
  const FOV = isMobile ? 55 : 46;
  const CAM_Z = isMobile ? 9.2 : 8.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.set(0, 0, CAM_Z);

  // Lighting with Violet (#8B5CF6), Cyan (#22D3EE), and Mint (#A7F3D0)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x22d3ee, 2.4, 45);
  cyanLight.position.set(-6, 5, 6);
  scene.add(cyanLight);

  const violetLight = new THREE.PointLight(0x8b5cf6, 2.2, 45);
  violetLight.position.set(6, -4, 5);
  scene.add(violetLight);

  const mintLight = new THREE.DirectionalLight(0xa7f3d0, 0.85);
  mintLight.position.set(0, 6, 4);
  scene.add(mintLight);

  // Group containing the central floating composition
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Central Core: Geodesic Crystal
  const coreGeo = new THREE.IcosahedronGeometry(isMobile ? 1.25 : 1.55, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    metalness: 0.35,
    roughness: 0.18,
    wireframe: false,
    transparent: true,
    opacity: 0.88,
    flatShading: true,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  mainGroup.add(coreMesh);

  // Core Wireframe Overlay
  const wireGeo = new THREE.WireframeGeometry(coreGeo);
  const wireMat = new THREE.LineBasicMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0.45,
  });
  const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
  mainGroup.add(wireMesh);

  // Inner Pulsing Octahedron
  const innerGeo = new THREE.OctahedronGeometry(isMobile ? 0.65 : 0.85, 0);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0xa7f3d0,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x22d3ee,
    emissiveIntensity: 0.3,
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  mainGroup.add(innerMesh);

  // Gyroscope Orbital Rings (Concentric)
  const ring1Geo = new THREE.TorusGeometry(isMobile ? 2.2 : 2.7, 0.038, 16, 120);
  const ring1Mat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    metalness: 0.7,
    roughness: 0.2,
    emissive: 0x22d3ee,
    emissiveIntensity: 0.25,
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 3.5;
  mainGroup.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(isMobile ? 3.0 : 3.7, 0.028, 16, 140);
  const ring2Mat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    metalness: 0.6,
    roughness: 0.25,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.2,
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.y = Math.PI / 4;
  ring2.rotation.x = -Math.PI / 5;
  mainGroup.add(ring2);

  // Orbiting Satellites (Geometries around the core)
  const satGeos = [
    new THREE.TetrahedronGeometry(0.35, 0),
    new THREE.BoxGeometry(0.4, 0.4, 0.4),
    new THREE.OctahedronGeometry(0.36, 0),
    new THREE.IcosahedronGeometry(0.38, 0),
    new THREE.TorusGeometry(0.28, 0.08, 12, 32),
  ];
  const satColors = [0x22d3ee, 0x8b5cf6, 0xa7f3d0, 0x6366f1, 0x38bdf8];
  const satellites = [];

  const satCount = isMobile ? 5 : 8;
  for (let i = 0; i < satCount; i++) {
    const geo = satGeos[i % satGeos.length];
    const mat = new THREE.MeshStandardMaterial({
      color: satColors[i % satColors.length],
      metalness: 0.5,
      roughness: 0.25,
      flatShading: true,
      transparent: true,
      opacity: 0.9,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const radius = (isMobile ? 2.5 : 3.4) + Math.random() * 1.6;
    const speed = (0.2 + Math.random() * 0.4) * (i % 2 === 0 ? 1 : -1);
    const angle = (i / satCount) * Math.PI * 2;
    const yOffset = (Math.random() - 0.5) * 2.2;
    mesh.userData = { radius, speed, angle, yOffset, rotSpeed: 0.015 + Math.random() * 0.02 };
    mainGroup.add(mesh);
    satellites.push(mesh);
  }

  // Floating Atmospheric Dust / Starfield
  const particleCount = isMobile ? 80 : 220;
  const pPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 22;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    pPositions[i * 3 + 2] = -5 + Math.random() * 10;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xa7f3d0,
    size: isMobile ? 0.04 : 0.055,
    transparent: true,
    opacity: 0.75,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Mouse & Touch Parallax
  const targetPointer = { x: 0, y: 0 };
  const currentPointer = { x: 0, y: 0 };

  const onPointerMove = (e) => {
    const r = canvas.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) {
      targetPointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      targetPointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    }
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  const onResize = () => {
    resizeToParent(renderer, camera, canvas);
  };
  window.addEventListener("resize", onResize);
  onResize();

  // Scroll offset listener for subtle camera float
  let scrollProgress = 0;
  const onScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    scrollProgress = Math.min(1, Math.max(0, scrollY / 700));
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // Animation Loop
  const reduced = isReducedMotion();
  const renderFrame = (elapsed) => {
    // Parallax damping
    if (!reduced) {
      currentPointer.x += (targetPointer.x - currentPointer.x) * 0.045;
      currentPointer.y += (targetPointer.y - currentPointer.y) * 0.045;

      // Rotate central core
      coreMesh.rotation.y = elapsed * 0.22;
      coreMesh.rotation.x = elapsed * 0.14;
      wireMesh.rotation.y = coreMesh.rotation.y;
      wireMesh.rotation.x = coreMesh.rotation.x;

      // Inner crystal counter-rotation
      innerMesh.rotation.y = -elapsed * 0.4;
      innerMesh.rotation.z = elapsed * 0.3;
      const pulse = 1 + Math.sin(elapsed * 2.2) * 0.06;
      innerMesh.scale.set(pulse, pulse, pulse);

      // Gyroscope rings
      ring1.rotation.z = elapsed * 0.35;
      ring1.rotation.y = Math.sin(elapsed * 0.25) * 0.35;
      ring2.rotation.z = -elapsed * 0.25;
      ring2.rotation.x = Math.cos(elapsed * 0.2) * 0.4;

      // Satellites orbital motion
      satellites.forEach((sat) => {
        const u = sat.userData;
        const curAngle = u.angle + elapsed * u.speed;
        sat.position.x = Math.cos(curAngle) * u.radius;
        sat.position.z = Math.sin(curAngle) * (u.radius * 0.75);
        sat.position.y = u.yOffset + Math.sin(elapsed * 1.4 + u.angle) * 0.35;
        sat.rotation.x += u.rotSpeed;
        sat.rotation.y += u.rotSpeed;
      });

      // Ambient particle drift
      particles.rotation.y = elapsed * 0.03;
      particles.rotation.x = elapsed * 0.015;

      // Camera parallax + scroll link
      camera.position.x = currentPointer.x * 0.85;
      camera.position.y = -currentPointer.y * 0.65 - scrollProgress * 1.2;
      camera.lookAt(0, -scrollProgress * 0.5, 0);
    }

    renderer.render(scene, camera);
  };

  const stopLoop = reduced
    ? (renderFrame(0), () => {})
    : runViewportLoop(canvas, renderFrame);

  // Safe Cleanup
  return () => {
    stopLoop();
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("scroll", onScroll);

    // Disposing geometries
    coreGeo.dispose();
    wireGeo.dispose();
    innerGeo.dispose();
    ring1Geo.dispose();
    ring2Geo.dispose();
    satGeos.forEach((g) => g.dispose());
    particleGeo.dispose();

    // Disposing materials
    coreMat.dispose();
    wireMat.dispose();
    innerMat.dispose();
    ring1Mat.dispose();
    ring2Mat.dispose();
    satellites.forEach((s) => s.material.dispose());
    particleMat.dispose();

    renderer.dispose();
  };
}

/* ==========================================================================
   2. CAMPUS SCENE: 3D PHOTO SLAB & AMBIENT PLATFORM
   ========================================================================== */
function createTagTexture(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 180;
  const ctx = canvas.getContext("2d");
  const r = 90;

  // Glass Pill Background
  ctx.fillStyle = "rgba(16, 22, 38, 0.95)";
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(1024 - r, 0);
  ctx.arc(1024 - r, r, r, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(r, 180);
  ctx.arc(r, r, r, Math.PI / 2, Math.PI * 1.5);
  ctx.fill();

  // Border Accent
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#8b5cf6";
  ctx.stroke();

  // Typography
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 64px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 512, 92);

  const texture = new THREE.CanvasTexture(canvas);
  if (THREE.sRGBEncoding) texture.encoding = THREE.sRGBEncoding;
  return texture;
}

export function createCampusScene(
  canvas,
  photoUrl,
  onReady,
  label = "KLE BCA & BBA College"
) {
  if (!canvas) return null;
  const renderer = createSafeRenderer(canvas);
  if (!renderer) {
    if (onReady) onReady(false);
    return null;
  }

  const isMobile = window.innerWidth < 768;
  const FOV = 36;
  const W = 5.4;
  const H = (W * 400) / 766;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const cyanPoint = new THREE.PointLight(0x22d3ee, 2.0, 40);
  cyanPoint.position.set(-5, 4, 6);
  const violetPoint = new THREE.PointLight(0x8b5cf6, 1.8, 40);
  violetPoint.position.set(5, -3, 6);
  scene.add(cyanPoint, violetPoint);

  const group = new THREE.Group();
  scene.add(group);

  // Glass slab behind the photo
  const slabGeo = new THREE.BoxGeometry(W + 0.45, H + 0.45, 0.28);
  const slabMat = new THREE.MeshStandardMaterial({
    color: 0x151d30,
    metalness: 0.6,
    roughness: 0.25,
    transparent: true,
    opacity: 0.95,
  });
  const slab = new THREE.Mesh(slabGeo, slabMat);
  slab.position.z = -0.22;
  group.add(slab);

  // Glowing Edge Highlight
  const edgeGeo = new THREE.EdgesGeometry(slabGeo);
  const edgeMat = new THREE.LineBasicMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0.7,
  });
  const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
  edgeLines.position.z = -0.22;
  group.add(edgeLines);

  // Gently Curved Photo Plane
  const photoGeo = new THREE.PlaneGeometry(W, H, 48, 1);
  const pos = photoGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const nx = pos.getX(i) / (W / 2);
    pos.setZ(i, nx * nx * 0.32);
  }
  pos.needsUpdate = true;

  let photoTexture = null;
  const textureLoader = new THREE.TextureLoader();
  photoTexture = textureLoader.load(
    photoUrl,
    () => {
      if (onReady) onReady(true);
    },
    undefined,
    () => {
      if (onReady) onReady(false);
    }
  );
  if (THREE.sRGBEncoding) photoTexture.encoding = THREE.sRGBEncoding;

  const photoMat = new THREE.MeshBasicMaterial({ map: photoTexture });
  const photoMesh = new THREE.Mesh(photoGeo, photoMat);
  group.add(photoMesh);

  // Name Tag
  const tagTex = createTagTexture(label);
  const tagMat = new THREE.MeshBasicMaterial({ map: tagTex, transparent: true });
  const tagGeo = new THREE.PlaneGeometry(3.6, (3.6 * 180) / 1024);
  const tagMesh = new THREE.Mesh(tagGeo, tagMat);
  tagMesh.position.set(0, -H / 2 - 0.15, 0.95);
  group.add(tagMesh);

  // Glowing Platform Disk
  const glowGeo = new THREE.CircleGeometry(3.8, 64);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.2,
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  glowMesh.rotation.x = -Math.PI / 2;
  glowMesh.position.y = -H / 2 - 0.55;
  scene.add(glowMesh);

  // Interaction handlers (drag, spring, hover)
  const viewState = { dragY: 0, dragX: 0, hoverY: 0, hoverX: 0 };
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;

  const onPointerDown = (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.style.cursor = "grabbing";
    if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (isDragging) {
      const deltaX = (e.clientX - lastX) * 0.007;
      const deltaY = (e.clientY - lastY) * 0.005;
      viewState.dragY = Math.max(-0.85, Math.min(0.85, viewState.dragY + deltaX));
      viewState.dragX = Math.max(-0.4, Math.min(0.4, viewState.dragX + deltaY));
      lastX = e.clientX;
      lastY = e.clientY;
    } else if (e.pointerType !== "touch") {
      const r = canvas.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        viewState.hoverY = ((e.clientX - r.left) / r.width - 0.5) * 0.4;
        viewState.hoverX = ((e.clientY - r.top) / r.height - 0.5) * 0.25;
      }
    }
  };

  const onPointerUp = () => {
    isDragging = false;
    canvas.style.cursor = "grab";
  };

  const onPointerLeave = () => {
    viewState.hoverY = 0;
    viewState.hoverX = 0;
  };

  canvas.style.cursor = "grab";
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerLeave);

  const onResize = () => {
    resizeToParent(renderer, camera, canvas);
    const visibleWidth = W * (isMobile ? 1.6 : 1.45);
    camera.position.set(
      0,
      0.1,
      visibleWidth / camera.aspect / (2 * Math.tan((FOV / 2) * (Math.PI / 180)))
    );
  };
  window.addEventListener("resize", onResize);
  onResize();

  const reduced = isReducedMotion();
  const renderFrame = (elapsed) => {
    if (!isDragging) {
      viewState.dragY += (0 - viewState.dragY) * 0.035;
      viewState.dragX += (0 - viewState.dragX) * 0.035;
    }

    const idleSway = reduced ? 0 : Math.sin(elapsed * 0.8) * 0.12;
    const targetRotY = viewState.dragY + viewState.hoverY + idleSway;
    const targetRotX = viewState.dragX + viewState.hoverX + 0.04;

    group.rotation.y += (targetRotY - group.rotation.y) * 0.075;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.075;

    tagMesh.position.y = -H / 2 - 0.15 + Math.sin(elapsed * 1.5) * 0.035;
    renderer.render(scene, camera);
  };

  const stopLoop = reduced
    ? (renderFrame(0), () => {})
    : runViewportLoop(canvas, renderFrame);

  return () => {
    stopLoop();
    window.removeEventListener("resize", onResize);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
    canvas.removeEventListener("pointerleave", onPointerLeave);

    slabGeo.dispose();
    slabMat.dispose();
    edgeGeo.dispose();
    edgeMat.dispose();
    photoGeo.dispose();
    photoMat.dispose();
    if (photoTexture) photoTexture.dispose();
    tagGeo.dispose();
    tagMat.dispose();
    tagTex.dispose();
    glowGeo.dispose();
    glowMat.dispose();

    renderer.dispose();
  };
}
