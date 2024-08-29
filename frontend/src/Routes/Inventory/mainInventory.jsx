import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import InventoryTable from './InventoryTable';
import MedicineInventoryForm from './MedicineForm';

const InventoryPanel = () => {
  const { section, inventory_item_id } = useParams();

  return (
    <div className="m-3 rounded-md bg-slate-100 px-8 w-full min-h-[100vh] h-fit py-8">
      <div className="main-navigation-switch">
        <div className="employee-navigation flex gap-4 bg-blue-100 w-fit rounded-lg">
          <NavLink to="/main/inventory/inventory/addNew" className={({ isActive }) => (isActive ? 'bg-blue-300 rounded-lg' : 'text-black rounded-lg')} activeClassName="active-link">
            <h4 className="py-2 px-4 rounded-md">Inventory</h4>
          </NavLink>

          <NavLink to="/main/inventory/Distributors" className={({ isActive }) => (isActive ? 'bg-blue-300 rounded-lg' : 'text-black rounded-lg')} activeClassName="active-link">
            <h4 className="py-2 px-4 rounded-md">Distributors</h4>
          </NavLink>

          <NavLink to="/main/inventory/Order" className={({ isActive }) => (isActive ? 'bg-blue-300 rounded-lg' : 'text-black rounded-lg')} activeClassName="active-link">
            <h4 className="py-2 px-4 rounded-md">Orders</h4>
          </NavLink>

          <NavLink to="/main/inventory/Returns" className={({ isActive }) => (isActive ? 'bg-blue-300 rounded-lg' : 'text-black rounded-lg')} activeClassName="active-link">
            <h4 className="py-2 px-4 rounded-md">Returns</h4>
          </NavLink>

          <NavLink to="/main/inventory/medicines" className={({ isActive }) => (isActive ? 'bg-blue-300 rounded-lg' : 'text-black rounded-lg')} activeClassName="active-link">
            <h4 className="py-2 px-4 rounded-md">Medicines</h4>
          </NavLink>
        </div>

        <div className="min-h-[100vh] mt-4 rounded-lg">
          {inventory_item_id !== undefined && section === 'inventory' && <MedicineInventoryForm />}
          <InventoryTable listType={section} />
        </div>
      </div>
    </div>
  );
};

export default InventoryPanel;
