-- Create employees_db database, and select this db for use
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

-- Create tables --
CREATE TABLE department ( 
    id INT  PRIMARY KEY AUTO_INCREMENT, name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(30), salary DECIMAL, department_id INT);

CREATE TABLE employee (id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(30), last_name VARCHAR(30), role_id INT, manager_id INT DEFAULT NULL);