const QuestionModel = require('../../models/question.model')
const ExamResponseModel = require('../../models/examresponse.model');
const ClientModel = require('../../models/client.model');
const QuestionBankModel = require('../../models/question-bank.model')
const NosModel = require('../../models/nos.model');
const ApplicationData = require('../../models/app.model');
const ClientQuestionModel = require('../../models/question-bank.model')
const moment = require('moment')
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
// Endpoint to submit exam answers
const submitExam = async (req, res) => {
  try {
    const { questionBankId, answers } = req.body;
    if (req.user.loginType === "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Something Went Wrong!',
        });
      }

      let totalScore = 0;
      let submissions = [];
      let clientId =  isClient._id
      for (let answer of answers) {
        const { questionId, userAnswer } = answer;
        console.log('question',questionId)
        const question = await QuestionModel.findById(questionId);
        const isCorrect = (question.writeOption === userAnswer);
        const marks = isCorrect ? parseInt(question.questionMarks) : 0;
        totalScore += marks;
    
        // Create a submission record
        const submission = new ExamResponseModel({
          clientId,
          questionBankId,
          questionId,
          userAnswer,
          isCorrect,
          marks,
          totalScore
        });

        submissions.push(submission);
      }

      await ExamResponseModel.insertMany(submissions);

      return res.status(200).json({
        msg: 'Exam submitted successfully',
        totalScore,
        submissions
      });
    }
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


//get client question bank and exam deatils by job rol id 


const getClientQuestionDetails = async (req, res) => {

  try {

    const data = await ClientQuestionModel.find({ clientId: req.user.id })
    return res.status(200).json({
      data: data
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      err: err
    })
  }
}

module.exports = { uploadDocuments, getAllQuestions, submitExam, getUploadDocumentById, getClientQuestionDetails };
