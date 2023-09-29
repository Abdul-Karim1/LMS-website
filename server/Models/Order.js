const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
