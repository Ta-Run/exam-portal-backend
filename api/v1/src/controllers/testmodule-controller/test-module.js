const QuestionModel = require('../../models/question.model')
const ExamResponseModel = require('../../models/examresponse.model');
const ClientModel = require('../../models/client.model');
const QuestionBankModel = require('../../models/question-bank.model')
const NosModel = require('../../models/nos.model');
const ApplicationData = require('../../models/app.model');;
const ClientQuestionModel = require('../../models/question-bank.model')
const condidateDetailsModel = require('../../models/Candidatebulk');;
const bulkBatchUploadModel = require('../../models/batchUpload')
const AssessorModel = require('../../models/manage.assessor')
const sectorModel = require('../../models/sector.model')
const moment = require('moment')
const path = require('path');
const fs = require('fs');
const PDFDocument = require("pdfkit");


const ulpoadDocument = async (req, res) => {
  try {

    const { yourPhoto, yourDocument, candidateId } = req.body

    if (!candidateId) {
      return res.status(400).json({ res: false, msg: 'Candidate ID is required.' });
    }

    const isCandidate = await condidateDetailsModel.findOne({ _id: candidateId });
    if (!isCandidate) {
      return res.status(404).json({ res: false, msg: 'Candidate not found!' });
    }

    if (!req.files || !req.files.yourPhoto || !req.files.yourDocument) {
      return res.status(400).json({ res: false, msg: 'Both photo and document files are required.' });
    }

    // Update the candidate's document with the new file paths
    const updatedCandidate = await condidateDetailsModel.findOneAndUpdate(
      { _id: candidateId },
      {
        ProfilePicture: `/upload/${req.files.yourPhoto[0].filename}`,
        AadharCard: `/upload/${req.files.yourDocument[0].filename}`,
      },
      { new: true }
    );

    return res.json({
      res: true,
      msg: 'Document uploaded successfully.',
      data: updatedCandidate
    });
  } catch (error) {
    console.error('Error in upload document:', error);
    return res.status(500).json({
      res: false,
      msg: 'Something went wrong!'
    });
  }
}


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
    const { questionBankId, answers, images, geolocation, candidateId ,nosNameId,assessorId} = req.body;

     console.log(questionBankId, answers, images, geolocation, candidateId ,nosNameId,assessorId)
   
    if (!questionBankId || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ res: false, msg: 'Invalid request body!' });
    }

    let totalScore = 0;
    const userAnswers = [];
    const questionIds = answers.map(answer => answer.questionId);

    // Fetch questions with required fields
    const questions = await QuestionModel.find(
      { _id: { $in: questionIds } },
      'correctAnswer questionMarks question optionA optionB optionC optionD writeOption'
    );

    if (questions.length === 0) {
      console.error("No questions found with the provided IDs");
      return res.status(400).json({ res: false, msg: 'No questions found!' });
    }

    // Create a map for easy lookup
    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

    for (let answer of answers) {
      const { questionId, userAnswer } = answer;
      const question = questionMap.get(questionId);

      if (!question) {
        console.warn(`Question not found for ID: ${questionId}`);
        continue;
      }
      const formattedUserAnswer = userAnswer.replace(/option/i, "").toUpperCase();
      const formattedWriteOption = question.writeOption.toUpperCase();
      // Check for correctness
      const isCorrect =
        question.writeOption.includes(formattedUserAnswer) ||
        formattedWriteOption === formattedUserAnswer;
      const marks = isCorrect ? parseInt(question.questionMarks) : 0;
      totalScore += marks;

      userAnswers.push({
        questionId,
        userAnswer,
        isCorrect,
        marks,
        correctAnswer: question.correctAnswer, // Join correct answers if multiple
        questionText: question.question,
        writeOption: question.writeOption
      });
    }

    // Ensure candidateId is a string
    const candidateIdString = Array.isArray(candidateId) ? candidateId[0] : String(candidateId);

    // Store user answers and score in the database
    const resultAns = await ExamResponseModel.create({
      questionBankId: questionBankId,
      userAnswers,
      totalScore: totalScore,
      candidateId: candidateIdString,
      nosNameId: nosNameId?nosNameId.map(id => id):null,
      assessorId:assessorId
    });

    const candidate = await condidateDetailsModel.findById(candidateIdString).populate('assginedSectorsId jobRoleId');

    if (!candidate) {
      return res.status(404).json({ res: false, msg: 'Candidate not found!' });
    }


    const nos = await NosModel.findOne({ jobRoleName: candidate.job_Role });

    if (!candidate) {
      return res.status(404).json({ res: false, msg: 'Candidate not found!' });
    }

    // Dynamically calculate the required values
    const totalQuestions = questions.length;
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    const wrongAnswers = totalQuestions - correctAnswers;
    const unattemptedAnswers = totalQuestions - userAnswers.length; // Assuming unattempted answers are the ones not in the answers array

    // Calculate the score percentage
    const totalMarks = questions.reduce((sum, question) => sum + parseInt(question.questionMarks), 0);
    const scorePercentage = (totalScore / totalMarks) * 100;

    const tableData = [
      ['NOS Name', 'Total Question', 'Correct', 'Wrong', 'Unattempt', 'Score', 'Score %'],
      [nos.nosName, totalQuestions, correctAnswers, wrongAnswers, unattemptedAnswers, totalScore, scorePercentage.toFixed(2)],
    ];

    // Generate PDF
    const pdfPath = await getPDfDownload(candidate, totalScore, userAnswers, tableData, questionMap, images, nos.nosName);

    // Return response with the PDF path
    return res.status(200).json({
      msg: 'Exam submitted successfully',
      resultAns,
      pdfPath
    });
  } catch (error) {
    console.error('Error during exam submission:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const getPDfDownload = async (candidateId, totalScore, userAnswers, tableData, questionMap, images, nosName) => {
  // Generate PDF report
  const pdfDir = path.join(__dirname, 'exam_results');
  fs.mkdirSync(pdfDir, { recursive: true });
  const pdfPath = path.join(pdfDir, `${candidateId._id.toString()}_exam.pdf`);
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfPath));

  doc.fontSize(18).font('Helvetica-Bold').text('ASSESSMENT REPORT', { align: 'left' });
  doc.moveDown(0.5);

  doc.fontSize(12).font('Helvetica').text(`Name: ${candidateId.CandidateName}`);
  doc.text(`Test Name: ${candidateId.job_Role}`);
  doc.text(`Date: ${candidateId.createAt}`);
  doc.text(`Time Taken: ${candidateId.createAt}`);

  doc.circle(480, 82, 30).lineWidth(5).strokeColor('#E0E0E0').stroke();
  doc.circle(480, 82, 30).lineWidth(5).strokeColor('#FF4C4C').stroke();
  doc.fontSize(16).fillColor('#FF4C4C').text(`${totalScore}%`, 430, 75, { align: 'center' });
  doc.moveDown(2);
  doc.fillColor('#FFFFFF').rect(50, 200, 500, 20).fill('#1E88E5');
  doc.fillColor('#FFFFFF').fontSize(12).font('Helvetica-Bold').text('OVERALL RESULT', 55, 205);

  doc.font('Helvetica-Bold').fontSize(12);


  const cellPadding = 5; // Padding inside cells
  const rowHeight = 20; // Height of each row
  const colWidths = [90, 90, 90, 90, 90, 75, 75];

  // Draw the header row background
  doc.fillColor('#e8e8e8').rect(50, 250, colWidths.reduce((a, b) => a + b, 0), rowHeight).fill(); // Brown background for header

  // Set the text color to black for the header row
  doc.fillColor('#000000');
  tableData[0].forEach((header, i) => {
    doc.text(header, 50 + colWidths[i] * i + cellPadding, 250 + cellPadding);
  });

  let yPosition = 250 + rowHeight; // Set initial Y position for rows
  doc.font('Helvetica').fontSize(12); // Set font to regular for remaining rows
  doc.fillColor('#000000'); // Reset text color for rows

  // Draw table rows (starting from the second row)
  doc.font('Helvetica').fontSize(12);
  for (let i = 1; i < tableData.length; i++) {
    const row = tableData[i];
    row.forEach((cell, j) => {
      doc.text(cell, 50 + colWidths[j] * j + cellPadding, yPosition + cellPadding);
    });
    yPosition += rowHeight; // Move to the next row
  }

  doc.strokeColor('#000000');

  // Draw the table borders (optional)
  doc.rect(50, 250, colWidths.reduce((a, b) => a + b, 0), yPosition - 250).stroke();

  // Draw vertical borders (column lines)
  let xOffset = 50;
  colWidths.forEach(width => {
    doc.moveTo(xOffset, 250).lineTo(xOffset, yPosition).stroke();
    xOffset += width;
  });

  // Draw horizontal borders (row lines)
  // Draw horizontal borders (row lines)
  for (let i = 0; i <= tableData.length; i++) {
    doc.moveTo(50, 250 + i * rowHeight).lineTo(50 + colWidths.reduce((a, b) => a + b, 0), 250 + i * rowHeight).stroke();
  }

  doc.moveDown(2);
  // Define the coordinates for the indicator line
  const indicatorX = 50; // Starting X position for the indicator line
  const indicatorY = 325; // Y position where the indicator line will be drawn
  // Set font and font size for the text
  doc.font('Helvetica').fontSize(12);

  // Draw "Incorrect" indicator with red color
  doc.circle(indicatorX, indicatorY, 5) // Small circle for "radio" effect
    .fillColor('#FF0000') // Red color
    .fill();
  doc.fillColor('#FF0000').text('Incorrect', indicatorX + 15, indicatorY - 5); // Text next to the circle

  // Draw "Correct" indicator with green color
  doc.circle(indicatorX + 100, indicatorY, 5) // Small circle for "radio" effect
    .fillColor('#008000') // Green color
    .fill();
  doc.fillColor('#008000').text('Correct', indicatorX + 115, indicatorY - 5); // Text next to the circle

  // Reset fill color for further text
  doc.fillColor('#000000');

  userAnswers.forEach((answer, index) => {

    const { questionId, questionText, userAnswer, isCorrect, writeOption } = answer;
    const question = questionMap.get(questionId);

    // Draw category section background with padding and color
    doc.fillColor('#FFFFFF').rect(50, doc.y, 500, 20).fill('#1E88E5');
    doc.fillColor('#FFFFFF').fontSize(12).font('Helvetica-Bold').text(` ${nosName}  Time Taken: "0 Min 19 Sec" - EASY`, 55, doc.y + 5);

    // Move down a little to start question text
    doc.moveDown();

    // Display the question text
    doc.fillColor('#000000').font('Helvetica-Bold').text(`Q: ${questionText}`);
    doc.moveDown(0.5);

    const options = ['optionA', 'optionB', 'optionC', 'optionD'];
    // Loop through options and apply colors based on conditions
    options.forEach((optionKey, i) => {
      const optionValue = question[optionKey];

      // Format userAnswer and writeOption to match the options format (A, B, C, D)
      const formattedUserAnswer = userAnswer.replace(/option/i, "").toUpperCase(); // Ensure answer is A, B, C, or D
      const formattedWriteOption = writeOption.replace(/option/i, "").toUpperCase(); // Ensure the writeOption is also A, B, C, or D

      // Set default color
      let color = 'black';

      // If the user selected this option and it is the correct answer, color it green
      if (isCorrect && formattedUserAnswer === String.fromCharCode(65 + i)) {
        color = 'green'; // Correct option selected
      }

      // If the user selected this option and it is the wrong answer, color it red
      else if (!isCorrect && formattedUserAnswer === String.fromCharCode(65 + i)) {
        color = 'red'; // Incorrect option selected
      }

      // If this option is the correct option but user selected the wrong answer, color the correct option in green
      if (!isCorrect && formattedWriteOption === String.fromCharCode(65 + i)) {
        color = 'green'; // Correct option highlighted if user was wrong
      }


      // Display the option with the correct color
      doc.fillColor(color).text(`Option ${String.fromCharCode(65 + i)}: ${optionValue}`);
      doc.moveDown(0.2);
    });

    // Add spacing after each question block
    doc.moveDown(1);
  });

  //  // Add border around each question for a cleaner look
  //  doc.rect(50, 100, 500, doc.y - 100).stroke(); // Draw border for the entire document

  // Draw category section background with padding and color
  doc.fillColor('#FFFFFF').rect(50, doc.y, 500, 20).fill('#1E88E5');
  doc.fillColor('#FFFFFF').fontSize(12).font('Helvetica-Bold').text(`candidate Images`, 55, doc.y + 5);

  // Move down a little to start question text
  doc.moveDown();

  doc.image(images, 55, doc.y, { fit: [200, 200], align: 'center', valign: 'center' });

  // Handle images (place them in the last pages)
  if (Array.isArray(images) && images.length > 0) {
    images.forEach((imageBase64, index) => {
      doc.addPage(); // Add a new page for each image (optional)
      doc.fontSize(12).text(`Image ${index + 1}:`, { align: 'left' });

      // Adding image to the document (e.g., with a width of 200 and height of 200)
      doc.image(imageBase64, { fit: [200, 200], align: 'center', valign: 'center' });

      doc.moveDown(2);
    });
  } else if (images) {

    // Draw category section background with padding and color
    doc.fillColor('#FFFFFF').rect(50, doc.y, 500, 20).fill('#1E88E5');
    doc.fillColor('#FFFFFF').fontSize(12).font('Helvetica-Bold').text(`Candidate Image`, 55, doc.y + 5);

    // Move down a little to start question text
    doc.moveDown();
    // If images is a single string or base64, treat it as a single image
    doc.addPage(); // Add a page for the single image
    doc.fontSize(12).text('Image:', { align: 'left' });

    doc.image(images, 50, doc.y, { fit: [200, 200], align: 'center', valign: 'center' });

    doc.moveDown(2);
  } else {
    doc.fontSize(12).text('No images provided', { align: 'center' });
    doc.moveDown(2);
  }

  doc.end();

  return pdfPath
}



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

