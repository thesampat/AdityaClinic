const multer = require("multer");
const getStorageRef = require("../config/gridFs");
const AlternativeTherapiesModel = require("../Models/AlternativeTherapies");
const { Bid } = require("../Models/BidsModel");
const { default: mongoose } = require("mongoose");


const createAlternativeTherapiesModelRecord = async (req, res) => {

    const {therapy} = req.params
    try {
        const newRecord = new AlternativeTherapiesModel({
            requestForm:req.body,
            therapy:therapy,
            status:'requested',
        });
        const savedRecord = await newRecord.save();
        return res.status(200).json(savedRecord)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error creating AlternativeTherapies record" });
    }
}

const listAllThrapies = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
      const search = req.query.search ? {
           status: { $regex: req.query.status, $options: 'i' } 
      } : {}      

      if(req.query.therapy){
        search['therapy'] = { $regex: req.query.therapy, $options: 'i' }
      }

      if(req.query.consultant){ 
        search['consultant'] = new mongoose.Types.ObjectId(req.query.consultant)
      }
      
      const therapies = await AlternativeTherapiesModel.find(search, {requestForm:0})
        .skip(skip)
        .limit(parseInt(limit))
  
      return res.status(200).send(therapies)
  
    } catch (error) {
  
      console.log(error)
      return res.status(500).send(error);
    }
  }

const getAlternativeTherapiesModelRecordById = async (req, res) => {
    const { id } = req.params;
    try {
        const record = await AlternativeTherapiesModel.findById(id);
        if (!record) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.status(200).json(record);
    } catch (error) {


        res.status(500).json({ error: "Error fetching AlternativeTherapies record" });
    }
}

const UpdateAlternativeTherapiesModelRecordById = async (req, res) => {
  const { id } = req.params;
  const {duration='', note=''} = req.body
  try {
      const record = await AlternativeTherapiesModel.findById(id);
      if (!record) {
          return res.status(404).json({ error: "Record not found" });
      }
      else{
        record.duration = duration,
        record.note = note,
        record.status = 'bid'
        record.save()

        res.status(200).json(record);

      }
  } catch (error) {
      console.log(error)
      res.status(500).json({ error: "Error fetching AlternativeTherapies record" });
  }
}

const ApproveConsultantBid = async (req, res) => {
  const { id } = req.params;
  const {consultant, bid} = req.body

  try {
      const record = await AlternativeTherapiesModel.findById(id);
      const bidi = await Bid.findById(bid);
      if (!record) {
          return res.status(404).json({ error: "Record not found" });
      }
      else{
        record.consultant = consultant,
        record.status = 'treating'
        record.bidPrice = req.body.duration
        record.bidDuration = req.body.price
        record.save()
        bidi.status = 'win'
        bidi.save()
        res.status(200).json(record);
      }
  } catch (error) {
      console.log(error)
      res.status(500).json({ error: "Error fetching AlternativeTherapies record" });
  }
}


const UpdateTherapy = async (req, res) => {
  const {therapy_id} = req.params


  let {storage, bucket} = await getStorageRef();
  const upload = multer({ storage }).single('file');
  upload(req, res, async (uploadErr) => {

    if(Object.keys(req.body)?.includes('status') && req.role !== 'MainDoctor'){
      return res.status(500).json({ error: 'Not Allowed' });
    }

    if (uploadErr) {
      console.error('Error uploading documents:', uploadErr);
      return res.status(500).json({ error: 'An error occurred while uploading the documents' });
    }
    try {
      let therapy = await AlternativeTherapiesModel.findById(therapy_id);
      if (!therapy) {
        return res.status(404).json({ message: "Bid not found" });
      }
      if (req.file) {
        if (therapy.sample) {
         await bucket.delete(therapy.files.id);
        }
        const fileData = { name: req.file.originalname, id: req.file.id };
        therapy.files = [fileData];
      }

      if(req.body?.comment){
        therapy.comment = req.body.comment
      }
      if(req.body?.status){
        therapy.status = "done"
      }

      if (req.body) {
        Object.assign(therapy_id, req.body);
      }

      let updatedBid = await therapy.save();

      return res.json(updatedBid);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  });
};

module.exports = {
    createAlternativeTherapiesModelRecord,
    listAllThrapies,
    getAlternativeTherapiesModelRecordById,
    UpdateAlternativeTherapiesModelRecordById,
    ApproveConsultantBid,
    UpdateTherapy
    // getAllAlternativeTherapiesModelRecords,
    // getAlternativeTherapiesModelRecordById,
    // deleteAlternativeTherapiesModelRecord
}