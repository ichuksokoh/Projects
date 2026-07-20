<script lang='ts'>
  import { manhwaStore } from '@/lib/manhwaStore.svelte'
  import { getSelectedManhwa, onSelectedManhwaChange } from '@/lib/selectedManhwa.svelte'
  import { retrieveCover, deleteCachedCover } from '@/lib/coverCache.svelte'
  import type { Manhwa } from '@/types'
  import Button from '@/components/Button.svelte';
  import FavoriteButton from '@/components/FavoriteButton.svelte';
  import ProgressBar from '@/components/ProgressBar.svelte';
  import StatusBar from '@/components/StatusBar.svelte';
  import  ChapterDropdown  from '@/components/ChapterDropdown.svelte'
  import DescriptionDrawer from '@/components/DescriptionDrawer.svelte';
  import Rating from '@/components/Rating.svelte';
  import RatingBar from '@/components/RatingBar.svelte';
  import GoToBtn from '@/components/GoToBtn.svelte';
  import AlertBox from '@/components/AlertBox.svelte'
  
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
  
  let currentChpLabel = $derived(
    selectedManhwa?.chapters.find((c) => c.number === selectedManhwa.currentChapter)?.label ??
    ` ${selectedManhwa?.chapters[0]?.label ?? 'N/A'}`
  )
  
  let totalChpLabel = $derived(
    selectedManhwa?.chapters[selectedManhwa.chapters.length - 1]?.label ?? 'N/A'
  )
  
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
<div>
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
</div>

<style>
  .manhwa_info {
    max-width: 350px;
    max-height: 100%;
    overflow-y: auto;
    padding: 4px;
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

  .cover-wrap img {
    width: 100%;
    height: auto;
    max-height: 475px;
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