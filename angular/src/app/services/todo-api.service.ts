import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, forkJoin, map, count, scan, skip, take } from 'rxjs';
import { catchError, tap, filter } from 'rxjs/operators';

import { Todo, TodoResponse, TodoPage } from './todo';

const EMPTY_PAGE: TodoPage = { total: 0, todos: [] };
const EMPTY_RESPONSE: TodoResponse = { success: false, todo: undefined };

@Injectable({
    providedIn: 'root'
})
export class TodoService {

    // private todosUrl = 'api/todos';  // in-memory-data.service
    private apiUrl = 'http://localhost:3000/api/todo';  // nestjs server

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient,
        // private messageService: MessageService
    ) {
        // this.getTodos().subscribe(todos => {
        //   console.log(`todos.length=${todos.length}`);
        // })
    }

    getTodos(): Observable<Todo[]> {
        const url = `${this.apiUrl}/all`;
        return this.http.get<Todo[]>(url).pipe(
            tap(_ => this.log('fetched all todos')),
            catchError(this.handleError<Todo[]>('getTodos', []))
        );
    }

    getTodosByPage(pageSize: number, pageIndex: number): Observable<TodoPage> {
        const url = `${this.apiUrl}/pages/${pageIndex}?size=${pageSize}`;
        return this.http.get<TodoPage>(url).pipe(
            tap(res => console.log(`getByPage todos(${res.todos.length}) from ${pageSize * pageIndex}`)),
            catchError(this.handleError<TodoPage>('getTodosByPage', EMPTY_PAGE))
        );
    }

    getCandidatesByPage(pageSize: number, pageIndex: number, excludes: number[]): Observable<TodoPage> {
        const url = `${this.apiUrl}/candidates/${pageIndex}?size=${pageSize}&excludes=${excludes.join(',')}`;
        return this.http.get<TodoPage>(url).pipe(
            tap(res => console.log(`getByPage candidates(${res.todos.length}) from ${pageSize * pageIndex}`)),
            catchError(this.handleError<TodoPage>('getCandidatesByPage', EMPTY_PAGE))
        );
    }

    /** GET todo from the server */
    getTodo(id: number): Observable<Todo> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Todo>(url).pipe(
            tap(_ => this.log(`fetched todo id=${id}`)),
            catchError(this.handleError<Todo>(`getTodo id=${id}`))
        );
    }

    /** GET todos from the server */
    getSubTodos(todo: Todo): Observable<Todo[]> {
        if (!todo.arrtodos) {
            return of([]);
        }
        const ids = todo.arrtodos.join(',');
        const url = `${this.apiUrl}/ids/${ids}`;
        return this.http.get<Todo[]>(url).pipe(
            tap(_ => this.log(`fetched todo ids=[${ids}]`)),
            catchError(this.handleError<Todo[]>(`getSubTodos ids=[${ids}]`, []))
        );
    }

    /* GET todos whose name contains search term */
    // not yet implemented
    searchTodos(term: string): Observable<Todo[]> {
        // if not search term, return empty todo array.
        if (!term.trim()) {
            return of([]);
        }
        const url = `${this.apiUrl}/name/${encodeURI(term)}`;
        return this.http.get<Todo[]>(url).pipe(
            tap(x => x.length ?
                this.log(`found todos matching "${term}"`) :
                this.log(`no todos matching "${term}"`)),
            catchError(this.handleError<Todo[]>('searchTodos', []))
        );
    }

    //////// Save methods //////////

    /** POST: add a new todo to the server */
    addTodo(todo: Todo): Observable<TodoResponse> {
        return this.http.post<TodoResponse>(this.apiUrl, todo, this.httpOptions).pipe(
            tap((res: TodoResponse) => this.log(`added todo: ${res.success ? 'success' : 'fail'}`)),
            catchError(this.handleError<TodoResponse>('addTodo'))
        );
    }

    /** PUT: update the todo on the server */
    updateTodo(todo: Todo): Observable<TodoResponse> {
        const url = `${this.apiUrl}/${todo.id}`;
        return this.http.put<TodoResponse>(url, todo, this.httpOptions).pipe(
            tap((res: TodoResponse) => this.log(`update todo: ${res.success ? 'success' : 'fail'}`)),
            catchError(this.handleError<TodoResponse>('updateTodo'))
        );
    }

    /** DELETE: delete the todo from the server */
    deleteTodo(id: number): Observable<TodoResponse> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<TodoResponse>(url, this.httpOptions).pipe(
            tap((res: TodoResponse) => this.log(`delete todo: ${res.success ? 'success' : 'fail'}`)),
            catchError(this.handleError<TodoResponse>('deleteTodo'))
        );
    }

    //////// Util methods //////////

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     *
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);
            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** Log a TodoService message with the MessageService */
    private log(message: string) {
        // this.messageService.add(`TodoService: ${message}`);
        console.log(`Log: ${message}`);
    }
}
