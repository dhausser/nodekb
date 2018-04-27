const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const ensureAuthenticated = require('./config/ensureAuth')
const config = require('./config.json')
const JiraApi = require('jira-client')
const issue = require('./config/issue')
// const config = require('./config/database')

mongoose.connect('mongodb://localhost/nodekb')
const db = mongoose.connection

// Check connection
db.once('open', () => console.log('Connected to MongoDB'))

// Check for db errors
db.on('error', (err) => console.log(err))

// Init App
const app = express()

// Init Jira
const jiraClient = new JiraApi({
  protocol: 'https',
  host: config.host || 'jira.atlassian.com',
  username: config.username || String(),
  password: config.password || String(),
  apiVersion: '2',
  strictSSL: true
})


// Bring in Models
const Article = require('./models/article')
const Resource = require('./models/resource')
const Holiday = require('./models/holiday')
const Feature = require('./models/feature')

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

app.get('*', async (req, res, next) => {
  res.locals.user = req.user || null
  next()
})

// Home Route
app.get('/', ensureAuthenticated, asyncMiddleware(async (req, res, next) => {
  const issues = await issue.search({
    jiraClient: jiraClient,
    jql: config.jql
  })
  res.render('index', { issues: issues })
}))

// Route filter
app.use('/articles', require('./routes/articles'))
app.use('/users', require('./routes/users'))
app.use('/dashboard', require('./routes/dashboard'))

// Start Server
app.listen('3000', () => {
  console.log('Server started on port 3000...')
})
