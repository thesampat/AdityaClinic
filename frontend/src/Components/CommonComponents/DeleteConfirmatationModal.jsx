import React, { useEffect, useState } from 'react';

export default function DeleteConfirmatationModal({ text, heading, deleteFunction, isProcessing, isSuccess, name = 'Delete' }) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowModal(false);
    }
  }, [isSuccess]);

  // delete
  const handleDeleteRequest = () => {
    deleteFunction();
    setShowModal(false);
  };

  return (
    <>
      <span className="bg-red-100 cursor-pointer text-red-800 text-xs font-medium px-2.5 py-0.5 rounded border border-red-400" onClick={() => setShowModal(true)}>
        {name}
      </span>
      {showModal ? (
        <>
          {/* Blur background */}
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50"></div>
          <div className="justify-center outline-1 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/* Modal content */}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">{heading}</h3>
                  <button className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={() => setShowModal(false)}>
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                  </button>
                </div>
                {/* Body */}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    Are you sure you want to delete, <span className="font-bold">{text}</span>{' '}
                  </p>
                </div>
                {/* Footer */}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button className={`${isProcessing ? 'text-primary-300 cursor-not-allowed' : 'text-primary-300 bg-transparent active:text-primary-50 active:bg-primary-300'} font-bold uppercase text-sm px-6 py-2.5 rounded hover:shadow-lg focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`} type="button" onClick={() => setShowModal(false)} disabled={isProcessing}>
                    Close
                  </button>
                  <button
                    className={`${isProcessing ? 'bg-primary-500 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-400'} text-primary-300 ${isProcessing ? 'text-primary-50' : 'hover:text-primary-500'} font-bold uppercase text-sm px-6 py-2.5 rounded shadow hover:shadow-lg focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                    type="button"
                    onClick={() => {
                      if (!isProcessing) {
                        handleDeleteRequest(); // Call your delete function here
                      }
                    }}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
