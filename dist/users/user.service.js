"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const repo_entity_1 = require("../entities/repo.entity");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let UserService = class UserService {
    http;
    dataSource;
    constructor(http, dataSource) {
        this.http = http;
        this.dataSource = dataSource;
    }
    async registerUserAndRepos(user) {
        const transaction = this.dataSource.createQueryRunner();
        const Users = this.dataSource.getRepository(user_entity_1.User);
        let $user = await Users.findOne({ where: { Login: user }, relations: { Repos: true } });
        if ($user) {
            return true;
        }
        await transaction.connect();
        await transaction.startTransaction();
        try {
            let $req = await (0, rxjs_1.lastValueFrom)(this.http.get(`https://api.github.com/users/${user}/repos`).pipe((0, rxjs_1.map)(res => res.data)));
            if ($req == null || $req?.length == 0)
                return false;
            $user = new user_entity_1.User();
            $user.UserID = $req[0].owner.id;
            $user.Login = $req[0].owner.login;
            $user.Avatar = $req[0].owner.avatar_url;
            await transaction.manager.save($user);
            $req.forEach(async (data) => {
                const $repo = new repo_entity_1.Repo();
                $repo.ID = data.id;
                $repo.Name = data.name;
                $repo.Description = data.description || "No description.";
                $repo.URL = data.url;
                $repo.MainLanguage = data.language || "No main language";
                $repo.CreationDate = new Date(data.created_at);
                $repo.User = $user;
                await transaction.manager.save($repo);
            });
            await transaction.commitTransaction();
        }
        catch (error) {
            console.error(error);
            await transaction.rollbackTransaction();
        }
        finally {
            await transaction.release();
            return $user != null;
        }
    }
    async getReposByUser(user) {
        const Users = this.dataSource.getRepository(user_entity_1.User);
        let $user = await Users.findOne({ where: { Login: user }, relations: { Repos: true } });
        return $user ? [...$user.Repos] : [];
    }
    async searchForRepos(query) {
        const Repos = this.dataSource.getRepository(repo_entity_1.Repo);
        const Users = this.dataSource.getRepository(user_entity_1.User);
        const $repos = [];
        if (query.id == null && query.description == null && query.language == null && query.name == null && query.username == null)
            return [];
        if (query.id)
            (await Repos.find({ where: { ID: query.id } })).forEach(repo => { if (!$repos.find(x => x.ID == repo.ID)) {
                $repos.push(repo);
            } });
        if (query.description)
            (await Repos.find({ where: { Description: query.description } })).forEach(repo => { if (!$repos.find(x => x.ID == repo.ID)) {
                $repos.push(repo);
            } });
        if (query.language)
            (await Repos.find({ where: { MainLanguage: query.language } })).forEach(repo => { if (!$repos.find(x => x.ID == repo.ID)) {
                $repos.push(repo);
            } });
        if (query.name)
            (await Repos.find({ where: { Name: query.name } })).forEach(repo => { if (!$repos.find(x => x.ID == repo.ID)) {
                $repos.push(repo);
            } });
        if (query.username)
            (await Users.find({ where: { Login: query.username }, relations: { Repos: true } }))
                .map(user => user.Repos)[0]
                .forEach(repo => { if (!$repos.find(x => x.ID == repo.ID)) {
                $repos.push(repo);
            } });
        return $repos;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        typeorm_1.DataSource])
], UserService);
//# sourceMappingURL=user.service.js.map