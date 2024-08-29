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
    const result = await axios.get(`${END_POINT}/receptionist/${id}`, {
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
  console.log(data, 'test data');
  try {
    const result = await axios.post(`${END_POINT}/receptionist`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    let { data: id } = result?.data;
    setIsPorcessing(false);
    navigate(`/receptionist`);
    toast.success('Receptionist Created Successfully');
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    console.log(error);
    setIsPorcessing(false);
  }
};

const updateItem = async (data, setIsPorcessing) => {
  try {
    const result = await axios.put(`${END_POINT}/receptionist/profile/${data._id}`, data, {
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

const initialFormError = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  education: '',
  pic: '',
  phone: '',
  experience: '',
  address: '',
};

const initialFormData = {
  name: '',
  email: '',
  pic: '',
  phone: '',
  location: '',
  education_details: '',
  experience_details: '',
  password: '',
  confirmPassword: '',
  exit_date: new Date()?.toISOString()?.slice(0, 10),
};

export default function ReceptionistForm() {
  // define form state
  const [formData, setFormData] = useState();
  const [formError, setFormError] = useState(initialFormError);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { receptionist_Id } = useParams();
  const [isProcessing, setIsPorcessing] = useState(false);
  const dispatch = useDispatch();
  const [profile_image_res, set_profile_image_res] = useState('');

  useEffect(() => {
    if (receptionist_Id === 'addNew') {
      setFormData(initialFormData);
    } else {
      fetchSingleItem(receptionist_Id).then((e) => {
        setFormData(e?.data);
      });
    }
  }, [receptionist_Id]);

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

    if (!trimmedFormData?.name) {
      updatedFormError.name = 'Name is required!';
      isValidInput = false;
    }

    if (!trimmedFormData?.email) {
      updatedFormError.email = 'Email is required!';
      isValidInput = false;
    } else if (!/\S+@\S+\.\S+/.test(trimmedFormData?.email)) {
      updatedFormError.email = 'Invalid email address!';
      isValidInput = false;
    }

    if (!trimmedFormData?.phone) {
      updatedFormError.phone = 'Phone number is required!';
      isValidInput = false;
    } else if (!/^\d{10}$/.test(trimmedFormData?.phone)) {
      updatedFormError.phone = 'Invalid phone number, must be 10 digits!';
      isValidInput = false;
    }

    setFormError(updatedFormError);
    if (!isValidInput) {
      Object.keys(updatedFormError)?.map((f) => {
        toast.error(updatedFormError?.[f]);
      });
    }

    if (isValidInput) {
      setIsPorcessing(true);
      receptionist_Id == 'addNew' ? createItem(trimmedFormData, navigate, setIsPorcessing) : updateItem(trimmedFormData, setIsPorcessing);
    }
  };

  const handleProfileUpload = async (e) => {
    let file = e.target.files?.[0];
    if (file) {
      let i = await dispatch(UploadImages([file], formData?._id, 'profile_image', 'receptionist'));
      if (i == true) {
        set_profile_image_res('Uploaded!!');
      }
    }
  };

  return (
    <div className="m-3 rounded-md bg-slate-100 h-fit min-h-[100vh] lg:px-24 w-full p-10  bg-white">
      <button
        onClick={(e) => {
          navigate(-1);
        }}
        className="bg-blue-800 rounded-lg font-semibold text-white p-2 px-3"
      >
        Back
      </button>

      {formData !== null ? (
        <div className="pb-8">
          {/* Personal Information */}
          <div className="px-6 py-6 rounded-md ">
            <h2 className="text-2xl font-semibold text-primary-900 border-l-4 border-primary-400 pl-3 ">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 ">
              <CustomInput onChange={handleInputChange} label="Full Name" placeholder="Enter Full Name!" value={formData?.name} error={formError?.name} type="text" name="name" />
              <CustomInput onChange={handleInputChange} label="Email" placeholder="example@gmail.com" value={formData?.email} error={formError?.email} type="email" name="email" />
              <CustomInput label="Contact Number" placeholder="09999999999" value={formData?.phone} onChange={handleInputChange} type="number" name="phone" error={formError?.phone} />
              <CustomInput onChange={handleInputChange} label="Address" placeholder="Enter Address" type="text" value={formData?.location} error={formError?.location} name="location" />
              <CustomInput label="Education Details" placeholder="Enter Education Details" value={formData?.education_details} onChange={handleInputChange} type="text" name="education_details" error={formError?.education_details} />
              <CustomInput label="Experience Details" placeholder="Enter Experience Details" value={formData?.experience_details} onChange={handleInputChange} type="text" name="experience_details" error={formError?.experience_details} />
              <CustomImageInput label="Profile Image" onChange={handleProfileUpload} res={profile_image_res} exist_profile={formData?.profile_image?.[0]} />
            </div>
          </div>

          {formData?._id && (
            <div className="px-6 py-6 rounded-md ">
              <h2 className="text-2xl font-semibold text-primary-400  border-l-4 border-primary-400 pl-3 mb-10">Reports Upload</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <ChildrenComponent id={formData?.Date} label="EDUCATION DOCUMENT" formData={formData} uploadType="educationDoc" SectionType="receptionist" />
                <ChildrenComponent id={formData?.Date} label="EXPERIENCE DOCUMENT" formData={formData} uploadType="experienceDoc" SectionType="receptionist" />
                <ChildrenComponent id={formData?.Date} label="REGISTRATION DOCUMENT" formData={formData} uploadType="registrationDoc" SectionType="receptionist" />
                <ChildrenComponent id={formData?.Date} label="RESUME" formData={formData} uploadType="resumeDoc" SectionType="receptionist" />
                <ChildrenComponent id={formData?.Date} label="OTHERS" formData={formData} uploadType="otherDocs" SectionType="receptionist" />
              </div>
            </div>
          )}

          {/* password input */}
          {/* {receptionist_Id == 'addNew' && (
            <div className="px-6 py-6 rounded-md ">
              <h2 className="text-2xl font-semibold text-primary-900 border-l-4 border-primary-400 pl-3 ">{receptionist_Id == 'addNew' ? 'Create Password' : 'Update Password'} </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 ">
                <CustomInput onChange={handleInputChange} label="Password" placeholder="Enter Password!" value={formData?.password} error={formError?.password} type="password" name="password" />
                <CustomInput onChange={handleInputChange} label="Confirm Password" placeholder="Confirm Your Password!" value={formData?.confirmPassword} error={formError?.confirmPassword} type="password" name="confirmPassword" />
              </div>
            </div>
          )} */}
          {/* create item button */}
          <div className="lg:w-80 mx-auto w-full px-5  ">
            <CustomButton onClick={handleForm} isProcessing={isProcessing} label={receptionist_Id == 'addNew' ? 'Submit' : 'Save'} />
          </div>
          {/* <div className="lg:w-80 mx-auto w-full px-5  ">
            <button
              onClick={() => {
                setIsModalOpen(true);
              }}
              className={`w-full mt-6 font-bold bg-red-600  hover:bg-red-700 focus:ring-red-300 text-white py-2.5 rounded-lg transition duration-300 ease-in-out`}
            >
              EXIT
            </button>
          </div> */}
        </div>
      ) : (
        <CustomSpinner />
      )}

      <ToastContainer />

      <ModalCustom
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
      />
    </div>
  );
}

const ChildrenComponent = ({ id, label, formData, uploadType, SectionType }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [showImage, setShowImages] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleImageCloseModal = () => {
    setShowImages(false);
  };

  const handleFileUpload = (file) => {
    if (file) {
      setIsModalOpen(false);
      dispatch(UploadFile(file, formData?._id, uploadType, SectionType));
    }
  };

  const handleMutlipleFileUploads = (file) => {
    if (file) {
      setIsModalOpen(false);

      dispatch(UploadFiles(file, formData?._id, uploadType, SectionType));
    }
  };

  const handleImageUpload = async (file) => {
    if (file) {
      setIsModalOpen(false);
      let res = await dispatch(UploadImages(file, formData?._id, uploadType, SectionType));
      if (res === true) {
        toast.success('Images uploaded');
      }
    }
  };

  return (
    <div className="ChildernMain flex flex-col gap-2">
      <h4 className="font-semibold">{label}</h4>
      <label className="text-xs p-0 m-0 " htmlFor="">
        {uploadType !== 'pictures' ? uploadType !== 'otherDocs' && (formData?.[uploadType] ? '1 File' : 'No File Uploaded') : `${formData?.[uploadType]?.length} image uploded`}
        {uploadType == 'otherDocs' && `${formData?.[uploadType]?.length || 'No'} files uploaded`}
      </label>
      {uploadType == 'otherDocs' && (
        <div className="flex flex-col bg-white p-2 h-[10vh] overflow-y-scroll gap-2">
          {formData?.[uploadType]?.map((file) => (
            <a className="text-blue-700 font-bold" target="_blank" href={`${END_POINT}/receptionist/get/${file?.id}`}>
              {file?.name}
            </a>
          ))}
        </div>
      )}
      <div className="pChilldrenControls flex gap-5">
        <button className="border p-2 py-1 rounded rounded-md bg-neutral-400" onClick={() => setIsModalOpen(uploadType)}>
          <p className="text-xs font-semibold text-white">UPLOAD</p>
        </button>
        <button className="border p-2 py-1 rounded rounded-md bg-neutral-400">
          <p
            className="text-xs font-semibold text-white"
            onClick={() => {
              !['pictures', 'otherDocs'].includes(uploadType) ? dispatch(RemoveFile(formData?.[uploadType], formData?._id, uploadType, 'receptionist')) : dispatch(DeleteImages({ fileIds: uploadType == 'otherDocs' ? formData?.[uploadType]?.map((i) => i?.id) : formData?.[uploadType] }, formData?._id, 'receptionist', uploadType));
            }}
          >
            DELETE
          </p>
        </button>
        {formData?.[uploadType] && (
          <button className="border p-2 py-1 rounded rounded-md bg-neutral-400">
            <p
              className="text-xs font-semibold text-white"
              onClick={(e) => {
                uploadType !== 'pictures' ? window.open(`${END_POINT}/receptionist/get/${formData?.[uploadType]}`) : setShowImages(true);
              }}
            >
              VIEW
            </p>
          </button>
        )}
      </div>

      {isModalOpen !== 'pictures' ? uploadType !== 'otherDocs' && <FileUploadModal isOpen={isModalOpen} closeModal={handleCloseModal} onFileUpload={handleFileUpload} uploadType={uploadType} /> : <ImageUploadModal isOpen={isModalOpen} closeModal={handleCloseModal} onImageUpload={handleImageUpload} />}
      {showImage == true && <ImageShowModal isOpen={showImage} closeModal={handleImageCloseModal} Images={formData?.[uploadType]} />}
      {isModalOpen == 'otherDocs' && <MultipleFileUploads isOpen={isModalOpen} closeModal={handleCloseModal} onFileUpload={handleMutlipleFileUploads} uploadType={uploadType} />}
    </div>
  );
};
