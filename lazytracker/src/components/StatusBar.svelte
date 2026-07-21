<script lang="ts">
  let {
    labels = ['Plan To Read', 'Reading', 'Completed', 'Dropped'],
    selected = $bindable(labels[0]),
    onSelect,
  }: { labels?: readonly string[]; selected?: string; onSelect?: (label: string) => void } = $props()

  let buttonEls: HTMLElement[] = $state([])
  let containerEl = $state<HTMLElement | null>(null)
  let highlightLeft = $state(0)
  let highlightWidth = $state(0)
  let fontScale = $state(1)
  let selectedIndex = $derived(labels.indexOf(selected))

  function select(label: string) {
    selected = label
    onSelect?.(label)
  }

  function updateHighlightPosition() {
    const el = buttonEls[selectedIndex]
    if (!el) return
    highlightLeft = el.offsetLeft
    highlightWidth = el.offsetWidth
  }

  // Measures whether any label is currently overflowing its own button
  // at the current font size, and if so, shrinks the font just enough
  // for the tightest-fitting label to stay on one line.
  function updateFontScale() {
    let tightestRatio = 1
    for (const el of buttonEls) {
      if (!el) continue
      const span = el.querySelector('span')
      if (!span) continue

      const style = getComputedStyle(el)
      const horizontalPadding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
      const availableWidth = el.clientWidth - horizontalPadding - 4

      if (span.scrollWidth > availableWidth) {
        const ratio = availableWidth / span.scrollWidth
        if (ratio < tightestRatio) tightestRatio = ratio
      }
    }
    fontScale = Math.max(0.7, tightestRatio)
  }

  $effect(() => {
    selected // re-run whenever selection changes
    updateHighlightPosition()
  })

  // keep it correct if the container ever resizes (window resize, sidepanel width change, etc.)
  $effect(() => {
    const observer = new ResizeObserver(() => 
  {
      updateHighlightPosition()
      updateFontScale()
    })
    for (const el of buttonEls) {
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  })
</script>

<div class="status-bar" bind:this={containerEl} style="--font-scale: {fontScale};">
  <div
    class="highlight"
    style="transform: translateX({highlightLeft}px); width: {highlightWidth}px;"
  ></div>
  {#each labels as label, i}
    <button
      bind:this={buttonEls[i]}
      class="status-item"
      class:is-active={i === selectedIndex}
      onclick={() => select(label)}
    >
      <span>{label}</span>
    </button>
  {/each}
</div>

<style>
  .status-bar {
    position: relative;
    width: 100%;
    display: flex;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 50px;
    padding: 3px;
  }

  .status-item {
    position: relative;
    z-index: 1;
    flex: 1;
    min-width: 0;
    padding: 6px 4px;
    text-align: center;
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    border-radius: 50px;
    transition: color 200ms ease;
    overflow: hidden;
  }

  .status-item span {
    display: inline-block;
    font-size: calc(10px * var(--font-scale, 1));
    white-space: nowrap;
  }

  .status-item.is-active span {
    font-weight: 600;
    color: #fff;
  }

  .highlight {
    position: absolute;
    top: 3px;
    bottom: 3px;
    left: 0;
    background: rgba(37, 99, 235, 0.55);
    border: 1px solid rgba(37, 99, 235, 0.8);
    border-radius: 50px;
    pointer-events: none;
    transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1), width 250ms cubic-bezier(0.16, 1, 0.3, 1);
  }
</style>