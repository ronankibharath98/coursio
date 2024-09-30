import jwt from 'jsonwebtoken'
// import { Admin } from '../models/admin.model';

export const generateRefreshToken = async(admin) => {
    const refreshTokenId = {
        adminId: admin._id
    }
    const refreshToken = jwt.sign(refreshTokenId, process.env.ADMIN_REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
    admin.refreshToken = refreshToken;
    // console.log(refreshToken)
    await admin.save();
    return refreshToken
}

export const generateAccessToken = async (admin) => {
    const accessTokenId = {
        adminId: admin._id
    }
    return jwt.sign(accessTokenId, process.env.ADMIN_ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
}