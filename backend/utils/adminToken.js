import jwt from 'jsonwebtoken'

export const generateRefreshToken = async(admin) => {
    const refreshTokenId = {
        userId: admin._id
    }
    const refreshToken = jwt.sign(refreshTokenId, process.env.ADMIN_REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
    user.refreshToken = refreshToken;
    await user.save();
    return refreshToken
}

export const generateAccessToken = async (admin) => {
    const accessTokenId = {
        tokenId: admin._id
    }
    return jwt.sign(accessTokenId, process.env.ADMIN_ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
}