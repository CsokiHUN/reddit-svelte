const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const fs = require('fs');
const DEFAULT_USER_ICON = fs.readFileSync('./public/default-user-icon.png', { encoding: 'base64' });

const UserSchema = model(
  'User',
  new Schema({
    name: String,
    password: String,
    email: String,
    picture: { type: String, default: `data:image/png;base64,${DEFAULT_USER_ICON}` },
    registerDate: { type: Date, default: Date.now },
    lastLoginDate: { type: Date, default: Date.now },
  })
);

module.exports = { UserSchema, DEFAULT_USER_ICON };
