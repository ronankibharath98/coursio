import { User } from '../models/user.model.js';
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
        const existingEmail = await User.findOne({ email })

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
            message: `Welcome ${user.firstName}, You can signin now`,
            success: true,
            user: {
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
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "All fields required",
            success: false
        })
    }

    email = email.toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "User registered with the email not found",
            success: false
        })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Wrong Password",
            success: false
        })
    }

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

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
            message: `Hey ${user.firstName}, You are signed in now`,
            success: true
        })
}

export const signout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        const user = await User.findOneAndUpdate(
            { refreshToken: token },
            { $set: {refreshToken: ""}},
            { new: true }
        )

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
            message: "Server error in singout function",
            success: false
        })
    }
}

// export const refreshToken = async(req, res) => {
//     const token = req.cookies.accessToken
// }