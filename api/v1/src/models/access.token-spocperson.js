const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const schema = new mongoose.Schema({
    spocPersonId: { type: Schema.Types.ObjectId, ref: 'spocpersons' },
    revoked: {
      type: Boolean,
      default: false,
    },
    jti:{ 
      type: String,
      default: '',
    },
    token:{
      type: String,
      default: '',
    },
    expiresAt: Date,

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
  }
)

module.exports = model('spocPersonAccessToken', schema);