const express = require('express')
const postController = require('../controllers/post.controller')
const multer = require('multer')
const upload = multer({storage: multer.memoryStorage()})
const identifyCheck = require("../middlewares/post.middleware")
const postRoutes = express.Router();



postRoutes.post('/',upload.single('image'),identifyCheck, postController.CreatePostController)

postRoutes.get('/',identifyCheck, postController.getPostController)

postRoutes.get('/details/:postId',identifyCheck, postController.getPostdetailsController)


module.exports = postRoutes;