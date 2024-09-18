const SectorModel = require("../../models/sector.model")
const JobRoleModel = require("../../models/job-role.model")
const ClientModel = require("../../models/client.model")
const AdminModel = require("../../models/admin.model");
const NosModel = require("../../models/nos.model")
const nosBulkUpload = require('../../models/nosBulkUpload')
const SpocPersonModel = require("../../models/spoc-person.model")
const ChildUserModel = require("../../models/child.user.model")
const fs = require('fs')
const xlsx = require('xlsx')
const moment = require('moment-timezone');
const mongoose = require('mongoose')

const nosCreate = async (req, res) => {
  try {

    if (req.user.loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      console.log(isClient);
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const { assginedSectorsId, jobRoleId, nosName, nosCode, totalTheoryMarks, totalVivaMarks, totalPracticalMarks } = req.body

      if (assginedSectorsId == "" || jobRoleId == "" || nosName == "" || nosCode == "" || totalTheoryMarks == "" || totalVivaMarks == "" || totalPracticalMarks == "") {
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
      const isCode = await NosModel.findOne({
        nosCode: { $regex: `^${nosCode}$`, $options: 'i' },
        clientId: isClient._id,
      });
      if (isCode) {
        return res.json({
          res: false,
          msg: 'nosCode is  Alrady Exising!',
        });
      }
      const isNosName = await NosModel.findOne({
        nosName: { $regex: `^${nosName}$`, $options: 'i' },
        clientId: isClient._id,
      });

      if (isNosName) {
        return res.json({
          res: false,
          msg: 'nosName is Alrady Exising!',
        });
      }


      await NosModel.create({
        assginedSectorsId: isSector.id,
        assginedSectorsName: isSector.name,
        jobRoleId: isJobRole.id,
        jobRoleName: isJobRole.jobRoleName,
        nosName: nosName,
        nosCode: nosCode,
        totalTheoryMarks: totalTheoryMarks,
        totalVivaMarks: totalVivaMarks,
        totalPracticalMarks: totalPracticalMarks,
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
        msg: "Successfully NOS create."
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

      const { assginedSectorsId, jobRoleId, nosName, nosCode, totalTheoryMarks, totalVivaMarks, totalPracticalMarks } = req.body

      if (assginedSectorsId == "" || jobRoleId == "" || nosName == "" || nosCode == "" || totalTheoryMarks == "" || totalVivaMarks == "" || totalPracticalMarks == "") {
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
      const isCode = await NosModel.findOne({
        nosCode: { $regex: `^${nosCode}$`, $options: 'i' },
        clientId: isClient._id,
      });
      if (isCode) {
        return res.json({
          res: false,
          msg: 'nosCode is  Alrady Exising!',
        });
      }
      const isNosName = await NosModel.findOne({
        nosName: { $regex: `^${nosName}$`, $options: 'i' },
        clientId: isClient._id,
      });

      if (isNosName) {
        return res.json({
          res: false,
          msg: 'nosName is Alrady Exising!',
        });
      }

      await NosModel.create({
        assginedSectorsId: isSector.id,
        assginedSectorsName: isSector.name,
        jobRoleId: isJobRole.id,
        jobRoleName: isJobRole.jobRoleName,
        nosName: nosName,
        nosCode: nosCode,
        totalTheoryMarks: totalTheoryMarks,
        totalVivaMarks: totalVivaMarks,
        totalPracticalMarks: totalPracticalMarks,
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
        spocCreatedByName: isSpocPerson.spocCreatedByName
      })

      return res.json({
        res: true,
        msg: "Successfully NOS create."
      })

    }

    if(req.user.loginType == "Child-User"){
      const isChildUser = await ChildUserModel.findOne({emailId:req.user.email})
      if(!isChildUser){
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isClient = await ClientModel.findOne({_id:isChildUser.clientId})
      if(!isClient){
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const { assginedSectorsId, jobRoleId, nosName, nosCode, totalTheoryMarks, totalVivaMarks, totalPracticalMarks } = req.body

      if (assginedSectorsId == "" || jobRoleId == "" || nosName == "" || nosCode == "" || totalTheoryMarks == "" || totalVivaMarks == "" || totalPracticalMarks == "") {
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
      const isCode = await NosModel.findOne({
        nosCode: { $regex: `^${nosCode}$`, $options: 'i' },
        clientId: isClient._id,
      });
      if (isCode) {
        return res.json({
          res: false,
          msg: 'nosCode is  Alrady Exising!',
        });
      }
      const isNosName = await NosModel.findOne({
        nosName: { $regex: `^${nosName}$`, $options: 'i' },
        clientId: isClient._id,
      });

      if (isNosName) {
        return res.json({
          res: false,
          msg: 'nosName is Alrady Exising!',
        });
      }

      await NosModel.create({
        assginedSectorsId: isSector.id,
        assginedSectorsName: isSector.name,
        jobRoleId: isJobRole.id,
        jobRoleName: isJobRole.jobRoleName,
        nosName: nosName,
        nosCode: nosCode,
        totalTheoryMarks: totalTheoryMarks,
        totalVivaMarks: totalVivaMarks,
        totalPracticalMarks: totalPracticalMarks,
        clientId: isClient._id,
        clientName: isClient.clientName,
        createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        createdById: isClient._id,
        createdByName: isClient.clientName,
        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        lastUpdatedByName: isClient.clientName,
        lastUpdatedById: isClient._id,
        status: "Active",
        chiledUserCreatedById: isChildUser._id,
        chiledUserCreatedByEmail: isChildUser.emailId
      })

      return res.json({
        res: true,
        msg: "Successfully NOS create."
      })


    }


  } catch (error) {
    console.error("error in nos controller", error)
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const nosList = async (req, res) => {
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
      let query = { createdById: isClient._id };
      if (req.query.sector) {
        query = { createdById: isClient._id, assginedSectorsName: req.query.sector }
      }
      const NosData = await NosModel.paginate(query, options);

      return res.json({
        res: true,
        msg: 'Success',
        data: NosData.docs,
        paginate: {
          totalDocs: NosData.totalDocs,
          limit: NosData.limit,
          totalPages: NosData.totalPages,
          page: NosData.page,
          pagingCounter: NosData.pagingCounter,
          hasPrevPage: NosData.hasPrevPage,
          hasNextPage: NosData.hasNextPage,
          prevPage: NosData.prevPage,
          nextPage: NosData.nextPage
        }
      })

    }

    if (req.user.loginType == "Admin") {

      const { page = 1, limit = 10 } = req.query;

      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };
      let query = {};
      if (req.query.sector) {
        query = { assginedSectorsName: req.query.sector }
      }
      const NosData = await NosModel.paginate(query, options);

      return res.json({
        res: true,
        msg: 'Success',
        data: NosData.docs,
        paginate: {
          totalDocs: NosData.totalDocs,
          limit: NosData.limit,
          totalPages: NosData.totalPages,
          page: NosData.page,
          pagingCounter: NosData.pagingCounter,
          hasPrevPage: NosData.hasPrevPage,
          hasNextPage: NosData.hasNextPage,
          prevPage: NosData.prevPage,
          nextPage: NosData.nextPage
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

      let query = { createdById: isClient._id,spocCreatedById: isSpocPerson._id };
      if (req.query.sector) {
        query = { createdById: isClient._id, assginedSectorsName: req.query.sector }
      }
      const NosData = await NosModel.paginate(query, options);

      return res.json({
        res: true,
        msg: 'Success',
        data: NosData.docs,
        paginate: {
          totalDocs: NosData.totalDocs,
          limit: NosData.limit,
          totalPages: NosData.totalPages,
          page: NosData.page,
          pagingCounter: NosData.pagingCounter,
          hasPrevPage: NosData.hasPrevPage,
          hasNextPage: NosData.hasNextPage,
          prevPage: NosData.prevPage,
          nextPage: NosData.nextPage
        }
      })
    }

    if(req.user.loginType == "Child-User"){
      const isChildUser = await ChildUserModel.findOne({emailId:req.user.email})
      if(!isChildUser){
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      const isClient = await ClientModel.findOne({_id:isChildUser.clientId})
      if(!isClient){
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

      let query = { createdById: isClient._id,chiledUserCreatedById: isChildUser._id };
      if (req.query.sector) {
        query = { createdById: isClient._id, assginedSectorsName: req.query.sector }
      }
      const NosData = await NosModel.paginate(query, options);

      return res.json({
        res: true,
        msg: 'Success',
        data: NosData.docs,
        paginate: {
          totalDocs: NosData.totalDocs,
          limit: NosData.limit,
          totalPages: NosData.totalPages,
          page: NosData.page,
          pagingCounter: NosData.pagingCounter,
          hasPrevPage: NosData.hasPrevPage,
          hasNextPage: NosData.hasNextPage,
          prevPage: NosData.prevPage,
          nextPage: NosData.nextPage
        }
      })
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

const nosDelete = async (req, res) => {
  try {

    if (req.user.loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isNos = await NosModel.findOne({ _id: req.params.id })

      if (!isNos) {
        return res.json({
          res: true,
          msg: 'NOS is not found.'
        })
      }

      await NosModel.deleteOne({ _id: isNos._id })

      return res.json({
        res: true,
        msg: 'Successfully NOS remove.',
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

      const isNos = await NosModel.findOne({ _id: req.params.id })

      if (!isNos) {
        return res.json({
          res: true,
          msg: 'NOS is not found.'
        })
      }

      await NosModel.deleteOne({ _id: isNos._id })

      return res.json({
        res: true,
        msg: 'Successfully NOS remove.',
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

      const isNos = await NosModel.findOne({ _id: req.params.id })
      if (!isNos) {
        return res.json({
          res: true,
          msg: 'NOS is not found.'
        })
      }

      await NosModel.deleteOne({ _id: isNos._id })

      return res.json({
        res: true,
        msg: 'Successfully NOS remove.',
      });
    }

    if(req.user.loginType == "Child-User"){
      const isChildUser = await ChildUserModel.findOne({emailId:req.user.email})
      if(!isChildUser){
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isClient = await ClientModel.findOne({_id:isChildUser.clientId})
      if(!isClient){
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isNos = await NosModel.findOne({ _id: req.params.id })
      if (!isNos) {
        return res.json({
          res: true,
          msg: 'NOS is not found.'
        })
      }

      await NosModel.deleteOne({ _id: isNos._id })

      return res.json({
        res: true,
        msg: 'Successfully NOS remove.',
      });
    }

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const nosEdit = async (req, res) => {
  try {
    if (req.user.loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isNos = await NosModel.findOne({ _id: req.params.id })

      if (!isNos) {
        return res.json({
          res: true,
          msg: 'NOS is not found.'
        })
      }

      const { assginedSectorsId, jobRoleId, nosName, nosCode, totalTheoryMarks, totalVivaMarks, totalPracticalMarks } = req.body

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

      if (nosName) {
        let nameQuery = { nosName: nosName, clientId: isClient._id };
        if (jobRoleId) {
          nameQuery._id = { $ne: isNos._id };
        }
        const existingName = await NosModel.findOne(nameQuery);
        if (existingName) {
          return res.json({
            res: false,
            msg: 'NOS Name is already existing!',
          });
        }
      }

      if (nosCode) {
        let codeQuery = { nosCode: nosCode, clientId: isClient._id };
        if (jobRoleId) {
          codeQuery._id = { $ne: isNos._id };
        }
        const existingCode = await NosModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: 'NOS Code is already existing!',
          });
        }
      }



      await NosModel.updateOne({ _id: isNos._id }, {
        $set: {
          assginedSectorsId: req.body.assginedSectorsId ? isSector.id : isNos.assginedSectorsId,
          assginedSectorsName: req.body.assginedSectorsId ? isSector.name : isNos.assginedSectorsName,
          jobRoleId: req.body.jobRoleId ? isJobRole.id : isNos.jobRoleId,
          jobRoleName: req.body.jobRoleId ? isJobRole.jobRoleName : isNos.jobRoleName,
          nosName: nosName,
          nosCode: nosCode,
          totalTheoryMarks: totalTheoryMarks,
          totalVivaMarks: totalVivaMarks,
          totalPracticalMarks: totalPracticalMarks,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isClient.clientName,
          lastUpdatedById: isClient._id,
        }
      })


      return res.json({
        res: true,
        msg: "Successfully NOS update."
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

      const isNos = await NosModel.findOne({ _id: req.params.id })

      if (!isNos) {
        return res.json({
          res: true,
          msg: 'NOS is not found.'
        })
      }

      const { assginedSectorsId, jobRoleId, nosName, nosCode, totalTheoryMarks, totalVivaMarks, totalPracticalMarks } = req.body

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

      if (nosName) {
        let nameQuery = { nosName: nosName };
        if (jobRoleId) {
          nameQuery._id = { $ne: jobRoleId };
        }
        const existingName = await JobRoleModel.findOne(nameQuery);
        if (existingName) {
          return res.json({
            res: false,
            msg: 'NOS Name is already existing!',
          });
        }
      }

      if (nosCode) {
        let codeQuery = { nosCode: nosCode };
        if (jobRoleId) {
          codeQuery._id = { $ne: jobRoleId };
        }
        const existingCode = await JobRoleModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: 'NOS Code is already existing!',
          });
        }
      }


      await NosModel.updateOne({ _id: isNos._id }, {
        $set: {
          assginedSectorsId: req.body.assginedSectorsId ? isSector.id : isNos.assginedSectorsId,
          assginedSectorsName: req.body.assginedSectorsId ? isSector.name : isNos.assginedSectorsName,
          jobRoleId: req.body.jobRoleId ? isJobRole.id : isNos.jobRoleId,
          jobRoleName: req.body.jobRoleId ? isJobRole.jobRoleName : isNos.jobRoleName,
          nosName: nosName,
          nosCode: nosCode,
          totalTheoryMarks: totalTheoryMarks,
          totalVivaMarks: totalVivaMarks,
          totalPracticalMarks: totalPracticalMarks,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isAdmin.userName,
          lastUpdatedById: isAdmin._id,
        }
      })

      return res.json({
        res: true,
        msg: "Successfully NOS update."
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

      const isNos = await NosModel.findOne({ _id: req.params.id })

      if (!isNos) {
        return res.json({
          res: true,
          msg: 'NOS is not found.'
        })
      }

      const { assginedSectorsId, jobRoleId, nosName, nosCode, totalTheoryMarks, totalVivaMarks, totalPracticalMarks } = req.body

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

      if (nosName) {
        let nameQuery = { nosName: nosName, clientId: isClient._id };
        if (jobRoleId) {
          nameQuery._id = { $ne: isNos._id };
        }
        const existingName = await NosModel.findOne(nameQuery);
        if (existingName) {
          return res.json({
            res: false,
            msg: 'NOS Name is already existing!',
          });
        }
      }

      if (nosCode) {
        let codeQuery = { nosCode: nosCode, clientId: isClient._id };
        if (jobRoleId) {
          codeQuery._id = { $ne: isNos._id };
        }
        const existingCode = await NosModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: 'NOS Code is already existing!',
          });
        }
      }

      await NosModel.updateOne({ _id: isNos._id }, {
        $set: {
          assginedSectorsId: req.body.assginedSectorsId ? isSector.id : isNos.assginedSectorsId,
          assginedSectorsName: req.body.assginedSectorsId ? isSector.name : isNos.assginedSectorsName,
          jobRoleId: req.body.jobRoleId ? isJobRole.id : isNos.jobRoleId,
          jobRoleName: req.body.jobRoleId ? isJobRole.jobRoleName : isNos.jobRoleName,
          nosName: nosName,
          nosCode: nosCode,
          totalTheoryMarks: totalTheoryMarks,
          totalVivaMarks: totalVivaMarks,
          totalPracticalMarks: totalPracticalMarks,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          spocCreatedById: isSpocPerson._id,
          spocCreatedByName: isSpocPerson.spocCreatedByName,
        }
      })


      return res.json({
        res: true,
        msg: "Successfully NOS update."
      })


    }

    if(req.user.loginType == "Child-User"){
      const isChildUser = await ChildUserModel.findOne({emailId:req.user.email})
      if(!isChildUser){
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      const isClient = await ClientModel.findOne({_id:isChildUser.clientId})
      if(!isClient){
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      const isNos = await NosModel.findOne({ _id: req.params.id })

      if (!isNos) {
        return res.json({
          res: true,
          msg: 'NOS is not found.'
        })
      }

      const { assginedSectorsId, jobRoleId, nosName, nosCode, totalTheoryMarks, totalVivaMarks, totalPracticalMarks } = req.body

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

      if (nosName) {
        let nameQuery = { nosName: nosName, clientId: isClient._id };
        if (jobRoleId) {
          nameQuery._id = { $ne: isNos._id };
        }
        const existingName = await NosModel.findOne(nameQuery);
        if (existingName) {
          return res.json({
            res: false,
            msg: 'NOS Name is already existing!',
          });
        }
      }

      if (nosCode) {
        let codeQuery = { nosCode: nosCode, clientId: isClient._id };
        if (jobRoleId) {
          codeQuery._id = { $ne: isNos._id };
        }
        const existingCode = await NosModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: 'NOS Code is already existing!',
          });
        }
      }

      await NosModel.updateOne({ _id: isNos._id }, {
        $set: {
          assginedSectorsId: req.body.assginedSectorsId ? isSector.id : isNos.assginedSectorsId,
          assginedSectorsName: req.body.assginedSectorsId ? isSector.name : isNos.assginedSectorsName,
          jobRoleId: req.body.jobRoleId ? isJobRole.id : isNos.jobRoleId,
          jobRoleName: req.body.jobRoleId ? isJobRole.jobRoleName : isNos.jobRoleName,
          nosName: nosName,
          nosCode: nosCode,
          totalTheoryMarks: totalTheoryMarks,
          totalVivaMarks: totalVivaMarks,
          totalPracticalMarks: totalPracticalMarks,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          chiledUserCreatedById: isChildUser._id,
          chiledUserCreatedByEmail: isChildUser.emailId,
        }
      })


      return res.json({
        res: true,
        msg: "Successfully NOS update."
      })


    }

  } catch (error) {
    console.error("error in nos edit", error)
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const nosStatus = async (req, res) => {
  try {

    const isNos = await NosModel.findOne({ _id: req.params.id })

    if (!isNos) {
      return res.json({
        res: true,
        msg: 'NOS is not found.'
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



      if (isNos.status == "Active") {
        await NosModel.updateOne({ _id: isNos._id }, {
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
          msg: 'Successfully NOS is Inactive.',
        });
      }

      await NosModel.updateOne({ _id: isNos._id }, {
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
        msg: 'Successfully NOS is Active.',
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



      if (isNos.status == "Active") {
        await JobRoleModel.updateOne({ _id: isNos._id }, {
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
          msg: 'Successfully NOS is Inactive.',
        });
      }

      await JobRoleModel.updateOne({ _id: isJobRole._id }, {
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
        msg: 'Successfully NOS is Active.',
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

      if(isNos.status == "Active"){
        await NosModel.updateOne({ _id: isNos._id }, {
          $set: {
            status: "Inactive",
            lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            lastUpdatedByName: isSpocPerson.spocCreatedByName,
            lastUpdatedById: isSpocPerson._id,
          }
        })

        return res.json({
          res: true,
          status: "Inactive",
          msg: 'Successfully NOS is Inactive.',
        });
      }

      await NosModel.updateOne({ _id: isNos._id }, {
        $set: {
          status: "Active",
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isSpocPerson.spocCreatedByName,
          lastUpdatedById: isSpocPerson._id,
        }
      })

      return res.json({
        res: true,
        status: "Active",
        msg: 'Successfully NOS is Active.',
      });
    }

    if(req.user.loginType == "Child-User"){
      const isChildUser = await ChildUserModel.findOne({emailId:req.user.email})
      if(!isChildUser){
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      const isClient = await ClientModel.findOne({_id:isChildUser.clientId})
      if(!isClient){
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      if(isNos.status == "Active"){
        await NosModel.updateOne({ _id: isNos._id }, {
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
          msg: 'Successfully NOS is Inactive.',
        });
      }

      await NosModel.updateOne({ _id: isNos._id }, {
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
        msg: 'Successfully NOS is Active.',
      });
    }


  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const nosDropDownList = async (req, res) => {
  try {

    if (req.user.loginType == "Client") {

      const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Client with email not found!',
        });
      }

      const NosData = await NosModel.find({ clientId: isClient._id, status: "Active" }, "_id nosName")
      return res.json({
        res: true,
        msg: "Success",
        data: NosData
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

      const NosData = await NosModel.find({ clientId: isClient._id, spocCreatedById: isSpocPerson._id, status: "Active" }, "_id nosName")
      return res.json({
        res: true,
        msg: "Success",
        data: NosData
      })
    }

    if(req.user.loginType == "Child-User"){
      const isChildUser = await ChildUserModel.findOne({emailId:req.user.email})
      if(!isChildUser){
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isClient = await ClientModel.findOne({_id:isChildUser.clientId})
      if(!isClient){
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const NosData = await NosModel.find({ clientId: isClient._id, chiledUserCreatedById: isChildUser._id, status: "Active" }, "_id nosName")
      return res.json({
        res: true,
        msg: "Success",
        data: NosData
      })
    }

  } catch (error) {
    console.error("error in nos controller",error)
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const bulkUpload = async (req, res) => {
  try {
    const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
    if (!isClient) {
      return res.json({
        res: false,
        msg: 'Client with email not found!',
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

    let uploadedData = [];

    for (let record of data) {
      const {
        JobRoleID,
        nosCode,
        nosName,
        TtheoryMarks,
        TVivaMarks,
        TPracticalMarks
      } = record;

      const jobRoleObjectId = new mongoose.Types.ObjectId(JobRoleID);
      const theoryMarks = parseInt(TtheoryMarks);
      const vivaMarks = parseInt(TVivaMarks);
      const practicalMarks = parseInt(TPracticalMarks);

      const newNosData = new nosBulkUpload({
        JobRoleID: jobRoleObjectId,
        nosCode,
        nosName,
        TtheoryMarks: theoryMarks,
        TVivaMarks: vivaMarks,
        TPracticalMarks: practicalMarks,

        clientId: isClient._id,
        clientName: isClient.clientName,
        createdAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        createdById: isClient._id,
        createdByName: isClient.clientName,
        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        lastUpdatedByName: isClient.clientName,
        lastUpdatedById: isClient._id,
        status: "Active"
      });

      const savedNosData = await newNosData.save();
      uploadedData.push(savedNosData);
    }

    return res.status(200).json({
      message: 'Bulk upload completed',
      savedNosData: uploadedData,
    });
  } catch (error) {
    console.error('Error in bulk upload', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// const bulkUpload = async (req, res) => {
//   try {
//     const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
//     if (!isClient) {
//       return res.json({
//         res: false,
//         msg: 'Client with email not found!',
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({ error: 'File is missing.' });
//     }

//     const filePath = req.file.path;
//     const file = fs.readFileSync(filePath);
//     const workbook = xlsx.read(file, { type: 'buffer' });

//     if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
//       return res.status(400).json({ error: 'No sheets found in the Excel file.' });
//     }
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     if (!sheet) {
//       return res.status(400).json({ error: `Sheet ${sheetName} not found in the Excel file.` });
//     }

//     const data = xlsx.utils.sheet_to_json(sheet);
//     if (!data || data.length === 0) {
//       return res.status(400).json({ error: 'No data found in the Excel sheet.' });
//     }

//     const nosDataUploadBulk = [];
//     const invalidRecords = [];

//     for (let record of data) {
//       try {
//         const { JobRoleID, nosCode, nosName, TtheoryMarks, TVivaMarks, TPracticalMarks } = record;

//         if (!JobRoleID || !nosCode || !nosName) {
//           invalidRecords.push({ record, error: 'Missing required fields' });
//           continue;
//         }

//         const newNosData = new nosBulkUpload({
//           JobRoleID: new mongoose.Types.ObjectId(JobRoleID), 
//           nosCode,
//           nosName,
//           TtheoryMarks: parseInt(TtheoryMarks, 10),
//           TVivaMarks: parseInt(TVivaMarks, 10),
//           TPracticalMarks: parseInt(TPracticalMarks, 10),

//           clientId: isClient._id,
//           clientName: isClient.clientName,
//           createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
//           createdById: isClient._id,
//           createdByName: isClient.clientName,
//           lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
//           lastUpdatedByName: isClient.clientName,
//           lastUpdatedById: isClient._id,
//           status: "Active"
//         });

//         // Save to database
//         const savedNosData = await newNosData.save();
//         nosDataUploadBulk.push(savedNosData);
//       } catch (err) {
//         invalidRecords.push({ record, error: err.message });
//       }
//     }

//     return res.status(200).json({
//       message: 'Bulk upload completed',
//       savedNosData: nosDataUploadBulk,
//       invalidRecords 
//     });
//   } catch (error) {
//     console.error('Error in bulk upload', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };


module.exports = {
  nosCreate,
  nosList,
  nosDelete,
  nosEdit,
  nosStatus,
  nosDropDownList,
  bulkUpload
}