import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/database';

import { UsersRepository } from './users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },

      data,
    });
  }

  delete(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  findByKeycloakId(keycloakId: string) {
    return this.prisma.user.findUnique({
      where: {
        keycloakId,
      },
    });
  }

  async sync(data: {
    keycloakId: string;
    email: string;
    name: string;
    groups: string[];
  }) {
    const existing = await this.prisma.user.findUnique({
      where: {
        keycloakId: data.keycloakId,
      },
    });

    if (existing) {
      return this.prisma.user.update({
        where: {
          id: existing.id,
        },
        data: {
          email: data.email,
          name: data.name,
          groups: data.groups,
        },
      });
    }

    return this.prisma.user.create({
      data,
    });
  }
}
