const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema, model } = mongoose;

const jobRoleSchema = new Schema({
  assginedSectorsId: {
    type: Schema.Types.ObjectId, ref: 'sectors'
  },
  assginedSectorsName: {
    type: String,
    required: true,
  },
  jobRoleType: {
    type: String,
    required: true
  },
  jobRoleName: {
    type: String,
    required: true
  },
  jobRoleCode: {
    type: String,
    required: true,
  },
  totalMarks: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  totalTheoryMarks: {
    type: String,
    required: true,
  },
  totalPandVMarks: {
    type: String,
    required: true,
  },
  passingPercentage: {
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
  spocCreatedById: { type: String },
  spocCreatedByName: { type: String },
  chiledUserCreatedById: { type: String },
  chiledUserCreatedByEmail: { type: String },
}, { timestamps: true });

jobRoleSchema.plugin(mongoosePaginate)
module.exports = model('jobroles', jobRoleSchema);
