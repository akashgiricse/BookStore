const express = require('express');
const router = express.Router();
const Book = require('../../models/Book');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route  GET api/books
// @desc   Get all book list
// @access Public
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({ stock: { $gt: 0 } });
    res.status(200).json(books);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  GET api/books/:bookId
// @desc   Get a book
// @access Public
router.get('/:bookId', async (req, res) => {
  try {
    let bookId = req.params.bookId;
    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Could not find a book by this id' }] });
    }
    res.status(200).json(book);
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
  auth,
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
      return res.status(401).json({ errors: errors.array() });
    }

    const { title, description, price, stock } = req.body;

    try {
      let book = await Book.findOne({ title });

      if (book) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Book already exists' }] });
      }

      const isAdmin = await User.findById(req.user.id).select('-password');

      if (isAdmin.role === 0) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Only admin can add books' }] });
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

// @route  PATCH api/books/:bookId
// @desc   Update a book
// @access Private
router.patch('/:bookId', auth, async (req, res) => {
  try {
    let bookId = req.params.bookId;
    const book = await Book.findById(bookId).select('-stock');
    if (!book) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Could not find a book by this id' }] });
    }

    const isAdmin = await User.findById(req.user.id).select('-password');

    if (isAdmin.role === 0) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Only admin can add books' }] });
    }
    const updateOptions = req.body;
    await book.update({ $set: updateOptions });

    res.status(200).json({ message: 'Successfully updated the book' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  DELETE api/books/:bookId
// @desc   Delete a book
// @access Private
router.delete('/:bookId', auth, async (req, res) => {
  try {
    let bookId = req.params.bookId;
    const book = await Book.findById(bookId).select('-stock');
    if (!book) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Could not find a book by this id' }] });
    }

    const isAdmin = await User.findById(req.user.id).select('-password');

    if (isAdmin.role === 0) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Only admin can delete a books' }] });
    }

    await book.delete();

    res.status(200).json({ message: 'Successfully deleted the book' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
