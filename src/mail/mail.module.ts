import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

console.log('SMTP_HOST =>', process.env.SMTP_HOST);
console.log('SMTP_PORT =>', process.env.SMTP_PORT);

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: false,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: process.env.SMTP_FROM || 'no-reply@example.com',
      },
    }), 
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}