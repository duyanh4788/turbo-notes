import * as crypto from 'crypto';

export class Helper {
  static generateToken(email: string, tokenGg: string): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify({ email, exp: this.getExpirationTime(7) })).toString(
      'base64url',
    );
    const signature = crypto
      .createHmac('sha256', tokenGg)
      .update(`${header}.${body}`)
      .digest('base64url');

    return `${header}.${body}.${signature}`;
  }

  static getExpirationTime(days: number): number {
    return Math.floor(Date.now() / 1000) + days * 24 * 60 * 60;
  }

  static formatScheduleTime(scheduleTime: string): string {
    const date = scheduleTime ? new Date(scheduleTime) : new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
    return formattedDate.replace(',', '').replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3');
  }

  static parseJson(jsonData: string) {
    if (!jsonData) return null;
    try {
      const parseData = JSON.parse(jsonData);
      return parseData;
    } catch (_) {
      return null;
    }
  }
}
