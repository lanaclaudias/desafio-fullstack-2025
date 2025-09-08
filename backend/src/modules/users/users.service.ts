import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: UserEntity[] = [];

  create(createUserDto: CreateUserDto): UserEntity {
    const newUser = new UserEntity(createUserDto as any);
    Object.assign(newUser, createUserDto);
    this.users.push(newUser);
    return newUser;
  }

  findAll(): UserEntity[] {
    return this.users;
  }

  findOne(id: number): UserEntity | undefined {
    return this.users.find(user => user.id === id);
  }

  update(id: number, updateUserDto: Partial<CreateUserDto>): UserEntity | undefined {
    const user = this.findOne(id);
    if (user) {
      Object.assign(user, updateUserDto);
    }
    return user;
  }

  remove(id: number): void {
    this.users = this.users.filter(user => user.id !== id);
  }
}