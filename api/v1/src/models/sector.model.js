const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema, model } = mongoose;

const sectorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Government", "Private"]
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

sectorSchema.plugin(mongoosePaginate)
module.exports = model('sectors', sectorSchema);
