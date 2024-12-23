import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { config } from 'packages/config';
import { GoogleAuthGuard } from 'src/services/google/google-auth-guard.service';
import { UsersService } from 'src/services/users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) { }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user;
    return res.redirect(`${config.FE_RENDER}?userId=${user.id}&token=${user.tokengg}`);
  }

  @Post()
  async created(@Body() data: User): Promise<User> {
    return await this.usersService.created(data);
  }
}
