import CustomErrorHandles from './../services/CustomErrorHandler';
import jwtService from './../services/JwtService';
const auth = async (req, res, next) =>{
    let authHeader = req.headers.authorization
    // console.log(authHeader)
    if(!authHeader)
    {
        return next(CustomErrorHandles.unAuthorization())
    }

    const token = await authHeader.split(" ")[1]
    // console.log(token)
    try {
        const { _id, role } = await jwtService.verify(token)
        // console.log(_id,role)
        req.user = {};
        req.user._id =_id
        req.user.role = role
        next();
       } catch (error) {
        return next(CustomErrorHandles.unAuthorization())
    }
}

export default auth