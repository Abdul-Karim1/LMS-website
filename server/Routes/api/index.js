let router = require("express").Router();

router.use("/users", require("./user"));
router.use("/books", require("./book"));
router.use("/authors", require("./author"));
router.use("/orders", require("./order"));
module.exports = router;
