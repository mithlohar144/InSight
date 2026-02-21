const mongoose = require('mongoose')
const user = require('./user.model')


const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    ImageUrl:{
        type:String,
        required:[true, 'Image Url is Required']
    },
    user:{
        ref:"users",
        type:mongoose.Schema.Types.ObjectId,
        required:[true , 'User is Required to Create Post']
    }
})


const postModel = mongoose.model("post", postSchema)

module.exports = postModel;