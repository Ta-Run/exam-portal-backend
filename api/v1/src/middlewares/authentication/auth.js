const jwt = require("jsonwebtoken");
const AdminModel = require("../../models/admin.model");
const adminAccessToken = require("../../models/admin.access.token");
const ClientModel = require("../../models/client.model");
const clientAccessTokenModel = require("../../models/client.access.token");
const SpocPersonModel = require("../../models/spoc-person.model");
const spocPersonAccessTokenModel = require("../../models/access.token-spocperson");
const ChildUserModel = require("../../models/child.user.model");
const ChildUserAccessTokenModel = require("../../models/child-user-access.token");

async function authentication(req, res, next) {
  if (!req.headers.authorization) {
    return res.json({ message: "unauthorized" });
  }
  const token = await req.headers.authorization.split(" ")[1];
  const decodedJwtToken = jwt.decode(token);
  if (!decodedJwtToken) {
    return res.json({ message: "unauthorized" });
  }

  // Admin auth
  if (decodedJwtToken.loginType == "Admin") {
    const user = await AdminModel.findOne({ email: decodedJwtToken.email });
    const isRevoked = await adminAccessToken.findOne({
      adminId: user.id,
      jti: { $in: decodedJwtToken.jti },
    });
    if (!user) {
      return res.json({
        message: "unauthorized",
      });
    }
    if (isRevoked.revoked === true) {
      return res.json({
        message: "unauthorized",
      });
    }
    req.user = {
      id: user._id,
      email: user.email,
      jti: decodedJwtToken.jti,
      loginType: decodedJwtToken.loginType,
    };
    return next();
  }
  // Client auth
  else if (decodedJwtToken.loginType == "Client") {
    const user = await ClientModel.findOne({
      clientEmail: decodedJwtToken.email,
    });

    

    if (!user) {
      return res.json({
        message: "unauthorized",
      });
    }
    const isRevoked = await clientAccessTokenModel.findOne({
      clientId: user.id,
      jti: { $in: decodedJwtToken.jti },
    });
    if (isRevoked.revoked === true) {
      return res.json({
        message: "unauthorized",
      });
    }
    req.user = {
      id: user._id,
      email: user.clientEmail,
      jti: decodedJwtToken.jti,
      loginType: decodedJwtToken.loginType,
    };
    return next();
  }
  // Spoc Person auth
  else if (decodedJwtToken.loginType == "spoc-person") {
    const user = await SpocPersonModel.findOne({
      emailId: decodedJwtToken.email,
    });
    const isRevoked = await spocPersonAccessTokenModel.findOne({
      spocPersonId: user.id,
      jti: { $in: decodedJwtToken.jti },
    });
    if (isRevoked.revoked === true) {
      return res.json({
        message: "unauthorized",
      });
    }
    req.user = {
      id: user._id,
      email: user.emailId,
      jti: decodedJwtToken.jti,
      loginType: decodedJwtToken.loginType,
      clientId: user.clientId,
    };
    return next();
  }
  // Child User auth
  else if (decodedJwtToken.loginType == "Child-User") {
    const user = await ChildUserModel.findOne({
      emailId: decodedJwtToken.email,
    });
    const isRevoked = await ChildUserAccessTokenModel.findOne({
      chlildUserId: user._id,
      jti: { $in: decodedJwtToken.jti },
    });
    if (isRevoked.revoked === true) {
      return res.json({
        message: "unauthorized",
      });
    }
    req.user = {
      id: user._id,
      email: user.emailId,
      jti: decodedJwtToken.jti,
      loginType: decodedJwtToken.loginType,
      clientId: user.clientId,
    };
    return next();
  } else {
    return res.json({
      message: "unauthorized",
    });
  }
}

module.exports = authentication;
