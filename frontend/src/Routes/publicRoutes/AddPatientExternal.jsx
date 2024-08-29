import React, { useEffect, useState } from 'react';
import CustomInput from '../../Components/CommonComponents/CustomInput';
import CustomButton from '../../Components/CommonComponents/CustomButton';
import CustomBreadcrumbs from '../../Components/CommonComponents/CustomBreadcrumbs';
import CustomSelect from '../../Components/CommonComponents/CustomSelect';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addNewPatient } from '../../Redux/AdminReducer/action';
import CustomImageInput from '../../Components/CommonComponents/CustomImageInput';
import { RefrenceList, educationLevels, indianStatesAndUTs, statusOptions } from '../../Files/dropdownOptions';
import { useNavigate } from 'react-router-dom';

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

// const initialFormData = {
//   firstName: '',
//   middleName: '',
//   surname: '',
//   email: '',
//   serialNumber: '',
//   bloodGroup: '',
//   gender: '',
//   maritalStatus: '',
//   motherTongue: '',
//   education: '',
//   state: '',
//   reference: '',
//   location: '',
//   pincode:'',
//   patientStatus: '',
//   profession: '',
//   pic: 'https://res.cloudinary.com/dmzzzl5jj/image/upload/v1673894892/avatar_gvyled.jpg',
//   mobile: '',
//   role: 'Customer',
//   status: '',
//   patientNo: '',
//   date: new Date().toISOString().slice(0, 10),
//   dateOfBirth: '',
//   anniversary: '',
//   weight: '',
//   height: '',
//   industry: '',
// };

