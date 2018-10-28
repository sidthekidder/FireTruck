const express = require('express')
const path = require('path')
const fs = require('fs')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')
const twilio = require('twilio')
const Customer = require('./models/customer.js')
const Solution = require('./models/solution.js')
const Log = require('./models/log.js')
const Unresolved = require('./models/unresolved.js')

var port = process.env.PORT || 6010
var db_config = require('./config/database.js')


////////////////////////////////////////
////////// SETUP DATABASE
////////////////////////////////////////

mongoose.connect(db_config.url)


////////////////////////////////////////
////////// SETUP TWILIO
////////////////////////////////////////

var accountSid = ''
var authToken = ''

var client = new twilio(accountSid, authToken)


////////////////////////////////////////
////////// SETUP EXPRESS
////////////////////////////////////////

var app = express()
app.set('port', port)


app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(methodOverride())
app.use(express.static(path.join(__dirname, 'public')))

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

////////////////////////////////////////
////////// SETUP APPLICATION ROUTES
////////////////////////////////////////

// get all logs
app.get('/getLogs', function(req, res) {
  Log.find(function(err, data) {
    res.json({
      result: true,
      message: data
    })
  })
})

// create new log
app.post('/createLog', function(req, res) {
  var newLog = new Log({
    problemType: req.body.problemType,
    location: req.body.location,
    plan: req.body.plan,
    handset: req.body.handset,
    severity: req.body.severity,
    description: req.body.description
  })

  newLog.save(function(err) {
    if (err) {
      console.log("Error in creating log!")
      console.log(err)

      res.json({
        result: false,
        message: "Error in creating log"
      })
    } else {
      console.log("Successfully created log!")

      res.json({
        result: true,
        message: "Created Log"
      })
    }
  })
})

// create new customer
app.post('/createCustomer', function(req, res) {
  var newCustomer = new Customer({
    location: req.body.location,
    plan: req.body.plan,
    handset: req.body.handset,
    phone: req.body.phone,
  })

  newCustomer.save(function(err) {
    if (err) {
      console.log("Error in creating Customer!")
      console.log(err)

      res.json({
        result: false,
        message: "Error in creating Customer"
      })
    } else {
      console.log("Successfully created Customer!")

      res.json({
        result: true,
        message: "Created Customer"
      })
    }
  })
})

// create new solution
app.post('/createSolution', function(req, res) {
  var newSolution = new Solution({
    problemType: req.body.problemType,
    solution: req.body.solution,
    keywords: req.body.keywords,
    confidence: req.body.confidence
  })

  newSolution.save(function(err) {
    if (err) {
      console.log("Error in creating solution!")
      console.log(err)

      res.json({
        result: false,
        message: "Error in creating solution"
      })
    } else {
      console.log("Successfully created solution!")

      res.json({
        result: true,
        message: "Created Solution"
      })
    }
  })
})

// get all unresolved
app.get('/getUnresolved', function(req, res) {
  Unresolved
  .find()
  .populate('Customer')
  .populate('Solution')
  .exec(function(err, data) {
    if (err) {
      console.log("Error in finding unresolved issues!")
      console.log(err)

      res.json({
        result: false,
        message: "Error in finding unresolved issues"
      })
    } else {
      console.log(data)
      res.json({
        result: true,
        message: data
      })
    }
  })
})

// get SMS response from customer using twilio API
app.post('/getResponse', function(req, res) {
  var message = req.body.Body
  var phone = req.body.From
  
  // got YES/NO (req.message) from customer (req.phone)
  if (message == "Y")
  {
    // set unresolved as true for that Unresolved customer record
    // first get customer id
    Customer.find({phone: phone}, function(err, data) {
      console.log("Found customer with phone, the customerid si " + data[0]._id)
      Unresolved.find({customerId: data[0]._id}, function(err2, data2) {
        // get solution and send to this number
        console.log('searching for solution with id ' + data2[0].solutionId)
        Solution.find({_id: data2[0].solutionId}, function(err4, data4) {
          if (err4) {
            console.log('Couldnt find solution for unresolved')
          } else {
            console.log("Finally found solution with text " + data4[0].solution)
            client.messages.create({
              body: 'Try this solution: ' + data4[0].solution + '. Reply with N if it didn\'t work.',
              to: phone,
              from: '+17739806905'
            }).then((message) => console.log("Successfully messaged solution to : " + message.sid))
          }
        })
      })  
    })
  }
  else if (message == "N")
  {
    Customer.find({phone: phone}, function(err, data) {
      Unresolved.find({customerId: data[0]._id}, function(err2, data2) {
        console.log("Got unresolved with id " + data2[0]._id)
        data2[0].resolved = false;

        data2[0].save(function(err3) { 
          if (err) {console.log("Couldn't update resolved as false for customer " + req.phone)}

          res.json({
            result: true,
            message: "Created Solution"
          })
        })
      })
    })
  }
})


////////////////////////////////////////
////////// CHECK LOGS 
////////////////////////////////////////

function checkLogs() {
  // sum all problemIDs freq in the last 1 min
  // if any > 5 then send messages to customers
  Log.find({"createdAt": {"$gte": new Date(new Date().getTime() - 1000 * 60 * 1)}}, function(err, logs) {
    if (err) {
      console.log("Error in querying logs by date!")
      console.log(err)

      res.json({
        result: false,
        message: "Error in querying logs by date"
      })
    } else {
      var problemFrequencies = {}
      logs.forEach(function(log1) {
        if (problemFrequencies[log1['problemType']])
          problemFrequencies[log1['problemType']]['freq'] += 1
        else
        {
          problemFrequencies[log1['problemType']] = {'freq': 1, 'location': log1['location']}
        }
      })

      console.log('problemFrequencies are ')
      console.log(problemFrequencies)

      Object.keys(problemFrequencies).forEach(function(key) {
        if (problemFrequencies[key]['freq'] >= 1) { // send notification for this problem
          console.log(key + ' has frequency over 3!')

          // send twilio message to all customers with same location
          console.log("Searching for location " + problemFrequencies[key]['location'])
          Customer.find({location: problemFrequencies[key]['location']}, function(err, customers) {
            console.log("FOUND CUSTOMERS: ")
            console.log(customers)
            customers.forEach(function(cust) {
              client.messages.create({
                body: 'Are you facing a problem in ' + key + '? Reply with Y',
                to: cust['phone'],  // Text this number
                from: '+17739806905' // From a valid Twilio number
              }).then((message) => {
                console.log("Successfully messaged initial check to : " + message.sid)

                Solution.find({ problemType: key }, function(err2, data2) {
                  console.log("111. solution to " + key + " is " + data2[0].solution)
                  var newUnresolved = new Unresolved({
                    customerId: cust._id,
                    solutionId: data2[0]._id,
                    resolved: true
                  })

                  newUnresolved.save(function(err) {
                    if (err) {
                      console.log("Error in creating unresolved")
                      console.log(err)
                    } else {
                      console.log("Successfully created unresolved!")
                    }
                  })
                })
              })
            })
          })
        }
      })

      setTimeout(checkLogs, 30 * 1000)
    }
  })
}

checkLogs()


////////////////////////////////////////
////////// START SERVER
////////////////////////////////////////

app.listen(port, function() {
	console.log('Listening on port: ' + port)
})
