<script>
  import UserPicture from './UserPicture.svelte';

  import { currentUser, messages } from '../stores';

  import api from '../services/api';

  let message = '';

  export let buttonText = 'Send';

  export let send = async () => {
    const {
      result,
      message: resultMessage,
      messages: newMessages,
    } = await api.post('message/new', {
      message,
    });

    if (!result)
      return swal({
        text: resultMessage,
        icon: 'error',
      });

    console.log('result update', newMessages);
    messages.set(newMessages);

    message = '';
  };
</script>

<div class="mt-3 mb-3 bg-slate-800 p-3 rounded-lg grid grid-cols-10 gap-3 items-center">
  <div class="hidden lg:block mx-auto">
    <UserPicture user={$currentUser} />
  </div>

  <textarea
    bind:value={message}
    class="input resize-none bg-slate-600 lg:col-span-7 col-span-10"
    cols="30"
    rows="10"
    placeholder="Add a comment..."
  />

  <div class="visible lg:hidden col-span-7">
    <UserPicture user={$currentUser} />
  </div>

  <button on:click={() => send(message)} class="btn btn-primary col-span-3 lg:col-span-2">{buttonText}</button>
</div>
