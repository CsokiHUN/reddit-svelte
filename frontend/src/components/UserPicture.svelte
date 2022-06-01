<script>
  import api from '../services/api';
  import { currentUser } from '../stores';
  import Loading from './Loading.svelte';

  export let user = $currentUser;
  let classList = '';
  export { classList as class };

  async function getPicture() {
    if (user.picture) return user.picture;

    const { picture: newPicture } = await api.get(`user/picture/${user._id}`);

    return newPicture;
  }

  export let picture = getPicture();
</script>

{#await picture}
  <Loading />
{:then imgData}
  <img src={`${imgData}`} alt="" class={`w-10 h-10 rounded-full inline-block ${classList}`} />
{/await}
