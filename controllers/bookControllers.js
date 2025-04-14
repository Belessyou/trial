const Book = require('../models/Book');

// CREATE
exports.createBook = async (req, res) => {
  try {
    const book = await Book.create({
      ...req.body,
      createdBy: req.user._id // pastikan user sudah login
    });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ ALL
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('createdBy', 'username email');
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ BY ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('createdBy', 'username email');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// TEMPORARY buat testing tanpa auth
const dummyUserId = '6615xxxxxx'; // Ganti dengan ObjectId user beneran dari MongoDB

const book = await Book.create({
  ...req.body,
  createdBy: dummyUserId
});
