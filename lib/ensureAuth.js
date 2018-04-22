module.exports = ensureAuthenticated

// Access control
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/users/login')
  }
}
