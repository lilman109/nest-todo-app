import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // OnModuleInit = NestJSモジュール初期化時に実行

  async onModuleInit() {
    // データベース接続を確立
    await this.$connect();
    console.log('🗄️ Prisma データベース接続成功');
  }

  // アプリ終了時の処理（任意）
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('👋 Prisma データベース接続終了');
  }
}