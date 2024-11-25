const sectorModel = require("../../models/sector.model")
const AdminModel = require("../../models/admin.model")
const ClientModel = require("../../models/client.model")
const SpocPersonModel = require("../../models/spoc-person.model")
const ChildUserModel = require("../../models/child.user.model")

const moment = require('moment-timezone');

/**
 * @swagger
 * /sector-add:
 *   post:
 *     summary: Create a sector.
 *     tags: 
 *       - Sector
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *               type:
 *                 type: string
 *                 enum:
 *                   - Government
 *                   - Private
 *     responses:
 *       200:
 *         description: Sector created successfully.
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
 * /sector:
 *   get:
 *     summary: Retrieve a list of sectors.
 *     tags: 
 *       - Sector
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
 *         description: A list of sectors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 res:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "66474dc17608a728602818eb"
 *                       name:
 *                         type: string
 *                         example: "SCGJ"
 *                       logo:
 *                         type: string
 *                         example: "/upload/logo-1715948993143.png"
 *                       type:
 *                         type: string
 *                         enum:
 *                           - Government
 *                           - Private
 *                         example: "Government"
 *                       createAt:
 *                         type: string
 *                         example: "2024-05-17 17:59:53"
 *                       createdById:
 *                         type: string
 *                         example: "6645e459003c9ec98afd7b72"
 *                       createdByName:
 *                         type: string
 *                         example: "string"
 *                       lastUpdatedAt:
 *                         type: string
 *                         example: "2024-05-17 17:59:53"
 *                       lastUpdatedByName:
 *                         type: string
 *                         example: "string"
 *                       lastUpdatedById:
 *                         type: string
 *                         example: "6645e459003c9ec98afd7b72"
 *                       status:
 *                         type: string
 *                         example: "Active"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-05-17T12:29:53.213Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-05-17T12:29:53.213Z"
 *                       __v:
 *                         type: integer
 *                         example: 0
 *                 paginate:
 *                   type: object
 *                   properties:
 *                     totalDocs:
 *                       type: integer
 *                       example: 3
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pagingCounter:
 *                       type: integer
 *                       example: 1
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *                     hasNextPage:
 *                       type: boolean
 *                       example: false
 *                     prevPage:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *                     nextPage:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *       401:
 *         description: Unauthorized - Invalid token.
 *       500:
 *         description: Server Error.
 * 
 * /sector/{id}:
 *   put:
 *     summary: Sector Details update.
 *     tags: 
 *       - Sector
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: Sector ID.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *               type:
 *                 type: string
 *                 enum:
 *                   - Government
 *                   - Private
 *     responses:
 *       200:
 *         description: Sector update successfully.
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
 * /sector-status/{id}:
 *   put:
 *     summary: Sector Status Active Inactive.
 *     tags: 
 *       - Sector
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: Sector ID.
 *     responses:
 *       200:
 *         description: Successfully Sector status change.
 *       401:
 *         description: Unauthorized - Invalid token.
 *       500:
 *         description: Server Error.
 * 
 * /sector-remove/{id}:
 *   delete:
 *     summary: Sector remove.
 *     tags: 
 *       - Sector
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: Sector ID.
 *     responses:
 *       200:
 *         description: Successfully Sector status change.
 *       401:
 *         description: Unauthorized - Invalid token.
 *       500:
 *         description: Server Error.
 * 
 */

