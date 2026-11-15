var mysql = require("mysql2");

var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "adev",
    database: "animal_database"
})

connection.connect(err=>{
    if (err) throw err;
    console.log("connected to db");
})

module.exports = connection;