-- delete database so we can work with a clean copy
DROP DATABASE IF EXISTS bamazon;

-- create database
CREATE DATABASE bamazon;

-- direct workbench to work with this database
USE bamazon;

-- create table
-- TODO: Create a separate departments table and a junction table, as some products exist in multiple departments.
CREATE TABLE products (
	item_id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_name VARCHAR(45) NOT NULL,
    department_name VARCHAR(45) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    stock_quantity INT(11)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES	("Rubik's Cube", "Games", 7.00, 362),
			("Rubber Duck", "Coding Tools", 1.00, 1000),
            ("D&D Player's Handbook", "Psychological Crutches", 50, 47),
            ("3-Hole Punch", "Office Supplies", 10.00, 137),
            ("La Croix - Pamplemousse, 12-pack", "Life Requirements", 6.00, 2),
            ("Trail Mix", "Life Requirements", 10, 69),
            ("Couch, 3-seat", "Furniture", 400, 100),
            ("Stapler", "Office Supplies", 8, 42),
            ("USB-A to Micro USB-B Cable, 2m", "Computer Parts", 20, 624),
            ("Mini Fridge", "Appliances", 100, 134),
            ("Tank Top", "Clothing", 5, 2000);

CREATE TABLE departments (
	department_id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    department_name VARCHAR(45) NOT NULL,
    over_head_costs DECIMAL(8, 2) NOT NULL
);

INSERT INTO departments (department_name, over_head_costs)
	VALUES	("Games", 100),
			("Coding Tools", 150),
            ("Psychological Crutches", 100),
            ("Office Supplies", 200),
            ("Life Requirements", 100),
            ("Furniture", 300),
            ("Appliances", 200),
            ("Clothing", 50);


SELECT * FROM products
