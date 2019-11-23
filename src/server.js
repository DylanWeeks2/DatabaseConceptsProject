/**A simple node/express server that include communication with a 
 * mysql db instance. 
*/
const accounts   = require('./accounts');
const creditCard = require('./creditCard');
const parentUser = require('./parentUser');
const childUser  = require('./childUser');
const driverUser = require('./driverUser');
const car        = require('./car');
const driverSchedule = require('./driverSchedule');
const rideSchedule = require('./rideSchedule');
const reviews    = require('./reviews');
//create main objects

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const mysql = require('mysql');
const session = require('express-session');

var sess; 

//create the mysql connection object.  
// var connection = mysql.createConnection({
//   //db is the host and that name is assigned based on the 
//   //container name given in the docker-compose file
//   host: 'db',
//   port: '3306',
//   user: 'user',
//   password: 'password',
//   database: 'db'
// });
//CREATE DATABASE
const db = mysql.createConnection({
  host: 'db',
  user: 'user',
  port: '3306',
  database: 'db',
  password: 'password'
})
//CONNECT TO DATABASE
db.connect((err) => {
  if(err) {
    throw err;
  }
  logger.info('Connected to the database');
})
global.db = db; //probably bad coding but this is how we are getting db to other files
//set up some configs for express. 
const config = {
  name: 'sample-express-app',
  port: 3000,
  host: '0.0.0.0',
};

//create the express.js object
const app = express();
app.set('trust proxy', 1); 
app.use(session({
   secret: 'DB project',
   resave: false,
   saveUninitialized: true,
}));

//create a logger object.  Using logger is preferable to simply writing to the console. 
const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(ExpressAPILogMiddleware(logger, { request: true }));

/**     REQUEST HANDLERS       lets get rid of these soon */ 

//GET /
app.get('/', (req, res) => {
  res.status(200).send('Go to localhost:3000/setupdb first. Then Go to localhost:3000/checkdb');
});
 
// login
app.get('/login', (req, res) => {
  sess = req.session;
  res.status(200).send('You logged in');
});

app.get('/login_driver', (req, res) => {

});


var auth = function(req, res, next) {
  if (sess)
    return next();
  else
    return res.sendStatus(401);
};


//GET /setupdb
app.get('/setupdb', (req, res) => {
  app.get('/setupDriver');
  app.get('/setup_parent');
  app.get('/setup_cc');
  app.get('/setupCar');
  res.status(200).send('created the driver, parent, credit card, and car tables');
});

//api endpoints
//accounts
app.post('/setupAccounts', accounts.setupAccounts);
app.get('/login', accounts.login);
//creditCard
app.post('/setupCreditCard', creditCard.setupCreditCard);
app.post('/saveCreditCard', creditCard.saveCreditCard);
app.get('/getCreditCard', creditCard.getCreditCard);
//parentUser
app.post('/setupParent', parentUser.setupParent);
app.post('/changeParentPassword', parentUser.changeParentPassword);
app.post('/addParent', parentUser.addParent);
app.get('/getParent', parentUser.getParent);
//driverUser
app.post('/setupDriver', driverUser.setupDriver);
app.get('/login/driver', driverUser.login);
app.post('/changeDriverPassword', driverUser.changeDriverPassword);
app.post('/addDriver', driverUser.addDriver);
app.post('/getDriver', driverUser.getDriver);
//childUser
app.post('/setupChild', childUser.setupChild);
app.post('/addChild', childUser.addChild);
app.post('/updateChildName', childUser.updateChildName);
app.post('/updateChildBio', childUser.updateChildBio);
app.post('/updateChildHealthConditions', childUser.updateChildHealthConditions);
app.post('/updateChildEmergencyContactName', childUser.updateChildEmergencyContactName);
app.post('/updateChildEmergencyContactNumber', childUser.updateChildEmergencyContactNumber);
app.post('/updateChildRating', childUser.updateChildRating);
app.get('/getChildHealthConditions', childUser.getChildHealthConditions);
app.get('/getChildEmergencyContactName', childUser.getChildEmergencyContactName);
app.get('/getChildEmergencyContactNumber', childUser.getChildEmergencyContactNumber);
app.get('/getChildBio', childUser.getChildBio);
app.get('/getChildName', childUser.getChildName);
app.get('/getChildRating', childUser.getChildRating);
//car
app.post('/setupCar', car.setupCar);
app.post('/addCar', car.addCar);
app.get('/getCarModel', car.getCarModel);
app.get('/getCarAccidents', car.getCarAccidents);
app.get('/getCarFeatures', car.getCarFeatures);
app.get('/getCarLicence', car.getCarLicence);
app.get('/getCarSeats', car.getCarSeats);
app.get('/getCarService', car.getCarService);
app.get('/getCarState', car.getCarState);
app.post('/updateCarService', car.updateCarService);
app.post('/updateCarAccidents', car.updateCarAccidents);
//driverSchedule
app.post('/setupDriverSchedule', driverSchedule.setupDriverSchedule);
app.post('/addDriverSchedule', driverSchedule.addDriverSchedule);
app.post('/setDriverScheduleStatus', driverSchedule.setDriverScheduleStatus);
app.get('/getAvailableDrivers', driverSchedule.getAvailableDrivers);
//rideSchedule
app.post('/setupRideSchedule', rideSchedule.setupRideSchedule);
app.post('/addRideSchedule', rideSchedule.addRideSchedule);
app.post('/deleteRideSchedule', rideSchedule.deleteRideSchedule);
app.post('/updateRideSchedule', rideSchedule.updateRideSchedule);
app.get('/getRideSchedule', rideSchedule.viewRideSchedule);

//reivews
app.post('/setupReviews', reviews.setupReviews);
app.post('/addReview', reviews.addReview);
app.get('/getReviews', reviews.getReviews);

//connecting the express object to listen on a particular port as defined in the config object. 
app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
module.exports = app;
module.exports = db;
