import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne, ManyToMany, JoinTable
} from "typeorm";
import {User} from "./User";
import {Min} from "class-validator";
import {Product} from "./Product";

//annotation
@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    //products 多对多
    @ManyToMany(() => Product)
    //加在多对多的任意一个里
    @JoinTable()
    products: Product[]

    //user 多对1
    @ManyToOne(() => User, user=>user.orders)
    user: User;

    @Column('decimal', {precision: 5, scale: 2})
    @Min(1)
    price: number

    @Column('decimal', {precision: 5, scale: 2})
    @Min(1)
    taxRate: number

    @Column('decimal', {precision: 5, scale: 2})
    @Min(0)
    total: number

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
