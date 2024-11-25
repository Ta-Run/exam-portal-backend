/**
 * This is where will export all the files within the
 * models folder for easy access. Eg: In any of the controller
 * you will do something like this, const { User } = require("../models")
 * instead of const { User } = require("../models/User.model")
 */
const User = require('./User.model');
const Admin =require('./admin.model')
const AdminAccessToken=require("./admin.access.token")

module.export = {
  User,
  Admin,
  AdminAccessToken
};
