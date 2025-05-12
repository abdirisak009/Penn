const express = require('express');
const router = express.Router();
const Theme = require('../models/Theme');
const auth = require('../middleware/auth');

// Get all themes
router.get('/', async (req, res) => {
    try {
        const themes = await Theme.find().sort({ createdAt: -1 });
        res.json(themes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single theme
router.get('/:id', async (req, res) => {
    try {
        const theme = await Theme.findById(req.params.id);
        if (!theme) {
            return res.status(404).json({ message: 'Theme not found' });
        }
        res.json(theme);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create theme
router.post('/', auth, async (req, res) => {
    try {
        const theme = new Theme(req.body);
        const savedTheme = await theme.save();
        res.status(201).json(savedTheme);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update theme
router.put('/:id', auth, async (req, res) => {
    try {
        const theme = await Theme.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!theme) {
            return res.status(404).json({ message: 'Theme not found' });
        }
        res.json(theme);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete theme
router.delete('/:id', auth, async (req, res) => {
    try {
        const theme = await Theme.findByIdAndDelete(req.params.id);
        if (!theme) {
            return res.status(404).json({ message: 'Theme not found' });
        }
        res.json({ message: 'Theme deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 