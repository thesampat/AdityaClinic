import { useEffect, useState } from "react";
import CustomInput from "../../Components/CommonComponents/CustomInput";
import { END_POINT, getJwtToken } from "../../Redux/AdminReducer/action";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import CustomSpinner from "../../Components/CommonComponents/CustomSpinner";
import { DownloadFile } from "../../UtilityHookFunctions/OtherMongoHelperFunctions";

const fetchItems = async (id, date) => {
  try {
    const result = await axios.get(`${END_POINT}/customer/${id}/reports?date=${date}`, {
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

const PatientReports = () => {
  const [reportdate, setreportdate] = useState(new Date().toISOString().slice(0, 10));
  let [reportsData, setReportsData] = useState(null);
  const { patientId } = useParams();

  useEffect(() => {
    setReportsData(null);
    fetchItems(patientId, reportdate).then((e) => {
      setReportsData(e?.data);
    });
  }, [patientId, reportdate]);

  return (
    <div className="m-3 rounded-md bg-slate-100 h-fit min-h-[100vh] lg:px-24 w-full p-10">
      <h3 className="text-3xl">Patient's Reports</h3>
      <div className="w-40">
        <CustomInput onChange={(e) => setreportdate(e.target.value)} label="Select Date" placeholder="Enter Date of Birth" type="date" value={reportdate} name="date" />
      </div>
      <div className="listReports mt-10">
      <ul className="list-none border h-[70vh] overflow-y-auto bg-white p-3">
    {reportsData === null ? (<CustomSpinner/>):(
       reportsData?.map((report, index) => (
        <li key={index} className="px-10 rounded-lg grid grid-cols-10 gap-2 p-2 border-b border-gray-200 bg-slate-200 mb-3">
          <p className="text-lg font-bold col-span-5">{report?.filename}</p>
          <p className="text-gray-600 col-span-2">Upload Date: {new Date(report?.uploadDate).toLocaleDateString()}</p>
          <p className="text-lg font-bold col-span-1">{report?.typeOfDoc}</p>
          <button disabled={false} className="col-span-2 border p-2 py-1 rounded rounded-md bg-neutral-400">
            <p
              className="text-xs font-semibold text-white"
              onClick={(e) => {DownloadFile('prescription/download', report?._id, report?.originalname)}}
            >
              Download
            </p>
          </button>
        </li>
      ))
    )}
</ul>
      </div>
    </div>
  );
};

export default PatientReports;
