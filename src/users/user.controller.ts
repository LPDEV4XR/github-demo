import { Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Repo } from 'src/entities/repo.entity';
import { IsString, IsOptional, Length, IsAscii, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UserDTO {
  @Length(1, 64)
  user: string;
}

export class SearchDTO {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  id?: number;
  
  @IsOptional()
  @IsString()
  @IsAscii()
  name?: string;
  
  @IsOptional()
  @IsString()
  description?: string;
  
  @IsOptional()
  @IsString()
  @IsAscii()
  language?: string;
  
  @IsOptional()
  @IsString()
  username?: string;
}

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoint 1
  @Post('/users/:user')
  @HttpCode(204)
  async registerUserAndRepos(@Param() user: UserDTO ): Promise<void> {
    console.log(user)
    const $user = await this.userService.registerUserAndRepos(user.user);

    if ($user) {
      return;
    } else {
      throw new HttpException('No user with that username.', HttpStatus.NOT_FOUND);
    }
  }

  // Endpoint 2
  @Get('/repos/:user')
  @HttpCode(200)
  async getReposByUser(@Param() user: UserDTO): Promise<Repo[]> {
    return this.userService.getReposByUser(user.user);
  }

  // Endpoint 3
  @Get('/search')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchForRepos(@Query() query: SearchDTO): Promise<Repo[]> {
    return this.userService.searchForRepos(query);
  }
}
