var routes = require('express').Router();
module.exports = routes;

routes.get('/setupDriver_Schedule', (req,res) => {
    connection.query('drop table if exists driver_schedule', function (err, rows, fields) {
      if (err)
        logger.error("Can't drop table");
    });
    connection.query('create table driver_schedule(id varchar(4), start datetime(6), end datetime(6), driver_id varchar(4) REFERENCES driver_user(id))', function (err, rows, fields) {
      if (err)
        logger.error("Problem creating the table driver_schedule")
    });
  
  res.status(200).send('created the driver schedule table');
  });
  
  
  // post /addDriver_schedule
  routes.get('/addDriver_Schedule/:id/:start/:end/:driver', (req, res) => {
    connection.query('insert into driver_schedule values(?, ?, ?, ?)',[req.params['id'],req.params['start'], req.params['end'], req.params['driver']], function(err,rows,fields){
      if(err)
        logger.error('adding row to table failed');
    });
    res.status(200).send('added given free time to driver');
  });
  