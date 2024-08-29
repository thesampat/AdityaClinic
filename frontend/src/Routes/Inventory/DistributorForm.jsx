import React, { useEffect, useState } from 'react';
import CustomBreadcrumbs from '../../Components/CommonComponents/CustomBreadcrumbs';
import CustomInput from '../../Components/CommonComponents/CustomInput';
import CustomButton from '../../Components/CommonComponents/CustomButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { UploadFiles, getJwtToken } from '../../Redux/AdminReducer/action';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadFile, END_POINT, RemoveFile, UploadImages, DeleteImages } from '../../Redux/AdminReducer/action';
import CustomSpinner from '../../Components/CommonComponents/CustomSpinner';
import { FileUploadModal, ImageShowModal, ImageUploadModal, MultipleFileUploads } from '../../Components/CommonComponents/DoctorUploadModals';
import ModalCustom from '../../Components/CommonComponents/ModalCustomPopup';
import CustomTextarea from '../../Components/CommonComponents/CustomTextarea';
import CustomImageInput from '../../Components/CommonComponents/CustomImageInput';
import axios from 'axios';
import InventoryTable from './InventoryTable';

const fetchSingleItem = async (id) => {
  try {
    const result = await axios.get(`${END_POINT}/inventory/distributors/${id}`, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    return result;
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    console.log(error);

    toast.error('Something went wrong while fetching data');
  }
};

const createItem = async (data, navigate, setIsPorcessing) => {
  try {
    const result = await axios.post(`${END_POINT}/inventory/distributors`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    let { data: id } = result?.data;
    setIsPorcessing(false);
    toast.success('Distributor Created Successfully');
    setTimeout(() => {
      navigate(`/main/inventory/Distributors`);
    }, 1000);
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    setIsPorcessing(false);
  }
};

const updateItem = async (data, setIsPorcessing) => {
  try {
    const result = await axios.put(`${END_POINT}/inventory/distributors/${data._id}`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    toast.success('Details Updated');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    setIsPorcessing(false);
    toast.error('Failed To Updated');
  }
};

const AddCompanyItem = async (data, setIsPorcessing, d_id, setFormData) => {
  try {
    const result = await axios.post(`${END_POINT}/inventory/distributors/company/${d_id}`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    setFormData((prev) => ({ ...prev, companies: [...prev.companies, result?.data] }));
    setIsPorcessing(false);
    toast.success('Item Added Successfully');
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    setIsPorcessing(false);
  }
};

const DeleteCompanyItem = async (setIsPorcessing, d_id, medicine_index, setFormData) => {
  try {
    const result = await axios.delete(`${END_POINT}/inventory/distributors/company/${d_id}/${medicine_index}`, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    setFormData((prev) => {
      const updatedCompanies = [...prev.companies];
      updatedCompanies.splice(medicine_index, 1);
      return { ...prev, companies: updatedCompanies };
    });
    setIsPorcessing(false);
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    setIsPorcessing(false);
  }
};

const updateCompanyItem = async (data, setIsPorcessing, d_id) => {
  try {
    const result = await axios.put(`${END_POINT}/inventory/distributors/${data._id}`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    toast.success('Details Updated');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    setIsPorcessing(false);
    toast.error('Failed To Updated');
  }
};

const initialFormData = {
  companyName: '',
  address: '',
  ownerName: '',
  phone: '',
  email: '',
  gstNumber: '',
  companies: [],
};
const initialFormError = initialFormData;

export default function DistributorForm() {
  // define form state
  const [formData, setFormData] = useState();
  const [formData_List, setFormData_List] = useState();
  const [formError, setFormError] = useState(initialFormError);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { inventory_item_id } = useParams();
  const [isProcessing, setIsPorcessing] = useState(false);
  const dispatch = useDispatch();
  const [profile_image_res, set_profile_image_res] = useState('');

  useEffect(() => {
    if (inventory_item_id === 'addNew') {
      setFormData(initialFormData);
    } else {
      fetchSingleItem(inventory_item_id).then((e) => {
        setFormData(e?.data);
      });
    }
  }, [inventory_item_id]);

  // handel input change
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleForm = () => {
    const trimmedFormData = { ...formData };
    let isValidInput = true;

    for (const key in trimmedFormData) {
      if (trimmedFormData?.hasOwnProperty(key)) {
        if (typeof trimmedFormData[key] === 'string') {
          trimmedFormData[key] = trimmedFormData[key].trim();
        }
      }
    }

    let updatedFormError = { formError };

    //  validate name
    // if (!trimmedFormData?.name) {
    //   updatedFormError.name = 'Name is required!';
    //   isValidInput = false;
    // }

    // // validate mobile
    // if (!trimmedFormData?.number) {
    //   updatedFormError.number = 'Phone number is required!';
    //   isValidInput = false;
    // } else if (!/^\d{10}$/.test(trimmedFormData?.number)) {
    //   updatedFormError.number = 'Invalid phone number, must be 10 digits!';
    //   isValidInput = false;
    // }

    // //  validate reference
    // if (!trimmedFormData?.reference) {
    //   updatedFormError.reference = 'reference is required!';
    //   isValidInput = false;
    // }

    // //  validate purposeOfEnquiry
    // if (!trimmedFormData?.purposeOfEnquiry) {
    //   updatedFormError.purposeOfEnquiry = 'Purpose Of Enquiry is required!';
    //   isValidInput = false;
    // }

    setFormError(updatedFormError);
    if (!isValidInput) {
      Object.keys(updatedFormError)?.map((f) => {
        toast.error(updatedFormError?.[f]);
      });
    }

    if (isValidInput) {
      setIsPorcessing(true);
      inventory_item_id == 'addNew' ? createItem(trimmedFormData, navigate, setIsPorcessing) : updateItem(trimmedFormData, setIsPorcessing);
    }
  };

  return (
    <div className="m-3 rounded-md bg-slate-100 h-fit min-h-[100vh] lg:px-24 w-full p-10  bg-white">
      <button className="bg-blue-300 px-3 py-1 rounded-lg font-bold font-gray-200" onClick={(e) => navigate(-1)}>
        Go Back
      </button>

      {formData !== null ? (
        <div className="pb-8 pt-4 ">
          {/* Personal Information */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-primary-900 border-l-4 border-primary-400 pl-3 mb-4">Distributor Form</h2>
            <div className="grid grid-cols-2 gap-x-20">
              <CustomInput label={'Company Name'} name={'companyName'} type={'text'} value={formData?.companyName} onChange={handleInputChange} placeholder={'Enter Company Name.'} error={formError.companyName} />
              <CustomInput label={'Address'} name={'address'} type={'text'} value={formData?.address} onChange={handleInputChange} placeholder={'Enter Address.'} error={formError.address} />
              <CustomInput label={'Owner Name'} name={'ownerName'} type={'text'} value={formData?.ownerName} onChange={handleInputChange} placeholder={'Enter Owner Name.'} error={formError.ownerName} />
              <CustomInput label={'Phone'} name={'phone'} type={'text'} value={formData?.phone} onChange={handleInputChange} placeholder={'Enter Phone Number.'} error={formError.phone} />
              <CustomInput label={'Email'} name={'email'} type={'text'} value={formData?.email} onChange={handleInputChange} placeholder={'Enter Email Address.'} error={formError.email} />
              <CustomInput label={'GST Number'} name={'gstNumber'} type={'text'} value={formData?.gstNumber} onChange={handleInputChange} placeholder={'Enter GST Number.'} error={formError.gstNumber} />
            </div>

            {inventory_item_id !== 'addNew' && (
              <div className="companiesList mt-10">
                <h2 className="text-2xl font-semibold text-primary-900 border-l-4 border-primary-400 pl-3">Companies List</h2>

                <div className="grid grid-cols-5">
                  <CustomInput label={'Company Name'} name={'name'} type={'text'} value={formData_List?.name} onChange={(e) => setFormData_List({ name: e.target.value })} placeholder={'Enter Company Name.'} error={formError.companyName} />
                </div>
                <button
                  className="bg-blue-500 px-4 py-1 rounded-md text-white mt-4"
                  onClick={(e) => {
                    e.preventDefault();
                    AddCompanyItem(formData_List, setIsPorcessing, formData?._id, setFormData);
                  }}
                  isProcessing={isProcessing}
                >
                  Add
                </button>
                <div className="company-table-container text-center">
                  <table className="bg-white border border-gray-500 rounded-lg mt-5 w-[30vw]">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="py-2 px-4 border-b border-gray-500">Company Name</th>
                        <th className="py-2 px-4 border-b border-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData?.companies?.length > 0 ? (
                        formData?.companies
                          .sort((a, b) => a?.company_index < b?.company_index)
                          .slice(0, 10)
                          .map((company, index) => (
                            <tr key={index}>
                              <td className="py-2 text-center px-4 border-b border-gray-500">{company.name}</td>
                              <td className="py-2 px-4 border-b border-gray-500 text-center">
                                <button
                                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    DeleteCompanyItem(setIsPorcessing, formData?._id, index, setFormData);
                                  }}
                                >
                                  X
                                </button>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan={2}>No Data Found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="lg:w-80 mx-auto w-full px-5  ">
              <CustomButton onClick={handleForm} isProcessing={isProcessing} label={inventory_item_id == 'addNew' ? 'Submit' : 'Save'} />
            </div>
          </div>
        </div>
      ) : (
        <CustomSpinner />
      )}

      <ToastContainer />

      {/* <ModalCustom
        isShow={isModalOpen}
        setIsShow={setIsModalOpen}
        content={
          <div className="w-[30vw] text-center text-xl font-semibold">
            <div>EXIT</div>
            <CustomInput label={'Exit Date'} name="exit_date" type={'date'} value={formData?.exit_date} onChange={handleInputChange} placeholder={''} error={formError?.exit_date} />
            <CustomTextarea label={'Exit Reason'} name="exit_reason" type={'text'} value={formData?.exit_reason} onChange={handleInputChange} placeholder={'Enter Exit Reason'} error={formError?.exit_reason} />
            <button
              onClick={(e) => {
                setFormData((prev) => ({ ...prev, status: 'Left' }));
                handleForm(e);
              }}
              className="bg-red-400 p-2 rounded-lg"
            >
              Confirm
            </button>
          </div>
        }
      /> */}
    </div>
  );
}
