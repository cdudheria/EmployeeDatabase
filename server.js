/*********************************************************************************
* WEB700 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Chirag Dudheria Student ID: 141957191 Date: 04/11/2021
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
        navLink: function (url, options) {
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
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo");
});

app.get("/employees", (req, res) => {
    if (req.query.department) {
        data.getEmployeesByDepartment(req.query.department).then((data) => {
            if (data.length > 0) {
                res.render("employees", { employees: data });
            }
        }).catch((err) => {
            res.render("employees", { message: "no results" });
        });
    } else {
        data.getAllEmployees().then((data) => {
            if (data.length > 0) {
                res.render("employees", { employees: data });
            }
        }).catch((err) => {
            res.render("employees", { message: "no results" });
        });
    }
});

app.get("/employees/add", (req, res) => {
    data.getDepartments().then((data) => {
        res.render("addEmployee", { departments: data });
    }).catch((err) => {
        res.render("addEmployee", { departments: [] });
    })
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
    // initialize an empty object to store the values
    let viewData = {};
    data.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    }).then(data.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
});

app.get("/department/:id", (req, res) => {
    data.getDepartmentById(req.params.id).then((data) => {
        res.render("department", { department: data });
    }).catch((err) => {
        res.render("department", { message: "no results" });
    });
});

app.get("/departments", (req, res) => {
    data.getDepartments().then((data) => {
           if (data.length > 0){
                res.render("departments", {departments: data });
           }
           else{
                res.render("departments", { message: "no results" });
            }
    }).catch((err)=>{
        res.render("departments", { message: "no results" });
       });
});

app.get("/departments/add", (req, res) => {
    res.render("addDepartment");
});

app.post("/departments/add", (req, res) => {
    data.addDepartment(req.body).then(() => {
        res.redirect("/departments");
    });
});

app.post("/department/update", (req, res) => {
    data.updateDepartment(req.body).then(() => {
        res.redirect("/departments");
    });
});

app.get("/departments/delete/:id", (req, res) => {
    data.deleteDepartmentById(req.params.id).then(() => {
        res.redirect("/departments");
    }).catch(function (err) {
        res.status(500).send("Unable to Remove Department / Department not found");
    })
})

app.get("/employees/delete/:empNum", (req,res) =>{
    data.deleteEmployeeByNum(req.params.empNum).then(() =>{
        res.redirect("/employees");
    }).catch(function (err) {
        res.status(500).send("Unable to Remove Employee / Employee not found");
    })
})

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "/404.png"));
});


data.initialize().then(function () {
    app.listen(HTTP_PORT, function () {
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function (err) {
    console.log("unable to start server: " + err);
});

