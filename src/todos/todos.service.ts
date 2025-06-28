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

  async create({ createTodoDto, userId }: { createTodoDto: CreateTodoDto; userId: number }): Promise<Todo> {
    const todo = await this.prismaService.todo.create({
      data: {
        title: createTodoDto.title,
        description: createTodoDto.description,
        dueDate: createTodoDto.dueDate ? new Date(createTodoDto.dueDate) : null,
        priority: createTodoDto.priority || "MEDIUM",
        userId: userId,
      },
    });
    return todo;
  }

  async findAll({ userId }: { userId: number }): Promise<Todo[]> {
    return await this.prismaService.todo.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findOne({ id, userId }: { id: number; userId: number }): Promise<Todo> {
    const todo = await this.prismaService.todo.findUnique({
      where: {
        userId,
        id
      }
    }); 

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return todo;
  }

  async update({ id, updateTodoDto, userId }: { id: number; updateTodoDto: UpdateTodoDto; userId: number }): Promise<Todo> {
    try {
      const updatedTodo = await this.prismaService.todo.update({
        where: { id, userId },
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

  async remove({ id, userId }: { id: number; userId: number }): Promise<Todo> {
    try {
      const deletedTodo = await this.prismaService.todo.delete({
        where: { id, userId },
      });
      return deletedTodo;
    } catch (error) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
  }

  async findByStatus({ completed, userId }: { completed: boolean; userId: number }): Promise<Todo[]> {
    return await this.prismaService.todo.findMany({
      where: { completed, userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByPriority({ priority, userId }: { priority: 'LOW' | 'MEDIUM' | 'HIGH'; userId: number }): Promise<Todo[]> {
    return await this.prismaService.todo.findMany({
      where: { priority, userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getByStats({ userId }: { userId: number }): Promise<{ total: number; completed: number; pending: number }> {
    const total = await this.prismaService.todo.count();
    const completed = await this.prismaService.todo.count({
      where: { completed: true, userId },
    });
    const pending = await this.prismaService.todo.count({
      where: { completed: false },
    });

    return { total, completed, pending };
  }

}