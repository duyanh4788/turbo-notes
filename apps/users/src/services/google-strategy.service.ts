import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from './users.service';
import { config } from 'packages/config';
import { CreateUserDto } from 'src/common/DTO/users.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private usersService: UsersService) {
    super({
      clientID: config.GG_ID,
      clientSecret: config.GG_KEY,
      callbackURL: config.GG_CALLBACK,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { emails, displayName, photos } = profile;

    const user: CreateUserDto = {
      userName: displayName,
      email: emails[0].value,
      tokenGg: accessToken,
    };

    if (photos && photos[0]?.value) {
      user.avatar = photos[0].value;
    }

    const payload = await this.usersService.created(user);
    done(null, payload);
  }
}
