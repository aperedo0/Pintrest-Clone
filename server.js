console.log("==== SERVER.JS STARTING ====");
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const User = require('./src/models/User');
const pinRoutes = require('./src/routes/pinRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

const cors = require('cors');

const jwt = require('jsonwebtoken'); 
const jwtSecret = process.env.SECRET_KEY
console.log(process.env.SECRET_KEY);


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cors({
    origin: ['http://localhost:3000', 'https://pintrest-clone-dusky.vercel.app/'], 
    credentials: true,
}));
  

app.use('/', pinRoutes);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
// app.use('/uploads', express.static(path.join(__dirname, '..', '/uploads')));



// Passport Configuration
// require('./src/config/passportConfig')(passport);

// Routes (this is a basic structure, you'll want to expand on this with your actual routes)

app.post('/login', async (req, res) => {
    let user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.json({ success: false, message: 'Username not found' });
    }

    const isValid = await user.isValidPassword(req.body.password);
    if (!isValid) {
        return res.json({ success: false, message: 'Invalid password' });
    }

    // Successful login logic, perhaps generating JWT or setting a session
    res.json({ success: true, message: 'Logged in successfully', user: { ...user._doc, password: undefined } });
});

app.post('/signup', async (req, res, next) => {
    try {
        const { username, email, password, birthdate } = req.body;

        // Check for existing users
        const existingUser = await User.findOne({ $or: [{username}, {email}] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username or email already exists' });
        }
        
        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            birthdate
        });

        await user.save();

        // Generate JWT token here if applicable

        res.json({ success: true, message: "Signup successful", user: { ...user._doc, password: undefined } });

    } catch (err) {
        if (err.name === 'ValidationError') {
            err.statusCode = 400; // Set specific status code for validation errors
        }
        next(err); // Passes the error to the error handling middleware
    }
});

app.get('/checkAuth', (req, res) => {
    // Check if user is authenticated and return some data about it
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true, user: req.user });
    } else {
        res.json({ isAuthenticated: false });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err); // Log the error
    // Determine if it's an operational error and set a statusCode accordingly
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Something went wrong on the server';
    
    // Respond with the status code and the error message
    res.status(statusCode).json({ success: false, error: message });
});

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
