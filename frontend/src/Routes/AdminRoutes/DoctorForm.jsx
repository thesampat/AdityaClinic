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
import AvailabilityCalendarAndTimeSlots from '../../Components/CommonComponents/CustomDoctorAvailibiityDateCalenderSlot';
import axios from 'axios';
import { IoPersonOutline } from 'react-icons/io5';

const fetchSingleItem = async (id) => {
  try {
    const result = await axios.get(`${END_POINT}/doctor/${id}`, {
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
    const result = await axios.post(`${END_POINT}/doctor`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    let { data: id } = result?.data;
    setIsPorcessing(false);
    navigate(`/doctors`);
    toast.success('doctor Created Successfully');
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    setIsPorcessing(false);
  }
};

const updateItem = async (data, setIsPorcessing) => {
  try {
    const result = await axios.put(`${END_POINT}/doctor/profile/${data._id}`, data, {
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
  conslusion: '',
  purposeOfEnquiry: '',
  reference: '',
  location: '',
  number: '',
  name: '',
};

const initialFormError = initialFormData;

export default function DoctorForm() {
  // define form state
  const [formData, setFormData] = useState();
  const [formError, setFormError] = useState(initialFormError);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { Doctor_Id } = useParams();
  const [isProcessing, setIsPorcessing] = useState(false);
  const dispatch = useDispatch();
  const [profile_image_res, set_profile_image_res] = useState('');

  useEffect(() => {
    if (Doctor_Id === 'addNew') {
      setFormData(initialFormData);
    } else {
      fetchSingleItem(Doctor_Id).then((e) => {
        setFormData(e?.data);
      });
    }
  }, [Doctor_Id]);

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

    if (!trimmedFormData.name) {
      updatedFormError.name = 'Name is required!';
      isValidInput = false;
    }

    if (!trimmedFormData.typesOfDoctor) {
      updatedFormError.typesOfDoctor = 'Title is required!';
      isValidInput = false;
    }

    if (!trimmedFormData.email) {
      updatedFormError.email = 'Email is required!';
      isValidInput = false;
    } else if (!/\S+@\S+\.\S+/.test(trimmedFormData.email)) {
      updatedFormError.email = 'Invalid email address!';
      isValidInput = false;
    }

    if (!trimmedFormData.phone) {
      updatedFormError.phone = 'Phone number is required!';
      isValidInput = false;
    } else if (!/^\d{10}$/.test(trimmedFormData.phone)) {
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
      Doctor_Id == 'addNew' ? createItem(trimmedFormData, navigate, setIsPorcessing) : updateItem(trimmedFormData, setIsPorcessing);
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
        <div className="pb-8 rounded-md pt-4">
          {/* Personal Information */}
          <div className="px-6 py-6 rounded-md ">
            <h2 className="text-2xl font-semibold text-primary-900 border-l-4 border-primary-400 pl-3 ">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 ">
              <CustomInput label="Name" placeholder="Enter Full Name" value={formData?.name} onChange={handleInputChange} type="text" name="name" error={formError?.name} />
              <CustomInput label="Title" placeholder="Enter Title" value={formData?.typesOfDoctor} onChange={handleInputChange} type="text" name="typesOfDoctor" error={formError?.typesOfDoctor} />
              <CustomInput label="Email" placeholder="example@gmail.com" value={formData?.email} onChange={handleInputChange} type="email" name="email" error={formError?.email} />
              <CustomInput label="Contact Number" placeholder="09999999999" value={formData?.phone} onChange={handleInputChange} type="number" name="phone" error={formError?.phone} />
              <CustomInput label="Degree" placeholder="Enter Degree" value={formData?.education} onChange={handleInputChange} type="text" name="education" error={formError?.education} />
              <CustomInput label="Experience in Months" placeholder="Enter Experience in Months" value={formData?.experience} onChange={handleInputChange} type="number" name="experience" error={formError?.experience} />
              <CustomInput label="Fees" placeholder="Enter Fees" value={formData?.fees} onChange={handleInputChange} type="number" name="fees" error={formError?.fees} />
              {/* <CustomImageInput label="Profile Image" name="profile image" error={formError?.pic} /> */}
              <CustomInput label="Education Details" placeholder="Enter Education Details" value={formData?.education_details} onChange={handleInputChange} type="text" name="education_details" error={formError?.education_details} />
              <CustomInput label="Experience Details" placeholder="Enter Experience Details" value={formData?.experience_details} onChange={handleInputChange} type="text" name="experience_details" error={formError?.experience_details} />
            </div>
          </div>

          {formData?._id && (
            <div className="px-6 py-6 rounded-md ">
              <h2 className="text-2xl font-semibold text-primary-400  border-l-4 border-primary-400 pl-3 mb-10">Reports Upload</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <ChildrenComponent id={formData?.Date} label="EDUCATION DOCUMENT" formData={formData} uploadType="educationDoc" SectionType="doctor" />
                <ChildrenComponent id={formData?.Date} label="EXPERIENCE DOCUMENT" formData={formData} uploadType="experienceDoc" SectionType="doctor" />
                <ChildrenComponent id={formData?.Date} label="REGISTRATION DOCUMENT" formData={formData} uploadType="registrationDoc" SectionType="doctor" />
                <ChildrenComponent id={formData?.Date} label="RESUME" formData={formData} uploadType="resumeDoc" SectionType="doctor" />
                <ChildrenComponent id={formData?.Date} label="OTHERS" formData={formData} uploadType="otherDocs" SectionType="doctor" />
                {/* <ChildrenComponent id={formData?.Date} label="Pictures" formData={formData} uploadType="pictures" SectionType="previousTreatmentNotes" /> */}
              </div>
            </div>
          )}

          <div className=" px-6 pt-6">
            <div className="flex flex-col">
              <AvailabilityCalendarAndTimeSlots formData={formData} setFormData={setFormData} />
            </div>
            <span className="text-xs font-medium text-red-400 ">{formError?.availability}</span>
          </div>

          {/* Password */}
          {/* {Doctor_Id === 'addNew' && (
            <div className="px-6 py-6 rounded-md mt-4">
              <h2 className="text-2xl font-semibold text-primary-400 border-l-4 border-primary-400 pl-3 ">Create Password</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 ">
                <CustomInput label={'Password'} name="password" type={'password'} value={formData?.password} onChange={handleInputChange} placeholder={'Enter Your Password'} icon={<IoPersonOutline />} error={formError?.password} />
                <CustomInput label={'Confirm Password'} name="confirmPassword" type={'password'} value={formData?.confirmPassword} onChange={handleInputChange} placeholder={'Confirm Password'} icon={<IoPersonOutline />} error={formError?.confirmPassword} />
              </div>
            </div>
          )} */}

          {/* create item button */}
          <div className="lg:w-80 mx-auto w-full px-5  ">
            <CustomButton onClick={handleForm} isProcessing={isProcessing} label={Doctor_Id == 'addNew' ? 'Submit' : 'Save'} />
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
      dispatch(UploadFile(file, formData?._id, uploadType, 'doctor'));
    }
  };

  const handleMutlipleFileUploads = (file) => {
    if (file) {
      setIsModalOpen(false);

      dispatch(UploadFiles(file, formData?._id, uploadType, 'doctor'));
    }
  };

  const handleImageUpload = async (file) => {
    if (file) {
      setIsModalOpen(false);
      let res = await dispatch(UploadImages(file, formData?._id, uploadType, 'doctor'));
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
            <a className="text-blue-700 font-bold" target="_blank" href={`${END_POINT}/doctor/get/${file?.id}`}>
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
              !['pictures', 'otherDocs'].includes(uploadType) ? dispatch(RemoveFile(formData?.[uploadType], formData?._id, uploadType, 'doctor')) : dispatch(DeleteImages({ fileIds: uploadType == 'otherDocs' ? formData?.[uploadType]?.map((i) => i?.id) : formData?.[uploadType] }, formData?._id, 'doctor', uploadType));
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
                uploadType !== 'pictures' ? window.open(`${END_POINT}/doctor/get/${formData?.[uploadType]}`) : setShowImages(true);
              }}
            >
              VIEW
            </p>
          </button>
        )}
      </div>
      {/* <div className="noteField">
          <label className="text-sm font-medium text-primary-900 mb-1">Note</label>
          <textarea id={id} className="w-full border border-primary-300 text-primary-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 resize-vertical" label="Symptoms" placeholder="Enter Note" onChange={handelInputChange} value={formData?.[SectionType]} name={SectionType} />
        </div> */}
      {isModalOpen !== 'pictures' ? uploadType !== 'otherDocs' && <FileUploadModal isOpen={isModalOpen} closeModal={handleCloseModal} onFileUpload={handleFileUpload} uploadType={uploadType} /> : <ImageUploadModal isOpen={isModalOpen} closeModal={handleCloseModal} onImageUpload={handleImageUpload} />}
      {showImage == true && <ImageShowModal isOpen={showImage} closeModal={handleImageCloseModal} Images={formData?.[uploadType]} />}
      {isModalOpen == 'otherDocs' && <MultipleFileUploads isOpen={isModalOpen} closeModal={handleCloseModal} onFileUpload={handleMutlipleFileUploads} uploadType={uploadType} />}
    </div>
  );
};
