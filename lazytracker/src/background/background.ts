// src/background/main.ts
import { cacheCover } from '@/lib/coverCache.svelte'
import { titleSimilarity } from '@/lib/titleMatch'

async function fetchMangadexCover(title: string): Promise<Blob | null> {
  try {
    const searchRes = await fetch(
      `https://api.mangadex.org/manga?${new URLSearchParams({
        title,
        limit: '10',
        'includes[]': 'cover_art',
      })}`
    )
    if (!searchRes.ok) return null
    const searchData = await searchRes.json()
    const results = searchData.data ?? []

    let best: { manga: any; score: number } | null = null

    for (const manga of results) {
      const titleAttrs = manga.attributes?.title ?? {}
      const altTitles = (manga.attributes?.altTitles ?? []).flatMap((alt: object) =>
        Object.values(alt)
      )
      const candidates = [...Object.values(titleAttrs), ...altTitles].filter(Boolean) as string[]

      for (const candidateTitle of candidates) {
        const score = titleSimilarity(title, candidateTitle)
        if (score >= 0.6 && (!best || score > best.score)) {
          best = { manga, score }
        }
      }
    }

    if (!best) return null

    const coverRel = best.manga.relationships?.find((r: any) => r.type === 'cover_art')
    if (!coverRel) return null

    const coverInfoRes = await fetch(`https://api.mangadex.org/cover/${coverRel.id}`)
    if (!coverInfoRes.ok) return null
    const coverInfo = await coverInfoRes.json()
    const fileName = coverInfo.data?.attributes?.fileName
    if (!fileName) return null

    const imageUrl = `https://uploads.mangadex.org/covers/${best.manga.id}/${fileName}`
    const imageRes = await fetch(imageUrl)
    if (!imageRes.ok) return null
    return await imageRes.blob()
  } catch {
    return null
  }
}


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'cache-cover') {
    fetch(msg.url)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`)
        return res.blob()
      })
      .then((blob) => cacheCover(msg.id, blob))
      .then(() => sendResponse({ ok: true, source: 'direct' }))
      .catch(async () => {
        // direct fetch failed — try MangaDex as fallback
        const fallbackBlob = await fetchMangadexCover(msg.title)
        if (fallbackBlob) {
          await cacheCover(msg.id, fallbackBlob)
          sendResponse({ ok: true, source: 'mangadex' })
        } else {
          sendResponse({ ok: false })
        }
      })
    return true
  } else if (msg.type === 'set-selected-manhwa') {
    console.log('[background] setting selected manhwa to', msg.id)
    chrome.storage.session.set({ selectedManhwaId: msg.id })
      .then(() => sendResponse({ ok: true }))
      .catch((err) => {
        console.error('[background] failed to set selected manhwa', err)
        sendResponse({ ok: false })
      })
    return true
  } else if (msg.type === 'open-sidepanel') {
      const windowId = sender.tab?.windowId
      if (windowId !== undefined) {
        chrome.sidePanel
          .open({ windowId })
          .then(() => sendResponse({ ok: true }))
          .catch((err) => {
            console.error('[background] failed to open side panel', err)
            sendResponse({ ok: false })
          })
      } else {
        sendResponse({ ok: false })
      }
      return true
  }
})