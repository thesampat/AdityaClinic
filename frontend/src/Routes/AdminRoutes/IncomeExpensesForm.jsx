import React, { useEffect, useRef, useState } from "react";
import CustomSelect from "../../Components/CommonComponents/CustomSelect";
import calculateTotals from "./IncomeExpenseFunctionsAndComponents.jsx/totalCalculate";
import { getJwtToken } from "../../Redux/AdminReducer/action";
import { END_POINT } from "../../Redux/AdminReducer/action";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { IEButtonModal } from "./IncomeExpenseFunctionsAndComponents.jsx/popupModal";

let simpleData = [
  // { year: 2022, month: 1, title: "January Budget, Rent, Utilities", item: "Salary", income: 5000, : 2000 },
  // { year: 2022, month: 2, title: "January Budget, Rent, Utilities", item: "Freelance", income: 3000, : 2500 },
  // { year: 2022, month: 3, title: "January Budget, Rent, Utilities", item: "Investment", income: 2000, : 1500 },
  // { year: 2022, month: 4, title: "April Budget, Mortgage, Property Tax", item: "Part-time Job", income: 4000, : 3000 },
  // { year: 2022, month: 5, title: "April Budget, Mortgage, Property Tax", item: "Gift", income: 1000, : 1000 },
  // { year: 2022, month: 6, title: "April Budget, Mortgage, Property Tax", item: "Bonus", income: 6000, : 3500 },
  // { year: 2022, month: 7, title: "April Budget, Mortgage, Property Tax", item: "Dividend", income: 1500, : 2000 },
  // { year: 2022, month: 8, title: "August Budget, School , Books", item: "Selling Item", income: 2500, : 2500 },
  // { year: 2022, month: 9, title: "August Budget, School , Books, Medical", item: "Interest", income: 500, : 1500 },
  // { year: 2022, month: 10, title: "August Budget, School , Books", item: "Rental Income", income: 3000, : 2000 },
  // { year: 2022, month: 11, title: "December Budget, Christmas, Gifts", item: "Stock", income: 4000, : 3000 },
  // { year: 2022, month: 12, title: "December Budget, Christmas, Gifts", item: "Other Income", income: 2000, : 2500 }
];

const subtitleFormat = (month, year, day) => {
  return {
    dtype: "item",
    year: year,
    month: month,
    title: "",
    item: "",
    income: "",
    expense: "",
    day: day,
  };
};


const prepareData = (data, year, month, day, setFormData, formData) => {
  let pdate = data?.flatMap((g) => 
    g?.items?.map((i) => {
      if (!formData.some((fd) => fd.title == g?.title && fd.item == i)) {
        setFormData(prev => [...prev, {
          dtype: "item",
          year: year,
          month: month,
          title: g?.title,
          item: i,
          income: "",
          expense: "",
          day: day
        }]);
      }
    })
  );
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const getCalendarDatesFormatted = (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  return Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => ("0" + (i + 1)).slice(-2));
};

