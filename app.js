//config for process environment variables
// if (process.env.NODE_ENV !== 'production') {
//   import dotenv from ('dotenv')
//   .config()
// }

import express from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport'
import initializePassport from './passport-config.js'
import flash from 'express-flash' // to print message in ejs
import session from 'express-session'
import dotenv from 'dotenv'
import methodOverride from 'method-override'

//config
const app = express()
dotenv.config()
const PORT = 4001
initializePassport(
  passport, 
  email => users.find(user => user.email === email), //callback function for getUserByEmail
  id => users.find(user => user.id === id )
)
 
const users = []

// sets up for app
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))



// routes
app.get('/', (req, res) => {
  const user = req.user || { name: 'Guest' }
  res.render('index.ejs', { name: user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login', 
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    users.push({
      id: Date.now().toString(), 
      name: req.body.name, 
      email: req.body.email,
      password: hashedPassword
    })

    res.redirect('/login')

  } catch(err) {
    console.log(err)
    res.redirect('/register')
  }
  console.log(users)
})

// function checkAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next()
//   }
//   res.redirect('/login')
// }

app.delete('/logout', (req, res, next) => {
  req.logOut(err => {
    if (err) return next(err)
    res.redirect('/login')
  })
})

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(PORT, () => console.log(`App is listening on ${PORT}`))