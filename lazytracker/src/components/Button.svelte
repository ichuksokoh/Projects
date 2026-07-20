<!-- src/components/Button.svelte -->
<script lang="ts">
  let {
    onclick,
    label = 'Button',
    colorFrom = '#1e293b',
    colorTo = '#334155',
    disabled = false,
  }: {
    onclick: () => void
    label?: string
    colorFrom?: string
    colorTo?: string
    disabled?: boolean
  } = $props()
</script>

<button
  class="btn"
  {onclick}
  {disabled}
  style="--color-from: {colorFrom}; --color-to: {colorTo};"
>
  <span>{label}</span>
</button>

<style>
  .btn {
    appearance: none;
    border: 1px solid #334155;
    border-radius: 10px;
    padding: 0.2rem 1rem;
    min-height: 25px;
    background: linear-gradient(180deg, var(--color-from), var(--color-to));
    color: #f8fafc;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition:
      transform 140ms ease,
      box-shadow 140ms ease,
      filter 140ms ease,
      opacity 140ms ease,
      border-color 140ms ease;
  }

  .btn:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(1.08);
    border-color: #475569;
    box-shadow:
      0 10px 20px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .btn:active:not(:disabled) {
    transform: translateY(0) scale(0.97);
    box-shadow:
      0 4px 10px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  .btn:focus-visible {
    outline: 2px solid #818cf8;
    outline-offset: 3px;
  }

  .btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    box-shadow: none;
    filter: none;
  }

  .btn span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
</style>