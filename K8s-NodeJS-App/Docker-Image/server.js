const express = require('express');
const pgp = require('pg-promise')();
const Prometheus = require('prom-client')

const register = new Prometheus.Registry();
const app = express();
const port = 3000;


//Prometheus custom counter metric
const http_request_counter = new Prometheus.Counter({
  name: 'nodejs_http_request_count',
  help: 'Count of HTTP requests made to my nodejs-app',
  labelNames: ['method', 'route', 'statusCode'],
});
register.registerMetric(http_request_counter);

//Prometheus default Metrics
register.setDefaultLabels({
  app: 'nodejs'
})
Prometheus.collectDefaultMetrics({register})

// Function for Prometheus custom counter metric
app.use(function(req, res, next)
{
    http_request_counter.labels({method: req.method, route: req.originalUrl, statusCode: res.statusCode}).inc();

    next();
  });

// PostgreSQL database connection parameters
const dbConfig = {
  host: '192.168.49.2',
  port: 30432,
  database: 'postgresdb',
  user: 'postgres',
  password: 'root',
};

// Initialize the database connection
const db = pgp(dbConfig);

//Endpoint for welcome page
app.get('/', (req, res) => {
  res.send('Welcome to a Sample Web-App!');
  });

// Endpoint for /health
app.get('/health', (req, res) => {
    res.status(200).send(`The application's pod is up and running!`);
});

// Endpoint for /metrics
app.get('/metrics', (req, res) => { 
  res.setHeader('Content-Type',register.contentType)

  register.metrics().then(data => res.status(200).send(data))
   
  });

// Endpoint for /ready  
app.get('/ready', (req, res) => {
  db.connect()
    .then(function (obj) {
         
      res.status(200).send('Connection to postgresdb is ready!');
    })
    .catch(function (error) {
        
      console.error('Error connecting to PostgreSQL:', error);
      res.status(503).send('Connection to Postgredb is not ready!');
    });
  });

// Start the Sample web App
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});