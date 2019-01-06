class ResponseBuilder {
    constructor(){
        this.httpCode = 200
    }
    withHttpCode(code){
        this.httpCode = code
        return this
    }
    withHttpSuccess(){
        this.httpCode = 200
        return this
    }   
    withHttpUnauthorized() {
        this.httpCode = 401
        return this
    }
    withHttpBadRequest() {
        this.httpCode = 400
        return this
    }
    withHttpResourceNotAvailable() {
        this.httpCode = 404
        return this
    }
    withJsonData(data) {
        this.data = data
        return this
    }
    withMessage(message) {
        this.message = message
        return this
    }
    build(res) {
        res.status(this.httpCode)
        res.send({ 'message': this.message,
        'data': this.data})
    }
}

module.exports = {
    ResponseBuilder
}