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
        <div className="modal bg-white p-6 rounded-lg shadow-md">
          <button className="close-button py-2 px-4 bg-red-600 text-white rounded-full m-4" onClick={closeModal}>
            Close
          </button>
          <h2 className="text-lg font-semibold mb-2">Upload File</h2>
          <input type="file" onChange={handleFileChange} className="w-full border border-gray-300 p-2 rounded-md mt-2 focus:ring focus:border-blue-300" />
          <button onClick={handleUpload} disabled={!selectedFile} className="w-full p-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 mt-2">
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
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg">
        <div className="modal bg-gray-200 p-6 rounded-lg">
          <div className="modal-content h-[80vh] w-[80vw]">
            <button className="close-button" onClick={closeModal}>
              Close
            </button>
            <div className="grid grid-cols-2 gap-10 h-[75vh] overflow-y-auto">
              {Images.map((l, index) => (
                <img key={index} src={`${END_POINT}/prescription/get/image/${l}`} className="modal-image" alt={`Image ${index}`} style={{ width: '100%', height: '100%' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export { FileUploadModal, ImageUploadModal, ImageShowModal };
