import { useState, useRef } from 'react';
import axios from 'axios';
import FileList from './FileList';

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const fileListRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data);
      setFile(null); // Clear the selected file
      fileListRef.current.fetchFiles(); // Refresh the file list
    } catch (error) {
      setMessage('Error uploading file: ' + error.message);
    }
  };

  return (
    // <div style={{ padding: '20px' }}>
    //   <h1>Data Backup and Retrieval</h1>
    //   <input type="file" onChange={handleFileChange} />
    //   <button onClick={handleUpload}>Upload</button>
    //   {message && <p>{message}</p>}
    //   <FileList ref={fileListRef} />
    // </div>
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Data Backup and Recovery System
        </h1>

        {/* File Upload Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              onClick={handleUpload}
              className="ml-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Upload
            </button>
          </div>
          {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
        </div>

        {/* File List Section */}
        <FileList ref={fileListRef} />
      </div>
    </div>
  );
}

export default App;