/**A simple node/express server that include communication with a 
 * mysql db instance. 
*/
const creditCard = require('./creditCard');
const parentUser = require('./parentUser');
const childUser  = require('./childUser');
const driverUser = require('./driverUser');
const car        = require('./car');
const driverSchedule = require('./driverSchedule');
const rideSchedule = require('./rideSchedule');
const reviews    = require('./reviews');
const accounts = require('./accounts');
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
  console.log("setting up db");
  let query = "DROP TABLE if exists childUser";
  db.query(query, (err, result) => 
  {
    if(err) {
      console.log("NO DELETION");
    }
    else{
        console.log("deleted table Childuser")
      }
  });
  query = "DROP TABLE if exists rideSchedule";
  db.query(query, (err, result) => 
  {
    if(err) {
      console.log("NO DELETION");
    }
    else{
        console.log("deleted table rideSchedule")
      }
  });
  query = "DROP TABLE if exists rideSchedule";
  db.query(query, (err, result) => 
  {
    if(err) {
      console.log("NO DELETION");
    }
    else{
        console.log("deleted table rideSchedule")
      }
  });
  query = "DROP TABLE if exists driverSchedule";
  db.query(query, (err, result) => 
  {
    if(err) {
      console.log("NO DELETION");
    }
    else{
        console.log("deleted table driverSchedule")
      }
  });
  query = "DROP TABLE if exists review";
  db.query(query, (err, result) => 
  {
    if(err) {
      console.log("NO DELETION");
    }
    else{
        console.log("deleted table review")
      }
  });
  query = "DROP TABLE if exists accounts";
  db.query(query, (err, result) => 
  {
    if(err) {
      console.log("NO DELETION");
    }
    else{
        console.log("deleted table accounts")
      }
  });
  query = "DROP TABLE if exists creditCard";
  db.query(query, (err, result) => 
  {
    if(err) {
      console.log("NO DELETION");
    }
    else{
        console.log("deleted table creditCard")
      }
  });
  query = "DROP TABLE if exists parentUser";
  db.query(query, (err, result) => 
  {
    if(err) {
      console.log("NO DELETION");
    }
    else{
        console.log("deleted table parentUser")
      }
  });
  query = "DROP TABLE if exists driverUser";
  db.query(query, (err, result) => 
  {
    if(err) {
      console.log("NO DELETION");
    }
    else{
        console.log("deleted table driverUser")
      }
  });
  driverUser.setupDriver(req,res);
  accounts.setupAccounts(req, res);
  parentUser.setupParent(req, res);
  childUser.setupChild(req, res);
  res.status(200).send('created the driver, parent, credit card, and car tables');
});

//api endpoints
//accounts
app.post('/setupAccounts', accounts.setupAccounts);
app.get('/login', accounts.login);
app.put('/changePassword', accounts.changePassword);
//creditCard
app.post('/setupCreditCard', creditCard.setupCreditCard);
app.post('/saveCreditCard', creditCard.saveCreditCard);
app.get('/getCreditCard', creditCard.getCreditCard);
//parentUser
app.post('/setupParent', parentUser.setupParent);
//app.put('/changeParentPassword', parentUser.changeParentPassword);
app.post('/addParent', parentUser.addParent);
app.get('/getParent', parentUser.getParent);
//driverUser
app.post('/setupDriver', driverUser.setupDriver);
//app.put('/changeDriverPassword', driverUser.changeDriverPassword);
app.post('/addDriver', driverUser.addDriver);
app.post('/getDriver', driverUser.getDriver);
//childUser
app.post('/setupChild', childUser.setupChild);
app.post('/addChild', childUser.addChild);
app.post('/updateChild', childUser.updateChild);
app.get('/getChild', childUser.getChild);
//car
app.post('/setupCar', car.setupCar);
app.post('/addCar', car.addCar);
app.get('/getCar', car.getCar);
app.post('/updateCar', car.updateCar);
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
