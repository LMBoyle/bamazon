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
  promptSupList();
});

// FUNCTIONS ========================================================================

//* Prompt 'supervisor' on what they want to do
function promptSupList() {
  inquirer.prompt([
    {
      type: "list",
      name: "whatToDo",
      message: "What would you like to do?",
      choices: ["View Product Sales by Department", "Create New Department", "Exit"]
    }
  ]).then(function(ans){
    switch (ans.whatToDo) {
      case "View Product Sales by Department":
        viewProductSales();
        break;
      case "Create New Department":
        addDepartment();
        break;
      case "Exit":
        endSup();
        break;
      default:
        endSup();
        break;
    };
  });
};

//* Show 'supervisor' a table of departments and costs/profits
function viewProductSales() {
  var sql = "SELECT department_id, departments.department_name, SUM(product_sales) AS product_sales, over_head_costs, ((SUM(product_sales)) - over_head_costs ) AS total_profit "; 
  sql += "FROM departments ";
  sql += "LEFT JOIN products "; 
  sql += "ON departments.department_name = products.department_name "; 
  sql += "GROUP BY departments.department_name";

  connection.query(sql, function (err, res) {
    if (err) throw err;
    console.table(res);
    promptSupList();
  })
}

function addDepartment() {

}

function endSup() {
  connection.end();
}
