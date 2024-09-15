import User from "../models/user.model.js";
import {generateTokenAndSetCookie} from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail, sendPasswordResetRequestEmail } from "../mailtrap/emails.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const checkAuth = async (req, res)=>{
    try{
        const user = await User.findById(req.user_id);
        if(!user){
            return res.status(401).json({message: "User not found", success: false});
        }
        res.status(200).json({
            message: "User is authorized", 
            success: true, 
            user: {
                ...user._doc,
                password: undefined
            }
        });
    }catch(error){
        console.log("Cannot perfrom authorization of user");
        res.status(500).json({message: "Cannot authorize user", success: false});
    }
}

const signup = async (req, res)=>{
    const {email, password, name} = req.body;
    try {
        if(!email || !password || !name){
            throw new Error("All fields are required");
        }
        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({message: "User already exists", success: false});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000+Math.random()*900000).toString();
        const newUser = new User({
            email, 
            password: hashedPassword, 
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now()+24*60*60*1000
            });
        await newUser.save();
        generateTokenAndSetCookie(res, newUser._id); //JWT
        await sendVerificationEmail(newUser.email, verificationToken);
        res.status(201).json({message: "User created successfully", success: true, data: {
            ...newUser._doc,
            password: undefined
        }});
    } catch (error) {
        res.status(400).json({message: error.message, success: false});
    }
}

const verifyEmail = async (req, res)=>{
    const {code} = req.body;
    try{
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()}   
        });

        if(!user){
            return res.status(401).json({message: "Cannot verify provided email", success: false});
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({message: "Email verified successfully", success: true});

    }catch(error){
        console.log("Cannot verity provided email ", error);
        res.status(500).json({message: "Cannot verify provided email", success: false});
    }
}

const login = async (req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "Invalid user credentials", success: false});
        } 
        const result = await bcrypt.compare(password, user.password);
        if(!result){
            return res.status(404).json({message: "Invalid user credentials", success: false});
        }

        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({message: "User login successful", success: true, user: {
            ...user._doc,
            password: undefined
        }});
    }catch(error){
        console.log("Login failed ", error);
        res.status(400).json({message: "Cannot login User", success: false});
    }
}

const forgotPassword = async (req, res)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "Cannot find user with provided details", status: false});
        }

        const resetToken = crypto.randomBytes(20).toStrign('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = Date.now() + 1*60*60*1000;

        await sendPasswordResetRequestEmail(user.email, `http://localhost:5000/api/auth/reset-password/${resetToken}`);

        res.status(200).json({message: "Password Reset Request initiated", success: true});
    }catch(error){
        console.log("Cannot initiate Password Reset Request ", error);
        res.status(500).json({message: "Cannot initiate Password Reset Request", success: false});
    }
}

const resetPassword = async (req, res)=>{
    const {token} = req.params;
    const {password} = req.body;

    try{
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt: Date.now()}
        });

        if(!user){
            return res.status(404).json({message: "Cannot perform Reset Password Operation", success: false});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await sendPasswordResetSuccessEmail(user.email);

        res.status(200).json({message: "Password reset successful", success: true});
    }catch(error){
        console.log("Cannot reset password ", error);
        res.status(500).json({message: "Cannot reset Password", success: false});
    }
}

const logout = (req, res)=>{
    res.clearCookie("token");
    res.status(200).json({message: "Logged out of the application sucessfully", success: true});
}

export {signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth};