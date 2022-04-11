const express = require('express')
const router = express.Router()

const Expense = require('../../models/record')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  const userId = req.user._id
  Category.find()
    .lean()
    .then(categorys => {
      Expense.find({ userId })
        .populate('categoryId')
        .lean()
        .sort({ data: 'asc' })
        .then((expenses => {
          let totalAmount = 0
          expenses.forEach(expense => {
            totalAmount += Number(expense.amount)
          })
          return res.render('index', { expenses, totalAmount, categorys })
        }))
        .catch(err => console.log(err))
    })
})


router.post('/', (req, res) => {
  const { selectedCategoryId } = req.body
  const userId = req.user._id
  if (selectedCategoryId) {
    Category.find({}) //排除該選項id 
      .lean()
      .then(elseSelectedCategory => {
        Category.findById(selectedCategoryId)
          .lean()
          .then(SelectedCategory => {
            return Expense.find({ userId, categoryId: selectedCategoryId })
              .populate('categoryId')
              .lean()
              .then(expenses => {
                let totalAmount = 0
                expenses.map(expense => {
                  totalAmount += Number(expense.amount)
                })
                res.render('index', { expenses, totalAmount, SelectedCategory, categorys: elseSelectedCategory })
              })
          })
      })
  } else {
    res.redirect('/')
  }
})

module.exports = router