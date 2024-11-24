const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdLists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShoppingList',
    },
  ],
  sharedLists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShoppingList',
    },
  ],
});

userSchema.statics.signup = async function (name, surname, email, password) {

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ name, surname, email, password: hash });
  return user;
};

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Email does not exist.');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('Incorrect password.');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
