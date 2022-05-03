// for select
export interface Todo {
    id: number;
    name: string;
    done: boolean;
    created?: string;
    updated?: string;
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

// for search
export interface TodoSearch {
    page: number;
    size: number;

    term?: string;
    done?: boolean;
    from_dt?: string;
    to_dt?: string;
}