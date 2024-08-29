import { useNavigate, useParams } from "react-router-dom";
import RightWrapper from "../../../Components/CommonComponents/ComponentWrapper";
import axios from "axios";
import { END_POINT, getJwtToken } from "../../../Redux/AdminReducer/action";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomInput from "../../../Components/CommonComponents/CustomInput";
import CustomTextarea from "../../../Components/CommonComponents/CustomTextarea";
import { useSelector } from "react-redux";
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


  const updateItem = async (data, nav, bidid) => {
    try {
      toast.loading('updating...')
      const result = await axios.patch(`${END_POINT}/bid/update/${bidid}`, data);
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
  
const AddBids = () => {
  const { bid_id } = useParams();
  const [formData, setFormData] = useState(null);
  const nav = useNavigate();
  const userLoginData = useSelector((state) => state.AuthReducer.userLogindata?.data);

  useEffect(() => {
    fetchItems(`bid/auction/${bid_id}/${userLoginData?._id}`).then((e) => {
      setFormData(e?.data);
    });
  }, [bid_id]);

  const handleInputChange = (e) => {
    let { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    e.preventDefault()
    const iformdata = new FormData(e.target)
    iformdata.set('bidder', userLoginData?._id)
    iformdata.set('subsection', formData?.therapy)
    iformdata.set('bidDate', new Date().toISOString().slice(0,10))
    iformdata.set('bidOn', bid_id)
    if(formData?._id===undefined){
      await postItem(iformdata, nav)
    }
    else{

      if(iformdata?.get('file').name == formData?.sample?.name)
      if(iformdata?.get('file').name == formData?.sample.name){
        iformdata.delete('file')
      }
      await updateItem(iformdata, nav, formData?._id)
    }
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
      
      {formData?._id == undefined ?<h3 className="text-black text-2xl font-semibold mt-3">Create Your Bid</h3>
      :<h3 className="text-black text-2xl font-semibold mt-3">Update Your Bid</h3>}

      <form onSubmit={handleFileUpload}>
        <div className="createBidCreate border">
          <div className="fieldItem grid grid-cols-2 gap-x-20">
            <CustomInput onChange={handleInputChange} label="Enter Duration (Days)" placeholder="Enter Duration!" value={formData?.duration} type="number" name="duration" />
            <CustomInput onChange={handleInputChange} label="Enter Price" placeholder="Enter Price!" value={formData?.bidPrice} type="number" name="bidPrice" />
          </div>
          <div className="fieldItem">
            <CustomTextarea onChange={handleInputChange} label="Description" placeholder="Enter Description!" value={formData?.description} type="number" name="description" />
          </div>
          <div className="fieldItem mt-3">
            {formData?._id!==undefined &&
            <div className="text-black text-lg">Uploaded File : {formData?.sample?.name}</div> 
            }
            <label for="small-file-input" class="sr-only">
              Choose file
            </label>
            <input
              type="file"
              name="file"
              id="small-file-input"
              class="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-blue-50 dark:border-neutral-700 dark:text-neutral-400
              file:bg-gray-50 file:border-0
              file:me-4
              file:py-2 file:px-4
              dark:file:bg-blue-200 dark:file:text-black"
              />
          </div>
        </div>
        <button type="submit" class="py-3 px-4 inline-flex items-center mt-3 gap-x-2 text-sm font-semibold rounded-lg border border-2 border-black bg-white text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none ">
            Submit
          </button>
      </form>
    </RightWrapper>
  );
};

export default AddBids;
