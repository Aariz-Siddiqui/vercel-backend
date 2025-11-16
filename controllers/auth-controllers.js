const express = require("express");
const Users = require("../models/user-model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { verify } = require("jsonwebtoken");

const home = async(req,res) => {
    try {
        return res.status(200).send("Hello from the controllers side");
    } catch (error) {
        console.log(error)
    }
};

const register = async (req,res)=>{
    try{
        const {name,email,phone,password} = req.body;

        const userExist = await Users.findOne({email:email});
        if(userExist){
            console.log("user already exist");
            return res.status(409).json({message:"email already exists"});
        }
        const userCreated = await Users.create({name,
            email,
            phone,
            password
        });
        return res.status(201).json({
            message:"registration successful",
            token: await userCreated.generateToken(), // generate a token for this user (just generating here and not saving till now) and send it to front end
            userId: userCreated._id.toString(), //to convert mongodb object to a string so that our fe can access _id easily
        });
        
    
    }catch(error){
        console.log(error);
    }
}

// login  

const login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const userExist = await Users.findOne({email}); // verify if the user's email exist in the database or not
        if(!userExist){
            return res.status(400).json({"message":"Email does not exist"}); //if user's does not exist
        }

//verify password using brypt.compare

            const User = await userExist.verifyPassword(password); //verify password , if password is correct it would return a boolean data
            console.log(User);
            if(User){
                return res.status(201).json({
                    message:"login successful",
                    token: await userExist.generateToken(),
                    userId: userExist._id.toString(),
                });
            }else{
                return res.status(400).json({"message":"Invalid password"});
            }

        
    }catch(error){
        console.log(error)
    }
}

//verify user token

const user =async (req,res)=>{
    try{
        const userData = req.user;
        res.status(201).json(userData);

    }catch(error){
        console.log("error at user controller",error);
    }
}

module.exports = {home,register,login,user};
