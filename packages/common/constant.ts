export enum StatusRedis {
    CONNECT = 'connect',
    END = 'end',
    RE_CONNECT = 'reconnect',
    ERROR = 'error',
}

export const CONNECT_REDIS = ['connecting', 'connect']