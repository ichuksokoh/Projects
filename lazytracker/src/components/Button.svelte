<script lang="ts">
  let {
    onclick,
    label = 'Button',
    colorFrom = '#1e293b',
    colorTo = '#1e293b',
    textColor = '#99a1a8',
    hoverTextColor = '#e6e8eb',
    borderColor = '#334155',
    hoverBorderColor = '#475569',
    disabled = false,
  }: {
    onclick: () => void
    label?: string
    colorFrom?: string
    colorTo?: string
    textColor?: string
    hoverTextColor?: string
    borderColor?: string
    hoverBorderColor?: string
    disabled?: boolean
  } = $props()
</script>

<button
  class="btn"
  {onclick}
  {disabled}
  style="
    --color-from:{colorFrom};
    --color-to:{colorTo};
    --text:{textColor};
    --text-hover:{hoverTextColor};
    --border:{borderColor};
    --border-hover:{hoverBorderColor};
  "
>
  <span>{label}</span>
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    width: auto;
    height: 34px;
    padding: 0 12px;

    appearance: none;
    border-radius: 10px;
    border: 1px solid var(--border);

    background: linear-gradient(
      180deg,
      var(--color-from),
      var(--color-to)
    );

    color: var(--text);
    font: inherit;
    font-size: 13px;
    font-weight: 600;

    cursor: pointer;

    transition:
      border-color 150ms ease,
      color 150ms ease,
      transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .btn:hover:not(:disabled) {
    border-color: var(--border-hover);
    color: var(--text-hover);
  }

  .btn:active:not(:disabled) {
    transform: scale(0.9);
  }

  .btn:focus-visible {
    outline: 2px solid #818cf8;
    outline-offset: 2px;
  }

  .btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .btn span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>