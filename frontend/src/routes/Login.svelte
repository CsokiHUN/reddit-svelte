<script>
  import swal from 'sweetalert';

  import { passwordStrength } from 'check-password-strength';
  import { useNavigate, useLocation } from 'svelte-navigator';

  import API from '../services/api';
  import { currentUser } from '../stores';

  const navigate = useNavigate();
  const location = useLocation();

  $: if ($currentUser)
    navigate('/', {
      state: { from: $location.path },
      replace: true,
    });

  let isRegister = false;
  let buttonsEnabled = true;

  let username = '';
  let password = '';
  let password2 = '';
  let email = '';

  $: pStrength = passwordStrength(password);

  $: passwordColor = function () {
    const id = parseInt(pStrength.id);
    switch (id) {
      case 0:
        return 'error';
      case 1:
        return 'error';
      case 2:
        return 'warning';
      default:
        return 'success';
    }
  };

  async function formSubmit() {
    if (username.length < 1 || password.length < 1) return;

    buttonsEnabled = false;

    const { result, message, token } = await API.post(`user/${isRegister ? 'register' : 'login'}`, {
      name: username,
      password,
      email,
    });

    buttonsEnabled = true;

    if (!result)
      return swal({
        text: message,
        icon: 'error',
      });

    localStorage.setItem('token', token);
    navigate('/', {
      state: { from: $location.path },
      replace: true,
    });
  }
</script>

<main class="flex justify-center items-center h-screen overflow-y-hidden bg-slate-700">
  <form on:submit|preventDefault={formSubmit} class="form-control lg:w-1/4">
    <h4 class="text-2xl text-center">Reddit Svelte</h4>
    <h5 class="text-lg text-center mb-3">{isRegister ? 'Registration' : 'Login'}</h5>
    <input bind:value={username} type="text" placeholder="Username" class="input input-bordered w-full" maxlength="50" required />
    <input bind:value={password} type="password" placeholder="Password" class="input input-bordered w-full mt-3" required />
    {#if isRegister}
      <div class="flex items-center justify-between px-6 mt-2">
        <progress value={pStrength.id} class={`progress progress-${passwordColor()} w-48 mt-0.5`} max="3" />
        <div class={`text-${passwordColor()} mt-0.5`}>
          <i class="fa-solid fa-lock-a" />
          {pStrength.value}
        </div>
      </div>
      <input bind:value={password2} type="password" placeholder="Password 2x" class="input input-bordered w-full mt-3" required />
      <input bind:value={email} type="email" placeholder="E-mail" class="input input-bordered w-full mt-3" required />
    {/if}
    <button disabled={!buttonsEnabled} class="btn btn-primary mt-8" type="submit">
      {isRegister ? 'Register' : 'Login'}
      <div class="pl-1">
        {#if isRegister}
          <i class="fa-solid fa-user-plus" />
        {:else}
          <i class="fa-solid fa-arrow-right-to-bracket" />
        {/if}
      </div>
    </button>

    <button
      on:click|preventDefault={() => (isRegister = !isRegister)}
      disabled={!buttonsEnabled}
      class="btn btn-secondary btn-sm w-1/2 mx-auto mt-4">{isRegister ? 'Back' : 'Register now'}</button
    >
  </form>
</main>
