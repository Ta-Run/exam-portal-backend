const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

const {Schema , model} = mongoose;

const nosSchema = new Schema({
    JobRoleID:{
        type:Schema.Types.ObjectId, ref:'jobroles'
    },
    nosCode:{
        type:String,
        required:true
    },
    nosName:{
        type:String,
        required:true
    },
    TtheoryMarks:{
        type:Number,
        required:true
    },
    TVivaMarks:{
        type:Number,
        required:true
    },
    TPracticalMarks:{
        type:Number,
        required:true
    }
},{ timestamps: true })

nosSchema.plugin(mongoosePaginate)
module.exports = model('nosBulkUpload', nosSchema);