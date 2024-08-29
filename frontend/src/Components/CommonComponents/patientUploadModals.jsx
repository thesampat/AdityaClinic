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
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg">
        <div className="modal bg-white p-6 rounded-lg">
          <button className="hover:text-gray-200 text-white close-button bg-red-500 py-1 px-3 rounded-lg" onClick={closeModal}>
            Close
          </button>
          <h2 className="text-lg font-semibold mb-2">Upload Images</h2>
          <input type="file" onChange={handleFileChange} multiple={true} />
          <button onClick={handleUpload} className="btn-primary">
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
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg">
        <div className="modal bg-white p-6 rounded-lg border-black">
          <button className="close-button py-2 px-4 bg-red-600 text-white rounded-full m-4" onClick={closeModal}>
            Close
          </button>
          <h2 className="text-lg font-semibold mb-2">Upload File</h2>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} className="btn-primary">
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
      <div className="fixed inset-0 flex items-center justify-center text-center z-50" style={{ backdropFilter: 'blur(8px)' }}>
        <div className="modal">
          <div className="modal-content p-20 bg-white rounded-md">
            <button className="close-button bg-red-500 px-3 rounded-lg p-2 mb-1" onClick={closeModal}>
              X
            </button>
            <div className="flex justify-center w-[40vw] flex-wrap gap-10">
              {Images.map((l, index) => (
                <img key={index} src={`${END_POINT}/customer/get/image/${l}`} className="modal-image" alt={`Image ${index}`} style={{ width: '10vw', height: '20vh' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export { FileUploadModal, ImageUploadModal, ImageShowModal };
