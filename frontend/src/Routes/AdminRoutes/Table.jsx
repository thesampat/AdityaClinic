import React, { useEffect, useRef, useState } from 'react';
import { END_POINT, deleteDoctor, getAllDoctor, getJwtToken, getSingleDoctor } from '../../Redux/AdminReducer/action';
import { useDispatch, useSelector } from 'react-redux';
import CustomBreadcrumbs from '../../Components/CommonComponents/CustomBreadcrumbs';
import 'react-toastify/dist/ReactToastify.css';
import CustomSpinner from '../../Components/CommonComponents/CustomSpinner';
import CustomInput from '../../Components/CommonComponents/CustomInput';
import PaginationButtons from '../../Components/CommonComponents/PaginationButtons';
import CustomSelect from '../../Components/CommonComponents/CustomSelect';
import DeleteConfirmatationModal from '../../Components/CommonComponents/DeleteConfirmatationModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getHeadings } from '../OtherFunctions/table';
import { useGetLoggedInUser } from '../../UtilityHookFunctions/LoggedInUser';

const fetchData = async (path, data) => {
  try {
    const result = await axios.get(`${END_POINT}/${path}page=${data.page}&&limit=${data?.limit}&&search=${data?.search}`, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    return result;
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    console.log('Check Error', error);
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
    toast.error(error?.response?.data || 'Something went wrong');
    toast.error('Failed To Delete');
    console.log('Check Error', error);
  }
};

const getTitle = (listType) => {

  if (listType === 'patients') {
    return 'Patient';
  } else if (listType === 'doctors') {
    return 'Doctor';
  } else if (listType === 'receptionist') {
    return 'Receptionist';
  } else if (listType === 'consultant') {
    return 'Consultant';
  } else if (listType === 'enquiry') {
    return 'Enquiry';
  } else if (listType === 'assistantDoctor') {
    return 'Assistant Doctor';
  } else if (listType === 'nutrition') {
    return 'nutrition';
  } else if (listType === 'feedback') {
    return 'feedback';
  } else if (listType === 'prescription') {
    return 'prescription';
  } else if (listType === 'bids') {
    return 'Bids';
  } else if (listType === 'AlternativeTherapies') {
    return 'Alternative Therapies';
  } else {
    return 'Default Title';
  }
};

// assistantDoctor

export default function Table() {

  const [tableData, setTableData] = useState(null);
  const user = useGetLoggedInUser()
  const { listType } = useParams();
  const [query, setQuery] = useState({ search: '', page: 1, limit: 10 });
  let tableHeading;
  let letModifedHeading;
  const navigate = useNavigate();
  const location = useLocation();

  const res = getHeadings(listType, user);
  tableHeading = res?.main;
  letModifedHeading = res?.display;  

  useEffect(() => {
    setTableData(null);
    listType === 'patients' && fetchData('customer/?', query).then((data) => setTableData(data?.data));
    listType === 'doctors' && fetchData('doctor/?', query).then((data) => setTableData(data?.data));
    listType === 'receptionist' && fetchData('receptionist/?', query).then((data) => setTableData(data?.data));
    listType === 'consultant' && fetchData('consultant/?', query).then((data) => setTableData(data?.data));
    listType === 'enquiry' && fetchData('enquiry/?', query).then((data) => setTableData(data?.data));
    listType === 'assistantDoctor' && fetchData('assistantDoctor/?', query).then((data) => setTableData(data?.data));
    listType === 'nutrition' && fetchData('nutrition/?', query).then((data) => setTableData(data?.data));
    listType === 'feedback' && fetchData('feedback/?', query).then((data) => setTableData(data?.data));
    listType === 'prescription' && fetchData('customer/?', query).then((data) => setTableData(data?.data));
    listType === 'AlternativeTherapies' && fetchData('alternative_therapy/list?search=true&&status=requested&&', query).then((data) => setTableData(data?.data));
    listType === 'bids' && (
      user?.role === 'MainDoctor'? (fetchData('bid/?', query).then((data) => setTableData(data?.data))) :fetchData('alternative_therapy/list?search=true&&status=bid&&', query).then((data) => setTableData(data?.data))
    );
  }, [listType, query]);

  useEffect(() => {
    setTableData(null);
    listType === 'feedback' &&
      fetchData('feedback/?', query).then((data) => {
        setTableData(data?.data);
      });
  }, [listType, query]);

  const excludedUrls = ['/feedback', '/someotherurl', '/prescription', '/AlternativeTherapies', '/bids'];

  const shouldDisplayButton = !excludedUrls.includes(location.pathname);

  return (
    <div className="m-3 rounded-md bg-slate-100 px-8 w-full min-h-[100vh] h-fit py-8">
      {shouldDisplayButton && (
        <button onClick={() => navigate('addNew')} className="p-2 bg-black text-white rounded font-semibold">
          Add {getTitle(listType)}
        </button>
      )}

      {listType === 'consultant' &&
      <button onClick={() => navigate('bids')} className="ms-5 px-5 py-2 bg-cyan-300 text-black rounded font-normal">
        Bids
      </button>
      }
      

      <hr className="bg-black h-1 w-full my-5" />
      <div className="flex justify-between flex-wrap items-center ">
        <div className=" -mt-5 mb-2">
          <CustomInput
            label={''}
            name="search"
            type={'text'}
            value={query.search}
            onChange={(e) => {
              setQuery({ ...query, search: e.target.value, page: 1 });
            }}
            placeholder={`Search ${getTitle(listType)}`}
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
                          {['primary', 'secondary', 'third'].includes(itemKey) ? item?.diagnosis?.[itemKey] : (item?.[itemKey]||item?.bidder?.name) || 'NA'}
                        </td>
                      ))}
                      <td className="px-4 py-3 border border-gray-300 whitespace-nowrap">
                        <span
                          onClick={() => {
                            if (listType !== 'prescription') {
                              if(listType =='bids' && user.role === 'MainDoctor'){
                                navigate(`/${listType}/review/${item?._id}`);
                              }
                              else{
                                navigate(`/${listType}/${item?._id}`);
                              }
                              
                            }
                             else {
                              navigate(`/${listType}/add/${item?._id}`);
                            }
                          }}
                          className="bg-gray-100 cursor-pointer text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-500"
                        >
                        {shouldDisplayButton ? <span>Modify</span> : <span>View</span>}
                        </span>

                        {(listType==='bids' && user.role !== 'MainDoctor') &&
                         <span
                          onClick={() => {
                              navigate(`/${listType}/${item?._id}/create`);
                          
                          }}
                          className="bg-gray-100 cursor-pointer text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-500"
                        >
                          {<span>Bid</span>}
                        </span>}
                        
                        {shouldDisplayButton && (
                          <DeleteConfirmatationModal
                            deleteFunction={() => {
                              listType === 'patients' && deleteData(`customer/${item?._id}`, 'Patient');
                              listType === 'receptionist' && deleteData(`receptionist/${item?._id}`, 'Receptionist');
                              listType === 'consultant' && deleteData(`consultant/${item?._id}`, 'Consultant');
                              listType === 'enquiry' && deleteData(`enquiry/${item?._id}`, 'Enquiry');
                              listType === 'assistantDoctor' && deleteData(`assistantDoctor/${item?._id}`, 'assistantDoctor');
                              listType === 'doctors' && deleteData(`doctor/${item?._id}`, 'Doctor');
                              listType === 'nutrition' && deleteData(`nutrition/${item?._id}`, 'Nutrition');
                              listType === 'feedback' && deleteData(`feedback/${item?._id}`, 'feedback');
                            }}
                            text={item.name}
                            heading={'Delete Item'}
                          />
                        )}
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

      {/* //   : (
    //     tableData !== null && tableData?.length <= 0 && <div className="text-center text-gray-500 mt-4">No data found.</div>
    //   )} */}

      <ToastContainer />
    </div>
  );
}
