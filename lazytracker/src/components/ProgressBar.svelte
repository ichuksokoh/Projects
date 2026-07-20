<script lang="ts">
  import type { Manhwa } from "@/types";

    interface ProgressBarProps {
        manhwa: Manhwa
    }

  let { manhwa }: ProgressBarProps = $props()
  const round = (num: number, decimals: number) => {
    const factor = Math.pow(10, decimals)
    return Math.round(num * factor) / factor
  }
  let total = $derived(manhwa.totalChapters ?? manhwa.chapters.length)
  let current = $derived(manhwa.currentChapter)
  let currentLabel = $derived(
    manhwa.chapters.find((c) => c.number === current)?.label ?? `Ch. ${current}`
  )
  let totalLabel = $derived(
    manhwa.totalChapters
      ? manhwa.chapters.find((c) => c.number === total)?.label ?? `Ch. ${total}`
      : undefined
  )
  let percent = $derived(
    total && total > 0 && manhwa.chapters.filter(c => c.read).length > 0 ? Math.min(100, round((current / total) * 100, 1)) : 0
  )
</script>

<div class="progress-wrap">
  <div class="progress-header">
    <span class="progress-label">
      {#if total}
        {currentLabel} of {totalLabel}
      {:else}
        {currentLabel} 
      {/if}
    </span>
    {#if total}
      <span class="progress-percent">{percent}%</span>
    {/if}
  </div>

  <div class="progress-track">
    <div class="progress-fill" style="width: {percent}%"></div>
  </div>
</div>

<style>
  .progress-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .progress-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  .progress-label {
    font-size: 12px;
    font-weight: 500;
    color: #94a3b8;
  }

  .progress-percent {
    font-size: 11px;
    font-weight: 600;
    color: #818cf8;
  }

  .progress-track {
    position: relative;
    width: 100%;
    height: 8px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 999px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #818cf8);
    border-radius: 999px;
    transition: width 500ms cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 0 8px rgba(129, 140, 248, 0.5);
  }
</style>