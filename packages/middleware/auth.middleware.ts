import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthHeaders } from "packages/common/constant";
import { config } from "packages/config";
import * as crypto from 'crypto';
import { UsersService } from "../../apps/users/src/services/users.service";
import { User } from "@prisma/client";

@Injectable()
export class AuthMiddleware {
    constructor(private readonly usersService: UsersService) { }

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const request = context.switchToHttp().getRequest();
        const authHeaders = request.headers.authorization;
        const userId = Number(request.headers.userid);
        if (!authHeaders) {
            const xApiKey = req.headers[AuthHeaders.API_KEY];
            if (!xApiKey || xApiKey != config.API_KEY) throw new UnauthorizedException();
            return request.user = AuthHeaders.SEVER_PROCESS;
        }
        if (!userId) {
            throw new UnauthorizedException();
        }
        const idToken = authHeaders.split(' ')[1];
        const decoded = await this.decodeToken(userId, idToken);
        return request.user = decoded;
    }

    private async decodeToken(userId: number, token: string): Promise<User> {
        try {
            const [header, payload, signature] = token.split('.');
            const user = await this.usersService.findById(userId);
            if (!user) {
                throw new UnauthorizedException();
            }
            const expectedSignature = crypto
                .createHmac('sha256', user.tokenGg)
                .update(`${header}.${payload}`)
                .digest('base64url');

            if (signature !== expectedSignature) {
                throw new UnauthorizedException();
            }
            delete user.tokenGg;
            return user;
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}