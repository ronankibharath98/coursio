import { User } from '../models/user.model.js';
import {generateRefreshToken, generateAccessToken} from '../utils/token.js'
import bcrypt from 'bcryptjs'


export const signup = async (req, res) => {
    try {
        let { firstName, lastName, email, password } = req.body;
        email = email.toLowerCase();

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }
        const existingEmail = await User.findOne({email})

        if (existingEmail) {
            return res.status(400).json({
                message: "Email id already exists",
                success: false
            })
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashPassword
        }

        await User.create(user);

        return res.status(201).json({
            message: "User saved successfully",
            success: true,
            user:{
                firstName,
                lastName,
                email
            }
        })

    } catch (err) {
        console.log("Error in signup controller", err)
        return res.status(500).json({
            message: "Server Error in singup",
            success: false
        })
    }
}


export const singin = async (req, res) => {
    let {email, password} = req.body;
    email = email.toLowerCase();

    if (!email || !password){
        return res.status(400).json({
            message: "All fields required",
            success: false
        })
    }

    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({
            message: "User registered with the email not found",
            success: false
        })
    }

    const isPasswordMatch = bcrypt.compare(password, user.password);

    if(!isPasswordMatch){
        return res.status(400).json({
            message: "Wrong Password",
            success: false
        })
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(200)
    .cookie("accessToken",accessToken,{
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        // secure: true
    })
    .cookie("refreshToken",refreshToken,{
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    })
    .json({
        message: "Signed in successfully",
        success: true
    })
}

// export const refreshToken