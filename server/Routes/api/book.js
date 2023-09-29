const express = require("express");
const router = express.Router();
const Book = require("../../Models/Book");

// Create a new Book
router.post("/addBooks", async (req, res) => {
  try {
    const { bookName, author, price } = req.body;
    const book = new Book({ bookName, author, price });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;

// Read all Books
router.get("/viewAllBooks", async (req, res) => {
  try {
    const books = await Book.find().populate("author"); // Populate author reference
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Read a single Book by ID
router.get("/viewBook/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author"); // Populate author reference
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;

// Update a Book by ID
router.put("/updateBook/:id", async (req, res) => {
  try {
    const { bookName, author, price } = req.body;

    console.log("1--->", req.body);
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { bookName, author, price },
      { new: true }
    ).populate("author"); // Populate author reference
    console.log("--->", book);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;

// Delete a Book by ID
router.delete("/deleteBook/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Successfully Deleted" }); // No content (successful deletion)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
