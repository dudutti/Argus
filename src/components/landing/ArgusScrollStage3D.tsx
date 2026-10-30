import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ArgusScrollStage3DProps {
  scrollProgressRef: React.MutableRefObject<number>;
  onFpsSample?: (fps: number) => void;
}

const STRATA_Y = [78, 26, -26, -78]; // SOL, ARB, ETH, BTC stage altitudes
const STRATA_COLORS = [0x4e9f76, 0x38bdf8, 0xd4a359, 0xf59e0b];

export const ArgusScrollStage3D: React.FC<ArgusScrollStage3DProps> = ({
  scrollProgressRef,
  onFpsSample,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.0024);

    const camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / Math.max(1, container.clientHeight),
      1,
      1400
    );
    camera.position.set(0, 32, 250);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    const disposables: Array<{ dispose: () => void }> = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    // Lighting
    const ambient = new THREE.AmbientLight(0xd4a359, 0.55);
    scene.add(ambient);

    const keyLight = new THREE.PointLight(0xd4a359, 2.4, 520);
    keyLight.position.set(90, 130, 140);
    scene.add(keyLight);

    const alertLight = new THREE.PointLight(0xe04f33, 2.0, 460);
    alertLight.position.set(-110, -40, 110);
    scene.add(alertLight);

    const rimLight = new THREE.PointLight(0x7c93a8, 1.5, 500);
    rimLight.position.set(0, -140, -120);
    scene.add(rimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Panoptes Core & Orbital Telemetry Rings (dominant in Prologue & Act II)
    const coreGroup = new THREE.Group();
    rootGroup.add(coreGroup);

    const irisGeo = track(new THREE.IcosahedronGeometry(14, 1));
    const irisMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xe04f33,
        emissive: 0xe04f33,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.85,
        wireframe: false,
      })
    );
    const irisMesh = new THREE.Mesh(irisGeo, irisMat);
    coreGroup.add(irisMesh);

    const irisCageGeo = track(new THREE.IcosahedronGeometry(19, 1));
    const irisCageMat = track(
      new THREE.MeshBasicMaterial({
        color: 0xd4a359,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      })
    );
    const irisCage = new THREE.Mesh(irisCageGeo, irisCageMat);
    coreGroup.add(irisCage);

    const orbitalRings: THREE.Mesh[] = [];
    const ringConfigs = [
      { r: 42, tube: 0.35, color: 0xd4a359, rx: 1.1, ry: 0.3 },
      { r: 68, tube: 0.3, color: 0x7c93a8, rx: 0.45, ry: 1.0 },
      { r: 96, tube: 0.28, color: 0xd4a359, rx: -0.75, ry: 0.55 },
    ];
    ringConfigs.forEach((rc) => {
      const rg = track(new THREE.TorusGeometry(rc.r, rc.tube, 8, 96));
      const rm = track(
        new THREE.MeshBasicMaterial({
          color: rc.color,
          transparent: true,
          opacity: 0.35,
        })
      );
      const mesh = new THREE.Mesh(rg, rm);
      mesh.rotation.set(rc.rx, rc.ry, 0);
      coreGroup.add(mesh);
      orbitalRings.push(mesh);
    });

    // 2. Four Horizontal Z-Stratum Planes (emerge cleanly in Act III -> VI)
    const strataGroup = new THREE.Group();
    rootGroup.add(strataGroup);
    const strataMeshes: THREE.LineSegments[] = [];

    STRATA_Y.forEach((yPos, idx) => {
      const ringGeo = track(new THREE.RingGeometry(24, 155, 48, 3));
      ringGeo.rotateX(-Math.PI / 2);
      const edges = track(new THREE.EdgesGeometry(ringGeo));
      const lineMat = track(
        new THREE.LineBasicMaterial({
          color: STRATA_COLORS[idx],
          transparent: true,
          opacity: 0,
        })
      );
      const seg = new THREE.LineSegments(edges, lineMat);
      seg.position.y = yPos;
      strataGroup.add(seg);
      strataMeshes.push(seg);
    });

    // 3. 100 Panoptes Sentinel Nodes (morph between Fibonacci Sphere -> Flat 2D -> 4 Z-Strata)
    const NODE_COUNT = 92;
    interface MorphNode {
      mesh: THREE.Mesh;
      mat: THREE.MeshStandardMaterial;
      spherePos: THREE.Vector3;
      flatPos: THREE.Vector3;
      strataPos: THREE.Vector3;
      baseColor: THREE.Color;
      taintColor: THREE.Color;
      hopRatio: number;
      stratumIdx: number;
      spinSpeed: number;
    }

    const sharedGeos = [
      track(new THREE.IcosahedronGeometry(3.2, 0)),
      track(new THREE.OctahedronGeometry(3.0, 0)),
      track(new THREE.BoxGeometry(3.8, 3.8, 3.8)),
      track(new THREE.SphereGeometry(2.1, 12, 12)),
    ];

    const nodes: MorphNode[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < NODE_COUNT; i++) {
      // Fibonacci sphere position ("100 eyes of Argos")
      const yNorm = 1 - (i / (NODE_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
      const theta = goldenAngle * i;
      const sphereRadius = 86 + (i % 5) * 6;
      const spherePos = new THREE.Vector3(
        Math.cos(theta) * radiusAtY * sphereRadius,
        yNorm * sphereRadius,
        Math.sin(theta) * radiusAtY * sphereRadius
      );

      // Compressed 2D chaotic table position (Act I)
      const col = (i % 12) - 5.5;
      const row = Math.floor(i / 12) - 3.5;
      const flatPos = new THREE.Vector3(col * 20 + ((i * 7) % 5), (i % 3) * 1.2 - 1.2, row * 20);

      // Stratified Z-Plane forensic graph position (Act III+)
      const stratumIdx = i < 16 ? 0 : i < 36 ? 1 : i < 72 ? 2 : 3;
      const hopRatio = (i % 10) / 9; // 0 (origin) -> 1 (exit)
      const fanAngle = ((i * 1.618) % 1) * Math.PI * 2;
      const radial = 28 + hopRatio * 118;
      const strataPos = new THREE.Vector3(
        Math.cos(fanAngle) * radial,
        STRATA_Y[stratumIdx],
        Math.sin(fanAngle) * radial * 0.82
      );

      const isCritical = i % 11 === 0;
      const isMixer = i % 13 === 0;
      const isCex = i % 17 === 0;
      const geo = isCritical
        ? sharedGeos[0]
        : isMixer
        ? sharedGeos[1]
        : isCex
        ? sharedGeos[2]
        : sharedGeos[3];

      const baseHex = isCritical
        ? 0xe04f33
        : isMixer
        ? 0x9d7cd8
        : isCex
        ? 0xd4a359
        : STRATA_COLORS[stratumIdx];

      const taintHex =
        hopRatio < 0.35 ? 0xe04f33 : hopRatio < 0.7 ? 0xd4a359 : 0x38bdf8;

      const mat = track(
        new THREE.MeshStandardMaterial({
          color: baseHex,
          emissive: baseHex,
          emissiveIntensity: isCritical ? 0.9 : 0.45,
          roughness: 0.25,
          metalness: 0.75,
        })
      );

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(spherePos);
      rootGroup.add(mesh);

      nodes.push({
        mesh,
        mat,
        spherePos,
        flatPos,
        strataPos,
        baseColor: new THREE.Color(baseHex),
        taintColor: new THREE.Color(taintHex),
        hopRatio,
        stratumIdx,
        spinSpeed: 0.006 + (i % 5) * 0.003,
      });
    }

    // 4. Dynamic Edge Network & Cross-Chain Vertical Beams + Flowing Particles
    const edgePairs: Array<[number, number, boolean]> = [];
    for (let i = 0; i < NODE_COUNT - 1; i++) {
      const nextSame = (i + 3) % NODE_COUNT;
      edgePairs.push([i, nextSame, nodes[i].stratumIdx !== nodes[nextSame].stratumIdx]);
      if (i % 4 === 0) {
        const bridgeTarget = (i + 19) % NODE_COUNT;
        edgePairs.push([i, bridgeTarget, true]);
      }
    }

    const linePositions = new Float32Array(edgePairs.length * 6);
    const lineGeo = track(new THREE.BufferGeometry());
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = track(
      new THREE.LineBasicMaterial({
        color: 0x7c93a8,
        transparent: true,
        opacity: 0.2,
      })
    );
    const edgeLines = new THREE.LineSegments(lineGeo, lineMat);
    rootGroup.add(edgeLines);

    // Directional flow particles along edges
    const PARTICLE_COUNT = edgePairs.length * 2;
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleColors = new Float32Array(PARTICLE_COUNT * 3);
    const particleOffsets = new Float32Array(PARTICLE_COUNT);

    for (let p = 0; p < PARTICLE_COUNT; p++) {
      particleOffsets[p] = Math.random();
      const c = p % 3 === 0 ? new THREE.Color(0xe04f33) : new THREE.Color(0xd4a359);
      particleColors[p * 3] = c.r;
      particleColors[p * 3 + 1] = c.g;
      particleColors[p * 3 + 2] = c.b;
    }

    const particleGeo = track(new THREE.BufferGeometry());
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    const particleMat = track(
      new THREE.PointsMaterial({
        size: 2.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particleSystem);

    // Subtle mouse parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      targetMouseY = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / Math.max(1, container.clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Smooth scroll state
    let smoothScroll = scrollProgressRef.current;
    let animId = 0;
    let clock = performance.now();
    let frameCounter = 0;
    let fpsAccumulator = 0;
    const tempVec = new THREE.Vector3();
    const tempColor = new THREE.Color();

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const smoothstep = (edge0: number, edge1: number, x: number) => {
      const t = clamp01((x - edge0) / Math.max(0.0001, edge1 - edge0));
      return t * t * (3 - 2 * t);
    };

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(50, now - clock);
      clock = now;

      frameCounter++;
      fpsAccumulator += dt;
      if (fpsAccumulator >= 900) {
        if (onFpsSample) {
          onFpsSample(Math.min(60, Math.round((frameCounter * 1000) / fpsAccumulator)));
        }
        frameCounter = 0;
        fpsAccumulator = 0;
      }

      // Exponential damping on scroll & mouse
      smoothScroll += (scrollProgressRef.current - smoothScroll) * 0.06;
      smoothMouseX += (targetMouseX - smoothMouseX) * 0.05;
      smoothMouseY += (targetMouseY - smoothMouseY) * 0.05;

      const s = clamp01(smoothScroll);
      const timeSec = now * 0.001;

      // Blend weights across the 7 Scrollytelling Acts
      const toFlat = smoothstep(0.08, 0.24, s);
      const toStrata = smoothstep(0.32, 0.56, s);
      const taintBlend = smoothstep(0.62, 0.8, s);
      const coreFade = 1 - smoothstep(0.28, 0.5, s) * 0.72;

      // Core iris & rings animation
      coreGroup.scale.setScalar(Math.max(0.25, coreFade));
      irisMesh.rotation.y = timeSec * 0.45;
      irisMesh.rotation.x = timeSec * 0.25;
      irisCage.rotation.y = -timeSec * 0.3;
      orbitalRings.forEach((ring, idx) => {
        ring.rotation.z += (idx % 2 === 0 ? 1 : -1) * 0.0035;
        ring.rotation.y += 0.002;
      });

      // Z-Strata horizontal rings fade in cleanly during Act III+
      strataMeshes.forEach((seg) => {
        const mat = seg.material as THREE.LineBasicMaterial;
        mat.opacity = toStrata * 0.26;
        seg.rotation.y = timeSec * 0.05;
      });

      // Morph all 92 sentinel nodes
      for (let i = 0; i < NODE_COUNT; i++) {
        const n = nodes[i];
        // Interpolate sphere -> flat -> strata
        tempVec.copy(n.spherePos).lerp(n.flatPos, toFlat).lerp(n.strataPos, toStrata);

        // Gentle breathing motion
        tempVec.y += Math.sin(timeSec * 1.4 + i * 0.5) * 1.3;
        n.mesh.position.copy(tempVec);
        n.mesh.rotation.y += n.spinSpeed;
        n.mesh.rotation.x += n.spinSpeed * 0.6;

        // Thermal taint wave in Act IV+
        if (taintBlend > 0.01) {
          const wavePulse = 0.5 + 0.5 * Math.sin(timeSec * 2.4 - n.hopRatio * 5.0);
          tempColor.copy(n.baseColor).lerp(n.taintColor, taintBlend * (0.65 + 0.35 * wavePulse));
          n.mat.color.copy(tempColor);
          n.mat.emissive.copy(tempColor);
        } else {
          n.mat.color.copy(n.baseColor);
          n.mat.emissive.copy(n.baseColor);
        }
      }

      // Update dynamic edge buffer & flowing particles
      const posArr = lineGeo.attributes.position.array as Float32Array;
      const pArr = particleGeo.attributes.position.array as Float32Array;

      for (let e = 0; e < edgePairs.length; e++) {
        const [aIdx, bIdx] = edgePairs[e];
        const posA = nodes[aIdx].mesh.position;
        const posB = nodes[bIdx].mesh.position;
        const base = e * 6;
        posArr[base] = posA.x;
        posArr[base + 1] = posA.y;
        posArr[base + 2] = posA.z;
        posArr[base + 3] = posB.x;
        posArr[base + 4] = posB.y;
        posArr[base + 5] = posB.z;

        // Two particles per edge
        for (let k = 0; k < 2; k++) {
          const pIdx = e * 2 + k;
          particleOffsets[pIdx] = (particleOffsets[pIdx] + dt * 0.00024) % 1;
          const t = particleOffsets[pIdx];
          const pBase = pIdx * 3;
          pArr[pBase] = posA.x + (posB.x - posA.x) * t;
          pArr[pBase + 1] = posA.y + (posB.y - posA.y) * t;
          pArr[pBase + 2] = posA.z + (posB.z - posA.z) * t;
        }
      }
      lineGeo.attributes.position.needsUpdate = true;
      particleGeo.attributes.position.needsUpdate = true;
      lineMat.opacity = 0.11 + toStrata * 0.16;

      // Camera choreography across scroll + mouse parallax
      const orbitAngle = s * Math.PI * 0.85 + timeSec * 0.05;
      const camRadius = 245 - smoothstep(0.15, 0.45, s) * 28 + smoothstep(0.75, 1.0, s) * 35;
      const camElevation =
        28 - smoothstep(0.1, 0.25, s) * 18 + smoothstep(0.35, 0.7, s) * 62;

      camera.position.x = Math.sin(orbitAngle) * camRadius * 0.55 + smoothMouseX * 16;
      camera.position.z = Math.cos(orbitAngle) * camRadius * 0.88;
      camera.position.y = camElevation - smoothMouseY * 12;
      camera.lookAt(0, smoothstep(0.35, 0.7, s) * -4, 0);

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [scrollProgressRef, onFpsSample]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none opacity-80"
    />
  );
};