const sectorCreate = async (req, res) => {
  try {
    if (req.user.loginType == "Client") {
      return res.json({
        res: false,
        msg: 'Somthing Went To Wrong!',
      });
    }
    // Ensure file is present
    if (!req.file) {
      return res.status(400).json({ error: 'File is missing' });
    }
    const isAdmin = await AdminModel.findOne({ email: req.user.email })

    if (!isAdmin) {
      return res.json({
        res: false,
        msg: 'Somthing Went To Wrong!',
      });
    }
    const existingSector = await sectorModel.findOne({
      name: { $regex: `^${req.body.name}$`, $options: 'i' }
    });

    if (existingSector) {
      return res.json({
        res: false,
        msg: 'Sector name is already existing!'
      });
    }

    await sectorModel.create({
      name: req.body.name,
      logo: `/upload/${req.file.filename}`,
      type: req.body.type,
      createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
      createdById: isAdmin.id,
      createdByName: isAdmin.userName,
      lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
      lastUpdatedByName: isAdmin.userName,
      lastUpdatedById: isAdmin.id,
      status: "Active"
    })

    return res.json({
      res: true,
      msg: 'Successfully Sector create.',
    });

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const sectorList = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const sectorData = await sectorModel.paginate({}, options);

    return res.json({
      res: true,
      msg: 'Success',
      data: sectorData.docs,
      paginate: {
        totalDocs: sectorData.totalDocs,
        limit: sectorData.limit,
        totalPages: sectorData.totalPages,
        page: sectorData.page,
        pagingCounter: sectorData.pagingCounter,
        hasPrevPage: sectorData.hasPrevPage,
        hasNextPage: sectorData.hasNextPage,
        prevPage: sectorData.prevPage,
        nextPage: sectorData.nextPage
      }
    })

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const sectorEdit = async (req, res) => {
  try {
    if (req.user.loginType == "Client") {
      return res.json({
        res: false,
        msg: 'Somthing Went To Wrong!',
      });
    }
    const isAdmin = await AdminModel.findOne({ email: req.user.email })

    if (!isAdmin) {
      return res.json({
        res: false,
        msg: 'Somthing Went To Wrong!',
      });
    }

    const isSector = await sectorModel.findOne({ _id: req.params.id })
    if (!isSector) {
      return res.json({
        res: false,
        msg: 'Sector is not found!',
      });
    }

    if (req.body.name) {
      const existingClient = await sectorModel.findOne({name: { $regex: `^${req.body.name}$`, $options: 'i' },_id: { $ne: isSector._id}})

      if (existingClient) {
        return res.json({
          res: false,
          msg: "sector name already exists!",
        });
      }
    }
    await sectorModel.updateOne({ _id: isSector._id }, {
      $set: {
        name: req.body.name ? req.body.name : isSector.name,
        type: req.body.type ? req.body.type : isSector.type,
        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        lastUpdatedByName: isAdmin.userName,
        lastUpdatedById: isAdmin.id,
      }
    })

    if (req.file) {
      await sectorModel.updateOne({ _id: isSector._id }, {
        $set: {
          logo: `/upload/${req.file.filename}`,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isAdmin.userName,
          lastUpdatedById: isAdmin.id,
        }
      })
    }

    return res.json({
      res: true,
      msg: 'Successfully Sector update.',
    })

  } catch (error) {
    console.error("error in sector update", error)
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const sectorStatusUpdate = async (req, res) => {
  try {

    if (req.user.loginType == "Client") {
      return res.json({
        res: false,
        msg: 'Somthing Went To Wrong!',
      });
    }

    const isAdmin = await AdminModel.findOne({ email: req.user.email })

    if (!isAdmin) {
      return res.json({
        res: false,
        msg: 'Somthing Went To Wrong!',
      });
    }

    const isSector = await sectorModel.findOne({ _id: req.params.id })
    if (!isSector) {
      return res.json({
        res: false,
        msg: 'Sector is not found!',
      });
    }

    if (isSector.status == "Active") {

      await sectorModel.updateOne({ _id: isSector._id }, {
        $set: {
          status: "Inactive",
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isAdmin.userName,
          lastUpdatedById: isAdmin.id,
        }
      })

      return res.json({
        res: true,
        status: "Inactive",
        msg: 'Successfully Sector is Inactive',
      });
    }

    await sectorModel.updateOne({ _id: isSector._id }, {
      $set: {
        status: "Active",
        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
        lastUpdatedByName: isAdmin.userName,
        lastUpdatedById: isAdmin.id,
      }
    })


    return res.json({
      res: true,
      status: "Active",
      msg: 'Successfully Sector is Active',
    });

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const sectorDelete = async (req, res) => {
  try {

    if (req.user.loginType == "Client") {
      return res.json({
        res: false,
        msg: 'Somthing Went To Wrong!',
      });
    }

    const isAdmin = await AdminModel.findOne({ email: req.user.email })

    if (!isAdmin) {
      return res.json({
        res: false,
        msg: 'Somthing Went To Wrong!',
      });
    }

    const isSector = await sectorModel.findOne({ _id: req.params.id })
    if (!isSector) {
      return res.json({
        res: false,
        msg: 'Sector is not found!',
      });
    }

    await sectorModel.deleteOne({ _id: isSector._id })

    return res.json({
      res: true,
      msg: 'Successfully sector remove.',
    });


  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const sectorDropDown = async (req, res) => {
  try {
    if (req.user.loginType == "Client") {

      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
        
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const sectorData = []
      await Promise.all(isClient.assginedSectorsId.map(async (id) => {
        
       
        const sector = await sectorModel.findOne({ _id: id, status: "Active" }, "_id name");
       
        if (sector) {
          sectorData.push(sector);
        }
      }))
      
      return res.json({
        req: true,
        msg: "success",
        data: sectorData
      })
    }

    if (req.user.loginType == "Admin") {
      const sectorData = await sectorModel.find({ status: "Active" }, "_id name");
      return res.json({
        req: true,
        msg: "success",
        data: sectorData
      })
    }

    if(req.user.loginType == "spoc-person"){
      const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
      if (!isSpocPerson) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      const sectorData = await sectorModel.find({_id: { $in: isSpocPerson.assginedSectorsIds },status: "Active" }, "_id name");
      return res.json({
        req: true,
        msg: "success",
        data: sectorData
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
      const sectorData = await sectorModel.find({_id:  isChildUser.selectSectorPermissionId ,status: "Active" }, "_id name");
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

module.exports = {
  sectorCreate,
  sectorList,
  sectorEdit,
  sectorStatusUpdate,
  sectorDelete,
  sectorDropDown
};