export default function AddNewPatientExternal() {
  // define form state's
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormData);
  const addNewPatientMessage = useSelector((state) => state.AdminReducer.addNewPatientMessage);
  const addNewPatientFail = useSelector((state) => state.AdminReducer.addNewPatientFail);
  const addNewPatientProcessing = useSelector((state) => state.AdminReducer.addNewPatientProcessing);
  const addNewPatientSuccess = useSelector((state) => state.AdminReducer.addNewPatientSuccess);
  const [iscreen, setiscreen] = useState('add');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tcaggrement, settcaggrement] = useState(null);

  // handel input change
  const handelInputChange = (event) => {
    const { name, value } = event.target;

    // update form state
    setFormData({ ...formData, [name]: value });
  };

  // handel add new patient button click
  const handelAddNewPatientClick = () => {
    // define variables
    let isValidInput = true;
    const trimmedFormData = { ...formData };
    let updatedFormError = { formError };

    // Trim all fields
    for (const key in trimmedFormData) {
      if (trimmedFormData.hasOwnProperty(key)) {
        if (typeof trimmedFormData[key] === 'string') {
          trimmedFormData[key] = trimmedFormData[key].trim();
        }
      }
    }

    // validate phone
    if (!trimmedFormData.mobile) {
      updatedFormError.mobile = 'Phone number is required!';
      isValidInput = false;
    } else if (!/^\d{10}$/.test(trimmedFormData.mobile)) {
      updatedFormError.mobile = 'Invalid phone number, must be 10 digits!';
      isValidInput = false;
    }

    // validate  first name
    if (!trimmedFormData.firstName) {
      updatedFormError.firstName = 'First Name is required!';
      isValidInput = false;
    }

    // validate  middle name
    if (!trimmedFormData.middleName) {
      updatedFormError.middleName = 'Middle Name is required!';
      isValidInput = false;
    }

    // validate sur name
    if (!trimmedFormData.surname) {
      updatedFormError.surname = 'Surname Name is required!';
      isValidInput = false;
    }

    // Update the formError state
    setFormError(updatedFormError);

    if (!isValidInput) {
      Object.keys(updatedFormError)?.map((f) => {
        toast.error(updatedFormError?.[f]);
      });
    }

    // dispatch add new patient if no error found in form
    if (isValidInput) {
      dispatch(addNewPatient(trimmedFormData));
    }
  };

  // useEffect to display toast message
  useEffect(() => {
    // check if successfully created
    if (addNewPatientMessage && addNewPatientSuccess && !addNewPatientProcessing) {
      window.location.replace('/web/afterAction');

      //  reset states
      setFormData(initialFormData);
      setFormError(initialFormData);
    }

    if (addNewPatientMessage && addNewPatientFail && !addNewPatientProcessing) {
      toast.error(addNewPatientMessage, { position: toast.POSITION.TOP_RIGHT });
    }
  }, [addNewPatientProcessing]);

  return (
    <div className="h-fit min-h-[100vh] w-full bg-white p-1 md:p-10 lg:p-20">
      {iscreen == 'add' && (
        <div className="bg-primary-50 pb-8 rounded-md pt-4 border-2 border-primary-400">
          <div className="px-2 sm:px-4 lg:px-6 py-2 md:py-6 rounded-md ">
            <h2 className="text-lg md:text-1xl lg:text-2xl font-semibold text-primary-900 border-l-4 border-primary-400 pl-3 ">Personal Information</h2>

            <div className="grid grid-cols-2 gap-x-2 md:gap-x-6 ">
              <CustomInput onChange={handelInputChange} label="First Name" placeholder="Enter First Name" type="text" value={formData.firstName} error={formError.firstName} name="firstName" />
              <CustomInput onChange={handelInputChange} label="Middle Name" placeholder="Enter Middle Name" type="text" value={formData.middleName} error={formError.middleName} name="middleName" />
              <CustomInput onChange={handelInputChange} label="Last Name" placeholder="Enter Last Name" type="text" value={formData.surname} error={formError.surname} name="surname" />
              <CustomInput onChange={handelInputChange} label="Email" placeholder="example@gmail.com" type="text" value={formData.email} error={formError.email} name="email" />
              <CustomInput onChange={handelInputChange} label="Contact Number" placeholder="09999999999" type="number" value={formData.mobile} error={formError.mobile} name="mobile" />
              <CustomInput onChange={handelInputChange} label="Address" placeholder="Enter Address" type="text" value={formData.location} error={formError.location} name="location" />
              <CustomInput onChange={handelInputChange} label="Pincode" placeholder="Enter Pincode" type="number" value={formData.pincode} error={formError.pincode} name="pincode" />
              <CustomSelect onChange={handelInputChange} options={indianStatesAndUTs} label="State" value={formData.state} error={formError.state} name="state" placeholder="-- Select State --" />
              <CustomSelect onChange={handelInputChange} options={educationLevels} label="Education" placeholder="-- Select Patient Education --" type="text" value={formData.education} error={formError.education} name="education" />
              <CustomSelect onChange={handelInputChange} options={['Homemaker', 'Teacher', 'Student', 'Retired', 'IT', 'Business', 'Engineering', 'Medical', 'Grade I & II', 'Senior Management', 'Defence', 'Baby', 'Police', 'Unknown', 'Self Employed']} label="Profession" value={formData.profession} error={formError.profession} name="profession" placeholder="-- Select Profession --" />
              <CustomInput onChange={handelInputChange} label="Industry" value={formData.industry} error={formError.industry} name="industry" placeholder="Enter Industry"></CustomInput>
              <CustomSelect onChange={handelInputChange} options={RefrenceList} label="Reference" placeholder="-- Select Patient Reference --" type="text" value={formData.reference} error={formError.reference} name="reference" />
              <CustomInput onChange={handelInputChange} label="Mother Tongue" placeholder="Enter Patient Mother Tongue" type="text" value={formData.motherTongue} error={formError.motherTongue} name="motherTongue" />
              <CustomSelect onChange={handelInputChange} options={['Male', 'Female', 'Other']} label="Gender" value={formData.gender} error={formError.gender} name="gender" placeholder="-- Select Gender --" />
              <CustomInput onChange={handelInputChange} label="Date of Birth" placeholder="Enter Date of Birth" type="date" value={formData.dateOfBirth} error={formError.dateOfBirth} name="dateOfBirth" />
              <CustomSelect onChange={handelInputChange} options={['Single', 'Married', 'Divorced']} label="Marital Status" value={formData.maritalStatus} error={formError.maritalStatus} name="maritalStatus" placeholder="-- Select Marital Status --" />
              <CustomInput onChange={handelInputChange} label="Anniversary" placeholder="Enter Anniversary" type="date" value={formData.anniversary} error={formError.anniversary} name="anniversary" />
              {/* <CustomImageInput label='Profile Image' onChange={''} // Add a new handler for image change label="Profile Picture" name="profilePicture" // Add a name for the image input */}
            </div>
          </div>

          {/* Personal Information */}
          <div className="px-6 py-6 rounded-md ">
            <h2 className="text-2xl font-semibold text-primary-900 border-l-4 border-primary-400 pl-3 ">Medical Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 ">
              <CustomSelect onChange={handelInputChange} options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} label={'Blood Group'} value={formData.bloodGroup} error={formError.bloodGroup} name="bloodGroup" placeholder="-- Select Blood Group --" />
              <CustomInput onChange={handelInputChange} label="Weight (in KG)" placeholder="Enter Weight" type="number" value={formData.weight} error={formError.weight} name="weight" />
              <CustomInput onChange={handelInputChange} label="Height (in Centimeters)" placeholder="Enter Height (cm)" type="number" value={formData.height} error={formError.height} name="height" />
            </div>
          </div>
          <div className="mt-4 mb-2 flex flex-col items-center">
            <label className="flex items-center">
              <input type="checkbox" className="w-6 h-6" checked={tcaggrement} onChange={(e) => settcaggrement(!tcaggrement)} />
              <span className="ml-2">Accept Terms and Conditions</span>
            </label>

            {!tcaggrement && (
              <div className="text-red-500 mt-2">
                Please accept the Terms and Conditions after reading Form 1 and Form 2{' '}
                <button
                  className="font-bold text-blue-800 text-lg underline"
                  onClick={(e) => {
                    setiscreen('form');
                  }}
                >
                  Here
                </button>
              </div>
            )}
          </div>
          {/* add new patient button  */}
          <div className="lg:w-80 mx-auto w-full px-5  ">
            <CustomButton
              onClick={(e) => {
                if (!tcaggrement) {
                  toast.error('Accept terms and condition first');
                  return false;
                }
                handelAddNewPatientClick(e);
              }}
              isProcessing={tcaggrement && addNewPatientProcessing}
              label="Add New Patient"
            />
          </div>
        </div>
      )}

      {iscreen === 'form' && (
        <div className="flex flex-col gap-3">
          <button
            className="p-2 rounded-lg bg-blue-800 w-28 text-white font-semibold"
            onClick={(e) => {
              setiscreen('add');
            }}
          >
            Back
          </button>
          <div className="bg-slate-200 rounded-md p-4 shadow-md">
            <div class="form-container mb-6">
              <h2 class="text-lg font-semibold text-black border-l-4 border-primary-400 pl-3 mb-4">Form 1</h2>

              <div class="mb-6">
                <h3 class="text-xl font-semibold mb-2">Information about Homeopathy</h3>
                <p>
                  Homeopathy views health and wellbeing in a holistic manner, consultations include a comprehensive intake that carefully evaluates symptoms on the mental, emotional, and physical level. You shall be asked about your temperament, personal habits, likes/dislikes and unique outlook on life. The homeopathic interview takes the whole person into consideration, and regards the
                  spiritual, mental, and emotional symptoms to be as important as the physical aspects. Providing this information will allow your doctor to understand each client as an individual, and to provide the most appropriate means of care.
                </p>

                <p>
                  This view differs from most conventional approaches, which typically limit concerns to the individual symptoms and their treatment. The goal of homeopathic treatment is to strengthen the constitution of the whole person. Treatment in homeopathy is individualized (tailored to each person). Homeopathic practitioners select remedies according to a total picture of the patient,
                  including not only symptoms but lifestyle, emotional and mental states, and other factors.
                </p>

                <p>I am aware that the outcome and duration of homeopathic treatment vary by individual and cannot be guaranteed.</p>
              </div>

              <div class="mb-6">
                <h3 class="text-xl font-semibold mb-2">What to Expect from Remedies</h3>
                <p>Homeopathic remedies are safe, have no known side effects, and can be used safely and effectively with conventional medications. However, homeopathic remedies cannot be used in place of conventional medications. Also, homeopathic remedies can sometimes cause a retrace of old symptoms, in which symptoms become temporarily heightened as part of the healing process.</p>

                <p>I acknowledge that the nature of homeopathic medicine and basic homeopathic processes of treatment have been explained to me sufficiently so that I am willingly giving my consent to Dr Shital Khodke for homeopathic treatments.</p>

                <p>If you ever have any concerns about the nature of your treatment, please feel free to discuss them with me. I recommend that you inform your medical doctor that you are receiving homeopathic treatment.</p>
              </div>

              <div class="mb-6">
                <h3 class="text-xl font-semibold mb-2">Appointments</h3>

                <h4 class="text-lg font-semibold mb-2">CONSENT TO APPOINTMENT AND CANCELLATION POLICY</h4>
                <p>Our goal is to provide quality health care in a timely manner. In order to do so we have had to implement an appointment/cancellation policy. The policy enables us to better utilize available appointments for our patients in need of care.</p>

                <h4 class="text-lg font-semibold mb-2">Scheduled Appointments</h4>
                <p>For a scheduled appointment please call 9920796527. We encourage you to schedule appointments for preventative health visits, chronic medical conditions and general health maintenance.</p>

                <h4 class="text-lg font-semibold mb-2">Cancellation of an Appointment</h4>
                <p>In order to be respectful of the health needs of others please be courteous and call the clinic promptly if you are unable to attend an appointment. This time will be reallocated to someone who is in urgent need of treatment. This is how we can best serve the needs of individuals and families.</p>

                <p>If it is necessary to cancel your scheduled appointment, we require that you call by 10 a.m. one (1) working day in advance. Appointments are in high demand, and your early cancellation will give another person the possibility to have access to timely medical care.</p>

                <h2 class="text-lg font-semibold text-black border-l-4 border-primary-400 pl-3 mb-4">Form 2</h2>
              </div>
            </div>
          </div>

          <div className="bg-slate-200 rounded-md p-4 shadow-md">
            <div className="form-container">
              <h2 className="text-lg font-semibold text-black border-l-4 border-primary-400 pl-3 mb-4">Form 2</h2>
              <div class="mb-6">
                <h4 class="text-lg font-semibold mb-2">How to Cancel Your Appointment</h4>

                <h3 class="text-xl font-semibold mb-2">Appointment Cancellation Policy</h3>
                <p>To cancel appointments, please call 9920796527. If you do not reach us, you may leave a detailed text message. Note that cancellations via email are not accepted.</p>

                <h4 class="text-lg font-semibold mb-2">Late Cancellations</h4>
                <p>Late cancellations will be considered as a “no show”.</p>

                <h4 class="text-lg font-semibold mb-2">No Show Policy</h4>
                <p>A “no show” is someone who misses an appointment without cancelling it by 10 a.m. one (1) working day in advance. No-shows inconvenience those individuals who need access to care in a timely manner.</p>

                <p>
                  A failure to present at the time of a scheduled appointment will be recorded in the patients’ chart as a “no show”. An administrative fee will be waived for the first “no show”, and $300.00 for subsequent “no shows” will be billed to the patient’s account or sent to the patient’s home. The patient will be sent a letter alerting them to the fact that they have failed to show up
                  for an appointment and did not cancel the appointment by 10 a.m. (1) working day in advance. A copy of the letter will be placed in the patient file. Three “no shows” will result in the temporary suspension of services. In order to reinstate services, the patient will be required to meet with the Doctor to evaluate the situation.
                </p>
              </div>

              <div class="mb-6">
                <h3 class="text-xl font-semibold mb-2">Acute Consultations</h3>
                <p>We realize that illnesses and accidents often occur unexpectedly. In an effort to provide the convenience of timely healthcare, we offer acute consultations. Acute consultations are for urgent and unpredictable medical care. The acute consultation will only manage the presenting problem. For other medical concerns, a booked appointment will be provided.</p>

                <p>All emergencies will be given priority.</p>
              </div>

              <div class="mb-6">
                <h3 class="text-xl font-semibold mb-2">Communications</h3>

                <h4 class="text-lg font-semibold mb-2">Email Policy</h4>
                <p>
                  There is an expanding reliance on electronic communication motivated by the convenience, speed, cost-effectiveness, and environmental advantages of its use. If you choose to communicate with Dr. Shital Khodke via e-mail, know that email is considered an official means for communication with Aditya Homeopathic Clinic, and if used, your emails may be included in your patient file.
                </p>

                <p>This policy outlines appropriate use of e-mail communication with Aditya Homeopathic Clinic. It is important to note that email is not a confidential method of communicating medical information.</p>

                <h4 class="text-lg font-semibold mb-2">Email Communication Guidelines</h4>
                <ul>
                  <li>To clarify instructions or ask a question about recommendations made during your office visit.</li>
                  <li>To ask questions that don't require discussion.</li>
                </ul>

                <p>Email communication is not appropriate for:</p>

                <ul>
                  <li>Communicating urgent or emergency information.</li>
                  <li>Asking for opinion or discussion of a new health issue not yet evaluated in-office.</li>
                </ul>

                <p>Email communication does not take the place of an office visit. If you think you need to be seen, please book an appointment.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* toast message  */}
      <ToastContainer />
    </div>
  );
}
