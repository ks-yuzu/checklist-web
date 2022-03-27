<script lang="ts">
  import {onDestroy} from 'svelte'
  import {Table} from 'sveltestrap'
  import dayjs, {Dayjs} from 'dayjs'
  import config, {ChecklistTask as ConfigChecklistTask} from './config'

  export let start: string // XX:XX
  const _start = dayjs(`${dayjs().format('YYYY-MM-DD')}T${start}`)


  type Task = ConfigChecklistTask & {
    dayjsTime:  Dayjs
    task:       string
    details?:   string | null
    isDone?:    boolean
    isDelayed?: boolean
    isUrgent?:  boolean
  }

  export let schedule: Task[]


  // functions
  function updateState() {
    const now     = dayjs()
    const delayed = now.add(config.highlight?.delayed?.lefttime ?? 0, 'minutes') // 基本的には now
    const urgent  = now.add(config.highlight?.urgent?.lefttime,       'minutes')

    for (const i in schedule) { // svelte の解析都合で for ... of は使わない
      if ( schedule[i].isDone || schedule[i].isDelayed ) { continue }

      schedule[i].dayjsTime ??= _start.add(schedule[i].timeOffset, 'minutes')
      if      ( schedule[i].dayjsTime < delayed ) { schedule[i].isDelayed = true }
      else if ( schedule[i].dayjsTime < urgent  ) { schedule[i].isUrgent  = true }
    }
    // console.log(schedule)
  }

  // init
  updateState()
  const interval = setInterval(updateState, 1 * 1000)
  onDestroy(() => clearInterval(interval))
</script>


<Table hover>
  <thead>
    <tr>
      <th>時刻</th>
      <th>内容</th>
      <th>備考</th>
    </tr>
  </thead>
  <tbody>
    {#each schedule as t}
      <tr class:is-done="{t.isDone}"
          class:is-urgent="{t.isUrgent}"
          class:is-delayed="{t.isDelayed}"
          on:click={() => t.isDone = !t.isDone}>
        <td>{t.dayjsTime.format('HH:mm')}</td>
        <td>{@html t.summary || ''}</td>
        <td>{@html t.details || ''}</td>
      </tr>
    {/each}
  </tbody>
</Table>


<!-- for dark theme -->
<style>
  :root {
    --table-fg: #eee;
    --table-bg: #3a3a3a;
  }

  :global(div.accordion-item) {
    color: white !important;
    border-top-color: gray;
    border-bottom-color: gray;
    background: var(--table-bg);
  }

  :global(div.accordion-item:first-of-type) {
    border-top: none;
  }

  :global(div.accordion-item:last-of-type) {
    border-bottom: none;
  }

  :global(button.accordion-collapse, button.accordion-button) {
    background: #303030 !important;
    color: white;
  }

  :global(button.accordion-button:not(.collapsed)) {
    color: darkorange;
  }

  :global(button.accordion-button::after) {
    filter: invert(100%);
  }

  :global(table, table tr:hover) {
    color: var(--table-fg) !important;
    background: var(--table-bg);
  }

  :global(table tr.is-urgent) {
    background: rgb(225, 145, 0);
  }

  :global(table tr.is-delayed) {
    background: rgb(180, 20, 0);
  }

  :global(table tr.is-done) {
    color: #606060 !important;
    background: #484848;
  }
</style>
