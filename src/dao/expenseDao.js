const Expense = require('../model/Expense');

const expenseDao = {
    createExpense: async (expenseData) => {
        const newExpense = new Expense(expenseData);
        return await newExpense.save();
    },

    getExpensesByGroupId: async (groupId) => {
        return await Expense.find({ groupId, isSettled: false }).sort({ date: -1 });
    },

    settleAllExpenses: async (groupId) => {
        return await Expense.updateMany(
            { groupId, isSettled: false },
            { $set: { isSettled: true } }
        );
    }
};

module.exports = expenseDao;
