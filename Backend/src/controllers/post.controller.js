const postModel = require('../models/post.model');
const likeModel = require('../models/like.model');
const jwt = require('jsonwebtoken')
const imagekit = require('@imagekit/nodejs')
const { toFile } = require('@imagekit/nodejs')

const imageKit = new imagekit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})
async function CreatePostController(req, res) {
    
    const file = await imageKit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: 'test_file',
        folder: "Insta_Clone"
    })

    const post = await postModel.create({
        caption: req.body.caption,
        ImageUrl: file.url,
        user: req.user.id
    })
    res.status(200).json({
        message: 'Post Create SuccessFully ,',
        post
    })

}


async function getPostController(req, res){
   
    const user = req.user.id;
    const post = await postModel.findOne({
        user:user.id
    })
    res.status(200).json({
        message:"Post Data fatch SuccessFully "
    })
}


async function getPostdetailsController(req,res){
   
    const userId  = req.user.id
    const postId = req.params.postId
    const post = await postModel.findById(postId)
    if(!post){
        return res.status(404).json({
            message:"Post Not Found"
        })
    }

    const isValidUser = post.user.toString() === userId
    if(!isValidUser){
        return res.status(403).json({
            message:"Forbidden Access"
        })
    }
    res.status(200).json({
        message:"Post Details Fatch SuccessFully",
        post
    })
}


async function likePostController(req, res){
    const username = req.user.id;
    const postId  = req.params.postId;

    const post = await postModel.findById(postId);
    if(!post){
        return res.status(404).json({
            message: 'Post Not Found',
        })
    }

    const like = await likeModel.create({
        user : username, 
        post : postId
    })
    res.status(200).json({
        message:"Post Like SuccessFully ",
        like
    })
}


module.exports= {
    CreatePostController,
    getPostController,
    getPostdetailsController,
    likePostController
}