const createItem = async (data, setIsPorcessing, date, month, year) => {
  try {
    const result = await axios.post(`${END_POINT}/incomeExpenseMod/${date}/${month}/${year}`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    setIsPorcessing(false);
    toast.success("Saved Successfully");
  } catch (error) {
    toast.error(error?.response?.data || "Something went wrong");
    setIsPorcessing(false);
  }
};

const updateItem = async (data, setIsPorcessing, date, month, year) => {
  try {
    const result = await axios.patch(`${END_POINT}/incomeExpenseMod/${date}/${month}/${year}`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    setIsPorcessing(false);
    toast.success("Saved Successfully");
  } catch (error) {
    toast.error(error?.response?.data || "Something went wrong");
    setIsPorcessing(false);
  }
};

const deleteItem = async (data, setIsPorcessing, date, month, year) => {
  try {
    const result = await axios.post(`${END_POINT}/incomeExpenseMod/delete/${date}/${month}/${year}`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    setIsPorcessing(false);
    toast.success("Saved Successfully");
  } catch (error) {
    toast.error(error?.response?.data || "Something went wrong");
    setIsPorcessing(false);
  }
};

const fetchShortCuts = async (year) => {
  try {
    const result = await axios.get(`${END_POINT}/incomeExpense/shortcuts?year=${year}`, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    return result;
  } catch (error) {
    toast.error(error?.response?.data || "Something went wrong");
    console.log(error);

    toast.error("Something went wrong while fetching data");
  }
};

const fetchSingleItem = async (day, month, year) => {
  try {
    const result = await axios.get(`${END_POINT}/incomeExpenseMod/dayData/${day}/${month}/${year}`, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    return result;
  } catch (error) {
    toast.error(error?.response?.data || "Something went wrong");
    console.log(error);

    toast.error("Something went wrong while fetching data");
  }
};

const getTotal = async (month, year, dtype) => {
  try {
    const result = await axios.get(`${END_POINT}/incomeExpenseMod/${dtype}/${month}/${year}`, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    return result;
  } catch (error) {
    toast.error(error?.response?.data || "Something went wrong");
    console.log(error);

    toast.error("Something went wrong while fetching data");
  }
};

const fetchUniques = async (day, month, year, type) => {
  try {
    const result = await axios.get(`${END_POINT}/incomeExpense/specialQuery?day=${day}&&month=${month}&&year=${year}&&type=${type}`, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    return result;
  } catch (error) {
    toast.error(error?.response?.data || "Something went wrong");
    console.log(error);

    toast.error("Something went wrong while fetching data");
  }
};

const IncomeExpense = () => {
  return (
    <div className="m-3 rounded-md  bg-gray-100 h-[100vh]  w-full">
      <YourComponent />
    </div>
  );
};

const YourComponent = () => {
  const [deletedRows, setDeletedRows] = useState([]);
  const [isProcessing, setIsPorcessing] = useState(false);
  const dateString = new Date().toISOString().slice(0, 10).split("-");
  let totalConst = { totalIncome: 0, total: 0, totalMonthlyIncome: 0, totalMonthlyExpense: 0, totalYearlyIncome: 0, totalYearly: 0 };
  const [total, setTotal] = useState(totalConst);
  const [formData, setFormData] = useState(simpleData);
  const formRef = useRef();
  const [year, setYear] = useState(dateString?.[0]);
  const [month, setMonth] = useState(dateString?.[1]);
  const [date, setDate] = useState(dateString?.[2]);
  const [viewType, setViewType] = useState("regular");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [servertotal, setserverTotal] = useState({ totalMonthlyExpenses: 0, totalMonthlyIncome: 0 });

  useEffect(() => {
    fetchShortCuts(year)?.then((r) => {
     prepareData(r?.data?.[0]?.data, year, month, date, setFormData, formData);
    });
  }, [year, date]);

  useEffect(() => {
    if (["regular", "month"].includes(viewType)) {
      getTotal(month, year, "getTotalMonth").then((g) => {
        const { totalMonthlyExpenses = 0, totalMonthlyIncome = 0 } = g?.data?.[0] || {};
        setTotal((prev) => ({ ...prev, totalMonthlyIncome: 0, totalMonthlyExpense: 0 }));
        setserverTotal({ totalMonthlyExpenses: totalMonthlyExpenses, totalMonthlyIncome: totalMonthlyIncome });
      });
    } else {
      getTotal(month, year, "getTotalYear").then((g) => {
        const { totalYearlyExpenses = 0, totalYearlyIncome = 0 } = g?.data?.[0] || {};
        setTotal((prev) => ({ ...prev, totalYearlyExpense: totalYearlyExpenses, totalYearlyIncome: totalYearlyIncome }));
      });
    }
  }, [month, viewType]);

  useEffect(() => {
    setFormData([]);
    fetchSingleItem(date, month, year).then((res) => {
      if (res?.data?.length > 0) {
        let readTransactionsData = res.data;
        if (readTransactionsData?.length <= 0) {
          setFormData([]);
        }
        readTransactionsData?.map((r) => {
          setFormData((prev) => [...prev, r?.data]);
        });
      }
    });
  }, [year, month, date]);

  const handleCtrlS = async (event) => {
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();

      if (formData?.length > 0) {
        let patches = formData?.filter((u) => u?.update === true)?.filter((u) => u?._id !== undefined);
        let newEntries = formData?.filter((u) => u?.update === true)?.filter((u) => u?._id === undefined);
        if (formData.some(obj => 
          obj.title === undefined || obj.title === "" || 
          obj.item === undefined || obj.item === ""         )) {
          toast.error('Field Can Not Be Empty')
        }

        return

        await createItem({ updates: patches, entries: newEntries, deletes: deletedRows, total: total }, setIsPorcessing, date, month, year);

        //   if (newEntries?.length > 0 && patches?.length <= 0) {
        //      createItem({ data: newEntries, total: total }, setIsPorcessing, date, month, year).then(e=>{
        //       if (patches?.length > 0) {
        //         updateItem({ data: patches, total: total }, setIsPorcessing, date, month, year);
        //        }
        //      });
        //   }
        //   else if (newEntries?.length <= 0 && patches?.length > 0) {
        //     updateItem({ data: patches, total: total }, setIsPorcessing, date, month, year).then(e=>{
        //      if (newEntries?.length > 0) {
        //       createItem({ data: newEntries, total: total }, setIsPorcessing, date, month, year)
        //       }
        //     });
        //  }
        //  else if(newEntries?.length > 0 && patches?.length > 0){
        //   createItem({ data: newEntries, total: total }, setIsPorcessing, date, month, year).then(e=>{
        //     if (patches?.length > 0) {
        //       updateItem({ data: patches, total: total }, setIsPorcessing, date, month, year);
        //      }
        //    });
        //  }
      } else if (formData?.length <= 0) {
        toast.error("No changes to save", { position: toast.POSITION.TOP_RIGHT });
      }

      // if(deletedRows?.length>0){
      //    await deleteItem({ data: deletedRows, total: total }, setIsPorcessing, date, month, year)
      // }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleCtrlS);
    return () => {
      document.removeEventListener("keydown", handleCtrlS);
    };
  }, [date, year, month, total, formData]);

  return (
    <div className="border inexmain h-full p-2">
      <div className="a1 border w-full">
        <div className="mainTitleInEx w-full flex justify-between items-center">
          <h3 className="text-2xl font-bold ps-5">
            Income & Expenditure - {date}/{month}/{year}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-blue-400 rounded-lg self-center" onClick={(e) => setPopupOpen(true)}>
              Shortcu
            </button>
            <CustomSelect options={["2024", "2023", "2022", "2021"]} style={{ height: "10px", width: "150px" }} value={year} onChange={(e) => setYear(e.target.value)} name={"Year"} />
          </div>
        </div>
      </div>
      <div className="a2 h-full w-full flex gap-2 p-4">
        <div className="b1 w-[10vw] border">
          <div className="scrollViewMonth flex flex-col gap-2 border border h-full">
            <div className="border border bg-slate-300 text-center">
              <button className="p-1 bg-blue-400 text-black uppercase font-semibold text-sm w-full" onClick={(e) => setViewType("year")}>
                2023
              </button>
            </div>
            {monthNames?.map((e, i) => (
              <div className={`border px-2 border h-10 ${month === i + 1 ? "bg-green-400" : "bg-slate-300"} text-center rounded-lg mx-2 align-middle flex items-center justify-center`} key={i}>
                <button
                  onClick={() => {
                    setMonth(i + 1);
                    setViewType("regular");
                  }}
                  className={`monthName font-semibold`}
                >
                  {e}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="b2 w-full h-full flex flex-col border gap-3">
          <div className="b2Wrap1 flex ">
            <div className="c1">
              <div className="scrollViewDay flex flex-col gap-2 border h-[80vh] overflow-y-scroll">
                <div className="border border-gray-300 bg-slate-300 text-center sticky top-0 w-full">
                  <button className="p-1 bg-blue-400 text-black uppercase font-semibold text-sm" onClick={(e) => setViewType("month")}>
                    Month
                  </button>
                </div>
                {getCalendarDatesFormatted(year, month)?.map((e, i) => (
                  <div className={`border border-gray-300 ${date !== e ? "bg-slate-300" : "bg-green-400"} h-10 text-center rounded-lg mx-2 align-middle flex items-center justify-center`} key={i}>
                    <button
                      onClick={() => {
                        setDate(e);
                        setViewType("regular");
                      }}
                      className="dayName font-semibold"
                    >
                      {e}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="c2 flex flex-col w-full">
              <div className="d1 h-full">
                <IncomeExpenseTable viewType={viewType} disabled={false} formData={formData} setFormData={setFormData} year={year} month={month} date={date} setTotal={setTotal} formRef={formRef} totals={total} setDeletedRows={setDeletedRows} />
                {/* <ExpenseTracker /> */}
              </div>
              <div className="d2 grid grid-cols-4 gap-3 px-2">
                <h2 className="w-full font-bold text-lg text-center border rounded-lg bg-green-300 text-blue-800">{viewType === "regular" ? "Day" : "Month"}</h2>
                <h2 className="w-full font-bold text-lg text-center border rounded-lg bg-green-300 text-blue-800">{viewType == "regular" ? total?.totalIncome : viewType == "month" ? servertotal?.totalMonthlyIncome : total?.totalYearlyIncome}</h2>
                <h2 className="w-full font-bold text-lg text-center border rounded-lg bg-green-300 text-blue-800">{viewType == "regular" ? total?.totalExpenses : viewType == "month" ? servertotal?.totalMonthlyExpenses : total?.totalYearlyExpense}</h2>
                <h2 className="w-full font-bold text-lg text-center border rounded-lg bg-green-300 text-blue-800">
                  {viewType == "regular" ? total?.totalIncome - Math.abs(total?.totalExpenses) : viewType == "month" ? servertotal?.totalMonthlyIncome - Math.abs(servertotal?.totalMonthlyExpenses) : total?.totalYearlyIncome - Math.abs(total?.totalYearlyExpense)}
                </h2>
              </div>
            </div>
          </div>
          {!(viewType == "month" || viewType == "year") && (
            <div className="b2Wrap2 d2 grid grid-cols-4 gap-3 px-2">
              <h2 className="w-full font-bold text-lg text-center border rounded-lg bg-cyan-300 text-blue-800">{viewType === "regular" && "Month"}</h2>
              <h2 className="w-full font-bold text-lg text-center border rounded-lg bg-cyan-300 text-blue-800">{total?.totalMonthlyIncome + servertotal?.totalMonthlyIncome || 0}</h2>
              <h2 className="w-full font-bold text-lg text-center border rounded-lg bg-cyan-300 text-blue-800">{total?.totalMonthlyExpense + servertotal?.totalMonthlyExpenses || 0}</h2>
              <h2 className="w-full font-bold text-lg text-center border rounded-lg bg-cyan-300 text-blue-800">{(total?.totalMonthlyIncome || 0) - Math.abs(total?.totalMonthlyExpense || 0)}</h2>
            </div>
          )}
        </div>
      </div>
      {isPopupOpen && <IEButtonModal isPopupOpen={isPopupOpen} setPopupOpen={setPopupOpen} year={year} />}
    </div>
  );
};

function IncomeExpenseTable({ disabled, setFormData, formData, year, month, date, setTotal, totals, viewType, setDeletedRows }) {
  const inputRefs = useRef([]);
  const [rowletter, setRowletter] = useState({});
  const [idescription, setidescription] = useState({ description: "" });
  const [livetitle, setlivetitle] = useState("");
  let rowId = 0;

  const addRow = (title, rowid) => {
    setFormData((ed) => {
      const newRow = { ...subtitleFormat(month, year, date), title: title };
      const newFormData = [...ed, newRow];
      return newFormData?.sort((a, b) => a?.title?.localeCompare(b?.title));
    });

    // setTimeout(() => {
    //   focusOnInput(newIndex, subIndex);
    // }, 0);

  };

  const removeRow = (rowid, row) => {
    setDeletedRows((prev) => [...prev, row]);
    console.log(formData, "before");
    setFormData((prevFormData) => prevFormData.filter((_, i) => i !== rowid - 1));
    console.log(formData, "after");
  };

  // const removeSubtitle = (subIndex) => {
  //   let subtitleGroup = descriptionRecords?.map((k) => k.subTitle);
  //   if ([...new Set(subtitleGroup || [])]?.length <= 1) {
  //     return false;
  //   }

  //   const removediSubtitles = descriptionRecords.filter((record, index) => record?.subTitelIndex !== subIndex);
  //   setDescriptionsRecords(removediSubtitles);

  //   setFormData((prevFormData) => {
  //     const updatedData = [...prevFormData];
  //     updatedData.splice(subIndex, 1);
  //     return updatedData;
  //   });

  //   calculateTotals(removediSubtitles, setTotal, 'expense', totals);
  //   calculateTotals(removediSubtitles, setTotal, 'income', totals);
  // };
  const handleInputChange = (e, key, iindex, rowIndex) => {
    const { name, value } = e.target;

    setFormData((formData) => {
      return formData?.map((item, index) => {
        if (index + 1 == rowIndex) {
          let val = value;
          if (key === "title") {
            if (!String(value || "").startsWith(`${rowIndex}_`)) {
              val = `${rowIndex}_${value}`;
            }
          }
          return {
            ...item,
            [key]: val,
            ...(key === "income" && { expense: value !== "" ? null : "" }),
            ...(key === "expense" && { income: value !== "" ? null : "" }),
            update: true,
          };
        }
        return item;
      });
    });
  };

  useEffect(() => {
    if (totals !== undefined) {
      calculateTotals(formData, setTotal, totals);
    }
  }, [formData]);

  const focusOnInput = (subIndex, index) => {
    const refKey = `${subIndex}_${index}`;
    if (inputRefs.current?.[refKey]) {
      inputRefs.current[refKey].focus();
    }
  };

  return (
    <div>
      {viewType == "regular" && (
        <div class="flex flex-col h-[80vh]">
          <div class="flex-grow overflow-y-auto">
            <table className="relative w-full border">
              <thead>
                <tr className="text-center text-xs bg-primary-400 font-medium text-primary-50 uppercase tracking-wider">
                  <th className="sticky top-0 px-4 py-2 border border-gray-300">Description</th>
                  <th className="sticky top-0 px-4 py-2 border border-gray-300">Income</th>
                  <th className="sticky top-0 px-4 py-2 border border-gray-300">Expense</th>
                  <th className="sticky top-0 px-4 py-2 border border-gray-300">Gain</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 border-separate border-spacing-y-3">
                {[...new Set(formData?.map((g) => g?.title))]?.map((e, subIndex) => (
                  <React.Fragment key={subIndex}>
                    <tr className="mb-4">
                      <th colSpan="4" className="text-center">
                        <input
                          disabled={disabled}
                          type="text"
                          className="p-2 w-full border border-gray-300 rounded"
                          value={e !== "" ? e : livetitle}
                          id={subIndex}
                          name="title"
                          onChange={(n) => {
                            handleInputChange(n, "title", subIndex, rowId);
                          }}
                          // onKeyDown={(n) => {
                          //   if (n.key === 'Delete') {
                          //     removeSubtitle(subIndex);
                          //   }
                          //   else if(n.key ==='Tab'){
                          //     handleInputChange(n, e, 'title', subIndex, rowId);
                          //   }
                          // }}
                          // onBlur={(n) => {
                          //     handleInputChange(n, e, 'title', subIndex, rowId);

                          // }}
                        />
                      </th>
                    </tr>
                    {formData
                      ?.slice()
                      ?.sort((a, b) => a?.title?.localeCompare(b?.title))
                      ?.filter((m) => m?.title === e)
                      ?.map((row, index) => {
                        rowId += 1;
                        return (
                          <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                            <td className="text-center">
                              <input
                                disabled={disabled}
                                type="text"
                                className="p-2 w-full border border-gray-300 rounded"
                                name={`item`}
                                value={row?.item}
                                id={rowId}
                                onChange={(e) => {
                                  handleInputChange(e, "item", subIndex, e.target.id);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Delete") {
                                    removeRow(e.target.id, row);
                                    e.preventDefault();
                                  }
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <input
                                disabled={row?.income === null ? true : false}
                                type="text"
                                className="p-2 w-full border border-gray-300 rounded"
                                name={`income`}
                                value={row?.income}
                                id={rowId}
                                onChange={(e) => {
                                  handleInputChange(e, "income", subIndex, e.target.id);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <input
                                disabled={row.expense === null ? true : false}
                                type="text"
                                className="p-2 w-full border border-gray-300 rounded"
                                name={`expense`}
                                value={row?.expense}
                                id={rowId}
                                onChange={(e) => {
                                  handleInputChange(e, "expense", subIndex, e.target.id);
                                }}
                              />
                            </td>
                            <td className={`text-center ${row?.income !== null ? "text-green-500" : "text-red-500"}`}>
                              <input
                                onKeyDown={(n) => {
                                  n?.preventDefault()
                                  if (n.key === "Tab") {
                                    if(row?.item !=="" && (row?.income!==""||row?.expense!=="")){
                                      addRow(row?.title, e.target.id)

                                    }
                                  }
                                }}
                                id={rowId}
                                disabled={disabled}
                                type="text"
                                className="p-2 w-full border border-gray-300 rounded"
                                name={`gain`}
                                value={row?.income === null ? row?.expense : row?.income}
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                ))}
                <tr>
                  <td colSpan={4} className="text-center text-xl font-bold">
                    <button
                      onClick={(e) => {
                        setFormData((ed) => [...ed, subtitleFormat(month, year, date)]);
                        setlivetitle("");
                      }}
                      className="bg-gray-300 w-full"
                    >
                      +
                    </button>
                  </td>
                </tr>
              </tbody>
              <ToastContainer />
            </table>
          </div>
        </div>
      )}
      {["month", "year"].includes(viewType) && <MonthYearViewTable year={year} month={month} date={date} viewType={viewType} />}
    </div>
  );
}

const fetchMonthYearData = async (month, year, dtype) => {
  try {
    const result = await axios.get(`${END_POINT}/incomeExpenseMod/${dtype}/${month}/${year}`, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    return result;
  } catch (error) {
    toast.error(error?.response?.data || "Something went wrong");
    console.log(error);

    toast.error("Something went wrong while fetching data");
  }
};

const MonthYearViewTable = ({ year, month, date, viewType }) => {
  const [data, setdata] = useState(null);

  let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    fetchMonthYearData(month, year, viewType === "month" ? "monthData" : "yearData").then((res) => {
      if (res?.data?.length > 0) {
        let readTransactionsData = res.data;
        if (readTransactionsData?.length <= 0) {
          setdata([]);
        }

        console.log(readTransactionsData);
        setdata(readTransactionsData);
      }
    });
  }, [viewType]);

  return (
    <div class="flex flex-col h-[70vh]">
      <div class="flex-grow overflow-y-auto">
        <table class="relative w-full border">
          <thead>
            <tr>
              {viewType === "year" && <th className="sticky top-0 px-6 py-1 text-white bg-black">Month</th>}
              <th className="sticky top-0 px-6 py-1 text-white bg-black">Description</th>
              <th className="sticky top-0 px-6 py-1 text-white bg-black">Income</th>
              <th className="sticky top-0 px-6 py-1 text-white bg-black">Expense</th>
              <th className="sticky top-0 px-6 py-1 text-white bg-black">Gain</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            {data?.map((e, index) => (
              <>
                <tr>
                  {viewType === "year" && <td className="px-6 py-1 bg-cyan-100 text-center">{monthNames[Number(e?.month)]}</td>}
                  <td className="px-6 py-1 bg-cyan-100 text-center">{e?.title}</td>
                  <td className="px-6 py-1 bg-cyan-100 text-center">{e?.titleIncome}</td>
                  <td className="px-6 py-1 bg-cyan-100 text-center">{e?.titleExpense}</td>
                  <td className="px-6 py-1 bg-cyan-100 text-center">{e?.titleIncome - e?.titleExpense}</td>
                </tr>
                {/* {e?.items?.map((f) => {
                  return (
                    <tr>
                      <td className="px-6 py-1 bg-yellow-100 text-center">{f?.item}</td>
                      <td className="px-6 py-1 bg-yellow-100 text-center">{f?.income}</td>
                      <td className="px-6 py-1 bg-yellow-100 text-center">{f?.expense}</td>
                      <td className="px-6 py-1 bg-yellow-100 text-center">{f?.income - f?.expense}</td>
                    </tr>
                  );
                })} */}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomeExpense;
