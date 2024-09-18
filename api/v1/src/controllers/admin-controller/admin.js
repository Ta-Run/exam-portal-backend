// const {Admin} =require("../../models/index")
const AdminModel = require("../../models/admin.model")
const adminAccessToken = require("../../models/admin.access.token")
const ClientModel = require("../../models/client.model")
const ClientAccessTokenModel = require("../../models/client.access.token")
const SectorModel = require("../../models/sector.model")
const AccessorModel = require("../../models/accessCode")
const CandidateModel = require("../../models/manageCandidate")
const BatchModel = require("../../models/manage-Batch")
const SpocModel = require("../../models/spoc-person.model")

const moment = require('moment')
const { randomBytes } = require('crypto')
const jwt = require('jsonwebtoken')
const { Console } = require("console")


/**
 * @swagger
 * /default-admin:
 *   post:
 *     summary: Create a default admin user.
 *     tags: 
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully created the default admin user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 res:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: object
 *       500:
 *         description: Server Error.
 * 
 * /admin/login:
 *   post:
 *     summary: Admin User Login. Login Type["Admin", "Client"]
 *     tags: 
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               loginType:
 *                 type: string
 *                 enum: 
 *                  - Admin
 *                  - Client
 *     responses:
 *       200:
 *         description: Successfully created the default admin user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 res:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: object
 *       500:
 *         description: Server Error.
 * 
 * /admin/logout:
 *   get:
 *     summary: Admin User Logout.
 *     tags: 
 *       - Admin
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully created the default admin user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 res:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: object
 *       500:
 *         description: Server Error.
 */

