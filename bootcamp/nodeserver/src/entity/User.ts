import {Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";
import {IsEmail, Length, Max, Min} from "class-validator";
import {Order} from "./Order";

//annotation
@Entity()
//唯一性
@Unique(['email'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(1, 100)
    firstName: string;

    @Column()
    @Length(1, 100)
    lastName: string;

    @Column({nullable: true})
    @Min(15)
    @Max(120)
    age: number;

    @Column()
    @IsEmail()
    @Length(5, 150)
    email: string;

    @Column()
    @Length(6, 100)
    password: string

    @Column({nullable: true, default: false})
    isStaff: boolean

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

    //relation
    //1对多，在order表中的user是对应关系
    @OneToMany(() => Order, order => order.user)
    orders: Order[]
}
