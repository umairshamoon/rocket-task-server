const { Schema, model } = require('mongoose')

const schema = new Schema({
  name: String,
  description: String,
  height: Number,
  diameter: Number,
  mass: Number,
  photo: String,
  date: { type: Date, default: Date.now() },
  addedBy: { type: Schema.Types.ObjectId, ref: 'user' },
})
module.exports = model('rocket', schema)
