export class Todo {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<Todo>){
        Object.assign(this, partial);
        this.completed = this.completed || false;
        this.priority = this.priority || 'medium';
        this.createdAt = this.createdAt || new Date();
        this.updatedAt = this.updatedAt || new Date();
    }
}
