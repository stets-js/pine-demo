const express = require("express");
const router = express.Router();
const askController = require("../controllers/askController");

router.post("/", askController.askQuestion);

module.exports = router;
