const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');
const pg = require('pg');
const sendGridMail = require('@sendgrid/mail');

require('dotenv').config();
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY)

const app = express();
app.use(express.json());
app.use(cors());

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

// Endpoint to get data from a specific table
app.get('/getTableData/:tableName', async (req, res) => {
  const { tableName } = req.params;
  const validTables = ['TX1', 'CA1', 'CA4', 'SC1'];
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const limit = parseInt(req.query.limit) || 100; // Default to 100 records per page if not specified
  const offset = (page - 1) * limit;
  
  if (!validTables.includes(tableName)) {
    return res.status(400).send('Invalid table name');
  }

  try {
    const countQueryText = `SELECT COUNT(*) FROM "${tableName}"`;
    const countResult = await pool.query(countQueryText);
    const totalRows = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalRows / limit);
    console.log(totalRows)
  
    const dataQueryText = `SELECT * FROM "${tableName}" ORDER BY location_id LIMIT $1 OFFSET $2`;
    const result = await pool.query(dataQueryText, [limit, offset]);
    
    const summaryQueryText = `SELECT COUNT(*) FILTER (WHERE risk_level = TRUE) AS "risky" FROM "${tableName}"`;
    const summaryResult = await pool.query(summaryQueryText);
    console.log("Summary: ", summaryResult.rows[0]);
    const summary = summaryResult.rows[0];

    res.json({
      data: result.rows,
      currentPage: page,
      totalPages: totalPages,
      summary: summary
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Failed to fetch data');
  }
});

// Registration endpoint
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log("Received email:", email);
  if (!email.endsWith('@ruizfoods.com')) {
    return res.status(400).send('Registration is only allowed with a Ruiz Foods email.');
  }

  try  {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password, verified) VALUES ($1, $2, $3, $4, false) RETURNING *',
      [firstName, lastName, email, hashedPassword]
    );
    // For testing purposes:
    console.log(newUser.rows);

    // Create verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const verificationUrl = `http://localhost:3001/verify-email?token=${verificationToken}`;

    // Send verification email using SendGrid
    const msg = {
      to: email,
      from: 'palletins@ruizfoods.com',
      subject: 'Verify your Email',
      text: `Please click on the link to verify your email: ${verificationUrl}`,
      html: `Please click on the link to verify your email: <a href="${verificationUrl}">Verify Email</a>`,
    };

    await sendGridMail.send(msg);

    res.status(201).send('User registered. Please check your email to verify your account. Please check your spam folder.');
  } catch (error) {
    console.error('Error inserting new user:', error.message);
    if (error.response) {
      console.error('Error response from SendGrid:', error.response.body);
    }
    res.status(500).send('Database error: ' + error.message);
  }
});

// Email Verification Endpoint
// Following code is not used yet but it is self-explanatory
app.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    await pool.query('UPDATE users SET verified = true WHERE email = $1', [email]);
    res.send('Email verified successfully.');
  } catch (error) {
    res.status(400).send('Invalid or expired token.');
  }
});

app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});
