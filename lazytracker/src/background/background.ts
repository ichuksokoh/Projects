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


async function handleMessage(msg: any, sender: chrome.runtime.MessageSender) {
  if (msg.type === 'cache-cover') {
    try {
      const res = await fetch(msg.url);
      if (!res.ok) throw new Error(`${res.status}`);
      const blob = await res.blob();
      await cacheCover(msg.id, blob);
      return { ok: true, source: 'direct' };
    } catch {
      const fallbackBlob = await fetchMangadexCover(msg.title);
      if (fallbackBlob) {
        await cacheCover(msg.id, fallbackBlob);
        return { ok: true, source: 'mangadex' };
      }
      return { ok: false };
    }
  }

  if (msg.type === 'set-selected-manhwa') {
    try {
      console.log('[background] setting selected manhwa to', msg.id);
      await chrome.storage.session.set({ selectedManhwaId: msg.id });
      return { ok: true };
    } catch (err) {
      console.error('[background] failed to set selected manhwa', err);
      return { ok: false };
    }
  }
  if (msg.type === 'open-sidepanel') {
    const windowId = sender.tab?.windowId
    if (windowId === undefined) return {ok : false}
    await chrome.sidePanel.open({ windowId })
    console.log('[background] side panel opened in window', windowId)
    return {ok : true, status: 'opened'}
  }
  if (msg.type === 'is-sidepanel-open') {
    const windowId = sender.tab?.windowId
    if (windowId === undefined) return {ok : false}
    const res = await chrome.storage.session.get(`sidePanelOpen:${windowId}`)
    const isOpen = res[`sidePanelOpen:${windowId}`] // boolean value
    return isOpen ? {ok : true, status: 'already-open'} : {ok : false, status: 'not-open'}
  } 
}

// Listen for messages from content scripts or other parts of the extension
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  handleMessage(msg, sender)
    .then((response) => sendResponse(response))
    .catch(() => sendResponse({ ok: false }));
    
  return true; // Keeps the message channel open
});


chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'sidepanel-heartbeat') return

  let boundWindowId: number | null = null

  port.onMessage.addListener((msg) => {
    if (typeof msg.windowId === 'number') {
      boundWindowId = msg.windowId
      chrome.storage.session.set({ [`sidePanelOpen:${msg.windowId}`]: true })
    }
  })

  port.onDisconnect.addListener(() => {
    if (boundWindowId !== null) {
      chrome.storage.session.set({ [`sidePanelOpen:${boundWindowId}`]: false })
    }
  })
})
