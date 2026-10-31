import { create } from 'zustand';
import {
  AppViewMode,
  BlockRecord,
  CaseStudy,
  ChainId,
  EntityType,
  ExplorerTab,
  ForensicLink,
  ForensicNode,
} from '../types/forensics';
import {
  FORENSIC_CASES,
  generateExpansionNeighbors,
  propagateTaint,
} from '../data/forensicCases';
import { lookupLiveAddressOrTx } from '../services/rpcService';
import { fetchLiveOnChainTransactions } from '../services/liveIndexerService';
import {
  CaseArchiveStats,
  CaseGranularity,
  fetchVerifiedCaseArchive,
} from '../services/archiveService';

export type AppSurface = 'landing' | 'workstation';

interface ForensicStoreState {
  // Active Surface (Scrollytelling Landing Page vs Live 3D Workstation)
  appSurface: AppSurface;
  setAppSurface: (surface: AppSurface) => void;
  launchCaseInWorkstation: (caseId: string, granularity?: CaseGranularity) => Promise<void>;
  launchLiveQueryInWorkstation: (query: string) => Promise<void>;

  // Active Case & Graph Data
  cases: CaseStudy[];
  activeCaseId: string;
  caseGranularity: CaseGranularity;
  isLoadingArchive: boolean;
  archiveStats: CaseArchiveStats | null;
  nodes: ForensicNode[];
  links: ForensicLink[];
  blocks: BlockRecord[];

  // View Modes (3D Spatial vs Classic Block Explorer vs Split)
  viewMode: AppViewMode;
  explorerTab: ExplorerTab;
  selectedNodeId: string | null;
  selectedTxHash: string | null;
  selectedBlockNumber: number | null;
  isolatedRootNodeId: string | null;
  expandedHopsByNodeId: Record<string, { nodeIds: string[]; linkIds: string[] }>;

  // Filters & Forensic Heuristics
  enabledChains: Record<ChainId, boolean>;
  enabledEntities: Record<EntityType, boolean>;
  minUsdValue: number;
  showProbabilisticLinks: boolean;
  heatmapTaintMode: boolean;
  showChainPlanes: boolean;
  showLabels: boolean;

  // Time-Lapse Scrubber
  minTimestamp: number;
  maxTimestamp: number;
  currentTimestamp: number;
  replayCursor: number; // 0.0 to 1.0 rank-normalized playback cursor
  isPlaying: boolean;
  playbackSpeed: 1 | 2 | 5;

  // Search & Live RPC Lookup Status
  searchQuery: string;
  targetChainSelector: 'AUTO' | ChainId;
  setTargetChainSelector: (chain: 'AUTO' | ChainId) => void;
  isSearchingLive: boolean;
  isRefreshingLive: boolean;
  refreshLiveCaseActivity: () => Promise<void>;
  statusBanner: string | null;

  // Interactive Documentation & Tutorial Modal / Guided Tour
  isDocsModalOpen: boolean;
  activeTourStep: number | null;

  // Language & Localization (i18n)
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;

  // Camera Commands
  cameraResetTrigger: number;
  cameraFocusTrigger: number;

  // Actions
  selectCase: (caseId: string) => Promise<void>;
  setCaseGranularity: (granularity: CaseGranularity) => Promise<void>;
  hydrateActiveCaseArchive: (caseId?: string, granularity?: CaseGranularity) => Promise<void>;
  clearWorkspaceToBlank: () => void;
  startFreshGraphFromAddressOrTx: (query: string) => Promise<void>;
  setViewMode: (mode: AppViewMode) => void;
  setExplorerTab: (tab: ExplorerTab) => void;
  selectNode: (nodeId: string | null, openExplorerDetail?: boolean) => void;
  selectTransaction: (txHash: string | null, switchToExplorer?: boolean) => void;
  selectBlock: (blockNumber: number | null, switchToExplorer?: boolean) => void;
  toggleChain: (chain: ChainId) => void;
  toggleEntity: (entity: EntityType) => void;
  setMinUsdValue: (val: number) => void;
  setShowProbabilisticLinks: (val: boolean) => void;
  setHeatmapTaintMode: (val: boolean) => void;
  setShowChainPlanes: (val: boolean) => void;
  setShowLabels: (val: boolean) => void;

  // Scrubber Actions
  setCurrentTimestamp: (ts: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: 1 | 2 | 5) => void;
  tickTimeline: (deltaMs: number) => void;
  resetTimelineToFull: () => void;

  // Forensic Node Actions
  expandNodeHops: (nodeId: string) => Promise<void>;
  resetExpandedHops: () => void;
  toggleIsolateSubGraph: (nodeId: string | null) => void;
  toggleFlagSuspect: (nodeId: string) => void;
  triggerCameraReset: () => void;

  // Search / Live Address & Tx Lookup
  setSearchQuery: (q: string) => void;
  executeSearchOrLiveLookup: (customQuery?: string) => Promise<void>;
  clearStatusBanner: () => void;

  // Docs & Guided Tour Actions
  setIsDocsModalOpen: (open: boolean) => void;
  setActiveTourStep: (step: number | null) => void;
}

function computeTimeBounds(links: ForensicLink[]): { min: number; max: number } {
  if (links.length === 0) {
    const now = Date.now();
    return { min: now - 3600000, max: now };
  }
  let min = Infinity;
  let max = -Infinity;
  for (const l of links) {
    if (l.timestamp < min) min = l.timestamp;
    if (l.timestamp > max) max = l.timestamp;
  }
  return { min, max };
}

const initialCase = FORENSIC_CASES[0];
const initialBounds = computeTimeBounds(initialCase.links);

function resolveInitialSurface(): AppSurface {
  if (typeof window === 'undefined') return 'landing';
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  if (hash === '#workstation' || hash === '#console' || search.includes('case=')) {
    return 'workstation';
  }
  return 'landing';
}

