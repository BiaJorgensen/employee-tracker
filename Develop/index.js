// Importing Inquirer Package into file
const inquirer = require('inquirer');
// Importing mysql2
const mysql = require('mysql2');
// Importing console.table
require('console.table')

// Connecting to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'charlie',
      database: 'employees_db'
    }
);
// Questions to see what user would like to do
const options = {
    type: 'list',
    name: 'option',
    message: 'What would you like to do?',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
};
// Function to initialize main prompt
async function init() {
    const chosen = await inquirer.prompt(options)

        if (chosen.option === 'View all departments') {
            viewDepts(); 
        }
        if (chosen.option === 'View all roles') {
            viewRoles();
        }
        if (chosen.option === 'View all employees') {
            viewEmployees();
        }
        if (chosen.option === 'Add a department') {
            addDept();  
        }
        if (chosen.option === 'Add a role') {
            addRole(); 
        }
        if (chosen.option === 'Add an employee') {
            addEmployee();
        }
        if (chosen.option === 'Update an employee role') {
            updateEmployeeRole()
        }
        if (chosen.option === 'Exit') {
            console.log('Thank you!');
            process.exit()
        }
};
// Function to view all departments from db in table format
function viewDepts() {
    db.query('SELECT id, name FROM department', (err, results) => {
        if (err) throw err;
        console.log('\n DEPARTMENTS\n');
        console.table(results);
        init()
    })
};
// Function to view all role from db in table format
function viewRoles() {
    db.query(`SELECT role.id, role.title, department.name AS department, role.salary
            FROM role JOIN department ON role.department_id = department.id`, 
            (err, results) => {
                if (err) throw err;
                console.log('\n ROLES\n');
                console.table(results);
                init()
    })
};
// Function to view all employees from db in table format
function viewEmployees() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, 
            role.title, department.name AS department, role.salary, 
            CONCAT(manager.first_name," ",manager.last_name) AS manager
            FROM employee JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id`, 
            (err, results) => {
                if (err) throw err;
                console.log('\n ROLES\n');
                console.table(results);
                init()
            })
};
// Function to add new department to db in department table
async function addDept() {
    let newDept = await inquirer.prompt([
        {
            name: 'new_dept',
            type: 'input',
            message: 'What is the name of the department?'
        }
    ])
    db.query(`INSERT INTO department (name) VALUES (?)`, newDept.new_dept, (err,results) => {
        if (err) throw err;
                console.log(`\n Added ${newDept.new_dept} to the database\n`);
                init()
    })  
};
// Function to add new role to db in role table
async function addRole() {
    const dept_names = await showListOfDepts();
    let newRole = await inquirer.prompt([
        {
            name: 'new_role',
            type: 'input',
            message: 'What is the name of the role?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of the role? (numbers only)'
        },
        {
            name: 'department',
            type: 'list',
            message: 'Which department does the role belong to?',
            choices: dept_names
        }
    ])
    const deptID = await deptNameToID(newRole.department);
    const info = [newRole.new_role, newRole.salary, deptID];
    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, info, (err,results) => {
        if (err) throw err;
                console.log(`\n Added ${newRole.new_role} to the database\n`);
                init()
    })  
};
// Function to get departments names from department table
async function showListOfDepts() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT name FROM department`, (err,results) => {
            if (err) reject (err);
            else {
                const dept_names = results.map(depts => depts.name)
                resolve (dept_names)}
        });
    });
};
// Function to revert department name to id from department table
async function deptNameToID(dept_name) {
    return new Promise ((resolve, reject) => {
        db.query(`SELECT id FROM department WHERE name = (?)`, dept_name, (err,results) => {
            if (err) reject (err);
            else {
                const dept_id = results[0].id;
                resolve (dept_id)
            }
        })
    })
};
// Function to add a new employee
async function addEmployee() {
    const role_title = await showListOfRoles();
    const manager_name = await showListOfEmployees();
    let newEmployee = await inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: "What is the employee's first name?"
        },
        {
            name: 'last_name',
            type: 'input',
            message: "What is the employee's last name?"
        },
        {
            name: 'role',
            type: 'list',
            message: "What is the employee's role?",
            choices: role_title
        },
        {
            name: 'manager',
            type: 'list',
            message: "Who is the employee's manager?",
            choices: manager_name
        }
    ])
    const roleID = await roleTitleToID(newEmployee.role);
    const managerID = await employeeNameToID(newEmployee.manager);
    const info = [newEmployee.first_name, newEmployee.last_name, roleID, managerID]
    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, info, (err,results) => {
        if (err) throw err;
                console.log(`\n Added ${newEmployee.first_name} ${newEmployee.last_name} to the database\n`);
                init()
    })  
};
// Function to get roles titles from role table
async function showListOfRoles() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT title FROM role`, (err,results) => {
            if (err) reject (err);
            else {
                const role_title = results.map(roles => roles.title)
                resolve (role_title)}
        });
    });
};
// Function to revert role title to id from role table
async function roleTitleToID(role_title) {
    return new Promise ((resolve, reject) => {
        db.query(`SELECT id FROM role WHERE title = (?)`, role_title, (err,results) => {
            if (err) reject (err);
            else {
                const role_id = results[0].id;
                console.log(role_id)
                resolve (role_id)
            }
        })
    })
};
// Function to get full name of employees by concatenating first_name and last_name from employee table
async function showListOfEmployees() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT CONCAT(first_name," ",last_name) FROM employee`, (err,results) => {
            if (err) reject (err);
            else {
                const fullName = results.map(names => names['CONCAT(first_name," ",last_name)']);
                resolve (fullName)}
        });
    });
};
// Function to revert employee name to id from employee table
async function employeeNameToID(name) {
    return new Promise ((resolve, reject) => {
        const [first_name, last_name] = name.split(' ');
        db.query(`SELECT id FROM employee WHERE first_name = (?) AND last_name = (?)`, [first_name, last_name], (err,results) => {
            if (err) reject (err);
            else {
                const employee_id = results[0].id;
                resolve (employee_id)
            }
        })
    })
};
// Function to update existing's employee's role
async function updateEmployeeRole() {
    const employees_name = await showListOfEmployees();
    const role_title = await showListOfRoles();
    let updateRole = await inquirer.prompt([
        {
            name: 'name',
            type: 'list',
            message: "Which employe's role would you like to update?",
            choices: employees_name
        },
        {
            name: 'role',
            type: 'list',
            message: "Which role would you like to assign to the selected employee?",
            choices: role_title
        }
    ])
    const employeeID = await employeeNameToID(updateRole.name);
    const roleID = await roleTitleToID(updateRole.role);
    const info = [roleID, employeeID]
    db.query(`UPDATE employee SET role_id = (?) WHERE id = (?)`, info, (err,results) => {
        if (err) throw err;
                console.log(`\n Updated employee's role\n`);
                init()
    })  
};

init()


