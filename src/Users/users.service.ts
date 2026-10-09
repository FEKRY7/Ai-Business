import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { JWTPayloadType } from 'src/untils/types';
import { AuthProvider } from './auth.provider';
import { ChangePasswordDto } from './dtos/ChangePassword.dto';
import * as bcrypt from 'bcryptjs';
import { Token } from 'src/Token/token.entity';
import { ForgotDto } from './dtos/forgot.dto';
import { ResetDto } from './dtos/reset.dto';
import { UpdateProfileDto } from './dtos/updateProfile.dto';
import { OtpService } from './otpGenerator.provider';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly authProvider: AuthProvider,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) { }

  /**
   * Creates a new user in the database.
   * @param registerDto The user's registration data.
   * @returns JWT (access token)
   */

  public async SignUp(registerDto: RegisterDto) {
    return await this.authProvider.SignUp(registerDto);
  }

  /**
   * Log In user
   * @param loginDto The user's login data.
   * @returns JWT (access token)
   */

  public async login(loginDto: LoginDto) {
    return await this.authProvider.login(loginDto);
  }

  /**
   *  Get user by id.
   * @param id id of the user.
   * @returns User.
   */
  public async getCurrentUser(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    } else {
      return user;
    }
  }

  public async changeUserPassword(
    changePasswordDto: ChangePasswordDto,
    payload: JWTPayloadType,
  ) {
    const { oldPassword, newPassword, ConfirmNewPassword } = changePasswordDto;

    const user = await this.getCurrentUser(payload.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    const isSameAsOldPassword = await bcrypt.compare(
      newPassword,
      user.password,
    );
    if (isSameAsOldPassword) {
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }

    // Validate that newPassword and ConfirmNewPassword match
    if (newPassword !== ConfirmNewPassword) {
      throw new NotFoundException('New password and confirmation do not match');
    }

    user.password = await this.authProvider.hashPassword(newPassword);
    await this.usersRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  public async forgetPassword(forgotDto: ForgotDto) {
    const { email } = forgotDto;

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Email Is Not Found');
    }

    // Check maximum OTP attempts
    if ((user.OTPSentTimes ?? 0) >= Number(process.env.MAXOTPSMS)) {
      throw new BadRequestException(
        'OTP already sent. Please check your email.',
      );
    }

    // Generate OTP
    const otp = this.otpService.generatorLimitTimeOTP();

    // Send email first
    try {
      await this.mailService.sendOtpResetPasswordEmailTemplate(
        email,
        otp.OTPCode,
      );
    } catch (error) {
      console.error('Error sending OTP email:', error);

      throw new BadRequestException(
        'There was a problem sending the OTP email',
      );
    }

    // Save OTP only if email was sent successfully
    user.OTP = otp;
    user.OTPSentTimes = (user.OTPSentTimes ?? 0) + 1;

    await this.usersRepository.save(user);

    return {
      message: 'OTP sent. Check your email.',
    };
  }

  public async resetPassword(resetDto: ResetDto) {
    const {
      email,
      OTP,
      newPassword,
      confirmNewPassword,
    } = resetDto;

    // Check if user exists
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Email is incorrect');
    }

    // Check if OTP exists
    if (!user.OTP) {
      throw new BadRequestException('No OTP found');
    }

    // Check OTP
    if (user.OTP.OTPCode !== OTP.OTPCode) {
      throw new BadRequestException('Invalid OTP');
    }

    // Check OTP expiration
    if (user.OTP.expireDate < new Date()) {
      throw new UnauthorizedException('OTP has expired');
    }

    // Check password confirmation
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException(
        'New password and confirmation do not match',
      );
    }

    // Hash new password
    const hashedPassword =
      await this.authProvider.hashPassword(newPassword);

    user.password = hashedPassword;

    // Reset OTP data after successful password reset
    user.OTP = null;
    user.OTPSentTimes = 0;

    await this.usersRepository.save(user);

    return {
      message: 'Password changed successfully',
    };
  }

  public async updateProfile(
    payload: JWTPayloadType,
    updateProfileDto: UpdateProfileDto,
  ) {
    const user = await this.getCurrentUser(payload.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedData: Partial<User> = {};

    if (updateProfileDto.userName !== undefined) {
      updatedData.userName = updateProfileDto.userName;
    }

    if (Object.keys(updatedData).length === 0) {
      throw new BadRequestException(
        'At least one field must be provided for update.',
      );
    }

    Object.assign(user, updatedData);

    const updatedUser = await this.usersRepository.save(user);

    return {
      message: 'Profile updated successfully',
      data: updatedUser,
    };
  }

  public async softDelete(payload: JWTPayloadType) {
    const user = await this.getCurrentUser(payload.id);

    if (!user) {
      throw new NotFoundException('This user does not exist');
    }

    await this.usersRepository.save(user);

    return { message: 'User has been soft deleted successfully.' };
  }

  public async getToken(
    token: string,
  ) {
    const tokenDb = await this.tokenRepository.findOneBy({
      token,
      isValied: true,
    });
    if (!tokenDb) {
      throw new NotFoundException('Expired or invalid token');
    }
  }
}
