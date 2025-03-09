const express = require('express');
const User = require('../model/user');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send({ message: 'User created successfully', user });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            res.status(404).send({ message: "User not fouuund" });
        } else {
            res.send(user);
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});



module.exports = router;
