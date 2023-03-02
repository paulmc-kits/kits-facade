const express = require("express");

const {
  pendingPublisherView,
  adminDashboardView,
  managePublishersView,
  rejectedPublishersView,
} = require("../../../controllers/adminController");

const router = express.Router();

router.get("/dashboard", adminDashboardView);
router.get("/publishers", managePublishersView);

router.get("/manage-publishers/pending", pendingPublisherView);
router.get("/manage-publishers/rejected", rejectedPublishersView);


module.exports = router;
