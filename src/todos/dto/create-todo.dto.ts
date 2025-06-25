import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export enum Priority {
    Low = 'low',
    Medium = 'medium',
    High = 'high',
}

export class CreateTodoDto {
    @IsString()
    @IsNotEmpty({message: "Title is required"})
    @MaxLength(100, {message: "Title must be at most 100 characters long"})
    title: string;

    @IsString()
    @IsOptional()
    @MaxLength(500, {message: "Description must be at most 500 characters long"})
    description?: string;

    @IsEnum(Priority, { message: "Priority must be one of: low, medium, high" })
    @IsOptional()
    priority?: Priority;

    @IsDateString({}, { message: "Due date must be a valid date string in ISO format" })
    @IsOptional()
    dueDate?: Date;
    }
