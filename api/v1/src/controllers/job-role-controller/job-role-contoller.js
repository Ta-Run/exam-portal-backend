const SectorModel = require("../../models/sector.model")
const JobRoleModel = require("../../models/job-role.model")
const ClientModel = require("../../models/client.model")
const SpocPersonModel = require("../../models/spoc-person.model")
const ChildUserModel = require("../../models/child.user.model")

const moment = require('moment-timezone');

/**
 * @swagger
 * 
 * /job-role/add:
 *   post:
 *     summary: Create a Job Role. jobRoleType = ["Manufacturing","Services"]
 *     tags: 
 *       - Job Role
 *     security:
 *       - bearerAuth: []
 *     description: jobRoleType = ["Manufacturing","Services"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assginedSectorsId:
 *                 type: string
 *               jobRoleType:
 *                 type: string
 *               jobRoleCode:
 *                  type: string
 *               totalMarks:
 *                  type: string
 *               version:
 *                  type: string
 *               totalTheoryMarks: 
 *                  type: string
 *               totalPandVMarks:
 *                  type: string
 *               passingPercentage:
 *                  type: string
 *     responses:
 *       200:
 *         description: Job Role created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 res:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid token.
 *       500:
 *         description: Server Error.
 * 
 * /job-role:
 *   get:
 *     summary: job-role List.
 *     tags: 
 *       - Job Role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page.
 *       - in: query
 *         name: sector
 *         schema:
 *           type: string
 *         required: false
 *         description: sector Name.
 *     responses:
 *       200:
 *         description: job-role List.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 res:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid token.
 *       500:
 *         description: Server Error.
 * 
 * /job-role/{id}:
 *   put:
 *     summary: Job Role Update. jobRoleType = ["Manufacturing","Services"]
 *     tags: 
 *       - Job Role
 *     security:
 *       - bearerAuth: []
 *     description: jobRoleType = ["Manufacturing","Services"]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Job Role Id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assginedSectorsId:
 *                 type: string
 *               jobRoleType:
 *                 type: string
 *               jobRoleCode:
 *                  type: string
 *               totalMarks:
 *                  type: string
 *               version:
 *                  type: string
 *               totalTheoryMarks: 
 *                  type: string
 *               totalPandVMarks:
 *                  type: string
 *               passingPercentage:
 *                  type: string
 *     responses:
 *       200:
 *         description: Job Role Update successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 res:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid token.
 *       500:
 *         description: Server Error.
 * 
 * /job-role/status/{id}:
 *   put:
 *     summary: Job Role Status Change.
 *     tags: 
 *       - Job Role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Job Role Id.
 *     responses:
 *       200:
 *         description: Successfully Job Role Status change.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 res:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid token.
 *       500:
 *         description: Server Error.
 *
 * /job-role/remove/{id}:
 *   delete:
 *     summary: Job Role remove.
 *     tags: 
 *       - Job Role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: Job Role ID.
 *     responses:
 *       200:
 *         description: Successfully Job Role remove.
 *       401:
 *         description: Unauthorized - Invalid token.
 *       500:
 *         description: Server Error.
 */

