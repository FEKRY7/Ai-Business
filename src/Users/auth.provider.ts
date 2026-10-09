import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadType } from 'src/untils/types';
import { Token } from 'src/Token/token.entity';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
  ) { }

  // /**
  //  * Creates a new user in the database.
  //  * @param registerDto The user's registration data.
  //  * @returns JWT (access token)
  //  */

  public async SignUp(registerDto: RegisterDto) {
    const { userName, email, password } =
      registerDto;

    // Check if email already exists
    const isEmailExist = await this.usersRepository.findOne({
      where: { email },
    });
    if (isEmailExist) {
      throw new NotFoundException(
        'Email already exists, please choose another one.',
      );
    }

    const hashedPassword = await this.hashPassword(password);


    const newUser = this.usersRepository.create({
      userName,
      email,
      password: hashedPassword,
    });

    // Save user first before sending OTP
    await this.usersRepository.save(newUser);

    return {
      message: 'User successfully registered',
      newUser,
  }
}

  /**
   * Log In user
   * @param loginDto The user's login data.
   * @returns JWT (access token)
   */

  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const isEmailExist = await this.usersRepository.findOne({
      where: { email },
    });
    if (!isEmailExist) throw new UnauthorizedException('Email Is Not Found');

    const isPasswordValid = await bcrypt.compare(
      password,
      isEmailExist.password,
    );
    if (!isPasswordValid) throw new UnauthorizedException('Password is wrong');



    const payload: JWTPayloadType = {
      id: isEmailExist.id,
      role: isEmailExist.role,
      userName: isEmailExist.userName,
      email: isEmailExist.email
    };
    const token = this.generateAccessToken(payload);
    await this.tokenRepository.delete({
      user: { id: isEmailExist.id },
    });
    const AccessToken = this.tokenRepository.create({
      token,
      user: isEmailExist,
    });
    await this.tokenRepository.save(AccessToken);
    await this.usersRepository.save(isEmailExist);
    return {
      message: 'Sign-in successful',
      token: `Bearer ${token}`,
    };
  }


  /**
   *  Hashes the password.
   * @param password  The password to hash.
   * @returns  Hashed password.
   */
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  /**
   *  Generates JWT token from payload.
   * @param payload  The user's payload.  This should contain the user's id and user type.  For example: { id: 1, userType: 'admin' }.  The JWT library automatically generates
   * @returns  JWT token.
   */

  public generateAccessToken(payload: JWTPayloadType) {
  return this.jwtService.sign(payload);
  }

}
