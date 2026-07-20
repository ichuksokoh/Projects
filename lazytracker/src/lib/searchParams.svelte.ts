const KEY = 'searchQuery'
const KEY2 = 'showFavoritesOnly'
const KEY3 = 'statusFilter'

//Handles Persisting Search Query, Show Favorites Only, and Status Filter in Chrome Storage

export async function setSearchQuery(query: string) {
  await chrome.storage.session.set({ [KEY]: query })
}

export async function getSearchQuery(): Promise<string> {
  const res = await chrome.storage.session.get(KEY)
  const value = res[KEY]
  return typeof value === 'string' ? value : ''
}

export function onSearchQueryChange(callback: (query: string) => void) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'session' && KEY in changes) {
      const value = changes[KEY].newValue
      callback(typeof value === 'string' ? value : '')
    }
  })
}


export async function setShowFavoritesOnly(show: boolean) {
  await chrome.storage.session.set({ [KEY2]: show })
}

export async function getShowFavoritesOnly(): Promise<boolean> {
  const res = await chrome.storage.session.get(KEY2)
  const value = res[KEY2]
  return typeof value === 'boolean' ? value : false
}

export function onShowFavoritesOnlyChange(callback: (show: boolean) => void) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'session' && KEY2 in changes) {
      const value = changes[KEY2].newValue
      callback(typeof value === 'boolean' ? value : false)
    }
  })
}

export async function setStatusFilter(status: string) {
  await chrome.storage.session.set({ [KEY3]: status })
}

export async function getStatusFilter(): Promise<string> {
  const res = await chrome.storage.session.get(KEY3)
  const value = res[KEY3]
  return typeof value === 'string' ? value : 'All'
}

export function onStatusFilterChange(callback: (status: string) => void) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'session' && KEY3 in changes) {
      const value = changes[KEY3].newValue
      callback(typeof value === 'string' ? value : 'All')
    }
  })
}