import React, { useState, useEffect } from 'react';
import axios from 'axios';


const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [nicData, setNicData] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = () => {
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    axios.post('http://localhost:3000/auth/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      alert('Files uploaded successfully.');
      window.location.reload();
    })
    
    .catch(error => {
      console.error('There was an error uploading the files!', error);
    });
  };

  const fetchNicData = () => {
    axios.get('http://localhost:3000/data')
      .then(response => {
        setNicData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  };

  useEffect(() => {
    fetchNicData();
  }, []);

  return (
    <div className= 'my-5'style={{ textAlign: "center" }}>
      <h2 className="mb-4">Upload CSV files (maximum 4 files allowed) </h2>
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          multiple
          onChange={handleFileChange}
        />
        <button className="btn btn-success btn-sm" 
        onClick={handleUpload}>
          Upload
        </button>
        <hr/>
        <h3 className="mb-3 mt-5">NIC Validity</h3>
        <div>
        <table className="tables">
          <thead>
            <tr>
              <th scope="col">NIC_Number</th>
              <th scope="col">Validity</th>
            </tr>
          </thead>
          <tbody>
            {nicData.map((row, index) => (
              <tr key={index} >
                <td style={{ color: row.validity === '1' ? 'black' : 'red' }}>{row.NIC}</td>
                <td style={{ color: row.validity === '1' ? 'green' : 'red' }}>{ row.validity === '1' ? "Valid" : "Invalid"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        
    </div>
  );
}

export default FileUpload;