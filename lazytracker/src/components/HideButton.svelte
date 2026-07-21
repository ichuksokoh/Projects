<script lang="ts">
    interface HideButtonProps {
    hidden?: boolean
    onToggle?: (next: boolean) => void
    forStatus?: boolean
    size?: number
  }

  let {
    hidden = $bindable(false),
    onToggle,
    forStatus = false,
    size = 34
  }: HideButtonProps = $props()

  function handleClick() {
    hidden = !hidden
    onToggle?.(hidden)
  }
</script>

<button
  class="hide-btn"
  class:is-active={hidden}
  onclick={handleClick}
  aria-pressed={hidden}
  aria-label={hidden ? (forStatus ? 'Showing hidden only' : 'Unhide') : (forStatus ? 'Show hidden only' : 'Hide')}
  style="--size: {size}px"
>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    {#if hidden}
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.28 20.28 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="2" y1="2" x2="22" y2="22" />
    {:else}
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    {/if}
  </svg>
</button>

<style>
  .hide-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: var(--size);
    max-height: var(--size);
    height: var(--size);
    width: 100%;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 10px;
    color: #64748b;
    cursor: pointer;
    transition: border-color 150ms ease, color 150ms ease, background-color 150ms ease, transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .hide-btn svg {
    width: 16px;
    height: 16px;
  }

  .hide-btn:hover {
    border-color: #475569;
    color: #94a3b8;
  }

  .hide-btn.is-active {
    color: #a5b4fc;
    border-color: rgba(129, 140, 248, 0.4);
    background: rgba(99, 102, 241, 0.12);
    animation: pop 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .hide-btn.is-active:hover {
    color: #c7d2fe;
  }

  .hide-btn:active {
    transform: scale(0.9);
  }

  @keyframes pop {
    0% { transform: scale(1); }
    40% { transform: scale(1.25); }
    100% { transform: scale(1); }
  }
</style>