import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { useForensicStore, getFilteredGraph } from '../store/useForensicStore';
import { CHAIN_PLANES } from '../data/forensicCases';
import { AssetType, ChainId, ForensicLink, ForensicNode } from '../types/forensics';
import { ArgusOrbitalLogo } from '../components/ArgusOrbitalLogo';
import { TRANSLATIONS } from '../i18n/translations';
import { Compass, Eye, Flame, Layers, Maximize2, PlusCircle, RotateCcw, Search, Sparkles } from 'lucide-react';

// Helper to compute Cold Steel (0% taint) -> Brushed Ochre -> Signal Vermilion (100% taint)
function getTaintHeatmapColor(taintScore: number): THREE.Color {
  const t = Math.max(0, Math.min(100, taintScore)) / 100;
  if (t < 0.35) {
    return new THREE.Color(0x475b6d).lerp(new THREE.Color(0x7c93a8), t / 0.35);
  }
  if (t < 0.7) {
    return new THREE.Color(0x7c93a8).lerp(new THREE.Color(0xd4a359), (t - 0.35) / 0.35);
  }
  return new THREE.Color(0xd4a359).lerp(new THREE.Color(0xe04f33), (t - 0.7) / 0.3);
}

function getEntityDefaultColor(node: ForensicNode): THREE.Color {
  if (node.flaggedSuspect || node.entityType === 'exploiter') return new THREE.Color(0xe04f33); // Signal Vermilion
  switch (node.entityType) {
    case 'mixer':
      return new THREE.Color(0x9d7cd8); // Ultraviolet Quartz / Mauve
    case 'bridge':
      return new THREE.Color(0x96aab8); // Brushed Titanium Beacon
    case 'dex':
      return new THREE.Color(0x608a9e); // Anodized Slate Prism
    case 'cex':
      return new THREE.Color(0xd4a359); // Brushed Brass / Gold Cube
    case 'eoa':
    default:
      return new THREE.Color(CHAIN_PLANES[node.chain].hex);
  }
}

function getAssetLinkColor(link: ForensicLink, heatmapMode: boolean): THREE.Color {
  if (heatmapMode) {
    return link.isHighTaint ? new THREE.Color(0xe04f33) : new THREE.Color(0x5e768c);
  }
  if (link.isHighTaint) return new THREE.Color(0xe04f33); // Vermilion = High-Taint / Stolen funds
  const map: Record<AssetType, number> = {
    ETH: 0x7c93a8,  // Anodized Steel Blue = ETH
    USDT: 0x4e9f76, // Tactical Sage = USDT
    USDC: 0x5da882, // Sage = USDC
    DAI: 0xb89658,
    WBTC: 0xd4a359, // Warm Amber Brass = WBTC
    SOL: 0x4e9f76,
  };
  return new THREE.Color(map[link.asset] || 0x8c9bae);
}

