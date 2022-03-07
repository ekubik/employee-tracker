-- Insert data into tables --

INSERT INTO department(name)
VALUES ("Financial"), ("Product Development"), ("Marketing"), ("Human Resources"), ("Management");

INSERT INTO role (title, salary, department_id)
VALUES ("Payroll Manager", 75000, 1),
("Junior Web Developer", 70000, 2),
("Human Resources Manager", 60000, 4),
("Team Leader", 90000, 5),
("Project Manager", 100000, 5),
("Accountant", 75000, 1),
("Senior Web Developer", 150000, 2),
("Data Analyst", 125000, 2),
("Social Media Manager", 65000, 3),
("PR Officer", 80000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mary", "Merryweather", 3, null),
("Erika", "Eriksson", 4, 8),
("John", "Johnson", 1, null),
("Eva", "Evans", 2, 2),
("Robert", "Robertson", 10, 10),
("Jakub", "Jacobs", 7, 3),
("Bill", "Williams", 8, 8),
("Jenna", "Jenkins", 5, null),
("Isabel", "Bell", 7, 3),
("Ella", "Ellison", 9, null);