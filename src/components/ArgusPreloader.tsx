import React, { useEffect, useState } from 'react';
import { ArgusOrbitalLogo } from './ArgusOrbitalLogo';
import { useForensicStore } from '../store/useForensicStore';
import { TRANSLATIONS } from '../i18n/translations';

interface ArgusPreloaderProps {
  onComplete?: () => void;
}

export const ArgusPreloader: React.FC<ArgusPreloaderProps> = ({ onComplete }) => {
  const language = useForensicStore((s) => s.language);
  const t = TRANSLATIONS[language];

  const stages = [
    { progress: 18, text: t.preloader.stages[0] },
    { progress: 42, text: t.preloader.stages[1] },
    { progress: 71, text: t.preloader.stages[2] },
    { progress: 92, text: t.preloader.stages[3] },
    { progress: 100, text: t.preloader.stages[4] },
  ];

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(stages[0].text);
  const [isDone, setIsDone] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1600; // 1.6s total duration

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      const matchedStage = stages.slice()
        .reverse()
        .find((s) => pct >= s.progress);
      if (matchedStage) {
        setStatusText(matchedStage.text);
      }

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            setIsDone(true);
            onComplete?.();
          }, 600);
        }, 250);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#09090B] select-none transition-all duration-700 ${
        isFading ? 'opacity-0 pointer-events-none scale-102' : 'opacity-100'
      }`}
    >
      {/* Background Subtle Radar Grid and Scanlines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,163,89,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.4)_51%)] bg-[length:100%_4px] pointer-events-none" />

      {/* Center Preloader Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Large Animated Orbital Logo */}
        <div className="relative mb-6">
          <div className="p-3 rounded-2xl bg-[#111113]/90 border border-[#D4A359]/30 shadow-[0_0_50px_rgba(212,163,89,0.22)] backdrop-blur-md">
            <ArgusOrbitalLogo size={96} />
          </div>
          {/* Subtle live radar ping halo */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#E04F33] animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#E04F33]" />
        </div>

        {/* Brand Typography */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <h1 className="text-xl font-mono font-bold tracking-[0.25em] text-white">
            ARGUS
          </h1>
          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#D4A359]/15 text-[#D4A359] border border-[#D4A359]/30 rounded">
            {t.preloader.tag}
          </span>
        </div>

        <p className="text-[11px] font-mono text-zinc-400 tracking-wider mb-6">
          {t.preloader.subtitle}
        </p>

        {/* Tactical Telemetry Progress Bar */}
        <div className="w-64 h-1.5 bg-[#18181B] border border-white/10 rounded-full overflow-hidden mb-3 relative">
          <div
            className="h-full bg-gradient-to-r from-[#7C93A8] via-[#D4A359] to-[#E04F33] transition-all duration-75 ease-out shadow-[0_0_12px_rgba(212,163,89,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Real-Time Telemetry Feed Text & Percentage */}
        <div className="flex items-center justify-between w-64 text-[10px] font-mono text-zinc-400">
          <span className="truncate pr-2 text-left">{statusText}</span>
          <span className="text-[#D4A359] font-bold tabular-nums shrink-0">
            {progress}%
          </span>
        </div>

        {/* Quick Skip Button */}
        <button
          onClick={() => {
            setIsFading(true);
            setTimeout(() => {
              setIsDone(true);
              onComplete?.();
            }, 300);
          }}
          className="mt-8 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition underline underline-offset-4"
        >
          {t.preloader.skip}
        </button>
      </div>

      {/* Bottom Legal / Classification Warning */}
      <div className="absolute bottom-6 text-[10px] font-mono text-zinc-500 tracking-wider">
        {t.preloader.legal}
      </div>
    </div>
  );
};
