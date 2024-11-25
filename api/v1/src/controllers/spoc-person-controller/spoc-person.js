const SectorModel = require("../../models/sector.model")
const SpocPersonModel = require("../../models/spoc-person.model")
const ClientModel = require("../../models/client.model")

const moment = require('moment-timezone');

/**
 * @swagger
 * 
 * /spoc-person/add:
 *   post:
 *     summary: Create a SPOC Person.
 *     tags: 
 *       - SPOC Person
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spocPersonName:
 *                 type: string
 *               contactNo:
 *                 type: string
 *               emailId:
 *                 type: string
 *               password:
 *                  type: string
 *               assginedSectorsId:
 *                 type: string
 *     responses:
 *       200:
 *         description: SPOC Person created successfully.
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
 * /spoc-person:
 *   get:
 *     summary: spoc-person List.
 *     tags: 
 *       - SPOC Person
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
 *     responses:
 *       200:
 *         description: SPOC Person List.
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
 * /spoc-person/{id}:
 *   put:
 *     summary: spoc-person Edit.
 *     tags: 
 *       - SPOC Person
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: spoc-person Id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spocPersonName:
 *                 type: string
 *               contactNo:
 *                 type: string
 *               emailId:
 *                 type: string
 *               password:
 *                  type: string
 *               assginedSectorsId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully spoc-person update..
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
 * /spoc-person/status/{id}:
 *   put:
 *     summary: spoc-person Status Change.
 *     tags: 
 *       - SPOC Person
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: spoc-person Id.
 *     responses:
 *       200:
 *         description: Successfully spoc-person Status change.
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
 * /spoc-person/remove/{id}:
 *   delete:
 *     summary: SPOC Person remove.
 *     tags: 
 *       - SPOC Person
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: SPOC Person ID.
 *     responses:
 *       200:
 *         description: Successfully SPOC Person remove.
 *       401:
 *         description: Unauthorized - Invalid token.
 *       500:
 *         description: Server Error.
 */

const spocPersonCreate = async (req, res) => {
  try {
    if (req.user.loginType == "Client") {


      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'client is not found!',
        });
      }
      const { spocPersonName, contactNo, password, assginedSectorsIds } = req.body
      const emailId = req.body.emailId.toLowerCase()

      if (spocPersonName == "" || contactNo == "" || emailId == "" || password == "" || assginedSectorsIds == "") {
        return res.json({
          res: false,
          msg: 'All fields required.',
        });
      }
      const validSectors = [];
      const validSectorName = [];
      for (const sectorId of assginedSectorsIds) {
        const isSector = await SectorModel.findOne({ _id: sectorId });
        if (!isSector) {
          return res.json({
            res: false,
            msg: `Sector with ID ${sectorId} is not found!`,
          });
        }
        validSectorName.push(isSector.name);
        validSectors.push(isSector._id);
      }

      const isSpocPersonMobile = await SpocPersonModel.findOne({ contactNo: contactNo, clientId: isClient._id })
      if (isSpocPersonMobile) {
        return res.json({
          res: false,
          msg: 'SPOC Person Mobile Number Alrady Exising!',
        });
      }

      const isSpocPerson = await SpocPersonModel.findOne({ emailId: emailId, clientId: isClient._id })
      if (isSpocPerson) {
        return res.json({
          res: false,
          msg: 'SPOC Person Email Alrady Exising!',
        });
      }

      await SpocPersonModel.create({
        spocPersonName: spocPersonName,
        contactNo: contactNo,
        emailId: emailId,
        password: password,
        assginedSectorsIds: validSectors,
        assginedSectorsNames: validSectorName,
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
        msg: 'Successfully SPOC Person Create.',
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
          msg: 'client is not found!',
        });
      }

      const { spocPersonName, contactNo, password, assginedSectorsIds } = req.body
      const emailId = req.body.emailId.toLowerCase()

      if (spocPersonName == "" || contactNo == "" || emailId == "" || password == "" || assginedSectorsIds == "") {
        return res.json({
          res: false,
          msg: 'All fields required.',
        });
      }
      const validSectors = [];
      const validSectorName = [];
      for (const sectorId of assginedSectorsIds) {
        const isSector = await SectorModel.findOne({ _id: sectorId });
        if (!isSector) {
          return res.json({
            res: false,
            msg: `Sector with ID ${sectorId} is not found!`,
          });
        }
        validSectorName.push(isSector.name);
        validSectors.push(isSector._id);
      }

      const isSpocPersonMobile = await SpocPersonModel.findOne({ contactNo: contactNo, clientId: isClient._id })
      if (isSpocPersonMobile) {
        return res.json({
          res: false,
          msg: 'SPOC Person Mobile Number Alrady Exising!',
        });
      }

      const isSpocPersonEntry = await SpocPersonModel.findOne({ emailId: emailId, clientId: isClient._id })
      if (isSpocPersonEntry) {
        return res.json({
          res: false,
          msg: 'SPOC Person Email Alrady Exising!',
        });
      }

      await SpocPersonModel.create({
        spocPersonName: spocPersonName,
        contactNo: contactNo,
        emailId: emailId,
        password: password,
        assginedSectorsIds: validSectors,
        assginedSectorsNames: validSectorName,
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
        msg: 'Successfully SPOC Person Create.',
      })
    }

  

  } catch (error) {
    // console.error("error in spocPerson create",error)
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }

}

