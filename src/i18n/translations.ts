export type Language = 'fr' | 'en';

export interface TourStepTranslation {
  title: string;
  subtitle: string;
  description: string;
  actionLabel: string;
}

export interface CaseDocTranslation {
  title: string;
  subtitle: string;
  date: string;
  amount: string;
  attacker: string;
  vuln: string;
  methodology: string[];
  chronologySummary: string;
}

export interface Translations {
  common: {
    close: string;
    cancel: string;
    search: string;
    copy: string;
    copied: string;
    reset: string;
    loading: string;
    active: string;
    inactive: string;
    risk: string;
    clean: string;
    taint: string;
    expand: string;
    collapse: string;
    isolate: string;
    showAll: string;
    flagSuspect: string;
    unflagSuspect: string;
    viewInExplorer: string;
    viewIn3D: string;
    openEtherscan: string;
  };
  preloader: {
    subtitle: string;
    tag: string;
    stages: string[];
    skip: string;
    legal: string;
  };
  nav: {
    brandSubtitle: string;
    blankWorkspaceOption: string;
    newGraphBtn: string;
    searchPlaceholder: string;
    searchBtn: string;
    liveLookupNotice: string;
    kpiTotalVolume: string;
    kpiTaintedVolume: string;
    kpiActiveMixers: string;
    kpiCrossChainHops: string;
    view3D: string;
    viewSplit: string;
    viewExplorer: string;
    docsBtn: string;
    tourBtn: string;
    langBtn: string;
    tacticalMode: string;
    fullLedgerMode: string;
    tacticalTooltip: string;
    fullLedgerTooltip: string;
    verifiedArchiveBadge: string;
    storyBtn: string;
    storyTooltip: string;
  };
  filterPanel: {
    title: string;
    resetAll: string;
    blockchainStrata: string;
    entityTypes: string;
    entityExploiter: string;
    entityMixer: string;
    entityBridge: string;
    entityDex: string;
    entityCex: string;
    entityEoa: string;
    taintEngine: string;
    taintHeatmapToggle: string;
    minTaintThreshold: string;
    minVolumeUsd: string;
    visualOptions: string;
    probabilisticLinks: string;
    showStrataPlanes: string;
    showNodeLabels: string;
  };
  inspector: {
    title: string;
    noSelection: string;
    noSelectionDesc: string;
    entityBadge: string;
    chain: string;
    firstSeen: string;
    taintScore: string;
    taintRiskCritical: string;
    taintRiskHigh: string;
    taintRiskMedium: string;
    taintRiskLow: string;
    isolatedSubGraph: string;
    expandHops: string;
    collapseHops: string;
    isolateNode: string;
    showFullGraph: string;
    holdings: string;
    recentTransactions: string;
    txTypeIn: string;
    txTypeOut: string;
    txValue: string;
    txTime: string;
    txHash: string;
  };
  timeline: {
    title: string;
    replay: string;
    pause: string;
    prevStep: string;
    nextStep: string;
    speed: string;
    resetFull: string;
    currentStepLabel: string;
    phaseLabel: string;
    timestampLabel: string;
    noSteps: string;
  };
  explorer: {
    title: string;
    subtitle: string;
    tabTx: string;
    tabAccounts: string;
    tabBlocks: string;
    tabCrossChain: string;
    tabReceipts: string;
    tabCalldata: string;
    searchPlaceholder: string;
    totalRecords: string;
    colTxHash: string;
    colFrom: string;
    colTo: string;
    colAmount: string;
    colAsset: string;
    colChain: string;
    colTime: string;
    colTaint: string;
    colAction: string;
    colAddress: string;
    colLabel: string;
    colEntityType: string;
    colBalance: string;
    colTaintScore: string;
    colBlockNum: string;
    colTxCount: string;
    colVolume: string;
    inspectReceipt: string;
    inspectCalldata: string;
    receiptTitle: string;
    statusSuccess: string;
    gasUsed: string;
    effectiveGasPrice: string;
    logsBloom: string;
    stateDiffTitle: string;
    methodSignature: string;
    decodedParams: string;
    rawHex: string;
  };
  blankWorkspace: {
    badge: string;
    title: string;
    description: string;
    inputPlaceholder: string;
    buildBtn: string;
    quickStartTitle: string;
    btnVitalik: string;
    btnBinance: string;
    btnBtcWhale: string;
  };
  tour: {
    interactiveBadge: string;
    testBtnPrefix: string;
    prevBtn: string;
    nextBtn: string;
    finishBtn: string;
    steps: TourStepTranslation[];
  };
  docs: {
    modalTitle: string;
    modalSubtitle: string;
    launchTourBtn: string;
    tabQuickstart: string;
    tabGrammar: string;
    tabForensic: string;
    tabExplorer: string;
    tabCases: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  fr: {
    common: {
      close: 'Fermer',
      cancel: 'Annuler',
      search: 'Rechercher',
      copy: 'Copier',
      copied: 'Copié !',
      reset: 'Réinitialiser',
      loading: 'Chargement...',
      active: 'ACTIF',
      inactive: 'INACTIF',
      risk: 'RISQUE',
      clean: 'SAIN',
      taint: 'CONTAMINATION',
      expand: 'Étendre (+1 Hop)',
      collapse: 'Réduire (+1 Hop)',
      isolate: 'Isoler ce Sous-Graphe',
      showAll: 'Afficher Tout le Graphe',
      flagSuspect: 'Signaler Suspect',
      unflagSuspect: 'Retirer Signalement',
      viewInExplorer: 'Voir dans l’Explorateur',
      viewIn3D: 'Voir dans l’Espace 3D',
      openEtherscan: 'Ouvrir sur Etherscan',
    },
    preloader: {
      subtitle: 'FORENSIQUE CRIMINELLE SPATIALE MULTI-CHAÎNES 3D',
      tag: 'v5.0 DEFENSE-TECH',
      stages: [
        'CALIBRATION DU MOTEUR SPATIAL // SHADERS WEBGL',
        'STRATIFICATION DES PLANS MULTI-CHAÎNES // SOL • ARB • ETH • BTC',
        'ANALYSE DES VECTEURS DE TAINT & MIXERS ZK',
        'INDEXATION DES ARCHIVES D’EXPLOITS VÉRIFIÉS',
        'ARGUS FORENSIC SUITE // SYSTÈME ARMÉ & PRÊT',
      ],
      skip: '[ IGNORER // ENTRER DIRECTEMENT ]',
      legal: 'INTERFACE FORENSIQUE RESTREINTE // TÉLÉMÉTRIE SPATIALE MULTI-CHAÎNES',
    },
    nav: {
      brandSubtitle: 'Traqueur Spatial 3D de Cybercriminalité Multi-Chaînes & Explorateur de Blocs',
      blankWorkspaceOption: '★ Espace Vierge // Graphe Personnalisé (Wallet / Tx)',
      newGraphBtn: 'Nouveau Graphe',
      searchPlaceholder: 'Rechercher Wallet (0x..., bc1q..., SOL), TxHash, Bloc ou Domaine ENS...',
      searchBtn: 'LIVE RPC',
      liveLookupNotice: 'Recherche RPC en direct sur Ethereum Mainnet...',
      kpiTotalVolume: 'Volume Traqué',
      kpiTaintedVolume: 'Volume Contaminé',
      kpiActiveMixers: 'Mixers ZK Actifs',
      kpiCrossChainHops: 'Sauts Cross-Chain',
      view3D: '3D Spatial',
      viewSplit: 'Hybride Split',
      viewExplorer: 'Explorateur',
      docsBtn: 'Documentation',
      tourBtn: 'Tutoriel Guidé (6 Étapes)',
      langBtn: 'Langue',
      tacticalMode: 'Synthèse',
      fullLedgerMode: 'Full Ledger',
      tacticalTooltip: 'Vue Tactique On-Chain : Top ~95 transactions réelles critiques du hack (lisibilité maximale)',
      fullLedgerTooltip: 'Archive Exhaustive On-Chain : Registre complet multi-hops (180 à 420+ transactions réelles vérifiées)',
      verifiedArchiveBadge: '100% ON-CHAIN RÉEL',
      storyBtn: 'Genèse & Manifeste',
      storyTooltip: 'Retourner à la page Scrollytelling ARGUS (Genèse, Architecture & Rich Media)',
    },
    filterPanel: {
      title: 'Filtres Forensiques',
      resetAll: 'Réinitialiser',
      blockchainStrata: 'Strates Blockchains (Z-Planes)',
      entityTypes: 'Types d’Entités (Géométrie 3D)',
      entityExploiter: 'Hacker / Drainer (OFAC)',
      entityMixer: 'Mixers ZK (Tornado, Railgun)',
      entityBridge: 'Ponts Cross-Chain (Bridges)',
      entityDex: 'Pools DEX (Uniswap, Curve)',
      entityCex: 'CEX Off-Ramps (Binance, Kraken)',
      entityEoa: 'Portefeuilles EOA Standard',
      taintEngine: 'Moteur de Contamination (Taint)',
      taintHeatmapToggle: 'Heatmap Taint Mode (0 - 100%)',
      minTaintThreshold: 'Seuil Minimum de Taint',
      minVolumeUsd: 'Valeur Min par Transaction (USD)',
      visualOptions: 'Options Visuelles & Holographie',
      probabilisticLinks: 'Liens Probabilistes (Post-Mixer)',
      showStrataPlanes: 'Afficher les Grilles de Strates',
      showNodeLabels: 'Libellés Flottants des Nœuds 3D',
    },
    inspector: {
      title: 'Inspecteur Forensique',
      noSelection: 'Aucun Nœud Sélectionné',
      noSelectionDesc: 'Cliquez sur n’importe quel nœud ou lien dans la scène 3D ou dans l’explorateur pour inspecter ses flux.',
      entityBadge: 'Entité',
      chain: 'Blockchain',
      firstSeen: 'Première Détection',
      taintScore: 'Indice de Contamination (Taint)',
      taintRiskCritical: 'CRITIQUE // ATTRIBUTION PIRATE',
      taintRiskHigh: 'ÉLEVÉ // FONDS MIXÉS / SUSPECTS',
      taintRiskMedium: 'MODÉRÉ // HOPS SECONDAIRES',
      taintRiskLow: 'FAIBLE // ACTIVITÉ NORMALE',
      isolatedSubGraph: 'SOUS-GRAPHE ISOLÉ',
      expandHops: 'Étendre (+1 Hop)',
      collapseHops: 'Réduire (+1 Hop)',
      isolateNode: 'Isoler ce Sous-Graphe',
      showFullGraph: 'Afficher Tout le Graphe',
      holdings: 'Actifs Détectés dans ce Wallet',
      recentTransactions: 'Transactions Récentes Associées',
      txTypeIn: 'ENTRANT',
      txTypeOut: 'SORTANT',
      txValue: 'Valeur',
      txTime: 'Date',
      txHash: 'TxHash',
    },
    timeline: {
      title: 'Chronologie de l’Exploit & Blanchiment',
      replay: 'REJOUER LE HACK',
      pause: 'PAUSE',
      prevStep: 'Étape Préc.',
      nextStep: 'Étape Suiv.',
      speed: 'Vitesse',
      resetFull: 'Vue Complète (Reset)',
      currentStepLabel: 'Étape Actuelle',
      phaseLabel: 'Phase Tactique',
      timestampLabel: 'Horodatage On-Chain',
      noSteps: 'Aucune étape chronologique pour ce graphe.',
    },
    explorer: {
      title: 'Explorateur de Blocs ARGUS',
      subtitle: 'Tableaux institutionnels, décodage de reçus et extraction de CallData brute',
      tabTx: 'Transactions',
      tabAccounts: 'Comptes & Wallets',
      tabBlocks: 'Blocs & Strates',
      tabCrossChain: 'Bridges & Mixers',
      tabReceipts: 'Reçus & Gaz (Receipts)',
      tabCalldata: 'CallData & State Diff',
      searchPlaceholder: 'Filtrer les lignes par adresse, txHash ou label...',
      totalRecords: 'enregistrements',
      colTxHash: 'Hash de Transaction',
      colFrom: 'Expéditeur (From)',
      colTo: 'Destinataire (To)',
      colAmount: 'Montant',
      colAsset: 'Actif',
      colChain: 'Chaîne',
      colTime: 'Date (UTC)',
      colTaint: 'Taint',
      colAction: 'Action',
      colAddress: 'Adresse Wallet / Contrat',
      colLabel: 'Libellé & Attribution',
      colEntityType: 'Type d’Entité',
      colBalance: 'Solde Estimé',
      colTaintScore: 'Score de Taint',
      colBlockNum: 'Numéro de Bloc',
      colTxCount: 'Nombre de Txs',
      colVolume: 'Volume du Bloc',
      inspectReceipt: 'Inspecter Reçu',
      inspectCalldata: 'Décoder CallData',
      receiptTitle: 'Reçu d’Exécution EVM // Transaction Receipt',
      statusSuccess: 'SUCCÈS (Status 0x1)',
      gasUsed: 'Gaz Utilisé',
      effectiveGasPrice: 'Prix Effectif du Gaz',
      logsBloom: 'Filtre Logs Bloom',
      stateDiffTitle: 'Décodage CallData & State Diff EVM',
      methodSignature: 'Signature de Méthode',
      decodedParams: 'Paramètres Décodés (ABI)',
      rawHex: 'Données Hex Brutes (Input Data)',
    },
    blankWorkspace: {
      badge: 'ESPACE VIERGE // ACTIF',
      title: 'Espace d’Investigation Vierge // Graphe Personnalisé',
      description: 'Tous les cas historiques sont désélectionnés. Saisissez un Wallet, un TxHash ou un ENS pour construire un graphe propre et isolé.',
      inputPlaceholder: '0x... / bc1q... / SOL / vitalik.eth / TxHash',
      buildBtn: 'CONSTRUIRE LE GRAPHE',
      quickStartTitle: 'Démarrage Rapide (Adresses Live Vérifiées en 1 Clic) :',
      btnVitalik: 'vitalik.eth (0xd8dA...6045)',
      btnBinance: 'Binance Hot Wallet 14 (0x28C6...1d60)',
      btnBtcWhale: 'Baleine Bitcoin (bc1qxy2k...)',
    },
    tour: {
      interactiveBadge: 'TUTORIEL INTERACTIF GUIDÉ',
      testBtnPrefix: 'Tester maintenant :',
      prevBtn: 'Précédent',
      nextBtn: 'Suivant',
      finishBtn: 'Terminer le Tutoriel',
      steps: [
        {
          title: 'Étape 1/6 — Stratification Spatiale 3D Multi-Chaînes (Z-Planes)',
          subtitle: 'Solana (Y=+240) • Arbitrum (Y=+120) • Ethereum (Y=0) • Bitcoin (Y=-120)',
          description:
            'Chaque blockchain possède son propre plan holographique vertical. Les fonds qui traversent un pont Cross-Chain (Wormhole, Stargate, THORChain) forment des faisceaux lumineux verticaux reliant une strate à une autre. Utilisez le clic gauche pour orbiter en 3D, la molette pour zoomer et le clic droit pour déplacer la caméra.',
          actionLabel: 'Centrer la Caméra 3D & Activer les Plans',
        },
        {
          title: 'Étape 2/6 — Grammaire Géométrique & Focus sur le Drainer Principal',
          subtitle: 'Identification visuelle instantanée du rôle de chaque entité',
          description:
            'Dans ARGUS, la géométrie 3D révèle immédiatement la nature de l’adresse : Icosaèdre Cramoisi Pulsant = Hacker / Exploiter (OFAC), Sphère Noire + Anneau Violet = Mixer ZK (Tornado Cash), Cylindre Vertical = Bridge Cross-Chain, Octaèdre Cyan = Pool DEX, Cube Doré = CEX Off-Ramp.',
          actionLabel: 'Voler vers le Hacker Lazarus (0x098B...)',
        },
        {
          title: 'Étape 3/6 — Moteur de Propagation du Taint (Heatmap Crime Mode)',
          subtitle: 'Calcul algorithmique de la contamination des fonds (0% à 100%)',
          description:
            'Activez le mode « Heatmap Taint » pour recolorer l’intégralité du graphe 3D selon le degré de contamination criminelle : Acier Froid (0% sain) → Cyan → Laiton Ochre → Rouge Vermillon Néon (100% fonds volés). Les liens pointillés montrent les corrélations probabilistes après passage dans un Mixer.',
          actionLabel: 'Activer le Mode Heatmap Taint (0-100%)',
        },
        {
          title: 'Étape 4/6 — Expansion Dynamique (+1 Hop) & Isolation de Sous-Graphe',
          subtitle: 'Investigation interactive depuis le panneau inspecteur de droite',
          description:
            'En cliquant sur n’importe quel nœud 3D, le panneau de droite affiche sa jauge de risque, son portefeuille de tokens et ses transactions. Vous pouvez cliquer sur « Expand (+1 Hop) » pour injecter dynamiquement ses voisins dans la scène 3D, ou « Isoler ce Sous-Graphe » pour focaliser l’analyse.',
          actionLabel: 'Étendre (+1 Hop) autour du Nœud Sélectionné',
        },
        {
          title: 'Étape 5/6 — Time-Lapse Scrubber (Rejouer le Hack Chronologiquement)',
          subtitle: 'Barre temporelle interactive en bas de votre écran',
          description:
            'Chaque transaction possède un horodatage précis. Cliquez sur « REJOUER LE HACK » (ou déplacez le curseur temporel en bas) pour voir l’attaque se propager étape par étape : compromission initiale → peel chains → swaps DEX → bridges → mixers → CEX.',
          actionLabel: 'Lancer le Replay Chronologique (Vitesse 2x)',
        },
        {
          title: 'Étape 6/6 — Mode Hybride Split & Block Explorer Classique',
          subtitle: 'Vérifier un Wallet, un TxHash, un Bloc ou une adresse Live RPC',
          description:
            'Basculez entre « 3D Spatial », « Hybride Split » et « Explorateur » en haut à droite. Vous disposez d’un explorateur de blocs complet (tableaux filtrables de Transactions, Wallets, Blocs, CallData décodée) ainsi que de la barre de recherche universelle connectée aux RPC Ethereum Mainnet.',
          actionLabel: 'Ouvrir la Vue Hybride (3D + Block Explorer)',
        },
      ],
    },
    docs: {
      modalTitle: 'ARGUS // Documentation & Guide d’Investigation Complet',
      modalSubtitle: 'Architecture 3D Multi-Chain, Grammaire Visuelle, Propagation du Taint & Block Explorer Classique',
      launchTourBtn: 'Lancer le Tutoriel Interactif (6 Étapes)',
      tabQuickstart: '1. Démarrage Rapide',
      tabGrammar: '2. Grammaire Spatiale 3D',
      tabForensic: '3. Moteur Forensique & Taint',
      tabExplorer: '4. Block Explorer Classique',
      tabCases: '5. Cas Historiques Réels (5 Hacks)',
    },
  },

  en: {
    common: {
      close: 'Close',
      cancel: 'Cancel',
      search: 'Search',
      copy: 'Copy',
      copied: 'Copied!',
      reset: 'Reset',
      loading: 'Loading...',
      active: 'ACTIVE',
      inactive: 'INACTIVE',
      risk: 'RISK',
      clean: 'CLEAN',
      taint: 'TAINT',
      expand: 'Expand (+1 Hop)',
      collapse: 'Collapse (+1 Hop)',
      isolate: 'Isolate Sub-Graph',
      showAll: 'Show Full Graph',
      flagSuspect: 'Flag as Suspect',
      unflagSuspect: 'Remove Flag',
      viewInExplorer: 'View in Block Explorer',
      viewIn3D: 'View in 3D Space',
      openEtherscan: 'Open on Etherscan',
    },
    preloader: {
      subtitle: '3D MULTI-CHAIN SPATIAL CRIME FORENSICS',
      tag: 'v5.0 DEFENSE-TECH',
      stages: [
        'CALIBRATING SPATIAL ENGINE // WEBGL SHADERS',
        'STRATIFYING MULTI-CHAIN PLANES // SOL • ARB • ETH • BTC',
        'PARSING TAINT PROPAGATION VECTORS & ZK MIXERS',
        'INDEXING VERIFIED ON-CHAIN EXPLOIT ARCHIVES',
        'ARGUS FORENSIC SUITE // SYSTEM ARMED & READY',
      ],
      skip: '[ SKIP // ENTER DIRECTLY ]',
      legal: 'RESTRICTED FORENSIC INTERFACE // MULTI-CHAIN SPATIAL TELEMETRY',
    },
    nav: {
      brandSubtitle: '3D Multi-Chain Spatial Crime Tracker & Block Explorer',
      blankWorkspaceOption: '★ Blank Workspace // Custom Wallet / Tx Graph',
      newGraphBtn: 'New Graph',
      searchPlaceholder: 'Search Wallet (0x..., bc1q..., SOL), TxHash, Block or ENS Domain...',
      searchBtn: 'LIVE RPC',
      liveLookupNotice: 'Live RPC query to Ethereum Mainnet...',
      kpiTotalVolume: 'Tracked Volume',
      kpiTaintedVolume: 'Tainted Volume',
      kpiActiveMixers: 'Active ZK Mixers',
      kpiCrossChainHops: 'Cross-Chain Hops',
      view3D: '3D Space',
      viewSplit: 'Hybrid Split',
      viewExplorer: 'Explorer',
      docsBtn: 'Documentation',
      tourBtn: 'Guided Tour (6 Steps)',
      langBtn: 'Language',
      tacticalMode: 'Tactical',
      fullLedgerMode: 'Full Ledger',
      tacticalTooltip: 'Tactical On-Chain View: Top ~95 high-signal verified attack transactions (optimal 3D clarity)',
      fullLedgerTooltip: 'Exhaustive On-Chain Archive: Full multi-hop hack ledger (180 to 420+ verified transactions)',
      verifiedArchiveBadge: '100% LIVE ON-CHAIN',
      storyBtn: 'Genesis & Story',
      storyTooltip: 'Return to the ARGUS Scrollytelling Showcase (Genesis, Architecture & Rich Media)',
    },
    filterPanel: {
      title: 'Forensic Filters',
      resetAll: 'Reset All',
      blockchainStrata: 'Blockchain Strata (Z-Planes)',
      entityTypes: 'Entity Types (3D Geometry)',
      entityExploiter: 'Hacker / Drainer (OFAC)',
      entityMixer: 'ZK Mixers (Tornado, Railgun)',
      entityBridge: 'Cross-Chain Bridges',
      entityDex: 'DEX Pools (Uniswap, Curve)',
      entityCex: 'CEX Off-Ramps (Binance, Kraken)',
      entityEoa: 'Standard EOA Wallets',
      taintEngine: 'Contamination Engine (Taint)',
      taintHeatmapToggle: 'Taint Heatmap Mode (0 - 100%)',
      minTaintThreshold: 'Minimum Taint Threshold',
      minVolumeUsd: 'Min Transaction Value (USD)',
      visualOptions: 'Visual Options & Holography',
      probabilisticLinks: 'Probabilistic Links (Post-Mixer)',
      showStrataPlanes: 'Show Strata Grid Planes',
      showNodeLabels: 'Floating 3D Node Labels',
    },
    inspector: {
      title: 'Forensic Inspector',
      noSelection: 'No Node Selected',
      noSelectionDesc: 'Click on any node or link in the 3D scene or block explorer to inspect transaction flows.',
      entityBadge: 'Entity',
      chain: 'Blockchain',
      firstSeen: 'First Detected',
      taintScore: 'Taint Contamination Score',
      taintRiskCritical: 'CRITICAL // ATTRIBUTED HACKER',
      taintRiskHigh: 'HIGH // TAINTED / MIXED FUNDS',
      taintRiskMedium: 'MODERATE // SECONDARY HOPS',
      taintRiskLow: 'LOW // REGULAR ACTIVITY',
      isolatedSubGraph: 'ISOLATED SUB-GRAPH',
      expandHops: 'Expand (+1 Hop)',
      collapseHops: 'Collapse (+1 Hop)',
      isolateNode: 'Isolate Sub-Graph',
      showFullGraph: 'Show Full Graph',
      holdings: 'Detected Wallet Holdings',
      recentTransactions: 'Recent Associated Transactions',
      txTypeIn: 'INFLOW',
      txTypeOut: 'OUTFLOW',
      txValue: 'Value',
      txTime: 'Date',
      txHash: 'TxHash',
    },
    timeline: {
      title: 'Exploit Timeline & Laundering Playback',
      replay: 'REPLAY EXPLOIT',
      pause: 'PAUSE',
      prevStep: 'Prev Step',
      nextStep: 'Next Step',
      speed: 'Speed',
      resetFull: 'Full View (Reset)',
      currentStepLabel: 'Current Step',
      phaseLabel: 'Tactical Phase',
      timestampLabel: 'On-Chain Timestamp',
      noSteps: 'No timeline steps recorded for this graph.',
    },
    explorer: {
      title: 'ARGUS Classic Block Explorer',
      subtitle: 'Institutional data tables, execution receipt decoding and raw CallData extraction',
      tabTx: 'Transactions',
      tabAccounts: 'Accounts & Wallets',
      tabBlocks: 'Blocks & Strata',
      tabCrossChain: 'Bridges & Mixers',
      tabReceipts: 'Receipts & Gas Inspector',
      tabCalldata: 'CallData & State Diff',
      searchPlaceholder: 'Filter rows by address, txHash or label...',
      totalRecords: 'records',
      colTxHash: 'Transaction Hash',
      colFrom: 'From Address',
      colTo: 'To Address',
      colAmount: 'Amount',
      colAsset: 'Asset',
      colChain: 'Chain',
      colTime: 'Time (UTC)',
      colTaint: 'Taint',
      colAction: 'Action',
      colAddress: 'Wallet / Contract Address',
      colLabel: 'Label & Attribution',
      colEntityType: 'Entity Type',
      colBalance: 'Estimated Balance',
      colTaintScore: 'Taint Score',
      colBlockNum: 'Block Number',
      colTxCount: 'Tx Count',
      colVolume: 'Block Volume',
      inspectReceipt: 'Inspect Receipt',
      inspectCalldata: 'Decode CallData',
      receiptTitle: 'EVM Execution Receipt // Transaction Receipt',
      statusSuccess: 'SUCCESS (Status 0x1)',
      gasUsed: 'Gas Used',
      effectiveGasPrice: 'Effective Gas Price',
      logsBloom: 'Logs Bloom Filter',
      stateDiffTitle: 'CallData Decoding & EVM State Diff',
      methodSignature: 'Method Signature',
      decodedParams: 'Decoded Parameters (ABI)',
      rawHex: 'Raw Hex Data (Input Data)',
    },
    blankWorkspace: {
      badge: 'BLANK WORKSPACE // ACTIVE',
      title: 'Blank Investigation Workspace // Build Clean Graph',
      description: 'All historical cases are deselected. Enter any Wallet, TxHash or ENS domain to construct an isolated live spatial trace.',
      inputPlaceholder: '0x... / bc1q... / SOL / vitalik.eth / TxHash',
      buildBtn: 'BUILD GRAPH',
      quickStartTitle: 'Quick-Start (1-Click Verified Live Addresses):',
      btnVitalik: 'vitalik.eth (0xd8dA...6045)',
      btnBinance: 'Binance Hot Wallet 14 (0x28C6...1d60)',
      btnBtcWhale: 'Bitcoin Whale (bc1qxy2k...)',
    },
    tour: {
      interactiveBadge: 'INTERACTIVE GUIDED TOUR',
      testBtnPrefix: 'Test now:',
      prevBtn: 'Previous',
      nextBtn: 'Next',
      finishBtn: 'Complete Tour',
      steps: [
        {
          title: 'Step 1/6 — 3D Multi-Chain Spatial Stratification (Z-Planes)',
          subtitle: 'Solana (Y=+240) • Arbitrum (Y=+120) • Ethereum (Y=0) • Bitcoin (Y=-120)',
          description:
            'Each blockchain has its own vertical holographic plane. Funds crossing cross-chain bridges (Wormhole, Stargate, THORChain) produce vertical light beams connecting strata. Use left-click to orbit in 3D, scroll wheel to zoom, and right-click to pan.',
          actionLabel: 'Center 3D Camera & Enable Planes',
        },
        {
          title: 'Step 2/6 — Geometric Grammar & Primary Drainer Focus',
          subtitle: 'Instant visual identification of each entity role',
          description:
            'In ARGUS, 3D geometry instantly reveals address nature: Pulsing Crimson Icosahedron = Hacker / Exploiter (OFAC), Black Sphere + Purple Ring = ZK Mixer (Tornado Cash), Vertical Cylinder = Cross-Chain Bridge, Cyan Octahedron = DEX Pool, Gold Cube = CEX Off-Ramp.',
          actionLabel: 'Fly to Lazarus Hacker (0x098B...)',
        },
        {
          title: 'Step 3/6 — Taint Propagation Engine (Heatmap Crime Mode)',
          subtitle: 'Algorithmic calculation of fund contamination (0% to 100%)',
          description:
            'Enable "Heatmap Taint" mode to recolor the entire 3D graph according to criminal taint: Cold Steel (0% clean) → Cyan → Warm Ochre → Neon Vermilion (100% stolen funds). Dashed links show probabilistic correlations after exiting mixers.',
          actionLabel: 'Enable Heatmap Taint Mode (0-100%)',
        },
        {
          title: 'Step 4/6 — Dynamic Expansion (+1 Hop) & Sub-Graph Isolation',
          subtitle: 'Interactive investigation from the right inspector panel',
          description:
            'Clicking any 3D node reveals its risk gauge, token portfolio, and transaction history in the right inspector. Click "Expand (+1 Hop)" to dynamically inject neighbor nodes into the 3D scene, or "Isolate Sub-Graph" to focus your analysis.',
          actionLabel: 'Expand (+1 Hop) around Selected Node',
        },
        {
          title: 'Step 5/6 — Time-Lapse Scrubber (Replay Exploit Chronologically)',
          subtitle: 'Interactive timeline bar at the bottom of your screen',
          description:
            'Each transaction carries an exact timestamp. Click "REPLAY EXPLOIT" (or scrub the timeline bar below) to watch the attack unfold step by step: initial exploit → peel chains → DEX swaps → bridges → mixers → CEX off-ramps.',
          actionLabel: 'Start Chronological Replay (2x Speed)',
        },
        {
          title: 'Step 6/6 — Hybrid Split Mode & Classic Block Explorer',
          subtitle: 'Verify any Wallet, TxHash, Block or Live RPC address',
          description:
            'Toggle between "3D Space", "Hybrid Split" and "Explorer" at the top right. You have a full block explorer (filterable Transactions, Wallets, Blocks, Decoded CallData) and a universal search bar connected to Ethereum Mainnet RPCs.',
          actionLabel: 'Open Hybrid View (3D + Block Explorer)',
        },
      ],
    },
    docs: {
      modalTitle: 'ARGUS // Forensic Documentation & Investigation Guide',
      modalSubtitle: '3D Multi-Chain Architecture, Visual Grammar, Taint Propagation & Classic Block Explorer',
      launchTourBtn: 'Start Interactive Guided Tour (6 Steps)',
      tabQuickstart: '1. Quickstart Guide',
      tabGrammar: '2. 3D Spatial Grammar',
      tabForensic: '3. Forensic Engine & Taint',
      tabExplorer: '4. Classic Block Explorer',
      tabCases: '5. Real Historical Exploits (5 Hacks)',
    },
  },
};
