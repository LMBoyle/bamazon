var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table")

var choiceArr = [];

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
  makeTable();
});

//* Get data from database and make table
function makeTable() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.table(res);

    for (var i = 0; i < res.length; i++) {
      choiceArr.push(res[i].product_name);
    }

    buyProduct();
  })
}

// Prompt the user what item to buy and how many
function buyProduct() {
  inquirer.prompt([
    {
      type: "rawlist",
      name: "whatItem",
      message: "What item you want to buy?",
      choices: choiceArr
    },
    {
      type: "number",
      name: "howMany",
      message: "How many do you want to buy?"
    },
  ]).then(function(ans){
    console.log(ans.whatItem);
    console.log(ans.howMany);
    connection.end();
  });
}
