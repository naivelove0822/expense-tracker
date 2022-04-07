const express = require('express')
const router = express.Router()

const Expense = require('../../models/record')
const Category = require('../../models/category')

router.get('/new', (req, res) => {
  Category.find()
    .lean()
    .then(categorys => {
      return res.render('new', { categorys })
    })
})

router.post('/new', (req, res) => {
  const { name, date, amount, category } = req.body
  Category.findOne({ _id: category })
    .lean()
    .then(() => {
      return Expense.create({ name, date, amount, categoryId: category })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
})

router.get('/:id/edit', (req, res) => {
  const _id = req.params.id

  Expense.findOne({ _id })
    .populate('categoryId')
    .lean()
    .then(expense => {
      const selectedCategory = expense.categoryId
      Category.find({ _id: { $ne: expense.categoryId } }) //$ne 排除該選項id
        .lean()
        .then(category => {
          res.render('edit', { expense, selectedCategory, category })
        })
    })
    .catch(err => console.log(err))
})

router.put('/:id', (req, res) => {
  const editedRecord = req.body
  const _id = req.params.id

//利用object.assign去實現複製並覆蓋
  return Expense.findOne({ _id })
    .then(expense => {
      expense = Object.assign(expense, editedRecord)
      return expense.save()
    })
    .then(() => res.redirect('/')
    )
    .catch(err => console.log(err))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Expense.findById(id)
    .then(expense => expense.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router