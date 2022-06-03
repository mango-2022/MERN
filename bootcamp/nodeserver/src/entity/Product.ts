import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import {Min} from "class-validator";
import {Unique} from "typeorm";

//annotation
@Entity()
@Unique(['slug'])
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string

    @Column()
    name: string

    @Column('decimal', {precision: 5, scale: 2})
    @Min(0)
    price: number

    @Column()
    description: string

    @Column()
    media: string

    // @Column()
    // status: string

    @Column({nullable: true, default: false})
    isActive: boolean

    //软删除
    @Column({nullable: true, default: false})
    isDelete: boolean

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updatedAt: Date
}
