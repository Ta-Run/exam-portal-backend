const QuestionModel = require('../../models/question.model')
const ExamResponse = require('../../models/examresponse.model');
const ClientModel = require('../../models/client.model');
const QuestionBankModel = require('../../models/question-bank.model')
const NosModel = require('../../models/nos.model');
const ApplicationData = require('../../models/app.model');
const moment = require('moment-timezone');

const uploadDocuments = async (req, res) => {
  try {
    // console.log("===============> body", req.body);
    // console.log("===============>files", req.files);

    if (
      !req.files ||
      !Object.keys(req.files).length ||
      (!req.files?.yourPhoto?.length && !req.files?.yourDocument?.length)
    ) {
      return res.json({
        res: true,
        msg: "Either photo or your document must be uploaded",
      });
    }

    return res.json({
      res: true,
      msg: "File successfully uploaded",
    });
  } catch (error) {
    return res.json({
      res: false,
      msg: "Somthing Went To Wrong!",
    });
  }
};


const getAllQuestions = async (req, res) => {
  try {
    // Get the page number and limit from the request query
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided

    // Calculate the starting index
    const startIndex = (page - 1) * limit;

    // Fetch all questions with pagination
    const totalQuestions = await QuestionModel.countDocuments();
    const questions = await QuestionModel.find()
      .skip(startIndex)
      .limit(limit);

    // Check if questions are found
    if (questions.length > 0) {
      return res.json({
        res: true,
        msg: "Questions fetched successfully",
        data: questions,
        currentPage: page,
        totalPages: Math.ceil(totalQuestions / limit),
      });
    }

    return res.json({
      res: true,
      msg: "No questions found",
      data: [],
    });
  } catch (error) {
    console.error(error);
    return res.json({
      res: false,
      msg: "Something went wrong!",
    });
  }
};


// Endpoint to submit exam answers
const submitExam = async (req, res) => {
  try {
    let submitResult;
    const { questionBankId, selectedOption, nosId, question } = req.body;

    if (req.user.loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Something Went Wrong!',
        });
      }

      // Retrieve the question bank and NOS details if IDs are provided
      const isQuestionBank = questionBankId ? await QuestionBankModel.findOne({ _id: questionBankId }) : null;
      const isNos = nosId ? await NosModel.findOne({ _id: nosId }) : null;

      // Store the user's response without checking correctness
      submitResult = await ExamResponse.create({
        questionBankId: isQuestionBank ? isQuestionBank._id : null,
        questionBankName: isQuestionBank ? isQuestionBank.questionBankName : "",
        selectedOption: selectedOption,
        question: question || " ",
        clientId: isClient._id,
        clientName: isClient.clientName,
        nosId: isNos ? isNos._id : null,
        nosName: isNos ? isNos.nosName : "",
        createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        createdById: isClient._id,
        createdByName: isClient.clientName,
        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        lastUpdatedByName: isClient.clientName,
        lastUpdatedById: isClient._id,
        status: "Active",
      });
    }

    return res.json({
      message: 'Exam answers submitted successfully',
      totalQuestions: submitResult,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



const getUploadDocumentById = async (req, res) => {
  try {

    const { clientId } = req.params;

    if (!clientId) {
      return res.status(400).json({ message: 'clientId is required' });
    }

    const latestDocument = await ApplicationData.findOne({ clientId })
      .sort({ createAt: -1 });

    if (!latestDocument) {
      return res.status(404).json({ message: 'No document found for the provided clientId' });
    }

    return res.status(200).json({
      message: 'Latest document fetched successfully',
      data: latestDocument,
    });
  } catch (error) {
    console.error('Error fetching the latest document by clientId:', error);
    return res.status(500).json({
      message: 'An error occurred while fetching the latest document',
      error: error.message,
    });
  }
};



module.exports = { uploadDocuments, getAllQuestions, submitExam, getUploadDocumentById };
