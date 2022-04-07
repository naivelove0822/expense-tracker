const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
module.exports = app => {
  //初始化模組
  app.use(passport.initialize())
  app.use(passport.session())
  //設定本地登入政策
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true}, (req, email, password, done) => {
    User.findOne({ email })
    .then(user => {
      if (!user) {
        return done(null, false, req.flash('error', 'User not register!'))
      }
      return bcrypt.compare(password, user.password)
      .then(isMatch => {
        if (!isMatch) {
          return done(null, false, req.flash('error', 'Email or password incorrect!'))
        }
        return done(null, user)
      })
    })
    .catch(err => done(err, false))
  }))
  // 序列化語反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, false))
  })
}