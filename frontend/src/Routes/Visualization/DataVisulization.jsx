import { useEffect, useRef, useState } from 'react';
import { getAllPatient, getAllPatientPrescription } from '../../Redux/AdminReducer/action';
import { useDispatch, useSelector } from 'react-redux';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import BarChart from './BarChart';
import { getCategoryCounts, getAllAgeGroups, getDiagnosis, getTop10HighestPaidCustomers } from './chartsFunctions';
import CustomSpinner from '../../Components/CommonComponents/CustomSpinner';
import ThreeDotsLoading from './visulizeLoading';
import PieChart from './PieChart';

const VisualizeBoard = () => {
  const dispatch = useDispatch();
  const { getAllPatientData, getAllPrescriptionData } = useSelector((state) => state.AdminReducer);

  useEffect(() => {
    dispatch(getAllPatient({ search: '' }));
    dispatch(getAllPatientPrescription({ search: '', page: 1, pageSize: 100, patient: '', doctor: '' }));
  }, []);

  Chart.register(CategoryScale);

  return (
    <div className="px-2 pt-20 min-h-[100vh] h-fit py-8 w-full">
      <div className="MainCharts text-center">
        {/* <h1 className="text-3xl font-bold">Charts</h1> */}
        <div className="ChartsScreen p-2 grid grid-cols-2  justify-center bg-white h-screen rounded-md gap-2 overflow-scroll">
          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="bloodGroup" patientData={getAllPatientData} title="Blood Group Distribution" graphfun={getCategoryCounts} />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="gender" patientData={getAllPatientData} title="Gender Distribution" />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="dateOfBirth" patientData={getAllPatientData} title="Age Group Distribution" graphfun={getAllAgeGroups} />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <PieChart field="gender" patientData={getAllPatientData} title="Martial Status Distribution" />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="motherTongue" patientData={getAllPatientData} title="Mother Tongue Distribution" />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <PieChart field="education" patientData={getAllPatientData} title="Education Of Patient" />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="location" patientData={getAllPatientData} title="Patient By Address" />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="state" patientData={getAllPatientData} title="Resident State Distribution" />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="patient_reference" patientData={getAllPatientData} title="Refrence Of Patient" />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="profession" patientData={getAllPatientData} title="Profession Distribution" />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="industry" patientData={getAllPatientData} title="Industry Distribution" />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <PieChart field="status" patientData={getAllPatientData} title="Status Enquiry Distribution" />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="patientStatus" patientData={getAllPatientData} title="Patient Status Distribution" />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="package" patientData={getAllPatientData} title="Package Distribution" />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="weight" patientData={getAllPatientData} title="Patient Weight" />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          {/* Diagnosis Charts */}

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="primary" patientData={getAllPatientData} title="Primary Diagnosis" graphfun={getDiagnosis} />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="secondary" patientData={getAllPatientData} title="Secondary Diagnosis" graphfun={getDiagnosis} />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="third" patientData={getAllPatientData} title="Tertiary Diagnosis" graphfun={getDiagnosis} />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          {/* Sub Diagnosis */}

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="primarySub" patientData={getAllPatientData} title="Primary Sub Diagnosis" graphfun={getDiagnosis} />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="secondarySub" patientData={getAllPatientData} title="Secondary Sub Diagnosis" graphfun={getDiagnosis} />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPatientData !== null ? (
              <BarChart field="thirdSub" patientData={getAllPatientData} title="Tertiary Sub Diagnosis" graphfun={getDiagnosis} />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPrescriptionData !== null ? (
              <BarChart field="PaymentMode" patientData={getAllPrescriptionData} title="Payment Mode" graphfun={getCategoryCounts} />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          {/* getTop10HighestPaidCustomers(getAllPrescriptionData); */}

          <div className="border border-black">
            {getAllPrescriptionData !== null ? (
              <BarChart field="PaymentMode" patientData={getAllPrescriptionData} title="Total Highest Paid Patients" graphfun={getTop10HighestPaidCustomers} />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>

          <div className="border border-black">
            {getAllPrescriptionData !== null ? (
              <BarChart field="doctor" patientData={getAllPrescriptionData} title="Patient With Doctor" graphfun={getCategoryCounts} />
            ) : (
              <div className="customSpinner h-[50vh] d-flex">
                <ThreeDotsLoading />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizeBoard;
