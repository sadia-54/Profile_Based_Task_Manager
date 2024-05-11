const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connectDB = require('../database');


// create a new account
router.post('/register', async (req, res) => {
    try {
        const { Username, Email, Password, User_Role } = req.body;
        console.log(Username);
        const hashedPassword = bcrypt.hashSync(Password, 10);
        const query = 'INSERT INTO user (Username, Email, Password, User_Role) VALUES (?, ?, ?, ?)';
        await connectDB.query(query, [Username, Email, hashedPassword, User_Role]);
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error occured in registering!', error);
        res.status(500).json({ error: 'Error occured while registering!' });
    }
});

//login to account
router.post('/login', async (req, res) => {
    try {
        const sql = "SELECT * FROM user WHERE Username = ?";
        const values = [req.body.Username]

        connectDB.query(sql, [values], async (err, result) => {
            if (err) return res.json("Error while login!");
            if (result.length > 0) {
                const isValid = await bcrypt.compare(req.body.Password, result[0].Password);
                if (isValid) {
                    const token = jwt.sign({
                       
                        Username: result[0].Username,
                        Email: result[0].Email,
                        User_Role : result[0].User_Role
                    }, process.env.ACCESS_TOKEN_SECRET, {
                        expiresIn: '1h'
                    });

                    return res.status(200).json({
                        authentication_token: token,
                        message: 'Login Successfully'
                    });
                } else {
                    return res.status(400).json("Login Failed");
                }
            } else return res.status(500).json("Login Failed");
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Login Failed' });
    }
})

//export the module
module.exports = router;