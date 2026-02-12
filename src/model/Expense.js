const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    payer: { type: String, required: true }, // Email of the payer
    participants: [String], // Array of emails - kept for easy querying
    splitType: {
        type: String,
        enum: ['EQUAL', 'UNEQUAL'],
        default: 'EQUAL'
    },
    splits: [{
        userId: String, // Email
        amount: Number
    }],
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    date: { type: Date, default: Date.now },
    isSettled: { type: Boolean, default: false }
});

module.exports = mongoose.model('Expense', expenseSchema);
