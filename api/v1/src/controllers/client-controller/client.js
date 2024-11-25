const AdminModel = require("../../models/admin.model");
const ClientModel = require("../../models/client.model")
const SectorModel = require("../../models/sector.model")
const sendMail = require("../../helpers/mail-send")

const moment = require('moment-timezone');


/**
 * @swagger
 * /client-add:
 *   post:
 *     summary: Create a client.
 *     tags: 
 *       - Client
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *               clientEmail:
 *                 type: string
 *               password:
 *                 type: string
 *               companyName:
 *                 type: string
 *               assginedSectorsId:
 *                 type: string
 *                
 *     responses:
 *       200:
 *         description: Client created successfully.
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
 * /client:
 *   get:
 *     summary: Client List.
 *     tags: 
 *       - Client
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
 *         description: Client List.
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
 * /client/{id}:
 *   put:
 *     summary: Client Edit.
 *     tags: 
 *       - Client
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Client Id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *               clientEmail:
 *                 type: string
 *               password:
 *                 type: string
 *               companyName:
 *                 type: string
 *               assginedSectorsId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully Client update..
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
 * /client-status/{id}:
 *   put:
 *     summary: client Status Active Inactive.
 *     tags: 
 *       - Client
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: Client ID.
 *     responses:
 *       200:
 *         description: Successfully client status change.
 *       401:
 *         description: Unauthorized - Invalid token.
 *       500:
 *         description: Server Error.
 * 
 * /client-remove/{id}:
 *   delete:
 *     summary: client remove.
 *     tags: 
 *       - Client
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: Client ID.
 *     responses:
 *       200:
 *         description: Successfully client remove.
 *       401:
 *         description: Unauthorized - Invalid token.
 *       500:
 *         description: Server Error.
 */

