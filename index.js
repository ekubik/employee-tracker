//import modules
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");

const {
  addDepartmentQuestions,
  addNewRoleQuestions,
} = require("./utils/EMSquestions");

require("dotenv").config();

//connect to database - using environmental variables

const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log("You are now connected to employee_db database")
);

init = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Please select an option from the actions listed below.",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Quit application",
      ],
    })
    .then((response) => {
      switch (response.action) {
        case "View all departments":
          viewAllDepartments();
          break;

        case "View all roles":
          viewAllRoles();
          break;

        case "View all employees":
          viewAllEmployees();
          break;

        case "Add a department":
          addADepartment();
          break;

        case "Add a role":
          addANewRole();
          break;

        case "Quit application":
          console.log(
            "Thank you for using the Employee Management System. Goodbye :)"
          );
          db.end();
          break;
      }
    });
};

const viewAllDepartments = () => {
  db.query("SELECT * FROM department", (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    init();
  });
};

const viewAllRoles = () => {
  db.query("SELECT * FROM role", (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    init();
  });
};


const addADepartment = () => {
  inquirer.prompt([addDepartmentQuestions]).then((results) => {
    const data = results.name;
    db.query(
      `INSERT INTO department (name) VALUES ("${data}")`,
      (error, result) => {
        if (error) {
          console.log(error);
        }
        console.log(`${data} has now been added to the database`);
        init();
      }
    );
  });
};

const addANewRole = () => {
  inquirer.prompt(addNewRoleQuestions).then((results) => {
    // const data = [results.name, results.salary, results.department_id];
    db.query(
      `INSERT INTO role(title, salary, department_id) VALUES ("${results.title}", "${results.salary}", "${results.department_id}")`,
      (error, results) => {
        if (error) {
          console.log(error);
        }
        console.log(`${results.title} has now been added to the database`);
        init();
      }
    );
  });
};

const viewAllEmployees = () => {
  db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    init();
  });
}

init();

//inquirer.prompt(addNewRoleQuestions);
