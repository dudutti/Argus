import { BlockRecord, ForensicLink, ForensicNode } from '../types/forensics';

export type CaseGranularity = 'tactical' | 'full_ledger';

export interface CaseArchiveStats {
  fullNodes: number;
  fullLinks: number;
  tacticalNodes: number;
  tacticalLinks: number;
}

export interface CaseArchiveSlice {
  nodes: ForensicNode[];
  links: ForensicLink[];
  blocks: BlockRecord[];
}

export interface CaseArchivePayload {
  caseId: string;
  generatedAt: string;
  source: string;
  stats: CaseArchiveStats;
  tactical: CaseArchiveSlice;
  fullLedger: CaseArchiveSlice;
}

const archiveMemoryCache = new Map<string, CaseArchivePayload>();

export async function fetchVerifiedCaseArchive(
  caseId: string
): Promise<CaseArchivePayload | null> {
  if (!caseId || caseId === 'custom-blank') return null;

  if (archiveMemoryCache.has(caseId)) {
    return archiveMemoryCache.get(caseId)!;
  }

  try {
    const res = await fetch(`/archives/${caseId}.json`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as CaseArchivePayload;
    if (!data || !data.fullLedger || !Array.isArray(data.fullLedger.nodes)) {
      return null;
    }
    archiveMemoryCache.set(caseId, data);
    return data;
  } catch (err) {
    console.warn(`Failed to load verified archive for ${caseId}:`, err);
    return null;
  }
}

