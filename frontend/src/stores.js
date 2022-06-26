import { writable, derived } from 'svelte/store';

export const currentUser = writable();

export function logout() {
  currentUser.set();
  localStorage.removeItem('token');
}

export const messages = writable([]);

export const sortedMessages = derived(messages, ($messages) => {
  return [...$messages].sort((a, b) => {
    return b.reactions > a.reactions;
  });
});

export const replyWrite = writable(false);
