const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema, model } = mongoose;

const clientSchema = new Schema({
  clientName: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  assginedSectorsId:{
    type: Array
  },
  assginedSectorsName:{
    type: Array,
  },
  createAt: {
    type: String
  },
  createdById: { type: Schema.Types.ObjectId, ref: 'admins' },
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
  }
}, { timestamps: true });

clientSchema.plugin(mongoosePaginate)
module.exports = model('clients', clientSchema);
