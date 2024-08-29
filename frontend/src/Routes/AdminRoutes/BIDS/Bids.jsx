import { useNavigate, useParams } from "react-router-dom";
import RightWrapper from "../../../Components/CommonComponents/ComponentWrapper";
import axios from "axios";
import { END_POINT, getJwtToken } from "../../../Redux/AdminReducer/action";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import CustomButton from "../../Components/CommonComponents/CustomButton";
// import CustomInput from "../../Components/CommonComponents/CustomInput";
// import CustomTextarea from "../../Components/CommonComponents/CustomTextarea";

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

const Bids = () => {
  const { bid_id } = useParams();
  const [formData, setFormData] = useState();
  const nav = useNavigate();

  useEffect(() => {
    fetchItems(`alternative_therapy/getForm/${bid_id}`).then((e) => {
      setFormData(e?.data);
    });
  }, [bid_id]);

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
      <h3 className="text-black text-2xl font-semibold">Alternative Therapies - {formData?.therapy}</h3>
      <h3 className="text-black text-2xl font-semibold pt-3 ps-3">Form Data</h3>
      <div className="scrollwrapper h-[70vh]" style={{ overflowY: "scroll" }}>
        <div className="formwrapper bg-white mt-5">
          <div className="formSection grid grid-cols-2 p-7 gap-x-20 gap-y-5">
            {Object.entries(formData?.requestForm || {})?.map((e) => (
              <div className="grid grid-cols-2 gap-x-10">
                <div className="capitalize text-bluegray-200 text-lg">{e?.[0]}:</div>
                <input className="font-normal uppercase bg-blue-100 p-2 rounded-lg text-bluegray-200" value={e?.[1]} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 mt-2">
          <h3 className="text-black text-2xl font-semibold pt-3 ps-3">Duration</h3>
          <h3 className="text-black text-2xl font-semibold pt-3 ps-3">{formData?.duration}</h3>
        </div>
        <div className="grid grid-cols-2 mt-2">
          <h3 className="text-black text-2xl font-semibold pt-3 ps-3">Note</h3>
          <p className="text-black text-lg font-semibold pt-3 ps-3">{formData?.note}</p>
        </div>
    </RightWrapper>
  );
};

export default Bids;
