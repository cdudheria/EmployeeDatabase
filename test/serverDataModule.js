
const Sequelize = require('sequelize');

var sequelize = new Sequelize('d4vur09lah8p5d', 'qggxcfagftcjhr', 'd39fb28c230c0cd610e7a8b39cb76af4778a790bf43af62d2b942ff8db9ff131', {
    host: 'ec2-3-233-43-103.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }
});

var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

Department.hasMany(Employee, { foreignKey: 'department' });

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function () {
            console.log("Tables added Successfully!");
            resolve("Connected Successfully");
        }).catch(function (err) {
            reject("unable to sync the database");
        });
    });
}

module.exports.getAllEmployees = function () {
    return new Promise((resolve, reject) => {
        Employee.findAll().then(function (data) {
            data = data.map(x => x.dataValues);
            resolve(data);
        }).catch(function (err) {
            reject("query returned 0 results", err); return;
        });

    });
}

module.exports.getDepartments = function () {
    return new Promise((resolve, reject) => {
        Department.findAll().then(function (data) {
            data = data.map(x => x.dataValues);
            resolve(data);
        }).catch(function (err) {
            reject("query returned 0 results", err); return;
        });


    });
}

module.exports.getEmployeeByNum = function (num) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                employeeNum: num
            }
        }).then(function (data) {
            data = data.map(x => x.dataValues);
            resolve(data);
        }).catch(function (err) {
            reject("query returned 0 results"); return;
        });


    });
};

module.exports.getDepartmentById = function (id) {
    return new Promise((resolve, reject) => {
        Department.findAll({
            where: {departmentId: id}
        }).then(function (data) {
            data = data.map(x => x.dataValues);
            resolve(data);
        }).catch(function (err) {
            reject("query returned 0 results"); return;
        });


    });
};

module.exports.getEmployeesByDepartment = function (department) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {departmentId: department}
        }).then(function (data) {
            data = data.map(x => x.dataValues);
            resolve(data);
        }).catch(function (err) {
            reject("query returned 0 results"); return;
        });


    });
};

module.exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var prop in employeeData) {
            if (employeeData[prop] == '')
                employeeData[prop] = null;
        }
         Employee.create({
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            hireDate: employeeData.hireDate
        }).then(function (data) {
            resolve(data);
        }).catch(function (err) {
            reject("unable to create employee", err); return;
        });

    });

};

module.exports.addDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {
        for (var prop in departmentData) {
            if (departmentData[prop] == '')
                departmentData[prop] = null;
        }
        Department.create({
            departmentName: departmentData.departmentName,
            departmentId:  departmentData.departmentId
        }).then(function (data) {
            resolve(data);
        }).catch(function (err) {
            reject("Unable to create department", err); return;
        })

    });
};

module.exports.updateDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {
        for (var prop in departmentData) {
            if (departmentData[prop] == '')
                departmentData[prop] = null;
        }
        Department.update({
            departmentName: departmentData.departmentName
        },{
            where: {departmentId: departmentData}
        }).then(function (data) {
            resolve(data);
        }).catch(function (err) {
            reject("unable to update department", err)
            return;
        })
    });
};

module.exports.deleteDepartmentById = function (id) {
    return new Promise(function (resolve, reject) {
        Department.destroy({
            where: { departmentId: id }
        }).then(function (data) {
            resolve(data);
        }).catch(function (err) {
            reject("Error encountered", err);
        })
    });
};

module.exports.updateEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var prop in employeeData) {
            if (employeeData[prop] == '')
                employeeData[prop] = null;
        }
        Employee.update({
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            hireDate: employeeData.hireDate
        },{
            where: {employeeNum: employeeData}
        }).then(function (data) {
            resolve(data);
        }).catch(function (err) {
            reject("unable to update employee", err)
            return;
        })
    });
};

module.exports.deleteEmployeeByNum = function (empNum) {
    return new Promise(function (resolve, reject) {
        Employee.destroy({
            where: { employeeNum: empNum }
        }).then(function (data) {
            resolve(data);
        }).catch(function (err) {
            reject("Error encountered", err);
        })
    });
}