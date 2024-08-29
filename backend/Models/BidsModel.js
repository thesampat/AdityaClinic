const mongoose = require('mongoose')

let bidsSchema = new mongoose.Schema({
  bidDate:{type:String},
  bidPrice: { type: Number, required: true },
  status: { type: String, required: true, enum: ['bid', 'win', 'lose'] },
  bidOn:{type:mongoose.SchemaTypes.ObjectId, ref:"alternative_therapies"},
  bidder:{type:mongoose.SchemaTypes.ObjectId, ref:"Consultant"},
  sample:{},
  duration:{type:Number},
  description:{type:String}
})

let Bid = mongoose.model('Bids', bidsSchema)

module.exports = {Bid}