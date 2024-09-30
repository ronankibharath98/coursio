import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken'
import { generateAccessToken } from "../utils/userToken.js";

export const isAuthenticated = async (req, res, next) => {
    if (req.path === '/signout') {
        return next();
    }

    try {
        const accessToken = req.cookies.accessToken;
        console.log(accessToken)

        if (accessToken) {
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
                if (error) {
                    return res.status(401).json({
                        message: "Invalid or expired access token. Please login again",
                        success: false
                    })
                }
                req.user = decoded
                return next();
            })
        } else {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({
                    message: 'Refresh token missing. Please login again.',
                    success: false,
                });
            }

            const user = await User.findOne({ refreshToken });

            if (!user) {
                return res.status(401).json({
                    message: "Refresh token expired or not found. Please login again",
                    success: false
                })
            }
            jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, decoded) => {
                if (error) {
                    return res.status(401).json({
                        message: "Invalid refresh token, Please login again",
                        success: false
                    })
                }
                const newAccessToken = generateAccessToken(user);
                res.cookie("accessToken", newAccessToken, {
                    maxAge: 15 * 60 * 1000,
                    httpOnly: true,
                    // secure: true
                })

                req.user = {
                    _id : user._id,
                    email: user.email,
                    firstName: user.firstName
                };
                return next();
            })
        }
    } catch (err) {
        console.log("Unexpected error", err)
        return res.status(500).json({
            message: "Server error in authentication middleware",
            success: false
        })
    }
}

