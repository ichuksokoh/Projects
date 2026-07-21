<script lang='ts'>
  import { manhwaStore } from '@/lib/manhwaStore.svelte'
  import { getSelectedManhwa, onSelectedManhwaChange } from '@/lib/selectedManhwa.svelte'
  import { retrieveCover, deleteCachedCover } from '@/lib/coverCache.svelte'
  import type { Manhwa } from '@/types'
  import Button from '@/components/Button.svelte';
  import FavoriteButton from '@/components/FavoriteButton.svelte';
  import HideButton from '@/components/HideButton.svelte'
  import ProgressBar from '@/components/ProgressBar.svelte';
  import StatusBar from '@/components/StatusBar.svelte';
  import  ChapterDropdown  from '@/components/ChapterDropdown.svelte'
  import DescriptionDrawer from '@/components/DescriptionDrawer.svelte';
  import Rating from '@/components/Rating.svelte';
  import RatingBar from '@/components/RatingBar.svelte';
  import GoToBtn from '@/components/GoToBtn.svelte';
  import AlertBox from '@/components/AlertBox.svelte'
  
  // tracks open/close status of the side panel, to avoid opening multiple instances of it
  chrome.runtime.connect({ name: 'sidepanel-heartbeat' })
  chrome.windows.getCurrent().then((win) => {
  if (win.id === undefined) return
    const port = chrome.runtime.connect({ name: 'sidepanel-heartbeat' })
    port.postMessage({ windowId: win.id })
  })

  // Handling of Selected Manhwa from Popup library view to Side Panel view
  let selectedId = $state<string | null>(null)

  let selectedManhwa = $derived<Manhwa | undefined>(
    manhwaStore.list.find((m) => m.id === selectedId)
  )
  
  const cover = retrieveCover(() => selectedManhwa)

  $effect(() => {
    getSelectedManhwa().then((id) => {
      selectedId = id
    })
  })
  
  onSelectedManhwaChange((id) => {
    selectedId = id
  })
  
  // Handling of Chapter Selection and Status Update
  function handleChapterSelect(chapterNumber: number) {
    if (selectedManhwa) {
      const chapters = selectedManhwa.chapters.map((chp) =>
      chp.number <= chapterNumber ? { ...chp, read: true } : {...chp, read: false }
    )
    
    manhwaStore.update(selectedManhwa.id, { currentChapter: chapterNumber, 
      updatedAt: Date.now(), status: 'Reading', chapters: chapters })
    }
  }
  
  // Function to delete a manhwa and its cached cover
  async function deleteManhwa(id: string) {
    if (!id || id === '') return
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.windowId) {
      await chrome.sidePanel.close({ windowId: tab.windowId })
    }
    await deleteCachedCover(id)
    await manhwaStore.remove(id)
  }
  
  // Status management
  const statusValues = ['Plan To Read', 'Reading', 'Completed', 'Dropped'] as const
  
  let selectedStatus = $derived(selectedManhwa?.status ?? 'Plan To Read')
  
  function handleStatusSelect(label: string) {
    if (selectedManhwa && (statusValues as readonly string[]).includes(label)) {
      manhwaStore.update(selectedManhwa.id, { status: statusValues.find((s) => s === label), updatedAt: Date.now() })
    }
  }
  
  // Favorite management
  async function toggleFavorite() {
    if (selectedManhwa) {
      await manhwaStore.update(selectedManhwa.id, { 
        favorite: !selectedManhwa.favorite, 
        updatedAt: Date.now() 
      })
    }
  }
  
  // Function to open the manhwa's URL in a new tab
  async function openManhwaUrl() {
    if (selectedManhwa && selectedManhwa.sourceUrl) {
      await chrome.tabs.create({ url: selectedManhwa.sourceUrl })
    }
  }
  
  
  // Function to toggle the description drawer open/closed
  function toggleDescription(next: boolean) {
    if (selectedManhwa) {
      manhwaStore.update(selectedManhwa.id, { descriptionOpen: next })
    }
  }
  
  // Function to handle rating selection
  function handleRatingSelect(value: number) {
    if (selectedManhwa) {
      manhwaStore.update(selectedManhwa.id, { rating: value, updatedAt: Date.now() })
    }
  }
  
  function titleFontSize(title: string): string {
    const len = title.length
    if (len > 60) return '15px'
    if (len > 40) return '17px'
    if (len > 25) return '20px'
    return '24px'
  }
  
  async function openPopup() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.windowId) {
      await chrome.action.openPopup({ windowId: tab.windowId })
      chrome.sidePanel.close({windowId: tab.windowId})
    }
  }


  let showDeleteConfirm = $state(false)
   async function toggleHidden() {
    if (selectedManhwa) {
      await manhwaStore.update(selectedManhwa.id, {
        hidden: !selectedManhwa.hidden,
        updatedAt: Date.now(),
      })
    }
  }
