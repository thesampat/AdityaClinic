import axios from "axios";
import RightWrapper from "../../../Components/CommonComponents/ComponentWrapper";
import { END_POINT, getJwtToken } from "../../../Redux/AdminReducer/action";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomButton from "../../../Components/CommonComponents/CustomButton";
import CustomInput from "../../../Components/CommonComponents/CustomInput";
import CustomTextarea from "../../../Components/CommonComponents/CustomTextarea";
import { useCheckRole } from "../../../UtilityHookFunctions/LoggedInUser";

const fetchItems = async (path) => {
  try {
    const result = await axios.get(`${END_POINT}/${path}`);
    return result;
  } catch (error) {
    toast.error(error?.response?.data || "Something went wrong");
    console.log(error);

    toast.error("Something went wrong while fetching data");
  }
};

const createItem = async (data, navigate, setIsPorcessing, thid) => {
  try {
    const result = await axios.patch(`${END_POINT}/alternative_therapy/approve/${thid}`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    setIsPorcessing(false);
    navigate(`/AlternativeTherapies`);
    toast.success("Waiting for bid");
  } catch (error) {
    toast.error(error?.response?.data || "Something went wrong");
    setIsPorcessing(false);
  }
};


const SubmitConsultantTherapy=()=>{
  const checkrole = useCheckRole()
  return(
    <div>
      {checkrole('consultant')?<div>Consultant Submit</div>:<div>Doctor Review</div>}
    </div>
  )
}


const AlternativeTherapies = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState();
  const { therapy_id } = useParams();
  const [inputdata, setinputdata] = useState({});
  const [isProcessing, setIsPorcessing] = useState(false);
  const checkrole = useCheckRole()

  useEffect(() => {
    fetchItems(`alternative_therapy/getForm/${therapy_id}`).then((e) => {
      setFormData(e?.data);
    });
  }, [therapy_id]);

  const submit_therapy = async () => {
    await createItem(inputdata, nav, setIsPorcessing, therapy_id);
  };

  return (
    <RightWrapper>
      <button
        onClick={(e) => {
          nav(-1);
        }}
        className="bg-blue-800 rounded-lg font-semibold text-white p-2 px-3"
      >
        Back
      </button>
      <h3 className="text-black text-2xl font-semibold">Alternative Therapies</h3>

      <h3 className="text-black text-1xl font-semibold">Type : {formData?.therapy}</h3>

     <div className="requestMainDoctorView">
      <div className="formwrapper bg-white rounded-3xl w-[70vw] mt-5">
        <div className="formSection grid grid-cols-3 p-7 gap-x-20 gap-y-5">
          {Object.entries(formData?.requestForm || {})?.map((e) => (
            <div className="grid grid-cols-2 gap-x-10">
              <div className="capitalize text-bluegray-200 text-lg">{e?.[0]}:</div>
              <input className="font-normal uppercase bg-blue-100 p-2 rounded-lg text-bluegray-200" value={e?.[1]} />
            </div>
          ))}
        </div>
      </div>
      {(checkrole('maindoctor')&& formData?.status === 'requested') &&
        <div className="inputFormButton">
        <div className="w-1/4">
          <CustomInput
            type={"text"}
            name="Duration"
            label={"Enter Duration"}
            value={inputdata?.duration}
            onChange={(i) => {
              setinputdata((prev) => ({ ...prev, duration: i.target.value }));
            }}
            placeholder={"Enter Duration"}
          />
          <CustomTextarea
            type={"text"}
            name="Note"
            label={"Enter Note"}
            value={inputdata?.note}
            onChange={(i) => {
              setinputdata((prev) => ({ ...prev, note: i.target.value }));
            }}
            placeholder={"Enter Duration"}
          />
        </div>
        <div className="lg:w-80 mx-auto w-full px-5">
        <CustomButton onClick={submit_therapy} isProcessing={isProcessing} label={"Accept"} />
      </div>
      </div>}

      {/* {formData?.status === 'treating' && (
        <div>
          <div>
            <label htmlFor="">Accepted Duration</label>
            <h5>{formData?.duration}</h5>
          </div>
        </div>
      )} */}

    
      </div>
    </RightWrapper>
  );
};

export default AlternativeTherapies;
