const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const config = require('./config/database')

mongoose.connect('mongodb://localhost/nodekb')
let db = mongoose.connection

// Check connection
db.once('open', () => console.log('Connected to MongoDB'))

// Check for db errors
db.on('error', (err) => console.log(err))

// Init App
const app = express()

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

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')))

// Express Session Middleware
app.use(session({secret: 'keyboard cat', resave: true, saveUninitialized: true}))

// Express Messages Middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res)
  next()
});

// Passport config
require('./config/passport')(passport)
// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null
  next()
})

// Home Route
app.get('/', (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) console.log(err)
    else res.render('index', { title: 'Articles', articles: articles })
  })
})

// Dashboard Route
app.get('/dashboard', (req, res) =>
  Article.find({}, (err, articles) =>{
    if (err) console.log(err)
    else res.render('dashboard', { articles: articles })
  }))

// Route filter
app.use('/articles', require('./routes/articles'))
app.use('/users', require('./routes/users'))

// Start Server
app.listen('3000', () => {
  console.log('Server started on port 3000...')
})
