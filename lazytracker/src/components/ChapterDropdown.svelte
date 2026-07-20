<script lang="ts">
    import type { Manhwa } from '@/types'

    let { manhwa, onSelect }: { manhwa: Manhwa; onSelect: (chapterNumber: number) => void } =
    $props()

    let open = $state(false)
    let panelEl = $state<HTMLElement | null>(null)
    let triggerEl = $state<HTMLElement | null>(null)

    let currentChapterLabel = $derived(
    manhwa.chapters.find((c) => c.number === manhwa.currentChapter)?.label ??
        `Ch. ${manhwa.chapters[0].label}`
    )

    function toggle() {
    open = !open
    }

    function select(chapterNumber: number) {
    onSelect(chapterNumber)
    open = false
    }

    // Close when clicking anywhere outside the trigger/panel
    function handleWindowClick(e: MouseEvent) {
    if (!open) return
    const target = e.target as Node
    if (panelEl?.contains(target) || triggerEl?.contains(target)) return
    open = false
    }

    // Scroll the active chapter into view whenever the panel opens
    $effect(() => {
    if (open && panelEl) {
        const activeEl = panelEl.querySelector('.chapter-row.is-active') as HTMLElement | null
        if (activeEl) {
        const panelRect = panelEl.getBoundingClientRect()
        const activeRect = activeEl.getBoundingClientRect()
        const offsetWithinPanel = activeRect.top - panelRect.top + panelEl.scrollTop
        panelEl.scrollTop = offsetWithinPanel - panelEl.clientHeight / 2 + activeEl.clientHeight / 2
        }
    }
    })
</script>

<svelte:window onclick={handleWindowClick} />

<div class="picker">
  <button
    bind:this={triggerEl}
    class="trigger"
    class:is-open={open}
    onclick={toggle}
  >
    <span class="trigger-label">{currentChapterLabel}</span>
    <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="18 15 12 9 6 15" />
    </svg>
  </button>

  {#if open}
    <div bind:this={panelEl} class="panel">
      {#each manhwa.chapters as chapter (chapter.number)}
        <button
          class="chapter-row"
          class:is-active={chapter.number === manhwa.currentChapter}
          onclick={() => select(chapter.number)}
        >
          <span>{chapter.label}</span>
          {#if (chapter.number === manhwa.currentChapter && chapter.read) || chapter.read}
            <svg class="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .picker {
    position: relative;
    display: inline-block;
    font-family: inherit;
    align-self: flex-start;
  }

  .trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 10px;
    color: #e2e8f0;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }

  .trigger:hover {
    border-color: #475569;
  }

  .trigger.is-open {
    border-color: #818cf8;
    box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
  }

  .chevron {
    width: 14px;
    height: 14px;
    color: #64748b;
    transition: transform 200ms ease;
  }

  .trigger.is-open .chevron {
    transform: rotate(180deg);
  }

  .panel {
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    transform-origin: bottom center;
    min-width: 120px;
    max-width: 230px;
    max-height: 200px;
    overflow-y: auto;
    background: rgba(30, 41, 59, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid #334155;
    border-radius: 12px;
    box-shadow:
      0 8px 16px rgba(0, 0, 0, 0.35),
      0 2px 4px rgba(0, 0, 0, 0.25);
    padding: 6px;
    z-index: 50;
    animation: panel-in 500ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes panel-in {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(6px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }
  }

  .panel::-webkit-scrollbar {
    width: 5px;
  }

  .panel::-webkit-scrollbar-track {
    background: transparent;
  }

  .panel::-webkit-scrollbar-thumb {
    background: #475569;
    border-radius: 999px;
  }

  .chapter-row {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 8px 10px;
    background: none;
    border: none;
    border-radius: 8px;
    color: #cbd5e1;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    transition: background-color 120ms ease;
    min-width: 0;
    gap: 8px;
  }
  
  .chapter-row span {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chapter-row:hover {
    background: rgba(99, 102, 241, 0.15);
  }

  .chapter-row.is-active {
    background: rgba(99, 102, 241, 0.25);
    color: #c7d2fe;
    font-weight: 600;
  }

  .check {
    width: 14px;
    height: 14px;
    color: #a5b4fc;
    flex-shrink: 0;
  }
</style>