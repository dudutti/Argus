import { Language } from './translations';

export interface LocalizedCaseMeta {
  title: string;
  subtitle: string;
  category: string;
  stolenAmountUsd: string;
  attackerAttribution: string;
  rootVulnerability: string;
  summary: string;
  methodologySteps: string[];
  chronologySteps: {
    title: string;
    description: string;
    phase: string;
  }[];
}

export const LOCALIZED_CASES: Record<Language, Record<string, LocalizedCaseMeta>> = {
  fr: {
    'binance-2026': {
      title: 'Binance Multi-Chaînes ($6.4B — 29 Oct. 2026)',
      subtitle: 'Le plus grand braquage de l\'histoire crypto : Détournement EIP-7702 & Blitzkrieg sur 8 Blockchains',
      category: 'Infrastructure & EIP-7702 EOA Hijack // Multichain Blitz',
      stolenAmountUsd: '$6,400,000,000',
      attackerAttribution: 'Lazarus Group / TraderTraitor / UNC4899',
      rootVulnerability: 'Compromission des clés de serveur d\'orchestration + 50 autorisations de délégation EIP-7702 (0xef0100)',
      summary:
        'Le 29 octobre 2026 à 20:20 UTC, le groupe Lazarus a frappé Binance en exploitant l\'EIP-7702. Sans modifier l\'adresse du hot wallet Binance 14, un bytecode de sweeper a été injecté, siphonnant plus de 6,4 Milliards de dollars sur 8 blockchains (Ethereum, Bitcoin, Tron, Arbitrum, Optimism, Base, BNB Chain, Solana). En 54 minutes, Tether, Circle et l\'Arbitrum Security Council ont réussi à geler ~2,9 Milliards de dollars, tandis que ~3,5 Milliards en ETH et BTC natifs continuent de fuir via des peel chains actives.',
      methodologySteps: [
        '1. Déploiement préalable du contrat sweeper malveillant sur Ethereum L1 au bloc #26295416.',
        '2. Validation furtive de 50 signatures d\'autorisation EIP-7702 à nonces séquentiels dérobées sur l\'infrastructure interne.',
        '3. Exécution d\'un sweep atomique : drainage de 167 464 ETH et de milliards en stablecoins vers le hub 0x5227f6...',
        '4. Siphon simultané de 18 270,20 BTC au bloc 973732 vers le vault racine bc1q0mtc... et découpage en tranches UTXO de 1 000 BTC.',
        '5. Réaction d\'urgence : gel de 1,615 Md$ USDT par Tether, $800M par Circle et $30,5M par le Security Council Arbitrum.',
        '6. Blanchiment actif en direct : dispersion de 17 260 ETH vers 0x03b0eE... et négociation on-chain bilingue.',
      ],
      chronologySteps: [
        {
          title: 'Déploiement du Contrat Sweeper Malveillant',
          phase: 'Préparation d\'Arme',
          description: 'L\'attaquant déploie le smart contract sweeper à 02:28:59 UTC sur Ethereum L1.',
        },
        {
          title: 'Détournement EIP-7702 de Binance 14',
          phase: 'Compromission EOA',
          description: 'Injection de l\'authorization_list forçant le hot wallet Binance 14 à exécuter le code 0xef0100.',
        },
        {
          title: 'Mega-Sweep Atomique ($2.5B+ EVM)',
          phase: 'Exfiltration Primaire',
          description: 'Transfert interne de 167 464 ETH et 1,615 Md$ USDT vers 0x5227f603c1ee34ce3c06efe6477003bdfccb2f8c.',
        },
        {
          title: 'Siphon Massif Bitcoin (18 270 BTC)',
          phase: 'Exfiltration UTXO',
          description: 'Drainage au bloc 973732 vers bc1q0mtc... et début de la dispersion immédiate en peel chains.',
        },
        {
          title: 'Gels Coordonnés Tether / Circle / Arbitrum',
          phase: 'Contre-Attaque Forensique',
          description: 'Gel record en 54 minutes de près de 2,9 Milliards de dollars en USDT, USDC et tokens L2.',
        },
        {
          title: 'Blanchiment Live & Peel Chains Actives',
          phase: 'Dispersion Temps Réel',
          description: 'Transfert de 17 260 ETH vers 0x03b0eE... le 30-31 octobre et messages on-chain en cours.',
        },
      ],
    },
    'bybit-2025': {
      title: 'Bybit Safe Cold Vault ($1.46B ETH/stETH)',
      subtitle: 'Compromission multi-signature Safe par injecteur malveillant de transactions',
      category: 'Exchange Vault Hack // Multichain Peel',
      stolenAmountUsd: '$1,460,000,000',
      attackerAttribution: 'Lazarus Group (DPRK APT38)',
      rootVulnerability: 'Compromission des clés de signataires Safe + substitution de module payload',
      summary:
        'Le 21 février 2025, le cold wallet Bybit Safe a été drainé de plus de 400 000 ETH et stETH via des transactions autorisées frauduleusement. Les pirates ont fragmenté les fonds à travers des dizaines de peel chains, échangé des millions de stETH en ETH natif via Curve et Uniswap, puis injecté les capitaux dans Tornado Cash et des ponts cross-chain BTC.',
      methodologySteps: [
        '1. Compromission d’infrastructure : obtention des signatures requises pour le wallet Safe 3/5.',
        '2. Drainage massif en un bloc de 400 000+ ETH vers des adresses de peel secondaires.',
        '3. Débouclage agressif stETH -> ETH sur Curve 3Pool et Uniswap v3 pour éviter le gel de tokens.',
        '4. Saucissonnage des dépôts par lots de 100 ETH vers Tornado Cash.',
        '5. Exfiltration vers Bitcoin via THORChain et bridges décentralisés sans KYC.',
      ],
      chronologySteps: [
        {
          title: 'Signature & Approbation Malveillante Safe',
          phase: 'Infiltration Initial',
          description: 'Transaction 0x7a3f... soumise avec des clés compromises validant le transfert de la trésorerie.',
        },
        {
          title: 'Drainage Massif des Cold Storages',
          phase: 'Exfiltration Primaire',
          description: 'Transfert de 400 000 ETH et stETH vers l’adresse de collecte principale du drainer.',
        },
        {
          title: 'Peel Chain & Déconcentration',
          phase: 'Dispersion Réseau',
          description: 'Division des fonds en 24 sous-portefeuilles intermédiaires pour saturer les systèmes d’alerte.',
        },
        {
          title: 'Swaps DEX Haute Liquidité',
          phase: 'Conversion d’Actifs',
          description: 'Échange massif de stETH contre ETH natif sur Curve et Uniswap.',
        },
        {
          title: 'Injection dans Tornado Cash & Ponts',
          phase: 'Obfuscation & Blanchiment',
          description: 'Dépôts réguliers de 100 ETH dans Tornado Cash et pontage cross-chain vers Bitcoin via THORChain.',
        },
      ],
    },

    'ronin-2022': {
      title: 'Ronin Network Bridge ($624M ETH/USDC)',
      subtitle: 'Compromission de 5 validateurs Axie Infinity par ingénierie sociale (Fausse offre d’emploi PDF)',
      category: 'Cross-Chain Bridge Validator Compromise',
      stolenAmountUsd: '$624,000,000',
      attackerAttribution: 'Lazarus Group (DPRK APT38)',
      rootVulnerability: 'Compromission de 5 clés privées de validateurs sur 9 (dont un validateur tiers Axie DAO)',
      summary:
        'Le 23 mars 2022, le groupe Lazarus a compromis 4 nœuds validateurs Sky Mavis et 1 validateur Axie DAO via un malware dissimulé dans un PDF d’offre d’emploi LinkedIn. Deux retraits forgés ont dérobé 173 600 ETH et 25,5M USDC.',
      methodologySteps: [
        '1. Harponnage LinkedIn ciblé (Spear phishing) d’un ingénieur senior avec un PDF piégé.',
        '2. Prise de contrôle de 4 validateurs Sky Mavis internes.',
        '3. Exploitation d’un accès résiduel accordé en urgence à Axie DAO pour atteindre le quorum 5/9.',
        '4. Retraits légitimes en apparence sur le contrat de pont Ronin sur Ethereum.',
        '5. Blanchiment systématique via Tornado Cash et adresses relais Bitcoin.',
      ],
      chronologySteps: [
        {
          title: 'Spear Phishing LinkedIn & Compromission',
          phase: 'Accès Initial',
          description: 'Infection d’un poste clé permettant l’extraction des clés des nœuds validateurs.',
        },
        {
          title: 'Atteinte du Quorum de Signature 5/9',
          phase: 'Élévation de Privilèges',
          description: 'Signature de retraits non autorisés validés par le contrat de pont Ronin sur Ethereum.',
        },
        {
          title: 'Retrait Frauduleux de 173 600 ETH + 25.5M USDC',
          phase: 'Exfiltration',
          description: 'Appel de retrait exécuté avec succès en 2 transactions principales.',
        },
        {
          title: 'Conversion USDC -> ETH sur DEX',
          phase: 'Standardisation',
          description: 'Échange immédiat de l’USDC pour prévenir tout gel d’adresse par Circle.',
        },
        {
          title: 'Mixage Tornado Cash & Sanctions OFAC',
          phase: 'Blanchiment & Traque',
          description: 'Envois fractionnés vers Tornado Cash et inscription des adresses sur la liste SDN de l’OFAC.',
        },
      ],
    },

    'euler-2023': {
      title: 'Euler Finance Flashloan ($197M DAI/WBTC/stETH)',
      subtitle: 'Bug de sous-collatéralisation dans la fonction donateToReserves (Remise intégrale)',
      category: 'DeFi Protocol Logic Vulnerability',
      stolenAmountUsd: '$197,000,000',
      attackerAttribution: 'Federico Jaime (Hacker Whitehat repentant)',
      rootVulnerability: 'Absence de contrôle de liquidité dans eToken.sol:donateToReserves()',
      summary:
        'Le 13 mars 2023, Euler Finance a subi une attaque flashloan de 197M$. Le contrat permettait aux emprunteurs de donner des fonds aux réserves sans vérifier si leur position d’emprunt devenait insolvable. Après négociations intenses on-chain, 100% des fonds ont été restitués.',
      methodologySteps: [
        '1. Emprunt Flashloan de 30M DAI sur Aave v2.',
        '2. Dépôt de 20M DAI sur Euler (réception d’eDAI) et mint d’un levier 10x avec dDAI.',
        '3. Appel de donateToReserves() détruisant les eDAI sans apurer la dette dDAI correspondante.',
        '4. Liquidation de sa propre position insolvable avec bonus de décote massif.',
        '5. Répétition sur stETH, WBTC et USDC.',
      ],
      chronologySteps: [
        {
          title: 'Souscription Flashloan 30M DAI',
          phase: 'Capitalisation Éphémère',
          description: 'Emprunt flash sans collatéral sur Aave v2.',
        },
        {
          title: 'Dépôt & Effet de Levier eToken',
          phase: 'Préparation du Bug',
          description: 'Génération de positions de dette dDAI et de collatéral eDAI.',
        },
        {
          title: 'Appel de donateToReserves() Malveillant',
          phase: 'Exploitation Logique',
          description: 'Destruction de collatéral rendant la position immédiatement liquidable avec profit.',
        },
        {
          title: 'Auto-Liquidation & Envoi vers Tornado Cash',
          phase: 'Extraction & Pression',
          description: 'Drainage de 197M$ et transfert initial de 1 000 ETH vers Tornado Cash pour mettre la pression.',
        },
        {
          title: 'Négociation On-Chain & Restitution Totale',
          phase: 'Remboursement',
          description: 'Messages chiffrés sur Ethereum et restitution de 100% des fonds après accord avec le protocole.',
        },
      ],
    },

    'ftx-2022': {
      title: 'FTX Accounts Drainer ($477M Multi-Chain)',
      subtitle: 'Drainage massif non autorisé quelques heures après la déclaration de faillite (Chapter 11)',
      category: 'Internal Rogue / Insider Exploit',
      stolenAmountUsd: '$477,000,000',
      attackerAttribution: 'Drainer FTX Non-Identifié (Soupçon d’accès interne ou malware)',
      rootVulnerability: 'Clés privées chaudes et semi-froides non protégées sur les serveurs FTX',
      summary:
        'Dans la nuit du 11 au 12 novembre 2022, immédiatement après la mise en faillite de FTX, des centaines de millions ont été aspirés sur Ethereum, Solana et Arbitrum. Les pirates ont échangé les tokens contre de l’ETH et du renBTC pour migrer vers Bitcoin.',
      methodologySteps: [
        '1. Utilisation de clés privées FTX chaudes/internes non révoquées.',
        '2. Drainage simultané sur Solana, Ethereum, BSC et Arbitrum.',
        '3. Ventes au marché immédiates de tokens illiquides pour éviter les freezes.',
        '4. Utilisation intensive du pont RenBridge pour convertir en Bitcoin natif.',
        '5. Dormance prolongée des fonds avant fractionnement en 2023-2024.',
      ],
      chronologySteps: [
        {
          title: 'Compromission des Clés Privées FTX',
          phase: 'Accès Privilégié',
          description: 'Transactions initiées directement depuis les wallets officiels de la plateforme.',
        },
        {
          title: 'Drainage Multi-Chaîne Simultané',
          phase: 'Siphonage',
          description: 'Aspiration de centaines d’actifs sur Ethereum, Solana et Arbitrum.',
        },
        {
          title: 'Swaps Panique sur DEX (1inch, Uniswap)',
          phase: 'Liquidation',
          description: 'Échange d’actifs volatils contre ETH et DAI pour sécuriser la valeur.',
        },
        {
          title: 'Pontage vers Bitcoin via RenBridge',
          phase: 'Saut Cross-Chain',
          description: 'Transformation des tokens EVM en Bitcoin pour quitter le périmètre des smart contracts.',
        },
        {
          title: 'Fractionnement & Peel Chains BTC',
          phase: 'Obfuscation Long Terme',
          description: 'Distribution en micro-adresses Bitcoin non spendées pendant plusieurs mois.',
        },
      ],
    },

    'wormhole-2022': {
      title: 'Wormhole Token Bridge ($325M wETH Solana)',
      subtitle: 'Contournement de la vérification de signature des gardiens (verify_signatures)',
      category: 'Cross-Chain Bridge Smart Contract Bug',
      stolenAmountUsd: '$325,000,000',
      attackerAttribution: 'Exploiteur Wormhole (Fonds contre-exploités par Jump Crypto & Oasis)',
      rootVulnerability: 'Substitution du sysvar instructions sur Solana (load_instruction_at)',
      summary:
        'Le 2 février 2022, un hacker a exploité une faille dans le contrat Solana du pont Wormhole. En injectant un compte sysvar forgé, il a simulé l’accord des 19 gardiens et minté 120 000 wETH sans déposer aucun collatéral, avant de les rapatrier sur Ethereum.',
      methodologySteps: [
        '1. Repérage d’un commit public sur GitHub réparant la faille mais non déployé en production.',
        '2. Forgerie d’un compte sysvar instruction contenant de fausses signatures de validateurs.',
        '3. Mint de 120 000 wETH sur Solana sans collatéral réel.',
        '4. Bridge des wETH vers Ethereum Mainnet via le contrat Wormhole natif.',
        '5. Contre-hack ultérieur en 2023 par Jump Crypto et Oasis pour récupérer 140M$ de collatéral.',
      ],
      chronologySteps: [
        {
          title: 'Exploitation du Sysvar Instructions Solana',
          phase: 'Injection de Faux État',
          description: 'Substitution du programme système pour bypasser la vérification des signatures des gardiens.',
        },
        {
          title: 'Frappe Frauduleuse de 120 000 wETH',
          phase: 'Mint Illégitime',
          description: 'Émission de jetons wETH sur Solana sans aucun dépôt d’ETH correspondant sur Ethereum.',
        },
        {
          title: 'Rapatriement des wETH vers Ethereum',
          phase: 'Retrait Cross-Chain',
          description: 'Échange des wETH mintés contre 93 750 ETH réels sur le contrat de pont Ethereum.',
        },
        {
          title: 'Dépôts DEX & Off-Ramps',
          phase: 'Dispersion',
          description: 'Placement des fonds dans des vaults DeFi (Oasis, MakerDAO).',
        },
        {
          title: 'Contre-Attaque Judiciaire Jump / Oasis (2023)',
          phase: 'Récupération Légale',
          description: 'Exploitation d’un module de gouvernance Oasis ordonnée par la justice britannique pour recouvrer 140M$.',
        },
      ],
    },
  },

  en: {
    'binance-2026': {
      title: 'Binance Multi-Chain Heist ($6.4B — Oct 2026)',
      subtitle: 'The largest crypto heist in history: EIP-7702 EOA Hijack & 8-Blockchain Blitzkrieg',
      category: 'Infrastructure & EIP-7702 EOA Hijack // Multichain Blitz',
      stolenAmountUsd: '$6,400,000,000',
      attackerAttribution: 'Lazarus Group / TraderTraitor / UNC4899',
      rootVulnerability: 'Orchestration server key compromise + 50 pre-signed EIP-7702 delegation authorizations (0xef0100)',
      summary:
        'On October 29, 2026 at 20:20 UTC, Lazarus Group struck Binance by weaponizing EIP-7702. Without modifying the Binance 14 EOA address, malicious sweeper bytecode was injected, siphoning over $6.4 Billion across 8 blockchains (Ethereum, Bitcoin, Tron, Arbitrum, Optimism, Base, BNB Chain, Solana). In 54 minutes, Tether, Circle, and the Arbitrum Security Council frozen ~$2.9 Billion, while ~$3.5 Billion in native ETH and BTC continues active live laundering across peel chains.',
      methodologySteps: [
        '1. Pre-deployment of malicious sweeper smart contract on Ethereum L1 at block #26295416.',
        '2. Covert harvesting of 50 pre-signed EIP-7702 sequential nonce authorizations from internal orchestration servers.',
        '3. Atomic sweep execution: draining 167,464 ETH and billions in stablecoins to hub 0x5227f6...',
        '4. Simultaneous siphon of 18,270.20 BTC at block 973732 to root vault bc1q0mtc... and immediate 1,000 BTC UTXO slicing.',
        '5. Rapid counter-attack: $1.615B USDT frozen by Tether, $800M by Circle, and $30.5M by Arbitrum Security Council.',
        '6. Ongoing live laundering: 17,260 ETH peel transfer to 0x03b0eE... and bilingual on-chain negotiations.',
      ],
      chronologySteps: [
        {
          title: 'Malicious Sweeper Deployment',
          phase: 'Weapon Staging',
          description: 'Attacker deploys sweeper contract at 02:28:59 UTC on Ethereum L1.',
        },
        {
          title: 'EIP-7702 Binance 14 Hijack',
          phase: 'EOA Code Delegation',
          description: 'Injecting authorization_list forcing Binance 14 EOA to execute delegated 0xef0100 bytecode.',
        },
        {
          title: 'Atomic Mega-Sweep ($2.5B+ EVM)',
          phase: 'Primary Exfiltration',
          description: 'Internal transfer of 167,464 ETH and 1.615B USDT to 0x5227f603c1ee34ce3c06efe6477003bdfccb2f8c.',
        },
        {
          title: 'Bitcoin Blitz Drain (18,270 BTC)',
          phase: 'UTXO Exfiltration',
          description: 'Draining at block 973732 to bc1q0mtc... and immediate dispersion into 1,000 BTC peel chains.',
        },
        {
          title: 'Coordinated Tether / Circle / Arbitrum Freeze',
          phase: 'Forensic Counter-Attack',
          description: 'Record 54-minute freeze of nearly $2.9 Billion across USDT, USDC, and L2 tokens.',
        },
        {
          title: 'Live Laundering & Active Peel Chains',
          phase: 'Real-Time Dispersion',
          description: 'Transfer of 17,260 ETH to 0x03b0eE... on Oct 30-31 and ongoing negotiation messages.',
        },
      ],
    },
    'bybit-2025': {
      title: 'Bybit Safe Cold Vault ($1.46B ETH/stETH)',
      subtitle: 'Safe multisig compromise via malicious transaction injector module',
      category: 'Exchange Vault Hack // Multichain Peel',
      stolenAmountUsd: '$1,460,000,000',
      attackerAttribution: 'Lazarus Group (DPRK APT38)',
      rootVulnerability: 'Safe 3/5 signer keys compromise + malicious payload module substitution',
      summary:
        'On February 21, 2025, Bybit’s primary cold storage vault was drained of over 400,000 ETH and stETH via compromised authorized signatures. The attackers fragmented funds across dozens of peel chains, swapped millions of stETH into native ETH on Curve and Uniswap, and routed capital into Tornado Cash and cross-chain Bitcoin bridges.',
      methodologySteps: [
        '1. Infrastructure compromise: acquisition of threshold signatures for Safe 3/5 cold vault.',
        '2. Single-block mass drainage of 400,000+ ETH to secondary peel collector addresses.',
        '3. Aggressive stETH -> ETH unwinding on Curve 3Pool and Uniswap v3 to evade token blacklisting.',
        '4. Slicing deposits into standardized 100 ETH batches into Tornado Cash.',
        '5. Exfiltration to Bitcoin via THORChain and permissionless non-KYC bridges.',
      ],
      chronologySteps: [
        {
          title: 'Malicious Safe Approval & Execution',
          phase: 'Initial Infiltration',
          description: 'Transaction 0x7a3f... executed with compromised signer keys releasing vault reserves.',
        },
        {
          title: 'Mass Cold Storage Drainage',
          phase: 'Primary Exfiltration',
          description: 'Transfer of 400,000 ETH and stETH to primary drainer consolidation wallets.',
        },
        {
          title: 'Peel Chain Dispersion',
          phase: 'Network Deconcentration',
          description: 'Splitting funds across 24 intermediate sub-wallets to overwhelm forensic alerting systems.',
        },
        {
          title: 'Deep Liquidity DEX Swaps',
          phase: 'Asset Conversion',
          description: 'Mass liquidations of stETH into native ETH on Curve and Uniswap pools.',
        },
        {
          title: 'Tornado Cash & Cross-Chain Injections',
          phase: 'Obfuscation & Laundering',
          description: 'Systematic 100 ETH deposits to Tornado Cash and bridge transfers to Bitcoin via THORChain.',
        },
      ],
    },

    'ronin-2022': {
      title: 'Ronin Network Bridge ($624M ETH/USDC)',
      subtitle: '5 validator keys compromised via spear-phishing LinkedIn fake job offer PDF',
      category: 'Cross-Chain Bridge Validator Compromise',
      stolenAmountUsd: '$624,000,000',
      attackerAttribution: 'Lazarus Group (DPRK APT38)',
      rootVulnerability: 'Compromise of 5 out of 9 validator private keys (including Axie DAO validator)',
      summary:
        'On March 23, 2022, Lazarus Group compromised 4 Sky Mavis validators and 1 Axie DAO validator via spyware hidden in a malicious job offer PDF on LinkedIn. Two forged bridge withdrawal requests stole 173,600 ETH and 25.5M USDC.',
      methodologySteps: [
        '1. Targeted LinkedIn spear-phishing of a senior engineer with an infected PDF payload.',
        '2. Takeover of 4 internal Sky Mavis validator nodes.',
        '3. Exploitation of residual RPC permissions granted to Axie DAO to hit the 5/9 quorum.',
        '4. Forged withdrawal requests executed on the Ronin Bridge contract on Ethereum.',
        '5. Laundering via Tornado Cash, Huobi deposit addresses, and Bitcoin relays.',
      ],
      chronologySteps: [
        {
          title: 'LinkedIn Spear Phishing & Infection',
          phase: 'Initial Access',
          description: 'Workstation compromise enabling private key extraction from validator keystores.',
        },
        {
          title: 'Attaining 5/9 Signature Quorum',
          phase: 'Privilege Escalation',
          description: 'Forged signatures validating bridge withdrawal proofs on Ethereum.',
        },
        {
          title: 'Fraudulent Withdrawal of 173,600 ETH + 25.5M USDC',
          phase: 'Exfiltration',
          description: 'Two bridge withdrawal calls successfully executed on Ethereum mainnet.',
        },
        {
          title: 'DEX Swaps (USDC to ETH)',
          phase: 'Standardization',
          description: 'Immediate conversion of USDC to native ETH to prevent Circle blacklist freezing.',
        },
        {
          title: 'Tornado Cash Mixing & OFAC Sanctions',
          phase: 'Laundering & Sanctions',
          description: 'Batch transfers into Tornado Cash and designation of addresses on OFAC SDN list.',
        },
      ],
    },

    'euler-2023': {
      title: 'Euler Finance Flashloan ($197M DAI/WBTC/stETH)',
      subtitle: 'Under-collateralization vulnerability in donateToReserves function (100% funds returned)',
      category: 'DeFi Protocol Logic Vulnerability',
      stolenAmountUsd: '$197,000,000',
      attackerAttribution: 'Federico Jaime (Repentant Whitehat Hacker)',
      rootVulnerability: 'Lack of health factor liquidity checks in eToken.sol:donateToReserves()',
      summary:
        'On March 13, 2023, Euler Finance was drained of $197M via a flashloan exploit. The protocol allowed users to donate funds to reserves without verifying if their borrowing position became insolvent. After extensive on-chain messaging, 100% of the funds were returned.',
      methodologySteps: [
        '1. 30M DAI flashloan borrowed from Aave v2.',
        '2. Deposit of 20M DAI on Euler (minting eDAI) and leveraging 10x with dDAI debt tokens.',
        '3. Calling donateToReserves() which burned eDAI collateral without extinguishing dDAI debt.',
        '4. Self-liquidating the underwater position with an enormous liquidation discount bonus.',
        '5. Replicating the exploit across stETH, WBTC, and USDC pools.',
      ],
      chronologySteps: [
        {
          title: 'Aave Flashloan (30M DAI)',
          phase: 'Capital Influx',
          description: 'Uncollateralized flashloan borrowing from Aave v2.',
        },
        {
          title: 'Leveraged Deposit & eToken Minting',
          phase: 'Setup Vulnerability',
          description: 'Creation of leveraged debt positions on Euler lending pools.',
        },
        {
          title: 'Malicious donateToReserves() Call',
          phase: 'Logic Exploit',
          description: 'Collateral burned without debt reduction, rendering account eligible for massive bonus liquidation.',
        },
        {
          title: 'Self-Liquidation & Tornado Pressure',
          phase: 'Extraction & Leverage',
          description: '$197M drained; 1,000 ETH sent to Tornado Cash to establish negotiating leverage.',
        },
        {
          title: 'On-Chain Negotiation & 100% Restitution',
          phase: 'Resolution',
          description: 'Encrypted Ethereum transaction notes exchanged, culminating in full restitution of stolen capital.',
        },
      ],
    },

    'ftx-2022': {
      title: 'FTX Accounts Drainer ($477M Multi-Chain)',
      subtitle: 'Mass unauthorized drainage hours after Chapter 11 bankruptcy filing',
      category: 'Internal Rogue / Insider Exploit',
      stolenAmountUsd: '$477,000,000',
      attackerAttribution: 'Unidentified FTX Drainer (Suspected internal access or malware)',
      rootVulnerability: 'Unrevoked internal hot and warm wallet private keys on exchange infrastructure',
      summary:
        'Late on November 11, 2022, immediately after FTX declared Chapter 11 bankruptcy, hundreds of millions were drained across Ethereum, Solana, and Arbitrum. Attackers rapidly sold tokens on DEXs for ETH and renBTC to bridge to Bitcoin.',
      methodologySteps: [
        '1. Exploitation of unrevoked internal FTX operational private keys.',
        '2. Simultaneous withdrawals across Solana, Ethereum, BSC, and Arbitrum.',
        '3. Aggressive market selling of illiquid tokens to frontrun administrator freezes.',
        '4. Heavy utilization of RenBridge to cross over into native Bitcoin.',
        '5. Extended dormancy of funds before peel chain distribution in 2023-2024.',
      ],
      chronologySteps: [
        {
          title: 'Compromise of Internal FTX Keys',
          phase: 'Privileged Access',
          description: 'Unauthorized transactions initiated directly from official exchange hot wallets.',
        },
        {
          title: 'Simultaneous Multi-Chain Drainage',
          phase: 'Siphoning',
          description: 'Exfiltration of hundreds of ERC-20, SPL, and BEP-20 assets.',
        },
        {
          title: 'Panic DEX Liquidations (1inch, Uniswap)',
          phase: 'Asset Conversion',
          description: 'Converting volatile tokens into ETH and DAI to lock in value.',
        },
        {
          title: 'Bridging to Bitcoin via RenBridge',
          phase: 'Cross-Chain Hop',
          description: 'Converting EVM assets into Bitcoin to exit smart contract jurisdiction.',
        },
        {
          title: 'Dormancy & BTC Peel Distribution',
          phase: 'Long-Term Obfuscation',
          description: 'Unspent Bitcoin UTXOs preserved in dormancy prior to secondary splitting.',
        },
      ],
    },

    'wormhole-2022': {
      title: 'Wormhole Token Bridge ($325M wETH Solana)',
      subtitle: 'Guardian signature verification bypass via instructions sysvar spoofing',
      category: 'Cross-Chain Bridge Smart Contract Bug',
      stolenAmountUsd: '$325,000,000',
      attackerAttribution: 'Wormhole Exploiter (Counter-exploited by Jump Crypto & Oasis)',
      rootVulnerability: 'Solana instructions sysvar account replacement (load_instruction_at)',
      summary:
        'On February 2, 2022, an attacker exploited a bug in Wormhole’s Solana bridge program. By substituting the instruction sysvar account, they forged guardian signatures, minted 120,000 wETH without collateral, and bridged it back to Ethereum.',
      methodologySteps: [
        '1. Identifying an unpatched vulnerability from a recent public Wormhole GitHub commit.',
        '2. Crafting a fake instruction sysvar account holding forged guardian signatures.',
        '3. Minting 120,000 unbacked wETH on Solana.',
        '4. Bridging wETH to Ethereum Mainnet to unlock authentic ETH from the bridge vault.',
        '5. Subsequent 2023 legal counter-exploit by Jump Crypto and Oasis recovering $140M.',
      ],
      chronologySteps: [
        {
          title: 'Solana Instructions Sysvar Spoofing',
          phase: 'State Injection',
          description: 'Bypassing guardian multisig validation by substituting the native sysvar instructions account.',
        },
        {
          title: 'Unbacked Minting of 120,000 wETH',
          phase: 'Illegitimate Mint',
          description: 'Creation of 120,000 wETH on Solana with zero corresponding deposit on Ethereum.',
        },
        {
          title: 'Bridge Withdrawal on Ethereum',
          phase: 'Cross-Chain Extraction',
          description: 'Redeeming minted wETH for 93,750 real ETH from the Wormhole Ethereum vault.',
        },
        {
          title: 'DeFi Vault Placements & Off-Ramps',
          phase: 'Dispersion',
          description: 'Collateralizing stolen ETH into Oasis and MakerDAO vaults.',
        },
        {
          title: 'Court-Ordered Counter-Exploit (2023)',
          phase: 'Asset Recovery',
          description: 'British High Court authorized Oasis counter-exploit recovering $140M of collateral.',
        },
      ],
    },
  },
};

const CASE_ID_ALIASES: Record<string, string> = {
  'binance-multichain-heist-2026': 'binance-2026',
  'bybit-safe-exploit-2025': 'bybit-2025',
  'ronin-bridge-exploit-2022': 'ronin-2022',
  'euler-flashloan-exploit-2023': 'euler-2023',
  'ftx-accounts-drainer-2022': 'ftx-2022',
  'wormhole-bridge-exploit-2022': 'wormhole-2022',
};

(['fr', 'en'] as Language[]).forEach((lang) => {
  const dict = LOCALIZED_CASES[lang];
  if (!dict) return;
  Object.entries(CASE_ID_ALIASES).forEach(([fullId, shortId]) => {
    if (dict[shortId] && !dict[fullId]) {
      dict[fullId] = dict[shortId];
    }
  });
});
