import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableDisplay = ({ tableName }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/getTableData/${tableName}`);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [tableName]);

  return (
    <div>
      <h2>Table: {tableName}</h2>
      <table>
        <thead>
          <tr>
            <th>Location ID</th>
            <th>Risk Level</th>
            <th>Last Updated</th>
            <th>Image URL</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.location_id}</td>
              <td>{item.risk_level}</td>
              <td>{item.last_updated}</td>
              <td><a href={item.image_url} target="_blank" rel="noopener noreferrer">View Image</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableDisplay;
