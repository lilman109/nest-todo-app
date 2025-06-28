import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, ValidationPipe, UseGuards, Request } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto, Priority } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('todos')
@UseGuards(JwtAuthGuard) // @UseGuards is used to protect the route with JWT authentication
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  // @Request() decorator is used to access the request object, which contains user information after authentication
  create(@Body(ValidationPipe) createTodoDto: CreateTodoDto, @Request() req) {
    return this.todosService.create({createTodoDto, userId: req.user.id});
  }

  @Get()
  findAll(@Request() req, @Query("status")status?: string, @Query("priority")priority?: Priority) {
    if (status === "completed") {
      return this.todosService.findByStatus({completed: true, userId: req.user.id});
    }

    if (status === "pending") {
      return this.todosService.findByStatus({completed: false, userId: req.user.id});
    }
    
    if (priority && ['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
      return this.todosService.findByPriority({priority, userId: req.user.id});
    }

    return this.todosService.findAll({ userId: req.user.id });
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.todosService.getByStats(req.user.id);
  }

  @Get(":id")
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.todosService.findOne({ id: +id, userId: req.user.id });
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateTodoDto: UpdateTodoDto, @Request() req) {
    return this.todosService.update({ id: +id, updateTodoDto, userId: req.user.id });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.todosService.remove({ id: +id, userId: req.user.id });
  }
}
