<script lang="ts">
  let {
    labels = ['Plan To Read', 'Reading', 'Completed', 'Dropped'],
    selected = $bindable(labels[0]),
    onSelect,
  }: { labels?: readonly string[]; selected?: string; onSelect?: (label: string) => void } = $props()

  let buttonEls: HTMLElement[] = $state([])
  let highlightLeft = $state(0)
  let highlightWidth = $state(0)
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

  $effect(() => {
    selected // re-run whenever selection changes
    updateHighlightPosition()
  })

  // keep it correct if the container ever resizes (window resize, sidepanel width change, etc.)
  $effect(() => {
    const observer = new ResizeObserver(updateHighlightPosition)
    for (const el of buttonEls) {
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  })
</script>

<div class="status-bar">
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
      {label}
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
    border-radius: 10px;
    padding: 3px;
  }

  .status-item {
    position: relative;
    z-index: 1;
    flex: 1;
    padding: 6px 4px;
    font-size: 10px;
    text-align: center;
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    border-radius: 8px;
    transition: color 200ms ease;
  }

  .status-item.is-active {
    color: #fff;
    font-weight: 600;
  }

  .highlight {
    position: absolute;
    top: 3px;
    bottom: 3px;
    left: 0;
    background: rgba(37, 99, 235, 0.55);
    border: 1px solid rgba(37, 99, 235, 0.8);
    border-radius: 8px;
    pointer-events: none;
    transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1), width 250ms cubic-bezier(0.16, 1, 0.3, 1);
  }
</style>