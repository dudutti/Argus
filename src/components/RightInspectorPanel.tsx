import React, { useState } from 'react';
import { useForensicStore } from '../store/useForensicStore';
import { CHAIN_PLANES } from '../data/forensicCases';
import { TRANSLATIONS } from '../i18n/translations';
import { isNodeFrozenAtTime } from '../types/forensics';
import { decodeHexToUtf8 } from '../utils/hexUtils';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Focus,
  GitFork,
  PlusCircle,
  ShieldAlert,
  ShieldCheck,
  Wallet,
  X,
} from 'lucide-react';

export const RightInspectorPanel: React.FC = () => {
  const state = useForensicStore();
  const t = TRANSLATIONS[state.language];
  const [copied, setCopied] = useState(false);

  const selectedNode = state.nodes.find((n) => n.id === state.selectedNodeId);
  if (!selectedNode) return null;

  const nodeLinks = state.links
    .filter((l) => l.source === selectedNode.id || l.target === selectedNode.id)
    .sort((a, b) => b.timestamp - a.timestamp);

  const nodeMap = new Map(state.nodes.map((n) => [n.id, n]));
  const chainInfo = CHAIN_PLANES[selectedNode.chain];

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedNode.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const taintColorClass =
    selectedNode.taintScore >= 70
      ? 'text-[#E04F33] border-[#E04F33]/40 bg-[#E04F33]/15'
      : selectedNode.taintScore >= 40
      ? 'text-[#D4A359] border-[#D4A359]/40 bg-[#D4A359]/15'
      : 'text-[#4E9F76] border-[#4E9F76]/40 bg-[#4E9F76]/15';

  const riskLabel =
    selectedNode.taintScore >= 70
      ? t.inspector.taintRiskCritical
      : selectedNode.taintScore >= 40
      ? t.inspector.taintRiskHigh
      : selectedNode.taintScore >= 15
      ? t.inspector.taintRiskMedium
      : t.inspector.taintRiskLow;

  return (
    <aside className="absolute top-28 right-4 bottom-24 z-20 w-96 flex flex-col bg-[#111113]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#09090B]/70">
        <div className="flex items-center gap-2 min-w-0">
          <Wallet className="w-4 h-4 text-[#D4A359] shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-white truncate">
            {t.inspector.title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => state.selectNode(selectedNode.id, true)}
            className="px-2 py-1 text-[10px] bg-[#D4A359]/20 hover:bg-[#D4A359]/30 text-[#D4A359] border border-[#D4A359]/40 rounded flex items-center gap-1 transition"
            title={t.common.viewInExplorer}
          >
            <span>{t.common.viewInExplorer}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <button
            onClick={() => state.selectNode(null)}
            className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/10 transition"
            title={t.common.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Dynamic Frozen vs Pre-Freeze Alert Banner */}
        {(() => {
          const isFrozenNow = isNodeFrozenAtTime(selectedNode, state.currentTimestamp, state.links);
          if (isFrozenNow) {
            return (
              <div className="p-3 rounded-lg bg-[#0284C7]/25 border border-[#38BDF8]/60 text-[11px] text-[#38BDF8] flex items-start gap-2.5 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                <span className="text-base">❄️</span>
                <div className="space-y-0.5">
                  <div className="font-bold uppercase tracking-wider text-[10px] text-[#38BDF8]">
                    {state.language === 'fr' ? 'FONDS GELÉS / BLACKLIST' : 'FROZEN / BLACKLISTED ASSETS'}
                  </div>
                  <p className="text-[10px] text-sky-200/90 leading-relaxed">
                    {selectedNode.freezeReason || (state.language === 'fr' ? 'Fonds immobilisés par décision de gouvernance ou smart contract blacklist.' : 'Assets immobilized by issuer or governance freeze.')}
                  </p>
                </div>
              </div>
            );
          }
          if (selectedNode.isFrozen) {
            return (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-[#E04F33]/60 text-[11px] text-rose-300 flex items-start gap-2.5 shadow-[0_0_15px_rgba(224,79,51,0.2)]">
                <span className="text-base">🚨</span>
                <div className="space-y-0.5">
                  <div className="font-bold uppercase tracking-wider text-[10px] text-[#E04F33] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E04F33] animate-ping" />
                    <span>{state.language === 'fr' ? 'VAULT ACTIF // PRÉ-GEL (FONDS SIPHONNÉS)' : 'ACTIVE HOT VAULT // PRE-FREEZE'}</span>
                  </div>
                  <p className="text-[10px] text-rose-200/90 leading-relaxed">
                    {state.language === 'fr'
                      ? `Ce vault a reçu des fonds volés lors du siphon. Le gel interviendra sur la timeline lors de l'exécution de la blacklist on-chain (${selectedNode.freezeReason || 'Blacklist contractuelle'}).`
                      : `Siphoned funds received into this vault. The freeze transaction will execute later on the timeline (${selectedNode.freezeReason || 'Issuer blacklist'}).`}
                  </p>
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* EIP-7702 Trojan Warning */}
        {selectedNode.eip7702DelegatedTo && (
          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/60 text-[11px] text-amber-300 flex items-start gap-2.5 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold uppercase tracking-wider text-[10px] text-amber-400">
                {state.language === 'fr' ? 'EOA DÉTOURNÉ VIA EIP-7702' : 'EIP-7702 HIJACKED EOA'}
              </div>
              <p className="text-[10px] text-amber-200/90 leading-relaxed">
                {state.language === 'fr'
                  ? `Bytecode délégué (0xef0100) vers le contrat sweeper : ${selectedNode.eip7702DelegatedTo}`
                  : `Delegated bytecode (0xef0100) pointing to sweeper contract: ${selectedNode.eip7702DelegatedTo}`}
              </p>
            </div>
          </div>
        )}

        {/* Forensic Data Provenance Banner (Real On-Chain vs Heuristic Model) */}
        {selectedNode.dataSource === 'live_onchain' || selectedNode.notes?.includes('[Live On-Chain') ? (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-start gap-2.5 shadow-[0_0_15px_rgba(16,185,129,0.12)]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold uppercase tracking-wider text-[10px] text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{state.language === 'fr' ? 'Données On-Chain Réelles Vérifiées' : 'Verified Live On-Chain Data'}</span>
              </div>
              <p className="text-[10px] text-emerald-200/80 leading-relaxed">
                {state.language === 'fr'
                  ? 'Transactions et contreparties indexées directement depuis la blockchain (Blockscout / RPC).'
                  : 'Transactions and counterparties indexed directly from the blockchain (Blockscout / RPC).'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/50 text-[11px] text-amber-200 flex items-start gap-2.5 shadow-[0_0_15px_rgba(245,158,11,0.12)]">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold uppercase tracking-wider text-[10px] text-amber-400 flex items-center gap-1.5">
                <span>▲</span>
                <span>{state.language === 'fr' ? 'Modèle Heuristique (Projection Simulée)' : 'Heuristic Model (Simulated Projection)'}</span>
              </div>
              <p className="text-[10px] text-amber-200/90 leading-relaxed">
                {state.language === 'fr'
                  ? 'Données on-chain indisponibles au-delà de ce point. Ce nœud est une projection simulée pour analyse prédictive (ne constitue pas une preuve on-chain).'
                  : 'Live on-chain data unavailable beyond this point. This node is a simulated projection for predictive analysis (not on-chain proof).'}
              </p>
            </div>
          </div>
        )}

        {/* Identity & Entity Tag */}
        <div className="p-3 rounded-lg bg-[#09090B]/80 border border-white/10 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span
              className="px-2 py-0.5 text-[10px] font-bold uppercase rounded"
              style={{
                backgroundColor: `${chainInfo.color}25`,
                color: chainInfo.color,
                border: `1px solid ${chainInfo.color}55`,
              }}
            >
              {selectedNode.chain} // Y={chainInfo.y}
            </span>

            <span className="px-2 py-0.5 text-[10px] uppercase rounded bg-white/10 text-zinc-200 border border-white/15">
              TYPE: {selectedNode.entityType.toUpperCase()}
            </span>
          </div>

          <div className="font-bold text-sm text-white flex items-center justify-between gap-2">
            <span className="truncate">{selectedNode.label}</span>
            {selectedNode.ens && (
              <span className="text-xs text-[#38BDF8] shrink-0">{selectedNode.ens}</span>
            )}
          </div>

          {/* Copyable Monospace Hash + External Explorer Link */}
          <div className="flex items-center justify-between gap-2 p-2 rounded bg-[#111113] border border-white/5 text-[11px] text-zinc-300">
            <span className="truncate">{selectedNode.address}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleCopyAddress}
                className="text-zinc-400 hover:text-[#D4A359]"
                title={t.common.copy}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#4E9F76]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={`${chainInfo.explorerUrl}/address/${selectedNode.address}`}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-[#D4A359]"
                title={`${t.common.openEtherscan} (${chainInfo.explorerUrl})`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {selectedNode.notes && (
            <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-200 flex items-start gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{selectedNode.notes}</span>
            </div>
          )}
        </div>

        {/* Crime Risk / Taint Gauge (0 - 100%) */}
        <div className="p-3 rounded-lg bg-[#09090B]/80 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-zinc-400">
              {t.inspector.taintScore}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${taintColorClass}`}>
              {selectedNode.taintScore}% {t.common.taint}
            </span>
          </div>
          <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${selectedNode.taintScore}%`,
                background:
                  selectedNode.taintScore >= 70
                    ? 'linear-gradient(90deg, #D4A359, #E04F33)'
                    : selectedNode.taintScore >= 40
                    ? 'linear-gradient(90deg, #7C93A8, #D4A359)'
                    : 'linear-gradient(90deg, #475B6D, #7C93A8)',
              }}
            />
          </div>
          <div className="text-[10px] text-zinc-400 text-center font-bold">
            {riskLabel}
          </div>
        </div>

        {/* Forensic Action Buttons: Expand Hops (+1 Level), Isolate Sub-Graph, Flag as Suspect */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => state.expandNodeHops(selectedNode.id)}
            className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg border text-[10px] transition ${
              state.expandedHopsByNodeId[selectedNode.id]
                ? 'bg-[#D4A359]/30 border-[#D4A359] text-[#D4A359] shadow-[0_0_12px_rgba(212,163,89,0.35)]'
                : 'bg-[#D4A359]/15 hover:bg-[#D4A359]/25 border-[#D4A359]/40 text-zinc-200'
            }`}
            title="Toggle (+1 Hop) neighbor expansion"
          >
            <PlusCircle className="w-4 h-4 text-[#D4A359]" />
            <span>
              {state.expandedHopsByNodeId[selectedNode.id]
                ? t.inspector.collapseHops
                : t.inspector.expandHops}
            </span>
          </button>

          <button
            onClick={() => state.toggleIsolateSubGraph(selectedNode.id)}
            className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg border text-[10px] transition ${
              state.isolatedRootNodeId === selectedNode.id
                ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-200'
            }`}
            title="Isolate 2-hop sub-graph"
          >
            <Focus className="w-4 h-4 text-amber-400" />
            <span>
              {state.isolatedRootNodeId === selectedNode.id ? t.inspector.showFullGraph : t.inspector.isolateNode}
            </span>
          </button>

          <button
            onClick={() => state.toggleFlagSuspect(selectedNode.id)}
            className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg border text-[10px] transition ${
              selectedNode.flaggedSuspect
                ? 'bg-rose-500/30 border-rose-500 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                : 'bg-white/5 hover:bg-rose-500/20 border-white/10 text-zinc-200'
            }`}
            title="Flag entity as 100% Taint Suspect"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>{selectedNode.flaggedSuspect ? t.common.unflagSuspect : t.common.flagSuspect}</span>
          </button>
        </div>

        {/* Inflow / Outflow / Volume Breakdown */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-lg bg-[#09090B]/80 border border-white/10">
            <div className="text-[10px] text-zinc-400">TOTAL</div>
            <div className="text-xs font-bold text-white mt-0.5">
              ${(selectedNode.volumeUsd / 1e6).toFixed(2)}M
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#09090B]/80 border border-white/10">
            <div className="text-[10px] text-[#4E9F76] flex items-center gap-0.5">
              <ArrowDownLeft className="w-3 h-3" /> {t.inspector.txTypeIn}
            </div>
            <div className="text-xs font-bold text-[#4E9F76] mt-0.5">
              ${(selectedNode.inflowUsd / 1e6).toFixed(2)}M
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#09090B]/80 border border-white/10">
            <div className="text-[10px] text-amber-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> {t.inspector.txTypeOut}
            </div>
            <div className="text-xs font-bold text-amber-300 mt-0.5">
              ${(selectedNode.outflowUsd / 1e6).toFixed(2)}M
            </div>
          </div>
        </div>

        {/* Token Holdings Breakdown */}
        <div className="p-3 rounded-lg bg-[#09090B]/80 border border-white/10 space-y-2">
          <div className="text-[10px] uppercase text-zinc-400">
            {t.inspector.holdings}
          </div>
          <div className="space-y-1.5">
            {selectedNode.tokens.map((tok, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-none"
              >
                <span className="text-zinc-200 font-semibold">{tok.symbol}</span>
                <div className="text-right">
                  <div className="text-zinc-200">{tok.amount.toLocaleString()} {tok.symbol}</div>
                  <div className="text-[10px] text-zinc-400">${tok.usdValue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable List of Incoming / Outgoing Transactions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] uppercase text-zinc-400">
            <span className="flex items-center gap-1.5">
              <GitFork className="w-3.5 h-3.5 text-[#D4A359]" />
              <span>{t.inspector.recentTransactions} ({nodeLinks.length})</span>
            </span>
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {nodeLinks.map((tx) => {
              const isIncoming = tx.target === selectedNode.id;
              const counterpartyId = isIncoming ? tx.source : tx.target;
              const counterparty = nodeMap.get(counterpartyId);
              return (
                <div
                  key={tx.id}
                  onClick={() => state.selectTransaction(tx.txHash, true)}
                  className="p-2.5 rounded-lg bg-[#09090B]/80 hover:bg-white/10 border border-white/10 hover:border-[#D4A359]/40 cursor-pointer transition space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isIncoming
                          ? 'bg-[#4E9F76]/20 text-[#4E9F76]'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {isIncoming ? (
                        <>
                          <ArrowDownLeft className="w-3 h-3" /> {t.inspector.txTypeIn}
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="w-3 h-3" /> {t.inspector.txTypeOut}
                        </>
                      )}
                      <span className="truncate max-w-[140px]">{tx.methodName}</span>
                      {decodeHexToUtf8(tx.inputDataHex) && (
                        <span className="px-1 py-0.2 rounded bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-mono text-[8px] font-bold">
                          UTF-8 MSG
                        </span>
                      )}
                    </span>

                    <span className="text-xs font-bold text-white">
                      ${tx.usdValue.toLocaleString()}{' '}
                      <span className="text-[#D4A359]">{tx.asset}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="truncate max-w-[180px]">
                      {isIncoming ? 'From: ' : 'To: '}
                      <b className="text-zinc-200">{counterparty?.label || counterpartyId}</b>
                    </span>
                    <span>Block #{tx.blockNumber}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Tx: {tx.txHash.slice(0, 14)}...</span>
                    {tx.isProbabilistic && (
                      <span className="text-purple-400 font-semibold">ZK-CORRELATED</span>
                    )}
                    {tx.isCrossChain && (
                      <span className="text-[#38BDF8] font-semibold">
                        {tx.sourceChain} → {tx.targetChain}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
