const mongoose = require('mongoose');


const incomeAndExpensesSchema = new mongoose.Schema({
    year: String,
    month: String,
    totalIncome:Number,
    totalExpense:Number,
    data: [
      {
      dtype: { type: String, enum: ["item", "total"] },
      year: Number,
      month: Number,
      title: String,
      item: String,
      income: Number,
      expense: Number,
      day:Number,
    }]
  });
  

  const subHeadingShortcuts = new mongoose.Schema({
    'title': String,
    'items': [String]
})


const IncomeAndExpensesShortCutsSchema = new mongoose.Schema({
    'year': '',
    'data': [subHeadingShortcuts]
})


  const IncomeAndExpensesModel = mongoose.model('IncomeAndExpenses', incomeAndExpensesSchema);
  const IncomeAndExpensesShortcutsModel = mongoose.model('IncomeAndExpensesShortCuts', IncomeAndExpensesShortCutsSchema);

  module.exports = { IncomeAndExpensesModel, IncomeAndExpensesShortcutsModel };
