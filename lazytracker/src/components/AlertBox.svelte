<!-- src/components/AlertBox.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    open = $bindable(false),
    title,
    children,
    onConfirm,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    confirmColorFrom = '#4338ca',
    confirmColorTo = '#3730a3',
    showCancel = true,
  }: {
    open?: boolean
    title?: string
    children: Snippet
    onConfirm?: () => void
    confirmLabel?: string
    cancelLabel?: string
    confirmColorFrom?: string
    confirmColorTo?: string
    showCancel?: boolean
  } = $props()

  function close() {
    open = false
  }

  function confirm() {
    onConfirm?.()
    close()
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) close()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close()
  }
</script>

<svelte:window onkeydown={open ? handleKeydown : undefined} />

{#if open}
  <div class="backdrop" onclick={handleBackdropClick} role="presentation">
    <div class="panel" role="dialog" aria-modal="true" aria-labelledby={title ? 'alert-title' : undefined}>
      {#if title}
        <h2 id="alert-title">{title}</h2>
      {/if}

      <div class="content">
        {@render children()}
      </div>

      <div class="actions">
        {#if showCancel}
          <button class="btn btn-cancel" onclick={close}>{cancelLabel}</button>
        {/if}
        <button
          class="btn btn-confirm"
          style="--color-from: {confirmColorFrom}; --color-to: {confirmColorTo};"
          onclick={confirm}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(2, 6, 23, 0.65);
    backdrop-filter: blur(2px);
    z-index: 1000;
    animation: fade-in 150ms ease;
  }

  .panel {
    width: min(90%, 320px);
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 14px;
    padding: 18px;
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.5),
      0 4px 12px rgba(0, 0, 0, 0.3);
    animation: panel-in 200ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .panel h2 {
    margin: 0 0 8px;
    font-size: 15px;
    font-weight: 600;
    color: #f8fafc;
  }

  .content {
    font-size: 13px;
    line-height: 1.6;
    color: #cbd5e1;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
  }

  .btn {
    appearance: none;
    border-radius: 10px;
    padding: 6px 14px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 140ms ease, filter 140ms ease, border-color 140ms ease;
  }

  .btn:active {
    transform: scale(0.96);
  }

  .btn-cancel {
    background: none;
    border: 1px solid #334155;
    color: #94a3b8;
  }

  .btn-cancel:hover {
    border-color: #475569;
    color: #e2e8f0;
  }

  .btn-confirm {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: linear-gradient(180deg, var(--color-from), var(--color-to));
    color: #f8fafc;
  }

  .btn-confirm:hover {
    filter: brightness(1.1);
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes panel-in {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(8px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  #alert-title {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>