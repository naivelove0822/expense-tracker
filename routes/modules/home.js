const express = require('express')
const router = express.Router()

const Expense = require('../../models/record')
const Category = require('../../models/category')


router.get('/', async (req, res) => {
  const userId = req.user._id
  const { categoryId } = req.query
  const categories = await Category.find().lean()
  let expenses = []
  let totalAmount = 0

  if (categoryId) {
    const category = categories.find(category => {
      if (category._id.toString() === categoryId) {
        category.selected = 'selected'
        return category
      }
    })
    expenses = await Expense.find({ userId, categoryId })
      .populate('categoryId', { icon: 1 })
      .lean()
      .sort({ date: -1 })
  } else {
    expenses = await Expense.find({ userId })
      .populate('categoryId', { icon: 1 })
      .lean()
      .sort({ date: -1 })
  }
  expenses.forEach(expense => {
    totalAmount += Number(expense.amount)
  })
  res.render('index', { expenses, categories, totalAmount })
})

module.exports = router