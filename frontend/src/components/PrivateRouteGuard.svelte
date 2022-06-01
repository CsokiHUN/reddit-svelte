<script>
  import { useNavigate, useLocation } from 'svelte-navigator';

  import { currentUser } from '../stores';
  import api from '../services/api';

  const navigate = useNavigate();
  const location = useLocation();

  $: (async function () {
    const token = localStorage.getItem('token');
    if (!token) return redirectLogin();

    const { result, user } = await api.get('validatetoken');
    if (!result) return redirectLogin();

    if (!$currentUser) currentUser.set(user);
  })();

  function redirectLogin() {
    localStorage.removeItem('token');
    navigate('/login', {
      state: { from: $location.path },
      replace: true,
    });
  }
</script>

{#if $currentUser}
  <slot />
{/if}
