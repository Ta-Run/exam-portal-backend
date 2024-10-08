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



const submitExam = async (req, res) => {
  try {
    const { questionBankId, answers } = req.body;

    // Early validation for inputs
    if (!questionBankId || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ res: false, msg: 'Invalid request body!' });
    }

    if (req.user.loginType === "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
      if (!isClient) {
        return res.status(400).json({ res: false, msg: 'Client not found!' });
      }

      let totalScore = 0;
      const clientId = isClient._id;
      const userAnswers = [];

      // Fetch all question IDs in one query to reduce database load
      const questionIds = answers.map(answer => answer.questionId);
      const questions = await QuestionModel.find({ _id: { $in: questionIds } });
      const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

      // Process each answer
      for (let answer of answers) {
        const { questionId, userAnswer } = answer;

        // Fetch question from map
        const question = questionMap.get(questionId);
        if (!question) {
          console.log(`Question with ID ${questionId} not found`);
          continue; // Skip if the question is not found
        }

        // Compare answer with correct answer
        const isCorrect = (question.correctAnswer === userAnswer);
        const marks = isCorrect ? parseInt(question.questionMarks) : 0;
        totalScore += marks;

        // Prepare each user answer entry
        userAnswers.push({
          questionId,
          userAnswer,
          isCorrect,
          marks
        });
      }

      // Submit the exam response
      const resultAns = await ExamResponseModel.create({
        clientId: clientId,
        clientName: isClient.clientName,
        questionBankId: questionBankId,
        userAnswers,  // Populate the userAnswers array
        totalScore: totalScore
      });

      return res.status(200).json({
        msg: 'Exam submitted successfully',
        resultAns
      });
    }
  } catch (error) {
    console.error('Error during exam submission:', error);
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
