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

export default function MedicineInventoryForm() {
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

    if (isValidInput) {
      setIsPorcessing(true);
      inventory_item_id == 'addNew' ? createItem(trimmedFormData, navigate, setIsPorcessing) : updateItem(trimmedFormData, setIsPorcessing);
    }
  };

  return (
    <div className="m-1 rounded-md bg-slate-100 h-fit w-full p-4  bg-white">
      {formData !== null ? (
        <div className="pb-8 ">
          <div className="px-6 py-1 rounded-md">
            {console.log(formData, 'the expiry date')}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6">
              <CustomInput label={'Name of Medicine'} name={'nameOfMedicine'} type={'text'} value={formData?.nameOfMedicine} onChange={handleInputChange} placeholder={'Enter Name of Medicine'} error={formError.nameOfMedicine} />
              <CustomInput label={'Company'} name={'company'} type={'text'} value={formData?.company} onChange={handleInputChange} placeholder={'Enter Company'} error={formError.company} />
              <CustomInput label={'Potency or Power'} name={'potencyOrPower'} type={'text'} value={formData?.potencyOrPower} onChange={handleInputChange} placeholder={'Enter Potency or Power'} error={formError.potencyOrPower} />
              <CustomInput label={'Quantity'} name={'quantity'} type={'number'} value={formData?.quantity} onChange={handleInputChange} placeholder={'Enter Quantity'} error={formError.quantity} />
              <CustomInput label={'Type of Medicine'} name={'typeOfMedicine'} type={'text'} value={formData?.typeOfMedicine} onChange={handleInputChange} placeholder={'Enter Type of Medicine'} error={formError.typeOfMedicine} />
              <CustomInput label={'Distributor Name'} name={'distributorName'} type={'text'} value={formData?.distributorName} onChange={handleInputChange} placeholder={'Enter Distributor Name'} error={formError.distributorName} />
              <CustomInput label={'Package (ml)'} name={'package'} type={'number'} value={formData?.package} onChange={handleInputChange} placeholder={'Enter Package'} error={formError.package} />
              <CustomInput label={'Expiry Date'} name={'expiryDate'} type={'date'} value={formData?.expiryDate?.slice(0, 10)} onChange={handleInputChange} placeholder={'Enter Expiry Date'} error={formError.expiryDate} />
              <CustomInput label={'Minimum Quantity'} name={'minQuantity'} type={'number'} value={formData?.minQuantity} onChange={handleInputChange} placeholder={'Enter Minimum Quantity'} error={formError.minQuantity} />
              <CustomInput label={'Maximum Quantity'} name={'maxQuantity'} type={'number'} value={formData?.maxQuantity} onChange={handleInputChange} placeholder={'Enter Maximum Quantity'} error={formError.maxQuantity} />
              <CustomInput label={'MRP'} name={'mrp'} type={'number'} value={formData?.mrp} onChange={handleInputChange} placeholder={'Enter MRP'} error={formError.mrp} />
              <CustomInput label={'Discount'} name={'discount'} type={'number'} value={formData?.discount} onChange={handleInputChange} placeholder={'Enter Discount'} error={formError.discount} />
              <CustomInput label={'HSN Code'} name={'hsnCode'} type={'text'} value={formData?.hsnCode} onChange={handleInputChange} placeholder={'Enter HSN Code'} error={formError.hsnCode} />
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

      <ToastContainer />
    </div>
  );
}