const defultAdminCrate = async (req, res) => {
  try {
    const { userName, password } = req.body
    const email = req.body.email.toLowerCase()

    const isAdmin = await AdminModel.findOne({ userName: userName })

    if (isAdmin) {
      return res.json({
        res: false,
        msg: "Alrady Account Existing!"
      })
    }

    await AdminModel.create({
      userName: userName,
      email: email,
      password: password,
    })

    const adminDetails = await AdminModel.findOne({ userName: userName })

    return res.json({
      res: true,
      data: adminDetails
    })

  } catch (error) {
    Console.error("error in  admin create ", error)
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { password, loginType } = req.body
    console.log('password', password)
    const email = req.body.email.toLowerCase()

    // Admin Login
    if (loginType == "Admin") {
      const isAdmin = await AdminModel.findOne({ email: email })

      if (!isAdmin) {
        return res.json({
          res: false,
          msg: "Invalid credentials!"
        })
      }

      if (isAdmin.password != password) {
        return res.json({
          res: false,
          msg: "Invalid credentials!"
        })
      }

      const jti = randomBytes(32).toString("hex");
      const jwtToken = jwt.sign(
        {
          sub: isAdmin._id,
          jti,
          email: isAdmin.email,
          loginType: loginType
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "365 days",
        }
      );

      const decodedJwtToken = jwt.decode(jwtToken);
      await adminAccessToken.create({
        adminId: isAdmin._id,
        jti: decodedJwtToken.jti,
        token: jwtToken,
        expiresAt: moment.unix(decodedJwtToken.exp).format("YYYY-MM-DD"),
      });

      return res.json({
        res: true,
        msg: "Success",
        data: {
          ...isAdmin._doc,
          authentication: {
            accessToken: jwtToken,
            expireAt: decodedJwtToken.exp,
          }
        }
      })
    }
    // Client Login
    else if (loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: "Invalid credentials!"
        })
      }

      if (isClient.password != password) {
        return res.json({
          res: false,
          msg: "Invalid credentials!"
        })
      }

      const jti = randomBytes(32).toString("hex");
      const jwtToken = jwt.sign(
        {
          sub: isClient._id,
          jti,
          email: isClient.clientEmail,
          loginType: loginType
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "365 days",
        }
      );

      const decodedJwtToken = jwt.decode(jwtToken);
      await ClientAccessTokenModel.create({
        clientId: isClient._id,
        jti: decodedJwtToken.jti,
        token: jwtToken,
        expiresAt: moment.unix(decodedJwtToken.exp).format("YYYY-MM-DD"),
      });

      return res.json({
        res: true,
        msg: "Success",
        data: {
          ...isClient._doc,
          authentication: {
            accessToken: jwtToken,
            expireAt: decodedJwtToken.exp,
          }
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

const adminLogout = async (req, res) => {
  try {
    if (req.user.loginType == "Admin") {
      const adminAccessTokenData = await adminAccessToken.updateOne({ jti: req.user.jti }, { $set: { revoked: true } })
      if (!adminAccessTokenData) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
    }

    else if (req.user.loginType == "Client") {
      const clientAccessToken = await ClientAccessTokenModel.updateOne({ jti: req.user.jti }, { $set: { revoked: true } })
      if (!clientAccessToken) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
    }

    return res.json({
      data: {
        res: true,
        msg: 'Successfully logout!'
      }
    })

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const adminDashboard = async (req, res) => {
  try {
    const adminData = await AdminModel.findOne({ _id: req.user.id })
    if (!adminData) {
      return res.json({
        res: false,
        msg: 'Admin not found!',
      })
    }

    const sectorData = await SectorModel.find({});
    const totalSector = sectorData.length;

    const accessorData = await AccessorModel.find({});
    const totalAccessor = accessorData.length;

    const clientData = await ClientModel.find({});
    const totalClient = clientData.length;

    const candidateData = await CandidateModel.find({});
    const totalCandidate = candidateData.length;

    const batchData = await BatchModel.find({});
    const totalBatch = batchData.length;


    const currentTime = moment().format('hh:mm A');
    const currentDate = moment().format('DD-MM-YYYY');
    const options = {

    };
    const query = {
      $expr: {
        $and: [
          { $eq: ["$StartDate", currentDate] },
          { $lte: ["$StartTime", currentTime] },
          { $gte: ["$EndTime", currentTime] }
        ]
      }
    };
    const currentBatch = await BatchModel.paginate(query, options);
    const totalCurrentBatch = currentBatch.docs;

    const completeQuery = {
      $expr: {
        $lt: ["$EndDate", currentDate]  // Compare EndDate directly with the current date
      }
    };

    const completedBatch = await BatchModel.paginate(completeQuery, options);
    const totalCompletedBatch = completedBatch.docs;


    const today = moment().format('YYYY-MM-DD');

    let ScheduleQuery = {
      StartDate: { $gte: today }
    };

    const scheduleDataList = await BatchModel.paginate(ScheduleQuery, options);
    const totalScheduleBatch = scheduleDataList.docs;

    return res.json({
      res: true,
      msg: 'Success',
      data: {
        totalSector: totalSector,
        totalAccessor: totalAccessor,
        totalClient: totalClient,
        totalCandidate: totalCandidate,
        totalBatch: totalBatch,
        totalCurrentBatch: totalCurrentBatch.length,
        totalCompletedBatch: totalCompletedBatch.length,
        totalScheduleBatch: totalScheduleBatch.length
      }
    })
  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const clientDashboard = async (req, res) => {
  try {
    const clientData = await ClientModel.findOne({ _id: req.user.id });
    if (!clientData) {
      return res.json({
        res: false,
        msg: 'Client not found!'
      })
    }

    const batchData = await BatchModel.find({ clientId: clientData._id });
    const totalBatch = batchData.length;

    const accessorData = await AccessorModel.find({ clientId: clientData._id });
    const totalAccessor = accessorData.length;

    const candidateData = await CandidateModel.find({ clientId: clientData._id });
    const totalCandidate = candidateData.length;

    const currentTime = moment().format('hh:mm A');
    const currentDate = moment().format('DD-MM-YYYY');
    const options = {

    };
    const query = {
      clientId: clientData._id,
      $expr: {
        $and: [
          { $eq: ["$StartDate", currentDate] },
          { $lte: ["$StartTime", currentTime] },
          { $gte: ["$EndTime", currentTime] }
        ]
      }
    };
    const currentBatch = await BatchModel.paginate(query, options);
    const totalCurrentBatch = currentBatch.docs;

    const completeQuery = {
      clientId: clientData._id,
      $expr: {
        $lt: ["$EndDate", currentDate]  // Compare EndDate directly with the current date
      }
    };

    const completedBatch = await BatchModel.paginate(completeQuery, options);
    const totalCompletedBatch = completedBatch.docs;


    const today = moment().format('YYYY-MM-DD');

    let ScheduleQuery = {
      clientId: clientData._id,
      StartDate: { $gte: today }
    };

    const scheduleDataList = await BatchModel.paginate(ScheduleQuery, options);
    const totalScheduleBatch = scheduleDataList.docs;

    const spocPerson = await SpocModel.find({ clientId: clientData._id });
    const totalSpocPerson = spocPerson.length;

    return res.json({
      res: true,
      msg: 'Success',
      data: {
        totalBatch: totalBatch,
        totalAccessor: totalAccessor,
        totalCandidate: totalCandidate,
        totalCurrentBatch: totalCurrentBatch.length,
        totalCompletedBatch: totalCompletedBatch.length,
        totalScheduleBatch: totalScheduleBatch.length,
        totalSpocPerson: totalSpocPerson
      }
    })

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

module.exports = {
  defultAdminCrate,
  adminLogin,
  adminLogout,
  adminDashboard,
  clientDashboard
};
