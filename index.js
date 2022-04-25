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

//user presented with list of questions
init = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Welcome to the Employee Management Sytem. Please select an option from the actions listed below.",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Delete a department",
        "Add a role",
        "Add an employee",
        "Delete an employee",
        "Update an employee role",
        "Update an employee's manager",
        "Quit application",
      ],
    })
    //depending on user response, implement different function
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
        
        case "Delete a department":
          deleteDepartment();
          break;

        case "Add a role":
          addANewRole();
          break;

        case "Add an employee":
          addAnEmployee();
          break;

        case "Update an employee role":
          updateEmployeeRole();
          break;
        
        case "Update an employee's manager": 
        updateEmployeeManager();
        break;

        case "Delete an employee":
          deleteEmployee();
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
  db.query(
    "SELECT role.title, role.salary, department.name AS department FROM role JOIN department on role.department_id = department.id",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.table(result);
      init();
    }
  );
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
  db.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee m RIGHT JOIN employee ON m.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.table(result);
      init();
    }
  );
};

const addAnEmployee = () => {
  db.query(`SELECT * FROM role`, async (err, result) => {
    if (err) {
      console.log(err);
    }
    let role = result.map((role) => ({ name: role.title, value: role.id }));
    db.query(`SELECT * FROM employee`, async (err, result) => {
      if (err) {
        console.log(err);
      }
      let manager = result.map((employee) => ({
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      }));
      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "Please enter the employee's first name.",
          },
          {
            name: "last_name",
            type: "input",
            message: "Please enter the new employee's last name.",
          },
          {
            name: "title",
            type: "rawlist",
            message: "Please select the employee's job title.",
            choices: role,
          },
          {
            name: "employee_manager",
            type: "rawlist",
            message: "Please select the manager for this employee.",
            choices: manager,
          },
        ])
        .then((response) => {
          db.query(
            `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("${response.first_name}", "${response.last_name}", "${response.title}", "${response.employee_manager}")`,
            (err, result) => {
              if (err) {
                console.log(err);
              }
              console.log(
                `New employee has been succesfully added to the system`
              );
              init();
            }
          );
        });
    });
  });
};

const updateEmployeeRole = () => {
  db.query(`SELECT * FROM employee`, async (err, result) => {
    if (err) {
      console.log(err);
    }
    let employee = result.map((employee) => ({
      name: employee.first_name + " " + employee.last_name,
      value: employee.id,
    }));
    db.query(`SELECT * FROM role`, async (err, result) => {
      if (err) {
        console.log(err);
      }
      let role = result.map((role) => ({ name: role.title, value: role.id }));
      inquirer
        .prompt([
          {
            name: "employee",
            type: "rawlist",
            message: "Select an employee to update.",
            choices: employee,
          },
          {
            name: "new_role",
            type: "rawlist",
            message: "What is this employee's new role?",
            choices: role,
          },
        ])
        .then((response) => {
          db.query(
            `UPDATE employee SET ? WHERE ?`,
            [{ role_id: response.new_role }, { id: response.employee }],
            (err, result) => {
              if (err) {
                console.log(err);
              }
              console.log("Employee has been successfully updated");
              init();
            }
          );
        });
    });
  });
};

const deleteEmployee = () => {
  db.query(`SELECT * FROM employee`, async (err, result) => {
    if (err) {
      console.log(err);
    }
    let employee = result.map((employee) => ({
      name: employee.first_name + " " + employee.last_name,
      value: employee.id,
    }));
    inquirer
      .prompt([
        {
          name: "employee",
          type: "rawlist",
          message: "Select the employee you would like to delete.",
          choices: employee,
        },
      ])
      .then((response) => {
        db.query(
          "DELETE FROM employee WHERE ?",
          [{ id: response.employee }],
          (err, result) => {
            if (err) {
              console.log(err);
            }
            console.log("Employee has been removed from the system");
            init();
          }
        );
      });
  });
};


const updateEmployeeManager = () => {
  db.query(`SELECT * FROM employee`, async (err, result) => {
    if (err) {
      console.log(err);
    }
    let employee = result.map((employee) => ({
      name: employee.first_name + " " + employee.last_name,
      value: employee.id,
    }));
    db.query(`SELECT * FROM employee`, async (err, result) => {
      if (err) {
        console.log(err);
      }
      let manager = result.map((employee) => ({ name: employee.first_name + " " + employee.last_name, value: employee.id }));
      inquirer
        .prompt([
          {
            name: "employee",
            type: "rawlist",
            message: "Select an employee to update.",
            choices: employee,
          },
          {
            name: "manager",
            type: "rawlist",
            message: "Select this employee's manager.",
            choices: manager,
          },
        ])
        .then((response) => {
          db.query(
            `UPDATE employee SET ? WHERE ?`,
            [{ manager_id: response.manager }, { id: response.employee }],
            (err, result) => {
              if (err) {
                console.log(err);
              }
              console.log("Employee has been successfully updated");
              init();
            }
          );
        });
    });
  });
};


const deleteDepartment = () => {
  db.query(`SELECT * FROM department`, async (err, result) => {
    if (err) {
      console.log(err);
    }
    let department = result.map((department) => ({
      name: department.name,
      value: department.id,
    }));
    inquirer
      .prompt([
        {
          name: "department",
          type: "rawlist",
          message: "Select the department you would like to delete.",
          choices: department
        },
      ])
      .then((response) => {
        db.query(
          "DELETE FROM department WHERE ?",
          [{ id: response.department }],
          (err, result) => {
            if (err) {
              console.log(err);
            }
            console.log("Department has been removed from the system");
            init();
          }
        );
      });
  });
};

init();
