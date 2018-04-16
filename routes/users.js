const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { body, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

// Bring in Models
const User = require('../models/user')

// Register form
router.get('/register', (req, res) => {
  res.render('register')
})

// Register Process
router.post('/register', [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Email is required').not().isEmpty(),
  body('email', 'Email is not valid').isEmail(),
  body('username', 'Username is required').not().isEmpty(),
  body('password', 'Password is required').isLength({ min: 5 }).matches(/\d/),
  body('passwordConfirmation', 'Passwords do not match')
    .custom((value, { req }) => value === req.body.password)
], (req, res) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.render('register', { errors: errors.mapped() })
  } else {
    let newUser = new User(matchedData(req))
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) console.log(err)
        newUser.password = hash
        newUser.save((err) => {
          if (err) console.log(err)
          else {
            req.flash('success', 'You are now registered and can log in')
            res.redirect('/users/login')
          }
        })
      })
    })
  }
})

// Login Form
router.get('/login', (req, res) => res.render('login'))

// Login Process
router.post('/login', [
  body('username', 'Username is required').not().isEmpty(),
  body('password', 'Password is required').isLength({ min: 5 }).matches(/\d/)
], (req, res, next) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.render('login', { errors: errors.mapped() })
  } else {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next)
  }
})

// logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'You are logged out')
  res.redirect('/users/login')
})

module.exports = router
