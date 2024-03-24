require('dotenv').config();
const express = require('express');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const sslConfig = {
    rejectUnauthorized: true,
    ca: fs.readFileSync('global-bundle.pem').toString(),
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: sslConfig,
});

app.use(express.json());

app.get('/tx1', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "TX1";');
        let html = '<table>';
        html += '<tr>';
        html += '<th>Location ID</th><th>Risk Level</th><th>Last Updated</th><th>Image URL</th>';
        html += '</tr>';
        result.rows.forEach(row => {
            html += '<tr>';
            html += `<td>${row.location_id}</td><td>${row.risk_level}</td><td>${row.last_updated}</td><td>${row.image_url}</td>`;
            html += '</tr>';
        });
        html += '</table>';
        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/ca1', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "CA1";');
        let html = '<table>';
        html += '<tr>';
        html += '<th>Location ID</th><th>Risk Level</th><th>Last Updated</th><th>Image URL</th>';
        html += '</tr>';
        result.rows.forEach(row => {
            html += '<tr>';
            html += `<td>${row.location_id}</td><td>${row.risk_level}</td><td>${row.last_updated}</td><td>${row.image_url}</td>`;
            html += '</tr>';
        });
        html += '</table>';
        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/ca4', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "CA4";');
        let html = '<table>';
        html += '<tr>';
        html += '<th>Location ID</th><th>Risk Level</th><th>Last Updated</th><th>Image URL</th>';
        html += '</tr>';
        result.rows.forEach(row => {
            html += '<tr>';
            html += `<td>${row.location_id}</td><td>${row.risk_level}</td><td>${row.last_updated}</td><td>${row.image_url}</td>`;
            html += '</tr>';
        });
        html += '</table>';
        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/sc1', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "SC1";');
        let html = '<table>';
        html += '<tr>';
        html += '<th>Location ID</th><th>Risk Level</th><th>Last Updated</th><th>Image URL</th>';
        html += '</tr>';
        result.rows.forEach(row => {
            html += '<tr>';
            html += `<td>${row.location_id}</td><td>${row.risk_level}</td><td>${row.last_updated}</td><td>${row.image_url}</td>`;
            html += '</tr>';
        });
        html += '</table>';
        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
