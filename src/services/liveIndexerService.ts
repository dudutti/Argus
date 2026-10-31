import { AssetType, ChainId, EntityType, ForensicLink, ForensicNode } from '../types/forensics';
import { CHAIN_PLANES } from '../data/forensicCases';
import { checkEip7702Delegation } from './multichainCollectors';

export interface BlockscoutTxItem {
  hash: string;
  from: {
    hash: string;
    is_contract?: boolean;
    name?: string | null;
    metadata?: {
      tags?: Array<{ name?: string }>;
    };
  };
  to?: {
    hash: string;
    is_contract?: boolean;
    name?: string | null;
    metadata?: {
      tags?: Array<{ name?: string }>;
    };
  } | null;
  value: string;
  timestamp?: string;
  block_number?: number;
  gas_used?: string;
  gas_price?: string;
  method?: string | null;
  decoded_input?: {
    method_call?: string;
  } | null;
  raw_input?: string;
  result?: string;
}

export interface BlockscoutInternalTxItem {
  transaction_hash?: string;
  block_number?: number;
  timestamp?: string;
  from?: {
    hash: string;
    is_contract?: boolean;
    name?: string | null;
  };
  to?: {
    hash: string;
    is_contract?: boolean;
    name?: string | null;
  };
  value?: string;
  type?: string;
  success?: boolean;
}

interface BlockscoutTokenTransferItem {
  transaction_hash?: string;
  block_number?: number;
  timestamp?: string;
  method?: string | null;
  from?: {
    hash: string;
    is_contract?: boolean;
    name?: string | null;
    metadata?: { tags?: Array<{ name?: string }> };
  };
  to?: {
    hash: string;
    is_contract?: boolean;
    name?: string | null;
    metadata?: { tags?: Array<{ name?: string }> };
  };
  token?: {
    symbol?: string;
    decimals?: string;
    exchange_rate?: string | null;
  };
  total?: {
    value?: string;
    decimals?: string;
  };
}

const VALID_ERC20_SYMBOLS = new Set([
  'WETH', 'STETH', 'WSTETH', 'METH', 'CMETH', 'RETH', 'CBETH',
  'USDC', 'USDT', 'DAI', 'FRAX', 'LUSD', 'RLUSD', 'USD1', 'FDUSD',
  'WBTC', 'RENBTC', 'CBBTC', 'TBTC',
  'PAXG', 'XAUT', 'WBETH', 'LINK', 'UNI', 'AAVE', 'LDO', 'MKR', 'CRV',
  'ARB', 'OP', 'ENA', 'PEPE',
]);

function mapSymbolToAsset(sym?: string): AssetType {
  const u = (sym || 'ETH').toUpperCase();
  if (u.includes('WBETH')) return 'WBETH';
  if (u.includes('XAUT')) return 'XAUT';
  if (u.includes('RLUSD')) return 'RLUSD';
  if (u.includes('BTC')) return 'WBTC';
  if (u.includes('USDT') || u.includes('USD1') || u.includes('FDUSD')) return 'USDT';
  if (u.includes('USDC')) return 'USDC';
  if (u.includes('DAI') || u === 'FRAX' || u === 'LUSD') return 'DAI';
  if (u === 'SOL') return 'SOL';
  if (u === 'TRX') return 'TRX';
  if (u === 'BNB') return 'BNB';
  if (u === 'ARB') return 'ARB';
  if (u === 'OP') return 'OP';
  return 'ETH';
}

