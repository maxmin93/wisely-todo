import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Todo, TodoSearch } from '../services/todo';
import { TodoService } from '../services/todo-api.service';

@Component({
    selector: 'app-todo-search',
    templateUrl: './todo-search.component.html',
    styleUrls: ['./todo-search.component.css']
})
export class TodoSearchComponent implements OnInit {

    @Input() searchOptions!: TodoSearch;

    @Output() searchEvent = new EventEmitter<TodoSearch>();

    panelOpenState = false;

    searchForm = new FormGroup({
        done: new FormControl(false),
        term: new FormControl(''),
        from_dt: new FormControl(),
        to_dt: new FormControl(),
    });

    constructor() { }

    ngOnInit(): void {
        if (this.searchOptions) {
            this.searchForm.get('done')?.setValue(this.searchOptions.done);
            this.searchForm.get('term')?.setValue(this.searchOptions.term);
            this.searchForm.get('from_dt')?.setValue(this.searchOptions.from_dt);
            this.searchForm.get('to_dt')?.setValue(this.searchOptions.to_dt);
        }
    }

    clear(): void {
        // this.searchTerms.next(term);
        this.searchForm = new FormGroup({
            done: new FormControl(false),
            term: new FormControl(''),
            from_dt: new FormControl(),
            to_dt: new FormControl(),
        });
        const dto = {
            page: 0,
            size: 5,
        } as TodoSearch;
        this.searchEvent.emit(dto);
        this.panelOpenState = false;
    }

    doSearch(): void {
        const dto = {
            page: 0,
            size: 5,
        } as TodoSearch;
        if (this.searchForm.get('done')?.dirty)
            dto.done = this.searchForm.get('done')?.value ? true : false;
        if (this.searchForm.get('term')?.dirty)
            dto.term = this.searchForm.get('term')?.value;
        if (this.searchForm.get('from_dt')?.dirty)
            dto.from_dt = this.searchForm.get('from_dt')?.value;
        if (this.searchForm.get('to_dt')?.dirty)
            dto.to_dt = this.searchForm.get('to_dt')?.value;
        this.searchEvent.emit(dto);
        this.panelOpenState = false;
    }

}
