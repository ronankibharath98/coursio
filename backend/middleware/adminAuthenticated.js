import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../utils/adminToken.js';
import { Admin } from '../models/admin.model.js';

export const adminIsAuthenticated = async (req, res, next) => {
    try{
        const accessToken = req.cookies.accessToken
        
        if (accessToken) {
            jwt.verify(accessToken, process.env.ADMIN_ACCESS_TOKEN_SECRET, (error, decoded) =>{
                if(error){
                    return res.status(401).json({
                        message: "Access token not found. Login again",
                        success: false
                    })
                }
                req.admin = decoded
                return next();
            })    
        }else {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken){
                return res.status(401).json({
                    message: "Refresh token not retrieved. Login again",
                    success: false
                })
            }

            const admin = await Admin.findOne({refreshToken})
            
            if(!admin){
                return res.status(401).json({
                    message: "Admin matching refresh token not found. Login again",
                    success: false
                })
            }
            const newAccessToken = generateAccessToken(admin)
            res.cookie("accessToken", newAccessToken,{
                maxAge: 15 * 60 * 1000,
                httpOnly: true,
                // secure: true
            })
            req.admin = {
                _id : admin._id,
            }
            return next();
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server error in admin authentication",
            success: false
        })
    }
}


