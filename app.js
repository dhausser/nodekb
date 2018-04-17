const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const config = require('./config/database')
const JiraApi = require('jira-client')
const https = require('https')


mongoose.connect('mongodb://localhost/nodekb')
let db = mongoose.connection

// Check connection
db.once('open', () => console.log('Connected to MongoDB'))

// Check for db errors
db.on('error', (err) => console.log(err))

// Init App
const app = express()

// Init Jira
const jira = new JiraApi({
  protocol: 'https',
  host: 'jira.atlassian.com',
  apiVersion: '2',
  strictSSL: true
})

// Bring in Models
let Article = require('./models/article')

// Load View Engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Async Middleware
const asyncMiddleware = fn =>
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')))

// Express Session Middleware
app.use(session({secret: 'keyboard cat', resave: true, saveUninitialized: true}))

// Express Messages Middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Passport config
require('./config/passport')(passport)
// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    req.flash('danger', 'Please login')
    res.redirect('/users/login')
  }
}

app.get('*', async (req, res, next) => {
  res.locals.user = req.user || null
  next()
})

// Home Route
app.get('/', ensureAuthenticated, (req, res, next) => {
  res.redirect('dashboard')
  // const url = "https://jira.atlassian.com/rest/api/latest/search?JQL=project=JRASERVER"
  // let data = https.get(url, (resp) => {
  //   let data = ''
  //   resp.on('data', (chunk) => { data += chunk })
  //   resp.on('end', () => {
  //       issues = JSON.parse(data).issues
  //       Article.find({}, (err, articles) => {
  //         if (err) console.log(err)
  //         else res.render('index', { articles: articles, issues: issues })
  //       })
  //   }).on("error", (err) => { console.log("Error: " + err.message) })
  // })
})

// Dashboard Route
app.get('/dashboard', ensureAuthenticated, asyncMiddleware(async (req, res, next) => {
  const result = await jira.searchJira('project=JRASERVER', {
    startAt: '0',
    maxResults: '100'
  })
  res.render('dashboard', { issues: result.issues })
}))

// Route filter
app.use('/articles', require('./routes/articles'))
app.use('/users', require('./routes/users'))

// Start Server
app.listen('3000', () => {
  console.log('Server started on port 3000...')
})
