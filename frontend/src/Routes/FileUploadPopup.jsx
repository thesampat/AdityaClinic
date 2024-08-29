import React, { useRef, useState } from 'react';
import './Custom.css';

const ModalPopupReports = ({ isOpen, onClose, onUpload }) => {
  const [files, setFiles] = useState([]);
  const [note, setNote] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleRemoveFile = (fileIndex) => {
    const updatedFiles = [...files];
    updatedFiles.splice(fileIndex, 1);
    setFiles(updatedFiles);
  };

  const handleUpload = () => {
    onUpload(files, note);
    setFiles([]);
    setNote('');
    onClose();
  };

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  if (!isOpen) return null;

  return (
    <div className="modal bg-danger-500">
      <div className="modal-content">
        <span className="close bg-red-400 rounded px-3 rounded-xl" onClick={onClose}>
          &times;
        </span>
        <h2 className="font-bold">Add Report</h2>
        <div className="d-flex flex-col">
          <div className="border border-gray-400 p-2 rounded-md mt-2 flex h-20">
            {files?.length == 0 ? (
              <h3 className="text-gray-700">No Files Selected</h3>
            ) : (
              files.map((file, index) => (
                <div key={index} className="flex align-middle gap-1 py-1 bg-yellow-500 rounded-md py-0 px-2">
                  <p className="text-xs uppercase font-semibold">{file.name}</p>
                  <button className="p-0 m-0 text-xs px-2 font-bold" onClick={() => handleRemoveFile(index)}>
                    X
                  </button>
                </div>
              ))
            )}
          </div>
          <div>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} multiple />
            <button onClick={openFileInput} className="custom-file-button bg-cyan-500 px-2 rounded mt-2">
              <p className="font-semibold text-white">Choose Files</p>
            </button>
          </div>
        </div>
        <label htmlFor="ReportNote">Add Note</label>
        <textarea placeholder="Add a note..." name="ReportNote" value={note} onChange={handleNoteChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
};

export default ModalPopupReports;
