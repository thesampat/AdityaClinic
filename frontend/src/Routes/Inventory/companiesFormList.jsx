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
    const result = await axios.get(`${END_POINT}/inventory/inventory/${id}`, {
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

const createItem = async (data, setIsPorcessing) => {
  try {
    const result = await axios.post(`${END_POINT}/inventory/inventory`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    let { data: id } = result?.data;
    setIsPorcessing(false);
    toast.success('Medicine Added Successfully');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    setIsPorcessing(false);
  }
};

const updateItem = async (data, setIsPorcessing) => {
  try {
    const result = await axios.put(`${END_POINT}/inventory/inventory/${data._id}`, data, {
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
  nameOfMedicine: '',
  company: '',
  potencyOrPower: '',
  quantity: '',
  typeOfMedicine: '',
  distributorName: '',
  expiryDate: '',
  minQuantity: '',
  maxQuantity: '',
  mrp: '',
  discount: '',
  hsnCode: '',
};

const initialFormError = initialFormData;

export default function DistributorCompaniesList() {
  // define form state
  const [formData, setFormData] = useState();
  const [formError, setFormError] = useState(initialFormError);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { inventory_item_id } = useParams();
  const [isProcessing, setIsPorcessing] = useState(false);
  const dispatch = useDispatch();

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

    //   setFormError(updatedFormError);
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
      {formData !== null ? (
        <div className="pb-8 ">
          <div className="px-6 py-1 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6">
              <CustomInput label={'Name of Medicine'} name={'nameOfMedicine'} type={'text'} value={formData?.nameOfMedicine} onChange={handleInputChange} placeholder={'Enter Name of Medicine'} error={formError.nameOfMedicine} />
              <CustomInput label={'Company'} name={'company'} type={'text'} value={formData?.company} onChange={handleInputChange} placeholder={'Enter Company'} error={formError.company} />
            </div>
            <button className="bg-yellow-300 px-8 py-2 rounded-md font-semibold mt-3 text-md me-10" onClick={handleForm}>
              {inventory_item_id == 'addNew' ? 'Add' : 'Save'}
            </button>
            <button className="bg-blue-300 px-8 py-2 rounded-md font-semibold mt-3 text-md" onClick={(e) => navigate('/main/inventory/inventory/addNew')}>
              Add New
            </button>
          </div>
        </div>
      ) : (
        <CustomSpinner />
      )}

      <InventoryTable listType={'distributorListOfCompanies'} />
      <ToastContainer />
    </div>
  );
}
