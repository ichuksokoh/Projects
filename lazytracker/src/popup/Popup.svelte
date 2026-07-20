<script lang="ts">
  import type { Manhwa } from '@/types'
  import { manhwaStore } from '@/lib/manhwaStore.svelte'
  import { setSelectedManhwa } from '@/lib/selectedManhwa.svelte'
  import * as queries from '@/lib/searchParams.svelte'
  import { titleSimilarity } from '@/lib/titleMatch'
  import Card from '@/components/Card.svelte'
  import StatusBar from '@/components/StatusBar.svelte'
  import FavoriteButton from '@/components/FavoriteButton.svelte';
  import Button from '@/components/Button.svelte';

  let searchQuery = $state('')
  let debouncedQuery = $state('')    // updates after typing pauses, drives the filter
  let isSearching = $state(false)    // true during the "waiting to settle" window
  let status = $state('All') // 'All', 'Reading', 'Plan To Read', 'Completed', 'Dropped'
  const statusValues = ['All', 'Plan To Read', 'Reading', 'Completed', 'Dropped'] as const
  let showFavoritesOnly = $state(false)
  let hideManwhaCount = $state(false) // hide the total manhwa count in the popup view

  // Front-end Client side filtering of the manhwa list based on search query, status filter, and favorites filter
  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

  function handleSearchInput(e: Event) {
    const value = (e.currentTarget as HTMLInputElement).value
    searchQuery = value
    isSearching = true

    if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
    searchDebounceTimer = setTimeout(() => {
      debouncedQuery = value
      isSearching = false
      queries.setSearchQuery(value) // persist to session storage once settled
    }, 250)
  }
  
  const compare = (a: Manhwa) => {
    const titleSim = titleSimilarity(a.title, debouncedQuery)
    const titleIncludes = a.title.toLowerCase().includes(debouncedQuery.toLowerCase())
    const statusMatches = status === 'All' || a.status === status
    const favoriteMatches = !showFavoritesOnly || a.favorite
    return (titleSim >= 0.6 || titleIncludes) && statusMatches && favoriteMatches
  }
  let filtered = $derived(
    manhwaStore.list.filter((m) => compare(m))
    .sort((a, b) => a.title.localeCompare(b.title))
  )

  function handleStatusSelect(label: string) {
    status = label
    queries.setStatusFilter(label)
  }

  function handleShowFavoritesToggle() {
    showFavoritesOnly = !showFavoritesOnly
    queries.setShowFavoritesOnly(showFavoritesOnly)
  }

  // Handle persistance of search queries, show favorites only, and status filter in Chrome storage
  // hydration from storage now needs to set both variables together
  $effect(() => {
    queries.getSearchQuery().then((q) => {
      searchQuery = q
      debouncedQuery = q
    })
    queries.getShowFavoritesOnly().then((fav) => {
      showFavoritesOnly = fav
    })
    queries.getStatusFilter().then((s) => {
      status = s
    })
  })

  queries.onSearchQueryChange((q) => {
    searchQuery = q
    debouncedQuery = q
  })

  queries.onShowFavoritesOnlyChange((fav) => {
    showFavoritesOnly = fav
  })

  queries.onStatusFilterChange((s) => {
    status = s
  })

  //Clear Query button logic
  let queryNotEmpty = $derived(debouncedQuery.trim().length > 0)
  async function clearSearch() {
    queries.setSearchQuery('')
  }


  // Open side Panel for Manhwa Info and Chapter Selection
  async function openSidePanel(manhwa: Manhwa) {
    await setSelectedManhwa(manhwa.id)

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.windowId) {
      await chrome.sidePanel.open({ windowId: tab.windowId })
      window.close()
    }
  }




</script>

