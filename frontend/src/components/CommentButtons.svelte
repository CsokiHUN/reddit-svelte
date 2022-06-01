<script>
  import Reactions from './Reactions.svelte';

  import { currentUser, messages, replyWrite } from '../stores';

  import api from '../services/api';

  let classList = '';
  export { classList as class };
  export let user = { _id: 0 };
  export let comment;
  export let reactions = 0;
  export let toggleEditing;

  async function deleteMessage() {
    if (comment._id === undefined) return;

    const {
      result,
      message,
      messages: newMessages,
    } = await api.delete('message', {
      id: comment._id,
    });

    if (!result)
      return swal({
        text: message,
        icon: 'error',
      });

    messages.set(newMessages);
  }

  function startReplyWrite() {
    if ($replyWrite) return replyWrite.set(false);

    replyWrite.set(comment._id);
  }
</script>

<div class={classList || ''}>
  <Reactions messageId={comment?._id} value={reactions} class="visible lg:hidden" />

  <div class="flex items-center">
    {#if $currentUser._id === user?._id}
      <button on:click={deleteMessage} class="text-error mr-5">
        <i class="fa-solid fa-trash-can" />
        Delete
      </button>
      <button on:click={toggleEditing} class="text-info">
        <i class="fa-solid fa-pen" />
        Edit
      </button>
    {:else if !comment?.isReply}
      <button on:click={startReplyWrite} class="text-info">
        <i class="fa-solid fa-reply" />
        Reply
      </button>
    {/if}
  </div>
</div>
