import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { calculateAge, calculateBirthday, calculateGender } from './utility/nicUtils';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const SummaryPage = () => {
  const [validNicData, setValidNicData] = useState([]);
  const [genderData, setGenderData] = useState({ labels: [], datasets: [] });
  const [ageData, setAgeData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    fetchValidNicData();
  }, []);

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
        setValidNicData(enrichedData);
        prepareGenderChartData(enrichedData);
        prepareAgeChartData(enrichedData);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  };

  const prepareGenderChartData = (data) => {
    const genderCount = data.reduce((acc, row) => {
      acc[row.gender] = (acc[row.gender] || 0) + 1;
      return acc;
    }, {});

    setGenderData({
      labels: Object.keys(genderCount),
      datasets: [
        {
          label: 'Gender Distribution',
          data: Object.values(genderCount),
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB'],
        },
      ],
    });
  };

  const prepareAgeChartData = (data) => {
    const ageGroups = data.reduce((acc, row) => {
      const ageGroup = Math.floor(row.age / 10) * 10;
      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {});

    setAgeData({
      labels: Object.keys(ageGroups).sort((a,b) => a-b).map(group => `${group}-${parseInt(group) + 9}`),
      datasets: [
        {
          label: 'Age Distribution',
          data: Object.values(ageGroups),
          backgroundColor: '#6482AD',
          hoverBackgroundColor: '#6482AD',
        },
      ],
    });
  };

  return (
    <div className='my-5' style={{ textAlign: "center" }}>
      <h3 className="mb-3 mt-5">NIC Summary</h3> <hr/>
      <div style={{ maxWidth: '300px', margin: '0 auto' }}>
        <h4>Gender Distribution</h4>
        <Pie data={genderData} />
      </div>
      <div className="mt-3" style={{ maxWidth: '600px', maxHeight: '300px', margin: '0 auto' }}>
        <h4>Age Distribution</h4>
        <Bar 
        data={ageData}
        options={{
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Age Groups'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Number of People'
              }
            }
          }
        }}
         />
      </div>
    </div>
  );
};

export default SummaryPage;
