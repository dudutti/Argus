import React, { useState } from 'react';
import { useForensicStore } from '../store/useForensicStore';
import { EntityType } from '../types/forensics';
import { TRANSLATIONS } from '../i18n/translations';
import { LOCALIZED_CASES } from '../i18n/caseTranslations';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Filter,
  GitBranch,
  Layers,
  ShieldAlert,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const LeftFilterPanel: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const state = useForensicStore();
  const t = TRANSLATIONS[state.language];

  const currentCase = state.cases.find((c) => c.id === state.activeCaseId);
  const localizedCase = currentCase ? LOCALIZED_CASES[state.language]?.[currentCase.id] : null;

  const entityConfig: Array<{
    type: EntityType;
    label: string;
    geometryDesc: string;
    color: string;
  }> = [
    {
      type: 'exploiter',
      label: t.filterPanel.entityExploiter,
      geometryDesc: state.language === 'fr' ? 'Icosaèdre Cramoisi + Anneau' : 'Crimson Icosahedron + Ring',
      color: '#E04F33',
    },
    {
      type: 'mixer',
      label: t.filterPanel.entityMixer,
      geometryDesc: state.language === 'fr' ? 'Singularité + Anneau Quartz' : 'Singularity + Quartz Ring',
      color: '#9D7CD8',
    },
    {
      type: 'bridge',
      label: t.filterPanel.entityBridge,
      geometryDesc: state.language === 'fr' ? 'Balise Cylindrique Titane' : 'Titanium Cylinder Beacon',
      color: '#96AAB8',
    },
    {
      type: 'dex',
      label: t.filterPanel.entityDex,
      geometryDesc: state.language === 'fr' ? 'Octaèdre Ardoise Anodisée' : 'Anodized Slate Octahedron',
      color: '#608A9E',
    },
    {
      type: 'cex',
      label: t.filterPanel.entityCex,
      geometryDesc: state.language === 'fr' ? 'Cube Laiton Brossé' : 'Brushed Brass Cube',
      color: '#D4A359',
    },
    {
      type: 'eoa',
      label: t.filterPanel.entityEoa,
      geometryDesc: state.language === 'fr' ? 'Sphère Mate Échelle-Log' : 'Log-Scaled Matte Sphere',
      color: '#8C9BAE',
    },
  ];

  if (collapsed) {
    return (
      <div className="absolute top-28 left-4 z-20">
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 px-3 py-2 bg-[#111113]/90 backdrop-blur-md border border-white/10 rounded-lg text-xs font-mono text-[#D4A359] hover:border-[#D4A359]/50 shadow-2xl transition"
          title="Expand Forensic Filters & Heuristics Panel"
        >
          <Sliders className="w-4 h-4 text-[#D4A359]" />
          <span>{t.filterPanel.title}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside className="absolute top-28 left-4 bottom-24 z-20 w-80 flex flex-col bg-[#111113]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden font-mono text-xs">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#09090B]/60">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#D4A359]" />
          <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-white">
            {t.filterPanel.title}
          </h2>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/10 transition"
          title="Collapse Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Active Case Brief */}
        {currentCase && (
          <div className="p-3 rounded-lg bg-[#09090B]/80 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-[#D4A359] uppercase">
              <span className="truncate max-w-[170px]">{localizedCase?.category || currentCase.category}</span>
              <span>{currentCase.date}</span>
            </div>
            <div className="font-semibold text-zinc-100 text-xs">
              {localizedCase?.title || currentCase.title}
            </div>
            <div className="text-[10px] text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded px-2 py-1">
              {state.language === 'fr' ? 'Montant dérobé :' : 'Stolen:'} <b>{currentCase.stolenAmountUsd}</b>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-3">
              {localizedCase?.summary || currentCase.summary}
            </p>
            <button
              onClick={() => state.setIsDocsModalOpen(true)}
              className="w-full py-1.5 px-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-[#D4A359] transition"
            >
              {state.language === 'fr' ? 'Chronologie & Méthode Complète →' : 'Full Attack Chronology & Method →'}
            </button>
          </div>
        )}

        {/* 1. Minimum USD Value Slider (Dust Filter) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-zinc-300 uppercase text-[10px]">{t.filterPanel.minVolumeUsd}</span>
            <span className="text-[#D4A359] font-bold">
              ${state.minUsdValue.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={5000000}
            step={50000}
            value={state.minUsdValue}
            onChange={(e) => state.setMinUsdValue(Number(e.target.value))}
            className="w-full accent-[#D4A359]"
          />
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>$0</span>
            <span>$1M</span>
            <span>$2.5M</span>
            <span>$5M+</span>
          </div>
        </div>

        {/* 2. Taint Propagation & Probabilistic Post-Mixer Heuristics */}
        <div className="space-y-2.5 pt-2 border-t border-white/10">
          <div className="text-[10px] uppercase text-zinc-400 tracking-wider">
            {t.filterPanel.taintEngine}
          </div>

          {/* Toggle: Probabilistic Post-Mixer Links */}
          <label className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-[#09090B]/60 border border-white/10 cursor-pointer hover:border-purple-500/40 transition">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.filterPanel.probabilisticLinks}</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-snug">
                {state.language === 'fr'
                  ? 'Corrèle les dépôts et retraits de mixers ZK par empreintes de gaz et fenêtres temporelles.'
                  : 'Correlates ZK mixer deposits with post-mix withdrawals via time-delta & gas fingerprints.'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={state.showProbabilisticLinks}
              onChange={(e) => state.setShowProbabilisticLinks(e.target.checked)}
              className="mt-1 accent-purple-500 w-4 h-4 rounded cursor-pointer"
            />
          </label>

          {/* Toggle: Heatmap Taint Mode */}
          <label className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-[#09090B]/60 border border-white/10 cursor-pointer hover:border-[#E04F33]/40 transition">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
                <Flame className="w-3.5 h-3.5 text-[#E04F33]" />
                <span>{t.filterPanel.taintHeatmapToggle}</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-snug">
                {state.language === 'fr'
                  ? 'Recolore le graphe : Acier Froid (0%) → Laiton Ochre → Rouge Vermillon (100% volé).'
                  : 'Recolors graph: Cold Steel (0%) → Warm Ochre → Neon Vermilion (100% stolen).'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={state.heatmapTaintMode}
              onChange={(e) => state.setHeatmapTaintMode(e.target.checked)}
              className="mt-1 accent-[#E04F33] w-4 h-4 rounded cursor-pointer"
            />
          </label>

          {state.heatmapTaintMode && (
            <div className="p-2 rounded bg-[#09090B]/90 border border-white/10 space-y-1">
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-[#7C93A8] via-[#D4A359] to-[#E04F33]" />
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>0% {t.common.clean}</span>
                <span>50% {t.common.risk}</span>
                <span>100% {t.filterPanel.entityExploiter}</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Filter by Specialized 3D Entity Geometry */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-[10px] uppercase text-zinc-400">
            <span>{t.filterPanel.entityTypes}</span>
            <Layers className="w-3.5 h-3.5 text-[#D4A359]" />
          </div>

          <div className="space-y-1.5">
            {entityConfig.map((item) => {
              const checked = state.enabledEntities[item.type];
              const count = state.nodes.filter((n) => n.entityType === item.type).length;
              return (
                <button
                  key={item.type}
                  onClick={() => state.toggleEntity(item.type)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition ${
                    checked
                      ? 'bg-[#09090B]/75 border-white/10 text-zinc-100 hover:border-white/25'
                      : 'bg-[#09090B]/30 border-white/5 text-zinc-500 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{
                        backgroundColor: item.color,
                        boxShadow: checked ? `0 0 8px ${item.color}` : 'none',
                      }}
                    />
                    <div className="truncate">
                      <div className="font-medium text-[11px] truncate">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">
                        {item.geometryDesc}
                      </div>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] bg-white/5 rounded text-zinc-300 shrink-0">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Directional Particle Asset Color Grammar Legend */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-[10px] uppercase text-zinc-400">
            <span>{t.filterPanel.visualOptions}</span>
            <GitBranch className="w-3.5 h-3.5 text-[#D4A359]" />
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="flex items-center gap-2 p-1.5 rounded bg-[#08090C]/80 border border-white/5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#E04F33] shadow-[0_0_6px_#E04F33]" />
              <span className="text-zinc-300">{state.language === 'fr' ? 'Volé / Taint Élevé' : 'High-Taint / Stolen'}</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-[#08090C]/80 border border-white/5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#7C93A8] shadow-[0_0_6px_#7C93A8]" />
              <span className="text-zinc-300">ETH Native Flow</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-[#08090C]/80 border border-white/5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#4E9F76] shadow-[0_0_6px_#4E9F76]" />
              <span className="text-zinc-300">USDT / USDC</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-[#08090C]/80 border border-white/5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#D4A359] shadow-[0_0_6px_#D4A359]" />
              <span className="text-zinc-300">WBTC / BTC</span>
            </div>
          </div>
        </div>

        {/* Quick Live Address Demo Button */}
        <div className="pt-2 border-t border-white/10">
          <button
            onClick={() =>
              state.executeSearchOrLiveLookup('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
            }
            className="w-full py-2 px-3 rounded-lg bg-[#D4A359]/15 hover:bg-[#D4A359]/25 border border-[#D4A359]/40 text-[#D4A359] text-[11px] flex items-center justify-center gap-2 transition"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Live RPC Trace: vitalik.eth (0xd8dA...)</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
