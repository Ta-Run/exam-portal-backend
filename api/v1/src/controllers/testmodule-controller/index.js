const { uploadDocuments } = require("./test-module");
const { getAllQuestions } = require("./test-module");
const { submitExam } = require("./test-module");
const { getUploadDocumentById } = require("./test-module");
const {getClientQuestionDetails}  = require("./test-module");

module.exports = {
  uploadDocuments, getAllQuestions, submitExam, getUploadDocumentById,getClientQuestionDetails
};
