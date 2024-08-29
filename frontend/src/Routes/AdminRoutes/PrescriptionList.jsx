import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePatient, getAllPatient, getSinglePatient } from '../../Redux/AdminReducer/action';
import { useNavigate } from 'react-router-dom';
import CustomBreadcrumbs from '../../Components/CommonComponents/CustomBreadcrumbs';
import CustomInput from '../../Components/CommonComponents/CustomInput';
import DeleteConfirmatationModal from '../../Components/CommonComponents/DeleteConfirmatationModal';
import CustomSelect from '../../Components/CommonComponents/CustomSelect';
import PaginationButtons from '../../Components/CommonComponents/PaginationButtons';
import CustomSpinner from '../../Components/CommonComponents/CustomSpinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as types from '../../Redux/AdminReducer/actionTypes';

export default function PrescriptionList() {
  // Redux selectors to access state
  const { getAllPatientProcessing, getAllPatientSuccess, getAllPatientData, deletePatientMessage, deletePatientFail, deletePatientSuccess, deletePatientProcessing } = useSelector((state) => state.AdminReducer);
  const dispatch = useDispatch();
  const [query, setQuery] = useState({ search: '', page: 1, limit: 10 });
  const debounceTimer = useRef(null);
  const navigate = useNavigate();

  // Function to fetch data when the query changes
  const fetchData = () => {
    dispatch(getAllPatient(query));
  };

  // useEffect to fetch the list of Patients when the component mounts
  useEffect(() => {
    // Clear the previous timer when query changes
    dispatch({ type: types.GET_ALL_PATIENT_PRESCRIPTION_DATA, payload: null });
    clearTimeout(debounceTimer.current);

    // Set a new timer to execute fetchDataWithDebounce after a delay
    debounceTimer.current = setTimeout(fetchData, 500);

    // Cleanup the timer on component unmount
    return () => clearTimeout(debounceTimer.current);
  }, [query]);

  // delete toast messaeg and fecth latest data
  useEffect(() => {
    // fetch data if delete success
    if (!deletePatientProcessing && deletePatientSuccess) {
      toast.success(deletePatientMessage, { position: toast.POSITION.TOP_RIGHT });
      fetchData();
    } else if (!deletePatientProcessing && deletePatientFail) {
      toast.error(deletePatientMessage, { position: toast.POSITION.TOP_RIGHT });
    }
  }, [deletePatientSuccess, deletePatientFail, deletePatientProcessing]);

  return (
    <div className="">
      {/* Conditional rendering based on loading, success, or failure */}

      {getAllPatientProcessing ? (
        <div style={{ marginTop: '20vh' }}>
          <CustomSpinner />
        </div>
      ) : (
        ''
      )}

      {/* // Display the table when data is loaded successfully */}
      {!getAllPatientProcessing && getAllPatientSuccess && getAllPatientData.length > 0 ? (
        <div className="flex justify-center flex-col  ">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead>
                <tr className="text-left text-xs bg-primary-400 font-medium text-primary-50 uppercase tracking-wider">
                  <th className="px-4 py-3 border border-gray-300">Patient Name</th>
                  <th className="px-4 py-3 border border-gray-300">Patient ID</th>
                  <th className="px-4 py-3 border border-gray-300">More Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getAllPatientData.map((item, index) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">
                      {item.firstName} {item?.surname}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">{item?.customerId}</td>
                    <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">
                      <span
                        onClick={() => {
                          dispatch(getSinglePatient(item));
                          {
                          }
                          navigate(`/prescription/add/${item?._id}`);
                        }}
                        className="bg-gray-100 cursor-pointer text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-500"
                      >
                        View
                      </span>
                      <DeleteConfirmatationModal
                        isSuccess={deletePatientSuccess}
                        isProcessing={deletePatientProcessing}
                        deleteFunction={() => {
                          dispatch(deletePatient(item._id));
                        }}
                        text={item.firstName + ' ' + item.surname}
                        heading={'Delete Prescription'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* limit selector and page change buttons */}
          <div className="flex justify-between ">
            <CustomSelect
              options={[10, 25, 50, 75, 100]}
              onChange={(e) => {
                setQuery({ ...query, limit: e.target.value });
              }}
              value={query.limit}
              placeholder={`limit per page.`}
            />
            {/* paginatation buttons */}
            <PaginationButtons
              onPreviousClick={() => {
                setQuery({ ...query, page: query.page - 1 });
              }}
              onNextClick={() => {
                setQuery({ ...query, page: query.page + 1 });
              }}
              isPreviousDisabled={query.page === 1}
              isNextDisabled={getAllPatientData.length < query.limit}
            />
          </div>
        </div>
      ) : (
        //  no data found text
        !getAllPatientProcessing && <div className="text-center text-gray-500 mt-4 text-3xl">No Patients</div>
      )}

      <ToastContainer />
    </div>
  );
}
