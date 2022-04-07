const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureFlash: true,
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!email || !password || !confirmPassword) {
    errors.push({ message: '除了名字外都是必填'})
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不符' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        console.log('User already exists')
        res.render('register', {
          name,
          email,
          password,
          confirmPassword
        })
      } else {
        return User.create({
          name,
          email,
          password
        })
          .then(() => res.redirect('/'))
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('succee_msg', '你已經成功登出')
  res.redirect('/users/login')
})

module.exports = router