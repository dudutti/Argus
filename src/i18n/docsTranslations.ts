import { Language } from './translations';

export interface DocContent {
  introTitle: string;
  introDesc: string;
  guideTitle: string;
  step1Title: string;
  step1Items: string[];
  step2Title: string;
  step2Items: string[];
  step3Title: string;
  step3Items: string[];
  step4Title: string;
  step4Items: string[];

  spatialTitle1: string;
  spatialDesc1: string;
  spatialTitle2: string;
  grammarHacker: { title: string; desc: string };
  grammarMixer: { title: string; desc: string };
  grammarBridge: { title: string; desc: string };
  grammarDex: { title: string; desc: string };
  grammarCex: { title: string; desc: string };
  grammarEoa: { title: string; desc: string };

  taintTitle1: string;
  taintDesc1: string;
  taintTitle2: string;
  taintDesc2: string;

  explorerTitle1: string;
  explorerDesc1: string;
  explorerTitle2: string;
  explorerDesc2: string;

  casesHeader: string;
  loadCaseBtn: string;
  methodologyTitle: string;
  identifiersTitle: string;
  chronologyTitle: string;
  colPhase: string;
  colStep: string;
  colDetail: string;
}

export const DOCS_TRANSLATIONS: Record<Language, DocContent> = {
  fr: {
    introTitle: "Qu'est-ce qu'ARGUS ?",
    introDesc:
      "ARGUS fusionne un visualiseur forensique spatial 3D temps réel (WebGL / Three.js avec post-processing UnrealBloom) et un Block Explorer classique complet (type Etherscan/Arkham). Il permet de suivre le blanchiment de fonds volés à travers plusieurs blockchains, de démasquer les sorties de Mixers Zero-Knowledge (Tornado Cash) et d'inspecter chaque portefeuille, transaction ou bloc dans le moindre détail.",
    guideTitle: 'Guide Pratique Étape par Étape (How-To)',
    step1Title: '1. Naviguer dans la Scène 3D',
    step1Items: [
      'Rotation Orbitale : Maintenez le Clic Gauche et glissez la souris.',
      'Zoom Spatial : Utilisez la Molette de la souris.',
      'Panoramique (Pan) : Maintenez le Clic Droit et glissez la souris.',
      'Focus Automatique : Cliquez sur n’importe quel nœud 3D pour que la caméra vole automatiquement vers lui et ouvre son inspecteur.',
    ],
    step2Title: '2. Vérifier un Wallet, un TxHash ou un Bloc',
    step2Items: [
      'Utilisez la barre de recherche en haut pour chercher une adresse (0x..., bc1...), un nom ENS (vitalik.eth), un TxHash ou un numéro de bloc.',
      'Si l’adresse n’est pas dans le graphe actuel, ARGUS interroge les RPC publics Ethereum Mainnet en direct et génère son sous-graphe 3D automatiquement.',
    ],
    step3Title: '3. Investiguer une Entité Suspecte',
    step3Items: [
      'Double-Clic 3D Direct : Double-cliquez directement sur n’importe quel nœud pour étendre ou réduire instantanément ses voisins (+1 Hop).',
      'Dans le panneau de droite, vous pouvez également cliquer sur Expand (+1 Hop) ou Isolate Sub-Graph pour masquer le bruit.',
      'Cliquez sur Flag Suspect pour marquer un wallet à 100% de Taint et recalculer la contamination sur tous ses destinataires.',
    ],
    step4Title: '4. Rejouer un Hack dans le Temps (Time-Lapse)',
    step4Items: [
      'Utilisez la barre Chronological Hack Scrubber tout en bas de l’écran.',
      'Cliquez sur REJOUER LE HACK et choisissez la vitesse (1x, 2x, 5x) pour observer la propagation chronologique des fonds volés minute par minute.',
    ],

    spatialTitle1: '1. Stratification Verticale Multi-Chaînes (Z-Planes)',
    spatialDesc1:
      'Au lieu d’aplatir toutes les transactions sur un plan 2D confus, ARGUS sépare l’espace 3D en 4 strates holographiques superposées sur l’axe vertical Y. Un moteur de relaxation physique maintient chaque entité sur la strate de sa blockchain tout en évitant les collisions sur les axes X/Z.',
    spatialTitle2: '2. Grammaire des Géométries 3D Spécialisées',
    grammarHacker: {
      title: 'Hacker / Exploiter / Entité Sanctionnée OFAC',
      desc: 'Icosaèdre cramoisi pulsant entouré d’un anneau wireframe d’alerte en rotation inverse. Source initiale de 100% de Taint.',
    },
    grammarMixer: {
      title: 'Mixer Zero-Knowledge (Tornado Cash, Railgun, CoinJoin)',
      desc: 'Sphère de singularité sombre entourée d’un disque d’accrétion de particules violettes/quartz en rotation rapide.',
    },
    grammarBridge: {
      title: 'Pont Cross-Chain (Wormhole, Stargate, THORChain)',
      desc: 'Cylindre vertical holographique en titane émettant des colonnes de lumière reliant deux strates distinctes.',
    },
    grammarDex: {
      title: 'Pool de Liquidité DEX (Uniswap, Curve, Balancer)',
      desc: 'Octaèdre ardoise anodisée avec maillage interne révélant les flux de swaps et arbitrages.',
    },
    grammarCex: {
      title: 'Plateforme Centralisée CEX Off-Ramp (Binance, Kraken, OKX)',
      desc: 'Cube massif en laiton brossé représentant les points d’encaissement et de conversion fiat.',
    },
    grammarEoa: {
      title: 'Portefeuille Standard (EOA)',
      desc: 'Sphère mate dont le rayon est proportionnel au log10 du volume cumulé traité.',
    },

    taintTitle1: '1. Propagation Algorithmique du Taint (Conservation des Flux)',
    taintDesc1:
      'L’algorithme de contamination calcule le pourcentage de fonds volés circulant dans chaque portefeuille en appliquant le principe de conservation de la masse : lorsqu’un pirate injecte 1 000 ETH dans un portefeuille relais intermédiaire, chaque sortie ultérieure hérite proportionnellement de ce score de risque.',
    taintTitle2: '2. Heuristiques Probabilistes Post-Mixer ZK',
    taintDesc2:
      'Lorsqu’un exploiteur dépose dans Tornado Cash, le lien cryptographique direct est rompu. ARGUS utilise des heuristiques probabilistes (delta temporel de retrait, empreinte de gaz EVM, concordance de valeur de lots) pour reconstituer les liens en pointillés violets.',

    explorerTitle1: '1. Navigation Hybride & Correspondance 3D ↔ Tableau',
    explorerDesc1:
      'Chaque ligne de l’explorateur est synchronisée avec la scène 3D. Cliquer sur un portefeuille ou une transaction dans le tableau oriente automatiquement la caméra vers le nœud correspondant.',
    explorerTitle2: '2. Décodage EVM : Reçus de Gaz & CallData ABI',
    explorerDesc2:
      'Les transactions disposent d’un décodeur d’exécution EVM complet : status de validation, logs Bloom, gaz effectif utilisé et paramètres de smart contracts décodés.',

    casesHeader: '5 Cas Réels d’Attaques Vérifiés sur les Blockchains Officielles',
    loadCaseBtn: 'Charger ce Cas dans le Graphe 3D',
    methodologyTitle: 'Méthode & Vulnérabilité Racine Exploitée',
    identifiersTitle: 'Identifiants On-Chain Réels Vérifiables (Etherscan)',
    chronologyTitle: 'Chronologie Exacte & Séquencement de l’Attaque :',
    colPhase: 'Phase Tactique',
    colStep: 'Étape On-Chain',
    colDetail: 'Détail Technique & Preuve',
  },

  en: {
    introTitle: 'What is ARGUS?',
    introDesc:
      'ARGUS combines a real-time 3D spatial forensic visualizer (WebGL / Three.js with UnrealBloom post-processing) with a complete classic block explorer (Etherscan/Arkham style). It empowers investigators to trace stolen funds across multiple blockchains, unmask Zero-Knowledge mixer exits (Tornado Cash), and inspect every wallet, transaction, or block down to the byte.',
    guideTitle: 'Step-by-Step Practical Guide (How-To)',
    step1Title: '1. Navigating the 3D Space',
    step1Items: [
      'Orbital Rotation: Hold Left Click and drag.',
      'Spatial Zoom: Use your Mouse Scroll Wheel.',
      'Panning: Hold Right Click and drag.',
      'Auto Focus: Click any 3D node to smoothly fly the camera towards it and inspect its data.',
    ],
    step2Title: '2. Inspecting a Wallet, TxHash, or Block',
    step2Items: [
      'Use the top search bar to look up an address (0x..., bc1...), ENS name (vitalik.eth), TxHash, or block number.',
      'If the address is not currently loaded, ARGUS queries public Ethereum Mainnet RPCs in real-time and procedurally constructs its 3D neighborhood.',
    ],
    step3Title: '3. Investigating a Suspect Entity',
    step3Items: [
      'Direct 3D Double-Click: Double-click any node directly in space to instantly expand or collapse (+1 Hop) connected entities.',
      'In the right inspector panel, you can also click Expand (+1 Hop) or Isolate Sub-Graph to focus on 2-hop connected entities.',
      'Click Flag Suspect to designate an address as 100% tainted and recalculate downstream contamination.',
    ],
    step4Title: '4. Chronological Exploit Replay (Time-Lapse)',
    step4Items: [
      'Use the Chronological Hack Scrubber bar at the bottom.',
      'Click REPLAY EXPLOIT and select playback speed (1x, 2x, 5x) to observe stolen fund propagation minute by minute.',
    ],

    spatialTitle1: '1. 3D Multi-Chain Vertical Stratification (Z-Planes)',
    spatialDesc1:
      'Rather than flattening all transactions onto a confusing 2D surface, ARGUS stratifies 3D space into 4 holographic planes along the vertical Y-axis. A continuous physics relaxation engine stabilizes entities onto their native blockchain plane while resolving X/Z collisions.',
    spatialTitle2: '2. Specialized 3D Visual Geometry Grammar',
    grammarHacker: {
      title: 'Hacker / Exploiter / OFAC Sanctioned Entity',
      desc: 'Pulsing crimson icosahedron enclosed by a counter-rotating wireframe alert ring. Primary source of 100% taint.',
    },
    grammarMixer: {
      title: 'Zero-Knowledge Mixer (Tornado Cash, Railgun, CoinJoin)',
      desc: 'Dark singularity sphere surrounded by an accretion disk of rapidly rotating purple quartz particles.',
    },
    grammarBridge: {
      title: 'Cross-Chain Bridge (Wormhole, Stargate, THORChain)',
      desc: 'Vertical titanium beacon projecting luminous columns between separated blockchain strata.',
    },
    grammarDex: {
      title: 'DEX Liquidity Pool (Uniswap, Curve, Balancer)',
      desc: 'Anodized slate octahedron with internal wireframe revealing swaps and arbitrage routing.',
    },
    grammarCex: {
      title: 'Centralized Exchange Off-Ramp (Binance, Kraken, OKX)',
      desc: 'Brushed brass cube marking fiat liquidation and exit portals.',
    },
    grammarEoa: {
      title: 'Standard Wallet (EOA)',
      desc: 'Matte sphere whose radius scales with the log10 of total cumulative volume.',
    },

    taintTitle1: '1. Algorithmic Taint Propagation (Conservation of Flow)',
    taintDesc1:
      'The taint engine calculates the percentage of stolen funds held by every wallet using mass conservation heuristics: when an exploiter injects 1,000 ETH into an intermediary peel wallet, each outgoing transaction proportionately inherits this risk score.',
    taintTitle2: '2. Probabilistic Post-Mixer ZK Correlations',
    taintDesc2:
      'When an attacker deposits into Tornado Cash, direct cryptographic links are severed. ARGUS applies probabilistic heuristics (withdrawal time delta, EVM gas price fingerprints, batch denomination matches) to reconstruct dashed purple links.',

    explorerTitle1: '1. Hybrid Navigation & 3D ↔ Table Synchronization',
    explorerDesc1:
      'Every row in the explorer is linked to the 3D scene. Clicking any wallet or transaction in the table automatically pivots the 3D camera to focus on the target node.',
    explorerTitle2: '2. EVM Decoding: Gas Receipts & ABI CallData',
    explorerDesc2:
      'Transactions feature a comprehensive EVM inspector: execution status, Bloom filter logs, effective gas price, and decoded smart contract parameters.',

    casesHeader: '5 Verified Historical Exploits Documented on Official Blockchains',
    loadCaseBtn: 'Load Case into 3D Graph',
    methodologyTitle: 'Root Vulnerability & Exploit Methodology',
    identifiersTitle: 'Verified Real On-Chain Identifiers (Etherscan)',
    chronologyTitle: 'Attack Sequencing & Chronology:',
    colPhase: 'Tactical Phase',
    colStep: 'On-Chain Step',
    colDetail: 'Technical Detail & On-Chain Proof',
  },
};
