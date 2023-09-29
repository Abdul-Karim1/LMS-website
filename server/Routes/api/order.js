const express = require("express");
const router = express.Router();
const Order = require("../../Models/Order");

// Create a new Order
router.post("/addOrder", async (req, res) => {
  try {
    const { status, phone, book } = req.body;
    const order = new Order({ status, phone, book });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
// Read all Orders
router.get("/viewAllOrders", async (req, res) => {
  try {
    const orders = await Order.find().populate("book"); // Populate   and book references
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
// Read a single Order by ID
router.get("/viewOrder/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("book"); // Populate   and book references
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
// Update an Order by ID
router.put("/updateOrder/:id", async (req, res) => {
  try {
    const { status, phone, book } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, phone, book },
      { new: true }
    ).populate("book"); // Populate   and book references

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
// Delete an Order by ID
router.delete("/deleteOrder/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Successfully Deleted" }); // No content (successful deletion)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
