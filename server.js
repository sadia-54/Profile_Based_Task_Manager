const express = require('express');
const app = express();
const mysql = require('mysql');    //import mysql
const jwt = require('jsonwebtoken');   //import jsonwebtoken
const bcrypt = require('bcrypt');     //import bcrypt
const dotenv = require('dotenv');     //import dotenv
const port = 3002;   


//connection to mysql database named task_manager_crud_app
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

//using middleware for parsing json requests
app.use(express.json());

dotenv.config();

//Create a new user profile
app.post('/user', (req, res) => {
  const { Username, Email, Password, User_Role } = req.body;
  const sql = 'INSERT INTO user (Username, Email, Password, User_Role) VALUES (?, ?, ?, ?)';
  connection.query(sql, [Username, Email, Password, User_Role], (err, result) => {
    if (err) {
      console.error('Error creating new user profile:', err);
      res.status(404).json({ error: 'Internal Server Error' });
      return;
    }
    // here User_ID is auto incremented
    res.status(200).json({ User_ID: result.insertId, Username, Email, Password, User_Role });
  });
});

// Get all of the user profiles
app.get('/user', (req, res) => {
  const sql = 'SELECT * FROM user';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching user profiles:', err);
      res.status(404).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

// Update a user profile by user id
app.put('/user/:User_ID', (req, res) => {
  const userId = req.params.User_ID;
  const { Username, Email, Password, User_Role } = req.body;
  const sql = 'UPDATE user SET Username = ?, Email = ?, Password = ?, User_Role = ? WHERE User_ID = ?';
  connection.query(sql, [Username, Email, Password, User_Role, userId], (err, result) => {
    if (err) {
      console.error('Error updating user profile:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ User_ID: userId, Username, Email, Password, User_Role});
  });
});

// Delete a user profile by user id
app.delete('/user/:User_ID', (req, res) => {
  const userId = req.params.User_ID;
  const sql = 'DELETE FROM user WHERE User_ID = ?';
  connection.query(sql, userId, (err, result) => {
    if (err) {
      console.error('Error deleting user profile:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'user not found' });
      return;
    }
    res.status(200).end();
  });
});

// Create a new task
app.post('/task', (req, res) => {
    const { Title, Description, Status, User_ID } = req.body;
    const sql = 'INSERT INTO task (Title, Description, Status, User_ID) VALUES (?, ?, ?, ?)';
    connection.query(sql, [Title, Description, Status, User_ID], (err, result) => {
      if (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      // here Task_ID is auto incremented
      res.status(200).json({ Task_ID: result.insertId, Title, Description, Status, User_ID });
    });
  });

// Get all of the tasks
app.get('/task', (req, res) => {
    const sql = 'SELECT * FROM task';
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching task:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(results);
    });
  });



// Update a task by task ID
app.put('/task/:Task_ID', (req, res) => {
    const taskId = req.params.Task_ID;
    const { Title, Description, Status, User_ID } = req.body;
    const sql = 'UPDATE task SET Title = ?, Description = ?, Status = ?, User_ID = ? WHERE Task_ID = ?';
    connection.query(sql, [Title, Description, Status, User_ID, taskId], (err, result) => {
      if (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.json({ Task_ID: taskId, Title, Description, Status, User_ID });
    });
  });


// Delete a task by ID
app.delete('/task/:Task_ID', (req, res) => {
    const taskId = req.params.Task_ID;
    const sql = 'DELETE FROM task WHERE Task_ID = ?';
    connection.query(sql, taskId, (err, result) => {
      if (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.status(200).end();
    });
  });

// run server
app.listen(port, () => {
    console.log('Server is running on port 3002');
});