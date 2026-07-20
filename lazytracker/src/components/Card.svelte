<script lang="ts">
  import type { Manhwa } from '@/types'
  import { retrieveCover, deleteCachedCover } from '@/lib/coverCache.svelte'
  import { manhwaStore } from '@/lib/manhwaStore.svelte'
  import AlertBox from '@/components/AlertBox.svelte'

  let { manhwa, onClick, maxWidth = '100%', maxHeight = '100%' } :
    { manhwa: Manhwa, onClick: (manhwa: Manhwa) => void, maxWidth?: string, maxHeight?: string } = $props()

  const cover = retrieveCover(() => manhwa)

  function checkOverflow(node: HTMLElement) {
    const resizeObserver = new ResizeObserver(() => {
      const span = node.querySelector('.title-main') as HTMLElement
      if (!span) return
      if (span.scrollWidth > node.clientWidth) {
        node.classList.add('is-overflowing')
      } else {
        node.classList.remove('is-overflowing')
      }
    })
    resizeObserver.observe(node)
    return { destroy() { resizeObserver.disconnect() } }
  }

  function getContrastTextColor(hex: string): '#000000' | '#ffffff' {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.6 ? '#000000' : '#ffffff'
  }

  const statusColors: Record<string, string> = {
    Reading: '#4338ca',
    'Plan To Read': '#334155',
    Completed: '#0f766e',
    Dropped: '#7f1d1d',
  }

  let badgeBg = $derived(statusColors[manhwa.status] ?? '#334155')
  let badgeText = $derived(getContrastTextColor(badgeBg))

  let isLandscape = $state(false)
  function handleImageLoad(e: Event) {
    const img = e.currentTarget as HTMLImageElement
    isLandscape = img.naturalWidth > img.naturalHeight
  }

  function handleToggleFavorite(e: MouseEvent) {
    e.stopPropagation()
    manhwaStore.update(manhwa.id, { favorite: !manhwa.favorite, updatedAt: Date.now() })
  }

  let showDeleteConfirm = $state(false)
  async function deleteManhwa(id: string) {
    if (!id || id === '') return
    await deleteCachedCover(id)
    await manhwaStore.remove(id)
  }
  async function handleDelete(e: MouseEvent) {
    e.stopPropagation()
    showDeleteConfirm = true
    // await deleteCachedCover(manhwa.id)
    // await manhwaStore.remove(manhwa.id)
  }

</script>
<AlertBox
  bind:open={showDeleteConfirm}
  title="Delete manhwa?"
  confirmLabel="Delete"
  confirmColorFrom="#7f1d1d"
  confirmColorTo="#450a0a"
  onConfirm={() => deleteManhwa(manhwa.id ?? '')}
>
  This will remove <strong>{manhwa.title}</strong> and its cached cover from your library. This can't be undone.
</AlertBox>
<div
  class="card"
  role="button"
  tabindex="0"
  onclick={() => onClick(manhwa)}
  onkeydown={(e) => e.key === 'Enter' && onClick(manhwa)}
  style="max-width: {maxWidth}; max-height: {maxHeight};"
>
  <div class="cover-wrap">
    {#if manhwa.coverUrl}
      <img
        src={cover.url}
        alt={manhwa.title}
        loading="lazy"
        onload={handleImageLoad}
        class:is-landscape={isLandscape}
      />
    {:else}
      <div class="cover-placeholder">?</div>
    {/if}

    <div class="overlay-controls">
      <button
        class="favorite-toggle"
        class:is-active={manhwa.favorite}
        onclick={handleToggleFavorite}
        aria-pressed={manhwa.favorite}
        aria-label={manhwa.favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg viewBox="0 0 24 24" fill={manhwa.favorite ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
      <span class="status-badge" style="background: {badgeBg}ea; color: {badgeText};">
        {manhwa.status}
      </span>
  
      <button class="delete-btn" onclick={handleDelete} aria-label="Delete manhwa">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
    <div class="rating">
      <span >{manhwa.rating?.toFixed(2)}</span>
    </div>
  </div>

  <div class="title-wrap" use:checkOverflow>
    <div class="marquee-content">
      <span class="title-main">{manhwa.title}</span>
      <span class="title-duplicate" aria-hidden="true">{manhwa.title}</span>
    </div>
  </div>
</div>

<style>
  .card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    cursor: pointer;
    font-family: inherit;
    color: inherit;
    text-align: left;
    max-width: var(--max-width);
    max-height: var(--max-height);
    min-width: 0;
  }

  .cover-wrap {
    position: relative;
    aspect-ratio: 2 / 3;
    border-radius: 10px;
    overflow: hidden;
    background: #1e293b;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.3),
      0 4px 12px rgba(0, 0, 0, 0.25);
    transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 200ms ease;
  }

  .card:hover .cover-wrap {
    transform: translateY(-4px) scale(1.04);
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.4),
      0 12px 24px rgba(99, 102, 241, 0.25);
  }

  .cover-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    background: #0f172a;
  }

  .cover-wrap img.is-landscape {
    object-fit: contain;
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

  .status-badge {
    padding: 2px 7px;
    border-radius: 999px;
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    backdrop-filter: blur(4px);
    white-space: nowrap;
  }

  .favorite-toggle,
  .delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    padding: 0;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 999px;
    color: #cbd5e1;
    cursor: pointer;
    opacity: 0;
    transform: scale(0.85);
    transition: opacity 150ms ease, transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1),
                background-color 150ms ease, color 150ms ease;
  }

  .card:hover .favorite-toggle,
  .card:hover .delete-btn {
    opacity: 1;
    transform: scale(1);
  }

  .favorite-toggle svg,
  .delete-btn svg {
    width: 12px;
    height: 12px;
  }

  .favorite-toggle.is-active {
    opacity: 1;
    transform: scale(1);
    color: #fbbf24;
    border-color: rgba(251, 191, 36, 0.4);
    background: rgba(251, 191, 36, 0.15);
  }

  .favorite-toggle:hover {
    color: #fcd34d;
  }


  .delete-btn:hover {
    background: rgba(248, 113, 113, 0.2);
    border-color: rgba(248, 113, 113, 0.4);
    color: #f87171;
  }

  .title-wrap {
    min-width: 0;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    mask-image: linear-gradient(to right, transparent, black 3%, black 95%, transparent);
  }

  .marquee-content {
    display: flex;
    width: max-content;
    padding-right: 24px;
    gap: 24px;
  }

  .title-wrap span {
    font-size: 12px;
    font-weight: 500;
    color: #cbd5e1;
  }

  .title-duplicate {
    display: none;
  }

  .title-wrap:global(.is-overflowing) .title-duplicate {
    display: inline-block;
  }

  .card:hover .title-wrap:global(.is-overflowing) .marquee-content {
    animation: scroll-left 7s linear infinite;
  }

  @keyframes scroll-left {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  .overlay-controls {
    position: absolute;
    top: 6px;
    left: 6px;
    right: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
  }

  .rating {
    position: absolute;
    bottom: 6px;
    left: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 6px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(4px);
    font-size: 10px;
    font-weight: 600;
    color: #818cf8;
  }
</style>