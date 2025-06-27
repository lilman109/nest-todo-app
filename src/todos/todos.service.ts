import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodosService {
  constructor(
    private prismaService: PrismaService
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = await this.prismaService.todo.create({
      data: {
        title: createTodoDto.title,
        description: createTodoDto.description,
        dueDate: createTodoDto.dueDate ? new Date(createTodoDto.dueDate) : null,
        priority: createTodoDto.priority || "MEDIUM",
      },
    });
    return todo;
  }

  async findAll(): Promise<Todo[]> {
    return await this.prismaService.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.prismaService.todo.findUnique({
      where: { id },
    }); 

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    try {
      const updatedTodo = await this.prismaService.todo.update({
        where: { id },
        data: {
          ...updateTodoDto,
          dueDate: updateTodoDto.dueDate ? new Date(updateTodoDto.dueDate) : undefined,
        },
      });
      return updatedTodo;
    } catch (error) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      const deletedTodo = await this.prismaService.todo.delete({
        where: { id },
      });
      return deletedTodo;
    } catch (error) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
  }

  async findByStatus(completed: boolean): Promise<Todo[]> {
    return await this.prismaService.todo.findMany({
      where: { completed },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByPriority(priority: 'LOW' | 'MEDIUM' | 'HIGH'): Promise<Todo[]> {
    return await this.prismaService.todo.findMany({
      where: { priority },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getByStats(): Promise<{ total: number; completed: number; pending: number }> {
    const total = await this.prismaService.todo.count();
    const completed = await this.prismaService.todo.count({
      where: { completed: true },
    });
    const pending = await this.prismaService.todo.count({
      where: { completed: false },
    });

    return { total, completed, pending };
  }

}