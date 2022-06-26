<script>
  import swal from 'sweetalert';

  import UserPicture from '../components/UserPicture.svelte';
  import Loading from '../components/Loading.svelte';

  import { currentUser } from '../stores';
  import api from '../services/api';

  const MAX_FILE_SIZE = 20; //Mb

  let fileInput;
  let loading = false;

  function onFileSelected(e) {
    const file = e.target.files[0];

    if (file.size * 0.000001 > MAX_FILE_SIZE)
      return swal({
        text: 'Your file is too large!',
        icon: 'error',
      });

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async ({ target }) => {
      loading = true;

      const { result } = await api.post('user/picture', {
        picture: target.result,
      });

      if (!result) return;
      loading = false;
    };
  }

  let disabled = false;

  let password, password2;
  async function changePassword() {
    if (!password || !password2) return;

    if (password !== password2)
      return swal({
        text: 'Passwords not equal',
        icon: 'error',
      });

    disabled = true;

    const { result, message } = await api.post('user/changePassword', {
      password,
    });

    disabled = false;
    password = '';
    password2 = '';

    if (!result) {
      swal({
        text: message,
        icon: 'error',
      });
      console.log(message);
      return;
    }

    swal({
      text: message,
      icon: 'success',
    });
  }

  let email;
  async function changeEmail() {
    disabled = true;
    const { result, message } = await api.post('user/changeEmail', { email });

    disabled = false;

    if (!result) return swal({ text: message, icon: 'error' });

    swal({ text: message, icon: 'success' });
  }
</script>

<div class="w-1/2 mx-auto text-center">
  <div class="bg-gray-800 rounded-xl p-3">
    <div class="flex justify-center">
      <div class="grid grid-cols-1 justify-center">
        {#if loading}
          <Loading />
        {:else}
          <UserPicture class="w-36 h-36" />
        {/if}

        <div class="tooltip" data-tip="Change profile picture">
          <input type="file" accept="image/png, image/jpeg" class="hidden" on:change={(e) => onFileSelected(e)} bind:this={fileInput} />

          <button on:click={() => fileInput.click()} class="btn btn-circle text-lg mx-auto mt-3">
            <i class="fa-solid fa-pen-to-square" />
          </button>
        </div>
      </div>
    </div>

    <h2 class="text-xl mt-3">
      {$currentUser.name}
    </h2>

    <div class="grid grid-cols-2 gap-3">
      <form
        on:submit|preventDefault={() => changePassword()}
        class="grid grid-cols-1 mt-4 gap-3 border-2 border-gray-700 rounded-xl p-3 pt-1"
      >
        <h4 class="font-bold">Change Password</h4>
        <input bind:value={password} type="password" class="input input-sm" placeholder="Password" required />
        <input bind:value={password2} type="password" class="input input-sm" placeholder="Password 2x" required />
        {#if password === password2}
          <div class="text-success">
            Equal
            <i class="fa-solid fa-check" />
          </div>
        {:else}
          <div class="text-error">
            Not equal
            <i class="fa-solid fa-xmark" />
          </div>
        {/if}

        <button {disabled} type="submit" class="btn btn-sm btn-primary">Save Changes <i class="fa-solid fa-floppy-disk ml-1" /></button>
      </form>
      <form on:submit|preventDefault={() => changeEmail()} class="grid grid-cols-1 mt-4 gap-3 border-2 border-gray-700 rounded-xl p-3 pt-1">
        <h4 class="font-bold">Change Email</h4>

        <input bind:value={email} type="email" class="input input-sm" placeholder="E-mail" required />
        <button {disabled} type="submit" class="btn btn-sm btn-primary">Save Changes <i class="fa-solid fa-floppy-disk ml-1" /></button>
      </form>
    </div>
  </div>
</div>
