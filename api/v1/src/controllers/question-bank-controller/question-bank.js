const SectorModel = require("../../models/sector.model")
const ClientModel = require("../../models/client.model")
const AdminModel = require("../../models/admin.model");
const QuestionBankModel = require("../../models/question-bank.model")
const JobRoleModel = require('../../models/job-role.model')
const SpocPersonModel = require('../../models/spoc-person.model')
const ChildUserModel = require("../../models/child.user.model")

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

module.exports = {
  questionBankAdd,
  questionBankList,
  questionBankRemove,
  questionBankEdit,
  questionBankStatus
}