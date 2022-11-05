import Joi from "joi";
const prdouctSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    size: Joi.string().required(),
    image: Joi.string()
})

export default prdouctSchema;