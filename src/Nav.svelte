<script lang="ts">
  import {Navbar, NavbarBrand} from 'sveltestrap'
  import {Nav, NavItem, NavLink, Dropdown, DropdownItem, DropdownToggle, DropdownMenu} from 'sveltestrap'
  import config from './config'

  let isExpandedDropdown: {[key: number]: boolean} = {} // key: nav item index, value: is expanded
</script>


<Navbar color="dark" dark sticky="top">
  <NavbarBrand>{config.title}</NavbarBrand>
  <Nav>
    {#each config.nav as navItem, i}
      {#if navItem.type == null}
        <NavItem>
          <NavLink target="_blank" href="{navItem.url}">{navItem.text}</NavLink>
        </NavItem>
      {:else if navItem.type === 'dropdown'}
        <Dropdown nav
                  isOpen={isExpandedDropdown[i]}
                  toggle={() => (isExpandedDropdown[i] = !isExpandedDropdown[i])}>
          <DropdownToggle nav caret>{navItem.text}</DropdownToggle>
          <DropdownMenu dark style="{i === config.nav.length - 1 ? 'left: unset; right: 0' : ''}">
            {#each navItem.dropdown as subItem}
              {#if subItem.type === 'header'}
                <DropdownItem header>{subItem.text}</DropdownItem>
              {:else if subItem.type === 'divider'}
                <DropdownItem divider />
              {:else}
                <DropdownItem target="_blank" href="{subItem.url}">{subItem.text}</DropdownItem>
              {/if}
            {/each}
          </DropdownMenu>
        </Dropdown>
      {/if}
    {/each}
  </Nav>
</Navbar>


<style>
  :global(nav.navbar) {
    background: #e67e00 !important;
  }

  :global(nav.navbar a) {
    color: white !important;
  }

  :global(nav .dropdown-menu) {
    max-height: 90vh !important;
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
