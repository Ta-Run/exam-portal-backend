const mongoose = require('mongoose')
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new mongoose.Schema({
    state: {
        type: String,
        require: true,
    },
    district: {
        type: String,
        require: true,
    },
    assginedSectorsId: {
        type: Schema.Types.ObjectId, ref: 'sectors'
    },
    jobRoleId: {
        type: Schema.Types.ObjectId, ref: 'jobroles'
    },
    TrainingPartnerName: {
        type: String,
        require: true
    },
    TrainingCenterName: {
        type: String,
        required: true,
    },
    TrainingPartnerEmail: {
        type: String,
        required: true,
    },
    TrainingCenterEmail: {
        type: String,
        require: true,
    },
    StartDate: {
        type: String,
        require: true
    },
    StartTime: {
        type: String,
        require: true,
      
    },
    EndDate: {
        type: String,
        require: true
    },
    EndTime: {
        type: String,
        require: true,
       
    },
    BatchCode: {
        type: String,
        require: true
    },
    TotalCandidate: {
        type: Number,
        require: true
    },
    photo: {
        type: String,
        require: true
        // enum: ["TRUE","FALSE"]
    },
    video: {
        type: String,
        require: true
        // enum: ["TRUE","FALSE"]
    },
    PhotoCaptureMinute: {
        type: String,
        require: true,
      
    },
    videoCaptureMinute: {
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
        type: String
    },
    childUserCreatedById: { type: String },
    childUserCreatedByName: {
        type: String
    }
}, { timestamps: true })

schema.plugin(mongoosePaginate)
module.exports = model('manage-batch', schema)
