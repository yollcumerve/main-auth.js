
class Response {
    constructor(data = null, message = null, status){
        this.data = data
        this.message = message
        this.status = status
    }

    success(res){
        return res.status(200).json({
            success: true,
            data: this.data,
            message: this.message ?? "Successfully"
        })
    }

    created(res){
        return res.status(201).json({
            success: true,
            data: this.data,
            message: this.message ?? "created successfully"
        })
    }
    error500(res){
        return res.status(500).json({
            success: false,
            data: this.data,
            message: this.message ?? "InternalServerError"
        })
    }
    error400(res){
        return res.status(400).json({
            success: false,
            data: this.data,
            message: this.message ?? "BadRequestError"
        })
    }
    error401(res){
        return res.status(401).json({
            success: false,
            data: this.data,
            message: this.message ?? "UnauthorizationError"
        })
    }
    error404(res){
        return res.status(404).json({
            success: false,
            data: this.data,
            message: this.message ?? "NotFoundError"
        })
    }
    error429(res){
        return res.status(429).json({
            success: false,
            data: this.data,
            message: this.message ?? "TooManyRequests"
        })
    }
}


module.exports = Response