/**
 * Utility to decode Ethereum hexadecimal call data input into human-readable UTF-8 text
 * Used to extract hacker negotiation messages, ASCII art, and on-chain declarations.
 */
export function decodeHexToUtf8(hex?: string): string | null {
  if (!hex || typeof hex !== 'string' || hex.length < 10) return null;
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  try {
    let str = '';
    for (let i = 0; i < cleanHex.length; i += 2) {
      const code = parseInt(cleanHex.substring(i, i + 2), 16);
      if (code >= 32 && code <= 126) {
        str += String.fromCharCode(code);
      } else if (code === 10 || code === 13) {
        str += ' ';
      }
    }
    const trimmed = str.trim();
    if (trimmed.length > 5 && /[a-zA-Z]{3,}/.test(trimmed)) {
      return trimmed;
    }
    return null;
  } catch {
    return null;
  }
}

