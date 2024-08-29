import RightWrapper from "../../Components/CommonComponents/ComponentWrapper"
import axios from "axios";
import { END_POINT, getJwtToken } from "../../Redux/AdminReducer/action";
import Table from "./Table";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomButton from "../../Components/CommonComponents/CustomButton";
import CustomInput from "../../Components/CommonComponents/CustomInput";
import CustomTextarea from "../../Components/CommonComponents/CustomTextarea";


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

  const createItem = async (data, navigate, setIsPorcessing, thid) => {
    try {
      const result = await axios.patch(`${END_POINT}/alternative_therapy/approve/${thid}`, data, {
        headers: {
          Authorization: getJwtToken(),
        },
      });
      setIsPorcessing(false);
      navigate(`/AlternativeTherapies`);
      toast.success('Waiting for bid');
    } catch (error) {
      toast.error(error?.response?.data || 'Something went wrong');
      setIsPorcessing(false);
    }
  };

const ConsultantBids=()=>{
    const nav = useNavigate()
    const [formData, setFormData] = useState();
    const {therapy_id} = useParams()
    const [inputdata, setinputdata] = useState({})
    const [isProcessing, setIsPorcessing] = useState(false);


 useEffect(()=>{
    fetchItems(`alternative_therapy/list?search=true&&status=bid`).then(e=>{
        setFormData(e?.data)
    })
 }, [therapy_id])


 const submit_therapy=async()=>{
    await createItem(inputdata, nav, setIsPorcessing, therapy_id)
 }

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
      <h3 className="text-black text-3xl font-semibold mt-3">Bids</h3>
    

       
            
    </RightWrapper>
  );
}

export default ConsultantBids