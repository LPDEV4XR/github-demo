import { DataSource } from 'typeorm';
import { Repo } from 'src/entities/repo.entity';
import { HttpService } from '@nestjs/axios';
import { SearchDTO } from './user.controller';
export declare class UserService {
    private http;
    private readonly dataSource;
    constructor(http: HttpService, dataSource: DataSource);
    registerUserAndRepos(user: string): Promise<boolean>;
    getReposByUser(user: string): Promise<Repo[]>;
    searchForRepos(query: SearchDTO): Promise<Repo[]>;
}
