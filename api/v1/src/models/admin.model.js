const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const { Schema, model } = mongoose;

const adminSchema = new Schema({
  userName: { 
    type: String, 
    required: true 
  },
  email: {
    type: String, 
    required: true,
    email: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true, 
  },
},{ timestamps: true });

adminSchema.plugin(mongoosePaginate)
module.exports = model('admins', adminSchema);
