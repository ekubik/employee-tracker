//import modules
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");

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
        "Add a department",
        "Add a role",
        "Add an employee role",
        "Update an employee role",
        "Quit application",
      ],
    })
    .then((response) => {
      switch (response.action) {
        case "View all departments":
          viewAllDepartments();
          break;

        case "Quit application":
          console.log("Thank you for using the Employee Management System. Goodbye :)"
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

init();
