import { Entity, Column, PrimaryGeneratedColumn, AfterLoad } from 'typeorm'
import { Exclude } from 'class-transformer';

@Entity('todo')
export class Todo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 200, nullable: false, unique: false })
    name: string;

    // Controller에서 ClassSerializerInterceptor로 Serialization 필터링
    // https://docs.nestjs.com/techniques/serialization#exclude-properties
    @Exclude()
    @Column('varchar', { nullable: true, unique: false })
    todos: string | undefined;

    // readonly
    protected arrtodos: number[] = undefined;

    // computed(virtual) column
    // https://pietrzakadrian.com/blog/virtual-column-solutions-for-typeorm
    @AfterLoad()
    getTodosArr() {
        try {
            this.arrtodos = this.todos ? this.todos.split(',').map(r => parseInt(r, 10)).filter(r => r) : undefined;
        }
        catch {
            return undefined;
        }
        return this.arrtodos;
    }

    // ** Multiple Construction 어떻게 안되나? ==> 안됨!
    // public constructor();
    // public constructor(dto: TodoDto);
};
