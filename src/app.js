require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');

const app = express();
const server = http.createServer(app);
const setupMongoServer = require('./middlewares/database');
const migrationScript = require('./middlewares/migration');

// PORT
const port = process.env.PORT || 8080;
// Connecting mongoDB
setupMongoServer();
// Migration scripts
migrationScript();
// Set Timer Auto cron

const usersRoute = require('./routes/users.route');
const companyRoute = require('./routes/companies.routes');
const documentRoute = require('./routes/documents.routes');

app.use(morgan('combined'));
// Setting up static directory
app.use('/api/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Add this line

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// RESTful API root
app.use('/api/companies', companyRoute);
app.use('/api/users', usersRoute);
app.use('/api/documents', documentRoute);
app.get('/api/version', (req, res) => res.status(200).json({
  version: process.env.VERSION,
  dateDeploy: process.env.DATE_DEPLOY,
}));
// Index Route
app.get('/', (req, res) => {
  res.status(404).send({ message: '404 not found' });
});

app.get('*', (req, res) => {
  res.status(404).json({ message: '404 not found' });
});

app.use((req, res) => {
  res.status(404).json({ message: '404 not found something is wrong' });
});
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`server Connected to port ${port}`);
});
