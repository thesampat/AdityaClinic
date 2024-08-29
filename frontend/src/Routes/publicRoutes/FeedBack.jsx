import React, { useEffect, useState } from 'react';
import CustomInput from '../../Components/CommonComponents/CustomInput';
import CustomSelect from '../../Components/CommonComponents/CustomSelect';
import CustomTextarea from '../../Components/CommonComponents/CustomTextarea';
import statesData from '../../Files/states.json';
import { RefrenceList, educationLevels, indianStatesAndUTs, statusOptions } from '../../Files/dropdownOptions';
import axios from 'axios';
import { UploadFile, END_POINT, RemoveFile, UploadImages, DeleteImages } from '../../Redux/AdminReducer/action';
import CustomButton from '../../Components/CommonComponents/CustomButton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaRegStar, FaStar } from 'react-icons/fa';
import AfterActionComponent from './actionView';

const createItem = async (data, navigate, setIsPorcessing, setSelectedPatient, setOperateType) => {
  try {
    const result = await axios.post(`${END_POINT}/feedback`, data);
    setSelectedPatient(result?.data);
    setIsPorcessing(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    toast.success('Created Successfully');
    return result?.data._id;
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    setIsPorcessing(false);
  }
};

const submitComments = async (patientId, rating, comments, signature, setIsPorcessing, setOperateType, navigate) => {
  try {
    const feedbackData = {
      date: new Date().toISOString().slice(0, 10),
      content: comments,
      signature,
      rating,
    };
    await axios.put(`${END_POINT}/feedback/${patientId}`, { comments: feedbackData });
    setIsPorcessing(false);
    setOperateType(null);
    toast.success('Comments submitted successfully');
    navigate(`/web/afterAction`);
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    toast.error('Failed to submit comments');
    console.error(error);
  }
};

const fetchItems = async (path) => {
  try {
    const result = await axios.get(`${END_POINT}/${path}`);
    return result;
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    console.log(error);

    toast.error('Something went wrong while fetching data');
  }
};

const initialFormData = {
  FirstName: '',
  MiddleName: '',
  LastName: '',
  dateOfBirth: '',
  bloodGroup: '',
  gender: '',
  mobile: '',
  maritalStatus: '',
  motherTongue: '',
  state: '',
  education: '',
  address: '',
  profession: '',
  industry: '',
  email: '',
  Status: '',
  CaseNo: '',
  Date: '',
  complaints: Array.from({ length: 10 }, () => ({ content: '' })),
};

const initialFormError = { ...initialFormData };

const initialFormDataForUpdate = {
  comments: '',
  CaseRating: 0,
  Signature: '',
};

const initialFormDataForUpdateError = { ...initialFormDataForUpdate };

export const FeedBack = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [FormDataForUpdate, setFormDataForUpdate] = useState(initialFormDataForUpdate);
  const [patientList, setPatientList] = useState([]);
  const [operateType, setOperateType] = useState(null);
  const navigate = useNavigate();
  const [isProcessing, setIsPorcessing] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formErrorForUpdate, setFormErrorForUpdate] = useState(initialFormDataForUpdateError);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInputUpdateChange = (event) => {
    const { name, value } = event.target;

    setFormDataForUpdate((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const updatedFormError = { ...formErrorForUpdate };
    if (name === 'comments' && !value.trim()) {
      updatedFormError.comments = 'Comments are required!';
    } else {
      updatedFormError.comments = '';
    }

    if (name === 'Signature' && !value.trim()) {
      updatedFormError.Signature = 'Signature is required!';
    } else {
      updatedFormError.Signature = '';
    }

    setFormErrorForUpdate(updatedFormError);
  };

  useEffect(() => {
    fetchItems('feedback/patients').then((res) => {
      setPatientList(res?.data);
    });
  }, []);

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
    // let updatedFormError = { formError };

    // //  validate name
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
    // if (!isValidInput) {
    //   Object.keys(updatedFormError)?.map((f) => {
    //     toast.error(updatedFormError?.[f]);
    //   });
    // }
    if (isValidInput) {
      setIsPorcessing(true);
      createItem(trimmedFormData, navigate, setIsPorcessing, setSelectedPatient, setOperateType);
    }
  };
  const handleFormUpdate = () => {
    const trimmedFormData = { ...FormDataForUpdate };
    let isValidInput = true;

    for (const key in trimmedFormData) {
      if (trimmedFormData?.hasOwnProperty(key)) {
        if (typeof trimmedFormData[key] === 'string') {
          trimmedFormData[key] = trimmedFormData[key].trim();
        }
      }
    }

    if (isValidInput) {
      setIsPorcessing(true);
      submitComments(selectedPatient, trimmedFormData.CaseRating, trimmedFormData.comments, trimmedFormData.Signature, setIsPorcessing, setOperateType, navigate);
      setSelectedPatient(null);
    }
  };

  const handleSelectChange = (event) => {
    const selectedPatientName = event.target.value;
    let selectedPatientId = patientList.find((patient) => patient?.FirstName === selectedPatientName)?._id;

    setSelectedPatient(selectedPatientId);
    setOperateType('comment');
  };

  const handleAddButton = (event) => {
    setOperateType('add');
    setSelectedPatient(null);
    setFormData(initialFormData);
  };
  const handleStarRating = (rating) => {
    console.log('Updating rating:', rating);
    setFormDataForUpdate((prevData) => ({
      ...prevData,
      CaseRating: rating,
    }));
  };

  const handleComplaintChange = (index, value) => {
    const updatedComplaints = [...formData.complaints];
    updatedComplaints[index]['content'] = value;

    setFormData({
      ...formData,
      complaints: updatedComplaints,
    });
  };

  return (
    <>
      <div className="w-full justify-between mx-auto w-full px-5 flex">
        {operateType !== 'add' && <CustomSelect onChange={handleSelectChange} options={patientList?.map((e) => e?.FirstName)} label="Patient" placeholder="-- Select Patient Reference --" type="text" value={patientList?.filter((p) => p?._id === selectedPatient)?.[0]?.FirstName} error={formError.reference} name="reference" />}
        <div className="groupofButtons flex gap-10">
          {operateType !== 'add' && (
            <button className="w-fit p-3 mt-6 font-bold bg-primary-200 text-white h-12" onClick={handleAddButton}>
              Add New
            </button>
          )}

          <button className="w-fit p-3 mt-6 font-bold bg-primary-200 text-white h-12" onClick={() => setOperateType(null)}>
            Back
          </button>
        </div>
      </div>

      {operateType == 'add' && (
        <div className="p-20">
          <div className="bg-primary-50 pb-8 rounded-md pt-4 border-2 border-primary-400 ">
            <div className="pb-8 rounded-md pt-4">
              <div className="px-6 py-6 rounded-md">
                <div className="grid grid-cols-3 gap-x-6">
                  <CustomInput onChange={handleInputChange} label="Status" placeholder="Enter Status" type="text" value={formData.Status} error={formError.Status} name="Status" />
                  <CustomInput onChange={handleInputChange} label="Case No" placeholder="Enter Case No" type="text" value={formData.CaseNo} error={formError.CaseNo} name="CaseNo" />
                  <CustomInput onChange={handleInputChange} label="Date  " type="date" value={formData.Date} error={formError.Date} name="Date" />
                </div>
              </div>
            </div>

            <div className="pb-8 rounded-md pt-4 flex column">
              <div className="px-6 py-6 rounded-md">
                <h2 className="text-2xl font-semibold text-primary-900">Patient Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <CustomInput onChange={handleInputChange} label="First Name" placeholder="Enter First Name" type="text" value={formData.FirstName} error={formError.FirstName} name="FirstName" />
                  <CustomInput onChange={handleInputChange} label="Middle Name" placeholder="Enter Middle Name" type="text" value={formData.MiddleName} error={formError.MiddleName} name="MiddleName" />
                  <CustomInput onChange={handleInputChange} label="Last Name" placeholder="Enter Last Name" type="text" value={formData.LastName} error={formError.LastName} name="LastName" />
                  <CustomInput onChange={handleInputChange} label="Date of Birth" placeholder="Enter Date of Birth" type="date" value={formData.dateOfBirth} error={formError.dateOfBirth} name="dateOfBirth" />
                  <CustomSelect onChange={handleInputChange} options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} label={'Blood Group'} value={formData?.bloodGroup} error={formError?.bloodGroup} name="bloodGroup" placeholder="-- Select Blood Group --" />
                  <CustomSelect onChange={handleInputChange} options={['Male', 'Female', 'Other']} label="Gender" value={formData?.gender} error={formError?.gender} name="gender" placeholder="-- Select Gender --" />
                  <CustomInput onChange={handleInputChange} label="Mobil Number" placeholder="09999999999" type="number" value={formData?.mobile} error={formError?.mobile} name="mobile" />
                  <CustomSelect onChange={handleInputChange} options={['Single', 'Married', 'Divorced', 'Widow']} label="Marital Status" value={formData?.maritalStatus} error={formError?.maritalStatus} name="maritalStatus" placeholder="-- Select Marital Status --" />
                  <CustomSelect onChange={handleInputChange} options={['English', 'Spanish', 'French', 'German', 'Hindi', 'Chinese', 'Other']} label="Mother Tongue" value={formData?.motherTongue} error={formError?.motherTongue} name="motherTongue" placeholder="-- Select Mother Tongue --" />
                  <CustomSelect onChange={handleInputChange} options={indianStatesAndUTs} label="State" value={formData.state} error={formError.state} name="state" placeholder="-- Select State --" />
                  <CustomSelect onChange={handleInputChange} options={['High School', 'Associate Degree', "Bachelor's Degree", "Master's Degree", 'Doctorate', 'Other']} label="Education" value={formData?.education} error={formError?.education} name="education" placeholder="-- Select Education Level --" />
                  <CustomInput label="Address" value={formData?.address} onChange={handleInputChange} name="address" placeholder="Enter your address" error={formError?.address} />
                  <CustomInput label="Profession" value={formData?.profession} onChange={handleInputChange} name="profession" placeholder="Enter your profession" error={formError?.profession} />
                  <CustomInput label="Industry" value={formData?.industry} onChange={handleInputChange} name="industry" placeholder="Enter your industry" error={formError?.industry} />
                  <CustomInput label="Email ID" value={formData?.email} onChange={handleInputChange} name="email" placeholder="Enter your email address" error={formError?.email} />
                </div>
              </div>

              <div className="pb-8 rounded-md pt-4">
                <div className="px-6 py-6 rounded-md ">
                  <h2 className="text-2xl font-semibold text-primary-400  border-l-4 border-primary-400 pl-3 mb-2">Present set of Complaints</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                      {console.log(formData?.complaints)}
                      {formData?.complaints?.map((complaint, index) => (
                        <div key={index}>
                          <label className="block text-sm font-medium text-gray-700">{`Complaint ${index + 1}`}</label>
                          <input type="text" value={complaint?.content} onChange={(e) => handleComplaintChange(index, e.target.value)} className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-80 mx-auto w-full px-5  ">
              <CustomButton onClick={handleForm} isProcessing={isProcessing} label={'Submit'} />
            </div>
          </div>
        </div>
      )}

      {selectedPatient !== null && (
        <div className="p-20">
          <div className="bg-primary-50 pb-8 rounded-md pt-4 border-2 border-primary-400">
            <h2 className="text-2xl font-semibold text-primary-400  border-l-4 border-primary-400 pl-3 mb-2 ms-2">Review </h2>

            <div className="m-3 rounded-md bg-gray-100 h-fit lg:px-6 w-50 p-5 bg-white">
              <div className="headingTitle flex justify-between">
                <div className="flex gap-4">
                  <div className="flex gap-2 items-center">
                    <label htmlFor="CaseMark" className="text-md">
                      Rate Case
                    </label>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <FaStar key={index} onClick={() => handleStarRating(index + 1)} className={`cursor-pointer h-5 w-5 ${index < FormDataForUpdate?.CaseRating ? 'text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-md">
              <div className="px-4 rounded-md ">
                <div className="grid grid-cols-1">
                  <CustomTextarea label="Comments" value={FormDataForUpdate?.comments} onChange={handleInputUpdateChange} name="comments" placeholder="Enter any additional comments..." error={FormDataForUpdate?.comments} rows={10} />

                  <CustomInput label="Signature" value={FormDataForUpdate?.Signature} onChange={handleInputUpdateChange} name="Signature" error={FormDataForUpdate?.Signature} />
                </div>
              </div>
            </div>
            <div className="lg:w-80 mx-auto w-full px-5">
              <CustomButton onClick={handleFormUpdate} isProcessing={isProcessing} label={'Submit'} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
