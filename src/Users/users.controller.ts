import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Put,
  Patch,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import * as types from '../untils/types';
import { AuthRolesGuard } from 'src/guards/auth.roles.guard';
import { ChangePasswordDto } from './dtos/ChangePassword.dto';
import { Roles } from './decorators/user-role.decorator';
import { UserRole } from 'src/untils/enums';
import { UpdateProfileDto } from './dtos/updateProfile.dto';
import { ResetDto } from './dtos/reset.dto';
import { ForgotDto } from './dtos/forgot.dto';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST: /api/users/auth/signup
  @Post('auth/signUp')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Create a new user account.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or user already exists.',
  })
  public async registerUser(@Body() Body: RegisterDto) {
    return await this.usersService.SignUp(Body);
  }

  // POST: /api/users/auth/login
  @Post('auth/login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticate user and return access token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password.',
  })
  public async login(@Body() Body: LoginDto) {
    return await this.usersService.login(Body);
  }

  // GET: /api/users/current-user
  @Get('current-user')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Return the profile of the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile returned successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  public async GetLogginUserProfile(
    @CurrentUser() payload: types.JWTPayloadType,
  ) {
    return await this.usersService.getCurrentUser(payload.id);
  }

  // PUT: /api/users/change-password
  @Put('/change-password')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change user password',
    description: 'Change the password of the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid password data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  public async ChangeUserPassword(
    @CurrentUser() payload: types.JWTPayloadType,
    @Body() body: ChangePasswordDto,
  ) {
    return await this.usersService.changeUserPassword(body, payload);
  }

  // POST: /api/users/forgot-password
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Send an OTP to the user email for password reset.',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Maximum OTP attempts reached or email sending failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Email not found.',
  })
  public async forgotPassword(@Body() body: ForgotDto) {
    return await this.usersService.forgetPassword(body);
  }

  // POST: /api/users/reset-password
  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset user password using the OTP sent to the email.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP or passwords do not match.',
  })
  @ApiResponse({
    status: 401,
    description: 'OTP has expired.',
  })
  @ApiResponse({
    status: 404,
    description: 'Email not found.',
  })
  public async resetPassword(@Body() body: ResetDto) {
    return await this.usersService.resetPassword(body);
  }

  // PUT: /api/users/update
  @Put('update')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Update the profile of the authenticated admin user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid profile data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  public async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() payload: types.JWTPayloadType,
  ) {
    return await this.usersService.updateProfile(
      payload,
      updateProfileDto,
    );
  }

  // PATCH: /api/users/softdelete
  @Patch('softdelete')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft delete current user',
    description: 'Deactivate the currently authenticated admin account.',
  })
  @ApiResponse({
    status: 200,
    description: 'User soft deleted successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  public async SoftDelete(
    @CurrentUser() payload: types.JWTPayloadType,
  ) {
    return await this.usersService.softDelete(payload);
  }
}