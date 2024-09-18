const SectorModel = require("../../models/sector.model")
const ClientModel = require("../../models/client.model")
const AdminModel = require("../../models/admin.model");
const QuestionBankModel = require("../../models/question-bank.model")
const JobRoleModel = require('../../models/job-role.model')
const NosModel = require("../../models/nos.model")
const QuestionModel = require('../../models/question.model')
const questionBulkModel = require('../../models/questionBulk')
const SpocPersonModel = require('../../models/spoc-person.model')
const ChildUserModel = require("../../models/child.user.model")
const fs = require('fs');
const xlsx = require('xlsx');
const moment = require('moment-timezone');


const questionCreate = async (req, res) => {
  try {
    if (req.user.loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      const {
        questionBankId,
        nosId,
        difficultyLevel,
        questionMarks,
        questionType,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        writeOption
      } = req.body
      const isQuestionBank = await QuestionBankModel.findOne({ _id: questionBankId })

      if (!isQuestionBank) {
        return res.json({
          res: false,
          msg: 'QuestionBank is not found!',
        });
      }

      const isNos = await NosModel.findOne({ _id: nosId })
      if (!isNos) {
        return res.json({
          res: false,
          msg: 'Nos is not found!',
        });
      }

      if (req.files) {
        await QuestionModel.create({
          questionBankId: isQuestionBank._id,
          questionBankName: isQuestionBank.questionBankName,
          nosId: isNos._id,
          nosName: isNos.nosName,
          difficultyLevel: difficultyLevel,
          questionMarks: questionMarks,
          questionType: questionType,
          question: req.body.question ? question : "",
          attatchment: req.files.attatchment ? `/upload/${req.files.attatchment[0].filename}` : "",
          optionA: req.body.optionA ? optionA : "",
          optionAAttatchment: req.files.optionAAttatchment ? `/upload/${req.files.optionAAttatchment[0].filename}` : "",
          optionB: req.body.optionB ? optionB : "",
          optionBAttatchment: req.files.optionBAttatchment ? `/upload/${req.files.optionBAttatchment[0].filename}` : "",
          optionC: req.body.optionC ? optionC : "",
          optionCAttatchment: req.files.optionCAttatchment ? `/upload/${req.files.optionCAttatchment[0].filename}` : "",
          optionD: req.body.optionD ? optionD : "",
          optionDAttatchment: req.files.optionDAttatchment ? `/upload/${req.files.optionDAttatchment[0].filename}` : "",
          writeOption: writeOption,
          clientId: isClient._id,
          clientName: isClient.clientName,
          createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          createdById: isClient._id,
          createdByName: isClient.clientName,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isClient.clientName,
          lastUpdatedById: isClient._id,
          status: "Active"
        })
      } else {
        await QuestionModel.create({
          questionBankId: isQuestionBank._id,
          questionBankName: isQuestionBank.questionBankName,
          nosId: isNos._id,
          nosName: isNos.nosName,
          difficultyLevel: difficultyLevel,
          questionMarks: questionMarks,
          questionType: questionType,
          question: req.body.question ? question : "",
          attatchment: "",
          optionA: req.body.optionA ? optionA : "",
          optionAAttatchment: "",
          optionB: req.body.optionB ? optionB : "",
          optionBAttatchment: "",
          optionC: req.body.optionC ? optionC : "",
          optionCAttatchment: "",
          optionD: req.body.optionD ? optionD : "",
          optionDAttatchment: "",
          writeOption: writeOption,
          clientId: isClient._id,
          clientName: isClient.clientName,
          createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          createdById: isClient._id,
          createdByName: isClient.clientName,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isClient.clientName,
          lastUpdatedById: isClient._id,
          status: "Active"
        })
      }

      return res.json({
        res: true,
        msg: "Successfully Question Create."
      })
    }

    if (req.user.loginType == "spoc-person") {
      const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
      if (!isSpocPerson) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }


      const {
        questionBankId,
        nosId,
        difficultyLevel,
        questionMarks,
        questionType,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        writeOption
      } = req.body
      const isQuestionBank = await QuestionBankModel.findOne({ _id: questionBankId })

      if (!isQuestionBank) {
        return res.json({
          res: false,
          msg: 'QuestionBank is not found!',
        });
      }

      const isNos = await NosModel.findOne({ _id: nosId })
      if (!isNos) {
        return res.json({
          res: false,
          msg: 'Nos is not found!',
        });
      }

      if (req.files) {
        await QuestionModel.create({
          questionBankId: isQuestionBank._id,
          questionBankName: isQuestionBank.questionBankName,
          nosId: isNos._id,
          nosName: isNos.nosName,
          difficultyLevel: difficultyLevel,
          questionMarks: questionMarks,
          questionType: questionType,
          question: req.body.question ? question : "",
          attatchment: req.files.attatchment ? `/upload/${req.files.attatchment[0].filename}` : "",
          optionA: req.body.optionA ? optionA : "",
          optionAAttatchment: req.files.optionAAttatchment ? `/upload/${req.files.optionAAttatchment[0].filename}` : "",
          optionB: req.body.optionB ? optionB : "",
          optionBAttatchment: req.files.optionBAttatchment ? `/upload/${req.files.optionBAttatchment[0].filename}` : "",
          optionC: req.body.optionC ? optionC : "",
          optionCAttatchment: req.files.optionCAttatchment ? `/upload/${req.files.optionCAttatchment[0].filename}` : "",
          optionD: req.body.optionD ? optionD : "",
          optionDAttatchment: req.files.optionDAttatchment ? `/upload/${req.files.optionDAttatchment[0].filename}` : "",
          writeOption: writeOption,
          clientId: isClient._id,
          clientName: isClient.clientName,
          createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          createdById: isClient._id,
          createdByName: isClient.clientName,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isClient.clientName,
          lastUpdatedById: isClient._id,
          status: "Active",
          spocCreatedById: isSpocPerson._id,
          spocCreatedByName: isSpocPerson.spocPersonName
        })
      } else {
        await QuestionModel.create({
          questionBankId: isQuestionBank._id,
          questionBankName: isQuestionBank.questionBankName,
          nosId: isNos._id,
          nosName: isNos.nosName,
          difficultyLevel: difficultyLevel,
          questionMarks: questionMarks,
          questionType: questionType,
          question: req.body.question ? question : "",
          attatchment: "",
          optionA: req.body.optionA ? optionA : "",
          optionAAttatchment: "",
          optionB: req.body.optionB ? optionB : "",
          optionBAttatchment: "",
          optionC: req.body.optionC ? optionC : "",
          optionCAttatchment: "",
          optionD: req.body.optionD ? optionD : "",
          optionDAttatchment: "",
          writeOption: writeOption,
          clientId: isClient._id,
          clientName: isClient.clientName,
          createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          createdById: isClient._id,
          createdByName: isClient.clientName,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isClient.clientName,
          lastUpdatedById: isClient._id,
          status: "Active",
          spocCreatedById: isSpocPerson._id,
          spocCreatedByName: isSpocPerson.spocPersonName
        })
      }

      return res.json({
        res: true,
        msg: "Successfully Question Create."
      })

    }
    if (req.user.loginType == "Child-User") {
      console.log("sdfsdfgsdfgsd");
      const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
      if (!isChildUser) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      const isClient = await ClientModel.findOne({ _id: isChildUser.clientId })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const {
        questionBankId,
        nosId,
        difficultyLevel,
        questionMarks,
        questionType,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        writeOption
      } = req.body
      const isQuestionBank = await QuestionBankModel.findOne({ _id: questionBankId })

      if (!isQuestionBank) {
        return res.json({
          res: false,
          msg: 'QuestionBank is not found!',
        });
      }

      const isNos = await NosModel.findOne({ _id: nosId })
      if (!isNos) {
        return res.json({
          res: false,
          msg: 'Nos is not found!',
        });
      }

      if (req.files) {
        await QuestionModel.create({
          questionBankId: isQuestionBank._id,
          questionBankName: isQuestionBank.questionBankName,
          nosId: isNos._id,
          nosName: isNos.nosName,
          difficultyLevel: difficultyLevel,
          questionMarks: questionMarks,
          questionType: questionType,
          question: req.body.question ? question : "",
          attatchment: req.files.attatchment ? `/upload/${req.files.attatchment[0].filename}` : "",
          optionA: req.body.optionA ? optionA : "",
          optionAAttatchment: req.files.optionAAttatchment ? `/upload/${req.files.optionAAttatchment[0].filename}` : "",
          optionB: req.body.optionB ? optionB : "",
          optionBAttatchment: req.files.optionBAttatchment ? `/upload/${req.files.optionBAttatchment[0].filename}` : "",
          optionC: req.body.optionC ? optionC : "",
          optionCAttatchment: req.files.optionCAttatchment ? `/upload/${req.files.optionCAttatchment[0].filename}` : "",
          optionD: req.body.optionD ? optionD : "",
          optionDAttatchment: req.files.optionDAttatchment ? `/upload/${req.files.optionDAttatchment[0].filename}` : "",
          writeOption: writeOption,
          clientId: isClient._id,
          clientName: isClient.clientName,
          createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          createdById: isClient._id,
          createdByName: isClient.clientName,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isClient.clientName,
          lastUpdatedById: isClient._id,
          status: "Active",
          spocCreatedById: isChildUser._id,
          spocCreatedByName: isChildUser.childUserName,
          childUserCreatedById: isChildUser._id,
          childUserCreatedByName: isChildUser.childUserName
        })
      } else {
        await QuestionModel.create({
          questionBankId: isQuestionBank._id,
          questionBankName: isQuestionBank.questionBankName,
          nosId: isNos._id,
          nosName: isNos.nosName,
          difficultyLevel: difficultyLevel,
          questionMarks: questionMarks,
          questionType: questionType,
          question: req.body.question ? question : "",
          attatchment: "",
          optionA: req.body.optionA ? optionA : "",
          optionAAttatchment: "",
          optionB: req.body.optionB ? optionB : "",
          optionBAttatchment: "",
          optionC: req.body.optionC ? optionC : "",
          optionCAttatchment: "",
          optionD: req.body.optionD ? optionD : "",
          optionDAttatchment: "",
          writeOption: writeOption,
          clientId: isClient._id,
          clientName: isClient.clientName,
          createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          createdById: isClient._id,
          createdByName: isClient.clientName,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isClient.clientName,
          lastUpdatedById: isClient._id,
          status: "Active",
          spocCreatedById: isSpocPerson._id,
          spocCreatedByName: isSpocPerson.spocPersonName,
          childUserCreatedById: isChildUser._id,
          childUserCreatedByName: isChildUser.childUserName
        })
      }

      return res.json({
        res: true,
        msg: "Successfully Question Create."
      })


    }

  } catch (error) {
    console.log(error);
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const questionList = async (req, res) => {
  try {
    if (req.user.loginType == "Client") {
      const { page = 1, limit = 10 } = req.query;
      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };
      let query = { questionBankId: req.params.id };

      const questionData = await QuestionModel.paginate(query, options);

      return res.json({
        res: true,
        msg: 'Success',
        data: questionData.docs,
        paginate: {
          totalDocs: questionData.totalDocs,
          limit: questionData.limit,
          totalPages: questionData.totalPages,
          page: questionData.page,
          pagingCounter: questionData.pagingCounter,
          hasPrevPage: questionData.hasPrevPage,
          hasNextPage: questionData.hasNextPage,
          prevPage: questionData.prevPage,
          nextPage: questionData.nextPage
        }
      })
    }

    if (req.user.loginType == "spoc-person") {
      const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
      if (!isSpocPerson) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      const { page = 1, limit = 10 } = req.query;
      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };
      let query = { questionBankId: req.params.id, spocCreatedById: isSpocPerson._id };

      const questionData = await QuestionModel.paginate(query, options);

      return res.json({
        res: true,
        msg: 'Success',
        data: questionData.docs,
        paginate: {
          totalDocs: questionData.totalDocs,
          limit: questionData.limit,
          totalPages: questionData.totalPages,
          page: questionData.page,
          pagingCounter: questionData.pagingCounter,
          hasPrevPage: questionData.hasPrevPage,
          hasNextPage: questionData.hasNextPage,
          prevPage: questionData.prevPage,
          nextPage: questionData.nextPage
        }
      })
    }
    if (req.user.loginType == "Child-User") {
      const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
      if (!isChildUser) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      const isClient = await ClientModel.findOne({ _id: isChildUser.clientId })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      const { page = 1, limit = 10 } = req.query;
      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };
      let query = { questionBankId: req.params.id, childUserCreatedById: isChildUser._id };

      const questionData = await QuestionModel.paginate(query, options);

      return res.json({
        res: true,
        msg: 'Success',
        data: questionData.docs,
        paginate: {
          totalDocs: questionData.totalDocs,
          limit: questionData.limit,
          totalPages: questionData.totalPages,
          page: questionData.page,
          pagingCounter: questionData.pagingCounter,
          hasPrevPage: questionData.hasPrevPage,
          hasNextPage: questionData.hasNextPage,
          prevPage: questionData.prevPage,
          nextPage: questionData.nextPage
        }
      })
    }

  } catch (error) {
    console.log(error);
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const questionRemove = async (req, res) => {
  try {

    if (req.user.loginType == "Client") {
      const isQuestion = await QuestionModel.findOne({ _id: req.params.id })
      if (!isQuestion) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      await QuestionModel.deleteOne({ _id: isQuestion._id })

      return res.json({
        res: true,
        msg: 'Successfully question Remove.',
      })
    }

    if (req.user.loginType == "spoc-person") {
      const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
      if (!isSpocPerson) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isQuestion = await QuestionModel.findOne({ _id: req.params.id })
      if (!isQuestion) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      await QuestionModel.deleteOne({ _id: isQuestion._id })

      return res.json({
        res: true,
        msg: 'Successfully question Remove.',
      })
    }
    if (req.user.loginType == "Child-User") {
      const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
      if (!isChildUser) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isClient = await ClientModel.findOne({ _id: isChildUser.clientId })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      const isQuestion = await QuestionModel.findOne({ _id: req.params.id })
      if (!isQuestion) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      await QuestionModel.deleteOne({ _id: isQuestion._id })
      return res.json({
        res: true,
        msg: 'Successfully question Remove.',
      })

    }

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const questionStatusChange = async (req, res) => {
  try {

    const isQuestion = await QuestionModel.findOne({ _id: req.params.id })
    if (!isQuestion) {
      return res.json({
        res: false,
        msg: 'Somthing Went To Wrong!',
      });
    }

    if (req.user.loginType == "Client") {

      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      if (isQuestion.status == "Active") {

        await QuestionModel.updateOne({ _id: isQuestion._id }, {
          $set: {
            status: "Inactive",
            lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            lastUpdatedByName: isClient.clientName,
            lastUpdatedById: isClient._id,
          }
        })

        return res.json({
          res: true,
          status: "Inactive",
          msg: 'Successfully Question is Inactive.',
        });

      }

      await QuestionModel.updateOne({ _id: isQuestion._id }, {
        $set: {
          status: "Active",
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isClient.clientName,
          lastUpdatedById: isClient._id,
        }
      })

      return res.json({
        res: true,
        status: "Active",
        msg: 'Successfully Question is Active.',
      });
    }

    if (req.user.loginType == "Admin") {

      const isAdmin = await AdminModel.findOne({ email: req.user.email })
      if (!isAdmin) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      if (isQuestion.status == "Active") {

        await QuestionModel.updateOne({ _id: isQuestion._id }, {
          $set: {
            status: "Inactive",
            lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            lastUpdatedByName: isAdmin.userName,
            lastUpdatedById: isAdmin._id,
          }
        })

        return res.json({
          res: true,
          status: "Inactive",
          msg: 'Successfully Question is Inactive.',
        });

      }

      await QuestionModel.updateOne({ _id: isQuestion._id }, {
        $set: {
          status: "Active",
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isAdmin.userName,
          lastUpdatedById: isAdmin._id,
        }
      })

      return res.json({
        res: true,
        status: "Active",
        msg: 'Successfully Question is Active.',
      });
    }

    if (req.user.loginType == "spoc-person") {

      const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
      if (!isSpocPerson) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      if (isQuestion.status == "Active") {
        await QuestionModel.updateOne({ _id: isQuestion._id }, {
          $set: {
            status: "Inactive",
            lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            lastUpdatedByName: isSpocPerson.spocPersonName,
            lastUpdatedById: isSpocPerson._id,
          }
        })

        return res.json({
          res: true,
          status: "Inactive",
          msg: 'Successfully Question is Inactive.',
        });
      }

      await QuestionModel.updateOne({ _id: isQuestion._id }, {
        $set: {
          status: "Active",
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isSpocPerson.spocPersonName,
          lastUpdatedById: isSpocPerson._id,
        }
      })

      return res.json({
        res: true,
        status: "Active",
        msg: 'Successfully Question is Active.',
      });
    }
    if (req.user.loginType == "Child-User") {
      const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
      if (!isChildUser) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      const isClient = await ClientModel.findOne({ _id: isChildUser.clientId })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      if (isQuestion.status == "Active") {
        await QuestionModel.updateOne({ _id: isQuestion._id }, {
          $set: {
            status: "Inactive",
            lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            lastUpdatedByName: isChildUser.emailId,
            lastUpdatedById: isChildUser._id,
          }
        })

        return res.json({
          res: true,
          status: "Inactive",
          msg: 'Successfully Question is Inactive.',
        });
      }

      await QuestionModel.updateOne({ _id: isQuestion._id }, {
        $set: {
          status: "Active",
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isChildUser.emailId,
          lastUpdatedById: isChildUser._id,
        }
      })
      return res.json({
        res: true,
        status: "Active",
        msg: 'Successfully Question is Active.',
      });

    }

    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const questionEdit = async (req, res) => {
  try {
    const isQuestion = await QuestionModel.findOne({ _id: req.params.id });
    if (!isQuestion) {
      return res.json({
        res: false,
        msg: 'Question not found!',
      });
    }
    const isQuestionBank = await QuestionBankModel.findOne({ _id: req.body.questionBankId });
    if (!isQuestionBank) {
      return res.json({
        res: false,
        msg: 'QuestionBank is not found!',
      });
    }
    const isNos = await NosModel.findOne({ _id: req.body.nosId });
    if (!isNos) {
      return res.json({
        res: false,
        msg: 'Nos is not found!',
      });
    }
    let user = null;
    let lastUpdatedByName = null;
    let lastUpdatedById = null;
    let userType = req.user.loginType;

    if (userType === "Client") {
      user = await ClientModel.findOne({ clientEmail: req.user.email });
      if (!user) {
        return res.json({
          res: false,
          msg: 'Something went wrong!',
        });
      }
      lastUpdatedByName = user.clientName;
      lastUpdatedById = user._id;
    } 
    else if (userType === "spoc-person") {
      user = await SpocPersonModel.findOne({ emailId: req.user.email });
      if (!user) {
        return res.json({
          res: false,
          msg: 'Something went wrong!',
        });
      }
      lastUpdatedByName = user.spocPersonName;
      lastUpdatedById = user._id;
    }
    else if (userType === "Admin") {
      user = await AdminModel.findOne({ email: req.user.email });
      if (!user) {
        return res.json({
          res: false,
          msg: 'Something went wrong!',
        });
      }
    }
    else if (userType === "Child-User") {
      user = await ChildUserModel.findOne({ emailId: req.user.email });
      if (!user) {
        return res.json({
          res: false,
          msg: 'Something went wrong!',
        });
      }
      lastUpdatedByName = user.emailId;
      lastUpdatedById = user._id
      
    }
    const updateFields = {
      questionBankId: req.body.questionBankId || isQuestion.questionBankId,
      questionBankName: req.body.questionBankId ? isQuestionBank.questionBankName : isQuestion.questionBankName,
      nosId: req.body.nosId || isQuestion.nosId,
      nosName: req.body.nosId ? isNos.nosName : isQuestion.nosName,
      difficultyLevel: req.body.difficultyLevel || isQuestion.difficultyLevel,
      questionMarks: req.body.questionMarks || isQuestion.questionMarks,
      questionType: req.body.questionType || isQuestion.questionType,
      question: req.body.question || isQuestion.question,
      optionA: req.body.optionA || isQuestion.optionA,
      optionB: req.body.optionB || isQuestion.optionB,
      optionC: req.body.optionC || isQuestion.optionC,
      optionD: req.body.optionD || isQuestion.optionD,
      writeOption: req.body.writeOption || isQuestion.writeOption,
      lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
      lastUpdatedByName: lastUpdatedByName,
      lastUpdatedById: lastUpdatedById,
    };

    if (req.files) {
      if (req.files.attatchment && req.files.attatchment[0]) {
        updateFields.attatchment = `/upload/${req.files.attatchment[0].filename}`;
      }
      if (req.files.optionAAttatchment && req.files.optionAAttatchment[0]) {
        updateFields.optionAAttatchment = `/upload/${req.files.optionAAttatchment[0].filename}`;
      }
      if (req.files.optionBAttatchment && req.files.optionBAttatchment[0]) {
        updateFields.optionBAttatchment = `/upload/${req.files.optionBAttatchment[0].filename}`;
      }
      if (req.files.optionCAttatchment && req.files.optionCAttatchment[0]) {
        updateFields.optionCAttatchment = `/upload/${req.files.optionCAttatchment[0].filename}`;
      }
      if (req.files.optionDAttatchment && req.files.optionDAttatchment[0]) {
        updateFields.optionDAttatchment = `/upload/${req.files.optionDAttatchment[0].filename}`;
      }
    }

    await QuestionModel.updateOne({ _id: isQuestion._id }, { $set: updateFields });

    return res.json({
      res: true,
      msg: "Successfully updated the question."
    });
    
  } catch (error) {
    console.error("Error in question update", error);
    return res.json({
      res: false,
      msg: 'Something went wrong!',
    });
  }
};

const questionBulkUpload = async (req, res) => {
  try {
    if (req.user.loginType == "Client") {

      const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
      if (!isClient) {
        return res.status(404).json({
          res: false,
          msg: 'Client email not found!',
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'File is missing.' });
      }

      const filePath = req.file.path;
      const file = fs.readFileSync(filePath);
      const workbook = xlsx.read(file, { type: 'buffer' });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        return res.status(400).json({ error: 'No sheets found in the Excel file.' });
      }

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      if (!sheet) {
        return res.status(400).json({ error: `Sheet ${sheetName} not found in the Excel file.` });
      }

      const data = xlsx.utils.sheet_to_json(sheet);
      if (!data || data.length === 0) {
        return res.status(400).json({ error: 'No data found in the Excel sheet.' });
      }

      const questionData = data.map((row) => ({
        questionBankId: row.questionBankId,
        questionBankName: row.questionBankName,
        nosName: row.nosName,
        difficultyLevel: row.difficultyLevel,
        questionMarks: row.questionMarks,
        questionType: row.questionType,
        question: row.question,
        attatchment: row.attatchment,
        optionA: row.optionA,
        optionAAttatchment: row.optionAAttatchment,
        optionB: row.optionB,
        optionBAttatchment: row.optionBAttatchment,
        optionC: row.optionC,
        optionCAttatchment: row.optionCAttatchment,
        optionD: row.optionD,
        optionDAttatchment: row.optionDAttatchment,
        writeOption: row.writeOption,
        clientId: isClient._id,
        clientName: isClient.clientName,
        createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        createdById: isClient._id,
        createdByName: isClient.clientName,
        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        lastUpdatedByName: isClient.clientName,
        lastUpdatedById: isClient._id,
        status: "Active"
      }));

      const createdQuestions = await QuestionModel.create(questionData);

      return res.status(200).json({
        status: true,
        message: 'Bulk upload successful',
        createdQuestions,
        totalUploaded: createdQuestions.length,
        totalRecords: data.length,
        skippedRecords: data.length - createdQuestions.length,
      });
    }

    if (req.user.loginType == "spoc-person") {
      const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
      if (!isSpocPerson) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'File is missing.' });
      }

      const filePath = req.file.path;
      const file = fs.readFileSync(filePath);
      const workbook = xlsx.read(file, { type: 'buffer' });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        return res.status(400).json({ error: 'No sheets found in the Excel file.' });
      }

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      if (!sheet) {
        return res.status(400).json({ error: `Sheet ${sheetName} not found in the Excel file.` });
      }

      const data = xlsx.utils.sheet_to_json(sheet);
      if (!data || data.length === 0) {
        return res.status(400).json({ error: 'No data found in the Excel sheet.' });
      }

      const questionData = data.map((row) => ({
        questionBankId: row.questionBankId,
        questionBankName: row.questionBankName,
        nosName: row.nosName,
        difficultyLevel: row.difficultyLevel,
        questionMarks: row.questionMarks,
        questionType: row.questionType,
        question: row.question,
        attatchment: row.attatchment,
        optionA: row.optionA,
        optionAAttatchment: row.optionAAttatchment,
        optionB: row.optionB,
        optionBAttatchment: row.optionBAttatchment,
        optionC: row.optionC,
        optionCAttatchment: row.optionCAttatchment,
        optionD: row.optionD,
        optionDAttatchment: row.optionDAttatchment,
        writeOption: row.writeOption,
        clientId: isClient._id,
        clientName: isClient.clientName,
        createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        createdById: isClient._id,
        createdByName: isClient.clientName,
        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        lastUpdatedByName: isSpocPerson.spocPersonName,
        lastUpdatedById: isSpocPerson._id,
        status: "Active",
        spocCreatedById: isSpocPerson._id,
        spocCreatedByName: isSpocPerson.spocPersonName
      }));

      const createdQuestions = await QuestionModel.create(questionData);

      return res.status(200).json({
        status: true,
        message: 'Bulk upload successful',
        createdQuestions,
        totalUploaded: createdQuestions.length,
        totalRecords: data.length,
        skippedRecords: data.length - createdQuestions.length,
      });

    }
    if (req.user.loginType == "Child-User") {
      const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
      if (!isChildUser) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isClient = await ClientModel.findOne({ _id: isChildUser.clientId })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'File is missing.' });
      }

      const filePath = req.file.path;
      const file = fs.readFileSync(filePath);
      const workbook = xlsx.read(file, { type: 'buffer' });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        return res.status(400).json({ error: 'No sheets found in the Excel file.' });
      }

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      if (!sheet) {
        return res.status(400).json({ error: `Sheet ${sheetName} not found in the Excel file.` });
      }

      const data = xlsx.utils.sheet_to_json(sheet);
      if (!data || data.length === 0) {
        return res.status(400).json({ error: 'No data found in the Excel sheet.' });
      }

      const questionData = data.map((row) => ({
        questionBankId: row.questionBankId,
        questionBankName: row.questionBankName,
        nosName: row.nosName,
        difficultyLevel: row.difficultyLevel,
        questionMarks: row.questionMarks,
        questionType: row.questionType,
        question: row.question,
        attatchment: row.attatchment,
        optionA: row.optionA,
        optionAAttatchment: row.optionAAttatchment,
        optionB: row.optionB,
        optionBAttatchment: row.optionBAttatchment,
        optionC: row.optionC,
        optionCAttatchment: row.optionCAttatchment,
        optionD: row.optionD,
        optionDAttatchment: row.optionDAttatchment,
        writeOption: row.writeOption,
        clientId: isClient._id,
        clientName: isClient.clientName,
        createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        createdById: isClient._id,
        createdByName: isClient.clientName,
        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        lastUpdatedByName: isSpocPerson.spocPersonName,
        lastUpdatedById: isSpocPerson._id,
        status: "Active",
        childUserCreatedById: isChildUser._id,
        childUserCreatedByName: isChildUser.childUserName
      }));

      const createdQuestions = await QuestionModel.create(questionData);

      return res.status(200).json({
        status: true,
        message: 'Bulk upload successful',
        createdQuestions,
        totalUploaded: createdQuestions.length,
        totalRecords: data.length,
        skippedRecords: data.length - createdQuestions.length,
      });

    }
  } catch (error) {
    console.error('Error in bulk upload', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getQuestionBulkUpload = async (req, res) => {
  try {

    const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
    if (!isClient) {
      return res.status(404).json({
        res: false,
        msg: 'Client email not found!',
      });
    }
    const questions = await questionBulkModel.find({ clientId: isClient._id });
    if (!questions || questions.length === 0) {
      return res.status(404).json({
        res: false,
        msg: 'No questions found for the client!',
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Data fetched successfully',
      data: questions
    });
  } catch (error) {
    console.error('Error fetching data', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  questionCreate,
  questionList,
  questionRemove,
  questionEdit,
  questionStatusChange,
  questionBulkUpload,
  getQuestionBulkUpload
}