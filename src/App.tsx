import React, { useEffect } from 'react';
import { useForensicStore } from './store/useForensicStore';
import { TopHudBar } from './components/TopHudBar';
import { LeftFilterPanel } from './components/LeftFilterPanel';
import { RightInspectorPanel } from './components/RightInspectorPanel';
import { TimelineScrubber } from './components/TimelineScrubber';
import { ClassicBlockExplorer } from './components/ClassicBlockExplorer';
import { DocumentationModal } from './components/DocumentationModal';
import { ArgusPreloader } from './components/ArgusPreloader';
import { AetherScene3D } from './engine/AetherScene3D';
import { ArgusLandingPage } from './components/landing/ArgusLandingPage';

export function App() {
  const appSurface = useForensicStore((s) => s.appSurface);
  const viewMode = useForensicStore((s) => s.viewMode);
  const hydrateActiveCaseArchive = useForensicStore((s) => s.hydrateActiveCaseArchive);

  useEffect(() => {
    hydrateActiveCaseArchive();
  }, [hydrateActiveCaseArchive]);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#09090B] text-slate-100 overflow-hidden">
      {/* Interactive Cinematic Preloader at Boot */}
      <ArgusPreloader />

      {appSurface === 'landing' ? (
        <ArgusLandingPage />
      ) : (
        <>
          {/* Top Cyber-Forensic HUD Bar (Search, Case Selector, Chain Stratum Toggles, KPI Pills, View Mode Switcher) */}
          <TopHudBar />

          {/* In-App Documentation Manual & Interactive 6-Step Guided Tour */}
          <DocumentationModal />

          {/* Main Workspace Area */}
          <main className="relative flex-1 flex overflow-hidden">
            {/* 3D Spatial Multi-Chain Graph Viewport */}
            {(viewMode === '3d' || viewMode === 'split') && (
              <div
                className={`relative h-full transition-all duration-300 ${
                  viewMode === 'split' ? 'w-1/2' : 'w-full'
                }`}
              >
                <AetherScene3D />
                <LeftFilterPanel />
                {viewMode === '3d' && <RightInspectorPanel />}
              </div>
            )}

            {/* Classic Block Explorer (Transactions, Wallets, Blocks, Receipts, Decoded CallData) */}
            {(viewMode === 'explorer' || viewMode === 'split') && (
              <div
                className={`relative h-full transition-all duration-300 ${
                  viewMode === 'split' ? 'w-1/2' : 'w-full'
                }`}
              >
                <ClassicBlockExplorer />
              </div>
            )}
          </main>

          {/* Bottom Interactive Chronological Hack Scrubber */}
          <TimelineScrubber />
        </>
      )}
    </div>
  );
}

export default App;

