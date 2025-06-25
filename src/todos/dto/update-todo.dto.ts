import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
    @IsBoolean({ message: "Completed must be a boolean value" })
    @IsOptional()
    completed?: boolean;
}