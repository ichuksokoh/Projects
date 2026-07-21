const KEY = 'selectedManhwaId'

export async function setSelectedManhwa(id: string) {
  await chrome.storage.session.set({ [KEY]: id })
}

export async function setSelectedManhwaBg(id: string) {
  await chrome.runtime.sendMessage({ type: 'set-selected-manhwa', id })
}


export async function getSelectedManhwa(): Promise<string | null> {
  const res = await chrome.storage.session.get(KEY)
  const value = res[KEY]
  return typeof value === 'string' ? value : null
}

export function onSelectedManhwaChange(callback: (id: string | null) => void) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'session' && KEY in changes) {
        const value = changes[KEY].newValue
        callback(typeof value === 'string' ? value : null)
    }
  })
}