const express = require('express')
const router = express.Router()
const ensureAuthenticated = require('../config/ensureAuth')

const asyncMiddleware = fn =>
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Dashboard Route
router.get('/', ensureAuthenticated, asyncMiddleware(async (req, res, next) => {
  const issues = await require('../config/issue').search()
  res.render('dashboard', { issues: issues })
}))

module.exports = router
