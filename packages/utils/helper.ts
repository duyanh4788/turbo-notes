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
}
