class CustomErrorHandles extends Error {
    constructor(status, msg)
    {
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message){
        return new CustomErrorHandles(409,message)
    }
   
    static wrongCredentials(message = "Username or password is wrong"){
        return new CustomErrorHandles(401,message)
    }
    
    static unAuthorization(message = "unAuthorization"){
        return new CustomErrorHandles(401,message)
    }

    static notFound(message = "404 Not Found"){
        return new CustomErrorHandles(404,message)
    }
    
    static serverError(message = "Internal server error"){
        return new CustomErrorHandles(500,message)
    }
}
export default CustomErrorHandles