import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from './Post';
import { Comment } from './Comment';
import { Notification } from './Notification';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: true })
  githubId: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column('varchar', { nullable: false , length: 60 })
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];
}