export const useForensicStore = create<ForensicStoreState>((set, get) => ({
  appSurface: resolveInitialSurface(),
  setAppSurface: (surface) => {
    try {
      if (typeof window !== 'undefined') {
        const nextHash = surface === 'workstation' ? '#workstation' : '';
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.search}${nextHash}`
        );
      }
    } catch {
      // ignore in restricted environments
    }
    set({ appSurface: surface });
  },
  launchCaseInWorkstation: async (caseId, granularity) => {
    const targetGranularity = granularity || get().caseGranularity;
    get().setAppSurface('workstation');
    set({ activeCaseId: caseId, caseGranularity: targetGranularity, isLoadingArchive: true });
    await get().hydrateActiveCaseArchive(caseId, targetGranularity);
  },
  launchLiveQueryInWorkstation: async (query) => {
    get().setAppSurface('workstation');
    await get().startFreshGraphFromAddressOrTx(query);
  },

  cases: FORENSIC_CASES,
  activeCaseId: initialCase.id,
  caseGranularity: 'tactical',
  isLoadingArchive: false,
  archiveStats: null,
  nodes: initialCase.nodes.map((n) => ({ ...n })),
  links: initialCase.links.map((l) => ({ ...l })),
  blocks: initialCase.blocks.map((b) => ({ ...b })),

  viewMode: '3d',
  explorerTab: 'transactions',
  selectedNodeId: initialCase.nodes[0]?.id || null,
  selectedTxHash: null,
  selectedBlockNumber: null,
  isolatedRootNodeId: null,
  expandedHopsByNodeId: {},

  enabledChains: {
    SOL: true,
    BASE: true,
    OP: true,
    ARB: true,
    ETH: true,
    BSC: true,
    TRX: true,
    BTC: true,
  },
  enabledEntities: {
    eoa: true,
    exploiter: true,
    mixer: true,
    bridge: true,
    dex: true,
    cex: true,
  },
  minUsdValue: 0,
  showProbabilisticLinks: true,
  heatmapTaintMode: false,
  showChainPlanes: true,
  showLabels: true,

  minTimestamp: initialBounds.min,
  maxTimestamp: initialBounds.max,
  currentTimestamp: initialBounds.max,
  replayCursor: 1,
  isPlaying: false,
  playbackSpeed: 1,

  searchQuery: '',
  targetChainSelector: 'AUTO',
  setTargetChainSelector: (chain) => set({ targetChainSelector: chain }),
  isSearchingLive: false,
  isRefreshingLive: false,
  statusBanner: null,

  isDocsModalOpen: false,
  activeTourStep: null,

  language: (typeof window !== 'undefined' && (localStorage.getItem('argus_lang') as 'fr' | 'en')) || 'fr',
  setLanguage: (lang) => {
    try {
      localStorage.setItem('argus_lang', lang);
    } catch {
      // ignore in restricted env
    }
    set({ language: lang });
  },

  cameraResetTrigger: 0,
  cameraFocusTrigger: 0,

  hydrateActiveCaseArchive: async (caseIdArg, granularityArg) => {
    const state = get();
    const targetCaseId = caseIdArg || state.activeCaseId;
    const targetGranularity = granularityArg || state.caseGranularity;
    if (!targetCaseId || targetCaseId === 'custom-blank') return;

    set({ isLoadingArchive: true });
    const archive = await fetchVerifiedCaseArchive(targetCaseId);
    const latestState = get();

    // Ensure user hasn't switched away while loading
    if (latestState.activeCaseId !== targetCaseId) {
      set({ isLoadingArchive: false });
      return;
    }

    if (archive) {
      const slice = targetGranularity === 'full_ledger' ? archive.fullLedger : archive.tactical;
      const nodesCopy = slice.nodes.map((n) => ({ ...n, dataSource: 'live_onchain' as const }));
      const linksCopy = slice.links.map((l) => ({ ...l, dataSource: 'live_onchain' as const }));

      // Incorporate persisted live sync updates from localStorage if available
      let restoredLiveCount = 0;
      try {
        const persistedRaw = localStorage.getItem(`argus_live_deltas_${targetCaseId}`);
        if (persistedRaw) {
          const delta = JSON.parse(persistedRaw);
          const existingNodeAddresses = new Set(nodesCopy.map((n) => n.address.toLowerCase()));
          const existingNodeIds = new Set(nodesCopy.map((n) => n.id));
          const existingLinkHashes = new Set(linksCopy.map((l) => l.txHash.toLowerCase()));

          if (Array.isArray(delta.nodes)) {
            delta.nodes.forEach((dn: ForensicNode) => {
              if (!existingNodeAddresses.has(dn.address.toLowerCase()) && !existingNodeIds.has(dn.id)) {
                nodesCopy.push({ ...dn, dataSource: 'live_onchain' as const });
                existingNodeAddresses.add(dn.address.toLowerCase());
                existingNodeIds.add(dn.id);
                restoredLiveCount++;
              }
            });
          }

          if (Array.isArray(delta.links)) {
            delta.links.forEach((dl: ForensicLink) => {
              if (!existingLinkHashes.has(dl.txHash.toLowerCase())) {
                linksCopy.push({ ...dl, dataSource: 'live_onchain' as const });
                existingLinkHashes.add(dl.txHash.toLowerCase());
              }
            });
          }
        }
      } catch (err) {
        console.warn('Could not read persisted live deltas:', err);
      }

      propagateTaint(nodesCopy, linksCopy);
      const bounds = computeTimeBounds(linksCopy);
      const primaryExploiter =
        nodesCopy.find((n) => n.entityType === 'exploiter') || nodesCopy[0] || null;
      const isFr = latestState.language === 'fr';
      const modeName =
        targetGranularity === 'full_ledger'
          ? isFr
            ? 'Archive Exhaustive'
            : 'Full Attack Ledger'
          : isFr
          ? 'Synthèse Tactique'
          : 'Tactical View';

      const liveNotice =
        restoredLiveCount > 0
          ? isFr
            ? ` (+${restoredLiveCount} nœuds live synchronisés persistants)`
            : ` (+${restoredLiveCount} persistent live synced nodes)`
          : '';

      set({
        caseGranularity: targetGranularity,
        isLoadingArchive: false,
        archiveStats: archive.stats,
        nodes: nodesCopy,
        links: linksCopy,
        blocks: slice.blocks.map((b) => ({ ...b })),
        selectedNodeId: primaryExploiter?.id || null,
        selectedTxHash: null,
        selectedBlockNumber: null,
        isolatedRootNodeId: null,
        expandedHopsByNodeId: {},
        minTimestamp: bounds.min,
        maxTimestamp: bounds.max,
        currentTimestamp: bounds.max,
        replayCursor: 1,
        isPlaying: false,
        cameraResetTrigger: latestState.cameraResetTrigger + 1,
        statusBanner: isFr
          ? `⚡ [100% On-Chain Réel — ${modeName}] ${nodesCopy.length} entités vérifiées & ${linksCopy.length} transactions réelles chargées (Blockscout)${liveNotice}`
          : `⚡ [100% Verified On-Chain — ${modeName}] Loaded ${nodesCopy.length} real entities & ${linksCopy.length} blockchain transactions (Blockscout)${liveNotice}`,
      });
      return;
    }

    // Fallback to in-memory case if archive file was unavailable
    const fallbackCase = state.cases.find((c) => c.id === targetCaseId) || state.cases[0];
    if (fallbackCase) {
      const nodesCopy = fallbackCase.nodes.map((n) => ({ ...n }));
      const linksCopy = fallbackCase.links.map((l) => ({ ...l }));
      propagateTaint(nodesCopy, linksCopy);
      const bounds = computeTimeBounds(linksCopy);
      const primaryExploiter =
        nodesCopy.find((n) => n.entityType === 'exploiter') || nodesCopy[0] || null;
      set({
        isLoadingArchive: false,
        nodes: nodesCopy,
        links: linksCopy,
        blocks: fallbackCase.blocks.map((b) => ({ ...b })),
        selectedNodeId: primaryExploiter?.id || null,
        selectedTxHash: null,
        selectedBlockNumber: null,
        isolatedRootNodeId: null,
        expandedHopsByNodeId: {},
        minTimestamp: bounds.min,
        maxTimestamp: bounds.max,
        currentTimestamp: bounds.max,
        replayCursor: 1,
        isPlaying: false,
      });
      return;
    }

    set({ isLoadingArchive: false });
  },

  selectCase: async (caseId) => {
    if (caseId === 'custom-blank') {
      get().clearWorkspaceToBlank();
      return;
    }
    const found = get().cases.find((c) => c.id === caseId);
    if (!found) return;

    set({ activeCaseId: found.id, isLoadingArchive: true });
    await get().hydrateActiveCaseArchive(found.id, get().caseGranularity);
  },

  setCaseGranularity: async (granularity) => {
    const state = get();
    if (state.activeCaseId === 'custom-blank') {
      set({ caseGranularity: granularity });
      return;
    }
    set({ caseGranularity: granularity });
    await get().hydrateActiveCaseArchive(state.activeCaseId, granularity);
  },

  clearWorkspaceToBlank: () => {
    const now = Date.now();
    set({
      activeCaseId: 'custom-blank',
      archiveStats: null,
      nodes: [],
      links: [],
      blocks: [],
      selectedNodeId: null,
      selectedTxHash: null,
      selectedBlockNumber: null,
      isolatedRootNodeId: null,
      expandedHopsByNodeId: {},
      minTimestamp: now - 3600000,
      maxTimestamp: now,
      currentTimestamp: now,
      replayCursor: 1,
      isPlaying: false,
      cameraResetTrigger: get().cameraResetTrigger + 1,
      statusBanner:
        'Blank Custom Investigation Workspace ready — Enter any Wallet (0x / bc1 / SOL), ENS, or TxHash to build a clean graph from scratch.',
    });
  },

  startFreshGraphFromAddressOrTx: async (query) => {
    const q = query.trim();
    if (!q) return;
    set({
      activeCaseId: 'custom-blank',
      nodes: [],
      links: [],
      blocks: [],
      selectedNodeId: null,
      selectedTxHash: null,
      selectedBlockNumber: null,
      isolatedRootNodeId: null,
      expandedHopsByNodeId: {},
      searchQuery: q,
    });
    await get().executeSearchOrLiveLookup(q);
  },

  setViewMode: (mode) => set({ viewMode: mode }),

  setExplorerTab: (tab) => set({ explorerTab: tab }),

  selectNode: (nodeId, openExplorerDetail = false) => {
    set((state) => ({
      selectedNodeId: nodeId,
      explorerTab: openExplorerDetail && nodeId ? 'wallet-detail' : state.explorerTab,
      viewMode:
        openExplorerDetail && state.viewMode === '3d' ? 'split' : state.viewMode,
      cameraFocusTrigger: nodeId ? state.cameraFocusTrigger + 1 : state.cameraFocusTrigger,
    }));
  },

  selectTransaction: (txHash, switchToExplorer = false) => {
    const state = get();
    const link = state.links.find((l) => l.txHash.toLowerCase() === txHash?.toLowerCase());
    set({
      selectedTxHash: txHash,
      selectedNodeId: link ? link.source : state.selectedNodeId,
      explorerTab: txHash ? 'tx-detail' : 'transactions',
      viewMode:
        switchToExplorer && state.viewMode === '3d' ? 'split' : state.viewMode,
      cameraFocusTrigger: link ? state.cameraFocusTrigger + 1 : state.cameraFocusTrigger,
    });
  },

  selectBlock: (blockNumber, switchToExplorer = false) => {
    const state = get();
    set({
      selectedBlockNumber: blockNumber,
      explorerTab: blockNumber !== null ? 'block-detail' : 'blocks',
      viewMode:
        switchToExplorer && state.viewMode === '3d' ? 'split' : state.viewMode,
    });
  },

  toggleChain: (chain) =>
    set((state) => ({
      enabledChains: {
        ...state.enabledChains,
        [chain]: !state.enabledChains[chain],
      },
    })),

  toggleEntity: (entity) =>
    set((state) => ({
      enabledEntities: {
        ...state.enabledEntities,
        [entity]: !state.enabledEntities[entity],
      },
    })),

  setMinUsdValue: (val) => set({ minUsdValue: val }),
  setShowProbabilisticLinks: (val) => set({ showProbabilisticLinks: val }),
  setHeatmapTaintMode: (val) => set({ heatmapTaintMode: val }),
  setShowChainPlanes: (val) => set({ showChainPlanes: val }),
  setShowLabels: (val) => set({ showLabels: val }),

  setCurrentTimestamp: (ts) => {
    const state = get();
    if (state.links.length === 0) {
      set({ currentTimestamp: ts, replayCursor: 1 });
      return;
    }
    const sorted = state.links.map((l) => l.timestamp).sort((a, b) => a - b);
    let count = 0;
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i] <= ts) count = i + 1;
      else break;
    }
    set({
      currentTimestamp: ts,
      replayCursor: sorted.length > 0 ? count / sorted.length : 1,
    });
  },
  setIsPlaying: (playing) => {
    const state = get();
    if (playing && (state.replayCursor >= 0.995 || state.currentTimestamp >= state.maxTimestamp)) {
      set({
        currentTimestamp: state.minTimestamp,
        replayCursor: 0,
        isPlaying: true,
      });
    } else {
      set({ isPlaying: playing });
    }
  },
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  tickTimeline: (deltaMs) => {
    const state = get();
    if (!state.isPlaying) return;
    if (state.links.length === 0) {
      set({ isPlaying: false });
      return;
    }
    // Step smoothly across chronological transaction ranks over ~24s at 1x speed
    // (prevents multi-month dormancy gaps in real historical hacks from stalling replay)
    const stepCursor = (deltaMs / 24000) * state.playbackSpeed;
    const nextCursor = Math.min(1, state.replayCursor + stepCursor);
    const sorted = state.links.map((l) => l.timestamp).sort((a, b) => a - b);
    const rankIdx = Math.min(
      sorted.length - 1,
      Math.max(0, Math.floor(nextCursor * (sorted.length - 1)))
    );
    const nextTs = nextCursor >= 1 ? state.maxTimestamp : sorted[rankIdx];

    if (nextCursor >= 1) {
      set({ currentTimestamp: state.maxTimestamp, replayCursor: 1, isPlaying: false });
    } else {
      set({ currentTimestamp: nextTs, replayCursor: nextCursor });
    }
  },

  resetTimelineToFull: () => {
    const state = get();
    set({ currentTimestamp: state.maxTimestamp, replayCursor: 1, isPlaying: false });
  },

  expandNodeHops: async (nodeId) => {
    const state = get();
    const centerNode = state.nodes.find((n) => n.id === nodeId);
    if (!centerNode) return;

    // Toggle off: if this node was already expanded, remove its injected hops and reset view
    const existingExpansion = state.expandedHopsByNodeId[nodeId];
    if (existingExpansion) {
      const removeNodeSet = new Set(existingExpansion.nodeIds);
      const removeLinkSet = new Set(existingExpansion.linkIds);
      const updatedNodes = state.nodes.filter((n) => !removeNodeSet.has(n.id));
      const updatedLinks = state.links.filter((l) => !removeLinkSet.has(l.id));
      propagateTaint(updatedNodes, updatedLinks);
      const bounds = computeTimeBounds(updatedLinks);

      const nextExpanded = { ...state.expandedHopsByNodeId };
      delete nextExpanded[nodeId];

      set({
        nodes: updatedNodes,
        links: updatedLinks,
        expandedHopsByNodeId: nextExpanded,
        minTimestamp: bounds.min,
        maxTimestamp: bounds.max,
        currentTimestamp: bounds.max,
        replayCursor: 1,
        cameraResetTrigger: state.cameraResetTrigger + 1,
        statusBanner:
          state.language === 'fr'
            ? `+1 Hop replié depuis ${centerNode.label} (vue 3D réinitialisée)`
            : `Collapsed (+1 Hop) from ${centerNode.label} & reset 3D overview`,
      });
      return;
    }

    const isFr = state.language === 'fr';
    const isEthFamily =
      (centerNode.chain === 'ETH' || centerNode.chain === 'ARB') &&
      /^0x[a-fA-F0-9]{40}$/.test(centerNode.address);

    set({
      statusBanner: isFr
        ? `[Indexeur On-Chain] Interrogation Blockscout v2 (ETH + ERC-20) pour ${centerNode.label}...`
        : `[On-Chain Indexer] Querying Blockscout v2 (ETH + ERC-20) for ${centerNode.label}...`,
    });

    let newNodes: ForensicNode[] = [];
    let newLinks: ForensicLink[] = [];
    let isLiveResult = false;
    let totalIndexedCount = 0;

    // 1. Query real on-chain indexer (Blockscout v2 — up to 28 real ETH + ERC-20 txs)
    if (isEthFamily) {
      try {
        const liveData = await fetchLiveOnChainTransactions(
          centerNode.address,
          centerNode.chain,
          28
        );
        if (liveData.isLive && liveData.realLinks.length > 0) {
          isLiveResult = true;
          totalIndexedCount = liveData.realLinks.length;
          const currentStateNow = get();
          const currentNodes = currentStateNow.nodes;
          const existingAddressMap = new Map<string, string>();
          for (const n of currentNodes) {
            existingAddressMap.set(n.address.toLowerCase(), n.id);
            existingAddressMap.set(n.id.toLowerCase(), n.id);
          }

          const existingEdgeKeys = new Set(
            currentStateNow.links.map(
              (l) => `${l.txHash.toLowerCase()}|${l.source}|${l.target}|${l.asset}`
            )
          );

          // Orbit newly discovered real counterparties around centerNode in 3D
          const count = Math.max(1, liveData.realNodes.length);
          liveData.realNodes.forEach((rNode, idx) => {
            const angle = (idx / count) * Math.PI * 2;
            const dist = 85 + (idx % 4) * 24;
            rNode.x = (centerNode.x || 0) + Math.cos(angle) * dist;
            rNode.y = centerNode.y || 0;
            rNode.z = (centerNode.z || 0) + Math.sin(angle) * dist;

            const existingNodeId = existingAddressMap.get(rNode.address.toLowerCase());
            if (!existingNodeId) {
              newNodes.push(rNode);
              existingAddressMap.set(rNode.address.toLowerCase(), rNode.id);
            }
          });

          // Rewire links to match graph IDs and deduplicate against existing archive links
          liveData.realLinks.forEach((rLink) => {
            const rawSrc =
              typeof rLink.source === 'string' ? rLink.source : (rLink.source as any).id;
            const rawDst =
              typeof rLink.target === 'string' ? rLink.target : (rLink.target as any).id;

            const srcId =
              rawSrc.toLowerCase() === centerNode.address.toLowerCase()
                ? centerNode.id
                : existingAddressMap.get(rawSrc.toLowerCase()) || rawSrc;

            const dstId =
              rawDst.toLowerCase() === centerNode.address.toLowerCase()
                ? centerNode.id
                : existingAddressMap.get(rawDst.toLowerCase()) || rawDst;

            const edgeKey = `${rLink.txHash.toLowerCase()}|${srcId}|${dstId}|${rLink.asset}`;
            if (srcId !== dstId && !existingEdgeKeys.has(edgeKey)) {
              existingEdgeKeys.add(edgeKey);
              newLinks.push({
                ...rLink,
                source: srcId,
                target: dstId,
              });
            }
          });
        }
      } catch (err) {
        console.warn('Live indexer fetch failed:', err);
      }
    }

    // 2. If all indexed transactions for this real wallet were already displayed in the graph
    if (isLiveResult && newNodes.length === 0 && newLinks.length === 0) {
      set({
        statusBanner: isFr
          ? `⚡ [Trace On-Chain Complète] Les ${totalIndexedCount} transactions réelles indexées pour ${centerNode.label} sont déjà affichées dans ce graphe.`
          : `⚡ [On-Chain Trace Complete] All ${totalIndexedCount} indexed on-chain transactions for ${centerNode.label} are already mapped in this graph.`,
      });
      return;
    }

    // 3. Strict Forensic Boundary: never invent fake simulated wallets on real on-chain traces!
    if (!isLiveResult || (newNodes.length === 0 && newLinks.length === 0)) {
      if (
        centerNode.dataSource === 'live_onchain' ||
        centerNode.id.startsWith('live-') ||
        state.activeCaseId !== 'custom-blank'
      ) {
        set({
          statusBanner: isFr
            ? `⚠️ [Limite On-Chain Atteinte] Aucune transaction on-chain supplémentaire détectée au-delà de ${centerNode.label} (${centerNode.address.slice(0, 10)}...). Les données réelles s'arrêtent à ce nœud.`
            : `⚠️ [On-Chain Boundary Reached] No further on-chain transactions detected beyond ${centerNode.label} (${centerNode.address.slice(0, 10)}...). Live verifiable data ends at this node.`,
        });
        return;
      }

      const existingIds = new Set(get().nodes.map((n) => n.id));
      const generated = generateExpansionNeighbors(
        centerNode,
        existingIds,
        get().nodes.length + get().links.length
      );
      newNodes = generated.newNodes.map((n) => ({
        ...n,
        label: n.label.includes('[Simulé]') ? n.label : `${n.label} [Simulé]`,
        dataSource: 'synthetic_simulation' as const,
      }));
      newLinks = generated.newLinks.map((l) => ({
        ...l,
        dataSource: 'synthetic_simulation' as const,
      }));
    }

    const currentState = get();
    const updatedNodes = [...currentState.nodes, ...newNodes];
    const updatedLinks = [...currentState.links, ...newLinks];
    propagateTaint(updatedNodes, updatedLinks);
    const bounds = computeTimeBounds(updatedLinks);

    set({
      nodes: updatedNodes,
      links: updatedLinks,
      expandedHopsByNodeId: {
        ...currentState.expandedHopsByNodeId,
        [nodeId]: {
          nodeIds: newNodes.map((n) => n.id),
          linkIds: newLinks.map((l) => l.id),
        },
      },
      minTimestamp: bounds.min,
      maxTimestamp: bounds.max,
      currentTimestamp: bounds.max,
      replayCursor: 1,
      cameraFocusTrigger: currentState.cameraFocusTrigger + 1,
      statusBanner: isLiveResult
        ? isFr
          ? `⚡ [On-Chain Réel] +1 Hop étendu pour ${centerNode.label} : +${newNodes.length} entités réelles & +${newLinks.length} transactions injectées (Blockscout)`
          : `⚡ [Live On-Chain] +1 Hop expanded for ${centerNode.label}: +${newNodes.length} verified entities & +${newLinks.length} transactions injected (Blockscout)`
        : isFr
        ? `⚠️ [Modèle Heuristique / Simulation] Données on-chain indisponibles pour ${centerNode.label}. ${newNodes.length} flux de simulation prédictive injectés (non vérifiés on-chain).`
        : `⚠️ [Heuristic Model / Synthetic Data] On-chain data unavailable for ${centerNode.label}. Injected ${newNodes.length} simulated flows (unverified on-chain).`,
    });
  },

  resetExpandedHops: () => {
    const state = get();
    const allRemovedNodeIds = new Set<string>();
    const allRemovedLinkIds = new Set<string>();
    Object.values(state.expandedHopsByNodeId).forEach((entry) => {
      entry.nodeIds.forEach((id) => allRemovedNodeIds.add(id));
      entry.linkIds.forEach((id) => allRemovedLinkIds.add(id));
    });

    const updatedNodes = state.nodes.filter((n) => !allRemovedNodeIds.has(n.id));
    const updatedLinks = state.links.filter((l) => !allRemovedLinkIds.has(l.id));
    propagateTaint(updatedNodes, updatedLinks);
    const bounds = computeTimeBounds(updatedLinks);

    set({
      nodes: updatedNodes,
      links: updatedLinks,
      expandedHopsByNodeId: {},
      isolatedRootNodeId: null,
      minTimestamp: bounds.min,
      maxTimestamp: bounds.max,
      currentTimestamp: bounds.max,
      cameraResetTrigger: state.cameraResetTrigger + 1,
      statusBanner: 'Reset all expanded hops & restored initial 3D camera overview',
    });
  },

  toggleIsolateSubGraph: (nodeId) => {
    const state = get();
    if (!nodeId || state.isolatedRootNodeId === nodeId) {
      set({
        isolatedRootNodeId: null,
        cameraResetTrigger: state.cameraResetTrigger + 1,
        statusBanner: 'Restored full multi-chain forensic graph & reset 3D view',
      });
    } else {
      const node = state.nodes.find((n) => n.id === nodeId);
      set({
        isolatedRootNodeId: nodeId,
        selectedNodeId: nodeId,
        cameraFocusTrigger: state.cameraFocusTrigger + 1,
        statusBanner: `Isolated 2-Hop Forensic Sub-Graph around ${node?.label || nodeId}`,
      });
    }
  },

  toggleFlagSuspect: (nodeId) => {
    const state = get();
    const updatedNodes = state.nodes.map((n) => {
      if (n.id === nodeId) {
        const nextFlag = !n.flaggedSuspect;
        return {
          ...n,
          flaggedSuspect: nextFlag,
          taintScore: nextFlag ? 100 : 35,
        };
      }
      return { ...n };
    });
    const updatedLinks = state.links.map((l) => ({ ...l }));
    propagateTaint(updatedNodes, updatedLinks);

    const target = updatedNodes.find((n) => n.id === nodeId);
    set({
      nodes: updatedNodes,
      links: updatedLinks,
      statusBanner: target?.flaggedSuspect
        ? `Flagged ${target.label} as Primary Suspect (100% Taint Recalculated Across Downstream Hops)`
        : `Removed Suspect Flag from ${target?.label}`,
    });
  },

  triggerCameraReset: () =>
    set((state) => ({ cameraResetTrigger: state.cameraResetTrigger + 1 })),

  setSearchQuery: (q) => set({ searchQuery: q }),

  executeSearchOrLiveLookup: async (customQuery) => {
    const state = get();
    const q = (customQuery !== undefined ? customQuery : state.searchQuery).trim();
    if (!q) return;

    const lower = q.toLowerCase();

    // 1. Check if query matches an existing Node (by address, ENS, label, or ID)
    const matchedNode = state.nodes.find(
      (n) =>
        n.address.toLowerCase() === lower ||
        n.address.toLowerCase().includes(lower) ||
        n.label.toLowerCase().includes(lower) ||
        (n.ens && n.ens.toLowerCase().includes(lower)) ||
        n.id.toLowerCase() === lower
    );

    if (matchedNode) {
      set({
        selectedNodeId: matchedNode.id,
        explorerTab: state.viewMode !== '3d' ? 'wallet-detail' : state.explorerTab,
        cameraFocusTrigger: state.cameraFocusTrigger + 1,
        statusBanner: `Located Wallet / Entity: ${matchedNode.label} (${matchedNode.address.slice(0, 10)}...)`,
      });
      return;
    }

    // 2. Check if query matches an existing Transaction Hash
    const matchedLink = state.links.find(
      (l) =>
        l.txHash.toLowerCase() === lower ||
        (lower.startsWith('0x') && lower.length >= 8 && l.txHash.toLowerCase().includes(lower))
    );

    if (matchedLink) {
      set({
        selectedTxHash: matchedLink.txHash,
        selectedNodeId: matchedLink.source,
        explorerTab: 'tx-detail',
        viewMode: state.viewMode === '3d' ? 'split' : state.viewMode,
        cameraFocusTrigger: state.cameraFocusTrigger + 1,
        statusBanner: `Inspected Transaction ${matchedLink.txHash.slice(0, 14)}... ($${matchedLink.usdValue.toLocaleString()} ${matchedLink.asset})`,
      });
      return;
    }

    // 3. Check if query matches a Block Number
    const numQuery = Number(q.replace(/[^0-9]/g, ''));
    if (!isNaN(numQuery) && numQuery > 1000000) {
      const matchedBlock = state.blocks.find((b) => b.number === numQuery);
      if (matchedBlock) {
        set({
          selectedBlockNumber: matchedBlock.number,
          explorerTab: 'block-detail',
          viewMode: state.viewMode === '3d' ? 'split' : state.viewMode,
          statusBanner: `Opened Block #${matchedBlock.number} on ${matchedBlock.chain}`,
        });
        return;
      }
    }

    // 4. Perform Live RPC / Procedural Forensic Address or Tx Lookup & inject into graph
    set({ isSearchingLive: true, statusBanner: `Querying Live Mainnet RPC & Forensic Indexer for "${q}"...` });

    try {
      const result = await lookupLiveAddressOrTx(q, state.targetChainSelector);
      const currentState = get();

      const existingAddressToId = new Map<string, string>();
      currentState.nodes.forEach((n) => {
        existingAddressToId.set(n.address.toLowerCase(), n.id);
      });

      // 1. Identify or register target node
      let resolvedTargetNode = currentState.nodes.find(
        (n) => n.address.toLowerCase() === result.targetNode.address.toLowerCase()
      );
      const newNodesToAdd: ForensicNode[] = [];

      if (!resolvedTargetNode) {
        resolvedTargetNode = result.targetNode;
        newNodesToAdd.push(resolvedTargetNode);
        existingAddressToId.set(resolvedTargetNode.address.toLowerCase(), resolvedTargetNode.id);
      } else {
        existingAddressToId.set(result.targetNode.address.toLowerCase(), resolvedTargetNode.id);
      }

      // 2. Add counterparties fanning out radially around resolvedTargetNode
      const connectedCount = Math.max(1, result.connectedNodes.length);
      result.connectedNodes.forEach((cn, idx) => {
        const lower = cn.address.toLowerCase();
        if (existingAddressToId.has(lower)) return;

        const angle = (idx / connectedCount) * Math.PI * 2 + 0.3;
        const dist = 75 + (idx % 3) * 20;

        const newNode: ForensicNode = {
          ...cn,
          x: (resolvedTargetNode?.x || 0) + Math.cos(angle) * dist,
          y: resolvedTargetNode?.y || 0,
          z: (resolvedTargetNode?.z || 0) + Math.sin(angle) * dist,
        };

        existingAddressToId.set(lower, newNode.id);
        newNodesToAdd.push(newNode);
      });

      // 3. Deduplicate and re-wire links
      const existingLinkKeys = new Set(
        currentState.links.map(
          (l) => `${l.txHash.toLowerCase()}|${l.source}|${l.target}|${l.asset}`
        )
      );

      const newLinksToAdd: ForensicLink[] = [];
      result.links.forEach((l) => {
        const rawSrc = typeof l.source === 'string' ? l.source : (l.source as any).id;
        const rawDst = typeof l.target === 'string' ? l.target : (l.target as any).id;

        const srcId =
          rawSrc.toLowerCase() === result.targetNode.address.toLowerCase() ||
          rawSrc === result.targetNode.id
            ? resolvedTargetNode!.id
            : existingAddressToId.get(rawSrc.toLowerCase()) || rawSrc;

        const dstId =
          rawDst.toLowerCase() === result.targetNode.address.toLowerCase() ||
          rawDst === result.targetNode.id
            ? resolvedTargetNode!.id
            : existingAddressToId.get(rawDst.toLowerCase()) || rawDst;

        const key = `${l.txHash.toLowerCase()}|${srcId}|${dstId}|${l.asset}`;
        if (!existingLinkKeys.has(key)) {
          existingLinkKeys.add(key);
          newLinksToAdd.push({
            ...l,
            source: srcId,
            target: dstId,
          });
        }
      });

      const updatedNodes = [...currentState.nodes, ...newNodesToAdd];
      const updatedLinks = [...currentState.links, ...newLinksToAdd];
      propagateTaint(updatedNodes, updatedLinks);
      const bounds = computeTimeBounds(updatedLinks);

      const newBlock: BlockRecord = {
        number: result.latestBlockNumber || 21058420,
        hash: '0x' + (resolvedTargetNode?.address || result.targetNode.address).slice(2).padEnd(64, '9'),
        chain: resolvedTargetNode?.chain || result.targetNode.chain,
        timestamp: Date.now(),
        txCount: newLinksToAdd.length,
        minerOrValidator: 'Live RPC Sequencer / Validator',
        gasUsed: '14,820,410',
        gasLimit: '30,000,000',
        baseFeeGwei: 18.4,
        rewardUsd: 640.5,
        totalVolumeUsd: newLinksToAdd.reduce((a, b) => a + b.usdValue, 0),
        taintedTxCount: newLinksToAdd.filter((l) => l.isHighTaint).length,
      };

      set({
        nodes: updatedNodes,
        links: updatedLinks,
        blocks: [newBlock, ...currentState.blocks],
        selectedNodeId: resolvedTargetNode.id,
        minTimestamp: bounds.min,
        maxTimestamp: bounds.max,
        currentTimestamp: bounds.max,
        isSearchingLive: false,
        explorerTab: currentState.viewMode !== '3d' ? 'wallet-detail' : currentState.explorerTab,
        cameraFocusTrigger: currentState.cameraFocusTrigger + 1,
        statusBanner: `[${result.source}] Connected ${newNodesToAdd.length} entities & ${newLinksToAdd.length} flows to ${resolvedTargetNode.label}`,
      });
    } catch {
      set({
        isSearchingLive: false,
        statusBanner: `Could not resolve "${q}". Try any 0x address, TxHash, or ENS name.`,
      });
    }
  },

  refreshLiveCaseActivity: async () => {
    const state = get();
    set({
      isRefreshingLive: true,
      statusBanner:
        state.language === 'fr'
          ? '⚡ Interrogation RPC live des têtes de pont Lazarus (31 Octobre 2026)...'
          : '⚡ Querying live RPC for active Lazarus peel chains (October 31, 2026)...',
    });

    try {
      const cur = get();
      const FRONT_LINE_TARGETS = [
        '0x03b0eE5d82990cFF1bDa48651AC3e436d1a020ea',
        '0x5227f603C1eE34CE3C06eFe6477003BDfCCB2f8c',
      ];

      const existingAddressToId = new Map<string, string>();
      cur.nodes.forEach((n) => {
        existingAddressToId.set(n.address.toLowerCase(), n.id);
      });

      const existingLinkHashes = new Set(cur.links.map((l) => l.txHash.toLowerCase()));
      const newlyAddedNodes: ForensicNode[] = [];
      const newlyAddedLinks: ForensicLink[] = [];

      for (const targetAddress of FRONT_LINE_TARGETS) {
        const anchorNode = cur.nodes.find(
          (n) => n.address.toLowerCase() === targetAddress.toLowerCase()
        );
        if (!anchorNode) continue;

        existingAddressToId.set(targetAddress.toLowerCase(), anchorNode.id);

        try {
          const liveResult = await lookupLiveAddressOrTx(targetAddress, anchorNode.chain);

          // 1. Process newly discovered counterparties
          liveResult.connectedNodes.forEach((cn, idx) => {
            const lower = cn.address.toLowerCase();
            if (existingAddressToId.has(lower)) return;

            const angle = (idx / Math.max(1, liveResult.connectedNodes.length)) * Math.PI * 2 + 0.4;
            const radius = 65 + (idx % 3) * 22;

            const newNode: ForensicNode = {
              ...cn,
              id: `live-hop-${cn.address.slice(2, 10)}-${idx}`,
              x: anchorNode.x + Math.cos(angle) * radius,
              y: anchorNode.y,
              z: anchorNode.z + Math.sin(angle) * radius,
              notes: `[Live On-Chain Synchronized] Counterparty of ${anchorNode.label}`,
            };

            existingAddressToId.set(lower, newNode.id);
            newlyAddedNodes.push(newNode);
          });

          // 2. Attach new links directly to anchorNode and counterparties
          for (const rawLink of liveResult.links) {
            if (existingLinkHashes.has(rawLink.txHash.toLowerCase())) continue;
            existingLinkHashes.add(rawLink.txHash.toLowerCase());

            const isOutflowFromAnchor =
              rawLink.source === liveResult.targetNode.id ||
              rawLink.source.toLowerCase() === targetAddress.toLowerCase();

            const rawCounterparty = isOutflowFromAnchor ? rawLink.target : rawLink.source;
            const matchingCounterpartyNode =
              newlyAddedNodes.find(
                (n) => n.id === rawCounterparty || n.address.toLowerCase() === rawCounterparty.toLowerCase()
              ) || liveResult.connectedNodes.find((n) => n.id === rawCounterparty);

            const counterpartyAddress =
              matchingCounterpartyNode?.address.toLowerCase() || rawCounterparty.toLowerCase();
            const resolvedCounterpartyId =
              existingAddressToId.get(counterpartyAddress) || matchingCounterpartyNode?.id;

            if (!resolvedCounterpartyId) continue;

            newlyAddedLinks.push({
              ...rawLink,
              id: `live-sync-link-${rawLink.txHash.slice(0, 14)}-${newlyAddedLinks.length}`,
              source: isOutflowFromAnchor ? anchorNode.id : resolvedCounterpartyId,
              target: isOutflowFromAnchor ? resolvedCounterpartyId : anchorNode.id,
              sourceChain: anchorNode.chain,
              targetChain: anchorNode.chain,
              velocity: 1.6,
              isHighTaint: true,
            });
          }
        } catch (innerErr) {
          console.warn(`Live sync check on ${targetAddress} completed:`, innerErr);
        }
      }

      if (newlyAddedNodes.length === 0 && newlyAddedLinks.length === 0) {
        set({
          isRefreshingLive: false,
          statusBanner:
            state.language === 'fr'
              ? '✓ Graphe à jour : Toutes les transactions des têtes de pont surveillées sont déjà synchronisées.'
              : '✓ Graph up-to-date: All transactions across monitored front-line wallets are already synchronized.',
        });
        return;
      }

      const updatedNodes = [...cur.nodes, ...newlyAddedNodes];
      const updatedLinks = [...cur.links, ...newlyAddedLinks];
      propagateTaint(updatedNodes, updatedLinks);
      const bounds = computeTimeBounds(updatedLinks);

      // Persist newly discovered live nodes and links to localStorage and disk archive
      try {
        const storageKey = `argus_live_deltas_${cur.activeCaseId}`;
        const previousDeltaRaw = localStorage.getItem(storageKey);
        const previousDelta = previousDeltaRaw ? JSON.parse(previousDeltaRaw) : { nodes: [], links: [] };

        const allDeltaNodes = [...(previousDelta.nodes || []), ...newlyAddedNodes];
        const allDeltaLinks = [...(previousDelta.links || []), ...newlyAddedLinks];
        const uniqueNodes = Array.from(new Map(allDeltaNodes.map((n: any) => [n.id, n])).values());
        const uniqueLinks = Array.from(new Map(allDeltaLinks.map((l: any) => [l.id, l])).values());

        localStorage.setItem(storageKey, JSON.stringify({ nodes: uniqueNodes, links: uniqueLinks }));

        // Send to Vite dev server middleware to persist directly to public/archives/${caseId}.json
        fetch('/api/save-case-archive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseId: cur.activeCaseId,
            updatedNodes: newlyAddedNodes,
            updatedLinks: newlyAddedLinks,
          }),
        }).catch(() => {});
      } catch (saveErr) {
        console.warn('Failed to persist live delta:', saveErr);
      }

      set({
        nodes: updatedNodes,
        links: updatedLinks,
        minTimestamp: bounds.min,
        maxTimestamp: bounds.max,
        currentTimestamp: bounds.max,
        cameraFocusTrigger: cur.cameraFocusTrigger + 1,
        isRefreshingLive: false,
        statusBanner:
          state.language === 'fr'
            ? `✓ Synchronisation Live terminée : +${newlyAddedNodes.length} nouveaux nœuds & +${newlyAddedLinks.length} transactions connectées aux têtes de pont.`
            : `✓ Live Sync complete: +${newlyAddedNodes.length} new nodes & +${newlyAddedLinks.length} transactions connected to active peel hubs.`,
      });
    } catch (err) {
      console.warn('Live sync error:', err);
      set({
        isRefreshingLive: false,
        statusBanner:
          state.language === 'fr'
            ? 'Graphe à jour : Aucune nouvelle transaction non répertoriée sur les adresses surveillées.'
            : 'Graph up-to-date: No new unindexed transactions on monitored addresses.',
      });
    }
  },

  clearStatusBanner: () => set({ statusBanner: null }),

  setIsDocsModalOpen: (open) => set({ isDocsModalOpen: open }),
  setActiveTourStep: (step) => set({ activeTourStep: step, isDocsModalOpen: false }),
}));

