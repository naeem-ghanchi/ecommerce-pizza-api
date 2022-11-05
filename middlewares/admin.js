import { User } from "../models"
import { CustomErrorHandles } from "../services"

const admin = async (req, res, next) =>{
    try {
        const user = await User.findOne({_id:req.user._id})
        if(user.role === "admin")
        {
            next()
        }else {
            return next(CustomErrorHandles.unAuthorization());
        }
    } catch (error) {
        console.log("error::",error)
        return next(CustomErrorHandles.serverError());
    }
}
export default admin;