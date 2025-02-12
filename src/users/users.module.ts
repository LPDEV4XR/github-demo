import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HttpModule } from '@nestjs/axios';
import { Repo } from 'src/entities/repo.entity';

const Features = TypeOrmModule.forFeature([User, Repo]);

@Module({
    imports: [
        Features,
        HttpModule
    ],
    controllers: [ UserController ],
    providers: [ UserService ]
})
export class UsersModule {}
