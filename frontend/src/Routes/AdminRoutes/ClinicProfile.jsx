import React, { useEffect, useState } from "react";
import CustomInput from "../../Components/CommonComponents/CustomInput";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getJwtToken } from "../../Redux/AdminReducer/action";
import { useNavigate, useParams } from "react-router-dom";
import { END_POINT} from "../../Redux/AdminReducer/action";
import CustomImageInput from "../../Components/CommonComponents/CustomImageInput";
import axios from "axios";
import CustomButton from "../../Components/CommonComponents/CustomButton";
import RightWrapper from "../../Components/CommonComponents/ComponentWrapper"


const fetchSingleItem = async (id) => {
  try {
    const result = await axios.get(`${END_POINT}/clinic-profile/`, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    return result;
  } catch (error) {
    toast.error(error?.response?.data || "Something went wrong");
    console.log(error);

    toast.error("Something went wrong while fetching data");
  }
};

const createItem = async (data, navigate, setIsPorcessing) => {
  
  try {
    const result = await axios.post(`${END_POINT}/clinic-profile`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    setIsPorcessing(false);
    toast.success("Saved Successfully");
  } catch (error) {
    toast.error(error?.response?.data || "Something went wrong");
    setIsPorcessing(false);
  }
};


const initialFormData = {
    ClinicName: '',
    DoctorName: '',
    ClinicContact: '',
    ClinicEmail: '',
    Logo: '',
};

const initialFormError = initialFormData;

const ClinicProfile = () => {
  const [formData, setFormData] = useState();
  const [formError, setFormError] = useState(initialFormError);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
      fetchSingleItem().then((e) => {
        setFormData(e?.data);
      });
    
  }, []);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, data: { ...prev?.data, [name]: value } }));
  };

  const handlesubmit=async(e)=>{
    e.preventDefault()
    let formdi = new FormData(e.target)
    await createItem(formdi, navigate, setIsProcessing)
  }

  return (
    <RightWrapper>
      <button
        onClick={(e) => {
          navigate(-1);
        }}
        className="bg-blue-800 rounded-lg font-semibold text-white p-2 px-3"
      >
        Back
      </button>
      <h3 className="text-black text-3xl font-semibold mt-3">Clinic Profile</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 ">
        <form onSubmit={handlesubmit} method="post">
        <CustomInput label={"Clinic Name"} name={"ClinicName"} type={"text"} value={formData?.data?.ClinicName} onChange={handleInputChange} placeholder={"Enter Clinic Name"} error={formError.ClinicName} />
        <CustomInput label={"Doctor Name"} name={"DoctorName"} type={"text"} value={formData?.data?.DoctorName} onChange={handleInputChange} placeholder={"Enter Doctor Name"} error={formError.DoctorName} />
        <CustomInput label={"Clinic Contact"} name={"ClinicContact"} type={"tel"} value={formData?.data?.ClinicContact} onChange={handleInputChange} placeholder={"Enter Clinic Contact"} error={formError.ClinicContact} />
        <CustomInput label={"Clinic Email"} name={"ClinicEmail"} type={"email"} value={formData?.data?.ClinicEmail} onChange={handleInputChange} placeholder={"Enter Clinic Email"} error={formError.ClinicEmail} />
        {formData?.imageData && 
        <div className="m-10">
        <img src={`data:image/jpeg;base64,${formData?.imageData}`} alt="" srcset="" />
        </div>
        }
        <CustomImageInput required={false} label={formData?.imageData?"Change Logo":"Add Logo"} name={"Logo"} type={"file"} value={formData?.data?.Logo} placeholder={"Upload Logo"} error={formError.Logo} />
        <CustomButton isProcessing={isProcessing} label='Save' />
        </form>
      </div>

      <ToastContainer />
    {/* </div> */}
    </RightWrapper>
  );
};

export default ClinicProfile;
