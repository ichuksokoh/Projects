// src/lib/scraper/adapters.ts
import type { ScrapedManhwa } from '@/types'

type Adapter = (doc: Document, url: string) => Partial<ScrapedManhwa>

export const adapters: Record<string, Adapter> = {
  'natomanga.com': (doc) => {
    const box = doc.querySelector('#contentBox')
    if (!box) return {}
    const clone = box.cloneNode(true) as HTMLElement
    clone.querySelectorAll('h2').forEach((h) => h.remove())
    return { description: clone.textContent?.trim() || null }
  },
  'drakecomic.org': (doc) => {
    // gets description
    const box = doc.querySelector('div > [itemprop="description"]')
    if (!box) return {}
    const desc = box.cloneNode(true) as HTMLElement

    //gets image
    const img = doc.querySelector('div > [itemprop="image"]')
    const actualImg = img?.querySelector('img')
    return { description: desc.textContent?.trim() || null, coverUrl: actualImg?.getAttribute('src') || null }
  },
  'asurascans.com': (doc) => {
    const box = doc.querySelector('div > #description-text')
    if (!box) return {}
    const desc = box.cloneNode(true) as HTMLElement
    return { description: desc.textContent?.trim() || null }
  },
  'rizzfables.com': (doc) => {
    const box = doc.querySelector('div > [itemprop="image"]')
    if (!box) return {}
    const img = box.cloneNode(true) as HTMLElement
    const actualImg = img?.querySelector('img')
    return { coverUrl: actualImg?.getAttribute('src') || null }
  }
  

}