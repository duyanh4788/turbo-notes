export enum StatusRedis {
    CONNECT = 'connect',
    END = 'end',
    RE_CONNECT = 'reconnect',
    ERROR = 'error',
}

export const CONNECT_REDIS = ['connecting', 'connect'];

export enum AuthHeaders {
    API_KEY = 'x-api-key',
    SEVER_PROCESS = 'server-process',
    USER_ID = 'userId'
}

export enum TypeResponse {
    SUCCESS = 'success',
    ERROR = 'error'
}