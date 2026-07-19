import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export abstract class UsersRepository {
  abstract create(data: CreateUserDto): Promise<any>;

  abstract findAll(): Promise<any[]>;

  abstract findById(id: string): Promise<any | null>;

  abstract update(id: string, data: UpdateUserDto): Promise<any>;

  abstract delete(id: string): Promise<any>;
  abstract findByKeycloakId(keycloakId: string): Promise<any | null>;
  abstract sync(data: {
    keycloakId: string;
    email: string;
    name: string;
    groups: string[];
  }): Promise<any>;
}
