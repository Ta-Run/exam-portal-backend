const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema, model } = mongoose;

const examResponseSchema = new Schema({
    questionBankId: {
        type: Schema.Types.ObjectId, ref: 'questionBank',
        default: null
    },
    questionBankName: {
        type: String,
    },
    nosId: {
        type: Schema.Types.ObjectId, ref: 'nos',
    },
    nosName: {
        type: String,
    },
    selectedOption: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    clientId: { type: Schema.Types.ObjectId, ref: 'clients' },
    clientName: {
        type: String,
       
    },
    createdById: { type: String },
    createdByName: {
        type: String,
       
    },
    lastUpdatedByName: {
        type: String,
       
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

}, { 
    timestamps: true // Automatically adds createdAt and updatedAt fields as Date types
});

// Apply pagination plugin if needed
examResponseSchema.plugin(mongoosePaginate);

module.exports = model('ExamResponse', examResponseSchema);
