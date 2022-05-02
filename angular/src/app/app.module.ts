import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodosComponent } from './todos/todos.component';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { TodoSearchComponent } from './todo-search/todo-search.component';

// Angular Material Components
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TodoDialogComponent } from './todo-dialog/todo-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        TodosComponent,
        TodoDetailComponent,
        TodoSearchComponent,
        TodoDialogComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,

        NoopAnimationsModule,
        // Materials
        MatInputModule,
        MatDialogModule,
        MatPaginatorModule,
        MatTooltipModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [AppComponent, TodoDialogComponent],
})
export class AppModule { }
