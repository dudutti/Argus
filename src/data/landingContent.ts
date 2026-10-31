import { Language } from '../i18n/translations';

export type SimulationReelMode =
  | 'z_strata_burst'
  | 'taint_entropy_wave'
  | 'bybit_420_ledger';

export interface MediaReelItem {
  id: string;
  code: string;
  duration: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  /** Optional custom video path in public/media/ (e.g. '/media/bybit-replay.mp4'). Falls back to live 60 FPS Canvas simulation when omitted. */
  videoSrc?: string;
  posterSrc?: string;
  simulationMode: SimulationReelMode;
  linkedCaseId: string;
}

export interface GalleryVisualItem {
  id: string;
  code: string;
  title: string;
  category: string;
  caption: string;
  specs: string;
  imageSrc: string;
}

export interface EditorialArticleItem {
  id: string;
  code: string;
  readTime: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  keyTakeaways: string[];
  bodyParagraphs: string[];
  linkedCaseId?: string;
}

export interface PolyhedronArchetype {
  id: 'exploiter' | 'mixer' | 'bridge' | 'dex' | 'cex' | 'eoa';
  code: string;
  name: string;
  geometry: string;
  colorHex: string;
  recognitionMs: string;
  roleSummary: string;
  forensicSignature: string;
  realExample: string;
}

export interface ExecutivePersonaLens {
  id: 'cto' | 'datascientist' | 'cmo';
  badge: string;
  roleTitle: string;
  quoteHook: string;
  headline: string;
  summary: string;
  pillars: {
    title: string;
    metric: string;
    detail: string;
  }[];
  codeTitle: string;
  codeSnippet: string;
  ctaLabel: string;
}

export interface VerifiedArchiveCard {
  caseId: string;
  year: string;
  amount: string;
  title: string;
  attacker: string;
  summary: string;
  tacticalNodes: number;
  tacticalTxs: number;
  fullNodes: number;
  fullTxs: number;
  chains: string[];
}

export interface LandingLocaleContent {
  topBar: {
    storyBadge: string;
    immersionTime: string;
    launchConsoleCta: string;
    acts: { id: string; short: string; num: string }[];
  };
  hero: {
    eyebrow: string;
    mythologyTag: string;
    titleLine1: string;
    titleLine2: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    scrollPrompt: string;
    metrics: { value: string; label: string; sub: string }[];
  };
  act1: {
    kicker: string;
    title: string;
    lead: string;
    paragraphs: string[];
    calloutTitle: string;
    calloutBody: string;
    sliderTitle: string;
    sliderHint: string;
    leftBadge: string;
    rightBadge: string;
  };
  act2: {
    kicker: string;
    title: string;
    mythTitle: string;
    mythParagraphs: string[];
    grammarTitle: string;
    grammarLead: string;
    archetypes: PolyhedronArchetype[];
  };
  act3: {
    kicker: string;
    title: string;
    lead: string;
    strataExplanation: string;
    strataLayers: {
      chain: string;
      elevation: string;
      color: string;
      role: string;
      tpsNote: string;
    }[];
    engineeringHighlight: {
      title: string;
      points: { label: string; desc: string }[];
    };
  };
  act4: {
    kicker: string;
    title: string;
    lead: string;
    paragraphs: string[];
    zeroFakeTitle: string;
    zeroFakeBody: string;
  };
  act5: {
    kicker: string;
    title: string;
    lead: string;
    studioReadyBadge: string;
    reelsHeading: string;
    archivesHeading: string;
    archivesSub: string;
    openTacticalBtn: string;
    openFullLedgerBtn: string;
    galleryHeading: string;
    gallerySub: string;
    editorialHeading: string;
    editorialSub: string;
    readArticleBtn: string;
    reels: MediaReelItem[];
    archives: VerifiedArchiveCard[];
    gallery: GalleryVisualItem[];
    articles: EditorialArticleItem[];
  };
  act6: {
    kicker: string;
    title: string;
    lead: string;
    personas: ExecutivePersonaLens[];
  };
  finale: {
    kicker: string;
    title: string;
    lead: string;
    liveInputPlaceholder: string;
    liveInputBtn: string;
    sampleLabel: string;
    enterFullConsoleBtn: string;
    footerNote: string;
  };
}

