import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { UsersRepository } from './repositories/users.repository';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto) {
    try {
      return await this.usersRepository.create(dto);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already exists');
      }

      throw error;
    }
  }

  async sync(user: any) {
    return this.usersRepository.sync({
      keycloakId: user.id,
      email: user.email,
      name: user.username,
      groups: user.groups,
    });
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  update(id: string, dto: UpdateUserDto) {
    return this.usersRepository.update(id, dto);
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
