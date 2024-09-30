import { Admin } from '../models/admin.model.js';
import { generateRefreshToken, generateAccessToken } from '../utils/userToken.js'
import bcrypt from 'bcryptjs'

export const signup = async (req, res) => {
    try {
        let { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }

        email = email.toLowerCase();

        const existingEmail = await Admin.findOne({ email })

        if (existingEmail) {
            return res.status(400).json({
                message: "Email id already exists",
                success: false
            })
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const admin = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashPassword
        }

        await Admin.create(admin);

        return res.status(201).json({
            message: "Admin signedup successfully, You can login now",
            success: true,
            admin: {
                firstName,
                lastName,
                email
            }
        })
    } catch (err) {
        console.log("Error in signup controller", err)
        return res.status(500).json({
            message: "Server Error in Admin singup",
            success: false
        })
    }
}

export const singin = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields required",
                success: false
            })
        }

        email = email.toLowerCase();

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({
                message: "User registered with the email not found",
                success: false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, admin.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Wrong Password",
                success: false
            })
        }

        const accessToken = generateAccessToken(admin);
        const refreshToken = generateRefreshToken(admin);

        return res.status(200)
            .cookie("accessToken", accessToken, {
                maxAge: 15 * 60 * 1000,
                httpOnly: true,
                // secure: true
            })
            .cookie("refreshToken", refreshToken, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            .json({
                message: "Admin Signed in successfully",
                success: true
            })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error in Admin Signin",
            success: false
        })
    }
}

export const signout = async (req, res) => {
    try {
        return res
            .status(200)
            .clearCookie("accessToken", { httpOnly: true })
            .clearCookie("refreshToken", { httpOnly: true })
            .json({
                message: "User signed out successfully",
                success: true
            })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error in Amdin signout",
            success: false
        })
    }
}

// export const refreshToken = async(req, res) => {
//     const token = req.cookies.accessToken
// }