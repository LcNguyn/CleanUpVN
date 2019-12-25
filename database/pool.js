const mysql = require("mysql")

const   pool        = mysql.createPool({
        connectionLimit : 10, // default = 10
        host            : 'localhost',
        user            : 'root',
        password        : 'Wilny28121999',
        database        : 'sakila'
});

module.exports = pool
