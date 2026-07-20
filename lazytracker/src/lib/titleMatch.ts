function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function bigrams(str: string): string[] {
  const s = str.replace(/\s+/g, '') // bigrams across the whole string, ignoring spaces
  const pairs: string[] = []
  for (let i = 0; i < s.length - 1; i++) {
    pairs.push(s.slice(i, i + 2))
  }
  return pairs
}

// Sørensen–Dice coefficient: 2 * |shared bigrams| / (|bigrams1| + |bigrams2|)
// Returns 0 (no similarity) to 1 (identical)
export function titleSimilarity(a: string, b: string): number {
  const normA = normalizeTitle(a)
  const normB = normalizeTitle(b)

  if (normA === normB) return 1
  if (normA.length < 2 || normB.length < 2) return 0

  const bigramsA = bigrams(normA)
  const bigramsB = bigrams(normB)

  const bagB = new Map<string, number>()
  for (const bg of bigramsB) bagB.set(bg, (bagB.get(bg) ?? 0) + 1)

  let shared = 0
  for (const bg of bigramsA) {
    const count = bagB.get(bg) ?? 0
    if (count > 0) {
      shared++
      bagB.set(bg, count - 1) // consume it so duplicate bigrams don't double-count
    }
  }

  return (2 * shared) / (bigramsA.length + bigramsB.length)
}

export function findBestTitleMatch(
  target: string,
  candidates: { titles: string[]; data: unknown }[],
  threshold = 0.6
): unknown | null {
  let best: { data: unknown; score: number } | null = null

  for (const candidate of candidates) {
    for (const title of candidate.titles) {
      const score = titleSimilarity(target, title)
      if (score >= threshold && (!best || score > best.score)) {
        best = { data: candidate.data, score }
      }
    }
  }

  return best?.data ?? null
}