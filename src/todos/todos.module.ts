import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TodosController],
  providers: [TodosService, PrismaService],
  exports: [TodosService]
})
export class TodosModule {}
