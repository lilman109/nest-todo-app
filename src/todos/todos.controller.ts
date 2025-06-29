import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, ValidationPipe, UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto, Priority } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types/jwt-payload.type';

@Controller('todos')
@UseGuards(JwtAuthGuard) // 全てのルートで認証が必要
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body(ValidationPipe) createTodoDto: CreateTodoDto, @CurrentUser() user: AuthenticatedUser) {
    return this.todosService.create({createTodoDto, userId: user.id});
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query("status")status?: string, @Query("priority")priority?: Priority) {
    if (status === "completed") {
      return this.todosService.findByStatus({completed: true, userId: user.id});
    }

    if (status === "pending") {
      return this.todosService.findByStatus({completed: false, userId: user.id});
    }
    
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      return this.todosService.findByPriority({priority, userId: user.id});
    }

    return this.todosService.findAll({userId: user.id});
  }

  @Get('stats')
  getStats(@CurrentUser() user: AuthenticatedUser) {
    return this.todosService.getByStats({userId: user.id});
  }

  @Get(":id")
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.todosService.findOne({id, userId: user.id});
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateTodoDto: UpdateTodoDto, @CurrentUser() user: AuthenticatedUser) {
    return this.todosService.update({id: +id, updateTodoDto, userId: user.id });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.todosService.remove({id, userId: user.id});
  }
}