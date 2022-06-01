const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MessageSchema = model(
  'Message',
  new Schema({
    _creator: { type: Schema.Types.ObjectId, ref: 'User' },
    message: String,
    reactions: { type: Number, default: 0 },
    // replys: { type: Array, default: [] },
    created: { type: Date, default: Date.now },
    isReply: { type: String, default: '' },
  })
);

module.exports = { MessageSchema };
