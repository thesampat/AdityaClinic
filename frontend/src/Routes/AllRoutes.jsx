import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Login';
import PageNotFound from './PageNotFound';
import MainDoctorSignup from './MainDoctorSignup';
import PrivateRoute from '../Components/PrivateRoute';
import AdminDashboard from './AdminRoutes/AdminDashboard';
import AppointmentList from './AdminRoutes/AppointmentList';
import Transaction from './AdminRoutes/Transaction';
import AddAppointment from './AdminRoutes/AddAppointment';
import AddExternalAppointment from './publicRoutes/AddExternalAppointment';
import AddNewPatientExternal from './publicRoutes/AddPatientExternal';
import Prescription from './AdminRoutes/Prescription';
import AddPrescription from './AdminRoutes/AddPrescription';
import VisualizeBoard from './Visualization/DataVisulization';
import DoctorForm from './AdminRoutes/DoctorForm';
import Table from './AdminRoutes/Table';
import ReceptionistForm from './AdminRoutes/ReceptionistForm';
import ConsultantForm from './AdminRoutes/ConsultantForm';
import CustomerForm from './AdminRoutes/PatientForm';
import EnquiryForm from './AdminRoutes/EnquiryForm';
import MainPage from '../coverPage/MainPage';
import AssistantDoctorForm from './AdminRoutes/AssistantDoctorForm';
import IncomeExpense from './AdminRoutes/IncomeExpensesForm';
import InventoryPanel from './Inventory/mainInventory';
import DistributorForm from './Inventory/DistributorForm';
import DistributorCompaniesList from './Inventory/companiesFormList';
import OrderForm from './Inventory/OrderForm';
import ReturnForm from './Inventory/ReturnForm';
import { Classical_Homeopathy } from '../coverPage/AllPages/Classical_Homeopathy';
import { TreatmentPackage } from '../coverPage/AllPages/TreatmetnPackages';
import { HealthPackage } from '../coverPage/AllPages/Health_Package';
import { ThearapyPackage } from '../coverPage/AllPages/Alternative_Therapies';
import { Testimonials } from '../coverPage/AllPages/Testimonials';
import { OnlineClinic } from '../coverPage/AllPages/onlineClinic';
import { ContactUs } from '../coverPage/AllPages/contact_us';
import { PrivacyPolicy } from '../coverPage/AllPages/privacy_policy';
import { Webpages } from '../coverPage/coverRoute';
import { FeedBack } from './publicRoutes/FeedBack';
import Popup from './publicRoutes/Popup';
import AfterActionComponent from './publicRoutes/actionView';
import FeedbackList from '../Routes/AdminRoutes/FeedbackList';
import UpdateAppointment from './AdminRoutes/UpdateAppointment';
import PatientReports from './AdminRoutes/patientReports';
import UploadPatientReports from './publicRoutes/AddPatientReports';
import AlternativeTherapies from './AdminRoutes/Alternative_Therapies/AlternativeTherapies';
import ConsultantBids from './AdminRoutes/ConsultantBids';
import Bids from './AdminRoutes/BIDS/Bids';
import AddBids from './AdminRoutes/BIDS/CreateBid';
import ReviewBid from './AdminRoutes/BIDS/ReviewBid';
import AlternativeTherapiesList from './AdminRoutes/Alternative_Therapies/AlternativeTherapiesList';
import UpdateAlternativeTherapy from './AdminRoutes/Alternative_Therapies/UpdateAlternativeTherapy';
import BidsTable from './AdminRoutes/BIDS/BidsTable';
import ClinicProfile from './AdminRoutes/ClinicProfile';

