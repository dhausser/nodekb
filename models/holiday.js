const mongoose = require('mongoose')

// Resource Schema
let holidaySchema = mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Holiday', holidaySchema)
