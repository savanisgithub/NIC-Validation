import React, { useEffect, useState } from 'react'
import SearchBar from './SearchBar';
import ValidNicData from './ValidNicData';
import axios from 'axios';
import { calculateAge, calculateBirthday, calculateGender } from './utility/nicUtils';

function Dashboard() {

  const [validNicData, setValidNicData] = useState(null);

  const fetchValidNicData = () => {
    axios.get('http://localhost:3000/data')
      .then(response => {
        const validData = response.data.filter(row => row.validity === '1');
        const enrichedData = validData.map(row => {
          const gender = calculateGender(row.NIC);
          const birthday = calculateBirthday(row.NIC);
          const age = calculateAge(birthday);
          return { ...row, gender, birthday, age };
        });
        console.log('enrichedData',enrichedData)
        setValidNicData(enrichedData);
        saveDataToDatabase(enrichedData);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  };

  const saveDataToDatabase = (data) => {
    axios.post('http://localhost:3000/saveValidNicData', data)
      .then(response => {
        console.log('Data saved successfully.');
      })
      .catch(error => {
        console.error('There was an error saving the data!', error);
      });
  };

  useEffect(() => {
    fetchValidNicData();
  }, []);


  
  return (
    <div>
        <SearchBar setValidNicData={setValidNicData} />
       {validNicData && <ValidNicData validNicData={validNicData}/>}
    </div>
  )
}

export default Dashboard;