export default function AllRoutes() {
  
  return (
    <>
      <Routes>
        {!window.location.pathname.startsWith('/public') && (
          <>
            <Route path="/" element={<MainPage />} />
            <Route path="/signup" element={<MainDoctorSignup />} />
            <Route path="login" element={<Login />} />

            {/* for size pages */}
            <Route path="web" element={<Webpages />}>
              <Route path="classical_homeopathy" element={<Classical_Homeopathy />} />
              <Route path="treatmentPackage/:treatmentType/:topic" element={<TreatmentPackage />} />
              <Route path="alternative_therapies/:threapyType" element={<ThearapyPackage />} />
              <Route path="health_packages/:packageType" element={<HealthPackage />} />
              <Route path="testimonials/:testimonialType" element={<Testimonials />} />
              <Route path="online_clinic/:ocType" element={<OnlineClinic />} />
              <Route path="online_clinic/:ocType" element={<OnlineClinic />} />
              <Route path="contact_us" element={<ContactUs />} />
              <Route path="privacy_policy" element={<PrivacyPolicy />} />
              <Route path="feedback" element={<FeedBack />} />
              <Route path="popup" element={<Popup />} />
              <Route path="afterAction" element={<AfterActionComponent />} />
              <Route path="aggrement" element={<AfterActionComponent />} />
            </Route>

            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  {' '}
                  <AdminDashboard />{' '}
                </PrivateRoute>
              }
            />
            <Route
              path="/enquiry/:Enquiry_Id"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <EnquiryForm />{' '}
                </PrivateRoute>
              }
            />
            <Route
              path="/appointment"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <AddAppointment />{' '}
                </PrivateRoute>
              }
            />

            <Route
              path="/appointment/:appointmentId/:doctor_id"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <UpdateAppointment />{' '}
                </PrivateRoute>
              }
            />

            {/* <Route
            path="/prescription"
            element={
              <PrivateRoute allowedRoles={['SuperAdmin', 'Doctor']}>
                <Prescription />{' '}
              </PrivateRoute>
            }
          /> */}

            <Route
              path="/prescription/add/:patientId"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <AddPrescription />{' '}
                </PrivateRoute>
              }
            />

            <Route
              path="/doctors/:Doctor_Id"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <DoctorForm />{' '}
                </PrivateRoute>
              }
            />

            <Route
              path="/assistantDoctor/:AssistantDoctor_Id"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <AssistantDoctorForm />{' '}
                </PrivateRoute>
              }
            />

            <Route
              path="/patients/:patientId"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <CustomerForm />{' '}
                </PrivateRoute>
              }
            />
            <Route
              path="/patients/:patientId/reports"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <PatientReports />{' '}
                </PrivateRoute>
              }
            />


          <Route
              path="AlternativeTherapies"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <AlternativeTherapiesList/>{' '}
                </PrivateRoute>
              }
            ></Route>
             <Route
              path="Bids"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <BidsTable/>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/:listType"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <Table />{' '}
                </PrivateRoute>
              }
            />

            <Route
              path="/receptionist/:receptionist_Id"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <ReceptionistForm />{' '}
                </PrivateRoute>
              }
            />
            <Route
              path="/appointment/list"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <AppointmentList />{' '}
                </PrivateRoute>
              }
            />
            <Route
              path="/transaction"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <Transaction />{' '}
                </PrivateRoute>
              }
            />
            <Route
              path="/consultant/:consultant_id"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <ConsultantForm />{' '}
                </PrivateRoute>
              }
            />

            <Route
              path="/graphs"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <VisualizeBoard />{' '}
                </PrivateRoute>
              }
            />

            <Route
              path="/income_expenses"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <IncomeExpense />{' '}
                </PrivateRoute>
              }
            />

            <Route
              path="main/inventory/:section/:inventory_item_id"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <InventoryPanel />{' '}
                </PrivateRoute>
              }
            />

            <Route
              path="main/inventory/:section"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <InventoryPanel />{' '}
                </PrivateRoute>
              }
            />

            <Route
              path="main/inventory/:section/Order/:inventory_item_id/:medicine_id"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <OrderForm />{' '}
                </PrivateRoute>
              }
            />

            <Route
              path="main/inventory/:section/Returns/:inventory_item_id/:order_id"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <ReturnForm />{' '}
                </PrivateRoute>
              }
            />

            <Route
              path="main/inventory/:section/Distributors/:inventory_item_id"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <DistributorForm />{' '}
                </PrivateRoute>
              }
            />

            <Route
              path="main/inventory/:section/Distributors/companies/:company_name/:company_id"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <DistributorCompaniesList />{' '}
                </PrivateRoute>
              }
            />

            <Route
              path="feedback/:feedback_id"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <FeedbackList />{' '}
                </PrivateRoute>
              }
            ></Route>

            <Route
              path="AlternativeTherapies/:therapy_id"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <AlternativeTherapies />{' '}
                </PrivateRoute>
              }
            ></Route>

              <Route
              path="AlternativeTherapies/:therapy_id/update"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <UpdateAlternativeTherapy/>{' '}
                </PrivateRoute>
              }
            ></Route>

            <Route
              path="bids/:bid_id"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  {<Bids />}
                </PrivateRoute>
              }
            ></Route>

            <Route
              path="bids/review/:bid_id"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  {<ReviewBid />}
                </PrivateRoute>
              }
            ></Route>

            <Route
              path="bids/:bid_id/create"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <AddBids />{' '}
                </PrivateRoute>
              }
            ></Route>

  <Route
              path="clinic-profile"
              element={
                <PrivateRoute allowedRoles={['SuperAdmin']}>
                  <ClinicProfile />{' '}
                </PrivateRoute>
              }
            ></Route>          </>
        )}

        {/* External Public Routes */}
        <Route path="public/patients/addNew" element={<AddNewPatientExternal />} />
        <Route path="public/appointment" element={<AddExternalAppointment />} />
        <Route path="public/patients/reports" element={<UploadPatientReports />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}
