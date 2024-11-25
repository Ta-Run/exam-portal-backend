const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new mongoose.Schema({
    BatchName: {
        type: String,
        default: null
    },
    EnrollmentNumber: {
        type: String,
        default: null
    },
    Gender: {
        type: String,
        enum: ["male", "female"],
        default: null
    },
    CandidateName: {
        type: String,
        default: null
    },
    Email: {
        type: String,
        default: null
    },
    ContactNumber: {
        type: String,
        default: null
    },
    DateOfBirth: {
        type: Date,
        default: null
    },
    FatherName: {
        type: String,
        default: null
    },
    Address: {
        type: String,
        default: null
    },
    ProfilePicture: {
        type: String,
        default: null
    },
    AadharCard: {
        type: String,
        default: null
    },
    sector: {
        type: String,
        default: null
    },
    assginedSectorsId: {
        type: Schema.Types.ObjectId,
        ref: 'sectors',
        default: null
    },
    jobRole: {
        type: String,
        default: null
    },
    jobRoleId: {
        type: Schema.Types.ObjectId,
        ref: 'jobroles',
        default: null
    },
    Batch: {
        type: String,
        default: null
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'clients',
        default: null
    },
    clientName: {
        type: String,
        default: null
    },
    createAt: {
        type: String,
        default: null
    },
    createdById: {
        type: String,
        default: null
    },
    createdByName: {
        type: String,
        default: null
    },
    lastUpdatedAt: {
        type: String,
        default: null
    },
    lastUpdatedByName: {
        type: String,
        default: null
    },
    lastUpdatedById: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: null
    },
    spocCreatedById: {
        type: String,
        default: null
    },
    spocCreatedByName: {
        type: String,
        default: null
    },
    childUserCreatedById: {
        type: String,
        default: null
    },
    childUserCreatedByName: {
        type: String,
        default: null
    }

}, { timestamps: true });

schema.plugin(mongoosePaginate);

module.exports = model("manage-candidates", schema);
