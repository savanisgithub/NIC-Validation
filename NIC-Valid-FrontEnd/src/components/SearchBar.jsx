import React, { useState } from 'react';
import axios from 'axios';


const SearchBar = ({setValidNicData}) => {
  const [query, setQuery] = useState('');
  // const [results, setResults] = useState([]);

  const handleSearch = async () => {
      try {
          const response = await axios.get('http://localhost:3000/auth/search', {
              params: { query }
          });
          const data = Array.isArray(response.data) ? response.data : [];
          console.log(data)
          setValidNicData(data);
      } catch (error) {
          console.error('Error fetching search results:', error);
          setValidNicData([]);
      }
  };

  return (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by.. Gender/NIC_number"
        style={{ padding: "10px", width: "300px", marginRight: "10px", border: '1px solid black'}}
      />
      <button onClick={handleSearch} className="btn btn-primary">
        Search
      </button>
      <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Results:</h2>
      </div>
    </div>
  );
};

export default SearchBar;