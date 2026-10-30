import React, { useMemo, useState } from 'react';
import { Filter, ShieldCheck, Sliders, Zap } from 'lucide-react';

interface InteractiveTaintLabProps {
  isFr: boolean;
}

export const InteractiveTaintLab: React.FC<InteractiveTaintLabProps> = ({ isFr }) => {
  const [stolenMillions, setStolenMillions] = useState(420);
  const [peelHops, setPeelHops] = useState(5);
  const [mixerEntropyPct, setMixerEntropyPct] = useState(28); // lower = attacker operational mistake (same gas / timing)
  const [antiPoisonEnabled, setAntiPoisonEnabled] = useState(true);

  const stages = useMemo(() => {
    const hopDilution = Math.max(0.72, 1 - peelHops * 0.022);
    const postPeelTaint = Math.round(100 * hopDilution);
    // Post-mixer correlation confidence inversely proportional to attacker's operational entropy
    const postMixerCorrelation = Math.round(
      Math.max(18, Math.min(96, postPeelTaint * (1 - mixerEntropyPct * 0.0068)))
    );
    const bridgeTaint = Math.round(postMixerCorrelation * 0.94);
    const cexAlertScore = Math.round(bridgeTaint * (antiPoisonEnabled ? 1 : 0.64));

    return [
      {
        step: '01',
        name: isFr ? 'Exploit Origine' : 'Exploit Origin',
        sub: `$${stolenMillions}M ETH`,
        taint: 100,
        note: isFr ? 'Source 100% certifiée' : '100% certified origin',
      },
      {
        step: '02',
        name: isFr ? `Peel Chain (${peelHops} Hops)` : `Peel Chain (${peelHops} Hops)`,
        sub: `${peelHops * 8} Wallets`,
        taint: postPeelTaint,
        note: isFr ? 'Conservation FIFO' : 'FIFO conservation',
      },
      {
        step: '03',
        name: 'ZK Mixer Pool',
        sub: '100 ETH Batches',
        taint: postMixerCorrelation,
        note: isFr ? 'Corrélation Gas/Temps' : 'Gas/Timing correlation',
      },
      {
        step: '04',
        name: 'Cross-Chain Bridge',
        sub: 'ETH → BTC Stratum',
        taint: bridgeTaint,
        note: isFr ? 'Saut inter-plans' : 'Cross-stratum leap',
      },
      {
        step: '05',
        name: isFr ? 'Dépôt CEX / Gel' : 'CEX Off-Ramp',
        sub: cexAlertScore >= 60 ? (isFr ? 'ALERTE GEL' : 'FREEZE TRIGGER') : 'WATCHLIST',
        taint: cexAlertScore,
        note: antiPoisonEnabled
          ? isFr
            ? '0 bruit de dusting'
            : '0 dusting noise'
          : isFr
          ? 'Pollué par 48 TXs spam'
          : 'Polluted by 48 dust TXs',
      },
    ];
  }, [stolenMillions, peelHops, mixerEntropyPct, antiPoisonEnabled, isFr]);

  const getHeatColor = (score: number) => {
    if (score >= 75) return '#E04F33';
    if (score >= 50) return '#D4A359';
    return '#38BDF8';
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D0E12]/90 backdrop-blur-md p-6 shadow-[0_24px_70px_rgba(0,0,0,0.6)]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center gap-2 font-mono text-xs text-[#D4A359] font-bold">
          <Sliders className="w-4 h-4" />
          <span>
            {isFr
              ? 'LABORATOIRE INTERACTIF // PROPAGATION DE TAINT FIFO & ENTROPIE POST-MIXER'
              : 'INTERACTIVE LAB // FIFO TAINT PROPAGATION & POST-MIXER ENTROPY'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setAntiPoisonEnabled((v) => !v)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold border transition ${
            antiPoisonEnabled
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
              : 'bg-amber-950/70 border-amber-500/50 text-amber-300'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>
            {antiPoisonEnabled
              ? isFr
                ? 'FILTRE ANTI-POISONING (?filter=from) : ACTIF'
                : 'ANTI-POISONING FILTER (?filter=from): ON'
              : isFr
              ? 'FILTRE ANTI-POISONING : DÉSACTIVÉ (BRUIT SPAM)'
              : 'ANTI-POISONING FILTER: OFF (DUST NOISE)'}
          </span>
        </button>
      </div>

      {/* 3 Parameter Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-[#09090B]/90 border border-white/10">
          <div className="flex justify-between mb-2">
            <span className="text-zinc-400">
              {isFr ? 'Volume Initial Dérobé' : 'Initial Stolen Volume'}
            </span>
            <b className="text-[#E04F33]">${stolenMillions}M</b>
          </div>
          <input
            type="range"
            min={25}
            max={1460}
            step={15}
            value={stolenMillions}
            onChange={(e) => setStolenMillions(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-[#09090B]/90 border border-white/10">
          <div className="flex justify-between mb-2">
            <span className="text-zinc-400">
              {isFr ? 'Fragmentation Peel-Chain' : 'Peel-Chain Splitting'}
            </span>
            <b className="text-[#D4A359]">{peelHops} Hops</b>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={peelHops}
            onChange={(e) => setPeelHops(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-[#09090B]/90 border border-white/10">
          <div className="flex justify-between mb-2">
            <span className="text-zinc-400">
              {isFr ? 'Flemme OpSec (même gas / timing)' : 'OpSec Laziness (same gas / timing)'}
            </span>
            <b className="text-purple-300">{mixerEntropyPct}%</b>
          </div>
          <input
            type="range"
            min={5}
            max={90}
            step={5}
            value={mixerEntropyPct}
            onChange={(e) => setMixerEntropyPct(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Live 5-Stage Propagation Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {stages.map((st, idx) => {
          const color = getHeatColor(st.taint);
          return (
            <div
              key={st.step}
              className="relative p-4 rounded-xl bg-[#111216] border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 mb-1">
                  <span>STAGE {st.step}</span>
                  {idx === 2 && <Zap className="w-3 h-3 text-purple-400" />}
                  {idx === 4 && <ShieldCheck className="w-3.5 h-3.5 text-[#D4A359]" />}
                </div>
                <div className="text-xs font-semibold text-white mb-0.5">{st.name}</div>
                <div className="font-mono text-[11px] text-zinc-400 mb-3">{st.sub}</div>
              </div>

              <div>
                <div className="flex items-baseline justify-between font-mono mb-1">
                  <span className="text-[10px] text-zinc-500">TAINT</span>
                  <span className="text-base font-bold" style={{ color }}>
                    {st.taint}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-2">
                  <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${st.taint}%`, backgroundColor: color }}
                  />
                </div>
                <div className="font-mono text-[10px] text-zinc-400 truncate">{st.note}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

