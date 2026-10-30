import React, { useEffect, useRef, useState } from 'react';
import { GripVertical } from 'lucide-react';

interface HexVsSpatialSliderProps {
  title: string;
  hint: string;
  leftBadge: string;
  rightBadge: string;
}

const RAW_HEX_ROWS = [
  { hash: '0xb61413c495f...81a9', block: '21897042', method: '0x6a761202', from: '0x1db92e2eeBc8E0c075a02BeA49a2935BcD2dFCF4', to: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503', val: '401,347.00 ETH', note: 'EXEC_TX' },
  { hash: '0x99f2a01b72e...02c1', block: '21897044', method: '0xa9059cbb', from: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503', to: '0x0000000047ac0f9918273645123890abCDeF5031', val: '0.000000 ETH', note: 'POISON_DUST' },
  { hash: '0x4c81e9012fd...44f0', block: '21897045', method: '0x095ea7b3', from: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503', to: '0xdd90E215149296116bA9a8000574f4c8900bB318', val: '10,000.00 ETH', note: 'SPLIT_01' },
  { hash: '0x71ab884e01c...90d3', block: '21897045', method: '0x3593564c', from: '0xdd90E215149296116bA9a8000574f4c8900bB318', to: '0xE592427A0AEce92De3Edee1F18E0157C05861564', val: '42,190.40 stETH', note: 'SWAP_DEX' },
  { hash: '0x18fe7220a99...77b8', block: '21897046', method: '0xa9059cbb', from: '0x000099112233445566778899aabbccddeeffD503', to: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503', val: '0.000001 USDT', note: 'FAKE_TOKEN' },
  { hash: '0x52dc018ab3e...19e4', block: '21897047', method: '0xb214faa5', from: '0xa4B21980E3211aBc902187FE120984AbCd901122', to: '0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b', val: '100.00 ETH', note: 'MIX_DEPOSIT' },
  { hash: '0x63ef912bc7d...81c2', block: '21897047', method: '0xb214faa5', from: '0xa4B21980E3211aBc902187FE120984AbCd901122', to: '0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b', val: '100.00 ETH', note: 'MIX_DEPOSIT' },
  { hash: '0x84aa102ce9f...55a9', block: '21897048', method: '0xb214faa5', from: '0xa4B21980E3211aBc902187FE120984AbCd901122', to: '0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b', val: '100.00 ETH', note: 'MIX_DEPOSIT' },
  { hash: '0xc0192837465...11d0', block: '21897051', method: '0x44bc937b', from: '0x8821B9012fE7812390bc1298734Ab91823746123', to: '0xD37BbE5744D730a1d98d8DC97c42F0Ca46aD7146', val: '4,850.00 ETH', note: 'THOR_BRIDGE' },
  { hash: '0xe771829301a...63b7', block: '21897053', method: '0x00000000', from: 'bc1q9x301la9028374651928374650192837465xyz', to: 'bc1qcex7718293048172635490182736450918273a', val: '181.40 BTC', note: 'UTXO_HOP' },
  { hash: '0xf1928374650...98e1', block: '21897056', method: '0xa9059cbb', from: '0x11223344556677889900aabbccddeeff11223344', to: '0x28C6c06298d514Db089934071355E5743bf21d60', val: '1,250.00 ETH', note: 'CEX_DEPOSIT' },
];

export const HexVsSpatialSlider: React.FC<HexVsSpatialSliderProps> = ({
  title,
  hint,
  leftBadge,
  rightBadge,
}) => {
  const [splitPct, setSplitPct] = useState(46);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / Math.max(1, rect.width)) * 100;
    setSplitPct(Math.min(92, Math.max(8, pct)));
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: PointerEvent) => updateFromClientX(e.clientX);
    const onUp = () => setIsDragging(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isDragging]);

  // Animated 60 FPS Spatial Diagram on Right Side
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;

    const renderFrame = (now: number) => {
      animId = requestAnimationFrame(renderFrame);
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

      // Deep Obsidian background + radial brass glow
      const bgGrad = ctx.createRadialGradient(w * 0.55, h * 0.48, 20, w * 0.55, h * 0.48, w * 0.65);
      bgGrad.addColorStop(0, '#161412');
      bgGrad.addColorStop(1, '#09090B');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const t = now * 0.001;

      // Draw 3 Isometric Z-Stratum Planes (ARB, ETH, BTC)
      const strata = [
        { label: 'ARB // Y = +120', y: h * 0.22, color: 'rgba(56, 189, 248, 0.22)' },
        { label: 'ETH // Y = 0 (EQUATOR)', y: h * 0.50, color: 'rgba(212, 163, 89, 0.28)' },
        { label: 'BTC // Y = -120', y: h * 0.80, color: 'rgba(245, 158, 11, 0.24)' },
      ];

      strata.forEach((st) => {
        ctx.save();
        ctx.strokeStyle = st.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(w * 0.54, st.y, w * 0.4, 34, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(230,230,234,0.55)';
        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.fillText(st.label, w * 0.82 - 55, st.y - 22);
        ctx.restore();
      });

      // Key Spatial Nodes
      const nExploiter = { x: w * 0.2, y: h * 0.5, label: 'BYBIT EXPLOITER', sub: 'TAINT 100%', color: '#E04F33' };
      const nDex = { x: w * 0.42, y: h * 0.44, label: 'UNISWAP / CURVE', sub: 'stETH SWAP', color: '#38BDF8' };
      const nMixer = { x: w * 0.58, y: h * 0.55, label: 'TORNADO 100 ETH x30', sub: 'FANNED BATCH', color: '#9D7CD8' };
      const nBridgeEth = { x: w * 0.64, y: h * 0.47, label: 'THORCHAIN ROUTER', sub: 'CROSS-CHAIN', color: '#7C93A8' };
      const nBtcVault = { x: w * 0.64, y: h * 0.8, label: 'BTC NATIVE UTXO', sub: '181.4 BTC', color: '#F59E0B' };
      const nCex = { x: w * 0.84, y: h * 0.78, label: 'CEX OFF-RAMP', sub: 'FREEZE ALERT', color: '#D4A359' };
      const nArbHop = { x: w * 0.48, y: h * 0.22, label: 'ARB L2 RELAY', sub: 'FAST SPLIT', color: '#38BDF8' };

      const drawCurvedStream = (
        a: { x: number; y: number },
        b: { x: number; y: number },
        ctrlOffsetY: number,
        stroke: string,
        particles: number,
        dashed = false
      ) => {
        const cx = (a.x + b.x) * 0.5;
        const cy = (a.y + b.y) * 0.5 + ctrlOffsetY;

        ctx.save();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.5;
        if (dashed) ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(cx, cy, b.x, b.y);
        ctx.stroke();
        ctx.restore();

        for (let i = 0; i < particles; i++) {
          const u = (t * 0.45 + i / particles) % 1;
          const inv = 1 - u;
          const px = inv * inv * a.x + 2 * inv * u * cx + u * u * b.x;
          const py = inv * inv * a.y + 2 * inv * u * cy + u * u * b.y;
          ctx.beginPath();
          ctx.fillStyle = stroke;
          ctx.arc(px, py, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      // Fanned parallel batch streams into Mixer (illustrating Option C fanning!)
      [-26, -13, 0, 13, 26].forEach((offset) => {
        drawCurvedStream(nExploiter, nMixer, offset - 12, 'rgba(224,79,51,0.55)', 1);
      });

      drawCurvedStream(nExploiter, nDex, -28, '#38BDF8', 2);
      drawCurvedStream(nDex, nArbHop, -18, '#38BDF8', 2);
      drawCurvedStream(nDex, nBridgeEth, -14, '#D4A359', 2);
      // Vertical piercing cross-chain beam ETH -> BTC
      drawCurvedStream(nBridgeEth, nBtcVault, 0, '#E04F33', 3);
      drawCurvedStream(nBtcVault, nCex, 16, '#D4A359', 2, true);

      // Draw Nodes with crisp geometric silhouettes
      const allNodes = [nExploiter, nDex, nMixer, nBridgeEth, nBtcVault, nCex, nArbHop];
      allNodes.forEach((nd, idx) => {
        const pulse = 1 + Math.sin(t * 3 + idx) * 0.08;
        ctx.save();
        ctx.translate(nd.x, nd.y);

        // Halo
        const halo = ctx.createRadialGradient(0, 0, 2, 0, 0, 22 * pulse);
        halo.addColorStop(0, nd.color + '66');
        halo.addColorStop(1, 'transparent');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(0, 0, 22 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Core polygon
        ctx.fillStyle = nd.color;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const sides = idx === 0 ? 6 : idx === 5 ? 4 : 5;
        for (let s = 0; s < sides; s++) {
          const ang = (s / sides) * Math.PI * 2 + t * 0.5;
          const r = idx === 0 ? 10 : 7.5;
          if (s === 0) ctx.moveTo(Math.cos(ang) * r, Math.sin(ang) * r);
          else ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Tag
        ctx.font = '700 10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#F4F4F6';
        ctx.fillText(nd.label, -38, -15);
        ctx.font = '500 9px "JetBrains Mono", monospace';
        ctx.fillStyle = nd.color;
        ctx.fillText(nd.sub, -38, 22);
        ctx.restore();
      });

      ctx.restore();
    };

    animId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D0E12]/90 backdrop-blur-md overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-white/10 bg-[#111216] font-mono text-[11px]">
        <span className="text-[#D4A359] font-semibold tracking-wider">{title}</span>
        <span className="text-zinc-400">{hint}</span>
      </div>

      {/* Interactive Split Stage */}
      <div
        ref={containerRef}
        onPointerDown={(e) => {
          setIsDragging(true);
          updateFromClientX(e.clientX);
        }}
        className="relative h-[410px] sm:h-[440px] w-full select-none cursor-ew-resize overflow-hidden"
      >
        {/* Base Layer (Right Side): ARGUS 3D Spatial Projection */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded bg-emerald-950/85 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold tracking-wider pointer-events-none">
          {rightBadge}
        </div>

        {/* Clipped Foreground Layer (Left Side): Raw 2D Hex Spreadsheet */}
        <div
          style={{ clipPath: `inset(0 ${100 - splitPct}% 0 0)` }}
          className="absolute inset-0 bg-[#0B0C0E] border-r border-[#D4A359]/40 overflow-hidden"
        >
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded bg-red-950/85 border border-[#E04F33]/50 text-[#E04F33] font-mono text-[10px] font-bold tracking-wider pointer-events-none">
            {leftBadge}
          </div>

          <div className="pt-12 px-3 font-mono text-[10px] text-zinc-400 leading-relaxed overflow-hidden">
            <div className="grid grid-cols-12 gap-2 pb-1.5 mb-1.5 border-b border-white/10 text-zinc-500 font-bold">
              <span className="col-span-2">TX_HASH</span>
              <span className="col-span-1">BLOCK</span>
              <span className="col-span-2">METHOD</span>
              <span className="col-span-3">FROM_HEX_ADDRESS</span>
              <span className="col-span-2">TO_HEX_ADDRESS</span>
              <span className="col-span-2 text-right">VALUE</span>
            </div>
            {RAW_HEX_ROWS.map((r, i) => (
              <div
                key={i}
                className={`grid grid-cols-12 gap-2 py-1.5 border-b border-white/[0.04] ${
                  r.note === 'POISON_DUST' || r.note === 'FAKE_TOKEN'
                    ? 'text-zinc-600 line-through'
                    : 'text-zinc-300'
                }`}
              >
                <span className="col-span-2 truncate text-zinc-400">{r.hash}</span>
                <span className="col-span-1 text-zinc-500">{r.block}</span>
                <span className="col-span-2 text-zinc-500">{r.method}</span>
                <span className="col-span-3 truncate">{r.from}</span>
                <span className="col-span-2 truncate">{r.to}</span>
                <span className="col-span-2 text-right text-zinc-200 truncate">{r.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Optical Divider Reticle */}
        <div
          style={{ left: `${splitPct}%` }}
          className="absolute top-0 bottom-0 z-20 -translate-x-1/2 flex flex-col items-center pointer-events-none"
        >
          <div className="w-[2px] flex-1 bg-gradient-to-b from-transparent via-[#D4A359] to-transparent shadow-[0_0_16px_rgba(212,163,89,0.9)]" />
          <div className="w-9 h-9 rounded-full bg-[#111216] border-2 border-[#D4A359] shadow-[0_0_24px_rgba(212,163,89,0.65)] flex items-center justify-center text-[#D4A359]">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="w-[2px] flex-1 bg-gradient-to-b from-[#D4A359] via-[#D4A359] to-transparent shadow-[0_0_16px_rgba(212,163,89,0.9)]" />
        </div>
      </div>
    </div>
  );
};

