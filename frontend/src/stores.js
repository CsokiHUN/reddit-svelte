import { writable, derived } from 'svelte/store';

export const currentUser = writable();

export function logout() {
  currentUser.set();
  localStorage.removeItem('token');
}

export const messages = writable([]);

// export const messages = writable([
//   {
//     messageId: 0,
//     user: {
//       name: 'Csoki',
//       id: 1,
//     },
//     message: 'Sziasztok első komment',
//     reactions: 0,
//   },
//   {
//     messageId: 1,
//     user: {
//       name: 'Orbán Viktor',
//       id: 2,
//     },
//     message: 'Ebből a háborúból ki kell maradnunk!',
//     reactions: 10,
//     replys: [2, 3],
//   },
//   {
//     messageId: 2,
//     user: {
//       name: 'Gyurcsány Ferenc',
//       id: 3,
//     },
//     message: 'Kurva anyád',
//     reactions: -10,
//   },
//   {
//     messageId: 3,
//     user: {
//       name: 'Jakab Matyi',
//       id: 4,
//     },
//     message: 'Itt a krumpli viki',
//     reactions: -11,
//   },
//   {
//     messageId: 4,
//     user: {
//       name: 'Putyin',
//       id: 5,
//     },
//     message: 'Sziasztok indul a csata',
//     reactions: 2,
//   },
// ]);

// export const comments = writable([0, 1, 4]);

// export const computedComments = derived([messages, comments], ([$messages, $comments]) => {
//   return $comments.map((messageId) => {
//     const msg = { ...$messages.find((m) => m.messageId === messageId) };
//     if (Object.entries(msg).length <= 0) return false;

//     if (msg.replys && msg.replys.length > 0) {
//       msg.replys = msg.replys.map((replyId) => {
//         const replyMsg = { ...$messages.find((m) => m.messageId === replyId) };
//         if (Object.entries(replyMsg).length <= 0) return false;

//         replyMsg.parentMessageId = messageId;
//         replyMsg.isReply = true;
//         return replyMsg;
//       });

//       msg.replys.sort((a, b) => b.reactions > a.reactions);
//     }

//     return msg;
//   });
// });

export const sortedMessages = derived(messages, ($messages) => {
  return [...$messages].sort((a, b) => {
    return b.reactions > a.reactions;
  });
});

export const replyWrite = writable(false);
