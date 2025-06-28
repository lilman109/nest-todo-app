import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { JwtPayload, AuthenticatedUser } from './types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      // JWTトークンをどこから取得するか（Authorizationヘッダーから）
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // トークンの有効期限チェックを無視しない
      ignoreExpiration: false,
      // JWT署名の検証に使用するシークレット
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  // JWTトークンが有効な場合に呼ばれる
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    // payloadにはJWTトークンのデコード済みデータが入っている
    const user = await this.authService.validateUser(payload);
    
    if (!user) {
      throw new UnauthorizedException();
    }
    
    // returnした値がrequest.userに設定される
    return user;
  }
}