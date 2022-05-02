import { Injectable } from '@nestjs/common';
import { Todo } from './todo.entity';
import { TodoDto } from './todo.dto';

@Injectable()
export class TodoFactory {

    // convert DTO to ENTITY
    toEntity(dto: TodoDto): Todo {
        const entity = new Todo();
        entity.id = dto.id;
        entity.name = dto.name;
        entity.todos = dto.arrtodos ? dto.arrtodos.join(',') : undefined;
        return entity;
    }

    // 굳이 전송시 dto를 사용할 필요가 있을까? 그냥 entity 출력하면 안되나?
    // 이거 사용하면 @AfterLoad 처리할 필요가 없었잖아. 감춰야할 컬럼이 많은 것도 아니고.
    // ==> Frontend 에서는 DTO 기준으로 처리하므로 받아오는 경우에만 처리하면 됨
    /*
    // convert ENTITY to DTO
    toDto(entity: Todo): TodoDto {
        const dto = new TodoDto();
        dto.id = entity.id;
        dto.name = entity.name;
        dto.arrtodos = entity.getTodosArr();
        return dto;
    }
    */


    ///////////////////////////////////////
    // utils

    public convertToIds(ids: string): number[] {
        try{
            return ids ? ids.split(',').map(r=>parseInt(r,10)).filter(r=>r) : [];
        }
        catch{
            return [];
        }
    }

    public isNumeric(val: any): boolean {
        return val && !isNaN(Number(val));
    }
}
