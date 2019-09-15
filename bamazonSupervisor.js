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

//* Allow 'supervisor' to add a department
function addDepartment() {
  var sql = "SELECT * FROM departments";
  connection.query(sql, function (err, res){
    if (err) throw err;
    console.log(res[2].department_name)

    inquirer.prompt([
      {
        type: "input",
        name: "departName",
        message: "What department do you want to add?",
        validate: function(input) {
          for (var d = 0; d < res.length; d++) {
            if (input === res[d].department_name) {
              return "Department already exists";
            }
          };
          return true;
        },
      },
      {
        type: "input",
        name: "overHead",
        message: "What are the overhead costs?",
        validate: function(input) {
          if (isNaN(input)) {
            return "Please Enter a Number";
          }
          return true;
        }
      }
    ]).then(function(ans) {
      var sql = "INSERT INTO departments SET department_name = ?, over_head_costs = ?";
      connection.query(sql, [ans.departName, ans.overHead], function(err, res) {
        if (err) throw err;
        console.log("\n==================================\n");
        console.log(colors.grey("Adding department..."))
        console.log(colors.green(ans.departName + " has been added!"));
        console.log("\n==================================\n");
        promptSupList();
      })
    });
  });
};

function endSup() {
  connection.end();
}
