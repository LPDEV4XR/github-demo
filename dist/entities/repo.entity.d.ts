import { type Relation } from 'typeorm';
import { User } from './user.entity';
export declare class Repo {
    ID: number;
    Name: string;
    Description: string;
    URL: string;
    MainLanguage: string;
    CreationDate: Date;
    User: Relation<User>;
}
