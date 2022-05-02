import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

import { Todo, TodoPage, TodoResponse } from '../services/todo';
import { TodoService } from '../services/todo-api.service';

@Component({
    selector: 'app-todos',
    templateUrl: './todos.component.html',
    styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

    todos: Todo[] = [];

    // MatPaginator Inputs
    totalSize = 0;
    pageSize = 5;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private todoService: TodoService,
        // private messageService: MessageService
    ) { }

    ngOnInit(): void {
        // detail 페이지에서 back 할 때, 원래 보던 페이지 출력하기
        // set pageIndex from queryParam
        if (this.activatedRoute.snapshot.queryParamMap.has('page')) {
            this.pageIndex = parseInt(this.activatedRoute.snapshot.queryParamMap.get('page')!, 10);
        }
        this.getTodosByPage(this.pageSize, this.pageIndex);
    }

    // maxIndex = pageSize * (pageIndex + 1)
    getTodosByPage(pageSize: number, pageIndex: number) {
        this.todoService.getTodosByPage(pageSize, pageIndex)
            .subscribe(res => {
                this.totalSize = res.total;
                this.todos = res.todos;
            });
    }

    /*
    getTodos(): void {
        this.todoService.getTodos()
            .subscribe(todos =>{
            this.todos = todos;
            this.totalSize = todos.length;
            });
    }
    */

    add(name: string): void {
        name = name.trim();
        if (!name) { return; }

        this.todoService.addTodo({ name: name } as Todo)
            .subscribe(res => {
                if (res.success) {
                    // 맨 윗줄에 위치하도록, 기존 것들은 아래쪽에 잘라 붙이기
                    this.todos = [res.todo!].concat(this.todos.slice(0, this.pageSize - 1));
                }
            });
    }

    delete(todo: Todo): void {
        this.todos = this.todos.filter(t => t !== todo);
        this.todoService.deleteTodo(todo.id)
            .subscribe(_ => {
                // 총 개수를 줄이고, 현재 페이지를 다시 불러온다
                this.totalSize -= 1;
                this.getTodosByPage(this.pageSize, this.pageIndex);
            });
    }

    // MatPaginator controller
    handlePageEvent(event: PageEvent) {
        this.totalSize = event.length;
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.getTodosByPage(this.pageSize, this.pageIndex);

        // 페이지 이동 없이 현재 페이지의 queryPrams을 업데이트
        // for goBack
        // ** 참고: https://stackoverflow.com/a/43706998
        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: { page: this.pageIndex },
                queryParamsHandling: 'merge',   // remove to replace all query params by provided
            });
    }
}
