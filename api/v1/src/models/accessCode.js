const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new mongoose.Schema({

    accessCode: { type: Number, ref: 'manage-candidates' },

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
    }

}, { timeseries: true })
schema.plugin(mongoosePaginate)
module.exports = model("login", schema)

