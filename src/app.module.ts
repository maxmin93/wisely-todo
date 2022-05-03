import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
        TodoModule,
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: "todos.db",
            entities: [__dirname + "/**/*.entity{.ts,.js}"],
            synchronize: true,
            keepConnectionAlive: true     // when e2e test
        }),
        // https://docs.nestjs.com/recipes/serve-static#bootstrap
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'dist-client'),
            exclude: ['/api*'],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { };

// __dirname = {{SRC_ROOT}}/dist
// console.log([__dirname + "/**/*.entity{.ts,.js}"]);

// npm install --save @nestjs/typeorm typeorm sqlite3
// npm install --save class-validator class-transformer
// nest g module todos
// nest g class todos/todos.entity --flat --no-spec
// nest g service todos/todos --flat --no-spec
// nest g controller todo/todo --flat --no-spec
// nest g class todo/todo.dto --flat --no-spec
// nest g class todo/todo.factory --flat --no-spec

// ==> merge angular client
// npm install--save @nestjs/serve-static