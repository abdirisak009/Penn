const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // 1. Validate all required fields
        // if (!username || !email || !password || !confirmPassword) {
        //     return res.status(400).json({ message: 'All fields are required' });
        // }
        // if (password !== confirmPassword) {
        //     return res.status(400).json({ message: 'Passwords do not match' });
        // }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // 2. Check if email already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // 3. Hash the password
        // const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Save the user
        user = new User({
            username,
            email,
            password: hashedPassword
        });
        await user.save();

        // 5. Return success response
        return res.status(201).json({ message: 'Registration successful',password, hashedPassword});
    } catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        console.log("user",user)
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials11' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch,password,user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials22',isMatch,password,prev:user.password });
        }

        // Create token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 