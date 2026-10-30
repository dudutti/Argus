import React from 'react';

interface ArgusOrbitalLogoProps {
  /** Size in pixels (width & height), defaults to 36 */
  size?: number;
  /** Custom className for positioning/styling */
  className?: string;
  /** Whether orbital rotations & pulses are active (default: true) */
  animate?: boolean;
  /** Whether the glowing laser & core filter is active (default: true) */
  showGlow?: boolean;
}

export const ArgusOrbitalLogo: React.FC<ArgusOrbitalLogoProps> = ({
  size = 36,
  className = '',
  animate = true,
  showGlow = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      title="ARGUS Orbital Multi-Chain Surveillance Nexus"
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {showGlow && (
            <>
              <filter id="argus-react-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="argus-react-core-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="2.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </>
          )}

          <linearGradient id="argus-react-sweep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4A359" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#D4A359" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#D4A359" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="argus-react-core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF1D0" />
            <stop offset="35%" stopColor="#E04F33" />
            <stop offset="80%" stopColor="#D4A359" />
            <stop offset="100%" stopColor="#18181B" stopOpacity="0.9" />
          </radialGradient>
        </defs>

        <style>{`
          @keyframes argus-cw {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes argus-ccw {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes argus-pulse {
            0%, 100% { transform: scale(1); opacity: 0.95; }
            50% { transform: scale(1.18); opacity: 0.65; }
          }
          .argus-origin-c {
            transform-origin: 50px 50px;
          }
          .argus-anim-sweep {
            ${animate ? 'animation: argus-cw 3.8s linear infinite;' : ''}
          }
          .argus-anim-outer {
            ${animate ? 'animation: argus-cw 26s linear infinite;' : ''}
          }
          .argus-anim-mid {
            ${animate ? 'animation: argus-ccw 16s linear infinite;' : ''}
          }
          .argus-anim-inner {
            ${animate ? 'animation: argus-cw 9.5s linear infinite;' : ''}
          }
          .argus-anim-core {
            ${animate ? 'animation: argus-pulse 2.2s ease-in-out infinite;' : ''}
          }
        `}</style>

        {/* Base dark optical aperture */}
        <circle cx="50" cy="50" r="48" fill="#09090B" stroke="#27272A" strokeWidth="1" />

        {/* Fixed HUD Cardinal Brackets */}
        <g stroke="#7C93A8" strokeWidth="1" opacity="0.6">
          <line x1="50" y1="2" x2="50" y2="7" stroke="#D4A359" strokeWidth="1.5" />
          <line x1="50" y1="93" x2="50" y2="98" />
          <line x1="2" y1="50" x2="7" y2="50" />
          <line x1="93" y1="50" x2="98" y2="50" />
          <circle cx="16" cy="16" r="0.9" fill="#7C93A8" />
          <circle cx="84" cy="16" r="0.9" fill="#7C93A8" />
          <circle cx="16" cy="84" r="0.9" fill="#7C93A8" />
          <circle cx="84" cy="84" r="0.9" fill="#7C93A8" />
        </g>

        {/* Radar Scanning Beam */}
        <g className="argus-origin-c argus-anim-sweep">
          <path d="M 50 50 L 50 8 A 42 42 0 0 1 80 20 Z" fill="url(#argus-react-sweep)" />
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="8"
            stroke="#D4A359"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.9"
            filter={showGlow ? 'url(#argus-react-glow)' : undefined}
          />
        </g>

        {/* Ring 3: Outer Telemetry Radar Ring (Clockwise) */}
        <g className="argus-origin-c argus-anim-outer">
          <circle
            cx="50"
            cy="50"
            r="41.5"
            fill="none"
            stroke="#D4A359"
            strokeWidth="1.2"
            strokeDasharray="2 7 14 7"
            opacity="0.75"
          />
          <circle
            cx="50"
            cy="50"
            r="44.5"
            fill="none"
            stroke="#7C93A8"
            strokeWidth="0.8"
            strokeDasharray="1 5"
            opacity="0.45"
          />
          <g transform="translate(50, 50)">
            <circle
              cx="0"
              cy="-41.5"
              r="2"
              fill="#D4A359"
              filter={showGlow ? 'url(#argus-react-glow)' : undefined}
            />
            <polygon points="41.5,-1 44,0 41.5,1 40,0" fill="#E04F33" />
            <circle cx="-41.5" cy="0" r="1.5" fill="#7C93A8" />
          </g>
        </g>

        {/* Ring 2: Mid Multi-Chain Stratum Ring (Counter-Clockwise) */}
        <g className="argus-origin-c argus-anim-mid">
          <circle
            cx="50"
            cy="50"
            r="28"
            fill="none"
            stroke="#7C93A8"
            strokeWidth="1.2"
            strokeDasharray="16 6 3 6"
            opacity="0.85"
          />
          {/* Solana Satellite (Tactical Sage Green) */}
          <g transform="rotate(30 50 50)">
            <circle
              cx="50"
              cy="22"
              r="2.2"
              fill="#4E9F76"
              filter={showGlow ? 'url(#argus-react-glow)' : undefined}
            />
            <circle cx="50" cy="22" r="4.2" fill="none" stroke="#4E9F76" strokeWidth="0.6" opacity="0.45" />
          </g>
          {/* Ethereum Satellite (Brushed Brass) */}
          <g transform="rotate(150 50 50)">
            <circle
              cx="50"
              cy="22"
              r="2.5"
              fill="#D4A359"
              filter={showGlow ? 'url(#argus-react-glow)' : undefined}
            />
          </g>
          {/* Arbitrum Satellite (Tactical Cyan) */}
          <g transform="rotate(270 50 50)">
            <circle
              cx="50"
              cy="22"
              r="2"
              fill="#38BDF8"
              filter={showGlow ? 'url(#argus-react-glow)' : undefined}
            />
          </g>
        </g>

        {/* Ring 1: Inner Orbit Ring (Clockwise) */}
        <g className="argus-origin-c argus-anim-inner">
          <circle
            cx="50"
            cy="50"
            r="16"
            fill="none"
            stroke="#D4A359"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.85"
          />
          <circle
            cx="50"
            cy="34"
            r="1.6"
            fill="#E04F33"
            filter={showGlow ? 'url(#argus-react-core-glow)' : undefined}
          />
          <circle cx="50" cy="66" r="1.4" fill="#FFF1D0" />
        </g>

        {/* Static Central Reticle Crosshairs */}
        <g stroke="#D4A359" strokeWidth="1" opacity="0.85">
          <line x1="50" y1="39" x2="50" y2="44" />
          <line x1="50" y1="56" x2="50" y2="61" />
          <line x1="39" y1="50" x2="44" y2="50" />
          <line x1="56" y1="50" x2="61" y2="50" />
        </g>

        {/* Central Anomaly / Pulse Core */}
        <g className="argus-origin-c argus-anim-core">
          <circle cx="50" cy="50" r="8" fill="none" stroke="#E04F33" strokeWidth="1" opacity="0.65" />
          <circle
            cx="50"
            cy="50"
            r="4.8"
            fill="url(#argus-react-core-grad)"
            filter={showGlow ? 'url(#argus-react-core-glow)' : undefined}
          />
          <circle cx="50" cy="50" r="1.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};

