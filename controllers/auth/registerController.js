import Joi from "joi";
import bcrypt from 'bcryptjs';
import { User, RefreshToken } from "../../models";
import { CustomErrorHandles, jwtService } from "../../services";
import { REFRESH_SECRET } from "./../../config"

const registerController = {
    async register(req, res, next){

        // validation
        const registerSchema = Joi.object({
            name:Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        })
        const { error } = registerSchema.validate(req.body)
        if(error)
        {
            return next(error)
        }

        // Check if users is in the database already
        try {
            const exist = await User.findOne({email: req.body.email})
            // const exist = await User.exists({email: req.body.email})
            if(exist)
            {
                return next(CustomErrorHandles.alreadyExist('This Email is already taken.'))
            }
        } catch (error) {
            return next(error) 
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // prepare the model
        const { name, email } = req.body
        const user = new User({
            name,
            email,
            password: hashedPassword
        })
        let access_token, refresh_token;
        try {
            const result = await user.save();
            
            // Token
            access_token = jwtService.sign({_id:result._id, role:result.role});
            refresh_token = jwtService.sign({_id:result._id, role:result.role}, '1y', REFRESH_SECRET);

            //database whitelist
            await RefreshToken.create({token: refresh_token})
        } catch (error) {
            return next(error)
        }
        
        res.json({ msg: "User Created Successfully", access_token, refresh_token });
    }
}

export default registerController