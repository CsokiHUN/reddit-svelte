const express = require('express');
const router = express.Router();

const { MessageSchema } = require('../schema/Message');
const { auth } = require('../auth.js');
router.use(auth);

async function getMessages() {
  const messages = (await MessageSchema.find({ isReply: '' }).populate(['_creator'])).filter((m) => m._creator);

  let newMessages = [];

  for await (const message of messages) {
    const replys = await MessageSchema.find({ isReply: message._id }).populate(['_creator']);
    newMessages = [...newMessages, { ...message._doc, replys }];
  }

  return newMessages;
}

router.get('/all', async (_, res) => {
  const messages = await getMessages();

  res.json({ result: true, messages });
});

router.delete('/', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.json({ result: false, message: 'Invalid messageId!' });

  const message = await MessageSchema.findById(id);
  if (!message) return res.json({ result: false, message: 'Message not found!' });

  if (message._creator.toString() !== req.user._id) return res.json({ result: false, message: 'Message is not yours!' });

  const { deletedCount } = await MessageSchema.deleteOne({ _id: id });

  if (deletedCount <= 0) return res.json({ result: false, message: 'Message invalid!' });

  res.json({
    result: true,
    message: 'Message deleted!',
    messages: await getMessages(),
  });
});

router.post('/new', async (req, res) => {
  const { message, isReply } = req.body;
  if (!message) return res.json({ result: false, message: 'Message is invalid!' });

  const newMessage = new MessageSchema({
    _creator: req.user._id,
    message,
    isReply,
  });

  await newMessage.save();

  const messages = await getMessages();

  res.json({ result: true, message: 'Message created.', messages });
});

router.post('/update', async (req, res) => {
  const { id, text } = req.body;
  if (!id || !text) return res.json({ result: false, message: 'Parameters invalid!' });

  const message = await MessageSchema.findById(id);
  if (!message) return res.json({ result: false, message: 'Message not found!' });

  await MessageSchema.findByIdAndUpdate(id, { message: text });

  res.json({
    result: true,
    message: 'Message updated.',
    messages: await getMessages(),
  });
});

router.post('/updateReactions', async (req, res) => {
  const { messageId, typ } = req.body;

  if (!messageId || !typ) return res.json({ result: false, message: 'Parameters invalid!' });
  if (typ !== 'increase' && typ !== 'decrease') return res.json({ result: false, message: 'Invalid type!' });

  const message = await MessageSchema.findById({ _id: messageId });
  const reactions = message.reactions + (typ === 'increase' ? 1 : -1);

  await MessageSchema.findByIdAndUpdate(messageId, { reactions });

  res.json({
    result: true,
    message: 'Updated.',
    messages: await getMessages(),
  });
});

module.exports = router;
