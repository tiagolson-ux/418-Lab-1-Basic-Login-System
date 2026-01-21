const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Note to self: Tia, this pre-save hook hashes the password before saving if it's new or modified
userSchema.pre('save', async function(next) {
  console.log('Pre-save hook triggered for:', this.email);
  if (!this.isModified('password')) return next();
  console.log('Hashing password...');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log('Password hashed');
  next();
});

// Note to self: Tia, this method checks if the provided password matches the hashed one
userSchema.methods.isCorrectPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);