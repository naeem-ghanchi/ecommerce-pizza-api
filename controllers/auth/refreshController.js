import Joi from "joi";
import CustomErrorHandles from './../../services/CustomErrorHandler';
import jwtService from './../../services/JwtService';
import { User, RefreshToken } from "../../models";
import { REFRESH_SECRET } from "./../../config"

const refreshController = {

    async refresh(req, res, next) {
        
        // Validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        })
        const { error } = refreshSchema.validate(req.body)
        if(error)
        {
            return next(error)
        }

        // database
        let refreshToken
        try {
            const refreshToken = await RefreshToken.findOne({token:req.body.refresh_token});
            if(!refreshToken)
            {
                return next(CustomErrorHandles.unAuthorization("Invalid refresh token"));
            }
            
            let userId;
            try {
                const { _id } = await jwtService.verify(refreshToken.token, REFRESH_SECRET)
                userId = _id
            } catch (error) {
                return next(CustomErrorHandles.unAuthorization("Invalid refresh token"));
            }

            const user = await User.findOne({_id:userId});
            if(!user)
            {
                return next(CustomErrorHandles.unAuthorization('No user found'));
            }

             // Token
             const access_token = jwtService.sign({_id:user._id, role:user.role})
             const refresh_token = jwtService.sign({_id:user._id, role:user.role},'1y', REFRESH_SECRET);
 
             //database whitelist
             await RefreshToken.create({token: refresh_token})

             res.json({ user, access_token, refresh_token})
        } catch (error) {
            return next(new Error('something went wrong ' + error.message))   
        }
    }
}
 
export default refreshController;