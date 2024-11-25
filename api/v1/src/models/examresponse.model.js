const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const examResponseSchema = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'clients' }, // Reference to the client
    clientName: { type: String },

    createdById: { type: String },
    createdByName: { type: String },
    lastUpdatedByName: { type: String },
    lastUpdatedById: { type: String },
    questionBankId: { type: Schema.Types.ObjectId, ref: 'questionBank' },
    candidateId: { type: Schema.Types.ObjectId, ref: 'candidates' },
    nosID : [{ type: Schema.Types.ObjectId, ref: 'nos'}],
    assessorId:{ type: Schema.Types.ObjectId, ref: 'assessor'},
    userAnswers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: 'question' }, // Reference to a specific question
        userAnswer: { type: String }, // The user's answer for that question
        isCorrect: { type: Boolean }, // Whether the answer is correct or not
        marks: { type: Number, default: 0 } // Marks for that specific question
      }
    ],

    // Total score for the entire set of answers
    totalScore: { type: Number, default: 0 }, // Optional default to 0

    // Submission time for the exam response
    submissionTime: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

module.exports = model('ExamResponse', examResponseSchema);
