<script>
  import { onMount } from 'svelte';

  import Comment from '../components/Comment.svelte';
  import InputComment from '../components/InputComment.svelte';

  import { messages, sortedMessages } from '../stores';

  import api from '../services/api';

  onMount(async () => {
    const { result, messages: newMessages } = await api.get('message/all');

    if (!result) return;

    messages.set(newMessages);
  });
</script>

<main class="lg:w-4/6 mx-auto lg:p-0 p-10 lg:mt-6">
  {#each $sortedMessages as comment}
    <Comment user={comment._creator} {comment} reactions={comment.reactions || 0} />

    {#each (comment.replys || []).sort((a, b) => b.reactions > a.reactions) as reply}
      <Comment user={reply._creator} comment={reply} reactions={reply.reactions} class="ml-8 lg:ml-16" />
    {/each}
  {/each}

  <InputComment />
</main>
