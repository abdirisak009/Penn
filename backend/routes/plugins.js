const express = require('express');
const router = express.Router();
const Plugin = require('../models/Plugin');
const auth = require('../middleware/auth');

// Get all plugins
router.get('/', async (req, res) => {
    try {
        const plugins = await Plugin.find().sort({ createdAt: -1 });
        res.json(plugins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single plugin
router.get('/:id', async (req, res) => {
    try {
        const plugin = await Plugin.findById(req.params.id);
        if (!plugin) {
            return res.status(404).json({ message: 'Plugin not found' });
        }
        res.json(plugin);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create plugin
router.post('/', auth, async (req, res) => {
    try {
        const plugin = new Plugin(req.body);
        const savedPlugin = await plugin.save();
        res.status(201).json(savedPlugin);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update plugin
router.put('/:id', auth, async (req, res) => {
    try {
        const plugin = await Plugin.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!plugin) {
            return res.status(404).json({ message: 'Plugin not found' });
        }
        res.json(plugin);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete plugin
router.delete('/:id', auth, async (req, res) => {
    try {
        const plugin = await Plugin.findByIdAndDelete(req.params.id);
        if (!plugin) {
            return res.status(404).json({ message: 'Plugin not found' });
        }
        res.json({ message: 'Plugin deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 