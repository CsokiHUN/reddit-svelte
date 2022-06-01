<script>
  import { Router, Route } from 'svelte-navigator';

  import Navbar from './components/Navbar.svelte';
  import PrivateRouteGuard from './components/PrivateRouteGuard.svelte';

  import ProfilePage from './routes/Profile.svelte';
  import LoginPage from './routes/Login.svelte';
  import HomePage from './routes/Home.svelte';
  import { currentUser } from './stores';
</script>

<Navbar />
<div class={`${$currentUser ? 'mt-16' : ''}`}>
  {#if $currentUser}
    <br />
  {/if}
  <Router>
    <Route path="/" primary={false}>
      <PrivateRouteGuard>
        <HomePage />
      </PrivateRouteGuard>
    </Route>
    <Route path="profile">
      <PrivateRouteGuard>
        <ProfilePage />
      </PrivateRouteGuard>
    </Route>
    <Route path="login">
      <LoginPage />
    </Route>
  </Router>
</div>
