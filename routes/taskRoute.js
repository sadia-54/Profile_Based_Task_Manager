const express = require('express');
const router = express.Router();
const connectDB = require('../database');
const{verifyToken, isAdmin} = require('../tokenAdminHandler');

router.get('/getTask', verifyToken, async(req, res)=>{
    try{
        const userId = req.Email;
        const sql = 'SELECT * FROM task WHERE User_ID = ?';
        connectDB.query(sql, userId, (err, result)=>{
            if(err) res.status(404).json("Failed!");
            res.status(200).json({
                message: "Got Tasks Successfully.",
                task: result
            });
        });
    } catch(err){
        console.error('Error getting tasks:', err);
        res.status(404).json({ error: 'Error getting tasks!'});
    }
});


router.get('/getAllTask', verifyToken, async(req, res)=>{
    try{
        const userRole = req.User_Role;
        if(req.User_Role === "Admin")
            {
                const userId = req.Email;
                const sql = 'SELECT * FROM task';
                connectDB.query(sql, (err, result)=>{
                    if(err) res.status(404).json("Failed!");
                    res.status(200).json({
                        message: "Got Task Successfully",
                        task: result
                    });
                });
            } else res.status(404).json("Only Admins Can Get Access!");
        
            } catch(err){
                console.error('Error fetching tasks!', err);
                res.status(404).json({ error: 'Error fetching tasks!'});
            }
    });


router.post('/addTask', verifyToken, async(req, res)=>{
    try{
        const userId = req.Email;
        const{ Title, Description, Status} = req.body;
        const sql = 'INSERT INTO task (Title, Description, Status, User_ID) VALUES (?, ?, ?, ?)';
        await connectDB.query(sql, [Title, Description, Status, User_ID]);

        res.status(200).json({ message: 'New Task Has Created Successfully!'});

    }catch(err){
        res.status(404).json({error: 'Error Creating a New Task!'});
    }
});


router.put('/updateTask/:Task_ID', verifyToken, async(req, res)=>{
    try{
        const userId = req.Email;
        const taskId = req.params.Task_ID;
        const sql = 'UPDATE task SET Title = ?, Description = ?, Status = ? WHERE Task_ID = ? AND User_ID = ?';
        
        const values = 
        [
            req.body.Title,
            req.body.Description,
            req.body.Status,
            taskId,
            userId
        ]
        connectDB.query(sql, values, (err, result)=>{
            if(err) res.status(404).json("Failed!");
            res.status(200).json({message: "Task Successfully Updated!"});
        });
    } catch(err){
        console.error('Error Updating Task!', err);
        res.status(404).json({error: 'Error Updating Task!'});
    }
});


router.delete('/task/:Task_ID', verifyToken, isAdmin, async(req, res)=>{
    try{
        const taskId = req.params.Task_ID;
        const sql = 'DELETE FROM task WHERE Task_ID = ?';
        await connectDB.query(sql, [taskId]);

        res.status(200).json({message: 'Task Deleted Successfully'});
    } catch(err){
        console.error('Error deleting Task!', err);
        res.status(404).json({error: 'Error Deleting Task!'});
    }
});


router.delete('/deleteTask/:Task_ID', verifyToken, async(req, res)=>{
    try{
        const userId = req.Email;
        const taskId = req.params.Task_ID;
        const sql = 'DELETE FROM task WHERE Task_ID = ? AND User_ID = ?';
        const values = 
        [
            taskId,
            userId
        ]

        connectDB.query(sql, values, (err, result)=>{
            if(err) res.status(404).json("Failed!");
            res.status(200).json({
                message: "Successfully Deleted!",
                result: result
            });
        });
    } catch(err){
        console.error('Error Deleting Task!');
        res.status(404).json({error: 'Error Deleting Task!'});
    }
});

module.exports = router;