var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");
var colors = require("colors");

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
    buyProduct();
  })
}

//* Prompt the user what item to buy and how many
function buyProduct() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    inquirer.prompt([
      {
        type: "rawlist",
        name: "whatItem",
        message: "What item you want to buy?",
        choices: function(){
          for (var i = 0; i < res.length; i++) {
            choiceArr.push(res[i].product_name);
          }
          return choiceArr;
        }
      },
      {
        type: "number",
        name: "howMany",
        message: "How many do you want to buy?"
      },
    ]).then(function(ans){
      var chosenItem;
      for (var i = 0; i < res.length; i++) {
        if (res[i].product_name === ans.whatItem) {
          chosenItem = res[i]
        }
      }

      if (chosenItem.stock_quantity > parseInt(ans.howMany)) {
        var quaLeft = chosenItem.stock_quantity - parseInt(ans.howMany);
        var sql = "UPDATE products SET stock_quantity = ? WHERE product_name = ?"
        connection.query(sql, [quaLeft, chosenItem.product_name], function (err, res) {
          if (err) throw err;
          var total = chosenItem.price * parseInt(ans.howMany)
          console.log("\n==================================\n");
          console.log(colors.grey(ans.howMany + " " + chosenItem.product_name + " at $" + chosenItem.price + " each..."))
          console.log(colors.green("Your total is: $" + total));
          console.log("\n==================================\n");
          keepShopping();
        })
      }
      else {
        console.log("\n==================================\n");
        console.log("Not enough in stock".red);
        console.log("\n==================================\n");
        keepShopping();
      }
    });
  });
}

function keepShopping() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "shopping",
        message: "Do you want to keep shopping?",
        default: true
      }
    ]).then(function(ans){
      if (ans.shopping) {
        buyProduct()
      }
      else {
        console.log("\n==================================\n");
        console.log("Thank you. Come again soon".green);
        console.log("\n==================================\n");
        connection.end();
      }
    })
}
