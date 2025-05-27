require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./lib/logger').logger;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const connectDB = require('./config/db');
connectDB();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

app.get('/', (req, res) => {
    if (req.accepts('html')) {
        res.sendFile(__dirname + '/public/index.html');
        return;
    }else if (req.accepts('json')) {
        res.json({ message: 'Welcome to the Task Management API' });
        return;
    } else {
        res.type('txt').send('Welcome to the Task Management API');
    }
});

app.get('/register', (req, res) => {
    if (req.accepts('html')) {
        res.sendFile(__dirname + '/public/register.html');
        return;
    } else if (req.accepts('json')) {
        res.json({ message: 'Register endpoint' });
        return;
    } else {
        res.type('txt').send('Register endpoint');
    }
});

app.get('/login', (req, res) => {
    if (req.accepts('html')) {
        res.sendFile(__dirname + '/public/login.html');
        return;
    } else if (req.accepts('json')) {
        res.json({ message: 'Login endpoint' });
        return;
    } else {
        res.type('txt').send('Login endpoint');
    }
});

app.get('/tasks', (req, res) => {
    if (req.accepts('html')) {
        res.sendFile(__dirname + '/public/tasks.html');
        return;
    } else if (req.accepts('json')) {
        res.json({ message: 'Tasks endpoint' });
        return;
    } else {
        res.type('txt').send('Tasks endpoint');
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));