const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addCard, getCards, updateCard, deleteCard } = require('../controllers/cardController');

// Protect all routes with authentication middleware
router.post('/add-card', protect, addCard);
router.get('/cards', protect, getCards);
router.put('/update-card/:cardId', protect, updateCard);
router.delete('/delete-card/:cardId', protect, deleteCard);

module.exports = router;