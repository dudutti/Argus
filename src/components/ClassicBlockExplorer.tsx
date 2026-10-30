import React, { useState, useEffect } from 'react';
import { useForensicStore, getFilteredGraph } from '../store/useForensicStore';
import { CHAIN_PLANES } from '../data/forensicCases';
import { ExplorerTab } from '../types/forensics';
import { TRANSLATIONS } from '../i18n/translations';
import {
  Activity,
  ArrowRight,
  Blocks,
  Box,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Cpu,
  FileSearch,
  Filter,
  Flame,
  Focus,
  GitCommit,
  MessageSquare,
  PlusCircle,
  Search,
  ShieldAlert,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { decodeHexToUtf8 } from '../utils/hexUtils';

export const ClassicBlockExplorer: React.FC = () => {
  const state = useForensicStore();
  const t = TRANSLATIONS[state.language];
  const { visibleNodes, visibleLinks } = getFilteredGraph(state);

  const [localFilter, setLocalFilter] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Automatically reset table search filter whenever switching case study
  useEffect(() => {
    setLocalFilter('');
  }, [state.activeCaseId]);

  const nodeMap = new Map(state.nodes.map((n) => [n.id, n]));

  const copyToClipboard = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedText(val);
    setTimeout(() => setCopiedText(null), 1600);
  };

  const selectedTx =
    state.links.find((l) => l.txHash.toLowerCase() === state.selectedTxHash?.toLowerCase()) ||
    state.links[0];

  const selectedWallet =
    state.nodes.find((n) => n.id === state.selectedNodeId) || state.nodes[0];

  const selectedBlock =
    state.blocks.find((b) => b.number === state.selectedBlockNumber) || state.blocks[0];

  const filteredLinks = visibleLinks.filter((l) => {
    if (!localFilter.trim()) return true;
    const q = localFilter.toLowerCase();
    const src = nodeMap.get(l.source);
    const dst = nodeMap.get(l.target);
    const utf8 = decodeHexToUtf8(l.inputDataHex)?.toLowerCase() || '';
    return (
      l.blockNumber.toString().includes(q) ||
      l.txHash.toLowerCase().includes(q) ||
      l.methodName.toLowerCase().includes(q) ||
      l.asset.toLowerCase().includes(q) ||
      utf8.includes(q) ||
      (l.inputDataHex && l.inputDataHex.toLowerCase().includes(q)) ||
      (src?.label && src.label.toLowerCase().includes(q)) ||
      (src?.address && src.address.toLowerCase().includes(q)) ||
      (dst?.label && dst.label.toLowerCase().includes(q)) ||
      (dst?.address && dst.address.toLowerCase().includes(q))
    );
  });

  const filteredWallets = visibleNodes.filter((n) => {
    if (!localFilter.trim()) return true;
    const q = localFilter.toLowerCase();
    return (
      n.address.toLowerCase().includes(q) ||
      n.label.toLowerCase().includes(q) ||
      n.entityType.toLowerCase().includes(q) ||
      n.chain.toLowerCase().includes(q)
    );
  });

  const filteredBlocks = state.blocks.filter((b) => {
    if (!localFilter.trim()) return true;
    const q = localFilter.toLowerCase();
    return (
      b.number.toString().includes(q) ||
      b.hash.toLowerCase().includes(q) ||
      b.minerOrValidator.toLowerCase().includes(q) ||
      b.chain.toLowerCase().includes(q)
    );
  });

  const tabs: Array<{ id: ExplorerTab; label: string; icon: React.ReactNode; badge?: number }> = [
    {
      id: 'transactions',
      label: t.explorer.tabTx,
      icon: <Activity className="w-3.5 h-3.5" />,
      badge: visibleLinks.length,
    },
    {
      id: 'wallets',
      label: t.explorer.tabAccounts,
      icon: <Wallet className="w-3.5 h-3.5" />,
      badge: visibleNodes.length,
    },
    {
      id: 'blocks',
      label: t.explorer.tabBlocks,
      icon: <Blocks className="w-3.5 h-3.5" />,
      badge: state.blocks.length,
    },
    {
      id: 'wallet-detail',
      label: state.language === 'fr' ? 'Inspecteur Wallet' : 'Wallet Inspector',
      icon: <FileSearch className="w-3.5 h-3.5" />,
    },
    {
      id: 'tx-detail',
      label: state.language === 'fr' ? 'Reçu d\'Exécution' : 'Transaction Receipt',
      icon: <Code2 className="w-3.5 h-3.5" />,
    },
    {
      id: 'block-detail',
      label: state.language === 'fr' ? 'Inspecteur Bloc' : 'Block Inspector',
      icon: <Cpu className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#09090B] text-zinc-100 overflow-hidden border-l border-white/10 font-mono text-xs">
      {/* Sub-Navigation Bar for Classic Block Explorer */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#111113]/95 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-1">
          {tabs.map((tabItem) => {
            const active = state.explorerTab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                onClick={() => {
                  state.setExplorerTab(tabItem.id);
                  setLocalFilter('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${
                  active
                    ? 'bg-[#D4A359]/20 text-[#D4A359] border border-[#D4A359]/40 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tabItem.icon}
                <span>{tabItem.label}</span>
                {tabItem.badge !== undefined && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded bg-white/10 text-zinc-200">
                    {tabItem.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Local Table Quick Filter & Message Shortcut (Specific to Case 03 Euler) */}
        <div className="flex items-center gap-2 flex-wrap">
          {state.activeCaseId === 'euler-flashloan-exploit-2023' && (
            <button
              type="button"
              onClick={() => setLocalFilter((prev) => (prev === '16885400' ? '' : '16885400'))}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg border flex items-center gap-1.5 transition ${
                localFilter === '16885400'
                  ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 shadow-sm shadow-emerald-500/20'
                  : 'bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-500/40 text-emerald-300'
              }`}
              title="Filtrer sur les messages de négociation du hacker Euler (Bloc #16885400)"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold">Messages Hacker Euler (Bloc #16885400)</span>
            </button>
          )}

          <div className="relative w-64">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
            <input
              type="text"
              value={localFilter}
              onChange={(e) => setLocalFilter(e.target.value)}
              placeholder="Filter table (bloc, 0x, méthode, message)..."
              className="w-full pl-8 pr-7 py-1 text-xs font-mono bg-[#09090B] border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
            {localFilter && (
              <button
                type="button"
                onClick={() => setLocalFilter('')}
                className="absolute right-2 top-1.5 text-slate-400 hover:text-white text-xs"
                title="Effacer le filtre"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {state.nodes.length === 0 && (
          <div className="mb-4 p-5 rounded-xl bg-[#111113]/90 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-4 font-mono">
            <div className="space-y-1">
              <div className="text-xs font-bold text-emerald-300 uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Blank Custom Explorer Workspace</span>
              </div>
              <p className="text-xs text-slate-300">
                Historical cases are deselected. Paste any Wallet Address (`0x...`, `bc1...`, `SOL`), `TxHash`, or `ENS` in the top search bar (or click a quick-start address) to build a clean graph from scratch.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() =>
                  state.startFreshGraphFromAddressOrTx('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
                }
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 font-bold transition"
              >
                Trace vitalik.eth
              </button>
              <button
                onClick={() =>
                  state.startFreshGraphFromAddressOrTx('0x28C6c06298d514Db089934071355E5743bf21d60')
                }
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 font-bold transition"
              >
                Trace Binance 14
              </button>
            </div>
          </div>
        )}
        {/* =================================================================== */}
        {/* TAB 1: LIVE TRANSACTIONS TABLE                                      */}
        {/* =================================================================== */}
        {state.explorerTab === 'transactions' && (
          <div className="bg-[#111113]/70 border border-white/10 rounded-xl overflow-hidden shadow-xl">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white uppercase">
                  Multi-Chain Forensic Transactions Ledger ({filteredLinks.length})
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Click any TxHash to inspect call data or Wallet to focus in 3D
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-[#09090B]/80 text-[11px] text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Tx Hash</th>
                    <th className="py-2.5 px-3">Chain</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Block</th>
                    <th className="py-2.5 px-3">From (Sender)</th>
                    <th className="py-2.5 px-3">To (Receiver)</th>
                    <th className="py-2.5 px-3 text-right">Amount / USD</th>
                    <th className="py-2.5 px-3 text-center">Forensic Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLinks.map((tx) => {
                    const src = nodeMap.get(tx.source);
                    const dst = nodeMap.get(tx.target);
                    return (
                      <tr
                        key={tx.id}
                        className="hover:bg-white/[0.04] transition group"
                      >
                        <td className="py-2.5 px-3">
                          <button
                            onClick={() => state.selectTransaction(tx.txHash)}
                            className="text-cyan-400 hover:underline font-medium flex items-center gap-1"
                          >
                            <span>{tx.txHash.slice(0, 12)}...</span>
                          </button>
                        </td>

                        <td className="py-2.5 px-3">
                          <span
                            className="px-1.5 py-0.5 text-[10px] rounded font-bold"
                            style={{
                              backgroundColor: `${CHAIN_PLANES[tx.sourceChain].color}22`,
                              color: CHAIN_PLANES[tx.sourceChain].color,
                            }}
                          >
                            {tx.isCrossChain
                              ? `${tx.sourceChain}→${tx.targetChain}`
                              : tx.sourceChain}
                          </span>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="flex flex-col gap-1 max-w-sm">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] text-slate-200 font-semibold">
                                {tx.methodName}
                              </span>
                              {decodeHexToUtf8(tx.inputDataHex) && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-mono text-[9px] font-bold flex items-center gap-1">
                                  <MessageSquare className="w-2.5 h-2.5" /> UTF-8 MSG
                                </span>
                              )}
                            </div>
                            {decodeHexToUtf8(tx.inputDataHex) && (
                              <div className="text-[10px] text-emerald-300 font-mono bg-emerald-950/60 border border-emerald-500/25 px-2 py-1 rounded select-all leading-tight">
                                "{decodeHexToUtf8(tx.inputDataHex)}"
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          <button
                            onClick={() => state.selectBlock(tx.blockNumber)}
                            className="text-slate-300 hover:text-cyan-300"
                          >
                            #{tx.blockNumber}
                          </button>
                        </td>

                        <td className="py-2.5 px-3">
                          <button
                            onClick={() => state.selectNode(tx.source, true)}
                            className="text-left hover:text-cyan-300"
                          >
                            <div className="text-slate-200 font-semibold truncate max-w-[165px]">
                              {src?.label || tx.source}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {src?.address.slice(0, 10)}...{src?.address.slice(-6)}
                            </div>
                          </button>
                        </td>

                        <td className="py-2.5 px-3">
                          <button
                            onClick={() => state.selectNode(tx.target, true)}
                            className="text-left hover:text-cyan-300"
                          >
                            <div className="text-slate-200 font-semibold truncate max-w-[165px]">
                              {dst?.label || tx.target}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {dst?.address.slice(0, 10)}...{dst?.address.slice(-6)}
                            </div>
                          </button>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <div className="text-white font-bold">
                            ${tx.usdValue.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-cyan-400">
                            {tx.amount.toLocaleString()} {tx.asset}
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          {tx.isProbabilistic ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40">
                              <Sparkles className="w-3 h-3" /> ZK-Correlated
                            </span>
                          ) : tx.isHighTaint ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              <Flame className="w-3 h-3" /> High-Taint
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <CheckCircle2 className="w-3 h-3" /> Confirmed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: WALLETS & FORENSIC ENTITIES DIRECTORY                        */}
        {/* =================================================================== */}
        {state.explorerTab === 'wallets' && (
          <div className="bg-[#111113]/70 border border-white/10 rounded-xl overflow-hidden shadow-xl">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs">
                <Wallet className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white uppercase">
                  Indexed Wallets, Mixers, Bridges & Sanctioned Entities ({filteredWallets.length})
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Sorted by Risk Taint & Volume
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-[#09090B]/80 text-[11px] text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Entity Label / Tag</th>
                    <th className="py-2.5 px-3">Address</th>
                    <th className="py-2.5 px-3">Chain</th>
                    <th className="py-2.5 px-3">Classification</th>
                    <th className="py-2.5 px-3 text-right">Total Volume</th>
                    <th className="py-2.5 px-3 text-right">Inflow / Outflow</th>
                    <th className="py-2.5 px-3 text-center">Crime Taint Score</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredWallets.map((w) => (
                    <tr key={w.id} className="hover:bg-white/[0.04] transition">
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => state.selectNode(w.id, true)}
                          className="font-bold text-white hover:text-cyan-300 text-left"
                        >
                          {w.label}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <span>
                            {w.address.slice(0, 12)}...{w.address.slice(-8)}
                          </span>
                          <button
                            onClick={() => copyToClipboard(w.address)}
                            className="text-slate-500 hover:text-cyan-300"
                          >
                            {copiedText === w.address ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className="px-1.5 py-0.5 text-[10px] rounded font-bold"
                          style={{
                            backgroundColor: `${CHAIN_PLANES[w.chain].color}22`,
                            color: CHAIN_PLANES[w.chain].color,
                          }}
                        >
                          {w.chain}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 uppercase">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-200">
                          {w.entityType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                        ${w.volumeUsd.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-[11px]">
                        <span className="text-emerald-300">
                          +${(w.inflowUsd / 1e6).toFixed(2)}M
                        </span>{' '}
                        /{' '}
                        <span className="text-amber-300">
                          -${(w.outflowUsd / 1e6).toFixed(2)}M
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            w.taintScore >= 70
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : w.taintScore >= 40
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          }`}
                        >
                          {w.taintScore}% TAINT
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => state.toggleIsolateSubGraph(w.id)}
                            className={`px-2 py-1 rounded border text-[11px] transition ${
                              state.isolatedRootNodeId === w.id
                                ? 'bg-amber-500/30 border-amber-400 text-amber-200'
                                : 'bg-amber-500/10 hover:bg-amber-500/25 border-amber-500/30 text-amber-300'
                            }`}
                            title="Isolate 2-Hop Sub-Graph around this Wallet"
                          >
                            {state.isolatedRootNodeId === w.id ? 'Un-Isolate' : 'Isolate'}
                          </button>
                          <button
                            onClick={() => state.selectNode(w.id, true)}
                            className="px-2.5 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[11px]"
                          >
                            Inspect Wallet
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: MULTI-CHAIN BLOCKS TABLE                                     */}
        {/* =================================================================== */}
        {state.explorerTab === 'blocks' && (
          <div className="bg-[#111113]/70 border border-white/10 rounded-xl overflow-hidden shadow-xl">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs">
                <Blocks className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white uppercase">
                  Multi-Chain Block Headers ({filteredBlocks.length})
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Click any Block Number to view included forensic transactions
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-[#09090B]/80 text-[11px] text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Block #</th>
                    <th className="py-2.5 px-3">Chain</th>
                    <th className="py-2.5 px-3">Block Hash</th>
                    <th className="py-2.5 px-3">Builder / Validator</th>
                    <th className="py-2.5 px-3 text-center">Txs</th>
                    <th className="py-2.5 px-3 text-center">Tainted Txs</th>
                    <th className="py-2.5 px-3 text-right">Gas Used</th>
                    <th className="py-2.5 px-3 text-right">Block Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBlocks.map((blk) => (
                    <tr
                      key={blk.number}
                      onClick={() => state.selectBlock(blk.number)}
                      className="hover:bg-white/[0.04] cursor-pointer transition"
                    >
                      <td className="py-2.5 px-3 font-bold text-cyan-400">
                        #{blk.number}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className="px-1.5 py-0.5 text-[10px] rounded font-bold"
                          style={{
                            backgroundColor: `${CHAIN_PLANES[blk.chain].color}22`,
                            color: CHAIN_PLANES[blk.chain].color,
                          }}
                        >
                          {blk.chain}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {blk.hash.slice(0, 14)}...{blk.hash.slice(-8)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-200">{blk.minerOrValidator}</td>
                      <td className="py-2.5 px-3 text-center">{blk.txCount}</td>
                      <td className="py-2.5 px-3 text-center">
                        {blk.taintedTxCount > 0 ? (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                            {blk.taintedTxCount} Flagged
                          </span>
                        ) : (
                          <span className="text-slate-500">0</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-300">{blk.gasUsed}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                        ${blk.totalVolumeUsd.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: CLASSIC WALLET / ADDRESS EXPLORER DETAIL VIEW                */}
        {/* =================================================================== */}
        {state.explorerTab === 'wallet-detail' && selectedWallet && (
          <div className="space-y-4 font-mono">
            {/* Wallet Overview Header Card */}
            <div className="p-5 rounded-xl bg-[#111113]/85 border border-white/10 shadow-xl space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 text-xs font-bold rounded"
                      style={{
                        backgroundColor: `${CHAIN_PLANES[selectedWallet.chain].color}25`,
                        color: CHAIN_PLANES[selectedWallet.chain].color,
                      }}
                    >
                      {CHAIN_PLANES[selectedWallet.chain].name}
                    </span>
                    <span className="px-2 py-0.5 text-xs uppercase rounded bg-white/10 text-slate-200">
                      ENTITY: {selectedWallet.entityType}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded ${
                        selectedWallet.taintScore >= 70
                          ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      CRIME TAINT: {selectedWallet.taintScore}%
                    </span>
                    {selectedWallet.dataSource === 'live_onchain' || selectedWallet.notes?.includes('[Live On-Chain') ? (
                      <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {state.language === 'fr' ? 'On-Chain Réel Vérifié' : 'Verified On-Chain'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 uppercase">
                        <span>▲</span>
                        {state.language === 'fr' ? 'Modèle Heuristique (Simulé)' : 'Heuristic Model (Simulated)'}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-white flex items-center gap-2 pt-1">
                    <span>{selectedWallet.label}</span>
                    {selectedWallet.ens && (
                      <span className="text-sm text-cyan-400">({selectedWallet.ens})</span>
                    )}
                  </h2>

                  <div className="flex items-center gap-2 text-xs text-slate-300 bg-[#09090B] px-3 py-1.5 rounded-lg border border-white/10 w-fit">
                    <span>{selectedWallet.address}</span>
                    <button
                      onClick={() => copyToClipboard(selectedWallet.address)}
                      className="text-slate-400 hover:text-cyan-300"
                    >
                      {copiedText === selectedWallet.address ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Clarification banner if Heuristic Simulation */}
                  {selectedWallet.dataSource === 'synthetic_simulation' || selectedWallet.label.includes('[Simulé]') ? (
                    <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2">
                      <span className="text-amber-400 font-bold shrink-0 mt-0.5">⚠️</span>
                      <div>
                        <div className="font-bold text-amber-300 uppercase tracking-wider text-[10px]">
                          {state.language === 'fr' ? 'Limite des données réelles atteinte' : 'On-Chain Boundary Reached'}
                        </div>
                        <div className="text-[11px] text-amber-200/80 leading-relaxed mt-0.5">
                          {state.language === 'fr'
                            ? "Aucune transaction on-chain directe trouvée au-delà de ce nœud. Ces flux sont issus d'un modèle heuristique de simulation et ne constituent pas une preuve juridique."
                            : 'No direct on-chain transactions found beyond this node. These flows are derived from a heuristic simulation model and do not constitute legal evidence.'}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Forensic Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => state.expandNodeHops(selectedWallet.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold transition ${
                      state.expandedHopsByNodeId[selectedWallet.id]
                        ? 'bg-cyan-500/35 border-cyan-300 text-cyan-100 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                        : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400/50 text-cyan-200'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>
                      {state.expandedHopsByNodeId[selectedWallet.id]
                        ? 'Collapse Hops (Reset)'
                        : 'Expand Hops (+1 Level)'}
                    </span>
                  </button>
                  <button
                    onClick={() => state.toggleIsolateSubGraph(selectedWallet.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold transition ${
                      state.isolatedRootNodeId === selectedWallet.id
                        ? 'bg-amber-500/30 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                        : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-200'
                    }`}
                  >
                    <Focus className="w-4 h-4 text-amber-400" />
                    <span>
                      {state.isolatedRootNodeId === selectedWallet.id
                        ? 'Un-Isolate Sub-Graph'
                        : 'Isolate Sub-Graph'}
                    </span>
                  </button>
                  <button
                    onClick={() => state.toggleFlagSuspect(selectedWallet.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-bold transition"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>
                      {selectedWallet.flaggedSuspect ? 'Unflag Suspect' : 'Flag as Suspect'}
                    </span>
                  </button>
                  {state.viewMode === 'explorer' && (
                    <button
                      onClick={() => state.setViewMode('split')}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs transition"
                    >
                      <Box className="w-4 h-4 text-cyan-400" />
                      <span>Focus in 3D Graph</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Financial & Token Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-[#09090B] border border-white/10">
                  <div className="text-[10px] text-slate-400">TOTAL TRACKED VOLUME</div>
                  <div className="text-base font-bold text-white mt-1">
                    ${selectedWallet.volumeUsd.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#09090B] border border-white/10">
                  <div className="text-[10px] text-emerald-400">CUMULATIVE INFLOW</div>
                  <div className="text-base font-bold text-emerald-300 mt-1">
                    +${selectedWallet.inflowUsd.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#09090B] border border-white/10">
                  <div className="text-[10px] text-amber-400">CUMULATIVE OUTFLOW</div>
                  <div className="text-base font-bold text-amber-300 mt-1">
                    -${selectedWallet.outflowUsd.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#09090B] border border-white/10">
                  <div className="text-[10px] text-slate-400">TOKEN HOLDINGS</div>
                  <div className="text-xs text-slate-200 mt-1 space-y-0.5">
                    {selectedWallet.tokens.map((t, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {t.amount.toLocaleString()} {t.symbol}
                        </span>
                        <span className="text-emerald-400">${t.usdValue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet's Transactions Table */}
            <div className="bg-[#111113]/75 border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 text-xs font-bold uppercase text-white">
                Wallet Transaction History (
                {
                  state.links.filter(
                    (l) => l.source === selectedWallet.id || l.target === selectedWallet.id
                  ).length
                }{' '}
                Records)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#09090B]/80 text-[11px] text-slate-400 uppercase">
                      <th className="py-2.5 px-3">Tx Hash</th>
                      <th className="py-2.5 px-3">Direction</th>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Counterparty</th>
                      <th className="py-2.5 px-3 text-right">Value (USD)</th>
                      <th className="py-2.5 px-3 text-right">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {state.links
                      .filter(
                        (l) => l.source === selectedWallet.id || l.target === selectedWallet.id
                      )
                      .map((tx) => {
                        const isIncoming = tx.target === selectedWallet.id;
                        const otherId = isIncoming ? tx.source : tx.target;
                        const otherNode = nodeMap.get(otherId);
                        return (
                          <tr key={tx.id} className="hover:bg-white/[0.04]">
                            <td className="py-2.5 px-3">
                              <button
                                onClick={() => state.selectTransaction(tx.txHash)}
                                className="text-cyan-400 hover:underline"
                              >
                                {tx.txHash.slice(0, 16)}...
                              </button>
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isIncoming
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {isIncoming ? 'INFLOW' : 'OUTFLOW'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-200">{tx.methodName}</td>
                            <td className="py-2.5 px-3">
                              <button
                                onClick={() => state.selectNode(otherId, true)}
                                className="text-cyan-300 hover:underline"
                              >
                                {otherNode?.label || otherId}
                              </button>
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-white">
                              ${tx.usdValue.toLocaleString()} ({tx.amount} {tx.asset})
                            </td>
                            <td className="py-2.5 px-3 text-right text-slate-400">
                              ${tx.feeUsd}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: CLASSIC TRANSACTION RECEIPT & CALLDATA INSPECTOR             */}
        {/* =================================================================== */}
        {state.explorerTab === 'tx-detail' && selectedTx && (
          <div className="max-w-5xl mx-auto space-y-4 font-mono">
            <div className="p-5 rounded-xl bg-[#111113]/85 border border-white/10 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <GitCommit className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-sm font-bold uppercase text-white">
                    Transaction Receipt & Forensic Trace
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {selectedTx.isHighTaint && (
                    <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold">
                      HIGH-TAINT CRIME FLOW
                    </span>
                  )}
                  {selectedTx.isProbabilistic && (
                    <span className="px-2.5 py-1 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 text-xs font-bold">
                      ZK TIMING CORRELATED
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                    {selectedTx.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Key-Value Etherscan-Style Rows */}
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 py-2 border-b border-white/5">
                  <span className="text-slate-400">Transaction Hash:</span>
                  <div className="md:col-span-3 flex items-center gap-2 text-cyan-300 break-all">
                    <span>{selectedTx.txHash}</span>
                    <button
                      onClick={() => copyToClipboard(selectedTx.txHash)}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedText === selectedTx.txHash ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 py-2 border-b border-white/5">
                  <span className="text-slate-400">Chain & Block Number:</span>
                  <div className="md:col-span-3 flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold">
                      {selectedTx.isCrossChain
                        ? `${selectedTx.sourceChain} → ${selectedTx.targetChain} (Cross-Chain Bridge)`
                        : selectedTx.sourceChain}
                    </span>
                    <button
                      onClick={() => state.selectBlock(selectedTx.blockNumber)}
                      className="text-cyan-400 hover:underline"
                    >
                      Block #{selectedTx.blockNumber}
                    </button>
                    <span className="text-slate-400">
                      ({new Date(selectedTx.timestamp).toISOString()})
                    </span>
                  </div>
                </div>

                {/* From -> To Visual Hop Card */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 py-2 border-b border-white/5 items-center">
                  <span className="text-slate-400">Forensic Entity Hop:</span>
                  <div className="md:col-span-3 flex flex-wrap items-center gap-3">
                    {(() => {
                      const src = nodeMap.get(selectedTx.source);
                      const dst = nodeMap.get(selectedTx.target);
                      return (
                        <>
                          <button
                            onClick={() => state.selectNode(selectedTx.source, true)}
                            className="p-2.5 rounded-lg bg-[#09090B] border border-white/10 hover:border-cyan-400/50 text-left"
                          >
                            <div className="text-[10px] text-slate-400">FROM SENDER</div>
                            <div className="font-bold text-white">
                              {src?.label || selectedTx.source}
                            </div>
                            <div className="text-[10px] text-cyan-400">{src?.address}</div>
                          </button>

                          <ArrowRight className="w-5 h-5 text-cyan-400" />

                          <button
                            onClick={() => state.selectNode(selectedTx.target, true)}
                            className="p-2.5 rounded-lg bg-[#09090B] border border-white/10 hover:border-cyan-400/50 text-left"
                          >
                            <div className="text-[10px] text-slate-400">TO RECEIVER</div>
                            <div className="font-bold text-white">
                              {dst?.label || selectedTx.target}
                            </div>
                            <div className="text-[10px] text-cyan-400">{dst?.address}</div>
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 py-2 border-b border-white/5">
                  <span className="text-slate-400">Value Transferred:</span>
                  <div className="md:col-span-3 flex items-center gap-3">
                    <span className="text-base font-bold text-emerald-400">
                      ${selectedTx.usdValue.toLocaleString()} USD
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {selectedTx.amount.toLocaleString()} {selectedTx.asset}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 py-2 border-b border-white/5">
                  <span className="text-slate-400">Gas & Execution Fee:</span>
                  <div className="md:col-span-3 text-slate-200">
                    Gas Used: <b>{selectedTx.gasUsed.toLocaleString()}</b> | Gas Price:{' '}
                    <b>{selectedTx.gasPriceGwei} Gwei</b> | Total Fee:{' '}
                    <b className="text-amber-300">${selectedTx.feeUsd}</b>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 py-2">
                  <span className="text-slate-400">Decoded Method & Raw CallData:</span>
                  <div className="md:col-span-3 space-y-3">
                    <div className="inline-block px-2.5 py-1 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 font-bold">
                      Function: {selectedTx.methodName}(address recipient, uint256 amount, bytes32 zkNullifier)
                    </div>

                    {/* Decoded Plaintext Message if found */}
                    {(() => {
                      const msg = decodeHexToUtf8(selectedTx.inputDataHex);
                      if (msg) {
                        return (
                          <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                              <span className="flex items-center gap-1.5 uppercase tracking-wide">
                                <MessageSquare className="w-3.5 h-3.5" />
                                Message On-Chain Décodé (UTF-8 Plaintext)
                              </span>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                                HACKER NEGOTIATION PAYLOAD
                              </span>
                            </div>
                            <p className="text-sm font-mono text-emerald-100 bg-black/60 p-3 rounded border border-emerald-500/20 whitespace-pre-wrap select-all leading-relaxed">
                              "{msg}"
                            </p>
                          </div>
                        );
                      }
                      if (state.activeCaseId === 'bybit-safe-exploit-2025' || selectedTx.txHash.startsWith('0x6a761202')) {
                        return (
                          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300/90 flex items-center justify-between">
                            <span>Bytecode binaire Safe multisig (DELEGATECALL).</span>
                            <span className="font-mono text-[10px] text-amber-400">Lazarus Group (APT38) : Aucun message texte</span>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    <div className="p-3 rounded-lg bg-[#09090B] border border-white/10 text-[11px] text-slate-400 break-all">
                      {selectedTx.inputDataHex ||
                        '0xa9059cbb000000000000000000000000098b716b8aaf21512996dc57eb0615e2383e2f960000000000000000000000000000000000000000000422ca8b0a00a425000000'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 6: BLOCK DETAIL INSPECTOR                                       */}
        {/* =================================================================== */}
        {state.explorerTab === 'block-detail' && selectedBlock && (
          <div className="max-w-5xl mx-auto space-y-4 font-mono">
            <div className="p-5 rounded-xl bg-[#111113]/85 border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Blocks className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-sm font-bold uppercase text-white">
                    Block #{selectedBlock.number} ({selectedBlock.chain})
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded bg-white/10 text-xs text-slate-200">
                  Validator: {selectedBlock.minerOrValidator}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#09090B] border border-white/10">
                  <div className="text-slate-400">BLOCK HASH</div>
                  <div className="text-cyan-300 truncate mt-1">{selectedBlock.hash}</div>
                </div>
                <div className="p-3 rounded-lg bg-[#09090B] border border-white/10">
                  <div className="text-slate-400">GAS USED / LIMIT</div>
                  <div className="text-white font-bold mt-1">
                    {selectedBlock.gasUsed} / {selectedBlock.gasLimit} ({selectedBlock.baseFeeGwei}{' '}
                    Gwei)
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#09090B] border border-white/10">
                  <div className="text-slate-400">BLOCK VOLUME & TAINTED TXS</div>
                  <div className="text-emerald-400 font-bold mt-1">
                    ${selectedBlock.totalVolumeUsd.toLocaleString()} ({selectedBlock.taintedTxCount}{' '}
                    Flagged)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

