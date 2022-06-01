<script>
  import { messages } from '../stores';
  import api from '../services/api';

  let classList = '';
  export { classList as class };
  export let value = 0;
  export let messageId = 0;

  let disabled = false;

  async function update(typ) {
    if (messageId === undefined) return;

    disabled = true;

    const {
      result,
      message,
      messages: newMessages,
    } = await api.post('message/updateReactions', {
      messageId,
      typ,
    });

    disabled = false;

    if (!result)
      return swal({
        text: message,
        icon: 'error',
      });

    messages.set(newMessages);
  }
</script>

<main class={`text-xl bg-gray-600 rounded-md grid lg:grid-cols-1 grid-cols-3 text-center p-2 w-fit h-fit ${classList}`}>
  <button on:click={() => update('increase')} {disabled}>
    <i class="fa-solid fa-plus" />
  </button>
  <p class={`font-bold px-0.5 lg:px-0 ${value < 0 ? 'text-error' : value > 0 ? 'text-success' : ''}`}>
    {value || 0}
  </p>
  <button on:click={() => update('decrease')} {disabled}>
    <i class="fa-solid fa-minus" />
  </button>
</main>
