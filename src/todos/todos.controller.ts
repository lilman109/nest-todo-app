import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto, Priority } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body(ValidationPipe) createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll(@Query("status")status?: string, @Query("priority")priority?: Priority) {
    if (status === "completed") {
      return this.todosService.findByStatus(true);
    }

    if (status === "pending") {
      return this.todosService.findByStatus(false);
    }
    
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      return this.todosService.findByPriority(priority);
    }

    return this.todosService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.todosService.getByStats();
  }

  @Get(":id")
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(+id);
  }
}
