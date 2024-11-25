const { ulpoadDocument } = require("./test-module");
const { getAllQuestions } = require("./test-module");
const { submitExam } = require("./test-module");
const { getUploadDocumentById } = require("./test-module");
const {getClientQuestionDetails}  = require("./test-module");
const {downloadPdf}   = require("./test-module");
const {getCandidateLogs}   = require("./test-module");
const {getQuestionBankByJobRoleName}   = require("./test-module");

const {candidateLogin}   = require("./test-module");
const {getCondidateDetailById}   = require("./test-module");


module.exports = {
  ulpoadDocument, getAllQuestions, submitExam, getUploadDocumentById,getClientQuestionDetails,downloadPdf ,getCandidateLogs,getQuestionBankByJobRoleName,
  candidateLogin,
  getCondidateDetailById
};
