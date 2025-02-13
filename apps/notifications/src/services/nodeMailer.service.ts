import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { NoteDetails } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import { config } from 'packages/config';
import { Helper } from 'packages/utils/helper';
import { UsersGRPC } from 'src/grpc/users/users.grpc';

@Injectable()
export class NodeMailerService implements OnModuleInit {
  private nodemailerTransport!: nodemailer.Transporter;

  constructor(private readonly usersGRPC: UsersGRPC) {}

  onModuleInit() {
    this.startNodeMailer();
  }
  async startNodeMailer() {
    this.nodemailerTransport = nodemailer.createTransport({
      service: config.MAIL.SERVICE,
      auth: {
        user: config.MAIL.USER,
        pass: config.MAIL.PASS,
      },
    });
    this.nodemailerTransport.verify((error, success) => {
      if (error) {
        Logger.log('Mail server connection failed', error);
      } else {
        Logger.log('Mail server is running', success);
      }
    });
  }

  async sendSchedule(noteDetail: NoteDetails): Promise<void> {
    const user = await this.usersGRPC.GetById(noteDetail.userId);
    if (!user) {
      throw new NotFoundException();
    }
    const title = `You have a schedule: ${noteDetail.title} at ${Helper.formatScheduleTime(noteDetail.scheduleTime.toString())}`;
    const subject = `You have a schedule: ${noteDetail.title.length > 10 ? noteDetail.title.substring(0, 9) + '...' : noteDetail.title} at ${Helper.formatScheduleTime(noteDetail.scheduleTime.toString())}`;
    const baseMail = `
        <div style='overflow-wrap: break-word; background-color:#ffffff; line-height: 140%; padding: 30px;'>
          <h1>Hi ${user.userName}</h1>
          <p>${title}</p>
          <p>Content: ${noteDetail.content}</p>
          <p>See you there,<br> Your friends of Anh Vu<br></p>
        </div>
      `;
    await this.sendMail(
      user.email,
      subject,
      this.renderHtmlMailServices(baseMail),
    );
    return;
  }

  private renderHtmlMailServices(teamplate: any) {
    const baseTeamplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name='Notes by Anh Vũ' content='width=device-width, initial-scale=1'>
          <style>
            div {
              margin: 0 auto;
              min-width: 320px;
              max-width: 500px;
            }
            body {
              background-color: #F7F7F7;
              font-size: 14px;
              font-family: "Open Sans", Helvetica, sans-serif;
            }
            h1 {
              font-size: 22px;
            }
            p, span {
              font-size: 14px;
            }
            a {
              color: white;
            }
          </style>
        </head>
        <body>
            <div style='Margin: 0 auto;min-width: 320px;max-width: 500px;'>
            <div style='background-color:#ff6a00dc; color: white; text-align: center; padding:10px 0;'>
                <p style='line-height: 140%; text-align: center;font-size: 20px;font-weight: bolder'>Notes Schedule</p>
            </div>
            ${teamplate}
            <div style='background-color:#ff6a00dc; color: white; text-align: center; padding:10px 0;'>
                <a style='line-height: 140%; text-align: center;font-size: 20px;font-weight: bolder'>duyanh4788@gmail.com</a>
                <a style='line-height: 140%; text-align: center;font-size: 20px;font-weight: bolder'>http://github.com/duyanh4788</a>
            </div>
            </div>
        </body>
      </html>
    `;
    return baseTeamplate;
  }

  private async sendMail(
    toEmail: string,
    subject: string,
    htmlContent: string,
  ) {
    await this.nodemailerTransport.sendMail({
      from: 'System Notes Notification <duyanh4788@gmail.com>',
      to: toEmail,
      subject: subject,
      html: htmlContent,
    });
  }
}
