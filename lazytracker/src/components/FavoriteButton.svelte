<script lang="ts">
  interface FavoriteButtonProps {
    favorite: boolean
    onToggle: () => void
    forStatus?: boolean
    size?: number
  }
  let { favorite = $bindable(false), onToggle, forStatus = false, size = 34 }: FavoriteButtonProps = $props()


</script>
<button
  class="favorite-btn"
  class:is-active={favorite}
  onclick={onToggle}
  aria-pressed={favorite}
  aria-label={favorite ? (forStatus ? 'Showing Favorites' : 'Remove from favorites') : (forStatus ? 'Show Favorites' : 'Add to favorites')}
  style="--size: {size}px"
>
  <svg viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
</button>

<style>
  .favorite-btn {
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
    transition: border-color 150ms ease, color 150ms ease, transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .favorite-btn svg {
    width: 17px;
    height: 17px;
  }

  .favorite-btn:hover {
    border-color: #475569;
    color: #94a3b8;
  }

  .favorite-btn.is-active {
    color: #fbbf24;
    border-color: rgba(251, 191, 36, 0.4);
    background: rgba(251, 191, 36, 0.1);
  }

  .favorite-btn.is-active:hover {
    color: #fcd34d;
  }

  .favorite-btn:active {
    transform: scale(0.9);
  }

  .favorite-btn.is-active {
    animation: pop 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes pop {
    0% { transform: scale(1); }
    40% { transform: scale(1.25); }
    100% { transform: scale(1); }
  }
</style>