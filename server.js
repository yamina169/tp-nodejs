const express = require('express');
require('dotenv').config();
const AuthRoutes = require('./routes/auth.routes');
const mongoose = require('mongoose');
//mongoose houa ODM (Object Data Modeling) pour MongoDB
const app = express();
const userRoutes = require('./routes/user.routes');

app.use(express.json());
app.use('/auth', AuthRoutes);

app.use('/users', userRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB')
    }).catch((err) => {
        console.log('Failed to connect to MongoDB', err)
    });





app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});