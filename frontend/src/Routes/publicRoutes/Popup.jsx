import React, { useState } from 'react';

const Popup = ({ onClose }) => {

    const [rowData, setRowData] = useState([{ content: 'Default Data' }]);
    const [editingRow, setEditingRow] = useState(null);
  
    const handleAddRow = () => {
      // Add a new empty row to the data
      setRowData([...rowData, { content: '' }]);
    };
  
    const handleEditRow = (index) => {
      // Set the index of the row being edited
      setEditingRow(index);
    };
  
    const handleRemoveRow = (index) => {
      // Remove the row at the specified index
      const updatedData = [...rowData];
      updatedData.splice(index, 1);
      setRowData(updatedData);
    };
  
    const handleSaveRow = () => {
      // Save the edited content and clear editing state
      setEditingRow(null);
    };
  
  

    return (
        <div className="flex flex-col items-center">
      <div className="overflow-x-auto border-2 border-[#8dda8d]  p-[30px]">
        <h1 className='text-center mt-[10px] text-[1.7rem] not-italic'>Shortcuts</h1>
        <button
          className="select-none rounded-lg bg-blue-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          onClick={handleAddRow}
        >
          Add
        </button>
        <table className="min-w-50 divide-y divide-gray-200 border border-gray-300 mt-[25px]">
          <tbody className="bg-white divide-y divide-gray-200">
            {rowData.map((row, index) => (
              <tr key={index} className='text-center'>
                <td className=" w-[500px] border border-2 border-gray-300 whitespace-nowrap">
                  {editingRow === index ? (
                    <input className="px-4 py-3 w-[500px] border border-gray-300 whitespace-nowrap"
                      type="text"
                      value={row.content}
                      onChange={(e) => {
                        const updatedData = [...rowData];
                        updatedData[index].content = e.target.value;
                        setRowData(updatedData);
                      }}
                    />
                  ) : (
                    row.content
                  )}
                </td>
                <td className="px-4 py-3 border  border-2 border-gray-300 whitespace-nowrap">
                  {editingRow !== index && (
                    <button
                      onClick={() => handleEditRow(index)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 border border-2 border-gray-300 whitespace-nowrap">
                  <button
                    onClick={() => handleRemoveRow(index)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between">
          <button
            onClick={handleSaveRow}
            className="select-none mt-[20px] rounded-lg bg-blue-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            Save
          </button>
          <button
            onClick={onClose} 
            className="select-none mt-[20px] rounded-lg bg-blue-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
      
       
    );
};

const App = () => {
    const [isPopupOpen, setPopupOpen] = useState(false);

    const handleOpenPopup = () => {
        setPopupOpen(true);
    };

    const handleClosePopup = () => {
        setPopupOpen(false);
    };

    return (
        <div>
        <button
          onClick={handleOpenPopup}
          type="button"
          className=" relative m-10 left-[80%] ms-0 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          data-hs-overlay="#hs-full-screen-modal"
        >
          Shortcuts
        </button>
        {isPopupOpen && <Popup onClose={handleClosePopup} />}
      </div>
    );
};

export default App;





























