/*********************************************************************************
* WEB700 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Chirag Dudheria Student ID: 141957191 Date: 03/27/2021
* Online (Heroku) Link: https://hidden-atoll-89637.herokuapp.com/
********************************************************************************/ 


var express = require("express");
var app = express();
var serverData = require("./modules/serverDataModule.js");
var path = require("path");
var bodyParser = require("body-parser");
const exphbs = require('express-handlebars');

app.engine('.hbs', exphbs({ 
  extname: '.hbs', 
  defaultLayout: 'main',
  helpers: {
    navLink: function(url, options){
      return '<li' +
      ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
      '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
     },
     equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
      throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
      return options.inverse(this);
      } else {
      return options.fn(this);
      }
     }

  }}));
app.set('view engine', '.hbs');

var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
 });

// setup a 'route' to listen on the default url path

app.get("/employees/add", (req, res) => {
  res.render('addEmployee', {
    layout: "main" 
  });
});

app.get("/employees", (req, res) => {

  if (req.query.department) {
    serverData.getEmployeesByDepartment(req.query.department).then(employees => {
      res.render("employees",{data: employees});
    });
  }
  else {
    try {
      serverData.getAllEmployees().then(employees => {
        res.render("employees",{data: employees});
      }).catch(message => {
        res.render("employees", {message: "no results"});
      });
    }
    catch (err) {
      res.render("employees", {message: "no results"});
    }

  }

});

// app.get("/managers", (req, res) => {
//   try {
//     serverData.getManagers().then(managers => {
//       res.send(managers);
//     }).catch(message => {
//       res.status(404).send(message);
//     });
//   }
//   catch (err) {
//     res.status(500).send(err.message);
//   }
// });

app.get("/departments", (req, res) => {

  try {
    serverData.getDepartments().then(departments => {
      res.render("departments", {data: departments});
    }).catch(message => {
      res.render("departments", {message: "no results"});
    });
  }
  catch (err) {
    res.render("departments", {message: "no results"});
  }
});

app.get("/employee/:num", (req, res) => {
  serverData.getEmployeeByNum(req.params.num).then((employee) => {
   res.render("employee", { employee: employee });
  }).catch((err) => {
    res.send(err);
  })

});

app.get("/department/:id", (req, res) => {
  serverData.getDepartmentById(req.params.id).then((departments) => {
    res.render("department", { department: departments });
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

app.post("/employee/update", (req, res) => {
  console.log(req.body);
  res.redirect("/employees");
 });

app.get("/", (req, res) => {
  res.render('home', {
    layout: "main" 
  });
});

app.get("/about", (req, res) => {
  res.render('about', {
    layout: "main" 
  });
});

app.get("/htmlDemo", (req, res) => {
  res.render('htmlDemo', {
    layout: "main" 
  });
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



