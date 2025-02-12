import { Entity, Column, ManyToOne, type Relation, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Repo {
  @PrimaryGeneratedColumn({ type: 'integer' })
  ID: number;

  @Column({ type: 'varchar' })
  Name: string;

  @Column({ type: 'varchar' })
  Description: string;

  @Column({ type: 'varchar' })
  URL: string;

  @Column({ type: 'varchar' })
  MainLanguage: string;

  @Column({ type: 'timestamp' })
  CreationDate: Date;

  @ManyToOne(type => User, user => user.Repos)
  User: Relation<User>;
}