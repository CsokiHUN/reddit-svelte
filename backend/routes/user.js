const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const tokenSecret = process.env.TOKEN_SECRET || 'unknowntokensecret';
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;

const { UserSchema, DEFAULT_USER_ICON } = require('../schema/User');
const { auth } = require('../auth.js');

router.post('/register', async (req, res) => {
  const { name, password, email } = req.body;

  if (!name || !password || !email) return res.json({ result: false, message: 'Unknown arguments!' });

  const usernameExists = await UserSchema.findOne({ name }).exec();

  if (usernameExists)
    return res.json({
      result: false,
      message: 'Username already taken!',
    });

  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  const newUser = new UserSchema({
    name,
    password: hashedPassword,
    email,
  });

  await newUser.save();

  const token = jwt.sign({ _id: newUser._id, name: newUser.name, email: newUser.email }, tokenSecret);

  res.json({
    result: true,
    message: 'Successfully registered!',
    token,
  });
});

router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password)
    return res.json({
      result: false,
      message: 'Username or password invalid!',
    });

  const user = await UserSchema.findOne({ name });

  if (!user)
    return res.json({
      result: false,
      message: 'User not exists!',
    });

  const passwordValid = bcrypt.compareSync(password, user.password);

  if (!passwordValid)
    return res.json({
      result: false,
      message: 'Username or password invalid!',
    });

  const token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, tokenSecret);

  res.json({ result: true, message: 'Successfully logged in', token });
});

router.get('/picture/:userId', auth, async (req, res) => {
  let { userId } = req.params;
  if (!userId) userId = req.user._id;

  const user = await UserSchema.findOne({ _id: userId });

  if (!user) return res.json({ result: false, message: 'User not found!', picture: DEFAULT_USER_ICON });

  res.json({ result: true, picture: user.picture });
});

router.post('/picture', auth, async (req, res) => {
  const { picture } = req.body;
  if (!picture) return res.json({ result: false, message: 'Image not sent!' });

  await UserSchema.findOneAndUpdate({ _id: req.user._id }, { picture });

  res.json({
    result: true,
  });
});

router.post('/changePassword', auth, async (req, res) => {
  const { password } = req.body;
  if (!password) return res.json({ result: false, message: 'Password too short!' });

  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  await UserSchema.findOneAndUpdate({ _id: req.user._id }, { password: hashedPassword });

  res.json({
    result: true,
    message: 'Password changed successfully',
  });
});

router.post('/changeEmail', auth, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ result: false, message: 'E-mail invalid!' });

  await UserSchema.findOneAndUpdate({ _id: req.user._id }, { email });

  res.json({
    result: true,
    message: 'E-mail changed successfully',
  });
});

module.exports = router;
