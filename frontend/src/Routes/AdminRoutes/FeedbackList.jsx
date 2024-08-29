import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

import { END_POINT } from '../../Redux/AdminReducer/action';
import { RefrenceList, educationLevels, indianStatesAndUTs, statusOptions } from '../../Files/dropdownOptions';
import CustomInput from '../../Components/CommonComponents/CustomInput';
import CustomSelect from '../../Components/CommonComponents/CustomSelect';
import CustomTextarea from '../../Components/CommonComponents/CustomTextarea';
import CustomButton from '../../Components/CommonComponents/CustomButton';

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
  comments: '',
  CaseRating: 0,
  Signature: '',
};

const initialFormError = { ...initialFormData };

const FeedbackList = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [isPatientAccordionOpen, setIsPatientAccordionOpen] = useState(true);
  const { feedback_id } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems(`feedback/${feedback_id}`).then((res) => {
      setFormData(res?.data);
    });
  }, []);

  const handleStarRating = (rating) => {
    console.log('Updating rating:', rating);
    setFormData((prevData) => ({
      ...prevData,
      CaseRating: rating,
    }));
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePatientAccordionToggle = () => {
    setIsPatientAccordionOpen(!isPatientAccordionOpen);
  };
  //jfenjd
  const LabelValuePair = ({ label, value }) => (
    <div className="label flex">
      <div className="w-44">
        <span className="label-text text-lg text-black font-semibold">{label}:</span>
      </div>
      <p className="text-gray-600">
        {label === 'Content' ? (
          <>
            {isExpanded ? value : `${value.substring(0, 50)}...`}
            {value.length > 50 && (
              <span style={{ cursor: 'pointer', color: 'blue', marginLeft: '4px' }} onClick={toggleExpand}>
                {isExpanded ? 'Read less' : 'Read more'}
              </span>
            )}
          </>
        ) : (
          value
        )}
      </p>
    </div>
  );

  return (
    <div className="m-3 rounded-md bg-slate-100 h-fit min-h-[100vh] px-12 w-full py-10">
      <button
        onClick={(e) => {
          navigate(-1);
        }}
        className="bg-blue-800 rounded-lg font-semibold text-white p-2 px-3"
      >
        Back
      </button>
      <div className={`p-5 flex flex-column ${isPatientAccordionOpen ? 'open' : ''}`}>
        <div className="bg-primary-50 pb-8 rounded-md pt-4 border-2 border-primary-400 w-full">
          <div className="accordion-header flex justify-between items-center" onClick={handlePatientAccordionToggle}>
            <h2 className="text-2xl font-semibold text-primary-900 border-primary-400 pl-3">Patient Details</h2>
            <button className={`toggle-symbol text-2xl font-semibold text-primary-900 border-primary-400 pe-10 ${isPatientAccordionOpen ? 'open' : ''}`}>&#9660;</button>
          </div>
          {isPatientAccordionOpen && (
            <>
              <div className=" rounded-md">
                <div className="px-6 py-3 rounded-md">
                  <div className="grid grid-cols-3 gap-x-6">
                    <LabelValuePair label="Status" value={formData.Status} />
                    <LabelValuePair label="Case No" value={formData.CaseNo} />
                    <LabelValuePair label="Date" value={formData.Date} />
                  </div>
                </div>
              </div>
              <div className=" rounded-md">
                <div className="px-6 py-3 rounded-md">
                  <div className="grid grid-cols-2 gap-x-6">
                    <div>
                      <LabelValuePair label="First Name" value={formData.FirstName} />
                      <LabelValuePair label="Middle Name" value={formData.MiddleName} />
                      <LabelValuePair label="Last Name" value={formData.LastName} />
                      <LabelValuePair label="Date of Birth" value={formData.dateOfBirth} />
                      <LabelValuePair label="Blood Group" value={formData.bloodGroup} />
                      <LabelValuePair label="Gender" value={formData.gender} />
                      <LabelValuePair label="Mobile Number" value={formData.mobile} />
                      <LabelValuePair label="Marital Status" value={formData.maritalStatus} />
                      <LabelValuePair label="Mother Tongue" value={formData.motherTongue} />
                      <LabelValuePair label="State" value={formData.state} />
                      <LabelValuePair label="Education" value={formData.education} />
                      <LabelValuePair label="Address" value={formData.address} />
                      <LabelValuePair label="Profession" value={formData.profession} />
                      <LabelValuePair label="Industry" value={formData.industry} />
                      <LabelValuePair label="Email ID" value={formData.email} />
                    </div>
                    <div>
                      <h4 className="text-xl text-black font-bold">Complaints</h4>
                      <div className="complaintsList flex flex-col gap-2">
                        {formData?.complaints?.map((e) => (
                          <li htmlFor="">{e?.content}</li>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="bg-primary-50 pb-8 rounded-md pt-4 border-2 border-primary-400">
          <h2 className="text-2xl font-semibold text-primary-900 border-primary-400 pl-3">Feedback</h2>
          <span className="label-text font-semibold text-lg pl-3">Comments:</span>

          <div className="label-box max-h-96 overflow-y-auto">
            {Array.isArray(formData.comments) ? (
              formData.comments.map((comment, index) => (
                <div key={index} className="m-3 rounded-md bg-gray-100 h-fit lg:px-6 w-50 p-5 bg-white">
                  <div className="headingTitle flex justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-40">
                        <label htmlFor="CaseMark" className="text-lg font-semibold text-black">
                          Rate Case
                        </label>
                      </div>
                      {[...Array(5)].map((_, starIndex) => (
                        <FaStar key={starIndex} onClick={() => handleStarRating(starIndex + 1)} className={`cursor-pointer h-5 w-5 ${starIndex < comment.rating ? 'text-yellow-400 fas' : 'text-gray-300 far'}`} />
                      ))}
                    </div>
                  </div>
                  <LabelValuePair label="Content" value={comment.content} />
                  <LabelValuePair label="Signature" value={comment.signature} />
                </div>
              ))
            ) : (
              <p>No comments available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackList;
