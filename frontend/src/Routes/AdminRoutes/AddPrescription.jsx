import { useEffect, useRef, useState } from 'react';
import CustomBreadcrumbs from '../../Components/CommonComponents/CustomBreadcrumbs';
import CustomTextarea from '../../Components/CommonComponents/CustomTextarea';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { UploadFile, addNewPrescription, getAllPatientPrescription, getSinglePatient, END_POINT, RemoveFile, getSinglePatientFetch, UploadImages, DeleteImages, getJwtToken } from '../../Redux/AdminReducer/action';
import CustomSpinner from '../../Components/CommonComponents/CustomSpinner';
import PaginationButtons from '../../Components/CommonComponents/PaginationButtons';
import { useFetcher, useNavigate, useParams } from 'react-router-dom';
import { FileUploadModal, ImageShowModal, ImageUploadModal } from '../../Components/CommonComponents/PrescriptionUploadModal';
import CustomSelect from '../../Components/CommonComponents/CustomSelect';
import CustomInput from '../../Components/CommonComponents/CustomInput';
import format from 'date-fns/format';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { statusOptions } from '../../Files/dropdownOptions';
import axios from 'axios';

const deletePrescription = async (data) => {
  try {
    const result = await axios.delete(`${END_POINT}/prescription/delete/${data}`, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    toast.dismiss();
    toast.success('record deleted Successfully');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    toast.dismiss();
    toast.error('could not delete');
  }
};

const initialFormData = {
  Date: '',
  Symptoms: '',
  MedicinePrescription: { 0: { name: '', duration: '' } },
  SupplimentoryMedicine: { 0: { name: '', duration: '', fees: '' } },
  ReportsPrescription: '',
  Suggestions: '',
  ProbableTreatment: '',
  Other: '',
  doctorId: '',
  PreviousReportNotes: '',
  PreviousTreatmentNotes: '',
  PreviousPicturesNotes: '',
  PaymentDetails: {},
  PaymentMode: '',
  ReceivedBy: '',
  total: '',
  paid: '',
  CaseRating: '',
  CaseMark: '',
  ReviewMark: '',
  Patient_Type: '',
};

const AddPrescription = () => {
  const [visibleDate, setVisibleDate] = useState(new Date().toISOString().slice(0, 10));
  const [formData, setFormData] = useState(null);
  const updateFormRef = useRef([]);
  let { patientId } = useParams();
  const { userLogindata } = useSelector((state) => state.AuthReducer);

  const [formError, setFormError] = useState({ ...initialFormData, ReceivedBy: userLogindata?.data?.name });
  const formDataRef = useRef([{ ...formData }]);
  const [paginate, setpaginate] = useState({ page: 1, pageSize: 10 });
  let { singlePatientData, updatePrescriptionProcessing, updatePrescriptionSuccess, updatePrescriptionFail, updatePrescriptionMessage, getAllPrescriptionData } = useSelector((state) => state.AdminReducer);
  const scrollContainerRef = useRef(null);
  const [patientUpdate, setPatientUpdate] = useState(null);
  const patientUpdateRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updatePatient = async () => {
    try {
      const result = await axios.put(`${END_POINT}/customer/updateProfile/${patientId}`, patientUpdateRef.current, {
        headers: {
          Authorization: getJwtToken(),
        },
      });
      toast.success('Saved!!');

      // successfully added
    } catch (error) {
      toast.error(error?.response?.data || 'Something went wrong');
      // fail to add Patient
      toast.error('Failed to update');
    }
  };

  const handleCtrlS = (event) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      if (updateFormRef.current?.length > 0 || patientUpdateRef.current !== null) {
        updateFormRef.current?.length > 0 && dispatch(addNewPrescription(updateFormRef.current));
        patientUpdateRef.current !== null && updatePatient();
      } else if (updateFormRef.current?.length <= 0 && patientUpdateRef.current == null) {
        toast.error('No changes to save', { position: toast.POSITION.TOP_RIGHT });
      }
    }
  };

  useEffect(() => {
    return () => {
      setFormData(null);
      dispatch({ type: 'GET_ALL_PATIENT_PRESCRIPTION_DATA', payload: null });
      dispatch({ type: 'GET_SINGLE_PATIENT_SUCCESS', payload: null });
    };
  }, []);

  useEffect(() => {
    let query = { patient: patientId, doctor: userLogindata?.data?._id, ...paginate };
    dispatch(getAllPatientPrescription(query));
  }, [visibleDate, userLogindata, paginate]);

  useEffect(() => {
    if (getAllPrescriptionData?.length > 0) {
      setFormData(getAllPrescriptionData);
    }
  }, [getAllPrescriptionData]);

  useEffect(() => {
    dispatch(getSinglePatientFetch(patientId));
    document.addEventListener('keydown', handleCtrlS);
    return () => {
      document.removeEventListener('keydown', handleCtrlS);
    };
  }, []);

  useEffect(() => {
    const { CaseRating, CaseMark, ReviewMark } = singlePatientData || {};
    setPatientUpdate({ CaseRating: CaseRating, CaseMark: CaseMark, ReviewMark: ReviewMark });
  }, [singlePatientData]);

  useEffect(() => {
    formDataRef.current[0] = formData;
  }, [formData]);

  const handleTableChange = (e, ivalue, duration = null) => {
    const { id: ukey, name } = e.target || {};

    const updatedForm = updateFormRef.current;
    const itemId = formData.find((item) => item.Date === e.target.id);

    setFormData((prev) => prev?.map((item) => (item?.Date === e.target.id ? { ...item, [name]: ivalue } : item)));

    if (itemId?._id) {
      console.log('Update');
      let updatedFormCopy = updatedForm?.length == 0 && updatedForm.push({ Date: itemId?.Date, [name]: ivalue, _id: itemId?._id, customerId: singlePatientData?._id, paitendId: singlePatientData?.customerId, doctorId: userLogindata?.data?._id });
      updatedFormCopy = updatedForm.map((item) => item.Date === ukey && { ...item, [name]: ivalue, _id: itemId?._id });
      updateFormRef.current = updatedFormCopy;
    } else {
      let NewFormCopy = updatedForm?.length == 0 && updatedForm.push({ Date: itemId?.Date, [name]: ivalue, customerId: singlePatientData?._id, paitendId: singlePatientData?.customerId, doctorId: userLogindata?.data?._id });
      NewFormCopy = updatedForm.map((item) => item.Date === ukey && { ...item, [name]: ivalue });
      updateFormRef.current = NewFormCopy;
    }
  };

  const handelInputChange = (event) => {
    const { name, value, id: ukey } = event?.target;

    setFormData((prev) => prev?.map((item) => (item?.Date === ukey ? { ...item, [name]: value } : item)));

    const updatedForm = updateFormRef.current;
    const itemId = formData.find((item) => item.Date === ukey);

    if (itemId?._id) {
      let updatedFormCopy = updatedForm?.length == 0 && updatedForm.push({ Date: itemId?.Date, [name]: value, _id: itemId?._id, customerId: singlePatientData?._id, paitendId: singlePatientData?.customerId, doctorId: userLogindata?.data?._id });
      updatedFormCopy = updatedForm.map((item) => (item.Date === ukey ? { ...item, [name]: value, _id: itemId?._id } : { Date: itemId?.Date, [name]: value, _id: itemId?._id }));
      updateFormRef.current = updatedFormCopy;
    } else {
      let NewFormCopy = updatedForm?.length == 0 && updatedForm.push({ Date: itemId?.Date, [name]: value, customerId: singlePatientData?._id, paitendId: singlePatientData?.customerId, doctorId: userLogindata?.data?._id });
      NewFormCopy = updatedForm.map((item) => item.Date === ukey && { ...item, [name]: value });
      updateFormRef.current = NewFormCopy;
    }
  };

  const handelPriceTable = (event) => {
    let { name, value, id: ukey } = event.target;

    // Update the updateForm state
    const updatedForm = updateFormRef.current;
    const itemId = formData.find((item) => item.Date === ukey);

    // Update the formData state
    setFormData((prev) => prev?.map((item) => (item?.Date === ukey ? { ...item, PaymentDetails: { ...item?.PaymentDetails, [name]: value } } : item)));

    if (itemId?._id) {
      let updatedFormCopy = updatedForm?.length == 0 && updatedForm.push({ Date: itemId?.Date, PaymentDetails: { ...itemId?.PaymentDetails, [name]: value }, _id: itemId?._id, customerId: singlePatientData?._id, paitendId: singlePatientData?.customerId, doctorId: userLogindata?.data?._id });
      updatedFormCopy = updatedForm.map((item) => item.Date === ukey && { ...item, PaymentDetails: { ...itemId?.PaymentDetails, [name]: value }, _id: itemId?._id });
      updateFormRef.current = updatedFormCopy;
    } else {
      let NewFormCopy = updatedForm?.length == 0 && updatedForm.push({ Date: itemId?.Date, PaymentDetails: { [name]: value }, customerId: singlePatientData?._id, paitendId: singlePatientData?.customerId, doctorId: userLogindata?.data?._id });
      NewFormCopy = updatedForm.map((item) => item.Date === ukey && { ...item, PaymentDetails: { [name]: value } });
      updateFormRef.current = NewFormCopy;
    }

    const totalRef = updateFormRef.current.find((item) => item.Date === ukey);

    const sum = Object.values(totalRef?.PaymentDetails).reduce((acc, strNumber) => {
      acc += Number(strNumber) || 0;
      return acc;
    }, 0);

    setFormData((prev) => prev?.map((item) => (item?.Date === ukey ? { ...item, total: sum } : item)));

    const totalUpdateCopy = updateFormRef.current.map((item) => (item.Date === ukey ? { ...item, _id: itemId?._id, total: sum } : item));
    updateFormRef.current = totalUpdateCopy;
  };

  useEffect(() => {
    if (updatePrescriptionSuccess && !updatePrescriptionProcessing) {
      toast.success(updatePrescriptionMessage, { position: toast.POSITION.TOP_RIGHT });

      //  reset states
      // window.location.reload();
      setFormError([initialFormData]);
    }
    if (updatePrescriptionFail && !updatePrescriptionProcessing) {
      toast.error(updatePrescriptionMessage, { position: toast.POSITION.TOP_RIGHT });
    }
  }, [updatePrescriptionProcessing]);

  return (
    <div className="m-3 rounded-md bg-gray-100 h-fit lg:px-6 w-full p-5 bg-white">
      <button
        onClick={(e) => {
          navigate(-1);
        }}
        className="bg-blue-800 rounded-lg font-semibold text-white p-2 px-3"
      >
        Back
      </button>

      <div className="headingTitle flex justify-between">
        <button
          onClick={() => {
            dispatch(getSinglePatient(singlePatientData));
            navigate(`/Patients/${singlePatientData?._id}`);
          }}
        >
          <h3 className="font-bold text-md">
            {singlePatientData?.firstName} {singlePatientData?.surname} – {singlePatientData?.customerId}
          </h3>
        </button>

        <div className="flex align-center gap-4">
          <button
            className="p-2 font-semibold bg-yellow-500 rounded-lg"
            onClick={(e) => {
              e.preventDefault();

              if (formData == null) {
                setFormData([{ ...initialFormData, customerId: singlePatientData?._id, paitendId: singlePatientData?.customerId, doctorId: userLogindata?.data?._id, Date: visibleDate, ReceivedBy: userLogindata?.data?.name }]);
              } else {
                if (formData?.filter((e) => e.Date === visibleDate)?.length === 0) {
                  setFormData((prev) => [{ ...initialFormData, customerId: singlePatientData?._id, paitendId: singlePatientData?.customerId, doctorId: userLogindata?.data?._id, Date: visibleDate, ReceivedBy: userLogindata?.data?.name }, ...prev]);
                }
              }
            }}
          >
            Add New
          </button>

          <div>
            <input
              onChange={(e) => {
                setVisibleDate(e.target.value);
              }}
              type="date"
              name=""
              id=""
            />
          </div>
        </div>
      </div>

      <div className="mainpaddLayout">
        <div className="form_controls mt-2 h-[120vh] overflow-y-scroll" ref={scrollContainerRef} style={{ overflowY: 'scroll', height: '100vh' }}>
          {formData === null ? (
            getAllPrescriptionData?.length !== 0 ? (
              <div className="text-center pt-[30vh]">
                <CustomSpinner />
              </div>
            ) : (
              <h1 className="text-2xl font-bold">No Records Available</h1>
            )
          ) : (
            formData
              .sort((a, b) => new Date(b.Date) - new Date(a.Date))
              ?.map((singlePrescriptionForm) => (
                <div>
                  <h2 className="text-black text-lg font-bold py-2 ps-5">Date: {format(new Date(singlePrescriptionForm?.Date), 'dd/MM/yyyy')}</h2>
                  <PrescriptionForm disabled={false} handelPriceTable={handelPriceTable} formData={singlePrescriptionForm} setFormData={setFormData} handelInputChange={handelInputChange} prescriptionScrollDate={singlePrescriptionForm?.Date} handleTableChange={handleTableChange} />
                </div>
                // format(new Date(singlePrescriptionForm?.Date), 'dd/MM/yyyy') !== format(new Date(visibleDate), 'dd/MM/yyyy') ? true : false
              ))
          )}
        </div>
      </div>

      <ToastContainer />
      <PaginationButtons
        onPreviousClick={() => {
          scrollContainerRef.current.scrollTop = 0;
          setpaginate({ ...paginate, page: paginate.page - 1 });
        }}
        onNextClick={() => {
          scrollContainerRef.current.scrollTop = 0;
          setpaginate({ ...paginate, page: paginate.page + 1 });
        }}
        isPreviousDisabled={paginate.page === 1}
        isNextDisabled={getAllPrescriptionData?.length < paginate.limit}
      />
    </div>
  );
};

