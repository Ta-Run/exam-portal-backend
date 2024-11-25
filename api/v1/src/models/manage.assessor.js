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
    language: {
        type: String,
        require: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    fatherName: {
        type: String,
        require: true,
    },
    motherName: {
        type: String,
        require: true,
    },
    dateOfBirth: {
        type: Date,
        require: true
    },
    mobileNo: {
        type: Number,
        require: true
    },
    gender: {
        type: String,
        // require: true,
        enum: ["male", "female"]

    },
    email: {
        type: String,
        require: true
    },
    accessorCode: {
        type: String,
        require: true
    },
    permanent_Address: {
        type: String,
        require: true
    },
    pinCode: {
        type: Number,
        require: true
    },
    current_Address: {
        type: String,
        require: true
    },
    pincode: {
        type: Number,
        require: true
    },
    profile_picture: {
        type: String,
        require: true
    },
    adharcard: {
        type: Number,
        require: true
    },
    adhar_img: {
        type: String,
        require: true
    },
    adhar_img2: {
        type: String,
        require: true
    },
    pancardNo: {
        type: String,
        require: true
    },
    pancard_img: {
        type: String,
        require: true
    },
    sector: {
        type: String,
        require: true
    },
    CertificateExpiryDate: {
        type: Array,
        require: true

    },
    assginedSectorsIds: {
        type: Array, ref: 'sectors'
    },
    select_jobRole: {
        type: Array,
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
    spocPersonId: {
        type: String
    },
    spocPersonName: {
        type: String
    },
    childUserCreatedById: {
        type: String
    },
    childUserCreatedByName: {
        type: String
    }
}, { timestamps: true })

schema.plugin(mongoosePaginate)
module.exports = model('assessor', schema)
