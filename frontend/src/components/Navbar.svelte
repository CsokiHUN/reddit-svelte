<script>
  import { Router, Link } from 'svelte-navigator';

  import { logout, currentUser } from '../stores';
</script>

{#if $currentUser}
  <Router>
    <div class="navbar bg-base-200 fixed top-0">
      <div class="flex-1">
        <Link to="/" class="btn btn-ghost normal-case text-xl">Reddit Svelte</Link>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal p-0">
          <li><Link to="profile">Profile</Link></li>

          <li>
            <div on:click={logout} class="flex justify-center items-center text-error">
              Logout
              <i class="fa-solid fa-arrow-right-from-bracket" />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Router>
{/if}
