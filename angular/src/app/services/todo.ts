// for select
export interface Todo {
    id: number;
    name: string;
    arrtodos?: number[];
};

// for create, update, delete
export interface TodoResponse {
    success: boolean;
    todo?: Todo;
};

// for pagination
export interface TodoPage {
    total: number;
    todos: Todo[];
}