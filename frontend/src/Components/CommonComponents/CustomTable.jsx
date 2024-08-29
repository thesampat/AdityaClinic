import React, { useEffect, useRef, useState } from "react";
import { END_POINT, deleteDoctor, getAllDoctor, getJwtToken, getSingleDoctor } from "../../Redux/AdminReducer/action";
import { useDispatch, useSelector } from "react-redux";
import CustomBreadcrumbs from "../../Components/CommonComponents/CustomBreadcrumbs";
import "react-toastify/dist/ReactToastify.css";
import CustomSpinner from "../../Components/CommonComponents/CustomSpinner";
import CustomInput from "../../Components/CommonComponents/CustomInput";
import PaginationButtons from "../../Components/CommonComponents/PaginationButtons";
import CustomSelect from "../../Components/CommonComponents/CustomSelect";
import DeleteConfirmatationModal from "../../Components/CommonComponents/DeleteConfirmatationModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useGetLoggedInUser } from "../../UtilityHookFunctions/LoggedInUser";

const fetchData = async (path, data) => {

  console.log(data)
  try {
    const result = await axios.get(`${END_POINT}/${path}`, {
      params:data,
      headers: {
        Authorization: getJwtToken(),
      },
    });
    return result;
  } catch (error) {
    toast.error(error?.response?.data || "Something went wrong");
    console.log("Check Error", error);
  }
};

const deleteData = async (path, itype) => {
  try {
    let result = await axios.delete(`${END_POINT}/${path}`, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    toast.success(`${itype} Deleted!`);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    toast.error(error?.response?.data || "Something went wrong");
    toast.error("Failed To Delete");
    console.log("Check Error", error);
  }
};

export default function CustomTable({ tablekeys, customHead, fetchUrl, Queries, DeleteUrl, View ,OtherModificationButton=null}) {
  const [tableData, setTableData] = useState(null);
  const user = useGetLoggedInUser();
  const { listType } = useParams();
  const [query, setQuery] = useState({ search: "", page: 1, limit: 10 });
  let tableHeading;
  let letModifedHeading;
  const navigate = useNavigate();
  const location = useLocation();

  tableHeading = tablekeys;
  letModifedHeading = customHead;

  useEffect(() => {
    setTableData(null);
    fetchData(fetchUrl, Queries).then((data) => setTableData(data?.data));
  }, [listType, Queries]);

  return (
    <div className="m-3 rounded-md bg-slate-100 px-8 w-full min-h-[100vh] h-fit py-8">
      <div className="flex justify-between flex-wrap items-center ">
        <div className=" -mt-5 mb-2">
          <CustomInput
            label={""}
            name="search"
            type={"text"}
            value={query.search}
            onChange={(e) => {
              setQuery({ ...query, search: e.target.value, page: 1 });
            }}
            placeholder={`Search`}

          />
        </div>
      </div>

      <div className="flex justify-center flex-col  ">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead>
              <tr className="text-left text-xs bg-primary-400 font-medium text-primary-50 uppercase tracking-wider">
                {tableHeading?.map((titlehead, index) => (
                  <th key={index} className="px-4 py-3 border border-gray-300">
                    {letModifedHeading?.[index]}
                  </th>
                ))}
                <th className="px-4 py-3 border border-gray-300">More Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData ? (
                tableData?.length <= 0 ? (
                  <tr>
                    <td colSpan={tableHeading?.length + 1} className="px-4 py-3 border border-gray-300 whitespace-nowrap">
                      <h5>No Data Found</h5>
                    </td>
                  </tr>
                ) : (
                  tableData?.map((item) => (
                    <tr key={item._id}>
                      {tableHeading?.map((itemKey, index) => (
                        <td key={index} className="px-4 py-3 border border-gray-300 whitespace-nowrap">
                          {["primary", "secondary", "third"].includes(itemKey) ? item?.diagnosis?.[itemKey] : item?.[itemKey]}
                        </td>
                      ))}

                      <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">
                        
                       { View &&
                        <span
                          onClick={() => {
                            navigate(`${item?._id}`);
                          }}
                          className="bg-gray-100 cursor-pointer text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-500"
                        >{View}</span>
                        }

                        {DeleteUrl && (
                          <DeleteConfirmatationModal
                            deleteFunction={() => {
                              deleteData(DeleteUrl, "Patient");
                            }}
                            text={item.name}
                            heading={"Delete Item"}
                          />
                        )}
                        <span>
                        {OtherModificationButton !== null && <OtherModificationButton item={item}/>}
                        </span>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan={tableHeading?.length + 1} className="px-4 py-3 border border-gray-300 whitespace-nowrap">
                    <CustomSpinner />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between ">
          <CustomSelect
            options={[10, 25, 50, 75, 100]}
            onChange={(e) => {
              setQuery({ ...query, limit: e.target.value });
            }}
            value={query.limit}
            placeholder={`limit per page.`}
          />
          <PaginationButtons
            onPreviousClick={() => {
              setQuery({ ...query, page: query.page - 1 });
            }}
            onNextClick={() => {
              setQuery({ ...query, page: query.page + 1 });
            }}
            isPreviousDisabled={query.page === 1}
            isNextDisabled={tableData?.length < query.limit}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
