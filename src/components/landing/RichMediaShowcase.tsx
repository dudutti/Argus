import React, { useEffect, useRef, useState } from 'react';
import {
  EditorialArticleItem,
  GalleryVisualItem,
  LandingLocaleContent,
  MediaReelItem,
} from '../../data/landingContent';
import { CaseGranularity } from '../../services/archiveService';
import {
  ArrowUpRight,
  BookOpen,
  Database,
  Expand,
  Film,
  Layers,
  Pause,
  Play,
  Sparkles,
  X,
} from 'lucide-react';

interface RichMediaShowcaseProps {
  content: LandingLocaleContent['act5'];
  isFr: boolean;
  onLaunchCase: (caseId: string, granularity: CaseGranularity) => void;
}

export const RichMediaShowcase: React.FC<RichMediaShowcaseProps> = ({
  content,
  isFr,
  onLaunchCase,
}) => {
  const [activeReelIdx, setActiveReelIdx] = useState(0);
  const [isPlayingReel, setIsPlayingReel] = useState(true);
  const [reelProgress, setReelProgress] = useState(0);
  const [lightboxItem, setLightboxItem] = useState<GalleryVisualItem | null>(null);
  const [activeArticle, setActiveArticle] = useState<EditorialArticleItem | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeReel: MediaReelItem = content.reels[activeReelIdx] || content.reels[0];

  // Live 60 FPS Cinema Procedural Canvas when no external .mp4 file is attached yet
  useEffect(() => {
    if (activeReel?.videoSrc) return;
    const canvas = canvasRef.current;
    if (!canvas || !activeReel) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let virtualClock = 0;
    let lastTs = performance.now();

    const drawCinemaSimulation = (now: number) => {
      animId = requestAnimationFrame(drawCinemaSimulation);
      const dt = Math.min(50, now - lastTs);
      lastTs = now;
      if (isPlayingReel) {
        virtualClock += dt * 0.001;
        setReelProgress(((virtualClock * 7) % 100));
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Matte Obsidian cinema backdrop
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 10, w * 0.5, h * 0.5, w * 0.65);
      grad.addColorStop(0, '#151419');
      grad.addColorStop(1, '#08090C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const t = virtualClock;

      if (activeReel.simulationMode === 'z_strata_burst') {
        // 4 Rotating Z-Strata + vertical piercing cross-chain laser beams
        const planes = [
          { name: 'SOLANA // +240', y: h * 0.2, col: '#4E9F76' },
          { name: 'ARBITRUM // +120', y: h * 0.4, col: '#38BDF8' },
          { name: 'ETHEREUM // 0', y: h * 0.6, col: '#D4A359' },
          { name: 'BITCOIN // -120', y: h * 0.8, col: '#F59E0B' },
        ];

        planes.forEach((pl, pIdx) => {
          ctx.strokeStyle = pl.col + '55';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(w * 0.5, pl.y, w * 0.36, 26, 0, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = pl.col;
          ctx.font = '700 10px "JetBrains Mono", monospace';
          ctx.fillText(pl.name, 22, pl.y + 4);

          // Orbiting nodes on each stratum
          for (let k = 0; k < 7; k++) {
            const ang = t * (0.45 + pIdx * 0.1) + (k / 7) * Math.PI * 2;
            const nx = w * 0.5 + Math.cos(ang) * (w * 0.28);
            const ny = pl.y + Math.sin(ang) * 20;
            ctx.fillStyle = k === 0 ? '#E04F33' : pl.col;
            ctx.beginPath();
            ctx.arc(nx, ny, k === 0 ? 5.2 : 3.2, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Vertical Cross-Chain Bridge Beams
        [0.36, 0.52, 0.66].forEach((rx, bIdx) => {
          const bx = w * rx + Math.sin(t + bIdx) * 18;
          const beam = ctx.createLinearGradient(bx, h * 0.2, bx, h * 0.8);
          beam.addColorStop(0, '#4E9F76');
          beam.addColorStop(0.5, '#D4A359');
          beam.addColorStop(1, '#E04F33');
          ctx.strokeStyle = beam;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(bx, h * 0.2);
          ctx.lineTo(bx, h * 0.8);
          ctx.stroke();

          const py = h * 0.2 + (((t * 0.65 + bIdx * 0.33) % 1) * (h * 0.6));
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(bx, py, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (activeReel.simulationMode === 'taint_entropy_wave') {
        // 30 Fanned parallel 100 ETH Tornado Cash arcs + exit clustering
        const origin = { x: w * 0.16, y: h * 0.52 };
        const mixer = { x: w * 0.52, y: h * 0.52 };
        const exits = [
          { x: w * 0.84, y: h * 0.26, score: '91%' },
          { x: w * 0.86, y: h * 0.52, score: '84%' },
          { x: w * 0.84, y: h * 0.78, score: '76%' },
        ];

        for (let i = -8; i <= 8; i++) {
          const cy = h * 0.52 + i * 13;
          const cx = w * 0.34;
          ctx.strokeStyle = 'rgba(224, 79, 51, 0.36)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(origin.x, origin.y);
          ctx.quadraticCurveTo(cx, cy, mixer.x, mixer.y);
          ctx.stroke();

          const u = (t * 0.48 + (i + 8) * 0.06) % 1;
          const inv = 1 - u;
          const px = inv * inv * origin.x + 2 * inv * u * cx + u * u * mixer.x;
          const py = inv * inv * origin.y + 2 * inv * u * cy + u * u * mixer.y;
          ctx.fillStyle = '#E04F33';
          ctx.beginPath();
          ctx.arc(px, py, 2.3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Dashed probabilistic post-mixer links
        exits.forEach((ex, idx) => {
          ctx.save();
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = '#9D7CD8';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(mixer.x, mixer.y);
          ctx.lineTo(ex.x, ex.y);
          ctx.stroke();
          ctx.restore();

          ctx.fillStyle = '#D4A359';
          ctx.beginPath();
          ctx.rect(ex.x - 6, ex.y - 6, 12, 12);
          ctx.fill();
          ctx.font = '700 10px "JetBrains Mono", monospace';
          ctx.fillStyle = '#F4F4F6';
          ctx.fillText(`EXIT_0${idx + 1} // TAINT ${ex.score}`, ex.x - 95, ex.y - 12);
        });

        // Origin & Mixer Singularity
        ctx.fillStyle = '#E04F33';
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#9D7CD8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(mixer.x, mixer.y, 22 + Math.sin(t * 3) * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#09090B';
        ctx.beginPath();
        ctx.arc(mixer.x, mixer.y, 14, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Bybit 420-TX Radial Burst Constellation
        const cx = w * 0.5;
        const cy = h * 0.52;
        const branches = 28;
        const reveal = 0.25 + ((t * 0.18) % 0.75);

        for (let b = 0; b < branches; b++) {
          const ang = (b / branches) * Math.PI * 2 + t * 0.06;
          const r1 = Math.min(w, h) * 0.18;
          const r2 = Math.min(w, h) * 0.37;
          const x1 = cx + Math.cos(ang) * r1;
          const y1 = cy + Math.sin(ang) * r1 * 0.76;
          const x2 = cx + Math.cos(ang + 0.18) * r2;
          const y2 = cy + Math.sin(ang + 0.18) * r2 * 0.76;

          ctx.strokeStyle = b % 4 === 0 ? 'rgba(212,163,89,0.45)' : 'rgba(224,79,51,0.35)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x1, y1);
          if (reveal > 0.45) ctx.lineTo(x2, y2);
          ctx.stroke();

          ctx.fillStyle = b % 4 === 0 ? '#38BDF8' : '#E04F33';
          ctx.beginPath();
          ctx.arc(x1, y1, 3.2, 0, Math.PI * 2);
          ctx.fill();

          if (reveal > 0.45) {
            ctx.fillStyle = b % 5 === 0 ? '#D4A359' : '#4E9F76';
            ctx.beginPath();
            ctx.arc(x2, y2, 2.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.fillStyle = '#E04F33';
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cinema HUD Telemetry Overlay
      ctx.fillStyle = 'rgba(212, 163, 89, 0.85)';
      ctx.font = '700 10px "JetBrains Mono", monospace';
      ctx.fillText(
        `ARGUS LIVE RENDER // ${activeReel.code} // 60.0 FPS`,
        18,
        24
      );
      ctx.restore();
    };

    animId = requestAnimationFrame(drawCinemaSimulation);
    return () => cancelAnimationFrame(animId);
  }, [activeReel, isPlayingReel]);

  return (
    <div className="space-y-16">
      {/* 01 // CINEMA REEL SHOWCASE */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <h3 className="font-mono text-xs tracking-widest text-[#D4A359] font-bold flex items-center gap-2">
            <Film className="w-4 h-4" />
            <span>{content.reelsHeading}</span>
          </h3>
          <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-zinc-400">
            {content.studioReadyBadge}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Main Cinema Stage */}
          <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#0B0C10] overflow-hidden flex flex-col shadow-[0_28px_80px_rgba(0,0,0,0.7)]">
            <div className="relative h-[320px] sm:h-[380px] w-full bg-[#08090C]">
              {activeReel.videoSrc ? (
                <video
                  ref={videoRef}
                  src={activeReel.videoSrc}
                  poster={activeReel.posterSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <canvas ref={canvasRef} className="w-full h-full block" />
              )}

              {/* Bottom Player Bar */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/55 to-transparent flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (activeReel.videoSrc && videoRef.current) {
                      if (videoRef.current.paused) {
                        videoRef.current.play();
                        setIsPlayingReel(true);
                      } else {
                        videoRef.current.pause();
                        setIsPlayingReel(false);
                      }
                    } else {
                      setIsPlayingReel((p) => !p);
                    }
                  }}
                  className="w-9 h-9 rounded-lg bg-[#D4A359]/20 hover:bg-[#D4A359]/35 border border-[#D4A359]/50 text-[#D4A359] flex items-center justify-center transition"
                >
                  {isPlayingReel ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <div className="flex-1">
                  <div className="flex justify-between font-mono text-[10px] text-zinc-300 mb-1">
                    <span className="truncate font-bold">{activeReel.title}</span>
                    <span>{activeReel.duration}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/15 overflow-hidden">
                    <div
                      className="h-full bg-[#D4A359] transition-all duration-150"
                      style={{ width: `${reelProgress}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onLaunchCase(activeReel.linkedCaseId, 'full_ledger')}
                  className="px-3 py-1.5 rounded-lg bg-[#E04F33]/20 hover:bg-[#E04F33]/35 border border-[#E04F33]/50 text-[#E04F33] font-mono text-[11px] font-bold flex items-center gap-1 transition"
                >
                  <span>{isFr ? 'Ouvrir en Live 3D' : 'Open Live 3D'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-[#0E0F14] flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                {activeReel.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeReel.tags.map((tg) => (
                  <span
                    key={tg}
                    className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-zinc-300"
                  >
                    {tg}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Playlist Selector */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {content.reels.map((reel, idx) => {
              const selected = idx === activeReelIdx;
              return (
                <button
                  key={reel.id}
                  type="button"
                  onClick={() => {
                    setActiveReelIdx(idx);
                    setIsPlayingReel(true);
                  }}
                  className={`flex-1 text-left p-4 rounded-xl border transition-all ${
                    selected
                      ? 'bg-[#15161D] border-[#D4A359]/70 shadow-[0_0_25px_rgba(212,163,89,0.15)]'
                      : 'bg-[#0D0E12]/80 border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] mb-1.5">
                    <span className="text-[#D4A359] font-bold">{reel.code}</span>
                    <span className="text-zinc-500">{reel.duration}</span>
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">{reel.title}</div>
                  <p className="text-xs text-zinc-400 line-clamp-2">{reel.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 02 // 5 VERIFIED ON-CHAIN ARCHIVES */}
      <div>
        <div className="mb-5">
          <h3 className="font-mono text-xs tracking-widest text-[#D4A359] font-bold flex items-center gap-2 mb-1">
            <Database className="w-4 h-4" />
            <span>{content.archivesHeading}</span>
          </h3>
          <p className="text-xs text-zinc-400">{content.archivesSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {content.archives.map((arch) => (
            <div
              key={arch.caseId}
              className="rounded-2xl border border-white/10 bg-[#0D0E12]/90 hover:border-[#D4A359]/45 transition p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] mb-2">
                  <span className="text-zinc-400">{arch.year}</span>
                  <span className="px-2 py-0.5 rounded bg-[#E04F33]/15 border border-[#E04F33]/40 text-[#E04F33] font-bold">
                    {arch.amount}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">{arch.title}</h4>
                <div className="font-mono text-[11px] text-[#D4A359] mb-2.5 truncate">
                  {arch.attacker}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{arch.summary}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1 text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    100% ON-CHAIN
                  </span>
                  <span>{arch.chains.join(' · ')}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => onLaunchCase(arch.caseId, 'tactical')}
                    className="px-2.5 py-2 rounded-lg bg-[#16181F] hover:bg-[#D4A359]/20 border border-white/10 hover:border-[#D4A359]/50 text-zinc-200 hover:text-[#D4A359] transition flex items-center justify-center gap-1"
                  >
                    <Layers className="w-3 h-3" />
                    <span>
                      {content.openTacticalBtn} ({arch.tacticalTxs})
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onLaunchCase(arch.caseId, 'full_ledger')}
                    className="px-2.5 py-2 rounded-lg bg-[#E04F33]/15 hover:bg-[#E04F33]/30 border border-[#E04F33]/40 text-red-200 font-semibold transition flex items-center justify-center gap-1"
                  >
                    <Database className="w-3 h-3" />
                    <span>
                      Full ({arch.fullTxs} TXs)
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 03 // HD VISUAL GALLERY (LIGHTBOX) */}
      <div>
        <div className="mb-5">
          <h3 className="font-mono text-xs tracking-widest text-[#D4A359] font-bold flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{content.galleryHeading}</span>
          </h3>
          <p className="text-xs text-zinc-400">{content.gallerySub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.gallery.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxItem(item)}
              className="group text-left rounded-2xl border border-white/10 bg-[#0D0E12]/90 overflow-hidden hover:border-[#D4A359]/60 transition"
            >
              <div className="relative aspect-square overflow-hidden bg-black">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/70 border border-white/15 flex items-center justify-center text-zinc-300 group-hover:text-[#D4A359] transition">
                  <Expand className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="p-4">
                <div className="font-mono text-[10px] text-[#D4A359] mb-1">{item.code}</div>
                <div className="text-sm font-semibold text-white mb-1">{item.title}</div>
                <p className="text-xs text-zinc-400 line-clamp-2">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 04 // EDITORIAL RESEARCH CHRONICLES */}
      <div>
        <div className="mb-5">
          <h3 className="font-mono text-xs tracking-widest text-[#D4A359] font-bold flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>{content.editorialHeading}</span>
          </h3>
          <p className="text-xs text-zinc-400">{content.editorialSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {content.articles.map((art) => (
            <article
              key={art.id}
              className="rounded-2xl border border-white/10 bg-[#0D0E12]/90 p-5 flex flex-col justify-between hover:border-white/25 transition"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 mb-2">
                  <span className="text-[#D4A359] font-bold">{art.code}</span>
                  <span>{art.readTime}</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2 leading-snug">{art.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{art.excerpt}</p>
              </div>

              <button
                type="button"
                onClick={() => setActiveArticle(art)}
                className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-[#D4A359]/20 border border-white/10 hover:border-[#D4A359]/40 font-mono text-xs text-zinc-200 hover:text-[#D4A359] transition flex items-center justify-between"
              >
                <span>{content.readArticleBtn}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full rounded-2xl border border-[#D4A359]/40 bg-[#0D0E12] overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 font-mono text-xs">
              <span className="text-[#D4A359] font-bold">
                {lightboxItem.code} — {lightboxItem.title}
              </span>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-black flex items-center justify-center max-h-[68vh] overflow-hidden">
              <img
                src={lightboxItem.imageSrc}
                alt={lightboxItem.title}
                className="max-h-[68vh] w-auto object-contain"
              />
            </div>
            <div className="p-5 space-y-1.5">
              <p className="text-sm text-zinc-200">{lightboxItem.caption}</p>
              <p className="font-mono text-[11px] text-zinc-500">{lightboxItem.specs}</p>
            </div>
          </div>
        </div>
      )}

      {/* EDITORIAL ARTICLE DRAWER MODAL */}
      {activeArticle && (
        <div
          onClick={() => setActiveArticle(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full max-h-[86vh] overflow-y-auto rounded-2xl border border-[#D4A359]/40 bg-[#0D0E12] p-6 sm:p-8 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between font-mono text-xs border-b border-white/10 pb-3">
              <span className="text-[#D4A359] font-bold">
                {activeArticle.code} · {activeArticle.category} ({activeArticle.readTime})
              </span>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {activeArticle.title}
            </h3>

            <div className="p-4 rounded-xl bg-[#14151C] border border-[#D4A359]/25 space-y-2">
              <div className="font-mono text-[10px] text-[#D4A359] font-bold">
                {isFr ? 'POINTS CLÉS À RETENIR' : 'KEY ARCHITECTURAL TAKEAWAYS'}
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {activeArticle.keyTakeaways.map((kt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#D4A359] font-bold">▸</span>
                    <span>{kt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
              {activeArticle.bodyParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {activeArticle.linkedCaseId && (
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const targetCase = activeArticle.linkedCaseId!;
                    setActiveArticle(null);
                    onLaunchCase(targetCase, 'full_ledger');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#D4A359] hover:bg-[#e3b56b] text-black font-mono text-xs font-bold flex items-center gap-2 transition"
                >
                  <span>
                    {isFr
                      ? 'Inspecter ce dossier dans la Console 3D'
                      : 'Inspect this archive in the 3D Console'}
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

