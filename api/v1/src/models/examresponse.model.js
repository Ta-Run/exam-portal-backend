const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const answerSchema = new Schema({
  questionBankId: {
    type: Schema.Types.ObjectId, ref: 'questionBank',
    default: null,
  },
  questionBankName: {
    type: String,
  },
  nosId: {
    type: Schema.Types.ObjectId, ref: 'nos',
    default: null,
  },
  nosName: {
    type: String,
  },
  selectedOption: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
});

const examResponseSchema = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'clients' },
    clientName: { type: String },
    answers: [answerSchema], // Array of answer subdocuments
    createdById: { type: String },
    createdByName: { type: String },
    lastUpdatedByName: { type: String },
    lastUpdatedById: { type: String },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields as Date types
  }
);

module.exports = model('ExamResponse', examResponseSchema);
