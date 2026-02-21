const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true, 'user name allready exits '],
        required:[true, "username is required "]
    },
    email:{
        type: String,
        unique:[true, 'Email is All ready Exist'],
        required:[true, 'Email is  required ']
    },
    password:{
        type: String,
        required:[true, 'password is Required ']
    },
    bio:{
        type:String,
    },
    profileImage:{
        type:String,
        default:"https://ik.imagekit.io/4v02ifpxl/images.png"
    }
})

const user = mongoose.model('Users', userSchema)

module.exports = user;