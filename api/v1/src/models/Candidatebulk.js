const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new mongoose.Schema({
    BatchName: {
        type: String,
        require: true,
    },
    EnrollmentNumber: {
        type: String,
        require: true,
    },
    Gender: {
        type: String,
        enum: ["male", "female"]
    },
    CandidateName: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    ContactNumber: {
        type: String,
        require: true,
    },
    DateOfBirth: {
        type: Date,
        require: true,
    },
    FatherName: {
        type: String,
        require: true
    },
    Address: {
        type: String,
        require: true,
    },
    ProfilePicture: {
        type: String,
        require: true,
    },
    AadharCard: {
        type: Number,
        require: true
    },
    sector: {
        type: String,
        require: true
    },
    assginedSectorsId: {
        type: Schema.Types.ObjectId, ref: 'sectors'
      },
    job_Role: {
        type: String,
        require: true
    },
    jobRoleId: {
        type: Schema.Types.ObjectId, ref: 'jobroles'
      },
    Batch: {
        type: String,
        require: true
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
        allowNull: true
    },
    lastUpdatedById: {
        type: String,
        allowNull: true
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"]
    },
    spocCreatedById: { type: String },
    spocCreatedByName: {
        type: String,
    },
    childUserCreatedById: {
        type: String
    },
    childUserCreatedByName: {
        type: String
    },
    

}, { timeseries: true })
schema.plugin(mongoosePaginate)
module.exports = model("candidates", schema)

