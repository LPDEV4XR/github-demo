import { UserService } from './user.service';
import { Repo } from 'src/entities/repo.entity';
export declare class UserDTO {
    user: string;
}
export declare class SearchDTO {
    id?: number;
    name?: string;
    description?: string;
    language?: string;
    username?: string;
}
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    registerUserAndRepos(user: UserDTO): Promise<void>;
    getReposByUser(user: UserDTO): Promise<Repo[]>;
    searchForRepos(query: SearchDTO): Promise<Repo[]>;
}
