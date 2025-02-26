import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Banners, User } from '@prisma/client';
import { config } from 'packages/config';
import { AuthMiddleware } from 'packages/middleware/auth.middleware';
import { GrpcInterceptor } from 'packages/middleware/grpc.interceptor';
import { from, Observable } from 'rxjs';
import {
  CountNoteDto,
  DecreaseTotalDto,
  GetByIdDto,
} from 'src/common/DTO/users.dto';
import { GoogleAuthGuard } from 'src/middleware/google-auth-guard.service';
import { UsersService } from 'src/services/users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('banners')
  async getBanners(): Promise<Banners[]> {
    return this.usersService.getBanners();
  }

  @Post('google')
  async googleLogin() {
    return `${config.DOMAIN_GG}&redirect_uri=${config.GG_CALLBACK}&scope=profile email&client_id=${config.GG_ID}`;
  }

  @Get('google')
  @UseGuards()
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

  @GrpcMethod('UsersService', 'CountNotes')
  @UseInterceptors(GrpcInterceptor)
  CountNotes(payload: CountNoteDto): Promise<Observable<void>> {
    return this.usersService.CountNotes(payload);
  }

  @GrpcMethod('UsersService', 'CountNoteDetails')
  @UseInterceptors(GrpcInterceptor)
  CountNoteDetails(payload: CountNoteDto): Promise<Observable<void>> {
    return this.usersService.CountNoteDetails(payload);
  }

  @GrpcMethod('UsersService', 'GetById')
  @UseInterceptors(GrpcInterceptor)
  GetById(payload: GetByIdDto): Observable<User> {
    return from(this.usersService.findById(Number(payload.userId)));
  }

  @GrpcMethod('UsersService', 'DecreaseTotal')
  @UseInterceptors(GrpcInterceptor)
  DecreaseTotal(payload: DecreaseTotalDto): Promise<Observable<void>> {
    return this.usersService.DecreaseTotal(payload);
  }
}
