let mysql = require("mysql");
//create a connection
let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "lollipop",
    database: "bamazon"
})
module.exports = {mysql, connection};