import React, { useMemo } from 'react';
import { useForensicStore, getFilteredGraph } from '../store/useForensicStore';
import { TRANSLATIONS } from '../i18n/translations';
import { Clock, FastForward, Pause, Play, RotateCcw } from 'lucide-react';

export const TimelineScrubber: React.FC = () => {
  const state = useForensicStore();
  const t = TRANSLATIONS[state.language];
  const { visibleLinks } = getFilteredGraph(state);

  const sortedTimestamps = useMemo(
    () => state.links.map((l) => l.timestamp).sort((a, b) => a - b),
    [state.links]
  );

  const progressPct = Math.min(100, Math.max(0, state.replayCursor * 100));
  const sliderVal = Math.round(Math.min(1, Math.max(0, state.replayCursor)) * 1000);

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  };

  return (
    <footer className="relative z-30 px-4 py-2.5 bg-[#111113]/90 backdrop-blur-md border-t border-white/10 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => state.setIsPlaying(!state.isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              state.isPlaying
                ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-[#D4A359]/20 hover:bg-[#D4A359]/30 text-[#D4A359] border border-[#D4A359]/40 shadow-[0_0_12px_rgba(212,163,89,0.2)]'
            }`}
          >
            {state.isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>{t.timeline.pause}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>{t.timeline.replay}</span>
              </>
            )}
          </button>

          <button
            onClick={() => state.resetTimelineToFull()}
            className="p-1.5 rounded-lg bg-[#09090B]/80 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition"
            title={t.timeline.resetFull}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector: 1x / 2x / 5x */}
          <div className="flex items-center bg-[#09090B]/80 border border-white/10 rounded-lg p-0.5 text-[11px]">
            <FastForward className="w-3.5 h-3.5 text-zinc-400 mx-1.5" />
            {([1, 2, 5] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => state.setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded transition ${
                  state.playbackSpeed === spd
                    ? 'bg-[#D4A359]/30 text-[#D4A359] font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Range Scrubber Slider */}
        <div className="flex-1 min-w-[240px] flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4A359]" />
              <span>{t.timeline.title}:</span>
              <b className="text-zinc-200">{formatTimestamp(state.currentTimestamp)}</b>
            </span>
            <span className="text-zinc-400">
              {state.language === 'fr' ? 'PROGRESSION :' : 'REPLAY PROGRESS:'}{' '}
              <b className="text-white">{progressPct.toFixed(0)}%</b> (
              {visibleLinks.length}/{state.links.length} TXs)
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={1000}
            step={1}
            value={sliderVal}
            onChange={(e) => {
              state.setIsPlaying(false);
              const ratio = Number(e.target.value) / 1000;
              if (sortedTimestamps.length === 0) {
                state.setCurrentTimestamp(state.maxTimestamp);
                return;
              }
              if (ratio <= 0) {
                state.setCurrentTimestamp(sortedTimestamps[0]);
              } else if (ratio >= 1) {
                state.setCurrentTimestamp(state.maxTimestamp);
              } else {
                const idx = Math.min(
                  sortedTimestamps.length - 1,
                  Math.max(0, Math.floor(ratio * (sortedTimestamps.length - 1)))
                );
                state.setCurrentTimestamp(sortedTimestamps[idx]);
              }
            }}
            className="w-full accent-[#D4A359]"
          />
        </div>
      </div>
    </footer>
  );
};
