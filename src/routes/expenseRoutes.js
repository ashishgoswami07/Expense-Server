const express = require('express');
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.post('/add', expenseController.addExpense);
router.get('/:groupId', expenseController.getExpensesByGroup);
router.get('/:groupId/balances', expenseController.getGroupBalances);
router.post('/:groupId/settle', expenseController.settleGroup);

module.exports = router;
