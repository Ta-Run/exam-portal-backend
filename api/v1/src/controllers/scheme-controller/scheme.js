const SectorModel = require("../../models/sector.model")
const ClientModel = require("../../models/client.model")
const AdminModel = require("../../models/admin.model");
const SchemeModel = require("../../models/Scheme.model")
const SpocPersonModel = require("../../models/spoc-person.model")
const ChildUserModel = require("../../models/child.user.model")

const moment = require('moment-timezone');


const schemeCreate = async (req, res) => {
  try {

    if(req.user.loginType == "Client"){
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
  
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }
      const { assginedSectorsId, schemeName } = req.body
  
      if (assginedSectorsId == "" || schemeName == "") {
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
     
      const isSchemeName = await SchemeModel.findOne({
        schemeName: { $regex: `^${schemeName}$`, $options: 'i' },
        clientId: isClient._id,
      });
  
      if (isSchemeName) {
        return res.json({
          res: false,
          msg: 'scheme Name is Alrady Exising!',
        });
      }
  
      await SchemeModel.create({
        assginedSectorsId: isSector.id,
        assginedSectorsName: isSector.name,
        schemeName: schemeName,
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
        msg: "Succesfully Scheme Create."
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

      const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const { assginedSectorsId, schemeName } = req.body
  
      if (assginedSectorsId == "" || schemeName == "") {
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
     
      const isSchemeName = await SchemeModel.findOne({
        schemeName: { $regex: `^${schemeName}$`, $options: 'i' },
        clientId: isClient._id,
      });
  
      if (isSchemeName) {
        return res.json({
          res: false,
          msg: 'scheme Name is Alrady Exising!',
        });
      }
  
      await SchemeModel.create({
        assginedSectorsId: isSector.id,
        assginedSectorsName: isSector.name,
        schemeName: schemeName,
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
        msg: "Succesfully Scheme Create."
      })

    }

    if(req.user.loginType == "Child-User"){
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

      const { assginedSectorsId, schemeName } = req.body
  
      if (assginedSectorsId == "" || schemeName == "") {
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
     
      const isSchemeName = await SchemeModel.findOne({
        schemeName: { $regex: `^${schemeName}$`, $options: 'i' },
        clientId: isClient._id,
      });
  
      if (isSchemeName) {
        return res.json({
          res: false,
          msg: 'scheme Name is Alrady Exising!',
        });
      }
  
      await SchemeModel.create({
        assginedSectorsId: isSector.id,
        assginedSectorsName: isSector.name,
        schemeName: schemeName,
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
        childUserCreatedByName: isChildUser.emailId
      })
  
      return res.json({
        res: true,
        msg: "Succesfully Scheme Create."
      })

    }
    

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const schemeList = async (req, res) => {
  try {
    if(req.user.loginType == "Client"){
      
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
          if (req.query.sector) {
            query = { assginedSectorsName: req.query.sector }
          }
          const SchemeData = await SchemeModel.paginate(query, options);
      
          return res.json({
            res: true,
            msg: 'Success',
            data: SchemeData.docs,
            paginate: {
              totalDocs: SchemeData.totalDocs,
              limit: SchemeData.limit,
              totalPages: SchemeData.totalPages,
              page: SchemeData.page,
              pagingCounter: SchemeData.pagingCounter,
              hasPrevPage: SchemeData.hasPrevPage,
              hasNextPage: SchemeData.hasNextPage,
              prevPage: SchemeData.prevPage,
              nextPage: SchemeData.nextPage
            }
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
      let query = { clientId: isClient._id ,spocCreatedById: isSpocPerson._id};
      if (req.query.sector) {
        query = { assginedSectorsName: req.query.sector }
      }
      const SchemeData = await SchemeModel.paginate(query, options);
  
      return res.json({
        res: true,
        msg: 'Success',
        data: SchemeData.docs,
        paginate: {
          totalDocs: SchemeData.totalDocs,
          limit: SchemeData.limit,
          totalPages: SchemeData.totalPages,
          page: SchemeData.page,
          pagingCounter: SchemeData.pagingCounter,
          hasPrevPage: SchemeData.hasPrevPage,
          hasNextPage: SchemeData.hasNextPage,
          prevPage: SchemeData.prevPage,
          nextPage: SchemeData.nextPage
        }
      })
    }

    if(req.user.loginType == "Child-User"){
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
      let query = { clientId: isClient._id ,childUserCreatedById: isChildUser._id};
      if (req.query.sector) {
        query = { assginedSectorsName: req.query.sector }
      }
      const SchemeData = await SchemeModel.paginate(query, options);
  
      return res.json({
        res: true,
        msg: 'Success',
        data: SchemeData.docs,
        paginate: {
          totalDocs: SchemeData.totalDocs,
          limit: SchemeData.limit,
          totalPages: SchemeData.totalPages,
          page: SchemeData.page,
          pagingCounter: SchemeData.pagingCounter,
          hasPrevPage: SchemeData.hasPrevPage,
          hasNextPage: SchemeData.hasNextPage,
          prevPage: SchemeData.prevPage,
          nextPage: SchemeData.nextPage
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

const schemeRemove = async (req, res) => {
  try {
    if (req.user.loginType == "Client") {
      const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      const isScheme = await SchemeModel.findOne({ _id: req.params.id })

      if (!isScheme) {
        return res.json({
          res: true,
          msg: 'Scheme is not found.'
        })
      }

      await SchemeModel.deleteOne({ _id: isScheme._id })

      return res.json({
        res: true,
        msg: 'Successfully Scheme remove.',
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

      const isScheme = await SchemeModel.findOne({ _id: req.params.id })

      if (!isScheme) {
        return res.json({
          res: true,
          msg: 'Scheme is not found.'
        })
      }

      await SchemeModel.deleteOne({ _id: isScheme._id })

      return res.json({
        res: true,
        msg: 'Successfully Scheme remove.',
      });

    }

    if(req.user.loginType == "spoc-person"){
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

      const isScheme = await SchemeModel.findOne({ _id: req.params.id })
      if (!isScheme) {
        return res.json({
          res: true,
          msg: 'Scheme is not found.'
        })
      }

      await SchemeModel.deleteOne({ _id: isScheme._id })

      return res.json({
        res: true,
        msg: 'Successfully Scheme remove.',
      });

    }

    if(req.user.loginType == "Child-User"){
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

      const isScheme = await SchemeModel.findOne({ _id: req.params.id })
      if (!isScheme) {
        return res.json({
          res: true,
          msg: 'Scheme is not found.'
        })
      }

      await SchemeModel.deleteOne({ _id: isScheme._id })

      return res.json({
        res: true,
        msg: 'Successfully Scheme remove.',
      });
    }

  } catch (error) {
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}
const schemeUpdate = async (req, res) => {
  try {

    const isSeceme = await SchemeModel.findOne({ _id: req.params.id })
    if (!isSeceme) {
      return res.json({
        res: true,
        msg: 'Scheme is not found.'
      })
    }
    const { assginedSectorsId, schemeName } = req.body
    const isSector = await SectorModel.findOne({ _id: assginedSectorsId });
    if (!isSector) {
      return res.json({
        res: false,
        msg: 'Sector is not found!',
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

      if (schemeName) {
        let codeQuery = {
          schemeName: { $regex: `^${schemeName}$`, $options: 'i' },
          schemeName: schemeName,
          clientId: isClient._id
        };
        if (schemeName) {
          codeQuery._id = { $ne: isSeceme }
        }
        const existingCode = await SchemeModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "scheme Name is already existing!"
          })
        }
      }
      await SchemeModel.updateOne({ _id: isSeceme._id }, {
        $set: {
          assginedSectorsId: isSector.id,
          assginedSectorsName: isSector.name,
          schemeName: schemeName,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isClient.clientName,
          lastUpdatedById: isClient._id,
        }
      })

      return res.json({
        res: true,
        msg: "Successfully Scheme update."
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
      if (schemeName) {
        let codeQuery = { schemeName: schemeName };
        if (schemeName) {
          codeQuery._id = { $ne: isSeceme }
        }
        const existingCode = await SchemeModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "scheme Name is already existing!"
          })
        }
      }
      await SchemeModel.updateOne({ _id: isSeceme._id }, {
        $set: {
          assginedSectorsId: isSector.id,
          assginedSectorsName: isSector.name,
          schemeName: schemeName,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isAdmin.userName,
          lastUpdatedById: isAdmin._id,
        }
      })

      return res.json({
        res: true,
        msg: "Successfully Scheme update."
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

      const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
      if (!isClient) {
        return res.json({
          res: false,
          msg: 'Somthing Went To Wrong!',
        });
      }

      if (schemeName) {
        let codeQuery = {
          schemeName: { $regex: `^${schemeName}$`, $options: 'i' },
          schemeName: schemeName,
          clientId: isClient._id
        };
        if (schemeName) {
          codeQuery._id = { $ne: isSeceme }
        }
        const existingCode = await SchemeModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "scheme Name is already existing!"
          })
        }
      }
      await SchemeModel.updateOne({ _id: isSeceme._id }, {
        $set: {
          assginedSectorsId: isSector.id,
          assginedSectorsName: isSector.name,
          schemeName: schemeName,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isSpocPerson.spocCreatedByName,
          lastUpdatedById: isSpocPerson._id,
        }
      })

      return res.json({
        res: true,
        msg: "Successfully Scheme update."
      })

    }

    if(req.user.loginType == "Child-User"){
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

      if (schemeName) {
        let codeQuery = {
          schemeName: { $regex: `^${schemeName}$`, $options: 'i' },
          schemeName: schemeName,
          clientId: isClient._id
        };
        if (schemeName) {
          codeQuery._id = { $ne: isSeceme }
        }
        const existingCode = await SchemeModel.findOne(codeQuery);
        if (existingCode) {
          return res.json({
            res: false,
            msg: "scheme Name is already existing!"
          })
        }
      }
      await SchemeModel.updateOne({ _id: isSeceme._id }, {
        $set: {
          assginedSectorsId: isSector.id,
          assginedSectorsName: isSector.name,
          schemeName: schemeName,
          lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          lastUpdatedByName: isChildUser.emailId,
          lastUpdatedById: isChildUser._id,
        }
      })

      return res.json({
        res: true,
        msg: "Successfully Scheme update."
      })
    }

    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });

  } catch (error) {
    console.error("error in schema update", error)
    return res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const schemeStatus = async (req, res) => {
  try {

    const isSeceme = await SchemeModel.findOne({ _id: req.params.id })

    if (!isSeceme) {
      return res.json({
        res: true,
        msg: 'Scheme is not found.'
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

      if (isSeceme.status == "Active") {
        await SchemeModel.updateOne({ _id: isSeceme._id }, {
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
          msg: 'Successfully Scheme is Inactive.',
        });
      }

      await SchemeModel.updateOne({ _id: isSeceme._id }, {
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
        msg: 'Successfully Scheme is Active.',
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

      if (isSeceme.status == "Active") {
        await SchemeModel.updateOne({ _id: isSeceme._id }, {
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
          msg: 'Successfully Scheme is Inactive.',
        });
      }

      await SchemeModel.updateOne({ _id: isSeceme._id }, {
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
        msg: 'Successfully Scheme is Active.',
      });


    }

    if(req.user.loginType == "spoc-person"){
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

      if (isSeceme.status == "Active") {
        await SchemeModel.updateOne({ _id: isSeceme._id }, {
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
          msg: 'Successfully Scheme is Inactive.',
        });
      } 

      await SchemeModel.updateOne({ _id: isSeceme._id }, {
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
        msg: 'Successfully Scheme is Active.',
      });
    }

    if(req.user.loginType == "Child-User"){
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
      if (isSeceme.status == "Active") {
        await SchemeModel.updateOne({ _id: isSeceme._id }, {
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
          msg: 'Successfully Scheme is Inactive.',
        });
      } 

      await SchemeModel.updateOne({ _id: isSeceme._id }, {
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
        msg: 'Successfully Scheme is Active.',
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
  schemeCreate,
  schemeList,
  schemeRemove,
  schemeUpdate,
  schemeStatus
}