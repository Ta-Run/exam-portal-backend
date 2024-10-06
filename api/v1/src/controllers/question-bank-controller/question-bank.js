const SectorModel = require("../../models/sector.model")
const ClientModel = require("../../models/client.model")
const AdminModel = require("../../models/admin.model");
const QuestionBankModel = require("../../models/question-bank.model")
const JobRoleModel = require('../../models/job-role.model')
const SpocPersonModel = require('../../models/spoc-person.model')
const ChildUserModel = require("../../models/child.user.model")
const manageCandidateModel = require("../../models/manageCandidate")
const manageAssessorModel = require("../../models/manage.assessor")
const manageBatchModel = require("../../models/manage-Batch");
const jobRoleModel = require("../../models/job-role.model");
const questionModel = require("../../models/question.model");
const AssessorModel = require("../../models/manage.assessor")
const mongoose = require('mongoose')

const moment = require('moment-timezone');


const questionBankAdd = async (req, res) => {
  try {
    if (req.user.loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      const { assginedSectorsId, jobRoleId, type, questionBankName, practicalType } = req.body
      if (assginedSectorsId == "" || jobRoleId == "" || type == "" || questionBankName == "") {
        return res.json({
          res: false,
          msg: 'All fields required.',
        });
      }

      const isSector = await SectorModel.findOne({ _id: assginedSectorsId });
      if (!isSector) {
        return res.json({
          res: false,
          msg: 'Sector is not found!',
        });
      }

      const isJobRole = await JobRoleModel.findOne({ _id: jobRoleId });
      if (!isJobRole) {
        return res.json({
          res: false,
          msg: 'Job Role is not found!',
        });
      }

      const isQuestionBankName = await QuestionBankModel.findOne({ questionBankName: questionBankName, clientId: isClient._id })
      if (isQuestionBankName) {
        return res.json({
          res: false,
          msg: 'questionBankName is Alrady Exising!',
        });
      }

      await QuestionBankModel.create({
        assginedSectorsId: isSector.id,
        assginedSectorsName: isSector.name,
        jobRoleId: isJobRole.id,
        jobRoleName: isJobRole.jobRoleName,
        type: type,
        practicalType: practicalType != "" ? practicalType : null,
        questionBankName: questionBankName,
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

      return res.json({
        res: true,
        msg: "Successfully Question Bank create."
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

      const { assginedSectorsId, jobRoleId, type, questionBankName, practicalType } = req.body

      if (assginedSectorsId == "" || jobRoleId == "" || type == "" || questionBankName == "") {
        return res.json({
          res: false,
          msg: 'All fields required.',
        });
      }

      const isSector = await SectorModel.findOne({ _id: assginedSectorsId });
      if (!isSector) {
        return res.json({
          res: false,
          msg: 'Sector is not found!',
        });
      }

      const isJobRole = await JobRoleModel.findOne({ _id: jobRoleId });
      if (!isJobRole) {
        return res.json({
          res: false,
          msg: 'Job Role is not found!',
        });
      }

      const isQuestionBankName = await QuestionBankModel.findOne({ questionBankName: questionBankName, clientId: isClient._id })
      if (isQuestionBankName) {
        return res.json({
          res: false,
          msg: 'questionBankName is Alrady Exising!',
        });
      }

      await QuestionBankModel.create({
        assginedSectorsId: isSector.id,
        assginedSectorsName: isSector.name,
        jobRoleId: isJobRole.id,
        jobRoleName: isJobRole.jobRoleName,
        type: type,
        practicalType: practicalType != "" ? practicalType : null,
        questionBankName: questionBankName,
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

      return res.json({
        res: true,
        msg: "Successfully Question Bank create."
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


      const { assginedSectorsId, jobRoleId, type, questionBankName, practicalType } = req.body
      if (assginedSectorsId == "" || jobRoleId == "" || type == "" || questionBankName == "") {
        return res.json({
          res: false,
          msg: 'All fields required.',
        });
      }

      const isSector = await SectorModel.findOne({ _id: assginedSectorsId });
      if (!isSector) {
        return res.json({
          res: false,
          msg: 'Sector is not found!',
        });
      }

      const isJobRole = await JobRoleModel.findOne({ _id: jobRoleId });
      if (!isJobRole) {
        return res.json({
          res: false,
          msg: 'Job Role is not found!',
        });
      }

      const isQuestionBankName = await QuestionBankModel.findOne({ questionBankName: questionBankName, clientId: isClient._id })
      if (isQuestionBankName) {
        return res.json({
          res: false,
          msg: 'questionBankName is Alrady Exising!',
        });
      }

      await QuestionBankModel.create({
        assginedSectorsId: isSector.id,
        assginedSectorsName: isSector.name,
        jobRoleId: isJobRole.id,
        jobRoleName: isJobRole.jobRoleName,
        type: type,
        practicalType: practicalType != "" ? practicalType : null,
        questionBankName: questionBankName,
        clientId: isClient._id,
        clientName: isClient.clientName,
        createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        createdById: isClient._id,
        createdByName: isClient.clientName,
        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        lastUpdatedByName: isClient.clientName,
        lastUpdatedById: isClient._id,
        status: "Active",
        childUserCreatedById: isChildUser._id,
        chiledUserCreatedByEmail: isChildUser.emailId
      })

      return res.json({
        res: true,
        msg: "Successfully Question Bank create."
      })

    }

  } catch (error) {
    console.error("error in add question bank ", error)
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const questionBankList = async (req, res) => {
  try {

    if (req.user.loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
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
      let query = { clientId: isClient._id };

      const QuestionBankData = await QuestionBankModel.paginate(query, options);
      return res.json({
        res: true,
        msg: 'Success',
        data: QuestionBankData.docs,
        paginate: {
          totalDocs: QuestionBankData.totalDocs,
          limit: QuestionBankData.limit,
          totalPages: QuestionBankData.totalPages,
          page: QuestionBankData.page,
          pagingCounter: QuestionBankData.pagingCounter,
          hasPrevPage: QuestionBankData.hasPrevPage,
          hasNextPage: QuestionBankData.hasNextPage,
          prevPage: QuestionBankData.prevPage,
          nextPage: QuestionBankData.nextPage
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
      let query = { clientId: isClient._id, spocCreatedById: isSpocPerson._id };

      const QuestionBankData = await QuestionBankModel.paginate(query, options);
      return res.json({
        res: true,
        msg: 'Success',
        data: QuestionBankData.docs,
        paginate: {
          totalDocs: QuestionBankData.totalDocs,
          limit: QuestionBankData.limit,
          totalPages: QuestionBankData.totalPages,
          page: QuestionBankData.page,
          pagingCounter: QuestionBankData.pagingCounter,
          hasPrevPage: QuestionBankData.hasPrevPage,
          hasNextPage: QuestionBankData.hasNextPage,
          prevPage: QuestionBankData.prevPage,
          nextPage: QuestionBankData.nextPage
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
      let query = { clientId: isClient._id, childUserCreatedById: isChildUser._id };

      const QuestionBankData = await QuestionBankModel.paginate(query, options);
      return res.json({
        res: true,
        msg: 'Success',
        data: QuestionBankData.docs,
        paginate: {
          totalDocs: QuestionBankData.totalDocs,
          limit: QuestionBankData.limit,
          totalPages: QuestionBankData.totalPages,
          page: QuestionBankData.page,
          pagingCounter: QuestionBankData.pagingCounter,
          hasPrevPage: QuestionBankData.hasPrevPage,
          hasNextPage: QuestionBankData.hasNextPage,
          prevPage: QuestionBankData.prevPage,
          nextPage: QuestionBankData.nextPage,

        }
      })
    }

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const questionBankRemove = async (req, res) => {
  try {
    if (req.user.loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isQuestionBank = await QuestionBankModel.findOne({ _id: req.params.id })

      if (!isQuestionBank) {
        return res.json({
          res: true,
          msg: 'Question Bank is not found.'
        })
      }

      await QuestionBankModel.deleteOne({ _id: isQuestionBank._id })

      return res.json({
        res: true,
        msg: 'Successfully Question Bank remove.',
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

      const isQuestionBank = await QuestionBankModel.findOne({ _id: req.params.id })

      if (!isQuestionBank) {
        return res.json({
          res: true,
          msg: 'Question Bank is not found.'
        })
      }

      await QuestionBankModel.deleteOne({ _id: isQuestionBank._id })
      return res.json({
        res: true,
        msg: 'Successfully Question Bank remove.',
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
      const isQuestionBank = await QuestionBankModel.findOne({ _id: req.params.id })
      if (!isQuestionBank) {
        return res.json({
          res: true,
          msg: 'Question Bank is not found.'
        })
      }

      await QuestionBankModel.deleteOne({ _id: isQuestionBank._id })
      return res.json({
        res: true,
        msg: 'Successfully Question Bank remove.',
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

      const isQuestionBank = await QuestionBankModel.findOne({ _id: req.params.id })
      if (!isQuestionBank) {
        return res.json({
          res: true,
          msg: 'Question Bank is not found.'
        })
      }

      await QuestionBankModel.deleteOne({ _id: isQuestionBank._id })
      return res.json({
        res: true,
        msg: 'Successfully Question Bank remove.',
      });
    }
  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const questionBankEdit = async (req, res) => {
  try {

    const isQuestionBank = await QuestionBankModel.findOne({ _id: req.params.id })

    if (!isQuestionBank) {
      return res.json({
        res: false,
        msg: 'Question Bank is not found.'
      })
    }

    const { assginedSectorsId, jobRoleId, type, questionBankName, practicalType } = req.body
    const isSector = await SectorModel.findOne({ _id: assginedSectorsId });

    if (!isSector) {
      return res.json({
        res: false,
        msg: 'Sector is not found!',
      });
    }

    const isJobRole = await JobRoleModel.findOne({ _id: jobRoleId });
    if (!isJobRole) {
      return res.json({
        res: false,
        msg: 'Job Role is not found!',
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

      if (questionBankName) {
        let codeQuery = { questionBankName: questionBankName, clientId: isClient._id };
        if (questionBankName) {
          codeQuery._id = { $ne: isQuestionBank }
        }
        const existingCode = await QuestionBankModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "questionBank Name is already existing!"
          })
        }
      }
      await QuestionBankModel.updateOne({ _id: isQuestionBank._id }, {
        $set: {
          assginedSectorsId: isSector.id,
          assginedSectorsName: isSector.name,
          jobRoleId: isJobRole.id,
          jobRoleName: isJobRole.jobRoleName,
          type: type,
          practicalType: practicalType != "" ? practicalType : null,
          questionBankName: questionBankName,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isClient.clientName,
          lastUpdatedById: isClient._id
        }
      })

      return res.json({
        res: true,
        msg: "Successfully Question Bank update."
      })

    }

    if (req.user.loginType == "Admin") {
      const isAdmin = await AdminModel.findOne({ email: req.user.email })
      if (!isAdmin) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      if (questionBankName) {
        let codeQuery = { questionBankName: questionBankName };
        if (questionBankName) {
          codeQuery._id = { $ne: isQuestionBank }
        }
        const existingCode = await QuestionBankModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "questionBank Name is already existing!"
          })
        }
      }
      await QuestionBankModel.updateOne({ _id: isQuestionBank._id }, {
        $set: {
          assginedSectorsId: isSector.id,
          assginedSectorsName: isSector.name,
          jobRoleId: isJobRole.id,
          jobRoleName: isJobRole.jobRoleName,
          type: type,
          practicalType: practicalType != "" ? practicalType : null,
          questionBankName: questionBankName,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isAdmin.userName,
          lastUpdatedById: isAdmin._id
        }
      })

      return res.json({
        res: true,
        msg: "Successfully Question Bank update."
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

      if (questionBankName) {
        let codeQuery = { questionBankName: questionBankName, clientId: isClient._id };
        if (questionBankName) {
          codeQuery._id = { $ne: isQuestionBank }
        }
        const existingCode = await QuestionBankModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "questionBank Name is already existing!"
          })
        }
      }
      await QuestionBankModel.updateOne({ _id: isQuestionBank._id }, {
        $set: {
          assginedSectorsId: isSector.id,
          assginedSectorsName: isSector.name,
          jobRoleId: isJobRole.id,
          jobRoleName: isJobRole.jobRoleName,
          type: type,
          practicalType: practicalType != "" ? practicalType : null,
          questionBankName: questionBankName,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isSpocPerson.spocPersonName,
          lastUpdatedById: isSpocPerson._id,

        }
      })

      return res.json({
        res: true,
        msg: "Successfully Question Bank update."
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

      if (questionBankName) {
        let codeQuery = { questionBankName: questionBankName, clientId: isClient._id };
        if (questionBankName) {
          codeQuery._id = { $ne: isQuestionBank }
        }
        const existingCode = await QuestionBankModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "questionBank Name is already existing!"
          })
        }
      }
      await QuestionBankModel.updateOne({ _id: isQuestionBank._id }, {
        $set: {
          assginedSectorsId: isSector.id,
          assginedSectorsName: isSector.name,
          jobRoleId: isJobRole.id,
          jobRoleName: isJobRole.jobRoleName,
          type: type,
          practicalType: practicalType != "" ? practicalType : null,
          questionBankName: questionBankName,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isChildUser.emailId,
          lastUpdatedById: isChildUser._id,

        }
      })

      return res.json({
        res: true,
        msg: "Successfully Question Bank update."
      })
    }
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });

  } catch (error) {
    console.error("error in question bank update", error)
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const questionBankStatus = async (req, res) => {
  try {

    const isQuestionBank = await QuestionBankModel.findOne({ _id: req.params.id })

    if (!isQuestionBank) {
      return res.json({
        res: false,
        msg: 'Question Bank is not found.'
      })
    }

    if (req.user.loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      if (isQuestionBank.status == "Active") {
        await QuestionBankModel.updateOne({ _id: isQuestionBank._id }, {
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
          msg: 'Successfully Question Bank is Inactive.',
        });
      }

      await QuestionBankModel.updateOne({ _id: isQuestionBank._id }, {
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
        msg: 'Successfully Question Bank is Active.',
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

      if (isQuestionBank.status == "Active") {
        await QuestionBankModel.updateOne({ _id: isQuestionBank._id }, {
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
          msg: 'Successfully Question Bank is Inactive.',
        });
      }
      await QuestionBankModel.updateOne({ _id: isQuestionBank._id }, {
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
        msg: 'Successfully Question Bank is Active.',
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

      if (isQuestionBank.status == "Active") {
        await QuestionBankModel.updateOne({ _id: isQuestionBank._id }, {
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
          msg: 'Successfully Question Bank is Inactive.',
        });
      }
      await QuestionBankModel.updateOne({ _id: isQuestionBank._id }, {
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
        msg: 'Successfully Question Bank is Active.',
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

      if (isQuestionBank.status == "Active") {
        await QuestionBankModel.updateOne({ _id: isQuestionBank._id }, {
          $set: {
            status: "Inactive",
            lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            childUserCreatedById: isChildUser._id,
            childUserCreatedByName: isChildUser.childUserName,
          }
        })

        return res.json({
          res: true,
          status: "Inactive",
          msg: 'Successfully Question Bank is Inactive.',
        });
      }
      await QuestionBankModel.updateOne({ _id: isQuestionBank._id }, {
        $set: {
          status: "Active",
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          childUserCreatedById: isChildUser._id,
          childUserCreatedByName: isChildUser.childUserName,
        }
      })

      return res.json({
        res: true,
        status: "Active",
        msg: 'Successfully Question Bank is Active.',
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



const getQuestionAnalyticsRecord = async (req, res) => {
  try {
    const questionBankId = req.params.id;  // The question bank ID from the request params
    const { startDate, endDate } = req.query;  // The start and end date from the request query parameter
    const matchConditions = {};
    // Filter by questionBankId
    if (questionBankId) {
      matchConditions.questionBankId = new mongoose.Types.ObjectId(questionBankId);
    }

    // Filter by start and end date (on the createdAt field)
    if (startDate || endDate) {
      matchConditions.createdAt = {};  // Match on createdAt field, timestamps are enabled in the schema
      if (startDate) {
        matchConditions.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        matchConditions.createdAt.$lte = new Date(endDate);
      }
    }

    // Query to fetch data
    const questionData = await questionModel.aggregate([
      { $match: matchConditions },
      {
        $project: {
          _id: 1,
          questionBankName: 1,
          nosName: 1,
          difficultyLevel: 1,
          questionMarks: 1,
          questionType: 1,
          question: 1,
          optionA: 1,
          optionB: 1,
          optionC: 1,
          optionD: 1,
          clientName: 1,
          createdAt: 1,  // The timestamp field
          lastUpdatedAt: 1,  // Last updated field
        },
      },
    ]);

    // Send the result as a JSON response
    res.status(200).json({
      success: true,
      result: questionData,
    });
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getAnalyticsBySector = async (req, res) => {
  try {
    const sectorId = req.params.id;
    const { from, to } = req.query;

    // Use moment to handle the date conversion
    const fromDate = moment(from).startOf('day'); // Set the start of the day
    const toDate = moment(to).endOf('day'); // Set the end of the day

    // Correct instantiation of ObjectId using 'new'
    const sectorObjectId = new mongoose.Types.ObjectId(sectorId);
    
    // Filter by StartDate using moment.js date formatting
    const totalBatches = await manageBatchModel.countDocuments({
      assginedSectorsId: sectorObjectId,
      StartDate: {
        $gte: fromDate.toISOString(),
        $lte: toDate.toISOString()
      }
    });

    const totalCandidates = await manageCandidateModel.countDocuments({
      assginedSectorsId: sectorObjectId, // Use sectorObjectId consistently
      createAt: { $gte: fromDate.toISOString(), $lte: toDate.toISOString() }
    });

    const totalStates = await manageAssessorModel.countDocuments("state");
    const totalDistricts = await manageAssessorModel.countDocuments("district");

    // Aggregation for batch status by state
    const stateBatchStatus = await manageBatchModel.aggregate([
      {
        $match: {
          StartDate: {
            $gte: fromDate.toISOString(),
            $lte: toDate.toISOString()
          }
        }
      },
      {
        $group: {
          _id: "$state",
          stateCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          state: "$_id",
          stateCount: 1
        }
      }
    ]);

    // Aggregation for job role status
    const jobRoleStatus = await jobRoleModel.aggregate([
      {
        $match: {
          createAt: {
            $gte: fromDate.toISOString(),
            $lte: toDate.toISOString()
          }
        }
      },
      {
        $group: {
          _id: "$jobRoleName",
          jobRoleCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          jobRole: "$_id",
          jobRoleCount: 1
        }
      }
    ]);

    // Final Response
    res.status(200).json({
      totalBatches,
      totalCandidates,
      totalStates,
      totalDistricts,
      stateBatchStatus,
      jobRoleStatus,
    });

  } catch (error) {
    console.error("Error in getAnalyticsBySector:", error); // Add logging for better error tracking
    res.status(500).json({ message: 'Server Error', error });
  }
};


const getquesitonBankDropDown = async (req, res) => {
  try {
    if (req.user.loginType == "Client") {

      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })

      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      console.log('isClient ', isClient)
      const questionBankData = await QuestionBankModel.find({}, "_id questionBankName");

      return res.json({
        req: true,
        msg: "success",
        data: questionBankData
      })
    }

    if (req.user.loginType == "Admin") {
      const sectorData = await QuestionBankModel.find({ status: "Active" }, "_id name");
      return res.json({
        req: true,
        msg: "success",
        data: sectorData
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
      const sectorData = await QuestionBankModel.find({ _id: { $in: isSpocPerson.assginedSectorsIds }, status: "Active" }, "_id name");
      return res.json({
        req: true,
        msg: "success",
        data: sectorData
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
      const sectorData = await QuestionBankModel.find({ _id: isChildUser.selectSectorPermissionId, status: "Active" }, "_id name");
      return res.json({
        req: true,
        msg: "success",
        data: sectorData
      })
    }

    return res.json({
      res: false,
      msg: 'Somthing went to wrong.',
    });

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing went to wrong.',
    });
  }
}

//assessors

const getAssessorsDropDown = async (req, res) => {
  try {
    if (req.user.loginType == "Client") {
      const sectorId = req.params.id;
      
      // Convert sectorId to ObjectId if needed
      const sectorObjectId = new mongoose.Types.ObjectId(sectorId);

      // Find assessors where the sectorId exists in the array
      const questionBankData = await AssessorModel.find({
        assginedSectorsIds: sectorObjectId
      },"_id firstName");

      return res.json({
        req: true,
        msg: "success",
        data: questionBankData
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.json({
      res: false,
      msg: 'Something went wrong.',
    });
  }
};



module.exports = {
  questionBankAdd,
  questionBankList,
  questionBankRemove,
  questionBankEdit,
  questionBankStatus,
  getQuestionAnalyticsRecord,
  getAnalyticsBySector,
  getquesitonBankDropDown, getAssessorsDropDown
}