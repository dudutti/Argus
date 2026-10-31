export type ChainId = 'SOL' | 'BASE' | 'OP' | 'ARB' | 'ETH' | 'BSC' | 'TRX' | 'BTC';

export type EntityType =
  | 'eoa'
  | 'exploiter'
  | 'mixer'
  | 'bridge'
  | 'dex'
  | 'cex';

export type AssetType =
  | 'ETH'
  | 'USDT'
  | 'USDC'
  | 'WBTC'
  | 'BTC'
  | 'SOL'
  | 'DAI'
  | 'TRX'
  | 'BNB'
  | 'ARB'
  | 'OP'
  | 'RLUSD'
  | 'WBETH'
  | 'XAUT';

export interface TokenHolding {
  symbol: AssetType;
  amount: number;
  usdValue: number;
  contractAddress?: string;
}

export interface ForensicNode {
  id: string;
  address: string;
  label: string;
  ens?: string;
  chain: ChainId;
  entityType: EntityType;
  volumeUsd: number;
  inflowUsd: number;
  outflowUsd: number;
  taintScore: number; // 0 to 100
  firstSeen: number; // unix timestamp ms
  lastActive: number;
  flaggedSuspect?: boolean;
  isFrozen?: boolean;
  freezeReason?: string;
  frozenTimestamp?: number; // unix timestamp ms when freeze event/blacklist was executed
  eip7702DelegatedTo?: string;
  notes?: string;
  tokens: TokenHolding[];
  txCount: number;
  dataSource?: 'live_onchain' | 'synthetic_simulation';
  // 3D spatial state
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

export interface ForensicLink {
  id: string;
  txHash: string;
  source: string; // node id
  target: string; // node id
  sourceChain: ChainId;
  targetChain: ChainId;
  amount: number;
  usdValue: number;
  asset: AssetType;
  timestamp: number; // unix timestamp ms
  blockNumber: number;
  gasUsed: number;
  gasPriceGwei: number;
  feeUsd: number;
  methodName: string; // e.g., "Transfer", "Deposit", "SwapExactETHForTokens", "BridgeAsset", "FlashLoan"
  isCrossChain: boolean;
  isProbabilistic?: boolean; // Post-mixer time/amount correlation link
  isHighTaint?: boolean;
  isFrozen?: boolean;
  velocity: number; // 0.3 to 3.0 speed factor for particle movement
  status: 'Confirmed' | 'Pending' | 'Flagged';
  inputDataHex?: string;
  dataSource?: 'live_onchain' | 'synthetic_simulation';
}

export interface BlockRecord {
  number: number;
  hash: string;
  chain: ChainId;
  timestamp: number;
  txCount: number;
  minerOrValidator: string;
  gasUsed: string;
  gasLimit: string;
  baseFeeGwei: number;
  rewardUsd: number;
  totalVolumeUsd: number;
  taintedTxCount: number;
}

export interface AttackTimelineStep {
  timeUtc: string;
  blockNumber: number;
  phase: string;
  technicalMethod: string;
  keyAddressOrTx: string;
  details: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  stolenAmountUsd: string;
  attackerAttribution: string;
  rootVulnerability: string;
  primaryExploiterAddress: string;
  primaryVictimAddress: string;
  primaryAttackTxHash: string;
  summary: string;
  chronology: AttackTimelineStep[];
  nodes: ForensicNode[];
  links: ForensicLink[];
  blocks: BlockRecord[];
}

export type AppViewMode = '3d' | 'explorer' | 'split';

export type ExplorerTab = 'transactions' | 'blocks' | 'wallets' | 'tx-detail' | 'wallet-detail' | 'block-detail';

/**
 * Returns true if a node is currently frozen at the given timeline timestamp.
 * If the timeline is scrubbed before the freeze event, the node is rendered as an active/suspect vault (Red).
 * When currentTimestamp passes the freeze transaction, the node morphs into Cryo-Cyan with its ice cage.
 */
export function isNodeFrozenAtTime(
  node: ForensicNode,
  currentTimestamp: number,
  allLinks?: ForensicLink[]
): boolean {
  if (!node.isFrozen) return false;
  if (typeof node.frozenTimestamp === 'number') {
    return currentTimestamp >= node.frozenTimestamp;
  }
  if (allLinks && allLinks.length > 0) {
    const freezeLink = allLinks.find(
      (l) => l.isFrozen && (l.target === node.id || l.source === node.id)
    );
    if (freezeLink) {
      return currentTimestamp >= freezeLink.timestamp;
    }
  }
  return true;
}


