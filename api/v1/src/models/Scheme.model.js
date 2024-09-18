const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema, model } = mongoose;

const schemeSchema = new Schema({
  assginedSectorsId: {
    type: Schema.Types.ObjectId, ref: 'sectors'
  },
  assginedSectorsName: {
    type: String,
    required: true,
  },
  schemeName: {
    type: String,
    required: true,
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
    type: String
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"]
  },
  spocCreatedById: {
    type: String
  },
  spocCreatedByName: {
    type: String
  },
  childUserCreatedById: {
    type: String
  },
  chiledUserCreatedByEmail: {
    type: String
  }
}, { timestamps: true });

schemeSchema.plugin(mongoosePaginate)
module.exports = model('scheme', schemeSchema);
