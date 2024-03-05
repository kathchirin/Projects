const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'waterbilling',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// GET all clients
app.get('/client_info', (req, res) => {
  const query = 'SELECT * FROM client_info';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json(results);
  });
});

// GET client by ID
app.get('/client_info/:id', (req, res) => {
  const clientId = req.params.id;
  const query = 'SELECT * FROM client_info WHERE client_id = ?';

  connection.query(query, [clientId], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Client not found');
    } else {
      res.json(results[0]);
    }
  });
});

// POST a new client
app.post('/client_info', (req, res) => {
  const newClient = req.body;
  const query = 'INSERT INTO client_info SET ?';

  connection.query(query, [newClient], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.status(201).send('Client added successfully');
  });
});

// PUT update client by ID
app.put('/client_info/:id', (req, res) => {
  const clientId = req.params.id;
  const updatedClient = req.body;
  const query = 'UPDATE client_info SET ? WHERE client_id = ?';

  connection.query(query, [updatedClient, clientId], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.send('Client updated successfully');
  });
});

// DELETE client by ID
app.delete('/client_info/:id', (req, res) => {
  const clientId = req.params.id;
  const query = 'DELETE FROM client_info WHERE client_id = ?';

  connection.query(query, [clientId], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.send('Client deleted successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
