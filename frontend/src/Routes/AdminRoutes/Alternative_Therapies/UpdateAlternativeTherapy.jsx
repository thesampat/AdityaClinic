import { useNavigate, useParams } from "react-router-dom";
import RightWrapper from "../../../Components/CommonComponents/ComponentWrapper";
import axios from "axios";
import { END_POINT, getJwtToken } from "../../../Redux/AdminReducer/action";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomTextarea from "../../../Components/CommonComponents/CustomTextarea";
import { useSelector } from "react-redux";
import { useCheckRole } from "../../../UtilityHookFunctions/LoggedInUser";
import { GrDownload } from "react-icons/gr";
import { DownloadFile } from "../../../UtilityHookFunctions/OtherMongoHelperFunctions";

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

const postItem = async (data, nav, therapy_id) => {
  try {
    toast.loading("updating...");
    const result = await axios.post(`${END_POINT}/alternative_therapy/update_therapy/${therapy_id}`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    toast.dismiss();
    toast.success("therapy update successfully");
    setTimeout(() => {
      nav(-1);
    }, 2000);
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data || "Something went wrong");
    console.log(error);

    toast.error("Something went wrong while fetching data");
  }
};

const updateItem = async (data, nav, bidid) => {
  try {
    toast.loading("updating...");
    const result = await axios.patch(`${END_POINT}/bid/update/${bidid}`, data);
    toast.dismiss();
    toast.success("bid added successfully");
    setTimeout(() => {
      nav(-1);
    }, 2000);
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data || "Something went wrong");
    console.log(error);

    toast.error("Something went wrong while fetching data");
  }
};

const UpdateAlternativeTherapy = () => {
  const { therapy_id } = useParams();
  const [formData, setFormData] = useState(null);
  const nav = useNavigate();
  const checkrole = useCheckRole();
  const [accpet, isaccpet] = useState(false);

  useEffect(() => {
    fetchItems(`alternative_therapy/getForm/${therapy_id}`).then((e) => {
      setFormData(e?.data);
    });
  }, [therapy_id]);

  const handleInputChange = (e) => {
    let { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, accpet) => {
    e.preventDefault();
    const iformdata = new FormData(e.target);
    iformdata.set("comment", iformdata.get("livecomment"));
    if(accpet){
      iformdata.set("status", 'done');
    }
    await postItem(iformdata, nav, therapy_id);
  };

  console.log(formData, 'whta is form data')

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

      {<h3 className="text-black text-2xl font-semibold mt-3">{!checkrole("maindoctor") ? "Add Update" : "Review Update"}</h3>}

      <div>
        {(checkrole("maindoctor") && formData?.status === 'treating') && (
          <div className="flex items-center border border-3 p-2 bg-grey-50 rounded-lg">
            <button onClick={e=>isaccpet(!accpet)} type="submit" class={`${!accpet?"bg-yellow-400":"bg-green-500 text-white"} px-4 py-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-black bg-white text-gray-800 disabled:opacity-50 disabled:pointer-events-none`}>
            {!accpet?"Accept":"Accepted"}
          </button>
          </div>
        )}
      </div>

      <form onSubmit={e=>handleFileUpload(e, accpet)}>
        <div className="createBidCreate mt-5">
          {checkrole("consultant") && (
            <div className="fieldItem mt-3">
              <label for="small-file-input" class="sr-only">
                Select File
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
          )}

          {formData?.files?.length > 0 && (
            <div className="flex gap-3 align-center">
              <div className="text-black text-xl mt-2">Uploaded File : {formData?.files?.[0]?.name}</div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  DownloadFile("alternative_therapy/download", formData?.files?.[0]?.id, formData?.files?.[0]?.name);
                }}
                className="bg-yellow-400 px-3 py-0 rounded-lg text-black"
              >
                <GrDownload />
              </button>
            </div>
          )}

          {formData?.comment !== "" && (
            <div className="bg-gray-200 p-3 rounded-lg my-4">
              <p className="text-black text-lg font-semibold">{!checkrole("maindoctor") ? "Doctor" : "Consultant"}</p>
              <p className="text-black text-lg">{formData?.comment}</p>
            </div>
          )}
        {formData?.status === 'treating'  && <div className="fieldItem">
            <CustomTextarea onChange={handleInputChange} label="Add Comment" placeholder="Enter Comment!" value={formData?.description} name="livecomment" />
          </div>}
        </div>
       { formData?.status === 'treating' && <div className="flex items-center">
          <button type="submit" class="py-3 px-4 inline-flex items-center mt-3 gap-x-2 text-sm font-semibold rounded-lg border border-1 border-black bg-white text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none ">
            Submit
          </button>
        </div>}
      </form>
    </RightWrapper>
  );
};

export default UpdateAlternativeTherapy;
