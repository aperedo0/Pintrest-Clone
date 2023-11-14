const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  birthdate: Date,
});

UserSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
