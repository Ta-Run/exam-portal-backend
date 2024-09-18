const ChildUserModel = require("../../models/child.user.model")
const moment = require('moment')
const { randomBytes } = require('crypto')
const jwt = require('jsonwebtoken')
const ChildUserAccessTokenModel = require('../../models/child-user-access.token')

const childUserLogin=async(req,res)=>{
  try {
    const email = req.body.email.toLowerCase()
    const isChildUserExist = await ChildUserModel.findOne({ emailId:email })
    if (!isChildUserExist) {
      return res.json({
        res: false,
        msg: 'User Not Found!',
      });
    }


    if(isChildUserExist.password !== req.body.password){
      return res.json({
        res: false,
        msg: 'Password Not Match!',
      });
    }
    if (isChildUserExist.status === 'inactive') {
      return res.json({
        res: false,
        msg: 'User Inactive!',
      });
    }

    const jti = randomBytes(32).toString("hex");
    const jwtToken = jwt.sign(
      {
        sub: isChildUserExist._id,
        jti,
        email: isChildUserExist.emailId,
        loginType: "Child-User",
        clientId: isChildUserExist.clientId
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "365 days",
      }
    );

    const decodedJwtToken = jwt.decode(jwtToken);
    await ChildUserAccessTokenModel.create({
      chlildUserId: isChildUserExist._id,
      jti,
      token: jwtToken,
      expiresAt: moment().add(365, 'days').toDate()
    })

    return res.json({
      res: true,
      msg: 'Login Successfully!',
      data: {
        _id:isChildUserExist._id,
        firstName:isChildUserExist.firstName,
        lastName:isChildUserExist.lastName,
        emailId:isChildUserExist.emailId,
        contactNo:isChildUserExist.contactNo,
        address:isChildUserExist.address,
        dateofcreation:isChildUserExist.dateofcreation,
        selectPageViewPermission:isChildUserExist.selectPageViewPermission,
        selectSectorPermissionId:isChildUserExist.selectSectorPermissionId,
        selectSectorPermissionName:isChildUserExist.selectSectorPermissionName,
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
}

const childUserLogout=async(req,res)=>{
  try {
    const isChildUserExist = await ChildUserModel.findOne({ emailId:req.user.email })
    if (!isChildUserExist) {
      return res.json({
        res: false,
        msg: 'User Not Found!',
      });
    }


      await ChildUserAccessTokenModel.updateOne({chlildUserId:isChildUserExist._id},{$set:{revoked:true}})
  
    return res.json({
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

module.exports={
  childUserLogin,
  childUserLogout
}