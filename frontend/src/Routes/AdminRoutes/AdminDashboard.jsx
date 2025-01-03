import React, { useEffect, useState } from "react";
import NavigationButtons from "../../Components/adminDashboard/NavigationButtons";
import { getAllFilteredAppointments, setClinicProfile } from "../../Redux/AdminReducer/action";
import { useDispatch, useSelector } from "react-redux";
import CustomSpinner from "../../Components/CommonComponents/CustomSpinner";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ToastContainer } from "react-toastify";
import { appointmentStatus, EnquiresData, feesCollected, patientStatus, typesOfCases } from "../../Files/dashboard";

export default function AdminDashboard() {
  let [onlineAp, setOnlineAp] = useState(null);
  let [offlineAp, setOffline] = useState(null);
  let [consultantAp, setConsultantAp] = useState(null);
  const dispatch = useDispatch();
  const clinicProfile = useSelector((state) => state?.AdminReducer.clinicProfile);

  const { getAllAppointmentData, onineAppointments, offlineAppointments, consultantAppointments } = useSelector((state) => state.AdminReducer);
  const table1Headers = ["Time", "Name", "Date"];

  const GetDataFormat = (idata) => {
    const transformedData = idata?.map((a) => [`${a?.bookTimeSlot?.startTime}-${a?.bookTimeSlot?.endTime}`, a?.patient?.name, a?.bookDate, a?.patient?.id]);
    return transformedData;
  };

  useEffect(() => {
    dispatch(setClinicProfile());
    dispatch(getAllFilteredAppointments({ IsOnline: true }, { pageSize: 30 }));
  }, []);

  useEffect(() => {
    dispatch(getAllFilteredAppointments({ IsOnline: false }, { pageSize: 30 }));
  }, []);
  useEffect(() => {
    dispatch(getAllFilteredAppointments({ IsConsultant: true }, { pageSize: 30 }));
  }, []);

  useEffect(() => {
    let formatedData = GetDataFormat(onineAppointments);
    setOnlineAp(formatedData);
  }, [onineAppointments]);

  useEffect(() => {
    let formatedData = GetDataFormat(offlineAppointments);
    setOffline(formatedData);
  }, [offlineAppointments]);

  useEffect(() => {
    if (consultantAppointments) {
      let res = GetDataFormat(consultantAppointments);
      setConsultantAp(res);
    }
  }, [consultantAppointments]);

  return (
    <div className="m-3 rounded-md bg-slate-100 px-8 min-h-[100vh] h-fit py-8 w-full">
      <div className="flex gap-2">
        <img className="w-10 h-10" src={`data:image/jpeg;base64,${clinicProfile?.imageData}`} alt="" srcset="" />

        <div className="font-bold text-2xl text-black">
          {" "}
          {(() => {
            let name = "LocalClinic";
            if (window.location.hostname === "shivenclinic.com") {
              name = "Shiven Clinic Management";
            } else {
              name = clinicProfile?.data?.ClinicName;
            }
            return name;
          })()}
        </div>
      </div>
      <div className="flex flex-wrap justify-between items-baseline mb-4 mt-1">
        <div></div>
        <NavigationButtons />
      </div>

      <div className="DataTables grid grid-cols-3 text-center gap-5 mt-5">
        <GenerateTable headers={table1Headers} data={offlineAp} title="Offline Appointments" />
        <GenerateTable headers={table1Headers} data={onlineAp} title="Online Appointments" />
        <GenerateTable headers={table1Headers} data={consultantAp} title="Consultant Appointments" />
      </div>
      <div className="DataTables grid grid-cols-2 text-center gap-5 mt-5">
        <GenerateTableType2 headers={["name", "mobile", "refrence", "purpose", "statuofenquiry"]} data={EnquiresData} title="Enquires" />
        <GenerateTableType2 headers={["period", "Cured", "Lapsed", "Left in Between", "Active Treatment", "Improving"]} data={patientStatus} title="Patient Status" />
        <GenerateTableType2 headers={["period", "Cured", "Lapsed", "Left in Between", "Active Treatment", "Improving"]} data={typesOfCases} title="Types Of Cases" />
        <GenerateTableType2 headers={['period', 'Online', 'Offline', 'Consultant', 'Nutrition']} data={appointmentStatus} title="Appointment Status" />
      </div>
      <div className="DataTables grid grid-cols-1 text-center gap-5 mt-5">
      <GenerateTableType2 headers={["period", "Online Consultation", "Clinic Consultation", "Consultation Consultation", "Additional Medicine", "Reference", "Packages", "Total"]} data={feesCollected} title="Fees Collected" />

      </div>

      {/* latest user table */}
      {/* <LatestUsers /> */}
    </div>
  );
}

const GenerateTable = ({ headers, data, title }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg pb-5">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      </div>
      <div className="h-[40vh] overflow-y-auto">
        {data ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {headers?.map((header, index) => (
                  <th key={index} className="py-2 text-black px-4 border-b border-gray-200 text-center font-bold text-xs uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.length > 0 ? (
                data?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row?.slice(0, 3).map((cell, cellIndex) => (
                      <td key={cellIndex} className={`py-2 px-4 border-b border-gray-200 text-sm ${!row[3] ? "bg-yellow-100" : "bg-gray-50"}`}>
                        {<button onClick={(e) => row?.[3] && navigate(`/prescription/add/${row?.[3]}`)}>{cellIndex === 2 ? format(new Date(row[cellIndex]), "dd/MM/yyyy") : row[cellIndex]}</button>}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 text-center align-middle h-[30vh]">
                    <h3 className="text-gray-500 text-lg">No Data</h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <CustomSpinner height={20} />
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

const GenerateTableType2 = ({ headers, data, title }) => {
  console.log(headers, data, title);
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg pb-5">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      </div>
      <div className="h-[40vh] overflow-y-auto">
        {data ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {headers?.map((header, index) => (
                  <th key={index} className="py-2 text-black px-4 border-b border-gray-200 text-center font-bold text-xs uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.length > 0 ? (
                data?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {headers?.map((ui, ikey) => (
                      <td key={ikey} className={`py-2 px-4 border-b border-gray-200 text-sm 'bg-gray-50'`}>
                        {row?.[ui]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 text-center align-middle h-[30vh]">
                    <h3 className="text-gray-500 text-lg">No Data</h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <CustomSpinner height={20} />
        )}
      </div>
      <ToastContainer />
    </div>
  );
};
