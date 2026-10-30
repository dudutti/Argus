import React, { useState } from 'react';
import { useForensicStore } from '../store/useForensicStore';
import { ArgusOrbitalLogo } from './ArgusOrbitalLogo';
import { TRANSLATIONS } from '../i18n/translations';
import { DOCS_TRANSLATIONS } from '../i18n/docsTranslations';
import { LOCALIZED_CASES } from '../i18n/caseTranslations';
import {
  Activity,
  BookOpen,
  Box,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Compass,
  Cpu,
  ExternalLink,
  Flame,
  GitBranch,
  HelpCircle,
  Layers,
  Play,
  PlusCircle,
  Radar,
  Search,
  ShieldAlert,
  Sparkles,
  Table2,
  X,
} from 'lucide-react';

type DocTab =
  | 'quickstart'
  | 'spatial-grammar'
  | 'forensic-engine'
  | 'classic-explorer'
  | 'cases-guide';

interface TourStepConfig {
  title: string;
  subtitle: string;
  description: string;
  actionLabel: string;
  onTrigger: () => void;
}

export const DocumentationModal: React.FC = () => {
  const state = useForensicStore();
  const [activeTab, setActiveTab] = useState<DocTab>('quickstart');

  const t = TRANSLATIONS[state.language];
  const doc = DOCS_TRANSLATIONS[state.language];

  const tourActions = [
    () => {
      state.setViewMode('3d');
      state.setShowChainPlanes(true);
      state.triggerCameraReset();
    },
    () => {
      state.setViewMode('3d');
      const rootNode = state.nodes.find((n) => n.entityType === 'exploiter') || state.nodes[0];
      if (rootNode) state.selectNode(rootNode.id);
    },
    () => {
      state.setViewMode('3d');
      state.setHeatmapTaintMode(true);
      state.triggerCameraReset();
    },
    () => {
      state.setHeatmapTaintMode(false);
      const target = state.selectedNodeId || state.nodes[0]?.id;
      if (target) {
        state.selectNode(target);
        state.expandNodeHops(target);
      }
    },
    () => {
      state.setPlaybackSpeed(2);
      state.setIsPlaying(true);
    },
    () => {
      state.setIsPlaying(false);
      state.resetTimelineToFull();
      state.setViewMode('split');
    },
  ];

  const tourSteps: TourStepConfig[] = t.tour.steps.map((st, i) => ({
    ...st,
    onTrigger: tourActions[i] || (() => {}),
  }));

  return (
    <>
      {/* ===================================================================== */}
      {/* FLOATING INTERACTIVE TOUR HUD POPUP (STEP-BY-STEP OVERLAY)             */}
      {/* ===================================================================== */}
      {state.activeTourStep !== null && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-2xl bg-[#111113]/95 backdrop-blur-xl border-2 border-[#D4A359]/60 rounded-2xl p-4 shadow-[0_0_40px_rgba(212,163,89,0.35)] text-zinc-100 font-mono">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#D4A359]/20 text-[#D4A359] border border-[#D4A359]/40">
                  {t.tour.interactiveBadge}
                </span>
                <span className="text-xs text-[#D4A359]">
                  {tourSteps[state.activeTourStep].subtitle}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                {tourSteps[state.activeTourStep].title}
              </h3>
            </div>
            <button
              onClick={() => state.setActiveTourStep(null)}
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/10"
              title={t.common.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed mb-3 font-sans">
            {tourSteps[state.activeTourStep].description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
            <button
              onClick={() => tourSteps[state.activeTourStep!].onTrigger()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4A359]/25 hover:bg-[#D4A359]/35 text-[#D4A359] border border-[#D4A359]/50 font-bold transition shadow-[0_0_12px_rgba(212,163,89,0.3)]"
            >
              <Play className="w-3.5 h-3.5 text-[#D4A359]" />
              <span>
                {t.tour.testBtnPrefix} {tourSteps[state.activeTourStep].actionLabel}
              </span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                disabled={state.activeTourStep === 0}
                onClick={() => {
                  const prev = Math.max(0, state.activeTourStep! - 1);
                  state.setActiveTourStep(prev);
                  tourSteps[prev].onTrigger();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 text-zinc-200 flex items-center gap-1 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{t.tour.prevBtn}</span>
              </button>

              <span className="text-[11px] text-zinc-400 px-1">
                {state.activeTourStep + 1} / {tourSteps.length}
              </span>

              {state.activeTourStep < tourSteps.length - 1 ? (
                <button
                  onClick={() => {
                    const next = state.activeTourStep! + 1;
                    state.setActiveTourStep(next);
                    tourSteps[next].onTrigger();
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#D4A359]/20 hover:bg-[#D4A359]/30 text-[#D4A359] border border-[#D4A359]/40 font-semibold flex items-center gap-1 transition"
                >
                  <span>{t.tour.nextBtn}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => state.setActiveTourStep(null)}
                  className="px-3 py-1.5 rounded-lg bg-[#4E9F76]/30 hover:bg-[#4E9F76]/40 text-[#4E9F76] border border-[#4E9F76] font-bold transition"
                >
                  {t.tour.finishBtn}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FULL IN-APP DOCUMENTATION & HOW-TO MANUAL MODAL                       */}
      {/* ===================================================================== */}
      {state.isDocsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-5xl h-[88vh] flex flex-col bg-[#111113] border border-[#D4A359]/30 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden font-mono">
            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-[#09090B] border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#18181B] border border-[#D4A359]/30 flex items-center justify-center shadow-[0_0_15px_rgba(212,163,89,0.18)]">
                  <ArgusOrbitalLogo size={36} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold tracking-wider uppercase text-white">
                      {t.docs.modalTitle}
                    </h2>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#D4A359]/15 text-[#D4A359] border border-[#D4A359]/30 rounded">
                      FORENSIC SUITE
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans">
                    {t.docs.modalSubtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    state.setActiveTourStep(0);
                    tourSteps[0].onTrigger();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D4A359]/25 hover:bg-[#D4A359]/35 text-[#D4A359] border border-[#D4A359]/50 text-xs font-bold shadow-[0_0_15px_rgba(212,163,89,0.25)] transition"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{t.docs.launchTourBtn}</span>
                </button>

                <button
                  onClick={() => state.setIsDocsModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs + Content Split */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Sidebar Menu */}
              <div className="w-full md:w-64 bg-[#09090B]/70 border-b md:border-b-0 md:border-r border-white/10 p-3 flex md:flex-col gap-1.5 overflow-x-auto shrink-0 text-xs">
                <button
                  onClick={() => setActiveTab('quickstart')}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition ${
                    activeTab === 'quickstart'
                      ? 'bg-[#D4A359]/20 text-[#D4A359] border border-[#D4A359]/40 font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Compass className="w-4 h-4 text-[#D4A359] shrink-0" />
                  <span>{t.docs.tabQuickstart}</span>
                </button>

                <button
                  onClick={() => setActiveTab('spatial-grammar')}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition ${
                    activeTab === 'spatial-grammar'
                      ? 'bg-[#D4A359]/20 text-[#D4A359] border border-[#D4A359]/40 font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#D4A359] shrink-0" />
                  <span>{t.docs.tabGrammar}</span>
                </button>

                <button
                  onClick={() => setActiveTab('forensic-engine')}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition ${
                    activeTab === 'forensic-engine'
                      ? 'bg-[#D4A359]/20 text-[#D4A359] border border-[#D4A359]/40 font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Flame className="w-4 h-4 text-[#E04F33] shrink-0" />
                  <span>{t.docs.tabForensic}</span>
                </button>

                <button
                  onClick={() => setActiveTab('classic-explorer')}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition ${
                    activeTab === 'classic-explorer'
                      ? 'bg-[#D4A359]/20 text-[#D4A359] border border-[#D4A359]/40 font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Table2 className="w-4 h-4 text-[#4E9F76] shrink-0" />
                  <span>{t.docs.tabExplorer}</span>
                </button>

                <button
                  onClick={() => setActiveTab('cases-guide')}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition ${
                    activeTab === 'cases-guide'
                      ? 'bg-[#D4A359]/20 text-[#D4A359] border border-[#D4A359]/40 font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t.docs.tabCases}</span>
                </button>
              </div>

              {/* Right Scrollable Documentation Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-zinc-200 text-sm leading-relaxed font-sans">
                {/* =========================================================== */}
                {/* TAB 1: QUICKSTART & HOW-TO                                  */}
                {/* =========================================================== */}
                {activeTab === 'quickstart' && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-[#D4A359]/10 border border-[#D4A359]/30 space-y-2">
                      <h3 className="text-base font-mono font-bold text-[#D4A359] flex items-center gap-2">
                        <Radar className="w-5 h-5" />
                        <span>{doc.introTitle}</span>
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        {doc.introDesc}
                      </p>
                    </div>

                    <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[#D4A359]">
                      {doc.guideTitle}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="p-4 rounded-xl bg-[#09090B] border border-white/10 space-y-2">
                        <div className="flex items-center gap-2 font-mono font-bold text-white">
                          <Box className="w-4 h-4 text-[#D4A359]" />
                          <span>{doc.step1Title}</span>
                        </div>
                        <ul className="space-y-1.5 text-zinc-300 list-disc list-inside">
                          {doc.step1Items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-[#09090B] border border-white/10 space-y-2">
                        <div className="flex items-center gap-2 font-mono font-bold text-white">
                          <Search className="w-4 h-4 text-[#4E9F76]" />
                          <span>{doc.step2Title}</span>
                        </div>
                        <ul className="space-y-1.5 text-zinc-300 list-disc list-inside">
                          {doc.step2Items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-[#09090B] border border-white/10 space-y-2">
                        <div className="flex items-center gap-2 font-mono font-bold text-white">
                          <PlusCircle className="w-4 h-4 text-purple-400" />
                          <span>{doc.step3Title}</span>
                        </div>
                        <ul className="space-y-1.5 text-zinc-300 list-disc list-inside">
                          {doc.step3Items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-[#09090B] border border-white/10 space-y-2">
                        <div className="flex items-center gap-2 font-mono font-bold text-white">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span>{doc.step4Title}</span>
                        </div>
                        <ul className="space-y-1.5 text-zinc-300 list-disc list-inside">
                          {doc.step4Items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================== */}
                {/* TAB 2: SPATIAL GRAMMAR & 3D GEOMETRIES                      */}
                {/* =========================================================== */}
                {activeTab === 'spatial-grammar' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-mono font-bold text-white mb-2">
                        {doc.spatialTitle1}
                      </h3>
                      <p className="text-xs text-zinc-300 mb-3 font-sans">
                        {doc.spatialDesc1}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
                        <div className="p-3 rounded-lg bg-[#09090B] border border-[#14F195]/40">
                          <div className="text-[#14F195] font-bold">SOLANA MAINNET</div>
                          <div className="text-zinc-400 text-[11px] mt-1">Stratum Y = +240</div>
                        </div>
                        <div className="p-3 rounded-lg bg-[#09090B] border border-[#28A0F0]/40">
                          <div className="text-[#28A0F0] font-bold">ARBITRUM ONE (L2)</div>
                          <div className="text-zinc-400 text-[11px] mt-1">Stratum Y = +120</div>
                        </div>
                        <div className="p-3 rounded-lg bg-[#09090B] border border-[#627EEA]/40">
                          <div className="text-[#627EEA] font-bold">ETHEREUM L1</div>
                          <div className="text-zinc-400 text-[11px] mt-1">Stratum Y = 0</div>
                        </div>
                        <div className="p-3 rounded-lg bg-[#09090B] border border-[#F7931A]/40">
                          <div className="text-[#F7931A] font-bold">BITCOIN NETWORK</div>
                          <div className="text-zinc-400 text-[11px] mt-1">Stratum Y = -120</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-mono font-bold text-white mb-2">
                        {doc.spatialTitle2}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                        <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#E04F33]/30 flex items-start gap-3">
                          <span className="w-3.5 h-3.5 rounded-sm bg-[#E04F33] shadow-[0_0_10px_#E04F33] shrink-0 mt-1" />
                          <div>
                            <div className="font-mono font-bold text-rose-300">
                              {doc.grammarHacker.title}
                            </div>
                            <div className="text-zinc-400 mt-0.5">
                              {doc.grammarHacker.desc}
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#09090B] border border-purple-500/30 flex items-start gap-3">
                          <span className="w-3.5 h-3.5 rounded-sm bg-[#9D7CD8] shadow-[0_0_10px_#9D7CD8] shrink-0 mt-1" />
                          <div>
                            <div className="font-mono font-bold text-purple-300">
                              {doc.grammarMixer.title}
                            </div>
                            <div className="text-zinc-400 mt-0.5">
                              {doc.grammarMixer.desc}
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#09090B] border border-white/15 flex items-start gap-3">
                          <span className="w-3.5 h-3.5 rounded-sm bg-[#96AAB8] shadow-[0_0_10px_#96AAB8] shrink-0 mt-1" />
                          <div>
                            <div className="font-mono font-bold text-slate-200">
                              {doc.grammarBridge.title}
                            </div>
                            <div className="text-zinc-400 mt-0.5">
                              {doc.grammarBridge.desc}
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#608A9E]/40 flex items-start gap-3">
                          <span className="w-3.5 h-3.5 rounded-sm bg-[#608A9E] shadow-[0_0_10px_#608A9E] shrink-0 mt-1" />
                          <div>
                            <div className="font-mono font-bold text-cyan-200">
                              {doc.grammarDex.title}
                            </div>
                            <div className="text-zinc-400 mt-0.5">
                              {doc.grammarDex.desc}
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#D4A359]/30 flex items-start gap-3">
                          <span className="w-3.5 h-3.5 rounded-sm bg-[#D4A359] shadow-[0_0_10px_#D4A359] shrink-0 mt-1" />
                          <div>
                            <div className="font-mono font-bold text-[#D4A359]">
                              {doc.grammarCex.title}
                            </div>
                            <div className="text-zinc-400 mt-0.5">
                              {doc.grammarCex.desc}
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#09090B] border border-white/10 flex items-start gap-3">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#8C9BAE] shrink-0 mt-1" />
                          <div>
                            <div className="font-mono font-bold text-zinc-300">
                              {doc.grammarEoa.title}
                            </div>
                            <div className="text-zinc-400 mt-0.5">
                              {doc.grammarEoa.desc}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================== */}
                {/* TAB 3: TAINT & HEURISTICS                                   */}
                {/* =========================================================== */}
                {activeTab === 'forensic-engine' && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-[#09090B] border border-white/10 space-y-2">
                      <h3 className="text-base font-mono font-bold text-white">
                        {doc.taintTitle1}
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        {doc.taintDesc1}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#09090B] border border-purple-500/30 space-y-2">
                      <h3 className="text-base font-mono font-bold text-purple-300">
                        {doc.taintTitle2}
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        {doc.taintDesc2}
                      </p>
                    </div>
                  </div>
                )}

                {/* =========================================================== */}
                {/* TAB 4: CLASSIC BLOCK EXPLORER                               */}
                {/* =========================================================== */}
                {activeTab === 'classic-explorer' && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-[#09090B] border border-white/10 space-y-2">
                      <h3 className="text-base font-mono font-bold text-white">
                        {doc.explorerTitle1}
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        {doc.explorerDesc1}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#09090B] border border-[#D4A359]/30 space-y-2">
                      <h3 className="text-base font-mono font-bold text-[#D4A359]">
                        {doc.explorerTitle2}
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        {doc.explorerDesc2}
                      </p>
                    </div>
                  </div>
                )}

                {/* =========================================================== */}
                {/* TAB 5: REAL HISTORICAL CASES CHRONOLOGY                     */}
                {/* =========================================================== */}
                {activeTab === 'cases-guide' && (
                  <div className="space-y-6">
                    <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      {doc.casesHeader}
                    </div>

                    {state.cases.map((cs) => {
                      const locCase = LOCALIZED_CASES[state.language]?.[cs.id];
                      return (
                        <div
                          key={cs.id}
                          className="p-5 rounded-xl bg-[#09090B] border border-white/15 space-y-4 shadow-lg font-mono"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-[#E04F33]/20 text-[#E04F33] border border-[#E04F33]/40 text-[10px] font-bold">
                                  {cs.date}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-200 text-[10px]">
                                  {locCase?.category || cs.category}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-[#D4A359]/20 text-[#D4A359] border border-[#D4A359]/40 text-[10px] font-bold">
                                  {cs.stolenAmountUsd}
                                </span>
                              </div>
                              <h4 className="font-bold text-base text-white pt-1">
                                {locCase?.title || cs.title}
                              </h4>
                              <p className="text-[11px] text-zinc-400">
                                Attribution :{' '}
                                <strong className="text-zinc-200">
                                  {locCase?.attackerAttribution || cs.attackerAttribution}
                                </strong>
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                state.selectCase(cs.id);
                                state.setIsDocsModalOpen(false);
                              }}
                              className="px-3.5 py-2 rounded-lg bg-[#D4A359]/20 hover:bg-[#D4A359]/35 text-[#D4A359] border border-[#D4A359]/50 font-bold text-xs shrink-0 transition"
                            >
                              {doc.loadCaseBtn}
                            </button>
                          </div>

                          {/* Root Vulnerability & Verified Mainnet Identifiers */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                            <div className="p-3 rounded-lg bg-[#111113] border border-white/10 space-y-1">
                              <div className="text-[#D4A359] font-bold uppercase text-[10px]">
                                {doc.methodologyTitle}
                              </div>
                              <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                                {locCase?.rootVulnerability || cs.rootVulnerability}
                              </p>
                            </div>

                            <div className="p-3 rounded-lg bg-[#111113] border border-white/10 space-y-1.5">
                              <div className="text-[#4E9F76] font-bold uppercase text-[10px]">
                                {doc.identifiersTitle}
                              </div>
                              <div className="flex items-center justify-between gap-2 text-zinc-300">
                                <span className="text-zinc-500">Exploiter:</span>
                                <a
                                  href={`https://etherscan.io/address/${cs.primaryExploiterAddress}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#E04F33] hover:underline flex items-center gap-1 truncate"
                                >
                                  <span>{cs.primaryExploiterAddress.slice(0, 18)}...</span>
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                              </div>
                              <div className="flex items-center justify-between gap-2 text-zinc-300">
                                <span className="text-zinc-500">Victim:</span>
                                <a
                                  href={`https://etherscan.io/address/${cs.primaryVictimAddress}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#7C93A8] hover:underline flex items-center gap-1 truncate"
                                >
                                  <span>{cs.primaryVictimAddress.slice(0, 18)}...</span>
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                              </div>
                              <div className="flex items-center justify-between gap-2 text-zinc-300">
                                <span className="text-zinc-500">Attack Tx:</span>
                                <a
                                  href={`https://etherscan.io/tx/${cs.primaryAttackTxHash}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#4E9F76] hover:underline flex items-center gap-1 truncate"
                                >
                                  <span>{cs.primaryAttackTxHash.slice(0, 18)}...</span>
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                              </div>
                            </div>
                          </div>

                          <p className="text-zinc-300 leading-relaxed font-sans">
                            {locCase?.summary || cs.summary}
                          </p>

                          {/* Step-by-Step Chronology Table */}
                          <div className="space-y-2">
                            <div className="font-bold text-[11px] uppercase text-zinc-300 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#D4A359]" />
                              <span>{doc.chronologyTitle}</span>
                            </div>
                            <div className="overflow-x-auto rounded-lg border border-white/10">
                              <table className="w-full text-left border-collapse text-[11px]">
                                <thead>
                                  <tr className="bg-[#111113] border-b border-white/10 text-zinc-400 uppercase text-[10px]">
                                    <th className="p-2 w-28">{doc.colPhase}</th>
                                    <th className="p-2 w-48">{doc.colStep}</th>
                                    <th className="p-2">{doc.colDetail}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                  {(locCase?.chronologySteps || cs.chronology.map((c) => ({
                                    title: c.technicalMethod,
                                    phase: c.phase,
                                    description: c.details,
                                  }))).map((step, idx) => (
                                    <tr key={idx} className="hover:bg-white/[0.03]">
                                      <td className="p-2 text-[#D4A359] font-bold">
                                        {step.phase}
                                      </td>
                                      <td className="p-2 text-white font-semibold">
                                        {step.title}
                                      </td>
                                      <td className="p-2 text-zinc-300 font-sans">
                                        {step.description}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
