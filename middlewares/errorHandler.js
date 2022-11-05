import { DEBUG_MODE } from "../config"
import { ValidationError } from "joi";
import { CustomErrorHandles } from "../services";

const errorHandler = (err, req, res, next) => {
    let statusCode = 500
    let data = {
        message: "Internal Server Error",
        ...(DEBUG_MODE === "true" && { OriginalError: err.message })
    }

    if (err instanceof ValidationError)
    {
        statusCode = 422   
        data = {
            message: err.message
        }
    }

    if (err instanceof CustomErrorHandles)
    {
        statusCode = err.status
        data = {
            message: err.message
        }
    }
    res.status(statusCode).json(data)
}

export default errorHandler;