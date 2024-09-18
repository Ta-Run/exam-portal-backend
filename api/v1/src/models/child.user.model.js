const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema, model } = mongoose;

const childUserSchema = new Schema({

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
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
  dateofcreation: {
    type: String,
    required: true,
  },
  selectPageViewPermission: {
    type: Array,
  },
  selectSectorPermissionId: {
    type: String
  },
  selectSectorPermissionName:{
    type: String
  },
  address:{
    type: String
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
  childUserCreatedByName: {
    type: String
  }
}, { timestamps: true });

childUserSchema.plugin(mongoosePaginate)
module.exports = model('childUsers', childUserSchema);
