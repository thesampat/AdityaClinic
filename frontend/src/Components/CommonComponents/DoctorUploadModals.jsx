import { useState } from 'react';
import { END_POINT } from '../../Redux/AdminReducer/action';

// ... (Your imports remain unchanged)

const ImageUploadModal = ({ isOpen, closeModal, onImageUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (selectedFiles.length > 0) {
      onImageUpload(selectedFiles);
    }
  };

  const handleFileChange = (e) => {
    Array.from(e.target.files).forEach((image_file) => {
      setSelectedFiles((prev) => [...prev, image_file]);
    });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg bg-gray-800 bg-opacity-50">
        <div className="modal bg-white p-6 rounded-lg shadow-md">
          <button className="hover:text-gray-200 text-white close-button bg-red-500 py-1 px-3 rounded-lg" onClick={closeModal}>
            Close
          </button>
          <h2 className="text-lg font-semibold mb-2">Upload Images</h2>
          <input type="file" onChange={handleFileChange} multiple={true} className="w-full border border-gray-300 p-2 rounded-md mt-2 focus:ring focus:border-blue-300" />
          <button onClick={handleUpload} className="w-full p-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 mt-2">
            Upload
          </button>
        </div>
        <button onClick={closeModal} className="modal-close" />
      </div>
    )
  );
};

const FileUploadModal = ({ isOpen, closeModal, onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files?.[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onFileUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg bg-gray-800 bg-opacity-50">
        <div className="modal bg-white p-6 rounded-lg shadow-md border-black">
          <button className="close-button py-2 px-4 bg-red-600 text-white rounded-full m-4" onClick={closeModal}>
            Close
          </button>
          <h2 className="text-lg font-semibold mb-2">Upload File</h2>
          <input type="file" onChange={handleFileChange} className="w-full border border-gray-300 p-2 rounded-md mt-2 focus:ring focus:border-blue-300" />
          <button onClick={handleUpload} className="w-full p-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 mt-2">
            Upload
          </button>
        </div>
        <button onClick={closeModal} className="modal-close" />
      </div>
    )
  );
};

const MultipleFileUploads = ({ isOpen, closeModal, onFileUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (selectedFiles.length > 0) {
      onFileUpload(selectedFiles);
    }
  };

  const handleFileChange = (e) => {
    Array.from(e.target.files).forEach((image_file) => {
      setSelectedFiles((prev) => [...prev, image_file]);
    });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg bg-gray-800 bg-opacity-50">
        <div className="modal bg-white p-6 rounded-lg shadow-md border-black">
          <button className="hover:text-gray-200 text-white close-button bg-red-500 py-1 px-3 rounded-lg" onClick={closeModal}>
            Close
          </button>
          <h2 className="text-lg font-semibold mb-2">Upload Files</h2>
          <input type="file" onChange={handleFileChange} multiple className="w-full border border-gray-300 p-2 rounded-md mt-2 focus:ring focus:border-blue-300" />
          <button onClick={handleUpload} className="w-full p-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 mt-2">
            Upload
          </button>
        </div>
        <button onClick={closeModal} className="modal-close" />
      </div>
    )
  );
};

const ImageShowModal = ({ isOpen, closeModal, Images }) => {
  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-filter" style={{ backdropFilter: 'blur(10px)' }}>
        <div className="modal">
          <div className="modal-content h-[80vh] w-[80vw] bg-white overflow-y-auto border rounded-lg">
            <button className="close-button py-2 px-4 bg-red-600 text-white rounded-full m-4 absolute top-0 right-0" onClick={closeModal}>
              Close
            </button>
            <div className="grid grid-cols-2 gap-4 p-4">
              {Images.map((image, index) => (
                <div className="border border-black rounded-xl p-2 border-4">
                  <img key={index} src={`${END_POINT}/customer/get/image/${image}`} className="modal-image rounded-lg hover:shadow-lg" alt={`Image ${index}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export { FileUploadModal, ImageUploadModal, ImageShowModal, MultipleFileUploads };
