const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const examResponseSchema = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'clients' },
    clientName: { type: String },

    createdById: { type: String },
    createdByName: { type: String },
    lastUpdatedByName: { type: String },
    lastUpdatedById: { type: String },
    questionBankId: { type: Schema.Types.ObjectId, ref: 'questionBank' },
    questionId: { type: Schema.Types.ObjectId, ref: 'question' },
    userAnswer: { type: String },
    isCorrect: { type: Boolean },
    marks: { type: Number }, 
    totalScore: { type: Number },
    submissionTime: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = model('ExamResponse', examResponseSchema);
