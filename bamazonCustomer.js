var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table")

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  prompt();
});

var table = function() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.table(res)
  })
}

function prompt() {
  console.log(table())
}

prompt()