const SpocPersonModel = require("../../models/spoc-person.model")
const SpocPersonAccessTokenModel = require("../../models/access.token-spocperson")
const JobRoleModel = require("../../models/job-role.model")
const moment = require('moment')
const { randomBytes } = require('crypto')
const jwt = require('jsonwebtoken')

const spocPersonLogin = async (req, res) => {
  try {

    const email = req.body.email.toLowerCase()
    const isSpocPersonExist = await SpocPersonModel.findOne({ emailId: email })
    if (!isSpocPersonExist) {
      res.json({
        res: false,
        msg: 'User Not Found!',
      });
    }
    if (isSpocPersonExist.password != req.body.password) {
      res.json({
        res: false,
        msg: 'Password Not Match!',
      });
    }

    const jti = randomBytes(32).toString("hex");
    const jwtToken = jwt.sign(
      {
        sub: isSpocPersonExist._id,
        jti,
        email: isSpocPersonExist.emailId,
        loginType: "spoc-person",
        clientId: isSpocPersonExist.clientId
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "365 days",
      }
    );

    const decodedJwtToken = jwt.decode(jwtToken);
    await SpocPersonAccessTokenModel.create({
      spocPersonId: isSpocPersonExist._id,
      jti,
      token: jwtToken,
      expiresAt: moment.unix(decodedJwtToken.exp).format("YYYY-MM-DD"),
    })

    return res.json({
      res: true,
      msg: 'Login Successfully!',
      data: {
        _id: isSpocPersonExist._id,
        spocPersonName: isSpocPersonExist.spocPersonName,
        contactNo: isSpocPersonExist.contactNo,
        emailId: isSpocPersonExist.emailId,
        assginedSectorsIds: isSpocPersonExist.assginedSectorsIds,
        assginedSectorsNames: isSpocPersonExist.assginedSectorsNames,
        clientId: isSpocPersonExist.clientId,
        clientName: isSpocPersonExist.clientName,
        createdAt: isSpocPersonExist.createdAt,
        authentication: {
          accessToken: jwtToken,
          expireAt: decodedJwtToken.exp,
        }
      }
    });
  } catch (error) {
    res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
};

const spocPersonLogout = async (req, res) => {
  try {
    const { id, jti } = req.user

    await SpocPersonAccessTokenModel.updateOne({ spocPersonId: id, jti: jti }, { $set: { revoked: true } })
    res.json({
      res: true,
      msg: 'Logout Successfully!',
    });
  } catch (error) {
    res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

const assignJobRole = async (req, res) => {
  try {
    const { id } = req.user
    const isSpocPersonExist = await SpocPersonModel.findOne({ _id: id })
    if (!isSpocPersonExist) {
      res.json({
        res: false,
        msg: 'User Not Found!',
      });
    }
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };
    
    const isJobRoleExist = await JobRoleModel.paginate({ assginedSectorsId: isSpocPersonExist.assginedSectorsIds }, options);
    
    if (isJobRoleExist) {
      res.json({
        res: true,
        msg: 'Success',
        data: isJobRoleExist.docs,
        paginate: {
          totalDocs: isJobRoleExist.totalDocs,
          limit: isJobRoleExist.limit,
          totalPages: isJobRoleExist.totalPages,
          page: isJobRoleExist.page,
          pagingCounter: isJobRoleExist.pagingCounter,
          hasPrevPage: isJobRoleExist.hasPrevPage,
          hasNextPage: isJobRoleExist.hasNextPage,
          prevPage: isJobRoleExist.prevPage,
          nextPage: isJobRoleExist.nextPage
        }
      });
    }

  } catch (error) {
    res.json({
      res: false,
      msg: 'Somthing Went To Wrong!',
    });
  }
}

module.exports = {
  spocPersonLogin,
  spocPersonLogout,
  assignJobRole
}