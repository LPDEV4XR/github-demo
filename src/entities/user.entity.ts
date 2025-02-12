import { Entity, Column, OneToMany, JoinTable, type Relation, PrimaryGeneratedColumn } from 'typeorm';
import { Repo } from './repo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'integer' })
  UserID: string;

  // Username
  @Column({ type: 'varchar' })
  Login: string;

  @Column({ type: 'varchar' })
  Avatar: string;

  @OneToMany(type => Repo, repo => repo.User)
  @JoinTable()
  Repos: Relation<Repo>[];
}