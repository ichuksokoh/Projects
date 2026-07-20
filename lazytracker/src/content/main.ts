// src/content/main.ts
import { mount, unmount } from 'svelte'
import App from './views/App.svelte'
import ViewLib from './views/ViewLib.svelte'
import { looksLikeSeriesPage, scrapeCurrentPage } from '@/lib/scraper/index'
import { manhwaStore } from '@/lib/manhwaStore.svelte'
import type { ScrapedChapter } from '@/types'

let currentApp: ReturnType<typeof mount> | null = null
let mountedForUrl: string | null = null // only set once we've actually acted on a URL
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Update manhwa that is stored already
async function updateExistingManhwa() {
  const url = window.location.href
  const scraped = scrapeCurrentPage()

  if (!scraped.title) return

  const existingManhwa = await manhwaStore.getManhwaBySourceUrl(url)
  if (!existingManhwa) return
  if (existingManhwa.chapters.length >= scraped.chapters.length) return // no new chapters to update
  

  const chpCompare = (a: ScrapedChapter, b: ScrapedChapter) => {
    const eqNum = a.number === b.number
    const eqUrl = a.url === b.url
    const eqLabel = a.label === b.label
    return eqNum && eqUrl && eqLabel
  }

  // If any of the existing chapters are different from the scraped chapters, we don't update
  if (existingManhwa.chapters.filter((ch, i) => chpCompare(ch, scraped.chapters[i])).length !== 0) {
    return
  }

  // Only update if all the new chapters are new (not already in the existing chapters)
  let onlyNewChps = true
  for (let i = existingManhwa.chapters.length; i < scraped.chapters.length; i++) {
    if (existingManhwa.chapters.find(ch => chpCompare(ch, scraped.chapters[i]))) {
      onlyNewChps = false
      break
    }
  }

  if (onlyNewChps) {
    const updatedManhwa = {
      ...existingManhwa,
      totalChapters: scraped.latestChapter ?? existingManhwa.totalChapters,
      chapters: scraped.chapters ?? existingManhwa.chapters,
      updatedAt: Date.now(),
    }
  
    await manhwaStore.update(existingManhwa.id, updatedManhwa)
  }
}


// For addding to Library
async function evaluateAndMount() {
  const url = window.location.href

  // avoid redundant teardown/remount if we already handled this exact URL
  if (url === mountedForUrl) return

  const container = document.getElementById('crxjs-app')
  if (currentApp) {
    unmount(currentApp)
    currentApp = null
  }
  container?.remove()

  if (!looksLikeSeriesPage()) {
    // don't lock mountedForUrl here — content may still be loading;
    // let future debounced calls keep re-checking this same URL
    mountedForUrl = null
    return
  }

  const manhwaExists = await manhwaStore.getManhwaBySourceUrl(url)
  if (manhwaExists) {
    console.log('Updating existing manhwa in store...')
    await updateExistingManhwa()
    mountedForUrl = url // genuinely resolved: already tracked, stop re-checking
    // mount the library view instead of the add-to-library view
    const newContainer = document.createElement('div')
    newContainer.id = 'crxjs-app'
    document.body.appendChild(newContainer)
    currentApp = mount(ViewLib, { target: newContainer })
    return
  }

  const newContainer = document.createElement('div')
  newContainer.id = 'crxjs-app'
  document.body.appendChild(newContainer)
  currentApp = mount(App, { target: newContainer })
  mountedForUrl = url // genuinely resolved: mounted successfully
}

function scheduleEvaluate() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(evaluateAndMount, 400)
}

// initial mount
scheduleEvaluate()

const observer = new MutationObserver(() => {
  scheduleEvaluate()
})

observer.observe(document.body, { childList: true, subtree: true })

