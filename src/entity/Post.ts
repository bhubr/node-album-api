import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from './Tag';
import { User } from './User';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  description: string;

  @Column()
  picture: string;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @CreateDateColumn()
  createdAt: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}
