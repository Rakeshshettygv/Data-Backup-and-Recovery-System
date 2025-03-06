import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';

const FileList = forwardRef(function FileList(props, ref) {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/files');
      setFiles(response.data);
    } catch (error) {
      setMessage('Error fetching files: ' + error.message);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useImperativeHandle(ref, () => ({
    fetchFiles,
  }));

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(`http://localhost:5000/download/${filename}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMessage('File downloaded successfully!');
    } catch (error) {
      setMessage('Error downloading file: ' + error.message);
    }
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${filename}`);
      setMessage('File deleted successfully!');
      await fetchFiles(); // Refresh the file list
    } catch (error) {
      setMessage('Error deleting file: ' + error.message);
    }
  };

  return (
    // <div>
    //   <h2>Uploaded Files</h2>
    //   {message && <p>{message}</p>}
    //   <ul>
    //     {files.map((file, index) => (
    //       <li key={index}>
    //         {file}
    //         <button onClick={() => handleDownload(file)}>Download</button>
    //         <button onClick={() => handleDelete(file)}>Delete</button>
    //       </li>
    //     ))}
    //   </ul>
    // </div>
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Files</h2>
      {message && <p className="text-sm text-gray-600 mb-4">{message}</p>}
      <ul className="space-y-4">
        {files.map((file, index) => (
          <li key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">{file}</span>
            <div className="flex space-x-4">
              <button
                onClick={() => handleDownload(file)}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
              >
                Download
              </button>
              <button
                onClick={() => handleDelete(file)}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

FileList.displayName = 'FileList';

export default FileList;