//download pdf
const downloadPdf = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const pdfDir = path.join(__dirname, 'exam_results');
    const pdfPath = path.join(pdfDir, `${candidateId}_exam.pdf`);

    if (fs.existsSync(pdfPath)) {
      res.download(pdfPath, `${candidateId}_exam_report.pdf`, (err) => {
        if (err) {
          console.error("Error while downloading the file:", err);
          return res.status(500).json({ error: 'Error downloading the file' });
        }
      });
    } else {
      return res.status(404).json({ error: 'PDF not found' });
    }
  } catch (error) {
    console.error('Error during PDF download:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


//get exam result
// Function to get candidate logs with filters
const getCandidateLogs = async (req, res) => {
  try {
    const {
      jobRole, // job role filter
      batchName, // batch name filter
      examStartDate, // exam start date filter
      examEndDate, // exam end date filter
    } = req.query;

    // Build filter object dynamically
    let filters = {};

    if (jobRole) {
      filters['candidateId.jobRole'] = jobRole;
    }

    if (batchName) {
      filters['candidateId.batchName'] = batchName;
    }

    if (examStartDate && examEndDate) {
      filters['submissionTime'] = {
        $gte: new Date(examStartDate),
        $lte: new Date(examEndDate),
      };
    }

    // Fetch the candidate logs from ExamResponse schema
    const candidateLogs = await ExamResponseModel.find({
      ...filters,

    })
      .populate({
        path: 'questionBankId'
      })
      .populate('candidateId')
      .populate('assessorId','firstName')
      .populate('nosID')
      .exec();


    // Format the response data
    const formattedLogs = candidateLogs.map((log) => {

      let theoryMarks = 0,
        practicalMarks = 0,
        vivaMarks = 0;
      let totalMarks = 0;

      if (log.userAnswers) {
        log.userAnswers.forEach((answer) => {
          const questionType = log.questionBankId?.type;

          if (answer.marks) {
            if (questionType === 'Theory') {
              theoryMarks += answer.marks;
            } else if (questionType === 'Practical') {
              practicalMarks += answer.marks;
            } else if (questionType === 'Viva') {
              vivaMarks += answer.marks;
            }
          }
        });
      }

      totalMarks = theoryMarks + practicalMarks + vivaMarks;

      const totalPossibleMarks = 100; // Adjust as needed
      const totalPercentage = (totalMarks / totalPossibleMarks) * 100;
      const result = totalPercentage >= 33 ? 'Pass' : 'Fail';

      return {
        candidateId: log.candidateId._id,
        candidateName: log.candidateId?.CandidateName,
        contactNo: log.candidateId?.ContactNumber,
        emailId: log.candidateId?.Email,
        enrollmentNo: log.candidateId?.EnrollmentNumber,
        batchId: log.candidateId?.Batch,
        jobRoleName: log.candidateId?.job_Role,
        theoryAssessmentDate: log.submissionTime,
        practicalAssessmentDate: null,
        vivaAssessmentDate: null,
        theoryMarks,
        practicalMarks,
        vivaMarks,
        totalMarks,
        totalPercentage,
        result,
        assessor: log.assessorId, // Include assessor details
        nos: log.nosID 
      };
    });

    res.json({ success: true, data: formattedLogs });
  } catch (error) {
    console.error('Error fetching candidate logs:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


const getQuestionBankByJobRoleName = async (req, res) => {
  try {
    const { jobRole } = req.params;

    const data = await QuestionBankModel.findOne({ jobRoleName: jobRole })

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error('Error during PDF download:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const candidateLogin = async (req, res) => {
  try {
    const { enrollmentNumber, password } = req.body;
  console.log('enrollmentnum',enrollmentNumber)
    let questionBank;
    let batchDetail
    // Check if all required fields are provided
    if (!enrollmentNumber) {
      return res.status(400).json({ res: false, msg: 'Missing Enrollmentnumber fields!' });
    }

    // Check if all required fields are provided
    // if (!password) {
    //   return res.status(400).json({ res: false, msg: 'Enter Correct Password!' });
    // }

    // Find candidate with matching login details
    const candidate = await condidateDetailsModel.findOne({
      EnrollmentNumber: enrollmentNumber
    });
    console.log('candiate',candidate)

    if (candidate) {

      batchDetail = await bulkBatchUploadModel.findOne({
        jobRoleName: candidate.job_Role
      });

      if (!batchDetail) {
        return res.status(404).json({ res: false, msg: 'No active question bank found!' });
      }

      questionBank = await QuestionBankModel.findOne({
        jobRoleName: candidate.job_Role
      });


      nosDetail = await NosModel.find(
        { jobRoleName: candidate.job_Role },
        'nosName nosCode' // Fields to include in the result
      );

      sectorDetail = await sectorModel.findOne(
        { name: candidate.sector },  // Matching sector IDs

      )

      if (sectorDetail) {
        assessorDetail = await AssessorModel.find(
          { assginedSectorsIds: { $in: [sectorDetail._id] } },  // Matching sector IDs
          'firstName lastName'
        )
      }

      if (!questionBank) {
        return res.status(404).json({ res: false, msg: 'No active question bank found!' });
      }

    }

    if (!candidate) {
      // Candidate not found
      return res.status(401).json({ res: false, msg: 'Invalid login details!' });
    }

    // Successful login
    return res.status(200).json({
      res: true,
      msg: 'Login successful!',
      candidate: {
        id: candidate._id,
        candidateName: candidate.CandidateName,
        email: candidate.Email,
        batchName: candidate.Batch,
        enrollmentNumber: candidate.EnrollmentNumber,
        sector: candidate.sector,
        job_Role: candidate.job_Role,
        status: candidate.status,
        assginedSectorsId: candidate.assginedSectorsId,
        questionBankId: questionBank._id,
        batchImageCaptureTime: batchDetail.batchImageCaptureTime,
        batchStartTime: batchDetail.startTime,
        batchEndTime: batchDetail.endTime,
        batchStartDate: batchDetail.startDate,
        batchEndDate: batchDetail.endDate,
        nosDetails: nosDetail,
        assessorDetail: assessorDetail
      }
    });
  } catch (error) {
    console.error('Error during candidate login:', error);
    return res.status(500).json({ res: false, msg: 'Internal server error' });
  }
};

const getCondidateDetailById = async (req, res) => {
  try {
    // Extract candidateId from the request parameters
    const { candidateId } = req.params;

    // Find candidate by ID
    const candidate = await condidateDetailsModel.findById(candidateId);

    // If candidate not found, return a 404 response
    if (!candidate) {
      return res.status(404).json({
        res: false,
        msg: 'Candidate not found',
      });
    }

    // Return candidate details
    return res.status(200).json({
      res: true,
      data: candidate,
    });
  } catch (error) {
    console.error('Error fetching candidate details:', error);
    return res.status(500).json({
      res: false,
      msg: 'Something went wrong',
    });
  }
};




module.exports = {
  ulpoadDocument, getAllQuestions, submitExam, getUploadDocumentById, getClientQuestionDetails, downloadPdf, getCandidateLogs, getQuestionBankByJobRoleName, candidateLogin,
  getCondidateDetailById
};
