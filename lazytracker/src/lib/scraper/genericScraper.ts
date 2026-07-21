// src/lib/scraper/genericScraper.ts
import type { ScrapedManhwa } from '@/types'

const MAX_PLAUSIBLE_CHAPTER = 5000 // generous — real series rarely get near this

export function getMeta(doc: Document, property: string): string | null {
  const el =
    doc.querySelector(`meta[property="${property}"]`) ??
    doc.querySelector(`meta[name="${property}"]`)
  return el?.getAttribute('content')?.trim() || null
}

export function getSeriesSlug(url: string): string {
  const path = new URL(url).pathname
  const segments = path.split('/').filter(Boolean)
  const skip = new Set(['series', 'manga', 'manhwa', 'comic', 'read', 'title', 'chapter'])
  const candidates = segments.filter((s) => !skip.has(s.toLowerCase()) && !/^\d+$/.test(s))
  if (candidates.length === 0) return ''
  return candidates.reduce((a, b) => (b.length > a.length ? b : a))
}

// Matches a chapter number ONLY when it's its own clean path segment,
// e.g. "chapter-244" or ".../chapter/244". Rejects numbers embedded
// inside longer combined segments.
export function extractChapterFromSegments(href: string): number | null {
  let path: string
  try {
    path = new URL(href, location.origin).pathname
  } catch {
    return null
  }
  const segments = path.split('/').filter(Boolean)
  let highest: number | null = null

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    const exact = seg.match(/^chapter[-_]?(\d+(?:[\.\-]\d+)?)$/i)
    if (exact) {
      const num = parseFloat(exact[1].replace('-', '.'))
      if (highest === null || num > highest) highest = num
      continue
    }
    if (/^chapter$/i.test(seg) && segments[i + 1] && /^\d+(\.\d+)?$/.test(segments[i + 1])) {
      const num = parseFloat(segments[i + 1])
      if (highest === null || num > highest) highest = num
    }
  }

  return highest
}

function extractTitle(doc: Document): string {
  const h1 = doc.querySelector('h1')
  let title = ''

  if (h1) {
    const directText = Array.from(h1.childNodes)
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent ?? '')
      .join(' ')
      .trim()
    title = directText || h1.querySelector('*')?.textContent?.trim() || ''
  }

  if (!title) {
    title = (getMeta(doc, 'og:title') ?? doc.title).split('|')[0].trim()
    title = title.replace(/^Read\s+/i, '')
    title = title.replace(/\s*[-–]\s*(Latest Chapters?.*|Free.*|Manga Online.*)$/i, '')
    title = title.replace(/\s+(Manga|Manhwa|Manhua)?\s*Online.*$/i, '')
  }

  return title.split(';')[0].trim()
}

function extractLatestChapter(doc: Document, url: string): number | null {
  const slug = getSeriesSlug(url).toLowerCase()
  const anchors = Array.from(doc.querySelectorAll('a[href]'))
  const scopedAnchors = slug
    ? anchors.filter((a) => (a.getAttribute('href') ?? '').toLowerCase().includes(slug))
    : []

  if (scopedAnchors.length > 0) {
    const candidates: number[] = []
    for (const a of scopedAnchors) {
      const num = extractChapterFromSegments(a.getAttribute('href') ?? '')
      if (num !== null) candidates.push(num)
    }
    if (candidates.length > 0) {
      const plausible = candidates.filter((n) => n <= MAX_PLAUSIBLE_CHAPTER)
      const pool = plausible.length > 0 ? plausible : candidates
      return Math.max(...pool)
    }
  }

  // fallback: unscoped, whole-page, link-text scan (works for Flame, Mangago-style
  // "Ch."/"Vol. N Ch. N" abbreviations, and full-word "Chapter")
  const textPattern = /(?:vol\.?\s*\d+\s*)?(?:chapter|ch\.?)\s*(\d+(?:\.\d+)?)/i
  let highest: number | null = null
  for (const a of anchors) {
    const text = a.textContent?.trim()
    if (!text) continue
    const match = text.match(textPattern)
    if (!match) continue
    const num = parseFloat(match[1])
    if (num > MAX_PLAUSIBLE_CHAPTER) continue
    if (highest === null || num > highest) highest = num
  }
  return highest
}

function extractDescription(doc: Document, title: string): string | null {
  const raw = getMeta(doc, 'og:description')
  if (!raw) return null

  const colonIdx = raw.indexOf(':')
  if (colonIdx > -1 && colonIdx < 80) {
    const prefix = raw.slice(0, colonIdx).toLowerCase()
    const firstTitleWord = title.toLowerCase().split(' ')[0]
    if (firstTitleWord && prefix.includes(firstTitleWord)) {
      return raw.slice(colonIdx + 1).trim()
    }
  }

  return raw.trim()
}

function extractImage(doc: Document): string | null {
  const box = doc.querySelector('div > [itemprop="image"]')
  if (!box) return null
  const img = box.cloneNode(true) as HTMLElement
  const actualImg = img?.querySelector('img')
  return actualImg?.getAttribute('src') || null
}
export function scrapeGeneric(doc: Document, url: string): Omit<ScrapedManhwa, 'chapters'> {
  const title = extractTitle(doc)
  return {
    title,
    coverUrl: extractImage(doc) || getMeta(doc, 'og:image') || null,
    description: extractDescription(doc, title),
    latestChapter: extractLatestChapter(doc, url),
    sourceUrl: url,
  }
}