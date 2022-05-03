import { Injectable, Logger } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodoResponseDto, TodoPageDto, SearchDto } from './todo.dto';
import * as moment from 'moment';

@Injectable()
export class TodoService {

    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>
    ) { }

    ///////////////////////////////////////
    // select

    async getAll(): Promise<Todo[]> {
        return await this.todoRepository.find();
    }

    async existIds(ids: number[]): Promise<number[]> {
        const todos = await this.todoRepository.findByIds(ids);
        return todos.map(t => t.id);
    }

    async getById(id: number): Promise<Todo> {
        return await this.todoRepository.findOne(id);
    }

    async getByIds(ids: number[]): Promise<Todo[]> {
        return await this.todoRepository.findByIds(ids);
    }

    async getAllByPage(page: number, size: number): Promise<TodoPageDto> {
        const total = await this.todoRepository.count();
        const todos = await this.todoRepository.createQueryBuilder('todo')
            .offset(page * size)    // skip
            .limit(size)            // take
            .getMany();
        return new TodoPageDto(total, todos);
    }

    // excludes: 기준 id와 이미 추가된 sub-ids
    private queryCandidates(excludeIds: number[]) {
        return this.todoRepository.createQueryBuilder('todo')
            .where(`todos is null and id not in (${excludeIds.join(',')})`);
    }

    async getCandidatesByPage(page: number, size: number, excludeIds: number[]): Promise<TodoPageDto> {
        const total = await this.queryCandidates(excludeIds).getCount();
        const todos = await this.queryCandidates(excludeIds)
            .offset(page * size)    // skip
            .limit(size)            // take
            .getMany();
        return new TodoPageDto(total, todos);
    }

    ///////////////////////////////////////
    // search by term

    private queryByConditions(dto: SearchDto) {
        const conditions: string[] = [];
        if (dto.term) {
            conditions.push(`name like '%${dto.term}%'`);
        }
        if (dto.done != undefined) {
            if (dto.done) conditions.push('done != 0');
            else conditions.push('done = 0');
        }
        if (dto.from_dt) {  // equal or greater than
            conditions.push(`created > '${dto.from_dt}'`);
        }
        if (dto.to_dt) {    // less than
            conditions.push(`created < '${dto.to_dt}'`);
        }
        Logger.log(`search: ${conditions.join(' and ')}`);
        return this.todoRepository.createQueryBuilder('todo')
            .where(conditions.join(' and '));
    }

    async searchTodos(dto: SearchDto) {
        const total = await this.queryByConditions(dto).getCount();
        const todos = await this.queryByConditions(dto)
            .offset(dto.page * dto.size)    // skip
            .limit(dto.size)                // take
            .getMany();
        return new TodoPageDto(total, todos);
    }

    ///////////////////////////////////////
    // create, update, delete

    async create(todo: Todo) {
        try {
            Logger.log(`createTodo: name=${todo.name}`);
            return new TodoResponseDto(await this.todoRepository.save(todo));
        }
        catch (error) {
            return new TodoResponseDto();
        }
    }

    async update(todo: Todo) {
        // ** 사용되는 쿼리문이 다른거 같다. (update 테이블명 set 필드명=값, ...)
        //    계산 필드를 생성할 수 없다며 EntityColumnNotFound 오류 발생
        //    ==> No entity column "arrtodos" was found
        //    <참고> https://if1live.github.io/posts/typeorm-entity-proxy-for-save/
        //
        // const result = await this.todoRepository.update(todo.id, todo);
        // if( result.affected && result.affected > 0 ){
        //     return new TodoResponseDto( await this.todoRepository.findOne(id) );
        // }
        // return new TodoResponseDto();

        // save를 사용하니 아무 문제 없다. (왜지?)
        todo.updated = moment().format("YYYY-MM-DD HH:mm:ss");    // localtime
        try {
            Logger.log(`updateTodo: id=${todo.id}`);
            return new TodoResponseDto(await this.todoRepository.save(todo));
        }
        catch (error) {
            return new TodoResponseDto();
        }
    }

    // cascade 삭제 과정 필요
    // 1) 대상 삭제
    // 2) todos 에 포함된 id 제거 (update)
    async delete(id: number) {
        const todo = await this.todoRepository.findOne(id);
        const result = await this.todoRepository.delete(id);
        // OneToMany 릴레이션 사용시 자동으로 cascade 삭제 처리되는데
        // 그렇게 안했기 때문에 수작업으로 처리해야 한다.
        // ** 기다릴 필요 없음 (참고: setTImeout 안됨)
        this.updateTodosByDelete(id).then();
        if (result.affected && result.affected > 0) {
            return new TodoResponseDto(todo);
        }
        return new TodoResponseDto();
    }

    async updateTodosByDelete(id: number) {
        // like 문이라서 완전히 일치하지 않는다. filter 작업 필요
        const selected = await this.todoRepository.createQueryBuilder('todo')
            .where(`todos is not null and todos like '%${id}%'`)
            .getMany();
        const updated = selected
            .filter(t => t.todos.split(',').filter(r => r == id.toString()))
            .map(t => {
                const ids = t.todos.split(',').filter(r => r != id.toString());
                t.todos = ids ? ids.join(',') : undefined;
                return this.update(t);
            });
        Promise.all(updated).then(values => {
            const updatedIds = values.filter(r => r && r.todo).map(r => r.todo.id);
            Logger.log(`deleteTodo: id=${id}, updated cascade=[${updatedIds}]`);
        });
    }
}