const PrescriptionForm = ({ disabled, handelPriceTable, formData, setFormData, handelInputChange, handleTableChange }) => {
  const navigate = useNavigate();

  const { userLogindata } = useSelector((state) => state.AuthReducer);

  return (
    <div className="prescriptionFormLayout flex items-center h-[180vh]" id={formData?.Date} autoFocus={true} name={formData?.Date}>
      <div className="leftFromSection h-[180vh] px-3 bg-slate-50 py-4" style={{ minWidth: '20vw' }}>
        <div className="border secondpartLeft p-2 rounded-lg">
          <CustomTextarea disabled={disabled} id={formData?.Date} label="Suggestions" placeholder="Enter Suggestions" onChange={handelInputChange} value={formData?.Suggestions} name="Suggestions" error={''} />
          <CustomTextarea disabled={disabled} id={formData?.Date} label="Reports Prescription" placeholder="Enter Report Prescription" onChange={handelInputChange} value={formData?.ReportsPrescription} name="ReportsPrescription" error={''} />
          <CustomTextarea disabled={disabled} id={formData?.Date} label="Probable Treatment" placeholder="Enter Probable Treatment" onChange={handelInputChange} value={formData?.ProbableTreatment} name="ProbableTreatment" error={''} />
          <CustomTextarea disabled={disabled} id={formData?.Date} label="Other" placeholder="Other" onChange={handelInputChange} value={formData?.Other} name="Other" error={''} />
        </div>
        <button className="bg-blue-500 p-2 rounded-md mt-3" onClick={(e) => navigate('/appointment')}>
          Schedule Next Appointment
        </button>
        <div className="PriceTableDiv mt-4">
          <PriceTable disabled={disabled} handelPriceTable={handelPriceTable} setFormData={setFormData} formData={formData} handleTableChange={handleTableChange} />
        </div>
        <div className="PayUp mt-4">
          <div className="inputWork">
            <div className="mt-5">
              <label className="text-sm font-medium text-primary-900 mb-1">Mode Of Payment</label>
              <select disabled={disabled} id={formData?.Date} value={formData?.PaymentMode} name="PaymentMode" onChange={handelInputChange} className="w-full border border-primary-300 text-primary-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5">
                <option value="" disabled>
                  Select Mode Of Payment
                </option>
                {['UPI', 'CASH'].map((item, index) => (
                  <option key={index} value={item} className="text-primary-400">
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <CustomInput disabled={disabled} id={formData?.Date} onChange={handelInputChange} label="Received By" placeholder="Enter Name" type="text" value={formData.ReceivedBy} name="ReceivedBy" />
            <CustomInput disabled={disabled} id={formData?.Date} onChange={handelInputChange} label="Amount Received" placeholder="Enter Amount" type="number" value={formData.paid} name="paid" />
          </div>
        </div>
      </div>
      <hr className="h-[150vh] bg-gray-500" style={{ width: '3px' }} />
      <div className="centerFromSection h-full w-full px-5 flex flex-col gap-10 py-4 bg-slate-50">
        <div className="p-2 border rounded-lg h-full">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-primary-900 mb-1">Patient History</label>
            <textarea disabled={disabled} id={formData?.Date} className="w-full border border-primary-300 text-primary-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 resize-vertical h-[170vh]" label="Symptoms" placeholder="Enter Patient History" onChange={handelInputChange} value={formData?.Symptoms} name="Symptoms" />
          </div>
        </div>
      </div>
      <hr className="h-[150vh] bg-gray-500" style={{ width: '3px' }} />
      <div className="rightFromSection h-[180vh] px-5 py-4 flex flex-col gap-5 bg-slate-50" style={{ maxWidth: '400px', minWidth: '350px' }}>
        <div className="PreviousReports border p-2 rounded rounded-lg">
          <ChildrenComponent disabled={disabled} id={formData?.Date} label="PREVIOUS REPORTS" handelInputChange={handelInputChange} formData={formData} uploadType="previousReports" SectionType="PreviousReportNotes" />
        </div>
        <div className="PreviousTreatment border p-2 rounded rounded-lg">
          <ChildrenComponent disabled={disabled} id={formData?.Date} label="PREVIOUS TREATMENT" handelInputChange={handelInputChange} formData={formData} uploadType="previousTreatment" SectionType="PreviousTreatmentNotes" />
        </div>
        <div className="PreviousPictures border p-2 rounded rounded-lg">
          <ChildrenComponent disabled={disabled} id={formData?.Date} label="PREVIOUS PICTURES" handelInputChange={handelInputChange} formData={formData} uploadType="pictures" SectionType="PreviousPicturesNotes" />
        </div>
        <div>
          <h4 className="font-semibold">Medicine Prescription</h4>
          <div className="h-[15vh] overflow-y-scroll">
            <MedicinePrescriptionTable disabled={disabled} MedicinePrescription={formData?.MedicinePrescription} setFormData={setFormData} formData={formData} handleTableChange={handleTableChange} />
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Supplimentory Medicine</h4>
          <div className="h-[15vh] overflow-y-scroll">
            <SupplimentoryMedicineTable disabled={disabled} SupplimentoryMedicine={formData?.SupplimentoryMedicine} setFormData={setFormData} formData={formData} handleTableChange={handleTableChange} />
          </div>
        </div>
        {userLogindata?.data.role === 'MainDoctor' && (
          <div className="pt-5">
            <button
              onClick={(e) => {
                window.alert('are you sure want to delete?');
                toast.loading('deleting...');
                deletePrescription(formData?._id);
              }}
              className="p-2 bg-red-500 rounded-lg font-semibold text-white"
            >
              Delete Record
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

const ChildrenComponent = ({ disabled, id, label, handelInputChange, formData, uploadType, SectionType }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [showImage, setShowImages] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleImageCloseModal = () => {
    setShowImages(false);
  };

  const handleFileUpload = (file) => {
    if (file) {
      dispatch(UploadFile(file, formData?._id, uploadType, 'prescription'));
      setIsModalOpen(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (file) {
      let res = await dispatch(UploadImages(file, formData?._id, uploadType, 'prescription'));
      if (res === true) {
        toast.success('Images Uploaded, Please refresh once');
      }
      setIsModalOpen(false);
    }
  };

  return (
    <div className="ChildernMain flex flex-col gap-2">
      <h4 className="font-semibold">{label}</h4>
      <label className="text-xs p-0 m-0 " htmlFor="">
        {uploadType !== 'pictures' ? (formData?.[uploadType] ? '1 File' : 'No File Uploaded') : `${formData?.[uploadType]?.length} image uploded`}
      </label>
      <div className="pChilldrenControls flex gap-5">
        <button disabled={disabled} className="border p-2 py-1 rounded rounded-md bg-neutral-400" onClick={() => setIsModalOpen(uploadType)}>
          <p className="text-xs font-semibold text-white">UPLOAD</p>
        </button>
        <button disabled={disabled} className="border p-2 py-1 rounded rounded-md bg-neutral-400">
          <p
            className="text-xs font-semibold text-white"
            onClick={() => {
              uploadType !== 'pictures' ? dispatch(RemoveFile(formData?.[uploadType], formData?._id, uploadType, 'prescription')) : dispatch(DeleteImages({ fileIds: formData?.[uploadType] }, formData?._id, 'prescription'));
            }}
          >
            DELETE
          </p>
        </button>
        {formData?.[uploadType] && (
          <button disabled={disabled} className="border p-2 py-1 rounded rounded-md bg-neutral-400">
            <p
              className="text-xs font-semibold text-white"
              onClick={(e) => {
                uploadType !== 'pictures' ? window.open(`${END_POINT}/prescription/get/${formData?.[uploadType]}`) : setShowImages(true);
              }}
            >
              VIEW
            </p>
          </button>
        )}
      </div>
      <div className="noteField">
        <label className="text-sm font-medium text-primary-900 mb-1">Note</label>
        <textarea disabled={disabled} id={id} className="w-full border border-primary-300 text-primary-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 resize-vertical" label="Symptoms" placeholder="Enter Note" onChange={handelInputChange} value={formData?.[SectionType]} name={SectionType} />
      </div>
      {isModalOpen !== 'pictures' ? <FileUploadModal isOpen={isModalOpen} closeModal={handleCloseModal} onFileUpload={handleFileUpload} uploadType={uploadType} /> : <ImageUploadModal isOpen={isModalOpen} closeModal={handleCloseModal} onImageUpload={handleImageUpload} />}
      {showImage == true && <ImageShowModal isOpen={showImage} closeModal={handleImageCloseModal} Images={formData?.[uploadType]} />}
    </div>
  );
};

function MedicinePrescriptionTable({ disabled, MedicinePrescription, setFormData, formData, handleTableChange }) {
  const medicineSuggestions = ['Xedicine 1', 'Redicine 2', 'Redicine 3', 'Xedicine 4'];

  const handleMedicineNameChange = (e, index) => {
    const updatedMedicinePrescription = { ...MedicinePrescription };
    updatedMedicinePrescription[index] = {
      ...updatedMedicinePrescription[index],
      name: e.target.value,
    };
    // setFormData({ ...formData, MedicinePrescription: updatedMedicinePrescription });
    // setFormData((prev) => prev?.map((item) => (item?.Date === ukey ? { ...item, MedicinePrescription: updatedMedicinePrescription } : item)));
    handleTableChange(e, updatedMedicinePrescription);
  };

  const [data, setData] = useState(MedicinePrescription);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!MedicinePrescription) {
      // Display a single initial row if MedicinePrescription doesn't exist
      setData({ 0: { name: '', duration: '' } });
    }
    setData(MedicinePrescription);
  }, [MedicinePrescription]);

  const addRow = (e, newIndex) => {
    let updatedData = { ...formData?.MedicinePrescription, [newIndex]: { name: '', duration: '' } };
    handleTableChange(e, updatedData);
    setData((prev) => ({ ...prev, [newIndex]: { name: '', duration: '' } }));
    setTimeout(() => focusOnInput(newIndex), 0);
  };

  const removeRow = (e, index) => {
    if (Object.keys(MedicinePrescription).length === 1) return; // Ensure at least one row remains
    const updatedMedicinePrescription = { ...MedicinePrescription };
    delete updatedMedicinePrescription[index];
    handleTableChange(e, updatedMedicinePrescription);
    const newData = { ...data };
    delete newData[index];
    setData(newData);
    setTimeout(() => focusOnInput(index), 0);
  };

  const handleDurationChange = (e, index) => {
    const updatedMedicinePrescription = { ...MedicinePrescription };
    if (updatedMedicinePrescription[index]) {
      // Check if the index exists in MedicinePrescription
      updatedMedicinePrescription[index] = {
        ...updatedMedicinePrescription[index],
        duration: e.target.value,
      };
      handleTableChange(e, updatedMedicinePrescription);
    }
  };

  const focusOnInput = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();
    }
  };

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead>
          <tr className="text-left text-xs bg-primary-400 font-medium text-primary-50 uppercase tracking-wider">
            <th className="px-4 py-1 border border-gray-300">Name</th>
            <th onClick={addRow} className="px-4 py-1 border border-gray-300">
              Duration
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(data || {}).map(([index, row]) => (
            <tr key={index}>
              <td className="text-center">
                <MedicineNameSuggestion disabled={disabled} id={formData?.Date} value={row?.name} onChange={(e) => handleMedicineNameChange(e, index)} suggestions={medicineSuggestions} name={'MedicinePrescription'} />
              </td>
              <td className="text-center">
                <input
                  disabled={disabled}
                  type="text"
                  className="outline-0"
                  name="MedicinePrescription"
                  id={formData?.Date}
                  value={row?.duration}
                  onChange={(e) => handleDurationChange(e, index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      addRow(e, Object.keys(data).length);
                      e.preventDefault();
                    } else if (e.key === 'Delete') {
                      removeRow(e, index);
                      e.preventDefault();
                    }
                  }}
                  ref={(input) => (inputRefs.current[index] = input)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SupplimentoryMedicineTable({ disabled, SupplimentoryMedicine, setFormData, formData, handleTableChange }) {
  const medicineSuggestions = ['Xedicine 1', 'Redicine 2', 'Redicine 3', 'Xedicine 4'];

  const handleMedicineNameChange = (e, index) => {
    const updatedSupplimentoryMedicine = { ...SupplimentoryMedicine };
    updatedSupplimentoryMedicine[index] = {
      ...updatedSupplimentoryMedicine[index],
      name: e.target.value,
    };
    handleTableChange(e, updatedSupplimentoryMedicine);
  };

  const [data, setData] = useState(SupplimentoryMedicine);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!SupplimentoryMedicine) {
      // Display a single initial row if SupplimentoryMedicine doesn't exist
      setData({ 0: { name: '', duration: '', fees: '' } });
    }
    setData(SupplimentoryMedicine);
  }, [SupplimentoryMedicine]);

  const addRow = (e, newIndex) => {
    let updatedData = { ...formData?.SupplimentoryMedicine, [newIndex]: { name: '', duration: '', fees: '' } };
    handleTableChange(e, updatedData);
    setData((prev) => ({ ...prev, [newIndex]: { name: '', duration: '', fees: '' } }));
    setTimeout(() => focusOnInput(newIndex), 0);
  };

  const removeRow = (e, index) => {
    if (Object.keys(SupplimentoryMedicine).length === 1) return; // Ensure at least one row remains
    const updatedMedicinePrescription = { ...SupplimentoryMedicine };
    delete updatedMedicinePrescription[index];
    handleTableChange(e, updatedMedicinePrescription);
    const newData = { ...data };
    delete newData[index];
    setData(newData);
    setTimeout(() => focusOnInput(index), 0);
  };

  const handleDurationChange = (e, index) => {
    const updatedSupplimentoryMedicine = { ...SupplimentoryMedicine };
    if (updatedSupplimentoryMedicine[index]) {
      // Check if the index exists in MedicinePrescription
      updatedSupplimentoryMedicine[index] = {
        ...updatedSupplimentoryMedicine[index],
        duration: e.target.value,
      };
      handleTableChange(e, updatedSupplimentoryMedicine);
    }
  };

  const handleFeedChange = (e, index) => {
    const updatedSupplimentoryMedicine = { ...SupplimentoryMedicine };
    if (updatedSupplimentoryMedicine[index]) {
      // Check if the index exists in SupplimentoryMedicine
      updatedSupplimentoryMedicine[index] = {
        ...updatedSupplimentoryMedicine[index],
        fees: e.target.value,
      };
      handleTableChange(e, updatedSupplimentoryMedicine);
    }
  };

  const focusOnInput = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();
    }
  };

  return (
    <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
      <thead>
        <tr className="text-left text-xs bg-primary-400 font-medium text-primary-50 uppercase tracking-wider">
          <th className="px-4 py-1 border border-gray-300">Name</th>
          <th onClick={() => addRow(Object.keys(data).length)} className="px-4 py-1 border border-gray-300">
            Duration
          </th>
          <th onClick={() => addRow(Object.keys(data).length)} className="px-4 py-1 border border-gray-300">
            Fees
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {Object.entries(data || {}).map(([index, row]) => (
          <tr key={index}>
            <td className="text-center">
              <MedicineNameSuggestion disabled={disabled} id={formData?.Date} value={row?.name} onChange={(e) => handleMedicineNameChange(e, index)} suggestions={medicineSuggestions} name="SupplimentoryMedicine" />
            </td>
            <td className="text-center">
              <input disabled={disabled} id={formData?.Date} name="SupplimentoryMedicine" type="text" className="outline-0" value={row?.duration} onChange={(e) => handleDurationChange(e, index)} />
            </td>
            <td className="text-center">
              <input
                disabled={disabled}
                id={formData?.Date}
                type="text"
                className="outline-0"
                name="SupplimentoryMedicine"
                value={row?.fees}
                onChange={(e) => handleFeedChange(e, index)}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    addRow(e, Object.keys(data).length);
                    e.preventDefault();
                  } else if (e.key === 'Delete') {
                    removeRow(e, index);
                    e.preventDefault();
                  }
                }}
                ref={(input) => (inputRefs.current[index] = input)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MedicineNameSuggestion({ disabled, value, onChange, suggestions, id, name }) {
  return (
    <div>
      <input disabled={disabled} id={id} name={name} className="focus:outline-0" type="text" value={value} onChange={onChange} list="medicine-suggestions" placeholder="Select Medicine Name" />
      <datalist id="medicine-suggestions">
        {suggestions.map((suggestion, index) => (
          <option key={index} value={suggestion} />
        ))}
      </datalist>
    </div>
  );
}

const PriceTable = ({ disabled, handelPriceTable, PaymentDetails, setFormData, formData }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
      <thead>
        <tr className="text-center text-xs bg-primary-400 font-medium text-primary-50 uppercase tracking-wider">
          <th colSpan={2} className="px-4 py-1 border border-gray-300">
            Payment Details
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        <tr className="p-2">
          <td className="ps-2" style={{ width: '70%' }}>
            Consultation charges
          </td>
          <td style={{ width: '30%' }} className="border-s border-black">
            <input disabled={disabled} type="text" id={formData?.Date} name="consultation_charges" onChange={handelPriceTable} className="w-full text-center" value={formData?.PaymentDetails?.consultation_charges} />
          </td>
        </tr>

        <tr>
          <td style={{ width: '70%' }} className="ps-2">
            Followup / Medicine Charges
          </td>
          <td style={{ width: '30%' }} className="border-s border-black">
            <input disabled={disabled} type="text" id={formData?.Date} name="followup_medicine_charges" onChange={handelPriceTable} className="w-full text-center" value={formData?.PaymentDetails?.followup_medicine_charges} />
          </td>
        </tr>

        <tr>
          <td style={{ width: '70%' }} className="ps-2">
            Supplimentary Charges
          </td>
          <td style={{ width: '30%' }} className="border-s border-black">
            <input disabled={disabled} type="text" id={formData?.Date} name="supplimentary_charges" onChange={handelPriceTable} className="w-full text-center" value={formData?.PaymentDetails?.supplimentary_charges} />
          </td>
        </tr>

        <tr>
          <td style={{ width: '70%' }} className="ps-2">
            Others 1
          </td>
          <td style={{ width: '30%' }} className="border-s border-black">
            <input disabled={disabled} type="text" id={formData?.Date} name="others_1" onChange={handelPriceTable} className="w-full text-center" value={formData?.PaymentDetails?.others_1} />
          </td>
        </tr>

        <tr>
          <td style={{ width: '70%' }} className="ps-2">
            Others 2
          </td>
          <td style={{ width: '30%' }} className="border-s border-black">
            <input disabled={disabled} type="text" id={formData?.Date} name="others_2" onChange={handelPriceTable} className="w-full text-center" value={formData?.PaymentDetails?.others_2} />
          </td>
        </tr>

        <tr>
          <td style={{ width: '70%' }} className="ps-2">
            Others 3
          </td>
          <td style={{ width: '30%' }} className="border-s border-black">
            <input disabled={disabled} type="text" id={formData?.Date} name="others_3" onChange={handelPriceTable} className="w-full text-center" value={formData?.PaymentDetails?.others_3} />
          </td>
        </tr>

        <tr>
          <td style={{ width: '70%' }} className="ps-2">
            Previous Balance / Deposits
          </td>
          <td style={{ width: '30%' }} className="border-s border-black">
            <input disabled={disabled} type="text" id={formData?.Date} name="previous_balance_deposits" onChange={handelPriceTable} className="w-full text-center" value={formData?.PaymentDetails?.previous_balance_deposits} />
          </td>
        </tr>

        <tr>
          <td style={{ width: '70%' }} className="font-bold border-t border-black p-2">
            Total Payable Amount
          </td>
          <td className="font-bold border-t border-black" style={{ width: '30%' }}>
            {formData?.total || 0}
          </td>
        </tr>
        {/* Add more rows as needed */}
      </tbody>
    </table>
  );
};

export default AddPrescription;
