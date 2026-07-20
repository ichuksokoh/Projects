<script lang="ts">
  let {
    description,
    open,
    onToggle,
  }: { description: string; open: boolean; onToggle: (next: boolean) => void } = $props()

  function toggle() {
    onToggle(!open)
  }
</script>

<div class="drawer">
  <button class="drawer-trigger" class:is-open={open} onclick={toggle} aria-expanded={open}>
    <span>Description</span>
    <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </button>

  <div class="drawer-body" class:is-open={open}>
    <div class="drawer-content">
      <p>{description}</p>
    </div>
  </div>
</div>

<style>
  .drawer {
    display: flex;
    flex-direction: column;
  }

  .drawer-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    width: 100%;
    padding: 8px 0 4px;
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: color 150ms ease;
  }

  .drawer-trigger:hover {
    color: #cbd5e1;
  }

  .chevron {
    width: 14px;
    height: 14px;
    transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .drawer-trigger.is-open .chevron {
    transform: rotate(180deg);
  }

  .drawer-body {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 400ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .drawer-body.is-open {
    grid-template-rows: 1fr;
  }

  .drawer-content {
    overflow: hidden;
    min-height: 0;
  }

  .drawer-content p {
    margin: 8px 0 0;
    font-size: 13px;
    line-height: 1.6;
    color: #cbd5e1;
    text-align: center;
  }
</style>