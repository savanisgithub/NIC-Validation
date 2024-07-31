import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { calculateAge, calculateBirthday, calculateGender } from './utility/nicUtils';



const ValidNicData = ({validNicData}) => {
  console.log(validNicData)

  const handleDownload = async (format) => {
    try {
      const response = await axios.get(`http://localhost:3000/download/${format}`, {
        responseType: 'blob' // Important for downloading files
      });

      // Create a link element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Set file name based on the format
      link.setAttribute('download', `valid_nic_data.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className='my-5' style={{ textAlign: "center" }}>
      <h3 className="mb-3 mt-5">Valid NIC Data</h3>
      <div>
        <table className="tables">
          <thead>
            <tr>
              <th scope="col">NIC_Number</th>
              <th scope="col">Gender</th>
              <th scope="col">Birthday</th>
              <th scope="col">Age</th>
            </tr>
          </thead>
          <tbody>
            {validNicData?.map((row, index) => (
              <tr key={index}>
                <td>{row.NIC}</td>
                <td>{row.gender}</td>
                <td>{row.birthday}</td>
                <td>{row.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex-1 flex-row mt-3">
      <button
        className="btn btn-primary mr-2"
        onClick={() => handleDownload('pdf')}
      >
        Download PDF
      </button>
      <button
        className="btn btn-secondary mr-2"
        onClick={() => handleDownload('csv')}
      >
        Download CSV
      </button>
      <button
        className="btn btn-success mr-2"
        onClick={() => handleDownload('xlsx')}
      >
        Download Excel
      </button>
    </div>
  </div>
    
  );
};

export default ValidNicData;
