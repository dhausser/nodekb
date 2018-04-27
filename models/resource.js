const mongoose = require('mongoose')

// Resource Schema
let resourceSchema = mongoose.Schema({
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
  fullName: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  team: {
    type: String,
    required: true
  },
  holiday: {
    type: Number,
    default: Number()
  },
  timeoriginalestimate: {
    type: Number,
    default: Number()
  },
  timeestimate: {
    type: Number,
    default: Number()
  },
  timespent: {
    type: Number,
    default: Number()
  },
  issues: {
    type: Array,
    default: Array()
  },
  issuesTimeEstimates: {
    type: Array,
    default: Array()
  },
  issuesTimeOriginalEstimates: {
    type: Array,
    default: Array()
  },
  issuesTimeSpent: {
    type: Array,
    default: Array()
  }
})

module.exports = mongoose.model('Resource', resourceSchema)
