<script lang="ts">
    import * as selectManwha from '@/lib/selectedManhwa.svelte'
    import { manhwaStore } from '@/lib/manhwaStore.svelte'

    let added = $state(true)
    let error = $state<string | null>(null)
    const windowUrl = $derived(window.location.href)

    async function handleViewLib() {
        let manhwa = await manhwaStore.getManhwaBySourceUrl(windowUrl)
        if (manhwa) {
            await selectManwha.setSelectedManhwaBg(manhwa.id)
        } else {
            added = false
            console.warn('[viewlib] no manhwa found for sourceUrl:', windowUrl)
        }
        
        console.log('[viewlib] opening side panel for manhwa:', manhwa?.title)
        const success = await chrome.runtime.sendMessage({ type: 'open-sidepanel' })
        if (success) {
            console.log('[viewlib] side panel opened successfully')
            added = false
        } else {
            console.error('[viewlib] failed to open side panel')
            error = 'Failed to open library, please try again.'
        }
    }
</script>
{#if added}
  <div class="popup-container">
  <button class="toggle-button" onclick={handleViewLib}>
    <span>View In Library</span>
  </button>
</div>
{/if}
<style>
    .popup-container {
        position: fixed;
        left: 0;
        bottom: 0;
        margin: 20px;
        z-index: 100;
        display: flex;
        align-items: flex-end;
        font-size: 16px;
        font-family: ui-sans-serif, system-ui, sans-serif;
        user-select: none;
        line-height: 1;
        box-sizing: border-box;
    }

    .popup-container * {
        box-sizing: border-box; /* force it for all descendants, regardless of host page resets */
    }

    .toggle-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        height: 40px;
        border-radius: 9999px;
        overflow: hidden;
        box-shadow:
            0 1px 3px 0 rgb(0 0 0 / 0.1),
            0 1px 2px -1px rgb(0 0 0 / 0.1);
        cursor: pointer;
        border: none;
        background: linear-gradient(0, #a157dd72, #4338ca);
        padding: 0;
        flex-shrink: 0; /* prevent flex from squishing the button if content is wide */
        transition: background-color 550ms ease, box-shadow 150ms ease;
    }

    .toggle-button:hover {
        background-color: #9289cf;
    }

</style>