import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // AuthGuard('jwt')はJwtStrategyを自動的に呼び出す
  // 認証が失敗した場合は自動的に401 Unauthorizedを返す
}