import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private mailService: MailService,
  ) {}

  @Post('login')
  async login(@Res() res: any, @Body() body: LoginDto) {
    if (!body.email && !body.password) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Error. Check the query parameters' });
    }
    const findUser = await this.userService.findUserByEmail(body.email);
    if (!findUser) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'The email address or password is incorrect' });
    }
    if (await this.authService.compareHash(body.password, findUser.password)) {
      const token = await this.authService.singIn(findUser.id.toString());
      return res.status(HttpStatus.OK).json({ token });
    }
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'The email address or password is incorrect' });
  }

  @Post('register')
  async registerUser(@Res() res: any, @Body() body: RegisterDto) {
    let findUser;
    try {
      findUser = await this.userService.findUserByEmail(body.email.trim());
    } catch (err) {
      console.log(err);
    }
    if (findUser) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'A user with this email address already exists' });
    }
    const user = await this.userService.createUser(body.role, {
      firstName: body.firstName ? body.firstName : 'User',
      email: body.email,
      password: body.password,
      phoneNumber: body.phoneNumber,
    });

    if (user) {
      const subject = 'Welcome!';
      this.mailService.send(user.email, subject, MailTemplate.WELCOME, {
        userName: user.firstName,
      });
      const token = await this.authService.singIn(user.id.toString());
      return res.status(HttpStatus.OK).json({ token });
    }

    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: 'Error. Failed to register user' });
  }
}
