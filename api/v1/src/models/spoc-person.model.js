const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema, model } = mongoose;

const spocPersonSchema = new Schema({
  spocPersonName: {
    type: String,
    required: true
  },
  contactNo: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  assginedSectorsIds: {
    type: Array, 
  },
  assginedSectorsNames: {
    type: Array,
  
  },
  clientId: { type: Schema.Types.ObjectId, ref: 'clients' },
  clientName: {
    type: String,
    required: true,
  },
  createAt: {
    type: String
  },
  createdById: { type: String },
  createdByName: {
    type: String,
    required: true,
  },
  lastUpdatedAt: {
    type: String
  },
  lastUpdatedByName: {
    type: String,
    required: true,
  },
  lastUpdatedById: {
    type: Schema.Types.ObjectId, ref: 'admins'
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"]
  },
  spocCreatedById:{
    type:String
  },
  spocCreatedByName:{
    type:String
  }
}, { timestamps: true });

spocPersonSchema.plugin(mongoosePaginate)
module.exports = model('spocpersons', spocPersonSchema);
