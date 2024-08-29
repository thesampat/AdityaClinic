const mongoose = require('mongoose');

const nutritionSchema = require('./Alternative_Therapies_Schemas/nutrition');

const Schema = mongoose.Schema;

const therapy_types = ['nutrition', 'counselling', 'acupuncture', 'acupressure', 'ayurvedic','neuropathy', 'physiotherapy']

const baseAlternativeTherapiesSchema = new Schema({
  requestForm: { type: Schema.Types.Mixed, required: true },
  therapy: { type: String, required:true, enum:therapy_types},
  status:{ type: String, required:true, enum:['requested', 'bid', 'treating', 'done', 'abonded'], default:'requested'},
  consultant:{type:mongoose.Schema.Types.ObjectId, ref:'Consultant'},
  files:[],
  complete_date:{type:String},
  duration:{type:Number},
  note:{type:String},
  price:{type:String},
  comment:{type:String},
  bidDuration:{type:Number},
  bidPrice:{type:Number}
});


const AlternativeTherapiesModel = mongoose.model('alternative_therapies', baseAlternativeTherapiesSchema);

module.exports = AlternativeTherapiesModel;