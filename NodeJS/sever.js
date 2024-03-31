const express = require('express');
var mysql = require('mysql');
const bodyPasrer=require('body-parser');
const cors=require('cors');

const app = express();
app.use(bodyPasrer.urlencoded({extended: false}));
app.use(cors());


var con = mysql.createConnection({
  host: 'ruiz-pallet-risk-tracker.c3kk422uemzw.us-east-1.rds.amazonaws.com',
  user: 'postgres',
  port: 5432,
  password: 'EdoFeI0E<3EDhN7dhrGCmyY2o_ZM',
  database: 'ruiz-pallet-risk-tracker',
});

con.connect(function(err) {
  if (err) {
    console.error('Error connecting to database:', err);
  }
  console.log('Connected to MySQL database');
});

app.get('/',(req,res)=>{
  res.json('ok')
})



app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});
