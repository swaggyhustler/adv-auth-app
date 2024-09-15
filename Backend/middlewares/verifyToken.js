import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next)=>{
    const token = req.cookies.token;
    try{
        if(!token){
            return res.status(401).json({message: "Unauthorized - Token not provided", success: false});
        }
        const decoded = jwt.verify(token, process.env.JSON_SECRET);
        if(!decoded){
            return res.status(401).json({message: "Unauthorized - Invalid Token", success: false});
        }
        req.user_id = decoded.userId;
        next();
    }catch(error){
        console.log("Cannot verify token");
        res.status(500).json({message: "Cannot verify token", success: false});
    }
}