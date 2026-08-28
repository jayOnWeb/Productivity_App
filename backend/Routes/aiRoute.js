const express = require('express');
const protect = require('../middleware/authMiddleware');
const {
  chatWithAI,
  breakdownTask,
  getAISuggestions,
  autoOrganizeTasks,
} = require('../controllers/aiController');

const router = express.Router();

router.post('/chat', protect, chatWithAI);
router.post('/breakdown', protect, breakdownTask);
router.post('/suggestions', protect, getAISuggestions);
router.post('/auto-organize', protect, autoOrganizeTasks);

module.exports = router;
