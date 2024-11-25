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
    // assginedSectorsId: {
    //     type: String,
    //     require: true,
    // },
    // jobRoleId: {
    //     type: String,
    //     require: true,
    // },
    jobRoleName: {
        type: String,
        require: true,
    },
    sectorName: {
        type: String,
        require: true,
    },
    batchName: {
        type: String,
        require: true,
    },
    TrainingCenterName: {
        type: String,
        required: true,
    },
    TrainingPartnerEmail: {
        type: String,
        required: true,
    },  
    startTime: {
        type: String,
        require: true,
    },
    endTime: {
        type: String,
        require: true,
    },
    startDate: {
        type: String,
        require: true,
       
    },
    endDate: {
        type: String,
        require: true,
   
    },
    // BatchCode: {
    //     type: String,
    //     require: true
    // },
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
    childUserCreatedById: { type: String },
    childUserCreatedByName: {
        type: String,
    },
    batchImageCaptureTime:{
        type:String
    }

}, { timestamps: true })

schema.plugin(mongoosePaginate)
module.exports = model('batchUpload', schema)
