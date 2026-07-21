const KEY = 'searchQuery'
const KEY2 = 'showFavoritesOnly'
const KEY3 = 'statusFilter'
const KEY4 = 'HiddenFilter'
const KEY5 = 'HiddenManhwaCount'

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

export async function setHiddenFilter(hidden: boolean) {
  await chrome.storage.session.set({ [KEY4]: hidden })
}

export async function getHiddenFilter(): Promise<boolean> {
  const res = await chrome.storage.session.get(KEY4)
  const value = res[KEY4]
  return typeof value === 'boolean' ? value : false
}

export function onHiddenFilterChange(callback: (hidden: boolean) => void) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'session' && KEY4 in changes) {
      const value = changes[KEY4].newValue
      callback(typeof value === 'boolean' ? value : false)
    }
  })
}


// Uses local storage instead of session storage because this is a preference that should persist across sessions
export function setHiddenManhwaCount(count: boolean) {
  chrome.storage.local.set({ [KEY5]: count })
}

export async function getHiddenManhwaCount(): Promise<boolean> {
  const res = await chrome.storage.local.get(KEY5)
  const value = res[KEY5]
  return typeof value === 'boolean' ? value : false
}

export function onHiddenManhwaCountChange(callback: (count: boolean) => void) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'session' && KEY5 in changes) {
      const value = changes[KEY5].newValue
      callback(typeof value === 'boolean' ? value : false)
    }
  })
}