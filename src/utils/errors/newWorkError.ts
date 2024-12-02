export const enum NETWORK_ERRORS {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 402,
}

export class NetworkError extends Error {
    public status: number
    public statusText: string | undefined
    public details: string | undefined

    constructor(statusCode: number, statusMessage? : string, details? : string) {
        super()
        this.status = statusCode
        this.statusText = statusMessage
        this.details = details
    }
}