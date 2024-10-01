import { generateRefreshToken, generateAccessToken } from '../utils/adminToken.js'
import { Admin } from '../models/admin.model.js';
import { Courses } from '../models/course.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
            message: `Hey ${admin.firstName}, your profile is created. You can login now`,
            success: true,
            admin: {
                firstName,
                lastName,
                email
            }
        })
    } catch (error) {
        console.log("Error in signup controller", error)
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
                message: "Admin registered with the email not found",
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

        const accessToken = await generateAccessToken(admin);
        const refreshToken = await generateRefreshToken(admin);
        // console.log(accessToken, refreshToken)
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
                message: `Welcome ${admin.firstName}`,
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
        const token = req.cookies.refreshToken;
        // console.log(token)
        const admin = await Admin.findOneAndUpdate(
            { refreshToken: token },
            { $set: { refreshToken: "" } },
            { new: true }
        );

        if (!admin) {
            return res.status(401).json({
                message: "Admin not found",
                success: false
            })
        }
        return res
            .status(200)
            .clearCookie("accessToken", { httpOnly: true })
            .clearCookie("refreshToken", { httpOnly: true })
            .json({
                message: "Admin signed out successfully",
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

export const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Invalid refresh token. Login again",
            success: false
        })
    }
    try {
        const admin = await Admin.findOne({ refreshToken });

        const newAccessToken = generateAccessToken(admin);

        return res.cookie("accessToken", newAccessToken, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server error in refreshAccessToken",
            success: false
        })
    }

}

export const getAdminCourses = async (req, res) => {
    try{
        const token = req.cookies.accessToken

        if (!token) {
            return res.status(401).json({
                message: "No access token provided. Unauthorized",
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET)
        const adminId = decoded.adminId
        
        const adminCourses = await Courses.find({createdBy: adminId});

        return res.status(200).json({
            message: "All courses fetched successfully",
            success: true,
            adminCourses
        })
    }catch(error){
        console.error("Error fetching admin courses:", error);
        return res.status(500).json({
            message: "Server error while fetching all admin posted courses",
            success: false
        })
    }
}