</script>
<AlertBox
  bind:open={showDeleteConfirm}
  title="Delete manhwa?"
  confirmLabel="Delete"
  confirmColorFrom="#7f1d1d"
  confirmColorTo="#450a0a"
  onConfirm={() => deleteManhwa(selectedManhwa?.id ?? '')}
>
  This will remove <strong>{selectedManhwa?.title}</strong> and its cached cover from your library. This can't be undone.
</AlertBox>
{#snippet linkToSvg()}
<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 13 L18 19 A2 2 0 0 1 16 21 L5 21 A2 2 0 0 1 3 19 L3 8 A2 2 0 0 1 5 6 L11 6" />
    <path d="M15 3 L21 3 L21 9" />
    <path d="M10 14 L21 3" />
  </svg>
{/snippet}
<!-- <div> -->
  <div class="manhwa_info">
    {#if selectedManhwa}
      <div class="title-row">
        <h1 style="font-size: {titleFontSize(selectedManhwa.title)};">{selectedManhwa.title}</h1>
      </div>

      <div class="cover-wrap">
        {#if cover.url}
          <img src={cover.url} alt={selectedManhwa.title} loading="lazy" />
        {:else}
          <div class="cover-placeholder">No Cover</div>
        {/if}
      </div>

      <div class="controls-stack">
        <RatingBar rating={selectedManhwa.rating} onSelect={handleRatingSelect} />
        <ProgressBar manhwa={selectedManhwa} />
        <StatusBar labels={statusValues} selected={selectedStatus} onSelect={handleStatusSelect} />
        <!-- <Rating rating={selectedManhwa.rating} onSelect={handleRatingSelect} /> -->
        <div class="controls-row">
          <GoToBtn label="Read at" onClick={openManhwaUrl} icon={linkToSvg} />
          <ChapterDropdown manhwa={selectedManhwa} onSelect={handleChapterSelect} />
          <FavoriteButton favorite={selectedManhwa.favorite ?? false} onToggle={toggleFavorite} />
          <HideButton hidden={selectedManhwa.hidden ?? false} onToggle={toggleHidden} />
        </div>
        {#if selectedManhwa.description}
          <DescriptionDrawer
            description={selectedManhwa.description}
            open={selectedManhwa.descriptionOpen ?? false}
            onToggle={toggleDescription}
          />
        {/if}
        <div class="button-row">
          <Button label="Open Library" colorFrom="#1e293b" colorTo="#334155" onclick={openPopup} />
          <Button label="Delete" colorFrom="#7f1d1d" colorTo="#450a0a" onclick={() => showDeleteConfirm = true} />
        </div>
      </div>
    {:else}
      <p class="no-manhwa">No Manhwa Selected</p>
    {/if}
  </div>
<!-- </div> -->

<style>
  .manhwa_info {
    max-width: 100%;
    /* max-height: 100%; */
    height: 100vh;
    overflow-y: auto;
    padding: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* scrollbar-width: thin;
    scrollbar-color: #475569 transparent; */
  }
  
  .manhwa_info::-webkit-scrollbar {
    width: 0px;
  }

  .manhwa_info::-webkit-scrollbar-track {
    background: transparent;
  }

  .manhwa_info::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 999px;
    width: 0px;
  }

  .manhwa_info::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(90deg, #41439d, #5a63ad); 
  }

  .title-row {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px 4px;
  }

  .title-row h1 {
    margin: 0;
    text-align: center;
    line-height: 1.25;
    word-break: break-word;
    
  }

  .cover-wrap {
    max-width: 320px;
  }
  .cover-wrap img {
    width: 100%;
    max-width: 400px;
    max-height: 550px;
    height: auto;
    border-radius: 8px;

  }

  .cover-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #475569;
    font-size: 24px;
  }

  .controls-stack {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 14px 0;
    padding:0 4px;
    max-width: 450px;
  }
  .controls-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  .button-row {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

  .no-manhwa {
    text-align: center;
    color: #ffffff;
    font-size: 16px;
    font-weight: 400;
    margin-top: 40px;
  }
</style>