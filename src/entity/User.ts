import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
