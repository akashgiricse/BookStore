const express = require('express');
const router = express.Router();
const Book = require('../../models/Book');
const { check, validationResult } = require('express-validator');

// @route  GET api/books
// @desc   Get all book lst
// @access Public
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({ stock: { $gt: 0 } }).select('-stock');
    res.status(200).json(books);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @router  POST api/books
// @desc    Create Book
// @access  Private

router.post(
  '/',
  [
    check('title', 'Title must be between 2 to 100 characters ').isLength({
      min: 2,
      max: 100
    }),
    check('description')
      .isLength({ max: 500 })
      .optional(),
    check('price', 'Price not included or invalid price given').isFloat({
      min: 0.0
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, price, stock } = req.body;

    try {
      let book = await Book.findOne({ title });

      if (book) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Book already exists' }] });
      }

      newBook = new Book({
        title: title,
        description: description ? description : null,
        price: price,
        stock: stock
      });
      await newBook.save();

      res.status(200).json({
        newBook
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
