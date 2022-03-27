<script lang="ts">
  import {Accordion, AccordionItem} from 'sveltestrap'
  import CheckListTable from './CheckListTable.svelte'

  import config from './config'
</script>

<Accordion class="checklists" style="overflow-y: auto">
  {#each config.checklists as list}
    <AccordionItem header="{list.title}"
                   active="{list.active}"
                   >
      <!-- yaml でアンカーを使っていると同じオブジェクトが参照されているので
           書き換えられるように deep copy して渡す -->
      <CheckListTable start="{list.baseTime}"
                      schedule="{JSON.parse(JSON.stringify(list.checklist))}"
                      ></CheckListTable>
    </AccordionItem>
  {/each}
</Accordion>