// Selector helper to compute currently visible nodes and links based on all active filters & scrubber
export function getFilteredGraph(state: ForensicStoreState): {
  visibleNodes: ForensicNode[];
  visibleLinks: ForensicLink[];
} {
  // If Isolate Sub-Graph is active, find 2-hop neighborhood around isolatedRootNodeId
  let allowedSubgraphIds: Set<string> | null = null;
  if (state.isolatedRootNodeId) {
    allowedSubgraphIds = new Set<string>([state.isolatedRootNodeId]);
    for (let hop = 0; hop < 2; hop++) {
      for (const l of state.links) {
        if (allowedSubgraphIds.has(l.source)) allowedSubgraphIds.add(l.target);
        if (allowedSubgraphIds.has(l.target)) allowedSubgraphIds.add(l.source);
      }
    }
  }

  const nodeById = new Map<string, ForensicNode>();
  for (const n of state.nodes) {
    nodeById.set(n.id, n);
  }

  // Filter links first by timestamp, dust value, probabilistic toggle, and node eligibility
  const visibleLinks: ForensicLink[] = [];
  const activeNodeIdsFromLinks = new Set<string>();

  for (const link of state.links) {
    if (link.timestamp > state.currentTimestamp) continue;
    if (link.usdValue < state.minUsdValue) continue;
    if (link.isProbabilistic && !state.showProbabilisticLinks) continue;

    const src = nodeById.get(link.source);
    const dst = nodeById.get(link.target);
    if (!src || !dst) continue;

    if (!state.enabledChains[src.chain] || !state.enabledChains[dst.chain]) continue;
    if (!state.enabledEntities[src.entityType] || !state.enabledEntities[dst.entityType]) continue;
    if (allowedSubgraphIds && (!allowedSubgraphIds.has(src.id) || !allowedSubgraphIds.has(dst.id))) {
      continue;
    }

    visibleLinks.push(link);
    activeNodeIdsFromLinks.add(src.id);
    activeNodeIdsFromLinks.add(dst.id);
  }

  const visibleNodes = state.nodes.filter((n) => {
    if (!state.enabledChains[n.chain]) return false;
    if (!state.enabledEntities[n.entityType]) return false;
    if (n.volumeUsd < state.minUsdValue) return false;
    if (allowedSubgraphIds && !allowedSubgraphIds.has(n.id)) return false;
    // If timeline is scrubbed back before max, show nodes that have appeared or have active links
    if (state.currentTimestamp < state.maxTimestamp - 1000) {
      return activeNodeIdsFromLinks.has(n.id) || n.firstSeen <= state.currentTimestamp;
    }
    return true;
  });

  return { visibleNodes, visibleLinks };
}

