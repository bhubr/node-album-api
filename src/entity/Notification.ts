import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

export enum NotificationType {
  LIKE = "like",
  COMMENT = "comment"
};

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  data: string;

  @Column({
    type: 'enum',
    enum: NotificationType
  })
  type: NotificationType;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
