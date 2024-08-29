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
import CustomNameSuggestion from '../../Components/CommonComponents/CustomNameSuggestion';
import CustomSelect from '../../Components/CommonComponents/CustomSelect';
import countiresData from '../../Files/countries.json';
import citiesData from '../../Files/cities.json';
import { RefrenceList, educationLevels, indianStatesAndUTs, statusOptions, PatientRefrenceList } from '../../Files/dropdownOptions';
import statesData from '../../Files/states.json';
import diagnosis from '../../Files/diagnosis.json';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const fetchSingleItem = async (id) => {
  try {
    const result = await axios.get(`${END_POINT}/customer/${id}`, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    return result;
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    console.log(error);
  }
};

const createItem = async (data, navigate, setIsPorcessing) => {
  try {
    const result = await axios.post(`${END_POINT}/customer`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    let { data: id } = result?.data;
    setIsPorcessing(false);
    navigate(`/patients`);
    toast.success('Patient Created Successfully');
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    setIsPorcessing(false);
  }
};

const updateItem = async (data, setIsPorcessing) => {
  try {
    const result = await axios.put(`${END_POINT}/customer/updateProfile/${data._id}`, data, {
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
  firstName: '',
  middleName: '',
  surname: '',
  email: '',
  serialNumber: '',
  type: '',
  year: '',
  bloodGroup: '',
  gender: '',
  maritalStatus: '',
  motherTongue: '',
  education: '',
  state: '',
  payment: '',
  reference: '',
  location: '',
  patientReference: '',
  patientStatus: '',
  profession: '',
  pic: '',
  mobile: '',
  role: '',
  status: '',
  caseNo: '',
  date: '',
  dateOfBirth: '',
  anniversary: '',
  weight: '',
  height: '',
  diagnosis: {},
  package: '',
  industry: '',
  city: '',
  country: '',
  prescriptions: [],
};

const initialFormError = initialFormData;

export default function CustomerForm() {
  const [formData, setFormData] = useState();
  const [formError, setFormError] = useState(initialFormError);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [isProcessing, setIsPorcessing] = useState(false);
  const dispatch = useDispatch();
  const [profile_image_res, set_profile_image_res] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const countries = countiresData?.countries;
  const states = statesData?.states;
  const cities = citiesData?.cities;

  useEffect(() => {
    if (patientId === 'addNew') {
      setFormData(initialFormData);
    } else {
      fetchSingleItem(patientId).then((e) => {
        setFormData(e?.data);
        let { country, state } = e?.data || {};
        let ctid = countiresData?.countries?.filter((c) => c.name === country)?.[0];
        let stid = statesData?.states?.filter((s) => s.name === state)?.[0];
        setSelectedCountry(ctid?.id);
        setSelectedState(stid?.id);
      });
    }
  }, [patientId]);

  useEffect(() => {
    let filteredStates = states?.filter((st) => Number(st.country_id) === Number(selectedCountry))?.map((e) => e?.name);
    setFilteredStates(filteredStates);
    setFilteredCities(cities?.filter((city) => Number(city?.state_id) === Number(selectedState))?.map((e) => e?.name));
  }, [selectedCountry, selectedState]);

  // handel input change
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDiagnosis = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, diagnosis: { ...prev?.diagnosis, [name]: value } }));
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

    if (!trimmedFormData?.mobile) {
      updatedFormError.mobile = 'Phone number is required!';
      isValidInput = false;
    } else if (!/^\d{10}$/.test(trimmedFormData?.mobile)) {
      updatedFormError.mobile = 'Invalid phone number, must be 10 digits!';
      isValidInput = false;
    }

    // validate  first name
    if (!trimmedFormData?.firstName) {
      updatedFormError.firstName = 'First Name is required!';
      isValidInput = false;
    }

    // validate  middle name
    if (!trimmedFormData?.middleName) {
      updatedFormError.middleName = 'Middle Name is required!';
      isValidInput = false;
    }

    // validate sur name
    if (!trimmedFormData?.surname) {
      updatedFormError.surname = 'Surname Name is required!';
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
      patientId == 'addNew' ? createItem(trimmedFormData, navigate, setIsPorcessing) : updateItem(trimmedFormData, setIsPorcessing);
    }
  };

  const handleProfileUpload = async (e) => {
    let file = e.target.files?.[0];
    if (file) {
      let i = await dispatch(UploadImages([file], formData?._id, 'profile_image', 'customer'));
      if (i == true) {
        set_profile_image_res('Uploaded!!');
      }
    }
  };

  const handleStarRating = (event, rating, name, id) => {
    setFormData({
      ...formData,
      [name]: rating,
    });
  };

  const handleCheckboxChange = (event, name, id) => {
    const { checked } = event.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  return (
    <div className="m-3 rounded-md bg-slate-100 h-fit min-h-[100vh] lg:px-24 w-full p-10">
      
      <div className='flex justify-between'>
      <button
        onClick={(e) => {
          navigate(-1);
        }}
        className="bg-blue-800 rounded-lg font-semibold text-white p-2 px-3"
      >
        Back
      </button>
     <Link to='reports'>
     <button
        
        className="bg-amber-500 rounded-lg font-semibold text-white p-2 px-3"
      >
        Reports
      </button>
     </Link>
      </div>

      {formData !== null ? (
        <div className="pb-8 rounded-md pt-4">
          {/* Personal Information */}
          <div className="px-6 py-6 rounded-md ">
            <h2 className="text-2xl font-semibold text-primary-900 border-l-4 border-primary-400 pl-3 ">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 ">
              <CustomInput onChange={handleInputChange} label="First Name" placeholder="Enter First Name" type="text" value={formData?.firstName} error={formError?.firstName} name="firstName" />
              <CustomInput onChange={handleInputChange} label="Middle Name" placeholder="Enter Middle Name" type="text" value={formData?.middleName} error={formError?.middleName} name="middleName" />
              <CustomInput onChange={handleInputChange} label="Last Name" placeholder="Enter Last Name" type="text" value={formData?.surname} error={formError?.surname} name="surname" />
              <CustomInput onChange={handleInputChange} label="Email" placeholder="example@gmail.com" type="text" value={formData?.email} error={formError?.email} name="email" />
              <CustomInput onChange={handleInputChange} label="Contact Number" placeholder="09999999999" type="number" value={formData?.mobile} error={formError?.mobile} name="mobile" />
              <CustomSelect
                onChange={(e) => {
                  handleInputChange(e);
                  let country_id = countries?.filter((country) => country?.name == e.target.value)?.[0];
                  setSelectedCountry(country_id?.id);
                }}
                options={countries?.map((e) => e?.name)}
                label="Select Country"
                value={formData?.country}
                error={formError?.country}
                name="country"
                placeholder="-- Select Country --"
              />
              <CustomSelect
                onChange={(e) => {
                  handleInputChange(e);
                  let state_id = states?.filter((state) => state?.name == e.target.value)?.[0];
                  setSelectedState(state_id?.id);
                }}
                value={formData?.state}
                error={formError?.state}
                name="state"
                placeholder="-- Select State --"
                options={filteredStates}
                label="Select State"
              />
              <CustomSelect onChange={handleInputChange} options={filteredCities} label="Select City" value={formData?.city} error={formError?.city} name="city" placeholder="-- Select City --" />
              <CustomInput onChange={handleInputChange} label="Area" placeholder="Enter Area" type="text" value={formData?.area} error={formError?.area} name="area" />
              <CustomInput onChange={handleInputChange} label="Address" placeholder="Enter Address" type="text" value={formData?.location} error={formError?.location} name="location" />
              <CustomInput onChange={handleInputChange} label="Pincode" placeholder="Enter Pincode" type="number" value={formData?.pincode} error={formError?.pincode} name="pincode" />
              {/* <CustomSelect onChange={handleInputChange} options={indianStatesAndUTs} label="State" value={formData?.state} error={formError?.state} name="state" placeholder="-- Select State --" /> */}
              <CustomSelect onChange={handleInputChange} options={educationLevels} label="Education" placeholder="-- Select Patient Education --" type="text" value={formData?.education} error={formError?.education} name="education" />
              <CustomSelect onChange={handleInputChange} options={['Homemaker', 'Teacher', 'Student', 'Retired', 'IT', 'Business', 'Engineering', 'Medical', 'Grade I & II', 'Senior Management', 'Defence', 'Baby', 'Police', 'Unknown', 'Self Employed']} label="Profession" value={formData?.profession} error={formError?.profession} name="profession" placeholder="-- Select Profession --" />
              <CustomInput onChange={handleInputChange} label="Industry" value={formData?.industry} error={formError?.industry} name="industry" placeholder="Enter Industry"></CustomInput>
              <CustomSelect onChange={handleInputChange} options={RefrenceList} label="Reference" placeholder="-- Select Reference --" type="text" value={formData?.reference} error={formError?.reference} name="reference" />
              {formData?.reference == 'Patient' && <CustomSelect onChange={handleInputChange} options={PatientRefrenceList} label="Patient Refrence" placeholder="-- Select Patient Reference --" type="text" value={formData?.patientReference} error={formError?.patientReference} name="patientReference" />}
              <CustomInput onChange={handleInputChange} label="Mother Tongue" placeholder="Enter Patient Mother Tongue" type="text" value={formData?.motherTongue} error={formError?.motherTongue} name="motherTongue" />
              <CustomSelect onChange={handleInputChange} options={['Male', 'Female', 'Other']} label="Gender" value={formData?.gender} error={formError?.gender} name="gender" placeholder="-- Select Gender --" />
              <CustomInput onChange={handleInputChange} label="Date of Birth" placeholder="Enter Date of Birth" type="date" value={formData?.dateOfBirth} error={formError?.dateOfBirth} name="dateOfBirth" />
              <CustomSelect onChange={handleInputChange} options={['Single', 'Married', 'Divorced']} label="Marital Status" value={formData?.maritalStatus} error={formError?.maritalStatus} name="maritalStatus" placeholder="-- Select Marital Status --" />
              <CustomInput onChange={handleInputChange} label="Anniversary" placeholder="Enter Anniversary" type="date" value={formData?.anniversary} error={formError?.anniversary} name="anniversary" />
              <CustomImageInput label="Profile Image" onChange={handleProfileUpload} res={profile_image_res} exist_profile={formData?.profile_image?.[0]} />
            </div>
          </div>

          {formData?._id && (
            <div className="px-6 py-6 rounded-md ">
              <h2 className="text-2xl font-semibold text-primary-400  border-l-4 border-primary-400 pl-3 mb-4">Medical Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <CustomSelect onChange={handleInputChange} options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} label={'Blood Group'} value={formData?.bloodGroup} error={formError?.bloodGroup} name="bloodGroup" placeholder="-- Select Blood Group --" />
                <CustomInput onChange={handleInputChange} label="Weight (in KG)" placeholder="Enter Weight" type="number" value={formData?.weight} error={formError?.weight} name="weight" />
                <CustomInput onChange={handleInputChange} label="Height (in Centimeters)" placeholder="Enter Height (cm)" type="number" value={formData?.height} error={formError?.height} name="height" />
                <CustomNameSuggestion onChange={handleDiagnosis} options={diagnosis?.map((d) => Object.keys(d || {})?.[0])} label={'Primary Diagnosis'} value={formData?.diagnosis?.primary} error={formError?.diagnosis?.primary} name="primary" placeholder="-- Enter Primary Diagnosis --" />
                <CustomNameSuggestion onChange={handleDiagnosis} options={diagnosis?.map((d) => Object.keys(d || {})?.[0])} label={'Secondary Diagnosis'} value={formData?.diagnosis?.secondary} error={formError?.diagnosis?.secondary} name="secondary" placeholder="-- Enter Secondary Diagnosis --" />
                <CustomNameSuggestion onChange={handleDiagnosis} options={diagnosis?.map((d) => Object.keys(d || {})?.[0])} label={'Tertiary Diagnosis'} value={formData?.diagnosis?.third} error={formError?.diagnosis?.secondary} name="third" placeholder="-- Enter Tertiary Diagnosis --" />
                <CustomNameSuggestion onChange={handleDiagnosis} options={diagnosis.find((diagnosis) => formData?.diagnosis?.primary in diagnosis)?.[formData?.diagnosis?.primary] || []} label={'Primary Sub Diagnosis'} value={formData?.diagnosis?.primarySub} error={formError?.diagnosis?.primarySub} name="primarySub" placeholder="-- Enter Primary Sub Diagnosis --" />
                <CustomNameSuggestion onChange={handleDiagnosis} options={diagnosis.find((diagnosis) => formData?.diagnosis?.secondary in diagnosis)?.[formData?.diagnosis?.secondary] || []} label={'Secondary Sub Diagnosis'} value={formData?.diagnosis?.secondarySub} error={formError?.diagnosis?.secondarySub} name="secondarySub" placeholder="-- Enter Secondary Sub Diagnosis --" />
                <CustomNameSuggestion onChange={handleDiagnosis} options={diagnosis.find((diagnosis) => formData?.diagnosis?.third in diagnosis)?.[formData?.diagnosis?.third] || []} label={'Tertiary Sub Diagnosis'} value={formData?.diagnosis?.thirdSub} error={formError?.diagnosis?.thirdSub} name="thirdSub" placeholder="-- Enter Tertiary Sub Diagnosis --" />
                <CustomInput onChange={handleInputChange} label="Package" placeholder="Enter Package" type="number" min={0} value={formData?.package} error={formError?.package} name="package" />
              </div>

              <h2 className="text-2xl font-semibold text-primary-900 border-l-4 border-primary-400 pl-3 mt-12 mb-10">Reports Upload</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 ">
                <ChildrenComponent id={formData?.Date} label="PREVIOUS REPORTS" handelInputChange={handleInputChange} formData={formData} uploadType="previousReports" SectionType="customer" />
                <ChildrenComponent id={formData?.Date} label="PREVIOUS TREATMENT" handelInputChange={handleInputChange} formData={formData} uploadType="previousTreatment" SectionType="customer" />
                <ChildrenComponent id={formData?.Date} label="Pictures" handelInputChange={handleInputChange} formData={formData} uploadType="pictures" SectionType="customer" />
                <ChildrenComponent id={formData?.Date} label="External Uploads" handelInputChange={handleInputChange} formData={formData} uploadType="externalUploads" SectionType="customer" />
              </div>
            </div>
          )}

          <div className="px-6 py-6 rounded-md ">
            <h2 className="text-2xl font-semibold text-primary-900 border-l-4 border-primary-400 pl-3 mt-12 mb-10">Others</h2>

            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <label htmlFor="CaseMark" className="text-md">
                  Rate Case
                </label>
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <FaStar key={index} onClick={(e) => handleStarRating(e, index + 1, 'CaseRating', formData?.Date)} className={`cursor-pointer h-5 w-5 ${index < formData?.CaseRating ? 'text-yellow-400 fas' : 'text-gray-300 far'}`} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 items-center gap-5">
                <div className="flex items-center gap-2">
                  <label htmlFor="CaseMark" className="text-md">
                    Case Study
                  </label>
                  <input type="checkbox" id="CaseMark" checked={formData?.CaseMark} onChange={(e) => handleCheckboxChange(e, 'CaseMark', formData?.Date)} className="h-5 w-5" />
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="ReviewMark" className="text-md">
                    Review
                  </label>
                  <input type="checkbox" id="ReviewMark" checked={formData?.ReviewMark} onChange={(e) => handleCheckboxChange(e, 'ReviewMark', formData?.Date)} className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <CustomSelect disabled={''} label="Patient Status" options={statusOptions} onChange={handleInputChange} value={formData?.PatientStatus} name={'PatientStatus'} placeholder={'--Select Status--'} />
              <CustomSelect disabled={''} label="Type Of Patient" options={['Online', 'Offline']} onChange={handleInputChange} value={formData?.Patient_Type} name={'Patient_Type'} placeholder={'--Select Patient Type--'} />
            </div>
          </div>

          {/* create item button */}
          <div className="lg:w-80 mx-auto w-full px-5  ">
            <CustomButton onClick={handleForm} isProcessing={isProcessing} label={patientId == 'addNew' ? 'Submit' : 'Save'} />
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
        {uploadType !== 'pictures' ? uploadType !== 'externalUploads' && (formData?.[uploadType] ? '1 File' : 'No File Uploaded') : `${formData?.[uploadType]?.length} image uploded`}
        {uploadType == 'externalUploads' && `${formData?.[uploadType]?.length || 'No'} files uploaded`}
      </label>
      {uploadType == 'externalUploads' && (
        <div className="flex flex-col bg-white p-2 h-[10vh] overflow-y-scroll gap-2">
          {formData?.[uploadType]?.map((file) => (
            <a className="text-blue-700 font-bold" target="_blank" href={`${END_POINT}/customer/get/${file?.id}`}>
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
              !['pictures', 'externalUploads'].includes(uploadType) ? dispatch(RemoveFile(formData?.[uploadType], formData?._id, uploadType, 'customer')) : dispatch(DeleteImages({ fileIds: uploadType == 'externalUploads' ? formData?.[uploadType]?.map((i) => i?.id) : formData?.[uploadType] }, formData?._id, 'customer', uploadType));
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
                uploadType !== 'pictures' ? window.open(`${END_POINT}/customer/get/${formData?.[uploadType]}`) : setShowImages(true);
              }}
            >
              VIEW
            </p>
          </button>
        )}
      </div>

      {isModalOpen !== 'pictures' ? uploadType !== 'externalUploads' && <FileUploadModal isOpen={isModalOpen} closeModal={handleCloseModal} onFileUpload={handleFileUpload} uploadType={uploadType} /> : <ImageUploadModal isOpen={isModalOpen} closeModal={handleCloseModal} onImageUpload={handleImageUpload} />}
      {showImage == true && <ImageShowModal isOpen={showImage} closeModal={handleImageCloseModal} Images={formData?.[uploadType]} />}
      {isModalOpen == 'externalUploads' && <MultipleFileUploads isOpen={isModalOpen} closeModal={handleCloseModal} onFileUpload={handleMutlipleFileUploads} uploadType={uploadType} />}
    </div>
  );
};
