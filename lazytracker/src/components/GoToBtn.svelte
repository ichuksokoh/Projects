<script lang="ts">
    import type { Snippet } from 'svelte'

    interface GoToBtnProps {
        label?: string
        onClick: () => void
        icon?: Snippet
    }

    let { label = "Read At", onClick, icon }: GoToBtnProps = $props()
</script>
<button
    class="read-at-btn"
    onclick={onClick}
>
    {label}
    {#if icon}
        {@render icon()}
    {/if}
</button>
<style>
    .read-at-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: auto;
        padding: 0 12px;
        height: 34px;
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 10px;
        color: #99a1a8;
        cursor: pointer;
        transition: border-color 150ms ease, color 150ms ease, transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .read-at-btn:hover {
        border-color: #475569;
        color: #e6e8eb;
    }

    .read-at-btn:active {
        transform: scale(0.9);
    }
</style>