function classifyEntityFromMetadata(
  isContract: boolean,
  name?: string | null,
  tags?: Array<{ name?: string }>
): EntityType {
  const combined = (
    (name || '') +
    ' ' +
    (tags?.map((t) => t.name || '').join(' ') || '')
  ).toLowerCase();

  if (combined.includes('tornado') || combined.includes('railgun') || combined.includes('mixer')) {
    return 'mixer';
  }
  if (
    combined.includes('bridge') ||
    combined.includes('wormhole') ||
    combined.includes('stargate') ||
    combined.includes('thorchain') ||
    combined.includes('chainflip') ||
    combined.includes('renvm')
  ) {
    return 'bridge';
  }
  if (
    combined.includes('uniswap') ||
    combined.includes('curve') ||
    combined.includes('1inch') ||
    combined.includes('paraswap') ||
    combined.includes('swap') ||
    combined.includes('pool') ||
    combined.includes('dex') ||
    combined.includes('aave') ||
    combined.includes('lido')
  ) {
    return 'dex';
  }
  if (
    combined.includes('binance') ||
    combined.includes('coinbase') ||
    combined.includes('kraken') ||
    combined.includes('okx') ||
    combined.includes('huobi') ||
    combined.includes('bybit') ||
    combined.includes('ftx') ||
    combined.includes('exchange')
  ) {
    return 'cex';
  }
  if (
    combined.includes('hacker') ||
    combined.includes('phishing') ||
    combined.includes('drainer') ||
    combined.includes('exploiter') ||
    combined.includes('ofac') ||
    combined.includes('lazarus')
  ) {
    return 'exploiter';
  }
  return isContract ? 'dex' : 'eoa';
}

