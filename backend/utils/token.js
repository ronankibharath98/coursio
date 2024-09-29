import jwt from 'jsonwebtoken'

export const generateRefreshToken = async(user) => {
    const refreshTokenId = {
        userId: user._id
    }
    const refreshToken = jwt.sign(refreshTokenId, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
    user.refreshToken = refreshToken;
    await user.save();
    return refreshToken
}

export const generateAccessToken = async (user) => {
    const accessTokenId = {
        tokenId: user._id
    }
    return jwt.sign(accessTokenId, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
}