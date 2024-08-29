const { mongoose } = require("mongoose");
const { Bid } = require("../Models/BidsModel");
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const getStorageRef = require("../config/gridFs");
require('dotenv').config();

const createBid = async (req, res) => {

  let {storage, bucket} = await getStorageRef();
  const upload = multer({ storage }).single('file'); 
  upload(req, res, async (uploadErr) => {
    if (uploadErr) {
      console.error('Error uploading documents:', uploadErr);
      return res.status(500).json({ error: 'An error occurred while uploading the documents' });
    }
    try {   
      const fileData = { name: req.file.originalname, id: req.file.id };
      const bid = new Bid({...req.body, sample: fileData, status: 'bid' });
      let newBid = await bid.save();
      return res.status(201).send({ msg: 'Bid created successfully.', data: newBid?._id });
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: error.message });
    }
  });
};

  
const getBidById = async (req, res) => {
  const { id } = req.params;
  try {
    const bid = await Bid.findOne({ _id: mongoose.Types.ObjectId(id) });
    if (!bid) {
      return res.status(200).json({ message: "Bid not found" });
    }

    res.json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getFullBidByID = async (req, res) => {
  const { bid_id } = req.params;
  try {
    const bid = await Bid.findOne({ _id: mongoose.Types.ObjectId(bid_id) })
    .populate({
      path: 'bidder',
      model: 'Consultant',
      select: 'name email'
    })
   
    if (!bid) {
      return res.status(200).json({ message: "Bid not found" });
    }

    res.json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


const searchBidById = async (req, res) => {
  const { auction_id, consultant_id } = req.params;
  try {
    const bid = await Bid.findOne({ bidOn: mongoose.Types.ObjectId(auction_id), bidder:mongoose.Types.ObjectId(consultant_id)});

    if (!bid) {
      return res.status(200).json({ message: "Bid not found" });
    }
    res.json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateBidById = async (req, res) => {

  let {storage, bucket} = await getStorageRef();
  const upload = multer({ storage }).single('file');
  upload(req, res, async (uploadErr) => {
    if (uploadErr) {
      console.error('Error uploading documents:', uploadErr);
      return res.status(500).json({ error: 'An error occurred while uploading the documents' });
    }
    try {
      let bid = await Bid.findById(req.params.bid_id);
      if (!bid) {
        return res.status(404).json({ message: "Bid not found" });
      }
    
      if (req.file) {
        if (bid.sample) {
         await bucket.delete(bid.sample.id);
        }
        
        const fileData = { name: req.file.originalname, id: req.file.id };
        bid.sample = fileData;
      }
      
      if (req.body) {
        Object.assign(bid, req.body);
      }
      
      let updatedBid = await bid.save();
      return res.json(updatedBid);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  });
};



  const getMyBids = async (req, res) => {
    const { auction_id, consultant_id, status } = req.params;
    const { page, limit } = req.query;
    const skip = page ? (parseInt(page) - 1) * (limit ? parseInt(limit) : 10) : 0;
    const pageSize = limit ? parseInt(limit) : 10;
  
    try {
      const bids = await Bid.aggregate([
        {
          $match: {
            bidder: mongoose.Types.ObjectId(consultant_id),
            status: 'bid'
          }
        },
        {
          $lookup: {
            from: 'alternative_therapies',
            localField: 'bidOn',
            foreignField: '_id',
            as: 'bidOn'
          }
        },
        {
          $unwind: '$bidOn'
        },
        {
          $match:{'bidOn.status':status}
        },
        {
          $lookup: {
            from: 'consultants',
            localField: 'bidder',
            foreignField: '_id',
            as: 'bidder'
          }
        },
        {
          $unwind: '$bidder'
        },
        {
          $skip: skip
        },
        {
          $limit: pageSize
        },
        {
          $project: {
            _id: 1,
            bidder_name: '$bidder.name',
            bidder_email: '$bidder.email',
            bidOn: {  status: '$bidOn.status' },
            status: 1
          }
        }
      ]);
  
      res.status(200).json(bids);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching bids" });
    }
  };
  

  const getAllBids = async (req, res) => {
    const { page, limit, status } = req.query;
    const skip = page ? (parseInt(page) - 1) * (limit ? parseInt(limit) : 10) : 0;
    const pageSize = limit ? parseInt(limit) : 10;
  
    try {
      const bids = await Bid.aggregate([
        {
          $lookup: {
            from: 'alternative_therapies',
            localField: 'bidOn',
            foreignField: '_id',
            as: 'bidOnObject'
          }
        },
        {
          $match:{'status':status==='treating'?"win":"bid"}
        },
        {
          $unwind: '$bidOnObject'
        },
        {
          $match:{'bidOnObject.status':status}
        },
        {
          $lookup: {
            from: 'consultants',
            localField: 'bidder',
            foreignField: '_id',
            as: 'bidder'
          }
        },
        {
          $unwind: '$bidder'
        },
        {
          $skip: skip
        },
        {
          $limit: pageSize
        },
        {
          $project: {
            _id: 1,
            bidder_name: '$bidder.name',
            bidder_email: '$bidder.email',
            bidOn: "$bidOn",
            status: 1,
            bidPrice:'$bidPrice',
            duration:'$duration', 
          }
        }
      ]);
  
      res.status(200).json(bids);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching bids" });
    }
  };
 

// const deleteBidById = async (req, res) => {
//   try {
//     const bid = await Bid.findByIdAndRemove(req.params.id);
//     if (!bid) {
//       return res.status(404).json({ message: "Bid not found" });
//     }
//     res.json({ message: "Bid deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

module.exports = { createBid, getAllBids, getBidById, searchBidById, updateBidById, getFullBidByID, getMyBids }