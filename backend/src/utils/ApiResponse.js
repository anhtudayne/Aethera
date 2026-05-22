class ApiResponse {
    constructor(statusCode, data = null, message = "Success") {
        this.statusCode = statusCode;
        this.status = statusCode < 400 ? 'success' : 'error';
        this.success = statusCode < 400;
        this.data = data;
        this.message = message;
    }
}

export default ApiResponse;
export { ApiResponse };
