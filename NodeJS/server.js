const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');
const pg = require('pg');
require('dotenv').config();

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

// Nodemailer setup
// This is from ChatGPT and this is not used yet, but the idea is for users to receive an email so they can verify they are signing up with a valid @ruizfoods.com email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Registration endpoint
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log("Received email:", email);
  // if (!email.endsWith('@ruizfoods.com')) {
  //   return res.status(400).send('Registration is only allowed with a Ruiz Foods email.');
  // }

  try  {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstName, lastName, email, hashedPassword]
    );
    console.log(newUser.rows);

    // Create verification token
    // The following two lines do not get used yet and are also from GPT, but the idea is verifying the user
    // const token = jwt.sign({ email }, process.env.JWT_secret, { expiresIn: '24h' });
    // const verificationUrl = `http://localhost:3001/verify-email?token=${token}`;

    // Send verification email
    // Following code is not used yet but it is self-explanatory
    await transporter.sendMail({
      from: '"Ruiz Foods" <noreply@ruizfoods.com>',
      to: email,
      subject: 'Verify your Email',
      html: `Please click on the link to verify your email: <a href="${verificationUrl}">Verify Email</a>`
    });

    res.status(201).send('User registered. Please check your email to verify your account.');
  } catch (error) {
    console.error('Error inserting new user:', error.message);
    res.status(500).send('Database error: ' + error.message);
  }
});

// Email Verification Endpoint
// Following code is not used yet but it is self-explanatory
app.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    await pool.query('UPDATE users SET is_verified = true WHERE email = $1', [email]);
    res.send('Email verified successfully.');
  } catch (error) {
    res.status(400).send('Invalid or expired token.');
  }
});

app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});
