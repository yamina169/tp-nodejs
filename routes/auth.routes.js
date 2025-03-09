const express = require('express');
const jwt = require('jsonwebtoken'); 
const User = require('../model/user');
const router = express.Router();

const authentication = require('../middlewares/authMiddleware');
router.post('/register', async (req, res) => {
    try{
        const {email,password} = req.body;
        const user = new User({email,password});
        await user.save();
        res.status(201).send({message: 'User created successfully',user});
    }catch(err){
        res.status(400).send({message:err.message});
    }
});

router.post('/login', async (req, res) => {
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).send({message:'user not found'});
        }
        const isHavePassword = await user.comparePassword(password);
        if(!isHavePassword){
            return res.status(400).send({message:'Invalid password'});
        }
        const token = jwt.sign({userId: user._id}, process.env.SECRETKEY);
        res.send({message:'User logged in successfully', token});
    }catch(err){
        res.status(400).send({message:err.message});
    }
});

// elli cncte
router.get('/me', authentication,async (req, res) => {
    try{
        const user = await User.findById(req.user.userId).select('-password');
        if(!user){
            return res.status(404).send({message:'User not found'});
        }
        res.send(user);
    }catch(err){
        res.status(500).send({message:err.message});
    }
});

module.exports = router;