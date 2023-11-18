const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Pin = require('../models/Pin'); // Adjust the path as per your project structure

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB size limit
});

// POST request to /pin-creation-tool/ to create a new pin
router.post('/pin-creation-tool/', 
    upload.single('image'), // Use multer middleware to handle the image file
    [
        // Validation middleware

        // body('title').isString(),
        // body('description').isString(),
        // body('user').isString(), // Assuming user is a string ID
        // body('tags').optional().isArray(),
        // body('board').optional().isString(),
    ],
    async (req, res) => {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
        // }

        try {
            // Extract pin data from request body
            const { title, description, user, tags } = req.body;
            let { board } = req.body;
            const image = req.file.path; // Get the path of the uploaded file

            // Set board to null if it is an empty string
        if (board === '') {
            board = null;
        }

            // Create a new pin
            const newPin = new Pin({
                title,
                description,
                image, // Use the file path saved by multer
                user,
                tags,
                // board,
                // ...(board !== null && { board })
                ...(board && { board })
            });

            // Save the pin to the database
            const savedPin = await newPin.save();

            // Send a success response
            res.status(201).json(savedPin);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

module.exports = router;
