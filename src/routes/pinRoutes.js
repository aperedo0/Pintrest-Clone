const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Pin = require('../models/Pin');
const Board = require('../models/Board');
const fs = require('fs');
const { default: userEvent } = require('@testing-library/user-event');

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
        // body('board').optional().custom((value) => !value || checkObjectId.isValid(value)),
    ],
    async (req, res) => {

        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
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
        // else if (board && !mongoose.Types.ObjectId.isValid(board)) {
        //     return res.status(400).json({ message: 'Invalid board ID' });
        // }

            // Create a new pin
            const newPin = new Pin({
                title,
                description,
                image, // Use the file path saved by multer
                user,
                tags,
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

// POST route to create a new board with optional pins
router.post('/boards', async (req, res) => {
    try {
        // Extract board information from request body
        const { name, description, userId, pins } = req.body;

        // Validate input (ensure name and userId are provided)
        if (!name || !userId) {
            return res.status(400).json({ message: "Name and user ID are required." });
        }

        // Create a new board instance
        const newBoard = new Board({
            name,
            description,
            user: userId,
            pins: pins || [] // Include pins if provided, otherwise default to an empty array
        });

        // Save the new board to the database
        const savedBoard = await newBoard.save();

        // Send a success response with the saved board
        res.status(201).json(savedBoard);
    } catch (error) {
        // Send an error response
        res.status(500).json({ message: error.message });
    }
});


// GET request to fetch pins of a specific user
router.get('/user-pins/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const pins = await Pin.find({ user: userId });
        res.json(pins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// // In your server-side routes file
// router.get('/user-boards/:userId', async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         const boards = await Board.find({ user: userId });
//         res.json(boards);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

router.get('/user-boards/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const boards = await Board.find({ user: userId }).populate('pins');
        
        const boardsWithLastPinImage = await Promise.all(boards.map(async (board) => {
            let lastPinImage = '/path/to/default/gray/image.png'; // Default image if no pins
            if (board.pins.length > 0) {
                const lastPin = await Pin.findOne({ _id: { $in: board.pins } }).sort({ createdAt: -1 });
                lastPinImage = lastPin ? lastPin.image : lastPinImage;
            }
            return { ...board.toObject(), lastPinImage };
        }));

        res.json(boardsWithLastPinImage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.delete('/delete-pin/:pinId', async (req, res) => {
    try {
        const pin = await Pin.findById(req.params.pinId);
        if (!pin) {
            return res.status(404).json({ message: 'Pin not found' });
        }
        // const imagePath = path.join(__dirname, '..', 'uploads', path.basename(pin.image));
        const imagePath = path.join(__dirname, '..', '..', 'uploads', path.basename(pin.image));
        fs.unlink(imagePath, async (err) => {
            if (err) {
                console.error('Failed to delete the image file:', err);
                return res.status(500).json({ message: 'Failed to delete the image file' });
            }
            await Pin.findByIdAndDelete(req.params.pinId);

            console.log('Pin and image deleted successfully');
            res.status(200).json({ message: 'Pin and image deleted successfully' });
        });
    } catch (error) {
        console.error('Server error during pin deletion:', error);
        res.status(500).json({ message: 'Server error during pin deletion' });
    }
});


// GET request to fetch a specific pin by its ID
router.get('/pin/:pinId', async (req, res) => {
    try {
        const pinId = req.params.pinId; // Extract the pin ID from the URL
        const pin = await Pin.findById(pinId); // Fetch the pin from the database using its ID

        if (!pin) {
            return res.status(404).json({ message: 'Pin not found' }); // Return a 404 error if the pin doesn't exist
        }

        res.json(pin); // Send the found pin as a response
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pin' }); // Handle any errors
    }
});


module.exports = router;
