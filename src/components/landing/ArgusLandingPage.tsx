import React, { useEffect, useRef, useState } from 'react';
import { useForensicStore } from '../../store/useForensicStore';
import { LANDING_CONTENT } from '../../data/landingContent';
import { ArgusOrbitalLogo } from '../ArgusOrbitalLogo';
import { ArgusScrollStage3D } from './ArgusScrollStage3D';
import { HexVsSpatialSlider } from './HexVsSpatialSlider';
import { InteractiveGeometryDeck } from './InteractiveGeometryDeck';
import { InteractiveTaintLab } from './InteractiveTaintLab';
import { RichMediaShowcase } from './RichMediaShowcase';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';

const RevealBlock: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const ArgusLandingPage: React.FC = () => {
  const language = useForensicStore((s) => s.language);
  const setLanguage = useForensicStore((s) => s.setLanguage);
  const setAppSurface = useForensicStore((s) => s.setAppSurface);
  const launchCaseInWorkstation = useForensicStore((s) => s.launchCaseInWorkstation);
  const launchLiveQueryInWorkstation = useForensicStore((s) => s.launchLiveQueryInWorkstation);
  const setActiveTourStep = useForensicStore((s) => s.setActiveTourStep);

  const isFr = language === 'fr';
  const c = LANDING_CONTENT[language];

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef<number>(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [activeActIdx, setActiveActIdx] = useState(0);
  const [fps, setFps] = useState(60);
  const [activePersonaIdx, setActivePersonaIdx] = useState<number>(0);
  const [liveAddressInput, setLiveAddressInput] = useState('');

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight);
    const ratio = Math.min(1, Math.max(0, el.scrollTop / maxScroll));
    scrollProgressRef.current = ratio;
    setScrollPct(ratio * 100);

    // Highlight active chapter in top bar
    const actIds = c.topBar.acts.map((a) => a.id);
    let currentIdx = 0;
    const viewportMid = el.scrollTop + el.clientHeight * 0.36;
    actIds.forEach((id, idx) => {
      const sec = document.getElementById(id);
      if (sec && sec.offsetTop <= viewportMid) {
        currentIdx = idx;
      }
    });
    setActiveActIdx(currentIdx);
  };

  const scrollToSection = (id: string) => {
    const el = scrollContainerRef.current;
    const target = document.getElementById(id);
    if (!el || !target) return;
    el.scrollTo({ top: Math.max(0, target.offsetTop - 72), behavior: 'smooth' });
  };

  const activePersona = c.act6.personas[activePersonaIdx] || c.act6.personas[0];

  const handleLiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = liveAddressInput.trim();
    if (!trimmed) {
      setAppSurface('workstation');
      return;
    }
    await launchLiveQueryInWorkstation(trimmed);
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="relative h-screen w-screen overflow-y-auto overflow-x-hidden bg-[#09090B] text-[#E6E6EA] selection:bg-[#D4A359]/30 selection:text-amber-100"
    >
      {/* Continuous 60 FPS Scroll-Linked WebGL2 Stage */}
      <ArgusScrollStage3D scrollProgressRef={scrollProgressRef} onFpsSample={setFps} />

      {/* Subtle Vignette Gradient for crisp text contrast */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(9,9,11,0.32)_0%,rgba(9,9,11,0.86)_85%)]"
      />

      {/* Sticky Top Optical Telemetry Navigation */}
      <header className="sticky top-0 z-40 bg-[#09090B]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Brand Mark */}
          <button
            type="button"
            onClick={() => scrollToSection('act-prologue')}
            className="flex items-center gap-2.5 text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#141418] border border-[#D4A359]/35 flex items-center justify-center shadow-[0_0_18px_rgba(212,163,89,0.2)]">
              <ArgusOrbitalLogo size={30} />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-white">
                <span>ARGUS</span>
                <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-[#D4A359]/15 border border-[#D4A359]/35 text-[10px] text-[#D4A359]">
                  {c.topBar.storyBadge}
                </span>
              </div>
              <div className="font-mono text-[10px] text-zinc-400 hidden md:block">
                {c.topBar.immersionTime} · {fps} FPS WEBGL2
              </div>
            </div>
          </button>

          {/* 7-Act Chapter Scrubber Pills */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#111216]/90 border border-white/10 rounded-xl p-1 font-mono text-[10px]">
            {c.topBar.acts.map((act, idx) => {
              const active = idx === activeActIdx;
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => scrollToSection(act.id)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    active
                      ? 'bg-[#D4A359]/25 text-[#D4A359] border border-[#D4A359]/45 font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="opacity-60 mr-1">{act.num}</span>
                  <span>{act.short}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Language + Console Launch */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#111216] border border-white/10 rounded-lg p-0.5 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setLanguage('fr')}
                className={`px-2 py-1 rounded font-bold transition ${
                  isFr ? 'bg-[#D4A359]/25 text-[#D4A359]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                🇫🇷 FR
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded font-bold transition ${
                  !isFr ? 'bg-[#D4A359]/25 text-[#D4A359]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>

            <button
              type="button"
              onClick={() => setAppSurface('workstation')}
              className="px-3.5 py-2 rounded-xl bg-[#D4A359] hover:bg-[#e5b76e] text-[#09090B] font-mono text-xs font-bold tracking-wide shadow-[0_0_24px_rgba(212,163,89,0.35)] flex items-center gap-1.5 transition"
            >
              <span>{c.topBar.launchConsoleCta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Continuous Scroll Telemetry Filament */}
        <div className="h-[2px] w-full bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#D4A359] via-[#E04F33] to-[#D4A359] transition-all duration-100"
            style={{ width: `${scrollPct}%` }}
          />
        </div>
      </header>

      {/* MAIN SCROLLYTELLING CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* ============================================================
            PROLOGUE // HERO MONUMENTAL ENTRANCE
        ============================================================ */}
        <section
          id="act-prologue"
          className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-12 sm:py-20"
        >
          <div className="max-w-4xl">
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-[#131419]/90 border border-[#D4A359]/35 font-mono text-[11px] text-[#D4A359] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#E04F33] animate-pulse" />
              <span>{c.hero.eyebrow}</span>
            </div>

            <div className="font-mono text-xs tracking-[0.2em] text-zinc-400 mb-3">
              {c.hero.mythologyTag}
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6">
              <span className="block">{c.hero.titleLine1}</span>
              <span className="block bg-gradient-to-r from-[#D4A359] via-[#FFF1D0] to-[#E04F33] bg-clip-text text-transparent">
                {c.hero.titleLine2}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed mb-8">
              {c.hero.lead}
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => setAppSurface('workstation')}
                className="px-6 py-3.5 rounded-xl bg-[#D4A359] hover:bg-[#e5b76e] text-[#09090B] font-mono text-xs sm:text-sm font-bold tracking-wider shadow-[0_0_32px_rgba(212,163,89,0.4)] flex items-center gap-2 transition"
              >
                <span>{c.hero.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('act-blindness')}
                className="px-5 py-3.5 rounded-xl bg-[#131419]/90 hover:bg-white/10 border border-white/15 text-zinc-200 font-mono text-xs sm:text-sm font-semibold flex items-center gap-2 transition"
              >
                <span>{c.hero.secondaryCta}</span>
                <ArrowDown className="w-4 h-4 text-[#D4A359]" />
              </button>
            </div>
          </div>

          {/* 4 Verified KPI Pillars */}
          <div className="mt-14 pt-8 border-t border-white/10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {c.hero.metrics.map((m, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-[#0D0E12]/80 backdrop-blur-md border border-white/10"
                >
                  <div className="font-mono text-2xl sm:text-3xl font-bold text-[#D4A359] mb-1">
                    {m.value}
                  </div>
                  <div className="font-mono text-[10px] font-bold tracking-wider text-zinc-200 mb-1">
                    {m.label}
                  </div>
                  <div className="text-xs text-zinc-400">{m.sub}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.25em] text-zinc-500">
              <ArrowDown className="w-3.5 h-3.5 text-[#D4A359] animate-bounce" />
              <span>{c.hero.scrollPrompt}</span>
            </div>
          </div>
        </section>

        {/* ============================================================
            ACT I // THE 2D COGNITIVE WALL + INTERACTIVE SLIDER
        ============================================================ */}
        <section id="act-blindness" className="py-24 border-t border-white/10">
          <RevealBlock className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="font-mono text-xs font-bold tracking-widest text-[#E04F33]">
                  {c.act1.kicker}
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                  {c.act1.title}
                </h2>
                <p className="text-base text-zinc-200 leading-relaxed">{c.act1.lead}</p>
                {c.act1.paragraphs.map((p, i) => (
                  <p key={i} className="text-sm text-zinc-400 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-[#D4A359]/35 bg-[#121110]/90 p-6 space-y-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#D4A359]">
                  <Activity className="w-4 h-4" />
                  <span>{c.act1.calloutTitle}</span>
                </div>
                <p className="text-sm text-zinc-200 leading-relaxed">{c.act1.calloutBody}</p>
              </div>
            </div>

            <HexVsSpatialSlider
              title={c.act1.sliderTitle}
              hint={c.act1.sliderHint}
              leftBadge={c.act1.leftBadge}
              rightBadge={c.act1.rightBadge}
            />
          </RevealBlock>
        </section>

        {/* ============================================================
            ACT II // MYTHOLOGY OF ARGOS PANOPTES & GEOMETRIC GRAMMAR
        ============================================================ */}
        <section id="act-genesis" className="py-24 border-t border-white/10">
          <RevealBlock className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="font-mono text-xs font-bold tracking-widest text-[#D4A359]">
                  {c.act2.kicker}
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                  {c.act2.title}
                </h2>
                <h3 className="font-mono text-sm font-bold text-[#D4A359] pt-2">
                  {c.act2.mythTitle}
                </h3>
                {c.act2.mythParagraphs.map((p, i) => (
                  <p key={i} className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-[#D4A359]/35 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
                  <img
                    src="/logos/argus_logo_eye_1793256070828.jpg"
                    alt="Argus Panoptes Synaptic Eye"
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-4 bg-[#0D0E12] border-t border-white/10 font-mono text-[11px] flex items-center justify-between">
                    <span className="text-[#D4A359] font-bold">ARGOS PANOPTÈS // OPTICON</span>
                    <span className="text-zinc-400">100 ASYNCHRONOUS SENSORS</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5 pt-4">
              <div className="max-w-3xl">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {c.act2.grammarTitle}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{c.act2.grammarLead}</p>
              </div>

              <InteractiveGeometryDeck archetypes={c.act2.archetypes} isFr={isFr} />
            </div>
          </RevealBlock>
        </section>

        {/* ============================================================
            ACT III // Z-STRATUM GEODESIC ARCHITECTURE
        ============================================================ */}
        <section id="act-strata" className="py-24 border-t border-white/10">
          <RevealBlock className="space-y-12">
            <div className="max-w-3xl space-y-4">
              <div className="font-mono text-xs font-bold tracking-widest text-[#D4A359]">
                {c.act3.kicker}
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                {c.act3.title}
              </h2>
              <p className="text-base text-zinc-200 leading-relaxed">{c.act3.lead}</p>
              <p className="text-sm text-zinc-400 leading-relaxed">{c.act3.strataExplanation}</p>
            </div>

            {/* 4 Stacked Geodesic Strata Cards */}
            <div className="space-y-3">
              {c.act3.strataLayers.map((layer) => (
                <div
                  key={layer.chain}
                  className="p-5 rounded-2xl bg-[#0D0E12]/90 border border-white/10 hover:border-white/25 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-3 h-12 rounded-full shrink-0"
                      style={{ backgroundColor: layer.color }}
                    />
                    <div>
                      <div className="flex items-center gap-3 font-mono text-xs font-bold">
                        <span style={{ color: layer.color }}>{layer.chain}</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-zinc-300">
                          {layer.elevation}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-200 mt-1">{layer.role}</p>
                    </div>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-400 shrink-0">
                    {layer.tpsNote}
                  </div>
                </div>
              ))}
            </div>

            {/* High-Density Graphics Engineering Box */}
            <div className="rounded-2xl border border-[#7C93A8]/35 bg-[#0E1116]/90 p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#7C93A8]">
                <Layers className="w-4 h-4 text-[#D4A359]" />
                <span>{c.act3.engineeringHighlight.title}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {c.act3.engineeringHighlight.points.map((pt, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="font-mono text-xs font-bold text-white">
                      0{idx + 1} // {pt.label}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{pt.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </RevealBlock>
        </section>

        {/* ============================================================
            ACT IV // TAINT MATHEMATICS & ZERO PHANTOM DATA DOCTRINE
        ============================================================ */}
        <section id="act-taint" className="py-24 border-t border-white/10">
          <RevealBlock className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="font-mono text-xs font-bold tracking-widest text-[#E04F33]">
                  {c.act4.kicker}
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                  {c.act4.title}
                </h2>
                <p className="text-base text-zinc-200 leading-relaxed">{c.act4.lead}</p>
                {c.act4.paragraphs.map((p, i) => (
                  <p key={i} className="text-sm text-zinc-400 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-emerald-500/35 bg-emerald-950/25 p-6 space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{c.act4.zeroFakeTitle}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {c.act4.zeroFakeBody}
                </p>
              </div>
            </div>

            <InteractiveTaintLab isFr={isFr} />
          </RevealBlock>
        </section>

        {/* ============================================================
            ACT V // RICH MEDIA STUDIO, ARCHIVES, LIGHTBOX & ARTICLES
        ============================================================ */}
        <section id="act-studio" className="py-24 border-t border-white/10">
          <RevealBlock className="space-y-10">
            <div className="max-w-3xl space-y-3">
              <div className="font-mono text-xs font-bold tracking-widest text-[#D4A359]">
                {c.act5.kicker}
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                {c.act5.title}
              </h2>
              <p className="text-base text-zinc-300 leading-relaxed">{c.act5.lead}</p>
            </div>

            <RichMediaShowcase
              content={c.act5}
              isFr={isFr}
              onLaunchCase={(caseId, gran) => launchCaseInWorkstation(caseId, gran)}
            />
          </RevealBlock>
        </section>

        {/* ============================================================
            ACT VI // THREE EXECUTIVE LENSES (CTO / DATA SCIENTIST / CMO)
        ============================================================ */}
        <section id="act-enterprise" className="py-24 border-t border-white/10">
          <RevealBlock className="space-y-10">
            <div className="max-w-3xl space-y-3">
              <div className="font-mono text-xs font-bold tracking-widest text-[#D4A359]">
                {c.act6.kicker}
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                {c.act6.title}
              </h2>
              <p className="text-base text-zinc-300 leading-relaxed">{c.act6.lead}</p>
            </div>

            {/* 3 Executive Lens Selector Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {c.act6.personas.map((p, idx) => {
                const selected = idx === activePersonaIdx;
                const Icon = idx === 0 ? Cpu : idx === 1 ? Code2 : Sparkles;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePersonaIdx(idx)}
                    className={`text-left p-5 rounded-2xl border transition-all ${
                      selected
                        ? 'bg-[#15161D] border-[#D4A359] shadow-[0_0_32px_rgba(212,163,89,0.18)]'
                        : 'bg-[#0D0E12]/80 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#D4A359] font-bold mb-2">
                      <span>{p.badge}</span>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-base font-bold text-white mb-2">{p.roleTitle}</div>
                    <p className="text-xs italic text-zinc-300 leading-relaxed">{p.quoteHook}</p>
                  </button>
                );
              })}
            </div>

            {/* Active Persona Deep-Dive Blueprint */}
            <div className="rounded-2xl border border-[#D4A359]/35 bg-[#0D0E12]/95 p-6 sm:p-8 space-y-7 shadow-[0_28px_80px_rgba(0,0,0,0.65)]">
              <div className="space-y-2">
                <div className="font-mono text-xs text-[#D4A359] font-bold">
                  {activePersona.badge}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {activePersona.headline}
                </h3>
                <p className="text-sm text-zinc-300 max-w-3xl leading-relaxed">
                  {activePersona.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activePersona.pillars.map((pil, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#12141B] border border-white/10 space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-white font-bold">{pil.title}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </div>
                    <div className="font-mono text-sm font-bold text-[#D4A359]">{pil.metric}</div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{pil.detail}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-[#08090C] border border-white/10 overflow-hidden">
                <div className="px-4 py-2.5 bg-[#111218] border-b border-white/10 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-zinc-300 flex items-center gap-2 font-bold">
                    <Terminal className="w-3.5 h-3.5 text-[#D4A359]" />
                    <span>{activePersona.codeTitle}</span>
                  </span>
                  <span className="text-zinc-500">ARGUS v5.0 SPEC</span>
                </div>
                <pre className="p-4 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
                  <code>{activePersona.codeSnippet}</code>
                </pre>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (activePersona.id === 'datascientist') {
                      launchCaseInWorkstation('bybit-safe-exploit-2025', 'full_ledger');
                    } else if (activePersona.id === 'cmo') {
                      setAppSurface('workstation');
                      setActiveTourStep(0);
                    } else {
                      launchLiveQueryInWorkstation('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#D4A359] hover:bg-[#e5b76e] text-[#09090B] font-mono text-xs font-bold flex items-center gap-2 transition"
                >
                  <span>{activePersona.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </RevealBlock>
        </section>

        {/* ============================================================
            EPILOGUE // LIVE RPC LAUNCHER & COMMAND FOOTER
        ============================================================ */}
        <section className="py-24 border-t border-white/10">
          <RevealBlock>
            <div className="rounded-3xl border border-[#D4A359]/45 bg-gradient-to-b from-[#151310]/95 to-[#0B0C10]/95 p-8 sm:p-12 text-center space-y-7 shadow-[0_32px_100px_rgba(0,0,0,0.8)]">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-[#141418] border border-[#D4A359]/40 flex items-center justify-center shadow-[0_0_30px_rgba(212,163,89,0.28)]">
                <ArgusOrbitalLogo size={52} />
              </div>

              <div className="space-y-3 max-w-2xl mx-auto">
                <div className="font-mono text-xs font-bold tracking-widest text-[#D4A359]">
                  {c.finale.kicker}
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
                  {c.finale.title}
                </h2>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {c.finale.lead}
                </p>
              </div>

              {/* Direct Live Ethereum RPC Address Input */}
              <form
                onSubmit={handleLiveSubmit}
                className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2.5"
              >
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={liveAddressInput}
                    onChange={(e) => setLiveAddressInput(e.target.value)}
                    placeholder={c.finale.liveInputPlaceholder}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#09090B] border border-white/15 focus:border-[#D4A359] focus:outline-none font-mono text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3.5 rounded-xl bg-[#E04F33] hover:bg-[#f05c3f] text-white font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition shrink-0"
                >
                  <span>{c.finale.liveInputBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 1-Click Live Sample Targets */}
              <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px]">
                <span className="text-zinc-500">{c.finale.sampleLabel}</span>
                {[
                  {
                    label: 'Vitalik.eth (Live RPC)',
                    addr: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
                  },
                  {
                    label: 'Bybit Safe ($1.46B)',
                    caseId: 'bybit-safe-exploit-2025',
                  },
                  {
                    label: 'Ronin Lazarus ($624M)',
                    caseId: 'ronin-bridge-exploit-2022',
                  },
                ].map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => {
                      if (sample.addr) {
                        launchLiveQueryInWorkstation(sample.addr);
                      } else if (sample.caseId) {
                        launchCaseInWorkstation(sample.caseId, 'full_ledger');
                      }
                    }}
                    className="px-3 py-1 rounded-lg bg-white/5 hover:bg-[#D4A359]/20 border border-white/10 hover:border-[#D4A359]/40 text-zinc-300 hover:text-[#D4A359] transition"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setAppSurface('workstation')}
                  className="px-8 py-4 rounded-xl bg-[#D4A359] hover:bg-[#e5b76e] text-[#09090B] font-mono text-sm font-bold tracking-wider shadow-[0_0_36px_rgba(212,163,89,0.45)] inline-flex items-center gap-2.5 transition"
                >
                  <Lock className="w-4 h-4" />
                  <span>{c.finale.enterFullConsoleBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <footer className="py-10 text-center font-mono text-[11px] text-zinc-500">
              {c.finale.footerNote}
            </footer>
          </RevealBlock>
        </section>
      </div>
    </div>
  );
};