const clientCreate = async (req, res) => {
  try {

    const isAdmin = await AdminModel.findOne({ email: req.user.email })
    if (!isAdmin) {
      return res.json({
        res: false,
        msg: 'admin is not found!',
      });
    }
    const { clientName, password, companyName, assginedSectorsId } = req.body
    const  clientEmail = req.body.clientEmail.toLowerCase()
    if (clientName == "" || clientEmail == "" || password == "" || companyName == "" || assginedSectorsId == "") {
      return res.json({
        res: false,
        msg: 'All fields required.',
      });
    }
    const isClient = await ClientModel.findOne({ clientEmail: req.body.clientEmail })
    if (isClient) {
      return res.json({
        res: false,
        msg: 'clientEmail already used',
      });
    }
    const assginedSectorsName = [];
    await Promise.all(assginedSectorsId.map(async (id) => {
      const isSector = await SectorModel.findOne({ _id: id });
      if (!isSector) {
        return res.json({
          res: false,
          msg: 'Sector is not found!',
        });
      }
      await assginedSectorsName.push(isSector.name)
    }))
    await ClientModel.create({
      clientName: clientName,
      clientEmail: clientEmail,
      password: password,
      companyName: companyName,
      assginedSectorsId: assginedSectorsId,
      assginedSectorsName: assginedSectorsName,
      createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
      createdById: isAdmin.id,
      createdByName: isAdmin.userName,
      lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
      lastUpdatedByName: isAdmin.userName,
      lastUpdatedById: isAdmin.id,
      status: "Active"
    })

    await sendMail({ email: clientEmail, password: password, clientName: clientName, createdByName: isAdmin.userName }, "Welcome to Exam Portal!")

    return res.json({
      res: true,
      msg: 'Successfully client create!',
    })


  } catch (error) {
    console.error(error);
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const clientList = async (req, res) => {
  try {

    const isAdmin = await AdminModel.findOne({ email: req.user.email })
    if (!isAdmin) {
      return res.json({
        res: false,
        msg: 'email already exist!',
      });
    }

    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const clientData = await ClientModel.paginate({}, options);

    return res.json({
      res: true,
      msg: 'Success',
      data: clientData.docs,
      paginate: {
        totalDocs: clientData.totalDocs,
        limit: clientData.limit,
        totalPages: clientData.totalPages,
        page: clientData.page,
        pagingCounter: clientData.pagingCounter,
        hasPrevPage: clientData.hasPrevPage,
        hasNextPage: clientData.hasNextPage,
        prevPage: clientData.prevPage,
        nextPage: clientData.nextPage
      }
    })

  } catch (error) {
    console.error("error in get client list",error)
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const clientEdit = async (req, res) => {
  try {

    const isAdmin = await AdminModel.findOne({ email: req.user.email })
    if (!isAdmin) {
      return res.json({
        res: false,
        msg: 'admin is not found',
      });
    }

    const isClient = await ClientModel.findOne({ _id: req.params.id })
    if (!isClient) {
      return res.json({
        res: true,
        msg: 'Client is not found.'
      })
    }
    const { assginedSectorsId } = req.body
    const assginedSectorsName = [];
    await Promise.all(assginedSectorsId.map(async (id) => {
      const isSector = await SectorModel.findOne({ _id: id });
      if (!isSector) {
        return res.json({
          res: false,
          msg: 'Sector is not found!',
        });
      }
      await assginedSectorsName.push(isSector.name)
    }))

    const isSector = await SectorModel.findOne({ _id: req.body.assginedSectorsId });

    if (!isSector) {
      return res.json({
        res: false,
        msg: 'Sector is not found!',
      });
    }

    if (req.body.clientEmail) {
      const existingClient = await ClientModel.findOne({ clientEmail: req.body.clientEmail, _id: { $ne: isClient } });
      if (existingClient) {
        return res.json({
          res: false,
          msg: "Client email already exists!",
        });
      }
    }
    await ClientModel.updateOne({ _id: isClient._id }, {
      $set: {
        clientName: req.body.clientName ? req.body.clientName : isClient.clientName,
        clientEmail: req.body.clientEmail.toLowerCase() ? req.body.clientEmail.toLowerCase() : isClient.clientEmail,
        password: req.body.password ? req.body.password : isClient.password,
        companyName: req.body.companyName ? req.body.companyName : isClient.companyName,
        assginedSectorsId: assginedSectorsId,
        assginedSectorsName: assginedSectorsName,
        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        lastUpdatedByName: isAdmin.userName,
        lastUpdatedById: isAdmin.id
      }
    })


    return res.json({
      res: true,
      msg: 'Successfully Client update.'
    })
  } catch (error) {
    console.error("error in client edit", error)
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const clientStatusChange = async (req, res) => {
  try {

    const isAdmin = await AdminModel.findOne({ email: req.user.email })
    if (!isAdmin) {
      return res.json({
        res: false,
        msg: 'admin is not found!',
      });
    }

    const isClient = await ClientModel.findOne({ _id: req.params.id })

    if (!isClient) {
      return res.json({
        res: true,
        msg: 'Client is not found.'
      })
    }

    if (isClient.status == "Active") {

      await ClientModel.updateOne({ _id: isClient._id }, {
        $set: {
          status: "Inactive",
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isAdmin.userName,
          lastUpdatedById: isAdmin.id
        }
      })

      return res.json({
        res: true,
        status: "Inactive",
        msg: 'Successfully Client is Inactive',
      });
    }

    await ClientModel.updateOne({ _id: isClient._id }, {
      $set: {
        status: "Active",
        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        lastUpdatedByName: isAdmin.userName,
        lastUpdatedById: isAdmin.id
      }
    })

    return res.json({
      res: true,
      status: "Active",
      msg: 'Successfully Client is Active',
    });

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const clientremove = async (req, res) => {
  try {

    const isAdmin = await AdminModel.findOne({ email: req.user.email })
    if (!isAdmin) {
      return res.json({
        res: false,
        msg: 'admin is not found!',
      });
    }

    const isClient = await ClientModel.findOne({ _id: req.params.id })

    if (!isClient) {
      return res.json({
        res: true,
        msg: 'Client is not found.'
      })
    }

    await ClientModel.deleteOne({ _id: isClient._id })

    return res.json({
      res: true,
      msg: 'Successfully Client remove.',
    });

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}
module.exports = {
  clientCreate,
  clientList,
  clientEdit,
  clientStatusChange,
  clientremove
};