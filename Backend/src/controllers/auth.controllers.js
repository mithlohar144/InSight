const express = require('express')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')



async function RegiterController(req, res) {
    const { username, email, password, bio, profileImage } = req.body;

    const isUserAllReadyExist = await userModel.findOne({
        $or: [
            { username }, { email }
        ]
    })
    if (isUserAllReadyExist) {
        return res.status(409).json({
            message: "User All ready Exist " + (isUserAllReadyExist.emil == email) ? "email is Allready Exist" : "userName is All ready exist"
        });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        username,
        email,
        password: hash,
        bio,
        profileImage
    })

    const token = jwt.sign(
        {
            id: user._id,
        },
        process.env.JWT_SECRET, { expiresIn: "1d" }
    )
    res.cookie("token", token),
        res.status(200).json({
            message: "User Regitration Successfully",
            user: {
                username: user.username,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage
            }
        })
}

async function loginController(req, res) {
    const { username, email, password } = req.body;
    const user = await userModel.findOne({
        $or:[
            {username: username},
            {email:email},
        ],
    })
    if(!user){
        return res.status(404).json({
            message: "user not Found "
        })
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
        return res.status(401).json({
            message:"invalid password"
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET, {expiresIn: '1d'})

    res.cookie("token", token)
    res.status(200).json({
        message:"User Login Success",
        user:{
            username: user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }
    })
}
module.exports = {
    RegiterController,
    loginController
}