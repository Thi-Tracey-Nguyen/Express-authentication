import local from 'passport-local'
import bcrypt from 'bcrypt'

const LocalStrategy = local.Strategy

export default function initialize(passport, getUserByEmail, getUserById) {
  const autheticateUser = async (email, password, done) => {
     const user = getUserByEmail(email)

     if (user == null) return done(null, false, { message: 'No user with that email' })
     
     try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password does not match' })
      }
     } catch(err) {
      return done(err)
     }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' },
  autheticateUser))

  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => { 
    return done(null, getUserById(id))
  })
}