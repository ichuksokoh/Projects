<script lang="ts">
  import { scrapeCurrentPage } from '@/lib/scraper'
  import { manhwaStore } from '@/lib/manhwaStore.svelte'
  import type { Manhwa } from '@/types'
  import AlertBox from '@/components/AlertBox.svelte'
  import ViewLib from '@/content/views/ViewLib.svelte'

  let show = $state(false)
  let added = $state(false)
  let loading = $state(false)
  let error = $state<string | null>(null)
  

   function getManhwaTitle() {
    try {
      const scraped = scrapeCurrentPage()
      return scraped.title
    } catch (e) {
      console.error('[manhwa tracker] failed to scrape title', e)
      return null
    }
  }

  const title = $derived(getManhwaTitle())
  async function addManhwa() {
    if (added || loading) return
    loading = true
    error = null

    try {
      const scraped = scrapeCurrentPage()

      const manhwa: Manhwa = {
        id: crypto.randomUUID(),
        title: scraped.title,
        sourceUrl: scraped.sourceUrl,
        coverUrl: scraped.coverUrl ?? undefined,
        description: scraped.description ?? undefined,
        status: 'Plan To Read',
        currentChapter: scraped.chapters.length > 0 ? scraped.chapters[0].number : 0,
        totalChapters: scraped.latestChapter ?? undefined,
        chapters: scraped.chapters,
        tags: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      await manhwaStore.add(manhwa)
      added = true
      if (manhwa.coverUrl) {
        const response = await chrome.runtime.sendMessage({
          type: 'cache-cover',
          id: manhwa.id,
          url: manhwa.coverUrl,
          title: manhwa.title, // needed for the MangaDex search fallback
        })
        if (response?.ok) {
          console.log('[background] cover cached successfully for', manhwa.title, 'source: ', response?.source)
        } else {
          console.warn('[background] failed to cache cover for', manhwa.title)
        }
      }
    } catch (e) {
      error = 'Failed to add — try again'
      console.error('[manhwa tracker] add failed', e)
    } finally {
      loading = false
    }
  }
</script>
<AlertBox
  bind:open={show}
  title="Add to Library?"
  confirmLabel="Add"
  confirmColorFrom="#4338ca"
  confirmColorTo="#3730a3"
  onConfirm={addManhwa}
>
  <span class="title-add">{title}</span>
</AlertBox>
{#if !added}
  <div class="popup-container">
  <button class="toggle-button" onclick={() => (show = !show)}>
    <!-- <img src={Logo} alt="Toggle tracker" class="button-icon" /> -->
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="add-icon">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
    <span>Add to Library</span>
  </button>
</div>
{/if}
{#if added}
  <ViewLib/>
{/if}

<style>
  .popup-container {
    position: fixed;
    left: 0;
    bottom: 0;
    margin: 20px;
    z-index: 100;
    display: flex;
    align-items: flex-end;
    font-size: 16px;
    font-family: ui-sans-serif, system-ui, sans-serif;
    user-select: none;
    line-height: 1;
    box-sizing: border-box;
  }

  .popup-container * {
    box-sizing: border-box; /* force it for all descendants, regardless of host page resets */
  }

  .toggle-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 40px;
    border-radius: 9999px;
    overflow: hidden;
    box-shadow:
      0 1px 3px 0 rgb(0 0 0 / 0.1),
      0 1px 2px -1px rgb(0 0 0 / 0.1);
    cursor: pointer;
    border: none;
    background: linear-gradient(0, #a157dd72, #4338ca);
    padding: 0;
    flex-shrink: 0; /* prevent flex from squishing the button if content is wide */
    transition: background-color 550ms ease, box-shadow 150ms ease;
  }

  .toggle-button:hover {
    background-color: #9289cf;
  }

  .add-icon {
    width: 24px;
    height: 24px;
    padding: 4px;
    object-fit: contain;
    display: block; /* kills the small baseline gap inline images get by default */
  }

  .title-add {
    display: flex;
    align-items: center;
    justify-content: center;
    /* text-align: center; */
    font-size: 14px;
    font-weight: 600;
    margin-left: 8px;
    color: white;
  }
</style>