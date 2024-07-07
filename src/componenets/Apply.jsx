import React, { useState } from 'react';
import SuccessAlert from './SuccessAlert';

const Apply = ({ show, onClose }) => {
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const maxFiles = 2;

  const handleFileChange = (event) => {
    const fileList = event.target.files;
    if (fileList.length + files.length > maxFiles) {
      setFileError(`You can only upload up to ${maxFiles} files.`);
    } else {
      setFiles([...files, ...fileList]);
      setFileError('');
    }
  };

  const handleClearFiles = () => {
    setFiles([]);
    setFileError('');
  };

  const handleClose = () => {
    handleClearFiles();
    onClose();
  };

  const handleUpload = () => {
    const updatedFiles = files.map(file => ({
      ...file,
      status: 'Uploading...',
    }));

    setFiles(updatedFiles);

    setTimeout(() => {
      const uploadedFiles = updatedFiles.map(file => ({
        ...file,
        status: 'Uploaded',
      }));

      setFiles(uploadedFiles);
      setShowSuccess(true);
    }, 3000);
  };

  const handleSuccessAlertClose = () => {
    setShowSuccess(false);
    handleClose();
  };

  return show ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-full">
        <h2 className="text-xl font-bold mb-4 text-center">Upload Your CV and a Motivation Letter (optional)</h2>

        <div className="grid sm:grid-cols-2 gap-12 max-w-3xl mx-auto">
          <div className="bg-gray-50 text-center px-4 rounded w-full h-80 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-400 border-dashed font-sans">
            <div className="py-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 mb-2 fill-gray-600 inline-block" viewBox="0 0 32 32">
                <path d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z" data-original="#000000" />
                <path d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z" data-original="#000000" />
              </svg>
              <h4 className="text-base font-semibold text-gray-600">Drag and drop files here</h4>
            </div>
            <hr className="w-full border-gray-400 my-2" />
            <div className="py-6">
              <input
                type="file"
                id="uploadFile1"
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
              <label
                htmlFor="uploadFile1"
                className="block px-6 py-2.5 rounded text-gray-600 text-sm tracking-wider cursor-pointer font-semibold border-none outline-none bg-gray-200 hover:bg-gray-100"
              >
                Browse Files
              </label>
              <p className="text-xs text-gray-400 mt-4">Allowed formats: PDF, DOCX, DOC, PNG, JPG, and TXT. Maximum {maxFiles} files.</p>
              {fileError && <p className="text-red-500 mt-1">{fileError}</p>}
            </div>
          </div>
          <div>
            <h4 className="text-base text-gray-600 font-semibold">Uploaded Files</h4>
            <div className="space-y-8 mt-4">
              {files.map((file, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex mb-2">
                    <p className="text-sm text-gray-500 font-semibold flex-1">
                      {file.name} <span className="ml-2">{(file.size / 1024).toFixed(1)} kb</span>
                    </p>
                    {file.status === 'Uploaded' ? (
                      <span className="text-green-500">Uploaded</span>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 cursor-pointer shrink-0 fill-black hover:fill-red-500"
                        viewBox="0 0 320.591 320.591"
                        onClick={() => {
                          const updatedFiles = [...files];
                          updatedFiles.splice(index, 1);
                          setFiles(updatedFiles);
                        }}
                      >
                        <path
                          d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                          data-original="#000000"
                        ></path>
                        <path
                          d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                          data-original="#000000"
                        ></path>
                      </svg>
                    )}
                  </div>
                  <div className="bg-gray-300 rounded-full w-full h-2.5">
                    <div className="w-full h-full rounded-full bg-blue-600 flex items-center relative">
                      <span className="absolute text-xs right-0.5 bg-white w-2 h-2 rounded-full"></span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 font-semibold flex-1 mt-2">
                    {file.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleClose}
            className="bg-buttonColor1 text-white px-4 py-2 rounded-full hover:bg-red-600 focus:outline-none mr-4"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="bg-buttonColor2 text-white px-4 py-2 rounded-full hover:bg-green-600 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </div>
      {showSuccess && <SuccessAlert onClose={handleSuccessAlertClose} />}
    </div>
  ) : null;
};

export default Apply;
