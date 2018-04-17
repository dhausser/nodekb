const express = require('express')
const router = express.Router()
// const JiraApi = require('jira-client')
//
// const jira = new JiraApi({
//   protocol: 'https',
//   host: 'jira.atlassian.com',
//   apiVersion: '2',
//   strictSSL: true
// })
//
// // Async Middleware
// const asyncMiddleware = fn =>
//   (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// // Dashboard Route
// router.get('/', asyncMiddleware(async (req, res, next) => {
//   const result = await jira.searchJira('project=JRASERVER', {
//     startAt: '0',
//     maxResults: '5'
//   })
//   res.render('dashboard', { issues: result.issues })
// }))

// Access control
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    req.flash('danger', 'Please login')
    res.redirect('/users/login')
  }
}

module.exports = router
