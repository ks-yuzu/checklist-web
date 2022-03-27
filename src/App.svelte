<script lang="ts">
  import Nav        from './Nav.svelte'
  import CheckLists from './CheckLists.svelte'
  import Timer      from './Timer.svelte'
  import config     from './config'

  let isReady = false
  config.load('config.yaml').then(() => isReady = true)
</script>

{#if isReady}
<main>
  <Nav />
  <CheckLists />
  {#if config.timer?.enabled}
    <Timer />
  {/if}
</main>
{/if}

<style>
  :global(::-webkit-scrollbar) {
    width: 0.5rem;
    background: transparent;
  }
  :global(::-webkit-scrollbar *) {
    background: transparent;
  }
  :global(::-webkit-scrollbar-thumb) {
    background-color: rgba(128, 128, 128, 0.5);
    border-radius: 0.25rem;
  }

  main {
    height:   100%;
    overflow: hidden;

    display:        flex;
    flex-direction: column;
  }

  :global(main > *) {
    flex-grow:   0;
    flex-shrink: 0;
  }
  :global(main > .checklists) {
    flex-grow:   1;
    flex-shrink: 1;
  }
</style>
