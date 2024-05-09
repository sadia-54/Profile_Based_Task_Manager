const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connectDB = require('../database');  //database connection

//Create a new user profile
router.post('/register', async (req, res) => {
  try{  
    const { Username, Email, Password, User_Role } = req.body;
    console.log(Username);
    const hashedPasword = bcrypt.hashSync(Password, 20);
    const sql = 'INSERT INTO user (Username, Email, Password, User_Role) VALUES (?, ?, ?, ?)';
    await connectDB.query(sql, [Username, Email, Password, User_Role]);
    res.json({ message: 'User Has Registered Successfully!'});

  }catch(err){
        console.error('Error to register a new user', err);
        res.status(404).json({ error: 'Error occuring while registering!' });
      }
//       // here User_ID is auto incremented
//       res.status(200).json({ User_ID: result.insertId, Username, Email, Password, User_Role });
//     });
  });
  
  // login into user profile
  router.post('/login', (req, res) => {
    try{
       const sql = "SELECT * FROM user WHERE Username = ?";
       const value = [req.body.Username];

       connectDB.query(sql, [value], async (err, results) => {
           if (err) {
               return res.json("Error while login!");

               if(results.length>0){
                const isValid = await bcrypt.compare(req.body.Password, results[0].Password);
                if(isValid)
                  {
                    const tkn = jwt.sign(
                      {
                        Email: results[0].Email,
                        Username: results[0].Username,
                        User_Role: results[0].User_Role
                      }, process.env.ACCESS_TOKEN_SECRET, 
                      {
                        expiresIn: '3h'
                      });

                      return res.status(200).json({
                        authentication_token: tkn,
                        message: 'Login Successful!'
                      });
                  } else{
                    return res.status(404).json('Login Failed!');
                  }
                } else return res.status(400).json('Login Failed!');
              }
    });

} catch(err){
  console.log(err);
  res.status(404).json({err: 'Login Failed!'});
}
  });


  
  // Update a user profile by user id
  // app.put('/user/:User_ID', (req, res) => {
  //   const userId = req.params.User_ID;
  //   const { Username, Email, Password, User_Role } = req.body;
  //   const sql = 'UPDATE user SET Username = ?, Email = ?, Password = ?, User_Role = ? WHERE User_ID = ?';
  //   connection.query(sql, [Username, Email, Password, User_Role, userId], (err, result) => {
  //     if (err) {
  //       console.error('Error updating user profile:', err);
  //       res.status(500).json({ error: 'Internal Server Error' });
  //       return;
  //     }
  //     if (result.affectedRows === 0) {
  //       res.status(404).json({ error: 'User not found' });
  //       return;
  //     }
  //     res.json({ User_ID: userId, Username, Email, Password, User_Role});
  //   });
  // });
  
  // // Delete a user profile by user id
  // app.delete('/user/:User_ID', (req, res) => {
  //   const userId = req.params.User_ID;
  //   const sql = 'DELETE FROM user WHERE User_ID = ?';
  //   connection.query(sql, userId, (err, result) => {
  //     if (err) {
  //       console.error('Error deleting user profile:', err);
  //       res.status(500).json({ error: 'Internal Server Error' });
  //       return;
  //     }
  //     if (result.affectedRows === 0) {
  //       res.status(404).json({ error: 'user not found' });
  //       return;
  //     }
  //     res.status(200).end();
  //   });
  // });


  module.exports = router;