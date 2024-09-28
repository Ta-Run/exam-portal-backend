const { uploadDocuments } = require("./exam");
const { getAllQuestions } = require("./exam");
const { submitExam } = require("./exam");
const { getUploadDocumentById } = require("./exam");

module.exports = {
  uploadDocuments, getAllQuestions, submitExam, getUploadDocumentById
};
