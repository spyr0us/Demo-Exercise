const express = require('express');
const pgp = require('pg-promise')();
const prom = require('prom-client')

const app = express();
const port = 3000;
const HOST = '0.0.0.0';

// PostgreSQL database connection parameters
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'your_database_name',
  user: 'your_database_user',
  password: 'your_database_password',
};

// Initialize the database connection
const db = pgp(dbConfig);

//Gia ta default prom metrics
//const collectDefaultMetrics = prom.collectDefaultMetrics();

let healthcount = 0; let readycount = 0; 
//Endpoint for welcome page
app.get('/', (req, res, next) => {
  res.send('Welcome to a simple Web-App!');
  });


// Endpoint for /health
app.get('/health', (req, res) => {
  healthcount++;
  res.status(200).send(`Pod is Healthy and I have been called ${healthcount} times`);
});

app.get('/metrics', (req, res) => { 
    res.send(`Endpoints have been called /health:${healthcount} , /ready:${readycount} `);
  });

// Endpoint for /metrics returning some of default prom metrics
//app.get('/metrics', async (req, res) => {
//    try {
//        res.set('Content-Type', prom.register.contentType);
//        res.end(await prom.register.metrics());
//            } 
//    catch (ex) {
//        res.status(500).end(ex);
//    }
//  });

// Endpoint for /ready
app.get('/ready', (req, res) => {
  readycount++;
  // Check the connection to PostgreSQL
  db.any('SELECT 1')
    .then(() => {
      // Connection to PostgreSQL is successful
      res.status(200).send(`Connection to postgresdb is ready and I have been called ${readycount} times`);
    })
    .catch((error) => {
      // Connection to PostgreSQL failed
      console.error('Error connecting to PostgreSQL:', error);
      res.status(503).send(`Connection to Postgredb is not ready and I have been called ${readycount} times`);
    });
});

// Start the web server
app.listen(port, () => {
  console.log(`App listening at http://${HOST}:${port}`);
});