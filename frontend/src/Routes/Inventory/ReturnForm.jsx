import React, { useEffect, useState } from 'react';
import CustomBreadcrumbs from '../../Components/CommonComponents/CustomBreadcrumbs';
import CustomInput from '../../Components/CommonComponents/CustomInput';
import CustomButton from '../../Components/CommonComponents/CustomButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { UploadFiles, getJwtToken } from '../../Redux/AdminReducer/action';
import { json, useNavigate, useParams } from 'react-router-dom';
import { UploadFile, END_POINT, RemoveFile, UploadImages, DeleteImages } from '../../Redux/AdminReducer/action';
import CustomSpinner from '../../Components/CommonComponents/CustomSpinner';
import { FileUploadModal, ImageShowModal, ImageUploadModal, MultipleFileUploads } from '../../Components/CommonComponents/DoctorUploadModals';
import ModalCustom from '../../Components/CommonComponents/ModalCustomPopup';
import CustomTextarea from '../../Components/CommonComponents/CustomTextarea';
import CustomImageInput from '../../Components/CommonComponents/CustomImageInput';
import axios from 'axios';
import CustomSelect from '../../Components/CommonComponents/CustomSelect';

const fetchSingleItem = async (id) => {
  try {
    const result = await axios.get(`${END_POINT}/inventory/orders/${id}`, {
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

const fetchOrders = async (ids) => {
  try {
    const params = ids
      ?.split(',')
      .map((id) => `orders=${encodeURIComponent(id)}`)
      .join('&');

    const result = await axios.get(`${END_POINT}/inventory/ordersIds?${params}`, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    return result;
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    console.error(error);
    toast.error('Something went wrong while fetching data');
  }
};

const fetchDistributor = async (cname) => {
  const params = cname.map((id) => `mname=${encodeURIComponent(id)}`).join('&');

  try {
    const result = await axios.get(`${END_POINT}/inventory/distributorsByMedicine?${params}`, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    return result;
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    console.error(error);
    toast.error('Something went wrong while fetching data');
  }
};
const createItem = async (data, navigate, setIsPorcessing) => {
  try {
    toast.loading('sending mail....');
    const result = await axios.post(`${END_POINT}/inventory/returns`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    let { data: id } = result?.data;
    toast.dismiss();
    setIsPorcessing(false);
    toast.success('Order Created Successfully');
    setTimeout(() => {
      navigate(`/main/inventory/Order`);
    }, 1000);
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data || 'Something went wrong');
    setIsPorcessing(false);
  }
};

const updateItem = async (data, setIsPorcessing) => {
  try {
    const result = await axios.put(`${END_POINT}/inventory/orders/${data._id}`, data, {
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
  damage: '',
  date: '',
  to: '',
  distributor: '',
};

const initialFormError = initialFormData;

export default function ReturnForm() {
  // define form state
  const [formData, setFormData] = useState([]);
  const [formError, setFormError] = useState(initialFormError);
  const navigate = useNavigate();
  const { inventory_item_id, order_id } = useParams();
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isProcessing, setIsPorcessing] = useState(false);
  let [distributorsOptions, setDistributorsOptions] = useState([]);

  useEffect(() => {
    if (inventory_item_id === 'addNew') {
      fetchOrders(order_id).then((e) => {
        setSelectedMedicine(e?.data);

        const mappedFormData = e?.data?.map((item) => {
          const { company, nameOfMedicine, potencyOrPower, typeOfMedicine, distributor, quantity, Order_Id: order } = item;
          let damage = 0;
          return { company, nameOfMedicine, potencyOrPower, quantity, damage, distributor, quantity, damage, order };
        });
        setFormData(mappedFormData);
      });
      setFormData([initialFormData]);
    } else {
      fetchSingleItem(inventory_item_id).then((e) => {
        setFormData(e?.data);
      });
    }
  }, [inventory_item_id, order_id]);

  useEffect(() => {
    if (selectedMedicine !== null) {
      fetchDistributor(selectedMedicine?.map((e) => e?.company)).then((e) => {
        e?.data?.map((e) => {
          setDistributorsOptions((prev) => [...prev, e]);
        });
      });
    }
  }, [selectedMedicine]);

  // handel input change
  const handleInputChange = (event, rowIndex) => {
    let { name, value, type, checked } = event.target;
    let filteredi;

    if (name === 'distributor') {
      filteredi = distributorsOptions?.filter((d) => d?.companyName === value)?.[0];
      value = filteredi?.company;
    }

    const updatedFormData = [...formData];

    if (!updatedFormData[rowIndex]) {
      updatedFormData[rowIndex] = {};
    }

    updatedFormData[rowIndex] = {
      ...updatedFormData[rowIndex],
      [name]: value,
      to: filteredi?.email || distributorsOptions?.[0]?.email,
    };

    setFormData(updatedFormData);
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

    const hasUndefinedTo = formData.some((obj) => obj.damage === 0);

    if (hasUndefinedTo) {
      toast.error('Damange can not be 0');
      return false;
    }

    let updatedFormError = { formError };

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

          <div className="px-6 py-6 rounded-md">
            <h2 className="text-2xl font-semibold text-primary-900 border-l-4 border-primary-400 pl-3">Return Order Information</h2>
            <table className="w-full mt-4">
              <thead>
                <tr>
                  <th className="py-2">Order Id</th>
                  <th className="py-2">Name of Medicine</th>
                  <th className="py-2">Order Date</th>
                  <th className="py-2">Potency / Power</th>
                  <th className="py-2">Quantity</th>
                  <th className="py-2">Damage</th>
                  <th className="py-2">Distributor</th>
                </tr>
              </thead>
              <tbody>
                {selectedMedicine?.map((selectedMedicine, index) => (
                  <tr key={index}>
                    <td>
                      <CustomInput disabled={true} label="Order" value={selectedMedicine?.Order_Id} />
                    </td>
                    <td>
                      <CustomInput disabled={true} label="Name of Medicine" name="nameOfMedicine" type="text" value={selectedMedicine?.nameOfMedicine} onChange={(e) => handleInputChange(e, index)} />
                    </td>
                    <td>
                      <CustomInput disabled={true} type="date" label="Order" value={selectedMedicine?.date?.slice(0, 10)} />
                    </td>
                    <td>
                      <CustomInput disabled={true} label="Potency / Power" name="potencyOrPower" type="text" value={selectedMedicine?.potencyOrPower} onChange={(e) => handleInputChange(e, index)} />
                    </td>
                    <td>
                      <CustomInput disabled={true} label="Quantity" name="quantity" type="number" value={formData?.[index]?.quantity} onChange={(e) => handleInputChange(e, index)} />
                    </td>
                    <td>
                      <CustomSelect disabled={true} onChange={(e) => handleInputChange(e, index)} options={distributorsOptions?.map((e) => e?.companyName)} label="Distributor" value={formData?.[index]?.distributor} error={formError?.distributor} name="distributor" placeholder="-- Select Distributor --" />
                    </td>
                    <td>
                      <CustomInput label="Damage" name="damage" type="number" value={formData?.[index]?.damage} onChange={(e) => handleInputChange(e, index)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* create item button */}
          <div className="lg:w-80 mx-auto w-full px-5  ">
            <CustomButton onClick={handleForm} isProcessing={isProcessing} label={inventory_item_id == 'addNew' ? 'Submit' : 'Save'} />
          </div>
          <div className="lg:w-80 mx-auto w-full px-5  "></div>
        </div>
      ) : (
        <CustomSpinner />
      )}

      <ToastContainer />
    </div>
  );
}