<div class="popup">
  <header class="search-bar">
    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <input type="text" placeholder="Search your library…" oninput={handleSearchInput} value={searchQuery} />
    {#if queryNotEmpty}
      <button class="clear-btn" onclick={clearSearch} aria-label="Clear search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    {/if}
  </header>
  <nav class="status-nav">
    <StatusBar
      labels={statusValues}
      selected={status}
      onSelect={handleStatusSelect}
    />
    <FavoriteButton
      favorite={showFavoritesOnly}
      onToggle={handleShowFavoritesToggle}
      forStatus={true}
    />
  </nav>
  <main class="grid-scroll">
  {#if isSearching}
    <p class="searching-state">
      Searching
      <span class="dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </span>
    </p>
  {:else if filtered.length === 0 && status === 'All' && !showFavoritesOnly}
    <p class="empty-state">Your library is empty. Add Some Manhwa!</p>
  {:else if filtered.length === 0 && !debouncedQuery}
    <p class="empty-state">No manhwa found.</p>
  {:else if debouncedQuery && filtered.length === 0}
    <p class="empty-state">No manhwas found for "{debouncedQuery}".</p>
  {:else}
    <div class="grid">
      {#each filtered as manhwa (manhwa.id)}
        <Card {manhwa} onClick={openSidePanel} />
      {/each}
    </div>
  {/if}
</main>
<footer class="count-bar">
  <span class="count-text" class:is-hidden={hideManwhaCount}>
    {manhwaStore.list.length} total · {filtered.length} shown
  </span>
  <button
    class="count-toggle"
    onclick={() => (hideManwhaCount = !hideManwhaCount)}
    aria-label={hideManwhaCount ? 'Show count' : 'Hide count'}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      {#if hideManwhaCount}
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.28 20.28 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="2" y1="2" x2="22" y2="22" />
      {:else}
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
        <circle cx="12" cy="12" r="3" />
      {/if}
    </svg>
  </button>
</footer>
</div>

<style>
  :global(body) {
    margin: 0;
    background: #0f172a;
  }

  .popup {
    width: 480px;
    height: 480px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #0f172a 0%, #131b2e 100%);
    font-family: ui-sans-serif, system-ui, sans-serif;
    color: #e2e8f0;
    overflow: hidden;
    border-radius: 8px;
  }

  .search-bar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 14px 16px 12px;
    padding: 10px 14px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }

  .search-bar:focus-within {
    border-color: #818cf8;
    box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.25);
  }

  .search-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: #64748b;
  }

  .search-bar input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: #e2e8f0;
    font-size: 14px;
    font-family: inherit;
  }

  .search-bar input::placeholder {
    color: #64748b;
  }

  .clear-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    padding: 0;
    background: rgba(148, 163, 184, 0.12);
    border: none;
    border-radius: 999px;
    color: #64748b;
    cursor: pointer;
    transition: background-color 150ms ease, color 150ms ease, transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
    animation: pop-in 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
  } 

  .clear-btn svg {
    width: 12px;
    height: 12px;
    transition: transform 200ms ease;
  }

  .clear-btn:hover {
    background-color: rgba(248, 113, 113, 0.15);
    color: #f87171;
  }

  .clear-btn:hover svg {
    transform: rotate(90deg);
  }

  .clear-btn:active {
    transform: scale(0.85);
  }

  @keyframes pop-in {
    from {
      opacity: 0;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  .searching-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #64748b;
  font-size: 13px;
  margin-top: 40px;
  }

  .dots {
    display: flex;
    gap: 3px;
  }

  .dot {
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: #64748b;
    animation: bounce 1.2s ease-in-out infinite;
  }

  .dot:nth-child(2) {
    animation-delay: 150ms;
  }

  .dot:nth-child(3) {
    animation-delay: 300ms;
  }

  @keyframes bounce {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.5;
    }
    30% {
      transform: translateY(-4px);
      opacity: 1;
    }
  }
  
  .status-nav {
    display: flex;
    flex-shrink: 0;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding: 0 16px 12px;
  }
  .grid-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 1px 16px 16px;
  }

  .grid-scroll::-webkit-scrollbar {
    width: 8px;
  }

  .grid-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .grid-scroll::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  .grid-scroll::-webkit-scrollbar-thumb:hover {
    background: #475569;
    background-clip: padding-box;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 5px 0 0;
  }

  .empty-state {
    text-align: center;
    color: #64748b;
    font-size: 13px;
    margin-top: 40px;
    overflow-wrap: break-word;
    white-space: normal;
  }

  .count-bar {
  flex-shrink: 0;
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 16px;
  border-top: 1px solid #1e293b;
}

.count-text {
  font-size: 11px;
  color: #475569;
  font-variant-numeric: tabular-nums;
  transition: opacity 200ms ease;
}

.count-text.is-hidden {
  opacity: 0;
  pointer-events: none;
}

.count-toggle {
  opacity: 0.5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  padding: 0;
  background: none;
  border: none;
  border-radius: 999px;
  color: #475569;
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;
}

.count-toggle:hover {
  background: rgba(148, 163, 184, 0.12);
  color: #94a3b8;
}

.count-toggle svg {
  width: 13px;
  height: 13px;
}

</style>