const fs = require("fs");

class Data{
    constructor(employees, departments){
        this.employees = employees;
        this.departments = departments;
    }
}

let allData = null;



module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile('./data/departments.json','utf8', (err, departmentData) => {
            if (err) {
                reject("unable to load departments"); return;
            }

            fs.readFile('./data/employees.json','utf8', (err, employeeData) => {
                if (err) {
                    reject("unable to load employees"); return;
                }

                allData = new Data(JSON.parse(employeeData), JSON.parse(departmentData ));
                resolve();
            });
        });
    });
}

module.exports.getAllEmployees = function(){
    return new Promise((resolve,reject)=>{
        if (allData.employees.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(allData.employees);
    })
}

module.exports.getDepartments = function(){
   return new Promise((resolve,reject)=>{
    if (allData.departments.length == 0) {
        reject("query returned 0 results"); return;
    }

    resolve(allData.departments);
   });
}

module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundEmployee = null;

        for (let i = 0; i < allData.employees.length; i++) {
            if (allData.employees[i].employeeNum == num) {
                foundEmployee = allData.employees[i];
            }
        }

        if (!foundEmployee) {
            reject("query returned 0 results"); return;
        }

        resolve(foundEmployee);
    });
};

module.exports.getDepartmentById = function (id) {
    return new Promise(function (resolve, reject) {
        var foundDepartment = null;

        for (let i = 0; i < allData.departments.length; i++) {
            if (allData.departments[i].departmentId == id) {
                foundDepartment = allData.departments[i];
            }
        }

        if (!foundDepartment) {
            reject("query returned 0 results"); return;
        }

        resolve(foundDepartment);
    });
};

module.exports.getEmployeesByDepartment = function (department) {
    return new Promise(function (resolve, reject) {
        var filteredEmployeees = [];

        for (let i = 0; i < allData.employees.length; i++) {
            if (allData.employees[i].department == department) {
                filteredEmployeees.push(allData.employees[i]);
            }
        }

        if (filteredEmployeees.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredEmployeees);
    });
};

module.exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {

        employeeData.isManager = (employeeData.isManager) ? true : false;
        employeeData.employeeNum = allData.employees.length + 1;
        allData.employees.push(employeeData);
        resolve();
    });

};

module.exports.updateEmployee = function (employeeData) {

    employeeData.isManager = (employeeData.isManager) ? true : false;

    return new Promise(function (resolve, reject) {
        for(let i=0; i < allData.employees.length; i++){
            if(allData.employees[i].employeeNum == employeeData.employeeNum){
                allData.employees[i] = employeeData;
            }
        }
        resolve();
    });
};