const mysql = require('mysql');

const connection= mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'task_manager_crud_app'
});

connection.connect(function(err){
    if(err) throw err;
    console.log('Connected');

});

module.exports = connection;