async function safeFetchBlockscout<T>(url: string, timeoutMs = 6500): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchLiveOnChainTransactions(
  address: string,
  chain: ChainId = 'ETH',
  limit: number = 28
): Promise<{
  realNodes: ForensicNode[];
  realLinks: ForensicLink[];
  isLive: boolean;
}> {
  const isEosChain = chain === 'ETH' || chain === 'ARB' || chain === 'OP' || chain === 'BASE';
  if (!isEosChain || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { realNodes: [], realLinks: [], isLive: false };
  }

  const baseUrl =
    chain === 'ARB'
      ? 'https://arbitrum.blockscout.com/api/v2'
      : chain === 'OP'
      ? 'https://optimism.blockscout.com/api/v2'
      : chain === 'BASE'
      ? 'https://base.blockscout.com/api/v2'
      : 'https://eth.blockscout.com/api/v2';

  try {
    // Query outgoing txs, incoming txs, token transfers, AND internal transactions in parallel
    const [outTxRes, allTxRes, tokRes, internalTxRes] = await Promise.all([
      safeFetchBlockscout<{ items?: BlockscoutTxItem[] }>(
        `${baseUrl}/addresses/${address}/transactions?filter=from`
      ),
      safeFetchBlockscout<{ items?: BlockscoutTxItem[] }>(
        `${baseUrl}/addresses/${address}/transactions`
      ),
      safeFetchBlockscout<{ items?: BlockscoutTokenTransferItem[] }>(
        `${baseUrl}/addresses/${address}/token-transfers`
      ),
      safeFetchBlockscout<{ items?: BlockscoutInternalTxItem[] }>(
        `${baseUrl}/addresses/${address}/internal-transactions`
      ),
    ]);

    const seenTxHashes = new Set<string>();
    const combinedTxs: BlockscoutTxItem[] = [];

    for (const tx of outTxRes?.items || []) {
      if (tx.hash && !seenTxHashes.has(tx.hash)) {
        seenTxHashes.add(tx.hash);
        combinedTxs.push(tx);
      }
    }
    for (const tx of allTxRes?.items || []) {
      if (tx.hash && !seenTxHashes.has(tx.hash)) {
        seenTxHashes.add(tx.hash);
        combinedTxs.push(tx);
      }
    }

    const tokItems: BlockscoutTokenTransferItem[] = Array.isArray(tokRes?.items)
      ? tokRes!.items!
      : [];
    const internalItems: BlockscoutInternalTxItem[] = Array.isArray(internalTxRes?.items)
      ? internalTxRes!.items!
      : [];

    if (combinedTxs.length === 0 && tokItems.length === 0 && internalItems.length === 0) {
      return { realNodes: [], realLinks: [], isLive: false };
    }

    const normalizedCenter = address.toLowerCase();
    const realNodesMap = new Map<string, ForensicNode>();
    const realLinks: ForensicLink[] = [];
    const seenLinkIds = new Set<string>();

    const now = Date.now();
    const yPlane = CHAIN_PLANES[chain].y;
    const ethPriceUsd = 2650;

    function upsertCounterparty(
      counterpartyAddr: string,
      isOutflow: boolean,
      usdValue: number,
      asset: AssetType,
      amount: number,
      txTimestamp: number,
      isContract: boolean,
      name?: string | null,
      tags?: Array<{ name?: string }>
    ): ForensicNode {
      const lower = counterpartyAddr.toLowerCase();
      if (realNodesMap.has(lower)) {
        const ex = realNodesMap.get(lower)!;
        ex.volumeUsd += usdValue;
        if (isOutflow) ex.outflowUsd += usdValue;
        else ex.inflowUsd += usdValue;
        ex.txCount += 1;
        ex.firstSeen = Math.min(ex.firstSeen, txTimestamp);
        ex.lastActive = Math.max(ex.lastActive, txTimestamp);
        return ex;
      }

      const entityType = classifyEntityFromMetadata(isContract, name, tags);
      const label =
        name ||
        tags?.[0]?.name ||
        (entityType === 'mixer'
          ? 'Tornado Cash / ZK Pool'
          : entityType === 'dex'
          ? `DEX / Contract (${counterpartyAddr.slice(0, 6)}..${counterpartyAddr.slice(-4)})`
          : entityType === 'cex'
          ? `Exchange Wallet (${counterpartyAddr.slice(0, 6)}..${counterpartyAddr.slice(-4)})`
          : `On-Chain Wallet (${counterpartyAddr.slice(0, 6)}..${counterpartyAddr.slice(-4)})`);

      const angle = (realNodesMap.size / Math.max(8, limit)) * Math.PI * 2;
      const radius = 85 + (realNodesMap.size % 4) * 22;

      const newNode: ForensicNode = {
        id: `live-hop-${lower.slice(0, 12)}`,
        address: counterpartyAddr,
        label,
        chain,
        entityType,
        volumeUsd: Math.max(10, usdValue),
        inflowUsd: isOutflow ? 0 : usdValue,
        outflowUsd: isOutflow ? usdValue : 0,
        taintScore: entityType === 'exploiter' ? 96 : entityType === 'mixer' ? 88 : 22,
        firstSeen: txTimestamp,
        lastActive: txTimestamp,
        notes: `[Live On-Chain Indexer] Verified via ${chain === 'ARB' ? 'Arbitrum' : 'Ethereum'} Blockscout.`,
        dataSource: 'live_onchain',
        tokens: [
          {
            symbol: asset,
            amount: +amount.toFixed(4),
            usdValue: Math.max(10, usdValue),
          },
        ],
        txCount: 1,
        x: Math.cos(angle) * radius,
        y: yPlane,
        z: Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        vz: 0,
      };
      realNodesMap.set(lower, newNode);
      return newNode;
    }

    // 1. Process native ETH & smart contract transactions
    for (const tx of combinedTxs) {
      if (realLinks.length >= limit) break;
      const fromAddr = tx.from?.hash;
      const toAddr = tx.to?.hash;
      if (!fromAddr || !toAddr) continue;

      const isOutflow = fromAddr.toLowerCase() === normalizedCenter;
      const counterpartyAddr = isOutflow ? toAddr : fromAddr;
      if (!counterpartyAddr || counterpartyAddr.toLowerCase() === normalizedCenter) continue;

      const rawVal = BigInt(tx.value || '0');
      const ethAmount = Number(rawVal / BigInt(1e14)) / 10000;
      const usdValue = Math.round(ethAmount * ethPriceUsd);

      const isContract = Boolean(isOutflow ? tx.to?.is_contract : tx.from?.is_contract);
      // Filter out incoming 0-ETH address-poisoning / dusting spam!
      if (!isOutflow && usdValue < 5) continue;
      if (isOutflow && usdValue === 0 && !isContract && !tx.method) continue;

      const name = isOutflow ? tx.to?.name : tx.from?.name;
      const tags = isOutflow ? tx.to?.metadata?.tags : tx.from?.metadata?.tags;
      const txTimestamp = tx.timestamp ? new Date(tx.timestamp).getTime() : now;

      const counterpartyNode = upsertCounterparty(
        counterpartyAddr,
        isOutflow,
        Math.max(15, usdValue),
        'ETH',
        ethAmount,
        txTimestamp,
        isContract,
        name,
        tags
      );

      const srcId = isOutflow ? address : counterpartyNode.id;
      const dstId = isOutflow ? counterpartyNode.id : address;
      const methodName =
        tx.decoded_input?.method_call?.split('(')[0] ||
        tx.method ||
        (isContract ? 'contractCall' : 'transferETH');

      const linkId = `live-tx-${tx.hash.slice(0, 18)}`;
      if (seenLinkIds.has(linkId)) continue;
      seenLinkIds.add(linkId);

      realLinks.push({
        id: linkId,
        txHash: tx.hash,
        source: srcId,
        target: dstId,
        sourceChain: chain,
        targetChain: chain,
        amount: +ethAmount.toFixed(4),
        usdValue: Math.max(15, usdValue),
        asset: 'ETH',
        timestamp: txTimestamp,
        blockNumber: tx.block_number || 21000000,
        gasUsed: parseInt(tx.gas_used || '21000', 10),
        gasPriceGwei: Number(BigInt(tx.gas_price || '20000000000') / BigInt(1e9)),
        feeUsd: 1.5,
        methodName,
        isCrossChain: false,
        isProbabilistic: counterpartyNode.entityType === 'mixer',
        isHighTaint:
          counterpartyNode.entityType === 'exploiter' || counterpartyNode.entityType === 'mixer',
        velocity: 1.2,
        status: tx.result === 'success' || !tx.result ? 'Confirmed' : 'Flagged',
        inputDataHex: tx.raw_input || '0x',
        dataSource: 'live_onchain',
      });
    }

    // 2. Process legitimate ERC-20 Token Transfers (USDC, USDT, DAI, WETH, stETH, WBTC, etc.)
    let tokCount = 0;
    for (const tt of tokItems) {
      if (realLinks.length >= limit) break;
      const sym = (tt.token?.symbol || '').toUpperCase();
      if (!VALID_ERC20_SYMBOLS.has(sym)) continue;
      if (!tt.from?.hash || !tt.to?.hash) continue;

      const isOutflow = tt.from.hash.toLowerCase() === normalizedCenter;
      const counterpartyAddr = isOutflow ? tt.to.hash : tt.from.hash;
      if (!counterpartyAddr || counterpartyAddr.toLowerCase() === normalizedCenter) continue;

      const decimals = Number(tt.total?.decimals || tt.token?.decimals || 18);
      const rawAmt = Number(tt.total?.value || 0) / Math.pow(10, decimals);
      if (rawAmt <= 0) continue;

      const unitPrice =
        Number(tt.token?.exchange_rate) > 0
          ? Number(tt.token!.exchange_rate)
          : sym.includes('BTC')
          ? 85000
          : sym.includes('ETH')
          ? ethPriceUsd
          : 1;
      const usdValue = Math.round(rawAmt * unitPrice);
      // Ignore tiny dust / address-poisoning ERC-20 transfers (< $10)
      if (usdValue < 10) continue;

      const isContract = Boolean(isOutflow ? tt.to?.is_contract : tt.from?.is_contract);
      const name = isOutflow ? tt.to?.name : tt.from?.name;
      const tags = isOutflow ? tt.to?.metadata?.tags : tt.from?.metadata?.tags;
      const txTimestamp = tt.timestamp ? new Date(tt.timestamp).getTime() : now;
      const asset = mapSymbolToAsset(sym);

      const counterpartyNode = upsertCounterparty(
        counterpartyAddr,
        isOutflow,
        usdValue,
        asset,
        rawAmt,
        txTimestamp,
        isContract,
        name,
        tags
      );

      const txHash = tt.transaction_hash || `0x${counterpartyAddr.slice(2).padEnd(64, '0')}`;
      const linkId = `live-erc20-${txHash.slice(0, 14)}-${tokCount++}`;
      if (seenLinkIds.has(linkId)) continue;
      seenLinkIds.add(linkId);

      realLinks.push({
        id: linkId,
        txHash,
        source: isOutflow ? address : counterpartyNode.id,
        target: isOutflow ? counterpartyNode.id : address,
        sourceChain: chain,
        targetChain: chain,
        amount: +rawAmt.toFixed(4),
        usdValue,
        asset,
        timestamp: txTimestamp,
        blockNumber: tt.block_number || 21000000,
        gasUsed: 65000,
        gasPriceGwei: 18,
        feeUsd: 2.1,
        methodName: tt.method || `transfer_${sym}`,
        isCrossChain: false,
        isProbabilistic: counterpartyNode.entityType === 'mixer',
        isHighTaint:
          counterpartyNode.entityType === 'exploiter' || counterpartyNode.entityType === 'mixer',
        velocity: 1.2,
        status: 'Confirmed',
        inputDataHex: '0x',
        dataSource: 'live_onchain',
      });
    }

    // 3. Process internal transactions (critical for EIP-7702 sweeps & smart contract internal ETH drains)
    let internalCount = 0;
    for (const it of internalItems) {
      if (it.success === false) continue;
      if (!it.value || it.value === '0') continue;

      const fromAddr = it.from?.hash;
      const toAddr = it.to?.hash;
      if (!fromAddr || !toAddr) continue;

      const isOutflow = fromAddr.toLowerCase() === normalizedCenter;
      const counterpartyAddr = isOutflow ? toAddr : fromAddr;
      if (!counterpartyAddr || counterpartyAddr.toLowerCase() === normalizedCenter) continue;

      const rawWei = BigInt(it.value);
      const ethAmount = Number(rawWei / BigInt(1e14)) / 10000;
      const usdValue = Math.round(ethAmount * ethPriceUsd);
      if (usdValue < 50) continue;

      const txTimestamp = it.timestamp ? new Date(it.timestamp).getTime() : now;
      const counterpartyNode = upsertCounterparty(
        counterpartyAddr,
        isOutflow,
        usdValue,
        'ETH',
        ethAmount,
        txTimestamp,
        Boolean(isOutflow ? it.to?.is_contract : it.from?.is_contract),
        isOutflow ? it.to?.name : it.from?.name
      );

      const txHash = it.transaction_hash || `0x${counterpartyAddr.slice(2).padEnd(64, '1')}`;
      const linkId = `live-internal-${txHash.slice(0, 14)}-${internalCount++}`;
      if (seenLinkIds.has(linkId)) continue;
      seenLinkIds.add(linkId);

      realLinks.push({
        id: linkId,
        txHash,
        source: isOutflow ? address : counterpartyNode.id,
        target: isOutflow ? counterpartyNode.id : address,
        sourceChain: chain,
        targetChain: chain,
        amount: +ethAmount.toFixed(4),
        usdValue,
        asset: 'ETH',
        timestamp: txTimestamp,
        blockNumber: it.block_number || 26300770,
        gasUsed: 120000,
        gasPriceGwei: 24,
        feeUsd: 4.5,
        methodName: 'Internal Call / EIP-7702 ETH Sweep',
        isCrossChain: false,
        isProbabilistic: false,
        isHighTaint: true,
        velocity: 1.5,
        status: 'Confirmed',
        inputDataHex: '0x',
        dataSource: 'live_onchain',
      });
    }

    if (realNodesMap.size === 0 || realLinks.length === 0) {
      return { realNodes: [], realLinks: [], isLive: false };
    }

    return {
      realNodes: Array.from(realNodesMap.values()),
      realLinks,
      isLive: true,
    };
  } catch {
    return { realNodes: [], realLinks: [], isLive: false };
  }
}
