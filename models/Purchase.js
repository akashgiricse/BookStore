const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'book'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Purchase = mongoose.model('purchase', PurchaseSchema);
