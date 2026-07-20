<script lang="ts">
  let {
    rating = $bindable(undefined),
    onSelect,
  }: { rating?: number; onSelect?: (value: number) => void } = $props()

  const MIN = 0
  const MAX = 10
  const STEP = 0.25

  let trackEl = $state<HTMLElement | null>(null)
  let dragging = $state(false)
  let inputValue = $state('')

  let hasSelection = $derived(rating !== undefined)
  let percent = $derived(hasSelection ? ((rating! - MIN) / (MAX - MIN)) * 100 : 0)

  $effect(() => {
    inputValue = hasSelection ? String(rating) : ''
  })

  function clampAndStep(value: number): number {
    const stepped = Math.round(value / STEP) * STEP
    return Math.min(MAX, Math.max(MIN, Math.round(stepped * 100) / 100))
  }

  function commit(value: number) {
    const clamped = clampAndStep(value)
    rating = clamped
    onSelect?.(clamped)
  }

  function handleInputChange(e: Event) {
    const raw = (e.currentTarget as HTMLInputElement).value
    const parsed = parseFloat(raw)
    if (!Number.isNaN(parsed)) {
      commit(parsed)
    } else {
      inputValue = hasSelection ? String(rating) : ''
    }
  }

  function valueFromClientX(clientX: number): number {
    if (!trackEl) return MIN
    const rect = trackEl.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    return MIN + ratio * (MAX - MIN)
  }

  function handlePointerDown(e: PointerEvent) {
    dragging = true
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    commit(valueFromClientX(e.clientX))
  }

  function handlePointerMove(e: PointerEvent) {
    if (!dragging) return
    commit(valueFromClientX(e.clientX))
  }

  function handlePointerUp() {
    dragging = false
  }
</script>

<div class="rating-wrap">
  <div class="rating-header">
    <span class="rating-label">
      Rating:
      <input
        type="number"
        class="rating-input"
        min={MIN}
        max={MAX}
        step={STEP}
        placeholder="—"
        value={inputValue}
        onchange={handleInputChange}
      />
    </span>
    <span class="rating-value" class:is-empty={!hasSelection}>
      {hasSelection ? rating!.toFixed(2) : '—'}
    </span>
  </div>

  <button
    bind:this={trackEl}
    class="rating-track"
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointercancel={handlePointerUp}
    aria-label="Rating"
  >
    {#if hasSelection}
      <div class="rating-fill" style="width: {percent}%"></div>
      <div class="rating-thumb" class:is-dragging={dragging} style="left: {percent}%"></div>
    {/if}
  </button>
</div>

<style>
  .rating-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .rating-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  .rating-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    color: #94a3b8;
  }

  .rating-input {
    width: 42px;
    padding: 2px 4px;
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 6px;
    color: #e2e8f0;
    font-size: 12px;
    font-family: inherit;
    font-variant-numeric: tabular-nums;
    text-align: center;
  }

  .rating-input:focus {
    outline: none;
    border-color: #818cf8;
  }

  .rating-input::-webkit-inner-spin-button,
  .rating-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .rating-value {
    font-size: 11px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: #818cf8;
  }

  .rating-value.is-empty {
    color: #64748b;
  }

  .rating-track {
    position: relative;
    width: 100%;
    height: 8px;
    padding: 0;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 999px;
    cursor: pointer;
    touch-action: none;
  }

  .rating-fill {
    position: absolute;
    top: -1px;
    bottom: -1px;
    left: -1px;
    background: linear-gradient(90deg, #6366f1, #818cf8);
    border-radius: 999px;
    box-shadow: 0 0 8px rgba(129, 140, 248, 0.5);
    transition: width 120ms ease;
  }

  .rating-thumb {
    position: absolute;
    top: 50%;
    width: 14px;
    height: 14px;
    background: #fff;
    border: 2px solid #6366f1;
    border-radius: 999px;
    transform: translate(-50%, -50%);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: left 120ms ease, transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .rating-thumb.is-dragging {
    transform: translate(-50%, -50%) scale(1.25);
  }
</style>