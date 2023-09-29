const express = require("express");
const router = express.Router();
const Author = require("../../Models/Author");

// Create a new Author
router.post("/addAuthors", async (req, res) => {
  try {
    const { name, publisher } = req.body;
    const author = new Author({ name, publisher });
    await author.save();
    res.status(201).json(author);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Read all Authors
router.get("/viewAllAuthors", async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Read a single Author by ID
router.get("/viewAuthor/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.status(200).json(author);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Update an Author by ID
router.put("/updateAuthor/:id", async (req, res) => {
  try {
    const { name, publisher } = req.body;
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      { name, publisher },
      { new: true }
    );
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.status(200).json(author);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Delete an Author by ID
router.delete("/deleteAuthor/:id", async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.status(200).json({ message: "Successfully Deleted" }); // No content (successful deletion)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
