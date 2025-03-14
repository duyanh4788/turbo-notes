export enum StatusRedis {
  CONNECT = 'connect',
  END = 'end',
  RE_CONNECT = 'reconnect',
  ERROR = 'error',
}

export const CONNECT_REDIS = ['connecting', 'connect'];

export enum KeyRedis {
  USER = '_USER',
  BANNER = '_BANNER',
  CONTENT_NOTE_DETAIL = '_CONTENT_NOTE_DETAIL',
}

export enum AuthHeaders {
  API_KEY = 'x-api-key',
  SEVER_PROCESS = 'server-process',
  USER_ID = 'userId',
}

export enum TypeResponse {
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum TypeCount {
  IN_CREASE = 'IN_CREASE',
  DE_CREASE = 'DE_CREASE',
}

export enum PackageService {
  USERS = 'users',
  NOTES = 'notes',
  NOTIFICATIONS = 'notifications',
}

export enum TableName {
  NOTES = 'notes',
  NOTE_DETAILS = 'note_details',
}