// Generate glowing soft radial particle texture once
function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255, 250, 240, 1)');
  grad.addColorStop(0.35, 'rgba(234, 219, 194, 0.85)');
  grad.addColorStop(0.7, 'rgba(212, 163, 89, 0.22)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

// Generate 3D text badge sprite for Chain Planes and Major Entities
function createTextSprite(
  text: string,
  subtext: string,
  borderColor: string,
  scaleWidth = 75
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(8, 9, 12, 0.88)';
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(8, 8, 496, 112, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#E6E6EA';
  ctx.font = 'bold 33px "JetBrains Mono", monospace';
  ctx.fillText(text.slice(0, 26), 28, 56);

  ctx.fillStyle = borderColor;
  ctx.font = '23px "JetBrains Mono", monospace';
  ctx.fillText(subtext.slice(0, 34), 28, 96);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scaleWidth, scaleWidth * 0.25, 1);
  return sprite;
}

interface NodeRenderEntry {
  node: ForensicNode;
  group: THREE.Group;
  primaryMesh: THREE.Mesh;
  secondaryRing?: THREE.Object3D;
  verticalBeam?: THREE.Mesh;
  labelSprite?: THREE.Sprite;
  baseRadius: number;
}

interface LinkRenderEntry {
  link: ForensicLink;
  curve: THREE.Curve<THREE.Vector3>;
  lineObj: THREE.Line;
  color: THREE.Color;
  particleCount: number;
  particleOffsets: number[];
  particleSpeed: number;
  particleSize: number;
}

export const AetherScene3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const state = useForensicStore();
  const t = TRANSLATIONS[state.language];

  const [hoveredNode, setHoveredNode] = useState<{
    node: ForensicNode;
    screenX: number;
    screenY: number;
  } | null>(null);

  // Store refs to Three.js core objects for reactive updates without recreating renderer
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const planesGroupRef = useRef<THREE.Group | null>(null);
  const graphGroupRef = useRef<THREE.Group | null>(null);
  const selectionRingRef = useRef<THREE.Mesh | null>(null);

  const nodeEntriesRef = useRef<Map<string, NodeRenderEntry>>(new Map());
  const linkEntriesRef = useRef<LinkRenderEntry[]>([]);
  const particlesPointsRef = useRef<THREE.Points | null>(null);
  const cameraTargetLerpRef = useRef<{
    active: boolean;
    targetPos: THREE.Vector3;
    cameraPos: THREE.Vector3;
  }>({
    active: false,
    targetPos: new THREE.Vector3(0, 20, 0),
    cameraPos: new THREE.Vector3(0, 220, 620),
  });

  // 1. Initialize Three.js WebGLRenderer, EffectComposer (UnrealBloomPass), OrbitControls, and Z-Planes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b);
    scene.fog = new THREE.FogExp2(0x09090b, 0.00058);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(52, width / height, 1, 4500);
    camera.position.set(0, 230, 650);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.72, // restrained precision bloom strength (no washed-out neon glare)
      0.38, // radius
      0.28  // threshold
    );
    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 1950;
    controls.minDistance = 25;
    controls.target.set(0, 30, 0);
    controlsRef.current = controls;

    // Interrupt automatic camera fly-to when user manually drags/zooms
    const stopAutoCamera = () => {
      cameraTargetLerpRef.current.active = false;
    };
    controls.addEventListener('start', stopAutoCamera);

    // Lighting — Warm Tungsten & Anodized Steel directional contrast
    const ambientLight = new THREE.AmbientLight(0xd4d8e2, 0.82);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xdfc496, 1.45);
    dirLight1.position.set(300, 600, 400);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7c93a8, 1.05);
    dirLight2.position.set(-400, -300, -250);
    scene.add(dirLight2);

    // Subtle background starfield dust
    const starGeo = new THREE.BufferGeometry();
    const starCount = 900;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 2600;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1400;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 2600;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xa5a8b4,
      size: 1.8,
      transparent: true,
      opacity: 0.18,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Multi-Chain Z-Planes Group (Ethereum Y=0, Arbitrum Y=120, Bitcoin Y=-120, Solana Y=240)
    const planesGroup = new THREE.Group();
    planesGroupRef.current = planesGroup;
    scene.add(planesGroup);

    (Object.keys(CHAIN_PLANES) as ChainId[]).forEach((chainKey) => {
      const cfg = CHAIN_PLANES[chainKey];
      const layerGroup = new THREE.Group();
      layerGroup.position.set(0, cfg.y, 0);
      layerGroup.userData = { chain: chainKey };

      // Holographic GridHelper
      const grid = new THREE.GridHelper(920, 28, cfg.hex, cfg.hex);
      const gridMat = grid.material as THREE.Material;
      gridMat.transparent = true;
      gridMat.opacity = 0.14;
      gridMat.depthWrite = false;
      layerGroup.add(grid);

      // Glowing Perimeter Frame
      const borderGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(920, 0.5, 920));
      const borderMat = new THREE.LineBasicMaterial({
        color: cfg.hex,
        transparent: true,
        opacity: 0.42,
      });
      const borderFrame = new THREE.LineSegments(borderGeo, borderMat);
      layerGroup.add(borderFrame);

      // Translucent Plane Floor
      const planeGeo = new THREE.PlaneGeometry(920, 920);
      planeGeo.rotateX(-Math.PI / 2);
      const planeMat = new THREE.MeshBasicMaterial({
        color: cfg.hex,
        transparent: true,
        opacity: 0.022,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      layerGroup.add(new THREE.Mesh(planeGeo, planeMat));

      // Corner Holographic Chain Label
      const badge = createTextSprite(
        `${chainKey} // ${cfg.name.toUpperCase()}`,
        `STRATUM Y = ${cfg.y >= 0 ? '+' + cfg.y : cfg.y} | HOLOGRAPHIC LAYER`,
        cfg.color,
        92
      );
      badge.position.set(-395, 14, -425);
      layerGroup.add(badge);

      planesGroup.add(layerGroup);
    });

    // Graph Group for Nodes, Edges, and Directional Flow Particles
    const graphGroup = new THREE.Group();
    graphGroupRef.current = graphGroup;
    scene.add(graphGroup);

    // Selection Reticle Ring
    const selGeo = new THREE.RingGeometry(11, 13.5, 36);
    selGeo.rotateX(-Math.PI / 2);
    const selMat = new THREE.MeshBasicMaterial({
      color: 0xd4a359,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const selRing = new THREE.Mesh(selGeo, selMat);
    selRing.visible = false;
    scene.add(selRing);
    selectionRingRef.current = selRing;

    // Raycaster for Node Hover & Click Selection
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const pickNodeAtEvent = (e: MouseEvent): ForensicNode | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const meshes: THREE.Object3D[] = [];
      nodeEntriesRef.current.forEach((entry) => {
        meshes.push(entry.primaryMesh);
      });

      const hits = raycaster.intersectObjects(meshes, false);
      if (hits.length > 0) {
        const hitObj = hits[0].object;
        const nodeId = hitObj.userData?.nodeId;
        if (nodeId) {
          const entry = nodeEntriesRef.current.get(nodeId);
          return entry?.node || null;
        }
      }
      return null;
    };

    const handlePointerMove = (e: MouseEvent) => {
      const hitNode = pickNodeAtEvent(e);
      if (hitNode) {
        renderer.domElement.style.cursor = 'pointer';
        const rect = renderer.domElement.getBoundingClientRect();
        setHoveredNode({
          node: hitNode,
          screenX: e.clientX - rect.left,
          screenY: e.clientY - rect.top,
        });
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoveredNode(null);
      }
    };

    const handlePointerUp = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - pointerDownPos.x);
      const dy = Math.abs(e.clientY - pointerDownPos.y);
      if (dx > 6 || dy > 6) return; // Ignore drag movements

      const hitNode = pickNodeAtEvent(e);
      if (hitNode) {
        useForensicStore.getState().selectNode(hitNode.id);
      }
    };

    const handleDblClick = (e: MouseEvent) => {
      const hitNode = pickNodeAtEvent(e);
      if (hitNode) {
        const store = useForensicStore.getState();
        store.selectNode(hitNode.id);
        store.expandNodeHops(hitNode.id);
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('dblclick', handleDblClick);

    // Resize Observer for responsive split/full views
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    // Animation Loop (60 FPS Force Constraints, Geometries Animation, Particle Flow, Timeline Playback)
    let animFrameId = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      animFrameId = requestAnimationFrame(animate);
      const dt = Math.min(50, now - lastTime);
      lastTime = now;
      const elapsedSec = now * 0.001;

      // Advance Time-Lapse Scrubber if playing
      if (useForensicStore.getState().isPlaying) {
        useForensicStore.getState().tickTimeline(dt);
      }

      // Animate Specialized Node Geometries & Constrain Y-Plane Gravity
      nodeEntriesRef.current.forEach((entry) => {
        const { node, group, primaryMesh, secondaryRing, verticalBeam, baseRadius } = entry;
        const targetY = CHAIN_PLANES[node.chain].y;
        // Subtle Y-plane harmonic hover around chain stratum
        group.position.y += (targetY - group.position.y) * 0.12;

        if (node.entityType === 'exploiter' || node.flaggedSuspect) {
          // Pulsating crimson icosahedron with rotating warning wireframe ring
          const pulse = 1 + Math.sin(elapsedSec * 4.5) * 0.16;
          primaryMesh.scale.setScalar(pulse);
          primaryMesh.rotation.y += 0.018;
          primaryMesh.rotation.x += 0.01;
          if (secondaryRing) {
            secondaryRing.rotation.z -= 0.025;
            secondaryRing.rotation.x = Math.sin(elapsedSec * 1.5) * 0.45;
          }
        } else if (node.entityType === 'mixer') {
          // Dark singularity sphere surrounded by rotating purple accretion ring
          primaryMesh.rotation.y -= 0.02;
          if (secondaryRing) {
            secondaryRing.rotation.z += 0.038;
          }
        } else if (node.entityType === 'dex') {
          // Rotating cyan octahedron (prism)
          primaryMesh.rotation.y += 0.025;
          primaryMesh.rotation.z = Math.sin(elapsedSec * 2) * 0.2;
        } else if (node.entityType === 'bridge') {
          // Vertical cylindrical portal beacon emitting pulsing beams
          primaryMesh.rotation.y += 0.015;
          if (verticalBeam) {
            const beamMat = verticalBeam.material as THREE.MeshBasicMaterial;
            beamMat.opacity = 0.2 + Math.sin(elapsedSec * 3.5) * 0.1;
          }
        } else if (node.entityType === 'cex') {
          // Large golden cube slow rotation
          primaryMesh.rotation.y += 0.006;
        } else {
          // Standard EOA Wallet subtle breathing
          const s = 1 + Math.sin(elapsedSec * 2 + baseRadius) * 0.04;
          primaryMesh.scale.setScalar(s);
        }
      });

      // Update Selection Reticle Ring
      const selectedId = useForensicStore.getState().selectedNodeId;
      if (selectedId && selectionRingRef.current) {
        const selectedEntry = nodeEntriesRef.current.get(selectedId);
        if (selectedEntry) {
          selectionRingRef.current.visible = true;
          selectionRingRef.current.position.copy(selectedEntry.group.position);
          selectionRingRef.current.position.y -= selectedEntry.baseRadius + 1.5;
          const ringScale = (selectedEntry.baseRadius / 8) * (1 + Math.sin(elapsedSec * 4) * 0.12);
          selectionRingRef.current.scale.setScalar(Math.max(0.7, ringScale));
          selectionRingRef.current.rotation.z += 0.02;
        } else {
          selectionRingRef.current.visible = false;
        }
      } else if (selectionRingRef.current) {
        selectionRingRef.current.visible = false;
      }

      // Update Directional Transaction Flow Particles along Curves
      if (particlesPointsRef.current && linkEntriesRef.current.length > 0) {
        const posAttr = particlesPointsRef.current.geometry.getAttribute(
          'position'
        ) as THREE.BufferAttribute;
        if (posAttr) {
          let pIdx = 0;
          const tempVec = new THREE.Vector3();
          for (const lEntry of linkEntriesRef.current) {
            for (let i = 0; i < lEntry.particleCount; i++) {
              lEntry.particleOffsets[i] =
                (lEntry.particleOffsets[i] + 0.0038 * lEntry.particleSpeed) % 1.0;
              lEntry.curve.getPoint(lEntry.particleOffsets[i], tempVec);
              posAttr.setXYZ(pIdx, tempVec.x, tempVec.y, tempVec.z);
              pIdx++;
            }
          }
          posAttr.needsUpdate = true;
        }
      }

      // Smooth Camera Fly-To Transition
      if (cameraTargetLerpRef.current.active) {
        controls.target.lerp(cameraTargetLerpRef.current.targetPos, 0.08);
        camera.position.lerp(cameraTargetLerpRef.current.cameraPos, 0.07);
        if (
          camera.position.distanceTo(cameraTargetLerpRef.current.cameraPos) < 1.5 &&
          controls.target.distanceTo(cameraTargetLerpRef.current.targetPos) < 1.5
        ) {
          cameraTargetLerpRef.current.active = false;
        }
      }

      controls.update();
      composer.render();
    };

    animFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('start', stopAutoCamera);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('dblclick', handleDblClick);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 2. Toggle Chain Planes Visibility
  useEffect(() => {
    if (!planesGroupRef.current) return;
    planesGroupRef.current.visible = state.showChainPlanes;
    planesGroupRef.current.children.forEach((child) => {
      const chain = child.userData?.chain as ChainId | undefined;
      if (chain) {
        child.visible = state.enabledChains[chain];
      }
    });
  }, [state.showChainPlanes, state.enabledChains]);

  // 3. Rebuild / Sync 3D Nodes, Specialized Geometries, Curves, and Flow Particles when Filtered Graph Changes
  useEffect(() => {
    const graphGroup = graphGroupRef.current;
    if (!graphGroup) return;

    // Cleanly dispose previous geometries & materials
    while (graphGroup.children.length > 0) {
      const child = graphGroup.children[0];
      child.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
      graphGroup.remove(child);
    }
    nodeEntriesRef.current.clear();
    linkEntriesRef.current = [];

    const { visibleNodes, visibleLinks } = getFilteredGraph(state);

    // Quick force-relaxation pass on X/Z to prevent overlaps while strictly respecting Chain Y-Planes
    const nodeMap = new Map<string, ForensicNode>();
    visibleNodes.forEach((n) => {
      n.y = CHAIN_PLANES[n.chain].y;
      nodeMap.set(n.id, n);
    });

    for (let iter = 0; iter < 12; iter++) {
      for (let i = 0; i < visibleNodes.length; i++) {
        for (let j = i + 1; j < visibleNodes.length; j++) {
          const a = visibleNodes[i];
          const b = visibleNodes[j];
          if (a.chain !== b.chain) continue;
          const dx = b.x - a.x;
          const dz = b.z - a.z;
          const distSq = dx * dx + dz * dz + 0.01;
          const minDist = 34;
          if (distSq < minDist * minDist) {
            const dist = Math.sqrt(distSq);
            const push = ((minDist - dist) / dist) * 0.35;
            a.x -= dx * push;
            a.z -= dz * push;
            b.x += dx * push;
            b.z += dz * push;
          }
        }
      }
    }

    // Pre-compute top priority labeled nodes when graph is in high-density Full Ledger mode
    const highDensityGraph = visibleNodes.length > 90;
    const topLabeledIds = new Set<string>();
    if (highDensityGraph) {
      if (state.selectedNodeId) topLabeledIds.add(state.selectedNodeId);
      const rankedForLabels = [...visibleNodes]
        .filter((n) => n.entityType !== 'eoa' || n.volumeUsd >= 25000000)
        .sort((a, b) => {
          const priorityA = a.entityType === 'exploiter' ? 3 : a.entityType !== 'eoa' ? 2 : 1;
          const priorityB = b.entityType === 'exploiter' ? 3 : b.entityType !== 'eoa' ? 2 : 1;
          if (priorityB !== priorityA) return priorityB - priorityA;
          return b.volumeUsd - a.volumeUsd;
        })
        .slice(0, 18);
      rankedForLabels.forEach((n) => topLabeledIds.add(n.id));
    }

    // Build Specialized Node Geometries
    visibleNodes.forEach((node) => {
      const group = new THREE.Group();
      group.position.set(node.x, CHAIN_PLANES[node.chain].y, node.z);

      const nodeColor = state.heatmapTaintMode
        ? getTaintHeatmapColor(node.taintScore)
        : getEntityDefaultColor(node);

      // Logarithmic scale by USD volume
      const logScale = Math.max(3.6, Math.min(13.5, Math.log10(Math.max(1000, node.volumeUsd)) * 1.45 - 3.2));
      let primaryMesh: THREE.Mesh;
      let secondaryRing: THREE.Object3D | undefined;
      let verticalBeam: THREE.Mesh | undefined;

      if (node.entityType === 'exploiter' || node.flaggedSuspect) {
        // 1. Hacker / Sanctioned Entity: Pulsating crimson icosahedron with warning wireframe ring
        const geo = new THREE.IcosahedronGeometry(logScale * 1.25, 0);
        const mat = new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.9,
          roughness: 0.2,
          metalness: 0.8,
        });
        primaryMesh = new THREE.Mesh(geo, mat);

        const ringGeo = new THREE.TorusGeometry(logScale * 1.9, 0.55, 8, 28);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xe04f33,
          wireframe: true,
        });
        secondaryRing = new THREE.Mesh(ringGeo, ringMat);
        group.add(secondaryRing);
      } else if (node.entityType === 'mixer') {
        // 2. Mixer (Tornado Cash, Railgun): Dark singularity sphere + rotating ultraviolet quartz accretion ring
        const geo = new THREE.SphereGeometry(logScale * 1.15, 28, 28);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x0c0b10,
          emissive: state.heatmapTaintMode ? nodeColor : new THREE.Color(0x7e5bb8),
          emissiveIntensity: 0.48,
          roughness: 0.15,
          metalness: 0.92,
        });
        primaryMesh = new THREE.Mesh(geo, mat);

        // Particle accretion ring around singularity
        const accCount = 90;
        const accPos = new Float32Array(accCount * 3);
        for (let i = 0; i < accCount; i++) {
          const ang = (i / accCount) * Math.PI * 2;
          const r = logScale * 1.55 + (i % 5) * 1.2;
          accPos[i * 3] = Math.cos(ang) * r;
          accPos[i * 3 + 1] = Math.sin(ang) * r;
          accPos[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
        }
        const accGeo = new THREE.BufferGeometry();
        accGeo.setAttribute('position', new THREE.BufferAttribute(accPos, 3));
        const accMat = new THREE.PointsMaterial({
          color: state.heatmapTaintMode ? nodeColor : 0xbea8e6,
          size: 2.4,
          transparent: true,
          opacity: 0.9,
        });
        const accRing = new THREE.Points(accGeo, accMat);
        accRing.rotation.x = Math.PI * 0.38;
        secondaryRing = accRing;
        group.add(accRing);
      } else if (node.entityType === 'bridge') {
        // 3. Cross-Chain Bridge: Vertical cylindrical portal beacon emitting vertical beams
        const geo = new THREE.CylinderGeometry(logScale * 0.85, logScale * 0.85, logScale * 2.2, 20);
        const mat = new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.75,
          roughness: 0.15,
          metalness: 0.85,
        });
        primaryMesh = new THREE.Mesh(geo, mat);

        const beamGeo = new THREE.CylinderGeometry(logScale * 0.32, logScale * 0.32, 130, 12, 1, true);
        const beamMat = new THREE.MeshBasicMaterial({
          color: nodeColor,
          transparent: true,
          opacity: 0.24,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        verticalBeam = new THREE.Mesh(beamGeo, beamMat);
        group.add(verticalBeam);
      } else if (node.entityType === 'dex') {
        // 4. DEX Pool: Rotating cyan octahedron (prism)
        const geo = new THREE.OctahedronGeometry(logScale * 1.2, 0);
        const mat = new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.65,
          roughness: 0.2,
          metalness: 0.75,
        });
        primaryMesh = new THREE.Mesh(geo, mat);
      } else if (node.entityType === 'cex') {
        // 5. CEX Exit Node: Large golden cube representing fiat off-ramps
        const side = logScale * 1.55;
        const geo = new THREE.BoxGeometry(side, side, side);
        const mat = new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.65,
          roughness: 0.22,
          metalness: 0.88,
        });
        primaryMesh = new THREE.Mesh(geo, mat);
      } else {
        // 6. Standard Wallet (EOA): Glowing sphere scaled logarithmically by USD volume
        const geo = new THREE.SphereGeometry(logScale * 0.85, 20, 20);
        const mat = new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.5,
          roughness: 0.3,
          metalness: 0.6,
        });
        primaryMesh = new THREE.Mesh(geo, mat);
      }

      primaryMesh.userData = { nodeId: node.id };
      group.add(primaryMesh);

      // Add floating 3D label sprite for non-EOA infrastructure or high-volume/selected nodes
      const shouldRenderLabel =
        state.showLabels &&
        (highDensityGraph
          ? topLabeledIds.has(node.id)
          : node.entityType !== 'eoa' || node.id === state.selectedNodeId || node.volumeUsd >= 18000000);

      if (shouldRenderLabel) {
        const badgeColor =
          node.taintScore >= 75
            ? '#E04F33'
            : node.entityType === 'cex'
            ? '#D4A359'
            : node.entityType === 'mixer'
            ? '#9D7CD8'
            : '#8C9BAE';
        const sprite = createTextSprite(
          node.label,
          `$${(node.volumeUsd / 1e6).toFixed(2)}M | TAINT: ${node.taintScore}%`,
          badgeColor,
          44
        );
        sprite.position.set(0, logScale * 2.1 + 7, 0);
        group.add(sprite);
      }

      graphGroup.add(group);
      nodeEntriesRef.current.set(node.id, {
        node,
        group,
        primaryMesh,
        secondaryRing,
        verticalBeam,
        baseRadius: logScale,
      });
    });

    // Build Transaction Edges & Animated Directional Particle Links
    let totalParticles = 0;
    const highDensityLinks = visibleLinks.length > 220;
    const pairCounts = new Map<string, number>();
    const pairSeen = new Map<string, number>();
    visibleLinks.forEach((l) => {
      const pk = l.source < l.target ? `${l.source}|${l.target}` : `${l.target}|${l.source}`;
      pairCounts.set(pk, (pairCounts.get(pk) || 0) + 1);
    });

    visibleLinks.forEach((link) => {
      const srcEntry = nodeEntriesRef.current.get(link.source);
      const dstEntry = nodeEntriesRef.current.get(link.target);
      if (!srcEntry || !dstEntry) return;

      const startVec = srcEntry.group.position.clone();
      const endVec = dstEntry.group.position.clone();
      const midVec = startVec.clone().lerp(endVec, 0.5);

      const pk = link.source < link.target ? `${link.source}|${link.target}` : `${link.target}|${link.source}`;
      const totalForPair = pairCounts.get(pk) || 1;
      const idxInPair = pairSeen.get(pk) || 0;
      pairSeen.set(pk, idxInPair + 1);

      if (link.isCrossChain) {
        // Cross-chain bridge transactions render as curved/vertical beams piercing between chain planes
        const dx = endVec.x - startVec.x;
        const dz = endVec.z - startVec.z;
        midVec.x += -dz * 0.2 + 18;
        midVec.z += dx * 0.2 + 18;
      } else {
        // Subtle arch within same plane + lateral fan when multiple real txs connect same wallet pair
        const dist = startVec.distanceTo(endVec);
        midVec.y += Math.min(28, dist * 0.14) + (totalForPair > 1 ? (idxInPair % 4) * 3.2 : 0);
        if (totalForPair > 1) {
          const dx = endVec.x - startVec.x;
          const dz = endVec.z - startVec.z;
          const len = Math.max(1, Math.hypot(dx, dz));
          const perpX = -dz / len;
          const perpZ = dx / len;
          const centeredIdx = idxInPair - (totalForPair - 1) / 2;
          const spread = Math.sign(centeredIdx) * Math.min(32, Math.abs(centeredIdx) * 4.5);
          midVec.x += perpX * spread;
          midVec.z += perpZ * spread;
        }
      }

      const curve = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);
      const points = curve.getPoints(highDensityLinks ? 20 : 28);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

      const linkColor = getAssetLinkColor(link, state.heatmapTaintMode);
      let lineObj: THREE.Line;

      if (link.isProbabilistic) {
        // Post-mixer correlated withdrawal links rendered as dashed lines
        const dashMat = new THREE.LineDashedMaterial({
          color: state.heatmapTaintMode ? linkColor : 0x9d7cd8,
          dashSize: 5,
          gapSize: 3.5,
          transparent: true,
          opacity: 0.72,
        });
        lineObj = new THREE.Line(lineGeo, dashMat);
        lineObj.computeLineDistances();
      } else {
        const lineMat = new THREE.LineBasicMaterial({
          color: linkColor,
          transparent: true,
          opacity: link.isCrossChain ? 0.78 : highDensityLinks ? 0.28 : 0.36,
        });
        lineObj = new THREE.Line(lineGeo, lineMat);
      }

      graphGroup.add(lineObj);

      // Particle density based on USD value (scaled cleanly in Full Ledger mode to sustain 60 FPS)
      const rawPCount = link.isCrossChain
        ? 6
        : link.usdValue >= 10000000
        ? 5
        : link.usdValue >= 2000000
        ? 3
        : 2;
      const pCount = highDensityLinks ? Math.max(1, Math.ceil(rawPCount * 0.55)) : rawPCount;

      const offsets: number[] = [];
      for (let i = 0; i < pCount; i++) {
        offsets.push(i / pCount + Math.random() * 0.12);
      }

      linkEntriesRef.current.push({
        link,
        curve,
        lineObj,
        color: linkColor,
        particleCount: pCount,
        particleOffsets: offsets,
        particleSpeed: link.velocity,
        particleSize: Math.min(10, Math.max(4, Math.log10(Math.max(1000, link.usdValue)))),
      });

      totalParticles += pCount;
    });

    // Create Combined Directional Particle BufferGeometry for high-FPS rendering
    if (totalParticles > 0) {
      const pPositions = new Float32Array(totalParticles * 3);
      const pColors = new Float32Array(totalParticles * 3);
      let idx = 0;
      const tempVec = new THREE.Vector3();

      for (const lEntry of linkEntriesRef.current) {
        for (let i = 0; i < lEntry.particleCount; i++) {
          lEntry.curve.getPoint(lEntry.particleOffsets[i], tempVec);
          pPositions[idx * 3] = tempVec.x;
          pPositions[idx * 3 + 1] = tempVec.y;
          pPositions[idx * 3 + 2] = tempVec.z;

          pColors[idx * 3] = Math.min(1, lEntry.color.r + 0.25);
          pColors[idx * 3 + 1] = Math.min(1, lEntry.color.g + 0.25);
          pColors[idx * 3 + 2] = Math.min(1, lEntry.color.b + 0.25);
          idx++;
        }
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 7.5,
        map: createGlowTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particlePoints = new THREE.Points(particleGeo, particleMat);
      graphGroup.add(particlePoints);
      particlesPointsRef.current = particlePoints;
    } else {
      particlesPointsRef.current = null;
    }
  }, [
    state.nodes,
    state.links,
    state.enabledChains,
    state.enabledEntities,
    state.minUsdValue,
    state.showProbabilisticLinks,
    state.heatmapTaintMode,
    state.showLabels,
    state.currentTimestamp,
    state.isolatedRootNodeId,
    state.selectedNodeId,
  ]);

  // 4. Smoothly Fly 3D Camera to Selected Node
  useEffect(() => {
    if (!state.selectedNodeId) return;
    const entry = nodeEntriesRef.current.get(state.selectedNodeId);
    if (!entry) return;

    const target = entry.group.position.clone();
    const offset = new THREE.Vector3(65, 55, 135);
    cameraTargetLerpRef.current = {
      active: true,
      targetPos: target,
      cameraPos: target.clone().add(offset),
    };
  }, [state.selectedNodeId, state.cameraFocusTrigger]);

  // 5. Reset Camera to Full Multi-Chain Overview
  useEffect(() => {
    if (state.cameraResetTrigger === 0) return;
    cameraTargetLerpRef.current = {
      active: true,
      targetPos: new THREE.Vector3(0, 30, 0),
      cameraPos: new THREE.Vector3(0, 230, 650),
    };
  }, [state.cameraResetTrigger]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#09090B]">
      {/* 3D WebGL Canvas Mount */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating Quick Viewport Controls (Bottom-Left above Timeline) */}
      <div className="absolute bottom-24 left-4 z-20 flex flex-wrap items-center gap-1.5 bg-[#111113]/85 backdrop-blur-md border border-white/10 rounded-lg p-1.5 shadow-2xl">
        <button
          onClick={() => state.triggerCameraReset()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/10 rounded transition"
          title="Reset 3D Camera Overview"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset Cam</span>
        </button>

        <button
          onClick={() => state.setHeatmapTaintMode(!state.heatmapTaintMode)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded transition ${
            state.heatmapTaintMode
              ? 'bg-rose-500/25 text-rose-200 border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle Crime Taint Heatmap Mode (Cold Blue 0% -> Neon Red 100%)"
        >
          <Flame className={`w-3.5 h-3.5 ${state.heatmapTaintMode ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
          <span>Heatmap Taint</span>
        </button>

        <button
          onClick={() => state.setShowChainPlanes(!state.showChainPlanes)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded transition ${
            state.showChainPlanes
              ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle Multi-Chain Z-Planes Grid"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Z-Planes</span>
        </button>

        <button
          onClick={() => state.setShowLabels(!state.showLabels)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded transition ${
            state.showLabels
              ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle 3D Floating Entity Labels"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>3D Badges</span>
        </button>

        {state.isolatedRootNodeId && (
          <button
            onClick={() => state.toggleIsolateSubGraph(null)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded hover:bg-amber-500/30 transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Exit Sub-Graph Isolation</span>
          </button>
        )}

        {Object.keys(state.expandedHopsByNodeId).length > 0 && (
          <button
            onClick={() => state.resetExpandedHops()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 rounded hover:bg-cyan-500/30 transition"
            title="Remove all dynamically expanded (+1 Hop) nodes & reset camera view"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset Expanded Hops ({Object.keys(state.expandedHopsByNodeId).length})</span>
          </button>
        )}
      </div>

      {/* Spatial Z-Plane Stratification Legend (Top-Right Sub-Overlay) */}
      <div className="pointer-events-none absolute top-20 left-4 z-10 hidden xl:flex flex-col gap-1 bg-[#111113]/75 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-slate-400 uppercase tracking-wider mb-0.5">
          <Compass className="w-3 h-3 text-cyan-400" />
          <span>Multi-Chain Spatial Strata</span>
        </div>
        {(Object.keys(CHAIN_PLANES) as ChainId[]).map((cKey) => {
          const plane = CHAIN_PLANES[cKey];
          return (
            <div key={cKey} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-200">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: plane.color, boxShadow: `0 0 8px ${plane.color}` }}
                />
                {cKey}
              </span>
              <span className="text-slate-400">Y = {plane.y >= 0 ? `+${plane.y}` : plane.y}</span>
            </div>
          );
        })}
      </div>

      {/* Hover Tooltip on 3D Node */}
      {hoveredNode && (
        <div
          className="pointer-events-none absolute z-30 bg-[#111113]/95 backdrop-blur-md border border-cyan-500/40 rounded-lg p-3 shadow-2xl min-w-[240px]"
          style={{
            left: Math.min(window.innerWidth - 280, hoveredNode.screenX + 16),
            top: Math.max(16, hoveredNode.screenY - 20),
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-bold text-white truncate">{hoveredNode.node.label}</span>
            <span
              className="px-1.5 py-0.5 text-[10px] font-mono rounded uppercase font-semibold"
              style={{
                backgroundColor: `${CHAIN_PLANES[hoveredNode.node.chain].color}22`,
                color: CHAIN_PLANES[hoveredNode.node.chain].color,
              }}
            >
              {hoveredNode.node.chain}
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mb-2">
            {hoveredNode.node.address.slice(0, 14)}...{hoveredNode.node.address.slice(-8)}
          </div>
          {hoveredNode.node.dataSource === 'live_onchain' || hoveredNode.node.notes?.includes('[Live On-Chain') ? (
            <div className="mb-2 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-mono text-emerald-300 font-bold flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{state.language === 'fr' ? 'On-Chain Réel Vérifié' : 'Verified Live On-Chain'}</span>
            </div>
          ) : (
            <div className="mb-2 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-[9px] font-mono text-amber-300 font-bold flex items-center gap-1.5 uppercase tracking-wide">
              <span>▲</span>
              <span>{state.language === 'fr' ? 'Modèle Heuristique (Simulé)' : 'Heuristic Model (Simulated)'}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-white/10 pt-2">
            <div>
              <div className="text-slate-400">VOLUME</div>
              <div className="text-emerald-400 font-semibold">
                ${hoveredNode.node.volumeUsd.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-slate-400">CRIME TAINT</div>
              <div
                className={`font-semibold ${
                  hoveredNode.node.taintScore >= 70
                    ? 'text-rose-400'
                    : hoveredNode.node.taintScore >= 40
                    ? 'text-amber-400'
                    : 'text-cyan-400'
                }`}
              >
                {hoveredNode.node.taintScore}% RISK
              </div>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-white/10 text-[10px] font-mono text-[#D4A359] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359] animate-ping" />
            <span>
              {state.language === 'fr'
                ? 'Clic : Inspecter • Double-clic : Étendre / Réduire (+1 Hop)'
                : 'Click: Inspect • Double-click: Expand / Collapse (+1 Hop)'}
            </span>
          </div>
        </div>
      )}

      {/* Blank Custom Investigation Workspace Launchpad Overlay */}
      {state.nodes.length === 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6 pointer-events-none">
          <div className="pointer-events-auto w-full max-w-lg bg-[#111113]/95 backdrop-blur-xl border border-[#D4A359]/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.85)] space-y-4 font-mono">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-xl bg-[#18181B] border border-[#D4A359]/40 shadow-[0_0_20px_rgba(212,163,89,0.2)] shrink-0">
                <ArgusOrbitalLogo size={48} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {t.blankWorkspace.title}
                  </h3>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#D4A359]/20 text-[#D4A359] border border-[#D4A359]/30 rounded">
                    {t.blankWorkspace.badge}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  {t.blankWorkspace.description}
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                state.executeSearchOrLiveLookup();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={state.searchQuery}
                  onChange={(e) => state.setSearchQuery(e.target.value)}
                  placeholder={t.blankWorkspace.inputPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#09090B] border border-white/15 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4A359]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#D4A359]/25 hover:bg-[#D4A359]/35 text-[#D4A359] border border-[#D4A359]/50 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.blankWorkspace.buildBtn}</span>
              </button>
            </form>

            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] text-zinc-400 uppercase">
                {t.blankWorkspace.quickStartTitle}
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <button
                  onClick={() =>
                    state.startFreshGraphFromAddressOrTx('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
                  }
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-[#D4A359]/20 border border-white/10 hover:border-[#D4A359]/40 text-[#D4A359] transition"
                >
                  {t.blankWorkspace.btnVitalik}
                </button>
                <button
                  onClick={() =>
                    state.startFreshGraphFromAddressOrTx('0x28C6c06298d514Db089934071355E5743bf21d60')
                  }
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-[#D4A359]/20 border border-white/10 hover:border-[#D4A359]/40 text-amber-300 transition"
                >
                  {t.blankWorkspace.btnBinance}
                </button>
                <button
                  onClick={() =>
                    state.startFreshGraphFromAddressOrTx('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')
                  }
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-[#D4A359]/20 border border-white/10 hover:border-[#D4A359]/40 text-orange-300 transition"
                >
                  {t.blankWorkspace.btnBtcWhale}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

