var mysql = require("mysql");

// DATABASE =========================================================================
//* Create the connection information for the sql database
var connection;

module.exports ={
  dbConnection : function () {
    connection = mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "root",
      database: "bamazon"
    });
    //* Connect to the mysql server and sql database
    connection.connect(function(err) {
      if (err) throw err;
    });
    return connection;
  },
}