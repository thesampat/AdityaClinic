

const calculateGain = (dataValue, i, itype) => {
  let total = itype == 'expense' ? Number(dataValue) - Number(i) : Number(dataValue) + Number(i);
  return total;
};

const calculateTotals = (values, setTotal, totals) => {
  let totalExpenses = 0;
  let totalIncome = 0;

  console.log(totals)

  values.forEach((item) => {
    if (item.expense !== null) {
      totalExpenses += parseFloat(item?.expense) || 0;
    }
    if (item.income !== null) {
      totalIncome += parseFloat(item.income) || 0;
    }
  });

  setTotal((prev) => ({
    ...prev,
    totalExpenses,
    totalIncome,
  }));

  const filterMonthly = values?.filter((u) => u?.update === true);

  if (filterMonthly.length > 0) {
    let totalMonthlyExpense = 0;
    let totalMonthlyIncome = 0;

    filterMonthly.forEach((item) => {
      if (item.expense !== null) {
        totalMonthlyExpense += parseFloat(item?.expense) || 0;
      }
      if (item.income !== null) {
        totalMonthlyIncome += parseFloat(item.income) || 0;
      }
    });

    setTotal((prev) => ({
      ...prev,
      totalMonthlyExpense,
      totalMonthlyIncome,
    }));
  }
};


export default calculateTotals;
