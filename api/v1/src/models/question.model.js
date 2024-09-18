const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema, model } = mongoose;

const questionSchema = new Schema({
  questionBankId: {
    type: Schema.Types.ObjectId, ref: 'questionBank'
  },
  questionBankName: {
    type: String,
    required: true,
  },
  nosId: {
    type: Schema.Types.ObjectId, ref: 'nos'
  },
  nosName: {
    type: String,
    required: true,
  },
  difficultyLevel: {
    type: String,
    enum: ["Easy", "Medium", "Difficult"]
  },
  questionMarks: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ["Multiple Choice", "Multiple Responses", "True/False", "Fill in the blanks", "One Word Answer"]
  },
  question: {
    type: String
  },
  attatchment: {
    type: String
  },
  optionA: {
    type: String
  },
  optionAAttatchment: {
    type: String
  },
  optionB: {
    type: String
  },
  optionBAttatchment: {
    type: String
  },
  optionC: {
    type: String
  },
  optionCAttatchment: {
    type: String
  },
  optionD: {
    type: String
  },
  optionDAttatchment: {
    type: String
  },
  writeOption: {
    type: String
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
}, { timestamps: true });

questionSchema.plugin(mongoosePaginate)
module.exports = model('question', questionSchema);
