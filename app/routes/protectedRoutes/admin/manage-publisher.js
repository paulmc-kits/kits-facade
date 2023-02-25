const express = require("express");

const {
  pendingPublisherView,
  adminDashboardView,
  managePublishersView,
} = require("../../../controllers/adminController");

const router = express.Router();

router.get("/dashboard", adminDashboardView);
router.get("/publishers", managePublishersView);

router.get("/manage-publishers/pending", pendingPublisherView);

module.exports = router;
