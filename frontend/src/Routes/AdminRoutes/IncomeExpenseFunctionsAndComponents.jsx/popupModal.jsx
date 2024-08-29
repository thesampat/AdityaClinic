import { useEffect, useState } from 'react';
import './IEpopModal.css';
import { END_POINT, getJwtToken } from '../../../Redux/AdminReducer/action';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const fetchItems = async (year) => {
  try {
    const result = await axios.get(`${END_POINT}/incomeExpense/shortcuts?year=${year}`, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    return result;
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    console?.log(error);

    toast.error('Something went wrong while fetching data');
  }
};

const createItem = async (data, setIsPorcessing, closeAddPopup) => {
  console?.log(data);
  try {
    const result = await axios.post(`${END_POINT}/incomeExpense/shortcuts?year=${data?.year}`, data, {
      headers: {
        Authorization: getJwtToken(),
      },
    });
    setIsPorcessing(false);
    closeAddPopup();
    toast.success('Saved');
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    setIsPorcessing(false);
  }
};

export const IEButtonModal = ({ isPopupOpen, setPopupOpen, year }) => {
  const [isAddPopupOpen, setAddPopupOpen] = useState(false);
  const [items, setItems] = useState([{ id: 1, title: '', items: [] }]);

  const [newItemName, setNewItemName] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [selectedFruits, setSelectedFruits] = useState([]);
  const navigate = useNavigate();
  const [isProcessing, setIsPorcessing] = useState(false);

  const closePopup = () => setPopupOpen(false);

  const openAddPopup = (index) => {
    setSelectedItemIndex(index);
    setNewItemName('');
    setSelectedFruits(index !== null ? items[index].items : []);
    setAddPopupOpen(true);
  };

  const closeAddPopup = () => {
    setSelectedItemIndex(null);
    setNewItemName('');
    setSelectedFruits([]);
    setAddPopupOpen(false);
  };

  const handleEditButtonClick = (index) => openAddPopup(index);

  const handleDeleteButtonClick = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    closeAddPopup();
  };

  const handleRemoveSelectedFruit = (index) => {
    const updatedItems = [...items];
    const updatedFruits = [...updatedItems[selectedItemIndex].items];
    updatedFruits.splice(index, 1);
    updatedItems[selectedItemIndex].items = updatedFruits;
    setItems(updatedItems);
  };

  const handleAddNewFruit = () => {
    if (newItemName?.trim() !== '') {
      const updatedItems = [...items];

      if (selectedItemIndex !== null && updatedItems[selectedItemIndex]) {
        if (!updatedItems[selectedItemIndex].items) {
          updatedItems[selectedItemIndex].items = [];
        }

        const updatedFruits = [...updatedItems[selectedItemIndex].items, newItemName];
        updatedItems[selectedItemIndex].items = updatedFruits;
      } else {
        const newItemObject = { id: Date?.now(), title: '', items: [newItemName] };
        updatedItems.push(newItemObject);
      }

      setItems(updatedItems);
      setNewItemName('');
    }
  };

  const handleTitleChange = (index, newTitle) => {
    const updatedItems = [...items];
    updatedItems[index] ? (updatedItems[index].title = newTitle) : updatedItems.push({ id: Date?.now(), title: newTitle, fruits: [] });
    setItems(updatedItems);
  };

  const handelSave = (e) => {
    e?.preventDefault();
    let finalData = { year: new Date().toISOString().slice(0, 4), data: items };
    createItem(finalData, setIsPorcessing, closeAddPopup);
  };

  useEffect(() => {
    fetchItems(year).then((e) => {
      setItems(e?.data?.[0]?.data);
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup bg-white p-6 rounded shadow-md w-96">
            <button
              className="add-button absolute top-4 right-4 bg-blue-500 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
              onClick={() => {
                openAddPopup(null);
                setSelectedItemIndex(items?.length);
              }}
            >
              Add
            </button>
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            <ul>
              <div className="overflow-y-scroll h-80 px-2 py-2">
                {items?.map((item, index) => (
                  <li key={item?.id} className="flex justify-between items-center mb-3 gap-2">
                    <h5 placeholder="Title" className="w-full border p-2 overflowX">
                      {item?.title}
                    </h5>
                    <div className="flex gap-3">
                      <button className="edit-button bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-600 focus:outline-none focus:ring focus:border-yellow-300" onClick={() => handleEditButtonClick(index)}>
                        Edit
                      </button>

                      <button className="delete-button bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300" onClick={() => handleDeleteButtonClick(index)}>
                        X
                      </button>
                    </div>
                  </li>
                ))}
              </div>
            </ul>
            <button className="close-button bg-blue-500 text-white py-2 px-4 rounded mt-4 ml-auto focus:outline-none focus:ring focus:border-blue-300" onClick={closePopup}>
              Close Popup
            </button>
          </div>
        </div>
      )}

      {isAddPopupOpen && (
        <div className="popup-overlay">
          <div className="add-popup">
            <div className="add-popup-content bg-white p-6 rounded shadow-md w-96 overflow-y-auto max-h-screen">
              <h2 className="text-xl font-semibold mb-4">{selectedItemIndex !== null ? 'Edit' : 'Add'}</h2>

              <input type="text" placeholder="Title" value={items?.[selectedItemIndex]?.title} onChange={(e) => handleTitleChange(selectedItemIndex, e?.target.value)} className="input-field w-full border p-2 rounded font-black font-semibold" />

              <div>
                <h3 className="text-lg font-semibold mb-2">Items</h3>

                <ul>
                  <div className="itemscrollIE overflow-y-scroll h-max-80 mb-3">
                    {items?.[selectedItemIndex]?.items?.map((fruit, fruitIndex) => (
                      <div key={fruitIndex} className="fruit-entry flex items-center justify-between mb-2">
                        <span className="fruit-box bg-blue-200 text-blue-800 p-2 rounded">{fruit}</span>
                        <button className="remove-button bg-red-500 text-white p-2 rounded" onClick={() => handleRemoveSelectedFruit(fruitIndex)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="fruit-entry flex items-center justify-between mb-2">
                    <span className="fruit-box">
                      <input type="text" placeholder="New Item" value={newItemName} onChange={(e) => setNewItemName(e?.target.value)} className="input-field w-full border p-2 border-black" />
                    </span>
                    <button className="add-button bg-green-500 text-white p-2 rounded" onClick={handleAddNewFruit}>
                      Add
                    </button>
                  </div>
                </ul>
              </div>
              <div className="flex justify-between">
                <button className="cancel-button bg-blue-500 text-white py-2 px-4 rounded mt-4" onClick={handelSave}>
                  Save
                </button>
                <button className="cancel-button bg-gray-500 text-white py-2 px-4 rounded mt-4" onClick={closeAddPopup}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
