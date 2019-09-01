const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Purchase = require('../../models/Purchase');
const Book = require('../../models/Book');
const User = require('../../models/User');

// @route  GET api/purchases
// @desc   Get all purchase list of the user
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        errors: [{ message: 'This user does not exists' }]
      });
    }

    const purchases = await Purchase.find({ user: req.user.id })
      .populate('user', ['id', 'name'])
      .populate('book', ['id', 'title']);

    if (purchases.length === 0) {
      return res.status(200).json({
        message: 'No purchase found for this user'
      });
    }

    res.status(200).json(purchases);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  GET api/purchases/:purchaseId
// @desc   Get a purchase for the user
// @access Private
router.get('/:purchaseId', auth, async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        errors: [{ message: 'This user does not exists' }]
      });
    }

    let purchaseId = req.params.purchaseId;

    const purchase = await Purchase.findOne({
      _id: purchaseId,
      user: req.user.id
    })
      .populate('user', ['id', 'name'])
      .populate('book', ['id', 'title']);

    if (!purchase) {
      return res.status(400).json({
        errors: [{ message: 'Could not find any purchase' }]
      });
    }
    res.status(200).json(purchase);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @router  POST api/purchases
// @desc    Make a purchase
// @access  Private
router.post(
  '/',
  auth,
  [check('bookId', 'The id provided is not a valid id').isMongoId()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        errors: [{ message: 'This user does not exists' }]
      });
    }

    const bookId = req.body.bookId;

    try {
      let book = await Book.findById(bookId);

      if (!book) {
        return res.status(400).json({
          errors: [{ message: 'Could not find any book with this id' }]
        });
      }

      // check if book is in stock or not
      const stock = book.stock;
      if (stock < 1) {
        return res.status(400).json({
          errors: [{ message: 'Sorry, the book is out of stock' }]
        });
      }

      const newPurchase = new Purchase({
        user: req.user.id,
        book: bookId
      });

      // Decrease book stock by 1
      await book.updateOne({
        $set: {
          stock: stock - 1
        }
      });
      await newPurchase.save();

      res.status(200).json({
        newPurchase
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route  DELETE api/purchases/:purchaseId
// @desc   Cancel a purchase
// @access Private
router.delete('/:purchaseId', auth, async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        errors: [{ message: 'This user does not exists' }]
      });
    }

    let purchaseId = req.params.purchaseId;

    const purchase = await Purchase.findOne({
      _id: purchaseId,
      user: req.user.id
    });

    if (!purchase) {
      return res.status(400).json({
        errors: [{ message: 'Could not find any purchase to delete' }]
      });
    }

    // Increase stock by 1
    const book = await Book.findById(purchase.book);
    const stock = book.stock;
    await book.updateOne({
      $set: {
        stock: stock + 1
      }
    });

    await purchase.delete();

    res.status(200).json({ message: 'Successfully deleted the purchase' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
