const express = require("express");
const { initEsewa, statusEsewa } = require("../controller/Payment");
const router = express.Router();

router.post("/init", initEsewa);
router.get("/status", statusEsewa);

module.exports = router;
