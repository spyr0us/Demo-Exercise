const express = require('express');
const pgp = require('pg-promise')();
const Prometheus = require('prom-client')

const register = new Prometheus.Registry();
const app = express();
const port = 3000;
const HOST = '0.0.0.0';

//Prometheus custom counter metric
const http_request_counter = new Prometheus.Counter({
  name: 'nodejs_http_request_count',
  help: 'Count of HTTP requests made to my nodejs-app',
  labelNames: ['method', 'route', 'statusCode'],
});
register.registerMetric(http_request_counter);
register.setDefaultLabels({
  app: 'nodejs'
})
Prometheus.collectDefaultMetrics({register})

// Function to incrementing the http request counter
app.use(function(req, res, next)
{
    // Increment the HTTP request counter
    http_request_counter.labels({method: req.method, route: req.originalUrl, statusCode: res.statusCode}).inc();

    next();
});

// PostgreSQL database connection parameters
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'testDb',
  user: 'testUser',
  password: 'testPassword',
};

// Initialize the database connection
const db = pgp(dbConfig);

//Gia ta default prom metrics
//const collectDefaultMetrics = prom.collectDefaultMetrics();
 
//Endpoint for welcome page
app.get('/', (req, res, next) => {
  res.send('Welcome to a simple Web-App!');
  });


// Endpoint for /health
app.get('/health', (req, res) => {
    res.status(200).send(`Pod is Healthy`);
});

app.get('/metrics', (req, res) => { 
  res.setHeader('Content-Type',register.contentType)

  register.metrics().then(data => res.status(200).send(data))
   
  
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
  // Check the connection to PostgreSQL
  db.any('SELECT 1')
    .then(() => {
      // Connection to PostgreSQL is successful
      res.status(200).send(`Connection to postgresdb is ready`);
    })
    .catch((error) => {
      // Connection to PostgreSQL failed
      console.error('Error connecting to PostgreSQL:', error);
      res.status(503).send(`Connection to Postgredb is not ready`);
    });
});

// Start the web server
app.listen(port, () => {
  console.log(`App listening at http://${HOST}:${port}`);
});