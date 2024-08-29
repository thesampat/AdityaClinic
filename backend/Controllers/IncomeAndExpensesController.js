const express = require('express');
const { IncomeAndExpensesShortcutsModel, IncomeAndExpensesModel } = require('../Models/IncomeAndExpensesModel');
const { restart } = require('nodemon');
const { insertMany } = require('../Models/Feedback');
const { default: mongoose } = require('mongoose');
const router = express.Router();


router.post('/:day/:month/:year', async (req, res) => {
  let { month, year } = req.params;

  const { updates, entries, deletes, total } = req.body || {};

  console.log(updates, entries, deletes )

  month = String(month.padStart(2, '0'));
  year = String(year);

  try {
    let existingDoc = await IncomeAndExpensesModel.findOne({ year: req.params.year, month: req.params.month });

    if (!existingDoc) {
      if (entries && entries.length > 0) {
        let i = await IncomeAndExpensesModel.create({
          year: year,
          month: month,
          totalIncome: total?.totalMonthlyIncome,
          totalExpense: total?.totalMonthlyExpense,
          data: [...entries]
        });

        i.save();
      } else {
        return res.status(400).send("No data to create");
      }
    } else {
      if (updates && updates.length > 0) {
        updates.forEach((update) => {
          const index = existingDoc.data.findIndex((item) => item._id.toString() === update._id.toString());
          if (index !== -1) {
            existingDoc.data[index] = update;
          } else {
            existingDoc.data.push(update);
          }
        });
      }

      if (entries && entries.length > 0) {
        existingDoc.data = [...existingDoc.data, ...entries];
      }

      if (deletes && deletes.length > 0) {
        existingDoc.data = existingDoc.data.filter((item) => !deletes.find((deleteItem) => item._id.toString() === deleteItem._id.toString()));
      }

      if (total) {
        existingDoc.totalIncome += total?.totalMonthlyIncome;
        existingDoc.totalExpense += total?.totalMonthlyExpense;
      }

      await existingDoc.save();
    }

    return res.status(200).send("created/updated");
  } catch (error) {
    console.log(error);
    return res.status(400).send("failed to create/update data");
  }
});

router.patch('/:day/:month/:year', async (req, res) => {
  let { data, total } = req.body||{};
  let { day, month, year } = req.params;
  let {totalMonthlyExpense, totalMonthlyIncome} = total||{}

  day = parseInt(day);
  month = String(month.padStart(2, '0'));
  year = String(year);

  try {
    const doc = await IncomeAndExpensesModel.findOne({ year: year, month: month });
    if (!doc) {
      return res.status(300).send("Document not found");
    }

    doc.totalIncome = totalMonthlyIncome;
    doc.totalExpense = totalMonthlyExpense;

    data.forEach(item => {
      const dataIndex = doc.data.findIndex(existingItem => existingItem._id == item._id);
      if (dataIndex !== -1) {
        doc.data[dataIndex] = item;
      } else {
        doc.data.push(item);
      }
    });

    await doc.save();
    res.send({ message: "Updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error updating document" });
  }
});


