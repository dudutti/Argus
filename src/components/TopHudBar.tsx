import React from 'react';
import { useForensicStore, getFilteredGraph } from '../store/useForensicStore';
import { CHAIN_PLANES } from '../data/forensicCases';
import { ChainId } from '../types/forensics';
import { ArgusOrbitalLogo } from './ArgusOrbitalLogo';
import { TRANSLATIONS } from '../i18n/translations';
import { LOCALIZED_CASES } from '../i18n/caseTranslations';
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Box,
  Columns,
  Compass,
  Cpu,
  Database,
  FolderGit2,
  GitCompare,
  Layers,
  Loader2,
  Play,
  PlusCircle,
  Search,
  ShieldAlert,
  Table2,
  Trash2,
  X,
} from 'lucide-react';

export const TopHudBar: React.FC = () => {
  const state = useForensicStore();
  const t = TRANSLATIONS[state.language];
  const { visibleNodes, visibleLinks } = getFilteredGraph(state);

  // Compute live forensic KPIs from visible graph
  const totalVolumeTracked = visibleLinks.reduce((acc, l) => acc + l.usdValue, 0);
  const taintedVolume = visibleLinks
    .filter((l) => l.isHighTaint)
    .reduce((acc, l) => acc + l.usdValue, 0);
  const frozenVolume = visibleLinks
    .filter((l) => l.isFrozen)
    .reduce((acc, l) => acc + l.usdValue, 0);
  const taintedPercent =
    totalVolumeTracked > 0 ? Math.round((taintedVolume / totalVolumeTracked) * 100) : 0;

  const activeMixersCount = visibleNodes.filter((n) => n.entityType === 'mixer').length;
  const crossChainHopsCount = visibleLinks.filter((l) => l.isCrossChain).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    state.executeSearchOrLiveLookup();
  };

  return (
    <header className="relative z-30 flex flex-col gap-2 px-4 py-2.5 bg-[#111113]/85 backdrop-blur-md border-b border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Brand Identity + Case Selector */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => state.setAppSurface('landing')}
            title={t.nav.storyTooltip}
            className="flex items-center gap-2.5 text-left group cursor-pointer rounded-xl pr-2 hover:bg-white/[0.03] transition"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#18181B] border border-[#D4A359]/30 group-hover:border-[#D4A359]/70 shadow-[0_0_16px_rgba(212,163,89,0.18)] transition">
              <ArgusOrbitalLogo size={36} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#E04F33] animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#E04F33]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold tracking-wider text-sm text-white group-hover:text-[#D4A359] transition">
                  ARGUS
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-[#D4A359]/15 text-[#D4A359] border border-[#D4A359]/30 rounded">
                  v5.0 FORENSICS
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                {t.nav.brandSubtitle}
              </p>
            </div>
          </button>

          {/* Case Study Selector Dropdown + Deselect / Blank Workspace Button */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 bg-[#09090B]/90 border border-white/10 rounded-lg px-2.5 py-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-[#D4A359] shrink-0" />
              <select
                value={state.activeCaseId}
                onChange={(e) => state.selectCase(e.target.value)}
                className="bg-transparent text-xs font-mono text-zinc-200 focus:outline-none cursor-pointer pr-2"
              >
                <option value="custom-blank" className="bg-[#111113] text-[#D4A359] font-bold">
                  {t.nav.blankWorkspaceOption}
                </option>
                {state.cases.map((c) => {
                  const localized = LOCALIZED_CASES[state.language]?.[c.id];
                  return (
                    <option key={c.id} value={c.id} className="bg-[#111113] text-zinc-100">
                      {localized?.title || c.title}
                    </option>
                  );
                })}
              </select>
            </div>

            {state.activeCaseId !== 'custom-blank' && (
              <>
                {/* Case Ledger Granularity Switcher (Option C: Tactical Slice vs Full Attack Ledger) */}
                <div className="flex items-center bg-[#09090B]/95 border border-white/15 rounded-lg p-0.5 text-xs font-mono">
                  <button
                    type="button"
                    disabled={state.isLoadingArchive}
                    onClick={() => state.setCaseGranularity('tactical')}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition ${
                      state.caseGranularity === 'tactical'
                        ? 'bg-[#D4A359]/25 text-[#D4A359] border border-[#D4A359]/50 font-bold shadow-[0_0_10px_rgba(212,163,89,0.2)]'
                        : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                    title={t.nav.tacticalTooltip}
                  >
                    <Layers className="w-3 h-3 shrink-0" />
                    <span>{t.nav.tacticalMode}</span>
                    {state.archiveStats && (
                      <span className="text-[10px] opacity-80">
                        ({state.archiveStats.tacticalLinks})
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={state.isLoadingArchive}
                    onClick={() => state.setCaseGranularity('full_ledger')}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition ${
                      state.caseGranularity === 'full_ledger'
                        ? 'bg-[#4E9F76]/25 text-emerald-300 border border-emerald-500/50 font-bold shadow-[0_0_12px_rgba(78,159,118,0.25)]'
                        : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                    title={t.nav.fullLedgerTooltip}
                  >
                    {state.isLoadingArchive ? (
                      <Loader2 className="w-3 h-3 animate-spin text-emerald-400 shrink-0" />
                    ) : (
                      <Database className="w-3 h-3 shrink-0" />
                    )}
                    <span>{t.nav.fullLedgerMode}</span>
                    {state.archiveStats && (
                      <span className="text-[10px] opacity-90">
                        ({state.archiveStats.fullLinks})
                      </span>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => state.clearWorkspaceToBlank()}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 border border-rose-500/40 text-xs font-mono font-semibold transition"
                  title={state.language === 'fr' ? 'Désélectionner le cas et ouvrir un espace de travail vierge' : 'Deselect case study and start with a clean blank graph'}
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden xl:inline">{t.nav.newGraphBtn}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Universal Search Bar: Wallet Address / TxHash / Block # / ENS / Live RPC Lookup */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl min-w-[260px]">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={state.searchQuery}
              onChange={(e) => state.setSearchQuery(e.target.value)}
              placeholder={t.nav.searchPlaceholder}
              className="w-full pl-9 pr-56 py-1.5 text-xs font-mono bg-[#09090B]/90 text-zinc-100 placeholder-zinc-500 border border-white/10 rounded-lg focus:outline-none focus:border-[#D4A359]/60 focus:ring-1 focus:ring-[#D4A359]/30 transition"
            />
            {state.searchQuery && (
              <button
                type="button"
                onClick={() => state.setSearchQuery('')}
                className="absolute right-52 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="absolute right-1.5 flex items-center gap-1">
              {/* Chain Target Selector */}
              <select
                value={state.targetChainSelector}
                onChange={(e) => state.setTargetChainSelector(e.target.value as any)}
                className="text-[10px] font-mono bg-[#18181B] text-zinc-300 border border-white/10 rounded px-1.5 py-1 focus:outline-none cursor-pointer"
                title="Target blockchain for live lookup (or AUTO)"
              >
                <option value="AUTO">AUTO</option>
                <option value="ETH">ETH</option>
                <option value="BTC">BTC</option>
                <option value="TRX">TRX</option>
                <option value="ARB">ARB</option>
                <option value="OP">OP</option>
                <option value="BASE">BASE</option>
                <option value="BSC">BSC</option>
                <option value="SOL">SOL</option>
              </select>

              <button
                type="submit"
                disabled={state.isSearchingLive}
                className="px-2 py-1 text-[10px] font-mono font-semibold bg-[#D4A359]/20 hover:bg-[#D4A359]/30 text-[#D4A359] border border-[#D4A359]/40 rounded transition flex items-center gap-1"
                title="Search in current graph or add to graph"
              >
                {state.isSearchingLive ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>RPC...</span>
                  </>
                ) : (
                  <span>{t.nav.searchBtn}</span>
                )}
              </button>
              <button
                type="button"
                disabled={state.isSearchingLive || !state.searchQuery.trim()}
                onClick={() => state.startFreshGraphFromAddressOrTx(state.searchQuery)}
                className="px-2 py-1 text-[10px] font-mono font-bold bg-[#4E9F76]/20 hover:bg-[#4E9F76]/30 disabled:opacity-40 text-[#4E9F76] border border-[#4E9F76]/40 rounded transition flex items-center gap-1"
                title={t.blankWorkspace.buildBtn}
              >
                <PlusCircle className="w-3 h-3" />
                <span>+ GRAPH</span>
              </button>
            </div>
          </div>
        </form>

        {/* Live Laundering Sync Button for Binance 2026 */}
        {state.activeCaseId === 'binance-multichain-heist-2026' && (
          <button
            type="button"
            disabled={state.isRefreshingLive}
            onClick={() => state.refreshLiveCaseActivity()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-bold bg-[#E04F33]/20 hover:bg-[#E04F33]/30 text-[#E04F33] border border-[#E04F33]/40 rounded-lg shadow-[0_0_12px_rgba(224,79,51,0.2)] transition shrink-0 cursor-pointer"
            title="Interroger en direct les adresses Lazarus et synchroniser les nouvelles transactions du 31 octobre 2026"
          >
            {state.isRefreshingLive ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Activity className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Sync Live (31 Oct)</span>
          </button>
        )}

        {/* Chain Stratum Layer Toggles (ETH, ARB, BTC, SOL) + Workspace Mode Switcher + Language Selector */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-[#09090B]/80 p-1 rounded-lg border border-white/10">
            {(Object.keys(CHAIN_PLANES) as ChainId[]).map((chain) => {
              const cfg = CHAIN_PLANES[chain];
              const active = state.enabledChains[chain];
              return (
                <button
                  key={chain}
                  onClick={() => state.toggleChain(chain)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono transition ${
                    active
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'opacity-40 hover:opacity-75 text-zinc-500'
                  }`}
                  title={`${cfg.name} (Stratum Y=${cfg.y})`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: cfg.color,
                      boxShadow: active ? `0 0 8px ${cfg.color}` : 'none',
                    }}
                  />
                  <span>{chain}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode Switcher: 3D Graph | Split Hybrid | Classic Block Explorer */}
          <div className="flex items-center gap-1 bg-[#09090B]/90 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => state.setViewMode('3d')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition ${
                state.viewMode === '3d'
                  ? 'bg-[#D4A359]/20 text-[#D4A359] border border-[#D4A359]/40 font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Full-Screen 3D Spatial Forensics Visualizer"
            >
              <Box className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.nav.view3D}</span>
            </button>
            <button
              onClick={() => state.setViewMode('split')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition ${
                state.viewMode === 'split'
                  ? 'bg-[#D4A359]/20 text-[#D4A359] border border-[#D4A359]/40 font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Simultaneous 3D Spatial Graph + Classic Block Explorer Split View"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.nav.viewSplit}</span>
            </button>
            <button
              onClick={() => state.setViewMode('explorer')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition ${
                state.viewMode === 'explorer'
                  ? 'bg-[#D4A359]/20 text-[#D4A359] border border-[#D4A359]/40 font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Classic Block Explorer Mode (Check Wallets, Transactions, Blocks & Decoded CallData)"
            >
              <Table2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.nav.viewExplorer}</span>
            </button>
          </div>

          {/* In-App Story, Documentation & Guided Interactive Tour Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => state.setAppSurface('landing')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#D4A359]/20 text-[#D4A359] border border-[#D4A359]/40 text-xs font-mono font-bold transition"
              title={t.nav.storyTooltip}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{t.nav.storyBtn}</span>
            </button>

            <button
              onClick={() => state.setIsDocsModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#4E9F76]/20 hover:bg-[#4E9F76]/30 text-[#4E9F76] border border-[#4E9F76]/40 text-xs font-mono font-bold shadow-[0_0_12px_rgba(78,159,118,0.2)] transition"
              title="Open Complete How-To Documentation & Forensic Manual"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.nav.docsBtn}</span>
            </button>

            <button
              onClick={() => state.setActiveTourStep(0)}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#D4A359]/20 hover:bg-[#D4A359]/30 text-[#D4A359] border border-[#D4A359]/40 text-xs font-mono font-semibold transition"
              title="Start 6-Step Interactive Guided Tour"
            >
              <Play className="w-3 h-3" />
              <span>{t.nav.tourBtn}</span>
            </button>
          </div>

          {/* Language Selector FR / EN Toggle */}
          <div className="flex items-center bg-[#09090B]/90 border border-white/10 rounded-lg p-0.5" title={t.nav.langBtn}>
            <button
              type="button"
              onClick={() => state.setLanguage('fr')}
              className={`px-2 py-1 text-xs font-mono font-bold rounded flex items-center gap-1 transition ${
                state.language === 'fr'
                  ? 'bg-[#D4A359]/25 text-[#D4A359] border border-[#D4A359]/40 shadow-[0_0_8px_rgba(212,163,89,0.3)]'
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              <span>🇫🇷</span>
              <span>FR</span>
            </button>
            <button
              type="button"
              onClick={() => state.setLanguage('en')}
              className={`px-2 py-1 text-xs font-mono font-bold rounded flex items-center gap-1 transition ${
                state.language === 'en'
                  ? 'bg-[#D4A359]/25 text-[#D4A359] border border-[#D4A359]/40 shadow-[0_0_8px_rgba(212,163,89,0.3)]'
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>
        </div>
      </div>

      {/* Second Row: Live Forensic KPI Pills + Status Notification */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          {/* KPI 1: Total Volume Tracked */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#09090B]/70 border border-white/10">
            <Activity className="w-3.5 h-3.5 text-[#4E9F76]" />
            <span className="text-zinc-400">{t.nav.kpiTotalVolume}:</span>
            <span className="text-[#4E9F76] font-bold">
              ${(totalVolumeTracked / 1e6).toFixed(2)}M
            </span>
          </div>

          {/* KPI 2: Tainted Funds % */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#09090B]/70 border border-white/10">
            <ShieldAlert className="w-3.5 h-3.5 text-[#E04F33]" />
            <span className="text-zinc-400">{t.nav.kpiTaintedVolume}:</span>
            <span className="text-[#E04F33] font-bold">{taintedPercent}%</span>
            <span className="text-zinc-500">(${(taintedVolume / 1e6).toFixed(1)}M)</span>
          </div>

          {/* KPI 2b: Frozen vs Active Funds (Cryo-Cyan Badge) */}
          {frozenVolume > 0 && (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#0284C7]/20 border border-[#38BDF8]/40 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
              <span className="text-[#38BDF8] font-bold">❄️ GELÉ : ${(frozenVolume / 1e6).toFixed(1)}M</span>
              <span className="text-zinc-500">|</span>
              <span className="text-[#E04F33] font-bold">⚡ EN FUITE : ${((totalVolumeTracked - frozenVolume) / 1e6).toFixed(1)}M</span>
            </div>
          )}

          {/* KPI 3: Active Mixers Detected */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#09090B]/70 border border-white/10">
            <Cpu className="w-3.5 h-3.5 text-[#9D7CD8]" />
            <span className="text-zinc-400">{t.nav.kpiActiveMixers}:</span>
            <span className="text-[#9D7CD8] font-bold">{activeMixersCount} POOLS</span>
          </div>

          {/* KPI 4: Cross-Chain Hops */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#09090B]/70 border border-white/10">
            <GitCompare className="w-3.5 h-3.5 text-[#7C93A8]" />
            <span className="text-zinc-400">{t.nav.kpiCrossChainHops}:</span>
            <span className="text-[#7C93A8] font-bold">{crossChainHopsCount} BRIDGES</span>
          </div>

          {/* KPI 5: Entities & Txs Visible */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#09090B]/70 border border-white/10 text-zinc-300">
            <span>NODES: <b>{visibleNodes.length}</b></span>
            <span className="text-zinc-600">|</span>
            <span>LINKS: <b>{visibleLinks.length}</b></span>
          </div>

          {/* KPI 6: Provenance Certification Pill */}
          {state.nodes.length > 0 && state.nodes.every((n) => n.dataSource === 'live_onchain') && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.nav.verifiedArchiveBadge}</span>
            </div>
          )}
        </div>

        {/* Status Banner / Feedback Toast */}
        {state.statusBanner && (
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded text-xs max-w-2xl truncate transition shadow-lg ${
              state.statusBanner.includes('⚠️')
                ? 'bg-amber-950/85 border border-amber-500/70 text-amber-200'
                : state.statusBanner.includes('⚡')
                ? 'bg-emerald-950/85 border border-emerald-500/70 text-emerald-200'
                : 'bg-[#D4A359]/15 border border-[#D4A359]/40 text-zinc-200'
            }`}
          >
            <AlertTriangle
              className={`w-3.5 h-3.5 shrink-0 ${
                state.statusBanner.includes('⚠️')
                  ? 'text-amber-400 animate-pulse'
                  : state.statusBanner.includes('⚡')
                  ? 'text-emerald-400'
                  : 'text-[#D4A359]'
              }`}
            />
            <span className="truncate">{state.statusBanner}</span>
            <button
              onClick={() => state.clearStatusBanner()}
              className="text-zinc-400 hover:text-white ml-auto"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
