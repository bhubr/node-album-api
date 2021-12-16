import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Tag } from './Tag';

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

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}
