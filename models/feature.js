const mongoose = require('mongoose')

// Resource Schema
let featureSchema = mongoose.Schema({
  wsjf: {
    type: Number,
    required: false
  },
  ml: {
    type: String,
    required: false
  },
  epic: {
    type: String,
    required: false
  },
  story: {
    type: String,
    required: false
  },
  stage: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  bv: {
    type: Number,
    required: false
  },
  tc: {
    type: Number,
    required: false
  },
  ro: {
    type: Number,
    required: false
  },
  size: {
    type: Number,
    required: false
  },
  url: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('Feature', featureSchema)
