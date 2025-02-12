import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Repo } from 'src/entities/repo.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { SearchDTO } from './user.controller';

@Injectable()
export class UserService {
	constructor(
		private http: HttpService,
		private readonly dataSource: DataSource
	) {}
	
	// Endpoint 1
	async registerUserAndRepos(user: string): Promise<boolean> {
		const transaction = this.dataSource.createQueryRunner();
		const Users = this.dataSource.getRepository(User);
		
		let $user = await Users.findOne({ where: { Login: user }, relations: { Repos: true } });
		
		if ($user) {
			return true; 
		}
		
		await transaction.connect();
		await transaction.startTransaction();
		
		try {
			let $req = await lastValueFrom(this.http.get(`https://api.github.com/users/${user}/repos`).pipe(map(res => res.data)));
			
			if ($req == null || $req?.length == 0) return false;
			
			$user = new User();
			$user.UserID = $req[0].owner.id;
			$user.Login = $req[0].owner.login;
			$user.Avatar = $req[0].owner.avatar_url;
			
			await transaction.manager.save($user);
			
			$req.forEach(async data => {
				// Accounting for the fact that the entries are only registered once,
				// I can set a scheduler to update them later, I don't need to verify
				// if the repo exists, since when I initialize it, accounting that
				// each repo only has one user (can add multiple users per repo later)
				// make the need to check if the repo exists uneeded.
				
				const $repo = new Repo();
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
		} catch (error) {
			console.error(error);
			await transaction.rollbackTransaction();
		} finally {
			await transaction.release();
			
			return $user != null;
		}
	}
	
	// Endpoint 2
	async getReposByUser(user: string): Promise<Repo[]> {
		const Users = this.dataSource.getRepository(User);
		let $user = await Users.findOne({ where: { Login: user }, relations: { Repos: true } });
		
		return $user ? [ ...$user.Repos ] : []; 
	}
	
	// Endpoint 3
	// There where some more edge cases I wanted to cover (namely description contains, 
	// no case words, phrases splitting) but due to time constraints, I'll adjourn them.
	async searchForRepos(query: SearchDTO): Promise<Repo[]> {
		const Repos = this.dataSource.getRepository(Repo);
		const Users = this.dataSource.getRepository(User);
		const $repos: Repo[] = [];

		if (query.id == null && query.description == null && query.language == null && query.name == null && query.username == null) return [];

		if (query.id)
			(await Repos.find({ where: { ID: query.id } })).forEach(repo => { if(!$repos.find(x => x.ID == repo.ID)) {$repos.push(repo)} });
		
		if (query.description)
			(await Repos.find({ where: { Description: query.description } })).forEach(repo => { if(!$repos.find(x => x.ID == repo.ID)) {$repos.push(repo)} });
		
		if (query.language)
			(await Repos.find({ where: { MainLanguage: query.language } })).forEach(repo => { if(!$repos.find(x => x.ID == repo.ID)) {$repos.push(repo)} });
		
		if (query.name)
			(await Repos.find({ where: { Name: query.name } })).forEach(repo => { if(!$repos.find(x => x.ID == repo.ID)) {$repos.push(repo)} });
		
		if (query.username)
			(await Users.find({ where: { Login: query.username }, relations: { Repos: true } }))
			.map(user => user.Repos)[0]
			.forEach(repo => { if(!$repos.find(x => x.ID == repo.ID)) {$repos.push(repo)} });

		return $repos;
	}
}