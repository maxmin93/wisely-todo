import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnection, getConnectionManager } from 'typeorm';

import { Todo } from '../src/todo/todo.entity';
import { TodoModule } from '../src/todo/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('TodoController (e2e)', () => {
    let app: INestApplication;

    // __dirname = {{SRC_ROOT}}/test;
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                // AppModule,
                TodoModule,
                TypeOrmModule.forRoot({
                    type: "sqlite",
                    database: "todos.db",
                    entities: [__dirname + "/../src/**/*.entity{.ts,.js}"],
                    synchronize: true,
                    keepConnectionAlive: true     // when e2e test
                })
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    // Test 후
    afterAll(async () => {
        await getConnection().close();
        app.close();
    });

    ///////////////////////////////////////
    let deleteTodo, updateTodo: any;

    it('/api/todo/all (GET)', () => {
        return request(app.getHttpServer())
            .get('/api/todo/all')
            .expect(200)
            .then(res => {
                expect(res.body).toBeTruthy();
                expect(res.body.length).toBeGreaterThan(20);
                updateTodo = res.body[res.body.length - 1];
            });
    });

    it('/api/todo (POST)', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/todo')
            .send({
                name: 'create TODO in e2e'
            });
        console.log('created =', res.text);
        expect(res.body.success).toEqual(true);
        expect(res.body.todo).toBeTruthy();
        deleteTodo = res.body.todo;
    });

    it('/api/todo (PUT)', async () => {
        const res = await request(app.getHttpServer())
            .put(`/api/todo/${updateTodo.id}`)
            .send({
                id: updateTodo.id,
                name: updateTodo.name,
                arrtodos: [11, deleteTodo.id]
            });
        console.log('updated =', res.text);
        expect(res.body.success).toEqual(true);
        expect(res.body.todo).toBeTruthy();
    });

    it('/api/todo (DELETE)', async () => {
        const res = await request(app.getHttpServer())
            .delete(`/api/todo/${deleteTodo.id}`);
        console.log('deleted =', res.text);
        expect(res.body.success).toEqual(true);
        expect(res.body.todo).toBeTruthy();
    });

    // 단위 테스트로도, e2e 테스트로도 안된다. (왜지?)
    it('/api/todo/:id (UPDATE CASCADE)', async () => {
        const res = await request(app.getHttpServer())
            .get(`/api/todo/${updateTodo.id}`);
        console.log('updated =', res.text);
        expect(res.body).toBeTruthy();
        expect(res.body.arrtodos).toBeTruthy();
        expect(res.body.arrtodos.includes(deleteTodo.id)).toEqual(false);
    });
});
