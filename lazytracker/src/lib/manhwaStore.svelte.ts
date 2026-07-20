import type { Manhwa } from '@/types'

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

export const manhwaStore = {
  // ready,
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
  // manhwaInList(url: string) {
  //   return list.some((m) => m.sourceUrl === url)
  // }
}