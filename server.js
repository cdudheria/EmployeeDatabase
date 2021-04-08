/*********************************************************************************
* WEB700 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Chirag Dudheria Student ID: 141957191 Date: 03/27/2021
* Online (Heroku) Link: https://hidden-atoll-89637.herokuapp.com/
********************************************************************************/ 

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser")
const exphbs = require("express-handlebars");
const data = require("./modules/serverDataModule.js");

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.engine('.hbs', exphbs({ 
    extname: '.hbs',
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
    } 
}));

app.set('view engine', '.hbs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


app.get("/", (req,res) => {
    res.render("home");
});

app.get("/about", (req,res) => {
    res.render("about");
});

app.get("/htmlDemo", (req,res) => {
    res.render("htmlDemo");
});

app.get("/employees", (req, res) => {
    if (req.query.department) {
        data.getEmployeesByDepartment(req.query.department).then((data) => {
            res.render("employees", {employees: data});
        }).catch((err) => {
            res.render("employees", {message: "no results"});
        });
    } else {
        data.getAllEmployees().then((data) => {
            res.render("employees", {employees: data});
        }).catch((err) => {
            res.render("employees", {message: "no results"});
        });
    }
});

app.get("/employees/add", (req,res) => {
    res.render("addEmployee");
});

app.post("/employees/add", (req, res) => {
    data.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    });
});

app.post("/employee/update", (req, res) => {
    data.updateEmployee(req.body).then(() => {
        res.redirect("/employees");
    });
});

app.get("/employee/:empNum", (req, res) => {
    data.getEmployeeByNum(req.params.empNum).then((data) => {
        res.render("employee", { employee: data }); 
    }).catch((err) => {
        res.render("employee",{message:"no results"}); 
    });
});

app.get("/department/:id", (req, res) => {
    data.getDepartmentById(req.params.id).then((data) => {
        res.render("department", { department: data }); 
    }).catch((err) => {
        res.render("department",{message:"no results"}); 
    });
});

app.get("/departments", (req,res) => {
    data.getDepartments().then((data)=>{
        res.render("departments", {departments: data});
    });
});


app.use((req,res)=>{
    res.status(404).send("Page Not Found");
});


data.initialize().then(function(){
    app.listen(HTTP_PORT, function(){
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err){
    console.log("unable to start server: " + err);
});

