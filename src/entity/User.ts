import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  githubId: number;

  @Column()
  name: string;

  @Column()
  login: string;

  @Column()
  avatarUrl: string;
}
