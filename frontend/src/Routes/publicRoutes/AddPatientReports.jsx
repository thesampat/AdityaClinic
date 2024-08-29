import axios from "axios";
import ModalCustom from "../../Components/CommonComponents/ModalCustomPopup";
import { END_POINT } from "../../Redux/AdminReducer/action";
import { useState } from "react";
import { toast } from "react-toastify";

const verifyphone = async (phone) => {
  try {
    const result = await axios.post(`${END_POINT}/customer/000/verifyPhone`, { phone: phone });
    return result?.data;
  } catch (error) {
    // toast.error(error?.response?.data || "Something went wrong");
    console.log(error);
    toast.error("Something went wrong while fetching data");
  }
};

const UploadFiles = async (data, customerId) => {
  const formData = new FormData();

  data?.forEach((ifile) => {
      formData.append('file', ifile)
  })
  try {
      toast.loading('uploading....')
      const result = await axios.post(`${END_POINT}/customer/externalUploads/${customerId}`, data);
      toast.dismiss()
      toast.success('files uploaded....')
      return true
  } catch (error) {
      toast.error(error?.response?.data || 'Something went wrong');
      toast.dismiss()
      toast.error('Image Upload Failed')
      console.log('Check Error', error)

  }
}

const UploadPatientReports = () => {
  const [iphone, setiphone] = useState();
  const [patientData, setPatientData] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([]);

  const verifyCal = async () => {
    let iv = await verifyphone(iphone);
    let {data} = iv||{}
    if(data==false){
      toast.error('No Patient Found With This Number')
    }
    else{
      setPatientData(data)
    }
  };

  const handleFileChange = (e) => {
    Array.from(e.target.files).forEach((image_file) => {
      setSelectedFiles((prev) => [...prev, image_file]);
    });
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((file, i) => i !== index));
  };

  const handleUploadFiles = async () => {
    await UploadFiles(selectedFiles, patientData?._id)
  };

  return (
    <div className="h-fit min-h-[100vh] w-full bg-white p-10">
      <h1 className="text-4xl my-5 bg-p">Upload Reports</h1>
      <div>
      {
      patientData !== null  ?(
        <div>
          <div className="w-full h-10 bg-gray-200 mb-3 flex items-center gap-5 px-10">
            <div className="text-black text-lg">{patientData?.firstName} - {patientData?.surname}</div>
      </div>
          <div className="uploadSection">
      <div className="flex flex-col gap-2">
        <input id="file-input" type="file" onChange={handleFileChange} multiple={true} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 truncate" />
      </div>

      <div className="files-selected flex flex-col gap-2 mt-10 bg-slate-200 p-5 h-[60vh] overflow-y-auto">
        {selectedFiles?.map((f, index) => (
          <div className="flex justify-between items-center py-2 px-4 border-b border-gray-200 bg-white rounded-lg" key={index}>
            <div className="text-gray-700 text-lg">{f?.name}</div>
            <button onClick={() => handleRemoveFile(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
              X
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleUploadFiles} className="mx-auto mt-2 bg-blue-500 text-xl hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
        Submit
      </button>
      </div>
        </div>
        )
        :
      (<div className="mx-auto bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-3 p-3 max-w-[500px]">
        <h1 className="text-2xl my-5 bg-p">Files Selected : {selectedFiles?.length}</h1>
          <label className="block text-gray-700 text-lg font-bold mb-2" for="report-number">
            Enter Phone Number
          </label>
          <input onChange={e=>setiphone(e.target.value)} value={iphone} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="report-number" type="text" placeholder="Enter report number" />
          <button onClick={verifyCal} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded" type="submit">
            Submit
          </button>
        </div>)
        }
        </div>
    </div>
  );
};

export default UploadPatientReports;
