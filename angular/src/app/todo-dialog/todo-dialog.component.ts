import { Component, Inject, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Todo } from '../services/todo';
import { TodoService } from '../services/todo-api.service';

@Component({
    selector: 'app-todo-dialog',
    templateUrl: './todo-dialog.component.html',
    styleUrls: ['./todo-dialog.component.css']
})
export class TodoDialogComponent implements OnInit {

    todos: Todo[] = [];
    // candidates!: Todo[];

    // MatPaginator Inputs
    totalSize = 0;
    pageSize = 5;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25];

    constructor(
        public dialogRef: MatDialogRef<TodoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public todo: Todo,
        private todoService: TodoService,
    ) {
        // 필터링 (백엔드API로 처리)
        // - 조건1: 부모가 될 id 제외
        // - 조건2: 이미 sub-todos를 가진 id 제외
        this.getTodosByPage(this.pageSize, this.pageIndex);
    }

    ngOnInit(): void {
    }

    selectTodo(todo: Todo) {
        this.dialogRef.close(todo);
    }

    /////////////////////////////////////////

    // MatPaginator controller
    handlePageEvent(event: PageEvent) {
        this.totalSize = event.length;
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.getTodosByPage(this.pageSize, this.pageIndex);
    }

    // maxIndex = pageSize * (pageIndex + 1)
    getTodosByPage(pageSize: number, pageIndex: number) {
        const excludes = this.todo.arrtodos ? this.todo.arrtodos.concat([this.todo.id]) : [this.todo.id];
        this.todoService.getCandidatesByPage(this.pageSize, this.pageIndex, excludes)
            .subscribe(page => {
                console.log('getTodosByPage', pageSize, pageIndex);
                this.totalSize = page.total;
                this.todos = page.todos;
            });
    }
}
