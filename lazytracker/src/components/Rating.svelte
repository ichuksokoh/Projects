<script lang="ts">
  let {
    rating = $bindable(undefined),
    onSelect,
  }: { rating?: number; onSelect?: (value: number) => void } = $props()

  const values = Array.from({ length: 10 }, (_, i) => i + 1) // [1, 2, ..., 10]

  let buttonEls: HTMLElement[] = $state([])
  let highlightLeft = $state(0)
  let highlightWidth = $state(0)
  let hasSelection = $derived(rating !== undefined && rating >= 1 && rating <= 10)
  let selectedIndex = $derived(hasSelection ? values.indexOf(rating!) : -1)

  function select(value: number) {
    rating = value
    onSelect?.(value)
  }

  function updateHighlightPosition() {
    if (selectedIndex < 0) return
    const el = buttonEls[selectedIndex]
    if (!el) return
    highlightLeft = el.offsetLeft
    highlightWidth = el.offsetWidth
  }

  $effect(() => {
    selectedIndex // re-run whenever selection changes
    updateHighlightPosition()
  })

  $effect(() => {
    const observer = new ResizeObserver(updateHighlightPosition)
    for (const el of buttonEls) {
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  })
</script>

<div class="rating-bar">
  {#if hasSelection}
    <div class="highlight-outer" style="transform: translateX({highlightLeft}px); width: {highlightWidth}px;">
        <div class="highlight-inner"></div>
    </div>
  {/if}
  {#each values as value, i}
    <button
      bind:this={buttonEls[i]}
      class="rating-item"
      class:is-active={i === selectedIndex}
      onclick={() => select(value)}
    >
      {value}
    </button>
  {/each}
</div>

<style>
    .rating-bar {
        position: relative;
        width: 100%;
        display: flex;
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 10px;
        padding: 3px;
    }

    .rating-item {
        position: relative;
        z-index: 1;
        flex: 1;
        padding: 6px 0;
        font-size: 10px;
        font-variant-numeric: tabular-nums;
        text-align: center;
        background: none;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        border-radius: 8px;
        transition: color 200ms ease;
    }

    .rating-item.is-active {
        color: #fff;
        font-weight: 600;
    }

  .highlight-outer {
        position: absolute;
        top: 3px;
        bottom: 3px;
        left: 0;
        pointer-events: none;
        transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1), width 250ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .highlight-inner {
        width: 100%;
        height: 100%;
        background: rgba(37, 99, 235, 0.55);
        border: 1px solid rgba(37, 99, 235, 0.8);
        border-radius: 8px;
        animation: pop-in 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes pop-in {
        from { opacity: 0; transform: scale(0.7); }
        to   { opacity: 1; transform: scale(1); }
    }
</style>