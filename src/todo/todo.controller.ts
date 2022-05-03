import { Controller, Post, Get, Put, Delete, Param, Request, Body, Query } from '@nestjs/common';
import { UseInterceptors, ClassSerializerInterceptor, ParseIntPipe } from '@nestjs/common';
import { Todo } from './todo.entity';
import { TodoDto, SearchDto } from './todo.dto';
import { TodoFactory } from './todo.factory';
import { TodoService } from './todo.service';

// default page size
const DEFAULT_PAGE_SIZE = 5;

@Controller('todo')
@UseInterceptors(ClassSerializerInterceptor)
export class TodoController {

    constructor(
        private todoService: TodoService,
        private todoFactory: TodoFactory
    ) { }

    ///////////////////////////////////////
    // select

    @Get('all')
    async getAll(): Promise<Todo[]> {
        return await this.todoService.getAll();
    }

    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
        return await this.todoService.getById(id);
    }

    @Get('ids/:ids')
    async getByIds(@Param('ids') ids: string): Promise<Todo[]> {
        const idsArr = this.todoFactory.convertToIds(ids);
        return await this.todoService.getByIds(idsArr);
    }

    @Get('pages/:page')
    async getAllByPage(
        @Param('page', ParseIntPipe) page: number,
        @Query('size') size: number
    ) {
        if (!this.todoFactory.isNumeric(size)) size = DEFAULT_PAGE_SIZE;
        return await this.todoService.getAllByPage(page, size);
    }

    @Get('candidates/:page')
    async getCandidatesByPage(
        @Param('page', ParseIntPipe) page: number,
        @Query('size') size: any,
        @Query('excludes') excludes: string         // ex) 11,12,13
    ) {
        if (!this.todoFactory.isNumeric(size)) size = DEFAULT_PAGE_SIZE;
        const excludeIds = this.todoFactory.convertToIds(excludes);
        return await this.todoService.getCandidatesByPage(page, size, excludeIds);
    }

    ///////////////////////////////////////
    // search

    @Post('search')
    async searchTodos(@Body() dto: SearchDto) {
        if (dto.term) {
            dto.term = dto.term.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9 ]/g, '');
        }
        if (dto.from_dt && this.todoFactory.isDateString(dto.from_dt.substring(0, 10))) {
            dto.from_dt = dto.from_dt.substring(0, 10);
        }
        if (dto.to_dt && this.todoFactory.isDateString(dto.to_dt.substring(0, 10))) {
            dto.to_dt = dto.to_dt.substring(0, 10);
        }
        return await this.todoService.searchTodos(dto);
    }

    ///////////////////////////////////////
    // create, update, delete

    @Post()
    async createTodo(@Body() dto: TodoDto) {
        const entity = this.todoFactory.toEntity(dto);
        return await this.todoService.create(entity);
    }

    @Put(':id')
    async updateTodo(@Param('id', ParseIntPipe) id: number, @Body() dto: TodoDto) {
        const entity = this.todoFactory.toEntity(dto);
        return await this.todoService.update(entity);
    }

    @Delete(':id')
    async deleteTodo(@Param('id', ParseIntPipe) id: number) {
        return await this.todoService.delete(id);
    }
}
