import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';

import { Todo } from '../services/todo';
import { TodoService } from '../services/todo-api.service';

@Component({
    selector: 'app-todo-detail',
    templateUrl: './todo-detail.component.html',
    styleUrls: ['./todo-detail.component.css']
})
export class TodoDetailComponent implements OnInit {

    todo: Todo | undefined;
    subTodos: Todo[] = [];

    constructor(
        private route: ActivatedRoute,
        private todoService: TodoService,
        private location: Location,
        public dialog: MatDialog
    ) { }

    ngOnInit(): void {
        const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
        this.getTodo(id);
    }

    getTodo(id: number): void {
        this.todoService.getTodo(id)
            .subscribe(todo => {
                this.todo = todo;
                if (todo.arrtodos) {
                    this.getSubTodos(todo);
                }
                else {
                    this.subTodos = [];
                }
            });
    }

    getSubTodos(todo: Todo): void {
        this.todoService.getSubTodos(todo)
            .subscribe(todos => {
                this.subTodos = todos;
                console.log(`subTodos=${this.subTodos.length}`);
            });
    }

    goBack(): void {
        this.location.back();
    }

    save(): void {
        if (this.todo) {
            // update todo with subTodos
            this.todo.arrtodos = this.subTodos.map(t => t.id);
            this.todoService.updateTodo(this.todo)  // update on db
                .subscribe(() => this.goBack());
        }
    }

    /////////////////////////////////

    deleteSubTodo(todo: Todo): void {
        this.subTodos = this.subTodos.filter(t => t !== todo);
    }

    addSubTodo(todo: Todo) {
        const dialogRef = this.dialog.open(TodoDialogComponent, {
            width: '360px',  // height: '740px',
            data: todo
        });

        dialogRef.afterClosed().subscribe(selected => {
            if (selected) {
                console.log('Dialog closed:', selected);
                // 추가하기 전 중복 검사
                const alreadyHas = this.subTodos.map(t => t.id).includes(selected.id);
                if (!alreadyHas) {
                    this.subTodos.push(selected);
                    todo.arrtodos = this.subTodos.map(t => t.id);   // update on detail
                }
            }
        });
    }
}
