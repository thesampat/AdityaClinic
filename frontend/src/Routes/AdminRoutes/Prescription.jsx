import CustomBreadcrumbs from '../../Components/CommonComponents/CustomBreadcrumbs';
import PrescriptionList from './PrescriptionList';
import AddPrescription from './AddPrescription';
import { useNavigate } from 'react-router-dom';

export default function Prescription() {
  const goLocation = useNavigate();

  return (
    <div className="h-[100vh] m-3 rounded-md bg-slate-100 lg:px-24 w-full p-10 bg-white">
      {/*  Breadcrumbs */}
      <CustomBreadcrumbs data={[{ title: 'Dashboard', url: '/dashboard' }, { title: 'Prescription' }]} />

      <div className="mainscreen">
        <div className="controlsScreen flex gap-10">
          <div className="prescriptionSearch">
            <div className="search_outer border border-black rounded flex justify-between p-1 w-[18vw] align-middle">
              <input type="text" className="rounded border-0 outline-0 bg-gray-200 w-full me-2 placeholder:ps-2 ps-2 family-roboto" placeholder="Search..." />
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="black" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.397l3.858 3.858a1 1 0 101.415-1.414l-3.858-3.858a6.5 6.5 0 00-1.418-1.397z" />
              </svg>
            </div>
          </div>
        </div>
        <br />
        <div className="prescriptionTable">
          <PrescriptionList />
        </div>
      </div>
    </div>
  );
}
