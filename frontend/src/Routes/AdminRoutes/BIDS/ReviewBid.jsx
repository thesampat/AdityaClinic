import { useNavigate, useParams } from "react-router-dom";
import RightWrapper from "../../../Components/CommonComponents/ComponentWrapper";
import axios from "axios";
import { END_POINT, getJwtToken } from "../../../Redux/AdminReducer/action";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomInput from "../../../Components/CommonComponents/CustomInput";
import CustomTextarea from "../../../Components/CommonComponents/CustomTextarea";
import { useSelector } from "react-redux";
import { DownloadFile } from "../../../UtilityHookFunctions/OtherMongoHelperFunctions";
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


const postItem = async (data, nav) => {
    try {
      toast.loading('updating...')
      const result = await axios.post(`${END_POINT}/bid/`, data);
      toast.dismiss()
      toast.success('bid added successfully')
      setTimeout(() => {
        nav(-1)
      }, 2000);
    } catch (error) {
      toast.dismiss()
      toast.error(error?.response?.data || "Something went wrong");
      console.log(error);
  
      toast.error("Something went wrong while fetching data");
    }
  };

  const updateItem = async (data, nav, bid_id) => {
    try {
    let {bidOn, bidder} = data||{}
      toast.loading('approving...')
      const result = await axios.patch(`${END_POINT}/alternative_therapy/approve_consultant/${bidOn}`, {consultant:bidder._id, bid:bid_id, duration:data?.duration, price:data?.bidPrice});
      toast.dismiss()
      toast.success('bid approved successfully')
      setTimeout(() => {
        nav(-1)
      }, 2000);
    } catch (error) {
      toast.dismiss()
      toast.error(error?.response?.data || "Something went wrong");
      console.log(error);
  
      toast.error("Something went wrong while fetching data");
    }
  };
  
const ReviewBid = () => {
  const { bid_id } = useParams();
  const [formData, setFormData] = useState(null);
  const nav = useNavigate();
  const userLoginData = useSelector((state) => state.AuthReducer.userLogindata?.data);

  
  useEffect(() => {
    fetchItems(`bid/fullBid/${bid_id}`).then((e) => {
      setFormData(e?.data);
    });
  }, [bid_id]);

  
  const handleInputChange = (e) => {
    let { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      
      <h3 className="text-black text-3xl font-semibold my-3">Review Bid</h3>
  
      <div className="BidReviewScreen grid grid-cols-5 bg-gray-200 p-4 border border-gray-400 border-5 gap-y-4">
        <p className="font-semibold text-xl text-black">Bid Date: </p>
        <span className="text-gray-800 col-span-4 font-regular text-xl">{formData?.bidDate}</span>
        <p className="font-semibold text-xl text-black">Bid Price: </p>
        <span className="text-gray-800 col-span-4 font-regular text-xl">{formData?.bidPrice}</span>
        <p className="font-semibold text-xl text-black">Bid On: </p>
        <span className="text-gray-800 col-span-4 font-regular text-xl">{formData?.bidOn}</span>
        <p className="font-semibold text-xl text-black">Bidder Name: </p>
        <span className="text-gray-800 col-span-4 font-regular text-xl">{formData?.bidder.name}</span>
        <p className="font-semibold text-xl text-black">Bidder Mail: </p>
        <span className="text-gray-800 col-span-4 font-regular text-xl">{formData?.bidder.email}</span>
        <p className="font-semibold text-xl text-black">Sample File: </p>
        <span className="text-gray-800 col-span-4 font-regular text-xl">{formData?.sample.name}
            <button 
            onClick={(e) => {DownloadFile('bid/download', formData?.sample.id, formData?.sample?.name)}}
             className="bg-yellow-500 px-3 text-black text-lg ms-3 border border-gray-400 rounded-xl">download</button>
        </span>
        <p className="font-semibold text-xl text-black">Duration: </p>
        <span className="text-gray-800 col-span-4 font-regular text-xl">{formData?.duration}</span>
        <p className="font-semibold text-xl text-black">Description: </p>
        <span className="text-gray-800 col-span-4 font-regular text-xl">
            <textarea rows={10} className="bg-white p-2 rounded-xl w-full" value={formData?.description}></textarea>
        </span>
        </div>

   {
    <div>
        {formData?.status !== 'win' ? ( <button onClick={e=>{
        updateItem(formData, nav, bid_id)
    }} className="px-8 py-3 mt-5 font-regular text-xl bg-indigo-800 text-white  rounded">Accept</button>):(
        <h3 className="font-bold text-3xl text-green-700 mt-3">Accepted</h3>
    )}
    </div>
   }

    </RightWrapper>

  );
};

export default ReviewBid;
