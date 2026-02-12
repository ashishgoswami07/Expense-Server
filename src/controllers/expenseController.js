const expenseDao = require('../dao/expenseDao');

const expenseController = {
    addExpense: async (req, res) => {
        try {
            const { title, amount, payer, participants, splitType, splits, groupId, date } = req.body;

            let finalSplits = [];

            if (splitType === 'EQUAL') {
                if (!participants || participants.length === 0) {
                    return res.status(400).json({ message: "At least one participant is required for equal split" });
                }
                const splitAmount = amount / participants.length;
                finalSplits = participants.map(email => ({
                    userId: email,
                    amount: parseFloat(splitAmount.toFixed(2)) // Simple rounding, might lose cents but ok for now
                }));
                // Adjust last person to handle rounding errors
                const currentTotal = finalSplits.reduce((sum, s) => sum + s.amount, 0);
                if (currentTotal !== amount) {
                    finalSplits[0].amount += (amount - currentTotal);
                }
            } else {
                // Validate UNEQUAL splits
                const totalSplit = splits.reduce((sum, s) => sum + s.amount, 0);
                if (Math.abs(totalSplit - amount) > 0.01) {
                    return res.status(400).json({ message: "Split amounts do not allow up to total expense amount" });
                }
                finalSplits = splits;
            }

            const newExpense = await expenseDao.createExpense({
                title, amount, payer, participants, splitType, splits: finalSplits, groupId, date
            });
            res.status(201).json(newExpense);
        } catch (error) {
            res.status(500).json({ message: "Error adding expense", error });
        }
    },

    getExpensesByGroup: async (req, res) => {
        try {
            const { groupId } = req.params;
            const expenses = await expenseDao.getExpensesByGroupId(groupId);
            res.status(200).json(expenses);
        } catch (error) {
            res.status(500).json({ message: "Error fetching expenses", error });
        }
    },

    getGroupBalances: async (req, res) => {
        try {
            const { groupId } = req.params;
            const expenses = await expenseDao.getExpensesByGroupId(groupId);

            // Calculate balances
            // Map<Email, Balance> -> positive means you are owed, negative means you owe
            const balances = {};

            expenses.forEach(expense => {
                // Payer gets +amount
                balances[expense.payer] = (balances[expense.payer] || 0) + expense.amount;

                // Each participant gets -splitAmount
                if (expense.splits) {
                    expense.splits.forEach(split => {
                        balances[split.userId] = (balances[split.userId] || 0) - split.amount;
                    });
                }
            });

            res.status(200).json(balances);
        } catch (error) {
            res.status(500).json({ message: "Error calculating balances", error });
        }
    },

    settleGroup: async (req, res) => {
        try {
            const { groupId } = req.params;
            await expenseDao.settleAllExpenses(groupId);
            res.status(200).json({ message: "Group settled successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error settling group", error });
        }
    }
};

module.exports = expenseController;
