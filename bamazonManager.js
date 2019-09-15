// VARIABLES ========================================================================

var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");
var colors = require("colors");

// DATABASE =========================================================================

//* Create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

//* Connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  promptList();
});

// FUNCTIONS ========================================================================

//* Prompt user on what they want to do
function promptList() {
  inquirer.prompt([
    {
      type: "list",
      name: "whatToDo",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }
  ]).then(function(ans){
    switch (ans.whatToDo) {
      case "View Products for Sale":
        viewProducts();
        break;
      case "View Low Inventory":
        viewInventory();
        break;
      case "Add to Inventory":
        addInventory();
        break;
      case "Add New Product":
        addProduct();
        break;
      case "Exit":
        end();
        break;
      default:
        end();
        break;
    }
  })
};

//* show all the products
function viewProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.table(res);
    promptList();
  })
}

// TODO show products with inventory lowers than 5
function viewInventory() {

}

// TODO allow user to add any amount of inventory to any product
function addInventory() {

}

// TODO allow user to add a new product
function addProduct() {

}

function end() {
  connection.end();
}