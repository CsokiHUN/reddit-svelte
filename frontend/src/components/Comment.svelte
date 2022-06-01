<script>
  import dayjs from 'dayjs';

  import Reactions from './Reactions.svelte';
  import CommentButtons from './CommentButtons.svelte';
  import UserPicture from './UserPicture.svelte';
  import InputComment from './InputComment.svelte';

  import { currentUser, messages, replyWrite } from '../stores';
  import api from '../services/api';

  let classList = '';
  export { classList as class };
  export let user;
  export let comment = {};
  export let reactions = 0;

  let editing = false;
  let editedComment = '';

  // Comment button functions
  function toggleEditing() {
    editing = !editing;

    if (editing) editedComment = comment.message;
  }

  async function updateComment() {
    console.log(comment._id, editedComment);

    const {
      result,
      message,
      messages: newMessages,
    } = await api.post('message/update', {
      id: comment._id,
      text: editedComment,
    });

    editing = false;

    if (!result)
      return swal({
        text: message,
        icon: 'error',
      });

    messages.set(newMessages);
  }

  async function sendReply(message) {
    const {
      result,
      message: apiMessage,
      messages: newMessages,
    } = await api.post('message/new', {
      message,
      isReply: $replyWrite,
    });

    replyWrite.set(false);

    if (!result)
      return swal({
        text: apiMessage,
        icon: 'error',
      });

    messages.set(newMessages);
  }

  $: computedDate = dayjs(comment?.created || Date.now()).fromNow();
</script>

<div class={`mt-4 p-5 bg-gray-700 rounded-lg ${classList || ''}`}>
  <div class="grid grid-cols-12">
    <Reactions messageId={comment._id} value={reactions} class="hidden lg:block" />

    <div class="col-span-11">
      <div class="text-lg flex justify-between items-center flex-wrap">
        <div>
          <span class="font-bold mr-2">
            <UserPicture {user} />
            {user.name || 'Unknown'}
            {#if $currentUser._id === user?._id}
              <span class="bg-primary px-1 text-xs rounded">you</span>
            {/if}
          </span>
          <span class="text-gray-400 text-base">
            {computedDate}
          </span>
        </div>
        <CommentButtons {user} {comment} {reactions} {toggleEditing} class="hidden lg:block" />
      </div>

      <div class="my-2">
        {#if editing}
          <textarea bind:value={editedComment} class="input resize-none text-base px-1 py-0 m-0 w-full" cols="30" rows="10" />
          <button on:click={updateComment} class="btn btn-primary float-right mt-2"> Update </button>
        {:else}
          <p>
            {comment.message}
          </p>
        {/if}
      </div>
    </div>
  </div>
  <CommentButtons {user} {comment} {reactions} {toggleEditing} class="visible lg:hidden flex justify-between" />
</div>

{#if $currentUser._id !== user?._id && $replyWrite === comment?._id}
  <div class={classList}>
    <InputComment send={sendReply} buttonText={'Reply'} />
  </div>
{/if}