const spocPersonList = async (req, res) => {
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
      const query = { createdById: isClient._id };
      const spocPersonData = await SpocPersonModel.paginate(query, options);

      return res.json({
        res: true,
        msg: 'Success',
        data: spocPersonData.docs,
        paginate: {
          totalDocs: spocPersonData.totalDocs,
          limit: spocPersonData.limit,
          totalPages: spocPersonData.totalPages,
          page: spocPersonData.page,
          pagingCounter: spocPersonData.pagingCounter,
          hasPrevPage: spocPersonData.hasPrevPage,
          hasNextPage: spocPersonData.hasNextPage,
          prevPage: spocPersonData.prevPage,
          nextPage: spocPersonData.nextPage
        }
      })

    }

    if (req.user.loginType == "Admin") {

      const { page = 1, limit = 10 } = req.query;

      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };
      const spocPersonData = await SpocPersonModel.paginate({}, options);

      return res.json({
        res: true,
        msg: 'Success',
        data: spocPersonData.docs,
        paginate: {
          totalDocs: spocPersonData.totalDocs,
          limit: spocPersonData.limit,
          totalPages: spocPersonData.totalPages,
          page: spocPersonData.page,
          pagingCounter: spocPersonData.pagingCounter,
          hasPrevPage: spocPersonData.hasPrevPage,
          hasNextPage: spocPersonData.hasNextPage,
          prevPage: spocPersonData.prevPage,
          nextPage: spocPersonData.nextPage
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
      const query = { clientId: isClient._id,spocCreatedById: isSpocPerson._id};
      const spocPersonData = await SpocPersonModel.paginate(query, options);

      return res.json({
        res: true,
        msg: 'Success',
        data: spocPersonData.docs,
        paginate: {
          totalDocs: spocPersonData.totalDocs,
          limit: spocPersonData.limit,
          totalPages: spocPersonData.totalPages,
          page: spocPersonData.page,
          pagingCounter: spocPersonData.pagingCounter,
          hasPrevPage: spocPersonData.hasPrevPage,
          hasNextPage: spocPersonData.hasNextPage,
          prevPage: spocPersonData.prevPage,
          nextPage: spocPersonData.nextPage
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

const spocPersonEdit = async (req, res) => {
  try {

    const { contactNo } = req.body
    const emailId = req.body.emailId.toLowerCase()


    if (req.user.loginType == "Client") {

      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isSpocPerson = await SpocPersonModel.findOne({ _id: req.params.id })

      if (!isSpocPerson) {
        return res.json({
          res: true,
          msg: 'SpocPerson is not found.'
        })
      }
      if (contactNo) {
        let codeQuery = { contactNo: contactNo, clientId: isClient._id };
        if (contactNo) {
          codeQuery._id = { $ne: isSpocPerson };
        }
        const existingCode = await SpocPersonModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: 'SPOC Person Mobile Number Alrady Exising!',
          });
        }
      }
      if (emailId) {
        let codeQuery = { emailId: emailId, clientId: isClient._id };
        if (emailId) {
          codeQuery._id = { $ne: isSpocPerson };
        }
        const existingCode = await SpocPersonModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: 'emailId is already existing!',
          });
        }
      }

      const validSectors = [];
      const validSectorName = [];
      for (const sectorId of req.body.assginedSectorsIds) {
        const isSector = await SectorModel.findOne({ _id: sectorId });
        if (!isSector) {
          return res.json({
            res: false,
            msg: `Sector with ID ${sectorId} is not found!`,
          });
        }
        validSectorName.push(isSector.name);
        validSectors.push(isSector._id);
      }


      await SpocPersonModel.updateOne({ _id: isSpocPerson._id }, {
        $set: {
          spocPersonName: req.body.spocPersonName ? req.body.spocPersonName : isSpocPerson.spocPersonName,
          contactNo: req.body.contactNo ? req.body.contactNo : isSpocPerson.contactNo,
          emailId: req.body.emailId.toLowerCase() ? req.body.emailId : isSpocPerson.emailId,
          password: req.body.password ? req.body.password : isSpocPerson.password,
          assginedSectorsIds: validSectors,
          assginedSectorsNames: validSectorName,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isClient.clientName,
          lastUpdatedById: isClient._id,
        }
      })

      return res.json({
        res: true,
        msg: 'Successfully SPOC Person update.'
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

      const isSpocPerson = await SpocPersonModel.findOne({ _id: req.params.id })
      if (!isSpocPerson) {
        return res.json({
          res: true,
          msg: 'SpocPerson is not found.'
        })
      }

      if (req.body.assginedSectorsIds) {

        const isSector = await SectorModel.findOne({ _id: req.body.assginedSectorsIds });
        if (!isSector) {
          return res.json({
            res: false,
            msg: 'Sector is not found!',
          });
        }
      }

      await SpocPersonModel.updateOne({ _id: isSpocPerson._id }, {
        $set: {
          spocPersonName: req.body.spocPersonName ? req.body.spocPersonName : isSpocPerson.spocPersonName,
          contactNo: req.body.contactNo ? req.body.contactNo : isSpocPerson.contactNo,
          emailId: req.body.emailId.toLowerCase() ? req.body.emailId : isSpocPerson.emailId,
          password: req.body.password ? req.body.password : isSpocPerson.password,
          assginedSectorsIds: req.body.assginedSectorsIds ? isSector.id : isSpocPerson.assginedSectorsIds,
          assginedSectorsNames: req.body.assginedSectorsNames ? isSector.name : isSpocPerson.assginedSectorsNames,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isAdmin.userName,
          lastUpdatedById: isAdmin._id,
        }
      })

      return res.json({
        res: true,
        msg: 'Successfully SPOC Person update.'
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

      const isSpocPersonExisting = await SpocPersonModel.findOne({ _id: req.params.id })
      if (!isSpocPersonExisting) {
        return res.json({
          res: true,
          msg: 'SpocPerson is not found.'
        })
      }

      // const isSector = await SectorModel.findOne({ _id: req.body.assginedSectorsIds });
      // if (!isSector) {
      //   return res.json({
      //     res: false,
      //     msg: 'Sector is not found!',
      //   });
      // }

      const validSectors = [];
      const validSectorName = [];
      for (const sectorId of req.body.assginedSectorsIds) {
        const isSector = await SectorModel.findOne({ _id: sectorId });
        if (!isSector) {
          return res.json({
            res: false,
            msg: `Sector with ID ${sectorId} is not found!`,
          });
        }
        validSectorName.push(isSector.name);
        validSectors.push(isSector._id);
      }

      await SpocPersonModel.updateOne({ _id: isSpocPersonExisting._id }, {
        $set: {
          spocPersonName: req.body.spocPersonName ? req.body.spocPersonName : isSpocPerson.spocPersonName,
          contactNo: req.body.contactNo ? req.body.contactNo : isSpocPerson.contactNo,
          emailId: req.body.emailId.toLowerCase() ? req.body.emailId : isSpocPerson.emailId,
          password: req.body.password ? req.body.password : isSpocPerson.password,
          assginedSectorsIds: validSectors,
          assginedSectorsNames:validSectorName,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isSpocPerson.spocCreatedByName,
          lastUpdatedById: isSpocPerson.spocCreatedById,
        }
      })

      return res.json({
        res: true,
        msg: 'Successfully SPOC Person update.'
      })
    }
  } catch (error) {
    console.error("error in SPOC Person update.", error)
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const spocPersonStatusChange = async (req, res) => {
  try {

    if (req.user.loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isSpocPerson = await SpocPersonModel.findOne({ _id: req.params.id })

      if (!isSpocPerson) {
        return res.json({
          res: true,
          msg: 'SpocPerson is not found.'
        })
      }

      if (isSpocPerson.status == "Active") {
        await SpocPersonModel.updateOne({ _id: isSpocPerson._id }, {
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
          msg: 'Successfully Spoc Person is Inactive',
        });
      }

      await SpocPersonModel.updateOne({ _id: isSpocPerson._id }, {
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
        msg: 'Successfully Spoc Person is Active',
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

      const isSpocPerson = await SpocPersonModel.findOne({ _id: req.params.id })

      if (!isSpocPerson) {
        return res.json({
          res: true,
          msg: 'SpocPerson is not found.'
        })
      }

      if (isSpocPerson.status == "Active") {
        await SpocPersonModel.updateOne({ _id: isSpocPerson._id }, {
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
          msg: 'Successfully Spoc Person is Inactive',
        });
      }

      await SpocPersonModel.updateOne({ _id: isSpocPerson._id }, {
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
        msg: 'Successfully Spoc Person is Active',
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

      const isSpocPersonExisting = await SpocPersonModel.findOne({ _id: req.params.id })

      if (!isSpocPersonExisting) {
        return res.json({
          res: true,
          msg: 'SpocPerson is not found.'
        })
      }

      if (isSpocPersonExisting.status == "Active") {

        await SpocPersonModel.updateOne({ _id: isSpocPersonExisting._id }, {
          $set: {
            status: "Inactive",
            lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            lastUpdatedByName: isSpocPerson.spocCreatedByName,
            lastUpdatedById: isSpocPerson.spocCreatedById,
          }
        })

        return res.json({
          res: true,
          status: "Inactive",
          msg: 'Successfully Spoc Person is Inactive',
        });
      }

      await SpocPersonModel.updateOne({ _id: isSpocPersonExisting._id }, {
        $set: {
          status: "Active",
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isSpocPerson.spocCreatedByName,
          lastUpdatedById: isSpocPerson.spocCreatedById,
        }
      })

      return res.json({
        res: true,
        status: "Active",
        msg: 'Successfully Spoc Person is Active',
      });
    }

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const spocPersonRemove = async (req, res) => {
  try {
    if (req.user.loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isSpocPerson = await SpocPersonModel.findOne({ _id: req.params.id })

      if (!isSpocPerson) {
        return res.json({
          res: true,
          msg: 'SpocPerson is not found.'
        })
      }

      await SpocPersonModel.deleteOne({ _id: isSpocPerson._id })

      return res.json({
        res: true,
        msg: 'Successfully SPOC Person remove.',
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

      const isSpocPerson = await SpocPersonModel.findOne({ _id: req.params.id })

      if (!isSpocPerson) {
        return res.json({
          res: true,
          msg: 'SpocPerson is not found.'
        })
      }

      await SpocPersonModel.deleteOne({ _id: isSpocPerson._id })

      return res.json({
        res: true,
        msg: 'Successfully SPOC Person remove.',
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

      const isSpocPersonExisting = await SpocPersonModel.findOne({ _id: req.params.id })

      if (!isSpocPersonExisting) {
        return res.json({
          res: true,
          msg: 'SpocPerson is not found.'
        })
      }

      await SpocPersonModel.deleteOne({ _id: isSpocPersonExisting._id })

      return res.json({
        res: true,
        msg: 'Successfully SPOC Person remove.',
      });
    }


  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

module.exports = {
  spocPersonCreate,
  spocPersonList,
  spocPersonEdit,
  spocPersonStatusChange,
  spocPersonRemove
}