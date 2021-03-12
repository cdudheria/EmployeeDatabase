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

module.exports.getManagers = function () {
    return new Promise(function (resolve, reject) {
        var filteredEmployeees = [];

        for (let i = 0; i < allData.employees.length; i++) {
            if (allData.employees[i].isManager == true) {
                filteredEmployeees.push(allData.employees[i]);
            }
        }

        if (filteredEmployeees.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredEmployeees);
    });
};

module.exports.getDepartments = function(){
   return new Promise((resolve,reject)=>{
    if (allData.departments.length == 0) {
        reject("query returned 0 results"); return;
    }

    resolve(allData.departments);
   });
}

module.exports.getEmployeesByDepartment = function (department){
   return new Promise((resolve,reject)=>{
        var employee = [];

        for (let i = 0; i < allData.employees.length; i++) {
            if (allData.employees[i].department == department) {
                employee.push(allData.employees[i]);
            }
        }
        if (employee.length == 0){
            reject("No results returned");
            return;
        }

        resolve(employee);
   });

}

module.exports.getEmployeeByNum = function (num){
    return new Promise((resolve,reject)=>{

        if(allData.employees[num]){
            resolve(allData.employees[num - 1]);
        }
        
        reject("No results returned");
    });

}

module.exports.addEmployee = function (employeeData){
    return new Promise((resolve,reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        employeeData.employeeNum = allData.employees.length + 1;
        allData.employees.push(employeeData);
        resolve(allData.employees);
    });
}
