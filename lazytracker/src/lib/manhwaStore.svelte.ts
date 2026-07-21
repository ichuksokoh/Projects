import type { Manhwa } from '@/types'
import { titleSimilarity } from './titleMatch'

let list = $state<Manhwa[]>([])

function persist() {
  return chrome.storage.local.set({ manhwaList: $state.snapshot(list) })
}

// hydrate on load
chrome.storage.local.get<{ manhwaList: Manhwa[] }>({ manhwaList: [] }).then((res) => {
  const stored = res.manhwaList
  list = Array.isArray(stored) ? stored : []
})

// stay in sync when ANY context (popup/sidepanel/content) changes it
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.manhwaList) {
    const val = changes.manhwaList.newValue
    list = Array.isArray(val) ? (val as Manhwa[]) : []
  }
})

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}



export const manhwaStore = {
  get list() {
    return list
  },
  async add(item: Manhwa) {
    list = [...list, item]
    await persist()
  },
  async update(id: string, patch: Partial<Manhwa>) {
    list = list.map((m) => (m.id === id ? { ...m, ...patch } : m))
    await persist()
  },
  async remove(id: string) {
    list = list.filter((m) => m.id !== id)
    await persist()
  },
  async getById(id: string) {
    return list.find((m) => m.id === id)
  },
  async getManhwaBySourceUrl(url: string) {
    return list.find((m) => m.sourceUrl === url)
  },
  async clear() {
    list = []
    await persist()
  },
  async getManhwaByTitleOnHost(title: string, url: string, threshold = 0.85) {
    const host = getHostname(url)
    if (!host) return undefined

    let best: { manhwa: Manhwa; score: number } | undefined
    for (const m of list) {
      if (getHostname(m.sourceUrl) !== host) continue
      const score = titleSimilarity(title, m.title)
      if (score >= threshold && (!best || score > best.score)) {
        best = { manhwa: m, score }
      }
    }
    return best?.manhwa
  },
}