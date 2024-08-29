import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAppointment, getSingleDoctor, updateAppointmentStatus } from '../../Redux/AdminReducer/action';
import { useNavigate, useParams } from 'react-router-dom';
import CustomSelect from '../../Components/CommonComponents/CustomSelect';
import PaginationButtons from '../../Components/CommonComponents/PaginationButtons';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomSpinner from '../../Components/CommonComponents/CustomSpinner';
import CustomBreadcrumbs from '../../Components/CommonComponents/CustomBreadcrumbs';
import CustomInput from '../../Components/CommonComponents/CustomInput';

export default function AppointmentList() {
  // Redux selectors to access state
  const { getAllAppointmentProcessing, getAllAppointmentSuccess, getAllAppointmentFail, getAllAppointmentData } = useSelector((state) => state.AdminReducer);
  const dispatch = useDispatch();
  const [query, setQuery] = useState({ search: '', page: 1, limit: 10 });
  const debounceTimer = useRef(null);
  const navigate = useNavigate();
  const { listType } = useParams();

  // Function to fetch data when the query changes
  const fetchData = () => {
    dispatch(getAllAppointment(query, listType));
  };

  useEffect(() => {
    fetchData();
  }, [query]);

  return (
    <div className="mt-4 px-8 w-full ">
      <div className="flex justify-between flex-wrap items-center ">
        {/* Breadcrumbs */}
        <CustomBreadcrumbs data={[{ title: 'Dashboard', url: '/dashboard' }, { title: 'appointments' }]} />

        {/* search input box */}
        <div className="mb-2">
          <CustomInput
            label={''}
            name="search"
            type={'text'}
            value={query.patient}
            onChange={(e) => {
              setQuery({ ...query, patient: e.target.value, page: 1 });
            }}
            placeholder={'Search Patient.'}
          />
        </div>
      </div>
      {getAllAppointmentData !== null ? (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead>
                <tr className="text-left text-xs bg-primary-400 font-medium text-primary-50 uppercase tracking-wider">
                  <th className="px-4 py-3 border border-gray-300">Book Date</th>
                  <th className="px-4 py-3 border border-gray-300">Book Time</th>
                  {/* <th className="px-4 py-3 border border-gray-300">Doctor</th> */}
                  <th className="px-4 py-3 border border-gray-300">Patient Name</th>
                  {/* <th className="px-4 py-3 border border-gray-300">Contact Number</th>
                  <th className="px-4 py-3 border border-gray-300">Status</th> */}
                  <th className="px-4 py-3 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {typeof getAllAppointmentData == 'object' &&
                  getAllAppointmentData
                    ?.sort((a, b) => new Date(b.bookDate) - new Date(a.bookDate))
                    ?.map((item, index) => (
                      // bookTimeSlot
                      <tr key={item._id}>
                        {console.log(item, 'item appointment data')}
                        <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">{item?.bookDate?.split('T')?.[0]}</td>
                        <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">
                          {item?.bookTimeSlot?.startTime} - {item?.bookTimeSlot?.endTime}
                        </td>
                        {/* <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">{item?.doctor?.name}</td> */}
                        <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">{item?.patient?.name}</td>
                        {/* <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">{item?.patient?.phone}</td> */}
                        {/* <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">{item?.status}</td> */}
                        <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">
                          <span
                            onClick={() => {
                              dispatch(updateAppointmentStatus(item?._id, 'Cancelled'));
                            }}
                            className="bg-red-300 cursor-pointer text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-500"
                          >
                            Cancel Appointment
                          </span>
                          {item?.patient?.id && (
                            <span
                              onClick={() => {
                                navigate(`/prescription/add/${item?.patient?.id}`);
                              }}
                              className="bg-red-300 cursor-pointer text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-500"
                            >
                              Prescription
                            </span>
                          )}
                          <span
                            onClick={() => {
                              navigate(`/appointment/${item?._id}/${item?.doctor?.id}`);
                            }}
                            className="bg-red-300 cursor-pointer text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-500"
                          >
                            Update
                          </span>
                          {/* <DeleteConfirmatationModal
                        isSuccess={deletePatientSuccess}
                        isProcessing={deletePatientProcessing}
                        deleteFunction={() => {
                          dispatch(deletePatient(item._id));
                        }}
                        text={item.firstName + ' ' + item.surname}
                        heading={'Delete Prescription'}
                      /> */}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>

            {getAllAppointmentData?.length == 0 && <div className="text-center w-[100vw] text-gray-500 mt-4">No data found found</div>}
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
            <PaginationButtons
              onPreviousClick={() => {
                setQuery({ ...query, page: query.page - 1 });
              }}
              onNextClick={() => {
                setQuery({ ...query, page: query.page + 1 });
              }}
              isPreviousDisabled={query.page === 1}
              isNextDisabled={getAllAppointmentData?.length < query.limit}
            />
          </div>
        </div>
      ) : (
        <CustomSpinner />
      )}

      <ToastContainer />
    </div>
  );
}
