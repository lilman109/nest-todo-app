export class Todo {
    id: number;
    title: string;
    description?: string | null;
    completed: boolean;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: Date | null;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<Todo>){
        Object.assign(this, partial);
        this.completed = this.completed || false;
        this.priority = this.priority || 'MEDIUM';
        this.createdAt = this.createdAt || new Date();
        this.updatedAt = this.updatedAt || new Date();
    }
}