router.post('/delete/:day/:month/:year', async (req, res) => {
  let { data, total } = req.body||{};
  let { day, month, year } = req.params;
  let {totalMonthlyExpense, totalMonthlyIncome} = total||{}

  day = parseInt(day);
  month = String(month.padStart(2, '0'));
  year = String(year);

  try {
    const doc = await IncomeAndExpensesModel.findOne({ year: year, month: month });
    if (!doc) {
      return res.status(300).send("Document not found");
    }

    doc.totalIncome = totalMonthlyIncome;
    doc.totalExpense = totalMonthlyExpense;

    data.forEach(item => {
      const dataIndex = doc.data.findIndex(existingItem => existingItem._id == item._id);
      if (dataIndex !== -1) {
        doc.data.splice(dataIndex, 1);
      }
    });

    await doc.save();
    res.send({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error deleting entry" });
  }
});


router.get('/shortcuts', async (req, res) => {
  try {
      const { year } = req.query;

      // Find document for the specified year, month, and day
      const documents = await IncomeAndExpensesShortcutsModel.find({ 'year': parseInt(year) });

      return res.status(200).send(documents);
  } catch (error) {


      console.error(error);
      return res.status(500).send({ error: 'Internal server error' });
  }
});



router.post('/shortCuts', async (req, res) => {
    let { data, year } = req.body;
    year = parseInt(year)

    const IncomeAndExpensesData = await IncomeAndExpensesShortcutsModel.findOne({ year })

    if (IncomeAndExpensesData == null) {
        let create_entry
        try {
            create_entry = await IncomeAndExpensesShortcutsModel.create({
                year, data
            })
            return res.status(200).send("created")
        } catch (error) {
            console.log(error)
            return res.status(200).send("filed to create data")
        }

    }
    else {
        let update_entry
        try {
            update_entry = await IncomeAndExpensesShortcutsModel.findOneAndUpdate({ year: year }, { 'data': data }, { new: true })
            return res.status(200).send("updated")
        } catch (error) {


            console.log(error)
            return res.status(200).send("filed to update data")
        }
    }
});


router.get('/yearData/:month/:year/', async (req, res) => {
  try {
    const { month, year } = req.params;
    const monthString = String(month.padStart(2, '0'));
    const yearString = String(year);

    const pipeline = [
      { $match: { year: yearString } },
      { $unwind: "$data" },
      {
        $group: {
          _id: { title: "$data.title", item: "$data.item" },
          item: { $first: "$data.item" },
          title: { $first: "$data.title" },
          month:{$first:"$month"},
          income: { $sum: { $ifNull: ["$data.income", 0] } },
          expense: { $sum: { $ifNull: ["$data.expense", 0] } }
        }
      },
      {
        $group: {
          _id: "$title",
          title: { $first: "$title" },
          titleIncome: { $sum: "$income" },
          titleExpense: { $sum: "$expense" },
          month:{$first:"$month"},
          items: {
            $push: {
              item: "$item",
              income: "$income",
              expense: "$expense"
            }
          }
        }
      },
      {$sort:{month:1}},
       {
        $project: {
          _id: 0,
          title: 1,
          month:1,
          titleIncome: 1,
          titleExpense: 1,
          items: 1
        }
      }
    ];

    const result = await IncomeAndExpensesModel.aggregate(pipeline);

    if (result.length > 0) {
      return res.status(200).send(result);
    } else {
      return res.status(300).send({ error: 'No data found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal server error' });
  }
});


router.get('/monthData/:month/:year/', async (req, res) => {
  try {
    const { month, year } = req.params;
    const monthString = String(month.padStart(2, '0'));
    const yearString = String(year);

    const pipeline = [
      { $match: { month: monthString, year: yearString } },
      { $unwind: "$data" },
      {
        $group: {
          _id: { title: { $substr: ["$data.title", 2, { $strLenCP: "$data.title" }] }, item: "$data.item" },
          item: { $first: "$data.item" },
          title: { $first: { $substr: ["$data.title", 2, { $strLenCP: "$data.title" }] } },
          income: { $sum: { $ifNull: ["$data.income", 0] } },
          expense: { $sum: { $ifNull: ["$data.expense", 0] } }
        }
      },
      {
        $group: {
          _id: "$title",
          title: { $first: "$title" },
          titleIncome: { $sum: "$income" },
          titleExpense: { $sum: "$expense" },
          items: {
            $push: {
              item: "$item",
              income: "$income",
              expense: "$expense"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          title: 1,
          titleIncome: 1,
          titleExpense: 1,
          items: 1
        }
      }
    ];

    const result = await IncomeAndExpensesModel.aggregate(pipeline);

    if (result.length > 0) {
      return res.status(200).send(result);
    } else {
      return res.status(300).send({ error: 'No data found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal server error' });
  }
});





router.get('/dayData/:day/:month/:year', async (req, res) => {

  try {
    let { day, month, year } = req.params;

    day = parseInt(day);
    month = String(month.padStart(2, '0'));
    year = String(year);

    let data = await IncomeAndExpensesModel.aggregate([
      { $match: { year, month }},
      { $unwind: "$data" },
      { $match: { "data.day": day } },
      {$sort: {"data.title": 1}}

    ]);

    return res.status(200).send(data);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal server error' });
  }
});



router.get('/getTotalMonth/:month/:year/', async (req, res) => {
  try {
    let { month, year } = req.params;
    month = String(month.padStart(2, '0'));
    year = String(year);

    const pipeline = [
      { $match: { month, year } },
      {
        $unwind: "$data"
      },
      {
        $group: {
          _id: null,
          totalMonthlyIncome: { $sum: { $ifNull: ["$data.income", 0] } },
          totalMonthlyExpenses: { $sum: { $ifNull: ["$data.expense", 0] } }
        }
      },
       { $project:{
        _id:0}}
    ];

    const result = await IncomeAndExpensesModel.aggregate(pipeline);

    // const result = ''


    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal server error' });
  }
});

router.get('/getTotalYear/:month/:year/', async (req, res) => {
  try {
    let { month, year } = req.params;
    month = String(month.padStart(2, '0'));
    year = String(year);

    const pipeline = [
      { $match: { year } },
      {
        $group: {
          _id: null,
          totalYearlyIncome: { $sum: { $ifNull: ["$totalIncome", 0] } },
          totalYearlyExpenses: { $sum: { $ifNull: ["$totalExpense", 0] } }
        },
      
      },
      { 
        $project:{
        _id:0
      
    }}
    ];

    const result = await IncomeAndExpensesModel.aggregate(pipeline);

    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal server error' });
  }
});



module.exports = router;
