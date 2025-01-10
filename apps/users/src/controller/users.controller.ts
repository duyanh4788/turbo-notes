import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { config } from 'packages/config';
import { AuthMiddleware } from 'packages/middleware/auth.middleware';
import { GoogleAuthGuard } from 'src/middleware/google-auth-guard.service';
import { UsersService } from 'src/services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('google')
  async googleLogin() {
    return `${config.DOMAIN_GG}&redirect_uri=${config.GG_CALLBACK}&scope=profile email&client_id=${config.GG_ID}`;
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user;
    return res.redirect(
      `${config.DOMAIN_FE}?userId=${user.id}&token=${user.tokenData}`,
    );
  }

  @Post('signout')
  @UseGuards(AuthMiddleware)
  async signOut(@Req() req) {
    return this.usersService.SignOut(req.user.id);
  }

  @Get()
  @UseGuards(AuthMiddleware)
  async get(@Req() req) {
    return req.user;
  }
}
