const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const schema = new mongoose.Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'clients' },
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

module.exports = model('clientAccessToken', schema);