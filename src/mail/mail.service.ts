import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, RequestTimeoutException } from '@nestjs/common';
import * as ejs from 'ejs';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendOtpResetPasswordEmailTemplate(email: string, OTPCode: string) {
    try {
      // 🔥 FIX: works in dev + dist
      const templatePath = join(
        process.cwd(),
        'src/mail/templates/create-otp.ejs',
      );

      const template = fs.readFileSync(templatePath, 'utf-8');

      const html = ejs.render(template, {
        OTPCode,
      });

      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset Request',
        text: `Use this code to reset your password: ${OTPCode}. This code is valid for 2 minutes.`,
        html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new RequestTimeoutException('Failed to send email verification');
    }
  }
}
