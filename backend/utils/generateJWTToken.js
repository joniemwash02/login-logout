 import jwt from "jsonwebtoken"
export const generateJWTToken = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
   
};
