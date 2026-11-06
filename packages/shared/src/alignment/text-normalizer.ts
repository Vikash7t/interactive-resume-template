/**
 * High-performance deterministic text normalization and n-gram extraction.
 * Safeguards technical tokens (C++, C#, .NET, CI/CD, Node.js) against naive regex stripping.
 */

const PROTECTED_TOKENS: { pattern: RegExp; placeholder: string; original: string }[] = [
  { pattern: /\bc\+\+/gi, placeholder: '__TOKEN_CPP__', original: 'c++' },
  { pattern: /\bc#/gi, placeholder: '__TOKEN_CSHARP__', original: 'c#' },
  { pattern: /\.net\b/gi, placeholder: '__TOKEN_DOTNET__', original: '.net' },
  { pattern: /\bci\/cd\b/gi, placeholder: '__TOKEN_CICD__', original: 'ci/cd' },
  { pattern: /\bnode\.js\b/gi, placeholder: '__TOKEN_NODEJS__', original: 'node.js' },
  { pattern: /\bnext\.js\b/gi, placeholder: '__TOKEN_NEXTJS__', original: 'next.js' },
  { pattern: /\bvue\.js\b/gi, placeholder: '__TOKEN_VUEJS__', original: 'vue.js' },
  { pattern: /\bnest\.js\b/gi, placeholder: '__TOKEN_NESTJS__', original: 'nest.js' },
];

/**
 * Normalizes text while preserving crucial engineering terms.
 */
export function normalizeText(rawText: string): string {
  if (!rawText) return '';

  let normalized = rawText.toLowerCase();

  // 1. Substitute protected tokens
  for (const token of PROTECTED_TOKENS) {
    normalized = normalized.replace(token.pattern, token.placeholder);
  }

  // 2. Replace punctuation with spaces (excluding alphanumeric and underscores)
  normalized = normalized.replace(/[^\w\s-]/g, ' ');

  // 3. Restore protected tokens
  for (const token of PROTECTED_TOKENS) {
    const re = new RegExp(token.placeholder, 'g');
    normalized = normalized.replace(re, token.original);
  }

  // 4. Collapse consecutive whitespace
  return normalized.replace(/\s+/g, ' ').trim();
}

/**
 * Splits text into individual words/tokens while preserving protected phrases.
 */
export function tokenize(rawText: string): string[] {
  const normalized = normalizeText(rawText);
  if (!normalized) return [];
  return normalized.split(' ').filter(Boolean);
}

/**
 * Generates n-grams (1, 2, 3, 4 words) from text to capture multi-word skills
 * like "Amazon Web Services", "Distributed Systems", "Continuous Integration".
 */
export function extractNgrams(rawText: string, maxN = 4): Set<string> {
  const tokens = tokenize(rawText);
  const ngrams = new Set<string>();

  for (let n = 1; n <= maxN; n++) {
    for (let i = 0; i <= tokens.length - n; i++) {
      const phrase = tokens.slice(i, i + n).join(' ');
      if (phrase.length > 1) {
        ngrams.add(phrase);
      }
    }
  }

  return ngrams;
}
