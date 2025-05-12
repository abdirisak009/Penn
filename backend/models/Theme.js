const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Medical', 'SEO', 'Page Builder', 'E-commerce', 'Blog', 'Portfolio', 'Other']
    },
    version: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    downloadUrl: {
        type: String,
        required: true
    },
    previewUrl: {
        type: String
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Theme', themeSchema); 