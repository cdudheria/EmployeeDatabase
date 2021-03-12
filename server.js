/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Chirag Dudheria Student ID: 141957191 Date: 03/12/2021
* Online (Heroku) Link: https://hidden-atoll-89637.herokuapp.com/
********************************************************************************/ 


var express = require("express");
var app = express();
var serverData = require("./modules/serverDataModule.js");
var path = require("path");
var bodyParser = require("body-parser");


var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// setup a 'route' to listen on the default url path

app.get("/employees/add", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
});

app.get("/employees", (req, res) => {

  if (req.query.department) {
    serverData.getEmployeesByDepartment(req.query.department).then(employees => {
      res.send(employees)
    });
  }
  else {
    try {
      serverData.getAllEmployees().then(employees => {
        res.send(employees);
      }).catch(message => {
        res.status(404).send(message);
      });
    }
    catch (err) {
      res.status(500).send(err.message);
    }

  }

});

app.get("/managers", (req, res) => {
  try {
    serverData.getManagers().then(managers => {
      res.send(managers);
    }).catch(message => {
      res.status(404).send(message);
    });
  }
  catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/departments", (req, res) => {

  try {
    serverData.getDepartments().then(departments => {
      res.send(departments);
    }).catch(message => {
      res.status(404).send(message);
    });
  }
  catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/employees/:num", (req, res) => {
  serverData.getEmployeeByNum(req.params.num).then((employees) => {
    res.send(employees);
  }).catch((err) => {
    res.send(err);
  })

});

app.post("/employees/add",(req, res) => {
  serverData.addEmployee(req.body).then((serverData) => {
    res.redirect("/employees");
  }).catch((err) => {
    res.send(err);
  })
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/htmlDemo", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});

app.get('*', function (req, res) {
  res.status(400).sendFile(path.join(__dirname, "/404.png"));
});



// setup http server to listen on HTTP_PORT

serverData.initialize().then(function () {
  app.listen(HTTP_PORT, () => {
    console.log("server listening on port: " + HTTP_PORT);
    console.log("All Files Retreived");
  })
}).catch((err) => {
  console.log("We are unable to read the files" + err.message);
})



