import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];
  private currentId = 1;

  create(createTodoDto: CreateTodoDto): Todo {
    const todo = new Todo({
      id: this.currentId++,
      title: createTodoDto.title,
      description: createTodoDto.description,
      priority: createTodoDto.priority || 'medium',
      dueDate: createTodoDto.dueDate ? new Date(createTodoDto.dueDate) : undefined
    });

    this.todos.push(todo);
    return todo;

  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo =  this.todos.find(todo => todo.id === id)

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return todo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto): Todo {
    const todoIndex = this.todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    const existingTodo = this.todos[todoIndex];
    const updatedTodo = {
      ...existingTodo,
      ...updateTodoDto,
      dueDate: updateTodoDto.dueDate ? new Date(updateTodoDto.dueDate) : existingTodo.dueDate,
      updatedAt: new Date()
    };
    this.todos[todoIndex] = updatedTodo;
    return updatedTodo;
  }

  remove(id: number) {
    const todoIndex = this.todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    this.todos.splice(todoIndex, 1);

    return {message: `Todo with id ${id} removed successfully`
    }
  }

  findByStatus(completed: boolean): Todo[] {
    return this.todos.filter(todo => todo.completed === completed);
  }

  findByPriority(priority: 'low' | 'medium' | 'high'): Todo[] {
    return this.todos.filter(todo => todo.priority === priority);
  }

  getByStats(): { total: number; completed: number; pending: number } {
    const total = this.todos.length;
    const completed = this.todos.filter(todo => todo.completed).length;
    const pending = total - completed;

    return { total, completed, pending };
  }

}