const { Schema, model } = require('mongoose')

const schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
})
module.exports = model('user', schema)
