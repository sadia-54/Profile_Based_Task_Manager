

const express = require('express');
const router = express.Router();
const connectDB = require('../database');
const { verifyToken, isAdmin } = require('../tokenAdminHandler');

router.get('/getTask', verifyToken, async (req, res) => {
    try {
        const userId = req.Email;
        const query = 'SELECT * FROM task WHERE User_ID = ?';
        connectDB.query(query, userId, (error, result) => {
            if (error) res.status(500).json("Failed");
            res.status(200).json({
                message: "Successfully get task",
                task: result
            })
        })
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});


router.get('/getAllTask', verifyToken, async (req, res) => {
    try {
        const userRole = req.User_Role;
        if (req.User_Role === "Admin") {
            const userId = req.Email;
            const query = 'SELECT * FROM task';
            connectDB.query(query, (error, result) => {
                if (error) res.status(500).json("Failed");
                res.status(200).json({
                    message: "Successfully get task",
                    task: result
                })
            })
        } else res.status(404).json("You are not an admin");

    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});


router.post('/addTask', verifyToken, async (req, res) => {
    try {
        const userId = req.Email;
        const { Title, Description, Status } = req.body;
        const query = 'INSERT INTO task (Title, Description, Status, User_ID) VALUES (?, ?, ?, ?)';
        await connectDB.query(query, [Title, Description, Status, userId]);

        res.status(201).json({ message: 'Task created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating task' });
    }
});


router.put('/updateTask/:Task_ID', verifyToken, async (req, res) => {
    try {
        const userId = req.Email; // Retrieve user ID from the authenticated user
        const taskId = req.params.Task_ID;

        const query = 'UPDATE task SET Title = ?, Description = ?, Status = ? WHERE Task_ID = ? AND User_ID = ?';
        const values = [
            req.body.Title,
            req.body.Description,
            req.body.Status,
            taskId,
            userId
        ]

        connectDB.query(query, values, (error, result) => {
            if (error) res.status(500).json("Failed");
            res.status(200).json({
                message: "Successfully Updated"
            })
        })

    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Error updating task' });
    }
});

router.delete('/tasks/:Task_ID', verifyToken, isAdmin, async (req, res) => {
    try {
        const taskId = req.params.Task_ID;
        const query = 'DELETE FROM task WHERE Task_ID = ?';
        await connectDB.query(query, [taskId]);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Error deleting task' });
    }
});


router.delete('/deleteTask/:Task_ID', verifyToken, async (req, res) => {
    try {
        const userId = req.Email;
        const taskId = req.params.Task_ID;
        const query = 'DELETE FROM task WHERE Task_ID = ? AND User_ID = ?';
        const values = [
            taskId,
            userId
        ]

        connectDB.query(query, values, (error, result) => {
            if (error) res.status(500).json("Failed");
            res.status(200).json({
                message: "Successfully deleted",
                result: result
            })
        })
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Error deleting task' });
    }
});

module.exports = router;