// VARIABLES ========================================================================

var inquirer = require("inquirer");
var consoleTable = require("console.table");
var colors = require("colors");

var departmentNames = [];

// DATABASE =========================================================================

var db = require("../db/bamazonDB");
var connection = db.dbConnection();

// FUNCTIONS ========================================================================
var manMethods = {
  //* Prompt 'manager' on what they want to do
  promptManList: function promptManList() {
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
          manMethods.viewProducts();
          break;
        case "View Low Inventory":
          manMethods.viewInventory();
          break;
        case "Add to Inventory":
          manMethods.addInventory();
          break;
        case "Add New Product":
          manMethods.pushDepartments();
          break;
        case "Exit":
          manMethods.manLogOff();
          break;
        default:
          manMethods.manLogOff();
          break;
      };
    });
  },

  //* Show all the products
  viewProducts: function viewProducts() {
    var sql = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products"
    connection.query(sql, function (err, res) {
      if (err) throw err;
      console.table(res);
      manMethods.promptManList();
    });
  },

  //* Show products with inventory lower than 5
  viewInventory: function viewInventory() {
    var sql = "SELECT * FROM products WHERE stock_quantity <=5";
    connection.query(sql, function (err, res) {
      if (err) throw err;
      console.table(res);
      manMethods.promptManList();
    });
  },

  //* Allow 'manager' to add any amount of inventory to any product
  addInventory: function addInventory() {
    var sql = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products"
    connection.query(sql, function (err, res) {
      if (err) throw err;

      inquirer.prompt([
        {
          type: "input",
          name: "whatItem",
          message: "What's the id of the item you want to update?",
          validate: function(input) {
            if (isNaN(input) || input == '') {
              return "Please Enter a Number";
            }
            return true
          }
        },
        {
          type: "input",
          name: "howMany",
          message: "How many do you want to add?",
          validate: function(input) {
            if (isNaN(input) || input == '') {
              return "Please Enter a Number";
            }
            return true
          }
        },
      ]).then(function(ans){
        var chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].item_id === parseInt(ans.whatItem)) {
            chosenItem = res[i]
          }
        }
        var quantity = chosenItem.stock_quantity + parseInt(ans.howMany);


        var sql = "UPDATE products SET stock_quantity = ? WHERE product_name = ?"
        connection.query(sql, [quantity, chosenItem.product_name], function (err, res) {
          if (err) throw err;
          console.log("\n==================================\n");
          console.log(colors.grey("Updating products..."))
          console.log(colors.green("You now have " + quantity + " " + chosenItem.product_name + "(s)"));
          console.log("\n==================================\n");
          manMethods.promptManList();
        });
      });
    });
  },

  //* Get name of departments from database to use in adding new product
  pushDepartments: function pushDepartments() {
    var sql =  "SELECT department_name FROM departments" 
    connection.query(sql, function (err, res) {
      if (err) throw err;

      for (var i = 0; i < res.length; i++) {
        departmentNames.push(res[i].department_name)
      }
    })
    manMethods.addProduct();
  },

  //* Allow 'manager' to add a new product
  addProduct: function addProduct() {
    inquirer.prompt([
      {
        type: "input",
        name: "productName",
        message: "What item do you want to add?",
        validate: function(input) {
          if (input == '') {
            return "Please Enter an Item";
          }
          return true
        }
      },
      {
        type: "list",
        name: "departName",
        message: "What department is it in?",
        choices: departmentNames,
      },
      {
        type: "input",
        name: "itemPrice",
        message: "How much does the item cost?",
        validate: function(input) {
          if (isNaN(input) || input == '') {
            return "Please Enter a Number";
          }
          return true
        }
      },
      {
        type: "input",
        name: "itemStock",
        message: "How many do you have in stock?",
        validate: function(input) {
          if (isNaN(input) || input == '') {
            return "Please Enter a Number";
          }
          return true
        }
      },
    ]).then(function(ans) {
      var sql = "INSERT INTO products SET product_name = ?, department_name = ?, price = ?, stock_quantity = ?";
      var answers = [ans.productName, ans.departName, ans.itemPrice, ans.itemStock];

      connection.query(sql, answers, function(err, res) {
        if (err) throw err;
        console.log("\n==================================\n");
        console.log(colors.grey("Adding product..."))
        console.log(colors.green(ans.productName + " has been added!"));
        console.log("\n==================================\n");
        manMethods.promptManList();
      });
    });
  },

  //* End connection
  manLogOff: function manLogOff() {
    console.log("\n==================================\n");
    console.log("Logging off".grey);
    console.log("\n==================================\n");
    connection.end();
    process.exit();
  }
}

module.exports = manMethods;