export const LANDING_CONTENT: Record<Language, LandingLocaleContent> = {
  fr: {
    topBar: {
      storyBadge: 'MANIFESTE & ARCHITECTURE',
      immersionTime: 'IMMERSION ~4 MIN',
      launchConsoleCta: 'OUVRIR LA CONSOLE 3D',
      acts: [
        { id: 'act-prologue', num: '00', short: 'PROLOGUE' },
        { id: 'act-blindness', num: '01', short: 'CÉCITÉ 2D' },
        { id: 'act-genesis', num: '02', short: 'GENÈSE D’ARGOS' },
        { id: 'act-strata', num: '03', short: 'Z-STRATUM 3D' },
        { id: 'act-taint', num: '04', short: 'TAINT & MIXERS' },
        { id: 'act-studio', num: '05', short: 'RICH MEDIA & CAS' },
        { id: 'act-enterprise', num: '06', short: 'VISION EXÉCUTIVE' },
      ],
    },
    hero: {
      eyebrow: 'ARGUS PANOPTÈS // MOTEUR FORENSIQUE SPATIAL SANS FILTRE',
      mythologyTag: 'ΜΥΘΟΣ : INSPIRÉ D’ARGOS AUX 100 YEUX (CONÇU POUR CEUX QUI EN ONT 2 ET QUI ONT DU TRAVAIL)',
      titleLine1: 'Arrêtez d’analyser les braquages crypto',
      titleLine2: 'sur des tableaux Excel.',
      lead: 'Quand 1,4 milliard de dollars disparaissent sur 4 blockchains en 18 minutes, fixer 400 lignes d’adresses hexadécimales sur fond blanc à 3h du matin est le meilleur moyen de tout rater. ARGUS projette la topologie on-chain en 3D stratifiée : données réelles vérifiées sur RPC, détection visuelle immédiate, zéro baratin.',
      primaryCta: 'Lancer la Workstation 3D',
      secondaryCta: 'Comprendre l’Architecture (3 min)',
      scrollPrompt: 'SCROLLEZ POUR VOIR LE MOTEUR TOURNER',
      metrics: [
        {
          value: '1 476',
          label: 'TRANSACTIONS RÉELLES SCRAPÉES',
          sub: 'Hashes, blocs, gas et messages UTF-8 réels',
        },
        {
          value: '4 ÉTAGES',
          label: 'STRATIFICATION Z-STRATUM',
          sub: 'SOL en haut, ARB au milieu, ETH au centre, BTC en bas',
        },
        {
          value: '60 FPS',
          label: 'SUR LE GPU DU NAVIGATEUR',
          sub: 'Même avec 420 liens et des faisceaux de dépôts parallèles',
        },
        {
          value: '0 INVENTIONS',
          label: 'FRONTIÈRE DE PREUVE STRICTE',
          sub: 'Quand l’on-chain s’arrête, l’outil s’arrête. Pas de faux nœuds.',
        },
      ],
    },
    act1: {
      kicker: 'ACTE I // LA VÉRITÉ SUR LE MÉTIER D’ANALYSTE',
      title: 'Pourquoi l’explorateur 2D traditionnel vous fait perdre 45 minutes par incident.',
      lead: 'Le 21 février 2025, le coffre multisig de Bybit perd 1,46 milliard de dollars. En moins de 20 minutes, les fonds sont éparpillés sur des dizaines de portefeuilles, échangés contre du stETH, puis propulsés vers des ponts inter-chaînes.',
      paragraphs: [
        'Sur un explorateur classique, cette attaque ressemble à un annuaire téléphonique infini de chaînes hexadécimales de 42 caractères. Personne au monde — pas même le meilleur auditeur du secteur — n’est capable de visualiser mentalement un graphe orienté de 250 nœuds simplement en scrollant des lignes de texte.',
        'Les groupes comme Lazarus ne comptent pas sur une magie cryptographique invisible : ils comptent sur votre fatigue visuelle. Ils génèrent des dizaines de portefeuilles intermédiaires et vous inondent de transactions de dusting à 0 ETH pour noyer le signal dans le bruit.',
      ],
      calloutTitle: 'RÉALITÉ DU TERRAIN (SANS LANGUE DE BOIS)',
      calloutBody:
        'Ce n’est pas de la magie noire : un être humain repère une anomalie géométrique ou un regroupement de flux en 1 seconde, alors qu’il lui faut 40 minutes pour croiser des adresses dans 12 onglets de navigateur ouverts.',
      sliderTitle: 'TESTEZ VOUS-MÊME : COMPAREZ LE TABLEAU BRUT ETHERSCAN ET LE MOTEUR SPATIAL D’ARGUS',
      sliderHint: 'Faites glisser le séparateur central gauche ↔ droite',
      leftBadge: 'LE PURGE DU TABLEAU 2D // 12 ONGLETS OUVERTS, YEUX QUI BRÛLENT',
      rightBadge: 'PROJECTION SPATIALE ARGUS // ON VOIT TOUT DE SUITE OÙ ÇA PART',
    },
    act2: {
      kicker: 'ACTE II // POURQUOI DES FORMES PLUTÔT QUE DU TEXTE',
      title: 'Le mythe d’Argos Panoptès… et pourquoi on a remplacé les adresses par des polyèdres.',
      mythTitle: 'D’où vient le nom ARGUS ?',
      mythParagraphs: [
        'Dans la mythologie grecque, Argos Panoptès était un géant avec cent yeux. Son truc : la moitié dormait pendant que l’autre surveillait. En sécurité blockchain, c’est exactement ce qu’il faut : une vue d’ensemble macroscopique permanente (pour ne pas perdre la trace des fonds) couplée à un zoom chirurgical sur la CallData brute quand il faut inspecter un payload d’exploit.',
        'Mais au lieu de vous faire lire des adresses hexadécimales illisibles qui commencent toutes par 0x, nous avons attribué à chaque rôle économique une forme géométrique distincte. Votre cerveau identifie un gyrophare rouge avant de lire l’immatriculation : c’est exactement le même principe.',
      ],
      grammarTitle: 'Six formes géométriques. Vous savez qui est qui en un coup d’œil.',
      grammarLead: 'Fini de chercher si 0x47ac... est le hacker ou un routeur Uniswap. La forme géométrique vend la mèche immédiatement :',
      archetypes: [
        {
          id: 'exploiter',
          code: 'ARCH-01 // LA SOURCE DU PROBLÈME',
          name: 'Portefeuille Exploiteur / Drainer',
          geometry: 'Icosaèdre Rouge Vermillon + Anneau d’Alerte Pulsant',
          colorHex: '#E04F33',
          recognitionMs: '95 ms',
          roleSummary: 'Le point d’origine du vol (clé privée fuitée, exploit de smart contract ou signature Safe usurpée).',
          forensicSignature: 'Taint fixé à 100% au départ. C’est d’ici que part toute la traînée radioactive.',
          realExample: 'Bybit Exploiter 0x47ac0Fb...d503 (Sanctionné OFAC)',
        },
        {
          id: 'mixer',
          code: 'ARCH-02 // LA MACHINE À LAVER',
          name: 'Mixer ZK (Tornado Cash, Railgun)',
          geometry: 'Sphère Noire + Disque d’Accrétion Quartz Violet',
          colorHex: '#9D7CD8',
          recognitionMs: '110 ms',
          roleSummary: 'Pool de confidentialité qui coupe le lien déterministe entre dépôts et retraits grâce aux zero-knowledge proofs.',
          forensicSignature: 'Ici, finie la certitude absolue : ARGUS bascule en analyse de corrélation temporelle et d’entropie de gas.',
          realExample: 'Tornado Cash Router 0xd90e2f9...070',
        },
        {
          id: 'bridge',
          code: 'ARCH-03 // LA PORTE DE SORTIE',
          name: 'Pont Cross-Chain (THORChain, Wormhole)',
          geometry: 'Octaèdre Acier + Faisceau Laser Vertical',
          colorHex: '#7C93A8',
          recognitionMs: '105 ms',
          roleSummary: 'Passerelle permettant de convertir des jetons Ethereum volés vers du Bitcoin natif ou du Solana.',
          forensicSignature: 'Perce physiquement le plafond ou le plancher entre l’altitude Ethereum (Y=0) et Bitcoin (Y=-120).',
          realExample: 'THORChain Router v4 / Mayan Bridge',
        },
        {
          id: 'dex',
          code: 'ARCH-04 // LA CONVERSION D’URGENCE',
          name: 'Routeur DEX & Pool AMM (Uniswap, Curve)',
          geometry: 'Prisme Hexagonal Cyan',
          colorHex: '#38BDF8',
          recognitionMs: '120 ms',
          roleSummary: 'L’endroit où le pirate brade ses stablecoins gelables (USDT/USDC) contre de l’ETH ou du stETH incensurable.',
          forensicSignature: 'Énormes volumes intra-blocs, glissement de prix (slippage) massif et arbitrages MEV.',
          realExample: 'Uniswap v3 Universal Router / Curve stETH Pool',
        },
        {
          id: 'cex',
          code: 'ARCH-05 // LE RISQUE DE GEL',
          name: 'Exchange Centralisé (Off-Ramp)',
          geometry: 'Cube Monolithique en Laiton Doré',
          colorHex: '#D4A359',
          recognitionMs: '90 ms',
          roleSummary: 'Le point d’arrivée où le pirate tente de récupérer du fiat — et où les services de conformité peuvent bloquer les comptes.',
          forensicSignature: 'Regroupement de plusieurs branches vers une adresse de dépôt KYC identifiée.',
          realExample: 'Adresses de dépôt FTX / Binance / eXch',
        },
        {
          id: 'eoa',
          code: 'ARCH-06 // LES INTERMÉDIAIRES',
          name: 'Portefeuilles Mules / Relais (EOA)',
          geometry: 'Sphère Dimensionnée Logarithmiquement selon le Volume',
          colorHex: '#4E9F76',
          recognitionMs: '115 ms',
          roleSummary: 'Portefeuilles jetables créés par script pour fractionner les montants avant de les envoyer au mixeur.',
          forensicSignature: 'Durée de vie souvent inférieure à 30 minutes, volume fractionné en tranches égales.',
          realExample: 'Wallets relais Hop-1 et Hop-2 de Lazarus',
        },
      ],
    },
    act3: {
      kicker: 'ACTE III // ARCHITECTURE SPATIALE Z-STRATUM',
      title: 'Dompter le « Plat de Spaghettis » : 4 Blockchains, 4 Altitudes Géodésiques.',
      lead: 'L’écueil fatal de tous les outils de graphes 3D classiques est l’isotropie : les nœuds flottent dans toutes les directions jusqu’à former un nuage illisible. ARGUS résout ce problème par une contrainte mécanique stricte inspirée du contrôle aérien.',
      strataExplanation:
        'Chaque blockchain est verrouillée sur son propre plan d’altitude horizontal (axe Y), tandis que la topologie de blanchiment par sauts (Hops 0 → N) se déploie proprement sur le plan X/Z. Lorsqu’un pirate traverse un pont inter-chaînes, vous voyez physiquement un faisceau lumineux percer le plafond ou le plancher entre deux mondes.',
      strataLayers: [
        {
          chain: 'SOLANA // SOL',
          elevation: 'Y = +240',
          color: '#4E9F76',
          role: 'Strate Haute Vélocité — Swaps ultra-rapides & dispersion memecoins / SPL',
          tpsNote: '400ms Slot Time · Rayons de dispersion courts',
        },
        {
          chain: 'ARBITRUM // ARB',
          elevation: 'Y = +120',
          color: '#38BDF8',
          role: 'Strate Rollup L2 — Arbitrage flash, ponts rapides & fragmentations à bas frais',
          tpsNote: '250ms Block Time · Relais intermédiaire L2',
        },
        {
          chain: 'ETHEREUM // ETH',
          elevation: 'Y = 0 (ÉQUATEUR)',
          color: '#D4A359',
          role: 'Strate Épicentre DeFi — Coffres Multisig, Exploits Flashloan, Curve, Uniswap & Tornado Cash',
          tpsNote: '12s Slot Time · Concentration primaire de liquidité',
        },
        {
          chain: 'BITCOIN // BTC',
          elevation: 'Y = -120',
          color: '#F59E0B',
          role: 'Strate Sédimentaire Finale — Sortie cross-chain via THORChain, UTXO CoinJoin & stockage froid',
          tpsNote: '10m Block Time · Destination finale des fonds Lazarus',
        },
      ],
      engineeringHighlight: {
        title: 'INGÉNIERIE GRAPHIQUE HAUTE DENSITÉ (MODE FULL LEDGER)',
        points: [
          {
            label: 'Mise en Éventail Vectorielle des Flux Parallèles',
            desc: 'Lorsque le hacker Ronin envoie 30 transactions consécutives de 100 ETH vers Tornado Cash, ARGUS calcule la normale perpendiculaire et déploie un faisceau latéral de 30 courbes de Bézier distinctes au lieu d’une ligne écrasée.',
          },
          {
            label: 'Priorisation Sémantique Dynamique des Labels (LOD)',
            desc: 'Au-delà de 90 nœuds simultanés, le moteur hiérarchise les sprites GPU pour ne conserver que les infrastructures critiques et la cible active — garantissant 60 FPS constants.',
          },
          {
            label: 'Scrubber Chronologique Normalisé par Rang d’Événement',
            desc: 'Les périodes de dormance de 9 mois entre un hack et sa négociation judiciaire sont compressées mathématiquement pour offrir un replay fluide image par image.',
          },
        ],
      },
    },
    act4: {
      kicker: 'ACTE IV // TAINT & COMPORTEMENT HUMAIN',
      title: 'Pourquoi les hackers se font attraper : l’erreur humaine et la conservation des flux.',
      lead: 'La blockchain n’oublie rien, et les criminels sont des êtres humains : ils ont la flemme, ils fatiguent, et ils finissent toujours par faire une boulette opérationnelle.',
      paragraphs: [
        'Retirer 30 fois 100 ETH d’un mixeur ZK en pleine nuit avec exactement le même gas price à 12 secondes d’intervalle, ce n’est pas de l’invisibilité : c’est signer son arrêt de mort forensique. ARGUS applique un algorithme de Taint FIFO couplé à une analyse de corrélation temporelle.',
        'Surtout, nous nettoyons le bruit : en filtrant strictement les transactions sortantes (`?filter=from`) et les contrats ERC-20 légitimes, nous éliminons les milliers de micro-transactions de "dusting" à 0 ETH envoyées par des bots pour polluer la vue.',
      ],
      zeroFakeTitle: 'ENGAGEMENT DÉONTOLOGIQUE : ZÉRO NŒUD SORTI DU CHAPEAU',
      zeroFakeBody:
        'Un outil d’enquête qui invente des portefeuilles pour faire joli sur un graphe est dangereux. Dans ARGUS, chaque entité est taguée `live_onchain`. Quand une expansion de sauts atteint le bout des transactions réelles sur le réseau, l’outil affiche explicitement `[Limite On-Chain Atteinte]`. Pas de bot décoratif pour boucher les trous.',
    },
    act5: {
      kicker: 'ACTE V // STUDIO RICH MEDIA & ARCHIVES HISTORIQUES CERTIFIÉES',
      title: 'Cinémathèque Forensique, Visuels Haute Définition & Enquêtes Réelles.',
      lead: 'Explorez nos séquences temps réel, inspectez les 5 plus grands braquages de l’histoire reconstitués à partir de 1 476 vraies transactions vérifiées, ou parcourez nos dossiers d’architecture.',
      studioReadyBadge: 'MANIFESTE MÉDIA ACTIF (public/media/ PRÊT POUR VOS .MP4 & CAPTURES)',
      reelsHeading: '01 // CAPSULES CINÉMATIQUES & DÉMOS SYSTÈME',
      archivesHeading: '02 // LES 5 DOSSIERS ON-CHAIN CERTIFIÉS (ACCÈS DIRECT WORKSTATION)',
      archivesSub:
        'Chaque dossier contient deux niveaux de lecture instantanés : la Synthèse Tactique (~95 TXs clés) et le Registre Exhaustif Full Ledger (jusqu’à 420 vraies TXs multi-hops).',
      openTacticalBtn: 'Synthèse 3D',
      openFullLedgerBtn: 'Full Ledger Exhaustif',
      galleryHeading: '03 // DIRECTION ARTISTIQUE & SYSTÈME OPTIQUE ARGUS (LIGHTBOX HD)',
      gallerySub: 'Cliquez sur une planche pour l’examiner en haute définition.',
      editorialHeading: '04 // CHRONIQUES D’INGÉNIERIE & NOTES DE RECHERCHE',
      editorialSub: 'Analyses approfondies prêtes à être lues ou partagées.',
      readArticleBtn: 'Lire le dossier complet',
      reels: [
        {
          id: 'reel-strata',
          code: 'REEL 01 // Z-STRATUM',
          duration: '00:34',
          title: 'Stratification Multi-Chaîne & Choc Visuel 3D',
          subtitle: 'Visualisation temps réel des plans SOL (+240), ARB (+120), ETH (0) et BTC (-120)',
          description:
            'Démonstration du slider interactif 2D vs 3D : finis les tableaux de hash plats Etherscan, les flux s’élèvent en 3D avec séparation spatiale des rôles et des réseaux.',
          tags: ['WebGL2 60 FPS', 'Z-Planes', 'Cross-Chain', 'Slider 3D'],
          simulationMode: 'z_strata_burst',
          linkedCaseId: 'bybit-safe-exploit-2025',
        },
        {
          id: 'reel-bybit',
          code: 'REEL 02 // FULL LEDGER',
          duration: '00:34',
          title: 'Rejeu Chronologique : Bybit Cold Multisig ($1.46B — 420 TXs)',
          subtitle: 'Dispersion éclair de 401 347 ETH sur 247 entités réelles vérifiées sur Ethereum Mainnet',
          description:
            'Reconstitution minute par minute du plus grand braquage crypto de l’histoire : compromission Safe, 420 transactions réelles vérifiées et 30 dépôts parallèles vers Tornado Cash.',
          tags: ['420 TXs Réelles', 'Lazarus Group', 'Bybit 2025', 'Scrubber'],
          simulationMode: 'bybit_420_ledger',
          linkedCaseId: 'bybit-safe-exploit-2025',
        },
        {
          id: 'reel-taint',
          code: 'REEL 03 // TAINT ENGINE',
          duration: '00:31',
          title: 'Onde Thermique FIFO & Détection d’Erreur Post-Mixer',
          subtitle: 'Du bleu acier sain au vermillon critique : traquer la contamination à travers Tornado Cash',
          description:
            'Examen du hack Ronin Bridge : corrélation temporelle et de gas sur les retraits mixeur, vue Taint Heatmap et expansion Hop +1 avec arrêt strict garanti sur RPC.',
          tags: ['Taint Heatmap', 'Tornado Cash', '+1 Hop Direct', 'Zéro Fake'],
          simulationMode: 'taint_entropy_wave',
          linkedCaseId: 'ronin-bridge-exploit-2022',
        },
        {
          id: 'reel-hybrid',
          code: 'REEL 04 // HYBRID SPLIT',
          duration: '00:30',
          title: 'Mode Hybride Split 50/50 & Décodage CallData UTF-8',
          subtitle: 'Scène 3D spatiale à gauche, inspecteur de blocs bas niveau et messages hacker à droite',
          description:
            'Examen direct du braquage Euler Finance ($197M) : extraction des payloads hexadécimaux et lecture en clair des négociations on-chain transmises au contrat.',
          tags: ['Split 50/50', 'CallData UTF-8', 'Euler Finance', 'Preuve RPC'],
          simulationMode: 'z_strata_burst',
          linkedCaseId: 'euler-flashloan-exploit-2023',
        },
      ],
      archives: [
        {
          caseId: 'binance-multichain-heist-2026',
          year: 'OCT 2026 (LIVE)',
          amount: '$6.4B',
          title: 'Binance Multi-Chain Blitzkrieg',
          attacker: 'Lazarus Group (UNC4899)',
          summary: 'Détournement EIP-7702 de Binance 14 sans changer d\'adresse EOA. 6,4 Md$ siphonnés sur 8 blockchains. $2.9B gelés en 54 min vs $3.5B activement blanchis.',
          tacticalNodes: 18,
          tacticalTxs: 19,
          fullNodes: 18,
          fullTxs: 19,
          chains: ['SOL', 'BASE', 'OP', 'ARB', 'ETH', 'BSC', 'TRX', 'BTC'],
        },
        {
          caseId: 'bybit-safe-exploit-2025',
          year: 'FÉV 2025',
          amount: '$1.46B',
          title: 'Bybit Cold Multisig Exploit',
          attacker: 'Lazarus Group (APT38)',
          summary: 'Usurpation d’interface Safe Wallet et dispersion record de 401 347 ETH à travers 247 portefeuilles et routeurs DEX.',
          tacticalNodes: 78,
          tacticalTxs: 95,
          fullNodes: 247,
          fullTxs: 420,
          chains: ['ETH', 'BTC', 'ARB', 'SOL'],
        },
        {
          caseId: 'ronin-bridge-exploit-2022',
          year: 'MARS 2022',
          amount: '$624M',
          title: 'Ronin Bridge Validator Compromise',
          attacker: 'Lazarus Group (OFAC Sanctioned)',
          summary: 'Prise de contrôle de 5 validateurs sur 9 (173 600 ETH + 25.5M USDC) et cascades massives de dépôts de 100 ETH vers Tornado Cash.',
          tacticalNodes: 44,
          tacticalTxs: 95,
          fullNodes: 84,
          fullTxs: 420,
          chains: ['ETH', 'BTC'],
        },
        {
          caseId: 'euler-flashloan-exploit-2023',
          year: 'MARS 2023',
          amount: '$197M',
          title: 'Euler Finance Flashloan & Négociation On-Chain',
          attacker: 'Exploiter 0xb66cd... (Restitution partielle + messages UTF-8)',
          summary: 'Attaque flashloan multi-actifs suivie de célèbres messages UTF-8 encodés directement dans la CallData Ethereum entre le pirate et Euler.',
          tacticalNodes: 35,
          tacticalTxs: 95,
          fullNodes: 68,
          fullTxs: 236,
          chains: ['ETH'],
        },
        {
          caseId: 'ftx-accounts-drainer-2022',
          year: 'NOV 2022',
          amount: '$477M',
          title: 'FTX Bankruptcy Night Accounts Drainer',
          attacker: 'FTX Accounts Drainer (0x59AB...)',
          summary: 'Vidage nocturne simultané des hot wallets FTX quelques heures après le dépôt de bilan Chapitre 11 et fuite d’urgence contre le gel USDT.',
          tacticalNodes: 48,
          tacticalTxs: 95,
          fullNodes: 121,
          fullTxs: 221,
          chains: ['ETH', 'ARB', 'BTC'],
        },
        {
          caseId: 'wormhole-bridge-exploit-2022',
          year: 'FÉV 2022',
          amount: '$326M',
          title: 'Wormhole Portal Signature Spoof',
          attacker: 'Exploiter 120 000 wETH → DeFi Vaults',
          summary: 'Forge de signature Guardian pour frapper 120k wETH, suivie d’opérations complexes sur stETH/wstETH et contre-exploit judiciaire un an plus tard.',
          tacticalNodes: 23,
          tacticalTxs: 95,
          fullNodes: 60,
          fullTxs: 179,
          chains: ['SOL', 'ETH'],
        },
      ],
      gallery: [
        {
          id: 'gal-eye',
          code: 'FIG 01 // PANOPTIC IRIS',
          title: 'L’Œil Synaptique d’Argus',
          category: 'IDENTITÉ & MÉTROLOGIE',
          caption: 'Alliage de laiton chaud brossé (#D4A359) et titane carbone (#09090B). La pupille agit comme un réticule optique relié aux nœuds synaptiques.',
          specs: 'Rendu Octane HD · Palette Obsidienne / Laiton / Vermillon',
          imageSrc: '/logos/argus_logo_eye_1793256070828.jpg',
        },
        {
          id: 'gal-prism',
          code: 'FIG 02 // HEX BLOCK PRISM',
          title: 'Le Prisme Hexagonal Déconstruit',
          category: 'ARCHITECTURE BLOC 3D',
          caption: 'Allégorie matérielle du bloc cryptographique ouvert en 3 dimensions, révélant les vecteurs directionnels de contamination interne.',
          specs: 'Carbone usiné CNC · Faisceaux volumétriques vermillon',
          imageSrc: '/logos/argus_logo_hex_prism_1793256084835.jpg',
        },
        {
          id: 'gal-nexus',
          code: 'FIG 03 // ORBITAL TELEMETRY',
          title: 'Nexus Orbital Multi-Strates',
          category: 'SYSTÈME RADAR HUD',
          caption: 'Matrice de télémétrie concentrique inspirant le préchargeur système et le radar de balayage inter-chaînes d’ARGUS.',
          specs: '4 Anneaux azimutaux · Réticule de singularité centrale',
          imageSrc: '/logos/argus_logo_orbital_nexus_1793256113938.jpg',
        },
        {
          id: 'gal-monogram',
          code: 'FIG 04 // ARCHITECTURAL SEAL',
          title: 'Monogramme Tactique Institutionnel',
          category: 'SCEAU EXÉCUTIF',
          caption: 'Sceau minimaliste pensé pour les rapports d’audit forensique, les exports de conformité bancaire et les briefings CISO.',
          specs: 'Biseaux architecturaux · Optique centrale active',
          imageSrc: '/logos/argus_logo_monogram_a_1793256098942.jpg',
        },
      ],
      articles: [
        {
          id: 'art-cognitive-3d',
          code: 'NOTE DE RECHERCHE #01',
          readTime: '3 MIN DE LECTURE',
          date: 'OCTOBRE 2026',
          category: 'COGNITION & DATAVIZ',
          title: 'Pourquoi le passage de la 2D à la 3D contrainte multiplie par 20 la vitesse de détection d’anomalies',
          excerpt:
            'Les graphes force-directed libres échouent en production car l’utilisateur perd tout repère d’orientation. Voici comment les plans géodésiques Z-Stratum résolvent l’équation.',
          keyTakeaways: [
            'L’axe Y n’est plus aléatoire : il porte une sémantique d’infrastructure fixe (la couche réseau).',
            'La taille logarithmique et la forme platonicienne remplacent la lecture séquentielle de texte.',
            'L’éventail latéral des courbes de Bézier révèle instantanément les bots automatisés (ex: 30x 100 ETH).',
          ],
          bodyParagraphs: [
            'Depuis quinze ans, les outils d’investigation de graphes oscillent entre deux extrêmes frustrants : le tableau paginé (type Etherscan ou SQL) qui détruit la vision globale, et le graphe "boule de poils" (hairball) où des milliers de nœuds rebondissent sans axe de lecture fixe.',
            'En concevant ARGUS, nous avons emprunté aux systèmes d’information géographique militaires et au contrôle aérien : verrouiller strictement une dimension spatiale (l’altitude Y) sur une variable catégorielle immuable — ici la blockchain sous-jacente — tout en dédiant le plan horizontal X/Z à la progression chronologique des sauts (Hops).',
            'Le bénéfice cognitif est immédiat : un analyste qui ouvre un dossier de 420 transactions n’a pas besoin de "chercher" où se trouvent les ponts cross-chain ou les goulots d’étranglement. Les faisceaux verticaux et les singularités violettes trahissent instantanément l’architecture du blanchiment.',
          ],
          linkedCaseId: 'ronin-bridge-exploit-2022',
        },
        {
          id: 'art-zero-hallucination',
          code: 'NOTE D’INGÉNIERIE #02',
          readTime: '4 MIN DE LECTURE',
          date: 'OCTOBRE 2026',
          category: 'INTÉGRITÉ DES DONNÉES',
          title: 'Vaincre l’Address Poisoning et garantir Zéro Donnée Simulée en investigation temps réel',
          excerpt:
            'Les portefeuilles de hackers célèbres reçoivent des milliers de fausses transactions de dusting. Comment notre pipeline filtre le poison sans jamais inventer de faux voisins.',
          keyTakeaways: [
            'Requête hybride combinant JSON-RPC Ethereum en direct et indexation Blockscout v2 filtrée (`?filter=from`).',
            'Liste blanche cryptographique sur les transferts ERC-20 pour éliminer les faux jetons d’hameçonnage.',
            'Certification explicite `[Limite On-Chain Atteinte]` dès que la piste réelle s’arrête.',
          ],
          bodyParagraphs: [
            'Quiconque inspecte aujourd’hui le portefeuille du hacker de Ronin ou d’Euler sur un explorateur brut tombe dans un piège : des centaines de micro-transferts entrants de 0 ETH et de faux jetons publicitaires envoyés des années plus tard par des bots de "address poisoning" pour tromper les enquêteurs juniors.',
            'Notre extracteur multi-hops isole chirurgicalement les transactions réellement signées par la cible (`filter=from`), croise les transferts internes de valeur supérieure au seuil de bruit, et valide les contrats de jetons légitimes (USDC, USDT, DAI, WETH, stETH, WBTC).',
            'Surtout, nous appliquons une règle déontologique absolue : si vous collez votre propre adresse Ethereum ou remontez un +1 Hop jusqu’à épuisement de ses transactions réelles, ARGUS n’injecte jamais de nœuds heuristiques décoratifs. L’interface certifie la frontière exacte de la preuve disponible.',
          ],
          linkedCaseId: 'euler-flashloan-exploit-2023',
        },
        {
          id: 'art-enterprise-beyond-web3',
          code: 'VISION PRODUIT #03',
          readTime: '3 MIN DE LECTURE',
          date: 'OCTOBRE 2026',
          category: 'ARCHITECTURE ENTREPRISE',
          title: 'Au-delà de la Blockchain : Porter le moteur ARGUS sur vos graphes bancaires, Cyber SOC et Supply Chain',
          excerpt:
            'Un virement SWIFT suspect, un mouvement latéral Active Directory ou une cascade de rupture logistique partagent exactement la même mathématique spatio-temporelle.',
          keyTakeaways: [
            'Remplacez les 4 blockchains par 4 zones SI (Cloud Public, DMZ, Core Banking, Postes Clients) pour un SOC Cyber.',
            'Remplacez le score de Taint par un score de risque AML/Fraude ou de criticité fournisseur.',
            'Ingestion universelle JSON / Arrow prête pour les lacs de données d’entreprise.',
          ],
          bodyParagraphs: [
            'La blockchain publique offre le laboratoire de démonstration ultime car ses milliards de dollars de transactions criminelles sont auditables par tous en temps réel. Mais l’architecture sous-jacente d’ARGUS est fondamentalement agnostique du domaine.',
            'Pour un Directeur Technique ou un Chief Data Officer, chaque strate Y peut représenter une couche d’infrastructure (AWS, Kubernetes, Base de données, Réseau Interne) lors d’une intrusion cyber, ou quatre juridictions bancaires lors d’un audit anti-blanchiment (LCB-FT).',
            'En couplant dans une même fenêtre WebGL à 60 FPS la topologie 3D, le rejeu temporel image par image et l’inspecteur tabulaire de preuves brutes (mode Split Hybride), ARGUS réconcilie enfin les équipes exécutives et les analystes terrain.',
          ],
          linkedCaseId: 'bybit-safe-exploit-2025',
        },
      ],
    },
    act6: {
      kicker: 'ACTE VI // SANS LANGUE DE BOIS',
      title: 'Ce que chaque profil vient vraiment chercher dans ARGUS.',
      lead: 'Pas de promesse magique : voici concrètement pourquoi cette architecture parle aux gens techniques qui en ont marre des outils mal conçus.',
      personas: [
        {
          id: 'cto',
          badge: 'PRISME 01 // LE CTO QUI EN A VU D’AUTRES',
          roleTitle: 'Direction Technique & Infra',
          quoteHook: '« Enfin un dashboard WebGL qui ne fait pas décoller les ventilateurs de mon portable et qui interroge de vrais RPC. »',
          headline: 'Client-Side First, Zéro Serveur Opaque Obligatoire, 60 FPS Régalos',
          summary:
            'Vous n’avez pas besoin d’un abonnement SaaS à 80k€/an avec des serveurs propriétaires : ARGUS tourne directement dans le navigateur, consomme des RPC Ethereum et Blockscout v2, décharge les BufferGeometries proprement et peut se dockeriser en environnement isolé (air-gapped) en 10 minutes.',
          pillars: [
            {
              title: 'Pas de Boîte Noire',
              metric: 'Direct JSON-RPC',
              detail: 'Les requêtes partent directement vers les nœuds RPC. Vous pouvez brancher votre propre nœud Geth/Erigon local.',
            },
            {
              title: 'Budget GPU Tenu',
              metric: '60 FPS @ 420+ Arêtes',
              detail: 'Instanciation Three.js, LOD des labels au-dessus de 90 nœuds, zéro re-render React intempestif sur la boucle d’animation.',
            },
            {
              title: 'Déploiement Souverain',
              metric: 'Docker / Static',
              detail: 'Un simple bundle Vite de 1 Mo. Pas de dépendance obscure vers des API fermées qui changent leurs tarifs tous les trimestres.',
            },
          ],
          codeTitle: 'EXTRAIT : GESTION DES LIMITES SANS SIMULATION ARTIFICIELLE',
          codeSnippet: `// Règle d'or : quand l'explorateur on-chain renvoie 0 résultat, on dit la vérité.
const result = await fetchLiveOnChainTransactions(address, chain, 28);
if (!result || result.transactions.length === 0) {
  // Pas d'invention de portefeuilles imaginaires pour meubler le graphe
  return notifyBoundary('[Limite On-Chain Atteinte] Plus aucun flux sortant réel.');
}`,
          ctaLabel: 'Tester avec une vraie adresse en Live RPC',
        },
        {
          id: 'datascientist',
          badge: 'PRISME 02 // LE DATA SCIENTIST QUI VEUT DE LA RIGUEUR',
          roleTitle: 'Data Science & Graphes Complexes',
          quoteHook: '« Marre de me battre avec NetworkX ou des graphes 2D illisibles dès qu’on dépasse 100 sommets. »',
          headline: 'Dimensionalité Contrainte : Pourquoi les Z-Planes Sauvent la Lisibilité',
          summary:
            'Les graphes 3D libres créent un fouillis sans repères. En verrouillant l’axe Y sur des strates immuables (blockchains, sous-réseaux, types d’actifs) et en déroulant le temps sur X/Z, la topologie redevient lisible. Et le format d’ingestion prend n’importe quel graphe pondéré.',
          pillars: [
            {
              title: 'Topologie Déterministe',
              metric: 'Axe Y Sémantique',
              detail: 'L’altitude ne dépend pas d’une simulation physique chaotique : elle porte un sens métier fixe.',
            },
            {
              title: 'Taint Mathématiquement Limpide',
              metric: 'FIFO + Atténuation',
              detail: 'La contamination se propage proportionnellement aux volumes entrants, avec distinction claire des sorties de mixeurs probabilistes.',
            },
            {
              title: 'Mode Hybride Split 50/50',
              metric: 'Graphe 3D ↔ Tableau 2D',
              detail: 'La 3D pour la forme globale du réseau, la table synchronisée pour inspecter les valeurs brutes au wei près.',
            },
          ],
          codeTitle: 'FORMAT D’INGESTION UNIVERSEL (BYO-DATA READY)',
          codeSnippet: `// Vous pouvez brancher vos données de fraude bancaire ou de supply-chain :
interface SpatialDataset {
  nodes: Array<{ id: string; stratum: string; archetype: string; volumeUsd: number }>;
  links: Array<{ source: string; target: string; timestamp: number; usdValue: number }>;
}`,
          ctaLabel: 'Ouvrir l’archive Bybit (420 TXs Full Ledger)',
        },
        {
          id: 'cmo',
          badge: 'PRISME 03 // LE CRÉATIF QUI A HORREUR DU DÉJÀ-VU',
          roleTitle: 'Direction Artistique & Produit',
          quoteHook: '« Une landing page où la démo technique EST le produit, pas une capture d’écran Figma avec du faux texte. »',
          headline: 'Direction Artistique Furtive : Laiton Brossé, Titane et Véritables Données',
          summary:
            'Assez des dégradés violets fluo générés par IA et des mockups statiques. ARGUS démontre que le design de pointe s’appuie sur des matériaux crédibles, une typographie chirurgicale et une mise en scène où l’utilisateur touche immédiatement au vrai moteur.',
          pillars: [
            {
              title: 'Scrollytelling 60 FPS',
              metric: 'Zéro Saccade',
              detail: 'La scène 3D réagit directement au scroll avec inertie physique, sans charger 50 Mo de vidéos lourdes.',
            },
            {
              title: 'Palette Épurée & Réticules',
              metric: 'Defense-Tech Craft',
              detail: 'Noir carbone #09090B, laiton chaud #D4A359 et rouge signal #E04F33. Une esthétique d’instrument de mesure.',
            },
            {
              title: 'Passerelle Immédiate',
              metric: '0 Rechargement',
              detail: 'Un clic sur n’importe quelle carte de l’histoire bascule directement dans le terminal 3D pré-chargé sur l’enquête.',
            },
          ],
          codeTitle: 'PALETTE MATÉRIELLE ARGUS',
          codeSnippet: `/* Charte sans "AI Slop" — Inspirée des cockpits et des optiques de précision */
--obsidian-carbon:   #09090B; /* Chambre noire, absorption de lumière */
--brushed-brass:     #D4A359; /* Réticules télémétriques, anneaux orbitaux */
--tactical-steel:    #7C93A8; /* Axes de coordonnées et grilles */
--signal-vermilion:  #E04F33; /* Alerte critique et nœud exploiteur */`,
          ctaLabel: 'Lancer le Tour Guidé Interactif',
        },
      ],
    },
    finale: {
      kicker: 'ÉPILOGUE // ENTRER DANS L’OPTICON',
      title: 'La démonstration ne fait que commencer. Prenez les commandes.',
      lead: 'Collez n’importe quelle adresse Ethereum réelle (`0x...`) pour générer son voisinage on-chain en direct via RPC, ou ouvrez immédiatement la console spatiale 3D complète.',
      liveInputPlaceholder: 'Coller une adresse Ethereum réelle (ex: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045)...',
      liveInputBtn: 'INVESTIGUER EN LIVE 3D',
      sampleLabel: 'ESSAYER EN 1 CLIC :',
      enterFullConsoleBtn: 'ENTRER DANS LA WORKSTATION ARGUS v5.0',
      footerNote: 'ARGUS PANOPTÈS // SUITE FORENSIQUE SPATIALE MULTI-CHAÎNES · BILINGUE FR/EN · DONNÉES ON-CHAIN VÉRIFIÉES',
    },
  },

  en: {
    topBar: {
      storyBadge: 'MANIFESTO & ARCHITECTURE',
      immersionTime: '~4 MIN IMMERSION',
      launchConsoleCta: 'LAUNCH 3D CONSOLE',
      acts: [
        { id: 'act-prologue', num: '00', short: 'PROLOGUE' },
        { id: 'act-blindness', num: '01', short: '2D BLINDNESS' },
        { id: 'act-genesis', num: '02', short: 'ARGOS GENESIS' },
        { id: 'act-strata', num: '03', short: '3D Z-STRATA' },
        { id: 'act-taint', num: '04', short: 'TAINT & MIXERS' },
        { id: 'act-studio', num: '05', short: 'RICH MEDIA & CASES' },
        { id: 'act-enterprise', num: '06', short: 'EXECUTIVE LENS' },
      ],
    },
    hero: {
      eyebrow: 'ARGUS PANOPTES // UNFILTERED SPATIAL FORENSIC ENGINE',
      mythologyTag: 'ΜΥΘΟΣ : INSPIRED BY ARGOS WITH 100 EYES (BUILT FOR THOSE WHO HAVE 2 AND A JOB TO DO)',
      titleLine1: 'Stop analyzing crypto heists',
      titleLine2: 'on flat spreadsheets.',
      lead: 'When $1.46 billion disappears across 4 blockchains in 18 minutes, staring at 400 lines of hexadecimal addresses at 3 AM is how you miss the exit wallet. ARGUS maps on-chain truth across 3D strata: raw, RPC-verified, zero marketing fluff.',
      primaryCta: 'Launch 3D Workstation',
      secondaryCta: 'Understand the Architecture (3 min)',
      scrollPrompt: 'SCROLL TO ENGAGE THE ENGINE',
      metrics: [
        {
          value: '1,476',
          label: 'REAL SCRAPED TRANSACTIONS',
          sub: 'Zero procedural mocks: real blocks, gas, timestamps & hashes',
        },
        {
          value: '4 Z-PLANES',
          label: 'PHYSICAL STRATIFICATION',
          sub: 'SOL on top, ARB middle, ETH center, BTC deep settlement',
        },
        {
          value: '60 FPS',
          label: 'ON BROWSER GPU',
          sub: 'Even under 420 links and parallel deposit fanning',
        },
        {
          value: '0 INVENTIONS',
          label: 'STRICT PROOF BOUNDARY',
          sub: 'When real on-chain ends, the tool stops. No fake nodes.',
        },
      ],
    },
    act1: {
      kicker: 'ACT I // INVESTIGATOR REALITY CHECK',
      title: 'Why standard 2D block explorers cost you 45 minutes per incident.',
      lead: 'On February 21, 2025, Bybit’s multisig vault loses $1.46 billion. In under 20 minutes, funds fracture into dozens of relay wallets, swap into stETH, and launch across bridges.',
      paragraphs: [
        'Inside a classic explorer, this heist reads like an infinite phonebook of 42-character hex strings. Nobody on earth — not even the sharpest auditor in the room — can mentally reconstruct a 250-node directed graph by scrolling rows of monospace text.',
        'Adversaries like Lazarus do not rely on invisible magic: they bank on your optical fatigue. They create dozens of burner wallets and flood you with 0-ETH dusting transactions to drown the real trail in noise.',
      ],
      calloutTitle: 'FIELD REALITY (NO HAND-WAVING)',
      calloutBody:
        'This is not dark magic: a human operator spots a topological cluster or exit funnel in 1 second, whereas cross-referencing hex hashes across 12 browser tabs takes 40 minutes.',
      sliderTitle: 'TEST IT YOURSELF: RAW ETHERSCAN TABLE VS. ARGUS SPATIAL ENGINE',
      sliderHint: 'Drag central divider left ↔ right',
      leftBadge: '2D EXPLORER PURGATORY // 12 TABS OPEN, BURNING EYES',
      rightBadge: 'ARGUS SPATIAL PROJECTION // SEE WHERE FUNDS ESCAPE INSTANTLY',
    },
    act2: {
      kicker: 'ACT II // SHAPES BEAT TEXT',
      title: 'The myth of Argos Panoptes… and why we replaced hex hashes with 3D polyhedra.',
      mythTitle: 'Where does the name ARGUS come from?',
      mythParagraphs: [
        'In Greek mythology, Argos Panoptes was a giant with a hundred eyes. His superpower: half slept while the other half watched. In blockchain security, that is exactly what you need: continuous macro situational awareness paired with surgical inspection of raw transaction calldata.',
        'Instead of forcing you to read unreadable 0x... hashes, we assigned a distinct geometric solid to each economic role. Your brain identifies a red beacon before reading a license plate: this is the exact same principle.',
      ],
      grammarTitle: 'Six geometric solids. Spot who is who in a single glance.',
      grammarLead: 'No more guessing whether 0x47ac... is the drainer or a Uniswap router. The 3D silhouette gives it away immediately:',
      archetypes: [
        {
          id: 'exploiter',
          code: 'ARCH-01 // THREAT ORIGIN',
          name: 'Exploiter / Drainer Wallet',
          geometry: 'Vermilion Icosahedron + Pulsing Warning Ring',
          colorHex: '#E04F33',
          recognitionMs: '95 ms',
          roleSummary: 'Ground zero of the theft (leaked private key, smart contract exploit, or spoofed Safe signature).',
          forensicSignature: 'Anchored at 100% initial taint. Where the radioactive wave begins.',
          realExample: 'Bybit Exploiter 0x47ac0Fb...d503 (OFAC Sanctioned)',
        },
        {
          id: 'mixer',
          code: 'ARCH-02 // THE WASHING MACHINE',
          name: 'ZK Privacy Mixer (Tornado Cash, Railgun)',
          geometry: 'Black Sphere + Violet Quartz Accretion Disk',
          colorHex: '#9D7CD8',
          recognitionMs: '110 ms',
          roleSummary: 'Zero-knowledge pool severing deterministic links between deposits and withdrawals.',
          forensicSignature: 'Here absolute certainty ends: ARGUS transitions to timing-window and gas-entropy heuristics.',
          realExample: 'Tornado Cash Router 0xd90e2f9...070',
        },
        {
          id: 'bridge',
          code: 'ARCH-03 // THE ESCAPE ROUTE',
          name: 'Cross-Chain Bridge (THORChain, Wormhole)',
          geometry: 'Steel Octahedron + Vertical Laser Beam',
          colorHex: '#7C93A8',
          recognitionMs: '105 ms',
          roleSummary: 'Gateway allowing stolen Ethereum assets to convert into native Bitcoin or Solana.',
          forensicSignature: 'Physically pierces through horizontal planes between Ethereum (Y=0) and Bitcoin (Y=-120).',
          realExample: 'THORChain Router v4 / Mayan Bridge',
        },
        {
          id: 'dex',
          code: 'ARCH-04 // EMERGENCY CONVERSION',
          name: 'DEX Router & AMM Pool (Uniswap, Curve)',
          geometry: 'Cyan Hexagonal Prism',
          colorHex: '#38BDF8',
          recognitionMs: '120 ms',
          roleSummary: 'Where the attacker dumps freezable stablecoins (USDT/USDC) for censorship-resistant ETH or stETH.',
          forensicSignature: 'High intra-block velocity, massive slippage, and MEV arbitrage routing.',
          realExample: 'Uniswap v3 Universal Router / Curve stETH Pool',
        },
        {
          id: 'cex',
          code: 'ARCH-05 // FREEZE HAZARD',
          name: 'Centralized Exchange (Off-Ramp)',
          geometry: 'Brushed Gold Monolithic Cube',
          colorHex: '#D4A359',
          recognitionMs: '90 ms',
          roleSummary: 'The terminal funnel where laundered funds attempt fiat exit — and compliance teams can freeze funds.',
          forensicSignature: 'Re-consolidation of multiple peel branches into identified deposit addresses.',
          realExample: 'FTX / Binance / eXch Deposit Wallets',
        },
        {
          id: 'eoa',
          code: 'ARCH-06 // INTERMEDIARIES',
          name: 'Mule Relay Wallets (EOA)',
          geometry: 'Logarithmically Scaled Metallic Sphere',
          colorHex: '#4E9F76',
          recognitionMs: '115 ms',
          roleSummary: 'Script-generated burner accounts splitting balances into uniform batches before mixing.',
          forensicSignature: 'Lifespan often under 30 minutes, balances split evenly across equal chunks.',
          realExample: 'Lazarus Hop-1 and Hop-2 Relay Wallets',
        },
      ],
    },
    act3: {
      kicker: 'ACT III // Z-STRATUM SPATIAL ARCHITECTURE',
      title: 'Slaying the “3D Hairball”: 4 Blockchains, 4 Geodesic Altitudes.',
      lead: 'Traditional 3D force-directed graphs fail in production because nodes float isotropically into an unreadable cloud. ARGUS solves this using a strict mechanical constraint inspired by air-traffic control.',
      strataExplanation:
        'Every blockchain is locked onto its own horizontal elevation plane (Y-axis), while hop-by-hop laundering progression unfolds cleanly across X/Z coordinates. Whenever an attacker crosses a bridge, a vertical laser beam physically pierces through the planes.',
      strataLayers: [
        {
          chain: 'SOLANA // SOL',
          elevation: 'Y = +240',
          color: '#4E9F76',
          role: 'High-Velocity Stratum — Sub-second swaps & rapid SPL dispersion',
          tpsNote: '400ms Slot Time · Tight dispersion clusters',
        },
        {
          chain: 'ARBITRUM // ARB',
          elevation: 'Y = +120',
          color: '#38BDF8',
          role: 'L2 Rollup Stratum — Low-fee splitting, flash routing & fast bridges',
          tpsNote: '250ms Block Time · L2 relay corridor',
        },
        {
          chain: 'ETHEREUM // ETH',
          elevation: 'Y = 0 (EQUATOR)',
          color: '#D4A359',
          role: 'DeFi Epicenter Stratum — Multisig vaults, Flashloans, Curve, Uniswap & Tornado Cash',
          tpsNote: '12s Slot Time · Primary liquidity gravity well',
        },
        {
          chain: 'BITCOIN // BTC',
          elevation: 'Y = -120',
          color: '#F59E0B',
          role: 'Deep Settlement Stratum — THORChain native exits, UTXO consolidation & cold storage',
          tpsNote: '10m Block Time · Final Lazarus settlement layer',
        },
      ],
      engineeringHighlight: {
        title: 'HIGH-DENSITY GRAPHICS ENGINEERING (FULL LEDGER MODE)',
        points: [
          {
            label: 'Lateral Vector Fanning for Parallel Transactions',
            desc: 'When the Ronin attacker fires 30 consecutive 100 ETH deposits into Tornado Cash, ARGUS computes perpendicular normals and fans out 30 distinct Bezier arcs instead of collapsing them into a single line.',
          },
          {
            label: 'Semantic Label Level-of-Detail (GPU Sprite LOD)',
            desc: 'Above 90 visible nodes, the engine dynamically prioritizes floating labels for critical infrastructure and active targets — sustaining locked 60 FPS.',
          },
          {
            label: 'Event-Rank Normalized Chronological Scrubber',
            desc: 'Multi-month dormancy gaps between an exploit and on-chain bounty negotiations are rank-normalized so frame-by-frame playback never stalls.',
          },
        ],
      },
    },
    act4: {
      kicker: 'ACT IV // TAINT & HUMAN HABITS',
      title: 'Why attackers get caught: human fatigue and conservation of value.',
      lead: 'The ledger never forgets, and criminals are human beings: they get tired, they cut corners, and they inevitably make an operational blunder.',
      paragraphs: [
        'Withdrawing 30 batches of 100 ETH from a ZK mixer in the middle of the night with the exact same gas tip 12 seconds apart is not invisibility: it is an open forensic invitation. ARGUS pairs volume-weighted FIFO taint with heuristic timing correlation.',
        'Crucially, we strip out the noise: by querying signed outflows (`?filter=from`) and whitelisted ERC-20 contracts, we eliminate the thousands of 0-ETH address-poisoning dust transactions sent by bots to clutter your screen.',
      ],
      zeroFakeTitle: 'ETHICAL GUARANTEE: ZERO HALLUCINATED NODES',
      zeroFakeBody:
        'A forensic tool that fabricates imaginary wallets to make a graph look full is dangerous. In ARGUS, every entity is certified `live_onchain`. When a hop expansion reaches the end of real ledger counterparties, the system halts and says `[On-Chain Boundary Reached]`. No decorative bot fillers.',
    },
    act5: {
      kicker: 'ACT V // RICH MEDIA STUDIO & VERIFIED HISTORICAL ARCHIVES',
      title: 'Forensic Cinematheque, High-Res Visuals & Real Heist Archives.',
      lead: 'Watch real-time system reels, launch any of the 5 landmark crypto heists reconstructed from 1,476 verified on-chain transactions, or explore our engineering research notes.',
      studioReadyBadge: 'MEDIA MANIFEST ACTIVE (public/media/ READY FOR YOUR .MP4 & CAPTURES)',
      reelsHeading: '01 // CINEMATIC SYSTEM REELS & LIVE DEMOS',
      archivesHeading: '02 // 5 VERIFIED ON-CHAIN ARCHIVES (1-CLICK WORKSTATION LAUNCH)',
      archivesSub:
        'Every archive ships with dual granularity: Tactical View (~95 highest-signal TXs) and Full Attack Ledger (up to 420 verified multi-hop TXs).',
      openTacticalBtn: 'Tactical 3D',
      openFullLedgerBtn: 'Full Ledger',
      galleryHeading: '03 // ART DIRECTION & OPTICAL BRAND SYSTEM (HD LIGHTBOX)',
      gallerySub: 'Click any plate to inspect in high resolution.',
      editorialHeading: '04 // ENGINEERING CHRONICLES & RESEARCH NOTES',
      editorialSub: 'In-depth technical essays ready to read or share.',
      readArticleBtn: 'Read full briefing',
      reels: [
        {
          id: 'reel-strata',
          code: 'REEL 01 // Z-STRATUM',
          duration: '00:34',
          title: 'Multi-Chain Stratification & 3D Visual Impact',
          subtitle: 'Real-time visualization across SOL (+240), ARB (+120), ETH (0), and BTC (-120)',
          description:
            'Interactive 2D vs 3D slider demo: no more flat Etherscan hash tables. On-chain flows elevate into 3D with spatial separation of networks and entity roles.',
          tags: ['WebGL2 60 FPS', 'Z-Planes', 'Cross-Chain', '3D Slider'],
          simulationMode: 'z_strata_burst',
          linkedCaseId: 'bybit-safe-exploit-2025',
        },
        {
          id: 'reel-bybit',
          code: 'REEL 02 // FULL LEDGER',
          duration: '00:34',
          title: 'Chronological Replay: Bybit Cold Multisig ($1.46B — 420 TXs)',
          subtitle: 'Rapid dispersion of 401,347 ETH across 247 verified entities on Ethereum Mainnet',
          description:
            'Minute-by-minute reconstruction of history’s largest crypto heist: Safe UI spoofing, 420 verified real transactions, and 30 parallel deposits into Tornado Cash.',
          tags: ['420 Real TXs', 'Lazarus Group', 'Bybit 2025', 'Scrubber'],
          simulationMode: 'bybit_420_ledger',
          linkedCaseId: 'bybit-safe-exploit-2025',
        },
        {
          id: 'reel-taint',
          code: 'REEL 03 // TAINT ENGINE',
          duration: '00:31',
          title: 'FIFO Thermal Wave & Post-Mixer Error Detection',
          subtitle: 'From clean tactical blue to critical vermilion: tracing contamination across Tornado Cash',
          description:
            'Ronin Bridge exploit analysis: timing and gas entropy correlation on mixer withdrawals, Taint Heatmap view, and direct +1 Hop live query with strict RPC fallback limits.',
          tags: ['Taint Heatmap', 'Tornado Cash', '+1 Hop Live', 'Zero Fake'],
          simulationMode: 'taint_entropy_wave',
          linkedCaseId: 'ronin-bridge-exploit-2022',
        },
        {
          id: 'reel-hybrid',
          code: 'REEL 04 // HYBRID SPLIT',
          duration: '00:30',
          title: 'Hybrid Split 50/50 Mode & Decoded UTF-8 CallData',
          subtitle: 'Spatial 3D scene on the left, low-level block explorer and hacker negotiation text on the right',
          description:
            'Direct inspection of the Euler Finance heist ($197M): raw hexadecimal payload extraction and plaintext decoding of on-chain hacker negotiation messages on public RPC.',
          tags: ['Split 50/50', 'CallData UTF-8', 'Euler Finance', 'RPC Proof'],
          simulationMode: 'z_strata_burst',
          linkedCaseId: 'euler-flashloan-exploit-2023',
        },
      ],
      archives: [
        {
          caseId: 'binance-multichain-heist-2026',
          year: 'OCT 2026 (LIVE)',
          amount: '$6.4B',
          title: 'Binance Multi-Chain Blitzkrieg',
          attacker: 'Lazarus Group (UNC4899)',
          summary: 'EIP-7702 EOA hijack of Binance 14 without address change. $6.4 Billion drained across 8 blockchains. $2.9B frozen in 54 minutes vs $3.5B actively laundered.',
          tacticalNodes: 18,
          tacticalTxs: 19,
          fullNodes: 18,
          fullTxs: 19,
          chains: ['SOL', 'BASE', 'OP', 'ARB', 'ETH', 'BSC', 'TRX', 'BTC'],
        },
        {
          caseId: 'bybit-safe-exploit-2025',
          year: 'FEB 2025',
          amount: '$1.46B',
          title: 'Bybit Cold Multisig Exploit',
          attacker: 'Lazarus Group (APT38)',
          summary: 'Safe Wallet UI spoofing and record-breaking dispersion of 401,347 ETH across 247 relay wallets and DEX routers.',
          tacticalNodes: 78,
          tacticalTxs: 95,
          fullNodes: 247,
          fullTxs: 420,
          chains: ['ETH', 'BTC', 'ARB', 'SOL'],
        },
        {
          caseId: 'ronin-bridge-exploit-2022',
          year: 'MAR 2022',
          amount: '$624M',
          title: 'Ronin Bridge Validator Compromise',
          attacker: 'Lazarus Group (OFAC Sanctioned)',
          summary: 'Compromise of 5 out of 9 validator keys (173,600 ETH + 25.5M USDC) followed by massive 100 ETH batch cascades into Tornado Cash.',
          tacticalNodes: 44,
          tacticalTxs: 95,
          fullNodes: 84,
          fullTxs: 420,
          chains: ['ETH', 'BTC'],
        },
        {
          caseId: 'euler-flashloan-exploit-2023',
          year: 'MAR 2023',
          amount: '$197M',
          title: 'Euler Finance Flashloan & On-Chain Negotiation',
          attacker: 'Exploiter 0xb66cd... (Partial restitution + UTF-8 calldata)',
          summary: 'Multi-asset flashloan attack followed by famous UTF-8 plaintext messages encoded directly inside Ethereum transaction calldata.',
          tacticalNodes: 35,
          tacticalTxs: 95,
          fullNodes: 68,
          fullTxs: 236,
          chains: ['ETH'],
        },
        {
          caseId: 'ftx-accounts-drainer-2022',
          year: 'NOV 2022',
          amount: '$477M',
          title: 'FTX Bankruptcy Night Accounts Drainer',
          attacker: 'FTX Accounts Drainer (0x59AB...)',
          summary: 'Simultaneous midnight draining of FTX hot wallets hours after Chapter 11 filing and frantic swaps out of freezable USDT.',
          tacticalNodes: 48,
          tacticalTxs: 95,
          fullNodes: 121,
          fullTxs: 221,
          chains: ['ETH', 'ARB', 'BTC'],
        },
        {
          caseId: 'wormhole-bridge-exploit-2022',
          year: 'FEB 2022',
          amount: '$326M',
          title: 'Wormhole Portal Signature Spoof',
          attacker: 'Exploiter 120,000 wETH → DeFi Vaults',
          summary: 'Guardian signature bypass minting 120k wETH, followed by leveraged stETH/wstETH DeFi loops and court-ordered recovery a year later.',
          tacticalNodes: 23,
          tacticalTxs: 95,
          fullNodes: 60,
          fullTxs: 179,
          chains: ['SOL', 'ETH'],
        },
      ],
      gallery: [
        {
          id: 'gal-eye',
          code: 'FIG 01 // PANOPTIC IRIS',
          title: 'The Synaptic Eye of Argus',
          category: 'IDENTITY & METROLOGY',
          caption: 'Forged in brushed warm brass (#D4A359) and obsidian titanium (#09090B). The pupil acts as an optical targeting reticle wired to synaptic nodes.',
          specs: 'HD Octane Render · Obsidian / Brass / Vermilion Palette',
          imageSrc: '/logos/argus_logo_eye_1793256070828.jpg',
        },
        {
          id: 'gal-prism',
          code: 'FIG 02 // HEX BLOCK PRISM',
          title: 'Deconstructed Hexagonal Block Prism',
          category: '3D BLOCK ARCHITECTURE',
          caption: 'Material allegory of a cryptographic block opened across three dimensions, exposing directional vermilion contamination vectors inside.',
          specs: 'CNC Machined Carbon · Volumetric Vermilion Beams',
          imageSrc: '/logos/argus_logo_hex_prism_1793256084835.jpg',
        },
        {
          id: 'gal-nexus',
          code: 'FIG 03 // ORBITAL TELEMETRY',
          title: 'Multi-Stratum Orbital Nexus',
          category: 'HUD RADAR SYSTEM',
          caption: 'Concentric telemetry matrix inspiring ARGUS’s system boot preloader and omnidirectional cross-chain radar.',
          specs: '4 Azimuthal Rings · Central Singularity Reticle',
          imageSrc: '/logos/argus_logo_orbital_nexus_1793256113938.jpg',
        },
        {
          id: 'gal-monogram',
          code: 'FIG 04 // ARCHITECTURAL SEAL',
          title: 'Institutional Tactical Monogram',
          category: 'EXECUTIVE SEAL',
          caption: 'Minimalist architectural emblem crafted for forensic audit PDFs, compliance dossiers, and CISO executive briefings.',
          specs: 'Beveled Titanium · Active Vermilion Optical Bar',
          imageSrc: '/logos/argus_logo_monogram_a_1793256098942.jpg',
        },
      ],
      articles: [
        {
          id: 'art-cognitive-3d',
          code: 'RESEARCH BRIEF #01',
          readTime: '3 MIN READ',
          date: 'OCTOBER 2026',
          category: 'COGNITION & DATAVIZ',
          title: 'Why Constrained 3D Multiplies Anomaly Detection Speed by 20x Over Flat Tables',
          excerpt:
            'Unconstrained force-directed 3D graphs fail in production because users lose spatial orientation. Here is how geodesic Z-Stratum planes solve the equation.',
          keyTakeaways: [
            'The Y-axis is never random: it encodes immutable infrastructure semantics (network layer).',
            'Logarithmic sizing and Platonic solids replace slow sequential string reading.',
            'Lateral Bezier fanning immediately exposes scripted laundering batches (e.g., 30x 100 ETH).',
          ],
          bodyParagraphs: [
            'For fifteen years, graph investigation tools have oscillated between two frustrating extremes: paginated 2D tables (Etherscan or SQL grids) that destroy global context, and unconstrained “hairball” graphs where thousands of nodes bounce with no fixed coordinate frame.',
            'Designing ARGUS, we borrowed directly from military geospatial command systems and air-traffic control: strictly lock one spatial axis (vertical Y altitude) onto an immutable categorical stratum — the underlying blockchain — while dedicating the horizontal X/Z plane to chronological hop progression.',
            'The cognitive payoff is immediate: an analyst opening a 420-transaction archive never has to hunt for cross-chain bridges or laundering bottlenecks. Vertical piercing beams and dark violet singularities expose the laundering architecture at a glance.',
          ],
          linkedCaseId: 'ronin-bridge-exploit-2022',
        },
        {
          id: 'art-zero-hallucination',
          code: 'ENGINEERING NOTE #02',
          readTime: '4 MIN READ',
          date: 'OCTOBER 2026',
          category: 'DATA INTEGRITY',
          title: 'Defeating Address Poisoning & Enforcing Zero Synthetic Fallbacks in Live Forensics',
          excerpt:
            'Famous hacker wallets receive thousands of 0-ETH dust spams and fake tokens. How our hybrid pipeline filters poison without ever inventing fake neighbors.',
          keyTakeaways: [
            'Hybrid query pipeline combining live Ethereum JSON-RPC with filtered Blockscout v2 indexing (`?filter=from`).',
            'Cryptographic symbol allowlisting on ERC-20 transfers to strip phishing airdrop tokens.',
            'Explicit `[On-Chain Boundary Reached]` certification the instant real ledger evidence ends.',
          ],
          bodyParagraphs: [
            'Anyone inspecting the Ronin or Euler exploiter address on a raw explorer today walks into a trap: hundreds of inbound 0-ETH transfers and counterfeit airdrop tokens sent years later by address-poisoning bots hoping to mislead investigators.',
            'Our multi-hop crawler surgically isolates outbound transactions cryptographically signed by the target (`filter=from`), cross-references value-bearing transfers above dust thresholds, and validates legitimate token contracts (USDC, USDT, DAI, WETH, stETH, WBTC).',
            'Above all, we enforce an uncompromising rule: when you paste your own wallet or expand +1 Hop until real counterparties are exhausted, ARGUS never injects decorative heuristic nodes. The HUD certifies the exact boundary of verifiable evidence.',
          ],
          linkedCaseId: 'euler-flashloan-exploit-2023',
        },
        {
          id: 'art-enterprise-beyond-web3',
          code: 'PRODUCT VISION #03',
          readTime: '3 MIN READ',
          date: 'OCTOBER 2026',
          category: 'ENTERPRISE ARCHITECTURE',
          title: 'Beyond Web3: Deploying ARGUS on Banking AML, Cyber SOC & Supply-Chain Graphs',
          excerpt:
            'Suspicious SWIFT wire rings, Active Directory lateral movement, and multi-tier supply-chain cascades share the exact same spatio-temporal graph mathematics.',
          keyTakeaways: [
            'Swap the 4 blockchains for 4 enterprise zones (Public Cloud, DMZ, Core DB, Endpoints) in a Cyber SOC.',
            'Swap Taint Score for AML Risk Score or Supplier Criticality Index.',
            'Universal JSON / Arrow graph schema ready for enterprise data lakes.',
          ],
          bodyParagraphs: [
            'Public blockchains provide the ultimate proving ground because billion-dollar adversarial attacks are auditable by anyone in real time. Yet ARGUS’s spatial engine is fundamentally domain-agnostic.',
            'For a CTO or Chief Data Officer, each horizontal Y-stratum can represent an infrastructure security zone during an intrusion investigation, or four correspondent banking jurisdictions during an anti-money-laundering audit.',
            'By uniting 60 FPS 3D topology, frame-accurate chronological replay, and a synchronized tabular evidence inspector (Hybrid Split Mode) in one zero-install browser workstation, ARGUS bridges executive clarity and deep forensic rigor.',
          ],
          linkedCaseId: 'bybit-safe-exploit-2025',
        },
      ],
    },
    act6: {
      kicker: 'ACT VI // ZERO CORPORATE JARGON',
      title: 'What each discipline actually gets out of ARGUS.',
      lead: 'No miraculous fairy-tales: here is specifically why this architecture resonates with technical operators who are tired of poorly engineered dashboards.',
      personas: [
        {
          id: 'cto',
          badge: 'LENS 01 // THE BATTLE-TESTED CTO',
          roleTitle: 'Engineering & Infrastructure',
          quoteHook: '“Finally a WebGL dashboard that doesn’t spin up my laptop fans to maximum and actually queries real RPC endpoints.”',
          headline: 'Client-Side First, Zero Mandatory Black-Box Server, Rock-Solid 60 FPS',
          summary:
            'You do not need an $80k/year enterprise SaaS contract with opaque servers: ARGUS executes directly in the browser, queries Ethereum RPC and Blockscout v2, disposes BufferGeometries cleanly, and can be containerized into an air-gapped sovereign VPC in 10 minutes.',
          pillars: [
            {
              title: 'No Black Box',
              metric: 'Direct JSON-RPC',
              detail: 'Calls route straight to public or private nodes. Point it at your own local Erigon/Geth archive node whenever you want.',
            },
            {
              title: 'Strict GPU Budget',
              metric: '60 FPS @ 420+ Edges',
              detail: 'Instanced Three.js geometries, label LOD capping above 90 nodes, zero React re-render thrashing inside the render loop.',
            },
            {
              title: 'Sovereign Deployment',
              metric: 'Docker / Static',
              detail: 'A single 1MB Vite bundle. No brittle dependencies on closed analytics APIs that hike prices every quarter.',
            },
          ],
          codeTitle: 'EXCERPT: STRICT BOUNDARY ENFORCEMENT WITHOUT FAKE NODES',
          codeSnippet: `// Golden rule: when the on-chain explorer returns 0 transactions, report the truth.
const result = await fetchLiveOnChainTransactions(address, chain, 28);
if (!result || result.transactions.length === 0) {
  // Never fabricate imaginary neighbor wallets to make the graph look busy
  return notifyBoundary('[On-Chain Boundary Reached] Zero additional real outflows.');
}`,
          ctaLabel: 'Test any live wallet via direct RPC',
        },
        {
          id: 'datascientist',
          badge: 'LENS 02 // THE DATA SCIENTIST WHO DEMANDS RIGOR',
          roleTitle: 'Data Science & Complex Graphs',
          quoteHook: '“Tired of fighting with static Matplotlib plots or unreadable 2D hairballs whenever a graph exceeds 100 vertices.”',
          headline: 'Constrained Dimensionality: Why Z-Planes Rescue Topological Sanity',
          summary:
            'Unconstrained 3D graphs create nauseating, orientation-free clouds. By locking the Y-axis onto immutable semantic strata (blockchains, subnets, asset types) and unrolling time along X/Z, structure reappears. And the schema ingests any weighted directed graph.',
          pillars: [
            {
              title: 'Deterministic Topology',
              metric: 'Semantic Y-Axis',
              detail: 'Altitude does not float from random physics: it carries fixed domain semantics.',
            },
            {
              title: 'Mathematically Explicit Taint',
              metric: 'FIFO + Attenuation',
              detail: 'Contamination propagates proportional to volume, with transparent dashed lines for probabilistic mixer exits.',
            },
            {
              title: '50/50 Hybrid Split Mode',
              metric: '3D Graph ↔ 2D Table',
              detail: '3D for macro topology, synchronized table to inspect raw signatures and exact wei values.',
            },
          ],
          codeTitle: 'UNIVERSAL INGESTION SCHEMA (BYO-DATA READY)',
          codeSnippet: `// Ingest bank fraud, cyber-intrusion, or supply-chain graphs effortlessly:
interface SpatialDataset {
  nodes: Array<{ id: string; stratum: string; archetype: string; volumeUsd: number }>;
  links: Array<{ source: string; target: string; timestamp: number; usdValue: number }>;
}`,
          ctaLabel: 'Open Bybit Archive (420 TXs Full Ledger)',
        },
        {
          id: 'cmo',
          badge: 'LENS 03 // THE CREATIVE WHO HATES CLICHÉS',
          roleTitle: 'Art Direction & Product Experience',
          quoteHook: '“A showcase where the technical engine IS the demo, rather than a polished Figma mockup with placeholder copy.”',
          headline: 'Stealth Defense-Tech Aesthetic: Brushed Brass, Titanium & Real Data',
          summary:
            'Enough with neon-purple AI gradients and fake marketing claims. ARGUS proves that cutting-edge design relies on credible physical materials, surgical typography, and an interactive stage where users touch real blockchain evidence within seconds.',
          pillars: [
            {
              title: 'True 60 FPS Scrollytelling',
              metric: 'Zero Video Lag',
              detail: 'The 3D stage reacts directly to scroll position with damped inertia without loading 50MB of heavy video buffers.',
            },
            {
              title: 'Tactical Material Palette',
              metric: 'Defense-Tech Craft',
              detail: 'Obsidian carbon #09090B, brushed brass #D4A359, and vermilion #E04F33. The aesthetic of a calibration instrument.',
            },
            {
              title: 'Instant Workstation Handoff',
              metric: 'Zero Page Reload',
              detail: 'Clicking any story card jumps straight into the full 3D terminal pre-loaded onto that exact investigation.',
            },
          ],
          codeTitle: 'ARGUS MATERIAL PALETTE TOKENS',
          codeSnippet: `/* Zero "AI Slop" — Inspired by avionics and optical calibration benches */
--obsidian-carbon:   #09090B; /* Light-absorbing matte command chamber */
--brushed-brass:     #D4A359; /* Telemetry reticles, orbital rings */
--tactical-steel:    #7C93A8; /* Coordinate axes and stratum grids */
--signal-vermilion:  #E04F33; /* High-alert nodes and threat origins */`,
          ctaLabel: 'Launch Interactive Guided Tour',
        },
      ],
    },
    finale: {
      kicker: 'EPILOGUE // STEP INSIDE THE OPTICON',
      title: 'The story was only the calibration. Take command.',
      lead: 'Paste any real Ethereum address (`0x...`) to map its live on-chain neighborhood via RPC, or step straight into the full 3D forensic workstation.',
      liveInputPlaceholder: 'Paste any real Ethereum address (e.g. 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045)...',
      liveInputBtn: 'INVESTIGATE LIVE IN 3D',
      sampleLabel: '1-CLICK LIVE TARGETS:',
      enterFullConsoleBtn: 'ENTER ARGUS v5.0 3D WORKSTATION',
      footerNote: 'ARGUS PANOPTES // 3D MULTI-CHAIN SPATIAL FORENSICS · BILINGUAL FR/EN · 100% VERIFIED ON-CHAIN ARCHIVES',
    },
  },
};

