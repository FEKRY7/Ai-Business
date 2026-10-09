import { Injectable } from '@nestjs/common';
import * as otpGenerator from 'otp-generator';
import moment from 'moment';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class OtpService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  generatorLimitTimeOTP(): { OTPCode: string; expireDate: Date } {
    // Get OTP length from environment variables (default to 6 if not set)
    const otpLength = parseInt(
      this.configService.get<string>('OTPNUMBERS') || '6',
      10,
    );

    // Generate OTP
    const OTP = {
      OTPCode: otpGenerator.generate(otpLength, {
        upperCaseAlphabets: false,
        specialChars: false,
      }),
      expireDate: moment().add(2, 'minutes').toDate(), // Convert moment to Date object
    };

    return OTP;
  }

}