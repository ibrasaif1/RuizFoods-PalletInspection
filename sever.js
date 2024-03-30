const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3001; // or any port you prefer

// MySQL Connection
const connection = mysql.createConnection({
  host: 'ruiz-pallet-risk-tracker.c3kk422uemzw.us-east-1.rds.amazonaws.com',
  user: 'postgres',
  password: 'EdoFeI0E<3EDhN7dhrGCmyY2o_ZM',
  database: 'ruiz-risk-pallet-tracker'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API endpoint to fetch data from the database
app.get('/api/data', (req, res) => {
  const query = 'SELECT * FROM your_table'; // Adjust this query as per your table structure
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
