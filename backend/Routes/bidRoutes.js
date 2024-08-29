const express = require('express');
const { createBid, getAllBids, getBidById, searchBidById, updateBidById, getFullBidByID, getMyBids } = require('../Controllers/BidController');
const getStorageRef = require('../config/gridFs');
const { getReport } = require('../Controllers/CustomUploadModals');
const router = express.Router();

router.route("/").post(createBid);
router.route("/").get(getAllBids);
router.route("/:id").get(getBidById);
router.route("/auction/:auction_id/:consultant_id").get(searchBidById);
router.route("/mybids/:consultant_id").get(getMyBids);
router.route("/update/:bid_id").patch(updateBidById);
router.route("/fullBid/:bid_id").get(getFullBidByID);
router.route('/download/:id').get(getReport)



module.exports = router;