const mongoose = require('mongoose')


const follwerSchema = new mongoose.Schema({
    follower:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true, 'Follower is require to create follow']
    },
    following:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true, ' follwig is reqied to create post'] 
    }
},
{
    timestamps : ture
})

const followModel = mongoose.model("follow", follwerSchema)

module.exports = followModel