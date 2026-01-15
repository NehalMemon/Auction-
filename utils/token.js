import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateAccessToken = (user) => {
     return jwt.sign({
        email:user.email,
        id:user.id
     },process.env.ACCESS_TOKEN_SECRET,
     {expiresIn:process.env.ACCESS_TOKEN_LIFE}
    )
};

export const generateRefreshToken = (user) => {
    return jwt.sign({
       email:user.email,
       id:user.id
    },process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_LIFE}
   )
};