const jobRoleCreate = async (req, res) => {
  try {

    // Client Create Job Role
    if (req.user.loginType == "Client") {
      const isClient=await ClientModel.findOne({clientEmail:req.user.email})

      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Client is not found!',
        });
      }
      const { assginedSectorsId, jobRoleName, jobRoleType, jobRoleCode, totalMarks, version, totalTheoryMarks, totalPandVMarks, passingPercentage } = req.body
      if (assginedSectorsId == "" || jobRoleName == "" || jobRoleType == "" || jobRoleCode == "" || totalMarks == "" || version == "" || totalTheoryMarks == "" || totalPandVMarks == "" || passingPercentage == "") {
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

      const isJobRoleNameExists = await JobRoleModel.findOne({
        jobRoleName: { $regex: `^${jobRoleName}$`, $options: 'i' },
        clientId: isClient._id,
      });

      if (isJobRoleNameExists) {
        return res.json({
          res: false,
          msg: 'Job role name is already existing!',
        });
      }
      // const isJobRoleTypeExists = await JobRoleModel.findOne({
      //   jobRoleType: { $regex: `^${jobRoleType}$`, $options: 'i' },
      //   clientId: isClient._id,
      // });

      // if (isJobRoleTypeExists) {
      //   return res.json({
      //     res: false,
      //     msg: 'Job role type is already existing!',
      //   });
      // }

      const isJobRoleCodeExists = await JobRoleModel.findOne({
        jobRoleCode: { $regex: `^${jobRoleCode}$`, $options: 'i' },
        clientId: isClient._id,
      });

      if (isJobRoleCodeExists) {
        return res.json({
          res: false,
          msg: 'Job role code is already existing!',
        });
      }

      await JobRoleModel.create({
        assginedSectorsId: isSector.id,
        assginedSectorsName: isSector.name,
        jobRoleName: jobRoleName,
        jobRoleType: jobRoleType,
        jobRoleCode: jobRoleCode,
        totalMarks: totalMarks,
        version: version,
        totalTheoryMarks: totalTheoryMarks,
        totalPandVMarks: totalPandVMarks,
        passingPercentage: passingPercentage,

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
        msg: 'Successfully Job Role create.',
      });

    }

    // SPOC-Person Create Job Role
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

      const { assginedSectorsId, jobRoleName, jobRoleType, jobRoleCode, totalMarks, version, totalTheoryMarks, totalPandVMarks, passingPercentage } = req.body

      if (assginedSectorsId == "" || jobRoleName == "" || jobRoleType == "" || jobRoleCode == "" || totalMarks == "" || version == "" || totalTheoryMarks == "" || totalPandVMarks == "" || passingPercentage == "") {
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

      
      const isJobRoleNameExists = await JobRoleModel.findOne({
        jobRoleName: { $regex: `^${jobRoleName}$`, $options: 'i' },
        clientId: isClient._id,
        spocCreatedById: isSpocPerson._id
      });

      if (isJobRoleNameExists) {
        return res.json({
          res: false,
          msg: 'Job role name is already existing!',
        });
      }
      // const isJobRoleTypeExists = await JobRoleModel.findOne({
      //   jobRoleType: { $regex: `^${jobRoleType}$`, $options: 'i' },
      //   clientId: isClient._id,
      // });

      
      // if (isJobRoleTypeExists) {
      //   return res.json({
      //     res: false,
      //     msg: 'Job role type is already existing!',
      //   });
      // }

      const isJobRoleCodeExists = await JobRoleModel.findOne({
        jobRoleCode: { $regex: `^${jobRoleCode}$`, $options: 'i' },
        clientId: isClient._id,
        spocCreatedById: isSpocPerson._id
      });

      if (isJobRoleCodeExists) {
        return res.json({
          res: false,
          msg: 'Job role code is already existing!',
        });
      }

      
      await JobRoleModel.create({
        assginedSectorsId: isSector.id,
        assginedSectorsName: isSector.name,
        jobRoleName: jobRoleName,
        jobRoleType: jobRoleType,
        jobRoleCode: jobRoleCode,
        totalMarks: totalMarks,
        version: version,
        totalTheoryMarks: totalTheoryMarks,
        totalPandVMarks: totalPandVMarks,
        passingPercentage: passingPercentage,

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
        spocCreatedByName: isSpocPerson.spocCreatedByName,
      })

      return res.json({
        res: true,
        msg: 'Successfully Job Role create.',
      });
    }

    // Child User Create Job Role
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
    }

    const { assginedSectorsId, jobRoleName, jobRoleType, jobRoleCode, totalMarks, version, totalTheoryMarks, totalPandVMarks, passingPercentage } = req.body

    if (assginedSectorsId == "" || jobRoleName == "" || jobRoleType == "" || jobRoleCode == "" || totalMarks == "" || version == "" || totalTheoryMarks == "" || totalPandVMarks == "" || passingPercentage == "") {
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
    
    const isJobRoleNameExists = await JobRoleModel.findOne({
      jobRoleName: { $regex: `^${jobRoleName}$`, $options: 'i' },
      clientId: isClient._id,
   
    });

    if (isJobRoleNameExists) {
      return res.json({
        res: false,
        msg: 'Job role name is already existing!',
      });
    }


    const isJobRoleCodeExists = await JobRoleModel.findOne({
      jobRoleCode: { $regex: `^${jobRoleCode}$`, $options: 'i' },
      clientId: isClient._id,
    
    });

    if (isJobRoleCodeExists) {
      return res.json({
        res: false,
        msg: 'Job role code is already existing!',
      });
    }

    
    await JobRoleModel.create({
      assginedSectorsId: isSector.id,
      assginedSectorsName: isSector.name,
      jobRoleName: jobRoleName,
      jobRoleType: jobRoleType,
      jobRoleCode: jobRoleCode,
      totalMarks: totalMarks,
      version: version,
      totalTheoryMarks: totalTheoryMarks,
      totalPandVMarks: totalPandVMarks,
      passingPercentage: passingPercentage,

      clientId: isClient._id,
      clientName: isClient.clientName,
      createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
      createdById: isClient._id,
      createdByName: isClient.clientName,
      lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
      lastUpdatedByName: isClient.clientName,
      lastUpdatedById: isClient._id,
      status: "Active",
      chiledUserCreatedById:isChildUser._id,
      chiledUserCreatedByEmail:isChildUser.emailId,
     
    })

    return res.json({
      res: true,
      msg: 'Successfully Job Role create.',
    });

  } catch (error) {
    console.log(error);
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const jobRoleList = async (req, res) => {
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
      const JobRoleData = await JobRoleModel.paginate(query, options);

      return res.json({
        res: true,
        msg: 'Success',
        data: JobRoleData.docs,
        paginate: {
          totalDocs: JobRoleData.totalDocs,
          limit: JobRoleData.limit,
          totalPages: JobRoleData.totalPages,
          page: JobRoleData.page,
          pagingCounter: JobRoleData.pagingCounter,
          hasPrevPage: JobRoleData.hasPrevPage,
          hasNextPage: JobRoleData.hasNextPage,
          prevPage: JobRoleData.prevPage,
          nextPage: JobRoleData.nextPage
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
      const JobRoleData = await JobRoleModel.paginate(query, options);

      return res.json({
        res: true,
        msg: 'Success',
        data: JobRoleData.docs,
        paginate: {
          totalDocs: JobRoleData.totalDocs,
          limit: JobRoleData.limit,
          totalPages: JobRoleData.totalPages,
          page: JobRoleData.page,
          pagingCounter: JobRoleData.pagingCounter,
          hasPrevPage: JobRoleData.hasPrevPage,
          hasNextPage: JobRoleData.hasNextPage,
          prevPage: JobRoleData.prevPage,
          nextPage: JobRoleData.nextPage
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
      const query = {clientId: isClient._id,spocCreatedById: isSpocPerson._id }
      const JobRoleData = await JobRoleModel.paginate(query, options);
      return res.json({
        res: true,
        msg: 'Success',
        data: JobRoleData.docs,
        paginate: {
          totalDocs: JobRoleData.totalDocs,
          limit: JobRoleData.limit,
          totalPages: JobRoleData.totalPages,
          page: JobRoleData.page,
          pagingCounter: JobRoleData.pagingCounter,
          hasPrevPage: JobRoleData.hasPrevPage,
          hasNextPage: JobRoleData.hasNextPage,
          prevPage: JobRoleData.prevPage,
          nextPage: JobRoleData.nextPage
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
      const query = {clientId: isClient._id,chiledUserCreatedById: isChildUser._id }
      const JobRoleData = await JobRoleModel.paginate(query, options);
      return res.json({
        res: true,
        msg: 'Success',
        data: JobRoleData.docs,
        paginate: {
          totalDocs: JobRoleData.totalDocs,
          limit: JobRoleData.limit,
          totalPages: JobRoleData.totalPages,
          page: JobRoleData.page,
          pagingCounter: JobRoleData.pagingCounter,
          hasPrevPage: JobRoleData.hasPrevPage,
          hasNextPage: JobRoleData.hasNextPage,
          prevPage: JobRoleData.prevPage,
          nextPage: JobRoleData.nextPage
        }
      })
    }

    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });

  } catch (error) {
    console.log(error);
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const jobRoleEdit = async (req, res) => {
  try {

    const { jobRoleCode, jobRoleName } = req.body;

    if (req.user.loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isJobRole = await JobRoleModel.findOne({ _id: req.params.id })

      if (!isJobRole) {
        return res.json({
          res: true,
          msg: 'Job Role is not found.'
        })
      }


      const isSector = await SectorModel.findOne({ _id: req.body.assginedSectorsId });

      if (!isSector) {
        return res.json({
          res: false,
          msg: 'Sector is not found!',
        });
      }

      if (jobRoleName) {
        let codeQuery = { jobRoleName: jobRoleName, clientId: isClient._id };
        if (jobRoleName) {
          codeQuery._id = { $ne: isJobRole }
        }
        const existingCode = await JobRoleModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "jobRole Name is already existing!"
          })
        }
      }


      if (jobRoleCode) {
        let codeQuery = { jobRoleCode: jobRoleCode, clientId: isClient._id };
        if (jobRoleCode) {
          codeQuery._id = { $ne: isJobRole };
        }
        const existingCode = await JobRoleModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "jobRole Code is already existing"
          })
        }
      }


      await JobRoleModel.updateOne({ _id: isJobRole._id }, {
        assginedSectorsId: req.body.assginedSectorsId ? isSector.id : isJobRole.assginedSectorsId,
        assginedSectorsName: req.body.assginedSectorsId ? isSector.name : isJobRole.assginedSectorsName,
        jobRoleName: req.body.jobRoleName ? req.body.jobRoleName : isJobRole.jobRoleName,
        jobRoleType: req.body.jobRoleType ? req.body.jobRoleType : isJobRole.jobRoleType,
        jobRoleCode: req.body.jobRoleCode ? req.body.jobRoleCode : isJobRole.jobRoleCode,
        totalMarks: req.body.totalMarks ? req.body.totalMarks : isJobRole.totalMarks,
        version: req.body.version ? req.body.version : isJobRole.version,
        totalTheoryMarks: req.body.totalTheoryMarks ? req.body.totalTheoryMarks : isJobRole.totalTheoryMarks,
        totalPandVMarks: req.body.totalPandVMarks ? req.body.totalPandVMarks : isJobRole.totalPandVMarks,
        passingPercentage: req.body.passingPercentage ? req.body.passingPercentage : isJobRole.passingPercentage,
        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        lastUpdatedByName: isClient.clientName,
        lastUpdatedById: isClient._id,
      })

      return res.json({
        res: true,
        msg: "Successfully Job Role update."
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

      const isJobRole = await JobRoleModel.findOne({ _id: req.params.id })

      if (!isJobRole) {
        return res.json({
          res: true,
          msg: 'Job Role is not found.'
        })
      }

      if (req.body.assginedSectorsId) {
        const isSector = await SectorModel.findOne({ _id: req.body.assginedSectorsId });
        if (!isSector) {
          return res.json({
            res: false,
            msg: 'Sector is not found!',
          });
        }
      }

      if (jobRoleCode) {
        let codeQuery = { jobRoleCode: jobRoleCode };
        if (jobRoleCode) {
          codeQuery._id = { $ne: isJobRole };
        }
        const existingCode = await JobRoleModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "jobRole Code is already existing"
          })
        }
      }

      if (jobRoleName) {
        let codeQuery = { jobRoleName: jobRoleName };
        if (jobRoleName) {
          codeQuery._id = { $ne: isJobRole }
        }
        const existingCode = await JobRoleModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "jobRole Name is already7 existing!"
          })
        }
      }


      await JobRoleModel.updateOne({ _id: isJobRole._id }, {
        assginedSectorsId: req.body.assginedSectorsId ? isSector.id : isJobRole.assginedSectorsId,
        assginedSectorsName: req.body.assginedSectorsId ? isSector.name : isJobRole.assginedSectorsName,
        jobRoleName: req.body.jobRoleName ? req.body.jobRoleName : isJobRole.jobRoleName,
        jobRoleType: req.body.jobRoleType ? req.body.jobRoleType : isJobRole.jobRoleType,
        jobRoleCode: req.body.jobRoleCode ? req.body.jobRoleCode : isJobRole.jobRoleCode,
        totalMarks: req.body.totalMarks ? req.body.totalMarks : isJobRole.totalMarks,
        version: req.body.version ? req.body.version : isJobRole.version,
        totalTheoryMarks: req.body.totalTheoryMarks ? req.body.totalTheoryMarks : isJobRole.totalTheoryMarks,
        totalPandVMarks: req.body.totalPandVMarks ? req.body.totalPandVMarks : isJobRole.totalPandVMarks,
        passingPercentage: req.body.passingPercentage ? req.body.passingPercentage : isJobRole.passingPercentage,
        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        lastUpdatedByName: isAdmin.userName,
        lastUpdatedById: isAdmin._id,
      })

      return res.json({
        res: true,
        msg: "Successfully Job Role update."
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

      const isJobRole = await JobRoleModel.findOne({ _id: req.params.id })
      if (!isJobRole) {
        return res.json({
          res: true,
          msg: 'Job Role is not found.'
        })
      }

      const isSector = await SectorModel.findOne({ _id: req.body.assginedSectorsId });

      if (!isSector) {
        return res.json({
          res: false,
          msg: 'Sector is not found!',
        });
      }

      if (jobRoleName) {
        let codeQuery = { jobRoleName: jobRoleName, clientId: isClient._id, spocCreatedById: isSpocPerson._id };
        if (jobRoleName) {
          codeQuery._id = { $ne: isJobRole }
        }
        const existingCode = await JobRoleModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "jobRole Name is already existing!"
          })
        }
      }

      if (jobRoleCode) {
        let codeQuery = { jobRoleCode: jobRoleCode, clientId: isClient._id, spocCreatedById: isSpocPerson._id };
        if (jobRoleCode) {
          codeQuery._id = { $ne: isJobRole };
        }
        const existingCode = await JobRoleModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "jobRole Code is already existing"
          })
        }
      }

      await JobRoleModel.updateOne({ _id: isJobRole._id }, {
        assginedSectorsId: req.body.assginedSectorsId ? isSector.id : isJobRole.assginedSectorsId,
        assginedSectorsName: req.body.assginedSectorsId ? isSector.name : isJobRole.assginedSectorsName,
        jobRoleName: req.body.jobRoleName ? req.body.jobRoleName : isJobRole.jobRoleName,
        jobRoleType: req.body.jobRoleType ? req.body.jobRoleType : isJobRole.jobRoleType,
        jobRoleCode: req.body.jobRoleCode ? req.body.jobRoleCode : isJobRole.jobRoleCode,
        totalMarks: req.body.totalMarks ? req.body.totalMarks : isJobRole.totalMarks,
        version: req.body.version ? req.body.version : isJobRole.version,
        totalTheoryMarks: req.body.totalTheoryMarks ? req.body.totalTheoryMarks : isJobRole.totalTheoryMarks,
        totalPandVMarks: req.body.totalPandVMarks ? req.body.totalPandVMarks : isJobRole.totalPandVMarks,
        passingPercentage: req.body.passingPercentage ? req.body.passingPercentage : isJobRole.passingPercentage,
        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        lastUpdatedByName: isSpocPerson.spocCreatedByName,
        lastUpdatedById: isSpocPerson._id
      })

      return res.json({
        res: true,
        msg: "Successfully Job Role update."
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
      const isJobRole = await JobRoleModel.findOne({ _id: req.params.id })
      if (!isJobRole) {
        return res.json({
          res: true,
          msg: 'Job Role is not found.'
        })
      }

      const isSector = await SectorModel.findOne({ _id: req.body.assginedSectorsId });

      if (!isSector) {
        return res.json({
          res: false,
          msg: 'Sector is not found!',
        });
      }

      if (jobRoleName) {
        let codeQuery = { jobRoleName: jobRoleName, clientId: isClient._id, chiledUserCreatedById: isChildUser._id };
        if (jobRoleName) {
          codeQuery._id = { $ne: isJobRole }
        }
        const existingCode = await JobRoleModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "jobRole Name is already existing!"
          })
        }
      }

      if (jobRoleCode) {
        let codeQuery = { jobRoleCode: jobRoleCode, clientId: isClient._id, chiledUserCreatedById: isChildUser._id };
        if (jobRoleCode) {
          codeQuery._id = { $ne: isJobRole };
        }
        const existingCode = await JobRoleModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "jobRole Code is already existing"
          })
        }
      }

      await JobRoleModel.updateOne({ _id: isJobRole._id }, {
        assginedSectorsId: req.body.assginedSectorsId ? isSector.id : isJobRole.assginedSectorsId,
        assginedSectorsName: req.body.assginedSectorsId ? isSector.name : isJobRole.assginedSectorsName,
        jobRoleName: req.body.jobRoleName ? req.body.jobRoleName : isJobRole.jobRoleName,
        jobRoleType: req.body.jobRoleType ? req.body.jobRoleType : isJobRole.jobRoleType,
        jobRoleCode: req.body.jobRoleCode ? req.body.jobRoleCode : isJobRole.jobRoleCode,
        totalMarks: req.body.totalMarks ? req.body.totalMarks : isJobRole.totalMarks,
        version: req.body.version ? req.body.version : isJobRole.version,
        totalTheoryMarks: req.body.totalTheoryMarks ? req.body.totalTheoryMarks : isJobRole.totalTheoryMarks,
        totalPandVMarks: req.body.totalPandVMarks ? req.body.totalPandVMarks : isJobRole.totalPandVMarks,
        passingPercentage: req.body.passingPercentage ? req.body.passingPercentage : isJobRole.passingPercentage,
        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        lastUpdatedByName: isChildUser.emailId,
        lastUpdatedById: isChildUser._id
      })

      return res.json({
        res: true,
        msg: "Successfully Job Role update."
      })

    }

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const jobRoleStatusChange = async (req, res) => {
  try {

    if (req.user.loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isJobRole = await JobRoleModel.findOne({ _id: req.params.id })

      if (!isJobRole) {
        return res.json({
          res: true,
          msg: 'Job Role is not found.'
        })
      }

      if (isJobRole.status == "Active") {
        await JobRoleModel.updateOne({ _id: isJobRole._id }, {
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
          msg: 'Successfully Job Role is Inactive.',
        });
      }

      await JobRoleModel.updateOne({ _id: isJobRole._id }, {
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
        msg: 'Successfully Job Role is Active.',
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

      const isJobRole = await JobRoleModel.findOne({ _id: req.params.id })

      if (!isJobRole) {
        return res.json({
          res: true,
          msg: 'Job Role is not found.'
        })
      }

      if (isJobRole.status == "Active") {
        await JobRoleModel.updateOne({ _id: isJobRole._id }, {
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
          msg: 'Successfully Job Role is Inactive.',
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
        msg: 'Successfully Job Role is Active.',
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

      const isJobRole = await JobRoleModel.findOne({ _id: req.params.id })
      if (!isJobRole) {
        return res.json({
          res: true,
          msg: 'Job Role is not found.'
        })
      }

      if (isJobRole.status == "Active") {
        await JobRoleModel.updateOne({ _id: isJobRole._id }, {
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
          msg: 'Successfully Job Role is Inactive.',
        });
      }

      await JobRoleModel.updateOne({ _id: isJobRole._id }, {
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
        msg: 'Successfully Job Role is Active.',
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

      const isJobRole = await JobRoleModel.findOne({ _id: req.params.id })
      if (!isJobRole) {
        return res.json({
          res: true,
          msg: 'Job Role is not found.'
        })
      }
      if (isJobRole.status == "Active") {
        await JobRoleModel.updateOne({ _id: isJobRole._id }, {
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
          msg: 'Successfully Job Role is Inactive.',
        });
      }

      await JobRoleModel.updateOne({ _id: isJobRole._id }, {
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
        msg: 'Successfully Job Role is Active.',
      });
    } 

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const jobRoleRemove = async (req, res) => {
  try {

    if (req.user.loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isJobRole = await JobRoleModel.findOne({ _id: req.params.id })

      if (!isJobRole) {
        return res.json({
          res: true,
          msg: 'Job Role is not found.'
        })
      }

      await JobRoleModel.deleteOne({ _id: isJobRole._id })

      return res.json({
        res: true,
        msg: 'Successfully Job Role remove.',
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

      const isJobRole = await JobRoleModel.findOne({ _id: req.params.id })

      if (!isJobRole) {
        return res.json({
          res: true,
          msg: 'Job Role is not found.'
        })
      }

      await JobRoleModel.deleteOne({ _id: isJobRole._id })

      return res.json({
        res: true,
        msg: 'Successfully Job Role remove.',
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

      const isJobRole = await JobRoleModel.findOne({ _id: req.params.id })
      if (!isJobRole) {
        return res.json({
          res: true,
          msg: 'Job Role is not found.'
        })
      }

      await JobRoleModel.deleteOne({ _id: isJobRole._id })

      return res.json({
        res: true,
        msg: 'Successfully Job Role remove.',
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

      const isJobRole = await JobRoleModel.findOne({ _id: req.params.id })
      if (!isJobRole) {
        return res.json({
          res: true,
          msg: 'Job Role is not found.'
        })
      }

      await JobRoleModel.deleteOne({ _id: isJobRole._id })

      return res.json({
        res: true,
        msg: 'Successfully Job Role remove.',
      });
    }

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const jobRoleDropDown = async (req, res) => {
  try {

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

      const JobRoleData = await JobRoleModel.find({ clientId: isClient._id,spocCreatedById: isSpocPerson._id, status: "Active" }, "_id jobRoleName")
      return res.json({
        res: true,
        msg: "Success",
        data: JobRoleData
      })
    }

    if(req.user.loginType == "Client"){
      
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
  
      const JobRoleData = await JobRoleModel.find({ clientId: isClient._id, status: "Active" }, "_id jobRoleName")
      return res.json({
        res: true,
        msg: "Success",
        data: JobRoleData
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

      const JobRoleData = await JobRoleModel.find({ clientId: isClient._id,chiledUserCreatedById: isChildUser._id, status: "Active" }, "_id jobRoleName")
      return res.json({
        res: true,
        msg: "Success",
        data: JobRoleData
      })

    }

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}


module.exports = {
  jobRoleCreate,
  jobRoleList,
  jobRoleEdit,
  jobRoleStatusChange,
  jobRoleRemove,
  jobRoleDropDown
}