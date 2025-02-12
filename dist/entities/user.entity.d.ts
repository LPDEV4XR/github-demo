import { type Relation } from 'typeorm';
import { Repo } from './repo.entity';
export declare class User {
    UserID: string;
    Login: string;
    Avatar: string;
    Repos: Relation<Repo>[];
}
