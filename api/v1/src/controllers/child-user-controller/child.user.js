const SectorModel = require("../../models/sector.model")
const ClientModel = require("../../models/client.model")
const AdminModel = require("../../models/admin.model");
const ChildUsersModel = require("../../models/child.user.model")
const ChildUserModel = require("../../models/child.user.model")


const moment = require('moment-timezone');
const childUserModel = require("../../models/child.user.model");
const SpocPersonModel = require("../../models/spoc-person.model");

const childUserCreate = async (req, res) => {
  try {
    if (req.user.loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const { firstName, lastName, contactNo, dateofcreation, selectPageViewPermission, selectSectorPermission, address, password } = req.body
      const emailId = req.body.emailId.toLowerCase()


      if (firstName == "" || lastName == "" || contactNo == "" || emailId == "" || dateofcreation == "" || selectPageViewPermission == "" || selectSectorPermission == "" || address == "") {
        return res.json({
          res: false,
          msg: 'All fields required.',
        });
      }

      const isSector = await SectorModel.findOne({ _id: selectSectorPermission });
      if (!isSector) {
        return res.json({
          res: false,
          msg: 'Select Sector Permission is not found!',
        });
      }
      const isContactNo = await ChildUsersModel.findOne({
        contactNo: { $regex: `^${contactNo}$`, $options: 'i' },
        clientId: isClient._id,
      });
      if (isContactNo) {
        return res.json({
          res: false,
          msg: 'contactNo is Alrady Exising!',
        });
      }
      const isEmailId = await ChildUsersModel.findOne({
        emailId: { $regex: `^${emailId}$`, $options: 'i' },
        clientId: isClient._id,
      });
      if (isEmailId) {
        return res.json({
          res: false,
          msg: 'emailId is Alrady Exising!',
        });
      }
      await ChildUsersModel.create({
        firstName: firstName,
        lastName: lastName,
        contactNo: contactNo,
        emailId: emailId,
        password: password,
        dateofcreation: dateofcreation,
        selectPageViewPermission: selectPageViewPermission,
        selectSectorPermissionId: selectSectorPermission,
        selectSectorPermissionName: isSector.name,
        address: address,
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
        msg: "Successfully Child User create."
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

      const { firstName, lastName, contactNo, dateofcreation, selectPageViewPermission, selectSectorPermission, address, password } = req.body
      const emailId = req.body.emailId.toLowerCase()


      if (firstName == "" || lastName == "" || contactNo == "" || emailId == "" || dateofcreation == "" || selectPageViewPermission == "" || selectSectorPermission == "" || address == "") {
        return res.json({
          res: false,
          msg: 'All fields required.',
        });
      }

      const isSector = await SectorModel.findOne({ _id: selectSectorPermission });
      if (!isSector) {
        return res.json({
          res: false,
          msg: 'Select Sector Permission is not found!',
        });
      }
      const isContactNo = await ChildUsersModel.findOne({
        contactNo: { $regex: `^${contactNo}$`, $options: 'i' },
        clientId: isClient._id,
      });
      if (isContactNo) {
        return res.json({
          res: false,
          msg: 'contactNo is Alrady Exising!',
        });
      }
      const isEmailId = await ChildUsersModel.findOne({
        emailId: { $regex: `^${emailId}$`, $options: 'i' },
        clientId: isClient._id,
      });
      if (isEmailId) {
        return res.json({
          res: false,
          msg: 'emailId is Alrady Exising!',
        });
      }
      await ChildUsersModel.create({
        firstName: firstName,
        lastName: lastName,
        contactNo: contactNo,
        emailId: emailId,
        password: password,
        dateofcreation: dateofcreation,
        selectPageViewPermission: selectPageViewPermission,
        selectSectorPermissionId: selectSectorPermission,
        selectSectorPermissionName: isSector.name,
        address: address,
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
        spocCreatedByName: isSpocPerson.spocPersonName,
      })
      return res.json({
        res: true,
        msg: "Successfully Child User create."
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

      const { firstName, lastName, contactNo, dateofcreation, selectPageViewPermission, selectSectorPermission, address, password } = req.body
      const emailId = req.body.emailId.toLowerCase()


      if (firstName == "" || lastName == "" || contactNo == "" || emailId == "" || dateofcreation == "" || selectPageViewPermission == "" || selectSectorPermission == "" || address == "") {
        return res.json({
          res: false,
          msg: 'All fields required.',
        });
      }

      const isSector = await SectorModel.findOne({ _id: selectSectorPermission });
      if (!isSector) {
        return res.json({
          res: false,
          msg: 'Select Sector Permission is not found!',
        });
      }
      const isContactNo = await ChildUsersModel.findOne({
        contactNo: { $regex: `^${contactNo}$`, $options: 'i' },
        clientId: isClient._id,
      });
      if (isContactNo) {
        return res.json({
          res: false,
          msg: 'contactNo is Alrady Exising!',
        });
      }
      const isEmailId = await ChildUsersModel.findOne({
        emailId: { $regex: `^${emailId}$`, $options: 'i' },
        clientId: isClient._id,
      });
      if (isEmailId) {
        return res.json({
          res: false,
          msg: 'emailId is Alrady Exising!',
        });
      }
      await ChildUsersModel.create({
        firstName: firstName,
        lastName: lastName,
        contactNo: contactNo,
        emailId: emailId,
        password: password,
        dateofcreation: dateofcreation,
        selectPageViewPermission: selectPageViewPermission,
        selectSectorPermissionId: selectSectorPermission,
        selectSectorPermissionName: isSector.name,
        address: address,
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
      })
      return res.json({
        res: true,
        msg: "Successfully Child User create."
      })

    }

  } catch (error) {
    console.error("error in child user create", error)
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const childUserList = async (req, res) => {
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

      const childUserData = await ChildUsersModel.paginate(query, options);

      return res.json({
        res: true,
        msg: 'Success',
        data: childUserData.docs,
        paginate: {
          totalDocs: childUserData.totalDocs,
          limit: childUserData.limit,
          totalPages: childUserData.totalPages,
          page: childUserData.page,
          pagingCounter: childUserData.pagingCounter,
          hasPrevPage: childUserData.hasPrevPage,
          hasNextPage: childUserData.hasNextPage,
          prevPage: childUserData.prevPage,
          nextPage: childUserData.nextPage
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

      const childUserData = await ChildUsersModel.paginate(query, options);

      return res.json({
        res: true,
        msg: 'Success',
        data: childUserData.docs,
        paginate: {
          totalDocs: childUserData.totalDocs,
          limit: childUserData.limit,
          totalPages: childUserData.totalPages,
          page: childUserData.page,
          pagingCounter: childUserData.pagingCounter,
          hasPrevPage: childUserData.hasPrevPage,
          hasNextPage: childUserData.hasNextPage,
          prevPage: childUserData.prevPage,
          nextPage: childUserData.nextPage
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
      let query = { createdById: isClient._id, spocCreatedById: isSpocPerson._id };

      const childUserData = await ChildUsersModel.paginate(query, options);
      return res.json({
        res: true,
        msg: 'Success',
        data: childUserData.docs,
        paginate: {
          totalDocs: childUserData.totalDocs,
          limit: childUserData.limit,
          totalPages: childUserData.totalPages,
          page: childUserData.page,
          pagingCounter: childUserData.pagingCounter,
          hasPrevPage: childUserData.hasPrevPage,
          hasNextPage: childUserData.hasNextPage,
          prevPage: childUserData.prevPage,
          nextPage: childUserData.nextPage
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
      let query = { createdById: isClient._id, childUserCreatedById: isChildUser._id };

      const childUserData = await ChildUsersModel.paginate(query, options);
      return res.json({
        res: true,
        msg: 'Success',
        data: childUserData.docs,
        paginate: {
          totalDocs: childUserData.totalDocs,
          limit: childUserData.limit,
          totalPages: childUserData.totalPages,
          page: childUserData.page,
          pagingCounter: childUserData.pagingCounter,
          hasPrevPage: childUserData.hasPrevPage,
          hasNextPage: childUserData.hasNextPage,
          prevPage: childUserData.prevPage,
          nextPage: childUserData.nextPage
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

const childUserEdit = async (req, res) => {
  try {

    const { contactNo } = req.body;
    const emailId = req.body.emailId.toLowerCase()

    const isChildUser = await ChildUsersModel.findOne({ _id: req.params.id });
    if (!isChildUser) {
      return res.json({
        res: false,
        msg: 'Child user is not found!',
      });
    }
    const isSector = await SectorModel.findOne({ _id: req.body.selectSectorPermission });

    if (!isSector) {
      return res.json({
        res: false,
        msg: 'Select Sector Permission is not found!',
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
      if (contactNo) {
        let codeQuery = {
          contactNo: contactNo,
          clientId: isClient._id
        };
        if (contactNo) {
          codeQuery._id = { $ne: isChildUser }
        }
        const existingCode = await ChildUsersModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "contactNo Name is already existing!"
          })
        }
      }
      if (emailId) {
        let codeQuery = {
          emailId: { $regex: `^${emailId}$`, $options: 'i' },
          // emailId: emailId,
          clientId: isClient._id
        };
        if (emailId) {
          codeQuery._id = { $ne: isChildUser }
        }
        const existingCode = await ChildUsersModel.findOne(codeQuery)
        if (existingCode) {
          return res.json({
            res: false,
            msg: "email is already existing!"
          })
        }

      }
      await ChildUsersModel.updateOne({ _id: isChildUser._id }, {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          contactNo: req.body.contactNo,
          password: req.body.password,
          emailId: req.body.emailId.toLowerCase(),
          dateofcreation: req.body.dateofcreation,
          selectPageViewPermission: req.body.selectPageViewPermission,
          selectSectorPermissionId: isSector._id,
          selectSectorPermissionName: isSector.name,
          address: req.body.address,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isClient.clientName,
          lastUpdatedById: isClient._id
        }
      })

      return res.json({
        res: true,
        msg: "Successfully Child User update."
      })

    }
    if (req.user.loginType == "Admin") {
      const isAdmin = await AdminModel.findOne({ email: req.user.email })
      if (!isAdmin) {
        return res.json({
          res: false,
          msg: 'admin is not found!',
        });
      }
      if (contactNo) {
        let codeQuery = { contactNo: contactNo };
        if (contactNo) {
          codeQuery._id = { $ne: isChildUser }
        }
        const existingCode = await ChildUsersModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "contactNo Name is already existing!"
          })
        }
      }
      if (emailId) {
        let codeQuery = {
          emailId: { $regex: `^${emailId}$`, $options: 'i' },

        };
        if (emailId) {
          codeQuery._id = { $ne: isChildUser }
        }
        const existingCode = await ChildUsersModel.findOne(codeQuery)
        if (existingCode) {
          return res.json({
            res: false,
            msg: "email is already existing!"
          })
        }
      }
      await ChildUsersModel.updateOne({ _id: isChildUser._id }, {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          contactNo: req.body.contactNo,
          emailId: req.body.emailId.toLowerCase(),
          dateofcreation: req.body.dateofcreation,
          selectPageViewPermission: req.body.selectPageViewPermission,
          selectSectorPermissionId: isSector._id,
          selectSectorPermissionName: isSector.name,
          address: req.body.address,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isAdmin.userName,
          lastUpdatedById: isAdmin._id
        }
      })

      return res.json({
        res: true,
        msg: "Successfully Child User update."
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
      if (contactNo) {
        let codeQuery = {
          contactNo: contactNo,
          clientId: isClient._id,
          spocCreatedById: isSpocPerson._id
        };
        if (contactNo) {
          codeQuery._id = { $ne: isChildUser }
        }
        const existingCode = await ChildUsersModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "contactNo Name is already existing!"
          })
        }
      }
      if (emailId) {
        let codeQuery = {
          emailId: { $regex: `^${emailId}$`, $options: 'i' },
          // emailId: emailId,
          clientId: isClient._id,
          spocCreatedById: isSpocPerson._id
        };
        if (emailId) {
          codeQuery._id = { $ne: isChildUser }
        }
        const existingCode = await ChildUsersModel.findOne(codeQuery)
        if (existingCode) {
          return res.json({
            res: false,
            msg: "email is already existing!"
          })
        }

      }
      await ChildUsersModel.updateOne({ _id: isChildUser._id }, {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          contactNo: req.body.contactNo,
          emailId: req.body.emailId.toLowerCase(),
          password: req.body.password,
          dateofcreation: req.body.dateofcreation,
          selectPageViewPermission: req.body.selectPageViewPermission,
          selectSectorPermissionId: isSector._id,
          selectSectorPermissionName: isSector.name,
          address: req.body.address,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isSpocPerson.spocPersonName,
          lastUpdatedById: isSpocPerson._id,

        }
      })

      return res.json({
        res: true,
        msg: "Successfully Child User update."
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
      if (contactNo) {
        let codeQuery = {
          contactNo: contactNo,
          clientId: isClient._id,
          childUserCreatedById: isChildUser._id
        };
        if (contactNo) {
          codeQuery._id = { $ne: isChildUser }
        }
        const existingCode = await ChildUsersModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "contactNo Name is already existing!"
          })
        }
      }
      if (emailId) {
        let codeQuery = {
          emailId: { $regex: `^${emailId}$`, $options: 'i' },
          // emailId: emailId,
          clientId: isClient._id,
          childUserCreatedById: isChildUser._id
        };
        if (emailId) {
          codeQuery._id = { $ne: isChildUser }
        }
        const existingCode = await ChildUsersModel.findOne(codeQuery)
        if (existingCode) {
          return res.json({
            res: false,
            msg: "email is already existing!"
          })
        }

      }
      await ChildUsersModel.updateOne({ _id: isChildUser._id }, {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          contactNo: req.body.contactNo,
          emailId: req.body.emailId.toLowerCase(),
          password: req.body.password,
          dateofcreation: req.body.dateofcreation,
          selectPageViewPermission: req.body.selectPageViewPermission,
          selectSectorPermissionId: isSector._id,
          selectSectorPermissionName: isSector.name,
          address: req.body.address,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isChildUser.emailId,
          lastUpdatedById: isChildUser._id,
        }
      })
      return res.json({
        res: true,
        msg: "Successfully Child User update."
      })
    }
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });

  } catch (error) {
    console.error("error in child user update", error)
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const childUserStatusChange = async (req, res) => {
  try {

    const isChildUser = await ChildUsersModel.findOne({ _id: req.params.id });

    if (!isChildUser) {
      return res.json({
        res: false,
        msg: 'Child user is not found!',
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

      if (isChildUser.status == "Active") {
        await ChildUsersModel.updateOne({ _id: isChildUser._id }, {
          $set: {
            status: "Inactive",
            lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            lastUpdatedByName: isChildUser.clientName,
            lastUpdatedById: isChildUser.id,
          }
        })

        return res.json({
          res: true,
          status: "Inactive",
          msg: 'Successfully Child user is Inactive',
        });
      }

      await ChildUsersModel.updateOne({ _id: isChildUser._id }, {
        $set: {
          status: "Active",
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isChildUser.clientName,
          lastUpdatedById: isChildUser.id,
        }
      })

      return res.json({
        res: true,
        status: "Active",
        msg: 'Successfully Child user is Active',
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


      if (isChildUser.status == "Active") {
        await ChildUsersModel.updateOne({ _id: isChildUser._id }, {
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
          msg: 'Successfully Child user is Inactive',
        });
      }

      await ChildUsersModel.updateOne({ _id: isChildUser._id }, {
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
        msg: 'Successfully Child user is Active',
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

      if (isChildUser.status == "Active") {
        await ChildUsersModel.updateOne({ _id: isChildUser._id }, {
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
          msg: 'Successfully Child user is Inactive',
        });
      }

      await ChildUsersModel.updateOne({ _id: isChildUser._id }, {
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
        msg: 'Successfully Child user is Active',
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
      if (isChildUser.status == "Active") {
        await ChildUsersModel.updateOne({ _id: isChildUser._id }, {
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
          msg: 'Successfully Child user is Inactive',
        });
      }

      await ChildUsersModel.updateOne({ _id: isChildUser._id }, {
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
        msg: 'Successfully Child user is Active',
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

const childUserRemove = async (req, res) => {
  try {

    if (req.user.loginType == "Client") {

      const isChildUser = await ChildUsersModel.findOne({ _id: req.params.id });

      if (!isChildUser) {
        return res.json({
          res: false,
          msg: 'Child user is not found!',
        });
      }

      await ChildUsersModel.deleteOne({ _id: isChildUser._id })

      return res.json({
        res: true,
        msg: 'Successfully Child user remove.',
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

      const isChildUser = await ChildUsersModel.findOne({ _id: req.params.id });

      if (!isChildUser) {
        return res.json({
          res: false,
          msg: 'Child user is not found!',
        });
      }

      await ChildUsersModel.deleteOne({ _id: isChildUser._id })

      return res.json({
        res: true,
        msg: 'Successfully Child user remove.',
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
      if (!isChildUser) {
        return res.json({
          res: false,
          msg: 'Child user is not found!',
        });
      }

      await ChildUsersModel.deleteOne({ _id: isChildUser._id })

      return res.json({
        res: true,
        msg: 'Successfully Child user remove.',
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
  childUserCreate,
  childUserList,
  childUserEdit,
  childUserStatusChange,
  childUserRemove
}