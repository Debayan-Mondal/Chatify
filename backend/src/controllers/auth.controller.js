import { sendWelcomeEmail } from "../emails/emailHandler.js";
import { ENV } from "../lib/env.js";
import { generateToken } from "../lib/util.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"


export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({message:"All Fields are required"})
        }
        if (password.length < 6) {
            return res.status(400).json({message:"Password must be greater than 6 characters"});
        }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            return res.status(400).json({message:"Invalid Email Format"})
        }
        const user = await User.findOne({email});
        if (user) {
             return res.status(400).json({message:"Email already Exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            // generateToken(newUser._id, res);
            // await newUser.save()

            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);
            res.status(201).json({
                _id: newUser,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL)
            }catch(err) {

            }

        } else {
            res.status(400).json({message: "Invalid user data"});
        }


    } catch(err) {
        console.log("Error in signup controller...", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const login = async (req, res) => {
    try {
            const {email, password} = req.body;
            if (!email || !password) {
                return res.status(400).json({message: "Email and Password are required"});
            }

            const user = await User.findOne({email});

            if (!user) return res.status(400).json({message: "Invalid Credentials"});
            const isPasswordMatched = await bcrypt.compare(password, user.password);
            if(!isPasswordMatched) return res.status(400).json({message: "Invalid Credentials"});
    
            generateToken(user._id, res);
            res.status(200).json({
                _id:user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            });
        } catch(err) {
            console.error("Error in login controller...", err);
            res.status(500).json({message: "Internal Server Error"});
    }
}

export const logout = (req, res) => {
    res.cookie("jwt", "", {maxAge:0});
    res.status(200).json({message: "Logged out Successfully"});
}