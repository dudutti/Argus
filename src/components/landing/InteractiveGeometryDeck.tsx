import React, { useEffect, useRef, useState } from 'react';
import { PolyhedronArchetype } from '../../data/landingContent';
import { Cpu, Eye, ShieldAlert } from 'lucide-react';

interface InteractiveGeometryDeckProps {
  archetypes: PolyhedronArchetype[];
  isFr: boolean;
}

export const InteractiveGeometryDeck: React.FC<InteractiveGeometryDeckProps> = ({
  archetypes,
  isFr,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const active = archetypes[activeIdx] || archetypes[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;

    // 3D projection helper for crisp turntable polyhedra
    const project3D = (
      x: number,
      y: number,
      z: number,
      rotX: number,
      rotY: number,
      cx: number,
      cy: number,
      scale: number
    ) => {
      // Rotate Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      // Rotate X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const fov = 260 / (260 + z2);
      return {
        x: cx + x1 * scale * fov,
        y: cy + y2 * scale * fov,
        z: z2,
      };
    };

    const renderTurntable = (now: number) => {
      animId = requestAnimationFrame(renderTurntable);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.5;
      const t = now * 0.001;

      // Subtle HUD crosshair & telemetry dial
      ctx.strokeStyle = 'rgba(212, 163, 89, 0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.36, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([3, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.43, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Glow behind active solid
      const glow = ctx.createRadialGradient(cx, cy, 8, cx, cy, 98);
      glow.addColorStop(0, active.colorHex + '55');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, 98, 0, Math.PI * 2);
      ctx.fill();

      // Build vertices & edges based on archetype
      let verts: Array<[number, number, number]> = [];
      let edges: Array<[number, number]> = [];

      if (active.id === 'exploiter') {
        // Icosahedron
        const phi = (1 + Math.sqrt(5)) / 2;
        verts = [
          [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
          [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
          [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
        ];
        for (let i = 0; i < verts.length; i++) {
          for (let j = i + 1; j < verts.length; j++) {
            const dx = verts[i][0] - verts[j][0];
            const dy = verts[i][1] - verts[j][1];
            const dz = verts[i][2] - verts[j][2];
            const d = Math.hypot(dx, dy, dz);
            if (d > 1.9 && d < 2.1) edges.push([i, j]);
          }
        }
      } else if (active.id === 'bridge') {
        // Octahedron + vertical piercing laser beam
        verts = [
          [1.6, 0, 0], [-1.6, 0, 0],
          [0, 1.85, 0], [0, -1.85, 0],
          [0, 0, 1.6], [0, 0, -1.6],
        ];
        edges = [
          [2, 0], [2, 1], [2, 4], [2, 5],
          [3, 0], [3, 1], [3, 4], [3, 5],
          [0, 4], [4, 1], [1, 5], [5, 0],
        ];
        // Vertical stratum laser beam
        const beamGrad = ctx.createLinearGradient(cx, 12, cx, h - 12);
        beamGrad.addColorStop(0, 'transparent');
        beamGrad.addColorStop(0.5, active.colorHex + 'AA');
        beamGrad.addColorStop(1, 'transparent');
        ctx.strokeStyle = beamGrad;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, 12);
        ctx.lineTo(cx, h - 12);
        ctx.stroke();
      } else if (active.id === 'cex') {
        // Monolithic Gold Cube
        verts = [
          [-1.2, -1.2, -1.2], [1.2, -1.2, -1.2], [1.2, 1.2, -1.2], [-1.2, 1.2, -1.2],
          [-1.2, -1.2, 1.2], [1.2, -1.2, 1.2], [1.2, 1.2, 1.2], [-1.2, 1.2, 1.2],
        ];
        edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ];
      } else if (active.id === 'dex') {
        // Hexagonal Prism
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2;
          verts.push([Math.cos(a) * 1.45, -1.05, Math.sin(a) * 1.45]);
        }
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2;
          verts.push([Math.cos(a) * 1.45, 1.05, Math.sin(a) * 1.45]);
        }
        for (let k = 0; k < 6; k++) {
          edges.push([k, (k + 1) % 6]);
          edges.push([k + 6, ((k + 1) % 6) + 6]);
          edges.push([k, k + 6]);
        }
      } else {
        // Mixer Singularity or EOA Geodesic Sphere
        const latSteps = 5;
        const lonSteps = 10;
        for (let i = 0; i <= latSteps; i++) {
          const lat = (i / latSteps - 0.5) * Math.PI;
          for (let j = 0; j < lonSteps; j++) {
            const lon = (j / lonSteps) * Math.PI * 2;
            const r = active.id === 'mixer' ? 1.25 : 1.45;
            verts.push([
              Math.cos(lat) * Math.cos(lon) * r,
              Math.sin(lat) * r,
              Math.cos(lat) * Math.sin(lon) * r,
            ]);
            const curr = i * lonSteps + j;
            const nextLon = i * lonSteps + ((j + 1) % lonSteps);
            edges.push([curr, nextLon]);
            if (i < latSteps) edges.push([curr, curr + lonSteps]);
          }
        }
      }

      const rotY = t * 0.75;
      const rotX = 0.42 + Math.sin(t * 0.6) * 0.18;
      const scale = Math.min(w, h) * 0.17;

      const projected = verts.map(([x, y, z]) =>
        project3D(x, y, z, rotX, rotY, cx, cy, scale)
      );

      // Draw edges
      ctx.lineWidth = 1.6;
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        if (!p1 || !p2) return;
        const depthAlpha = Math.min(0.95, Math.max(0.2, 0.6 - (p1.z + p2.z) * 0.12));
        ctx.strokeStyle = active.colorHex;
        ctx.globalAlpha = depthAlpha;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // Extra orbital accretion disk for Mixer or warning ring for Exploiter
      if (active.id === 'mixer' || active.id === 'exploiter') {
        const ringCount = active.id === 'mixer' ? 42 : 24;
        for (let p = 0; p < ringCount; p++) {
          const ang = (p / ringCount) * Math.PI * 2 + t * (active.id === 'mixer' ? -1.4 : 1.1);
          const rad = active.id === 'mixer' ? 2.3 + (p % 3) * 0.22 : 2.25;
          const pt = project3D(
            Math.cos(ang) * rad,
            Math.sin(ang * 2) * 0.12,
            Math.sin(ang) * rad,
            0.55,
            rotY * 0.5,
            cx,
            cy,
            scale
          );
          ctx.fillStyle = active.id === 'mixer' ? '#C4B5FD' : '#E04F33';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, active.id === 'mixer' ? 2.1 : 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw vertices pips
      projected.forEach((p) => {
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      ctx.restore();
    };

    animId = requestAnimationFrame(renderTurntable);
    return () => cancelAnimationFrame(animId);
  }, [active]);

  if (!active) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Selector Grid (6 Archetypes) */}
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {archetypes.map((arch, idx) => {
          const selected = idx === activeIdx;
          return (
            <button
              key={arch.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              onMouseEnter={() => setActiveIdx(idx)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                selected
                  ? 'bg-[#15161B] border-[#D4A359]/70 shadow-[0_0_28px_rgba(212,163,89,0.14)]'
                  : 'bg-[#0D0E12]/75 border-white/10 hover:border-white/25'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5 font-mono text-[10px]">
                <span style={{ color: arch.colorHex }} className="font-bold tracking-wider">
                  {arch.code}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">
                  ⚡ {arch.recognitionMs}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">{arch.name}</h4>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {arch.roleSummary}
              </p>
            </button>
          );
        })}
      </div>

      {/* Right Optical Turntable Inspector */}
      <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0D0E12]/90 backdrop-blur-md p-5 flex flex-col justify-between shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between text-[11px] font-mono border-b border-white/10 pb-3">
          <span className="text-[#D4A359] flex items-center gap-1.5 font-bold">
            <Eye className="w-3.5 h-3.5" />
            <span>{isFr ? 'CHAMBRE OPTIQUE 3D' : '3D OPTICAL TURNTABLE'}</span>
          </span>
          <span className="text-zinc-400">
            {isFr ? 'LATENCE CORTEX :' : 'CORTEX LATENCY:'}{' '}
            <b className="text-white">{active.recognitionMs}</b>
          </span>
        </div>

        <div className="relative h-56 my-2 w-full">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        <div className="space-y-2.5 border-t border-white/10 pt-3 text-xs">
          <div className="font-mono text-[11px] text-zinc-300 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#D4A359] shrink-0" />
            <span className="truncate">{active.geometry}</span>
          </div>
          <p className="text-zinc-400 leading-relaxed">{active.forensicSignature}</p>
          <div className="px-3 py-2 rounded-lg bg-[#09090B] border border-white/10 font-mono text-[11px] text-zinc-300 flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" style={{ color: active.colorHex }} />
            <span className="truncate">{active.realExample}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

