const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

// Bring in Models
const Article = require('../models/article')
// Bring in Users
const User = require('../models/user')

// Add Route
router.get('/add', ensureAuthenticated, (req, res) =>
  res.render('add_article', { title: 'Add Article' }))

// Add Submit POST Route
router.post('/add', [
  body('title', 'Title is required').not().isEmpty(),
  // body('author', 'Author is required').not().isEmpty(),
  body('body', 'Body is required').not().isEmpty()
  ], (req, res) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.render('add_article', {
      title: 'Add Article',
      errors: errors.mapped()
    })
  } else {
    new Article({
      title: matchedData(req).title,
      author: req.user._id,
      body: matchedData(req).body
    }).save((err) => {
      if (err) console.log(err)
      else {
        req.flash('success', 'Article Added')
        res.redirect('/')
      }
    })
  }
})

// load Edit Form
router.get('/edit/:id', ensureAuthenticated, (req, res) =>
  Article.findById(req.params.id, (err, article) => {
    if (err) console.log(err)
    else {
      if (article.author != req.user._id) {
        req.flash('danger', 'Not Authorized')
        res.redirect('/')
      } else {
        res.render('edit_article', {
          title: 'Edit Article',
          article: article
        })
      }
    }
  }))

// Update Submit POST Route
router.post('/edit/:id', [
  body('title', 'Title is required').not().isEmpty(),
  body('body', 'Body is required').not().isEmpty()
  ], (req, res) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    Article.findById(req.params.id, (err, article) => {
      if (err) console.log(err)
      else {
        res.render('edit_article', {
          title: 'Edit Article',
          article: article ,
          errors: errors.mapped()
        })
      }
    })
  } else {
    const query = {_id:req.params.id}
    const article = {
      title: matchedData(req).title,
      body: matchedData(req).body
    }
    Article.update(query, article, (err) => {
      if (err) console.log(err)
      else {
        req.flash('success', 'Article Updated')
        res.redirect('/')
      }
    })
  }
})

// Delete Article
router.delete('/:id', (req, res) => {
  if (!req.user._id) {
    res.status(500).send()
  }

  let query = {_id:req.params.id}

  Article.findById(req.params.id, (err, article) =>{
    if (article.author != req.user._id) {
      res.status(500).send()
    } else {
      Article.remove(query, (err) => {
        if (err) console.log(err)
        res.send('Success')
      })
    }
  })
})

// Get Single Article
router.get('/:id', (req, res) =>
  Article.findById(req.params.id, (err, article) => {
    if (err) console.log(err)
    else {
      User.findById(article.author, (err, user) => {
        res.render('article', {
          article: article,
          author: user.name
        })
      })
    }
  }))

// Access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    req.flash('danger', 'Please login')
    res.redirect('/users/login')
  }
}

module.exports = router
