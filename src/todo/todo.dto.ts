import { IsString, IsNotEmpty, IsArray, IsNumber, IsBoolean } from 'class-validator';
import { Todo } from './todo.entity';

// for create, update
export class TodoDto {

    // create 할 때 validation 걸림 ==> update용으로 따로 만들던지
    // @IsNumber()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    done: boolean;

    arrtodos: number[];
}

// for create, update, delete
export class TodoResponseDto {

    @IsBoolean()
    @IsNotEmpty()
    success: boolean = false;

    todo: Todo = undefined;

    public constructor(todo?: any) {
        if (todo && todo instanceof Todo) {
            this.todo = todo;
            this.success = true;
        }
    }
}

// for pagination
export class TodoPageDto {

    @IsNumber()
    @IsNotEmpty()
    total: number;

    @IsArray()
    todos: Todo[] = [];

    public constructor(total: number, todos: Todo[]) {
        this.total = total;
        this.todos = todos === undefined ? [] : todos;
    }
}

// for search
export class SearchDto {

    @IsNumber()
    size: number;

    @IsNumber()
    page: number;

    term?: string;

    done?: boolean;

    from_dt?: string;    // YYYY-MM-DD

    to_dt?: string;      // YYYY-MM-DD
}