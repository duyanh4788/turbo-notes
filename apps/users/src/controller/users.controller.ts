import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { config } from 'packages/config';
import { AuthMiddleware } from 'packages/middleware/auth.middleware';
import { GoogleAuthGuard } from 'src/middleware/google-auth-guard.service';
import { UsersService } from 'src/services/users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('google')
  async googleLogin(@Req() _) {
    return `${config.DOMAIN_GG}&redirect_uri=${config.GG_CALLBACK}&scope=profile email&client_id=${config.GG_ID}`
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() _) { }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user;
    return res.redirect(`${config.DOMAIN_FE}?userId=${user.id}&token=${user.tokenData}`);
  }

  @Post('signout')
  @UseGuards(AuthMiddleware)
  async signOut(@Req() req) {
    return this.usersService.SignOut(req.user.id)
  }

  @Get()
  @UseGuards(AuthMiddleware)
  async get(@Req() req) {
    return req.user;
  }
}
