import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './entities/user.entity';
import { Repo } from './entities/repo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      host: process.env.PG_HOST || '0.0.0.0',
      username: process.env.PG_USER || 'root',
      password: process.env.PG_PASS || 'notroot',
      database: process.env.PG_DB || 'github-demo',
      synchronize: true,
      logging: true,
      entities: [ User, Repo ],
      autoLoadEntities: true
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
