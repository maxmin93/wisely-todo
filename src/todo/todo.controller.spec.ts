import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { TodoDto, TodoResponseDto, TodoPageDto } from './todo.dto';
import { TodoFactory } from './todo.factory';
import { getConnection, getConnectionManager } from 'typeorm';
import { delay, last } from 'rxjs';

describe('TodoController', () => {
    let todoController: TodoController;

    //__dirname = {{SRC_ROOT}}/src/todo
    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forFeature([Todo]),
                TypeOrmModule.forRoot({
                    type: "sqlite",
                    database: "todos.db",
                    entities: [__dirname + "/**/*.entity{.ts,.js}"],
                    synchronize: true,
                    keepConnectionAlive: true     // when e2e test
                })
            ],
            providers: [TodoService, TodoFactory],
            controllers: [TodoController]
        }).compile();

        todoController = app.get<TodoController>(TodoController);
    });

    afterAll(async () => {
        await getConnection().close();
    });

    describe('select TODO', () => {

        it('/api/todo/all', async () => {
            const todos = await todoController.getAll();
            console.log('todos.length =', todos.length);
            expect(todos.length).toBeGreaterThan(20);
        });

        it('/api/todo/11', () => {
            todoController.getById(11).then(todo => {
                expect(todo.id).toBe(11);
            });
        });

        it('/api/todo/ids/11,12', () => {
            todoController.getByIds('11,12').then(todos => {
                expect(todos.length).toEqual(2);
            });
        });

        it('/api/todo/pages/0', () => {
            todoController.getAllByPage(0, 5).then(dto => {
                expect(dto.todos.length).toEqual(5);
                expect(dto.todos[0].id).toBe(11);
            });
        });

        it('/api/todo/candidates/0?excludes=11', () => {
            todoController.getCandidatesByPage(0, 5, '11').then(dto => {
                expect(dto.todos.length).toEqual(5);
                expect(dto.todos[0].id).toBe(12);
            });
        });
    });

    describe('create, update, delete TODO', () => {
        let deleteId, updateId: number;

        it('create Todo{ name }', async () => {
            const dto = new TodoDto();
            dto.name = 'hello, new Todo';
            dto.done = false;
            const res = await todoController.createTodo(dto);
            expect(res.success).toEqual(true);
            expect(res.todo).toBeTruthy();
        });

        it('update Todo{ arrtodos }', async () => {
            const todos = await todoController.getAll();
            console.log(`todos[-2]=${todos[todos.length - 2].id}, todos[-1]=${todos[todos.length - 1].id}`);
            deleteId = todos[todos.length - 1].id;
            updateId = todos[todos.length - 2].id;

            const dto = new TodoDto();
            dto.id = todos[todos.length - 2].id;
            dto.name = todos[todos.length - 2].name;
            dto.done = todos[todos.length - 2].done;
            dto.arrtodos = [11, todos[todos.length - 1].id];
            const res = await todoController.updateTodo(dto.id, dto);
            expect(res.success).toEqual(true);
            expect(res.todo).toBeTruthy();
        });

        it(`delete Todo{ id }`, async () => {
            console.log(`deleteId=${deleteId}`);
            const res = await todoController.deleteTodo(deleteId);
            expect(res.success).toEqual(true);
            expect(res.todo).toBeTruthy();
        });

        // 단위 테스트로는 안된다! e2e로도 안된다. (왜지?)
        it(`update Todo{ arrtodos } cascade by delete`, async () => {
            // await delay(1000);
            const todo = await todoController.getById(updateId);
            console.log('updated =', todo);
            expect(todo).toBeTruthy();
            expect(todo.todos).toBeTruthy();
            expect(todo.todos.includes(deleteId.toString())).toEqual(false);
        });
    });
});
