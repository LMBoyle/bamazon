DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES
	("Dry Erase Markers", "Office", 7.99, 100),
	("Blender", "Kitchen", 67.99, 8),
	("Sports Wireless Earbuds", "Electronics", 23.79, 30),
	("Hammock With Stand", "Garden", 76.49, 73),
	("Men's Leather Belt", "Clothing", 13.99, 2),
  ("Down Comforter", "Bedroom", 34.99, 67),
  ("Measuring Cups", "Kitchen", 21.99, 68),
  ("Computer Desk", "Office", 123.00, 5),
  ("Gym Bag", "Sports", 23.99, 37),
  ("Czech Games Codenames", "Games", 16.68, 76);
	
