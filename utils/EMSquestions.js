const inquirer = require("inquirer");

const addDepartmentQuestions = {
     type: "input",
     name: "name",
     message: "Please enter the name of the new department",
 }

 const addNewRoleQuestions = [{
     type: "input",
     name: "title",
     message: "Please enter the name of the role you want to add to the database" 
 },
{type: "input",
name: "salary",
message: "Please enter the salary associated with this role"}, 
{ type: "input",
name: "department_id",
message: "Enter the department id"}];


module.exports = {addDepartmentQuestions, addNewRoleQuestions}